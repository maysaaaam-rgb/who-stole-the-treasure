/* Adventure Island — the 3D home world of English Adventure Academy (built to match docs/design/home-world.jpg).
   Layout: home3d/layout.json (islands, places, homes, paths, trees, props). Real models + anchor points: assets/3d/home/models.json.
   Every part of the platform is a place on the island; tap a place to go there.
   The bridge to Treasure Island grows with the class's goal for today (from the Class Board).
   Options: ?nolinks (tap only flies the camera)  ?demo / ?capture (automatic tests)  ?q=low */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  K.ROOT = '../';
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  K.init({ fov: 30, fog: 0x269dad, fogNear: 210, fogFar: 420, far: 700, autoPortraitFov: false });   // clear ocean view with only gentle far-horizon blend
  var scene = K.scene, ROOT = '../';
  scene.fog = new T3.Fog(0x52c4d4, 210, 420);
  var NOLINKS = K.Q.has('nolinks') || K.DEMO;
  var mat = function (c, o) { return new T3.MeshStandardMaterial(Object.assign({ color: c, roughness: .88, metalness: 0, envMapIntensity: .28 }, o || {})); };
  var R3 = K.renderer;
  R3.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // 6-hour classroom laptop thermal guard
  R3.toneMapping = T3.ACESFilmicToneMapping;
  R3.toneMappingExposure = 1.04;   // airy, clean, balanced daylight without harsh dark blotches
  R3.shadowMap.enabled = true;
  R3.shadowMap.type = T3.PCFSoftShadowMap;
  // Cool-running 6-hour Eco Mode: drops to 30fps after 90s idle, wakes to 60fps in 0ms on any interaction
  var _lastClassroomAct = performance.now();
  function _wakeClassroomEco() { _lastClassroomAct = performance.now(); K.ecoHalfRate = false; }
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    addEventListener(ev, _wakeClassroomEco, { passive: true });
  });
  setInterval(function () {
    if (!K.CAPTURE && !K.DEMO && (performance.now() - _lastClassroomAct > 90000)) K.ecoHalfRate = true;
  }, 5000);
  (function envLight() {   // airy soft daylight sky-and-meadow wrap light
    var es = new T3.Scene(), sm = new T3.ShaderMaterial({ side: T3.BackSide, vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec3 p; void main(){ float h = normalize(p).y; vec3 c = h > 0. ? mix(vec3(.96,.98,.96), vec3(.45,.82,.96), pow(h,.6)) : mix(vec3(.92,.95,.88), vec3(.52,.78,.42), pow(-h,.5)); gl_FragColor = vec4(c,1.); }' });
    es.add(new T3.Mesh(new T3.SphereGeometry(10, 32, 16), sm));
    var pm = new T3.PMREMGenerator(R3); scene.environment = pm.fromScene(es, .02).texture; pm.dispose();
  })();
  function add(m, x, y, z, parent) { m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
  var TL = new T3.TextureLoader();
  function texH(file, rx, ry) { var t = TL.load(ROOT + 'assets/3d/home/tex/' + file); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rx, ry == null ? rx : ry); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 8; return t; }   // Gemini's painted textures
  function tex(file, rep) { var t = TL.load(ROOT + 'games/world/art/' + file); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t; }

  /* ---------------- sky, soft light, rich #1CA3B0 sea ---------------- */
  K.world.sky(0x3ba8cc, 0x7bd4e6, 0xcff2f7);
  var hemiLight = new T3.HemisphereLight(0xd8f3ff, 0x7cb860, 0.78);   // generous soft fill so shadows are airy & soft, never black blotches
  scene.add(hemiLight);
  var sun = new T3.DirectionalLight(0xfff2d8, 1.65);   // gentle warm daylight sun with ultra-soft feathered shadows
  var smSz = K.MOBILE ? 1024 : 2048;
  sun.castShadow = true; sun.shadow.mapSize.set(smSz, smSz);
  sun.shadow.radius = 6.0;
  sun.shadow.bias = -.00045; sun.shadow.normalBias = .032;
  var sc = sun.shadow.camera; sc.left = -68; sc.right = 68; sc.top = 54; sc.bottom = -54; sc.near = 1; sc.far = 230;
  sun.position.set(-38, 56, 42); sun.target.position.set(2, 0, 0); scene.add(sun); scene.add(sun.target);
  // Warm back rim light so seated student avatars, 4 Team Monsters & active landmarks pop at 7-8m distance
  var rimLight = new T3.DirectionalLight(0xffe7b8, 0.68);
  rimLight.position.set(36, 26, -46); scene.add(rimLight);

  // Sea: sunny cartoon adventure-park water matching docs/design/home-world.jpg:
  // exact analytical distance to every island's coastline (no spiky polygon rings),
  // creamy breathing shore foam, warm aqua shallows, bright tropical turquoise water, and soft painterly swells.
  var seaU = { uT: { value: 0 }, uStorm: { value: 0 }, uIsl: { value: [] }, uIslW: { value: [] }, uN: { value: 0 } };
  for (var si = 0; si < 32; si++) {
    seaU.uIsl.value.push(new T3.Vector4(0, 0, 1, 1));
    seaU.uIslW.value.push(new T3.Vector4(0, 0, 0, 0));
  }
  var seaMesh = null;
  (function sea() {
    var m = new T3.Mesh(new T3.PlaneGeometry(1800, 1800, 1, 1), new T3.ShaderMaterial({
      uniforms: seaU,
      vertexShader: 'varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: [
        'uniform float uT; uniform float uStorm; uniform vec4 uIsl[32]; uniform vec4 uIslW[32]; uniform int uN; varying vec2 vW;',
        'float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
        'float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }',
        'float fbm(vec2 p){ return n(p) * 0.65 + n(p * 2.1 + 17.3) * 0.35; }',
        'float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }',
        'void main(){',
        '  float dist = 999.0; float sandNear = 0.0;',
        '  for (int k = 0; k < 32; k++) {',
        '    if (k >= uN) break;',
        '    vec4 e = uIsl[k]; vec4 ew = uIslW[k];',
        '    vec2 d0 = vW - e.xy;',
        '    float cr = cos(ew.w), sr = sin(ew.w);',
        '    vec2 d = vec2(d0.x * cr + d0.y * sr, -d0.x * sr + d0.y * cr);',
        '    float a = atan(-d.y, d.x);',
        '    float w = 1.0 + ew.y * (sin(a * 3.0 + ew.x) * 0.6 + sin(a * 5.0 + ew.x * 2.3) * 0.4);',
        '    vec2 rad = e.zw * w + vec2(0.82);',
        '    vec2 q = d / rad;',
        '    float di = (length(q) - 1.0) * min(rad.x, rad.y);',
        '    if (ew.z > 0.5) sandNear = max(sandNear, 1.0 - smoothstep(0.0, 7.5, max(di, 0.0)));',
        '    dist = (k == 0) ? di : smin(dist, di, 2.2);',
        '  }',
        '  dist = max(dist, 0.0);',
        '  float st = clamp(uStorm, 0.0, 1.0);',
        // Soft muted pastel coastal aqua (-18% saturation so high-saturation avatars & landmarks pop at 7-8m!)
        '  vec3 shal = mix(vec3(0.42, 0.78, 0.80), vec3(0.55, 0.84, 0.81), sandNear * 0.55);',
        '  vec3 turq = mix(vec3(0.24, 0.62, 0.67), vec3(0.11, 0.27, 0.36), st);',
        '  vec3 mid  = mix(vec3(0.20, 0.52, 0.60), vec3(0.08, 0.21, 0.30), st);',
        '  vec3 deep = mix(vec3(0.16, 0.43, 0.54), vec3(0.06, 0.15, 0.24), st);',
        '  shal = mix(shal, vec3(0.20, 0.38, 0.46), st * 0.75);',
        '  vec3 c = mix(shal, turq, smoothstep(0.0, 5.2, dist));',
        '  c = mix(c, mid,  smoothstep(4.5, 20.0, dist));',
        '  c = mix(c, deep, smoothstep(18.0, 68.0, dist));',
        // Calm gentle ocean swells
        '  float spd = 1.0 + st * 2.2;',
        '  vec2 sp = vec2(vW.x * (0.036 + st * 0.02) + uT * 0.02 * spd, vW.y * (0.10 + st * 0.05) - uT * 0.03 * spd);',
        '  float swell = fbm(sp);',
        '  c += vec3(0.03 + st * 0.07, 0.05 + st * 0.07, 0.06 + st * 0.08) * (swell - 0.5);',
        // Gentle sparse wave highlights + subtle sunlit sparkles
        '  float rib = fbm(vec2(vW.x * 0.055 - uT * 0.025 * spd, vW.y * 0.24 + sin(vW.x * 0.04 + uT * st) * 0.20));',
        '  float streak = smoothstep(0.68, 0.86, rib) * (1.0 - smoothstep(14.0, 95.0, dist));',
        '  c = mix(c, vec3(0.48, 0.88, 0.90), streak * 0.14 * (1.0 - st * 0.6));',
        '  vec2 sg = floor(vW * 0.36); vec2 sf = fract(vW * 0.36) - 0.5;',
        '  float sr = h(sg); float tw = 0.5 + 0.5 * sin(uT * 1.9 + sr * 62.8);',
        '  float star = smoothstep(0.10, 0.02, length(sf)) * step(0.955, sr) * smoothstep(0.60, 1.0, tw) * (1.0 - st) * smoothstep(3.0, 8.0, dist) * (1.0 - smoothstep(45.0, 98.0, dist));',
        '  c += vec3(0.98, 1.0, 0.96) * star * 0.65;',
        '  float wcap = smoothstep(0.66 - st * 0.12, 0.78 - st * 0.10, rib) * smoothstep(0.32, 0.95, st);',
        '  c = mix(c, vec3(0.88, 0.94, 0.98), wcap * 0.58);',
        // Crisp bright white Shoreline Foam anchoring the island firmly in the sea
        '  float wave = sin(uT * (1.35 + st * 1.8) + vW.x * 0.22 + vW.y * 0.18) * (0.28 + st * 0.34);',
        '  float dW = dist + wave;',
        '  float foam1 = 1.0 - smoothstep(0.20, 1.65 + st * 0.6, dW);',
        '  float foam2 = smoothstep(1.85, 2.55, dW) * (1.0 - smoothstep(2.55, 3.35, dW));',
        '  c = mix(c, vec3(0.97, 1.00, 0.99), foam1 * (0.90 + st * 0.08));',
        '  c = mix(c, vec3(0.78, 0.97, 0.96), foam2 * 0.42);',
        // Soft distant horizon blend
        '  float farHaze = smoothstep(95.0, 230.0, length(vW));',
        '  vec3 hazeCol = mix(vec3(0.32, 0.77, 0.83), vec3(0.28, 0.38, 0.48), st);',
        '  c = mix(c, hazeCol, farHaze * 0.58);',
        '  gl_FragColor = vec4(c, 1.0);',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n')
    }));
    m.rotation.x = -Math.PI / 2; m.position.y = -1.6; scene.add(m);
    seaMesh = m;
    K.onFrame(function (dt, tt) { seaU.uT.value = tt; });
  })();

  // Clouds: soft, pillowy 3D storybook cumulus clouds framing the four corners like docs/design/home-world.jpg
  (function clouds() {
    var cv = document.createElement('canvas'); cv.className = 'h3-cloudcv'; var uiEl = document.getElementById('ui'); if (uiEl) uiEl.parentNode.insertBefore(cv, uiEl); else document.body.appendChild(cv);
    var off = document.createElement('canvas');
    // Keep the bottom ocean completely open & clear (NO bottom clouds making the island feel floating!)
    var SPOTS = [
      [-.02, .01, .10], [.99, .01, .10]
    ];
    function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
    function cloud(c, cx, cy, s, seed, W, H, d) {
      var R = rng(seed * 997 + 13), puffs = [], i, a, rr;
      for (i = 0; i < 8; i++) {
        a = Math.PI * (.06 + .88 * i / 7);
        rr = s * (.36 + R() * .18);
        puffs.push([cx + Math.cos(a) * s * .94, cy - Math.sin(a) * s * .38 - s * .02, rr, true]);
      }
      for (i = 0; i < 6; i++) {
        a = Math.PI * (.14 + .72 * i / 5);
        rr = s * (.42 + R() * .18);
        puffs.push([cx + Math.cos(a) * s * .62 + (R() - .5) * s * .12, cy - Math.sin(a) * s * .46 + s * .06, rr, false]);
      }
      puffs.push([cx - s * .16, cy - s * .42, s * .54, false], [cx + s * .24, cy - s * .30, s * .48, false]);

      off.width = cv.width; off.height = cv.height;
      var oc = off.getContext('2d');
      oc.setTransform(d, 0, 0, d, 0, 0);
      oc.clearRect(0, 0, W, H);

      // 1. Unified cloud silhouette filled with soft sky-tinted base
      var bg = oc.createLinearGradient(cx - s * .5, cy - s * .9, cx + s * .5, cy + s * .6);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.55, '#f2f9ff');
      bg.addColorStop(1, '#d8ecfc');
      oc.fillStyle = bg;
      oc.beginPath();
      puffs.forEach(function (p) { oc.moveTo(p[0] + p[2], p[1]); oc.arc(p[0], p[1], p[2], 0, Math.PI * 2); });
      oc.fill();

      // 2. Sculpt each puff inside the silhouette: soft sky-blue lower-right curve + bright warm-white upper-left dome
      oc.globalCompositeOperation = 'source-atop';
      puffs.forEach(function (p) {
        var px = p[0], py = p[1], pr = p[2], isBack = p[3];
        // Lower-right soft sky-blue volume shading
        var sg = oc.createRadialGradient(px + pr * .22, py + pr * .26, pr * .1, px + pr * .1, py + pr * .1, pr * 1.05);
        sg.addColorStop(0, isBack ? 'rgba(186,218,244,0.52)' : 'rgba(196,225,248,0.42)');
        sg.addColorStop(0.65, 'rgba(215,236,252,0.18)');
        sg.addColorStop(1, 'rgba(235,246,255,0)');
        oc.fillStyle = sg;
        oc.beginPath(); oc.arc(px, py, pr * 1.05, 0, Math.PI * 2); oc.fill();

        // Upper-left bright sunlit pillow dome (fades to 0 alpha before the puff edge so zero hard rings)
        var pg = oc.createRadialGradient(px - pr * .26, py - pr * .30, pr * .04, px - pr * .08, py - pr * .10, pr * .90);
        pg.addColorStop(0, isBack ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.99)');
        pg.addColorStop(0.52, isBack ? 'rgba(255,255,255,0.54)' : 'rgba(255,255,255,0.82)');
        pg.addColorStop(0.85, 'rgba(255,255,255,0.18)');
        pg.addColorStop(1, 'rgba(255,255,255,0)');
        oc.fillStyle = pg;
        oc.beginPath(); oc.arc(px, py, pr, 0, Math.PI * 2); oc.fill();
      });

      // Stamp finished cloud onto main canvas with a gentle sky shadow
      c.save();
      c.shadowColor = 'rgba(35,105,165,0.18)';
      c.shadowBlur = s * .26;
      c.shadowOffsetY = s * .07;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.drawImage(off, 0, 0);
      c.restore();
    }
    function draw() {
      var W = innerWidth, H = innerHeight, d = Math.min(devicePixelRatio || 1, K.MOBILE ? 1.5 : 2);
      if (W < 2 || H < 2) return;
      cv.width = W * d; cv.height = H * d; var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, H);
      var base = Math.max(W, H * 1.35);
      SPOTS.forEach(function (sp, i) { cloud(c, sp[0] * W, sp[1] * H, sp[2] * base * .48, i + 1, W, H, d); });
    }
    draw(); addEventListener('resize', draw);
    window.__home3dCloudCv = cv;
  })();

  /* ---------------- islands: blobs with grassy tops and earth cliffs ---------------- */
  var grassTex = texH('grass.jpg', .07), sandTex = texH('sand.jpg', .09);
  function blobPts(cx, cz, rx, rz, seed, wob, rot) {
    var pts = [], n = 44, cr = Math.cos(rot || 0), sr = Math.sin(rot || 0);
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, w = 1 + (wob != null ? wob : .1) * (Math.sin(a * 3 + (seed || 0)) * .6 + Math.sin(a * 5 + (seed || 0) * 2.3) * .4);
      var lx = Math.cos(a) * rx * w, lz = Math.sin(a) * rz * w;
      var wx = cx + lx * cr - lz * sr, wz = cz + lx * sr + lz * cr;
      pts.push(new T3.Vector2(wx, -wz));
    }
    return pts;
  }
  function splinePts(rawPts, samples) {
    var ctrl = rawPts.map(function (p) { return V(p[0], 0, -p[1]); });
    var crv = new T3.CatmullRomCurve3(ctrl, true, 'centripetal', 0.5);
    var n = samples || 68, pts = [];
    for (var i = 0; i < n; i++) {
      var v = crv.getPointAt(i / n);
      pts.push(new T3.Vector2(v.x, v.z));
    }
    if (T3.ShapeUtils && T3.ShapeUtils.isClockWise && T3.ShapeUtils.isClockWise(pts)) pts.reverse();
    return pts;
  }
  function expandPts(pts, pad) {
    var c = centroid(pts);
    return pts.map(function (p) {
      var dx = p.x - c.x, dy = p.y - c.y, len = Math.hypot(dx, dy) || 1;
      return new T3.Vector2(p.x + (dx / len) * pad, p.y + (dy / len) * pad);
    });
  }
  var cliffTex = K.canvasTex(64, 256, function (c, W, H) {   // earth layers: grass lip, warm soil, darker stripes
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8a5a34'); g.addColorStop(.55, '#b9773f'); g.addColorStop(.86, '#c98b4e'); g.addColorStop(.9, '#5fbf4a'); g.addColorStop(1, '#7bd65a');
    c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(90,50,20,.18)'; [40, 95, 150].forEach(function (y) { c.fillRect(0, y, W, 7); });
  });
  cliffTex.wrapS = T3.RepeatWrapping; cliffTex.repeat.set(.1, 1);
  cliffTex = texH('cliff.jpg', .09, 1); cliffTex.wrapT = T3.ClampToEdgeWrapping;   // Gemini's painted earth layers (the code-drawn one above is the fallback while it loads)
  var cliffSand = K.canvasTex(16, 64, function (c, W, H) { var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#c99a5c'); g.addColorStop(1, '#f2d39a'); c.fillStyle = g; c.fillRect(0, 0, W, H); });
  function centroid(pts) { var c = new T3.Vector2(); pts.forEach(function (p) { c.add(p); }); return c.multiplyScalar(1 / pts.length); }
  // an island piece: top at height h, cliff down below the sea, light shallow water round it
  function landPiece(pts, h, kind) {
    var shape = new T3.Shape(); shape.setFromPoints(pts);
    var depth = h + 3.2;
    var g = new T3.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelThickness: .7, bevelSize: .9, bevelSegments: 3, curveSegments: 6 });
    g.rotateX(-Math.PI / 2);
    (function fixSideUV() {   // sides: u along the coast, v 0 at the bottom .. 1 at the top
      var pos = g.attributes.position, uv = g.attributes.uv, grp = g.groups[1] || g.groups[0], idx = g.index;
      var y0 = -.7, y1 = depth + .7;
      for (var i = grp.start; i < grp.start + grp.count; i++) { var v = idx ? idx.getX(i) : i; uv.setY(v, (pos.getY(v) - y0) / (y1 - y0)); }
      uv.needsUpdate = true;
    })();
    // Silky-smooth gradient grass (NO repetitive tiled grass.jpg moiré!) + warm golden sand
    var posAttr = g.attributes.position, vc = new Float32Array(posAttr.count * 3);
    for (var vi = 0; vi < posAttr.count; vi++) {
      var vx = posAttr.getX(vi), vz = posAttr.getZ(vi);
      var grad = Math.sin(vx * 0.065 + vz * 0.055) * 0.5 + Math.cos(vx * 0.045 - vz * 0.07) * 0.5;
      var sh = kind === 'sand' ? (0.97 + grad * 0.035) : (0.95 + grad * 0.08);
      vc[vi * 3] = Math.min(1.08, sh * (kind === 'sand' ? 1.01 : 0.96));
      vc[vi * 3 + 1] = Math.min(1.08, sh * (kind === 'sand' ? 1.00 : 1.04));
      vc[vi * 3 + 2] = Math.min(1.05, sh * (kind === 'sand' ? 0.95 : 0.84));
    }
    g.setAttribute('color', new T3.BufferAttribute(vc, 3));
    var top = kind === 'sand'
      ? mat(0xf3e1bc, { roughness: .94, vertexColors: true })
      : mat(0x8ec46a, { roughness: .95, vertexColors: true }); // Muted pastel meadow grass (-18% sat) so avatars & landmarks pop!
    var m = new T3.Mesh(g, [top, kind === 'sand' ? mat(0xd8a868, { roughness: .94 }) : mat(0xcfa062, { map: cliffTex, roughness: .94 })]);
    m.position.y = h - depth - .7; m.receiveShadow = true; m.castShadow = true; scene.add(m);
    return m;
  }
  /* ---------------- ground: which island is under a point, and how high it is ---------------- */
  var LANDS = [];   // { poly: [[x, z], ...], h }
  function inPoly(poly, x, z) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
      if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
    }
    return inside;
  }
  function groundAt(x, z) { var best = null; LANDS.forEach(function (l) { if (inPoly(l.poly, x, z) && (best === null || l.h > best)) best = l.h; }); return best; }   // null = sea
  function onLand(x, z, r) {   // the point and a ring round it are all on land (keeps things off the cliff edge)
    if (groundAt(x, z) === null) return false;
    for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; if (groundAt(x + Math.cos(a) * r, z + Math.sin(a) * r) === null) return false; }
    return true;
  }
  function buildIslands() {
    var foamList = [];
    function pushFoam(x, z, rx, rz, seed, wob, isSand, rot) {
      if (foamList.length < 31) foamList.push([x, z, rx, rz, seed || 0, wob != null ? wob : .06, isSand ? 1 : 0, rot || 0]);
    }
    LAYOUT.islands.forEach(function (il) {
      var pts = Array.isArray(il.pts) && il.pts.length >= 3
        ? splinePts(il.pts, il.samples || 72)
        : blobPts(il.x, il.z, il.rx, il.rz, il.seed, il.wob, il.rot);
      // Stepped green storybook terrace skirt for elevated bluffs so cliffs step naturally!
      if (il.terrace) {
        var skirtPts = expandPts(pts, typeof il.terrace === 'number' ? il.terrace : 2.2);
        var skirtH = Math.max(0.75, il.h * 0.50);
        landPiece(skirtPts, skirtH, 'grass');
        LANDS.push({ id: il.id + '-skirt', h: skirtH, poly: skirtPts.map(function (p) { return [p.x, -p.y]; }) });
      }
      landPiece(pts, il.h, il.kind);
      var polyXZ = pts.map(function (p) { return [p.x, -p.y]; });
      var minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      polyXZ.forEach(function (q) {
        if (q[0] < minX) minX = q[0]; if (q[0] > maxX) maxX = q[0];
        if (q[1] < minZ) minZ = q[1]; if (q[1] > maxZ) maxZ = q[1];
      });
      LANDS.push({ id: il.id, h: il.h, poly: polyXZ, minX: minX, maxX: maxX, minZ: minZ, maxZ: maxZ });
      if (Array.isArray(il.foam)) {
        il.foam.forEach(function (fm) { pushFoam(fm[0], fm[1], fm[2], fm[3], il.seed || 1.1, 0.05, il.kind === 'sand', fm[4] || 0); });
      } else if (!Array.isArray(il.pts)) {
        pushFoam(il.x, il.z, il.rx, il.rz, il.seed, il.wob, il.kind === 'sand', il.rot || 0);
      } else {
        // Sample overlapping coastal circles along custom spline peninsulas for seamless shore foam!
        var step = Math.max(1, Math.floor(il.pts.length / 7));
        for (var fi = 0; fi < il.pts.length; fi += step) {
          var fp = il.pts[fi];
          pushFoam(fp[0], fp[1], il.foamR || 8.5, il.foamR || 8.5, (fi + 1) * 0.7, 0.05, il.kind === 'sand', 0);
        }
      }
    });
    (LAYOUT.foamRings || []).forEach(function (fm) {
      pushFoam(fm[0], fm[1], fm[2], fm[3], fm[5] || 1.3, 0.05, !!fm[6], fm[4] || 0);
    });
    seaU.uN.value = foamList.length;
    foamList.forEach(function (fm, k) {
      seaU.uIsl.value[k].set(fm[0], fm[1], fm[2], fm[3]);
      seaU.uIslW.value[k].set(fm[4], fm[5], fm[6], fm[7]);
    });
  }

  function buildWaterfalls() {
    var list = LAYOUT.waterfalls || [];
    if (!list.length) return;
    var wfTex = K.canvasTex(128, 256, function (c, W, H) {
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#eefdff');
      g.addColorStop(0.25, '#68dcf0');
      g.addColorStop(0.65, '#34c4dc');
      g.addColorStop(1, '#dffcff');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = 'rgba(255,255,255,0.68)';
      for (var i = 0; i < 22; i++) {
        var sx = (i * 19) % (W - 12);
        var sy = (i * 37) % H;
        c.fillRect(sx, sy, 5 + (i % 4) * 3, 28 + (i % 3) * 16);
      }
    });
    wfTex.wrapS = wfTex.wrapT = T3.RepeatWrapping;
    var wfMat = new T3.MeshStandardMaterial({
      map: wfTex, roughness: 0.25, metalness: 0.05,
      emissive: 0x3ec8dc, emissiveIntensity: 0.24, side: T3.DoubleSide
    });
    var rockM = mat(0x9b9588, { roughness: 0.92 });
    var foamM = new T3.MeshBasicMaterial({ color: 0xf4ffff, transparent: true, opacity: 0.85, depthWrite: false });
    var mistPuffs = [];
    list.forEach(function (wf) {
      var a = V(wf.from[0], wf.from[1], wf.from[2]);
      var b = V(wf.to[0], wf.to[1], wf.to[2]);
      var w = wf.w || 3.0;
      var grp = new T3.Group();
      // Upper stream lip + cascading curved ribbon + plunge pool
      var mid = a.clone().lerp(b, 0.42); mid.y = a.y * 0.72 + b.y * 0.28;
      var crv = new T3.CatmullRomCurve3([
        V(a.x - (b.x - a.x) * 0.28, a.y + 0.06, a.z - (b.z - a.z) * 0.28),
        V(a.x, a.y + 0.05, a.z),
        mid,
        b
      ]);
      var pts = [];
      for (var s = 0; s <= 18; s++) pts.push(crv.getPointAt(s / 18));
      var rGeoPos = [], rGeoUv = [], rGeoIdx = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
        var tg = q.clone().sub(o); tg.y = 0; if (tg.lengthSq() < 1e-4) tg.set(0, 0, 1); tg.normalize();
        var sv = V(-tg.z, 0, tg.x).multiplyScalar(w * 0.5 * (1 + (i / pts.length) * 0.18));
        rGeoPos.push(p.x - sv.x, p.y, p.z - sv.z, p.x + sv.x, p.y, p.z + sv.z);
        rGeoUv.push(0, i * 0.22, 1, i * 0.22);
        if (i < pts.length - 1) { var k0 = i * 2; rGeoIdx.push(k0, k0 + 1, k0 + 2, k0 + 1, k0 + 3, k0 + 2); }
      }
      var rGeo = new T3.BufferGeometry();
      rGeo.setAttribute('position', new T3.Float32BufferAttribute(rGeoPos, 3));
      rGeo.setAttribute('uv', new T3.Float32BufferAttribute(rGeoUv, 2));
      rGeo.setIndex(rGeoIdx);
      rGeo.computeVertexNormals();
      var fallMesh = new T3.Mesh(rGeo, wfMat);
      grp.add(fallMesh);

      // Flanking cliff boulders framing the crest & plunge pool
      var sideDir = V(-(b.z - a.z), 0, b.x - a.x).normalize();
      [-1, 1].forEach(function (sd) {
        var rTop = new T3.Mesh(new T3.DodecahedronGeometry(0.95, 1), rockM);
        rTop.scale.set(1.15, 0.85, 1.0);
        rTop.position.set(a.x + sideDir.x * (w * 0.62) * sd, a.y + 0.15, a.z + sideDir.z * (w * 0.62) * sd);
        rTop.castShadow = true; grp.add(rTop);

        var rBot = new T3.Mesh(new T3.DodecahedronGeometry(1.05, 1), rockM);
        rBot.scale.set(1.2, 0.72, 1.1);
        rBot.position.set(b.x + sideDir.x * (w * 0.72) * sd, b.y + 0.12, b.z + sideDir.z * (w * 0.72) * sd);
        rBot.castShadow = true; grp.add(rBot);
      });

      // Glowing turquoise lagoon pool + animated white foam ring at base
      var pool = new T3.Mesh(new T3.CircleGeometry(w * 0.98, 22), new T3.MeshStandardMaterial({ color: 0x3ad6e6, roughness: 0.2, emissive: 0x22a8be, emissiveIntensity: 0.22 }));
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(b.x, b.y + 0.06, b.z);
      grp.add(pool);

      var ring = new T3.Mesh(new T3.RingGeometry(w * 0.35, w * 0.88, 20), foamM);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(b.x, b.y + 0.09, b.z);
      grp.add(ring);

      for (var mi = 0; mi < 4; mi++) {
        var mp = new T3.Mesh(new T3.SphereGeometry(0.45 + mi * 0.08, 10, 8), new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65, depthWrite: false }));
        mp.position.set(b.x + (mi - 1.5) * (w * 0.28), b.y + 0.35, b.z + (mi % 2 ? 0.2 : -0.2));
        grp.add(mp);
        mistPuffs.push({ m: mp, y0: b.y + 0.30, ph: mi * 1.5, ring: mi === 0 ? ring : null });
      }
      scene.add(grp);
    });
    K.onFrame(function (dt, t) {
      wfTex.offset.y -= dt * 1.45;
      mistPuffs.forEach(function (mp) {
        var u = (t * 0.9 + mp.ph) % 1;
        mp.m.position.y = mp.y0 + u * 1.15;
        mp.m.scale.setScalar(0.85 + u * 0.75);
        mp.m.material.opacity = (1 - u) * 0.62;
        if (mp.ring) mp.ring.scale.setScalar(0.94 + Math.sin(t * 3.8) * 0.08);
      });
    });
  }

  /* ---------------- free space: buildings, paths and props register what they cover ---------------- */
  var BLOCK = [];
  function blockBox(b, pad, tag) { BLOCK.push({ box: [b.min.x - pad, b.min.z - pad, b.max.x + pad, b.max.z + pad], tag: tag }); }
  function blockCircle(x, z, r, tag) { BLOCK.push({ x: x, z: z, r: r, tag: tag }); }
  function hits(b, x, z, r) { return b.box ? (x + r > b.box[0] && x - r < b.box[2] && z + r > b.box[1] && z - r < b.box[3]) : Math.hypot(x - b.x, z - b.z) < r + b.r; }
  function free(x, z, r, ignoreTag) { return BLOCK.every(function (b) { return (ignoreTag && b.tag === ignoreTag) || !hits(b, x, z, r); }); }

  /* ---------------- paths: from the plaza to each door, heights from the ground, wooden bridges over water ---------------- */
  function sampleCurve(ctrl, step) {
    var c2 = new T3.CatmullRomCurve3(ctrl.map(function (p) { return V(p.x, 0, p.z); }), false, 'centripetal');
    var L = c2.getLength(), n = Math.max(2, Math.ceil(L / step)), out = [];
    for (var i = 0; i <= n; i++) out.push(c2.getPointAt(i / n));
    return out;
  }
  function liftPath(pts, endY) {   // ground height under every point, then a gentle ramp wherever the ground jumps (castle hill)
    var ys = pts.map(function (p) { var g = groundAt(p.x, p.z); p.water = g === null; return g === null ? .3 : g; });
    if (endY != null) ys[ys.length - 1] = endY;
    var slope = .45, ds = pts.length > 1 ? pts[0].distanceTo(pts[1]) : 1;
    for (var k = 0; k < 2; k++) {
      for (var i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] - slope * ds);
      for (var j = ys.length - 2; j >= 0; j--) ys[j] = Math.max(ys[j], ys[j + 1] - slope * ds);
    }
    pts.forEach(function (p, i) { p.y = ys[i]; });
    return pts;
  }
  function ribbonMesh(pts, w, material, lift) {
    var pos = [], uv = [], idx = [], L = 0;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
      var tg = q.clone().sub(o); tg.y = 0; tg.normalize();
      var side = V(-tg.z, 0, tg.x).multiplyScalar(w / 2);
      if (i) L += p.distanceTo(pts[i - 1]);
      pos.push(p.x - side.x, p.y + lift, p.z - side.z, p.x + side.x, p.y + lift, p.z + side.z);
      uv.push(0, L / w, 1, L / w);
      if (i < pts.length - 1) { var a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    var g = new T3.BufferGeometry(); g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    var m = new T3.Mesh(g, material); m.receiveShadow = true; scene.add(m); return m;
  }
  // one path = runs of road on land and wooden bridge over water (the golden road stays golden, it is magic)
  function buildPath(pts, w, landMat, waterMat, lift) {
    var run = [pts[0]], water = pts[0].water;
    function flush() { if (run.length > 1) ribbonMesh(run, w, water && waterMat ? waterMat : landMat, water && waterMat ? .25 : lift); }
    for (var i = 1; i < pts.length; i++) {
      if (pts[i].water !== water) { run.push(pts[i]); flush(); run = [pts[i - 1], pts[i]]; water = pts[i].water; }
      else run.push(pts[i]);
    }
    flush();
    pts.forEach(function (p, i) { if (i % 2 === 0) blockCircle(p.x, p.z, w / 2 + .25, 'path'); });
    return new T3.CatmullRomCurve3(pts.map(function (p) { return p.clone(); }));
  }
  // a path from the plaza to a door, bent sideways if a straight line would cross another building
  function routeTo(door, avoidTag, originPlaza) {
    var pz = originPlaza || LAYOUT.plaza;
    var P0 = V(pz.x, 0, pz.z), dir = door.clone().sub(P0); dir.y = 0;
    var len = dir.length() || 1; dir.normalize();
    var start = P0.clone().add(dir.clone().multiplyScalar(pz.r)), side = V(-dir.z, 0, dir.x);
    var bends = [0, .18, -.18, .32, -.32, .45, -.45], best = null;
    for (var b = 0; b < bends.length && !best; b++) {
      var mid = start.clone().lerp(door, .5).add(side.clone().multiplyScalar(bends[b] * len));
      var pts = sampleCurve([start, mid, door], .8);
      var ok = pts.every(function (p, i) { return i > pts.length - 4 || BLOCK.every(function (bl) { return bl.tag === 'path' || bl.tag === avoidTag || !hits(bl, p.x, p.z, 1.1); }); });
      if (ok) best = pts;
    }
    return best || sampleCurve([start, door], .8);
  }

  /* ---------------- trees: lush rounded Nintendo/Animal Crossing leafy trees ---------------- */
  function buildPines(spots) {
    if (!spots.length) return;
    var parts = [
      new T3.CylinderGeometry(.28, .42, 1.85, 8).translate(0, .92, 0),
      new T3.SphereGeometry(1.45, 14, 11).scale(1.12, .92, 1.08).translate(0, 2.55, 0),
      new T3.SphereGeometry(1.08, 12, 10).translate(-0.85, 2.25, 0.35),
      new T3.SphereGeometry(1.05, 12, 10).translate(0.85, 2.30, -0.25),
      new T3.SphereGeometry(1.02, 12, 10).translate(0.15, 3.25, 0.20)
    ];
    var cols = [0x226e1b, 0x2f7f22, 0x1c5f18], hiCols = [0x459a28, 0x52a82e, 0x3b8c24];
    var m4 = new T3.Matrix4(), q = new T3.Quaternion(), c = new T3.Color();
    parts.forEach(function (geo, pi) {
      var im = new T3.InstancedMesh(geo, mat(0xffffff, { roughness: .88 }), spots.length); im.castShadow = true; im.receiveShadow = true;
      spots.forEach(function (s, k) {
        q.setFromAxisAngle(V(0, 1, 0), s.ry); m4.compose(V(s.x, s.y, s.z), q, V(s.s, s.s, s.s)); im.setMatrixAt(k, m4);
        im.setColorAt(k, c.set(pi === 0 ? 0x6f4120 : (pi === 4 ? hiCols[s.c] : cols[s.c])));
      });
      scene.add(im);
    });
  }
  function buildBushes(spots) {
    if (!spots.length) return;
    var geo = new T3.SphereGeometry(.7, 12, 9), im = new T3.InstancedMesh(geo, mat(0x5cc45e), spots.length * 3), m4 = new T3.Matrix4(), k = 0;
    im.castShadow = true;
    spots.forEach(function (s) { for (var i = 0; i < 3; i++) { m4.makeScale(s.s * rnd(.8, 1.15), s.s * rnd(.8, 1.15), s.s * rnd(.8, 1.15)).setPosition(s.x + rnd(-.5, .5) * s.s, s.y + .45 * s.s, s.z + rnd(-.4, .4) * s.s); im.setMatrixAt(k++, m4); } });
    scene.add(im);
  }
  // look for a free spot near (x, z): on land, away from buildings and paths
  function spotNear(x, z, r, tries) {
    for (var t = 0; t < (tries || 30); t++) {
      var j = t < 10 ? 2.5 : 4.5, jx = x + (t ? rnd(-j, j) : 0), jz = z + (t ? rnd(-j, j) : 0);
      if (onLand(jx, jz, Math.min(r, 1)) && free(jx, jz, r * .8)) return { x: jx, z: jz, y: groundAt(jx, jz) };
    }
    return null;
  }
  /* ---------------- signs: white pills with dark text + 3D arcade game pins ---------------- */
  function sign(text) {
    var w = Math.max(300, text.length * 30 + 90);
    var t = K.canvasTex(w, 120, function (c, W, H) {
      c.shadowColor = 'rgba(0,0,0,.22)'; c.shadowOffsetY = 7; c.shadowBlur = 10;
      c.fillStyle = '#fffdf7'; K.roundRect(c, 10, 8, W - 20, H - 26, 44); c.fill();
      c.shadowColor = 'transparent'; c.fillStyle = '#2b1d40'; c.font = '800 52px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, W / 2, H / 2 - 5);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: t, depthTest: false, transparent: true, opacity: 0 })); s.renderOrder = 6;
    var k = 3.3; s.scale.set(w / 120 * k, k, 1); s.userData.sx = s.scale.x; s.userData.sy = s.scale.y; return s;
  }
  function gamePin(icon, colorHex, beaten) {
    var t = K.canvasTex(160, 160, function (c, W, H) {
      c.shadowColor = 'rgba(20,28,50,0.28)'; c.shadowOffsetY = 8; c.shadowBlur = 12;
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(W / 2, H / 2 - 4, 58, 0, Math.PI * 2); c.fill();
      c.shadowColor = 'transparent';
      c.fillStyle = colorHex || '#4f9dff';
      c.beginPath(); c.arc(W / 2, H / 2 - 4, 49, 0, Math.PI * 2); c.fill();
      c.font = '800 56px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(icon || '🎮', W / 2, H / 2 - 1);
      if (beaten) {
        c.fillStyle = '#ffd84a';
        c.strokeStyle = '#ffffff';
        c.lineWidth = 6;
        c.beginPath(); c.arc(W - 34, 34, 24, 0, Math.PI * 2); c.fill(); c.stroke();
        c.font = '800 28px "Segoe UI Emoji", sans-serif';
        c.fillText('🏆', W - 34, 35);
      }
    });
    var sp = new T3.Sprite(new T3.SpriteMaterial({ map: t, depthTest: false, transparent: true, opacity: 0.94 }));
    sp.renderOrder = 5;
    sp.scale.set(2.35, 2.35, 1);
    sp.userData.sx = 2.35; sp.userData.sy = 2.35;
    return sp;
  }
  function flag(color, x, y, z, parent) {
    var g = new T3.Group(); g.position.set(x, y, z); (parent || scene).add(g);
    add(new T3.Mesh(new T3.CylinderGeometry(.08, .08, 4, 6), mat(0x8a5a3c)), 0, 2, 0, g);
    var f = new T3.Mesh(new T3.PlaneGeometry(1.6, 1), mat(color, { side: T3.DoubleSide })); f.geometry.translate(.8, 0, 0); add(f, 0, 3.45, 0, g);
    var ph = Math.random() * 6; K.onFrame(function (dt, t) { f.rotation.y = Math.sin(t * 2.6 + ph) * .3; });
    g.userData.keep = true; return g;
  }

  // Today — fairy-tale castle on the back hill
  function castle() {
    var g = new T3.Group(), wall = mat(0xf7e9cf), wall2 = mat(0xead6b2);
    add(new T3.Mesh(new T3.BoxGeometry(10, 5.5, 5.5), wall), 0, 2.75, 0, g);
    for (var i = 0; i < 8; i++) add(new T3.Mesh(new T3.BoxGeometry(.75, .75, .75), wall2), -4.4 + i * 1.26, 5.85, 2.75, g);
    add(new T3.Mesh(new T3.BoxGeometry(2.4, 2.6, .3), mat(0x8a5a3c)), 0, 1.3, 2.8, g);
    var arch = add(new T3.Mesh(new T3.CylinderGeometry(1.2, 1.2, .3, 20, 1, false, -Math.PI / 2, Math.PI), mat(0x8a5a3c)), 0, 2.6, 2.8, g); arch.rotation.x = Math.PI / 2;
    var roofs = [0x4f9dff, 0x9b7bff, 0x2fc58a, 0xff5fa2, 0x4fb8c8];
    [[-5, -2.2, 1.4, 8], [5, -2.2, 1.4, 8], [-5, 2.4, 1.3, 6.5], [5, 2.4, 1.3, 6.5], [0, -1, 1.9, 11]].forEach(function (p, i) {
      add(new T3.Mesh(new T3.CylinderGeometry(p[2], p[2] * 1.06, p[3], 20), wall), p[0], p[3] / 2, p[1], g);
      add(new T3.Mesh(new T3.ConeGeometry(p[2] * 1.35, p[2] * 2.3, 20), mat(roofs[i])), p[0], p[3] + p[2] * 1.15, p[1], g);
      for (var w = 0; w < 2; w++) add(new T3.Mesh(new T3.BoxGeometry(.5, .8, .1), mat(0x6fb6ff)), p[0], p[3] * (.45 + w * .25), p[1] + p[2] + .02, g);
      var fg = flag(roofs[(i + 2) % 5], p[0], p[3] + p[2] * 2.25, p[1], g); fg.scale.setScalar(.5); fg.userData.keep = false;
    });
    g.position.set(-5, 2.6, -24); g.scale.setScalar(.95); return g;
  }
  // Class Board — stone colosseum with a round wooden stage, open towards the camera
  function colosseum() {
    var g = new T3.Group(), stoneA = mat(0xeee4d2), stoneB = mat(0xdcd0ba);
    var A0 = Math.PI * .42, AL = Math.PI * 1.16;
    for (var k = 5; k >= 0; k--) {
      var r = 4.6 + k * 1.05, h = .45 * (k + 1);
      add(new T3.Mesh(new T3.CylinderGeometry(r, r, h, 56, 1, false, A0, AL), k % 2 ? stoneA : stoneB), 0, h / 2, 0, g);
    }
    var R2 = 11.2;
    add(new T3.Mesh(new T3.CylinderGeometry(R2, R2, 1.2, 56, 1, true, A0, AL), mat(0xe6dac4, { side: T3.DoubleSide })), 0, 5.6, 0, g);
    for (var c = 0; c <= 14; c++) {
      var a = A0 + c / 14 * AL;
      add(new T3.Mesh(new T3.BoxGeometry(.7, 3.2, .7), stoneA), Math.sin(a) * R2, 3.6, Math.cos(a) * R2, g);
    }
    add(new T3.Mesh(new T3.CylinderGeometry(3.8, 3.9, .6, 48), mat(0xe8a861)), 0, .3, 0, g);
    var rim = add(new T3.Mesh(new T3.TorusGeometry(3.85, .16, 8, 48), mat(0xc98444)), 0, .62, 0, g); rim.rotation.x = Math.PI / 2;
    var inner = add(new T3.Mesh(new T3.TorusGeometry(2.6, .06, 6, 48), mat(0xd29350)), 0, .62, 0, g); inner.rotation.x = Math.PI / 2;
    g.position.set(-15, 0, -1); g.rotation.y = .25; return g;
  }
  // Shop — pink striped market stall with fruit
  function stripes(cols, n) { return K.canvasTex(512, 64, function (c, W, H) { for (var i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.fillRect(i * W / n, 0, W / n + 1, H); } }); }
  function stall() {
    var g = new T3.Group(), wood = mat(0xc88a55);
    add(new T3.Mesh(new T3.BoxGeometry(4.6, 1.3, 2), mat(0xd9a06a)), 0, .65, 0, g);
    add(new T3.Mesh(new T3.BoxGeometry(4.8, .2, 2.2), wood), 0, 1.35, 0, g);
    [[-2.2, -.9], [2.2, -.9], [-2.2, .9], [2.2, .9]].forEach(function (p) { add(new T3.Mesh(new T3.CylinderGeometry(.11, .11, 3.4, 8), wood), p[0], 1.7, p[1], g); });
    var st = stripes(['#ff6fae', '#fff6f0'], 12), side = mat(0xfff6f0);
    var aw = new T3.Mesh(new T3.BoxGeometry(5.4, .22, 3), [side, side, new T3.MeshLambertMaterial({ map: st }), side, side, side]); aw.rotation.x = -.22; add(aw, 0, 3.55, .25, g);
    for (var i = 0; i < 9; i++) { var sc2 = new T3.Mesh(new T3.CylinderGeometry(.3, .3, .14, 14, 1, false, 0, Math.PI), mat(i % 2 ? 0xfff6f0 : 0xff6fae)); sc2.rotation.set(Math.PI / 2, 0, Math.PI); add(sc2, -2.4 + i * .6, 3.2, 1.75, g); }
    var fruit = [0xff5a4f, 0xffb320, 0x8bd34a, 0xff8a3c];
    for (var f = 0; f < 10; f++) add(new T3.Mesh(new T3.SphereGeometry(.2, 10, 8), mat(fruit[f % 4])), -1.8 + f * .4, 1.62, rnd(-.4, .5), g);
    g.position.set(4, 0, -4.5); g.rotation.y = -.15; return g;
  }
  // Library — round tower with giant books
  function library() {
    var g = new T3.Group(), wall = mat(0xf2dfbf);
    add(new T3.Mesh(new T3.CylinderGeometry(3, 3.3, 6.5, 32), wall), 0, 3.25, 0, g);
    add(new T3.Mesh(new T3.CylinderGeometry(3.5, 3.4, .5, 32), mat(0xc98a55)), 0, 6.6, 0, g);
    add(new T3.Mesh(new T3.CylinderGeometry(3.45, 3.45, 1.2, 32, 1, true), mat(0xe9cfa4, { side: T3.DoubleSide })), 0, 7.4, 0, g);
    var bc = [0x4f9dff, 0x2fc58a, 0xff5fa2, 0xffb320];
    for (var i = 0; i < 4; i++) {
      var hb = 3.6 - (i % 2) * .5, b = add(new T3.Mesh(new T3.BoxGeometry(1.05, hb, 2.6), mat(bc[i])), -1.6 + i * 1.08, 6.8 + hb / 2, 0, g);
      add(new T3.Mesh(new T3.BoxGeometry(.95, hb - .25, .06), mat(0xfff8e6)), 0, 0, 1.31, b);
      b.rotation.z = i === 3 ? -.22 : 0;
    }
    add(new T3.Mesh(new T3.BoxGeometry(1.5, 2.2, .3), mat(0x9a5f38)), 0, 1.1, 3.15, g);
    add(new T3.Mesh(new T3.BoxGeometry(1.1, 1.1, .3), mat(0x7fc7ff)), -1.8, 3.8, 2.6, g).rotation.y = -.6;
    add(new T3.Mesh(new T3.BoxGeometry(1.1, 1.1, .3), mat(0x7fc7ff)), 1.8, 3.8, 2.6, g).rotation.y = .6;
    add(new T3.Mesh(new T3.BoxGeometry(2, .4, 1), mat(0xd8cfc0)), 0, .2, 3.8, g);
    g.position.set(13, 0, 4); return g;
  }
  // Games — oval track with a football pitch
  function stadium() {
    var g = new T3.Group();
    var wallRing = new T3.Mesh(new T3.CylinderGeometry(6.6, 6.6, .7, 72, 1, true), mat(0xf4efe6, { side: T3.DoubleSide })); wallRing.scale.set(1.75, 1, 1); add(wallRing, 0, .35, 0, g);
    var base = new T3.Mesh(new T3.CircleGeometry(6.6, 72), mat(0xe2735a)); base.rotation.x = -Math.PI / 2; base.scale.set(1.75, 1, 1); add(base, 0, .05, 0, g);
    for (var l = 0; l < 3; l++) { var ln = new T3.Mesh(new T3.RingGeometry(5 + l * .5, 5.07 + l * .5, 72), mat(0xffffff)); ln.rotation.x = -Math.PI / 2; ln.scale.set(1.75, 1, 1); add(ln, 0, .07, 0, g); }
    var pitch = new T3.Mesh(new T3.CircleGeometry(4.6, 72), mat(0x5cc46a)); pitch.rotation.x = -Math.PI / 2; pitch.scale.set(1.75, 1, 1); add(pitch, 0, .08, 0, g);
    var lines = K.canvasTex(512, 256, function (c, W, H) {
      for (var s = 0; s < 8; s++) { c.fillStyle = s % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.05)'; c.fillRect(70 + s * (W - 140) / 8, 40, (W - 140) / 8, H - 80); }
      c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(70, 40, W - 140, H - 80); c.beginPath(); c.moveTo(W / 2, 40); c.lineTo(W / 2, H - 40); c.stroke();
      c.beginPath(); c.arc(W / 2, H / 2, 34, 0, 7); c.stroke(); c.strokeRect(70, H / 2 - 50, 50, 100); c.strokeRect(W - 120, H / 2 - 50, 50, 100);
    });
    var lm = new T3.Mesh(new T3.PlaneGeometry(13.4, 6.8), new T3.MeshLambertMaterial({ map: lines, transparent: true })); lm.rotation.x = -Math.PI / 2; add(lm, 0, .1, 0, g);
    [-1, 1].forEach(function (s) { add(new T3.Mesh(new T3.BoxGeometry(.15, 1, 1.6), mat(0xffffff)), s * 6.3, .5, 0, g); });
    add(new T3.Mesh(new T3.BoxGeometry(3.2, .4, .7), mat(0x4f9dff)), 9, .2, 4.2, g).rotation.y = -.6;
    var ball = add(new T3.Mesh(new T3.SphereGeometry(.32, 16, 12), mat(0xffffff)), 1.5, .4, .8, g);
    K.onFrame(function (dt, t) { ball.position.x = Math.sin(t * .7) * 3; ball.position.y = .4 + Math.abs(Math.sin(t * 2.4)) * .9; });
    g.position.set(3, 0, 10.5); g.rotation.y = .03; g.scale.setScalar(.9); return g;
  }

  // AI Smart Board & Whiteboard Studio Cottage — chunky storybook classroom cottage with pitched blue roof & glowing interactive screen!
  function smartboard() {
    var g = new T3.Group(), wall = mat(0xf7ebd2), roofM = mat(0x4f9dff), wood = mat(0xb8763e), trim = mat(0x8a5228);
    // Ground stone terrace
    add(new T3.Mesh(new T3.BoxGeometry(7.2, 0.32, 5.4), mat(0xe8decb)), 0, 0.16, 0.2, g);
    // Cozy cottage body
    add(new T3.Mesh(new T3.BoxGeometry(6.4, 3.6, 4.0), wall), 0, 1.96, -0.2, g);
    // Corner wooden pillars
    [[-3.15, -2.15], [3.15, -2.15], [-3.15, 1.75], [3.15, 1.75]].forEach(function (p) {
      add(new T3.Mesh(new T3.BoxGeometry(0.36, 3.7, 0.36), wood), p[0], 1.98, p[1], g);
    });
    // Pitched storybook roof (4-sided hip/gable prism) + cute chimney
    var roofGeo = new T3.ConeGeometry(4.9, 2.35, 4);
    roofGeo.rotateY(Math.PI / 4);
    var roof = new T3.Mesh(roofGeo, roofM);
    roof.scale.set(1.08, 1, 0.76);
    add(roof, 0, 4.88, -0.2, g);
    add(new T3.Mesh(new T3.BoxGeometry(6.9, 0.24, 4.5), trim), 0, 3.78, -0.2, g);
    add(new T3.Mesh(new T3.CylinderGeometry(0.42, 0.48, 1.5, 10), mat(0xe89a72)), 2.1, 5.25, -0.9, g);
    // Interactive Smart Board mounted across the front archway
    add(new T3.Mesh(new T3.BoxGeometry(4.9, 2.65, 0.28), mat(0x2b1d40)), 0, 2.22, 1.86, g);
    var scrTex = K.canvasTex(512, 280, function (c, W, H) {
      var bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#eef8ff'); bg.addColorStop(1, '#fff8ec');
      c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.fillStyle = '#4f9dff'; K.roundRect(c, 20, 16, W - 40, 46, 14); c.fill();
      c.fillStyle = '#fff'; c.font = '800 26px Nunito, sans-serif'; c.textAlign = 'center'; c.fillText('🎨 AI SMART BOARD', W / 2, 47);
      var cols = ['#ff5fa2', '#2fc58a', '#ffb320'];
      for (var k = 0; k < 3; k++) {
        c.fillStyle = cols[k]; K.roundRect(c, 26 + k * 156, 82, 142, 122, 16); c.fill();
        c.fillStyle = '#fff'; K.roundRect(c, 34 + k * 156, 90, 126, 80, 10); c.fill();
      }
      c.strokeStyle = '#ff5fa2'; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(58, 240); c.quadraticCurveTo(180, 212, 310, 244); c.quadraticCurveTo(395, 258, 454, 230); c.stroke();
    });
    add(new T3.Mesh(new T3.PlaneGeometry(4.45, 2.25), new T3.MeshBasicMaterial({ map: scrTex })), 0, 2.22, 2.02, g);
    // Side flowerboxes & front stylus shelf
    add(new T3.Mesh(new T3.BoxGeometry(5.1, 0.20, 0.45), wood), 0, 0.86, 2.04, g);
    [-3.55, 3.55].forEach(function (fx, fi) {
      add(new T3.Mesh(new T3.BoxGeometry(0.65, 0.55, 2.2), wood), fx, 0.55, -0.1, g);
      for (var fl = -0.7; fl <= 0.75; fl += 0.7) {
        add(new T3.Mesh(new T3.SphereGeometry(0.32, 8, 7), mat(fi ? 0xff5fa2 : 0xffb320)), fx, 0.95, fl, g);
      }
    });
    return g;
  }

  /* ---------------- team homes (the monsters are the stars) ---------------- */
  function nestTower() {
    var g = new T3.Group(), wood = mat(0xb07a4a);
    add(new T3.Mesh(new T3.CylinderGeometry(2, 2.4, 6, 18), mat(0xc79464)), 0, 3, 0, g);
    for (var i = 0; i < 4; i++) add(new T3.Mesh(new T3.TorusGeometry(2.15 + i * .02, .1, 6, 24), wood), 0, 1 + i * 1.4, 0, g).rotation.x = Math.PI / 2;
    add(new T3.Mesh(new T3.BoxGeometry(1, 1.4, .2), mat(0x6e4325)), 0, 3, 2.3, g);
    add(new T3.Mesh(new T3.ConeGeometry(2.8, 3, 18), mat(0xff5fa2)), 0, 7.5, 0, g);
    var nest = add(new T3.Mesh(new T3.TorusGeometry(1.6, .55, 10, 26), mat(0xc58c55)), 2.6, 4.8, 1.2, g); nest.rotation.x = Math.PI / 2;
    add(new T3.Mesh(new T3.CylinderGeometry(1.4, 1.2, .5, 20), mat(0xa77243)), 2.6, 4.6, 1.2, g);
    flag(0xff5fa2, 0, 9, 0, g);
    g.position.set(-28, 4.2, -13); return g;
  }
  function garden() {
    var g = new T3.Group();
    var bed = add(new T3.Mesh(new T3.CylinderGeometry(3.6, 3.8, .7, 8), mat(0x8a5a3c)), 0, .35, 0, g); bed.rotation.y = Math.PI / 8;
    var hedge = add(new T3.Mesh(new T3.TorusGeometry(3.7, .55, 8, 8), mat(0x3fae52)), 0, .7, 0, g); hedge.rotation.set(Math.PI / 2, 0, Math.PI / 8);
    var fc = [0xff6fae, 0xffffff, 0xffd84a, 0xff8a3c];
    for (var i = 0; i < 26; i++) { var a = rnd(0, 6.28), r = rnd(.3, 2.9); add(new T3.Mesh(new T3.SphereGeometry(rnd(.18, .3), 8, 6), mat(fc[i % 4])), Math.cos(a) * r, .85, Math.sin(a) * r, g); }
    for (var b = 0; b < 8; b++) { var a2 = rnd(0, 6.28), r2 = rnd(.5, 2.6); add(new T3.Mesh(new T3.SphereGeometry(.45, 10, 8), mat(0x56c45f)), Math.cos(a2) * r2, .8, Math.sin(a2) * r2, g); }
    flag(0x2fc58a, -2.5, .2, -3.2, g);
    g.position.set(15, 0, -14); return g;
  }
  function windmill() {
    var g = new T3.Group();
    add(new T3.Mesh(new T3.CylinderGeometry(1.3, 2, 5, 8), mat(0xe4b77a)), 0, 2.5, 0, g);
    add(new T3.Mesh(new T3.ConeGeometry(1.8, 2, 8), mat(0xb6703c)), 0, 6, 0, g);
    add(new T3.Mesh(new T3.BoxGeometry(.9, 1.4, .2), mat(0x7a4a28)), 0, .7, 1.75, g);
    var hub = new T3.Group(); hub.position.set(0, 4.8, 1.6); g.add(hub);
    for (var i = 0; i < 4; i++) { var arm = new T3.Group(); arm.rotation.z = i * Math.PI / 2; hub.add(arm); add(new T3.Mesh(new T3.BoxGeometry(.9, 3.6, .1), mat(i % 2 ? 0xf6e2bf : 0xd9a86a)), 0, 2, 0, arm); }
    K.onFrame(function (dt) { hub.rotation.z -= dt * .9; });
    flag(0xffb320, 3, .2, -1, g);
    for (var f = 0; f < 80; f++) { var x = rnd(-8, 8), z = rnd(-3.5, 5.5); if (Math.hypot(x, z) < 2.4 || Math.hypot(x - 4.5, z - 2.5) < 2.2) continue; add(new T3.Mesh(new T3.SphereGeometry(rnd(.16, .26), 7, 5), mat(f % 5 ? 0xffd23a : 0xffffff)), x, .3, z, g).userData.keep = true; }
    g.position.set(-34, .2, 20); g.rotation.y = .5; return g;
  }
  function pond() {
    var g = new T3.Group();
    var w = new T3.Mesh(new T3.CircleGeometry(4.6, 40), new T3.MeshLambertMaterial({ color: 0x46c8f5, emissive: 0x1a8fd0, emissiveIntensity: .25 })); w.rotation.x = -Math.PI / 2; w.scale.set(1.25, 1, 1); add(w, 0, .12, 0, g);
    var rocks = mat(0xa9a7a2), rocks2 = mat(0x8f8d88);
    [[5, 1.1, -2.6, 2.1], [6.6, 2.4, -1.2, 1.8], [3.6, 2.8, -3.6, 1.6], [6.2, .8, .9, 1.3], [-5.2, .6, 1.8, 1], [7.2, 3.6, -2.8, 1.4]].forEach(function (r, i) {
      add(new T3.Mesh(new T3.DodecahedronGeometry(r[3], 0), i % 2 ? rocks : rocks2), r[0], r[1], r[2], g).rotation.set(rnd(0, 3), rnd(0, 3), 0);
    });
    var fall = new T3.Mesh(new T3.PlaneGeometry(1.6, 3.6), new T3.MeshBasicMaterial({ color: 0xc8f1ff, transparent: true, opacity: .85 })); add(fall, 4.4, 1.8, -1.4, g); fall.rotation.y = -.8; fall.castShadow = false;
    K.onFrame(function (dt, t) { fall.material.opacity = .7 + .15 * Math.sin(t * 9); });
    flag(0x4f9dff, 2.5, 3.4, -3.8, g);
    g.position.set(31, .2, 22); return g;
  }
  /* ---------------- places and homes: a real model when there is one, otherwise the code-built shape ---------------- */
  var BUILDERS = { castle: castle, colosseum: colosseum, smartboard: smartboard, stall: stall, library: library, stadium: stadium, nestTower: nestTower, pond: pond, windmill: windmill, garden: garden };
  var places = [], hover = null, homes = [], homeHits = [];
  function anchorOf(box, a) { return V(K.lerp(box.min.x, box.max.x, a[0]), K.lerp(box.min.y, box.max.y, a[1]), K.lerp(box.min.z, box.max.z, a[2])); }
  // put one building at its spot from layout.json; returns { group, box (world), anchors }
  function setUp(spec, loaded) {
    var gy = groundAt(spec.x, spec.z); if (gy === null) gy = 0;
    var group, meta = MODELS[spec.model] || {};
    if (spec.group) { group = spec.group; }
    else if (loaded) {
      var model = K.fitModel(loaded.scene, spec.w, { byLength: true, receive: true });
      model.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .28; mm.metalness = 0; });
        }
      });
      group = new T3.Group(); group.add(model); group.position.set(spec.x, gy, spec.z); group.rotation.y = spec.ry || 0;
    } else {
      group = BUILDERS[spec.fallback](); group.position.set(spec.x, gy, spec.z);
      if (spec.fallback === 'windmill') group.children.forEach(function (c) { if (c.userData.keep && !c.isGroup) c.visible = false; });   // its own flowers come from the layout now
      group.children.forEach(function (c) { if (c.isGroup && c.userData.keep) c.visible = false; });   // flags come from the layout now
    }
    if (!group.parent) scene.add(group); group.updateMatrixWorld(true);
    var box = new T3.Box3();
    group.traverse(function (o) { if (o.isMesh) { var v = true, q = o; while (q) { if (!q.visible) v = false; q = q.parent; } if (v) box.expandByObject(o); } });
    var door = anchorOf(box, meta.door || [.5, 0, 1]); door.y = gy;
    var signAt = meta.sign ? anchorOf(box, meta.sign) : V((box.min.x + box.max.x) / 2, box.max.y + 1.4, (box.min.z + box.max.z) / 2);
    return { group: group, box: box, door: door, signAt: signAt, meta: meta, ground: gy };
  }
  function addPlace(spec, loaded) {
    var u = setUp(spec, loaded);
    var s = sign(spec.signTitle || spec.title); s.position.copy(u.signAt); scene.add(s);
    // +20% expanded touch hitbox beyond visual bounds to eliminate child fat-finger misses on 65"-86" smartboards!
    var size = u.box.getSize(V());
    var hit = new T3.Mesh(
      new T3.BoxGeometry((size.x + 1.0) * 1.20, (size.y + 1.0) * 1.20, (size.z + 1.0) * 1.20),
      new T3.MeshBasicMaterial({ visible: false })
    );
    var pl = {
      id: spec.id,
      title: spec.title,
      rawLink: spec.link || '',
      link: spec.link ? ROOT + spec.link : null,
      onSelect: spec.onSelect || null,
      islandZone: spec.islandZone || 'home',
      group: u.group,
      box: u.box,
      door: u.door,
      sign: s,
      pin: null,
      isArcade: !!spec.isArcade,
      isTool: !!spec.isTool,
      toolId: spec.toolId || null,
      skipOverlap: !!spec.skipOverlap,
      y0: u.signAt.y,
      hot: 0
    };
    if (spec.pinSprite) {
      spec.pinSprite.position.set(u.signAt.x, u.signAt.y - 0.15, u.signAt.z);
      spec.pinSprite.userData.place = pl;
      scene.add(spec.pinSprite);
      pl.pin = spec.pinSprite;
    }
    hit.position.copy(u.box.getCenter(V())); hit.userData.place = pl; scene.add(hit); pl.hit = hit; s.userData.place = pl;
    blockBox(u.box, (spec.isArcade || spec.isTool) ? .30 : .6, 'place:' + spec.id); places.push(pl); return pl;
  }
  function addHome(spec, loaded) {
    var u = setUp(spec, loaded), t = K.TEAMS[spec.team];
    var onModel = spec.monster === 'anchor';   // the monster sits on the building (Emberwing's nest), otherwise beside it
    var mon = onModel ? anchorOf(u.box, (loaded && u.meta.monster) || [.75, .55, .6]) : V(spec.x + spec.monster[0], 0, spec.z + spec.monster[1]);
    if (!onModel) mon.y = groundAt(mon.x, mon.z) || u.ground;
    if (spec.flag === 'top') flag(t.hex, (u.box.min.x + u.box.max.x) / 2, u.box.max.y - .3, (u.box.min.z + u.box.max.z) / 2).scale.setScalar(.9);
    else if (spec.flag) flag(t.hex, spec.x + spec.flag[0], (groundAt(spec.x + spec.flag[0], spec.z + spec.flag[1]) || u.ground) + (spec.flag[2] || 0), spec.z + spec.flag[1]);
    var door = spec.door ? V(spec.x + spec.door[0], 0, spec.z + spec.door[1]) : mon.clone(); door.y = groundAt(door.x, door.z) || u.ground;
    blockBox(u.box, .4, 'home:' + spec.team); blockCircle(mon.x, mon.z, 1.6, 'home:' + spec.team);
    var h = { spec: spec, group: u.group, box: u.box, mon: mon, face: spec.face || 0, door: door, teamIdx: spec.team };
    var mh = new T3.Mesh(new T3.CylinderGeometry(2.4, 2.4, 5.4, 10), new T3.MeshBasicMaterial({ visible: false }));
    mh.position.set(mon.x, mon.y + 2.5, mon.z);
    mh.userData.homeObj = h;
    scene.add(mh);
    homeHits.push(mh);
    homes[spec.team] = h; return h;
  }
  function plazaRing() {
    var t = tex('plaza.jpg', 1.5);
    var py = (groundAt(LAYOUT.plaza.x, LAYOUT.plaza.z) || 0) + .07;
    var m = new T3.Mesh(new T3.CircleGeometry(LAYOUT.plaza.r + .6, 40), mat(0xf4efe4, { map: t }));
    m.rotation.x = -Math.PI / 2; m.position.set(LAYOUT.plaza.x, py, LAYOUT.plaza.z); m.receiveShadow = true; scene.add(m);
    // Optional wide Ring Promenade encircling the Middle Social Hub
    if (LAYOUT.promenade) {
      var pr = LAYOUT.promenade;
      var pry = (groundAt(pr.x, pr.z) || py) + 0.065;
      var prom = new T3.Mesh(new T3.RingGeometry(pr.innerR || 5.2, pr.outerR || 8.4, 56), mat(0xf2ebd9, { map: t, roughness: .92 }));
      prom.rotation.x = -Math.PI / 2;
      prom.position.set(pr.x, pry, pr.z);
      prom.receiveShadow = true;
      scene.add(prom);
      var trim = new T3.Mesh(new T3.RingGeometry((pr.outerR || 8.4) - 0.16, (pr.outerR || 8.4) + 0.12, 56), mat(0xd8ccb2));
      trim.rotation.x = -Math.PI / 2;
      trim.position.set(pr.x, pry + 0.015, pr.z);
      scene.add(trim);
    }
    blockCircle(LAYOUT.plaza.x, LAYOUT.plaza.z, LAYOUT.plaza.r + .6, 'plaza');
    if (LAYOUT.gamesPlaza) {
      var gp = LAYOUT.gamesPlaza;
      var gm = new T3.Mesh(new T3.CircleGeometry(gp.r + .8, 40), mat(0xfff4d6, { map: t }));
      gm.rotation.x = -Math.PI / 2; gm.position.set(gp.x, (groundAt(gp.x, gp.z) || 0.65) + .07, gp.z); gm.receiveShadow = true; scene.add(gm);
      var starRing = new T3.Mesh(new T3.RingGeometry(gp.r + .55, gp.r + .95, 40), mat(0xffb320));
      starRing.rotation.x = -Math.PI / 2; starRing.position.set(gp.x, (groundAt(gp.x, gp.z) || 0.65) + .085, gp.z); scene.add(starRing);
      blockCircle(gp.x, gp.z, gp.r + .8, 'gamesPlaza');
    }
  }

  /* ---------------- 3 Calm Flush Circular Stone Modular Build Pads along front shoreline ---------------- */
  var buildPadGroups = {};
  function buildModularPads() {
    var pads = LAYOUT.buildPads || [];
    if (!pads.length) return;
    var stoneM = mat(0xe8e2d5, { roughness: .90 }), rimM = mat(0xd2c8b4, { roughness: .92 });
    var goldM = mat(0xebd292, { roughness: .72 });
    pads.forEach(function (pd, idx) {
      var padId = pd.id || ('pad-' + (idx + 1));
      var gy = groundAt(pd.x, pd.z); if (gy === null) gy = 0.65;
      var g = new T3.Group();
      g.position.set(pd.x, gy, pd.z);
      var r = pd.r || 2.35;
      add(new T3.Mesh(new T3.CylinderGeometry(r, r + 0.20, 0.14, 32), stoneM), 0, 0.07, 0, g);
      var outerTrim = new T3.Mesh(new T3.RingGeometry(r - 0.28, r - 0.06, 32), rimM);
      outerTrim.rotation.x = -Math.PI / 2; outerTrim.position.y = 0.15; g.add(outerTrim);
      var innerRing = new T3.Mesh(new T3.RingGeometry(r * 0.42, r * 0.50, 28), goldM);
      innerRing.rotation.x = -Math.PI / 2; innerRing.position.y = 0.155; g.add(innerRing);
      var stageGroup = new T3.Group();
      stageGroup.position.y = 0.15;
      g.add(stageGroup);
      buildPadGroups[padId] = { id: padId, title: pd.title || ('Build Pad ' + (idx + 1)), group: g, stage: stageGroup, x: pd.x, y: gy, z: pd.z, r: r };
      scene.add(g);
      addPlace({
        id: padId,
        title: pd.title || ('Build Pad ' + (idx + 1)),
        signTitle: '🏗️ ' + (pd.title || ('Build Pad ' + (idx + 1))),
        islandZone: 'home',
        x: pd.x,
        z: pd.z,
        group: g,
        onSelect: function () {
          if (window.Home3DPhase3 && window.Home3DPhase3.openShopTab) {
            window.Home3DPhase3.openShopTab('pads', padId);
            return;
          }
          K.ui.toast('🏗️ ' + (pd.title || ('Modular Build Pad ' + (idx + 1))) + ' — ready for class-built landmarks!', 2.6, '#ffb320');
          K.fx.confetti(V(pd.x, gy + 1.8, pd.z), 28);
        }
      }, null);
    });
  }

  /* ---------------- 3-tier sculpted solid stone & wooden staircases (flush landings, closed risers, zero clipping) ---------------- */
  function buildStairs() {
    var stoneMain = mat(0xd2cbc0, { roughness: .86 });
    var stoneTrim = mat(0xaba396, { roughness: .90 });
    var woodTread = mat(0xbf7438, { roughness: .82 });
    var woodRiser = mat(0x9a5926, { roughness: .88 });
    var woodRail  = mat(0x7c441c, { roughness: .88 });
    (LAYOUT.stairs || []).forEach(function (st) {
      // Orient so `hi` is always the upper terrace end and `lo` is the lower terrace end
      var pA = V(st.from[0], st.y0, st.from[1]);
      var pB = V(st.to[0], st.y1, st.to[1]);
      var lo = pA.y <= pB.y ? pA : pB;
      var hi = pA.y <= pB.y ? pB : pA;
      var d = hi.clone().sub(lo);
      var horiz = Math.hypot(d.x, d.z) || 1;
      var dirX = d.x / horiz, dirZ = d.z / horiz;
      var sideV = V(-dirZ, 0, dirX);
      var yaw = Math.atan2(dirX, dirZ);
      var steps = st.steps || 9;
      var w = st.w || 3.2;
      var isStone = st.kind === 'stone';
      var g = new T3.Group();
      var stepLen = horiz / steps;
      var rise = (hi.y - lo.y) / steps;

      // 1. Clean flush step flight (no protruding floating top/bottom overhang slabs)
      for (var i = 0; i < steps; i++) {
        var u = (i + 0.5) / steps;
        var p = lo.clone().lerp(hi, u);
        var treadTop = lo.y + (i + 1) * rise;
        var blockH = rise + 0.55;
        var box = new T3.Mesh(
          new T3.BoxGeometry(w, blockH, stepLen * 1.15),
          isStone ? stoneMain : (i % 2 ? woodTread : woodRiser)
        );
        box.position.set(p.x, treadTop - blockH * 0.5, p.z);
        box.rotation.y = yaw;
        box.castShadow = true; box.receiveShadow = true;
        g.add(box);
        if (!isStone) {
          var lip = new T3.Mesh(new T3.BoxGeometry(w + 0.12, 0.13, stepLen * 1.08), woodTread);
          lip.position.set(p.x, treadTop - 0.03, p.z);
          lip.rotation.y = yaw; lip.castShadow = true; lip.receiveShadow = true;
          g.add(lip);
        }
        blockCircle(p.x, p.z, w * 0.54, 'stair');

        // Sturdy vertical pilings down to ground/seabed under wooden stairways & bridges
        if (st.pilings && (i === 1 || i === Math.floor(steps / 2) || i === steps - 2)) {
          var gUnder = groundAt(p.x, p.z);
          var baseBed = gUnder !== null ? (gUnder - 0.6) : -2.4;
          var legH = Math.max(0.6, treadTop - 0.25 - baseBed);
          [-1, 1].forEach(function (sd) {
            var leg = new T3.Mesh(new T3.CylinderGeometry(0.14, 0.16, legH, 8), woodRail);
            leg.position.set(p.x + sideV.x * (w * 0.46) * sd, treadTop - 0.25 - legH * 0.5, p.z + sideV.z * (w * 0.46) * sd);
            leg.castShadow = true; g.add(leg);
          });
        }
      }

      // 2. Clean sloped side stringers / stone curbs neatly framing the exact flight length (no overshooting into dirt!)
      var fullLen = Math.hypot(horiz, hi.y - lo.y);
      var pitch = Math.atan2(hi.y - lo.y, horiz);
      var mid = lo.clone().lerp(hi, 0.5);
      [-1, 1].forEach(function (sd) {
        var sx = mid.x + sideV.x * (w * 0.5 + (isStone ? 0.22 : 0.16)) * sd;
        var sz = mid.z + sideV.z * (w * 0.5 + (isStone ? 0.22 : 0.16)) * sd;
        var beam = new T3.Mesh(
          new T3.BoxGeometry(isStone ? 0.44 : 0.22, isStone ? 0.72 : 0.44, fullLen),
          isStone ? stoneTrim : woodRail
        );
        beam.position.set(sx, mid.y + (isStone ? 0.18 : 0.08), sz);
        beam.rotation.order = 'YXZ';
        beam.rotation.y = yaw;
        beam.rotation.x = -pitch;
        beam.castShadow = true; beam.receiveShadow = true;
        g.add(beam);
        if (!isStone) {
          [lo, hi].forEach(function (ep) {
            var post = new T3.Mesh(new T3.CylinderGeometry(0.14, 0.16, 0.88, 8), woodRail);
            post.position.set(ep.x + sideV.x * (w * 0.5 + 0.16) * sd, ep.y + 0.36, ep.z + sideV.z * (w * 0.5 + 0.16) * sd);
            post.castShadow = true; g.add(post);
          });
        }
      });
      scene.add(g);
    });
  }

  /* ---------------- engineered wooden pier helper (always sits cleanly ABOVE sand & water) ---------------- */
  function buildTimberPier(ax, ay, az, bx, by, bz, w, nPlanks) {
    var woodTread = mat(0xb86f36, { roughness: .84 }), woodRail = mat(0x7e461d, { roughness: .88 });
    var a = V(ax, ay, az), b = V(bx, by, bz), d = b.clone().sub(a);
    var horiz = Math.hypot(d.x, d.z) || 1, yaw = Math.atan2(d.x, d.z);
    var sideV = V(-d.z / horiz, 0, d.x / horiz);
    var g = new T3.Group();
    for (var i = 0; i < nPlanks; i++) {
      var u = (i + 0.5) / nPlanks, p = a.clone().lerp(b, u);
      var plank = new T3.Mesh(new T3.BoxGeometry(w, 0.20, (horiz / nPlanks) * 0.84), woodTread);
      plank.position.set(p.x, p.y, p.z); plank.rotation.y = yaw;
      plank.castShadow = true; plank.receiveShadow = true; g.add(plank);
    }
    [-1, 1].forEach(function (sd) {
      var mid = a.clone().lerp(b, 0.5);
      var beam = new T3.Mesh(new T3.BoxGeometry(0.20, 0.24, horiz + 0.2), woodRail);
      beam.position.set(mid.x + sideV.x * (w * 0.44) * sd, mid.y - 0.16, mid.z + sideV.z * (w * 0.44) * sd);
      beam.rotation.y = yaw; beam.castShadow = true; g.add(beam);
      [0.08, 0.52, 0.94].forEach(function (pu) {
        var pp = a.clone().lerp(b, pu), pH = pp.y + 2.6;
        var post = new T3.Mesh(new T3.CylinderGeometry(0.15, 0.17, pH, 8), woodRail);
        post.position.set(pp.x + sideV.x * (w * 0.48) * sd, pp.y + 0.35 - pH * 0.5, pp.z + sideV.z * (w * 0.48) * sd);
        post.castShadow = true; g.add(post);
      });
    });
    scene.add(g);
    return g;
  }

  /* ---------------- harbour, bridge and Treasure Island ---------------- */
  var TI, DOCK, chestGroup, chestLight, PLANKS = 14, planks = [];
  function buildHarbour() {
    TI = LAYOUT.treasure; DOCK = LAYOUT.harbour;
    chestGroup = new T3.Group(); chestGroup.position.set(TI.x + .5, .15, TI.z); scene.add(chestGroup);
    chestLight = new T3.PointLight(0xffd84a, 0, 16); chestLight.position.set(0, 2.5, 0); chestGroup.add(chestLight);
    // Treasure Island Goal Bridge: dynamic coordinates from LAYOUT.treasureBridge
    var tbSpec = LAYOUT.treasureBridge || { from: [31.0, -10.0], to: [40.4, -12.6] };
    var a = V(tbSpec.from[0], 0.22, tbSpec.from[1]), b = V(tbSpec.to[0], 0.22, tbSpec.to[1]), d = b.clone().sub(a), ang = Math.atan2(d.x, d.z), len = d.length();
    var wood = mat(0xb86f36, { roughness: .84 }), pileM = mat(0x7e461d, { roughness: .88 });
    var ghostM = new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .48, depthWrite: false });
    for (var i = 0; i < PLANKS; i++) {
      var u = (i + .5) / PLANKS;
      var p = a.clone().lerp(b, u), y = K.lerp(a.y, b.y, u) + Math.sin(u * Math.PI) * 0.55;
      var pg = new T3.Group();
      var m = new T3.Mesh(new T3.BoxGeometry(2.6, .24, len / PLANKS * .80), wood);
      m.position.set(p.x, y, p.z); m.rotation.y = ang; m.castShadow = true; m.receiveShadow = true; pg.add(m);
      if (i % 3 === 1) {
        var legH = y + 2.2;
        [-1, 1].forEach(function (sd) {
          var sx = p.x - Math.cos(ang) * 1.05 * sd, sz = p.z + Math.sin(ang) * 1.05 * sd;
          var leg = new T3.Mesh(new T3.CylinderGeometry(0.13, 0.15, legH, 8), pileM);
          leg.position.set(sx, y - legH * 0.5, sz); leg.castShadow = true; pg.add(leg);
        });
      }
      pg.visible = false; scene.add(pg);
      var gh = new T3.Mesh(new T3.BoxGeometry(2.6, .12, len / PLANKS * .80), ghostM); gh.position.set(p.x, y - .05, p.z); gh.rotation.y = ang; scene.add(gh);
      planks.push({ m: pg, ghost: gh, pos: V(p.x, y, p.z), shown: false });
    }
    K.onFrame(function (dt, t) { ghostM.opacity = .35 + .18 * Math.sin(t * 2.5); });
    blockBox({ min: V(DOCK.x - 3, 0, DOCK.z - 3), max: V(DOCK.x + 8, 0, DOCK.z + 9) }, 0, 'harbour');
  }
  function buildBridge(pct, animate) {
    var n = Math.round(pct * PLANKS);
    planks.forEach(function (p, i) {
      if (i >= n || p.shown) return; p.shown = true;
      var show = function () { p.m.visible = true; p.ghost.visible = false; K.fx.puff((p.pos || p.m.position).clone().add(V(0, .4, 0)), 3, { size: .6 }); };
      if (animate) K.after(1 + i * .16, show); else show();
    });
    if (n >= PLANKS) K.after(animate ? 1.3 + PLANKS * .16 : 0, function () { chestLight.intensity = 4; K.fx.confetti(V(TI.x, 4, TI.z), 120); });
  }

  /* ---------------- interaction ---------------- */
  var HOVER_GLOW = new T3.Color(0xffe49a);
  K.onFrame(function (dt, t) {
    places.forEach(function (p, i) {
      p.hot = K.lerp(p.hot, p === hover ? 1 : 0, dt * 8);
      // Names appear cleanly on hover / tap (never blocking buildings on load; add ?names=1 to keep them shown).
      var intro = SHOW_NAMES ? 1 : 0;
      p.sign.material.opacity = Math.max(p.hot, intro);
      p.sign.position.y = p.y0 + Math.sin(t * 1.5 + i) * .15 + p.hot * .4;
      var s = 1 + p.hot * .15; p.sign.scale.set(p.sign.userData.sx * s, p.sign.userData.sy * s, 1);
      if (p.pin) {
        // Keep Overview completely clean of lollipop pin clutter: show game pins ONLY when zoomed into Games Island or hovered!
        var showPin = p.isArcade ? (activeIsland === 'games' || p === hover) : (p === hover);
        p.pin.visible = showPin;
        if (showPin) {
          p.pin.material.opacity = intro ? 0 : Math.max(0, 0.94 * (1 - p.hot * 1.25));
          p.pin.position.y = p.y0 - 0.12 + Math.sin(t * 2.1 + i * 0.9) * 0.18;
        }
      }

      // Tactile Nintendo building hover: gentle lift, subtle scale pop, and soft warm golden glow
      if (p.group) {
        if (p._baseY == null) {
          p._baseY = p.group.position.y;
          p._baseS = p.group.scale.x;
          p._glowMats = [];
          p.group.traverse(function (o) {
            if (!o.isMesh || !o.material) return;
            [].concat(o.material).forEach(function (mm) {
              if (mm && mm.emissive && p._glowMats.indexOf(mm) < 0) p._glowMats.push(mm);
            });
          });
        }
        p.group.position.y = p._baseY + p.hot * 0.32;
        var bs = p._baseS * (1 + p.hot * 0.042);
        p.group.scale.setScalar(bs);
        if (p.hot > 0.005 || p._wasHot) {
          p._wasHot = p.hot > 0.005;
          p._glowMats.forEach(function (mm) {
            mm.emissive.copy(HOVER_GLOW);
            mm.emissiveIntensity = p.hot * 0.22;
          });
        }
      }
    });
  });
  var SHOW_NAMES = /[?&]names=1/.test(location.search), NAMES_T0 = performance.now();
  var ray = new T3.Raycaster(), mouse = new T3.Vector2(), flying = false, canvas = K.renderer.domElement;
  var quietHooks = { overrideMons: false, overrideKids: false, overrideBalloon: false, lighthouseHit: null };
  function placeAt(e) {
    var r = canvas.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(mouse, K.camera);
    // Priority 1: Check seated Colosseum students & walking NPCs first so Colosseum's outer box never swallows pupil clicks!
    if (window.__home3dNpcHits && window.__home3dNpcHits.length) {
      var nh = ray.intersectObjects(window.__home3dNpcHits, false);
      if (nh.length && nh[0].object.visible && nh[0].object.userData && nh[0].object.userData.npc) {
        return { id: 'npc', npc: nh[0].object.userData.npc, clientX: e.clientX, clientY: e.clientY };
      }
    }
    var pins = places.map(function (p) { return p.pin; }).filter(Boolean);
    var targets = pins.concat(places.map(function (p) { return p.sign; })).concat(homeHits).concat(places.map(function (p) { return p.hit; }));
    if (quietHooks.lighthouseHit) targets.push(quietHooks.lighthouseHit);
    var hits = ray.intersectObjects(targets, false);
    if (!hits.length) return null;
    if (hits[0].object.userData && hits[0].object.userData.homeObj) return { id: 'homeTeam', homeObj: hits[0].object.userData.homeObj, clientX: e.clientX, clientY: e.clientY };
    if (hits[0].object === quietHooks.lighthouseHit) return { id: 'lighthouse', title: 'Quiet Island' };
    return hits[0].object.userData.place;
  }
  var drag = null, pointers = {}, pinchStart = null;
  var view = { yaw: 0, pitch: .50, zoom: 1, panX: 0, panZ: 0 };
  var parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', function (e) {
    if (drag || flying || e.pointerType === 'touch') return;
    parallax.tx = clamp((e.clientX / Math.max(1, innerWidth) - 0.5) * 2, -1, 1);
    parallax.ty = clamp((e.clientY / Math.max(1, innerHeight) - 0.5) * 2, -1, 1);
  });
  var groundPlane = new T3.Plane(V(0, 1, 0), 0);
  function worldPointAt(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    mouse.set((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(mouse, K.camera);
    var out = V();
    return ray.ray.intersectPlane(groundPlane, out) ? out : null;
  }
  function setZoom(nextZoom, focusClientX, focusClientY) {
    var prev = view.zoom;
    var z = clamp(nextZoom, .10, 1.18);
    if (Math.abs(z - prev) < 1e-4) return;
    // Zooming in glides the camera target toward the point under the cursor/finger
    if (z < prev && focusClientX != null && focusClientY != null) {
      var wp = worldPointAt(focusClientX, focusClientY);
      if (wp) {
        var pull = clamp((prev - z) / Math.max(prev, .25) * .65, 0, .45);
        view.panX = clamp(K.lerp(view.panX, wp.x - FIT.look.x, pull), -48, 48);
        view.panZ = clamp(K.lerp(view.panZ, wp.z - FIT.look.z, pull), -42, 42);
      }
    } else if (z > prev && z > .88) {
      // Gently re-center as you zoom all the way back out to full island
      var recenter = clamp((z - .88) / .18, 0, 1);
      view.panX *= (1 - recenter * .45);
      view.panZ *= (1 - recenter * .45);
    }
    view.zoom = z;
    // Lower pitch slightly at very close zoom so students & buildings feel eye-level
    if (z < .38 && view.pitch > .44) view.pitch = K.lerp(view.pitch, .38, .18);
    if (z > .95) view.pitch = K.lerp(view.pitch, .50, .2);
    if (zoomBadge) zoomBadge.textContent = Math.round((1 / view.zoom) * 100) + '%';
  }
  /* ---------------- Phase 2: Smartboard Camera Lock, 0.4s Presets & Polyphonic Short Chimes ---------------- */
  var cameraLocked = false;
  var avatarsFrozen = false;
  var focusModeOn = false;
  var highContrastOn = false;
  var activePresetId = 'overview';
  var presetAnim = null;
  var camDockEl = null;
  var accessBarEl = null;
  var focusShellEl = null;
  var focusNoiseBarEl = null, focusNoiseLblEl = null, focusNoiseBoxEl = null;
  var focusGoalBarEl = null, focusGoalLblEl = null;

  function isCameraPanLocked() {
    if (cameraLocked || focusModeOn || flying) return true;
    try {
      if (document.querySelector('#h3Overlay:not(.hidden), #itPanel:not(.hidden), #itPackPanel:not(.hidden)')) return true;
    } catch (e) {}
    return false;
  }
  function setCameraLock(locked) {
    cameraLocked = !!locked;
    if (camDockEl) camDockEl.classList.toggle('locked', cameraLocked);
  }

  // Short polyphonic Web Audio feedback chimes (< 0.6s, dual-oscillator ADSR, zero raw beeps — AGENTS.md §1.3)
  function playShortChime(kind) {
    if (K.muted || K.CAPTURE) return;
    var a = K.audio ? K.audio() : null;
    if (!a) return;
    try {
      var notes = kind === 'reward' ? [523.25, 659.25, 783.99, 1046.5]
                : kind === 'focus'  ? [440.0, 554.37, 659.25]
                : [523.25, 783.99];
      var dur = kind === 'reward' ? 0.34 : 0.22;
      var step = kind === 'reward' ? 0.055 : 0.04;
      notes.forEach(function (f, i) {
        var t0 = a.currentTime + i * step;
        var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
        o1.type = 'triangle'; o2.type = 'sine';
        o1.frequency.setValueAtTime(f, t0);
        o2.frequency.setValueAtTime(f * 2, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.11 / Math.sqrt(notes.length), t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
        o1.connect(g); o2.connect(g); g.connect(a.destination);
        o1.start(t0); o2.start(t0);
        o1.stop(t0 + dur + 0.02); o2.stop(t0 + dur + 0.02);
      });
    } catch (e) {}
  }

  // 5 Smartboard Camera Presets (0.4s smooth cubic ease-out, zero manual zoom pill!)
  var CAM_PRESETS = [
    { id: 'overview',     ico: '🗺️', label: 'Overview',     c: '#2fc58a', d: '#1b8f61', lightTxt: false, zone: 'both',  yaw: 0,     pitch: 0.50, zoom: 1.00, target: null },
    { id: 'castle',       ico: '🏰', label: 'Castle',       c: '#9b7bff', d: '#6b4ce0', lightTxt: false, zone: 'both',  yaw: 0,     pitch: 0.36, zoom: 0.28, target: { x: 0.0,   z: -22.2 } },
    { id: 'shop',         ico: '🛍️', label: 'Pupil Shop',   c: '#ffb320', d: '#c98200', lightTxt: true,  zone: 'both',  yaw: -0.14, pitch: 0.38, zoom: 0.29, target: { x: -19.5, z: 12.8 } },
    { id: 'amphitheater', ico: '🏛️', label: 'Amphitheater', c: '#ff5fa2', d: '#c93776', lightTxt: false, zone: 'both',  yaw: 0.05,  pitch: 0.42, zoom: 0.24, target: { x: -18.2, z: -6.2 } },
    { id: 'racetrack',    ico: '🏁', label: 'Race Track',   c: '#4f9dff', d: '#286ec2', lightTxt: false, zone: 'games', yaw: 0,     pitch: 0.46, zoom: 0.88, target: null }
  ];

  function updatePresetDockUI() {
    if (!camDockEl) return;
    camDockEl.querySelectorAll('.h3-cam-btn').forEach(function (b) {
      var on = b.getAttribute('data-preset') === activePresetId;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function flyToPreset(presetId, instant) {
    var pr = CAM_PRESETS.filter(function (x) { return x.id === presetId; })[0] || CAM_PRESETS[0];
    activePresetId = pr.id;
    updatePresetDockUI();

    if (activeIsland !== pr.zone) {
      activeIsland = pr.zone;
      FIT = FIT_SETS[activeIsland] || FIT_SETS.both;
      FIT.key = '';
      var halfS = activeIsland === 'both' ? 78 : 52;
      if (sun && sun.shadow && sun.shadow.camera) {
        var scP = sun.shadow.camera;
        scP.left = -halfS; scP.right = halfS; scP.top = halfS * 0.78; scP.bottom = -halfS * 0.78;
        scP.updateProjectionMatrix();
      }
    }
    var toPanX = 0, toPanZ = 0;
    if (pr.target) {
      var tx = pr.target.x, tz = pr.target.z;
      // Snap to live place bounding box if loaded
      var placeId = pr.id === 'castle' ? 'today' : pr.id === 'shop' ? 'shop' : pr.id === 'amphitheater' ? 'board' : '';
      if (placeId) {
        var foundP = places.filter(function (p) { return p.id === placeId && p.box; })[0];
        if (foundP) {
          var ctr = foundP.box.getCenter(V());
          tx = ctr.x; tz = ctr.z;
        }
      }
      toPanX = clamp(tx - FIT.look.x, -48, 48);
      toPanZ = clamp(tz - FIT.look.z, -42, 42);
    }

    flying = false;
    home();
    if (instant) {
      presetAnim = null;
      liveIslandLook.copy(FIT.look);
      view.yaw = pr.yaw; view.pitch = pr.pitch; view.zoom = pr.zoom;
      view.panX = toPanX; view.panZ = toPanZ;
      if (K.cam.follow) K.cam.follow(0.016);
      K.cam.snap();
    } else {
      playShortChime('preset');
      presetAnim = {
        t: 0,
        dur: 0.40, // Exact 0.4s smooth cubic ease-out transition!
        from: { yaw: view.yaw, pitch: view.pitch, zoom: view.zoom, panX: view.panX, panZ: view.panZ, lx: liveIslandLook.x, ly: liveIslandLook.y, lz: liveIslandLook.z },
        to:   { yaw: pr.yaw,   pitch: pr.pitch,   zoom: pr.zoom,   panX: toPanX,    panZ: toPanZ,    lx: FIT.look.x,       ly: FIT.look.y,       lz: FIT.look.z }
      };
    }
  }

  function resetView() {
    flyToPreset('overview', false);
  }
  var soundsOn = false;
  function startSound() {
    if (soundsOn || K.CAPTURE) return;
    soundsOn = true;
    K.audio();
    // Load only UI sounds (tap, whoosh) — noLoops skips nonexistent music.mp3 / repetitive crowd.mp3
    K.loadSounds(['tap', 'whoosh'], { noLoops: true });
    setTimeout(function () { if (K.loopVol) { K.loopVol('crowd', 0); K.loopVol('music', 0); } }, 400);
    setTimeout(function () { if (K.loopVol) { K.loopVol('crowd', 0); K.loopVol('music', 0); } }, 1500);
  }
  addEventListener('pointerdown', startSound, true);
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  canvas.addEventListener('wheel', function (e) {
    if (isCameraPanLocked()) return;
    presetAnim = null;
    e.preventDefault();
    var factor = e.deltaY > 0 ? 1.14 : 0.86;
    setZoom(view.zoom * factor, e.clientX, e.clientY);
  }, { passive: false });
  canvas.addEventListener('dblclick', function (e) {
    if (isCameraPanLocked()) return;
    presetAnim = null;
    var wp = worldPointAt(e.clientX, e.clientY);
    if (view.zoom < .35) { resetView(); return; }
    if (wp) {
      view.panX = clamp(wp.x - FIT.look.x, -48, 48);
      view.panZ = clamp(wp.z - FIT.look.z, -42, 42);
    }
    setZoom(.22);
    view.pitch = .42;
  });
  canvas.addEventListener('pointerdown', function (e) {
    if (isCameraPanLocked()) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 2) {
      presetAnim = null;
      var p1 = pointers[ids[0]], p2 = pointers[ids[1]];
      pinchStart = {
        dist: Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1,
        cx: (p1.x + p2.x) * .5, cy: (p1.y + p2.y) * .5,
        zoom: view.zoom, panX: view.panX, panZ: view.panZ
      };
      drag = null;
      return;
    }
    var isPan = (e.button === 2) || e.shiftKey || (e.button === 1) || (e.pointerType === 'touch' && view.zoom < .75);
    drag = {
      id: e.pointerId, x: e.clientX, y: e.clientY,
      yaw: view.yaw, pitch: view.pitch, panX: view.panX, panZ: view.panZ,
      isPan: isPan, moved: false
    };
  });
  canvas.addEventListener('pointermove', function (e) {
    if (isCameraPanLocked()) { drag = null; pinchStart = null; return; }
    if (pointers[e.pointerId]) pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 2 && pinchStart) {
      presetAnim = null;
      var p1 = pointers[ids[0]], p2 = pointers[ids[1]];
      var dist = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      var cx = (p1.x + p2.x) * .5, cy = (p1.y + p2.y) * .5;
      setZoom(pinchStart.zoom * (pinchStart.dist / dist), cx, cy);
      var panScale = 0.085 * view.zoom;
      var ddx = (cx - pinchStart.cx) * panScale, ddy = (cy - pinchStart.cy) * panScale;
      var sy = Math.sin(view.yaw), cyw = Math.cos(view.yaw);
      view.panX = clamp(pinchStart.panX - (ddx * cyw + ddy * sy), -48, 48);
      view.panZ = clamp(pinchStart.panZ - (-ddx * sy + ddy * cyw), -42, 42);
      return;
    }
    if (drag && drag.id === e.pointerId) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) {
        presetAnim = null;
        drag.moved = true;
        if (drag.isPan || view.zoom < .55) {
          if (drag.isPan) {
            var ps = 0.095 * view.zoom;
            var sy2 = Math.sin(view.yaw), cy2 = Math.cos(view.yaw);
            view.panX = clamp(drag.panX - (dx * cy2 + dy * sy2) * ps, -48, 48);
            view.panZ = clamp(drag.panZ - (-dx * sy2 + dy * cy2) * ps, -42, 42);
          } else {
            view.yaw = clamp(drag.yaw - dx / innerWidth * 2.4, -Math.PI, Math.PI);
            view.pitch = clamp(drag.pitch + dy / innerHeight * 1.2, .24, 1.18);
          }
        } else {
          view.yaw = clamp(drag.yaw - dx / innerWidth * 1.8, -1.2, 1.2);
          view.pitch = clamp(drag.pitch + dy / innerHeight * 0.9, .30, 1.12);
        }
      }
      canvas.style.cursor = 'grabbing';
      return;
    }
    if (!drag) { hover = placeAt(e); canvas.style.cursor = hover ? 'pointer' : 'grab'; }
  });
  addEventListener('pointerup', function (e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinchStart = null;
    var d = drag;
    if (d && d.id === e.pointerId) {
      drag = null;
      canvas.style.cursor = hover ? 'pointer' : 'grab';
      if (!d.moved && !d.isPan && e.target === canvas && !isCameraPanLocked()) { var p = placeAt(e); if (p) go(p); }
    }
  });
  addEventListener('pointercancel', function (e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinchStart = null;
    if (drag && drag.id === e.pointerId) drag = null;
  });
  addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'Escape' && focusModeOn) { if (hud._setFocusMode) hud._setFocusMode(false); return; }
    if (isCameraPanLocked()) return;
    if (e.key === '0') resetView();
  });
  function resolveActiveClassAndSet() {
    var clsId = '', setId = '';
    try {
      var prefs = JSON.parse(localStorage.getItem('eaa_games_prefs') || '{}') || {};
      var unlocked = sessionStorage.getItem('eaa_auth_unlocked') === 'true';
      var st = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null');
      if (unlocked && st && Array.isArray(st.classes)) {
        var list = st.classes.filter(function (c) { return c && !c.archived && !/sync/i.test(c.id) && c.grade !== 'System'; });
        var cls = list.filter(function (c) { return c.id === prefs.classId; })[0] || list[0];
        if (cls) {
          clsId = cls.id || '';
          var gNum = /4/.test(String(cls.grade || cls.id || '')) ? 4 : 3;
          setId = prefs.packId || prefs.setId || ('g' + gNum + '-u5-vocab');
        }
      }
      if (!setId) {
        var qCur = localStorage.getItem('eaa_qlib_choice_v1') || '';
        setId = qCur || prefs.packId || prefs.setId || '';
      }
    } catch (e) {}
    return { clsId: clsId, setId: setId };
  }
  var activeIsland = K.Q.get('island') === 'games' ? 'games' : (K.Q.get('island') === 'home' ? 'home' : 'both');
  var quickEl = null, islSwitchEl = null;

  function decorateTargetLink(p) {
    if (!p || !p.link) return '';
    if (!/games\/[^/]+3d\/|game-maker\//i.test(p.link)) return p.link;
    var ctx = resolveActiveClassAndSet();
    var sep = p.link.indexOf('?') >= 0 ? '&' : '?';
    var url = p.link + sep + 'from=games3d';
    if (ctx.clsId) url += '&class=' + encodeURIComponent(ctx.clsId);
    if (ctx.setId) url += '&set=' + encodeURIComponent(ctx.setId);
    return url;
  }
  function openPlace(p) {
    if (NOLINKS || !p) { flying = false; K.after(0.8, home); return; }
    if (window.ClassroomHub && typeof window.ClassroomHub.openPlace === 'function') {
      flying = false;
      home();
      var targetHref0 = p.link ? decorateTargetLink(p) : '';
      window.ClassroomHub.openPlace(p, targetHref0);
      return;
    }
    if (!p.link) { flying = false; K.after(0.8, home); return; }
    var targetHref = decorateTargetLink(p);
    var m = /index\.html#([a-z0-9-]+)/i.exec(targetHref);
    try {
      if (m && window.parent && window.parent !== window && typeof window.parent.switchView === 'function') {
        flying = false;
        window.parent.switchView(m[1]);
        return;
      }
      if (window.top && window.top !== window) {
        window.top.location.href = targetHref;
        return;
      }
    } catch (e) {}
    location.href = targetHref;
  }
  function go(p, fast) {
    if (!p) return;
    if (p.id === 'npc' && p.npc) {
      if (p.npc.onTap) p.npc.onTap();
      if (window.ClassroomHub && window.ClassroomHub.onTapPupil) {
        window.ClassroomHub.onTapPupil(p.npc, p.clientX, p.clientY);
      }
      return;
    }
    if (p.id === 'homeTeam' && p.homeObj) {
      K.sfx('tap');
      if (window.ClassroomHub && window.ClassroomHub.onTapTeamHome) {
        window.ClassroomHub.onTapTeamHome(p.homeObj, p.clientX, p.clientY);
      }
      return;
    }
    if (p.id === 'lighthouse') {
      K.sfx('tap');
      if (window.QuietIsland && window.QuietIsland.togglePanel) window.QuietIsland.togglePanel();
      return;
    }
    if (p.isTool && window.ClassroomHub && window.ClassroomHub.onTapToolProp) {
      K.sfx('tap');
      window.ClassroomHub.onTapToolProp(p);
      return;
    }
    if (typeof p.onSelect === 'function') {
      K.sfx('tap');
      p.onSelect();
      return;
    }
    // 1st-Tap vs 2nd-Tap Games Island UX: when viewing Both Islands, 1st tap on Games Island smoothly zooms in to fill the 16:9 smartboard!
    if (p.islandZone === 'games' && activeIsland === 'both' && !fast) {
      switchIsland('games', false);
      K.ui.toast('🕹️ Games Island — tap any game to play!', 2.2, '#ff7a3d');
      return;
    }
    if (fast || flying || (window.ClassroomHub && !NOLINKS)) { K.sfx('tap'); openPlace(p); return; }
    flying = true; hover = p; K.sfx('tap'); K.sfx('whoosh'); K.say(p.title);
    var c = p.box.getCenter(V());
    K.cam.follow = null; K.cam.set(V(c.x + 3, c.y + 10, c.z + 17), V(c.x, c.y + 1.5, c.z), 1.3);
    K.ui.toast('Going to ' + p.title + '…', 1.3, '#9b7bff');
    K.after(1.2, function () { openPlace(p); });
  }

  /* ---------------- side-by-side dual-island camera: frames BOTH islands together by default, or zooms into either ---------------- */
  var FIT_SETS = {
    both: { pts: [], look: V(), key: '', d: 135 },
    home: { pts: [], look: V(), key: '', d: 100 },
    games: { pts: [], look: V(), key: '', d: 75 }
  };
  var FIT = FIT_SETS[activeIsland] || FIT_SETS.both;
  var liveIslandLook = V(), islandGlideArc = 0;
  var PITCH = .50;
  var SAFE = { x0: -.94, x1: .94, y0: -.75, y1: .85 };
  function fitPoints() {
    var ptsHome = [], ptsGames = [];
    places.forEach(function (p) {
      var arr = p.islandZone === 'games' ? ptsGames : ptsHome;
      var b = p.box;
      [b.min.x, b.max.x].forEach(function (x) { [b.min.z, b.max.z].forEach(function (z) { arr.push(V(x, b.min.y, z)); }); });
      arr.push(p.sign.position.clone().add(V(0, 1.2, 0)));
    });
    homes.forEach(function (h) {
      var c = h.box.getCenter(V());
      ptsHome.push(h.mon.clone(), h.mon.clone().add(V(0, 5, 0)), V(c.x, h.box.max.y, c.z), V(c.x, h.box.min.y, c.z));
      ptsHome.push(V(h.box.min.x - 1.5, h.box.min.y, c.z), V(h.box.max.x + 1.5, h.box.min.y, c.z));
    });
    (LAYOUT.extras || []).forEach(function (e) {
      if (e.model === 'lighthouse') ptsHome.push(V(e.x + 4.5, 0, e.z), V(e.x, (e.h || 10) + 3, e.z));
    });
    LANDS.forEach(function (l) {
      if (l.minX == null) return;
      var arr2 = /^games-/.test(l.id) ? ptsGames : ptsHome;
      arr2.push(V(l.minX + 0.8, l.h || 0.6, (l.minZ + l.maxZ) * 0.5), V(l.maxX - 0.8, l.h || 0.6, (l.minZ + l.maxZ) * 0.5));
      arr2.push(V((l.minX + l.maxX) * 0.5, l.h || 0.6, l.minZ + 0.8), V((l.minX + l.maxX) * 0.5, l.h || 0.6, l.maxZ - 0.8));
    });
    if (ptsHome.length) {
      var bbH = new T3.Box3().setFromPoints(ptsHome);
      FIT_SETS.home.look = bbH.getCenter(V()); FIT_SETS.home.look.y = 0; FIT_SETS.home.pts = ptsHome; FIT_SETS.home.key = '';
    }
    if (ptsGames.length) {
      var bbG = new T3.Box3().setFromPoints(ptsGames);
      FIT_SETS.games.look = bbG.getCenter(V()); FIT_SETS.games.look.y = 0.5; FIT_SETS.games.pts = ptsGames; FIT_SETS.games.key = '';
    }
    var ptsBoth = ptsHome.concat(ptsGames);
    if (ptsBoth.length) {
      var bbB = new T3.Box3().setFromPoints(ptsBoth);
      FIT_SETS.both.look = bbB.getCenter(V()); FIT_SETS.both.look.y = 0; FIT_SETS.both.pts = ptsBoth; FIT_SETS.both.key = '';
    }
    FIT = FIT_SETS[activeIsland] || FIT_SETS.both;
    liveIslandLook.copy(FIT.look);
  }
  function switchIsland(zone, instant) {
    var next = (zone === 'games' || zone === 'home') ? zone : 'both';
    var changed = activeIsland !== next;
    activeIsland = next;
    FIT = FIT_SETS[activeIsland] || FIT_SETS.both;
    FIT.key = '';
    flying = false;
    view.yaw = 0; view.pitch = .50; view.zoom = 1; view.panX = 0; view.panZ = 0;
    if (zoomBadge) zoomBadge.textContent = '100%';
    var halfS = next === 'both' ? 78 : 52;
    if (sun && sun.shadow && sun.shadow.camera) {
      var sc2 = sun.shadow.camera;
      sc2.left = -halfS; sc2.right = halfS; sc2.top = halfS * 0.78; sc2.bottom = -halfS * 0.78;
      sc2.updateProjectionMatrix();
    }
    if (instant) {
      liveIslandLook.copy(FIT.look);
      islandGlideArc = 0;
    } else if (changed) {
      K.sfx('whoosh');
      islandGlideArc = 0.65;
    }
    try {
      var u = new URL(location.href);
      if (next === 'games' || next === 'home') u.searchParams.set('island', next);
      else u.searchParams.delete('island');
      u.searchParams.delete('returned');
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) {}
    renderQuickBar();
    home();
    if (instant) {
      if (K.cam.follow) K.cam.follow(0.016);
      K.cam.snap();
    }
  }
  var tmpCam = new T3.PerspectiveCamera();
  function camPos(d, yaw, pitch, look) {
    var pt = pitch != null ? pitch : PITCH;
    var lk = look || FIT.look;
    return V(lk.x + Math.sin(yaw) * Math.cos(pt) * d, lk.y + Math.sin(pt) * d, lk.z + Math.cos(yaw) * Math.cos(pt) * d);
  }
  function fits(d, yaw) {
    tmpCam.copy(K.camera); tmpCam.position.copy(camPos(d, yaw, PITCH, FIT.look)); tmpCam.lookAt(FIT.look); tmpCam.updateMatrixWorld(true); tmpCam.updateProjectionMatrix();
    return FIT.pts.every(function (p) { var v = p.clone().project(tmpCam); return v.x > SAFE.x0 && v.x < SAFE.x1 && v.y > SAFE.y0 && v.y < SAFE.y1 && v.z < 1; });
  }
  function updatePortraitFov() {
    var asp = K.camera.aspect || 1.6;
    // Landscape/desktop stays exact 30°; portrait phones & tablets gently widen FOV so the active island stays close, vibrant & uncropped!
    var wantFov = asp < 1.15 ? clamp(30 + (1.15 - asp) * 32, 30, 52) : 30;
    if (Math.abs(K.camera.fov - wantFov) > 0.05) {
      K.camera.fov = wantFov;
      K.camera.updateProjectionMatrix();
      FIT.key = '';
    }
  }
  function fitDistance(yaw) {
    updatePortraitFov();
    var key = activeIsland + '/' + K.camera.aspect.toFixed(3) + '/' + K.camera.fov.toFixed(1) + '/' + yaw.toFixed(2);
    if (key === FIT.key) return FIT.d;
    var lo = 20, hi = 420; for (var i = 0; i < 22; i++) { var mid = (lo + hi) / 2; if (fits(mid, yaw)) hi = mid; else lo = mid; }
    FIT.key = key; FIT.d = hi; return hi;
  }
  var curLook = V();
  function home() {
    K.cam.k = 4.2; K.cam.drift = false; K.cam.noPortraitPull = true;
    K.cam.follow = function (dt) {
      if (presetAnim) {
        presetAnim.t += Math.min(dt || 0.016, 0.05);
        var u = clamp(presetAnim.t / presetAnim.dur, 0, 1);
        var e = 1 - Math.pow(1 - u, 3); // smooth 0.4s cubic ease-out!
        view.yaw = K.lerp(presetAnim.from.yaw, presetAnim.to.yaw, e);
        view.pitch = K.lerp(presetAnim.from.pitch, presetAnim.to.pitch, e);
        view.zoom = K.lerp(presetAnim.from.zoom, presetAnim.to.zoom, e);
        view.panX = K.lerp(presetAnim.from.panX, presetAnim.to.panX, e);
        view.panZ = K.lerp(presetAnim.from.panZ, presetAnim.to.panZ, e);
        liveIslandLook.set(
          K.lerp(presetAnim.from.lx, presetAnim.to.lx, e),
          K.lerp(presetAnim.from.ly, presetAnim.to.ly, e),
          K.lerp(presetAnim.from.lz, presetAnim.to.lz, e)
        );
        K.cam.k = 14.0;
        if (u >= 1) presetAnim = null;
      } else {
        K.cam.k = 4.6;
        liveIslandLook.lerp(FIT.look, 0.14);
      }
      parallax.x += (parallax.tx - parallax.x) * 0.045;
      parallax.y += (parallax.ty - parallax.y) * 0.045;
      islandGlideArc *= 0.90;
      var pAmt = (focusModeOn || cameraLocked) ? 0 : (view.zoom > .65 ? 1 : 0.25);
      var yaw = view.yaw + parallax.x * 0.055 * pAmt;
      var pit = clamp(view.pitch + parallax.y * 0.032 * pAmt + islandGlideArc * 0.10, .24, 1.18);
      var isPortrait = (K.camera.aspect || 1.6) < 0.85;
      var baseD = fitDistance(Math.round(clamp(view.yaw, -.6, .6) * 20) / 20) * (isPortrait ? 0.76 : 1.03);
      var maxD = Math.max(240, baseD * 1.25);
      var d = clamp(baseD * view.zoom * (1 + islandGlideArc * 0.14), 11, maxD);
      if (scene.fog) {
        scene.fog.near = Math.max(210, d * 1.25);
        scene.fog.far = Math.max(420, d * 2.35);
      }
      var a = yaw + (view.zoom > .85 && !focusModeOn ? Math.sin(K.now * .06) * .014 : 0);
      curLook.set(liveIslandLook.x + view.panX, liveIslandLook.y + (view.zoom < .4 ? 1.4 : 0), liveIslandLook.z + view.panZ);
      sun.target.position.set(curLook.x, 0, curLook.z);
      sun.position.set(curLook.x - 44, 52, curLook.z + 38);
      K.cam.tPos.copy(camPos(d, a, pit, curLook));
      K.cam.tLook.copy(curLook);
    };
  }
  /* ---------------- HUD + Live 3D Games XP Drain & Bridge Sync ---------------- */
  var goal = { got: 165, target: 300, demo: true };
  function drainGamesInboxToStore() {
    // Route 3D game inbox rewards strictly through window.parent.schoolStore.giveXP() — NEVER write localStorage['eaa_master_school_v6'] directly!
    try {
      var unlocked = sessionStorage.getItem('eaa_auth_unlocked') === 'true';
      if (!unlocked) return 0;
      var pStore = (window.parent && window.parent !== window && window.parent.schoolStore) ? window.parent.schoolStore : null;
      if (!pStore || typeof pStore.giveXP !== 'function' || !pStore.state || !Array.isArray(pStore.state.students)) return 0;
      var inbox = JSON.parse(localStorage.getItem('eaa_games_points_inbox') || '[]') || [];
      if (!Array.isArray(inbox) || !inbox.length) return 0;
      var doneList = JSON.parse(localStorage.getItem('eaa_games_points_done_v1') || '[]') || [];
      var doneMap = {}; doneList.forEach(function (id) { doneMap[id] = 1; });
      var stuMap = {}; pStore.state.students.forEach(function (s) { if (s && s.id) stuMap[s.id] = s; });
      var remaining = [], addedXp = 0;
      inbox.forEach(function (entry) {
        if (!entry || !entry.id || !entry.studentId || entry.done || doneMap[entry.id]) return;
        var stu = stuMap[entry.studentId];
        if (!stu) { remaining.push(entry); return; }
        var amt = Math.max(1, Math.min(200, Math.round(Number(entry.amount) || 0)));
        pStore.giveXP(stu.id, amt, entry.reason || '3D Game Reward', 'Home Island');
        doneMap[entry.id] = 1;
        doneList.push(entry.id);
        addedXp += amt;
      });
      if (addedXp > 0) {
        if (doneList.length > 400) doneList = doneList.slice(doneList.length - 400);
        localStorage.setItem('eaa_games_points_done_v1', JSON.stringify(doneList));
        localStorage.setItem('eaa_games_points_inbox', JSON.stringify(remaining));
      }
      return addedXp;
    } catch (e) { return 0; }
  }
  function readTodayBridgeBonus() {
    try {
      var bData = JSON.parse(localStorage.getItem('eaa_home3d_bridge_xp_v1') || '{}') || {};
      var today = new Date().toISOString().slice(0, 10);
      return bData.day === today ? (Number(bData.bonus) || 0) : 0;
    } catch (e) { return 0; }
  }
  function isGameBeatenThisWeek(gameId) {
    try {
      var trophies = JSON.parse(localStorage.getItem('eaa_3d_trophies_v1') || '{}') || {};
      var ctx = resolveActiveClassAndSet();
      var scope = trophies[ctx.clsId || 'default'] || trophies.default || {};
      var rec = scope[gameId];
      return !!(rec && rec.ts && (Date.now() - Number(rec.ts) < 7 * 86400000));
    } catch (e) { return false; }
  }
  function readGoal() {
    drainGamesInboxToStore();
    var demoBonus = readTodayBridgeBonus();
    goal = { got: Math.min(300, 165 + demoBonus), target: 300, demo: true };
    try {
      var unlocked = sessionStorage.getItem('eaa_auth_unlocked') === 'true';
      var st = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null');
      if (!unlocked || !st || !Array.isArray(st.classes) || !st.classes.length) return goal;
      var prefs = {}; try { prefs = JSON.parse(localStorage.getItem('eaa_games_prefs') || '{}') || {}; } catch (e) {}
      var list = st.classes.filter(function (c) { return c && !c.archived && !/sync/i.test(c.id) && c.grade !== 'System'; });
      var cls = list.filter(function (c) { return c.id === prefs.classId; })[0] || list[0]; if (!cls) return goal;
      var g = null; try { g = JSON.parse(localStorage.getItem('eaa_board_goal_' + cls.id) || 'null'); } catch (e) {}
      g = g && g.target ? g : { target: 300, daily: true };
      var ids = {}; (st.students || []).forEach(function (s) { if (s && s.classId === cls.id) ids[s.id] = 1; });
      var from = Math.max(g.daily !== false ? new Date().setHours(0, 0, 0, 0) : (g.since || 0), Number(g.resetAt) || 0), sum = 0;
      (st.xpTransactions || []).forEach(function (t) { if (ids[t.studentId] && t.status !== 'voided' && t.status !== 'reverted') { var ts = new Date(t.timestamp).getTime(), a = Number(t.amount) || 0; if (ts >= from && a > 0) sum += a; } });
      goal = { got: sum, target: g.target, cls: cls.name || cls.id, demo: false };
    } catch (e) { /* demo */ }
    return goal;
  }
  var goalEl = null, goalPctLive = 0.55, balloonBonusLive = 0;
  function updateGoalUI(animate) {
    readGoal();
    var effGot = Math.min(goal.target || 300, (goal.got || 0) + balloonBonusLive);
    var pct = clamp(goal.target ? effGot / goal.target : 0, 0, 1);
    goalPctLive = pct;
    if (goalEl) {
      goalEl.innerHTML = '<span>🎈 ' + (goal.demo ? 'Class goal' : 'Today’s goal') + '</span><div class="bar"><i style="width:' + Math.round(pct * 100) + '%"></i></div><b>' + effGot + ' / ' + goal.target + '</b>';
    }
    buildBridge(pct, !!animate);
  }
  function addBalloonLift(pts) {
    var addPts = Math.max(0, Number(pts) || 0);
    if (!addPts) return;
    balloonBonusLive += addPts;
    updateGoalUI(true);
    var exMap = window.__home3dQuietHost && window.__home3dQuietHost.extrasByModel;
    var bal = exMap && exMap['hot-air-balloon'];
    if (bal && bal.group && K.fx && K.fx.confetti) {
      K.fx.confetti(bal.group.position.clone().add(V(0, 2.5, 0)), 32);
    }
  }
  var zoomBadge = null;
  function renderQuickBar() {
    if (islSwitchEl) {
      islSwitchEl.innerHTML = activeIsland === 'games'
        ? '🗺️ <span>Both Islands</span>'
        : '🕹️ <span>Zoom Games Island</span>';
      islSwitchEl.className = 'h3-isl-switch ' + (activeIsland === 'games' ? 'to-home' : 'to-games');
    }
    if (!quickEl) return;
    quickEl.innerHTML = '';
    var items = activeIsland === 'games'
      ? [
          ['🗺️', 'Both Islands', '_both', '#2fc58a'],
          ['🎯', 'Cannon', 'cannon3d', '#ff5fa2'],
          ['⚽', 'Penalty', 'penalty3d', '#2fc58a'],
          ['🎳', 'Bowling', 'bowling3d', '#9b7bff'],
          ['🏁', 'Race', 'race3d', '#4f9dff'],
          ['🪢', 'Tug', 'tug3d', '#ffb320'],
          ['💣', 'Bomb', 'bomb3d', '#ff5fa2'],
          ['🎲', 'Board', 'board3d', '#ffb320'],
          ['🐱', 'Cat vs Dog', 'fling3d', '#2fc58a'],
          ['🎮', 'All 26', 'games', '#4f9dff']
        ]
      : [
          ['🏰', 'Today', 'today', '#9b7bff'],
          ['🏛️', 'Board', 'board', '#ff5fa2'],
          ['🕹️', 'Games Island', '_games', '#ff7a3d'],
          ['🛍️', 'Shop', 'shop', '#ffb320'],
          ['📚', 'Library', 'library', '#4f9dff']
        ];
    items.forEach(function (q) {
      var won = activeIsland === 'games' && q[2].slice(-2) === '3d' && isGameBeatenThisWeek(q[2]);
      var b = K.el('button', 'h3-q', '<i>' + q[0] + (won ? '<em class="h3-q-trophy">🏆</em>' : '') + '</i><span>' + q[1] + '</span>');
      b.style.setProperty('--c', q[3]);
      b.onclick = function () {
        if (q[2] === '_games') { K.sfx('tap'); switchIsland('games', false); return; }
        if (q[2] === '_both' || q[2] === '_home') { K.sfx('tap'); switchIsland('both', false); return; }
        var p = places.filter(function (x) { return x.id === q[2]; })[0];
        if (p) go(p, activeIsland !== 'games');
      };
      quickEl.appendChild(b);
    });
  }
  function hud() {
    goalEl = K.ui.add(K.el('div', 'h3-goal'));
    goalEl.style.cursor = 'pointer';
    goalEl.title = 'View Both Islands & Treasure Goal Bridge';
    goalEl.onclick = function () { if (activeIsland !== 'both') { K.sfx('tap'); switchIsland('both', false); } };
    updateGoalUI(!!K.Q.get('returned'));
    var useLegacyBars = /[?&]legacybar=1/.test(location.search);
    if (useLegacyBars) {
      islSwitchEl = K.ui.add(K.el('button', 'h3-isl-switch'));
      islSwitchEl.onclick = function () {
        K.sfx('tap');
        switchIsland(activeIsland === 'games' ? 'both' : 'games', false);
      };
    }
    // Phase 2: Replace manual "+ 94% -" zoom pill with 5 One-Tap Smooth Camera Presets (bottom 45% child reach, >=80x80px)
    camDockEl = K.ui.add(K.el('div', 'h3-cam-dock'));
    camDockEl.setAttribute('role', 'toolbar');
    camDockEl.setAttribute('aria-label', 'Island Camera Presets');
    CAM_PRESETS.forEach(function (pr) {
      var b = K.el('button', 'h3-cam-btn' + (pr.lightTxt ? ' light-txt' : '') + (pr.id === activePresetId ? ' active' : ''));
      b.type = 'button';
      b.setAttribute('data-preset', pr.id);
      b.setAttribute('aria-pressed', pr.id === activePresetId ? 'true' : 'false');
      b.style.setProperty('--pc', pr.c);
      b.style.setProperty('--pd', pr.d);
      b.innerHTML = '<span class="h3-cam-badge" aria-hidden="true">✓</span><span class="h3-cam-ic" aria-hidden="true">' + pr.ico + '</span><span class="h3-cam-lbl">' + pr.label + '</span>';
      b.onclick = function () { flyToPreset(pr.id, false); };
      camDockEl.appendChild(b);
    });

    // Phase 2: Top-Right Accessibility & Ambient Lesson Focus Bar (Lesson Focus + Bright Classroom + Instant Mute)
    var focusBtnEl = null, hcBtnEl = null, muteBtnEl = null;
    function syncAccessButtons() {
      if (focusBtnEl) {
        focusBtnEl.classList.toggle('on', focusModeOn);
        focusBtnEl.setAttribute('aria-pressed', focusModeOn ? 'true' : 'false');
        focusBtnEl.innerHTML = focusModeOn ? '<span>✓ 🧠</span><span>Lesson Focus ON</span>' : '<span>🧠</span><span>Lesson Focus</span>';
      }
      if (hcBtnEl) {
        hcBtnEl.classList.toggle('on', highContrastOn);
        hcBtnEl.setAttribute('aria-pressed', highContrastOn ? 'true' : 'false');
        hcBtnEl.innerHTML = highContrastOn ? '<span>✓ ☀️</span><span>Bright ON</span>' : '<span>☀️</span><span>Bright Mode</span>';
      }
      if (muteBtnEl) {
        muteBtnEl.classList.toggle('muted', !!K.muted);
        muteBtnEl.setAttribute('aria-pressed', K.muted ? 'true' : 'false');
        muteBtnEl.innerHTML = K.muted ? '<span>🔇</span><span>Muted</span>' : '<span>🔊</span><span>Sound</span>';
      }
      // Keep kit3d top sound button in sync too
      var topMu = document.querySelector('.topbtns .ibtn');
      if (topMu) topMu.textContent = K.muted ? '🔇' : '🔊';
    }

    function setHighContrast(on) {
      highContrastOn = !!on;
      document.body.classList.toggle('h3-high-contrast', highContrastOn);
      playShortChime('preset');
      syncAccessButtons();
    }

    function setMuted(on) {
      K.muted = !!on;
      if (K.muted) {
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
        if (K.loopVol) { K.loopVol('music', 0); K.loopVol('crowd', 0); }
      } else {
        playShortChime('preset');
      }
      syncAccessButtons();
    }

    // Build Ambient Focus / Whiteboard Mode Shell (Slim 15% top Windmill Noise + Balloon bar + 85% interactive Whiteboard)
    var wbCanvas = null, wbCtx = null, wbStage = null;
    var wbColor = '#2b1d40', wbSize = 6, wbEraser = false, wbPaper = 'blank';
    var wbStrokes = [], wbCur = null;

    function wbRedraw() {
      if (!wbCanvas || !wbCtx) return;
      wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
      wbStrokes.forEach(function (st) {
        if (!st || !st.pts || !st.pts.length) return;
        wbCtx.save();
        wbCtx.lineCap = 'round';
        wbCtx.lineJoin = 'round';
        wbCtx.lineWidth = st.size * (wbCanvas._dpr || 1);
        if (st.eraser) {
          wbCtx.globalCompositeOperation = 'destination-out';
          wbCtx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
          wbCtx.globalCompositeOperation = 'source-over';
          wbCtx.globalAlpha = st.alpha != null ? st.alpha : 1;
          wbCtx.strokeStyle = st.color;
        }
        wbCtx.beginPath();
        wbCtx.moveTo(st.pts[0][0] * wbCanvas.width, st.pts[0][1] * wbCanvas.height);
        for (var i = 1; i < st.pts.length; i++) {
          var px = st.pts[i - 1][0] * wbCanvas.width, py = st.pts[i - 1][1] * wbCanvas.height;
          var cx = st.pts[i][0] * wbCanvas.width, cy = st.pts[i][1] * wbCanvas.height;
          wbCtx.quadraticCurveTo(px, py, (px + cx) * 0.5, (py + cy) * 0.5);
        }
        if (st.pts.length === 1) wbCtx.lineTo(st.pts[0][0] * wbCanvas.width + 0.5, st.pts[0][1] * wbCanvas.height + 0.5);
        wbCtx.stroke();
        wbCtx.restore();
      });
    }
    function wbResize() {
      if (!wbCanvas || !wbStage) return;
      var r = wbStage.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      wbCanvas._dpr = dpr;
      wbCanvas.width = Math.round(r.width * dpr);
      wbCanvas.height = Math.round(r.height * dpr);
      wbRedraw();
    }

    function ensureFocusShell() {
      if (focusShellEl) return focusShellEl;
      focusShellEl = document.createElement('div');
      focusShellEl.className = 'h3-focus-shell';
      focusShellEl.id = 'h3FocusShell';
      focusShellEl.innerHTML =
        '<div class="h3-focus-top">' +
          '<div class="h3-focus-meters">' +
            '<button type="button" class="h3-fmeter h3-fmeter-btn" id="h3FocusNoiseBox" style="--mc:#2fc58a;--md:#1b8f61" title="Tap to open Quiet Island noise controls">' +
              '<span class="h3-fmeter-ic" aria-hidden="true">🌬️</span>' +
              '<div class="h3-fmeter-col">' +
                '<div class="h3-fmeter-row"><span>Windmill Noise</span><b id="h3FocusNoiseLbl">● Calm</b></div>' +
                '<div class="h3-fmeter-bar"><i id="h3FocusNoiseBar" style="width:18%"></i></div>' +
              '</div>' +
            '</button>' +
            '<div class="h3-fmeter" style="--mc:#ff5fa2;--md:#c93776">' +
              '<span class="h3-fmeter-ic" aria-hidden="true">🎈</span>' +
              '<div class="h3-fmeter-col">' +
                '<div class="h3-fmeter-row"><span>Balloon Progress</span><b id="h3FocusGoalLbl">165 / 300</b></div>' +
                '<div class="h3-fmeter-bar"><i id="h3FocusGoalBar" style="width:55%;background:#ff5fa2"></i></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="h3-focus-actions">' +
            '<button type="button" class="h3-acc-btn hc-btn" id="h3FocusHC" title="Bright Classroom High-Contrast">☀️ Bright</button>' +
            '<button type="button" class="h3-acc-btn mute-btn" id="h3FocusMute" title="Instant Mute">🔊</button>' +
            '<button type="button" class="h3-focus-exit" id="h3FocusExit">🏝️ Back to Island</button>' +
          '</div>' +
        '</div>' +
        '<div class="h3-wb-stage" id="h3WbStage">' +
          '<canvas class="h3-wb-canvas" id="h3WbCanvas"></canvas>' +
          '<div class="h3-wb-dock" id="h3WbDock"></div>' +
        '</div>';
      document.body.appendChild(focusShellEl);

      focusNoiseBoxEl = focusShellEl.querySelector('#h3FocusNoiseBox');
      focusNoiseBarEl = focusShellEl.querySelector('#h3FocusNoiseBar');
      focusNoiseLblEl = focusShellEl.querySelector('#h3FocusNoiseLbl');
      focusGoalBarEl  = focusShellEl.querySelector('#h3FocusGoalBar');
      focusGoalLblEl  = focusShellEl.querySelector('#h3FocusGoalLbl');
      wbStage = focusShellEl.querySelector('#h3WbStage');
      wbCanvas = focusShellEl.querySelector('#h3WbCanvas');
      wbCtx = wbCanvas.getContext('2d');

      focusNoiseBoxEl.onclick = function () {
        if (window.QuietIsland && window.QuietIsland.togglePanel) window.QuietIsland.togglePanel();
      };
      focusShellEl.querySelector('#h3FocusHC').onclick = function () { setHighContrast(!highContrastOn); };
      focusShellEl.querySelector('#h3FocusMute').onclick = function () { setMuted(!K.muted); };
      focusShellEl.querySelector('#h3FocusExit').onclick = function () { setFocusMode(false); };

      // Build tactile Whiteboard Marker Toolbar
      var dock = focusShellEl.querySelector('#h3WbDock');
      var inks = [
        { c: '#2b1d40', lbl: 'Dark Ink' },
        { c: '#ff5fa2', lbl: 'Pink' },
        { c: '#4f9dff', lbl: 'Blue' },
        { c: '#ffb320', lbl: 'Yellow' },
        { c: '#2fc58a', lbl: 'Green' }
      ];
      inks.forEach(function (ink, idx) {
        var sw = K.el('button', 'h3-wb-swatch' + (idx === 0 ? ' active' : ''));
        sw.type = 'button';
        sw.title = ink.lbl;
        sw.setAttribute('aria-label', ink.lbl);
        sw.style.setProperty('--sw', ink.c);
        sw.onclick = function () {
          wbColor = ink.c; wbEraser = false;
          dock.querySelectorAll('.h3-wb-swatch').forEach(function (el) { el.classList.remove('active'); });
          sw.classList.add('active');
          var er = dock.querySelector('[data-wb="eraser"]'); if (er) er.classList.remove('active');
        };
        dock.appendChild(sw);
      });

      dock.appendChild(K.el('span', 'h3-wb-sep'));
      var sizes = [{ k: 'fine', sz: 4, lbl: '✏️ Fine', a: 1 }, { k: 'med', sz: 9, lbl: '🖊️ Bold', a: 1 }, { k: 'hi', sz: 24, lbl: '🖍️ Glow', a: 0.35 }];
      var wbAlpha = 1;
      sizes.forEach(function (sp, idx) {
        var b = K.el('button', 'h3-wb-tool' + (idx === 0 ? ' active' : ''), sp.lbl);
        b.type = 'button'; b.setAttribute('data-wbsz', sp.k);
        b.onclick = function () {
          wbSize = sp.sz; wbAlpha = sp.a; wbEraser = false;
          dock.querySelectorAll('[data-wbsz]').forEach(function (el) { el.classList.remove('active'); });
          b.classList.add('active');
          var er = dock.querySelector('[data-wb="eraser"]'); if (er) er.classList.remove('active');
        };
        dock.appendChild(b);
      });

      dock.appendChild(K.el('span', 'h3-wb-sep'));
      var erBtn = K.el('button', 'h3-wb-tool', '🧽 Erase');
      erBtn.type = 'button'; erBtn.setAttribute('data-wb', 'eraser');
      erBtn.onclick = function () {
        wbEraser = !wbEraser;
        erBtn.classList.toggle('active', wbEraser);
      };
      dock.appendChild(erBtn);

      var paperBtn = K.el('button', 'h3-wb-tool', '📄 Paper');
      paperBtn.type = 'button';
      paperBtn.onclick = function () {
        wbPaper = wbPaper === 'blank' ? 'lined' : (wbPaper === 'lined' ? 'grid' : 'blank');
        wbStage.classList.toggle('paper-lined', wbPaper === 'lined');
        wbStage.classList.toggle('paper-grid', wbPaper === 'grid');
        paperBtn.textContent = wbPaper === 'lined' ? '📝 Lined' : (wbPaper === 'grid' ? '📐 Grid' : '📄 Paper');
      };
      dock.appendChild(paperBtn);

      var undoBtn = K.el('button', 'h3-wb-tool', '↩️ Undo');
      undoBtn.type = 'button';
      undoBtn.onclick = function () { wbStrokes.pop(); wbRedraw(); };
      dock.appendChild(undoBtn);

      var clrBtn = K.el('button', 'h3-wb-tool danger', '🗑️ Clear');
      clrBtn.type = 'button';
      clrBtn.onclick = function () { wbStrokes = []; wbRedraw(); };
      dock.appendChild(clrBtn);

      // Smooth multi-touch / stylus / mouse drawing on Whiteboard Canvas
      function normPt(ev) {
        var r = wbCanvas.getBoundingClientRect();
        return [clamp((ev.clientX - r.left) / Math.max(1, r.width), 0, 1), clamp((ev.clientY - r.top) / Math.max(1, r.height), 0, 1)];
      }
      wbCanvas.addEventListener('pointerdown', function (ev) {
        if (!focusModeOn) return;
        ev.preventDefault();
        try { wbCanvas.setPointerCapture(ev.pointerId); } catch (e) {}
        wbCur = { color: wbColor, size: wbEraser ? 28 : wbSize, alpha: wbEraser ? 1 : wbAlpha, eraser: wbEraser, pts: [normPt(ev)] };
        wbStrokes.push(wbCur);
        wbRedraw();
      });
      wbCanvas.addEventListener('pointermove', function (ev) {
        if (!wbCur) return;
        ev.preventDefault();
        wbCur.pts.push(normPt(ev));
        wbRedraw();
      });
      function endStroke() { wbCur = null; }
      wbCanvas.addEventListener('pointerup', endStroke);
      wbCanvas.addEventListener('pointercancel', endStroke);
      addEventListener('resize', function () { if (focusModeOn) wbResize(); });
      return focusShellEl;
    }

    function syncFocusMeters() {
      if (!focusModeOn || !focusShellEl) return;
      var pct = Math.round(clamp(goal.target ? goal.got / goal.target : 0, 0, 1) * 100);
      if (focusGoalBarEl) focusGoalBarEl.style.width = pct + '%';
      if (focusGoalLblEl) focusGoalLblEl.textContent = Math.min(goal.got, goal.target) + ' / ' + goal.target + ' (' + pct + '%)';

      var qi = window.QuietIsland;
      var lvl = qi && typeof qi.level === 'function' ? qi.level() : 0.12;
      var st  = qi && typeof qi.state === 'function' ? qi.state() : 'calm';
      var nPct = Math.round(clamp(lvl * 100, 8, 100));
      var col = st === 'loud' ? '#ff5fa2' : (st === 'uneasy' ? '#ffb320' : '#2fc58a');
      var shape = st === 'loud' ? '▲ Loud' : (st === 'uneasy' ? '◆ Whisper' : '● Calm');
      if (focusNoiseBarEl) { focusNoiseBarEl.style.width = nPct + '%'; focusNoiseBarEl.style.background = col; }
      if (focusNoiseLblEl) focusNoiseLblEl.textContent = shape;
      if (focusNoiseBoxEl) focusNoiseBoxEl.style.setProperty('--mc', col);
    }
    K.onFrame(function () { if (focusModeOn) syncFocusMeters(); });

    function setFocusMode(on) {
      focusModeOn = !!on;
      avatarsFrozen = focusModeOn;
      ensureFocusShell();
      document.body.classList.toggle('h3-focus-mode', focusModeOn);
      playShortChime('focus');
      syncAccessButtons();
      if (focusModeOn) {
        syncFocusMeters();
        setTimeout(wbResize, 60);
      }
    }

    accessBarEl = K.ui.add(K.el('div', 'h3-access-bar'));
    focusBtnEl = K.el('button', 'h3-acc-btn focus-btn', '<span>🧠</span><span>Lesson Focus</span>');
    focusBtnEl.type = 'button';
    focusBtnEl.title = '1-Tap Lesson Focus & Interactive Whiteboard';
    focusBtnEl.onclick = function () { setFocusMode(!focusModeOn); };

    hcBtnEl = K.el('button', 'h3-acc-btn hc-btn', '<span>☀️</span><span>Bright Mode</span>');
    hcBtnEl.type = 'button';
    hcBtnEl.title = 'Bright Classroom High-Contrast Mode (7:1)';
    hcBtnEl.onclick = function () { setHighContrast(!highContrastOn); };

    muteBtnEl = K.el('button', 'h3-acc-btn mute-btn', '<span>🔊</span><span>Sound</span>');
    muteBtnEl.type = 'button';
    muteBtnEl.title = 'Instant Classroom Mute';
    muteBtnEl.onclick = function () { setMuted(!K.muted); };

    accessBarEl.appendChild(focusBtnEl);
    accessBarEl.appendChild(hcBtnEl);
    accessBarEl.appendChild(muteBtnEl);
    syncAccessButtons();

    // Expose Phase 2 UI controllers for boot export
    hud._setFocusMode = setFocusMode;
    hud._setHighContrast = setHighContrast;
    hud._setMuted = setMuted;

    if (useLegacyBars) {
      quickEl = K.el('div', 'h3-quick');
      K.ui.add(quickEl);
      renderQuickBar();
    }
    var tb = document.querySelector('.topbtns');
    if (tb) {
      Array.prototype.slice.call(tb.querySelectorAll('.k3-gm-topbtn')).forEach(function (b) { b.remove(); });
      var btns = tb.querySelectorAll('button');
      if (btns[0]) {
        btns[0].onclick = function () { setMuted(!K.muted); };
      }
      if (btns[1]) {
        var fsDoc = document;
        try { if (window.top && window.top.document) fsDoc = window.top.document; } catch (e) { fsDoc = document; }
        var fsEl = fsDoc.documentElement;
        if (!(fsEl && (fsEl.requestFullscreen || fsEl.webkitRequestFullscreen))) {
          btns[1].style.display = 'none';
        }
        btns[1].onclick = function () {
          try {
            var isFs = !!(fsDoc.fullscreenElement || fsDoc.webkitFullscreenElement);
            if (!isFs) {
              var req = fsEl.requestFullscreen || fsEl.webkitRequestFullscreen;
              if (req) { var p = req.call(fsEl); if (p && p.catch) p.catch(function () {}); }
            } else {
              var ex = fsDoc.exitFullscreen || fsDoc.webkitExitFullscreen;
              if (ex) { var p2 = ex.call(fsDoc); if (p2 && p2.catch) p2.catch(function () {}); }
            }
          } catch (e) {}
        };
      }
      if (btns[2]) {
        // Teacher-Only 2-Second Long-Press Lock to prevent accidental child taps on Smartboards!
        btns[2].textContent = '⚙️';
        btns[2].classList.add('h3-hold-lock');
        btns[2].title = 'Hold 2s for Teacher Hub & Settings';
        var holdRing = document.createElement('span');
        holdRing.className = 'h3-hold-ring';
        btns[2].appendChild(holdRing);
        var holdTimer = null, holdFired = false;
        function openTeacherMore() {
          try {
            if (window.parent && window.parent !== window && typeof window.parent.switchView === 'function') {
              window.parent.switchView('more');
              return;
            }
          } catch (e) {}
          location.href = ROOT + 'index.html#more';
        }
        function cancelHold() {
          if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
          btns[2].classList.remove('holding');
        }
        btns[2].onclick = function (e) {
          e.preventDefault();
          if (holdFired) { holdFired = false; return; }
          K.ui.toast('🔒 Hold ⚙️ for 2 seconds to open Teacher Hub', 1.8, '#ffb320');
        };
        btns[2].addEventListener('pointerdown', function () {
          holdFired = false;
          btns[2].classList.add('holding');
          holdTimer = setTimeout(function () {
            holdTimer = null;
            holdFired = true;
            btns[2].classList.remove('holding');
            playShortChime('preset');
            openTeacherMore();
          }, 2000);
        });
        btns[2].addEventListener('pointerup', cancelHold);
        btns[2].addEventListener('pointerleave', cancelHold);
        btns[2].addEventListener('pointercancel', cancelHold);
      }
    }
  }

  /* ---------------- boot ---------------- */
  var LAYOUT = null, MODELS = {};
  var loading = K.ui.add(K.el('div', 'loading', '<span>Sailing to Adventure Island…</span>'));
  function glb(path, h, opts) { return K.tryGLB(ROOT + 'assets/3d/' + path).then(function (g) { return g ? K.fitModel(g.scene, h, opts) : null; }); }
  function gameGlb(relPath, h, opts) { return K.tryGLB(ROOT + relPath).then(function (g) { return g ? K.fitModel(g.scene, h, opts) : null; }); }
  function localGlb(relPath, h, opts) { return K.tryGLB(relPath).then(function (g) { return g ? K.fitModel(g.scene, h, opts) : null; }); }
  function getJSON(url) { return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  var shapeParam = K.Q.get('shape') || '1';
  var layoutUrl = (shapeParam === '2' || shapeParam === '3')
    ? ('layout-shape' + shapeParam + '.json?v=20261123a')
    : 'layout-shape1.json?v=20261123a';
  var layoutFetchP = getJSON(layoutUrl).then(function (d) {
    return d || getJSON('layout.json?v=20261123a');
  });
  Promise.all([layoutFetchP, getJSON(ROOT + 'assets/3d/home/models.json')]).then(function (cfg) {
    LAYOUT = cfg[0]; if (!LAYOUT) throw new Error('layout.json is missing');
    MODELS = Array.isArray(cfg[1]) ? cfg[1].reduce(function (o, n) { o[n] = {}; return o; }, {}) : (cfg[1] || {});
    function real(name) { return MODELS[name] ? K.tryGLB(ROOT + 'assets/3d/home/' + name + '.glb') : Promise.resolve(null); }
    var PROP = { fountain: ['world/fountain.glb', 2.6], bench: ['world/bench.glb', 1], carrots: ['world/props/FarmCrate_Carrot.glb', .9], apples: ['world/props/Barrel_Apples.glb', 1.2], crate: ['world/props/Crate_Wooden.glb', 1], barrel: ['world/pirate/Prop_Barrel.glb', 1.1] };
    var propKinds = Object.keys(PROP);
    var extraNames = (LAYOUT.extras || []).map(function (e) { return e.model; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
    LAYOUT._extraNames = extraNames;
    var arcadeAssetsP = Promise.all([
      glb('items/cannon-base.glb', 1.55, { byLength: true }),
      glb('items/cannon-barrel.glb', 1.85, { byLength: true }),
      glb('world/pirate/Prop_Chest_Gold.glb', 1.05),
      glb('items/target.glb', 1.35),
      gameGlb('games/penalty3d/models/goal-board.glb', 3.4, { byLength: true }),
      gameGlb('assets/3d/items/soccer-ball.glb', 0.52),
      gameGlb('games/race3d/models/race-start-gate.glb', 3.6, { byLength: true }),
      gameGlb('games/tug3d/models/games-arch.glb', 3.5, { byLength: true }),
      gameGlb('games/bowling3d/models/bowling-alley.glb', 3.8, { byLength: true }),
      gameGlb('games/bomb3d/models/box-gold.glb', 1.25),
      gameGlb('assets/3d/items/gift-box.glb', 1.10),
      gameGlb('assets/3d/items/cartoon-bomb.glb', 1.02),
      gameGlb('games/board3d/models/giant-dice.glb', 1.45),
      gameGlb('games/board3d/models/chest-open.glb', 1.15)
    ]);
    var toolAssetsP = Promise.all([
      localGlb('tools/models/ufo.glb', 3.4, { byLength: true }),
      localGlb('tools/models/sun-timer.glb', 2.4),
      glb('items/acc-microphone.glb', 1.5),
      localGlb('tools/models/team-banner.glb', 2.8),
      localGlb('tools/models/prize-wheel.glb', 2.7),
      localGlb('tools/models/toy-dice.glb', 1.05),
      localGlb('tools/models/box-gold.glb', 1.65),
      localGlb('tools/models/ice-crystal.glb', 2.5),
      localGlb('tools/models/birthday-cake.glb', 1.35),
      localGlb('tools/models/balloon-bunch.glb', 2.4),
      localGlb('tools/models/star-trophy.glb', 1.45),
      glb('home/ticket-booth.glb', 2.95)
    ]);
    return Promise.all([
      Promise.all(LAYOUT.places.map(function (p) { return real(p.model); })),
      Promise.all(LAYOUT.homes.map(function (h) { return real(h.model); })),
      Promise.all(propKinds.map(function (k) { return glb(PROP[k][0], PROP[k][1]); })),
      Promise.all([glb('world/nature/Flower_3_Group.glb', 1.6), glb('world/nature/Flower_4_Group.glb', 1.7), glb('world/nature/Bush_Common_Flowers.glb', 1.7)]),
      Promise.all([glb('world/pirate/Environment_PalmTree_1.glb', 6), glb('world/pirate/Environment_PalmTree_3.glb', 5.2), glb('world/pirate/Prop_Chest_Gold.glb', 2.2),
        real('ship').then(function (g) { return g ? K.fitModel(g.scene, 10, { byLength: true }) : glb('world/pirate/Ship_Small.glb', 10, { byLength: true }); }), glb('world/pirate/Environment_Dock.glb', 3, { byLength: true })]),
      Promise.all(K.TEAMS.map(function (t) { return K.makeCharacter(t, { monHeight: 5.2 }); })),
      Promise.all([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3].map(function (i) { return K.makeCharacter(K.TEAMS[i], { kidsOnly: true, kidHeight: 2.7 }).catch(function () { return null; }); })),
      propKinds,
      Promise.all(extraNames.map(function (n) { return K.tryGLB(ROOT + 'assets/3d/home/' + n + '.glb').then(function (g) { return g ? g.scene : null; }); })),
      K.loadAnimClips ? Promise.all([
        K.loadAnimClips(ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; }),
        K.loadAnimClips(ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; })
      ]).then(function (arr) { return (arr[0] || []).concat(arr[1] || []); }) : Promise.resolve([]),
      arcadeAssetsP,
      toolAssetsP
    ]);
  }).then(function (r) {
    var placeModels = r[0], homeModels = r[1], props = {}, flowers = r[3].filter(Boolean), sea = r[4], mons = r[5], kids = r[6], animClips = r[9] || [], arcM = r[10] || [], toolM = r[11] || [];
    r[7].forEach(function (k, i) { props[k] = r[2][i]; });
    function put(o, x, y, z, ry) { if (!o) return null; var c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry || 0; scene.add(c); return c; }

    function buildArcadeDiorama(ag) {
      var gy = groundAt(ag.x, ag.z); if (gy === null) gy = 0.6;
      var g = new T3.Group();
      g.position.set(ag.x, gy, ag.z);
      g.rotation.y = ag.ry || 0;
      function cloneInto(proto, x, y, z, ry, sc) {
        if (!proto) return null;
        var c = proto.clone(true);
        if (sc) c.scale.multiplyScalar(sc);
        c.position.set(x || 0, y || 0, z || 0);
        if (ry) c.rotation.y = ry;
        c.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        g.add(c);
        return c;
      }
      if (ag.id === 'cannon3d') {
        add(new T3.Mesh(new T3.CylinderGeometry(2.1, 2.35, 0.34, 16), mat(0xd5cab8)), 0, 0.17, 0, g);
        var cBase = cloneInto(arcM[0], 0, 0.34, 0.05, 0);
        var brl = cloneInto(arcM[1], 0, 0.98, 0.18, 0);
        if (brl) brl.rotation.x = -0.24;
        if (!cBase && !brl) {
          add(new T3.Mesh(new T3.BoxGeometry(1.1, 0.55, 1.5), mat(0x9a5b2c)), 0, 0.62, 0, g);
          var fbBrl = add(new T3.Mesh(new T3.CylinderGeometry(0.28, 0.38, 1.8, 14), mat(0x3a3d45)), 0, 1.05, 0.25, g);
          fbBrl.rotation.x = Math.PI / 2 - 0.28;
        }
        cloneInto(arcM[2], -1.18, 0.34, -0.45, 0.4);
        cloneInto(arcM[3], 1.22, 0.34, -0.35, -0.3);
      } else if (ag.id === 'penalty3d') {
        add(new T3.Mesh(new T3.BoxGeometry(4.2, 0.14, 3.2), mat(0x52b858)), 0, 0.07, 0, g);
        add(new T3.Mesh(new T3.BoxGeometry(3.8, 0.16, 2.8), mat(0x63c969)), 0, 0.075, 0, g);
        cloneInto(arcM[4], 0, 0.15, -0.75, 0);
        var sBall = cloneInto(arcM[5], 0, 0.42, 0.85, 0) || add(new T3.Mesh(new T3.SphereGeometry(0.28, 14, 10), mat(0xffffff)), 0, 0.42, 0.85, g);
        K.onFrame(function (dt, t) { sBall.position.y = 0.40 + Math.abs(Math.sin(t * 2.6)) * 0.45; });
      } else if (ag.id === 'race3d') {
        add(new T3.Mesh(new T3.BoxGeometry(4.2, 0.14, 3.4), mat(0xd96b4c)), 0, 0.07, 0, g);
        [-1.05, 0, 1.05].forEach(function (lx) { add(new T3.Mesh(new T3.BoxGeometry(0.08, 0.16, 3.2), mat(0xffffff)), lx, 0.08, 0, g); });
        cloneInto(arcM[6], 0, 0.14, -0.2, 0);
      } else if (ag.id === 'tug3d') {
        add(new T3.Mesh(new T3.CylinderGeometry(2.15, 2.25, 0.16, 20), mat(0xe8d5a8)), 0, 0.08, 0, g);
        cloneInto(arcM[7], 0, 0.15, -0.35, 0);
        var rope = new T3.Mesh(new T3.CylinderGeometry(0.09, 0.09, 3.8, 8), mat(0xc99352));
        rope.rotation.z = Math.PI / 2;
        add(rope, 0, 0.68, 0.45, g);
        var rib = add(new T3.Mesh(new T3.ConeGeometry(0.22, 0.48, 6), mat(0xff5fa2)), 0, 0.52, 0.45, g);
        rib.rotation.x = Math.PI;
      } else if (ag.id === 'bowling3d') {
        add(new T3.Mesh(new T3.BoxGeometry(2.4, 0.18, 4.3), mat(0xe3aa68)), 0, 0.09, 0, g);
        cloneInto(arcM[8], 0, 0.16, 0, 0);
      } else if (ag.id === 'bomb3d') {
        add(new T3.Mesh(new T3.CylinderGeometry(2.05, 2.25, 0.34, 18), mat(0xffe7b8)), 0, 0.17, 0, g);
        add(new T3.Mesh(new T3.CylinderGeometry(1.75, 1.85, 0.12, 18), mat(0xff5fa2)), 0, 0.36, 0, g);
        cloneInto(arcM[9], 0, 0.42, -0.25, 0.15);
        cloneInto(arcM[10], -0.95, 0.42, 0.45, 0.35);
        var bmb = cloneInto(arcM[11], 0.95, 0.42, 0.45, -0.35);
        if (bmb) K.onFrame(function (dt, t) { bmb.scale.setScalar(1 + Math.sin(t * 4.5) * 0.05); });
      } else if (ag.id === 'board3d') {
        add(new T3.Mesh(new T3.CylinderGeometry(2.15, 2.3, 0.22, 20), mat(0xfdf4dc)), 0, 0.11, 0, g);
        var tCols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a];
        for (var ti = 0; ti < 8; ti++) {
          var ang = (ti / 8) * Math.PI * 2;
          add(new T3.Mesh(new T3.BoxGeometry(0.62, 0.14, 0.62), mat(tCols[ti % 4])), Math.cos(ang) * 1.42, 0.26, Math.sin(ang) * 1.42, g);
        }
        cloneInto(arcM[13], -0.55, 0.22, -0.25, 0.3);
        var dice = cloneInto(arcM[12], 0.48, 1.15, 0.22, 0.4);
        if (dice) K.onFrame(function (dt, t) { dice.position.y = 1.15 + Math.sin(t * 2.2) * 0.18; dice.rotation.y += dt * 0.85; dice.rotation.x = Math.sin(t * 1.4) * 0.25; });
      } else if (ag.id === 'fling3d') {
        add(new T3.Mesh(new T3.BoxGeometry(3.8, 0.16, 2.8), mat(0x6eb84c)), 0, 0.08, 0, g);
        for (var fi = -4; fi <= 4; fi++) {
          add(new T3.Mesh(new T3.BoxGeometry(0.12, 1.15, 0.26), mat(fi % 2 === 0 ? 0xd99b52 : 0xc68642)), 0, 0.68, fi * 0.28, g);
        }
        add(new T3.Mesh(new T3.SphereGeometry(0.42, 14, 12), mat(0xff8c2b)), -1.15, 0.56, 0, g);
        add(new T3.Mesh(new T3.SphereGeometry(0.42, 14, 12), mat(0xd99b52)),  1.15, 0.56, 0, g);
        var yarn = add(new T3.Mesh(new T3.SphereGeometry(0.28, 14, 12), mat(0xff5fa2)), 0, 1.65, 0, g);
        K.onFrame(function (dt, t) {
          var u = (Math.sin(t * 2.1) + 1) * 0.5;
          yarn.position.x = -1.05 + u * 2.1;
          yarn.position.y = 0.85 + Math.sin(u * Math.PI) * 1.15;
        });
      }
      g.scale.setScalar(1.08);
      scene.add(g);
      return g;
    }

    function buildGamesSeaBridge() {
      var list = LAYOUT.bridges || (LAYOUT.gamesBridge ? [LAYOUT.gamesBridge] : []);
      if (!list.length) return;
      var woodM = mat(0xb86f36, { roughness: .84 }), railM = mat(0x7e461d, { roughness: .88 });
      var flagCols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a];
      list.forEach(function (gb) {
        if (!gb || !gb.from || !gb.to) return;
        var a = V(gb.from[0], 0.56, gb.from[1]), b = V(gb.to[0], 0.56, gb.to[1]);
        var d = b.clone().sub(a), len = d.length() || 1, yaw = Math.atan2(d.x, d.z);
        var sideV = V(-d.z / len, 0, d.x / len);
        var nP = Math.max(7, Math.round(len * 0.95));
        var grp = new T3.Group();
        for (var i = 0; i < nP; i++) {
          var u = (i + 0.5) / nP;
          var p = a.clone().lerp(b, u);
          var y = 0.54 + Math.sin(u * Math.PI) * 0.62;
          var plank = new T3.Mesh(new T3.BoxGeometry(2.9, 0.20, (len / nP) * 0.88), woodM);
          plank.position.set(p.x, y, p.z); plank.rotation.y = yaw;
          plank.castShadow = true; plank.receiveShadow = true; grp.add(plank);
          if (i === 1 || i === Math.floor(nP / 2) || i === nP - 2) {
            var legH = y + 2.3;
            [-1, 1].forEach(function (sd, si) {
              var sx = p.x + sideV.x * 1.28 * sd, sz = p.z + sideV.z * 1.28 * sd;
              var leg = new T3.Mesh(new T3.CylinderGeometry(0.14, 0.17, legH + 0.75, 8), railM);
              leg.position.set(sx, y + 0.36 - (legH + 0.75) * 0.5, sz); leg.castShadow = true; grp.add(leg);
              if (si === 0) {
                var fl = flag(flagCols[i % 4], sx, y + 0.55, sz, grp);
                fl.scale.setScalar(0.5);
              }
            });
          }
        }
        scene.add(grp);
      });
    }

    function buildTool3DProp(tp) {
      var gy = tp.y != null ? tp.y : groundAt(tp.x, tp.z);
      if (gy === null) gy = 0.6;
      var g = new T3.Group();
      g.position.set(tp.x, gy, tp.z);
      g.rotation.y = tp.ry || 0;
      function putT(proto, x, y, z, ry, sc) {
        if (!proto) return null;
        var c = proto.clone(true);
        if (sc) c.scale.multiplyScalar(sc);
        c.position.set(x || 0, y || 0, z || 0);
        if (ry) c.rotation.y = ry;
        c.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        g.add(c);
        return c;
      }
      if (tp.tool === 'ufo') {
        var ufoM = putT(toolM[0], 0, 0, 0, 0, 1.15) || add(new T3.Mesh(new T3.SphereGeometry(1.5, 18, 12).scale(1.35, 0.45, 1.35), mat(0x9b7bff)), 0, 0, 0, g);
        var beam = new T3.Mesh(new T3.ConeGeometry(1.35, 2.8, 16, 1, true), new T3.MeshBasicMaterial({ color: 0x9ce8ff, transparent: true, opacity: 0.28, side: T3.DoubleSide, depthWrite: false }));
        beam.position.y = -1.6; g.add(beam);
        K.onFrame(function (dt, t) { ufoM.rotation.y += dt * 0.9; ufoM.position.y = Math.sin(t * 2.1) * 0.28; });
      } else if (tp.tool === 'timer') {
        // Architectural Castle Sun-Clock Tower (stone plinth + cream timber tower + terracotta roof + golden sun clock)
        add(new T3.Mesh(new T3.BoxGeometry(2.3, 0.36, 2.3), mat(0xd8d0c2)), 0, 0.18, 0, g);
        add(new T3.Mesh(new T3.BoxGeometry(1.75, 2.25, 1.75), mat(0xfff5e0)), 0, 1.48, 0, g);
        add(new T3.Mesh(new T3.BoxGeometry(0.62, 0.95, 1.82), mat(0x6e472b)), 0, 0.82, 0, g);
        var cRoof = add(new T3.Mesh(new T3.ConeGeometry(1.48, 1.05, 4), mat(0xe86b48)), 0, 3.12, 0, g);
        cRoof.rotation.y = Math.PI * 0.25;
        var sunT = putT(toolM[1], 0, 1.85, 0.55, 0, 0.85) || add(new T3.Mesh(new T3.SphereGeometry(0.75, 16, 14), mat(0xffb320)), 0, 2.15, 0.65, g);
        K.onFrame(function (dt, t) { sunT.rotation.z = Math.sin(t * 1.1) * 0.18; });
      } else if (tp.tool === 'bell') {
        // Town Square Bell Gazebo Pavilion (stepped cobblestone base + 4 timber columns + sky-blue roof + swinging bell & mic)
        add(new T3.Mesh(new T3.CylinderGeometry(1.75, 1.95, 0.32, 18), mat(0xe7dfd1)), 0, 0.16, 0, g);
        [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]].forEach(function (xz) {
          add(new T3.Mesh(new T3.CylinderGeometry(0.12, 0.14, 2.45, 8), mat(0x8a5a3c)), xz[0], 1.52, xz[1], g);
        });
        var gRoof = add(new T3.Mesh(new T3.ConeGeometry(2.05, 1.15, 4), mat(0x4f9dff)), 0, 3.30, 0, g);
        gRoof.rotation.y = Math.PI * 0.25;
        var bell = new T3.Mesh(new T3.ConeGeometry(0.56, 0.88, 16), mat(0xffb320, { roughness: 0.32 }));
        bell.position.set(-0.22, 2.25, 0); g.add(bell);
        putT(toolM[2], 0.52, 0.32, 0.35, -0.25, 1.05);
        K.onFrame(function (dt, t) { bell.rotation.z = Math.sin(t * 2.6) * 0.18; });
      } else if (tp.tool === 'groups') {
        // Colosseum Twin Banner Entrance Archway (fluted stone pillars + golden lintel + fluttering team banners)
        add(new T3.Mesh(new T3.BoxGeometry(3.4, 0.28, 1.5), mat(0xe2dacf)), 0, 0.14, 0, g);
        [-1.22, 1.22].forEach(function (px) {
          add(new T3.Mesh(new T3.CylinderGeometry(0.24, 0.28, 2.75, 12), mat(0xf4efe6)), px, 1.65, 0, g);
        });
        add(new T3.Mesh(new T3.BoxGeometry(3.15, 0.42, 0.62), mat(0xffb320)), 0, 3.12, 0, g);
        putT(toolM[3], -0.78, 0.28, 0.25, 0.18, 1.02);
        putT(toolM[3], 0.78, 0.28, 0.25, -0.18, 1.02);
      } else if (tp.tool === 'dice') {
        // Carnival Spinner Boardwalk Deck
        add(new T3.Mesh(new T3.BoxGeometry(3.4, 0.28, 2.7), mat(0xc8874e)), 0, 0.14, 0, g);
        add(new T3.Mesh(new T3.BoxGeometry(3.1, 0.08, 2.4), mat(0xffe7b8)), 0, 0.30, 0, g);
        putT(toolM[4], -0.58, 0.32, -0.15, 0.08, 1.08);
        var td = putT(toolM[5], 0.88, 0.95, 0.35, 0.4, 1.15);
        if (td) K.onFrame(function (dt, t) { td.rotation.y += dt * 0.85; td.position.y = 0.95 + Math.sin(t * 2.4) * 0.14; });
      } else if (tp.tool === 'prize') {
        // Golden Mystery Shrine Plinth
        add(new T3.Mesh(new T3.CylinderGeometry(1.65, 1.88, 0.34, 8), mat(0xe5dccb)), 0, 0.17, 0, g);
        add(new T3.Mesh(new T3.CylinderGeometry(1.28, 1.42, 0.24, 8), mat(0xffb320)), 0, 0.46, 0, g);
        var pBox = putT(toolM[6], 0, 0.58, 0, 0.22, 1.12);
        if (pBox) K.onFrame(function (dt, t) { pBox.scale.setScalar(1.12 * (1 + Math.sin(t * 3.4) * 0.05)); });
      } else if (tp.tool === 'freeze') {
        // Glacial Ice Grotto Outcrop
        add(new T3.Mesh(new T3.CylinderGeometry(1.65, 1.85, 0.28, 12), mat(0xdff6ff)), 0, 0.14, 0, g);
        [-0.85, 0.88].forEach(function (ix, ii) {
          var shard = add(new T3.Mesh(new T3.ConeGeometry(0.38, 1.25, 6), mat(0x7dd3fc, { roughness: 0.25 })), ix, 0.72, ii ? -0.35 : 0.35, g);
          shard.rotation.z = ii ? -0.25 : 0.25;
        });
        var cry = putT(toolM[7], 0, 0.28, 0, 0, 1.12);
        if (cry) K.onFrame(function (dt, t) { cry.rotation.y += dt * 0.55; cry.position.y = 0.34 + Math.sin(t * 2.0) * 0.12; });
      } else if (tp.tool === 'party') {
        // Royal Celebration Balcony Podium (red carpet + trophy + cake + balloons)
        add(new T3.Mesh(new T3.CylinderGeometry(1.9, 2.08, 0.28, 18), mat(0xf6eee0)), 0, 0.14, 0, g);
        add(new T3.Mesh(new T3.CylinderGeometry(1.45, 1.55, 0.18, 18), mat(0xff5fa2)), 0, 0.36, 0, g);
        putT(toolM[8], -0.48, 0.45, 0.24, 0.1, 1.08);
        var bal = putT(toolM[9], 0, 0.52, -0.38, 0, 1.10);
        putT(toolM[10], 0.62, 0.45, 0.24, -0.25, 1.10);
        if (bal) K.onFrame(function (dt, t) { bal.position.y = 0.56 + Math.sin(t * 1.8) * 0.14; });
      } else if (tp.tool === 'pass') {
        putT(toolM[11], 0, 0, 0, 0, 1.06) || add(new T3.Mesh(new T3.BoxGeometry(1.8, 2.6, 1.8), mat(0x2fc58a)), 0, 1.3, 0, g);
      }
      if (!tp.sky) g.scale.setScalar(1.22);
      scene.add(g);
      return g;
    }

    // 1. land + waterfalls  2. buildings  2b. 3D Classroom Tool Structures & Side-by-Side Games Island  3. plazas, stairs and harbour
    buildIslands();
    buildWaterfalls();
    LAYOUT.places.forEach(function (p, i) { addPlace(p, placeModels[i]); });
    LAYOUT.homes.forEach(function (h, i) { addHome(h, homeModels[i]); });
    (LAYOUT.tools3d || []).forEach(function (tp) {
      var tGrp = buildTool3DProp(tp);
      addPlace({
        id: tp.id,
        title: tp.title,
        signTitle: tp.icon + ' ' + tp.title,
        islandZone: 'home',
        x: tp.x,
        z: tp.z,
        group: tGrp,
        isTool: true,
        toolId: tp.tool,
        skipOverlap: !!tp.sky
      }, null);
    });
    (LAYOUT.arcade3d || []).forEach(function (ag) {
      var won = isGameBeatenThisWeek(ag.id);
      var grp = buildArcadeDiorama(ag);
      addPlace({
        id: ag.id,
        title: ag.title,
        signTitle: (won ? '🏆 ' : (ag.icon + ' ')) + ag.title,
        link: ag.link,
        islandZone: ag.islandZone || 'games',
        x: ag.x,
        z: ag.z,
        group: grp,
        pinSprite: gamePin(ag.icon, ag.color, won),
        isArcade: true
      }, null);
    });
    if (LAYOUT.bridges || LAYOUT.gamesBridge) {
      buildGamesSeaBridge();
    }
    plazaRing(); buildModularPads(); buildStairs(); buildHarbour();

    // 4. paths from each island's plaza to its landmarks + connecting bridge approaches
    var byId = {}; places.forEach(function (p) { byId[p.id] = p; });
    var curves = { gold: null, cob: [], gamesCob: [] };
    var cobMat = mat(0xffffff, { map: texH('cobble.jpg', 1, 1), side: T3.DoubleSide, roughness: .9 });
    var woodMat = mat(0xc98a55, { side: T3.DoubleSide });
    var goldMat = mat(0xe8c882, { roughness: .92, side: T3.DoubleSide });
    var goldEdge = mat(0xd8b56f, { roughness: .94, side: T3.DoubleSide });
    function doorOf(to) {
      if (to === 'harbour') return V(LAYOUT.harbour.door[0], groundAt(LAYOUT.harbour.door[0], LAYOUT.harbour.door[1]) || 0, LAYOUT.harbour.door[1]);
      if (to.indexOf('home:') === 0) return homes[+to.slice(5)].door.clone();
      return byId[to] ? byId[to].door.clone() : V(0, 0.6, 0);
    }
    LAYOUT.paths.forEach(function (ps) {
      if (ps.to !== 'harbour' && ps.to.indexOf('home:') !== 0 && !byId[ps.to]) return;
      var door = doorOf(ps.to);
      if (ps.kind === 'gold') {
        var ctrl = [V(ps.from[0], 0, ps.from[1])].concat(ps.via.map(function (v) { return V(v[0], 0, v[1]); })).concat([door]);
        var pts = liftPath(sampleCurve(ctrl, .7), door.y);
        ribbonMesh(pts, 3.0, goldEdge, .05);
        curves.gold = buildPath(pts, 2.5, goldMat, null, .08);
      } else {
        var avoid = ps.to.indexOf('home:') === 0 ? ps.to : 'place:' + ps.to;
        curves.cob.push(buildPath(liftPath(routeTo(door, avoid, LAYOUT.plaza), door.y), 2.3, cobMat, woodMat, .07));
      }
    });
    if (LAYOUT.gamesPlaza) {
      ['cannon3d', 'penalty3d', 'tug3d', 'bowling3d', 'board3d', 'games'].forEach(function (gid) {
        if (!byId[gid]) return;
        var gDoor = byId[gid].door.clone();
        curves.gamesCob.push(buildPath(liftPath(routeTo(gDoor, 'place:' + gid, LAYOUT.gamesPlaza), gDoor.y), 2.0, cobMat, woodMat, .07));
      });
      var firstBr = LAYOUT.gamesBridge || (LAYOUT.bridges && LAYOUT.bridges[0]);
      if (firstBr && Math.hypot(firstBr.to[0] - LAYOUT.gamesPlaza.x, firstBr.to[1] - LAYOUT.gamesPlaza.z) < 22) {
        var bLanding = V(firstBr.to[0], 0.65, firstBr.to[1]);
        curves.gamesCob.push(buildPath(liftPath(routeTo(bLanding, 'bridge', LAYOUT.gamesPlaza), 0.65), 2.1, cobMat, woodMat, .07));
      }
    }

    // 5a. extra Tripo pieces from layout.extras (they take space before props and trees)
    var extrasByModel = {};
    var extraSrc = {}; (LAYOUT._extraNames || []).forEach(function (n, i) { extraSrc[n] = r[8] && r[8][i]; });
    (LAYOUT.extras || []).forEach(function (e) {
      var src = extraSrc[e.model]; if (!src) return;
      var g0 = groundAt(e.x, e.z), y = e.y != null ? e.y : (g0 === null ? 0 : g0);
      var c = K.fitModel(src.clone(true), e.h, { byLength: !!e.byLength }), g = new T3.Group();
      g.add(c); g.position.set(e.x, y, e.z); g.rotation.y = e.ry || 0; scene.add(g);
      extrasByModel[e.model] = { group: g, spec: e, y0: y };
      if (e.model === 'lighthouse') {
        var lhHit = new T3.Mesh(new T3.CylinderGeometry(2.6, 3.0, e.h + 2, 12), new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        lhHit.position.set(e.x, y + (e.h + 2) / 2, e.z);
        scene.add(lhHit);
        quietHooks.lighthouseHit = lhHit;
      }
      if (e.float) {
        var y0 = y, ph = Math.random() * 6;
        var isProgressBalloon = e.model === 'hot-air-balloon';
        var curBallY = y0;
        K.onFrame(function (dt, t) {
          if (quietHooks.overrideBalloon && isProgressBalloon) return;
          var tgtY = isProgressBalloon ? ((e.minY != null ? e.minY : (y0 - 2.4)) + goalPctLive * (e.riseH || 8.2)) : y0;
          curBallY = K.lerp(curBallY, tgtY, clamp(dt * 1.8, 0, 1));
          g.position.y = curBallY + Math.sin(t * .6 + ph) * e.float;
          g.rotation.y = (e.ry || 0) + Math.sin(t * .2 + ph) * .15;
        });
      }
      if (e.block) blockCircle(e.x, e.z, e.block, 'extra');
    });

    // 5. small things go only where there is free space
    LAYOUT.props.forEach(function (pr) { var y = groundAt(pr.x, pr.z); if (y === null || !free(pr.x, pr.z, .6, pr.kind === 'fountain' ? 'plaza' : null)) return; put(props[pr.kind], pr.x, y, pr.z, pr.ry); blockCircle(pr.x, pr.z, .8, 'prop'); });
    var pines = [], bushes = [];
    LAYOUT.trees.forEach(function (t) { var s = spotNear(t[0], t[1], 1.4); if (s) { pines.push({ x: s.x, y: s.y, z: s.z, s: rnd(1, 1.35), ry: rnd(0, 6.28), c: (Math.random() * 3) | 0 }); blockCircle(s.x, s.z, 1.4, 'tree'); } });
    LAYOUT.bushes.forEach(function (t) { var s = spotNear(t[0], t[1], .9); if (s) { bushes.push({ x: s.x, y: s.y, z: s.z, s: rnd(.8, 1.2) }); blockCircle(s.x, s.z, .9, 'tree'); } });
    buildPines(pines); buildBushes(bushes);
    var wf = homes[2] && homes[2].spec.flowers ? homes[2] : null;
    if (wf) {   // the yellow flower meadow round Sparktail's windmill
      var fg = new T3.SphereGeometry(.22, 7, 5), fy = mat(0xffd23a), fw = mat(0xffffff), list = [];
      for (var f = 0; f < 140 && list.length < 70; f++) { var fx = wf.spec.x + rnd(-8, 8), fz = wf.spec.z + rnd(-4, 6); if (onLand(fx, fz, .6) && free(fx, fz, .3, 'home:2')) list.push([fx, groundAt(fx, fz), fz]); }
      [fy, fw].forEach(function (mm, mi) { var sub = list.filter(function (_, i) { return (i % 5 === 0) === (mi === 1); }), im = new T3.InstancedMesh(fg, mm, Math.max(1, sub.length)), m4 = new T3.Matrix4(); sub.forEach(function (p, i) { m4.makeScale(1, 1, 1).setPosition(p[0], p[1] + .3, p[2]); im.setMatrixAt(i, m4); }); im.count = sub.length; scene.add(im); });
    }
    if (flowers.length) {   // flower clumps along the paths on both islands, never on a building or a road
      [curves.gold].concat(curves.cob).concat(curves.gamesCob || []).forEach(function (cv, ci) {
        if (!cv) return; var L = cv.getLength(), w = ci === 0 ? 2.6 : 1.9, n = 0;
        for (var d = 1.2; d < L - 1; d += 3.4) {
          var u = d / L, p = cv.getPointAt(u), tg = cv.getTangentAt(u), sv = V(-tg.z, 0, tg.x).normalize();
          [-1, 1].forEach(function (sd) {
            if (Math.random() < .55) return;
            var off = w + rnd(.4, 1.2), x = p.x + sv.x * off * sd, z = p.z + sv.z * off * sd;
            if (!onLand(x, z, .5) || !free(x, z, .5)) return;
            var c = put(flowers[(n++) % flowers.length], x, groundAt(x, z), z, rnd(0, 6.28)); c.scale.multiplyScalar(rnd(.8, 1.2)); blockCircle(x, z, .5, 'flower');
          });
        }
      });
    }

    // 6. Treasure Island, Games Island palms & offshore target raft, harbour props, ship
    var palm1 = sea[0], palm3 = sea[1], chest = sea[2], ship = sea[3], dock = sea[4];
    put(palm1, TI.x + 2.8, .1, TI.z - 1.6, .4); put(palm3 || palm1, TI.x - 3.2, .1, TI.z - 1, 2);
    // Tropical palms & offshore target raft dressing Games Island's golden beach
    (LAYOUT.gamesPalms || [[-49.5, 34.0, 0.4], [-43.5, 36.2, 1.9], [-33.5, 36.2, 3.6], [-27.5, 34.0, 5.1]]).forEach(function (gp, gi) {
      var gy2 = groundAt(gp[0], gp[1]);
      if (gy2 !== null) put(gi % 2 ? (palm3 || palm1) : palm1, gp[0], gy2 - 0.05, gp[1], gp[2]);
    });
    (function gamesOffshoreTargetRaft() {
      var raftXZ = LAYOUT.gamesRaft || [-38.5, 41.2];
      var rg = new T3.Group();
      add(new T3.Mesh(new T3.BoxGeometry(3.4, 0.26, 2.9), mat(0xb86f36, { roughness: .84 })), 0, 0, 0, rg);
      if (arcM[3]) { var tgClone = arcM[3].clone(true); tgClone.scale.multiplyScalar(1.25); tgClone.position.set(0, 0.15, 0); rg.add(tgClone); }
      if (arcM[2]) { var chClone = arcM[2].clone(true); chClone.position.set(0.95, 0.15, 0.30); rg.add(chClone); }
      flag(0xff5fa2, -1.25, 0.14, -0.95, rg).scale.setScalar(0.60);
      rg.position.set(raftXZ[0], -1.35, raftXZ[1]);
      scene.add(rg);
      K.onFrame(function (dt, t) { rg.position.y = -1.35 + Math.sin(t * 1.6 + 0.8) * 0.14; rg.rotation.z = Math.sin(t * 1.2) * 0.04; });
    })();
    if (chest) { chest.rotation.y = -.4; chestGroup.add(chest); K.onFrame(function (dt, t) { chest.position.y = Math.abs(Math.sin(t * 1.5)) * .12; }); }
    for (var s2 = 0; s2 < 3; s2++) add(new T3.Mesh(new T3.CylinderGeometry(.35, .35, .08, 5), mat(0xff8a5c)), TI.x + rnd(-3, 3), .18, TI.z + rnd(1, 2.5));
    addPlace({ id: 'island', title: 'Treasure Island', link: 'island/index.html?demo=1', x: TI.x, z: TI.z, group: chestGroup }, null);
    // Engineered Front Sandy Beach Pier: starts RIGHT AT the water's edge cleanly over open turquoise sea
    var pierCfg = LAYOUT.pier || { from: [9.5, 24.6], to: [11.5, 30.2], boat: [6.6, 29.6] };
    buildTimberPier(pierCfg.from[0], 0.08, pierCfg.from[1], pierCfg.to[0], 0.08, pierCfg.to[1], 2.9, 8);
    // Cute wooden rowboat floating cleanly in 100% open water clear of all pier posts
    (function rowboat() {
      var rb = new T3.Group(), hullM = mat(0xb86f36, { roughness: .84 }), trimM = mat(0xe0a464, { roughness: .82 });
      var hull = new T3.Mesh(new T3.SphereGeometry(1.15, 16, 10, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52), hullM);
      hull.scale.set(0.85, 0.72, 1.75); hull.castShadow = true; rb.add(hull);
      var rim = new T3.Mesh(new T3.TorusGeometry(0.96, 0.11, 8, 22), trimM);
      rim.rotation.x = Math.PI / 2; rim.scale.set(0.85, 1.75, 1); rb.add(rim);
      var seat = new T3.Mesh(new T3.BoxGeometry(1.3, 0.12, 0.36), trimM);
      seat.position.set(0, -0.18, 0); rb.add(seat);
      rb.position.set(pierCfg.boat[0], -1.15, pierCfg.boat[1]); rb.rotation.y = 0.78;
      scene.add(rb);
      K.onFrame(function (dt, t) { rb.position.y = -1.15 + Math.sin(t * 1.4 + 1) * .12; rb.rotation.z = Math.sin(t * 1.1) * .06; });
    })();
    // Pirate Ship sailing smoothly left & right along the verified 0-hit front turquoise sea channel + gentle foam wake!
    if (ship) {
      var shipPhase = 0.44;   // starts right in front of the sandy cove
      var baseShipZ = LAYOUT.shipZ || 39.0;
      var wakeGeo = new T3.RingGeometry(0.45, 0.95, 16); wakeGeo.rotateX(-Math.PI / 2);
      var wakes = [], wakeT = 0;
      function shipCurvePos(ph) {
        var s = Math.sin(ph);
        var x = s * 36.0;
        var z = baseShipZ - s * s * 6.5 + Math.cos(ph) * 2.0;
        return { x: x, z: z };
      }
      var sp0 = shipCurvePos(shipPhase);
      ship.position.set(sp0.x, -1.55, sp0.z);
      ship.rotation.y = Math.PI;
      scene.add(ship);

      K.onFrame(function (dt, t) {
        // Gentle scenic cruise (~48s full left-right-left loop); smoothly turns around at each end!
        shipPhase += dt * 0.13;
        var cur = shipCurvePos(shipPhase);
        var ahead = shipCurvePos(shipPhase + 0.04);
        var dx = ahead.x - cur.x, dz = ahead.z - cur.z;
        ship.position.set(cur.x, -1.55 + Math.sin(t * 1.4) * .16, cur.z);
        var targetYaw = Math.atan2(dx, dz) + Math.PI * 0.5;
        // Shortest-angle smooth rudder turn
        var diff = ((targetYaw - ship.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        ship.rotation.y += diff * clamp(dt * 3.5, 0, 1);
        ship.rotation.z = Math.sin(t * 1.1) * .045;
        ship.rotation.x = Math.sin(t * 0.85 + 1.2) * .025;

        // Soft fading white seafoam wake ripples trailing behind the ship
        wakeT -= dt;
        if (wakeT <= 0) {
          wakeT = 0.45;
          var wm = new T3.Mesh(wakeGeo, new T3.MeshBasicMaterial({ color: 0xf4ffff, transparent: true, opacity: 0.55, depthWrite: false }));
          var len = Math.hypot(dx, dz) || 1;
          wm.position.set(cur.x - (dx / len) * 3.2, -1.48, cur.z - (dz / len) * 3.2);
          scene.add(wm);
          wakes.push({ m: wm, age: 0 });
        }
        for (var wi = wakes.length - 1; wi >= 0; wi--) {
          var wk = wakes[wi];
          wk.age += dt;
          var u = wk.age / 2.6;
          if (u >= 1) { scene.remove(wk.m); wk.m.material.dispose(); wakes.splice(wi, 1); }
          else { wk.m.scale.setScalar(1 + u * 2.4); wk.m.material.opacity = 0.55 * (1 - u); }
        }
      });
    }

    // 6b. Scenic Distant Organic Horizon Island (different natural sculpted style — sloping twin hills, rocky coast, golden cove & 4 swaying trees far across the sea)
    (function buildDistantHorizonIsland() {
      var hx = 54, hz = -86;
      var hg = new T3.Group(); hg.position.set(hx, -1.6, hz); scene.add(hg);

      // Register soft shoreline foam ring in the sea shader
      var kIdx = seaU.uN.value;
      if (kIdx < 16) {
        seaU.uIsl.value[kIdx].set(hx, hz, 16.5, 10.5);
        seaU.uIslW.value[kIdx].set(2.4, 0.14, 1.0, 0.0);
        seaU.uN.value = kIdx + 1;
      }

      // Organic sculpted hilly island terrain with smooth height-blended vertex colors (sand -> coastal rock -> lush emerald ridge)
      var geo = new T3.PlaneGeometry(36, 24, 44, 32);
      geo.rotateX(-Math.PI / 2);
      var pos = geo.attributes.position, cols = new Float32Array(pos.count * 3);
      function hillH(x, z) {
        var nx = x / 16.5, nz = z / 10.5;
        var ang = Math.atan2(nz, nx);
        var coast = 1.0 + 0.14 * (Math.sin(ang * 3 + 2.4) * 0.6 + Math.sin(ang * 5 + 5.5) * 0.4);
        var r = Math.hypot(nx, nz) / coast;
        if (r >= 1.08) return -0.8;
        var base = Math.max(0, 1.0 - r * r);
        // Twin natural mountain ridges (main western peak + smaller eastern shoulder)
        var peak1 = Math.exp(-((x + 3.8) * (x + 3.8) / 42 + (z + 1.2) * (z + 1.2) / 22)) * 9.8;
        var peak2 = Math.exp(-((x - 6.2) * (x - 6.2) / 28 + (z - 0.5) * (z - 0.5) / 18)) * 5.6;
        var ridge = (Math.sin(x * 0.28 + z * 0.22) * 0.45 + Math.cos(x * 0.19 - z * 0.31) * 0.35) * base;
        return -0.55 + Math.pow(base, 0.72) * 2.4 + (peak1 + peak2) * Math.min(1, base * 2.2) + ridge;
      }
      for (var i = 0; i < pos.count; i++) {
        var x = pos.getX(i), z = pos.getZ(i);
        var y = hillH(x, z);
        pos.setY(i, y);
        // Natural painterly color bands by elevation & slope
        var rC, gC, bC;
        if (y < 0.85) { rC = 0.94; gC = 0.85; bC = 0.64; }         // warm golden beach sand
        else if (y < 2.2) { rC = 0.62; gC = 0.60; bC = 0.48; }     // natural coastal cliff rock
        else if (y < 5.8) { rC = 0.34; gC = 0.64; bC = 0.33; }     // lush deep hillside green
        else { rC = 0.48; gC = 0.74; bC = 0.36; }                  // sunlit misty hill peak
        cols[i * 3] = rC; cols[i * 3 + 1] = gC; cols[i * 3 + 2] = bC;
      }
      geo.setAttribute('color', new T3.BufferAttribute(cols, 3));
      geo.computeVertexNormals();
      var terr = new T3.Mesh(geo, new T3.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0, envMapIntensity: 0.22 }));
      terr.receiveShadow = true; terr.castShadow = true;
      hg.add(terr);

      // Sculpted coastal rock outcrops along the distant shore
      var rockM = mat(0x9b9589, { roughness: 0.94 });
      [[-11.5, 4.5, 2.2], [-8.5, 6.2, 1.5], [10.8, 3.8, 2.0], [12.5, -1.5, 1.8], [1.5, 6.8, 1.4]].forEach(function (rk, ri) {
        var rMesh = new T3.Mesh(new T3.DodecahedronGeometry(rk[2], 1), rockM);
        rMesh.scale.set(1.25, 0.72, 1.0);
        rMesh.position.set(rk[0], Math.max(0.1, hillH(rk[0], rk[1]) + 0.1), rk[1]);
        rMesh.rotation.set(ri * 0.5, ri * 1.1, 0.2);
        rMesh.castShadow = true; hg.add(rMesh);
      });

      // 3 tropical palm trees on its sandy cove & sunny ridge + 2 natural dark coastal trees
      [[-2.5, 3.5, 1.05, 0.3], [5.8, 2.4, 0.95, 2.1], [-7.2, 1.2, 1.15, 4.2]].forEach(function (pt, pi) {
        var src = pi % 2 ? (palm3 || palm1) : palm1;
        if (!src) return;
        var pClone = src.clone(true);
        pClone.scale.multiplyScalar(pt[2]);
        pClone.position.set(pt[0], hillH(pt[0], pt[1]) - 0.15, pt[1]);
        pClone.rotation.y = pt[3];
        hg.add(pClone);
      });
    })();

    // 7. monsters at their homes, children on the roads
    mons.forEach(function (m, i) {
      var h = homes[i]; if (!h) return;
      m.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .25; }); });
      m.root.position.copy(h.mon); m.root.rotation.y = h.face; scene.add(m.root);
      K.onFrame(function (dt) { if (!avatarsFrozen) m.update(dt); });
      K.after(1 + i * .6, function () { m.setState('hello'); K.after(1.6, function () { m.setState('idle'); }); });
    });
    K.onFrame(function (dt) { if (avatarsFrozen || quietHooks.overrideMons) return; if (Math.random() < dt * .3) { var m = mons[(Math.random() * 4) | 0]; if (m && m.state === 'idle') { m.setState(Math.random() < .5 ? 'hop' : 'wave'); K.after(1.4, function () { if (!quietHooks.overrideMons) m.setState('idle'); }); } } });
    // 7b. Class Students Seated Inside the Colosseum + Ambient Kids on Games Island!
    var homeCurves = [curves.gold].concat(curves.cob).filter(Boolean);
    var gamesCurves = (curves.gamesCob || []).filter(Boolean);
    var allCurves = homeCurves.concat(gamesCurves);
    var kidStates = [];
    var npcHits = [];
    window.__home3dNpcHits = npcHits;
    var colosseumSeatGroup = new T3.Group();
    scene.add(colosseumSeatGroup);
    var colRay = new T3.Raycaster();
    var colDown = V(0, -1, 0);

    function lerpAngle(a, b, t) {
      var d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      return a + d * clamp(t, 0, 1);
    }

    function formatPupilShortName(raw) {
      var s = String(raw || '').trim();
      if (!s) return '';
      if (/^Pupil\s+\d+/i.test(s)) return s; // Privacy placeholder when locked
      var parts = s.split(/\s+/);
      if (parts.length >= 2) return (parts[0] + ' ' + parts[parts.length - 1].charAt(0).toUpperCase() + '.').slice(0, 14);
      return parts[0].slice(0, 14);
    }

    function makePupilNamePill(pupilInfo) {
      if (!pupilInfo || !pupilInfo.name) return null;
      var tCol = (K.TEAMS[pupilInfo.team || 0] && K.TEAMS[pupilInfo.team || 0].c) || '#4f9dff';
      var lbl = formatPupilShortName(pupilInfo.name);
      var nw = Math.max(160, lbl.length * 22 + 56);
      var nt = K.canvasTex(nw, 64, function (c, W, H) {
        c.fillStyle = '#fffdf7';
        c.strokeStyle = tCol;
        c.lineWidth = 6;
        K.roundRect(c, 6, 6, W - 12, H - 12, 26);
        c.fill(); c.stroke();
        c.fillStyle = '#2b1d40';
        c.font = '800 28px Nunito, Trebuchet MS, sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(lbl, W / 2, H / 2 + 1);
      });
      var sp = new T3.Sprite(new T3.SpriteMaterial({ map: nt, transparent: true, opacity: 0.96, depthWrite: false }));
      sp.scale.set((nw / 64) * 0.72, 0.72, 1);
      sp.position.set(0, 2.95, 0);
      sp.visible = false; // Clean hover-only pill so Colosseum tiers never clutter with text!
      return sp;
    }

    function seatColosseumKid(k, idx, totalCount, pupilInfo) {
      var boardPlace = places.filter(function (p) { return p.id === 'board'; })[0];
      if (!k || !boardPlace || !boardPlace.box) return;
      var bc = boardPlace.box.getCenter(V());
      var colR = Math.max(6.8, (boardPlace.box.max.x - boardPlace.box.min.x) * 0.5);
      // 3 curved amphitheatre rows supporting up to 25 students cleanly grouped in 4 team sections with generous breathing room!
      var nRows = totalCount > 12 ? 3 : 2;
      var r0 = nRows === 3 ? Math.ceil(totalCount * 0.30) : Math.ceil(totalCount * 0.45);
      var r1 = nRows === 3 ? Math.ceil((totalCount - r0) * 0.50) : (totalCount - r0);
      var row = idx < r0 ? 0 : (idx < r0 + r1 ? 1 : 2);
      var countInRow = row === 0 ? r0 : (row === 1 ? r1 : Math.max(1, totalCount - r0 - r1));
      var posInRow = row === 0 ? idx : (row === 1 ? idx - r0 : idx - r0 - r1);
      var frac = countInRow > 1 ? (posInRow / (countInRow - 1)) : 0.5;
      var ang = K.lerp(-Math.PI * 0.83, -Math.PI * 0.17, frac);
      var radFactor = nRows === 3 ? [0.47, 0.59, 0.71][row] : [0.48, 0.65][row];
      var rad = colR * radFactor;
      var sx = bc.x + Math.cos(ang) * rad;
      var sz = bc.z + Math.sin(ang) * rad;
      var sy = boardPlace.box.min.y + [1.65, 2.55, 3.45][row];
      if (boardPlace.group) {
        colRay.set(V(sx, 28, sz), colDown);
        var hits = colRay.intersectObject(boardPlace.group, true);
        if (hits.length) sy = hits[0].point.y + 0.02;
      }
      var seatYaw = Math.atan2(bc.x - sx, (bc.z + colR * 0.32) - sz);

      var holder = new T3.Group();
      holder.position.set(sx, sy, sz);
      colosseumSeatGroup.add(holder);

      if (k.attachClips && animClips) k.attachClips(animClips);
      k.speed = 0;
      k.root.rotation.y = seatYaw;
      k.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .34; }); });
      holder.add(k.root);

      var tIdx = pupilInfo && pupilInfo.team != null ? (Number(pupilInfo.team) % 4) : (idx % 4);
      var teamHex = (K.TEAMS[tIdx] && K.TEAMS[tIdx].hex) || 0x4f9dff;
      var ring = new T3.Mesh(
        new T3.RingGeometry(0.34, 0.58, 18),
        new T3.MeshBasicMaterial({ color: teamHex, transparent: true, opacity: 0.68, side: T3.DoubleSide, depthWrite: false })
      );
      ring.rotation.x = -Math.PI * 0.5;
      ring.position.y = 0.05;
      holder.add(ring);

      // Instant golden point-award glow halo (activates on +XP with bouncy scale-up!)
      var glowMat = new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: 0, side: T3.DoubleSide, depthWrite: false });
      var glowRing = new T3.Mesh(new T3.RingGeometry(0.42, 0.92, 24), glowMat);
      glowRing.rotation.x = -Math.PI * 0.5;
      glowRing.position.y = 0.09;
      glowRing.visible = false;
      holder.add(glowRing);

      // +20% generous touch cylinder so kids & teacher never miss a seated avatar on 65"-86" smartboards
      var hit = new T3.Mesh(new T3.CylinderGeometry(.92, .92, 2.65, 8), new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.position.y = 1.05;
      k.root.add(hit);

      var nameSprite = makePupilNamePill(pupilInfo);
      if (nameSprite) {
        nameSprite.position.set(0, 2.45, 0);
        k.root.add(nameSprite);
      }

      // REAL 3D SITTING POSTURE on the stone bench!
      k.setState(idx % 5 === 1 ? 'sitWave' : 'sit');
      k.P = k.pose(k.state, 0); // snap initial pose immediately so frame 0 is already sitting!
      var ks = {
        idx: idx,
        k: k,
        holder: holder,
        glowRing: glowRing,
        glowMat: glowMat,
        glowT: 0,
        seated: true,
        seatYaw: seatYaw,
        state: 'seated',
        timer: rnd(2.2, 8.5),
        pupil: pupilInfo || null,
        nameSprite: nameSprite,
        onGamesIsl: false,
        onTap: function () {
          ks.state = 'greet';
          ks.timer = 2.8;
          ks.glowT = 1.6;
          k.setState('sitCheer');
          K.sfx('tap');
        }
      };
      hit.userData.npc = ks;
      npcHits.push(hit);
      kidStates.push(ks);
    }

    function mountSingleKid(k, i, onGamesIsl, pupilInfo) {
      var pool = onGamesIsl ? gamesCurves : homeCurves;
      var road = pool[i % Math.max(1, pool.length)];
      if (!k || !road) return;
      scene.add(k.root);
      if (k.attachClips && animClips) k.attachClips(animClips);
      k.speed = 0;
      k.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .22; }); });

      var hit = new T3.Mesh(new T3.CylinderGeometry(.95, .95, 2.9, 8), new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.position.y = 1.45;
      k.root.add(hit);

      var nameSprite = makePupilNamePill(pupilInfo);
      if (nameSprite) k.root.add(nameSprite);

      var u0 = clamp(0.08 + ((i * 0.137) % 0.82), 0.06, 0.94);
      var p0 = road.getPointAt(u0);
      var laneOff = (i % 2 ? 0.58 : -0.58);
      k.root.position.set(p0.x + laneOff, p0.y + .06, p0.z);

      var ks = {
        idx: i, k: k, road: road, u: u0, dir: i % 2 ? -1 : 1,
        targetU: i % 2 ? 0.10 : 0.90,
        walkSpd: rnd(2.05, 2.7),
        off: laneOff,
        state: (i % 4 === 0) ? 'visit' : 'walk',
        timer: (i % 4 === 0) ? rnd(1.5, 3.5) : 0,
        targetYaw: 0,
        chatCd: rnd(3, 8),
        partner: null,
        bubble: null,
        bubbleT: 0,
        seated: false,
        pupil: pupilInfo || null,
        nameSprite: nameSprite,
        onGamesIsl: !!onGamesIsl,
        onTap: function () {
          ks.state = 'greet';
          ks.timer = 3.2;
          ks.partner = null;
          k.setState('cheer');
          if (k.mixer) k.mixer.timeScale = 1.0;
          K.sfx('tap');
        }
      };
      hit.userData.npc = ks;
      npcHits.push(hit);
      if (ks.state === 'walk') {
        k.setState('run');
        if (k.mixer) k.mixer.timeScale = 0.56;
      } else {
        k.setState('idle');
      }
      kidStates.push(ks);
    }

    // Seat initial 8 kids in the Colosseum (replaced immediately on boot by full 16–24 class roster) + 4 ambient kids on Games Island!
    var bootColKids = kids.slice(0, 8).filter(Boolean);
    bootColKids.forEach(function (k, i) {
      seatColosseumKid(k, i, bootColKids.length, { id: 'demo-p-' + (i + 1), name: 'Pupil ' + (i + 1), team: i % 4 });
    });
    kids.slice(8).forEach(function (k, i) {
      if (gamesCurves.length > 0) mountSingleKid(k, i, true, null);
    });

    var _respawnSeq = 0;
    function respawnClassPupils(rosterList) {
      if (!Array.isArray(rosterList) || !rosterList.length) return Promise.resolve();
      var seq = ++_respawnSeq;
      // Support up to 25 classroom students, cleanly sorted into 4 color-coded Team Sections!
      var capped = rosterList.slice(0, 25).sort(function (a, b) {
        return (Number(a.team) || 0) - (Number(b.team) || 0);
      });
      var PA = window.PupilAvatars || (window.parent && window.parent !== window && window.parent.PupilAvatars) || null;
      if (PA && typeof PA.preloadHeads3d === 'function') {
        var realIds = capped.map(function (e) { return e && e.id; }).filter(function (id) { return /^student-/.test(String(id || '')); });
        if (realIds.length) PA.preloadHeads3d(realIds);
      }
      return Promise.all(capped.map(function (p, idx) {
        var tIdx = Number(p.team);
        if (isNaN(tIdx) || tIdx < 0) tIdx = idx % 4;
        var teamBase = K.TEAMS[tIdx % 4] || K.TEAMS[0];
        var sid = p && p.id && /^student-/.test(String(p.id)) ? p.id : null;
        var kidKind = (sid && PA && typeof PA.genderOf === 'function') ? (PA.genderOf(sid) === 'girl' ? 'girl' : 'boy') : teamBase.kid;
        var teamSpec = Object.assign({}, teamBase, { pupils: [{ id: p.id, name: p.name }] });
        return K.makeCharacter(teamSpec, { kidsOnly: true, kidHeight: 2.32, kid: kidKind, studentId: sid }).catch(function () { return null; });
      })).then(function (built) {
        if (seq !== _respawnSeq) return;
        // Clear previous Colosseum / Home Island kids (keep Games Island ambient kids intact)
        while (colosseumSeatGroup.children.length) {
          colosseumSeatGroup.remove(colosseumSeatGroup.children[0]);
        }
        for (var ki = kidStates.length - 1; ki >= 0; ki--) {
          if (!kidStates[ki].onGamesIsl) {
            var oldK = kidStates[ki].k;
            if (oldK && oldK.root && oldK.root.parent) oldK.root.parent.remove(oldK.root);
            kidStates.splice(ki, 1);
          }
        }
        npcHits.length = 0;
        kidStates.forEach(function (rem) {
          rem.k.root.traverse(function (o) { if (o.userData && o.userData.npc === rem) npcHits.push(o); });
        });
        var valid = [];
        built.forEach(function (ch, idx) {
          if (ch) valid.push({ ch: ch, info: capped[idx] });
        });
        valid.forEach(function (item, idx) {
          seatColosseumKid(item.ch, idx, valid.length, item.info);
        });
      });
    }

    function pickNextDestination(ks) {
      if (ks.seated) {
        ks.state = 'seated';
        ks.timer = rnd(4.0, 10.5);
        ks.k.setState('sit');
        return;
      }
      // Occasionally switch to another connected road near the central plaza
      if (Math.random() < 0.45 && gamesCurves.length > 1) {
        var curP = ks.k.root.position;
        var near = gamesCurves.filter(function (cv) {
          var a = cv.getPointAt(0.06), b = cv.getPointAt(0.94);
          return a.distanceTo(curP) < 9.5 || b.distanceTo(curP) < 9.5;
        });
        if (near.length) {
          var nextRoad = near[(Math.random() * near.length) | 0];
          var dA = nextRoad.getPointAt(0.06).distanceTo(curP);
          var dB = nextRoad.getPointAt(0.94).distanceTo(curP);
          ks.road = nextRoad;
          ks.u = dA < dB ? 0.06 : 0.94;
          ks.dir = dA < dB ? 1 : -1;
        }
      }
      ks.targetU = ks.dir > 0 ? rnd(Math.min(0.92, ks.u + 0.25), 0.94) : rnd(0.06, Math.max(0.08, ks.u - 0.25));
      if (Math.abs(ks.targetU - ks.u) < 0.14) {
        ks.dir = -ks.dir;
        ks.targetU = ks.dir > 0 ? rnd(0.65, 0.94) : rnd(0.06, 0.35);
      }
      ks.state = 'walk';
      ks.k.setState('run');
      if (ks.k.mixer) ks.k.mixer.timeScale = 0.56;
    }

    K.onFrame(function (dt, t) {
      // Seamless handoff when UFO Picker / Groups / Line-Up / Stars / Birthday uses the Colosseum stage!
      var toolStageBusy = !!document.querySelector('#itPanel:not(.hidden), #itPackPanel:not(.hidden)');
      colosseumSeatGroup.visible = !toolStageBusy;

      kidStates.forEach(function (ks) {
        var k = ks.k;
        if (avatarsFrozen) return;
        k.update(dt);
        if (ks.nameSprite) {
          var forceN = !!window.__home3dForceNames;
          ks.nameSprite.visible = !toolStageBusy && (forceN || !!(hover && hover.id === 'npc' && hover.npc === ks));
        }
        if (ks.seated) {
          // Instant golden glow + brief bouncy scale-up highlight whenever a student receives a point!
          if (ks.glowT > 0) {
            ks.glowT = Math.max(0, ks.glowT - dt);
            var gPulse = Math.sin(clamp(ks.glowT / 2.4, 0, 1) * Math.PI);
            var scPop = 1 + gPulse * 0.24;
            k.root.scale.setScalar(scPop);
            if (ks.glowRing && ks.glowMat) {
              ks.glowRing.visible = true;
              ks.glowRing.scale.setScalar(1 + (1 - gPulse) * 0.45 + Math.sin(t * 10) * 0.08);
              ks.glowMat.opacity = gPulse * 0.92;
            }
          } else {
            k.root.scale.setScalar(1);
            if (ks.glowRing) ks.glowRing.visible = false;
          }
          if (quietHooks.overrideKids || toolStageBusy) return;
          if (ks.state === 'greet') {
            var dxS = K.camera.position.x - (ks.holder ? ks.holder.position.x : 0);
            var dzS = K.camera.position.z - (ks.holder ? ks.holder.position.z : 0);
            k.root.rotation.y = lerpAngle(k.root.rotation.y, Math.atan2(dxS, dzS), dt * 7);
            ks.timer -= dt;
            if (ks.timer <= 0) {
              ks.state = 'seated';
              ks.timer = rnd(4.5, 11.0);
              k.setState('sit');
            }
          } else {
            k.root.rotation.y = lerpAngle(k.root.rotation.y, ks.seatYaw, dt * 5);
            ks.timer -= dt;
            if (ks.timer <= 0) {
              if (Math.random() < 0.34) {
                k.setState(Math.random() < 0.65 ? 'sitWave' : 'sitClap');
                ks.timer = rnd(1.8, 2.8);
                K.after(2.0, function () { if (ks.state === 'seated' && !quietHooks.overrideKids) k.setState('sit'); });
              } else {
                k.setState('sit');
                ks.timer = rnd(5.0, 12.0);
              }
            }
          }
          return;
        }
        if (ks.bubble) {
          ks.bubbleT -= dt;
          ks.bubble.position.y = 3.35 + Math.sin(t * 3.5 + ks.idx) * 0.12;
          if (ks.bubbleT <= 0) { k.root.remove(ks.bubble); ks.bubble = null; }
        }
        if (quietHooks.overrideKids) return;
        if (ks.chatCd > 0) ks.chatCd -= dt;

        if (ks.state === 'greet') {
          var dxC = K.camera.position.x - k.root.position.x, dzC = K.camera.position.z - k.root.position.z;
          k.root.rotation.y = lerpAngle(k.root.rotation.y, Math.atan2(dxC, dzC), dt * 7);
          ks.timer -= dt;
          if (ks.timer <= 0) pickNextDestination(ks);
          return;
        }

        if (ks.state === 'chat') {
          if (ks.partner) {
            var dxP = ks.partner.k.root.position.x - k.root.position.x;
            var dzP = ks.partner.k.root.position.z - k.root.position.z;
            k.root.rotation.y = lerpAngle(k.root.rotation.y, Math.atan2(dxP, dzP), dt * 6);
          }
          ks.timer -= dt;
          if (ks.timer <= 0) { ks.partner = null; ks.chatCd = rnd(10, 18); pickNextDestination(ks); }
          return;
        }

        if (ks.state === 'visit') {
          k.root.rotation.y = lerpAngle(k.root.rotation.y, ks.targetYaw, dt * 4.5);
          ks.timer -= dt;
          if (ks.timer <= 0) pickNextDestination(ks);
          return;
        }

        // state === 'walk'
        if (k.mixer) k.mixer.timeScale = 0.56;
        var stepU = (ks.walkSpd / Math.max(4, ks.road.getLength())) * dt;
        var distU = ks.targetU - ks.u;
        if (Math.abs(distU) <= stepU * 1.4) {
          ks.u = ks.targetU;
          ks.state = 'visit';
          ks.timer = rnd(2.8, 5.4);
          var act = Math.random();
          k.setState(act < 0.45 ? 'idle' : (act < 0.8 ? 'wave' : 'cheer'));
          if (k.mixer) k.mixer.timeScale = 1.0;
          var bestD = 999, bestLook = null;
          places.forEach(function (pl) {
            if (!pl || !pl.box) return;
            var pc = pl.box.getCenter(V()), d = pc.distanceTo(k.root.position);
            if (d < bestD) { bestD = d; bestLook = pc; }
          });
          if (bestLook) ks.targetYaw = Math.atan2(bestLook.x - k.root.position.x, bestLook.z - k.root.position.z);
          return;
        }

        ks.dir = distU > 0 ? 1 : -1;
        ks.u = clamp(ks.u + ks.dir * stepU, 0.04, 0.96);
        var p = ks.road.getPointAt(ks.u);
        var tg = ks.road.getTangentAt(ks.u).multiplyScalar(ks.dir);
        var sideX = -tg.z * ks.off, sideZ = tg.x * ks.off;
        var gx = p.x + sideX, gz = p.z + sideZ;
        var gy = groundAt(gx, gz);
        var tx = gx, ty = (gy !== null ? Math.max(p.y, gy) : p.y) + .06, tz = gz;
        k.root.position.x = K.lerp(k.root.position.x, tx, clamp(dt * 8, 0, 1));
        k.root.position.y = K.lerp(k.root.position.y, ty, clamp(dt * 10, 0, 1));
        k.root.position.z = K.lerp(k.root.position.z, tz, clamp(dt * 8, 0, 1));
        var wantYaw = Math.atan2(tg.x, tg.z);
        k.root.rotation.y = lerpAngle(k.root.rotation.y, wantYaw, dt * 6.5);
      });
    });

    // 7c. Contact Shadows (AO grounding discs under every building), edge bushes/stones & organic cobblestone path borders
    (function addIslandLife() {
      // Soft radial Contact Shadow texture so every building is firmly anchored into the grass (never floating)
      var aoTex = K.canvasTex(128, 128, function (c, W, H) {
        var gr = c.createRadialGradient(W / 2, H / 2, W * 0.14, W / 2, H / 2, W * 0.5);
        gr.addColorStop(0, 'rgba(20, 48, 44, 0.15)');
        gr.addColorStop(0.58, 'rgba(22, 52, 46, 0.07)');
        gr.addColorStop(1, 'rgba(22, 52, 46, 0.0)');
        c.fillStyle = gr; c.fillRect(0, 0, W, H);
      });
      var aoMat = new T3.MeshBasicMaterial({ map: aoTex, transparent: true, depthWrite: false });
      var aoGeo = new T3.PlaneGeometry(1, 1); aoGeo.rotateX(-Math.PI / 2);
      function placeContactShadow(box) {
        if (!box) return;
        var sz2 = box.getSize(V()), ce2 = box.getCenter(V());
        var gy = groundAt(ce2.x, ce2.z); if (gy === null) gy = box.min.y;
        var disc = new T3.Mesh(aoGeo, aoMat);
        disc.position.set(ce2.x, gy + 0.045, ce2.z);
        disc.scale.set(sz2.x * 1.18, 1, sz2.z * 1.18);
        disc.renderOrder = 1;
        scene.add(disc);
      }
      places.concat(homes).forEach(function (o) { if (o && o.id !== 'island' && !o.skipOverlap) placeContactShadow(o.box); });
      Object.keys(extrasByModel).forEach(function (k) {
        var ex = extrasByModel[k];
        if (!ex || !ex.group || k === 'hot-air-balloon') return;
        ex.group.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
        placeContactShadow(new T3.Box3().setFromObject(ex.group));
      });

      // Smooth river stones, pebbles & cozy shrub clusters near building bases and bridge ends
      var rockGeo = new T3.DodecahedronGeometry(.42, 1), rockMat = mat(0xc8c0b4, { roughness: .92 });
      var rockSpots = [], baseBushes = [];
      places.concat(homes).forEach(function (o) {
        if (!o || !o.box || o.id === 'island' || o.skipOverlap || o.isTool) return;
        var b = o.box;
        [[b.min.x - .6, b.min.z - .4], [b.max.x + .5, b.max.z + .4], [b.min.x - .4, b.max.z + .5], [b.max.x + .5, b.min.z - .3]].forEach(function (pt, pi) {
          var gy = groundAt(pt[0], pt[1]);
          if (gy !== null && onLand(pt[0], pt[1], .3)) {
            rockSpots.push([pt[0], gy, pt[1], rnd(.55, 1.15)]);
            if (pi % 2 === 0 && free(pt[0] + .6, pt[1] + .4, .45)) {
              baseBushes.push({ x: pt[0] + .55, y: gy, z: pt[1] + .35, s: rnd(.55, .85) });
            }
          }
        });
      });
      // Organic small border stones along all cobblestone paths on both islands
      (curves.cob || []).concat(curves.gamesCob || []).forEach(function (cv) {
        if (!cv) return;
        var L = cv.getLength();
        for (var d = 1.0; d < L - 0.8; d += 2.4) {
          var u = d / L, p = cv.getPointAt(u), tg = cv.getTangentAt(u), sv = V(-tg.z, 0, tg.x).normalize();
          [-1, 1].forEach(function (sd) {
            if (Math.random() < 0.38) return;
            var off = 1.25 + rnd(0, 0.35), sx = p.x + sv.x * off * sd, sz = p.z + sv.z * off * sd;
            var gy = groundAt(sx, sz);
            if (gy !== null) rockSpots.push([sx, gy, sz, rnd(.38, .72)]);
          });
        }
      });
      if (rockSpots.length) {
        var rm = new T3.InstancedMesh(rockGeo, rockMat, rockSpots.length), m4 = new T3.Matrix4(), q = new T3.Quaternion();
        rm.castShadow = true; rm.receiveShadow = true;
        rockSpots.forEach(function (r, idx) {
          q.setFromAxisAngle(V(0, 1, 0), idx * 1.3);
          m4.compose(V(r[0], r[1] + .11 * r[3], r[2]), q, V(r[3] * 1.2, r[3] * .58, r[3]));
          rm.setMatrixAt(idx, m4);
        });
        scene.add(rm);
      }
      if (baseBushes.length) buildBushes(baseBushes);

      // Drifting fluffy 3D clouds in the background sky
      var clMat = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: .95, metalness: 0, emissive: 0xeaf6ff, emissiveIntensity: .28 });
      var clouds3d = [];
      for (var ci = 0; ci < 9; ci++) {
        var cg = new T3.Group();
        [[-2.2, 0, 0, 2.2], [0, .8, 0, 2.9], [2.4, -.1, .2, 2.0], [.6, .2, -1.2, 2.1]].forEach(function (pf) {
          var s = new T3.Mesh(new T3.SphereGeometry(pf[3], 12, 10), clMat);
          s.position.set(pf[0], pf[1], pf[2]); s.scale.set(1.25, .72, 1.0); cg.add(s);
        });
        var cx = -110 + ci * 28 + rnd(-6, 6), cy = 24 + (ci % 3) * 6, cz = -62 - (ci % 4) * 14;
        cg.position.set(cx, cy, cz);
        cg.scale.setScalar(rnd(.85, 1.35));
        scene.add(cg);
        clouds3d.push({ g: cg, spd: rnd(.65, 1.25), y0: cy, ph: ci * 1.1 });
      }
      K.onFrame(function (dt, t) {
        clouds3d.forEach(function (cl) {
          cl.g.position.x += cl.spd * dt;
          if (cl.g.position.x > 135) cl.g.position.x = -135;
          cl.g.position.y = cl.y0 + Math.sin(t * .4 + cl.ph) * .45;
        });
      });

      // Gentle spinning golden-accent windmill sails on Sparktail's windmill home (homes[2])
      var wm = homes[2];
      var windmillSpeedMul = 1.0;
      window.__home3dSetWindmillSpeed = function (m) { windmillSpeedMul = clamp(Number(m) || 1, 0.15, 5.5); };
      if (wm && wm.box) {
        var wc = wm.box.getCenter(V()), wh = wm.box.max.y - wm.box.min.y;
        var rotor = new T3.Group();
        var hub = new T3.Mesh(new T3.CylinderGeometry(.32, .32, .5, 12), mat(0xffb320));
        hub.rotation.x = Math.PI / 2; rotor.add(hub);
        for (var bi = 0; bi < 4; bi++) {
          var arm = new T3.Group(); arm.rotation.z = bi * Math.PI / 2;
          var spar = new T3.Mesh(new T3.BoxGeometry(.16, 3.2, .12), mat(0xa86b3a));
          spar.position.y = 1.6; arm.add(spar);
          var sail = new T3.Mesh(new T3.BoxGeometry(.85, 2.35, .06), mat(0xfff6e2));
          sail.position.set(.38, 1.9, .04); sail.castShadow = true; arm.add(sail);
          rotor.add(arm);
        }
        rotor.position.set(wc.x, wm.box.min.y + wh * 0.72, wm.box.max.z + .35);
        scene.add(rotor);
        K.onFrame(function (dt) { rotor.rotation.z -= dt * 0.75 * windmillSpeedMul; });
      }
      // Thursday Visiting Ship golden lanterns & festive pennant (world-space unscaled group synced to ship!)
      var shipLanterns = null;
      window.__home3dSetThursdayShip = function (on) {
        if (!ship) return;
        if (!shipLanterns) {
          shipLanterns = new T3.Group();
          var glowMat = new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffa600, emissiveIntensity: 0.85, roughness: 0.25 });
          [[-2.2, 2.6, 0.3], [0, 4.9, 0], [2.2, 2.6, 0.3]].forEach(function (lp) {
            var orb = new T3.Mesh(new T3.SphereGeometry(0.32, 12, 10), glowMat);
            orb.position.set(lp[0], lp[1], lp[2]);
            shipLanterns.add(orb);
          });
          var banner = new T3.Mesh(new T3.BoxGeometry(2.6, 0.55, 0.12), mat(0xff5fa2));
          banner.position.set(0, 5.55, 0);
          shipLanterns.add(banner);
          scene.add(shipLanterns);
          K.onFrame(function () {
            if (shipLanterns && shipLanterns.visible && ship) {
              shipLanterns.position.copy(ship.position);
              shipLanterns.rotation.y = ship.rotation.y;
            }
          });
        }
        shipLanterns.visible = !!on;
        if (on && ship) {
          shipLanterns.position.copy(ship.position);
          shipLanterns.rotation.y = ship.rotation.y;
        }
      };
    })();

    // 8. tight per-island shadow frustum + dual-island camera framing
    var half = 54;
    sc.left = -half; sc.right = half; sc.top = half * .82; sc.bottom = -half * .82; sc.updateProjectionMatrix();
    fitPoints();
    readGoal(); loading.remove(); K.ui.topButtons(); hud();
    switchIsland(activeIsland, true);
    var returnedFromGame = K.Q.get('returned') || '';
    buildBridge(clamp(goal.got / (goal.target || 1), 0, 1), true);
    if (returnedFromGame) {
      var retPlace = places.filter(function (x) { return x.id === returnedFromGame; })[0];
      var gTitle = retPlace ? retPlace.title : 'Games Island';
      K.after(0.45, function () {
        K.ui.toast('🏆 ' + gTitle + ' complete! 🌉 Treasure Bridge grew closer!', 3.6, '#2fc58a');
        if (activeIsland === 'home') K.fx.confetti(V(35.5, 4.2, -11.2), 75);
        if (retPlace && retPlace.box) K.fx.confetti(retPlace.box.getCenter(V()).add(V(0, 3.2, 0)), 65);
      });
    }
    function focusColosseum() {
      var bp = places.filter(function (p) { return p.id === 'board'; })[0];
      if (!bp || !bp.box) return;
      var c = bp.box.getCenter(V());
      if (activeIsland !== 'both') switchIsland('both', true);
      home();
      view.yaw = 0;
      view.pitch = 0.43;
      view.panX = clamp(c.x - FIT.look.x, -48, 48);
      view.panZ = clamp(c.z - FIT.look.z, -42, 42);
      setZoom(0.24);
    }
    function highlightPupil(studentId) {
      var found = kidStates.filter(function (ks) { return ks.pupil && ks.pupil.id === studentId; })[0];
      if (!found) return;
      found.state = 'greet';
      found.timer = 2.8;
      found.glowT = 2.4;
      found.k.setState('sitCheer');
      if (found.holder && K.fx && K.fx.confetti) {
        K.fx.confetti(found.holder.position.clone().add(V(0, 2.2, 0)), 36);
      }
    }
    window.__home3d = {
      places: places.map(function (p) { return p.id; }),
      goal: goal,
      groundAt: groundAt,
      free: free,
      activeIsland: function () { return activeIsland; },
      switchIsland: switchIsland,
      focusColosseum: focusColosseum,
      highlightPupil: highlightPupil,
      setPreset: function (id, instant) { flyToPreset(id, !!instant); },
      getPreset: function () { return activePresetId; },
      setCameraLock: setCameraLock,
      isCameraLocked: isCameraPanLocked,
      setFocusMode: function (on) { if (hud._setFocusMode) hud._setFocusMode(on); },
      isFocusMode: function () { return focusModeOn; },
      setHighContrast: function (on) { if (hud._setHighContrast) hud._setHighContrast(on); },
      setMuted: function (on) { if (hud._setMuted) hud._setMuted(on); },
      playShortChime: playShortChime,
      go: function (id, fast) { var p = places.filter(function (x) { return x.id === id; })[0]; if (p) go(p, !!fast); },
      refreshGoal: function () { updateGoalUI(true); },
      overlaps: function () {   // test helper: buildings that overlap each other
        var out = [], all2 = places.filter(function (p) { return p.id !== 'island' && !p.skipOverlap; }).map(function (p) { return [p.id, p.box]; }).concat(homes.map(function (h, i) { return ['home' + i, h.box]; }));
        all2.forEach(function (a, i) { all2.slice(i + 1).forEach(function (b) { var A = a[1], B = b[1]; if (A.min.x < B.max.x && A.max.x > B.min.x && A.min.z < B.max.z && A.max.z > B.min.z) out.push(a[0] + '×' + b[0]); }); });
        return out;
      }
    };
    window.__home3dQuietHost = {
      K: K, T3: T3, scene: scene, seaU: seaU, seaMesh: seaMesh, hemiLight: hemiLight, sun: sun,
      cloudCv: window.__home3dCloudCv, places: places, homes: homes, mons: mons, kids: kids,
      kidStates: kidStates, extrasByModel: extrasByModel, curves: curves, DOCK: DOCK, TI: TI,
      groundAt: groundAt, quietHooks: quietHooks, layout: LAYOUT, ship: ship, home: home,
      animClips: animClips, respawnClassPupils: respawnClassPupils, updateGoalUI: updateGoalUI,
      switchIsland: switchIsland, setCameraLock: setCameraLock, flyToPreset: flyToPreset,
      playShortChime: playShortChime, buildPadGroups: buildPadGroups, addBalloonLift: addBalloonLift,
      getGoal: function () { return { got: Math.min(goal.target || 300, (goal.got || 0) + balloonBonusLive), target: goal.target || 300, pct: goalPctLive }; },
      highlightPupil: highlightPupil
    };
    window.dispatchEvent(new CustomEvent('home3d:ready'));
    K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
