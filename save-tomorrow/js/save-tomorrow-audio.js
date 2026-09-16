/**
 * THE INVENTION THAT MUST SAVE TOMORROW — WEB AUDIO API SYNTHESIZER & SPEECH ENGINE
 * 100% Zero external audio asset dependencies. High-fidelity synthesized soundscapes.
 */

(function(root) {
  'use strict';

  class SaveTomorrowAudio {
    constructor() {
      this.ctx = null;
      this.voiceEnabled = true;
      this.sfxEnabled = true;
      this.bgmOsc = null;
      this.bgmGain = null;
      this.isBgmPlaying = false;
      this.initContext();
    }

    initContext() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      } catch (e) {
        console.warn('Web Audio API not supported on this device:', e);
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      return this.voiceEnabled;
    }

    // 1. Soft UI Click
    playClick() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    // 2. Futuristic Machine Alarm / Emergency Siren
    playAlarm() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.2);
      osc.frequency.linearRampToValueAtTime(440, now + 0.4);
      osc.frequency.linearRampToValueAtTime(880, now + 0.6);
      osc.frequency.linearRampToValueAtTime(440, now + 0.8);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    }

    // 3. Robot Chirp / EDI Beep
    playRobotChirp() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      [523.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.05);
      });
    }

    // 4. Correct Answer Chime
    playCorrect() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    }

    // 5. Funny Try-Again Bonk
    playTryAgain() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // 6. Machine Ignition / Powering Up Conduit
    playMachineHum() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    }

    // 7. Invention Mixer Vortex Sound
    playMixerVortex() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(750, now + 0.4);
      osc.frequency.linearRampToValueAtTime(220, now + 0.8);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    }

    // 8. Audience Applause Cheer
    playApplause() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      // Synthesize cheering crowd using filtered noise & warm multi-tone claps
      for (let i = 0; i < 35; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = Math.random() * 1.6;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200 + Math.random() * 400, now + delay);
        gain.gain.setValueAtTime(0.06 + Math.random() * 0.08, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.08);
      }
    }

    // 9. Grand Victory Fanfare (Future Machine Saved)
    playVictoryFanfare() {
      if (!this.sfxEnabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.2, t: 0 },    // C5
        { f: 659.25, d: 0.2, t: 0.2 },  // E5
        { f: 783.99, d: 0.2, t: 0.4 },  // G5
        { f: 1046.50, d: 0.6, t: 0.6 }, // C6
        { f: 880.00, d: 0.25, t: 1.2 }, // A5
        { f: 1046.50, d: 0.9, t: 1.45 } // C6 sustained
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.24, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    // 10. Web Speech API Narration
    speak(text, rate = 0.92) {
      if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.rate = rate;
        utter.pitch = 1.05;
        utter.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const childFriendly = voices.find(v => (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny')) && v.lang.startsWith('en'));
        if (childFriendly) utter.voice = childFriendly;

        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }

    stopSpeaking() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  root.SaveTomorrowAudio = SaveTomorrowAudio;
})(typeof window !== 'undefined' ? window : global);
