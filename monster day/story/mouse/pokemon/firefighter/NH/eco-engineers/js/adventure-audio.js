/**
 * ADVENTURE ACADEMY AUDIO ENGINE: HARMONIC WEB AUDIO SYNTHESIZER
 * Pure Web Audio API & Speech Synthesis. 100% Zero External Dependencies.
 * Polyphonic triads, rising sparkle chimes, soft-fail descending tones, victory fanfare.
 * Autoplay safe: Activates strictly on user interaction.
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

  const AdventureAudio = {
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
     * 1. Tactile Resonance Pulse
     * Snappy feedback on interactive card selection or circuit click
     */
    playPulse(freq = 640) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    },

    /**
     * 2. Magnetic Node Snap Chime
     * Polyphonic dual tone when an energy conduit or module clicks into position
     */
    playNodeSnap(baseFreq = 523.25) { // C5
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const tones = [baseFreq, baseFreq * 1.5]; // Perfect fifth

      tones.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.03);
        osc.frequency.exponentialRampToValueAtTime(f * 1.05, now + i * 0.03 + 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.03);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.03 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.24);
      });
    },

    /**
     * 3. Positive XP & Boost Jingle: Rising Sparkle Chime
     * Dual-frequency rising triad (C5 -> E5 -> G5 -> C6)
     */
    playRisingChime() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.30);
      });
    },

    /**
     * 4. Soft-Fail Tone: Elastic, Descending Tone
     * Gentle descending sine-triangle pair (G4 -> E4 -> C4). Never harsh or punitive.
     */
    playSoftFail() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25); // C4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.30);
    },

    /**
     * 5. Stage Clear & Victory Fanfare
     * 4-Note Polyphonic Major Fanfare (F4 -> A4 -> C5 -> F5)
     */
    playVictoryFanfare() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { f: 349.23, t: 0.00, dur: 0.16 }, // F4
        { f: 440.00, t: 0.16, dur: 0.16 }, // A4
        { f: 523.25, t: 0.32, dur: 0.18 }, // C5
        { f: 698.46, t: 0.50, dur: 0.55 }  // F5 sustain
      ];

      notes.forEach(n => {
        const start = now + n.t;
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, start);

        sub.type = 'triangle';
        sub.frequency.setValueAtTime(n.f * 0.5, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.20, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);

        osc.connect(gain);
        sub.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        sub.start(start);
        osc.stop(start + n.dur + 0.05);
        sub.stop(start + n.dur + 0.05);
      });
    },

    /**
     * 6. Speed Relay Step Zap
     * Rising arpeggio step (1, 2, 3)
     */
    playRelayStep(step = 1) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [440, 660, 880];
      const f = freqs[Math.min(step - 1, freqs.length - 1)] || 440;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 1.35, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    },

    /**
     * 7. Ambient Pad Chord (C Major / E Minor harmonic atmosphere)
     */
    playAmbientPad() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const triad = [261.63, 329.63, 392.00]; // C4, E4, G4

      triad.forEach(freq => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    },

    /**
     * 8. Native ESL Speech Synthesis with Word Boundary Event Hook
     */
    speak(text, onBoundaryCallback = null, onEndCallback = null) {
      if (!isTtsEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
        if (onEndCallback) setTimeout(onEndCallback, 1200);
        return;
      }

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.88; // Clear pedagogical tempo for primary ESL
      utter.pitch = 1.05;
      utter.lang = 'en-US';

      // Pick an English voice
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David')));
      if (engVoice) utter.voice = engVoice;

      if (onBoundaryCallback) {
        utter.onboundary = (event) => {
          if (event.name === 'word') {
            onBoundaryCallback(event.charIndex, event.charLength || 0);
          }
        };
      }

      utter.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      utter.onerror = () => {
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utter);
    }
  };

  root.AdventureAudio = AdventureAudio;
})(typeof window !== 'undefined' ? window : global);
