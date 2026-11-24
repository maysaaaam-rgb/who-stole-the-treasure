/* island/treasure3d/player.js
 * Unity-Grade Hero Character Controller, Camera Spring-Arm & Adventure Mechanics:
 * - Real Blender 5.3 Skeletal Clips (kid-sports-anims.glb & kid-tug-anims.glb) + Procedural Carry/Rowing IK
 * - Sprint/Roll Dash (Shift / KeyQ / Dash button) with wind trail & FOV punch
 * - True Shallow-Water Wading (ankle immersion + splash droplets + expanding foam rings) + Deep-Water Guard
 * - Two-Handed Front Plank Carry (full 1.25m oak plank gripped in front of chest!)
 * - Proper Dual-Oar Rowing Physics (submerged oar blades + seated body row lean + V-wake foam)
 * - Dialogue Movement Lock + Soft Auto-Follow Spring-Arm Camera + Cinematic Harbour Fly-In Intro!
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function wrapAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function makeFeatheredShadowTex() {
    var cv = document.createElement('canvas');
    cv.width = 64; cv.height = 64;
    var g = cv.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 4, 32, 32, 30);
    grd.addColorStop(0.0, 'rgba(32, 22, 44, 0.24)');
    grd.addColorStop(0.55, 'rgba(32, 22, 44, 0.10)');
    grd.addColorStop(1.0, 'rgba(32, 22, 44, 0.0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    var t = new T3.CanvasTexture(cv);
    return t;
  }

  function createPlayerSystem(scene, camera, world, sfx, opts) {
    opts = opts || {};
    var K = root.K3;
    var pfx = opts.pfx || null;
    var oarSideToggle = 1;
    var petExclaimCooldown = 0;

    var playerGroup = new T3.Group();
    playerGroup.position.set(world.SPOTS.spawn.x, 1.0, world.SPOTS.spawn.z);
    scene.add(playerGroup);

    // Subtle feathered contact AO (prevents harsh dark double-shadow puddle!)
    var shadowDisc = new T3.Mesh(
      new T3.PlaneGeometry(1.05, 1.05),
      new T3.MeshBasicMaterial({ map: makeFeatheredShadowTex(), transparent: true, depthWrite: false })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.025;
    playerGroup.add(shadowDisc);

    // Sleek Unity Tap-to-Walk Target Ring
    var targetRing = new T3.Mesh(
      new T3.RingGeometry(0.32, 0.46, 24),
      new T3.MeshBasicMaterial({ color: 0x2fc58a, side: T3.DoubleSide, transparent: true, opacity: 0.85, depthTest: false })
    );
    targetRing.rotation.x = -Math.PI / 2;
    targetRing.visible = false;
    targetRing.renderOrder = 9;
    scene.add(targetRing);

    // Water Wading / Boat Wake Ripples & Dust/Splash Particles
    var ripples = [];
    var rippleGeo = new T3.RingGeometry(0.24, 0.36, 24);
    for (var ri = 0; ri < 20; ri++) {
      var rm = new T3.Mesh(rippleGeo, new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, transparent: true, opacity: 0, depthWrite: false }));
      rm.rotation.x = -Math.PI / 2;
      rm.visible = false;
      rm.renderOrder = 3;
      scene.add(rm);
      ripples.push({ mesh: rm, age: 99, maxAge: 1.0, scaleMul: 1 });
    }
    function spawnWaterRipple(x, z, scaleMul) {
      for (var i = 0; i < ripples.length; i++) {
        var rp = ripples[i];
        if (rp.age >= rp.maxAge) {
          rp.age = 0;
          rp.maxAge = 1.05;
          rp.scaleMul = scaleMul || 1.0;
          rp.mesh.position.set(x, 0.04, z);
          rp.mesh.scale.setScalar(0.38 * rp.scaleMul);
          rp.mesh.visible = true;
          return;
        }
      }
    }

    var puffs = [];
    var puffGeo = new T3.SphereGeometry(0.11, 8, 6);
    for (var pi = 0; pi < 24; pi++) {
      var pm = new T3.Mesh(puffGeo, new T3.MeshBasicMaterial({ color: 0xfff5dc, transparent: true, opacity: 0, depthWrite: false }));
      pm.visible = false;
      scene.add(pm);
      puffs.push({ mesh: pm, vx: 0, vy: 0, vz: 0, age: 99, maxAge: 0.55 });
    }
    function spawnDustPuff(x, y, z, hexCol, count) {
      var n = count || 1;
      for (var c = 0; c < n; c++) {
        for (var i = 0; i < puffs.length; i++) {
          var pf = puffs[i];
          if (pf.age >= pf.maxAge) {
            pf.age = 0;
            pf.maxAge = 0.42 + Math.random() * 0.25;
            pf.mesh.material.color.setHex(hexCol || 0xfff3d6);
            pf.mesh.position.set(x + (Math.random() - 0.5) * 0.35, y + 0.08, z + (Math.random() - 0.5) * 0.35);
            pf.vx = (Math.random() - 0.5) * 1.5;
            pf.vy = 0.8 + Math.random() * 1.4;
            pf.vz = (Math.random() - 0.5) * 1.5;
            pf.mesh.scale.setScalar(0.8);
            pf.mesh.visible = true;
            break;
          }
        }
      }
    }

    // ---------- Rowing Boat + Symmetrical Submerged Oar Pivots ----------
    var boatGroup = new T3.Group();
    boatGroup.position.set(world.SPOTS.boatHome.x, 0.06, world.SPOTS.boatHome.z);
    boatGroup.rotation.y = Math.PI * 0.5;
    scene.add(boatGroup);

    var oarLeftYaw = new T3.Group();
    var oarRightYaw = new T3.Group();
    oarLeftYaw.position.set(0.68, 0.48, 0.06);
    oarRightYaw.position.set(-0.68, 0.48, 0.06);
    boatGroup.add(oarLeftYaw);
    boatGroup.add(oarRightYaw);

    world.loadCachedGLB('planet/models/rowing-boat.glb').then(function (g) {
      if (!g || !g.scene) return;
      var bm = g.scene.clone(true);
      var bx = new T3.Box3().setFromObject(bm);
      var len = Math.max(bx.max.x - bx.min.x, bx.max.z - bx.min.z, 0.01);
      bm.scale.multiplyScalar(3.5 / len);
      var bx2 = new T3.Box3().setFromObject(bm);
      bm.position.set(-(bx2.min.x + bx2.max.x) * 0.5, -bx2.min.y * 0.32, -(bx2.min.z + bx2.max.z) * 0.5);
      bm.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      boatGroup.add(bm);
    });

    // Clean symmetrical procedural wooden oars angled cleanly outward into the water!
    (function buildCleanOars() {
      var oarWood = new T3.MeshStandardMaterial({ color: 0xc9823c, roughness: 0.68 });
      var bladeMat = new T3.MeshStandardMaterial({ color: 0xe8a854, roughness: 0.58 });
      [1, -1].forEach(function (side) {
        var holder = new T3.Group();
        var shaft = new T3.Mesh(new T3.CylinderGeometry(0.032, 0.032, 1.55, 8), oarWood);
        shaft.rotation.z = side * (Math.PI * 0.5);
        shaft.position.x = side * 0.52;
        var blade = new T3.Mesh(new T3.BoxGeometry(0.46, 0.03, 0.18), bladeMat);
        blade.position.x = side * 1.28;
        holder.add(shaft);
        holder.add(blade);
        // Angle downward ~26 deg so blades dip cleanly into the water on both sides!
        holder.rotation.z = -side * 0.44;
        if (side > 0) oarLeftYaw.add(holder);
        else oarRightYaw.add(holder);
      });
    })();

    // ---------- 3D Pet Companion ----------
    var petGroup = new T3.Group();
    petGroup.position.set(world.SPOTS.spawn.x + 1.1, 1.0, world.SPOTS.spawn.z + 0.6);
    scene.add(petGroup);
    var petBody = new T3.Group();
    petGroup.add(petBody);
    var petSecretLabel = world.registerLabel('pet-secret', '✨ Secret Nearby!', '#ffb320', 0, 1.2, 0, 14.0);
    petSecretLabel.visible = false;

    function loadPetModel(petItemId) {
      while (petBody.children.length) petBody.remove(petBody.children[0]);
      var petUrl = '../assets/3d/items/' + (petItemId || 'pet-puppy') + '.glb';
      world.loadCachedGLB(petUrl).then(function (g) {
        if (!g || !g.scene) return world.loadCachedGLB('../assets/3d/items/pet-puppy.glb');
        return g;
      }).then(function (g) {
        if (!g || !g.scene) return;
        var pm = g.scene.clone(true);
        var bx = new T3.Box3().setFromObject(pm);
        var s = 0.64 / Math.max(0.01, bx.max.y - bx.min.y);
        pm.scale.multiplyScalar(s);
        var bx2 = new T3.Box3().setFromObject(pm);
        pm.position.set(-(bx2.min.x + bx2.max.x) * 0.5, -bx2.min.y, -(bx2.min.z + bx2.max.z) * 0.5);
        pm.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
        petBody.add(pm);
      });
    }
    loadPetModel('pet-puppy');

    // ---------- Hand Tools & Two-Handed Front Carried Plank ----------
    var toolMeshes = { lantern: null, spyglass: null, shovel: null };
    var carriedPlankGroup = new T3.Group();
    // Held visibly in front of the hero's chest with both hands!
    carriedPlankGroup.position.set(0, 0.96, 0.44);
    carriedPlankGroup.visible = false;
    playerGroup.add(carriedPlankGroup);
    var carriedLabel = world.registerLabel('carried-plank', '🪵 plank', '#2fc58a', 0, 2.0, 0, 18.0);
    carriedLabel.visible = false;

    var handToolAnchor = new T3.Group();
    playerGroup.add(handToolAnchor);

    [
      ['lantern',  'treasure3d/models/tool-lantern.glb',  1.15, [0, -0.02, 0.08], [0, 0, 0]],
      ['spyglass', 'treasure3d/models/tool-spyglass.glb', 1.15, [0, 0.04, 0.12],  [Math.PI * 0.5, 0, 0]],
      ['shovel',   'treasure3d/models/tool-shovel.glb',   1.22, [0, -0.02, 0.10], [0.55, 0, 0]]
    ].forEach(function (td) {
      world.loadCachedGLB(td[1]).then(function (g) {
        if (!g || !g.scene) return;
        var m = g.scene.clone(true);
        m.scale.setScalar(td[2]);
        m.position.fromArray(td[3]);
        m.rotation.set(td[4][0], td[4][1], td[4][2]);
        m.visible = false;
        handToolAnchor.add(m);
        toolMeshes[td[0]] = m;
      });
    });

    world.loadCachedGLB('treasure3d/models/prop-plank.glb').then(function (g) {
      if (!g || !g.scene) return;
      var pm = g.scene.clone(true);
      var bx = new T3.Box3().setFromObject(pm);
      var span = Math.max(bx.max.x - bx.min.x, bx.max.z - bx.min.z, 0.01);
      pm.scale.setScalar(1.22 / span);
      carriedPlankGroup.add(pm);
    });

    // ---------- Hero State & Cinematic Fly-In Intro ----------
    var state = {
      kid: null,
      x: world.SPOTS.spawn.x,
      y: 1.0,
      z: world.SPOTS.spawn.z,
      vy: 0,
      yaw: 2.85, // Facing north-west toward Benbow & Inn!
      speed: 0,
      grounded: true,
      mode: 'walk', // 'walk' | 'boat' | 'spyglass' | 'rest'
      restSpot: null,
      activeTool: 'hand',
      unlockedTools: { hand: true, lantern: false, spyglass: false, shovel: false },
      carryingPlank: null,
      digAnimTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      deepBounceCooldown: 0,
      stepDist: 0,
      rippleTimer: 0,
      oarPhase: 0,
      walkTarget: null,
      camYaw: -0.25, // Looking north from beach toward Benbow Inn & Jungle!
      camPitch: 0.36,
      camDist: 9.6,
      lastManualOrbitAt: -10,
      introFlyTimer: 3.0, // Smooth 3.0s Unity harbour fly-in camera!
      shakeTimer: 0,
      spyYaw: 0.62,
      spyPitch: -0.10,
      spyFov: 28,
      dialogueFocus: null,
      secretTargetFn: null
    };

    var sharedAnimClipsPromise = null;
    function getSharedKidClips() {
      if (sharedAnimClipsPromise) return sharedAnimClipsPromise;
      if (!K || typeof K.loadAnimClips !== 'function') return Promise.resolve([]);
      sharedAnimClipsPromise = Promise.all([
        K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; }),
        K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; })
      ]).then(function (res) {
        return (res[0] || []).concat(res[1] || []);
      });
      return sharedAnimClipsPromise;
    }

    function loadHeroAvatar(studentInfo) {
      studentInfo = studentInfo || {};
      var teamIdx = typeof studentInfo.teamIdx === 'number' ? studentInfo.teamIdx : 1;
      var team = (K && K.TEAMS && K.TEAMS[teamIdx]) || { name: 'Blue', c: '#4f9dff', hex: 0x4f9dff, kid: 'boy', mon: 'aquafind' };
      var sid = studentInfo.id || '';
      var isGirl = studentInfo.gender === 'girl' || /girl|demo-g4|305/i.test(sid);
      var items = Array.isArray(studentInfo.items) ? studentInfo.items.slice() : [];
      if (!items.length) items = isGirl ? ['cs-headband', 'bp-adv-bag'] : ['hat-explorer', 'bp-adv-bag'];

      if (K && typeof K.makeCharacter === 'function') {
        return Promise.all([
          K.makeCharacter(team, {
            kidsOnly: true,
            kid: isGirl ? 'girl' : 'boy',
            kidHeight: 1.66,
            studentId: sid && !/^demo-|^name-/.test(sid) ? sid : '',
            items: items
          }),
          getSharedKidClips()
        ]).then(function (res) {
          var kid = res[0], clips = res[1];
          if (kid && clips && clips.length && kid.attachClips) {
            kid.attachClips(clips);
          }
          if (state.kid && state.kid.root) {
            playerGroup.remove(state.kid.root);
          }
          state.kid = kid;
          if (kid && kid.root) playerGroup.add(kid.root);
          if (studentInfo.petId) loadPetModel(studentInfo.petId);
          return kid;
        });
      }
      return Promise.resolve(null);
    }

    function setTool(toolName, manual) {
      if (toolName !== 'hand' && !state.unlockedTools[toolName] && !opts.isDemo) {
        if (manual && opts.onToast) opts.onToast('🔒 Unlock this tool on your island quest first!');
        return false;
      }
      state.activeTool = toolName;
      Object.keys(toolMeshes).forEach(function (k) {
        if (toolMeshes[k]) toolMeshes[k].visible = (k === toolName && !state.carryingPlank);
      });
      if (opts.onToolChanged) opts.onToolChanged(toolName, state.unlockedTools);
      return true;
    }

    function unlockTool(toolName) {
      state.unlockedTools[toolName] = true;
      if (opts.onToolChanged) opts.onToolChanged(state.activeTool, state.unlockedTools);
    }

    function setCarryingPlank(pickupObj) {
      state.carryingPlank = pickupObj || null;
      carriedPlankGroup.visible = !!pickupObj;
      carriedLabel.visible = !!pickupObj;
      if (pickupObj) {
        carriedLabel.text = '🪵 ' + pickupObj.word;
        Object.keys(toolMeshes).forEach(function (k) { if (toolMeshes[k]) toolMeshes[k].visible = false; });
      } else {
        setTool(state.activeTool, false);
      }
    }

    function triggerJump() {
      state.introFlyTimer = 0;
      if (state.dialogueFocus) return;
      if (state.mode === 'rest') exitRest();
      if (state.mode !== 'walk') return;
      if (state.grounded) {
        state.vy = 7.1;
        state.grounded = false;
        state.walkTarget = null;
        targetRing.visible = false;
        spawnDustPuff(state.x, state.y, state.z, 0xfff5dc, 4);
        if (sfx && sfx.playJump) sfx.playJump();
        if (state.kid && state.kid.setState) state.kid.setState('hop');
      }
    }

    function triggerDash() {
      state.introFlyTimer = 0;
      if (state.dialogueFocus || state.mode !== 'walk' || state.dashCooldown > 0) return;
      state.dashTimer = 0.30;
      state.dashCooldown = 0.85;
      spawnDustPuff(state.x, state.y, state.z, 0xffffff, 5);
      if (pfx) {
        pfx.spawn3D('poof', state.x - Math.sin(state.yaw) * 0.62, state.y + 0.05, state.z - Math.cos(state.yaw) * 0.62, 1.75, { fadeTail: true });
      }
      if (sfx && sfx.playJump) sfx.playJump();
    }

    function triggerCameraShake(dur) {
      state.shakeTimer = Math.max(state.shakeTimer, dur || 0.35);
    }

    function enterBoat() {
      if (state.mode === 'boat') return;
      state.introFlyTimer = 0;
      state.mode = 'boat';
      state.walkTarget = null;
      targetRing.visible = false;
      state.x = boatGroup.position.x;
      state.z = boatGroup.position.z;
      state.y = 0.32;
      state.vy = 0;
      state.camYaw = -Math.PI * 0.5; // Look east toward Shipwreck Island!
      if (sfx && sfx.playSplash) sfx.playSplash();
      spawnWaterRipple(boatGroup.position.x, boatGroup.position.z, 2.2);
      if (pfx) pfx.spawn3D('splash', boatGroup.position.x, 0.04, boatGroup.position.z, 2.05, { startFrame: 5 });
      if (opts.onModeChanged) opts.onModeChanged('boat');
    }

    function exitBoat(landX, landZ) {
      if (state.mode !== 'boat') return;
      state.mode = 'walk';
      state.x = landX;
      state.z = landZ;
      var gi = world.getGroundInfo(landX, landZ);
      state.y = gi.y;
      state.vy = 0;
      state.grounded = true;
      playerGroup.rotation.set(0, state.yaw, 0);
      if (sfx && sfx.playSplash) sfx.playSplash();
      if (pfx) pfx.spawn3D('splash', boatGroup.position.x, 0.04, boatGroup.position.z, 1.85, { startFrame: 5 });
      if (opts.onModeChanged) opts.onModeChanged('walk');
    }

    function enterSpyglassTower() {
      state.introFlyTimer = 0;
      state.mode = 'spyglass';
      world.state.onTower = true;
      state.walkTarget = null;
      targetRing.visible = false;
      state.x = world.SPOTS.lookoutTower.x;
      state.z = world.SPOTS.lookoutTower.z;
      state.y = 10.2;
      state.spyYaw = 0.62;
      state.spyPitch = -0.18;
      state.spyFov = 28;
      setTool('spyglass', false);
      if (opts.onModeChanged) opts.onModeChanged('spyglass');
    }

    function exitSpyglassTower() {
      if (state.mode !== 'spyglass') return;
      state.mode = 'walk';
      world.state.onTower = false;
      state.x = world.SPOTS.lookoutTower.x - 2.4;
      state.z = world.SPOTS.lookoutTower.z + 2.2;
      state.y = world.getGroundInfo(state.x, state.z).y;
      state.vy = 0;
      state.grounded = true;
      camera.fov = (K && K._baseFov) ? K._baseFov : 44;
      camera.updateProjectionMatrix();
      setTool('hand', false);
      if (opts.onModeChanged) opts.onModeChanged('walk');
    }

    function enterRest(spotType, x, z, yaw) {
      state.mode = 'rest';
      state.restSpot = spotType;
      state.walkTarget = null;
      targetRing.visible = false;
      state.x = x;
      state.z = z;
      state.y = world.getGroundInfo(x, z).y + (spotType === 'hammock' ? 0.55 : 0.18);
      state.yaw = yaw || 0;
      if (state.kid && state.kid.setState) state.kid.setState('sitWave');
      if (opts.onModeChanged) opts.onModeChanged('rest');
    }

    function exitRest() {
      if (state.mode !== 'rest') return;
      state.mode = 'walk';
      state.y = world.getGroundInfo(state.x, state.z).y;
      state.grounded = true;
      if (opts.onModeChanged) opts.onModeChanged('walk');
    }

    function playDigScoop(tx, tz) {
      setTool('shovel', false);
      state.digAnimTimer = 0.55;
      state.yaw = Math.atan2(tx - state.x, tz - state.z);
      var dgy = world.getGroundInfo(tx, tz).y;
      spawnDustPuff(tx, dgy + 0.15, tz, 0xd8a25e, 6);
      if (pfx) pfx.spawn3D('dirt-explosion', tx, dgy + 0.02, tz, 2.55, { tint: 0xffe4b0 });
      triggerCameraShake(0.18);
      if (sfx && sfx.playDig) sfx.playDig();
    }

    function setWalkTarget(wx, wz, onArrive) {
      state.introFlyTimer = 0;
      if (state.dialogueFocus || state.mode === 'spyglass') return;
      if (state.mode === 'rest') exitRest();
      state.walkTarget = { x: wx, z: wz, onArrive: onArrive || null };
      var gi = world.getGroundInfo(wx, wz);
      targetRing.position.set(wx, Math.max(0.05, gi.y + 0.05), wz);
      targetRing.visible = true;
    }

    // ---------- Controls Input ----------
    var keys = {};
    var joyVec = { x: 0, y: 0, active: false };
    var runToggle = false;

    root.addEventListener('keydown', function (ev) {
      if (ev.target && /INPUT|TEXTAREA/.test(ev.target.tagName)) return;
      state.introFlyTimer = 0;
      var c = ev.code || ev.key;
      keys[c] = true;
      if (c === 'Space') {
        ev.preventDefault();
        triggerJump();
      } else if (c === 'KeyQ' || c === 'ShiftLeft' || c === 'ShiftRight') {
        triggerDash();
      } else if (c === 'Digit1') setTool('hand', true);
      else if (c === 'Digit2') setTool('lantern', true);
      else if (c === 'Digit3') setTool('spyglass', true);
      else if (c === 'Digit4') setTool('shovel', true);
      else if (c === 'Escape' && state.mode === 'spyglass') exitSpyglassTower();
    });
    root.addEventListener('keyup', function (ev) {
      keys[ev.code || ev.key] = false;
    });

    function resolveCircleCollisions(nx, nz) {
      var cols = world.state.colliders;
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        if (col.tag === 'gate' && world.state.gatesOpen[col.gateId]) continue;
        var dx = nx - col.x, dz = nz - col.z;
        var d = Math.hypot(dx, dz);
        var minR = col.r + 0.44;
        if (d < minR && d > 0.0001) {
          nx = col.x + (dx / d) * minR;
          nz = col.z + (dz / d) * minR;
          if (col.tag === 'gate' && opts.onGateBlocked) {
            opts.onGateBlocked(col.gateId);
          }
        }
      }
      nx = clamp(nx, -54, 82);
      nz = clamp(nz, -52, 60);
      return { x: nx, z: nz };
    }

    var petVel = new T3.Vector3();

    function update(dt, elapsed) {
      dt = Math.min(dt, 0.05);
      if (state.deepBounceCooldown > 0) state.deepBounceCooldown -= dt;
      if (state.digAnimTimer > 0) state.digAnimTimer -= dt;
      if (state.dashTimer > 0) state.dashTimer -= dt;
      if (state.dashCooldown > 0) state.dashCooldown -= dt;
      if (state.introFlyTimer > 0) state.introFlyTimer = Math.max(0, state.introFlyTimer - dt);

      if (targetRing.visible) {
        targetRing.scale.setScalar(0.88 + Math.sin(elapsed * 6.0) * 0.14);
      }

      // Freeze directional walking cleanly while an NPC conversation is open!
      var ix = 0, iz = 0;
      if (!state.dialogueFocus) {
        if (keys.KeyW || keys.ArrowUp) iz -= 1;
        if (keys.KeyS || keys.ArrowDown) iz += 1;
        if (keys.KeyA || keys.ArrowLeft) ix -= 1;
        if (keys.KeyD || keys.ArrowRight) ix += 1;
        if (joyVec.active) {
          ix += joyVec.x;
          iz += joyVec.y;
        }
      } else {
        state.walkTarget = null;
        targetRing.visible = false;
      }

      var inputMag = Math.hypot(ix, iz);
      if (inputMag > 0.08) {
        if (inputMag > 1) { ix /= inputMag; iz /= inputMag; inputMag = 1; }
        state.walkTarget = null;
        targetRing.visible = false;
        if (state.mode === 'rest') exitRest();
      }

      // 1. SPYGLASS 1ST-PERSON TOWER MODE
      if (state.mode === 'spyglass') {
        if (inputMag > 0.08) {
          state.spyYaw -= ix * dt * 1.35;
          state.spyPitch = clamp(state.spyPitch - iz * dt * 0.95, -0.55, 0.35);
        }
        playerGroup.position.set(state.x, state.y, state.z);
        playerGroup.rotation.set(0, state.spyYaw + Math.PI, 0);
        if (state.kid && state.kid.update) {
          state.kid.setState('idle');
          state.kid.update(dt);
        }
        camera.fov += (state.spyFov - camera.fov) * Math.min(1, dt * 8);
        camera.updateProjectionMatrix();
        var eyeY = state.y + 1.55;
        camera.position.set(state.x, eyeY, state.z);
        var lx = state.x - Math.sin(state.spyYaw) * Math.cos(state.spyPitch) * 40;
        var ly = eyeY + Math.sin(state.spyPitch) * 40;
        var lz = state.z - Math.cos(state.spyYaw) * Math.cos(state.spyPitch) * 40;
        camera.lookAt(lx, ly, lz);
        updateParticles(dt);
        return;
      }

      // 2. ROWING BOAT MODE ACROSS DEEP CERULEAN LAGOON
      if (state.mode === 'boat') {
        var bvx = 0, bvz = 0;
        if (inputMag > 0.08) {
          var sinC = Math.sin(state.camYaw), cosC = Math.cos(state.camYaw);
          bvx = ix * cosC + iz * sinC;
          bvz = -ix * sinC + iz * cosC;
        } else if (state.walkTarget) {
          var dtx = state.walkTarget.x - boatGroup.position.x;
          var dtz = state.walkTarget.z - boatGroup.position.z;
          var dtl = Math.hypot(dtx, dtz);
          if (dtl > 1.2) {
            bvx = dtx / dtl;
            bvz = dtz / dtl;
            inputMag = 0.95;
          } else {
            var cb = state.walkTarget.onArrive;
            state.walkTarget = null;
            targetRing.visible = false;
            if (cb) cb();
          }
        }
        var boatSpeed = 8.2 * clamp(inputMag, 0, 1);
        if (boatSpeed > 0.15) {
          var nxB = clamp(boatGroup.position.x + bvx * boatSpeed * dt, 36.8, 59.8);
          var nzB = clamp(boatGroup.position.z + bvz * boatSpeed * dt, 2.0, 26.0);
          var giB = world.getGroundInfo(nxB, nzB);
          if (giB.rawY < -0.10) {
            boatGroup.position.x = nxB;
            boatGroup.position.z = nzB;
          }
          var wantBoatYaw = Math.atan2(bvx, bvz);
          boatGroup.rotation.y += wrapAngle(wantBoatYaw - boatGroup.rotation.y) * Math.min(1, dt * 6.5);
          state.oarPhase += dt * 6.2;
          state.rippleTimer -= dt;
          if (state.rippleTimer <= 0) {
            state.rippleTimer = 0.24;
            spawnWaterRipple(boatGroup.position.x - Math.sin(boatGroup.rotation.y) * 1.1, boatGroup.position.z - Math.cos(boatGroup.rotation.y) * 1.1, 1.9);
            if (pfx) {
              oarSideToggle *= -1;
              var sideOff = 1.15 * oarSideToggle;
              var ox = boatGroup.position.x + Math.cos(boatGroup.rotation.y) * sideOff;
              var oz = boatGroup.position.z - Math.sin(boatGroup.rotation.y) * sideOff;
              pfx.spawn3D('splash', ox, 0.02, oz, 1.15, { startFrame: 6 });
            }
            if (sfx && sfx.playOar) sfx.playOar();
          }
        }
        var waveY = 0.05 + Math.sin(elapsed * 2.2 + boatGroup.position.x * 0.2) * 0.06;
        boatGroup.position.y = waveY;
        boatGroup.rotation.x = Math.sin(elapsed * 1.9) * 0.035;
        boatGroup.rotation.z = Math.cos(elapsed * 1.6) * 0.035;

        // Symmetrical dual oar sweep + dip!
        var oarSweep = Math.sin(state.oarPhase) * 0.58;
        var oarDip = Math.cos(state.oarPhase) * 0.18;
        oarLeftYaw.rotation.y = oarSweep;
        oarRightYaw.rotation.y = -oarSweep;
        oarLeftYaw.rotation.x = oarDip;
        oarRightYaw.rotation.x = oarDip;

        state.x = boatGroup.position.x;
        state.z = boatGroup.position.z;
        state.y = waveY + 0.26;
        state.yaw = boatGroup.rotation.y;
        // Row torso lean synced with oar pull!
        var rowLean = boatSpeed > 0.2 ? Math.sin(state.oarPhase) * 0.20 : 0;
        playerGroup.position.set(state.x, state.y, state.z);
        playerGroup.rotation.set(boatGroup.rotation.x + rowLean, state.yaw, boatGroup.rotation.z);
        shadowDisc.visible = false;

        var bowX = boatGroup.position.x + Math.sin(boatGroup.rotation.y) * 1.14;
        var bowZ = boatGroup.position.z + Math.cos(boatGroup.rotation.y) * 1.14;
        petGroup.position.set(bowX, waveY + 0.72, bowZ);
        petGroup.rotation.y = boatGroup.rotation.y;

        if (state.kid && state.kid.update) {
          state.kid.stopClip && state.kid.stopClip();
          state.kid.setState('sit');
          state.kid.update(dt);
        }
        updateCamera(dt, elapsed);
        updateParticles(dt);
        return;
      }

      // 3. WALK / RUN / SPRINT-DASH / SHALLOW WADING / JUMP
      var moveX = 0, moveZ = 0, moveAmt = 0;
      var isDashing = state.dashTimer > 0;
      var isRunning = isDashing || runToggle || keys.ShiftLeft || keys.ShiftRight || inputMag > 0.72;

      if (state.mode === 'walk' && !state.dialogueFocus) {
        if (inputMag > 0.08) {
          var sC = Math.sin(state.camYaw), cC = Math.cos(state.camYaw);
          moveX = ix * cC + iz * sC;
          moveZ = -ix * sC + iz * cC;
          moveAmt = inputMag;
        } else if (state.walkTarget) {
          var dxW = state.walkTarget.x - state.x;
          var dzW = state.walkTarget.z - state.z;
          var distW = Math.hypot(dxW, dzW);
          if (distW > 0.52) {
            moveX = dxW / distW;
            moveZ = dzW / distW;
            moveAmt = distW > 2.2 ? 1.0 : 0.65;
            isRunning = distW > 2.4;
          } else {
            var arriveFn = state.walkTarget.onArrive;
            state.walkTarget = null;
            targetRing.visible = false;
            if (arriveFn) arriveFn();
          }
        } else if (isDashing) {
          moveX = Math.sin(state.yaw);
          moveZ = Math.cos(state.yaw);
          moveAmt = 1.0;
        }
      }

      var curGround = world.getGroundInfo(state.x, state.z);
      if (curGround.inCave > 0.45 && (state.unlockedTools.lantern || opts.isDemo) && state.activeTool === 'hand' && !state.carryingPlank) {
        setTool('lantern', false);
      }

      var maxSpd = isDashing ? 11.2 : (isRunning ? 6.9 : 4.3);
      if (curGround.waterDepth > 0.06 && !isDashing) maxSpd *= 0.80;
      if (state.carryingPlank) maxSpd *= 0.88;

      var targetSpd = moveAmt * maxSpd;
      state.speed += (targetSpd - state.speed) * Math.min(1, dt * 13);

      var yawDiff = 0;
      if (moveAmt > 0.05 && state.mode === 'walk') {
        var candX = state.x + moveX * state.speed * dt;
        var candZ = state.z + moveZ * state.speed * dt;
        var resolved = resolveCircleCollisions(candX, candZ);
        var nextGround = world.getGroundInfo(resolved.x, resolved.z);

        // Deep-Water Playful Guard (> 0.44m depth -> bounce back onto shallow sand / bridge!)
        if (nextGround.waterDepth > 0.44) {
          state.walkTarget = null;
          targetRing.visible = false;
          if (state.deepBounceCooldown <= 0) {
            state.deepBounceCooldown = 1.4;
            state.vy = 3.8;
            state.grounded = false;
            spawnWaterRipple(resolved.x, resolved.z, 1.6);
            if (pfx) pfx.spawn3D('splash', resolved.x, 0.03, resolved.z, 1.95, { startFrame: 5 });
            if (sfx && sfx.playSplash) sfx.playSplash();
            if (opts.onDeepWaterWarning) opts.onDeepWaterWarning(resolved.x, resolved.z);
          }
        } else if (nextGround.y - state.y > 1.35 && state.grounded) {
          state.walkTarget = null;
          targetRing.visible = false;
        } else {
          state.x = resolved.x;
          state.z = resolved.z;
          curGround = nextGround;
        }

        var wantYaw = Math.atan2(moveX, moveZ);
        yawDiff = wrapAngle(wantYaw - state.yaw);
        state.yaw += yawDiff * Math.min(1, dt * 12.5);

        // Gentle Unity Spring-Arm Auto-Align behind walking direction (unless user manually orbited recently)
        if (elapsed - state.lastManualOrbitAt > 2.8 && Math.abs(ix) > 0.25) {
          var desiredCamYaw = wrapAngle(state.yaw + Math.PI);
          state.camYaw += wrapAngle(desiredCamYaw - state.camYaw) * dt * 0.85;
        }
      }

      // Gravity & Ground Snapping
      if (state.mode === 'walk') {
        if (!state.grounded || state.y > curGround.y + 0.08) {
          state.vy -= 19.0 * dt;
          state.y += state.vy * dt;
          if (state.y <= curGround.y) {
            state.y = curGround.y;
            if (state.vy < -2.4) {
              if (curGround.waterDepth > 0.04) {
                spawnWaterRipple(state.x, state.z, 1.65);
                spawnDustPuff(state.x, 0.05, state.z, 0xb8f6ff, 4);
                if (pfx) pfx.spawn3D('splash', state.x, 0.03, state.z, 1.90, { startFrame: 5 });
                if (sfx && sfx.playSplash) sfx.playSplash();
              } else {
                spawnDustPuff(state.x, state.y, state.z, curGround.surface === 'sand' ? 0xf3cf8a : 0xfff5dc, 3);
                if (pfx) pfx.spawn3D('heavy-landing', state.x, state.y + 0.02, state.z, 1.95);
                if (sfx && sfx.playStep) sfx.playStep(curGround.surface);
              }
            }
            state.vy = 0;
            state.grounded = true;
          }
        } else {
          state.y = curGround.y;
          state.vy = 0;
          state.grounded = true;
        }
      }

      // Footsteps, Dash Dust & True Shallow-Water Wading Ripples/Droplets!
      if (state.grounded && state.speed > 0.55 && state.mode === 'walk') {
        state.stepDist += state.speed * dt;
        var stride = isDashing ? 0.95 : (isRunning ? 1.45 : 1.20);
        if (state.stepDist >= stride) {
          state.stepDist = 0;
          if (curGround.waterDepth > 0.03) {
            spawnWaterRipple(state.x, state.z, 1.15);
            spawnDustPuff(state.x, 0.04, state.z, 0xcffaff, 2);
            if (pfx) pfx.spawn3D('splash', state.x, 0.02, state.z, 1.05, { startFrame: 6 });
            if (sfx && sfx.playStep) sfx.playStep('water');
          } else {
            if (isRunning && (curGround.surface === 'sand' || curGround.surface === 'grass')) {
              spawnDustPuff(state.x, state.y, state.z, curGround.surface === 'sand' ? 0xf3cf8a : 0xeef7dc, isDashing ? 2 : 1);
            }
            if (sfx && sfx.playStep) sfx.playStep(curGround.surface);
          }
        }
      }

      playerGroup.position.set(state.x, state.y, state.z);
      var forwardLean = state.mode === 'walk' ? clamp(state.speed / 8.0, 0, 1) * 0.08 : 0;
      var bankRoll = state.mode === 'walk' ? clamp(-yawDiff * 0.22, -0.14, 0.14) : 0;
      playerGroup.rotation.set(forwardLean, state.yaw, bankRoll);

      shadowDisc.visible = curGround.waterDepth < 0.05;
      shadowDisc.position.y = Math.max(0.02, curGround.y - state.y + 0.025);

      if (carriedLabel.visible) {
        carriedLabel.pos.set(state.x, state.y + 2.1, state.z);
      }

      // Kid Rig Skeletal / Procedural Animation + Two-Handed Plank Carry Pose!
      if (state.kid && state.kid.update) {
        state.kid.speed = state.speed;
        if (state.carryingPlank) {
          // Use procedural walk/idle so we can pose both arms forward holding the wooden plank!
          if (state.kid.stopClip) state.kid.stopClip();
          state.kid.state = state.speed > 0.45 ? 'run' : 'idle';
          state.kid.update(dt);
          if (state.kid.rot && root.THREE) {
            var axL = new T3.Vector3(1, 0, 0);
            state.kid.rot('LeftArm', axL, 0.85);
            state.kid.rot('RightArm', axL, 0.85);
            state.kid.rot('LeftForeArm', axL, -0.65);
            state.kid.rot('RightForeArm', axL, -0.65);
          }
        } else {
          if (state.digAnimTimer > 0) {
            if (state.kid.stopClip) state.kid.stopClip();
            state.kid.setState('wave');
          } else if (!state.grounded) {
            state.kid.setState('hop');
          } else if (state.mode === 'rest') {
            if (state.kid.stopClip) state.kid.stopClip();
            state.kid.setState('sitWave');
          } else if (isDashing) {
            state.kid.setState('turbo');
          } else if (state.speed > 0.45) {
            state.kid.setState('run');
          } else {
            state.kid.setState('idle');
          }
          state.kid.update(dt);
        }

        var rHand = state.kid.bones && (state.kid.bones.RightHand || state.kid.bones.LeftHand);
        if (rHand) {
          var hp = new T3.Vector3();
          rHand.getWorldPosition(hp);
          playerGroup.worldToLocal(hp);
          handToolAnchor.position.copy(hp);
          handToolAnchor.rotation.set(state.digAnimTimer > 0 ? Math.sin(state.digAnimTimer * 18) * 1.05 : 0, 0, 0);
        } else {
          handToolAnchor.position.set(0.32, 0.88, 0.24);
        }
      }

      // ---------- 4. 3D Pet Companion ----------
      var sideX = state.x - Math.sin(state.yaw - 0.85) * 1.35;
      var sideZ = state.z - Math.cos(state.yaw - 0.85) * 1.35;
      var secretSpot = state.secretTargetFn ? state.secretTargetFn() : null;
      var nearSecret = false;
      if (secretSpot) {
        var ds = Math.hypot(state.x - secretSpot.x, state.z - secretSpot.z);
        if (ds < 7.5) {
          nearSecret = true;
          sideX = lerp(sideX, secretSpot.x, 0.32);
          sideZ = lerp(sideZ, secretSpot.z, 0.32);
        }
      }
      var pdx = sideX - petGroup.position.x;
      var pdz = sideZ - petGroup.position.z;
      var pDist = Math.hypot(pdx, pdz);
      if (pDist > 14.0) {
        petGroup.position.set(sideX, state.y, sideZ);
      } else if (pDist > 0.15) {
        var pSpd = clamp(pDist * 3.9, 1.5, 8.6);
        petVel.x = (pdx / pDist) * pSpd;
        petVel.z = (pdz / pDist) * pSpd;
        petGroup.position.x += petVel.x * dt;
        petGroup.position.z += petVel.z * dt;
        var pYaw = Math.atan2(petVel.x, petVel.z);
        petGroup.rotation.y += wrapAngle(pYaw - petGroup.rotation.y) * Math.min(1, dt * 10);
      }
      var petGround = world.getGroundInfo(petGroup.position.x, petGroup.position.z);
      var petHop = (!state.grounded ? Math.max(0, state.y - curGround.y) * 0.85 : 0)
        + (nearSecret ? Math.abs(Math.sin(elapsed * 8.5)) * 0.28 : (pDist > 0.4 ? Math.abs(Math.sin(elapsed * 10.0)) * 0.14 : Math.sin(elapsed * 3.0) * 0.03));
      petGroup.position.y = Math.max(-0.22, petGround.y) + petHop;
      petSecretLabel.visible = nearSecret;
      if (petExclaimCooldown > 0) petExclaimCooldown -= dt;
      if (nearSecret) {
        petSecretLabel.pos.set(petGroup.position.x, petGroup.position.y + 1.05, petGroup.position.z);
        if (pfx && petExclaimCooldown <= 0) {
          petExclaimCooldown = 4.2;
          pfx.spawn3D('exclamation', petGroup.position.x, petGroup.position.y + 1.48, petGroup.position.z, 1.10, { mode: 'center', riseSpeed: 0.14 });
        }
      }

      updateCamera(dt, elapsed);
      updateParticles(dt);
    }

    function updateCamera(dt, elapsed) {
      var baseFov = (K && K._baseFov) ? K._baseFov : 44;
      var targetFov = state.dashTimer > 0 ? baseFov + 5.0 : baseFov;
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 8);
      camera.updateProjectionMatrix();

      // Cinematic Harbour Fly-In Intro on fresh load!
      if (state.introFlyTimer > 0) {
        var u = 1.0 - (state.introFlyTimer / 3.0);
        var easeU = u * u * (3 - 2 * u);
        var startPos = new T3.Vector3(-44.0, 8.5, 55.0);
        var endPos = new T3.Vector3(
          state.x + Math.sin(state.camYaw) * Math.cos(state.camPitch) * state.camDist,
          state.y + 1.35 + Math.sin(state.camPitch) * state.camDist,
          state.z + Math.cos(state.camYaw) * Math.cos(state.camPitch) * state.camDist
        );
        camera.position.lerpVectors(startPos, endPos, easeU);
        camera.lookAt(state.x, state.y + 1.35, state.z);
        return;
      }

      // Smooth velocity look-ahead!
      var leadX = state.mode === 'walk' ? Math.sin(state.yaw) * clamp(state.speed * 0.14, 0, 0.9) : 0;
      var leadZ = state.mode === 'walk' ? Math.cos(state.yaw) * clamp(state.speed * 0.14, 0, 0.9) : 0;
      var focusX = state.x + leadX, focusY = state.y + 1.32, focusZ = state.z + leadZ;
      var distUse = state.camDist;
      var pitchUse = state.camPitch;

      if (state.mode === 'boat') {
        distUse = 11.8;
        pitchUse = 0.40;
        focusY = state.y + 1.05;
      } else if (state.dialogueFocus) {
        // RPG Over-the-Shoulder Framing: keep BOTH player & NPC cleanly visible above speech card!
        focusX = lerp(state.x, state.dialogueFocus.x, 0.55);
        focusZ = lerp(state.z, state.dialogueFocus.z, 0.55);
        focusY = Math.max(state.y, state.dialogueFocus.y || state.y) + 1.25;
        distUse = 6.8;
        pitchUse = 0.28;
      }

      var horiz = Math.cos(pitchUse) * distUse;
      var vert = Math.sin(pitchUse) * distUse;
      var wantCamX = focusX + Math.sin(state.camYaw) * horiz;
      var wantCamZ = focusZ + Math.cos(state.camYaw) * horiz;
      var wantCamY = focusY + vert;

      var playerGround = world.getGroundInfo(state.x, state.z);
      var camGround = world.getGroundInfo(wantCamX, wantCamZ);
      if (playerGround.inCave > 0.35 || camGround.inCave > 0.45) {
        distUse = Math.min(distUse, 4.3);
        wantCamX = focusX + Math.sin(state.camYaw) * Math.cos(0.26) * distUse;
        wantCamZ = focusZ + Math.cos(state.camYaw) * Math.cos(0.26) * distUse;
        wantCamY = Math.min(focusY + 1.55, 6.6);
      } else {
        wantCamY = Math.max(wantCamY, camGround.y + 1.35);
      }

      var cRate = 1 - Math.exp(-dt * 8.5);
      camera.position.x = lerp(camera.position.x, wantCamX, cRate);
      camera.position.y = lerp(camera.position.y, wantCamY, cRate);
      camera.position.z = lerp(camera.position.z, wantCamZ, cRate);

      if (state.shakeTimer > 0) {
        state.shakeTimer -= dt;
        var shk = state.shakeTimer * 0.35;
        camera.position.x += (Math.random() - 0.5) * shk;
        camera.position.y += (Math.random() - 0.5) * shk;
      }

      camera.lookAt(focusX, focusY - 0.12, focusZ);
    }

    function updateParticles(dt) {
      for (var i = 0; i < ripples.length; i++) {
        var rp = ripples[i];
        if (rp.age < rp.maxAge) {
          rp.age += dt;
          var u = rp.age / rp.maxAge;
          rp.mesh.scale.setScalar((0.42 + u * 2.2) * (rp.scaleMul || 1));
          rp.mesh.material.opacity = (1.0 - u) * 0.65;
          if (rp.age >= rp.maxAge) rp.mesh.visible = false;
        }
      }
      for (var j = 0; j < puffs.length; j++) {
        var pf = puffs[j];
        if (pf.age < pf.maxAge) {
          pf.age += dt;
          var pu = pf.age / pf.maxAge;
          pf.mesh.position.x += pf.vx * dt;
          pf.mesh.position.y += pf.vy * dt;
          pf.mesh.position.z += pf.vz * dt;
          pf.mesh.scale.setScalar((1.0 - pu * 0.55) * 0.85);
          pf.mesh.material.opacity = (1.0 - pu) * 0.65;
          if (pf.age >= pf.maxAge) pf.mesh.visible = false;
        }
      }
    }

    return {
      state: state,
      playerGroup: playerGroup,
      boatGroup: boatGroup,
      petGroup: petGroup,
      joyVec: joyVec,
      getSharedKidClips: getSharedKidClips,
      loadHeroAvatar: loadHeroAvatar,
      setTool: setTool,
      unlockTool: unlockTool,
      setCarryingPlank: setCarryingPlank,
      triggerJump: triggerJump,
      triggerDash: triggerDash,
      triggerCameraShake: triggerCameraShake,
      setRunToggle: function (on) { runToggle = !!on; },
      getRunToggle: function () { return runToggle; },
      enterBoat: enterBoat,
      exitBoat: exitBoat,
      enterSpyglassTower: enterSpyglassTower,
      exitSpyglassTower: exitSpyglassTower,
      enterRest: enterRest,
      exitRest: exitRest,
      playDigScoop: playDigScoop,
      setWalkTarget: setWalkTarget,
      spawnDustPuff: spawnDustPuff,
      spawnWaterRipple: spawnWaterRipple,
      update: update
    };
  }

  TI3D.createPlayerSystem = createPlayerSystem;
})(typeof window !== 'undefined' ? window : this);
