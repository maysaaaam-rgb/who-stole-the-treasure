/* Monster Cannon 3D — English Adventure Academy
   Answer right: your monster hops into the big cannon. Drag back to aim (or tap a preset), let go: BOOM!
   Fly across the meadow popping balloons (10–50), hit the bullseye (+50) or land in the haystack (+15).
   Wrong answer: the cannon goes "pfft" and your monster plops out.
   Options: ?teams=2..4  ?rounds=1..6  ?set=<id>  ?kids (use kid avatars)  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, lerp = K.lerp;
  var V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 42, fogNear: IN_WORLD ? 90 : 60, fogFar: IN_WORLD ? 260 : 150 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var ROUNDS = clamp(+K.Q.get('rounds') || 3, 1, 6);

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, shots: [], bullseyes: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');
  var GRAV = 12;
  var VALUES = [[10, 0x6fb8ff, '#4f9dff'], [20, 0x5fdc9a, '#2fc58a'], [30, 0xffc94a, '#ffb320'], [50, 0xff7fb0, '#ff5fa2']];
  var HAY = { x: 27, r: 2.1, top: 1.25 };
  var TARGET = { x: 44, y: 3.2, r: 2.1 };
  var NET = { x: 52, h: 9, w: 15 };

  /* ---------------- world & Tripo props ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -60, 110);
  if (!IN_WORLD) {
    K.world.ground(0x8fdc7a, [-10, 0, 10, 20, 30, 40, 50].map(function (x) { return { x: x, w: 5, d: 70, c: 0x86d572 }; }));
    K.world.hills(-30, 90, -42, 11);
    for (var ti = 0; ti < 22; ti++) {
      K.world.tree(rnd(-16, 66), ti % 2 ? rnd(-26, -14) : rnd(14, 26), rnd(.9, 1.6), ti % 5 === 0);
    }
  }
  K.world.flowers(140, [-12, 60, -11, 10]);

  var propGroup = new T3.Group();
  scene.add(propGroup);
  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);
  var archModel = null, flagpoleModel = null, trophyModel = null;

  function placeDecorModels() {
    while (propGroup.children.length) propGroup.remove(propGroup.children[0]);
    if (archModel) {
      var ar = archModel.clone(true);
      ar.position.set(-4, 0, -5.8);
      propGroup.add(ar);
    }
    if (flagpoleModel) {
      [15, 35].forEach(function (fx) {
        var fp = flagpoleModel.clone(true);
        fp.position.set(fx, 0, -6.2);
        propGroup.add(fp);
      });
    }
    if (trophyModel) {
      var ped = new T3.Mesh(
        new T3.CylinderGeometry(.55, .66, .65, 18),
        new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: .35 })
      );
      ped.position.set(TARGET.x + 1.4, .325, -4.5);
      ped.castShadow = true;
      propGroup.add(ped);

      var tr = trophyModel.clone(true);
      tr.scale.multiplyScalar(.62);
      tr.position.set(TARGET.x + 1.4, .66, -4.5);
      propGroup.add(tr);
    }
  }

  // Fence along the back of the field
  (function fence() {
    var m = K.mat(0xffffff);
    for (var x = -8; x < 60; x += 2) {
      var post = new T3.Mesh(new T3.BoxGeometry(.14, .9, .14), m);
      post.position.set(x, .45, -7);
      post.castShadow = true;
      scene.add(post);
    }
    [.35, .7].forEach(function (y) {
      var rail = new T3.Mesh(new T3.BoxGeometry(68, .1, .08), m);
      rail.position.set(26, y, -7);
      scene.add(rail);
    });
  })();

  // Distance stones
  [10, 20, 30, 40, 50].forEach(function (x) {
    var tex = K.canvasTex(128, 128, function (c) {
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill();
      c.fillStyle = '#7255e0';
      c.font = '900 56px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(x + 'm', 64, 68);
    });
    var s = new T3.Mesh(new T3.CylinderGeometry(.45, .55, .5, 16), [K.mat(0xd9d2ff), new T3.MeshLambertMaterial({ map: tex }), K.mat(0xd9d2ff)]);
    s.position.set(x, .25, 4.2);
    s.castShadow = true;
    scene.add(s);
  });

  /* ---------------- cannon (code-built; GLB models replace when present) ---------------- */
  var cannon = new T3.Group();
  scene.add(cannon);
  var mound = new T3.Mesh(new T3.SphereGeometry(3.2, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0x7fd06c));
  mound.scale.y = .2;
  mound.receiveShadow = true;
  scene.add(mound);
  cannon.position.y = .55;
  var base = new T3.Group();
  cannon.add(base);
  var pivot = new T3.Group();
  pivot.position.set(0, 1.05, 0);
  cannon.add(pivot);
  var barrel = new T3.Group();
  pivot.add(barrel);
  var MUZZLE = 2.0;

  (function buildCannon() {
    var wood = K.mat(0xf2a7c3), gold = K.mat(0xffd166), metal = K.mat(0x5a4fcf), dark = K.mat(0x2b1d40);
    var cart = new T3.Mesh(new T3.BoxGeometry(1.9, .55, 1.0), wood);
    cart.position.y = .55; cart.castShadow = true; base.add(cart);
    var cheek = new T3.Mesh(new T3.BoxGeometry(1.2, .7, .16), wood);
    [-.5, .5].forEach(function (z) { var c = cheek.clone(); c.position.set(-.1, .95, z); c.castShadow = true; base.add(c); });
    [-.62, .62].forEach(function (z) {
      var wheel = new T3.Group(); wheel.position.set(.15, .62, z * 1.05);
      var tyre = new T3.Mesh(new T3.TorusGeometry(.56, .12, 10, 28), K.mat(0xc98d63)); wheel.add(tyre);
      for (var s = 0; s < 6; s++) { var sp = new T3.Mesh(new T3.BoxGeometry(.08, 1.05, .07), K.mat(0xe0a878)); sp.rotation.z = s * Math.PI / 6; wheel.add(sp); }
      var hub = new T3.Mesh(new T3.CylinderGeometry(.16, .16, .22, 16), gold); hub.rotation.x = Math.PI / 2; wheel.add(hub);
      wheel.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
      base.add(wheel); base.userData['wheel' + (z > 0 ? 'R' : 'L')] = wheel;
    });
    var tube = new T3.Mesh(new T3.CylinderGeometry(.5, .6, 2.5, 28, 1, true), metal);
    tube.rotation.z = -Math.PI / 2; tube.position.x = .65; tube.castShadow = true; barrel.add(tube);
    var inside = new T3.Mesh(new T3.CircleGeometry(.5, 28), dark);
    inside.rotation.y = Math.PI / 2; inside.position.x = 1.89; barrel.add(inside);
    var back = new T3.Mesh(new T3.SphereGeometry(.6, 24, 16), metal);
    back.position.x = -.6; back.castShadow = true; barrel.add(back);
    [[-.25, .64], [.6, .58], [1.85, .58]].forEach(function (r) {
      var ring = new T3.Mesh(new T3.TorusGeometry(r[1], .09, 10, 30), gold);
      ring.rotation.y = Math.PI / 2; ring.position.x = r[0]; barrel.add(ring);
    });
    var knob = new T3.Mesh(new T3.SphereGeometry(.18, 14, 10), gold); knob.position.x = -1.2; barrel.add(knob);
    var star = new T3.Mesh(new T3.OctahedronGeometry(.2), gold); star.position.set(.6, .6, 0); barrel.add(star);
    var fuse = new T3.Mesh(new T3.CylinderGeometry(.03, .03, .4, 6), K.mat(0x7a5a3a));
    fuse.position.set(-.55, .7, 0); fuse.rotation.z = .5; barrel.add(fuse);
    barrel.userData.fuseTip = V(-.65, .9, 0);
  })();

  K.tryGLB(K.ROOT + 'assets/3d/items/cannon-base.glb').then(function (g) {
    if (!g) return;
    base.children.slice().forEach(function (c) { base.remove(c); });
    var m = K.fitModel(g.scene, 2.0, { byLength: true });
    base.add(m);
  });
  K.tryGLB(K.ROOT + 'assets/3d/items/cannon-barrel.glb').then(function (g) {
    if (!g) return;
    barrel.children.slice().forEach(function (c) { barrel.remove(c); });
    var m = K.fitModel(g.scene, 2.9, { byLength: true });
    var box = new T3.Box3().setFromObject(m), sz = box.getSize(V(0, 0, 0));
    var holder = new T3.Group(); holder.add(m);
    if (sz.z > sz.x) holder.rotation.y = -Math.PI / 2;
    m.position.y -= sz.y / 2; holder.position.x = .65; barrel.add(holder);
    barrel.userData.fuseTip = V(-.65, .7, 0);
  });

  var aimAngle = .6;
  function setAim(a) { aimAngle = a; pivot.rotation.z = a; }
  setAim(.55);
  function muzzlePos(a) {
    var p = V(Math.cos(a) * MUZZLE, Math.sin(a) * MUZZLE, 0);
    return p.add(pivot.getWorldPosition(V(0, 0, 0)));
  }

  var recoil = 0;
  K.onFrame(function (dt) {
    recoil = Math.max(0, recoil - dt * 2.2);
    barrel.position.x = -Math.sin(Math.min(1, recoil) * Math.PI) * .45;
    var s = 1 + Math.sin(Math.min(1, recoil) * Math.PI) * .12;
    barrel.scale.set(1, s, s);
    cannon.position.x = -Math.sin(Math.min(1, recoil) * Math.PI) * .25;
    ['wheelL', 'wheelR'].forEach(function (w) {
      var wh = base.userData[w];
      if (wh) wh.rotation.z = cannon.position.x * 2;
    });
  });

  /* fuse sparks */
  var fusing = false;
  K.onFrame(function () {
    if (!fusing) return;
    var tip = barrel.localToWorld(barrel.userData.fuseTip.clone());
    if (Math.random() < .7) {
      K.fx.puff(tip, 1, { color: Math.random() < .5 ? 0xffd84a : 0xff9f43, size: .35, life: .4, opacity: 1, dir: V(0, 2, 0) });
    }
  });

  /* ---------------- animated windsock + waving wind flag ---------------- */
  var wind = 0;
  var sock = new T3.Group();
  sock.position.set(5, 0, -3.2);
  scene.add(sock);
  (function () {
    var pole = new T3.Mesh(new T3.CylinderGeometry(.06, .08, 3.8, 10), K.mat(0xffffff));
    pole.position.y = 1.9; pole.castShadow = true; sock.add(pole);
    var topBall = new T3.Mesh(new T3.SphereGeometry(.14, 12, 10), K.mat(0xffd84a));
    topBall.position.y = 3.85; sock.add(topBall);

    var cone = new T3.Group();
    cone.position.y = 3.35;
    sock.add(cone);
    sock.userData.cone = cone;
    for (var i = 0; i < 4; i++) {
      var seg = new T3.Mesh(
        new T3.CylinderGeometry(.32 - i * .055, .32 - (i + 1) * .055, .44, 14, 1, true),
        K.mat(i % 2 ? 0xffffff : 0xff5fa2, { side: T3.DoubleSide })
      );
      seg.rotation.z = -Math.PI / 2;
      seg.position.x = .22 + i * .44;
      seg.castShadow = true;
      cone.add(seg);
    }

    // Waving wind pennant flag above the windsock
    var fGeo = new T3.PlaneGeometry(1.2, .55, 8, 2);
    fGeo.translate(.6, 0, 0);
    var flagMesh = new T3.Mesh(fGeo, new T3.MeshStandardMaterial({ color: 0x4f9dff, side: T3.DoubleSide, roughness: .4 }));
    flagMesh.position.y = 3.65;
    sock.add(flagMesh);
    sock.userData.flag = flagMesh;
  })();

  K.onFrame(function (dt, t) {
    var c = sock.userData.cone, fl = sock.userData.flag, strength = Math.abs(wind) / 3;
    var targetY = wind >= 0 ? 0 : Math.PI;
    c.rotation.y = lerp(c.rotation.y, targetY, 1 - Math.exp(-dt * 3));
    c.rotation.z = lerp(-1.25, -.05, strength) + Math.sin(t * 7.5) * .07 * (strength + .25);
    c.rotation.x = Math.sin(t * 5.2) * .08 * strength;
    if (fl) {
      fl.rotation.y = c.rotation.y;
      var p = fl.geometry.attributes.position;
      for (var i = 0; i < p.count; i++) {
        var x = p.getX(i);
        p.setZ(i, Math.sin(t * (6 + strength * 8) - x * 3.5) * (.04 + strength * .12) * (x / 1.2));
      }
      p.needsUpdate = true;
    }
  });

  /* ---------------- balloons + confetti pop ---------------- */
  var balloons = [];
  function balloonValue(x, y) {
    var d = clamp((x - 10) / 34 * .55 + (y - 3) / 10 * .45 + rnd(-.2, .2), 0, .999);
    return VALUES[Math.floor(d * 4)];
  }
  function makeBalloon(x, y, z, rise) {
    var v = balloonValue(x, y), g = new T3.Group();
    var skin = new T3.Mesh(new T3.SphereGeometry(.64, 22, 16), new T3.MeshLambertMaterial({ color: v[1], emissive: v[1], emissiveIntensity: .14 }));
    skin.scale.y = 1.15; skin.castShadow = true; g.add(skin);
    var shine = new T3.Mesh(new T3.SphereGeometry(.14, 10, 8), new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .75 }));
    shine.position.set(-.2, .3, .45); g.add(shine);
    var knot = new T3.Mesh(new T3.ConeGeometry(.1, .16, 8), K.mat(v[1]));
    knot.position.y = -.74; knot.rotation.x = Math.PI; g.add(knot);
    var str = new T3.Mesh(new T3.CylinderGeometry(.008, .008, 1.6, 4), K.mat(0xffffff));
    str.position.y = -1.6; g.add(str);
    var tex = K.canvasTex(128, 128, function (c) {
      c.font = '900 64px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineWidth = 10;
      c.strokeStyle = v[2];
      c.strokeText(v[0], 64, 68);
      c.fillStyle = '#fff';
      c.fillText(v[0], 64, 68);
    });
    var num = new T3.Mesh(new T3.PlaneGeometry(.75, .75), new T3.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    num.position.z = .66; g.add(num);
    g.position.set(x, rise ? -2 : y, z);
    var b = { g: g, x: x, y: y, z: z, v: v[0], col: v[1], ph: rnd(0, 6), alive: true, rise: rise ? 0 : 1 };
    scene.add(g); balloons.push(b);
    return b;
  }
  function spawnBalloons() {
    var spots = [];
    for (var tries = 0; spots.length < 11 && tries < 400; tries++) {
      var x = rnd(9, 50), y = rnd(3.2, 12.5);
      if (Math.abs(x - TARGET.x) < 3 && y < 6) continue;
      if (spots.some(function (s) { return Math.hypot(s[0] - x, s[1] - y) < 2.6; })) continue;
      spots.push([x, y]);
    }
    spots.forEach(function (s) { makeBalloon(s[0], s[1], rnd(-.6, .6), false); });
  }
  function refillBalloons() {
    var alive = balloons.filter(function (b) { return b.alive; }).length;
    for (var n = alive; n < 11; n++) {
      for (var tries = 0; tries < 200; tries++) {
        var x = rnd(9, 50), y = rnd(3.2, 12.5);
        if (Math.abs(x - TARGET.x) < 3 && y < 6) continue;
        if (balloons.some(function (b) { return b.alive && Math.hypot(b.x - x, b.y - y) < 2.6; })) continue;
        makeBalloon(x, y, rnd(-.6, .6), true); break;
      }
    }
  }
  K.onFrame(function (dt, t) {
    balloons.forEach(function (b) {
      if (!b.alive) return;
      if (b.rise < 1) b.rise = Math.min(1, b.rise + dt * .6);
      var bobY = Math.sin(t * 1.4 + b.ph) * .25, bBase = lerp(-2, b.y, K.easeOutBack(b.rise));
      b.g.position.set(b.x + Math.sin(t * .7 + b.ph) * .15 + wind * .05, bBase + bobY, b.z);
      b.g.rotation.z = Math.sin(t * 1.1 + b.ph) * .1 - wind * .03;
    });
  });

  function popBalloon(b, scorer) {
    b.alive = false;
    scene.remove(b.g);
    var p = b.g.position.clone();
    K.fx.confetti(p.clone(), 45);
    K.fx.burst(p, [b.col, 0xffd84a, 0xffffff], 18, 7.5);
    K.fx.ring(p, b.col, 3.4);
    K.fx.text('🎈 +' + b.v, p.clone().add(V(0, .85, 0)), '#fff', 1.6);
    K.sfx('pop');
    addPoints(scorer, b.v);
  }

  /* ---------------- catch net at the end of the field ---------------- */
  var net = { A: 0, V: 0, y: 4, z: 0 };
  (function buildNet() {
    var g = new T3.Group(); g.position.set(NET.x, 0, 0); scene.add(g);
    var postM = K.mat(0xffffff), stripe = K.mat(0xff5fa2);
    [-1, 1].forEach(function (s) {
      var post = new T3.Mesh(new T3.CylinderGeometry(.16, .2, NET.h + .6, 14), postM);
      post.position.set(0, (NET.h + .6) / 2, s * NET.w / 2); post.castShadow = true; g.add(post);
      for (var i = 0; i < 5; i++) {
        var band = new T3.Mesh(new T3.CylinderGeometry(.18, .18, .35, 14), stripe);
        band.position.set(0, 1 + i * 1.9, s * NET.w / 2); g.add(band);
      }
      var ball = new T3.Mesh(new T3.SphereGeometry(.34, 16, 12), K.mat(0xffd84a));
      ball.position.set(0, NET.h + .75, s * NET.w / 2); g.add(ball);
      var foot = new T3.Mesh(new T3.CylinderGeometry(.5, .6, .25, 16), K.mat(0xd9d2ff));
      foot.position.set(0, .12, s * NET.w / 2); g.add(foot);
    });
    var rope = new T3.Mesh(new T3.CylinderGeometry(.06, .06, NET.w, 8), K.mat(0xffffff));
    rope.rotation.x = Math.PI / 2; rope.position.y = NET.h; g.add(rope);
    var tex = K.canvasTex(512, 512, function (c, w) {
      c.clearRect(0, 0, w, w); c.strokeStyle = '#ffffff'; c.lineWidth = 7;
      for (var i = 0; i <= 8; i++) {
        c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, 512); c.stroke();
        c.beginPath(); c.moveTo(0, i * 64); c.lineTo(512, i * 64); c.stroke();
      }
    });
    tex.wrapS = tex.wrapT = T3.RepeatWrapping; tex.repeat.set(NET.w / 2.2, NET.h / 2.2);
    var geo = new T3.PlaneGeometry(NET.w, NET.h, 36, 22);
    var mesh = new T3.Mesh(geo, new T3.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: .4, side: T3.DoubleSide, color: 0xfff0f7 }));
    mesh.rotation.y = -Math.PI / 2; mesh.position.y = NET.h / 2; g.add(mesh);
    net.mesh = mesh; net.base = geo.attributes.position.array.slice();
    for (var b = 0; b < 12; b++) {
      var f = new T3.Mesh(new T3.ConeGeometry(.2, .45, 3), K.mat(K.CONF[b % 5]));
      f.rotation.z = Math.PI;
      f.position.set(-.05, NET.h - .35, -NET.w / 2 + .6 + b * (NET.w - 1.2) / 11);
      f.userData.ph = b; g.add(f); net['f' + b] = f;
    }
    var sign = K.label('NET +10', '#9b7bff', 220);
    sign.position.set(0, NET.h + 1.5, 0); g.add(sign);
  })();

  K.onFrame(function (dt, t) {
    net.V += (-40 * net.A - 4.5 * net.V) * dt; net.A += net.V * dt;
    var p = net.mesh.geometry.attributes.position, b = net.base, sig2 = 2 * 1.8 * 1.8;
    for (var i = 0; i < p.count; i++) {
      var x = b[i * 3], y = b[i * 3 + 1] + NET.h / 2;
      var d2 = (x - net.z) * (x - net.z) + (y - net.y) * (y - net.y);
      var edge = Math.min(1, (NET.w / 2 - Math.abs(x)) / 1.2) * Math.min(1, (NET.h - y) / 1.0) * Math.min(1, y / 1.0);
      p.array[i * 3 + 2] = -(net.A * Math.exp(-d2 / sig2) * Math.max(0, edge)) + Math.sin(t * 1.7 + x * .4 + y * .3) * .05;
    }
    p.needsUpdate = true;
    for (var k = 0; k < 12; k++) net['f' + k].rotation.x = Math.sin(t * 3 + k) * .25;
  });

  /* ---------------- haystack + target ---------------- */
  var hay = new T3.Group(); hay.position.set(HAY.x, 0, 0); scene.add(hay);
  (function buildHay() {
    var body = new T3.Mesh(new T3.SphereGeometry(HAY.r, 26, 14, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0xffd36b));
    body.scale.y = .62; body.castShadow = true; body.receiveShadow = true; hay.add(body);
    var straw = new T3.BoxGeometry(.04, .04, .5), sm = K.mat(0xf5c04a);
    for (var i = 0; i < 70; i++) {
      var a = rnd(0, 6.28), r = rnd(.4, HAY.r * .95), s = new T3.Mesh(straw, sm);
      s.position.set(Math.cos(a) * r, Math.sqrt(Math.max(0, 1 - (r / HAY.r) * (r / HAY.r))) * HAY.r * .62 + .02, Math.sin(a) * r);
      s.rotation.set(rnd(-1, 1), rnd(0, 3), rnd(-1, 1)); hay.add(s);
    }
    var sign = K.label('+15', '#ffb320', 160); sign.position.set(0, 2.2, 0); hay.add(sign);
  })();
  K.tryGLB(K.ROOT + 'assets/3d/items/haystack.glb').then(function (g) {
    if (!g) return;
    hay.children.slice().forEach(function (c) { if (!c.isSprite) hay.remove(c); });
    hay.add(K.fitModel(g.scene, HAY.r * 2, { byLength: true, receive: true }));
  });
  var hayBounce = 0;
  K.onFrame(function (dt) {
    hayBounce = Math.max(0, hayBounce - dt * 2);
    var s = 1 + Math.sin(hayBounce * 14) * hayBounce * .25;
    hay.scale.set(1 + (1 - s) * .5, s, 1 + (1 - s) * .5);
  });

  var target = new T3.Group(); target.position.set(TARGET.x, 0, 0); scene.add(target);
  var board = new T3.Group(); board.position.y = TARGET.y; target.add(board);
  (function buildTarget() {
    var tex = K.canvasTex(512, 512, function (c) {
      var cols = ['#ff5fa2', '#ffffff', '#ff5fa2', '#ffffff', '#ffd84a'];
      cols.forEach(function (col, i) { c.fillStyle = col; c.beginPath(); c.arc(256, 256, 250 - i * 50, 0, 7); c.fill(); });
      c.fillStyle = '#2b1d40'; c.font = '900 54px Nunito, Trebuchet MS, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('50', 256, 260);
    });
    var face = new T3.Mesh(new T3.CylinderGeometry(TARGET.r, TARGET.r, .3, 40), [K.mat(0xffffff), new T3.MeshLambertMaterial({ map: tex }), new T3.MeshLambertMaterial({ map: tex })]);
    face.rotation.z = Math.PI / 2; face.castShadow = true; board.add(face);
    [-1, 1].forEach(function (s) {
      var leg = new T3.Mesh(new T3.BoxGeometry(.2, TARGET.y + .3, .2), K.mat(0xc98d63));
      leg.position.set(.3, (TARGET.y + .3) / 2, s * 1.2); leg.rotation.x = s * -.12; leg.castShadow = true; target.add(leg);
    });
  })();
  K.tryGLB(K.ROOT + 'assets/3d/items/target.glb').then(function (g) {
    if (!g) return;
    target.children.slice().forEach(function (c) { target.remove(c); });
    var m = K.fitModel(g.scene, TARGET.y + TARGET.r);
    var holder = new T3.Group(); holder.add(m); holder.rotation.y = -Math.PI / 2; target.add(holder);
  });
  var boardWobble = 0;
  K.onFrame(function (dt, t) {
    boardWobble = Math.max(0, boardWobble - dt * 1.5);
    board.rotation.z = Math.sin(t * 18) * boardWobble * .15;
  });

  /* ---------------- 3D Projectile Flight Trail Rings ---------------- */
  var flightRings = [];
  var flightRingGeo = new T3.TorusGeometry(.36, .045, 8, 20);
  function spawnFlightRing(pos, colHex) {
    var mat = new T3.MeshBasicMaterial({ color: colHex || 0xffd84a, transparent: true, opacity: .82 });
    var m = new T3.Mesh(flightRingGeo, mat);
    m.position.copy(pos);
    m.rotation.y = Math.PI / 2;
    scene.add(m);
    flightRings.push({ mesh: m, mat: mat, life: 0, maxLife: .5 });
  }
  K.onFrame(function (dt) {
    for (var i = flightRings.length - 1; i >= 0; i--) {
      var fr = flightRings[i];
      fr.life += dt;
      var u = fr.life / fr.maxLife;
      fr.mesh.scale.setScalar(1 + u * 1.2);
      fr.mat.opacity = Math.max(0, .82 * (1 - u));
      if (fr.life >= fr.maxLife) {
        scene.remove(fr.mesh);
        flightRings.splice(i, 1);
      }
    }
  });

  /* ---------------- 3D Active Turn Arrow ---------------- */
  var turnArrow = (function () {
    var cone = new T3.Mesh(
      new T3.ConeGeometry(.24, .46, 16),
      new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffa000, emissiveIntensity: .35, roughness: .25 })
    );
    cone.rotation.x = Math.PI;
    cone.visible = false;
    scene.add(cone);
    K.onFrame(function (dt, t) {
      if (!cone.visible) return;
      cone.position.y = 2.45 + Math.sin(t * 5.5) * .16;
      cone.rotation.y = t * 2.8;
    });
    return {
      set: function (ch) {
        if (!ch || phase === 'end') { cone.visible = false; return; }
        cone.visible = true;
        cone.position.x = ch.home.x;
        cone.position.z = ch.home.z;
      }
    };
  })();

  /* ---------------- characters (all 4 loaded at boot) ---------------- */
  var chars = [];
  function lineupSpot(i) { return V(-6.5 + i * 1.55, 0, 3.2 + (i % 2) * .5); }
  function makeHolder(ch, i) {
    var h = new T3.Group();
    h.add(ch.root);
    ch.root.position.y = -ch.height / 2;
    scene.add(h);
    ch.holder = h;
    ch.home = lineupSpot(i);
    h.position.copy(ch.home).add(V(0, ch.height / 2, 0));
    ch.root.rotation.y = .5;
    var ring = new T3.Mesh(new T3.RingGeometry(.45, .62, 32), new T3.MeshBasicMaterial({ color: ALL_TEAMS[i].hex, transparent: true, opacity: .9 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(ch.home);
    ring.position.y = .03;
    scene.add(ring);
    ch.ring = ring;
    ch.badge = K.label(ALL_TEAMS[i].name, ALL_TEAMS[i].c);
    ch.badge.position.y = ch.height / 2 + .45;
    h.add(ch.badge);
  }
  function placeHome(ch) {
    ch.holder.position.copy(ch.home).add(V(0, ch.height / 2, 0));
    ch.holder.rotation.set(0, 0, 0);
    ch.holder.scale.setScalar(1);
    ch.holder.visible = true;
    ch.root.rotation.set(0, .5, 0);
    ch.root.position.set(0, -ch.height / 2, 0);
    ch.setState('idle');
  }
  function syncCharactersForTeamCount() {
    TEAMS = ALL_TEAMS.slice(0, nTeams);
    chars.forEach(function (ch, i) {
      var vis = i < nTeams;
      ch.holder.visible = vis;
      ch.ring.visible = vis;
      if (vis) placeHome(ch);
    });
  }
  var fpsAvg = 60;
  K.onFrame(function (dt) {
    if (dt > 0.0005 && dt < 0.5) fpsAvg = fpsAvg * 0.92 + (1 / dt) * 0.08;
    chars.forEach(function (c, i) {
      c.update(dt);
      var act = i === active && (phase === 'question' || phase === 'turn');
      var s = act ? 1.15 + .12 * Math.sin(K.now * 6) : 1;
      c.ring.scale.setScalar(s);
      c.badge.visible = i < nTeams && phase !== 'end' && (phase !== 'flight' || i === active);
    });
  });

  /* ---------------- scoring & HUD ---------------- */
  var hud, active = 0, round = 1, phase = 'loading', shotPoints = 0;
  var windBox = null, turnBannerEl = null, liveBoardEl = null;

  function setPhase(p) {
    phase = p;
    window.__k3phase = p;
  }

  function addPoints(i, p) {
    TEAMS[i].score += p;
    shotPoints += p;
    if (hud) { hud.refresh(active); hud.bump(i); }
    updateLiveScoreUI(active);
  }

  function showWind() {
    if (!windBox) windBox = K.ui.add(K.el('div', 'windbox'));
    var s = Math.abs(wind) < .2 ? 'Calm 🍃' : 'Wind <b style="transform:rotate(' + (wind < 0 ? 180 : 0) + 'deg)">➜</b> ' + Math.round(Math.abs(wind) * 10) / 10;
    windBox.innerHTML = '💨 ' + s + ' &nbsp;·&nbsp; Round ' + round + '/' + ROUNDS;
  }

  function updateTurnUI(ti, msg) {
    if (ti < 0 || ti >= nTeams) {
      turnArrow.set(null);
      if (turnBannerEl) turnBannerEl.style.display = 'none';
      return;
    }
    var t = TEAMS[ti];
    turnArrow.set(chars[ti]);
    if (!turnBannerEl) return;
    turnBannerEl.style.display = 'inline-flex';
    turnBannerEl.style.setProperty('--c', t.c);
    turnBannerEl.innerHTML =
      '<span class="cn-turn-dot"></span>' +
      '<span>💥 Team ' + t.name + '\'s Shot · ' + (msg || ('Round ' + round + ' of ' + ROUNDS)) + '</span>';
  }

  function updateLiveScoreUI(activeTi) {
    if (!liveBoardEl) return;
    var rows = TEAMS.map(function (t, i) {
      var cells = '';
      for (var r = 0; r < ROUNDS; r++) {
        var val = t.shots[r];
        if (val === undefined) cells += '<span class="cn-rcell">·</span>';
        else cells += '<span class="cn-rcell' + (val >= 50 ? ' bull' : '') + '">' + val + '</span>';
      }
      return '<div class="cn-live-row' + (i === activeTi ? ' on' : '') + '" style="--c:' + t.c + '">' +
        '<b>' + t.name + '</b>' +
        '<div class="cn-rshots">' + cells + '</div>' +
        '<span>' + t.score + '</span>' +
      '</div>';
    }).join('');
    liveBoardEl.innerHTML = '<div class="cn-live-head">💥 Cannon Scores (' + round + '/' + ROUNDS + ')</div>' + rows;
  }

  /* ---------------- camera shots ---------------- */
  function shot(name) {
    K.cam.follow = null;
    if (name === 'title') {
      K.cam.follow = function () {
        var a = K.now * .12;
        K.cam.tPos.set(-2 + Math.sin(a) * 4, 3.4, 11 + Math.cos(a) * 2);
        K.cam.tLook.set(-1.5, 1.4, 1);
      };
      K.cam.k = 1.5;
    }
    if (name === 'intro') { K.cam.set(V(26, 14, 40), V(24, 4, 0), 1.2); }
    if (name === 'lineup') K.cam.set(V(-3.6, 3.1, 9.8), V(-3.2, -.2, 2.6), 2.5);
    if (name === 'aim') K.cam.set(V(10, 6.8, 17.5), V(14, 5.0, 0), 2.2);
    if (name === 'cannon') K.cam.set(V(3.2, 2.6, 7), V(-.4, 1.7, 0), 3);
    if (name === 'flight') {
      K.cam.k = 5;
      K.cam.follow = function () {
        var p = flier.pos, n = clamp((p.x - (NET.x - 12)) / 8, 0, 1);
        K.cam.tPos.set(lerp(p.x - 2.6, NET.x - 6.5, n), lerp(Math.max(2.2, p.y + 1.1), 4, n), lerp(10, 6.5, n));
        K.cam.tLook.set(lerp(p.x + 2.6, NET.x - .5, n), lerp(Math.max(1.2, p.y * .92), Math.max(1.5, p.y * .7), n), 0);
      };
    }
    if (name === 'replaycam') {
      // Dramatic Bullseye Slow-Mo Replay camera beside the target board!
      K.cam.set(V(TARGET.x - 6.5, TARGET.y + 1.1, -6.4), V(TARGET.x - .3, TARGET.y, 0), 4.5);
    }
    if (name === 'land') {
      K.cam.k = 3;
      K.cam.follow = function () {
        var p = flier.pos, hp = flier.ch ? flier.ch.holder.position : p;
        if (hp.x > NET.x - 6) {
          K.cam.tPos.set(NET.x - 6, 2.6, 4.8);
          K.cam.tLook.set(NET.x - 1.2, 1.4, 0);
          return;
        }
        var nearT = Math.abs(hp.x - TARGET.x) < 4 ? 1 : 0;
        K.cam.tPos.set(hp.x + 1.4 - nearT * 5.5, Math.max(1.9, hp.y + 1.3) + nearT * 1.5, 5.6 + nearT * 4);
        K.cam.tLook.set(hp.x, Math.max(.8, hp.y), 0);
      };
    }
    if (name === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .55;
        K.cam.tPos.set(-4 + a * 2.2, 3.8, 13.8);
        K.cam.tLook.set(-4, .35, 6);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer to hop into the giant cannon!' },
    { ico: '💥', c: '#4f9dff', t: '2. Aim & Fire!', s: 'Check the wind flag, drag back to aim angle & power, and let go — BOOM!' },
    { ico: '🎯', c: '#ffb320', t: '3. Pop Balloons & Bullseye!', s: 'Pop balloons for 10 to 50 points, land in the haystack, or hit the bullseye!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.cn-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'cn-howto-modal'));
    var card = K.el('div', 'cn-howto-card');
    card.innerHTML = '<h2 class="cn-howto-title">💥 How to Play Monster Cannon 3D</h2>';
    var grid = K.el('div', 'cn-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'cn-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="cn-step-num">' + (idx + 1) + '</span>' +
        '<div class="cn-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'cn-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);

    var gotIt = K.el('button', 'btn green', '👍 Got it! Load the Cannon!');
    gotIt.onclick = function () {
      try { localStorage.setItem('eaa_howto_cannon3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(gotIt);
    modal.appendChild(card);
    K.say('How to play Monster Cannon! Step 1: Answer the question to hop into the cannon. Step 2: Aim and fire. Step 3: Pop balloons and hit the bullseye!');
  }

  function addHelpTopButton() {
    var top = document.querySelector('.k3-top');
    if (!top || top.querySelector('.k3-help-btn')) return;
    var helpBtn = K.el('button', 'k3-icon k3-help-btn', '?');
    helpBtn.title = 'How to play';
    helpBtn.onclick = function () { openHowTo(); };
    top.insertBefore(helpBtn, top.firstChild);
  }

  window.__cannon3d = {
    openHowTo: openHowTo,
    getFps: function () { return Math.round(fpsAvg); }
  };

  /* ---------------- the flier ---------------- */
  var flier = { pos: V(0, 0, 0), vel: V(0, 0, 0), ch: null, on: false, stars: null, trailT: 0 };

  function hopIntoCannon(ch, done) {
    var from = ch.holder.position.clone(), to = muzzlePos(aimAngle).add(V(0, .6, 0)), t = 0, dur = .85;
    ch.setState('hop'); K.sfx('boing'); shot('cannon');
    var fn = K.onFrame(function (dt) {
      t += dt; var u = clamp(t / dur, 0, 1), e = K.ease(u);
      ch.holder.position.set(lerp(from.x, to.x, e), lerp(from.y, to.y, e) + Math.sin(u * Math.PI) * 2.6, lerp(from.z, to.z, e));
      ch.holder.rotation.z = -u * Math.PI * 2;
      if (u > .75) ch.holder.scale.setScalar(1 - (u - .75) * 3.6);
      if (u >= 1) {
        K.offFrame(fn); ch.holder.visible = false; ch.holder.rotation.set(0, 0, 0);
        recoil = .25; K.sfx('load'); K.fx.puff(muzzlePos(aimAngle), 5, { size: .6 });
        done();
      }
    });
  }

  function simulate(a, pw, steps) {
    var p = muzzlePos(a), v = V(Math.cos(a), Math.sin(a), 0).multiplyScalar(9 + pw * 17), pts = [], dt = 1 / 30;
    for (var i = 0; i < steps; i++) {
      v.x += wind * dt; v.y -= GRAV * dt; p.addScaledVector(v, dt); pts.push(p.clone());
      if (p.y < 0) break;
    }
    return pts;
  }
  var dots = [];
  (function () {
    var g = new T3.SphereGeometry(.22, 10, 8), m = new T3.MeshBasicMaterial({ color: 0xfff6b0 });
    for (var i = 0; i < 16; i++) { var d = new T3.Mesh(g, m); d.visible = false; scene.add(d); dots.push(d); }
  })();
  function showDots(a, pw) {
    var pts = simulate(a, pw, 64);
    dots.forEach(function (d, i) {
      var p = pts[i * 2 + 1]; d.visible = !!p;
      if (p) { d.position.copy(p); d.scale.setScalar(1 - i / 22); }
    });
  }
  function hideDots() { dots.forEach(function (d) { d.visible = false; }); }

  function solveAimFor(goal) {
    var best = null;
    for (var a = .25; a < 1.32; a += .04) {
      for (var pw = .2; pw <= 1; pw += .03) {
        var pts = simulate(a, pw, 120), d = 1e9;
        pts.forEach(function (p) { d = Math.min(d, Math.hypot(p.x - goal.x, p.y - goal.y)); });
        if (!best || d < best.d) best = { a: a, pw: pw, d: d };
      }
    }
    return best || { a: .6, pw: .65 };
  }

  /* aiming: drag back anywhere to aim angle & power, and let go to FIRE! (or arrows + space) */
  var aimPad = null, power = .6;
  function aimPhase(team, ch) {
    setPhase('aim'); shot('aim'); fusing = true; K.sfx('fuse');
    updateTurnUI(active, '👆 Drag back to aim · let go to FIRE!');

    var hint = K.ui.add(K.el('div', 'hint', '👆 Drag back to aim · let go to FIRE!'));
    hint.style.setProperty('--c', team.c);

    aimPad = K.ui.add(K.el('div', 'aimpad'));
    aimPad.style.cssText = 'position:fixed;inset:0;touch-action:none;cursor:grab;z-index:20';

    var start = null, fired = false;
    function upd(e) {
      var dx = start.x - e.clientX, dy = e.clientY - start.y;
      var len = Math.hypot(dx, dy); if (len < 6) return;
      setAim(clamp(Math.atan2(dy, Math.max(1, dx)), .12, 1.4));
      power = clamp(len / 260, .12, 1); showDots(aimAngle, power);
    }
    aimPad.addEventListener('pointerdown', function (e) {
      start = { x: e.clientX, y: e.clientY };
      aimPad.style.cursor = 'grabbing';
      aimPad.setPointerCapture(e.pointerId);
    });
    aimPad.addEventListener('pointermove', function (e) { if (start) upd(e); });
    aimPad.addEventListener('pointerup', function (e) {
      if (!start) return;
      upd(e); start = null;
      aimPad.style.cursor = 'grab';
      if (power > .14) fire();
    });
    aimPad.addEventListener('pointercancel', function () {
      start = null;
      aimPad.style.cursor = 'grab';
    });
    function key(e) {
      if (e.key === 'ArrowUp') setAim(clamp(aimAngle + .04, .12, 1.4));
      if (e.key === 'ArrowDown') setAim(clamp(aimAngle - .04, .12, 1.4));
      if (e.key === 'ArrowRight') power = clamp(power + .04, .12, 1);
      if (e.key === 'ArrowLeft') power = clamp(power - .04, .12, 1);
      showDots(aimAngle, power);
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fire(); }
    }
    addEventListener('keydown', key);
    showDots(aimAngle, power);

    function fire() {
      if (fired) return; fired = true;
      removeEventListener('keydown', key); aimPad.remove(); hint.remove(); hideDots();
      launch(ch);
    }
    if (K.DEMO) demoAim(fire);
  }

  function demoAim(fire) {
    var goals = balloons.filter(function (b) { return b.alive; }).map(function (b) { return { x: b.x, y: b.y }; });
    goals.push({ x: HAY.x, y: .8 });
    goals.push({ x: TARGET.x - .4, y: TARGET.y });
    var goal = goals[Math.floor(Math.random() * goals.length)];
    var sfx = demoTurn > 1 ? demoTurn : '';
    if (K.Q.has('aimx' + sfx)) goal = { x: +K.Q.get('aimx' + sfx), y: +K.Q.get('aimy' + sfx) || 1 };
    var best = solveAimFor(goal);
    var a0 = aimAngle, p0 = power, t = 0, wob = rnd(-.015, .015);
    K.after(.6, function () {
      var fn = K.onFrame(function (dt) {
        t += dt; var u = clamp(t / 1.0, 0, 1), e = K.ease(u);
        setAim(lerp(a0, best.a + wob, e)); power = lerp(p0, best.pw, e); showDots(aimAngle, power);
        if (u >= 1) { K.offFrame(fn); K.after(.25, fire); }
      });
    });
  }

  function launch(ch) {
    setPhase('flight'); fusing = false; shotPoints = 0;
    var mp = muzzlePos(aimAngle), dir = V(Math.cos(aimAngle), Math.sin(aimAngle), 0);
    K.sfx('boom'); recoil = 1; K.cam.shake(.45);
    K.fx.puff(mp, 14, { size: 1.6, dir: dir.clone().multiplyScalar(5), opacity: .9, life: 1.4, drag: 3 });
    K.fx.puff(mp, 6, { color: 0xffb347, size: .9, dir: dir.clone().multiplyScalar(7), opacity: 1, life: .4 });
    K.fx.ring(mp, 0xfff2c4, 5);
    flier.ch = ch; flier.on = true; flier.spin = 0; flier.spinVel = ch.kind === 'kid' ? 0 : -9;
    flier.t = 0; flier.trailT = 0; flier.hit = {}; flier.rolling = false; flier.netT = -1;
    flier.pos.copy(mp); flier.vel.copy(dir).multiplyScalar(9 + power * 17);
    ch.holder.visible = true; ch.holder.scale.setScalar(1); ch.holder.position.copy(mp);
    ch.root.rotation.set(0, Math.PI / 2, 0);
    ch.setState(ch.kind === 'kid' ? 'fly' : 'tumble');
    shot('flight');
  }

  K.onFrame(function (dt) {
    if (!flier.on) return;
    var ch = flier.ch, steps = 3, h = dt / steps;
    for (var s = 0; s < steps && flier.on; s++) {
      if (flier.netT >= 0) { netStep(h); continue; }
      if (flier.rolling) { rollStep(h); continue; }
      flier.vel.x += wind * h; flier.vel.y -= GRAV * h;
      flier.vel.multiplyScalar(1 - .02 * h);
      flier.pos.addScaledVector(flier.vel, h);
      collide();
    }
    if (!flier.on) return;
    flier.t += dt;
    ch.holder.position.copy(flier.pos);
    var ang = Math.atan2(flier.vel.y, flier.vel.x);
    if (ch.kind === 'kid' && ch.state === 'fly') {
      ch.holder.rotation.set(0, 0, ang);
      ch.root.position.set(-ch.height * .5, -.12, 0);
    } else {
      flier.spin += flier.spinVel * dt;
      ch.holder.rotation.set(0, 0, flier.spin);
      ch.root.position.set(0, -ch.height / 2, 0);
    }
    if (!flier.rolling && flier.netT < 0) {
      flier.trailT += dt;
      if (flier.trailT >= 0.042) {
        flier.trailT = 0;
        spawnFlightRing(flier.pos, TEAMS[active] ? TEAMS[active].hex : 0xffd84a);
        K.fx.puff(flier.pos.clone().addScaledVector(flier.vel, -.04), 1, { color: 0xffffff, size: .45, life: .55, opacity: .55 });
      }
    }
  });

  function collide() {
    var p = flier.pos, ch = flier.ch, r = ch.height * .42;
    balloons.forEach(function (b) {
      if (!b.alive) return;
      if (p.distanceTo(b.g.position) < r + .64) {
        popBalloon(b, active); K.cam.shake(.15);
        if (ch.kind === 'kid' && ch.state === 'fly') { ch.setState('tumble'); flier.spin = Math.atan2(flier.vel.y, flier.vel.x); }
        flier.spinVel = flier.spinVel ? flier.spinVel * 1.15 : -8;
      }
    });
    if (!flier.hit.board && p.x > TARGET.x - .45 && p.x < TARGET.x + .5) {
      var dy = p.y - TARGET.y, dz = p.z, d = Math.hypot(dy, dz);
      if (d < TARGET.r + r * .4) { flier.hit.board = true; hitTarget(d); return; }
    }
    if (p.y < HAY.top + r * .3 && Math.abs(p.x - HAY.x) < HAY.r && flier.vel.y < 0) { landHay(); return; }
    if (!flier.hit.net && p.x > NET.x - r * .7 && p.x < NET.x + 1 && p.y < NET.h && Math.abs(p.z) < NET.w / 2) { catchNet(); return; }
    var c = groundR(ch);
    if (p.y < c && flier.vel.y < 0) {
      p.y = c;
      var impact = -flier.vel.y;
      if (ch.state === 'fly') { ch.setState('tumble'); flier.spin = Math.atan2(flier.vel.y, flier.vel.x); }
      if (impact > 2.4) {
        flier.vel.y = impact * .42; flier.vel.x *= .7;
        flier.spinVel = -flier.vel.x / (ch.height * .35) + rnd(-2, 2);
        K.sfx('thud');
        K.fx.puff(V(p.x, .1, p.z), 3 + Math.round(impact), { color: 0xe9f6d8, size: .5 + impact * .06, spread: 1.5 });
        K.cam.shake(Math.min(.35, impact * .03));
      } else { flier.vel.y = 0; flier.rolling = true; }
    }
  }
  function groundR(ch) { return ch.height * .3; }

  function catchNet() {
    var ch = flier.ch; flier.hit.net = true; flier.netT = 0;
    if (ch.state === 'fly') { ch.setState('tumble'); flier.spin = Math.atan2(flier.vel.y, flier.vel.x); }
    net.y = flier.pos.y; net.z = flier.pos.z; net.V = Math.max(4, flier.vel.x) * 1.1;
    flier.netVx = flier.vel.x; flier.spinVel *= .3;
    addPoints(active, 10); K.fx.text('+10', flier.pos.clone().add(V(-1, 1.4, 0)), '#c3a6ff', 1.6);
    K.sfx('boing'); K.cam.shake(.2); K.fx.puff(flier.pos.clone(), 6, { color: 0xffffff, size: .6 });
  }
  function netStep(h) {
    flier.netT += h;
    var p = flier.pos;
    p.x = NET.x - groundR(flier.ch) * .6 + net.A;
    flier.vel.y -= GRAV * .35 * h; flier.vel.y *= 1 - 3 * h;
    p.y = Math.max(groundR(flier.ch), p.y + flier.vel.y * h);
    flier.spinVel *= 1 - 2 * h;
    if (flier.netT > .25 && net.V < 0 && net.A < .2) {
      flier.netT = -1; flier.vel.set(-1.2 - Math.abs(flier.netVx) * .05, 2.0, 0); flier.spinVel = 6;
      K.sfx('boing');
    }
  }
  function rollStep(h) {
    var p = flier.pos, ch = flier.ch;
    flier.vel.x *= Math.exp(-3.4 * h); flier.vel.x += wind * .1 * h;
    p.x += flier.vel.x * h; p.y = groundR(ch);
    flier.spinVel = lerp(flier.spinVel, -flier.vel.x / (ch.height * .3), 1 - Math.exp(-8 * h));
    if (Math.random() < Math.abs(flier.vel.x) * .08) K.fx.puff(V(p.x, .08, p.z), 1, { color: 0xe9f6d8, size: .5 });
    if (Math.abs(flier.vel.x) < .35) settle();
  }

  function endFlight() {
    flier.on = false; K.timeScale = 1;
    flier.ch.root.position.set(0, -flier.ch.height / 2, 0);
  }
  function scoreSummary(extra) {
    var t = TEAMS[active];
    var txt = shotPoints > 0 ? '+' + shotPoints + ' for ' + t.name + '!' : 'Nice flight!';
    K.ui.toast((extra ? extra + ' · ' : '') + txt, 2.0, t.c);
  }

  // Bullseye Slow-Mo Replay Camera!
  function playBullseyeReplay(ch, hitPos, onDone) {
    var badge = K.ui.add(K.el('div', 'cn-replay-badge'));
    badge.innerHTML = '<span class="cn-replay-dot"></span><span>🎥 BULLSEYE SLOW-MO REPLAY</span>';
    shot('replaycam');
    K.timeScale = 0.34;
    var startPos = hitPos.clone().add(V(-5.2, 1.4, 0));
    var t0 = K.now, dur = .42;
    var fn = K.onFrame(function () {
      var u = clamp((K.now - t0) / dur, 0, 1);
      ch.holder.position.lerpVectors(startPos, hitPos, u);
      ch.holder.rotation.z = -u * Math.PI;
      if (Math.random() < .5) spawnFlightRing(ch.holder.position, TEAMS[active].hex);
      if (u >= 1) {
        K.offFrame(fn);
        ch.holder.rotation.set(0, 0, 0);
        boardWobble = 1.1;
        K.fx.ring(V(TARGET.x - .3, TARGET.y, 0), 0xffd84a, 5.2);
        K.fx.confetti(V(TARGET.x, TARGET.y + 1, 0), 100);
        setTimeout(function () {
          K.timeScale = 1;
          badge.remove();
          if (onDone) onDone();
        }, 420);
      }
    });
  }

  function hitTarget(d) {
    var ch = flier.ch, bull = d < .75;
    endFlight();
    flier.pos.x = TARGET.x - .35 - ch.height * .25;
    ch.holder.position.copy(flier.pos); ch.holder.rotation.set(0, 0, 0); ch.root.rotation.set(0, Math.PI / 2, 0);
    ch.setState('fly'); boardWobble = 1;
    if (ch.kind === 'kid') { ch.holder.rotation.set(0, 0, 0); ch.root.position.set(-ch.height * .5, -.12, 0); }
    var pts = bull ? 50 : 25;
    if (bull) TEAMS[active].bullseyes++;
    addPoints(active, pts);
    K.fx.text('🎯 +' + pts, flier.pos.clone().add(V(-1, 1.5, 0)), '#ffd84a', 2);
    K.fx.ring(V(TARGET.x - .3, TARGET.y, 0), bull ? 0xffd84a : 0xffffff, 5);
    if (bull) {
      K.sfx('bullseye');
      K.ui.big('🎯 BULLSEYE! +50', 1.5, true);
      K.fx.confetti(V(TARGET.x, TARGET.y + 1, 0), 130);
    } else {
      K.sfx('thud');
      K.ui.big('🎯 Target! +25', 1.2, true);
    }
    shot('land'); K.cam.shake(.3);

    function slideDown() {
      var t = 0, y0 = flier.pos.y;
      var fn = K.onFrame(function (dt) {
        t += dt; if (t < .4) return;
        var u = clamp((t - .4) / .9, 0, 1);
        flier.pos.y = lerp(y0, ch.height / 2, u * u); ch.holder.position.copy(flier.pos);
        if (u >= 1) {
          K.offFrame(fn);
          ch.root.position.set(0, -ch.height / 2, 0);
          ch.root.rotation.set(0, .3, 0);
          ch.setState(bull ? 'cheer' : 'wave');
          scoreSummary(bull ? '🎯 Bullseye' : '🎯 Target');
          K.after(1.6, shotOver);
        }
      });
    }

    if (bull) {
      K.after(.8, function () { playBullseyeReplay(ch, flier.pos.clone(), slideDown); });
    } else {
      slideDown();
    }
  }

  function landHay() {
    var ch = flier.ch; endFlight();
    flier.pos.y = HAY.top - ch.height * .05; ch.holder.position.copy(flier.pos);
    ch.holder.rotation.set(0, 0, .25); ch.root.rotation.set(0, .4, 0);
    hayBounce = 1; K.sfx('hay'); K.cam.shake(.2);
    K.fx.burst(V(flier.pos.x, HAY.top, 0), [0xffd36b, 0xf5c04a, 0xffe7a0], 30, 6, 'straw');
    addPoints(active, 15); K.fx.text('🌾 +15', flier.pos.clone().add(V(0, 1.6, 0)), '#ffd84a', 1.7);
    shot('land'); ch.setState('wave');
    K.after(.8, function () { ch.setState('cheer'); scoreSummary('🌾 Haystack'); });
    K.after(2.2, shotOver);
  }

  function settle() {
    var ch = flier.ch; flier.on = false; K.timeScale = 1;
    ch.root.position.set(0, -ch.height / 2, 0);
    shot('land');
    var a0 = flier.spin, lie = Math.round((a0 - Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2;
    var up = Math.round(lie / (Math.PI * 2)) * Math.PI * 2;
    var x = flier.pos.x, y0 = flier.pos.y, t = 0, lieY = ch.height * .17;
    K.sfx('thud'); K.fx.puff(V(x, .08, 0), 5, { color: 0xe9f6d8, size: .6 });
    var fn = K.onFrame(function (dt) {
      t += dt;
      if (t < .25) { var u = K.ease(t / .25); ch.holder.rotation.z = lerp(a0, lie, u); ch.holder.position.set(x, lerp(y0, lieY, u), 0); return; }
      if (t < .85) { ch.holder.rotation.z = lie; ch.holder.position.y = lieY; if (t < .45) ch.setState('sad'); return; }
      if (t < 1.4) {
        var g = K.ease((t - .85) / .55);
        ch.holder.rotation.z = lerp(lie, up, g); ch.holder.position.y = lerp(lieY, ch.height / 2, g) + Math.sin(g * Math.PI) * .35; ch.setState('hop'); return;
      }
      K.offFrame(fn);
      ch.holder.rotation.set(0, 0, 0); ch.holder.position.set(x, ch.height / 2, 0); ch.root.rotation.set(0, .3, 0);
      ch.setState('dizzy'); flier.stars = K.dizzyStars(ch.holder, ch.height / 2 + .15);
      K.after(.6, function () { scoreSummary(flier.hit.net ? '🥅 Net' : shotPoints ? '🎈 Balloons' : '💫 Landing!'); if (shotPoints) ch.setState('cheer'); });
      K.after(1.9, function () { if (flier.stars) { flier.stars.remove(); flier.stars = null; } shotOver(); });
    });
  }

  function shotOver() {
    TEAMS[active].shots.push(shotPoints);
    updateLiveScoreUI(active);
    var ch = flier.ch;
    K.fx.puff(ch.holder.position.clone().setY(.3), 10, { size: 1.1, color: 0xffffff });
    placeHome(ch);
    K.fx.puff(ch.home.clone().setY(.3), 10, { size: 1.1, color: 0xffffff });
    refillBalloons();
    nextTurn(true);
  }

  /* wrong answer: hop in, fizzle, plop out */
  function wrongShot(ch) {
    setPhase('oops');
    shotPoints = 0;
    hopIntoCannon(ch, function () {
      fusing = true; K.sfx('fuse');
      K.after(.9, function () {
        fusing = false; K.sfx('pfft');
        var mp = muzzlePos(aimAngle);
        K.fx.puff(mp, 6, { color: 0x9c9c9c, size: 1, dir: V(.5, .6, 0), opacity: .8, life: 1.2 });
        ch.holder.visible = true; ch.holder.scale.setScalar(1); ch.setState('tumble');
        var t = 0, from = mp.clone(), to = V(mp.x + 1.6, ch.height / 2, 1.2);
        var fn = K.onFrame(function (dt) {
          t += dt; var u = clamp(t / .65, 0, 1);
          ch.holder.position.set(lerp(from.x, to.x, u), lerp(from.y, to.y, u) + Math.sin(u * Math.PI) * .8, lerp(from.z, to.z, u));
          ch.holder.rotation.z = -u * Math.PI * 2;
          if (u >= 1) {
            K.offFrame(fn); ch.holder.rotation.set(0, 0, 0); ch.root.rotation.set(0, .6, 0);
            K.sfx('thud'); K.fx.puff(V(to.x, .1, to.z), 6, { size: .7 });
            ch.setState('shrug'); K.ui.big('Pfft! Nice try!', 1.0, true);
            K.after(1.1, function () { ch.setState('sad'); });
            K.after(1.8, function () { flier.ch = ch; shotOver(); });
          }
        });
      });
    });
  }

  /* ---------------- game flow ---------------- */
  var demoTurn = 0, DEMO_WRONG = [3];
  function title() {
    setPhase('title');
    podiumGroup.visible = false;
    syncCharactersForTeamCount();
    shot('title');
    K.cam.snap();

    K.ui.clear();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<img class="logo" src="art/logo.png" alt="Monster Cannon 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.42rem">💥 Monster Cannon — answer right, aim the cannon, and BOOM!</div>';

    // Quick Setup Row: Teams (2..4) and Rounds (2 / 3 / 5)
    var setup = K.el('div', 'cn-setup');
    var teamGrp = K.el('div', 'cn-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'cn-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        syncCharactersForTeamCount();
        teamGrp.querySelectorAll('.cn-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
        box.querySelectorAll('.setpick, .clsbox').forEach(function (el) { el.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      teamGrp.appendChild(b);
    });

    var roundGrp = K.el('div', 'cn-setup-grp', '<span>🎯 Rounds:</span>');
    [2, 3, 5].forEach(function (rc) {
      var b = K.el('button', 'cn-pill' + (rc === ROUNDS ? ' on' : ''), rc + ' rounds');
      b.onclick = function () {
        ROUNDS = rc;
        roundGrp.querySelectorAll('.cn-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
      };
      roundGrp.appendChild(b);
    });
    setup.appendChild(teamGrp);
    setup.appendChild(roundGrp);
    box.appendChild(setup);

    var rows = K.el('div', 'rows');
    var howBtn = K.el('button', 'btn soft', '❓ How to Play');
    howBtn.onclick = function () { openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Start Cannon!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['countdown', 'go', 'correct', 'wrong', 'boom', 'pop', 'fuse', 'pfft', 'thud', 'hay', 'bullseye', 'load', 'boing', 'whoosh', 'win', 'hello']);
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
    try { seenHowTo = localStorage.getItem('eaa_howto_cannon3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' 🎯'; });
    hud.refresh(-1);
    turnBannerEl = K.ui.add(K.el('div', 'cn-turn-banner'));
    turnBannerEl.style.display = 'none';
    liveBoardEl = K.ui.add(K.el('div', 'cn-live-board'));
    updateLiveScoreUI(-1);

    setPhase('intro');
    shot('intro');
    K.sfx('whoosh');
    K.after(1.6, function () { active = 0; nextTurn(false); });
  }

  function nextTurn(advance) {
    if (advance) {
      active++;
      if (active >= TEAMS.length) { active = 0; round++; }
      if (round > ROUNDS) return finish();
    }
    setPhase('turn');
    hud.refresh(active);
    wind = round === 1 && active < 2 ? 0 : Math.round(rnd(-2.6, 2.6) * 10) / 10;
    if (Math.abs(wind) < .4) wind = 0;
    showWind();
    updateTurnUI(active, 'Round ' + round + ' of ' + ROUNDS + ' · Answer to load cannon!');
    updateLiveScoreUI(active);

    var ch = chars[active], team = TEAMS[active];
    shot('lineup');
    ch.setState('hello');
    K.sfx('hello');
    K.after(.9, function () {
      ch.setState('idle');
      setPhase('question');
      demoTurn++;
      K.ui.ask(QS.next(), team, {
        prompt: 'answer right to load the giant cannon!',
        demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
        onAnswer: function (ok) {
          if (!ok) return wrongShot(ch);
          K.sfx('correct');
          hopIntoCannon(ch, function () { aimPhase(team, ch); });
        }
      });
    });
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    podiumGroup.visible = true;
    var stepSpecs = [
      { rank: 1, x: -4.0, h: 1.25, w: 1.9, col: 0xffd84a },
      { rank: 2, x: -6.1, h: 0.86, w: 1.7, col: 0xdce4f2 },
      { rank: 3, x: -1.9, h: 0.62, w: 1.7, col: 0xf0a868 },
      { rank: 4, x:  0.1, h: 0.40, w: 1.5, col: 0xe9e2f5 }
    ];
    var pz = 6.0;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti], ch = chars[ti];
      var g = new T3.Group();
      g.position.set(sp.x, 0, pz);
      podiumGroup.add(g);

      var baseCyl = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .52, sp.w * .58, sp.h, 28),
        new T3.MeshStandardMaterial({ color: sp.col, roughness: .32, metalness: .08 })
      );
      baseCyl.position.y = sp.h / 2;
      baseCyl.castShadow = true;
      baseCyl.receiveShadow = true;
      g.add(baseCyl);

      var cap = new T3.Mesh(
        new T3.CylinderGeometry(sp.w * .55, sp.w * .55, .1, 28),
        new T3.MeshStandardMaterial({ color: t.hex, roughness: .3 })
      );
      cap.position.y = sp.h + .04;
      g.add(cap);

      var numLab = K.label('#' + sp.rank + ' ' + t.name, t.c);
      numLab.scale.multiplyScalar(.66);
      numLab.position.set(0, sp.h + 2.05, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.52);
        tr.position.set(.58, sp.h + .05, .34);
        g.add(tr);
      }

      if (ch) {
        ch.holder.position.set(sp.x - (rk === 0 ? .12 : 0), sp.h + ch.height / 2 + .06, pz);
        ch.holder.rotation.set(0, 0, 0);
        ch.root.rotation.set(0, 0, 0);
        ch.ring.visible = false;
        ch.setState(rk === 0 ? 'cheer' : 'clap');
      }
    });
  }

  function finish() {
    setPhase('end');
    updateTurnUI(-1);
    if (turnBannerEl) turnBannerEl.remove();
    if (liveBoardEl) liveBoardEl.remove();
    if (windBox) { windBox.remove(); windBox = null; }
    hud.refresh(-1);

    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return TEAMS[b].score - TEAMS[a].score;
    });
    buildPodium3D(order);
    shot('podium');
    K.sfx('win');
    K.cam.shake(.2);
    K.fx.confetti(V(-4, 4.4, 6), 220);
    K.after(.7, function () { K.fx.confetti(V(-5, 4.8, 5), 140); });

    var w = TEAMS[order[0]];
    K.ui.big('🏆 Team ' + w.name + ' Wins!', 2.3, true);
    K.say('Team ' + w.name + ' wins Monster Cannon!');

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var t = TEAMS[ti];
        var shotsHtml = t.shots.map(function (v) {
          return '<span class="cn-rcell' + (v >= 50 ? ' bull' : '') + '">' + v + '</span>';
        }).join('');
        return '<div class="cn-table-row" style="--c:' + t.c + '">' +
          '<span class="cn-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<div class="cn-rshots">' + shotsHtml + '</div>' +
          '<i>' + t.score + ' 🎯</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + w.c + ';font-size:1.42rem">🏆 Team ' + w.name + ' Wins Monster Cannon!</div>' +
        '<div class="cn-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'cannon3d', title: 'Monster Cannon 3D' });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Loading the giant cannon…</span>'));
  spawnBalloons();
  var worldP = IN_WORLD ? K.World.load({ zone: 'cannon' }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); }) : Promise.resolve();
  var arP = K.tryGLB('models/games-arch.glb').then(function (g) { return g ? K.fitModel(g.scene, 5.8) : null; });
  var fpP = K.tryGLB('models/team-flagpole.glb').then(function (g) { return g ? K.fitModel(g.scene, 4.0) : null; });
  var trP = K.tryGLB('models/trophy.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.35) : null; });

  Promise.all([worldP, arP, fpP, trP].concat(ALL_TEAMS.map(function (t, i) {
    return K.makeCharacter(t, { kidsOnly: true, kid: i % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.45 });
  }))).then(function (res) {
    archModel = res[1];
    flagpoleModel = res[2];
    trophyModel = res[3];
    placeDecorModels();

    res.slice(4).forEach(function (ch, i) {
      chars.push(ch);
      makeHolder(ch, i);
    });
    syncCharactersForTeamCount();
    loading.remove();
    title();
    K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
