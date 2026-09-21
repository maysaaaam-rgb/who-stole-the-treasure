/**
 * BRAIN EXPLORERS: HARMONIC WEB AUDIO SYNTHESIZER & SPEECH ENGINE
 * Zero external dependencies. 100% browser oscillators & speech synthesis.
 * Autoplay safe: Activates on first user gesture.
 */

(function(root) {
  'use strict';

  let audioCtx = null;
  let isMuted = false;
  let isTtsEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function ensureAudioUnlocked() {
    getAudioContext();
  }

  if (typeof window !== 'undefined') {
    ['click', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, ensureAudioUnlocked, { once: true, passive: true });
    });
  }

  const BrainAudio = {
    ensureUnlocked: ensureAudioUnlocked,

    toggleMute() {
      isMuted = !isMuted;
      if (isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return isMuted;
    },

    isMuted() {
      return isMuted;
    },

    toggleTts() {
      isTtsEnabled = !isTtsEnabled;
      if (!isTtsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return isTtsEnabled;
    },

    isTtsEnabled() {
      return isTtsEnabled;
    },

    /**
     * Synaptic Pulse
     * Quick resonant tick when a neuron activates
     */
    playSynapticPulse(freq = 640) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    },

    /**
     * Tactile Node Connect
     * Snappy feedback when chip snaps into lobe slot
     */
    playNodeConnect(pitch = 520) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 2.2, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    },

    /**
     * Major-Third Harmonic Chime
     * Warm dual-sine chord (C5 + E5) celebrating a correct lobe match
     */
    playMajorThirdChime(rootFreq = 523.25) { // C5 & E5
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const thirdFreq = rootFreq * 1.25992; // Just / equal tempered major third (~E5)
      const octaveFreq = rootFreq * 2;      // C6 sparkle

      const freqs = [rootFreq, thirdFreq, octaveFreq];
      const gains = [0.14, 0.12, 0.06];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.001, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(gains[idx], now + idx * 0.03 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + 0.6);
      });
    },

    /**
     * Elastic Soft-Fail Tone
     * Gentle descending elastic bounce when student places chip in incorrect lobe
     */
    playSoftFail() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Bounce down: 440Hz -> 280Hz -> 320Hz
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.20);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    },

    /**
     * Speed Relay Zap
     * Electrifying rising beam sound as node is activated in reading relay
     */
    playSpeedRelayZap(stepIndex = 1) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const baseFreq = 480 * Math.pow(1.25, stepIndex);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);

      // Low pass filter to keep tone silky
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    },

    /**
     * Power-Up Sweep
     * Ascending energetic chime when battery charges or axon thickens
     */
    playPowerUpSweep() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [392, 493.88, 587.33, 783.99, 987.77]; // G4, B4, D5, G5, B5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = now + idx * 0.045;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    },

    /**
     * Studio Broadcast Cue Beep
     */
    playStudioCueBeep() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    },

    /**
     * Polyphonic Victory Fanfare
     */
    playVictoryFanfare() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const chordNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

      arpeggio.forEach((note, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const t = now + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.48);
      });

      // Big triumphant chord sustain
      const chordStart = now + 0.6;
      chordNotes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, chordStart);

        gain.gain.setValueAtTime(0.001, chordStart);
        gain.gain.linearRampToValueAtTime(0.10, chordStart + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chordStart);
        osc.stop(chordStart + 1.25);
      });
    },

    /**
     * Spoken English TTS
     */
    speak(text, onEnd) {
      if (isMuted || !isTtsEnabled || !window.speechSynthesis) {
        if (onEnd) setTimeout(onEnd, 100);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.90; // Natural, clear cadence for primary learners
        utterance.pitch = 1.05; // Friendly, warm pedagogical tone
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')) && v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;

        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = onEnd;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        if (onEnd) onEnd();
      }
    },

    /**
     * Karaoke Word-by-Word Spoken Teleprompter
     * Calls onWord(wordIndex, word) as the speech progresses.
     */
    speakKaraoke(text, words, onWord, onEnd) {
      if (isMuted || !isTtsEnabled || !window.speechSynthesis) {
        // Fallback simulation when TTS is off/muted
        let wIdx = 0;
        const interval = Math.max(300, 2400 / (words.length || 1));
        const timer = setInterval(() => {
          if (wIdx < words.length) {
            if (onWord) onWord(wIdx, words[wIdx]);
            wIdx++;
          } else {
            clearInterval(timer);
            if (onEnd) onEnd();
          }
        }, interval);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')) && v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;

        let lastIndex = 0;
        let wordPointer = 0;

        // Boundary event for modern browsers
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            if (wordPointer < words.length) {
              if (onWord) onWord(wordPointer, words[wordPointer]);
              wordPointer++;
            }
          }
        };

        // Fallback word step timer in case boundary is unsupported
        const fallbackStepMs = Math.max(320, 2800 / (words.length || 1));
        const fallbackTimer = setInterval(() => {
          if (wordPointer === 0 || wordPointer < lastIndex) {
            if (lastIndex < words.length) {
              if (onWord) onWord(lastIndex, words[lastIndex]);
              lastIndex++;
            }
          }
        }, fallbackStepMs);

        utterance.onend = () => {
          clearInterval(fallbackTimer);
          if (words.length > 0 && onWord) {
            // Ensure last word was highlighted
            onWord(words.length - 1, words[words.length - 1]);
          }
          if (onEnd) setTimeout(onEnd, 300);
        };

        utterance.onerror = () => {
          clearInterval(fallbackTimer);
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        if (onEnd) onEnd();
      }
    },

    stopSpeaking() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  root.BrainAudio = BrainAudio;
})(typeof window !== 'undefined' ? window : global);
