/**
 * Web Audio API Sound Effects & Speech Synthesis Engine
 * Strict compliance with AGENTS.md audio synthesis laws:
 * - Zero external mp3 dependencies
 * - Polyphonic musical chords with dual-oscillator ADSR curves
 * - Filtered noise bursts for physical card flip simulation
 * - Calibrated SpeechSynthesis: rate 0.88, pitch 1.05, en-US
 * - Autoplay guard: audio context boots on first user gesture
 */

class TeaPartyAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentUtterance = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  /**
   * Card Flip: Low-pass filtered noise burst + subtle snap oscillator
   * simulating a physical card flick and deck shuffle
   */
  playCardFlip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Filtered noise burst (frictional card snap)
    const bufferSize = this.ctx.sampleRate * 0.07; // 70ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(t);

    // 2. Subtle low-mid snap body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Card Select / High-Res Chime: Ascending C-Major pentatonic chord
   * (C5 -> E5 -> G5 -> C6) with exponential decay ramps
   */
  playCardSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const start = t + idx * 0.05;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 1.002, start); // subtle chorus detune

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + 0.55);
      osc2.stop(start + 0.55);
    });
  }

  /**
   * Tea Party Porcelain Teacup Clink
   * Resonant dual high-sine glass chime with 1.2s sustain
   */
  playTeacupClink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const partials = [2093.00, 3135.96, 4186.01]; // C7, G7, C8 harmonic ring

    partials.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const amp = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9 + idx * 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  /**
   * Royal Fanfare / Act IV Trigger:
   * Polyphonic brass chord with warm detune
   */
  playRoyalFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { notes: [261.63, 329.63, 392.00], time: 0.0, dur: 0.25 }, // C4, E4, G4
      { notes: [293.66, 369.99, 440.00], time: 0.25, dur: 0.25 }, // D4, F#4, A4
      { notes: [329.63, 415.30, 493.88], time: 0.5, dur: 0.3 },  // E4, G#4, B4
      { notes: [523.25, 659.25, 783.99, 1046.5], time: 0.8, dur: 0.9 } // C5, E5, G5, C6
    ];

    const t = this.ctx.currentTime;

    chords.forEach(c => {
      const chordStart = t + c.time;
      c.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, chordStart);
        filter.frequency.exponentialRampToValueAtTime(3200, chordStart + 0.1);

        osc.frequency.setValueAtTime(f, chordStart);

        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(0.08, chordStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + c.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(chordStart);
        osc.stop(chordStart + c.dur + 0.05);
      });
    });
  }

  /**
   * TTS Narration calibrated strictly to AGENTS.md invariant:
   * rate: 0.88, pitch: 1.05, lang: "en-US"
   */
  speakText(text, onStart = null, onEnd = null) {
    if (this.isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';

    // Try finding preferred English voices
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.lang === 'en-US' || v.lang === 'en-GB') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Serena') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => { if (onEnd) onEnd(); };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

// Global singleton instance
window.teaPartyAudio = new TeaPartyAudioEngine();
