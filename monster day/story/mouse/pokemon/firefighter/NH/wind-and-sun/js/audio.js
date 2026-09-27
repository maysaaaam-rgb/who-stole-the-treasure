/**
 * THE WIND AND THE SUN: WEATHER POWERS & THE JACKET CONTEST
 * Web Audio API Procedural Synthesizer & Speech Narration Engine
 * Polyphonic musical chords, weather wind synthesis, celestial sun chimes, zipper clicks.
 * Zero external MP3/audio file dependencies.
 */

(function(root) {
  'use strict';

  class WindAndSunAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;

      const unlockAudio = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this.initContext();
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }
      };

      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
      });
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.isMuted;
    }

    // 1. Procedural Wind Whoosh (Levels 1 to 5)
    playWindSweep(intensity = 3) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = 90 + intensity * 35;
      const maxFreq = 220 + intensity * 85;
      const duration = 0.5 + intensity * 0.18;

      // Filtered noise buffer for howling air
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.45;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3.5 + intensity * 0.8;
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.frequency.exponentialRampToValueAtTime(maxFreq, now + duration * 0.4);
      filter.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18 + intensity * 0.05, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Add deep gust sub-tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65 + intensity * 15, now);
      osc.frequency.linearRampToValueAtTime(110 + intensity * 20, now + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(50, now + duration);

      oscGain.gain.setValueAtTime(0.01, now);
      oscGain.gain.linearRampToValueAtTime(0.12 + intensity * 0.03, now + duration * 0.3);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    // 2. Shimmering Sun Chime (Levels 1 to 5)
    playSunChime(intensity = 3) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Golden major pentatonic chord: E5, G#5, B5, E6, G#6
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      const count = Math.min(intensity + 1, freqs.length);

      freqs.slice(0, count).forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.85);
      });
    }

    // 3. Tactile Zipper Ratchet Click / Zip Sound
    playZipSound(action = 'up') {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const teeth = 8;
      const step = 0.022;

      for (let i = 0; i < teeth; i++) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        const toothTime = now + i * step;

        const basePitch = action === 'up' 
          ? 600 + i * 70   // ascending zipper pitch
          : 1100 - i * 70; // descending zipper pitch

        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(basePitch, toothTime);
        clickOsc.frequency.exponentialRampToValueAtTime(basePitch * 0.6, toothTime + 0.015);

        clickGain.gain.setValueAtTime(0.16, toothTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, toothTime + 0.018);

        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);

        clickOsc.start(toothTime);
        clickOsc.stop(toothTime + 0.02);
      }
    }

    // 4. Physical Card Snap / Button Click
    playSnap() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // 5. XP Award: Ascending C-Major Pentatonic Chord (C5 -> E5 -> G5 -> C6)
    playXP() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.001, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.5);
      });
    }

    // 6. Soft-Fail: Warm descending two-tone chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [246.94, 220.00];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        gain.gain.setValueAtTime(0.01, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.16 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.35);
      });
    }

    // 7. Victory Fanfare: Grand 5-Note Pentatonic Cascade
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i === notes.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.11);

        const duration = (i === notes.length - 1) ? 0.9 : 0.4;
        gain.gain.setValueAtTime(0.001, now + i * 0.11);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.11 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.11);
        osc.stop(now + i * 0.11 + duration + 0.05);
      });
    }

    // 8. TTS Narration strictly calibrated to CEFR A1 standards
    speak(text, onEnd = null) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  root.WindAndSunAudio = new WindAndSunAudio();
})(typeof window !== 'undefined' ? window : global);
