/**
 * forest-adaptation/js/audio.js
 * Dual-Channel Web Audio API Sound Engine & Speech Synthesizer
 * Strictly adheres to Rule 1.3: Polyphonic musical chords, ADSR curves, and procedural synthesis.
 */

class ForestAdaptationAudio {
  constructor() {
    this.audioCtx = null;
    this.sfxVolume = 0.8;
    this.ambientVolume = 0.35;
    this.sfxMuted = false;
    this.ambientMuted = false;
    this.speechRate = 0.88;
    this.speechPitch = 1.05;

    // Ambient loop state
    this.currentAmbientMode = null; // 'forest-autumn' | 'forest-winter' | 'story-acoustic' | null
    this.ambientNodes = [];
    this.ambientTimer = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // =========================================================================
  // CHANNEL 1: AMBIENT SOUNDSCAPES
  // =========================================================================

  stopAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.currentAmbientMode = null;
  }

  playAmbient(mode) {
    if (this.currentAmbientMode === mode && this.ambientNodes.length > 0) return;
    this.stopAmbient();
    this.currentAmbientMode = mode;
    if (this.ambientMuted) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (mode === 'forest-autumn') {
      this.startAutumnForestAmbiance(ctx);
    } else if (mode === 'forest-winter') {
      this.startWinterForestAmbiance(ctx);
    } else if (mode === 'story-acoustic') {
      this.startStoryAcousticAmbiance(ctx);
    }
  }

  // Autumn Forest: Gentle rustling foliage noise + periodic breeze LFO
  startAutumnForestAmbiance(ctx) {
    try {
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      filter.Q.setValueAtTime(2.8, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const master = ctx.createGain();
      master.gain.setValueAtTime(this.ambientVolume * 0.16, ctx.currentTime);

      noise.connect(filter);
      filter.connect(master);
      master.connect(ctx.destination);

      noise.start();
      lfo.start();
      this.ambientNodes.push(noise, filter, lfo, lfoGain, master);
    } catch (e) {}
  }

  // Winter Forest: Chilling high-whistle wind with soft white hiss
  startWinterForestAmbiance(ctx) {
    try {
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(6.0, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(550, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const master = ctx.createGain();
      master.gain.setValueAtTime(this.ambientVolume * 0.14, ctx.currentTime);

      noise.connect(filter);
      filter.connect(master);
      master.connect(ctx.destination);

      noise.start();
      lfo.start();
      this.ambientNodes.push(noise, filter, lfo, lfoGain, master);
    } catch (e) {}
  }

  // Story Acoustic: Gentle folk plucks + periodic baby bird chirps
  startStoryAcousticAmbiance(ctx) {
    try {
      // Periodic acoustic guitar arpeggios & swallow calls
      const chords = [
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66]  // G
      ];
      let chordIdx = 0;

      this.ambientTimer = setInterval(() => {
        if (this.ambientMuted || this.currentAmbientMode !== 'story-acoustic') return;
        const now = ctx.currentTime;
        const chord = chords[chordIdx % chords.length];
        chordIdx++;

        // Pluck 3 notes
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.22);
          gain.gain.setValueAtTime(0.08 * this.ambientVolume, now + i * 0.22);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.22 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.22);
          osc.stop(now + i * 0.22 + 1.2);
        });

        // Occasional baby swallow chirp
        if (Math.random() > 0.4) {
          const birdOsc = ctx.createOscillator();
          const birdGain = ctx.createGain();
          birdOsc.type = 'sine';
          birdOsc.frequency.setValueAtTime(2400, now + 0.8);
          birdOsc.frequency.exponentialRampToValueAtTime(3200, now + 0.9);
          birdGain.gain.setValueAtTime(0.06 * this.ambientVolume, now + 0.8);
          birdGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
          birdOsc.connect(birdGain);
          birdGain.connect(ctx.destination);
          birdOsc.start(now + 0.8);
          birdOsc.stop(now + 0.95);
        }
      }, 3000);
    } catch (e) {}
  }

  // =========================================================================
  // CHANNEL 2: ACTION SFX TRIGGERS (Polyphonic Dual-Oscillator ADSR)
  // =========================================================================

  // 1. Crisp wooden tile tap when selecting options
  playWoodTileTap() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.38 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (e) {}
  }

  // 2. Harmonic major-third chord + sparkling particle burst on correct matches
  playCorrectMatch() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Ascending pentatonic chord (C5 -> E5 -> G5 -> C6)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });

      // Shimmering chimes
      [1567.98, 2093.00, 2637.02].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.22 + i * 0.05);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, ctx.currentTime + 0.22 + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22 + i * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.22 + i * 0.05);
        osc.stop(ctx.currentTime + 0.22 + i * 0.05 + 0.2);
      });
    } catch (e) {}
  }

  // 3. Gentle low-pitch wobble on incorrect attempts (Soft-Fail, zero buzzer)
  playSoftWobble() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, ctx.currentTime); // B3
      osc.frequency.exponentialRampToValueAtTime(220.00, ctx.currentTime + 0.18); // A3
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  // 4. Soft snoring sound when matching the bear to hibernation
  playBearSnore() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Inhaling low rumble then exhaling snore
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28 * this.sfxVolume, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {}
  }

  // 5. Fur transformation morph chime when hare changes color
  playHareMorph() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Sweeping crystal tone (500Hz -> 1800Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } catch (e) {}
  }

  // 6. Wing-flap flutter when revealing the swallow
  playWingFlap() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180 + i * 20, ctx.currentTime + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + i * 0.08 + 0.06);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + i * 0.08 + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.06);
      }
    } catch (e) {}
  }

  // 7. Paper airplane swoosh launch sound
  playAirplaneWhoosh() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // 8. Full orchestral graduation fanfare
  playClassVictory() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const notes = [
        { f: 523.25, t: 0.00, d: 0.18 },
        { f: 523.25, t: 0.20, d: 0.18 },
        { f: 659.25, t: 0.40, d: 0.25 },
        { f: 783.99, t: 0.70, d: 0.35 },
        { f: 1046.50, t: 1.10, d: 1.20 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.38 * this.sfxVolume, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });
    } catch (e) {}
  }

  // Web Speech API Voice Narration
  speak(text, callback = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = this.speechRate;
      utter.pitch = this.speechPitch;
      utter.lang = 'en-US';
      if (callback) utter.onend = callback;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForestAdaptationAudio;
}
