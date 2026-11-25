/* speak-review/js/audio.js — small Web Audio sound set + English voice.
 * Chord sounds only (no single raw beeps). Starts on the first tap.
 */
(function (root) {
  'use strict';
  var ctx = null, muted = false;

  function ac() {
    if (!ctx) {
      var C = root.AudioContext || root.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, vol, type) {
    var c = ac(); if (!c || muted) return;
    var t = c.currentTime + start;
    [0, 3].forEach(function (det) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      o.detune.value = det;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }

  function noise(start, dur, vol, freq) {
    var c = ac(); if (!c || muted) return;
    var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'lowpass'; f.frequency.value = freq || 1800;
    g.gain.value = vol;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(c.destination);
    s.start(c.currentTime + start);
  }

  var SFX = {
    right: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.07, 0.45, 0.10, 'triangle'); }); },
    soft: function () { tone(246.94, 0, 0.35, 0.08); tone(220, 0.16, 0.45, 0.08); },
    tap: function () { noise(0, 0.06, 0.25, 2400); tone(880, 0, 0.08, 0.03, 'triangle'); },
    flip: function () { noise(0, 0.09, 0.35, 1400); },
    point: function () { tone(987.77, 0, 0.14, 0.08, 'triangle'); tone(1318.5, 0.09, 0.3, 0.08, 'triangle'); },
    tick: function () { tone(1200, 0, 0.05, 0.03, 'triangle'); tone(1800, 0, 0.04, 0.015); },
    timeUp: function () { tone(880, 0, 0.12, 0.06); tone(880, 0.18, 0.12, 0.06); tone(659.25, 0.36, 0.6, 0.07, 'triangle'); },
    fanfare: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.14, i === 3 ? 0.9 : 0.25, 0.1, 'triangle'); });
      [659.25, 783.99, 1046.5].forEach(function (f) { tone(f, 0.56, 0.9, 0.05); });
      noise(0.56, 0.5, 0.06, 5000);
    },
    whoosh: function () { noise(0, 0.25, 0.18, 900); }
  };

  var voice = null;
  function pickVoice() {
    if (!root.speechSynthesis) return null;
    var vs = root.speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return /en-US/i.test(v.lang) && /female|samantha|zira|google us/i.test(v.name); })[0] ||
      vs.filter(function (v) { return /en-US/i.test(v.lang); })[0] ||
      vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (root.speechSynthesis) {
    root.speechSynthesis.onvoiceschanged = function () { voice = pickVoice(); };
  }

  function say(text) {
    if (muted || !root.speechSynthesis || !text) return;
    try {
      root.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.rate = 0.88; u.pitch = 1.05; u.lang = 'en-US';
      voice = voice || pickVoice();
      if (voice) u.voice = voice;
      root.speechSynthesis.speak(u);
    } catch (e) {}
  }

  root.SRAudio = {
    play: function (k) { try { if (SFX[k]) SFX[k](); } catch (e) {} },
    say: say,
    unlock: function () { ac(); },
    toggle: function () { muted = !muted; if (muted && root.speechSynthesis) root.speechSynthesis.cancel(); return muted; },
    isMuted: function () { return muted; }
  };
})(window);
