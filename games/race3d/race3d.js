/* 3D Sprint Race — English Adventure Academy
   Real 3D: rigged boy/girl avatars (Tripo, Mixamo skeleton) animated in code.
   Answer right -> your runner sprints. Wrong -> comic stumble. First over the line wins.
   URL options: ?teams=2..4  ?set=<GM set id>  ?demo=1 (auto-play)  ?capture=1 (frame stepping for video)  */
(function () {
  'use strict';
  var T3 = window.THREE;
  var Q = new URLSearchParams(location.search);
  var DEMO = Q.has('demo') || Q.has('capture');
  var CAPTURE = Q.has('capture');
  var ROOT = '../../';

  /* ---------------- settings ---------------- */
  var TEAMS = [
    { name: 'Pink',   c: '#ff5fa2', c2: 0xff5fa2, kid: 'girl' },
    { name: 'Blue',   c: '#4f9dff', c2: 0x4f9dff, kid: 'boy' },
    { name: 'Yellow', c: '#ffb320', c2: 0xffb320, kid: 'girl' },
    { name: 'Green',  c: '#2fc58a', c2: 0x2fc58a, kid: 'boy' }
  ];
  var nTeams = Math.max(2, Math.min(4, +Q.get('teams') || 4));
  var STEPS = Math.max(2, Math.min(10, +Q.get('steps') || 6)); // correct answers needed
  var TRACK = 30;             // finish x
  var STEP = TRACK / STEPS;
  var LANE = 1.7;
  var KID_H = 1.6;

  /* ---------------- clock + scheduler (works in real-time and frame-capture) ---------------- */
  var now = 0, jobs = [];
  function after(sec, fn) { jobs.push({ at: now + sec, fn: fn }); }
  function runJobs() {
    for (var i = 0; i < jobs.length; i++) {
      if (jobs[i].at <= now) { var j = jobs.splice(i, 1)[0]; i--; j.fn(); }
    }
  }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------------- sound (tiny synth, no files) ---------------- */
  var AC = null;
  function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
  function tone(f, d, type, vol, slide) {
    var a = audio(); if (!a || CAPTURE) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || .2, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
  }
  function noise(d, vol, freq) {
    var a = audio(); if (!a || CAPTURE) return;
    var n = a.sampleRate * d, b = a.createBuffer(1, n, a.sampleRate), ch = b.getChannelData(0);
    for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = freq || 1200; g.gain.value = vol || .3;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  var SFX_FILES = { beep: 'countdown', go: 'go', ding: 'correct', buzz: 'wrong', step: 'step', boing: 'stumble', cheer: 'win', whoosh: 'whoosh', hello: 'hello' };
  var BUF = {}, loops = {}, muted = false;
  function loadSounds() {
    var a = audio(); if (!a || loadSounds.done || CAPTURE) return; loadSounds.done = true;
    Object.keys(SFX_FILES).concat(['music', 'crowd']).forEach(function (k) {
      var f = SFX_FILES[k] || k;
      fetch('sfx/' + f + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (b) { return a.decodeAudioData(b); })
        .then(function (buf) { BUF[k] = buf; if (k === 'music' || k === 'crowd') startLoop(k); })
        .catch(function () {});
    });
  }
  function playBuf(k, vol) {
    var a = audio(); if (!a || !BUF[k] || muted || CAPTURE) return false;
    var s = a.createBufferSource(), g = a.createGain(); s.buffer = BUF[k]; g.gain.value = vol || 1;
    s.connect(g); g.connect(a.destination); s.start(); return true;
  }
  function startLoop(k) {
    if (loops[k] || !BUF[k] || game.phase === 'loading') return;
    var a = audio(), s = a.createBufferSource(), g = a.createGain();
    s.buffer = BUF[k]; s.loop = true; g.gain.value = muted ? 0 : (k === 'music' ? .25 : .18);
    s.connect(g); g.connect(a.destination); s.start(); loops[k] = g;
  }
  function setLoopVol(k, v) { if (loops[k] && AC) loops[k].gain.setTargetAtTime(muted ? 0 : v, AC.currentTime, .3); }
  var SYN = {
    beep: function () { tone(660, .18, 'square', .12); },
    go: function () { tone(990, .45, 'square', .14); noise(1.2, .35, 900); },
    ding: function () { tone(880, .12, 'triangle', .25); setTimeout(function () { tone(1320, .3, 'triangle', .25); }, 110); },
    buzz: function () { tone(180, .4, 'sawtooth', .12, 90); },
    step: function () { noise(.05, .25, 500); },
    boing: function () { tone(300, .35, 'sine', .25, 700); },
    cheer: function () { noise(2.2, .45, 1100); [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { tone(f, .3, 'triangle', .2); }, i * 120); }); },
    whoosh: function () { noise(.5, .3, 2200); },
    hello: function () { tone(520, .12, 'sine', .15, 780); }
  };
  var SFX = {};
  Object.keys(SYN).forEach(function (k) { SFX[k] = function () { if (muted) return; if (!playBuf(k, k === 'step' ? .5 : 1)) SYN[k](); }; });

  /* ---------------- questions ---------------- */
  var GM = window.GM || { sets: [] };
  function pickSet() {
    var id = Q.get('set') || 'g3-u5-vocab';
    var s = (GM.sets || []).find(function (x) { return x.id === id; }) || (GM.sets || [])[0];
    var qs = (s && s.questions || []).filter(function (x) { return x && x.q && x.a && x.w && x.w.length; });
    if (!qs.length) qs = [
      { q: 'A king of Ancient Egypt is a…', a: 'pharaoh', w: ['chariot', 'camel'], pic: '👑' },
      { q: 'We see far with…', a: 'glasses', w: ['shoes', 'bread'], pic: '👓' }
    ];
    return qs.slice().sort(function () { return Math.random() - .5; });
  }
  var QUESTIONS = pickSet(), qi = 0;
  function nextQ() { var x = QUESTIONS[qi % QUESTIONS.length]; qi++; return x; }

  /* ---------------- renderer / scene ---------------- */
  var canvas = document.getElementById('scene');
  var renderer = new T3.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: CAPTURE, powerPreference: 'high-performance' });
  renderer.setPixelRatio(CAPTURE ? (+Q.get('pr') || 1) : Q.get('q') === 'low' ? 1 : Math.min(2, Math.max(1.5, window.devicePixelRatio || 1)));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T3.PCFSoftShadowMap;
  var scene = new T3.Scene();
  scene.fog = new T3.Fog(0xcdeaff, 45, 110);
  var camera = new T3.PerspectiveCamera(42, 16 / 9, .1, 300);

  // sky dome with gradient
  (function sky() {
    var g = new T3.SphereGeometry(160, 32, 16);
    var m = new T3.ShaderMaterial({
      side: T3.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T3.Color(0x7cc6ff) }, mid: { value: new T3.Color(0xc4e7ff) }, bot: { value: new T3.Color(0xffe9f4) } },
      vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 p; void main(){ float h = normalize(p).y; vec3 c = h>0.15 ? mix(mid, top, smoothstep(.15,.7,h)) : mix(bot, mid, smoothstep(-.05,.15,h)); gl_FragColor = vec4(c,1.); }'
    });
    scene.add(new T3.Mesh(g, m));
  })();

  scene.add(new T3.HemisphereLight(0xffffff, 0x9ad08a, 1.15));
  var sun = new T3.DirectionalLight(0xfff4e0, 1.6);
  sun.position.set(-12, 22, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 10; sc.bottom = -10; sc.near = 1; sc.far = 70;
  sun.shadow.bias = -.0005;
  scene.add(sun); scene.add(sun.target);

  var texLoader = new T3.TextureLoader();
  function artTex(file, onOk) {   // optional picture from Gemini: art/<file>; silently keeps the built-in look if missing
    texLoader.load('art/' + file, function (t) { t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; onOk(t); }, undefined, function () {});
  }
  function mat(c, o) { return new T3.MeshLambertMaterial(Object.assign({ color: c }, o || {})); }
  function canvasTex(w, h, draw) {
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    var t = new T3.CanvasTexture(cv); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t;
  }

  var trackW = nTeams * LANE + 1.2;
  var zMid = 0; // lanes centred on z = 0
  function laneZ(i) { return (i - (nTeams - 1) / 2) * LANE; }

  /* ground + track */
  (function world() {
    var grass = new T3.Mesh(new T3.PlaneGeometry(400, 400), mat(0x8fdc7a));
    grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; scene.add(grass);

    // striped grass bands
    for (var i = -6; i < 12; i++) {
      if (i % 2) continue;
      var band = new T3.Mesh(new T3.PlaneGeometry(4, 60), mat(0x84d36f));
      band.rotation.x = -Math.PI / 2; band.position.set(i * 4, .003, 0); band.receiveShadow = true; scene.add(band);
    }

    var len = TRACK + 22;
    var tex = canvasTex(512, 256, function (x, w, h) {
      x.fillStyle = '#f08a6c'; x.fillRect(0, 0, w, h);
      for (var k = 0; k < 900; k++) { x.fillStyle = 'rgba(255,255,255,' + Math.random() * .08 + ')'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
    tex.wrapS = tex.wrapT = T3.RepeatWrapping; tex.repeat.set(len / 6, 1);
    var track = new T3.Mesh(new T3.PlaneGeometry(len, trackW), new T3.MeshLambertMaterial({ map: tex }));
    track.rotation.x = -Math.PI / 2; track.position.set(TRACK / 2 + 3, .01, zMid); track.receiveShadow = true; scene.add(track);

    // lane lines
    for (var l = 0; l <= nTeams; l++) {
      var z = (l - nTeams / 2) * LANE;
      var line = new T3.Mesh(new T3.PlaneGeometry(len, .07), mat(0xffffff));
      line.rotation.x = -Math.PI / 2; line.position.set(TRACK / 2 + 3, .02, z); scene.add(line);
    }
    // kerbs
    [-1, 1].forEach(function (s) {
      var kerb = new T3.Mesh(new T3.BoxGeometry(len, .12, .25), mat(0xffffff));
      kerb.position.set(TRACK / 2 + 3, .06, s * (trackW / 2 + .12)); kerb.receiveShadow = true; scene.add(kerb);
    });
    // start line + step markers
    var start = new T3.Mesh(new T3.PlaneGeometry(.25, trackW), mat(0xffffff));
    start.rotation.x = -Math.PI / 2; start.position.set(0, .025, zMid); scene.add(start);
    for (var s = 1; s < STEPS; s++) {
      var mk = new T3.Mesh(new T3.PlaneGeometry(.12, trackW), mat(0xffffff, { transparent: true, opacity: .45 }));
      mk.rotation.x = -Math.PI / 2; mk.position.set(s * STEP, .022, zMid); scene.add(mk);
    }
    // checkered finish strip
    var chk = canvasTex(64, 512, function (x, w, h) {
      var sq = 32; for (var yy = 0; yy < h / sq; yy++) for (var xx = 0; xx < 2; xx++) { x.fillStyle = (xx + yy) % 2 ? '#222' : '#fff'; x.fillRect(xx * sq, yy * sq, sq, sq); }
    });
    var fin = new T3.Mesh(new T3.PlaneGeometry(.8, trackW), new T3.MeshLambertMaterial({ map: chk }));
    fin.rotation.x = -Math.PI / 2; fin.position.set(TRACK, .03, zMid); scene.add(fin);

    // lane numbers painted at the start
    for (var n = 0; n < nTeams; n++) {
      var nt = canvasTex(128, 128, (function (n) { return function (x) {
        x.fillStyle = TEAMS[n].c; x.beginPath(); x.arc(64, 64, 56, 0, 7); x.fill();
        x.fillStyle = '#fff'; x.font = '900 80px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n + 1, 64, 68);
      }; })(n));
      var num = new T3.Mesh(new T3.PlaneGeometry(.9, .9), new T3.MeshLambertMaterial({ map: nt, transparent: true }));
      num.rotation.x = -Math.PI / 2; num.rotation.z = -Math.PI / 2; num.position.set(-1.3, .03, laneZ(n)); scene.add(num);
    }
  })();

  /* finish arch with banner + tape */
  var tape = null, tapeHalves = [], archGroup = null;
  (function arch() {
    var g = new T3.Group(); g.position.set(TRACK, 0, zMid);
    var postM = mat(0xffffff);
    var h = 4.2, half = trackW / 2 + .5;
    [-1, 1].forEach(function (s) {
      var p = new T3.Mesh(new T3.CylinderGeometry(.22, .26, h, 16), postM); p.position.set(0, h / 2, s * half); p.castShadow = true; g.add(p);
      var ball = new T3.Mesh(new T3.SphereGeometry(.38, 20, 14), mat(0xff6fae)); ball.position.set(0, h + .25, s * half); g.add(ball);
      var ring = new T3.Mesh(new T3.TorusGeometry(.3, .08, 8, 20), mat(0xffd84a)); ring.rotation.x = Math.PI / 2; ring.position.set(0, .9, s * half); g.add(ring);
    });
    var btex = canvasTex(1024, 160, function (x, w, hh) {
      var gr = x.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ff6fae'); gr.addColorStop(.5, '#9b7bff'); gr.addColorStop(1, '#4f9dff');
      x.fillStyle = gr; x.fillRect(0, 0, w, hh);
      x.fillStyle = '#fff'; x.font = '900 104px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.lineWidth = 14; x.strokeStyle = 'rgba(43,29,64,.6)'; x.strokeText('FINISH', w / 2, hh / 2 + 6); x.fillText('FINISH', w / 2, hh / 2 + 6);
    });
    var banner = new T3.Mesh(new T3.BoxGeometry(.25, 1.1, half * 2 + .4), [mat(0x9b7bff), mat(0x9b7bff), mat(0x9b7bff), mat(0x9b7bff), new T3.MeshLambertMaterial({ map: btex }), new T3.MeshLambertMaterial({ map: btex })]);
    // box faces: +x,-x,+y,-y,+z,-z — put text on the x faces
    banner.material = [new T3.MeshLambertMaterial({ map: btex }), new T3.MeshLambertMaterial({ map: btex }), mat(0x9b7bff), mat(0x9b7bff), mat(0x9b7bff), mat(0x9b7bff)];
    btex.center.set(.5, .5);
    artTex('finish-banner.png', function (t) { [0, 1].forEach(function (k) { banner.material[k].map = t; banner.material[k].needsUpdate = true; }); });
    banner.position.set(0, h - .2, 0); banner.castShadow = true; g.add(banner);
    // bunting
    var cols = [0xff6fae, 0xffd84a, 0x4f9dff, 0x2fc58a, 0x9b7bff];
    for (var i = 0; i < 14; i++) {
      var t = i / 13, z = lerp(-half, half, t), y = h - 1.0 - Math.sin(t * Math.PI) * .55;
      var flag = new T3.Mesh(new T3.ConeGeometry(.17, .38, 3), mat(cols[i % 5])); flag.rotation.z = Math.PI; flag.position.set(.05, y, z); flag.userData.bunt = i; g.add(flag);
    }
    // tape
    var tm = mat(0xffffff);
    tape = new T3.Mesh(new T3.BoxGeometry(.04, .07, half * 2), tm); tape.position.set(-.15, 1.15, 0); g.add(tape);
    [-1, 1].forEach(function (s) {
      var hm = new T3.Mesh(new T3.BoxGeometry(.04, .07, half), mat(0xff5fa2)); hm.visible = false; hm.position.set(-.15, 1.15, s * half / 2); hm.userData.s = s; g.add(hm); tapeHalves.push(hm);
    });
    scene.add(g);
    archGroup = g;
  })();

  /* bleachers + bouncing crowd */
  var crowd = null, crowdHeads = null, crowdData = [];
  (function stands() {
    var zBack = -(trackW / 2 + 3.2);
    var rows = 4, len = TRACK + 14;
    for (var r = 0; r < rows; r++) {
      var step = new T3.Mesh(new T3.BoxGeometry(len, .5, 1.1), mat(r % 2 ? 0xbfe0ff : 0xd8ecff));
      step.position.set(TRACK / 2 - 1, .25 + r * .5, zBack - r * 1.1); step.receiveShadow = true; step.castShadow = true; scene.add(step);
      var under = new T3.Mesh(new T3.BoxGeometry(len, r * .5 + .01, 1.1), mat(0xa9cff3)); under.position.set(TRACK / 2 - 1, (r * .5) / 2, zBack - r * 1.1); scene.add(under);
    }
    var palette = [0xff8fb8, 0x8fc3ff, 0xffd166, 0x7ee0b0, 0xc3a6ff, 0xff9f68, 0xf5f5f5];
    var skin = [0xffd9b8, 0xf1c39b, 0xc98d63, 0x8d5a3b, 0xffe2c9];
    var per = Math.floor(len / .75), count = per * rows;
    var bodyG = new T3.CapsuleGeometry(.2, .32, 4, 10), headG = new T3.SphereGeometry(.17, 14, 10);
    crowd = new T3.InstancedMesh(bodyG, new T3.MeshLambertMaterial(), count);
    crowdHeads = new T3.InstancedMesh(headG, new T3.MeshLambertMaterial(), count);
    var c = new T3.Color(), k = 0;
    for (var rr = 0; rr < rows; rr++) for (var i = 0; i < per; i++) {
      if (Math.random() < .12) continue;
      var d = { x: TRACK / 2 - 1 - len / 2 + .4 + i * .75 + rnd(-.1, .1), y: .5 + rr * .5 + .36, z: zBack - rr * 1.1 + rnd(-.1, .1), ph: rnd(0, 6.28), sp: rnd(5, 9), hype: 0 };
      crowdData.push(d);
      crowd.setColorAt(k, c.setHex(palette[(Math.random() * palette.length) | 0]));
      crowdHeads.setColorAt(k, c.setHex(skin[(Math.random() * skin.length) | 0]));
      k++;
    }
    crowd.count = crowdHeads.count = k;
    crowd.castShadow = true;
    scene.add(crowd); scene.add(crowdHeads);
  })();
  var crowdHype = 0; // 0 calm .. 1 crazy
  var m4 = new T3.Matrix4();
  function updateCrowd(t) {
    for (var i = 0; i < crowdData.length; i++) {
      var d = crowdData[i];
      var amp = .03 + crowdHype * .28;
      var j = Math.max(0, Math.sin(t * (d.sp * (.5 + crowdHype * .7)) + d.ph)) * amp;
      m4.makeTranslation(d.x, d.y + j, d.z); crowd.setMatrixAt(i, m4);
      m4.makeTranslation(d.x + Math.sin(t * 2 + d.ph) * .03, d.y + j + .44, d.z); crowdHeads.setMatrixAt(i, m4);
    }
    crowd.instanceMatrix.needsUpdate = true; crowdHeads.instanceMatrix.needsUpdate = true;
  }

  /* picture boards in front of the stands (appear only when art/board-1..4.png exist) */
  (function boards() {
    for (var b = 1; b <= 4; b++) (function (b) {
      artTex('board-' + b + '.png', function (t) {
        var m = new T3.Mesh(new T3.PlaneGeometry(4, 1), new T3.MeshLambertMaterial({ map: t }));
        m.position.set(-2 + b * (TRACK + 4) / 4.5, .55, -(trackW / 2 + .9)); scene.add(m);
      });
    })(b);
  })();

  /* waving flags on poles */
  var flags = [];
  (function makeFlags() {
    var zf = -(trackW / 2 + 1.7);
    for (var i = 0; i < 6; i++) {
      var x = 3 + i * (TRACK + 2) / 5, team = TEAMS[i % nTeams];
      var pole = new T3.Mesh(new T3.CylinderGeometry(.05, .05, 4, 8), mat(0xffffff)); pole.position.set(x, 2, zf); pole.castShadow = true; scene.add(pole);
      var geo = new T3.PlaneGeometry(1.4, .85, 14, 4); geo.translate(.7, 0, 0);
      var f = new T3.Mesh(geo, mat(team.c2, { side: T3.DoubleSide })); f.position.set(x, 3.5, zf); f.castShadow = true; scene.add(f);
      f.userData.base = geo.attributes.position.array.slice(); f.userData.ph = i;
      (function (f, n) { artTex('flag-' + n + '.png', function (t) { f.material.map = t; f.material.color.set(0xffffff); f.material.needsUpdate = true; }); })(f, team.name.toLowerCase());
      flags.push(f);
    }
  })();
  function updateFlags(t) {
    flags.forEach(function (f) {
      var p = f.geometry.attributes.position, b = f.userData.base;
      for (var i = 0; i < p.count; i++) {
        var x = b[i * 3];
        p.array[i * 3 + 2] = Math.sin(x * 4 - t * 6 + f.userData.ph) * x * .18;
        p.array[i * 3 + 1] = b[i * 3 + 1] + Math.sin(x * 3 - t * 4) * x * .04;
      }
      p.needsUpdate = true; f.geometry.computeVertexNormals();
    });
  }

  /* trees, hills, clouds, balloons */
  var clouds = [], balloons = [];
  (function scenery() {
    var hillCols = [0x7fcf6e, 0x9ae08a, 0x6fc46a];
    for (var i = 0; i < 9; i++) {
      var hgeo = new T3.SphereGeometry(rnd(10, 18), 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      var hill = new T3.Mesh(hgeo, mat(hillCols[i % 3])); hill.scale.y = rnd(.3, .5);
      hill.position.set(-20 + i * 9 + rnd(-3, 3), -.5, -38 - rnd(0, 12)); scene.add(hill);
    }
    var leafCols = [0x5cc46a, 0x4fb562, 0x74d37c, 0xf59ac3];
    for (var t = 0; t < 26; t++) {
      var tr = new T3.Group(), side = t % 2 ? 1 : -1;
      var x = rnd(-14, TRACK + 16), z = side > 0 ? rnd(trackW / 2 + 11, trackW / 2 + 22) : rnd(-26, -16);
      var trunk = new T3.Mesh(new T3.CylinderGeometry(.15, .2, 1.2, 8), mat(0xb07a52)); trunk.position.y = .6; tr.add(trunk);
      var lc = leafCols[(Math.random() * leafCols.length) | 0];
      for (var b = 0; b < 3; b++) { var leaf = new T3.Mesh(new T3.SphereGeometry(rnd(.6, .9), 14, 10), mat(lc)); leaf.position.set(rnd(-.3, .3), 1.5 + b * .45, rnd(-.3, .3)); leaf.castShadow = true; tr.add(leaf); }
      tr.position.set(x, 0, z); tr.scale.setScalar(rnd(.9, 1.5)); tr.userData.ph = rnd(0, 6); scene.add(tr);
    }
    var cm = new T3.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .35 });
    for (var c = 0; c < 10; c++) {
      var cg = new T3.Group();
      for (var p = 0; p < 5; p++) { var puff = new T3.Mesh(new T3.SphereGeometry(rnd(1.2, 2.2), 14, 10), cm); puff.position.set(p * 1.6 - 3, rnd(-.3, .5), rnd(-.5, .5)); puff.scale.y = .7; cg.add(puff); }
      cg.position.set(rnd(-30, 60), rnd(14, 24), rnd(-60, -25)); cg.userData.v = rnd(.4, 1.1); scene.add(cg); clouds.push(cg);
    }
    var bc = [0xff6fae, 0xffd84a, 0x4f9dff, 0x2fc58a, 0x9b7bff, 0xff9f68];
    for (var bb = 0; bb < 9; bb++) {
      var bg = new T3.Group();
      var ball = new T3.Mesh(new T3.SphereGeometry(.38, 18, 14), new T3.MeshLambertMaterial({ color: bc[bb % 6], emissive: bc[bb % 6], emissiveIntensity: .15 })); ball.scale.y = 1.18; bg.add(ball);
      var str = new T3.Mesh(new T3.CylinderGeometry(.008, .008, 1.4, 4), mat(0xffffff)); str.position.y = -1.1; bg.add(str);
      var s = bb % 2 ? 1 : -1;
      bg.position.set(TRACK + rnd(-.6, .6), 3.2 + rnd(0, 1.3), s * (trackW / 2 + .6 + rnd(0, .8)));
      bg.userData = { y: bg.position.y, ph: rnd(0, 6) }; scene.add(bg); balloons.push(bg);
    }
  })();
  function updateScenery(t, dt) {
    clouds.forEach(function (c) { c.position.x += c.userData.v * dt; if (c.position.x > 70) c.position.x = -40; });
    balloons.forEach(function (b) { b.position.y = b.userData.y + Math.sin(t * 1.6 + b.userData.ph) * .18; b.rotation.z = Math.sin(t * 1.1 + b.userData.ph) * .12; });
    archGroup.children.forEach(function (ch) { if (ch.userData.bunt !== undefined) ch.rotation.x = Math.sin(t * 3 + ch.userData.bunt) * .25; });
  }

  /* ---------------- particles: dust + confetti + stars ---------------- */
  var dust = [];
  var dustG = new T3.SphereGeometry(.12, 8, 6);
  function puff(x, y, z, n, col) {
    for (var i = 0; i < (n || 3); i++) {
      var m = new T3.Mesh(dustG, new T3.MeshBasicMaterial({ color: col || 0xfff3ea, transparent: true, opacity: .55, depthWrite: false }));
      m.position.set(x + rnd(-.15, .15), y + rnd(0, .1), z + rnd(-.25, .25));
      m.userData = { v: new T3.Vector3(rnd(-1.6, -.4), rnd(.4, 1.2), rnd(-.5, .5)), life: 0, max: rnd(.35, .6), s: rnd(.35, .7) };
      scene.add(m); dust.push(m);
    }
  }
  var confG = new T3.PlaneGeometry(.12, .2), confetti = [];
  var confCols = [0xff6fae, 0xffd84a, 0x4f9dff, 0x2fc58a, 0x9b7bff, 0xffffff, 0xff9f68];
  function confettiBurst(x, y, z, n) {
    for (var i = 0; i < n; i++) {
      var m = new T3.Mesh(confG, new T3.MeshBasicMaterial({ color: confCols[i % confCols.length], side: T3.DoubleSide }));
      m.position.set(x + rnd(-.3, .3), y, z + rnd(-.3, .3));
      var a = rnd(0, 6.28), sp = rnd(2, 7);
      m.userData = { v: new T3.Vector3(Math.cos(a) * sp * .6, rnd(5, 11), Math.sin(a) * sp), r: new T3.Vector3(rnd(-9, 9), rnd(-9, 9), rnd(-9, 9)), life: 0 };
      scene.add(m); confetti.push(m);
    }
  }
  function updateParticles(dt) {
    for (var i = dust.length - 1; i >= 0; i--) {
      var d = dust[i], u = d.userData; u.life += dt;
      d.position.addScaledVector(u.v, dt); u.v.y -= 1.2 * dt;
      var k = u.life / u.max; d.scale.setScalar(u.s * (1 + k * 2.2)); d.material.opacity = .55 * (1 - k);
      if (k >= 1) { scene.remove(d); d.material.dispose(); dust.splice(i, 1); }
    }
    for (var j = confetti.length - 1; j >= 0; j--) {
      var c = confetti[j], cu = c.userData; cu.life += dt;
      cu.v.y -= 9 * dt; cu.v.multiplyScalar(1 - 1.4 * dt);
      if (cu.v.y < -1.6) cu.v.y = -1.6;
      c.position.addScaledVector(cu.v, dt);
      c.rotation.x += cu.r.x * dt; c.rotation.y += cu.r.y * dt; c.rotation.z += cu.r.z * dt;
      if (c.position.y < .03) { c.position.y = .03; cu.v.set(0, 0, 0); cu.r.set(0, 0, 0); c.rotation.x = -Math.PI / 2; }
      if (cu.life > 9) { scene.remove(c); c.material.dispose(); confetti.splice(j, 1); }
    }
  }

  /* ---------------- avatars: load + procedural skeleton animation ---------------- */
  var BONES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftShoulder', 'RightShoulder', 'LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm', 'LeftHand', 'RightHand', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'];
  var AX = { L: new T3.Vector3(1, 0, 0), U: new T3.Vector3(0, 1, 0), F: new T3.Vector3(0, 0, 1) };
  var _q = new T3.Quaternion(), _pw = new T3.Quaternion(), _pwi = new T3.Quaternion(), _rq = new T3.Quaternion(), _ax = new T3.Vector3();

  function loadBuffer(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }); }
  function parseGLB(buf) {
    return new Promise(function (res, rej) { new T3.GLTFLoader().parse(buf.slice(0), '', res, rej); });
  }

  function Runner(i, gltf) {
    var self = this;
    this.i = i; this.team = TEAMS[i];
    this.root = new T3.Group();       // world placement, faces +X
    this.body = new T3.Group();       // bob / lean / jumps
    this.inner = new T3.Group();      // turns the model so its front is canonical +Z
    this.root.add(this.body); this.body.add(this.inner);
    var model = gltf.scene; this.inner.add(model);
    this.bones = {}; this.rest = {};
    model.traverse(function (o) {
      if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; if (o.material) { o.material.metalness = 0; o.material.roughness = .75; } }
      if (o.isBone) {
        var key = o.name.replace(/^mixamorig:?/, '');
        if (BONES.indexOf(key) >= 0) { self.bones[key] = o; self.rest[key] = o.quaternion.clone(); }
      }
    });
    // measure: size + which way it faces
    this.root.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(model), h = box.max.y - box.min.y;
    var s = KID_H / h; model.scale.multiplyScalar(s); model.position.y -= box.min.y * s;
    this.root.updateMatrixWorld(true);
    var pa = new T3.Vector3(), pb = new T3.Vector3();
    this.bones.LeftArm.getWorldPosition(pa); this.bones.RightArm.getWorldPosition(pb);
    var left = pa.sub(pb); left.y = 0; left.normalize();
    var fwd = new T3.Vector3().crossVectors(left, AX.U).normalize();
    this.inner.rotation.y = -Math.atan2(fwd.x, fwd.z);
    this.root.updateMatrixWorld(true);
    // how far the A-pose arms are from hanging down
    function armOut(a, f, sgn) {
      var p1 = new T3.Vector3(), p2 = new T3.Vector3();
      self.bones[a].getWorldPosition(p1); self.bones[f].getWorldPosition(p2);
      var d = p2.sub(p1); return Math.atan2(sgn * d.x, -d.y);
    }
    this.outL = armOut('LeftArm', 'LeftForeArm', 1);
    this.outR = armOut('RightArm', 'RightForeArm', -1);

    this.root.rotation.y = Math.PI / 2; // run toward +X
    this.x = 0; this.z = laneZ(i);
    this.root.position.set(this.x, 0, this.z);
    this.score = 0;
    this.seed = Math.random() * 10;
    this.phase = 0; this.speed = 0;
    this.state = 'idle'; this.stateT = 0;
    this.P = this.pose('idle', 0); // current blended pose
    this.lastStep = 0;

    // team ring + floating name badge
    var ring = new T3.Mesh(new T3.RingGeometry(.42, .58, 32), new T3.MeshBasicMaterial({ color: this.team.c2, transparent: true, opacity: .9 }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .035; this.ring = ring; this.root.add(ring);
    var self2 = this;
    var tex = canvasTex(256, 96, function (x, w, hh) {
      x.fillStyle = self2.team.c; roundRect(x, 6, 6, w - 12, hh - 12, 40); x.fill();
      x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke();
      x.fillStyle = '#fff'; x.font = '900 46px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(self2.team.name, w / 2, hh / 2 + 3);
    });
    this.badge = new T3.Sprite(new T3.SpriteMaterial({ map: tex, depthTest: false }));
    this.badge.scale.set(1.05, .4, 1); this.badge.position.set(0, KID_H + .45, 0); this.badge.renderOrder = 5;
    this.root.add(this.badge);
    scene.add(this.root);
  }
  function roundRect(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

  /* poses: numbers in radians, all in the character's own frame
     L axis = character's left (pitch), U = up (yaw), F = forward (roll) */
  Runner.prototype.pose = function (st, t) {
    var P = { thighL: 0, thighR: 0, kneeL: .05, kneeR: .05, footL: 0, footR: 0, armL: 0, armR: 0, liftL: .08, liftR: .08, elbowL: -.25, elbowR: -.25,
      lean: 0, twist: 0, headP: 0, headY: 0, headR: 0, bob: 0, bodyR: 0, bodyP: 0, jump: 0, spin: 0 };
    var sd = this.seed, k, s;
    if (st === 'idle') {
      P.lean = .03 * Math.sin(t * 2 + sd); P.headY = .35 * Math.sin(t * .6 + sd) ; P.headP = .06 * Math.sin(t * 1.3 + sd);
      P.armL = .06 * Math.sin(t * 2 + sd); P.armR = -.06 * Math.sin(t * 2 + sd);
      P.bodyR = .03 * Math.sin(t * 1.1 + sd); P.bob = .012 * Math.sin(t * 4 + sd);
      P.kneeL = .08 + .06 * Math.max(0, Math.sin(t * 1.1 + sd)); P.kneeR = .08 + .06 * Math.max(0, -Math.sin(t * 1.1 + sd));
    } else if (st === 'ready') {               // crouched, ready to sprint
      P.lean = .45; P.headP = -.35; P.thighL = -.55; P.thighR = .35; P.kneeL = .9; P.kneeR = .6; P.footL = -.3;
      P.armL = .6; P.armR = -.5; P.elbowL = -1.1; P.elbowR = -1.1; P.bob = -.12 + .015 * Math.sin(t * 9 + sd); P.liftL = P.liftR = .1;
    } else if (st === 'run') {
      var p = this.phase; s = Math.sin(p); var c = Math.cos(p); k = clamp(this.speed / 7, .35, 1);
      P.thighL = -.95 * s * k; P.thighR = .95 * s * k;
      P.kneeL = .25 + 1.35 * k * Math.max(0, -Math.sin(p - .9)) ; P.kneeR = .25 + 1.35 * k * Math.max(0, Math.sin(p - .9));
      P.footL = -.35 * k * Math.max(0, c); P.footR = -.35 * k * Math.max(0, -c);
      P.armL = .95 * s * k; P.armR = -.95 * s * k; P.elbowL = -1.35; P.elbowR = -1.35; P.liftL = P.liftR = .14;
      P.lean = .22 + .12 * k; P.twist = .2 * s * k; P.headP = -.12; P.headY = -.12 * s * k;
      P.bob = .09 * k * Math.abs(c) - .03;
    } else if (st === 'stumble') {             // t: 0..1.6s
      var u = clamp(t / 1.6, 0, 1), w = Math.sin(u * Math.PI);
      P.bodyP = .55 * Math.sin(u * Math.PI * 1.0) * (1 - u) + .2 * w * Math.sin(t * 14) * (1 - u);
      P.bodyR = .35 * Math.sin(t * 9) * (1 - u);
      P.lean = .5 * w; P.headP = -.4 * w; P.headY = .5 * Math.sin(t * 16) * (1 - u);
      P.liftL = 1.9 * w + .25 * Math.sin(t * 22) * w; P.liftR = 1.9 * w + .25 * Math.sin(t * 22 + 1) * w;
      P.elbowL = -.4 - .6 * Math.sin(t * 18) * w; P.elbowR = -.4 + .6 * Math.sin(t * 18) * w;
      P.armL = .4 * Math.sin(t * 12) * w; P.armR = -.4 * Math.sin(t * 12) * w;
      P.thighL = -.5 * w; P.kneeL = .3 + .6 * w; P.thighR = .35 * w; P.kneeR = .2 + .5 * w; P.bob = -.12 * w;
    } else if (st === 'wave') {
      P.headY = .55; P.headP = -.05; P.lean = -.05; P.bodyR = -.06;
      P.liftR = 2.7; P.elbowR = -.2; P.armR = 0; P.headR = .1;
      P.elbowR = -.35 + .55 * Math.sin(t * 11);
      P.liftL = .2; P.bob = .015 * Math.sin(t * 8);
    } else if (st === 'cheer') {               // winner: jumping, arms up, pumping
      var j = Math.abs(Math.sin(t * 5.2));
      P.jump = .55 * j; P.liftL = 2.8 + .2 * Math.sin(t * 10.4); P.liftR = 2.8 + .2 * Math.sin(t * 10.4 + 1);
      P.elbowL = P.elbowR = -.25; P.headP = -.25; P.lean = -.12;
      P.thighL = P.thighR = -.35 * (1 - j); P.kneeL = P.kneeR = .2 + .9 * (1 - j); P.spin = 0;
    } else if (st === 'clap') {
      var cl = Math.sin(t * 13);
      P.armL = -1.0; P.armR = -1.0; P.liftL = .35 + .25 * cl; P.liftR = .35 + .25 * cl; P.elbowL = -1.0; P.elbowR = -1.0;
      P.headP = -.12; P.headY = .2 * Math.sin(t * 2 + sd); P.bob = .04 * Math.abs(Math.sin(t * 6.5));
    } else if (st === 'sad') {
      P.lean = .3; P.headP = .45; P.liftL = .02; P.liftR = .02; P.armL = .15; P.armR = .15; P.kneeL = .15; P.kneeR = .15; P.bob = -.04;
    }
    return P;
  };

  Runner.prototype.setState = function (st) { if (this.state !== st) { this.state = st; this.stateT = 0; } };

  Runner.prototype.rotWorld = function (name, axis, ang) {
    if (!ang) return;
    var b = this.bones[name]; if (!b) return;
    this.body.getWorldQuaternion(_q);
    _ax.copy(axis).applyQuaternion(_q);
    _rq.setFromAxisAngle(_ax, ang);
    b.parent.getWorldQuaternion(_pw); _pwi.copy(_pw).invert();
    b.quaternion.premultiply(_pwi.multiply(_rq).multiply(_pw));
  };

  Runner.prototype.update = function (dt) {
    this.stateT += dt;
    // movement
    if (this.state === 'run') {
      this.phase += dt * (5 + this.speed * 1.55);
      var stepIdx = Math.floor(this.phase / Math.PI);
      if (stepIdx !== this.lastStep) {
        this.lastStep = stepIdx;
        puff(this.x - .2, .05, this.z + (stepIdx % 2 ? .15 : -.15), 3);
        if (this.i === activeIdx || game.phase === 'go') SFX.step();
      }
    }
    var target = this.pose(this.state, this.stateT);
    var rate = 1 - Math.exp(-dt * (this.state === 'run' || this.state === 'stumble' || this.state === 'cheer' || this.state === 'clap' ? 22 : 9));
    for (var key in target) this.P[key] = lerp(this.P[key], target[key], rate);
    var P = this.P;

    // body transform
    this.root.position.set(this.x, 0, this.z);
    this.body.position.y = P.bob + P.jump;
    this.body.rotation.set(0, 0, 0);
    this.body.rotateOnAxis(AX.L, P.bodyP);
    this.body.rotateOnAxis(AX.F, P.bodyR);

    // reset skeleton then layer rotations (parents first)
    for (var n in this.rest) this.bones[n].quaternion.copy(this.rest[n]);
    var L = AX.L, U = AX.U, F = AX.F;
    this.rotWorld('Spine', L, P.lean * .5);
    this.rotWorld('Spine1', L, P.lean * .3);
    this.rotWorld('Spine1', U, P.twist);
    this.rotWorld('Spine2', L, P.lean * .2);
    this.rotWorld('Neck', L, P.headP * .4);
    this.rotWorld('Head', L, P.headP * .6 - P.lean * .4);
    this.rotWorld('Head', U, P.headY);
    this.rotWorld('Head', F, P.headR);
    // arms: drop the A-pose to the sides, then lift/swing/bend
    this.rotWorld('LeftArm', F, -(this.outL - P.liftL));
    this.rotWorld('RightArm', F, (this.outR - P.liftR));
    this.rotWorld('LeftArm', L, -P.armL);
    this.rotWorld('RightArm', L, -P.armR);
    this.rotWorld('LeftForeArm', L, P.elbowL);
    this.rotWorld('RightForeArm', L, P.elbowR);
    // legs
    this.rotWorld('LeftUpLeg', L, P.thighL);
    this.rotWorld('RightUpLeg', L, P.thighR);
    this.rotWorld('LeftLeg', L, P.kneeL);
    this.rotWorld('RightLeg', L, P.kneeR);
    this.rotWorld('LeftFoot', L, P.footL - (P.kneeL - .05) * .35 - P.thighL * .3);
    this.rotWorld('RightFoot', L, P.footR - (P.kneeR - .05) * .35 - P.thighR * .3);

    // badge bounce + ring pulse for active runner
    var act = this.i === activeIdx && (game.phase === 'question' || game.phase === 'turn');
    this.badge.visible = !((cam.mode === 'follow' || cam.mode === 'stumble') && this.i !== activeIdx) && cam.mode !== 'start';
    this.badge.position.y = KID_H + .45 + P.jump + (act ? .08 * Math.sin(now * 6) : 0);
    var sc = act ? 1.15 + .12 * Math.sin(now * 6) : 1;
    this.ring.scale.set(sc, sc, sc);
  };

  /* sprint forward by `dist` over ~dur seconds */
  Runner.prototype.sprint = function (dist, onDone) {
    var self = this, x0 = this.x, x1 = Math.min(TRACK + 2.2, this.x + dist), dur = .45 + dist * .26, t = 0;
    this.setState('run'); this.speed = 0;
    this.mover = function (dt) {
      t += dt; var u = clamp(t / dur, 0, 1);
      var nx = lerp(x0, x1, ease(u)); self.speed = (nx - self.x) / Math.max(dt, 1e-4); self.x = nx;
      if (!self.crossed && self.x >= TRACK - .2) { self.crossed = true; if (self.onCross) self.onCross(); }
      if (u >= 1) { self.mover = null; self.speed = 0; self.setState('idle'); if (onDone) onDone(); }
    };
  };

  /* ---------------- camera ---------------- */
  var cam = { pos: new T3.Vector3(-6, 3, 9), look: new T3.Vector3(0, 1, 0), tPos: new T3.Vector3(), tLook: new T3.Vector3(), mode: 'orbit', k: 2.5 };
  function camFor(mode) { cam.mode = mode; }
  function updateCamera(dt) {
    var t = now, rs = runners;
    if (!rs.length) return;
    var lead = rs.reduce(function (m, r) { return r.x > m ? r.x : m; }, 0);
    var minx = rs.reduce(function (m, r) { return Math.min(m, r.x); }, 99);
    var mid = (lead + minx) / 2;
    if (cam.mode === 'orbit') {          // title screen: slow orbit around the start
      var a = t * .18;
      cam.tPos.set(1.5 + Math.sin(a) * 9, 3.2 + Math.sin(t * .3) * .4, Math.cos(a) * 9 + 2);
      cam.tLook.set(.5, 1, 0); cam.k = 2;
    } else if (cam.mode === 'intro') {   // sweep from the finish to the start
      var u = clamp(cam.u += dt / 3.2, 0, 1), e = ease(u);
      cam.tPos.set(lerp(TRACK + 6, -5.5, e), lerp(9, 2.6, e), lerp(14, 6.5, e));
      cam.tLook.set(lerp(TRACK, 1.5, e), lerp(2, .9, e), 0); cam.k = 30;
    } else if (cam.mode === 'start') {
      cam.tPos.set(4.8, 1.9, trackW / 2 + 4.2); cam.tLook.set(.2, .85, 0); cam.k = 2.5;
    } else if (cam.mode === 'question') { // frame the whole pack from the side
      var spread = lead - minx, a2 = Math.sin(t * .25) * .4, dist = 5.2 + spread * .3;
      cam.tPos.set(mid - 1.0 - spread * .1 + a2, 2.9 + spread * .1, trackW / 2 + dist);
      cam.tLook.set(mid + .5, -.55, -.6); cam.k = 2;
    } else if (cam.mode === 'follow') {   // tracking shot beside the active runner
      var r = rs[activeIdx];
      cam.tPos.set(r.x - 2.2, 2.7, trackW / 2 + 3.2); cam.tLook.set(r.x + 1.1, .75, r.z); cam.k = 6;
    } else if (cam.mode === 'stumble') {
      var r2 = rs[activeIdx];
      cam.tPos.set(r2.x + 2.6, 2.8, trackW / 2 + 2.6); cam.tLook.set(r2.x, .8, r2.z); cam.k = 4;
    } else if (cam.mode === 'finish') {
      var w = rs[game.winner], a3 = t * .35;
      cam.tPos.set(w.x + Math.sin(a3) * 5.2, 2.2 + Math.sin(t * .5) * .3, w.z + Math.cos(a3) * 5.2);
      cam.tLook.set(w.x, 1.1, w.z); cam.k = 2.2;
    }
    var f = 1 - Math.exp(-dt * cam.k);
    cam.pos.lerp(cam.tPos, f); cam.look.lerp(cam.tLook, f);
    // tiny handheld drift so the shot is never frozen
    camera.position.set(cam.pos.x + Math.sin(t * .9) * .05, cam.pos.y + Math.sin(t * 1.3) * .04, cam.pos.z);
    camera.lookAt(cam.look);
    if (cam.shake > 0) { cam.shake -= dt; camera.position.x += rnd(-.06, .06) * cam.shake * 4; camera.position.y += rnd(-.06, .06) * cam.shake * 4; }
    // keep the shadow camera on the action
    sun.position.set(cam.look.x - 12, 22, 14); sun.target.position.set(cam.look.x, 0, 0); sun.target.updateMatrixWorld();
  }

  /* ---------------- UI ---------------- */
  var ui = document.getElementById('ui');
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function clearUI(keep) { Array.prototype.slice.call(ui.children).forEach(function (c) { if (!keep || keep.indexOf(c) < 0) c.remove(); }); }
  var hud = null;
  function buildHud() {
    hud = el('div', 'hud');
    runners.forEach(function (r) {
      var p = el('div', 'tpill', '<i>' + (r.i + 1) + '</i><span>' + r.team.name + '</span><b>0</b>');
      p.style.setProperty('--c', r.team.c); r.pill = p; hud.appendChild(p);
    });
    ui.appendChild(hud);
  }
  function refreshHud() {
    runners.forEach(function (r) { r.pill.classList.toggle('turn', r.i === activeIdx && game.phase !== 'end'); r.pill.querySelector('b').textContent = r.score + '/' + STEPS; });
  }
  function bigText(txt, ms, small) {
    var b = el('div', 'big' + (small ? ' small' : ''), txt); ui.appendChild(b);
    after((ms || 900) / 1000, function () { b.remove(); });
  }
  function topButtons() {
    var tb = el('div', 'topbtns');
    var fs = el('button', 'ibtn', '⛶'); fs.title = 'Full screen';
    fs.onclick = function () { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); else document.exitFullscreen(); };
    var bk = el('button', 'ibtn', '✕'); bk.title = 'Back to games';
    bk.onclick = function () { location.href = '../index.html'; };
    var mu = el('button', 'ibtn', muted ? '🔇' : '🔊'); mu.title = 'Sound on/off';
    mu.onclick = function () { muted = !muted; mu.textContent = muted ? '🔇' : '🔊'; setLoopVol('music', .25); setLoopVol('crowd', .2); };
    tb.appendChild(mu); tb.appendChild(fs); tb.appendChild(bk); ui.appendChild(tb);
  }

  /* ---------------- game flow ---------------- */
  var runners = [], activeIdx = 0, startOffset = 0, roundStep = 0;
  var game = { phase: 'loading', winner: -1 };

  function titleScreen() {
    game.phase = 'title'; camFor('orbit');
    var box = el('div', 'endbox');
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#9b7bff;font-size:1.6rem">🏃 Sprint Race 3D — answer to run!</div>';
    var rows = el('div', 'rows');
    var go = el('button', 'btn green', '▶ Start race');
    go.onclick = function () { audio(); if (AC && AC.state === 'suspended') AC.resume(); loadSounds(); startRace(); };
    rows.appendChild(go); box.appendChild(rows); ui.appendChild(box);
    topButtons();
    // runners say hello one after another
    runners.forEach(function (r, i) { after(.6 + i * .5, function () { if (game.phase === 'title') { r.setState('wave'); after(1.6, function () { if (game.phase === 'title') r.setState('idle'); }); } }); });
    if (DEMO) after(2.6, function () { go.onclick(); });
  }

  function startRace() {
    clearUI(); buildHud(); topButtons();
    game.phase = 'intro'; cam.u = 0; camFor('intro'); SFX.whoosh();
    after(3.0, function () {
      camFor('start'); game.phase = 'ready';
      runners.forEach(function (r) { r.setState('ready'); });
      var n = 3;
      (function count() {
        if (n > 0) { bigText(String(n), 800); SFX.beep(); n--; after(.9, count); return; }
        bigText('GO!', 900); SFX.go(); crowdHype = 1; cam.shake = .3;
        game.phase = 'go';
        runners.forEach(function (r) { r.finished = false; r.sprint(1.2 + Math.random() * .3); });
        startOffset = Math.floor(Math.random() * runners.length);
        roundStep = 0;
        after(2.2, function () { crowdHype = .15; activeIdx = startOffset; nextTurn(); });
      })();
    });
  }

  function nextTurn() {
    if (game.phase === 'end') return;
    game.phase = 'turn'; refreshHud();
    var r = runners[activeIdx];
    camFor('question');
    r.setState('wave'); SFX.hello();
    after(1.1, function () { r.setState('idle'); askQuestion(r); });
  }

  function askQuestion(r) {
    game.phase = 'question';
    var item = nextQ();
    var opts = [item.a].concat(item.w.slice(0, 2)).sort(function () { return Math.random() - .5; });
    var wrap = el('div', 'qwrap'), card = el('div', 'qcard');
    card.style.setProperty('--c', r.team.c);
    card.innerHTML = '<div class="qhead"><span>●</span> Team ' + r.team.name + ' — answer to run!</div>' +
      '<div class="qtext">' + (item.pic ? '<span class="pic">' + item.pic + '</span>' : '') + '<span>' + item.q + '</span></div>';
    var grid = el('div', 'opts'), done = false;
    opts.forEach(function (o, k) {
      var b = el('button', 'opt'); b.textContent = o;
      b.onclick = function () {
        if (done) return; done = true;
        var ok = o === item.a;
        grid.querySelectorAll('.opt').forEach(function (x) { if (x.textContent === item.a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
        if (ok) SFX.ding(); else SFX.buzz();
        after(ok ? .7 : 1.3, function () { wrap.remove(); ok ? correct(r) : wrong(r); });
      };
      grid.appendChild(b);
    });
    card.appendChild(grid); wrap.appendChild(card); ui.appendChild(wrap);
    // keyboard 1-3
    keyHandler = function (e) { var n = +e.key; if (n >= 1 && n <= 3) grid.children[n - 1].click(); };
    if (DEMO) after(1.6 + Math.random() * .8, function () {
      demoTurn++; var right = DEMO_WRONG.indexOf(demoTurn) < 0;
      var pick = Array.prototype.find.call(grid.children, function (b) { return (b.textContent === item.a) === right; });
      pick.click();
    });
  }
  var keyHandler = null, demoTurn = 0, DEMO_WRONG = [2, 5, 7];
  window.addEventListener('keydown', function (e) { if (keyHandler) keyHandler(e); });

  // fair turns: every team gets the same number of turns; the race ends after a full round
  function advanceRound() {
    roundStep++;
    if (roundStep >= runners.length) {
      roundStep = 0;
      var winners = runners.filter(function (x) { return x.finished || x.score >= STEPS; });
      if (winners.length) { finish(winners); return; }
    }
    activeIdx = (startOffset + roundStep) % runners.length;
    if (runners[activeIdx].finished) return advanceRound();   // already over the line: skip to the next team
    nextTurn();
  }

  function correct(r) {
    keyHandler = null;
    game.phase = 'run'; r.score++; refreshHud();
    camFor('follow'); crowdHype = .7;
    bigText('+1  RUN!', 800, true);
    r.onCross = function () {
      r.finished = true;
      if (tape.visible) {
        tape.visible = false; tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
        confettiBurst(TRACK, 4, 0, 120);
      }
      bigText('🏁 ' + r.team.name + ' finished!', 1000, true);
    };
    r.sprint(STEP + .05, function () {
      if (game.phase === 'end') return;
      crowdHype = .15;
      after(.5, advanceRound);
    });
  }

  function wrong(r) {
    keyHandler = null;
    game.phase = 'oops'; camFor('stumble');
    r.setState('stumble'); SFX.boing(); puff(r.x + .3, .1, r.z, 8, 0xfff0e0);
    bigText('Oops!', 900, true);
    after(1.7, function () {
      r.setState('sad');
      after(.8, function () { r.setState('idle'); advanceRound(); });
    });
  }

  function finish(winners) {
    if (!Array.isArray(winners)) winners = [winners];
    var w = winners[0];
    game.phase = 'end'; game.winner = w.i; keyHandler = null;
    if (tape.visible) {
      tape.visible = false; tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
    }
    SFX.cheer(); crowdHype = 1; cam.shake = .4;
    confettiBurst(TRACK, 4, 0, 220);
    after(.9, function () { confettiBurst(TRACK + 1, 5, -1.5, 150); });
    after(1.0, function () {
      camFor('finish');
      runners.forEach(function (r) {
        r.setState(winners.indexOf(r) >= 0 ? 'cheer' : 'clap');
      });
      var names = winners.map(function (x) { return x.team.name; }).join(' & ');
      bigText(winners.length > 1 ? names + ' tie!' : w.team.name + ' wins!', 2400, true);
      refreshHud();
      after(2.6, function () {
        var box = el('div', 'endbox');
        var rows = el('div', 'rows');
        var again = el('button', 'btn', '↻ Race again'); again.onclick = function () { location.reload(); };
        var back = el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
        rows.appendChild(again); rows.appendChild(back);
        var msg = winners.length > 1
          ? '🏆 Tie! ' + names + ' share 1st place!'
          : '🏆 Team ' + w.team.name + ' won the race!';
        box.innerHTML = '<div class="say" style="--c:' + w.team.c + '">' + msg + '</div>';
        box.appendChild(rows); ui.appendChild(box);
      });
    });
  }
  function updateTape(dt) {
    tapeHalves.forEach(function (h) {
      if (!h.visible) return; h.userData.t += dt; var t = h.userData.t;
      h.rotation.x = h.userData.s * Math.min(1.3, t * 3); h.position.y = Math.max(.1, 1.15 - t * t * 1.5);
    });
  }

  /* ---------------- main loop ---------------- */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  function frame(dt) {
    dt = Math.min(dt, 1 / 20);
    now += dt;
    runJobs();
    runners.forEach(function (r) { if (r.mover) r.mover(dt); r.update(dt); });
    updateCrowd(now); updateFlags(now);
    setLoopVol('crowd', .12 + crowdHype * .35); updateScenery(now, dt); updateParticles(dt); updateTape(dt);
    updateCamera(dt);
    renderer.render(scene, camera);
    if (CAPTURE && document.getAnimations) document.getAnimations().forEach(function (a) { a.pause(); a.__t = (a.__t || 0) + dt * 1000; a.currentTime = a.__t; });
  }
  var last = 0;
  function loop(ts) {
    var dt = last ? (ts - last) / 1000 : 1 / 60; last = ts;
    frame(dt); requestAnimationFrame(loop);
  }
  // frame-stepping hook for recording a smooth video
  window.__race = { step: function (n, dt) { for (var i = 0; i < (n || 1); i++) frame(dt || 1 / 30); }, sim: function (n, dt) { var r = renderer.render; renderer.render = function () {}; for (var i = 0; i < n; i++) frame(dt || 1 / 30); renderer.render = r; }, game: game, runners: runners, cam: cam };

  /* ---------------- boot ---------------- */
  if (Q.has('preview')) document.body.classList.add('preview');
  var loading = el('div', 'loading', '<span>Getting the runners ready…</span>'); ui.appendChild(loading);
  Promise.all([loadBuffer(ROOT + 'assets/3d/characters/kid-girl.glb'), loadBuffer(ROOT + 'assets/3d/characters/kid-boy.glb')])
    .then(function (bufs) {
      var jobsP = [];
      for (var i = 0; i < nTeams; i++) jobsP.push(parseGLB(TEAMS[i].kid === 'girl' ? bufs[0] : bufs[1]));
      return Promise.all(jobsP);
    })
    .then(function (gltfs) {
      gltfs.forEach(function (g, i) { runners.push(new Runner(i, g)); });
      loading.remove();
      window.__race.ready = true;
      titleScreen();
      if (!CAPTURE) requestAnimationFrame(loop); else frame(1 / 30);
    })
    .catch(function (e) { loading.innerHTML = '<span>Could not load the runners 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
