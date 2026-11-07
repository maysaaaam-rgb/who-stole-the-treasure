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

  /* Recorded neural voices: delegates to Ch1Audio (or plays directly from manifest.json / ch1/manifest.json). Never falls back to robotic browser TTS. */
  var clips = {};
  var clipEl = null;
  var speakTimer = 0;
  var WHO_MAP = { 1: 'bolt', 2: 'lulu', 3: 'nutty', 4: 'ember', bolt: 'bolt', lulu: 'lulu', nutty: 'nutty', ember: 'ember', pip: 'pip', say: 'say' };
  fetch('audio/manifest.json?v=7').then(function (r) { return r.json(); }).then(function (m) {
    Object.keys(m || {}).forEach(function (k) {
      if (typeof m[k] === 'string' && m[k].indexOf('story/') !== 0) {
        clips[k] = m[k].indexOf('audio/') === 0 ? m[k] : ('audio/' + m[k]);
      }
    });
  }).catch(function () {});
  fetch('audio/ch1/manifest.json?v=ch1-20261107c').then(function (r) { return r.json(); }).then(function (m) {
    var lines = (m && (m.lines || m)) || {};
    Object.keys(lines).forEach(function (id) {
      var item = lines[id];
      if (item && item.text && item.file) {
        clips[clipKey(item.text)] = item.file.indexOf('audio/') === 0 ? item.file : ('audio/ch1/' + item.file);
      }
    });
  }).catch(function () {});
  function clipKey(t) { return String(t).toLowerCase().replace(/[\u2018\u2019']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function stopSpeech() {
    clearTimeout(speakTimer);
    if (clipEl) { try { clipEl.onended = clipEl.onerror = null; clipEl.pause(); } catch (e) {} clipEl = null; }
    if (root.Ch1Audio && typeof root.Ch1Audio.stopVoice === 'function') {
      try { root.Ch1Audio.stopVoice(); } catch (e) {}
    }
    try { if ('speechSynthesis' in root) root.speechSynthesis.cancel(); } catch (e) {}
  }

  /* Neural Voice Narration — delegates to Ch1Audio so every line uses recorded character MP3s */
  function speak(text, onEnd, who) {
    var done = typeof onEnd === 'function' ? onEnd : null;
    if (muted || !text) { if (done) done(); return; }
    var clean = String(text).replace(/[_*#]/g, ' ').trim();
    if (!clean) { if (done) done(); return; }
    if (root.Ch1Audio && typeof root.Ch1Audio.speak === 'function') {
      root.Ch1Audio.speak(clean, { who: who }, done);
      return;
    }
    stopSpeech();
    var w = who != null ? WHO_MAP[who] : '';
    var k = clipKey(clean);
    var file = (w && clips[w + ':' + k]) || clips[k];
    if (file) {
      var fired = false;
      var finish = function () { if (fired) return; fired = true; clearTimeout(speakTimer); if (done) done(); };
      try {
        clipEl = new root.Audio(file);
        clipEl.onended = finish;
        clipEl.onerror = function () { clipEl = null; speakTimer = setTimeout(finish, 400); };
        var p = clipEl.play();
        if (p && p.catch) p.catch(function () { speakTimer = setTimeout(finish, 350); });
        speakTimer = setTimeout(finish, 15000);
        return;
      } catch (e) {}
    }
    if (done) speakTimer = setTimeout(done, 450);
  }

  function setMuted(val) {
    muted = !!val;
    try {
      localStorage.setItem('eaa_island_mute', muted ? '1' : '0');
      if (muted) { stopAmbient(); if ('speechSynthesis' in root) root.speechSynthesis.cancel(); }
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

  /* Gentle low-volume background music box melody while a game / multiple-choice mission is open (Zero white-noise static!) */
  var ambient = null;
  var ZONE_MELODIES = {
    1: [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 392.00],
    2: [392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00],
    3: [440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 440.00],
    4: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25]
  };
  function startAmbient(zone) {
    stopAmbient();
    if (muted) return;
    var c = ensureCtx();
    if (!c) return;
    var melody = ZONE_MELODIES[zone] || ZONE_MELODIES[1];
    var step = 0;
    var tick = function () {
      if (muted || document.visibilityState !== 'visible') return;
      // Duck background music softly while TTS voice clip or speechSynthesis is speaking
      var speakingNow = !!(clipEl && !clipEl.paused) || ('speechSynthesis' in root && root.speechSynthesis.speaking);
      var gainLevel = speakingNow ? 0.009 : 0.026;
      var note = melody[step % melody.length];
      var harmony = note * 0.5;
      playNote(note, 0, 0.52, gainLevel, 'sine', 'triangle');
      if (step % 2 === 0) {
        playNote(harmony, 0.02, 0.65, gainLevel * 0.65, 'sine', 'sine');
      }
      step++;
    };
    var timer = setInterval(tick, 680);
    ambient = { timer: timer, zone: zone };
  }

  function stopAmbient() {
    if (!ambient) return;
    if (ambient.timer) clearInterval(ambient.timer);
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
