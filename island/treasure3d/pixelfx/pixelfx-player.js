/* island/treasure3d/pixelfx/pixelfx-player.js
 * High-Performance 60 FPS PixelFX Flipbook Engine (3D World Billboards + 2D HUD Celebrations)
 * Powered by MIT-licensed patch-gg/pixelfx sprite sheets (see treasure3d/pixelfx/LICENSE.txt).
 *
 * Architecture:
 * - Zero runtime Canvas2D per-frame drawing for 3D effects: each WebP sheet uploads to GPU ONCE
 *   with THREE.NearestFilter + SRGBColorSpace.
 * - Custom lightweight GLSL flipbook billboard shader supports:
 *   1) Cylindrical Y-axis upright billboards (campfires, waterfalls, splashes, dirt bursts, loot beams)
 *   2) Spherical camera-aligned billboards (butterflies, sparkles, fireworks, exclamations, haste)
 *   3) Horizontal water-plane decals (lagoon & bay fish schools)
 *   4) Non-distorting bottom UV crop (`cropBottom`) so flames/beams sit cleanly on 3D GLB props
 *   5) Normal & Additive blending modes + pooled zero-GC one-shot emitters
 * - Crisp `imageSmoothingEnabled = false` 2D HUD overlay (`#ti-pfx-hud`) for `quest-complete` & `confetti`.
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  var VERT_SHADER = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var FRAG_SHADER = [
    'uniform sampler2D uSheet;',
    'uniform vec4 uFrameRect;',   // x = u0, y = vBot, z = uSpan, w = vSpan
    'uniform float uCropBottom;', // 0..0.5 trims base pixels without stretching
    'uniform float uOpacity;',
    'uniform float uFlipX;',
    'uniform vec3 uTint;',
    'varying vec2 vUv;',
    'void main() {',
    '  if (vUv.y < uCropBottom) discard;',
    '  float ux = uFlipX > 0.5 ? (1.0 - vUv.x) : vUv.x;',
    '  vec2 sampleUv = vec2(uFrameRect.x + ux * uFrameRect.z, uFrameRect.y + vUv.y * uFrameRect.w);',
    '  vec4 texel = texture2D(uSheet, sampleUv);',
    '  if (texel.a < 0.025) discard;',
    '  gl_FragColor = vec4(texel.rgb * uTint, texel.a * uOpacity);',
    '}'
  ].join('\n');

  function createPixelFxSystem(scene, camera, opts) {
    opts = opts || {};
    var basePath = opts.basePath || 'treasure3d/pixelfx/';
    var manifestUrl = basePath + 'manifest.json';

    var manifest = null;
    var texCache = {};
    var imgCache = {};
    var texLoader = new T3.TextureLoader();
    var unitQuad = new T3.PlaneGeometry(1, 1);
    // Shift unit quad so y=0 is bottom edge and y=1 is top edge!
    unitQuad.translate(0, 0.5, 0);

    var centerQuad = new T3.PlaneGeometry(1, 1);

    var pfxGroup = new T3.Group();
    pfxGroup.name = 'ti3d-pixelfx-world';
    scene.add(pfxGroup);

    var loopEmitters = [];
    var burstPool = [];
    var pendingActions = [];
    var hudAnims = [];
    var stats = { spawned3D: 0, playedHud: 0, activeLoops: 0 };

    // Create or bind crisp 2D HUD celebration canvas
    var hudCanvas = document.getElementById('ti-pfx-hud');
    if (!hudCanvas && typeof document !== 'undefined') {
      hudCanvas = document.createElement('canvas');
      hudCanvas.id = 'ti-pfx-hud';
      hudCanvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(hudCanvas);
    }
    var hudCtx = hudCanvas ? hudCanvas.getContext('2d') : null;
    var hudW = 0, hudH = 0, hudDpr = 1;

    function syncHudSize() {
      if (!hudCanvas) return;
      var dpr = Math.min(root.devicePixelRatio || 1, 2);
      var w = root.innerWidth || 1280;
      var h = root.innerHeight || 720;
      if (w !== hudW || h !== hudH || dpr !== hudDpr) {
        hudW = w; hudH = h; hudDpr = dpr;
        hudCanvas.width = Math.round(w * dpr);
        hudCanvas.height = Math.round(h * dpr);
      }
    }
    syncHudSize();
    root.addEventListener('resize', syncHudSize);

    // Load manifest immediately
    var readyPromise = fetch(manifestUrl)
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (data) {
        manifest = data || {};
        // Pre-warm primary gameplay sheets so first jump/dash/splash is 0ms instant!
        [
          'campfire', 'torch', 'splash', 'heavy-landing', 'poof',
          'collect-burst', 'exclamation', 'quest-complete', 'confetti'
        ].forEach(function (slug) {
          if (manifest[slug]) {
            if (slug === 'quest-complete' || slug === 'confetti') getHtmlImage(slug);
            else getSheetTexture(slug);
          }
        });
        while (pendingActions.length) {
          var fn = pendingActions.shift();
          try { fn(); } catch (e) {}
        }
        return manifest;
      })
      .catch(function () { manifest = {}; return manifest; });

    function resolveSheetUrl(slug) {
      var info = manifest && manifest[slug];
      if (!info) return null;
      return info.file || (basePath + 'sheets/' + slug + '.webp');
    }

    function getSheetTexture(slug) {
      if (texCache[slug]) return texCache[slug];
      var url = resolveSheetUrl(slug);
      if (!url) return null;
      var tex = texLoader.load(url);
      tex.magFilter = T3.NearestFilter;
      tex.minFilter = T3.NearestFilter;
      tex.generateMipmaps = false;
      tex.wrapS = T3.ClampToEdgeWrapping;
      tex.wrapT = T3.ClampToEdgeWrapping;
      // Keep raw sRGB texels pass-through for unlit ShaderMaterial so pixel palette never darkens by pow(2.2)!
      texCache[slug] = tex;
      return tex;
    }

    function getHtmlImage(slug) {
      if (imgCache[slug]) return imgCache[slug];
      var url = resolveSheetUrl(slug);
      if (!url) return null;
      var im = new Image();
      im.decoding = 'async';
      im.src = url;
      imgCache[slug] = im;
      return im;
    }

    function createFlipbookMaterial(tex, additive) {
      return new T3.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: T3.DoubleSide,
        blending: additive ? T3.AdditiveBlending : T3.NormalBlending,
        uniforms: {
          uSheet:      { value: tex },
          uFrameRect:  { value: new T3.Vector4(0, 0, 1, 1) },
          uCropBottom: { value: 0.0 },
          uOpacity:    { value: 1.0 },
          uFlipX:      { value: 0.0 },
          uTint:       { value: new T3.Color(0xffffff) }
        },
        vertexShader: VERT_SHADER,
        fragmentShader: FRAG_SHADER
      });
    }

    function applyFrameUniform(mat, info, frameIndex) {
      var cols = info.cols || 1;
      var rows = info.rows || 1;
      var col = frameIndex % cols;
      var row = Math.floor(frameIndex / cols);
      var uSpan = 1.0 / cols;
      var vSpan = 1.0 / rows;
      // Half-texel UV inset prevents 100% of adjacent-cell edge bleed at vUv=0 / vUv=1!
      var epsU = 0.5 / Math.max(64, (info.w || 64) * cols);
      var epsV = 0.5 / Math.max(64, (info.h || 64) * rows);
      var u0 = col * uSpan + epsU;
      // flipY=true in Three.js -> top row (row=0) occupies [1 - vSpan .. 1]
      var vBot = 1.0 - (row + 1) * vSpan + epsV;
      mat.uniforms.uFrameRect.value.set(u0, vBot, uSpan - epsU * 2.0, vSpan - epsV * 2.0);
    }

    // Build reusable 28-slot burst pool for zero runtime GC stalls
    for (var bi = 0; bi < 28; bi++) {
      var bMat = createFlipbookMaterial(null, false);
      var bMesh = new T3.Mesh(unitQuad, bMat);
      bMesh.visible = false;
      bMesh.frustumCulled = false;
      bMesh.renderOrder = 6;
      pfxGroup.add(bMesh);
      burstPool.push({
        active: false,
        mesh: bMesh,
        mat: bMat,
        info: null,
        slug: '',
        age: 0,
        fps: 20,
        startFrame: 0,
        endFrame: 1,
        mode: 'upright',
        baseX: 0,
        baseY: 0,
        baseZ: 0,
        riseSpeed: 0,
        fadeTail: false,
        followFn: null
      });
    }

    function configureMeshTransform(mesh, mat, info, x, y, z, scale, cfg) {
      cfg = cfg || {};
      var aspect = (info.w || 64) / Math.max(1, info.h || 64);
      var hWorld = scale || 1.6;
      var wWorld = hWorld * aspect;
      var cropB = cfg.cropBottom || 0.0;
      var mode = cfg.mode || 'upright';

      mesh.geometry = (mode === 'center' || mode === 'water') ? centerQuad : unitQuad;
      mesh.scale.set(wWorld, hWorld, 1);

      // Shift down by cropped base height so visible base rests cleanly at y!
      var yShift = (mode === 'upright') ? (-hWorld * cropB) : 0;
      mesh.position.set(x, y + yShift, z);
      if (mode === 'water') {
        mesh.rotation.set(-Math.PI * 0.5, cfg.yaw || 0, 0);
      } else {
        mesh.rotation.set(0, 0, 0);
      }

      mat.blending = cfg.additive ? T3.AdditiveBlending : T3.NormalBlending;
      mat.uniforms.uCropBottom.value = cropB;
      mat.uniforms.uOpacity.value = cfg.opacity != null ? cfg.opacity : 1.0;
      mat.uniforms.uFlipX.value = cfg.flipX ? 1.0 : 0.0;
      mat.uniforms.uTint.value.setHex(cfg.tint != null ? cfg.tint : 0xffffff);
    }

    /**
     * Add a persistent looping 3D flipbook emitter (campfires, torches, waterfalls, bubbles, fish, fireflies, loot beams)
     */
    function addLoop3D(slug, x, y, z, scale, cfg) {
      cfg = cfg || {};
      var handle = {
        slug: slug,
        mesh: null,
        mat: null,
        info: null,
        x: x, y: y, z: z,
        baseY: y,
        scale: scale || 1.6,
        cfg: cfg,
        phase: cfg.phase != null ? cfg.phase : Math.random() * 10.0,
        visible: cfg.visible !== false,
        wanderRadius: cfg.wanderRadius || 0,
        wanderSpeed: cfg.wanderSpeed || 0.7,
        maxDist: cfg.maxDist || 72,
        setVisible: function (v) {
          handle.visible = !!v;
          if (handle.mesh) handle.mesh.visible = !!v;
        },
        setPosition: function (nx, ny, nz) {
          handle.x = nx; handle.y = ny; handle.baseY = ny; handle.z = nz;
        }
      };

      function build() {
        var info = manifest && manifest[slug];
        if (!info) return;
        var tex = getSheetTexture(slug);
        var mat = createFlipbookMaterial(tex, !!cfg.additive);
        var mesh = new T3.Mesh(unitQuad, mat);
        mesh.frustumCulled = false;
        mesh.renderOrder = cfg.mode === 'water' ? 2 : 5;
        configureMeshTransform(mesh, mat, info, handle.x, handle.y, handle.z, handle.scale, cfg);
        applyFrameUniform(mat, info, 0);
        mesh.visible = handle.visible;
        pfxGroup.add(mesh);
        handle.mesh = mesh;
        handle.mat = mat;
        handle.info = info;
        loopEmitters.push(handle);
        stats.activeLoops = loopEmitters.length;
      }

      if (manifest) build();
      else pendingActions.push(build);
      return handle;
    }

    /**
     * Spawn a pooled one-shot 3D flipbook burst (splash, haste, heavy-landing, dirt-explosion, chest-open, firework-burst, exclamation)
     */
    function spawn3D(slug, x, y, z, scale, cfg) {
      cfg = cfg || {};
      function trigger() {
        var info = manifest && manifest[slug];
        if (!info) return;
        var slot = null;
        for (var i = 0; i < burstPool.length; i++) {
          if (!burstPool[i].active) { slot = burstPool[i]; break; }
        }
        if (!slot) slot = burstPool[0]; // Recycle oldest if all 28 are busy

        var tex = getSheetTexture(slug);
        slot.active = true;
        slot.info = info;
        slot.slug = slug;
        slot.age = 0;
        slot.fps = cfg.fps || info.fps || 20;
        slot.startFrame = cfg.startFrame || 0;
        slot.endFrame = cfg.endFrame || ((info.frames || 1) - 1);
        slot.mode = cfg.mode || 'upright';
        slot.baseX = x;
        slot.baseY = y;
        slot.baseZ = z;
        slot.cropBottom = cfg.cropBottom || 0.0;
        slot.scale = scale || 1.8;
        slot.riseSpeed = cfg.riseSpeed || 0;
        slot.fadeTail = !!cfg.fadeTail;
        slot.baseOpacity = cfg.opacity != null ? cfg.opacity : 1.0;
        slot.followFn = cfg.followFn || null;

        slot.mat.uniforms.uSheet.value = tex;
        configureMeshTransform(slot.mesh, slot.mat, info, x, y, z, slot.scale, cfg);
        applyFrameUniform(slot.mat, info, slot.startFrame);
        slot.mesh.visible = true;
        stats.spawned3D++;
      }

      if (manifest) trigger();
      else pendingActions.push(trigger);
    }

    /**
     * Play a crisp pixel-art 2D HUD animation (`quest-complete`, `confetti`, etc.) on `#ti-pfx-hud`
     */
    function playHud(slug, cfg) {
      cfg = cfg || {};
      function triggerHud() {
        var info = manifest && manifest[slug];
        if (!info || !hudCtx) return;
        var img = getHtmlImage(slug);
        hudAnims.push({
          slug: slug,
          info: info,
          img: img,
          age: -(cfg.delay || 0),
          fps: cfg.fps || info.fps || 20,
          holdDuration: cfg.holdDuration || 0,
          rx: cfg.rx != null ? cfg.rx : 0.5, // normalized screen X (0..1)
          ry: cfg.ry != null ? cfg.ry : 0.24, // normalized screen Y (0..1)
          scale: cfg.scale || 3.0
        });
        stats.playedHud++;
      }
      if (manifest) triggerHud();
      else pendingActions.push(triggerHud);
    }

    /**
     * Signature Zone Victory Fanfare: Unrolling PixelFX `quest-complete` ribbon + twin `confetti` poppers!
     */
    function celebrateZone(zoneNum) {
      playHud('confetti', { rx: 0.5, ry: 0.34, scale: 3.8, fps: 18 });
      playHud('quest-complete', { rx: 0.5, ry: 0.21, scale: 3.1, fps: 20, holdDuration: 0.85 });
      if (zoneNum === 5) {
        playHud('confetti', { rx: 0.26, ry: 0.40, scale: 3.2, delay: 0.35 });
        playHud('confetti', { rx: 0.74, ry: 0.40, scale: 3.2, delay: 0.55 });
      }
    }

    function orientBillboard(mesh, mode, camPos, camQuat) {
      if (mode === 'water') return;
      if (mode === 'center') {
        mesh.quaternion.copy(camQuat);
      } else {
        // Cylindrical upright Y-axis billboard
        var dx = camPos.x - mesh.position.x;
        var dz = camPos.z - mesh.position.z;
        mesh.rotation.set(0, Math.atan2(dx, dz), 0);
      }
    }

    function update(dt, elapsed) {
      if (!manifest || !camera) return;
      var camPos = camera.position;
      var camQuat = camera.quaternion;

      // 1. Update persistent looping 3D world emitters
      for (var i = 0; i < loopEmitters.length; i++) {
        var em = loopEmitters[i];
        if (!em.mesh || !em.visible) continue;

        // Distance cull distant ambient loops cleanly so GPU stays feather-light
        var dCam = Math.hypot(camPos.x - em.x, camPos.z - em.z);
        if (dCam > em.maxDist) {
          em.mesh.visible = false;
          continue;
        }
        em.mesh.visible = true;

        var info = em.info;
        var fCount = info.frames || 1;
        var fps = em.cfg.fps || info.fps || 16;
        var fIdx = Math.floor((elapsed * fps + em.phase * fps) % fCount);
        if (fIdx < 0) fIdx = 0;
        applyFrameUniform(em.mat, info, fIdx);

        var wx = em.x, wy = em.baseY, wz = em.z;
        if (em.wanderRadius > 0) {
          var wt = elapsed * em.wanderSpeed + em.phase;
          wx += Math.cos(wt) * em.wanderRadius;
          wz += Math.sin(wt * 1.3) * em.wanderRadius * 0.75;
          if (em.cfg.mode === 'water') {
            em.mesh.rotation.set(-Math.PI * 0.5, -wt, 0);
          } else {
            wy += Math.sin(wt * 2.2) * 0.16;
          }
        }
        var yShift = (em.cfg.mode || 'upright') === 'upright' ? (-em.scale * (em.cfg.cropBottom || 0)) : 0;
        em.mesh.position.set(wx, wy + yShift, wz);
        orientBillboard(em.mesh, em.cfg.mode || 'upright', camPos, camQuat);
      }

      // 2. Update pooled one-shot 3D bursts
      for (var b = 0; b < burstPool.length; b++) {
        var slot = burstPool[b];
        if (!slot.active) continue;
        slot.age += dt;
        var spanFrames = Math.max(1, slot.endFrame - slot.startFrame + 1);
        var curOffset = Math.floor(slot.age * slot.fps);
        if (curOffset >= spanFrames) {
          slot.active = false;
          slot.mesh.visible = false;
          continue;
        }
        var curFrame = slot.startFrame + curOffset;
        applyFrameUniform(slot.mat, slot.info, curFrame);

        if (slot.followFn) {
          var fp = slot.followFn();
          if (fp) { slot.baseX = fp.x; slot.baseY = fp.y; slot.baseZ = fp.z; }
        }
        var rise = slot.riseSpeed * slot.age;
        var cropShift = slot.mode === 'upright' ? (-slot.scale * slot.cropBottom) : 0;
        slot.mesh.position.set(slot.baseX, slot.baseY + cropShift + rise, slot.baseZ);

        if (slot.fadeTail) {
          var prog = curOffset / spanFrames;
          slot.mat.uniforms.uOpacity.value = prog > 0.7 ? slot.baseOpacity * (1.0 - (prog - 0.7) / 0.3) : slot.baseOpacity;
        }
        orientBillboard(slot.mesh, slot.mode, camPos, camQuat);
      }

      // 3. Render crisp 2D HUD celebration flipbooks (`#ti-pfx-hud`)
      if (hudCtx && hudAnims.length > 0) {
        syncHudSize();
        hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        hudCtx.imageSmoothingEnabled = false;

        // Compact responsive scale on narrow mobile screens so banners never clip horizontally!
        var responsiveMul = Math.min(1.0, (hudW / 720));
        responsiveMul = Math.max(0.58, responsiveMul);

        for (var h = hudAnims.length - 1; h >= 0; h--) {
          var ha = hudAnims[h];
          ha.age += dt;
          if (ha.age < 0) continue;

          var animDur = (ha.info.frames || 1) / ha.fps;
          var totalDur = animDur + ha.holdDuration;
          if (ha.age >= totalDur) {
            hudAnims.splice(h, 1);
            continue;
          }
          if (!ha.img || !ha.img.complete || !ha.img.naturalWidth) continue;

          var fIdxH = Math.min((ha.info.frames || 1) - 1, Math.floor(ha.age * ha.fps));
          var colsH = ha.info.cols || 1;
          var sx = (fIdxH % colsH) * ha.info.w;
          var sy = Math.floor(fIdxH / colsH) * ha.info.h;

          var drawScale = ha.scale * responsiveMul * hudDpr;
          var dw = Math.round(ha.info.w * drawScale);
          var dh = Math.round(ha.info.h * drawScale);
          var dx = Math.round(hudCanvas.width * ha.rx - dw * 0.5);
          var dy = Math.round(hudCanvas.height * ha.ry - dh * 0.5);

          var alpha = 1.0;
          if (ha.holdDuration > 0 && ha.age > animDur) {
            var holdProg = (ha.age - animDur) / ha.holdDuration;
            if (holdProg > 0.55) alpha = Math.max(0, 1.0 - (holdProg - 0.55) / 0.45);
          }

          hudCtx.save();
          hudCtx.globalAlpha = alpha;
          hudCtx.drawImage(ha.img, sx, sy, ha.info.w, ha.info.h, dx, dy, dw, dh);
          hudCtx.restore();
        }
        if (hudAnims.length === 0) {
          hudCtx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        }
      }
    }

    return {
      ready: readyPromise,
      stats: stats,
      loopEmitters: loopEmitters,
      addLoop3D: addLoop3D,
      spawn3D: spawn3D,
      playHud: playHud,
      celebrateZone: celebrateZone,
      update: update
    };
  }

  TI3D.createPixelFxSystem = createPixelFxSystem;
})(typeof window !== 'undefined' ? window : this);
