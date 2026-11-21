/* games/cannon3d/cannon3d.js
 * Flagship Smart Screen & Mobile 3D Game #1: Pirate & Monster Cannon 3D
 * Powered by games/engine3d/ (Three 0.169 + pmndrs/postprocessing + Rapier3D + three-mesh-bvh + Yuka + Howler)
 * & games/kit3d/ (65-bone Pupil 3D Avatars, 4 Team Monsters, 75+ Question Sets, Class Board XP Inbox).
 */
(function () {
  'use strict';

  var T3 = window.THREE;
  var K = window.K3;
  var E3D = window.E3D;
  var Q = K.Q;

  /* ---------- Game Configuration & State ---------- */
  var STATE = {
    phase: 'boot',          // boot | title | question | aim | flight | impact | duel | podium
    context: (K.MOBILE && !Q.has('cls')) ? 'solo' : 'classroom', // 'classroom' | 'solo'
    boardMode: Q.get('mode') === 'duel' ? 'duel' : 'cinema',     // 'cinema' | 'duel'
    playLoop: Q.get('loop') === 'target' ? 'target' : 'smash',   // 'smash' (Answer->Smash) | 'target' (Shoot 3D Sails)
    arcGuide: Q.get('arc') === 'full' ? 'guided' : 'pro',        // 'guided' (78% arc) | 'pro' (42% arc + wind)
    teamCount: Math.min(4, Math.max(2, +(Q.get('teams') || 2))),
    totalRounds: Math.min(4, Math.max(2, +(Q.get('rounds') || 4))),
    round: 1,               // 1..totalRounds (maps to Stages 1..4!)
    turnIdx: 0,
    teams: [],
    currentItem: null,
    selectedAmmo: 'iron',   // 'iron' | 'bomb' | 'boulder' | 'triple'
    unlockedSuper: false,
    midFlightUsed: false,
    shotScore: 0,
    lastTrails: {},         // teamIdx -> Array<Vector3> ghost trail of previous shot
    duelTimeLeft: 35,
    duelScores: [0, 0]
  };

  var AMMO_TYPES = {
    iron:    { id: 'iron',    label: '⚫ Iron Ball',      mass: 2.2, radius: 0.34, speedMul: 1.00, desc: 'Classic heavy punch' },
    bomb:    { id: 'bomb',    label: '💥 Star-Burst',     mass: 2.0, radius: 0.38, speedMul: 0.98, desc: 'Tap mid-air or hit to BOOM!' },
    boulder: { id: 'boulder', label: '🪨 Runed Boulder',  mass: 6.2, radius: 0.44, speedMul: 0.92, desc: 'Crushes stone walls!' },
    triple:  { id: 'triple',  label: '⚡ Triple Scatter', mass: 1.8, radius: 0.31, speedMul: 1.02, desc: 'Tap mid-air to split ×3!' }
  };

  var STAGE_META = [
    { num: 1, name: 'Stage 1 · Sunny Sandbar Cove',      mult: 1, windMax: 1.2 },
    { num: 2, name: 'Stage 2 · Moving Pirate Fleet',     mult: 1, windMax: 2.4 },
    { num: 3, name: 'Stage 3 · Twin Stone Watchtowers',  mult: 1, windMax: 3.1 },
    { num: 4, name: 'Stage 4 · Boss Flagship Finale (2×)', mult: 2, windMax: 3.6 }
  ];

  /* ---------- Loaded 3D Asset Registry ---------- */
  var MODELS = {};
  var MODEL_URLS = {
    carriage:  'models/cannon-carriage.glb?v=2',
    barrel:    'models/cannon-barrel.glb?v=2',
    tntKeg:    'models/tnt-keg.glb?v=2',
    woodCrate: 'models/wood-crate.glb?v=2',
    woodBeam:  'models/wood-beam.glb?v=2',
    stoneBlk:  'models/stone-block.glb?v=2',
    buoy:      'models/buoy-bumper.glb?v=2',
    boulder:   'models/boulder-ammo.glb?v=2',
    tntAmmo:   'models/tnt-ammo.glb?v=2',
    sloop:     'models/pirate-sloop.glb?v=2',
    flagship:  'models/boss-flagship.glb?v=2',
    goldChest: 'models/gold-chest.glb?v=2',
    headland:  'models/cove-headland.glb?v=2',
    sandbar:   'models/cove-sandbar.glb?v=2',
    trophy:    'models/trophy.glb?v=2',
    palm1:     '../../assets/3d/world/pirate/Environment_PalmTree_1.glb',
    palm2:     '../../assets/3d/world/pirate/Environment_PalmTree_2.glb',
    rock1:     '../../assets/3d/world/pirate/Environment_Rock_1.glb',
    dock:      '../../assets/3d/world/pirate/Environment_Dock.glb',
    parrot:    '../../island/planet/models/parrot.glb'
  };

  /* ---------- Scene & Gameplay Runtime Objects ---------- */
  var rawRender = null;
  var skyMesh = null, oceanMesh = null;
  var worldGroup = null, stageGroup = null, fxGroup = null;
  var physStage = null;
  var aiManager = null;
  var movingShips = [];     // { group, vehicle, kinRec, deckAttachments, foamIdx, isRight, answerTxt, buoyMesh, buoyRec }
  var activeProjectiles = []; // { rec, mesh, trailTimer, teamIdx }
  var cannons = [];         // [ cannonRig0, cannonRig1 (for split duel) ]
  var camDuelLeft = null, camDuelRight = null;
  var windFlagMesh = null;
  var qsBank = null;
  var hudBar = null, windPillEl = null, stageBannerEl = null, targetClueEl = null, flightTapBtn = null;

  /* =========================================================================
   * 1. INITIALIZATION & SAFE POSTFX RENDER HOOK
   * ========================================================================= */
  K.init({ fov: 44, far: 420, fog: 0xdaf2ff, fogNear: 82, fogFar: 215, bloom: false, autoPortraitFov: false });
  K.cam.noPortraitPull = true;
  function updateAdaptiveFov() {
    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    K.camera.fov = asp < 0.65 ? 65 : asp < 1.05 ? 52 : 44;
    K.camera.updateProjectionMatrix();
  }
  updateAdaptiveFov();
  window.addEventListener('resize', updateAdaptiveFov);
  qsBank = K.questions('g3-u5-vocab');

  // Hook K.renderer.render cleanly so pmndrs/postprocessing & Split-Screen Duel run inside kit3d's loop with zero recursion
  rawRender = K.renderer.render.bind(K.renderer);
  var _inCustomRender = false;
  E3D.PostFX.init(K.renderer, K.scene, K.camera, { bloomThreshold: 1.03, bloomIntensity: 0.65 });
  window.addEventListener('resize', function () {
    E3D.PostFX.resize(window.innerWidth || 1280, window.innerHeight || 720);
  });

  K.renderer.render = function (scene, camera) {
    if (_inCustomRender || scene !== K.scene) {
      return rawRender(scene, camera);
    }
    _inCustomRender = true;
    try {
      if (STATE.phase === 'duel' && camDuelLeft && camDuelRight) {
        E3D.PostFX.renderSplitHorizontal(K.renderer, K.scene, camDuelLeft, camDuelRight);
      } else if (E3D.PostFX.enabled && E3D.PostFX.composer) {
        E3D.PostFX.renderSingle(K.renderer, K.scene, camera, 1 / 60);
      } else {
        K.renderer.toneMapping = T3.ACESFilmicToneMapping;
        K.renderer.toneMappingExposure = 1.06;
        rawRender(scene, camera);
      }
    } finally {
      _inCustomRender = false;
    }
  };

  /* =========================================================================
   * 2. ASSET PRELOADER & COVE WORLD BUILDER
   * ========================================================================= */
  function loadAllAssets() {
    var keys = Object.keys(MODEL_URLS);
    var jobs = keys.map(function (k) {
      return K.tryGLB(MODEL_URLS[k]).then(function (g) {
        if (g && g.scene) {
          E3D.Shaders.stylizeObject(g.scene, {
            wind: (k === 'palm1' || k === 'palm2') ? 0.16 : 0,
            windHeight: 4.2,
            rim: 0.14
          });
          MODELS[k] = g;
        }
      });
    });
    return Promise.all([E3D.initRapier(), Promise.all(jobs)]);
  }

  function buildCoveWorld() {
    worldGroup = new T3.Group();
    stageGroup = new T3.Group();
    fxGroup = new T3.Group();
    K.scene.add(worldGroup);
    K.scene.add(stageGroup);
    K.scene.add(fxGroup);

    // 1. Messenger Warm Sky Dome & Sun/Teal-Bounce Lights
    skyMesh = E3D.Shaders.createSkyDome();
    K.scene.add(skyMesh);
    K.onFrame(function () {
      skyMesh.position.copy(K.camera.position);
    });
    K.world.lights();
    if (K.sun) {
      K.sun.intensity = 1.72;
      K.sun.color.setHex(0xfff5de);
      var sc = K.sun.shadow.camera;
      sc.left = -26; sc.right = 26; sc.top = 24; sc.bottom = -24; sc.far = 110;
      sc.updateProjectionMatrix();
    }

    // 2. Animated Gerstner Ocean + SDF Coastal Shore Foam
    oceanMesh = E3D.Shaders.createOcean({ size: 360, segments: K.MOBILE ? 96 : 136 });
    worldGroup.add(oceanMesh);

    // 3. Launch Headland Cliff (z = +15.2, flat plateau at y = 2.02)
    if (MODELS.headland) {
      var cliff = MODELS.headland.scene.clone(true);
      cliff.position.set(0, -0.12, 15.2);
      cliff.scale.set(1.18, 1.0, 1.05);
      cliff.receiveShadow = true;
      worldGroup.add(cliff);
    }
    E3D.Shaders.setFoamCollider(0, 0, 15.2, 10.6, 1.0);

    // Wooden launch boardwalk deck on headland
    if (MODELS.dock) {
      for (var dx = -1; dx <= 1; dx++) {
        var dk = MODELS.dock.scene.clone(true);
        K.fitModel(dk, 0.55);
        dk.scale.set(1.35, 0.85, 1.2);
        dk.position.set(dx * 4.1, 1.88, 13.6);
        worldGroup.add(dk);
      }
    }

    // 4. Decorative Coastal Islets, Swaying Palms & Rocks (Instanced / Cloned cleanly)
    var decorSpots = [
      { x: -19, z: 8, s: 0.72 },
      { x:  20, z: 7, s: 0.78 },
      { x: -27, z: -22, s: 0.95 },
      { x:  28, z: -24, s: 0.90 }
    ];
    decorSpots.forEach(function (sp, idx) {
      if (MODELS.sandbar) {
        var isl = MODELS.sandbar.scene.clone(true);
        isl.position.set(sp.x, -0.1, sp.z);
        isl.scale.setScalar(sp.s);
        worldGroup.add(isl);
        E3D.Shaders.setFoamCollider(1 + idx, sp.x, sp.z, 5.1 * sp.s, 0.95);
      }
      var pModel = (idx % 2 === 0 ? MODELS.palm1 : MODELS.palm2) || MODELS.palm1;
      if (pModel) {
        var palm = pModel.scene.clone(true);
        K.fitModel(palm, 4.6 * sp.s + 1.2);
        palm.position.set(sp.x + (idx % 2 ? -1.1 : 1.1), 0.85 * sp.s, sp.z);
        palm.rotation.y = idx * 1.7;
        worldGroup.add(palm);
      }
      if (MODELS.rock1) {
        var rk = MODELS.rock1.scene.clone(true);
        K.fitModel(rk, 1.6 * sp.s);
        rk.position.set(sp.x - 1.5, 0.25, sp.z + 1.2);
        worldGroup.add(rk);
      }
    });

    // Headland framing palms (left & right of the launch deck)
    [-8.6, 8.6].forEach(function (px, i) {
      var pm = (i === 0 ? MODELS.palm1 : MODELS.palm2) || MODELS.palm1;
      if (pm) {
        var p = pm.scene.clone(true);
        K.fitModel(p, 5.2);
        p.position.set(px, 1.85, 15.8);
        p.rotation.y = i ? -0.6 : 0.6;
        worldGroup.add(p);
      }
    });

    // Puffy drifting sky clouds in ONE single InstancedMesh draw call!
    buildInstancedClouds(K.MOBILE ? 8 : 11, -55, 55);

    // 5. Cliffside 3D Wind Flagpole + Dynamic Wind Pennant
    buildWindFlagpole();

    // 6. Flying Guide Parrot (Yuka figure-8 over the cove!)
    aiManager = E3D.AI.createManager();
    if (MODELS.parrot && aiManager) {
      var parrotWrap = new T3.Group();
      var pm2 = MODELS.parrot.scene.clone(true);
      K.fitModel(pm2, 0.85);
      parrotWrap.add(pm2);
      worldGroup.add(parrotWrap);
      var pv = E3D.AI.createPatrolVehicle([
        [-9, 6.8, 4], [0, 7.6, -4], [9, 6.8, 4], [0, 6.2, 10]
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

    // 7. Build Primary Cannon Rig (and Secondary Duel Rig hidden until Duel mode)
    cannons = [
      createCannonRig(0, new T3.Vector3(0, 2.02, 13.4)),
      createCannonRig(1, new T3.Vector3(4.1, 2.02, 13.4))
    ];
    cannons[1].root.visible = false;

    camDuelLeft = new T3.PerspectiveCamera(45, 1, 0.1, 400);
    camDuelRight = new T3.PerspectiveCamera(45, 1, 0.1, 400);

    // Set gorgeous title vista camera
    K.cam.set(new T3.Vector3(5.8, 6.2, 22.5), new T3.Vector3(0, 2.4, -6), 2.2);
    K.cam.snap();
  }

  function buildInstancedClouds(nClouds, x0, x1) {
    var puffGeo = new T3.SphereGeometry(1.0, 12, 8);
    var puffMat = new T3.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.34 });
    var total = nClouds * 5;
    var im = new T3.InstancedMesh(puffGeo, puffMat, total);
    im.frustumCulled = false;
    worldGroup.add(im);
    var puffs = [];
    for (var c = 0; c < nClouds; c++) {
      var cx = K.rnd(x0, x1), cy = K.rnd(16, 25), cz = K.rnd(-68, -28), spd = K.rnd(0.45, 1.05);
      for (var p = 0; p < 5; p++) {
        puffs.push({
          cloudIdx: c, cx: cx, cy: cy, cz: cz, spd: spd,
          ox: p * 1.55 - 3.1, oy: K.rnd(-0.3, 0.5), oz: K.rnd(-0.5, 0.5),
          r: K.rnd(1.25, 2.15)
        });
      }
    }
    var m4 = new T3.Matrix4(), pos = new T3.Vector3(), quat = new T3.Quaternion(), sc = new T3.Vector3();
    K.onFrame(function (dt) {
      for (var i = 0; i < puffs.length; i++) {
        var pf = puffs[i];
        pf.cx += pf.spd * dt;
        if (pf.cx > x1 + 20) pf.cx = x0 - 20;
        pos.set(pf.cx + pf.ox, pf.cy + pf.oy, pf.cz + pf.oz);
        sc.set(pf.r, pf.r * 0.68, pf.r);
        m4.compose(pos, quat, sc);
        im.setMatrixAt(i, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    });
  }

  function buildWindFlagpole() {
    var grp = new T3.Group();
    grp.position.set(6.8, 2.0, 14.4);
    if (MODELS.woodBeam) {
      var pole = MODELS.woodBeam.scene.clone(true);
      pole.rotation.z = Math.PI * 0.5;
      pole.scale.set(1.05, 0.25, 0.25);
      pole.position.y = 1.25;
      grp.add(pole);
    }
    var flagGeo = new T3.PlaneGeometry(1.35, 0.52, 12, 4);
    flagGeo.translate(0.68, 0, 0);
    var flagMat = new T3.MeshStandardMaterial({
      color: 0xff5fa2,
      roughness: 0.55,
      side: T3.DoubleSide
    });
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
      var speed = 4.5 + mag * 3.2;
      var amp = 0.04 + mag * 0.055;
      for (var i = 0; i < arr.length; i += 3) {
        var ox = origPos[i], oy = origPos[i + 1];
        var mask = Math.min(1, ox / 1.55);
        arr[i + 2] = Math.sin(ox * 4.2 - t * speed + oy * 1.5) * amp * mask;
      }
      flagGeo.attributes.position.needsUpdate = true;
    });
  }

  /* =========================================================================
   * 3. ARTICULATED BRASS CANNON RIG + PUPIL 3D AVATAR + TEAM MONSTER + TRAJECTORY
   * ========================================================================= */
  function createCannonRig(slotIdx, pos) {
    var root = new T3.Group();
    root.position.copy(pos);
    worldGroup.add(root);

    // Soft Folio floor shadow beneath cannon
    var cShadow = E3D.Shaders.createContactShadow(1.05, 1.25, 0.72);
    root.add(cShadow);

    var yawGroup = new T3.Group();
    root.add(yawGroup);

    if (MODELS.carriage) {
      var car = MODELS.carriage.scene.clone(true);
      yawGroup.add(car);
    }

    var pitchPivot = new T3.Group();
    pitchPivot.position.set(0, 0.62, 0.02);
    yawGroup.add(pitchPivot);

    var barrelWrap = new T3.Group();
    pitchPivot.add(barrelWrap);
    if (MODELS.barrel) {
      var bar = MODELS.barrel.scene.clone(true);
      barrelWrap.add(bar);
    }

    // Glowing HDR Fuse Spark at breech (+Z of barrel, emissive > 1.0 for selective bloom!)
    var sparkMat = new T3.MeshStandardMaterial({
      color: 0xffe066,
      emissive: new T3.Color(0xff9900),
      emissiveIntensity: 2.6,
      roughness: 0.2
    });
    var fuseSpark = new T3.Mesh(new T3.OctahedronGeometry(0.085, 1), sparkMat);
    fuseSpark.position.set(0, 0.24, 0.62);
    barrelWrap.add(fuseSpark);

    // Trajectory Preview Instanced Spheres (28 live + 22 ghost from last shot)
    var dotGeo = new T3.SphereGeometry(0.13, 10, 8);
    var dotMat = new T3.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new T3.Color(0xffd447),
      emissiveIntensity: 1.45,
      transparent: true,
      opacity: 0.92
    });
    var arcDots = new T3.InstancedMesh(dotGeo, dotMat, 28);
    arcDots.count = 0;
    arcDots.frustumCulled = false;
    fxGroup.add(arcDots);

    var ghostMat = new T3.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.30,
      depthWrite: false
    });
    var ghostDots = new T3.InstancedMesh(dotGeo, ghostMat, 22);
    ghostDots.count = 0;
    ghostDots.frustumCulled = false;
    fxGroup.add(ghostDots);

    var rig = {
      slotIdx: slotIdx,
      root: root,
      yawGroup: yawGroup,
      pitchPivot: pitchPivot,
      barrelWrap: barrelWrap,
      fuseSpark: fuseSpark,
      arcDots: arcDots,
      ghostDots: ghostDots,
      yaw: 0,               // radians (-0.58 .. +0.58)
      pitch: 0.36,          // radians (0.14 .. 0.82)
      power: 0.68,          // 0.35 .. 1.00
      recoil: 0,
      kidChar: null,
      monChar: null,
      activeTeamIdx: slotIdx,
      activeStudentId: ''
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

    // 1) Spawn Pupil's 3D Kid Avatar on left of cannon!
    K.makeCharacter(team, { kidsOnly: true, studentId: sid, kidHeight: 1.52 }).then(function (kid) {
      if (rig._castKey !== key) return;
      kid.root.position.set(-1.32, 0, 0.25);
      kid.root.rotation.y = Math.PI * 0.88;
      kid.root.add(E3D.Shaders.createContactShadow(0.45, 0.45, 0.55));
      rig.root.add(kid.root);
      rig.kidChar = kid;
      kid.setState('wave');
      K.after(1.1, function () { if (kid.state === 'wave') kid.setState('ready'); });
    });

    // 2) Spawn Team's 3D Monster Companion on right of cannon!
    K.makeCharacter(team, { monHeight: 1.15 }).then(function (mon) {
      if (rig._castKey !== key) return;
      mon.root.position.set(1.28, 0, 0.28);
      mon.root.rotation.y = -Math.PI * 0.82;
      mon.root.add(E3D.Shaders.createContactShadow(0.48, 0.48, 0.55));
      rig.root.add(mon.root);
      rig.monChar = mon;
      mon.setState('cheer');
      K.after(1.1, function () { if (mon.state === 'cheer') mon.setState('idle'); });
    });
  }

  function computeLaunchParams(rig, ammoKey) {
    var ammo = AMMO_TYPES[ammoKey || STATE.selectedAmmo] || AMMO_TYPES.iron;
    var speed = (18.5 + rig.power * 13.5) * ammo.speedMul;
    // Muzzle world position & forward direction (-Z rotated by pitch & yaw)
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
      rig.ghostDots.count = 0;
      return;
    }
    var lp = computeLaunchParams(rig, STATE.selectedAmmo);
    var ammoMass = lp.ammo.mass;
    var ax = (E3D.wind.x * 2.2) / ammoMass;
    var ay = -16.5;
    var az = (E3D.wind.z * 2.2) / ammoMass;

    // Estimate total flight time until water y=0
    var vy = lp.vel.y, y0 = lp.origin.y;
    var disc = Math.max(0, vy * vy - 2 * ay * y0);
    var tFlight = Math.min(2.8, (-vy - Math.sqrt(disc)) / ay);
    var frac = STATE.arcGuide === 'guided' ? 0.78 : 0.42;
    var nDots = STATE.arcGuide === 'guided' ? 24 : 15;
    var m4 = new T3.Matrix4(), p = new T3.Vector3(), q = new T3.Quaternion(), sc = new T3.Vector3();

    rig.arcDots.material.color.setHex(K.TEAMS[rig.activeTeamIdx % 4].hex);
    for (var i = 0; i < nDots; i++) {
      var t = ((i + 1) / nDots) * (tFlight * frac);
      p.set(
        lp.origin.x + lp.vel.x * t + 0.5 * ax * t * t,
        lp.origin.y + lp.vel.y * t + 0.5 * ay * t * t,
        lp.origin.z + lp.vel.z * t + 0.5 * az * t * t
      );
      var fade = 1.0 - (i / nDots) * 0.58;
      sc.setScalar(fade);
      m4.compose(p, q, sc);
      rig.arcDots.setMatrixAt(i, m4);
    }
    rig.arcDots.count = nDots;
    rig.arcDots.instanceMatrix.needsUpdate = true;

    // Previous shot ghost trail for this team!
    var ghost = STATE.lastTrails[rig.activeTeamIdx];
    if (ghost && ghost.length) {
      var gn = Math.min(22, ghost.length);
      for (var g = 0; g < gn; g++) {
        sc.setScalar(0.62 * (1 - g / (gn + 4)));
        m4.compose(ghost[g], q, sc);
        rig.ghostDots.setMatrixAt(g, m4);
      }
      rig.ghostDots.count = gn;
      rig.ghostDots.instanceMatrix.needsUpdate = true;
    } else {
      rig.ghostDots.count = 0;
    }
  }

  /* =========================================================================
   * 4. STAGE BUILDER: 4 ESCALATING RAPIER 3D DESTRUCTION STAGES + SAIL TARGETS
   * ========================================================================= */
  function extractPrimaryMesh(gltfObj) {
    var found = null;
    if (!gltfObj || !gltfObj.scene) return null;
    gltfObj.scene.updateMatrixWorld(true);
    gltfObj.scene.traverse(function (o) {
      if (!found && o.isMesh && o.geometry) found = o;
    });
    return found;
  }

  function clearStage() {
    if (physStage) {
      physStage.dispose(stageGroup);
      physStage = null;
    }
    movingShips = [];
    activeProjectiles = [];
    if (aiManager) {
      // Keep only parrot (entity 0 if present), remove ship vehicles
      var ents = aiManager.entities.slice();
      ents.forEach(function (e) { if (e._isShip) aiManager.remove(e); });
    }
    while (stageGroup.children.length) {
      stageGroup.remove(stageGroup.children[0]);
    }
    E3D.Shaders.clearFoamColliders(5);
  }

  function rollStageWind(stageMeta) {
    var maxW = STATE.arcGuide === 'guided' ? stageMeta.windMax * 0.35 : stageMeta.windMax;
    var wx = K.rnd(-maxW, maxW);
    if (Math.abs(wx) < 0.35 && maxW > 0.8) wx = (wx >= 0 ? 0.55 : -0.55);
    var wz = K.rnd(-0.45, 0.45);
    E3D.wind.set(wx, 0, wz);
    E3D.uWind.value.set(wx * 0.42, wz * 0.42);
    refreshWindPill();
  }

  function registerDestructibleBatches(ps) {
    var map = [
      { key: 'crate', model: MODELS.woodCrate, max: 64 },
      { key: 'beam',  model: MODELS.woodBeam,  max: 36 },
      { key: 'stone', model: MODELS.stoneBlk,  max: 48 },
      { key: 'tnt',   model: MODELS.tntKeg,    max: 24 },
      { key: 'chest', model: MODELS.goldChest, max: 12 }
    ];
    map.forEach(function (m) {
      var src = extractPrimaryMesh(m.model);
      if (src) {
        var geo = src.geometry.clone();
        var mat = Array.isArray(src.material) ? src.material[0].clone() : src.material.clone();
        E3D.Shaders.stylizeMaterial(mat, { rim: 0.14 });
        ps.registerBatch(m.key, geo, mat, m.max, stageGroup);
      }
    });
  }

  function addSandbarPlatform(ps, x, z, scale, foamSlot) {
    var topY = 0.92 * scale;
    if (MODELS.sandbar) {
      var sb = MODELS.sandbar.scene.clone(true);
      sb.position.set(x, -0.15, z);
      sb.scale.setScalar(scale);
      sb.receiveShadow = true;
      stageGroup.add(sb);
    }
    ps.addStaticBox(4.3 * scale, 0.6, 3.7 * scale, { x: x, y: topY - 0.6, z: z }, 0, 'island');
    if (foamSlot) E3D.Shaders.setFoamCollider(foamSlot, x, z, 4.9 * scale, 1.0);
    return topY;
  }

  function spawnCratePyramid(ps, cx, baseY, cz, rows, withTnt, withChest) {
    var cw = 0.90, ch = 0.92;
    for (var r = 0; r < rows; r++) {
      var cols = rows - r;
      var y = baseY + ch * 0.5 + r * (ch + 0.01);
      for (var c = 0; c < cols; c++) {
        var x = cx + (c - (cols - 1) * 0.5) * (cw + 0.05);
        var isTnt = withTnt && ((r === 0 && c === Math.floor(cols / 2)) || (rows >= 3 && r === 1 && c === 0));
        if (isTnt) {
          ps.addDynamicBlock({
            batchKey: 'tnt', shape: 'cylinder', radius: 0.36, hy: 0.46,
            pos: { x: x, y: y, z: cz }, density: 1.4, tag: 'tnt', points: 35, sleepInitially: true
          });
        } else {
          ps.addDynamicBlock({
            batchKey: 'crate', shape: 'box', hx: 0.43, hy: 0.46, hz: 0.44,
            pos: { x: x, y: y, z: cz }, density: 1.1, tag: 'crate', points: 15, sleepInitially: true
          });
        }
      }
    }
    if (withChest) {
      ps.addDynamicBlock({
        batchKey: 'chest', shape: 'box', hx: 0.52, hy: 0.40, hz: 0.45,
        pos: { x: cx, y: baseY + rows * (ch + 0.01) + 0.42, z: cz },
        density: 1.3, tag: 'chest', points: 50, sleepInitially: true
      });
    }
  }

  function spawnStoneGateTower(ps, cx, baseY, cz, stories) {
    // Two stone pillars + horizontal wood beam lintel per story + central TNT & top Gold Chest!
    var y = baseY;
    for (var s = 0; s < stories; s++) {
      [-1.02, 1.02].forEach(function (ox) {
        ps.addDynamicBlock({
          batchKey: 'stone', shape: 'box', hx: 0.42, hy: 0.50, hz: 0.42,
          pos: { x: cx + ox, y: y + 0.50, z: cz }, rotY: Math.PI * 0.5,
          density: 2.4, tag: 'stone', points: 20, sleepInitially: true
        });
      });
      // Central TNT Keg or Crate inside the arch!
      ps.addDynamicBlock({
        batchKey: s === 0 ? 'tnt' : 'crate',
        shape: s === 0 ? 'cylinder' : 'box',
        radius: 0.36, hx: 0.43, hy: 0.46, hz: 0.44,
        pos: { x: cx, y: y + 0.46, z: cz },
        density: 1.3, tag: s === 0 ? 'tnt' : 'crate', points: s === 0 ? 35 : 15, sleepInitially: true
      });
      y += 1.02;
      // Wood beam lintel across pillars
      ps.addDynamicBlock({
        batchKey: 'beam', shape: 'box', hx: 1.20, hy: 0.34, hz: 0.35,
        pos: { x: cx, y: y + 0.34, z: cz },
        density: 1.5, tag: 'beam', points: 20, sleepInitially: true
      });
      y += 0.69;
    }
    ps.addDynamicBlock({
      batchKey: 'chest', shape: 'box', hx: 0.52, hy: 0.40, hz: 0.45,
      pos: { x: cx, y: y + 0.42, z: cz },
      density: 1.3, tag: 'chest', points: 50, sleepInitially: true
    });
  }

  function makeSailBannerMesh(badgeNum, text, teamHex, imgUrl) {
    var badgeColors = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a'];
    var bc = badgeColors[(badgeNum - 1) % 4];
    var cv = document.createElement('canvas');
    cv.width = 512; cv.height = 360;
    var g = cv.getContext('2d');

    function drawCard(loadedImg) {
      // Solid bright team-colour outer frame (zero black corners per ART_STYLE.md §3!)
      g.fillStyle = bc;
      g.fillRect(0, 0, 512, 360);
      g.fillStyle = '#fff9ee';
      K.roundRect(g, 16, 16, 480, 328, 30);
      g.fill();

      // Number badge pill top-left
      g.fillStyle = bc;
      K.roundRect(g, 28, 28, 76, 64, 22);
      g.fill();
      g.fillStyle = '#ffffff';
      g.font = '900 44px Nunito, Trebuchet MS, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(String(badgeNum), 66, 62);

      // Text / image content readable from 4m away!
      var words = String(text || '').trim();
      if (loadedImg) {
        g.drawImage(loadedImg, 186, 28, 140, 140);
        g.fillStyle = '#2b1d40';
        g.font = '900 ' + (words.length > 16 ? '40' : '48') + 'px Nunito, Trebuchet MS, sans-serif';
        wrapCanvasText(g, words, 256, 245, 430, 48);
      } else {
        g.fillStyle = '#2b1d40';
        var fs = words.length > 22 ? 40 : words.length > 12 ? 50 : 62;
        g.font = '900 ' + fs + 'px Nunito, Trebuchet MS, sans-serif';
        wrapCanvasText(g, words, 256, 198, 436, fs * 1.12);
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

    // Slightly billowed 3D sail geometry
    var geo = new T3.PlaneGeometry(4.3, 3.0, 8, 4);
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var u = (pos.getX(i) / 4.3) + 0.5;
      var v = (pos.getY(i) / 3.0) + 0.5;
      pos.setZ(i, Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.28);
    }
    geo.computeVertexNormals();
    var mat = new T3.MeshStandardMaterial({
      map: tex,
      roughness: 0.65,
      metalness: 0.0,
      side: T3.DoubleSide
    });
    var mesh = new T3.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
  }

  function wrapCanvasText(ctx, text, cx, cy, maxW, lineH) {
    var parts = text.split(/\s+/);
    var lines = [], cur = '';
    parts.forEach(function (w) {
      var test = cur ? (cur + ' ' + w) : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    });
    if (cur) lines.push(cur);
    var startY = cy - ((lines.length - 1) * lineH) * 0.5;
    lines.forEach(function (ln, idx) {
      ctx.fillText(ln, cx, startY + idx * lineH);
    });
  }

  function buildTargetShootStage(item, stageIdx) {
    clearStage();
    var meta = STAGE_META[(stageIdx - 1) % STAGE_META.length];
    rollStageWind(meta);

    physStage = new E3D.PhysicsStage({ onCollision: handlePhysicsCollision });
    registerDestructibleBatches(physStage);

    var choices = K.shuffle([item.a].concat((item.w || ['wrong 1', 'wrong 2']).slice(0, 2)));
    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    var spreadX = asp < 0.75 ? 6.1 : asp < 1.05 ? 7.6 : 9.2;
    var laneX = [-spreadX, 0.0, spreadX];
    var laneZ = [-13.8, -16.2, -13.8];

    choices.forEach(function (ans, idx) {
      var isRight = ans === item.a;
      var x = laneX[idx], z = laneZ[idx];

      var shipGrp = new T3.Group();
      shipGrp.position.set(x, 0.05, z);
      stageGroup.add(shipGrp);

      var hullModel = (stageIdx === 4 && isRight && MODELS.flagship) ? MODELS.flagship : MODELS.sloop;
      if (hullModel) {
        var hull = hullModel.scene.clone(true);
        if (hullModel === MODELS.flagship) hull.scale.setScalar(0.68);
        // Face bow pleasantly across the bay
        hull.rotation.y = idx === 0 ? Math.PI : 0;
        shipGrp.add(hull);
      }

      // Mast + Giant Readable Answer Sail facing the player (+Z)!
      var sail = makeSailBannerMesh(idx + 1, ans, K.TEAMS[idx % 4].hex, '');
      sail.position.set(0, 3.25, 0.35);
      shipGrp.add(sail);

      // Kinematic collider for the ship + sail so hitting the sail or hull registers cleanly!
      var kinRec = physStage.addKinematicBody(2.3, 2.35, 1.5, { x: x, y: 2.1, z: z }, isRight ? 'right_ship' : 'wrong_ship', {
        isRight: isRight,
        answer: ans,
        shipGrp: shipGrp,
        sail: sail,
        laneIdx: idx
      });

      var attachments = [];
      if (isRight) {
        // Stack real dynamic TNT & Gold Chest + Crates on/behind the right ship so hitting it triggers a real collapse!
        var deckY = addSandbarPlatform(physStage, x, z - 2.6, 0.65, 6 + idx);
        spawnCratePyramid(physStage, x, deckY, z - 2.6, stageIdx >= 3 ? 3 : 2, true, true);
      } else if (MODELS.buoy) {
        // Cute rubbery Bumper Buoy guarding wrong ship
        var buoyMesh = MODELS.buoy.scene.clone(true);
        buoyMesh.position.set(x, 0.08, z + 2.2);
        stageGroup.add(buoyMesh);
        var buoyRec = physStage.addKinematicBody(0.85, 0.75, 0.85, { x: x, y: 0.55, z: z + 2.2 }, 'buoy', {
          buoyMesh: buoyMesh,
          answer: ans
        });
        attachments.push({ buoyMesh: buoyMesh, buoyRec: buoyRec, offsetZ: 2.2 });
      }

      E3D.Shaders.setFoamCollider(10 + idx, x, z, 2.7, 0.9);
      movingShips.push({
        group: shipGrp,
        kinRec: kinRec,
        baseX: x,
        baseZ: z,
        swayAmp: stageIdx >= 2 ? (1.35 + stageIdx * 0.35) : 0.25,
        swayPhase: idx * 2.1,
        foamIdx: 10 + idx,
        attachments: attachments
      });
    });
  }

  function buildSmashStage(stageIdx) {
    clearStage();
    var sNum = ((stageIdx - 1) % 4) + 1;
    var meta = STAGE_META[sNum - 1];
    rollStageWind(meta);

    physStage = new E3D.PhysicsStage({ onCollision: handlePhysicsCollision });
    registerDestructibleBatches(physStage);

    if (sNum === 1) {
      // STAGE 1: Sunny Sandbar Cove — Twin Wooden Crate & TNT Pyramids!
      var yC = addSandbarPlatform(physStage, 0, -14.2, 1.05, 6);
      spawnCratePyramid(physStage, 0, yC, -14.2, 3, true, true);

      var yL = addSandbarPlatform(physStage, -7.2, -16.8, 0.82, 7);
      spawnCratePyramid(physStage, -7.2, yL, -16.8, 2, true, false);

      var yR = addSandbarPlatform(physStage, 7.2, -16.8, 0.82, 8);
      spawnCratePyramid(physStage, 7.2, yR, -16.8, 2, true, false);
    } else if (sNum === 2) {
      // STAGE 2: Moving Pirate Fleet — Yuka-steered Sloops + Central Treasure Reef!
      var yM = addSandbarPlatform(physStage, 0, -17.5, 0.92, 6);
      spawnStoneGateTower(physStage, 0, yM, -17.5, 1);

      [-1, 1].forEach(function (dir, idx) {
        var grp = new T3.Group();
        var bz = idx === 0 ? -12.6 : -21.2;
        grp.position.set(dir * -8, 0.05, bz);
        if (MODELS.sloop) {
          var sl = MODELS.sloop.scene.clone(true);
          sl.rotation.y = dir > 0 ? Math.PI : 0;
          grp.add(sl);
        }
        // Decorative TNT + Gold Chest riding on the moving ship deck!
        if (MODELS.tntKeg) {
          var tk = MODELS.tntKeg.scene.clone(true);
          tk.position.set(-0.5, 0.95, 0);
          grp.add(tk);
        }
        if (MODELS.goldChest) {
          var gc = MODELS.goldChest.scene.clone(true);
          gc.position.set(0.55, 0.92, 0);
          grp.add(gc);
        }
        stageGroup.add(grp);

        var veh = E3D.AI.createPatrolVehicle([
          [-9.5, 0, bz], [9.5, 0, bz]
        ], 3.4 + idx * 0.6, true);
        if (veh && aiManager) { veh._isShip = true; aiManager.add(veh); }

        var kin = physStage.addKinematicBody(2.4, 1.3, 1.3, { x: grp.position.x, y: 1.0, z: bz }, 'bonus_ship', {
          shipGrp: grp, points: 65, hit: false
        });
        movingShips.push({
          group: grp, vehicle: veh, kinRec: kin, baseX: 0, baseZ: bz, foamIdx: 10 + idx, attachments: []
        });
      });
    } else if (sNum === 3) {
      // STAGE 3: Twin Stone Watchtowers & Bumper Buoys!
      var y1 = addSandbarPlatform(physStage, -5.6, -15.6, 0.98, 6);
      spawnStoneGateTower(physStage, -5.6, y1, -15.6, 2);

      var y2 = addSandbarPlatform(physStage, 5.6, -15.6, 0.98, 7);
      spawnStoneGateTower(physStage, 5.6, y2, -15.6, 2);

      var y3 = addSandbarPlatform(physStage, 0, -19.8, 0.85, 8);
      spawnCratePyramid(physStage, 0, y3, -19.8, 3, true, true);

      // Challenging bumper buoy in front center
      if (MODELS.buoy) {
        var bm = MODELS.buoy.scene.clone(true);
        bm.position.set(0, 0.08, -11.4);
        stageGroup.add(bm);
        var br = physStage.addKinematicBody(0.8, 0.7, 0.8, { x: 0, y: 0.55, z: -11.4 }, 'buoy', { buoyMesh: bm });
        movingShips.push({ group: bm, kinRec: br, baseX: 0, baseZ: -11.4, swayAmp: 2.2, swayPhase: 0.5, foamIdx: 13, attachments: [] });
      }
    } else {
      // STAGE 4 (2x GOLD BOSS!): Captain Flint's Armored Flagship + Twin Bastion Reefs!
      var bossGrp = new T3.Group();
      bossGrp.position.set(0, 0.1, -18.2);
      if (MODELS.flagship) {
        var fl = MODELS.flagship.scene.clone(true);
        bossGrp.add(fl);
      }
      stageGroup.add(bossGrp);
      var bossKin = physStage.addKinematicBody(4.1, 3.2, 2.0, { x: 0, y: 2.4, z: -18.2 }, 'boss_ship', {
        shipGrp: bossGrp, points: 90, hp: 3
      });
      movingShips.push({
        group: bossGrp, kinRec: bossKin, baseX: 0, baseZ: -18.2, swayAmp: 3.4, swayPhase: 0, foamIdx: 10, attachments: []
      });

      var yBL = addSandbarPlatform(physStage, -7.8, -14.8, 0.90, 6);
      spawnStoneGateTower(physStage, -7.8, yBL, -14.8, 2);

      var yBR = addSandbarPlatform(physStage, 7.8, -14.8, 0.90, 7);
      spawnStoneGateTower(physStage, 7.8, yBR, -14.8, 2);
    }
  }

  /* =========================================================================
   * 5. COLLISION EVENTS, TNT CHAIN REACTIONS & SCORING JUICE
   * ========================================================================= */
  var _lastCrunchAt = 0;

  function awardHitPoints(pts, worldPos, labelOverride, teamIdxOverride) {
    var mult = STAGE_META[(STATE.round - 1) % 4].mult || 1;
    var total = Math.round(pts * mult);
    var tIdx = teamIdxOverride != null ? teamIdxOverride : STATE.turnIdx;
    STATE.shotScore += total;
    if (STATE.phase === 'duel') {
      STATE.duelScores[tIdx % 2] = (STATE.duelScores[tIdx % 2] || 0) + total;
    } else if (STATE.teams[tIdx]) {
      STATE.teams[tIdx].score = (STATE.teams[tIdx].score || 0) + total;
      if (hudBar) { hudBar.refresh(STATE.turnIdx); hudBar.bump(tIdx); }
    }
    var col = K.TEAMS[tIdx % 4].c;
    K.fx.text(labelOverride || ('+' + total), worldPos.clone().add(new T3.Vector3(0, 0.9, 0)), col, total >= 50 ? 1.9 : 1.35);
  }

  function triggerTntExplosion(pos, teamIdx) {
    E3D.Audio.tntBoom();
    K.cam.shake(0.42);
    K.fx.ring(pos, 0xffb320, 6.2);
    K.fx.puff(pos, 16, { color: 0xffe4a0, size: 1.8, spread: 2.2, life: 1.25 });
    K.fx.burst(pos, [0xff5fa2, 0xffb320, 0xff4757, 0xfff3b0], 22, 11);
    if (physStage) {
      physStage.radialExplosion(pos, 6.2, 26.0);
    }
    // Brief dramatic slow-mo hit-stop in Cinema mode!
    if (STATE.boardMode !== 'duel' && STATE.phase === 'flight') {
      K.timeScale = 0.34;
      K.after(0.28, function () { K.timeScale = 1.0; });
    }
  }

  function handlePhysicsCollision(a, b) {
    var ammoRec = a.tag === 'ammo' ? a : (b.tag === 'ammo' ? b : null);
    var other = ammoRec === a ? b : a;

    // 1. Direct TNT Keg detonation (hit by cannonball OR crushed hard by falling stone!)
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

    // Star-Burst Bomb explodes on FIRST solid impact!
    if (ammoRec.data.ammoType === 'bomb' && !ammoRec.data.detonated && other.tag !== 'ammo') {
      ammoRec.data.detonated = true;
      triggerTntExplosion(hitPos, tIdx);
    }

    // 2. Quick-Target-Shoot Ships (Right vs Wrong!)
    if (other.tag === 'right_ship' && !other.data.scored) {
      other.data.scored = true;
      K.sfx('bullseye');
      K.fx.confetti(hitPos, 42);
      triggerTntExplosion(hitPos, tIdx);
      awardHitPoints(60, hitPos, '🎯 RIGHT! +60', tIdx);
      var sp = K.cls && K.cls.speaker && K.cls.speaker(STATE.teams[tIdx]);
      if (sp) { sp.turns++; sp.right++; STATE.teams[tIdx].speakerIdx = (STATE.teams[tIdx].speakerIdx || 0) + 1; }
      if (cannons[0].kidChar) cannons[0].kidChar.setState('cheer');
      if (cannons[0].monChar) cannons[0].monChar.setState('cheer');
      return;
    }

    if ((other.tag === 'wrong_ship' || other.tag === 'buoy') && !ammoRec.data.bouncedWrong) {
      ammoRec.data.bouncedWrong = true;
      E3D.Audio.buoyBoing();
      K.fx.ring(hitPos, 0x4f9dff, 3.2);
      K.fx.text('Boing! Try again!', hitPos, '#4f9dff', 1.35);
      // Bounce cannonball upward & back playfully
      ammoRec.body.setLinvel({ x: K.rnd(-4, 4), y: 11.5, z: 9.5 }, true);
      if (other.data && other.data.buoyMesh) {
        other.data.buoyMesh.scale.set(1.32, 0.72, 1.32);
        K.after(0.18, function () { if (other.data.buoyMesh) other.data.buoyMesh.scale.set(1, 1, 1); });
      }
      if (STATE.currentItem && STATE.playLoop === 'target') {
        K.say(STATE.currentItem.a);
      }
      return;
    }

    // 3. Moving Bonus Sloop or Boss Flagship Hit!
    if ((other.tag === 'bonus_ship' || other.tag === 'boss_ship') && !ammoRec.data.hitShip) {
      ammoRec.data.hitShip = true;
      var isBoss = other.tag === 'boss_ship';
      E3D.Audio.woodCrunch(1.1);
      K.cam.shake(isBoss ? 0.36 : 0.24);
      K.fx.confetti(hitPos, isBoss ? 48 : 28);
      K.fx.burst(hitPos, [0xffc93c, 0xc98a4b, 0xff5fa2], 18, 9);
      awardHitPoints(other.data.points || 65, hitPos, isBoss ? '🏴‍☠️ BOSS HIT!' : '⛵ SHIP HIT!', tIdx);
      if (isBoss) triggerTntExplosion(hitPos, tIdx);
      return;
    }

    // 4. Dynamic Crates, Wood Beams, Stone Blocks & Gold Chests!
    if (other.kind === 'dynamic') {
      if (K.now - _lastCrunchAt > 0.08) {
        _lastCrunchAt = K.now;
        E3D.Audio.woodCrunch(0.85);
      }
      if (!other.scored) {
        other.scored = true;
        K.fx.burst(hitPos, other.tag === 'chest' ? [0xffc93c, 0xfff3a8] : [0xc98a4b, 0xe3d6c0], other.tag === 'chest' ? 18 : 7, 6.5);
        if (other.tag === 'chest') {
          K.sfx('bullseye');
          K.fx.confetti(hitPos, 35);
          physStage.hideRecord(other);
          awardHitPoints(50, hitPos, '👑 CHEST +50!', tIdx);
        } else {
          awardHitPoints(other.points || 15, hitPos, null, tIdx);
        }
        // Focus impact camera in Cinema mode on first big tower impact!
        if (STATE.boardMode !== 'duel' && STATE.phase === 'flight' && !ammoRec.data.impactCamTriggered) {
          ammoRec.data.impactCamTriggered = true;
          K.cam.shake(0.26);
          K.cam.follow = null;
          K.cam.set(
            new T3.Vector3(hitPos.x * 0.55 + 4.5, Math.max(3.6, hitPos.y + 2.8), hitPos.z + 9.5),
            new T3.Vector3(hitPos.x, Math.max(1.2, hitPos.y), hitPos.z),
            4.2
          );
          K.timeScale = 0.36;
          K.after(0.24, function () { K.timeScale = 1.0; });
        }
      }
    }
  }

  /* =========================================================================
   * 6. FIRING CANNONBALLS & MID-AIR SPECIAL ABILITIES
   * ========================================================================= */
  function fireCannon(rig, ammoKey, teamIdx) {
    var lp = computeLaunchParams(rig, ammoKey);
    rig.recoil = 1.0;
    updateTrajectoryArc(rig, false);
    E3D.Audio.cannonFire(rig.power);

    // Muzzle flash + smoke ring
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
      data: {
        ammoType: ammoKey,
        teamIdx: teamIdx,
        trail: []
      }
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
      // Glossy stylized iron/star cannonball with glowing HDR team-colored rim band
      var ball = new T3.Mesh(
        new T3.SphereGeometry(ammoKey === 'triple' ? 0.30 : 0.34, 18, 14),
        new T3.MeshStandardMaterial({
          color: ammoKey === 'triple' ? teamHex : 0x3b3554,
          emissive: new T3.Color(teamHex),
          emissiveIntensity: ammoKey === 'triple' ? 1.35 : 0.35,
          roughness: 0.32,
          metalness: 0.25
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
      [-3.4, 3.4].forEach(function (vxOff) {
        var m = buildAmmoMesh('triple', K.TEAMS[mainP.teamIdx % 4].hex);
        m.position.copy(pos);
        stageGroup.add(m);
        var subRec = physStage.addDynamicBlock({
          mesh: m, shape: 'ball', radius: 0.30,
          pos: { x: pos.x + vxOff * 0.12, y: pos.y, z: pos.z },
          vel: { x: lv.x + vxOff, y: lv.y + 1.2, z: lv.z },
          density: 5.5, damping: 0.0, ccd: true, tag: 'ammo',
          data: { ammoType: 'iron', teamIdx: mainP.teamIdx, trail: [] }
        });
        activeProjectiles.push({ rec: subRec, mesh: m, trailTimer: 0, teamIdx: mainP.teamIdx, ammoKey: 'triple', splashed: false });
      });
    }
  }

  /* =========================================================================
   * 7. LOWER-45% ERGONOMIC SLINGSHOT TOUCH / MOUSE / KEYBOARD CONTROLLER
   * ========================================================================= */
  var slingRingEl = null, slingKnobEl = null;

  function ensureSlingIndicators() {
    if (!slingRingEl) {
      slingRingEl = K.ui.add(K.el('div', 'cn-sling-ring'));
      slingKnobEl = K.ui.add(K.el('div', 'cn-sling-knob', 'FIRE'));
    }
  }

  function attachAimZone(rig, onFired) {
    ensureSlingIndicators();
    var zone = K.ui.add(K.el('div', 'cn-aim-zone'));
    var dragging = false, pId = -1, startX = 0, startY = 0;
    var baseYaw = rig.yaw, lastTickStep = 0;

    updateTrajectoryArc(rig, true);

    function applyDrag(cx, cy) {
      var dx = cx - startX;
      var dy = cy - startY;
      // Pull-back slingshot: pulling DOWN increases power & pitch; dragging LEFT/RIGHT steers cannon!
      var pull = K.clamp(dy / 145, -0.25, 1.0);
      rig.yaw = K.clamp(baseYaw - (dx / 240) * 0.65, -0.56, 0.56);
      rig.power = K.clamp(0.45 + pull * 0.55, 0.35, 1.0);
      rig.pitch = K.clamp(0.20 + pull * 0.44, 0.14, 0.76);

      var tickStep = Math.round((rig.yaw * 18) + (rig.power * 14));
      if (tickStep !== lastTickStep) {
        lastTickStep = tickStep;
        E3D.Audio.ratchetTick(rig.power);
      }

      // Update visual slingshot indicator right under finger!
      var clampR = Math.min(64, Math.hypot(dx, dy));
      var ang = Math.atan2(dy, dx);
      slingKnobEl.style.left = (startX + Math.cos(ang) * clampR) + 'px';
      slingKnobEl.style.top = (startY + Math.sin(ang) * clampR) + 'px';
      slingKnobEl.textContent = Math.round(rig.power * 100) + '%';

      // Subtle camera aim framing following yaw
      K.cam.set(
        new T3.Vector3(Math.sin(rig.yaw) * -2.2, 5.15, 20.1),
        new T3.Vector3(Math.sin(rig.yaw) * -12.5, 2.4 + rig.pitch * 3.5, -12.5),
        5.5
      );
      updateTrajectoryArc(rig, true);
    }

    zone.addEventListener('pointerdown', function (ev) {
      if (STATE.phase !== 'aim') return;
      dragging = true;
      pId = ev.pointerId;
      startX = ev.clientX;
      startY = ev.clientY;
      baseYaw = rig.yaw;
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
      // Guard accidental tiny 3px tap: require at least 12px drag OR explicit tap-hold
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
      slingRingEl.style.display = 'none';
      slingKnobEl.style.display = 'none';
    });

    function onKey(ev) {
      if (STATE.phase !== 'aim') return;
      if (ev.key === 'ArrowLeft')  { rig.yaw = K.clamp(rig.yaw + 0.05, -0.56, 0.56); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowRight') { rig.yaw = K.clamp(rig.yaw - 0.05, -0.56, 0.56); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowUp')    { rig.pitch = K.clamp(rig.pitch + 0.04, 0.14, 0.76); rig.power = K.clamp(rig.power + 0.05, 0.35, 1.0); updateTrajectoryArc(rig, true); }
      if (ev.key === 'ArrowDown')  { rig.pitch = K.clamp(rig.pitch - 0.04, 0.14, 0.76); rig.power = K.clamp(rig.power - 0.05, 0.35, 1.0); updateTrajectoryArc(rig, true); }
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
   * 8. TURN FLOW: CINEMA MODE, SOLO CAMPAIGN & 2-KID SIMULTANEOUS SPLIT DUEL
   * ========================================================================= */
  function showTitleScreen() {
    STATE.phase = 'title';
    clearStage();
    K.ui.clear();
    K.ui.topButtons();

    cannons[0].root.visible = true;
    cannons[0].root.position.set(0, 2.02, 13.4);
    cannons[1].root.visible = false;
    K.cam.follow = null;
    K.cam.set(new T3.Vector3(5.6, 5.8, 21.8), new T3.Vector3(0, 2.3, -6), 2.2);

    // Decorative background tower in the bay during title screen!
    buildSmashStage(1);

    var wrap = K.ui.add(K.el('div', 'cn-title-wrap'));
    var card = K.el('div', 'cn-title-card');
    wrap.appendChild(card);

    card.innerHTML =
      '<div class="cn-badge-top">🏴‍☠️ SUNNY COVE PHYSICS EDITION · 60 FPS</div>' +
      '<h1 class="cn-title-h1">Pirate &amp; Monster Cannon 3D</h1>' +
      '<p class="cn-title-sub">Pull back, read the wind, and smash 3D island fortresses &amp; pirate ships!</p>';

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

    grid.appendChild(makePillGroup('4. Aiming Guide & Wind', [
      { v: 'pro',    l: '🌬️ Pro Wind (40% Arc)' },
      { v: 'guided', l: '🎯 Guided Arc (Grade 3)' }
    ], STATE.arcGuide, 'green', function (v) { STATE.arcGuide = v; }));

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
      clsHolder.innerHTML = '';
      var dummyTail = K.el('span', '');
      clsHolder.appendChild(dummyTail);

      if (STATE.context === 'solo') {
        boardBoxHolder.appendChild(makePillGroup('2. Campaign Waves', [
          { v: 4, l: '🗺️ All 4 Island Stages (⭐⭐⭐)' }
        ], 4, '', function () {}));
        K.ui.setPicker(clsHolder);
      } else {
        boardBoxHolder.appendChild(makePillGroup('2. Smartboard Style', [
          { v: 'cinema', l: '🎬 Cinema Turns (2–4 Teams)' },
          { v: 'duel',   l: '⚔️ 2-Kid Split Board Duel!' }
        ], STATE.boardMode, '', function (v) { STATE.boardMode = v; }));
        K.cls.setupRow(clsHolder, STATE.teamCount);
      }
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
      '  <div class="cn-step-box"><div class="cn-step-ico">🎯</div><div class="cn-step-t">2. Pull &amp; Aim</div><p class="cn-step-p">Drag down &amp; sideways in the lower screen to aim. Watch the wind flag!</p></div>' +
      '  <div class="cn-step-box"><div class="cn-step-ico">💥</div><div class="cn-step-t">3. Smash Towers!</div><p class="cn-step-p">Topple crates, detonate red star-kegs &amp; sink Captain Flint\u2019s Boss Ship!</p></div>' +
      '</div>';
    var row = K.el('div', 'cn-title-actions');
    var listen = K.el('button', 'cn-btn yellow', '🔊 Listen');
    listen.onclick = function () { K.say('Step one: answer or listen to the English clue. Step two: pull back at the bottom of the screen and watch the wind flag. Step three: smash the pirate towers and treasure chests!'); };
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
    windPillEl = K.el('div', 'cn-mini-pill', '🌬️ Calm');
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
    if (Math.abs(wx) < 0.35) {
      windPillEl.innerHTML = '🌬️ Calm Breeze';
    } else {
      var arrow = wx > 0 ? '➡️' : '⬅️';
      var mph = Math.round(Math.abs(wx) * 5);
      windPillEl.innerHTML = '🌬️ Wind ' + arrow + ' <b>' + mph + ' kt</b>';
    }
  }

  function startGame() {
    STATE.round = Math.min(4, Math.max(1, +(Q.get('stage') || 1)));
    STATE.turnIdx = 0;
    STATE.lastTrails = {};
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
    cannons[0].root.position.set(0, 2.02, 13.4);
    cannons[1].root.visible = false;

    var meta = STAGE_META[(STATE.round - 1) % 4];
    if (stageBannerEl) stageBannerEl.textContent = meta.name + ' · Round ' + STATE.round + '/' + STATE.totalRounds;

    var team = STATE.teams[STATE.turnIdx % STATE.teams.length];
    hudBar.refresh(STATE.turnIdx);
    syncRigCast(cannons[0], team, STATE.turnIdx);
    if (windFlagMesh) windFlagMesh.material.color.setHex(team.hex);

    STATE.currentItem = qsBank.next();
    STATE.selectedAmmo = 'iron';
    STATE.unlockedSuper = false;

    if (STATE.playLoop === 'target') {
      buildTargetShootStage(STATE.currentItem, STATE.round);
      beginCinemaAimPhase(team, true);
    } else {
      if (rebuildStage) buildSmashStage(STATE.round);
      presentSmashQuestion(STATE.currentItem, team);
    }
  }

  function presentSmashQuestion(item, team) {
    STATE.phase = 'question';
    K.cam.follow = null;
    K.cam.set(new T3.Vector3(2.8, 4.5, 18.8), new T3.Vector3(0, 2.4, -8), 3.0);

    var judgeSuper = false;
    var askPromise = K.ui.ask(item, team, {
      prompt: 'Answer to unlock Super Cannonballs!'
    });

    // Inject Teacher 1-Tap Speaking Judge Boost bar into active .qcard (Classroom Mode only!)
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
      STATE.unlockedSuper = !!(ok || judgeSuper);
      STATE.selectedAmmo = judgeSuper ? 'triple' : (ok ? 'bomb' : 'iron');
      if (!ok) {
        // Zero-shame encouragement: pupil STILL gets to fire an Iron Cannonball!
        K.ui.toast('Nice try! Fire the Iron Cannonball! 💪', 1.6, team.c);
      }
      beginCinemaAimPhase(team, false);
    });
  }

  function beginCinemaAimPhase(team, isTargetMode) {
    STATE.phase = 'aim';
    STATE.shotScore = 0;
    STATE.midFlightUsed = false;

    var rig = cannons[0];
    rig.yaw = 0;
    rig.pitch = 0.34;
    rig.power = 0.66;

    var asp = (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 720);
    K.cam.follow = null;
    K.cam.set(new T3.Vector3(0, asp < 0.65 ? 5.65 : 5.15, asp < 0.65 ? 23.0 : 20.1), new T3.Vector3(0, 3.1, -12.5), 3.8);

    // Show Top Clue Banner in Quick-Target-Shoot mode!
    if (targetClueEl) { targetClueEl.remove(); targetClueEl = null; }
    if (isTargetMode && STATE.currentItem) {
      var it = STATE.currentItem;
      targetClueEl = K.ui.add(K.el('div', 'cn-target-clue'));
      targetClueEl.style.setProperty('--c', team.c);
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

    // Bottom Aim HUD + Ammo Selector Chips
    var aimHud = K.ui.add(K.el('div', 'cn-aim-hud'));
    aimHud.style.setProperty('--c', team.c);
    var sp = K.cls && K.cls.speaker && K.cls.speaker(team);
    var who = sp ? sp.name : (STATE.context === 'solo' ? 'Explorer' : ('Team ' + team.name));
    aimHud.appendChild(K.el('span', 'cn-aim-prompt', '🎯 ' + K.esc(who) + ': Pull down & aim!'));

    var availAmmo = STATE.unlockedSuper ? ['bomb', 'boulder', 'triple', 'iron'] : (isTargetMode ? ['iron', 'bomb'] : ['iron']);
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

    if (K.DEMO) {
      K.after(1.3, function () {
        if (STATE.phase !== 'aim') return;
        rig.yaw = K.rnd(-0.18, 0.18);
        rig.pitch = K.rnd(0.32, 0.44);
        rig.power = K.rnd(0.68, 0.84);
        cleanupAim();
        aimHud.remove();
        launchCinemaShot(rig, team);
      });
    }
  }

  function launchCinemaShot(rig, team) {
    STATE.phase = 'flight';
    var pObj = fireCannon(rig, STATE.selectedAmmo, STATE.turnIdx);

    // Mid-air tap button if Bomb or Triple Scatter!
    if (STATE.selectedAmmo === 'bomb' || STATE.selectedAmmo === 'triple') {
      var lbl = STATE.selectedAmmo === 'bomb' ? '💥 TAP TO DETONATE!' : '⚡ TAP TO SPLIT ×3!';
      flightTapBtn = K.ui.add(K.el('button', 'cn-btn yellow cn-flight-tap', lbl));
      flightTapBtn.onclick = triggerMidAirSpecial;
      window.addEventListener('pointerdown', onMidAirWindowTap, { once: true });
    }

    // Smooth 3D Chase Camera trailing right behind & above the flying cannonball!
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

    // Advance turn once physics settles (~3.4 seconds)
    K.after(3.5, function () {
      K.timeScale = 1.0;
      K.cam.follow = null;
      window.removeEventListener('pointerdown', onMidAirWindowTap);
      if (flightTapBtn) { flightTapBtn.remove(); flightTapBtn = null; }
      if (targetClueEl) { targetClueEl.remove(); targetClueEl = null; }

      if (pObj.rec && pObj.rec.data && pObj.rec.data.trail && pObj.rec.data.trail.length > 3) {
        STATE.lastTrails[STATE.turnIdx] = pObj.rec.data.trail.slice(0, 22);
      }

      var prevTurn = STATE.turnIdx;
      STATE.turnIdx = (STATE.turnIdx + 1) % STATE.teams.length;
      var wrappedRound = STATE.turnIdx === 0;
      if (wrappedRound) STATE.round++;

      startNextCinemaRound(wrappedRound || STATE.playLoop === 'target');
    });
  }

  function onMidAirWindowTap(ev) {
    if (ev.target && ev.target.closest && ev.target.closest('.topbtns, .cn-top-cluster')) return;
    if (STATE.phase === 'flight') triggerMidAirSpecial();
  }

  /* ---------- 2-KID SIMULTANEOUS SPLIT-BOARD MULTI-TOUCH DUEL ---------- */
  function startSplitDuelMatch() {
    STATE.phase = 'duel';
    STATE.duelTimeLeft = 35;

    cannons[0].root.visible = true;
    cannons[0].root.position.set(-4.2, 2.02, 13.4);
    cannons[1].root.visible = true;
    cannons[1].root.position.set(4.2, 2.02, 13.4);

    syncRigCast(cannons[0], STATE.teams[0], 0);
    syncRigCast(cannons[1], STATE.teams[1], 1);

    // Build rich combined fortress bay for both kids to bombard simultaneously!
    buildSmashStage(3);
    spawnCratePyramid(physStage, 0, addSandbarPlatform(physStage, 0, -13.2, 0.95, 9), -13.2, 3, true, true);

    var divider = K.ui.add(K.el('div', 'cn-split-divider'));
    if (stageBannerEl) stageBannerEl.textContent = '⚔️ 2-KID DUEL · 35s!';

    var cleanups = [0, 1].map(function (side) {
      var rig = cannons[side];
      rig.yaw = 0; rig.pitch = 0.35; rig.power = 0.70;
      var zEl = K.ui.add(K.el('div', 'cn-duel-zone ' + (side === 0 ? 'left' : 'right')));
      var tag = K.el('div', 'cn-duel-tag', '🎯 Team ' + STATE.teams[side].name + ' · Pull & Fire!');
      tag.style.setProperty('--c', STATE.teams[side].c);
      zEl.appendChild(tag);

      var pId = -1, sx = 0, sy = 0, bYaw = 0, cooldown = false;
      updateTrajectoryArc(rig, true);

      zEl.addEventListener('pointerdown', function (ev) {
        if (STATE.phase !== 'duel' || cooldown) return;
        pId = ev.pointerId; sx = ev.clientX; sy = ev.clientY; bYaw = rig.yaw;
        try { zEl.setPointerCapture(pId); } catch (e) {}
      });
      zEl.addEventListener('pointermove', function (ev) {
        if (ev.pointerId !== pId) return;
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        var pull = K.clamp(dy / 130, -0.2, 1.0);
        rig.yaw = K.clamp(bYaw - (dx / 200) * 0.65, -0.55, 0.55);
        rig.power = K.clamp(0.45 + pull * 0.55, 0.35, 1.0);
        rig.pitch = K.clamp(0.20 + pull * 0.44, 0.14, 0.76);
        updateTrajectoryArc(rig, true);
      });
      zEl.addEventListener('pointerup', function (ev) {
        if (ev.pointerId !== pId) return;
        pId = -1;
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
        cooldown = true;
        fireCannon(rig, side === 0 ? 'iron' : 'iron', side);
        K.after(1.15, function () {
          cooldown = false;
          if (STATE.phase === 'duel') updateTrajectoryArc(rig, true);
        });
      });
      return function () { zEl.remove(); updateTrajectoryArc(rig, false); };
    });

    var timerIv = setInterval(function () {
      if (STATE.phase !== 'duel') { clearInterval(timerIv); return; }
      STATE.duelTimeLeft--;
      if (stageBannerEl) stageBannerEl.textContent = '⚔️ 2-KID SIMULTANEOUS DUEL · ⏱ ' + STATE.duelTimeLeft + 's';
      if (STATE.duelTimeLeft <= 12 && STATE.duelTimeLeft === 12) {
        // Mid-duel bonus TNT crate drop!
        spawnCratePyramid(physStage, 0, 2.2, -13.2, 2, true, true);
        K.ui.big('💥 BONUS CHEST DROP!', 1.0, true);
      }
      if (STATE.duelTimeLeft <= 0) {
        clearInterval(timerIv);
        divider.remove();
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

    // Build festive 3D Podium right on the sunny headland cliff!
    var podGroup = new T3.Group();
    podGroup.position.set(0, 2.02, 12.6);
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
      var stars = sc >= 260 ? '⭐⭐⭐' : sc >= 140 ? '⭐⭐☆' : '⭐☆☆';
      endCard.innerHTML =
        '<div class="cn-stars-row">' + stars + '</div>' +
        '<h2 style="margin:0 0 4px;font-size:1.75rem;font-weight:900;">Island Campaign Complete!</h2>' +
        '<p style="margin:0 0 12px;font-weight:800;color:#5f4f7a;">Total Score: <b>' + sc + ' pts</b></p>';
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
   * 10. FRAME LOOP: PHYSICS, SHIP BUOYANCY, FOAM WAKES & WATER SPLASHES
   * ========================================================================= */
  K.onFrame(function (dt, t) {
    E3D.uTime.value = t;
    if (aiManager) aiManager.update(dt);

    // Update moving ships (Yuka patrol or gentle bay wave sway) + sync kinematic colliders & hull foam!
    for (var s = 0; s < movingShips.length; s++) {
      var sh = movingShips[s];
      var sx = sh.baseX, sz = sh.baseZ;
      if (sh.vehicle) {
        sx = sh.vehicle.position.x;
        sz = sh.vehicle.position.z;
        if (sh.vehicle.velocity.squaredLength() > 0.02) {
          // Models have bow along -X, so facing velocity (vx, vz) -> atan2(vz, -vx)
          sh.group.rotation.y = Math.atan2(sh.vehicle.velocity.z, -sh.vehicle.velocity.x);
        }
      } else if (sh.swayAmp) {
        sx = sh.baseX + Math.sin(t * 0.95 + (sh.swayPhase || 0)) * sh.swayAmp;
      }
      var wy = E3D.sampleWaveHeight(sx, sz, t);
      sh.group.position.set(sx, wy + 0.06, sz);
      sh.group.rotation.z = Math.sin(t * 1.6 + s) * 0.045;
      sh.group.rotation.x = Math.cos(t * 1.3 + s) * 0.035;

      if (sh.kinRec && sh.kinRec.body) {
        sh.kinRec.body.setNextKinematicTranslation({ x: sx, y: wy + 1.9, z: sz });
      }
      if (sh.foamIdx) {
        E3D.Shaders.setFoamCollider(sh.foamIdx, sx, sz, 2.6, 0.92);
      }
      if (sh.attachments && sh.attachments.length) {
        sh.attachments.forEach(function (at) {
          var bz2 = sz + (at.offsetZ || 2.2);
          var by2 = E3D.sampleWaveHeight(sx, bz2, t);
          if (at.buoyMesh) at.buoyMesh.position.set(sx, by2 + 0.06, bz2);
          if (at.buoyRec && at.buoyRec.body) at.buoyRec.body.setNextKinematicTranslation({ x: sx, y: by2 + 0.55, z: bz2 });
        });
      }
    }

    // Step Rapier3D destruction world
    if (physStage) {
      physStage.step(dt);

      // Splash blocks & chests that tumble off sandbars into the sea!
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

    // Update flying projectiles (smoke rings, trail recording, water splash!)
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
        K.fx.ring(wPos, 0xffffff, 3.8);
        K.fx.puff(wPos, 10, { color: 0xe6fbff, size: 1.25, spread: 1.1 });
        physStage.hideRecord(pr.rec);
        activeProjectiles.splice(pi, 1);
      }
    }

    // Update Split-Screen Duel cameras smoothly
    if (STATE.phase === 'duel' && camDuelLeft && camDuelRight) {
      var rL = cannons[0], rR = cannons[1];
      camDuelLeft.position.set(-4.2 - Math.sin(rL.yaw) * 2.0, 5.1, 20.0);
      camDuelLeft.lookAt(-4.2 - Math.sin(rL.yaw) * 11.0, 2.4 + rL.pitch * 3.2, -13.0);
      camDuelRight.position.set(4.2 - Math.sin(rR.yaw) * 2.0, 5.1, 20.0);
      camDuelRight.lookAt(4.2 - Math.sin(rR.yaw) * 11.0, 2.4 + rR.pitch * 3.2, -13.0);
    }
  });

  /* =========================================================================
   * 11. BOOTSTRAP
   * ========================================================================= */
  loadAllAssets().then(function () {
    buildCoveWorld();
    showTitleScreen();
    K.start();
  }).catch(function (err) {
    console.error('[Cannon3D] Boot failed:', err);
  });
})();
