/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Audio Manager
 * Uses Web Audio API with pre-decoded buffers and dual-mode fallback
 * Includes persistent localStorage mute, gain normalization, and instant stopAll
 */
class GameAudio {
  constructor(basePath = 'assets/audio/') {
    this.basePath = basePath;
    this.ctx = null;
    this.buffers = {};
    this.volume = 0.75;
    this.isMuted = localStorage.getItem('cat_vs_dog_muted') === 'true';
    this.sfxEnabled = !this.isMuted;
    this.musicEnabled = !this.isMuted;
    this.activeSources = [];
    this.currentMusic = null;
    this.initialized = false;

    // Mapping authentic sound files with normalized channel gain
    this.soundMap = {
      dog_throw: { file: '202.mp3', gain: 0.85 },
      cat_throw: { file: '324.mp3', gain: 0.85 },
      hit_fence: { file: '308.mp3', gain: 0.95 },
      hit_ground: { file: '244.mp3', gain: 0.75 },
      hit_char: { file: '168.mp3', gain: 0.9 },
      dog_hurt: { file: '123.mp3', gain: 0.75 }, // normalized to prevent speaker clipping
      dog_bark: { file: '117.mp3', gain: 0.8 },
      dog_laugh: { file: '117.mp3', gain: 0.85 },
      cat_hurt: { file: '413.mp3', gain: 0.7 }, // normalized screech
      cat_meow: { file: '15.mp3', gain: 0.75 },
      cat_smirk: { file: '15.mp3', gain: 0.8 },
      powerup_select: { file: '26.mp3', gain: 0.7 },
      heal: { file: '28.mp3', gain: 0.85 },
      powerup_active: { file: '287.mp3', gain: 0.8 },
      click: { file: '122.mp3', gain: 0.7 },
      charge_whistle: { file: '9.mp3', gain: 0.5 },
      victory: { file: '419.mp3', gain: 0.85 }
    };

    this.setupInteractionUnlock();
  }

  setupInteractionUnlock() {
    const unlockHandler = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
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
    const loadPromises = Object.entries(this.soundMap).map(async ([key, conf]) => {
      try {
        let url;
        if (window.BUNDLED_AUDIO && window.BUNDLED_AUDIO[key]) {
          url = window.BUNDLED_AUDIO[key];
        } else {
          url = `${this.basePath}${conf.file}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.buffers[key] = audioBuffer;
      } catch (err) {}
    });
    await Promise.all(loadPromises);
  }

  play(key, options = {}) {
    if (this.isMuted || !this.sfxEnabled) return null;
    if (!this.initialized) this.init();

    const conf = this.soundMap[key] || { gain: 1.0, file: '' };
    const baseGain = conf.gain || 1.0;
    const customVol = options.volume !== undefined ? options.volume : 1.0;
    const finalVol = Math.max(0.01, Math.min(1.0, this.volume * baseGain * customVol));

    // 1. Web Audio buffer
    if (this.ctx && this.buffers[key]) {
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[key];
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(finalVol, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);

        this.activeSources.push(source);
        source.onended = () => {
          const idx = this.activeSources.indexOf(source);
          if (idx !== -1) this.activeSources.splice(idx, 1);
        };
        return source;
      } catch (e) {}
    }

    // 2. HTML5 Audio Fallback
    let url;
    if (window.BUNDLED_AUDIO && window.BUNDLED_AUDIO[key]) {
      url = window.BUNDLED_AUDIO[key];
    } else if (conf.file) {
      url = `${this.basePath}${conf.file}`;
    }

    if (url) {
      try {
        const audio = new Audio(url);
        audio.volume = finalVol;
        audio.play().catch(() => {});
        return audio;
      } catch (e) {}
    }
    return null;
  }

  playMusic(key = 'victory') {
    if (this.isMuted || !this.musicEnabled) return;
    if (!this.initialized) this.init();

    this.stopMusic();
    let url;
    if (window.BUNDLED_AUDIO && window.BUNDLED_AUDIO[key]) {
      url = window.BUNDLED_AUDIO[key];
    } else {
      const conf = this.soundMap[key];
      if (conf) url = `${this.basePath}${conf.file}`;
    }

    if (url) {
      try {
        const audio = new Audio(url);
        audio.volume = this.volume * 0.65;
        audio.loop = true;
        audio.play().catch(() => {});
        this.currentMusic = audio;
      } catch (e) {}
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

  stopAll() {
    this.stopMusic();
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    }
    this.activeSources = [];
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.sfxEnabled = !this.isMuted;
    this.musicEnabled = !this.isMuted;
    localStorage.setItem('cat_vs_dog_muted', this.isMuted ? 'true' : 'false');
    if (this.isMuted) {
      this.stopAll();
    }
    return !this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentMusic) {
      this.currentMusic.volume = this.volume * 0.65;
    }
  }
}

window.GameAudio = GameAudio;
