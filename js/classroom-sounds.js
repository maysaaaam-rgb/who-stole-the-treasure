/**
 * English Adventure Academy - Classroom Soundboard Engine
 * Pure Native Web Audio API — Zero External MP3 Dependencies
 * Global Singleton: window.classSoundboard
 */

(function(root) {
  'use strict';

  class ClassroomSoundboard {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initHotkeys();
    }

    /**
     * Lazy-init / unlock Web Audio Context
     */
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    /**
     * Provide tactile visual feedback on dock button when triggered
     */
    triggerVisualFeedback(soundKey) {
      if (typeof document === 'undefined') return;
      const btns = document.querySelectorAll(`.sfx-btn[data-sound="${soundKey}"]`);
      btns.forEach(btn => {
        btn.classList.add('is-active-press');
        setTimeout(() => btn.classList.remove('is-active-press'), 180);
      });
    }

    // =======================================================================
    // 1. 🥳 PARTY HORN / NOISEMAKER (Squealing paper flutter)
    // Multi-oscillator sawtooth (260 Hz -> 460 Hz) with an 18 Hz paper-flutter LFO
    // =======================================================================
    playPartyHorn() {
      this.triggerVisualFeedback('party');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Primary horn squeaker oscillator
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator(); // detuned layer for rich horn buzz
      const hornGain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      // Pitch scoop up then settle (mimics blowing into the horn)
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(460, now + 0.12);
      osc1.frequency.linearRampToValueAtTime(410, now + 0.55);

      osc2.frequency.setValueAtTime(264, now);
      osc2.frequency.exponentialRampToValueAtTime(465, now + 0.12);
      osc2.frequency.linearRampToValueAtTime(414, now + 0.55);

      // 18 Hz paper-flutter LFO for rapid squeaking paper vibration
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(18, now);
      lfoGain.gain.setValueAtTime(48, now);

      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      // Amplitude Envelope
      hornGain.gain.setValueAtTime(0.01, now);
      hornGain.gain.linearRampToValueAtTime(0.38, now + 0.08);
      hornGain.gain.setValueAtTime(0.38, now + 0.45);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

      osc1.connect(hornGain);
      osc2.connect(hornGain);
      hornGain.connect(this.ctx.destination);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + 0.70);
      osc1.stop(now + 0.70);
      osc2.stop(now + 0.70);
    }

    // =======================================================================
    // 2. 🔔 ATTENTION BELL
    // High-resonance triple-sine bell chime (1200 Hz, 1850 Hz, 2400 Hz) with 2.4s ring
    // =======================================================================
    playAttentionBell() {
      this.triggerVisualFeedback('bell');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      const harmonics = [
        { freq: 1200, gain: 0.35, decay: 2.4 },
        { freq: 1850, gain: 0.20, decay: 2.0 },
        { freq: 2400, gain: 0.12, decay: 1.6 }
      ];

      harmonics.forEach(h => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(h.gain, now + 0.005); // sharp metallic strike
        gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + h.decay);
      });
    }

    // =======================================================================
    // 3. 🤫 QUIET CHIME
    // 432 Hz warm singing bowl tone with 3s decay
    // =======================================================================
    playQuietChime() {
      this.triggerVisualFeedback('shhh');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // 432 Hz Fundamental + soft singing bowl harmonics
      const bowlTones = [
        { freq: 432, gain: 0.32, decay: 3.0 },
        { freq: 864, gain: 0.08, decay: 2.5 },
        { freq: 648, gain: 0.05, decay: 2.2 }
      ];

      bowlTones.forEach(tone => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now);

        // Gentle, soft felt mallet attack
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(tone.gain, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + tone.decay);
      });
    }

    // =======================================================================
    // 4. ⏰ COUNTDOWN BUZZER
    // Three 880 Hz pips followed by a deep 140 Hz sawtooth buzzer
    // =======================================================================
    playCountdownBuzzer() {
      this.triggerVisualFeedback('buzzer');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // 3 Warning Pips at 880 Hz (A5)
      const pipTimes = [0, 0.24, 0.48];
      pipTimes.forEach(offset => {
        const pipTime = now + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, pipTime);

        gain.gain.setValueAtTime(0.001, pipTime);
        gain.gain.linearRampToValueAtTime(0.26, pipTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, pipTime + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(pipTime);
        osc.stop(pipTime + 0.10);
      });

      // Big Final Buzzer: Deep 140 Hz Sawtooth
      const buzzTime = now + 0.72;
      const buzzOsc = this.ctx.createOscillator();
      const buzzGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      buzzOsc.type = 'sawtooth';
      buzzOsc.frequency.setValueAtTime(140, buzzTime);
      buzzOsc.frequency.linearRampToValueAtTime(125, buzzTime + 0.60); // slight pitch drop

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, buzzTime);

      buzzGain.gain.setValueAtTime(0.001, buzzTime);
      buzzGain.gain.linearRampToValueAtTime(0.38, buzzTime + 0.02);
      buzzGain.gain.setValueAtTime(0.38, buzzTime + 0.45);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, buzzTime + 0.65);

      buzzOsc.connect(filter);
      filter.connect(buzzGain);
      buzzGain.connect(this.ctx.destination);

      buzzOsc.start(buzzTime);
      buzzOsc.stop(buzzTime + 0.68);
    }

    // =======================================================================
    // 5. 👏 APPLAUSE & CHEERING
    // Bandpass-filtered random pink-noise burst for realistic claps
    // =======================================================================
    playApplause() {
      this.triggerVisualFeedback('clap');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      const duration = 2.0;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Pink Noise Synthesis (Paul Kellet's algorithm) with clapping density variation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;

        // Individual clap bursts amplitude variation
        const clapTremolo = 0.75 + 0.25 * Math.sin(i / 180);
        data[i] = pink * clapTremolo;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass filter to isolate hand-clap frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1050, now);
      filter.Q.setValueAtTime(1.1, now);

      // Volume envelope for the applause crescendo and decay
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.40, now + 0.30);
      gain.gain.setValueAtTime(0.40, now + 1.20);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    }

    // =======================================================================
    // 6. 🪙 COIN CHIME
    // Ascending arpeggio (987 Hz -> 1318 Hz)
    // =======================================================================
    playCoinChime() {
      this.triggerVisualFeedback('coin');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1: 987 Hz (B5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987, now);
      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Note 2: 1318 Hz (E6)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318, now + 0.09);
      gain2.gain.setValueAtTime(0.35, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.48);
    }

    // =======================================================================
    // 7. 🎺 FANFARE
    // 4-note victory chord (C5, E5, G5, C6)
    // =======================================================================
    playFanfare() {
      this.triggerVisualFeedback('fanfare');
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      const notes = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.10 }, // E5
        { freq: 783.99, time: 0.20 }, // G5
        { freq: 1046.50, time: 0.30 } // C6
      ];

      notes.forEach((n, idx) => {
        const noteTime = now + n.time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm brassy triangle waveform
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, noteTime);

        // The final high note (C6) sustains longer as the triumphant anchor
        const isFinal = idx === notes.length - 1;
        const duration = isFinal ? 0.75 : 0.45;

        gain.gain.setValueAtTime(0.01, noteTime);
        gain.gain.linearRampToValueAtTime(0.30, noteTime + 0.02);
        gain.gain.setValueAtTime(0.30, noteTime + (isFinal ? 0.35 : 0.15));
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);
      });
    }

    // =======================================================================
    // HOTKEYS ENGINE
    // P / 1 = Party Horn
    // 2 = Attention Bell
    // 3 = Quiet Singing Bowl (Shhh)
    // 4 = Countdown Buzzer
    // 5 = Applause
    // 6 = XP Coin Chime
    // 7 = Victory Fanfare
    // =======================================================================
    initHotkeys() {
      if (typeof window === 'undefined') return;
      window.addEventListener('keydown', (e) => {
        // Suppress hotkeys when typing in form inputs, textareas, selects, or editable fields
        const target = e.target;
        if (target) {
          const tag = (target.tagName || '').toUpperCase();
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || target.isContentEditable) {
            return;
          }
        }

        const key = (e.key || '').toLowerCase();
        switch (key) {
          case 'p':
          case '1':
            e.preventDefault();
            this.playPartyHorn();
            break;
          case '2':
            e.preventDefault();
            this.playAttentionBell();
            break;
          case '3':
            e.preventDefault();
            this.playQuietChime();
            break;
          case '4':
            e.preventDefault();
            this.playCountdownBuzzer();
            break;
          case '5':
            e.preventDefault();
            this.playApplause();
            break;
          case '6':
            e.preventDefault();
            this.playCoinChime();
            break;
          case '7':
            e.preventDefault();
            this.playFanfare();
            break;
          default:
            break;
        }
      });
    }
  }

  // Export Singleton
  const soundboardInstance = new ClassroomSoundboard();
  root.ClassroomSoundboard = ClassroomSoundboard;
  root.classSoundboard = soundboardInstance;

  // Direct Audio helper aliases for global script convenience
  root.playPartyHorn = () => root.classSoundboard.playPartyHorn();
  root.playAttentionBell = () => root.classSoundboard.playAttentionBell();
  root.playQuietChime = () => root.classSoundboard.playQuietChime();
  root.playCountdownBuzzer = () => root.classSoundboard.playCountdownBuzzer();
  root.playApplause = () => root.classSoundboard.playApplause();
  root.playCoinChime = () => root.classSoundboard.playCoinChime();
  root.playFanfare = () => root.classSoundboard.playFanfare();

})(typeof window !== 'undefined' ? window : this);
