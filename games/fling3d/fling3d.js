/* ============================================================================
   CAT VS DOG: ALLEY FLING 3D — English Adventure Academy (Commercial 3D Flagship)
   ----------------------------------------------------------------------------
   Runs on unified GameQualityCore (SceneAtmosphere, StylizedWater, JuiceManager)
   + kit3d.js (Remember First + Video, Speaking & Acting Cards, Units 1–5 Speaking,
     Smart Mix, Live Score Editor, Timer, Pick Qs, Blur/Zoom, Judge, Answer Cards,
     Exit Ticket, Real Pupil 3D Avatars, Class Board & 3D Home Island Bridge XP)
   + world3d.js (Adventure Park sunlit meadow & ocean backdrop).
   Gameplay:
   - True 3D backyard artillery skill duel across a 3D wooden garden fence!
   - ZERO auto-aim crutches & ZERO landing-ring cheat arcs (strictly ONE short
     4-dot 3D muzzle pointer at the hand!).
   - Hold & Pull-Back 3D Slingshot Stick directly on the 3D canvas (with live
     elastic band + hand tremor >80% power) OR 2-step Angle -> Power dock controls!
   - Dynamic 3D wind gusts + animated 3D windsock flag, shifting stances, 3D tin
     cans (+10), patrolling 3D cartoon wasp hazard, high-altitude spinning 3D Star
     Coin (+15), Headshot (+35), Direct Hit (+25), Yard Prop (+10), Knockout (+30)!
   ============================================================================ */
