/**
 * Audio Engine for "Who Stole the Treasure?"
 * Uses Web Audio API for rich procedural sound effects and Web Speech API for natural English Text-to-Speech.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.currentUtterance = null;
    this.synth = window.speechSynthesis || null;
    this.voices = [];

    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoice(preferredGender = 'neutral') {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }
    // Prefer English voices (en-US or en-GB)
    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));
    if (enVoices.length === 0) return null;

    if (preferredGender === 'girl' || preferredGender === 'female') {
      const female = enVoices.find(v => /female|zira|samantha|karen|victoria|moira|jenny|amy/i.test(v.name));
      if (female) return female;
    } else if (preferredGender === 'boy' || preferredGender === 'male') {
      const male = enVoices.find(v => /male|david|alex|daniel|george|oliver|guy/i.test(v.name));
      if (male) return male;
    }

    // Default to natural or first English voice
    const natural = enVoices.find(v => /natural|google|premium/i.test(v.name));
    return natural || enVoices[0];
  }

  speak(text, options = {}) {
    if (!this.speechEnabled || !this.synth) return;
    try {
      this.synth.cancel(); // Stop ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.92; // Slightly slower, crisp pace for 3rd graders
      utterance.pitch = options.pitch || (options.gender === 'girl' ? 1.2 : options.gender === 'boy' ? 1.05 : 1.0);
      utterance.volume = options.volume || 1.0;

      const voice = this.getBestVoice(options.gender);
      if (voice) {
        utterance.voice = voice;
      }

      if (options.onEnd) {
        utterance.onend = options.onEnd;
      }

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // --- Web Audio Procedural Sound Effects ---

  // Correct chime (pleasant upward arpeggio)
  playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.36);
    });
  }

  // Wrong / Try again gentle tone
  playWrong() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Button Click / Tap
  playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Clue Reveal Mystery Shimmer
  playClue() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }

  // Vault / Padlock mechanical click
  playLockClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    // Metal click
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);

    // Chime echo
    const chime = this.audioCtx.createOscillator();
    const chimeGain = this.audioCtx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(987.77, now + 0.05); // B5

    chimeGain.gain.setValueAtTime(0.18, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    chime.connect(chimeGain);
    chimeGain.connect(this.audioCtx.destination);

    chime.start(now + 0.05);
    chime.stop(now + 0.36);
  }

  // Stamp / Elimination sound (Heavy thud)
  playEliminate() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Point add bell
  playPoint() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, now); // C6
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Drumroll for big reveal
  playDrumroll(duration = 2.0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const bufferSize = this.audioCtx.sampleRate * duration;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI * 40);
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.3, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  // Grand Victory Fanfare
  playFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },       // C Maj
      { notes: [523.25, 659.25, 783.99], time: 0.22, dur: 0.2 },    // C Maj
      { notes: [523.25, 659.25, 783.99], time: 0.44, dur: 0.2 },    // C Maj
      { notes: [698.46, 880.00, 1046.50], time: 0.7, dur: 0.6 },    // F Maj
      { notes: [783.99, 987.77, 1174.66], time: 1.35, dur: 0.4 },   // G Maj
      { notes: [1046.50, 1318.51, 1567.98], time: 1.8, dur: 1.4 }   // High C Maj
    ];

    const now = this.audioCtx.currentTime;

    chords.forEach(chord => {
      chord.notes.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.time);

        gain.gain.setValueAtTime(0, now + chord.time);
        gain.gain.linearRampToValueAtTime(0.18, now + chord.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + chord.time);
        osc.stop(now + chord.time + chord.dur + 0.05);
      });
    });
  }

  // Alarm siren for "TREASURE IS GONE!"
  playAlarm() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const start = now + i * 0.25;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, start);
      osc.frequency.linearRampToValueAtTime(1100, start + 0.12);
      osc.frequency.linearRampToValueAtTime(600, start + 0.24);

      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(start);
      osc.stop(start + 0.25);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) this.stopSpeech();
    return this.speechEnabled;
  }
}

// Global Sound Instance
window.soundEngine = new SoundEngine();
