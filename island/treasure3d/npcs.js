/* island/treasure3d/npcs.js
 * Unity-Grade Living Cast, Cute Tropical Guide Parrot, Diverse Classmates & Island Wildlife:
 * - Harmonious Character Proportions (Benbow 1.68m, Cook 1.72m, Captain 1.80m, Flint 0.92m on Barrel, Parrot 0.56m!)
 * - Crisp Overhead CSS 2D Markers (NEVER covering NPC faces or clipping speech text!)
 * - 5 Distinct Classmate Avatars with varied hats, bags, wigs & real skeletal animations!
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function wrapAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function loadFreshGLB(loader, url) {
    return new Promise(function (resolve) {
      loader.load(url, function (gltf) { resolve(gltf); }, undefined, function () { resolve(null); });
    });
  }

  // Exact vertex-level bounding box (Three.js Box3.setFromObject on un-posed SkinnedMesh measures tiny bones instead of vertices!)
  function measureTrueMeshBox(rootObj) {
    rootObj.updateMatrixWorld(true);
    var fullBox = new T3.Box3();
    var hasMesh = false;
    rootObj.traverse(function (o) {
      if (o.isMesh && o.geometry) {
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        var gb = o.geometry.boundingBox.clone();
        gb.applyMatrix4(o.matrixWorld);
        fullBox.union(gb);
        hasMesh = true;
      }
    });
    if (!hasMesh) fullBox.setFromObject(rootObj);
    return fullBox;
  }

  function createNpcSystem(scene, loader, world, player, sfx, opts) {
    opts = opts || {};
    var K = root.K3;
    var npcGroup = new T3.Group();
    npcGroup.name = 'treasure3d-npcs';
    scene.add(npcGroup);

    var pirates = {};
    var guideParrot = null;
    var classmates = [];
    var crabs = [];
    var gulls = [];
    var fishes = [];
    var butterflies = [];
    var steamPuffs = [];

    var steamGeo = new T3.SphereGeometry(0.14, 8, 6);
    for (var si = 0; si < 8; si++) {
      var sm = new T3.Mesh(steamGeo, new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
      sm.visible = false;
      scene.add(sm);
      steamPuffs.push({ mesh: sm, age: si * 0.25, maxAge: 1.8 });
    }

    // ---------- 1. Rigged Pirate Character Builder (Harmonious Proportions + Clean Overhead Marker!) ----------
    function spawnRiggedPirate(id, url, x, z, targetSpanOrH, baseYaw, badgeTxt, badgeCol, perchYOffset) {
      return loadFreshGLB(loader, url).then(function (gltf) {
        if (!gltf || !gltf.scene) return null;
        var rootNode = new T3.Group();
        var gy = world.sampleTerrainHeight(x, z) + (perchYOffset || 0);
        rootNode.position.set(x, gy, z);
        rootNode.rotation.y = baseYaw || 0;

        var model = gltf.scene;
        var bones = {};
        var restQuats = {};
        model.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.frustumCulled = false;
          }
          if (o.isBone) {
            bones[o.name] = o;
            restQuats[o.name] = o.quaternion.clone();
          }
        });

        var box = measureTrueMeshBox(model);
        var maxDim = Math.max(box.max.y - box.min.y, (box.max.x - box.min.x) * 0.90, 0.01);
        var s = targetSpanOrH / maxDim;
        model.scale.setScalar(s);
        var box2 = measureTrueMeshBox(model);
        var actualH = box2.max.y - box2.min.y;
        model.position.set(-(box2.min.x + box2.max.x) * 0.5, -box2.min.y, -(box2.min.z + box2.max.z) * 0.5);
        rootNode.add(model);

        // Floating 3D Golden Quest Plumbob Diamond cleanly ABOVE head (never covering face!)
        var diamond = new T3.Mesh(
          new T3.OctahedronGeometry(0.15, 0),
          new T3.MeshStandardMaterial({ color: badgeCol, emissive: new T3.Color(badgeCol), emissiveIntensity: 0.45, roughness: 0.25 })
        );
        diamond.scale.set(0.85, 1.35, 0.85);
        diamond.position.set(0, actualH + 0.48, 0);
        rootNode.add(diamond);

        // Crisp CSS 2D Overhead Nameplate
        var label = world.registerLabel('npc-' + id, badgeTxt, badgeCol, x, gy + actualH + 0.85, z, 15.0);

        npcGroup.add(rootNode);
        world.state.colliders.push({ x: x, z: z, r: 0.68, tag: 'npc-' + id, gateId: 0 });

        var npcObj = {
          id: id,
          root: rootNode,
          model: model,
          bones: bones,
          rest: restQuats,
          diamond: diamond,
          label: label,
          height: actualH,
          x: x,
          y: gy,
          z: z,
          baseYaw: baseYaw || 0,
          talking: false,
          headYaw: 0
        };
        pirates[id] = npcObj;
        return npcObj;
      });
    }

    // ---------- 2. Cute Realistic 0.56m Flying Guide Parrot (Zero Face-Blocking Badge!) ----------
    function spawnGuideParrot() {
      return loadFreshGLB(loader, 'treasure3d/models/flint-rig.glb').then(function (gltf) {
        if (!gltf || !gltf.scene) return null;
        var pRoot = new T3.Group();
        var model = gltf.scene;
        var bones = {};
        var rest = {};
        model.traverse(function (o) {
          if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; }
          if (o.isBone) { bones[o.name] = o; rest[o.name] = o.quaternion.clone(); }
        });
        var bx = measureTrueMeshBox(model);
        var maxD = Math.max(bx.max.x - bx.min.x, bx.max.y - bx.min.y, 0.01);
        model.scale.setScalar(0.54 / maxD);
        var bx2 = measureTrueMeshBox(model);
        model.position.set(-(bx2.min.x + bx2.max.x) * 0.5, -bx2.min.y, -(bx2.min.z + bx2.max.z) * 0.5);
        pRoot.add(model);

        pRoot.position.set(world.SPOTS.benbowNpc.x + 2.2, 2.3, world.SPOTS.benbowNpc.z - 0.6);
        npcGroup.add(pRoot);

        guideParrot = {
          root: pRoot,
          bones: bones,
          rest: rest,
          target: new T3.Vector3(world.SPOTS.benbowNpc.x + 2.2, 2.3, world.SPOTS.benbowNpc.z - 0.6),
          flying: false
        };
        return guideParrot;
      });
    }

    // ---------- 3. 5 Distinct Classmate Avatars (Varied Cosmetics + Real Skeletal Clips + Unclipped Speech Pills!) ----------
    function spawnClassmates() {
      if (!K || typeof K.makeCharacter !== 'function') return Promise.resolve();
      var specs = [
        { teamIdx: 0, girl: true,  items: ['av-wig-pink-bob', 'cs-fairy-wings'], x: -31.4, z: 36.8, yaw: 1.1,  patrolR: 0.0, line: '🔥 Cozy campfire!' },
        { teamIdx: 2, girl: false, items: ['cap', 'backpack'],                   x: -28.4, z: 36.4, yaw: -1.1, patrolR: 0.0, line: '🍾 Check the shallow bay!' },
        { teamIdx: 3, girl: true,  items: ['crown', 'bp-mini-wings'],            x: -39.8, z: 41.2, yaw: 0.4,  patrolR: 2.8, line: '✋ High-five, explorer!' },
        { teamIdx: 1, girl: false, items: ['cs-detective-cap', 'bp-explorer'],   x: -10.2, z: 15.2, yaw: 0.8,  patrolR: 2.4, line: '🐚 Tap the musical shells!' },
        { teamIdx: 2, girl: true,  items: ['hat-explorer', 'bp-adv-bag'],        x: 26.8,  z: 16.8, yaw: 1.5,  patrolR: 1.6, line: '🚣 Row across the lagoon!' }
      ];
      return player.getSharedKidClips().then(function (clips) {
        return Promise.all(specs.map(function (sp, idx) {
          var team = K.TEAMS[sp.teamIdx % K.TEAMS.length];
          return K.makeCharacter(team, {
            kidsOnly: true,
            kid: sp.girl ? 'girl' : 'boy',
            kidHeight: 1.64,
            items: sp.items
          }).then(function (kid) {
            if (!kid) return;
            if (clips && clips.length && kid.attachClips) kid.attachClips(clips);
            var gy = world.getGroundInfo(sp.x, sp.z).y;
            kid.root.position.set(sp.x, gy, sp.z);
            kid.root.rotation.y = sp.yaw;
            npcGroup.add(kid.root);

            var lbl = world.registerLabel('cm-' + idx, sp.line, team.c, sp.x, gy + 2.05, sp.z, 8.5);
            lbl.visible = false;

            classmates.push({
              kid: kid,
              homeX: sp.x,
              homeZ: sp.z,
              x: sp.x,
              z: sp.z,
              yaw: sp.yaw,
              patrolR: sp.patrolR,
              phase: idx * 1.7,
              cheerTimer: 0,
              label: lbl,
              line: sp.line
            });
          });
        }));
      });
    }

    // ---------- 4. Reactive Wildlife: Scuttling Crabs, Seagulls, Lagoon Fish & Butterflies ----------
    function spawnWildlife() {
      var jobs = [];
      var crabSpots = [
        [-38.5, 43.2], [-29.5, 42.5], [-43.0, 41.8],
        [27.2,  18.2], [62.5,  14.8], [69.5,  15.8],
        [-36.5,-12.5], [-42.5,-13.2]
      ];
      jobs.push(world.loadCachedGLB('treasure3d/models/critter-crab.glb').then(function (g) {
        if (!g || !g.scene) return;
        crabSpots.forEach(function (cs, idx) {
          var cg = g.scene.clone(true);
          cg.scale.setScalar(1.25);
          var gy = world.getGroundInfo(cs[0], cs[1]).y;
          cg.position.set(cs[0], Math.max(0.02, gy), cs[1]);
          npcGroup.add(cg);
          crabs.push({ mesh: cg, homeX: cs[0], homeZ: cs[1], x: cs[0], z: cs[1], vx: 0, vz: 0, phase: idx * 1.3 });
        });
      }));

      // Perch Barrel under Pirate Parrot Flint at Zone 4!
      jobs.push(world.loadCachedGLB('../assets/3d/world/pirate/Prop_Barrel.glb').then(function (g) {
        if (!g || !g.scene) return;
        var br = g.scene.clone(true);
        var bx = new T3.Box3().setFromObject(br);
        br.scale.setScalar(0.95 / Math.max(0.01, bx.max.y - bx.min.y));
        var gy = world.sampleTerrainHeight(world.SPOTS.flintNpc.x, world.SPOTS.flintNpc.z);
        br.position.set(world.SPOTS.flintNpc.x, gy - 0.04, world.SPOTS.flintNpc.z);
        npcGroup.add(br);
      }));

      var wingMat = new T3.MeshLambertMaterial({ color: 0xffffff, side: T3.DoubleSide });
      var beakMat = new T3.MeshLambertMaterial({ color: 0xffb320 });
      var gullCenters = [
        [-35, 47, 13, 12.5], [46, 13, 15, 14.0], [68, 12, 11, 13.5],
        [6, -18, 14, 16.5], [-38, -15, 12, 13.5], [-6, 15, 16, 15.0]
      ];
      gullCenters.forEach(function (gc, idx) {
        var gg = new T3.Group();
        var body = new T3.Mesh(new T3.ConeGeometry(0.13, 0.50, 6), wingMat);
        body.rotation.x = Math.PI * 0.5;
        gg.add(body);
        var beak = new T3.Mesh(new T3.ConeGeometry(0.05, 0.16, 5), beakMat);
        beak.rotation.x = Math.PI * 0.5;
        beak.position.z = 0.30;
        gg.add(beak);
        var wL = new T3.Mesh(new T3.BoxGeometry(0.62, 0.03, 0.20), wingMat);
        wL.position.x = 0.31;
        var wR = new T3.Mesh(new T3.BoxGeometry(0.62, 0.03, 0.20), wingMat);
        wR.position.x = -0.31;
        gg.add(wL); gg.add(wR);
        npcGroup.add(gg);
        gulls.push({ group: gg, wL: wL, wR: wR, cx: gc[0], cz: gc[1], r: gc[2], y: gc[3], phase: idx * 1.1 });
      });

      var fishMat = new T3.MeshStandardMaterial({ color: 0x4fd2ff, roughness: 0.25, metalness: 0.3 });
      var fishSpots = [[-32, 53], [44, 10], [50, 17], [43, 19], [-42, 52]];
      fishSpots.forEach(function (fs, idx) {
        var fm = new T3.Mesh(new T3.ConeGeometry(0.13, 0.48, 8), fishMat);
        fm.visible = false;
        npcGroup.add(fm);
        fishes.push({ mesh: fm, cx: fs[0], cz: fs[1], timer: idx * 1.4, activeT: -1 });
      });

      var bfColors = [0xff5fa2, 0xffb320, 0x4f9dff, 0x2fc58a];
      var bfSpots = [
        [-33, 31], [-26, 29], [-12, 14], [-4, 17], [3, 12],
        [24, 15], [3, -24], [-34, -14], [-40, -18], [-15, 20]
      ];
      bfSpots.forEach(function (bs, idx) {
        var bMat = new T3.MeshBasicMaterial({ color: bfColors[idx % bfColors.length], side: T3.DoubleSide });
        var bg = new T3.Group();
        var bwL = new T3.Mesh(new T3.PlaneGeometry(0.16, 0.14), bMat);
        bwL.position.x = 0.08;
        var bwR = new T3.Mesh(new T3.PlaneGeometry(0.16, 0.14), bMat);
        bwR.position.x = -0.08;
        bg.add(bwL); bg.add(bwR);
        npcGroup.add(bg);
        butterflies.push({ group: bg, wL: bwL, wR: bwR, cx: bs[0], cz: bs[1], phase: idx * 0.9 });
      });

      return Promise.all(jobs);
    }

    function initAll() {
      return Promise.all([
        spawnRiggedPirate('benbow',  'treasure3d/models/benbow-rig.glb',  world.SPOTS.benbowNpc.x,  world.SPOTS.benbowNpc.z,  1.68, 0.45,  '🐆 Benbow',  '#ff5fa2', 0),
        spawnRiggedPirate('cook',    'treasure3d/models/cook-rig.glb',    world.SPOTS.cookNpc.x,    world.SPOTS.cookNpc.z,    1.72, 0.52,  '🍲 Chef Cook','#2fc58a', 0),
        spawnRiggedPirate('captain', 'treasure3d/models/captain-rig.glb', world.SPOTS.captainNpc.x, world.SPOTS.captainNpc.z, 1.80, 1.45,  '⚓ Captain',  '#4f9dff', 0),
        spawnRiggedPirate('flint',   'treasure3d/models/flint-rig.glb',   world.SPOTS.flintNpc.x,   world.SPOTS.flintNpc.z,   0.92, 0.35,  '🦜 Flint',    '#ffb320', 0.90),
        spawnGuideParrot(),
        spawnClassmates(),
        spawnWildlife()
      ]);
    }

    function moveCaptainToLagoonDock() {
      var cap = pirates.captain;
      if (!cap) return;
      var cx = world.SPOTS.captainNpc.x, cz = world.SPOTS.captainNpc.z;
      var cy = world.sampleTerrainHeight(cx, cz);
      cap.x = cx; cap.z = cz; cap.y = cy;
      cap.baseYaw = 1.45;
      cap.root.position.set(cx, cy, cz);
      cap.root.rotation.y = cap.baseYaw;
      if (cap.label) cap.label.pos.set(cx, cy + cap.height + 0.85, cz);
    }

    function moveCaptainToSunsetCove() {
      var cap = pirates.captain;
      if (!cap) return;
      var cx = world.SPOTS.coveCaptNpc.x, cz = world.SPOTS.coveCaptNpc.z;
      var cy = world.sampleTerrainHeight(cx, cz);
      cap.x = cx; cap.z = cz; cap.y = cy;
      cap.baseYaw = -1.25;
      cap.root.position.set(cx, cy, cz);
      cap.root.rotation.y = cap.baseYaw;
      if (cap.label) cap.label.pos.set(cx, cy + cap.height + 0.82, cz);
    }

    function setGuideTarget(x, y, z) {
      if (guideParrot) guideParrot.target.set(x, y, z);
    }

    function highFiveClassmate(cm) {
      if (!cm) return;
      cm.cheerTimer = 2.6;
      cm.label.visible = true;
      if (cm.kid && cm.kid.setState) cm.kid.setState('cheer');
      if (sfx && sfx.playCoin) sfx.playCoin();
    }

    var _euler = new T3.Euler();
    var _quat = new T3.Quaternion();

    function applyBoneOffset(npc, boneName, rx, ry, rz) {
      var b = npc.bones[boneName];
      var r = npc.rest[boneName];
      if (!b || !r) return;
      _euler.set(rx || 0, ry || 0, rz || 0);
      _quat.setFromEuler(_euler);
      b.quaternion.copy(r).multiply(_quat);
    }

    function update(dt, elapsed) {
      var px = player.state.x, pz = player.state.z;

      Object.keys(pirates).forEach(function (id) {
        var npc = pirates[id];
        if (!npc) return;

        npc.diamond.rotation.y += dt * 2.2;
        npc.diamond.position.y = npc.height + 0.52 + Math.sin(elapsed * 3.2 + npc.x) * 0.08;

        var dx = px - npc.x, dz = pz - npc.z;
        var dPlayer = Math.hypot(dx, dz);
        var wantHeadYaw = 0;
        if (dPlayer < 9.5) {
          var worldAng = Math.atan2(dx, dz);
          var relAng = wrapAngle(worldAng - npc.root.rotation.y);
          if (Math.abs(relAng) < 1.35) wantHeadYaw = clamp(relAng * 0.68, -0.72, 0.72);
        }
        npc.headYaw += (wantHeadYaw - npc.headYaw) * Math.min(1, dt * 6.5);

        var breath = Math.sin(elapsed * 2.4 + npc.x) * 0.03;
        var talkNod = npc.talking ? Math.sin(elapsed * 11.0) * 0.10 : 0;
        var talkArm = npc.talking ? Math.sin(elapsed * 8.5) * 0.32 : 0;

        applyBoneOffset(npc, 'Spine', breath, 0, Math.cos(elapsed * 1.6) * 0.02);
        applyBoneOffset(npc, 'Head', talkNod, npc.headYaw, 0);

        if (id === 'benbow') {
          var waveAmt = (dPlayer < 7.5 || npc.talking) ? (0.45 + Math.sin(elapsed * 7.5) * 0.35) : Math.sin(elapsed * 1.8) * 0.08;
          applyBoneOffset(npc, 'ArmR', -waveAmt * 0.5, 0, waveAmt);
          applyBoneOffset(npc, 'ArmL', talkArm * 0.4, 0, -0.08);
        } else if (id === 'cook') {
          if (!npc.talking) {
            applyBoneOffset(npc, 'ArmL', 0.22 + Math.sin(elapsed * 4.2) * 0.28, Math.cos(elapsed * 4.2) * 0.26, -0.15);
            applyBoneOffset(npc, 'ArmR', 0, 0, 0.08);
          } else {
            applyBoneOffset(npc, 'ArmL', talkArm * 0.5, 0, -0.22);
            applyBoneOffset(npc, 'ArmR', -talkArm * 0.5, 0, 0.28);
          }
        } else if (id === 'captain') {
          applyBoneOffset(npc, 'ArmL', -0.45 - talkArm * 0.4, 0.18, 0.32 + Math.sin(elapsed * 2.2) * 0.12);
          applyBoneOffset(npc, 'ArmR', talkArm * 0.35, 0, -0.10);
        } else if (id === 'flint') {
          var flap = (npc.talking || dPlayer < 6.0) ? Math.sin(elapsed * 11.0) * 0.48 : Math.sin(elapsed * 2.8) * 0.14;
          applyBoneOffset(npc, 'WingL', 0, 0, flap);
          applyBoneOffset(npc, 'WingR', 0, 0, -flap);
          npc.model.position.y = Math.abs(Math.sin(elapsed * (npc.talking ? 7.0 : 2.4))) * (npc.talking ? 0.10 : 0.03);
        }
      });

      var potP = world.state.soupPotPos;
      for (var sti = 0; sti < steamPuffs.length; sti++) {
        var sp = steamPuffs[sti];
        sp.age += dt;
        if (sp.age >= sp.maxAge) {
          sp.age = 0;
          sp.mesh.position.set(potP.x + (Math.random() - 0.5) * 0.24, potP.y + 0.95, potP.z + (Math.random() - 0.5) * 0.24);
          sp.mesh.visible = true;
        }
        var su = sp.age / sp.maxAge;
        sp.mesh.position.y += dt * 0.62;
        sp.mesh.scale.setScalar(0.5 + su * 1.1);
        sp.mesh.material.opacity = Math.sin(su * Math.PI) * 0.38;
      }

      if (guideParrot) {
        var gp = guideParrot.root.position;
        var gx = guideParrot.target.x - gp.x;
        var gy = guideParrot.target.y - gp.y;
        var gz = guideParrot.target.z - gp.z;
        var gDist = Math.hypot(gx, gy, gz);
        guideParrot.flying = gDist > 0.65;
        if (gDist > 0.12) {
          var flySpd = clamp(gDist * 2.6, 2.2, 9.5);
          gp.x += (gx / gDist) * flySpd * dt;
          gp.y += (gy / gDist) * flySpd * dt + (guideParrot.flying ? Math.sin(elapsed * 8.0) * 0.02 : 0);
          gp.z += (gz / gDist) * flySpd * dt;
          var wantPYaw = Math.atan2(gx, gz);
          guideParrot.root.rotation.y += wrapAngle(wantPYaw - guideParrot.root.rotation.y) * Math.min(1, dt * 8);
        } else {
          var toPl = Math.atan2(px - gp.x, pz - gp.z);
          guideParrot.root.rotation.y += wrapAngle(toPl - guideParrot.root.rotation.y) * Math.min(1, dt * 5);
          gp.y = guideParrot.target.y + Math.sin(elapsed * 3.6) * 0.08;
        }
        var wingFlap = guideParrot.flying ? Math.sin(elapsed * 18.0) * 0.62 : Math.sin(elapsed * 4.5) * 0.16;
        if (guideParrot.bones.WingL && guideParrot.rest.WingL) {
          _euler.set(0, 0, wingFlap);
          guideParrot.bones.WingL.quaternion.copy(guideParrot.rest.WingL).multiply(_quat.setFromEuler(_euler));
        }
        if (guideParrot.bones.WingR && guideParrot.rest.WingR) {
          _euler.set(0, 0, -wingFlap);
          guideParrot.bones.WingR.quaternion.copy(guideParrot.rest.WingR).multiply(_quat.setFromEuler(_euler));
        }
      }

      for (var ci = 0; ci < classmates.length; ci++) {
        var cm = classmates[ci];
        if (!cm.kid) continue;
        if (cm.cheerTimer > 0) {
          cm.cheerTimer -= dt;
          if (cm.cheerTimer <= 0) cm.label.visible = false;
          cm.kid.setState('cheer');
        } else if (cm.patrolR > 0.2) {
          var tx = cm.homeX + Math.cos(elapsed * 0.55 + cm.phase) * cm.patrolR;
          var tz = cm.homeZ + Math.sin(elapsed * 0.55 + cm.phase) * cm.patrolR;
          var cdx = tx - cm.x, cdz = tz - cm.z;
          cm.x += cdx * dt * 1.4;
          cm.z += cdz * dt * 1.4;
          var cgy = world.getGroundInfo(cm.x, cm.z).y;
          cm.kid.root.position.set(cm.x, cgy, cm.z);
          cm.kid.root.rotation.y = Math.atan2(cdx, cdz);
          cm.label.pos.set(cm.x, cgy + 2.05, cm.z);
          cm.label.visible = Math.hypot(px - cm.x, pz - cm.z) < 5.5;
          cm.kid.speed = 2.6;
          cm.kid.setState('run');
        } else {
          var dP = Math.hypot(px - cm.x, pz - cm.z);
          if (dP < 5.2) {
            cm.kid.root.rotation.y = Math.atan2(px - cm.x, pz - cm.z);
            if (cm.kid.stopClip) cm.kid.stopClip();
            cm.kid.setState('wave');
            cm.label.visible = true;
          } else {
            cm.kid.setState('idle');
            cm.label.visible = false;
          }
        }
        cm.kid.update(dt);
      }

      for (var cri = 0; cri < crabs.length; cri++) {
        var cr = crabs[cri];
        var dxC = cr.x - px, dzC = cr.z - pz;
        var dC = Math.hypot(dxC, dzC);
        if (dC < 3.8 && dC > 0.01) {
          cr.vx = (dxC / dC) * 4.4;
          cr.vz = (dzC / dC) * 4.4;
        } else {
          var hx = cr.homeX + Math.sin(elapsed * 1.1 + cr.phase) * 1.2 - cr.x;
          var hz = cr.homeZ + Math.cos(elapsed * 0.9 + cr.phase) * 1.2 - cr.z;
          cr.vx += (hx * 0.8 - cr.vx) * dt * 3;
          cr.vz += (hz * 0.8 - cr.vz) * dt * 3;
        }
        cr.x += cr.vx * dt;
        cr.z += cr.vz * dt;
        var cGi = world.getGroundInfo(cr.x, cr.z);
        if (cGi.waterDepth < 0.35) {
          cr.mesh.position.set(cr.x, Math.max(0.02, cGi.y) + Math.abs(Math.sin(elapsed * 14 + cri)) * 0.03, cr.z);
        }
        if (Math.hypot(cr.vx, cr.vz) > 0.25) {
          cr.mesh.rotation.y = Math.atan2(cr.vx, cr.vz) + Math.PI * 0.5;
        }
      }

      for (var gi = 0; gi < gulls.length; gi++) {
        var gl = gulls[gi];
        var ga = elapsed * 0.42 + gl.phase;
        gl.group.position.set(gl.cx + Math.cos(ga) * gl.r, gl.y + Math.sin(elapsed * 1.5 + gi) * 0.6, gl.cz + Math.sin(ga) * gl.r);
        gl.group.rotation.y = -ga;
        var gFlap = Math.sin(elapsed * 7.2 + gi) * 0.38;
        gl.wL.rotation.z = gFlap;
        gl.wR.rotation.z = -gFlap;
      }

      for (var fi = 0; fi < fishes.length; fi++) {
        var fs = fishes[fi];
        if (fs.activeT < 0) {
          fs.timer -= dt;
          if (fs.timer <= 0) {
            fs.activeT = 0;
            fs.timer = 4.5 + Math.random() * 4.5;
            fs.mesh.visible = true;
            player.spawnWaterRipple(fs.cx, fs.cz, 0.9);
          }
        } else {
          fs.activeT += dt * 1.45;
          if (fs.activeT >= 1.0) {
            fs.activeT = -1;
            fs.mesh.visible = false;
            player.spawnWaterRipple(fs.cx + 1.2, fs.cz, 0.9);
          } else {
            var u = fs.activeT;
            fs.mesh.position.set(fs.cx + u * 1.2, Math.sin(u * Math.PI) * 1.15 - 0.1, fs.cz);
            fs.mesh.rotation.z = -Math.PI * 0.5 + (u - 0.5) * 1.6;
          }
        }
      }

      for (var bi = 0; bi < butterflies.length; bi++) {
        var bf = butterflies[bi];
        var ba = elapsed * 1.8 + bf.phase;
        var bx = bf.cx + Math.cos(ba) * 1.35;
        var bz = bf.cz + Math.sin(ba * 1.3) * 1.35;
        var by = world.getGroundInfo(bx, bz).y + 0.85 + Math.sin(elapsed * 4.5 + bi) * 0.22;
        bf.group.position.set(bx, by, bz);
        bf.group.rotation.y = -ba;
        var bFlap = Math.sin(elapsed * 22.0 + bi) * 0.65;
        bf.wL.rotation.y = bFlap;
        bf.wR.rotation.y = -bFlap;
      }
    }

    return {
      pirates: pirates,
      classmates: classmates,
      initAll: initAll,
      moveCaptainToLagoonDock: moveCaptainToLagoonDock,
      moveCaptainToSunsetCove: moveCaptainToSunsetCove,
      setGuideTarget: setGuideTarget,
      highFiveClassmate: highFiveClassmate,
      getGuideParrot: function () { return guideParrot; },
      update: update
    };
  }

  TI3D.createNpcSystem = createNpcSystem;
})(typeof window !== 'undefined' ? window : this);
