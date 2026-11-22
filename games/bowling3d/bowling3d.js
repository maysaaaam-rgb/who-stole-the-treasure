/* Bowling 3D — English Adventure Academy (Easy Peasy Arcade Upgrade)
   Plays at the Bowling Green in Adventure Park (games/world, zone "bowl").
   One lane per team, side by side. Each turn: answer a question.
     right  → an arrow swings across the lane; tap once to stop the aim arrow, tap again to lock power!
     wrong  → the ball still rolls, but wobbly and with a random aim (no team gets zero)
   Pins knocked down = points; a strike (all 10) gets +5. 3 rounds (configurable 2–5). Points go to the Class Board at the end.
   Options: ?teams=2..4  ?rounds=1..5  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 36, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  /* ---------------- rich procedural bowling alley audio layer ---------------- */
  function playBowlSfx(kind) {
    var a = K.audio ? K.audio() : null;
    if (!a || K.CAPTURE || K.muted) return;
    var now = a.currentTime;
    try {
      if (kind === 'pins') {
        // Crisply staggered wooden pin knock clatter
        [720, 940, 1180, 860, 1340].forEach(function (f, i) {
          var o = a.createOscillator(), g = a.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, now + i * 0.032);
          o.frequency.exponentialRampToValueAtTime(f * 0.58, now + i * 0.032 + 0.09);
          g.gain.setValueAtTime(0.11, now + i * 0.032);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.032 + 0.10);
          o.connect(g); g.connect(a.destination);
          o.start(now + i * 0.032); o.stop(now + i * 0.032 + 0.11);
        });
      } else if (kind === 'strike') {
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
          var o2 = a.createOscillator(), g2 = a.createGain();
          o2.type = 'triangle'; o2.frequency.value = f;
          g2.gain.setValueAtTime(0.11, now + i * 0.05);
          g2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.42);
          o2.connect(g2); g2.connect(a.destination);
          o2.start(now + i * 0.05); o2.stop(now + i * 0.05 + 0.44);
        });
      }
    } catch (e) {}
  }

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4), ROUNDS = clamp(+K.Q.get('rounds') || 3, 1, 5);
  var TEAMS = [];
  function initTeams() {
    TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) {
      return Object.assign({ score: 0, strikes: 0, rolls: [] }, t);
    });
  }
  initTeams();
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- sky, lights & environment (GameQualityCore Warm Boardwalk Alley) ---------------- */
  var GQC = window.GameQualityCore || null;
  K._gqcTheme = 'alley';
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0, 'alley');
  K.world.lights();
  if (!GQC) K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x6eb84c);

  var LANE_W = 2.10, HALF = LANE_W / 2, GAP = 1.38, FOUL_Z = 7.5, HEAD_Z = -6.2, PIT_Z = -9.4;
  var BALL_R = .32, PIN_R = .20, PIN_H = 1.24;
  function laneX(i) { return (i - (nTeams - 1) / 2) * (LANE_W + GAP); }

  var woodTex = K.canvasTex(256, 1024, function (c, W, H) {   // glossy maple boards along the lane
    for (var b = 0; b < 10; b++) {
      var g = 212 + ((b * 29) % 22);
      c.fillStyle = 'rgb(' + (g + 24) + ',' + (g - 6) + ',' + (g - 62) + ')';
      c.fillRect(b * W / 10, 0, W / 10, H);
      c.fillStyle = 'rgba(130,78,24,.13)';
      c.fillRect(b * W / 10, 0, 2, H);
    }
    for (var k = 0; k < 70; k++) {
      c.fillStyle = 'rgba(160,95,30,.055)';
      c.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 2, 35 + Math.random() * 85);
    }
    // subtle approach dots and lane board sheen
    var gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, 'rgba(255,255,255,0.12)');
    gr.addColorStop(0.5, 'rgba(255,248,225,0.04)');
    gr.addColorStop(1, 'rgba(255,255,255,0.16)');
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
  });

  var arenaGroup = new T3.Group();
  scene.add(arenaGroup);
  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);
  var lanes = [], alleyModel = null, trophyModel = null, charHolders = [], mons = [];

  // Active turn 3D marker (small floating team-colored ring + compact bouncing arrow above active bowler)
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(new T3.RingGeometry(.34, .44, 24), new T3.MeshBasicMaterial({ color: 0xff5fa2, side: T3.DoubleSide, transparent: true, opacity: .82 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .03;
    g.add(ring);
    var arrow = new T3.Mesh(new T3.ConeGeometry(.055, .12, 10), new T3.MeshLambertMaterial({ color: 0xff5fa2, emissive: 0xff5fa2, emissiveIntensity: .35 }));
    arrow.rotation.x = Math.PI;
    arrow.position.y = 1.18;
    g.add(arrow);
    g.userData.ring = ring;
    g.userData.arrow = arrow;
    g.visible = false;
    scene.add(g);
    K.onFrame(function (dt, t) {
      if (!g.visible) return;
      arrow.position.y = 1.18 + Math.sin(t * 5.2) * .06;
      arrow.rotation.y = t * 2.4;
      var s = 1 + Math.sin(t * 4) * .06;
      ring.scale.set(s, s, 1);
    });
    return g;
  })();
  function setTurnMarker(i) {
    if (i < 0 || i >= TEAMS.length) { turnMarker.visible = false; return; }
    var t = TEAMS[i], spot = monSpot(i);
    turnMarker.visible = true;
    turnMarker.position.copy(spot);
    turnMarker.userData.ring.material.color.setHex(t.hex);
    turnMarker.userData.arrow.material.color.setHex(t.hex);
    turnMarker.userData.arrow.material.emissive.setHex(t.hex);
    lanes.forEach(function (L, li) {
      if (L.hoodMat) L.hoodMat.emissiveIntensity = (li === i) ? .45 : .08;
    });
  }

  function buildLanes() {
    while (arenaGroup.children.length) arenaGroup.remove(arenaGroup.children[0]);
    lanes = [];
    var totalW = nTeams * (LANE_W + GAP) + 2.4;
    var deck = new T3.Mesh(new T3.BoxGeometry(totalW, .32, 21.5), K.mat(0xe6d2b2));
    deck.position.set(0, .1, -.8);
    deck.receiveShadow = true;
    arenaGroup.add(deck);

    // Apron curb in bright cream
    var curb = new T3.Mesh(new T3.BoxGeometry(totalW + .4, .18, .45), K.mat(0xfff8ec));
    curb.position.set(0, .28, FOUL_Z + 2.85);
    arenaGroup.add(curb);

    var laneMat = new T3.MeshStandardMaterial({ map: woodTex, roughness: .22, metalness: .04 });
    for (var i = 0; i < nTeams; i++) {
      var x = laneX(i), t = TEAMS[i], g = new T3.Group();
      g.position.x = x;
      arenaGroup.add(g);

      var laneLen = FOUL_Z - PIT_Z + 1.4;
      var lane = new T3.Mesh(new T3.BoxGeometry(LANE_W, .14, laneLen), laneMat);
      lane.position.set(0, .3, (FOUL_Z + PIT_Z) / 2 - .3);
      lane.receiveShadow = true;
      g.add(lane);

      [-1, 1].forEach(function (s) {
        var gut = new T3.Mesh(
          new T3.CylinderGeometry(.28, .28, FOUL_Z - PIT_Z, 16, 1, true, -Math.PI / 2, Math.PI),
          K.mat(0xb8c4d0, { side: T3.DoubleSide })
        );
        gut.rotation.x = Math.PI / 2;
        gut.position.set(s * (HALF + .28), .36, (FOUL_Z + PIT_Z) / 2);
        g.add(gut);

        var rail = new T3.Mesh(
          new T3.BoxGeometry(.16, .28, FOUL_Z - PIT_Z),
          new T3.MeshStandardMaterial({ color: t.hex, roughness: .35, metalness: .05 })
        );
        rail.position.set(s * (HALF + .66), .43, (FOUL_Z + PIT_Z) / 2);
        rail.castShadow = true;
        g.add(rail);
      });

      // Foul line + 7 rangefinder aiming arrows
      var fl = new T3.Mesh(new T3.PlaneGeometry(LANE_W, .1), new T3.MeshBasicMaterial({ color: 0x2b1d40 }));
      fl.rotation.x = -Math.PI / 2;
      fl.position.set(0, .38, FOUL_Z);
      g.add(fl);
      for (var a = 0; a < 7; a++) {
        var ar = new T3.Mesh(new T3.ConeGeometry(.085, .28, 3), new T3.MeshBasicMaterial({ color: t.hex }));
        ar.rotation.x = -Math.PI / 2;
        ar.position.set((a - 3) * .31, .38, 1.5 - Math.abs(a - 3) * .28);
        g.add(ar);
      }

      // Pin deck back wall, neon-bright team hood & sign
      var wall = new T3.Mesh(new T3.BoxGeometry(LANE_W + 1.5, 1.85, .36), K.mat(0xfff5de));
      wall.position.set(0, 1.1, PIT_Z - .6);
      wall.castShadow = true;
      g.add(wall);

      var hoodMat = new T3.MeshStandardMaterial({ color: t.hex, emissive: t.hex, emissiveIntensity: .12, roughness: .3 });
      var stripe = new T3.Mesh(new T3.BoxGeometry(LANE_W + 1.56, .38, .44), hoodMat);
      stripe.position.set(0, 1.82, PIT_Z - .58);
      g.add(stripe);

      // Pin setter side cheeks
      [-1, 1].forEach(function (s) {
        var cheek = new T3.Mesh(new T3.BoxGeometry(.18, 1.65, 2.2), K.mat(0xfff8ec));
        cheek.position.set(s * (HALF + .66), 1.02, PIT_Z + .45);
        cheek.castShadow = true;
        g.add(cheek);
      });

      // Ball return rack beside approach
      var rack = new T3.Group();
      rack.position.set(-HALF - .55, .26, FOUL_Z + .85);
      var rBase = new T3.Mesh(new T3.BoxGeometry(.38, .32, 1.35), K.mat(0xfff8ec));
      rBase.position.y = .16;
      rack.add(rBase);
      var rHood = new T3.Mesh(new T3.CylinderGeometry(.2, .2, .42, 14), K.mat(t.hex));
      rHood.rotation.x = Math.PI / 2;
      rHood.position.set(0, .34, -.42);
      rack.add(rHood);
      [0, .34].forEach(function (bz, bi) {
        var sb = new T3.Mesh(new T3.SphereGeometry(.14, 14, 10), new T3.MeshStandardMaterial({ color: bi ? 0xffffff : t.hex, roughness: .22 }));
        sb.position.set(0, .42, bz);
        rack.add(sb);
      });
      g.add(rack);

      var lab = K.label(t.name, t.c);
      lab.scale.multiplyScalar(.92);
      lab.position.set(0, 2.65, PIT_Z - .6);
      g.add(lab);

      lanes.push({ i: i, x: x, group: g, team: t, pins: [], hoodMat: hoodMat });
    }

    // Grand arch over the bowling green
    var w = nTeams * (LANE_W + GAP) + 1.8;
    [-1, 1].forEach(function (s) {
      var post = new T3.Mesh(new T3.CylinderGeometry(.2, .22, 4.6, 14), K.mat(0xffffff));
      post.position.set(s * w / 2, 2.3, PIT_Z - 1.4);
      post.castShadow = true;
      arenaGroup.add(post);

      // Golden trophy on pedestal flanking the green
      var ped = new T3.Mesh(new T3.CylinderGeometry(.55, .65, .9, 18), K.mat(0xfff8ec));
      ped.position.set(s * (w / 2 + 1.35), .45, PIT_Z - .8);
      ped.castShadow = true;
      arenaGroup.add(ped);
      if (trophyModel) {
        var tr = trophyModel.clone(true);
        tr.position.set(s * (w / 2 + 1.35), .92, PIT_Z - .8);
        tr.rotation.y = -s * .35;
        arenaGroup.add(tr);
      }
    });
    var beam = new T3.Mesh(new T3.BoxGeometry(w + .8, .95, .45), K.mat(0xff5fa2));
    beam.position.set(0, 4.6, PIT_Z - 1.4);
    beam.castShadow = true;
    arenaGroup.add(beam);
    var sign = K.label('🎳 BOWLING GREEN', '#ff5fa2', 560);
    sign.scale.multiplyScalar(1.12);
    sign.position.set(0, 5.75, PIT_Z - 1.4);
    arenaGroup.add(sign);

    // Real Tripo Bowling Alley Clubhouse behind the arch
    if (alleyModel) {
      var bh = alleyModel.clone(true);
      bh.position.set(0, 0, PIT_Z - 6.8);
      arenaGroup.add(bh);
      if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(bh, 4.6, { y: 0.02, opacity: 0.25 });
    }

    // Perimeter festive boardwalk lantern posts & fluttering pennants framing the deck
    [-1, 1].forEach(function (side) {
      var pxEdge = side * (totalW * 0.5 + 0.85);
      [-5.5, 0.5, 6.5].forEach(function (pz, li) {
        var post = new T3.Mesh(new T3.CylinderGeometry(.09, .12, 3.3, 10), new T3.MeshStandardMaterial({ color: 0x5c3d28, roughness: .75 }));
        post.position.set(pxEdge, 1.65, pz);
        post.castShadow = true;
        arenaGroup.add(post);
        var bulb = new T3.Mesh(new T3.SphereGeometry(.24, 12, 10), new T3.MeshBasicMaterial({ color: 0xfff3b8 }));
        bulb.position.set(pxEdge, 3.4, pz);
        arenaGroup.add(bulb);
        var pen = new T3.Mesh(new T3.ConeGeometry(.24, .58, 4), new T3.MeshStandardMaterial({ color: K.TEAMS[(li + (side > 0 ? 2 : 0)) % 4].hex, roughness: .5 }));
        pen.rotation.z = side * Math.PI * 0.5;
        pen.position.set(pxEdge - side * .32, 2.85, pz);
        if (K.windify) K.windify(pen.material, 0.05, 0.6);
        arenaGroup.add(pen);
        if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(post, 0.65, { y: -1.62, opacity: 0.24 });
      });
    });

    lanes.forEach(rackPins);
  }

  /* ---------------- shiny pins & bowling ball ---------------- */
  var pinProfile = [[0, 0], [.09, 0], [.12, .08], [.165, .24], [.15, .38], [.09, .56], [.065, .66], [.088, .76], [.092, .84], [.065, .92], [0, .95]].map(function (p) { return new T3.Vector2(p[0], p[1]); });
  var pinGeo = new T3.LatheGeometry(pinProfile, 22);
  var pinWhite = new T3.MeshStandardMaterial({ color: 0xfffdf9, roughness: .18, metalness: .04 });
  var pinCrimson = new T3.MeshStandardMaterial({ color: 0xe63946, roughness: .22 });
  var PIN_SPOTS = (function () {
    var s = [], d = .52;
    for (var r = 0; r < 4; r++) for (var k = 0; k <= r; k++) s.push([(k - r / 2) * d * 1.15, HEAD_Z - r * d * 1.0]);
    return s;
  })();
  function makePin(t) {
    var g = new T3.Group(), body = new T3.Mesh(pinGeo, pinWhite);
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);
    var bandMat = new T3.MeshStandardMaterial({ color: t.hex, roughness: .25 });
    [.64, .74].forEach(function (y, bi) {
      var band = new T3.Mesh(new T3.CylinderGeometry(.075, .079, .045, 18), bi === 0 ? pinCrimson : bandMat);
      band.position.y = y;
      g.add(band);
    });
    // 1.35x Target Readability Scale + warm AO contact ring!
    g.scale.setScalar(1.34);
    if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(g, 0.28, { y: 0.008, opacity: 0.28 });
    return g;
  }
  function rackPins(lane) {
    lane.pins.forEach(function (p) { lane.group.remove(p.mesh); });
    lane.pins = PIN_SPOTS.map(function (s) {
      var m = makePin(lane.team);
      m.position.set(s[0], .37, s[1]);
      lane.group.add(m);
      return {
        mesh: m, x: s[0], y: .37, z: s[1],
        vx: 0, vy: 0, vz: 0,
        wx: 0, wy: 0, wz: 0,
        down: false, moving: false, fall: 0, axis: V(1, 0, 0)
      };
    });
  }

  var ballGeo = new T3.SphereGeometry(BALL_R, 28, 20);
  function makeBall(t) {
    var g = new T3.Group();
    var b = new T3.Mesh(ballGeo, new T3.MeshStandardMaterial({ color: t.hex, roughness: .16, metalness: .08 }));
    b.castShadow = true;
    g.add(b);
    [[-.08, .1], [.08, .1], [0, -.04]].forEach(function (h) {
      var hole = new T3.Mesh(new T3.CircleGeometry(.045, 12), new T3.MeshBasicMaterial({ color: 0x2b1d40 }));
      hole.position.set(h[0], h[1], BALL_R - .004);
      b.add(hole);
    });
    var sw = new T3.Mesh(new T3.TorusGeometry(BALL_R * .99, .022, 8, 32), K.mat(0xffffff));
    sw.rotation.y = Math.PI / 2;
    b.add(sw);
    g.userData.spin = b;
    return g;
  }

  /* ---------------- ball spin trail ---------------- */
  var trails = [];
  var trailGeo = new T3.RingGeometry(.08, .22, 16);
  trailGeo.rotateX(-Math.PI / 2);
  function spawnTrail(wx, wy, wz, hex, power) {
    var mat = new T3.MeshBasicMaterial({ color: power > .95 ? 0xffd84a : hex, transparent: true, opacity: .75, side: T3.DoubleSide, depthWrite: false });
    var m = new T3.Mesh(trailGeo, mat);
    m.position.set(wx, wy, wz);
    scene.add(m);
    trails.push({ mesh: m, mat: mat, age: 0, life: .42 });
  }

  /* ---------------- physics: 3D tumbling pins, ball hook & impact slow-mo ---------------- */
  var roll = null, slowMoTimer = null;
  function triggerImpactSlowMo(pos, color) {
    if (slowMoTimer) clearTimeout(slowMoTimer);
    if (GQC && GQC.Juice) {
      GQC.Juice.hitstop(42);
      GQC.Juice.shakeCamera(0.24, 0.30);
      GQC.Juice.spawnBurst(scene, pos, 'stars', 18);
    } else {
      K.timeScale = 0.28;
      K.cam.shake(.22);
      slowMoTimer = setTimeout(function () {
        K.timeScale = 1.0;
        slowMoTimer = null;
      }, 360);
    }
    K.fx.burst(pos, 26, { color: [0xffd84a, 0xffffff, color], speed: 5, size: .16, life: .65 });
  }

  function stepPhysics(h) {
    if (!roll) return;
    var L = roll.lane, b = roll;
    if (!b.done) {
      b.vx += b.hook * h;
      b.x += b.vx * h;
      b.z += b.vz * h;
      if (b.wobble) b.x += Math.sin(b.z * 3.2) * b.wobble * h;
      if (!b.gutter && Math.abs(b.x) > HALF - .05) {
        b.gutter = true;
        b.x = Math.sign(b.x) * (HALF + .28);
        b.vx = 0;
        b.hook = 0;
        K.sfx('gutter');
        K.fx.text('Gutter!', V(L.x + b.x, 1.4, b.z), '#8a9099', .9);
      }
      if (!b.gutter) {
        L.pins.forEach(function (p) {
          var dx = p.x - b.x, dz = p.z - b.z, d = Math.hypot(dx, dz);
          if (d < BALL_R + PIN_R && !p.hitByBall) {
            p.hitByBall = true;
            if (!b.hitFirstPin) {
              b.hitFirstPin = true;
              playBowlSfx('pins');
              triggerImpactSlowMo(V(L.x + p.x, .8, p.z), L.team.hex);
            }
            var nx = dx / (d || 1), nz = dz / (d || 1);
            var boost = b.power || 1;
            p.vx = (b.vx * .62 + nx * 3.4) * boost;
            p.vz = (b.vz * .62 + nz * 3.4) * boost;
            p.vy = (1.6 + Math.random() * 1.3) * boost;
            knock(p);
            b.vz *= .89;
            b.vx -= nx * .95;
          }
        });
      }
      if (b.z < PIT_Z + .3) { b.done = true; b.settle = 1.35; }
    } else {
      b.settle -= h;
    }

    // Pin-to-pin collisions & 3D tumbling
    L.pins.forEach(function (p) {
      if (!p.down && !p.moving) return;
      var sp = Math.hypot(p.vx, p.vz);
      if (sp > .03 || p.y > .375) {
        p.x += p.vx * h;
        p.z += p.vz * h;
        p.y += p.vy * h;
        p.vy -= 11.5 * h;
        if (p.y <= .37) {
          p.y = .37;
          if (p.vy < -.6) p.vy = -p.vy * .32;
          else p.vy = 0;
        }
        var f = Math.max(0, 1 - 2.4 * h);
        p.vx *= f;
        p.vz *= f;
        L.pins.forEach(function (q) {
          if (q === p || q.down) return;
          var dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz);
          if (d < PIN_R * 2.25 && sp > 1.95 && Math.random() < (b.sweet ? .82 : .68)) {
            var nx = dx / (d || 1), nz = dz / (d || 1);
            q.vx = p.vx * .5 + nx * 1.35;
            q.vz = p.vz * .5 + nz * 1.35;
            q.vy = .9 + Math.random() * .9;
            knock(q);
            p.vx *= .65;
            p.vz *= .65;
          }
        });
      }
    });
  }

  function knock(p) {
    if (p.down) return;
    p.down = true;
    p.moving = true;
    var v = V(p.vx, 0, p.vz);
    if (v.lengthSq() < .01) v.set(0, 0, -1);
    p.axis = V(v.z, 0, -v.x).normalize();
    p.fall = 0;
    p.wy = rnd(-8, 8);
  }

  var ACC = 0, trailTick = 0, fpsSamples = [], lastFpsT = performance.now();
  K.onFrame(function (dt) {
    var nowMs = performance.now(), realDt = (nowMs - lastFpsT) / 1000;
    lastFpsT = nowMs;
    if (realDt > 0.001 && realDt < 0.25) {
      fpsSamples.push(1 / realDt);
      if (fpsSamples.length > 90) fpsSamples.shift();
    }

    ACC += Math.min(dt, .05);
    var H = 1 / 120;
    while (ACC >= H) { stepPhysics(H); ACC -= H; }

    lanes.forEach(function (L) {
      L.pins.forEach(function (p) {
        if (p.down && p.fall < Math.PI / 2) {
          p.fall = Math.min(Math.PI / 2, p.fall + dt * 8.5);
        }
        p.mesh.position.set(p.x, p.y + (p.down ? Math.sin(p.fall) * PIN_R * .75 : 0), p.z);
        if (p.down) {
          p.mesh.quaternion.setFromAxisAngle(p.axis, -p.fall);
          if (Math.hypot(p.vx, p.vz) > .25) {
            p.mesh.rotateY(p.wy * dt);
          }
        }
        if (p.z < PIT_Z - .25 || Math.abs(p.x) > HALF + .95) p.mesh.visible = false;
      });
    });

    if (roll && roll.mesh) {
      var b = roll;
      b.mesh.position.set(b.x, b.gutter ? .12 + BALL_R * .2 : .37 + BALL_R, b.z);
      b.mesh.userData.spin.rotation.x -= b.vz * dt / BALL_R * -1.15;
      b.mesh.userData.spin.rotation.z += b.vx * dt * 1.4;
      trailTick += dt;
      if (!b.done && !b.gutter && trailTick > .035) {
        trailTick = 0;
        spawnTrail(b.lane.x + b.x, .39, b.z + .15, b.lane.team.hex, b.power || 1);
      }
      if (b.z < PIT_Z) b.mesh.visible = false;
    }

    for (var ti = trails.length - 1; ti >= 0; ti--) {
      var tr = trails[ti];
      tr.age += dt;
      var k = tr.age / tr.life;
      if (k >= 1) {
        scene.remove(tr.mesh);
        tr.mat.dispose();
        trails.splice(ti, 1);
      } else {
        tr.mat.opacity = (1 - k) * .68;
        var sc = 1 + k * .75;
        tr.mesh.scale.set(sc, sc, 1);
      }
    }
  });

  /* ---------------- 2-step aiming: Single Short Honest Aim Pointer + Power Meter ---------------- */
  var aimArrow = (function () {
    var g = new T3.Group();
    var m = new T3.MeshBasicMaterial({ color: 0xff3b5c, transparent: true, opacity: .94 });
    var shaft = new T3.Mesh(new T3.BoxGeometry(.14, .03, 1.45), m);
    shaft.position.z = -.72;
    g.add(shaft);
    var head = new T3.Mesh(new T3.ConeGeometry(.26, .48, 4), m);
    head.rotation.x = -Math.PI / 2;
    head.rotation.y = Math.PI / 4;
    head.position.z = -1.62;
    g.add(head);
    g.visible = false;
    g.position.y = .42;
    scene.add(g);
    return g;
  })();

  function aim(lane, done) {
    var t0 = K.now, step = 'aim', lockedX = 0, lockedAngle = 0, pwr = .75;
    var sweep = HALF * .88;
    aimArrow.visible = true;
    aimArrow.position.z = FOUL_Z - .55;
    aimArrow.rotation.y = 0;

    var bar = K.ui.add(K.el('div', 'bw-aim'));
    bar.style.setProperty('--c', lane.team.c);
    var left = K.el('div', 'bw-aim-left');
    var lbl = K.el('div', 'bw-aim-lbl', '🎯 Step 1: Tap to lock your AIM!');
    var track = K.el('div', 'bw-pwr-track');
    track.style.display = 'none';
    var sweet = K.el('div', 'bw-pwr-sweet');
    var needle = K.el('div', 'bw-pwr-needle');
    track.appendChild(sweet);
    track.appendChild(needle);
    left.appendChild(lbl);
    left.appendChild(track);
    var btn = K.el('button', 'btn green', '🎯 Lock Aim!');
    bar.appendChild(left);
    bar.appendChild(btn);

    var fn = K.onFrame(function () {
      var elap = K.now - t0;
      if (step === 'aim') {
        var s = Math.sin(elap * 2.45);
        lockedX = s * sweep;
        lockedAngle = -s * .045;
        aimArrow.position.x = lane.x + lockedX;
        aimArrow.rotation.y = lockedAngle;
      } else if (step === 'power') {
        pwr = .5 + .5 * Math.sin(elap * 4.2);
        needle.style.left = Math.round(pwr * 100) + '%';
      }
    });

    var autoRoll = K.DEMO || (K.isAI && K.isAI(lane.team));
    function onTap(ev) {
      if (ev && ev.type === 'pointerdown' && ev.target !== K.renderer.domElement) return;
      if (step === 'aim') {
        step = 'power';
        K.sfx('whoosh');
        lbl.textContent = '⚡ Step 2: Tap in the bright zone for POWER!';
        track.style.display = 'block';
        btn.textContent = '🎳 ROLL!';
        btn.className = 'btn pink';
        if (autoRoll) K.after(.42 + Math.random() * .25, function () { if (step === 'power') onTap(); });
      } else if (step === 'power') {
        step = 'done';
        K.offFrame(fn);
        bar.remove();
        K.renderer.domElement.removeEventListener('pointerdown', onTap);
        aimArrow.visible = false;
        var isSweet = pwr >= .64 && pwr <= .88;
        var speedMult = .78 + pwr * .38 + (isSweet ? .08 : 0);
        done(lockedX, speedMult, isSweet);
      }
    }

    btn.onclick = function () { onTap(); };
    K.renderer.domElement.addEventListener('pointerdown', onTap);
    if (autoRoll) K.after(.55 + Math.random() * .35, function () { if (step === 'aim') onTap(); });
  }

  /* ---------------- characters & live hand-held bowling ball ---------------- */
  var heldBall = null, heldBallOwner = -1, _handPos = new T3.Vector3();
  function showHeldBall(ti) {
    hideHeldBall();
    if (ti < 0 || ti >= nTeams || !TEAMS[ti]) return;
    heldBall = makeBall(TEAMS[ti]);
    heldBall.scale.setScalar(0.68);
    scene.add(heldBall);
    heldBallOwner = ti;
  }
  function hideHeldBall() {
    if (heldBall) { scene.remove(heldBall); heldBall = null; }
    heldBallOwner = -1;
  }
  K.onFrame(function (dt) {
    mons.forEach(function (m) { if (m) m.update(dt * (m._pace || 1)); });
    if (heldBall && heldBallOwner >= 0 && mons[heldBallOwner]) {
      var m0 = mons[heldBallOwner];
      var rb = m0.bones && m0.bones.RightHand;
      if (rb && charHolders[heldBallOwner] && charHolders[heldBallOwner].visible) {
        m0.root.updateMatrixWorld(true);
        rb.getWorldPosition(_handPos);
        heldBall.position.copy(_handPos).add(V(0, -0.06, -0.10));
        heldBall.visible = true;
      } else {
        heldBall.visible = false;
      }
    }
    // Hide bowler & turn arrow whenever camera is close (< 3.2 units) or during roll so nothing blocks the lane
    var camPos = K.camera ? K.camera.position : null;
    charHolders.forEach(function (h, i) {
      if (!h) return;
      if (i >= nTeams) { h.visible = false; return; }
      if (phase === 'end' || phase === 'title') { h.visible = true; return; }
      var tooClose = camPos ? (camPos.distanceTo(h.position) < 3.1) : false;
      var hideForRoll = (phase === 'roll' && i === turnI && camPos && camPos.z > FOUL_Z - 1.5);
      h.visible = !(tooClose || hideForRoll);
    });
    if (phase === 'roll') {
      turnMarker.visible = false;
    } else if (phase === 'ask' || phase === 'aim') {
      var mTooClose = camPos ? (camPos.distanceTo(turnMarker.position) < 3.1) : false;
      turnMarker.visible = !mTooClose && turnI >= 0 && turnI < nTeams;
      if (turnMarker.userData.arrow) turnMarker.userData.arrow.visible = false;
    }
  });
  // Place each bowler on the left side of the start of its OWN lane (feet on approach, centered inside own lane)
  function monSpot(i) { return V(laneX(i) - HALF * 0.58, .26, FOUL_Z + 1.45); }
  function placeCharacters() {
    charHolders.forEach(function (h, i) {
      if (!h) return;
      h.visible = i < nTeams;
      if (i < nTeams) {
        h.position.copy(monSpot(i));
        h.rotation.y = Math.PI; // face down the lane toward the pins!
      }
    });
  }

  /* ---------------- camera (closer boardwalk alley broadcast framing) ---------------- */
  function setFov(f) {
    if (K.camera.fov !== f) { K.camera.fov = f; K.camera.updateProjectionMatrix(); }
  }
  function shot(name, lane) {
    K.cam.follow = null;
    setFov(/ask|aim|roll|pins/.test(name) ? 34 : 38);
    if (name === 'title') {
      K.cam.follow = function () {
        var sway = nTeams >= 4 ? 1.0 : 1.8;
        var a = Math.sin(K.now * .18) * sway;
        var zBack = nTeams >= 4 ? FOUL_Z + 12.8 : (nTeams === 3 ? FOUL_Z + 10.8 : FOUL_Z + 8.8);
        var yCam = nTeams >= 4 ? 6.2 : (nTeams === 3 ? 5.4 : 4.8);
        K.cam.tPos.set(a, yCam, zBack);
        K.cam.tLook.set(0, .85, -1.6);
      };
      K.cam.k = 1.5;
    }
    if (name === 'ask') {
      // Closer broadcast alley view: active bowler, maple lanes & sparkling pins clearly above bottom-30% .qcard!
      var zAsk = nTeams >= 4 ? FOUL_Z + 8.4 : FOUL_Z + 6.4;
      var yAsk = nTeams >= 4 ? 4.4 : 3.9;
      var xFocus = nTeams >= 4 ? lane.x * 0.42 : lane.x * 0.65;
      K.cam.set(V(xFocus, yAsk, zAsk), V(xFocus, -0.35, -3.5), 2.5);
    }
    if (name === 'aim') K.cam.set(V(lane.x, 2.35, FOUL_Z + 4.85), V(lane.x, .38, -3.0), 2.8);
    if (name === 'roll') {
      K.cam.follow = function () {
        var z = roll ? Math.max(roll.z, HEAD_Z + 1) : 0;
        K.cam.tPos.set(lane.x + (roll ? roll.x * .35 : 0), 1.82, z + 3.2);
        K.cam.tLook.set(lane.x, .45, z - 3.6);
      };
      K.cam.k = 3.8;
    }
    if (name === 'pins') K.cam.set(V(lane.x + 1.25, 1.58, HEAD_Z + 2.85), V(lane.x, .52, HEAD_Z - .65), 3.8);
    if (name === 'end') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .28) * 1.4;
        K.cam.tPos.set(a, 3.4, FOUL_Z + 7.2);
        K.cam.tLook.set(0, 1.35, FOUL_Z + .8);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer for your team!' },
    { ico: '🎯', c: '#4f9dff', t: '2. Aim & Choose Power', s: 'Tap once to lock the arrow, and tap again for power!' },
    { ico: '🎳', c: '#2fc58a', t: '3. Knock Down the Pins!', s: 'Every pin is one point, and all ten is a STRIKE for plus five!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.bw-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'bw-howto-modal'));
    var card = K.el('div', 'bw-howto-card');
    card.innerHTML = '<h2 class="bw-howto-title">🎳 How to Play Bowling 3D</h2>';
    var grid = K.el('div', 'bw-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'bw-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="bw-step-num">' + (idx + 1) + '</span>' +
        '<div class="bw-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'bw-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);
    var closeBtn = K.el('button', 'btn green', '👍 Got It! Let’s Bowl!');
    closeBtn.onclick = function () {
      try { localStorage.setItem('eaa_howto_bowling3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(closeBtn);
    modal.appendChild(card);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeBtn.onclick(); });
    K.say('How to play Bowling! Step 1: Listen and tap the right answer. Step 2: Tap to aim and choose power. Step 3: Knock down all ten pins for a strike!');
  }

  function addHelpTopButton() {
    var tb = document.querySelector('.topbtns');
    if (!tb || tb.querySelector('.bw-help-ibtn')) return;
    var hb = K.el('button', 'ibtn bw-help-ibtn', '❓');
    hb.title = 'How to Play';
    hb.onclick = function () { openHowTo(); };
    tb.insertBefore(hb, tb.firstChild);
  }

  /* ---------------- live turn banner & frame-by-frame score board ---------------- */
  var hud = null, turnBannerEl = null, liveBoardEl = null;
  function updateLiveScoreUI(activeI) {
    if (turnBannerEl && activeI >= 0 && TEAMS[activeI]) {
      var t = TEAMS[activeI];
      turnBannerEl.style.setProperty('--c', t.c);
      turnBannerEl.innerHTML = '<span class="bw-turn-dot"></span><span>Round ' + (round + 1) + ' of ' + ROUNDS + ' · <b>Team ' + t.name + '’s Turn!</b></span>';
    }
    if (liveBoardEl) {
      var rowsHtml = TEAMS.map(function (t, ti) {
        var cells = [];
        for (var r = 0; r < ROUNDS; r++) {
          var v = t.rolls[r];
          var isSt = v === 10;
          cells.push('<span class="bw-fcell' + (isSt ? ' strike' : '') + '">' + (v == null ? '·' : (isSt ? '⚡' : v)) + '</span>');
        }
        return '<div class="bw-live-row' + (ti === activeI ? ' on' : '') + '" style="--c:' + t.c + '">' +
          '<b>' + t.name + '</b>' +
          '<div class="bw-live-frames">' + cells.join('') + '</div>' +
          '<span class="bw-live-tot">' + t.score + '</span>' +
        '</div>';
      }).join('');
      liveBoardEl.innerHTML = '<div class="bw-live-head">🎳 Scorecard · ' + ROUNDS + ' Rounds</div>' + rowsHtml;
    }
  }

  /* ---------------- flow ---------------- */
  var phase = 'loading', round = 0, turnI = 0, demoN = 0, DEMO_WRONG = [3, 7];

  function rebuildSetup(newTeams, newRounds) {
    nTeams = clamp(newTeams || nTeams, 2, 4);
    ROUNDS = clamp(newRounds || ROUNDS, 1, 5);
    initTeams();
    buildLanes();
    placeCharacters();
  }

  function title() {
    phase = 'title';
    window.__k3phase = 'title';
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    setTurnMarker(-1);
    K.ui.clear();
    shot('title');
    K.cam.snap();

    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Bowling 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.45rem">🎳 Answer right, lock your aim &amp; power, and knock down the pins!</div>' +
      '<div class="say" id="bw-sub-rules" style="--c:#4f9dff">' + ROUNDS + ' rounds · every pin = 1 point · STRIKE = +5 bonus!</div>';

    // Interactive Teams (2..4) and Rounds (2..5) selector row
    var setup = K.el('div', 'bw-setup');
    var tGrp = K.el('div', 'bw-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (nt) {
      var b = K.el('button', 'bw-pill' + (nt === nTeams ? ' on' : ''), String(nt));
      b.onclick = function () {
        K.sfx('hello');
        rebuildSetup(nt, ROUNDS);
        title();
      };
      tGrp.appendChild(b);
    });
    var rGrp = K.el('div', 'bw-setup-grp', '<span>🔄 Rounds:</span>');
    [2, 3, 4, 5].forEach(function (nr) {
      var b = K.el('button', 'bw-pill' + (nr === ROUNDS ? ' on' : ''), String(nr));
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
    var go = K.el('button', 'btn green', '▶ Play Bowling!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['hello', 'correct', 'wrong', 'roll', 'strike', 'pins', 'gutter', 'whoosh', 'win', 'music', 'crowd']);
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

    // Show 3-step How to Play automatically on first visit (or when ?howto=1)
    var seenHowTo = false;
    try { seenHowTo = localStorage.getItem('eaa_howto_bowling3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' 🎳'; });
    turnBannerEl = K.ui.add(K.el('div', 'bw-turn-banner'));
    liveBoardEl = K.ui.add(K.el('div', 'bw-live-board'));
    hud.refresh(-1);
    round = 0;
    turnI = 0;
    nextTurn();
  }

  function nextTurn() {
    if (turnI >= nTeams) { turnI = 0; round++; }
    if (round >= ROUNDS) return finish();
    var lane = lanes[turnI], t = lane.team, m = mons[turnI];
    phase = 'ask';
    window.__k3phase = 'ask';
    hud.refresh(turnI);
    setTurnMarker(turnI);
    updateLiveScoreUI(turnI);
    demoN++;
    if (!lane.pins.length || lane.pins.some(function (p) { return p.down; })) rackPins(lane);
    if (turnI === 0) K.ui.big('Round ' + (round + 1) + ' of ' + ROUNDS, 1.2, true);
    shot('ask', lane);
    if (m) {
      m.setState('hello');
      K.after(.8, function () { if (phase === 'ask') m.setState('ready'); });
    }
    K.sfx('hello');
    K.after(.85, function () {
      K.ui.ask(QS.next(), t, {
        prompt: 'answer right to aim your ball!',
        demoRight: DEMO_WRONG.indexOf(demoN) < 0,
        onAnswer: function (ok) {
          if (ok) {
            K.sfx('correct');
            if (m) m.setState('cheer');
            K.fx.burst(monSpot(turnI).add(V(0, 1.2, 0)), 18, { color: [t.hex, 0xffd84a], speed: 4, size: .14, life: .55 });
            shot('aim', lane);
            showHeldBall(turnI);
            K.after(.45, function () {
              if (m) m.setState('ready');
              aim(lane, function (x, speedMult, isSweet) {
                hideHeldBall();
                bowl(lane, x, false, speedMult, isSweet);
              });
            });
          } else {
            K.sfx('wrong');
            if (m) m.setState('sad');
            K.ui.toast('Oops! A wobbly ball…', 1.5, t.c);
            shot('aim', lane);
            K.after(1.1, function () {
              bowl(lane, rnd(-HALF * .95, HALF * .95), true, .76, false);
            });
          }
        }
      });
    });
  }

  function bowl(lane, x, wobbly, speedMult, isSweet) {
    phase = 'roll';
    window.__k3phase = 'roll';
    var t = lane.team, m = mons[lane.i], ball = makeBall(t);
    if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(ball, 0.42, { y: -BALL_R + 0.015, opacity: 0.34 });
    if (GQC && GQC.Juice) GQC.Juice.squashStretch(ball, 1.24, 0.80, 1.24, 0.26);
    lane.group.add(ball);
    var pwr = speedMult || 1;
    roll = {
      lane: lane,
      mesh: ball,
      x: clamp(x, -HALF + .1, HALF - .1),
      z: FOUL_Z - .2,
      vx: wobbly ? rnd(-.28, .28) : 0,
      vz: (wobbly ? -6.3 : -8.9) * pwr,
      hook: wobbly ? rnd(-.42, .42) : (isSweet ? -x * .08 : rnd(-.09, .09)),
      wobble: wobbly ? rnd(.65, 1.1) : 0,
      power: pwr,
      sweet: !!isSweet,
      gutter: false,
      hitFirstPin: false,
      done: false,
      settle: 0
    };
    if (isSweet && !wobbly) {
      K.ui.toast('⚡ SUPER SPIN POWER!', 1.2, '#2fc58a');
      K.fx.burst(V(lane.x + roll.x, .6, FOUL_Z - .4), 16, { color: [0xffd84a, t.hex], speed: 3.5, size: .14, life: .5 });
    }
    if (m) {
      m.root.parent.rotation.y = Math.PI;
      m.setState('bowl');
      K.after(.95, function () { m.setState('idle'); });
    }
    K.sfx('roll');
    shot('roll', lane);
    var fn = K.onFrame(function () {
      if (roll && roll.z < HEAD_Z + 2.5 && !roll.camPins) {
        roll.camPins = true;
        shot('pins', lane);
      }
      if (roll && roll.done && roll.settle <= 0) {
        K.offFrame(fn);
        result(lane);
      }
    });
  }

  function result(lane) {
    K.timeScale = 1.0;
    var t = lane.team, m = mons[lane.i], n = lane.pins.filter(function (p) { return p.down; }).length, strike = n === 10;
    if (roll && roll.mesh) lane.group.remove(roll.mesh);
    roll = null;
    var pts = n + (strike ? 5 : 0);
    t.score += pts;
    t.rolls.push(n);
    if (strike) t.strikes++;
    hud.refresh(lane.i);
    hud.bump(lane.i);
    updateLiveScoreUI(lane.i);

    var head = V(lane.x, 1.85, HEAD_Z);
    if (GQC && GQC.Juice && pts > 0) {
      GQC.Juice.popupScore(strike ? '⚡ STRIKE! +15' : ('+' + pts + ' PINS!'), head.clone(), K.camera, t.c);
    }
    if (strike) {
      K.sfx('strike');
      playBowlSfx('strike');
      K.ui.big('⚡ STRIKE! +15', 1.65);
      K.fx.confetti(head.clone().add(V(0, 1.1, 0)), 160);
      K.fx.text('+15 ⭐', head.clone().add(V(0, .5, 0)), '#ffb320', 1.5);
      K.say('Strike! Fifteen points!');
      K.cam.shake(.32);
      if (m) m.setState('cheer');
    } else if (n >= 8) {
      K.sfx('pins');
      K.ui.big('✨ GREAT ROLL! +' + pts, 1.35, true);
      K.fx.burst(head, 32, { color: [t.hex, 0xffd84a], speed: 5, size: .16, life: .7 });
      K.fx.text('+' + pts + ' pins!', head, t.c, 1.35);
      K.say(n + ' pins! Great roll!');
      if (m) m.setState('cheer');
    } else if (n > 0) {
      K.sfx('pins');
      K.fx.text('+' + n + (n === 1 ? ' pin!' : ' pins!'), head, t.c, 1.3);
      K.say(n + (n === 1 ? ' pin' : ' pins'));
      if (m) m.setState(n >= 5 ? 'cheer' : 'clap');
    } else {
      K.fx.text('Gutter · 0', head, '#8a9099', 1.1);
      K.say('Good try! Next time!');
      if (m) m.setState('shrug');
    }
    K.after(2.1, function () {
      if (m) {
        m.setState('idle');
        m.root.parent.rotation.y = 0;
      }
      turnI++;
      nextTurn();
    });
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    var stepSpecs = [
      { rank: 1, x: 0,    h: 1.15, w: 1.9, col: 0xffd84a, medal: '1' },
      { rank: 2, x: -2.1, h: 0.80, w: 1.7, col: 0xdce4f2, medal: '2' },
      { rank: 3, x: 2.1,  h: 0.58, w: 1.7, col: 0xf0a868, medal: '3' },
      { rank: 4, x: 4.1,  h: 0.36, w: 1.5, col: 0xe9e2f5, medal: '4' }
    ];
    var pz = FOUL_Z + 1.15;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti];
      var g = new T3.Group();
      g.position.set(sp.x, 0, pz);
      podiumGroup.add(g);

      var base = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      base.position.y = .18 + sp.h / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = .18 + sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.68);
      numLab.position.set(0, .18 + sp.h + 1.85, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.45);
        tr.position.set(.56, .18 + sp.h + .05, sp.w * .34);
        g.add(tr);
      }

      var m = mons[ti];
      if (m && m.root.parent) {
        m.root.parent.children.forEach(function (c) { if (c.isSprite) c.visible = false; });
        m.root.parent.position.set(sp.x - (rk === 0 ? .12 : 0), .22 + sp.h + .06, pz - .05);
        m.root.parent.rotation.set(0, 0, 0);
        m.setState(rk === 0 ? 'cheer' : 'clap');
      }
    });
  }

  function finish() {
    phase = 'end';
    window.__k3phase = 'end';
    setTurnMarker(-1);
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();
    hud.refresh(-1);

    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return TEAMS[b].score - TEAMS[a].score;
    });
    var best = TEAMS[order[0]];
    buildPodium3D(order);

    shot('end');
    K.sfx('win');
    K.fx.confetti(V(0, 4.2, FOUL_Z + 1), 240);
    K.after(.8, function () { K.fx.confetti(V(-2.2, 3.8, FOUL_Z + 1), 120); K.fx.confetti(V(2.2, 3.8, FOUL_Z + 1), 120); });
    K.ui.big('🏆 Team ' + best.name + ' Wins!', 2.3, true);
    K.say('Team ' + best.name + ' wins the bowling trophy!');

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var tableRows = order.map(function (ti, rk) {
        var t = TEAMS[ti];
        var cells = t.rolls.map(function (v) {
          var isSt = v === 10;
          return '<span class="bw-fcell' + (isSt ? ' strike' : '') + '">' + (isSt ? '⚡10' : v) + '</span>';
        }).join('');
        return '<div class="bw-table-row" style="--c:' + t.c + '">' +
          '<span class="bw-rank">' + (rk + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<div class="bw-live-frames">' + cells + '</div>' +
          '<i>' + (t.strikes ? '⚡×' + t.strikes + ' · ' : '') + t.score + ' pts</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + best.c + ';font-size:1.5rem">🏆 Team ' + best.name + ' · ' + best.score + ' points!</div>' +
        '<div class="bw-table">' + tableRows + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'bowling3d', title: 'Bowling 3D', scoreOf: function (t) { return t.score; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Polishing the lanes…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'bowl', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  var alleyP = K.tryGLB('models/bowling-alley.glb').then(function (g) { return g ? K.fitModel(g.scene, 8.5) : null; });
  var trophyP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  Promise.all([worldP, alleyP, trophyP].concat(K.TEAMS.map(function (t, i) { return K.makeCharacter(t, { kidsOnly: true, kid: i % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.38 }); }))).then(function (res) {
    alleyModel = res[1];
    trophyModel = res[2];
    res.slice(3).forEach(function (ch, i) {
      ch._pace = 0.91 + (i % 4) * 0.055;
      var h = new T3.Group();
      h.add(ch.root);
      scene.add(h);
      if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(h, 0.72, { y: 0.015, opacity: 0.28 });
      charHolders[i] = h;
      mons[i] = ch;
    });
    buildLanes();
    placeCharacters();
    loading.remove();
    title();
    window.__bowling3d = {
      getPhase: function () { return phase; },
      getFps: function () {
        if (!fpsSamples.length) return 60;
        var sum = fpsSamples.reduce(function (a, b) { return a + b; }, 0);
        return Math.round(sum / fpsSamples.length);
      },
      getTeams: function () { return TEAMS; },
      openHowTo: openHowTo,
      captureShot: function (mode) {
        K.ui.clear(); K.ui.topButtons(); addHelpTopButton();
        hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' 🎳'; });
        turnBannerEl = K.ui.add(K.el('div', 'bw-turn-banner'));
        liveBoardEl = K.ui.add(K.el('div', 'bw-live-board'));
        aimArrow.visible = false;
        hideHeldBall();
        turnI = 0; round = 0;
        var lane = lanes[0];
        rackPins(lane);
        hud.refresh(0); setTurnMarker(0); updateLiveScoreUI(0);
        if (mode === 'question') {
          phase = 'ask'; window.__k3phase = 'ask';
          shot('ask', lane); K.cam.snap();
          K.ui.ask(QS.next(), lane.team, { prompt: 'answer right to aim your ball!', onAnswer: function () {} });
        } else if (mode === 'aim') {
          phase = 'aim'; window.__k3phase = 'aim';
          showHeldBall(0);
          shot('aim', lane); K.cam.snap();
          aim(lane, function () {});
        } else if (mode === 'pins') {
          phase = 'roll'; window.__k3phase = 'roll';
          lane.pins.forEach(function (p, pi) {
            if (pi < 8) { p.down = true; p.fall = 1.15; p.x += (pi % 2 ? 0.25 : -0.25); p.z -= 0.4; }
          });
          shot('pins', lane); K.cam.snap();
          K.ui.big('⚡ STRIKE! +15', 5, true);
        }
      }
    };
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
