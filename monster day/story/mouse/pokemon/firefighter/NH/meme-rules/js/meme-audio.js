/**
 * Adventure Academy - Zero-Dependency Harmonic Web Audio Engine & TTS
 * Synthesizes all sounds locally using browser AudioContext
 */

class MemeAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.voiceEnabled = true;
    this.isInitialized = false;
    this.currentUtterance = null;

    // Attach eager unlock on first pointer or key action
    this.bindUnlockHandlers();
  }

  bindUnlockHandlers() {
    const unlock = () => {
      this.init();
      ['pointerdown', 'keydown', 'touchstart', 'click'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };
    ['pointerdown', 'keydown', 'touchstart', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: true });
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.isInitialized = true;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.voiceEnabled;
  }

  /**
   * Mechanical triangle-wave click (1200 Hz -> 300 Hz) for card docking
   */
  playSnap() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio playSnap error', e);
    }
  }

  /**
   * Physical rubber stamp impact thud
   */
  playStamp() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio playStamp error', e);
    }
  }

  /**
   * Ascending chime arpeggio (B5 987.77 Hz to E6 1318.51 Hz)
   */
  playXP() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [
        { freq: 987.77, delay: 0 },       // B5
        { freq: 1108.73, delay: 0.07 },    // C#6
        { freq: 1244.51, delay: 0.14 },    // D#6
        { freq: 1318.51, delay: 0.21 }     // E6
      ];

      const now = this.ctx.currentTime;

      notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        // Bell envelope
        gain.gain.setValueAtTime(0.001, now + note.delay);
        gain.gain.linearRampToValueAtTime(0.22, now + note.delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + 0.36);
      });
    } catch (e) {
      console.warn('Audio playXP error', e);
    }
  }

  /**
   * Warm, descending two-tone sine bounce (246.94 Hz -> 220 Hz) with zero penalty feel
   */
  playSoftFail() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 246.94, start: now, dur: 0.14 },         // B3
        { freq: 220.00, start: now + 0.13, dur: 0.22 }   // A3
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, n.start);

        gain.gain.setValueAtTime(0.18, n.start);
        gain.gain.exponentialRampToValueAtTime(0.001, n.start + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(n.start);
        osc.stop(n.start + n.dur);
      });
    } catch (e) {
      console.warn('Audio playSoftFail error', e);
    }
  }

  /**
   * 4-note major arpeggio fanfare (C5, E5, G5, C6) for stage completion
   */
  playFanfare() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [
        { freq: 523.25, time: 0, dur: 0.18 },    // C5
        { freq: 659.25, time: 0.15, dur: 0.18 }, // E5
        { freq: 783.99, time: 0.30, dur: 0.22 }, // G5
        { freq: 1046.50, time: 0.45, dur: 0.85 } // C6 (long triumphant ring)
      ];

      const now = this.ctx.currentTime;

      notes.forEach((n, idx) => {
        // Main fundamental oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.25, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);

        // Add sparkling shimmer harmonic on the final high note
        if (idx === 3) {
          const harmonic = this.ctx.createOscillator();
          const harmGain = this.ctx.createGain();
          harmonic.type = 'sine';
          harmonic.frequency.setValueAtTime(n.freq * 2, now + n.time); // C7 octave

          harmGain.gain.setValueAtTime(0.001, now + n.time);
          harmGain.gain.linearRampToValueAtTime(0.08, now + n.time + 0.05);
          harmGain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

          harmonic.connect(harmGain);
          harmGain.connect(this.ctx.destination);

          harmonic.start(now + n.time);
          harmonic.stop(now + n.time + n.dur);
        }
      });
    } catch (e) {
      console.warn('Audio playFanfare error', e);
    }
  }

  /**
   * Calibrated window.speechSynthesis voice output
   * rate: 0.88, pitch: 1.05, lang: "en-US"
   */
  speak(text, onBoundary = null, onEnd = null) {
    if (!this.voiceEnabled || !window.speechSynthesis) {
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 1.05;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) && 
          v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      if (onBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            onBoundary(event.charIndex, event.charLength || 5);
          }
        };
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.warn('TTS utterance error', err);
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis failed', err);
      if (onEnd) setTimeout(onEnd, 1000);
    }
  }

  stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }
}

// Global instance
window.memeAudio = new MemeAudioEngine();
