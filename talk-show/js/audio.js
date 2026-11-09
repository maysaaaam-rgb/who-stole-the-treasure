/* Talk Show sounds: all synthesized (Web Audio), started only after the first tap. Voice: rate .88, pitch 1.05, en-US. */
(function (root) {
  'use strict';
  var ctx = null, on = true;
  function ac() {
    if (!ctx) { try { ctx = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  /* two detuned oscillators per note with an ADSR curve */
  function note(f, t0, dur, vol, type) {
    var c = ac(); if (!c || !on) return;
    [0, 4].forEach(function (det) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'triangle'; o.frequency.value = f; o.detune.value = det;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(vol * 0.6, t0 + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    });
  }
  function chord(fs, gap, dur, vol, type) { var c = ac(); if (!c) return; var t = c.currentTime + 0.01; fs.forEach(function (f, i) { note(f, t + i * gap, dur, vol, type); }); }
  function noise(dur, freq, vol, t0) {
    var c = ac(); if (!c || !on) return;
    var n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.9; g.gain.value = vol;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(t0 || c.currentTime);
  }
  var api = {
    unlock: ac,
    toggle: function () { on = !on; if (!on) try { root.speechSynthesis.cancel(); } catch (e) {} return on; },
    isOn: function () { return on; },
    good: function () { chord([523.25, 659.25, 783.99, 1046.5], 0.08, 0.5, 0.12); },          // C5 E5 G5 C6
    star: function () { chord([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.06, 0.7, 0.12, 'sine'); },
    soft: function () { chord([246.94, 220], 0.16, 0.5, 0.1, 'sine'); },                      // warm two-tone, no buzzer
    tap: function () { var c = ac(); if (c) noise(0.05, 1800, 0.25); },
    jingle: function () { chord([392, 523.25, 659.25, 783.99, 659.25, 1046.5], 0.11, 0.45, 0.11); },
    applause: function () {
      var c = ac(); if (!c || !on) return;
      for (var i = 0; i < 70; i++) noise(0.05 + Math.random() * 0.05, 1200 + Math.random() * 2400, 0.35 + Math.random() * 0.3, c.currentTime + Math.random() * 2.2);
    },
    drumroll: function () { var c = ac(); if (!c || !on) return; for (var i = 0; i < 26; i++) noise(0.05, 180 + Math.random() * 60, 0.5, c.currentTime + i * 0.045); chord([523.25, 783.99, 1046.5], 0, 0.6, 0.1); },
    tick: function () { chord([987.77], 0, 0.08, 0.06, 'sine'); },
    end: function () { chord([1318.5, 987.77, 783.99], 0.12, 0.5, 0.1, 'sine'); },
    say: function (text) {
      if (!on || !root.speechSynthesis) return;
      try {
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05;
        var v = root.speechSynthesis.getVoices().filter(function (x) { return /en-US/i.test(x.lang); })[0]; if (v) u.voice = v;
        root.speechSynthesis.speak(u);
      } catch (e) { /* no voice */ }
    }
  };
  root.TSAudio = api;
})(window);