(function () {
  'use strict';

  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp;
  var V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var GQC = window.GameQualityCore || null;
  var IN_WORLD = !!K.World && !K.Q.has('noworld');

  K.init({ fov: 36, fogNear: 65, fogFar: 220 });
  var scene = K.scene;

  /* ---------------- GameQualityCore Sunlit Tropical Park Atmosphere ---------------- */
  K._gqcTheme = 'island';
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff4e0, 'island');
  K.world.lights();
  if (!GQC) K.world.clouds(14, -70, 70);
  if (!IN_WORLD) K.world.ground(0x6eb84c);

  /* ---------------- Teams & Settings ---------------- */
  var nTeams = clamp(+K.Q.get('teams') || 2, 2, 4);
  var totalTurns = clamp(+K.Q.get('rounds') || 10, 6, 16);
  var windMode = K.Q.get('wind') || 'normal';
  var DIFF_MAP = {
    easy:   { maxWind: 4.2, angleSpd: 1.4, powerSpd: 1.5, waspAmp: 0.45, waspSpd: 1.7, hitMul: 1.12, shift: 0.85 },
    normal: { maxWind: 6.8, angleSpd: 1.9, powerSpd: 2.05, waspAmp: 0.72, waspSpd: 2.3, hitMul: 1.0,  shift: 1.45 },
    gusty:  { maxWind: 9.2, angleSpd: 2.35, powerSpd: 2.5, waspAmp: 0.92, waspSpd: 3.0, hitMul: 0.90, shift: 1.95 }
  };
  var DIFF = DIFF_MAP[windMode] || DIFF_MAP.normal;

  var ALL_TEAMS = K.TEAMS.map(function (t) {
    return Object.assign({ score: 0, hp: 100, ko: 0 }, t);
  });
  var TEAMS = ALL_TEAMS.slice(0, nTeams);
  var QS = K.questions('g3-u5-mega');

  /* ---------------- 3D Arena Constants (Cat on Left -X, Dog on Right +X) ---------------- */
  var YARD_Y = 0.08;
  var FENCE_X = 0;
  var FENCE_H = 3.35;
  var FENCE_HALF_W = 0.36;
  var BASE_CAT_X = -6.8;
  var BASE_DOG_X = 6.8;
  var GRAV = 15.8;

  var arena = new T3.Group();
  scene.add(arena);

  var mStd = function (col, rough, metal) {
    return new T3.MeshStandardMaterial({ color: col, roughness: rough == null ? 0.65 : rough, metalness: metal || 0 });
  };
  function addShadow(obj, rx, rz, op) {
    if (GQC && GQC.Atmosphere && GQC.Atmosphere.addBlobShadow) {
      GQC.Atmosphere.addBlobShadow(obj, rx || 1.4, rz || rx || 1.4, op || 0.28, 0.025);
    }
  }

  /* ---------------- Build Rich 3D Dual-Backyard Arena (Zero Bare Pancakes!) ---------------- */
  var windsockGroup = new T3.Group();
  var windsockCones = [];
  var fenceCans = [];
  var bonusStarMesh = null;
  var waspGroup = new T3.Group();
  var waspWings = [];
  var doghouseGroup = new T3.Group();
  var yarnBasketGroup = new T3.Group();

  (function buildArena() {
    // Lush olive-meadow lawn platform with sunny sand border & stepping stones
    var lawnBorder = new T3.Mesh(new T3.BoxGeometry(26, 0.22, 13.5), mStd(0xf3cf8a, 0.82));
    lawnBorder.position.set(0, -0.05, 0);
    lawnBorder.receiveShadow = true;
    arena.add(lawnBorder);

    var lawn = new T3.Mesh(new T3.BoxGeometry(24.6, 0.16, 12.2), mStd(0x6eb84c, 0.85));
    lawn.position.set(0, 0.0, 0);
    lawn.receiveShadow = true;
    arena.add(lawn);

    // Alternating mowed grass stripes for depth & distance readability at 4m
    for (var st = -5; st <= 5; st++) {
      var stripe = new T3.Mesh(new T3.PlaneGeometry(2.1, 11.8), mStd(st % 2 === 0 ? 0x62ab42 : 0x76c253, 0.9));
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(st * 2.2, YARD_Y + 0.005, 0);
      stripe.receiveShadow = true;
      arena.add(stripe);
    }

    // Center 3D Wooden Dividing Fence (Timber posts + horizontal rails + planks + beveled cap)
    var fenceGrp = new T3.Group();
    arena.add(fenceGrp);
    var woodDark = mStd(0x8c5222, 0.78), woodMid = mStd(0xc9823c, 0.72), woodCap = mStd(0xedb468, 0.62);

    // Tall center hero post where cans & windsock sit (z = 0 play plane)
    var heroPost = new T3.Mesh(new T3.BoxGeometry(0.68, FENCE_H, 0.68), woodMid);
    heroPost.position.set(0, YARD_Y + FENCE_H / 2, 0);
    heroPost.castShadow = heroPost.receiveShadow = true;
    fenceGrp.add(heroPost);

    var heroCap = new T3.Mesh(new T3.BoxGeometry(0.96, 0.24, 0.96), woodCap);
    heroCap.position.set(0, YARD_Y + FENCE_H + 0.06, 0);
    heroCap.castShadow = true;
    fenceGrp.add(heroCap);

    // Side picket planks running back & front along Z so the yard feels genuinely divided in 3D
    for (var pz = -5.0; pz <= 3.6; pz += 0.65) {
      if (Math.abs(pz) < 0.55) continue;
      var plankH = 2.45 + (Math.abs(pz) < 1.8 ? 0.35 : 0);
      var plank = new T3.Mesh(new T3.BoxGeometry(0.24, plankH, 0.48), (Math.round(pz * 2) % 2 === 0) ? woodMid : woodDark);
      plank.position.set(0, YARD_Y + plankH / 2, pz);
      plank.castShadow = plank.receiveShadow = true;
      fenceGrp.add(plank);
    }
    // Cross-rails
    [0.85, 1.95].forEach(function (ry) {
      var rail = new T3.Mesh(new T3.BoxGeometry(0.32, 0.16, 8.8), woodDark);
      rail.position.set(0, YARD_Y + ry, -0.7);
      rail.castShadow = true;
      fenceGrp.add(rail);
    });

    // Rear garden perimeter fence behind the arena (z = -5.6)
    for (var bx = -11.5; bx <= 11.5; bx += 1.0) {
      var bp = new T3.Mesh(new T3.BoxGeometry(0.74, 1.9, 0.18), mStd(0xd99b52, 0.78));
      bp.position.set(bx, YARD_Y + 0.95, -5.6);
      bp.castShadow = bp.receiveShadow = true;
      arena.add(bp);
    }

    // Animated 3D Striped Windsock mounted on the Center Fence Post
    windsockGroup.position.set(0, YARD_Y + FENCE_H - 0.55, 0.42);
    var sockPole = new T3.Mesh(new T3.CylinderGeometry(0.04, 0.04, 0.55, 8), mStd(0xfff8ec, 0.4));
    sockPole.rotation.x = Math.PI / 2;
    sockPole.position.z = -0.15;
    windsockGroup.add(sockPole);
    for (var si = 0; si < 4; si++) {
      var seg = new T3.Mesh(
        new T3.CylinderGeometry(0.18 - si * 0.032, 0.21 - si * 0.032, 0.34, 12, 1, true),
        new T3.MeshStandardMaterial({ color: si % 2 === 0 ? 0xff5fa2 : 0xffffff, roughness: 0.45, side: T3.DoubleSide })
      );
      seg.rotation.z = Math.PI / 2;
      seg.position.x = 0.25 + si * 0.32;
      windsockGroup.add(seg);
      windsockCones.push(seg);
    }
    arena.add(windsockGroup);

    // 3D Yarn Basket Prop (Cat's Yard, left behind Cat)
    yarnBasketGroup.position.set(-9.4, YARD_Y, -0.2);
    var bsk = new T3.Mesh(new T3.CylinderGeometry(0.78, 0.58, 0.72, 16), mStd(0xd99b52, 0.75));
    bsk.position.y = 0.36; bsk.castShadow = true; yarnBasketGroup.add(bsk);
    var bskRim = new T3.Mesh(new T3.TorusGeometry(0.76, 0.09, 10, 20), mStd(0x8c5222, 0.7));
    bskRim.rotation.x = Math.PI / 2; bskRim.position.y = 0.72; yarnBasketGroup.add(bskRim);
    [[0, 0.85, 0, 0xff5fa2], [-0.32, 0.78, 0.24, 0xffb320], [0.34, 0.78, -0.18, 0x9b7bff]].forEach(function (y) {
      var yb = new T3.Mesh(new T3.SphereGeometry(0.32, 16, 14), mStd(y[3], 0.55));
      yb.position.set(y[0], y[1], y[2]); yb.castShadow = true; yarnBasketGroup.add(yb);
    });
    addShadow(yarnBasketGroup, 1.5, 1.5, 0.3);
    arena.add(yarnBasketGroup);

    // 3D Wooden Doghouse Prop (Dog's Yard, right behind Dog — scaled 1.35x!)
    doghouseGroup.position.set(9.6, YARD_Y, -0.4);
    var dhBody = new T3.Mesh(new T3.BoxGeometry(1.85, 1.45, 1.75), mStd(0xf3cf8a, 0.72));
    dhBody.position.y = 0.72; dhBody.castShadow = dhBody.receiveShadow = true; doghouseGroup.add(dhBody);
    var dhRoof = new T3.Mesh(new T3.ConeGeometry(1.58, 0.95, 4), mStd(0xe63946, 0.55));
    dhRoof.rotation.y = Math.PI / 4; dhRoof.position.y = 1.92; dhRoof.castShadow = true; doghouseGroup.add(dhRoof);
    var dhDoor = new T3.Mesh(new T3.BoxGeometry(0.68, 0.92, 0.14), mStd(0x2b1d40, 0.9));
    dhDoor.position.set(0, 0.46, 0.84); doghouseGroup.add(dhDoor);
    addShadow(doghouseGroup, 2.2, 2.2, 0.32);
    arena.add(doghouseGroup);

    // 3D Patrolling Cartoon Wasp above the Fence
    var waspBody = new T3.Mesh(new T3.SphereGeometry(0.36, 16, 14), mStd(0xffd43b, 0.35));
    waspBody.scale.set(1.35, 0.92, 0.92); waspBody.castShadow = true; waspGroup.add(waspBody);
    [-0.14, 0.14].forEach(function (sx) {
      var band = new T3.Mesh(new T3.CylinderGeometry(0.33, 0.33, 0.11, 14), mStd(0x2b1d40, 0.5));
      band.rotation.z = Math.PI / 2; band.position.x = sx; waspGroup.add(band);
    });
    [-0.16, 0.16].forEach(function (ez) {
      var eye = new T3.Mesh(new T3.SphereGeometry(0.09, 10, 10), mStd(0xffffff, 0.2));
      eye.position.set(-0.36, 0.10, ez); waspGroup.add(eye);
      var pup = new T3.Mesh(new T3.SphereGeometry(0.045, 8, 8), mStd(0x2b1d40, 0.2));
      pup.position.set(-0.43, 0.10, ez); waspGroup.add(pup);
    });
    [-1, 1].forEach(function (side) {
      var wing = new T3.Mesh(
        new T3.SphereGeometry(0.28, 12, 10),
        new T3.MeshStandardMaterial({ color: 0xe6f7ff, transparent: true, opacity: 0.78, roughness: 0.15 })
      );
      wing.scale.set(0.65, 0.14, 1.45);
      wing.position.set(0.02, 0.30, side * 0.28);
      waspGroup.add(wing);
      waspWings.push(wing);
    });
    waspGroup.position.set(0, 4.75, 0);
    arena.add(waspGroup);

    // 3D High-Altitude Spinning Golden Star Coin (+15 Bonus!)
    bonusStarMesh = new T3.Mesh(
      new T3.CylinderGeometry(0.56, 0.56, 0.16, 20),
      new T3.MeshStandardMaterial({ color: 0xffd43b, emissive: 0xff9f1c, emissiveIntensity: 0.28, roughness: 0.22, metalness: 0.55 })
    );
    bonusStarMesh.rotation.x = Math.PI / 2;
    bonusStarMesh.position.set(0, 6.25, 0);
    bonusStarMesh.castShadow = true;
    arena.add(bonusStarMesh);

    // Load Real 3D Cottages, Flower Gardens, Flagpoles & Stylized Perimeter Trees (Zero Bare Pancakes!)
    var gltfLoader = new T3.GLTFLoader();
    function placeGLB(path, x, y, z, targetH, ry) {
      gltfLoader.load(K.ROOT + path, function (gl) {
        var m = gl.scene;
        var box = new T3.Box3().setFromObject(m);
        var h = Math.max(0.1, box.max.y - box.min.y);
        var sc = targetH / h;
        m.scale.setScalar(sc);
        m.position.set(x, y - box.min.y * sc, z);
        m.rotation.y = ry || 0;
        m.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        arena.add(m);
      }, undefined, function () {});
    }
    placeGLB('assets/3d/home/harbour-house.glb', -11.4, YARD_Y, -5.2, 4.8, 0.42);
    placeGLB('assets/3d/home/harbour-house.glb',  11.4, YARD_Y, -5.2, 4.8, -0.42);
    placeGLB('assets/3d/home/flower-garden.glb',  -5.6, YARD_Y, -4.6, 1.35, 0.1);
    placeGLB('assets/3d/home/flower-garden.glb',   5.6, YARD_Y, -4.6, 1.35, -0.1);
    placeGLB('assets/3d/home/team-flagpole.glb',  -10.2, YARD_Y, 3.6, 4.4, 0.3);
    placeGLB('assets/3d/home/team-flagpole.glb',   10.2, YARD_Y, 3.6, 4.4, -0.3);

    // Swaying stylized park trees along the back ridge
    [[-14.5, -3.5], [-8.0, -7.8], [0, -8.5], [8.0, -7.8], [14.5, -3.5]].forEach(function (tp, idx) {
      var tree = new T3.Group();
      var trunk = new T3.Mesh(new T3.CylinderGeometry(0.24, 0.36, 2.2, 10), mStd(0x8c5828, 0.85));
      trunk.position.y = 1.1; trunk.castShadow = true; tree.add(trunk);
      var crown = new T3.Mesh(new T3.DodecahedronGeometry(1.45, 1), mStd(idx % 2 ? 0x5ab040 : 0x6eb84c, 0.72));
      crown.position.y = 2.85; crown.scale.set(1.1, 0.95, 1.1); crown.castShadow = true; tree.add(crown);
      tree.position.set(tp[0], YARD_Y, tp[1]);
      arena.add(tree);
    });
  })();

  /* ---------------- Stylized 3D Cat (Left) & 3D Dog (Right) + 3D Team Monsters ---------------- */
  function buildStylizedAnimal(kind, teamColorHex) {
    var root = new T3.Group();
    var isCat = kind === 'cat';
    var mainCol = isCat ? 0xff8c2b : 0xd99b52;
    var bellyCol = isCat ? 0xfff3de : 0xfff6e5;
    var earCol = isCat ? 0xff7014 : 0x8c5222;

    // Rounded torso
    var body = new T3.Mesh(new T3.SphereGeometry(0.68, 20, 16), mStd(mainCol, 0.52));
    body.scale.set(0.95, 1.12, 0.88);
    body.position.y = 0.84;
    body.castShadow = true;
    root.add(body);

    var belly = new T3.Mesh(new T3.SphereGeometry(0.46, 16, 14), mStd(bellyCol, 0.6));
    belly.position.set(isCat ? 0.28 : -0.28, 0.78, 0);
    root.add(belly);

    // Collar in team color
    var collar = new T3.Mesh(new T3.TorusGeometry(0.48, 0.08, 10, 20), mStd(teamColorHex, 0.35));
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.38;
    root.add(collar);

    // Expressive Head Group (tracks target / wobbles when dizzy!)
    var head = new T3.Group();
    head.position.set(0, 1.88, 0);
    root.add(head);

    var skull = new T3.Mesh(new T3.SphereGeometry(0.62, 22, 18), mStd(mainCol, 0.48));
    skull.scale.set(1.04, 0.96, 1.0);
    skull.castShadow = true;
    head.add(skull);

    // Snout / cheeks
    var snout = new T3.Mesh(new T3.SphereGeometry(0.28, 14, 12), mStd(bellyCol, 0.55));
    snout.scale.set(1.1, 0.78, 1.15);
    snout.position.set(isCat ? 0.46 : -0.46, -0.10, 0);
    head.add(snout);

    var nose = new T3.Mesh(new T3.SphereGeometry(0.11, 10, 10), mStd(isCat ? 0xff5fa2 : 0x2b1d40, 0.25));
    nose.position.set(isCat ? 0.68 : -0.68, -0.02, 0);
    head.add(nose);

    // Big glossy cartoon eyes
    [-0.22, 0.22].forEach(function (ez) {
      var ew = new T3.Mesh(new T3.SphereGeometry(0.14, 12, 12), mStd(0xffffff, 0.15));
      ew.position.set(isCat ? 0.48 : -0.48, 0.14, ez);
      head.add(ew);
      var ep = new T3.Mesh(new T3.SphereGeometry(0.08, 10, 10), mStd(0x2b1d40, 0.1));
      ep.position.set(isCat ? 0.58 : -0.58, 0.14, ez);
      head.add(ep);
    });

    // Ears (pointed triangles for Cat, floppy rounded ears for Dog)
    [-0.36, 0.36].forEach(function (ez) {
      if (isCat) {
        var ear = new T3.Mesh(new T3.ConeGeometry(0.22, 0.48, 12), mStd(earCol, 0.5));
        ear.position.set(-0.04, 0.56, ez);
        ear.rotation.x = ez > 0 ? 0.24 : -0.24;
        ear.castShadow = true;
        head.add(ear);
      } else {
        var dear = new T3.Mesh(new T3.SphereGeometry(0.24, 12, 12), mStd(earCol, 0.55));
        dear.scale.set(0.65, 1.55, 0.75);
        dear.position.set(0.10, 0.12, ez * 1.45);
        dear.rotation.x = ez > 0 ? 0.22 : -0.22;
        dear.castShadow = true;
        head.add(dear);
      }
    });

    // Paws & animated Tail
    [-0.28, 0.28].forEach(function (pz) {
      var foot = new T3.Mesh(new T3.SphereGeometry(0.24, 12, 10), mStd(bellyCol, 0.6));
      foot.scale.set(1.25, 0.65, 0.9);
      foot.position.set(0, 0.16, pz);
      foot.castShadow = true;
      root.add(foot);
    });

    var tail = new T3.Mesh(new T3.CylinderGeometry(0.09, 0.14, 0.95, 10), mStd(earCol, 0.55));
    tail.position.set(isCat ? -0.68 : 0.68, 0.85, 0);
    tail.rotation.z = isCat ? 0.65 : -0.65;
    tail.castShadow = true;
    root.add(tail);

    // Dizzy spinning stars ring above head (visible on hit!)
    var dizzyRing = new T3.Group();
    dizzyRing.position.set(0, 2.75, 0);
    dizzyRing.visible = false;
    for (var s = 0; s < 3; s++) {
      var st = new T3.Mesh(new T3.OctahedronGeometry(0.17, 0), new T3.MeshStandardMaterial({ color: 0xffd43b, emissive: 0xffb320, emissiveIntensity: 0.45 }));
      var a = (s / 3) * Math.PI * 2;
      st.position.set(Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62);
      dizzyRing.add(st);
    }
    root.add(dizzyRing);

    // Ground spotlight ring
    var ring = new T3.Mesh(
      new T3.RingGeometry(0.95, 1.24, 32),
      new T3.MeshBasicMaterial({ color: teamColorHex, side: T3.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    root.add(ring);

    addShadow(root, 1.8, 1.8, 0.32);
    arena.add(root);
    return { root: root, head: head, tail: tail, dizzyRing: dizzyRing, ring: ring, x: isCat ? BASE_CAT_X : BASE_DOG_X, dizzyUntil: 0, state: 'idle' };
  }

  var fighters = [
    buildStylizedAnimal('cat', TEAMS[0].hex),
    buildStylizedAnimal('dog', TEAMS[1].hex)
  ];
  fighters[0].root.position.set(BASE_CAT_X, YARD_Y, 0);
  fighters[1].root.position.set(BASE_DOG_X, YARD_Y, 0);

  // Real 3D Team Monsters & 3D Class Kids cheering alongside Cat & Dog!
  var coaches = [null, null];
  function loadCoaches() {
    if (!K.makeCharacter) return Promise.resolve();
    var ps = [0, 1].map(function (idx) {
      return K.makeCharacter(TEAMS[idx], { monHeight: 1.35, kidHeight: 1.48 }).then(function (ch) {
        if (!ch || !ch.root) return;
        var h = new T3.Group();
        h.add(ch.root);
        h.position.set(idx === 0 ? -8.4 : 8.4, YARD_Y, -2.2);
        h.rotation.y = idx === 0 ? 0.55 : -0.55;
        addShadow(h, 1.1, 1.1, 0.28);
        arena.add(h);
        ch.holder = h;
        coaches[idx] = ch;
      }).catch(function () {});
    });
    return Promise.all(ps);
  }

  /* ---------------- 3D Short Muzzle Aim Pointer (STRICTLY 1 Short Pointer — NO Cheat Arc!) ---------------- */
  var aimGroup = new T3.Group();
  aimGroup.visible = false;
  var muzzleDots = [];
  for (var di = 0; di < 4; di++) {
    var dot = new T3.Mesh(
      new T3.SphereGeometry(0.18 - di * 0.024, 14, 12),
      new T3.MeshStandardMaterial({ color: di === 3 ? 0xffb320 : 0xffffff, emissive: di === 3 ? 0xffb320 : 0x4f9dff, emissiveIntensity: 0.35 })
    );
    aimGroup.add(dot);
    muzzleDots.push(dot);
  }
  // Elastic 3D Slingshot Rubber Band shown during drag-pull
  var bandGeo = new T3.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0), V(0, 0, 0)]);
  var bandLine = new T3.Line(bandGeo, new T3.LineBasicMaterial({ color: 0xff5fa2, linewidth: 3 }));
  bandLine.visible = false;
  aimGroup.add(bandLine);
  arena.add(aimGroup);

  /* ---------------- 3D Tin Cans on Fence Cap (1.35x Readable & Destructible!) ---------------- */
  function spawnTinCans() {
    fenceCans.forEach(function (c) { arena.remove(c.mesh); });
    fenceCans = [];
    var specs = [
      { x: -0.24, y: YARD_Y + FENCE_H + 0.44, col: 0xff5fa2 },
      { x:  0.24, y: YARD_Y + FENCE_H + 0.44, col: 0x4f9dff },
      { x:  0.00, y: YARD_Y + FENCE_H + 0.98, col: 0xffb320 }
    ];
    specs.forEach(function (sp) {
      var g = new T3.Group();
      var body = new T3.Mesh(new T3.CylinderGeometry(0.20, 0.20, 0.52, 16), mStd(sp.col, 0.32, 0.2));
      body.castShadow = true; g.add(body);
      var lbl = new T3.Mesh(new T3.CylinderGeometry(0.206, 0.206, 0.18, 16), mStd(0xffffff, 0.5));
      g.add(lbl);
      g.position.set(sp.x, sp.y, 0);
      arena.add(g);
      fenceCans.push({ mesh: g, vx: 0, vy: 0, vz: 0, rx: 0, rz: 0, hit: false, col: sp.col });
    });
  }

  /* ---------------- 3D Projectiles (Yarn Ball for Cat, Bone for Dog) ---------------- */
  var projs = [];
  function createProjectileMesh(isCat, scale) {
    var g = new T3.Group();
    if (isCat) {
      var ball = new T3.Mesh(new T3.SphereGeometry(0.38, 18, 16), mStd(0xff5fa2, 0.55));
      ball.castShadow = true; g.add(ball);
      for (var k = 0; k < 3; k++) {
        var wrap = new T3.Mesh(new T3.TorusGeometry(0.38, 0.045, 8, 20), mStd(k === 0 ? 0xffb320 : 0xffffff, 0.5));
        wrap.rotation.set(k * 0.9, k * 1.1, 0);
        g.add(wrap);
      }
    } else {
      var shaft = new T3.Mesh(new T3.CylinderGeometry(0.13, 0.13, 0.72, 12), mStd(0xfff8ec, 0.4));
      shaft.rotation.z = Math.PI / 2; shaft.castShadow = true; g.add(shaft);
      [[-0.36, 0.12], [-0.36, -0.12], [0.36, 0.12], [0.36, -0.12]].forEach(function (kn) {
        var knob = new T3.Mesh(new T3.SphereGeometry(0.16, 12, 10), mStd(0xfff8ec, 0.4));
        knob.position.set(kn[0], kn[1], 0); knob.castShadow = true; g.add(knob);
      });
    }
    g.scale.setScalar(scale || 1);
    arena.add(g);
    return g;
  }

  /* ---------------- Game State & Camera Choreography ---------------- */
  var phase = 'title'; // 'title' | 'wait' | 'question' | 'aim' | 'fly' | 'payoff' | 'end'
  var turn = 0;        // 0 = Cat side, 1 = Dog side
  var teamIdxForSide = [0, 1];
  var turnCount = 0;
  var wind = 0;
  var windPhase = 0;
  var activePower = null;
  var teamPowers = [{ giant: 1, double: 1, bouncy: 1 }, { giant: 1, double: 1, bouncy: 1 }];
  var bonusStarHit = false;
  var waspCooldown = 0;

  var aim = { sub: 'angle', angleDeg: 45, oscA: 0, power: 0.25, oscP: -Math.PI / 2, dragging: false, startX: 0, startY: 0, curX: 0, curY: 0, holdTime: 0 };
  var roundPts = 0, roundTags = [], hitOpp = false, missTip = '';

  function shot(name, side) {
    K.cam.follow = null;
    if (name === 'title')    K.cam.set(V(0, 5.2, 18.5), V(0, 2.2, 0), 3.5);
    if (name === 'wide')     K.cam.set(V(0, 5.4, 17.6), V(0, 2.35, 0), 4.0);
    if (name === 'question') K.cam.set(V(0, 6.2, 18.8), V(0, 1.35, 0), 4.5); // Frames live 3D arena cleanly above .qcard!
    if (name === 'aim')      K.cam.set(V(side === 0 ? -2.2 : 2.2, 4.9, 16.4), V(side === 0 ? -1.4 : 1.4, 2.5, 0), 4.8);
    if (name === 'impact')   K.cam.set(V(side === 0 ? -4.2 : 4.2, 3.8, 10.6), V(fighters[side].x, 1.8, 0), 6.5);
    if (name === 'end')      K.cam.set(V(0, 4.2, 12.8), V(0, 2.0, 0), 3.6);
  }

  function resetTurnEnv() {
    var sgn = Math.random() < 0.5 ? -1 : 1;
    wind = sgn * rnd(DIFF.maxWind * 0.30, DIFF.maxWind);
    windPhase = Math.random() * 6.28;

    fighters[0].x = clamp(BASE_CAT_X + rnd(-DIFF.shift, DIFF.shift), -8.2, -4.8);
    fighters[1].x = clamp(BASE_DOG_X + rnd(-DIFF.shift, DIFF.shift),  4.8,  8.2);
    fighters[0].root.position.x = fighters[0].x;
    fighters[1].root.position.x = fighters[1].x;

    bonusStarHit = false;
    bonusStarMesh.visible = true;
    bonusStarMesh.position.set(rnd(-0.8, 0.8), 6.25, 0);
    waspCooldown = 0;
    spawnTinCans();
    updateHud();
  }

  /* ---------------- HUD & 3-Step How-to-Play Modal ---------------- */
  var hudTop = null, bannerEl = null, windEl = null, scoresEl = null, dockEl = null;

  var HOWTO_STEPS = [
    { ico: '🎤', c: '#ff5fa2', t: '1. Answer to Load!', s: 'Answer the English or Speaking question to load Cat\'s yarn ball or Dog\'s bone!' },
    { ico: '🎯', c: '#4f9dff', t: '2. Aim & Pull Slingshot!', s: 'Check the 3D windsock flag, then drag back on the screen (or tap Lock Angle & Fire) to throw over the fence!' },
    { ico: '💥', c: '#2fc58a', t: '3. Bonk & Score Big!', s: 'Dodge the buzzing 3D wasp, smash tin cans (+10), grab the Star (+15), and score Headshots (+35)!' }
  ];
  function openHowTo(onClose) {
    var old = document.querySelector('.fl-howto-modal'); if (old) old.remove();
    var m = K.ui.add(K.el('div', 'fl-howto-modal'));
    var card = K.el('div', 'fl-howto-card');
    card.innerHTML = '<h2 style="margin:0;font-size:1.55rem">🐱🐶 How to Play Cat vs Dog 3D</h2>';
    var grid = K.el('div', 'fl-howto-steps');
    HOWTO_STEPS.forEach(function (st) {
      var b = K.el('div', 'fl-step'); b.style.setProperty('--sc', st.c);
      b.innerHTML = '<div class="fl-step-ico">' + st.ico + '</div><b>' + st.t + '</b><p>' + st.s + '</p>';
      var sb = K.el('button', 'fl-step-say', '🔊 Listen');
      sb.onclick = function () { K.sfx('hello'); K.say(st.s); };
      b.appendChild(sb); grid.appendChild(b);
    });
    card.appendChild(grid);
    var go = K.el('button', 'btn green', '👍 Got it! Let\'s Fling!');
    go.onclick = function () {
      try { localStorage.setItem('eaa_howto_fling3d_v1', '1'); } catch (e) {}
      m.remove();
      if (onClose) onClose();
    };
    card.appendChild(go); m.appendChild(card);
    K.say('How to play Cat versus Dog 3D! Step 1: Answer the question. Step 2: Check the wind flag and pull back to fling over the fence. Step 3: Dodge the wasp and bonk your rival!');
  }

  function buildHud() {
    if (hudTop) hudTop.remove();
    if (scoresEl) scoresEl.remove();
    if (dockEl) dockEl.remove();

    hudTop = K.ui.add(K.el('div', 'fl-hud-top'));
    bannerEl = K.el('div', 'fl-banner');
    windEl = K.el('div', 'fl-wind-pill');
    hudTop.appendChild(bannerEl);
    hudTop.appendChild(windEl);

    scoresEl = K.ui.add(K.el('div', 'fl-scores'));
    dockEl = K.ui.add(K.el('div', 'fl-dock hidden'));
    updateHud();
  }

  function formatWindText() {
    var lvl = Math.max(1, Math.min(10, Math.round(Math.abs(wind) / 0.92)));
    return wind < 0 ? ('◄◄ WIND ' + lvl + ' LEFT') : ('WIND ' + lvl + ' RIGHT ►►');
  }

  function updateHud(titleText, subText) {
    if (!bannerEl || !windEl || !scoresEl) return;
    var activeTeam = TEAMS[teamIdxForSide[turn]] || TEAMS[turn];
    if (titleText) {
      bannerEl.style.setProperty('--c', activeTeam.c);
      bannerEl.style.setProperty('--cd', activeTeam.d || activeTeam.c);
      bannerEl.innerHTML = '<span>' + titleText + '</span>' + (subText ? '<small>' + subText + '</small>' : '');
    }
    var frac = clamp(wind / 9.2, -1, 1);
    var wPct = Math.abs(frac) * 50;
    var leftPct = frac >= 0 ? 50 : (50 - wPct);
    windEl.innerHTML =
      '<span>💨 ' + formatWindText() + '</span>' +
      '<div class="fl-wind-track"><div class="fl-wind-fill" style="left:' + leftPct.toFixed(1) + '%;width:' + wPct.toFixed(1) + '%;background:' + (frac >= 0 ? '#ffb320' : '#4f9dff') + '"></div><div class="fl-wind-mid"></div></div>';

    scoresEl.innerHTML = '';
    [0, 1].forEach(function (side) {
      var tm = TEAMS[teamIdxForSide[side]] || TEAMS[side];
      var hp = clamp(tm.hp != null ? tm.hp : 100, 0, 100);
      var distM = Math.round(Math.abs(fighters[side].x) * 6.5);
      var card = K.el('div', 'fl-card' + (side === turn && phase !== 'title' && phase !== 'end' ? ' active' : ''));
      card.style.setProperty('--c', tm.c);
      card.style.setProperty('--cd', tm.d || tm.c);
      card.innerHTML =
        '<div class="fl-card-row"><span>' + (side === 0 ? '🐱 ' : '🐶 ') + tm.name + '</span><span class="fl-pts">' + tm.score + '</span></div>' +
        '<div class="fl-hp-track"><div class="fl-hp-fill" style="width:' + hp + '%;background:' + (hp > 50 ? '#2fc58a' : hp > 25 ? '#ffb320' : '#ff5fa2') + '"></div></div>' +
        '<div class="fl-sub"><span>' + (side === 0 ? 'Cat Yard' : 'Dog Yard') + '</span><span>' + distM + 'm from fence</span></div>';
      scoresEl.appendChild(card);
    });
  }

  /* ---------------- Launch Physics & 3D Throw ---------------- */
  function throwOrigin(side) {
    return V(fighters[side].x + (side === 0 ? 0.85 : -0.85), YARD_Y + 1.55, 0);
  }

  function fireThrow(angleDeg, powerFrac) {
    if (phase !== 'aim') return;
    phase = 'fly';
    window.__k3phase = 'fly';
    aimGroup.visible = false;
    dockEl.classList.add('hidden');
    aim.dragging = false;

    var orig = throwOrigin(turn);
    var dir = turn === 0 ? 1 : -1;
    var pwr = activePower;
    if (pwr && teamPowers[turn][pwr] > 0) teamPowers[turn][pwr]--;

    var overcharged = powerFrac > 0.94;
    var adjA = clamp(angleDeg + (overcharged ? rnd(-7, 7) : 0), 18, 78);
    var adjP = clamp(powerFrac * (overcharged ? rnd(0.84, 1.06) : 1), 0.14, 1.05);
    var rad = adjA * Math.PI / 180;
    var spd = 9.5 + adjP * 11.4; // 11 .. 21 m/s cleanly clears 3.35m fence!

    if (GQC && GQC.Juice) {
      GQC.Juice.squashStretch(fighters[turn].root, 1.24, 0.82, 1.24, 0.22);
      GQC.Juice.spawnBurst(scene, orig, 'dust', 10);
      if (overcharged) GQC.Juice.popupScore('⚠️ OVERCHARGE SLIP!', orig.clone().add(V(0, 1.0, 0)), K.camera, '#ff5fa2', 1.05);
    }
    K.sfx('whoosh');

    projs.forEach(function (p) { arena.remove(p.mesh); });
    projs = [];

    var specs = (pwr === 'double')
      ? [{ da: -4.5, dp: -0.04, sc: 0.88, gMul: 1.0, b: 0 }, { da: 4.5, dp: 0.04, sc: 0.88, gMul: 1.0, b: 0 }]
      : [{ da: 0, dp: 0, sc: pwr === 'giant' ? 1.48 : 1.0, gMul: pwr === 'giant' ? 1.15 : 1.0, b: pwr === 'bouncy' ? 2 : 0 }];

    specs.forEach(function (sp) {
      var aR = clamp(adjA + sp.da, 16, 80) * Math.PI / 180;
      var sV = 9.5 + clamp(adjP + sp.dp, 0.14, 1.06) * 11.4;
      var m = createProjectileMesh(turn === 0, sp.sc);
      m.position.copy(orig);
      projs.push({
        mesh: m,
        pos: orig.clone(),
        vel: V(Math.cos(aR) * sV * dir, Math.sin(aR) * sV, 0),
        r: 0.42 * sp.sc,
        scale: sp.sc,
        gMul: sp.gMul,
        power: pwr,
        bounces: sp.b,
        done: false
      });
    });

    updateHud((turn === 0 ? '🧶 Flying Yarn!' : '🦴 Flying Bone!'), Math.round(adjA) + '° · ' + Math.round(adjP * 100) + '% PWR');
    shot('wide');
  }

  function awardHit(pts, label, worldPos, col) {
    roundPts += pts;
    if (roundTags.indexOf(label) < 0) roundTags.push(label);
    if (GQC && GQC.Juice) {
      GQC.Juice.popupScore(label + ' +' + pts, worldPos.clone().add(V(0, 0.9, 0)), K.camera, col || '#ffb320', 1.2);
    }
  }

  function finishFlight() {
    if (phase !== 'fly') return;
    phase = 'payoff';
    window.__k3phase = 'payoff';
    var tm = TEAMS[teamIdxForSide[turn]];
    if (roundPts > 0) {
      tm.score += roundPts;
      K.sfx('correct');
      if (coaches[turn]) coaches[turn].setState('cheer');
      updateHud(roundTags.join(' + ') || 'Nice Shot!', '+' + roundPts + ' pts for ' + tm.name + '!');
    } else {
      K.sfx('wrong');
      var wHint = wind < -2 ? 'Wind blew LEFT — add power or aim right!' : (wind > 2 ? 'Wind blew RIGHT — watch the gust!' : 'Try adjusting your pull angle!');
      updateHud(missTip || '💨 Close Try!', wHint);
    }
    activePower = null;
    turnCount++;
    updateHud();

    K.after(1.75, function () {
      projs.forEach(function (p) { arena.remove(p.mesh); });
      projs = [];
      if (coaches[0]) coaches[0].setState('idle');
      if (coaches[1]) coaches[1].setState('idle');
      if (turnCount >= totalTurns) {
        finishMatch();
        return;
      }
      turn = 1 - turn;
      if (nTeams > 2) teamIdxForSide[turn] = (teamIdxForSide[turn] + 2) % nTeams;
      resetTurnEnv();
      beginTurn();
    });
  }

  /* ---------------- Turn Flow: Question (kit3d Core Rules) -> Aim -> Fly ---------------- */
  function renderAimDock() {
    dockEl.innerHTML = '';
    dockEl.classList.remove('hidden');
    var bag = teamPowers[turn];

    [
      { id: 'giant', lbl: '💪 Giant' },
      { id: 'double', lbl: '✌️ Double' },
      { id: 'bouncy', lbl: '💣 Bouncy' }
    ].forEach(function (pw) {
      var left = bag[pw.id] || 0;
      var b = K.el('button', 'fl-btn sm ' + (activePower === pw.id ? 'amber on' : 'soft'), pw.lbl + ' (' + left + ')');
      if (left <= 0) b.disabled = true;
      b.onclick = function () {
        K.sfx('tap');
        activePower = activePower === pw.id ? null : pw.id;
        renderAimDock();
      };
      dockEl.appendChild(b);
    });

    // Live Angle + Power Meter Pill
    var mw = K.el('div', 'fl-meter-wrap');
    mw.innerHTML = '<span id="fl-ang-txt">45°</span><div class="fl-pwr-track"><div class="fl-pwr-fill" id="fl-pwr-fill"></div><div class="fl-pwr-red"></div></div><span id="fl-pwr-txt">25%</span>';
    dockEl.appendChild(mw);

    if (aim.sub === 'angle') {
      var lockA = K.el('button', 'fl-btn green', '1️⃣ LOCK ANGLE! (or Pull Slingshot)');
      lockA.onclick = function () {
        aim.sub = 'power';
        aim.oscP = -Math.PI / 2;
        aim.power = 0.14;
        K.sfx('tap');
        updateHud('⚡ STEP 2: Release Power!', 'Tap FIRE when power is right (or drag back on screen)!');
        renderAimDock();
      };
      dockEl.appendChild(lockA);
    } else {
      var reAim = K.el('button', 'fl-btn sm soft', '↩ Angle');
      reAim.onclick = function () { aim.sub = 'angle'; K.sfx('tap'); renderAimDock(); };
      var fireB = K.el('button', 'fl-btn pink', '2️⃣ FIRE THROW! (Space)');
      fireB.onclick = function () { fireThrow(aim.angleDeg, aim.power); };
      dockEl.appendChild(reAim);
      dockEl.appendChild(fireB);
    }
  }

  function enterAim() {
    phase = 'aim';
    window.__k3phase = 'aim';
    aim.sub = 'angle';
    aim.angleDeg = 45;
    aim.oscA = rnd(-1, 1);
    aim.power = 0.22;
    aim.oscP = -Math.PI / 2;
    aim.dragging = false;
    activePower = null;
    roundPts = 0;
    roundTags = [];
    hitOpp = false;
    missTip = '';
    aimGroup.visible = true;
    shot('aim', turn);
    var tm = TEAMS[teamIdxForSide[turn]];
    updateHud('🎯 ' + tm.name + ': Pull Slingshot or Lock Angle!', 'Check the 3D windsock & wasp!');
    renderAimDock();
    if (K.DEMO) {
      K.after(0.85, function () { if (phase === 'aim') fireThrow(rnd(40, 56), rnd(0.48, 0.72)); });
    }
  }

  function beginTurn() {
    phase = 'question';
    window.__k3phase = 'question';
    aimGroup.visible = false;
    dockEl.classList.add('hidden');
    var tm = TEAMS[teamIdxForSide[turn]];
    shot('question');
    updateHud((turn === 0 ? '🐱 ' : '🐶 ') + tm.name + '\'s Turn!', 'Throw ' + (turnCount + 1) + ' of ' + totalTurns);
    if (coaches[turn]) coaches[turn].setState('hello');
    K.sfx('hello');

    K.after(0.45, function () {
      if (phase !== 'question') return;
      K.ui.ask(QS.next(), tm, {
        prompt: 'answer right to fling over the 3D fence!',
        onAnswer: function (ok) {
          if (coaches[turn]) coaches[turn].setState('idle');
          if (ok) {
            K.sfx('correct');
            enterAim();
          } else {
            K.sfx('wrong');
            K.ui.toast('Good try! Next team gets to fling!', 1.4, tm.c);
            turnCount++;
            if (turnCount >= totalTurns) {
              K.after(1.1, finishMatch);
            } else {
              turn = 1 - turn;
              if (nTeams > 2) teamIdxForSide[turn] = (teamIdxForSide[turn] + 2) % nTeams;
              resetTurnEnv();
              K.after(1.1, beginTurn);
            }
          }
        }
      });
    });
  }

  /* ---------------- Pointer Drag Slingshot & Keyboard Controls ---------------- */
  var cvEl = K.renderer.domElement;
  cvEl.addEventListener('pointerdown', function (e) {
    if (phase !== 'aim') return;
    aim.dragging = true;
    aim.startX = e.clientX;
    aim.startY = e.clientY;
    aim.curX = e.clientX;
    aim.curY = e.clientY;
    aim.holdTime = 0;
    K.sfx('tap');
  });
  addEventListener('pointermove', function (e) {
    if (phase !== 'aim' || !aim.dragging) return;
    aim.curX = e.clientX;
    aim.curY = e.clientY;
    var dx = aim.startX - aim.curX;
    var dy = aim.curY - aim.startY;
    var dir = turn === 0 ? 1 : -1;
    var pullX = Math.max(12, dx * dir);
    var pullY = Math.max(8, dy);
    var mag = Math.hypot(dx, dy);
    if (mag >= 16) {
      aim.sub = 'drag';
      var trem = aim.power > 0.80 ? Math.sin(performance.now() / 36) * 2.5 : 0;
      aim.angleDeg = clamp(Math.atan2(pullY, pullX) * 180 / Math.PI + trem, 18, 76);
      aim.power = clamp((mag - 14) / 180, 0.14, 1.0);
    }
  });
  addEventListener('pointerup', function () {
    if (phase !== 'aim' || !aim.dragging) return;
    var mag = Math.hypot(aim.curX - aim.startX, aim.curY - aim.startY);
    aim.dragging = false;
    if (aim.sub === 'drag' && mag >= 20) {
      fireThrow(aim.angleDeg, aim.power);
    }
  });
  addEventListener('keydown', function (e) {
    if (phase !== 'aim') return;
    if (document.querySelector('.qcard')) return;
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (aim.sub === 'angle') {
        aim.sub = 'power'; aim.oscP = -Math.PI / 2; aim.power = 0.14; K.sfx('tap'); renderAimDock();
      } else {
        fireThrow(aim.angleDeg, aim.power);
      }
    }
  });

  /* ---------------- 60fps 3D Frame Loop (Wind, Wasp, Projectiles, Collisions, Juice) ---------------- */
  K.onFrame(function (dt, t) {
    // 1. Animate 3D Windsock Flag waving in live wind direction & strength
    var wFrac = clamp(wind / 9.2, -1, 1);
    var wDir = wFrac >= 0 ? 1 : -1;
    windsockGroup.scale.x = wDir;
    windsockCones.forEach(function (seg, idx) {
      var wave = Math.sin(t * (5 + Math.abs(wFrac) * 8) - idx * 0.9) * (0.04 + Math.abs(wFrac) * 0.08);
      seg.position.y = -(1 - Math.abs(wFrac)) * idx * 0.10 + wave;
    });

    // 2. Animate 3D Wasp & Spinning Star Coin
    waspGroup.position.x = Math.sin(t * DIFF.waspSpd * 0.72) * 1.15;
    waspGroup.position.y = 4.82 + Math.sin(t * DIFF.waspSpd) * DIFF.waspAmp;
    waspGroup.rotation.y = Math.cos(t * DIFF.waspSpd * 0.72) > 0 ? Math.PI : 0;
    var wf = Math.sin(t * 36) * 0.48;
    if (waspWings[0]) waspWings[0].rotation.x = wf;
    if (waspWings[1]) waspWings[1].rotation.x = -wf;
    if (waspCooldown > 0) waspCooldown = Math.max(0, waspCooldown - dt);

    if (bonusStarMesh && bonusStarMesh.visible) {
      bonusStarMesh.rotation.z = t * 2.2;
      bonusStarMesh.position.y = 6.25 + Math.sin(t * 2.8) * 0.18;
    }

    // 3. Animate Cat & Dog idle bob, tail wag & dizzy star ring
    fighters.forEach(function (f, i) {
      f.tail.rotation.x = Math.sin(t * (i === 1 ? 8 : 3.2)) * 0.35;
      f.root.position.y = YARD_Y + Math.abs(Math.sin(t * 2.4 + i)) * 0.06;
      f.ring.visible = (i === turn && (phase === 'aim' || phase === 'question'));
      var dizzy = t < f.dizzyUntil;
      f.dizzyRing.visible = dizzy;
      if (dizzy) {
        f.dizzyRing.rotation.y = t * 5.2;
        f.head.rotation.z = Math.sin(t * 14) * 0.16;
      } else {
        f.head.rotation.z *= 0.85;
      }
    });

    // 4. Update 3D Aim Oscillators & Strictly-One Short 4-Dot Muzzle Pointer
    if (phase === 'aim') {
      if (!aim.dragging) {
        if (aim.sub === 'angle') {
          aim.oscA += dt * DIFF.angleSpd;
          aim.angleDeg = 47 + Math.sin(aim.oscA) * 27;
        } else if (aim.sub === 'power') {
          aim.oscP += dt * DIFF.powerSpd;
          aim.power = 0.56 + Math.sin(aim.oscP) * 0.44;
        }
      } else {
        aim.holdTime += dt;
      }
      var orig = throwOrigin(turn);
      var dir = turn === 0 ? 1 : -1;
      var rad = aim.angleDeg * Math.PI / 180;
      muzzleDots.forEach(function (dot, i) {
        var d = (i + 1) * (0.45 + aim.power * 0.32);
        dot.position.set(orig.x + Math.cos(rad) * d * dir, orig.y + Math.sin(rad) * d, 0);
      });
      if (aim.dragging && aim.sub === 'drag') {
        var back = V(orig.x - Math.cos(rad) * (0.6 + aim.power * 1.4) * dir, orig.y - Math.sin(rad) * (0.6 + aim.power * 1.4), 0);
        bandGeo.setFromPoints([orig.clone().add(V(0, 0.2, 0.25)), back, orig.clone().add(V(0, -0.2, -0.25))]);
        bandLine.visible = true;
      } else {
        bandLine.visible = false;
      }
      var aEl = document.getElementById('fl-ang-txt');
      var pEl = document.getElementById('fl-pwr-txt');
      var pfEl = document.getElementById('fl-pwr-fill');
      if (aEl) aEl.textContent = Math.round(aim.angleDeg) + '°';
      if (pEl) pEl.textContent = Math.round(aim.power * 100) + '%';
      if (pfEl) pfEl.style.width = Math.round(aim.power * 100) + '%';
    }

    // 5. Step Knocked Tin Cans
    fenceCans.forEach(function (c) {
      if (c.hit && c.mesh.position.y > YARD_Y + 0.18) {
        c.vy -= GRAV * dt;
        c.mesh.position.x += c.vx * dt;
        c.mesh.position.y = Math.max(YARD_Y + 0.18, c.mesh.position.y + c.vy * dt);
        c.mesh.position.z += c.vz * dt;
        c.mesh.rotation.x += c.rx * dt;
        c.mesh.rotation.z += c.rz * dt;
      }
    });

    // 6. Step Flying 3D Projectiles & Collisions
    if (phase === 'fly' && projs.length) {
      var opp = 1 - turn;
      var oppHead = V(fighters[opp].x, YARD_Y + 1.92, 0);
      var oppBody = V(fighters[opp].x, YARD_Y + 0.95, 0);
      var oppProp = V(opp === 0 ? -9.4 : 9.6, YARD_Y + 0.9, 0);
      var effWind = (activePower === 'giant' ? wind * 0.55 : wind) + Math.sin(t * 2.5 + windPhase) * (windMode === 'gusty' ? 1.8 : 0.7);
      var anyAlive = false;

      projs.forEach(function (pr) {
        if (pr.done) return;
        anyAlive = true;
        pr.vel.x += effWind * dt;
        pr.vel.y -= GRAV * pr.gMul * dt;
        pr.pos.addScaledVector(pr.vel, dt);
        pr.mesh.position.copy(pr.pos);
        pr.mesh.rotation.z -= (pr.vel.x >= 0 ? 1 : -1) * 9 * dt;
        pr.mesh.rotation.x += 5 * dt;

        // Smooth camera follow on primary flying projectile
        if (pr === projs[0]) {
          K.cam.set(V(clamp(pr.pos.x * 0.45, -4, 4), clamp(4.6 + pr.pos.y * 0.18, 4.6, 7.2), 16.5), V(clamp(pr.pos.x * 0.55, -5, 5), clamp(pr.pos.y * 0.45, 2.0, 5.2), 0), 5.5);
        }

        // A. Patrolling 3D Wasp Deflection
        if (waspCooldown <= 0 && pr.pos.distanceTo(waspGroup.position) < 0.72 + pr.r * 0.5) {
          waspCooldown = 1.2;
          pr.vel.x = -pr.vel.x * 0.45;
          pr.vel.y = -Math.abs(pr.vel.y) * 0.35 - 2.2;
          pr.bounces = 0;
          missTip = '🐝 Deflected by the 3D Wasp!';
          K.sfx('wrong');
          if (GQC && GQC.Juice) {
            GQC.Juice.shakeCamera(0.18, 0.25);
            GQC.Juice.spawnBurst(scene, waspGroup.position.clone(), 'stars', 12);
            GQC.Juice.popupScore('🐝 WASP DEFLECT!', waspGroup.position.clone().add(V(0, 0.8, 0)), K.camera, '#ff5fa2', 1.1);
          }
        }

        // B. High-Altitude Golden Star Coin (+15, non-stopping!)
        if (!bonusStarHit && bonusStarMesh.visible && pr.pos.distanceTo(bonusStarMesh.position) < 0.78 + pr.r * 0.5) {
          bonusStarHit = true;
          bonusStarMesh.visible = false;
          K.sfx('correct');
          if (GQC && GQC.Juice) GQC.Juice.spawnBurst(scene, pr.pos.clone(), 'stars', 16);
          awardHit(15, '⭐ High Star!', pr.pos, '#ffb320');
        }

        // C. 3D Fence Tin Cans (+10 each)
        fenceCans.forEach(function (c) {
          if (!c.hit && pr.pos.distanceTo(c.mesh.position) < 0.52 + pr.r * 0.6) {
            c.hit = true;
            c.vx = pr.vel.x * 0.45 + rnd(-2, 2);
            c.vy = 4.5 + rnd(1, 3);
            c.vz = rnd(-2.2, 2.2);
            c.rx = rnd(-10, 10);
            c.rz = rnd(-10, 10);
            K.sfx('tap');
            if (GQC && GQC.Juice) GQC.Juice.spawnBurst(scene, c.mesh.position.clone(), 'dust', 10);
            awardHit(10, '🥫 Can Smash!', c.mesh.position, '#4f9dff');
          }
        });

        // D. Precision Headshot (+35) or Body Hit (+25) on Rival Cat / Dog
        var headHit = pr.pos.distanceTo(oppHead) < (0.76 * DIFF.hitMul + pr.r * 0.55);
        var bodyHit = !headHit && pr.pos.distanceTo(oppBody) < (1.02 * DIFF.hitMul + pr.r * 0.65);
        if (headHit || bodyHit) {
          pr.done = true;
          hitOpp = true;
          var pts = headHit ? 35 : (pr.power === 'giant' ? 30 : 25);
          var dmg = headHit ? 45 : (pr.power === 'giant' ? 40 : 30);
          var lbl = headHit ? '🎯 HEADSHOT!' : (pr.power === 'giant' ? '💥 GIANT BONK!' : '🎯 DIRECT HIT!');
          var oppTeam = TEAMS[teamIdxForSide[opp]];
          oppTeam.hp = Math.max(0, (oppTeam.hp != null ? oppTeam.hp : 100) - dmg);
          fighters[opp].dizzyUntil = t + 2.5;
          shot('impact', opp);

          if (GQC && GQC.Juice) {
            GQC.Juice.hitstop(42);
            GQC.Juice.squashStretch(fighters[opp].root, 1.32, 0.72, 1.32, 0.30);
            GQC.Juice.shakeCamera(headHit ? 0.32 : 0.22, 0.35);
            GQC.Juice.spawnBurst(scene, pr.pos.clone(), 'stars', headHit ? 24 : 16);
          }
          K.sfx('win');
          awardHit(pts, lbl, pr.pos, '#ffb320');
          if (oppTeam.hp <= 0) {
            oppTeam.hp = 100;
            oppTeam.ko = (oppTeam.ko || 0) + 1;
            awardHit(30, '🥊 YARD KNOCKOUT!', oppHead.clone().add(V(0, 0.8, 0)), '#ff5fa2');
          }
          return;
        }

        // E. Rival Yard Prop Hit (Doghouse / Yarn Basket, +10)
        if (pr.pos.distanceTo(oppProp) < 1.25 + pr.r * 0.4) {
          pr.done = true;
          K.sfx('correct');
          if (GQC && GQC.Juice) {
            GQC.Juice.squashStretch(opp === 0 ? yarnBasketGroup : doghouseGroup, 1.2, 0.84, 1.2, 0.22);
            GQC.Juice.spawnBurst(scene, pr.pos.clone(), 'dust', 14);
          }
          awardHit(10, opp === 0 ? '🧶 Yarn Basket!' : '🏠 Doghouse!', pr.pos, '#ffb320');
          return;
        }

        // F. Center 3D Wooden Fence Block
        if (Math.abs(pr.pos.x - FENCE_X) < FENCE_HALF_W + pr.r * 0.55 && pr.pos.y < YARD_Y + FENCE_H + 0.15) {
          if (pr.bounces > 0) {
            pr.bounces--;
            pr.vel.x = -pr.vel.x * 0.55;
            pr.vel.y = Math.abs(pr.vel.y) * 0.55 + 3.2;
            pr.pos.x = pr.pos.x < 0 ? -(FENCE_HALF_W + pr.r) : (FENCE_HALF_W + pr.r);
            K.sfx('tap');
            if (GQC && GQC.Juice) GQC.Juice.popupScore('BOING! 💣', pr.pos.clone(), K.camera, '#ffb320', 1.0);
          } else {
            pr.done = true;
            missTip = '🪵 Hit the 3D Fence — aim slightly higher!';
            if (GQC && GQC.Juice) {
              GQC.Juice.shakeCamera(0.14, 0.2);
              GQC.Juice.spawnBurst(scene, pr.pos.clone(), 'dust', 12);
            }
          }
          return;
        }

        // G. Ground / Out of Bounds
        if (pr.pos.y <= YARD_Y + 0.25 || Math.abs(pr.pos.x) > 14.5) {
          if (pr.bounces > 0 && Math.abs(pr.pos.x) < 12) {
            pr.bounces--;
            pr.pos.y = YARD_Y + 0.30;
            pr.vel.y = Math.abs(pr.vel.y) * 0.58 + 2.8;
            pr.vel.x *= 0.82;
            K.sfx('tap');
            if (GQC && GQC.Juice) GQC.Juice.spawnBurst(scene, pr.pos.clone(), 'dust', 8);
            return;
          }
          pr.done = true;
          if (GQC && GQC.Juice) GQC.Juice.spawnBurst(scene, V(clamp(pr.pos.x, -11, 11), YARD_Y + 0.2, 0), 'dust', 12);
          if (Math.abs(pr.pos.x - fighters[opp].x) < 1.35 * DIFF.hitMul) {
            awardHit(10, '🌿 Close Splash!', pr.pos, '#2fc58a');
          } else if (roundPts === 0) {
            var short = (turn === 0 && pr.pos.x < 0) || (turn === 1 && pr.pos.x > 0);
            missTip = short ? '💨 Fell short — pull back a little more!' : '💨 Flew past — try slightly less power!';
          }
        }
      });

      if (!anyAlive) finishFlight();
    }
  });

  /* ---------------- Title Screen & End Podium (Full kit3d Core Rules!) ---------------- */
  function finishMatch() {
    phase = 'end';
    window.__k3phase = 'end';
    aimGroup.visible = false;
    if (dockEl) dockEl.classList.add('hidden');
    if (hudTop) hudTop.remove();
    if (scoresEl) scoresEl.remove();
    shot('end');
    K.sfx('win');
    var sorted = TEAMS.slice().sort(function (a, b) { return b.score - a.score; });
    var win = sorted[0];
    if (coaches[0]) coaches[0].setState('cheer');
    if (coaches[1]) coaches[1].setState('cheer');
    if (GQC && GQC.Juice) GQC.Juice.spawnBurst(scene, V(0, 3.2, 0), 'stars', 28);

    K.ui.clear();
    K.ui.topButtons();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<div class="say" style="--c:' + win.c + ';font-size:1.55rem">🏆 ' + win.name + ' Wins Backyard Fling 3D!</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:10px 0">' +
      sorted.map(function (t, i) {
        return '<div style="background:#fff8ec;border:4px solid ' + t.c + ';border-radius:18px;padding:10px 18px;font-weight:900;color:#2b1d40">#' + (i + 1) + ' ' + t.name + ': ' + t.score + ' pts</div>';
      }).join('') + '</div>';
    if (K.cls && K.cls.pointsPanel) K.cls.pointsPanel(box, TEAMS, { game: 'fling3d', title: 'Cat vs Dog: Alley Fling 3D', scoreOf: function (t) { return t.score; } });
    var rows = K.el('div', 'rows');
    var again = K.el('button', 'btn green', '🔁 Play Again');
    again.onclick = function () { TEAMS.forEach(function (t) { t.score = 0; t.hp = 100; }); startGame(); };
    var homeB = K.el('button', 'btn soft', '🎮 All Games');
    homeB.onclick = function () { location.href = '../../game-maker/index.html'; };
    rows.appendChild(again);
    rows.appendChild(homeB);
    box.appendChild(rows);
  }

  function startGame() {
    K.ui.clear();
    K.ui.topButtons();
    var top = document.querySelector('.k3-top');
    if (top && !top.querySelector('.k3-help-btn')) {
      var hb = K.el('button', 'k3-icon k3-help-btn', '?');
      hb.title = 'How to play';
      hb.onclick = function () { openHowTo(); };
      top.insertBefore(hb, top.firstChild);
    }
    turn = 0;
    turnCount = 0;
    teamIdxForSide = [0, 1];
    teamPowers = [{ giant: 1, double: 1, bouncy: 1 }, { giant: 1, double: 1, bouncy: 1 }];
    TEAMS.forEach(function (t) { t.score = 0; t.hp = 100; });
    buildHud();
    resetTurnEnv();
    beginTurn();
  }

  function title() {
    phase = 'title';
    window.__k3phase = 'title';
    aimGroup.visible = false;
    spawnTinCans();
    shot('title');
    K.cam.snap();

    K.ui.clear();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML =
      '<div style="font-size:2.6rem;line-height:1">🐱 🆚 🐶</div>' +
      '<h1 style="margin:4px 0;font-size:clamp(1.7rem,3.4vw,2.5rem);color:#2b1d40">Cat vs Dog: Alley Fling 3D</h1>' +
      '<div class="say" style="--c:#ff5fa2;font-size:1.15rem">🎯 Answer right, read the 3D windsock, pull the slingshot &amp; fling over the fence!</div>';

    var sRow = K.el('div', 'fl-setup-row');
    // Teams 2..4
    var tGrp = K.el('div', 'fl-setup-grp', '<span>👥 Teams:</span>');
    [2, 3, 4].forEach(function (cnt) {
      var b = K.el('button', 'fl-pill' + (cnt === nTeams ? ' on' : ''), String(cnt));
      b.onclick = function () {
        nTeams = cnt;
        TEAMS = ALL_TEAMS.slice(0, nTeams);
        tGrp.querySelectorAll('.fl-pill').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        box.querySelectorAll('.setpick, .clsbox').forEach(function (x) { x.remove(); });
        K.cls.setupRow(box, nTeams);
      };
      tGrp.appendChild(b);
    });
    // Wind difficulty
    var wGrp = K.el('div', 'fl-setup-grp', '<span>💨 Wind:</span>');
    [['easy', 'Calm'], ['normal', 'Pro'], ['gusty', 'Gusty']].forEach(function (wm) {
      var b = K.el('button', 'fl-pill' + (wm[0] === windMode ? ' on' : ''), wm[1]);
      b.onclick = function () {
        windMode = wm[0]; DIFF = DIFF_MAP[windMode];
        wGrp.querySelectorAll('.fl-pill').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      wGrp.appendChild(b);
    });
    // Throws
    var rGrp = K.el('div', 'fl-setup-grp', '<span>🧶 Throws:</span>');
    [6, 10, 14].forEach(function (r) {
      var b = K.el('button', 'fl-pill' + (r === totalTurns ? ' on' : ''), String(r));
      b.onclick = function () {
        totalTurns = r;
        rGrp.querySelectorAll('.fl-pill').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      rGrp.appendChild(b);
    });
    sRow.appendChild(tGrp);
    sRow.appendChild(wGrp);
    sRow.appendChild(rGrp);
    box.appendChild(sRow);

    var rows = K.el('div', 'rows');
    var howB = K.el('button', 'btn soft', '❓ How to Play');
    howB.onclick = function () { openHowTo(); };
    var go = K.el('button', 'btn green', '▶ Start 3D Battle!');
    go.onclick = function () {
      K.audio();
      K.cls.assign(TEAMS);
      startGame();
    };
    rows.appendChild(howB);
    rows.appendChild(go);
    box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();

    if (K.DEMO) K.after(1.4, function () { if (phase === 'title') go.onclick(); });
  }

  // Boot: mount inside Adventure Park 3D World + load 3D Team Monsters + start 60fps loop!
  var worldP = (IN_WORLD && K.World && typeof K.World.load === 'function')
    ? K.World.load({ zone: 'tug', clear: true }).catch(function () { K.world.ground(0x6eb84c); })
    : Promise.resolve();
  Promise.all([worldP, loadCoaches()]).then(function () {
    title();
    K.start();
  });
})();
