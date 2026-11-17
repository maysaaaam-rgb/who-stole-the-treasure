/* kit3d — shared 3D toolkit for the English Adventure Academy 3D games.
   Needs: three.min.js (+ BufferGeometryUtils.js, GLTFLoader.js) loaded first.
   Gives: clock + scheduler, frame-capture for videos, sounds (files in ./sfx with synth fallback),
   pictures (files in ./art), world pieces (sky, hills, trees, clouds), particles, floating text,
   rigged kid avatars with code-made moves, whole-body monster animation, camera helper,
   and the classroom UI (team bar, big text, question card, top buttons). */
(function (root) {
  'use strict';
  var T3 = root.THREE;
  var K = root.K3 = {};
  var Q = K.Q = new URLSearchParams(location.search);
  K.CAPTURE = Q.has('capture');
  K.DEMO = Q.has('demo') || K.CAPTURE;
  K.ROOT = '../../';

  /* ---------- small helpers ---------- */
  K.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  K.lerp = function (a, b, t) { return a + (b - a) * t; };
  K.rnd = function (a, b) { return a + Math.random() * (b - a); };
  K.ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  K.easeOutBack = function (t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  K.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  K.TEAMS = [
    { name: 'Pink',   c: '#ff5fa2', hex: 0xff5fa2, kid: 'girl', mon: 'emberwing' },
    { name: 'Blue',   c: '#4f9dff', hex: 0x4f9dff, kid: 'boy',  mon: 'aquafind' },
    { name: 'Yellow', c: '#ffb320', hex: 0xffb320, kid: 'girl', mon: 'sparktail' },
    { name: 'Green',  c: '#2fc58a', hex: 0x2fc58a, kid: 'boy',  mon: 'florasprout' }
  ];

  /* ---------- clock + scheduler ---------- */
  var jobs = [], frameFns = [];
  K.now = 0;
  K.timeScale = 1;
  K.after = function (sec, fn) { var j = { at: K.now + sec, fn: fn }; jobs.push(j); return j; };
  K.cancel = function (j) { var i = jobs.indexOf(j); if (i >= 0) jobs.splice(i, 1); };
  K.onFrame = function (fn) { frameFns.push(fn); return fn; };
  K.offFrame = function (fn) { var i = frameFns.indexOf(fn); if (i >= 0) frameFns.splice(i, 1); };
  function runJobs() {
    for (var i = 0; i < jobs.length; i++) if (jobs[i].at <= K.now) { var j = jobs.splice(i, 1)[0]; i--; j.fn(); }
  }

  /* ---------- renderer / scene ---------- */
  K.init = function (opts) {
    opts = opts || {};
    var canvas = opts.canvas || document.getElementById('scene');
    var r = K.renderer = new T3.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: K.CAPTURE, powerPreference: 'high-performance' });
    // sharp picture: render at least 1.5x on normal screens (smooths jagged edges), up to 2x
    K.quality = K.Q.get('q') || 'high';
    var dpr = root.devicePixelRatio || 1;
    r.setPixelRatio(K.CAPTURE ? (+K.Q.get('pr') || 1) : K.quality === 'low' ? Math.min(1, dpr) : Math.min(2, Math.max(1.5, dpr)));
    r.shadowMap.enabled = true;
    r.shadowMap.type = T3.PCFSoftShadowMap;
    K.scene = new T3.Scene();
    K.scene.fog = new T3.Fog(opts.fog || 0xcdeaff, opts.fogNear || 45, opts.fogFar || 120);
    K.camera = new T3.PerspectiveCamera(opts.fov || 42, 16 / 9, .1, 400);
    function resize() { var w = innerWidth, h = innerHeight; r.setSize(w, h, false); K.camera.aspect = w / h; K.camera.updateProjectionMatrix(); }
    addEventListener('resize', resize); resize();
    if (Q.has('preview')) document.body.classList.add('preview');
    return K;
  };

  function frame(dt) {
    dt = Math.min(dt, 1 / 20) * K.timeScale;
    K.now += dt;
    runJobs();
    for (var i = 0; i < frameFns.length; i++) frameFns[i](dt, K.now);
    K.cam.update(dt);
    K.renderer.render(K.scene, K.camera);
    if (K.CAPTURE && document.getAnimations) document.getAnimations().forEach(function (a) { a.pause(); a.__t = (a.__t || 0) + dt * 1000; a.currentTime = a.__t; });
  }
  K.start = function () {
    root.__k3 = {
      step: function (n, dt) { for (var i = 0; i < (n || 1); i++) frame(dt || 1 / 30); },
      sim: function (n, dt) { var rr = K.renderer.render; K.renderer.render = function () {}; for (var i = 0; i < n; i++) frame(dt || 1 / 30); K.renderer.render = rr; },
      ready: true, K: K
    };
    if (K.CAPTURE) { frame(1 / 30); return; }
    var last = 0;
    (function loop(ts) { var dt = last ? (ts - last) / 1000 : 1 / 60; last = ts; frame(dt); requestAnimationFrame(loop); })(0);
  };

  /* ---------- materials / textures / pictures ---------- */
  K.mat = function (c, o) { return new T3.MeshLambertMaterial(Object.assign({ color: c }, o || {})); };
  K.canvasTex = function (w, h, draw) {
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    var t = new T3.CanvasTexture(cv); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t;
  };
  var texLoader = new T3.TextureLoader();
  K.art = function (file, onOk) {
    texLoader.load('art/' + file, function (t) { t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; onOk(t); }, undefined, function () {});
  };
  K.roundRect = function (x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
  K.label = function (text, color, w) {   // pill sprite
    w = w || 256;
    var tex = K.canvasTex(w, 96, function (x, W, H) {
      x.fillStyle = color; K.roundRect(x, 6, 6, W - 12, H - 12, 40); x.fill();
      x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke();
      x.fillStyle = '#fff'; x.font = '900 46px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, H / 2 + 3);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, depthTest: false }));
    s.scale.set(w / 256 * 1.05, .4, 1); s.renderOrder = 5; return s;
  };

  /* ---------- sound: ./sfx/<name>.mp3 if present, else synth ---------- */
  var AC = null, BUF = {}, loops = {};
  K.muted = false;
  K.audio = function () { if (!AC) { try { AC = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; };
  function tone(f, d, type, vol, slide) {
    var a = K.audio(); if (!a || K.CAPTURE || K.muted) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || .2, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
  }
  function noise(d, vol, freq, type) {
    var a = K.audio(); if (!a || K.CAPTURE || K.muted) return;
    var n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), ch = b.getChannelData(0);
    for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = type || 'bandpass'; f.frequency.value = freq || 1200; g.gain.value = vol || .3;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  K.tone = tone; K.noise = noise;
  var SYN = {
    countdown: function () { tone(660, .18, 'square', .12); },
    go: function () { tone(990, .45, 'square', .14); noise(1.2, .35, 900); },
    correct: function () { tone(880, .12, 'triangle', .25); setTimeout(function () { tone(1320, .3, 'triangle', .25); }, 110); },
    wrong: function () { tone(180, .4, 'sawtooth', .12, 90); },
    step: function () { noise(.05, .25, 500); },
    stumble: function () { tone(300, .35, 'sine', .25, 700); },
    hello: function () { tone(520, .12, 'sine', .15, 780); },
    whoosh: function () { noise(.5, .3, 2200); },
    win: function () { noise(2.2, .45, 1100); [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { tone(f, .3, 'triangle', .2); }, i * 120); }); },
    pop: function () { noise(.12, .6, 2500, 'highpass'); tone(900, .08, 'square', .1, 300); },
    boom: function () { noise(.9, .9, 160, 'lowpass'); tone(90, .6, 'sine', .5, 40); },
    fuse: function () { noise(1.2, .12, 5000, 'highpass'); },
    pfft: function () { noise(.6, .35, 400); tone(140, .5, 'sine', .15, 70); },
    thud: function () { tone(110, .25, 'sine', .45, 50); noise(.15, .3, 300); },
    hay: function () { noise(.5, .4, 1800); },
    bullseye: function () { [784, 988, 1175, 1568].forEach(function (f, i) { setTimeout(function () { tone(f, .25, 'triangle', .22); }, i * 80); }); noise(1.5, .35, 1200); },
    load: function () { tone(220, .2, 'sine', .25, 440); },
    boing: function () { tone(250, .4, 'sine', .3, 600); }
  };
  K.sfx = function (name, vol) {
    if (K.muted || K.CAPTURE) return;
    var a = K.audio();
    if (a && BUF[name]) { var s = a.createBufferSource(), g = a.createGain(); s.buffer = BUF[name]; g.gain.value = vol || 1; s.connect(g); g.connect(a.destination); s.start(); return; }
    if (SYN[name]) SYN[name]();
  };
  K.loadSounds = function (names) {
    var a = K.audio(); if (!a || K.loadSounds.done || K.CAPTURE) return; K.loadSounds.done = true;
    names.concat(['music', 'crowd']).forEach(function (k) {
      fetch('sfx/' + k + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (b) { return a.decodeAudioData(b); })
        .then(function (buf) { BUF[k] = buf; if (k === 'music' || k === 'crowd') K.loop(k); }).catch(function () {});
    });
  };
  K.loop = function (k) {
    if (loops[k] || !BUF[k]) return;
    var a = K.audio(), s = a.createBufferSource(), g = a.createGain();
    s.buffer = BUF[k]; s.loop = true; g.gain.value = K.muted ? 0 : (k === 'music' ? .25 : .18);
    s.connect(g); g.connect(a.destination); s.start(); loops[k] = g;
  };
  K.loopVol = function (k, v) { if (loops[k] && AC) loops[k].gain.setTargetAtTime(K.muted ? 0 : v, AC.currentTime, .3); };

  /* ---------- world pieces ---------- */
  K.world = {};
  K.world.sky = function (top, mid, bot) {
    var m = new T3.ShaderMaterial({
      side: T3.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T3.Color(top || 0x7cc6ff) }, mid: { value: new T3.Color(mid || 0xc4e7ff) }, bot: { value: new T3.Color(bot || 0xffe9f4) } },
      vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 p; void main(){ float h = normalize(p).y; vec3 c = h>0.15 ? mix(mid, top, smoothstep(.15,.7,h)) : mix(bot, mid, smoothstep(-.05,.15,h)); gl_FragColor = vec4(c,1.); }'
    });
    var sky = new T3.Mesh(new T3.SphereGeometry(200, 32, 16), m);
    K.onFrame(function () { sky.position.copy(K.camera.position); });
    K.scene.add(sky); return sky;
  };
  K.world.lights = function () {
    K.scene.add(new T3.HemisphereLight(0xffffff, 0x9ad08a, 1.15));
    var sun = K.sun = new T3.DirectionalLight(0xfff4e0, 1.6);
    sun.castShadow = true; var sm = K.quality === 'low' ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
    var sc = sun.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 80;
    K.scene.add(sun); K.scene.add(sun.target);
    K.onFrame(function () {   // shadows follow what the camera looks at
      var l = K.cam.look; sun.position.set(l.x - 12, 24, l.z + 14); sun.target.position.set(l.x, 0, l.z); sun.target.updateMatrixWorld();
    });
    return sun;
  };
  K.world.ground = function (color, stripes) {
    var g = new T3.Mesh(new T3.PlaneGeometry(600, 600), K.mat(color || 0x8fdc7a));
    g.rotation.x = -Math.PI / 2; g.receiveShadow = true; K.scene.add(g);
    if (stripes) stripes.forEach(function (s) {
      var b = new T3.Mesh(new T3.PlaneGeometry(s.w, s.d), K.mat(s.c || 0x84d36f)); b.rotation.x = -Math.PI / 2; b.position.set(s.x, .004, s.z || 0); b.receiveShadow = true; K.scene.add(b);
    });
    return g;
  };
  K.world.hills = function (x0, x1, z, n) {
    var cols = [0x7fcf6e, 0x9ae08a, 0x6fc46a];
    for (var i = 0; i < n; i++) {
      var h = new T3.Mesh(new T3.SphereGeometry(K.rnd(10, 18), 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(cols[i % 3]));
      h.scale.y = K.rnd(.3, .55); h.position.set(K.lerp(x0, x1, i / Math.max(1, n - 1)) + K.rnd(-3, 3), -.5, z - K.rnd(0, 14)); K.scene.add(h);
    }
  };
  K.world.tree = function (x, z, s, pink) {
    var tr = new T3.Group(), cols = [0x5cc46a, 0x4fb562, 0x74d37c];
    var trunk = new T3.Mesh(new T3.CylinderGeometry(.15, .2, 1.2, 8), K.mat(0xb07a52)); trunk.position.y = .6; trunk.castShadow = true; tr.add(trunk);
    var lc = pink ? 0xf59ac3 : cols[(Math.random() * 3) | 0];
    for (var b = 0; b < 3; b++) { var leaf = new T3.Mesh(new T3.SphereGeometry(K.rnd(.6, .9), 14, 10), K.mat(lc)); leaf.position.set(K.rnd(-.3, .3), 1.5 + b * .45, K.rnd(-.3, .3)); leaf.castShadow = true; tr.add(leaf); }
    tr.position.set(x, 0, z); tr.scale.setScalar(s || K.rnd(.9, 1.5)); K.scene.add(tr);
    var ph = Math.random() * 6; K.onFrame(function (dt, t) { tr.rotation.z = Math.sin(t * 1.3 + ph) * .025; });
    return tr;
  };
  K.world.clouds = function (n, x0, x1) {
    var cm = new T3.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .35 }), list = [];
    for (var c = 0; c < n; c++) {
      var cg = new T3.Group();
      for (var p = 0; p < 5; p++) { var puff = new T3.Mesh(new T3.SphereGeometry(K.rnd(1.2, 2.2), 14, 10), cm); puff.position.set(p * 1.6 - 3, K.rnd(-.3, .5), K.rnd(-.5, .5)); puff.scale.y = .7; cg.add(puff); }
      cg.position.set(K.rnd(x0, x1), K.rnd(16, 26), K.rnd(-70, -28)); cg.userData.v = K.rnd(.4, 1.1); K.scene.add(cg); list.push(cg);
    }
    K.onFrame(function (dt) { list.forEach(function (c) { c.position.x += c.userData.v * dt; if (c.position.x > x1 + 20) c.position.x = x0 - 20; }); });
  };
  K.world.flowers = function (n, area) {
    var cols = [0xffffff, 0xff9fc8, 0xffe066, 0xc3a6ff], g = new T3.SphereGeometry(.09, 6, 4);
    for (var i = 0; i < n; i++) {
      var f = new T3.Mesh(g, K.mat(cols[i % 4])); f.position.set(K.rnd(area[0], area[1]), .08, K.rnd(area[2], area[3])); K.scene.add(f);
    }
  };

  /* ---------- particles ---------- */
  var parts = [];
  var sphG = new T3.SphereGeometry(.12, 8, 6), confG = new T3.PlaneGeometry(.12, .2), strawG = new T3.BoxGeometry(.04, .04, .35);
  K.CONF = [0xff6fae, 0xffd84a, 0x4f9dff, 0x2fc58a, 0x9b7bff, 0xffffff, 0xff9f68];
  function addPart(mesh, u) { mesh.userData = u; K.scene.add(mesh); parts.push(mesh); }
  K.fx = {
    puff: function (p, n, o) {   // soft smoke / dust
      o = o || {};
      for (var i = 0; i < (n || 4); i++) {
        var m = new T3.Mesh(sphG, new T3.MeshBasicMaterial({ color: o.color || 0xfff3ea, transparent: true, opacity: o.opacity || .6, depthWrite: false }));
        m.position.set(p.x + K.rnd(-.2, .2) * (o.spread || 1), p.y + K.rnd(0, .15), p.z + K.rnd(-.25, .25) * (o.spread || 1));
        var v = o.dir ? o.dir.clone().multiplyScalar(K.rnd(.6, 1.4)).add(new T3.Vector3(K.rnd(-.6, .6), K.rnd(-.3, .6), K.rnd(-.6, .6))) : new T3.Vector3(K.rnd(-1.4, 1.4), K.rnd(.4, 1.3), K.rnd(-1, 1));
        addPart(m, { kind: 'puff', v: v, life: 0, max: K.rnd(.4, .8) * (o.life || 1), s: K.rnd(.4, .8) * (o.size || 1), o: o.opacity || .6, drag: o.drag || 1.5 });
      }
    },
    confetti: function (p, n) {
      for (var i = 0; i < n; i++) {
        var m = new T3.Mesh(confG, new T3.MeshBasicMaterial({ color: K.CONF[i % K.CONF.length], side: T3.DoubleSide }));
        m.position.set(p.x + K.rnd(-.3, .3), p.y, p.z + K.rnd(-.3, .3));
        var a = K.rnd(0, 6.28), sp = K.rnd(2, 7);
        addPart(m, { kind: 'conf', v: new T3.Vector3(Math.cos(a) * sp * .6, K.rnd(5, 11), Math.sin(a) * sp), r: new T3.Vector3(K.rnd(-9, 9), K.rnd(-9, 9), K.rnd(-9, 9)), life: 0 });
      }
    },
    burst: function (p, color, n, speed, geo) {   // chunky pieces flying out (balloon skin, hay, sparks)
      for (var i = 0; i < n; i++) {
        var m = new T3.Mesh(geo === 'straw' ? strawG : sphG, new T3.MeshLambertMaterial({ color: Array.isArray(color) ? color[i % color.length] : color }));
        m.position.copy(p); m.scale.setScalar(K.rnd(.5, 1.1));
        var d = new T3.Vector3(K.rnd(-1, 1), K.rnd(-.3, 1), K.rnd(-1, 1)).normalize().multiplyScalar(K.rnd(.5, 1) * (speed || 6));
        addPart(m, { kind: 'chunk', v: d, r: new T3.Vector3(K.rnd(-8, 8), K.rnd(-8, 8), K.rnd(-8, 8)), life: 0, max: K.rnd(.8, 1.4) });
      }
    },
    ring: function (p, color, size) {   // expanding shock ring
      var m = new T3.Mesh(new T3.RingGeometry(.6, .8, 40), new T3.MeshBasicMaterial({ color: color || 0xffffff, transparent: true, opacity: .9, side: T3.DoubleSide, depthWrite: false }));
      m.position.copy(p); m.lookAt(K.camera.position);
      addPart(m, { kind: 'ring', life: 0, max: .5, s: size || 4 });
    },
    text: function (txt, p, color, size) {   // floating "+20"
      var tex = K.canvasTex(256, 128, function (x, w, h) {
        x.font = '900 92px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 16; x.strokeStyle = '#2b1d40'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = color || '#fff'; x.fillText(txt, w / 2, h / 2);
      });
      var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      var sz = size || 1.6; s.scale.set(sz * 2, sz, 1); s.position.copy(p); s.renderOrder = 9;
      addPart(s, { kind: 'text', life: 0, max: 1.3, sz: sz, y0: p.y });
    }
  };
  K.onFrame(function (dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var m = parts[i], u = m.userData, dead = false; u.life += dt;
      if (u.kind === 'puff') {
        m.position.addScaledVector(u.v, dt); u.v.multiplyScalar(1 - u.drag * dt); u.v.y += .4 * dt;
        var k = u.life / u.max; m.scale.setScalar(u.s * (1 + k * 2.4)); m.material.opacity = u.o * (1 - k); dead = k >= 1;
      } else if (u.kind === 'conf') {
        u.v.y -= 9 * dt; u.v.multiplyScalar(1 - 1.4 * dt); if (u.v.y < -1.6) u.v.y = -1.6;
        m.position.addScaledVector(u.v, dt); m.rotation.x += u.r.x * dt; m.rotation.y += u.r.y * dt; m.rotation.z += u.r.z * dt;
        if (m.position.y < .03) { m.position.y = .03; u.v.set(0, 0, 0); u.r.set(0, 0, 0); m.rotation.set(-Math.PI / 2, 0, m.rotation.z); }
        dead = u.life > 10;
      } else if (u.kind === 'chunk') {
        u.v.y -= 12 * dt; m.position.addScaledVector(u.v, dt); m.rotation.x += u.r.x * dt; m.rotation.z += u.r.z * dt;
        if (m.position.y < .05) { m.position.y = .05; u.v.multiplyScalar(.4); u.v.y = Math.abs(u.v.y) * .3; }
        if (u.life > u.max) m.scale.multiplyScalar(1 - 6 * dt); dead = u.life > u.max + .6;
      } else if (u.kind === 'ring') {
        var kr = u.life / u.max; m.scale.setScalar(1 + kr * u.s); m.material.opacity = .9 * (1 - kr); dead = kr >= 1;
      } else if (u.kind === 'text') {
        var kt = u.life / u.max, pop = Math.min(1, u.life * 6);
        m.position.y = u.y0 + kt * 1.6; m.scale.set(u.sz * 2 * K.easeOutBack(pop), u.sz * K.easeOutBack(pop), 1);
        m.material.opacity = kt > .7 ? 1 - (kt - .7) / .3 : 1; dead = kt >= 1;
      }
      if (dead) { K.scene.remove(m); if (m.material.map && u.kind === 'text') m.material.map.dispose(); m.material.dispose(); parts.splice(i, 1); }
    }
  });

  /* ---------- camera helper ---------- */
  K.cam = {
    pos: new T3.Vector3(0, 3, 10), look: new T3.Vector3(0, 1, 0), tPos: new T3.Vector3(0, 3, 10), tLook: new T3.Vector3(0, 1, 0), k: 2.5, shakeT: 0, drift: true,
    set: function (p, l, k) { this.tPos.copy(p); this.tLook.copy(l); if (k) this.k = k; },
    snap: function () { this.pos.copy(this.tPos); this.look.copy(this.tLook); },
    shake: function (s) { this.shakeT = Math.max(this.shakeT, s || .3); },
    update: function (dt) {
      if (this.manual) return;
      if (this.follow) this.follow(dt);
      var f = 1 - Math.exp(-dt * this.k);
      this.pos.lerp(this.tPos, f); this.look.lerp(this.tLook, f);
      var t = K.now, c = K.camera;
      c.position.copy(this.pos);
      if (this.drift) { c.position.x += Math.sin(t * .9) * .05; c.position.y += Math.sin(t * 1.3) * .04; }
      if (this.shakeT > 0) { this.shakeT -= dt; var a = this.shakeT * 1.2; c.position.x += K.rnd(-a, a); c.position.y += K.rnd(-a, a); }
      c.lookAt(this.look);
    }
  };

  /* ---------- 3D models ---------- */
  var bufCache = {};
  K.loadGLB = function (url) {
    var p = bufCache[url] || (bufCache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }));
    return p.then(function (buf) { return new Promise(function (res, rej) { new T3.GLTFLoader().parse(buf.slice(0), '', res, rej); }); });
  };
  K.tryGLB = function (url) { return K.loadGLB(url).catch(function () { return null; }); };
  /* fit a loaded model: height h, feet at y=0, centred */
  K.fitModel = function (obj, h, opts) {
    opts = opts || {};
    obj.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(obj), size = box.getSize(new T3.Vector3());
    var s = opts.byLength ? h / Math.max(size.x, size.z) : h / size.y;
    obj.scale.multiplyScalar(s); obj.updateMatrixWorld(true);
    box.setFromObject(obj); var c = box.getCenter(new T3.Vector3());
    obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= box.min.y;
    obj.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = !!opts.receive; if (o.material) { o.material.metalness = 0; o.material.roughness = Math.max(.6, o.material.roughness || .6); } } });
    return obj;
  };

  /* ---------- characters ----------
     Both kinds share: .root (place it), .body (bounces), .setState(name), .update(dt), .height
     States: idle wave hello cheer clap sad hop fly tumble dizzy shrug ready run stumble */
  var BONES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'];
  var AX = K.AX = { L: new T3.Vector3(1, 0, 0), U: new T3.Vector3(0, 1, 0), F: new T3.Vector3(0, 0, 1) };
  var _q = new T3.Quaternion(), _pw = new T3.Quaternion(), _pwi = new T3.Quaternion(), _rq = new T3.Quaternion(), _ax = new T3.Vector3();

  function Character() {}
  Character.prototype.setState = function (st) { if (this.state !== st) { this.state = st; this.stateT = 0; } };
  Character.prototype.base = function (height) {
    this.root = new T3.Group(); this.body = new T3.Group(); this.inner = new T3.Group();
    this.root.add(this.body); this.body.add(this.inner);
    this.height = height; this.state = 'idle'; this.stateT = 0; this.seed = Math.random() * 10; this.phase = 0; this.speed = 0;
    this.extraSpin = new T3.Euler();
  };

  /* --- rigged kid (Mixamo skeleton from Tripo) --- */
  function Kid(gltf, height) {
    var self = this; this.base(height || 1.6); this.kind = 'kid';
    var model = gltf.scene; this.inner.add(model);
    this.bones = {}; this.rest = {};
    model.traverse(function (o) {
      if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; if (o.material) { o.material.metalness = 0; o.material.roughness = .75; } }
      if (o.isBone) { var k = o.name.replace(/^mixamorig:?/, ''); if (BONES.indexOf(k) >= 0) { self.bones[k] = o; self.rest[k] = o.quaternion.clone(); } }
    });
    this.root.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(model), h = box.max.y - box.min.y, s = this.height / h;
    model.scale.multiplyScalar(s); model.position.y -= box.min.y * s;
    this.root.updateMatrixWorld(true);
    var pa = new T3.Vector3(), pb = new T3.Vector3();
    this.bones.LeftArm.getWorldPosition(pa); this.bones.RightArm.getWorldPosition(pb);
    var left = pa.sub(pb); left.y = 0; left.normalize();
    var fwd = new T3.Vector3().crossVectors(left, AX.U).normalize();
    this.inner.rotation.y = -Math.atan2(fwd.x, fwd.z);   // model front -> +Z of root
    this.root.updateMatrixWorld(true);
    function armOut(a, f, sg) { var p1 = new T3.Vector3(), p2 = new T3.Vector3(); self.bones[a].getWorldPosition(p1); self.bones[f].getWorldPosition(p2); var d = p2.sub(p1); return Math.atan2(sg * d.x, -d.y); }
    this.outL = armOut('LeftArm', 'LeftForeArm', 1); this.outR = armOut('RightArm', 'RightForeArm', -1);
    this.P = this.pose('idle', 0);
  }
  Kid.prototype = Object.create(Character.prototype);
  Kid.prototype.pose = function (st, t) {
    var P = { thighL: 0, thighR: 0, kneeL: .05, kneeR: .05, footL: 0, footR: 0, armL: 0, armR: 0, liftL: .08, liftR: .08, elbowL: -.25, elbowR: -.25,
      lean: 0, twist: 0, headP: 0, headY: 0, headR: 0, bob: 0, bodyR: 0, bodyP: 0, jump: 0 };
    var sd = this.seed, s, k, w, u;
    switch (st) {
      case 'idle':
        P.lean = .03 * Math.sin(t * 2 + sd); P.headY = .35 * Math.sin(t * .6 + sd); P.headP = .06 * Math.sin(t * 1.3 + sd);
        P.armL = .06 * Math.sin(t * 2 + sd); P.armR = -.06 * Math.sin(t * 2 + sd); P.bodyR = .03 * Math.sin(t * 1.1 + sd); P.bob = .012 * Math.sin(t * 4 + sd);
        P.kneeL = .08 + .06 * Math.max(0, Math.sin(t * 1.1 + sd)); P.kneeR = .08 + .06 * Math.max(0, -Math.sin(t * 1.1 + sd)); break;
      case 'ready':
        P.lean = .45; P.headP = -.35; P.thighL = -.55; P.thighR = .35; P.kneeL = .9; P.kneeR = .6; P.footL = -.3;
        P.armL = .6; P.armR = -.5; P.elbowL = -1.1; P.elbowR = -1.1; P.bob = -.12 + .015 * Math.sin(t * 9 + sd); P.liftL = P.liftR = .1; break;
      case 'run':
        var p = this.phase; s = Math.sin(p); var c = Math.cos(p); k = K.clamp(this.speed / 7, .35, 1);
        P.thighL = -.95 * s * k; P.thighR = .95 * s * k;
        P.kneeL = .25 + 1.35 * k * Math.max(0, -Math.sin(p - .9)); P.kneeR = .25 + 1.35 * k * Math.max(0, Math.sin(p - .9));
        P.footL = -.35 * k * Math.max(0, c); P.footR = -.35 * k * Math.max(0, -c);
        P.armL = .95 * s * k; P.armR = -.95 * s * k; P.elbowL = -1.35; P.elbowR = -1.35; P.liftL = P.liftR = .14;
        P.lean = .22 + .12 * k; P.twist = .2 * s * k; P.headP = -.12; P.headY = -.12 * s * k; P.bob = .09 * k * Math.abs(c) - .03; break;
      case 'stumble':
        u = K.clamp(t / 1.6, 0, 1); w = Math.sin(u * Math.PI);
        P.bodyP = .55 * Math.sin(u * Math.PI) * (1 - u) + .2 * w * Math.sin(t * 14) * (1 - u); P.bodyR = .35 * Math.sin(t * 9) * (1 - u);
        P.lean = .5 * w; P.headP = -.4 * w; P.headY = .5 * Math.sin(t * 16) * (1 - u);
        P.liftL = 1.9 * w + .25 * Math.sin(t * 22) * w; P.liftR = 1.9 * w + .25 * Math.sin(t * 22 + 1) * w;
        P.elbowL = -.4 - .6 * Math.sin(t * 18) * w; P.elbowR = -.4 + .6 * Math.sin(t * 18) * w;
        P.thighL = -.5 * w; P.kneeL = .3 + .6 * w; P.thighR = .35 * w; P.kneeR = .2 + .5 * w; P.bob = -.12 * w; break;
      case 'wave': case 'hello':
        P.headY = .45; P.lean = -.05; P.bodyR = -.06; P.liftR = 2.7; P.elbowR = -.35 + .55 * Math.sin(t * 11); P.liftL = .2; P.bob = .015 * Math.sin(t * 8); break;
      case 'cheer':
        var j = Math.abs(Math.sin(t * 5.2));
        P.jump = .55 * j; P.liftL = 2.8 + .2 * Math.sin(t * 10.4); P.liftR = 2.8 + .2 * Math.sin(t * 10.4 + 1);
        P.elbowL = P.elbowR = -.25; P.headP = -.25; P.lean = -.12; P.thighL = P.thighR = -.35 * (1 - j); P.kneeL = P.kneeR = .2 + .9 * (1 - j); break;
      case 'clap':
        var cl = Math.sin(t * 13);
        P.armL = -1.0; P.armR = -1.0; P.liftL = .35 + .25 * cl; P.liftR = .35 + .25 * cl; P.elbowL = -1.0; P.elbowR = -1.0;
        P.headP = -.12; P.headY = .2 * Math.sin(t * 2 + sd); P.bob = .04 * Math.abs(Math.sin(t * 6.5)); break;
      case 'sad':
        P.lean = .3; P.headP = .45; P.liftL = .02; P.liftR = .02; P.armL = .15; P.armR = .15; P.kneeL = .15; P.kneeR = .15; P.bob = -.04; break;
      case 'shrug':
        u = Math.sin(Math.min(1, t * 2) * Math.PI * .5);
        P.liftL = .7 * u; P.liftR = .7 * u; P.elbowL = -1.4 * u; P.elbowR = -1.4 * u; P.armL = -.3 * u; P.armR = -.3 * u;
        P.headR = .25 * Math.sin(t * 3); P.headP = -.05; P.bob = .03 * u; break;
      case 'hop':   // crouch then spring (used while flying up into the cannon)
        P.thighL = P.thighR = -.9; P.kneeL = P.kneeR = 1.6; P.lean = .4; P.liftL = P.liftR = 2.2; P.elbowL = P.elbowR = -.3; P.headP = -.3; break;
      case 'fly':   // superhero: arms forward, legs back, wiggling
        P.bodyP = 1.25; P.armL = -2.9 + .15 * Math.sin(t * 9); P.armR = -2.9 + .15 * Math.sin(t * 9 + 1); P.liftL = P.liftR = .25; P.elbowL = P.elbowR = -.1;
        P.thighL = .25 + .3 * Math.sin(t * 12); P.thighR = .25 - .3 * Math.sin(t * 12); P.kneeL = P.kneeR = .5; P.headP = -.7; break;
      case 'tumble':   // flailing while spinning (spin itself is done by the game)
        P.liftL = 1.6 + .6 * Math.sin(t * 17); P.liftR = 1.6 + .6 * Math.sin(t * 17 + 2); P.elbowL = -.8 * Math.abs(Math.sin(t * 13)); P.elbowR = -.8 * Math.abs(Math.cos(t * 13));
        P.thighL = -.8 + .6 * Math.sin(t * 15); P.thighR = -.8 - .6 * Math.sin(t * 15); P.kneeL = P.kneeR = 1.0; P.headP = -.2; break;
      case 'kick':   // wind up then swing the right leg through (0.5 s)
        u = K.clamp(t / .5, 0, 1);
        var sw = u < .45 ? -u / .45 : -1 + (u - .45) / .55 * 2.6;   // back then forward
        P.thighR = K.clamp(sw, -1, 1.6) * -1; P.kneeR = u < .45 ? 1.2 * (u / .45) : 1.2 * (1 - (u - .45) / .55);
        P.thighL = .15; P.kneeL = .25; P.lean = u < .45 ? -.1 : .25; P.liftL = 1.0; P.liftR = .7; P.armL = -.5; P.armR = .6; P.elbowL = P.elbowR = -.4; P.headP = .2; break;
      case 'keeper':   // goalkeeper ready: crouched, arms wide, shuffling
        P.thighL = P.thighR = -.55; P.kneeL = P.kneeR = 1.0; P.lean = .3; P.liftL = P.liftR = 1.1 + .1 * Math.sin(t * 6); P.elbowL = P.elbowR = -.6;
        P.armL = P.armR = -.4; P.headP = -.2; P.bob = -.14 + .03 * Math.abs(Math.sin(t * 6)); P.bodyR = .06 * Math.sin(t * 3); break;
      case 'dive':   // stretched out, arms up over the head
        P.liftL = P.liftR = 2.9; P.elbowL = P.elbowR = -.05; P.thighL = .1; P.thighR = -.2; P.kneeL = .2; P.kneeR = .4; P.headP = -.1; break;
      case 'headhands':   // "oh no!" hands on head
        P.liftL = P.liftR = 2.2; P.elbowL = P.elbowR = -2.3; P.armL = P.armR = -.3; P.headP = .25 + .06 * Math.sin(t * 3); P.lean = .1; P.headY = .25 * Math.sin(t * 2); break;
      case 'dizzy':
        P.bodyR = .22 * Math.sin(t * 4); P.bodyP = .12 * Math.cos(t * 4); P.headR = .3 * Math.sin(t * 4 + 1); P.headY = .3 * Math.cos(t * 4);
        P.liftL = .5 + .2 * Math.sin(t * 4); P.liftR = .5 + .2 * Math.cos(t * 4); P.elbowL = P.elbowR = -.2; P.kneeL = P.kneeR = .35; P.bob = -.06; break;
    }
    return P;
  };
  Kid.prototype.rot = function (name, axis, ang) {
    if (!ang) return; var b = this.bones[name]; if (!b) return;
    this.body.getWorldQuaternion(_q); _ax.copy(axis).applyQuaternion(_q); _rq.setFromAxisAngle(_ax, ang);
    b.parent.getWorldQuaternion(_pw); _pwi.copy(_pw).invert(); b.quaternion.premultiply(_pwi.multiply(_rq).multiply(_pw));
  };
  Kid.prototype.update = function (dt) {
    this.stateT += dt;
    if (this.state === 'run') this.phase += dt * (5 + this.speed * 1.55);
    var tgt = this.pose(this.state, this.stateT), fast = /run|stumble|cheer|clap|tumble|fly|dizzy/.test(this.state);
    var rate = 1 - Math.exp(-dt * (fast ? 22 : 10));
    for (var key in tgt) this.P[key] = K.lerp(this.P[key], tgt[key], rate);
    var P = this.P;
    this.body.position.y = P.bob + P.jump;
    this.body.rotation.set(0, 0, 0);
    // pitch around the hips height so lying flat (fly) looks right
    this.body.position.y += Math.sin(Math.abs(P.bodyP)) * this.height * .1;
    this.body.rotateOnAxis(AX.L, P.bodyP); this.body.rotateOnAxis(AX.F, P.bodyR);
    for (var n in this.rest) this.bones[n].quaternion.copy(this.rest[n]);
    var L = AX.L, U = AX.U, F = AX.F;
    this.rot('Spine', L, P.lean * .5); this.rot('Spine1', L, P.lean * .3); this.rot('Spine1', U, P.twist); this.rot('Spine2', L, P.lean * .2);
    this.rot('Neck', L, P.headP * .4); this.rot('Head', L, P.headP * .6 - P.lean * .4); this.rot('Head', U, P.headY); this.rot('Head', F, P.headR);
    this.rot('LeftArm', F, -(this.outL - P.liftL)); this.rot('RightArm', F, (this.outR - P.liftR));
    this.rot('LeftArm', L, -P.armL); this.rot('RightArm', L, -P.armR);
    this.rot('LeftForeArm', L, P.elbowL); this.rot('RightForeArm', L, P.elbowR);
    this.rot('LeftUpLeg', L, P.thighL); this.rot('RightUpLeg', L, P.thighR);
    this.rot('LeftLeg', L, P.kneeL); this.rot('RightLeg', L, P.kneeR);
    this.rot('LeftFoot', L, P.footL - (P.kneeL - .05) * .35 - P.thighL * .3);
    this.rot('RightFoot', L, P.footR - (P.kneeR - .05) * .35 - P.thighR * .3);
  };

  /* --- monster (one solid model, animated as a whole: squash, stretch, hop, spin) --- */
  function Mon(gltf, height) {
    this.base(height || 1.25); this.kind = 'mon';
    var model = gltf.scene; K.fitModel(model, this.height);
    this.inner.add(model); this.model = model;
    // Tripo image-to-3D models face +Z already; allow a per-model tweak via ?monface=
    this.inner.rotation.y = (+K.Q.get('monface') || 0) * Math.PI / 180;
    this.S = { sy: 1, jump: 0, tilt: 0, roll: 0, yaw: 0, pitch: 0 };
  }
  Mon.prototype = Object.create(Character.prototype);
  Mon.prototype.update = function (dt) {
    this.stateT += dt;
    var t = this.stateT, sd = this.seed, g = { sy: 1, jump: 0, tilt: 0, roll: 0, yaw: 0, pitch: 0 }, j;
    switch (this.state) {
      case 'idle': g.sy = 1 + .035 * Math.sin(K.now * 3 + sd); g.roll = .05 * Math.sin(K.now * 1.3 + sd); g.yaw = .25 * Math.sin(K.now * .5 + sd); break;
      case 'wave': case 'hello': j = Math.abs(Math.sin(t * 7)); g.jump = .22 * j; g.sy = .85 + .25 * j; g.roll = .18 * Math.sin(t * 10); break;
      case 'cheer': j = Math.abs(Math.sin(t * 5.2)); g.jump = .7 * j; g.sy = .78 + .38 * j; g.yaw = t * 4; break;
      case 'clap': j = Math.abs(Math.sin(t * 8)); g.jump = .12 * j; g.sy = .9 + .12 * j; g.roll = .1 * Math.sin(t * 8); break;
      case 'sad': g.sy = .86; g.pitch = .35; g.roll = .05 * Math.sin(t * 2); break;
      case 'shrug': g.roll = .3 * Math.sin(t * 6) * Math.max(0, 1 - t); g.sy = 1 + .1 * Math.sin(t * 6); break;
      case 'hop': g.sy = 1.25; g.pitch = -.2; break;
      case 'fly': g.sy = 1.3; g.pitch = 1.2; g.roll = .25 * Math.sin(t * 10); break;
      case 'tumble': g.sy = 1.1 + .15 * Math.sin(t * 20); break;
      case 'dizzy': g.roll = .3 * Math.sin(t * 4); g.pitch = .2 * Math.cos(t * 4); g.sy = .92; break;
      case 'kick': g.pitch = Math.sin(Math.min(1, t / .5) * Math.PI) * .45; g.sy = .9 + .2 * Math.sin(Math.min(1, t / .5) * Math.PI); break;
      case 'keeper': g.sy = .85 + .05 * Math.abs(Math.sin(t * 6)); g.roll = .08 * Math.sin(t * 3); break;
      case 'dive': g.sy = 1.2; break;
      case 'headhands': g.sy = .88; g.pitch = .25; g.roll = .12 * Math.sin(t * 3); break;
      case 'stumble': g.pitch = .6 * Math.sin(Math.min(1, t) * Math.PI); g.roll = .3 * Math.sin(t * 12) * Math.max(0, 1 - t); break;
      case 'run': j = Math.abs(Math.sin(this.phase)); this.phase += dt * 12; g.jump = .25 * j; g.sy = .9 + .2 * j; g.pitch = .2; break;
      case 'ready': g.sy = .8; g.pitch = .2; break;
    }
    var r = 1 - Math.exp(-dt * 14), S = this.S;
    for (var k in g) S[k] = K.lerp(S[k], g[k], k === 'yaw' && this.state === 'cheer' ? 1 : r);
    this.body.position.y = S.jump;
    this.body.rotation.set(0, 0, 0);
    this.body.rotateOnAxis(AX.U, S.yaw); this.body.rotateOnAxis(AX.L, S.pitch); this.body.rotateOnAxis(AX.F, S.roll);
    var sx = 1 / Math.sqrt(Math.max(.3, S.sy));
    this.inner.scale.set(sx, S.sy, sx);
  };

  K.Kid = Kid; K.Mon = Mon;
  /* team character: their monster if the model exists, otherwise a kid */
  K.makeCharacter = function (team, opts) {
    opts = opts || {};
    var monUrl = K.ROOT + 'assets/3d/monsters/' + team.mon + '.glb';
    var kidUrl = K.ROOT + 'assets/3d/characters/kid-' + team.kid + '.glb';
    return (opts.kidsOnly || K.Q.has('kids') ? Promise.resolve(null) : K.tryGLB(monUrl)).then(function (g) {
      if (g) return new Mon(g, opts.monHeight);
      return K.loadGLB(kidUrl).then(function (g2) { return new Kid(g2, opts.kidHeight); });
    });
  };

  /* dizzy stars circling a head */
  K.dizzyStars = function (parent, y) {
    var g = new T3.Group(), geo = new T3.OctahedronGeometry(.1, 0);
    for (var i = 0; i < 4; i++) { var s = new T3.Mesh(geo, new T3.MeshBasicMaterial({ color: 0xffd84a })); g.add(s); }
    g.position.y = y; parent.add(g);
    var fn = K.onFrame(function (dt, t) { g.children.forEach(function (s, i) { var a = t * 5 + i * Math.PI / 2; s.position.set(Math.cos(a) * .38, Math.sin(t * 6 + i) * .05, Math.sin(a) * .38); s.rotation.y = t * 6; }); });
    return { remove: function () { K.offFrame(fn); parent.remove(g); } };
  };

  /* ---------- UI ---------- */
  var ui;
  K.ui = {};
  K.el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  K.ui.root = function () { return ui || (ui = document.getElementById('ui')); };
  K.ui.add = function (e) { K.ui.root().appendChild(e); return e; };
  K.ui.clear = function () { K.ui.root().innerHTML = ''; };
  K.ui.big = function (txt, sec, small) { var b = K.ui.add(K.el('div', 'big' + (small ? ' small' : ''), txt)); K.after(sec || .9, function () { b.remove(); }); return b; };
  K.ui.toast = function (txt, sec, color) { var b = K.ui.add(K.el('div', 'toast', txt)); if (color) b.style.setProperty('--c', color); K.after(sec || 2, function () { b.remove(); }); return b; };
  K.ui.teamBar = function (teams, fmt) {
    var bar = K.ui.add(K.el('div', 'hud'));
    teams.forEach(function (t, i) {
      var p = K.el('div', 'tpill', '<i>' + (i + 1) + '</i><span>' + t.name + '</span><b>0</b>'); p.style.setProperty('--c', t.c); t.pill = p; bar.appendChild(p);
    });
    return {
      refresh: function (active) { teams.forEach(function (t, i) { t.pill.classList.toggle('turn', i === active); t.pill.querySelector('b').textContent = fmt ? fmt(t) : t.score; }); },
      bump: function (i) { var p = teams[i].pill; p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
    };
  };
  K.ui.topButtons = function (back) {
    var tb = K.ui.add(K.el('div', 'topbtns'));
    var mu = K.el('button', 'ibtn', K.muted ? '🔇' : '🔊'); mu.title = 'Sound on/off';
    mu.onclick = function () { K.muted = !K.muted; mu.textContent = K.muted ? '🔇' : '🔊'; K.loopVol('music', .25); K.loopVol('crowd', .18); };
    var fs = K.el('button', 'ibtn', '⛶'); fs.title = 'Full screen';
    fs.onclick = function () { if (!document.fullscreenElement) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } else document.exitFullscreen(); };
    var bk = K.el('button', 'ibtn', '✕'); bk.title = 'Back to games'; bk.onclick = function () { location.href = back || '../index.html'; };
    tb.appendChild(mu); tb.appendChild(fs); tb.appendChild(bk);
  };
  var keyFn = null;
  addEventListener('keydown', function (e) { if (keyFn) keyFn(e); });
  /* question card: resolves true/false. In demo mode it answers by itself (demoRight decides). */
  K.ui.ask = function (item, team, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var choices = K.shuffle([item.a].concat(item.w.slice(0, 2)));
      var wrap = K.ui.add(K.el('div', 'qwrap')), card = K.el('div', 'qcard');
      card.style.setProperty('--c', team.c);
      var sp = K.cls && K.cls.speaker(team);
      card.innerHTML = '<div class="qhead"><span>●</span> ' + (sp ? '<i class="qface" data-k3-face="' + sp.id + '">' + sp.initial + '</i>' + K.esc(sp.name) + '\u2019s turn · Team ' + team.name : 'Team ' + team.name) + (opts.prompt ? ' — ' + opts.prompt : '') + '</div>' +
        '<div class="qtext">' + (item.pic ? '<span class="pic">' + item.pic + '</span>' : '') + '<span>' + item.q + '</span></div>';
      var grid = K.el('div', 'opts'), done = false;
      choices.forEach(function (o) {
        var b = K.el('button', 'opt'); b.textContent = o;
        b.onclick = function () {
          if (done) return; done = true; keyFn = null;
          var ok = o === item.a;
          if (sp) { sp.turns++; if (ok) sp.right++; team.speakerIdx = (team.speakerIdx || 0) + 1; }
          Array.prototype.forEach.call(grid.children, function (x) { if (x.textContent === item.a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
          K.sfx(ok ? 'correct' : 'wrong');
          K.after(ok ? .7 : 1.3, function () { wrap.remove(); if (opts.onAnswer) opts.onAnswer(ok); resolve(ok); });
        };
        grid.appendChild(b);
      });
      card.appendChild(grid); wrap.appendChild(card);
      if (sp) K.cls.paintFaces(card);
      keyFn = function (e) { var n = +e.key; if (n >= 1 && n <= 3 && grid.children[n - 1]) grid.children[n - 1].click(); };
      if (K.DEMO) K.after(1.7 + Math.random() * .6, function () {
        var right = opts.demoRight !== undefined ? opts.demoRight : Math.random() < .8;
        Array.prototype.find.call(grid.children, function (b) { return (b.textContent === item.a) === right; }).click();
      });
    });
  };

  /* ---------- questions from the Game Maker sets ---------- */
  K.questions = function (fallbackId) {
    var GM = root.GM || { sets: [] }, id = Q.get('set') || fallbackId || 'g3-u5-vocab';
    var s = (GM.sets || []).find(function (x) { return x.id === id; }) || (GM.sets || [])[0];
    var qs = (s && s.questions || []).filter(function (x) { return x && x.q && x.a && x.w && x.w.length; });
    if (!qs.length) qs = [{ q: 'A king of Ancient Egypt is a…', a: 'pharaoh', w: ['chariot', 'camel'], pic: '👑' }];
    qs = K.shuffle(qs); var i = 0;
    return { next: function () { return qs[i++ % qs.length]; }, title: s ? s.title : '' };
  };

  /* ---------- the class: real teams, whose turn it is, faces, points to the Class Board ----------
     Uses the same class data, team shuffling and points inbox as the 2D games (games/kit/classroom.js),
     so a 3D game behaves like the others. Names and faces appear ONLY when the teacher has unlocked the
     platform in this browser; otherwise the game plays with colour teams and no pupil data at all.
     Every game: K.cls.setupRow(titleBox) on the title screen, K.cls.assign(TEAMS) when it starts,
     K.cls.pointsPanel(endBox, TEAMS, {game, title}) at the end. K.ui.ask does the turns by itself. */
  var C = K.cls = { on: false, classId: '', pupilsOf: {} };
  var INBOX_KEY = 'eaa_games_points_inbox';
  var clsReady = null;
  function loadOnce(url) {
    return new Promise(function (res) {
      if (document.querySelector('script[data-k3-src="' + url + '"]')) return res(true);
      var s = document.createElement('script'); s.src = url; s.async = true; s.setAttribute('data-k3-src', url);
      s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  /* classroom.js needs a few helpers from the 2D kit; give it small stand-ins when that kit is not on the page */
  function kitShim() {
    var Kit = root.Kit = root.Kit || {};
    if (!Kit.pref) {
      var PKEY = 'eaa_games_prefs', prefs = {};
      try { prefs = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { prefs = {}; }
      Kit.pref = function (k, v) { if (arguments.length < 2) return prefs[k]; prefs[k] = v; try { localStorage.setItem(PKEY, JSON.stringify(prefs)); } catch (e) {} return v; };
    }
    if (!Kit.shuffle) Kit.shuffle = K.shuffle;
    if (!Kit.clamp) Kit.clamp = K.clamp;
    if (!Kit.TEAM_LOOK) Kit.TEAM_LOOK = [];
    if (Kit.preview == null) Kit.preview = false;
    if (!root.KIT_ROOT) root.KIT_ROOT = K.ROOT;
    return Kit;
  }
  C.boot = function () {
    if (clsReady) return clsReady;
    if (K.DEMO && !Q.has('cls')) return (clsReady = Promise.resolve(false));   // ?cls=1 lets the automatic tests use a made-up class
    kitShim();
    clsReady = loadOnce(K.ROOT + 'games/kit/classroom.js?v=3').then(function () {
      var R = root.Kit && root.Kit.classroom;
      return !!(R && R.isTeacherSession());
    });
    return clsReady;
  };
  function R() { return root.Kit && root.Kit.classroom; }
  C.face = function (id) {
    try { return (root.PupilAvatars && root.PupilAvatars.pictureFor && root.PupilAvatars.pictureFor(id)) || ''; } catch (e) { return ''; }
  };
  C.speaker = function (team) {
    if (!team || !team.pupils || !team.pupils.length) return null;
    return team.pupils[(team.speakerIdx || 0) % team.pupils.length];
  };
  /* the title screen row: pick the class (or no names), see the teams, shuffle them */
  C.setupRow = function (box, nTeams) {
    var wrap = K.el('div', 'clsbox'); box.insertBefore(wrap, box.lastChild);
    C.boot().then(function (ok) {
      if (!ok) { wrap.remove(); return; }
      var list = R().classes();
      if (!list.length) { wrap.remove(); return; }
      var Kit = root.Kit;
      var saved = Kit.pref('classId');
      C.classId = saved === 'none' ? '' : (list.some(function (c) { return c.id === saved; }) ? saved : R().defaultClassId());
      function draw(remix) {
        wrap.innerHTML = '';
        var pick = K.el('div', 'clspick');
        list.forEach(function (c) {
          var b = K.el('button', 'clsbtn' + (c.id === C.classId ? ' on' : ''), c.label);
          b.onclick = function () { C.classId = c.id; Kit.pref('classId', c.id); draw(); };
          pick.appendChild(b);
        });
        var none = K.el('button', 'clsbtn' + (!C.classId ? ' on' : ''), '🎨 No names');
        none.title = 'Play with colour teams only';
        none.onclick = function () { C.classId = ''; Kit.pref('classId', 'none'); draw(); };
        pick.appendChild(none);
        wrap.appendChild(pick);
        C.on = false; C.preview = null;
        if (!C.classId) return;
        var teams = R().buildTeams(nTeams, { classId: C.classId, teamMode: 'fair', forceRemix: !!remix });
        if (!teams.some(function (t) { return t.pupils && t.pupils.length; })) return;
        C.on = true; C.preview = teams;
        var grid = K.el('div', 'clsteams');
        teams.slice(0, nTeams).forEach(function (t, i) {
          var col = K.el('div', 'clsteam'); col.style.setProperty('--c', K.TEAMS[i].c);
          col.appendChild(K.el('b', '', K.TEAMS[i].name));
          (t.pupils || []).forEach(function (p) {
            var chip = K.el('span', 'clskid');
            chip.innerHTML = '<i data-k3-face="' + p.id + '">' + p.initial + '</i>' + K.esc(p.name);
            col.appendChild(chip);
          });
          grid.appendChild(col);
        });
        wrap.appendChild(grid);
        var mix = K.el('button', 'clsbtn mix', '🔀 New teams'); mix.onclick = function () { draw(true); };
        wrap.appendChild(mix);
        C.paintFaces(wrap);
      }
      draw();
      root.addEventListener('eaa:avatars-ready', function () { C.paintFaces(wrap); });
      [1500, 4000, 8000].forEach(function (ms) { setTimeout(function () { C.paintFaces(document); }, ms); });
    });
  };
  C.paintFaces = function (scope) {
    var nodes = (scope || document).querySelectorAll('[data-k3-face]');
    Array.prototype.forEach.call(nodes, function (n) {
      var u = C.face(n.getAttribute('data-k3-face'));
      if (!u) return;
      var im = n.querySelector('img');
      if (!im) { n.textContent = ''; im = document.createElement('img'); im.alt = ''; n.appendChild(im); }
      if (im.getAttribute('src') !== u) im.setAttribute('src', u);
    });
  };
  /* when the game starts: give each colour team its pupils */
  C.assign = function (TEAMS) {
    if (!C.on || !C.preview) return;
    TEAMS.forEach(function (t, i) {
      var src = C.preview[i];
      t.pupils = src && src.pupils ? src.pupils.map(function (p) { return { id: p.id, name: p.name, initial: p.initial, right: 0, turns: 0 }; }) : [];
      t.speakerIdx = 0;
    });
  };
  K.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* how many points each child gets: by the team's place, plus 2 for every own right answer (5..30) */
  var PLACE_XP = [20, 15, 10, 10];
  C.pointsPanel = function (box, TEAMS, opts) {
    opts = opts || {};
    if (!C.on || !C.classId || !TEAMS.some(function (t) { return t.pupils && t.pupils.length; })) return null;
    var scoreOf = opts.scoreOf || function (t) { return t.score || 0; };
    var sorted = TEAMS.map(function (t) { return scoreOf(t); }).sort(function (a, b) { return b - a; });
    var base = TEAMS.map(function (t) { return PLACE_XP[Math.min(3, sorted.indexOf(scoreOf(t)))]; });
    var stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6), sent = false;
    var card = K.el('div', 'xpcard');
    var rows = K.el('div', 'xprows'), send = K.el('button', 'btn green', '');
    function xpFor(t, i, p) { return K.clamp(base[i] + 2 * (p.right || 0), 5, 30); }
    function total() { var n = 0, k = 0; TEAMS.forEach(function (t, i) { (t.pupils || []).forEach(function (p) { n += xpFor(t, i, p); k++; }); }); return { xp: n, kids: k }; }
    function draw() {
      rows.innerHTML = '';
      TEAMS.forEach(function (t, i) {
        if (!t.pupils || !t.pupils.length) return;
        var r = K.el('div', 'xprow'); r.style.setProperty('--c', t.c);
        var minus = K.el('button', 'xpstep', '−'), plus = K.el('button', 'xpstep', '+');
        minus.disabled = sent || base[i] <= 5; plus.disabled = sent || base[i] >= 25;
        minus.onclick = function () { base[i] = Math.max(5, base[i] - 5); draw(); };
        plus.onclick = function () { base[i] = Math.min(25, base[i] + 5); draw(); };
        var kids = t.pupils.map(function (p) { return '<span class="xpkid"><i data-k3-face="' + p.id + '">' + p.initial + '</i>' + K.esc(p.name) + ' <b>+' + xpFor(t, i, p) + '</b></span>'; }).join('');
        r.innerHTML = '<div class="xpteam">' + t.name + '</div><div class="xpkids">' + kids + '</div>';
        var ctl = K.el('div', 'xpctl'); ctl.appendChild(minus); ctl.appendChild(K.el('b', '', base[i] + ' XP')); ctl.appendChild(plus);
        r.appendChild(ctl); rows.appendChild(r);
      });
      var tt = total();
      send.textContent = sent ? '✓ Sent to the Class Board!' : '⭐ Send ' + tt.xp + ' XP to ' + tt.kids + ' pupils';
      send.disabled = sent;
      C.paintFaces(card);
    }
    send.onclick = function () {
      if (sent) return;
      var entries = [];
      TEAMS.forEach(function (t, i) {
        (t.pupils || []).forEach(function (p) {
          entries.push({ id: (opts.game || 'game3d') + '_' + stamp + '_' + p.id, studentId: p.id, classId: C.classId, amount: xpFor(t, i, p),
            reason: (opts.title || '3D game') + ' · Team ' + t.name, icon: '🎮', ts: Date.now() });
        });
      });
      var inbox = [];
      try { inbox = JSON.parse(localStorage.getItem(INBOX_KEY) || '[]') || []; } catch (e) { inbox = []; }
      var have = {}; inbox.forEach(function (e) { if (e && e.id) have[e.id] = 1; });
      entries.forEach(function (e) { if (!have[e.id]) inbox.push(e); });
      try { localStorage.setItem(INBOX_KEY, JSON.stringify(inbox)); } catch (e) {}
      try { if (root.BroadcastChannel) { var bc = new BroadcastChannel('eaa_games_xp'); bc.postMessage({ type: 'XP_QUEUED', count: entries.length }); bc.close(); } } catch (e) {}
      sent = true; K.sfx('win'); draw();
    };
    card.appendChild(K.el('div', 'xphead', '⭐ Points for the Class Board <small>place in the game + 2 for each own right answer</small>'));
    card.appendChild(rows); card.appendChild(send);
    box.insertBefore(card, box.firstChild.nextSibling || null);
    draw();
    return card;
  };
})(window);
