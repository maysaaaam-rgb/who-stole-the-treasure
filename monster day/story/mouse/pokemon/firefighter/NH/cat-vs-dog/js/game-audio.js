/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Audio Manager
 * Uses Web Audio API with pre-decoded buffers and dual-mode fallback
 */
class GameAudio {
  constructor(basePath = 'assets/audio/') {
    this.basePath = basePath;
    this.ctx = null;
    this.buffers = {};
    this.volume = 0.8;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.currentMusic = null;
    this.initialized = false;

    // Mapping authentic sound files
    this.soundMap = {
      dog_throw: '202.mp3',
      cat_throw: '324.mp3',
      hit_fence: '308.mp3',
      hit_ground: '244.mp3',
      hit_char: '168.mp3',
      dog_hurt: '123.mp3',
      dog_bark: '117.mp3',
      cat_hurt: '413.mp3',
      cat_meow: '15.mp3',
      powerup_select: '26.mp3',
      heal: '28.mp3',
      powerup_active: '287.mp3',
      click: '122.mp3',
      victory: '419.mp3'
    };
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      this.initialized = true;
      this.preloadAll();
    } catch (e) {
      console.warn('Web Audio initialization error, using HTML5 Audio fallback:', e);
      this.initialized = true;
    }
  }

  async preloadAll() {
    if (!this.ctx) return;
    const loadPromises = Object.entries(this.soundMap).map(async ([key, filename]) => {
      try {
        const url = `${this.basePath}${filename}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.buffers[key] = audioBuffer;
      } catch (err) {
        console.warn(`Failed to preload audio: ${key} (${filename})`, err);
      }
    });
    await Promise.all(loadPromises);
  }

  play(key, options = {}) {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();

    const vol = (options.volume !== undefined ? options.volume : 1.0) * this.volume;

    // Try Web Audio buffer first
    if (this.ctx && this.buffers[key]) {
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[key];
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return source;
      } catch (e) {
        console.warn('Web Audio playback error, falling back:', e);
      }
    }

    // Fallback HTML5 Audio
    const filename = this.soundMap[key];
    if (filename) {
      try {
        const audio = new Audio(`${this.basePath}${filename}`);
        audio.volume = Math.min(1.0, Math.max(0.0, vol));
        audio.play().catch(() => {});
        return audio;
      } catch (e) {
        console.warn('HTML5 Audio error:', e);
      }
    }
    return null;
  }

  playMusic(key = 'victory') {
    if (!this.musicEnabled) return;
    if (!this.initialized) this.init();

    this.stopMusic();
    const filename = this.soundMap[key];
    if (filename) {
      try {
        const audio = new Audio(`${this.basePath}${filename}`);
        audio.volume = this.volume * 0.7;
        audio.loop = true;
        audio.play().catch(() => {});
        this.currentMusic = audio;
      } catch (e) {
        console.warn('Music play error:', e);
      }
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
      } catch (e) {}
      this.currentMusic = null;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentMusic) {
      this.currentMusic.volume = this.volume * 0.7;
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    }
    return this.musicEnabled;
  }
}

window.GameAudio = GameAudio;
