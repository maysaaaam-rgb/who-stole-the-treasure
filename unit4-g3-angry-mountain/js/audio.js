/* Procedural Polyphonic Web Audio + Calibrated TTS (rate: 0.88, pitch: 1.05, en-US) */
(function (window) {
  'use strict';
  var ctx = null, muted = false;
  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }
  function tone(freq, dur, type, gainVal, delay) {
    if (muted) return;
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainVal || 0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  }
  var ProAudio = {
    isOn: function () { return !muted; },
    setOn: function (on) { muted = !on; if (muted && window.speechSynthesis) window.speechSynthesis.cancel(); },
    tap: function () { tone(587.33, 0.09, 'triangle', 0.14, 0); tone(880, 0.11, 'sine', 0.10, 0.03); },
    correct: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone(f, 0.24, 'triangle', 0.16, i * 0.06);
        tone(f * 1.5, 0.22, 'sine', 0.07, i * 0.06);
      });
    },
    softFail: function () {
      tone(246.94, 0.22, 'sine', 0.16, 0);
      tone(220.00, 0.28, 'triangle', 0.14, 0.14);
    },
    fanfare: function () {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        tone(f, 0.34, 'triangle', 0.18, i * 0.08);
      });
    },
    rumble: function () {
      [110, 130.81, 98].forEach(function (f, i) { tone(f, 0.45, 'sawtooth', 0.09, i * 0.12); });
    },
    speak: function (text, onBoundary) {
      if (muted || !window.speechSynthesis || !text) return Promise.resolve();
      return new Promise(function (resolve) {
        try {
          window.speechSynthesis.cancel();
          var u = new SpeechSynthesisUtterance(String(text));
          u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05;
          var iv = setInterval(function () { if (onBoundary) onBoundary(); }, 140);
          u.onend = function () { clearInterval(iv); resolve(); };
          u.onerror = function () { clearInterval(iv); resolve(); };
          window.speechSynthesis.speak(u);
        } catch (e) { resolve(); }
      });
    }
  };
  window.ProAudio = ProAudio;
})(window);
