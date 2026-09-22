/**
 * CAT VS. DOG: PREPOSITION CATAPULT — POLYPHONIC WEB AUDIO SYNTHESIZER
 * Zero MP3/WAV dependencies. Pure native Web Audio API & Web Speech TTS.
 */

(function(root) {
  'use strict';

  class BattleAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.isMuted = false;
      this.bgmPlaying = false;
      this.bgmInterval = null;
      this.currentWhistleNode = null;
      this.unlocked = false;

      // TTS setup
      this.ttsVoice = null;
      this.ttsRate = 0.88;
      this.ttsPitch = 1.05;
      this.ttsLang = 'en-US';

      this._initTTSVoices();
    }

    // Lazy initialization guarded by user interaction
    ensureAudioContext() {
      if (this.ctx && this.ctx.state === 'running') return true;

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return false;

        if (!this.ctx) {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          this.bgmGain = this.ctx.createGain();
          this.sfxGain = this.ctx.createGain();

          this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.bgmGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
          this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

          this.bgmGain.connect(this.masterGain);
          this.sfxGain.connect(this.masterGain);
          this.masterGain.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }

        this.unlocked = true;
        return true;
      } catch (e) {
        console.warn('AudioContext initialization deferred:', e);
        return false;
      }
    }

    _initTTSVoices() {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;
        // Find English voice, preferably child/female friendly
        const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('David')));
        this.ttsVoice = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
      };

      pickVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pickVoice;
      }
    }

    // Calibrated Speech Synthesis
    speak(text, onWordBoundary, onEnd) {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      try {
        window.speechSynthesis.cancel(); // Clear pending utterances
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.ttsRate;
        utterance.pitch = this.ttsPitch;
        utterance.lang = this.ttsLang;
        if (this.ttsVoice) utterance.voice = this.ttsVoice;

        if (onWordBoundary) {
          utterance.onboundary = (e) => {
            if (e.name === 'word') {
              onWordBoundary(e.charIndex, e.charLength || 5);
            }
          };
        }

        if (onEnd) {
          utterance.onend = onEnd;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }

    stopSpeech() {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    // 85 BPM Walking Bassline BGM
    startBGM() {
      if (this.bgmPlaying) return;
      if (!this.ensureAudioContext()) return;

      this.bgmPlaying = true;
      const bpm = 85;
      const beatDuration = 60 / bpm; // ~0.705s
      const bassLine = [
        65.41, // C2
        82.41, // E2
        98.00, // G2
        110.00, // A2
        116.54, // Bb2
        110.00, // A2
        98.00,  // G2
        73.42   // D2
      ];

      let step = 0;
      const playStep = () => {
        if (!this.bgmPlaying || !this.ctx || this.isMuted) return;

        const freq = bassLine[step % bassLine.length];
        const now = this.ctx.currentTime;

        // Triangle Bass Note with Low-Pass warmth
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.24, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + (beatDuration * 0.85));

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + beatDuration);

        // Hi-hat tick every quarter beat
        this._playGentleTick(now);

        step++;
      };

      playStep();
      this.bgmInterval = setInterval(playStep, beatDuration * 1000);
    }

    stopBGM() {
      this.bgmPlaying = false;
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
    }

    _playGentleTick(time) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'highpass';
      osc.frequency.setValueAtTime(8000, time);

      gain.gain.setValueAtTime(0.02, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(time);
      osc.stop(time + 0.04);
    }

    // Artillery Whistle: 1600 Hz -> 380 Hz with subtle pitch vibrato during flight
    startArtilleryWhistle() {
      if (!this.ensureAudioContext() || this.isMuted) return null;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 1.6);

      // Vibrato
      vibrato.frequency.setValueAtTime(8, now);
      vibratoGain.gain.setValueAtTime(18, now);
      vibrato.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      vibrato.start(now);
      osc.start(now);

      this.currentWhistleNode = { osc, gain, vibrato, vibratoGain };
      return this.currentWhistleNode;
    }

    stopArtilleryWhistle() {
      if (!this.currentWhistleNode || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        this.currentWhistleNode.gain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
        this.currentWhistleNode.osc.stop(now + 0.06);
        this.currentWhistleNode.vibrato.stop(now + 0.06);
      } catch (e) {
        // Ignored
      }
      this.currentWhistleNode = null;
    }

    // Impact Crunch: 40ms white-noise transient + sub-boom sine drop (140 Hz -> 40 Hz)
    playImpactCrunch() {
      if (!this.ensureAudioContext() || this.isMuted) return;

      const now = this.ctx.currentTime;

      // 1. White-Noise Transient (40ms)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.045);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);

      // 2. Sub-Boom Sine Drop (140 Hz -> 40 Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);

      subOsc.start(now);
      subOsc.stop(now + 0.4);
    }

    // Wood Splinter: Rapid square-wave tick sequence (180 Hz, 110 Hz, 75 Hz)
    playWoodSplinter() {
      if (!this.ensureAudioContext() || this.isMuted) return;

      const freqs = [180, 110, 75];
      freqs.forEach((freq, idx) => {
        const time = this.ctx.currentTime + (idx * 0.035);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.22, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(time);
        osc.stop(time + 0.06);
      });
    }

    // Acoustic Snap Click for Stage 2 Drag-and-Drop
    playSnapClick() {
      if (!this.ensureAudioContext() || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.055);
    }

    // Pentatonic Ascending Bell Chime (Stage 1 Card Inspection)
    playBellChime() {
      if (!this.ensureAudioContext() || this.isMuted) return;

      // C5, D5, E5, G5, A5
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + (idx * 0.07);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.5);
      });
    }

    // 5-Note Major Fanfare for Victory (Stage 4)
    playVictoryFanfare() {
      if (!this.ensureAudioContext() || this.isMuted) return;

      // C4, E4, G4, C5, E5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const durations = [0.15, 0.15, 0.15, 0.22, 0.65];
      let offset = 0;

      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + offset;
        const dur = durations[idx];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + dur + 0.05);

        offset += dur * 0.85;
      });
    }

    // Cat Meow Vocal
    playCatVocal() {
      if (!this.ensureAudioContext() || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.4);
    }

    // Dog Bark Vocal
    playDogVocal() {
      if (!this.ensureAudioContext() || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.22);
    }
  }

  root.BattleAudio = new BattleAudioEngine();

})(typeof window !== 'undefined' ? window : this);
