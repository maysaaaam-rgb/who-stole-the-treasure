/**
 * Adventure Academy - Global Sound System (Harmonic Web Audio Engine)
 * Zero-dependency procedural synthesis for ESL & CLIL educational games.
 * Pure Web Audio API: warm harmonic chords, ambient music loops, tactile clicks, and calibrated TTS.
 */

class AcademySoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientEnabled = false;
    this._unlocked = false;

    // Ambient music scheduler state
    this._ambientTimer = null;
    this._ambientGainNode = null;
    this._ambientStep = 0;
    this._ambientVolume = 0.08;

    // Pentatonic scale frequencies in Hz (C Major Pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
    this._pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    // Relaxing arpeggio pattern indices
    this._ambientPattern = [0, 2, 4, 5, 7, 5, 4, 2, 1, 3, 4, 6, 7, 6, 4, 3];

    // Master bus
    this._masterGainNode = null;

    // Safety guard: unlock AudioContext on first user interaction (touch/click/key)
    if (typeof window !== "undefined") {
      const unlockAudio = () => {
        if (!this._unlocked) {
          this.init();
          this._unlocked = true;
          window.removeEventListener("pointerdown", unlockAudio);
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
        }
      };
      window.addEventListener("pointerdown", unlockAudio, { passive: true });
      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
    }
  }

  /**
   * 1. AudioContext initialization and resume guard
   * Handles AudioContext creation, suspended state resumption on user interaction.
   * Sets up a gentle dynamics compressor to eliminate crackling and clipping.
   * @returns {AudioContext|null}
   */
  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Limiter / Compressor to avoid any clipping
        const compressor = this.ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        compressor.knee.setValueAtTime(30, this.ctx.currentTime);
        compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        this._masterGainNode = this.ctx.createGain();
        this._masterGainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this._masterGainNode.connect(compressor);
        compressor.connect(this.ctx.destination);

        // Ambient Gain Bus
        this._ambientGainNode = this.ctx.createGain();
        this._ambientGainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this._ambientGainNode.connect(this._masterGainNode);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * 2. Background Ambient Music Loop
   * A gentle, warm pentatonic arpeggio running on low-gain sine oscillators
   * that loops smoothly without crackling or CPU spikes.
   */
  startAmbient() {
    if (this.ambientEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    this.ambientEnabled = true;

    // Smooth fade in
    const now = ctx.currentTime;
    if (this._ambientGainNode) {
      this._ambientGainNode.gain.cancelScheduledValues(now);
      this._ambientGainNode.gain.setValueAtTime(this._ambientGainNode.gain.value, now);
      this._ambientGainNode.gain.linearRampToValueAtTime(this._ambientVolume, now + 1.2);
    }

    this._ambientStep = 0;
    this._scheduleAmbientNext();
  }

  stopAmbient() {
    this.ambientEnabled = false;
    if (this._ambientTimer) {
      clearTimeout(this._ambientTimer);
      this._ambientTimer = null;
    }

    if (this.ctx && this._ambientGainNode) {
      const now = this.ctx.currentTime;
      this._ambientGainNode.gain.cancelScheduledValues(now);
      this._ambientGainNode.gain.setValueAtTime(this._ambientGainNode.gain.value, now);
      this._ambientGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }
  }

  toggleAmbient() {
    if (this.ambientEnabled) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  setAmbientVolume(vol) {
    this._ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientEnabled && this.ctx && this._ambientGainNode) {
      this._ambientGainNode.gain.setTargetAtTime(this._ambientVolume, this.ctx.currentTime, 0.1);
    }
  }

  _scheduleAmbientNext() {
    if (!this.ambientEnabled || !this.ctx || !this._ambientGainNode) return;

    const patternIdx = this._ambientPattern[this._ambientStep % this._ambientPattern.length];
    const freq = this._pentatonicScale[patternIdx] || 261.63;

    const now = this.ctx.currentTime;
    const noteStart = now + 0.05;
    const noteDuration = 0.95; // Long, airy release

    // Pure warm sine oscillator for arpeggio
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, noteStart);

    // Subtle gentle vibrato (2.5Hz)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(2.5, noteStart);
    lfoGain.gain.setValueAtTime(1.2, noteStart);
    lfo.connect(osc.frequency);

    // Warm envelope: 25ms attack, smooth exponential decay
    gainNode.gain.setValueAtTime(0.0001, noteStart);
    gainNode.gain.linearRampToValueAtTime(0.25, noteStart + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

    osc.connect(gainNode);
    gainNode.connect(this._ambientGainNode);

    lfo.start(noteStart);
    osc.start(noteStart);
    lfo.stop(noteStart + noteDuration);
    osc.stop(noteStart + noteDuration);

    // Every 8 steps, add a deep warm root pedal tone (C3)
    if (this._ambientStep % 8 === 0) {
      const droneOsc = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      droneOsc.type = "sine";
      droneOsc.frequency.setValueAtTime(130.81, noteStart); // C3
      droneGain.gain.setValueAtTime(0.0001, noteStart);
      droneGain.gain.linearRampToValueAtTime(0.18, noteStart + 0.2);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.8);

      droneOsc.connect(droneGain);
      droneGain.connect(this._ambientGainNode);

      droneOsc.start(noteStart);
      droneOsc.stop(noteStart + 3.0);
    }

    this._ambientStep++;

    // Interval between arpeggio notes: 440ms
    this._ambientTimer = setTimeout(() => {
      this._scheduleAmbientNext();
    }, 440);
  }

  /**
   * 3. Interactive SFX Methods
   */

  /**
   * 3a. playChime(): Sparkly high-register arpeggio for discoveries.
   * High-frequency crystal chime (E5 -> G5 -> B5 -> E6 -> G6) with dual sparkle.
   */
  playChime() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98]; // E5, G5, B5, E6, G6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const shimmer = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Shimmer octave overtone
      shimmer.type = "triangle";
      shimmer.frequency.setValueAtTime(freq * 2, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.16, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      shimmer.connect(gain);
      gain.connect(this._masterGainNode || ctx.destination);

      osc.start(startTime);
      shimmer.start(startTime);
      osc.stop(startTime + 0.38);
      shimmer.stop(startTime + 0.38);
    });
  }

  /**
   * 3b. playCoin(): Upbeat harmonic third for XP awards.
   * Two-note harmonic third intervals rising brightly.
   */
  playCoin() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const steps = [
      { freqs: [523.25, 659.25], t: 0 },       // C5 + E5 (Major third)
      { freqs: [783.99, 1046.50], t: 0.09 }    // G5 + C6 (Perfect fourth/octave)
    ];

    steps.forEach(step => {
      const startTime = now + step.t;
      step.freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, startTime);
        osc.frequency.exponentialRampToValueAtTime(f * 1.04, startTime + 0.06);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.26);

        osc.connect(gain);
        gain.connect(this._masterGainNode || ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    });
  }

  /**
   * 3c. playSnap(): Clean physical tactile click for drag-and-drop snapping.
   * Damped impulse burst with instant decay simulating magnetic contact.
   */
  playSnap() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;

    // High transient snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(this._masterGainNode || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);

    // Low thump resonance
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(180, now);
    thump.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    thumpGain.gain.setValueAtTime(0.18, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    thump.connect(thumpGain);
    thumpGain.connect(this._masterGainNode || ctx.destination);

    thump.start(now);
    thump.stop(now + 0.06);
  }

  /**
   * 3d. playSoftFail(): Gentle low sine pulse for incorrect attempts.
   * Warm descending low sine wave (G3 -> E3). Never harsh or punitive.
   */
  playSoftFail() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(196.00, now); // G3
    osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.28); // E3

    sub.type = "triangle";
    sub.frequency.setValueAtTime(98.00, now); // G2 sub
    sub.frequency.exponentialRampToValueAtTime(82.41, now + 0.28);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this._masterGainNode || ctx.destination);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.34);
    sub.stop(now + 0.34);
  }

  /**
   * 3e. playFanfare(): Multi-note victory arpeggio.
   * Majestic 4-note major chord cadence (F4 -> A4 -> C5 -> F5) with rich sustained harmony.
   */
  playFanfare() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { f: 349.23, t: 0.00, dur: 0.18 }, // F4
      { f: 440.00, t: 0.16, dur: 0.18 }, // A4
      { f: 523.25, t: 0.32, dur: 0.20 }, // C5
      { f: 698.46, t: 0.50, dur: 0.65 }  // F5 sustain
    ];

    notes.forEach(n => {
      const startTime = now + n.t;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.f, startTime);

      overtone.type = "triangle";
      overtone.frequency.setValueAtTime(n.f * 1.5, startTime); // Fifth harmonic

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.dur);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this._masterGainNode || ctx.destination);

      osc.start(startTime);
      overtone.start(startTime);
      osc.stop(startTime + n.dur + 0.05);
      overtone.stop(startTime + n.dur + 0.05);
    });
  }

  /**
   * 4. Integrated TTS helper: speakPrompt(text, onComplete)
   * Calibrated speech rate (0.88) and friendly pitch (1.05) for primary ESL learners.
   * @param {string} text - Spoken instructional prompt
   * @param {Function} [onComplete] - Optional callback when utterance finishes
   */
  speakPrompt(text, onComplete = null) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (onComplete) setTimeout(onComplete, 800);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.88; // Calibrated for primary ESL clarity
      utter.pitch = 1.05; // Warm, friendly pitch
      utter.lang = "en-US";

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("David"))
      ) || voices.find(v => v.lang.startsWith("en"));

      if (selectedVoice) {
        utter.voice = selectedVoice;
      }

      utter.onend = () => {
        if (typeof onComplete === "function") onComplete();
      };

      utter.onerror = () => {
        if (typeof onComplete === "function") onComplete();
      };

      window.speechSynthesis.speak(utter);
    } catch(e) {
      if (typeof onComplete === "function") onComplete();
    }
  }

  /**
   * Legacy & Utility Helpers
   */
  playChord(freqs, type = "sine", duration = 0.35, gain = 0.15) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = Array.isArray(freqs) ? freqs : [freqs];
    const noteGain = gain / Math.sqrt(notes.length || 1);

    notes.forEach(freq => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this._masterGainNode || ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  playWhoosh() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.38);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this._masterGainNode || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playTimerTick() {
    if (!this.enabled) return;
    this.playChord([1200], "sine", 0.04, 0.06);
  }

  playTimerAlarm() {
    if (!this.enabled) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playChord([880, 1760], "triangle", 0.2, 0.22);
      }, i * 220);
    }
  }
}

if (typeof window !== "undefined") {
  window.AcademySoundEngine = AcademySoundEngine;
  if (!window.academyAudio) {
    window.academyAudio = new AcademySoundEngine();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AcademySoundEngine };
}
