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
  K.init({ fov: 30, fog: 0xdff4ff, fogNear: 125, fogFar: 290 });   // soft haze in the distance
  var scene = K.scene, ROOT = '../';
  var NOLINKS = K.Q.has('nolinks') || K.DEMO;
  var mat = function (c, o) { return new T3.MeshStandardMaterial(Object.assign({ color: c, roughness: .82, metalness: 0, envMapIntensity: .4 }, o || {})); };
  var R3 = K.renderer; R3.toneMapping = T3.NoToneMapping;   // ACES film tone made every colour pale; the painting has strong, clean colours
  R3.shadowMap.type = T3.PCFSoftShadowMap;
  (function envLight() {   // soft light from all round the sky (blue above, warm green below)
    var es = new T3.Scene(), sm = new T3.ShaderMaterial({ side: T3.BackSide, vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec3 p; void main(){ float h = normalize(p).y; vec3 c = h > 0. ? mix(vec3(1.0,.97,.9), vec3(.55,.78,1.), pow(h,.6)) : mix(vec3(1.0,.97,.9), vec3(.55,.75,.45), pow(-h,.5)); gl_FragColor = vec4(c,1.); }' });
    es.add(new T3.Mesh(new T3.SphereGeometry(10, 32, 16), sm));
    var pm = new T3.PMREMGenerator(R3); scene.environment = pm.fromScene(es, .02).texture; pm.dispose();
  })();
  function add(m, x, y, z, parent) { m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
  var TL = new T3.TextureLoader();
  function texH(file, rx, ry) { var t = TL.load(ROOT + 'assets/3d/home/tex/' + file); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rx, ry == null ? rx : ry); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 8; return t; }   // Gemini's painted textures
  function tex(file, rep) { var t = TL.load(ROOT + 'games/world/art/' + file); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t; }

  /* ---------------- sky, light, sea ---------------- */
  K.world.sky(0x5ab8ff, 0xaee0ff, 0xe8f8ff);
  scene.add(new T3.HemisphereLight(0xeaf6ff, 0x9ad08a, .3));
  var sun = new T3.DirectionalLight(0xfff0d8, 2.4);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);   // sharp enough: the shadow camera is fitted to the island after loading
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .03;
  var sc = sun.shadow.camera; sc.left = -62; sc.right = 62; sc.top = 46; sc.bottom = -46; sc.near = 1; sc.far = 200;
  sun.position.set(-34, 70, 46); sun.target.position.set(4, 0, 0); scene.add(sun); scene.add(sun.target);

  // Sea: sunny cartoon adventure-park water matching docs/design/home-world.jpg:
  // exact analytical distance to every island's coastline (no spiky polygon rings),
  // creamy breathing shore foam, warm aqua shallows, bright tropical turquoise water, and soft painterly swells.
  var seaU = { uT: { value: 0 }, uIsl: { value: [] }, uIslW: { value: [] }, uN: { value: 0 } };
  for (var si = 0; si < 10; si++) {
    seaU.uIsl.value.push(new T3.Vector4(0, 0, 1, 1));
    seaU.uIslW.value.push(new T3.Vector4(0, 0, 0, 0));
  }
  (function sea() {
    var m = new T3.Mesh(new T3.PlaneGeometry(900, 900, 1, 1), new T3.ShaderMaterial({
      uniforms: seaU,
      vertexShader: 'varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: [
        'uniform float uT; uniform vec4 uIsl[10]; uniform vec4 uIslW[10]; uniform int uN; varying vec2 vW;',
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
        // Soft painterly water palette matching docs/design/home-world.jpg
        '  vec3 shal = mix(vec3(0.45, 0.89, 0.85), vec3(0.68, 0.92, 0.82), sandNear * 0.65);',
        '  vec3 turq = vec3(0.24, 0.75, 0.85);',
        '  vec3 mid  = vec3(0.17, 0.66, 0.79);',
        '  vec3 deep = vec3(0.14, 0.58, 0.74);',
        '  vec3 c = mix(shal, turq, smoothstep(0.0, 4.8, dist));',
        '  c = mix(c, mid,  smoothstep(4.0, 18.0, dist));',
        '  c = mix(c, deep, smoothstep(16.0, 62.0, dist));',
        // Broad, calm horizontal water swells (stretched along X like the painting)
        '  vec2 sp = vec2(vW.x * 0.038 + uT * 0.025, vW.y * 0.11 - uT * 0.035);',
        '  float swell = fbm(sp);',
        '  c += vec3(0.05, 0.08, 0.08) * (swell - 0.5);',
        // Soft sunlit horizontal wave ribbons
        '  float rib = fbm(vec2(vW.x * 0.08 - uT * 0.04, vW.y * 0.26 + sin(vW.x * 0.07) * 0.25));',
        '  float streak = smoothstep(0.64, 0.78, rib) * (1.0 - smoothstep(18.0, 85.0, dist));',
        '  c = mix(c, vec3(0.56, 0.90, 0.94), streak * 0.16);',
        // Gentle breathing shoreline foam & second coastal ripple ring
        '  float wave = sin(uT * 1.35 + vW.x * 0.22 + vW.y * 0.18) * 0.22;',
        '  float dW = dist + wave;',
        '  float foam1 = 1.0 - smoothstep(0.15, 1.15, dW);',
        '  float foam2 = smoothstep(1.45, 2.0, dW) * (1.0 - smoothstep(2.0, 2.65, dW));',
        '  c = mix(c, vec3(0.91, 0.99, 0.98), foam1 * 0.72);',
        '  c = mix(c, vec3(0.76, 0.96, 0.95), foam2 * 0.28);',
        // Soft distance horizon blend
        '  float farHaze = smoothstep(75.0, 210.0, length(vW));',
        '  c = mix(c, vec3(0.68, 0.89, 0.98), farHaze * 0.65);',
        '  gl_FragColor = vec4(c, 1.0);',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n')
    }));
    m.rotation.x = -Math.PI / 2; m.position.y = -1.6; scene.add(m);
    K.onFrame(function (dt, tt) { seaU.uT.value = tt; });
  })();

  // Clouds: soft, pillowy 3D storybook cumulus clouds framing the four corners like docs/design/home-world.jpg
  (function clouds() {
    var cv = document.createElement('canvas'); cv.className = 'h3-cloudcv'; var uiEl = document.getElementById('ui'); if (uiEl) uiEl.parentNode.insertBefore(cv, uiEl); else document.body.appendChild(cv);
    var off = document.createElement('canvas');
    // Corner and margin cloud banks framing the island without covering any building or Treasure Island
    var SPOTS = [
      [-.01, .04, .17], [.13, -.03, .12], [-.03, .19, .13],
      [-.02, .98, .19], [.14, 1.04, .135], [-.04, .82, .12],
      [.98, .98, .19], [.83, 1.04, .14], [1.02, .81, .125],
      [.99, .04, .14], [.87, -.03, .105]
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
      var W = innerWidth, H = innerHeight, d = Math.min(devicePixelRatio || 1, 2);
      if (W < 2 || H < 2) return;
      cv.width = W * d; cv.height = H * d; var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, H);
      var base = Math.max(W, H * 1.35);
      SPOTS.forEach(function (sp, i) { cloud(c, sp[0] * W, sp[1] * H, sp[2] * base * .48, i + 1, W, H, d); });
    }
    draw(); addEventListener('resize', draw);
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
    var top = kind === 'sand' ? mat(0xfff0c8, { map: sandTex }) : mat(0x8fd862, { map: grassTex, roughness: .95 });
    var m = new T3.Mesh(g, [top, kind === 'sand' ? mat(0xe6c48a, { map: cliffSand }) : mat(0xffffff, { map: cliffTex, roughness: .95 })]);
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

  /* ---------------- trees: bright cone pines, all drawn in one go ---------------- */
  function buildPines(spots) {
    if (!spots.length) return;
    var parts = [new T3.CylinderGeometry(.25, .32, 1.3, 8).translate(0, .65, 0)];
    for (var i = 0; i < 3; i++) parts.push(new T3.ConeGeometry(1.5 - i * .38, 2 - i * .3, 10).translate(0, 1.6 + i * 1.05, 0));
    var cols = [0x45b552, 0x56c45f, 0x3ea64c], m4 = new T3.Matrix4(), q = new T3.Quaternion(), c = new T3.Color();
    parts.forEach(function (geo, pi) {
      var im = new T3.InstancedMesh(geo, mat(0xffffff), spots.length); im.castShadow = true; im.receiveShadow = true;
      spots.forEach(function (s, k) {
        q.setFromAxisAngle(V(0, 1, 0), s.ry); m4.compose(V(s.x, s.y, s.z), q, V(s.s, s.s, s.s)); im.setMatrixAt(k, m4);
        im.setColorAt(k, c.set(pi === 0 ? 0x9a6a42 : cols[s.c]));
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
      model.traverse(function (o) { if (o.isMesh) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .35; mm.metalness = 0; }); });
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

  /* ---------------- harbour, bridge and Treasure Island ---------------- */
  var TI, DOCK, chestGroup, chestLight, PLANKS = 14, planks = [];
  function buildHarbour() {
    TI = LAYOUT.treasure; DOCK = LAYOUT.harbour;
    chestGroup = new T3.Group(); chestGroup.position.set(TI.x + .5, .15, TI.z); scene.add(chestGroup);
    chestLight = new T3.PointLight(0xffd84a, 0, 16); chestLight.position.set(0, 2.5, 0); chestGroup.add(chestLight);
    var a = V(26.5, 0, -4), b = V(TI.x - 6.5, 0, TI.z + 3), d = b.clone().sub(a), ang = Math.atan2(d.x, d.z), len = d.length();
    var wood = mat(0xd49a5c), ghostM = new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, depthWrite: false });
    for (var i = 0; i < PLANKS; i++) {
      var p = a.clone().lerp(b, (i + .5) / PLANKS), y = -.3 + Math.sin((i + .5) / PLANKS * Math.PI) * 1.1;
      var m = new T3.Mesh(new T3.BoxGeometry(2.6, .25, len / PLANKS * .8), wood); m.position.set(p.x, y, p.z); m.rotation.y = ang; m.castShadow = true; m.visible = false; scene.add(m);
      var gh = new T3.Mesh(new T3.BoxGeometry(2.6, .12, len / PLANKS * .8), ghostM); gh.position.set(p.x, y - .05, p.z); gh.rotation.y = ang; scene.add(gh);
      planks.push({ m: m, ghost: gh, shown: false });
    }
    K.onFrame(function (dt, t) { ghostM.opacity = .4 + .2 * Math.sin(t * 2.5); });
    blockBox({ min: V(DOCK.x - 1.5, 0, DOCK.z - 2), max: V(DOCK.x + 9, 0, DOCK.z + 10) }, 0, 'harbour');
  }
  function buildBridge(pct, animate) {
    var n = Math.round(pct * PLANKS);
    planks.forEach(function (p, i) {
      if (i >= n || p.shown) return; p.shown = true;
      var show = function () { p.m.visible = true; p.ghost.visible = false; K.fx.puff(p.m.position.clone().add(V(0, .4, 0)), 3, { size: .6 }); };
      if (animate) K.after(1 + i * .16, show); else show();
    });
    if (n >= PLANKS) K.after(animate ? 1.3 + PLANKS * .16 : 0, function () { chestLight.intensity = 4; K.fx.confetti(V(TI.x, 4, TI.z), 120); });
  }

  /* ---------------- interaction ---------------- */
  K.onFrame(function (dt, t) {
    places.forEach(function (p, i) {
      p.hot = K.lerp(p.hot, p === hover ? 1 : 0, dt * 8);
      // Names appear only on hover / tap (and for the first few seconds, or always with ?names=1).
      var intro = SHOW_NAMES ? 1 : Math.max(0, Math.min(1, 4.5 - (performance.now() - NAMES_T0) / 1000));
      p.sign.material.opacity = Math.max(p.hot, intro);
      p.sign.position.y = p.y0 + Math.sin(t * 1.5 + i) * .15 + p.hot * .4;
      var s = 1 + p.hot * .15; p.sign.scale.set(p.sign.userData.sx * s, p.sign.userData.sy * s, 1);
    });
  });
  var SHOW_NAMES = /[?&]names=1/.test(location.search), NAMES_T0 = performance.now();
  var ray = new T3.Raycaster(), mouse = new T3.Vector2(), flying = false, canvas = K.renderer.domElement;
  function placeAt(e) {
    var r = canvas.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(mouse, K.camera);
    var hits = ray.intersectObjects(places.map(function (p) { return p.sign; }).concat(places.map(function (p) { return p.hit; })), false);
    return hits.length ? hits[0].object.userData.place : null;
  }
  var drag = null, view = { yaw: 0 };
  var soundsOn = false;
  function startSound() { if (soundsOn || K.CAPTURE) return; soundsOn = true; K.audio(); K.loadSounds(['tap', 'whoosh']); }   // waves (sfx/crowd.mp3) loop quietly after the first tap
  addEventListener('pointerdown', startSound, true);
  canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, yaw: view.yaw, moved: false }; });
  canvas.addEventListener('pointermove', function (e) {
    if (drag && Math.abs(e.clientX - drag.x) > 6) { drag.moved = true; view.yaw = clamp(drag.yaw - (e.clientX - drag.x) / innerWidth * 1.4, -.6, .6); }
    if (!drag) { hover = placeAt(e); canvas.style.cursor = hover ? 'pointer' : 'grab'; }
  });
  addEventListener('pointerup', function (e) { var d = drag; drag = null; if (d && !d.moved && e.target === canvas) { var p = placeAt(e); if (p) go(p); } });
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
    if (fast || flying) { K.sfx('tap'); openPlace(p); return; }
    flying = true; hover = p; K.sfx('tap'); K.sfx('whoosh'); K.say(p.title);
    var c = p.box.getCenter(V());
    K.cam.follow = null; K.cam.set(V(c.x + 3, c.y + 10, c.z + 17), V(c.x, c.y + 1.5, c.z), 1.3);
    K.ui.toast('Going to ' + p.title + '…', 1.3, '#9b7bff');
    K.after(1.2, function () { openPlace(p); });
  }

  /* ---------------- camera: frames every place and monster on any screen ---------------- */
  var FIT = { pts: [], look: V(), key: '', d: 100 }, PITCH = .66;
  var SAFE = { x0: -.95, x1: .95, y0: -.66, y1: .84 };   // room left for the top pills and the bottom button bar
  function fitPoints() {
    var pts = [];
    places.forEach(function (p) { var b = p.box; [b.min.x, b.max.x].forEach(function (x) { [b.min.z, b.max.z].forEach(function (z) { pts.push(V(x, b.min.y, z)); }); }); pts.push(p.sign.position.clone().add(V(0, 1.2, 0))); });
    homes.forEach(function (h) { var c = h.box.getCenter(V()); pts.push(h.mon.clone(), h.mon.clone().add(V(0, 5, 0)), V(c.x, h.box.max.y, c.z), V(c.x, h.box.min.y, c.z)); });
    var bb = new T3.Box3().setFromPoints(pts); FIT.look = bb.getCenter(V()); FIT.look.y = 0; FIT.pts = pts;
  }
  var tmpCam = new T3.PerspectiveCamera();
  function camPos(d, yaw) { return V(FIT.look.x + Math.sin(yaw) * Math.cos(PITCH) * d, FIT.look.y + Math.sin(PITCH) * d, FIT.look.z + Math.cos(yaw) * Math.cos(PITCH) * d); }
  function fits(d, yaw) {
    tmpCam.copy(K.camera); tmpCam.position.copy(camPos(d, yaw)); tmpCam.lookAt(FIT.look); tmpCam.updateMatrixWorld(true); tmpCam.updateProjectionMatrix();
    return FIT.pts.every(function (p) { var v = p.clone().project(tmpCam); return v.x > SAFE.x0 && v.x < SAFE.x1 && v.y > SAFE.y0 && v.y < SAFE.y1 && v.z < 1; });
  }
  function fitDistance(yaw) {
    var key = K.camera.aspect.toFixed(3) + '/' + yaw.toFixed(2);
    if (key === FIT.key) return FIT.d;
    var lo = 20, hi = 320; for (var i = 0; i < 22; i++) { var mid = (lo + hi) / 2; if (fits(mid, yaw)) hi = mid; else lo = mid; }
    FIT.key = key; FIT.d = hi; return hi;
  }
  function home() {
    K.cam.k = 1.3; K.cam.drift = false;
    K.cam.follow = function () {
      var yaw = view.yaw, d = fitDistance(Math.round(yaw * 20) / 20) * 1.02, a = yaw + Math.sin(K.now * .06) * .02;
      K.cam.tPos.copy(camPos(d, a)); K.cam.tLook.copy(FIT.look);
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
  function hud() {
    K.ui.add(K.el('div', 'h3-title', 'English Adventure Academy'));
    goalEl = K.ui.add(K.el('div', 'h3-goal'));
    updateGoalUI(false);
    var teams = K.ui.add(K.el('div', 'h3-teams'));
    K.TEAMS.forEach(function (t) {
      var b = K.el('span', 'h3-team', '<img src="' + ROOT + 'monster-evolution/assets/' + t.mon + '_stage_baby.webp" alt="">' + t.name);
      b.style.setProperty('--c', t.c); teams.appendChild(b);
    });
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
        btns[1].onclick = function () {
          var doc = (window.top && window.top.document) || document;
          if (!doc.fullscreenElement) { if (doc.documentElement.requestFullscreen) doc.documentElement.requestFullscreen(); }
          else if (doc.exitFullscreen) doc.exitFullscreen();
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
  Promise.all([getJSON('layout.json'), getJSON(ROOT + 'assets/3d/home/models.json')]).then(function (cfg) {
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
      Promise.all([0, 1, 2, 3].map(function (i) { return K.makeCharacter(K.TEAMS[i], { kidsOnly: true, kidHeight: 2.7 }).catch(function () { return null; }); })),
      propKinds,
      Promise.all(extraNames.map(function (n) { return K.tryGLB(ROOT + 'assets/3d/home/' + n + '.glb').then(function (g) { return g ? g.scene : null; }); }))
    ]);
  }).then(function (r) {
    var placeModels = r[0], homeModels = r[1], props = {}, flowers = r[3].filter(Boolean), sea = r[4], mons = r[5], kids = r[6];
    r[7].forEach(function (k, i) { props[k] = r[2][i]; });
    function put(o, x, y, z, ry) { if (!o) return null; var c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry || 0; scene.add(c); return c; }

    // 1. land  2. buildings  3. plaza and harbour (they take space first)
    buildIslands();
    LAYOUT.places.forEach(function (p, i) { addPlace(p, placeModels[i]); });
    LAYOUT.homes.forEach(function (h, i) { addHome(h, homeModels[i]); });
    plazaRing(); buildHarbour();

    // 4. paths from the plaza to every door (golden road: from the windmill island, past the Class Board, up to the castle)
    var byId = {}; places.forEach(function (p) { byId[p.id] = p; });
    var curves = { gold: null, cob: [] };
    var cobMat = mat(0xffffff, { map: texH('cobble.jpg', 1, 1), side: T3.DoubleSide, roughness: .9 });
    var woodMat = mat(0xc98a55, { side: T3.DoubleSide });
    var goldMat = mat(0xffffff, { map: texH('gold-road.jpg', 1, 1), emissive: 0xffb320, emissiveIntensity: .22, side: T3.DoubleSide });
    var goldEdge = mat(0xfff1b0, { emissive: 0xffe08a, emissiveIntensity: .3, side: T3.DoubleSide });
    K.onFrame(function (dt, t) { goldMat.emissiveIntensity = .2 + .08 * Math.sin(t * 1.6); });   // the golden road glows softly
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
        ribbonMesh(pts, 3.4, goldEdge, .05);
        curves.gold = buildPath(pts, 2.6, goldMat, null, .09);
        var pg = new T3.SphereGeometry(.26, 8, 6), n = 0, edge = [];
        for (var i = 0; i < pts.length; i++) { var q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)], tg = q.clone().sub(o); tg.y = 0; tg.normalize(); [-1, 1].forEach(function (sd) { edge.push(V(pts[i].x - tg.z * 1.85 * sd, pts[i].y + .12, pts[i].z + tg.x * 1.85 * sd)); }); }
        var pm = new T3.InstancedMesh(pg, mat(0xf3ead8), edge.length), m4 = new T3.Matrix4();
        edge.forEach(function (e) { m4.makeScale(1, .55, 1).setPosition(e.x, e.y, e.z); pm.setMatrixAt(n++, m4); }); scene.add(pm);
      } else {
        var avoid = ps.to.indexOf('home:') === 0 ? ps.to : 'place:' + ps.to;
        curves.cob.push(buildPath(liftPath(routeTo(door, avoid), door.y), 2.3, cobMat, woodMat, .07));
      }
    });

    // 5a. extra Tripo pieces from layout.extras (they take space before props and trees)
    var extraSrc = {}; (LAYOUT._extraNames || []).forEach(function (n, i) { extraSrc[n] = r[8] && r[8][i]; });
    (LAYOUT.extras || []).forEach(function (e) {
      var src = extraSrc[e.model]; if (!src) return;
      var g0 = groundAt(e.x, e.z), y = e.y != null ? e.y : (g0 === null ? 0 : g0);
      var c = K.fitModel(src.clone(true), e.h, { byLength: !!e.byLength }), g = new T3.Group();
      g.add(c); g.position.set(e.x, y, e.z); g.rotation.y = e.ry || 0; scene.add(g);
      if (e.float) { var y0 = y, ph = Math.random() * 6; K.onFrame(function (dt, t) { g.position.y = y0 + Math.sin(t * .6 + ph) * e.float; g.rotation.y = (e.ry || 0) + Math.sin(t * .2 + ph) * .15; }); }
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
    if (dock) for (var d2 = 0; d2 < 4; d2++) put(dock, DOCK.x + d2 * 2.6, -.4, DOCK.z, Math.PI / 2);
    if (ship) {
      ship.position.set(DOCK.x + 6, -1.6, DOCK.z + 5); ship.rotation.y = Math.PI * .5; scene.add(ship);
      K.onFrame(function (dt, t) { ship.position.y = -1.6 + Math.sin(t * 1.1) * .15; ship.rotation.z = Math.sin(t * .9) * .035; });
    }

    // 7. monsters at their homes, children on the roads
    mons.forEach(function (m, i) {
      var h = homes[i]; if (!h) return;
      m.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .25; }); });
      m.root.position.copy(h.mon); m.root.rotation.y = h.face; scene.add(m.root);
      K.onFrame(function (dt) { m.update(dt); });
      K.after(1 + i * .6, function () { m.setState('hello'); K.after(1.6, function () { m.setState('idle'); }); });
    });
    K.onFrame(function (dt) { if (Math.random() < dt * .3) { var m = mons[(Math.random() * 4) | 0]; if (m && m.state === 'idle') { m.setState(Math.random() < .5 ? 'hop' : 'wave'); K.after(1.4, function () { m.setState('idle'); }); } } });
    var roads = [curves.gold, curves.gold, curves.cob[0], curves.cob[1]];
    kids.forEach(function (k, i) {
      var road = roads[i]; if (!k || !road) return; scene.add(k.root); k.speed = 0; k.setState('run');
      k.root.traverse(function (o) { if (o.isMesh && o.material) [].concat(o.material).forEach(function (mm) { mm.envMapIntensity = .2; }); });
      var u = [.12, .5, .25, .5][i], dir = i % 2 ? -1 : 1, spd = 1.2 / road.getLength(), off = [.5, -.5, 0, 0][i];
      K.onFrame(function (dt) {
        k.update(dt); u += dir * spd * dt; if (u > .96 || u < .04) { dir = -dir; u = clamp(u, .04, .96); }
        var p = road.getPointAt(u), tg = road.getTangentAt(u).multiplyScalar(dir);
        k.root.position.set(p.x + off, p.y + .08, p.z); k.root.rotation.y = Math.atan2(tg.x, tg.z);
      });
    });

    // 8. shadows cover just the island, camera frames everything
    var all = new T3.Box3(); places.concat(homes).forEach(function (o) { if (o && o.box) all.union(o.box); });
    var sz = all.getSize(V()), ce = all.getCenter(V()), half = Math.max(sz.x, sz.z) * .62;
    sun.target.position.set(ce.x, 0, ce.z); sun.position.set(ce.x - 34, 70, ce.z + 46);
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
    K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
