/**
 * THE 20% ENERGY FREEZE GAME: WEB AUDIO API SYNTHESIZER
 * Upbeat 120 BPM Dance Music, Tape-Brake Freeze Sweep, 528Hz Neuron Hum,
 * Ascending Unfreeze Chimes, and Calibrated Primary ESL TTS.
 * 100% Zero External Dependencies. Autoplay Safe.
 */

(function(root) {
  'use strict';

  let audioCtx = null;
  let isMuted = false;
  let isTtsEnabled = true;

  // Dance music loop state (120 BPM: 500ms beat interval, 125ms 16th-note ticks)
  let danceInterval = null;
  let danceStep = 0;
  let isDancing = false;
  let danceMasterGain = null;

  // Neuron thinking hum state (528 Hz Solfeggio clarity drone + LFO vibrato)
  let neuronOsc = null;
  let neuronLfo = null;
  let neuronShimmer = null;
  let neuronGain = null;
  let isHumming = false;

  function getAudioContext() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
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

  const FreezeAudio = {
    ensureUnlocked: ensureAudioUnlocked,

    toggleMute() {
      isMuted = !isMuted;
      if (isMuted) {
        this.stopDanceMusic();
        this.stopNeuronHum();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
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
     * 1. startDanceMusic()
     * Upbeat 120 BPM looping rhythm with warm square/triangle bassline and filtered noise ticks.
     */
    startDanceMusic() {
      if (isMuted || isDancing) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      this.stopNeuronHum();
      isDancing = true;
      danceStep = 0;

      // Master dance sub-bus with soft limiter
      danceMasterGain = ctx.createGain();
      danceMasterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      danceMasterGain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.15);
      danceMasterGain.connect(ctx.destination);

      // Bass notes progression: F2 (87.31Hz), G2 (98.00Hz), A2 (110.00Hz), C3 (130.81Hz)
      const bassProgression = [
        110.00, 110.00, 130.81, 146.83,
        164.81, 146.83, 130.81, 110.00,
        98.00,  98.00,  110.00, 130.81,
        146.83, 130.81, 110.00, 98.00
      ];

      // 120 BPM = 125ms per 16th note, 250ms per 8th note
      danceInterval = setInterval(() => {
        if (!isDancing || isMuted) return;
        const now = ctx.currentTime;
        const beat16 = danceStep % 16;
        const isQuarterBeat = beat16 % 4 === 0;

        // Kick / Thump on every quarter note (beat 0, 4, 8, 12)
        if (isQuarterBeat) {
          const kick = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(140, now);
          kick.frequency.exponentialRampToValueAtTime(45, now + 0.08);

          kickGain.gain.setValueAtTime(0.35, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          kick.connect(kickGain);
          kickGain.connect(danceMasterGain);
          kick.start(now);
          kick.stop(now + 0.13);
        }

        // Funky Bassline on 8th notes
        if (beat16 % 2 === 0) {
          const freq = bassProgression[beat16] || 110;
          const bass = ctx.createOscillator();
          const bassFilter = ctx.createBiquadFilter();
          const bassGain = ctx.createGain();

          bass.type = 'triangle';
          bass.frequency.setValueAtTime(freq, now);

          bassFilter.type = 'lowpass';
          bassFilter.frequency.setValueAtTime(600, now);
          bassFilter.frequency.exponentialRampToValueAtTime(180, now + 0.15);

          bassGain.gain.setValueAtTime(0.001, now);
          bassGain.gain.linearRampToValueAtTime(0.26, now + 0.015);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

          bass.connect(bassFilter);
          bassFilter.connect(bassGain);
          bassGain.connect(danceMasterGain);

          bass.start(now);
          bass.stop(now + 0.22);
        }

        // Filtered rhythmic noise hat tick on off-beats
        if (beat16 % 2 === 1) {
          const tickOsc = ctx.createOscillator();
          const tickGain = ctx.createGain();
          tickOsc.type = 'square';
          tickOsc.frequency.setValueAtTime(1600, now);
          tickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

          tickGain.gain.setValueAtTime(0.07, now);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

          tickOsc.connect(tickGain);
          tickGain.connect(danceMasterGain);

          tickOsc.start(now);
          tickOsc.stop(now + 0.04);
        }

        danceStep++;
      }, 125);
    },

    stopDanceMusic() {
      isDancing = false;
      if (danceInterval) {
        clearInterval(danceInterval);
        danceInterval = null;
      }
      if (danceMasterGain && audioCtx) {
        const now = audioCtx.currentTime;
        danceMasterGain.gain.cancelScheduledValues(now);
        danceMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      }
    },

    /**
     * 2. triggerFreezeBrake()
     * Dramatic pitch-drop brake sweep (440 Hz -> 60 Hz in 0.25s) cutting the rhythm instantly.
     */
    triggerFreezeBrake() {
      this.stopDanceMusic();
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const brakeOsc = ctx.createOscillator();
      const brakeGain = ctx.createGain();

      brakeOsc.type = 'sawtooth';
      brakeOsc.frequency.setValueAtTime(440, now);
      brakeOsc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      // Lowpass filter closing down
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.25);

      brakeGain.gain.setValueAtTime(0.35, now);
      brakeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      brakeOsc.connect(filter);
      filter.connect(brakeGain);
      brakeGain.connect(ctx.destination);

      brakeOsc.start(now);
      brakeOsc.stop(now + 0.29);

      // Secondary cold ice-crack crunch
      const crackOsc = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crackOsc.type = 'triangle';
      crackOsc.frequency.setValueAtTime(880, now + 0.04);
      crackOsc.frequency.exponentialRampToValueAtTime(200, now + 0.18);

      crackGain.gain.setValueAtTime(0.2, now + 0.04);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      crackOsc.connect(crackGain);
      crackGain.connect(ctx.destination);

      crackOsc.start(now + 0.04);
      crackOsc.stop(now + 0.21);
    },

    /**
     * 3. startNeuronHum()
     * Hypnotic 528 Hz sine wave with slow 3Hz LFO vibrato and sparkling high harmonics
     * representing active mental metabolism while frozen.
     */
    startNeuronHum() {
      if (isMuted || isHumming) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      isHumming = true;
      const now = ctx.currentTime;

      neuronGain = ctx.createGain();
      neuronGain.gain.setValueAtTime(0.0001, now);
      neuronGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      neuronGain.connect(ctx.destination);

      // Core 528 Hz clarity sine tone
      neuronOsc = ctx.createOscillator();
      neuronOsc.type = 'sine';
      neuronOsc.frequency.setValueAtTime(528, now);

      // Slow 3 Hz LFO vibrato for cerebral pulsation
      neuronLfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      neuronLfo.frequency.setValueAtTime(3.2, now);
      lfoGain.gain.setValueAtTime(4.5, now);
      neuronLfo.connect(lfoGain);
      lfoGain.connect(neuronOsc.frequency);

      // Sparkling high overtone (1056 Hz, octave 2)
      neuronShimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      neuronShimmer.type = 'triangle';
      neuronShimmer.frequency.setValueAtTime(1056, now);
      shimmerGain.gain.setValueAtTime(0.04, now);

      neuronOsc.connect(neuronGain);
      neuronShimmer.connect(shimmerGain);
      shimmerGain.connect(neuronGain);

      neuronOsc.start(now);
      neuronLfo.start(now);
      neuronShimmer.start(now);
    },

    /**
     * 4. stopNeuronHum()
     * Gentle fade-out of the thinking tone.
     */
    stopNeuronHum() {
      if (!isHumming) return;
      isHumming = false;

      if (neuronGain && audioCtx) {
        const now = audioCtx.currentTime;
        neuronGain.gain.cancelScheduledValues(now);
        neuronGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      }

      setTimeout(() => {
        try {
          if (neuronOsc) { neuronOsc.stop(); neuronOsc.disconnect(); neuronOsc = null; }
          if (neuronLfo) { neuronLfo.stop(); neuronLfo.disconnect(); neuronLfo = null; }
          if (neuronShimmer) { neuronShimmer.stop(); neuronShimmer.disconnect(); neuronShimmer = null; }
          if (neuronGain) { neuronGain.disconnect(); neuronGain = null; }
        } catch(e) {}
      }, 380);
    },

    /**
     * 5. playUnfreezeChime()
     * Ascending major arpeggio (C5 - E5 - G5 - C6) for unfreezing and successful reveals.
     */
    playUnfreezeChime() {
      this.stopNeuronHum();
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.065;
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        overtone.start(start);
        osc.stop(start + 0.35);
        overtone.stop(start + 0.35);
      });
    },

    /**
     * 6. speakPrompt(text, onComplete)
     * Clear Web Speech TTS calibrated for primary learners (rate: 0.88, pitch: 1.1).
     */
    speakPrompt(text, onComplete = null) {
      if (!isTtsEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
        if (onComplete) setTimeout(onComplete, 600);
        return;
      }

      try {
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.88; // Calibrated for primary ESL clarity
        utter.pitch = 1.10; // Warm, engaging pitch
        utter.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (naturalVoice) utter.voice = naturalVoice;

        utter.onend = () => {
          if (typeof onComplete === 'function') onComplete();
        };

        utter.onerror = () => {
          if (typeof onComplete === 'function') onComplete();
        };

        window.speechSynthesis.speak(utter);
      } catch(e) {
        if (typeof onComplete === 'function') onComplete();
      }
    }
  };

  root.FreezeAudio = FreezeAudio;
})(typeof window !== 'undefined' ? window : global);
