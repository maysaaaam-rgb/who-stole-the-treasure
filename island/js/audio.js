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

  /* Calibrated TTS Narration (rate: 0.88, pitch: 1.05, lang: en-US) */
  function speak(text) {
    if (muted || !text) return;
    var clean = String(text).replace(/[_*#]/g, ' ').trim();
    if (!clean) return;
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

  root.IslandAudio = {
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playTap: playTap,
    playFanfare: playFanfare,
    playHop: playHop,
    playChest: playChest,
    playLevelUp: playLevelUp,
    playStreak: playStreak,
    speak: speak,
    isMuted: function () { return muted; },
    setMuted: setMuted,
    toggleMute: toggleMute
  };

})(typeof window !== 'undefined' ? window : this);
