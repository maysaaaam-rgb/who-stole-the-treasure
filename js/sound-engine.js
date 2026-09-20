/**
 * Adventure Academy - Global Sound System (Harmonic Web Audio Engine)
 * Zero-dependency procedural synthesis for ESL & CLIL educational games.
 * Pure Web Audio API: warm chords, soft pings, safe autoplay unlock.
 */
class AcademySoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this._unlocked = false;

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

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Multi-oscillator chord synthesizer using warm sine/triangle waves.
   * @param {Array<number>} freqs - Frequencies in Hz
   * @param {string} [type='sine'] - Oscillator waveform: 'sine' | 'triangle'
   * @param {number} [duration=0.35] - Note duration in seconds
   * @param {number} [gain=0.15] - Master gain level
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
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Warm rising arpeggio for points/correct answers.
   * Pentatonic root progression (C5 -> E5 -> G5 -> C6).
   */
  playCoin() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  /**
   * Resonant sweep for mystery card flips and point swaps.
   * Filtered frequency glide simulating air movement and card turn.
   */
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
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Gentle low-tone chord for mistakes (no harsh buzzers).
   * Soft descending interval (B3 -> A3).
   */
  playSoftFail() {
    if (!this.enabled) return;
    this.playChord([246.94, 220.00], "sine", 0.35, 0.18);
  }

  /**
   * Multi-note victory arpeggio for completing games or winning matches.
   * Majestic triumphant chord cadence (C Major fanfare).
   */
  playFanfare() {
    if (!this.enabled) return;
    const melody = [
      { f: 523.25, d: 0.15 },  // C5
      { f: 659.25, d: 0.15 },  // E5
      { f: 783.99, d: 0.15 },  // G5
      { f: 1046.50, d: 0.45 }  // C6
    ];

    let delay = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playChord([note.f, note.f * 1.5], "triangle", note.d, 0.2);
      }, delay);
      delay += 110;
    });
  }

  /**
   * Clock tick pulse.
   */
  playTimerTick() {
    if (!this.enabled) return;
    this.playChord([1200], "sine", 0.04, 0.06);
  }

  /**
   * Alert sequence when round or timer expires.
   */
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
