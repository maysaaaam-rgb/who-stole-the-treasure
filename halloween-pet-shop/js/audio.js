/* Halloween Pet Shop sounds: polyphonic Web Audio chords (no raw beeps) + calibrated TTS (rate 0.88, pitch 1.05, en-US).
   The AudioContext starts only after the first tap. */
(function (window) {
  'use strict';
  var ctx = null, muted = false;
  function ensure() {
    if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }
  function tone(freq, dur, type, gainVal, delay) {
    if (muted) return;
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (delay || 0), osc = c.createOscillator(), g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainVal || 0.15, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function noise(dur, freq, gainVal, delay) {
    if (muted) return;
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (delay || 0), len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = 'lowpass'; f.frequency.value = freq || 1800;
    g.gain.setValueAtTime(gainVal || 0.2, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(t0);
  }
  var PetAudio = {
    isOn: function () { return !muted; },
    setOn: function (on) { muted = !on; if (muted && window.speechSynthesis) window.speechSynthesis.cancel(); },
    unlock: function () { ensure(); },
    tap: function () { tone(587.33, 0.09, 'triangle', 0.12, 0); tone(880, 0.11, 'sine', 0.08, 0.03); },
    flip: function () { noise(0.07, 2200, 0.18, 0); tone(392, 0.08, 'triangle', 0.06, 0.01); },
    correct: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, 0.26, 'triangle', 0.15, i * 0.06); tone(f * 1.5, 0.22, 'sine', 0.06, i * 0.06); });
    },
    softFail: function () { tone(246.94, 0.24, 'sine', 0.15, 0); tone(220.0, 0.3, 'sine', 0.13, 0.14); tone(329.63, 0.3, 'triangle', 0.05, 0.14); },
    coin: function () { tone(987.77, 0.1, 'triangle', 0.14, 0); tone(1318.5, 0.26, 'triangle', 0.14, 0.08); tone(1975.5, 0.2, 'sine', 0.04, 0.08); },
    bubble: function () { [0, 0.12, 0.27].forEach(function (d, i) { tone(300 + i * 140, 0.14, 'sine', 0.09, d); tone(450 + i * 210, 0.1, 'sine', 0.04, d + 0.02); }); },
    spooky: function () { [[220, 261.63, 329.63], [207.65, 246.94, 311.13]].forEach(function (ch, j) { ch.forEach(function (f) { tone(f, 0.7, 'sine', 0.06, j * 0.45); tone(f * 2, 0.6, 'triangle', 0.02, j * 0.45); }); }); },
    fanfare: function () { [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { tone(f, 0.36, 'triangle', 0.16, i * 0.09); tone(f / 2, 0.36, 'sine', 0.06, i * 0.09); }); },
    timeUp: function () { [784, 659.25, 523.25].forEach(function (f, i) { tone(f, 0.3, 'triangle', 0.14, i * 0.16); tone(f * 1.26, 0.3, 'sine', 0.05, i * 0.16); }); },
    speak: function (text) {
      if (muted || !window.speechSynthesis || !text) return Promise.resolve();
      return new Promise(function (resolve) {
        try {
          window.speechSynthesis.cancel();
          var u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, 'blank'));
          u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05;
          var done = false, fin = function () { if (!done) { done = true; resolve(); } };
          u.onend = fin; u.onerror = fin;
          setTimeout(fin, 1500 + String(text).length * 90); // some browsers never fire onend
          window.speechSynthesis.speak(u);
        } catch (e) { resolve(); }
      });
    }
  };
  window.PetAudio = PetAudio;
})(window);
