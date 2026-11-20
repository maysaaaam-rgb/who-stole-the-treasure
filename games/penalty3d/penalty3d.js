/* Penalty Shootout 3D — English Adventure Academy
   Plays on the Football Pitch in Adventure Park (games/world).
   Right answer: your player steps up to take the penalty kick — pull back (or tap a target zone) to aim and shoot past the goalkeeper!
   Wrong answer: no kick this turn, and the turn passes to the next team.
   Options: ?teams=2..4  ?kicks=1..6 (per team)  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, lerp = K.lerp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 44, fogNear: 90, fogFar: 260 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var KICKS = clamp(+K.Q.get('kicks') || 3, 1, 6);

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, kicks: 0, history: [] }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');

  /* pitch geometry (local metres): goal line at x = GX, shooting towards -X */
  var GX = -20, GW = 7.32, GH = 2.44, GD = 2.2, SPOT = GX + 11;
  var TARGETS = [
    [-2.6, 1.85, '↖ Top Left'],
    [0,    1.95, '⬆ Top Center'],
    [2.6,  1.85, '↗ Top Right'],
    [-2.6, .55,  '↙ Low Left'],
    [0,    .50,  '⬇ Low Center'],
    [2.6,  .55,  '↘ Low Right']
  ]; // [z, y, label]

  /* ---------------- world & Tripo props ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x6fd07a);

  var propGroup = new T3.Group();
  scene.add(propGroup);
  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);
  var goalBoardModel = null, flagpoleModel = null, trophyModel = null;

  // Pitch markings
  (function lines() {
    var m = new T3.MeshBasicMaterial({ color: 0xffffff });
    function line(x, z, w, d) {
      var l = new T3.Mesh(new T3.PlaneGeometry(w, d), m);
      l.rotation.x = -Math.PI / 2;
      l.position.set(x, .03, z);
      scene.add(l);
    }
    line(GX, 0, .12, 30);                                                                                       // goal line
    line(GX + 16.5 / 2, -10, 16.5, .12); line(GX + 16.5 / 2, 10, 16.5, .12); line(GX + 16.5, 0, .12, 20.12);   // penalty box
    line(GX + 2.75, -4.6, 5.5, .12); line(GX + 2.75, 4.6, 5.5, .12); line(GX + 5.5, 0, .12, 9.32);             // goal box
    var spot = new T3.Mesh(new T3.CircleGeometry(.14, 20), m);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(SPOT, .031, 0);
    scene.add(spot);
    var arc = new T3.Mesh(new T3.RingGeometry(9.1, 9.22, 48, 1, -Math.PI * .29, Math.PI * .58), m);
    arc.rotation.x = -Math.PI / 2;
    arc.position.set(SPOT, .03, 0);
    scene.add(arc);
    line(5, 0, .12, 30);                                                                                        // halfway line
    if (!IN_WORLD) {
      [-15, -5, 5].forEach(function (x) {
        var s = new T3.Mesh(new T3.PlaneGeometry(5, 30), K.mat(0x67c672));
        s.rotation.x = -Math.PI / 2;
        s.position.set(x, .01, 0);
        scene.add(s);
      });
    }
  })();

  function placeDecorModels() {
    while (propGroup.children.length) propGroup.remove(propGroup.children[0]);
    if (goalBoardModel) {
      var gb = goalBoardModel.clone(true);
      gb.position.set(GX - 4.5, 0, -7.2);
      gb.rotation.y = Math.PI * .38;
      propGroup.add(gb);
    }
    if (flagpoleModel) {
      [-1, 1].forEach(function (s) {
        var fp = flagpoleModel.clone(true);
        fp.position.set(GX - .4, 0, s * 8.6);
        fp.rotation.y = Math.PI / 2;
        propGroup.add(fp);
      });
    }
    if (trophyModel) {
      [-1, 1].forEach(function (s) {
        var ped = new T3.Mesh(
          new T3.CylinderGeometry(.48, .58, .62, 18),
          new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: .35 })
        );
        ped.position.set(GX - 1.8, .31, s * 5.8);
        ped.castShadow = true;
        propGroup.add(ped);

        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.6);
        tr.position.set(GX - 1.8, .63, s * 5.8);
        tr.rotation.y = Math.PI / 2;
        propGroup.add(tr);
      });
    }
  }

  /* ---------------- goal with a springy deformable net ---------------- */
  var net = { A: 0, V: 0, y: 1, z: 0 };
  (function buildGoal() {
    var g = new T3.Group();
    g.position.set(GX, 0, 0);
    scene.add(g);
    var white = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .28 });
    [-GW / 2, GW / 2].forEach(function (z) {
      var p = new T3.Mesh(new T3.CylinderGeometry(.075, .075, GH, 16), white);
      p.position.set(0, GH / 2, z);
      p.castShadow = true;
      g.add(p);
    });
    var bar = new T3.Mesh(new T3.CylinderGeometry(.075, .075, GW + .15, 16), white);
    bar.rotation.x = Math.PI / 2;
    bar.position.y = GH;
    bar.castShadow = true;
    g.add(bar);

    [-GW / 2, GW / 2].forEach(function (z) {
      var b = new T3.Mesh(new T3.CylinderGeometry(.032, .032, Math.hypot(GD, GH), 8), K.mat(0xdddddd));
      b.position.set(-GD / 2, GH / 2, z);
      b.rotation.z = -Math.atan2(GD, GH);
      g.add(b);
      var gb = new T3.Mesh(new T3.CylinderGeometry(.032, .032, GD, 8), K.mat(0xdddddd));
      gb.rotation.z = Math.PI / 2;
      gb.position.set(-GD / 2, .03, z);
      g.add(gb);
    });
    var tex = K.canvasTex(256, 256, function (c, w) {
      c.clearRect(0, 0, w, w);
      c.strokeStyle = '#ffffff';
      c.lineWidth = 5;
      for (var i = 0; i <= 8; i++) {
        c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, 256); c.stroke();
        c.beginPath(); c.moveTo(0, i * 32); c.lineTo(256, i * 32); c.stroke();
      }
    });
    tex.wrapS = tex.wrapT = T3.RepeatWrapping;
    function netMat(rx, ry) {
      var t = tex.clone();
      t.needsUpdate = true;
      t.repeat.set(rx, ry);
      return new T3.MeshLambertMaterial({ map: t, transparent: true, alphaTest: .4, side: T3.DoubleSide });
    }
    var backGeo = new T3.PlaneGeometry(GW, Math.hypot(GD, GH), 32, 14);
    var back = new T3.Mesh(backGeo, netMat(GW / .6, Math.hypot(GD, GH) / .6));
    back.position.set(-GD / 2, GH / 2, 0);
    back.rotation.set(0, Math.PI / 2, 0);
    back.rotateX(-Math.atan2(GD, GH));
    g.add(back);
    net.mesh = back;
    net.base = backGeo.attributes.position.array.slice();

    [-1, 1].forEach(function (s) {
      var sh = new T3.Shape();
      sh.moveTo(0, 0); sh.lineTo(-GD, 0); sh.lineTo(0, GH); sh.lineTo(0, 0);
      var side = new T3.Mesh(new T3.ShapeGeometry(sh), netMat(GD / .6, GH / .6));
      side.position.z = s * GW / 2;
      g.add(side);
    });
  })();

  K.onFrame(function (dt, t) {
    net.V += (-58 * net.A - 4.8 * net.V) * dt;
    net.A += net.V * dt;
    var p = net.mesh.geometry.attributes.position, b = net.base, H = Math.hypot(GD, GH), sig2 = 2 * 1.15 * 1.15;
    for (var i = 0; i < p.count; i++) {
      var x = b[i * 3], y = b[i * 3 + 1];
      var wy = (y + H / 2) / H * GH;
      var d2 = (x + net.z) * (x + net.z) + (wy - net.y) * (wy - net.y);
      var edge = Math.min(1, (GW / 2 - Math.abs(x)) / .8) * Math.min(1, (H / 2 - Math.abs(y)) / .5);
      p.array[i * 3 + 2] = -net.A * Math.exp(-d2 / sig2) * Math.max(0, edge) + Math.sin(t * 2.2 + x) * .018;
    }
    p.needsUpdate = true;
  });

  /* target circles in the goal mouth */
  var targets = TARGETS.map(function (tz, i) {
    var g = new T3.Group();
    var ring = new T3.Mesh(
      new T3.RingGeometry(.42, .56, 32),
      new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .95, side: T3.DoubleSide, depthTest: false })
    );
    var fill = new T3.Mesh(
      new T3.CircleGeometry(.42, 32),
      new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: .38, side: T3.DoubleSide, depthTest: false })
    );
    var num = K.canvasTex(128, 128, function (c) {
      c.font = '900 84px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineWidth = 10;
      c.strokeStyle = '#2b1d40';
      c.strokeText(i + 1, 64, 70);
      c.fillStyle = '#fff';
      c.fillText(i + 1, 64, 70);
    });
    var lab = new T3.Mesh(new T3.PlaneGeometry(.5, .5), new T3.MeshBasicMaterial({ map: num, transparent: true, depthTest: false }));
    [ring, fill, lab].forEach(function (m) { m.renderOrder = 8; g.add(m); });
    g.rotation.y = Math.PI / 2;
    g.position.set(GX + .05, tz[1], -tz[0]);
    g.visible = false;
    scene.add(g);
    g.userData = { i: i, fill: fill };
    return g;
  });
  K.onFrame(function (dt, t) {
    targets.forEach(function (g, i) {
      if (g.visible) {
        var s = 1 + .08 * Math.sin(t * 5 + i);
        g.scale.setScalar(s * (g.userData.hot ? 1.25 : 1));
        g.userData.fill.material.opacity = g.userData.hot ? .82 : .38;
      }
    });
  });

  /* ---------------- scoreboard screen (on the world's scoreboard) ---------------- */
  var board = null;
  function boardDraw() {
    if (!board) return;
    var c = board.ctx, w = 512, h = 232;
    c.fillStyle = '#2b1d40';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#ffd84a';
    c.font = '900 34px Nunito, Trebuchet MS, sans-serif';
    c.textAlign = 'center';
    c.fillText('⚽ PENALTIES', w / 2, 40);
    TEAMS.forEach(function (t, i) {
      var x = (i + .5) * w / TEAMS.length;
      c.fillStyle = t.c;
      c.font = '900 26px Nunito, Trebuchet MS, sans-serif';
      c.fillText(t.name, x, 100);
      c.fillStyle = '#fff';
      c.font = '900 64px Nunito, Trebuchet MS, sans-serif';
      c.fillText(t.score, x, 170);
      c.fillStyle = 'rgba(255,255,255,.65)';
      c.font = '700 20px Nunito, Trebuchet MS, sans-serif';
      c.fillText(t.kicks + '/' + KICKS, x, 205);
    });
    board.tex.needsUpdate = true;
  }
  function makeBoard(pos) {
    var cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 232;
    board = { ctx: cv.getContext('2d'), tex: new T3.CanvasTexture(cv) };
    board.tex.colorSpace = T3.SRGBColorSpace;
    var m = new T3.Mesh(new T3.PlaneGeometry(4.4, 2), new T3.MeshBasicMaterial({ map: board.tex }));
    m.position.copy(pos);
    scene.add(m);
    boardDraw();
  }

  /* ---------------- crowd on the stands with rolling Mexican Wave ---------------- */
  var crowdHype = 0;
  function fillStands(stands) {
    if (!stands || !stands.length) {
      stands = [{ x: GX + 5, z: -13, r: 0 }, { x: GX + 5, z: 13, r: 180 }];
    }
    var bodyG = new T3.CapsuleGeometry(.2, .3, 4, 8), headG = new T3.SphereGeometry(.17, 12, 8);
    var cols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a, 0x9b7bff, 0xff9f68, 0xffffff];
    var skin = [0xffd9b8, 0xf1c39b, 0xc98d63, 0x8d5a3b];
    var spots = [];
    stands.forEach(function (s) {
      for (var r = 0; r < 4; r++) {
        for (var i = 0; i < 10; i++) {
          if (Math.random() < .12) continue;
          spots.push({
            x: s.x - 3.6 + i * .8 + rnd(-.1, .1),
            y: .55 * (r + 1) + .32,
            z: s.z + (s.r === 180 ? -1 : 1) * (1.5 - r),
            ph: rnd(0, 6),
            sp: rnd(5, 9),
            colIdx: i
          });
        }
      }
    });
    var body = new T3.InstancedMesh(bodyG, new T3.MeshLambertMaterial(), spots.length);
    var head = new T3.InstancedMesh(headG, new T3.MeshLambertMaterial(), spots.length);
    var c = new T3.Color();
    spots.forEach(function (s, i) {
      body.setColorAt(i, c.setHex(cols[i % cols.length]));
      head.setColorAt(i, c.setHex(skin[(Math.random() * skin.length) | 0]));
    });
    body.castShadow = true;
    scene.add(body);
    scene.add(head);
    var m4 = new T3.Matrix4();
    K.onFrame(function (dt, t) {
      crowdHype = Math.max(.12, crowdHype - dt * .24);
      spots.forEach(function (s, i) {
        // Rolling stadium Mexican Wave + cheer bounce
        var wave = Math.max(0, Math.sin(t * 3.8 - s.x * .48 - s.z * .2)) * (.16 + crowdHype * .28);
        var hop = Math.max(0, Math.sin(t * s.sp * (.5 + crowdHype * .7) + s.ph)) * (.04 + crowdHype * .28);
        var j = wave + hop;
        m4.makeTranslation(s.x, s.y + j, s.z);
        body.setMatrixAt(i, m4);
        m4.makeTranslation(s.x, s.y + j + .42, s.z);
        head.setMatrixAt(i, m4);
      });
      body.instanceMatrix.needsUpdate = true;
      head.instanceMatrix.needsUpdate = true;
    });
  }

  /* ---------------- ball + 3D flight spin trail ---------------- */
  var ball = new T3.Group();
  scene.add(ball);
  (function makeBall() {
    var tex = K.canvasTex(256, 128, function (c, w, h) {
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#2b1d40';
      for (var i = 0; i < 10; i++) {
        var x = (i % 5) * 52 + (i < 5 ? 10 : 36), y = i < 5 ? 34 : 92;
        c.beginPath();
        for (var k = 0; k < 5; k++) {
          var a = k / 5 * Math.PI * 2 - Math.PI / 2;
          c.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
        }
        c.fill();
      }
    });
    var m = new T3.Mesh(new T3.SphereGeometry(.11, 24, 16), new T3.MeshLambertMaterial({ map: tex }));
    m.castShadow = true;
    ball.add(m);
    ball.userData.mesh = m;
  })();
  K.tryGLB(K.ROOT + 'assets/3d/items/soccer-ball.glb').then(function (g) {
    if (!g) return;
    ball.remove(ball.userData.mesh);
    var m = K.fitModel(g.scene, .22);
    m.position.y -= .11;
    ball.add(m);
    ball.userData.mesh = m;
  });

  var ballTrailRings = [];
  var trailRingGeo = new T3.TorusGeometry(.13, .022, 8, 18);
  function spawnBallTrailRing(pos, colHex) {
    var mat = new T3.MeshBasicMaterial({ color: colHex || 0xffd84a, transparent: true, opacity: .78 });
    var m = new T3.Mesh(trailRingGeo, mat);
    m.position.copy(pos);
    m.rotation.y = Math.PI / 2;
    scene.add(m);
    ballTrailRings.push({ mesh: m, mat: mat, life: 0, maxLife: .38 });
  }
  function clearBallTrail() {
    while (ballTrailRings.length) {
      scene.remove(ballTrailRings.pop().mesh);
    }
  }

  function resetBall() {
    ball.position.set(SPOT, .11, 0);
    ball.rotation.set(0, 0, 0);
    ballFly = null;
    ballPhys = null;
    clearBallTrail();
  }

  var ballFly = null, ballPhys = null, trailTimer = 0;
  K.onFrame(function (dt) {
    for (var i = ballTrailRings.length - 1; i >= 0; i--) {
      var tr = ballTrailRings[i];
      tr.life += dt;
      var tu = tr.life / tr.maxLife;
      tr.mesh.scale.setScalar(1 + tu * .9);
      tr.mat.opacity = Math.max(0, .78 * (1 - tu));
      if (tr.life >= tr.maxLife) {
        scene.remove(tr.mesh);
        ballTrailRings.splice(i, 1);
      }
    }

    if (ballFly) {
      ballFly.t += dt;
      var u = clamp(ballFly.t / ballFly.dur, 0, 1);
      var p = ballFly.from.clone().lerp(ballFly.to, u);
      p.y += Math.sin(u * Math.PI) * ballFly.arc;
      p.z += Math.sin(u * Math.PI) * ballFly.curve;
      ball.position.copy(p);
      ball.rotation.z += dt * 20;
      ball.rotation.x += dt * 11;

      trailTimer += dt;
      if (trailTimer >= 0.028) {
        trailTimer = 0;
        spawnBallTrailRing(p, ballFly.colHex || 0xffd84a);
        K.fx.puff(p.clone(), 1, { color: 0xffffff, size: .24, life: .32, opacity: .55 });
      }
      if (u >= 1) {
        var f = ballFly.done;
        ballFly = null;
        if (f) f();
      }
    }
    if (ballPhys) {
      var b = ballPhys;
      b.v.y -= 12 * dt;
      b.v.multiplyScalar(1 - .6 * dt);
      ball.position.addScaledVector(b.v, dt);
      if (ball.position.y < .11) {
        ball.position.y = .11;
        if (Math.abs(b.v.y) > 1) {
          b.v.y = -b.v.y * .5;
          K.sfx('thud', .4);
        } else b.v.y = 0;
        b.v.x *= .9;
        b.v.z *= .9;
      }
      if (b.inGoal) {
        ball.position.x = Math.max(GX - GD + .15, Math.min(GX - .15, ball.position.x));
        ball.position.z = clamp(ball.position.z, -GW / 2 + .15, GW / 2 - .15);
      }
      ball.rotation.z -= b.v.x * dt * 8;
    }
  });

  /* ---------------- 3D Active Turn Ring & Arrow ---------------- */
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(
      new T3.TorusGeometry(.78, .07, 12, 32),
      new T3.MeshBasicMaterial({ color: 0x2fc58a })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .12;
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
      cone.position.y = 2.35 + Math.sin(t * 5.5) * .16;
      cone.rotation.y = t * 2.8;
    });
    return {
      set: function (ti) {
        if (ti < 0 || ti >= nTeams || !chars[ti]) { g.visible = false; return; }
        g.visible = true;
        ring.material.color.setHex(TEAMS[ti].hex);
        g.position.copy(chars[ti].holder.position);
      }
    };
  })();

  /* ---------------- characters ---------------- */
  var chars = [], teamRings = [], keeper = null;
  function lineupSpot(i) { return V(-2 + i * 1.7, 0, 8.5); }
  function holderize(ch, pos) {
    var h = new T3.Group();
    h.add(ch.root);
    scene.add(h);
    ch.holder = h;
    h.position.copy(pos);
    return h;
  }
  function syncCharactersForTeamCount() {
    TEAMS = ALL_TEAMS.slice(0, nTeams);
    chars.forEach(function (ch, i) {
      var vis = i < nTeams;
      ch.holder.visible = vis;
      if (teamRings[i]) teamRings[i].visible = vis;
      if (vis) {
        var sp = lineupSpot(i);
        ch.holder.position.copy(sp);
        ch.holder.rotation.set(0, 0, 0);
        ch.root.rotation.set(0, -.3, 0);
        if (teamRings[i]) teamRings[i].position.copy(sp).setY(.035);
      }
    });
    boardDraw();
  }
  K.onFrame(function (dt) {
    var showLabels = /title|turn|question/.test(phase);
    chars.forEach(function (c, i) {
      c.update(dt);
      if (c.label) c.label.visible = showLabels && i < nTeams;
    });
    if (keeper) {
      keeper.update(dt);
      if (keeper.label) keeper.label.visible = showLabels;
    }
  });

  /* ---------------- camera ---------------- */
  function fov(f) {
    if (K.camera.fov !== f) {
      K.camera.fov = f;
      K.camera.updateProjectionMatrix();
    }
  }
  function shot(name, extra) {
    K.cam.follow = null;
    fov(/aim|ball|run|replaycam/.test(name) ? 32 : 44);
    if (name === 'title') {
      K.cam.follow = function () {
        var a = K.now * .1;
        K.cam.tPos.set(SPOT + 10 + Math.sin(a) * 3, 3.5, 9 + Math.cos(a) * 2);
        K.cam.tLook.set(GX + 3, 1.2, 0);
      };
      K.cam.k = 1.5;
    }
    if (name === 'lineup') K.cam.set(V(1.5, 2.6, 15.5), V(.5, .4, 7), 2.5);
    if (name === 'aim') { fov(34); K.cam.set(V(SPOT + 6.5, 2.5, -.6), V(GX, .25, 0), 2.5); }
    if (name === 'run') K.cam.set(V(SPOT + 5.5, 1.8, 2.2), V(GX, 1.0, 0), 3);
    if (name === 'ball') {
      K.cam.k = 4;
      K.cam.follow = function () {
        var p = ball.position;
        K.cam.tPos.set(Math.max(GX + 6, p.x + 5), 1.7, p.z * .4 + 1.2);
        K.cam.tLook.set(GX, 1.1, p.z * .5);
      };
    }
    if (name === 'goalcam') K.cam.set(V(GX + 6, 1.6, 5.5), V(GX - .6, 1.1, extra || 0), 3);
    if (name === 'replaycam') {
      // Dramatic second-camera angle from the opposite front corner of the six-yard box
      var sideZ = (extra || 0) >= 0 ? -6.2 : 6.2;
      K.cam.set(V(GX + 4.4, 1.45, sideZ), V(GX - .3, 1.15, (extra || 0) * .5), 4.2);
    }
    if (name === 'celebrate') {
      K.cam.follow = function () {
        var c = extra.holder.position;
        K.cam.tPos.set(c.x + 3, 1.8, c.z + 3);
        K.cam.tLook.set(c.x, 1, c.z);
      };
      K.cam.k = 2.5;
    }
    if (name === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .5;
        K.cam.tPos.set(SPOT + 6.8, 3.6, a * 1.6);
        K.cam.tLook.set(SPOT - 1.2, .35, 0);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer to earn your penalty kick!' },
    { ico: '🎯', c: '#4f9dff', t: '2. Aim at the Goal!', s: 'Pull back to aim or tap one of the 6 target zones in the goal!' },
    { ico: '⚽', c: '#2fc58a', t: '3. Shoot Past the Keeper!', s: 'Score into the rippling net and watch the slow-mo goal replay!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.pn-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'pn-howto-modal'));
    var card = K.el('div', 'pn-howto-card');
    card.innerHTML = '<h2 class="pn-howto-title">⚽ How to Play Penalty Shootout 3D</h2>';
    var grid = K.el('div', 'pn-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'pn-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="pn-step-num">' + (idx + 1) + '</span>' +
        '<div class="pn-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'pn-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);

    var gotIt = K.el('button', 'btn green', '👍 Got it! Kick Off!');
    gotIt.onclick = function () {
      try { localStorage.setItem('eaa_howto_penalty3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(gotIt);
    modal.appendChild(card);
    K.say('How to play Penalty Shootout! Step 1: Answer the question. Step 2: Aim at the goal. Step 3: Shoot past the keeper to score!');
  }

  function addHelpTopButton() {
    var top = document.querySelector('.k3-top');
    if (!top || top.querySelector('.k3-help-btn')) return;
    var helpBtn = K.el('button', 'k3-icon k3-help-btn', '?');
    helpBtn.title = 'How to play';
    helpBtn.onclick = function () { openHowTo(); };
    top.insertBefore(helpBtn, top.firstChild);
  }

  /* ---------------- HUD: turn banner & live shootout scorecard ---------------- */
  var hud, active = 0, round = 1, phase = 'loading', demoTurn = 0, DEMO_WRONG = [2, 6];
  var turnBannerEl = null, liveBoardEl = null;
  var fpsAvg = 60;
  K.onFrame(function (dt) {
    if (dt > 0.0005 && dt < 0.5) fpsAvg = fpsAvg * 0.92 + (1 / dt) * 0.08;
  });
  window.__penalty3d = {
    openHowTo: openHowTo,
    getFps: function () { return Math.round(fpsAvg); }
  };

  function updateTurnUI(ti, msg) {
    turnMarker.set(ti);
    if (!turnBannerEl) return;
    if (ti < 0 || ti >= nTeams) {
      turnBannerEl.style.display = 'none';
      return;
    }
    var t = TEAMS[ti];
    turnBannerEl.style.display = 'inline-flex';
    turnBannerEl.style.setProperty('--c', t.c);
    turnBannerEl.innerHTML =
      '<span class="pn-turn-dot"></span>' +
      '<span>⚽ Team ' + t.name + '\'s Kick · ' + (msg || ('Kick ' + round + ' of ' + KICKS)) + '</span>';
  }

  function renderKickDots(t) {
    var html = '';
    for (var k = 0; k < KICKS; k++) {
      var res = t.history[k];
      if (res === 'goal') html += '<span class="pn-kdot goal">⚽</span>';
      else if (res) html += '<span class="pn-kdot miss">✕</span>';
      else html += '<span class="pn-kdot">·</span>';
    }
    return html;
  }

  function updateLiveScoreUI(activeTi) {
    if (!liveBoardEl) return;
    var rows = TEAMS.map(function (t, i) {
      return '<div class="pn-live-row' + (i === activeTi ? ' on' : '') + '" style="--c:' + t.c + '">' +
        '<b>' + t.name + '</b>' +
        '<div class="pn-kdots">' + renderKickDots(t) + '</div>' +
        '<span>' + t.score + '</span>' +
      '</div>';
    }).join('');
    liveBoardEl.innerHTML = '<div class="pn-live-head">⚽ Shootout (' + round + '/' + KICKS + ')</div>' + rows;
  }

  /* ---------------- flow ---------------- */
  function title() {
    phase = 'title';
    window.__k3phase = 'title';
    podiumGroup.visible = false;
    syncCharactersForTeamCount();
    shot('title');
    K.cam.snap();

    K.ui.clear();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Penalty Shootout 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#2fc58a;font-size:1.45rem">⚽ Penalty Shootout — answer right, aim at the goal, and SHOOT!</div>';

    // Quick Setup Row: Teams (2..4) and Kicks per team (2..5)
    var setup = K.el('div', 'pn-setup');
    var teamGrp = K.el('div', 'pn-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'pn-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        syncCharactersForTeamCount();
        teamGrp.querySelectorAll('.pn-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
        box.querySelectorAll('.setpick, .clsbox').forEach(function (el) { el.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      teamGrp.appendChild(b);
    });

    var kickGrp = K.el('div', 'pn-setup-grp', '<span>⚽ Kicks:</span>');
    [2, 3, 5].forEach(function (kc) {
      var b = K.el('button', 'pn-pill' + (kc === KICKS ? ' on' : ''), kc + ' kicks');
      b.onclick = function () {
        KICKS = kc;
        boardDraw();
        kickGrp.querySelectorAll('.pn-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
      };
      kickGrp.appendChild(b);
    });
    setup.appendChild(teamGrp);
    setup.appendChild(kickGrp);
    box.appendChild(setup);

    var rows = K.el('div', 'rows');
    var howBtn = K.el('button', 'btn soft', '❓ How to Play');
    howBtn.onclick = function () { openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Kick Off!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['hello', 'correct', 'wrong', 'whistle', 'kick', 'goal', 'save', 'post', 'boo', 'win', 'whoosh', 'thud']);
      K.cls.assign(TEAMS);
      start();
    };
    rows.appendChild(howBtn);
    rows.appendChild(go);
    box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();
    addHelpTopButton();

    chars.slice(0, nTeams).forEach(function (c, i) {
      K.after(.35 + i * .4, function () {
        if (phase === 'title') {
          c.setState('hello');
          K.after(1.3, function () { if (phase === 'title') c.setState('idle'); });
        }
      });
    });

    var seenHowTo = false;
    try { seenHowTo = localStorage.getItem('eaa_howto_penalty3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' ⚽'; });
    hud.refresh(-1);
    turnBannerEl = K.ui.add(K.el('div', 'pn-turn-banner'));
    turnBannerEl.style.display = 'none';
    liveBoardEl = K.ui.add(K.el('div', 'pn-live-board'));
    updateLiveScoreUI(-1);

    phase = 'intro';
    window.__k3phase = 'intro';
    K.sfx('whistle');
    K.sfx('whoosh');
    K.cam.set(V(GX + 16, 7, 14), V(GX, 1, 0), 1.2);
    K.after(1.6, function () { active = 0; turn(); });
  }

  function turn() {
    phase = 'turn';
    window.__k3phase = 'turn';
    hud.refresh(active);
    boardDraw();
    updateTurnUI(active, 'Kick ' + round + ' of ' + KICKS + ' · Answer right to shoot!');
    updateLiveScoreUI(active);

    var ch = chars[active], team = TEAMS[active];
    keeper.setState('keeper');
    shot('lineup');
    ch.setState('hello');
    K.sfx('hello');
    K.ui.toast('Round ' + round + ' of ' + KICKS + ' · Team ' + team.name, 1.5, team.c);

    K.after(.9, function () {
      ch.setState('idle');
      phase = 'question';
      window.__k3phase = 'question';
      demoTurn++;
      K.ui.ask(QS.next(), team, {
        prompt: 'answer right to take the penalty kick!',
        demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
        onAnswer: function (ok) {
          if (!ok) return noKick(ch, team);
          K.sfx('correct');
          K.fx.burst(ch.holder.position.clone().add(V(0, 1.2, 0)), 18, { color: [team.hex, 0xffd84a], speed: 4, size: .14, life: .55 });
          walkToBall(ch, function () { aim(ch, team); });
        }
      });
    });
  }

  /* wrong answer: no kick at all, the turn passes on */
  function noKick(ch, team) {
    phase = 'oops';
    window.__k3phase = 'oops';
    team.kicks++;
    team.history.push('miss');
    boardDraw();
    updateLiveScoreUI(active);
    ch.playClip ? ch.playClip('HandsHead', { fade: 0.16 }) : ch.setState('headhands');
    keeper.playClip ? keeper.playClip('TugWin', { fade: 0.16 }) : keeper.setState('cheer');
    K.sfx('wrong');
    K.ui.big('No kick this turn!', 1.25, true);
    K.ui.toast('Good try! Next team steps up to the spot.', 1.8, team.c);
    K.after(1.9, next);
  }

  function walkToBall(ch, done) {
    phase = 'walk';
    window.__k3phase = 'walk';
    var from = ch.holder.position.clone(), to = V(SPOT + 2.6, 0, .9), t = 0, dur = .95;
    if (ch.playClip) ch.playClip('SprintRun', { speed: 1.15, fade: 0.15 });
    else ch.setState('run');
    ch.speed = 3;
    var fn = K.onFrame(function (dt) {
      t += dt;
      var u = clamp(t / dur, 0, 1);
      ch.holder.position.lerpVectors(from, to, K.ease(u));
      turnMarker.set(active);
      var d = to.clone().sub(from);
      ch.root.rotation.y = Math.atan2(d.x, d.z);
      if (u >= 1) {
        K.offFrame(fn);
        if (ch.playClip) ch.playClip('SoccerReady', { fade: 0.18 });
        else ch.setState('idle');
        ch.root.rotation.y = -Math.PI / 2 - .3;
        done();
      }
    });
    shot('run');
  }

  /* ---- aiming: pull back and let go, OR tap one of the 6 target zones ---- */
  var aimArrow = (function () {
    var g = new T3.Group(), m = new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9, depthTest: false });
    var shaft = new T3.Mesh(new T3.BoxGeometry(1, .03, .16), m);
    shaft.position.x = -.5;
    g.add(shaft);
    var head = new T3.Mesh(new T3.ConeGeometry(.22, .45, 3), m);
    head.rotation.z = Math.PI / 2;
    head.rotation.x = Math.PI / 2;
    g.add(head);
    g.children.forEach(function (c) { c.renderOrder = 9; });
    g.visible = false;
    scene.add(g);
    g.userData.m = m;
    return g;
  })();

  var reticle = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(new T3.RingGeometry(.28, .38, 32), new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, depthTest: false }));
    var dot = new T3.Mesh(new T3.CircleGeometry(.08, 16), new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, depthTest: false }));
    ring.renderOrder = dot.renderOrder = 9;
    g.add(ring);
    g.add(dot);
    g.rotation.y = Math.PI / 2;
    g.visible = false;
    scene.add(g);
    g.userData.ring = ring;
    return g;
  })();

  var SOFT = .35, STRONG = .86;
  function shotFrom(angle, power) {
    var z = -(angle / (Math.PI / 4)) * 4.4;
    var y = .25 + power * 1.75 + Math.max(0, power - STRONG) * 14;
    return { z: z, y: y, power: power };
  }
  function zoneColor(p) { return p < SOFT ? 0x8fc3ff : p <= STRONG ? 0x34c991 : 0xff5f5f; }
  function zoneText(p) { return p < SOFT ? 'Too soft' : p <= STRONG ? '⚡ Sweet Power!' : 'Too strong!'; }
  function showAim(angle, power) {
    var s = shotFrom(angle, power), col = zoneColor(power);
    aimArrow.visible = true;
    aimArrow.position.set(SPOT - .2, .06, 0);
    aimArrow.rotation.y = Math.atan2(-s.z, GX - SPOT);
    aimArrow.scale.set(.6 + power * 3.2, 1, 1);
    aimArrow.userData.m.color.setHex(col);
    reticle.visible = true;
    reticle.position.set(GX + .06, Math.min(s.y, GH + .9), s.z);
    reticle.userData.ring.material.color.setHex(col);
    if (meter) {
      meter.fill.style.height = (power * 100) + '%';
      meter.fill.style.background = '#' + col.toString(16).padStart(6, '0');
      meter.lab.textContent = zoneText(power);
    }
  }
  function hideAim() {
    aimArrow.visible = false;
    reticle.visible = false;
    targets.forEach(function (tg) { tg.visible = false; tg.userData.hot = false; });
    if (meter) { meter.el.remove(); meter = null; }
  }
  var meter = null;
  function makeMeter(team) {
    var el = K.ui.add(K.el('div', 'powermeter'));
    el.innerHTML = '<div class="pm-bar"><div class="pm-zone"></div><div class="pm-fill"></div></div><div class="pm-lab">Power</div>';
    el.style.setProperty('--c', team.c);
    meter = { el: el, fill: el.querySelector('.pm-fill'), lab: el.querySelector('.pm-lab') };
  }

  function aim(ch, team) {
    phase = 'aim';
    window.__k3phase = 'aim';
    shot('aim');
    makeMeter(team);
    updateTurnUI(active, 'Pull back to aim OR tap a Target Zone (1–6)!');
    targets.forEach(function (tg) { tg.visible = true; tg.userData.hot = false; });

    var pad = K.ui.add(K.el('div', 'aimpad'));
    pad.style.cssText = 'position:fixed;inset:0;touch-action:none;cursor:grab;z-index:20';

    // Smartboard Quick-Shot Target Bar at bottom
    var aimBar = K.ui.add(K.el('div', 'pn-aim-bar'));
    aimBar.style.setProperty('--c', team.c);
    aimBar.innerHTML = '<div>🎯 Pull back anywhere on screen OR tap a Goal Target Zone!</div>';
    var tGrid = K.el('div', 'pn-target-btns');
    var start = null, angle = 0, power = 0, done = false;

    TARGETS.forEach(function (tz, idx) {
      var tb = K.el('button', 'pn-tbtn', (idx + 1) + ' · ' + tz[2]);
      tb.onmouseenter = function () {
        targets[idx].userData.hot = true;
        var a = -(tz[0] / 4.4) * (Math.PI / 4);
        var p = clamp((tz[1] - .25) / 1.75, .48, .82);
        showAim(a, p);
      };
      tb.onmouseleave = function () { targets[idx].userData.hot = false; };
      tb.onclick = function () {
        angle = -(tz[0] / 4.4) * (Math.PI / 4);
        power = clamp((tz[1] - .25) / 1.75, .52, .80);
        showAim(angle, power);
        fire();
      };
      tGrid.appendChild(tb);
    });
    aimBar.appendChild(tGrid);

    function upd(e) {
      var px = start.x - e.clientX, py = start.y - e.clientY, s = Math.min(innerWidth, innerHeight);
      var len = Math.hypot(px, py);
      if (len < 6) return;
      angle = clamp(Math.atan2(px, -py), -Math.PI / 3, Math.PI / 3);
      power = clamp(len / (s * .42), 0, 1);
      showAim(angle, power);
    }
    pad.addEventListener('pointerdown', function (e) {
      start = { x: e.clientX, y: e.clientY };
      pad.setPointerCapture(e.pointerId);
    });
    pad.addEventListener('pointermove', function (e) { if (start) upd(e); });
    pad.addEventListener('pointerup', function (e) {
      if (!start) return;
      upd(e);
      start = null;
      if (power > .1) fire();
    });
    function key(e) {
      if (e.key === 'ArrowLeft') angle = clamp(angle + .05, -Math.PI / 3, Math.PI / 3);
      if (e.key === 'ArrowRight') angle = clamp(angle - .05, -Math.PI / 3, Math.PI / 3);
      if (e.key === 'ArrowUp') power = clamp(power + .04, 0, 1);
      if (e.key === 'ArrowDown') power = clamp(power - .04, 0, 1);
      showAim(angle, power);
      if ((e.key === ' ' || e.key === 'Enter') && power > .1) { e.preventDefault(); fire(); }
    }
    addEventListener('keydown', key);

    function fire() {
      if (done) return;
      done = true;
      removeEventListener('keydown', key);
      pad.remove();
      aimBar.remove();
      var s = shotFrom(angle, power);
      K.after(.22, function () { hideAim(); kick(ch, team, s); });
    }
    if (K.DEMO) {
      var ta = rnd(-.68, .68), tp = rnd(.55, .82), t = 0;
      K.after(.65, function () {
        var fn = K.onFrame(function (dt) {
          t += dt;
          var u = clamp(t / 1.0, 0, 1), e = K.ease(u);
          angle = ta * e;
          power = tp * e;
          showAim(angle, power);
          if (u >= 1) { K.offFrame(fn); K.after(.25, fire); }
        });
      });
    }
  }

  /* decide what happens: skill first, then a fair duel with the keeper */
  function decide(s) {
    var az = Math.abs(s.z);
    if (s.y > GH + .12) return { outcome: 'over', target: V(GX - .6, s.y + .4, s.z) };
    if (az > GW / 2 + .12) return { outcome: 'wide', target: V(GX - .6, Math.max(.4, s.y), s.z) };
    if (az > GW / 2 - .16 || s.y > GH - .14) return { outcome: 'post', target: V(GX, Math.min(s.y, GH), clamp(s.z, -GW / 2, GW / 2)) };
    var target = V(GX - .2, s.y, s.z);
    if (s.power < SOFT) return { outcome: 'save', soft: true, target: target, keeperZ: s.z };
    var zone = s.z < -1.25 ? -1 : s.z > 1.25 ? 1 : 0;
    var r = Math.random(), guess = r < .36 ? -1 : r < .72 ? 1 : 0;
    var corner = az > 2.65;
    var saved = guess === zone && !corner;
    return { outcome: saved ? 'save' : 'goal', target: target, keeperZ: saved ? s.z : guess * 2.4 };
  }

  function kick(ch, team, s) {
    phase = 'kick';
    window.__k3phase = 'kick';
    var d = decide(s);
    var from = ch.holder.position.clone(), to = V(SPOT + .55, 0, .28), t = 0;
    if (ch.playClip) ch.playClip('SprintRun', { speed: 1.55, fade: 0.12 });
    else ch.setState('run');
    ch.speed = 5;
    shot('run');
    var fn = K.onFrame(function (dt) {
      t += dt;
      var u = clamp(t / .68, 0, 1);
      ch.holder.position.lerpVectors(from, to, u);
      if (u >= 1) {
        K.offFrame(fn);
        if (ch.playClip) ch.playClip('SoccerKick', { once: true, speed: 1.35, fade: 0.08, restart: true });
        else ch.setState('kick');
        K.after(.24, function () { strike(ch, team, s, d); });
      }
    });
  }

  function strike(ch, team, s, d) {
    K.sfx('kick');
    K.cam.shake(.08 + s.power * .12);
    K.fx.puff(V(SPOT, .1, 0), 5 + Math.round(s.power * 6), { color: 0xe9f6d8, size: .52 });
    var dur = lerp(1.05, .48, s.power);
    var diveDur = d.soft ? Math.max(.52, dur * .82) : Math.max(.52, dur * .88);
    K.after(d.soft ? .18 : .05, function () {
      keeperDive(d.keeperZ !== undefined ? d.keeperZ : rnd(-1.5, 1.5), d.outcome === 'save' ? d.target.y : rnd(.6, 1.5), diveDur, d.outcome === 'save' && !d.soft);
    });
    ballFly = {
      t: 0,
      dur: dur,
      from: ball.position.clone(),
      to: d.target,
      arc: d.outcome === 'over' ? 1.1 : .15 + (1 - s.power) * .5,
      curve: s.z * -.08,
      colHex: team.hex,
      done: function () { arrive(ch, team, s, d); }
    };
    shot('ball');
    if (d.outcome === 'goal' || (d.outcome === 'save' && !d.soft)) {
      K.timeScale = .55;
      K.after(.42, function () { K.timeScale = 1; });
    }
  }

  function keeperDive(z, y, dur, forceDive) {
    var h = keeper.holder, z0 = h.position.z, t = 0, side = Math.sign(z - z0) || 1;
    var reach = Math.min(3.3, Math.abs(z - z0)), walk = !forceDive && dur > .75 && reach < 1.0;
    if (keeper.playClip) {
      keeper.playClip(walk ? 'KeeperReady' : (side > 0 ? 'KeeperDiveL' : 'KeeperDiveR'), { once: !walk, speed: 1.25, fade: 0.1, restart: true });
    } else {
      keeper.setState(walk ? 'keeper' : 'dive');
    }
    var fn = K.onFrame(function (dt) {
      t += dt;
      var u = clamp(t / dur, 0, 1);
      if (walk) {
        h.position.z = z0 + side * reach * K.ease(u);
        h.position.y = Math.sin(u * Math.PI) * .25;
        if (u >= 1) K.offFrame(fn);
        return;
      }
      h.position.z = z0 + side * reach * K.ease(u);
      h.position.y = Math.sin(u * Math.PI) * Math.min(.9, Math.max(.48, y * .58)) + u * .2;
      h.rotation.x = side * u * (reach < .6 ? .38 : (y > 1.3 ? .98 : 1.28));
      if (u >= 1) {
        K.offFrame(fn);
        K.fx.puff(h.position.clone().setY(.15), 5, { color: 0xe9f6d8, size: .45 });
      }
    });
  }

  // Second-camera slow-motion goal replay!
  function playSlowMoGoalReplay(team, s, d, onDone) {
    var badge = K.ui.add(K.el('div', 'pn-replay-badge'));
    badge.innerHTML = '<span class="pn-replay-rec"></span><span>🎥 SLOW-MO GOAL REPLAY</span>';

    keeperHome();
    resetBall();
    shot('replaycam', d.target.z);
    K.timeScale = 0.36;

    var replayDur = .46;
    keeperDive(d.keeperZ !== undefined ? d.keeperZ : 1.5, rnd(.6, 1.5), replayDur * .92, true);
    ballFly = {
      t: 0,
      dur: replayDur,
      from: V(SPOT, .11, 0),
      to: d.target.clone(),
      arc: .15 + (1 - s.power) * .45,
      curve: s.z * -.08,
      colHex: team.hex,
      done: function () {
        net.y = d.target.y;
        net.z = d.target.z;
        net.V = 11;
        ballPhys = { v: V(-3, -1, 0), inGoal: true };
        K.fx.ring(d.target.clone(), team.hex, 3.8);
        setTimeout(function () {
          K.timeScale = 1;
          badge.remove();
          if (onDone) onDone();
        }, 420);
      }
    };
  }

  function reaction(ch, good, after) {
    K.after(.3, function () {
      keeper.holder.rotation.set(0, 0, 0);
      keeper.holder.position.y = 0;
      if (ch.playClip) ch.playClip(good ? 'TugWin' : 'HandsHead', { fade: 0.16 });
      else ch.setState(good ? 'cheer' : 'headhands');
      if (keeper.playClip) keeper.playClip(good ? 'HandsHead' : 'TugWin', { fade: 0.16 });
      else keeper.setState(good ? 'sad' : 'cheer');
      shot('celebrate', ch);
    });
    K.after(after, next);
  }

  function arrive(ch, team, s, d) {
    var o = d.outcome, target = d.target;
    team.kicks++;
    team.history.push(o === 'goal' ? 'goal' : 'miss');
    boardDraw();
    updateLiveScoreUI(active);

    if (o === 'goal') {
      net.y = target.y;
      net.z = target.z;
      net.V = 11.5;
      ballPhys = { v: V(-3, -1, 0), inGoal: true };
      team.score++;
      boardDraw();
      updateLiveScoreUI(active);
      K.sfx('goal');
      crowdHype = 1;
      K.cam.shake(.32);
      K.fx.confetti(V(GX - 1, 3, 0), 160);
      K.fx.ring(target.clone(), team.hex, 4.2);
      K.ui.big(Math.abs(target.z) > 2.65 ? '🌟 TOP CORNER GOAL!' : '⚽ GOAL!', 1.5, true);
      shot('goalcam', target.z);
      hud.refresh(active);
      hud.bump(active);

      // Trigger Second-Camera Slow-Mo Goal Replay after initial celebration!
      K.after(1.05, function () {
        playSlowMoGoalReplay(team, s, d, function () {
          reaction(ch, true, 1.5);
        });
      });
    } else if (o === 'save') {
      ballPhys = null;
      K.sfx('save');
      K.cam.shake(.2);
      ball.position.copy(keeper.holder.position).add(V(.3, d.soft ? .9 : .5, 0));
      K.ui.big(d.soft ? '🧤 Too soft — easy catch!' : '🧤 GREAT SAVE!', 1.4, true);
      shot('goalcam', target.z);
      K.after(.8, function () { ballPhys = { v: V(4, 3, rnd(-1, 1)) }; });
      reaction(ch, false, 2.4);
    } else if (o === 'post') {
      K.sfx('post');
      K.cam.shake(.25);
      K.fx.ring(target.clone(), 0xffffff, 3);
      ballPhys = { v: V(5, 2, -Math.sign(target.z || 1) * 2.5) };
      K.ui.big(target.y >= GH - .02 ? '💥 Off the crossbar!' : '💥 Off the post!', 1.35, true);
      shot('goalcam', 0);
      reaction(ch, false, 2.2);
    } else {
      ballPhys = { v: V(-6, o === 'over' ? 2 : 0, o === 'wide' ? Math.sign(target.z) * 2 : 0) };
      K.sfx('boo');
      K.ui.big(o === 'over' ? '🚀 Over the bar!' : '💨 Wide!', 1.35, true);
      reaction(ch, false, 2.1);
    }
  }

  function next() {
    var ch = chars[active];
    K.fx.puff(ch.holder.position.clone().setY(.3), 8, { size: .9 });
    ch.holder.position.copy(lineupSpot(active));
    ch.root.rotation.set(0, -.3, 0);
    ch.setState('idle');
    keeperHome();
    resetBall();
    active++;
    if (active >= TEAMS.length) { active = 0; round++; }
    if (round > KICKS) return finish();
    turn();
  }

  function keeperHome() {
    var h = keeper.holder;
    h.position.set(GX + .7, 0, 0);
    h.rotation.set(0, 0, 0);
    keeper.setState('keeper');
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    podiumGroup.visible = true;
    // Camera in 'podium' shot is at x = SPOT + 6.8 looking towards -X (x = SPOT - 1.2), so +Z is on the left
    var stepSpecs = [
      { rank: 1, z: 0,    h: 1.22, w: 1.9, col: 0xffd84a },
      { rank: 2, z: 2.1,  h: 0.85, w: 1.7, col: 0xdce4f2 },
      { rank: 3, z: -2.1, h: 0.62, w: 1.7, col: 0xf0a868 },
      { rank: 4, z: -4.1, h: 0.40, w: 1.5, col: 0xe9e2f5 }
    ];
    var px = SPOT - 1.2;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti];
      var g = new T3.Group();
      g.position.set(px, 0, sp.z);
      podiumGroup.add(g);

      var base = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      base.position.y = sp.h / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.66);
      numLab.position.set(0, sp.h + 2.15, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.52);
        tr.position.set(.35, sp.h + .05, -.58);
        tr.rotation.y = Math.PI / 2;
        g.add(tr);
      }

      if (chars[ti]) {
        chars[ti].holder.position.set(px, sp.h + .06, sp.z + (rk === 0 ? .12 : 0));
        chars[ti].holder.rotation.set(0, 0, 0);
        chars[ti].root.rotation.set(0, Math.PI / 2, 0);
        chars[ti].setState(rk === 0 ? 'cheer' : 'clap');
      }
      if (teamRings[ti]) teamRings[ti].visible = false;
    });
  }

  function finish() {
    phase = 'end';
    window.__k3phase = 'end';
    updateTurnUI(-1);
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();
    hud.refresh(-1);
    boardDraw();

    var best = Math.max.apply(null, TEAMS.map(function (t) { return t.score; }));
    var winners = TEAMS.filter(function (t) { return t.score === best; });
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return TEAMS[b].score - TEAMS[a].score;
    });

    buildPodium3D(order);
    keeperHome();
    keeper.setState('clap');
    shot('podium');
    K.sfx('win');
    crowdHype = 1;
    K.fx.confetti(V(SPOT - 1.2, 4.2, 0), 240);
    var names = winners.map(function (t) { return t.name; }).join(' & ');
    K.ui.big(winners.length > 1 ? '🏆 ' + names + ' Tie!' : '🏆 Team ' + names + ' Wins!', 2.3, true);
    K.say(winners.length > 1 ? 'It is a tie!' : 'Team ' + names + ' wins the penalty shootout!');

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var t = TEAMS[ti];
        return '<div class="pn-table-row" style="--c:' + t.c + '">' +
          '<span class="pn-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<div class="pn-kdots">' + renderKickDots(t) + '</div>' +
          '<i>' + t.score + ' / ' + KICKS + ' ⚽</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + winners[0].c + ';font-size:1.42rem">🏆 ' + (winners.length > 1 ? 'Tie: ' + names : 'Team ' + names + ' Wins the Shootout!') + '</div>' +
        '<div class="pn-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'penalty3d', title: 'Penalty Shootout 3D' });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the pitch ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'penalty', skip: ['goal'] }).catch(function (e) { console.warn('world', e); K.world.ground(0x6fd07a); return null; }) : Promise.resolve(null);
  var keeperP = K.loadGLB(K.ROOT + 'assets/3d/characters/kid-boy.glb').then(function (g) { return new K.Kid(g, 1.62); });
  var gbP = K.tryGLB('models/goal-board.glb').then(function (g) { return g ? K.fitModel(g.scene, 4.4) : null; });
  var fpP = K.tryGLB('models/team-flagpole.glb').then(function (g) { return g ? K.fitModel(g.scene, 3.8) : null; });
  var trP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  Promise.all([worldP, keeperP, gbP, fpP, trP].concat(ALL_TEAMS.map(function (t) {
    return K.loadGLB(K.ROOT + 'assets/3d/characters/kid-' + (t.kid === 'girl' ? 'girl' : 'boy') + '.glb').then(function (g) {
      var kid = new K.Kid(g, 1.45);
      if (K.teamShirt) K.teamShirt(kid, t.kid === 'girl' ? 'girl' : 'boy', t);
      return kid;
    });
  }))).then(function (res) {
    var W = res[0];
    keeper = res[1];
    goalBoardModel = res[2];
    flagpoleModel = res[3];
    trophyModel = res[4];
    placeDecorModels();

    res.slice(5).forEach(function (ch, i) {
      chars.push(ch);
      holderize(ch, lineupSpot(i));
      ch.root.rotation.y = -.3;
      var ring = new T3.Mesh(new T3.RingGeometry(.45, .62, 32), new T3.MeshBasicMaterial({ color: ALL_TEAMS[i].hex }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(lineupSpot(i)).setY(.035);
      scene.add(ring);
      teamRings.push(ring);

      var lab = K.label(ALL_TEAMS[i].name, ALL_TEAMS[i].c);
      lab.position.y = ch.height + .45;
      ch.holder.add(lab);
      ch.label = lab;
    });

    holderize(keeper, V(GX + .7, 0, 0));
    keeper.root.rotation.y = Math.PI / 2;
    ['LeftHand', 'RightHand'].forEach(function (n) {
      var b = null;
      keeper.root.traverse(function (o) { if (o.isBone && o.name.replace(/^mixamorig:?/, '') === n) b = o; });
      if (b) {
        var glove = new T3.Mesh(new T3.SphereGeometry(.09, 12, 8), K.mat(0xffd84a));
        var s = 1 / b.getWorldScale(V(0, 0, 0)).x;
        glove.scale.setScalar(s);
        b.add(glove);
      }
    });
    var kl = K.label('Keeper', '#9b7bff', 200);
    kl.position.y = 2.1;
    keeper.holder.add(kl);
    keeper.label = kl;
    Promise.all([
      K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; }),
      K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; })
    ]).then(function (clipSets) {
      var allClips = (clipSets[0] || []).concat(clipSets[1] || []);
      chars.forEach(function (c) { if (c && c.attachClips) { c.attachClips(allClips); c.playClip('SoccerReady', { startPhase: Math.random() }); } });
      if (keeper && keeper.attachClips) { keeper.attachClips(allClips); keeper.playClip('KeeperReady'); }
    });
    keeper.setState('keeper');

    if (W && W.map) {
      var z = W.zone;
      var stands = W.map.pieces.filter(function (p) { return p.p === 'bleachers'; }).map(function (p) { return { x: p.x - z.x, z: p.z - z.z, r: p.r }; });
      fillStands(stands);
      var sb = W.map.pieces.filter(function (p) { return p.p === 'scoreboard'; })[0];
      if (sb) makeBoard(V(sb.x - z.x, 3.6, sb.z - z.z + .2));
      else makeBoard(V(0, 3.6, -14));
    } else {
      fillStands([]);
      makeBoard(V(0, 3.6, -14));
    }
    syncCharactersForTeamCount();
    resetBall();
    loading.remove();
    title();
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
