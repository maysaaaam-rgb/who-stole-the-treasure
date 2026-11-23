/* games/engine3d/SceneAtmosphere.js
 * GameQualityCore — Module 1: Pro Commercial Art Direction, Unified Sunlit Palette,
 * Crisp 3/4 Directional Shadow Contrast, Low-Density FogExp2 (0.0022..0.0030),
 * Olive-Meadow Grass (#6EB84C/#4B8B3B), Golden/Wet-Edge Sand (#F3CF8A/#C99D5B),
 * High-Contrast Target Prop Grading & AO Contact Rings.
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var GQC = root.GameQualityCore = root.GameQualityCore || {};

  var THEMES = {
    island: {
      skyZenith: 0x2b8ae8,
      skyMid: 0x7bd3ff,
      skyHorizon: 0xfff3de,
      fogColor: 0xe6f4ff,
      fogDensity: 0.0026,       // Subtle aerial depth — NEVER milky whiteout!
      sunColor: 0xfff2d6,
      sunIntensity: 2.5,        // Strong sunlit key for crisp cast shadows across sand!
      sunPos: [35, 45, 25],     // Classic 3/4 side-front angle
      hemiSky: 0x9ce0ff,
      hemiGround: 0xc49a6c,
      hemiIntensity: 0.55,      // Lower fill preserves rich shadow contrast on sandbars!
      rimColor: 0xffe4b5,
      rimIntensity: 0.60,       // Warm golden back-rim pops forts & sails off the ocean!
      rimPos: [-22, 18, -34],
      envIntensity: 0.48,
      shadowBounds: 28,
      clouds: true
    },
    stadium: {
      skyZenith: 0x2f8ee8,
      skyMid: 0x84d8ff,
      skyHorizon: 0xfff4e2,
      fogColor: 0xe8f5ff,
      fogDensity: 0.0024,
      sunColor: 0xfff2d6,
      sunIntensity: 2.45,
      sunPos: [35, 45, 25],
      hemiSky: 0x9ce0ff,
      hemiGround: 0xc49a6c,
      hemiIntensity: 0.55,
      rimColor: 0xffe4b5,
      rimIntensity: 0.58,
      rimPos: [-20, 18, -30],
      envIntensity: 0.46,
      shadowBounds: 30,
      clouds: true
    },
    alley: {
      skyZenith: 0x56a8f5,
      skyMid: 0xb0e2ff,
      skyHorizon: 0xfff2da,
      fogColor: 0xfcf0dc,
      fogDensity: 0.0022,
      sunColor: 0xfff2d6,
      sunIntensity: 2.35,
      sunPos: [26, 38, 22],
      hemiSky: 0xffe8c8,
      hemiGround: 0xc49a6c,
      hemiIntensity: 0.58,
      rimColor: 0xffe4b5,
      rimIntensity: 0.55,
      rimPos: [-16, 15, -24],
      envIntensity: 0.62,
      shadowBounds: 24,
      clouds: false
    },
    festival: {
      skyZenith: 0x3694ee,
      skyMid: 0x8cdbff,
      skyHorizon: 0xfff1de,
      fogColor: 0xedf5ff,
      fogDensity: 0.0025,
      sunColor: 0xfff2d6,
      sunIntensity: 2.45,
      sunPos: [32, 44, 24],
      hemiSky: 0x9ce0ff,
      hemiGround: 0xc49a6c,
      hemiIntensity: 0.55,
      rimColor: 0xffe4b5,
      rimIntensity: 0.60,
      rimPos: [-18, 17, -28],
      envIntensity: 0.50,
      shadowBounds: 24,
      clouds: true
    }
  };

  var _blobShadowTex = null;

  function getBlobShadowTexture() {
    if (_blobShadowTex) return _blobShadowTex;
    var cv = document.createElement('canvas');
    cv.width = 128; cv.height = 128;
    var g = cv.getContext('2d');
    var grd = g.createRadialGradient(64, 64, 8, 64, 64, 62);
    // Warm darkened ambient-occlusion contact shadow ring
    grd.addColorStop(0.0, 'rgba(48, 36, 24, 0.58)');
    grd.addColorStop(0.55, 'rgba(56, 44, 30, 0.28)');
    grd.addColorStop(1.0, 'rgba(56, 44, 30, 0.0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    var tex = new T3.CanvasTexture(cv);
    if (T3.SRGBColorSpace) tex.colorSpace = T3.SRGBColorSpace;
    else if (T3.sRGBEncoding) tex.encoding = T3.sRGBEncoding;
    _blobShadowTex = tex;
    return tex;
  }

  function buildStudioPMREM(renderer, themeCfg) {
    try {
      if (!T3.PMREMGenerator) return null;
      var pmrem = new T3.PMREMGenerator(renderer);
      if (pmrem.compileEquirectangularShader) pmrem.compileEquirectangularShader();

      var envScene = new T3.Scene();
      var domeGeo = new T3.SphereGeometry(24, 24, 16);
      var pos = domeGeo.attributes.position;
      var cols = new Float32Array(pos.count * 3);
      var cTop = new T3.Color(themeCfg.skyZenith);
      var cHor = new T3.Color(themeCfg.skyHorizon);
      var cGnd = new T3.Color(themeCfg.hemiGround);
      var cSun = new T3.Color(0xfff7e2);
      var tmp = new T3.Color();
      var sunDir = new T3.Vector3().fromArray(themeCfg.sunPos).normalize();
      var vd = new T3.Vector3();

      for (var i = 0; i < pos.count; i++) {
        vd.fromBufferAttribute(pos, i).normalize();
        if (vd.y >= 0) tmp.copy(cHor).lerp(cTop, Math.pow(vd.y, 0.62));
        else tmp.copy(cHor).lerp(cGnd, Math.min(1, Math.pow(-vd.y, 0.55) * 1.1));
        var sd = Math.max(0, vd.dot(sunDir));
        if (sd > 0.72) tmp.lerp(cSun, Math.pow((sd - 0.72) / 0.28, 2.0) * 0.95);
        cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
      }
      domeGeo.setAttribute('color', new T3.BufferAttribute(cols, 3));
      envScene.add(new T3.Mesh(domeGeo, new T3.MeshBasicMaterial({ vertexColors: true, side: T3.BackSide })));

      var panelGeo = new T3.PlaneGeometry(8, 8);
      var keyPanel = new T3.Mesh(panelGeo, new T3.MeshBasicMaterial({ color: 0xfff5dc, side: T3.DoubleSide }));
      keyPanel.position.set(12, 15, 10);
      keyPanel.lookAt(0, 0, 0);
      envScene.add(keyPanel);

      var rimPanel = new T3.Mesh(panelGeo, new T3.MeshBasicMaterial({ color: 0xffe4b5, side: T3.DoubleSide }));
      rimPanel.position.set(-10, 9, -12);
      rimPanel.lookAt(0, 0, 0);
      envScene.add(rimPanel);

      var rt = pmrem.fromScene(envScene, 0.035);
      domeGeo.dispose();
      panelGeo.dispose();
      pmrem.dispose();
      return rt.texture;
    } catch (e) {
      return null;
    }
  }

  function createGradientSkyDome(themeCfg, sunDirUniform) {
    var mat = new T3.ShaderMaterial({
      side: T3.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uZenith:  { value: new T3.Color(themeCfg.skyZenith) },
        uMid:     { value: new T3.Color(themeCfg.skyMid) },
        uHorizon: { value: new T3.Color(themeCfg.skyHorizon) },
        uSunCol:  { value: new T3.Color(0xfff7e0) },
        uSunDir:  sunDirUniform || { value: new T3.Vector3().fromArray(themeCfg.sunPos).normalize() }
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
        '  vec3 col = mix(uHorizon, uMid, smoothstep(-0.02, 0.22, h));',
        '  col = mix(col, uZenith, smoothstep(0.20, 0.78, h));',
        '  float rim = exp(-abs(d.y) * 11.0);',
        '  col += vec3(0.08, 0.05, 0.02) * rim;',
        '  float sunAmt = max(0.0, dot(d, normalize(uSunDir)));',
        '  col += uSunCol * pow(sunAmt, 14.0) * 0.22;',
        '  col += uSunCol * smoothstep(0.9968, 0.9993, sunAmt) * 0.72;',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    var mesh = new T3.Mesh(new T3.SphereGeometry(360, 32, 20), mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = -10;
    mesh.name = 'gqc-sky-dome';
    return mesh;
  }

  function createDriftingClouds(count, opts) {
    opts = opts || {};
    var nClouds = count || 10;
    var puffGeo = new T3.SphereGeometry(1.0, 12, 8);
    var puffMat = new T3.MeshLambertMaterial({
      color: 0xffffff,
      emissive: new T3.Color(0xfffaf0),
      emissiveIntensity: 0.34
    });
    var total = nClouds * 5;
    var im = new T3.InstancedMesh(puffGeo, puffMat, total);
    im.frustumCulled = false;
    im.name = 'gqc-clouds';

    var puffs = [];
    var spanX = opts.spanX || 78;
    for (var c = 0; c < nClouds; c++) {
      var cx = -spanX + (c / Math.max(1, nClouds - 1)) * (spanX * 2) + (Math.random() - 0.5) * 14;
      var cy = 20 + Math.random() * 10;
      var cz = -105 + Math.random() * 56;
      var spd = 0.36 + Math.random() * 0.48;
      for (var p = 0; p < 5; p++) {
        puffs.push({
          cx: cx, cy: cy, cz: cz, spd: spd,
          ox: (p - 2) * 1.65 + (Math.random() - 0.5) * 0.5,
          oy: p === 2 ? 0.62 : (Math.random() * 0.3),
          oz: (Math.random() - 0.5) * 0.7,
          sx: (p === 2 ? 2.55 : 1.80) + Math.random() * 0.35,
          sy: (p === 2 ? 1.45 : 1.08) + Math.random() * 0.20
        });
      }
    }

    var m4 = new T3.Matrix4(), pos = new T3.Vector3(), q = new T3.Quaternion(), sc = new T3.Vector3();
    function updateClouds(t) {
      for (var i = 0; i < puffs.length; i++) {
        var pf = puffs[i];
        var x = ((pf.cx + t * pf.spd + (spanX + 20)) % ((spanX + 20) * 2)) - (spanX + 20) + pf.ox;
        pos.set(x, pf.cy + pf.oy, pf.cz + pf.oz);
        sc.set(pf.sx, pf.sy, pf.sx * 0.78);
        m4.compose(pos, q, sc);
        im.setMatrixAt(i, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    }
    updateClouds(0);
    im.userData.update = updateClouds;
    return im;
  }

  /* =========================================================================
   * COHESIVE TROPICAL TERRAIN GRADER:
   * - Grass/Hills: Warm Olive-Meadow (#6EB84C lit, #4B8B3B shaded)
   * - Sandbars: Warm Golden Sand (#F3CF8A) + Wet-Sand Waterline (#C99D5B)!
   * ========================================================================= */
  function gradeEnvironment(rootObj, opts) {
    if (!rootObj) return rootObj;
    opts = opts || {};
    var enableWetSand = opts.wetSand !== false;
    var hsl = { h: 0, s: 0, l: 0 };

    rootObj.traverse(function (n) {
      if (!n.isMesh || !n.material) return;
      n.receiveShadow = opts.receiveShadow !== false;
      if (opts.castShadow != null) n.castShadow = opts.castShadow;

      var mats = Array.isArray(n.material) ? n.material : [n.material];
      mats.forEach(function (mc) {
        if (!mc || mc.userData._gqcGraded) return;
        mc.userData._gqcGraded = true;

        if (mc.color) {
          mc.color.getHSL(hsl);
          if (hsl.h > 0.20 && hsl.h < 0.46 && hsl.s > 0.30) {
            // Warm olive-meadow #6EB84C (HSL ~ 0.28, 0.44, 0.50)
            mc.color.setHSL(0.28, Math.min(hsl.s * 0.65, 0.44), Math.max(0.42, Math.min(0.52, hsl.l)));
          }
        }
        if ('roughness' in mc) mc.roughness = Math.max(mc.roughness || 0.78, 0.80);
        if ('metalness' in mc) mc.metalness = Math.min(mc.metalness || 0.0, 0.04);

        var prevOBC = mc.onBeforeCompile;
        mc.onBeforeCompile = function (shader, renderer) {
          if (prevOBC) prevOBC.call(this, shader, renderer);

          // Pass world Y to fragment shader for accurate wet-sand shoreline darkening!
          shader.vertexShader = 'varying float vGqcWorldY;\n' +
            shader.vertexShader.replace(
              '#include <worldpos_vertex>',
              [
                '#include <worldpos_vertex>',
                '#ifdef USE_INSTANCING',
                '  vGqcWorldY = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).y;',
                '#else',
                '  vGqcWorldY = (modelMatrix * vec4(transformed, 1.0)).y;',
                '#endif'
              ].join('\n')
            );

          shader.fragmentShader = 'varying float vGqcWorldY;\n' +
            shader.fragmentShader.replace(
              '#include <color_fragment>',
              [
                '#include <color_fragment>',
                '{',
                '  float _maxRB = max(diffuseColor.r, diffuseColor.b);',
                '  if (diffuseColor.g > _maxRB * 1.08) {',
                '    // Warm Olive-Meadow Grass (#6EB84C lit / #4B8B3B shaded in linear space)',
                '    float _gAmt = clamp((diffuseColor.g - _maxRB) * 3.5, 0.0, 1.0);',
                '    float _gScale = clamp(diffuseColor.g / 0.40, 0.28, 1.38);',
                '    vec3 _oliveMeadow = vec3(0.162, 0.468, 0.074) * _gScale;',
                '    diffuseColor.rgb = mix(diffuseColor.rgb, _oliveMeadow, _gAmt * 0.90);',
                '  } else if (' + (enableWetSand ? 'true' : 'false') + ' && diffuseColor.r > diffuseColor.b * 1.18 && diffuseColor.g > diffuseColor.b * 1.08) {',
                '    // Golden Sand (#F3CF8A) on upper beach -> Rich Wet Sand (#C99D5B) near waterline!',
                '    float _sandLum = clamp(dot(diffuseColor.rgb, vec3(0.33, 0.50, 0.17)) / 0.58, 0.45, 1.25);',
                '    vec3 _drySand = vec3(0.89, 0.62, 0.255) * _sandLum;',
                '    vec3 _wetSand = vec3(0.55, 0.33, 0.105) * _sandLum;',
                '    float _wetMask = 1.0 - smoothstep(0.06, 0.56, vGqcWorldY);',
                '    vec3 _gradedSand = mix(_drySand, _wetSand, _wetMask * 0.85);',
                '    diffuseColor.rgb = mix(diffuseColor.rgb, _gradedSand, 0.78);',
                '  }',
                '}'
              ].join('\n')
            );
        };
        mc.customProgramCacheKey = function () {
          return 'gqc_env3_' + (enableWetSand ? 'w_' : 'd_') + (mc.uuid || '');
        };
        mc.needsUpdate = true;
      });
    });
    return rootObj;
  }

  /* =========================================================================
   * HIGH-CONTRAST TARGET PROP GRADER:
   * Makes destructible Crates (#D99B52 oak + #8C5828 frame), TNT (#E63946 crimson
   * + #FFD43B hazard stripe), Beams & Stone pop crisply off both sand and ocean!
   * ========================================================================= */
  function gradeTargetMaterial(mat, kind) {
    if (!mat || mat.userData._gqcTargetGraded) return mat;
    mat.userData._gqcTargetGraded = true;
    if ('roughness' in mat) mat.roughness = kind === 'chest' ? 0.36 : 0.62;
    if ('metalness' in mat) mat.metalness = kind === 'chest' ? 0.32 : 0.08;

    var prevOBC = mat.onBeforeCompile;
    mat.onBeforeCompile = function (shader, renderer) {
      if (prevOBC) prevOBC.call(this, shader, renderer);
      shader.vertexShader = 'varying vec3 vGqcLocalPos;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvGqcLocalPos = position;'
        );

      var bodyRule = '';
      if (kind === 'crate') {
        // Warm sunlit oak (#D99B52) planks + dark beveled frame (#8C5828) + subtle gold cross-brace pop!
        bodyRule = [
          '  float _lum = dot(diffuseColor.rgb, vec3(0.30, 0.58, 0.12));',
          '  vec3 _oakLight = vec3(0.70, 0.34, 0.09);',
          '  vec3 _oakFrame = vec3(0.26, 0.105, 0.025);',
          '  float _edge = max(max(abs(vGqcLocalPos.x), abs(vGqcLocalPos.y)), abs(vGqcLocalPos.z));',
          '  float _isFrame = smoothstep(0.34, 0.42, _edge);',
          '  float _diag = smoothstep(0.085, 0.02, abs(abs(vGqcLocalPos.x) - abs(vGqcLocalPos.y))) * (1.0 - _isFrame);',
          '  vec3 _crateCol = mix(_oakLight * (0.72 + _lum * 0.95), _oakFrame, clamp(_isFrame * 0.78 + (1.0 - smoothstep(0.08, 0.26, _lum)) * 0.55, 0.0, 0.92));',
          '  _crateCol = mix(_crateCol, vec3(0.95, 0.68, 0.18), _diag * 0.45);',
          '  diffuseColor.rgb = _crateCol;'
        ].join('\n');
      } else if (kind === 'tnt') {
        // Vibrant crimson (#E63946) barrel + dark iron hoops + glowing yellow/white hazard band!
        bodyRule = [
          '  float _absY = abs(vGqcLocalPos.y);',
          '  float _band = 1.0 - smoothstep(0.07, 0.11, _absY);',
          '  float _hoop = smoothstep(0.22, 0.25, _absY) * (1.0 - smoothstep(0.30, 0.33, _absY));',
          '  vec3 _crimson = vec3(0.79, 0.045, 0.065) * (0.82 + diffuseColor.r * 0.45);',
          '  vec3 _col = mix(_crimson, vec3(0.05, 0.045, 0.07), _hoop * 0.88);',
          '  _col = mix(_col, vec3(1.0, 0.76, 0.12), _band * 0.92);',
          '  diffuseColor.rgb = _col;'
        ].join('\n');
      } else if (kind === 'stone') {
        // Warm sunlit limestone (#F0E2C8) with carved bevel contrast (#A89478)
        bodyRule = [
          '  float _sLum = clamp(dot(diffuseColor.rgb, vec3(0.33, 0.50, 0.17)), 0.18, 1.0);',
          '  diffuseColor.rgb = mix(vec3(0.38, 0.29, 0.20), vec3(0.88, 0.76, 0.56), smoothstep(0.18, 0.75, _sLum));'
        ].join('\n');
      } else if (kind === 'beam') {
        bodyRule = [
          '  float _bLum = clamp(dot(diffuseColor.rgb, vec3(0.33, 0.50, 0.17)), 0.15, 1.0);',
          '  diffuseColor.rgb = vec3(0.66, 0.33, 0.095) * (0.65 + _bLum * 0.75);'
        ].join('\n');
      }

      if (bodyRule) {
        shader.fragmentShader = 'varying vec3 vGqcLocalPos;\n' +
          shader.fragmentShader.replace(
            '#include <color_fragment>',
            '#include <color_fragment>\n{\n' + bodyRule + '\n}'
          );
      }
    };
    mat.customProgramCacheKey = function () {
      return 'gqc_tgt_' + kind + '_' + (mat.uuid || '');
    };
    mat.needsUpdate = true;
    return mat;
  }

  function addBlobShadow(targetObj, rx, rz, opacity, yOffset) {
    if (!targetObj) return null;
    // Accept both (targetObj, rx, rz, opacity, yOffset) AND (targetObj, r, { y, opacity, rz })
    if (rz && typeof rz === 'object') {
      var opts = rz;
      rz = opts.rz != null ? Number(opts.rz) : Number(rx);
      opacity = opts.opacity != null ? opts.opacity : opacity;
      yOffset = opts.y != null ? opts.y : (opts.yOffset != null ? opts.yOffset : yOffset);
    }
    var rX = (typeof rx === 'number' && isFinite(rx) && rx > 0) ? rx : 0.6;
    var rZ = (typeof rz === 'number' && isFinite(rz) && rz > 0) ? rz : rX;
    targetObj.traverse(function (n) {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    var mat = new T3.MeshBasicMaterial({
      map: getBlobShadowTexture(),
      transparent: true,
      opacity: opacity != null ? opacity : 0.65,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3
    });
    var mesh = new T3.Mesh(new T3.PlaneGeometry(rX * 2, rZ * 2), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = (typeof yOffset === 'number' && isFinite(yOffset)) ? yOffset : 0.025;
    mesh.renderOrder = 2;
    mesh.name = 'gqc-blob-shadow';
    targetObj.add(mesh);
    return mesh;
  }

  function applyCommercialAtmosphere(renderer, scene, themeName, opts) {
    opts = opts || {};
    var cfg = Object.assign({}, THEMES[themeName] || THEMES.island, opts);

    // 1. Commercial Color Management & Shadow Pipeline (compatible with both Three 0.169 and r128)
    if (T3.SRGBColorSpace) renderer.outputColorSpace = T3.SRGBColorSpace;
    else if (T3.sRGBEncoding) renderer.outputEncoding = T3.sRGBEncoding;
    renderer.toneMapping = T3.ACESFilmicToneMapping;
    renderer.toneMappingExposure = cfg.exposure != null ? cfg.exposure : 1.05;
    var isLowGpu = !!(root.K3 && (root.K3.LOW_GPU || root.K3.MOBILE));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isLowGpu ? T3.PCFShadowMap : T3.PCFSoftShadowMap;
    renderer.autoClear = true;

    var oldObjs = [];
    scene.traverse(function (n) {
      if ((n.isLight && !n.userData.keepLight) || n.name === 'gqc-sky-dome' || n.name === 'gqc-clouds') {
        oldObjs.push(n);
      }
    });
    oldObjs.forEach(function (l) { if (l.parent) l.parent.remove(l); });

    // 2. Calibrated Sunlight vs. Fill Contrast:
    //    - HemisphereLight (0.55) so sandbars & turf retain crisp shadow depth
    //    - Warm Sun DirectionalLight (#FFF2D6, 2.5 @ [35, 45, 25] 3/4 side angle)
    //    - Warm Back Rim Light (#FFE4B5, 0.60, no shadow) so targets pop off water/turf!
    var hemi = new T3.HemisphereLight(cfg.hemiSky, cfg.hemiGround, cfg.hemiIntensity);
    hemi.position.set(0, 45, 0);
    hemi.name = 'gqc-hemi';
    scene.add(hemi);

    var sun = new T3.DirectionalLight(cfg.sunColor, cfg.sunIntensity);
    sun.position.fromArray(cfg.sunPos);
    sun.castShadow = true;
    var mapSz = isLowGpu ? 1024 : 2048;
    sun.shadow.mapSize.set(mapSz, mapSz);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    var sb = cfg.shadowBounds || 28;
    var sc = sun.shadow.camera;
    sc.left = -sb; sc.right = sb; sc.top = sb * 0.92; sc.bottom = -sb * 0.92;
    sc.near = 1.0; sc.far = 140;
    sc.updateProjectionMatrix();
    sun.name = 'gqc-sun';
    scene.add(sun);
    scene.add(sun.target);

    var rim = new T3.DirectionalLight(cfg.rimColor || 0xffe4b5, cfg.rimIntensity != null ? cfg.rimIntensity : 0.60);
    rim.position.fromArray(cfg.rimPos || [-22, 18, -34]);
    rim.castShadow = false;
    rim.name = 'gqc-rim';
    scene.add(rim);

    if (root.K3) root.K3.sun = sun;
    if (root.E3D && root.E3D.uSunDir) {
      root.E3D.uSunDir.value.copy(sun.position).normalize();
    }

    var envTex = buildStudioPMREM(renderer, cfg);
    if (envTex) {
      scene.environment = envTex;
      if ('environmentIntensity' in scene) scene.environmentIntensity = cfg.envIntensity;
    }

    // 3. Subtle Atmospheric Depth: Low-Density FogExp2 (0.0022..0.0030 — zero milky whiteout!)
    scene.fog = new T3.FogExp2(cfg.fogColor, cfg.fogDensity);

    var skyDome = createGradientSkyDome(cfg, root.E3D && root.E3D.uSunDir);
    scene.add(skyDome);

    var clouds = null;
    if (cfg.clouds !== false) {
      clouds = createDriftingClouds((root.K3 && root.K3.MOBILE) ? 8 : 11, { spanX: 78 });
      scene.add(clouds);
    }

    return {
      theme: cfg,
      sun: sun,
      hemi: hemi,
      rim: rim,
      skyDome: skyDome,
      clouds: clouds,
      update: function (timeSec, activeCamera) {
        if (skyDome && activeCamera) skyDome.position.copy(activeCamera.position);
        if (clouds && clouds.userData.update) clouds.userData.update(timeSec);
      }
    };
  }

  GQC.Atmosphere = {
    THEMES: THEMES,
    applyCommercialAtmosphere: applyCommercialAtmosphere,
    gradeEnvironment: gradeEnvironment,
    gradeTargetMaterial: gradeTargetMaterial,
    addBlobShadow: addBlobShadow,
    getBlobShadowTexture: getBlobShadowTexture
  };
  root.applyCommercialAtmosphere = applyCommercialAtmosphere;
})(typeof window !== 'undefined' ? window : this);
