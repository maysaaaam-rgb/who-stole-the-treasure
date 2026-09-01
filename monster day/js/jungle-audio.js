/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Audio & Speech Synthesis Engine
   Synthesized 100% offline with Web Audio API & Web Speech API
   ========================================================================== */

class JungleAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isSpeechEnabled = true;
    this.ambientNodes = [];
    this.currentUtterance = null;
    this.speechVoice = null;
    
    // Initialize Web Speech voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectChildFriendlyVoice();
      };
      this.selectChildFriendlyVoice();
    }
  }

  initAudioContext() {
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

  selectChildFriendlyVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural English voices (Google, Samantha, Karen, Daniel, natural)
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Zira')
    );
    this.speechVoice = preferred || enVoices[0] || voices[0] || null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  toggleSpeech() {
    this.isSpeechEnabled = !this.isSpeechEnabled;
    if (!this.isSpeechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isSpeechEnabled;
  }

  // =========================================================================
  // WEB SPEECH SYNTHESIS NARRATION
  // =========================================================================
  speak(text, onEndCallback) {
    if (this.isMuted || !this.isSpeechEnabled || !('speechSynthesis' in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 400);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Clean emoji or brackets for natural speech
      const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[🌲🌊⛰️🌾🌱💧🏠🐿️🦝🐸🐻🦊🐺🐇🦉🦅🌰🍓🐟🐛🌿🐭⛈️🌧️💨🚨🎖️⭐🎉]/gu, '')
        .replace(/[\[\]]/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.speechVoice) {
        utterance.voice = this.speechVoice;
      }
      utterance.rate = 0.92; // Slightly slower, clear pace for young ESL learners
      utterance.pitch = 1.05; // Friendly, engaging pitch

      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        if (onEndCallback) onEndCallback();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  // =========================================================================
  // SYNTHESIZED SOUND EFFECTS (WEB AUDIO API)
  // =========================================================================

  // Positive Success Chime
  playSuccess() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
    });
  }

  // Gentle Hint / Try Again Chime
  playHint() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4
    osc.frequency.exponentialRampToValueAtTime(261.63, this.ctx.currentTime + 0.25); // C4

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Thunder Sound Effect
  playThunder() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    // Pink noise buffer for low rumble
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 1.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.9);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Storm Wind Gust
  playWind() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.7);
    filter.frequency.linearRampToValueAtTime(250, this.ctx.currentTime + 1.4);
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Falling Tree / Crash
  playTreeCrash() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // Water Splash / Stream
  playWaterSplash() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    [600, 850, 1100].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, this.ctx.currentTime + idx * 0.05 + 0.12);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.2);
    });
  }

  // Food Munching / Eating
  playMunch() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    [0, 0.12, 0.24].forEach((timeOffset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime + timeOffset);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + timeOffset + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + timeOffset + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + 0.1);
    });
  }

  // Prediction Machine Lever Click / Snap
  playClick() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Star Points Awarded
  playStarPoint() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, this.ctx.currentTime + 0.15); // E6

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  // Grand Fanfare Celebration
  playFanfare() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const sequence = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 523.25, t: 0.16, d: 0.15 }, // C5
      { f: 523.25, t: 0.32, d: 0.15 }, // C5
      { f: 659.25, t: 0.48, d: 0.35 }, // E5
      { f: 783.99, t: 0.85, d: 0.2 },  // G5
      { f: 1046.50, t: 1.08, d: 0.7 }  // C6
    ];

    sequence.forEach(({ f, t, d }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + t);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + t + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + t);
      osc.stop(this.ctx.currentTime + t + d + 0.05);
    });
  }
}

// Global instance
window.jungleAudio = new JungleAudioEngine();
