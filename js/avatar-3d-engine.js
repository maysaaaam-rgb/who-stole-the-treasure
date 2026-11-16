/**
 * ENGLISH ADVENTURE ACADEMY — 3D .GLB AVATAR, AUTO-RIGGER & BONE-SOCKET ENGINE (v2)
 * Works offline with Three.js r160 + local THREE.GLTFLoader + THREE.OrbitControls
 * Capabilities:
 *   1. Real .glb character & wearable loading with shared memory cache
 *   2. Automatic 13-bone Mixamo-compatible Biped Auto-Rigger (THREE.SkinnedMesh)
 *      for static A-pose .glb models (zero external Pro paywall or cloud needed!)
 *   3. 5 Built-in Skeletal AnimationClips: Idle, Wave, Cheer, Run, Kick
 *   4. Dynamic Pixar outfit/skin/team-kit vertex color shader for untextured meshes
 *      (leaves textured PBR .glb files 100% untouched)
 *   5. Bone-socketed 3D wearable attachment (Crown on Head, Wings on Chest, etc.)
 *   6. 1-click crisp 2D PNG card baking + .OBJ exporter (Mixamo-ready)
 */
(function (root) {
  'use strict';

  function getTHREE() {
    return root.THREE;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / Math.max(edge1 - edge0, 0.00001), 0, 1);
    return t * t * (3 - 2 * t);
  }

  var ITEM_FALLBACK_STYLES = {
    crown: { color: 0xfbbf24, metalness: 0.76, roughness: 0.22, emissive: 0x451a03, emissiveIntensity: 0.24 },
    cap: { color: 0x0ea5e9, metalness: 0.12, roughness: 0.55 },
    shades: { color: 0x38bdf8, metalness: 0.82, roughness: 0.16 },
    wings: { color: 0xf8fafc, metalness: 0.15, roughness: 0.38, emissive: 0x38bdf8, emissiveIntensity: 0.12 },
    cape: { color: 0x7c3aed, metalness: 0.18, roughness: 0.52 },
    wand: { color: 0xf59e0b, metalness: 0.65, roughness: 0.25, emissive: 0x78350f, emissiveIntensity: 0.2 },
    'soccer-ball': { color: 0xf8fafc, metalness: 0.15, roughness: 0.35 },
    backpack: { color: 0x10b981, metalness: 0.15, roughness: 0.55 }
  };

  /* Shared ArrayBuffer cache so switching pupils or spawning Striker + Keeper parses only once */
  var _glbBufferCache = new Map();

  function fetchGlbBuffer(url) {
    if (_glbBufferCache.has(url)) return _glbBufferCache.get(url);
    var p = fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
      return r.arrayBuffer();
    });
    _glbBufferCache.set(url, p);
    p.catch(function () { _glbBufferCache.delete(url); });
    return p;
  }

  function parseGlbBuffer(buf) {
    var THREE = getTHREE();
    if (!THREE || !THREE.GLTFLoader) return Promise.reject(new Error('THREE.GLTFLoader not loaded'));
    var loader = new THREE.GLTFLoader();
    return new Promise(function (resolve, reject) {
      loader.parse(buf.slice(0), '', resolve, reject);
    });
  }

  function loadCachedGlb(url) {
    return fetchGlbBuffer(url).then(parseGlbBuffer);
  }

  function normalizeModelToHeight(obj, targetHeight) {
    var THREE = getTHREE();
    obj.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(obj);
    var size = new THREE.Vector3();
    box.getSize(size);

    var maxDim = Math.max(size.y, 0.001);
    var scale = targetHeight / maxDim;
    obj.scale.multiplyScalar(scale);
    obj.updateMatrixWorld(true);

    var box2 = new THREE.Box3().setFromObject(obj);
    var c2 = new THREE.Vector3();
    box2.getCenter(c2);
    obj.position.x -= c2.x;
    obj.position.z -= c2.z;
    obj.position.y -= box2.min.y;
    obj.updateMatrixWorld(true);
    return obj;
  }

  function normalizeItemToSize(obj, targetSize) {
    var THREE = getTHREE();
    obj.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(obj);
    var size = new THREE.Vector3();
    box.getSize(size);
    var maxDim = Math.max(size.x, size.y, size.z, 0.001);
    var scale = targetSize / maxDim;
    obj.scale.multiplyScalar(scale);
    obj.updateMatrixWorld(true);

    var box2 = new THREE.Box3().setFromObject(obj);
    var c2 = new THREE.Vector3();
    box2.getCenter(c2);
    obj.position.sub(c2);
    obj.updateMatrixWorld(true);
    return obj;
  }

  function paintKidGeometryColors(geom, bounds, palette) {
    var THREE = getTHREE();
    var pos = geom.attributes.position;
    if (!pos) return;
    var pal = Object.assign({
      teeHex: 0xf8fafc,
      shortsHex: 0x2563eb,
      skinHex: 0xf4c29f,
      hairHex: 0x5b341b,
      shoeHex: 0xf8fafc,
      soleHex: 0x38bdf8
    }, palette || {});

    var cShoe = new THREE.Color(pal.shoeHex);
    var cSole = new THREE.Color(pal.soleHex);
    var cSkin = new THREE.Color(pal.skinHex);
    var cShort = new THREE.Color(pal.shortsHex);
    var cShirt = new THREE.Color(pal.teeHex);
    var cHair = new THREE.Color(pal.hairHex);
    var cSclera = new THREE.Color(0xffffff);
    var cIris = new THREE.Color(0x4b2613);
    var cPupil = new THREE.Color(0x0f172a);
    var cSmile = new THREE.Color(0xb4534a);
    var cCheek = cSkin.clone().lerp(new THREE.Color(0xf472b6), 0.16);

    var minY = bounds.min.y;
    var spanY = Math.max(bounds.max.y - minY, 0.001);
    var centerX = (bounds.min.x + bounds.max.x) * 0.5;
    var halfW = Math.max((bounds.max.x - bounds.min.x) * 0.5, 0.001);
    var minZ = bounds.min.z;
    var spanZ = Math.max(bounds.max.z - minZ, 0.001);

    var colors = geom.attributes.color ? geom.attributes.color.array : new Float32Array(pos.count * 3);
    for (var i = 0; i < pos.count; i++) {
      var vx = pos.getX(i);
      var vy = pos.getY(i);
      var vz = pos.getZ(i);
      var ny = (vy - minY) / spanY;
      var sx = (vx - centerX) / halfW;
      var nx = Math.abs(sx);
      var nz = (vz - minZ) / spanZ;
      var col = cShirt;

      if (ny < 0.038) {
        col = cSole;
      } else if (ny < 0.115) {
        col = cShoe;
      } else if (ny < 0.258) {
        col = cSkin;
      } else if (ny < 0.440) {
        /* Shorts inside torso column (nx <= 0.38); lowered A-pose hands (nx > 0.44) are skin */
        col = nx > 0.40 ? cSkin : cShort;
      } else if (ny < 0.712) {
        /* Crew-neck t-shirt wrapping full chest, shoulders & angled short sleeves */
        var collarCut = (ny >= 0.688 && nx < 0.19);
        var inTorso = nx <= 0.365;
        var inSleeve = nx <= 0.545 && (ny + (nx - 0.365) * 0.42) >= 0.555;
        col = (!collarCut && (inTorso || inSleeve)) ? cShirt : cSkin;
      } else if (ny < 0.752) {
        /* Neck & lower chin */
        col = cSkin;
      } else if (ny < 0.862 && nz > 0.68) {
        /* Sculpted Pixar Face: skin + expressive eyes, brows, rosy cheeks & warm smile */
        col = cSkin;
        if (nz > 0.75) {
          /* Left & Right Eye Sockets centered at |sx| = 0.114, ny = 0.820 */
          var ex = (nx - 0.114) / 0.043;
          var ey = (ny - 0.820) / 0.0175;
          var eDist2 = ex * ex + ey * ey;
          if (eDist2 <= 1.0) {
            /* Upper lash line vs white sclera vs iris vs pupil + catchlight spark */
            var ix = (nx - 0.111) / 0.026;
            var iy = (ny - 0.819) / 0.0135;
            var iDist2 = ix * ix + iy * iy;
            var gx = (sx - (sx >= 0 ? 0.103 : -0.119)) / 0.0075;
            var gy = (ny - 0.824) / 0.0048;
            if (ey > 0.72) {
              col = cPupil;
            } else if (gx * gx + gy * gy <= 1.0) {
              col = cSclera;
            } else if (iDist2 <= 0.32) {
              col = cPupil;
            } else if (iDist2 <= 1.0) {
              col = cIris;
            } else {
              col = cSclera;
            }
          } else {
            /* Arched eyebrows */
            var browY = 0.845 - Math.pow((nx - 0.112) / 0.055, 2) * 0.004;
            if (nx >= 0.068 && nx <= 0.165 && Math.abs(ny - browY) <= 0.0038) {
              col = cHair;
            } else {
              /* Warm curved Pixar smile */
              var smileY = 0.764 + sx * sx * 0.42;
              if (nx <= 0.062 && Math.abs(ny - smileY) <= 0.0036 && nz > 0.84) {
                col = cSmile;
              } else {
                /* Soft rosy cheeks */
                var cx = (nx - 0.168) / 0.042;
                var cy = (ny - 0.792) / 0.014;
                if (cx * cx + cy * cy <= 1.0) col = cCheek;
              }
            }
          }
        }
      } else {
        col = cHair;
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    if (!geom.attributes.color) {
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    } else {
      geom.attributes.color.needsUpdate = true;
    }
  }

  function applyItemFallbackMaterial(obj, presetId) {
    var THREE = getTHREE();
    obj.traverse(function (child) {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.geometry && (!child.geometry.attributes || !child.geometry.attributes.normal)) {
        child.geometry.computeVertexNormals();
      }
      var mat = Array.isArray(child.material) ? child.material[0] : child.material;
      if (mat && mat.map) {
        mat.needsUpdate = true;
        return;
      }
      if (child.geometry && child.geometry.attributes && child.geometry.attributes.color) return;
      var st = ITEM_FALLBACK_STYLES[presetId] || { color: 0x38bdf8, metalness: 0.35, roughness: 0.35 };
      child.material = new THREE.MeshStandardMaterial(st);
    });
  }

  /**
   * Automatic 13-Bone Mixamo-Compatible Biped Auto-Rigger for Static A-Pose .GLB Meshes.
   * Bakes normalized height [0..H] into geometry so 1.0 unit === 1.0 meter on every bone!
   */
  function autoRigHumanoidScene(gltfScene, targetHeight, palette) {
    var THREE = getTHREE();
    var H = targetHeight || 1.65;

    var existingBones = [];
    gltfScene.traverse(function (n) { if (n.isBone) existingBones.push(n); });
    if (existingBones.length > 0) {
      normalizeModelToHeight(gltfScene, H);
      gltfScene.traverse(function (c) {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.geometry && !c.geometry.attributes.normal) c.geometry.computeVertexNormals();
        }
      });
      var bMap = {};
      existingBones.forEach(function (b) { bMap[b.name] = b; });
      return {
        root: gltfScene,
        bones: existingBones,
        boneMap: bMap,
        isAutoRigged: false,
        recolor: function () {}
      };
    }

    normalizeModelToHeight(gltfScene, H);
    gltfScene.updateMatrixWorld(true);

    /* Collect all meshes and bake their normalized world matrices into clean 1:1 geometries */
    var sourceMeshes = [];
    gltfScene.traverse(function (c) {
      if (c.isMesh && c.geometry) sourceMeshes.push(c);
    });

    /* Build 13-bone Mixamo hierarchy in meter space [0 .. H] */
    var bHips      = new THREE.Bone(); bHips.name = 'mixamorigHips';
    var bSpine     = new THREE.Bone(); bSpine.name = 'mixamorigSpine';
    var bSpine2    = new THREE.Bone(); bSpine2.name = 'mixamorigSpine2';
    var bNeck      = new THREE.Bone(); bNeck.name = 'mixamorigNeck';
    var bHead      = new THREE.Bone(); bHead.name = 'mixamorigHead';
    var bLeftArm   = new THREE.Bone(); bLeftArm.name = 'mixamorigLeftArm';
    var bLeftHand  = new THREE.Bone(); bLeftHand.name = 'mixamorigLeftHand';
    var bRightArm  = new THREE.Bone(); bRightArm.name = 'mixamorigRightArm';
    var bRightHand = new THREE.Bone(); bRightHand.name = 'mixamorigRightHand';
    var bLeftUpLeg = new THREE.Bone(); bLeftUpLeg.name = 'mixamorigLeftUpLeg';
    var bLeftLeg   = new THREE.Bone(); bLeftLeg.name = 'mixamorigLeftLeg';
    var bRightUpLeg= new THREE.Bone(); bRightUpLeg.name = 'mixamorigRightUpLeg';
    var bRightLeg  = new THREE.Bone(); bRightLeg.name = 'mixamorigRightLeg';

    bHips.position.set(0, 0.42 * H, 0);
    bSpine.position.set(0, 0.10 * H, 0);
    bSpine2.position.set(0, 0.11 * H, 0);
    bNeck.position.set(0, 0.06 * H, 0);
    bHead.position.set(0, 0.05 * H, 0);

    bLeftArm.position.set(-0.088 * H, 0.025 * H, 0);
    bLeftHand.position.set(-0.11 * H, -0.13 * H, 0);

    bRightArm.position.set(0.088 * H, 0.025 * H, 0);
    bRightHand.position.set(0.11 * H, -0.13 * H, 0);

    bLeftUpLeg.position.set(-0.052 * H, -0.02 * H, 0);
    bLeftLeg.position.set(0, -0.20 * H, 0);

    bRightUpLeg.position.set(0.052 * H, -0.02 * H, 0);
    bRightLeg.position.set(0, -0.20 * H, 0);

    bHips.add(bSpine);
    bSpine.add(bSpine2);
    bSpine2.add(bNeck);
    bNeck.add(bHead);
    bSpine2.add(bLeftArm);
    bLeftArm.add(bLeftHand);
    bSpine2.add(bRightArm);
    bRightArm.add(bRightHand);
    bHips.add(bLeftUpLeg);
    bLeftUpLeg.add(bLeftLeg);
    bHips.add(bRightUpLeg);
    bRightUpLeg.add(bRightLeg);

    var bones = [
      bHips, bSpine, bSpine2, bNeck, bHead,
      bLeftArm, bLeftHand, bRightArm, bRightHand,
      bLeftUpLeg, bLeftLeg, bRightUpLeg, bRightLeg
    ];
    bHips.updateMatrixWorld(true);

    var rigGroup = new THREE.Group();
    rigGroup.name = 'eaa-autorig-root';
    rigGroup.add(bHips);

    var paintTargets = [];

    sourceMeshes.forEach(function (srcMesh, idx) {
      var geom = srcMesh.geometry.clone();
      geom.applyMatrix4(srcMesh.matrixWorld);
      if (!geom.attributes.normal) {
        geom.computeVertexNormals();
      } else {
        geom.computeVertexNormals();
      }
      geom.computeBoundingBox();
      var bb = geom.boundingBox;
      var minY = bb.min.y;
      var spanY = Math.max(bb.max.y - minY, 0.001);
      var centerX = (bb.min.x + bb.max.x) * 0.5;
      var halfW = Math.max((bb.max.x - bb.min.x) * 0.5, 0.001);

      var pos = geom.attributes.position;
      var vCount = pos.count;
      var skinIndices = new Uint16Array(vCount * 4);
      var skinWeights = new Float32Array(vCount * 4);

      for (var i = 0; i < vCount; i++) {
        var vx = pos.getX(i) - centerX;
        var vy = pos.getY(i);
        var ny = (vy - minY) / spanY;
        var ax = Math.abs(vx) / halfW;

        var i0 = 0, i1 = 0, i2 = 0, i3 = 0;
        var w0 = 1, w1 = 0, w2 = 0, w3 = 0;

        var armMinAx = ny >= 0.52 ? 0.385 : 0.45;

        if (ny >= 0.695 && ax < 0.42) {
          /* Neck -> Head */
          var tHead = smoothstep(0.695, 0.750, ny);
          i0 = 4; w0 = tHead;
          i1 = 3; w1 = (1 - tHead) * 0.7;
          i2 = 2; w2 = (1 - tHead) * 0.3;
        } else if (ny >= 0.34 && ny < 0.705 && ax > armMinAx) {
          /* Left or Right Arm (A-pose, cleanly separated across torso air-gap) */
          var isRight = vx > 0;
          var bUpper = isRight ? 7 : 5;
          var bHand = isRight ? 8 : 6;
          var tArm = smoothstep(armMinAx, armMinAx + 0.11, ax);
          var tWrist = smoothstep(0.65, 0.84, ax);
          i0 = bUpper; w0 = tArm * (1 - tWrist * 0.85);
          i1 = bHand;  w1 = tArm * (tWrist * 0.85);
          i2 = 2;      w2 = 1 - tArm;
        } else if (ny >= 0.40) {
          /* Hips -> Spine -> Spine2 */
          if (ny < 0.52) {
            var tSp = smoothstep(0.40, 0.52, ny);
            i0 = 0; w0 = 1 - tSp;
            i1 = 1; w1 = tSp;
          } else {
            var tSp2 = smoothstep(0.52, 0.64, ny);
            i0 = 1; w0 = 1 - tSp2;
            i1 = 2; w1 = tSp2;
          }
        } else {
          /* Legs: Hips -> UpLeg -> Leg (Knee/Shin/Shoe) */
          var rLeg = vx >= 0;
          var bHipLeg = rLeg ? 11 : 9;
          var bKneeLeg = rLeg ? 12 : 10;
          var tPelvis = smoothstep(0.35, 0.42, ny);
          var tShin = 1 - smoothstep(0.18, 0.25, ny);
          var rem = 1 - tPelvis * 0.65;
          i0 = bHipLeg;  w0 = rem * (1 - tShin);
          i1 = bKneeLeg; w1 = rem * tShin;
          i2 = 0;        w2 = tPelvis * 0.65;
        }

        var sum = w0 + w1 + w2 + w3;
        if (sum <= 0.00001) { i0 = 0; w0 = 1; w1 = 0; w2 = 0; w3 = 0; sum = 1; }
        skinIndices[i * 4] = i0;
        skinIndices[i * 4 + 1] = i1;
        skinIndices[i * 4 + 2] = i2;
        skinIndices[i * 4 + 3] = i3;
        skinWeights[i * 4] = w0 / sum;
        skinWeights[i * 4 + 1] = w1 / sum;
        skinWeights[i * 4 + 2] = w2 / sum;
        skinWeights[i * 4 + 3] = w3 / sum;
      }

      geom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
      geom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

      var origMat = Array.isArray(srcMesh.material) ? srcMesh.material[0] : srcMesh.material;
      var finalMat;
      if (origMat && origMat.map) {
        finalMat = origMat.clone();
      } else {
        paintKidGeometryColors(geom, bb, palette);
        finalMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.54,
          metalness: 0.06
        });
        paintTargets.push({ geom: geom, bounds: bb });
      }

      var skinned = new THREE.SkinnedMesh(geom, finalMat);
      skinned.name = 'eaa-skinned-' + idx;
      skinned.castShadow = true;
      skinned.receiveShadow = true;
      skinned.frustumCulled = false;

      var skeleton = new THREE.Skeleton(bones);
      skinned.bind(skeleton);
      rigGroup.add(skinned);
    });

    var boneMap = {};
    bones.forEach(function (b) { boneMap[b.name] = b; });

    return {
      root: rigGroup,
      bones: bones,
      boneMap: boneMap,
      isAutoRigged: true,
      recolor: function (newPalette) {
        paintTargets.forEach(function (t) {
          paintKidGeometryColors(t.geom, t.bounds, newPalette);
        });
      }
    };
  }

  function quatArray(eulers) {
    var THREE = getTHREE();
    var out = [];
    var e = new THREE.Euler();
    var q = new THREE.Quaternion();
    for (var i = 0; i < eulers.length; i++) {
      var r = eulers[i];
      e.set(r[0], r[1], r[2], 'XYZ');
      q.setFromEuler(e);
      out.push(q.x, q.y, q.z, q.w);
    }
    return out;
  }

  function createBuiltinClips(targetHeight) {
    var THREE = getTHREE();
    var H = targetHeight || 1.65;
    var baseHipY = 0.42 * H;

    /* 1. Idle (Breathing & Friendly Head Nod) */
    var idle = new THREE.AnimationClip('Idle (Breathing)', 2.4, [
      new THREE.VectorKeyframeTrack('mixamorigHips.position', [0, 1.2, 2.4], [
        0, baseHipY, 0,
        0, baseHipY + 0.018, 0,
        0, baseHipY, 0
      ]),
      new THREE.QuaternionKeyframeTrack('mixamorigSpine2.quaternion', [0, 1.2, 2.4], quatArray([
        [0, 0, 0], [-0.035, 0.03, 0], [0, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigHead.quaternion', [0, 0.8, 1.6, 2.4], quatArray([
        [0, -0.06, 0], [0.04, 0.07, 0.02], [-0.02, -0.04, -0.02], [0, -0.06, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', [0, 1.2, 2.4], quatArray([
        [0, 0, 0.10], [0.04, 0, 0.04], [0, 0, 0.10]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 1.2, 2.4], quatArray([
        [0, 0, -0.10], [-0.04, 0, -0.04], [0, 0, -0.10]
      ]))
    ]);

    /* 2. Wave (Friendly Right-Hand Hello!) */
    var wave = new THREE.AnimationClip('Wave Hello', 1.6, [
      new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 0.35, 0.65, 0.95, 1.25, 1.6], quatArray([
        [0, 0, -0.1], [-0.15, 0, 1.85], [-0.15, 0, 1.45], [-0.15, 0, 1.90], [-0.15, 0, 1.48], [0, 0, -0.1]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigHead.quaternion', [0, 0.5, 1.1, 1.6], quatArray([
        [0, 0, 0], [0.04, 0.08, -0.08], [0.04, -0.06, 0.06], [0, 0, 0]
      ]))
    ]);

    /* 3. Cheer (Victory Hop & Both Arms High Overhead!) */
    var cheer = new THREE.AnimationClip('Victory Cheer', 1.2, [
      new THREE.VectorKeyframeTrack('mixamorigHips.position', [0, 0.3, 0.6, 0.9, 1.2], [
        0, baseHipY, 0,
        0, baseHipY + 0.14, 0,
        0, baseHipY, 0,
        0, baseHipY + 0.11, 0,
        0, baseHipY, 0
      ]),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', [0, 0.3, 0.6, 0.9, 1.2], quatArray([
        [0, 0, 0.1], [-0.12, 0, -1.85], [-0.08, 0, -1.45], [-0.12, 0, -1.85], [0, 0, 0.1]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 0.3, 0.6, 0.9, 1.2], quatArray([
        [0, 0, -0.1], [-0.12, 0, 1.85], [-0.08, 0, 1.45], [-0.12, 0, 1.85], [0, 0, -0.1]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigHead.quaternion', [0, 0.3, 0.9, 1.2], quatArray([
        [0, 0, 0], [-0.12, 0, 0], [-0.10, 0, 0], [0, 0, 0]
      ]))
    ]);

    /* 4. Run (Athletic Pitch Stride) */
    var run = new THREE.AnimationClip('Sprint Stride', 0.8, [
      new THREE.VectorKeyframeTrack('mixamorigHips.position', [0, 0.2, 0.4, 0.6, 0.8], [
        0, baseHipY + 0.03, 0,
        0, baseHipY - 0.02, 0,
        0, baseHipY + 0.03, 0,
        0, baseHipY - 0.02, 0,
        0, baseHipY + 0.03, 0
      ]),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftUpLeg.quaternion', [0, 0.4, 0.8], quatArray([
        [-0.55, 0, 0], [0.48, 0, 0], [-0.55, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightUpLeg.quaternion', [0, 0.4, 0.8], quatArray([
        [0.48, 0, 0], [-0.55, 0, 0], [0.48, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftLeg.quaternion', [0, 0.4, 0.8], quatArray([
        [0.15, 0, 0], [0.65, 0, 0], [0.15, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightLeg.quaternion', [0, 0.4, 0.8], quatArray([
        [0.65, 0, 0], [0.15, 0, 0], [0.65, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', [0, 0.4, 0.8], quatArray([
        [0.45, 0, 0.15], [-0.45, 0, 0.15], [0.45, 0, 0.15]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 0.4, 0.8], quatArray([
        [-0.45, 0, -0.15], [0.45, 0, -0.15], [-0.45, 0, -0.15]
      ]))
    ]);

    /* 5. Kick (Penalty Power Strike!) */
    var kick = new THREE.AnimationClip('Penalty Strike', 1.1, [
      new THREE.QuaternionKeyframeTrack('mixamorigSpine.quaternion', [0, 0.35, 0.62, 1.1], quatArray([
        [0, 0, 0], [0.14, -0.18, 0], [-0.18, 0.22, 0.08], [0, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightUpLeg.quaternion', [0, 0.35, 0.60, 1.1], quatArray([
        [0, 0, 0], [0.68, 0, 0], [-0.92, 0, 0.06], [0, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightLeg.quaternion', [0, 0.35, 0.58, 1.1], quatArray([
        [0, 0, 0], [0.75, 0, 0], [0.05, 0, 0], [0, 0, 0]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', [0, 0.35, 0.62, 1.1], quatArray([
        [0, 0, 0.1], [0.35, 0, -0.45], [-0.55, 0, -0.55], [0, 0, 0.1]
      ])),
      new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 0.35, 0.62, 1.1], quatArray([
        [0, 0, -0.1], [-0.35, 0, 0.35], [0.45, 0, 0.35], [0, 0, -0.1]
      ]))
    ]);

    return [idle, wave, cheer, run, kick];
  }

  function exportObjString(rootObj) {
    var lines = ['# English Adventure Academy 3D Export (Mixamo Ready)'];
    var vOffset = 1;
    rootObj.updateMatrixWorld(true);
    var THREE = getTHREE();
    var v = new THREE.Vector3();

    rootObj.traverse(function (child) {
      if (!child.isMesh || !child.geometry || !child.geometry.attributes.position) return;
      var pos = child.geometry.attributes.position;
      lines.push('o ' + (child.name || 'mesh'));
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
        lines.push('v ' + v.x.toFixed(5) + ' ' + v.y.toFixed(5) + ' ' + v.z.toFixed(5));
      }
      var idx = child.geometry.index;
      if (idx) {
        for (var j = 0; j < idx.count; j += 3) {
          lines.push('f ' + (idx.getX(j) + vOffset) + ' ' + (idx.getX(j + 1) + vOffset) + ' ' + (idx.getX(j + 2) + vOffset));
        }
      } else {
        for (var k = 0; k < pos.count; k += 3) {
          lines.push('f ' + (k + vOffset) + ' ' + (k + 1 + vOffset) + ' ' + (k + 2 + vOffset));
        }
      }
      vOffset += pos.count;
    });
    return lines.join('\n');
  }

  function findBone(rootObj, candidates) {
    if (!rootObj || !Array.isArray(candidates) || !candidates.length) return null;
    var lowerMap = new Map();
    rootObj.traverse(function (node) {
      if (node.isBone || /head|spine|hand|chest|neck|hip|leg|foot/i.test(node.name || '')) {
        lowerMap.set((node.name || '').toLowerCase(), node);
      }
    });
    for (var i = 0; i < candidates.length; i++) {
      var exact = lowerMap.get(candidates[i].toLowerCase());
      if (exact) return exact;
    }
    for (var j = 0; j < candidates.length; j++) {
      var needle = candidates[j].toLowerCase().replace(/^mixamorig/, '');
      var entries = Array.from(lowerMap.entries());
      for (var m = 0; m < entries.length; m++) {
        if (entries[m][0].includes(needle)) return entries[m][1];
      }
    }
    return null;
  }

  class Avatar3DStage {
    constructor(container, opts) {
      var THREE = getTHREE();
      if (!THREE) throw new Error('THREE not loaded');
      this.container = container;
      this.opts = Object.assign({
        background: 0x060911,
        autoRotate: true,
        targetHeight: 1.65,
        palette: null
      }, opts || {});

      var w = container.clientWidth || 320;
      var h = container.clientHeight || 336;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(36, w / h, 0.05, 50);
      this.camera.position.set(0.35, 1.32, 3.25);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (THREE.SRGBColorSpace) this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      container.innerHTML = '';
      container.appendChild(this.renderer.domElement);

      this._setupLights();
      this._setupPedestal();

      if (THREE.OrbitControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0.85, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.07;
        this.controls.minDistance = 1.2;
        this.controls.maxDistance = 6.5;
        this.controls.maxPolarAngle = Math.PI * 0.54;
        this.controls.autoRotate = !!this.opts.autoRotate;
        this.controls.autoRotateSpeed = 1.25;
      }

      this.rootGroup = new THREE.Group();
      this.scene.add(this.rootGroup);
      this.characterObj = null;
      this.rigInfo = null;
      this.mixer = null;
      this.actions = [];
      this.equippedItems = new Map();
      this.clock = new THREE.Clock();
      this._rafId = 0;

      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);
      this._animate();
    }

    _setupLights() {
      var THREE = getTHREE();
      var hemi = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.35);
      this.scene.add(hemi);

      var key = new THREE.DirectionalLight(0xffffff, 2.15);
      key.position.set(2.6, 4.4, 3.8);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 14;
      key.shadow.camera.left = -2;
      key.shadow.camera.right = 2;
      key.shadow.camera.top = 2.5;
      key.shadow.camera.bottom = -0.5;
      this.scene.add(key);

      var fillFront = new THREE.DirectionalLight(0xe0f2fe, 0.75);
      fillFront.position.set(-2.2, 2.0, 2.8);
      this.scene.add(fillFront);

      var rimCyan = new THREE.DirectionalLight(0x38bdf8, 1.15);
      rimCyan.position.set(-3.2, 2.4, -2.5);
      this.scene.add(rimCyan);

      var rimAmber = new THREE.PointLight(0xf59e0b, 0.85, 8);
      rimAmber.position.set(2.4, 1.4, -2.2);
      this.scene.add(rimAmber);
    }

    _setupPedestal() {
      var THREE = getTHREE();
      var discGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.06, 48);
      var discMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.45,
        roughness: 0.35
      });
      var disc = new THREE.Mesh(discGeo, discMat);
      disc.position.y = -0.03;
      disc.receiveShadow = true;
      this.scene.add(disc);

      var ringGeo = new THREE.RingGeometry(0.70, 0.75, 64);
      var ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.002;
      this.scene.add(ring);
    }

    setAutoRotate(flag) {
      if (this.controls) this.controls.autoRotate = !!flag;
    }

    resize() {
      if (!this.container || !this.renderer) return;
      var w = Math.max(this.container.clientWidth, 160);
      var h = Math.max(this.container.clientHeight, 160);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    loadGlbFromUrl(url) {
      return loadCachedGlb(url);
    }

    loadGlbFromFile(file) {
      return file.arrayBuffer().then(parseGlbBuffer);
    }

    async setCharacterFromSource(src, palette) {
      if (palette) this.opts.palette = palette;
      var gltf = typeof src === 'string' ? await this.loadGlbFromUrl(src) : await this.loadGlbFromFile(src);
      return this._applyCharacterGltf(gltf);
    }

    setPalette(palette) {
      this.opts.palette = Object.assign({}, this.opts.palette || {}, palette || {});
      if (this.rigInfo && this.rigInfo.recolor) {
        this.rigInfo.recolor(this.opts.palette);
      }
    }

    _applyCharacterGltf(gltf) {
      var THREE = getTHREE();
      for (var entry of this.equippedItems.values()) {
        if (entry.wrapper && entry.wrapper.parent) {
          entry.wrapper.parent.remove(entry.wrapper);
        }
      }

      if (this.characterObj) {
        this.rootGroup.remove(this.characterObj);
      }
      this.mixer = null;
      this.actions = [];

      var rig = autoRigHumanoidScene(gltf.scene, this.opts.targetHeight, this.opts.palette);
      this.rigInfo = rig;
      this.rootGroup.add(rig.root);
      this.characterObj = rig.root;

      var clips = (Array.isArray(gltf.animations) && gltf.animations.length > 0)
        ? gltf.animations
        : createBuiltinClips(this.opts.targetHeight);

      if (clips.length > 0) {
        this.mixer = new THREE.AnimationMixer(rig.root);
        this.actions = clips.map((clip) => ({
          name: clip.name || 'Clip',
          action: this.mixer.clipAction(clip)
        }));
        this.actions[0].action.play();
      }

      for (var itemEntry of this.equippedItems.values()) {
        this._attachItemObject(itemEntry.cfg, itemEntry.wrapper);
      }

      return {
        bones: rig.bones.map(function (b) { return b.name; }),
        isAutoRigged: rig.isAutoRigged,
        animations: this.actions.map(function (a) { return a.name; })
      };
    }

    showStandalonePropFromGltf(gltf, presetId) {
      if (this.characterObj) {
        this.rootGroup.remove(this.characterObj);
        this.characterObj = null;
      }
      this.rigInfo = null;
      this.mixer = null;
      this.actions = [];
      var model = gltf.scene;
      applyItemFallbackMaterial(model, presetId || 'crown');
      normalizeModelToHeight(model, 1.05);
      model.position.y += 0.28;
      this.rootGroup.add(model);
      this.characterObj = model;
      return { bones: [], animations: [] };
    }

    async equipItemFromSource(itemCfg, src) {
      var THREE = getTHREE();
      var gltf = typeof src === 'string' ? await this.loadGlbFromUrl(src) : await this.loadGlbFromFile(src);
      this.unequipItem(itemCfg.id);

      var mesh = gltf.scene;
      applyItemFallbackMaterial(mesh, itemCfg.id);
      normalizeItemToSize(mesh, itemCfg.scale || 0.28);

      var wrapper = new THREE.Group();
      wrapper.name = 'eaa-item-' + itemCfg.id;
      wrapper.add(mesh);

      this.equippedItems.set(itemCfg.id, { cfg: Object.assign({}, itemCfg), wrapper: wrapper });
      this._attachItemObject(itemCfg, wrapper);
      return wrapper;
    }

    _attachItemObject(cfg, wrapper) {
      if (wrapper.parent) wrapper.parent.remove(wrapper);
      var bone = this.characterObj ? findBone(this.characterObj, cfg.boneCandidates) : null;
      if (bone) {
        var off = cfg.socketOffset || [0, 0, 0];
        wrapper.position.set(off[0], off[1], off[2]);
        var rot = cfg.rotation || [0, 0, 0];
        wrapper.rotation.set(rot[0], rot[1], rot[2]);
        bone.add(wrapper);
      } else {
        var fOff = cfg.fallbackOffset || [0, 1.0, 0];
        wrapper.position.set(fOff[0], fOff[1], fOff[2]);
        var fRot = cfg.rotation || [0, 0, 0];
        wrapper.rotation.set(fRot[0], fRot[1], fRot[2]);
        this.rootGroup.add(wrapper);
      }
    }

    updateItemTransform(itemId, patch) {
      var entry = this.equippedItems.get(itemId);
      if (!entry) return;
      Object.assign(entry.cfg, patch);
      if (typeof patch.scale === 'number' && entry.wrapper.children[0]) {
        normalizeItemToSize(entry.wrapper.children[0], patch.scale);
      }
      this._attachItemObject(entry.cfg, entry.wrapper);
    }

    unequipItem(itemId) {
      var prev = this.equippedItems.get(itemId);
      if (prev && prev.wrapper && prev.wrapper.parent) {
        prev.wrapper.parent.remove(prev.wrapper);
      }
      this.equippedItems.delete(itemId);
    }

    clearItems() {
      for (var id of Array.from(this.equippedItems.keys())) {
        this.unequipItem(id);
      }
    }

    playAnimation(indexOrName) {
      if (!this.actions.length) return;
      this.actions.forEach(function (a) { a.action.stop(); });
      var picked = typeof indexOrName === 'number'
        ? this.actions[indexOrName]
        : this.actions.find(function (a) { return a.name.toLowerCase().indexOf(String(indexOrName).toLowerCase()) >= 0; });
      if (!picked) picked = this.actions[0];
      if (picked) picked.action.reset().play();
    }

    bakeCardPng() {
      this.renderer.render(this.scene, this.camera);
      return this.renderer.domElement.toDataURL('image/png');
    }

    exportCharacterObj() {
      if (!this.characterObj) return '';
      return exportObjString(this.characterObj);
    }

    _animate() {
      this._rafId = requestAnimationFrame(() => this._animate());
      var dt = Math.min(this.clock.getDelta(), 0.05);
      if (this.mixer) this.mixer.update(dt);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    dispose() {
      cancelAnimationFrame(this._rafId);
      window.removeEventListener('resize', this._onResize);
      if (this.renderer) this.renderer.dispose();
    }
  }

  root.Avatar3DEngine = {
    Stage: Avatar3DStage,
    loadCachedGlb: loadCachedGlb,
    autoRigHumanoidScene: autoRigHumanoidScene,
    createBuiltinClips: createBuiltinClips,
    applyItemFallbackMaterial: applyItemFallbackMaterial,
    normalizeModelToHeight: normalizeModelToHeight,
    normalizeItemToSize: normalizeItemToSize,
    exportObjString: exportObjString,
    findBone: findBone
  };
})(window);
