/**
 * FOREST RANGER PET SAFARI: AUDIO ENGINE
 * Web Audio API Acoustic Sound Effects & ElevenLabs v2 SSML Speech Synthesizer
 * Zero external mp3 dependencies.
 */

(function(root) {
  'use strict';

  class ForestSafariAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;
      this.activeTimers = [];

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
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    // 1. Correct / Ranger Star XP Chime (Ascending C-Major pentatonic: C5 -> E5 -> G5 -> C6)
    playCorrect() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    }

    // 2. Soft-Fail Warm Descending Sine Chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, now);
      osc.frequency.linearRampToValueAtTime(220.00, now + 0.28);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    }

    // 3. Wooden Clapper Beats (for Syllable Clapping)
    playWoodClap() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }

    // 4. Crunchy Autumn Leaves Sound
    playLeafCrunch() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesize noise burst with bandpass filter
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);
    }

    // 5. Arcade Button Ding
    playArcadeDing() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    }

    // 6. Realistic Synthesized Wolf Howl (Awooooo!)
    playWolfHowl() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Low start, long sweep up, slow descent
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.7);
      osc.frequency.linearRampToValueAtTime(580, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(220, now + 2.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.35);
    }

    // 7. Cash Register Ka-Ching / Basket Sort Sound
    playKaChing() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [1400, 1850].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.36);
      });
    }

    // 8. Soft Freezing Winter Wind
    playWinterWind() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.linearRampToValueAtTime(600, now + 0.7);
      filter.frequency.linearRampToValueAtTime(280, now + 1.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 1.55);
    }

    // 9. Grand Ranger Victory Fanfare
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.65);
      });
    }

    // 10. ElevenLabs v2 SSML Speech Dispatcher
    speakSSML(ssmlScript, persona = 'Sarah') {
      if (this.isMuted || !window.speechSynthesis) return;

      this.stopSpeech();

      // Trigger SFX context if available
      if (ssmlScript.includes('howl') || ssmlScript.includes('wolf')) {
        this.playWolfHowl();
      }

      const segments = this.parseSSML(ssmlScript);
      let cumulativeDelay = 100;

      segments.forEach(seg => {
        if (seg.type === 'pause') {
          cumulativeDelay += seg.duration;
        } else if (seg.type === 'text' && seg.text.trim()) {
          const tId = setTimeout(() => {
            if (this.isMuted) return;
            const utter = new SpeechSynthesisUtterance(seg.text.trim());
            utter.lang = 'en-US';

            if (persona.toLowerCase() === 'marcus') {
              utter.rate = 0.88;
              utter.pitch = 0.98;
            } else {
              // Sarah - friendly, warm youth coach
              utter.rate = 0.80;
              utter.pitch = 1.05;
            }

            window.speechSynthesis.speak(utter);
          }, cumulativeDelay);

          this.activeTimers.push(tId);
          // Add estimated speaking time based on word count
          const wordCount = seg.text.trim().split(/\s+/).length;
          cumulativeDelay += Math.max(800, wordCount * 380);
        }
      });
    }

    parseSSML(ssml) {
      const segments = [];
      const regex = /<break\s+time=["'](\d+)(ms|s)["']\s*\/?>/gi;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(ssml)) !== null) {
        const textBefore = ssml.substring(lastIndex, match.index);
        const cleanText = textBefore.replace(/<[^>]+>/g, '').trim();
        if (cleanText) {
          segments.push({ type: 'text', text: cleanText });
        }

        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        const duration = unit === 's' ? value * 1000 : value;
        segments.push({ type: 'pause', duration });

        lastIndex = regex.lastIndex;
      }

      const remaining = ssml.substring(lastIndex);
      const cleanRemaining = remaining.replace(/<[^>]+>/g, '').trim();
      if (cleanRemaining) {
        segments.push({ type: 'text', text: cleanRemaining });
      }

      return segments;
    }

    stopSpeech() {
      this.activeTimers.forEach(id => clearTimeout(id));
      this.activeTimers = [];
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }

  root.ForestSafariAudio = new ForestSafariAudio();
})(typeof window !== 'undefined' ? window : global);
