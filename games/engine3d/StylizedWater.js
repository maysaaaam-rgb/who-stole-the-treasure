/* games/engine3d/StylizedWater.js
 * GameQualityCore — Module 2: Cohesive Tropical Turquoise-to-Cerulean Ocean
 * (#26C6DA shallow -> #1282C8 mid -> #0D5EA6 deep), Dual-Layer Animated Wave Normals,
 * Crisp White Shoreline Foam Rings, Soft Golden Sun Shimmer & Low-Density FogExp2 Blend.
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var GQC = root.GameQualityCore = root.GameQualityCore || {};

  var MAX_COLLIDERS = 16;
  var _colliders = [];
  for (var i = 0; i < MAX_COLLIDERS; i++) {
    _colliders.push(new T3.Vector4(9999, 9999, 0, 0));
  }

  var uTime = (root.E3D && root.E3D.uTime) ? root.E3D.uTime : { value: 0 };
  var uSunDir = (root.E3D && root.E3D.uSunDir) ? root.E3D.uSunDir : { value: new T3.Vector3(35, 45, 25).normalize() };

  function sampleWaveHeight(x, z, t) {
    var w1 = Math.sin(x * 0.28 + z * 0.19 + t * 1.65) * 0.15;
    var w2 = Math.cos(x * 0.17 - z * 0.31 + t * 1.22) * 0.10;
    var w3 = Math.sin((x + z) * 0.52 - t * 2.15) * 0.04;
    return w1 + w2 + w3;
  }

  var _activeColliderCount = { value: 0 };
  var _waterNoiseTex = null;
  function getWaterNoiseTex() {
    if (_waterNoiseTex) return _waterNoiseTex;
    var S = 128, data = new Uint8Array(S * S * 4);
    function h(ix, iy) {
      var x = ((ix % S) + S) % S, y = ((iy % S) + S) % S;
      var v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return v - Math.floor(v);
    }
    function vn(px, py, per) {
      var x = px * per, y = py * per;
      var ix = Math.floor(x), iy = Math.floor(y);
      var fx = x - ix, fy = y - iy;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      var a = h(ix % per, iy % per), b = h((ix + 1) % per, iy % per);
      var c = h(ix % per, (iy + 1) % per), d = h((ix + 1) % per, (iy + 1) % per);
      return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
    }
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var u = x / S, v = y / S;
        var n1 = vn(u, v, 8) * 0.65 + vn(u, v, 16) * 0.35;
        var n2 = vn(u + 0.37, v + 0.61, 12) * 0.65 + vn(u + 0.37, v + 0.61, 24) * 0.35;
        var idx = (y * S + x) * 4;
        data[idx] = Math.round(n1 * 255);
        data[idx + 1] = Math.round(n2 * 255);
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
    var tex = new T3.DataTexture(data, S, S, T3.RGBAFormat);
    tex.wrapS = tex.wrapT = T3.RepeatWrapping;
    tex.minFilter = tex.magFilter = T3.LinearFilter;
    tex.needsUpdate = true;
    _waterNoiseTex = tex;
    return tex;
  }
  function recomputeColliderCount() {
    var mx = 0;
    for (var i = 0; i < MAX_COLLIDERS; i++) if (_colliders[i].z > 0.01) mx = i + 1;
    _activeColliderCount.value = mx;
  }

  function setCollider(idx, x, z, radius, strength) {
    if (idx < 0 || idx >= MAX_COLLIDERS) return;
    _colliders[idx].set(x, z, radius, strength == null ? 1.0 : strength);
    recomputeColliderCount();
    if (root.E3D && root.E3D.Shaders && root.E3D.Shaders.setFoamCollider) {
      root.E3D.Shaders.setFoamCollider(idx, x, z, radius, strength);
    }
  }

  function clearColliders(fromIdx) {
    for (var i = fromIdx || 0; i < MAX_COLLIDERS; i++) {
      _colliders[i].set(9999, 9999, 0, 0);
    }
    recomputeColliderCount();
    if (root.E3D && root.E3D.Shaders && root.E3D.Shaders.clearFoamColliders) {
      root.E3D.Shaders.clearFoamColliders(fromIdx);
    }
  }

  function createStylizedWater(opts) {
    opts = opts || {};
    var size = opts.size || 440;
    var isLow = !!(root.K3 && (root.K3.LOW_GPU || root.K3.MOBILE));
    var segs = opts.segments || (isLow ? 64 : 112);
    var geo = new T3.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI / 2);

    var mat = new T3.ShaderMaterial({
      transparent: false,
      depthWrite: true,
      uniforms: {
        uTime:          uTime,
        uSunDir:        uSunDir,
        uNoiseTex:      { value: getWaterNoiseTex() },
        uShallow:       { value: new T3.Color(opts.shallow    || 0x26c6da) },
        uMid:           { value: new T3.Color(opts.mid        || 0x1282c8) },
        uDeep:          { value: new T3.Color(opts.deep       || 0x0d5ea6) },
        uFoam:          { value: new T3.Color(opts.foam       || 0xffffff) },
        uFogColor:      { value: new T3.Color(opts.fogColor   || 0xe6f4ff) },
        uFogDensity:    { value: opts.fogDensity != null ? opts.fogDensity : 0.0026 },
        uColliders:     { value: _colliders },
        uColliderCount: _activeColliderCount
      },
      vertexShader: [
        'uniform float uTime;',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        'float waveH(float x, float z, float t) {',
        '  float w1 = sin(x * 0.28 + z * 0.19 + t * 1.65) * 0.15;',
        '  float w2 = cos(x * 0.17 - z * 0.31 + t * 1.22) * 0.10;',
        '  return w1 + w2;',
        '}',
        'void main() {',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  float h = waveH(wp.x, wp.z, uTime);',
        '  float hx = waveH(wp.x + 0.40, wp.z, uTime);',
        '  float hz = waveH(wp.x, wp.z + 0.40, uTime);',
        '  wp.y += h;',
        '  vWPos = wp.xyz;',
        '  vNormalW = normalize(vec3(h - hx, 0.42, h - hz));',
        '  vec4 vp = viewMatrix * wp;',
        '  vCamDist = length(vp.xyz);',
        '  gl_Position = projectionMatrix * vp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec3 uSunDir;',
        'uniform sampler2D uNoiseTex;',
        'uniform vec3 uShallow;',
        'uniform vec3 uMid;',
        'uniform vec3 uDeep;',
        'uniform vec3 uFoam;',
        'uniform vec3 uFogColor;',
        'uniform float uFogDensity;',
        'uniform vec4 uColliders[' + MAX_COLLIDERS + '];',
        'uniform int uColliderCount;',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        '',
        'void main() {',
        '  float minDist = 999.0;',
        '  float shoreStrength = 0.0;',
        '  for (int i = 0; i < ' + MAX_COLLIDERS + '; i++) {',
        '    if (i >= uColliderCount) break;',
        '    vec4 c = uColliders[i];',
        '    float d = length(vWPos.xz - c.xy) - c.z;',
        '    if (d < minDist) { minDist = d; shoreStrength = c.w; }',
        '  }',
        '',
        '  // Hardware-filtered scrolling wave textures (zero per-pixel hash/trig ALU!)',
        '  float n1 = texture2D(uNoiseTex, vWPos.xz * 0.048 + vec2(uTime * 0.031, -uTime * 0.022)).r;',
        '  float n2 = texture2D(uNoiseTex, vWPos.xz * 0.095 - vec2(uTime * 0.037, uTime * 0.027)).g;',
        '  float shallowMask = (1.0 - smoothstep(-0.5, 11.5, minDist)) * clamp(shoreStrength, 0.0, 1.0);',
        '  float bayGlow = smoothstep(95.0, 14.0, vCamDist);',
        '  float caustics = smoothstep(0.52, 0.78, (n1 + n2) * 0.5);',
        '',
        '  vec3 waterCol = mix(uDeep, uMid, bayGlow * 0.85 + n1 * 0.16);',
        '  waterCol = mix(waterCol, uShallow, clamp(shallowMask * 0.95 + bayGlow * 0.22, 0.0, 1.0));',
        '  waterCol += vec3(0.09, 0.16, 0.16) * caustics * (0.30 + shallowMask * 0.65);',
        '',
        '  // Crisp white animated double shoreline foam rings',
        '  float waveLap = sin(minDist * 3.3 - uTime * 3.0 + n1 * 2.0);',
        '  float outerRing = smoothstep(2.8, 0.18, minDist) * step(0.28, waveLap) * step(-0.35, minDist);',
        '  float beachEdge = smoothstep(0.62, -0.15, minDist) * step(-0.55, minDist);',
        '  float openCrests = smoothstep(0.81, 0.91, (n1 * 0.55 + n2 * 0.45)) * 0.22;',
        '  float foamMask = clamp((outerRing * 0.88 + beachEdge) * shoreStrength + openCrests, 0.0, 1.0);',
        '  waterCol = mix(waterCol, uFoam, foamMask);',
        '',
        '  // Dual-layer perturbed wave normal for warm sun specular shimmer',
        '  vec3 viewDir = normalize(cameraPosition - vWPos);',
        '  vec3 halfV = normalize(normalize(uSunDir) + viewDir);',
        '  vec3 dualN = normalize(vNormalW + vec3((n1 - n2) * 0.18, 0.0, (n1 + n2 - 1.0) * 0.18));',
        '  float spec = pow(max(0.0, dot(dualN, halfV)), 28.0);',
        '  waterCol += vec3(1.0, 0.96, 0.84) * smoothstep(0.28, 0.86, spec) * 0.30 * (1.0 - foamMask * 0.7);',
        '',
        '  // Low-density FogExp2 horizon blend (keeps rich blue-turquoise distance)',
        '  float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * vCamDist * vCamDist);',
        '  waterCol = mix(waterCol, uFogColor, clamp(fogFactor, 0.0, 0.78));',
        '  gl_FragColor = vec4(waterCol, 1.0);',
        '}'
      ].join('\n')
    });

    var mesh = new T3.Mesh(geo, mat);
    mesh.receiveShadow = false;
    mesh.name = 'gqc-stylized-water';
    return mesh;
  }

  GQC.Water = {
    createStylizedWater: createStylizedWater,
    sampleWaveHeight: sampleWaveHeight,
    setCollider: setCollider,
    clearColliders: clearColliders
  };
})(typeof window !== 'undefined' ? window : this);
