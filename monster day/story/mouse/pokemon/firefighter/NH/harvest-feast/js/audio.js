/**
 * harvest-feast/js/audio.js
 * Dual-Channel Web Audio API Soundscape & Procedural Action SFX Engine
 * Conforms strictly to Rule 1.3: Polyphonic dual-oscillator musical chords & procedural synthesis.
 */

class HarvestAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.sfxVolume = 0.8;
    this.ambientVolume = 0.35;
    this.sfxMuted = false;
    this.ambientMuted = false;
    this.speechRate = 0.88;
    this.speechPitch = 1.05;

    // Ambient Loop Nodes & Timers
    this.currentAmbientMode = null; // 'farm' | 'kitchen' | 'chuseok' | null
    this.ambientNodes = [];
    this.ambientInterval = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // =========================================================================
  // CHANNEL 1: AMBIENT STEREO SOUNDSCAPES
  // =========================================================================

  stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.currentAmbientMode = null;
  }

  playAmbient(sceneMode) {
    if (this.currentAmbientMode === sceneMode && this.ambientNodes.length > 0) return;
    this.stopAmbient();
    this.currentAmbientMode = sceneMode;

    if (this.ambientMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (sceneMode === 'farm') {
      this.startFarmSoundscape(ctx);
    } else if (sceneMode === 'kitchen') {
      this.startKitchenSoundscape(ctx);
    } else if (sceneMode === 'chuseok') {
      this.startChuseokSoundscape(ctx);
    }
  }

  // Farm: Rustling wind through wheat + periodic cricket and bird chirps
  startFarmSoundscape(ctx) {
    try {
      // 1. Gentle rustling wind noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      // Low frequency oscillator for wind gusts
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.ambientVolume * 0.18, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      lfo.start();

      this.ambientNodes.push(noise, filter, lfo, lfoGain, gain);

      // 2. Periodic crickets & distant birds
      this.ambientInterval = setInterval(() => {
        if (this.ambientMuted || this.currentAmbientMode !== 'farm') return;
        const now = ctx.currentTime;
        if (Math.random() > 0.4) {
          // Cricket chirps (rapid twin pips)
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(4600, now);
          g.gain.setValueAtTime(0.02 * this.ambientVolume, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } else {
          // Bird tweet
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2200, now);
          osc.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
          g.gain.setValueAtTime(0.03 * this.ambientVolume, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      }, 1600);
    } catch (e) {
      console.warn('Farm ambient error:', e);
    }
  }

  // Kitchen: Bubbling soup pops + warm indoor room presence + spoon clatter
  startKitchenSoundscape(ctx) {
    try {
      // Warm low hearth tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(85, ctx.currentTime);
      gain.gain.setValueAtTime(this.ambientVolume * 0.12, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      this.ambientNodes.push(osc, gain);

      // Stochastic bubbling soup pops
      this.ambientInterval = setInterval(() => {
        if (this.ambientMuted || this.currentAmbientMode !== 'kitchen') return;
        const now = ctx.currentTime;
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        const baseFreq = 180 + Math.random() * 160;
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(baseFreq, now);
        popOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.08);

        popGain.gain.setValueAtTime(0.06 * this.ambientVolume, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        popOsc.connect(popGain);
        popGain.connect(ctx.destination);
        popOsc.start(now);
        popOsc.stop(now + 0.09);
      }, 450);
    } catch (e) {
      console.warn('Kitchen ambient error:', e);
    }
  }

  // Chuseok: Traditional Court Rhythm & Gayageum Pluck Melody
  startChuseokSoundscape(ctx) {
    try {
      const pentatonicScale = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // G4, A4, C5, D5, E5, G5
      let stepIndex = 0;

      this.ambientInterval = setInterval(() => {
        if (this.ambientMuted || this.currentAmbientMode !== 'chuseok') return;
        const now = ctx.currentTime;

        // Plucked Gayageum string note
        const noteFreq = pentatonicScale[stepIndex % pentatonicScale.length];
        stepIndex++;

        const pluckOsc = ctx.createOscillator();
        const pluckGain = ctx.createGain();
        pluckOsc.type = 'triangle';
        pluckOsc.frequency.setValueAtTime(noteFreq, now);

        pluckGain.gain.setValueAtTime(0.12 * this.ambientVolume, now);
        pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        pluckOsc.connect(pluckGain);
        pluckGain.connect(ctx.destination);
        pluckOsc.start(now);
        pluckOsc.stop(now + 0.45);

        // Every 4th beat: deep drum pulse
        if (stepIndex % 4 === 0) {
          const drumOsc = ctx.createOscillator();
          const drumGain = ctx.createGain();
          drumOsc.type = 'sine';
          drumOsc.frequency.setValueAtTime(110, now);
          drumOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
          drumGain.gain.setValueAtTime(0.18 * this.ambientVolume, now);
          drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          drumOsc.connect(drumGain);
          drumGain.connect(ctx.destination);
          drumOsc.start(now);
          drumOsc.stop(now + 0.28);
        }
      }, 650);
    } catch (e) {
      console.warn('Chuseok ambient error:', e);
    }
  }

  toggleAmbientMute() {
    this.ambientMuted = !this.ambientMuted;
    if (this.ambientMuted) {
      this.stopAmbient();
    } else if (this.currentAmbientMode) {
      this.playAmbient(this.currentAmbientMode);
    }
    return !this.ambientMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    return !this.sfxMuted;
  }

  // =========================================================================
  // CHANNEL 2: ACTION SOUND EFFECTS (SFX)
  // =========================================================================

  // 1. Crisp wooden block click upon card selection
  playWoodBlockClick() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.4 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playWoodClick() {
    this.playWoodBlockClick();
  }

  // 2. High-tempo harmonic chord fanfare + sparkling audio chimes (Correct Match)
  playCorrectFanfare() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * 0.07 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.32);
      });

      // Sparkles
      [1318.51, 1567.98, 2093.00].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.28 + i * 0.06);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, ctx.currentTime + 0.28 + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28 + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.28 + i * 0.06);
        osc.stop(ctx.currentTime + 0.28 + i * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playHarmonicFanfare() {
    this.playCorrectFanfare();
  }

  // 3. Soft wooden "thud" with screen shake (Incorrect Drop - Soft-fail)
  playSoftThud() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // 4. Deep ceremonial gong ring + steam release hiss (Songpyeon Unlock)
  playGongAndSteam() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // Resonant Korean Gong harmonics (110Hz + 220Hz + 330Hz)
      const harmonics = [110, 220, 330, 440];
      harmonics.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const initialAmp = (0.4 / (idx + 1)) * this.sfxVolume;
        gain.gain.setValueAtTime(initialAmp, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 3.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.2);
      });

      // Steam release hiss (filtered noise burst)
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      const steamGain = ctx.createGain();
      steamGain.gain.setValueAtTime(0.3 * this.sfxVolume, ctx.currentTime);
      steamGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      noise.connect(filter);
      filter.connect(steamGain);
      steamGain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // 5. Full orchestral victory fanfare with cheering crowd FX
  playClassVictory() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const fanfareNotes = [
        { f: 523.25, t: 0.00, d: 0.20 },
        { f: 523.25, t: 0.22, d: 0.18 },
        { f: 523.25, t: 0.42, d: 0.18 },
        { f: 659.25, t: 0.62, d: 0.45 },
        { f: 783.99, t: 1.10, d: 0.35 },
        { f: 1046.50, t: 1.48, d: 1.20 }
      ];

      fanfareNotes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });

      // Cheering applause noise simulation
      const cheerSize = ctx.sampleRate * 2.5;
      const cheerBuf = ctx.createBuffer(1, cheerSize, ctx.sampleRate);
      const cdata = cheerBuf.getChannelData(0);
      for (let i = 0; i < cheerSize; i++) {
        cdata[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const cheerSource = ctx.createBufferSource();
      cheerSource.buffer = cheerBuf;
      const cheerFilter = ctx.createBiquadFilter();
      cheerFilter.type = 'bandpass';
      cheerFilter.frequency.setValueAtTime(1200, ctx.currentTime + 0.8);
      cheerFilter.Q.setValueAtTime(1.8, ctx.currentTime);
      const cheerGain = ctx.createGain();
      cheerGain.gain.setValueAtTime(0.01, ctx.currentTime + 0.8);
      cheerGain.gain.linearRampToValueAtTime(0.25 * this.sfxVolume, ctx.currentTime + 1.2);
      cheerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

      cheerSource.connect(cheerFilter);
      cheerFilter.connect(cheerGain);
      cheerGain.connect(ctx.destination);
      cheerSource.start(ctx.currentTime + 0.8);
    } catch (e) {}
  }

  // 6. Ethereal Rising Bell Chime for Lantern Launch
  playLanternAscend() {
    if (this.sfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {}
  }

  // Web Speech API Voice Narration
  speak(text, callback = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = this.speechRate;
      utter.pitch = this.speechPitch;
      utter.lang = 'en-US';
      if (callback) utter.onend = callback;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HarvestAudioEngine;
}
