/* Polyphonic Web Audio Synthesizer & Neural MP3 + Calibrated TTS Narration
   Conforms to AGENTS.md Section 1.3 (Dual-oscillator ADSR chords, warm soft-fail, rate 0.88, pitch 1.05, en-US, autoplay guard) */
(function (root) {
  'use strict';

  var ctx = null;
  var muted = false;
  var clips = {};
  var clipEl = null;

  fetch('audio/manifest.json?v=2').then(function (r) { return r.json(); }).then(function (m) { clips = m || {}; }).catch(function () {});

  function clipKey(t) {
    return String(t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

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
    [523.25, 659.25, 783.99, 1046.50].forEach(function (f, i) {
      playNote(f, i * 0.065, 0.32, 0.13, 'triangle', 'sine');
    });
  }

  /* Warm descending two-tone sine chime (246.94 Hz -> 220 Hz) */
  function playSoftFail() {
    if (muted) return;
    playNote(246.94, 0, 0.22, 0.11, 'sine', 'triangle');
    playNote(220.00, 0.14, 0.30, 0.10, 'sine', 'triangle');
  }

  /* Card Flip / Tap */
  function playTap() {
    if (muted) return;
    playNote(587.33, 0, 0.09, 0.08, 'sine', 'triangle');
  }

  /* Drum / Clap Rhythm Beat for Music & Turbo Timer */
  function playBeat(high) {
    if (muted) return;
    playNote(high ? 783.99 : 392.00, 0, 0.14, 0.15, 'triangle', 'sine');
    playNote(high ? 1046.50 : 523.25, 0.02, 0.12, 0.11, 'sine', 'triangle');
  }

  /* Water splash chord */
  function playSplash(floats) {
    if (muted) return;
    var notes = floats ? [523.25, 659.25, 783.99] : [392.00, 329.63, 261.63];
    notes.forEach(function (f, i) {
      playNote(f, i * 0.06, 0.28, 0.12, 'sine', 'triangle');
    });
  }

  /* Victory Fanfare */
  function playFanfare() {
    if (muted) return;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach(function (f, i) {
      playNote(f, i * 0.085, 0.45, 0.15, 'triangle', 'sine');
    });
  }

  function stopSpeech() {
    if (clipEl) {
      try { clipEl.onended = clipEl.onerror = null; clipEl.pause(); } catch (e) {}
      clipEl = null;
    }
    try { if ('speechSynthesis' in root) root.speechSynthesis.cancel(); } catch (e) {}
  }

  function speakBrowser(clean, rateOverride) {
    try {
      if (root.EAAVoice && typeof root.EAAVoice.say === 'function') {
        root.EAAVoice.say(clean, { rate: rateOverride || 0.88 });
        return;
      }
      if ('speechSynthesis' in root && typeof root.SpeechSynthesisUtterance === 'function') {
        root.speechSynthesis.cancel();
        var u = new root.SpeechSynthesisUtterance(clean);
        u.lang = 'en-US';
        u.rate = rateOverride || 0.88;
        u.pitch = 1.05;
        root.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  function speak(text, clipId, rateOverride) {
    if (muted || !text) return;
    var clean = String(text).replace(/[_*#]/g, ' ').trim();
    if (!clean) return;
    stopSpeech();
    var file = (clipId && clips[clipId]) || clips[clipKey(clean)];
    if (file && !rateOverride) {
      try {
        clipEl = new root.Audio('audio/' + file);
        clipEl.onerror = function () { clipEl = null; speakBrowser(clean, rateOverride); };
        var p = clipEl.play();
        if (p && p.catch) p.catch(function () { speakBrowser(clean, rateOverride); });
        return;
      } catch (e) {}
    }
    speakBrowser(clean, rateOverride);
  }

  function toggleMute() {
    muted = !muted;
    if (muted) stopSpeech();
    return muted;
  }

  root.ChallengeAudio = {
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playTap: playTap,
    playBeat: playBeat,
    playSplash: playSplash,
    playFanfare: playFanfare,
    speak: speak,
    stopSpeech: stopSpeech,
    toggleMute: toggleMute,
    isMuted: function () { return muted; }
  };
})(typeof window !== 'undefined' ? window : this);
