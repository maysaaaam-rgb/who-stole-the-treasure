/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Sprite Manager
 * Handles preloading, caching, animation frames, base64 bundling, and drawing
 */
class SpriteManager {
  constructor(basePath = 'assets/sprites/') {
    this.basePath = basePath;
    this.images = new Map();
    this.animations = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.isLoaded = false;
  }

  loadImage(url) {
    if (this.images.has(url)) {
      return Promise.resolve(this.images.get(url));
    }
    this.totalAssets++;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(url, img);
        this.loadedAssets++;
        resolve(img);
      };
      img.onerror = () => {
        this.loadedAssets++;
        resolve(null);
      };
      img.src = url;
    });
  }

  getImage(url) {
    return this.images.get(url) || null;
  }

  getLoadProgress() {
    if (this.totalAssets === 0) return 1.0;
    return Math.min(1.0, this.loadedAssets / this.totalAssets);
  }

  async loadAll() {
    const promises = [];
    const isBundled = typeof window !== 'undefined' && window.BUNDLED_SPRITES;

    // 1. Background
    const bgUrl = isBundled && window.BUNDLED_SPRITES['bg'] 
      ? window.BUNDLED_SPRITES['bg'] 
      : `${this.basePath}png_shapes/30.png`;
    promises.push(this.loadImage(bgUrl));
    this.bgUrl = bgUrl;

    // 2. Character Animations configuration
    const animConfig = {
      // Cat (Fleabag)
      cat_idle: { path: 'assembled/sprites/DefineSprite_288', count: 37, fps: 24 },
      cat_windup: { path: 'assembled/sprites/DefineSprite_325', count: 25, fps: 24 },
      cat_release: { path: 'assembled/sprites/DefineSprite_325', count: 70, fps: 24 },
      cat_hit_hurt: { path: 'assembled/sprites/DefineSprite_289', count: 5, fps: 12 },
      cat_victory: { path: 'assembled/sprites/DefineSprite_405', count: 22, fps: 24 },
      cat_meter: { path: 'assembled/sprites/DefineSprite_257', count: 37, fps: 24 },

      // Dog (Mutt)
      dog_idle: { path: 'assembled/sprites/DefineSprite_170', count: 28, fps: 24 },
      dog_windup: { path: 'assembled/sprites/DefineSprite_205', count: 25, fps: 24 },
      dog_release: { path: 'assembled/sprites/DefineSprite_205', count: 70, fps: 24 },
      dog_hit_hurt: { path: 'assembled/sprites/DefineSprite_171', count: 5, fps: 12 },
      dog_victory: { path: 'assembled/sprites/DefineSprite_418', count: 12, fps: 24 },
      dog_meter: { path: 'assembled/sprites/DefineSprite_118', count: 37, fps: 24 },

      // Wind Indicator
      wind: { path: 'assembled/sprites/DefineSprite_216', count: 16, fps: 0 },

      // Projectiles
      proj_bone: { path: 'assembled/sprites/DefineSprite_92', count: 8, fps: 24 },
      proj_can: { path: 'assembled/sprites/DefineSprite_220', count: 18, fps: 24 },
      proj_bomb: { path: 'assembled/sprites/DefineSprite_409', count: 8, fps: 24 },
      bandage_heal: { path: 'assembled/sprites/DefineSprite_323', count: 18, fps: 24 },

      // Health Bars
      dog_bar: { path: 'assembled/sprites/DefineSprite_208', count: 29, fps: 0 },
      cat_bar: { path: 'assembled/sprites/DefineSprite_209', count: 31, fps: 0 }
    };

    for (const [key, conf] of Object.entries(animConfig)) {
      this.animations[key] = {
        frames: [],
        count: conf.count,
        fps: conf.fps
      };
      for (let i = 1; i <= conf.count; i++) {
        let url;
        const bundleKey = `${key}_${i}`;
        if (isBundled && window.BUNDLED_SPRITES[bundleKey]) {
          url = window.BUNDLED_SPRITES[bundleKey];
        } else {
          url = `${this.basePath}${conf.path}/${i}.png`;
        }
        this.animations[key].frames.push(url);
        promises.push(this.loadImage(url));
      }
    }

    // 3. Power-Up Buttons
    const buttonConfig = [
      { name: 'dog_x2', folder: 'DefineButton2_180' },
      { name: 'dog_bomb', folder: 'DefineButton2_183' },
      { name: 'dog_gas', folder: 'DefineButton2_186' },
      { name: 'dog_heal', folder: 'DefineButton2_189' },
      { name: 'cat_x2', folder: 'DefineButton2_192' },
      { name: 'cat_bomb', folder: 'DefineButton2_194' },
      { name: 'cat_gas', folder: 'DefineButton2_196' },
      { name: 'cat_heal', folder: 'DefineButton2_198' }
    ];

    this.buttons = {};
    for (const btn of buttonConfig) {
      const upKey = `${btn.name}_up`;
      const overKey = `${btn.name}_over`;
      const downKey = `${btn.name}_down`;

      this.buttons[btn.name] = {
        up: isBundled && window.BUNDLED_SPRITES[upKey] ? window.BUNDLED_SPRITES[upKey] : `${this.basePath}assembled/buttons/${btn.folder}/1_up.png`,
        over: isBundled && window.BUNDLED_SPRITES[overKey] ? window.BUNDLED_SPRITES[overKey] : `${this.basePath}assembled/buttons/${btn.folder}/2_over.png`,
        down: isBundled && window.BUNDLED_SPRITES[downKey] ? window.BUNDLED_SPRITES[downKey] : `${this.basePath}assembled/buttons/${btn.folder}/3_down.png`
      };
      promises.push(this.loadImage(this.buttons[btn.name].up));
      promises.push(this.loadImage(this.buttons[btn.name].over));
      promises.push(this.loadImage(this.buttons[btn.name].down));
    }

    // 4. Props & Shapes
    const shapes = ['406.png', '407.png', '408.png', '226.png', '108.png', '12.png'];
    for (const s of shapes) {
      const baseKey = `shape_${s.replace('.png', '')}`;
      const url = isBundled && window.BUNDLED_SPRITES[baseKey] 
        ? window.BUNDLED_SPRITES[baseKey] 
        : `${this.basePath}png_shapes/${s}`;
      promises.push(this.loadImage(url));
    }

    await Promise.all(promises);
    this.isLoaded = true;
  }

  drawFrame(ctx, animKey, frameIndex, x, y, options = {}) {
    const anim = this.animations[animKey];
    if (!anim || !anim.frames.length) return false;

    const clampedIndex = Math.max(0, Math.min(anim.frames.length - 1, Math.floor(frameIndex)));
    const imgUrl = anim.frames[clampedIndex];
    const img = this.getImage(imgUrl);
    if (!img) return false;

    const scale = options.scale !== undefined ? options.scale : 1.0;
    const flipX = options.flipX || false;
    const alpha = options.alpha !== undefined ? options.alpha : 1.0;
    const rotation = options.rotation || 0;

    ctx.save();
    if (alpha < 1.0) ctx.globalAlpha = alpha;

    ctx.translate(x, y);
    if (rotation !== 0) ctx.rotate(rotation);
    if (flipX) ctx.scale(-1, 1);

    const anchorX = options.anchorX !== undefined ? options.anchorX : 0.5;
    const anchorY = options.anchorY !== undefined ? options.anchorY : 1.0;

    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = -drawW * anchorX;
    const drawY = -drawH * anchorY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
    return true;
  }

  drawBackground(ctx, width = 600, height = 430) {
    const bg = this.getImage(this.bgUrl) || this.getImage(`${this.basePath}png_shapes/30.png`);
    if (bg) {
      ctx.drawImage(bg, 0, 0, width, height);
    } else {
      // High-fidelity fallback
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      skyGrad.addColorStop(0, '#bd92d8');
      skyGrad.addColorStop(0.5, '#eee3f4');
      skyGrad.addColorStop(1, '#9acfad');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Ground
      ctx.fillStyle = '#f9f9b5';
      ctx.fillRect(0, 335, width, height - 335);
    }
  }

  drawButton(ctx, buttonKey, state = 'up', x, y, width = 30, height = 30, disabled = false) {
    const btn = this.buttons[buttonKey];
    if (!btn) return false;

    let imgUrl = btn.up;
    if (state === 'over') imgUrl = btn.over;
    else if (state === 'down') imgUrl = btn.down;

    const img = this.getImage(imgUrl) || this.getImage(btn.up);
    if (!img) return false;

    ctx.save();
    if (disabled) {
      ctx.globalAlpha = 0.35;
      ctx.filter = 'grayscale(100%)';
    }
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
    return true;
  }
}

window.SpriteManager = SpriteManager;
