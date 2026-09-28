/**
 * BIOME CRAFTER: THE NIGHT SURVIVAL (70-MIN MASTER ARC)
 * Studio Harmonic Web Audio API Synthesizer & Calibrated Natural TTS
 * Zero external MP3 dependencies • High-fidelity polyphonic procedural audio
 */

(function(root) {
  'use strict';

  class BiomeAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;

      // Autoplay Guard: resume AudioContext and initialize TTS on first user gesture
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

    // 1. Crisp Wood Chop Transient (800 Hz -> 180 Hz)
    playWoodChop() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.12);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }

    // 2. Resonant Stone Mine Impact (320 Hz + Debris Noise Burst)
    playStoneMine() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary stone thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      // Noise debris
      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, now);
      noiseFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
      noise.start(now);
      noise.stop(now + 0.13);
    }

    // 3. Heavy Hammer Mallet Stamp Slam + Positive Dual Chord (B5 -> E6)
    playHammerSlam() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Heavy mallet impact thud
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      subGain.gain.setValueAtTime(0.8, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.3);

      // Positive craft chime chord (B5: 987.77 Hz -> E6: 1318.51 Hz)
      [987.77, 1318.51].forEach((freq, idx) => {
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();

        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(freq, now + 0.04 * idx);

        chordGain.gain.setValueAtTime(0, now);
        chordGain.gain.setValueAtTime(0.35, now + 0.04 * idx);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        chordOsc.connect(chordGain);
        chordGain.connect(this.ctx.destination);

        chordOsc.start(now + 0.04 * idx);
        chordOsc.stop(now + 0.5);
      });
    }

    // Heavy Metallic Anvil Strike: 220 Hz Low-Pass Noise Crunch + Sub-Bass Anvil Resonant Ping
    playAnvilStrike() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Noise crunch with 220 Hz low-pass filter
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.22);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.25);

      // 2. Heavy metallic thud oscillator (220 Hz -> 55 Hz)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sawtooth';
      thudOsc.frequency.setValueAtTime(220, now);
      thudOsc.frequency.exponentialRampToValueAtTime(55, now + 0.3);

      thudGain.gain.setValueAtTime(0.7, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.35);

      // 3. Resonant metallic anvil ping (880 Hz & 1760 Hz with exponential decay)
      [880, 1760].forEach((freq, idx) => {
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(freq, now + 0.02);

        pingGain.gain.setValueAtTime(0, now);
        pingGain.gain.setValueAtTime(0.3, now + 0.02);
        pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.1);

        pingOsc.connect(pingGain);
        pingGain.connect(this.ctx.destination);
        pingOsc.start(now + 0.02);
        pingOsc.stop(now + 0.75);
      });
    }

    // 4. Creeper Hiss (Exponential Low-Pass Swept White Noise)
    playCreeperHiss() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 1.6;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + duration);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    }

    // 4b. Heavy Reinforced Wooden Door Thud Slam
    playDoorThud() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    // 4c. Torch Spark & Fire Sizzle
    playTorchSizzle() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.35;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    }

    // 5. Tactile Card Flip / Socket Snap (Short noise transient)
    playSnap() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    // 6. Soft-Fail: Warm descending chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [246.94, 220.0];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.35, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.3);
      });
    }

    // 7. Correct / XP: Ascending C-Major Pentatonic Chord (C5, E5, G5, C6)
    playXP() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.32, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.38);
      });
    }

    // 8. Victory Fanfare: Rising 4-Note Arpeggio with Octave Sparkle
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.38 },
        { f: 1318.51, t: 0.54 }
      ];

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.4, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + 0.55);
      });
    }

    playFanfare() {
      return this.playVictoryFanfare();
    }

    // 9. Calibrated Speech Synthesis (rate: 0.88, pitch: 1.05, lang: "en-US")
    speak(text, onComplete) {
      if (this.isMuted) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      if (!('speechSynthesis' in window)) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Prioritize natural voices if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) &&
        v.lang.startsWith('en')
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (typeof onComplete === 'function') onComplete();
      };
      utterance.onerror = () => {
        if (typeof onComplete === 'function') onComplete();
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  root.BiomeAudio = new BiomeAudioEngine();
})(typeof window !== 'undefined' ? window : global);
