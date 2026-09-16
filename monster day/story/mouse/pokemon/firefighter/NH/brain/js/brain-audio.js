/**
 * 🧠 THE DAY YOUR BRAIN QUIT! — Audio & Speech Engine
 * Web Audio API procedural sound effects + ambient synthesizer music
 * Web Speech API text-to-speech narration
 * MediaRecorder student voice recording with live waveform visualizer
 * 100% offline, zero external audio assets required.
 */

class BrainAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.musicEnabled = false;
    this.synth = window.speechSynthesis || null;
    this.selectedVoice = null;
    this.ambientInterval = null;
    this.ambientNodes = [];
    
    // Voice recorder state
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordedBlobUrl = null;
    this.isRecording = false;
    this.analyser = null;
    this.animFrameId = null;

    this.initSpeech();
  }

  initContext() {
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

  initSpeech() {
    if (!this.synth) return;
    const updateVoices = () => {
      const voices = this.synth.getVoices();
      const preferred = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Oliver') || v.name.includes('Arthur')))) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];
      if (preferred) {
        this.selectedVoice = preferred;
      }
    };
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
    updateVoices();
  }

  speak(text, onEnd = null) {
    if (!this.speechEnabled || !this.synth) {
      if (onEnd) setTimeout(onEnd, 800);
      return;
    }
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.lang = 'en-US';
    utterance.rate = 0.88; // Clear cadence for ESL learners
    utterance.pitch = 1.12;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth) this.synth.cancel();
  }

  // SFX: Urgent message notification chime
  playNotification() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    [660, 880, 1320].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.22, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.38);
    });
  }

  // SFX: Typewriter click
  playTypewriter() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // SFX: Futuristic Door Opening Whoosh
  playDoorOpen() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise sweep
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.58);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.6);

    // Chime resonance
    const tone = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(587.33, now + 0.3); // D5
    toneGain.gain.setValueAtTime(0.2, now + 0.3);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    tone.connect(toneGain);
    toneGain.connect(this.ctx.destination);
    tone.start(now + 0.3);
    tone.stop(now + 0.95);
  }

  // SFX: Clock ticking for 30-second skimming challenge
  playClockTick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // SFX: Clock Timer Finished
  playClockAlarm() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [880, 880, 880, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.14);
      gain.gain.setValueAtTime(0.15, now + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.14 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.12);
    });
  }

  // SFX: Clue Found! (Magical ascending star arpeggio)
  playClueFound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51]; // C5, E5, G5, B5, C6, E6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });
  }

  // SFX: Correct Answer
  playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.24, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }

  // SFX: Incorrect Answer (gentle low friendly boop)
  playIncorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // SFX: Card Snap (tactile snap when dropping/clicking clue)
  playSnap() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  // SFX: Heartbeat pulse
  playHeartbeat() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Dual beat: Lub-dub
    [0, 0.14].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 65 : 85, now + delay);
      osc.frequency.exponentialRampToValueAtTime(35, now + delay + 0.18);
      gain.gain.setValueAtTime(0.35, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.22);
    });
  }

  // SFX: Grand Celebration Victory Fanfare
  playCelebration() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const chords = [
      { notes: [261.63, 329.63, 392.00], time: 0, dur: 0.35 },    // C major
      { notes: [329.63, 392.00, 523.25], time: 0.38, dur: 0.35 }, // E-G-C
      { notes: [392.00, 493.88, 587.33], time: 0.76, dur: 0.4 },  // G major
      { notes: [523.25, 659.25, 783.99, 1046.50], time: 1.2, dur: 1.2 } // High C major victory
    ];

    chords.forEach(chord => {
      chord.notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.time);
        gain.gain.setValueAtTime(0.18, now + chord.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + chord.time);
        osc.stop(now + chord.time + chord.dur + 0.05);
      });
    });
  }

  // Ambient Procedural Synthesizer Background Music Loop
  startAmbientMusic() {
    if (!this.musicEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    this.stopAmbientMusic();

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.musicEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        // Gentle swelling pad
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 4.0);
        this.ambientNodes.push({ osc, gain });
      });
    };

    playNextChord();
    this.ambientInterval = setInterval(playNextChord, 4000);
  }

  stopAmbientMusic() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        node.osc.stop();
        node.osc.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return this.musicEnabled;
  }

  // Voice Recording & Visualizer for Student Speaking Practice
  async startRecording(canvasElement = null, onRecordedCallback = null) {
    this.initContext();
    this.recordedChunks = [];
    this.recordedBlobUrl = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true;

      // Setup audio visualizer
      if (canvasElement && this.ctx) {
        const source = this.ctx.createMediaStreamSource(stream);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);
        this.drawWaveform(canvasElement);
      }

      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.recordedBlobUrl = URL.createObjectURL(blob);
        // Stop stream tracks
        stream.getTracks().forEach(t => t.stop());
        if (onRecordedCallback) onRecordedCallback(this.recordedBlobUrl);
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.warn("Microphone access simulated / denied:", err);
      // Fallback simulation for classroom devices without mic permissions
      this.isRecording = true;
      if (canvasElement) this.drawSimulatedWaveform(canvasElement);
      setTimeout(() => {
        this.stopRecording();
        if (onRecordedCallback) onRecordedCallback("simulated");
      }, 3500);
      return false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  playRecording() {
    if (this.recordedBlobUrl) {
      const audio = new Audio(this.recordedBlobUrl);
      audio.play();
    }
  }

  drawWaveform(canvas) {
    if (!canvas || !this.analyser) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!this.isRecording) return;
      this.animFrameId = requestAnimationFrame(render);
      this.analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        ctx.fillStyle = `rgb(${dataArray[i] + 100}, 50, 240)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };
    render();
  }

  drawSimulatedWaveform(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const render = () => {
      if (!this.isRecording) return;
      this.animFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 16;
      const barWidth = canvas.width / bars - 2;
      for (let i = 0; i < bars; i++) {
        const h = (Math.sin(Date.now() / 150 + i) * 0.5 + 0.5) * canvas.height * 0.85;
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(i * (barWidth + 2), canvas.height - h, barWidth, h);
      }
    };
    render();
  }
}

if (typeof window !== 'undefined') {
  window.BrainAudioEngine = BrainAudioEngine;
}
