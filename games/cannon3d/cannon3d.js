/* games/cannon3d/cannon3d.js
 * Flagship Smart Screen & Mobile 3D Game #1: Pirate & Monster Cannon 3D (v2 — All 12 Game-Craft Fixes)
 * Powered by games/engine3d/ (Three 0.169 + pmndrs/postprocessing + Rapier3D + three-mesh-bvh + Yuka + Howler)
 * & games/kit3d/ (65-bone Pupil 3D Avatars, 4 Team Monsters, 75+ Question Sets, Class Board XP Inbox).
 */
(function () {
  'use strict';

  var T3 = window.THREE;
  var K = window.K3;
  var E3D = window.E3D;
  var GQC = window.GameQualityCore;
  var Q = K.Q;

  /* ---------- Game Configuration & State ---------- */
  var STATE = {
    phase: 'boot',          // boot | title | question | aim | flight | duel | podium
    context: (K.MOBILE && !Q.has('cls')) ? 'solo' : 'classroom', // 'classroom' | 'solo'
    boardMode: Q.get('mode') === 'duel' ? 'duel' : 'cinema',     // 'cinema' | 'duel'
    playLoop: Q.get('loop') === 'target' ? 'target' : 'smash',   // 'smash' (Answer->Smash) | 'target' (Shoot 3D Sails)
    arcGuide: Q.get('arc') || 'skill',                           // 'skill' (short muzzle arc + fair breeze, DEFAULT) | 'pro' (tiny stub + strong wind) | 'warmup' (0 wind + guide)
    aimStyle: Q.get('aim') === 'slingshot' ? 'slingshot' : 'direct',
    teamCount: Math.min(4, Math.max(2, +(Q.get('teams') || 2))),
    totalRounds: Math.min(4, Math.max(2, +(Q.get('rounds') || 4))),
    round: 1,               // 1..totalRounds (maps to Stages 1..4!)
    turnIdx: 0,
    teams: [],
    currentItem: null,
    targetAttempts: 0,      // Allows opposing team to STEAL a missed 3D Answer Sail!
    targetSunk: false,
    selectedAmmo: 'iron',   // 'pebble' | 'iron' | 'bomb' | 'boulder' | 'triple'
    unlockedTier: 1,        // 0 = wrong (pebble), 1 = right (iron + bomb), 2 = super sentence (all!)
    midFlightUsed: false,
    shotScore: 0,
    duelTimeLeft: 40,
    bossHp: 3,
    bossMaxHp: 3
  };

  var AMMO_TYPES = {
    pebble:  { id: 'pebble',  label: '⚪ Light Pebble',   mass: 0.95, radius: 0.25, speedMul: 0.98, desc: 'Light shot — lob high over stone walls!' },
    iron:    { id: 'iron',    label: '⚫ Heavy Iron',     mass: 2.3,  radius: 0.34, speedMul: 1.00, desc: 'Solid iron punch' },
    bomb:    { id: 'bomb',    label: '💥 Star-Burst',     mass: 2.0,  radius: 0.38, speedMul: 0.99, desc: 'Tap mid-air above walls to BOOM!' },
    boulder: { id: 'boulder', label: '🪨 Runed Boulder',  mass: 6.8,  radius: 0.44, speedMul: 0.96, desc: 'Smashes straight through stone walls!' },
    triple:  { id: 'triple',  label: '⚡ Triple Scatter', mass: 1.9,  radius: 0.31, speedMul: 1.01, desc: 'Tap mid-air to split ×3!' }
  };

  var STAGE_META = [
    { num: 1, name: 'Stage 1 · Fortified Sandbar Cove',    mult: 1, windMax: 0.85 },
    { num: 2, name: 'Stage 2 · Fast Pirate Fleet',         mult: 1, windMax: 1.15 },
    { num: 3, name: 'Stage 3 · Twin Stone Fortresses',     mult: 1, windMax: 1.45 },
    { num: 4, name: 'Stage 4 · Armored Boss Flagship (2×)', mult: 2, windMax: 1.75 }
  ];

  /* ---------- Loaded 3D Asset Registry ---------- */
  var MODELS = {};
  var MODEL_URLS = {
    carriage:   'models/cannon-carriage.glb?v=3',
    barrel:     'models/cannon-barrel.glb?v=3',
    tntKeg:     'models/tnt-keg.glb?v=3',
    woodCrate:  'models/wood-crate.glb?v=3',
    woodBeam:   'models/wood-beam.glb?v=3',
    stoneBlk:   'models/stone-block.glb?v=3',
    buoy:       'models/buoy-bumper.glb?v=3',
    boulder:    'models/boulder-ammo.glb?v=3',
    tntAmmo:    'models/tnt-ammo.glb?v=3',
    sloop:      'models/pirate-sloop.glb?v=3',
    flagship:   'models/boss-flagship.glb?v=3',
    goldChest:  'models/gold-chest.glb?v=3',
    headland:   'models/cove-headland.glb?v=3',
    sandbar:    'models/cove-sandbar.glb?v=3',
    trophy:     'models/trophy.glb?v=3',
    palm1:      '../../assets/3d/world/pirate/Environment_PalmTree_1.glb',
    palm2:      '../../assets/3d/world/pirate/Environment_PalmTree_2.glb',
    palm3:      '../../assets/3d/world/pirate/Environment_PalmTree_3.glb',
    rock1:      '../../assets/3d/world/pirate/Environment_Rock_1.glb',
    rockMed1:   '../../assets/3d/world/nature/Rock_Medium_1.glb',
    rockMed2:   '../../assets/3d/world/nature/Rock_Medium_2.glb',
    dock:       '../../assets/3d/world/pirate/Environment_Dock.glb',
    dockPole:   '../../assets/3d/world/pirate/Environment_Dock_Pole.glb',
    barrelProp: '../../assets/3d/world/pirate/Prop_Barrel.glb',
    flowerBush: '../../assets/3d/world/nature/Bush_Common_Flowers.glb',
    rowBoat:    '../../island/planet/models/rowing-boat.glb',
    coconuts:   '../../island/planet/models/coconut-pile.glb',
    lighthouse: '../../assets/3d/home/lighthouse.glb',
    parrot:     '../../island/planet/models/parrot.glb'
  };

  /* ---------- Scene & Gameplay Runtime Objects ---------- */
  var rawRender = null;
  var atmosphere = null, oceanMesh = null;
  var worldGroup = null, stageGroup = null, fxGroup = null;
  var _camPosTmp = new T3.Vector3(), _camLookTmp = new T3.Vector3(), _focusTmp = new T3.Vector3();
  var physStage = null;
  var aiManager = null;
  var movingShips = [];       // { group, vehicle, kinRec, deckTnt, deckChest, sinking, sinkT, roll, pitch, foamIdx, attachments }
  var activeProjectiles = []; // { rec, mesh, trailTimer, teamIdx, ammoKey, splashed }
  var cannons = [];           // [ cannonRig0, cannonRig1 ]
  var camDuelLeft = null, camDuelRight = null;
  var windFlagMesh = null;
  var qsBank = null;
  var hudBar = null, windPillEl = null, stageBannerEl = null, bossBarEl = null, targetClueEl = null, flightTapBtn = null;

  /* =========================================================================
   * 1. INITIALIZATION & SAFE POSTFX RENDER HOOK
   * ========================================================================= */
  K.init({ fov: 44, far: 420, fog: 0xdaf2ff, fogNear: 88, fogFar: 225, bloom: false, autoPortraitFov: false });
  K.camera.near = 0.5; // 5x better 24-bit depth buffer precision -> zero ground/pad z-fighting!
  K.cam.noPortraitPull = true;
  function updateAdaptiveFov() {
    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    K.camera.fov = asp < 0.65 ? 65 : asp < 1.05 ? 52 : 44;
    K.camera.updateProjectionMatrix();
  }
  updateAdaptiveFov();
  window.addEventListener('resize', updateAdaptiveFov);
  qsBank = K.questions('g3-u5-vocab');

  rawRender = K.renderer.render.bind(K.renderer);
  var _inCustomRender = false;

  // Commercial Stylized Renderer Pipeline: Native ACESFilmic (1.05) + PCFSoftShadowMap + Split-Screen Duel Support
  K.renderer.render = function (scene, camera) {
    if (_inCustomRender || scene !== K.scene) {
      return rawRender(scene, camera);
    }
    if (atmosphere && camera) atmosphere.update(K.now || 0, camera);
    _inCustomRender = true;
    try {
      if (STATE.phase === 'duel' && camDuelLeft && camDuelRight) {
        E3D.PostFX.renderSplitHorizontal(K.renderer, K.scene, camDuelLeft, camDuelRight);
      } else {
        K.renderer.autoClear = true;
        K.renderer.toneMapping = T3.ACESFilmicToneMapping;
        K.renderer.toneMappingExposure = 1.05;
        rawRender(scene, camera);
      }
    } finally {
      _inCustomRender = false;
    }
  };

  /* =========================================================================
   * 2. ASSET PRELOADER & COMMERCIAL ATMOSPHERE COVE WORLD BUILDER
   * ========================================================================= */
  var ENV_KEYS = { headland: 1, sandbar: 1, palm1: 1, palm2: 1, palm3: 1, rock1: 1, rockMed1: 1, rockMed2: 1, flowerBush: 1 };

  function loadAllAssets() {
    var keys = Object.keys(MODEL_URLS);
    var jobs = keys.map(function (k) {
      return K.tryGLB(MODEL_URLS[k]).then(function (g) {
        if (g && g.scene) {
          var isPalm = (k === 'palm1' || k === 'palm2' || k === 'palm3');
          E3D.Shaders.stylizeObject(g.scene, {
            wind: isPalm ? 0.18 : (k === 'flowerBush' ? 0.08 : 0),
            windHeight: isPalm ? 4.2 : 1.0,
            rim: ENV_KEYS[k] ? 0.08 : 0.16
          });
          if (ENV_KEYS[k] && GQC && GQC.Atmosphere) {
            GQC.Atmosphere.gradeEnvironment(g.scene, {
              wetSand: (k === 'sandbar' || k === 'headland'),
              castShadow: (isPalm || k === 'rock1' || k === 'rockMed1' || k === 'rockMed2' || k === 'flowerBush'),
              receiveShadow: true
            });
          }
          MODELS[k] = g;
        }
      });
    });
    return Promise.all([E3D.initRapier(), Promise.all(jobs)]);
  }

  function buildCoveWorld() {
    // 1. Apply GameQualityCore Commercial Atmosphere (Warm 45° Sun, Sky/Sand Bounce, Studio PMREM, FogExp2 & Drifting Clouds!)
    atmosphere = GQC.Atmosphere.applyCommercialAtmosphere(K.renderer, K.scene, 'island');

    worldGroup = new T3.Group();
    stageGroup = new T3.Group();
    fxGroup = new T3.Group();
    K.scene.add(worldGroup);
    K.scene.add(stageGroup);
    K.scene.add(fxGroup);

    // 2. Stylized Water (#48DBFB Turquoise Shores -> #0984E3 Deep Ocean + Shore Foam + FogExp2 Horizon Melt!)
    oceanMesh = GQC.Water.createStylizedWater({ size: 420 });
    worldGroup.add(oceanMesh);

    // 3. Launch Headland Cliff (Desaturated Warm Sage Grass!) + Separated Stone Battery Pads
    if (MODELS.headland) {
      var cliff = MODELS.headland.scene.clone(true);
      cliff.position.set(0, -0.13, 15.2);
      cliff.scale.set(1.22, 1.0, 1.06);
      cliff.receiveShadow = true;
      worldGroup.add(cliff);
    }
    GQC.Water.setCollider(0, 0, 15.2, 10.8, 1.0);

    if (MODELS.stoneBlk) {
      [-4.2, 0, 4.2].forEach(function (bx) {
        var pad = MODELS.stoneBlk.scene.clone(true);
        pad.scale.set(1.72, 0.22, 2.65);
        pad.position.set(bx, 2.02, 13.5);
        pad.receiveShadow = true;
        worldGroup.add(pad);
      });
    }

    // 4. Framing Coastal Islets (Grounded with Blob Shadows!)
    var decorSpots = [
      { x: -19.5, z: 7.5, s: 0.72 },
      { x:  20.0, z: 7.0, s: 0.78 },
      { x: -32.0, z: -28.0, s: 0.96 },
      { x:  32.5, z: -29.0, s: 0.92 }
    ];
    decorSpots.forEach(function (sp, idx) {
      if (MODELS.sandbar) {
        var isl = MODELS.sandbar.scene.clone(true);
        isl.position.set(sp.x, -0.1, sp.z);
        isl.scale.setScalar(sp.s);
        worldGroup.add(isl);
        GQC.Water.setCollider(1 + idx, sp.x, sp.z, 5.1 * sp.s, 0.95);
      }
      var pModel = (idx % 2 === 0 ? MODELS.palm1 : MODELS.palm2) || MODELS.palm1;
      if (pModel) {
        var palm = pModel.scene.clone(true);
        K.fitModel(palm, 4.6 * sp.s + 1.2);
        palm.position.set(sp.x + (idx % 2 ? -1.1 : 1.1), 0.85 * sp.s, sp.z);
        palm.rotation.y = idx * 1.7;
        GQC.Atmosphere.addBlobShadow(palm, 1.1, 1.1, 0.50, 0.03);
        worldGroup.add(palm);
      }
      if (MODELS.rock1) {
        var rk = MODELS.rock1.scene.clone(true);
        K.fitModel(rk, 1.6 * sp.s);
        rk.position.set(sp.x - 1.5, 0.25, sp.z + 1.2);
        GQC.Atmosphere.addBlobShadow(rk, 0.85, 0.85, 0.55, 0.04);
        worldGroup.add(rk);
      }
    });

    // 5. Distant Organic Horizon Islands Pushed Deep into FogExp2 (z = -118 .. -152) for True Atmospheric Depth!
    var horizonIsles = [
      { x: -58, z: -118, sx: 2.3, sy: 3.1, sz: 2.0 },
      { x:  64, z: -128, sx: 2.7, sy: 3.6, sz: 2.2 },
      { x:  10, z: -152, sx: 3.5, sy: 4.4, sz: 2.6 }
    ];
    horizonIsles.forEach(function (hi, idx) {
      if (MODELS.headland) {
        var pk = MODELS.headland.scene.clone(true);
        pk.position.set(hi.x, -0.6, hi.z);
        pk.scale.set(hi.sx, hi.sy, hi.sz);
        worldGroup.add(pk);
      }
      if (MODELS.rock1) {
        var crown = MODELS.rock1.scene.clone(true);
        K.fitModel(crown, 6.5 + idx * 2.2);
        crown.position.set(hi.x - 2.5, hi.sy * 1.65, hi.z);
        worldGroup.add(crown);
      }
      if (idx === 0 && MODELS.lighthouse) {
        var lh = MODELS.lighthouse.scene.clone(true);
        K.fitModel(lh, 10.5);
        lh.position.set(hi.x + 5.2, hi.sy * 1.85, hi.z + 2.5);
        worldGroup.add(lh);
      }
    });

    // Headland framing palms with grounding blob shadows
    [-9.2, 9.2].forEach(function (px, i) {
      var pm = (i === 0 ? MODELS.palm1 : MODELS.palm2) || MODELS.palm1;
      if (pm) {
        var p = pm.scene.clone(true);
        K.fitModel(p, 5.2);
        p.position.set(px, 1.94, 15.9);
        p.rotation.y = i ? -0.6 : 0.6;
        GQC.Atmosphere.addBlobShadow(p, 1.15, 1.15, 0.55, 0.03);
        worldGroup.add(p);
      }
    });

    buildWindFlagpole();
    buildCirclingSeagulls();

    // Ambient Midground Drifting Pirate Rowing Skiff (broadside in the cove channel with live foam wake!)
    if (MODELS.rowBoat) {
      var skiffGrp = new T3.Group();
      var sk = MODELS.rowBoat.scene.clone(true);
      K.fitModel(sk, 2.15);
      sk.rotation.y = 1.38;
      skiffGrp.add(sk);
      if (MODELS.barrelProp) {
        var bp = MODELS.barrelProp.scene.clone(true);
        K.fitModel(bp, 0.52);
        bp.position.set(0.1, 0.24, -0.1);
        skiffGrp.add(bp);
      }
      worldGroup.add(skiffGrp);
      K.onFrame(function (dt, t) {
        var bx = -15.4 + Math.sin(t * 0.35) * 1.2;
        var bz = -11.4 + Math.cos(t * 0.28) * 0.8;
        var by = GQC.Water.sampleWaveHeight(bx, bz, t);
        skiffGrp.position.set(bx, by + 0.04, bz);
        skiffGrp.rotation.z = Math.sin(t * 1.4) * 0.055;
        skiffGrp.rotation.x = Math.cos(t * 1.1) * 0.035;
        GQC.Water.setCollider(15, bx, bz, 1.45, 0.82);
      });
    }

    // Flying Guide Parrot (Yuka figure-8 over the cove!)
    aiManager = E3D.AI.createManager();
    if (MODELS.parrot && aiManager) {
      var parrotWrap = new T3.Group();
      var pm2 = MODELS.parrot.scene.clone(true);
      K.fitModel(pm2, 0.85);
      parrotWrap.add(pm2);
      worldGroup.add(parrotWrap);
      var pv = E3D.AI.createPatrolVehicle([
        [-10, 6.8, 3], [0, 7.6, -5], [10, 6.8, 3], [0, 6.2, 9]
      ], 4.2, true);
      aiManager.add(pv);
      K.onFrame(function (dt, t) {
        parrotWrap.position.set(pv.position.x, pv.position.y + Math.sin(t * 7.5) * 0.18, pv.position.z);
        if (pv.velocity.squaredLength() > 0.01) {
          parrotWrap.rotation.y = Math.atan2(pv.velocity.x, pv.velocity.z);
        }
        pm2.rotation.z = Math.sin(t * 9.0) * 0.14;
      });
    }

    // Build Primary & Secondary Cannon Rigs resting flush on stone battery pad (y = 2.13)
    cannons = [
      createCannonRig(0, new T3.Vector3(0, 2.13, 13.4)),
      createCannonRig(1, new T3.Vector3(4.2, 2.13, 13.4))
    ];
    cannons[1].root.visible = false;

    camDuelLeft = new T3.PerspectiveCamera(53, 1, 0.5, 400);
    camDuelRight = new T3.PerspectiveCamera(53, 1, 0.5, 400);

    K.cam.set(new T3.Vector3(5.8, 6.2, 22.5), new T3.Vector3(0, 2.4, -6), 2.2);
    K.cam.snap();
  }

  function buildCirclingSeagulls() {
    var wingGeo = new T3.BoxGeometry(0.46, 0.035, 0.16);
    wingGeo.translate(0.23, 0, 0);
    var wingMat = new T3.MeshLambertMaterial({ color: 0xfffcf5, emissive: 0xfff6e0, emissiveIntensity: 0.28 });
    var tipMat = new T3.MeshLambertMaterial({ color: 0x3b4859 });
    var gulls = [];
    for (var i = 0; i < 5; i++) {
      var g = new T3.Group();
      var lw = new T3.Group(), rw = new T3.Group();
      var lm = new T3.Mesh(wingGeo, wingMat);
      var rm = new T3.Mesh(wingGeo, wingMat);
      rm.scale.x = -1;
      var lt = new T3.Mesh(new T3.BoxGeometry(0.14, 0.038, 0.14), tipMat);
      lt.position.set(0.42, 0, 0);
      var rt = lt.clone(); rt.position.set(-0.42, 0, 0);
      lw.add(lm); lw.add(lt);
      rw.add(rm); rw.add(rt);
      g.add(lw); g.add(rw);
      g.scale.setScalar(0.95 + (i % 3) * 0.18);
      worldGroup.add(g);
      gulls.push({
        grp: g, lw: lw, rw: rw,
        cx: -14 + i * 7.5,
        cy: 13.5 + (i % 3) * 2.2,
        cz: -36 - (i % 2) * 14,
        r: 9.0 + i * 1.8,
        spd: 0.36 + (i % 3) * 0.07,
        ph: i * 1.35
      });
    }
    K.onFrame(function (dt, t) {
      for (var i = 0; i < gulls.length; i++) {
        var b = gulls[i];
        var a = t * b.spd + b.ph;
        b.grp.position.set(b.cx + Math.cos(a) * b.r, b.cy + Math.sin(t * 1.4 + b.ph) * 0.45, b.cz + Math.sin(a) * b.r * 0.55);
        b.grp.rotation.y = -a + Math.PI * 0.5;
        b.grp.rotation.z = 0.18;
        var flap = Math.sin(t * 7.2 + b.ph * 2.0) * 0.48;
        b.lw.rotation.z = flap;
        b.rw.rotation.z = -flap;
      }
    });
  }

  function buildWindFlagpole() {
    var grp = new T3.Group();
    grp.position.set(6.9, 2.02, 14.4);
    GQC.Atmosphere.addBlobShadow(grp, 0.55, 0.55, 0.55, 0.03);
    if (MODELS.woodBeam) {
      var pole = MODELS.woodBeam.scene.clone(true);
      pole.rotation.z = Math.PI * 0.5;
      pole.scale.set(1.05, 0.24, 0.24);
      pole.position.y = 1.25;
      grp.add(pole);
    }
    var flagGeo = new T3.PlaneGeometry(1.35, 0.52, 12, 4);
    flagGeo.translate(0.68, 0, 0);
    var flagMat = new T3.MeshStandardMaterial({ color: 0xff5fa2, roughness: 0.55, side: T3.DoubleSide });
    windFlagMesh = new T3.Mesh(flagGeo, flagMat);
    windFlagMesh.position.set(0, 2.32, 0);
    windFlagMesh.castShadow = true;
    grp.add(windFlagMesh);
    worldGroup.add(grp);

    var origPos = flagGeo.attributes.position.array.slice();
    K.onFrame(function (dt, t) {
      if (!windFlagMesh) return;
      var wx = E3D.wind.x, wz = E3D.wind.z;
      var mag = Math.hypot(wx, wz);
      var targetAng = mag > 0.08 ? Math.atan2(-wz, wx) : 0;
      windFlagMesh.rotation.y = K.lerp(windFlagMesh.rotation.y, targetAng, 1 - Math.exp(-dt * 5));
      var arr = flagGeo.attributes.position.array;
      var speed = 3.8 + mag * 3.2;
      var amp = 0.035 + mag * 0.055;
      for (var i = 0; i < arr.length; i += 3) {
        var ox = origPos[i], oy = origPos[i + 1];
        var mask = Math.min(1, ox / 1.35);
        arr[i + 2] = Math.sin(ox * 4.2 - t * speed + oy * 1.5) * amp * mask;
      }
      flagGeo.attributes.position.needsUpdate = true;
    });
  }

  /* =========================================================================
   * 3. CANNON RIG + WATER SHADOW DOTS & 3D LANDING RING (ZERO DEPTH BLINDNESS!)
   * ========================================================================= */
  function createCannonRig(slotIdx, pos) {
    var root = new T3.Group();
    root.position.copy(pos);
    worldGroup.add(root);

    var yawGroup = new T3.Group();
    root.add(yawGroup);
    if (MODELS.carriage) yawGroup.add(MODELS.carriage.scene.clone(true));
    GQC.Atmosphere.addBlobShadow(root, 1.15, 1.35, 0.72, 0.025);

    var pitchPivot = new T3.Group();
    pitchPivot.position.set(0, 0.62, 0.02);
    yawGroup.add(pitchPivot);

    var barrelWrap = new T3.Group();
    pitchPivot.add(barrelWrap);
    if (MODELS.barrel) barrelWrap.add(MODELS.barrel.scene.clone(true));

    var sparkMat = new T3.MeshStandardMaterial({
      color: 0xffe066,
      emissive: new T3.Color(0xff9900),
      emissiveIntensity: 2.6,
      roughness: 0.2
    });
    var fuseSpark = new T3.Mesh(new T3.OctahedronGeometry(0.085, 1), sparkMat);
    fuseSpark.position.set(0, 0.24, 0.62);
    barrelWrap.add(fuseSpark);

    // SINGLE CLEAN SHORT MUZZLE POINTER ARC (Zero duplicate water-shadow arrow, zero ghost-trail arrow!)
    var dotGeo = new T3.SphereGeometry(0.125, 10, 8);
    var dotMat = new T3.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new T3.Color(0xffd447),
      emissiveIntensity: 0.95,
      transparent: true,
      opacity: 0.92
    });
    var arcDots = new T3.InstancedMesh(dotGeo, dotMat, 16);
    arcDots.count = 0; arcDots.frustumCulled = false;
    fxGroup.add(arcDots);

    // Optional Warmup-only subtle ring (strictly hidden in Arcade Skill & Pro modes!)
    var ringGrp = new T3.Group();
    var outerRing = new T3.Mesh(
      new T3.RingGeometry(0.85, 1.15, 28),
      new T3.MeshBasicMaterial({ color: 0xffd447, transparent: true, opacity: 0.78, side: T3.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.renderOrder = 4;
    ringGrp.add(outerRing);
    ringGrp.visible = false;
    fxGroup.add(ringGrp);

    var rig = {
      slotIdx: slotIdx,
      root: root,
      yawGroup: yawGroup,
      pitchPivot: pitchPivot,
      barrelWrap: barrelWrap,
      fuseSpark: fuseSpark,
      arcDots: arcDots,
      landingRing: ringGrp,
      outerRing: outerRing,
      yaw: 0,               // -0.56 .. +0.56 rad
      pitch: 0.30,          // calibrated 0.19 .. 0.54 rad
      power: 0.32,
      recoil: 0,
      kidChar: null,
      monChar: null,
      activeTeamIdx: slotIdx
    };

    K.onFrame(function (dt, t) {
      if (!root.visible) return;
      yawGroup.rotation.y = rig.yaw;
      pitchPivot.rotation.x = rig.pitch;
      if (rig.recoil > 0.001) {
        rig.recoil *= Math.exp(-dt * 11);
        barrelWrap.position.z = rig.recoil * 0.38;
      } else {
        barrelWrap.position.z = 0;
      }
      fuseSpark.scale.setScalar(0.85 + 0.32 * Math.sin(t * 22 + slotIdx));
      if (ringGrp.visible) {
        var pulse = 0.92 + 0.10 * Math.sin(t * 6.5);
        ringGrp.scale.set(pulse, 1, pulse);
      }
      if (rig.kidChar) rig.kidChar.update(dt);
      if (rig.monChar) rig.monChar.update(dt);
    });

    return rig;
  }

  function syncRigCast(rig, team, teamIdx) {
    rig.activeTeamIdx = teamIdx;
    var sp = (K.cls && K.cls.speaker && K.cls.speaker(team)) || null;
    var sid = sp ? sp.id : '';
    var key = team.name + '|' + sid;
    if (rig._castKey === key) {
      if (rig.kidChar) rig.kidChar.setState('wave');
      if (rig.monChar) rig.monChar.setState('hop');
      K.after(1.0, function () {
        if (rig.kidChar && STATE.phase === 'aim') rig.kidChar.setState('ready');
        if (rig.monChar && STATE.phase === 'aim') rig.monChar.setState('idle');
      });
      return;
    }
    rig._castKey = key;
    if (rig.kidChar && rig.kidChar.root.parent) rig.kidChar.root.parent.remove(rig.kidChar.root);
    if (rig.monChar && rig.monChar.root.parent) rig.monChar.root.parent.remove(rig.monChar.root);
    rig.kidChar = null; rig.monChar = null;

    K.makeCharacter(team, { kidsOnly: true, studentId: sid, kidHeight: 1.50 }).then(function (kid) {
      if (rig._castKey !== key) return;
      kid.root.position.set(-1.32, 0.0, 0.25);
      kid.root.rotation.y = Math.PI * 0.88;
      GQC.Atmosphere.addBlobShadow(kid.root, 0.48, 0.48, 0.62, 0.02);
      rig.root.add(kid.root);
      rig.kidChar = kid;
      kid.setState('wave');
      K.after(1.1, function () { if (kid.state === 'wave') kid.setState('ready'); });
      GQC.Juice.attachIdleLife(kid.root, Math.PI, function () { return getCrewLookTarget(rig); });
    });

    K.makeCharacter(team, { monHeight: 1.14 }).then(function (mon) {
      if (rig._castKey !== key) return;
      mon.root.position.set(1.28, 0.0, 0.28);
      mon.root.rotation.y = -Math.PI * 0.82;
      GQC.Atmosphere.addBlobShadow(mon.root, 0.52, 0.52, 0.62, 0.02);
      rig.root.add(mon.root);
      rig.monChar = mon;
      mon.setState('cheer');
      K.after(1.1, function () { if (mon.state === 'cheer') mon.setState('idle'); });
      GQC.Juice.attachIdleLife(mon.root, Math.PI, function () { return getCrewLookTarget(rig); });
    });
  }

  function getCrewLookTarget(rig) {
    if (activeProjectiles.length && activeProjectiles[0].rec && activeProjectiles[0].rec.body) {
      var tr = activeProjectiles[0].rec.body.translation();
      _focusTmp.set(tr.x, tr.y, tr.z);
      return _focusTmp;
    }
    _focusTmp.set(-Math.sin(rig.yaw) * 14.0, 2.0 + rig.pitch * 4.0, -14.0);
    return _focusTmp;
  }

  // CALIBRATED BALLISTICS: power 0.0..1.0 maps 100% cleanly across bay z = -3m .. -23m (zero overshoot!)
  function setRigAimFromNormalized(rig, yawRad, range01) {
    rig.yaw = K.clamp(yawRad, -0.56, 0.56);
    rig.power = K.clamp(range01, 0.05, 1.0);
    rig.pitch = 0.19 + rig.power * 0.35; // 11 deg .. 31 deg crisp arc!
  }

  function computeLaunchParams(rig, ammoKey) {
    var ammo = AMMO_TYPES[ammoKey || STATE.selectedAmmo] || AMMO_TYPES.iron;
    var speed = (15.5 + rig.power * 9.3) * ammo.speedMul; // 15.5 .. 24.8 m/s -> 50-66% hits center (-13.8m), 100% hits rear (-23m)!
    var dir = new T3.Vector3(0, 0, -1);
    dir.applyAxisAngle(new T3.Vector3(1, 0, 0), rig.pitch);
    dir.applyAxisAngle(new T3.Vector3(0, 1, 0), rig.yaw);
    dir.normalize();

    var muzzle = new T3.Vector3(0, 0.62, 0.02);
    rig.root.localToWorld(muzzle);
    muzzle.addScaledVector(dir, 0.82);

    var vel = dir.clone().multiplyScalar(speed);
    return { origin: muzzle, dir: dir, vel: vel, speed: speed, ammo: ammo };
  }

  function updateTrajectoryArc(rig, visible) {
    if (!visible) {
      rig.arcDots.count = 0;
      rig.landingRing.visible = false;
      return;
    }
    var lp = computeLaunchParams(rig, STATE.selectedAmmo);
    var ax = E3D.wind.x;
    var ay = -16.5;
    var az = E3D.wind.z;

    var vy = lp.vel.y, dy0 = lp.origin.y - 1.05;
    var disc = Math.max(0, vy * vy - 2 * ay * dy0);
    var tImpact = Math.min(2.6, (-vy - Math.sqrt(disc)) / ay);

    // True Angry-Birds short muzzle-only pointer: Skill (18%, 6 dots over near water) & Pro (11%, 4 dots) — zero free range-finder!
    var isWarmup = STATE.arcGuide === 'warmup' || STATE.arcGuide === 'calm';
    var isPro = STATE.arcGuide === 'pro';
    var frac = isWarmup ? 0.42 : isPro ? 0.11 : 0.18;
    var nDots = isWarmup ? 10 : isPro ? 4 : 6;
    var m4 = new T3.Matrix4(), p = new T3.Vector3(), q = new T3.Quaternion(), sc = new T3.Vector3();

    var teamHex = K.TEAMS[rig.activeTeamIdx % 4].hex;
    rig.arcDots.material.color.setHex(teamHex);
    rig.outerRing.material.color.setHex(teamHex);

    for (var i = 0; i < nDots; i++) {
      var t = ((i + 1) / nDots) * (tImpact * frac);
      var px = lp.origin.x + lp.vel.x * t + 0.5 * ax * t * t;
      var py = lp.origin.y + lp.vel.y * t + 0.5 * ay * t * t;
      var pz = lp.origin.z + lp.vel.z * t + 0.5 * az * t * t;

      // Smooth taper from 1.0 at muzzle down to tiny 0.25 tip so players read direction & power without free landing spot!
      var fade = 1.05 - (i / Math.max(1, nDots - 1)) * 0.78;
      p.set(px, py, pz);
      sc.setScalar(fade);
      m4.compose(p, q, sc);
      rig.arcDots.setMatrixAt(i, m4);
    }
    rig.arcDots.count = nDots;
    rig.arcDots.instanceMatrix.needsUpdate = true;

    var landX = lp.origin.x + lp.vel.x * tImpact + 0.5 * ax * tImpact * tImpact;
    var landZ = lp.origin.z + lp.vel.z * tImpact + 0.5 * az * tImpact * tImpact;
    rig.landingRing.position.set(landX, 1.08, landZ);
    rig.landingRing.visible = isWarmup;
  }

  /* =========================================================================
   * 4. STAGE BUILDER: MULTI-PRIMITIVE CRATES, SINKING SHIPS & 3-HP BOSS!
   * ========================================================================= */
  function clearStage() {
    if (physStage) {
      physStage.dispose(stageGroup);
      physStage = null;
    }
    movingShips = [];
    activeProjectiles = [];
    if (bossBarEl) { bossBarEl.remove(); bossBarEl = null; }
    if (aiManager) {
      var ents = aiManager.entities.slice();
      ents.forEach(function (e) { if (e._isShip) aiManager.remove(e); });
    }
    while (stageGroup.children.length) {
      stageGroup.remove(stageGroup.children[0]);
    }
    GQC.Water.clearColliders(5);
  }

  function rollStageWind(stageMeta) {
    if (STATE.arcGuide === 'warmup' || STATE.arcGuide === 'calm') {
      E3D.wind.set(0, 0, 0);
      E3D.uWind.value.set(0.18, 0.05);
      refreshWindPill();
      return;
    }
    var scale = STATE.arcGuide === 'pro' ? 1.15 : 0.68;
    var maxW = stageMeta.windMax * scale;
    // Guarantee non-zero breeze direction so wind flag & reading matter!
    var sign = Math.random() < 0.5 ? -1 : 1;
    var wx = sign * K.rnd(maxW * 0.42, maxW);
    var wz = K.rnd(-0.18, 0.18) * scale;
    E3D.wind.set(wx, 0, wz);
    E3D.uWind.value.set(wx * 0.45, wz * 0.45);
    refreshWindPill();
  }

  var TS = 1.38; // Pro Stylized Target Scale (1.38x juicy Angry-Birds readability!)

  function registerDestructibleBatches(ps) {
    // High-contrast color-graded + 1.38x scaled multi-primitive batches!
    ps.registerGLBBatch('crate', MODELS.woodCrate, 64, stageGroup, { visualScale: TS, gradeKind: 'crate' });
    ps.registerGLBBatch('beam',  MODELS.woodBeam,  36, stageGroup, { visualScale: TS, gradeKind: 'beam' });
    ps.registerGLBBatch('stone', MODELS.stoneBlk,  48, stageGroup, { visualScale: TS, gradeKind: 'stone' });
    ps.registerGLBBatch('tnt',   MODELS.tntKeg,    24, stageGroup, { visualScale: TS, gradeKind: 'tnt' });
    ps.registerGLBBatch('chest', MODELS.goldChest, 12, stageGroup, { visualScale: TS, gradeKind: 'chest' });
  }

  function makePennantFlag(x, baseY, z, hexCol, heightScale) {
    var hs = heightScale || 1.0;
    var grp = new T3.Group();
    grp.position.set(x, baseY, z);
    if (MODELS.dockPole) {
      var pole = MODELS.dockPole.scene.clone(true);
      K.fitModel(pole, 2.85 * hs);
      pole.castShadow = true;
      grp.add(pole);
    } else if (MODELS.woodBeam) {
      var p2 = MODELS.woodBeam.scene.clone(true);
      p2.rotation.z = Math.PI * 0.5;
      p2.scale.set(1.1 * hs, 0.18, 0.18);
      p2.position.y = 1.35 * hs;
      grp.add(p2);
    }
    var pGeo = new T3.BufferGeometry();
    // Crisp forked pirate pennant banner fluttering in the sea breeze!
    var verts = new Float32Array([
      0.0,  0.26, 0,   1.35,  0.09, 0,   0.0, -0.26, 0,
      0.0, -0.26, 0,   1.35,  0.09, 0,   1.12, -0.14, 0
    ]);
    pGeo.setAttribute('position', new T3.BufferAttribute(verts, 3));
    pGeo.computeVertexNormals();
    var pMat = new T3.MeshStandardMaterial({
      color: hexCol || 0xe63946,
      roughness: 0.52,
      side: T3.DoubleSide
    });
    var pMesh = new T3.Mesh(pGeo, pMat);
    pMesh.position.set(0.06, 2.52 * hs, 0);
    pMesh.castShadow = true;
    grp.add(pMesh);
    GQC.Atmosphere.addBlobShadow(grp, 0.45, 0.45, 0.55, 0.02);
    stageGroup.add(grp);

    var ph = x * 0.7 + z * 0.3;
    K.onFrame(function (dt, t) {
      if (!pMesh.parent) return;
      pMesh.rotation.y = Math.sin(t * 5.8 + ph) * 0.22 + (E3D.wind.x >= 0 ? 0.12 : Math.PI - 0.12);
    });
    return grp;
  }

  function dressPlayableIsland(cx, baseY, cz, scale, opts) {
    // Surrounds a playable sandbar with tilted swaying palms, faceted coastal boulders,
    // wooden dock, palisade stakes & fluttering red/gold pennants — NEVER blocking front aim sightlines!
    opts = opts || {};
    var rx = 4.15 * scale;
    var rz = 3.25 * scale;

    // 1) Subtle darkened AO contact pad right beneath the fort footprint!
    var aoPad = new T3.Group();
    aoPad.position.set(cx, baseY + 0.01, cz - 0.2);
    GQC.Atmosphere.addBlobShadow(aoPad, 2.35 * scale, 1.65 * scale, 0.52, 0.01);
    stageGroup.add(aoPad);

    // 2) Curved, tilted low-poly Palm Trees on left/right/rear perimeter wings
    var palmPool = [MODELS.palm1, MODELS.palm2, MODELS.palm3].filter(Boolean);
    if (palmPool.length) {
      var palmSpots = opts.main
        ? [
            { ox: -rx * 0.86, oz: -0.5, h: 5.4, lean:  0.20, ry: 0.7 },
            { ox:  rx * 0.88, oz: -0.7, h: 5.8, lean: -0.22, ry: -1.1 },
            { ox: -rx * 0.52, oz: -rz * 0.85, h: 4.8, lean: 0.15, ry: 2.1 },
            { ox:  rx * 0.56, oz: -rz * 0.82, h: 4.5, lean: -0.16, ry: -2.3 }
          ]
        : [
            { ox: (cx < 0 ? -rx * 0.82 : rx * 0.82), oz: -0.6, h: 4.7 * scale + 0.8, lean: cx < 0 ? 0.20 : -0.20, ry: cx * 0.4 }
          ];
      palmSpots.forEach(function (ps, idx) {
        var pm = palmPool[(idx + (opts.seed || 0)) % palmPool.length].scene.clone(true);
        K.fitModel(pm, ps.h);
        pm.position.set(cx + ps.ox, baseY - 0.16, cz + ps.oz);
        pm.rotation.y = ps.ry;
        pm.rotation.z = ps.lean;
        GQC.Atmosphere.addBlobShadow(pm, 1.15, 1.15, 0.58, 0.04);
        stageGroup.add(pm);
      });
    }

    // 3) Clusters of faceted coastal boulders + tropical flower bushes + coconuts
    var rockPool = [MODELS.rock1, MODELS.rockMed1, MODELS.rockMed2].filter(Boolean);
    if (rockPool.length) {
      var rSpots = [
        { ox: -rx * 0.92, oz: 0.65, s: 1.45 },
        { ox: -rx * 0.76, oz: 1.05, s: 0.95 },
        { ox:  rx * 0.90, oz: 0.55, s: 1.35 }
      ];
      rSpots.forEach(function (rs, idx) {
        if (!opts.main && idx === 1) return;
        var rk = rockPool[(idx + (opts.seed || 0)) % rockPool.length].scene.clone(true);
        K.fitModel(rk, rs.s * scale);
        rk.position.set(cx + rs.ox, baseY - 0.25, cz + rs.oz);
        rk.rotation.y = idx * 1.9;
        GQC.Atmosphere.addBlobShadow(rk, 0.85 * scale, 0.85 * scale, 0.56, 0.05);
        stageGroup.add(rk);
      });
    }

    if (opts.main) {
      // 4) Weathered Wooden Dock jutting off the right beach + barrels!
      if (MODELS.dock) {
        var dk = MODELS.dock.scene.clone(true);
        K.fitModel(dk, 3.6);
        dk.position.set(cx + rx * 0.98, 0.08, cz + 1.15);
        dk.rotation.y = Math.PI * 0.42;
        dk.traverse(function (n) { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
        stageGroup.add(dk);
      }
      if (MODELS.barrelProp) {
        var brl = MODELS.barrelProp.scene.clone(true);
        K.fitModel(brl, 0.92);
        brl.position.set(cx + rx * 0.68, baseY - 0.04, cz + 0.85);
        GQC.Atmosphere.addBlobShadow(brl, 0.5, 0.5, 0.55, 0.02);
        stageGroup.add(brl);
      }
      if (MODELS.coconuts) {
        var coco = MODELS.coconuts.scene.clone(true);
        K.fitModel(coco, 0.82);
        coco.position.set(cx - rx * 0.72, baseY - 0.04, cz - 0.15);
        stageGroup.add(coco);
      }
      if (MODELS.flowerBush) {
        [-1, 1].forEach(function (sDir) {
          var fb = MODELS.flowerBush.scene.clone(true);
          K.fitModel(fb, 1.15);
          fb.position.set(cx + sDir * rx * 0.64, baseY - 0.05, cz - 1.1);
          stageGroup.add(fb);
        });
      }
      // 5) Tilted Wooden Palisade Stakes along outer flanks
      if (MODELS.dockPole) {
        [-rx * 0.58, -rx * 0.47, rx * 0.47, rx * 0.58].forEach(function (px, idx) {
          var st = MODELS.dockPole.scene.clone(true);
          K.fitModel(st, 1.45 + (idx % 2) * 0.22);
          st.position.set(cx + px, baseY - 0.12, cz + 1.35);
          st.rotation.z = (px < 0 ? 0.14 : -0.14);
          st.rotation.x = 0.12;
          st.traverse(function (n) { if (n.isMesh) n.castShadow = true; });
          stageGroup.add(st);
        });
      }
      // 6) Fluttering Crimson & Gold Pirate Pennants!
      makePennantFlag(cx - rx * 0.48, baseY - 0.05, cz - 1.55, 0xe63946, 1.08);
      makePennantFlag(cx + rx * 0.48, baseY - 0.05, cz - 1.55, 0xffb320, 1.08);
    } else {
      makePennantFlag(cx + (cx < 0 ? -rx * 0.52 : rx * 0.52), baseY - 0.06, cz - 1.1, cx < 0 ? 0xffb320 : 0xe63946, 0.92);
    }
  }

  function addSandbarPlatform(ps, x, z, scale, foamSlot, dressOpts) {
    var topY = 0.92 * scale;
    if (MODELS.sandbar) {
      var sb = MODELS.sandbar.scene.clone(true);
      sb.position.set(x, -0.15, z);
      sb.scale.setScalar(scale);
      sb.receiveShadow = true;
      stageGroup.add(sb);
    }
    ps.addStaticBox(4.3 * scale, 0.6, 3.7 * scale, { x: x, y: topY - 0.6, z: z }, 0, 'island');
    if (foamSlot) GQC.Water.setCollider(foamSlot, x, z, 4.9 * scale, 1.0);
    if (dressOpts !== false) {
      dressPlayableIsland(x, topY, z, scale, dressOpts || {});
    }
    return topY;
  }

  function spawnStoneParapetWall(ps, cx, baseY, cz, cols, rows) {
    // 1.38x Heavy stone shield parapet in front of TNT/Treasure!
    var bw = 0.92 * TS, bh = 0.98 * TS;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var ox = (c - (cols - 1) * 0.5) * (bw + 0.05);
        ps.addDynamicBlock({
          batchKey: 'stone', shape: 'box', hx: 0.44 * TS, hy: 0.48 * TS, hz: 0.42 * TS,
          pos: { x: cx + ox, y: baseY + 0.48 * TS + r * (bh + 0.015), z: cz },
          density: 3.8, tag: 'stone', points: 10, sleepInitially: true
        });
      }
    }
  }

  function spawnPatrolBuoy(ps, zPos, ampX, speed, phase, foamSlot) {
    if (!MODELS.buoy) return;
    var bm = MODELS.buoy.scene.clone(true);
    bm.position.set(0, 0.08, zPos);
    stageGroup.add(bm);
    var br = ps.addKinematicBody(0.88, 0.78, 0.88, { x: 0, y: 0.58, z: zPos }, 'buoy', { buoyMesh: bm });
    movingShips.push({
      group: bm, kinRec: br, baseX: 0, baseZ: zPos,
      swayAmp: ampX, swaySpeed: speed, swayPhase: phase || 0,
      foamIdx: foamSlot || 14, attachments: []
    });
  }

  function spawnCratePyramid(ps, cx, baseY, cz, rows, withTnt, withChest) {
    var cw = 0.90 * TS, ch = 0.92 * TS;
    for (var r = 0; r < rows; r++) {
      var cols = rows - r;
      var y = baseY + ch * 0.5 + r * (ch + 0.015);
      for (var c = 0; c < cols; c++) {
        var x = cx + (c - (cols - 1) * 0.5) * (cw + 0.06);
        var isTnt = withTnt && ((r === 0 && c === Math.floor(cols / 2)) || (rows >= 3 && r === 1 && c === 0));
        if (isTnt) {
          ps.addDynamicBlock({
            batchKey: 'tnt', shape: 'cylinder', radius: 0.36 * TS, hy: 0.46 * TS,
            pos: { x: x, y: y, z: cz }, density: 1.4, tag: 'tnt', points: 35, sleepInitially: true
          });
        } else {
          ps.addDynamicBlock({
            batchKey: 'crate', shape: 'box', hx: 0.43 * TS, hy: 0.46 * TS, hz: 0.44 * TS,
            pos: { x: x, y: y, z: cz }, density: 1.1, tag: 'crate', points: 15, sleepInitially: true
          });
        }
      }
    }
    if (withChest) {
      ps.addDynamicBlock({
        batchKey: 'chest', shape: 'box', hx: 0.50 * TS, hy: 0.46 * TS, hz: 0.44 * TS,
        pos: { x: cx, y: baseY + rows * (ch + 0.015) + 0.46 * TS, z: cz },
        density: 1.3, tag: 'chest', points: 50, sleepInitially: true
      });
    }
  }

  function spawnStoneGateTower(ps, cx, baseY, cz, stories) {
    // Tiered Multi-Material Pirate Mini-Fort: Stone Pillars + Wooden Crossbeam + Crimson TNT Core + Crowned Gold Chest!
    var y = baseY;
    for (var s = 0; s < stories; s++) {
      [-1.04 * TS, 1.04 * TS].forEach(function (ox) {
        ps.addDynamicBlock({
          batchKey: 'stone', shape: 'box', hx: 0.42 * TS, hy: 0.50 * TS, hz: 0.42 * TS,
          pos: { x: cx + ox, y: y + 0.50 * TS, z: cz }, rotY: Math.PI * 0.5,
          density: 2.2, tag: 'stone', points: 20, sleepInitially: true
        });
      });
      ps.addDynamicBlock({
        batchKey: s === 0 ? 'tnt' : 'crate',
        shape: s === 0 ? 'cylinder' : 'box',
        radius: 0.36 * TS, hx: 0.43 * TS, hy: 0.46 * TS, hz: 0.44 * TS,
        pos: { x: cx, y: y + 0.46 * TS, z: cz },
        density: 1.3, tag: s === 0 ? 'tnt' : 'crate', points: s === 0 ? 35 : 15, sleepInitially: true
      });
      y += 1.02 * TS;
      ps.addDynamicBlock({
        batchKey: 'beam', shape: 'box', hx: 1.22 * TS, hy: 0.34 * TS, hz: 0.35 * TS,
        pos: { x: cx, y: y + 0.34 * TS, z: cz },
        density: 1.5, tag: 'beam', points: 20, sleepInitially: true
      });
      y += 0.69 * TS;
    }
    ps.addDynamicBlock({
      batchKey: 'chest', shape: 'box', hx: 0.50 * TS, hy: 0.46 * TS, hz: 0.44 * TS,
      pos: { x: cx, y: y + 0.46 * TS, z: cz },
      density: 1.3, tag: 'chest', points: 50, sleepInitially: true
    });
  }

  function makeRiggedSailAssembly(badgeNum, text, imgUrl) {
    var badgeColors = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a'];
    var bc = badgeColors[(badgeNum - 1) % 4];
    var cv = document.createElement('canvas');
    cv.width = 512; cv.height = 340;
    var g = cv.getContext('2d');

    function drawCard(loadedImg) {
      g.fillStyle = bc;
      g.fillRect(0, 0, 512, 340);
      g.fillStyle = '#fff9ee';
      K.roundRect(g, 16, 16, 480, 308, 28);
      g.fill();

      g.fillStyle = bc;
      K.roundRect(g, 28, 28, 72, 60, 20);
      g.fill();
      g.fillStyle = '#ffffff';
      g.font = '900 42px Nunito, Trebuchet MS, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(String(badgeNum), 64, 60);

      var words = String(text || '').trim();
      if (loadedImg) {
        g.drawImage(loadedImg, 190, 24, 132, 132);
        g.fillStyle = '#2b1d40';
        g.font = '900 ' + (words.length > 16 ? '38' : '46') + 'px Nunito, Trebuchet MS, sans-serif';
        wrapCanvasText(g, words, 256, 234, 430, 46);
      } else {
        g.fillStyle = '#2b1d40';
        var fs = words.length > 22 ? 40 : words.length > 12 ? 50 : 62;
        g.font = '900 ' + fs + 'px Nunito, Trebuchet MS, sans-serif';
        wrapCanvasText(g, words, 256, 186, 436, fs * 1.12);
      }
    }
    drawCard(null);
    var tex = new T3.CanvasTexture(cv);
    tex.colorSpace = T3.SRGBColorSpace;
    tex.anisotropy = 4;
    if (imgUrl) {
      var im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = function () { drawCard(im); tex.needsUpdate = true; };
      im.src = K.ROOT + imgUrl;
    }

    var assembly = new T3.Group();
    // Wooden Mast & Crossbar Yardarm so the sail is genuinely rigged onto the pirate sloop!
    if (MODELS.woodBeam) {
      var mast = MODELS.woodBeam.scene.clone(true);
      mast.rotation.z = Math.PI * 0.5;
      mast.scale.set(1.55, 0.24, 0.24);
      mast.position.set(0, 2.25, 0.05);
      assembly.add(mast);

      var yard = MODELS.woodBeam.scene.clone(true);
      yard.scale.set(1.58, 0.20, 0.20);
      yard.position.set(0, 3.88, 0.12);
      assembly.add(yard);
    }

    var geo = new T3.PlaneGeometry(3.55, 2.36, 10, 5);
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var u = (pos.getX(i) / 3.55) + 0.5;
      var v = (pos.getY(i) / 2.36) + 0.5;
      pos.setZ(i, Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.34);
    }
    geo.computeVertexNormals();
    var sailMesh = new T3.Mesh(geo, new T3.MeshStandardMaterial({
      map: tex, roughness: 0.65, metalness: 0.0, side: T3.DoubleSide
    }));
    sailMesh.position.set(0, 2.68, 0.26);
    sailMesh.castShadow = true;
    assembly.add(sailMesh);
    return assembly;
  }

  function wrapCanvasText(ctx, text, cx, cy, maxW, lineH) {
    var parts = text.split(/\s+/);
    var lines = [], cur = '';
    parts.forEach(function (w) {
      var test = cur ? (cur + ' ' + w) : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
      else { cur = test; }
    });
    if (cur) lines.push(cur);
    var startY = cy - ((lines.length - 1) * lineH) * 0.5;
    lines.forEach(function (ln, idx) { ctx.fillText(ln, cx, startY + idx * lineH); });
  }

  function buildTargetShootStage(item, stageIdx, keepExistingPhysics) {
    if (!keepExistingPhysics) {
      clearStage();
      var meta = STAGE_META[(stageIdx - 1) % STAGE_META.length];
      rollStageWind(meta);
      physStage = new E3D.PhysicsStage({ onCollision: handlePhysicsCollision });
      registerDestructibleBatches(physStage);
    }

    STATE.targetSunk = false;
    var choices = K.shuffle([item.a].concat((item.w || ['wrong 1', 'wrong 2']).slice(0, 2)));
    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    var spreadX = STATE.phase === 'duel' ? 6.4 : (asp < 0.75 ? 5.9 : asp < 1.05 ? 7.4 : 8.8);
    var laneX = [-spreadX, 0.0, spreadX];
    var laneZ = [-13.4, -15.6, -13.4];

    choices.forEach(function (ans, idx) {
      var isRight = ans === item.a;
      var x = laneX[idx], z = laneZ[idx];

      var shipGrp = new T3.Group();
      shipGrp.position.set(x, 0.05, z);
      stageGroup.add(shipGrp);

      if (MODELS.sloop) {
        var hull = MODELS.sloop.scene.clone(true);
        hull.scale.setScalar(1.22); // Proportioned cleanly to rigged sail!
        hull.rotation.y = idx === 0 ? Math.PI : 0;
        shipGrp.add(hull);
      }

      var deckTnt = null, deckChest = null;
      if (MODELS.tntKeg) {
        deckTnt = MODELS.tntKeg.scene.clone(true);
        deckTnt.position.set(-0.55, 1.02, -0.1);
        shipGrp.add(deckTnt);
      }
      if (isRight && MODELS.goldChest) {
        deckChest = MODELS.goldChest.scene.clone(true);
        deckChest.position.set(0.55, 1.02, -0.1);
        shipGrp.add(deckChest);
      }

      var sailRig = makeRiggedSailAssembly(idx + 1, ans, '');
      shipGrp.add(sailRig);

      var speedMul = STATE.arcGuide === 'pro' ? 1.35 : 1.0;
      var shipObj = {
        group: shipGrp,
        kinRec: null,
        deckTnt: deckTnt,
        deckChest: deckChest,
        baseX: x,
        baseZ: z,
        swayAmp: (STATE.phase === 'duel' ? 0.95 : (1.35 + stageIdx * 0.42)) * speedMul,
        swaySpeed: (1.06 + stageIdx * 0.16) * speedMul,
        swayPhase: idx * 2.15,
        foamIdx: 10 + idx,
        sinking: false,
        sinkT: 0,
        attachments: []
      };

      // Honest tight hull+sail hitbox so sloppy near-misses splash into the sea instead of gifting free hits!
      var kinRec = physStage.addKinematicBody(1.52, 1.82, 1.05, { x: x, y: 2.0, z: z }, isRight ? 'right_ship' : 'wrong_ship', {
        isRight: isRight,
        answer: ans,
        shipObj: shipObj
      });
      shipObj.kinRec = kinRec;

      if (isRight && STATE.phase !== 'duel') {
        var deckY = addSandbarPlatform(physStage, x, z - 3.4, 0.72, 6 + idx, false);
        spawnCratePyramid(physStage, x, deckY, z - 3.4, 2, true, true);
      } else if (!isRight && MODELS.buoy) {
        var buoyMesh = MODELS.buoy.scene.clone(true);
        buoyMesh.position.set(x, 0.08, z + 2.2);
        stageGroup.add(buoyMesh);
        var buoyRec = physStage.addKinematicBody(0.85, 0.75, 0.85, { x: x, y: 0.55, z: z + 2.2 }, 'buoy', {
          buoyMesh: buoyMesh,
          answer: ans
        });
        shipObj.attachments.push({ buoyMesh: buoyMesh, buoyRec: buoyRec, offsetZ: 2.2 });
      }

      GQC.Water.setCollider(10 + idx, x, z, 2.8, 0.92);
      movingShips.push(shipObj);
    });

    // Patrolling Front Guard Buoy across the bay — players must TIME their shot through the gap!
    if (STATE.arcGuide !== 'warmup' && STATE.arcGuide !== 'calm') {
      spawnPatrolBuoy(physStage, -9.4, STATE.phase === 'duel' ? 4.2 : 5.4, 1.42, 0.4, 14);
    }
  }

  function updateBossHudBar() {
    if (STATE.round !== 4 || STATE.playLoop === 'target') {
      if (bossBarEl) { bossBarEl.remove(); bossBarEl = null; }
      return;
    }
    if (!bossBarEl) {
      bossBarEl = K.ui.add(K.el('div', 'cn-boss-bar'));
    }
    var hearts = '';
    for (var i = 0; i < STATE.bossMaxHp; i++) {
      hearts += i < STATE.bossHp ? '❤️' : '🖤';
    }
    bossBarEl.innerHTML = '🏴‍☠️ Captain Flint\u2019s Flagship <span>' + hearts + '</span>';
  }

  function sinkShipObject(shipObj) {
    if (!shipObj || shipObj.sinking) return;
    shipObj.sinking = true;
    shipObj.sinkT = 0;
    if (shipObj.deckTnt) shipObj.deckTnt.visible = false;
    if (shipObj.deckChest) shipObj.deckChest.visible = false;
    if (shipObj.kinRec) physStage.hideRecord(shipObj.kinRec);
    E3D.Audio.shipSinkGlug();
  }

  function buildSmashStage(stageIdx) {
    clearStage();
    var sNum = ((stageIdx - 1) % 4) + 1;
    var meta = STAGE_META[sNum - 1];
    rollStageWind(meta);

    physStage = new E3D.PhysicsStage({ onCollision: handlePhysicsCollision });
    registerDestructibleBatches(physStage);

    if (sNum === 1) {
      // STAGE 1: Richly Dressed Fortified Sandbar Cove — Tiered 2-Story Pirate Mini-Fort + Stone Parapet + Flanking Bastions!
      var yC = addSandbarPlatform(physStage, 0, -14.5, 1.26, 6, { main: true, seed: 0 });
      spawnStoneParapetWall(physStage, 0, yC, -11.9, 2, 1);
      spawnStoneGateTower(physStage, 0, yC, -14.8, 2);

      var yL = addSandbarPlatform(physStage, -8.4, -17.0, 0.90, 7, { main: false, seed: 1 });
      spawnCratePyramid(physStage, -8.4, yL, -17.0, 2, true, false);

      var yR = addSandbarPlatform(physStage, 8.4, -17.0, 0.90, 8, { main: false, seed: 2 });
      spawnCratePyramid(physStage, 8.4, yR, -17.0, 2, true, false);

      spawnPatrolBuoy(physStage, -9.2, 4.4, 1.28, 0.8, 14);
    } else if (sNum === 2) {
      // STAGE 2: Fast Moving Pirate Fleet + Dressed Central Citadel!
      var yM = addSandbarPlatform(physStage, 0, -16.8, 1.12, 6, { main: true, seed: 1 });
      spawnStoneParapetWall(physStage, 0, yM, -14.5, 2, 1);
      spawnStoneGateTower(physStage, 0, yM, -17.2, 2);

      [-1, 1].forEach(function (dir, idx) {
        var grp = new T3.Group();
        var bz = idx === 0 ? -12.0 : -20.0;
        grp.position.set(dir * -8, 0.05, bz);
        if (MODELS.sloop) {
          var sl = MODELS.sloop.scene.clone(true);
          sl.scale.setScalar(1.15);
          sl.rotation.y = dir > 0 ? Math.PI : 0;
          grp.add(sl);
        }
        var tk = MODELS.tntKeg ? MODELS.tntKeg.scene.clone(true) : null;
        if (tk) { tk.position.set(-0.5, 1.0, 0); grp.add(tk); }
        var gc = MODELS.goldChest ? MODELS.goldChest.scene.clone(true) : null;
        if (gc) { gc.position.set(0.55, 0.98, 0); grp.add(gc); }
        stageGroup.add(grp);

        var veh = E3D.AI.createPatrolVehicle([[-9.5, 0, bz], [9.5, 0, bz]], 4.5 + idx * 0.75, true);
        if (veh && aiManager) { veh._isShip = true; aiManager.add(veh); }

        var shipObj = {
          group: grp, vehicle: veh, kinRec: null, deckTnt: tk, deckChest: gc,
          baseX: 0, baseZ: bz, foamIdx: 10 + idx, sinking: false, sinkT: 0, attachments: []
        };
        var kin = physStage.addKinematicBody(1.75, 1.35, 1.05, { x: grp.position.x, y: 1.1, z: bz }, 'bonus_ship', {
          shipObj: shipObj, points: 85
        });
        shipObj.kinRec = kin;
        movingShips.push(shipObj);
      });
    } else if (sNum === 3) {
      // STAGE 3: Twin Fortified Stone Fortresses + Dressed Rear Citadel!
      var y1 = addSandbarPlatform(physStage, -6.4, -15.2, 1.06, 6, { main: false, seed: 0 });
      spawnStoneParapetWall(physStage, -6.4, y1, -13.0, 2, 1);
      spawnStoneGateTower(physStage, -6.4, y1, -15.5, 2);

      var y2 = addSandbarPlatform(physStage, 6.4, -15.2, 1.06, 7, { main: false, seed: 2 });
      spawnStoneParapetWall(physStage, 6.4, y2, -13.0, 2, 1);
      spawnStoneGateTower(physStage, 6.4, y2, -15.5, 2);

      var y3 = addSandbarPlatform(physStage, 0, -19.8, 1.04, 8, { main: true, seed: 1 });
      spawnStoneParapetWall(physStage, 0, y3, -17.4, 2, 1);
      spawnCratePyramid(physStage, 0, y3, -20.0, 3, true, true);

      spawnPatrolBuoy(physStage, -10.0, 5.2, 1.55, 0.0, 13);
      spawnPatrolBuoy(physStage, -11.8, 4.6, 1.35, Math.PI, 14);
    } else {
      // STAGE 4: 3-HP Armored Boss Flagship (Faster Weave + Twin Flanking Shield Buoys!)
      STATE.bossHp = 3;
      STATE.bossMaxHp = 3;
      updateBossHudBar();

      var bossGrp = new T3.Group();
      bossGrp.position.set(0, 0.1, -17.6);
      if (MODELS.flagship) bossGrp.add(MODELS.flagship.scene.clone(true));
      var bTnt = MODELS.tntKeg ? MODELS.tntKeg.scene.clone(true) : null;
      if (bTnt) { bTnt.position.set(0, 2.2, 0); bTnt.scale.setScalar(1.3); bossGrp.add(bTnt); }
      var bChest = MODELS.goldChest ? MODELS.goldChest.scene.clone(true) : null;
      if (bChest) { bChest.position.set(1.2, 2.2, 0); bChest.scale.setScalar(1.25); bossGrp.add(bChest); }
      stageGroup.add(bossGrp);

      var bossShipObj = {
        group: bossGrp, kinRec: null, deckTnt: bTnt, deckChest: bChest,
        baseX: 0, baseZ: -17.6, swayAmp: 4.3, swaySpeed: 1.28, swayPhase: 0, foamIdx: 10,
        sinking: false, sinkT: 0, wobble: 0, attachments: []
      };
      var bossKin = physStage.addKinematicBody(2.85, 2.55, 1.55, { x: 0, y: 2.3, z: -17.6 }, 'boss_ship', {
        shipObj: bossShipObj, points: 90
      });
      bossShipObj.kinRec = bossKin;

      // Twin escort bumper buoys flanking the Boss Flagship's bow!
      if (MODELS.buoy) {
        [-2.7, 2.7].forEach(function (ox) {
          var ebm = MODELS.buoy.scene.clone(true);
          ebm.position.set(ox, 0.08, -14.6);
          stageGroup.add(ebm);
          var ebr = physStage.addKinematicBody(0.9, 0.8, 0.9, { x: ox, y: 0.58, z: -14.6 }, 'buoy', { buoyMesh: ebm });
          bossShipObj.attachments.push({ buoyMesh: ebm, buoyRec: ebr, offsetX: ox, offsetZ: 3.0 });
        });
      }
      movingShips.push(bossShipObj);

      var yBL = addSandbarPlatform(physStage, -8.6, -14.2, 0.98, 6, { main: false, seed: 1 });
      spawnStoneGateTower(physStage, -8.6, yBL, -14.2, 2);

      var yBR = addSandbarPlatform(physStage, 8.6, -14.2, 0.98, 7, { main: false, seed: 2 });
      spawnStoneGateTower(physStage, 8.6, yBR, -14.2, 2);
    }
  }

  /* =========================================================================
   * 5. COLLISION EVENTS, REAL SINKING SHIPS, BOSS HP & FIXED DUEL SCORING
   * ========================================================================= */
  var _lastCrunchAt = 0;

  function awardHitPoints(pts, worldPos, labelOverride, teamIdxOverride) {
    var mult = STAGE_META[(STATE.round - 1) % 4].mult || 1;
    var total = Math.round(pts * mult);
    var tIdx = teamIdxOverride != null ? teamIdxOverride : STATE.turnIdx;
    STATE.shotScore += total;

    // Update live team score in ALL modes (including 2-Kid Split Duel!)
    if (STATE.teams[tIdx]) {
      STATE.teams[tIdx].score = (STATE.teams[tIdx].score || 0) + total;
      if (hudBar) {
        hudBar.refresh(STATE.phase === 'duel' ? tIdx : STATE.turnIdx);
        hudBar.bump(tIdx);
      }
    }
    var col = K.TEAMS[tIdx % 4].c;
    var activeCam = STATE.phase === 'duel' ? (tIdx === 0 ? camDuelLeft : camDuelRight) : K.camera;
    GQC.Juice.popupScore(labelOverride || ('+' + total + '!'), worldPos, activeCam, col, total >= 50 ? 1.25 : 1.0);
  }

  function triggerTntExplosion(pos, teamIdx) {
    E3D.Audio.tntBoom();
    if (STATE.boardMode !== 'duel') GQC.Juice.hitstop(42);
    GQC.Juice.shakeCamera(0.46, 0.40);
    GQC.Juice.spawnBurst(stageGroup, pos, 'stars', 18);
    GQC.Juice.spawnBurst(stageGroup, pos, 'splinters', 12);
    K.fx.ring(pos, 0xffb320, 6.2);
    K.fx.puff(pos, 14, { color: 0xffe4a0, size: 1.7, spread: 2.1, life: 1.15 });
    if (physStage) physStage.radialExplosion(pos, 6.2, 26.0);
  }

  function handlePhysicsCollision(a, b) {
    var ammoRec = a.tag === 'ammo' ? a : (b.tag === 'ammo' ? b : null);
    var other = ammoRec === a ? b : a;

    // 1. Direct TNT Keg detonation
    if ((a.tag === 'tnt' || b.tag === 'tnt')) {
      var tnt = a.tag === 'tnt' ? a : b;
      var hitter = tnt === a ? b : a;
      if (!tnt.exploded && tnt.body && (hitter.tag === 'ammo' || (hitter.body && hitter.kind === 'dynamic' && hitter.body.linvel().y < -3.2))) {
        tnt.exploded = true;
        var tp = tnt.body.translation();
        var vPos = new T3.Vector3(tp.x, tp.y, tp.z);
        var ownerIdx = (ammoRec && ammoRec.data.teamIdx != null) ? ammoRec.data.teamIdx : STATE.turnIdx;
        physStage.hideRecord(tnt);
        awardHitPoints(tnt.points || 35, vPos, '💥 BOOM +35', ownerIdx);
        triggerTntExplosion(vPos, ownerIdx);
        return;
      }
    }

    if (!ammoRec || !ammoRec.body) return;
    var ap = ammoRec.body.translation();
    var hitPos = new T3.Vector3(ap.x, ap.y, ap.z);
    var tIdx = ammoRec.data.teamIdx != null ? ammoRec.data.teamIdx : STATE.turnIdx;

    if (ammoRec.data.ammoType === 'bomb' && !ammoRec.data.detonated && other.tag !== 'ammo') {
      ammoRec.data.detonated = true;
      triggerTntExplosion(hitPos, tIdx);
    }

    // 2. Quick-Target-Shoot Ships (Right Ship Explodes & Sinks! In Duel mode, spawns next live English Clue!)
    if (other.tag === 'right_ship' && !other.data.scored) {
      other.data.scored = true;
      STATE.targetSunk = true;
      K.sfx('bullseye');
      K.fx.confetti(hitPos, 45);
      triggerTntExplosion(hitPos, tIdx);
      sinkShipObject(other.data.shipObj);
      awardHitPoints(75, hitPos, '🎯 SUNK! +75', tIdx);

      var sp = K.cls && K.cls.speaker && K.cls.speaker(STATE.teams[tIdx]);
      if (sp) { sp.turns++; sp.right++; STATE.teams[tIdx].speakerIdx = (STATE.teams[tIdx].speakerIdx || 0) + 1; }
      var activeRig = cannons[STATE.phase === 'duel' ? (tIdx % 2) : 0];
      if (activeRig && activeRig.kidChar) activeRig.kidChar.setState('cheer');
      if (activeRig && activeRig.monChar) activeRig.monChar.setState('cheer');

      if (STATE.phase === 'duel') {
        K.after(1.4, function () {
          if (STATE.phase === 'duel') spawnDuelEnglishWave();
        });
      }
      return;
    }

    if ((other.tag === 'wrong_ship' || other.tag === 'buoy') && !ammoRec.data.bouncedWrong) {
      ammoRec.data.bouncedWrong = true;
      E3D.Audio.buoyBoing();
      K.fx.ring(hitPos, 0x4f9dff, 3.2);
      K.fx.text('Boing! Wrong sail!', hitPos, '#4f9dff', 1.35);
      ammoRec.body.setLinvel({ x: K.rnd(-4, 4), y: 11.5, z: 9.5 }, true);
      if (other.data && other.data.buoyMesh) {
        other.data.buoyMesh.scale.set(1.32, 0.72, 1.32);
        K.after(0.18, function () { if (other.data.buoyMesh) other.data.buoyMesh.scale.set(1, 1, 1); });
      }
      return;
    }

    // 3. Stage 2 Moving Pirate Sloop -> Real Deck TNT Detonation + Ship Lists & Sinks!
    if (other.tag === 'bonus_ship' && !ammoRec.data.hitShip) {
      ammoRec.data.hitShip = true;
      K.fx.confetti(hitPos, 36);
      triggerTntExplosion(hitPos, tIdx);
      sinkShipObject(other.data.shipObj);
      awardHitPoints(other.data.points || 75, hitPos, '⛵ SHIP SUNK! +75', tIdx);
      return;
    }

    // 4. Stage 4 3-HP Captain Flint's Boss Flagship!
    if (other.tag === 'boss_ship' && !ammoRec.data.hitShip) {
      ammoRec.data.hitShip = true;
      STATE.bossHp = Math.max(0, STATE.bossHp - 1);
      updateBossHudBar();
      var bShip = other.data.shipObj;
      if (bShip) bShip.wobble = 1.0;

      if (STATE.bossHp <= 0) {
        // GRAND BOSS SINKING FINALE!
        K.sfx('win');
        K.fx.confetti(hitPos, 75);
        triggerTntExplosion(hitPos, tIdx);
        sinkShipObject(bShip);
        awardHitPoints(150, hitPos, '👑 BOSS SUNK! +150', tIdx);
      } else {
        E3D.Audio.woodCrunch(1.2);
        triggerTntExplosion(hitPos, tIdx);
        if (STATE.bossHp === 2 && bShip && bShip.deckTnt) bShip.deckTnt.visible = false;
        awardHitPoints(80, hitPos, '🏴‍☠️ BOSS HIT! (' + STATE.bossHp + ' ❤️ left)', tIdx);
      }
      return;
    }

    // 5. Dynamic Crates, Wood Beams, Stone Blocks & Gold Chests!
    if (other.kind === 'dynamic') {
      if (K.now - _lastCrunchAt > 0.08) {
        _lastCrunchAt = K.now;
        E3D.Audio.woodCrunch(0.85);
      }
      if (!other.scored) {
        other.scored = true;
        GQC.Juice.spawnBurst(stageGroup, hitPos, other.tag === 'chest' ? 'stars' : (other.tag === 'stone' ? 'dust' : 'splinters'));
        if (other.tag === 'chest') {
          K.sfx('bullseye');
          K.fx.confetti(hitPos, 35);
          physStage.hideRecord(other);
          awardHitPoints(50, hitPos, '👑 CHEST +50!', tIdx);
        } else {
          awardHitPoints(other.points || 15, hitPos, null, tIdx);
        }
        if (STATE.boardMode !== 'duel' && STATE.phase === 'flight' && !ammoRec.data.impactCamTriggered) {
          ammoRec.data.impactCamTriggered = true;
          GQC.Juice.hitstop(38);
          GQC.Juice.shakeCamera(0.30, 0.28);
          K.cam.follow = null;
          K.cam.set(
            new T3.Vector3(hitPos.x * 0.55 + 4.5, Math.max(3.8, hitPos.y + 3.0), hitPos.z + 9.8),
            new T3.Vector3(hitPos.x, Math.max(1.0, hitPos.y - 0.2), hitPos.z),
            4.2
          );
        }
      }
    }
  }

  /* =========================================================================
   * 6. FIRING CANNONBALLS, FLIGHT WHISTLE & MID-AIR SPECIALS
   * ========================================================================= */
  function fireCannon(rig, ammoKey, teamIdx) {
    var lp = computeLaunchParams(rig, ammoKey);
    rig.recoil = 1.0;
    // Angry-Birds stretch-snap launch + camera punch!
    GQC.Juice.squashStretch(rig.yawGroup, 0.84, 1.18, 1.24, 0.42);
    GQC.Juice.shakeCamera(0.18, 0.20);
    GQC.Juice.spawnBurst(stageGroup, lp.origin, 'dust', 7);
    updateTrajectoryArc(rig, false);
    E3D.Audio.cannonFire(rig.power);
    E3D.Audio.cannonWhistle(1.05);

    K.fx.puff(lp.origin, 10, { dir: lp.dir, color: 0xfff6e5, size: 1.25, spread: 0.45 });
    K.fx.ring(lp.origin, K.TEAMS[teamIdx % 4].hex, 2.2);
    if (rig.kidChar) rig.kidChar.setState('cheer');
    if (rig.monChar) rig.monChar.setState('hop');

    var projMesh = buildAmmoMesh(ammoKey, K.TEAMS[teamIdx % 4].hex);
    projMesh.position.copy(lp.origin);
    stageGroup.add(projMesh);

    var rec = physStage.addDynamicBlock({
      mesh: projMesh,
      shape: 'ball',
      radius: lp.ammo.radius,
      pos: lp.origin,
      vel: lp.vel,
      density: lp.ammo.mass * 3.2,
      damping: 0.0,
      restitution: 0.34,
      ccd: true,
      tag: 'ammo',
      data: { ammoType: ammoKey, teamIdx: teamIdx, trail: [] }
    });

    var pObj = { rec: rec, mesh: projMesh, trailTimer: 0, teamIdx: teamIdx, ammoKey: ammoKey, splashed: false };
    activeProjectiles.push(pObj);
    return pObj;
  }

  function buildAmmoMesh(ammoKey, teamHex) {
    var grp = new T3.Group();
    if (ammoKey === 'boulder' && MODELS.boulder) {
      grp.add(MODELS.boulder.scene.clone(true));
    } else if (ammoKey === 'bomb' && MODELS.tntAmmo) {
      grp.add(MODELS.tntAmmo.scene.clone(true));
    } else {
      var rad = ammoKey === 'pebble' ? 0.25 : (ammoKey === 'triple' ? 0.30 : 0.34);
      var ball = new T3.Mesh(
        new T3.SphereGeometry(rad, 18, 14),
        new T3.MeshStandardMaterial({
          color: ammoKey === 'pebble' ? 0x938ca0 : (ammoKey === 'triple' ? teamHex : 0x3b3554),
          emissive: new T3.Color(teamHex),
          emissiveIntensity: ammoKey === 'triple' ? 1.15 : (ammoKey === 'pebble' ? 0.12 : 0.32),
          roughness: 0.38,
          metalness: 0.22
        })
      );
      ball.castShadow = true;
      grp.add(ball);
    }
    return grp;
  }

  function triggerMidAirSpecial() {
    if (STATE.midFlightUsed || !activeProjectiles.length) return;
    var mainP = activeProjectiles[0];
    if (!mainP || !mainP.rec || !mainP.rec.body) return;
    STATE.midFlightUsed = true;
    if (flightTapBtn) { flightTapBtn.remove(); flightTapBtn = null; }

    var tr = mainP.rec.body.translation();
    var lv = mainP.rec.body.linvel();
    var pos = new T3.Vector3(tr.x, tr.y, tr.z);

    if (mainP.ammoKey === 'bomb') {
      mainP.rec.data.detonated = true;
      triggerTntExplosion(pos, mainP.teamIdx);
      physStage.hideRecord(mainP.rec);
    } else if (mainP.ammoKey === 'triple') {
      K.sfx('pop');
      K.fx.ring(pos, 0x4f9dff, 3.0);
      [-3.2, 3.2].forEach(function (vxOff) {
        var m = buildAmmoMesh('triple', K.TEAMS[mainP.teamIdx % 4].hex);
        m.position.copy(pos);
        stageGroup.add(m);
        var subRec = physStage.addDynamicBlock({
          mesh: m, shape: 'ball', radius: 0.30,
          pos: { x: pos.x + vxOff * 0.12, y: pos.y, z: pos.z },
          vel: { x: lv.x + vxOff, y: lv.y + 1.1, z: lv.z },
          density: 5.5, damping: 0.0, ccd: true, tag: 'ammo',
          data: { ammoType: 'iron', teamIdx: mainP.teamIdx, trail: [] }
        });
        activeProjectiles.push({ rec: subRec, mesh: m, trailTimer: 0, teamIdx: mainP.teamIdx, ammoKey: 'triple', splashed: false });
      });
    }
  }

  /* =========================================================================
   * 7. UNIFIED NATURAL AIMING CONTROLLER (Zero Contradiction, Zero Bezel Trap!)
   * ========================================================================= */
  var slingRingEl = null, slingKnobEl = null;

  function ensureSlingIndicators() {
    if (!slingRingEl) {
      slingRingEl = K.ui.add(K.el('div', 'cn-sling-ring'));
      slingKnobEl = K.ui.add(K.el('div', 'cn-sling-knob', 'FIRE'));
    }
  }

  function computeDragAim(baseYaw, basePower, dx, dy) {
    if (STATE.aimStyle === 'slingshot') {
      // Consistent Angry Birds Opposite Pull on BOTH axes: pull down-left -> shoot far-right!
      return {
        yaw: baseYaw + (dx / 210) * 0.62,
        power: basePower + (dy / 145) * 0.68
      };
    }
    // DEFAULT Direct Touch-Aim: Drag UP -> aim FARTHER, Drag DOWN -> aim CLOSER, Drag LEFT/RIGHT -> aim LEFT/RIGHT!
    // Zero bottom-bezel collision on Smartboards because dragging UP gives 400+ px of room!
    return {
      yaw: baseYaw - (dx / 220) * 0.62,
      power: basePower + (-dy / 165) * 0.72
    };
  }

  function attachAimZone(rig, onFired) {
    ensureSlingIndicators();
    var zone = K.ui.add(K.el('div', 'cn-aim-zone'));
    var dragging = false, pId = -1, startX = 0, startY = 0;
    var baseYaw = rig.yaw, basePower = rig.power, lastTickStep = 0;

    updateTrajectoryArc(rig, true);

    function applyDrag(cx, cy) {
      var dx = cx - startX;
      var dy = cy - startY;
      var next = computeDragAim(baseYaw, basePower, dx, dy);
      setRigAimFromNormalized(rig, next.yaw, next.power);

      var tickStep = Math.round((rig.yaw * 18) + (rig.power * 14));
      if (tickStep !== lastTickStep) {
        lastTickStep = tickStep;
        E3D.Audio.ratchetTick(rig.power);
      }

      var clampR = Math.min(64, Math.hypot(dx, dy));
      var ang = Math.atan2(dy, dx);
      slingKnobEl.style.left = (startX + Math.cos(ang) * clampR) + 'px';
      slingKnobEl.style.top = (startY + Math.sin(ang) * clampR) + 'px';
      slingKnobEl.textContent = Math.round(rig.power * 100) + '%';

      var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
      GQC.Juice.setPullTension(rig.yawGroup, rig.power);
      GQC.Juice.computeSafeZoneAimCamera(rig.yaw, rig.pitch, rig.power, asp, _camPosTmp, _camLookTmp);
      K.cam.set(_camPosTmp.clone(), _camLookTmp.clone(), 5.8);
      updateTrajectoryArc(rig, true);
    }

    zone.addEventListener('pointerdown', function (ev) {
      if (STATE.phase !== 'aim') return;
      dragging = true;
      pId = ev.pointerId;
      startX = ev.clientX;
      startY = ev.clientY;
      baseYaw = rig.yaw;
      basePower = rig.power;
      try { zone.setPointerCapture(pId); } catch (e) {}
      if (rig.kidChar) rig.kidChar.setState('ready');
      slingRingEl.style.left = startX + 'px';
      slingRingEl.style.top = startY + 'px';
      slingRingEl.style.display = 'block';
      slingKnobEl.style.left = startX + 'px';
      slingKnobEl.style.top = startY + 'px';
      slingKnobEl.style.display = 'flex';
      E3D.Audio.ratchetTick(0.4);
    });

    zone.addEventListener('pointermove', function (ev) {
      if (!dragging || ev.pointerId !== pId) return;
      applyDrag(ev.clientX, ev.clientY);
    });

    function releaseShot(ev) {
      if (!dragging || (ev && ev.pointerId !== pId)) return;
      dragging = false;
      slingRingEl.style.display = 'none';
      slingKnobEl.style.display = 'none';
      var moved = ev ? Math.hypot(ev.clientX - startX, ev.clientY - startY) : 25;
      if (moved < 10) {
        updateTrajectoryArc(rig, true);
        return;
      }
      cleanup();
      onFired();
    }

    zone.addEventListener('pointerup', releaseShot);
    zone.addEventListener('pointercancel', function () {
      dragging = false;
      GQC.Juice.setPullTension(rig.yawGroup, 0);
      slingRingEl.style.display = 'none';
      slingKnobEl.style.display = 'none';
    });

    function onKey(ev) {
      if (STATE.phase !== 'aim') return;
      if (ev.key === 'ArrowLeft')  { setRigAimFromNormalized(rig, rig.yaw + 0.05, rig.power); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowRight') { setRigAimFromNormalized(rig, rig.yaw - 0.05, rig.power); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowUp')    { setRigAimFromNormalized(rig, rig.yaw, rig.power + 0.06); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowDown')  { setRigAimFromNormalized(rig, rig.yaw, rig.power - 0.06); updateTrajectoryArc(rig, true); }
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); cleanup(); onFired(); }
    }
    window.addEventListener('keydown', onKey);

    function cleanup() {
      window.removeEventListener('keydown', onKey);
      slingRingEl.style.display = 'none';
      slingKnobEl.style.display = 'none';
      if (zone.parentNode) zone.remove();
    }
    return cleanup;
  }

  /* =========================================================================
   * 8. SETUP CARD (WITH TEAMS & ROUNDS!), DYNAMIC TURN SETTLE & SPLIT DUEL
   * ========================================================================= */
  function showTitleScreen() {
    STATE.phase = 'title';
    clearStage();
    K.ui.clear();
    K.ui.topButtons();

    cannons[0].root.visible = true;
    cannons[0].root.position.set(0, 2.13, 13.4);
    cannons[1].root.visible = false;
    K.cam.follow = null;
    K.cam.set(new T3.Vector3(5.6, 5.8, 21.8), new T3.Vector3(0, 2.3, -6), 2.2);

    buildSmashStage(1);

    var wrap = K.ui.add(K.el('div', 'cn-title-wrap'));
    var card = K.el('div', 'cn-title-card');
    wrap.appendChild(card);

    card.innerHTML =
      '<div class="cn-badge-top">🏴‍☠️ SUNNY COVE PHYSICS EDITION · 60 FPS</div>' +
      '<h1 class="cn-title-h1">Pirate &amp; Monster Cannon 3D</h1>' +
      '<p class="cn-title-sub">Read the breeze, judge your cannon arc over stone forts, and sink moving pirate ships!</p>';

    var grid = K.el('div', 'cn-setup-grid');
    card.appendChild(grid);

    function makePillGroup(label, options, curVal, colorCls, onSelect) {
      var box = K.el('div', 'cn-setup-box');
      box.appendChild(K.el('span', 'cn-setup-lbl', label));
      var row = K.el('div', 'cn-pill-row');
      options.forEach(function (opt) {
        var b = K.el('button', 'cn-pill' + (opt.v === curVal ? ' on ' + (colorCls || '') : ''), opt.l);
        b.type = 'button';
        b.onclick = function () {
          Array.prototype.forEach.call(row.children, function (c) { c.className = 'cn-pill'; });
          b.className = 'cn-pill on ' + (colorCls || '');
          onSelect(opt.v);
        };
        row.appendChild(b);
      });
      box.appendChild(row);
      return box;
    }

    grid.appendChild(makePillGroup('1. Play Mode', [
      { v: 'classroom', l: '🏫 Classroom Teams' },
      { v: 'solo',      l: '📱 Solo Campaign (⭐⭐⭐)' }
    ], STATE.context, '', function (v) { STATE.context = v; renderTitleDynamic(); }));

    var boardBoxHolder = K.el('div', '');
    grid.appendChild(boardBoxHolder);

    grid.appendChild(makePillGroup('3. English + Action Loop', [
      { v: 'smash',  l: '💥 Answer → Super Ammo' },
      { v: 'target', l: '⛵ Shoot 3D Answer Sails' }
    ], STATE.playLoop, 'pink', function (v) { STATE.playLoop = v; }));

    grid.appendChild(makePillGroup('4. Skill & Challenge Level', [
      { v: 'skill',  l: '🎯 Arcade Skill' },
      { v: 'pro',    l: '🔥 Pro Captain' },
      { v: 'warmup', l: '🌱 Warmup Guide' }
    ], STATE.arcGuide, 'green', function (v) { STATE.arcGuide = v; rollStageWind(STAGE_META[0]); }));

    var teamsRoundsRow = K.el('div', 'cn-setup-grid');
    card.appendChild(teamsRoundsRow);

    var clsHolder = K.el('div', '');
    card.appendChild(clsHolder);

    var actions = K.el('div', 'cn-title-actions');
    var howBtn = K.el('button', 'cn-btn cream', '❓ How to Play');
    howBtn.type = 'button';
    howBtn.onclick = showHowToModal;
    var goBtn = K.el('button', 'cn-btn green', '🚀 SET SAIL & FIRE!');
    goBtn.type = 'button';
    goBtn.onclick = startGame;
    actions.appendChild(howBtn);
    actions.appendChild(goBtn);
    card.appendChild(actions);

    function renderTitleDynamic() {
      boardBoxHolder.innerHTML = '';
      teamsRoundsRow.innerHTML = '';
      clsHolder.innerHTML = '';
      clsHolder.appendChild(K.el('span', ''));

      if (STATE.context === 'solo') {
        boardBoxHolder.appendChild(makePillGroup('2. Touch Control Style', [
          { v: 'direct',    l: '🎯 Direct Drag-to-Aim' },
          { v: 'slingshot', l: '🏹 Slingshot Pull' }
        ], STATE.aimStyle, '', function (v) { STATE.aimStyle = v; }));
        K.ui.setPicker(clsHolder);
      } else {
        boardBoxHolder.appendChild(makePillGroup('2. Smartboard Style', [
          { v: 'cinema', l: '🎬 Cinema Turns' },
          { v: 'duel',   l: '⚔️ 2-Kid Split Duel!' }
        ], STATE.boardMode, '', function (v) { STATE.boardMode = v; renderTeamsSubRow(); }));
        renderTeamsSubRow();
      }
    }

    function renderTeamsSubRow() {
      teamsRoundsRow.innerHTML = '';
      clsHolder.innerHTML = '';
      clsHolder.appendChild(K.el('span', ''));
      if (STATE.boardMode === 'cinema') {
        teamsRoundsRow.appendChild(makePillGroup('5. Monster Teams', [
          { v: 2, l: '2 Teams' },
          { v: 3, l: '3 Teams' },
          { v: 4, l: '4 Teams' }
        ], STATE.teamCount, '', function (v) { STATE.teamCount = v; renderRosterOnly(); }));
        teamsRoundsRow.appendChild(makePillGroup('6. Island Stages (Rounds)', [
          { v: 2, l: '2 Stages' },
          { v: 3, l: '3 Stages' },
          { v: 4, l: 'All 4 + Boss!' }
        ], STATE.totalRounds, 'green', function (v) { STATE.totalRounds = v; }));
      } else {
        teamsRoundsRow.appendChild(makePillGroup('5. Touch Control Style', [
          { v: 'direct',    l: '🎯 Direct Drag-to-Aim' },
          { v: 'slingshot', l: '🏹 Slingshot Pull' }
        ], STATE.aimStyle, '', function (v) { STATE.aimStyle = v; }));
        teamsRoundsRow.appendChild(makePillGroup('6. Duel Timer', [
          { v: 40, l: '⏱ 40s English Sail Blitz' },
          { v: 60, l: '⏱ 60s Extended Siege' }
        ], STATE.duelTimeLeft, 'pink', function (v) { STATE.duelTimeLeft = v; }));
      }
      renderRosterOnly();
    }

    function renderRosterOnly() {
      clsHolder.innerHTML = '';
      clsHolder.appendChild(K.el('span', ''));
      K.cls.setupRow(clsHolder, STATE.boardMode === 'duel' ? 2 : STATE.teamCount);
    }

    renderTitleDynamic();

    if (K.DEMO) {
      K.after(1.1, function () { if (STATE.phase === 'title') startGame(); });
    }
  }

  function showHowToModal() {
    var scrim = K.ui.add(K.el('div', 'cn-modal-scrim'));
    var m = K.el('div', 'cn-modal-card');
    m.innerHTML =
      '<h2 style="margin:0 0 6px;font-size:1.6rem;font-weight:900;">🏴‍☠️ How to Play Cannon 3D</h2>' +
      '<div class="cn-steps-row">' +
      '  <div class="cn-step-box"><div class="cn-step-ico">🗣️</div><div class="cn-step-t">1. English Clue</div><p class="cn-step-p">Read or listen to unlock Super Cannonballs or spot the right pirate sail!</p></div>' +
      '  <div class="cn-step-box"><div class="cn-step-ico">🎯</div><div class="cn-step-t">2. Drag &amp; Aim</div><p class="cn-step-p">Drag up/down/sideways in the lower screen to place the glowing target ring!</p></div>' +
      '  <div class="cn-step-box"><div class="cn-step-ico">💥</div><div class="cn-step-t">3. Sink &amp; Smash!</div><p class="cn-step-p">Topple crates, detonate star-kegs &amp; defeat Captain Flint\u2019s 3-Heart Flagship!</p></div>' +
      '</div>';
    var row = K.el('div', 'cn-title-actions');
    var listen = K.el('button', 'cn-btn yellow', '🔊 Listen');
    listen.onclick = function () { K.say('Step one: answer or listen to the English clue. Step two: drag in the lower screen to place the target ring on the tower or ship, then release to fire! Step three: smash the towers and sink the boss flagship!'); };
    var ok = K.el('button', 'cn-btn green', 'Got It! ▶');
    ok.onclick = function () { scrim.remove(); };
    row.appendChild(listen); row.appendChild(ok);
    m.appendChild(row);
    scrim.appendChild(m);
  }

  function buildTopGameHud() {
    K.ui.clear();
    K.ui.topButtons();

    if (STATE.context === 'solo') {
      STATE.teams = [{ name: 'Explorer', c: '#4f9dff', hex: 0x4f9dff, kid: 'boy', mon: 'aquafind', score: 0, pupils: [] }];
    } else {
      var nT = STATE.boardMode === 'duel' ? 2 : STATE.teamCount;
      STATE.teams = K.TEAMS.slice(0, nT).map(function (t) {
        return Object.assign({}, t, { score: 0, pupils: [], speakerIdx: 0 });
      });
      K.cls.assign(STATE.teams);
    }

    hudBar = K.ui.teamBar(STATE.teams, function (t) { return t.score || 0; });
    hudBar.refresh(0);

    var cluster = K.ui.add(K.el('div', 'cn-top-cluster'));
    windPillEl = K.el('div', 'cn-mini-pill', '☀️ No Wind');
    var musBtn = K.el('button', 'cn-mini-pill', E3D.musicMuted ? '🎵 Music Off' : '🎵 Music On');
    musBtn.title = 'Mute background music while keeping game sound effects & voice';
    musBtn.onclick = function () {
      E3D.Audio.setMusicMuted(!E3D.musicMuted);
      musBtn.textContent = E3D.musicMuted ? '🎵 Music Off' : '🎵 Music On';
    };
    var helpBtn = K.el('button', 'cn-mini-pill', '❓');
    helpBtn.title = 'How to Play';
    helpBtn.onclick = showHowToModal;

    cluster.appendChild(windPillEl);
    cluster.appendChild(musBtn);
    cluster.appendChild(helpBtn);

    stageBannerEl = K.ui.add(K.el('div', 'cn-stage-banner', ''));
    E3D.Audio.startIslandMarimbaLoop();
  }

  function refreshWindPill() {
    if (!windPillEl) return;
    var wx = E3D.wind.x;
    if (Math.abs(wx) < 0.12) {
      windPillEl.innerHTML = '☀️ No Wind';
    } else {
      var arrow = wx > 0 ? '➡️' : '⬅️';
      var kt = Math.max(1, Math.round(Math.abs(wx) * 2.5));
      windPillEl.innerHTML = '🍃 Breeze ' + arrow + ' <b>' + kt + ' kt</b>';
    }
  }

  function startGame() {
    STATE.round = Math.min(4, Math.max(1, +(Q.get('stage') || 1)));
    STATE.turnIdx = 0;
    STATE.currentItem = null;
    STATE.targetSunk = true;
    buildTopGameHud();

    if (STATE.context === 'classroom' && STATE.boardMode === 'duel') {
      startSplitDuelMatch();
    } else {
      startNextCinemaRound(true);
    }
  }

  /* ---------- CINEMA & SOLO CAMPAIGN LOOP ---------- */
  function startNextCinemaRound(rebuildStage) {
    if (STATE.round > STATE.totalRounds) {
      showVictoryPodium();
      return;
    }
    cannons[0].root.visible = true;
    cannons[0].root.position.set(0, 2.13, 13.4);
    cannons[1].root.visible = false;

    var meta = STAGE_META[(STATE.round - 1) % 4];
    if (stageBannerEl) stageBannerEl.textContent = meta.name + ' · Round ' + STATE.round + '/' + STATE.totalRounds;
    if (!rebuildStage) rollStageWind(meta); // Shifting sea breeze between turns prevents memorizing a fixed angle!

    var team = STATE.teams[STATE.turnIdx % STATE.teams.length];
    hudBar.refresh(STATE.turnIdx);
    syncRigCast(cannons[0], team, STATE.turnIdx);
    if (windFlagMesh) windFlagMesh.material.color.setHex(team.hex);

    STATE.selectedAmmo = 'iron';
    STATE.unlockedTier = 1;

    if (STATE.playLoop === 'target') {
      // STEAL MECHANIC: only load a new question + ships if the previous ship was sunk OR every team already had a try!
      if (!STATE.currentItem || STATE.targetSunk || STATE.targetAttempts >= STATE.teams.length) {
        STATE.currentItem = qsBank.next();
        STATE.targetAttempts = 0;
        buildTargetShootStage(STATE.currentItem, STATE.round, false);
      } else {
        K.ui.toast('🏴‍☠️ Steal Chance for Team ' + team.name + '!', 1.5, team.c);
      }
      STATE.targetAttempts++;
      beginCinemaAimPhase(team, true);
    } else {
      STATE.currentItem = qsBank.next();
      if (rebuildStage) buildSmashStage(STATE.round);
      presentSmashQuestion(STATE.currentItem, team);
    }
  }

  function presentSmashQuestion(item, team) {
    STATE.phase = 'question';
    K.cam.follow = null;
    // Smoothly frame the live dressed island fort in the upper half of the screen ABOVE the quiz modal!
    K.cam.set(new T3.Vector3(3.4, 5.85, 22.4), new T3.Vector3(0, -0.75, -14.2), 3.0);

    var judgeSuper = false;
    var askPromise = K.ui.ask(item, team, {
      prompt: 'Answer to unlock Super Cannonballs!'
    });

    // Auto-read fallback even when item.speak is omitted in Game Maker sets!
    if (!item.speak && item.q) {
      K.after(0.35, function () {
        if (STATE.phase === 'question') K.say(String(item.q).replace(/_+/g, 'blank'));
      });
    }

    if (STATE.context === 'classroom') {
      setTimeout(function () {
        var qcard = document.querySelector('.qcard');
        if (!qcard) return;
        var jbar = K.el('div', 'cn-judge-bar');
        jbar.innerHTML = '<span style="font-size:.82rem;font-weight:800;color:#5f4f7a;">🗣️ Spoke a full English sentence?</span>';
        var jbtn = K.el('button', 'cn-judge-btn', '🌟 Super Sentence! (Unlock All Ammo)');
        jbtn.type = 'button';
        jbtn.onclick = function () {
          judgeSuper = true;
          K.sfx('bullseye');
          var rightBtn = Array.prototype.find.call(qcard.querySelectorAll('.opt'), function (b) { return b.dataset.ans === item.a; });
          if (rightBtn) rightBtn.click();
        };
        jbar.appendChild(jbtn);
        qcard.appendChild(jbar);
      }, 40);
    }

    askPromise.then(function (ok) {
      STATE.unlockedTier = judgeSuper ? 2 : (ok ? 1 : 0);
      STATE.selectedAmmo = judgeSuper ? 'boulder' : (ok ? 'bomb' : 'pebble');
      if (!ok) {
        K.ui.toast('Light Pebble loaded — lob a high arc over the stone wall! 🎯', 1.7, team.c);
      }
      beginCinemaAimPhase(team, false);
    });
  }

  function showTopClueBanner(it, borderCol) {
    if (targetClueEl) { targetClueEl.remove(); targetClueEl = null; }
    if (!it) return;
    targetClueEl = K.ui.add(K.el('div', 'cn-target-clue'));
    targetClueEl.style.setProperty('--c', borderCol || '#4f9dff');
    var mediaHtml = it.img
      ? '<img alt="" src="' + K.ROOT + it.img + '">'
      : (it.pic ? '<span class="cn-clue-emo">' + it.pic + '</span>' : '<span class="cn-clue-emo">🏴‍☠️</span>');
    targetClueEl.innerHTML = mediaHtml + '<div class="cn-clue-txt">Hit the Sail: ' + K.esc(it.q) + '</div>';
    var sb = K.el('button', 'cn-say-btn', '🔊');
    var sayStr = (it.speak || it.q || '').replace(/_+/g, 'blank');
    sb.onclick = function () { K.say(sayStr); };
    targetClueEl.appendChild(sb);
    K.after(0.25, function () { K.say(sayStr); });
  }

  function beginCinemaAimPhase(team, isTargetMode) {
    STATE.phase = 'aim';
    STATE.shotScore = 0;
    STATE.midFlightUsed = false;

    // Start deliberately off-center & short each turn so players MUST actively aim & judge range!
    var rig = cannons[0];
    var startSign = Math.random() < 0.5 ? -1 : 1;
    setRigAimFromNormalized(rig, startSign * K.rnd(0.14, 0.26), K.rnd(0.24, 0.34));

    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    K.cam.follow = null;
    GQC.Juice.setPullTension(rig.yawGroup, 0);
    GQC.Juice.computeSafeZoneAimCamera(rig.yaw, rig.pitch, 0, asp, _camPosTmp, _camLookTmp);
    K.cam.set(_camPosTmp.clone(), _camLookTmp.clone(), 4.0);

    if (isTargetMode && STATE.currentItem) {
      showTopClueBanner(STATE.currentItem, team.c);
    } else if (targetClueEl) {
      targetClueEl.remove(); targetClueEl = null;
    }

    var aimHud = K.ui.add(K.el('div', 'cn-aim-hud'));
    aimHud.style.setProperty('--c', team.c);
    var sp = K.cls && K.cls.speaker && K.cls.speaker(team);
    var who = sp ? sp.name : (STATE.context === 'solo' ? 'Explorer' : ('Team ' + team.name));
    var verb = STATE.aimStyle === 'slingshot' ? 'Pull back & release!' : 'Drag to aim & release!';
    aimHud.appendChild(K.el('span', 'cn-aim-prompt', '🎯 ' + K.esc(who) + ': ' + verb));

    var availAmmo = isTargetMode ? ['iron'] : (
      STATE.unlockedTier >= 2 ? ['boulder', 'bomb', 'triple', 'iron'] :
      STATE.unlockedTier === 1 ? ['bomb', 'iron'] : ['pebble']
    );
    availAmmo.forEach(function (ak) {
      var chip = K.el('button', 'cn-ammo-chip' + (STATE.selectedAmmo === ak ? ' on' : ''), AMMO_TYPES[ak].label);
      chip.type = 'button';
      chip.title = AMMO_TYPES[ak].desc;
      chip.onclick = function () {
        STATE.selectedAmmo = ak;
        Array.prototype.forEach.call(aimHud.querySelectorAll('.cn-ammo-chip'), function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        E3D.Audio.ratchetTick(0.8);
        updateTrajectoryArc(rig, true);
      };
      aimHud.appendChild(chip);
    });

    var cleanupAim = attachAimZone(rig, function () {
      aimHud.remove();
      launchCinemaShot(rig, team);
    });

    if (K.DEMO || (STATE.context !== 'solo' && K.isAI && K.isAI(team))) {
      K.after(K.DEMO ? 1.3 : 1.05, function () {
        if (STATE.phase !== 'aim') return;
        setRigAimFromNormalized(rig, K.rnd(-0.14, 0.14), K.rnd(0.55, 0.72));
        cleanupAim();
        aimHud.remove();
        launchCinemaShot(rig, team);
      });
    }
  }

  function launchCinemaShot(rig, team) {
    STATE.phase = 'flight';
    var pObj = fireCannon(rig, STATE.selectedAmmo, STATE.turnIdx);

    if (STATE.selectedAmmo === 'bomb' || STATE.selectedAmmo === 'triple') {
      var lbl = STATE.selectedAmmo === 'bomb' ? '💥 TAP TO DETONATE!' : '⚡ TAP TO SPLIT ×3!';
      flightTapBtn = K.ui.add(K.el('button', 'cn-btn yellow cn-flight-tap', lbl));
      flightTapBtn.onclick = triggerMidAirSpecial;
      window.addEventListener('pointerdown', onMidAirWindowTap, { once: true });
    }

    K.cam.follow = function () {
      if (!pObj.rec || !pObj.rec.body || pObj.rec.hidden) return;
      var tr = pObj.rec.body.translation();
      var lv = pObj.rec.body.linvel();
      var horiz = new T3.Vector3(lv.x, 0, lv.z);
      if (horiz.lengthSq() < 0.1) horiz.set(0, 0, -1); else horiz.normalize();
      K.cam.tPos.set(tr.x - horiz.x * 6.8, Math.max(2.6, tr.y + 2.7), tr.z - horiz.z * 6.8);
      K.cam.tLook.set(tr.x + horiz.x * 4.5, Math.max(0.8, tr.y - 0.3), tr.z + horiz.z * 4.5);
      K.cam.k = 6.2;
    };

    // SMART DYNAMIC TURN SETTLEMENT: finishes promptly after a water splash OR waits for epic collapses to settle!
    var startSimT = K.now;
    var startWallMs = performance.now();
    var settleIv = setInterval(function () {
      if (STATE.phase !== 'flight') { clearInterval(settleIv); return; }
      var wallElapsed = (performance.now() - startWallMs) * 0.001;
      var simElapsed = K.now - startSimT;
      var noProj = activeProjectiles.length === 0;
      var worldCalm = !physStage || physStage.isSettled();
      if ((simElapsed >= 0.75 && noProj && worldCalm) || simElapsed >= 4.2 || wallElapsed >= 5.5) {
        clearInterval(settleIv);
        K.timeScale = 1.0;
        setTimeout(finishCinemaShot, STATE.shotScore > 0 ? 420 : 150);
      }
    }, 100);

    function finishCinemaShot() {
      if (STATE.phase !== 'flight') return;
      K.timeScale = 1.0;
      K.cam.follow = null;
      window.removeEventListener('pointerdown', onMidAirWindowTap);
      if (flightTapBtn) { flightTapBtn.remove(); flightTapBtn = null; }

      STATE.turnIdx = (STATE.turnIdx + 1) % STATE.teams.length;
      var wrappedRound = STATE.turnIdx === 0;
      if (wrappedRound) STATE.round++;

      startNextCinemaRound(wrappedRound);
    }
  }

  function onMidAirWindowTap(ev) {
    if (ev.target && ev.target.closest && ev.target.closest('.topbtns, .cn-top-cluster')) return;
    if (STATE.phase === 'flight') triggerMidAirSpecial();
  }

  /* ---------- 2-KID SIMULTANEOUS SPLIT-BOARD DUEL (WITH LIVE ENGLISH ANSWER SAILS & WORKING SCORES!) ---------- */
  function spawnDuelEnglishWave() {
    // Remove previous answer ships while keeping central bonus crate island intact!
    movingShips.forEach(function (sh) {
      if (sh.group && sh.group.parent) sh.group.parent.remove(sh.group);
      if (sh.kinRec) physStage.hideRecord(sh.kinRec);
      (sh.attachments || []).forEach(function (at) {
        if (at.buoyMesh && at.buoyMesh.parent) at.buoyMesh.parent.remove(at.buoyMesh);
        if (at.buoyRec) physStage.hideRecord(at.buoyRec);
      });
    });
    movingShips = [];

    STATE.currentItem = qsBank.next();
    showTopClueBanner(STATE.currentItem, '#ffb320');
    buildTargetShootStage(STATE.currentItem, 2, true);
  }

  function startSplitDuelMatch() {
    STATE.phase = 'duel';
    var timeRem = STATE.duelTimeLeft || 40;

    cannons[0].root.visible = true;
    cannons[0].root.position.set(-4.2, 2.13, 13.4);
    cannons[1].root.visible = true;
    cannons[1].root.position.set(4.2, 2.13, 13.4);

    syncRigCast(cannons[0], STATE.teams[0], 0);
    syncRigCast(cannons[1], STATE.teams[1], 1);

    clearStage();
    rollStageWind(STAGE_META[0]);
    physStage = new E3D.PhysicsStage({ onCollision: handlePhysicsCollision });
    registerDestructibleBatches(physStage);

    // Central bonus crate reef + Live 3D English Answer Ships!
    var yMid = addSandbarPlatform(physStage, 0, -19.2, 0.85, 6);
    spawnCratePyramid(physStage, 0, yMid, -19.2, 2, true, true);
    spawnDuelEnglishWave();

    var divider = K.ui.add(K.el('div', 'cn-split-divider'));
    if (stageBannerEl) stageBannerEl.textContent = '⚔️ 2-KID ENGLISH SAIL DUEL · ⏱ ' + timeRem + 's';

    var cleanups = [0, 1].map(function (side) {
      var rig = cannons[side];
      setRigAimFromNormalized(rig, 0, 0.50);
      var zEl = K.ui.add(K.el('div', 'cn-duel-zone ' + (side === 0 ? 'left' : 'right')));
      var tag = K.el('div', 'cn-duel-tag', '🎯 Team ' + STATE.teams[side].name + ' · Drag & Release!');
      tag.style.setProperty('--c', STATE.teams[side].c);
      zEl.appendChild(tag);

      var pId = -1, sx = 0, sy = 0, bYaw = 0, bPow = 0.50, cooldown = false;
      updateTrajectoryArc(rig, true);

      zEl.addEventListener('pointerdown', function (ev) {
        if (STATE.phase !== 'duel' || cooldown) return;
        pId = ev.pointerId; sx = ev.clientX; sy = ev.clientY; bYaw = rig.yaw; bPow = rig.power;
        try { zEl.setPointerCapture(pId); } catch (e) {}
      });
      zEl.addEventListener('pointermove', function (ev) {
        if (ev.pointerId !== pId) return;
        var next = computeDragAim(bYaw, bPow, ev.clientX - sx, ev.clientY - sy);
        setRigAimFromNormalized(rig, next.yaw, next.power);
        updateTrajectoryArc(rig, true);
      });
      zEl.addEventListener('pointerup', function (ev) {
        if (ev.pointerId !== pId) return;
        pId = -1;
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
        cooldown = true;
        fireCannon(rig, 'iron', side);
        K.after(1.05, function () {
          cooldown = false;
          if (STATE.phase === 'duel') updateTrajectoryArc(rig, true);
        });
      });
      return function () { zEl.remove(); updateTrajectoryArc(rig, false); };
    });

    var timerIv = setInterval(function () {
      if (STATE.phase !== 'duel') { clearInterval(timerIv); return; }
      timeRem--;
      if (stageBannerEl) stageBannerEl.textContent = '⚔️ 2-KID ENGLISH SAIL DUEL · ⏱ ' + timeRem + 's';
      if (timeRem <= 0) {
        clearInterval(timerIv);
        divider.remove();
        if (targetClueEl) { targetClueEl.remove(); targetClueEl = null; }
        cleanups.forEach(function (fn) { fn(); });
        showVictoryPodium();
      }
    }, 1000);
  }

  /* =========================================================================
   * 9. 3-STEP 3D VICTORY PODIUM + SOLO 3-STAR MEDALS + CLASS XP PANEL
   * ========================================================================= */
  function showVictoryPodium() {
    STATE.phase = 'podium';
    clearStage();
    K.ui.clear();
    K.ui.topButtons();

    cannons[0].root.visible = false;
    cannons[1].root.visible = false;

    var podGroup = new T3.Group();
    podGroup.position.set(0, 2.13, 12.6);
    stageGroup.add(podGroup);

    var ranked = STATE.teams.slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    var slotsX = ranked.length === 1 ? [0] : [0, -2.3, 2.3, -4.4];
    var heights = [1.25, 0.85, 0.60, 0.45];

    ranked.forEach(function (tm, rankIdx) {
      var px = slotsX[rankIdx] || 0, ph = heights[rankIdx] || 0.5;
      if (MODELS.stoneBlk) {
        var blk = MODELS.stoneBlk.scene.clone(true);
        blk.position.set(px, ph * 0.5, 0);
        blk.scale.set(1.15, ph, 1.35);
        podGroup.add(blk);
      }
      if (rankIdx === 0 && MODELS.trophy) {
        var tr = MODELS.trophy.scene.clone(true);
        K.fitModel(tr, 0.85);
        tr.position.set(px + 0.55, ph, 0.35);
        podGroup.add(tr);
      }
      var sp = K.cls && K.cls.speaker && K.cls.speaker(tm);
      K.makeCharacter(tm, { kidsOnly: true, studentId: sp ? sp.id : '', kidHeight: 1.48 }).then(function (kid) {
        kid.root.position.set(px - 0.25, ph, 0);
        kid.setState(rankIdx === 0 ? 'cheer' : 'clap');
        podGroup.add(kid.root);
        K.onFrame(function (dt) { if (STATE.phase === 'podium') kid.update(dt); });
      });
      K.makeCharacter(tm, { monHeight: 1.05 }).then(function (mon) {
        mon.root.position.set(px + 0.45, 0, 0.85);
        mon.setState('cheer');
        podGroup.add(mon.root);
        K.onFrame(function (dt) { if (STATE.phase === 'podium') mon.update(dt); });
      });
    });

    K.cam.follow = null;
    K.cam.set(new T3.Vector3(0, 4.4, 20.4), new T3.Vector3(0, 3.2, 12.6), 3.0);
    K.sfx('win');
    K.fx.confetti(new T3.Vector3(0, 4.5, 12.6), 85);

    var endCard = K.ui.add(K.el('div', 'cn-end-wrap'));
    var winner = ranked[0];
    if (STATE.context === 'solo') {
      var sc = winner.score || 0;
      var stars = sc >= 240 ? '⭐⭐⭐' : sc >= 130 ? '⭐⭐☆' : '⭐☆☆';
      endCard.innerHTML =
        '<div class="cn-stars-row">' + stars + '</div>' +
        '<h2 style="margin:0 0 4px;font-size:1.75rem;font-weight:900;">Island Campaign Complete!</h2>' +
        '<p style="margin:0 0 12px;font-weight:800;color:#5f4f7a;">Total Score: <b>' + sc + ' pts</b></p>';
      if (K.island && K.island.endButtons) K.island.endButtons(endCard, 'cannon3d', { winner: 'Explorer', score: sc });
    } else {
      endCard.innerHTML =
        '<h2 style="margin:0 0 8px;font-size:1.75rem;font-weight:900;">🏆 Team ' + K.esc(winner.name) + ' Wins! (' + (winner.score || 0) + ' pts)</h2>';
      K.cls.pointsPanel(endCard, STATE.teams, { game: 'cannon3d', title: 'Pirate & Monster Cannon 3D' });
    }

    var btns = K.el('div', 'cn-title-actions');
    var again = K.el('button', 'cn-btn green', '🔄 Play Again');
    again.onclick = showTitleScreen;
    var allG = K.el('button', 'cn-btn cream', '🎮 All Games');
    allG.onclick = function () { location.href = '../../game-maker/index.html'; };
    btns.appendChild(again); btns.appendChild(allG);
    endCard.appendChild(btns);
  }

  /* =========================================================================
   * 10. FRAME LOOP: SINKING ANIMATION, WOBBLE, PHYSICS & FOAM WAKES
   * ========================================================================= */
  K.onFrame(function (dt, t) {
    E3D.uTime.value = t;
    if (aiManager) aiManager.update(dt);
    if (GQC && GQC.Juice) GQC.Juice.update(dt, t, K.camera);

    for (var s = movingShips.length - 1; s >= 0; s--) {
      var sh = movingShips[s];
      if (sh.sinking) {
        sh.sinkT += dt;
        sh.group.position.y -= dt * 2.1;
        sh.group.rotation.z += dt * 0.55;
        sh.group.rotation.x -= dt * 0.42;
        if (Math.random() < 0.35) {
          K.fx.puff(new T3.Vector3(sh.group.position.x, 0.15, sh.group.position.z), 1, { color: 0xffffff, size: 0.9 });
        }
        if (sh.sinkT > 2.2) {
          if (sh.group.parent) sh.group.parent.remove(sh.group);
          if (sh.foamIdx) E3D.Shaders.setFoamCollider(sh.foamIdx, 9999, 9999, 0, 0);
          movingShips.splice(s, 1);
        }
        continue;
      }

      var sx = sh.baseX, sz = sh.baseZ;
      if (sh.vehicle) {
        sx = sh.vehicle.position.x;
        sz = sh.vehicle.position.z;
        if (sh.vehicle.velocity.squaredLength() > 0.02) {
          sh.group.rotation.y = Math.atan2(sh.vehicle.velocity.z, -sh.vehicle.velocity.x);
        }
      } else if (sh.swayAmp) {
        sx = sh.baseX + Math.sin(t * (sh.swaySpeed || 1.05) + (sh.swayPhase || 0)) * sh.swayAmp;
      }
      var wy = E3D.sampleWaveHeight(sx, sz, t);
      sh.group.position.set(sx, wy + 0.06, sz);
      var wob = 0;
      if (sh.wobble > 0.001) {
        sh.wobble *= Math.exp(-dt * 4.5);
        wob = Math.sin(t * 22) * 0.24 * sh.wobble;
      }
      sh.group.rotation.z = Math.sin(t * 1.6 + s) * 0.045 + wob;
      sh.group.rotation.x = Math.cos(t * 1.3 + s) * 0.035;

      if (sh.kinRec && sh.kinRec.body) {
        sh.kinRec.body.setNextKinematicTranslation({ x: sx, y: wy + 1.9, z: sz });
      }
      if (sh.foamIdx) {
        GQC.Water.setCollider(sh.foamIdx, sx, sz, 2.7, 0.92);
      }
      if (sh.attachments && sh.attachments.length) {
        sh.attachments.forEach(function (at) {
          var bx2 = sx + (at.offsetX || 0);
          var bz2 = sz + (at.offsetZ || 2.2);
          var by2 = E3D.sampleWaveHeight(bx2, bz2, t);
          if (at.buoyMesh) at.buoyMesh.position.set(bx2, by2 + 0.06, bz2);
          if (at.buoyRec && at.buoyRec.body) at.buoyRec.body.setNextKinematicTranslation({ x: bx2, y: by2 + 0.55, z: bz2 });
        });
      }
    }

    if (physStage) {
      physStage.step(dt);
      for (var bi = 0; bi < physStage.bodies.length; bi++) {
        var br = physStage.bodies[bi];
        if (!br.body || br.hidden || br.kind !== 'dynamic' || br.tag === 'ammo') continue;
        var btr = br.body.translation();
        if (btr.y < -0.15) {
          var spPos = new T3.Vector3(btr.x, 0.1, btr.z);
          K.fx.ring(spPos, 0xffffff, 2.4);
          K.fx.puff(spPos, 5, { color: 0xffffff, size: 0.9 });
          if (!br.scored) {
            br.scored = true;
            awardHitPoints(br.points || 15, spPos, br.tag === 'chest' ? '👑 +50!' : null);
          }
          physStage.hideRecord(br);
        }
      }
    }

    for (var pi = activeProjectiles.length - 1; pi >= 0; pi--) {
      var pr = activeProjectiles[pi];
      if (!pr.rec || !pr.rec.body || pr.rec.hidden) {
        activeProjectiles.splice(pi, 1);
        continue;
      }
      var ptr = pr.rec.body.translation();
      pr.trailTimer += dt;
      if (pr.trailTimer >= 0.075) {
        pr.trailTimer = 0;
        var vPt = new T3.Vector3(ptr.x, ptr.y, ptr.z);
        if (pr.rec.data.trail.length < 28) pr.rec.data.trail.push(vPt.clone());
        K.fx.puff(vPt, 1, { color: 0xffffff, size: 0.55, opacity: 0.45, life: 0.55 });
      }
      var seaY = E3D.sampleWaveHeight(ptr.x, ptr.z, t);
      if (!pr.splashed && ptr.y <= seaY + 0.1) {
        pr.splashed = true;
        E3D.Audio.waterSplash();
        var wPos = new T3.Vector3(ptr.x, seaY + 0.12, ptr.z);
        GQC.Juice.spawnBurst(stageGroup, wPos, 'splash', 14);
        K.fx.ring(wPos, 0xffffff, 3.8);
        K.fx.puff(wPos, 8, { color: 0xe6fbff, size: 1.15, spread: 1.0 });
        physStage.hideRecord(pr.rec);
        activeProjectiles.splice(pi, 1);
      }
    }

    if (STATE.phase === 'duel' && camDuelLeft && camDuelRight) {
      var rL = cannons[0], rR = cannons[1];
      camDuelLeft.position.set(-4.2 - Math.sin(rL.yaw) * 1.6, 6.25, 23.0);
      camDuelLeft.lookAt(-0.9 - Math.sin(rL.yaw) * 9.5, 0.75 + (rL.pitch - 0.19) * 2.4, -14.0);
      camDuelRight.position.set(4.2 - Math.sin(rR.yaw) * 1.6, 6.25, 23.0);
      camDuelRight.lookAt(0.9 - Math.sin(rR.yaw) * 9.5, 0.75 + (rR.pitch - 0.19) * 2.4, -14.0);
    }
  });

  /* =========================================================================
   * 11. BOOTSTRAP
   * ========================================================================= */
  window.__CANNON3D = {
    STATE: STATE,
    getCannons: function () { return cannons; },
    getShips: function () { return movingShips; },
    getProj: function () { return activeProjectiles; },
    captureShot: function (mode) {
      if (STATE.phase === 'title') {
        startGame();
      }
      if (mode === 'question') {
        STATE.phase = 'question';
        window.__k3phase = 'question';
        K.cam.set(new T3.Vector3(3.4, 5.85, 22.4), new T3.Vector3(0, -0.75, -14.2), 3.0);
        K.cam.snap();
      } else if (mode === 'aim') {
        var qc = document.querySelector('.qwrap');
        if (qc) qc.remove();
        STATE.unlockedTier = 2;
        STATE.selectedAmmo = 'bomb';
        beginCinemaAimPhase(STATE.teams[0] || K.TEAMS[0], false);
        K.cam.snap();
      }
    }
  };
  loadAllAssets().then(function () {
    buildCoveWorld();
    showTitleScreen();
    window.__k3phase = 'title';
    K.start();
  }).catch(function (err) {
    console.error('[Cannon3D] Boot failed:', err);
  });
})();
