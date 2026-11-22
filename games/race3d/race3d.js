/* Sprint Race 3D — English Adventure Academy
   Plays on the Sprint Track in Adventure Park (games/world).
   Built on kit3d + world3d, keeping fair turns, all sounds/art, crowd & confetti.
   Options: ?teams=2..4  ?steps=2..10  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1  ?q=low */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 36, fogNear: IN_WORLD ? 90 : 45, fogFar: IN_WORLD ? 260 : 120 });
  var scene = K.scene;

  /* ---------------- rich procedural track audio layer ---------------- */
  function playRaceSfx(kind) {
    var a = K.audio ? K.audio() : null;
    if (!a || K.CAPTURE || K.muted) return;
    var now = a.currentTime;
    try {
      if (kind === 'turbo') {
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
          var o = a.createOscillator(), g = a.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, now + i * 0.04);
          o.frequency.exponentialRampToValueAtTime(f * 1.12, now + i * 0.04 + 0.16);
          g.gain.setValueAtTime(0.09, now + i * 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.24);
          o.connect(g); g.connect(a.destination);
          o.start(now + i * 0.04); o.stop(now + i * 0.04 + 0.26);
        });
      } else if (kind === 'stride') {
        var o2 = a.createOscillator(), g2 = a.createGain();
        o2.type = 'sine'; o2.frequency.setValueAtTime(115, now); o2.frequency.exponentialRampToValueAtTime(52, now + 0.06);
        g2.gain.setValueAtTime(0.14, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        o2.connect(g2); g2.connect(a.destination);
        o2.start(now); o2.stop(now + 0.08);
      } else if (kind === 'tape') {
        [587.33, 739.99, 880, 1174.66].forEach(function (f, i) {
          var o3 = a.createOscillator(), g3 = a.createGain();
          o3.type = 'triangle'; o3.frequency.value = f;
          g3.gain.setValueAtTime(0.10, now + i * 0.05);
          g3.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45);
          o3.connect(g3); g3.connect(a.destination);
          o3.start(now + i * 0.05); o3.stop(now + i * 0.05 + 0.47);
        });
      }
    } catch (e) {}
  }

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var STEPS = clamp(+K.Q.get('steps') || 5, 2, 10);
  var TRACK = 30;
  var STEP = TRACK / STEPS;
  var LANE = 1.7;

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, stumbles: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');

  function laneZ(i) { return (i - (nTeams - 1) / 2) * LANE; }

  /* ---------------- world & Tripo props (GameQualityCore Sunlit Sprint Track) ---------------- */
  var GQC = window.GameQualityCore || null;
  K._gqcTheme = 'stadium';
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0, 'stadium');
  K.world.lights();
  if (!GQC) K.world.clouds(14, -70, 90);
  if (!IN_WORLD) {
    K.world.ground(0x6eb84c);
    K.world.hills(-30, 70, -40, 10);
    for (var ti = 0; ti < 20; ti++) {
      K.world.tree(rnd(-14, 48), ti % 2 ? rnd(-24, -13) : rnd(13, 24), rnd(.9, 1.5), ti % 5 === 0);
    }
  }

  var propGroup = new T3.Group();
  scene.add(propGroup);
  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);
  var startGateModel = null, flagpoleModel = null, trophyModel = null;

  /* ---------------- running track ---------------- */
  var MAX_LANES = 4;
  var trackW = MAX_LANES * LANE + 1.4;
  var trackMesh = new T3.Mesh(
    new T3.BoxGeometry(38, .12, trackW),
    new T3.MeshStandardMaterial({ color: 0xe06d53, roughness: .65 })
  );
  trackMesh.position.set(14, .06, 0);
  trackMesh.receiveShadow = true;
  scene.add(trackMesh);

  // Kerbs
  [-trackW / 2 - .15, trackW / 2 + .15].forEach(function (z) {
    var k = new T3.Mesh(new T3.BoxGeometry(38.2, .16, .28), K.mat(0xfff4e6));
    k.position.set(14, .08, z);
    k.receiveShadow = true;
    scene.add(k);
  });

  // Lane lines + start/finish lines
  var lineMat = new T3.MeshBasicMaterial({ color: 0xffffff });
  for (var li = 0; li <= MAX_LANES; li++) {
    var lz = (li - MAX_LANES / 2) * LANE;
    var ln = new T3.Mesh(new T3.PlaneGeometry(36, .08), lineMat);
    ln.rotation.x = -Math.PI / 2;
    ln.position.set(14, .125, lz);
    scene.add(ln);
  }
  var startLine = new T3.Mesh(new T3.PlaneGeometry(.26, trackW - .6), lineMat);
  startLine.rotation.x = -Math.PI / 2;
  startLine.position.set(0, .126, 0);
  scene.add(startLine);

  // Distance tick lines + high-contrast golden chevron boost pads along the track
  for (var dx = 5; dx < TRACK; dx += 5) {
    var tickLn = new T3.Mesh(
      new T3.PlaneGeometry(.08, trackW - .8),
      new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35 })
    );
    tickLn.rotation.x = -Math.PI / 2;
    tickLn.position.set(dx, .125, 0);
    scene.add(tickLn);
  }
  [8.5, 17.5, 25.5].forEach(function (bx) {
    for (var bl = 0; bl < MAX_LANES; bl++) {
      var pad = new T3.Mesh(
        new T3.ConeGeometry(.38, .68, 3),
        new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: .78 })
      );
      pad.rotation.x = -Math.PI / 2;
      pad.rotation.z = -Math.PI / 2;
      pad.position.set(bx, .13, (bl - (MAX_LANES - 1) / 2) * LANE);
      scene.add(pad);
    }
  });

  // Lane numbers (repositioned dynamically when nTeams changes)
  var laneDiscs = [];
  for (var i = 0; i < MAX_LANES; i++) {
    (function (idx) {
      var tex = K.canvasTex(128, 128, function (c) {
        c.fillStyle = ALL_TEAMS[idx].c;
        c.beginPath(); c.arc(64, 64, 56, 0, Math.PI * 2); c.fill();
        c.lineWidth = 8; c.strokeStyle = '#fff'; c.stroke();
        c.fillStyle = '#fff';
        c.font = '900 72px Nunito, Trebuchet MS, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(idx + 1), 64, 68);
      });
      var d = new T3.Mesh(new T3.PlaneGeometry(1.1, 1.1), new T3.MeshBasicMaterial({ map: tex, transparent: true }));
      d.rotation.x = -Math.PI / 2;
      d.position.set(-1.35, .127, laneZ(idx));
      scene.add(d);
      laneDiscs.push(d);
    })(i);
  }

  // Checkered finish line
  (function finishStrip() {
    var tex = K.canvasTex(64, 256, function (c) {
      for (var r = 0; r < 16; r++) {
        for (var q = 0; q < 2; q++) {
          c.fillStyle = (r + q) % 2 ? '#231f20' : '#ffffff';
          c.fillRect(q * 32, r * 16, 32, 16);
        }
      }
    });
    var fin = new T3.Mesh(new T3.PlaneGeometry(1.05, trackW - .6), new T3.MeshBasicMaterial({ map: tex }));
    fin.rotation.x = -Math.PI / 2;
    fin.position.set(TRACK, .128, 0);
    scene.add(fin);
  })();

  function placeDecorModels() {
    while (propGroup.children.length) propGroup.remove(propGroup.children[0]);
    if (startGateModel) {
      var sg = startGateModel.clone(true);
      sg.rotation.set(0, 0, 0);
      var box3 = new T3.Box3().setFromObject(sg), sz = box3.getSize(V(0, 0, 0));
      if (sz.x > sz.z) sg.rotation.y = Math.PI / 2;
      var span = Math.max(sz.x, sz.z) || 6;
      sg.scale.multiplyScalar((trackW + 1.5) / span);
      sg.position.set(-2.6, 0, 0);
      propGroup.add(sg);
    }
    if (flagpoleModel) {
      [6, 18].forEach(function (fx) {
        var fp = flagpoleModel.clone(true);
        fp.position.set(fx, 0, trackW / 2 + 1.6);
        propGroup.add(fp);
      });
    }
    if (trophyModel) {
      [-1, 1].forEach(function (s) {
        var ped = new T3.Mesh(
          new T3.CylinderGeometry(.5, .6, .65, 18),
          new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: .35 })
        );
        ped.position.set(TRACK + 1.2, .325, s * (trackW / 2 + 1.5));
        ped.castShadow = true;
        propGroup.add(ped);

        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.62);
        tr.position.set(TRACK + 1.2, .66, s * (trackW / 2 + 1.5));
        tr.rotation.y = -Math.PI / 2;
        propGroup.add(tr);
      });
    }
  }

  /* ---------------- finish arch + snapping tape ---------------- */
  var tape, tapeHalves = [];
  (function buildArch() {
    var archZ = trackW / 2 + .55;
    [-archZ, archZ].forEach(function (z) {
      var p = new T3.Mesh(new T3.CylinderGeometry(.2, .24, 4.6, 16), K.mat(0xffffff));
      p.position.set(TRACK, 2.3, z);
      p.castShadow = true;
      scene.add(p);
      var ring = new T3.Mesh(new T3.TorusGeometry(.28, .08, 10, 20), K.mat(0xffd166));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(TRACK, 1.15, z);
      scene.add(ring);
      [0xff5fa2, 0x4f9dff, 0xffb320].forEach(function (col, bi) {
        var b = new T3.Mesh(new T3.SphereGeometry(.32, 14, 12), K.mat(col));
        b.scale.y = 1.2;
        b.position.set(TRACK + (bi - 1) * .35, 4.7 + (bi === 1 ? .3 : 0), z + (z > 0 ? .2 : -.2));
        scene.add(b);
      });
    });
    var fbTex = K.canvasTex(512, 64, function (c) {
      c.fillStyle = '#fff4e6';
      c.fillRect(0, 0, 512, 64);
      c.fillStyle = '#ff5fa2';
      c.fillRect(0, 0, 512, 10);
      c.fillRect(0, 54, 512, 10);
      c.fillStyle = '#ff5fa2';
      c.font = '900 40px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('FINISH', 256, 33);
    });
    var bannerMat = new T3.MeshLambertMaterial({ map: fbTex });
    K.art('finish-banner.png', function (t) { bannerMat.map = t; bannerMat.needsUpdate = true; });
    var banner = new T3.Mesh(new T3.BoxGeometry(.35, 1.05, archZ * 2 + .5), bannerMat);
    banner.position.set(TRACK, 4.4, 0);
    banner.castShadow = true;
    scene.add(banner);

    var tMat = K.mat(0xff5fa2);
    tape = new T3.Mesh(new T3.BoxGeometry(.05, .14, archZ * 2 - .3), tMat);
    tape.position.set(TRACK, 1.15, 0);
    scene.add(tape);
    [-1, 1].forEach(function (side) {
      var h = new T3.Mesh(new T3.BoxGeometry(.05, .14, archZ - .15), tMat);
      h.position.set(TRACK, 1.15, side * (archZ / 2));
      h.visible = false;
      h.userData = { s: side, t: 0 };
      scene.add(h);
      tapeHalves.push(h);
    });
  })();

  /* ---------------- flags + cheer boards + crowd ---------------- */
  var flags = [], crowdSpecs = [];
  (function buildFlagsAndBoards() {
    var flagFiles = ['flag-pink.png', 'flag-blue.png', 'flag-yellow.png', 'flag-green.png'];
    [3, 11, 19, 27].forEach(function (x, i) {
      var t = ALL_TEAMS[i % ALL_TEAMS.length];
      var pole = new T3.Mesh(new T3.CylinderGeometry(.06, .08, 4.2, 10), K.mat(0xffffff));
      pole.position.set(x, 2.1, -trackW / 2 - 1.4);
      pole.castShadow = true;
      scene.add(pole);
      var fGeo = new T3.PlaneGeometry(1.5, .95, 10, 4);
      fGeo.translate(.75, 0, 0);
      var fMat = new T3.MeshLambertMaterial({ color: t.hex, side: T3.DoubleSide });
      K.art(flagFiles[i % flagFiles.length], function (tex) { fMat.map = tex; fMat.color.set(0xffffff); fMat.needsUpdate = true; });
      var fl = new T3.Mesh(fGeo, fMat);
      fl.position.set(x, 3.65, -trackW / 2 - 1.4);
      fl.userData.phase = i * 1.1;
      scene.add(fl);
      flags.push(fl);
    });
    var phrases = ['GO, GO, GO!', 'YOU CAN DO IT!', 'RUN FAST!', 'WELL DONE!'];
    [4, 12, 20, 28].forEach(function (x, i) {
      var tex = K.canvasTex(512, 128, function (c) {
        c.fillStyle = '#fffaf3';
        c.fillRect(0, 0, 512, 128);
        c.strokeStyle = ALL_TEAMS[i % ALL_TEAMS.length].c;
        c.lineWidth = 10;
        c.strokeRect(8, 8, 496, 112);
        c.fillStyle = ALL_TEAMS[i % ALL_TEAMS.length].c;
        c.font = '900 54px Nunito, Trebuchet MS, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(phrases[i], 256, 66);
      });
      var bMat = new T3.MeshLambertMaterial({ map: tex });
      K.art('board-' + (i + 1) + '.png', function (t) { bMat.map = t; bMat.needsUpdate = true; });
      var bd = new T3.Mesh(new T3.BoxGeometry(3.8, .95, .15), bMat);
      bd.position.set(x, .58, -trackW / 2 - 2.3);
      scene.add(bd);
    });
  })();

  function fillStands() {
    var standG = new T3.Group();
    scene.add(standG);
    var cols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a, 0x9b7bff, 0xfff4e6];
    for (var bx = 2; bx <= 26; bx += 8) {
      for (var r = 0; r < 3; r++) {
        var step = new T3.Mesh(new T3.BoxGeometry(7.2, .5 * (r + 1), .9), K.mat(r % 2 ? 0xd8ecff : 0xeaf4ff));
        step.position.set(bx + 2, .25 * (r + 1), -trackW / 2 - 4.2 - r * .95);
        step.receiveShadow = true;
        step.castShadow = true;
        standG.add(step);
        for (var k = -3; k <= 3; k++) {
          var sp = new T3.Group();
          sp.position.set(bx + 2 + k * .95, .5 * (r + 1) + .25, -trackW / 2 - 4.2 - r * .95);
          var c = cols[Math.abs(k + r + bx) % cols.length];
          var body = new T3.Mesh(new T3.CylinderGeometry(.18, .22, .55, 8), K.mat(c));
          var head = new T3.Mesh(new T3.SphereGeometry(.18, 8, 8), K.mat(0xffdfc4));
          head.position.y = .42;
          sp.add(body);
          sp.add(head);
          sp.userData = { y0: sp.position.y, ph: rnd(0, 6.28), x: sp.position.x };
          standG.add(sp);
          crowdSpecs.push(sp);
        }
      }
    }
  }
  fillStands();

  /* ---------------- 3D Boost Burst Trail Rings ---------------- */
  var boostRings = [];
  var boostRingGeo = new T3.TorusGeometry(.42, .05, 8, 22);
  function spawnBoostRing(pos, colHex) {
    var mat = new T3.MeshBasicMaterial({ color: colHex || 0xffd84a, transparent: true, opacity: .85 });
    var m = new T3.Mesh(boostRingGeo, mat);
    m.position.copy(pos).add(V(-.25, .65, 0));
    m.rotation.y = Math.PI / 2;
    scene.add(m);
    boostRings.push({ mesh: m, mat: mat, life: 0, maxLife: .46 });
  }

  /* ---------------- 3D Active Turn Ring & Arrow ---------------- */
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(
      new T3.TorusGeometry(.76, .07, 12, 32),
      new T3.MeshBasicMaterial({ color: 0xff5fa2 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .04;
    g.add(ring);

    var cone = new T3.Mesh(
      new T3.ConeGeometry(.24, .44, 16),
      new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffa000, emissiveIntensity: .35, roughness: .25 })
    );
    cone.rotation.x = Math.PI;
    cone.position.y = 2.4;
    g.add(cone);

    g.visible = false;
    scene.add(g);
    K.onFrame(function (dt, t) {
      if (!g.visible) return;
      ring.scale.setScalar(1 + Math.sin(t * 6) * .08);
      cone.visible = !/run|photofinish|question|boost/.test(game.phase);
      cone.position.y = 2.35 + Math.sin(t * 5.5) * .16;
      cone.rotation.y = t * 2.8;
    });
    return {
      set: function (r) {
        if (!r || game.phase === 'end') { g.visible = false; return; }
        g.visible = true;
        ring.material.color.setHex(r.team.hex);
        g.position.copy(r.holder.position);
      }
    };
  })();

  /* ---------------- frame updates (flags, crowd wave, tape, boost rings) ---------------- */
  var crowdHype = 0;
  var fpsAvg = 60;
  K.onFrame(function (dt, t) {
    if (dt > 0.0005 && dt < 0.5) fpsAvg = fpsAvg * 0.92 + (1 / dt) * 0.08;

    for (var i = boostRings.length - 1; i >= 0; i--) {
      var br = boostRings[i];
      br.life += dt;
      var bu = br.life / br.maxLife;
      br.mesh.scale.setScalar(1 + bu * 1.15);
      br.mat.opacity = Math.max(0, .85 * (1 - bu));
      if (br.life >= br.maxLife) {
        scene.remove(br.mesh);
        boostRings.splice(i, 1);
      }
    }

    flags.forEach(function (fl) {
      var p = fl.geometry.attributes.position;
      for (var fi = 0; fi < p.count; fi++) {
        var x = p.getX(fi);
        p.setZ(fi, Math.sin(t * 5.5 + x * 2.5 + fl.userData.phase) * .09 * (x / 1.5));
      }
      p.needsUpdate = true;
    });
    crowdSpecs.forEach(function (sp) {
      var wave = Math.max(0, Math.sin(t * 3.8 - sp.userData.x * .35)) * (.08 + crowdHype * .18);
      var amp = .03 + crowdHype * .16;
      sp.position.y = sp.userData.y0 + wave + Math.abs(Math.sin(t * (3 + crowdHype * 5) + sp.userData.ph)) * amp;
    });
    tapeHalves.forEach(function (h) {
      if (!h.visible) return;
      h.userData.t += dt;
      var tt = h.userData.t;
      h.rotation.x = h.userData.s * Math.min(1.3, tt * 3);
      h.position.y = Math.max(.18, 1.15 - tt * tt * 1.5);
    });
  });

  /* ---------------- camera presets (child-eye broadcast & live chase camera!) ---------------- */
  function setFov(f) {
    if (K.camera.fov !== f) { K.camera.fov = f; K.camera.updateProjectionMatrix(); }
  }
  function camFor(mode, who) {
    K.cam.follow = null;
    setFov(/question|follow|stumble|photofinish|start/.test(mode) ? 34 : 38);
    if (mode === 'orbit') {
      K.cam.follow = function () {
        var a = .5 + K.now * .16;
        K.cam.tPos.set(Math.sin(a) * 9.5 + 1.5, 3.3, Math.cos(a) * 8.5);
        K.cam.tLook.set(2.2, 0.95, 0);
      };
      K.cam.k = 1.6;
    } else if (mode === 'intro') {
      K.cam.set(V(TRACK + 2.5, 4.4, 7.6), V(TRACK - 4, 1.05, 0), true);
      K.after(.1, function () { K.cam.set(V(3.8, 2.2, 6.2), V(0.8, 0.95, 0)); });
    } else if (mode === 'start') {
      K.cam.set(V(4.2, 1.85, 5.6), V(0.6, 0.92, 0), 2.8);
    } else if (mode === 'question') {
      // Child-eye front-3/4 broadcast angle: active runner & rivals fill upper 68% cleanly above bottom-30% .qcard
      var rx = who ? who.x : 0, rz = who ? who.z : 0;
      K.cam.set(V(rx + 4.8, 1.62, rz + 4.85), V(rx + 0.6, 0.68, rz * 0.45), 2.8);
    } else if (mode === 'follow' && who) {
      // Low dynamic broadcast chase camera tracking the sprinting runner!
      setFov(who.isBoost ? 36 : 34);
      K.cam.k = 4.0;
      K.cam.follow = function () {
        K.cam.tPos.set(who.x - 2.6, 1.62, who.z + 4.1);
        K.cam.tLook.set(who.x + 2.4, 0.92, who.z * 0.55);
      };
    } else if (mode === 'photofinish') {
      // Crisp unobstructed finish-line broadcast camera inside the arch looking across the checkered tape!
      setFov(34);
      K.cam.set(V(TRACK + 5.2, 1.82, trackW / 2 - 0.4), V(TRACK - 0.6, 0.96, -0.35), 4.8);
    } else if (mode === 'stumble' && who) {
      K.cam.set(V(who.x + 2.2, 1.65, who.z + 3.9), V(who.x, .82, who.z), 3.0);
    } else if (mode === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .45;
        K.cam.tPos.set(TRACK + 6.4, 3.2, a * 1.5);
        K.cam.tLook.set(TRACK - 1.2, .45, 0);
      };
      K.cam.k = 2.2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer for your team\'s runner!' },
    { ico: '⚡', c: '#4f9dff', t: '2. Turbo Sprint Boost!', s: 'Right answer blasts your runner forward with a golden boost trail!' },
    { ico: '🏁', c: '#2fc58a', t: '3. Snap the Finish Tape!', s: 'First runner across the finish line wins the photo-finish trophy!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.rc-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'rc-howto-modal'));
    var card = K.el('div', 'rc-howto-card');
    card.innerHTML = '<h2 class="rc-howto-title">🏃 How to Play Sprint Race 3D</h2>';
    var grid = K.el('div', 'rc-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'rc-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="rc-step-num">' + (idx + 1) + '</span>' +
        '<div class="rc-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'rc-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);

    var gotIt = K.el('button', 'btn green', '👍 Got it! Let\'s Race!');
    gotIt.onclick = function () {
      try { localStorage.setItem('eaa_howto_race3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(gotIt);
    modal.appendChild(card);
    K.say('How to play Sprint Race! Step 1: Answer the question. Step 2: Get a turbo sprint boost. Step 3: Be the first runner to snap the finish tape!');
  }

  function addHelpTopButton() {
    var top = document.querySelector('.k3-top');
    if (!top || top.querySelector('.k3-help-btn')) return;
    var helpBtn = K.el('button', 'k3-icon k3-help-btn', '?');
    helpBtn.title = 'How to play';
    helpBtn.onclick = function () { openHowTo(); };
    top.insertBefore(helpBtn, top.firstChild);
  }

  window.__race3d = {
    openHowTo: openHowTo,
    getFps: function () { return Math.round(fpsAvg); },
    captureShot: function (mode) {
      K.ui.clear();
      hud = K.ui.teamBar(TEAMS, function (t) { return t.score + '/' + STEPS + ' 🏃'; });
      K.ui.topButtons(); addHelpTopButton();
      turnBannerEl = K.ui.add(K.el('div', 'rc-turn-banner'));
      liveBoardEl = K.ui.add(K.el('div', 'rc-live-board'));
      activeIdx = 0;
      runners.forEach(function (r, idx) {
        r.x = mode === 'photofinish' ? (idx === 0 ? TRACK - 0.15 : TRACK - 2.6 - idx * 1.2) : (4.5 - idx * 0.9);
        r.score = mode === 'photofinish' ? (idx === 0 ? STEPS : Math.max(1, STEPS - idx)) : Math.max(0, 2 - idx);
        r.team.score = r.score;
        r.holder.position.set(r.x, .12, r.z);
        r.holder.rotation.set(0, 0, 0);
        r.runDist = 0;
        r.setState(mode === 'sprint' || mode === 'photofinish' ? 'turbo' : 'ready');
      });
      hud.refresh(activeIdx);
      updateLiveTrackUI(activeIdx);
      var r0 = runners[0];
      if (mode === 'question') {
        setPhase('question');
        updateTurnUI(0, 'Answer right for a Turbo Sprint Boost!');
        camFor('question', r0); K.cam.snap();
        K.ui.ask(QS.next(), r0.team, { prompt: 'answer right to unlock Turbo Boost!', onAnswer: function () {} });
      } else if (mode === 'boost') {
        setPhase('boost');
        camFor('question', r0); K.cam.snap();
        promptTurboBoost(r0, function () {});
      } else if (mode === 'sprint') {
        setPhase('run');
        updateTurnUI(0, '🔥 SUPER TURBO BOOST!');
        r0.isBoost = true; r0.runDist = 4; r0.speed = 9.0;
        spawnBoostRing(r0.holder.position.clone().add(V(-0.8, 0, 0)), r0.team.hex);
        spawnBoostRing(r0.holder.position.clone().add(V(-1.7, 0, 0)), 0xffd84a);
        camFor('follow', r0); K.cam.snap();
      } else if (mode === 'photofinish') {
        setPhase('run');
        updateTurnUI(0, '🏁 PHOTO FINISH!');
        tape.visible = false;
        tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0.25; });
        K.ui.add(K.el('div', 'rc-photo-badge', '📸 PHOTO FINISH!'));
        K.ui.big('🏁 ' + r0.team.name + ' Finishes!', 5, true);
        camFor('photofinish'); K.cam.snap();
      }
    }
  };

  /* ---------------- runners (all 4 loaded at boot) ---------------- */
  var allRunners = [], runners = [], activeIdx = 0, startOffset = 0, roundStep = 0;
  var game = { phase: 'loading', winner: -1 };
  var hud = null, turnBannerEl = null, liveBoardEl = null, demoTurn = 0, DEMO_WRONG = [3, 7];

  function makeRunner(kid, team, i) {
    var holder = new T3.Group();
    holder.position.set(0, .12, laneZ(i));
    scene.add(holder);
    kid.root.rotation.y = Math.PI / 2;
    holder.add(kid.root);
    if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(holder, 0.78, { y: 0.012, opacity: 0.28 });

    var ring = new T3.Mesh(new T3.RingGeometry(.45, .62, 32), new T3.MeshBasicMaterial({ color: team.hex }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .02;
    holder.add(ring);

    var lab = K.label(team.name, team.c);
    lab.position.y = kid.height + .45;
    holder.add(lab);

    var r = {
      i: i,
      team: team,
      kid: kid,
      holder: holder,
      ring: ring,
      lab: lab,
      x: 0,
      z: laneZ(i),
      score: 0,
      finished: false,
      runDist: 0,
      speed: 0,
      boostTimer: 0,
      onDone: null,
      onCross: null,
      pace: 0.91 + (i % 4) * 0.055,
      phaseOff: i * 1.4,
      strideStep: 0,
      setState: function (s) {
        if (kid.playClip) {
          if (s === 'turbo') kid.playClip('SprintRun', { speed: 1.85 * r.pace, fade: 0.10 });
          else if (s === 'run') kid.playClip('SprintRun', { speed: 1.35 * r.pace, fade: 0.12 });
          else if (s === 'cheer') kid.playClip('TugWin', { speed: 1.0 * r.pace, fade: 0.14 });
          else if (s === 'stumble' || s === 'sad') kid.playClip('HandsHead', { speed: 1.0 * r.pace, fade: 0.12 });
          else if (s === 'ready' || s === 'idle') kid.playClip('SoccerReady', { speed: 0.95 * r.pace, fade: 0.16 });
          else kid.setState(s);
        } else {
          kid.setState(s);
        }
      },
      sprint: function (dist, cb, isBoost) {
        r.runDist = dist;
        r.speed = isBoost ? 8.2 : 6.2;
        r.isBoost = !!isBoost;
        r.onDone = cb || null;
        kid.speed = isBoost ? 2.15 : 1.45;
        r.setState(isBoost ? 'turbo' : 'run');
      }
    };
    K.onFrame(function (dt, t) {
      kid.update(dt * r.pace);
      if (r.lab) r.lab.visible = /title|ready|start/.test(game.phase);
      if (r.runDist > 0) {
        var step = Math.min(r.runDist, r.speed * dt);
        r.x += step;
        r.runDist -= step;
        holder.position.x = r.x;
        // Real Blender skeletal animation drives the stride — grounded cleanly on track top y = 0.12!
        holder.position.y = .12;
        holder.rotation.z = 0;
        r.strideStep += dt * (r.isBoost ? 5.6 : 4.2);
        if (r.strideStep >= 1) {
          r.strideStep -= 1;
          K.fx.puff(V(r.x - .18, .15, r.z), 2, { color: 0xffe8c8, size: .22 });
          playRaceSfx('stride');
        }
        if (r === runners[activeIdx]) turnMarker.set(r);

        if (r.isBoost) {
          r.boostTimer += dt;
          if (r.boostTimer >= 0.045) {
            r.boostTimer = 0;
            spawnBoostRing(holder.position, r.team.hex);
            K.fx.burst(holder.position.clone().add(V(-.2, .5, 0)), 2, { color: [r.team.hex, 0xffd84a], speed: 2.2, size: .1, life: .28 });
          }
        }
        if (r.x >= TRACK && !r.finished && r.onCross) {
          var fn = r.onCross;
          r.onCross = null;
          fn();
        }
        if (r.runDist <= 0) {
          holder.position.y = .12;
          holder.rotation.z = 0;
          kid.speed = 1;
          kid.setState(r.finished ? 'cheer' : 'idle');
          var done = r.onDone;
          r.onDone = null;
          if (done) done();
        }
      }
    });
    return r;
  }

  function syncRunnersForTeamCount() {
    TEAMS = ALL_TEAMS.slice(0, nTeams);
    STEP = TRACK / STEPS;
    runners = allRunners.slice(0, nTeams);
    allRunners.forEach(function (r, idx) {
      var vis = idx < nTeams;
      r.holder.visible = vis;
      if (laneDiscs[idx]) laneDiscs[idx].visible = vis;
      if (vis) {
        r.z = laneZ(idx);
        r.holder.position.set(r.x, .12, r.z);
        r.holder.rotation.set(0, 0, 0);
        r.kid.root.rotation.set(0, Math.PI / 2, 0);
        if (laneDiscs[idx]) laneDiscs[idx].position.set(-1.35, .127, r.z);
      }
    });
  }

  function updateTurnUI(idx, msg) {
    if (idx < 0 || idx >= runners.length) {
      turnMarker.set(null);
      if (turnBannerEl) turnBannerEl.style.display = 'none';
      return;
    }
    var r = runners[idx];
    turnMarker.set(r);
    if (!turnBannerEl) return;
    turnBannerEl.style.display = 'inline-flex';
    turnBannerEl.style.setProperty('--c', r.team.c);
    turnBannerEl.innerHTML =
      '<span class="rc-turn-dot"></span>' +
      '<span>🏃 Team ' + r.team.name + '\'s Turn · ' + (msg || ('Step ' + r.score + ' of ' + STEPS)) + '</span>';
  }

  function updateLiveTrackUI(activeI) {
    if (!liveBoardEl) return;
    var rows = runners.map(function (r, i) {
      var pct = Math.min(100, Math.round((r.x / TRACK) * 100));
      return '<div class="rc-live-row' + (i === activeI ? ' on' : '') + '" style="--c:' + r.team.c + '">' +
        '<b>' + r.team.name + '</b>' +
        '<div class="rc-track-bar"><div class="rc-track-fill" style="width:' + pct + '%"></div></div>' +
        '<span>' + (r.finished ? '🏁' : (r.score + '/' + STEPS)) + '</span>' +
      '</div>';
    }).join('');
    liveBoardEl.innerHTML = '<div class="rc-live-head">🏁 Sprint Track (' + STEPS + ' steps)</div>' + rows;
  }

  /* ---------------- game flow ---------------- */
  function setPhase(p) {
    game.phase = p;
    window.__k3phase = p;
  }

  function titleScreen() {
    setPhase('title');
    podiumGroup.visible = false;
    syncRunnersForTeamCount();
    camFor('orbit');

    K.ui.clear();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Sprint Race 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#4f9dff;font-size:1.42rem">🏃 Sprint Race 3D — answer right to blast down the track!</div>';

    // Quick Setup Row: Teams (2..4) and Sprint Steps (3 / 5 / 7)
    var setup = K.el('div', 'rc-setup');
    var teamGrp = K.el('div', 'rc-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'rc-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        syncRunnersForTeamCount();
        teamGrp.querySelectorAll('.rc-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
        box.querySelectorAll('.setpick, .clsbox').forEach(function (el) { el.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      teamGrp.appendChild(b);
    });

    var stepGrp = K.el('div', 'rc-setup-grp', '<span>🏁 Distance:</span>');
    [3, 5, 7].forEach(function (st) {
      var b = K.el('button', 'rc-pill' + (st === STEPS ? ' on' : ''), st + ' steps');
      b.onclick = function () {
        STEPS = st;
        STEP = TRACK / STEPS;
        stepGrp.querySelectorAll('.rc-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
      };
      stepGrp.appendChild(b);
    });
    setup.appendChild(teamGrp);
    setup.appendChild(stepGrp);
    box.appendChild(setup);

    var rows = K.el('div', 'rows');
    var howBtn = K.el('button', 'btn soft', '❓ How to Play');
    howBtn.onclick = function () { openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Start Race!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['countdown', 'go', 'correct', 'wrong', 'step', 'stumble', 'hello', 'whoosh', 'win']);
      K.cls.assign(TEAMS);
      box.remove();
      startRace();
    };
    rows.appendChild(howBtn);
    rows.appendChild(go);
    box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();
    addHelpTopButton();

    runners.forEach(function (r, idx) {
      K.after(.4 + idx * .4, function () {
        if (game.phase !== 'title') return;
        r.setState('hello');
        K.sfx('hello');
        K.after(1.4, function () { if (game.phase === 'title') r.setState('idle'); });
      });
    });

    var seenHowTo = false;
    try { seenHowTo = localStorage.getItem('eaa_howto_race3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (game.phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (game.phase === 'title') go.onclick(); });
  }

  function startRace() {
    K.ui.clear();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + '/' + STEPS + ' 🏃'; });
    K.ui.topButtons();
    addHelpTopButton();
    turnBannerEl = K.ui.add(K.el('div', 'rc-turn-banner'));
    turnBannerEl.style.display = 'none';
    liveBoardEl = K.ui.add(K.el('div', 'rc-live-board'));
    updateLiveTrackUI(-1);

    setPhase('intro');
    camFor('intro');
    K.sfx('whoosh');
    K.after(1.6, function () {
      camFor('start');
      setPhase('ready');
      runners.forEach(function (r) { r.setState('ready'); });
      var n = 3;
      (function count() {
        if (n > 0) {
          K.ui.big(String(n), .65);
          K.sfx('countdown');
          n--;
          K.after(.7, count);
          return;
        }
        K.ui.big('🏁 GO!', .8);
        K.sfx('go');
        crowdHype = 1;
        K.cam.shake(.28);
        setPhase('go');
        runners.forEach(function (r) { r.finished = false; r.sprint(1.2 + Math.random() * .2, null, true); });
        startOffset = Math.floor(Math.random() * runners.length);
        roundStep = 0;
        K.after(1.5, function () {
          crowdHype = .15;
          activeIdx = startOffset;
          nextTurn();
        });
      })();
    });
  }

  function nextTurn() {
    if (game.phase === 'end') return;
    setPhase('turn');
    hud.refresh(activeIdx);
    updateTurnUI(activeIdx, 'Answer right for a Turbo Sprint Boost!');
    updateLiveTrackUI(activeIdx);
    var r = runners[activeIdx];
    camFor('question', r);
    r.setState('hello');
    K.sfx('hello');
    K.after(.85, function () {
      r.setState('idle');
      askQuestion(r);
    });
  }

  function askQuestion(r) {
    setPhase('question');
    demoTurn++;
    var item = QS.next();
    K.ui.ask(item, r.team, {
      prompt: 'answer right to unlock Turbo Boost!',
      demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
      onAnswer: function (ok) {
        if (ok) {
          K.sfx('correct');
          promptTurboBoost(r, function (isSuper) { correct(r, isSuper); });
        } else {
          wrong(r);
        }
      }
    });
  }

  // Interactive 1-Tap Turbo Boost Timing Bar!
  function promptTurboBoost(r, onDone) {
    setPhase('boost');
    updateTurnUI(activeIdx, '⚡ Hit the GOLD zone for SUPER TURBO!');
    var bar = K.ui.add(K.el('div', 'rc-boost-bar'));
    bar.style.setProperty('--c', r.team.c);
    var left = K.el('div', 'rc-boost-left');
    left.innerHTML = '<div>⚡ Tap in the GOLD zone for 🔥 SUPER TURBO!</div>' +
      '<div class="rc-boost-track"><div class="rc-boost-sweet"></div><div class="rc-boost-needle"></div></div>';
    var needle = left.querySelector('.rc-boost-needle');
    var btn = K.el('button', 'btn green', '⚡ BOOST!');
    bar.appendChild(left);
    bar.appendChild(btn);

    var done = false, t0 = K.now, pos = 0.5;
    var fn = K.onFrame(function () {
      pos = 0.5 + 0.46 * Math.sin((K.now - t0) * 4.4);
      needle.style.left = (pos * 100).toFixed(1) + '%';
    });

    function trigger() {
      if (done) return;
      done = true;
      K.offFrame(fn);
      removeEventListener('keydown', onKey);
      K.renderer.domElement.removeEventListener('pointerdown', onTap);
      bar.remove();
      var isSuper = pos >= 0.40 && pos <= 0.64;
      onDone(isSuper);
    }
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); trigger(); }
    }
    function onTap() { trigger(); }

    btn.onclick = trigger;
    addEventListener('keydown', onKey);
    K.renderer.domElement.addEventListener('pointerdown', onTap);
    if (K.DEMO || (K.isAI && K.isAI(r.team))) K.after(.52 + Math.random() * .25, trigger);
  }

  function advanceRound() {
    roundStep++;
    updateLiveTrackUI(-1);
    if (roundStep >= runners.length) {
      roundStep = 0;
      var winners = runners.filter(function (x) { return x.finished || x.score >= STEPS; });
      if (winners.length) { finish(winners); return; }
    }
    activeIdx = (startOffset + roundStep) % runners.length;
    if (runners[activeIdx].finished) return advanceRound();
    nextTurn();
  }

  function correct(r, isSuper) {
    setPhase('run');
    r.score++;
    r.team.score = r.score;
    hud.refresh(activeIdx);
    hud.bump(activeIdx);
    updateTurnUI(activeIdx, isSuper ? '🔥 SUPER TURBO BOOST! (+1.35×!)' : '⚡ TURBO SPRINT BOOST! (' + r.score + '/' + STEPS + ')');
    camFor('follow', r);
    crowdHype = isSuper ? 1.0 : .75;
    if (GQC && GQC.Juice) {
      GQC.Juice.squashStretch(r.holder, 1.24, 0.80, 1.24, 0.28);
      GQC.Juice.spawnBurst(scene, r.holder.position.clone().add(V(0, .35, 0)), isSuper ? 'stars' : 'dust', 14);
      GQC.Juice.popupScore(isSuper ? '🔥 SUPER TURBO!' : '⚡ BOOST!', r.holder.position.clone().add(V(0, 1.85, 0)), K.camera, r.team.c);
    }
    playRaceSfx('turbo');
    K.fx.ring(r.holder.position.clone().add(V(0, .15, 0)), isSuper ? 0xffd84a : r.team.hex, isSuper ? 4.4 : 3.2);
    if (isSuper) {
      if (GQC && GQC.Juice) GQC.Juice.shakeCamera(0.22, 0.28);
      else K.cam.shake(.24);
      K.ui.big('🔥 SUPER TURBO!', .95, true);
      K.say('Super turbo boost!');
      K.fx.confetti(r.holder.position.clone().add(V(0, 1.4, 0)), 45);
    } else {
      K.ui.big('⚡ TURBO BOOST!', .85, true);
    }

    r.onCross = function () {
      r.finished = true;
      // Photo-Finish Hitstop + Slow-Motion as the winner snaps the finish tape!
      camFor('photofinish');
      var badge = K.ui.add(K.el('div', 'rc-photo-badge', '📸 PHOTO FINISH!'));
      if (GQC && GQC.Juice) {
        GQC.Juice.hitstop(42);
        GQC.Juice.shakeCamera(0.24, 0.30);
        GQC.Juice.spawnBurst(scene, V(TRACK, 1.35, r.z), 'stars', 20);
      }
      K.timeScale = 0.26;
      setTimeout(function () {
        K.timeScale = 1;
        badge.remove();
      }, 420);

      if (tape.visible) {
        tape.visible = false;
        tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
        playRaceSfx('tape');
        K.fx.confetti(V(TRACK, 3.5, 0), 140);
      }
      K.ui.big('🏁 ' + r.team.name + ' Finishes!', 1.15, true);
    };

    var stepHandle = K.onFrame(function (dt) {
      if (r.runDist <= 0) { K.offFrame(stepHandle); return; }
      updateLiveTrackUI(activeIdx);
      if (Math.random() < dt * 8) K.fx.puff(V(r.x - .2, .18, r.z), 2);
      if (Math.random() < dt * 5) K.sfx('step');
    });

    var boostMult = isSuper ? 1.32 : 1.0;
    var targetDist = r.score >= STEPS ? Math.max(STEP * boostMult + .1, TRACK - r.x + .4) : (STEP * boostMult + .05);
    r.sprint(targetDist, function () {
      if (game.phase === 'end') return;
      crowdHype = .15;
      updateLiveTrackUI(activeIdx);
      K.after(.45, advanceRound);
    }, true);
    if (isSuper) r.speed = 9.8;
  }

  function wrong(r) {
    setPhase('oops');
    r.team.stumbles++;
    camFor('stumble', r);
    r.setState('stumble');
    K.sfx('stumble');
    K.fx.puff(V(r.x + .3, .2, r.z), 8, { color: 0xfff0e0 });
    var stars = K.dizzyStars(r.holder, r.kid.height + .1);
    K.ui.big('Oops! Little stumble!', .9, true);
    K.after(1.3, function () {
      stars.remove();
      r.setState('sad');
      K.after(.55, function () {
        r.setState('idle');
        advanceRound();
      });
    });
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    podiumGroup.visible = true;
    // Camera in 'podium' shot is at x = TRACK + 7.2 looking towards -X (x = TRACK - 1.2), so +Z is on the left
    var stepSpecs = [
      { rank: 1, z: 0,    h: 1.22, w: 1.9, col: 0xffd84a },
      { rank: 2, z: 2.1,  h: 0.85, w: 1.7, col: 0xdce4f2 },
      { rank: 3, z: -2.1, h: 0.62, w: 1.7, col: 0xf0a868 },
      { rank: 4, z: -4.1, h: 0.40, w: 1.5, col: 0xe9e2f5 }
    ];
    var px = TRACK - 1.2;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], r = runners[ti], t = r.team;
      var g = new T3.Group();
      g.position.set(px, 0, sp.z);
      podiumGroup.add(g);

      var base = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      base.position.y = .12 + sp.h / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = .12 + sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.66);
      numLab.position.set(0, .12 + sp.h + 2.15, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.52);
        tr.position.set(.35, .12 + sp.h + .05, -.58);
        tr.rotation.y = Math.PI / 2;
        g.add(tr);
      }

      r.runDist = 0;
      if (r.lab) r.lab.visible = false;
      r.holder.position.set(px, .12 + sp.h + .06, sp.z + (rk === 0 ? .12 : 0));
      r.holder.rotation.set(0, 0, 0);
      r.kid.root.rotation.set(0, Math.PI / 2, 0);
      r.ring.visible = false;
      r.setState(rk === 0 ? 'cheer' : 'clap');
    });
  }

  function finish(winners) {
    var w = winners[0];
    setPhase('end');
    game.winner = w.i;
    updateTurnUI(-1);
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();

    if (tape.visible) {
      tape.visible = false;
      tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
    }
    K.sfx('win');
    crowdHype = 1;
    K.cam.shake(.35);
    K.fx.confetti(V(TRACK - 1.2, 4.2, 0), 220);

    var order = runners.map(function (r, i) { return i; }).sort(function (a, b) {
      return (runners[b].score - runners[a].score) || (runners[b].x - runners[a].x);
    });
    buildPodium3D(order);
    camFor('podium');

    var names = winners.map(function (x) { return x.team.name; }).join(' & ');
    K.ui.big(winners.length > 1 ? '🏆 ' + names + ' Tie!' : '🏆 Team ' + w.team.name + ' Wins!', 2.3, true);
    K.say(winners.length > 1 ? 'It is a photo finish tie!' : 'Team ' + w.team.name + ' wins the sprint race!');
    hud.refresh(-1);

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var r = runners[ti], t = r.team;
        var distM = Math.min(TRACK, Math.round(r.x));
        return '<div class="rc-table-row" style="--c:' + t.c + '">' +
          '<span class="rc-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<span>⚡ ' + r.score + '/' + STEPS + ' boosts · ' + distM + 'm</span>' +
          '<i>' + (r.finished ? '🏁 Finished!' : (distM + 'm')) + '</i>' +
        '</div>';
      }).join('');

      var msg = winners.length > 1 ? '🏆 Photo Finish Tie: ' + names + '!' : '🏆 Team ' + w.team.name + ' Won the Sprint Race!';
      box.innerHTML =
        '<div class="say" style="--c:' + w.team.c + ';font-size:1.42rem">' + msg + '</div>' +
        '<div class="rc-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Race again');
      again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'race3d', title: 'Sprint Race 3D' });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the track ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'race' }).catch(function (e) { console.warn('world', e); K.world.ground(0x72cf7a); return null; }) : Promise.resolve(null);
  var sgP = K.tryGLB('models/race-start-gate.glb').then(function (g) { return g ? K.fitModel(g.scene, 6.2) : null; });
  var fpP = K.tryGLB('models/team-flagpole.glb').then(function (g) { return g ? K.fitModel(g.scene, 4.0) : null; });
  var trP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  Promise.all([worldP, sgP, fpP, trP].concat(ALL_TEAMS.map(function (t) {
    return K.loadGLB(K.ROOT + 'assets/3d/characters/kid-' + (t.kid === 'girl' ? 'girl' : 'boy') + '.glb').then(function (g) {
      var kid = new K.Kid(g, 1.45);
      if (K.teamShirt) K.teamShirt(kid, t.kid === 'girl' ? 'girl' : 'boy', t);
      return kid;
    });
  }))).then(function (res) {
    startGateModel = res[1];
    flagpoleModel = res[2];
    trophyModel = res[3];
    placeDecorModels();

    res.slice(4).forEach(function (kid, i) {
      allRunners.push(makeRunner(kid, ALL_TEAMS[i], i));
    });
    // Attach Blender skeletal sports & celebration animation clips with per-runner phase offset!
    Promise.all([
      K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; }),
      K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; })
    ]).then(function (clipSets) {
      var allClips = (clipSets[0] || []).concat(clipSets[1] || []);
      allRunners.forEach(function (r, idx) {
        if (r && r.kid && r.kid.attachClips) {
          r.kid.attachClips(allClips);
          r.kid.playClip('SoccerReady', { startPhase: (idx * 0.27) % 1 });
        }
      });
    });
    syncRunnersForTeamCount();
    loading.remove();
    titleScreen();
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
