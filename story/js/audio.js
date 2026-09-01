/**
 * CHILD-FRIENDLY WEB AUDIO SYNTHESIZER
 * Zero external audio dependencies - 100% reliable offline & in classroom
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play named sound effect
   */
  play(name) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      switch (name) {
        case 'wind':
        case 'wind_soft':
          this.playWind(0.3, 2.5);
          break;
        case 'tornado':
        case 'tornado_whoosh':
          this.playTornado();
          break;
        case 'crash':
          this.playCrash();
          break;
        case 'knock':
          this.playKnock();
          break;
        case 'lion_roar':
          this.playLionRoar();
          break;
        case 'magic':
        case 'chime_magic':
          this.playMagicChime();
          break;
        case 'door_creak':
          this.playDoorCreak();
          break;
        case 'bark':
          this.playTotoBark();
          break;
        case 'fanfare':
          this.playFanfare();
          break;
        case 'pop':
        case 'click':
          this.playPop();
          break;
        case 'oil':
        case 'oil_can':
          this.playOilSquirt();
          break;
        case 'witch_cackle':
          this.playWitchCackle();
          break;
        case 'success':
          this.playSuccess();
          break;
        default:
          this.playPop();
      }
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // --- SOUND SYNTHESIS METHODS ---

  playPop() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playWind(volume = 0.3, duration = 2.5) {
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(600, now + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(200, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.5);
    gain.gain.linearRampToValueAtTime(volume * 0.8, now + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playTornado() {
    this.playWind(0.5, 3.2);
    // Add low rumble
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.linearRampToValueAtTime(120, now + 1.5);
    osc.frequency.linearRampToValueAtTime(50, now + 3.0);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.6);
    gain.gain.linearRampToValueAtTime(0.01, now + 3.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 3.0);
  }

  playCrash() {
    const now = this.ctx.currentTime;
    // Noise blast
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.2);
  }

  playKnock() {
    const now = this.ctx.currentTime;
    [0, 0.18].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now + offset);
      osc.frequency.exponentialRampToValueAtTime(60, now + offset + 0.08);

      gain.gain.setValueAtTime(0.5, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  playLionRoar() {
    const now = this.ctx.currentTime;

    // 1. Deep Guttural Vocal Roar (Sawtooth with low pitch surge)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(75, now);
    osc1.frequency.exponentialRampToValueAtTime(160, now + 0.25);
    osc1.frequency.linearRampToValueAtTime(110, now + 0.6);
    osc1.frequency.exponentialRampToValueAtTime(55, now + 1.2);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(60, now);
    osc2.frequency.exponentialRampToValueAtTime(130, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 1.2);

    // LFO for throaty growl vibration (20Hz growl shudder)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(22, now);
    lfoGain.gain.setValueAtTime(0.3, now);
    lfo.connect(lfoGain.gain);

    // Filter for vocal tract formant resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(250, now + 1.2);
    filter.Q.setValueAtTime(4.0, now);

    roarGain.gain.setValueAtTime(0.01, now);
    roarGain.gain.linearRampToValueAtTime(0.65, now + 0.15);
    roarGain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(roarGain);
    roarGain.connect(this.ctx.destination);

    // 2. Breath & Throat Turbulent Noise
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 1.3, this.ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(500, now);
    noiseFilter.frequency.linearRampToValueAtTime(950, now + 0.3);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 1.1);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    // 3. Comedic Timid Whimper / Squeak ("eeps!") right after the roar
    const whimperTime = now + 1.15;
    const whimperOsc = this.ctx.createOscillator();
    const whimperGain = this.ctx.createGain();

    whimperOsc.type = 'sine';
    whimperOsc.frequency.setValueAtTime(620, whimperTime);
    whimperOsc.frequency.linearRampToValueAtTime(420, whimperTime + 0.15);
    whimperOsc.frequency.exponentialRampToValueAtTime(240, whimperTime + 0.5);

    whimperGain.gain.setValueAtTime(0.01, whimperTime);
    whimperGain.gain.linearRampToValueAtTime(0.3, whimperTime + 0.08);
    whimperGain.gain.exponentialRampToValueAtTime(0.001, whimperTime + 0.5);

    whimperOsc.connect(whimperGain);
    whimperGain.connect(this.ctx.destination);

    // Start all nodes
    osc1.start(now);
    osc2.start(now);
    noiseSource.start(now);
    lfo.start(now);
    whimperOsc.start(whimperTime);

    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
    noiseSource.stop(now + 1.3);
    lfo.stop(now + 1.3);
    whimperOsc.stop(whimperTime + 0.55);
  }

  playMagicChime() {
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  playDoorCreak() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(290, now + 0.3);
    osc.frequency.linearRampToValueAtTime(190, now + 0.7);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  playTotoBark() {
    const now = this.ctx.currentTime;
    [0, 0.16].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.linearRampToValueAtTime(850, t + 0.04);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  playFanfare() {
    const now = this.ctx.currentTime;
    const chords = [
      { t: 0, notes: [392, 523.25] },      // G4, C5
      { t: 0.18, notes: [392, 523.25] },
      { t: 0.36, notes: [392, 523.25] },
      { t: 0.54, notes: [523.25, 659.25, 783.99, 1046.50] } // Major chord hold
    ];

    chords.forEach(c => {
      c.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + c.t;
        const dur = (c.t >= 0.54) ? 0.9 : 0.15;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    });
  }

  playOilSquirt() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playWitchCackle() {
    const now = this.ctx.currentTime;
    const steps = [600, 750, 580, 800, 620, 850, 550];
    steps.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.09;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.07);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  playSuccess() {
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }
}

export const sound = new SoundEngine();
