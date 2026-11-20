// Island Tools — Tool 1: UFO Picker on Adventure Island (home3d)
// Follows island-work/ISLAND-TOOLS-PLAN.md & docs/STYLE_GUIDE.md
// Roster hook: Claude replaces window.IslandTools.getRoster() with the real class list.
(function () {
  'use strict';

  var HOST = null;
  var QS = new URLSearchParams(location.search);
  var TEST_MODE = QS.get('toolstest') === '1';

  // Amphitheatre & Pirate Ship anchor points (computed dynamically from scene on init)
  var AMP = { x: -15.4, y: 0.4, z: -4.6 };
  var SHIP_DECK = { x: 35.5, y: 1.5, z: 11.0 };

  // Picker state
  var pickerOpen = false;
  var trayOpen = false;
  var fairMode = true;
  var fastMode = false;
  var soundOn = true;
  var usedIds = {};          // fair-mode tracking
  var activePupil = null;    // currently chosen pupil entry
  var returningPupil = null; // pupil hopping back to seat
  var returnT = 0;

  // 5-second animation state
  // phases: 'idle' | 'flyin' | 'sweep' | 'lift' | 'carry' | 'land' | 'done'
  var anim = {
    active: false,
    phase: 'idle',
    t: 0,
    dur: 5.0,
    chosen: null,
    sweepIdx: -1,
    lastTick: 0,
    firedPhase: {}
  };

  // 3D objects
  var ufoGroup = null;
  var ufoLights = [];
  var beamGroup = null;
  var beamMesh = null;
  var beamMat = null;
  var beamSparkles = [];
  var seatGroup = null;
  var pupils = []; // { id, name, team, ch, root, seatPos, seatRotY, ring, ringMat, lit }
  var pupilsBuilt = false;
  var pupilsBuilding = false;
  var ufoLoaded = false;

  // DOM refs
  var domTopBtn = null;
  var domTray = null;
  var domPanel = null;
  var domBanner = null;
  var domLeftPill = null;
  var domPickBtn = null;
  var domBackBtn = null;
  var domSkipBtn = null;
  var domFairBtn = null;
  var domFastBtn = null;
  var domSoundBtn = null;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeOutCubic(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }

  // =========================================================================
  // 1. DEFAULT FAKE ROSTER (Claude replaces window.IslandTools.getRoster)
  // =========================================================================
  function defaultGetRoster() {
    var list = [];
    for (var i = 1; i <= 18; i++) {
      list.push({
        id: 'test-pupil-' + i,
        name: 'Pupil ' + i,
        team: (i - 1) % 4
      });
    }
    return list;
  }

  // =========================================================================
  // 2. PROCEDURAL WEB AUDIO SFX (whoosh, sci-fi hum, ticks, bloop, beam, ding+yay)
  // =========================================================================
  var SFX = (function () {
    var ctx = null, noiseBuf = null, humOsc1 = null, humOsc2 = null, humGain = null;

    function ensure() {
      if (!soundOn) return false;
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume().catch(function () {});
        return true;
      }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        ctx = new AC();
        var len = ctx.sampleRate * 2;
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = noiseBuf.getChannelData(0), b0 = 0, b1 = 0;
        for (var i = 0; i < len; i++) {
          var w = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + w * 0.05;
          b1 = 0.96 * b1 + w * 0.08;
          d[i] = (b0 + b1 + w * 0.02) * 0.7;
        }
        return true;
      } catch (e) { ctx = null; return false; }
    }

    function playWhoosh(dur) {
      if (!ensure() || !noiseBuf) return;
      var t = ctx.currentTime, d = dur || 0.75;
      var s = ctx.createBufferSource(); s.buffer = noiseBuf;
      var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(220, t);
      f.frequency.exponentialRampToValueAtTime(1400, t + d * 0.45);
      f.frequency.exponentialRampToValueAtTime(300, t + d);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.18, t + d * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(f); f.connect(g); g.connect(ctx.destination);
      s.start(t); s.stop(t + d + 0.05);
    }

    function startHum() {
      if (!ensure()) return;
      stopHum();
      var t = ctx.currentTime;
      humOsc1 = ctx.createOscillator(); humOsc2 = ctx.createOscillator();
      humOsc1.type = 'sine'; humOsc2.type = 'triangle';
      humOsc1.frequency.setValueAtTime(190, t);
      humOsc2.frequency.setValueAtTime(195, t);
      humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.0001, t);
      humGain.gain.linearRampToValueAtTime(0.055, t + 0.35);
      humOsc1.connect(humGain); humOsc2.connect(humGain); humGain.connect(ctx.destination);
      humOsc1.start(t); humOsc2.start(t);
    }

    function stopHum() {
      if (!ctx || !humGain) return;
      var t = ctx.currentTime;
      try {
        humGain.gain.cancelScheduledValues(t);
        humGain.gain.setTargetAtTime(0.0001, t, 0.12);
        var o1 = humOsc1, o2 = humOsc2;
        setTimeout(function () {
          try { if (o1) o1.stop(); if (o2) o2.stop(); } catch (e) {}
        }, 350);
      } catch (e) {}
      humOsc1 = null; humOsc2 = null; humGain = null;
    }

    function playTick(pitchMul) {
      if (!ensure()) return;
      var t = ctx.currentTime;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(520 * (pitchMul || 1), t);
      o.frequency.exponentialRampToValueAtTime(260, t + 0.055);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.11, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.07);
    }

    function playBloopAndBeam(dur) {
      if (!ensure()) return;
      var t = ctx.currentTime, d = dur || 0.75;
      // Bloop
      var b = ctx.createOscillator(), bg = ctx.createGain();
      b.type = 'sine';
      b.frequency.setValueAtTime(280, t);
      b.frequency.exponentialRampToValueAtTime(680, t + 0.14);
      bg.gain.setValueAtTime(0.001, t);
      bg.gain.linearRampToValueAtTime(0.16, t + 0.02);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      b.connect(bg); bg.connect(ctx.destination);
      b.start(t); b.stop(t + 0.2);

      // Rising shimmer beam tone
      var r1 = ctx.createOscillator(), r2 = ctx.createOscillator(), rg = ctx.createGain();
      r1.type = 'sine'; r2.type = 'triangle';
      r1.frequency.setValueAtTime(340, t + 0.08);
      r1.frequency.exponentialRampToValueAtTime(880, t + d);
      r2.frequency.setValueAtTime(510, t + 0.08);
      r2.frequency.exponentialRampToValueAtTime(1320, t + d);
      rg.gain.setValueAtTime(0.001, t + 0.08);
      rg.gain.linearRampToValueAtTime(0.09, t + 0.2);
      rg.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.08);
      r1.connect(rg); r2.connect(rg); rg.connect(ctx.destination);
      r1.start(t + 0.08); r2.start(t + 0.08);
      r1.stop(t + d + 0.1); r2.stop(t + d + 0.1);
    }

    function playLandYay() {
      if (!ensure()) return;
      var t = ctx.currentTime;
      // Bright C-major pentatonic ding chord
      [523.25, 659.25, 783.99, 1046.5].forEach(function (freq, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle';
        var st = t + i * 0.075;
        o.frequency.setValueAtTime(freq, st);
        g.gain.setValueAtTime(0.001, st);
        g.gain.linearRampToValueAtTime(0.13, st + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.65);
        o.connect(g); g.connect(ctx.destination);
        o.start(st); o.stop(st + 0.7);
      });
      // Warm crowd cheer swell
      if (noiseBuf) {
        var s = ctx.createBufferSource(); s.buffer = noiseBuf;
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 1.1;
        var g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.001, t + 0.1);
        g2.gain.linearRampToValueAtTime(0.15, t + 0.35);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
        s.connect(f); f.connect(g2); g2.connect(ctx.destination);
        s.start(t + 0.1); s.stop(t + 1.4);
      }
    }

    return {
      playWhoosh: playWhoosh, startHum: startHum, stopHum: stopHum,
      playTick: playTick, playBloopAndBeam: playBloopAndBeam, playLandYay: playLandYay
    };
  })();

  // =========================================================================
  // 3. 3D ASSETS: UFO MODEL (Tripo GLB + Cute Fallback) & TRACTOR BEAM
  // =========================================================================
  function makeBeamTexture() {
    var cv = document.createElement('canvas');
    cv.width = 128; cv.height = 256;
    var g = cv.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0.0, 'rgba(130, 245, 255, 0.85)');
    gr.addColorStop(0.45, 'rgba(120, 235, 255, 0.42)');
    gr.addColorStop(0.85, 'rgba(255, 245, 165, 0.18)');
    gr.addColorStop(1.0, 'rgba(255, 245, 165, 0.0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 256);
    var tex = new HOST.T3.CanvasTexture(cv);
    tex.colorSpace = HOST.T3.SRGBColorSpace;
    return tex;
  }

  function buildFallbackUFO() {
    var T3 = HOST.T3;
    var g = new T3.Group();
    // Bright cartoon saucer body (lilac + cream + teal glass dome)
    var body = new T3.Mesh(
      new T3.SphereGeometry(2.5, 24, 14),
      new T3.MeshStandardMaterial({ color: 0x9b7bff, roughness: 0.32, metalness: 0.12 })
    );
    body.scale.set(1, 0.34, 1);
    body.castShadow = true;
    g.add(body);

    var rim = new T3.Mesh(
      new T3.TorusGeometry(2.42, 0.24, 12, 28),
      new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: 0.35 })
    );
    rim.rotation.x = Math.PI * 0.5;
    g.add(rim);

    var dome = new T3.Mesh(
      new T3.SphereGeometry(1.38, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new T3.MeshStandardMaterial({ color: 0x9be8ff, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.78 })
    );
    dome.position.y = 0.48;
    g.add(dome);

    var under = new T3.Mesh(
      new T3.CylinderGeometry(0.9, 1.15, 0.35, 18),
      new T3.MeshBasicMaterial({ color: 0x7df5ff })
    );
    under.position.y = -0.68;
    g.add(under);
    return g;
  }

  function buildUFOAndBeam() {
    var T3 = HOST.T3, scene = HOST.scene;
    ufoGroup = new T3.Group();
    ufoGroup.visible = false;
    scene.add(ufoGroup);

    var bodyHolder = new T3.Group();
    ufoGroup.add(bodyHolder);
    bodyHolder.add(buildFallbackUFO());

    // Try loading Tripo UFO GLB (replaces fallback seamlessly if present)
    HOST.K.tryGLB('tools/models/ufo.glb').then(function (gltf) {
      if (!gltf || !gltf.scene) return;
      var fitted = HOST.K.fitModel(gltf.scene, 5.4, { byLength: true });
      var box = new T3.Box3().setFromObject(fitted);
      var c = box.getCenter(new T3.Vector3());
      fitted.position.sub(c);
      fitted.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = true;
          if (o.material) [].concat(o.material).forEach(function (m) { m.envMapIntensity = 0.4; });
        }
      });
      while (bodyHolder.children.length) bodyHolder.remove(bodyHolder.children[0]);
      bodyHolder.add(fitted);
      ufoLoaded = true;
    }).catch(function () {});

    // 8 Blinking team-coloured lights around the saucer rim
    var lCols = [0xff5fa2, 0x4f9dff, 0xffd84a, 0x2fc58a];
    for (var i = 0; i < 8; i++) {
      var ang = (i / 8) * Math.PI * 2;
      var lm = new T3.MeshBasicMaterial({ color: lCols[i % 4] });
      var lb = new T3.Mesh(new T3.SphereGeometry(0.24, 10, 8), lm);
      lb.position.set(Math.cos(ang) * 2.55, -0.05, Math.sin(ang) * 2.55);
      ufoGroup.add(lb);
      ufoLights.push({ mesh: lb, mat: lm, baseHex: lCols[i % 4], idx: i });
    }

    // Transparent additive tractor / searchlight beam cone
    beamGroup = new T3.Group();
    beamGroup.position.set(0, -0.5, 0);
    ufoGroup.add(beamGroup);

    var coneGeo = new T3.ConeGeometry(3.1, 14.5, 24, 1, true);
    coneGeo.translate(0, -7.25, 0);
    beamMat = new T3.MeshBasicMaterial({
      map: makeBeamTexture(),
      color: 0x8ef7ff,
      transparent: true,
      opacity: 0,
      side: T3.DoubleSide,
      depthWrite: false,
      blending: T3.AdditiveBlending
    });
    beamMesh = new T3.Mesh(coneGeo, beamMat);
    beamGroup.add(beamMesh);
    beamGroup.visible = false;

    // 16 Rising sparkles inside the beam
    var sCols = [0xffffff, 0xffd84a, 0x8ef7ff, 0xff5fa2];
    for (var si = 0; si < 16; si++) {
      var sm = new T3.MeshBasicMaterial({ color: sCols[si % 4], transparent: true, opacity: 0.9 });
      var sp = new T3.Mesh(new T3.OctahedronGeometry(0.22, 0), sm);
      beamGroup.add(sp);
      beamSparkles.push({
        mesh: sp,
        ang: (si / 16) * Math.PI * 2,
        rad: 0.5 + (si % 4) * 0.45,
        yFrac: si / 16,
        spd: 0.55 + (si % 3) * 0.2
      });
    }
  }

  // =========================================================================
  // 4. AMPHITHEATRE PUPILS (18 small 3D kids from IslandTools.getRoster)
  // =========================================================================
  function ensurePupils() {
    if (pupilsBuilt) return Promise.resolve();
    if (pupilsBuilding) {
      return new Promise(function (res) {
        var iv = setInterval(function () { if (pupilsBuilt) { clearInterval(iv); res(); } }, 80);
      });
    }
    pupilsBuilding = true;
    var T3 = HOST.T3, K = HOST.K;
    var roster = window.IslandTools.getRoster() || defaultGetRoster();
    seatGroup = new T3.Group();
    HOST.scene.add(seatGroup);

    // Arrange pupils in 2 semicircular rows inside the amphitheatre facing the camera (+Z)
    // Raycast straight down onto the amphitheatre mesh so feet land right on the stone seats/stage!
    var boardPlace = HOST.places.filter(function (p) { return p.id === 'board'; })[0];
    var ampRay = new T3.Raycaster();
    var downVec = new T3.Vector3(0, -1, 0);
    function ampSurfaceY(x, z, fallbackY) {
      if (boardPlace && boardPlace.group) {
        ampRay.set(new T3.Vector3(x, 22, z), downVec);
        var hits = ampRay.intersectObject(boardPlace.group, true);
        if (hits.length) return hits[0].point.y + 0.04;
      }
      return fallbackY;
    }

    var jobs = roster.map(function (entry, idx) {
      var tIdx = (entry.team != null ? entry.team : idx) % 4;
      var team = K.TEAMS[tIdx] || K.TEAMS[0];
      return K.makeCharacter(team, { kidsOnly: true, kidHeight: 2.15 }).then(function (ch) {
        var row = idx < 9 ? 0 : 1;
        var countInRow = row === 0 ? Math.min(9, roster.length) : Math.max(1, roster.length - 9);
        var posInRow = row === 0 ? idx : (idx - 9);
        var frac = countInRow > 1 ? (posInRow / (countInRow - 1)) : 0.5;
        // Semicircle on the stone steps/bleachers of the amphitheatre
        var ang = lerp(-Math.PI * 0.90, -Math.PI * 0.10, frac);
        var rad = row === 0 ? 4.35 : 6.15;
        var sx = AMP.x + Math.cos(ang) * rad;
        var sz = AMP.z + Math.sin(ang) * rad;
        var sy = ampSurfaceY(sx, sz, AMP.y + (row === 0 ? 2.1 : 3.6));

        var holder = new T3.Group();
        holder.position.set(sx, sy, sz);
        var faceRot = Math.atan2(AMP.x - sx, (AMP.z + 2.5) - sz);
        holder.rotation.y = faceRot;

        ch.root.traverse(function (o) {
          if (o.isMesh && o.material) [].concat(o.material).forEach(function (m) { m.envMapIntensity = 0.25; });
        });
        ch.setState('idle');
        holder.add(ch.root);

        // Team-coloured highlight ring beneath each pupil
        var rMat = new T3.MeshBasicMaterial({
          color: team.hex, transparent: true, opacity: 0.42,
          side: T3.DoubleSide, depthWrite: false
        });
        var ring = new T3.Mesh(new T3.RingGeometry(0.42, 0.72, 20), rMat);
        ring.rotation.x = -Math.PI * 0.5;
        ring.position.y = 0.08;
        holder.add(ring);

        seatGroup.add(holder);
        return {
          id: entry.id || ('p-' + idx),
          name: entry.name || ('Pupil ' + (idx + 1)),
          team: tIdx,
          teamObj: team,
          ch: ch,
          root: holder,
          seatPos: new T3.Vector3(sx, sy, sz),
          seatRotY: faceRot,
          ring: ring,
          ringMat: rMat,
          lit: 0
        };
      });
    });

    return Promise.all(jobs).then(function (list) {
      pupils = list;
      pupilsBuilt = true;
      pupilsBuilding = false;
      updatePanelUI();
    });
  }

  // =========================================================================
  // 5. 5-SECOND UFO PICKER CHOREOGRAPHY
  // =========================================================================
  function getEligiblePupils() {
    if (!fairMode) return pupils.slice();
    var left = pupils.filter(function (p) { return !usedIds[p.id]; });
    if (!left.length && pupils.length) {
      usedIds = {};
      left = pupils.slice();
    }
    return left;
  }

  function startPick(skipPrevious) {
    ensurePupils().then(function () {
      if (!pupils.length) return;
      if (skipPrevious && activePupil) {
        // Put the skipped pupil back into the fair pool & return them to seat
        delete usedIds[activePupil.id];
        sendPupilBack(activePupil, true);
      } else if (activePupil) {
        sendPupilBack(activePupil, true);
      }

      var pool = getEligiblePupils();
      if (!pool.length) return;
      var chosen = pool[Math.floor(Math.random() * pool.length)];
      if (fairMode) usedIds[chosen.id] = true;

      activePupil = chosen;
      hideBanner();

      anim.active = true;
      anim.phase = 'flyin';
      anim.t = 0;
      anim.dur = fastMode ? 1.5 : 5.0;
      anim.chosen = chosen;
      anim.sweepIdx = -1;
      anim.lastTick = 0;
      anim.firedPhase = {};

      ufoGroup.visible = true;
      beamGroup.visible = false;
      HOST.K.cam.follow = null;
      SFX.playWhoosh(0.85);
      SFX.startHum();
      updatePanelUI();
    });
  }

  function sendPupilBack(p, instant) {
    if (!p) return;
    hideBanner();
    if (instant) {
      p.root.position.copy(p.seatPos);
      p.root.rotation.set(0, p.seatRotY, 0);
      p.ch.setState('idle');
      if (activePupil === p) activePupil = null;
      return;
    }
    returningPupil = { p: p, from: p.root.position.clone() };
    returnT = 0;
    p.ch.setState('hop');
    SFX.playTick(1.2);
    if (activePupil === p) activePupil = null;
    // Ease camera gently back to amphitheatre overview
    HOST.K.cam.follow = null;
    HOST.K.cam.set(
      new HOST.T3.Vector3(AMP.x + 12, 16, AMP.z + 24),
      new HOST.T3.Vector3(AMP.x, 2.5, AMP.z),
      2.6
    );
    updatePanelUI();
  }

  function showBanner(pupil) {
    if (!domBanner || !pupil) return;
    domBanner.style.setProperty('--tc', pupil.teamObj.c);
    domBanner.textContent = '🛸 Your turn, ' + pupil.name + '!';
    domBanner.classList.remove('hidden');
  }
  function hideBanner() {
    if (domBanner) domBanner.classList.add('hidden');
  }

  function updateUFOAnimation(dt, nowT) {
    // Update pupil animations
    for (var pi = 0; pi < pupils.length; pi++) {
      var p = pupils[pi];
      if (p.ch) p.ch.update(dt);
      if (p.lit > 0) {
        p.lit = Math.max(0, p.lit - dt * 2.4);
        var s = 1 + p.lit * 0.55;
        p.ring.scale.set(s, s, 1);
        p.ringMat.opacity = 0.42 + p.lit * 0.55;
      }
    }

    // Returning pupil hop-back arc
    if (returningPupil) {
      returnT += dt * 1.4;
      var rk = clamp(returnT, 0, 1);
      var rp = returningPupil.p;
      rp.root.position.lerpVectors(returningPupil.from, rp.seatPos, easeInOut(rk));
      rp.root.position.y += Math.sin(rk * Math.PI) * 5.0;
      rp.root.rotation.y = lerp(rp.root.rotation.y, rp.seatRotY, clamp(dt * 6, 0, 1));
      if (rk >= 1) {
        rp.root.position.copy(rp.seatPos);
        rp.root.rotation.set(0, rp.seatRotY, 0);
        rp.ch.setState('idle');
        returningPupil = null;
      }
    }

    // Blinking UFO lights & rising beam sparkles
    if (ufoGroup && ufoGroup.visible) {
      ufoLights.forEach(function (l) {
        var on = ((Math.floor(nowT * 9) + l.idx) % 2) === 0;
        l.mat.color.setHex(on ? 0xffffff : l.baseHex);
        l.mesh.scale.setScalar(on ? 1.2 : 0.85);
      });
    }
    if (beamGroup && beamGroup.visible) {
      beamSparkles.forEach(function (sp) {
        sp.yFrac = (sp.yFrac + dt * sp.spd) % 1;
        var y = -13.5 * (1 - sp.yFrac);
        var a = sp.ang + nowT * 2.6;
        var r = sp.rad * (1.2 - sp.yFrac * 0.6);
        sp.mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        sp.mesh.rotation.y += dt * 5;
      });
    }

    if (!anim.active || !anim.chosen) return;

    anim.t += dt;
    // Normalized 0..5 timeline (scales cleanly for Fast mode 1.5s)
    var sT = (anim.t / anim.dur) * 5.0;
    var T3 = HOST.T3, K = HOST.K;
    var chosen = anim.chosen;
    var hoverPos = new T3.Vector3(AMP.x, 14.5, AMP.z);
    var shipHover = new T3.Vector3(SHIP_DECK.x, SHIP_DECK.y + 11.5, SHIP_DECK.z);

    // ---- Stage 1: 0.0 - 1.0s Fly-in ----
    if (sT < 1.0) {
      anim.phase = 'flyin';
      var k1 = easeOutCubic(sT / 1.0);
      var startPos = new T3.Vector3(-56, 26, -34);
      ufoGroup.position.lerpVectors(startPos, hoverPos, k1);
      // Swoop low over the sea mid-flight
      ufoGroup.position.y -= Math.sin(k1 * Math.PI) * 7.5;
      ufoGroup.rotation.z = Math.sin(k1 * Math.PI) * 0.28;
      ufoGroup.rotation.y = nowT * 1.4;
      beamGroup.visible = false;

      K.cam.set(
        new T3.Vector3(lerp(0, AMP.x + 15, k1), lerp(36, 17, k1), lerp(52, AMP.z + 25, k1)),
        ufoGroup.position.clone().lerp(new T3.Vector3(AMP.x, 2, AMP.z), 0.5),
        4.0
      );
    }
    // ---- Stage 2: 1.0 - 2.2s Searchlight Sweep ----
    else if (sT < 2.2) {
      anim.phase = 'sweep';
      var k2 = (sT - 1.0) / 1.2;
      ufoGroup.position.copy(hoverPos);
      ufoGroup.position.y += Math.sin(nowT * 4.5) * 0.35;
      ufoGroup.rotation.z = Math.sin(nowT * 3) * 0.06;
      ufoGroup.rotation.y = nowT * 1.8;

      beamGroup.visible = true;
      beamMat.opacity = 0.72;
      beamMat.color.setHex(0x8ef7ff);

      // Sweep searchlight beam across the seated pupils
      var sweepIdx = Math.floor(k2 * pupils.length * 1.35) % pupils.length;
      var targetP = pupils[sweepIdx];
      if (targetP) {
        var dir = targetP.seatPos.clone().sub(ufoGroup.position);
        beamGroup.rotation.z = clamp(dir.x * 0.045, -0.45, 0.45);
        beamGroup.rotation.x = clamp(-dir.z * 0.045, -0.45, 0.45);
        if (sweepIdx !== anim.sweepIdx) {
          anim.sweepIdx = sweepIdx;
          targetP.lit = 1.0;
          targetP.ch.setState('hop');
          setTimeout(function () { if (anim.phase === 'sweep' && targetP !== chosen) targetP.ch.setState('idle'); }, 300);
          if (nowT - anim.lastTick > 0.09) {
            anim.lastTick = nowT;
            SFX.playTick(0.85 + k2 * 0.55);
          }
        }
      }

      K.cam.set(
        new T3.Vector3(AMP.x + 11, 15.5, AMP.z + 22),
        new T3.Vector3(AMP.x, 3.5, AMP.z),
        3.2
      );
    }
    // ---- Stage 3: 2.2 - 3.0s Beam Lock & Lift ----
    else if (sT < 3.0) {
      anim.phase = 'lift';
      if (!anim.firedPhase.lift) {
        anim.firedPhase.lift = true;
        SFX.playBloopAndBeam(fastMode ? 0.3 : 0.75);
        // Other pupils cheer & wave!
        pupils.forEach(function (op) {
          if (op !== chosen) op.ch.setState(Math.random() < 0.5 ? 'cheer' : 'wave');
        });
        chosen.ch.setState('cheer');
      }
      var k3 = easeInOut((sT - 2.2) / 0.8);
      var lockUfo = new T3.Vector3(chosen.seatPos.x, 14.0, chosen.seatPos.z);
      ufoGroup.position.lerp(lockUfo, clamp(dt * 8, 0, 1));
      ufoGroup.rotation.z = 0;
      ufoGroup.rotation.y = nowT * 2.2;

      beamGroup.visible = true;
      beamGroup.rotation.set(0, 0, 0);
      beamMat.opacity = 0.92;
      beamMat.color.setHex(0xffe875);

      // Float chosen pupil up spinning slowly in the beam
      chosen.lit = 1.0;
      chosen.root.position.set(
        chosen.seatPos.x,
        lerp(chosen.seatPos.y, ufoGroup.position.y - 4.2, k3),
        chosen.seatPos.z
      );
      chosen.root.rotation.y = chosen.seatRotY + k3 * Math.PI * 3.0;

      K.cam.set(
        new T3.Vector3(chosen.seatPos.x + 9, 12.5, chosen.seatPos.z + 18),
        chosen.root.position.clone().add(new T3.Vector3(0, 1.5, 0)),
        4.2
      );
    }
    // ---- Stage 4: 3.0 - 4.2s Carry across Island to Pirate Ship ----
    else if (sT < 4.2) {
      anim.phase = 'carry';
      if (!anim.firedPhase.carry) {
        anim.firedPhase.carry = true;
        SFX.playWhoosh(fastMode ? 0.35 : 0.95);
        pupils.forEach(function (op) { if (op !== chosen) op.ch.setState('idle'); });
      }
      var k4 = easeInOut((sT - 3.0) / 1.2);
      var startCarry = new T3.Vector3(chosen.seatPos.x, 14.0, chosen.seatPos.z);
      ufoGroup.position.lerpVectors(startCarry, shipHover, k4);
      ufoGroup.position.y += Math.sin(k4 * Math.PI) * 5.2;
      ufoGroup.rotation.z = -Math.sin(k4 * Math.PI) * 0.2;
      ufoGroup.rotation.y = nowT * 2.0;

      beamGroup.visible = true;
      beamGroup.rotation.set(0, 0, 0);
      beamMat.opacity = 0.85;
      beamMat.color.setHex(0x8ef7ff);

      // Pupil hangs in the beam and lowers gently onto the deck at the end of carry
      var hangDrop = k4 < 0.72 ? 4.2 : lerp(4.2, shipHover.y - SHIP_DECK.y, (k4 - 0.72) / 0.28);
      chosen.root.position.set(ufoGroup.position.x, ufoGroup.position.y - hangDrop, ufoGroup.position.z);
      chosen.root.rotation.y = nowT * 3.0;

      K.cam.set(
        new T3.Vector3(ufoGroup.position.x - 10, 14.5, ufoGroup.position.z + 24),
        chosen.root.position.clone().add(new T3.Vector3(0, 1.2, 0)),
        3.6
      );
    }
    // ---- Stage 5: 4.2 - 5.0s Land on Pirate Ship, Banner, Confetti, UFO Zooms Away ----
    else if (sT < 5.0) {
      anim.phase = 'land';
      var k5 = (sT - 4.2) / 0.8;
      if (!anim.firedPhase.land) {
        anim.firedPhase.land = true;
        SFX.stopHum();
        SFX.playLandYay();
        showBanner(chosen);
        if (soundOn && HOST.K.say) HOST.K.say('Your turn, ' + chosen.name + '!');
        chosen.ch.setState('cheer');
        if (HOST.K.fx && HOST.K.fx.confetti) {
          HOST.K.fx.confetti(new T3.Vector3(SHIP_DECK.x, SHIP_DECK.y + 3.5, SHIP_DECK.z), 120);
        }
      }
      // Happy landing hop on pirate ship deck
      var hopY = k5 < 0.45 ? Math.sin((k5 / 0.45) * Math.PI) * 1.4 : 0;
      chosen.root.position.set(SHIP_DECK.x, SHIP_DECK.y + hopY, SHIP_DECK.z);
      chosen.root.rotation.y = -0.45;

      // Beam off & UFO zooms away into the sky
      beamGroup.visible = false;
      var flyOut = new T3.Vector3(SHIP_DECK.x + 42, 46, SHIP_DECK.z - 38);
      ufoGroup.position.lerpVectors(shipHover, flyOut, easeInOut(k5));
      ufoGroup.rotation.z = -0.35;

      K.cam.set(
        new T3.Vector3(SHIP_DECK.x - 12, SHIP_DECK.y + 8.5, SHIP_DECK.z + 18),
        new T3.Vector3(SHIP_DECK.x, SHIP_DECK.y + 1.8, SHIP_DECK.z),
        3.5
      );
    }
    // ---- Done ----
    else {
      anim.active = false;
      anim.phase = 'done';
      ufoGroup.visible = false;
      beamGroup.visible = false;
      chosen.root.position.set(SHIP_DECK.x, SHIP_DECK.y, SHIP_DECK.z);
      updatePanelUI();
    }
  }

  // Test helper: jump straight to a specific stage for screenshot verification (?toolstest=1)
  function seekStage(stageName) {
    return ensurePupils().then(function () {
      if (!pupils.length) return;
      if (!anim.chosen) {
        anim.chosen = pupils[4] || pupils[0];
        activePupil = anim.chosen;
      }
      anim.active = true;
      anim.dur = 5.0;
      anim.firedPhase = {};
      ufoGroup.visible = true;
      hideBanner();

      var stageTimes = { flyin: 0.58, sweep: 1.65, lift: 2.65, carry: 3.92, land: 4.55 };
      anim.t = stageTimes[stageName] != null ? stageTimes[stageName] : 0.5;
      HOST.K.cam.follow = null;
      // Run one update step & snap camera immediately
      updateUFOAnimation(0.016, anim.t);
      if (HOST.K.cam && HOST.K.cam.snap) HOST.K.cam.snap();
      // Pause animation at this exact visual frame for crisp screenshot
      anim.active = false;
      SFX.stopHum();
      updatePanelUI();
    });
  }

  // =========================================================================
  // 6. TEACHER UI: 🧰 BUTTON, TRAY, UFO PICKER PANEL & ?toolstest=1 BAR
  // =========================================================================
  function updatePanelUI() {
    if (domTopBtn) domTopBtn.classList.toggle('on', trayOpen || pickerOpen);
    if (domLeftPill) {
      var left = pupils.filter(function (p) { return !usedIds[p.id]; }).length;
      var total = pupils.length || (window.IslandTools.getRoster() || []).length;
      domLeftPill.textContent = fairMode ? (left + ' of ' + total + ' left') : 'Random mode';
    }
    if (domFairBtn) {
      domFairBtn.classList.toggle('on', fairMode);
      domFairBtn.textContent = fairMode ? '⚖️ Fair: ON' : '🎲 Fair: OFF';
    }
    if (domFastBtn) {
      domFastBtn.classList.toggle('on', fastMode);
      domFastBtn.textContent = fastMode ? '⚡ Fast (1.5s)' : '🐢 Normal (5s)';
    }
    if (domSoundBtn) {
      domSoundBtn.classList.toggle('on', soundOn);
      domSoundBtn.textContent = soundOn ? '🔊 Sound' : '🔇 Muted';
    }
    if (domPickBtn) domPickBtn.disabled = anim.active;
    if (domBackBtn) domBackBtn.disabled = !activePupil || anim.active;
    if (domSkipBtn) domSkipBtn.disabled = !activePupil || anim.active;
  }

  function openTray() {
    trayOpen = true;
    if (domTray) domTray.classList.remove('hidden');
    updatePanelUI();
  }
  function closeTray() {
    trayOpen = false;
    if (domTray) domTray.classList.add('hidden');
    updatePanelUI();
  }
  function toggleTray() { if (trayOpen) closeTray(); else openTray(); }

  function openPicker() {
    closeTray();
    pickerOpen = true;
    if (domPanel) domPanel.classList.remove('hidden');
    ensurePupils().then(function () {
      if (seatGroup) seatGroup.visible = true;
      HOST.K.cam.follow = null;
      HOST.K.cam.set(
        new HOST.T3.Vector3(AMP.x + 12, 16, AMP.z + 24),
        new HOST.T3.Vector3(AMP.x, 2.5, AMP.z),
        2.6
      );
      updatePanelUI();
    });
  }

  function closePicker() {
    pickerOpen = false;
    anim.active = false;
    SFX.stopHum();
    hideBanner();
    if (ufoGroup) ufoGroup.visible = false;
    if (beamGroup) beamGroup.visible = false;
    if (activePupil) sendPupilBack(activePupil, true);
    if (seatGroup) seatGroup.visible = false;
    if (domPanel) domPanel.classList.add('hidden');
    if (HOST.home) HOST.home();
    updatePanelUI();
  }

  function resetRound() {
    usedIds = {};
    if (activePupil) sendPupilBack(activePupil, false);
    updatePanelUI();
  }

  function buildUI() {
    // 1. Round 🧰 button next to ⚙️ in .topbtns
    var topbtns = document.querySelector('.topbtns');
    if (topbtns) {
      domTopBtn = document.createElement('button');
      domTopBtn.type = 'button';
      domTopBtn.className = 'it-top-btn';
      domTopBtn.textContent = '🧰';
      domTopBtn.title = 'Island Tools (P = UFO Picker)';
      domTopBtn.onclick = toggleTray;
      topbtns.appendChild(domTopBtn);
    }

    // 2. Tools Tray (Tool 1 UFO Picker + GO Tools 2-9 populated by tools-pack.js)
    domTray = document.createElement('div');
    domTray.className = 'it-tray hidden';
    domTray.innerHTML =
      '<div class="it-head"><h3>🧰 Island Tools</h3><button type="button" class="it-close" aria-label="Close">✕</button></div>' +
      '<div class="it-tool-list" id="itToolList">' +
        '<button type="button" class="it-tool-btn" id="itOpenUfo"><span>🛸 UFO Picker</span><span class="it-kbd">P</span></button>' +
      '</div>';
    document.body.appendChild(domTray);
    domTray.querySelector('.it-close').onclick = closeTray;
    domTray.querySelector('#itOpenUfo').onclick = openPicker;

    // 3. UFO Picker Panel
    domPanel = document.createElement('div');
    domPanel.className = 'it-ufo-panel hidden';
    domPanel.innerHTML =
      '<div class="it-ufo-row">' +
        '<div class="it-ufo-title"><span>🛸 UFO Picker</span><span class="it-left-pill" id="itLeftPill">18 left</span></div>' +
        '<button type="button" class="it-close" id="itClosePicker" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="it-ufo-row">' +
        '<button type="button" class="it-btn pick" id="itPickBtn">🛸 Pick (P / Space)</button>' +
        '<button type="button" class="it-btn back" id="itBackBtn">↩️ Back</button>' +
        '<button type="button" class="it-btn skip" id="itSkipBtn">⏭️ Skip</button>' +
        '<button type="button" class="it-btn" id="itResetBtn">🔄 Reset</button>' +
        '<button type="button" class="it-btn toggle on" id="itFairBtn">⚖️ Fair: ON</button>' +
        '<button type="button" class="it-btn toggle" id="itFastBtn">🐢 Normal (5s)</button>' +
        '<button type="button" class="it-btn toggle on" id="itSoundBtn">🔊 Sound</button>' +
      '</div>';
    document.body.appendChild(domPanel);

    domLeftPill = domPanel.querySelector('#itLeftPill');
    domPickBtn = domPanel.querySelector('#itPickBtn');
    domBackBtn = domPanel.querySelector('#itBackBtn');
    domSkipBtn = domPanel.querySelector('#itSkipBtn');
    domFairBtn = domPanel.querySelector('#itFairBtn');
    domFastBtn = domPanel.querySelector('#itFastBtn');
    domSoundBtn = domPanel.querySelector('#itSoundBtn');

    domPanel.querySelector('#itClosePicker').onclick = closePicker;
    domPickBtn.onclick = function () { startPick(false); };
    domBackBtn.onclick = function () { if (activePupil) sendPupilBack(activePupil, false); };
    domSkipBtn.onclick = function () { startPick(true); };
    domPanel.querySelector('#itResetBtn').onclick = resetRound;
    domFairBtn.onclick = function () { fairMode = !fairMode; updatePanelUI(); };
    domFastBtn.onclick = function () { fastMode = !fastMode; updatePanelUI(); };
    domSoundBtn.onclick = function () { soundOn = !soundOn; if (!soundOn) SFX.stopHum(); updatePanelUI(); };

    // 4. Winner Banner
    domBanner = document.createElement('div');
    domBanner.className = 'it-banner hidden';
    document.body.appendChild(domBanner);

    // 5. Keyboard shortcuts: P = UFO Picker / Pick, Space = Pick when open
    window.addEventListener('keydown', function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (!pickerOpen) openPicker();
        else if (!anim.active) startPick(false);
      } else if (e.code === 'Space' && pickerOpen) {
        e.preventDefault();
        if (!anim.active) startPick(false);
      } else if (e.key === 'Escape' && (pickerOpen || trayOpen)) {
        if (pickerOpen) closePicker(); else closeTray();
      }
    });

    // 6. ?toolstest=1 Stage Bar
    if (TEST_MODE) {
      var tb = document.createElement('div');
      tb.className = 'it-testbar';
      tb.innerHTML =
        '<span>🛸 Test:</span>' +
        '<button type="button" data-s="flyin">Fly-in</button>' +
        '<button type="button" data-s="sweep">Beam sweep</button>' +
        '<button type="button" data-s="lift">Pupil lifted</button>' +
        '<button type="button" data-s="carry">Over ship</button>' +
        '<button type="button" data-s="land">Banner</button>';
      document.body.appendChild(tb);
      tb.querySelectorAll('button').forEach(function (b) {
        b.onclick = function () {
          if (!pickerOpen) openPicker();
          seekStage(b.getAttribute('data-s'));
        };
      });
    }

    updatePanelUI();
  }

  // =========================================================================
  // 7. PUBLIC API (window.IslandTools)
  // =========================================================================
  var extraToolClosers = [];
  function closeOtherTools(exceptId) {
    if (exceptId !== 'ufo' && pickerOpen) closePicker();
    extraToolClosers.forEach(function (fn) { try { fn(exceptId); } catch (e) {} });
  }

  window.IslandTools = {
    getRoster: defaultGetRoster,
    getStars: function () {
      var r = window.IslandTools.getRoster() || defaultGetRoster();
      return [r[0], r[1] || r[0]];
    },
    openTray: openTray,
    closeTray: closeTray,
    openPicker: function () { closeOtherTools('ufo'); openPicker(); },
    closePicker: closePicker,
    pick: function () { startPick(false); },
    skip: function () { startPick(true); },
    back: function () { if (activePupil) sendPupilBack(activePupil, false); },
    resetRound: resetRound,
    setFastMode: function (v) { fastMode = !!v; updatePanelUI(); },
    setFairMode: function (v) { fairMode = !!v; updatePanelUI(); },
    seekStage: seekStage,
    getState: function () {
      return {
        pickerOpen: pickerOpen,
        phase: anim.phase,
        active: anim.active,
        ufoLoaded: ufoLoaded,
        pupilsCount: pupils.length,
        chosen: anim.chosen ? anim.chosen.name : null,
        fairLeft: pupils.filter(function (p) { return !usedIds[p.id]; }).length
      };
    },
    _bridge: {
      TEST_MODE: TEST_MODE,
      getHost: function () { return HOST; },
      getAMP: function () { return AMP; },
      getShipDeck: function () { return SHIP_DECK; },
      ensurePupils: ensurePupils,
      getPupils: function () { return pupils; },
      getSeatGroup: function () { return seatGroup; },
      showBannerText: function (text, color) {
        if (!domBanner) return;
        domBanner.style.setProperty('--tc', color || '#ff5fa2');
        domBanner.textContent = text;
        domBanner.classList.remove('hidden');
      },
      hideBanner: hideBanner,
      closeTray: closeTray,
      closeOtherTools: closeOtherTools,
      registerCloser: function (fn) { extraToolClosers.push(fn); },
      addTrayButton: function (id, label, kbd, onClick) {
        var list = document.getElementById('itToolList');
        if (!list) return null;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'it-tool-btn';
        b.id = id;
        b.innerHTML = '<span>' + label + '</span>' + (kbd ? ('<span class="it-kbd">' + kbd + '</span>') : '');
        b.onclick = function () { closeTray(); onClick(); };
        list.appendChild(b);
        return b;
      }
    }
  };

  // =========================================================================
  // 8. INIT ON home3d:ready
  // =========================================================================
  function init() {
    HOST = window.__home3dQuietHost;
    if (!HOST) return;

    // Resolve Amphitheatre ('board') and Pirate Ship deck positions from the live scene
    var board = HOST.places.filter(function (p) { return p.id === 'board'; })[0];
    if (board && board.box) {
      var bCenter = board.box.getCenter(new HOST.T3.Vector3());
      AMP.x = bCenter.x;
      AMP.z = bCenter.z;
      AMP.y = HOST.groundAt(AMP.x, AMP.z);
      if (AMP.y === null || isNaN(AMP.y)) AMP.y = 0.2;
    }
    if (HOST.ship) {
      var sBox = new HOST.T3.Box3().setFromObject(HOST.ship);
      var sCenter = sBox.getCenter(new HOST.T3.Vector3());
      // Place landing spot on the open front deck (clear of the mast & sail)
      SHIP_DECK.x = sCenter.x - 1.7;
      SHIP_DECK.z = sCenter.z + 1.5;
      SHIP_DECK.y = Math.max(0.6, sBox.min.y + (sBox.max.y - sBox.min.y) * 0.28);
    } else if (HOST.DOCK) {
      SHIP_DECK.x = HOST.DOCK.x + 6;
      SHIP_DECK.z = HOST.DOCK.z + 5;
      SHIP_DECK.y = 1.2;
    }

    buildUFOAndBeam();
    buildUI();

    HOST.K.onFrame(function (dt, t) {
      updateUFOAnimation(Math.min(dt, 0.05), t);
    });

    if (TEST_MODE) {
      setTimeout(function () { openPicker(); }, 450);
    }
    window.IslandTools._ready = true;
    window.dispatchEvent(new CustomEvent('islandtools:ready'));
  }

  if (window.__home3dQuietHost) init();
  else window.addEventListener('home3d:ready', init, { once: true });
})();
