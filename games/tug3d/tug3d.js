/* Tug of War 3D — English Adventure Academy
   Plays at Tug Meadow in Adventure Park (games/world, zone "tug").
   Knockout: Pink v Blue, Yellow v Green, then the two winners in the final.
   The two sides answer in turns: right = a strong pull (1 step), wrong = the other side gets a small pull (½ step).
   The match ends when the red ribbon crosses a side's line (3 steps). After 10 questions the side ahead wins.
   Options: ?teams=2..4  ?steps=2..4  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 40, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var WIN = clamp(+K.Q.get('steps') || 3, 2, 4);
  var STRONG = 1, SMALL = .5, MAX_Q = +K.Q.get('maxq') || 10;

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, wins: 0, place: 0, rank: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- meadow, mud pit, lines & Tripo props ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x8fdc7a);

  var field = new T3.Group();
  scene.add(field);
  var propGroup = new T3.Group();
  scene.add(propGroup);
  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);

  var archModel = null, flagpoleModel = null, trophyModel = null;

  (function buildField() {
    // Light sandy tug strip under the rope with grassy border curbing
    var border = new T3.Mesh(
      new T3.BoxGeometry(27, .12, 6.8),
      new T3.MeshStandardMaterial({ color: 0xd9bf8c, roughness: .75 })
    );
    border.position.y = .01;
    border.receiveShadow = true;
    field.add(border);

    var strip = new T3.Mesh(
      new T3.PlaneGeometry(26, 6),
      new T3.MeshStandardMaterial({ color: 0xf6e6bf, roughness: .8 })
    );
    strip.rotation.x = -Math.PI / 2;
    strip.position.y = .075;
    strip.receiveShadow = true;
    field.add(strip);

    // Glossy mud pit in the middle with rocky rim and bubbling mud blisters
    var mudOuter = new T3.Mesh(
      new T3.CircleGeometry(1, 48),
      new T3.MeshStandardMaterial({ color: 0x6e4325, roughness: .45 })
    );
    mudOuter.rotation.x = -Math.PI / 2;
    mudOuter.scale.set(1.72, 2.52, 1);
    mudOuter.position.y = .082;
    mudOuter.receiveShadow = true;
    field.add(mudOuter);

    var mudMat = new T3.MeshStandardMaterial({ color: 0x8a542e, roughness: .18, metalness: .08 });
    var pit = new T3.Mesh(new T3.CircleGeometry(1, 48), mudMat);
    pit.rotation.x = -Math.PI / 2;
    pit.scale.set(1.55, 2.35, 1);
    pit.position.y = .09;
    pit.receiveShadow = true;
    field.add(pit);

    var rim = new T3.Mesh(
      new T3.TorusGeometry(1, .095, 10, 48),
      new T3.MeshStandardMaterial({ color: 0x5c361c, roughness: .55 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.set(1.58, 2.38, 1);
    rim.position.y = .10;
    field.add(rim);

    // Decorative mud-pit rim stones
    var stoneMat = new T3.MeshStandardMaterial({ color: 0x9c8c78, roughness: .65 });
    for (var r = 0; r < 14; r++) {
      var ang = (r / 14) * Math.PI * 2;
      var st = new T3.Mesh(new T3.DodecahedronGeometry(rnd(.14, .22), 0), stoneMat);
      st.position.set(Math.cos(ang) * 1.66, .12, Math.sin(ang) * 2.45);
      st.scale.y = .65;
      st.rotation.y = rnd(0, 6);
      st.castShadow = true;
      field.add(st);
    }

    // Bubbling mud blisters
    for (var b = 0; b < 9; b++) {
      var bub = new T3.Mesh(
        new T3.SphereGeometry(rnd(.07, .14), 12, 10),
        new T3.MeshStandardMaterial({ color: 0xa1663a, roughness: .16 })
      );
      bub.position.set(rnd(-1.05, 1.05), .10, rnd(-1.65, 1.65));
      field.add(bub);
      (function (m, ph) {
        K.onFrame(function (dt, t) {
          var u = (t * .55 + ph) % 1;
          m.scale.setScalar(.42 + u * .95);
          m.position.y = .08 + u * .05;
          m.visible = u < .92;
        });
      })(bub, Math.random());
    }

    // Team posts at both ends with waving flags (coloured per match)
    [-1, 1].forEach(function (s) {
      var post = new T3.Mesh(
        new T3.CylinderGeometry(.1, .13, 3.5, 14),
        new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .3 })
      );
      post.position.set(s * 12.5, 1.75, 2.4);
      post.castShadow = true;
      field.add(post);

      var finial = new T3.Mesh(
        new T3.SphereGeometry(.18, 14, 12),
        new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .25, metalness: .2 })
      );
      finial.position.set(s * 12.5, 3.55, 2.4);
      field.add(finial);
    });
  })();

  function groundLine(x, color, w) {
    var m = new T3.Mesh(
      new T3.PlaneGeometry(w || .24, 5.8),
      new T3.MeshBasicMaterial({ color: color })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, .095, 0);
    field.add(m);
    return m;
  }
  var centreLine = groundLine(0, 0xffffff, .14);
  var sideLine = {
    '-1': groundLine(-WIN, 0xff5fa2, .32),
    '1':  groundLine(WIN, 0x4f9dff, .32)
  };
  function updateWinLines() {
    sideLine['-1'].position.x = -WIN;
    sideLine['1'].position.x = WIN;
  }

  var sideFlag = {};
  [-1, 1].forEach(function (s) {
    var f = new T3.Mesh(
      new T3.PlaneGeometry(1.55, .92),
      new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .4, side: T3.DoubleSide })
    );
    f.geometry.translate(-s * .77, 0, 0);
    f.position.set(s * 12.5, 3.05, 2.4);
    field.add(f);
    sideFlag[s] = f;
    K.onFrame(function (dt, t) {
      f.rotation.y = Math.sin(t * 2.6 + s) * .32;
    });
  });

  function placeDecorModels() {
    while (propGroup.children.length) propGroup.remove(propGroup.children[0]);
    if (archModel) {
      var arch = archModel.clone(true);
      arch.position.set(0, 0, 7.6);
      arch.rotation.y = Math.PI;
      propGroup.add(arch);
    }
    if (flagpoleModel) {
      [-1, 1].forEach(function (s) {
        var fp = flagpoleModel.clone(true);
        fp.position.set(s * 11.2, 0, 4.2);
        fp.rotation.y = s < 0 ? .3 : -.3;
        propGroup.add(fp);
      });
    }
    if (trophyModel) {
      [-1, 1].forEach(function (s) {
        var ped = new T3.Mesh(
          new T3.CylinderGeometry(.55, .68, .65, 20),
          new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: .35 })
        );
        ped.position.set(s * 7.8, .325, 6.2);
        ped.castShadow = true;
        propGroup.add(ped);

        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.65);
        tr.position.set(s * 7.8, .66, 6.2);
        tr.rotation.y = Math.PI;
        propGroup.add(tr);
      });
    }
  }

  /* ---------------- 3D Mud Splash Physics Droplets ---------------- */
  var mudDroplets = [];
  var mudDropGeo = new T3.SphereGeometry(.14, 10, 8);
  var mudDropMat1 = new T3.MeshStandardMaterial({ color: 0x7a4928, roughness: .2 });
  var mudDropMat2 = new T3.MeshStandardMaterial({ color: 0x5c341a, roughness: .25 });

  function spawnMudSplash(center) {
    for (var i = 0; i < 26; i++) {
      var ang = rnd(0, Math.PI * 2), spd = rnd(1.8, 5.2);
      var m = new T3.Mesh(mudDropGeo, i % 2 ? mudDropMat1 : mudDropMat2);
      var sc = rnd(.55, 1.35);
      m.scale.set(sc, sc * 1.15, sc);
      m.position.copy(center).add(V(rnd(-.4, .4), .18, rnd(-.4, .4)));
      scene.add(m);
      mudDroplets.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: rnd(3.5, 7.2),
        vz: Math.sin(ang) * spd,
        life: 0,
        maxLife: rnd(.75, 1.25)
      });
    }
  }

  K.onFrame(function (dt) {
    for (var i = mudDroplets.length - 1; i >= 0; i--) {
      var d = mudDroplets[i];
      d.life += dt;
      d.vy -= 14.5 * dt;
      d.mesh.position.x += d.vx * dt;
      d.mesh.position.y += d.vy * dt;
      d.mesh.position.z += d.vz * dt;
      if (d.mesh.position.y < .1) {
        d.mesh.position.y = .1;
        d.vx *= .7;
        d.vz *= .7;
        d.mesh.scale.y = .35;
      }
      if (d.life >= d.maxLife) {
        scene.remove(d.mesh);
        mudDroplets.splice(i, 1);
      }
    }
  });

  /* ---------------- 3D Active Turn Ring & Arrow (sleek, never blocks characters) ---------------- */
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(
      new T3.TorusGeometry(.52, .04, 10, 28),
      new T3.MeshBasicMaterial({ color: 0xff5fa2 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .11;
    g.add(ring);

    var cone = new T3.Mesh(
      new T3.ConeGeometry(.12, .24, 12),
      new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffa000, emissiveIntensity: .35, roughness: .25 })
    );
    cone.rotation.x = Math.PI;
    cone.position.y = 2.15;
    g.add(cone);

    g.visible = false;
    scene.add(g);
    K.onFrame(function (dt, t) {
      if (!g.visible) return;
      ring.scale.setScalar(1 + Math.sin(t * 6) * .06);
      cone.position.y = 2.12 + Math.sin(t * 5.5) * .10;
      cone.rotation.y = t * 2.8;
    });
    return {
      group: g,
      set: function (holder, hex) {
        if (!holder) { g.visible = false; return; }
        g.visible = true;
        ring.material.color.setHex(hex);
        g.position.copy(holder.position);
      }
    };
  })();
  var activeTurnHolder = null, activeTurnHex = 0xff5fa2;

  /* ---------------- the rope (braided hemp texture), grip knots & red ribbon ---------------- */
  var pos = 0, posShow = 0;            // where the ribbon is: <0 towards right side, >0 towards left side
  var ROPE_Y = 0.72, ROPE_HALF = 8.8;
  var ropeTex = K.canvasTex(128, 512, function (c, W, H) {
    c.fillStyle = '#cf9e5e';
    c.fillRect(0, 0, W, H);
    // Crisp high-contrast diagonal braided hemp strands
    for (var y = -H; y < H * 2; y += 20) {
      c.strokeStyle = '#784c1e';
      c.lineWidth = 8;
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + W * 0.72); c.stroke();
      c.strokeStyle = '#f5d7a3';
      c.lineWidth = 5;
      c.beginPath(); c.moveTo(0, y + 7); c.lineTo(W, y + 7 + W * 0.72); c.stroke();
    }
  });
  ropeTex.wrapS = ropeTex.wrapT = T3.RepeatWrapping;
  ropeTex.repeat.set(1, 18);
  var ropeMat = new T3.MeshStandardMaterial({ map: ropeTex, roughness: .72, metalness: .02 });
  var rope = new T3.Mesh(new T3.BufferGeometry(), ropeMat);
  rope.castShadow = true;
  scene.add(rope);

  // Realistic procedural Tug-of-War Foley (rope creak, foot scuff, crowd roar)
  var foley = (function () {
    var ctx = null, nBuf = null;
    function ensure() {
      if (K.muted) return false;
      if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(function () {}); return true; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        ctx = new AC();
        var len = ctx.sampleRate * 2;
        nBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = nBuf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        return true;
      } catch (e) { return false; }
    }
    return {
      ropeCreak: function (heavy) {
        if (!ensure() || !nBuf) return;
        var t = ctx.currentTime, dur = heavy ? 0.65 : 0.4;
        // Creaking taut hemp fiber sound
        var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(heavy ? 95 : 130, t);
        o.frequency.exponentialRampToValueAtTime(heavy ? 185 : 220, t + dur * 0.6);
        o.frequency.exponentialRampToValueAtTime(110, t + dur);
        f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 4.5;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(heavy ? 0.14 : 0.08, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(f); f.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + dur + 0.04);
      },
      footScuff: function () {
        if (!ensure() || !nBuf) return;
        var t = ctx.currentTime;
        var s = ctx.createBufferSource(); s.buffer = nBuf;
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 680; f.Q.value = 1.2;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.11, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        s.connect(f); f.connect(g); g.connect(ctx.destination);
        s.start(t); s.stop(t + 0.18);
      }
    };
  })();

  var SLOTS_X = [2.65, 3.85, 5.05];     // 3 rigged kids per side, tightly spaced along the rope!
  var gripKnots = [];
  (function () {
    var knotGeo = new T3.TorusGeometry(.095, .042, 8, 16);
    var knotMat = new T3.MeshStandardMaterial({ color: 0xb88b52, roughness: .5 });
    [-1, 1].forEach(function (s) {
      SLOTS_X.forEach(function (sx) {
        var k = new T3.Mesh(knotGeo, knotMat);
        k.rotation.y = Math.PI / 2;
        scene.add(k);
        gripKnots.push({ mesh: k, relX: s * sx });
      });
    });
  })();

  var ribbon = new T3.Group();
  scene.add(ribbon);
  (function () {
    var knot = new T3.Mesh(
      new T3.SphereGeometry(.17, 16, 14),
      new T3.MeshStandardMaterial({ color: 0xff2e2e, roughness: .3 })
    );
    ribbon.add(knot);

    var goldRing = new T3.Mesh(
      new T3.TorusGeometry(.21, .032, 10, 24),
      new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .25, metalness: .3 })
    );
    ribbon.add(goldRing);

    var tailMat = new T3.MeshStandardMaterial({ color: 0xff3b3b, roughness: .38, side: T3.DoubleSide });
    var tail1 = new T3.Mesh(new T3.PlaneGeometry(.24, .95), tailMat);
    tail1.position.set(-.06, -.46, 0);
    tail1.rotation.z = -.12;
    ribbon.add(tail1);

    var tail2 = new T3.Mesh(new T3.PlaneGeometry(.22, .85), tailMat);
    tail2.position.set(.07, -.42, .03);
    tail2.rotation.z = .14;
    ribbon.add(tail2);

    K.onFrame(function (dt, t) {
      tail1.rotation.y = Math.sin(t * 5.5) * .42;
      tail2.rotation.y = Math.cos(t * 6.2) * .38;
      goldRing.rotation.y = t * 2.5;
    });
  })();

  var tension = 0, pullSurge = 0;
  var _lh = new T3.Vector3(), _rh = new T3.Vector3();
  function ropeCurve(off, tens, t) {
    // Route the braided rope RIGHT THROUGH the clenched hands of all 6 rigged pulling kids!
    var pts = [];
    if (playing && sides.length === 2) {
      var rightKids = sides[1].crew.kids; // s = -1 (negative X)
      var leftKids  = sides[0].crew.kids; // s = +1 (positive X)
      // Tail end on right (-X)
      pts.push(V(off - ROPE_HALF, ROPE_Y - 0.12, 0));
      // Right team hands (back to front: k=2, 1, 0)
      for (var r = rightKids.length - 1; r >= 0; r--) {
        if (!rightKids[r].inMud) {
          rightKids[r].getBoneWorldPos('LeftHand', _lh);
          rightKids[r].getBoneWorldPos('RightHand', _rh);
          pts.push(V((_lh.x + _rh.x) * 0.5, (_lh.y + _rh.y) * 0.5, (_lh.z + _rh.z) * 0.5));
        }
      }
      // Center ribbon knot (with live tension vibration!)
      var sag = 0.24 * (1 - tens);
      var vibY = Math.sin(t * 28) * 0.045 * pullSurge;
      var vibZ = Math.cos(t * 24) * 0.03 * pullSurge;
      pts.push(V(off, ROPE_Y - sag + vibY, vibZ));
      // Left team hands (front to back: k=0, 1, 2)
      for (var l = 0; l < leftKids.length; l++) {
        if (!leftKids[l].inMud) {
          leftKids[l].getBoneWorldPos('LeftHand', _lh);
          leftKids[l].getBoneWorldPos('RightHand', _rh);
          pts.push(V((_lh.x + _rh.x) * 0.5, (_lh.y + _rh.y) * 0.5, (_lh.z + _rh.z) * 0.5));
        }
      }
      // Tail end on left (+X)
      pts.push(V(off + ROPE_HALF, ROPE_Y - 0.12, 0));
      // Sort strictly by X so CatmullRomCurve3 never kinks
      pts.sort(function (a, b) { return a.x - b.x; });
      return new T3.CatmullRomCurve3(pts);
    }
    var sag2 = .26 * (1 - tens);
    for (var i = 0; i <= 20; i++) {
      var u = i / 20, x = -ROPE_HALF + u * ROPE_HALF * 2;
      pts.push(V(x + off, ROPE_Y - Math.sin(u * Math.PI) * sag2, 0));
    }
    return new T3.CatmullRomCurve3(pts);
  }

  K.onFrame(function (dt, t) {
    posShow = K.lerp(posShow, pos, 1 - Math.exp(-dt * 6.5));
    tension = K.lerp(tension, playing ? 1 : 0, dt * 3.5);
    pullSurge = Math.max(0, pullSurge - dt * 1.15);
    var wob = playing ? Math.sin(t * 9.5) * (.025 + pullSurge * .07) : 0;
    var off = posShow + wob;

    // Update character positions & bones FIRST so rope threads through their live animated hands!
    sides.forEach(function (sd) { placeSide(sd, off, t); });
    crews.forEach(function (c) {
      c.all.forEach(function (ch) { ch.update(dt); });
    });

    var curve = ropeCurve(off, tension, t);
    rope.geometry.dispose();
    rope.geometry = new T3.TubeGeometry(curve, 44, .062, 8, false);
    var midPt = curve.getPointAt(0.5);
    ribbon.position.set(off, midPt.y, midPt.z);

    gripKnots.forEach(function (gk) {
      gk.mesh.visible = rope.visible;
      var u = clamp((gk.relX + ROPE_HALF) / (ROPE_HALF * 2), 0, 1);
      var pt = curve.getPointAt(u);
      gk.mesh.position.copy(pt);
    });

    if (activeTurnHolder && playing) {
      turnMarker.set(activeTurnHolder, activeTurnHex);
    } else if (!playing) {
      turnMarker.set(null);
    }

    var h = Math.abs(posShow) / WIN;
    [-1, 1].forEach(function (s) {
      sideLine[s].material.opacity = 1;
      sideLine[s].scale.x = 1 + (Math.sign(posShow) === s ? h * .85 + .25 * Math.sin(t * 8) * h : 0);
    });
  });

  /* ---------------- characters: each team = 3 rigged kids on the rope + 1 mascot coach on sideline ---------------- */
  var crews = [];          // one per team: { mon (coach), kids:[k0,k1,k2], all:[..] }
  var sides = [];          // the two crews pulling now: { crew, s, team, ti }
  var playing = false;

  function placeSide(sd, off, t) {
    // 3 rigged kids stand directly along the rope (z ≈ 0), facing the center pit, hands gripping the rope!
    sd.crew.kids.forEach(function (ch, k) {
      if (ch.inMud) return;
      var h = ch.holder;
      h.position.x = off + sd.s * SLOTS_X[k] + (ch.step || 0) * sd.s;
      h.position.y = (ch.hopY || 0) + 0.08;
      // Alternating tiny Z offset so kids stand shoulder-to-shoulder along the rope without clipping
      h.position.z = (k % 2 === 0 ? 0.06 : -0.06);
      h.rotation.y = sd.s < 0 ? Math.PI / 2 : -Math.PI / 2;
      h.rotation.z = 0; // REAL skeletal animation drives the lean — ZERO stiff box-tilting!
    });
    // Team monster stands proudly on the sideline cheering as Team Captain/Coach!
    if (sd.crew.mon && !sd.crew.mon.inMud) {
      var mh = sd.crew.mon.holder;
      mh.position.set(off + sd.s * 6.6, 0.08, 2.25);
      mh.rotation.set(0, Math.PI, 0);
    }
  }

  // Teams that are not pulling wait on the side and cheer
  var benchOrder = [];
  function benchSpot(ti, k) {
    var order = benchOrder.indexOf(ti);
    return V(-((order - (benchOrder.length - 1) / 2) * 5 + (k - 1) * 1.3), 0, 5.6 + (k === 0 ? 0 : .6));
  }
  function toBench(ti) {
    if (ti >= nTeams) {
      if (crews[ti]) crews[ti].all.forEach(function (ch) { ch.holder.visible = false; });
      return;
    }
    if (benchOrder.indexOf(ti) < 0) benchOrder.push(ti);
    benchOrder.forEach(function (bi) {
      if (!crews[bi]) return;
      crews[bi].all.forEach(function (ch, k) {
        ch.inMud = false;
        ch.step = 0;
        ch.hopY = 0;
        var p = benchSpot(bi, k);
        ch.holder.position.copy(p);
        ch.holder.rotation.set(0, Math.PI, 0);
        ch.holder.visible = bi < nTeams;
        if (ch.kind === 'kid' && ch.actions && ch.actions.SideCheer) {
          ch.playClip('SideCheer', { startPhase: Math.random(), speed: 0.9 + Math.random() * 0.25 });
        } else {
          ch.setState('idle');
        }
      });
    });
  }
  function offBench(ti) {
    var i = benchOrder.indexOf(ti);
    if (i >= 0) benchOrder.splice(i, 1);
    benchOrder.forEach(function (bi) {
      if (!crews[bi]) return;
      crews[bi].all.forEach(function (ch, k) {
        ch.holder.position.copy(benchSpot(bi, k));
      });
    });
  }
  function syncBenchForTeamCount() {
    benchOrder = [];
    for (var i = 0; i < ALL_TEAMS.length; i++) {
      if (i < nTeams) toBench(i);
      else if (crews[i]) crews[i].all.forEach(function (ch) { ch.holder.visible = false; });
    }
  }
  function cheerBench() {
    benchOrder.forEach(function (bi) {
      if (!crews[bi]) return;
      var ch = crews[bi].all[(Math.random() * crews[bi].all.length) | 0];
      if (ch && ch.state === 'idle') {
        ch.setState(Math.random() < .5 ? 'clap' : 'hop');
        K.after(1.2, function () { if (ch.state !== 'cheer') ch.setState('idle'); });
      }
    });
  }

  /* ---------------- camera (cinematic low-angle sports broadcast!) ---------------- */
  function shot(name, extra) {
    K.cam.follow = null;
    if (name === 'title') {
      K.cam.follow = function () {
        var a = K.now * .12;
        K.cam.tPos.set(Math.sin(a) * 4.5, 4.6, -13.5 - Math.cos(a) * 1.0);
        K.cam.tLook.set(0, 1.0, .6);
      };
      K.cam.k = 1.6;
    }
    if (name === 'match') {
      K.cam.follow = function () {
        var zoomIn = pullSurge * 1.15;
        K.cam.tPos.set(posShow * .6, 3.1 - zoomIn * .18, -11.4 + zoomIn);
        K.cam.tLook.set(posShow * .6, 1.0, 0);
      };
      K.cam.k = 2.6;
    }
    if (name === 'side') {
      var x = posShow * .6 + extra * 2.2;
      K.cam.set(V(x + extra * 1.2, 2.35, -7.8), V(x, .85, 0), 2.8);
    }
    if (name === 'mud') {
      K.cam.set(V(posShow * .2, 2.6, -6.8), V(0, .55, 0), 3.4);
    }
    if (name === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .55;
        K.cam.tPos.set(a * 2, 3.6, -11.2);
        K.cam.tLook.set(0, .55, 1.6);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- knockout bracket ---------------- */
  var BRACKET = [];
  var results = [];
  function rebuildBracket() {
    TEAMS = ALL_TEAMS.slice(0, nTeams);
    BRACKET = nTeams === 4 ? [[0, 1], [2, 3], ['W0', 'W1']] : nTeams === 3 ? [[0, 1], ['W0', 2]] : [[0, 1]];
    results = [];
  }
  rebuildBracket();

  function resolve(x) { return typeof x === 'string' ? results[+x.slice(1)] : x; }
  function roundName(mi) {
    return mi === BRACKET.length - 1 ? 'Grand Final' : nTeams === 4 ? 'Semi-final ' + (mi + 1) : 'Match ' + (mi + 1);
  }
  function bracketHTML(current) {
    function slot(x) {
      var ti = resolve(x);
      if (ti == null || !TEAMS[ti]) return '<span class="tg-slot">?</span>';
      var t = TEAMS[ti];
      return '<span class="tg-slot" style="--c:' + t.c + '">' + t.name + '</span>';
    }
    return BRACKET.map(function (m, mi) {
      var w = results[mi], st = mi === current ? ' now' : w != null ? ' done' : '';
      return '<div class="tg-match' + st + '">' +
        '<small>' + roundName(mi) + '</small>' +
        slot(m[0]) + '<i>vs</i>' + slot(m[1]) +
        (w != null && TEAMS[w] ? '<b style="--c:' + TEAMS[w].c + '">🏆 ' + TEAMS[w].name + '</b>' : '') +
      '</div>';
    }).join('');
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer for your team!' },
    { ico: '🪢', c: '#4f9dff', t: '2. Heave & Pull the Rope!', s: 'Right answer pulls the red ribbon one big step towards your line!' },
    { ico: '💦', c: '#2fc58a', t: '3. Splash in the Mud Pit!', s: 'Pull the other team into the mud pit to advance to the Grand Final!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.tg-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'tg-howto-modal'));
    var card = K.el('div', 'tg-howto-card');
    card.innerHTML = '<h2 class="tg-howto-title">🪢 How to Play Tug of War 3D</h2>';
    var grid = K.el('div', 'tg-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'tg-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="tg-step-num">' + (idx + 1) + '</span>' +
        '<div class="tg-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'tg-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);

    var gotIt = K.el('button', 'btn green', '👍 Got it! Let\'s Pull!');
    gotIt.onclick = function () {
      try { localStorage.setItem('eaa_howto_tug3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(gotIt);
    modal.appendChild(card);
    K.say('How to play Tug of War! Step 1: Answer the question. Step 2: Heave and pull the rope. Step 3: Pull the other team into the mud pit!');
  }

  function addHelpTopButton() {
    var top = document.querySelector('.k3-top');
    if (!top || top.querySelector('.k3-help-btn')) return;
    var helpBtn = K.el('button', 'k3-icon k3-help-btn', '?');
    helpBtn.title = 'How to play';
    helpBtn.onclick = function () { openHowTo(); };
    top.insertBefore(helpBtn, top.firstChild);
  }

  /* ---------------- HUD: rope meter, turn banner & live bracket ---------------- */
  var meter = null, turnBannerEl = null, liveBoardEl = null;

  function showMeter(L, R) {
    if (meter) meter.remove();
    meter = K.ui.add(K.el('div', 'tg-meter'));
    var ticksHtml = '';
    for (var step = 1; step < WIN * 2; step++) {
      if (step === WIN) continue;
      var pct = 8 + (step / (WIN * 2)) * 84;
      ticksHtml += '<i class="tg-tick" style="left:' + pct.toFixed(1) + '%"></i>';
    }
    meter.innerHTML =
      '<span class="tg-side" style="--c:' + L.c + '">🚩 ' + L.name + '</span>' +
      '<div class="tg-bar">' +
        '<i class="tg-line l" style="--c:' + L.c + '"></i>' +
        ticksHtml +
        '<i class="tg-mid" title="Mud Pit"></i>' +
        '<i class="tg-line r" style="--c:' + R.c + '"></i>' +
        '<b class="tg-knot"></b>' +
      '</div>' +
      '<span class="tg-side" style="--c:' + R.c + '">' + R.name + ' 🚩</span>' +
      '<em class="tg-q"></em>';
  }
  function refreshMeter(qLeft) {
    if (!meter) return;
    meter.querySelector('.tg-knot').style.left = (50 - (pos / WIN) * 42) + '%';
    var stepsLeftL = Math.max(0, (WIN - pos)).toFixed(1).replace(/\.0$/, '');
    var stepsLeftR = Math.max(0, (WIN + pos)).toFixed(1).replace(/\.0$/, '');
    meter.querySelector('.tg-q').textContent =
      roundName(matchNo) + ' · ' + qLeft + ' Qs left · (' + stepsLeftL + ' ↔ ' + stepsLeftR + ' steps)';
  }

  function updateTurnUI(sd) {
    if (!turnBannerEl) return;
    if (!sd) {
      turnBannerEl.style.display = 'none';
      return;
    }
    turnBannerEl.style.display = 'inline-flex';
    turnBannerEl.style.setProperty('--c', sd.team.c);
    turnBannerEl.innerHTML =
      '<span class="tg-turn-dot"></span>' +
      '<span>🪢 Team ' + sd.team.name + '\'s Turn · Answer right for a BIG PULL!</span>';
  }

  function updateLiveBracketUI() {
    if (!liveBoardEl) return;
    var rows = BRACKET.map(function (m, mi) {
      var l = resolve(m[0]), r = resolve(m[1]), w = results[mi];
      var lName = l != null && TEAMS[l] ? '<b style="color:' + TEAMS[l].c + '">' + TEAMS[l].name + '</b>' : '?';
      var rName = r != null && TEAMS[r] ? '<b style="color:' + TEAMS[r].c + '">' + TEAMS[r].name + '</b>' : '?';
      return '<div class="tg-live-row' + (mi === matchNo ? ' now' : '') + '">' +
        '<span>' + roundName(mi) + ': ' + lName + ' v ' + rName + '</span>' +
        '<span>' + (w != null && TEAMS[w] ? '🏆 ' + TEAMS[w].name : (mi === matchNo ? '🪢 Live' : '…')) + '</span>' +
      '</div>';
    }).join('');
    liveBoardEl.innerHTML = '<div class="tg-live-head">🏆 Knockout Bracket</div>' + rows;
  }

  /* ---------------- flow ---------------- */
  var phase = 'loading', matchNo = 0, demoTurn = 0, DEMO_WRONG = [2, 5, 9];
  var fpsAvg = 60;
  K.onFrame(function (dt) {
    if (dt > 0.0005 && dt < 0.5) fpsAvg = fpsAvg * 0.92 + (1 / dt) * 0.08;
  });
  window.__tug3d = {
    openHowTo: openHowTo,
    getFps: function () { return Math.round(fpsAvg); },
    getPhase: function () { return phase; },
    startQuickMatch: function () {
      K.ui.clear(); K.ui.topButtons(); addHelpTopButton();
      turnBannerEl = K.ui.add(K.el('div', 'tg-turn-banner'));
      liveBoardEl = K.ui.add(K.el('div', 'tg-live-board'));
      match(0, 1);
    },
    triggerPull: function (mega) {
      if (sides.length === 2) pull(sides[0], sides[1], mega ? 1.5 : 1, true, !!mega);
    }
  };

  function title() {
    phase = 'title';
    window.__k3phase = 'title';
    podiumGroup.visible = false;
    rope.visible = ribbon.visible = true;
    rebuildBracket();
    syncBenchForTeamCount();
    updateWinLines();
    shot('title');
    K.cam.snap();

    K.ui.clear();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Tug of War 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.38rem">🪢 Answer right to PULL! Drag the red ribbon over your team\'s line!</div>' +
      '<div class="tg-bracket" id="tg-title-bracket">' + bracketHTML(-1) + '</div>';

    // Quick Setup Row: Teams (2..4) and Pull Steps to Win (2..4)
    var setup = K.el('div', 'tg-setup');
    var teamGrp = K.el('div', 'tg-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'tg-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        rebuildBracket();
        syncBenchForTeamCount();
        teamGrp.querySelectorAll('.tg-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
        var brEl = document.getElementById('tg-title-bracket');
        if (brEl) brEl.innerHTML = bracketHTML(-1);
        box.querySelectorAll('.setpick, .clsbox').forEach(function (el) { el.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      teamGrp.appendChild(b);
    });

    var stepGrp = K.el('div', 'tg-setup-grp', '<span>🪢 Steps to Win:</span>');
    [2, 3, 4].forEach(function (st) {
      var b = K.el('button', 'tg-pill' + (st === WIN ? ' on' : ''), st + ' steps');
      b.onclick = function () {
        WIN = st;
        updateWinLines();
        stepGrp.querySelectorAll('.tg-pill').forEach(function (el) { el.classList.remove('on'); });
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
    var go = K.el('button', 'btn green', '▶ Start Tournament!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['hello', 'correct', 'wrong', 'pull', 'splash', 'whistle', 'win', 'whoosh']);
      K.cls.assign(TEAMS);
      start();
    };
    rows.appendChild(howBtn);
    rows.appendChild(go);
    box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();
    addHelpTopButton();

    crews.slice(0, nTeams).forEach(function (c, i) {
      K.after(.35 + i * .4, function () {
        if (phase === 'title' && c.mon) {
          c.mon.setState('hello');
          K.after(1.3, function () { if (phase === 'title') c.mon.setState('idle'); });
        }
      });
    });

    var seenHowTo = false;
    try { seenHowTo = localStorage.getItem('eaa_howto_tug3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    turnBannerEl = K.ui.add(K.el('div', 'tg-turn-banner'));
    turnBannerEl.style.display = 'none';
    liveBoardEl = K.ui.add(K.el('div', 'tg-live-board'));
    matchNo = 0;
    showBracket();
  }

  function showBracket() {
    phase = 'bracket';
    window.__k3phase = 'bracket';
    updateTurnUI(null);
    updateLiveBracketUI();
    shot('title');
    var box = K.ui.add(K.el('div', 'endbox tg-bbox'));
    var m = BRACKET[matchNo], L = TEAMS[resolve(m[0])], R = TEAMS[resolve(m[1])];
    box.innerHTML =
      '<div class="say" style="--c:#ff5fa2;font-size:1.38rem">🏆 ' + roundName(matchNo) + ': <b style="color:' + L.c + '">' + L.name + '</b> vs <b style="color:' + R.c + '">' + R.name + '</b></div>' +
      '<div class="tg-bracket">' + bracketHTML(matchNo) + '</div>';
    var rows = K.el('div', 'rows');
    var go = K.el('button', 'btn green', '🪢 Start ' + roundName(matchNo) + '!');
    go.onclick = function () {
      box.remove();
      match(resolve(m[0]), resolve(m[1]));
    };
    rows.appendChild(go);
    box.appendChild(rows);
    K.say(roundName(matchNo) + '. Team ' + L.name + ' against Team ' + R.name + '!');
    if (K.DEMO) K.after(1.3, function () { if (phase === 'bracket') go.onclick(); });
  }

  function match(li, ri) {
    phase = 'match';
    window.__k3phase = 'match';
    pos = 0;
    posShow = 0;
    crews.forEach(function (c, i) {
      if (i < nTeams && i !== li && i !== ri) toBench(i);
      else if (i >= nTeams) c.all.forEach(function (ch) { ch.holder.visible = false; });
    });
    offBench(li);
    offBench(ri);

    // Camera looks north (+Z), so +X is on the left of the screen
    sides = [
      { crew: crews[li], s: 1,  team: TEAMS[li], ti: li },
      { crew: crews[ri], s: -1, team: TEAMS[ri], ti: ri }
    ];
    sides.forEach(function (sd) {
      sd.crew.kids.forEach(function (ch, idx) {
        ch.inMud = false;
        ch.step = 0;
        ch.hopY = 0;
        ch.lean = 1;
        ch.holder.visible = true;
        ch.holder.position.y = 0.08;
        ch.playClip('TugReady', { startPhase: idx * 0.25, fade: 0.18 });
      });
      if (sd.crew.mon) {
        sd.crew.mon.inMud = false;
        sd.crew.mon.holder.visible = true;
        sd.crew.mon.setState('cheer');
      }
      sideLine[sd.s].material.color.set(sd.team.hex);
      sideFlag[sd.s].material.color.set(sd.team.hex);
    });
    placeSide(sides[0], 0, K.now);
    placeSide(sides[1], 0, K.now);
    showMeter(sides[0].team, sides[1].team);
    refreshMeter(MAX_Q);
    updateLiveBracketUI();

    shot('match');
    K.sfx('whistle');
    K.ui.big('🪢 READY… PULL!', 1.15, true);
    K.say('Ready, steady, pull!');
    playing = true;

    var asked = 0, turnSide = matchNo % 2;
    function turn() {
      if (Math.abs(pos) >= WIN - 1e-6) return win(pos > 0 ? sides[0] : sides[1], 'line');
      if (asked >= MAX_Q) return win(pos === 0 ? null : (pos > 0 ? sides[0] : sides[1]), 'time');
      var sd = sides[turnSide], other = sides[1 - turnSide];
      phase = 'question';
      window.__k3phase = 'question';
      activeTurnHolder = (sd.crew.kids[0] || sd.crew.mon).holder;
      activeTurnHex = sd.team.hex;
      updateTurnUI(sd);
      shot('side', sd.s);
      demoTurn++;
      asked++;

      if (sd.crew.mon) sd.crew.mon.setState('hello');
      K.sfx('hello');
      K.after(.75, function () { if (phase === 'question' && sd.crew.mon) sd.crew.mon.setState('idle'); });
      K.ui.toast('Team ' + sd.team.name + ' · answer to PULL!', 1.5, sd.team.c);

      K.after(.8, function () {
        K.ui.ask(QS.next(), sd.team, {
          prompt: 'answer right to pull the rope!',
          demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
          onAnswer: function (ok) {
            shot('match');
            if (ok) {
              sd.team.score += 1;
              K.sfx('correct');
              promptHeaveBoost(sd, function (isMega) {
                pull(sd, other, isMega ? STRONG * 1.5 : STRONG, true, isMega);
                refreshMeter(MAX_Q - asked);
                turnSide = 1 - turnSide;
                K.after(1.9, turn);
              });
            } else {
              K.sfx('wrong');
              K.ui.toast('Oops! Team ' + other.team.name + ' gets a half-step pull!', 1.6, other.team.c);
              pull(other, sd, SMALL, false, false);
              refreshMeter(MAX_Q - asked);
              turnSide = 1 - turnSide;
              K.after(2.0, turn);
            }
          }
        });
      });
    }
    K.after(1.4, turn);
  }

  // Interactive 2-second "TAP TO HEAVE!" power mash burst for Mega Heave (+1.5 steps)!
  function promptHeaveBoost(sd, onDone) {
    phase = 'heave';
    window.__k3phase = 'heave';
    updateTurnUI(sd);
    var bar = K.ui.add(K.el('div', 'tg-heave-bar'));
    bar.style.setProperty('--c', sd.team.c);
    var left = K.el('div', 'tg-heave-left');
    left.innerHTML = '<div class="tg-heave-lbl">🪢 TAP FAST to charge 💥 MEGA HEAVE!</div>' +
      '<div class="tg-heave-track"><div class="tg-heave-fill"></div></div>';
    var fill = left.querySelector('.tg-heave-fill');
    var btn = K.el('button', 'btn green', '🪢 HEAVE!');
    bar.appendChild(left);
    bar.appendChild(btn);

    var taps = 0, TARGET_TAPS = 5, done = false;
    function finishHeave() {
      if (done) return;
      done = true;
      removeEventListener('keydown', onKey);
      K.renderer.domElement.removeEventListener('pointerdown', pump);
      bar.remove();
      onDone(taps >= TARGET_TAPS);
    }
    function pump() {
      if (done) return;
      taps++;
      pullSurge = Math.min(1, pullSurge + .45);
      K.sfx('whoosh');
      K.fx.burst(V(pos, ROPE_Y, 0), 6, { color: [sd.team.hex, 0xffd84a], speed: 3, size: .1, life: .32 });
      fill.style.width = Math.min(100, (taps / TARGET_TAPS) * 100) + '%';
      if (taps >= TARGET_TAPS) finishHeave();
    }
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pump(); }
    }

    btn.onclick = pump;
    addEventListener('keydown', onKey);
    K.renderer.domElement.addEventListener('pointerdown', pump);
    if (K.DEMO) {
      K.after(.22, pump);
      K.after(.44, pump);
      K.after(.66, pump);
      K.after(.9, finishHeave);
    } else {
      K.after(2.0, finishHeave);
    }
  }

  // Rhythmic heave-ho stepping & leaning pull animation with rope tension surge
  function pull(winSide, loseSide, amount, big, isMega) {
    phase = 'pull';
    window.__k3phase = 'pull';
    var before = pos;
    pos = clamp(pos + winSide.s * amount, -WIN, WIN);
    pullSurge = isMega ? 1.35 : (big ? 1.0 : .6);
    K.sfx(big ? 'pull' : 'whoosh');
    if (isMega) K.say('Mega heave! Huge pull!');
    else if (big) K.say('Heave! Pull!');

    // Winning crew executes REAL Blender TugPull skeletal heave with foot-dirt puffs!
    foley.ropeCreak(isMega || big);
    winSide.crew.kids.forEach(function (ch, k) {
      K.after(k * .05, function () {
        ch.playClip('TugPull', { speed: isMega ? 1.55 : (big ? 1.25 : 1.0), fade: 0.14, restart: true });
        foley.footScuff();
        // Dirt & grass puffs right under each kid's planted feet!
        var lf = ch.getBoneWorldPos('LeftFoot');
        var rf = ch.getBoneWorldPos('RightFoot');
        K.fx.puff(lf.clone().add(V(0, .1, 0)), 4, { size: .38, color: 0xe6cda0 });
        K.fx.puff(rf.clone().add(V(0, .1, 0)), 3, { size: .32, color: 0xd9bc8c });
        K.after(1.05, function () {
          if (!ch.inMud && playing) ch.playClip('TugStrain', { fade: 0.25 });
        });
      });
    });
    if (winSide.crew.mon) winSide.crew.mon.setState('cheer');

    // Losing crew gets yanked forward with REAL TugSlip skeletal animation!
    loseSide.crew.kids.forEach(function (ch, k) {
      K.after(k * .05, function () {
        ch.playClip('TugSlip', { speed: big ? 1.3 : 1.0, fade: 0.14, restart: true });
        var lf = ch.getBoneWorldPos('LeftFoot');
        K.fx.puff(lf.clone().add(V(0, .08, 0)), 5, { size: .45, color: 0xe9d3a8 });
        K.after(1.05, function () {
          if (!ch.inMud && playing) ch.playClip('TugReady', { fade: 0.25 });
        });
      });
    });
    if (loseSide.crew.mon) loseSide.crew.mon.setState('sad');

    var p = V(pos, ROPE_Y + .4, 0);
    K.fx.puff(V(before + loseSide.s * SLOTS_X[0], .2, 0), 6, { size: .62, color: 0xe9d3a8 });
    K.fx.burst(V(pos, ROPE_Y, 0), 14, { color: [winSide.team.hex, 0xffd84a], speed: 3.8, size: .12, life: .48 });
    if (isMega) {
      K.fx.confetti(p.clone().add(V(0, 1.4, 0)), 65);
      K.fx.text('+1.5!', p.clone().add(V(0, 1.35, 0)), '#ffd84a', .9);
      K.ui.big('💥 MEGA HEAVE! +1.5', 1.0, true);
      K.cam.shake(.24);
    } else if (big) {
      K.fx.text('+1!', p.clone().add(V(0, 1.25, 0)), winSide.team.c, .85);
      K.cam.shake(.15);
    } else {
      K.fx.text('+½!', p.clone().add(V(0, 1.15, 0)), winSide.team.c, .8);
    }
    cheerBench();
  }

  function win(sd, how) {
    playing = false;
    phase = 'won';
    window.__k3phase = 'won';
    activeTurnHolder = null;
    updateTurnUI(null);

    if (!sd) {
      var a = sides[0].team.score, b = sides[1].team.score;
      sd = a === b ? sides[(Math.random() * 2) | 0] : a > b ? sides[0] : sides[1];
    }
    var lose = sides[0] === sd ? sides[1] : sides[0];
    results[matchNo] = sd.ti;
    sd.team.wins++;
    updateLiveBracketUI();
    K.sfx('whistle');
    if (how === 'time') K.ui.toast('⏱ Time! Team ' + sd.team.name + ' is ahead!', 2, sd.team.c);

    // Losing front kid tumbles into the mud pit with REAL TugLose skeletal animation & slow-mo splash!
    var front = lose.crew.kids[0] || lose.crew.mon;
    var mudDz = null;
    K.after(.35, function () {
      shot('mud');
      front.inMud = true;
      if (front.playClip) front.playClip('TugLose', { once: true, fade: 0.12 });
      else front.setState('tumble');
      K.sfx('splash');
      var h = front.holder, from = h.position.clone(), t0 = K.now;
      var splashed = false;
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .72);
        h.position.set(K.lerp(from.x, 0, u), 0.08 + Math.sin(u * Math.PI) * 0.85, K.lerp(from.z, -.15, u));
        if (u >= .68 && !splashed) {
          splashed = true;
          K.timeScale = 0.28;
          setTimeout(function () { K.timeScale = 1; }, 420);
          spawnMudSplash(V(0, .18, 0));
          K.fx.puff(V(0, .35, 0), 18, { color: 0x8a542e, size: 1.15, life: 1.15, opacity: .92 });
          K.fx.burst(V(0, .45, 0), 22, { color: [0x8a542e, 0x5c361c, 0xc28452], speed: 5.2, size: .18, life: .75 });
          K.fx.text('💦 SPLASH!', V(0, 2.2, 0), '#8a542e', 1.45);
          K.cam.shake(.35);
        }
        if (u >= 1) {
          K.offFrame(fn);
          mudDz = K.dizzyStars(h, 1.35);
        }
      });
      lose.crew.kids.slice(1).forEach(function (k) { k.playClip('TugLose', { once: true, fade: 0.2 }); });
      if (lose.crew.mon) lose.crew.mon.setState('sad');
      sd.crew.kids.forEach(function (ch, idx) { ch.playClip('TugWin', { startPhase: idx * 0.2, fade: 0.16 }); });
      if (sd.crew.mon) sd.crew.mon.setState('cheer');
      K.fx.confetti(V(sd.s * 4.2, 3.2, 0), 160);
      K.ui.big('🏆 Team ' + sd.team.name + ' Wins ' + roundName(matchNo) + '!', 2.0, true);
      K.say('Splash! Team ' + sd.team.name + ' wins!');
    });

    K.after(3.6, function () {
      if (mudDz) mudDz.remove();
      if (meter) { meter.remove(); meter = null; }
      lose.crew.all.forEach(function (ch) { ch.inMud = false; ch.holder.rotation.set(0, Math.PI, 0); });
      lose.team.place = matchNo === BRACKET.length - 1 ? 2 : 1;
      matchNo++;
      if (matchNo >= BRACKET.length) return finish(sd.ti);
      toBench(sides[0].ti);
      toBench(sides[1].ti);
      sides = [];
      showBracket();
    });
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    podiumGroup.visible = true;
    // Camera in 'podium' shot is at z = -11.8 looking towards +Z (z = 1.6), so +X is on the left
    var stepSpecs = [
      { rank: 1, x: 0,    h: 1.25, w: 2.0, col: 0xffd84a },
      { rank: 2, x: 2.2,  h: 0.86, w: 1.75, col: 0xdce4f2 },
      { rank: 3, x: -2.2, h: 0.62, w: 1.75, col: 0xf0a868 },
      { rank: 4, x: -4.2, h: 0.40, w: 1.55, col: 0xe9e2f5 }
    ];
    var pz = 1.6;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti];
      var g = new T3.Group();
      g.position.set(sp.x, 0, pz);
      podiumGroup.add(g);

      var base = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      base.position.y = .08 + sp.h / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = .08 + sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.68);
      numLab.position.set(0, .08 + sp.h + 2.15, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.52);
        tr.position.set(-.62, .08 + sp.h + .06, -.35);
        tr.rotation.y = Math.PI;
        g.add(tr);
      }

      if (crews[ti]) {
        crews[ti].all.forEach(function (ch, j) {
          ch.inMud = false;
          ch.step = 0;
          ch.hopY = 0;
          ch.holder.visible = j === 0;
          if (j === 0) {
            ch.holder.children.forEach(function (c) { if (c.isSprite) c.visible = false; });
            ch.holder.position.set(sp.x + (rk === 0 ? .12 : 0), .12 + sp.h + .06, pz);
            ch.holder.rotation.set(0, Math.PI, 0);
            ch.setState(rk === 0 ? 'cheer' : 'clap');
          }
        });
      }
    });
  }

  function finish(champ) {
    phase = 'end';
    window.__k3phase = 'end';
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();
    turnMarker.set(null);

    TEAMS.forEach(function (t, i) { t.rank = i === champ ? 100 : t.place * 10 + t.score; });
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return TEAMS[b].rank - TEAMS[a].rank;
    });
    benchOrder = [];
    sides = [];
    // Hide unused teams
    for (var i = nTeams; i < crews.length; i++) {
      crews[i].all.forEach(function (ch) { ch.holder.visible = false; });
    }

    buildPodium3D(order);
    rope.visible = ribbon.visible = false;
    shot('podium');
    K.sfx('win');
    K.fx.confetti(V(0, 4.8, 1.2), 240);
    var C = TEAMS[champ];
    K.ui.big('🏆 Team ' + C.name + ' Wins!', 2.3, true);
    K.say('Team ' + C.name + ' is the tug of war champion!');

    K.after(2.3, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var t = TEAMS[ti];
        var badge = k === 0 ? '🏆 Champion' : k === 1 ? '🥈 Finalist' : '🥉 Semi-finalist';
        return '<div class="tg-table-row" style="--c:' + t.c + '">' +
          '<span class="tg-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<span>✓ ' + t.score + ' pulls · ' + t.wins + ' match win' + (t.wins === 1 ? '' : 's') + '</span>' +
          '<i>' + badge + '</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + C.c + ';font-size:1.42rem">🏆 Champion: Team ' + C.name + '!</div>' +
        '<div class="tg-bracket">' + bracketHTML(-1) + '</div>' +
        '<div class="tg-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.href = location.pathname + (nTeams !== 4 ? '?teams=' + nTeams : ''); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'tug3d', title: 'Tug of War 3D', scoreOf: function (t) { return t.rank; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the rope ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'tug', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  var archP = K.tryGLB('models/games-arch.glb').then(function (g) { return g ? K.fitModel(g.scene, 6.2) : null; });
  var flagP = K.tryGLB('models/team-flagpole.glb').then(function (g) { return g ? K.fitModel(g.scene, 4.2) : null; });
  var trophyP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  var animsP = K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function (e) { console.warn('anims', e); return []; });
  var jobs = [worldP, archP, flagP, trophyP, animsP];
  ALL_TEAMS.forEach(function (t, ti) {
    // 1 team mascot coach + 3 rigged kids (boy/girl/boy) on the rope!
    jobs.push(K.makeCharacter(t, { monHeight: 1.35, kidHeight: 1.35 }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: ti % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.42 }).catch(function (err) { console.error('kid1', t.name, err); return null; }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: ti % 2 === 0 ? 'girl' : 'boy', kidHeight: 1.38 }).catch(function (err) { console.error('kid2', t.name, err); return null; }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: 'boy', kidHeight: 1.40 }).catch(function (err) { console.error('kid3', t.name, err); return null; }));
  });

  Promise.all(jobs).then(function (res) {
    archModel = res[1];
    flagpoleModel = res[2];
    trophyModel = res[3];
    var tugClips = res[4] || [];
    placeDecorModels();

    ALL_TEAMS.forEach(function (t, i) {
      var list = res.slice(5 + i * 4, 9 + i * 4).filter(Boolean);
      var mon = list[0], kids = list.slice(1);
      kids.forEach(function (kd) { if (kd && kd.attachClips) kd.attachClips(tugClips); });
      var crew = { mon: mon, kids: kids, all: list };
      list.forEach(function (ch, k) {
        var h = new T3.Group();
        h.add(ch.root);
        scene.add(h);
        ch.holder = h;
        if (k === 1) { // label above front pulling kid!
          var lab = K.label(t.name, t.c);
          lab.scale.multiplyScalar(.62);
          lab.position.y = ch.height + .45;
          h.add(lab);
        }
      });
      crews.push(crew);
    });
    syncBenchForTeamCount();
    loading.remove();
    title();
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
