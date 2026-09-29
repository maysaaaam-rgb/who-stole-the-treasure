/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Sprite Manager
 * Handles preloading, caching, animation frames, and drawing
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
        console.warn('Failed to load image:', url);
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

    // 1. Background
    promises.push(this.loadImage(`${this.basePath}png_shapes/30.png`));

    // 2. Character Animations configuration
    const animConfig = {
      // Cat (Fleabag)
      cat_idle: { path: 'assembled/sprites/DefineSprite_288', count: 37, fps: 15 },
      cat_throw: { path: 'assembled/sprites/DefineSprite_325', count: 70, fps: 24 },
      cat_hurt: { path: 'assembled/sprites/DefineSprite_289', count: 5, fps: 10 },
      cat_victory: { path: 'assembled/sprites/DefineSprite_405', count: 22, fps: 12 },
      cat_meter: { path: 'assembled/sprites/DefineSprite_257', count: 37, fps: 30 },

      // Dog (Mutt)
      dog_idle: { path: 'assembled/sprites/DefineSprite_170', count: 28, fps: 15 },
      dog_throw: { path: 'assembled/sprites/DefineSprite_205', count: 70, fps: 24 },
      dog_hurt: { path: 'assembled/sprites/DefineSprite_171', count: 5, fps: 10 },
      dog_victory: { path: 'assembled/sprites/DefineSprite_418', count: 12, fps: 12 },
      dog_meter: { path: 'assembled/sprites/DefineSprite_118', count: 37, fps: 30 },

      // Wind Indicator
      wind: { path: 'assembled/sprites/DefineSprite_216', count: 16, fps: 0 },

      // Projectiles
      proj_bone: { path: 'assembled/sprites/DefineSprite_92', count: 8, fps: 16 },
      proj_can: { path: 'assembled/sprites/DefineSprite_220', count: 18, fps: 18 },
      proj_bomb: { path: 'assembled/sprites/DefineSprite_409', count: 8, fps: 16 },
      bandage_heal: { path: 'assembled/sprites/DefineSprite_323', count: 18, fps: 15 },

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
        const url = `${this.basePath}${conf.path}/${i}.png`;
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
      this.buttons[btn.name] = {
        up: `${this.basePath}assembled/buttons/${btn.folder}/1_up.png`,
        over: `${this.basePath}assembled/buttons/${btn.folder}/2_over.png`,
        down: `${this.basePath}assembled/buttons/${btn.folder}/3_down.png`
      };
      promises.push(this.loadImage(this.buttons[btn.name].up));
      promises.push(this.loadImage(this.buttons[btn.name].over));
      promises.push(this.loadImage(this.buttons[btn.name].down));
    }

    // 4. Props & Toxic Cloud shapes
    const shapes = ['406.png', '407.png', '408.png', '226.png', '108.png', '12.png'];
    for (const s of shapes) {
      promises.push(this.loadImage(`${this.basePath}png_shapes/${s}`));
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

    // Anchor: center-bottom by default unless specified
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
    const bg = this.getImage(`${this.basePath}png_shapes/30.png`);
    if (bg) {
      ctx.drawImage(bg, 0, 0, width, height);
    } else {
      // High-fidelity programmatic gradient fallback
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
