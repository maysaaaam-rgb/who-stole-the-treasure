/**
 * Adventure Academy - Global Sound System (Harmonic Web Audio)
 */
class AcademySoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playChord(frequencies, type = "sine", duration = 0.35, gainLevel = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // Award XP / Positive Points
  playCoin() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Team Swap / Trap Card / Baamboozle effect
  playWhoosh() {
    this.playChord([220, 277.18, 329.63], "triangle", 0.4, 0.18);
  }

  // Soft Fail / Try Again
  playSoftFail() {
    this.playChord([246.94, 220.00], "sine", 0.28, 0.2);
  }

  // Level Up / Victory Fanfare
  playFanfare() {
    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    melody.forEach((freq, idx) => {
      setTimeout(() => this.playChord([freq, freq * 1.5], "triangle", 0.3, 0.15), idx * 110);
    });
  }

  // Timer Tick & Alarm
  playTimerTick() {
    this.playChord([1200], "sine", 0.04, 0.05);
  }

  playTimerAlarm() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playChord([880, 1760], "triangle", 0.2, 0.25), i * 220);
    }
  }
}

if (typeof window !== "undefined") {
  window.AcademySoundEngine = AcademySoundEngine;
  window.academyAudio = new AcademySoundEngine();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AcademySoundEngine };
}
