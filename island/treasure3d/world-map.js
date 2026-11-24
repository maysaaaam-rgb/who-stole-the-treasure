/* island/treasure3d/world-map.js
 * Unity-Grade 3D Open-World Island Engine:
 * - Multi-Texture Painted Terrain Shader (grass.jpg, sand.jpg, gold-road.jpg, cliff.jpg + drifting cloud shadows)
 * - Depth-Feathered Translucent Tropical Ocean & Creek Shader (zero polygon sawtooths, visible sandy shallows, organic foam)
 * - 750 GPU Wind-Swaying 3D Grass Tufts + CC0 Flowers, Bushes, Ferns, Pebbles & Anchored Harbour Ship
 * - Ramped Wooden Creek Bridge, Elevated Lagoon Pier, Physical Archway Zone Gates & Bioluminescent Rock Cavern
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(e0, e1, x) {
    var t = clamp((x - e0) / (e1 - e0 || 1), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function dist2(ax, az, bx, bz) { return Math.hypot(ax - bx, az - bz); }
  function segInfo(px, pz, ax, az, bx, bz) {
    var vx = bx - ax, vz = bz - az;
    var l2 = vx * vx + vz * vz || 1;
    var t = clamp(((px - ax) * vx + (pz - az) * vz) / l2, 0, 1);
    var cx = ax + vx * t, cz = az + vz * t;
    return { t: t, d: Math.hypot(px - cx, pz - cz), x: cx, z: cz };
  }

  // World bounds for baked 256x256 Height & Trail DataTextures (shared by Terrain & Depth-Water Shaders!)
  var MAP_X0 = -68.0, MAP_X1 = 98.0;
  var MAP_Z0 = -66.0, MAP_Z1 = 74.0;

  var SPOTS = {
    spawn:          { x: -35.0, z: 39.2 },
    harbourShip:    { x: -46.5, z: 57.5 },
    benbowInn:      { x: -42.8, z: 27.8 },
    benbowNpc:      { x: -37.2, z: 32.8 },
    campfire:       { x: -29.8, z: 35.6 },
    hammock:        { x: -45.2, z: 37.2 },
    bottle1:        { x: -35.0, z: 48.0 }, // True 0.27m shallow wadeable turquoise bay!
    gate12:         { x: -21.0, z: 24.5 },

    pirateHut:      { x: -12.4, z: 7.8 },
    mapTable:       { x: -7.8,  z: 11.4 },
    soupPot:        { x: -4.2,  z: 12.6 },
    cookNpc:        { x: -5.5,  z: 12.2 },
    shellsCenter:   { x: -7.5,  z: 19.2 },
    creekBridgeA:   { x: 10.2,  z: 13.5 },
    creekBridgeB:   { x: 17.8,  z: 13.5 },

    captainNpc:     { x: 25.4,  z: 15.8 },
    lagoonDockStart:{ x: 27.5,  z: 14.0 },
    lagoonDockEnd:  { x: 39.2,  z: 14.0 },
    boatHome:       { x: 38.6,  z: 16.6 }, // Moored cleanly alongside dock (zero clipping!)
    boatWreckDock:  { x: 57.5,  z: 12.8 },
    wreckIsland:    { x: 68.5,  z: 12.0 },
    shipwreckModel: { x: 72.0,  z: 10.0 },
    wreckChest:     { x: 65.2,  z: 12.8 },

    gate34:         { x: 15.6,  z: -10.6 },
    ropeBridgeA:    { x: 14.2,  z: -13.6 },
    ropeBridgeB:    { x: 4.6,   z: -19.4 },
    flintNpc:       { x: 1.4,   z: -22.2 },
    stockadeFort:   { x: -3.8,  z: -28.0 },
    lookoutTower:   { x: 7.4,   z: -25.6 },
    waterfall:      { x: -13.8, z: -33.2 },
    caveMouth:      { x: -15.6, z: -35.2 },
    caveCenter:     { x: -18.8, z: -42.6 },

    gate45:         { x: -24.5, z: -20.5 },
    coveCaptNpc:    { x: -30.5, z: -16.8 },
    twinPalmA:      { x: -41.6, z: -14.0 },
    twinPalmB:      { x: -37.4, z: -17.0 },
    bigGreyRock:    { x: -40.4, z: -18.4 },
    mounds: [
      { id: 'mound-correct', correct: true,  x: -39.5, z: -15.5, label: 'Between Twin Palms & Big Rock' },
      { id: 'mound-barrel',  correct: false, x: -31.8, z: -9.8,  label: 'Near Old Barrel & Single Palm' },
      { id: 'mound-logs',    correct: false, x: -34.0, z: -22.2, label: 'Beside Dry Driftwood' },
      { id: 'mound-cliff',   correct: false, x: -45.2, z: -10.8, label: 'Near Cliff Seashells' }
    ]
  };

  var TRAIL_SEGMENTS = [
    [-36.5, 38.5, -36.5, 33.5],
    [-36.5, 33.5, -21.0, 24.5],
    [-21.0, 24.5, -6.5,  13.5],
    [-6.5,  13.5, 9.2,   13.5],
    [18.8,  13.5, 26.8,  14.0],
    [22.8,  13.5, 14.5, -13.2],
    [4.5,  -19.5, 1.5,  -23.0],
    [1.5,  -23.0, 8.2,  -26.0],
    [1.5,  -23.0, -14.8,-34.2],
    [-6.0, -23.5, -31.5,-16.5],
    [-31.5,-16.5, -39.5,-15.5]
  ];

  function getTrailDistance(x, z) {
    var best = 999;
    for (var i = 0; i < TRAIL_SEGMENTS.length; i++) {
      var s = TRAIL_SEGMENTS[i];
      var d = segInfo(x, z, s[0], s[1], s[2], s[3]).d;
      if (d < best) best = d;
    }
    return best;
  }

  // Sculpted Analytical Heightfield with True Deep-Water Lagoon, Deep Creek & Shallow Wadeable Bay!
  function sampleTerrainHeight(x, z) {
    var deepFloor = -3.8;
    var hMain = deepFloor;

    // Zone 1 lobe (Admiral Benbow Inn & Beach: x=-36, z=33)
    var dZ1 = Math.hypot((x + 36.5) / 19.5, (z - 32.5) / 14.5);
    var lobe1 = (1.0 - smoothstep(0.45, 1.05, dZ1)) * 5.05 + deepFloor;

    // Zone 1 Shallow Wadeable Turquoise Bay Shelf around Bottle #1 (-35, 48.0 -> exact y = -0.26m!)
    var dBay = Math.hypot((x + 35.0) / 11.5, (z - 46.8) / 7.2);
    var bayShelf = lerp(deepFloor, -0.25, 1.0 - smoothstep(0.42, 1.02, dBay));
    // Smooth beach slope connecting Zone 1 dry sand (z=40, y=+0.55) into shallow bay (z=45, y=-0.25)
    var dBeachSlope = Math.hypot((x + 35.5) / 13.0, (z - 41.5) / 5.2);
    var beachBridge = lerp(deepFloor, 0.32, 1.0 - smoothstep(0.45, 1.05, dBeachSlope));

    // Zone 2 lobe (Central Jungle Camp: x=-3.5, z=13.5)
    var dZ2 = Math.hypot((x + 3.5) / 20.5, (z - 13.5) / 17.5);
    var lobe2 = (1.0 - smoothstep(0.48, 1.04, dZ2)) * 5.25 + deepFloor;
    // Neck connecting Zone 1 Gate (-21, 24.5) smoothly to Zone 2
    var neck12 = segInfo(x, z, -34.0, 32.0, -8.0, 14.5);
    var lobeNeck12 = (1.0 - smoothstep(5.5, 12.5, neck12.d)) * 5.15 + deepFloor;

    // Zone 3 lobe (East Lagoon Shore: ends sharply at x=33 so x=35..57 is 100% DEEP CERULEAN LAGOON!)
    var dZ3 = Math.hypot((x - 23.5) / 10.5, (z - 14.0) / 13.5);
    var lobe3 = (1.0 - smoothstep(0.42, 1.02, dZ3)) * 5.00 + deepFloor;

    // Highland Trail from Zone 3 (22, 7) up to Rope Bridge (14.5, -13.2)
    var ridgeApp = segInfo(x, z, 22.5, 8.5, 14.5, -13.2);
    var lobeApproach = (1.0 - smoothstep(3.8, 9.2, ridgeApp.d)) * (5.05 + ridgeApp.t * 2.95) + deepFloor;

    // Zone 4 lobe (North Highlands: Tower, Fort, Waterfall: y = +4.2m)
    var dZ4 = Math.hypot((x + 3.5) / 22.0, (z + 26.5) / 14.0);
    var lobe4 = (1.0 - smoothstep(0.52, 1.04, dZ4)) * 8.00 + deepFloor;

    // Cave Interior Floor Plateau (-18.8, -42.6 -> flat y = +4.15m)
    var dCave = Math.hypot((x + 18.5) / 10.8, (z + 41.5) / 10.0);
    var lobeCave = (1.0 - smoothstep(0.65, 1.04, dCave)) * 7.95 + deepFloor;

    // Zone 5 lobe (Sunset Treasure Cove: sandy clearing around -39.5, -15.5)
    var dZ5 = Math.hypot((x + 38.0) / 14.5, (z + 15.5) / 13.5);
    var lobe5 = (1.0 - smoothstep(0.48, 1.04, dZ5)) * 5.35 + deepFloor;

    // Path linking Zone 4 (-12, -23.5) down to Zone 5 (-31, -16.8)
    var coveLink = segInfo(x, z, -12.0, -23.5, -31.5, -16.8);
    var lobeLink = (1.0 - smoothstep(3.4, 8.0, coveLink.d)) * lerp(7.95, 5.45, coveLink.t) + deepFloor;

    hMain = Math.max(hMain, lobe1, bayShelf, beachBridge, lobe2, lobeNeck12, lobe3, lobeApproach, lobe4, lobeCave, lobe5, lobeLink);

    // Carve TRUE DEEP SPARKLING CREEK between Zone 2 and Zone 3 (y = -0.95m -> impassable without fixing Creek Bridge!)
    var creekA = segInfo(x, z, -12.5, -31.5, 14.0, 13.5);
    var creekB = segInfo(x, z, 14.0, 13.5, 15.5, 36.0);
    var dCreek = Math.min(creekA.d, creekB.d);
    if (dCreek < 4.2 && z > -24.5) {
      var cut = 1.0 - smoothstep(1.6, 4.0, dCreek);
      hMain = lerp(hMain, -0.95, cut);
    }

    // Carve Dramatic Highland Gorge under Swaying Rope Bridge ([14.2, -13.6] -> [4.6, -19.4])
    var gorgeLine = segInfo(x, z, 8.2, -10.2, 11.2, -23.2);
    if (gorgeLine.d < 4.4 && x > 3.5 && x < 16.5 && z < -8.0 && z > -23.5) {
      var gCut = 1.0 - smoothstep(1.5, 4.2, gorgeLine.d);
      hMain = lerp(hMain, -1.25, gCut);
    }

    // Offshore Shipwreck Island centered at (68.5, 12.0) — cleanly separated across deep lagoon (x=34..58)!
    var dWreck = Math.hypot((x - 68.5) / 11.5, (z - 12.0) / 10.2);
    var hWreck = (1.0 - smoothstep(0.42, 1.02, dWreck)) * 5.25 + deepFloor;
    var dWreckLanding = Math.hypot((x - 60.2) / 3.8, (z - 12.8) / 3.8);
    var hWreckLanding = (1.0 - smoothstep(0.35, 1.0, dWreckLanding)) * 4.25 + deepFloor;

    var h = Math.max(hMain, hWreck, hWreckLanding);

    // Gentle natural hillock micro-relief on high ground (kept flat on key plazas & cave!)
    if (h > 0.65 && dist2(x, z, SPOTS.caveCenter.x, SPOTS.caveCenter.z) > 10.0) {
      h += Math.sin(x * 0.18 + z * 0.14) * Math.cos(x * 0.12 - z * 0.19) * 0.10 * smoothstep(0.65, 1.8, h);
    }
    return h;
  }

  // Bake 256x256 Height & Trail DataTexture once (< 4ms!) for pixel-perfect GLSL Water Depth & Road Blending
  function bakeWorldDataTexture() {
    var S = 256;
    var data = new Uint8Array(S * S * 4);
    for (var iy = 0; iy < S; iy++) {
      var wz = lerp(MAP_Z0, MAP_Z1, iy / (S - 1));
      for (var ix = 0; ix < S; ix++) {
        var wx = lerp(MAP_X0, MAP_X1, ix / (S - 1));
        var h = sampleTerrainHeight(wx, wz);
        var td = getTrailDistance(wx, wz);
        var coveSand = smoothstep(7.5, 2.5, dist2(wx, wz, -39.5, -15.5));
        // Encode height [-4.0 .. +6.0] in R+G (16-bit precision!) so water shoreline is sub-millimeter smooth!
        var hNorm = clamp((h + 4.0) / 10.0, 0, 1);
        var h16 = Math.round(hNorm * 65535);
        var trailMask = Math.round((1.0 - smoothstep(1.1, 2.3, td)) * 255);
        var idx = (iy * S + ix) * 4;
        data[idx]     = (h16 >> 8) & 255;
        data[idx + 1] = h16 & 255;
        data[idx + 2] = trailMask;
        data[idx + 3] = Math.round(coveSand * 255);
      }
    }
    var tex = new T3.DataTexture(data, S, S, T3.RGBAFormat);
    tex.wrapS = tex.wrapT = T3.ClampToEdgeWrapping;
    tex.minFilter = tex.magFilter = T3.LinearFilter;
    tex.flipY = false;
    tex.needsUpdate = true;
    return tex;
  }

  // Unity-Grade Translucent Depth-Feathered Tropical Ocean & Creek Shader
  function createDepthAwareWater(worldDataTex, uTime) {
    var W = MAP_X1 - MAP_X0 + 180;
    var D = MAP_Z1 - MAP_Z0 + 180;
    var cx = (MAP_X0 + MAP_X1) * 0.5;
    var cz = (MAP_Z0 + MAP_Z1) * 0.5;
    var segs = (root.K3 && root.K3.MOBILE) ? 72 : 128;
    var geo = new T3.PlaneGeometry(W, D, segs, segs);
    geo.rotateX(-Math.PI / 2);
    geo.translate(cx, 0, cz);

    var texLoader = new T3.TextureLoader();
    var waterRipTex = texLoader.load('../assets/3d/home/tex/water.jpg');
    waterRipTex.wrapS = waterRipTex.wrapT = T3.RepeatWrapping;

    var mat = new T3.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime:       uTime || { value: 0 },
        uWorldData:  { value: worldDataTex },
        uRippleTex:  { value: waterRipTex },
        uMapBounds:  { value: new T3.Vector4(MAP_X0, MAP_Z0, MAP_X1 - MAP_X0, MAP_Z1 - MAP_Z0) },
        uSunDir:     { value: new T3.Vector3(0.45, 0.72, 0.42).normalize() },
        uShallow:    { value: new T3.Color(0x3ce6dc) },
        uMid:        { value: new T3.Color(0x1694d8) },
        uDeep:       { value: new T3.Color(0x0c569e) },
        uFogColor:   { value: new T3.Color(0xe6f5ff) },
        uFogDensity: { value: 0.0022 }
      },
      vertexShader: [
        'uniform float uTime;',
        'uniform sampler2D uWorldData;',
        'uniform vec4 uMapBounds;',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        'float sampleGroundY(vec2 xz) {',
        '  vec2 uv = clamp((xz - uMapBounds.xy) / uMapBounds.zw, 0.0, 1.0);',
        '  vec4 d = texture2D(uWorldData, uv);',
        '  float hNorm = (d.r * 255.0 * 256.0 + d.g * 255.0) / 65535.0;',
        '  return hNorm * 10.0 - 4.0;',
        '}',
        'float waveFn(vec2 p, float t) {',
        '  return sin(p.x * 0.32 + p.y * 0.21 + t * 1.6) * 0.08 + cos(p.x * 0.19 - p.y * 0.34 + t * 1.25) * 0.06;',
        '}',
        'void main() {',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  float gy = sampleGroundY(wp.xz);',
        '  float depth = max(0.0, -gy);',
        '  // Dampen wave height strictly to 0 at shorelines so water NEVER pokes jagged triangles through sand!',
        '  float amp = smoothstep(0.18, 1.65, depth);',
        '  float h  = waveFn(wp.xz, uTime) * amp;',
        '  float hx = waveFn(wp.xz + vec2(0.4, 0.0), uTime) * amp;',
        '  float hz = waveFn(wp.xz + vec2(0.0, 0.4), uTime) * amp;',
        '  wp.y += h;',
        '  vWPos = wp.xyz;',
        '  vNormalW = normalize(vec3(h - hx, 0.45, h - hz));',
        '  vec4 vp = viewMatrix * wp;',
        '  vCamDist = length(vp.xyz);',
        '  gl_Position = projectionMatrix * vp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform sampler2D uWorldData;',
        'uniform sampler2D uRippleTex;',
        'uniform vec4 uMapBounds;',
        'uniform vec3 uSunDir;',
        'uniform vec3 uShallow;',
        'uniform vec3 uMid;',
        'uniform vec3 uDeep;',
        'uniform vec3 uFogColor;',
        'uniform float uFogDensity;',
        'varying vec3 vWPos;',
        'varying vec3 vNormalW;',
        'varying float vCamDist;',
        'float sampleGroundY(vec2 xz) {',
        '  vec2 inMap = step(uMapBounds.xy, xz) * step(xz, uMapBounds.xy + uMapBounds.zw);',
        '  if (inMap.x * inMap.y < 0.5) return -3.8;',
        '  vec2 uv = (xz - uMapBounds.xy) / uMapBounds.zw;',
        '  vec4 d = texture2D(uWorldData, uv);',
        '  float hNorm = (d.r * 255.0 * 256.0 + d.g * 255.0) / 65535.0;',
        '  return hNorm * 10.0 - 4.0;',
        '}',
        'void main() {',
        '  float gy = sampleGroundY(vWPos.xz);',
        '  float depth = -gy;',
        '  if (depth <= 0.004) discard;',
        '',
        '  vec3 r1 = texture2D(uRippleTex, vWPos.xz * 0.065 + vec2(uTime * 0.022, -uTime * 0.018)).rgb;',
        '  vec3 r2 = texture2D(uRippleTex, vWPos.xz * 0.115 - vec2(uTime * 0.028, uTime * 0.021)).rgb;',
        '  float caustic = smoothstep(0.45, 0.85, (r1.g + r2.b) * 0.5);',
        '',
        '  // Smooth depth color gradient: crystal aqua shallows -> turquoise lagoon -> deep cerulean sea',
        '  vec3 col = mix(uShallow, uMid, smoothstep(0.18, 1.35, depth));',
        '  col = mix(col, uDeep, smoothstep(1.25, 3.30, depth));',
        '  col += vec3(0.14, 0.22, 0.20) * caustic * (1.0 - smoothstep(0.1, 2.2, depth));',
        '',
        '  // Soft organic curved shoreline foam waves (strictly along real coastline depth 0.01..0.48m)',
        '  float shoreZone = 1.0 - smoothstep(0.04, 0.52, depth);',
        '  float lap = sin(depth * 22.0 + uTime * 3.1 + r1.r * 3.2);',
        '  float outerFoam = shoreZone * smoothstep(0.32, 0.75, lap) * smoothstep(0.02, 0.08, depth);',
        '  float lipFoam = 1.0 - smoothstep(0.005, 0.065, depth);',
        '  float foam = clamp(outerFoam * 0.78 + lipFoam * 0.88, 0.0, 1.0);',
        '  col = mix(col, vec3(0.98, 0.99, 1.0), foam);',
        '',
        '  // Sun specular sparkle',
        '  vec3 viewDir = normalize(cameraPosition - vWPos);',
        '  vec3 nrm = normalize(vNormalW + vec3((r1.r - r2.r) * 0.22, 0.0, (r1.g - r2.g) * 0.22));',
        '  vec3 halfV = normalize(normalize(uSunDir) + viewDir);',
        '  float spec = pow(max(0.0, dot(nrm, halfV)), 48.0);',
        '  col += vec3(1.0, 0.96, 0.84) * spec * 0.55;',
        '',
        '  // Aerial fog blend',
        '  float fogF = 1.0 - exp(-uFogDensity * uFogDensity * vCamDist * vCamDist);',
        '  col = mix(col, uFogColor, clamp(fogF, 0.0, 1.0));',
        '',
        '  // Translucent alpha feathering at shallow shoreline so golden wet sand shines through!',
        '  float alpha = clamp(smoothstep(0.004, 0.24, depth) * 0.88 + smoothstep(0.24, 1.1, depth) * 0.12 + foam * 0.85, 0.0, 0.98);',
        '  gl_FragColor = vec4(col, alpha);',
        '}'
      ].join('\n')
    });

    var mesh = new T3.Mesh(geo, mat);
    mesh.renderOrder = 2;
    mesh.name = 'ti-depth-water';
    return mesh;
  }

  function createWorldMap(scene, loader, opts) {
    opts = opts || {};
    var worldGroup = new T3.Group();
    worldGroup.name = 'treasure3d-world';
    scene.add(worldGroup);

    var uWorldTime = { value: 0 };
    var worldDataTex = bakeWorldDataTexture();

    var state = {
      bridgePlanksFixed: 0,
      gatesOpen: { 1: false, 3: false, 4: false },
      onTower: false,
      ropePlankMeshes: [],
      ropePlankDips: [0, 0, 0, 0, 0, 0, 0, 0],
      creekPlankMeshes: [],
      creekGhostMeshes: [],
      gateMeshes: {},
      shellObjs: [],
      plankPickups: [],
      caveTorches: [],
      moundObjs: [],
      occluderTrees: [], // Faded smoothly if between camera and hero!
      worldLabels: [],   // Crisp CSS 2D screen-space labels { id, text, color, pos, maxDist, visible }
      wreckChestClosed: null,
      wreckChestOpen: null,
      finalChestClosed: null,
      finalChestOpen: null,
      bottle1Mesh: null,
      soupPotPos: new T3.Vector3(SPOTS.soupPot.x, 0, SPOTS.soupPot.z),
      campfirePos: new T3.Vector3(SPOTS.campfire.x, 0, SPOTS.campfire.z),
      hammockPos: new T3.Vector3(SPOTS.hammock.x, 0, SPOTS.hammock.z),
      colliders: []
    };

    function addCircleCollider(x, z, r, tag, gateId) {
      state.colliders.push({ x: x, z: z, r: r, tag: tag || 'prop', gateId: gateId || 0 });
    }

    function registerLabel(id, text, borderHex, x, y, z, maxDist) {
      var item = {
        id: id,
        text: text,
        borderHex: borderHex || '#4f9dff',
        pos: new T3.Vector3(x, y, z),
        maxDist: maxDist || 13.5,
        visible: true
      };
      state.worldLabels.push(item);
      return item;
    }

    // ---------- 1. Multi-Texture Painted Terrain (grass.jpg + sand.jpg + gold-road.jpg + cliff.jpg) ----------
    var W_SIZE = MAP_X1 - MAP_X0, D_SIZE = MAP_Z1 - MAP_Z0;
    var W_SEGS = 192, D_SEGS = 160;
    var terrainGeo = new T3.PlaneGeometry(W_SIZE, D_SIZE, W_SEGS, D_SEGS);
    terrainGeo.rotateX(-Math.PI / 2);
    terrainGeo.translate((MAP_X0 + MAP_X1) * 0.5, 0, (MAP_Z0 + MAP_Z1) * 0.5);

    var posAttr = terrainGeo.attributes.position;
    for (var vi = 0; vi < posAttr.count; vi++) {
      posAttr.setY(vi, sampleTerrainHeight(posAttr.getX(vi), posAttr.getZ(vi)));
    }
    terrainGeo.computeVertexNormals();

    var tLoader = new T3.TextureLoader();
    function loadTileTex(file) {
      var t = tLoader.load('../assets/3d/home/tex/' + file);
      t.wrapS = t.wrapT = T3.RepeatWrapping;
      if (T3.SRGBColorSpace) t.colorSpace = T3.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    }
    var texGrass = loadTileTex('grass.jpg');
    var texSand  = loadTileTex('sand.jpg');
    var texRoad  = loadTileTex('gold-road.jpg');
    var texCliff = loadTileTex('cliff.jpg');

    var terrainMat = new T3.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.86,
      metalness: 0.02
    });
    terrainMat.onBeforeCompile = function (shader) {
      shader.uniforms.uGrassTex  = { value: texGrass };
      shader.uniforms.uSandTex   = { value: texSand };
      shader.uniforms.uRoadTex   = { value: texRoad };
      shader.uniforms.uCliffTex  = { value: texCliff };
      shader.uniforms.uWorldData = { value: worldDataTex };
      shader.uniforms.uMapBounds = { value: new T3.Vector4(MAP_X0, MAP_Z0, MAP_X1 - MAP_X0, MAP_Z1 - MAP_Z0) };
      shader.uniforms.uCaveCtr   = { value: new T3.Vector2(SPOTS.caveCenter.x, SPOTS.caveCenter.z) };
      shader.uniforms.uTime      = uWorldTime;

      shader.vertexShader = 'varying vec3 vTiPos;\nvarying vec3 vTiNorm;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n  vTiPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\n  vTiNorm = normalize(mat3(modelMatrix) * objectNormal);'
      );

      shader.fragmentShader = [
        'uniform sampler2D uGrassTex;',
        'uniform sampler2D uSandTex;',
        'uniform sampler2D uRoadTex;',
        'uniform sampler2D uCliffTex;',
        'uniform sampler2D uWorldData;',
        'uniform vec4 uMapBounds;',
        'uniform vec2 uCaveCtr;',
        'uniform float uTime;',
        'varying vec3 vTiPos;',
        'varying vec3 vTiNorm;'
      ].join('\n') + '\n' + shader.fragmentShader.replace(
        '#include <map_fragment>',
        [
          'vec2 mUv = clamp((vTiPos.xz - uMapBounds.xy) / uMapBounds.zw, 0.0, 1.0);',
          'vec4 mInfo = texture2D(uWorldData, mUv);',
          'float roadMask = mInfo.b;',
          'float coveSandMask = mInfo.a;',
          '',
          'vec3 grassC = texture2D(uGrassTex, vTiPos.xz * 0.14).rgb * vec3(0.96, 1.04, 0.88);',
          'vec3 sandC  = texture2D(uSandTex,  vTiPos.xz * 0.16).rgb * vec3(1.04, 0.99, 0.90);',
          'vec3 roadC  = texture2D(uRoadTex,  vTiPos.xz * 0.22).rgb * vec3(1.04, 0.98, 0.88);',
          'vec3 cliffC = texture2D(uCliffTex, vec2((vTiPos.x + vTiPos.z) * 0.11, vTiPos.y * 0.22)).rgb;',
          '',
          '// Beach & wet-shoreline blending',
          'float isWreckSand = smoothstep(55.0, 61.0, vTiPos.x) * (1.0 - smoothstep(0.95, 1.55, vTiPos.y));',
          'float sandMask = clamp((1.0 - smoothstep(0.42, 0.92, vTiPos.y)) + isWreckSand + coveSandMask * 0.92, 0.0, 1.0);',
          'float wetMask = 1.0 - smoothstep(-0.08, 0.26, vTiPos.y);',
          'vec3 wetSandC = sandC * vec3(0.74, 0.68, 0.60);',
          'vec3 baseSurf = mix(grassC, mix(sandC, wetSandC, wetMask), sandMask);',
          '',
          '// Storybook golden path & steep terracotta cliffs',
          'baseSurf = mix(baseSurf, roadC, roadMask * (1.0 - wetMask) * 0.88);',
          'float cliffMask = smoothstep(0.78, 0.50, vTiNorm.y) * smoothstep(0.15, 0.65, vTiPos.y);',
          'baseSurf = mix(baseSurf, cliffC, cliffMask * 0.92);',
          '',
          '// Cavern stone floor inside Dark Waterfall Cave',
          'float caveD = length(vTiPos.xz - uCaveCtr);',
          'float caveFlr = 1.0 - smoothstep(6.8, 10.2, caveD);',
          'baseSurf = mix(baseSurf, cliffC * vec3(0.45, 0.48, 0.60), caveFlr);',
          '',
          '// Gentle drifting sunlit cloud shadows across the island!',
          'float cloudSh = sin(vTiPos.x * 0.055 + uTime * 0.14) * cos(vTiPos.z * 0.048 - uTime * 0.11);',
          'baseSurf *= (1.0 - smoothstep(0.35, 0.85, cloudSh) * 0.10 * (1.0 - caveFlr));',
          '',
          'diffuseColor.rgb *= baseSurf;'
        ].join('\n')
      );
    };
    terrainMat.customProgramCacheKey = function () { return 'ti3d_terrain_v2'; };

    var terrainMesh = new T3.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    worldGroup.add(terrainMesh);

    // ---------- 2. Depth-Feathered Tropical Ocean & Creek ----------
    var waterMesh = createDepthAwareWater(worldDataTex, uWorldTime);
    worldGroup.add(waterMesh);

    // ---------- 3. 750 GPU Wind-Swaying 3D Stylized Grass Tufts (1 Draw Call!) ----------
    (function buildLushGrassInstanced() {
      var bladeGeo = new T3.ConeGeometry(0.048, 0.25, 4);
      bladeGeo.translate(0, 0.12, 0);
      var grassMat = new T3.MeshLambertMaterial({ color: 0x7bd452 });
      grassMat.onBeforeCompile = function (sh) {
        sh.uniforms.uTime = uWorldTime;
        sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace(
          '#include <begin_vertex>',
          [
            '#include <begin_vertex>',
            '#ifdef USE_INSTANCING',
            '  vec3 iPos = instanceMatrix[3].xyz;',
            '  float sway = sin(uTime * 2.4 + iPos.x * 0.6 + iPos.z * 0.5) * 0.12 * smoothstep(0.0, 0.45, transformed.y);',
            '  transformed.x += sway;',
            '#endif'
          ].join('\n')
        );
      };
      var MAX_GRASS = (root.K3 && root.K3.MOBILE) ? 360 : 750;
      var im = new T3.InstancedMesh(bladeGeo, grassMat, MAX_GRASS);
      im.receiveShadow = true;
      var dummy = new T3.Object3D();
      var col = new T3.Color();
      var placed = 0, tries = 0;
      var seed = 1337;
      function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
      while (placed < MAX_GRASS && tries < MAX_GRASS * 8) {
        tries++;
        var gx = lerp(-49, 75, rnd());
        var gz = lerp(-36, 42, rnd());
        var gy = sampleTerrainHeight(gx, gz);
        if (gy < 0.92 || getTrailDistance(gx, gz) < 2.2) continue;
        if (dist2(gx, gz, SPOTS.caveCenter.x, SPOTS.caveCenter.z) < 12.0) continue;
        if (dist2(gx, gz, -39.5, -15.5) < 7.5) continue;
        dummy.position.set(gx, gy - 0.03, gz);
        dummy.rotation.set(0, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.18);
        var sc = 0.75 + rnd() * 0.75;
        dummy.scale.set(sc, sc * (0.85 + rnd() * 0.45), sc);
        dummy.updateMatrix();
        im.setMatrixAt(placed, dummy.matrix);
        col.setHSL(0.27 + (rnd() - 0.5) * 0.04, 0.56, 0.46 + (rnd() - 0.5) * 0.08);
        im.setColorAt(placed, col);
        placed++;
      }
      im.count = placed;
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      worldGroup.add(im);
    })();

    // ---------- 4. Ramped Creek Bridge, Elevated Lagoon Pier, Swaying Rope Bridge & Physical Zone Gates ----------
    var matWood = new T3.MeshStandardMaterial({ color: 0xb87338, roughness: 0.74 });
    var matDarkWood = new T3.MeshStandardMaterial({ color: 0x76431b, roughness: 0.82 });
    var matRope = new T3.MeshStandardMaterial({ color: 0xdcb774, roughness: 0.80 });
    var matGhost = new T3.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.45, depthWrite: false });

    // 4A. Ramped Creek Bridge (Zone 2 -> Zone 3: West Ramp x=8.2..10.2, Deck x=10.2..17.8 at y=1.74, East Ramp x=17.8..19.8)
    var creekBridgeGroup = new T3.Group();
    worldGroup.add(creekBridgeGroup);
    [-1.48, 1.48].forEach(function (zOff) {
      var beam = new T3.Mesh(new T3.BoxGeometry(8.0, 0.22, 0.24), matDarkWood);
      beam.position.set(14.0, 1.56, 13.5 + zOff);
      beam.castShadow = true;
      creekBridgeGroup.add(beam);
      // Handrails + posts so players stay neatly on the bridge deck!
      [10.2, 14.0, 17.8].forEach(function (px) {
        var post = new T3.Mesh(new T3.CylinderGeometry(0.14, 0.16, 3.2, 10), matDarkWood);
        post.position.set(px, 1.05, 13.5 + zOff);
        post.castShadow = true;
        creekBridgeGroup.add(post);
      });
      var topRail = new T3.Mesh(new T3.BoxGeometry(8.0, 0.12, 0.12), matRope);
      topRail.position.set(14.0, 2.52, 13.5 + zOff);
      creekBridgeGroup.add(topRail);
    });
    // Sloped wooden approach ramps at West (x=9.1) and East (x=18.9) ends!
    var westBankY = sampleTerrainHeight(8.2, 13.5);
    var eastBankY = sampleTerrainHeight(19.8, 13.5);
    var wRamp = new T3.Mesh(new T3.BoxGeometry(2.2, 0.16, 2.92), matWood);
    wRamp.position.set(9.2, (westBankY + 1.72) * 0.5, 13.5);
    wRamp.rotation.z = Math.atan2(1.72 - westBankY, 2.0);
    wRamp.castShadow = true; wRamp.receiveShadow = true;
    creekBridgeGroup.add(wRamp);

    var eRamp = new T3.Mesh(new T3.BoxGeometry(2.2, 0.16, 2.92), matWood);
    eRamp.position.set(18.8, (eastBankY + 1.72) * 0.5, 13.5);
    eRamp.rotation.z = -Math.atan2(1.72 - eastBankY, 2.0);
    eRamp.castShadow = true; eRamp.receiveShadow = true;
    creekBridgeGroup.add(eRamp);

    [10.55, 17.45].forEach(function (px) {
      var ep = new T3.Mesh(new T3.BoxGeometry(0.9, 0.18, 2.92), matWood);
      ep.position.set(px, 1.70, 13.5);
      ep.castShadow = true; ep.receiveShadow = true;
      creekBridgeGroup.add(ep);
    });
    for (var cp = 0; cp < 3; cp++) {
      var slotX = 12.0 + cp * 2.0;
      var solidPlank = new T3.Mesh(new T3.BoxGeometry(1.86, 0.18, 2.90), matWood);
      solidPlank.position.set(slotX, 1.70, 13.5);
      solidPlank.castShadow = true; solidPlank.receiveShadow = true;
      solidPlank.visible = false;
      creekBridgeGroup.add(solidPlank);
      state.creekPlankMeshes.push(solidPlank);

      var ghostPlank = new T3.Mesh(new T3.BoxGeometry(1.78, 0.10, 2.78), matGhost);
      ghostPlank.position.set(slotX, 1.68, 13.5);
      creekBridgeGroup.add(ghostPlank);
      state.creekGhostMeshes.push(ghostPlank);
    }

    // 4B. Proudly Elevated Wooden Lagoon Pier (Zone 3: Ramp x=25.6..27.6, Deck x=27.6..39.4 at y=1.18m above beach & sea!)
    var dockGroup = new T3.Group();
    worldGroup.add(dockGroup);
    var dockLandY = sampleTerrainHeight(25.6, 14.0);
    var dockRamp = new T3.Mesh(new T3.BoxGeometry(2.2, 0.16, 3.2), matWood);
    dockRamp.position.set(26.6, (dockLandY + 1.18) * 0.5, 14.0);
    dockRamp.rotation.z = Math.atan2(1.18 - dockLandY, 2.0);
    dockRamp.castShadow = true; dockRamp.receiveShadow = true;
    dockGroup.add(dockRamp);

    for (var di = 0; di < 11; di++) {
      var dx = 28.1 + di * 1.10;
      var dp = new T3.Mesh(new T3.BoxGeometry(0.98, 0.18, 3.3), matWood);
      dp.position.set(dx, 1.16, 14.0);
      dp.castShadow = true; dp.receiveShadow = true;
      dockGroup.add(dp);
      if (di % 2 === 0) {
        [-1.52, 1.52].forEach(function (zo) {
          var pole = new T3.Mesh(new T3.CylinderGeometry(0.15, 0.17, 4.4, 10), matDarkWood);
          pole.position.set(dx, -0.35, 14.0 + zo);
          pole.castShadow = true;
          dockGroup.add(pole);
        });
      }
    }

    // 4C. Canyon Swaying Rope Bridge ([14.2, -13.6] -> [4.6, -19.4] at y = 4.18)
    var rbA = new T3.Vector3(SPOTS.ropeBridgeA.x, 4.18, SPOTS.ropeBridgeA.z);
    var rbB = new T3.Vector3(SPOTS.ropeBridgeB.x, 4.18, SPOTS.ropeBridgeB.z);
    var rbYaw = Math.atan2(rbB.x - rbA.x, rbB.z - rbA.z);
    var rbGroup = new T3.Group();
    worldGroup.add(rbGroup);
    for (var ri = 0; ri < 8; ri++) {
      var rt = (ri + 0.5) / 8;
      var rPos = rbA.clone().lerp(rbB, rt);
      var sag = -Math.sin(rt * Math.PI) * 0.20;
      var rPlank = new T3.Mesh(new T3.BoxGeometry(2.6, 0.16, 1.18), matWood);
      rPlank.position.set(rPos.x, rPos.y + sag, rPos.z);
      rPlank.rotation.y = rbYaw;
      rPlank.userData.baseY = rPos.y + sag;
      rPlank.castShadow = true; rPlank.receiveShadow = true;
      rbGroup.add(rPlank);
      state.ropePlankMeshes.push(rPlank);
    }
    [-1.28, 1.28].forEach(function (sideOff) {
      var nx = Math.cos(rbYaw) * sideOff, nz = -Math.sin(rbYaw) * sideOff;
      var curve = new T3.CatmullRomCurve3([
        new T3.Vector3(rbA.x + nx, rbA.y + 1.05, rbA.z + nz),
        new T3.Vector3((rbA.x + rbB.x) * 0.5 + nx, rbA.y + 0.72, (rbA.z + rbB.z) * 0.5 + nz),
        new T3.Vector3(rbB.x + nx, rbB.y + 1.05, rbB.z + nz)
      ]);
      rbGroup.add(new T3.Mesh(new T3.TubeGeometry(curve, 16, 0.055, 8, false), matRope));
    });

    // 4D. Faceted Rock-Vaulted Dark Cave + Bioluminescent Mushrooms + Hanging Stalactites + Waterfall Curtain
    var caveRockMat = new T3.MeshStandardMaterial({
      color: 0x363d52,
      roughness: 0.90,
      metalness: 0.06,
      flatShading: true,
      side: T3.DoubleSide
    });
    // Low-poly faceted icosahedron cavern dome (looks like carved Unity stone instead of a smooth plastic ball!)
    var caveDomeGeo = new T3.IcosahedronGeometry(10.4, 2);
    var cdPos = caveDomeGeo.attributes.position;
    for (var ci = 0; ci < cdPos.count; ci++) {
      var cy = cdPos.getY(ci);
      if (cy < -0.5) cdPos.setY(ci, -0.5);
      else {
        var cx = cdPos.getX(ci), cz = cdPos.getZ(ci);
        var jag = 1.0 + Math.sin(cx * 1.1 + cz * 0.9) * 0.08;
        cdPos.setXYZ(ci, cx * jag, cy * 0.72, cz * jag);
      }
    }
    caveDomeGeo.computeVertexNormals();
    var caveShell = new T3.Mesh(caveDomeGeo, caveRockMat);
    caveShell.position.set(SPOTS.caveCenter.x, 3.95, SPOTS.caveCenter.z);
    worldGroup.add(caveShell);

    // Hanging rocky stalactites from cave ceiling!
    for (var st = 0; st < 12; st++) {
      var sa = (st / 12) * Math.PI * 2 + 0.3;
      var sr = 3.2 + (st % 3) * 2.1;
      var stal = new T3.Mesh(new T3.ConeGeometry(0.38 + (st % 2) * 0.18, 1.8 + (st % 3) * 0.6, 6), caveRockMat);
      stal.rotation.x = Math.PI;
      stal.position.set(SPOTS.caveCenter.x + Math.cos(sa) * sr, 9.6, SPOTS.caveCenter.z + Math.sin(sa) * sr);
      worldGroup.add(stal);
    }

    for (var ca = 0; ca < 18; ca++) {
      var ang = (ca / 18) * Math.PI * 2;
      var wx = SPOTS.caveCenter.x + Math.cos(ang) * 9.6;
      var wz = SPOTS.caveCenter.z + Math.sin(ang) * 9.6;
      if (dist2(wx, wz, SPOTS.caveMouth.x, SPOTS.caveMouth.z) > 4.4) {
        addCircleCollider(wx, wz, 1.75, 'cave-wall', 0);
      }
    }

    var wfMat = new T3.MeshBasicMaterial({ color: 0x8cf2ff, transparent: true, opacity: 0.68, side: T3.DoubleSide });
    var wfCurtain = new T3.Mesh(new T3.PlaneGeometry(2.9, 5.6, 6, 12), wfMat);
    wfCurtain.position.set(SPOTS.waterfall.x + 0.8, 6.2, SPOTS.waterfall.z + 0.9);
    wfCurtain.rotation.y = 0.45;
    worldGroup.add(wfCurtain);

    // 3 Faceted Crystal Clusters on Carved Stone Altars inside Dark Cave
    var torchSpecs = [
      { idx: 0, x: SPOTS.caveCenter.x - 4.5, z: SPOTS.caveCenter.z - 2.4, color: 0xffb320, css: '#ffb320', g3: 'sun',  g4: 'courage' },
      { idx: 1, x: SPOTS.caveCenter.x + 0.2, z: SPOTS.caveCenter.z - 5.3, color: 0x4f9dff, css: '#4f9dff', g3: 'moon', g4: 'wisdom' },
      { idx: 2, x: SPOTS.caveCenter.x + 4.7, z: SPOTS.caveCenter.z - 2.0, color: 0xff5fa2, css: '#ff5fa2', g3: 'star', g4: 'treasure' }
    ];
    var altarStoneMat = new T3.MeshStandardMaterial({ color: 0x4f5870, roughness: 0.84, flatShading: true });
    torchSpecs.forEach(function (ts) {
      var tg = new T3.Group();
      var ty = sampleTerrainHeight(ts.x, ts.z);
      tg.position.set(ts.x, ty, ts.z);

      var base1 = new T3.Mesh(new T3.CylinderGeometry(0.72, 0.88, 0.36, 7), altarStoneMat);
      base1.position.y = 0.18;
      tg.add(base1);
      var base2 = new T3.Mesh(new T3.CylinderGeometry(0.48, 0.62, 0.78, 7), altarStoneMat);
      base2.position.y = 0.72;
      tg.add(base2);

      var cryMat = new T3.MeshStandardMaterial({
        color: ts.color,
        emissive: new T3.Color(ts.color),
        emissiveIntensity: 0.32,
        roughness: 0.18,
        metalness: 0.20,
        flatShading: true
      });
      var cGroup = new T3.Group();
      cGroup.position.y = 1.52;
      // 3-shard crystal cluster!
      [[0, 0, 0, 1.0, 0, 0], [-0.24, -0.18, 0.1, 0.62, 0, 0.35], [0.24, -0.20, -0.08, 0.58, 0, -0.38]].forEach(function (sp) {
        var shard = new T3.Mesh(new T3.OctahedronGeometry(0.42 * sp[3], 0), cryMat);
        shard.scale.set(0.72, 1.65, 0.72);
        shard.position.set(sp[0], sp[1], sp[2]);
        shard.rotation.set(sp[4], 0, sp[5]);
        cGroup.add(shard);
      });
      tg.add(cGroup);

      var ptLight = new T3.PointLight(ts.color, 0.35, 9.5);
      ptLight.position.y = 1.95;
      tg.add(ptLight);

      var lbl = registerLabel('torch-' + ts.idx, ts.g3.toUpperCase(), ts.css, ts.x, ty + 2.55, ts.z, 11.5);

      worldGroup.add(tg);
      state.caveTorches.push({
        idx: ts.idx,
        group: tg,
        crystal: cGroup,
        mat: cryMat,
        light: ptLight,
        label: lbl,
        lit: false,
        color: ts.color,
        g3: ts.g3,
        g4: ts.g4,
        x: ts.x,
        z: ts.z
      });
    });

    // 4E. Impressive Physical Pirate Timber Archway Gates (Swing Open Double Doors + Flanking Fences!)
    function createArchwayGate(gateId, x, z, yaw, colorHex, titleTxt) {
      var gy = sampleTerrainHeight(x, z);
      var gg = new T3.Group();
      gg.position.set(x, gy, z);
      gg.rotation.y = yaw;

      var postMat = new T3.MeshStandardMaterial({ color: 0x7c481e, roughness: 0.80 });
      var trimMat = new T3.MeshStandardMaterial({ color: colorHex, roughness: 0.42 });
      // Tall twin timber pillars + overhead crossbeam lintel
      [-2.15, 2.15].forEach(function (px) {
        var pillar = new T3.Mesh(new T3.CylinderGeometry(0.24, 0.28, 3.6, 10), postMat);
        pillar.position.set(px, 1.75, 0);
        pillar.castShadow = true;
        gg.add(pillar);
        // Flanking side fence rails so players clearly see the gateway!
        var wing = new T3.Mesh(new T3.BoxGeometry(2.6, 1.1, 0.18), postMat);
        wing.position.set(px + (px < 0 ? -1.4 : 1.4), 0.75, 0);
        wing.castShadow = true;
        gg.add(wing);
      });
      var lintel = new T3.Mesh(new T3.BoxGeometry(5.1, 0.38, 0.42), trimMat);
      lintel.position.set(0, 3.55, 0);
      lintel.castShadow = true;
      gg.add(lintel);

      // Left & Right Swinging Double Doors!
      var doorL = new T3.Group();
      doorL.position.set(-2.0, 1.25, 0);
      var panelL = new T3.Mesh(new T3.BoxGeometry(1.92, 1.65, 0.16), trimMat);
      panelL.position.set(0.96, 0, 0);
      panelL.castShadow = true;
      doorL.add(panelL);
      gg.add(doorL);

      var doorR = new T3.Group();
      doorR.position.set(2.0, 1.25, 0);
      var panelR = new T3.Mesh(new T3.BoxGeometry(1.92, 1.65, 0.16), trimMat);
      panelR.position.set(-0.96, 0, 0);
      panelR.castShadow = true;
      doorR.add(panelR);
      gg.add(doorR);

      worldGroup.add(gg);
      addCircleCollider(x, z, 2.05, 'gate', gateId);
      // Flanking fence colliders so players go through the archway!
      var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      [-3.6, 3.6].forEach(function (off) {
        addCircleCollider(x + cosY * off, z - sinY * off, 1.35, 'fence', 0);
      });

      state.gateMeshes[gateId] = { group: gg, doorL: doorL, doorR: doorR, open: false, label: titleTxt };
    }
    createArchwayGate(1, SPOTS.gate12.x, SPOTS.gate12.z, 0.68, 0xff5fa2, 'Jungle Camp Gate');
    createArchwayGate(3, SPOTS.gate34.x, SPOTS.gate34.z, 0.25, 0x4f9dff, 'Highland Rope Bridge');
    createArchwayGate(4, SPOTS.gate45.x, SPOTS.gate45.z, 1.15, 0xffb320, 'Sunset Treasure Cove');

    // ---------- 5. Smart Bounding-Box GLB Placer (Fixes Flat Anchor/Plank Scale Bug + Occluder Fade!) ----------
    var glbCache = {};
    function loadCachedGLB(url) {
      if (glbCache[url]) return glbCache[url];
      glbCache[url] = new Promise(function (resolve) {
        loader.load(url, function (gltf) { resolve(gltf); }, undefined, function () { resolve(null); });
      });
      return glbCache[url];
    }

    function fitAndPlace(url, x, z, targetSize, yaw, colRadius, sinkY, placeOpts) {
      placeOpts = placeOpts || {};
      return loadCachedGLB(url).then(function (gltf) {
        if (!gltf || !gltf.scene) return null;
        var clone = gltf.scene.clone(true);
        var meshes = [];
        clone.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            if (placeOpts.tintHex || placeOpts.occluder) {
              o.material = o.material.clone();
            }
            if (placeOpts.tintHex) {
              o.material.color.setHex(placeOpts.tintHex);
              if (placeOpts.emissiveHex) {
                o.material.emissive = new T3.Color(placeOpts.emissiveHex);
                o.material.emissiveIntensity = 0.22;
              }
            }
            meshes.push(o);
          }
        });
        var box = new T3.Box3().setFromObject(clone);
        var sx = box.max.x - box.min.x, sy = box.max.y - box.min.y, sz = box.max.z - box.min.z;
        // CRITICAL UNITY SCALE FIX: Use max(sx, sy, sz) if fitBySpan or if flat horizontal prop!
        var denom = (placeOpts.fitBySpan || Math.max(sx, sz) > sy * 1.85)
          ? Math.max(sx, sy, sz, 0.01)
          : Math.max(sy, 0.01);
        var s = targetSize / denom;
        clone.scale.multiplyScalar(s);
        var box2 = new T3.Box3().setFromObject(clone);
        var wrap = new T3.Group();
        clone.position.set(
          -(box2.min.x + box2.max.x) * 0.5,
          -box2.min.y - (sinkY || 0.05),
          -(box2.min.z + box2.max.z) * 0.5
        );
        wrap.add(clone);
        var gy = placeOpts.fixedY != null ? placeOpts.fixedY : sampleTerrainHeight(x, z);
        wrap.position.set(x, gy, z);
        wrap.rotation.y = yaw || 0;
        if (placeOpts.tiltZ) wrap.rotation.z = placeOpts.tiltZ;
        worldGroup.add(wrap);
        if (colRadius > 0) addCircleCollider(x, z, colRadius, 'landmark', 0);
        if (placeOpts.occluder) {
          state.occluderTrees.push({ group: wrap, meshes: meshes, x: x, z: z, alpha: 1.0 });
        }
        return wrap;
      });
    }

    var swayingTrees = [];

    function populateAllProps(grade) {
      var isG4 = Number(grade) === 4;
      var jobs = [];

      // Zone 1: Anchored Pirate Arrival Ship in South Bay + Grand Benbow Inn + Campfire + Hammock + Lanterns
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Ship_Small.glb', SPOTS.harbourShip.x, SPOTS.harbourShip.z, 8.6, 0.55, 0, 0.35, { fixedY: -0.15, fitBySpan: true }));
      jobs.push(fitAndPlace('planet/models/benbow-inn.glb', SPOTS.benbowInn.x, SPOTS.benbowInn.z, 6.8, 0.65, 3.4, 0.08, { occluder: true }));
      jobs.push(fitAndPlace('planet/models/campfire.glb', SPOTS.campfire.x, SPOTS.campfire.z, 1.15, 0.2, 0.85, 0.04).then(function (w) {
        if (w) state.campfirePos.copy(w.position);
      }));
      jobs.push(fitAndPlace('../assets/3d/world/bench.glb', SPOTS.campfire.x - 1.9, SPOTS.campfire.z - 1.3, 1.65, 0.65, 0.55, 0.04, { fitBySpan: true }));
      jobs.push(fitAndPlace('planet/models/palm-hammock.glb', SPOTS.hammock.x, SPOTS.hammock.z, 4.2, 0.85, 1.15, 0.08, { occluder: true }).then(function (w) {
        if (w) state.hammockPos.copy(w.position);
      }));
      jobs.push(fitAndPlace('planet/models/signpost-arrows.glb', -24.8, 27.2, 2.3, -0.4, 0.45, 0.04));
      jobs.push(fitAndPlace('planet/models/coconut-pile.glb', -40.2, 36.2, 0.85, 0.5, 0.45, 0.02, { fitBySpan: true }));

      // Floating Message Bottle #1 in True Shallow Turquoise Bay (-35.0, 48.0, waterDepth = 0.27m!)
      jobs.push(loadCachedGLB('planet/models/message-bottle.glb').then(function (gltf) {
        if (!gltf || !gltf.scene) return;
        var bWrap = new T3.Group();
        var bm = gltf.scene.clone(true);
        var bx = new T3.Box3().setFromObject(bm);
        bm.scale.multiplyScalar(0.88 / Math.max(0.01, bx.max.y - bx.min.y, bx.max.x - bx.min.x));
        bWrap.add(bm);
        var ring = new T3.Mesh(
          new T3.RingGeometry(0.55, 0.78, 24),
          new T3.MeshBasicMaterial({ color: 0xffe066, side: T3.DoubleSide, transparent: true, opacity: 0.88 })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        bWrap.add(ring);
        bWrap.position.set(SPOTS.bottle1.x, 0.02, SPOTS.bottle1.z);
        worldGroup.add(bWrap);
        state.bottle1Mesh = bWrap;
      }));

      // Zone 2: Cook's Jungle Kitchen (Hut + Map Table + Hearth Campfire under Soup Pot + Apple/Carrot Crates!)
      jobs.push(fitAndPlace('planet/models/pirate-hut.glb', SPOTS.pirateHut.x, SPOTS.pirateHut.z, 5.8, 0.55, 2.7, 0.08, { occluder: true }));
      jobs.push(fitAndPlace('planet/models/map-table.glb', SPOTS.mapTable.x, SPOTS.mapTable.z, 1.55, 0.25, 0.95, 0.04, { fitBySpan: true }));
      // Real glowing cooking fire underneath Chef Cook's soup pot!
      jobs.push(fitAndPlace('planet/models/campfire.glb', SPOTS.soupPot.x, SPOTS.soupPot.z, 0.82, 0.4, 0, 0.04));
      jobs.push(fitAndPlace('treasure3d/models/prop-soup-pot.glb', SPOTS.soupPot.x, SPOTS.soupPot.z, 0.92, 0, 0.72, -0.18).then(function (w) {
        if (w) state.soupPotPos.copy(w.position);
      }));
      jobs.push(fitAndPlace('../assets/3d/world/props/Barrel_Apples.glb', -9.8, 10.6, 0.95, 0.3, 0.5, 0.03));
      jobs.push(fitAndPlace('../assets/3d/world/props/FarmCrate_Carrot.glb', -2.8, 10.8, 0.88, -0.4, 0.5, 0.03, { fitBySpan: true }));

      // 4 Distinctly Tinted Pearlescent Giant Musical Shells (Sapphire Blue, Coral Pink, Emerald Green, Sunburst Yellow!)
      var shellDefs = [
        { key: 'blue',   hex: 0x4f9dff, css: '#4f9dff', x: -11.6, z: 18.4, note: 523.25 },
        { key: 'pink',   hex: 0xff5fa2, css: '#ff5fa2', x: -8.9,  z: 20.0, note: 587.33 },
        { key: 'green',  hex: 0x2fc58a, css: '#2fc58a', x: -6.1,  z: 20.0, note: 659.25 },
        { key: 'yellow', hex: 0xffb320, css: '#ffb320', x: -3.4,  z: 18.4, note: 783.99 }
      ];
      shellDefs.forEach(function (sd, idx) {
        jobs.push(fitAndPlace('planet/models/giant-shell.glb', sd.x, sd.z, 1.30, -0.25 + idx * 0.18, 0.65, 0.02, {
          fitBySpan: true,
          tintHex: sd.hex,
          emissiveHex: sd.hex
        }).then(function (wrap) {
          if (!wrap) return;
          var pad = new T3.Mesh(
            new T3.CylinderGeometry(0.85, 0.96, 0.10, 20),
            new T3.MeshStandardMaterial({ color: sd.hex, emissive: new T3.Color(sd.hex), emissiveIntensity: 0.30, roughness: 0.32 })
          );
          pad.position.y = 0.05;
          wrap.add(pad);
          var lbl = registerLabel('shell-' + sd.key, '🐚 ' + sd.key.toUpperCase(), sd.css, sd.x, wrap.position.y + 1.45, sd.z, 11.0);
          state.shellObjs.push({
            key: sd.key,
            hex: sd.hex,
            note: sd.note,
            group: wrap,
            pad: pad,
            label: lbl,
            x: sd.x,
            z: sd.z,
            pulse: 0
          });
        }));
      });

      // 5 Clean Single-Mesh Beveled Wooden Planks + Crisp Screen-Space Labels!
      var plankWords = isG4
        ? [
            { word: 'explored',   valid: true,  x: -14.2, z: 15.0 },
            { word: 'climbed',    valid: true,  x: -1.8,  z: 7.4 },
            { word: 'discovered', valid: true,  x: 3.4,   z: 18.6 },
            { word: 'banana',     valid: false, x: -13.5, z: 22.0 },
            { word: 'pillow',     valid: false, x: 2.8,   z: 8.6 }
          ]
        : [
            { word: 'walked', valid: true,  x: -14.2, z: 15.0 },
            { word: 'jumped', valid: true,  x: -1.8,  z: 7.4 },
            { word: 'sailed', valid: true,  x: 3.4,   z: 18.6 },
            { word: 'apple',  valid: false, x: -13.5, z: 22.0 },
            { word: 'sleep',  valid: false, x: 2.8,   z: 8.6 }
          ];

      plankWords.forEach(function (pw, idx) {
        jobs.push(fitAndPlace('treasure3d/models/prop-plank.glb', pw.x, pw.z, 1.38, 0.35 + idx * 0.2, 0, -0.10, { fitBySpan: true }).then(function (wrap) {
          if (!wrap) return;
          var lbl = registerLabel('plank-' + idx, '🪵 ' + pw.word, '#ffb320', pw.x, wrap.position.y + 0.72, pw.z, 12.5);
          state.plankPickups.push({
            word: pw.word,
            valid: pw.valid,
            taken: false,
            group: wrap,
            label: lbl,
            x: pw.x,
            z: pw.z,
            homeY: wrap.position.y
          });
        }));
      });

      // Zone 3: Lagoon Dock Props & Dramatic Offshore Shipwreck Island (Properly Scaled Anchor + Tilted Wreck Hull!)
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Prop_Barrel.glb', 25.8, 11.8, 1.02, 0.4, 0.55, 0.04));
      jobs.push(fitAndPlace('../assets/3d/world/props/Crate_Wooden.glb', 24.6, 12.2, 0.85, 0.15, 0.50, 0.04));
      jobs.push(fitAndPlace('planet/models/signpost-arrows.glb', 24.4, 16.8, 2.3, -1.2, 0.45, 0.04));
      jobs.push(fitAndPlace('../assets/3d/world/props/Lantern_Wall.glb', 38.6, 12.5, 0.85, 0, 0, 0, { fixedY: 1.55 }));

      // Dramatic Tilted Wooden Shipwreck + Realistic 1.85m Iron Anchor WITH Collider!
      jobs.push(fitAndPlace('planet/models/shipwreck.glb', SPOTS.shipwreckModel.x, SPOTS.shipwreckModel.z, 8.4, -0.75, 3.1, 0.22, { fitBySpan: true, tiltZ: 0.16 }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Prop_Anchor.glb', 63.4, 9.6, 1.85, 0.6, 0.88, 0.04, { fitBySpan: true }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Prop_Barrel.glb', 66.8, 15.2, 1.0, 0.8, 0.52, 0.04));
      jobs.push(fitAndPlace('planet/models/chest-closed.glb', SPOTS.wreckChest.x, SPOTS.wreckChest.z, 1.18, -1.4, 0.72, 0.03, { fitBySpan: true }).then(function (w) {
        state.wreckChestClosed = w;
      }));
      jobs.push(fitAndPlace('planet/models/chest-open.glb', SPOTS.wreckChest.x, SPOTS.wreckChest.z, 1.28, -1.4, 0, 0.03, { fitBySpan: true }).then(function (w) {
        if (w) w.visible = false;
        state.wreckChestOpen = w;
      }));

      // Zone 4: Stockade Fort, Tall Climbable Lookout Tower, Waterfall, Cave Entrance & Bioluminescent Cave Mushrooms!
      jobs.push(fitAndPlace('planet/models/stockade-fort.glb', SPOTS.stockadeFort.x, SPOTS.stockadeFort.z, 6.2, 0.35, 3.0, 0.10, { fitBySpan: true }));
      jobs.push(fitAndPlace('planet/models/lookout-tower.glb', SPOTS.lookoutTower.x, SPOTS.lookoutTower.z, 7.6, -0.55, 1.65, 0.08));
      jobs.push(fitAndPlace('planet/models/waterfall-rock.glb', SPOTS.waterfall.x, SPOTS.waterfall.z, 6.4, 0.45, 2.3, 0.18));
      jobs.push(fitAndPlace('planet/models/cave-entrance.glb', SPOTS.caveMouth.x, SPOTS.caveMouth.z, 4.8, 0.48, 0, 0.12));
      // Glowing Cave Mushrooms & Candlesticks inside Dark Cavern!
      [[-22.2, -39.5], [-15.2, -45.5], [-21.8, -46.2], [-14.8, -39.8]].forEach(function (mp, mi) {
        jobs.push(fitAndPlace('../assets/3d/world/nature/Mushroom_Common.glb', mp[0], mp[1], 0.72, mi * 1.1, 0, 0.02, {
          tintHex: mi % 2 === 0 ? 0x46f0d2 : 0xa584ff,
          emissiveHex: mi % 2 === 0 ? 0x26c6da : 0x7b5cff
        }));
      });
      jobs.push(fitAndPlace('../assets/3d/world/props/CandleStick_Stand.glb', -17.2, -37.2, 1.35, 0.2, 0.35, 0.02));

      // Zone 5: Sunset Treasure Cove (Twin Palms + Big Grey Rock + Single Palm + Driftwood + 4 Diggable Mounds + Golden Chest!)
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Environment_PalmTree_1.glb', SPOTS.twinPalmA.x, SPOTS.twinPalmA.z, 6.4, 0.2, 0.65, 0.12, { occluder: true }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Environment_PalmTree_2.glb', SPOTS.twinPalmB.x, SPOTS.twinPalmB.z, 6.2, 1.9, 0.65, 0.12, { occluder: true }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Environment_Rock_1.glb', SPOTS.bigGreyRock.x, SPOTS.bigGreyRock.z, 2.7, 0.8, 1.55, 0.16, { fitBySpan: true }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Environment_PalmTree_3.glb', -30.2, -8.4, 5.6, 1.1, 0.6, 0.10, { occluder: true }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Prop_Barrel.glb', -33.2, -8.8, 1.02, 0.3, 0.55, 0.04));
      jobs.push(fitAndPlace('planet/models/giant-shell.glb', -46.4, -9.6, 1.15, 0.9, 0.55, 0.04, { fitBySpan: true }));

      SPOTS.mounds.forEach(function (md) {
        jobs.push(fitAndPlace('planet/models/x-mound.glb', md.x, md.z, 1.25, 0.2, 0, 0.03, { fitBySpan: true }).then(function (wrap) {
          if (!wrap) return;
          state.moundObjs.push({
            id: md.id,
            correct: md.correct,
            dug: false,
            scoops: 0,
            x: md.x,
            z: md.z,
            label: md.label,
            group: wrap
          });
        }));
      });
      var cm = SPOTS.mounds[0];
      jobs.push(fitAndPlace('planet/models/chest-closed.glb', cm.x, cm.z, 1.22, 0.65, 0, 0.02, { fitBySpan: true }).then(function (w) {
        if (w) w.visible = false;
        state.finalChestClosed = w;
      }));
      jobs.push(fitAndPlace('../assets/3d/world/pirate/Prop_Chest_Gold.glb', cm.x, cm.z, 1.42, 0.65, 0, 0.02, { fitBySpan: true }).then(function (w) {
        if (w) w.visible = false;
        state.finalChestOpen = w;
      }));

      // Lush Tropical Palm Groves (Strictly on dry land gy >= 0.65, marked `occluder: true`!)
      var palmCoords = [
        [-45.0, 31.5, 5.8, 1], [-31.8, 25.0, 5.4, 2], [-28.5, 39.2, 5.2, 3],
        [-16.2, 6.8,  6.0, 1], [-15.2, 20.5, 5.3, 2], [4.5,   6.2,  5.6, 3], [5.8,  21.5, 5.4, 1],
        [21.8,  19.5, 5.5, 2], [22.5,  7.5,  5.2, 3], [65.0,  7.5,  5.5, 1], [72.0, 15.2, 5.2, 2],
        [11.2, -29.5, 5.4, 3], [-9.2, -28.5, 5.6, 1], [-29.5,-21.5, 5.2, 2], [-43.5,-18.5, 5.4, 3]
      ];
      palmCoords.forEach(function (pc, idx) {
        if (sampleTerrainHeight(pc[0], pc[1]) < 0.55) return;
        var pUrl = '../assets/3d/world/pirate/Environment_PalmTree_' + pc[3] + '.glb';
        jobs.push(fitAndPlace(pUrl, pc[0], pc[1], pc[2], idx * 1.17, 0.55, 0.12, { occluder: true }).then(function (w) {
          if (w) swayingTrees.push({ obj: w, phase: idx * 0.9 });
        }));
      });

      // Lush CC0 Wildflowers, Flowering Bushes, Tropical Ferns & Coastal Rocks!
      var flowerSpots = [
        [-39.5, 31.2, 'Bush_Common_Flowers.glb', 1.15],
        [-33.5, 29.8, 'Flower_3_Group.glb', 0.85],
        [-23.5, 26.2, 'Flower_4_Group.glb', 0.85],
        [-10.2, 13.8, 'Plant_1_Big.glb', 1.10],
        [-2.2,  16.2, 'Flower_3_Group.glb', 0.85],
        [7.6,   11.6, 'Bush_Common_Flowers.glb', 1.10],
        [21.2,  16.2, 'Plant_1_Big.glb', 1.15],
        [3.8,  -25.2, 'Bush_Common_Flowers.glb', 1.10],
        [-35.2,-18.8, 'Flower_4_Group.glb', 0.88]
      ];
      flowerSpots.forEach(function (fs, idx) {
        jobs.push(fitAndPlace('../assets/3d/world/nature/' + fs[2], fs[0], fs[1], fs[3], idx * 1.4, 0, 0.03, { fitBySpan: true }));
      });

      var rockCoords = [
        [-49.0, 39.5, 1.8], [-23.5, 43.0, 1.5], [8.8,  23.5, 1.7],
        [29.5,  21.0, 1.6], [61.5,  17.2, 1.5], [74.5,  8.5, 2.0],
        [15.2, -22.0, 1.9], [-8.2, -35.5, 2.1], [-44.5,-22.5, 1.8]
      ];
      rockCoords.forEach(function (rc, idx) {
        var rUrl = idx % 2 === 0 ? '../assets/3d/world/nature/Rock_Medium_1.glb' : '../assets/3d/world/nature/Rock_Medium_2.glb';
        jobs.push(fitAndPlace(rUrl, rc[0], rc[1], rc[2], idx * 0.85, rc[2] * 0.48, 0.12, { fitBySpan: true }));
      });

      return Promise.all(jobs);
    }

    // ---------- 6. Unified O(1) Ground, Ramped Bridge, Elevated Pier, Cave & Water Query ----------
    function getGroundInfo(x, z) {
      // 1. Lookout Tower Crow's Nest
      if (state.onTower && dist2(x, z, SPOTS.lookoutTower.x, SPOTS.lookoutTower.z) < 3.8) {
        return { y: 10.2, rawY: 10.2, surface: 'wood', waterDepth: 0, inCave: 0 };
      }

      // 2. Elevated Lagoon Pier + Approach Ramp (x: 25.6..39.6, z: 12.3..15.7)
      if (x >= 25.6 && x <= 39.6 && Math.abs(z - 14.0) <= 1.68) {
        if (x < 27.6) {
          var rt = (x - 25.6) / 2.0;
          var landY = sampleTerrainHeight(25.6, 14.0);
          return { y: lerp(landY, 1.25, rt), rawY: 1.0, surface: 'wood', waterDepth: 0, inCave: 0 };
        }
        return { y: 1.25, rawY: 1.25, surface: 'wood', waterDepth: 0, inCave: 0 };
      }

      // 3. Ramped Creek Bridge (West Ramp x=8.2..10.2, Deck x=10.2..17.8, East Ramp x=17.8..19.8, z=12.0..15.0)
      if (x >= 8.2 && x <= 19.8 && Math.abs(z - 13.5) <= 1.46) {
        if (x < 10.2) {
          var wt = (x - 8.2) / 2.0;
          return { y: lerp(sampleTerrainHeight(8.2, 13.5), 1.79, wt), rawY: 1.5, surface: 'wood', waterDepth: 0, inCave: 0 };
        }
        if (x > 17.8) {
          var et = (x - 17.8) / 2.0;
          return { y: lerp(1.79, sampleTerrainHeight(19.8, 13.5), et), rawY: 1.5, surface: 'wood', waterDepth: 0, inCave: 0 };
        }
        var maxWalkX = 11.0 + state.bridgePlanksFixed * 2.0 + (state.bridgePlanksFixed >= 3 ? 2.5 : 0);
        if (x <= maxWalkX || x >= 17.0) {
          return { y: 1.79, rawY: 1.79, surface: 'wood', waterDepth: 0, inCave: 0 };
        }
        // Unrepaired bridge gap -> deep creek water (-0.95m -> triggers bounce-back until planks placed!)
        return { y: -0.42, rawY: -0.95, surface: 'water', waterDepth: 0.95, inCave: 0 };
      }

      // 4. Canyon Swaying Rope Bridge ([14.2, -13.6] -> [4.6, -19.4])
      var rbSeg = segInfo(x, z, SPOTS.ropeBridgeA.x, SPOTS.ropeBridgeA.z, SPOTS.ropeBridgeB.x, SPOTS.ropeBridgeB.z);
      if (rbSeg.d <= 1.35 && rbSeg.t >= 0.0 && rbSeg.t <= 1.0) {
        var pIdx = clamp(Math.floor(rbSeg.t * 8), 0, 7);
        var sag = -Math.sin(rbSeg.t * Math.PI) * 0.20;
        var dip = state.ropePlankDips[pIdx] || 0;
        return { y: 4.26 + sag - dip, rawY: 4.26, surface: 'wood', waterDepth: 0, inCave: 0, ropePlankIdx: pIdx };
      }

      // 5. Base Sculpted Terrain + Water Depth + Cave Factor
      var ty = sampleTerrainHeight(x, z);
      var waterDepth = Math.max(0, 0.0 - ty);
      var caveD = dist2(x, z, SPOTS.caveCenter.x, SPOTS.caveCenter.z);
      var inCave = 1.0 - smoothstep(6.2, 11.0, caveD);

      var surf = 'grass';
      if (waterDepth > 0.03) surf = 'water';
      else if (inCave > 0.45) surf = 'stone';
      else if (ty < 0.78 || (x > 55 && ty < 1.45) || dist2(x, z, -39.5, -15.5) < 6.5) surf = 'sand';

      return {
        y: Math.max(ty, -0.42),
        rawY: ty,
        surface: surf,
        waterDepth: waterDepth,
        inCave: inCave
      };
    }

    function setBridgePlanksFixed(count) {
      state.bridgePlanksFixed = clamp(count, 0, 3);
      for (var i = 0; i < 3; i++) {
        var fixed = i < state.bridgePlanksFixed;
        if (state.creekPlankMeshes[i]) state.creekPlankMeshes[i].visible = fixed;
        if (state.creekGhostMeshes[i]) state.creekGhostMeshes[i].visible = !fixed;
      }
    }

    function setGateOpen(gateId, isOpen) {
      state.gatesOpen[gateId] = !!isOpen;
      var gm = state.gateMeshes[gateId];
      if (gm) gm.open = !!isOpen;
    }

    function updatePlankLabelsForGrade(grade) {
      var isG4 = Number(grade) === 4;
      var words = isG4
        ? ['explored', 'climbed', 'discovered', 'banana', 'pillow']
        : ['walked', 'jumped', 'sailed', 'apple', 'sleep'];
      state.plankPickups.forEach(function (pk, i) {
        if (!words[i]) return;
        pk.word = words[i];
        if (pk.label) pk.label.text = '🪵 ' + pk.word;
      });
      state.caveTorches.forEach(function (tc) {
        if (tc.label) tc.label.text = (isG4 ? tc.g4 : tc.g3).toUpperCase();
      });
    }

    function update(dt, elapsed, playerPos, camPos) {
      uWorldTime.value = elapsed;
      matGhost.opacity = 0.28 + Math.sin(elapsed * 3.4) * 0.16;

      if (state.bottle1Mesh && state.bottle1Mesh.visible) {
        state.bottle1Mesh.position.y = 0.02 + Math.sin(elapsed * 2.4) * 0.05;
        state.bottle1Mesh.rotation.z = Math.sin(elapsed * 1.8) * 0.12;
        state.bottle1Mesh.rotation.y += dt * 0.45;
      }

      for (var pi = 0; pi < state.plankPickups.length; pi++) {
        var pk = state.plankPickups[pi];
        pk.label.visible = !pk.taken;
        if (!pk.taken && pk.group.visible) {
          pk.group.position.y = pk.homeY + Math.sin(elapsed * 2.6 + pi) * 0.04;
        }
      }

      for (var si = 0; si < state.shellObjs.length; si++) {
        var sh = state.shellObjs[si];
        if (sh.pulse > 0) {
          sh.pulse = Math.max(0, sh.pulse - dt * 2.4);
          var sc = 1.0 + Math.sin(sh.pulse * Math.PI) * 0.18;
          sh.group.scale.setScalar(sc);
          sh.pad.material.emissiveIntensity = 0.30 + sh.pulse * 1.25;
        }
      }

      for (var rpi = 0; rpi < state.ropePlankMeshes.length; rpi++) {
        var pm = state.ropePlankMeshes[rpi];
        var dPlayer = playerPos ? dist2(playerPos.x, playerPos.z, pm.position.x, pm.position.z) : 99;
        var tgtDip = dPlayer < 1.35 ? 0.18 * (1.0 - dPlayer / 1.35) : 0.0;
        state.ropePlankDips[rpi] += (tgtDip - state.ropePlankDips[rpi]) * Math.min(1, dt * 12);
        pm.position.y = pm.userData.baseY - state.ropePlankDips[rpi] + Math.sin(elapsed * 2.1 + rpi * 0.5) * 0.015;
      }

      // Swing open double archway doors!
      Object.keys(state.gateMeshes).forEach(function (gid) {
        var gm = state.gateMeshes[gid];
        var tgtL = gm.open ? -Math.PI * 0.58 : 0.0;
        var tgtR = gm.open ?  Math.PI * 0.58 : 0.0;
        gm.doorL.rotation.y += (tgtL - gm.doorL.rotation.y) * Math.min(1, dt * 5.5);
        gm.doorR.rotation.y += (tgtR - gm.doorR.rotation.y) * Math.min(1, dt * 5.5);
      });

      for (var ti = 0; ti < state.caveTorches.length; ti++) {
        var tc = state.caveTorches[ti];
        tc.crystal.rotation.y += dt * (tc.lit ? 2.0 : 0.6);
        tc.crystal.position.y = 1.52 + Math.sin(elapsed * 2.6 + ti) * 0.05;
        var wantE = tc.lit ? 1.75 : 0.32;
        var wantL = tc.lit ? 2.4 : 0.35;
        tc.mat.emissiveIntensity += (wantE - tc.mat.emissiveIntensity) * Math.min(1, dt * 6);
        tc.light.intensity += (wantL - tc.light.intensity) * Math.min(1, dt * 6);
        tc.label.visible = !tc.lit;
      }

      wfCurtain.material.opacity = 0.60 + Math.sin(elapsed * 7.5) * 0.10;

      for (var wi = 0; wi < swayingTrees.length; wi++) {
        var tr = swayingTrees[wi];
        tr.obj.rotation.z = Math.sin(elapsed * 1.35 + tr.phase) * 0.025;
      }

      // Unity Camera Spring-Arm Foliage Dither/Fade: fade any palm/tree sitting directly between camera and player!
      if (camPos && playerPos) {
        for (var oi = 0; oi < state.occluderTrees.length; oi++) {
          var oc = state.occluderTrees[oi];
          var seg = segInfo(oc.x, oc.z, camPos.x, camPos.z, playerPos.x, playerPos.z);
          var dCam = dist2(oc.x, oc.z, camPos.x, camPos.z);
          var blocking = (dCam < 3.6) || (seg.t > 0.05 && seg.t < 0.88 && seg.d < 2.2);
          var wantA = blocking ? 0.18 : 1.0;
          if (Math.abs(oc.alpha - wantA) > 0.01) {
            oc.alpha += (wantA - oc.alpha) * Math.min(1, dt * 10);
            var isTrans = oc.alpha < 0.98;
            for (var mi = 0; mi < oc.meshes.length; mi++) {
              var m = oc.meshes[mi].material;
              if (m) {
                m.transparent = isTrans;
                m.opacity = oc.alpha;
                m.depthWrite = !isTrans;
              }
            }
          }
        }
      }
    }

    return {
      SPOTS: SPOTS,
      state: state,
      waterMesh: waterMesh,
      terrainMesh: terrainMesh,
      loadCachedGLB: loadCachedGLB,
      populateAllProps: populateAllProps,
      getGroundInfo: getGroundInfo,
      sampleTerrainHeight: sampleTerrainHeight,
      setBridgePlanksFixed: setBridgePlanksFixed,
      setGateOpen: setGateOpen,
      updatePlankLabelsForGrade: updatePlankLabelsForGrade,
      registerLabel: registerLabel,
      update: update
    };
  }

  TI3D.SPOTS = SPOTS;
  TI3D.sampleTerrainHeight = sampleTerrainHeight;
  TI3D.createWorldMap = createWorldMap;
})(typeof window !== 'undefined' ? window : this);
