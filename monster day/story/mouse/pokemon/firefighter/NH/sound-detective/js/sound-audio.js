/**
 * SOUND DETECTIVE: AUDIO ENGINE
 * Pure Web Audio API Synthesizer & Speech Synthesis
 */
(function() {
  class SoundAudioEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    _now() {
      this.init();
      return this.ctx ? this.ctx.currentTime : 0;
    }

    // --- GAME SFX ---
    playXP() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    }

    playSoftFail() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // --- 13 HOUSEHOLD MYSTERY SOUND SYNTHESIZERS ---

    // 1. Clock (tick-tock)
    playClockTick() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.25, 0.5, 0.75].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(i % 2 === 0 ? 1200 : 900, now + tOff);
        gain.gain.setValueAtTime(0.25, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.045);
      });
    }

    // 2. Bell (ding-dong)
    playBellRing() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      // Ding
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Dong
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.35); // E5
      gain2.gain.setValueAtTime(0.35, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.1);
    }

    // 3. Water Tap (drip-drop)
    playWaterTap() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.28, 0.55].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 400 + i * 150;
        osc.frequency.setValueAtTime(startFreq, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + tOff + 0.07);
        gain.gain.setValueAtTime(0.28, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.085);
      });
    }

    // 4. Light Switch (click-clack)
    playSwitchClick() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.06].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(i === 0 ? 1500 : 700, now + tOff);
        gain.gain.setValueAtTime(0.2, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.03);
      });
    }

    // 5. Kettle (shhhh-whistle)
    playKettleBoil() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.9);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.1);
    }

    // 6. Computer Keyboard (typing clicks)
    playKeyboardType() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.07, 0.14, 0.22, 0.31, 0.39].forEach(tOff => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 600, now + tOff);
        gain.gain.setValueAtTime(0.22, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.04);
      });
    }

    // 7. Cards (paper flutter shuffle)
    playCardShuffle() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      for (let i = 0; i < 14; i++) {
        const tOff = i * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 1200, now + tOff);
        gain.gain.setValueAtTime(0.12, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.025);
      }
    }

    // 8. Dice (rattle roll)
    playDiceRoll() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.08, 0.15, 0.24, 0.34, 0.46, 0.60].forEach((tOff, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 + Math.random() * 300, now + tOff);
        gain.gain.setValueAtTime(0.25 / (1 + idx * 0.2), now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.05);
      });
    }

    // 9. Door (knock knock)
    playDoorKnock() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.18, 0.36].forEach(tOff => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(60, now + tOff + 0.08);
        gain.gain.setValueAtTime(0.35, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.095);
      });
    }

    // 10. Chair (wood scrape)
    playChairScrape() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.15);
      osc.frequency.linearRampToValueAtTime(190, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    // 11. Cup (ceramic clink)
    playCupClink() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // A6
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    // 12. Spoon (cutlery ding)
    playSpoonDing() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      [0, 0.12].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2093 + i * 400, now + tOff); // C7
        gain.gain.setValueAtTime(0.25, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.35);
      });
    }

    // 13. Backpack (zipper slide)
    playBackpackZip() {
      this.init(); if (!this.ctx) return;
      const now = this._now();
      for (let i = 0; i < 18; i++) {
        const tOff = i * 0.022;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000 + i * 60, now + tOff);
        gain.gain.setValueAtTime(0.12, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.018);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.02);
      }
    }

    // --- SPEECH SYNTHESIS ---
    speak(text, onComplete) {
      if (!('speechSynthesis' in window)) {
        if (onComplete) onComplete();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';
      if (onComplete) utterance.onend = onComplete;
      window.speechSynthesis.speak(utterance);
    }
  }

  window.SoundAudio = new SoundAudioEngine();
})();
