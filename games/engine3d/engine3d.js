/* games/engine3d/engine3d.js
 * Commercial-grade Stylized 3D Engine layer for English Adventure Academy Smart Screen & Mobile Games.
 * Powers: Messenger-by-Abeto / Bruno-Simon-Folio warm shaders (Gerstner ocean + coastal SDF shore foam +
 * sun sparkles, GPU wind gusts synced to gameplay wind, warm sky atmosphere, toon-PBR ramp + contact shadows),
 * pmndrs/postprocessing single-pass EffectComposer (ACESFilmic + selective HDR mipmap Bloom + Split-Screen Duel),
 * Rapier3D 60Hz deterministic rigid-body destruction physics with InstancedMesh matrix batching,
 * three-mesh-bvh fast raycasting, Yuka steering AI, and Howler/WebAudio tactile soundscape with independent Music/SFX mute.
 */
(function (root) {
  'use strict';

  var V = root.E3D_VENDOR || {};
  var T3 = root.THREE;
  var PP = V.POSTPROCESSING || {};
  var RAPIER = root.RAPIER || V.RAPIER;
  var YUKA = root.YUKA || V.YUKA;
  var Howl = root.Howl || V.Howl;
  var Howler = root.Howler || V.Howler;

  var E3D = root.E3D = {
    version: '1.0.0',
    wind: new T3.Vector3(0, 0, 0), // x = crosswind (+right/-left), z = head/tailwind
    uTime: { value: 0 },
    uWind: { value: new T3.Vector2(0.35, 0.1) },
    uSunDir: { value: new T3.Vector3(-0.42, 0.74, 0.52).normalize() },
    rapierReady: false,
    musicMuted: false,
    sfxMuted: false
  };

  /* =========================================================================
   * 1. WAVE MATH (Shared Exact Formula Between GPU Ocean Vertex Shader & JS Buoyancy!)
   * ========================================================================= */
  E3D.sampleWaveHeight = function (x, z, t) {
    var w1 = Math.sin(x * 0.28 + z * 0.19 + t * 1.65) * 0.16;
    var w2 = Math.cos(x * 0.17 - z * 0.31 + t * 1.22) * 0.11;
    var w3 = Math.sin((x + z) * 0.52 - t * 2.15) * 0.045;
    return w1 + w2 + w3;
  };

  E3D.sampleWaveNormal = function (x, z, t, outNormal) {
    var eps = 0.35;
    var hL = E3D.sampleWaveHeight(x - eps, z, t);
    var hR = E3D.sampleWaveHeight(x + eps, z, t);
    var hD = E3D.sampleWaveHeight(x, z - eps, t);
    var hU = E3D.sampleWaveHeight(x, z + eps, t);
    outNormal = outNormal || new T3.Vector3();
    return outNormal.set(hL - hR, 2.0 * eps, hD - hU).normalize();
  };

  /* =========================================================================
   * 2. MESSENGER × BRUNO SIMON STYLIZED SHADERS
   * ========================================================================= */
  var MAX_FOAM_COLLIDERS = 24;
  var _foamColliders = [];
  for (var _fi = 0; _fi < MAX_FOAM_COLLIDERS; _fi++) {
    _foamColliders.push(new T3.Vector4(9999, 9999, 0, 0)); // x, z, radius, foamStrength
  }

  E3D.Shaders = {
    foamColliders: _foamColliders,

    setFoamCollider: function (idx, x, z, radius, strength) {
      if (idx < 0 || idx >= MAX_FOAM_COLLIDERS) return;
      _foamColliders[idx].set(x, z, radius, strength != null ? strength : 1.0);
    },

    clearFoamColliders: function (fromIdx) {
      for (var i = fromIdx || 0; i < MAX_FOAM_COLLIDERS; i++) {
        _foamColliders[i].set(9999, 9999, 0, 0);
      }
    },

    createSkyDome: function (opts) {
      opts = opts || {};
      var mat = new T3.ShaderMaterial({
        side: T3.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uZenith:  { value: new T3.Color(opts.zenith  || 0x46a6ff) },
          uMid:     { value: new T3.Color(opts.mid     || 0xa6e3ff) },
          uHorizon: { value: new T3.Color(opts.horizon || 0xfff1d6) },
          uSunCol:  { value: new T3.Color(0xfff9e6) },
          uSunDir:  E3D.uSunDir
        },
        vertexShader: [
          'varying vec3 vWorldDir;',
          'void main() {',
          '  vWorldDir = position;',
          '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
          '}'
        ].join('\n'),
        fragmentShader: [
          'uniform vec3 uZenith;',
          'uniform vec3 uMid;',
          'uniform vec3 uHorizon;',
          'uniform vec3 uSunCol;',
          'uniform vec3 uSunDir;',
          'varying vec3 vWorldDir;',
          'void main() {',
          '  vec3 d = normalize(vWorldDir);',
          '  float h = clamp(d.y, -0.15, 1.0);',
          '  vec3 col = mix(uHorizon, uMid, smoothstep(-0.04, 0.24, h));',
          '  col = mix(col, uZenith, smoothstep(0.20, 0.78, h));',
          '  // Warm Messenger horizon rim glow',
          '  float rim = exp(-abs(d.y) * 9.5);',
          '  col += vec3(0.14, 0.09, 0.03) * rim;',
          '  // Stylized sun disc + soft halo (HDR > 1.0 for subtle bloom)',
          '  float sunAmt = max(0.0, dot(d, normalize(uSunDir)));',
          '  col += uSunCol * pow(sunAmt, 14.0) * 0.28;',
          '  col += uSunCol * smoothstep(0.9965, 0.9992, sunAmt) * 1.35;',
          '  gl_FragColor = vec4(col, 1.0);',
          '}'
        ].join('\n')
      });
      var mesh = new T3.Mesh(new T3.SphereGeometry(opts.radius || 280, 32, 20), mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = -10;
      return mesh;
    },

    createOcean: function (opts) {
      opts = opts || {};
      var size = opts.size || 320;
      var segs = opts.segments || 128;
      var geo = new T3.PlaneGeometry(size, size, segs, segs);
      geo.rotateX(-Math.PI / 2);

      var mat = new T3.ShaderMaterial({
        transparent: false,
        depthWrite: true,
        uniforms: {
          uTime:      E3D.uTime,
          uSunDir:    E3D.uSunDir,
          uDeep:      { value: new T3.Color(opts.deep      || 0x198fd9) },
          uMid:       { value: new T3.Color(opts.mid       || 0x36b9eb) },
          uShallow:   { value: new T3.Color(opts.shallow   || 0x74eaf7) },
          uFoam:      { value: new T3.Color(opts.foam      || 0xffffff) },
          uFogColor:  { value: new T3.Color(opts.fogColor  || 0xdaf2ff) },
          uFogNear:   { value: opts.fogNear || 85.0 },
          uFogFar:    { value: opts.fogFar  || 210.0 },
          uColliders: { value: _foamColliders }
        },
        vertexShader: [
          'uniform float uTime;',
          'varying vec3 vWPos;',
          'varying vec3 vNormalW;',
          'varying float vCamDist;',
          'float waveH(float x, float z, float t) {',
          '  float w1 = sin(x * 0.28 + z * 0.19 + t * 1.65) * 0.16;',
          '  float w2 = cos(x * 0.17 - z * 0.31 + t * 1.22) * 0.11;',
          '  float w3 = sin((x + z) * 0.52 - t * 2.15) * 0.045;',
          '  return w1 + w2 + w3;',
          '}',
          'void main() {',
          '  vec4 wp = modelMatrix * vec4(position, 1.0);',
          '  float h = waveH(wp.x, wp.z, uTime);',
          '  float hx = waveH(wp.x + 0.35, wp.z, uTime);',
          '  float hz = waveH(wp.x, wp.z + 0.35, uTime);',
          '  wp.y += h;',
          '  vWPos = wp.xyz;',
          '  vNormalW = normalize(vec3(h - hx, 0.35, h - hz));',
          '  vec4 vp = viewMatrix * wp;',
          '  vCamDist = -vp.z;',
          '  gl_Position = projectionMatrix * vp;',
          '}'
        ].join('\n'),
        fragmentShader: [
          'uniform float uTime;',
          'uniform vec3 uSunDir;',
          'uniform vec3 uDeep;',
          'uniform vec3 uMid;',
          'uniform vec3 uShallow;',
          'uniform vec3 uFoam;',
          'uniform vec3 uFogColor;',
          'uniform float uFogNear;',
          'uniform float uFogFar;',
          'uniform vec4 uColliders[' + MAX_FOAM_COLLIDERS + '];',
          'varying vec3 vWPos;',
          'varying vec3 vNormalW;',
          'varying float vCamDist;',
          '',
          '// Lightweight procedural cellular water ripple',
          'float hash21(vec2 p) {',
          '  p = fract(p * vec2(123.34, 456.21));',
          '  p += dot(p, p + 45.32);',
          '  return fract(p.x * p.y);',
          '}',
          'float vnoise(vec2 p) {',
          '  vec2 i = floor(p); vec2 f = fract(p);',
          '  f = f * f * (3.0 - 2.0 * f);',
          '  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));',
          '  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));',
          '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
          '}',
          '',
          'void main() {',
          '  // Distance to nearest island / sandbar / boat hull',
          '  float minDist = 999.0;',
          '  float shoreStrength = 0.0;',
          '  for (int i = 0; i < ' + MAX_FOAM_COLLIDERS + '; i++) {',
          '    vec4 c = uColliders[i];',
          '    if (c.z > 0.01) {',
          '      float d = length(vWPos.xz - c.xy) - c.z;',
          '      if (d < minDist) { minDist = d; shoreStrength = c.w; }',
          '    }',
          '  }',
          '',
          '  // Shallow turquoise lagoon falloff around islands',
          '  float shallowMask = (1.0 - smoothstep(-0.5, 9.5, minDist)) * clamp(shoreStrength, 0.0, 1.0);',
          '  float n1 = vnoise(vWPos.xz * 0.42 + vec2(uTime * 0.28, -uTime * 0.21));',
          '  float n2 = vnoise(vWPos.xz * 0.85 - vec2(uTime * 0.34, uTime * 0.26));',
          '  float caustics = smoothstep(0.56, 0.78, (n1 + n2) * 0.5);',
          '',
          '  vec3 waterCol = mix(uDeep, uMid, smoothstep(65.0, 12.0, vCamDist) * 0.75 + n1 * 0.22);',
          '  waterCol = mix(waterCol, uShallow, shallowMask * 0.88);',
          '  waterCol += vec3(0.09, 0.14, 0.14) * caustics * (0.35 + shallowMask * 0.65);',
          '',
          '  // Stylized Messenger animated double shore-foam rings',
          '  float waveLap = sin(minDist * 3.4 - uTime * 3.2 + n1 * 2.2);',
          '  float outerRing = smoothstep(2.6, 0.15, minDist) * step(0.32, waveLap) * step(-0.35, minDist);',
          '  float beachEdge = smoothstep(0.55, -0.15, minDist) * step(-0.55, minDist);',
          '  float openCrests = smoothstep(0.79, 0.89, (n1 * 0.55 + n2 * 0.45)) * 0.32;',
          '  float foamMask = clamp((outerRing * 0.82 + beachEdge) * shoreStrength + openCrests, 0.0, 1.0);',
          '  waterCol = mix(waterCol, uFoam, foamMask);',
          '',
          '  // Warm soft sun sheen on waves (kept smooth below bloom threshold so waves never strobe/flash!)',
          '  vec3 viewDir = normalize(cameraPosition - vWPos);',
          '  vec3 halfV = normalize(normalize(uSunDir) + viewDir);',
          '  vec3 pertN = normalize(vNormalW + vec3((n1 - 0.5) * 0.14, 0.0, (n2 - 0.5) * 0.14));',
          '  float spec = pow(max(0.0, dot(pertN, halfV)), 24.0);',
          '  float sparkle = smoothstep(0.35, 0.88, spec) * 0.28;',
          '  waterCol += vec3(1.0, 0.97, 0.88) * sparkle * (1.0 - foamMask * 0.7);',
          '',
          '  // Soft horizon atmospheric blend',
          '  float fogF = smoothstep(uFogNear, uFogFar, vCamDist);',
          '  waterCol = mix(waterCol, uFogColor, fogF);',
          '  gl_FragColor = vec4(waterCol, 1.0);',
          '}'
        ].join('\n')
      });

      var ocean = new T3.Mesh(geo, mat);
      ocean.receiveShadow = false;
      ocean.renderOrder = 0;
      return ocean;
    },

    stylizeMaterial: function (mat, opts) {
      if (!mat || mat.userData._e3dStylized) return mat;
      opts = opts || {};
      mat.userData._e3dStylized = true;
      mat.metalness = opts.metalness != null ? opts.metalness : Math.min(mat.metalness || 0, 0.12);
      mat.roughness = opts.roughness != null ? opts.roughness : Math.max(mat.roughness || 0.72, 0.58);

      var windAmp = opts.wind || 0;
      var windRefH = opts.windHeight || 3.2;
      var rimAmt = opts.rim != null ? opts.rim : 0.14;

      mat.onBeforeCompile = function (shader) {
        shader.uniforms.uE3DTime = E3D.uTime;
        shader.uniforms.uE3DWind = E3D.uWind;
        if (windAmp > 0) {
          shader.vertexShader = 'uniform float uE3DTime;\nuniform vec2 uE3DWind;\n' +
            shader.vertexShader.replace(
              '#include <begin_vertex>',
              [
                '#include <begin_vertex>',
                'float _wy = clamp(transformed.y / ' + windRefH.toFixed(2) + ', 0.0, 1.35);',
                'float _wMask = _wy * _wy;',
                '#ifdef USE_INSTANCING',
                '  vec3 _wOrig = instanceMatrix[3].xyz;',
                '#else',
                '  vec3 _wOrig = modelMatrix[3].xyz;',
                '#endif',
                'float _gust = 0.65 + 0.55 * sin(uE3DTime * 2.4 + _wOrig.x * 0.25 + _wOrig.z * 0.21);',
                'transformed.x += (uE3DWind.x * _gust + sin(uE3DTime * 3.1 + _wOrig.z) * 0.18) * ' + windAmp.toFixed(4) + ' * _wMask;',
                'transformed.z += (uE3DWind.y * _gust + cos(uE3DTime * 2.7 + _wOrig.x) * 0.14) * ' + windAmp.toFixed(4) + ' * _wMask;'
              ].join('\n')
            );
        }
        if (rimAmt > 0) {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            [
              '// Bruno Simon / Messenger warm sky-rim lift so shadows stay sunny & colourful',
              'float _fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.6);',
              'gl_FragColor.rgb += vec3(0.16, 0.22, 0.30) * (_fres * ' + rimAmt.toFixed(3) + ');',
              '#include <dithering_fragment>'
            ].join('\n')
          );
        }
      };
      mat.customProgramCacheKey = function () {
        return 'e3d_styl_' + windAmp.toFixed(3) + '_' + windRefH.toFixed(1) + '_' + rimAmt.toFixed(2);
      };
      return mat;
    },

    stylizeObject: function (obj, opts) {
      if (!obj) return obj;
      opts = opts || {};
      obj.traverse(function (o) {
        if (!o.isMesh) return;
        o.castShadow = opts.castShadow !== false;
        o.receiveShadow = opts.receiveShadow !== false;
        var mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function (m) { if (m) E3D.Shaders.stylizeMaterial(m, opts); });
      });
      return obj;
    },

    _shadowTex: null,
    createContactShadow: function (rx, rz, opacity) {
      if (!this._shadowTex) {
        var cv = document.createElement('canvas');
        cv.width = 128; cv.height = 128;
        var g = cv.getContext('2d');
        var grd = g.createRadialGradient(64, 64, 6, 64, 64, 62);
        // ART_STYLE.md §3: shadows are soft blue-lilac, never pure black!
        grd.addColorStop(0.0, 'rgba(38, 44, 92, 0.58)');
        grd.addColorStop(0.55, 'rgba(48, 62, 118, 0.28)');
        grd.addColorStop(1.0, 'rgba(48, 62, 118, 0.0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        var tex = new T3.CanvasTexture(cv);
        tex.colorSpace = T3.SRGBColorSpace;
        this._shadowTex = tex;
      }
      var mat = new T3.MeshBasicMaterial({
        map: this._shadowTex,
        transparent: true,
        opacity: opacity != null ? opacity : 0.75,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2
      });
      var m = new T3.Mesh(new T3.PlaneGeometry(rx * 2, (rz || rx) * 2), mat);
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.025;
      m.renderOrder = 1;
      return m;
    }
  };

  /* =========================================================================
   * 3. POSTPROCESSING COMPOSER + SPLIT-SCREEN MULTI-TOUCH RENDERER
   * ========================================================================= */
  E3D.PostFX = {
    composer: null,
    renderPass: null,
    bloomEffect: null,
    enabled: true,

    init: function (renderer, scene, camera, opts) {
      opts = opts || {};
      if (!PP.EffectComposer || opts.enabled === false) {
        this.enabled = false;
        return null;
      }
      try {
        // IMPORTANT: WebGLRenderer from kit3d already has antialias:true + SRGBColorSpace on the default swapchain!
        // Using HalfFloatType + multisampling>0 on top of an antialias:true DXGI flip swapchain causes
        // ANGLE/D3D11 triple-buffer swapchain flicker in Chromium/Electron. Use UnsignedByteType + multisampling:0 + SMAAEffect!
        renderer.toneMapping = T3.NoToneMapping;
        var composer = new PP.EffectComposer(renderer, {
          frameBufferType: T3.UnsignedByteType,
          multisampling: 0
        });
        var renderPass = new PP.RenderPass(scene, camera);
        composer.addPass(renderPass);

        var bloom = new PP.BloomEffect({
          mipmapBlur: true,
          luminanceThreshold: opts.bloomThreshold != null ? opts.bloomThreshold : 0.92,
          luminanceSmoothing: 0.25,
          intensity: opts.bloomIntensity != null ? opts.bloomIntensity : 0.35,
          radius: 0.52
        });
        var tone = new PP.ToneMappingEffect({
          mode: PP.ToneMappingMode ? PP.ToneMappingMode.ACES_FILMIC : 4
        });
        var vig = new PP.VignetteEffect({
          eskil: false,
          offset: 0.36,
          darkness: 0.20
        });

        var effects = [bloom, vig, tone];
        if (PP.SMAAEffect) {
          try { effects.unshift(new PP.SMAAEffect()); } catch (e) {}
        }
        var effectPass = new PP.EffectPass(camera, ...effects);
        composer.addPass(effectPass);

        this.composer = composer;
        this.renderPass = renderPass;
        this.bloomEffect = bloom;
        this.enabled = true;
        return composer;
      } catch (err) {
        console.warn('[E3D.PostFX] fallback to direct WebGLRenderer:', err);
        renderer.toneMapping = T3.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;
        this.enabled = false;
        return null;
      }
    },

    resize: function (w, h) {
      if (this.composer) {
        this._lastW = w;
        this._lastH = h;
        this.composer.setSize(w, h, false);
      }
    },

    renderSingle: function (renderer, scene, camera, dt) {
      var prevAuto = renderer.info.autoReset;
      renderer.info.autoReset = false;
      renderer.info.reset();
      if (this.enabled && this.composer) {
        if (!this._sizeVec) this._sizeVec = new T3.Vector2();
        renderer.getSize(this._sizeVec);
        var pr = renderer.getPixelRatio();
        if (this._lastW !== this._sizeVec.x || this._lastH !== this._sizeVec.y || this._lastPR !== pr) {
          this._lastW = this._sizeVec.x;
          this._lastH = this._sizeVec.y;
          this._lastPR = pr;
          this.composer.setSize(this._sizeVec.x, this._sizeVec.y, false);
        }
        this.renderPass.mainCamera = camera;
        renderer.setRenderTarget(null);
        renderer.clear(true, true, true);
        renderer.autoClear = false;
        this.composer.render(dt);
        renderer.autoClear = true;
      } else {
        renderer.autoClear = true;
        renderer.toneMapping = T3.ACESFilmicToneMapping;
        renderer.render(scene, camera);
      }
      E3D.stats = {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures
      };
      renderer.info.autoReset = prevAuto;
    },

    renderSplitHorizontal: function (renderer, scene, camLeft, camRight) {
      // Used in 2-Kid Simultaneous Smartboard Duel Mode!
      var prevTM = renderer.toneMapping, prevExp = renderer.toneMappingExposure;
      renderer.toneMapping = T3.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.14;
      var sz = renderer.getSize(new T3.Vector2());
      var w = sz.x, h = sz.y, halfW = Math.floor(w * 0.5);

      camLeft.aspect = halfW / Math.max(1, h);
      camLeft.updateProjectionMatrix();
      camRight.aspect = (w - halfW) / Math.max(1, h);
      camRight.updateProjectionMatrix();

      renderer.autoClear = false;
      renderer.setScissorTest(true);
      renderer.setViewport(0, 0, halfW, h);
      renderer.setScissor(0, 0, halfW, h);
      renderer.clear(true, true, true);
      renderer.render(scene, camLeft);

      renderer.setViewport(halfW, 0, w - halfW, h);
      renderer.setScissor(halfW, 0, w - halfW, h);
      renderer.clear(true, true, true);
      renderer.render(scene, camRight);

      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
      renderer.autoClear = true;
      renderer.toneMapping = prevTM;
      renderer.toneMappingExposure = prevExp;
    }
  };

  /* =========================================================================
   * 4. RAPIER 3D RIGID-BODY DESTRUCTION & INSTANCED MESH SYNC ENGINE
   * ========================================================================= */
  var _dummyM = new T3.Matrix4();
  var _dummyP = new T3.Vector3();
  var _dummyQ = new T3.Quaternion();
  var _dummyS = new T3.Vector3(1, 1, 1);

  E3D.initRapier = function () {
    if (E3D.rapierReady) return Promise.resolve(RAPIER);
    if (!RAPIER || typeof RAPIER.init !== 'function') return Promise.reject(new Error('Rapier3D missing'));
    return RAPIER.init().then(function () {
      E3D.rapierReady = true;
      return RAPIER;
    });
  };

  function PhysicsStage(opts) {
    opts = opts || {};
    this.gravity = opts.gravity || { x: 0, y: -16.5, z: 0 };
    this.world = new RAPIER.World(this.gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
    this.accumulator = 0;
    this.fixedDt = 1 / 60;
    this.bodies = [];       // { handle, body, collider, kind, tag, hp, exploded, mesh, batch, slot, scale }
    this.byHandle = {};
    this.batches = {};      // key -> { instancedMesh, max, count, items: [] }
    this.onCollision = opts.onCollision || null;
  }

  PhysicsStage.prototype.registerBatch = function (key, geometry, material, maxCount, scene) {
    var im = new T3.InstancedMesh(geometry, material, maxCount);
    im.instanceMatrix.setUsage(T3.DynamicDrawUsage);
    im.castShadow = true;
    im.receiveShadow = true;
    im.count = 0;
    im.frustumCulled = false;
    if (scene) scene.add(im);
    this.batches[key] = { key: key, meshes: [im], mesh: im, max: maxCount, count: 0, items: [] };
    return im;
  };

  PhysicsStage.prototype.registerGLBBatch = function (key, gltfObj, maxCount, scene, batchOpts) {
    if (!gltfObj || !gltfObj.scene) return null;
    batchOpts = batchOpts || {};
    var vScale = batchOpts.visualScale || 1.0;
    gltfObj.scene.updateMatrixWorld(true);
    var rootInv = new T3.Matrix4().copy(gltfObj.scene.matrixWorld).invert();
    var meshes = [];
    gltfObj.scene.traverse(function (o) {
      if (!o.isMesh || !o.geometry) return;
      var geo = o.geometry.clone();
      var relM = new T3.Matrix4().multiplyMatrices(rootInv, o.matrixWorld);
      geo.applyMatrix4(relM);
      if (vScale !== 1.0) geo.scale(vScale, vScale, vScale);
      var mat = Array.isArray(o.material) ? o.material[0].clone() : o.material.clone();
      E3D.Shaders.stylizeMaterial(mat, { rim: 0.16 });
      if (batchOpts.gradeKind && root.GameQualityCore && root.GameQualityCore.Atmosphere && root.GameQualityCore.Atmosphere.gradeTargetMaterial) {
        root.GameQualityCore.Atmosphere.gradeTargetMaterial(mat, batchOpts.gradeKind);
      }
      var im = new T3.InstancedMesh(geo, mat, maxCount);
      im.instanceMatrix.setUsage(T3.DynamicDrawUsage);
      im.castShadow = true;
      im.receiveShadow = true;
      im.count = 0;
      im.frustumCulled = false;
      if (scene) scene.add(im);
      meshes.push(im);
    });
    if (!meshes.length) return null;
    this.batches[key] = { key: key, meshes: meshes, mesh: meshes[0], max: maxCount, count: 0, items: [] };
    return meshes;
  };

  PhysicsStage.prototype.addStaticBox = function (hx, hy, hz, pos, rotY, tag) {
    var bd = RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z);
    if (rotY) {
      var q = new T3.Quaternion().setFromAxisAngle(new T3.Vector3(0, 1, 0), rotY);
      bd.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
    }
    var body = this.world.createRigidBody(bd);
    var cd = RAPIER.ColliderDesc.cuboid(hx, hy, hz)
      .setFriction(0.75)
      .setRestitution(0.2)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    var col = this.world.createCollider(cd, body);
    var rec = { handle: col.handle, bodyHandle: body.handle, body: body, collider: col, kind: 'static', tag: tag || 'ground' };
    this.bodies.push(rec);
    this.byHandle[col.handle] = rec;
    return rec;
  };

  PhysicsStage.prototype.addKinematicBody = function (hx, hy, hz, pos, tag, userData) {
    var bd = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(pos.x, pos.y, pos.z);
    var body = this.world.createRigidBody(bd);
    var cd = RAPIER.ColliderDesc.cuboid(hx, hy, hz)
      .setFriction(0.85)
      .setRestitution(tag === 'buoy' ? 1.35 : 0.25)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    var col = this.world.createCollider(cd, body);
    var rec = { handle: col.handle, bodyHandle: body.handle, body: body, collider: col, kind: 'kinematic', tag: tag || 'ship', data: userData || {} };
    this.bodies.push(rec);
    this.byHandle[col.handle] = rec;
    return rec;
  };

  PhysicsStage.prototype.addDynamicBlock = function (opts) {
    // opts: { batchKey, mesh, shape:'box'|'cylinder'|'ball', hx, hy, hz, radius, pos, rotY, density, friction, restitution, damping, tag, data, scale }
    var bd = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(opts.pos.x, opts.pos.y, opts.pos.z)
      .setLinearDamping(opts.damping != null ? opts.damping : 0.22)
      .setAngularDamping(opts.angDamping != null ? opts.angDamping : 0.28)
      .setCcdEnabled(!!opts.ccd);
    if (opts.rotY) {
      var q = new T3.Quaternion().setFromAxisAngle(new T3.Vector3(0, 1, 0), opts.rotY);
      bd.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
    }
    if (opts.vel) bd.setLinvel(opts.vel.x, opts.vel.y, opts.vel.z);
    if (opts.angVel) bd.setAngvel(opts.angVel.x, opts.angVel.y, opts.angVel.z);

    var body = this.world.createRigidBody(bd);
    var cd;
    if (opts.shape === 'ball') {
      cd = RAPIER.ColliderDesc.ball(opts.radius || 0.35);
    } else if (opts.shape === 'cylinder') {
      cd = RAPIER.ColliderDesc.cylinder(opts.hy || 0.45, opts.radius || 0.38);
    } else {
      cd = RAPIER.ColliderDesc.cuboid(opts.hx || 0.45, opts.hy || 0.45, opts.hz || 0.45);
    }
    cd.setDensity(opts.density || 1.2)
      .setFriction(opts.friction != null ? opts.friction : 0.68)
      .setRestitution(opts.restitution != null ? opts.restitution : 0.22)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    var col = this.world.createCollider(cd, body);
    var sc = opts.scale || new T3.Vector3(1, 1, 1);
    var rec = {
      handle: col.handle,
      bodyHandle: body.handle,
      body: body,
      collider: col,
      kind: 'dynamic',
      tag: opts.tag || 'crate',
      points: opts.points || 15,
      scored: false,
      exploded: false,
      scale: sc.isVector3 ? sc.clone() : new T3.Vector3(sc, sc, sc),
      mesh: opts.mesh || null,
      batch: null,
      slot: -1,
      data: opts.data || {}
    };

    if (opts.batchKey && this.batches[opts.batchKey]) {
      var b = this.batches[opts.batchKey];
      if (b.count < b.max) {
        rec.batch = b;
        rec.slot = b.count++;
        b.items[rec.slot] = rec;
        for (var mi = 0; mi < b.meshes.length; mi++) b.meshes[mi].count = b.count;
      }
    }
    if (opts.sleepInitially) body.sleep();

    this.bodies.push(rec);
    this.byHandle[col.handle] = rec;
    this._syncRecordVisual(rec);
    return rec;
  };

  PhysicsStage.prototype._syncRecordVisual = function (rec) {
    if (!rec || !rec.body) return;
    var tr = rec.body.translation();
    var rt = rec.body.rotation();
    var mi;
    if (rec.hidden) {
      if (rec.batch && rec.slot >= 0) {
        _dummyM.makeScale(0, 0, 0);
        for (mi = 0; mi < rec.batch.meshes.length; mi++) rec.batch.meshes[mi].setMatrixAt(rec.slot, _dummyM);
      } else if (rec.mesh) {
        rec.mesh.visible = false;
      }
      return;
    }
    if (rec.batch && rec.slot >= 0) {
      _dummyP.set(tr.x, tr.y, tr.z);
      _dummyQ.set(rt.x, rt.y, rt.z, rt.w);
      _dummyM.compose(_dummyP, _dummyQ, rec.scale);
      for (mi = 0; mi < rec.batch.meshes.length; mi++) rec.batch.meshes[mi].setMatrixAt(rec.slot, _dummyM);
    } else if (rec.mesh) {
      rec.mesh.position.set(tr.x, tr.y, tr.z);
      rec.mesh.quaternion.set(rt.x, rt.y, rt.z, rt.w);
    }
  };

  PhysicsStage.prototype.hideRecord = function (rec) {
    if (!rec || rec.hidden) return;
    rec.hidden = true;
    this._syncRecordVisual(rec);
    if (rec.batch) {
      for (var mi = 0; mi < rec.batch.meshes.length; mi++) rec.batch.meshes[mi].instanceMatrix.needsUpdate = true;
    }
    try {
      this.world.removeRigidBody(rec.body);
    } catch (e) {}
    delete this.byHandle[rec.handle];
    rec.body = null;
    rec.collider = null;
  };

  PhysicsStage.prototype.isSettled = function () {
    for (var i = 0; i < this.bodies.length; i++) {
      var r = this.bodies[i];
      if (!r.body || r.hidden || r.kind !== 'dynamic') continue;
      if (r.body.isSleeping()) continue;
      var lv = r.body.linvel();
      if ((lv.x * lv.x + lv.y * lv.y + lv.z * lv.z) > 0.22) return false;
    }
    return true;
  };

  PhysicsStage.prototype.radialExplosion = function (center, radius, force) {
    var affected = 0;
    for (var i = 0; i < this.bodies.length; i++) {
      var r = this.bodies[i];
      if (!r.body || r.kind !== 'dynamic' || r.hidden) continue;
      var tr = r.body.translation();
      var dx = tr.x - center.x, dy = tr.y - center.y, dz = tr.z - center.z;
      var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < radius) {
        r.body.wakeUp();
        var falloff = Math.pow(1 - dist / radius, 1.35);
        var inv = 1 / Math.max(0.25, dist);
        var ix = dx * inv * force * falloff;
        var iy = (Math.max(0.35, dy * inv) + 0.75) * force * falloff;
        var iz = dz * inv * force * falloff;
        r.body.applyImpulse({ x: ix, y: iy, z: iz }, true);
        r.body.applyTorqueImpulse({
          x: (Math.random() - 0.5) * force * 0.45 * falloff,
          y: (Math.random() - 0.5) * force * 0.45 * falloff,
          z: (Math.random() - 0.5) * force * 0.45 * falloff
        }, true);
        affected++;
      }
    }
    return affected;
  };

  PhysicsStage.prototype.step = function (dt) {
    this.accumulator += Math.min(dt, 0.06);
    var steps = 0;
    while (this.accumulator >= this.fixedDt && steps < 4) {
      // Apply exact wind acceleration (dv = a_wind * dt) ONLY to flying cannonballs — never persistent addForce!
      for (var w = 0; w < this.bodies.length; w++) {
        var bw = this.bodies[w];
        if (bw.body && !bw.hidden && bw.tag === 'ammo') {
          var lv = bw.body.linvel();
          bw.body.setLinvel({
            x: lv.x + E3D.wind.x * this.fixedDt,
            y: lv.y,
            z: lv.z + E3D.wind.z * this.fixedDt
          }, true);
        }
      }
      this.world.step(this.eventQueue);
      var self = this;
      if (this.onCollision) {
        this.eventQueue.drainCollisionEvents(function (h1, h2, started) {
          if (!started) return;
          var a = self.byHandle[h1], b = self.byHandle[h2];
          if (a && b) self.onCollision(a, b);
        });
      } else {
        this.eventQueue.clear();
      }
      this.accumulator -= this.fixedDt;
      steps++;
    }

    for (var i = 0; i < this.bodies.length; i++) {
      var rec = this.bodies[i];
      if (rec.body && rec.kind === 'dynamic' && !rec.hidden) {
        this._syncRecordVisual(rec);
      }
    }
    for (var bk in this.batches) {
      if (this.batches[bk].count > 0) {
        var ms = this.batches[bk].meshes;
        for (var mi = 0; mi < ms.length; mi++) ms[mi].instanceMatrix.needsUpdate = true;
      }
    }
  };

  PhysicsStage.prototype.dispose = function (scene) {
    for (var bk in this.batches) {
      var ms = this.batches[bk].meshes;
      for (var mi = 0; mi < ms.length; mi++) {
        var im = ms[mi];
        if (scene && im.parent === scene) scene.remove(im);
        im.dispose();
      }
    }
    for (var i = 0; i < this.bodies.length; i++) {
      var r = this.bodies[i];
      if (r.mesh && scene && r.mesh.parent === scene) scene.remove(r.mesh);
    }
    try { this.world.free(); this.eventQueue.free(); } catch (e) {}
    this.bodies = [];
    this.byHandle = {};
    this.batches = {};
  };

  E3D.PhysicsStage = PhysicsStage;

  /* =========================================================================
   * 5. YUKA AUTONOMOUS STEERING HELPERS (Pirate Fleet, Gulls & Guide Parrot)
   * ========================================================================= */
  E3D.AI = {
    createManager: function () {
      return YUKA ? new YUKA.EntityManager() : null;
    },
    createPatrolVehicle: function (waypoints, maxSpeed, loop) {
      if (!YUKA) return null;
      var v = new YUKA.Vehicle();
      v.maxSpeed = maxSpeed || 3.2;
      v.maxForce = 6.5;
      var path = new YUKA.Path();
      path.loop = loop !== false;
      waypoints.forEach(function (pt) {
        path.add(new YUKA.Vector3(pt[0], pt[1] || 0, pt[2]));
      });
      var first = path.current();
      v.position.copy(first);
      v.steering.add(new YUKA.FollowPathBehavior(path, 1.4));
      return v;
    }
  };

  /* =========================================================================
   * 6. TACTILE AUDIO ENGINE (Howler + Polyphonic Web Audio + Separate Music Mute)
   * ========================================================================= */
  var _ac = null;
  var _musicTimer = null;
  var _howls = {};

  function getAC() {
    if (root.K3 && root.K3.CAPTURE) return null;
    if (!_ac) {
      try { _ac = (root.K3 && root.K3.audio && root.K3.audio()) || new (root.AudioContext || root.webkitAudioContext)(); } catch (e) {}
    }
    if (_ac && _ac.state === 'suspended') { try { _ac.resume(); } catch (e) {} }
    return _ac;
  }

  E3D.Audio = {
    loadHowl: function (key, src, loop, vol) {
      if (!Howl || _howls[key]) return _howls[key];
      try {
        _howls[key] = new Howl({ src: Array.isArray(src) ? src : [src], loop: !!loop, volume: vol != null ? vol : 0.5 });
      } catch (e) {}
      return _howls[key];
    },

    setMusicMuted: function (muted) {
      E3D.musicMuted = !!muted;
      if (_howls.music) _howls.music.mute(E3D.musicMuted);
      if (E3D.musicMuted && _musicTimer) {
        clearInterval(_musicTimer);
        _musicTimer = null;
      } else if (!E3D.musicMuted) {
        this.startIslandMarimbaLoop();
      }
    },

    setSfxMuted: function (muted) {
      E3D.sfxMuted = !!muted;
      if (root.K3) root.K3.muted = E3D.sfxMuted;
      if (Howler) Howler.mute(E3D.sfxMuted && E3D.musicMuted);
    },

    // Warm breathing tropical marimba phrases + gentle ocean surf wave wash (never repetitive!)
    startIslandMarimbaLoop: function () {
      if (E3D.musicMuted || _musicTimer || (root.K3 && root.K3.CAPTURE)) return;
      // 24-step sunny phrase with generous breathing rests (0 = rest)
      var phrase = [
        523.25, 659.25, 783.99, 0,  880.00, 783.99, 0,      0,
        587.33, 783.99, 987.77, 0,  783.99, 659.25, 523.25, 0,
        0,      659.25, 0,      783.99, 659.25, 0,  0,      0
      ];
      var step = 0;
      _musicTimer = setInterval(function () {
        if (E3D.musicMuted) return;
        var a = getAC();
        if (!a || a.state !== 'running') return;
        var idx = step % phrase.length;
        var f = phrase[idx];
        // Soft ocean wave surf swell every 12 steps (~5.8s)
        if (idx === 0 || idx === 12) {
          var wLen = Math.floor(a.sampleRate * 2.2), wBuf = a.createBuffer(1, wLen, a.sampleRate), ch = wBuf.getChannelData(0);
          for (var i = 0; i < wLen; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / wLen));
          var ws = a.createBufferSource(), lp = a.createBiquadFilter(), wg = a.createGain();
          lp.type = 'lowpass'; lp.frequency.value = 440;
          wg.gain.value = 0.032;
          ws.buffer = wBuf; ws.connect(lp); lp.connect(wg); wg.connect(a.destination);
          ws.start(a.currentTime);
        }
        step++;
        if (!f) return;
        var t0 = a.currentTime;
        var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
        o1.type = 'sine'; o2.type = 'triangle';
        o1.frequency.setValueAtTime(f, t0);
        o2.frequency.setValueAtTime(f * 2, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.026, t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0004, t0 + 0.42);
        o1.connect(g); o2.connect(g); g.connect(a.destination);
        o1.start(t0); o2.start(t0);
        o1.stop(t0 + 0.45); o2.stop(t0 + 0.45);
      }, 480);
    },

    cannonWhistle: function (durSec) {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime, d = Math.min(1.6, Math.max(0.5, durSec || 1.1));
      var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o1.type = 'sine'; o2.type = 'triangle';
      o1.frequency.setValueAtTime(840, t); o1.frequency.exponentialRampToValueAtTime(340, t + d);
      o2.frequency.setValueAtTime(1680, t); o2.frequency.exponentialRampToValueAtTime(680, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0006, t + d);
      o1.connect(g); o2.connect(g); g.connect(a.destination);
      o1.start(t); o2.start(t); o1.stop(t + d + 0.02); o2.stop(t + d + 0.02);
    },

    shipSinkGlug: function () {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      [0, 0.14, 0.29, 0.45].forEach(function (off, i) {
        var t = a.currentTime + off;
        var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
        o1.type = 'sine'; o2.type = 'triangle';
        var f0 = 210 + i * 35;
        o1.frequency.setValueAtTime(f0, t); o1.frequency.exponentialRampToValueAtTime(f0 * 1.65, t + 0.11);
        o2.frequency.setValueAtTime(f0 * 1.5, t); o2.frequency.exponentialRampToValueAtTime(f0 * 2.2, t + 0.11);
        g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        o1.connect(g); o2.connect(g); g.connect(a.destination);
        o1.start(t); o2.start(t); o1.stop(t + 0.13); o2.stop(t + 0.13);
      });
    },

    // Rich multi-layered gameplay SFX (zero harsh raw square/sawtooth beeps per AGENTS.md §1.3)
    cannonFire: function (power01) {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime, p = 0.7 + 0.3 * (power01 || 0.8);
      // 1) Deep sub-bass chest thump
      var sub = a.createOscillator(), sg = a.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(125 * p, t);
      sub.frequency.exponentialRampToValueAtTime(34, t + 0.48);
      sg.gain.setValueAtTime(0.52 * p, t);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 0.52);
      sub.connect(sg); sg.connect(a.destination);
      sub.start(t); sub.stop(t + 0.54);
      // 2) Warm low-pass filtered cannon blast burst
      var len = Math.floor(a.sampleRate * 0.55), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.8);
      var ns = a.createBufferSource(), lp = a.createBiquadFilter(), ng = a.createGain();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(620, t); lp.frequency.exponentialRampToValueAtTime(140, t + 0.5);
      ng.gain.setValueAtTime(0.46 * p, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.54);
      ns.buffer = buf; ns.connect(lp); lp.connect(ng); ng.connect(a.destination);
      ns.start(t);
    },

    woodCrunch: function (intensity) {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var k = Math.min(1.2, Math.max(0.3, intensity || 0.7));
      for (var c = 0; c < 3; c++) {
        (function (delay) {
          var t = a.currentTime + delay;
          var len = Math.floor(a.sampleRate * 0.09), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
          for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
          var ns = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
          bp.type = 'bandpass'; bp.frequency.value = 540 + delay * 1900; bp.Q.value = 2.2;
          g.gain.setValueAtTime(0.32 * k, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
          ns.buffer = buf; ns.connect(bp); bp.connect(g); g.connect(a.destination);
          ns.start(t);
        })(c * 0.038);
      }
    },

    tntBoom: function () {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime;
      var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o1.type = 'sine'; o2.type = 'triangle';
      o1.frequency.setValueAtTime(140, t); o1.frequency.exponentialRampToValueAtTime(28, t + 0.78);
      o2.frequency.setValueAtTime(210, t); o2.frequency.exponentialRampToValueAtTime(42, t + 0.65);
      g.gain.setValueAtTime(0.58, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.82);
      o1.connect(g); o2.connect(g); g.connect(a.destination);
      o1.start(t); o2.start(t); o1.stop(t + 0.85); o2.stop(t + 0.85);

      var len = Math.floor(a.sampleRate * 0.85), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
      var ns = a.createBufferSource(), lp = a.createBiquadFilter(), ng = a.createGain();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(920, t); lp.frequency.exponentialRampToValueAtTime(110, t + 0.8);
      ng.gain.setValueAtTime(0.55, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.84);
      ns.buffer = buf; ns.connect(lp); lp.connect(ng); ng.connect(a.destination);
      ns.start(t);
    },

    ratchetTick: function (pitch01) {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime, f = 320 + (pitch01 || 0.5) * 280;
      var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o1.type = 'triangle'; o2.type = 'sine';
      o1.frequency.setValueAtTime(f, t); o2.frequency.setValueAtTime(f * 1.5, t);
      g.gain.setValueAtTime(0.065, t); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.042);
      o1.connect(g); o2.connect(g); g.connect(a.destination);
      o1.start(t); o2.start(t); o1.stop(t + 0.045); o2.stop(t + 0.045);
    },

    buoyBoing: function () {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime;
      // Warm rubbery harmonic boing + gentle 2-tone soft-fail clue (246.94Hz -> 220Hz per AGENTS.md §1.3)
      var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o1.type = 'sine'; o2.type = 'triangle';
      o1.frequency.setValueAtTime(195, t); o1.frequency.exponentialRampToValueAtTime(410, t + 0.14); o1.frequency.exponentialRampToValueAtTime(220, t + 0.36);
      o2.frequency.setValueAtTime(246.94, t + 0.05); o2.frequency.exponentialRampToValueAtTime(220.0, t + 0.38);
      g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
      o1.connect(g); o2.connect(g); g.connect(a.destination);
      o1.start(t); o2.start(t); o1.stop(t + 0.42); o2.stop(t + 0.42);
    },

    waterSplash: function () {
      if (E3D.sfxMuted) return;
      var a = getAC(); if (!a) return;
      var t = a.currentTime;
      var len = Math.floor(a.sampleRate * 0.48), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * Math.pow(i / len, 0.65));
      var ns = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
      bp.type = 'bandpass'; bp.frequency.setValueAtTime(950, t); bp.frequency.exponentialRampToValueAtTime(380, t + 0.45); bp.Q.value = 1.1;
      g.gain.setValueAtTime(0.36, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.46);
      ns.buffer = buf; ns.connect(bp); bp.connect(g); g.connect(a.destination);
      ns.start(t);
    }
  };
})(typeof window !== 'undefined' ? window : this);
