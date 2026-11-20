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
  R3.toneMapping = T3.ACESFilmicToneMapping;
  R3.toneMappingExposure = 1.04;   // airy, clean, balanced daylight without harsh dark blotches
  R3.shadowMap.enabled = true;
  R3.shadowMap.type = T3.PCFSoftShadowMap;
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
  // Gentle fill from the sea side to keep shadow faces smooth and readable
  var rimLight = new T3.DirectionalLight(0xb0eaf5, 0.32);
  rimLight.position.set(45, 24, -42); scene.add(rimLight);

  // Sea: sunny cartoon adventure-park water matching docs/design/home-world.jpg:
  // exact analytical distance to every island's coastline (no spiky polygon rings),
  // creamy breathing shore foam, warm aqua shallows, bright tropical turquoise water, and soft painterly swells.
  var seaU = { uT: { value: 0 }, uStorm: { value: 0 }, uIsl: { value: [] }, uIslW: { value: [] }, uN: { value: 0 } };
  for (var si = 0; si < 10; si++) {
    seaU.uIsl.value.push(new T3.Vector4(0, 0, 1, 1));
    seaU.uIslW.value.push(new T3.Vector4(0, 0, 0, 0));
  }
  var seaMesh = null;
  (function sea() {
    var m = new T3.Mesh(new T3.PlaneGeometry(900, 900, 1, 1), new T3.ShaderMaterial({
      uniforms: seaU,
      vertexShader: 'varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: [
        'uniform float uT; uniform float uStorm; uniform vec4 uIsl[10]; uniform vec4 uIslW[10]; uniform int uN; varying vec2 vW;',
        'float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
        'float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }',
        'float fbm(vec2 p){ return n(p) * 0.65 + n(p * 2.1 + 17.3) * 0.35; }',
        'float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }',
        'void main(){',
        '  float dist = 999.0; float sandNear = 0.0;',
        '  for (int k = 0; k < 10; k++) {',
        '    if (k >= uN) break;',
        '    vec4 e = uIsl[k]; vec4 ew = uIslW[k];',
        '    vec2 d = vW - e.xy;',
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
        // Rich calm tropical turquoise sea (#1CA3B0 -> #177F96 -> #12617A) with bright crisp shoreline foam grounding the island
        '  vec3 shal = mix(vec3(0.30, 0.80, 0.82), vec3(0.48, 0.86, 0.82), sandNear * 0.55);',
        '  vec3 turq = mix(vec3(0.11, 0.64, 0.69), vec3(0.09, 0.26, 0.36), st);',
        '  vec3 mid  = mix(vec3(0.09, 0.52, 0.62), vec3(0.07, 0.20, 0.30), st);',
        '  vec3 deep = mix(vec3(0.07, 0.41, 0.54), vec3(0.05, 0.14, 0.24), st);',
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
  function blobPts(cx, cz, rx, rz, seed, wob) {
    var pts = [], n = 40;
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, w = 1 + (wob || .1) * (Math.sin(a * 3 + seed) * .6 + Math.sin(a * 5 + seed * 2.3) * .4);
      pts.push(new T3.Vector2(cx + Math.cos(a) * rx * w, -(cz + Math.sin(a) * rz * w)));
    }
    return pts;
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
      ? mat(0xf6e2b3, { roughness: .92, vertexColors: true })
      : mat(0x7cc848, { roughness: .94, vertexColors: true });
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
    seaU.uN.value = Math.min(10, LAYOUT.islands.length);
    LAYOUT.islands.slice(0, 10).forEach(function (il, k) {
      seaU.uIsl.value[k].set(il.x, il.z, il.rx, il.rz);
      seaU.uIslW.value[k].set(il.seed || 0, il.wob != null ? il.wob : .1, il.kind === 'sand' ? 1 : 0, 0);
    });
    LAYOUT.islands.forEach(function (il) {
      var pts = blobPts(il.x, il.z, il.rx, il.rz, il.seed, il.wob);
      landPiece(pts, il.h, il.kind);
      LANDS.push({ id: il.id, h: il.h, poly: pts.map(function (p) { return [p.x, -p.y]; }) });
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
  function routeTo(door, avoidTag) {
    var P0 = V(LAYOUT.plaza.x, 0, LAYOUT.plaza.z), dir = door.clone().sub(P0); dir.y = 0;
    var len = dir.length(); dir.normalize();
    var start = P0.clone().add(dir.clone().multiplyScalar(LAYOUT.plaza.r)), side = V(-dir.z, 0, dir.x);
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
  /* ---------------- signs: white pills with dark text ---------------- */
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
  var BUILDERS = { castle: castle, colosseum: colosseum, stall: stall, library: library, stadium: stadium, nestTower: nestTower, pond: pond, windmill: windmill, garden: garden };
  var places = [], hover = null, homes = [];
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
    var s = sign(spec.title); s.position.copy(u.signAt); scene.add(s);
    var size = u.box.getSize(V()), hit = new T3.Mesh(new T3.BoxGeometry(size.x + .5, size.y + .5, size.z + .5), new T3.MeshBasicMaterial({ visible: false }));
    var pl = { id: spec.id, title: spec.title, link: spec.link ? ROOT + spec.link : null, group: u.group, box: u.box, door: u.door, sign: s, y0: u.signAt.y, hot: 0 };
    hit.position.copy(u.box.getCenter(V())); hit.userData.place = pl; scene.add(hit); pl.hit = hit; s.userData.place = pl;
    blockBox(u.box, .6, 'place:' + spec.id); places.push(pl); return pl;
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
    var h = { spec: spec, group: u.group, box: u.box, mon: mon, face: spec.face || 0, door: door };
    homes[spec.team] = h; return h;
  }
  function plazaRing() {
    var t = tex('plaza.jpg', 1.5), m = new T3.Mesh(new T3.CircleGeometry(LAYOUT.plaza.r + .6, 40), mat(0xf4efe4, { map: t }));
    m.rotation.x = -Math.PI / 2; m.position.set(LAYOUT.plaza.x, (groundAt(LAYOUT.plaza.x, LAYOUT.plaza.z) || 0) + .07, LAYOUT.plaza.z); m.receiveShadow = true; scene.add(m);
    blockCircle(LAYOUT.plaza.x, LAYOUT.plaza.z, LAYOUT.plaza.r + .6, 'plaza');
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
    // Treasure Island Goal Bridge: clean sea-level wooden trestle strictly over open water (31.0 -> 40.4)
    var a = V(31.0, 0.20, -10.0), b = V(40.4, 0.20, -12.6), d = b.clone().sub(a), ang = Math.atan2(d.x, d.z), len = d.length();
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
    var targets = places.map(function (p) { return p.sign; }).concat(places.map(function (p) { return p.hit; }));
    if (quietHooks.lighthouseHit) targets.push(quietHooks.lighthouseHit);
    if (window.__home3dNpcHits && window.__home3dNpcHits.length) targets = window.__home3dNpcHits.concat(targets);
    var hits = ray.intersectObjects(targets, false);
    if (!hits.length) return null;
    if (hits[0].object.userData && hits[0].object.userData.npc) return { id: 'npc', npc: hits[0].object.userData.npc };
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
  function resetView() {
    view.yaw = 0; view.pitch = .50; view.zoom = 1; view.panX = 0; view.panZ = 0;
    if (zoomBadge) zoomBadge.textContent = '100%';
    home();
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
    if (flying) return;
    e.preventDefault();
    var factor = e.deltaY > 0 ? 1.14 : 0.86;
    setZoom(view.zoom * factor, e.clientX, e.clientY);
  }, { passive: false });
  canvas.addEventListener('dblclick', function (e) {
    if (flying) return;
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
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 2) {
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
    if (pointers[e.pointerId]) pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 2 && pinchStart) {
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
        drag.moved = true;
        if (drag.isPan || view.zoom < .55) {
          // When zoomed in close, left-drag smoothly pans across the island (right-drag or Shift always pans)
          if (drag.isPan) {
            var ps = 0.095 * view.zoom;
            var sy2 = Math.sin(view.yaw), cy2 = Math.cos(view.yaw);
            view.panX = clamp(drag.panX - (dx * cy2 + dy * sy2) * ps, -48, 48);
            view.panZ = clamp(drag.panZ - (-dx * sy2 + dy * cy2) * ps, -42, 42);
          } else {
            // Orbit + tilt smoothly
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
      if (!d.moved && !d.isPan && e.target === canvas) { var p = placeAt(e); if (p) go(p); }
    }
  });
  addEventListener('pointercancel', function (e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinchStart = null;
    if (drag && drag.id === e.pointerId) drag = null;
  });
  addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === '+' || e.key === '=') setZoom(view.zoom * 0.8);
    else if (e.key === '-' || e.key === '_') setZoom(view.zoom * 1.25);
    else if (e.key === '0') resetView();
  });
  function openPlace(p) {
    if (NOLINKS || !p || !p.link) { flying = false; K.after(1.2, home); return; }
    var m = /index\.html#([a-z0-9-]+)/i.exec(p.link);
    try {
      if (m && window.parent && window.parent !== window && typeof window.parent.switchView === 'function') {
        flying = false;
        window.parent.switchView(m[1]);
        return;
      }
      if (window.top && window.top !== window) {
        window.top.location.href = p.link;
        return;
      }
    } catch (e) {}
    location.href = p.link;
  }
  function go(p, fast) {
    if (!p) return;
    if (p.id === 'npc' && p.npc && p.npc.onTap) {
      p.npc.onTap();
      return;
    }
    if (p.id === 'lighthouse') {
      K.sfx('tap');
      if (window.QuietIsland && window.QuietIsland.togglePanel) window.QuietIsland.togglePanel();
      return;
    }
    if (fast || flying) { K.sfx('tap'); openPlace(p); return; }
    flying = true; hover = p; K.sfx('tap'); K.sfx('whoosh'); K.say(p.title);
    var c = p.box.getCenter(V());
    K.cam.follow = null; K.cam.set(V(c.x + 3, c.y + 10, c.z + 17), V(c.x, c.y + 1.5, c.z), 1.3);
    K.ui.toast('Going to ' + p.title + '…', 1.3, '#9b7bff');
    K.after(1.2, function () { openPlace(p); });
  }

  /* ---------------- camera: frames every place and monster on any screen ---------------- */
  var FIT = { pts: [], look: V(), key: '', d: 100 }, PITCH = .50;
  var SAFE = { x0: -.92, x1: .92, y0: -.74, y1: .84 };   // frames the entire expanded island (windmill to treasure island) with zero cropping
  function fitPoints() {
    var pts = [];
    places.forEach(function (p) { var b = p.box; [b.min.x, b.max.x].forEach(function (x) { [b.min.z, b.max.z].forEach(function (z) { pts.push(V(x, b.min.y, z)); }); }); pts.push(p.sign.position.clone().add(V(0, 1.2, 0))); });
    homes.forEach(function (h) { var c = h.box.getCenter(V()); pts.push(h.mon.clone(), h.mon.clone().add(V(0, 5, 0)), V(c.x, h.box.max.y, c.z), V(c.x, h.box.min.y, c.z)); });
    (LAYOUT.extras || []).forEach(function (e) { if (e.model === 'lighthouse') pts.push(V(e.x + 4.5, 0, e.z), V(e.x, (e.h || 10) + 3, e.z)); });
    var bb = new T3.Box3().setFromPoints(pts); FIT.look = bb.getCenter(V()); FIT.look.y = 0; FIT.pts = pts;
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
    // Landscape/desktop stays exact 30°; portrait phones & tablets gently widen FOV so the entire island stays close, vibrant & uncropped!
    var wantFov = asp < 1.15 ? clamp(30 + (1.15 - asp) * 32, 30, 52) : 30;
    if (Math.abs(K.camera.fov - wantFov) > 0.05) {
      K.camera.fov = wantFov;
      K.camera.updateProjectionMatrix();
      FIT.key = '';
    }
  }
  function fitDistance(yaw) {
    updatePortraitFov();
    var key = K.camera.aspect.toFixed(3) + '/' + K.camera.fov.toFixed(1) + '/' + yaw.toFixed(2);
    if (key === FIT.key) return FIT.d;
    var lo = 20, hi = 420; for (var i = 0; i < 22; i++) { var mid = (lo + hi) / 2; if (fits(mid, yaw)) hi = mid; else lo = mid; }
    FIT.key = key; FIT.d = hi; return hi;
  }
  var curLook = V();
  function home() {
    K.cam.k = 4.2; K.cam.drift = false;
    K.cam.follow = function () {
      parallax.x += (parallax.tx - parallax.x) * 0.045;
      parallax.y += (parallax.ty - parallax.y) * 0.045;
      var pAmt = view.zoom > .65 ? 1 : 0.25;
      var yaw = view.yaw + parallax.x * 0.055 * pAmt;
      var pit = clamp(view.pitch + parallax.y * 0.032 * pAmt, .24, 1.18);
      var baseD = fitDistance(Math.round(clamp(view.yaw, -.6, .6) * 20) / 20) * 1.03;
      var maxD = Math.max(240, baseD * 1.25);
      var d = clamp(baseD * view.zoom, 11, maxD);
      if (scene.fog) {
        scene.fog.near = Math.max(210, d * 1.25);
        scene.fog.far = Math.max(420, d * 2.35);
      }
      var a = yaw + (view.zoom > .85 ? Math.sin(K.now * .06) * .014 : 0);
      curLook.set(FIT.look.x + view.panX, FIT.look.y + (view.zoom < .4 ? 1.4 : 0), FIT.look.z + view.panZ);
      K.cam.tPos.copy(camPos(d, a, pit, curLook));
      K.cam.tLook.copy(curLook);
    };
  }
  /* ---------------- HUD ---------------- */
  var goal = { got: 165, target: 300, demo: true };
  function readGoal() {
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
  var goalEl = null;
  function updateGoalUI(animate) {
    readGoal();
    var pct = clamp(goal.target ? goal.got / goal.target : 0, 0, 1);
    if (goalEl) {
      goalEl.innerHTML = '<span>🌉 ' + (goal.demo ? 'Class goal' : 'Today’s goal') + '</span><div class="bar"><i style="width:' + Math.round(pct * 100) + '%"></i></div><b>' + Math.min(goal.got, goal.target) + ' / ' + goal.target + '</b>';
    }
    buildBridge(pct, !!animate);
  }
  var zoomBadge = null;
  function hud() {
    goalEl = K.ui.add(K.el('div', 'h3-goal'));
    updateGoalUI(false);
    // Tactile 3D Zoom & Reset controls (bottom-right) for Smartboard / Mouse / Touch close-up inspection
    var zBar = K.ui.add(K.el('div', 'h3-zoom-bar'));
    var zIn = K.el('button', 'h3-zbtn h3-zin', '＋'); zIn.title = 'Zoom In (close-up)';
    zoomBadge = K.el('span', 'h3-zpct', '100%');
    var zOut = K.el('button', 'h3-zbtn h3-zout', '－'); zOut.title = 'Zoom Out';
    var zReset = K.el('button', 'h3-zbtn h3-zreset', '🗺️'); zReset.title = 'Reset Full Island View (0)';
    zIn.onclick = function () { setZoom(view.zoom * 0.72); };
    zOut.onclick = function () { setZoom(view.zoom * 1.35); };
    zReset.onclick = function () { resetView(); };
    zBar.appendChild(zIn); zBar.appendChild(zoomBadge); zBar.appendChild(zOut); zBar.appendChild(zReset);
    // Bottom quick bar removed: the 3D buildings are the buttons (add ?bar=1 to bring it back).
    var quick = K.el('div', 'h3-quick');
    if (/[?&]bar=1/.test(location.search)) K.ui.add(quick);
    [['🏰', 'Today', 'today', '#9b7bff'], ['🏛️', 'Class Board', 'board', '#ff5fa2'], ['🛍️', 'Shop', 'shop', '#ffb320'], ['🎮', 'Games', 'games', '#2fc58a'], ['📚', 'Library', 'library', '#4f9dff']].forEach(function (q) {
      var b = K.el('button', 'h3-q', '<i>' + q[0] + '</i><span>' + q[1] + '</span>'); b.style.setProperty('--c', q[3]);
      b.onclick = function () { var p = places.filter(function (x) { return x.id === q[2]; })[0]; if (p) go(p, true); };
      quick.appendChild(b);
    });
    var tb = document.querySelector('.topbtns');
    if (tb) {
      var btns = tb.querySelectorAll('button');
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
        btns[2].textContent = '⚙️';
        btns[2].title = 'Teacher Hub & More';
        btns[2].onclick = function () {
          try {
            if (window.parent && window.parent !== window && typeof window.parent.switchView === 'function') {
              window.parent.switchView('more');
              return;
            }
          } catch (e) {}
          location.href = ROOT + 'index.html#more';
        };
      }
    }
  }

  /* ---------------- boot ---------------- */
  var LAYOUT = null, MODELS = {};
  var loading = K.ui.add(K.el('div', 'loading', '<span>Sailing to Adventure Island…</span>'));
  function glb(path, h, opts) { return K.tryGLB(ROOT + 'assets/3d/' + path).then(function (g) { return g ? K.fitModel(g.scene, h, opts) : null; }); }
  function getJSON(url) { return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  Promise.all([getJSON('layout.json?v=15'), getJSON(ROOT + 'assets/3d/home/models.json')]).then(function (cfg) {
    LAYOUT = cfg[0]; if (!LAYOUT) throw new Error('layout.json is missing');
    MODELS = Array.isArray(cfg[1]) ? cfg[1].reduce(function (o, n) { o[n] = {}; return o; }, {}) : (cfg[1] || {});
    function real(name) { return MODELS[name] ? K.tryGLB(ROOT + 'assets/3d/home/' + name + '.glb') : Promise.resolve(null); }
    var PROP = { fountain: ['world/fountain.glb', 2.6], bench: ['world/bench.glb', 1], carrots: ['world/props/FarmCrate_Carrot.glb', .9], apples: ['world/props/Barrel_Apples.glb', 1.2], crate: ['world/props/Crate_Wooden.glb', 1], barrel: ['world/pirate/Prop_Barrel.glb', 1.1] };
    var propKinds = Object.keys(PROP);
    var extraNames = (LAYOUT.extras || []).map(function (e) { return e.model; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
    LAYOUT._extraNames = extraNames;
    return Promise.all([
      Promise.all(LAYOUT.places.map(function (p) { return real(p.model); })),
      Promise.all(LAYOUT.homes.map(function (h) { return real(h.model); })),
      Promise.all(propKinds.map(function (k) { return glb(PROP[k][0], PROP[k][1]); })),
      Promise.all([glb('world/nature/Flower_3_Group.glb', 1.6), glb('world/nature/Flower_4_Group.glb', 1.7), glb('world/nature/Bush_Common_Flowers.glb', 1.7)]),
      Promise.all([glb('world/pirate/Environment_PalmTree_1.glb', 6), glb('world/pirate/Environment_PalmTree_3.glb', 5.2), glb('world/pirate/Prop_Chest_Gold.glb', 2.2),
        real('ship').then(function (g) { return g ? K.fitModel(g.scene, 10, { byLength: true }) : glb('world/pirate/Ship_Small.glb', 10, { byLength: true }); }), glb('world/pirate/Environment_Dock.glb', 3, { byLength: true })]),
      Promise.all(K.TEAMS.map(function (t) { return K.makeCharacter(t, { monHeight: 5.2 }); })),
      Promise.all([0, 1, 2, 3, 0, 1, 2, 3].map(function (i) { return K.makeCharacter(K.TEAMS[i], { kidsOnly: true, kidHeight: 2.7 }).catch(function () { return null; }); })),
      propKinds,
      Promise.all(extraNames.map(function (n) { return K.tryGLB(ROOT + 'assets/3d/home/' + n + '.glb').then(function (g) { return g ? g.scene : null; }); })),
      K.loadAnimClips ? Promise.all([
        K.loadAnimClips(ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; }),
        K.loadAnimClips(ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; })
      ]).then(function (arr) { return (arr[0] || []).concat(arr[1] || []); }) : Promise.resolve([])
    ]);
  }).then(function (r) {
    var placeModels = r[0], homeModels = r[1], props = {}, flowers = r[3].filter(Boolean), sea = r[4], mons = r[5], kids = r[6], animClips = r[9] || [];
    r[7].forEach(function (k, i) { props[k] = r[2][i]; });
    function put(o, x, y, z, ry) { if (!o) return null; var c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry || 0; scene.add(c); return c; }

    // 1. land  2. buildings  3. plaza, stairs and harbour (they take space first)
    buildIslands();
    LAYOUT.places.forEach(function (p, i) { addPlace(p, placeModels[i]); });
    LAYOUT.homes.forEach(function (h, i) { addHome(h, homeModels[i]); });
    plazaRing(); buildStairs(); buildHarbour();

    // 4. paths from the plaza to every door (golden road: from the windmill island, past the Class Board, up to the castle)
    var byId = {}; places.forEach(function (p) { byId[p.id] = p; });
    var curves = { gold: null, cob: [] };
    var cobMat = mat(0xffffff, { map: texH('cobble.jpg', 1, 1), side: T3.DoubleSide, roughness: .9 });
    var woodMat = mat(0xc98a55, { side: T3.DoubleSide });
    var goldMat = mat(0xe8c882, { roughness: .92, side: T3.DoubleSide });
    var goldEdge = mat(0xd8b56f, { roughness: .94, side: T3.DoubleSide });
    function doorOf(to) {
      if (to === 'harbour') return V(LAYOUT.harbour.door[0], groundAt(LAYOUT.harbour.door[0], LAYOUT.harbour.door[1]) || 0, LAYOUT.harbour.door[1]);
      if (to.indexOf('home:') === 0) return homes[+to.slice(5)].door.clone();
      return byId[to].door.clone();
    }
    LAYOUT.paths.forEach(function (ps) {
      var door = doorOf(ps.to);
      if (ps.kind === 'gold') {
        var ctrl = [V(ps.from[0], 0, ps.from[1])].concat(ps.via.map(function (v) { return V(v[0], 0, v[1]); })).concat([door]);
        var pts = liftPath(sampleCurve(ctrl, .7), door.y);
        ribbonMesh(pts, 3.0, goldEdge, .05);
        curves.gold = buildPath(pts, 2.5, goldMat, null, .08);
      } else {
        var avoid = ps.to.indexOf('home:') === 0 ? ps.to : 'place:' + ps.to;
        curves.cob.push(buildPath(liftPath(routeTo(door, avoid), door.y), 2.3, cobMat, woodMat, .07));
      }
    });

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
      if (e.float) { var y0 = y, ph = Math.random() * 6; K.onFrame(function (dt, t) { if (quietHooks.overrideBalloon && e.model === 'hot-air-balloon') return; g.position.y = y0 + Math.sin(t * .6 + ph) * e.float; g.rotation.y = (e.ry || 0) + Math.sin(t * .2 + ph) * .15; }); }
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
    if (flowers.length) {   // flower clumps along the paths, a few, never on a building or a road
      [curves.gold].concat(curves.cob).forEach(function (cv, ci) {
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

    // 6. Treasure Island, harbour props, ship
    var palm1 = sea[0], palm3 = sea[1], chest = sea[2], ship = sea[3], dock = sea[4];
    put(palm1, TI.x + 2.8, .1, TI.z - 1.6, .4); put(palm3 || palm1, TI.x - 3.2, .1, TI.z - 1, 2);
    if (chest) { chest.rotation.y = -.4; chestGroup.add(chest); K.onFrame(function (dt, t) { chest.position.y = Math.abs(Math.sin(t * 1.5)) * .12; }); }
    for (var s2 = 0; s2 < 3; s2++) add(new T3.Mesh(new T3.CylinderGeometry(.35, .35, .08, 5), mat(0xff8a5c)), TI.x + rnd(-3, 3), .18, TI.z + rnd(1, 2.5));
    addPlace({ id: 'island', title: 'Treasure Island', link: 'island/index.html?demo=1', x: TI.x, z: TI.z, group: chestGroup }, null);
    // Engineered Front Sandy Beach Pier: starts RIGHT AT the water's edge (9.5, 24.6) cleanly over open turquoise sea
    buildTimberPier(9.5, 0.08, 24.6, 11.5, 0.08, 30.2, 2.9, 8);
    // Cute wooden rowboat floating cleanly in 100% open water clear of all pier posts
    (function rowboat() {
      var rb = new T3.Group(), hullM = mat(0xb86f36, { roughness: .84 }), trimM = mat(0xe0a464, { roughness: .82 });
      var hull = new T3.Mesh(new T3.SphereGeometry(1.15, 16, 10, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52), hullM);
      hull.scale.set(0.85, 0.72, 1.75); hull.castShadow = true; rb.add(hull);
      var rim = new T3.Mesh(new T3.TorusGeometry(0.96, 0.11, 8, 22), trimM);
      rim.rotation.x = Math.PI / 2; rim.scale.set(0.85, 1.75, 1); rb.add(rim);
      var seat = new T3.Mesh(new T3.BoxGeometry(1.3, 0.12, 0.36), trimM);
      seat.position.set(0, -0.18, 0); rb.add(seat);
      rb.position.set(6.6, -1.15, 29.6); rb.rotation.y = 0.78;
      scene.add(rb);
      K.onFrame(function (dt, t) { rb.position.y = -1.15 + Math.sin(t * 1.4 + 1) * .12; rb.rotation.z = Math.sin(t * 1.1) * .06; });
    })();
    // Pirate Ship sailing smoothly left & right along the verified 0-hit front turquoise sea channel + gentle foam wake!
    if (ship) {
      var shipPhase = 0.44;   // starts right in front of the sandy cove
      var wakeGeo = new T3.RingGeometry(0.45, 0.95, 16); wakeGeo.rotateX(-Math.PI / 2);
      var wakes = [], wakeT = 0;
      function shipCurvePos(ph) {
        var s = Math.sin(ph);
        var x = s * 42.0;
        var z = 35.5 - s * s * 9.5 + Math.cos(ph) * 2.2;
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
      if (kIdx < 10) {
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
      K.onFrame(function (dt) { m.update(dt); });
      K.after(1 + i * .6, function () { m.setState('hello'); K.after(1.6, function () { m.setState('idle'); }); });
    });
    K.onFrame(function (dt) { if (quietHooks.overrideMons) return; if (Math.random() < dt * .3) { var m = mons[(Math.random() * 4) | 0]; if (m && m.state === 'idle') { m.setState(Math.random() < .5 ? 'hop' : 'wave'); K.after(1.4, function () { if (!quietHooks.overrideMons) m.setState('idle'); }); } } });
    // 7b. Smart Animal-Crossing-style AI NPCs (walk, visit POIs, chat with each other, greet monsters & react to clicks)
    var allCurves = [curves.gold].concat(curves.cob).filter(Boolean);
    var kidStates = [];
    var npcHits = [];
    window.__home3dNpcHits = npcHits;

    function lerpAngle(a, b, t) {
      var d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      return a + d * clamp(t, 0, 1);
    }
    function showNpcBubble() { /* Speech bubbles removed per teacher preference — keep pure 3D body language */ }

    kids.forEach(function (k, i) {
      var road = allCurves[i % allCurves.length];
      if (!k || !road) return;
      scene.add(k.root);
      if (k.attachClips && animClips) k.attachClips(animClips);
      k.speed = 0;
      k.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .22; }); });

      // Invisible tap hitbox on each kid so clicking/tapping makes them greet you!
      var hit = new T3.Mesh(new T3.CylinderGeometry(.9, .9, 2.8, 8), new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.position.y = 1.4;
      k.root.add(hit);

      var u0 = clamp(0.12 + (i * 0.11) % 0.76, 0.08, 0.92);
      var p0 = road.getPointAt(u0);
      var laneOff = (i % 2 ? 0.55 : -0.55);
      k.root.position.set(p0.x + laneOff, p0.y + .06, p0.z);

      var ks = {
        idx: i, k: k, road: road, u: u0, dir: i % 2 ? -1 : 1,
        targetU: i % 2 ? 0.10 : 0.90,
        walkSpd: rnd(2.1, 2.75),   // natural walking speed matched to animation
        off: laneOff,
        state: (i % 3 === 0) ? 'visit' : 'walk',
        timer: (i % 3 === 0) ? rnd(1.5, 3.5) : 0,
        targetYaw: 0,
        chatCd: rnd(3, 8),
        partner: null,
        bubble: null,
        bubbleT: 0,
        onTap: function () {
          ks.state = 'greet';
          ks.timer = 2.6;
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
    });

    function pickNextDestination(ks) {
      // Occasionally switch to another connected road near the central plaza
      if (Math.random() < 0.45 && allCurves.length > 1) {
        var curP = ks.k.root.position;
        var near = allCurves.filter(function (cv) {
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
      kidStates.forEach(function (ks) {
        var k = ks.k;
        k.update(dt);
        if (ks.bubble) {
          ks.bubbleT -= dt;
          ks.bubble.position.y = 3.35 + Math.sin(t * 3.5 + ks.idx) * 0.12;
          if (ks.bubbleT <= 0) { k.root.remove(ks.bubble); ks.bubble = null; }
        }
        if (quietHooks.overrideKids) return;
        if (ks.chatCd > 0) ks.chatCd -= dt;

        if (ks.state === 'greet') {
          // Turn smoothly toward the camera and wave happily
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
          // Arrived at POI! Pause, look at nearest building/monster, and react naturally
          ks.u = ks.targetU;
          ks.state = 'visit';
          ks.timer = rnd(2.8, 5.4);
          var act = Math.random();
          k.setState(act < 0.45 ? 'idle' : (act < 0.8 ? 'wave' : 'cheer'));
          if (k.mixer) k.mixer.timeScale = 1.0;
          // Face the nearest interesting landmark or monster
          var bestD = 999, bestLook = null, nearMon = null;
          mons.forEach(function (m) {
            if (!m) return;
            var d = m.root.position.distanceTo(k.root.position);
            if (d < bestD) { bestD = d; bestLook = m.root.position; nearMon = m; }
          });
          places.forEach(function (pl) {
            if (!pl || !pl.box) return;
            var pc = pl.box.getCenter(V()), d = pc.distanceTo(k.root.position);
            if (d < bestD) { bestD = d; bestLook = pc; nearMon = null; }
          });
          if (bestLook) ks.targetYaw = Math.atan2(bestLook.x - k.root.position.x, bestLook.z - k.root.position.z);
          if (nearMon && bestD < 10 && !quietHooks.overrideMons) {
            nearMon.setState('wave');
            K.after(1.6, function () { if (!quietHooks.overrideMons) nearMon.setState('idle'); });
          }
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

        // Social NPC-to-NPC chat detection!
        if (ks.chatCd <= 0) {
          for (var j = 0; j < kidStates.length; j++) {
            var other = kidStates[j];
            if (other === ks || other.state !== 'walk' || other.chatCd > 0) continue;
            if (other.k.root.position.distanceTo(k.root.position) < 3.1) {
              ks.state = 'chat'; other.state = 'chat';
              ks.partner = other; other.partner = ks;
              var cdur = rnd(3.0, 4.4);
              ks.timer = cdur; other.timer = cdur;
              k.setState('wave'); other.k.setState('cheer');
              if (k.mixer) k.mixer.timeScale = 1.0;
              if (other.k.mixer) other.k.mixer.timeScale = 1.0;
              break;
            }
          }
        }
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
      places.concat(homes).forEach(function (o) { if (o && o.id !== 'island') placeContactShadow(o.box); });
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
        if (!o || !o.box || o.id === 'island') return;
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
      // Organic small border stones along all cobblestone paths to soften straight edges
      (curves.cob || []).forEach(function (cv) {
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
        K.onFrame(function (dt) { rotor.rotation.z -= dt * 0.75; });
      }
    })();

    // 8. shadows cover just the island, camera frames everything
    var all = new T3.Box3(); places.concat(homes).forEach(function (o) { if (o && o.box) all.union(o.box); });
    var sz = all.getSize(V()), ce = all.getCenter(V()), half = Math.max(sz.x, sz.z) * .64;
    sun.target.position.set(ce.x, 0, ce.z); sun.position.set(ce.x - 48, 46, ce.z + 38);
    sc.left = -half; sc.right = half; sc.top = half * .8; sc.bottom = -half * .8; sc.updateProjectionMatrix();
    fitPoints();
    readGoal(); loading.remove(); K.ui.topButtons(); hud(); home(); K.cam.snap();
    buildBridge(clamp(goal.got / (goal.target || 1), 0, 1), true);
    window.__home3d = { places: places.map(function (p) { return p.id; }), goal: goal, groundAt: groundAt, free: free,
      go: function (id, fast) { var p = places.filter(function (x) { return x.id === id; })[0]; if (p) go(p, !!fast); },
      refreshGoal: function () { updateGoalUI(true); },
      overlaps: function () {   // test helper: buildings that overlap each other
        var out = [], all2 = places.filter(function (p) { return p.id !== 'island'; }).map(function (p) { return [p.id, p.box]; }).concat(homes.map(function (h, i) { return ['home' + i, h.box]; }));
        all2.forEach(function (a, i) { all2.slice(i + 1).forEach(function (b) { var A = a[1], B = b[1]; if (A.min.x < B.max.x && A.max.x > B.min.x && A.min.z < B.max.z && A.max.z > B.min.z) out.push(a[0] + '×' + b[0]); }); });
        return out;
      } };
    window.__home3dQuietHost = {
      K: K, T3: T3, scene: scene, seaU: seaU, seaMesh: seaMesh, hemiLight: hemiLight, sun: sun,
      cloudCv: window.__home3dCloudCv, places: places, homes: homes, mons: mons, kids: kids,
      kidStates: kidStates, extrasByModel: extrasByModel, curves: curves, DOCK: DOCK, TI: TI,
      groundAt: groundAt, quietHooks: quietHooks, layout: LAYOUT, ship: ship, home: home,
      animClips: animClips
    };
    window.dispatchEvent(new CustomEvent('home3d:ready'));
    K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
