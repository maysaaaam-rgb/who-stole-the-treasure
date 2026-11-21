/* ═══════════════════════════════════════════════════════════════
   Treasure Planet 3D — Messenger-Style Spherical Adventure (Chapter 1)
   island/planet/planet.js
   - Tiny walk-around 3D Treasure Island globe (R = 22)
   - Brand-new Pixar Auto-Rigged Kid Avatar + 65-bone Blender Clips + 3D Shop Items
   - All 24 compressed Batch D models + Instanced Quaternius palms/rocks/flowers
   - Full Chapter 1 integration (Ch1Progress, Chapter1.openClue, Ch1Feedback.playChestFinale)
   - Flying Guide Parrot (cs-parrot.glb) + Screen-Edge Compass Arrow
   - Calm Pirate Music (polyphonic Web Audio) + Waves / Seagulls / Footsteps
   - Emote Wheel + Classmates API (planetAddVisitor / Move / Emote / Remove)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var Q = new URLSearchParams(root.location.search || '');
  var IS_DEMO = Q.get('demo') === '1' || !Q.has('code');
  var WANT_GIRL = Q.get('girl') === '1';

  /* ---------- WebGL Support Guard -> world.html fallback ---------- */
  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(root.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  if (!T3 || !hasWebGL()) {
    root.location.replace('world.html' + (root.location.search || ''));
    return;
  }

  /* ---------- DOM Refs ---------- */
  var canvas = document.getElementById('pl-canvas');
  var loadEl = document.getElementById('pl-load');
  var loadSub = document.getElementById('pl-load-sub');
  var loadFill = document.getElementById('pl-load-fill');
  var loadPct = document.getElementById('pl-load-pct');
  var stampCountEl = document.getElementById('pl-stamp-count');
  var goalPill = document.getElementById('pl-goal-pill');
  var goalText = document.getElementById('pl-goal-text');
  var edgeArrow = document.getElementById('pl-edge-arrow');
  var bubbleEl = document.getElementById('pl-bubble');
  var bubbleSpeaker = document.getElementById('pl-bubble-speaker');
  var bubbleStopTag = document.getElementById('pl-bubble-stoptag');
  var bubbleText = document.getElementById('pl-bubble-text');
  var bubbleHear = document.getElementById('pl-bubble-hear');
  var bubbleClose = document.getElementById('pl-bubble-close');
  var bubblePlay = document.getElementById('pl-bubble-play');
  var emoteToast = document.getElementById('pl-emote-toast');
  var emoteBtn = document.getElementById('pl-emote-btn');
  var emoteMenu = document.getElementById('pl-emote-menu');
  var runBtn = document.getElementById('pl-run-btn');
  var muteBtn = document.getElementById('pl-mute-btn');
  var fsBtn = document.getElementById('pl-fs-btn');
  var backBtn = document.getElementById('pl-back-btn');
  var lowFpsEl = document.getElementById('pl-lowfps');
  var simpleLink = document.getElementById('pl-simple-link');
  var creditsEl = document.getElementById('pl-credits');
  var creditsStay = document.getElementById('pl-credits-stay');
  var creditsChart = document.getElementById('pl-credits-chart');
  var joyEl = document.getElementById('pl-joy');
  var joyKnob = document.getElementById('pl-joy-knob');

  if (simpleLink) simpleLink.href = 'world.html' + (root.location.search || '');
  document.getElementById('pl-lowfps-hide').onclick = function () { lowFpsEl.classList.remove('show'); };
  if (Q.get('from') === 'gm' && backBtn) {
    backBtn.textContent = '🎮 ← Game Maker';
    backBtn.title = 'Back to Game Maker';
  }
  backBtn.onclick = function () {
    sfxTap();
    if (Q.get('from') === 'gm') { root.location.href = '../game-maker/index.html'; return; }
    root.location.href = 'index.html' + (root.location.search || '');
  };
  creditsChart.onclick = function () { sfxTap(); root.location.href = 'index.html' + (root.location.search || ''); };
  creditsStay.onclick = function () {
    sfxTap();
    creditsEl.classList.remove('show');
    state.creditsMode = false;
  };
  fsBtn.onclick = function () {
    sfxTap();
    try {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    } catch (e) {}
  };

  /* ---------- Audio & Calm Sea-Shanty Synthesizer (Autoplay-Guarded) ---------- */
  var audio = {
    started: false,
    muted: false,
    ctx: null,
    waves: null,
    birds: null,
    sfx: {},
    musicTimer: null,
    birdTimer: null,
    stepTimer: 0
  };

  function makeAudioEl(src, loop, vol) {
    var el = new Audio(src);
    el.loop = !!loop;
    el.volume = vol;
    el.preload = 'none';
    return el;
  }

  function unlockAudio() {
    if (audio.started) {
      if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume().catch(function () {});
      return;
    }
    audio.started = true;
    try {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) audio.ctx = new AC();
    } catch (e) {}
    audio.waves = makeAudioEl('planet/sfx/sea_waves.mp3', true, 0.22);
    audio.birds = makeAudioEl('planet/sfx/birds.mp3', false, 0.18);
    ['step', 'tap', 'chest', 'correct', 'cheer', 'win'].forEach(function (k) {
      audio.sfx[k] = makeAudioEl('planet/sfx/' + k + '.mp3', false, k === 'step' ? 0.22 : 0.45);
    });
    if (!audio.muted) {
      audio.waves.play().catch(function () {});
      startCalmShanty();
      scheduleBirds();
    }
  }

  function playSfx(name) {
    if (audio.muted) return;
    unlockAudio();
    var base = audio.sfx[name];
    if (base) {
      try {
        var c = base.cloneNode();
        c.volume = base.volume;
        c.play().catch(function () {});
        return;
      } catch (e) {}
    }
    playPolyChime(name === 'correct' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37]);
  }
  function sfxTap() { playSfx('tap'); }

  function playPolyChime(notes) {
    if (audio.muted || !audio.ctx) return;
    var now = audio.ctx.currentTime;
    notes.forEach(function (freq, i) {
      var osc = audio.ctx.createOscillator();
      var osc2 = audio.ctx.createOscillator();
      var g = audio.ctx.createGain();
      osc.type = 'triangle';
      osc2.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      osc2.frequency.setValueAtTime(freq * 2, now + i * 0.08);
      g.gain.setValueAtTime(0.0001, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.06, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.42);
      osc.connect(g); osc2.connect(g); g.connect(audio.ctx.destination);
      osc.start(now + i * 0.08); osc2.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45); osc2.stop(now + i * 0.08 + 0.45);
    });
  }

  // Calm gentle acoustic harp/marimba sea-shanty loop (C major / G major 6/8 sway)
  var SHANTY_NOTES = [
    [261.63, 392.00], [329.63], [392.00], [523.25, 329.63], [440.00], [392.00],
    [329.63, 196.00], [293.66], [261.63], [293.66, 196.00], [329.63], [0],
    [349.23, 220.00], [440.00], [523.25], [440.00, 261.63], [392.00], [329.63],
    [293.66, 196.00], [329.63], [392.00], [261.63, 196.00], [0], [0]
  ];
  var shantyIdx = 0;

  function startCalmShanty() {
    if (audio.musicTimer) return;
    audio.musicTimer = setInterval(function () {
      if (audio.muted || !audio.ctx || audio.ctx.state !== 'running') return;
      var chord = SHANTY_NOTES[shantyIdx % SHANTY_NOTES.length];
      shantyIdx++;
      var now = audio.ctx.currentTime;
      chord.forEach(function (f, idx) {
        if (!f) return;
        var o1 = audio.ctx.createOscillator();
        var o2 = audio.ctx.createOscillator();
        var lp = audio.ctx.createBiquadFilter();
        var g = audio.ctx.createGain();
        o1.type = 'triangle';
        o2.type = 'sine';
        o1.frequency.setValueAtTime(f, now);
        o2.frequency.setValueAtTime(f * 0.5, now);
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(1150, now);
        var peak = idx === 0 ? 0.032 : 0.018;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peak, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
        o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(audio.ctx.destination);
        o1.start(now); o2.start(now);
        o1.stop(now + 1.0); o2.stop(now + 1.0);
      });
    }, 520);
  }

  function scheduleBirds() {
    if (audio.birdTimer) return;
    audio.birdTimer = setInterval(function () {
      if (!audio.muted && audio.birds && Math.random() < 0.45) {
        audio.birds.currentTime = 0;
        audio.birds.play().catch(function () {});
      }
    }, 11000);
  }

  muteBtn.onclick = function () {
    unlockAudio();
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
    if (audio.waves) {
      if (audio.muted) audio.waves.pause();
      else audio.waves.play().catch(function () {});
    }
    if (audio.muted && root.speechSynthesis) {
      try { root.speechSynthesis.cancel(); } catch (e) {}
    }
  };

  function speakLine(text) {
    if (audio.muted || !text) return;
    unlockAudio();
    if (root.EAAVoice && typeof root.EAAVoice.say === 'function') {
      try { root.EAAVoice.say(text); return; } catch (e) {}
    }
    if (root.Ch1Audio && typeof root.Ch1Audio.speak === 'function') {
      try { root.Ch1Audio.speak(text); return; } catch (e) {}
    }
    if (root.speechSynthesis) {
      try {
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05;
        root.speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  /* ---------- Renderer, Scene, Bright Adventure Park Daylight ---------- */
  var R = 22.0; // Planet base radius (~138u circumference -> ~33s walk around)
  var renderer = new T3.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 1.5));
  renderer.setSize(root.innerWidth, root.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T3.PCFSoftShadowMap;
  renderer.toneMapping = T3.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  if (T3.SRGBColorSpace) renderer.outputColorSpace = T3.SRGBColorSpace;

  var scene = new T3.Scene();
  scene.background = new T3.Color(0x8bd2ff);
  scene.fog = new T3.Fog(0xbce8ff, 44, 145);

  var IS_MOBILE_PLANET = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '') || (Math.min(root.innerWidth || 1280, root.innerHeight || 720) <= 860);
  var uPlanetTime = { value: 0 };

  function calcPlanetFov(aspect) {
    return aspect < 0.95 ? Math.min(60, 46 + (0.95 - aspect) * 26) : 46;
  }
  var camera = new T3.PerspectiveCamera(calcPlanetFov(root.innerWidth / root.innerHeight), root.innerWidth / root.innerHeight, 0.25, 280);

  // Stylized Sunny Island PMREM Environment Map (Abeto/Pixar sky-to-sand hemisphere bounce!)
  (function initPlanetPMREM() {
    try {
      if (!T3.PMREMGenerator) return;
      var pmrem = new T3.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      var envScene = new T3.Scene();
      var dg = new T3.SphereGeometry(18, 24, 16);
      var dp = dg.attributes.position, dc = new Float32Array(dp.count * 3);
      var cTop = new T3.Color(0x52b6ff), cHor = new T3.Color(0xdaf3ff), cSand = new T3.Color(0xf6ddb0), tmp = new T3.Color(), vd = new T3.Vector3();
      for (var i = 0; i < dp.count; i++) {
        vd.fromBufferAttribute(dp, i).normalize();
        if (vd.y >= 0) tmp.copy(cHor).lerp(cTop, Math.pow(vd.y, 0.65));
        else tmp.copy(cHor).lerp(cSand, Math.min(1, Math.pow(-vd.y, 0.55) * 1.15));
        dc[i * 3] = tmp.r; dc[i * 3 + 1] = tmp.g; dc[i * 3 + 2] = tmp.b;
      }
      dg.setAttribute('color', new T3.BufferAttribute(dc, 3));
      envScene.add(new T3.Mesh(dg, new T3.MeshBasicMaterial({ vertexColors: true, side: T3.BackSide })));
      scene.environment = pmrem.fromScene(envScene, 0.04).texture;
      if ('environmentIntensity' in scene) scene.environmentIntensity = 0.52;
      dg.dispose(); pmrem.dispose();
    } catch (e) {}
  })();

  // Sunny bright park lighting (warm golden sun + soft lilac-blue shadow bounce per ART_STYLE.md §3!)
  var hemi = new T3.HemisphereLight(0xf8fcff, 0x9aa6e8, 1.08);
  scene.add(hemi);

  var sun = new T3.DirectionalLight(0xfff6df, 1.48);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 65;
  var sCam = 18;
  sun.shadow.camera.left = -sCam;
  sun.shadow.camera.right = sCam;
  sun.shadow.camera.top = sCam;
  sun.shadow.camera.bottom = -sCam;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);

  var rimLight = new T3.DirectionalLight(0xc2ecff, 0.42);
  rimLight.position.set(-30, -18, -32);
  scene.add(rimLight);

  /* ---------- Sky Dome + Sparkling Ocean Space ---------- */
  function buildSkyAndClouds() {
    // Bright sunny sky dome
    var skyGeo = new T3.SphereGeometry(125, 24, 18);
    var pos = skyGeo.attributes.position;
    var cols = new Float32Array(pos.count * 3);
    var cTop = new T3.Color(0x4eaef8);
    var cMid = new T3.Color(0xb8e6ff);
    var cBot = new T3.Color(0x3ec8ee);
    var tmp = new T3.Color();
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i) / 125;
      if (y >= 0) tmp.copy(cMid).lerp(cTop, Math.pow(y, 0.7));
      else tmp.copy(cMid).lerp(cBot, Math.pow(-y, 0.75));
      cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
    }
    skyGeo.setAttribute('color', new T3.BufferAttribute(cols, 3));
    scene.add(new T3.Mesh(skyGeo, new T3.MeshBasicMaterial({ vertexColors: true, side: T3.BackSide, fog: false })));

    // Floating puffy cartoon 3D clouds orbiting the planet (InstancedMesh = 1 draw call!)
    var puffGeo = new T3.SphereGeometry(1, 10, 8);
    var puffMat = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0, emissive: 0xddf2ff, emissiveIntensity: 0.25 });
    var cloudDefs = [];
    for (var c = 0; c < 18; c++) {
      var lat = ((c % 6) - 2.5) * 28 + (c * 7 % 11);
      var lon = c * 20 + (c * 13 % 17);
      var alt = R + 12 + (c % 4) * 2.4;
      cloudDefs.push({ lat: lat, lon: lon, alt: alt, speed: 0.9 + (c % 3) * 0.35, scale: 1.5 + (c % 3) * 0.55 });
    }
    var cloudMesh = new T3.InstancedMesh(puffGeo, puffMat, cloudDefs.length * 3);
    cloudMesh.frustumCulled = false;
    scene.add(cloudMesh);
    var dm = new T3.Object3D();
    var pOffsets = [[0, 0, 0, 1.0], [-0.95, -0.15, 0.2, 0.72], [0.98, -0.18, -0.15, 0.68]];
    return function updateClouds(t) {
      var idx = 0;
      for (var i = 0; i < cloudDefs.length; i++) {
        var cd = cloudDefs[i];
        var dir = latLonToDir(cd.lat, cd.lon + t * cd.speed);
        var basis = tangentBasis(dir);
        for (var j = 0; j < 3; j++) {
          var po = pOffsets[j];
          dm.position.copy(dir).multiplyScalar(cd.alt)
            .addScaledVector(basis.east, po[0] * cd.scale)
            .addScaledVector(dir, po[1] * cd.scale)
            .addScaledVector(basis.north, po[2] * cd.scale);
          dm.scale.set(cd.scale * po[3] * 1.25, cd.scale * po[3] * 0.68, cd.scale * po[3] * 0.92);
          dm.lookAt(0, 0, 0);
          dm.updateMatrix();
          cloudMesh.setMatrixAt(idx++, dm.matrix);
        }
      }
      cloudMesh.instanceMatrix.needsUpdate = true;
    };
  }

  /* ---------- Spherical Math Helpers ---------- */
  function latLonToDir(latDeg, lonDeg) {
    var la = latDeg * Math.PI / 180;
    var lo = lonDeg * Math.PI / 180;
    var c = Math.cos(la);
    return new T3.Vector3(c * Math.sin(lo), Math.sin(la), c * Math.cos(lo)).normalize();
  }

  function tangentBasis(up) {
    var ref = Math.abs(up.y) > 0.92 ? new T3.Vector3(1, 0, 0) : new T3.Vector3(0, 1, 0);
    var east = new T3.Vector3().crossVectors(ref, up).normalize();
    var north = new T3.Vector3().crossVectors(up, east).normalize();
    return { east: east, north: north };
  }

  function orientOnSphere(obj, dir, yawRad, radOverride) {
    var rad = radOverride != null ? radOverride : surfaceRadius(dir);
    obj.position.copy(dir).multiplyScalar(rad);
    var b = tangentBasis(dir);
    var fwd = b.north.clone().multiplyScalar(Math.cos(yawRad || 0))
      .addScaledVector(b.east, Math.sin(yawRad || 0)).normalize();
    var right = new T3.Vector3().crossVectors(dir, fwd).normalize();
    var m = new T3.Matrix4().makeBasis(right, dir, fwd);
    obj.quaternion.setFromRotationMatrix(m);
  }

  /* ---------- Planet Biomes, Bays, Golden Trail & Elevation ---------- */
  // 5 Chapter 1 Stops placed in a scenic 360° loop around the planet
  var STOP_COORDS = [
    { stopNum: 1, lat:  6,  lon:   0, fallbackName: 'Benbow Inn',        speaker: '🐆 Benbow',         charModel: 'char-benbow.glb' },
    { stopNum: 2, lat: -6,  lon:  72, fallbackName: 'Blueprint Board',   speaker: '👨‍🍳 Ship Cook',      charModel: 'char-cook.glb' },
    { stopNum: 3, lat:  8,  lon: 144, fallbackName: 'Ship Wheel Shore',  speaker: '🏴‍☠️ Captain',        charModel: 'char-captain.glb' },
    { stopNum: 4, lat: -8,  lon: 216, fallbackName: 'Spyglass Lookout',  speaker: '🦜 Captain Flint',  charModel: 'char-flint.glb' },
    { stopNum: 5, lat:  5,  lon: 288, fallbackName: "Billy's Sea Chest", speaker: '🏴‍☠️ Billy Bones',    charModel: 'char-captain.glb' }
  ];
  STOP_COORDS.forEach(function (s) { s.dir = latLonToDir(s.lat, s.lon); });

  // 3 sparkling shallow turquoise bays (non-walkable water zones)
  var WATER_BAYS = [
    { dir: latLonToDir( 34,  42), angR: 0.25 },
    { dir: latLonToDir(-32, 132), angR: 0.27 },
    { dir: latLonToDir( 32, 248), angR: 0.24 }
  ];

  // Smooth trail curve connecting Stop 1 -> 2 -> 3 -> 4 -> 5 -> 1
  function trailDistanceAngle(dir) {
    var minD = 99;
    var lon = Math.atan2(dir.x, dir.z); // -PI..PI
    var lat = Math.asin(Math.max(-1, Math.min(1, dir.y)));
    // Gentle sine wave equator trail passing right through all 5 stops
    var targetLat = Math.sin(lon * 2.5 + 0.35) * 0.12;
    minD = Math.abs(lat - targetLat);
    // Also flatten & sand-pad around each stop center
    for (var i = 0; i < STOP_COORDS.length; i++) {
      var a = Math.acos(Math.max(-1, Math.min(1, dir.dot(STOP_COORDS[i].dir))));
      if (a < minD) minD = a;
    }
    return minD;
  }

  function bayDepth(dir) {
    var maxDepth = 0;
    for (var i = 0; i < WATER_BAYS.length; i++) {
      var bay = WATER_BAYS[i];
      var a = Math.acos(Math.max(-1, Math.min(1, dir.dot(bay.dir))));
      if (a < bay.angR) {
        var t = 1 - a / bay.angR;
        var d = t * t * (3 - 2 * t);
        if (d > maxDepth) maxDepth = d;
      }
    }
    return maxDepth;
  }

  function nearBayBeach(dir) {
    var best = 0;
    for (var i = 0; i < WATER_BAYS.length; i++) {
      var bay = WATER_BAYS[i];
      var a = Math.acos(Math.max(-1, Math.min(1, dir.dot(bay.dir))));
      if (a < bay.angR + 0.13) {
        var t = 1 - Math.max(0, (a - bay.angR) / 0.13);
        if (t > best) best = t;
      }
    }
    return best;
  }

  function nearAnyStop(dir) {
    var best = 0;
    for (var i = 0; i < STOP_COORDS.length; i++) {
      var a = Math.acos(Math.max(-1, Math.min(1, dir.dot(STOP_COORDS[i].dir))));
      if (a < 0.20) {
        var t = 1 - a / 0.20;
        if (t > best) best = t;
      }
    }
    return best;
  }

  function surfaceRadius(dir) {
    var bd = bayDepth(dir);
    if (bd > 0) return R - bd * 0.95;
    // Gentle sunny hills (smoothed flat around stops & sandy trail, always safely above water sphere)
    var hill = (Math.sin(dir.x * 5.2 + dir.z * 3.8) * Math.cos(dir.y * 5.6) + Math.sin(dir.z * 7.1 - dir.y * 4.2) * 0.45) * 0.34;
    var flat = Math.max(nearAnyStop(dir), nearBayBeach(dir) * 0.8);
    var trail = trailDistanceAngle(dir) < 0.09 ? 0.6 : 0;
    var h = Math.max(0.06, hill * (1 - Math.min(1, flat + trail)) + 0.06);
    return R + h;
  }

  var planetMesh = null;
  var waterMesh = null;

  function buildPlanetSphere() {
    var geo = new T3.IcosahedronGeometry(R, 6);
    var pos = geo.attributes.position;
    var cols = new Float32Array(pos.count * 3);
    var v = new T3.Vector3();
    var cGrass1 = new T3.Color(0x63cc4e);
    var cGrass2 = new T3.Color(0x88df5f);
    var cSand   = new T3.Color(0xf6da84);
    var cTrail  = new T3.Color(0xf2cb73);
    var cShallow = new T3.Color(0x3ad5f0);
    var cDeep   = new T3.Color(0x1baed8);
    var tmp = new T3.Color();

    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      var rad = surfaceRadius(v);
      pos.setXYZ(i, v.x * rad, v.y * rad, v.z * rad);

      var bd = bayDepth(v);
      var beach = nearBayBeach(v);
      var td = trailDistanceAngle(v);
      var stopGlow = nearAnyStop(v);
      var grassMix = 0.5 + 0.5 * Math.sin(v.x * 6 + v.y * 7 + v.z * 5);
      tmp.copy(cGrass1).lerp(cGrass2, grassMix);

      if (td < 0.085) {
        var tw = 1 - Math.max(0, (td - 0.045) / 0.04);
        tmp.lerp(cTrail, tw * 0.88);
      }
      if (stopGlow > 0.35) {
        tmp.lerp(cSand, (stopGlow - 0.35) * 0.9);
      }
      if (beach > 0) {
        tmp.lerp(cSand, Math.min(1, beach * 1.15));
      }
      if (bd > 0) {
        tmp.copy(cShallow).lerp(cDeep, Math.min(1, bd * 1.3));
      }
      cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new T3.BufferAttribute(cols, 3));
    geo.computeVertexNormals();

    var mat = new T3.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0.0 });
    planetMesh = new T3.Mesh(geo, mat);
    planetMesh.receiveShadow = true;
    scene.add(planetMesh);

    // Custom GLSL Stylized Ocean + Animated Shore-Foam Wave Rings inside the 3 Bays!
    var wGeo = new T3.SphereGeometry(R - 0.28, 64, 48);
    var wMat = new T3.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: uPlanetTime,
        uBay0: { value: WATER_BAYS[0].dir.clone() },
        uBay1: { value: WATER_BAYS[1].dir.clone() },
        uBay2: { value: WATER_BAYS[2].dir.clone() },
        uBayR: { value: new T3.Vector3(WATER_BAYS[0].angR, WATER_BAYS[1].angR, WATER_BAYS[2].angR) },
        uDeep: { value: new T3.Color(0x1eaad8) },
        uShallow: { value: new T3.Color(0x7be6f8) },
        uFoam: { value: new T3.Color(0xffffff) },
        uSunDir: { value: new T3.Vector3(0.4, 0.8, 0.4).normalize() }
      },
      vertexShader: [
        'uniform float uTime;',
        'varying vec3 vDir;',
        'varying vec3 vWorldPos;',
        'varying vec3 vNormalW;',
        'void main() {',
        '  vDir = normalize(position);',
        '  float swell = sin(position.x * 1.6 + uTime * 2.1) * cos(position.z * 1.5 - uTime * 1.7) * 0.045;',
        '  vec3 displaced = position + vDir * swell;',
        '  vec4 wp = modelMatrix * vec4(displaced, 1.0);',
        '  vWorldPos = wp.xyz;',
        '  vNormalW = normalize(mat3(modelMatrix) * vDir);',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec3 uBay0; uniform vec3 uBay1; uniform vec3 uBay2; uniform vec3 uBayR;',
        'uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam; uniform vec3 uSunDir;',
        'varying vec3 vDir; varying vec3 vWorldPos; varying vec3 vNormalW;',
        'float bayDist(vec3 d, vec3 b, float r) { return acos(clamp(dot(d, b), -1.0, 1.0)) / r; }',
        'void main() {',
        '  vec3 d = normalize(vDir);',
        '  float q0 = bayDist(d, uBay0, uBayR.x);',
        '  float q1 = bayDist(d, uBay1, uBayR.y);',
        '  float q2 = bayDist(d, uBay2, uBayR.z);',
        '  float q = min(q0, min(q1, q2));',
        '  float shore = clamp(q, 0.0, 1.15);',
        '  float caustic = sin(vWorldPos.x * 2.8 + uTime * 2.2) * cos(vWorldPos.z * 2.6 - uTime * 1.8) + 0.5 * sin((vWorldPos.y + vWorldPos.x) * 4.2 + uTime * 3.0);',
        '  vec3 col = mix(uDeep, uShallow, smoothstep(0.25, 0.92, shore) + 0.12 * caustic);',
        '  float wave1 = fract(shore * 3.2 - uTime * 0.42);',
        '  float foamBand = smoothstep(0.62, 0.96, shore) * smoothstep(0.76, 0.92, wave1) * (1.0 - smoothstep(0.92, 0.99, wave1));',
        '  float shoreLip = smoothstep(0.84, 0.96, shore + 0.025 * sin(uTime * 2.8 + d.x * 18.0 + d.z * 18.0));',
        '  vec3 viewDir = normalize(cameraPosition - vWorldPos);',
        '  float fres = pow(1.0 - clamp(dot(viewDir, normalize(vNormalW)), 0.0, 1.0), 3.0);',
        '  vec3 halfV = normalize(uSunDir + viewDir);',
        '  float spec = pow(max(0.0, dot(normalize(vNormalW), halfV)), 48.0) * 0.55;',
        '  col += vec3(0.55, 0.85, 1.0) * fres * 0.28 + vec3(1.0, 0.97, 0.86) * spec;',
        '  float foam = clamp(foamBand * 0.85 + shoreLip * 0.92, 0.0, 1.0);',
        '  col = mix(col, uFoam, foam);',
        '  gl_FragColor = vec4(col, mix(0.86, 0.97, foam));',
        '}'
      ].join('\n')
    });
    waterMesh = new T3.Mesh(wGeo, wMat);
    scene.add(waterMesh);

    // Cozy "Messenger by Abeto" Tiny-Planet Fresnel Atmosphere Rim Halo (feathers to 0 at outer edge — zero hard arc!)
    var atmoGeo = new T3.SphereGeometry(R + 4.8, 44, 32);
    var atmoMat = new T3.ShaderMaterial({
      side: T3.BackSide,
      transparent: true,
      depthWrite: false,
      blending: T3.AdditiveBlending,
      uniforms: {
        uInner: { value: new T3.Color(0x9be4ff) },
        uOuter: { value: new T3.Color(0xffe9b8) }
      },
      vertexShader: 'varying vec3 vNormalV; varying vec3 vViewPos; void main(){ vNormalV = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vViewPos = -mv.xyz; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uInner; uniform vec3 uOuter; varying vec3 vNormalV; varying vec3 vViewPos; void main(){ float ndv = abs(dot(normalize(vNormalV), normalize(vViewPos))); float rim = clamp(1.0 - ndv, 0.0, 1.0); float outerFade = smoothstep(0.0, 0.34, ndv); float glow = pow(rim, 3.4) * outerFade * 0.34; vec3 c = mix(uInner, uOuter, rim * 0.45); gl_FragColor = vec4(c, glow); }'
    });
    var atmoMesh = new T3.Mesh(atmoGeo, atmoMat);
    atmoMesh.renderOrder = -2;
    scene.add(atmoMesh);

    // GPU Sea-Breeze Golden Pollen Sparkles (1 single Points draw call!)
    var moteCount = IS_MOBILE_PLANET ? 70 : 140;
    var motePos = new Float32Array(moteCount * 3);
    var motePhase = new Float32Array(moteCount);
    for (var mi = 0; mi < moteCount; mi++) {
      var mLat = ((mi * 37) % 130) - 65;
      var mLon = (mi * 73) % 360;
      var md = latLonToDir(mLat, mLon);
      var mr = R + 1.1 + (mi % 7) * 0.55;
      motePos[mi * 3] = md.x * mr; motePos[mi * 3 + 1] = md.y * mr; motePos[mi * 3 + 2] = md.z * mr;
      motePhase[mi] = (mi * 1.618) % 6.28;
    }
    var moteGeo = new T3.BufferGeometry();
    moteGeo.setAttribute('position', new T3.BufferAttribute(motePos, 3));
    moteGeo.setAttribute('aPhase', new T3.BufferAttribute(motePhase, 1));
    var moteMat = new T3.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T3.AdditiveBlending,
      uniforms: { uTime: uPlanetTime, uPR: { value: renderer.getPixelRatio() } },
      vertexShader: 'attribute float aPhase; uniform float uTime; uniform float uPR; varying float vAlpha; void main(){ vec3 p = position; p.x += sin(uTime * 0.8 + aPhase) * 0.45; p.y += cos(uTime * 0.9 + aPhase * 1.3) * 0.45; p.z += sin(uTime * 0.7 - aPhase) * 0.45; vec4 mv = modelViewMatrix * vec4(p, 1.0); vAlpha = 0.35 + 0.55 * (0.5 + 0.5 * sin(uTime * 2.4 + aPhase * 3.0)); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(26.0 * uPR / max(4.0, -mv.z), 2.0, 8.0); }',
      fragmentShader: 'varying float vAlpha; void main(){ float d = length(gl_PointCoord - vec2(0.5)) * 2.0; if (d > 1.0) discard; float a = pow(1.0 - d, 2.0) * vAlpha; gl_FragColor = vec4(1.0, 0.96, 0.78, a); }'
    });
    scene.add(new T3.Points(moteGeo, moteMat));
  }

  /* ---------- GLB Loader Cache + Model Fitting ---------- */
  var gltfLoader = new T3.GLTFLoader();
  var glbCache = {};
  var loadTotal = 0, loadDone = 0;

  function bumpLoad(label) {
    loadDone++;
    var pct = Math.min(100, Math.round((loadDone / Math.max(1, loadTotal)) * 100));
    if (loadFill) loadFill.style.width = pct + '%';
    if (loadPct) loadPct.textContent = pct + '% · ' + (label || 'Preparing island…');
  }

  function loadGLB(url, label) {
    if (glbCache[url]) return glbCache[url];
    glbCache[url] = new Promise(function (resolve) {
      gltfLoader.load(url, function (gltf) {
        bumpLoad(label);
        resolve(gltf);
      }, undefined, function () {
        bumpLoad(label);
        resolve(null);
      });
    });
    return glbCache[url];
  }

  function fitModelHeight(rootObj, targetH) {
    rootObj.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(rootObj);
    var sz = box.getSize(new T3.Vector3());
    var s = targetH / Math.max(sz.y, 0.01);
    rootObj.scale.multiplyScalar(s);
    rootObj.updateMatrixWorld(true);
    box.setFromObject(rootObj);
    var ctr = box.getCenter(new T3.Vector3());
    rootObj.position.set(-ctr.x, -box.min.y, -ctr.z);
    rootObj.traverse(function (o) {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
        if (o.material) {
          o.material.metalness = Math.min(o.material.metalness || 0, 0.25);
          o.material.roughness = Math.max(0.58, o.material.roughness || 0.72);
        }
      }
    });
    var wrap = new T3.Group();
    wrap.add(rootObj);
    return wrap;
  }

  /* ---------- Collisions List (Spherical Circles) ---------- */
  var colliders = []; // { dir: Vector3, angR: number }
  function addCollider(dir, worldRadius) {
    colliders.push({ dir: dir.clone().normalize(), angR: worldRadius / R });
  }
  WATER_BAYS.forEach(function (b) {
    colliders.push({ dir: b.dir.clone(), angR: b.angR * 0.94 });
  });

  function resolveCollisions(dir) {
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < colliders.length; i++) {
        var c = colliders[i];
        var dot = Math.max(-1, Math.min(1, dir.dot(c.dir)));
        var ang = Math.acos(dot);
        if (ang < c.angR) {
          var push = dir.clone().sub(c.dir.clone().multiplyScalar(dot));
          if (push.lengthSq() < 1e-8) push.set(1, 0, 0);
          push.normalize();
          var target = c.dir.clone().multiplyScalar(Math.cos(c.angR))
            .addScaledVector(push, Math.sin(c.angR)).normalize();
          dir.copy(target);
        }
      }
    }
    return dir;
  }

  /* ---------- Rigged Kid Avatar Builder (Pixar 2K Body + 65-Bone Pose Engine + 3D Shop Items) ---------- */
  var WEAR3D_CFG = null;
  var LOCAL_ITEMS = { 'hat-explorer': 1, 'bp-adv-bag': 1, 'hat-crown': 1 };
  var AX_L = new T3.Vector3(1, 0, 0), AX_U = new T3.Vector3(0, 1, 0), AX_F = new T3.Vector3(0, 0, 1);
  var _bq = new T3.Quaternion(), _bpw = new T3.Quaternion(), _bpwi = new T3.Quaternion(), _brq = new T3.Quaternion(), _bax = new T3.Vector3();

  function normalizeItemToSize(obj, targetSize, anchorY) {
    obj.updateMatrixWorld(true);
    var b = new T3.Box3().setFromObject(obj);
    var sz = b.getSize(new T3.Vector3());
    var maxD = Math.max(sz.x, sz.y, sz.z, 0.001);
    obj.scale.multiplyScalar(targetSize / maxD);
    obj.updateMatrixWorld(true);
    b.setFromObject(obj);
    var c = b.getCenter(new T3.Vector3());
    var ay = anchorY != null ? (b.min.y + (b.max.y - b.min.y) * anchorY) : c.y;
    obj.position.set(-c.x, -ay, -c.z);
    obj.traverse(function (o) {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
        if (o.material) o.material.metalness = Math.min(o.material.metalness || 0, 0.45);
      }
    });
    var piv = new T3.Group();
    piv.add(obj);
    return piv;
  }

  function cloneSkinnedScene(gltfScene) {
    // Safe clone for skinned GLTF scenes using Three.js SkeletonUtils logic inline
    var clone = gltfScene.clone(true);
    var cloneBones = {};
    clone.traverse(function (o) { if (o.isBone) cloneBones[o.name] = o; });
    clone.traverse(function (o) {
      if (o.isSkinnedMesh && o.skeleton) {
        var bones = o.skeleton.bones.map(function (b) { return cloneBones[b.name] || b; });
        var invs = o.skeleton.boneInverses.map(function (m) { return m.clone(); });
        o.skeleton = new T3.Skeleton(bones, invs);
        o.bind(o.skeleton, o.bindMatrix.clone());
      }
    });
    return clone;
  }

  function evalKidPose(st, t, phase, seed) {
    var P = {
      thighL: 0, thighR: 0, kneeL: 0.06, kneeR: 0.06, footL: 0, footR: 0,
      armL: 0, armR: 0, liftL: 0.09, liftR: 0.09, elbowL: -0.26, elbowR: -0.26,
      lean: 0, twist: 0, headP: 0, headY: 0, headR: 0, bob: 0, bodyR: 0, bodyP: 0, jump: 0
    };
    var s, c;
    if (st === 'walk') {
      s = Math.sin(phase); c = Math.cos(phase);
      P.thighL = -0.52 * s; P.thighR = 0.52 * s;
      P.kneeL = 0.14 + 0.68 * Math.max(0, -Math.sin(phase - 0.85));
      P.kneeR = 0.14 + 0.68 * Math.max(0,  Math.sin(phase - 0.85));
      P.footL = -0.18 * Math.max(0, c); P.footR = -0.18 * Math.max(0, -c);
      P.armL = 0.56 * s; P.armR = -0.56 * s;
      P.elbowL = -0.45 - 0.25 * Math.max(0, -s); P.elbowR = -0.45 - 0.25 * Math.max(0, s);
      P.liftL = P.liftR = 0.12;
      P.lean = 0.10; P.twist = 0.12 * s; P.headP = -0.05; P.bob = 0.045 * Math.abs(c) - 0.015;
    } else if (st === 'run') {
      s = Math.sin(phase); c = Math.cos(phase);
      P.thighL = -0.92 * s; P.thighR = 0.92 * s;
      P.kneeL = 0.22 + 1.25 * Math.max(0, -Math.sin(phase - 0.9));
      P.kneeR = 0.22 + 1.25 * Math.max(0,  Math.sin(phase - 0.9));
      P.footL = -0.32 * Math.max(0, c); P.footR = -0.32 * Math.max(0, -c);
      P.armL = 0.92 * s; P.armR = -0.92 * s;
      P.elbowL = -1.28; P.elbowR = -1.28;
      P.liftL = P.liftR = 0.14;
      P.lean = 0.24; P.twist = 0.20 * s; P.headP = -0.12; P.bob = 0.085 * Math.abs(c) - 0.025;
    } else if (st === 'wave') {
      P.headY = 0.36; P.headR = -0.08; P.lean = -0.05; P.bodyR = -0.05;
      P.liftR = 2.65; P.elbowR = -0.35 + 0.55 * Math.sin(t * 11.5);
      P.liftL = 0.16; P.bob = 0.018 * Math.sin(t * 7);
    } else if (st === 'cheer') {
      var j = Math.abs(Math.sin(t * 5.6));
      P.jump = 0.44 * j;
      P.liftL = 2.75 + 0.18 * Math.sin(t * 11); P.liftR = 2.75 + 0.18 * Math.sin(t * 11 + 1);
      P.elbowL = P.elbowR = -0.22; P.headP = -0.22; P.lean = -0.10;
      P.thighL = P.thighR = -0.28 * (1 - j); P.kneeL = P.kneeR = 0.16 + 0.72 * (1 - j);
    } else if (st === 'thumbs') {
      P.armR = -0.78; P.liftR = 0.45; P.elbowR = -0.95;
      P.headY = 0.22; P.headP = -0.10; P.bob = 0.04 * Math.abs(Math.sin(t * 6.5));
    } else {
      // Natural relaxed explorer idle (arms down at sides, gentle breathing + curious look)
      P.lean = 0.028 * Math.sin(t * 2.0 + seed);
      P.headY = 0.28 * Math.sin(t * 0.65 + seed);
      P.headP = 0.05 * Math.sin(t * 1.3 + seed);
      P.armL = 0.05 * Math.sin(t * 2.0 + seed);
      P.armR = -0.05 * Math.sin(t * 2.0 + seed);
      P.bodyR = 0.025 * Math.sin(t * 1.1 + seed);
      P.bob = 0.014 * Math.sin(t * 3.6 + seed);
      P.kneeL = 0.07 + 0.05 * Math.max(0,  Math.sin(t * 1.1 + seed));
      P.kneeR = 0.07 + 0.05 * Math.max(0, -Math.sin(t * 1.1 + seed));
    }
    return P;
  }

  function makeKidAvatar(opts) {
    opts = opts || {};
    var kind = opts.girl ? 'girl' : 'boy';
    var team = opts.team || 'blue';
    var height = opts.height || 1.78;
    var bodyUrl = 'planet/models/kid-' + kind + '.glb?v=2';
    var texUrl = 'planet/models/tex/kid-' + kind + '-' + team + '.jpg?v=2';

    return loadGLB(bodyUrl, 'Avatar').then(function (gltf) {
      var rootG = new T3.Group();
      var bodyG = new T3.Group();
      var inner = new T3.Group();
      rootG.add(bodyG);
      bodyG.add(inner);

      var bones = {}, rest = {}, outL = 0.68, outR = 0.68;
      if (gltf && gltf.scene) {
        var model = cloneSkinnedScene(gltf.scene);
        inner.add(model);
        model.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false;
            if (o.material) { o.material = o.material.clone(); o.material.metalness = 0; o.material.roughness = 0.74; }
          }
          if (o.isBone) {
            var k = o.name.replace(/^mixamorig:?/, '');
            bones[k] = o;
            rest[k] = o.quaternion.clone();
          }
        });

        rootG.updateMatrixWorld(true);
        var box = new T3.Box3().setFromObject(model);
        var s = height / Math.max(box.max.y - box.min.y, 0.01);
        model.scale.multiplyScalar(s);
        model.position.y -= box.min.y * s;
        rootG.updateMatrixWorld(true);

        // Align model front strictly to +Z using LeftArm -> RightArm axis
        if (bones.LeftArm && bones.RightArm) {
          var pa = new T3.Vector3(), pb = new T3.Vector3();
          bones.LeftArm.getWorldPosition(pa);
          bones.RightArm.getWorldPosition(pb);
          var left = pa.sub(pb); left.y = 0; left.normalize();
          var fwd = new T3.Vector3().crossVectors(left, AX_U).normalize();
          inner.rotation.y = -Math.atan2(fwd.x, fwd.z);
          rootG.updateMatrixWorld(true);
        }
        // Measure A-pose arm splay angles so idle smoothly relaxes arms down to sides
        if (bones.LeftArm && bones.LeftForeArm && bones.RightArm && bones.RightForeArm) {
          var measureArm = function (a, f, sg) {
            var p1 = new T3.Vector3(), p2 = new T3.Vector3();
            bones[a].getWorldPosition(p1); bones[f].getWorldPosition(p2);
            var d = p2.sub(p1);
            return Math.atan2(sg * d.x, -d.y);
          };
          outL = measureArm('LeftArm', 'LeftForeArm', 1);
          outR = measureArm('RightArm', 'RightForeArm', -1);
        }

        // Apply crisp team shirt texture
        new T3.TextureLoader().load(texUrl, function (tex) {
          tex.flipY = false;
          if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
          tex.anisotropy = 4;
          model.traverse(function (o) {
            if (o.isMesh && o.material) {
              o.material.map = tex;
              o.material.needsUpdate = true;
            }
          });
        });
      } else {
        var fallback = new T3.Mesh(new T3.CylinderGeometry(0.28, 0.32, height * 0.7, 16), new T3.MeshStandardMaterial({ color: 0x4f9dff }));
        fallback.position.y = height * 0.35;
        inner.add(fallback);
      }

      var seed = Math.random() * 10;
      var curP = evalKidPose('idle', 0, 0, seed);

      var avatar = {
        root: rootG,
        body: bodyG,
        inner: inner,
        isGirl: !!opts.girl,
        height: height,
        bones: bones,
        rest: rest,
        outL: outL,
        outR: outR,
        state: 'idle',
        stateT: 0,
        phase: 0,
        seed: seed,
        P: curP,
        emoteTimer: 0,
        itemSyncs: [],
        bubbleSprite: null,
        bubbleTimer: 0,
        rotBone: function (name, axis, ang) {
          if (!ang) return;
          var b = this.bones[name];
          if (!b || !b.parent) return;
          this.body.getWorldQuaternion(_bq);
          _bax.copy(axis).applyQuaternion(_bq);
          _brq.setFromAxisAngle(_bax, ang);
          b.parent.getWorldQuaternion(_bpw);
          _bpwi.copy(_bpw).invert();
          b.quaternion.premultiply(_bpwi.multiply(_brq).multiply(_bpw));
        },
        setAnim: function (name) {
          if (this.state !== name) {
            this.state = name;
            this.stateT = 0;
          }
        },
        update: function (dt, t) {
          this.stateT += dt;
          if (this.emoteTimer > 0) {
            this.emoteTimer -= dt;
            if (this.emoteTimer <= 0) this.setAnim('idle');
          }
          if (this.state === 'run') this.phase += dt * 11.5;
          else if (this.state === 'walk') this.phase += dt * 7.8;

          var tgt = evalKidPose(this.state, this.stateT, this.phase, this.seed);
          var fast = this.state === 'run' || this.state === 'walk' || this.state === 'cheer' || this.state === 'wave';
          var rate = 1 - Math.exp(-dt * (fast ? 18 : 10));
          for (var key in tgt) this.P[key] += (tgt[key] - this.P[key]) * rate;

          var P = this.P;
          this.body.position.set(0, P.bob + P.jump, 0);
          this.body.rotation.set(0, 0, 0);
          if (P.bodyP) this.body.rotateOnAxis(AX_L, P.bodyP);
          if (P.bodyR) this.body.rotateOnAxis(AX_F, P.bodyR);
          this.root.updateMatrixWorld(true);

          for (var n in this.rest) this.bones[n].quaternion.copy(this.rest[n]);
          this.rotBone('Spine',  AX_L, P.lean * 0.5);
          this.rotBone('Spine1', AX_L, P.lean * 0.3);
          this.rotBone('Spine1', AX_U, P.twist);
          this.rotBone('Spine2', AX_L, P.lean * 0.2);
          this.rotBone('Neck',   AX_L, P.headP * 0.4);
          this.rotBone('Head',   AX_L, P.headP * 0.6 - P.lean * 0.4);
          this.rotBone('Head',   AX_U, P.headY);
          this.rotBone('Head',   AX_F, P.headR);
          this.rotBone('LeftArm',  AX_F, -(this.outL - P.liftL));
          this.rotBone('RightArm', AX_F,  (this.outR - P.liftR));
          this.rotBone('LeftArm',  AX_L, -P.armL);
          this.rotBone('RightArm', AX_L, -P.armR);
          this.rotBone('LeftForeArm',  AX_L, P.elbowL);
          this.rotBone('RightForeArm', AX_L, P.elbowR);
          this.rotBone('LeftUpLeg',  AX_L, P.thighL);
          this.rotBone('RightUpLeg', AX_L, P.thighR);
          this.rotBone('LeftLeg',    AX_L, P.kneeL);
          this.rotBone('RightLeg',   AX_L, P.kneeR);
          this.rotBone('LeftFoot',   AX_L, P.footL - (P.kneeL - 0.06) * 0.35 - P.thighL * 0.3);
          this.rotBone('RightFoot',  AX_L, P.footR - (P.kneeR - 0.06) * 0.35 - P.thighR * 0.3);

          if (this.itemSyncs.length) {
            this.root.updateMatrixWorld(true);
            for (var i = 0; i < this.itemSyncs.length; i++) this.itemSyncs[i](t);
          }
          if (this.bubbleSprite && this.bubbleTimer > 0) {
            this.bubbleTimer -= dt;
            if (this.bubbleTimer <= 0) this.bubbleSprite.visible = false;
          }
        }
      };

      // Snap immediately into natural relaxed idle pose on frame 0
      avatar.update(0.016, 0);

      var wornIds = opts.items || [];
      wornIds.forEach(function (id) { attachWearItem(avatar, id); });

      return avatar;
    });
  }

  function makeBoneTracker(avatar, bone, localOff, relaxedArms) {
    if (!bone) return function () {};
    var savedBodyPos = avatar.body.position.clone();
    var savedBodyRot = avatar.body.rotation.clone();
    var saved = {};
    Object.keys(avatar.bones).forEach(function (k) {
      if (avatar.rest[k]) { saved[k] = avatar.bones[k].quaternion.clone(); avatar.bones[k].quaternion.copy(avatar.rest[k]); }
    });
    avatar.body.position.set(0, 0, 0);
    avatar.body.rotation.set(0, 0, 0);
    if (relaxedArms && avatar.rotBone) {
      avatar.root.updateMatrixWorld(true);
      avatar.rotBone('LeftArm', AX_F, -(avatar.outL - 0.09));
      avatar.rotBone('RightArm', AX_F, (avatar.outR - 0.09));
      avatar.rotBone('LeftForeArm', AX_L, -0.24);
      avatar.rotBone('RightForeArm', AX_L, -0.24);
    }
    avatar.root.updateMatrixWorld(true);
    var rInv = new T3.Quaternion(); avatar.root.getWorldQuaternion(rInv).invert();
    var bRest = new T3.Quaternion(); bone.getWorldQuaternion(bRest); bRest.premultiply(rInv);
    var bRestInv = bRest.clone().invert();
    avatar.body.position.copy(savedBodyPos);
    avatar.body.rotation.copy(savedBodyRot);
    Object.keys(saved).forEach(function (k) { avatar.bones[k].quaternion.copy(saved[k]); });
    avatar.root.updateMatrixWorld(true);

    var p = new T3.Vector3(), q = new T3.Quaternion(), ri = new T3.Quaternion(), o = new T3.Vector3();
    return function (wrap) {
      bone.getWorldPosition(p);
      avatar.root.worldToLocal(p);
      bone.getWorldQuaternion(q);
      avatar.root.getWorldQuaternion(ri).invert();
      q.premultiply(ri).multiply(bRestInv);
      o.copy(localOff).applyQuaternion(q);
      wrap.position.copy(p).add(o);
      wrap.quaternion.copy(q);
    };
  }

  function makePalmGripTracker(avatar, localOff, kS) {
    var handBone = avatar.bones.LeftHand || avatar.bones.RightHand;
    if (!handBone) return function () {};
    var mid2 = avatar.bones.LeftHandMiddle2 || avatar.bones.LeftHandMiddle1 || null;
    var thb2 = avatar.bones.LeftHandThumb2  || avatar.bones.LeftHandThumb1  || null;
    var baseTrack = makeBoneTracker(avatar, handBone, new T3.Vector3(0, 0, 0), true);
    var pm = new T3.Vector3(), pt = new T3.Vector3(), o = new T3.Vector3();
    if (!mid2 || !thb2) return makeBoneTracker(avatar, handBone, new T3.Vector3(0.028 * kS, -0.052 * kS, 0.032 * kS).add(localOff), true);
    return function (wrap) {
      baseTrack(wrap);
      mid2.getWorldPosition(pm); thb2.getWorldPosition(pt);
      pm.add(pt).multiplyScalar(0.5);
      avatar.root.worldToLocal(pm);
      o.copy(localOff).applyQuaternion(wrap.quaternion);
      wrap.position.copy(pm).add(o);
    };
  }

  function buildPlanetItemWrapper(avatar, cfg, rawScene, kS) {
    var mesh = rawScene.clone(true);
    mesh.traverse(function (o) {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = false;
        if (o.material) o.material.metalness = Math.min(o.material.metalness || 0, 0.42);
      }
    });
    mesh.updateMatrixWorld(true);
    var rawBox = new T3.Box3().setFromObject(mesh), rawSz = rawBox.getSize(new T3.Vector3());
    var maxRawDim = Math.max(rawSz.x, rawSz.y, rawSz.z, 0.001);
    var orientG = new T3.Group(); orientG.add(mesh);
    var pr = cfg.preRot || [0, 0, 0];
    orientG.rotation.set(pr[0] || 0, pr[1] || 0, pr[2] || 0);
    var targetScale = (cfg.scale || 0.30) * kS;
    if ((cfg.slot === 'headwear' || cfg.slot === 'glasses') && cfg.headMode !== 'clip' && avatar.isGirl) {
      targetScale *= 0.95;
    }
    orientG.scale.setScalar(targetScale / maxRawDim);
    orientG.updateMatrixWorld(true);
    if (cfg.anchor !== null) {
      var box2 = new T3.Box3().setFromObject(orientG), anc = cfg.anchor || [0.5, 0.5, 0.5];
      orientG.position.set(
        -(box2.min.x + (box2.max.x - box2.min.x) * anc[0]),
        -(box2.min.y + (box2.max.y - box2.min.y) * anc[1]),
        -(box2.min.z + (box2.max.z - box2.min.z) * anc[2])
      );
    }
    var itemNode = new T3.Group(); itemNode.add(orientG);
    var off = cfg.offset || [0, 0, 0];
    itemNode.position.set((off[0] || 0) * kS, (off[1] || 0) * kS, (off[2] || 0) * kS);
    var rot = cfg.rotation || [0, 0, 0];
    itemNode.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    itemNode.scale.setScalar(cfg.userScale != null ? cfg.userScale : 1);
    var wrap = new T3.Group(); wrap.add(itemNode);
    return wrap;
  }

  function attachWearItem(avatar, itemId) {
    if (!itemId) return;
    var cfg = (WEAR3D_CFG && WEAR3D_CFG[itemId]) || null;
    if (!cfg) return;
    var H = avatar.height || 1.78;
    var kS = H / 1.65;
    var itemUrl = LOCAL_ITEMS[itemId] ? ('planet/models/' + itemId + '.glb') : ('../assets/3d/items/' + itemId + '.glb');
    loadGLB(itemUrl, itemId).then(function (g) {
      if (!g || !g.scene) return;
      var slot = cfg.slot, hm = cfg.headMode || 'hat';
      var wrap = buildPlanetItemWrapper(avatar, cfg, g.scene, kS);
      avatar.root.add(wrap);

      if (slot === 'headwear' || slot === 'glasses') {
        var bx = 0, by = 0.24, bz = 0;
        if (slot === 'headwear') {
          if (hm === 'clip') { var nco = cfg.clipOffset || [0.125, 0.78, 0.11]; bx = nco[0]; by = avatar.isGirl ? 0.245 : 0.26; bz = nco[2]; }
          else if (hm === 'crown') { by = avatar.isGirl ? 0.302 : 0.322; bz = 0.006; }
          else if (hm === 'band') { by = avatar.isGirl ? 0.228 : 0.232; bz = 0; }
          else if (hm === 'helmet') { by = avatar.isGirl ? 0.155 : 0.165; bz = 0.01; }
          else if (hm === 'wig') { by = avatar.isGirl ? 0.182 : 0.192; bz = -0.012; }
          else { by = avatar.isGirl ? 0.208 : 0.215; bz = -0.010; }
        } else {
          if (hm === 'band') { by = 0.118; bz = -0.004; }
          else {
            by = cfg.maskMode === 'lower' ? 0.056 : 0.118;
            bz = 0.158;
          }
        }
        var fnH = makeBoneTracker(avatar, avatar.bones.Head, new T3.Vector3(bx * kS, by * kS, bz * kS), false);
        avatar.itemSyncs.push(function () { fnH(wrap); });
        fnH(wrap);
      } else if (slot === 'back' || slot === 'neck') {
        var off = cfg.socketOffset || (slot === 'back' ? [0, 0.01, -0.088] : [0, 0.098, 0.092]);
        var zGirl = (slot === 'neck' && cfg.neckMode === 'medal' && avatar.isGirl) ? 0.014 : 0;
        var fnB = makeBoneTracker(avatar, avatar.bones.Spine2 || avatar.bones.Spine1, new T3.Vector3(off[0] * kS, off[1] * kS, (off[2] + zGirl) * kS), false);
        avatar.itemSyncs.push(function () { fnB(wrap); });
        fnB(wrap);
      } else if (slot === 'hand_r' || slot === 'hand_l') {
        var hMode = cfg.handMode || 'hand';
        if (hMode === 'hand') {
          var hOff0 = cfg.socketOffset || [0, 0, 0];
          var fnP = makePalmGripTracker(avatar, new T3.Vector3(hOff0[0] * kS, hOff0[1] * kS, hOff0[2] * kS), kS);
          avatar.itemSyncs.push(function () { fnP(wrap); });
          fnP(wrap);
        } else {
          var hBone = hMode === 'chest'
            ? (avatar.bones.Spine2 || avatar.bones.Spine1)
            : (avatar.bones.LeftForeArm || avatar.bones.LeftHand);
          var hOff = cfg.socketOffset || [0.048, -0.02, 0.042];
          var zChestGirl = (hMode === 'chest' && avatar.isGirl) ? 0.014 : 0;
          var fnR = makeBoneTracker(avatar, hBone, new T3.Vector3(hOff[0] * kS, hOff[1] * kS, (hOff[2] + zChestGirl) * kS), hMode !== 'chest');
          avatar.itemSyncs.push(function () { fnR(wrap); });
          fnR(wrap);
        }
      } else if (slot === 'pet') {
        var pOff = cfg.socketOffset || [0.42, 0.015, 0.18];
        var baseY = (cfg.hoverY != null ? cfg.hoverY : pOff[1]) * kS;
        var isFlying = (cfg.hoverY || 0) > 0.3;
        wrap.position.set(pOff[0] * kS, baseY, pOff[2] * kS);
        avatar.itemSyncs.push(function (t) {
          wrap.position.y = baseY + (isFlying ? Math.sin(t * 3.6) * 0.045 * kS : Math.abs(Math.sin(t * 2.6)) * 0.015 * kS);
          wrap.rotation.y = Math.sin(t * 1.4) * 0.18;
        });
      }
    });
  }

  function makeFloatingTextSprite(text, bgHex, txtHex) {
    var cv = document.createElement('canvas');
    cv.width = 360; cv.height = 104;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = bgHex || '#fffdf8';
    ctx.strokeStyle = '#ff5fa2';
    ctx.lineWidth = 8;
    roundRect(ctx, 8, 8, 344, 88, 36);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = txtHex || '#2b1d40';
    ctx.font = '900 40px "Fredoka","Trebuchet MS",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 180, 54);
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    var sp = new T3.Sprite(new T3.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sp.scale.set(1.9, 0.55, 1);
    sp.renderOrder = 10;
    return sp;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* ---------- Build 5 Stops + All 24 Batch D Models + Instanced Nature ---------- */
  var stopNodes = []; // { stopNum, dir, ring, ringMat, badge, charObj, chestClosed, chestOpen, sparkles }
  var parrotObj = null;

  function makeStopBadge(num, done) {
    var cv = document.createElement('canvas');
    cv.width = 160; cv.height = 160;
    var ctx = cv.getContext('2d');
    ctx.beginPath(); ctx.arc(80, 80, 64, 0, Math.PI * 2);
    ctx.fillStyle = done ? '#ffb320' : '#fffdf8';
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = done ? '#fffdf8' : '#ffb320';
    ctx.stroke();
    ctx.fillStyle = '#2b1d40';
    ctx.font = '900 72px "Fredoka","Trebuchet MS",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(done ? '★' : String(num), 80, 84);
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    return tex;
  }

  function placeProp(url, lat, lon, h, yaw, colR, sink) {
    return loadGLB(url, url.split('/').pop()).then(function (g) {
      if (!g || !g.scene) return null;
      var wrap = fitModelHeight(g.scene.clone(true), h);
      var dir = latLonToDir(lat, lon);
      orientOnSphere(wrap, dir, yaw || 0, surfaceRadius(dir) - (sink || 0.08));
      scene.add(wrap);
      if (colR > 0) addCollider(dir, colR);
      return wrap;
    });
  }

  function populateWorldModels() {
    var jobs = [];

    // 5 Chapter 1 Stop Landmarks + Characters + Golden Rings
    var stopPlacements = [
      // Stop 1: Benbow Inn (front doorway turned cleanly toward Stop 1 ring!)
      [
        ['planet/models/benbow-inn.glb',  14,  -6, 4.6, 2.55, 2.2, 0.14],
        ['planet/models/campfire.glb',     9,   7, 1.3, 0.0,  0.8, 0.06],
        ['../assets/3d/world/props/Barrel_Apples.glb', 11, 2, 1.1, 0.4, 0.5, 0.05]
      ],
      // Stop 2: Blueprint Board
      [
        ['planet/models/map-table.glb',      -1,  68, 1.8, 0.4, 1.1, 0.06],
        ['planet/models/signpost-arrows.glb', -11, 77, 2.6, -0.5, 0.6, 0.08],
        ['planet/models/pirate-hut.glb',     -15, 65, 4.1, 0.7, 2.0, 0.12]
      ],
      // Stop 3: Ship Wheel on the Shore
      [
        ['planet/models/rowing-boat.glb',     13, 148, 1.35, 0.8, 1.2, 0.08],
        ['../assets/3d/world/pirate/Ship_Small.glb', 22, 152, 4.8, -0.4, 2.3, 0.15],
        ['../assets/3d/world/pirate/Environment_Dock.glb', 15, 138, 1.5, 0.2, 1.0, 0.10]
      ],
      // Stop 4: Spyglass Lookout
      [
        ['planet/models/lookout-tower.glb',  -15, 211, 5.4,  0.55, 2.0, 0.16],
        ['planet/models/stockade-fort.glb',  -18, 226, 4.4, -0.65, 2.4, 0.14],
        ['planet/models/rope-bridge.glb',     -3, 224, 1.9,  1.1,  0.0, 0.06]
      ],
      // Stop 5: Billy's Sea Chest
      [
        ['planet/models/x-mound.glb',          5, 288, 0.75, 0.0, 0.0, 0.14],
        ['planet/models/shipwreck.glb',       16, 296, 4.2, -0.6, 2.3, 0.16]
      ]
    ];

    STOP_COORDS.forEach(function (st, idx) {
      // Glowing golden interactive ring on ground
      var ringGeo = new T3.RingGeometry(1.45, 2.0, 32);
      ringGeo.rotateX(-Math.PI / 2);
      var ringMat = new T3.MeshBasicMaterial({ color: 0xffc830, side: T3.DoubleSide, transparent: true, opacity: 0.72, depthWrite: false });
      var ring = new T3.Mesh(ringGeo, ringMat);
      orientOnSphere(ring, st.dir, 0, surfaceRadius(st.dir) + 0.09);
      scene.add(ring);

      // Floating Stop Number / Golden Star Badge
      var spMat = new T3.SpriteMaterial({ map: makeStopBadge(st.stopNum, false), transparent: true, depthTest: false });
      var badge = new T3.Sprite(spMat);
      badge.scale.set(1.45, 1.45, 1);
      badge.position.copy(st.dir).multiplyScalar(surfaceRadius(st.dir) + 3.4);
      badge.renderOrder = 6;
      scene.add(badge);

      var node = {
        stopNum: st.stopNum,
        dir: st.dir,
        ring: ring,
        ringMat: ringMat,
        badge: badge,
        charObj: null,
        chestClosed: null,
        chestOpen: null,
        sparkles: null,
        baseRad: surfaceRadius(st.dir)
      };
      stopNodes.push(node);

      // Place Stop Character slightly beside ring center
      var charDir = latLonToDir(st.lat + 3.5, st.lon + 4.5);
      jobs.push(loadGLB('planet/models/' + st.charModel, st.charModel).then(function (g) {
        if (!g || !g.scene) return;
        var ch = fitModelHeight(g.scene.clone(true), 2.15);
        orientOnSphere(ch, charDir, Math.PI, surfaceRadius(charDir) - 0.06);
        scene.add(ch);
        addCollider(charDir, 0.85);
        node.charObj = ch;
        node.charDir = charDir;
        node.charBaseRad = surfaceRadius(charDir) - 0.06;
      }));

      // Stop 5 Billy's Closed Chest (chest-open.glb is lazy-loaded on 5/5 finale to keep initial load light!)
      if (st.stopNum === 5) {
        var cDir = latLonToDir(st.lat + 1.2, st.lon - 2.2);
        node.chestDir = cDir;
        jobs.push(loadGLB('planet/models/chest-closed.glb', 'chest-closed').then(function (g) {
          if (!g || !g.scene) return;
          var m = fitModelHeight(g.scene.clone(true), 1.55);
          orientOnSphere(m, cDir, 0.4, surfaceRadius(cDir) - 0.05);
          scene.add(m);
          addCollider(cDir, 0.9);
          node.chestClosed = m;
        }));
        // Rising gold sparkle burst for Stop 5 chest open
        var spGroup = new T3.Group();
        var starGeo = new T3.OctahedronGeometry(0.18, 0);
        var starMat = new T3.MeshBasicMaterial({ color: 0xffe266 });
        for (var k = 0; k < 18; k++) {
          var sm = new T3.Mesh(starGeo, starMat);
          sm.userData = { a: (k / 18) * Math.PI * 2, r: 0.5 + (k % 3) * 0.45, spd: 1.5 + (k % 4) * 0.35, ph: k * 0.6 };
          spGroup.add(sm);
        }
        orientOnSphere(spGroup, cDir, 0, surfaceRadius(cDir) + 0.6);
        spGroup.visible = false;
        scene.add(spGroup);
        node.sparkles = spGroup;
      }

      // Stop buildings & props
      (stopPlacements[idx] || []).forEach(function (p) {
        jobs.push(placeProp(p[0], p[1], p[2], p[3], p[4], p[5], p[6]));
      });
    });

    // Extra 360° World Storytelling Landmarks (all remaining Batch D GLBs!)
    var worldLandmarks = [
      ['planet/models/cave-entrance.glb',  44, 108, 4.2, 0.2, 2.2, 0.16],
      ['planet/models/waterfall-rock.glb', -42, 30, 4.8, 0.5, 2.3, 0.16],
      ['planet/models/palm-hammock.glb',   26, -24, 3.0, 0.7, 1.4, 0.10],
      ['planet/models/coconut-pile.glb',   22, -16, 1.0, 0.2, 0.6, 0.05],
      ['planet/models/giant-shell.glb',   -24, 152, 1.6, 0.4, 0.9, 0.08],
      ['planet/models/message-bottle.glb', 24,  58, 1.1, 0.1, 0.5, 0.06],
      ['planet/models/jungle-bush.glb',    38, 185, 2.2, 0.0, 1.0, 0.10],
      ['planet/models/jungle-bush.glb',   -46, 265, 2.4, 1.2, 1.0, 0.10],
      ['planet/models/jungle-bush.glb',    52, 320, 2.3, 2.0, 1.0, 0.10],
      ['planet/models/coconut-pile.glb',  -22, 298, 1.0, 0.9, 0.6, 0.05],
      ['planet/models/giant-shell.glb',    24, 232, 1.5, 1.4, 0.9, 0.08]
    ];
    worldLandmarks.forEach(function (w) {
      jobs.push(placeProp(w[0], w[1], w[2], w[3], w[4], w[5], w[6]));
    });

    // Benbow's Flying Guide Parrot (lightweight local copy of cs-parrot.glb)
    jobs.push(loadGLB('planet/models/parrot.glb', 'Guide Parrot').then(function (g) {
      if (!g || !g.scene) return;
      parrotObj = normalizeItemToSize(g.scene.clone(true), 0.82, 0.5);
      scene.add(parrotObj);
    }));

    // Instanced Quaternius Palms, Rocks & Flowers (only 4 instanced draw calls for ~72 props!)
    var instConfigs = [
      { url: '../assets/3d/world/pirate/Environment_PalmTree_1.glb', count: 24, scale: 1.55, minBayDist: 0.10, colR: 0.55 },
      { url: '../assets/3d/world/pirate/Environment_PalmTree_3.glb', count: 16, scale: 1.45, minBayDist: 0.10, colR: 0.55 },
      { url: '../assets/3d/world/nature/Rock_Medium_1.glb',          count: 18, scale: 1.15, minBayDist: 0.06, colR: 0.65 },
      { url: '../assets/3d/world/nature/Flower_3_Group.glb',         count: 26, scale: 1.35, minBayDist: 0.12, colR: 0 }
    ];
    instConfigs.forEach(function (ic, ci) {
      jobs.push(loadGLB(ic.url, 'Nature').then(function (g) {
        if (!g || !g.scene) return;
        // Gather first mesh geometry + material for true InstancedMesh batching
        var srcMesh = null;
        g.scene.traverse(function (o) { if (!srcMesh && o.isMesh) srcMesh = o; });
        if (!srcMesh) return;
        var geom = srcMesh.geometry.clone();
        geom.computeBoundingBox();
        var bb = geom.boundingBox;
        var h = Math.max(0.01, bb.max.y - bb.min.y);
        var sNorm = (ic.scale * 2.2) / h;
        geom.translate(-(bb.min.x + bb.max.x) * 0.5, -bb.min.y, -(bb.min.z + bb.max.z) * 0.5);
        geom.scale(sNorm, sNorm, sNorm);

        var mat = srcMesh.material.clone ? srcMesh.material.clone() : srcMesh.material;
        if (mat) {
          mat.metalness = 0;
          mat.roughness = 0.78;
          // GPU Vertex Wind-Sway on Instanced Palm Trees & Flowers (zero CPU cost!)
          if (ic.url.indexOf('PalmTree') >= 0 || ic.url.indexOf('Flower') >= 0) {
            var swayAmp = ic.url.indexOf('PalmTree') >= 0 ? 0.11 : 0.05;
            var swayH   = ic.scale * 2.2;
            mat.onBeforeCompile = function (shader) {
              shader.uniforms.uTime = uPlanetTime;
              shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
                '#include <begin_vertex>',
                '#include <begin_vertex>\n' +
                'float _wy = clamp(transformed.y / ' + swayH.toFixed(2) + ', 0.0, 1.2);\n' +
                'float _wm = _wy * _wy;\n' +
                '#ifdef USE_INSTANCING\n' +
                '  vec3 _wo = instanceMatrix[3].xyz;\n' +
                '#else\n' +
                '  vec3 _wo = modelMatrix[3].xyz;\n' +
                '#endif\n' +
                'float _wp = uTime * 1.9 + _wo.x * 0.35 + _wo.z * 0.31;\n' +
                'transformed.x += sin(_wp) * ' + swayAmp.toFixed(4) + ' * _wm;\n' +
                'transformed.z += cos(_wp * 0.85) * ' + (swayAmp * 0.7).toFixed(4) + ' * _wm;'
              );
            };
            mat.customProgramCacheKey = function () { return 'pl_wind_' + ci; };
          }
        }

        var pts = [];
        var seed = 1337 + ci * 997;
        function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
        for (var tries = 0; tries < 280 && pts.length < ic.count; tries++) {
          var lat = (rnd() * 140) - 70;
          var lon = rnd() * 360;
          var d = latLonToDir(lat, lon);
          if (bayDepth(d) > 0 || nearAnyStop(d) > 0.15) continue;
          if (trailDistanceAngle(d) < 0.085) continue;
          var clash = false;
          for (var j = 0; j < colliders.length; j++) {
            if (Math.acos(Math.max(-1, Math.min(1, d.dot(colliders[j].dir)))) < colliders[j].angR + 0.09) { clash = true; break; }
          }
          if (clash) continue;
          pts.push({ dir: d, yaw: rnd() * Math.PI * 2, sc: 0.78 + rnd() * 0.45 });
          if (ic.colR > 0) addCollider(d, ic.colR);
        }

        if (!pts.length) return;
        var inst = new T3.InstancedMesh(geom, mat, pts.length);
        inst.castShadow = ic.colR > 0;
        inst.receiveShadow = false;
        var dummy = new T3.Object3D();
        pts.forEach(function (pt, idx) {
          orientOnSphere(dummy, pt.dir, pt.yaw, surfaceRadius(pt.dir) - 0.12);
          dummy.scale.setScalar(pt.sc);
          dummy.updateMatrix();
          inst.setMatrixAt(idx, dummy.matrix);
        });
        inst.instanceMatrix.needsUpdate = true;
        scene.add(inst);
      }));
    });

    return Promise.all(jobs);
  }

  /* ---------- Tap-to-Walk Ground Marker Ring ---------- */
  var tapRingGeo = new T3.RingGeometry(0.45, 0.72, 24);
  tapRingGeo.rotateX(-Math.PI / 2);
  var tapRing = new T3.Mesh(tapRingGeo, new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false }));
  tapRing.visible = false;
  scene.add(tapRing);

  /* ---------- Core Game State & Spherical Motion ---------- */
  var state = {
    playerDir: latLonToDir(3, -10), // Starts right in front of Stop 1 (Benbow Inn) facing the trail!
    playerFwd: null,
    camFwd: null,
    camPos: new T3.Vector3(),
    camLook: new T3.Vector3(),
    player: null,
    running: false,
    keys: {},
    joyX: 0,
    joyY: 0,
    tapTargetDir: null,
    activeStopPrompt: null,
    stopCooldown: 0,
    modalOpen: false,
    creditsMode: false,
    creditsAngle: 0,
    finaleTriggered: false,
    ready: false
  };

  // Initial forward tangent pointing smoothly toward Stop 1
  (function initHeading() {
    var toS1 = STOP_COORDS[0].dir.clone().sub(state.playerDir.clone().multiplyScalar(STOP_COORDS[0].dir.dot(state.playerDir))).normalize();
    state.playerFwd = toS1.clone();
    state.camFwd = toS1.clone();
  })();

  /* ---------- Input Handlers: Joystick, Run, Tap-to-Walk, Keyboard ---------- */
  var joyState = { active: false, pid: null, cx: 0, cy: 0, maxR: 38 };
  joyEl.addEventListener('pointerdown', function (e) {
    unlockAudio();
    joyState.active = true;
    joyState.pid = e.pointerId;
    var r = joyEl.getBoundingClientRect();
    joyState.cx = r.left + r.width * 0.5;
    joyState.cy = r.top + r.height * 0.5;
    joyEl.classList.add('dragging');
    joyEl.setPointerCapture(e.pointerId);
    updateJoy(e.clientX, e.clientY);
  });
  joyEl.addEventListener('pointermove', function (e) {
    if (!joyState.active || e.pointerId !== joyState.pid) return;
    updateJoy(e.clientX, e.clientY);
  });
  function endJoy() {
    joyState.active = false;
    joyState.pid = null;
    state.joyX = 0; state.joyY = 0;
    joyEl.classList.remove('dragging');
    joyKnob.style.transform = 'translate(0, 0)';
  }
  joyEl.addEventListener('pointerup', endJoy);
  joyEl.addEventListener('pointercancel', endJoy);
  function updateJoy(x, y) {
    var dx = x - joyState.cx, dy = y - joyState.cy;
    var d = Math.hypot(dx, dy);
    if (d > joyState.maxR) { dx = (dx / d) * joyState.maxR; dy = (dy / d) * joyState.maxR; }
    joyKnob.style.transform = 'translate(' + Math.round(dx) + 'px,' + Math.round(dy) + 'px)';
    state.joyX = dx / joyState.maxR;
    state.joyY = dy / joyState.maxR;
    if (Math.hypot(state.joyX, state.joyY) > 0.15) {
      state.tapTargetDir = null;
      tapRing.visible = false;
    }
  }

  // Run button: supports both tap-toggle & hold
  var runToggle = false;
  runBtn.addEventListener('click', function () {
    unlockAudio(); sfxTap();
    runToggle = !runToggle;
    runBtn.classList.toggle('active', runToggle);
  });

  // Keyboard (WASD / Arrows + Shift)
  root.addEventListener('keydown', function (e) {
    if (state.modalOpen) return;
    unlockAudio();
    state.keys[e.code] = true;
    if (/Arrow|Key[WASD]/.test(e.code)) {
      state.tapTargetDir = null;
      tapRing.visible = false;
    }
  });
  root.addEventListener('keyup', function (e) {
    state.keys[e.code] = false;
  });

  // Tap-on-the-planet to walk there (Raycaster)
  var raycaster = new T3.Raycaster();
  var pointerDownPt = null;
  canvas.addEventListener('pointerdown', function (e) {
    unlockAudio();
    pointerDownPt = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  canvas.addEventListener('pointerup', function (e) {
    if (!pointerDownPt || !planetMesh || state.modalOpen || state.creditsMode) return;
    var dist = Math.hypot(e.clientX - pointerDownPt.x, e.clientY - pointerDownPt.y);
    var dtMs = performance.now() - pointerDownPt.t;
    pointerDownPt = null;
    if (dist > 14 || dtMs > 420) return;

    var rect = canvas.getBoundingClientRect();
    var ndc = new T3.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(ndc, camera);
    var hits = raycaster.intersectObject(planetMesh, false);
    if (hits.length) {
      var hitDir = hits[0].point.clone().normalize();
      if (bayDepth(hitDir) > 0.15) return; // Don't walk into water bay
      state.tapTargetDir = hitDir;
      orientOnSphere(tapRing, hitDir, 0, surfaceRadius(hitDir) + 0.12);
      tapRing.visible = true;
      sfxTap();
      hideBubble();
    }
  });

  /* ---------- Chapter 1 Progress, HUD, Bubble & Finale Integration ---------- */
  function getGrade() {
    return (root.Ch1Progress && root.Ch1Progress.getActiveGrade) ? root.Ch1Progress.getActiveGrade() : 3;
  }
  function getStampCount() {
    return (root.Ch1Progress && root.Ch1Progress.getStampCount) ? root.Ch1Progress.getStampCount(getGrade()) : 0;
  }
  function getNextStopNum() {
    return (root.Ch1Progress && root.Ch1Progress.getNextStop) ? root.Ch1Progress.getNextStop(getGrade()) : 1;
  }
  function getStopContent(stopNum) {
    if (root.Chapter1 && root.Chapter1.getClue) return root.Chapter1.getClue(stopNum, getGrade());
    return null;
  }

  function ensureChestOpen() {
    var st5 = stopNodes[4];
    if (!st5 || !st5.chestDir) return;
    if (st5.chestClosed) st5.chestClosed.visible = false;
    if (st5.sparkles) st5.sparkles.visible = true;
    if (st5.chestOpen) {
      st5.chestOpen.visible = true;
      return;
    }
    if (st5.chestOpenLoading) return;
    st5.chestOpenLoading = true;
    loadGLB('planet/models/chest-open.glb', 'chest-open').then(function (g) {
      if (!g || !g.scene) return;
      var m = fitModelHeight(g.scene.clone(true), 1.75);
      orientOnSphere(m, st5.chestDir, 0.4, surfaceRadius(st5.chestDir) - 0.05);
      scene.add(m);
      st5.chestOpen = m;
    });
  }

  function refreshProgressUI() {
    var g = getGrade();
    var stamps = getStampCount();
    var nextStop = getNextStopNum();
    if (stampCountEl) stampCountEl.textContent = stamps + '/5';

    for (var i = 1; i <= 5; i++) {
      var earned = root.Ch1Progress ? (root.Ch1Progress.getClueStars(g, i) > 0) : false;
      var slot = document.getElementById('ch1-stamp-slot-' + i);
      if (slot) {
        slot.classList.toggle('earned', earned);
        slot.classList.toggle('next', !earned && i === nextStop);
      }
      var node = stopNodes[i - 1];
      if (node) {
        node.badge.material.map = makeStopBadge(i, earned);
        node.badge.material.needsUpdate = true;
        node.ringMat.color.setHex(earned ? 0x2fc58a : (i === nextStop ? 0xffc830 : 0xffffff));
        node.ringMat.opacity = earned ? 0.45 : (i === nextStop ? 0.85 : 0.35);
      }
    }

    var nextInfo = STOP_COORDS[Math.max(0, Math.min(4, nextStop - 1))];
    var clueObj = getStopContent(nextStop);
    if (stamps >= 5) {
      goalText.textContent = '🏴‍☠️ All 5 Stamps! Open Billy\'s Sea Chest!';
      ensureChestOpen();
    } else {
      goalText.textContent = 'Next: Stop ' + nextStop + ' · ' + ((clueObj && clueObj.stopName) || nextInfo.fallbackName);
    }
  }

  // Click any stamp pill or goal pill to walk straight to that stop
  goalPill.onclick = function () {
    sfxTap();
    walkToStop(getNextStopNum());
  };
  document.getElementById('pl-stamps').addEventListener('click', function (e) {
    var btn = e.target.closest('.pl-stamp-slot');
    if (!btn) return;
    sfxTap();
    walkToStop(Number(btn.getAttribute('data-stop')) || 1);
  });

  function walkToStop(stopNum) {
    var idx = Math.max(0, Math.min(4, (Number(stopNum) || 1) - 1));
    state.tapTargetDir = STOP_COORDS[idx].dir.clone();
    orientOnSphere(tapRing, state.tapTargetDir, 0, surfaceRadius(state.tapTargetDir) + 0.12);
    tapRing.visible = true;
    hideBubble();
  }

  function showStopBubble(stopNum) {
    var g = getGrade();
    var nextStop = getNextStopNum();
    var stamps = getStampCount();
    var stMeta = STOP_COORDS[stopNum - 1];
    var clue = getStopContent(stopNum);
    var alreadyDone = root.Ch1Progress ? (root.Ch1Progress.getClueStars(g, stopNum) > 0) : false;

    // 5/5 complete -> trigger Billy's Chest Finale + Credits!
    if (stopNum === 5 && stamps >= 5) {
      triggerPlanetFinale();
      return;
    }

    state.activeStopPrompt = stopNum;
    state.tapTargetDir = null;
    tapRing.visible = false;

    var locked = (!alreadyDone && stopNum > nextStop);
    bubbleSpeaker.textContent = stMeta.speaker;
    bubbleStopTag.textContent = 'Stop ' + stopNum + ' of 5';

    if (locked) {
      var lockLine = 'Come back later! Visit Stop ' + nextStop + ' first!';
      bubbleText.textContent = lockLine;
      bubblePlay.style.display = 'none';
      bubbleEl.classList.add('show');
      speakLine(lockLine);
      return;
    }

    var shortLine = (clue && clue.introLine) || ('Ahoy! Ready for Stop ' + stopNum + ' at ' + stMeta.fallbackName + '?');
    // Keep speech bubble crisp & child-friendly
    if (shortLine.length > 140) shortLine = shortLine.slice(0, 136).replace(/\s+\S*$/, '') + '!';
    bubbleText.textContent = shortLine;
    bubblePlay.style.display = '';
    bubblePlay.textContent = alreadyDone ? 'Replay Clue! ▶' : 'Play Clue! ▶';
    bubbleEl.classList.add('show');
    speakLine(shortLine);
  }

  function hideBubble() {
    state.activeStopPrompt = null;
    bubbleEl.classList.remove('show');
  }

  bubbleHear.onclick = function () { sfxTap(); speakLine(bubbleText.textContent); };
  bubbleClose.onclick = function () { sfxTap(); hideBubble(); state.stopCooldown = 2.4; };
  bubblePlay.onclick = function () {
    sfxTap();
    var n = state.activeStopPrompt;
    hideBubble();
    if (!n) return;
    state.modalOpen = true;
    state.stopCooldown = 2.2;
    if (root.Chapter1 && typeof root.Chapter1.openClue === 'function') {
      root.Chapter1.openClue(n, 'easy');
    }
  };

  function triggerPlanetFinale() {
    if (state.finaleTriggered) {
      openRollingCredits();
      return;
    }
    state.finaleTriggered = true;
    hideBubble();
    playSfx('chest');
    ensureChestOpen();
    if (root.Ch1Feedback && typeof root.Ch1Feedback.playChestFinale === 'function') {
      state.modalOpen = true;
      root.Ch1Feedback.playChestFinale(function () {
        state.modalOpen = false;
        refreshProgressUI();
        openRollingCredits();
      });
    } else {
      openRollingCredits();
    }
  }

  function openRollingCredits() {
    playSfx('win');
    state.creditsMode = true;
    state.creditsAngle = 0;
    // Restart roll animation cleanly
    var roll = document.getElementById('pl-credits-roll');
    if (roll) {
      roll.style.animation = 'none';
      void roll.offsetWidth;
      roll.style.animation = '';
    }
    creditsEl.classList.add('show');
  }

  // Adapter so existing Chapter1.closeClue() & onClueFinished() update our 3D planet cleanly!
  root.WORLD = {
    S: { zone: 1 },
    refresh: function () {
      state.modalOpen = !!document.getElementById('ch1-modal-backdrop');
      refreshProgressUI();
      if (!state.modalOpen && getStampCount() >= 5 && !state.finaleTriggered) {
        setTimeout(function () { triggerPlanetFinale(); }, 450);
      }
    },
    onMissionComplete: function () {
      playSfx('correct');
      refreshProgressUI();
    },
    walkToActiveGoal: function () {
      state.modalOpen = false;
      refreshProgressUI();
      walkToStop(getNextStopNum());
    }
  };

  /* ---------- Emote Wheel + Classmates Multiplayer API (Phase 6) ---------- */
  var emoteToastTimer = null;
  function showEmoteToast(msg) {
    emoteToast.textContent = msg;
    emoteToast.classList.add('show');
    clearTimeout(emoteToastTimer);
    emoteToastTimer = setTimeout(function () { emoteToast.classList.remove('show'); }, 2400);
  }

  emoteBtn.onclick = function () {
    unlockAudio(); sfxTap();
    emoteMenu.classList.toggle('open');
  };

  emoteMenu.addEventListener('click', function (e) {
    var btn = e.target.closest('.pl-emote-chip');
    if (!btn) return;
    sfxTap();
    emoteMenu.classList.remove('open');
    var act = btn.getAttribute('data-emote');
    var say = btn.getAttribute('data-say');
    if (act && state.player) {
      state.player.emoteTimer = 1.9;
      state.player.setAnim(act === 'cheer' ? 'cheer' : act === 'thumbs' ? 'thumbs' : 'wave');
      playSfx(act === 'cheer' ? 'cheer' : 'tap');
      showEmoteToast(act === 'wave' ? '👋 Wave!' : act === 'cheer' ? '🎉 Cheer!' : '👍 Nice!');
      reactNearbyVisitors(act);
    } else if (say) {
      if (state.player) {
        state.player.emoteTimer = 1.6;
        state.player.setAnim('wave');
      }
      showEmoteToast('💬 "' + say + '"');
      speakLine(say);
      reactNearbyVisitors('wave');
    }
  });

  // Public Classmates API for Claude's live Supabase presence integration
  var visitors = {};
  var VISITOR_EMOTE_LINES = ['Hello!', 'Good job!', "Let's go!", 'Follow me!', 'Thank you!'];

  function planetAddVisitor(id, look) {
    if (!id || visitors[id]) return;
    look = look || {};
    var vDir = look.dir ? look.dir.clone().normalize() : latLonToDir(look.lat || 15, look.lon || 40);
    var vFwd = tangentBasis(vDir).east.clone();
    var entry = {
      id: id,
      dir: vDir,
      fwd: vFwd,
      targetDir: vDir.clone(),
      avatar: null,
      demoWander: !!look.demoWander,
      wanderSeed: Math.random() * 100
    };
    visitors[id] = entry;

    makeKidAvatar({
      girl: !!look.girl,
      team: look.team || 'pink',
      height: 1.72,
      items: look.items || ['hat-crown']
    }).then(function (av) {
      if (!visitors[id]) return;
      entry.avatar = av;
      orientOnSphere(av.root, entry.dir, 0);
      scene.add(av.root);
    });
  }

  function planetMoveVisitor(id, pos, dir, anim) {
    var v = visitors[id];
    if (!v) return;
    if (pos && pos.isVector3) v.dir.copy(pos).normalize();
    else if (Array.isArray(pos) && pos.length === 3) v.dir.set(pos[0], pos[1], pos[2]).normalize();
    if (dir && dir.isVector3) v.fwd.copy(dir).normalize();
    else if (Array.isArray(dir) && dir.length === 3) v.fwd.set(dir[0], dir[1], dir[2]).normalize();
    if (v.avatar && anim) v.avatar.setAnim(anim);
  }

  function planetVisitorEmote(id, emote) {
    var v = visitors[id];
    if (!v || !v.avatar) return;
    v.avatar.emoteTimer = 2.0;
    v.avatar.setAnim(emote === 'cheer' ? 'cheer' : 'wave');
    var label = VISITOR_EMOTE_LINES.indexOf(emote) >= 0 ? emote : (emote === 'cheer' ? '🎉' : '👋 Hello!');
    if (v.avatar.bubbleSprite) v.avatar.root.remove(v.avatar.bubbleSprite);
    var sp = makeFloatingTextSprite(label, '#fffdf8', '#2b1d40');
    sp.position.set(0, v.avatar.height + 0.55, 0);
    v.avatar.root.add(sp);
    v.avatar.bubbleSprite = sp;
    v.avatar.bubbleTimer = 2.4;
  }

  function planetRemoveVisitor(id) {
    var v = visitors[id];
    if (!v) return;
    if (v.avatar && v.avatar.root.parent) scene.remove(v.avatar.root);
    delete visitors[id];
  }

  function reactNearbyVisitors(emote) {
    Object.keys(visitors).forEach(function (id) {
      var v = visitors[id];
      if (!v || !v.avatar) return;
      var ang = Math.acos(Math.max(-1, Math.min(1, v.dir.dot(state.playerDir))));
      if (ang < 0.65) {
        var line = VISITOR_EMOTE_LINES[Math.floor(Math.random() * VISITOR_EMOTE_LINES.length)];
        setTimeout(function () { planetVisitorEmote(id, emote === 'cheer' ? 'cheer' : line); }, 350);
      }
    });
  }

  root.planetAddVisitor = planetAddVisitor;
  root.planetMoveVisitor = planetMoveVisitor;
  root.planetVisitorEmote = planetVisitorEmote;
  root.planetRemoveVisitor = planetRemoveVisitor;

  /* ---------- Frame Loop: Spherical Movement, Messenger Camera, Parrot, Visitors, FPS Guard ---------- */
  var updateClouds = buildSkyAndClouds();
  buildPlanetSphere();

  var _vRight = new T3.Vector3(), _vMove = new T3.Vector3(), _vAxis = new T3.Vector3(), _dq = new T3.Quaternion();
  var _tmpV = new T3.Vector3(), _m4 = new T3.Matrix4(), _proj = new T3.Vector3();
  var clock = new T3.Clock();

  var fpsFrames = 0, fpsAccum = 0, lowFpsSec = 0, curFps = 60;

  function updatePlayer(dt, t) {
    if (!state.player) return;

    // Detect if Chapter 1 modal closed externally
    var hasModal = !!document.getElementById('ch1-modal-backdrop') || !!document.getElementById('ch1-finale-overlay');
    if (state.modalOpen && !hasModal) {
      state.modalOpen = false;
      refreshProgressUI();
    }

    if (state.stopCooldown > 0) state.stopCooldown -= dt;

    var up = state.playerDir;
    var camFwd = state.camFwd.clone().sub(up.clone().multiplyScalar(state.camFwd.dot(up))).normalize();
    _vRight.crossVectors(camFwd, up).normalize();

    var ix = state.joyX;
    var iy = state.joyY;
    if (state.keys.KeyW || state.keys.ArrowUp) iy -= 1;
    if (state.keys.KeyS || state.keys.ArrowDown) iy += 1;
    if (state.keys.KeyA || state.keys.ArrowLeft) ix -= 1;
    if (state.keys.KeyD || state.keys.ArrowRight) ix += 1;
    var mag = Math.hypot(ix, iy);
    if (mag > 1) { ix /= mag; iy /= mag; mag = 1; }

    var moving = false;
    var isRunning = !!(runToggle || state.keys.ShiftLeft || state.keys.ShiftRight);
    state.running = isRunning && (mag > 0.12 || !!state.tapTargetDir);

    if (!state.modalOpen && !state.creditsMode) {
      if (mag > 0.12) {
        _vMove.copy(_vRight).multiplyScalar(ix).addScaledVector(camFwd, -iy).normalize();
        moving = true;
        if (state.activeStopPrompt) hideBubble();
      } else if (state.tapTargetDir) {
        var dotT = Math.max(-1, Math.min(1, up.dot(state.tapTargetDir)));
        var angT = Math.acos(dotT);
        if (angT < 0.03) {
          state.tapTargetDir = null;
          tapRing.visible = false;
        } else {
          _vMove.copy(state.tapTargetDir).sub(up.clone().multiplyScalar(dotT)).normalize();
          moving = true;
        }
      }
    }

    if (moving) {
      var speed = isRunning ? 6.8 : 4.2;
      var ds = speed * dt * (mag > 0.12 ? Math.max(0.45, mag) : 1);
      var dTheta = ds / R;

      // Parallel-transport spherical motion (zero gimbal lock across all 360° including poles!)
      _vAxis.crossVectors(up, _vMove).normalize();
      if (_vAxis.lengthSq() > 0.01) {
        _dq.setFromAxisAngle(_vAxis, dTheta);
        state.playerDir.applyQuaternion(_dq).normalize();
        resolveCollisions(state.playerDir);
        state.camFwd.applyQuaternion(_dq);
        state.camFwd.sub(state.playerDir.clone().multiplyScalar(state.camFwd.dot(state.playerDir))).normalize();

        // Smooth character turning toward movement direction
        state.playerFwd.applyQuaternion(_dq);
        state.playerFwd.lerp(_vMove, 1 - Math.exp(-dt * 11));
        state.playerFwd.sub(state.playerDir.clone().multiplyScalar(state.playerFwd.dot(state.playerDir))).normalize();
      }

      state.player.setAnim(isRunning ? 'run' : 'walk');

      // Soft grass/sand footstep timing
      audio.stepTimer -= dt * (isRunning ? 1.55 : 1.0);
      if (audio.stepTimer <= 0) {
        audio.stepTimer = 0.36;
        playSfx('step');
      }
    } else if (state.player.emoteTimer <= 0) {
      state.player.setAnim('idle');
    }

    // Orient player avatar strictly on spherical normal
    var pRad = surfaceRadius(state.playerDir);
    state.player.root.position.copy(state.playerDir).multiplyScalar(pRad);
    var pRight = new T3.Vector3().crossVectors(state.playerDir, state.playerFwd).normalize();
    _m4.makeBasis(pRight, state.playerDir, state.playerFwd);
    state.player.root.quaternion.setFromRotationMatrix(_m4);
    state.player.update(dt, t);

    // Pulse tap target ring
    if (tapRing.visible) {
      var sc = 0.85 + Math.sin(t * 7) * 0.2;
      tapRing.scale.setScalar(sc);
    }

    // Check proximity to the 5 Chapter 1 Stops
    if (!state.modalOpen && !state.creditsMode && state.stopCooldown <= 0 && !state.activeStopPrompt) {
      for (var i = 0; i < stopNodes.length; i++) {
        var sn = stopNodes[i];
        var ang = Math.acos(Math.max(-1, Math.min(1, state.playerDir.dot(sn.dir))));
        if (ang < 0.095) { // ~2.1m radius into gold ring
          showStopBubble(sn.stopNum);
          break;
        }
      }
    }
  }

  function updateCameraAndSun(dt, t) {
    var up = state.playerDir;
    var fwd = state.camFwd;

    if (state.creditsMode) {
      // Messenger-style slow cinematic orbit around the sunlit spinning planet!
      state.creditsAngle += dt * 0.18;
      var orbitDir = latLonToDir(22, (state.creditsAngle * 180 / Math.PI) % 360);
      var desiredPos = orbitDir.multiplyScalar(R + 24);
      state.camPos.lerp(desiredPos, 1 - Math.exp(-dt * 2.5));
      state.camLook.lerp(new T3.Vector3(0, 0, 0), 1 - Math.exp(-dt * 2.5));
      camera.position.copy(state.camPos);
      camera.up.set(0, 1, 0);
      camera.lookAt(state.camLook);
      return;
    }

    // Third-person Messenger-style curved-horizon camera
    var distBack = state.activeStopPrompt ? 5.6 : (state.running ? 11.4 : 9.6);
    var distUp   = state.activeStopPrompt ? 4.4 : (state.running ? 8.2 : 7.1);
    var pPos = state.playerDir.clone().multiplyScalar(surfaceRadius(state.playerDir));
    var targetCamPos = pPos.clone()
      .addScaledVector(up, distUp)
      .addScaledVector(fwd, -distBack);

    // Safety guard: camera NEVER goes inside planet surface!
    var minCamR = R + 2.4;
    if (targetCamPos.length() < minCamR) targetCamPos.normalize().multiplyScalar(minCamR);

    var targetLook = pPos.clone()
      .addScaledVector(up, state.activeStopPrompt ? 1.5 : 1.1)
      .addScaledVector(fwd, state.activeStopPrompt ? 1.2 : 2.8);

    var damp = 1 - Math.exp(-dt * 6.5);
    if (state.camPos.lengthSq() < 1) {
      state.camPos.copy(targetCamPos);
      state.camLook.copy(targetLook);
    } else {
      state.camPos.lerp(targetCamPos, damp);
      state.camLook.lerp(targetLook, damp);
    }
    camera.position.copy(state.camPos);
    camera.up.lerp(up, damp).normalize();
    camera.lookAt(state.camLook);

    // Keep single 1024 shadow sun smoothly locked above the player's hemisphere
    sun.position.copy(up).multiplyScalar(R + 22).addScaledVector(fwd, -8);
    sun.target.position.copy(pPos);
    sun.target.updateMatrixWorld();
  }

  function updateStopsParrotAndVisitors(dt, t) {
    // Animate stop rings, characters & Stop 5 chest sparkles
    var nextStop = getNextStopNum();
    for (var i = 0; i < stopNodes.length; i++) {
      var sn = stopNodes[i];
      if (sn.stopNum === nextStop) {
        sn.ring.scale.setScalar(1.0 + Math.sin(t * 3.8) * 0.08);
      }
      if (sn.charObj && sn.charDir) {
        // Gentle happy bounce when player is close or talking
        var nearP = Math.acos(Math.max(-1, Math.min(1, state.playerDir.dot(sn.charDir)))) < 0.28;
        var hop = nearP ? Math.abs(Math.sin(t * 5.2)) * 0.22 : Math.sin(t * 2.2 + i) * 0.04;
        sn.charObj.position.copy(sn.charDir).multiplyScalar(sn.charBaseRad + hop);
        if (nearP) {
          // Turn smoothly to face player on the sphere tangent
          var toP = state.playerDir.clone().sub(sn.charDir.clone().multiplyScalar(state.playerDir.dot(sn.charDir))).normalize();
          var rgt = new T3.Vector3().crossVectors(sn.charDir, toP).normalize();
          _m4.makeBasis(rgt, sn.charDir, toP);
          sn.charObj.quaternion.slerp(new T3.Quaternion().setFromRotationMatrix(_m4), 1 - Math.exp(-dt * 6));
        }
      }
      if (sn.sparkles && sn.sparkles.visible) {
        sn.sparkles.children.forEach(function (sm) {
          var u = sm.userData;
          var ang = t * u.spd + u.a;
          sm.position.set(Math.cos(ang) * u.r, ((t * 1.1 + u.ph) % 2.4), Math.sin(ang) * u.r);
          sm.rotation.y = t * 4;
        });
      }
    }

    // Guide Parrot (parrot.glb) circles gracefully ahead toward the active next stop
    var targetIdx = Math.max(0, Math.min(4, nextStop - 1));
    var targetDir = STOP_COORDS[targetIdx].dir;
    if (parrotObj) {
      var dot = Math.max(-1, Math.min(1, state.playerDir.dot(targetDir)));
      var ang = Math.acos(dot);
      var leadT = ang > 0.06 ? Math.min(0.68, 0.25 / ang) : 0.95;
      var pDir = state.playerDir.clone().lerp(targetDir, leadT).normalize();
      var b = tangentBasis(pDir);
      var orbA = t * 1.45;
      var orbR = 1.45;
      var bob = Math.sin(t * 5.2) * 0.22;
      var alt = surfaceRadius(pDir) + 2.95 + bob;
      parrotObj.position.copy(pDir).multiplyScalar(alt)
        .addScaledVector(b.east, Math.cos(orbA) * orbR)
        .addScaledVector(b.north, Math.sin(orbA) * orbR);
      // Face tangentially along orbital flight direction so player sees bright 3/4 wing & beak profile
      var velDir = b.east.clone().multiplyScalar(-Math.sin(orbA))
        .addScaledVector(b.north, Math.cos(orbA)).normalize();
      var pUp = pDir.clone().addScaledVector(b.east, -Math.cos(orbA) * 0.22)
        .addScaledVector(b.north, -Math.sin(orbA) * 0.22).normalize();
      var pr = new T3.Vector3().crossVectors(pUp, velDir).normalize();
      var trueUp = new T3.Vector3().crossVectors(velDir, pr).normalize();
      _m4.makeBasis(pr, trueUp, velDir);
      parrotObj.quaternion.setFromRotationMatrix(_m4);
    }

    // Screen-edge glowing arrow when active stop is off-screen or behind horizon
    if (!state.creditsMode && !state.modalOpen) {
      _proj.copy(targetDir).multiplyScalar(surfaceRadius(targetDir) + 1.8).project(camera);
      var behind = _proj.z > 1;
      var offX = Math.abs(_proj.x) > 0.92;
      var offY = Math.abs(_proj.y) > 0.88;
      if (behind || offX || offY) {
        var sx = behind ? -_proj.x : _proj.x;
        var sy = behind ? -_proj.y : _proj.y;
        var a = Math.atan2(sy, sx);
        var padX = root.innerWidth * 0.43;
        var padY = root.innerHeight * 0.36;
        var px = root.innerWidth * 0.5 + Math.cos(a) * padX;
        var py = root.innerHeight * 0.5 - Math.sin(a) * padY;
        edgeArrow.style.left = Math.round(px) + 'px';
        edgeArrow.style.top = Math.round(py) + 'px';
        edgeArrow.style.transform = 'translate(-50%, -50%) rotate(' + Math.round((Math.PI * 0.5 - a) * 180 / Math.PI) + 'deg)';
        edgeArrow.classList.add('show');
      } else {
        edgeArrow.classList.remove('show');
      }
    } else {
      edgeArrow.classList.remove('show');
    }

    // Roaming Classmate Visitors
    Object.keys(visitors).forEach(function (id) {
      var v = visitors[id];
      if (!v || !v.avatar) return;
      if (v.demoWander) {
        // Gentle peaceful walk around the sunny planet
        var steer = Math.sin(t * 0.35 + v.wanderSeed) * 0.55;
        var perp = new T3.Vector3().crossVectors(v.dir, v.fwd).normalize();
        v.fwd.addScaledVector(perp, steer * dt).sub(v.dir.clone().multiplyScalar(v.fwd.dot(v.dir))).normalize();
        var axis = new T3.Vector3().crossVectors(v.dir, v.fwd).normalize();
        var stepQ = new T3.Quaternion().setFromAxisAngle(axis, (2.2 * dt) / R);
        v.dir.applyQuaternion(stepQ).normalize();
        resolveCollisions(v.dir);
        v.fwd.applyQuaternion(stepQ);
        v.fwd.sub(v.dir.clone().multiplyScalar(v.fwd.dot(v.dir))).normalize();
        if (v.avatar.emoteTimer <= 0) v.avatar.setAnim('walk', 0.65);
      }
      var vr = surfaceRadius(v.dir);
      v.avatar.root.position.copy(v.dir).multiplyScalar(vr);
      var vRight = new T3.Vector3().crossVectors(v.dir, v.fwd).normalize();
      _m4.makeBasis(vRight, v.dir, v.fwd);
      v.avatar.root.quaternion.setFromRotationMatrix(_m4);
      v.avatar.update(dt, t);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;
    uPlanetTime.value = t;

    updateClouds(t);
    updatePlayer(dt, t);
    updateCameraAndSun(dt, t);
    if (waterMesh && waterMesh.material && waterMesh.material.uniforms && waterMesh.material.uniforms.uSunDir) {
      waterMesh.material.uniforms.uSunDir.value.copy(sun.position).normalize();
    }
    updateStopsParrotAndVisitors(dt, t);
    renderer.render(scene, camera);

    // FPS monitor & friendly <20 FPS fallback guard
    fpsFrames++;
    fpsAccum += dt;
    if (fpsAccum >= 1.0) {
      curFps = Math.round(fpsFrames / fpsAccum);
      fpsFrames = 0; fpsAccum = 0;
      if (canvas) {
        canvas.setAttribute('data-stats', JSON.stringify({
          fps: curFps,
          calls: renderer.info.render.calls,
          tris: renderer.info.render.triangles,
          geoms: renderer.info.memory.geometries,
          tex: renderer.info.memory.textures
        }));
      }
      if (state.ready && curFps < 20) {
        lowFpsSec++;
        if (lowFpsSec >= 5) lowFpsEl.classList.add('show');
      } else {
        lowFpsSec = 0;
      }
    }
  }

  function syncGoalPillTop() {
    var hudTop = document.getElementById('pl-hud-top');
    if (!hudTop || !goalPill) return;
    var btm = Math.ceil(hudTop.getBoundingClientRect().bottom);
    goalPill.style.top = (btm + 8) + 'px';
    if (emoteToast) emoteToast.style.top = (btm + 50) + 'px';
  }

  root.addEventListener('resize', function () {
    var asp = root.innerWidth / Math.max(1, root.innerHeight);
    camera.aspect = asp;
    camera.fov = calcPlanetFov(asp);
    camera.updateProjectionMatrix();
    renderer.setSize(root.innerWidth, root.innerHeight);
    syncGoalPillTop();
  });

  /* ---------- Bootstrap Sequence ---------- */
  function readPupilWornItems() {
    // Demo mode wears explorer hat + adventure backpack; real pupil session reads PupilAvatars.wearingOf(id)
    if (!IS_DEMO && root.PupilAvatars && typeof root.PupilAvatars.wearingOf === 'function') {
      try {
        var sid = root.Ch1Progress && root.Ch1Progress.getStudentId ? root.Ch1Progress.getStudentId() : null;
        if (sid) {
          var w = root.PupilAvatars.wearingOf(sid) || {};
          var list = Object.keys(w).map(function (k) { return w[k]; }).filter(Boolean);
          if (list.length) return list;
        }
      } catch (e) {}
    }
    return ['hat-explorer', 'bp-adv-bag'];
  }

  function boot() {
    syncGoalPillTop();
    loadTotal = 31; // 23 initial Batch D + 4 instanced nature + parrot + body + items
    var wearP = fetch('../assets/3d/items/wear3d.json?v=8').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });

    wearP.then(function (cfg) {
      WEAR3D_CFG = cfg || {};
      var worn = readPupilWornItems();
      return Promise.all([
        populateWorldModels(),
        makeKidAvatar({ girl: WANT_GIRL, team: 'blue', height: 1.78, items: worn }).then(function (av) {
          state.player = av;
          scene.add(av.root);
        })
      ]);
    }).then(function () {
      // Spawn 3 friendly roaming demo classmates sharing the already-loaded body GLB + team shirt colors!
      if (IS_DEMO) {
        planetAddVisitor('demo-mate-1', { lat:  12, lon:  26, girl: WANT_GIRL, team: 'pink',   items: ['hat-crown'],                  demoWander: true });
        planetAddVisitor('demo-mate-2', { lat: -10, lon: 112, girl: WANT_GIRL, team: 'yellow', items: ['hat-explorer', 'bp-adv-bag'], demoWander: true });
        planetAddVisitor('demo-mate-3', { lat:  10, lon: 256, girl: WANT_GIRL, team: 'green',  items: ['hat-crown', 'bp-adv-bag'],    demoWander: true });
      }
      refreshProgressUI();
      syncGoalPillTop();
      state.ready = true;
      if (IS_DEMO) {
        var qStop = parseInt(Q.get('stop'), 10);
        if (qStop >= 1 && qStop <= 5 && root.__planet) root.__planet.teleportToStop(qStop);
        if (Q.get('credits') === '1') {
          ensureChestOpen();
          setTimeout(function () { openRollingCredits(); }, 420);
        }
      }
      loadFill.style.width = '100%';
      loadPct.textContent = '100% · Ready to explore!';
      setTimeout(function () { loadEl.classList.add('hidden'); syncGoalPillTop(); }, 260);
    });

    animate();
  }

  // Expose QA inspection handle for automated screenshots & verification
  root.__planet = {
    getStats: function () {
      return {
        ready: state.ready,
        fps: curFps,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        stamps: getStampCount(),
        nextStop: getNextStopNum(),
        visitors: Object.keys(visitors).length
      };
    },
    teleportToStop: function (stopNum) {
      var idx = Math.max(0, Math.min(4, (Number(stopNum) || 1) - 1));
      var st = STOP_COORDS[idx];
      // Place slightly in front of stop ring so camera frames the character + building
      state.playerDir.copy(latLonToDir(st.lat - 3, st.lon - 6));
      var toS = st.dir.clone().sub(state.playerDir.clone().multiplyScalar(st.dir.dot(state.playerDir))).normalize();
      state.playerFwd.copy(toS);
      state.camFwd.copy(toS);
      state.camPos.set(0, 0, 0); // snap camera smoothly
      state.stopCooldown = 0;
    },
    showBubble: showStopBubble,
    openCredits: openRollingCredits,
    triggerFinale: triggerPlanetFinale,
    refresh: refreshProgressUI
  };

  boot();
})(window);
