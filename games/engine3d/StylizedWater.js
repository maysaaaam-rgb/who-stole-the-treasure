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

  function setCollider(idx, x, z, radius, strength) {
    if (idx < 0 || idx >= MAX_COLLIDERS) return;
    _colliders[idx].set(x, z, radius, strength == null ? 1.0 : strength);
    if (root.E3D && root.E3D.Shaders && root.E3D.Shaders.setFoamCollider) {
      root.E3D.Shaders.setFoamCollider(idx, x, z, radius, strength);
    }
  }

  function clearColliders(fromIdx) {
    for (var i = fromIdx || 0; i < MAX_COLLIDERS; i++) {
      _colliders[i].set(9999, 9999, 0, 0);
    }
    if (root.E3D && root.E3D.Shaders && root.E3D.Shaders.clearFoamColliders) {
      root.E3D.Shaders.clearFoamColliders(fromIdx);
    }
  }

  function createStylizedWater(opts) {
    opts = opts || {};
    var size = opts.size || 440;
    var segs = opts.segments || ((root.K3 && root.K3.MOBILE) ? 96 : 140);
    var geo = new T3.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI / 2);

    var mat = new T3.ShaderMaterial({
      transparent: false,
      depthWrite: true,
      uniforms: {
        uTime:       uTime,
        uSunDir:     uSunDir,
        uShallow:    { value: new T3.Color(opts.shallow    || 0x26c6da) }, // Sunlit Caribbean turquoise
        uMid:        { value: new T3.Color(opts.mid        || 0x1282c8) }, // Bright tropical cerulean
        uDeep:       { value: new T3.Color(opts.deep       || 0x0d5ea6) }, // Rich sunlit ocean blue (never dark navy!)
        uFoam:       { value: new T3.Color(opts.foam       || 0xffffff) },
        uFogColor:   { value: new T3.Color(opts.fogColor   || 0xe6f4ff) },
        uFogDensity: { value: opts.fogDensity != null ? opts.fogDensity : 0.0026 },
        uColliders:  { value: _colliders }
      },
      vertexShader: [
        'uniform float uTime;',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        'float waveH(float x, float z, float t) {',
        '  float w1 = sin(x * 0.28 + z * 0.19 + t * 1.65) * 0.15;',
        '  float w2 = cos(x * 0.17 - z * 0.31 + t * 1.22) * 0.10;',
        '  float w3 = sin((x + z) * 0.52 - t * 2.15) * 0.04;',
        '  return w1 + w2 + w3;',
        '}',
        'void main() {',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  float h = waveH(wp.x, wp.z, uTime);',
        '  float hx = waveH(wp.x + 0.35, wp.z, uTime);',
        '  float hz = waveH(wp.x, wp.z + 0.35, uTime);',
        '  wp.y += h;',
        '  vWPos = wp.xyz;',
        '  vNormalW = normalize(vec3(h - hx, 0.38, h - hz));',
        '  vec4 vp = viewMatrix * wp;',
        '  vCamDist = length(vp.xyz);',
        '  gl_Position = projectionMatrix * vp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec3 uSunDir;',
        'uniform vec3 uShallow;',
        'uniform vec3 uMid;',
        'uniform vec3 uDeep;',
        'uniform vec3 uFoam;',
        'uniform vec3 uFogColor;',
        'uniform float uFogDensity;',
        'uniform vec4 uColliders[' + MAX_COLLIDERS + '];',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        '',
        'float hash21(vec2 p) {',
        '  p = fract(p * vec2(123.34, 456.21));',
        '  p += dot(p, p + 45.32);',
        '  return fract(p.x * p.y);',
        '}',
        'float vnoise(vec2 p) {',
        '  vec2 i = floor(p);',
        '  vec2 f = fract(p);',
        '  f = f * f * (3.0 - 2.0 * f);',
        '  float a = hash21(i);',
        '  float b = hash21(i + vec2(1.0, 0.0));',
        '  float c = hash21(i + vec2(0.0, 1.0));',
        '  float d = hash21(i + vec2(1.0, 1.0));',
        '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
        '}',
        '',
        'void main() {',
        '  float minDist = 999.0;',
        '  float shoreStrength = 0.0;',
        '  for (int i = 0; i < ' + MAX_COLLIDERS + '; i++) {',
        '    vec4 c = uColliders[i];',
        '    if (c.z > 0.01) {',
        '      float d = length(vWPos.xz - c.xy) - c.z;',
        '      if (d < minDist) { minDist = d; shoreStrength = c.w; }',
        '    }',
        '  }',
        '',
        '  // Dual-layer scrolling wave normals & sunlit tropical caustics',
        '  float n1 = vnoise(vWPos.xz * 0.38 + vec2(uTime * 0.25, -uTime * 0.18));',
        '  float n2 = vnoise(vWPos.xz * 0.78 - vec2(uTime * 0.30, uTime * 0.22));',
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
