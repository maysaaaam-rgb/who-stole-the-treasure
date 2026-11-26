/* build-the-bridge/js/app.js
 * Build the Bridge 3D — Commercial Three.js + GameQualityCore Speaking Arcade Game
 * Features: Real 3D .glb team monsters, real 3D bridge segments, GameQualityCore sunlit island
 * & StylizedWater shoreline foam, shaking/cracking plank timer, comical 3D ocean splash with
 * lifesaver rescue, and Treasure Island victory chest celebration!
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var GQC = root.GameQualityCore || {};
  var D = root.BridgeData;
  var A = root.BridgeAudio;

  // Bridge layout constants (X coordinates at Y = 2.05)
  var DECK_Y = 2.05;
  var DOCK_X = -8.6;
  var SLOT_X = [-6.0, -3.0, 0.0, 3.0, 6.0];
  var TREASURE_STOP_X = 10.2;
  var CRACK_DURATION = 5.0; // seconds before an incomplete (1-3 word) plank snaps & splashes!

  var state = {
    grade: 3,
    unit: 'all',
    deck: [],
    cardIdx: 0,
    activeTeam: 0,
    scores: [0, 0, 0, 0],
    bridges: [0, 0, 0, 0],
    planksBuilt: 0,      // 0..5
    phase: 'idle',       // 'idle' | 'building' | 'splashing' | 'crossing' | 'celebrating'
    timerEnabled: true,
    crackElapsed: 0,
    lastCreakAt: 0,
    phaseTime: 0,
    isSuperCross: false
  };

  // Three.js scene objects
  var renderer, scene, camera, atmosphere, waterMesh;
  var loader;
  var glbCache = {};
  var teamMonsters = [null, null, null, null]; // 3D Group per team
  var teamReady = [false, false, false, false];
  var bridgeTemplate = null;
  var plankMeshes = [];         // currently active 3D plank groups
  var fallingPlanks = [];       // snapped planks tumbling into ocean
  var guideRings = [];          // 5 glowing target rings on water
  var ripples = [];             // expanding white water splash rings
  var swayProps = [];           // palm trees & flags gently swaying
  var shipObj = null;
  var balloonObj = null;
  var chestObj = null;
  var chestHalo = null;
  var lifesaverObj = null;
  var gulls = [];

  // Active monster physics animation
  var mAnim = {
    jumping: false,
    jumpT: 0,
    jumpDur: 0.34,
    startX: DOCK_X,
    targetX: DOCK_X,
    startY: DECK_Y,
    targetY: DECK_Y,
    spinFlip: false,
    // Splash tumble physics
    vx: 0, vy: 0, vz: 0,
    inWater: false
  };

  // Camera smooth targets (Bottom 18% UI Safe Zone calibrated!)
  var camBasePos = new T3.Vector3(0, 9.6, 22.8);
  var camBaseLook = new T3.Vector3(0, 1.5, -1.0);
  var camPos = camBasePos.clone();
  var camLook = camBaseLook.clone();
  var camTargetPos = camBasePos.clone();
  var camTargetLook = camBaseLook.clone();
  var shakeAmp = 0;

  // DOM Cache
  var el = {};
  function q(id) { return document.getElementById(id); }

  function initDom() {
    el.canvas = q('scene');
    el.picCard = q('pic-card');
    el.picImg = q('pic-img');
    el.picWord = q('pic-word');
    el.picHelper = q('pic-helper');
    el.btnWordTts = q('btn-word-tts');
    el.btnNextCard = q('btn-next-card');

    el.tensionHud = q('tension-hud');
    el.tensionLabel = q('tension-label');
    el.tensionFill = q('tension-fill');

    el.btnGrade = q('btn-grade');
    el.selUnit = q('sel-unit');
    el.btnTimer = q('btn-timer');
    el.btnSheet = q('btn-sheet');
    el.btnSound = q('btn-sound');
    el.btnFs = q('btn-fs');

    el.teamStrip = q('team-strip');
    el.btnWord = q('btn-word');
    el.wordCountTag = q('word-count-tag');
    el.btnCross = q('btn-cross');
  }

  /* ==================== GLB LOADER & NORMALIZER ==================== */
  function loadGLB(url) {
    if (glbCache[url]) return glbCache[url];
    glbCache[url] = new Promise(function (resolve, reject) {
      loader.load(url, function (gltf) {
        resolve(gltf.scene);
      }, undefined, function (err) {
        console.warn('[Bridge3D] GLB load fallback for:', url, err);
        reject(err);
      });
    });
    return glbCache[url];
  }

  function cloneNormalized(rawScene, targetSize, byMaxDim) {
    var root = new T3.Group();
    var clone = rawScene.clone(true);
    clone.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(clone);
    var size = new T3.Vector3();
    var center = new T3.Vector3();
    box.getSize(size);
    box.getCenter(center);

    var refDim = byMaxDim ? Math.max(0.001, size.x, size.y, size.z) : Math.max(0.001, size.y);
    var s = targetSize / refDim;
    clone.scale.setScalar(s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    clone.traverse(function (o) {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    root.add(clone);
    return root;
  }

  /* ==================== 3D WORLD CONSTRUCTION ==================== */
  function initThree() {
    renderer = new T3.WebGLRenderer({
      canvas: el.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
    renderer.setSize(root.innerWidth, root.innerHeight);

    scene = new T3.Scene();
    camera = new T3.PerspectiveCamera(42, root.innerWidth / root.innerHeight, 0.4, 520);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // 1. Unified Sunlit Commercial Atmosphere (Sky Dome, Drifting Clouds, 2048px 3/4 Shadows, Rim Light, Low-Density Fog)
    if (GQC.Atmosphere && GQC.Atmosphere.applyCommercialAtmosphere) {
      atmosphere = GQC.Atmosphere.applyCommercialAtmosphere(renderer, scene, 'island');
    } else {
      renderer.outputColorSpace = T3.SRGBColorSpace;
      renderer.toneMapping = T3.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      scene.background = new T3.Color(0x78c4ff);
      scene.add(new T3.HemisphereLight(0x9ce0ff, 0xc49a6c, 0.65));
      var dl = new T3.DirectionalLight(0xfff2d6, 2.4);
      dl.position.set(35, 45, 25);
      dl.castShadow = true;
      scene.add(dl);
    }

    // 2. Stylized Tropical Ocean with Crisp Shoreline Foam Rings
    if (GQC.Water && GQC.Water.createStylizedWater) {
      waterMesh = GQC.Water.createStylizedWater({ size: 420 });
      scene.add(waterMesh);
      GQC.Water.clearColliders(0);
      GQC.Water.setCollider(0, -13.8, 0.0, 6.2, 1.0);  // Start Island shoreline foam
      GQC.Water.setCollider(1,  13.8, 0.0, 6.4, 1.0);  // Treasure Island shoreline foam
      GQC.Water.setCollider(2, -34.0, -40.0, 12.0, 0.85); // Distant island L
      GQC.Water.setCollider(3,  38.0, -44.0, 14.0, 0.85); // Distant island R
    } else {
      var wg = new T3.PlaneGeometry(400, 400);
      wg.rotateX(-Math.PI / 2);
      waterMesh = new T3.Mesh(wg, new T3.MeshStandardMaterial({ color: 0x1aa4d9, roughness: 0.25 }));
      scene.add(waterMesh);
    }

    loader = new T3.GLTFLoader();

    buildIslandsAndDocks();
    buildGuideRings();
    buildLifesaver();
    buildGulls();
    loadWorldProps();
    loadTeamMonsters();

    root.addEventListener('resize', onResize);
  }

  function makeIsland(x, z, sandR, grassR, height, isTreasure) {
    var grp = new T3.Group();
    grp.position.set(x, 0, z);

    // Wet sand underwater skirt -> Golden dry sand base
    var wetGeo = new T3.CylinderGeometry(sandR * 0.94, sandR * 1.18, 1.8, 28);
    var wetMat = new T3.MeshStandardMaterial({ color: 0xc99d5b, roughness: 0.85 });
    var wet = new T3.Mesh(wetGeo, wetMat);
    wet.position.y = -0.35;
    wet.receiveShadow = true;
    grp.add(wet);

    var sandGeo = new T3.CylinderGeometry(sandR * 0.82, sandR * 0.96, 1.35, 28);
    var sandMat = new T3.MeshStandardMaterial({ color: 0xf3cf8a, roughness: 0.82 });
    var sand = new T3.Mesh(sandGeo, sandMat);
    sand.position.y = 0.85;
    sand.receiveShadow = true;
    sand.castShadow = true;
    grp.add(sand);

    // Warm Olive-Meadow Grass Cap (#6EB84C lit / #4B8B3B edge)
    var grassGeo = new T3.CylinderGeometry(grassR * 0.92, grassR, 0.65, 24);
    var grassMat = new T3.MeshStandardMaterial({ color: isTreasure ? 0x72bd4e : 0x6eb84c, roughness: 0.86 });
    var grass = new T3.Mesh(grassGeo, grassMat);
    grass.position.y = height - 0.30;
    grass.receiveShadow = true;
    grass.castShadow = true;
    grp.add(grass);

    // Raised mound in back so trees & cheering monsters frame cleanly
    var hillGeo = new T3.SphereGeometry(grassR * 0.62, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    var hillMat = new T3.MeshStandardMaterial({ color: 0x5ca63e, roughness: 0.88 });
    var hill = new T3.Mesh(hillGeo, hillMat);
    hill.scale.set(1.0, 0.42, 0.9);
    hill.position.set(isTreasure ? 1.6 : -1.8, height - 0.12, -2.2);
    hill.receiveShadow = true;
    grp.add(hill);

    scene.add(grp);
    return grp;
  }

  function buildIslandsAndDocks() {
    // Left Start Island + Right Treasure Island
    makeIsland(-13.8, 0, 6.2, 5.1, DECK_Y, false);
    makeIsland( 13.8, 0, 6.4, 5.2, DECK_Y, true);

    // Warm distant tropical islands on horizon (zero whiteout!)
    makeIsland(-34, -40, 12.5, 9.5, 4.8, false);
    makeIsland( 38, -44, 14.0, 10.5, 5.4, true);

    // Wooden Start Pier (Left) & Treasure Pier (Right)
    var woodMat = new T3.MeshStandardMaterial({ color: 0xc98a4b, roughness: 0.72 });
    var darkWood = new T3.MeshStandardMaterial({ color: 0x8f5a2e, roughness: 0.82 });

    [-8.6, 8.6].forEach(function (px) {
      var dock = new T3.Group();
      dock.position.set(px, DECK_Y - 0.16, 0);
      var deck = new T3.Mesh(new T3.BoxGeometry(2.6, 0.32, 2.7), woodMat);
      deck.castShadow = true; deck.receiveShadow = true;
      dock.add(deck);

      // 4 sturdy wooden support pilings going into the sea
      [[-1.0, -1.1], [1.0, -1.1], [-1.0, 1.1], [1.0, 1.1]].forEach(function (off) {
        var post = new T3.Mesh(new T3.CylinderGeometry(0.16, 0.2, 3.2, 10), darkWood);
        post.position.set(off[0], -1.2, off[1]);
        post.castShadow = true;
        dock.add(post);
      });
      scene.add(dock);
    });

    // Golden pedestal halo on Treasure Island
    var haloGeo = new T3.RingGeometry(1.05, 1.55, 32);
    haloGeo.rotateX(-Math.PI / 2);
    var haloMat = new T3.MeshBasicMaterial({ color: 0xffd54f, transparent: true, opacity: 0.72, side: T3.DoubleSide });
    chestHalo = new T3.Mesh(haloGeo, haloMat);
    chestHalo.position.set(12.7, DECK_Y + 0.05, 0);
    scene.add(chestHalo);
  }

  function buildGuideRings() {
    guideRings = [];
    for (var i = 0; i < 5; i++) {
      var isBonus = (i === 4);
      var grp = new T3.Group();
      grp.position.set(SLOT_X[i], 0.25, 0);

      var ringGeo = new T3.RingGeometry(0.75, 1.05, 28);
      ringGeo.rotateX(-Math.PI / 2);
      var ringMat = new T3.MeshBasicMaterial({
        color: isBonus ? 0xffd54f : 0xffffff,
        transparent: true,
        opacity: 0.65,
        side: T3.DoubleSide
      });
      var ring = new T3.Mesh(ringGeo, ringMat);
      grp.add(ring);

      // Dotted floating preview shadow at bridge height
      var ghostGeo = new T3.BoxGeometry(2.65, 0.14, 2.15);
      var ghostMat = new T3.MeshBasicMaterial({
        color: isBonus ? 0xffd54f : 0xc8f1ff,
        transparent: true,
        opacity: 0.22
      });
      var ghost = new T3.Mesh(ghostGeo, ghostMat);
      ghost.position.y = DECK_Y - 0.35;
      grp.add(ghost);

      scene.add(grp);
      guideRings.push({ grp: grp, ring: ring, ghost: ghost });
    }
  }

  function buildLifesaver() {
    var grp = new T3.Group();
    var ring = new T3.Mesh(
      new T3.TorusGeometry(0.95, 0.28, 14, 28),
      new T3.MeshStandardMaterial({ color: 0xff5b5b, roughness: 0.4 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    grp.add(ring);

    // 4 white stripes on lifesaver
    var stripeMat = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    for (var i = 0; i < 4; i++) {
      var ang = i * (Math.PI / 2);
      var st = new T3.Mesh(new T3.BoxGeometry(0.32, 0.62, 0.62), stripeMat);
      st.position.set(Math.cos(ang) * 0.95, 0, Math.sin(ang) * 0.95);
      st.rotation.y = -ang;
      grp.add(st);
    }
    grp.visible = false;
    scene.add(grp);
    lifesaverObj = grp;
  }

  function buildGulls() {
    var mat = new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide });
    for (var i = 0; i < 4; i++) {
      var g = new T3.Group();
      var wL = new T3.Mesh(new T3.BoxGeometry(0.55, 0.04, 0.18), mat);
      wL.position.x = -0.26;
      var wR = new T3.Mesh(new T3.BoxGeometry(0.55, 0.04, 0.18), mat);
      wR.position.x = 0.26;
      g.add(wL); g.add(wR);
      scene.add(g);
      gulls.push({
        grp: g, wL: wL, wR: wR,
        radius: 13 + i * 3.5,
        height: 9.5 + i * 1.4,
        speed: 0.28 + i * 0.06,
        phase: i * 1.7
      });
    }
  }

  function loadWorldProps() {
    // Real 3D Bridge Segment template
    loadGLB('../assets/3d/home/bridge-segment.glb').then(function (raw) {
      bridgeTemplate = raw;
    }).catch(function () { /* procedural oak fallback ready */ });

    // Golden 3D Treasure Chest on Treasure Island — bright hero facing camera!
    loadGLB('../assets/3d/world/pirate/Prop_Chest_Gold.glb').then(function (raw) {
      chestObj = cloneNormalized(raw, 2.55, true);
      chestObj.position.set(12.6, DECK_Y + 0.04, 0.2);
      chestObj.rotation.y = -Math.PI * 0.22;
      chestObj.traverse(function (o) {
        if (o.isMesh && o.material) {
          o.material = o.material.clone();
          if (o.material.emissive) o.material.emissive.setRGB(0.18, 0.12, 0.02);
        }
      });
      scene.add(chestObj);
      if (GQC.Atmosphere && GQC.Atmosphere.addBlobShadow) {
        GQC.Atmosphere.addBlobShadow(chestObj, 1.45, 0.45);
      }
    }).catch(function () {});

    // Swaying Palm Trees on Treasure Island
    var palms = [
      ['../assets/3d/world/pirate/Environment_PalmTree_1.glb', 15.8, DECK_Y + 0.1, -2.5, 5.6, 0.4],
      ['../assets/3d/world/pirate/Environment_PalmTree_2.glb', 14.3, DECK_Y + 0.3, -4.1, 5.1, 1.8],
      ['../assets/3d/world/pirate/Environment_PalmTree_3.glb', 16.4, DECK_Y - 0.1,  2.4, 4.9, 3.1],
      ['../assets/3d/world/pirate/Environment_PalmTree_2.glb', -16.8, DECK_Y + 0.1, -3.2, 5.2, 2.2]
    ];
    palms.forEach(function (p) {
      loadGLB(p[0]).then(function (raw) {
        var m = cloneNormalized(raw, p[4], false);
        m.position.set(p[1], p[2], p[3]);
        m.rotation.y = p[5];
        scene.add(m);
        swayProps.push({ obj: m, phase: p[5], amp: 0.032 });
      }).catch(function () {});
    });

    // Lush Trees, Flowers, Rocks & Barrels dressing both islands (normalized by max dimension so flat props stay proportional!)
    var props = [
      ['../assets/3d/world/nature/CommonTree_1.glb', -15.6, DECK_Y + 0.25, -2.8, 4.6, 0.5, false],
      ['../assets/3d/world/nature/Bush_Common_Flowers.glb', -11.4, DECK_Y, -3.1, 1.5, 0.3, true],
      ['../assets/3d/world/nature/Bush_Common_Flowers.glb', -12.0, DECK_Y,  2.9, 1.4, 1.7, true],
      ['../assets/3d/world/nature/Bush_Common_Flowers.glb',  11.6, DECK_Y,  2.6, 1.5, 0.9, true],
      ['../assets/3d/world/pirate/Environment_Rock_1.glb', -17.0, DECK_Y - 0.2,  2.2, 2.0, 0.9, true],
      ['../assets/3d/world/pirate/Environment_Rock_1.glb',  16.6, DECK_Y - 0.2, -0.4, 2.1, 2.1, true],
      ['../assets/3d/world/pirate/Prop_Barrel.glb', -10.3, DECK_Y,  2.1, 1.25, 0.2, true],
      ['../assets/3d/world/pirate/Prop_Barrel.glb',  13.8, DECK_Y,  2.4, 1.25, 0.8, true]
    ];
    props.forEach(function (p) {
      loadGLB(p[0]).then(function (raw) {
        var m = cloneNormalized(raw, p[4], p[6]);
        m.position.set(p[1], p[2], p[3]);
        m.rotation.y = p[5];
        scene.add(m);
      }).catch(function () {});
    });

    // Drifting 3D Sailing Ship cleanly in the open background bay
    loadGLB('../assets/3d/world/pirate/Ship_Small.glb').then(function (raw) {
      shipObj = cloneNormalized(raw, 4.8, true);
      shipObj.position.set(-14, -0.1, -24);
      shipObj.rotation.y = Math.PI * 0.5;
      scene.add(shipObj);
    }).catch(function () {});

    // Floating 3D Hot Air Balloon in the sunny sky
    loadGLB('../assets/3d/home/hot-air-balloon.glb').then(function (raw) {
      balloonObj = cloneNormalized(raw, 6.2);
      balloonObj.position.set(8, 12.2, -26);
      scene.add(balloonObj);
    }).catch(function () {});
  }

  function loadTeamMonsters() {
    D.TEAMS.forEach(function (t, idx) {
      var holder = new T3.Group();
      scene.add(holder);
      teamMonsters[idx] = holder;

      loadGLB(t.glb).then(function (raw) {
        var m = cloneNormalized(raw, 2.45);
        holder.add(m);
        if (GQC.Atmosphere && GQC.Atmosphere.addBlobShadow) {
          GQC.Atmosphere.addBlobShadow(holder, 1.05, 0.48);
        }
        teamReady[idx] = true;
        positionAllMonsters();
      }).catch(function () {
        // Fallback chunky toy sphere if offline GLB fails
        var fb = new T3.Mesh(
          new T3.SphereGeometry(0.9, 18, 16),
          new T3.MeshStandardMaterial({ color: t.hex, roughness: 0.35 })
        );
        fb.position.y = 0.9;
        fb.castShadow = true;
        holder.add(fb);
        teamReady[idx] = true;
        positionAllMonsters();
      });
    });
  }

  // Spectator bench spots on Start Island hill for the 3 waiting teams
  var BENCH_SPOTS = [
    [-12.6, DECK_Y + 0.05, -2.5],
    [-14.6, DECK_Y + 0.15, -0.4],
    [-12.4, DECK_Y + 0.05,  2.3]
  ];

  function positionAllMonsters() {
    var benchIdx = 0;
    for (var i = 0; i < 4; i++) {
      var m = teamMonsters[i];
      if (!m) continue;
      if (i === state.activeTeam) {
        var ax = state.planksBuilt === 0 ? DOCK_X : SLOT_X[state.planksBuilt - 1];
        if (state.phase === 'celebrating') ax = TREASURE_STOP_X;
        m.position.set(ax, DECK_Y, 0);
        m.rotation.set(0, Math.PI * 0.5, 0); // Facing Treasure Island (+X)
      } else {
        var sp = BENCH_SPOTS[benchIdx++ % BENCH_SPOTS.length];
        m.position.set(sp[0], sp[1], sp[2]);
        m.rotation.set(0, Math.PI * 0.38, 0);
      }
    }
  }

  /* ==================== 3D PLANK CREATION ==================== */
  function createBridgePlank(slotIndex) {
    var isBonus = (slotIndex === 4);
    var grp = new T3.Group();
    grp.position.set(SLOT_X[slotIndex], DECK_Y + 7.0, 0); // drops from sky!

    var matList = [];
    if (bridgeTemplate) {
      var clone = bridgeTemplate.clone(true);
      clone.updateMatrixWorld(true);
      var box = new T3.Box3().setFromObject(clone);
      var sz = new T3.Vector3();
      var ctr = new T3.Vector3();
      box.getSize(sz); box.getCenter(ctr);

      // Fit bridge segment cleanly along X (width ~2.88m, depth ~2.4m)
      var spanX = Math.max(0.01, sz.x);
      var spanZ = Math.max(0.01, sz.z);
      var rotateY = spanZ > spanX ? Math.PI / 2 : 0;
      var sx = 2.88 / Math.max(spanX, spanZ);
      var szScale = 2.35 / Math.min(spanX, spanZ);
      var sy = Math.min(sx, szScale);

      var inner = new T3.Group();
      clone.scale.set(rotateY ? szScale : sx, sy, rotateY ? sx : szScale);
      clone.position.set(-ctr.x * clone.scale.x, -box.max.y * clone.scale.y, -ctr.z * clone.scale.z);
      inner.rotation.y = rotateY;
      inner.add(clone);
      inner.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          if (o.material) {
            o.material = o.material.clone();
            if (isBonus) {
              o.material.color.lerp(new T3.Color(0xffd54f), 0.58);
              o.material.emissive = new T3.Color(0x5c3e00);
              o.material.roughness = 0.3;
            }
            matList.push(o.material);
          }
        }
      });
      grp.add(inner);
    } else {
      // Chunky multi-plank oak slab fallback
      var oakMat = new T3.MeshStandardMaterial({
        color: isBonus ? 0xffc93c : 0xd99b52,
        roughness: isBonus ? 0.35 : 0.72
      });
      var trimMat = new T3.MeshStandardMaterial({
        color: isBonus ? 0xc98a00 : 0x8c5828,
        roughness: 0.78
      });
      matList.push(oakMat, trimMat);

      var slab = new T3.Mesh(new T3.BoxGeometry(2.85, 0.34, 2.35), oakMat);
      slab.position.y = -0.17;
      slab.castShadow = true; slab.receiveShadow = true;
      grp.add(slab);

      [-1.12, 1.12].forEach(function (rz) {
        var rail = new T3.Mesh(new T3.BoxGeometry(2.9, 0.24, 0.22), trimMat);
        rail.position.set(0, 0.05, rz);
        rail.castShadow = true;
        grp.add(rail);
      });
    }

    // Subtle team-coloured accent beam neatly underneath the wooden bridge deck
    var tCol = isBonus ? 0xffd54f : D.TEAMS[state.activeTeam].hex;
    var stripeMat = new T3.MeshStandardMaterial({ color: tCol, roughness: 0.4 });
    [-1.12, 1.12].forEach(function (sz) {
      var bar = new T3.Mesh(new T3.BoxGeometry(2.68, 0.10, 0.12), stripeMat);
      bar.position.set(0, -0.34, sz);
      grp.add(bar);
    });

    scene.add(grp);
    return {
      grp: grp,
      slotIdx: slotIndex,
      baseX: SLOT_X[slotIndex],
      baseY: DECK_Y,
      dropT: 0,
      landed: false,
      mats: matList,
      isBonus: isBonus
    };
  }

  function clearPlanks() {
    plankMeshes.forEach(function (p) { if (p.grp.parent) p.grp.parent.remove(p.grp); });
    plankMeshes = [];
    for (var i = 0; i < guideRings.length; i++) {
      guideRings[i].grp.visible = true;
    }
  }

  function spawnWaterRipple(x, z, colorHex) {
    var geo = new T3.RingGeometry(0.45, 0.85, 32);
    geo.rotateX(-Math.PI / 2);
    var mat = new T3.MeshBasicMaterial({
      color: colorHex || 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: T3.DoubleSide
    });
    var mesh = new T3.Mesh(geo, mat);
    mesh.position.set(x, 0.22, z);
    scene.add(mesh);
    ripples.push({ mesh: mesh, age: 0, life: 0.95 });
  }

  /* ==================== GAMEPLAY ACTIONS ==================== */

  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function buildDeck() {
    var all = (D.CARDS[state.grade] || []).slice();
    if (state.unit !== 'all') {
      var u = parseInt(state.unit, 10);
      all = all.filter(function (c) { return c.unit === u; });
    }
    state.deck = shuffle(all);
    state.cardIdx = 0;
  }

  function currentCard() {
    if (!state.deck.length) buildDeck();
    return state.deck[state.cardIdx % state.deck.length];
  }

  function renderCard() {
    var c = currentCard();
    if (!c) return;
    el.picImg.src = c.img;
    el.picImg.alt = c.word;
    el.picWord.textContent = c.word;
    el.picHelper.textContent = c.helper;
    el.picCard.classList.remove('pop');
    void el.picCard.offsetWidth;
    el.picCard.classList.add('pop');
  }

  function applyTeamTheme() {
    var t = D.TEAMS[state.activeTeam];
    document.documentElement.style.setProperty('--team-color', t.color);
    document.documentElement.style.setProperty('--team-dark', t.dark);
  }

  function renderTeams() {
    el.teamStrip.innerHTML = D.TEAMS.map(function (t, i) {
      var isTurn = i === state.activeTeam;
      return '<button type="button" class="team-pill' + (isTurn ? ' turn' : '') + '" data-team="' + i + '" style="--tc:' + t.color + ';--td:' + t.dark + ';">' +
        '<img src="' + t.icon + '" alt="' + t.name + '">' +
        '<div class="team-pill-meta">' +
          '<span class="team-pill-name">' + t.name + '</span>' +
          '<span class="team-pill-xp">' + state.scores[i] + ' XP</span>' +
        '</div>' +
      '</button>';
    }).join('');
  }

  function updateHudButtons() {
    var b = state.planksBuilt;
    var locked = state.phase === 'splashing' || state.phase === 'crossing' || state.phase === 'celebrating';
    el.btnWord.disabled = locked || b >= 5;
    el.wordCountTag.textContent = b >= 4 ? (b === 5 ? '5/5 ★' : '⭐ +2×?') : (b + '/4');

    var canCross = !locked && b >= 4;
    el.btnCross.disabled = !canCross;
    el.btnCross.classList.toggle('ready', canCross);
    el.btnCross.textContent = b >= 5 ? '🏆 CROSS! (+20 XP)' : '🏆 CROSS! (+10 XP)';

    // Tension HUD visibility
    if (state.phase === 'building' && b >= 1 && b <= 3) {
      el.tensionHud.classList.add('visible');
      el.tensionHud.classList.remove('safe', 'super');
    } else if (state.phase === 'building' && b >= 4) {
      el.tensionHud.classList.add('visible');
      el.tensionHud.classList.remove('warn', 'danger');
      el.tensionHud.classList.toggle('safe', b === 4);
      el.tensionHud.classList.toggle('super', b >= 5);
      el.tensionFill.style.transform = 'scaleX(1)';
      el.tensionLabel.textContent = b >= 5
        ? '⭐ SUPER SENTENCE! Cross for +20 XP!'
        : '✅ Bridge safe! Cross (+10) or add ⭐ 5th word!';
    } else if (state.phase !== 'splashing') {
      el.tensionHud.classList.remove('visible', 'warn', 'danger', 'safe', 'super');
    }
  }

  function addWordPlank() {
    if (state.phase === 'splashing' || state.phase === 'crossing' || state.phase === 'celebrating') return;
    if (state.planksBuilt >= 5) return;

    var slotIdx = state.planksBuilt;
    state.planksBuilt += 1;
    state.phase = 'building';
    state.crackElapsed = 0;
    state.lastCreakAt = 0;

    // Create & drop 3D plank
    var plank = createBridgePlank(slotIdx);
    plankMeshes.push(plank);
    if (guideRings[slotIdx]) guideRings[slotIdx].grp.visible = false;

    // Launch active 3D monster in a joyful hop onto the new plank!
    var m = teamMonsters[state.activeTeam];
    if (m) {
      mAnim.jumping = true;
      mAnim.jumpT = 0;
      mAnim.jumpDur = 0.34;
      mAnim.startX = m.position.x;
      mAnim.targetX = SLOT_X[slotIdx];
      mAnim.startY = DECK_Y;
      mAnim.targetY = DECK_Y;
      mAnim.spinFlip = (state.planksBuilt === 5);
    }

    A.plankSlam(state.planksBuilt);
    shakeAmp = state.planksBuilt >= 4 ? 0.55 : 0.28;

    // Camera subtle push-along
    camTargetPos.set(SLOT_X[slotIdx] * 0.25, 9.2, 22.0);
    camTargetLook.set(SLOT_X[slotIdx] * 0.35, 1.5, -0.8);

    // 3D Score/Word popup right above the new plank!
    if (GQC.Juice && GQC.Juice.popupScore) {
      var popTxt = state.planksBuilt === 5 ? '⭐ SUPER!' : (state.planksBuilt === 4 ? 'BRIDGE LOCKED!' : (state.planksBuilt + ' WORD' + (state.planksBuilt > 1 ? 'S!' : '!')));
      var popCol = state.planksBuilt >= 4 ? '#ffd54f' : '#ffffff';
      GQC.Juice.popupScore(popTxt, new T3.Vector3(SLOT_X[slotIdx], DECK_Y + 1.8, 0), camera, popCol, state.planksBuilt >= 4 ? 1.15 : 0.9);
    }

    updateHudButtons();
  }

  function triggerBridgeSnapSplash() {
    if (state.phase !== 'building' || state.planksBuilt < 1 || state.planksBuilt >= 4) return;
    state.phase = 'splashing';
    state.phaseTime = 0;

    A.bigSplash();
    shakeAmp = 0.85;

    // Snap the top plank loose so it tumbles into the ocean!
    var broken = plankMeshes.pop();
    if (broken) {
      fallingPlanks.push({
        grp: broken.grp,
        vy: -1.2,
        rotZ: -3.2,
        rotX: 1.8,
        age: 0
      });
      if (GQC.Juice && GQC.Juice.spawnBurst) {
        GQC.Juice.spawnBurst(scene, new T3.Vector3(broken.baseX, DECK_Y, 0), 'splinters', 14);
      }
    }

    // Launch monster into comical tumbling fall into the sea!
    var m = teamMonsters[state.activeTeam];
    if (m) {
      mAnim.jumping = false;
      mAnim.inWater = false;
      mAnim.vx = 0.8;
      mAnim.vy = 3.8;
      mAnim.vz = 0.6;
    }

    el.tensionHud.classList.add('visible', 'danger');
    el.tensionLabel.textContent = '💦 SPLASH! Say a full sentence (4+ words)!';
    el.tensionFill.style.transform = 'scaleX(0)';
    updateHudButtons();
  }

  function startVictoryCross() {
    if (state.phase !== 'building' || state.planksBuilt < 4) return;
    state.phase = 'crossing';
    state.phaseTime = 0;
    state.isSuperCross = (state.planksBuilt >= 5);

    var pts = state.isSuperCross ? 20 : 10;
    state.scores[state.activeTeam] += pts;
    state.bridges[state.activeTeam] += 1;

    // Auto-place 5th plank smoothly if crossing at 4 words so monster runs cleanly across all 5!
    if (state.planksBuilt === 4) {
      var finalP = createBridgePlank(4);
      finalP.grp.position.y = DECK_Y;
      finalP.landed = true;
      plankMeshes.push(finalP);
      if (guideRings[4]) guideRings[4].grp.visible = false;
    }

    A.crossVictory(state.isSuperCross);

    // Monster leaps all the way to Treasure Island!
    var m = teamMonsters[state.activeTeam];
    if (m) {
      mAnim.jumping = true;
      mAnim.jumpT = 0;
      mAnim.jumpDur = 0.72;
      mAnim.startX = m.position.x;
      mAnim.targetX = TREASURE_STOP_X;
      mAnim.startY = DECK_Y;
      mAnim.targetY = DECK_Y;
      mAnim.spinFlip = true;
    }

    // Swoop camera warmly toward Treasure Island!
    camTargetPos.set(6.5, 7.6, 17.5);
    camTargetLook.set(10.8, 2.2, 0);

    // Safe optional XP hook into platform
    try {
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP({ team: D.TEAMS[state.activeTeam].id, amount: pts, source: 'build-the-bridge-3d' });
      }
    } catch (e) {}

    renderTeams();
    updateHudButtons();
  }

  function resetTurn(advanceTeam, advanceCard) {
    clearPlanks();
    if (lifesaverObj) lifesaverObj.visible = false;
    state.planksBuilt = 0;
    state.phase = 'idle';
    state.crackElapsed = 0;
    state.phaseTime = 0;
    mAnim.jumping = false;
    mAnim.inWater = false;

    if (advanceTeam) {
      state.activeTeam = (state.activeTeam + 1) % D.TEAMS.length;
    }
    if (advanceCard) {
      state.cardIdx = (state.cardIdx + 1) % Math.max(1, state.deck.length);
      A.cardFlip();
      renderCard();
    }

    camTargetPos.copy(camBasePos);
    camTargetLook.copy(camBaseLook);
    applyTeamTheme();
    positionAllMonsters();
    renderTeams();
    updateHudButtons();
  }

  /* ==================== ANIMATION & PHYSICS LOOP (60fps) ==================== */
  var clock = new T3.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(0.05, clock.getDelta());
    var t = clock.elapsedTime;

    // Advance GameQualityCore water & sky clouds
    if (root.E3D && root.E3D.uTime) root.E3D.uTime.value = t;
    else if (waterMesh && waterMesh.material && waterMesh.material.uniforms && waterMesh.material.uniforms.uTime) {
      waterMesh.material.uniforms.uTime.value = t;
    }
    if (atmosphere && atmosphere.update) atmosphere.update(t, camera);
    if (GQC.Juice && GQC.Juice.update) GQC.Juice.update(dt, t, camera);

    // Ambient life: swaying palms, bobbing ship, floating hot air balloon, circling gulls, glowing chest halo
    for (var i = 0; i < swayProps.length; i++) {
      var sp = swayProps[i];
      sp.obj.rotation.z = Math.sin(t * 1.45 + sp.phase) * sp.amp;
      sp.obj.rotation.x = Math.cos(t * 1.1 + sp.phase) * (sp.amp * 0.6);
    }
    if (shipObj) {
      shipObj.position.x = -18 + ((t * 1.1) % 38);
      var wh = GQC.Water ? GQC.Water.sampleWaveHeight(shipObj.position.x, shipObj.position.z, t) : Math.sin(t * 2) * 0.12;
      shipObj.position.y = wh - 0.1;
      shipObj.rotation.z = Math.sin(t * 1.8) * 0.06;
    }
    if (balloonObj) {
      balloonObj.position.y = 12.2 + Math.sin(t * 0.7) * 0.9;
      balloonObj.position.x = 8 + Math.cos(t * 0.25) * 3.5;
      balloonObj.rotation.y = t * 0.12;
    }
    if (chestHalo) {
      chestHalo.rotation.y = t * 0.8;
      var pulse = 1 + Math.sin(t * 3.2) * 0.08;
      chestHalo.scale.setScalar(pulse);
    }
    for (var g = 0; g < gulls.length; g++) {
      var gl = gulls[g];
      var ang = t * gl.speed + gl.phase;
      gl.grp.position.set(Math.cos(ang) * gl.radius, gl.height + Math.sin(t * 2 + g) * 0.4, Math.sin(ang) * gl.radius * 0.55 - 8);
      gl.grp.rotation.y = -ang;
      var flap = Math.sin(t * 9.5 + g * 2) * 0.55;
      gl.wL.rotation.z = flap;
      gl.wR.rotation.z = -flap;
    }

    // Guide rings stay 100% flat on the turquoise water (spin around Y, not Z!)
    for (var r = 0; r < guideRings.length; r++) {
      if (guideRings[r].grp.visible) {
        guideRings[r].ring.rotation.y = t * (r === 4 ? 1.2 : 0.6);
        guideRings[r].ghost.position.y = DECK_Y - 0.35 + Math.sin(t * 2.8 + r) * 0.08;
      }
    }

    // Drop-in animation for newly placed 3D bridge planks
    for (var p = 0; p < plankMeshes.length; p++) {
      var pm = plankMeshes[p];
      if (!pm.landed) {
        pm.dropT = Math.min(1, pm.dropT + dt * 5.2);
        var ease = 1 - Math.pow(1 - pm.dropT, 3);
        pm.grp.position.y = DECK_Y + (1 - ease) * 7.0;
        if (pm.dropT >= 1) {
          pm.landed = true;
          pm.grp.position.y = DECK_Y;
          if (GQC.Juice) {
            GQC.Juice.squashStretch(pm.grp, 1.12, 0.72, 1.12, 0.28);
            GQC.Juice.spawnBurst(scene, new T3.Vector3(pm.baseX, DECK_Y, 0), pm.isBonus ? 'stars' : 'dust', pm.isBonus ? 14 : 9);
          }
          spawnWaterRipple(pm.baseX, 0, pm.isBonus ? 0xffd54f : 0xffffff);
        }
      }
    }

    // SHAKING & CRACKING BRIDGE TIMER (Planks 1, 2, 3!)
    if (state.phase === 'building' && state.planksBuilt >= 1 && state.planksBuilt <= 3) {
      if (state.timerEnabled) {
        state.crackElapsed += dt;
      }
      var frac = Math.max(0, 1 - state.crackElapsed / CRACK_DURATION);
      el.tensionFill.style.transform = 'scaleX(' + frac.toFixed(3) + ')';

      var topPlank = plankMeshes[plankMeshes.length - 1];
      var activeM = teamMonsters[state.activeTeam];
      var secLeft = Math.max(0, CRACK_DURATION - state.crackElapsed);

      if (state.crackElapsed < 2.0) {
        el.tensionHud.classList.remove('warn', 'danger');
        el.tensionLabel.textContent = '🧱 ' + state.planksBuilt + ' / 4 — Keep speaking!';
      } else if (state.crackElapsed < 3.6) {
        el.tensionHud.classList.add('warn');
        el.tensionHud.classList.remove('danger');
        el.tensionLabel.textContent = '⚠️ Shaking! Add more words! (' + secLeft.toFixed(1) + 's)';
        if (topPlank && topPlank.landed) {
          topPlank.grp.position.x = topPlank.baseX + Math.sin(t * 36) * 0.08;
          topPlank.grp.rotation.z = Math.sin(t * 28) * 0.10;
        }
        if (state.timerEnabled && state.crackElapsed - state.lastCreakAt > 0.48) {
          state.lastCreakAt = state.crackElapsed;
          A.creakTick(false);
        }
      } else {
        el.tensionHud.classList.add('danger');
        el.tensionHud.classList.remove('warn');
        el.tensionLabel.textContent = '😱 CRACKING! KEEP TALKING! (' + secLeft.toFixed(1) + 's)';
        if (topPlank && topPlank.landed) {
          topPlank.grp.position.x = topPlank.baseX + Math.sin(t * 58) * 0.16;
          topPlank.grp.rotation.z = Math.sin(t * 42) * 0.24;
          topPlank.mats.forEach(function (mt) {
            if (mt && mt.emissive) mt.emissive.setRGB(0.45, 0.10, 0.02);
          });
        }
        if (activeM && !mAnim.jumping) {
          activeM.rotation.z = Math.sin(t * 32) * 0.22;
        }
        if (state.timerEnabled && state.crackElapsed - state.lastCreakAt > 0.26) {
          state.lastCreakAt = state.crackElapsed;
          A.creakTick(true);
          if (GQC.Juice && topPlank) {
            GQC.Juice.spawnBurst(scene, new T3.Vector3(topPlank.baseX, DECK_Y - 0.1, 0), 'splinters', 4);
          }
        }
      }

      if (state.timerEnabled && state.crackElapsed >= CRACK_DURATION) {
        triggerBridgeSnapSplash();
      }
    }

    // Falling broken planks tumbling into the ocean
    for (var fp = fallingPlanks.length - 1; fp >= 0; fp--) {
      var f = fallingPlanks[fp];
      f.age += dt;
      f.vy -= 18 * dt;
      f.grp.position.y += f.vy * dt;
      f.grp.rotation.z += f.rotZ * dt;
      f.grp.rotation.x += f.rotX * dt;
      if (f.age > 1.8) {
        if (f.grp.parent) f.grp.parent.remove(f.grp);
        fallingPlanks.splice(fp, 1);
      }
    }

    // Active Monster Jump / Splash / Victory Animation
    var actM = teamMonsters[state.activeTeam];
    if (actM) {
      if (mAnim.jumping) {
        mAnim.jumpT = Math.min(1, mAnim.jumpT + dt / mAnim.jumpDur);
        var u = mAnim.jumpT;
        var arcH = state.phase === 'crossing' ? 3.2 : 1.75;
        actM.position.x = mAnim.startX + (mAnim.targetX - mAnim.startX) * u;
        actM.position.y = DECK_Y + Math.sin(u * Math.PI) * arcH;
        actM.rotation.z = 0;
        if (mAnim.spinFlip) {
          actM.rotation.y = Math.PI * 0.5 + u * Math.PI * 2;
        }
        if (mAnim.jumpT >= 1) {
          mAnim.jumping = false;
          actM.position.x = mAnim.targetX;
          actM.position.y = DECK_Y;
          actM.rotation.y = Math.PI * 0.5;
          if (GQC.Juice) GQC.Juice.squashStretch(actM, 1.18, 0.78, 1.18, 0.26);

          if (state.phase === 'crossing') {
            state.phase = 'celebrating';
            state.phaseTime = 0;
            shakeAmp = 0.6;
            if (chestObj && GQC.Juice) {
              GQC.Juice.squashStretch(chestObj, 1.25, 0.76, 1.25, 0.42);
              GQC.Juice.spawnBurst(scene, new T3.Vector3(12.7, DECK_Y + 1.2, 0), 'stars', state.isSuperCross ? 34 : 20);
              var ptsTxt = state.isSuperCross ? '⭐ SUPER +20 XP!' : '🏆 +10 XP!';
              GQC.Juice.popupScore(ptsTxt, new T3.Vector3(11.6, DECK_Y + 2.4, 0), camera, '#ffd54f', state.isSuperCross ? 1.35 : 1.15);
            }
          }
        }
      } else if (state.phase === 'splashing') {
        state.phaseTime += dt;
        if (!mAnim.inWater) {
          mAnim.vy -= 21 * dt;
          actM.position.x += mAnim.vx * dt;
          actM.position.y += mAnim.vy * dt;
          actM.position.z += mAnim.vz * dt;
          actM.rotation.z -= 7.5 * dt;
          actM.rotation.x += 4.2 * dt;

          if (actM.position.y <= 0.15) {
            mAnim.inWater = true;
            actM.position.y = 0.12;
            actM.rotation.set(0, Math.PI * 0.2, 0);
            if (lifesaverObj) {
              lifesaverObj.visible = true;
              lifesaverObj.position.set(actM.position.x, 0.22, actM.position.z);
            }
            spawnWaterRipple(actM.position.x, actM.position.z, 0xffffff);
            setTimeout(function () { spawnWaterRipple(actM.position.x, actM.position.z, 0x7fd8f2); }, 180);
            if (GQC.Juice) {
              GQC.Juice.spawnBurst(scene, new T3.Vector3(actM.position.x, 0.3, actM.position.z), 'splash', 26);
              GQC.Juice.popupScore('💦 SPLASH!', new T3.Vector3(actM.position.x, 1.6, actM.position.z), camera, '#ffffff', 1.25);
            }
          }
        } else {
          // Bobbing happily in the 3D lifesaver ring!
          var waveY = GQC.Water ? GQC.Water.sampleWaveHeight(actM.position.x, actM.position.z, t) : Math.sin(t * 3) * 0.12;
          actM.position.y = waveY + 0.08;
          actM.rotation.z = Math.sin(t * 4.5) * 0.14;
          if (lifesaverObj) {
            lifesaverObj.position.set(actM.position.x, waveY + 0.22, actM.position.z);
            lifesaverObj.rotation.z = Math.sin(t * 4.5) * 0.12;
          }
        }
        // Bounce back cleanly onto Start Dock after 1.9s for instant retry!
        if (state.phaseTime >= 2.05) {
          resetTurn(false, false);
        }
      } else if (state.phase === 'celebrating') {
        state.phaseTime += dt;
        actM.position.y = DECK_Y + Math.abs(Math.sin(t * 7.5)) * 1.15;
        actM.rotation.y = Math.PI * 0.1 + Math.sin(t * 5) * 0.4;
        if (state.phaseTime >= 2.1) {
          resetTurn(true, true);
        }
      } else {
        // Gentle idle bob on dock or bridge
        actM.position.y = DECK_Y + Math.sin(t * 3.4) * 0.09;
        if (state.crackElapsed < 3.6) actM.rotation.z = 0;
      }
    }

    // Idle bounce on waiting spectator monsters
    for (var s = 0; s < 4; s++) {
      if (s !== state.activeTeam && teamMonsters[s]) {
        var spM = teamMonsters[s];
        var baseSpY = BENCH_SPOTS[(s > state.activeTeam ? s - 1 : s) % BENCH_SPOTS.length][1];
        spM.position.y = baseSpY + Math.sin(t * 2.8 + s * 1.5) * 0.08;
      }
    }

    // Expanding water splash ripples
    for (var rp = ripples.length - 1; rp >= 0; rp--) {
      var rObj = ripples[rp];
      rObj.age += dt;
      var k = rObj.age / rObj.life;
      if (k >= 1) {
        scene.remove(rObj.mesh);
        rObj.mesh.geometry.dispose();
        rObj.mesh.material.dispose();
        ripples.splice(rp, 1);
      } else {
        rObj.mesh.scale.setScalar(1 + k * 4.8);
        rObj.mesh.material.opacity = (1 - k) * 0.85;
      }
    }

    // Smooth camera tracking + damped micro-shake
    camPos.lerp(camTargetPos, Math.min(1, dt * 3.6));
    camLook.lerp(camTargetLook, Math.min(1, dt * 4.2));
    camera.position.copy(camPos);
    if (shakeAmp > 0.01) {
      shakeAmp *= Math.exp(-7.5 * dt);
      camera.position.x += Math.sin(t * 58) * shakeAmp * 0.35;
      camera.position.y += Math.cos(t * 49) * shakeAmp * 0.25;
    }
    camera.lookAt(camLook);

    renderer.render(scene, camera);
  }

  function onResize() {
    if (!renderer || !camera) return;
    var w = root.innerWidth, h = root.innerHeight;
    camera.aspect = w / Math.max(1, h);
    // Widen camera slightly on narrow/4:3 screens so both islands remain framed
    var zAdj = camera.aspect < 1.35 ? 26.8 : (camera.aspect < 1.55 ? 24.8 : 22.8);
    camBasePos.z = zAdj;
    if (state.phase === 'idle') camTargetPos.z = zAdj;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  /* ==================== UI BINDINGS & KEYBOARD SHORTCUTS ==================== */
  function updateUnitLabels() {
    var meta = D.UNITS_META[state.grade] || {};
    el.selUnit.options[0].textContent = 'All Units';
    for (var i = 1; i <= 5; i++) {
      el.selUnit.options[i].textContent = meta[i] || ('Unit ' + i);
    }
    el.selUnit.value = String(state.unit);
    el.btnGrade.textContent = 'Grade ' + state.grade;
    el.btnSheet.href = 'worksheet.html?grade=' + state.grade + '&unit=' + (state.unit === 'all' ? 5 : state.unit);
  }

  function bindUi() {
    el.btnWord.addEventListener('pointerdown', function (ev) {
      ev.preventDefault();
      addWordPlank();
    });

    el.btnCross.addEventListener('click', startVictoryCross);
    el.btnWordTts.addEventListener('click', function () {
      var c = currentCard();
      if (c) A.speak(c.word);
    });
    el.btnNextCard.addEventListener('click', function () { resetTurn(false, true); });

    el.btnGrade.addEventListener('click', function () {
      state.grade = state.grade === 3 ? 4 : 3;
      state.unit = 'all';
      updateUnitLabels();
      buildDeck();
      resetTurn(false, false);
      renderCard();
    });

    el.selUnit.addEventListener('change', function () {
      state.unit = el.selUnit.value;
      updateUnitLabels();
      buildDeck();
      resetTurn(false, false);
      renderCard();
    });

    el.btnTimer.addEventListener('click', function () {
      state.timerEnabled = !state.timerEnabled;
      el.btnTimer.textContent = state.timerEnabled ? '⏱ Timer ON' : '⏸ Timer OFF';
      el.btnTimer.classList.toggle('paused', !state.timerEnabled);
    });

    el.btnSound.addEventListener('click', function () {
      A.setMuted(!A.isMuted());
      el.btnSound.textContent = A.isMuted() ? '🔇' : '🔊';
    });

    el.btnFs.addEventListener('click', function () {
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      } catch (e) {}
    });

    el.teamStrip.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.team-pill');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-team'), 10);
      if (idx >= 0 && idx < 4 && idx !== state.activeTeam) {
        state.activeTeam = idx;
        resetTurn(false, false);
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
      if (ev.code === 'Space') {
        ev.preventDefault();
        addWordPlank();
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        startVictoryCross();
      } else if (ev.key === 'n' || ev.key === 'N' || ev.key === 'ArrowRight') {
        resetTurn(false, true);
      } else if (ev.key === 't' || ev.key === 'T') {
        el.btnTimer.click();
      } else if (ev.key >= '1' && ev.key <= '4') {
        state.activeTeam = parseInt(ev.key, 10) - 1;
        resetTurn(false, false);
      }
    });
  }

  function boot() {
    initDom();
    try {
      var params = new URLSearchParams(root.location.search || '');
      var g = parseInt(params.get('grade'), 10);
      if (g === 3 || g === 4) state.grade = g;
      var u = params.get('unit');
      if (u && (u === 'all' || /^[1-5]$/.test(u))) state.unit = u;
    } catch (e) {}

    updateUnitLabels();
    buildDeck();
    applyTeamTheme();
    renderCard();
    renderTeams();
    updateHudButtons();

    initThree();
    onResize();
    bindUi();
    animate();

    // Expose tiny debug hook for automated QA testing
    root.Bridge3D = {
      state: state,
      addWord: addWordPlank,
      cross: startVictoryCross,
      splashNow: triggerBridgeSnapSplash,
      nextCard: function () { resetTurn(false, true); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
