/**
 * ============================================================================
 * INTERACTIVE STORY ENGINE — GAME ASSET MANAGER
 * ============================================================================
 * Handles asynchronous preloading, runtime alpha-keying (white background removal
 * with edge-feathering), sprite caching, and 2.5D anchor-based rendering.
 */

(function(root) {
  'use strict';

  class StoryAssetManager {
    constructor() {
      this.images = new Map();
      this.processedCanvases = new Map();
      this.loadingPromises = new Map();
      this.isLoaded = false;
    }

    /**
     * Preloads an image and optionally transparentizes its background.
     * @param {string} key Unique identifier for the asset
     * @param {string} src Relative or absolute URL to the image file
     * @param {object} options Configuration for processing (keyWhite, threshold, feather)
     */
    loadImage(key, src, options = {}) {
      if (this.images.has(key)) {
        return Promise.resolve(this.images.get(key));
      }
      if (this.loadingPromises.has(key)) {
        return this.loadingPromises.get(key);
      }

      const promise = new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          this.images.set(key, img);

          if (options.keyWhite) {
            try {
              const processed = this._processWhiteTransparency(
                img,
                options.threshold || 235,
                options.feather || 28
              );
              this.processedCanvases.set(key, processed);
            } catch (err) {
              console.warn(`[AssetManager] Could not transparentize ${key}:`, err);
            }
          }

          resolve(img);
        };

        img.onerror = (err) => {
          console.warn(`[AssetManager] Failed to load image: ${key} (${src})`, err);
          resolve(null);
        };

        img.src = src;
      });

      this.loadingPromises.set(key, promise);
      return promise;
    }

    /**
     * Removes white/light background using boundary-seeded flood fill,
     * preserving all interior white details (fur, aprons, dials), and auto-crops.
     */
    _processWhiteTransparency(img, threshold = 220) {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let qHead = 0;
      let qTail = 0;

      const isBgColor = (idx) => {
        const r = data[idx * 4];
        const g = data[idx * 4 + 1];
        const b = data[idx * 4 + 2];
        return (r > threshold && g > threshold && b > threshold);
      };

      // Seed all 4 outer edges
      for (let x = 0; x < w; x++) {
        const topIdx = x;
        const botIdx = (h - 1) * w + x;
        if (isBgColor(topIdx) && !visited[topIdx]) { visited[topIdx] = 1; queue[qTail++] = topIdx; }
        if (isBgColor(botIdx) && !visited[botIdx]) { visited[botIdx] = 1; queue[qTail++] = botIdx; }
      }
      for (let y = 0; y < h; y++) {
        const leftIdx = y * w;
        const rightIdx = y * w + (w - 1);
        if (isBgColor(leftIdx) && !visited[leftIdx]) { visited[leftIdx] = 1; queue[qTail++] = leftIdx; }
        if (isBgColor(rightIdx) && !visited[rightIdx]) { visited[rightIdx] = 1; queue[rightIdx] = 1; queue[qTail++] = rightIdx; }
      }

      // Breadth-First Search Flood Fill across contiguous background
      const fillThresh = Math.max(195, threshold - 12);
      while (qHead < qTail) {
        const curr = queue[qHead++];
        const cx = curr % w;
        const cy = Math.floor(curr / w);

        const neighbors = [];
        if (cx > 0) neighbors.push(curr - 1);
        if (cx < w - 1) neighbors.push(curr + 1);
        if (cy > 0) neighbors.push(curr - w);
        if (cy < h - 1) neighbors.push(curr + w);

        for (let i = 0; i < neighbors.length; i++) {
          const n = neighbors[i];
          if (!visited[n]) {
            const nr = data[n * 4];
            const ng = data[n * 4 + 1];
            const nb = data[n * 4 + 2];
            if (nr > fillThresh && ng > fillThresh && nb > fillThresh) {
              visited[n] = 1;
              queue[qTail++] = n;
            }
          }
        }
      }

      // Clear visited background pixels and compute tight content bounds
      let minX = w, maxX = 0, minY = h, maxY = 0;
      for (let idx = 0; idx < w * h; idx++) {
        if (visited[idx]) {
          data[idx * 4 + 3] = 0;
        } else {
          const x = idx % w;
          const y = Math.floor(idx / w);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Auto-crop to tight bounding box so feet/base align perfectly with 2.5D floor
      const cropW = Math.max(1, maxX - minX + 1);
      const cropH = Math.max(1, maxY - minY + 1);
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      return cropCanvas;
    }

    /**
     * Gets drawable image source (processed offscreen canvas or original image).
     */
    get(key) {
      if (this.processedCanvases.has(key)) {
        return this.processedCanvases.get(key);
      }
      return this.images.get(key) || null;
    }

    /**
     * Checks if asset is loaded.
     */
    has(key) {
      return this.processedCanvases.has(key) || this.images.has(key);
    }

    /**
     * Renders a sprite with 2.5D bottom-center anchoring, ground shadow, and optional flipping.
     */
    drawSprite(ctx, key, x, y, width, height, options = {}) {
      const source = this.get(key);
      const anchorX = options.anchorX !== undefined ? options.anchorX : 0.5;
      const anchorY = options.anchorY !== undefined ? options.anchorY : 1.0;
      const flipX = Boolean(options.flipX);
      const bobY = options.bobY || 0;
      const rotation = options.rotation || 0;
      const alpha = options.alpha !== undefined ? options.alpha : 1.0;
      const shadow = options.shadow !== undefined ? options.shadow : true;
      const shadowRadiusX = options.shadowRadiusX || (width * 0.38);
      const shadowRadiusY = options.shadowRadiusY || (width * 0.14);

      ctx.save();
      if (alpha < 1.0) ctx.globalAlpha *= alpha;

      // 1. Soft 2.5D Ground Shadow at foot/base
      if (shadow) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.beginPath();
        ctx.ellipse(x, y - 2, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Sprite if loaded
      if (source) {
        ctx.save();
        ctx.translate(x, y + bobY);
        if (rotation !== 0) ctx.rotate(rotation);
        if (flipX) ctx.scale(-1, 1);

        const drawX = -width * anchorX;
        const drawY = -height * anchorY;

        ctx.drawImage(source, drawX, drawY, width, height);
        ctx.restore();
      } else {
        // Fallback procedural rendering if still loading
        this._drawFallback(ctx, key, x, y, width, height, options);
      }

      ctx.restore();
    }

    /**
     * High-fidelity stylized procedural fallback while assets stream in.
     */
    _drawFallback(ctx, key, x, y, width, height, options) {
      ctx.save();
      const anchorX = options.anchorX !== undefined ? options.anchorX : 0.5;
      const anchorY = options.anchorY !== undefined ? options.anchorY : 1.0;
      ctx.translate(x - width * anchorX, y - height * anchorY);

      if (key.includes('alice')) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(width * 0.25, height * 0.35, width * 0.5, height * 0.55, 12);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.25, width * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (key.includes('rabbit')) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.5, width * 0.35, height * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(width * 0.3, height * 0.4, width * 0.4, height * 0.35);
      } else {
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.4, width * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    /**
     * Preloads all Alice in Wonderland Chapter 1 assets.
     */
    preloadAliceRabbitWoods() {
      const list = [
        {
          key: 'bg_forest_canopy',
          src: 'assets/alice/environments/rabbit_woods/bg_forest_canopy.jpg',
          options: { keyWhite: false }
        },
        {
          key: 'rabbit_hole_oak',
          src: 'assets/alice/environments/rabbit_woods/rabbit_hole_oak.jpg',
          options: { keyWhite: true, threshold: 238, feather: 32 }
        },
        {
          key: 'fairytale_oak',
          src: 'assets/alice/environments/rabbit_woods/fairytale_oak.jpg',
          options: { keyWhite: true, threshold: 236, feather: 30 }
        },
        {
          key: 'toadstools',
          src: 'assets/alice/environments/rabbit_woods/toadstools.jpg',
          options: { keyWhite: true, threshold: 236, feather: 28 }
        },
        {
          key: 'alice_sprite',
          src: 'assets/alice/characters/alice_sprite.jpg',
          options: { keyWhite: true, threshold: 235, feather: 26 }
        },
        {
          key: 'white_rabbit_sprite',
          src: 'assets/alice/characters/white_rabbit_sprite.jpg',
          options: { keyWhite: true, threshold: 238, feather: 28 }
        },
        {
          key: 'pocket_watch',
          src: 'assets/alice/objects/pocket_watch.jpg',
          options: { keyWhite: true, threshold: 238, feather: 26 }
        },
        {
          key: 'mossy_boulder',
          src: 'assets/alice/environments/rabbit_woods/mossy_boulder.jpg',
          options: { keyWhite: true, threshold: 236, feather: 28 }
        },
        {
          key: 'wooden_signpost',
          src: 'assets/alice/environments/rabbit_woods/wooden_signpost.jpg',
          options: { keyWhite: true, threshold: 236, feather: 28 }
        },
        {
          key: 'storybook_pond',
          src: 'assets/alice/environments/rabbit_woods/storybook_pond.jpg',
          options: { keyWhite: true, threshold: 236, feather: 28 }
        }
      ];

      const promises = list.map(item => this.loadImage(item.key, item.src, item.options));
      return Promise.all(promises).then(() => {
        this.isLoaded = true;
        console.log('[AssetManager] All Rabbit Woods visual benchmark assets loaded & processed.');
      });
    }
  }

  root.StoryAssetManager = new StoryAssetManager();
})(window);
