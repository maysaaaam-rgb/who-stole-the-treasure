/* Board Game 3D — English Adventure Academy (Easy Peasy Arcade Upgrade)
   Plays at Board Game Meadow in Adventure Park (games/world, zone "board").
   A winding path of 30 colourful themed squares; each team's monster is its playing piece.
   Each turn: answer a question. Right → tap to roll the Giant Die (models/giant-dice.glb) with a 3D tumble and move!
   Wrong → one small step (nobody stands still).
   Ladders animate climbing rung by rung, slides animate curving down the chute, star squares sparkle and give +2.
   First to the treasure chest (models/chest-closed.glb -> opens to models/chest-open.glb with gold fountain!) wins;
   after MAX_ROUNDS the team furthest along wins. Points go to the Class Board at the end.
   Options: ?teams=2..4  ?rounds=4..12  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 40, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4), MAX_ROUNDS = clamp(+K.Q.get('rounds') || 8, 1, 12);
  var TEAMS = [];
  function initTeams() {
    TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) {
      return Object.assign({ pos: 0, rights: 0, stars: 0, ladders: 0, finished: 0 }, t);
    });
  }
  initTeams();
  var QS = K.questions('g3-u5-vocab');

  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x8fdc7a);

  /* ---------------- the board: 30 colourful themed squares winding in rows ---------------- */
  var N = 30, COLS = 6, STEP = 2.55, ROWS = 5;
  var LADDERS = { 3: 10, 14: 23, 17: 20 }, SLIDES = { 28: 21, 22: 15, 11: 2 }, STARS = { 6: 1, 18: 1, 26: 1 };
  function tilePos(n) {
    if (n <= 0) return V(-(COLS - 1) / 2 * STEP - STEP, 0, (ROWS - 1) / 2 * STEP);
    var i = n - 1, row = Math.floor(i / COLS), col = i % COLS;
    if (row % 2) col = COLS - 1 - col;
    return V((col - (COLS - 1) / 2) * STEP, 0, ((ROWS - 1) / 2 - row) * STEP);
  }

  var pastel = [0xffd8ea, 0xd4e8ff, 0xffebc2, 0xcaf4e2];
  var rimCols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a];
  var tiles = [], starCrystals = [], slideCurves = {}, boardGroup = new T3.Group(), podiumGroup = new T3.Group();
  scene.add(boardGroup);
  scene.add(podiumGroup);

  var chestSpot = tilePos(N).add(V(0, .55, 0));
  var chestClosedMesh = null, chestOpenMesh = null, giantDiceMesh = null, trophyModel = null, chestLight = null;
  var flyingCoins = [];

  // Active turn 3D marker
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(new T3.RingGeometry(.55, .75, 32), new T3.MeshBasicMaterial({ color: 0xff5fa2, side: T3.DoubleSide, transparent: true, opacity: .88 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .04;
    g.add(ring);
    var arrow = new T3.Mesh(new T3.ConeGeometry(.16, .34, 12), new T3.MeshLambertMaterial({ color: 0xff5fa2, emissive: 0xff5fa2, emissiveIntensity: .38 }));
    arrow.rotation.x = Math.PI;
    arrow.position.y = 1.82;
    g.add(arrow);
    g.userData.ring = ring;
    g.userData.arrow = arrow;
    g.visible = false;
    scene.add(g);
    K.onFrame(function (dt, t) {
      if (!g.visible) return;
      arrow.position.y = 1.82 + Math.sin(t * 5.2) * .11;
      arrow.rotation.y = t * 2.4;
      var s = 1 + Math.sin(t * 4) * .08;
      ring.scale.set(s, s, 1);
    });
    return g;
  })();

  function updateTurnMarker(ti) {
    if (ti < 0 || ti >= nTeams || !holders[ti]) { turnMarker.visible = false; return; }
    var t = TEAMS[ti];
    turnMarker.visible = true;
    turnMarker.position.copy(holders[ti].position);
    turnMarker.userData.ring.material.color.setHex(t.hex);
    turnMarker.userData.arrow.material.color.setHex(t.hex);
    turnMarker.userData.arrow.material.emissive.setHex(t.hex);
  }

  function buildBoard() {
    while (boardGroup.children.length) boardGroup.remove(boardGroup.children[0]);
    tiles = [];
    starCrystals = [];
    slideCurves = {};

    // Board wooden table frame & sunny cream tabletop
    var base = new T3.Mesh(new T3.BoxGeometry(COLS * STEP + 4.0, .42, ROWS * STEP + 2.6), K.mat(0xc48b52));
    base.position.y = .05;
    base.receiveShadow = true;
    base.castShadow = true;
    boardGroup.add(base);

    var top = new T3.Mesh(new T3.BoxGeometry(COLS * STEP + 3.2, .08, ROWS * STEP + 1.9), K.mat(0xfff6e0));
    top.position.y = .29;
    top.receiveShadow = true;
    boardGroup.add(top);

    // Stepping-stone connector arrows between squares 0 -> 1 -> ... -> 30
    var connGeo = new T3.ConeGeometry(.14, .34, 3);
    var connMat = K.mat(0xe2c799);
    for (var cn = 0; cn < N; cn++) {
      var pA = tilePos(cn), pB = tilePos(cn + 1), mid = pA.clone().lerp(pB, .5);
      var cm = new T3.Mesh(connGeo, connMat);
      cm.position.set(mid.x, .34, mid.z);
      cm.lookAt(pB.x, .34, pB.z);
      cm.rotateX(Math.PI / 2);
      boardGroup.add(cm);
    }

    for (var n = 0; n <= N; n++) {
      var p = tilePos(n);
      var special = LADDERS[n] ? 'ladder' : SLIDES[n] ? 'slide' : STARS[n] ? 'star' : '';
      var col = n === 0 ? 0xffffff : n === N ? 0xffd84a : special === 'ladder' ? 0x92f0b8 : special === 'slide' ? 0xffb3c8 : special === 'star' ? 0xffe86e : pastel[n % 4];
      var rimHex = n === 0 ? 0x2fc58a : n === N ? 0xffb320 : special === 'ladder' ? 0x2fc58a : special === 'slide' ? 0xff5fa2 : special === 'star' ? 0xffb320 : rimCols[n % 4];
      var dest = LADDERS[n] || SLIDES[n] || 0;

      var face = K.canvasTex(256, 256, (function (n, special, rimHex, dest) {
        return function (c, W, H) {
          var hexStr = '#' + ('000000' + rimHex.toString(16)).slice(-6);
          c.fillStyle = '#ffffff';
          c.fillRect(0, 0, W, H);
          // Rounded colourful border frame on tile top
          c.lineWidth = 18;
          c.strokeStyle = hexStr;
          c.strokeRect(12, 12, W - 24, H - 24);

          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillStyle = '#2b1d40';
          if (n === 0) {
            c.font = '900 54px "Trebuchet MS", sans-serif';
            c.fillText('START', W / 2, H / 2 - 14);
            c.font = '900 44px "Trebuchet MS", sans-serif';
            c.fillText('🎲 GO!', W / 2, H / 2 + 44);
          } else if (n === N) {
            c.font = '900 72px "Trebuchet MS", sans-serif';
            c.fillText('🏆', W / 2, H / 2 - 16);
            c.font = '900 38px "Trebuchet MS", sans-serif';
            c.fillText('FINISH 30', W / 2, H - 44);
          } else if (special === 'star') {
            c.font = '900 84px "Trebuchet MS", sans-serif';
            c.fillText('⭐', W / 2, H / 2 - 14);
            c.font = '900 38px "Trebuchet MS", sans-serif';
            c.fillText(n + ' · +2!', W / 2, H - 42);
          } else if (special === 'ladder') {
            c.font = '900 68px "Trebuchet MS", sans-serif';
            c.fillText(String(n), W / 2, H / 2 - 22);
            c.fillStyle = '#148554';
            c.font = '900 36px "Trebuchet MS", sans-serif';
            c.fillText('🪜 UP → ' + dest, W / 2, H - 44);
          } else if (special === 'slide') {
            c.font = '900 68px "Trebuchet MS", sans-serif';
            c.fillText(String(n), W / 2, H / 2 - 22);
            c.fillStyle = '#c82b6e';
            c.font = '900 36px "Trebuchet MS", sans-serif';
            c.fillText('🛝 → ' + dest, W / 2, H - 44);
          } else {
            c.font = '900 92px "Trebuchet MS", sans-serif';
            c.fillText(String(n), W / 2, H / 2 + 4);
          }
        };
      })(n, special, rimHex, dest));

      var sideMat = new T3.MeshStandardMaterial({ color: rimHex, roughness: .42 });
      var topMat = new T3.MeshStandardMaterial({ color: col, map: face, roughness: .35 });
      var tile = new T3.Mesh(new T3.BoxGeometry(STEP * .88, .24, STEP * .88), [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
      tile.position.set(p.x, .43, p.z);
      tile.userData.y0 = .43;
      tile.castShadow = true;
      tile.receiveShadow = true;
      boardGroup.add(tile);
      tiles[n] = tile;

      // Floating 3D spinning golden star crystal above every star square
      if (special === 'star') {
        var stGroup = new T3.Group();
        stGroup.position.set(p.x, 1.25, p.z);
        var stMesh = new T3.Mesh(
          new T3.OctahedronGeometry(.32, 0),
          new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffb320, emissiveIntensity: .45, roughness: .2, metalness: .2 })
        );
        stMesh.scale.set(1, 1.25, .55);
        stGroup.add(stMesh);
        boardGroup.add(stGroup);
        starCrystals.push({ group: stGroup, sq: n, basePos: V(p.x, 1.25, p.z) });
      }
    }

    // Ladders: colourful chunky wooden rails and golden rungs
    Object.keys(LADDERS).forEach(function (a) {
      var A = tilePos(+a).add(V(0, .58, 0)), B = tilePos(LADDERS[a]).add(V(0, .58, 0)), d = B.clone().sub(A), len = d.length(), g = new T3.Group();
      g.position.copy(A.clone().lerp(B, .5));
      g.position.y = .92;
      g.lookAt(B.x, .92, B.z);
      boardGroup.add(g);
      [-.34, .34].forEach(function (x) {
        var r = new T3.Mesh(new T3.BoxGeometry(.12, .12, len * .92), K.mat(0x2fc58a));
        r.position.x = x;
        r.castShadow = true;
        g.add(r);
      });
      var nRungs = Math.round(len / .42);
      for (var k = 0; k < nRungs; k++) {
        var rung = new T3.Mesh(new T3.CylinderGeometry(.045, .045, .68, 8), K.mat(0xffd84a));
        rung.rotation.z = Math.PI / 2;
        rung.position.z = -len * .44 + k * .42 + .18;
        g.add(rung);
      }
    });

    // Slides: smooth curved pastel chutes with side rails and entrance arch
    Object.keys(SLIDES).forEach(function (a, si) {
      var A = tilePos(+a), B = tilePos(SLIDES[a]), mid = A.clone().lerp(B, .5);
      var side = V(-(B.z - A.z), 0, B.x - A.x).normalize().multiplyScalar(.82);
      var curve = new T3.CatmullRomCurve3([V(A.x, 1.55, A.z), V(mid.x + side.x, 1.08, mid.z + side.z), V(B.x, .62, B.z)]);
      slideCurves[+a] = curve;
      var sCol = [0xff5fa2, 0x4f9dff, 0xffb320][si % 3];
      var tube = new T3.Mesh(new T3.TubeGeometry(curve, 44, .22, 12, false), new T3.MeshStandardMaterial({ color: sCol, roughness: .25 }));
      tube.castShadow = true;
      boardGroup.add(tube);
      var post = new T3.Mesh(new T3.CylinderGeometry(.08, .09, 1.15, 10), K.mat(0xffffff));
      post.position.set(A.x, .95, A.z);
      boardGroup.add(post);
    });

    // Giant Dice monument beside START square
    var p0 = tilePos(0);
    if (giantDiceMesh) {
      var monDie = giantDiceMesh.clone(true);
      monDie.scale.multiplyScalar(.82);
      monDie.position.set(p0.x - 1.55, .32, p0.z - .4);
      monDie.rotation.y = .45;
      boardGroup.add(monDie);
    }

    // Closed & Open Treasure Chests at Square 30 (Finish)
    if (chestClosedMesh) {
      chestClosedMesh.position.set(chestSpot.x + .55, .53, chestSpot.z - .42);
      chestClosedMesh.rotation.y = -.4;
      chestClosedMesh.visible = true;
      boardGroup.add(chestClosedMesh);
    }
    if (chestOpenMesh) {
      chestOpenMesh.position.set(chestSpot.x + .55, .53, chestSpot.z - .42);
      chestOpenMesh.rotation.y = -.4;
      chestOpenMesh.visible = false;
      boardGroup.add(chestOpenMesh);
    }
    chestLight = new T3.PointLight(0xffd84a, 2.2, 8);
    chestLight.position.set(chestSpot.x, 2.2, chestSpot.z);
    boardGroup.add(chestLight);
  }

  // Continuous star square rotation, sparkle bursts & flying gold coins from open treasure chest
  var starSparkTick = 0, fpsSamples = [], lastFpsT = performance.now();
  K.onFrame(function (dt, t) {
    var nowMs = performance.now(), realDt = (nowMs - lastFpsT) / 1000;
    lastFpsT = nowMs;
    if (realDt > 0.001 && realDt < 0.25) {
      fpsSamples.push(1 / realDt);
      if (fpsSamples.length > 90) fpsSamples.shift();
    }

    starSparkTick += dt;
    starCrystals.forEach(function (sc, i) {
      sc.group.rotation.y = t * 2.2 + i;
      sc.group.position.y = 1.22 + Math.sin(t * 3.5 + i * 1.4) * .14;
    });
    if (starSparkTick > .65 && starCrystals.length) {
      starSparkTick = 0;
      var pick = starCrystals[(Math.random() * starCrystals.length) | 0];
      K.fx.burst(pick.basePos, 6, { color: [0xffd84a, 0xffffff], speed: 1.8, size: .09, life: .45, gravity: 2 });
    }

    for (var ci = flyingCoins.length - 1; ci >= 0; ci--) {
      var fc = flyingCoins[ci];
      fc.age += dt;
      if (fc.age >= fc.life) {
        scene.remove(fc.mesh);
        flyingCoins.splice(ci, 1);
      } else {
        fc.vy -= 9.5 * dt;
        fc.mesh.position.x += fc.vx * dt;
        fc.mesh.position.y += fc.vy * dt;
        fc.mesh.position.z += fc.vz * dt;
        if (fc.mesh.position.y < .58) {
          fc.mesh.position.y = .58;
          fc.vy = Math.abs(fc.vy) * .42;
        }
        fc.mesh.rotation.y += 10 * dt;
        fc.mesh.rotation.x += 6 * dt;
      }
    }
  });

  function openTreasureChest() {
    if (chestClosedMesh) chestClosedMesh.visible = false;
    if (chestOpenMesh) {
      chestOpenMesh.visible = true;
      var s0 = chestOpenMesh.scale.clone();
      var t0 = K.now;
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .45);
        var b = 1 + Math.sin(u * Math.PI) * .35;
        chestOpenMesh.scale.copy(s0).multiplyScalar(b);
        if (u >= 1) { chestOpenMesh.scale.copy(s0); K.offFrame(fn); }
      });
    }
    if (chestLight) chestLight.intensity = 5.5;
    // Dramatic slow-mo + erupting 3D gold coins from the open chest!
    K.timeScale = 0.32;
    setTimeout(function () { K.timeScale = 1.0; }, 380);
    K.cam.shake(.28);
    var coinGeo = new T3.CylinderGeometry(.18, .18, .05, 14);
    var coinMat = new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffb320, emissiveIntensity: .35, roughness: .2, metalness: .4 });
    for (var i = 0; i < 24; i++) {
      var cm = new T3.Mesh(coinGeo, coinMat);
      cm.position.set(chestSpot.x + .55, 1.0, chestSpot.z - .42);
      scene.add(cm);
      var a = rnd(0, Math.PI * 2), r = rnd(1.2, 3.8);
      flyingCoins.push({
        mesh: cm,
        vx: Math.cos(a) * r,
        vy: rnd(4.2, 7.5),
        vz: Math.sin(a) * r,
        age: 0,
        life: 2.2
      });
    }
  }

  /* ---------------- the Giant Die: 3D tumble + numbered pip faces ---------------- */
  var die = (function () {
    var PIPS = {
      1: [[.5, .5]],
      2: [[.27, .27], [.73, .73]],
      3: [[.25, .25], [.5, .5], [.75, .75]],
      4: [[.27, .27], [.73, .27], [.27, .73], [.73, .73]],
      5: [[.25, .25], [.75, .25], [.5, .5], [.25, .75], [.75, .75]],
      6: [[.27, .22], [.73, .22], [.27, .5], [.73, .5], [.27, .78], [.73, .78]]
    };
    function face(v) {
      return new T3.MeshStandardMaterial({
        roughness: .25,
        map: K.canvasTex(256, 256, function (c, W, H) {
          c.fillStyle = '#fff9eb';
          c.fillRect(0, 0, W, H);
          c.lineWidth = 14;
          c.strokeStyle = '#ffd84a';
          c.strokeRect(8, 8, W - 16, H - 16);
          c.fillStyle = v === 1 ? '#ff5fa2' : v === 6 ? '#2fc58a' : '#4f9dff';
          PIPS[v].forEach(function (p) {
            c.beginPath();
            c.arc(p[0] * W, p[1] * H, 24, 0, Math.PI * 2);
            c.fill();
          });
        })
      });
    }
    // box faces: +x, -x, +y, -y, +z, -z  →  3, 4, 1, 6, 2, 5
    var m = new T3.Mesh(new T3.BoxGeometry(1.3, 1.3, 1.3), [face(3), face(4), face(1), face(6), face(2), face(5)]);
    m.castShadow = true;
    var g = new T3.Group();
    g.add(m);
    g.visible = false;
    scene.add(g);
    var UP = { 1: [0, 0, 0], 6: [Math.PI, 0, 0], 2: [-Math.PI / 2, 0, 0], 5: [Math.PI / 2, 0, 0], 3: [0, 0, Math.PI / 2], 4: [0, 0, -Math.PI / 2] };
    return {
      attachTripo: function (tripoDie) {
        if (!tripoDie) return;
        // Clone a Tripo giant-dice aura ring under the die
        var pad = new T3.Mesh(new T3.CylinderGeometry(.92, 1.0, .14, 24), K.mat(0xffd84a));
        pad.position.y = -.75;
        g.add(pad);
      },
      roll: function (at, value, colorHex, done) {
        g.visible = true;
        g.position.copy(at).add(V(0, 3.6, 0));
        var t0 = K.now, spin = V(rnd(9, 14), rnd(7, 12), rnd(9, 14));
        var target = new T3.Quaternion()
          .setFromEuler(new T3.Euler(UP[value][0], UP[value][1], UP[value][2]))
          .premultiply(new T3.Quaternion().setFromAxisAngle(V(0, 1, 0), rnd(-.4, .4)));
        var start = null, popped = false;
        var fn = K.onFrame(function (dt) {
          var t = K.now - t0;
          if (t < .95) {
            m.rotation.x += spin.x * dt;
            m.rotation.y += spin.y * dt;
            m.rotation.z += spin.z * dt;
            var bounce = Math.abs(Math.sin(t * 7.5)) * 1.85 * (1 - t / .95);
            g.position.y = at.y + 1.35 + bounce;
            var sc = 1 + Math.sin(t * 15) * .08;
            m.scale.setScalar(sc);
          } else {
            if (!start) start = m.quaternion.clone();
            var u = Math.min(1, (t - .95) / .28);
            m.quaternion.copy(start).slerp(target, u);
            m.scale.setScalar(1 + Math.sin(u * Math.PI) * .18);
            g.position.y = at.y + 1.35;
            if (u >= 1 && !popped) {
              popped = true;
              K.offFrame(fn);
              K.sfx('pop');
              K.fx.burst(g.position.clone().add(V(0, .6, 0)), 22, { color: [0xffd84a, colorHex || 0x4f9dff, 0xffffff], speed: 4.5, size: .14, life: .6 });
              K.fx.text('🎲 ' + value + '!', g.position.clone().add(V(0, 1.1, 0)), '#ffb320', 1.15);
              K.after(.65, function () { done(); });
            }
          }
        });
      },
      hide: function () { g.visible = false; }
    };
  })();

  /* ---------------- pieces: hopping square-by-square, climbing ladders, sliding chutes ---------------- */
  var mons = [], holders = [];
  K.onFrame(function (dt) { mons.forEach(function (m) { if (m) m.update(dt); }); });
  function spotOn(n, ti) {
    var p = tilePos(n), here = TEAMS.filter(function (t) { return t.pos === n; }).length, k = ti % 4;
    var off = here > 1 || n === 0 ? [[-.52, -.45], [.52, -.45], [-.52, .45], [.52, .45]][k] : [0, 0];
    return V(p.x + off[0], .55, p.z + off[1]);
  }
  function placeAll(except) {
    if (phase === 'end') return;
    holders.forEach(function (h, i) {
      if (!h) return;
      h.visible = i < nTeams;
      if (i < nTeams && i !== except) h.position.copy(spotOn(TEAMS[i].pos, i));
    });
  }
  function pulseTile(sq, hex) {
    var tl = tiles[sq];
    if (!tl) return;
    var y0 = tl.userData.y0 || .43, t0 = K.now;
    K.fx.puff(V(tl.position.x, .58, tl.position.z), 4, { color: hex || 0xffffff, size: .28 });
    var fn = K.onFrame(function () {
      var u = Math.min(1, (K.now - t0) / .24);
      tl.position.y = y0 - Math.sin(u * Math.PI) * .11;
      if (u >= 1) { tl.position.y = y0; K.offFrame(fn); }
    });
  }

  // Hop one square at a time with squash-and-stretch and tile depression
  function walk(ti, path, done) {
    var h = holders[ti], m = mons[ti], t = TEAMS[ti], k = 0;
    if (m) m.setState('hop');
    (function next() {
      if (k >= path.length) {
        h.scale.set(1, 1, 1);
        if (m) m.setState('idle');
        placeAll();
        updateTurnMarker(ti);
        return done();
      }
      var targetSq = path[k];
      var from = h.position.clone(), to = spotOn(targetSq, ti), t0 = K.now;
      t.pos = targetSq;
      h.rotation.set(0, Math.atan2(to.x - from.x, to.z - from.z), 0);
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .33);
        h.position.lerpVectors(from, to, u);
        h.position.y = to.y + Math.sin(u * Math.PI) * .85;
        var sy = 1 + Math.sin(u * Math.PI) * .18;
        var sx = 1 / Math.sqrt(sy);
        h.scale.set(sx, sy, sx);
        updateTurnMarker(ti);
        if (u >= 1) {
          K.offFrame(fn);
          h.scale.set(1, 1, 1);
          K.sfx('step');
          pulseTile(targetSq, t.hex);
          updateLiveProgressUI(ti);
          k++;
          next();
        }
      });
    })();
  }

  // Climb a ladder rung-by-rung with step bounces & sparkles
  function climbLadder(ti, fromSq, toSq, done) {
    var h = holders[ti], m = mons[ti], t = TEAMS[ti];
    var from = h.position.clone(), end = spotOn(toSq, ti), t0 = K.now, dur = 1.25;
    t.pos = toSq;
    t.ladders++;
    if (m) m.setState('cheer');
    h.rotation.set(0, Math.atan2(end.x - from.x, end.z - from.z), 0);
    var lastRung = -1;
    var fn = K.onFrame(function () {
      var u = Math.min(1, (K.now - t0) / dur);
      h.position.lerpVectors(from, end, u);
      var rungStep = Math.abs(Math.sin(u * Math.PI * 6)) * .38;
      h.position.y = end.y + Math.sin(u * Math.PI) * 1.35 + rungStep;
      h.rotation.z = Math.sin(u * Math.PI * 6) * .14;
      var curRung = Math.floor(u * 6);
      if (curRung !== lastRung) {
        lastRung = curRung;
        K.fx.burst(h.position.clone(), 5, { color: [0x2fc58a, 0xffd84a], speed: 2, size: .1, life: .35 });
      }
      updateTurnMarker(ti);
      if (u >= 1) {
        K.offFrame(fn);
        h.rotation.set(0, 0, 0);
        pulseTile(toSq, 0x2fc58a);
        updateLiveProgressUI(ti);
        if (m) m.setState('cheer');
        K.after(.85, function () {
          if (m) m.setState('idle');
          placeAll();
          done();
        });
      }
    });
  }

  // Slide down the exact curved 3D slide chute with banking & dizzy stars at the bottom
  function rideSlide(ti, fromSq, toSq, done) {
    var h = holders[ti], m = mons[ti], t = TEAMS[ti];
    var curve = slideCurves[fromSq];
    var from = h.position.clone(), end = spotOn(toSq, ti), t0 = K.now, dur = 1.05;
    t.pos = toSq;
    if (m) m.setState('tumble');
    var fn = K.onFrame(function () {
      var u = Math.min(1, (K.now - t0) / dur);
      var e = K.ease(u);
      if (curve) {
        var cp = curve.getPointAt(e);
        h.position.set(cp.x, cp.y + .12, cp.z);
      } else {
        h.position.lerpVectors(from, end, e);
        h.position.y = end.y + Math.sin(u * Math.PI) * 1.1;
      }
      h.rotation.y += .24;
      updateTurnMarker(ti);
      if (u >= 1) {
        K.offFrame(fn);
        h.position.copy(end);
        h.rotation.set(0, 0, 0);
        pulseTile(toSq, 0xff5fa2);
        updateLiveProgressUI(ti);
        if (m) m.setState('dizzy');
        var dz = K.dizzyStars(h, 1.45);
        K.after(.85, function () {
          dz.remove();
          if (m) m.setState('idle');
          placeAll();
          done();
        });
      }
    });
  }

  /* ---------------- camera ---------------- */
  function shot(name, at) {
    K.cam.follow = null;
    if (name === 'title') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .16) * .28;
        K.cam.tPos.set(Math.sin(a) * 18, 15, Math.cos(a) * 18);
        K.cam.tLook.set(0, 0, -.5);
      };
      K.cam.k = 1.4;
    }
    if (name === 'board') K.cam.set(V(0, 15.5, 15), V(0, 0, -.6), 2.2);
    if (name === 'ask') K.cam.set(V(0, 31, 13.5), V(0, 0, 4.4), 2.2);
    if (name === 'follow') {
      K.cam.follow = function () {
        var p = holders[at].position;
        K.cam.tPos.set(p.x * .6, 9.5, p.z + 9);
        K.cam.tLook.set(p.x * .8, .5, p.z - .5);
      };
      K.cam.k = 2.6;
    }
    if (name === 'end') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .28) * 1.5;
        K.cam.tPos.set(a, 4.0, 14.2);
        K.cam.tLook.set(0, .35, 6.8);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer for your team!' },
    { ico: '🎲', c: '#4f9dff', t: '2. Roll the Giant Die', s: 'Tap to roll the giant die and hop along the squares!' },
    { ico: '🏆', c: '#2fc58a', t: '3. Ladders, Stars & Treasure!', s: 'Climb green ladders, get plus two on stars, and open the treasure chest!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.bd-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'bd-howto-modal'));
    var card = K.el('div', 'bd-howto-card');
    card.innerHTML = '<h2 class="bd-howto-title">🎲 How to Play Board Game 3D</h2>';
    var grid = K.el('div', 'bd-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'bd-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="bd-step-num">' + (idx + 1) + '</span>' +
        '<div class="bd-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'bd-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);
    var closeBtn = K.el('button', 'btn green', '👍 Got It! Let’s Roll!');
    closeBtn.onclick = function () {
      try { localStorage.setItem('eaa_howto_board3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(closeBtn);
    modal.appendChild(card);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeBtn.onclick(); });
    K.say('How to play Board Game! Step 1: Listen and tap the right answer. Step 2: Roll the giant die and hop along the squares. Step 3: Climb ladders, hit stars for plus two, and reach the treasure chest!');
  }

  function addHelpTopButton() {
    var tb = document.querySelector('.topbtns');
    if (!tb || tb.querySelector('.bd-help-ibtn')) return;
    var hb = K.el('button', 'ibtn bd-help-ibtn', '❓');
    hb.title = 'How to Play';
    hb.onclick = function () { openHowTo(); };
    tb.insertBefore(hb, tb.firstChild);
  }

  /* ---------------- HUD & Live Race Progress ---------------- */
  var hud = null, turnBannerEl = null, liveBoardEl = null;
  function refresh(active) {
    if (hud) hud.refresh(active);
    updateTurnMarker(active);
    updateLiveProgressUI(active);
  }
  function updateLiveProgressUI(activeI) {
    if (turnBannerEl && activeI >= 0 && TEAMS[activeI]) {
      var t = TEAMS[activeI];
      turnBannerEl.style.setProperty('--c', t.c);
      turnBannerEl.innerHTML = '<span class="bd-turn-dot"></span><span>Round ' + (round + 1) + ' of ' + MAX_ROUNDS + ' · <b>Team ' + t.name + '’s Turn!</b> (Square ' + t.pos + ' / ' + N + ')</span>';
    }
    if (liveBoardEl) {
      var rowsHtml = TEAMS.map(function (t, ti) {
        var pct = Math.round(clamp(t.pos / N, 0, 1) * 100);
        return '<div class="bd-live-row' + (ti === activeI ? ' on' : '') + '" style="--c:' + t.c + '">' +
          '<b>' + t.name + '</b>' +
          '<div class="bd-prog-track"><div class="bd-prog-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="bd-live-sq">' + (t.pos >= N ? '🏆30' : t.pos + '/30') + '</span>' +
        '</div>';
      }).join('');
      liveBoardEl.innerHTML = '<div class="bd-live-head">🗺️ Treasure Race · 30 Squares</div>' + rowsHtml;
    }
  }

  /* ---------------- flow ---------------- */
  var phase = 'loading', round = 0, turnI = 0, demoN = 0, DEMO_WRONG = [3, 8, 12], winner = null;

  function rebuildSetup(newTeams, newRounds) {
    nTeams = clamp(newTeams || nTeams, 2, 4);
    MAX_ROUNDS = clamp(newRounds || MAX_ROUNDS, 1, 12);
    initTeams();
    placeAll();
  }

  function title() {
    phase = 'title';
    window.__k3phase = 'title';
    winner = null;
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    if (chestClosedMesh) chestClosedMesh.visible = true;
    if (chestOpenMesh) chestOpenMesh.visible = false;
    updateTurnMarker(-1);
    placeAll();
    K.ui.clear();
    shot('title');
    K.cam.snap();

    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Board Game 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.45rem">🎲 Answer right to roll the Giant Die! Race to the Treasure Chest!</div>' +
      '<div class="say" style="--c:#2fc58a">🪜 Ladders go up · 🛝 slides go down · ⭐ = 2 bonus steps · ' + MAX_ROUNDS + ' rounds</div>';

    var setup = K.el('div', 'bd-setup');
    var tGrp = K.el('div', 'bd-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (nt) {
      var b = K.el('button', 'bd-pill' + (nt === nTeams ? ' on' : ''), String(nt));
      b.onclick = function () {
        K.sfx('hello');
        rebuildSetup(nt, MAX_ROUNDS);
        title();
      };
      tGrp.appendChild(b);
    });
    var rGrp = K.el('div', 'bd-setup-grp', '<span>🔄 Rounds:</span>');
    [4, 6, 8, 10].forEach(function (nr) {
      var b = K.el('button', 'bd-pill' + (nr === MAX_ROUNDS ? ' on' : ''), String(nr));
      b.onclick = function () {
        K.sfx('hello');
        rebuildSetup(nTeams, nr);
        title();
      };
      rGrp.appendChild(b);
    });
    setup.appendChild(tGrp);
    setup.appendChild(rGrp);
    box.appendChild(setup);

    var rows = K.el('div', 'rows');
    var howBtn = K.el('button', 'btn soft', '❓ How to Play');
    howBtn.onclick = function () { K.audio(); K.loadSounds(['hello']); openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Play Board Game!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['hello', 'correct', 'wrong', 'dice', 'step', 'ladder', 'slide', 'star', 'pop', 'whoosh', 'win', 'music', 'crowd']);
      K.loop('music', .22);
      K.loop('crowd', .14);
      K.cls.assign(TEAMS);
      start();
    };
    rows.appendChild(howBtn);
    rows.appendChild(go);
    box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();
    addHelpTopButton();

    mons.slice(0, nTeams).forEach(function (m, i) {
      K.after(.35 + i * .4, function () {
        if (phase === 'title' && m) {
          m.setState('hello');
          K.after(1.3, function () { if (phase === 'title') m.setState('idle'); });
        }
      });
    });

    var seenHowTo = false;
    try { seenHowTo = localStorage.getItem('eaa_howto_board3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.pos === N ? '🏆' : '▢ ' + t.pos; });
    turnBannerEl = K.ui.add(K.el('div', 'bd-turn-banner'));
    liveBoardEl = K.ui.add(K.el('div', 'bd-live-board'));
    refresh(-1);
    round = 0;
    turnI = 0;
    nextTurn();
  }

  function promptRollDie(ti, onRolled) {
    var t = TEAMS[ti];
    var bar = K.ui.add(K.el('div', 'bd-roll-bar'));
    bar.style.setProperty('--c', t.c);
    var left = K.el('div', 'bd-roll-left');
    left.innerHTML = '<div>🎲 Tap in the GOLD zone for a 🍀 LUCKY ROLL!</div>' +
      '<div class="bd-roll-track"><div class="bd-roll-sweet"></div><div class="bd-roll-needle"></div></div>';
    var needle = left.querySelector('.bd-roll-needle');
    var btn = K.el('button', 'btn green', '🎲 Roll Die!');
    bar.appendChild(left);
    bar.appendChild(btn);

    var rolled = false, t0 = K.now, pos = 0.5;
    var fn = K.onFrame(function () {
      pos = 0.5 + 0.46 * Math.sin((K.now - t0) * 4.2);
      needle.style.left = (pos * 100).toFixed(1) + '%';
    });

    function trigger() {
      if (rolled) return;
      rolled = true;
      K.offFrame(fn);
      removeEventListener('keydown', onKey);
      K.renderer.domElement.removeEventListener('pointerdown', trigger);
      bar.remove();

      var isLucky = pos >= 0.40 && pos <= 0.64;
      var r1 = 1 + Math.floor(Math.random() * 6);
      var r2 = 1 + Math.floor(Math.random() * 6);
      var v = isLucky ? Math.max(r1, r2) : r1;
      K.sfx('dice');
      if (isLucky) {
        K.fx.confetti(holders[ti].position.clone().add(V(0, 1.8, 0)), 45);
        K.ui.big('🍀 LUCKY ROLL!', .85, true);
      }
      die.roll(holders[ti].position.clone(), v, isLucky ? 0xffd84a : t.hex, function () {
        die.hide();
        K.ui.toast((isLucky ? '🍀 Lucky Roll! ' : '') + 'Team ' + t.name + ' rolled ' + v + '!', 1.4, t.c);
        K.say((isLucky ? 'Lucky roll! ' : '') + String(v));
        onRolled(v);
      });
    }
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); trigger(); }
    }

    btn.onclick = trigger;
    addEventListener('keydown', onKey);
    K.renderer.domElement.addEventListener('pointerdown', trigger);
    if (K.DEMO) K.after(.5, trigger);
  }

  function nextTurn() {
    if (winner !== null) return finish();
    if (turnI >= nTeams) { turnI = 0; round++; }
    if (round >= MAX_ROUNDS) return finish();
    var t = TEAMS[turnI], ti = turnI, m = mons[ti];
    phase = 'ask';
    window.__k3phase = 'ask';
    refresh(ti);
    demoN++;
    if (ti === 0) K.ui.big('Round ' + (round + 1) + ' of ' + MAX_ROUNDS, 1.1, true);
    shot('ask');
    if (m) {
      m.setState('hello');
      K.after(.8, function () { if (phase === 'ask') m.setState('idle'); });
    }
    K.sfx('hello');
    K.after(.85, function () {
      K.ui.ask(QS.next(), t, {
        prompt: 'answer right to roll the Giant Die!',
        demoRight: DEMO_WRONG.indexOf(demoN) < 0,
        onAnswer: function (ok) {
          if (ok) {
            t.rights++;
            K.sfx('correct');
            if (m) m.setState('cheer');
            K.fx.burst(holders[ti].position.clone().add(V(0, 1.2, 0)), 18, { color: [t.hex, 0xffd84a], speed: 4, size: .14, life: .55 });
            shot('follow', ti);
            promptRollDie(ti, function (v) {
              move(ti, v);
            });
          } else {
            K.sfx('wrong');
            if (m) m.setState('sad');
            shot('follow', ti);
            K.ui.toast('One little step forward…', 1.4, t.c);
            K.after(.65, function () { move(ti, 1); });
          }
        }
      });
    });
  }

  function move(ti, steps) {
    phase = 'move';
    window.__k3phase = 'move';
    var t = TEAMS[ti], target = Math.min(N, t.pos + steps), path = [];
    for (var n = t.pos + 1; n <= target; n++) path.push(n);
    walk(ti, path, function () {
      refresh(ti);
      land(ti);
    });
  }

  function land(ti) {
    var t = TEAMS[ti], n = t.pos, at = tilePos(n).add(V(0, 2, 0));
    if (n >= N) {
      winner = ti;
      openTreasureChest();
      K.sfx('win');
      K.fx.confetti(chestSpot.clone().add(V(0, 2.2, 0)), 220);
      K.ui.big('🏆 Team ' + t.name + ' Opened the Treasure!', 2.2, true);
      K.say('Team ' + t.name + ' found the treasure!');
      if (mons[ti]) mons[ti].setState('cheer');
      return K.after(2.4, finish);
    }
    if (LADDERS[n]) {
      K.sfx('ladder');
      K.ui.big('🪜 LADDER UP! → #' + LADDERS[n], 1.25, true);
      K.fx.text('🪜 Up to ' + LADDERS[n] + '!', at, '#2fc58a', 1.3);
      K.say('Ladder! Climb up!');
      return climbLadder(ti, n, LADDERS[n], function () {
        refresh(ti);
        after();
      });
    }
    if (SLIDES[n]) {
      K.sfx('slide');
      K.ui.big('🛝 SLIDE! Wheee! → #' + SLIDES[n], 1.25, true);
      K.fx.text('🛝 Wheee!', at, '#ff5fa2', 1.3);
      K.say('Oh no, a slide! Wheee!');
      return rideSlide(ti, n, SLIDES[n], function () {
        refresh(ti);
        after();
      });
    }
    if (STARS[n]) {
      t.stars++;
      K.sfx('star');
      K.ui.big('⭐ STAR SQUARE! +2 Steps!', 1.25, true);
      K.fx.text('⭐ +2 Steps!', at, '#ffb320', 1.3);
      K.fx.burst(at, 26, { color: [0xffd84a, 0xffffff, t.hex], speed: 4.5, size: .16, life: .65 });
      K.say('Star square! Two bonus steps!');
      return K.after(.7, function () {
        var path = [];
        for (var k = n + 1; k <= Math.min(N, n + 2); k++) path.push(k);
        walk(ti, path, function () {
          refresh(ti);
          land(ti);
        });
      });
    }
    after();
    function after() {
      K.after(.85, function () {
        turnI++;
        nextTurn();
      });
    }
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    var stepSpecs = [
      { rank: 1, x: 0,    h: 1.20, w: 1.9, col: 0xffd84a },
      { rank: 2, x: -2.1, h: 0.82, w: 1.7, col: 0xdce4f2 },
      { rank: 3, x: 2.1,  h: 0.60, w: 1.7, col: 0xf0a868 },
      { rank: 4, x: 4.1,  h: 0.38, w: 1.5, col: 0xe9e2f5 }
    ];
    var pz = 7.4;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti];
      var g = new T3.Group();
      g.position.set(sp.x, 0, pz);
      podiumGroup.add(g);

      var base = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      base.position.y = .28 + sp.h / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = .28 + sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.66);
      numLab.position.set(0, .28 + sp.h + 1.65, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.45);
        tr.position.set(.56, .28 + sp.h + .05, sp.w * .34);
        g.add(tr);
      }

      var h = holders[ti];
      if (h) {
        h.children.forEach(function (c) { if (c.isSprite) c.visible = false; });
        h.position.set(sp.x - (rk === 0 ? .12 : 0), .32 + sp.h + .06, pz - .05);
        h.rotation.set(0, 0, 0);
        h.scale.set(1, 1, 1);
        if (mons[ti]) mons[ti].setState(rk === 0 ? 'cheer' : 'clap');
      }
    });
  }

  function finish() {
    phase = 'end';
    window.__k3phase = 'end';
    updateTurnMarker(-1);
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();
    if (hud) hud.refresh(-1);
    openTreasureChest();

    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return (TEAMS[b].pos - TEAMS[a].pos) || (TEAMS[b].rights - TEAMS[a].rights);
    });
    var best = TEAMS[order[0]];
    buildPodium3D(order);

    shot('end');
    if (winner === null) {
      K.sfx('win');
      K.fx.confetti(V(0, 4.2, 7.4), 220);
      K.ui.big('🏆 Team ' + best.name + ' Wins!', 2.2, true);
      K.say('Team ' + best.name + ' wins the board game!');
    } else {
      K.fx.confetti(V(0, 4.2, 7.4), 180);
    }

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var t = TEAMS[ti];
        return '<div class="bd-table-row" style="--c:' + t.c + '">' +
          '<span class="bd-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<span>✓ ' + t.rights + ' right' + (t.stars ? ' · ⭐×' + t.stars : '') + (t.ladders ? ' · 🪜×' + t.ladders : '') + '</span>' +
          '<i>' + (t.pos >= N ? '🏆 Treasure!' : 'Square ' + t.pos) + '</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + best.c + ';font-size:1.45rem">🏆 Team ' + best.name + (best.pos >= N ? ' opened the Treasure Chest!' : ' got furthest (Square ' + best.pos + ')!') + '</div>' +
        '<div class="bd-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'board3d', title: 'Board Game 3D', scoreOf: function (t) { return t.pos * 10 + t.rights; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Setting up the board…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'board', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  var closedP = K.tryGLB('models/chest-closed.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });
  var openP = K.tryGLB('models/chest-open.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.45) : null; });
  var diceP = K.tryGLB('models/giant-dice.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.45) : null; });
  var trophyP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  Promise.all([worldP, closedP, openP, diceP, trophyP].concat(K.TEAMS.map(function (t, i) { return K.makeCharacter(t, { kidsOnly: true, kid: i % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.25 }); }))).then(function (res) {
    chestClosedMesh = res[1];
    chestOpenMesh = res[2];
    giantDiceMesh = res[3];
    trophyModel = res[4];
    die.attachTripo(giantDiceMesh);

    res.slice(5).forEach(function (ch, i) {
      var h = new T3.Group();
      h.add(ch.root);
      scene.add(h);
      holders[i] = h;
      mons[i] = ch;
      var lab = K.label(K.TEAMS[i].name, K.TEAMS[i].c);
      lab.scale.multiplyScalar(.58);
      lab.position.y = ch.height + .35;
      h.add(lab);
    });

    buildBoard();
    placeAll();
    loading.remove();
    title();
    window.__board3d = {
      getPhase: function () { return phase; },
      getFps: function () {
        if (!fpsSamples.length) return 60;
        var sum = fpsSamples.reduce(function (a, b) { return a + b; }, 0);
        return Math.round(sum / fpsSamples.length);
      },
      getTeams: function () { return TEAMS; },
      openHowTo: openHowTo,
      openChest: openTreasureChest
    };
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
