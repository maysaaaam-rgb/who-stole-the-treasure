/**
 * LEARNING AND YOUR BRAIN — HARMONIC WEB AUDIO SYNTHESIZER & TTS MANAGER
 * Zero external audio files, 100% synthesized browser oscillators.
 * Autoplay safe: Initializes on first user interaction.
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

  // Ensure AudioContext is active on user gesture
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
     * Synaptic Pulse Sound
     * Quick resonant electrical tick when a neuron fires or a lobe is highlighted
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
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    },

    /**
     * Node / Synapse Connection Click
     * High-tech tactile pop when dropping or selecting a sensory token
     */
    playNodeConnect(pitch = 520) {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(pitch, now);
      osc1.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.08);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(pitch * 2, now);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2.5, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.19);
      osc2.stop(now + 0.19);
    },

    /**
     * Harmonic Success Arpeggio (C-Major Pentatonic)
     * Played when a match is correct or a step in the reading chain completes
     */
    playSuccessArpeggio() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      // C5, E5, G5, C6 notes
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    },

    /**
     * Power-Up Sweep
     * Upward frequency sweep with resonant boost when battery is charged
     */
    playPowerUpSweep() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    },

    /**
     * Soft Fail / Retry Sound
     * Gentle descending dual tone (no harsh buzzing; encourages second attempt)
     */
    playSoftFail() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const tones = [380, 310];

      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, startTime + 0.15);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    },

    /**
     * Victory Fanfare
     * Triumphant harmonic chord progression when mission is supercharged
     */
    playVictoryFanfare() {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Polyphonic fanfare chords: C maj -> F maj -> G maj -> C maj with octave
      const chordGroups = [
        { time: 0.0, freqs: [261.63, 329.63, 392.00] },       // C4, E4, G4
        { time: 0.22, freqs: [349.23, 440.00, 523.25] },      // F4, A4, C5
        { time: 0.44, freqs: [392.00, 493.88, 587.33] },      // G4, B4, D5
        { time: 0.72, freqs: [523.25, 659.25, 783.99, 1046.50] } // C5, E5, G5, C6 sustained
      ];

      chordGroups.forEach(cg => {
        const chordTime = now + cg.time;
        const dur = cg.time > 0.6 ? 0.9 : 0.28;

        cg.freqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordTime);

          gain.gain.setValueAtTime(0.001, chordTime);
          gain.gain.linearRampToValueAtTime(0.12, chordTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, chordTime + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(chordTime);
          osc.stop(chordTime + dur + 0.05);
        });
      });
    },

    /**
     * ESL Text-to-Speech Engine
     * Uses browser native Web Speech API with gentle pacing for A1-A2 ESL learners
     */
    speak(text, onEnd) {
      if (isMuted || !isTtsEnabled) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Gentle, clear speed for young ESL learners
      utterance.pitch = 1.05; // Friendly warm pitch
      utterance.lang = 'en-US';

      // Pick an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Junior')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (typeof onEnd === 'function') {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    },

    stopSpeech() {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  root.BrainAudio = BrainAudio;
})(typeof window !== 'undefined' ? window : global);
