/* Bomb or Bonus 3D — English Adventure Academy
   Plays on a gift-box stage at the Funfair in Adventure Park (games/world).
   Answer right, then pick one of 12 numbered gift boxes. Inside: points, Swap, Steal, Double … or a silly bomb (−5).
   Mode "Keep it or Give it": before the box opens, the team decides to keep it or give it to another team.
   Options: ?mode=keepgive  ?teams=2..4  ?boxes=4..12  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?howto=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 42, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var maxBoxesToOpen = clamp(+K.Q.get('boxes') || 12, 2, 12);
  var MODE = K.Q.get('mode') === 'keepgive' ? 'keepgive' : 'classic';

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, boxesOpened: 0, bombsHit: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- what is inside the 12 boxes ---------------- */
  var KINDS = {
    bomb:   { icon: '💣', text: 'BOMB! −5', say: 'Oh no, a bomb! Minus five!', color: '#ff5f5f' },
    p5:     { icon: '⭐', text: '+5', say: 'Plus five!', color: '#ffd84a', pts: 5 },
    p10:    { icon: '⭐', text: '+10', say: 'Plus ten!', color: '#ffd84a', pts: 10 },
    p20:    { icon: '🌟', text: '+20', say: 'Plus twenty! Wow!', color: '#ffb320', pts: 20 },
    swap:   { icon: '🔄', text: 'SWAP!', say: 'Swap scores!', color: '#9b7bff' },
    steal:  { icon: '🦊', text: 'STEAL 5!', say: 'Steal five points!', color: '#4f9dff' },
    double: { icon: '✖️2', text: 'DOUBLE!', say: 'Double your points!', color: '#2fc58a' }
  };
  var CONTENTS = K.shuffle(['bomb', 'bomb', 'bomb', 'bomb', 'p5', 'p5', 'p10', 'p10', 'p20', 'swap', 'steal', 'double']);

  /* ---------------- world + stage ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0xf3e2b8);

  var STAGE_Z = -2.6, STAGE_R = 7.2, STAGE_H = .45;
  var SLOTS = [];   // 3 rising rows of 4 boxes: 1-4 at the back (highest), 9-12 at the front
  [[STAGE_Z - 2.0, STAGE_H + .9], [STAGE_Z - .3, STAGE_H + .45], [STAGE_Z + 1.4, STAGE_H]].forEach(function (row) {
    [-3.3, -1.1, 1.1, 3.3].forEach(function (x) { SLOTS.push({ x: x, y: row[1], z: row[0] }); });
  });

  var podiumGroup = new T3.Group();
  scene.add(podiumGroup);
  var trophyModel = null, coinPileProto = null, bombProto = null, giftProtos = {};

  (function buildStage() {
    var stripes = K.canvasTex(512, 64, function (c, w, h) {
      for (var i = 0; i < 16; i++) {
        c.fillStyle = i % 2 ? '#ffffff' : '#ff5fa2';
        c.fillRect(i * w / 16, 0, w / 16 + 1, h);
      }
    });
    stripes.wrapS = T3.RepeatWrapping;
    stripes.repeat.set(3, 1);
    var top = new T3.MeshStandardMaterial({ color: 0xfff3d6, roughness: .55 });
    var side = new T3.MeshLambertMaterial({ map: stripes });
    var base = new T3.Mesh(new T3.CylinderGeometry(STAGE_R, STAGE_R + .18, STAGE_H, 64, 1, false), [side, top, top]);
    base.position.set(0, STAGE_H / 2, STAGE_Z);
    base.receiveShadow = true;
    base.castShadow = true;
    scene.add(base);

    // Gold trim ring around the circular funfair stage
    var stageRim = new T3.Mesh(
      new T3.TorusGeometry(STAGE_R + .04, .08, 12, 64),
      new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .28, metalness: .2 })
    );
    stageRim.rotation.x = Math.PI / 2;
    stageRim.position.set(0, STAGE_H, STAGE_Z);
    scene.add(stageRim);

    // Two rising steps at the back for the box rows
    [[STAGE_H + .225, STAGE_Z - 1.15, 3.4], [STAGE_H + .675, STAGE_Z - 2.0, 1.7]].forEach(function (s) {
      var st = new T3.Mesh(new T3.BoxGeometry(9.8, .45, s[2]), [side, side, top, top, side, side]);
      st.position.set(0, s[0], s[1]);
      st.receiveShadow = true;
      st.castShadow = true;
      scene.add(st);
    });

    // Sign arch behind the stage
    var post = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .3 });
    [-5.4, 5.4].forEach(function (x) {
      var p = new T3.Mesh(new T3.CylinderGeometry(.16, .2, 5.6, 16), post);
      p.position.set(x, 2.8, STAGE_Z - 4.4);
      p.castShadow = true;
      scene.add(p);
      var ball = new T3.Mesh(
        new T3.SphereGeometry(.35, 20, 14),
        new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .25, metalness: .2 })
      );
      ball.position.set(x, 5.75, STAGE_Z - 4.4);
      scene.add(ball);
    });
    var sign = K.canvasTex(1024, 220, function (c, w, h) {
      K.roundRect(c, 6, 6, w - 12, h - 12, 60);
      c.fillStyle = '#ffffff';
      c.fill();
      c.lineWidth = 12;
      c.strokeStyle = '#ff5fa2';
      c.stroke();
      c.font = '900 116px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineWidth = 18;
      c.strokeStyle = '#2b1d40';
      c.strokeText('BOMB or BONUS', w / 2, h / 2 + 6);
      var g = c.createLinearGradient(0, 40, 0, 180);
      g.addColorStop(0, '#ffd84a');
      g.addColorStop(1, '#ff9f38');
      c.fillStyle = g;
      c.fillText('BOMB or BONUS', w / 2, h / 2 + 6);
    });
    var sm = new T3.Mesh(new T3.PlaneGeometry(10, 2.15), new T3.MeshBasicMaterial({ map: sign, transparent: true }));
    sm.position.set(0, 4.75, STAGE_Z - 4.35);
    scene.add(sm);

    // Bunting from the sign to the front corners
    var flagCols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a];
    [-1, 1].forEach(function (s) {
      var a = V(s * 5.4, 5.3, STAGE_Z - 4.4), b = V(s * 7.6, 3.2, STAGE_Z + 5.5);
      for (var i = 0; i <= 12; i++) {
        var u = i / 12, p = a.clone().lerp(b, u);
        p.y -= Math.sin(u * Math.PI) * .9;
        var f = new T3.Mesh(new T3.ConeGeometry(.22, .5, 3), K.mat(flagCols[i % 4]));
        f.rotation.x = Math.PI;
        f.position.copy(p).add(V(0, -.25, 0));
        scene.add(f);
      }
    });
  })();

  /* ---------------- 3D Physics FX: Flying Lids, Cartoon Poof Cloud, Bonus Coins & Power Cards ---------------- */
  var flyingObjs = [];
  K.onFrame(function (dt) {
    for (var i = flyingObjs.length - 1; i >= 0; i--) {
      var fo = flyingObjs[i];
      fo.life += dt;
      if (fo.update) fo.update(dt, fo.life / fo.maxLife);
      if (fo.life >= fo.maxLife) {
        scene.remove(fo.mesh);
        flyingObjs.splice(i, 1);
      }
    }
  });

  // Flying box lid when a mystery box pops open
  function spawnFlyingLid(pos, colHex) {
    var g = new T3.Group();
    var lid = new T3.Mesh(
      new T3.BoxGeometry(.95, .18, .95),
      new T3.MeshStandardMaterial({ color: colHex || 0xff5fa2, roughness: .32 })
    );
    var bow = new T3.Mesh(
      new T3.TorusKnotGeometry(.18, .05, 32, 8),
      new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .25, metalness: .2 })
    );
    bow.position.y = .14;
    g.add(lid);
    g.add(bow);
    g.position.copy(pos);
    scene.add(g);

    var vx = rnd(-1.4, 1.4), vy = rnd(5.2, 6.8), vz = rnd(.8, 2.2);
    var rx = rnd(5, 9), ry = rnd(4, 8), rz = rnd(-7, 7);
    flyingObjs.push({
      mesh: g,
      life: 0,
      maxLife: 1.05,
      update: function (dt) {
        vy -= 14.5 * dt;
        g.position.x += vx * dt;
        g.position.y += vy * dt;
        g.position.z += vz * dt;
        g.rotation.x += rx * dt;
        g.rotation.y += ry * dt;
        g.rotation.z += rz * dt;
      }
    });
  }

  // Multi-layered cartoon poof cloud on bomb explosion
  var poofSphereGeo = new T3.SphereGeometry(.42, 14, 12);
  function spawnPoofCloud(center) {
    var g = new T3.Group();
    g.position.copy(center);
    scene.add(g);
    var puffs = [];
    var cols = [0xfff8ec, 0xffe066, 0xff8743, 0x8c8594];
    for (var i = 0; i < 14; i++) {
      var mat = new T3.MeshStandardMaterial({
        color: cols[i % cols.length],
        roughness: .6,
        transparent: true,
        opacity: .95
      });
      var m = new T3.Mesh(poofSphereGeo, mat);
      var ang = (i / 14) * Math.PI * 2 + rnd(-.2, .2);
      var rad = rnd(.3, 1.15);
      puffs.push({
        mesh: m,
        mat: mat,
        dir: V(Math.cos(ang) * rad, rnd(-.2, .95), Math.sin(ang) * rad),
        s0: rnd(.65, 1.25)
      });
      g.add(m);
    }
    flyingObjs.push({
      mesh: g,
      life: 0,
      maxLife: 1.15,
      update: function (dt, u) {
        var e = 1 - Math.pow(1 - Math.min(1, u), 3);
        puffs.forEach(function (p) {
          p.mesh.position.copy(p.dir).multiplyScalar(.25 + e * 1.45);
          p.mesh.scale.setScalar(p.s0 * (1 + Math.sin(u * Math.PI) * .85));
          p.mat.opacity = Math.max(0, 1 - u * u);
        });
      }
    });
  }

  // Erupting 3D gold coins flying from the opened box to the winning team
  var coinGeo = new T3.CylinderGeometry(.19, .19, .055, 18);
  var coinMat = new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: .22, metalness: .45 });
  function spawnBonusCoins(fromPos, toPos, count) {
    for (var i = 0; i < (count || 14); i++) {
      var m = new T3.Mesh(coinGeo, coinMat);
      m.rotation.x = Math.PI / 2;
      m.position.copy(fromPos);
      scene.add(m);
      var delay = i * .035;
      var arcH = rnd(1.8, 3.2);
      var spreadX = rnd(-.45, .45);
      (function (mesh, d, ah, sx) {
        flyingObjs.push({
          mesh: mesh,
          life: -d,
          maxLife: .82,
          update: function (dt) {
            if (this.life < 0) { mesh.visible = false; return; }
            mesh.visible = true;
            var u = clamp(this.life / this.maxLife, 0, 1);
            mesh.position.lerpVectors(fromPos, toPos, u);
            mesh.position.x += Math.sin(u * Math.PI) * sx;
            mesh.position.y += Math.sin(u * Math.PI) * ah;
            mesh.rotation.y += 11 * dt;
            mesh.rotation.z += 7 * dt;
          }
        });
      })(m, delay, arcH, spreadX);
    }
  }

  // Flying 3D Power Card (SWAP / STEAL / DOUBLE) arcing to the team
  function spawnFlyingCard(kind, fromPos, toPos) {
    var k = KINDS[kind];
    var tex = K.canvasTex(256, 340, function (c, w, h) {
      K.roundRect(c, 10, 10, w - 20, h - 20, 36);
      c.fillStyle = '#fffdf7';
      c.fill();
      c.lineWidth = 14;
      c.strokeStyle = k.color;
      c.stroke();
      c.font = '900 105px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(kind === 'swap' ? '🔄' : kind === 'steal' ? '🦊' : '×2', w / 2, h * .40);
      c.font = '900 44px Nunito, Trebuchet MS, sans-serif';
      c.fillStyle = '#2b1d40';
      c.fillText(k.text, w / 2, h * .76);
    });
    var card = new T3.Mesh(
      new T3.BoxGeometry(1.1, 1.48, .08),
      new T3.MeshBasicMaterial({ map: tex })
    );
    card.position.copy(fromPos);
    scene.add(card);

    flyingObjs.push({
      mesh: card,
      life: 0,
      maxLife: 1.25,
      update: function (dt, u) {
        var e = K.ease(clamp(u, 0, 1));
        card.position.lerpVectors(fromPos, toPos, e);
        card.position.y += Math.sin(e * Math.PI) * 2.4;
        card.rotation.y = (1 - e) * Math.PI * 2;
        var sc = 1 + Math.sin(e * Math.PI) * .35;
        card.scale.setScalar(sc);
        if (Math.random() < .45) {
          K.fx.burst(card.position.clone(), 2, { color: [new T3.Color(k.color).getHex(), 0xffd84a], speed: 1.8, size: .1, life: .3 });
        }
      }
    });
  }

  /* ---------------- 3D Active Turn Ring & Arrow ---------------- */
  var turnMarker = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(
      new T3.TorusGeometry(.88, .075, 12, 32),
      new T3.MeshBasicMaterial({ color: 0xff5fa2 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .12;
    g.add(ring);

    var cone = new T3.Mesh(
      new T3.ConeGeometry(.25, .46, 16),
      new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffa000, emissiveIntensity: .35, roughness: .25 })
    );
    cone.rotation.x = Math.PI;
    cone.position.y = 2.45;
    g.add(cone);

    g.visible = false;
    scene.add(g);
    K.onFrame(function (dt, t) {
      if (!g.visible) return;
      ring.scale.setScalar(1 + Math.sin(t * 6) * .08);
      cone.position.y = 2.4 + Math.sin(t * 5.5) * .18;
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

  /* ---------------- the 12 mystery prize boxes ---------------- */
  var boxes = [], pickMode = false;
  var ROW_COLS = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a];

  function numberBadgeSprite(num, colHex) {
    var hexStr = '#' + new T3.Color(colHex).getHexString();
    var tex = K.canvasTex(128, 128, function (c, w, h) {
      c.beginPath();
      c.arc(w / 2, h / 2, 52, 0, Math.PI * 2);
      c.fillStyle = '#fffdf7';
      c.fill();
      c.lineWidth = 10;
      c.strokeStyle = hexStr;
      c.stroke();
      c.font = '900 56px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = '#2b1d40';
      c.fillText(String(num), w / 2, h / 2 + 3);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, transparent: true }));
    s.scale.set(.62, .62, 1);
    return s;
  }

  function iconTag(kind) {
    var k = KINDS[kind];
    var tex = K.canvasTex(256, 128, function (c, w, h) {
      K.roundRect(c, 6, 10, w - 12, h - 20, 40);
      c.fillStyle = 'rgba(255,255,255,.95)';
      c.fill();
      c.lineWidth = 8;
      c.strokeStyle = k.color;
      c.stroke();
      c.font = '900 56px Nunito, Trebuchet MS, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = '#2b1d40';
      c.fillText(kind === 'bomb' ? '💣 −5' : kind === 'swap' ? '🔄 SWAP' : kind === 'steal' ? '🦊 STEAL' : kind === 'double' ? '×2' : k.text, w / 2, h / 2 + 4);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, transparent: true, opacity: .95 }));
    s.scale.set(1.12, .56, 1);
    return s;
  }

  function fallbackGift(hue) {
    var g = new T3.Group(), col = ROW_COLS[hue % 4];
    var b = new T3.Mesh(new T3.BoxGeometry(.9, .75, .9), K.mat(col));
    b.position.y = .375;
    g.add(b);
    var lid = new T3.Mesh(new T3.BoxGeometry(1, .2, 1), K.mat(0xfff3d6));
    lid.position.y = .85;
    g.add(lid);
    var r1 = new T3.Mesh(new T3.BoxGeometry(.18, .97, 1.02), K.mat(0xffd84a));
    r1.position.y = .48;
    g.add(r1);
    var r2 = new T3.Mesh(new T3.BoxGeometry(1.02, .97, .18), K.mat(0xffd84a));
    r2.position.y = .48;
    g.add(r2);
    return g;
  }

  function makeBoxVisual(i) {
    // Top row (0..3) = diamond, Middle row (4..7) = gold, Front row (8..11) = silver/bronze
    var proto = i < 4 ? giftProtos.diamond : i < 8 ? giftProtos.gold : (i % 2 === 0 ? giftProtos.silver : giftProtos.bronze);
    if (!proto) proto = giftProtos.gift;
    if (proto) {
      var m = proto.clone(true);
      K.fitModel(m, 1.05);
      return m;
    }
    return fallbackGift(i);
  }

  function buildBoxes() {
    SLOTS.forEach(function (s, i) {
      var holder = new T3.Group();
      holder.position.set(s.x, s.y, s.z);
      scene.add(holder);

      var colHex = ROW_COLS[i % 4];
      var ped = new T3.Mesh(
        new T3.CylinderGeometry(.64, .72, .15, 32),
        new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .35 })
      );
      ped.position.y = .075;
      ped.receiveShadow = true;
      holder.add(ped);

      var pedRim = new T3.Mesh(
        new T3.TorusGeometry(.65, .035, 10, 32),
        new T3.MeshStandardMaterial({ color: colHex, roughness: .3 })
      );
      pedRim.rotation.x = Math.PI / 2;
      pedRim.position.y = .14;
      holder.add(pedRim);

      var model = makeBoxVisual(i);
      var spin = new T3.Group();
      spin.position.y = .15;
      spin.add(model);

      var numBadge = numberBadgeSprite(i + 1, colHex);
      numBadge.position.set(0, 1.38, .15);
      spin.add(numBadge);
      holder.add(spin);

      // Big invisible touch volume so small fingers never miss
      var hit = new T3.Mesh(
        new T3.BoxGeometry(1.9, 2.1, 1.9),
        new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hit.position.y = .95;
      holder.add(hit);

      var glow = new T3.Mesh(
        new T3.RingGeometry(.72, .98, 40),
        new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: 0, side: T3.DoubleSide, depthWrite: false })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = .16;
      holder.add(glow);

      var box = {
        i: i,
        n: i + 1,
        colHex: colHex,
        kind: CONTENTS[i],
        holder: holder,
        spin: spin,
        model: model,
        hit: hit,
        glow: glow,
        open: false,
        ph: rnd(0, 6),
        shake: 0
      };
      hit.userData.box = box;
      boxes.push(box);
    });
  }

  K.onFrame(function (dt, t) {
    boxes.forEach(function (b) {
      if (b.open) return;
      var hot = b.hot ? 1 : 0;
      b.spin.position.y = .15 + Math.abs(Math.sin(t * 2.2 + b.ph)) * (.06 + hot * .14);
      b.spin.rotation.y = Math.sin(t * .85 + b.ph) * .24;
      if (b.shake > 0) {
        var sh = Math.min(1.4, b.shake);
        b.spin.rotation.z = Math.sin(t * 44) * .16 * sh;
        b.spin.rotation.x = Math.cos(t * 36) * .11 * sh;
        var sq = 1 + Math.sin(t * 38) * .11 * sh;
        b.spin.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
      } else {
        b.spin.rotation.z = 0;
        b.spin.rotation.x = 0;
        b.spin.scale.setScalar(1 + hot * .13);
      }
      b.glow.material.opacity = hot ? .92 : (pickMode ? .38 + .22 * Math.sin(t * 4.2 + b.ph) : 0);
    });
  });

  /* ---------------- team monsters in front of the stage ---------------- */
  var chars = [], teamRings = [];
  function homeSpot(i) { return V((i - (nTeams - 1) / 2) * 2.7, 0, 5.4); }
  function syncCharactersForTeamCount() {
    TEAMS = ALL_TEAMS.slice(0, nTeams);
    chars.forEach(function (ch, i) {
      var vis = i < nTeams;
      ch.holder.visible = vis;
      if (teamRings[i]) teamRings[i].visible = vis;
      if (vis) {
        var sp = homeSpot(i);
        ch.holder.position.copy(sp);
        ch.holder.rotation.set(0, 0, 0);
        if (teamRings[i]) teamRings[i].position.copy(sp).setY(.035);
      }
    });
  }
  K.onFrame(function (dt) { chars.forEach(function (c) { c.update(dt); }); });

  /* ---------------- camera ---------------- */
  function shot(name, extra) {
    K.cam.follow = null;
    if (name === 'title') {
      K.cam.follow = function () {
        var a = K.now * .12;
        K.cam.tPos.set(Math.sin(a) * 4, 6.2, 15.5 + Math.cos(a) * 1.2);
        K.cam.tLook.set(0, 1.6, -2);
      };
      K.cam.k = 1.5;
    }
    if (name === 'stage') K.cam.set(V(0, 6.9, 15.6), V(0, 1.8, -2.5), 2.5);
    if (name === 'pick') K.cam.set(V(0, 5.1, 10.2), V(0, 1.45, -2.6), 2.5);
    if (name === 'team') {
      var p = chars[extra].holder.position;
      K.cam.set(V(p.x * .7, 2.6, p.z + 6.2), V(p.x, 1.1, p.z - 1), 2.8);
    }
    if (name === 'box') {
      var h = extra.holder.position;
      K.cam.set(V(h.x * .8, h.y + 2.3, h.z + 4.8), V(h.x, h.y + .7, h.z), 3);
    }
    if (name === 'podium') {
      K.cam.follow = function () {
        var a = Math.sin(K.now * .3) * .55;
        K.cam.tPos.set(a * 2, 3.8, 12.8);
        K.cam.tLook.set(0, .35, 3.8);
      };
      K.cam.k = 2;
    }
  }

  /* ---------------- 3-step How to Play Modal ---------------- */
  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer the Question', s: 'Listen and tap the right answer for your team!' },
    { ico: '🎁', c: '#4f9dff', t: '2. Pick a Mystery Box!', s: 'Tap a numbered prize box (1 to 12) or choose Keep it or Give it!' },
    { ico: '💣', c: '#ffb320', t: '3. Bonus, Swap or BOOM!', s: 'Win gold coins, Swap, Steal, Double… or watch out for the silly Bomb!' }
  ];
  function openHowTo(onClose) {
    var existing = document.querySelector('.bm-howto-modal');
    if (existing) existing.remove();
    var modal = K.ui.add(K.el('div', 'bm-howto-modal'));
    var card = K.el('div', 'bm-howto-card');
    card.innerHTML = '<h2 class="bm-howto-title">🎁 How to Play Bomb or Bonus 3D</h2>';
    var grid = K.el('div', 'bm-steps');
    HOWTO_STEPS.forEach(function (st, idx) {
      var box = K.el('div', 'bm-step');
      box.style.setProperty('--sc', st.c);
      box.innerHTML =
        '<span class="bm-step-num">' + (idx + 1) + '</span>' +
        '<div class="bm-step-ico">' + st.ico + '</div>' +
        '<b>' + st.t + '</b>' +
        '<p>' + st.s + '</p>';
      var sayBtn = K.el('button', 'bm-step-say', '🔊 Listen');
      sayBtn.onclick = function () { K.sfx('hello'); K.say(st.s); };
      box.appendChild(sayBtn);
      grid.appendChild(box);
    });
    card.appendChild(grid);

    var gotIt = K.el('button', 'btn green', '👍 Got it! Let\'s Play!');
    gotIt.onclick = function () {
      try { localStorage.setItem('eaa_howto_bomb3d_v1', '1'); } catch (e) {}
      modal.remove();
      if (typeof onClose === 'function') onClose();
    };
    card.appendChild(gotIt);
    modal.appendChild(card);
    K.say('How to play Bomb or Bonus! Step 1: Answer the question. Step 2: Pick a mystery prize box. Step 3: Win bonus stars, Swap, Steal, Double, or watch out for the silly bomb!');
  }

  function addHelpTopButton() {
    var top = document.querySelector('.k3-top');
    if (!top || top.querySelector('.k3-help-btn')) return;
    var helpBtn = K.el('button', 'k3-icon k3-help-btn', '?');
    helpBtn.title = 'How to play';
    helpBtn.onclick = function () { openHowTo(); };
    top.insertBefore(helpBtn, top.firstChild);
  }

  /* ---------------- HUD: turn banner & live 12-box grid tracker ---------------- */
  var hud, active = 0, phase = 'loading', demoTurn = 0, DEMO_WRONG = [3, 8];
  var turnBannerEl = null, liveBoardEl = null;
  var fpsAvg = 60;
  K.onFrame(function (dt) {
    if (dt > 0.0005 && dt < 0.5) fpsAvg = fpsAvg * 0.92 + (1 / dt) * 0.08;
  });
  window.__bomb3d = {
    openHowTo: openHowTo,
    getFps: function () { return Math.round(fpsAvg); }
  };

  function opened() { return boxes.filter(function (b) { return b.open; }).length; }

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
      '<span class="bm-turn-dot"></span>' +
      '<span>🎁 Team ' + t.name + '\'s Turn · ' + (msg || (maxBoxesToOpen - opened()) + ' Boxes Left!') + '</span>';
  }

  function updateLiveBoxesUI() {
    if (!liveBoardEl) return;
    var cells = boxes.map(function (b) {
      if (!b.open) return '<span class="bm-bcell">#' + b.n + '</span>';
      var cls = b.kind === 'bomb' ? ' open bomb' : ' open bonus';
      var txt = b.kind === 'bomb' ? '💣' : b.kind === 'swap' ? '🔄' : b.kind === 'steal' ? '🦊' : b.kind === 'double' ? '×2' : KINDS[b.kind].text;
      return '<span class="bm-bcell' + cls + '">' + txt + '</span>';
    }).join('');
    liveBoardEl.innerHTML =
      '<div class="bm-live-head">🎁 Mystery Boxes (' + (maxBoxesToOpen - opened()) + ' left)</div>' +
      '<div class="bm-box-grid">' + cells + '</div>';
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
      '<img class="logo" src="art/logo.png" alt="Bomb or Bonus 3D" onerror="this.remove()">' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.38rem">🎁 Answer right, pick a mystery prize box… Bonus or a silly BOMB?</div>';

    var modes = K.el('div', 'clspick');
    [['classic', '🎁 Bomb or Bonus'], ['keepgive', '🎀 Keep it or Give it']].forEach(function (m) {
      var b = K.el('button', 'clsbtn' + (MODE === m[0] ? ' on' : ''), m[1]);
      b.onclick = function () {
        MODE = m[0];
        Array.prototype.forEach.call(modes.children, function (x) { x.classList.toggle('on', x === b); });
      };
      modes.appendChild(b);
    });
    box.appendChild(modes);

    // Quick Setup Row: Teams (2..4) and Boxes to Open (4 / 8 / 12)
    var setup = K.el('div', 'bm-setup');
    var teamGrp = K.el('div', 'bm-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'bm-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        syncCharactersForTeamCount();
        teamGrp.querySelectorAll('.bm-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
        box.querySelectorAll('.setpick, .clsbox').forEach(function (el) { el.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      teamGrp.appendChild(b);
    });

    var boxGrp = K.el('div', 'bm-setup-grp', '<span>🎁 Boxes:</span>');
    [4, 8, 12].forEach(function (bc) {
      var b = K.el('button', 'bm-pill' + (bc === maxBoxesToOpen ? ' on' : ''), bc + ' boxes');
      b.onclick = function () {
        maxBoxesToOpen = bc;
        boxGrp.querySelectorAll('.bm-pill').forEach(function (el) { el.classList.remove('on'); });
        b.classList.add('on');
      };
      boxGrp.appendChild(b);
    });
    setup.appendChild(teamGrp);
    setup.appendChild(boxGrp);
    box.appendChild(setup);

    var rows = K.el('div', 'rows');
    var howBtn = K.el('button', 'btn soft', '❓ How to Play');
    howBtn.onclick = function () { openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Start Game!');
    go.onclick = function () {
      K.audio();
      K.loadSounds(['hello', 'correct', 'wrong', 'pop', 'boom', 'fuse', 'win', 'whoosh']);
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
    try { seenHowTo = localStorage.getItem('eaa_howto_bomb3d_v1') === '1'; } catch (e) {}
    if (K.Q.has('howto') || (!seenHowTo && !K.DEMO && !K.CAPTURE)) {
      K.after(.35, function () { if (phase === 'title') openHowTo(); });
    }
    if (K.DEMO) K.after(2.0, function () { if (phase === 'title') go.onclick(); });
  }

  function start() {
    K.ui.clear();
    K.ui.topButtons();
    addHelpTopButton();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' ⭐'; });
    hud.refresh(-1);
    turnBannerEl = K.ui.add(K.el('div', 'bm-turn-banner'));
    turnBannerEl.style.display = 'none';
    liveBoardEl = K.ui.add(K.el('div', 'bm-live-board'));
    updateLiveBoxesUI();

    phase = 'intro';
    window.__k3phase = 'intro';
    K.sfx('whoosh');
    shot('stage');
    K.ui.toast(MODE === 'keepgive' ? '🎀 Keep it or Give it!' : '🎁 12 Mystery Boxes · 4 Bombs Inside!', 1.8, '#ff5fa2');
    K.after(1.7, function () { active = 0; turn(); });
  }

  function turn() {
    phase = 'turn';
    window.__k3phase = 'turn';
    hud.refresh(active);
    var ch = chars[active], team = TEAMS[active];
    updateTurnUI(active, 'Answer right to pick a Mystery Box!');
    updateLiveBoxesUI();
    shot('team', active);
    ch.setState('bombhold');
    K.sfx('hello');

    K.after(.9, function () {
      ch.setState('idle');
      phase = 'question';
      window.__k3phase = 'question';
      demoTurn++;
      K.ui.ask(QS.next(), team, {
        prompt: 'answer right to pick a mystery box!',
        demoRight: DEMO_WRONG.indexOf(demoTurn) < 0,
        onAnswer: function (ok) {
          if (!ok) return noPick(ch, team);
          K.sfx('correct');
          ch.setState('cheer');
          K.fx.burst(ch.holder.position.clone().add(V(0, 1.3, 0)), 18, { color: [team.hex, 0xffd84a], speed: 4, size: .14, life: .55 });
          K.after(.75, function () {
            ch.setState('idle');
            pick(team);
          });
        }
      });
    });
  }

  function noPick(ch, team) {
    phase = 'oops';
    window.__k3phase = 'oops';
    ch.setState('sad');
    K.sfx('wrong');
    K.ui.big('Oops! Next team\'s turn!', 1.2, true);
    K.say('Good try! Next team.');
    K.ui.toast('No box this turn for Team ' + team.name, 1.8, team.c);
    K.after(1.9, next);
  }

  /* ---- pick a box: tap the 3D box on stage OR tap its number button in the bottom bar ---- */
  var ray = new T3.Raycaster(), mouse = new T3.Vector2();
  function pick(team) {
    phase = 'pick';
    window.__k3phase = 'pick';
    shot('pick');
    K.say('Pick a box!');
    pickMode = true;
    updateTurnUI(active, 'Tap a Mystery Box (1–12)!');

    var pickBar = K.ui.add(K.el('div', 'bm-pick-bar'));
    pickBar.style.setProperty('--c', team.c);
    pickBar.innerHTML = '<div>👆 Team ' + team.name + ': tap a 3D Mystery Box or tap its number!</div>';
    var btnWrap = K.el('div', 'bm-pick-btns');

    var done = false, canvas = K.renderer.domElement, hover = null;

    boxes.forEach(function (b) {
      if (b.open) return;
      var nb = K.el('button', 'bm-num-btn', '🎁 ' + b.n);
      nb.style.setProperty('--bc', '#' + new T3.Color(b.colHex).getHexString());
      nb.onmouseenter = function () { b.hot = true; };
      nb.onmouseleave = function () { b.hot = false; };
      nb.onclick = function () { choose(b); };
      btnWrap.appendChild(nb);
    });
    pickBar.appendChild(btnWrap);

    function boxAt(e) {
      var r = canvas.getBoundingClientRect();
      mouse.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(mouse, K.camera);
      var hits = ray.intersectObjects(boxes.filter(function (b) { return !b.open; }).map(function (b) { return b.hit; }), false);
      return hits.length ? hits[0].object.userData.box : null;
    }
    function onMove(e) {
      var b = boxAt(e);
      if (hover && hover !== b) hover.hot = false;
      hover = b;
      if (b) b.hot = true;
      canvas.style.cursor = b ? 'pointer' : '';
    }
    function onTap(e) {
      var b = boxAt(e);
      if (b) choose(b);
    }
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onTap);

    function choose(b) {
      if (done || b.open) return;
      done = true;
      pickMode = false;
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onTap);
      canvas.style.cursor = '';
      pickBar.remove();
      boxes.forEach(function (x) { x.hot = false; });
      K.sfx('pop');
      b.hot = true;
      K.after(.3, function () {
        b.hot = false;
        decideOwner(team, b);
      });
    }
    if (K.DEMO) {
      K.after(.9, function () {
        var left = boxes.filter(function (b) { return !b.open; });
        if (left.length) choose(left[(Math.random() * left.length) | 0]);
      });
    }
  }

  /* ---- Keep it or Give it: decide BEFORE the box opens ---- */
  function decideOwner(team, b) {
    if (MODE !== 'keepgive') return openBox(b, team, team, false);
    phase = 'keepgive';
    window.__k3phase = 'keepgive';
    shot('box', b);
    b.shake = .45;
    K.say('Keep it, or give it?');
    updateTurnUI(active, 'Box #' + b.n + ': Keep it or Give it away?');
    var giver = team;
    var choices = [{ label: '🎁 KEEP IT! (' + team.name + ')', value: -1, color: team.c }].concat(
      TEAMS.filter(function (t) { return t !== team; }).map(function (t) {
        return { label: '➡️ GIVE TO ' + t.name.toUpperCase() + '!', value: TEAMS.indexOf(t), color: t.c };
      })
    );
    K.ui.choose('Box #' + b.n + ' is shaking! Keep it or give it away?', choices, {
      color: team.c,
      demo: function () {
        return Math.random() < .5 ? -1 : TEAMS.indexOf(TEAMS.filter(function (t) { return t !== team; })[0]);
      }
    }).then(function (v) {
      b.shake = 0;
      var owner = v < 0 ? team : TEAMS[v];
      if (v >= 0) {
        K.ui.toast('🎀 Team ' + team.name + ' gives Box #' + b.n + ' to Team ' + owner.name + '!', 1.8, owner.c);
        chars[v].setState('shrug');
      }
      openBox(b, owner, giver, v >= 0);
    });
  }

  /* ---- open the box: shake, flying lid, reveal ---- */
  function openBox(b, owner, giver, given) {
    phase = 'open';
    window.__k3phase = 'open';
    shot('box', b);
    b.shake = 1.35;
    owner.boxesOpened++;
    K.sfx('fuse');
    var top = b.holder.position.clone().add(V(0, .95, 0));

    K.after(1.1, function () {
      b.shake = 0;
      b.open = true;
      updateLiveBoxesUI();
      K.sfx('pop');
      spawnFlyingLid(top.clone(), b.colHex);
      K.fx.confetti(top.clone(), b.kind === 'bomb' ? 24 : 95);
      K.fx.puff(top.clone(), 7, { color: 0xffffff, size: .85 });
      b.spin.visible = false;
      b.glow.visible = false;
      if (b.kind === 'bomb') return bomb(b, owner);
      reveal(b, owner, giver, given);
    });
  }

  function leaveIcon(b) {
    var ic = iconTag(b.kind);
    ic.position.set(0, .82, 0);
    b.holder.add(ic);
    if (b.kind !== 'bomb' && coinPileProto && KINDS[b.kind].pts) {
      var cp = coinPileProto.clone(true);
      cp.position.set(0, .15, 0);
      b.holder.add(cp);
    }
  }

  function bomb(b, owner) {
    var oi = TEAMS.indexOf(owner), ch = chars[oi];
    owner.bombsHit++;
    var bm = bombProto ? bombProto.clone(true) : new T3.Mesh(new T3.SphereGeometry(.45, 24, 16), K.mat(0x3a3a48));
    if (bombProto) K.fitModel(bm, 1.05);
    else bm.position.y = .45;

    var g = new T3.Group();
    g.add(bm);

    // Glowing burning fuse spark sphere at top of bomb
    var fuseSpark = new T3.Mesh(
      new T3.SphereGeometry(.14, 12, 10),
      new T3.MeshBasicMaterial({ color: 0xffe066 })
    );
    fuseSpark.position.set(.12, .98, 0);
    g.add(fuseSpark);

    g.position.copy(b.holder.position).add(V(0, .2, 0));
    scene.add(g);

    var t0 = K.now;
    var fn = K.onFrame(function () {
      var u = K.now - t0;
      g.scale.setScalar(1 + u * .28 + .08 * Math.sin(u * 34));
      g.position.y = b.holder.position.y + .2 + Math.abs(Math.sin(u * 10)) * .14;
      fuseSpark.scale.setScalar(.8 + Math.sin(u * 45) * .35);
      if (Math.random() < .65) {
        K.fx.burst(g.position.clone().add(V(.12, 1.0, 0)), 2, { color: [0xffd84a, 0xff5f5f, 0xff9f38], speed: 3.2, size: .11, life: .32 });
      }
    });

    K.ui.big('💣 SIZZLE…', .95, true);
    K.say(KINDS.bomb.say);

    K.after(1.0, function () {
      K.offFrame(fn);
      scene.remove(g);
      // Hit-stop / slow-motion on cartoon bomb explosion!
      K.timeScale = 0.28;
      setTimeout(function () { K.timeScale = 1; }, 360);

      K.sfx('boom');
      K.cam.shake(.52);
      var p = b.holder.position.clone().add(V(0, .75, 0));
      spawnPoofCloud(p);
      K.fx.puff(p.clone(), 18, { color: 0x6b6b78, size: 1.65, life: 1.35, opacity: .78 });
      K.fx.ring(p.clone(), 0xff9f38, 6.5);
      K.fx.burst(p.clone(), 24, { color: [0x3a3a48, 0xffd84a, 0xff6f3c], speed: 7, size: .18, life: .75 });

      var lost = Math.min(5, owner.score);
      owner.score -= lost;
      if (lost) K.fx.text('💥 −' + lost, p.clone().add(V(0, 1.1, 0)), '#ff5f5f', 1.8);
      K.ui.big(lost ? '💥 BOOM! −' + lost : '💥 BOOM! (0 pts lost)', 1.5, true);

      ch.setState('dizzy');
      var stars = K.dizzyStars(ch.holder, ch.height + .32);
      shot('team', oi);
      hud.refresh(active);
      hud.bump(oi);
      leaveIcon(b);
      K.after(2.2, function () {
        stars.remove();
        ch.setState('idle');
        next();
      });
    });
  }

  function reveal(b, owner, giver, given) {
    var k = KINDS[b.kind], oi = TEAMS.indexOf(owner), ch = chars[oi];
    var p = b.holder.position.clone().add(V(0, 1.1, 0));
    var teamTargetPos = ch.holder.position.clone().add(V(0, 1.2, 0));
    K.sfx('correct');
    K.fx.ring(p.clone(), new T3.Color(k.color).getHex(), 4.5);
    K.say(k.say);
    leaveIcon(b);

    if (k.pts) {
      owner.score += k.pts;
      spawnBonusCoins(p.clone(), teamTargetPos, k.pts >= 20 ? 22 : 14);
      K.fx.text('⭐ ' + k.text, p.clone(), k.color, 1.8);
      K.ui.big('🌟 ' + k.text + ' Points!', 1.35, true);
      return reward(oi, ch);
    }
    if (b.kind === 'double') {
      var add = clamp(owner.score, 5, 30);
      owner.score += add;
      spawnFlyingCard('double', p.clone(), teamTargetPos);
      K.fx.text('✖️2 +' + add, p.clone(), k.color, 1.8);
      K.ui.big('✖️2 DOUBLE! +' + add, 1.5, true);
      return reward(oi, ch);
    }

    // Swap or Steal: fly the 3D Power Card out of the box!
    spawnFlyingCard(b.kind, p.clone(), teamTargetPos);
    K.fx.text(k.icon + ' ' + k.text, p.clone(), k.color, 1.75);
    K.ui.big(k.icon + ' ' + k.text, 1.25, true);

    var others = TEAMS.filter(function (t) { return t !== owner; });
    var target = given ? Promise.resolve(giver) : K.ui.choose(
      b.kind === 'swap' ? '🔄 Swap scores with which team?' : '🦊 Steal 5 points from which team?',
      others.map(function (t) { return { label: t.name + ' (' + t.score + ' ⭐)', value: TEAMS.indexOf(t), color: t.c }; }),
      {
        color: owner.c,
        demo: function () {
          return TEAMS.indexOf(others.slice().sort(function (a, c) { return c.score - a.score; })[0]);
        }
      }
    ).then(function (v) { return TEAMS[v]; });

    target.then(function (t) {
      var ti = TEAMS.indexOf(t);
      var otherPos = chars[ti].holder.position.clone().add(V(0, 1.2, 0));
      if (b.kind === 'swap') {
        var s = owner.score;
        owner.score = t.score;
        t.score = s;
        K.sfx('whoosh');
        spawnFlyingCard('swap', otherPos, teamTargetPos);
        K.ui.toast('🔄 Team ' + owner.name + ' and Team ' + t.name + ' swap scores!', 2.0, k.color);
        chars[ti].setState('hop');
        K.after(.8, function () { chars[ti].setState('idle'); });
      } else {
        var take = Math.min(5, t.score);
        t.score -= take;
        owner.score += take;
        K.sfx('whoosh');
        spawnBonusCoins(otherPos, teamTargetPos, 10);
        K.ui.toast('🦊 Team ' + owner.name + ' steals ' + take + ' ⭐ from Team ' + t.name + '!', 2.0, k.color);
        chars[ti].setState('sad');
        K.after(1.4, function () { chars[ti].setState('idle'); });
        hud.bump(ti);
      }
      reward(oi, ch);
    });
  }

  function reward(oi, ch) {
    shot('team', oi);
    ch.setState('cheer');
    hud.refresh(active);
    hud.bump(oi);
    K.fx.confetti(ch.holder.position.clone().add(V(0, 2.2, 0)), 75);
    K.after(2.2, function () {
      ch.setState('idle');
      next();
    });
  }

  function next() {
    hud.refresh(-1);
    updateLiveBoxesUI();
    if (opened() >= maxBoxesToOpen || opened() >= boxes.length) return finish();
    active = (active + 1) % TEAMS.length;
    turn();
  }

  /* ---------------- 3-step 3D victory podium & end screen ---------------- */
  function buildPodium3D(order) {
    while (podiumGroup.children.length) podiumGroup.remove(podiumGroup.children[0]);
    podiumGroup.visible = true;
    var stepSpecs = [
      { rank: 1, x: 0,    h: 1.22, w: 1.95, col: 0xffd84a },
      { rank: 2, x: -2.2, h: 0.85, w: 1.75, col: 0xdce4f2 },
      { rank: 3, x: 2.2,  h: 0.62, w: 1.75, col: 0xf0a868 },
      { rank: 4, x: 4.2,  h: 0.40, w: 1.55, col: 0xe9e2f5 }
    ];
    var pz = 3.8;
    order.forEach(function (ti, rk) {
      var sp = stepSpecs[rk] || stepSpecs[3], t = TEAMS[ti];
      var g = new T3.Group();
      g.position.set(sp.x, 0, pz);
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
      numLab.position.set(0, sp.h + 2.05, 0);
      g.add(numLab);

      if (rk === 0 && trophyModel) {
        var tr = trophyModel.clone(true);
        tr.scale.multiplyScalar(.52);
        tr.position.set(.60, sp.h + .05, .34);
        g.add(tr);
      }

      if (chars[ti]) {
        chars[ti].holder.children.forEach(function (c) { if (c.isSprite) c.visible = false; });
        chars[ti].holder.position.set(sp.x - (rk === 0 ? .12 : 0), sp.h + .06, pz);
        chars[ti].holder.rotation.set(0, 0, 0);
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

    var best = Math.max.apply(null, TEAMS.map(function (t) { return t.score; }));
    var winners = TEAMS.filter(function (t) { return t.score === best; });
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) {
      return (TEAMS[b].score - TEAMS[a].score) || (TEAMS[b].boxesOpened - TEAMS[a].boxesOpened);
    });

    buildPodium3D(order);
    shot('podium');
    K.sfx('win');
    K.fx.confetti(V(0, 4.8, 3.8), 240);
    var names = winners.map(function (t) { return t.name; }).join(' & ');
    K.ui.big(winners.length > 1 ? '🏆 ' + names + ' Tie!' : '🏆 Team ' + names + ' Wins!', 2.3, true);
    K.say(winners.length > 1 ? 'It is a tie!' : 'Team ' + names + ' wins!');

    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      var rowsHtml = order.map(function (ti, k) {
        var t = TEAMS[ti];
        return '<div class="bm-table-row" style="--c:' + t.c + '">' +
          '<span class="bm-rank">' + (k + 1) + '</span>' +
          '<b>' + t.name + '</b>' +
          '<span>🎁 ' + t.boxesOpened + ' box' + (t.boxesOpened === 1 ? '' : 'es') + (t.bombsHit ? ' · 💣×' + t.bombsHit : '') + '</span>' +
          '<i>' + t.score + ' ⭐</i>' +
        '</div>';
      }).join('');

      box.innerHTML =
        '<div class="say" style="--c:' + winners[0].c + ';font-size:1.42rem">🏆 ' + (winners.length > 1 ? 'Tie: ' + names : 'Team ' + names + ' Wins!') + '</div>' +
        '<div class="bm-table">' + rowsHtml + '</div>';

      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn green', '↻ Play again');
      again.onclick = function () { location.href = location.pathname + (MODE === 'keepgive' ? '?mode=keepgive' : ''); };
      var back = K.el('button', 'btn soft', '🏠 Back to games');
      back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again);
      rows.appendChild(back);
      box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'bomb3d', title: MODE === 'keepgive' ? 'Keep it or Give it 3D' : 'Bomb or Bonus 3D' });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Wrapping the mystery prize boxes…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'fair', skip: ['carousel', 'picnic-table', 'hot-air-balloon'] }).catch(function (e) { console.warn('world', e); K.world.ground(0xf3e2b8); return null; }) : Promise.resolve(null);
  var diamondP = K.tryGLB('models/box-diamond.glb').then(function (g) { if (g) giftProtos.diamond = g.scene; });
  var goldP = K.tryGLB('models/box-gold.glb').then(function (g) { if (g) giftProtos.gold = g.scene; });
  var silverP = K.tryGLB('models/box-silver.glb').then(function (g) { if (g) giftProtos.silver = g.scene; });
  var bronzeP = K.tryGLB('models/box-bronze.glb').then(function (g) { if (g) giftProtos.bronze = g.scene; });
  var giftP = K.tryGLB(K.ROOT + 'assets/3d/items/gift-box.glb').then(function (g) { if (g) giftProtos.gift = g.scene; });
  var bombP = K.tryGLB(K.ROOT + 'assets/3d/items/cartoon-bomb.glb').then(function (g) { if (g) bombProto = g.scene; });
  var coinP = K.tryGLB('models/coin-pile.glb').then(function (g) { if (g) coinPileProto = K.fitModel(g.scene, .85); });
  var trophyP = K.tryGLB('models/trophy.glb').then(function (g) { if (g) trophyModel = K.fitModel(g.scene, 1.35); });

  Promise.all([worldP, diamondP, goldP, silverP, bronzeP, giftP, bombP, coinP, trophyP].concat(
    ALL_TEAMS.map(function (t, i) { return K.makeCharacter(t, { kidsOnly: true, kid: i % 2 === 0 ? 'boy' : 'girl', kidHeight: 1.45 }); })
  )).then(function (res) {
    buildBoxes();
    res.slice(9).forEach(function (ch, i) {
      var h = new T3.Group();
      h.add(ch.root);
      scene.add(h);
      ch.holder = h;
      chars.push(ch);

      var ring = new T3.Mesh(
        new T3.RingGeometry(.55, .74, 32),
        new T3.MeshBasicMaterial({ color: ALL_TEAMS[i].hex })
      );
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);
      teamRings.push(ring);

      var lab = K.label(ALL_TEAMS[i].name, ALL_TEAMS[i].c);
      lab.scale.multiplyScalar(.68);
      lab.position.y = ch.height + .42;
      h.add(lab);
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
