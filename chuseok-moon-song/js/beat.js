/* Moon Beat: a soft folk drum made with the Web Audio API (no recordings, no raw beeps).
   "Dung" = a deep drum thump (two sine oscillators falling in pitch + a low-passed noise knock). "Deok" = a light wood tap (two short sines).
   It starts only after a click (autoplay guard). Pattern per bar of 4 beats: DUNG deok deok deok. */
(function (root) {
  'use strict';
  var ctx = null, timer = null, bpm = 84, beat = 0, count = 0, cb = null, on = false, noise = null;
  function ensure() {
    if (!ctx) { var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function noiseBuf() {
    if (noise) return noise;
    var len = ctx.sampleRate * 0.25, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), i;
    for (i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noise = b; return b;
  }
  function env(g, t, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  function dung(t) {
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
    o1.type = 'sine'; o2.type = 'triangle';
    o1.frequency.setValueAtTime(150, t); o1.frequency.exponentialRampToValueAtTime(62, t + 0.28);
    o2.frequency.setValueAtTime(300, t); o2.frequency.exponentialRampToValueAtTime(124, t + 0.2);
    env(g, t, 0.55, 0.42); o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    n.buffer = noiseBuf(); nf.type = 'lowpass'; nf.frequency.value = 260; env(ng, t, 0.3, 0.12); n.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
    o1.start(t); o2.start(t); n.start(t); o1.stop(t + 0.5); o2.stop(t + 0.5); n.stop(t + 0.2);
  }
  function deok(t) {
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o1.type = 'sine'; o2.type = 'sine'; o1.frequency.value = 820; o2.frequency.value = 1230;
    env(g, t, 0.2, 0.09); o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(t); o2.start(t); o1.stop(t + 0.12); o2.stop(t + 0.12);
  }
  function tick() {
    if (!on || !ctx) return;
    var t = ctx.currentTime + 0.02;
    if (beat === 0) dung(t); else deok(t);
    var b = beat, c = count; beat = (beat + 1) % 4; count++;
    if (cb) { try { cb(b, c); } catch (e) { /* ignore */ } }
    timer = setTimeout(tick, 60000 / bpm);
  }
  var api = {
    start: function (tempo, onBeat) { if (!ensure()) return false; api.stop(); if (tempo) bpm = tempo; cb = onBeat || null; beat = 0; count = 0; on = true; tick(); return true; },
    stop: function () { on = false; if (timer) { clearTimeout(timer); timer = null; } },
    setBpm: function (v) { bpm = Math.max(56, Math.min(120, v)); },
    getBpm: function () { return bpm; },
    isOn: function () { return on; },
    hit: function (kind) { if (!ensure()) return false; var t = ctx.currentTime + 0.01; if (kind === 'dung') dung(t); else deok(t); return true; }
  };
  root.MoonBeat = api;
})(window);
