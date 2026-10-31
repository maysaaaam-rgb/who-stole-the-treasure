/* Practice Island — Polyphonic Web Audio Synthesizer & TTS Helper
   Conforms to AGENTS.md Section 1.3 (Dual-oscillator ADSR chords, warm soft-fail, autoplay guard). */
(function (root) {
  'use strict';

  var ctx = null;
  var muted = false;

  try {
    muted = localStorage.getItem('eaa_island_mute') === '1';
  } catch (e) {}

  function ensureCtx() {
    if (muted) return null;
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) {
        try { ctx = new AC(); } catch (e) { ctx = null; }
      }
    }
    if (ctx && ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  function playNote(freq, startOffset, duration, peakGain, typeA, typeB) {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime + (startOffset || 0);
    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    var gain = c.createGain();

    osc1.type = typeA || 'triangle';
    osc2.type = typeB || 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.003, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain || 0.14, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + (duration || 0.28));

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + (duration || 0.28) + 0.02);
    osc2.stop(now + (duration || 0.28) + 0.02);
  }

  /* Ascending C-Major Pentatonic Chord (C5 -> E5 -> G5 -> C6) */
  function playCorrect() {
    if (muted) return;
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.065, 0.32, 0.13, 'triangle', 'sine');
    });
  }

  /* Warm descending two-tone sine chime (246.94 Hz -> 220 Hz) */
  function playSoftFail() {
    if (muted) return;
    playNote(246.94, 0, 0.22, 0.11, 'sine', 'triangle');
    playNote(220.00, 0.14, 0.30, 0.10, 'sine', 'triangle');
  }

  /* Soft tactile tap / card flip */
  function playTap() {
    if (muted) return;
    playNote(587.33, 0, 0.09, 0.08, 'sine', 'triangle');
  }

  /* Celebratory fanfare for Mission Complete, Chest & Level Up */
  function playFanfare() {
    if (muted) return;
    var notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.09, 0.45, 0.15, 'triangle', 'sine');
    });
  }

  /* Monster hop sound (springy ascending frequency sweep 300 -> 520 Hz) */
  function playHop() {
    if (muted) return;
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.16);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /* Chest opening: warm G-Major chord arpeggio with shimmering decay */
  function playChest() {
    if (muted) return;
    var notes = [392.00, 493.88, 587.33, 783.99, 987.77];
    notes.forEach(function (f, i) {
      playNote(f, 0.06 + (i * 0.07), 0.42, 0.14, 'triangle', 'sine');
    });
  }

  /* Level up: radiant 6-note triumphal fanfare */
  function playLevelUp() {
    if (muted) return;
    var notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.08, 0.50, 0.16, 'triangle', 'sine');
    });
  }

  /* Streak flame chime: fast sparkling chime */
  function playStreak() {
    if (muted) return;
    var notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.05, 0.35, 0.12, 'sine', 'triangle');
    });
  }

  /* Bottle cork pop sound */
  function playPop() {
    if (muted) return;
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  /* Firework burst sound */
  function playFirework() {
    if (muted) return;
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.45);
    // Sparkle tail
    setTimeout(function () {
      playSparkle();
    }, 180);
  }

  /* High golden sparkle chime */
  function playSparkle() {
    if (muted) return;
    var notes = [1046.50, 1318.51, 1567.98, 2093.00];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.045, 0.28, 0.10, 'sine', 'triangle');
    });
  }

  /* Recorded voices: island/audio/manifest.json maps a line to its file. A line with no recording falls back to the browser's voice. */
  var clips = {};
  var clipEl = null;
  var speakTimer = 0;
  fetch('audio/manifest.json').then(function (r) { return r.json(); }).then(function (m) { clips = m || {}; }).catch(function () {});
  function clipKey(t) { return String(t).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function stopSpeech() {
    clearTimeout(speakTimer);
    if (clipEl) { try { clipEl.onended = clipEl.onerror = null; clipEl.pause(); } catch (e) {} clipEl = null; }
    try { if ('speechSynthesis' in root) root.speechSynthesis.cancel(); } catch (e) {}
  }

  /* Calibrated TTS Narration (rate: 0.88, pitch: 1.05, lang: en-US). onEnd runs when the voice has finished (also when muted). */
  function speak(text, onEnd) {
    var done = typeof onEnd === 'function' ? onEnd : null;
    if (muted || !text) { if (done) done(); return; }
    var clean = String(text).replace(/[_*#]/g, ' ').trim();
    if (!clean) { if (done) done(); return; }
    stopSpeech();
    var file = clips[clipKey(clean)];
    if (file) {
      var fired = false;
      var finish = function () { if (fired) return; fired = true; clearTimeout(speakTimer); if (done) done(); };
      try {
        clipEl = new root.Audio('audio/' + file);
        clipEl.onended = finish;
        clipEl.onerror = function () { clipEl = null; speakBrowser(clean); speakTimer = setTimeout(finish, 900 + clean.length * 70); };
        var p = clipEl.play();
        if (p && p.catch) p.catch(function () { speakTimer = setTimeout(finish, 300); });
        speakTimer = setTimeout(finish, 15000);
        return;
      } catch (e) { /* use the browser voice */ }
    }
    speakBrowser(clean);
    if (done) speakTimer = setTimeout(done, 900 + clean.length * 70);
  }
  function speakBrowser(clean) {
    try {
      if (root.EAAVoice && typeof root.EAAVoice.say === 'function') {
        root.EAAVoice.say(clean, { rate: 0.88 });
        return;
      }
      if ('speechSynthesis' in root && typeof root.SpeechSynthesisUtterance === 'function') {
        root.speechSynthesis.cancel();
        var u = new root.SpeechSynthesisUtterance(clean);
        u.lang = 'en-US';
        u.rate = 0.88;
        u.pitch = 1.05;
        root.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  function setMuted(val) {
    muted = !!val;
    try {
      localStorage.setItem('eaa_island_mute', muted ? '1' : '0');
      if (muted && 'speechSynthesis' in root) root.speechSynthesis.cancel();
    } catch (e) {}
    return muted;
  }

  function toggleMute() {
    return setMuted(!muted);
  }

  /* Funny "boing" for a wrong answer in the games: two notes sliding up */
  function playBoing() {
    playNote(196, 0, 0.09, 0.05, 'sine', 'triangle');
    playNote(330, 0.07, 0.16, 0.05, 'sine', 'triangle');
  }

  /* Echo Cave: the same little chord, three times, further away each time */
  function playEcho() {
    [0, 0.26, 0.52].forEach(function (t, i) {
      var g = 0.09 / (i + 1);
      playNote(392 - i * 40, t, 0.24, g, 'sine', 'triangle');
      playNote(587 - i * 60, t + 0.02, 0.24, g * 0.7, 'sine', 'triangle');
    });
  }

  /* Soft sound of each zone while its game is open: birds, waves, leaves, a low rumble */
  var ambient = null;
  function startAmbient(zone) {
    stopAmbient();
    var c = ensureCtx();
    if (!c) return;
    var len = c.sampleRate * 3, buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    var filter = c.createBiquadFilter(), gain = c.createGain();
    var cfg = { 1: ['highpass', 3200, 0.006], 2: ['lowpass', 620, 0.03], 3: ['highpass', 2200, 0.009], 4: ['lowpass', 150, 0.05] }[zone] || ['lowpass', 500, 0.01];
    filter.type = cfg[0];
    filter.frequency.value = cfg[1];
    gain.gain.value = cfg[2];
    src.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    var lfo = null;
    if (zone === 2) {
      lfo = c.createOscillator();
      var depth = c.createGain();
      lfo.frequency.value = 0.16;
      depth.gain.value = 0.016;
      lfo.connect(depth);
      depth.connect(gain.gain);
      lfo.start();
    }
    src.start();
    var chirps = (zone === 1 || zone === 3) ? setInterval(function () {
      if (document.visibilityState !== 'visible' || Math.random() < 0.45) return;
      playNote(1760 + Math.random() * 600, 0, 0.07, 0.012, 'sine', 'sine');
      playNote(2200 + Math.random() * 500, 0.09, 0.07, 0.01, 'sine', 'sine');
    }, 2600) : null;
    ambient = { src: src, lfo: lfo, chirps: chirps, gain: gain };
  }

  function stopAmbient() {
    if (!ambient) return;
    try { ambient.src.stop(); ambient.gain.disconnect(); if (ambient.lfo) ambient.lfo.stop(); } catch (e) {}
    if (ambient.chirps) clearInterval(ambient.chirps);
    ambient = null;
  }

  root.IslandAudio = {
    playBoing: playBoing,
    playEcho: playEcho,
    startAmbient: startAmbient,
    stopAmbient: stopAmbient,
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playTap: playTap,
    playFanfare: playFanfare,
    playHop: playHop,
    playChest: playChest,
    playLevelUp: playLevelUp,
    playStreak: playStreak,
    playPop: playPop,
    playFirework: playFirework,
    playSparkle: playSparkle,
    speak: speak,
    stopSpeech: stopSpeech,
    isMuted: function () { return muted; },
    setMuted: setMuted,
    toggleMute: toggleMute
  };

})(typeof window !== 'undefined' ? window : this);
