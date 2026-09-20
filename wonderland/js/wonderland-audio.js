/**
 * WONDERLAND AUDIO ENGINE
 * Procedural Web Audio API sound effects & Web Speech API synthesis
 * Specifically tuned for Grade 3 A1 Young Learners & Smart Board Classrooms
 */

(function(root) {
  'use strict';

  class WonderlandAudio {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.synth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
      this.selectedVoice = null;
      this.initVoices();
    }

    getContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    initVoices() {
      if (!this.synth) return;
      const load = () => {
        const voices = this.synth.getVoices();
        // Prefer natural, friendly English voices (US, GB)
        this.selectedVoice = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en-US') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria'))) ||
                             voices.find(v => v.lang.startsWith('en')) || null;
      };
      load();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = load;
      }
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled;
      if (!this.speechEnabled && this.synth) {
        this.synth.cancel();
      }
      return this.speechEnabled;
    }

    // =========================================================================
    // PROCEDURAL SOUND EFFECTS (Web Audio API)
    // =========================================================================

    playMagicalChime() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });
    }

    playSparkle() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [880, 1174.66, 1396.91, 1760, 2093];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    }

    playClockTick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    playWhoosh() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    }

    playChestOpenFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Majestic triumphant chord: F4, A4, C5, F5
      const notes = [349.23, 440.00, 523.25, 698.46];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.85);
      });
    }

    playCardSnap() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.07);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playGentleTryAgain() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Soft encouraging two-tone: E4 -> G4
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(392.00, now + 0.12);
      gain2.gain.setValueAtTime(0.12, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.38);
    }

    playClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }

    // =========================================================================
    // SPEECH SYNTHESIS (Web Speech API)
    // =========================================================================

    speak(text, rate = 0.88, pitch = 1.05) {
      if (!this.speechEnabled || !this.synth || !text) return;
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // Gentle, clear pacing for A1
      utterance.pitch = pitch;
      utterance.lang = 'en-US';
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      this.synth.speak(utterance);
    }

    speakTeacher(text) {
      this.speak(text, 0.86, 1.05);
    }

    speakCharacter(text) {
      this.speak(text, 0.90, 1.12);
    }
  }

  root.WonderlandAudio = WonderlandAudio;
  root.wonderlandAudio = new WonderlandAudio();

})(typeof window !== 'undefined' ? window : global);
