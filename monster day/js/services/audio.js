/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Audio Service: Web Audio Synthesizer + Web Speech API Karaoke Narrator
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.speechRate = 0.88; // Clear, friendly pace for A1+/A2 learners
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.ambientNodes = [];
    this.currentAmbience = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
      this.stopAmbience();
    }
    return this.isMuted;
  }

  // ==========================================
  // PROCEDURAL SOUND EFFECTS (Web Audio API)
  // ==========================================

  playTap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Arpeggio)
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  playGentleRetry() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25); // C4

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playAnimalChew() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.12;

      osc.type = 'square';
      osc.frequency.setValueAtTime(300 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.06);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  playWaterDrink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.14;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + i * 120, t);
      osc.frequency.exponentialRampToValueAtTime(800 + i * 150, t + 0.08);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  playThunder() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low frequency rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const fanfare = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.35 }, // E5
      { f: 587.33, d: 0.15 }, // D5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.6 }   // G5
    ];

    let t = this.ctx.currentTime;
    fanfare.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);

      t += note.d * 0.9;
    });
  }

  // ==========================================
  // TEXT-TO-SPEECH & KARAOKE HIGHLIGHT
  // ==========================================

  speak(text, highlightContainerElement = null, onComplete = null) {
    if (this.isMuted || !this.synth) {
      if (onComplete) onComplete();
      return;
    }

    this.synth.cancel();

    // Prepare text elements for karaoke word highlight if a container is passed
    if (highlightContainerElement) {
      const words = text.split(/\s+/);
      highlightContainerElement.innerHTML = words
        .map((w, idx) => `<span class="speech-word" id="word-${idx}">${w}</span>`)
        .join(' ');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.speechRate;
    utterance.pitch = 1.1; // Cheerful friendly pitch
    utterance.lang = 'en-US';

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word' && highlightContainerElement) {
        // Highlight active word
        const prevWords = highlightContainerElement.querySelectorAll('.speech-word.speaking');
        prevWords.forEach(el => el.classList.remove('speaking'));

        const targetWord = highlightContainerElement.querySelector(`#word-${wordIndex}`);
        if (targetWord) {
          targetWord.classList.add('speaking');
        }
        wordIndex++;
      }
    };

    utterance.onend = () => {
      if (highlightContainerElement) {
        const activeWords = highlightContainerElement.querySelectorAll('.speech-word.speaking');
        activeWords.forEach(el => el.classList.remove('speaking'));
      }
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      if (onComplete) onComplete();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  stopAmbience() {
    this.ambientNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {
        // Ignore already stopped
      }
    });
    this.ambientNodes = [];
    this.currentAmbience = null;
  }
}

export const audio = new AudioService();
