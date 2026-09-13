/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ENGINE CORE (v1.0)
 * 
 * Modular 2D/2.5D Game Loop, Multi-Modal Input Manager, Smooth Camera,
 * and Depth Y-Sorted Canvas Renderer.
 * Zero external engine dependencies.
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. INPUT MANAGER (Keyboard, Mouse Click-to-Move, Touch Joystick)
  // =========================================================================
  class InputManager {
    constructor(canvasElement) {
      this.canvas = canvasElement;
      this.keys = {};
      this.justPressedKeys = {};
      this.moveTarget = null; // { x, y } for click-to-move
      this.virtualAxis = { x: 0, y: 0 };
      this.isInteracting = false;
      this.justInteracted = false;
      this.listeners = [];

      this._setupKeyboard();
      this._setupPointer();
    }

    _setupKeyboard() {
      window.addEventListener('keydown', (e) => {
        // Prevent default scrolling for game controls
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
        if (!this.keys[e.code]) {
          this.justPressedKeys[e.code] = true;
        }
        this.keys[e.code] = true;

        if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
          this.isInteracting = true;
          this.justInteracted = true;
        }

        // Clear click-to-move when keyboard keys are pressed
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          this.moveTarget = null;
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
        if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
          this.isInteracting = false;
        }
      });
    }

    _setupPointer() {
      if (!this.canvas) return;

      this.canvas.addEventListener('pointerdown', (e) => {
        // Only left clicks or primary touch
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        
        // If clicking on UI, ignore
        if (e.target !== this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();
        const screenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const screenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

        if (root.StoryGame && root.StoryGame.camera) {
          const worldPos = root.StoryGame.camera.screenToWorld(screenX, screenY);
          this.moveTarget = { x: worldPos.x, y: worldPos.y };
        }
      });
    }

    // Set virtual thumbstick axis (-1 to 1) from touch joystick
    setVirtualAxis(x, y) {
      this.virtualAxis.x = Math.max(-1, Math.min(1, x));
      this.virtualAxis.y = Math.max(-1, Math.min(1, y));
      if (Math.hypot(x, y) > 0.1) {
        this.moveTarget = null;
      }
    }

    triggerInteract() {
      this.isInteracting = true;
      this.justInteracted = true;
    }

    // Computes normalized input vector (dx, dy)
    getMovementVector() {
      let dx = 0;
      let dy = 0;

      // 1. Keyboard priority
      if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

      // 2. Virtual analog axis
      if (dx === 0 && dy === 0 && (Math.abs(this.virtualAxis.x) > 0.05 || Math.abs(this.virtualAxis.y) > 0.05)) {
        dx = this.virtualAxis.x;
        dy = this.virtualAxis.y;
      }

      // Normalize diagonal keyboard movement
      const len = Math.hypot(dx, dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }

      return { dx, dy, hasDirection: len > 0.05, isKeyboard: (dx !== 0 || dy !== 0) && (dx === 1 || dx === -1 || dy === 1 || dy === -1) };
    }

    wasKeyJustPressed(code) {
      return Boolean(this.justPressedKeys[code]);
    }

    consumeInteract() {
      const interacted = this.justInteracted;
      this.justInteracted = false;
      return interacted;
    }

    clearPerFrameInputs() {
      this.justPressedKeys = {};
    }
  }

  // =========================================================================
  // 2. CAMERA 2D (Smooth Tracking, Boundary Clamping, Screen Shake)
  // =========================================================================
  class Camera2D {
    constructor(viewportWidth = 960, viewportHeight = 640) {
      this.x = 0;
      this.y = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
      this.lerpSpeed = 0.08; // Smooth cinematic ease
      this.bounds = { minX: 0, minY: 0, maxX: 1600, maxY: 1200 };
      this.shakeRemaining = 0;
      this.shakeIntensity = 0;
      this.zoom = 1.0;
    }

    resize(w, h) {
      this.viewportWidth = w;
      this.viewportHeight = h;
    }

    setBounds(minX, minY, maxX, maxY) {
      this.bounds = { minX, minY, maxX, maxY };
    }

    follow(targetX, targetY, immediate = false) {
      this.targetX = targetX;
      this.targetY = targetY;
      if (immediate) {
        this.x = targetX;
        this.y = targetY;
      }
    }

    shake(durationMs = 250, intensity = 8) {
      this.shakeRemaining = durationMs;
      this.shakeIntensity = intensity;
    }

    update(dt) {
      // Smooth lerp toward target
      this.x += (this.targetX - this.x) * this.lerpSpeed;
      this.y += (this.targetY - this.y) * this.lerpSpeed;

      // Handle screen shake decay
      if (this.shakeRemaining > 0) {
        this.shakeRemaining -= dt * 1000;
        if (this.shakeRemaining <= 0) {
          this.shakeRemaining = 0;
          this.shakeIntensity = 0;
        }
      }
    }

    // Calculates top-left corner offset of camera in world space
    getViewOffset() {
      const halfW = (this.viewportWidth / 2) / this.zoom;
      const halfH = (this.viewportHeight / 2) / this.zoom;

      let left = this.x - halfW;
      let top = this.y - halfH;

      // Boundary clamp so camera doesn't show void outside map
      if (this.bounds.maxX - this.bounds.minX >= this.viewportWidth / this.zoom) {
        left = Math.max(this.bounds.minX, Math.min(this.bounds.maxX - (this.viewportWidth / this.zoom), left));
      } else {
        left = this.bounds.minX - (this.viewportWidth / this.zoom - (this.bounds.maxX - this.bounds.minX)) / 2;
      }

      if (this.bounds.maxY - this.bounds.minY >= this.viewportHeight / this.zoom) {
        top = Math.max(this.bounds.minY, Math.min(this.bounds.maxY - (this.viewportHeight / this.zoom), top));
      } else {
        top = this.bounds.minY - (this.viewportHeight / this.zoom - (this.bounds.maxY - this.bounds.minY)) / 2;
      }

      // Add camera shake offset
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (this.shakeRemaining > 0) {
        shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
        shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
      }

      return {
        x: Math.round(left + shakeOffsetX),
        y: Math.round(top + shakeOffsetY)
      };
    }

    worldToScreen(worldX, worldY) {
      const offset = this.getViewOffset();
      return {
        x: (worldX - offset.x) * this.zoom,
        y: (worldY - offset.y) * this.zoom
      };
    }

    screenToWorld(screenX, screenY) {
      const offset = this.getViewOffset();
      return {
        x: screenX / this.zoom + offset.x,
        y: screenY / this.zoom + offset.y
      };
    }
  }

  // =========================================================================
  // 3. RENDERER 2D (Depth Y-Sorting, Vector Canvas, Particle Effects)
  // =========================================================================
  class Renderer2D {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.particles = [];
      this.destinationPulse = 0;
    }

    resize(width, height) {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.scale(dpr, dpr);
    }

    addParticle(particle) {
      this.particles.push(particle);
    }

    updateParticles(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    render(world, camera, input) {
      const ctx = this.ctx;
      const viewW = camera.viewportWidth;
      const viewH = camera.viewportHeight;
      const offset = camera.getViewOffset();

      // 1. Clear Frame
      ctx.fillStyle = '#06101e';
      ctx.fillRect(0, 0, viewW, viewH);

      ctx.save();
      // Apply Camera Transform
      ctx.translate(-offset.x, -offset.y);

      // 2. Render Ground & Terrain Layer
      if (world && world.activeArea) {
        world.activeArea.renderTerrain(ctx, offset.x, offset.y, viewW, viewH);
      }

      // 3. Render Click-to-Move Destination Indicator
      if (input && input.moveTarget) {
        this.destinationPulse = (this.destinationPulse + 0.05) % (Math.PI * 2);
        const radius = 10 + Math.sin(this.destinationPulse) * 3;
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(input.moveTarget.x, input.moveTarget.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(input.moveTarget.x, input.moveTarget.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Collect & Depth Y-Sort All Renderable Entities
      // Y-sorting gives true 2.5D isometric depth: entities further down are in front!
      const entities = (world && world.activeArea) ? world.activeArea.entities.slice() : [];
      entities.sort((a, b) => (a.y + a.height) - (b.y + b.height));

      // 5. Render Entities
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        // Culling: only draw if within viewport range
        if (ent.x + ent.width >= offset.x - 100 &&
            ent.x <= offset.x + viewW + 100 &&
            ent.y + ent.height >= offset.y - 100 &&
            ent.y <= offset.y + viewH + 100) {
          ent.render(ctx);
        }
      }

      // 6. Render Ambient Particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color || '#fef08a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Render Canopy / Foreground Overlays
      if (world && world.activeArea) {
        world.activeArea.renderForeground(ctx, offset.x, offset.y, viewW, viewH);
      }

      // 8. Debug Wireframes (if Debug Mode is Active)
      if (root.StoryGame && root.StoryGame.debug && root.StoryGame.debug.showHitboxes) {
        this._renderDebugWireframes(ctx, world);
      }

      ctx.restore();
    }

    _renderDebugWireframes(ctx, world) {
      if (!world || !world.activeArea) return;

      // Obstacle collision boxes in Red
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      for (const obs of world.activeArea.obstacles) {
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }

      // Entity hitboxes in Cyan
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
      for (const ent of world.activeArea.entities) {
        const hb = ent.getHitbox();
        ctx.strokeRect(hb.x, hb.y, hb.width, hb.height);

        // Interaction zone in Green
        if (ent.interactionRadius) {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
          ctx.beginPath();
          ctx.arc(ent.x + ent.width / 2, ent.y + ent.height / 2, ent.interactionRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }

  // =========================================================================
  // 4. GAME LOOP (Fixed-Step Physics + Smooth 60FPS Animation)
  // =========================================================================
  class GameLoop {
    constructor(updateFn, renderFn) {
      this.updateFn = updateFn;
      this.renderFn = renderFn;
      this.isRunning = false;
      this.lastTime = 0;
      this.accumulator = 0;
      this.timeStep = 1 / 60; // 60hz physics tick
      this.rafId = null;
      this.fps = 60;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame(this._tick.bind(this));
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    _tick(currentTime) {
      if (!this.isRunning) return;

      const elapsed = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // Cap huge lags (e.g. background tab switch) to 100ms
      const delta = Math.min(elapsed, 0.1);
      this.accumulator += delta;

      // Fixed timestep physics update
      while (this.accumulator >= this.timeStep) {
        this.updateFn(this.timeStep);
        this.accumulator -= this.timeStep;
      }

      // Render interpolated frame
      this.renderFn(delta);

      // FPS Calculation
      this.frameCount++;
      this.fpsTimer += elapsed;
      if (this.fpsTimer >= 1.0) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.fpsTimer = 0;
      }

      this.rafId = requestAnimationFrame(this._tick.bind(this));
    }
  }

  // Export to root namespace
  root.StoryEngineCore = {
    InputManager,
    Camera2D,
    Renderer2D,
    GameLoop
  };

})(window);
