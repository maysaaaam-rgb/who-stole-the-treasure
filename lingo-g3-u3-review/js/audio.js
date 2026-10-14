/* Sound for the Lingo lessons: the monsters' recorded voices (voice/<id>.mp3) and soft synthesized musical effects.
   Nothing starts before the first tap (autoplay guard). There is no computer voice: a line without a recording is only shown in the bubble. */
(function (root) {
  'use strict';
  var ctx = null, master = null, analyser = null, current = null, muted = false, manifest = {};

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.connect(master);
  }
  function loadManifest() {
    return fetch('voice/manifest.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (m) { manifest = m || {}; }, function () { manifest = {}; });
  }

  /* one note with a soft attack and an exponential fall (two oscillators slightly apart = warm) */
  function note(freq, at, len, vol, type) {
    if (!ctx || muted) return;
    var t = ctx.currentTime + (at || 0);
    [0, 4].forEach(function (cents, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = i ? 'triangle' : (type || 'sine'); o.frequency.value = freq; o.detune.value = cents;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime((vol || 0.18) * (i ? 0.5 : 1), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.5));
      o.connect(g); g.connect(master); o.start(t); o.stop(t + (len || 0.5) + 0.05);
    });
  }
  function noise(at, len, freq, vol) {
    if (!ctx || muted) return;
    var t = ctx.currentTime + (at || 0), n = Math.floor(ctx.sampleRate * len), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.frequency.value = freq || 1800; g.gain.value = vol || 0.25;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }

  var SFX = {
    correct: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, i * 0.08, 0.55, 0.16); }); },     // C5 E5 G5 C6
    softFail: function () { note(246.94, 0, 0.35, 0.14); note(220, 0.18, 0.5, 0.14); },                                         // warm two-tone chime
    pop: function () { noise(0, 0.08, 2600, 0.35); note(880, 0, 0.12, 0.08); },
    tap: function () { noise(0, 0.05, 1400, 0.18); },
    whoosh: function () { noise(0, 0.35, 900, 0.2); },
    star: function () { [783.99, 987.77, 1174.66, 1567.98].forEach(function (f, i) { note(f, i * 0.06, 0.4, 0.12); }); },
    fanfare: function () { [523.25, 659.25, 783.99].forEach(function (f, i) { note(f, i * 0.16, 0.3, 0.16); }); [523.25, 659.25, 783.99, 1046.5].forEach(function (f) { note(f, 0.5, 1.2, 0.11); }); }
  };

  /* play a recorded line; onLevel(0..1) is called while it plays (used to move the monster's mouth) */
  function say(id, onLevel) {
    stop();
    if (muted || !manifest[id] || !ctx) return Promise.resolve(false);
    return new Promise(function (resolve) {
      var a = new Audio('voice/' + id + '.mp3' + (manifest[id].v ? '?v=' + manifest[id].v : '')), src = null, raf = 0, data = new Uint8Array(analyser.frequencyBinCount);
      try { src = ctx.createMediaElementSource(a); src.connect(analyser); } catch (e) { src = null; }
      current = { a: a, end: finish };
      function tick() {
        if (!current || current.a !== a) return;
        analyser.getByteTimeDomainData(data); var sum = 0;
        for (var i = 0; i < data.length; i++) { var v = (data[i] - 128) / 128; sum += v * v; }
        if (onLevel) onLevel(Math.min(1, Math.sqrt(sum / data.length) * 5));
        raf = requestAnimationFrame(tick);
      }
      function finish(ok) { cancelAnimationFrame(raf); if (onLevel) onLevel(0); if (current && current.a === a) current = null; try { if (src) src.disconnect(); } catch (e) { /* ignore */ } resolve(ok); }
      a.onended = function () { finish(true); }; a.onerror = function () { finish(false); };
      a.play().then(tick, function () { finish(false); });
    });
  }
  function stop() { if (current) { var c = current; current = null; try { c.a.pause(); } catch (e) { /* ignore */ } c.end(false); } }
  function has(id) { return !!manifest[id]; }
  function setMuted(m) { muted = !!m; if (muted) stop(); }

  root.LingoAudio = { init: init, loadManifest: loadManifest, sfx: SFX, say: say, stop: stop, has: has, setMuted: setMuted, isMuted: function () { return muted; } };
})(typeof window !== 'undefined' ? window : this);
