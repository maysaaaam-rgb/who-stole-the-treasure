/**
 * Monster Evolution Studio Harmonic Audio & Voice Engine
 * Zero-dependency Web Audio API with ADSR envelopes & natural TTS voice selection
 */
class StudioAudioEngine {
  constructor() {
    this.ctx = null;
    this.voice = null;
    this.isMuted = false;
    this.initVoiceSelector();
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

  initCtx() {
    this.init();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
    }
    return this.isMuted;
  }

  // --- Voice Engine: Filter for Natural Human Voices ---
  initVoiceSelector() {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prioritize natural neural browser voices over flat robotic local synthesizers
      this.voice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Jenny") || v.name.includes("Ava"))
      ) || voices.find(v => v.lang.startsWith("en")) || null;
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  speak(text, onComplete) {
    if (this.isMuted || !("speechSynthesis" in window)) {
      if (onComplete) onComplete();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.88;   // Supportive cadence for primary A1+ learners
    utterance.pitch = 1.06;  // Warm, cheerful pitch
    utterance.lang = "en-US";

    if (onComplete) utterance.onend = onComplete;
    window.speechSynthesis.speak(utterance);
  }

  speakText(text, onBoundary = null, onEnd = null) {
    if (this.isMuted || !("speechSynthesis" in window)) {
      if (typeof onEnd === "function") onEnd();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.88;
    utterance.pitch = 1.06;
    utterance.lang = "en-US";

    if (typeof onBoundary === "function") {
      utterance.onboundary = (e) => {
        if (e.name === "word") {
          onBoundary(e.charIndex, e.charLength || 0);
        }
      };
    }

    utterance.onend = () => {
      if (typeof onEnd === "function") onEnd();
    };

    utterance.onerror = () => {
      if (typeof onEnd === "function") onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- Web Audio: Harmonic Synthesis (Zero Raw Bleeps) ---

  // Tactile Mechanical Snap / Switch Click (Filtered FM transient)
  playSnap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.linearRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Positive XP Chime: Dual-tone harmonic interval (B5 -> E6)
  playXP() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 987.77, delay: 0 },    // B5
      { f: 1318.51, delay: 0.08 } // E6
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.f, now + note.delay);

      gain.gain.setValueAtTime(0.22, now + note.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.delay);
      osc.stop(now + note.delay + 0.35);
    });
  }

  // Soft-Fail: Warm descending minor third (No harsh buzzers)
  playSoftFail() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chords = [
      { f: 246.94, delay: 0 },    // B3
      { f: 220.00, delay: 0.1 }   // A3
    ];

    chords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(c.f, now + c.delay);
      osc.frequency.exponentialRampToValueAtTime(c.f * 0.9, now + c.delay + 0.22);

      gain.gain.setValueAtTime(0.18, now + c.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.delay + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + c.delay);
      osc.stop(now + c.delay + 0.22);
    });
  }

  // Victory Fanfare: Rising 4-note major arpeggio with overtone ring
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = "sine";
      overtone.frequency.setValueAtTime(freq * 2, now); // Octave sparkle

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.35);
      overtone.stop(now + 0.35);
    });
  }

  // Rubber stamp slam sound (punchy low-frequency thud with spring friction)
  playStampSlam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// Global instance exports
const studioAudio = new StudioAudioEngine();
window.SoundAudio = studioAudio;
window.monsterEvolutionAudio = studioAudio;
