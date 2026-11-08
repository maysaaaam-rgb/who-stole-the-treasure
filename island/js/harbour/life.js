/* Treasure Island · Chapter 1 · The living harbour
   Makes the painted harbour feel alive without new pictures: sparkles on the sea, ripples round the boats,
   chimney smoke, warm flickering windows, a glowing sun, a flag on the ship, drifting clouds, seagulls,
   fireflies over the grass, splashes when the sea is tapped, a soft camera move into each stop,
   and quiet sea sounds (only after the first tap, and never when the sound is off).
   Everything sits on top of the picture in picture pixels (1376 x 768), so it scales with the stage.
   Calm mode: if the device asks for reduced motion, only the slow, gentle effects run. */
(function (root) {
  'use strict';

  var IMG_W = 1376, IMG_H = 768;
  var H = root.Harbour;
  if (!H) return;

  var calm = false;
  try { calm = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }

  // Where things are in the painting (picture pixels)
  var CHIMNEY = [233, 128];
  var WINDOWS = [[148, 238, 26], [240, 256, 20], [352, 240, 26], [134, 318, 30], [245, 318, 24], [410, 314, 28], [318, 318, 18], [377, 318, 16]];
  var SUN = [948, 268];
  var FLAG = [1151, 60];
  var BOATS = [[722, 572, 70], [795, 640, 60], [630, 652, 52], [697, 690, 58], [876, 722, 54], [1135, 552, 105], [655, 498, 46], [1212, 688, 50]];
  // The sea, as a rough outline: taps inside it make a splash
  var SEA = [[520, 345], [1376, 330], [1376, 768], [940, 768], [905, 640], [560, 625], [520, 520], [690, 455], [540, 400]];

  var stage, layer, canvas, ctx, W = 0, Hh = 0, scale = 1, dpr = 1;
  var glints = [], flies = [], splashes = [];
  var running = false, last = 0;

  function $(id) { return document.getElementById(id); }
  function px(v, of) { return (v / of * 100).toFixed(3) + '%'; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function inSea(x, y) {
    var inside = false;
    for (var i = 0, j = SEA.length - 1; i < SEA.length; j = i++) {
      var xi = SEA[i][0], yi = SEA[i][1], xj = SEA[j][0], yj = SEA[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function sceneOpen() { return !!document.getElementById('hb-scene'); }

  /* ---------------------------------------------------------------- the pieces made of HTML */
  function dot(cls, x, y, extra) {
    var d = document.createElement('div');
    d.className = 'hl-' + cls;
    d.style.left = px(x, IMG_W); d.style.top = px(y, IMG_H);
    if (extra) extra(d);
    layer.appendChild(d);
    return d;
  }

  function buildHtml() {
    layer = document.createElement('div');
    layer.className = 'hl-layer' + (calm ? ' calm' : '');
    // the sun breathes
    dot('sun', SUN[0], SUN[1]);
    // drifting clouds high in the sky
    for (var c = 0; c < 3; c++) {
      dot('cloud', -10, [40, 95, 150][c], function (d) {
        d.style.setProperty('--dur', (70 + c * 25) + 's');
        d.style.setProperty('--delay', (-c * 30) + 's');
        d.style.setProperty('--w', [26, 18, 22][c] + '%');
      });
    }
    // smoke from the chimney
    for (var s = 0; s < 4; s++) {
      dot('smoke', CHIMNEY[0], CHIMNEY[1], function (d) { d.style.animationDelay = (s * 1.5) + 's'; });
    }
    // warm windows that flicker
    WINDOWS.forEach(function (w, i) {
      dot('win', w[0], w[1], function (d) { d.style.width = px(w[2] * 1.8, IMG_W); d.style.animationDelay = (i * 0.37) + 's'; });
    });
    // a flag on the top of the main mast
    dot('flag', FLAG[0], FLAG[1], function (d) { d.innerHTML = '<i></i>'; });
    // ripples round the boats, the ship and the rocks
    BOATS.forEach(function (b, i) {
      dot('ripple', b[0], b[1], function (d) { d.style.width = px(b[2] * 1.6, IMG_W); d.style.animationDelay = (i * 0.6) + 's'; });
    });
    stage.insertBefore(layer, stage.querySelector('.hb-layer'));
    // a seagull glides past now and then
    if (!calm) setTimeout(gull, 4000);
  }

  function gull() {
    if (!layer) return;
    if (!sceneOpen() && !document.hidden) {
      var g = document.createElement('div');
      var left = Math.random() < 0.5;
      g.className = 'hl-gull' + (left ? ' rtl' : '');
      g.style.top = px(rnd(30, 210), IMG_H);
      g.style.setProperty('--dur', rnd(9, 14).toFixed(1) + 's');
      g.innerHTML = '<svg viewBox="0 0 40 16" aria-hidden="true"><path d="M2 10 Q11 1 20 9 Q29 1 38 10" /></svg>';
      layer.appendChild(g);
      setTimeout(function () { g.remove(); }, 15000);
      if (Math.random() < 0.4) Sea.gullCry();
    }
    setTimeout(gull, rnd(9000, 17000));
  }

  /* ---------------------------------------------------------------- the canvas: sparkles, fireflies, splashes */
  function buildCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'hl-canvas';
    stage.insertBefore(canvas, layer.nextSibling);
    ctx = canvas.getContext('2d');
    var n = calm ? 22 : 64;
    for (var i = 0; i < n; i++) glints.push(newGlint(true));
    for (var f = 0; f < (calm ? 8 : 22); f++) flies.push(newFly());
    resize();
  }
  function newGlint(first) {
    // most sparkles sit on the sun's golden path on the water
    var onPath = Math.random() < 0.6;
    var x, y, tries = 0;
    do {
      y = onPath ? rnd(330, 640) : rnd(345, 760);
      x = onPath ? SUN[0] + rnd(-70, 70) * (0.6 + (y - 330) / 300) : rnd(540, 1370);
      tries++;
    } while (!inSea(x, y) && tries < 20);
    return { x: x, y: y, len: rnd(5, 16), life: first ? rnd(0, 1) : 0, speed: rnd(0.25, 0.6), gold: onPath };
  }
  function newFly() {
    return { x: rnd(10, 520), y: rnd(380, 740), a: rnd(0, 6.28), sp: rnd(0.004, 0.012), r: rnd(2, 3.4), ph: rnd(0, 6.28) };
  }
  function resize() {
    if (!canvas) return;
    // the camera zooms the stage, so draw a little sharper than the stage's own size
    dpr = Math.min(2.2, (root.devicePixelRatio || 1) * 1.6);
    W = Math.max(1, stage.offsetWidth); Hh = Math.max(1, stage.offsetHeight);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(Hh * dpr);
    scale = W / IMG_W;
  }

  function draw(now) {
    if (!running) return;
    requestAnimationFrame(draw);
    // pause while an adventure is open or the tab is hidden; keep it light (about 30 frames a second)
    if (sceneOpen() || document.hidden || now - last < 33) return;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.clearRect(0, 0, IMG_W, IMG_H);
    ctx.globalCompositeOperation = 'lighter';

    // sparkles on the sea: a short line that brightens and fades
    for (var i = 0; i < glints.length; i++) {
      var g = glints[i];
      g.life += dt * g.speed;
      if (g.life >= 1) { glints[i] = newGlint(false); continue; }
      var a = Math.sin(g.life * Math.PI);
      ctx.strokeStyle = g.gold ? 'rgba(255, 236, 170,' + (0.95 * a).toFixed(3) + ')' : 'rgba(225, 250, 255,' + (0.7 * a).toFixed(3) + ')';
      ctx.lineWidth = g.gold ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(g.x - g.len / 2, g.y); ctx.lineTo(g.x + g.len / 2, g.y); ctx.stroke();
    }

    // fireflies over the grass and flowers
    var t = now / 1000;
    for (var f = 0; f < flies.length; f++) {
      var fl = flies[f];
      fl.a += fl.sp * 60 * dt;
      var fx = fl.x + Math.cos(fl.a) * 26, fy = fl.y + Math.sin(fl.a * 1.3) * 14;
      var glow = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + fl.ph));
      var grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, fl.r * 5);
      grd.addColorStop(0, 'rgba(255, 240, 150,' + glow.toFixed(3) + ')');
      grd.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(fx, fy, fl.r * 5, 0, 6.283); ctx.fill();
    }

    // splashes where the sea was tapped
    ctx.globalCompositeOperation = 'source-over';
    for (var s = splashes.length - 1; s >= 0; s--) {
      var sp = splashes[s];
      sp.t += dt;
      if (sp.t > 1.4) { splashes.splice(s, 1); continue; }
      for (var k = 0; k < 3; k++) {
        var tt = sp.t - k * 0.22;
        if (tt <= 0) continue;
        var rr = 6 + tt * 70;
        ctx.strokeStyle = 'rgba(255,255,255,' + Math.max(0, 0.8 - tt * 0.7).toFixed(3) + ')';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.ellipse(sp.x, sp.y, rr, rr * 0.32, 0, 0, 6.283); ctx.stroke();
      }
      sp.drops.forEach(function (d) {
        var dy = d.vy * sp.t + 260 * sp.t * sp.t;
        if (dy > 0 && sp.t > 0.2) return;
        ctx.fillStyle = 'rgba(235,250,255,' + Math.max(0, 1 - sp.t).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(sp.x + d.vx * sp.t, sp.y + dy, 2.6, 0, 6.283); ctx.fill();
      });
    }
  }

  function onTap(e) {
    if (e.target.closest && e.target.closest('button')) return;
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width * IMG_W, y = (e.clientY - r.top) / r.height * IMG_H;
    Sea.start();
    if (inSea(x, y)) {
      var drops = [];
      for (var i = 0; i < 7; i++) drops.push({ vx: rnd(-60, 60), vy: rnd(-170, -90) });
      splashes.push({ x: x, y: y, t: 0, drops: drops });
      Sea.splash();
    }
  }

  /* ---------------------------------------------------------------- quiet sea sounds (made in the browser) */
  var Sea = (function () {
    var ac = null, master = null, on = false;
    function muted() { var A = root.Ch1Audio; return !!(A && A.isMuted && A.isMuted()); }
    function noiseBuffer() {
      var len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0), last = 0;
      for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      return buf;
    }
    function start() {
      if (on || calm) return;
      var C = root.AudioContext || root.webkitAudioContext; if (!C) return;
      try {
        ac = new C(); master = ac.createGain(); master.gain.value = muted() ? 0 : 0.05; master.connect(ac.destination);
        // the waves: soft brown noise that swells and fades slowly
        var src = ac.createBufferSource(); src.buffer = noiseBuffer(); src.loop = true;
        var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
        var swell = ac.createGain(); swell.gain.value = 0.6;
        var lfo = ac.createOscillator(); lfo.frequency.value = 0.11;
        var lfoGain = ac.createGain(); lfoGain.gain.value = 0.4;
        lfo.connect(lfoGain); lfoGain.connect(swell.gain);
        src.connect(lp); lp.connect(swell); swell.connect(master);
        src.start(); lfo.start();
        on = true;
        setInterval(function () {
          if (!master) return;
          var target = (muted() || document.hidden || sceneOpen()) ? 0 : 0.05;
          master.gain.setTargetAtTime(target, ac.currentTime, 0.4);
        }, 500);
      } catch (e) { on = false; }
    }
    function chirp(f0, f1, dur, vol) {
      if (!on || muted() || sceneOpen()) return;
      var t = ac.currentTime;
      [0, 0.16].forEach(function (off) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f0, t + off); o.frequency.exponentialRampToValueAtTime(f1, t + off + dur);
        g.gain.setValueAtTime(0.0001, t + off); g.gain.exponentialRampToValueAtTime(vol, t + off + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + off + dur);
        o.connect(g); g.connect(ac.destination); o.start(t + off); o.stop(t + off + dur + 0.05);
      });
    }
    return {
      start: start,
      gullCry: function () { chirp(1700, 1150, 0.22, 0.025); },
      splash: function () {
        if (!on || muted()) return;
        var t = ac.currentTime, s = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();
        s.buffer = noiseBuffer(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(1400, t); bp.frequency.exponentialRampToValueAtTime(380, t + 0.5);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        s.connect(bp); bp.connect(g); g.connect(ac.destination); s.start(t); s.stop(t + 0.7);
      }
    };
  })();

  /* ---------------------------------------------------------------- start once the harbour is on screen */
  function boot() {
    stage = $('hb-stage');
    if (!stage || stage.querySelector('.hl-layer')) return;
    buildHtml();
    buildCanvas();
    stage.addEventListener('pointerdown', onTap);
    root.addEventListener('resize', function () { setTimeout(resize, 50); });
    // the first tap anywhere also starts the sea sounds
    document.addEventListener('pointerdown', function first() { Sea.start(); document.removeEventListener('pointerdown', first); });
    running = true; last = performance.now();
    requestAnimationFrame(draw);
  }

  var startOld = H.start;
  H.start = function () {
    startOld.apply(H, arguments);
    boot();
  };
})(typeof window !== 'undefined' ? window : this);
