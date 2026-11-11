/* ==========================================================================
   SOUND DETECTIVES — Web Audio API Polyphonic Synthesizer + Studio MP3 + TTS
   Conforms strictly to AGENTS.md 1.3 (No raw beeps; polyphonic ADSR + Autoplay Guard)
   ========================================================================== */
(function (root) {
  'use strict';

  var ctx = null;
  var unlocked = false;
  var lastSpokenText = '';
  var activeAudioEl = null;

  var MP3_MAP = {
    horse: 'sounds/g4_coconut_horse.mp3',
    thunder: 'sounds/g4_thunder.mp3',
    swords: 'sounds/g4_swords_crash.mp3',
    footsteps: 'sounds/g3_footsteps_run.mp3',
    creak: 'sounds/g4_squeak_chair.mp3',
    crunch: 'sounds/g4_crunch_lettuce.mp3',
    keys: 'sounds/g4_keys_jingle.mp3',
    drum: 'sounds/g4_drum.mp3',
    bird: 'sounds/g4_birds.mp3',
    clapping: 'sounds/g4_clapping.mp3'
  };

  function ensureCtx() {
    if (!unlocked) return null;
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  function unlockAudio() {
    unlocked = true;
    ensureCtx();
  }

  if (typeof document !== 'undefined') {
    ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, unlockAudio, { once: false, passive: true });
    });
  }

  function playNote(freq, startOffset, duration, type, peakGain) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime + (startOffset || 0);
    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    var gain = c.createGain();

    osc1.type = type || 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq * 1.003, t0);

    var pk = peakGain || 0.16;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(pk, t0 + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);

    osc1.start(t0);
    osc2.start(t0);
    osc1.stop(t0 + duration + 0.02);
    osc2.stop(t0 + duration + 0.02);
  }

  function playNoiseBurst(startOffset, duration, filterType, filterFreq, qVal, peakGain) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime + (startOffset || 0);
    var len = Math.max(1, Math.floor(c.sampleRate * duration));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.65));
    }
    var src = c.createBufferSource();
    src.buffer = buf;

    var flt = c.createBiquadFilter();
    flt.type = filterType || 'bandpass';
    flt.frequency.setValueAtTime(filterFreq || 900, t0);
    flt.Q.setValueAtTime(qVal || 2.0, t0);

    var gain = c.createGain();
    var pk = peakGain || 0.22;
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.linearRampToValueAtTime(pk, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0008, t0 + duration);

    src.connect(flt);
    flt.connect(gain);
    gain.connect(c.destination);
    src.start(t0);
  }

  // Mandatory ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
  function playCorrect() {
    unlockAudio();
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function (n, i) {
      playNote(n, i * 0.075, 0.36, 'triangle', 0.18);
    });
  }

  // Mandatory warm descending two-tone sine chime (246.94 Hz -> 220 Hz)
  function playSoftFail() {
    unlockAudio();
    playNote(246.94, 0, 0.26, 'sine', 0.15);
    playNote(220.00, 0.14, 0.34, 'sine', 0.14);
  }

  // Distinct Foley & Beethoven sound effects
  function playSfx(id, preferSynthOnly) {
    unlockAudio();
    if (!preferSynthOnly && MP3_MAP[id]) {
      try {
        if (activeAudioEl) { activeAudioEl.pause(); }
        var a = new Audio(MP3_MAP[id]);
        a.volume = 0.85;
        activeAudioEl = a;
        a.play().catch(function () {});
      } catch (e) {}
    }

    var c = ensureCtx();
    if (!c) return;

    switch (id) {
      case 'horse': // Coconut clip-clop hooves
        [0, 0.14, 0.38, 0.52, 0.76, 0.90].forEach(function (t, idx) {
          var pitch = (idx % 2 === 0) ? 740 : 590;
          playNoiseBurst(t, 0.08, 'bandpass', pitch, 6.5, 0.26);
          playNote(pitch * 0.5, t, 0.07, 'triangle', 0.14);
        });
        break;

      case 'swords': // Metallic swords clashing
        [0, 0.28, 0.58].forEach(function (t, i) {
          playNoiseBurst(t, 0.22, 'highpass', 2200, 3.5, 0.24);
          playNote(1480 + i * 190, t, 0.25, 'sawtooth', 0.1);
          playNote(2120 + i * 130, t + 0.02, 0.28, 'triangle', 0.12);
        });
        break;

      case 'thunder': // Rolling sheet-metal thunder
        playNoiseBurst(0, 1.35, 'lowpass', 240, 1.4, 0.35);
        playNoiseBurst(0.12, 1.1, 'bandpass', 420, 2.2, 0.25);
        playNote(68, 0, 1.1, 'sawtooth', 0.14);
        playNote(52, 0.2, 1.2, 'sine', 0.18);
        break;

      case 'footsteps': // Boots thudding on wooden studio floor
        [0, 0.28, 0.56, 0.84].forEach(function (t, i) {
          playNoiseBurst(t, 0.11, 'lowpass', 320 + (i % 2) * 60, 2.5, 0.28);
          playNote(110 + (i % 2) * 18, t, 0.1, 'sine', 0.18);
        });
        break;

      case 'creak': // Old chair / wooden door creaking
        var t0 = c.currentTime;
        var o1 = c.createOscillator();
        var o2 = c.createOscillator();
        var g = c.createGain();
        o1.type = 'sawtooth';
        o2.type = 'triangle';
        o1.frequency.setValueAtTime(310, t0);
        o1.frequency.linearRampToValueAtTime(520, t0 + 0.45);
        o1.frequency.linearRampToValueAtTime(280, t0 + 0.95);
        o2.frequency.setValueAtTime(318, t0);
        o2.frequency.linearRampToValueAtTime(532, t0 + 0.45);
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.14, t0 + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 1.0);
        o1.connect(g); o2.connect(g); g.connect(c.destination);
        o1.start(t0); o2.start(t0);
        o1.stop(t0 + 1.02); o2.stop(t0 + 1.02);
        break;

      case 'crunch': // Lettuce crunch
        [0, 0.12, 0.26, 0.42].forEach(function (t) {
          playNoiseBurst(t, 0.11, 'bandpass', 1350, 1.8, 0.26);
        });
        break;

      case 'keys': // Metal keys jingling like knight armor
        [0, 0.09, 0.18, 0.29, 0.40, 0.52].forEach(function (t, i) {
          playNote(2400 + (i % 3) * 480, t, 0.12, 'sine', 0.12);
          playNote(3150 + (i % 2) * 620, t + 0.02, 0.1, 'triangle', 0.1);
        });
        break;

      case 'punch': // Big book closing quickly
        playNoiseBurst(0, 0.16, 'lowpass', 480, 1.5, 0.34);
        playNote(95, 0, 0.18, 'triangle', 0.26);
        playNoiseBurst(0.02, 0.08, 'bandpass', 1400, 2.0, 0.22);
        break;

      case 'bird': // Cheerful singing bird
        [0, 0.18, 0.36, 0.6].forEach(function (t, i) {
          playNote(1760 + (i % 2) * 320, t, 0.14, 'sine', 0.14);
          playNote(2240 + (i % 2) * 260, t + 0.06, 0.12, 'sine', 0.14);
        });
        break;

      case 'whisper': // Soft quiet breathy whisper
        playNoiseBurst(0, 0.45, 'bandpass', 1650, 3.2, 0.06);
        playNoiseBurst(0.5, 0.4, 'bandpass', 1850, 3.5, 0.05);
        break;

      case 'drum': // Booming concert drum
        [0, 0.32, 0.64].forEach(function (t) {
          playNote(82, t, 0.32, 'sine', 0.32);
          playNote(123, t, 0.22, 'triangle', 0.18);
          playNoiseBurst(t, 0.12, 'lowpass', 360, 1.5, 0.22);
        });
        break;

      case 'clapping': // Cheering audience clapping
        for (var k = 0; k < 10; k++) {
          playNoiseBurst(k * 0.09, 0.08, 'bandpass', 1100 + (k % 3) * 240, 1.8, 0.18);
        }
        playNote(523.25, 0.1, 0.7, 'triangle', 0.1);
        playNote(659.25, 0.15, 0.7, 'triangle', 0.1);
        playNote(783.99, 0.2, 0.7, 'triangle', 0.1);
        break;

      case 'piano_calm': // Beethoven Ode to Joy / gentle piano melody
        var mel = [329.63, 329.63, 349.23, 392.00, 392.00, 349.23, 329.63, 293.66];
        mel.forEach(function (f, idx) {
          playNote(f, idx * 0.22, 0.28, 'triangle', 0.16);
          if (idx % 4 === 0) playNote(f * 0.5, idx * 0.22, 0.65, 'sine', 0.1);
        });
        break;

      case 'piano_sad': // Slow minor piano phrase for sad/worried moments
        var sadMel = [220.00, 261.63, 246.94, 196.00, 220.00];
        sadMel.forEach(function (f, idx) {
          playNote(f, idx * 0.32, 0.42, 'sine', 0.15);
          playNote(f * 0.5, idx * 0.32, 0.45, 'triangle', 0.09);
        });
        break;

      case 'orchestra_chord': // Dramatic Beethoven symphonic chord
        [130.81, 196.00, 261.63, 329.63, 392.00, 523.25].forEach(function (f) {
          playNote(f, 0, 1.15, 'sawtooth', 0.09);
          playNote(f, 0.02, 1.2, 'triangle', 0.12);
        });
        break;

      case 'clock': // Quiet clock ticking
        [0, 0.35, 0.70, 1.05].forEach(function (t, i) {
          playNoiseBurst(t, 0.03, 'bandpass', i % 2 === 0 ? 1800 : 1450, 8.0, 0.08);
        });
        break;

      case 'fireworks': // Loud fireworks boom
        playNote(440, 0, 0.25, 'sine', 0.14);
        playNoiseBurst(0.24, 0.55, 'lowpass', 620, 1.2, 0.34);
        playNoiseBurst(0.32, 0.45, 'highpass', 1800, 2.0, 0.22);
        break;

      case 'leaves': // Quiet wind in leaves
        playNoiseBurst(0, 0.9, 'bandpass', 680, 2.5, 0.06);
        break;

      default:
        playCorrect();
    }
  }

  function speak(text, keepLast) {
    if (!text) return;
    if (keepLast !== false) lastSpokenText = text;
    if (!unlocked || typeof root.speechSynthesis === 'undefined') return;
    try {
      root.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'en-US';
      u.rate = 0.88;
      u.pitch = 1.05;
      root.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function listenAgain() {
    unlockAudio();
    if (lastSpokenText) speak(lastSpokenText, true);
  }

  var PRAISE_LIST = [
    'Great job, detective!',
    'Well done!',
    'Awesome ears, detective!',
    'Spot on! You found it!'
  ];

  function praise() {
    var msg = PRAISE_LIST[Math.floor(Math.random() * PRAISE_LIST.length)];
    speak(msg, false);
  }

  root.SDAudio = {
    unlock: unlockAudio,
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playSfx: playSfx,
    speak: speak,
    listenAgain: listenAgain,
    praise: praise
  };
})(typeof window !== 'undefined' ? window : this);
