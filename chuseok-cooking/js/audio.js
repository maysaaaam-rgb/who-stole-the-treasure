/* Chuseok cooking homework: tiny Web Audio helper. Chords only (no single beeps), starts only after the first tap or key.
   Narration uses the platform voice settings: rate 0.88, pitch 1.05, en-US. */
window.CookAudio = (function () {
  'use strict';
  var ctx = null, unlocked = false;
  function ac() {
    if (!unlocked) return null;
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function unlock() { unlocked = true; }
  ['click', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, unlock, { once: true, passive: true }); });

  /* two oscillators per note with a soft attack and an exponential decay */
  function note(freq, start, len, vol) {
    var c = ac(); if (!c) return;
    var g = c.createGain(), t = c.currentTime + start;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(c.destination);
    [['sine', 1], ['triangle', 1.003]].forEach(function (p) {
      var o = c.createOscillator(); o.type = p[0]; o.frequency.value = freq * p[1];
      o.connect(g); o.start(t); o.stop(t + len + 0.05);
    });
  }
  function chord(freqs, gap, len, vol) { freqs.forEach(function (f, i) { note(f, i * gap, len, vol); }); }
  var api = {
    tap: function () { chord([523.25, 659.25], 0.04, 0.25, 0.05); },
    /* correct / done: C5 E5 G5 C6 */
    win: function () { chord([523.25, 659.25, 783.99, 1046.5], 0.11, 0.9, 0.07); },
    /* soft nudge, no buzzer: warm two-tone chime */
    soft: function () { chord([246.94, 220], 0.16, 0.7, 0.06); },
    speak: function (text) {
      try {
        if (!unlocked || !window.speechSynthesis) return;
        var u = new SpeechSynthesisUtterance(text); u.rate = 0.88; u.pitch = 1.05; u.lang = 'en-US';
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      } catch (e) { /* narration is optional */ }
    }
  };
  return api;
})();
