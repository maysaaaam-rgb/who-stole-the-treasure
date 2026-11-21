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

  /**
   * Unshares any glTF KHR_mesh_quantization InterleavedBuffer / normalized Int16 position attribute
   * into its own standalone Float32BufferAttribute so procedural hair-tucking never touches
   * normal, uv, skinIndex (JOINTS_0) or skinWeight (WEIGHTS_0) or truncates floats to Int16!
   */
  function ensureStandaloneFloatPosition(geom) {
    var THREE = getTHREE();
    if (!geom || !geom.attributes || !geom.attributes.position) return null;
    var pos = geom.attributes.position;
    if (!pos.isInterleavedBufferAttribute && !pos.normalized && (pos.array instanceof Float32Array)) {
      if (!geom.userData._origPos) geom.userData._origPos = new Float32Array(pos.array);
      return geom.userData._origPos;
    }
    var f32 = new Float32Array(pos.count * 3);
    for (var i = 0; i < pos.count; i++) {
      f32[i * 3]     = pos.getX(i);
      f32[i * 3 + 1] = pos.getY(i);
      f32[i * 3 + 2] = pos.getZ(i);
    }
    geom.setAttribute('position', new THREE.BufferAttribute(f32, 3));
    geom.userData._origPos = new Float32Array(f32);
    return geom.userData._origPos;
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

  /* Shared ArrayBuffer & Texture caches so switching pupils/teams parses & decodes only once */
  var _glbBufferCache = new Map();
  var _teamTexCache = new Map();

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

  function normalizeItemToSize(obj, targetSize, anchorY) {
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
    var ay = (anchorY != null) ? (box2.min.y + (box2.max.y - box2.min.y) * anchorY) : c2.y;
    obj.position.x -= c2.x;
    obj.position.y -= ay;
    obj.position.z -= c2.z;
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
      var rootG = new THREE.Group();
      var bodyG = new THREE.Group();
      var innerG = new THREE.Group();
      rootG.add(bodyG);
      bodyG.add(innerG);
      innerG.add(gltfScene);

      var bMap = {}, shortBones = {}, restQ = {};
      gltfScene.traverse(function (c) {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = false;
          c.frustumCulled = false;
          if (c.geometry && !c.geometry.attributes.normal) c.geometry.computeVertexNormals();
          if (c.material) { c.material = c.material.clone(); c.material.metalness = 0; c.material.roughness = 0.74; }
        }
        if (c.isBone) {
          bMap[c.name] = c;
          var sk = c.name.replace(/^mixamorig:?/, '');
          shortBones[sk] = c;
          restQ[sk] = c.quaternion.clone();
        }
      });

      rootG.updateMatrixWorld(true);
      var b0 = new THREE.Box3().setFromObject(gltfScene);
      var s0 = H / Math.max(b0.max.y - b0.min.y, 0.01);
      gltfScene.scale.multiplyScalar(s0);
      gltfScene.position.y -= b0.min.y * s0;
      rootG.updateMatrixWorld(true);
      var b1 = new THREE.Box3().setFromObject(gltfScene);
      var c1 = b1.getCenter(new THREE.Vector3());
      gltfScene.position.x -= c1.x;
      gltfScene.position.z -= c1.z;
      rootG.updateMatrixWorld(true);

      // Align Mixamo front strictly to +Z using LeftArm -> RightArm axis
      if (shortBones.LeftArm && shortBones.RightArm) {
        var pa = new THREE.Vector3(), pb = new THREE.Vector3();
        shortBones.LeftArm.getWorldPosition(pa);
        shortBones.RightArm.getWorldPosition(pb);
        var leftV = pa.sub(pb); leftV.y = 0; leftV.normalize();
        var fwdV = new THREE.Vector3().crossVectors(leftV, new THREE.Vector3(0, 1, 0)).normalize();
        innerG.rotation.y = -Math.atan2(fwdV.x, fwdV.z);
        rootG.updateMatrixWorld(true);
      }

      // Cache rest-pose vertex positions & rest-to-root matrix for native hair tucking under wigs/helmets/hats
      gltfScene.traverse(function (c) {
        if (c.isMesh && c.geometry && c.geometry.attributes.position) {
          c.geometry = c.geometry.clone();
          ensureStandaloneFloatPosition(c.geometry);
          c.userData._restToRoot = c.matrixWorld.clone();
        }
      });

      var outL = 0.68, outR = 0.68;
      if (shortBones.LeftArm && shortBones.LeftForeArm && shortBones.RightArm && shortBones.RightForeArm) {
        var mArm = function (a, f, sg) {
          var p1 = new THREE.Vector3(), p2 = new THREE.Vector3();
          shortBones[a].getWorldPosition(p1); shortBones[f].getWorldPosition(p2);
          var d = p2.sub(p1);
          return Math.atan2(sg * d.x, -d.y);
        };
        outL = mArm('LeftArm', 'LeftForeArm', 1);
        outR = mArm('RightArm', 'RightForeArm', -1);
      }

      return {
        root: rootG,
        body: bodyG,
        inner: innerG,
        height: H,
        bones: existingBones,
        boneMap: bMap,
        shortBones: shortBones,
        restQ: restQ,
        outL: outL,
        outR: outR,
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
      this._itemSyncs = new Map();
      this._mixPoseState = 'idle';
      this._mixPoseT = 0;
      this._mixPoseP = null;
      this._pupilHead = null;
      this._pupilPivot = null;
      this._syncHead = null;
      this._shirtDone = Promise.resolve();
      this._isGirl = false;
      this._freezePose = false;
      this.clock = new THREE.Clock();
      this._rafId = 0;

      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);
      this._animate();
    }

    _setupLights() {
      var THREE = getTHREE();
      var hemi = new THREE.HemisphereLight(0xf8fcff, 0x9be082, 1.15);
      this.scene.add(hemi);

      var key = new THREE.DirectionalLight(0xfff7e8, 1.55);
      key.position.set(2.8, 4.8, 4.2);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 14;
      key.shadow.camera.left = -2;
      key.shadow.camera.right = 2;
      key.shadow.camera.top = 2.5;
      key.shadow.camera.bottom = -0.5;
      this.scene.add(key);

      var fillFront = new THREE.DirectionalLight(0xfffaf2, 0.65);
      fillFront.position.set(-2.4, 2.2, 3.2);
      this.scene.add(fillFront);

      var rimSky = new THREE.DirectionalLight(0xbbe9ff, 0.55);
      rimSky.position.set(-3.0, 2.6, -2.8);
      this.scene.add(rimSky);
    }

    _setupPedestal() {
      var THREE = getTHREE();
      var discGeo = new THREE.CylinderGeometry(0.68, 0.74, 0.08, 48);
      var discMat = new THREE.MeshStandardMaterial({
        color: 0x4f9dff,
        metalness: 0.05,
        roughness: 0.45
      });
      var disc = new THREE.Mesh(discGeo, discMat);
      disc.position.y = -0.04;
      disc.receiveShadow = true;
      this.scene.add(disc);

      var ringGeo = new THREE.TorusGeometry(0.69, 0.024, 10, 48);
      var ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0 });
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.004;
      this.scene.add(ring);
    }

    setAutoRotate(flag) {
      if (this.controls) this.controls.autoRotate = !!flag;
    }

    setFreezePose(flag) {
      this._freezePose = !!flag;
      if (this._freezePose && this.rigInfo && !this.rigInfo.isAutoRigged) {
        this._mixPoseP = null;
        this._stepMixamoPose(0.016);
      }
    }

    getEquippedItemNode(itemId) {
      var e = this.equippedItems.get(itemId);
      return (e && e.wrapper && e.wrapper.userData && e.wrapper.userData.itemNode) || null;
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
      this._isGirl = typeof src === 'string' && /girl/i.test(src);
      var gltf = typeof src === 'string' ? await this.loadGlbFromUrl(src) : await this.loadGlbFromFile(src);
      return this._applyCharacterGltf(gltf);
    }

    setTeamTexture(texUrl) {
      var THREE = getTHREE();
      if (!texUrl || !this.rigInfo) return Promise.resolve();
      var target = this.rigInfo.inner || this.rigInfo.root;
      var texP = _teamTexCache.get(texUrl);
      if (!texP) {
        texP = new Promise(function (res) {
          new THREE.TextureLoader().load(texUrl, function (t) {
            t.flipY = false;
            if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 4;
            res(t);
          }, undefined, function () { res(null); });
        });
        _teamTexCache.set(texUrl, texP);
      }
      this._shirtDone = texP.then(function (t) {
        if (!t) return;
        target.traverse(function (o) {
          if (!o.isMesh || !o.material) return;
          if (t.image) o.userData._origShirtImg = t.image;
          o.material = o.material.clone();
          o.material.map = t;
          o.material.roughness = 0.74;
          o.material.metalness = 0;
          o.material.needsUpdate = true;
        });
      });
      return this._shirtDone;
    }

    async mountHeadFromSource(srcOrBuf, opts) {
      var THREE = getTHREE();
      opts = opts || {};
      if (!srcOrBuf || !this.rigInfo || !this.rigInfo.shortBones) return false;
      await (this._shirtDone || Promise.resolve());
      var gltf = (typeof srcOrBuf === 'string') ? await this.loadGlbFromUrl(srcOrBuf) : await parseGlbBuffer(srcOrBuf);
      if (!gltf || !gltf.scene) return false;
      var rig = this.rigInfo;
      var H = rig.height || this.opts.targetHeight || 1.65;
      if (this._pupilHead && this._pupilHead.parent) this._pupilHead.parent.remove(this._pupilHead);

      var headModel = gltf.scene;
      headModel.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(headModel);
      var sz = box.getSize(new THREE.Vector3());
      var ctr = box.getCenter(new THREE.Vector3());
      var kS = H / 1.65;

      // Master-Skull Detection:
      // v19 pupil .glbs have box.max.y >= 0.321m and max dim < 0.72m (1:1 Default Pixar Skull: eyeY=+0.122m, bridgeZ=+0.170m, hatW=0.342m).
      // Legacy v18 cached .glbs (box.max.y < 0.321m) auto-upgrade by uniform 1.25x scalar so even un-reuploaded cloud heads fit 1:1!
      var isLegacyV18 = Math.max(sz.x, sz.y, sz.z) < 0.50 && box.max.y < 0.321;
      var isMasterCalibrated = Math.max(sz.x, sz.y, sz.z) < 0.72;
      var s = isLegacyV18 ? (1.25 * kS) : kS, chinY = 0, rawNoseY = 0, rawNoseZ = 0, bestEyeY = 0.122, bestBridgeZ = 0.170;

      if (!isMasterCalibrated) {
        // Fallback auto-calibration for newly uploaded uncalibrated raw .glb heads
        chinY = Infinity; rawNoseY = -Infinity; rawNoseZ = -Infinity;
        var tv = new THREE.Vector3(), allPts = [];
        headModel.traverse(function (o) {
          if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
          var pos = o.geometry.attributes.position;
          for (var i = 0; i < pos.count; i++) {
            tv.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
            allPts.push(tv.x, tv.y, tv.z);
            if (Math.abs(tv.x - ctr.x) < sz.x * 0.08 && tv.z > ctr.z + sz.z * 0.08 && tv.y < chinY) chinY = tv.y;
          }
        });
        if (!isFinite(chinY)) chinY = box.min.y + sz.y * 0.05;
        for (var pi = 0; pi < allPts.length; pi += 3) {
          if (Math.abs(allPts[pi] - ctr.x) < sz.x * 0.055 && allPts[pi + 1] >= chinY + sz.y * 0.12 && allPts[pi + 1] <= chinY + sz.y * 0.48) {
            if (allPts[pi + 2] > rawNoseZ) { rawNoseZ = allPts[pi + 2]; rawNoseY = allPts[pi + 1]; }
          }
        }
        if (!isFinite(rawNoseY)) { rawNoseY = chinY + sz.y * 0.25; rawNoseZ = box.max.z; }
        var dn = Math.max(rawNoseY - chinY, sz.y * 0.08);
        bestEyeY = chinY + dn * 1.48;
        bestBridgeZ = rawNoseZ - 0.12 * dn;
        var rawEyeH = Math.max(0.05, bestEyeY - chinY);
        s = (0.140 * kS) / rawEyeH;
      }
      headModel.scale.setScalar(s);
      headModel.updateMatrixWorld(true);

      var skinRGB = [214, 152, 118];
      headModel.traverse(function (o) {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = false;
        if (o.geometry && o.geometry.attributes.position && !o.geometry.userData._origPos) {
          o.geometry = o.geometry.clone();
          ensureStandaloneFloatPosition(o.geometry);
        }
        if (o.material) {
          o.material = o.material.clone(); o.material.metalness = 0; o.material.roughness = 0.76;
          if (o.material.map && o.material.map.image && o.material.map.image.width) {
            try {
              var cv = document.createElement('canvas'); cv.width = 160; cv.height = 160;
              var ctx = cv.getContext('2d'); ctx.drawImage(o.material.map.image, 0, 0, 160, 160);
              var dd = ctx.getImageData(0, 0, 160, 160).data, rs = [], gs = [], bs = [];
              for (var k = 0; k < dd.length; k += 4) {
                var rr = dd[k], gg = dd[k + 1], bb = dd[k + 2];
                if (rr > 135 && rr < 248 && gg > 92 && gg < 218 && bb > 58 && bb < 185 &&
                    rr > gg + 16 && gg > bb + 10 && (rr - bb) > 36 && (rr - bb) < 145) { rs.push(rr); gs.push(gg); bs.push(bb); }
              }
              if (rs.length >= 25) {
                rs.sort(function (a, b) { return a - b; }); gs.sort(function (a, b) { return a - b; }); bs.sort(function (a, b) { return a - b; });
                var mid = Math.floor(rs.length * 0.48); skinRGB = [rs[mid], gs[mid], bs[mid]];
              }
            } catch (e) {}
            o.material.emissive = new THREE.Color(0xfff4ea);
            o.material.emissiveMap = o.material.map;
            o.material.emissiveIntensity = 0.15;
          }
          o.material.needsUpdate = true;
        }
      });

      // Match body skin smoothly to head skin (always sample from pristine _origShirtImg so switching heads never drifts!)
      var synced = false;
      (rig.inner || rig.root).traverse(function (o) {
        if (synced || !o.isMesh || !o.material || !o.material.map || !o.material.map.image || !o.material.map.image.width) return;
        synced = true;
        if (!o.userData._origShirtImg) o.userData._origShirtImg = o.material.map.image;
        var img = o.userData._origShirtImg, cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
        var ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0);
        var id = ctx.getImageData(0, 0, cv.width, cv.height), d = id.data;
        function sw(r, g, b) {
          if (r < 118 || g < 78 || b < 55 || b >= g - 2) return 0;
          var rg = r - g, gb = g - b, rb = r - b;
          return smoothstep(10, 24, rg) * (1 - smoothstep(66, 90, rg)) *
                 smoothstep(6, 16, gb) * (1 - smoothstep(46, 65, gb)) *
                 smoothstep(20, 38, rb) * (1 - smoothstep(105, 130, rb)) *
                 smoothstep(118, 148, r) * smoothstep(78, 108, g);
        }
        var rs = [], gs = [], bs = [];
        for (var j = 0; j < d.length; j += 16) if (sw(d[j], d[j + 1], d[j + 2]) > 0.6) { rs.push(d[j]); gs.push(d[j + 1]); bs.push(d[j + 2]); }
        var br = 222, bg = 160, bb = 132;
        if (rs.length > 20) {
          rs.sort(function (a, b) { return a - b; }); gs.sort(function (a, b) { return a - b; }); bs.sort(function (a, b) { return a - b; });
          var m = Math.floor(rs.length * 0.5); br = rs[m]; bg = gs[m]; bb = bs[m];
        }
        var kR = (br * 0.08 + skinRGB[0] * 0.92) / br, kG = (bg * 0.08 + skinRGB[1] * 0.92) / bg, kB = (bb * 0.08 + skinRGB[2] * 0.92) / bb;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i], g = d[i + 1], b = d[i + 2], w = sw(r, g, b);
          if (w > 0.01) {
            d[i]     = Math.round(r + (clamp(r * kR, 0, 255) - r) * w);
            d[i + 1] = Math.round(g + (clamp(g * kG, 0, 255) - g) * w);
            d[i + 2] = Math.round(b + (clamp(b * kB, 0, 255) - b) * w);
          }
        }
        ctx.putImageData(id, 0, 0);
        var nt = new THREE.CanvasTexture(cv); nt.flipY = false;
        if (THREE.SRGBColorSpace) nt.colorSpace = THREE.SRGBColorSpace;
        nt.anisotropy = 4;
        o.material = o.material.clone(); o.material.map = nt; o.material.needsUpdate = true;
      });

      var pivot = new THREE.Group();
      if (isMasterCalibrated) {
        // 1:1 Canonical Default-Skull placement: (0,0,0) IS exact Head bone origin!
        headModel.position.set(0, 0, isLegacyV18 ? (0.005 * kS) : 0);
      } else {
        headModel.position.set(-ctr.x * s, -bestEyeY * s + 0.122 * kS, -bestBridgeZ * s + 0.170 * kS);
      }
      pivot.add(headModel);
      pivot.updateMatrixWorld(true);

      // Cleanly tuck any dark Tripo neck-stump bottom rim (strictly inside central neck column, never touching long hair!)
      // inside our smooth skin-matched neck bridge cylinder so zero dark seam appears at the t-shirt collar.
      var invPivNeck = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
      headModel.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
        var attr = o.geometry.attributes.position, arr = attr.array;
        var toP = new THREE.Matrix4().multiplyMatrices(invPivNeck, o.matrixWorld);
        var toL = new THREE.Matrix4().copy(toP).invert();
        var vn = new THREE.Vector3();
        for (var i = 0; i < attr.count; i++) {
          var ix = i * 3;
          vn.set(arr[ix], arr[ix + 1], arr[ix + 2]).applyMatrix4(toP);
          if (vn.y < -0.052 * kS && Math.abs(vn.x) < 0.068 * kS && vn.z > -0.068 * kS && vn.z < 0.068 * kS) {
            var wn = smoothstep(-0.052 * kS, -0.075 * kS, vn.y);
            vn.x *= (1 - 0.35 * wn);
            vn.z *= (1 - 0.35 * wn);
            vn.y = Math.max(vn.y, -0.068 * kS);
            vn.applyMatrix4(toL);
            arr[ix] = vn.x; arr[ix + 1] = vn.y; arr[ix + 2] = vn.z;
          }
        }
        attr.needsUpdate = true;
        o.geometry.userData._origPos = new Float32Array(arr);
      });

      // Measure central topHairY ONLY for top-sitting mini crowns (everything else uses the unified Default Pixar Skull!)
      var chScaled = H * 0.252;
      var topHairY = 0.340 * kS, pv = new THREE.Vector3();
      var invPiv = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
      headModel.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
        var pos = o.geometry.attributes.position;
        var mLoc = new THREE.Matrix4().multiplyMatrices(invPiv, o.matrixWorld);
        for (var i = 0; i < pos.count; i += 2) {
          pv.fromBufferAttribute(pos, i).applyMatrix4(mLoc);
          if (Math.abs(pv.x) < 0.085 * kS && pv.z > -0.085 * kS && pv.z < 0.065 * kS) {
            if (pv.y > topHairY) topHairY = pv.y;
          }
        }
      });
      this._headFit = {
        ch: chScaled,
        noseZ: 0.212 * kS,
        bridgeZ: 0.170 * kS,
        skullZ: -0.010 * kS,
        eyeY: 0.122 * kS,
        noseY: 0.068 * kS,
        browY: 0.185 * kS,
        crownY: clamp(topHairY - 0.014 * kS, 0.298 * kS, 0.365 * kS),
        width: 0.36 * kS
      };

      var nc = new THREE.Color();
      if (nc.setRGB && THREE.SRGBColorSpace) nc.setRGB(skinRGB[0] / 255, skinRGB[1] / 255, skinRGB[2] / 255, THREE.SRGBColorSpace);
      else nc.setRGB(skinRGB[0] / 255, skinRGB[1] / 255, skinRGB[2] / 255).convertSRGBToLinear();
      var nr = H * 0.035, nh = H * 0.080;
      var nGeo = new THREE.CylinderGeometry(nr * 1.05, nr * 0.98, nh, 20, 4);
      var nPos = nGeo.attributes.position, nCols = new Float32Array(nPos.count * 3);
      for (var ni = 0; ni < nPos.count; ni++) {
        var tTop = (nPos.getY(ni) + nh * 0.5) / nh, sh = 0.92 - Math.pow(tTop, 1.8) * 0.20;
        nCols[ni * 3] = nc.r * sh; nCols[ni * 3 + 1] = nc.g * sh; nCols[ni * 3 + 2] = nc.b * sh;
      }
      nGeo.setAttribute('color', new THREE.BufferAttribute(nCols, 3));
      var nb = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 }));
      nb.position.set(0, -0.048 * kS, -0.004 * kS);
      pivot.add(nb);

      var holder = new THREE.Group();
      pivot.position.set(0, 0, 0);
      holder.add(pivot);
      rig.root.add(holder);
      this._pupilHead = holder;
      this._pupilPivot = pivot;
      this._pupilHeadModel = headModel;
      this._craniumH = chScaled;

      var headBone = rig.shortBones.Head, neckBone = rig.shortBones.Neck;
      var saved = {};
      for (var bk in rig.restQ) { saved[bk] = rig.shortBones[bk].quaternion.clone(); rig.shortBones[bk].quaternion.copy(rig.restQ[bk]); }
      var sbP = rig.body.position.clone(), sbR = rig.body.rotation.clone();
      rig.body.position.set(0, 0, 0); rig.body.rotation.set(0, 0, 0);
      if (headBone) headBone.scale.set(1, 1, 1);
      rig.root.updateMatrixWorld(true);
      var rInv = new THREE.Quaternion(); rig.root.getWorldQuaternion(rInv).invert();
      var rtQ = new THREE.Quaternion(); if (headBone) headBone.getWorldQuaternion(rtQ);
      rtQ.premultiply(rInv); var restHeadInv = rtQ.clone().invert();
      rig.body.position.copy(sbP); rig.body.rotation.copy(sbR);
      for (var bk2 in saved) rig.shortBones[bk2].quaternion.copy(saved[bk2]);
      rig.root.updateMatrixWorld(true);

      var _p = new THREE.Vector3(), _q2 = new THREE.Quaternion(), _ri = new THREE.Quaternion();
      this._syncHead = function () {
        if (!headBone) return;
        headBone.scale.set(1, 1, 1);
        if (neckBone) neckBone.scale.set(1, 1, 1);
        rig.root.updateMatrixWorld(true);
        headBone.getWorldPosition(_p);
        headBone.getWorldQuaternion(_q2);
        headBone.scale.setScalar(0.001);
        rig.root.updateMatrixWorld(true);
        rig.root.worldToLocal(_p);
        rig.root.getWorldQuaternion(_ri).invert();
        _q2.premultiply(_ri).multiply(restHeadInv);
        holder.position.copy(_p); holder.quaternion.copy(_q2);
      };
      this._syncHead();
      this._refreshHairTuck();

      // Re-attach any already-equipped headwear/glasses onto the new custom pupil head
      for (var entry of this.equippedItems.values()) {
        if (entry.cfg.slot === 'headwear' || entry.cfg.slot === 'glasses') {
          this._rebuildEquippedItem(entry);
        }
      }
      return true;
    }

    _refreshHairTuck() {
      var THREE = getTHREE();
      var mode = 'none';
      for (var e of this.equippedItems.values()) {
        var tk = e.cfg && e.cfg.tuck;
        if (tk === 'wig' || tk === 'helmet') { mode = tk; break; }
        if (tk === 'hat') mode = 'hat';
        else if (tk === 'band' && mode === 'none') mode = 'band';
      }
      var H = (this.rigInfo && this.rigInfo.height) || this.opts.targetHeight || 1.65;
      var kS = H / 1.65;
      if (this._pupilHeadModel && this._pupilPivot && this._headFit) {
        if (this.rigInfo && this.rigInfo.inner) {
          // Collapse native Default Head/hair vertices (>1.232m) inside chest so headBone.scale(0.001) never leaves a dark neck ring!
          this.rigInfo.inner.traverse(function (bo) {
            if (!bo.isMesh || !bo.geometry || !bo.geometry.userData._origPos || !bo.userData._restToRoot) return;
            var bOrig = bo.geometry.userData._origPos, bAttr = bo.geometry.attributes.position, bArr = bAttr.array;
            var toR = bo.userData._restToRoot, toBL = new THREE.Matrix4().copy(toR).invert();
            var bv = new THREE.Vector3(), sink = new THREE.Vector3(0, 1.15 * kS, -0.01 * kS);
            for (var bi = 0; bi < bAttr.count; bi++) {
              var bix = bi * 3;
              bv.set(bOrig[bix], bOrig[bix + 1], bOrig[bix + 2]).applyMatrix4(toR);
              if (bv.y > 1.232 * kS) {
                bv.copy(sink).applyMatrix4(toBL);
                bArr[bix] = bv.x; bArr[bix + 1] = bv.y; bArr[bix + 2] = bv.z;
              } else {
                bArr[bix] = bOrig[bix]; bArr[bix + 1] = bOrig[bix + 1]; bArr[bix + 2] = bOrig[bix + 2];
              }
            }
            bAttr.needsUpdate = true;
          });
        }
        var hf = this._headFit;
        var invP = new THREE.Matrix4().copy(this._pupilPivot.matrixWorld).invert();
        this._pupilHeadModel.traverse(function (o) {
          if (!o.isMesh || !o.geometry || !o.geometry.userData._origPos) return;
          var orig = o.geometry.userData._origPos;
          var attr = o.geometry.attributes.position;
          var arr = attr.array;
          if (mode === 'none') {
            arr.set(orig);
            attr.needsUpdate = true;
            return;
          }
          var toPiv = new THREE.Matrix4().multiplyMatrices(invP, o.matrixWorld);
          var toLoc = new THREE.Matrix4().copy(toPiv).invert();
          var v = new THREE.Vector3(), dv = new THREE.Vector3(), domeCenter = new THREE.Vector3(0, 0.174 * kS, -0.012 * kS);
          var domeR = 0.140 * kS;
          for (var i = 0; i < attr.count; i++) {
            var ix = i * 3;
            v.set(orig[ix], orig[ix + 1], orig[ix + 2]).applyMatrix4(toPiv);
            var wy = 1 - smoothstep(0.180 * kS, 0.214 * kS, v.y);
            var wz = smoothstep(0.042 * kS, 0.105 * kS, v.z);
            var wx = 1 - smoothstep(0.136 * kS, 0.174 * kS, Math.abs(v.x));
            var faceKeep = (v.y >= -0.072 * kS) ? (wy * wz * wx) : 0;
            var neckKeep = (v.y < 0.012 * kS && Math.abs(v.x) < 0.068 * kS && v.z > -0.082 * kS && v.z < 0.068 * kS) ? 1 : 0;
            var tuckScale = 1 - Math.max(faceKeep, neckKeep);
            if (tuckScale > 0.001) {
              if (mode === 'wig' || mode === 'helmet') {
                dv.copy(v).sub(domeCenter);
                var lenW = dv.length();
                if (lenW > 0.001) {
                  var capW = Math.min(lenW, domeR * 0.90);
                  dv.multiplyScalar(capW / lenW).add(domeCenter);
                  v.lerp(dv, 0.88 * tuckScale);
                }
              } else if (mode === 'hat') {
                // Smooth inner-dome hair tuck above tilted (-8°) hairline rim (tucks tall buns/afros cleanly; keeps lower braids intact!)
                var yRim = 0.194 * kS + 0.14 * (v.z + 0.010 * kS);
                var wRim = smoothstep(0, 0.042 * kS, v.y - yRim);
                var wBack = smoothstep(0.142 * kS, 0.178 * kS, v.y) * (1 - smoothstep(-0.135 * kS, -0.085 * kS, v.z)) * 0.78;
                var wHat = Math.max(wRim, wBack) * tuckScale;
                if (wHat > 0.001) {
                  dv.copy(v).sub(domeCenter);
                  var lenH = dv.length();
                  if (lenH > domeR) {
                    dv.multiplyScalar(domeR / lenH).add(domeCenter);
                    v.lerp(dv, 0.88 * wHat);
                  } else {
                    v.lerp(domeCenter, 0.22 * wHat);
                  }
                }
              } else if (mode === 'band') {
                var dyB = Math.abs(v.y - 0.228 * kS);
                if (dyB < 0.044 * kS) {
                  var wb = (1 - smoothstep(0.014 * kS, 0.044 * kS, dyB)) * tuckScale;
                  v.x *= (1 - 0.26 * wb);
                  v.z = -0.010 * kS + (v.z + 0.010 * kS) * (1 - 0.22 * wb);
                }
              }
              v.applyMatrix4(toLoc);
              arr[ix] = v.x; arr[ix + 1] = v.y; arr[ix + 2] = v.z;
            } else {
              arr[ix] = orig[ix]; arr[ix + 1] = orig[ix + 1]; arr[ix + 2] = orig[ix + 2];
            }
          }
          attr.needsUpdate = true;
        });
      } else if (this.rigInfo && !this.rigInfo.isAutoRigged && this.rigInfo.inner) {
        this.rigInfo.inner.traverse(function (o) {
          if (!o.isMesh || !o.geometry || !o.geometry.userData._origPos || !o.userData._restToRoot) return;
          var orig = o.geometry.userData._origPos;
          var attr = o.geometry.attributes.position;
          var arr = attr.array;
          if (mode === 'none') {
            arr.set(orig);
            attr.needsUpdate = true;
            return;
          }
          var toRoot = o.userData._restToRoot;
          var toLoc = new THREE.Matrix4().copy(toRoot).invert();
          var v = new THREE.Vector3(), core = new THREE.Vector3(0, 1.38 * kS, 0.02 * kS);
          for (var i = 0; i < attr.count; i++) {
            var ix = i * 3;
            v.set(orig[ix], orig[ix + 1], orig[ix + 2]).applyMatrix4(toRoot);
            if (v.y > 1.245 * kS) {
              var inNeck = v.y < 1.31 * kS && Math.abs(v.x) < 0.095 * kS && v.z > -0.055 * kS;
              var inFace = v.y < 1.455 * kS && v.z > 0.055 * kS && Math.abs(v.x) < 0.145 * kS;
              if (!inNeck && !inFace) {
                if (mode === 'wig' || mode === 'helmet') {
                  v.lerp(core, 0.78);
                } else if (mode === 'hat') {
                  if (v.y > 1.42 * kS) {
                    var wh = clamp((v.y - 1.42 * kS) / (0.08 * kS), 0, 1);
                    v.x *= (1 - 0.42 * wh);
                    v.z *= (1 - 0.40 * wh);
                    v.y -= (v.y - 1.42 * kS) * 0.58 * wh;
                  } else if (v.z < -0.065 * kS && v.y > 1.32 * kS) {
                    v.lerp(core, 0.72);
                  }
                } else if (mode === 'band') {
                  var dyNB = Math.abs(v.y - 1.475 * kS);
                  if (dyNB < 0.036 * kS) {
                    var wnb = 1 - smoothstep(0.012 * kS, 0.036 * kS, dyNB);
                    v.x *= (1 - 0.20 * wnb);
                    v.z *= (1 - 0.18 * wnb);
                  }
                }
                v.applyMatrix4(toLoc);
                arr[ix] = v.x; arr[ix + 1] = v.y; arr[ix + 2] = v.z;
                continue;
              }
            }
            arr[ix] = orig[ix]; arr[ix + 1] = orig[ix + 1]; arr[ix + 2] = orig[ix + 2];
          }
          attr.needsUpdate = true;
        });
      }
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
      this._itemSyncs.clear();
      this._pupilHead = null;
      this._pupilPivot = null;
      this._pupilHeadModel = null;
      this._headFit = null;
      this._syncHead = null;

      if (this.characterObj) {
        this.rootGroup.remove(this.characterObj);
      }
      this.mixer = null;
      this.actions = [];

      var rig = autoRigHumanoidScene(gltf.scene, this.opts.targetHeight, this.opts.palette);
      this.rigInfo = rig;
      this.rootGroup.add(rig.root);
      this.characterObj = rig.root;
      this._mixPoseState = 'idle';
      this._mixPoseT = 0;
      this._mixPoseP = null;

      if (rig.isAutoRigged) {
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
      } else {
        this.actions = ['Idle', 'Wave', 'Cheer', 'Run', 'Kick'].map(function (nm) { return { name: nm, action: null }; });
        this._stepMixamoPose(0.016);
      }

      for (var itemEntry of this.equippedItems.values()) {
        this._rebuildEquippedItem(itemEntry);
      }

      return {
        bones: rig.bones.map(function (b) { return b.name; }),
        isAutoRigged: rig.isAutoRigged,
        animations: this.actions.map(function (a) { return a.name; })
      };
    }

    _stepMixamoPose(dt) {
      var THREE = getTHREE();
      var rig = this.rigInfo;
      if (!rig || rig.isAutoRigged || !rig.shortBones || !rig.body) return;
      this._mixPoseT += dt;
      var t = this._mixPoseT, st = this._mixPoseState;
      var tgt = {
        thighL: 0, thighR: 0, kneeL: 0.06, kneeR: 0.06, footL: 0, footR: 0,
        armL: 0, armR: 0, liftL: 0.09, liftR: 0.09, elbowL: -0.24, elbowR: -0.24,
        lean: 0, twist: 0, headP: 0, headY: 0, headR: 0, bob: 0, bodyR: 0, jump: 0
      };
      if (this._freezePose) {
        // Neutral standing mannequin pose for precision gizmo fitting!
      } else if (st === 'wave') {
        tgt.headY = 0.24; tgt.headR = -0.06; tgt.lean = -0.04; tgt.bodyR = -0.04;
        tgt.liftR = 2.65; tgt.elbowR = -0.35 + 0.55 * Math.sin(t * 10);
        tgt.liftL = 0.14; tgt.bob = 0.014 * Math.sin(t * 6);
      } else if (st === 'cheer') {
        var j = Math.abs(Math.sin(t * 5.2));
        tgt.jump = 0.28 * j; tgt.liftL = 2.7 + 0.18 * Math.sin(t * 10.4); tgt.liftR = 2.7 + 0.18 * Math.sin(t * 10.4 + 1);
        tgt.elbowL = tgt.elbowR = -0.22; tgt.headP = -0.20; tgt.lean = -0.08;
        tgt.thighL = tgt.thighR = -0.22 * (1 - j); tgt.kneeL = tgt.kneeR = 0.15 + 0.65 * (1 - j);
      } else if (st === 'run') {
        var p = t * 9.5, s = Math.sin(p), c = Math.cos(p);
        tgt.thighL = -0.82 * s; tgt.thighR = 0.82 * s;
        tgt.kneeL = 0.2 + 1.1 * Math.max(0, -Math.sin(p - 0.9)); tgt.kneeR = 0.2 + 1.1 * Math.max(0, Math.sin(p - 0.9));
        tgt.armL = 0.85 * s; tgt.armR = -0.85 * s; tgt.elbowL = tgt.elbowR = -1.2;
        tgt.lean = 0.18; tgt.twist = 0.16 * s; tgt.bob = 0.06 * Math.abs(c) - 0.02;
      } else if (st === 'kick') {
        var u = (t % 1.1) / 1.1, sw = u < 0.45 ? -u / 0.45 : -1 + (u - 0.45) / 0.55 * 2.4;
        tgt.thighR = clamp(sw, -1, 1.4) * -1; tgt.kneeR = u < 0.45 ? 1.0 * (u / 0.45) : 1.0 * (1 - (u - 0.45) / 0.55);
        tgt.lean = u < 0.45 ? -0.08 : 0.2; tgt.liftL = 0.85; tgt.liftR = 0.6;
      } else {
        tgt.lean = 0.025 * Math.sin(t * 2.0); tgt.headY = 0.22 * Math.sin(t * 0.7);
        tgt.headP = 0.04 * Math.sin(t * 1.3); tgt.armL = 0.04 * Math.sin(t * 2.0); tgt.armR = -0.04 * Math.sin(t * 2.0);
        tgt.bodyR = 0.02 * Math.sin(t * 1.1); tgt.bob = 0.012 * Math.sin(t * 3.2);
      }
      if (!this._mixPoseP) {
        this._mixPoseP = Object.assign({}, tgt);
      } else {
        var f = 1 - Math.exp(-dt * 12);
        for (var k in tgt) this._mixPoseP[k] += (tgt[k] - this._mixPoseP[k]) * f;
      }
      var P = this._mixPoseP;
      rig.body.position.set(0, P.bob + P.jump, 0);
      rig.body.rotation.set(0, 0, P.bodyR);
      rig.root.updateMatrixWorld(true);
      for (var bk in rig.restQ) rig.shortBones[bk].quaternion.copy(rig.restQ[bk]);

      var L = new THREE.Vector3(1, 0, 0), U = new THREE.Vector3(0, 1, 0), F = new THREE.Vector3(0, 0, 1);
      var q = new THREE.Quaternion(), pw = new THREE.Quaternion(), pwi = new THREE.Quaternion(), rq = new THREE.Quaternion(), ax = new THREE.Vector3();
      function rot(name, axis, ang) {
        if (!ang) return;
        var b = rig.shortBones[name]; if (!b || !b.parent) return;
        rig.body.getWorldQuaternion(q); ax.copy(axis).applyQuaternion(q); rq.setFromAxisAngle(ax, ang);
        b.parent.getWorldQuaternion(pw); pwi.copy(pw).invert();
        b.quaternion.premultiply(pwi.multiply(rq).multiply(pw));
      }
      rot('Spine', L, P.lean * 0.5); rot('Spine1', L, P.lean * 0.3); rot('Spine1', U, P.twist); rot('Spine2', L, P.lean * 0.2);
      rot('Neck', L, P.headP * 0.4); rot('Head', L, P.headP * 0.6 - P.lean * 0.4); rot('Head', U, P.headY); rot('Head', F, P.headR);
      rot('LeftArm', F, -(rig.outL - P.liftL)); rot('RightArm', F, (rig.outR - P.liftR));
      rot('LeftArm', L, -P.armL); rot('RightArm', L, -P.armR);
      rot('LeftForeArm', L, P.elbowL); rot('RightForeArm', L, P.elbowR);
      rot('LeftUpLeg', L, P.thighL); rot('RightUpLeg', L, P.thighR);
      rot('LeftLeg', L, P.kneeL); rot('RightLeg', L, P.kneeR);
      rot('LeftFoot', L, P.footL - (P.kneeL - 0.06) * 0.35 - P.thighL * 0.3);
      rot('RightFoot', L, P.footR - (P.kneeR - 0.06) * 0.35 - P.thighR * 0.3);
    }

    _makeMixBoneTracker(bone, localOff, relaxedArms) {
      var THREE = getTHREE();
      var rig = this.rigInfo;
      if (!bone || !rig) return function () {};
      var saved = {};
      for (var k in rig.restQ) { saved[k] = rig.shortBones[k].quaternion.clone(); rig.shortBones[k].quaternion.copy(rig.restQ[k]); }
      var sbP = rig.body.position.clone(), sbR = rig.body.rotation.clone();
      rig.body.position.set(0, 0, 0); rig.body.rotation.set(0, 0, 0);
      if (relaxedArms) {
        // Capture hand/forearm reference in natural standing arms-down pose so props stand upright!
        rig.root.updateMatrixWorld(true);
        var F = new THREE.Vector3(0, 0, 1), L = new THREE.Vector3(1, 0, 0);
        var q = new THREE.Quaternion(), pw = new THREE.Quaternion(), pwi = new THREE.Quaternion(), rq = new THREE.Quaternion(), ax = new THREE.Vector3();
        var rBone = function (nm, axis, ang) {
          var b = rig.shortBones[nm]; if (!b || !b.parent) return;
          rig.body.getWorldQuaternion(q); ax.copy(axis).applyQuaternion(q); rq.setFromAxisAngle(ax, ang);
          b.parent.getWorldQuaternion(pw); pwi.copy(pw).invert();
          b.quaternion.premultiply(pwi.multiply(rq).multiply(pw));
        };
        rBone('LeftArm', F, -(rig.outL - 0.09));
        rBone('RightArm', F, (rig.outR - 0.09));
        rBone('LeftForeArm', L, -0.24);
        rBone('RightForeArm', L, -0.24);
      }
      rig.root.updateMatrixWorld(true);
      var rInv = new THREE.Quaternion(); rig.root.getWorldQuaternion(rInv).invert();
      var bR = new THREE.Quaternion(); bone.getWorldQuaternion(bR); bR.premultiply(rInv);
      var bRInv = bR.clone().invert();
      rig.body.position.copy(sbP); rig.body.rotation.copy(sbR);
      for (var k2 in saved) rig.shortBones[k2].quaternion.copy(saved[k2]);
      rig.root.updateMatrixWorld(true);
      var p = new THREE.Vector3(), q2 = new THREE.Quaternion(), ri = new THREE.Quaternion(), o = new THREE.Vector3();
      return function (wrap) {
        bone.getWorldPosition(p); rig.root.worldToLocal(p);
        bone.getWorldQuaternion(q2); rig.root.getWorldQuaternion(ri).invert();
        q2.premultiply(ri).multiply(bRInv);
        o.copy(localOff).applyQuaternion(q2);
        wrap.position.copy(p).add(o); wrap.quaternion.copy(q2);
      };
    }

    _makePalmGripTracker(localOff, kS) {
      var THREE = getTHREE();
      var rig = this.rigInfo;
      var handBone = rig && rig.shortBones && (rig.shortBones.LeftHand || rig.shortBones.RightHand);
      if (!handBone || !rig) return function () {};
      var mid2 = rig.shortBones.LeftHandMiddle2 || rig.shortBones.LeftHandMiddle1 || null;
      var thb2 = rig.shortBones.LeftHandThumb2  || rig.shortBones.LeftHandThumb1  || null;
      var baseTrack = this._makeMixBoneTracker(handBone, new THREE.Vector3(0, 0, 0), true);
      var pm = new THREE.Vector3(), pt = new THREE.Vector3(), o = new THREE.Vector3();
      var fbOff = new THREE.Vector3(0.028 * kS, -0.052 * kS, 0.032 * kS).add(localOff);
      var fbTrack = this._makeMixBoneTracker(handBone, fbOff, true);
      if (!mid2 || !thb2) return fbTrack;
      return function (wrap) {
        baseTrack(wrap);
        mid2.getWorldPosition(pm);
        thb2.getWorldPosition(pt);
        pm.add(pt).multiplyScalar(0.5);
        rig.root.worldToLocal(pm);
        o.copy(localOff).applyQuaternion(wrap.quaternion);
        wrap.position.copy(pm).add(o);
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
      this._itemSyncs.clear();
      this._syncHead = null;
      var model = gltf.scene;
      applyItemFallbackMaterial(model, presetId || 'crown');
      normalizeModelToHeight(model, 1.05);
      model.position.y += 0.28;
      this.rootGroup.add(model);
      this.characterObj = model;
      return { bones: [], animations: [] };
    }

    _buildNormalizedItemWrapper(itemCfg, rawScene) {
      var THREE = getTHREE();
      var mesh = rawScene.clone(true);
      applyItemFallbackMaterial(mesh, itemCfg.id);
      mesh.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = true; o.receiveShadow = false;
          if (o.material) o.material.metalness = Math.min(o.material.metalness || 0, 0.42);
        }
      });

      var H = (this.rigInfo && this.rigInfo.height) || this.opts.targetHeight || 1.65;
      var kS = H / 1.65;

      // 1. Measure raw unrotated max dimension so uniform scaling is 100% rotation-invariant (no fitAxis!)
      mesh.updateMatrixWorld(true);
      var rawBox = new THREE.Box3().setFromObject(mesh);
      var rawSz = rawBox.getSize(new THREE.Vector3());
      var maxRawDim = Math.max(rawSz.x, rawSz.y, rawSz.z, 0.001);

      var orientG = new THREE.Group();
      orientG.add(mesh);
      var pr = itemCfg.preRot || [0, 0, 0];
      orientG.rotation.set(pr[0] || 0, pr[1] || 0, pr[2] || 0);

      // 2. Apply strictly UNIFORM scalar scale (scale.setScalar) — never stretch or squash any axis!
      // Both Default Girl (hatW=0.343m) and our 70 calibrated Pupil Heads (hatW=0.342m) share the exact 0.95x skull ratio vs Default Boy (hatW=0.366m).
      var targetScale = (itemCfg.scale || 0.30) * kS;
      if ((itemCfg.slot === 'headwear' || itemCfg.slot === 'glasses') && itemCfg.headMode !== 'clip' && (this._pupilPivot || this._isGirl)) {
        targetScale *= 0.95;
      }
      orientG.scale.setScalar(targetScale / maxRawDim);
      orientG.updateMatrixWorld(true);

      // 3. Shift [ax, ay, az] anchor inside oriented box to (0, 0, 0), unless anchor === null (custom Blender pivot!)
      if (itemCfg.anchor !== null) {
        var box2 = new THREE.Box3().setFromObject(orientG);
        var anc = itemCfg.anchor || [0.5, 0.5, 0.5];
        var ax = box2.min.x + (box2.max.x - box2.min.x) * anc[0];
        var ay = box2.min.y + (box2.max.y - box2.min.y) * anc[1];
        var az = box2.min.z + (box2.max.z - box2.min.z) * anc[2];
        orientG.position.set(-ax, -ay, -az);
      }

      // 4. Unified 1:1 Gizmo Item Node: offset [dx,dy,dz], rotation [rx,ry,rz], userScale (uniform scalar)
      var itemNode = new THREE.Group();
      itemNode.name = 'eaa-gizmo-target-' + itemCfg.id;
      itemNode.add(orientG);
      var off = itemCfg.offset || [0, 0, 0];
      itemNode.position.set((off[0] || 0) * kS, (off[1] || 0) * kS, (off[2] || 0) * kS);
      var rot = itemCfg.rotation || [0, 0, 0];
      itemNode.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
      itemNode.scale.setScalar(itemCfg.userScale != null ? itemCfg.userScale : 1);

      var wrapper = new THREE.Group();
      wrapper.name = 'eaa-item-' + itemCfg.id;
      wrapper.userData.itemNode = itemNode;
      wrapper.userData.kS = kS;
      wrapper.userData.itemId = itemCfg.id;
      wrapper.add(itemNode);
      return wrapper;
    }

    _rebuildEquippedItem(entry) {
      if (!entry || !entry.rawScene) return;
      if (entry.wrapper && entry.wrapper.parent) entry.wrapper.parent.remove(entry.wrapper);
      entry.wrapper = this._buildNormalizedItemWrapper(entry.cfg, entry.rawScene);
      this._attachItemObject(entry.cfg, entry.wrapper);
    }

    async equipItemFromSource(itemCfg, src) {
      var gltf = typeof src === 'string' ? await this.loadGlbFromUrl(src) : await this.loadGlbFromFile(src);
      this.unequipItem(itemCfg.id);
      var rawScene = gltf.scene;
      var wrapper = this._buildNormalizedItemWrapper(itemCfg, rawScene);
      this.equippedItems.set(itemCfg.id, { cfg: Object.assign({}, itemCfg), rawScene: rawScene, wrapper: wrapper });
      this._refreshHairTuck();
      this._attachItemObject(itemCfg, wrapper);
      return wrapper;
    }

    _attachItemObject(cfg, wrapper) {
      var THREE = getTHREE();
      if (wrapper.parent) wrapper.parent.remove(wrapper);
      this._itemSyncs.delete(cfg.id);

      var rig = this.rigInfo;
      if (rig && !rig.isAutoRigged && rig.shortBones) {
        var H = rig.height || this.opts.targetHeight || 1.65;
        var kS = H / 1.65;
        var slot = cfg.slot || '';

        if (slot === 'headwear' || slot === 'glasses') {
          var hm = cfg.headMode || 'hat';
          var isPupil = !!(this._pupilPivot && this._headFit);
          // Unified 1:1 Default-Skull Socket Coordinates (identical skull origin for Default Heads & all 70 Pupil Heads!)
          var useGirlSkull = isPupil || this._isGirl;
          var bx = 0, by = 0.208, bz = -0.010;
          if (slot === 'headwear') {
            if (hm === 'clip') {
              var nco = cfg.clipOffset || [0.125, 0.78, 0.11];
              bx = nco[0]; by = useGirlSkull ? 0.245 : 0.260; bz = nco[2];
            } else if (hm === 'crown') {
              by = isPupil ? (this._headFit.crownY / kS) : (useGirlSkull ? 0.302 : 0.322); bz = 0.006;
            } else if (hm === 'band') {
              by = useGirlSkull ? 0.228 : 0.232; bz = 0;
            } else if (hm === 'helmet') {
              by = useGirlSkull ? 0.155 : 0.165; bz = 0.010;
            } else if (hm === 'wig') {
              by = useGirlSkull ? 0.182 : 0.192; bz = -0.012;
            } else {
              by = useGirlSkull ? 0.208 : 0.215; bz = -0.010;
            }
          } else {
            if (hm === 'band') {
              by = 0.118; bz = -0.004;
            } else {
              by = cfg.maskMode === 'lower' ? 0.056 : 0.118;
              bz = isPupil ? 0.154 : 0.158;
            }
          }
          if (isPupil) {
            wrapper.position.set(bx * kS, by * kS, bz * kS);
            wrapper.quaternion.identity();
            this._pupilPivot.add(wrapper);
            return;
          }
          rig.root.add(wrapper);
          var fnH = this._makeMixBoneTracker(rig.shortBones.Head, new THREE.Vector3(bx * kS, by * kS, bz * kS), false);
          this._itemSyncs.set(cfg.id, function () { fnH(wrapper); });
          fnH(wrapper);
          return;
        }

        if (slot === 'back' || slot === 'neck') {
          rig.root.add(wrapper);
          var off = cfg.socketOffset || (slot === 'back' ? [0, 0.01, -0.088] : [0, 0.098, 0.092]);
          var zGirl = (slot === 'neck' && cfg.neckMode === 'medal' && this._isGirl) ? 0.014 : 0;
          var fnB = this._makeMixBoneTracker(rig.shortBones.Spine2 || rig.shortBones.Spine1, new THREE.Vector3(off[0] * kS, off[1] * kS, (off[2] + zGirl) * kS), false);
          this._itemSyncs.set(cfg.id, function () { fnB(wrapper); });
          fnB(wrapper);
          return;
        }

        if (slot === 'hand_r' || slot === 'hand_l') {
          rig.root.add(wrapper);
          var hMode = cfg.handMode || 'hand';
          if (hMode === 'hand') {
            var hOff0 = cfg.socketOffset || [0, 0, 0];
            var fnP = this._makePalmGripTracker(new THREE.Vector3(hOff0[0] * kS, hOff0[1] * kS, hOff0[2] * kS), kS);
            this._itemSyncs.set(cfg.id, function () { fnP(wrapper); });
            fnP(wrapper);
            return;
          }
          var targetBone = hMode === 'chest'
            ? (rig.shortBones.Spine2 || rig.shortBones.Spine1)
            : (rig.shortBones.LeftForeArm || rig.shortBones.LeftHand);
          var hOff = cfg.socketOffset || [0.048, -0.02, 0.042];
          var zChestGirl = (hMode === 'chest' && this._isGirl) ? 0.014 : 0;
          var fnR = this._makeMixBoneTracker(targetBone, new THREE.Vector3(hOff[0] * kS, hOff[1] * kS, (hOff[2] + zChestGirl) * kS), hMode !== 'chest');
          this._itemSyncs.set(cfg.id, function () { fnR(wrapper); });
          fnR(wrapper);
          return;
        }

        if (slot === 'pet') {
          rig.root.add(wrapper);
          var pOff = cfg.socketOffset || [0.42, 0.015, 0.18];
          var baseY = (cfg.hoverY != null ? cfg.hoverY : pOff[1]) * kS;
          var isFlying = (cfg.hoverY || 0) > 0.3;
          wrapper.position.set(pOff[0] * kS, baseY, pOff[2] * kS);
          this._itemSyncs.set(cfg.id, function (t) {
            wrapper.position.y = baseY + (isFlying ? Math.sin(t * 3.6) * 0.045 : Math.abs(Math.sin(t * 2.6)) * 0.015);
            wrapper.rotation.y = Math.sin(t * 1.4) * 0.18;
          });
          return;
        }
      }

      var bone = this.characterObj ? findBone(this.characterObj, cfg.boneCandidates) : null;
      if (bone) {
        var bOff = cfg.socketOffset || [0, 0, 0];
        wrapper.position.set(bOff[0], bOff[1], bOff[2]);
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
      this._rebuildEquippedItem(entry);
      this._refreshHairTuck();
    }

    unequipItem(itemId) {
      var prev = this.equippedItems.get(itemId);
      if (prev && prev.wrapper && prev.wrapper.parent) {
        prev.wrapper.parent.remove(prev.wrapper);
      }
      this.equippedItems.delete(itemId);
      this._itemSyncs.delete(itemId);
      this._refreshHairTuck();
    }

    clearItems() {
      for (var id of Array.from(this.equippedItems.keys())) {
        var prev = this.equippedItems.get(id);
        if (prev && prev.wrapper && prev.wrapper.parent) prev.wrapper.parent.remove(prev.wrapper);
      }
      this.equippedItems.clear();
      this._itemSyncs.clear();
      this._refreshHairTuck();
    }

    playAnimation(indexOrName) {
      if (this.rigInfo && !this.rigInfo.isAutoRigged) {
        var nm = typeof indexOrName === 'number'
          ? ((this.actions[indexOrName] && this.actions[indexOrName].name) || 'idle')
          : String(indexOrName || 'idle');
        var lo = nm.toLowerCase();
        this._mixPoseState = lo.indexOf('wave') >= 0 ? 'wave'
          : lo.indexOf('cheer') >= 0 ? 'cheer'
          : lo.indexOf('run') >= 0 ? 'run'
          : lo.indexOf('kick') >= 0 ? 'kick'
          : 'idle';
        return;
      }
      if (!this.actions.length) return;
      this.actions.forEach(function (a) { if (a.action) a.action.stop(); });
      var picked = typeof indexOrName === 'number'
        ? this.actions[indexOrName]
        : this.actions.find(function (a) { return a.name.toLowerCase().indexOf(String(indexOrName).toLowerCase()) >= 0; });
      if (!picked) picked = this.actions[0];
      if (picked && picked.action) picked.action.reset().play();
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
      var elapsed = this.clock.elapsedTime;
      if (this.mixer) this.mixer.update(dt);
      else if (this.rigInfo && !this.rigInfo.isAutoRigged) this._stepMixamoPose(dt);
      if (this._syncHead) this._syncHead(elapsed);
      if (this._itemSyncs.size && this.rigInfo) {
        this.rigInfo.root.updateMatrixWorld(true);
        this._itemSyncs.forEach(function (fn) { fn(elapsed); });
      }
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
