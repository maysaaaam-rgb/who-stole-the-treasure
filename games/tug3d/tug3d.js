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
  K.init({ fov: 32, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var WIN = clamp(+K.Q.get('steps') || 3, 2, 4);
  var STRONG = 1, SMALL = .5, MAX_Q = +K.Q.get('maxq') || 10;
  var WIN_WORLD_X = 1.28;               // world-space distance from center to each team's win line
  function worldOffOf(p) { return (p / WIN) * WIN_WORLD_X; }

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, wins: 0, place: 0, rank: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- meadow, mud pit, lines & Tripo props (GameQualityCore Festival Meadow) ---------------- */
  var GQC = window.GameQualityCore || null;
  K._gqcTheme = 'island';
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0, 'island');
  K.world.lights();
  if (!GQC) K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x6eb84c);

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
    mudOuter.scale.set(0.98, 1.72, 1);
    mudOuter.position.y = .082;
    mudOuter.receiveShadow = true;
    field.add(mudOuter);

    var mudMat = new T3.MeshStandardMaterial({ color: 0x8a542e, roughness: .18, metalness: .08 });
    var pit = new T3.Mesh(new T3.CircleGeometry(1, 48), mudMat);
    pit.rotation.x = -Math.PI / 2;
    pit.scale.set(0.88, 1.60, 1);
    pit.position.y = .09;
    pit.receiveShadow = true;
    field.add(pit);

    var rim = new T3.Mesh(
      new T3.TorusGeometry(1, .08, 10, 48),
      new T3.MeshStandardMaterial({ color: 0x5c361c, roughness: .55 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.set(0.90, 1.62, 1);
    rim.position.y = .10;
    field.add(rim);

    // Decorative mud-pit rim stones
    var stoneMat = new T3.MeshStandardMaterial({ color: 0x9c8c78, roughness: .65 });
    for (var r = 0; r < 14; r++) {
      var ang = (r / 14) * Math.PI * 2;
      var st = new T3.Mesh(new T3.DodecahedronGeometry(rnd(.095, .145), 0), stoneMat);
      st.position.set(Math.cos(ang) * 0.95, .11, Math.sin(ang) * 1.68);
      st.scale.y = .62;
      st.rotation.y = rnd(0, 6);
      st.castShadow = true;
      field.add(st);
    }

    // Bubbling mud blisters
    for (var b = 0; b < 9; b++) {
      var bub = new T3.Mesh(
        new T3.SphereGeometry(rnd(.05, .09), 12, 10),
        new T3.MeshStandardMaterial({ color: 0xa1663a, roughness: .16 })
      );
      bub.position.set(rnd(-.58, .58), .10, rnd(-1.05, 1.05));
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
  var centreLine = groundLine(0, 0xffffff, .12);
  var sideLine = {
    '-1': groundLine(-WIN_WORLD_X, 0xff5fa2, .24),
    '1':  groundLine(WIN_WORLD_X, 0x4f9dff, .24)
  };
  function updateWinLines() {
    sideLine['-1'].position.x = -WIN_WORLD_X;
    sideLine['1'].position.x = WIN_WORLD_X;
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
      if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(arch, 3.6, 3.6, 0.25, 0.02);
    }
    // Perimeter low wooden festival rails framing the back of Tug Meadow
    [-9.5, -4.5, 4.5, 9.5].forEach(function (fx) {
      var rail = new T3.Mesh(new T3.BoxGeometry(3.6, .14, .12), new T3.MeshStandardMaterial({ color: 0xd99b52, roughness: .72 }));
      rail.position.set(fx, .68, 4.1);
      rail.castShadow = true;
      propGroup.add(rail);
      [-1.6, 1.6].forEach(function (ox) {
        var fp = new T3.Mesh(new T3.CylinderGeometry(.08, .09, .86, 8), new T3.MeshStandardMaterial({ color: 0x8c5828, roughness: .8 }));
        fp.position.set(fx + ox, .43, 4.1);
        fp.castShadow = true;
        propGroup.add(fp);
      });
    });
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
  var mudDropGeo = new T3.SphereGeometry(.058, 10, 8);
  var mudDropMat1 = new T3.MeshStandardMaterial({ color: 0x7a4928, roughness: .22 });
  var mudDropMat2 = new T3.MeshStandardMaterial({ color: 0x5c341a, roughness: .28 });

  function clearMudDroplets() {
    for (var i = mudDroplets.length - 1; i >= 0; i--) {
      scene.remove(mudDroplets[i].mesh);
    }
    mudDroplets.length = 0;
  }

  function spawnMudSplash(center) {
    for (var i = 0; i < 32; i++) {
      var ang = rnd(0, Math.PI * 2), spd = rnd(1.5, 4.2);
      var m = new T3.Mesh(mudDropGeo, i % 2 ? mudDropMat1 : mudDropMat2);
      var sc = rnd(.55, 1.35);
      m.scale.set(sc, sc * 1.15, sc);
      m.position.copy(center).add(V(rnd(-.35, .35), .16, rnd(-.35, .35)));
      scene.add(m);
      mudDroplets.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: rnd(2.8, 5.6),
        vz: Math.sin(ang) * spd,
        life: 0,
        maxLife: rnd(.7, 1.15)
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

  /* ---------------- the rope (4 cm braided hemp, zero donut rings) & red ribbon ---------------- */
  var pos = 0, posShow = 0;            // score steps: <0 towards right side, >0 towards left side
  var ROPE_Y = 0.82, ROPE_R = 0.021, ROPE_HALF = 5.8;
  var SLOTS_X = [1.46, 2.22, 2.98];    // 3 rigged kids per side, packed tightly in real tug formation
  var KID_Z = 0.13;                    // rope runs right beside camera-facing hip so both arms reach comfortably

  var ropeTex = K.canvasTex(256, 256, function (c, W, H) {
    c.fillStyle = '#cf9e5d';
    c.fillRect(0, 0, W, H);
    // Crisp 3-strand diagonal braided hemp fibers (TubeGeometry u = along length, v = around circumference!)
    for (var x = -W; x < W * 2; x += 32) {
      c.strokeStyle = '#623914';
      c.lineWidth = 10;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + W * 0.85, H); c.stroke();
      c.strokeStyle = '#f8e0b2';
      c.lineWidth = 8;
      c.beginPath(); c.moveTo(x + 10, 0); c.lineTo(x + 10 + W * 0.85, H); c.stroke();
      c.strokeStyle = '#a87132';
      c.lineWidth = 6;
      c.beginPath(); c.moveTo(x + 20, 0); c.lineTo(x + 20 + W * 0.85, H); c.stroke();
    }
    // Fine twisted fiber highlights
    c.strokeStyle = 'rgba(72,42,14,0.28)';
    c.lineWidth = 2;
    for (var f = -W; f < W * 2; f += 8) {
      c.beginPath(); c.moveTo(f, 0); c.lineTo(f + W * 0.85, H); c.stroke();
    }
  });
  ropeTex.wrapS = ropeTex.wrapT = T3.RepeatWrapping;
  ropeTex.repeat.set(48, 2);
  var ropeMat = new T3.MeshStandardMaterial({
    map: ropeTex,
    bumpMap: ropeTex,
    bumpScale: 0.018,
    roughness: .82,
    metalness: .02
  });
  var rope = new T3.Mesh(new T3.BufferGeometry(), ropeMat);
  rope.castShadow = true;
  scene.add(rope);

  // Realistic procedural Tug-of-War Foley: rope creak, "heave!" shout, foot scuff & crowd swell
  var foley = (function () {
    var ctx = null, nBuf = null;
    function ensure() {
      if (K.muted || K.CAPTURE) return false;
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
        var t = ctx.currentTime, dur = heavy ? 0.58 : 0.38;
        // Layered creaking hemp fiber stretch
        var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = 'sawtooth'; o2.type = 'triangle';
        o.frequency.setValueAtTime(heavy ? 88 : 122, t);
        o.frequency.exponentialRampToValueAtTime(heavy ? 175 : 210, t + dur * 0.55);
        o.frequency.exponentialRampToValueAtTime(104, t + dur);
        o2.frequency.setValueAtTime(heavy ? 132 : 184, t);
        o2.frequency.exponentialRampToValueAtTime(heavy ? 240 : 280, t + dur * 0.55);
        f.type = 'bandpass'; f.frequency.value = 540; f.Q.value = 4.2;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(heavy ? 0.14 : 0.085, t + 0.07);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(f); o2.connect(f); f.connect(g); g.connect(ctx.destination);
        o.start(t); o2.start(t); o.stop(t + dur + 0.04); o2.stop(t + dur + 0.04);
      },
      heaveShout: function (stepIdx) {
        if (!ensure() || !nBuf) return;
        // Energetic formant-filtered "HEAVE!" / "HO!" group effort shout
        var t = ctx.currentTime, dur = stepIdx >= 2 ? 0.34 : 0.24;
        var pitch0 = stepIdx >= 2 ? 275 : (stepIdx === 1 ? 245 : 225);
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(pitch0, t);
        o.frequency.exponentialRampToValueAtTime(pitch0 * 1.24, t + dur * 0.35);
        o.frequency.exponentialRampToValueAtTime(pitch0 * 0.78, t + dur);
        var f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter();
        f1.type = 'bandpass'; f1.frequency.setValueAtTime(stepIdx >= 2 ? 680 : 540, t); f1.Q.value = 3.2;
        f2.type = 'bandpass'; f2.frequency.setValueAtTime(stepIdx >= 2 ? 1950 : 1650, t); f2.Q.value = 3.6;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(stepIdx >= 2 ? 0.16 : 0.11, t + 0.035);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + dur + 0.03);
        // Breath burst on consonant "H"
        var bs = ctx.createBufferSource(); bs.buffer = nBuf;
        var bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 1400; bf.Q.value = 1.4;
        var bg = ctx.createGain();
        bg.gain.setValueAtTime(0.001, t);
        bg.gain.linearRampToValueAtTime(0.08, t + 0.015);
        bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        bs.connect(bf); bf.connect(bg); bg.connect(ctx.destination);
        bs.start(t); bs.stop(t + 0.1);
      },
      footScuff: function () {
        if (!ensure() || !nBuf) return;
        var t = ctx.currentTime;
        var s = ctx.createBufferSource(); s.buffer = nBuf;
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 680; f.Q.value = 1.2;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        s.connect(f); f.connect(g); g.connect(ctx.destination);
        s.start(t); s.stop(t + 0.18);
      },
      crowdSwell: function (power) {
        if (!ensure() || !nBuf) return;
        var t = ctx.currentTime, dur = power >= 0.9 ? 1.25 : 0.65;
        var s = ctx.createBufferSource(); s.buffer = nBuf;
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(950, t);
        f.frequency.linearRampToValueAtTime(1450, t + dur * 0.45);
        f.Q.value = 0.85;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.14 * power, t + 0.14);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(f); f.connect(g); g.connect(ctx.destination);
        s.start(t); s.stop(t + dur + 0.04);
      }
    };
  })();

  function setMusicDuck(ducked) {
    K.loopVol('music', ducked ? 0.05 : 0.22);
    K.loopVol('crowd', ducked ? 0.06 : 0.16);
  }

  var ribbon = new T3.Group();
  scene.add(ribbon);
  (function () {
    var knot = new T3.Mesh(
      new T3.SphereGeometry(.058, 16, 14),
      new T3.MeshStandardMaterial({ color: 0xff2e2e, roughness: .32 })
    );
    ribbon.add(knot);

    var goldRing = new T3.Mesh(
      new T3.TorusGeometry(.074, .016, 10, 24),
      new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .25, metalness: .3 })
    );
    ribbon.add(goldRing);

    var tailMat = new T3.MeshStandardMaterial({ color: 0xff3b3b, roughness: .38, side: T3.DoubleSide });
    var tail1 = new T3.Mesh(new T3.PlaneGeometry(.13, .54), tailMat);
    tail1.position.set(-.03, -.28, 0);
    tail1.rotation.z = -.12;
    ribbon.add(tail1);

    var tail2 = new T3.Mesh(new T3.PlaneGeometry(.11, .48), tailMat);
    tail2.position.set(.035, -.25, .018);
    tail2.rotation.z = .14;
    ribbon.add(tail2);

    K.onFrame(function (dt, t) {
      tail1.rotation.y = Math.sin(t * 5.5) * .38;
      tail2.rotation.y = Math.cos(t * 6.2) * .34;
      goldRing.rotation.y = t * 2.4;
    });
  })();

  /* ---------------- straight, slightly sagging 4cm rope math (never bends to hands!) ---------------- */
  var tension = 0, pullSurge = 0, strainLevel = 0;
  function ropePointAtX(x, off, tens, t) {
    var rel = x - off;
    var span = SLOTS_X[2] + 0.35; // gripped span between the two anchors
    var u = clamp((rel + span) / (span * 2), 0, 1);
    var sagAmt = K.lerp(0.15, 0.014, clamp(tens, 0, 1));
    var y = ROPE_Y - Math.sin(u * Math.PI) * sagAmt;
    var z = 0;
    // Slight natural droop on loose rope tails past the anchor kids
    var over = Math.abs(rel) - span;
    if (over > 0) {
      y -= Math.min(0.46, over * over * 0.16);
    } else if (playing) {
      // Crisp high-frequency taut rope shake when both teams strain / pull
      var env = Math.sin(u * Math.PI);
      var vibAmp = (0.004 + strainLevel * 0.008 + pullSurge * 0.015) * env;
      y += Math.sin(t * 32 + rel * 1.9) * vibAmp;
      z += Math.cos(t * 27 + rel * 1.4) * vibAmp * 0.7;
    }
    return V(x, y, z);
  }
  function ropeCurve(off, tens, t) {
    var pts = [], N = 28;
    for (var i = 0; i <= N; i++) {
      var u = i / N;
      var x = off - ROPE_HALF + u * ROPE_HALF * 2;
      pts.push(ropePointAtX(x, off, tens, t));
    }
    return new T3.CatmullRomCurve3(pts);
  }

  /* ---------------- full-skeleton Tug Rig Driver + Two-Bone Arm IK + Closed Fists ---------------- */
  var _ikV1 = new T3.Vector3(), _ikV2 = new T3.Vector3(), _ikV3 = new T3.Vector3(), _ikV4 = new T3.Vector3();
  var _ikA = new T3.Vector3(), _ikB = new T3.Vector3(), _ikC = new T3.Vector3();
  var _ikQ1 = new T3.Quaternion(), _ikQ2 = new T3.Quaternion(), _ikQ3 = new T3.Quaternion();
  var _ikM = new T3.Matrix4();
  var FINGER_GROUPS = ['Index', 'Middle', 'Ring', 'Pinky'];
  var AX_L = K.AX.L, AX_U = K.AX.U, AX_F = K.AX.F;

  function ensureTugRigData(ch) {
    if (ch._tugRigReady) return;
    ch._tugRigReady = true;
    ch._allRest = {};
    var src = ch.allBones || ch.bones || {};
    for (var bn in src) {
      if (src[bn]) ch._allRest[bn] = src[bn].quaternion.clone();
    }
    ch.tugPhase = Math.random() * Math.PI * 2;
    ch.tugSpeed = 0.90 + Math.random() * 0.20; // ±10% speed variation per kid
    ch.tugTiltVar = (Math.random() - 0.5) * 0.07;
    ch.tugMode = 'ready';
    ch.tugModeT = 0;
    ch.heaveStepT = 1;
    ch.heaveStepIdx = 0;
    ch._footOffsetY = null;
  }

  function rotBoneWorldAxis(bone, worldAxis, ang) {
    if (!bone || !ang) return;
    _ikQ1.setFromAxisAngle(worldAxis, ang);
    bone.parent.getWorldQuaternion(_ikQ2);
    _ikQ3.copy(_ikQ2).invert();
    bone.quaternion.premultiply(_ikQ3.multiply(_ikQ1).multiply(_ikQ2));
  }

  function rotBoneKidAxis(ch, boneName, localAxis, ang) {
    if (!ang) return;
    var b = ch.bones[boneName] || (ch.allBones && ch.allBones[boneName]);
    if (!b) return;
    ch.body.getWorldQuaternion(_ikQ2);
    _ikV1.copy(localAxis).applyQuaternion(_ikQ2).normalize();
    rotBoneWorldAxis(b, _ikV1, ang);
  }

  // Analytical Two-Bone Arm IK (Arm -> ForeArm -> Hand) locking wrist dead-on to targetWorld
  function solveTwoBoneArmIK(upperBone, lowerBone, handBone, targetWorld, poleWorld) {
    if (!upperBone || !lowerBone || !handBone) return;
    upperBone.parent.updateMatrixWorld(true);
    upperBone.getWorldPosition(_ikA);
    lowerBone.getWorldPosition(_ikB);
    handBone.getWorldPosition(_ikC);

    var L1 = _ikA.distanceTo(_ikB);
    var L2 = _ikB.distanceTo(_ikC);
    if (L1 < 0.01 || L2 < 0.01) return;

    var dir = _ikV1.copy(targetWorld).sub(_ikA);
    var dist = dir.length();
    var minD = Math.abs(L1 - L2) + 0.02;
    var maxD = (L1 + L2) * 0.992;
    var d = clamp(dist, minD, maxD);
    if (dist < 1e-5) return;
    dir.multiplyScalar(1 / dist);

    var cosA = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    var sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));

    // Bend direction from pole vector projected orthogonal to shoulder->target
    var bend = _ikV2.copy(poleWorld).sub(_ikA);
    bend.addScaledVector(dir, -bend.dot(dir));
    if (bend.lengthSq() < 1e-6) bend.set(0, -1, 0);
    bend.normalize();

    var elbowDesired = _ikV3.copy(_ikA)
      .addScaledVector(dir, L1 * cosA)
      .addScaledVector(bend, L1 * sinA);

    // 1) Aim upper arm (Arm -> ForeArm) at elbowDesired
    var curUpper = _ikV4.copy(_ikB).sub(_ikA).normalize();
    var dstUpper = _ikV2.copy(elbowDesired).sub(_ikA).normalize();
    _ikQ1.setFromUnitVectors(curUpper, dstUpper);
    upperBone.parent.getWorldQuaternion(_ikQ2);
    _ikQ3.copy(_ikQ2).invert();
    upperBone.quaternion.premultiply(_ikQ3.multiply(_ikQ1).multiply(_ikQ2));
    upperBone.updateMatrixWorld(true);

    // 2) Aim forearm (ForeArm -> Hand) at targetWorld
    lowerBone.getWorldPosition(_ikB);
    handBone.getWorldPosition(_ikC);
    var curLower = _ikV4.copy(_ikC).sub(_ikB).normalize();
    var dstLower = _ikV2.copy(targetWorld).sub(_ikB).normalize();
    _ikQ1.setFromUnitVectors(curLower, dstLower);
    lowerBone.parent.getWorldQuaternion(_ikQ2);
    _ikQ3.copy(_ikQ2).invert();
    lowerBone.quaternion.premultiply(_ikQ3.multiply(_ikQ1).multiply(_ikQ2));
    lowerBone.updateMatrixWorld(true);
  }

  // Orient Hand cleanly for overhand (palm down) or underhand (palm up) grip & curl all 15 finger bones into a closed fist!
  function gripRopeWithHand(ch, sidePrefix, isRight, ropePt, palmDown, sideDir) {
    var bones = ch.allBones || ch.bones;
    var upper = bones[sidePrefix + 'Arm'];
    var lower = bones[sidePrefix + 'ForeArm'];
    var hand  = bones[sidePrefix + 'Hand'];
    var mid1  = bones[sidePrefix + 'HandMiddle1'];
    if (!upper || !lower || !hand) return;

    // Measure live world palm length (Wrist -> Middle knuckle) so rope passes dead-center inside the closed fist
    hand.updateMatrixWorld(true);
    hand.getWorldPosition(_ikA);
    var palmLen = 0.095;
    if (mid1) {
      mid1.getWorldPosition(_ikB);
      var pl = _ikA.distanceTo(_ikB);
      if (pl > 0.03 && pl < 0.25) palmLen = pl;
    }

    // Desired hand world basis (verified directly from kid-boy.glb & kid-girl.glb):
    //   +Y_local = Wrist -> Knuckles (wraps over/under rope toward -Z)
    //   +X_local = Pinky -> Index (runs along the rope!)
    //   uPalm    = isRight ? +Z_local : -Z_local
    var wantPalm = palmDown
      ? new T3.Vector3(0, -0.95, 0.31).normalize()   // palm faces DOWN onto top of rope
      : new T3.Vector3(0,  0.95, 0.31).normalize();  // palm faces UP under bottom of rope

    // Forearm approaches rope from body (+Z) toward rope (z=0), slight natural angle toward mud pit
    var wantAlong = palmDown
      ? new T3.Vector3(-sideDir * 0.14, -0.20, -0.97).normalize()
      : new T3.Vector3(-sideDir * 0.14,  0.20, -0.97).normalize();

    var zAxis = wantPalm.clone().multiplyScalar(isRight ? 1 : -1);
    var yAxis = wantAlong.clone().addScaledVector(zAxis, -wantAlong.dot(zAxis)).normalize();
    var xAxis = new T3.Vector3().crossVectors(yAxis, zAxis).normalize();
    zAxis.crossVectors(xAxis, yAxis).normalize();

    // Wrist target offset back & away from palm normal so the 4.2cm braided rope passes DEAD-CENTER inside the closed fist!
    var wristTarget = ropePt.clone()
      .addScaledVector(yAxis, -palmLen * 0.60)
      .addScaledVector(wantPalm, -palmLen * 0.36);

    // Natural downward & slightly outward elbow pole
    var isNearArm = (sideDir > 0 && isRight) || (sideDir < 0 && !isRight);
    var poleWorld = new T3.Vector3(
      ropePt.x + sideDir * (isNearArm ? 0.24 : 0.12),
      ropePt.y - 0.50,
      KID_Z + (isNearArm ? -0.24 : 0.38)
    );

    // 1) Solve Two-Bone Arm IK to place wrist right at wristTarget
    solveTwoBoneArmIK(upper, lower, hand, wristTarget, poleWorld);

    // 2) Set Hand world quaternion directly to our exact palm-down / palm-up grip basis
    _ikM.makeBasis(xAxis, yAxis, zAxis);
    var handWorldQ = new T3.Quaternion().setFromRotationMatrix(_ikM);
    hand.parent.getWorldQuaternion(_ikQ2);
    hand.quaternion.copy(_ikQ2).invert().multiply(handWorldQ);
    hand.updateMatrixWorld(true);

    // 3) Curl ALL 12 finger phalanges tightly around the 4cm braided rope!
    // curlAxis_world = uAlong_world x uPalm_world -> positive angle ALWAYS curls into the palm!
    var uAlongW = new T3.Vector3(0, 1, 0).applyQuaternion(handWorldQ).normalize();
    var uPalmW  = new T3.Vector3(0, 0, isRight ? 1 : -1).applyQuaternion(handWorldQ).normalize();
    var curlAxisW = new T3.Vector3().crossVectors(uAlongW, uPalmW).normalize();
    var angles = [1.56, 1.72, 1.32];

    for (var fi = 0; fi < FINGER_GROUPS.length; fi++) {
      var fg = FINGER_GROUPS[fi];
      for (var seg = 1; seg <= 3; seg++) {
        var fb = bones[sidePrefix + 'Hand' + fg + seg];
        if (!fb) continue;
        // Slightly tighter pinky/ring wrap for organic closed fist
        var extra = (fi >= 2 ? 0.08 : 0);
        rotBoneWorldAxis(fb, curlAxisW, angles[seg - 1] + extra);
        fb.updateMatrixWorld(true);
      }
    }

    // 4) Wrap Thumb firmly over the curled index/middle fingers to lock the fist!
    var th1 = bones[sidePrefix + 'HandThumb1'];
    var th2 = bones[sidePrefix + 'HandThumb2'];
    var th3 = bones[sidePrefix + 'HandThumb3'];
    if (th1) {
      var thumbAxis1 = new T3.Vector3().copy(uAlongW).multiplyScalar(isRight ? -0.78 : 0.78)
        .addScaledVector(curlAxisW, 0.62).normalize();
      rotBoneWorldAxis(th1, thumbAxis1, 0.96);
      th1.updateMatrixWorld(true);
    }
    if (th2) {
      rotBoneWorldAxis(th2, curlAxisW, 0.84);
      th2.updateMatrixWorld(true);
    }
    if (th3) {
      rotBoneWorldAxis(th3, curlAxisW, 0.72);
      th3.updateMatrixWorld(true);
    }
  }

  // Organic 2.4–3.2 s procedural Tug-of-War body poses (side-on 25–40° lean-back, bent knees, 3-step heave, forward slip)
  function updateTugKidPose(ch, sd, k, dt, t) {
    ensureTugRigData(ch);
    ch.tugModeT += dt;
    if (ch.heaveStepT < 1) ch.heaveStepT = Math.min(1, ch.heaveStepT + dt / 0.76);

    // If celebrating or tumbling into mud, let standard kit3d / celebration animation drive them
    if (ch.inMud || ch.tugMode === 'lose' || ch.tugMode === 'win') {
      ch.update(dt);
      return;
    }

    // Ensure Mixamo short clip never fights our long procedural tug rig
    if (ch.useMixer) ch.stopClip();

    // Reset all 65 bones cleanly to rest pose before building this frame
    var src = ch.allBones || ch.bones;
    for (var bn in ch._allRest) {
      if (src[bn]) src[bn].quaternion.copy(ch._allRest[bn]);
    }
    ch.body.rotation.set(0, 0, 0);
    ch.body.position.set(0, 0, 0);

    var ph = ch.tugPhase;
    var sp = ch.tugSpeed;
    var mode = ch.tugMode || 'ready';
    // Long 2.6–3.1s multi-harmonic cycles so no two kids move alike
    var slowA = Math.sin(t * 2.15 * sp + ph);
    var slowB = Math.cos(t * 1.45 * sp + ph * 1.7);
    var microVib = Math.sin(t * 24.0 * sp + ph * 2.3);

    // Front leg is the leg closer to the mud pit (Left leg for Left team? Let's put outer/camera-side foot slightly back, inner foot braced forward!)
    var isLeftTeam = sd.s > 0;
    var hipPitch = -0.26;      // negative = lean BACKWARD (28–38° combined with spine!)
    var spinePitch = -0.24;
    var spineTwist = (isLeftTeam ? 0.24 : -0.24); // chest opened ~14° toward rope & camera
    var headPitch = 0.36;      // chin level, eyes locked on the mud pit!
    var headYaw = (isLeftTeam ? -0.18 : 0.18);
    var frontThigh = -0.82;    // front leg braced firmly forward toward mud pit
    var frontKnee = 0.56;
    var frontFoot = 0.26;
    var backThigh = -0.06;     // back leg dug in behind
    var backKnee = 0.82;
    var backFoot = -0.22;
    var bodyShiftZ = -0.14;    // hips sit back behind front foot for authentic weight counterbalance

    if (mode === 'ready') {
      // 2.9s organic ready stance: 26–31° backward lean, weight shifting between heels, alert head
      hipPitch   = -0.25 + slowA * 0.035 + ch.tugTiltVar;
      spinePitch = -0.23 + slowB * 0.030;
      frontThigh = -0.78 + slowA * 0.04;
      frontKnee  =  0.54 - slowA * 0.04;
      backThigh  = -0.05 - slowA * 0.04;
      backKnee   =  0.76 + slowA * 0.05;
      headPitch  =  0.34 - slowA * 0.04;
      bodyShiftZ = -0.13 + slowA * 0.025;
    } else if (mode === 'strain') {
      // 2.6s heavy straining: 32–37° backward lean + muscle quiver
      hipPitch   = -0.32 + slowA * 0.04 + microVib * 0.014 + ch.tugTiltVar;
      spinePitch = -0.28 + slowB * 0.035 + microVib * 0.016;
      frontThigh = -0.90 + slowA * 0.03;
      frontKnee  =  0.60 + microVib * 0.015;
      backThigh  = -0.02 + slowB * 0.04;
      backKnee   =  0.92 + slowA * 0.05;
      headPitch  =  0.42 + microVib * 0.012;
      bodyShiftZ = -0.19 + slowA * 0.02;
    } else if (mode === 'pull') {
      // 3-step rhythmic "Heave... Ho!" cycle: lean back deeper -> step back -> plant foot!
      var u = ch.heaveStepT; // 0 -> 1 over 0.76s per step
      var heaveArc = Math.sin(u * Math.PI);
      var stepLift = (u > 0.25 && u < 0.78) ? Math.sin(((u - 0.25) / 0.53) * Math.PI) : 0;
      var plantBounce = u >= 0.78 ? Math.sin(((u - 0.78) / 0.22) * Math.PI) * 0.06 : 0;
      var extraFinal = ch.heaveStepIdx >= 2 ? 0.07 : 0;
      hipPitch   = -0.34 - heaveArc * (0.14 + extraFinal) + ch.tugTiltVar;
      spinePitch = -0.28 - heaveArc * (0.12 + extraFinal) + microVib * 0.012;
      frontThigh = -0.92 - heaveArc * 0.10;
      frontKnee  =  0.58 + plantBounce;
      backThigh  =  0.04 + stepLift * 0.34;    // back leg reaches back to take a step!
      backKnee   =  0.86 + stepLift * 0.44 + plantBounce;
      backFoot   = -0.18 - stepLift * 0.28;
      headPitch  =  0.48 + heaveArc * 0.12;
      bodyShiftZ = -0.22 - heaveArc * 0.08;
    } else if (mode === 'slip') {
      // Losing team stumbles 1 step forward, pitched forward, arms pulled straight, front kid nearly falls!
      var frontFactor = (k === 0) ? 1.38 : 1.0;
      var stumbleWave = Math.sin(ch.tugModeT * 7.5 + ph);
      hipPitch   =  0.22 * frontFactor + stumbleWave * 0.07;
      spinePitch =  0.20 * frontFactor + Math.cos(ch.tugModeT * 6.5 + ph) * 0.06;
      frontThigh = -0.58 - Math.max(0, stumbleWave) * 0.22;
      frontKnee  =  0.66 + Math.max(0, stumbleWave) * 0.18;
      backThigh  =  0.42 * frontFactor + Math.abs(stumbleWave) * 0.18;
      backKnee   =  0.45 + (k === 0 ? 0.28 : 0.10);
      backFoot   = -0.45 * frontFactor; // heel lifting as front kid nearly loses balance!
      headPitch  = -0.26 * frontFactor;
      bodyShiftZ =  0.14 * frontFactor;
    }

    // Apply pelvic & spinal posture
    ch.body.position.z = bodyShiftZ;
    rotBoneKidAxis(ch, 'Hips', AX_L, hipPitch);
    rotBoneKidAxis(ch, 'Spine', AX_L, spinePitch * 0.45);
    rotBoneKidAxis(ch, 'Spine1', AX_L, spinePitch * 0.35);
    rotBoneKidAxis(ch, 'Spine1', AX_U, spineTwist);
    rotBoneKidAxis(ch, 'Spine2', AX_L, spinePitch * 0.20);
    rotBoneKidAxis(ch, 'Neck', AX_L, headPitch * 0.45);
    rotBoneKidAxis(ch, 'Head', AX_L, headPitch * 0.55);
    rotBoneKidAxis(ch, 'Head', AX_U, headYaw);

    // Apply wide staggered legs (inner leg forward toward pit, outer leg braced behind)
    var fLeg = isLeftTeam ? 'Left' : 'Right';
    var bLeg = isLeftTeam ? 'Right' : 'Left';
    // Slight hip splay (feet wide for stability!)
    rotBoneKidAxis(ch, fLeg + 'UpLeg', AX_F, isLeftTeam ? -0.10 : 0.10);
    rotBoneKidAxis(ch, bLeg + 'UpLeg', AX_F, isLeftTeam ?  0.14 : -0.14);

    rotBoneKidAxis(ch, fLeg + 'UpLeg', AX_L, frontThigh - hipPitch * 0.85);
    rotBoneKidAxis(ch, fLeg + 'Leg',   AX_L, frontKnee);
    rotBoneKidAxis(ch, fLeg + 'Foot',  AX_L, frontFoot);

    rotBoneKidAxis(ch, bLeg + 'UpLeg', AX_L, backThigh - hipPitch * 0.85);
    rotBoneKidAxis(ch, bLeg + 'Leg',   AX_L, backKnee);
    rotBoneKidAxis(ch, bLeg + 'Foot',  AX_L, backFoot);

    // Measure rest ankle height once, then auto-ground lowest foot so shoes ALWAYS plant firmly on the sand (zero floating!)
    ch.root.updateMatrixWorld(true);
    var lf = ch.bones.LeftFoot, rf = ch.bones.RightFoot;
    if (lf && rf) {
      lf.getWorldPosition(_ikA);
      rf.getWorldPosition(_ikB);
      var minFootY = Math.min(_ikA.y, _ikB.y);
      var targetAnkleY = 0.08 + ch.height * 0.068; // sole sits cleanly on strip (y=0.075)
      ch.body.position.y += (targetAnkleY - minFootY);
      ch.root.updateMatrixWorld(true);
    }

    if (ch._syncHead) ch._syncHead(K.now, mode);
    if (ch._itemSyncs && ch._itemSyncs.length) {
      ch.root.updateMatrixWorld(true);
      for (var si = 0; si < ch._itemSyncs.length; si++) ch._itemSyncs[si](K.now);
    }
  }

  function applySideRopeGripIK(sd, off, tens, t) {
    sd.crew.kids.forEach(function (ch, k) {
      if (ch.inMud || ch.tugMode === 'lose' || ch.tugMode === 'win') return;
      var bones = ch.allBones || ch.bones;
      var la = bones.LeftArm, ra = bones.RightArm;
      var shoulderMidX = ch.holder.position.x + sd.s * 0.25;
      if (la && ra) {
        la.getWorldPosition(_ikA);
        ra.getWorldPosition(_ikB);
        shoulderMidX = (_ikA.x + _ikB.x) * 0.5;
      }
      // Slip stretches arms slightly further forward toward the mud pit!
      var reachExtra = (ch.tugMode === 'slip') ? (k === 0 ? 0.12 : 0.08) : 0;
      var frontX = shoulderMidX - sd.s * (0.31 + reachExtra); // Front hand closer to mud pit (palm DOWN)
      var backX  = shoulderMidX - sd.s * (0.06 + reachExtra * 0.6); // Back hand ~25 cm behind front hand (palm UP)
      ch._gripMidX = (frontX + backX) * 0.5;

      var pFront = ropePointAtX(frontX, off, tens, t);
      var pBack  = ropePointAtX(backX,  off, tens, t);

      if (sd.s > 0) {
        // Left team (facing -X, right hip next to rope): LeftHand = front (palm down), RightHand = back (palm up)
        gripRopeWithHand(ch, 'Left',  false, pFront, true,  sd.s);
        gripRopeWithHand(ch, 'Right', true,  pBack,  false, sd.s);
      } else {
        // Right team (facing +X, left hip next to rope): RightHand = front (palm down), LeftHand = back (palm up)
        gripRopeWithHand(ch, 'Right', true,  pFront, true,  sd.s);
        gripRopeWithHand(ch, 'Left',  false, pBack,  false, sd.s);
      }
    });
  }

  K.onFrame(function (dt, t) {
    posShow = K.lerp(posShow, pos, 1 - Math.exp(-dt * 5.8));
    var targetTension = playing ? (phase === 'pull' || phase === 'heave' ? 1.0 : 0.82) : 0.05;
    tension = K.lerp(tension, targetTension, dt * 4.0);
    pullSurge = Math.max(0, pullSurge - dt * 0.85);
    var targetStrain = (playing && (phase === 'pull' || phase === 'heave' || sides.some(function (sd) {
      return sd.crew.kids.some(function (ch) { return ch.tugMode === 'strain' || ch.tugMode === 'pull'; });
    }))) ? 1 : 0.25;
    strainLevel = K.lerp(strainLevel, targetStrain, dt * 4.0);

    var wob = playing ? Math.sin(t * 7.5) * (.012 + pullSurge * .04) : 0;
    var off = worldOffOf(posShow) + wob;

    // 1) Update straight braided rope FIRST so hands lock onto its exact centerline
    var curve = ropeCurve(off, tension, t);
    rope.geometry.dispose();
    rope.geometry = new T3.TubeGeometry(curve, 64, ROPE_R, 10, false);
    var midPt = ropePointAtX(off, off, tension, t);
    ribbon.position.copy(midPt);

    // 2) Place active pulling kids & update their long organic procedural poses
    sides.forEach(function (sd) {
      placeSide(sd, off, t);
      sd.crew.kids.forEach(function (ch, k) {
        updateTugKidPose(ch, sd, k, dt, t);
      });
      if (sd.crew.mon) sd.crew.mon.update(dt);
    });

    // 3) Update bench / non-active crews cleanly
    crews.forEach(function (c) {
      var isActive = sides.some(function (sd) { return sd.crew === c; });
      if (!isActive) c.all.forEach(function (ch) { ch.update(dt); });
    });

    // 4) Post-update Two-Bone Arm IK + Palm Orientation + 30-Bone Closed Fists onto the straight rope!
    if (playing && sides.length === 2) {
      sides.forEach(function (sd) { applySideRopeGripIK(sd, off, tension, t); });
    }

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

  /* ---------------- characters: each team = 3 rigged kids on the rope + 1 small mascot on sideline ---------------- */
  var crews = [];          // one per team: { mon (sideline coach), kids:[k0,k1,k2], all:[..] }
  var sides = [];          // the two crews pulling now: { crew, s, team, ti }
  var playing = false;

  function placeSide(sd, off, t) {
    // 3 rigged kids stand side-on along the rope (z = +KID_Z), facing the mud pit (angled 10° open toward camera)
    sd.crew.kids.forEach(function (ch, k) {
      if (ch.inMud) return;
      var h = ch.holder;
      h.position.x = off + sd.s * SLOTS_X[k] + (ch.step || 0) * sd.s;
      h.position.y = (ch.hopY || 0);
      h.position.z = KID_Z + (k === 1 ? 0.02 : 0);
      // Left team (s=+1) faces -X (mud pit), slightly open toward camera (-Z); Right team (s=-1) faces +X, slightly open toward camera (-Z)
      h.rotation.set(0, sd.s > 0 ? (-Math.PI / 2 - 0.16) : (Math.PI / 2 + 0.16), 0);
    });
    // Smaller team mascot cheers from the sidelines, well off the rope!
    if (sd.crew.mon && !sd.crew.mon.inMud) {
      var mh = sd.crew.mon.holder;
      mh.position.set(off + sd.s * 4.35, 0.08, 2.75);
      mh.rotation.set(0, sd.s > 0 ? Math.PI + 0.25 : Math.PI - 0.25, 0);
    }
  }

  // Teams that are not pulling wait behind the rail facing the rope and cheer (NEVER T-pose!)
  var benchOrder = [];
  function benchSpot(ti, k) {
    var order = benchOrder.indexOf(ti);
    return V(-((order - (benchOrder.length - 1) / 2) * 4.6 + (k - 1) * 0.95), 0.06, 4.95 + (k === 0 ? 0.35 : 0));
  }
  function setBenchCheer(ch, k) {
    if (ch.useMixer && ch.stopClip) ch.stopClip();
    var states = ['clap', 'cheer', 'wave'];
    ch.setState(states[(k + Math.floor(Math.random() * 3)) % states.length]);
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
        // Face -Z (directly toward the rope and action!)
        ch.holder.rotation.set(0, Math.PI, 0);
        ch.holder.visible = bi < nTeams;
        // Hide floating team-name pills while on the bench so background stays clean
        ch.holder.children.forEach(function (c) { if (c.isSprite) c.visible = false; });
        if (ch.kind === 'kid') {
          if (ch.useMixer && ch.stopClip) ch.stopClip();
          ch.setState(k % 2 === 0 ? 'clap' : 'wave');
        } else {
          ch.setState('cheer');
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
      crews[bi].all.forEach(function (ch, k) {
        if (ch.kind === 'kid') {
          if (ch.useMixer && ch.stopClip) ch.stopClip();
          ch.setState(k % 2 === 0 ? 'cheer' : 'clap');
          K.after(1.6, function () { if (benchOrder.indexOf(bi) >= 0) ch.setState(k % 2 === 0 ? 'clap' : 'wave'); });
        } else {
          ch.setState('cheer');
        }
      });
    });
  }

  /* ---------------- camera (child-eye-height 1.22m side broadcast: kids fill 42–50% height!) ---------------- */
  function snapCamNow() {
    if (K.cam.follow) K.cam.follow(0);
    K.cam.snap();
  }
  function shot(name, extra) {
    K.cam.follow = null;
    if (name === 'title') {
      K.cam.follow = function () {
        var a = K.now * .12;
        K.cam.tPos.set(Math.sin(a) * 2.8, 2.25, -8.4 - Math.cos(a) * 0.6);
        K.cam.tLook.set(0, 0.95, 0.4);
      };
      K.cam.k = 1.8;
    }
    if (name === 'match') {
      K.cam.follow = function () {
        var wOff = worldOffOf(posShow);
        var zoomIn = pullSurge * 0.35;
        K.cam.tPos.set(wOff * .48, 1.22, -6.90 + zoomIn);
        K.cam.tLook.set(wOff * .48, 0.88, 0.08);
      };
      K.cam.k = 3.2;
    }
    if (name === 'question' || name === 'side') {
      // Shift lookY slightly lower so rope + kids sit cleanly in upper 66% above bottom-30% translucent .qcard
      K.cam.follow = function () {
        var wOff = worldOffOf(posShow);
        K.cam.tPos.set(wOff * .42, 1.24, -6.75);
        K.cam.tLook.set(wOff * .42, 0.58, 0.08);
      };
      K.cam.k = 3.0;
    }
    if (name === 'pull') {
      // 2.4s close-up of the pulling team during the 3-step "heave... ho!" pull!
      var pullDir = extra || 1;
      K.cam.follow = function () {
        var wOff = worldOffOf(posShow);
        var cx = wOff + pullDir * 2.08;
        K.cam.tPos.set(cx - pullDir * 0.20, 1.18, -4.15);
        K.cam.tLook.set(cx, 0.86, 0.10);
      };
      K.cam.k = 3.6;
    }
    if (name === 'mud') {
      K.cam.set(V(worldOffOf(posShow) * .12, 1.52, -4.65), V(0, 0.56, 0), 3.8);
    }
    if (name === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .55;
        K.cam.tPos.set(a * 1.8, 2.4, -8.4);
        K.cam.tLook.set(0, 1.05, 1.6);
      };
      K.cam.k = 2.2;
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
    startQuickMatch: function (opts) {
      opts = opts || {};
      K.ui.clear(); K.ui.topButtons(); addHelpTopButton();
      turnBannerEl = K.ui.add(K.el('div', 'tg-turn-banner'));
      liveBoardEl = K.ui.add(K.el('div', 'tg-live-board'));
      match(0, 1, opts);
    },
    triggerPull: function (mega) {
      if (sides.length === 2) pull(sides[0], sides[1], mega ? 1.5 : 1, true, !!mega);
    },
    // Deterministic QA state inspector for acceptance screenshots & 10s pull recording
    setDemoState: function (st) {
      if (sides.length !== 2) {
        this.startQuickMatch({ noAutoTurn: true });
      }
      clearMudDroplets();
      // Clear floating question / toast overlays for crisp inspection unless st === 'question'
      document.querySelectorAll('.qwrap, .tg-heave-bar, .big, .toast').forEach(function (el) { el.remove(); });
      document.querySelectorAll('.tg-turn-banner, .tg-live-board').forEach(function (el) { el.style.display = ''; });
      var L = sides[0], R = sides[1];
      playing = true;
      rope.visible = ribbon.visible = true;
      K.cam.manual = false;
      K.cam.follow = null;
      L.crew.kids.forEach(function (ch) { ch.inMud = false; ch.step = 0; ch.hopY = 0; ch.holder.rotation.set(0, 0, 0); });
      R.crew.kids.forEach(function (ch) { ch.inMud = false; ch.step = 0; ch.hopY = 0; ch.holder.rotation.set(0, 0, 0); });

      if (st === 'ready') {
        pos = 0; posShow = 0; tension = 0.85; pullSurge = 0; strainLevel = 0.25; phase = 'match';
        L.crew.kids.forEach(function (ch) { ch.tugMode = 'ready'; ch.tugModeT = 0.6; });
        R.crew.kids.forEach(function (ch) { ch.tugMode = 'ready'; ch.tugModeT = 0.6; });
        shot('match'); snapCamNow();
      } else if (st === 'strain') {
        pos = 0.20; posShow = 0.20; tension = 1.0; pullSurge = 0.45; strainLevel = 1.0; phase = 'match';
        L.crew.kids.forEach(function (ch) { ch.tugMode = 'strain'; ch.tugModeT = 0.9; });
        R.crew.kids.forEach(function (ch) { ch.tugMode = 'strain'; ch.tugModeT = 0.9; });
        shot('match'); snapCamNow();
      } else if (st === 'pull') {
        pos = 0.95; posShow = 0.95; tension = 1.0; pullSurge = 1.0; strainLevel = 1.0; phase = 'pull';
        L.crew.kids.forEach(function (ch) { ch.tugMode = 'pull'; ch.heaveStepT = 0.42; ch.heaveStepIdx = 2; ch.step = 0.14; });
        R.crew.kids.forEach(function (ch) { ch.tugMode = 'slip'; ch.tugModeT = 0.45; ch.step = -0.08; });
        shot('pull', L.s); snapCamNow();
      } else if (st === 'slip') {
        pos = 1.35; posShow = 1.35; tension = 1.0; pullSurge = 0.9; strainLevel = 1.0; phase = 'pull';
        L.crew.kids.forEach(function (ch) { ch.tugMode = 'pull'; ch.heaveStepT = 0.55; ch.heaveStepIdx = 2; ch.step = 0.16; });
        R.crew.kids.forEach(function (ch) { ch.tugMode = 'slip'; ch.tugModeT = 0.50; ch.step = -0.10; });
        K.cam.set(V(-0.32, 1.22, -6.15), V(-0.32, 0.86, 0.08), 8);
        snapCamNow();
      } else if (st === 'question') {
        pos = 0.35; posShow = 0.35; tension = 0.85; pullSurge = 0; phase = 'question';
        L.crew.kids.forEach(function (ch) { ch.tugMode = 'ready'; });
        R.crew.kids.forEach(function (ch) { ch.tugMode = 'ready'; });
        shot('question'); snapCamNow();
        K.ui.ask(QS.next(), L.team, { prompt: 'answer right to pull the rope!' });
      } else if (st === 'win-mud') {
        pos = WIN; posShow = WIN; playing = false; tension = 0.02; phase = 'won';
        var wOff = worldOffOf(WIN);
        placeSide(L, wOff, K.now);
        placeSide(R, wOff, K.now);
        var front = R.crew.kids[0];
        front.inMud = true;
        front.tugMode = 'lose';
        if (front.useMixer && front.stopClip) front.stopClip();
        front.setState('fly');
        front.holder.position.set(-0.08, 0.14, -0.04);
        front.holder.rotation.set(0.18, Math.PI * 0.56, 0.12);
        R.crew.kids.slice(1).forEach(function (ch, idx) {
          ch.tugMode = 'lose';
          if (ch.useMixer && ch.stopClip) ch.stopClip();
          ch.setState('headhands');
          ch.holder.position.set(-1.35 - idx * 0.78, 0.06, 0.28);
          ch.holder.rotation.set(0, Math.PI * 0.65, 0);
        });
        L.crew.kids.forEach(function (ch, idx) {
          ch.tugMode = 'win';
          if (ch.useMixer && ch.stopClip) ch.stopClip();
          ch.setState('cheer');
          ch.holder.position.set(1.55 + idx * 0.72, 0.06, 0.25);
          ch.holder.rotation.set(0, -Math.PI * 0.72, 0);
        });
        spawnMudSplash(V(0, 0.18, 0));
        K.fx.puff(V(0, 0.26, 0), 14, { color: 0x8a542e, size: 0.72, life: 1.8, opacity: .88 });
        K.fx.confetti(V(L.s * 1.9, 2.4, 0), 90);
        K.cam.set(V(0.05, 1.48, -5.85), V(0.05, 0.68, 0.05), 8);
        snapCamNow();
      }
      refreshMeter(7);
    },
    focusHandsCloseup: function () {
      if (sides.length !== 2) this.startQuickMatch({ noAutoTurn: true });
      clearMudDroplets();
      document.querySelectorAll('.qwrap, .tg-heave-bar, .big, .toast, .tg-turn-banner, .tg-live-board').forEach(function (el) { el.style.display = 'none'; });
      pos = 0; posShow = 0; playing = true; tension = 1.0; pullSurge = 0.15; strainLevel = 0.8; phase = 'match';
      sides[0].crew.kids.forEach(function (ch) { ch.inMud = false; ch.step = 0; ch.tugMode = 'strain'; });
      sides[1].crew.kids.forEach(function (ch) { ch.inMud = false; ch.step = 0; ch.tugMode = 'strain'; });
      // Force one update pass so _gripMidX is exact
      placeSide(sides[0], 0, K.now);
      updateTugKidPose(sides[0].crew.kids[0], sides[0], 0, 1 / 60, K.now);
      applySideRopeGripIK(sides[0], 0, 1.0, K.now);
      var handMidX = sides[0].crew.kids[0]._gripMidX || (SLOTS_X[0] + 0.02);
      K.cam.follow = null;
      K.cam.set(V(handMidX - 0.04, ROPE_Y + 0.05, -0.82), V(handMidX, ROPE_Y, 0.01), 12);
      snapCamNow();
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
    if (K.DEMO || (K.isAI && K.isAI(L) && K.isAI(R))) K.after(1.1, function () { if (phase === 'bracket') go.onclick(); });
  }

  function match(li, ri, opts) {
    opts = opts || {};
    phase = 'match';
    window.__k3phase = 'match';
    pos = 0;
    posShow = 0;
    setMusicDuck(false);
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
        ensureTugRigData(ch);
        ch.inMud = false;
        ch.step = 0;
        ch.hopY = 0;
        ch.tugMode = 'ready';
        ch.tugModeT = 0;
        ch.heaveStepT = 1;
        ch.holder.visible = true;
        ch.holder.children.forEach(function (c) { if (c.isSprite) c.visible = true; });
        if (ch.useMixer && ch.stopClip) ch.stopClip();
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
      // Both teams brace & strain gently while the question is up, music ducked under the question voice!
      sides.forEach(function (sObj) {
        sObj.crew.kids.forEach(function (ch) { if (!ch.inMud) { ch.tugMode = 'ready'; ch.tugModeT = 0; } });
      });
      shot('question');
      setMusicDuck(true);
      demoTurn++;
      asked++;

      if (sd.crew.mon) sd.crew.mon.setState('hello');
      K.sfx('hello');
      K.after(.75, function () { if (phase === 'question' && sd.crew.mon) sd.crew.mon.setState('idle'); });
      K.ui.toast('Team ' + sd.team.name + ' · answer to PULL!', 1.4, sd.team.c);

      K.after(.75, function () {
        K.ui.ask(QS.next(), sd.team, {
          prompt: 'answer right to pull the rope!',
          demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
          onAnswer: function (ok) {
            setMusicDuck(false);
            if (ok) {
              sd.team.score += 1;
              K.sfx('correct');
              sides.forEach(function (sObj) {
                sObj.crew.kids.forEach(function (ch) { if (!ch.inMud) { ch.tugMode = 'strain'; ch.tugModeT = 0; } });
              });
              promptHeaveBoost(sd, function (isMega) {
                pull(sd, other, isMega ? STRONG * 1.5 : STRONG, true, isMega);
                refreshMeter(MAX_Q - asked);
                turnSide = 1 - turnSide;
                K.after(2.95, turn);
              });
            } else {
              K.sfx('wrong');
              K.ui.toast('Oops! Team ' + other.team.name + ' gets a half-step pull!', 1.6, other.team.c);
              pull(other, sd, SMALL, false, false);
              refreshMeter(MAX_Q - asked);
              turnSide = 1 - turnSide;
              K.after(2.45, turn);
            }
          }
        });
      });
    }
    if (!opts.noAutoTurn) K.after(1.4, turn);
  }

  // Interactive 2-second "TAP TO HEAVE!" power mash burst for Mega Heave (+1.5 steps)!
  function promptHeaveBoost(sd, onDone) {
    phase = 'heave';
    window.__k3phase = 'heave';
    updateTurnUI(sd);
    shot('match');
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
      K.fx.burst(V(worldOffOf(posShow), ROPE_Y, 0), 6, { color: [sd.team.hex, 0xffd84a], speed: 3, size: .09, life: .32 });
      fill.style.width = Math.min(100, (taps / TARGET_TAPS) * 100) + '%';
      if (taps >= TARGET_TAPS) finishHeave();
    }
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pump(); }
    }

    btn.onclick = pump;
    addEventListener('keydown', onKey);
    K.renderer.domElement.addEventListener('pointerdown', pump);
    if (K.DEMO || (K.isAI && K.isAI(sd.team))) {
      K.after(.22, pump);
      K.after(.44, pump);
      K.after(.66, pump);
      if (Math.random() < .55) { K.after(.82, pump); K.after(.98, pump); }
      K.after(1.08, finishHeave);
    } else {
      K.after(2.0, finishHeave);
    }
  }

  // Rhythmic 3-step "Heave... Ho!" pull with 2.4s close-up camera, rope creaks, shouts & stumbling losers
  function pull(winSide, loseSide, amount, big, isMega) {
    phase = 'pull';
    window.__k3phase = 'pull';
    var startPos = pos;
    var targetPos = clamp(pos + winSide.s * amount, -WIN, WIN);
    var totalDelta = targetPos - startPos;
    var steps = big ? 3 : 2;
    var stepInterval = 0.78; // 3 steps = 2.34 s dramatic rhythm ("heave... ho!... HEAVE!")

    // Cut smoothly to a 2.4s close-up of the pulling team on right answers, then back to wide view!
    if (big) shot('pull', winSide.s);
    else shot('match');

    if (isMega) K.say('Heave! Ho! Mega pull!');
    else if (big) K.say('Heave! Ho! Pull!');

    if (winSide.crew.mon) winSide.crew.mon.setState('cheer');
    if (loseSide.crew.mon) loseSide.crew.mon.setState('sad');

    for (var sIdx = 0; sIdx < steps; sIdx++) {
      (function (idx) {
        K.after(idx * stepInterval, function () {
          if (!playing && phase !== 'pull') return;
          var isFinal = (idx === steps - 1);
          var frac = isFinal ? 1 : (idx + 1) / steps;
          pos = startPos + totalDelta * frac;
          pullSurge = isFinal ? (isMega ? 1.35 : 1.1) : 0.82;

          // Sound: rope creak + short "heave!" shout on EVERY pull step; crowd louder on final step!
          foley.ropeCreak(isFinal || isMega);
          foley.heaveShout(idx);
          foley.footScuff();
          K.sfx(isFinal && big ? 'pull' : 'whoosh');
          if (isFinal) {
            foley.crowdSwell(1.0);
            K.loopVol('crowd', 0.34);
            K.after(1.3, function () { K.loopVol('crowd', 0.16); });
          } else {
            foley.crowdSwell(0.45);
          }

          // Winning team: lean back deeper -> step back -> plant foot with dirt puffs!
          winSide.crew.kids.forEach(function (ch, k) {
            K.after(k * 0.045, function () {
              if (ch.inMud) return;
              ch.tugMode = 'pull';
              ch.heaveStepT = 0;
              ch.heaveStepIdx = idx;
              ch.step = (idx + 1) * 0.06;
              var lf = ch.getBoneWorldPos('LeftFoot');
              var rf = ch.getBoneWorldPos('RightFoot');
              K.fx.puff(lf.clone().add(V(0, .06, 0)), 4, { size: .30, color: 0xe6cda0 });
              K.fx.puff(rf.clone().add(V(0, .06, 0)), 3, { size: .26, color: 0xd9bc8c });
            });
          });

          // Losing team: stumbles 1 step forward, arms pulled straight, front kid nearly falls!
          loseSide.crew.kids.forEach(function (ch, k) {
            K.after(k * 0.045, function () {
              if (ch.inMud) return;
              ch.tugMode = 'slip';
              ch.tugModeT = 0;
              ch.step = -(idx + 1) * 0.05;
              var lf = ch.getBoneWorldPos('LeftFoot');
              K.fx.puff(lf.clone().add(V(0, .06, 0)), 4, { size: .36, color: 0xe9d3a8 });
            });
          });

          var wPos = worldOffOf(pos);
          var p = V(wPos, ROPE_Y + .35, 0);
          if (GQC && GQC.Juice) {
            GQC.Juice.squashStretch(ribbon, 1.32, 0.80, 1.32, 0.24);
            GQC.Juice.shakeCamera(isFinal ? (isMega ? 0.22 : 0.14) : 0.08, 0.22);
            if (isFinal) GQC.Juice.spawnBurst(scene, V(wPos, ROPE_Y, 0), isMega ? 'stars' : 'dust', 14);
          }
          K.fx.burst(V(wPos, ROPE_Y, 0), isFinal ? 14 : 7, { color: [winSide.team.hex, 0xffd84a], speed: 3.4, size: .10, life: .44 });
          if (isFinal) {
            if (GQC && GQC.Juice) {
              GQC.Juice.popupScore(isMega ? '💥 MEGA HEAVE!' : (big ? '🪢 HEAVE HO!' : '+½ PULL'), p.clone().add(V(0, .35, 0)), K.camera, winSide.team.c, isMega ? 1.25 : 1.05);
            }
            if (isMega) {
              K.fx.confetti(p.clone().add(V(0, 1.3, 0)), 65);
              K.fx.text('+1.5!', p.clone().add(V(0, 1.2, 0)), '#ffd84a', .85);
              K.ui.big('💥 MEGA HEAVE! +1.5', 1.0, true);
              K.cam.shake(.22);
            } else if (big) {
              K.fx.text('+1!', p.clone().add(V(0, 1.15, 0)), winSide.team.c, .8);
              K.cam.shake(.14);
            } else {
              K.fx.text('+½!', p.clone().add(V(0, 1.05, 0)), winSide.team.c, .75);
            }
            cheerBench();
          }
        });
      })(sIdx);
    }

    // After the 3-step pull completes (~2.45s), settle into straining stance and return to wide broadcast view!
    K.after(steps * stepInterval + 0.15, function () {
      if (!playing) return;
      winSide.crew.kids.forEach(function (ch) { if (!ch.inMud) { ch.step = 0; ch.tugMode = 'strain'; ch.tugModeT = 0; } });
      loseSide.crew.kids.forEach(function (ch) { if (!ch.inMud) { ch.step = 0; ch.tugMode = 'ready'; ch.tugModeT = 0; } });
      shot('match');
    });
  }

  function win(sd, how) {
    playing = false;
    phase = 'won';
    window.__k3phase = 'won';
    activeTurnHolder = null;
    updateTurnUI(null);
    setMusicDuck(false);

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

    // Losing front kid releases the rope and slides/tumbles into the mud pit with a big splash!
    var front = lose.crew.kids[0] || lose.crew.mon;
    var mudDz = null;
    K.after(.3, function () {
      shot('mud');
      front.inMud = true;
      front.tugMode = 'lose';
      if (front.useMixer && front.stopClip) front.stopClip();
      front.setState('tumble');
      K.sfx('splash');
      foley.crowdSwell(1.0);
      var h = front.holder, from = h.position.clone(), t0 = K.now;
      var splashed = false;
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .72);
        h.position.set(K.lerp(from.x, 0, u), 0.10 + Math.sin(u * Math.PI) * 0.78, K.lerp(from.z, -.05, u));
        h.rotation.x = u * 0.65;
        h.rotation.z = -lose.s * u * 0.45;
        if (u >= .66 && !splashed) {
          splashed = true;
          if (GQC && GQC.Juice) {
            GQC.Juice.hitstop(42);
            GQC.Juice.shakeCamera(0.28, 0.35);
            GQC.Juice.spawnBurst(scene, V(0, .3, 0), 'splash', 18);
          }
          K.timeScale = 0.32;
          setTimeout(function () { K.timeScale = 1; }, 420);
          spawnMudSplash(V(0, .18, 0));
          K.fx.puff(V(0, .35, 0), 18, { color: 0x8a542e, size: 1.12, life: 1.15, opacity: .92 });
          K.fx.burst(V(0, .45, 0), 22, { color: [0x8a542e, 0x5c361c, 0xc28452], speed: 5.2, size: .16, life: .75 });
          K.fx.text('💦 SPLASH!', V(0, 1.9, 0), '#8a542e', 1.35);
          K.cam.shake(.32);
        }
        if (u >= 1) {
          K.offFrame(fn);
          mudDz = K.dizzyStars(h, 1.25);
        }
      });
      lose.crew.kids.slice(1).forEach(function (k) {
        k.tugMode = 'lose';
        if (k.useMixer && k.stopClip) k.stopClip();
        k.setState('headhands');
      });
      if (lose.crew.mon) lose.crew.mon.setState('sad');
      sd.crew.kids.forEach(function (ch) {
        ch.tugMode = 'win';
        if (ch.useMixer && ch.stopClip) ch.stopClip();
        ch.setState('cheer');
      });
      if (sd.crew.mon) sd.crew.mon.setState('cheer');
      K.fx.confetti(V(sd.s * 2.4, 2.8, 0), 150);
      K.ui.big('🏆 Team ' + sd.team.name + ' Wins ' + roundName(matchNo) + '!', 2.0, true);
      K.say('Splash! Team ' + sd.team.name + ' wins!');
    });

    K.after(3.8, function () {
      if (mudDz) mudDz.remove();
      if (meter) { meter.remove(); meter = null; }
      lose.crew.all.forEach(function (ch) { ch.inMud = false; ch.tugMode = 'ready'; ch.holder.rotation.set(0, Math.PI, 0); });
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
    // 1 small sideline mascot coach (0.80m, smaller than kids!) + 3 rigged kids (1.54–1.58m) on the rope
    jobs.push(K.makeCharacter(t, { monHeight: 0.80, kidHeight: 0.80 }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: ti % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.58 }).catch(function (err) { console.error('kid1', t.name, err); return null; }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: ti % 2 === 0 ? 'girl' : 'boy', kidHeight: 1.54 }).catch(function (err) { console.error('kid2', t.name, err); return null; }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: 'boy', kidHeight: 1.56 }).catch(function (err) { console.error('kid3', t.name, err); return null; }));
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
        if (GQC && GQC.Atmosphere) GQC.Atmosphere.addBlobShadow(h, 0.52, 0.52, 0.24, 0.012);
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
