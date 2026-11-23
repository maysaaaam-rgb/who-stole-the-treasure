/* kit3d — shared 3D toolkit for the English Adventure Academy 3D games.
   Needs: three.min.js (+ BufferGeometryUtils.js, GLTFLoader.js) loaded first.
   Gives: clock + scheduler, frame-capture for videos, sounds (files in ./sfx with synth fallback),
   pictures (files in ./art), world pieces (sky, hills, trees, clouds), particles, floating text,
   rigged kid avatars with code-made moves, whole-body monster animation, camera helper,
   and the classroom UI (team bar, big text, question card, top buttons). */
(function (root) {
  'use strict';
  var T3 = root.THREE;
  var K = root.K3 = {};
  var Q = K.Q = new URLSearchParams(location.search);
  K.CAPTURE = Q.has('capture');
  K.DEMO = Q.has('demo') || K.CAPTURE;
  K.ROOT = '../../';

  /* ---------- small helpers ---------- */
  K.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  K.lerp = function (a, b, t) { return a + (b - a) * t; };
  K.rnd = function (a, b) { return a + Math.random() * (b - a); };
  K.ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  K.easeOutBack = function (t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  K.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  K.TEAMS = [
    { name: 'Pink',   c: '#ff5fa2', hex: 0xff5fa2, kid: 'girl', mon: 'emberwing' },
    { name: 'Blue',   c: '#4f9dff', hex: 0x4f9dff, kid: 'boy',  mon: 'aquafind' },
    { name: 'Yellow', c: '#ffb320', hex: 0xffb320, kid: 'girl', mon: 'sparktail' },
    { name: 'Green',  c: '#2fc58a', hex: 0x2fc58a, kid: 'boy',  mon: 'florasprout' }
  ];

  /* ---------- clock + scheduler ---------- */
  var jobs = [], frameFns = [];
  K.now = 0;
  K.timeScale = 1;
  K.after = function (sec, fn) { var j = { at: K.now + sec, fn: fn }; jobs.push(j); return j; };
  K.cancel = function (j) { var i = jobs.indexOf(j); if (i >= 0) jobs.splice(i, 1); };
  K.onFrame = function (fn) { frameFns.push(fn); return fn; };
  K.offFrame = function (fn) { var i = frameFns.indexOf(fn); if (i >= 0) frameFns.splice(i, 1); };
  function runJobs() {
    for (var i = 0; i < jobs.length; i++) if (jobs[i].at <= K.now) { var j = jobs.splice(i, 1)[0]; i--; j.fn(); }
  }

  /* ---------- renderer / scene (4K Smartboard & Integrated GPU Turbo Pipeline) ---------- */
  K.MOBILE = (function () {
    try {
      var ua = navigator.userAgent || '';
      var touch = (navigator.maxTouchPoints > 0) || ('ontouchstart' in root);
      var small = Math.min(screen.width || innerWidth || 1280, screen.height || innerHeight || 720) <= 920;
      return /iPhone|iPad|iPod|Android/i.test(ua) || (touch && small);
    } catch (e) { return false; }
  })();
  K.GPU_INFO = (function () {
    var rendererName = '', isLow = K.MOBILE, isSmartboard = false;
    try {
      var touch = (navigator.maxTouchPoints > 0) || ('ontouchstart' in root);
      var bigScreen = Math.max(screen.width || 0, innerWidth || 0) >= 1900;
      if (touch && bigScreen && !K.MOBILE) isSmartboard = true;
      var probe = document.createElement('canvas');
      var gl = probe.getContext('webgl') || probe.getContext('experimental-webgl');
      if (gl) {
        var dbg = gl.getExtension('WEBGL_debug_renderer_info');
        rendererName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : String(gl.getParameter(gl.RENDERER) || '');
        if (/Intel.*(UHD|HD Graphics|Iris)|Mali|Adreno|PowerVR|VideoCore|Vivante|SwiftShader|llvmpipe|Microsoft Basic|Vega [3678]/i.test(rendererName)) {
          isLow = true;
        }
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    } catch (e) {}
    if (Q.get('board') === '1' || Q.get('q') === 'low') { isSmartboard = true; isLow = true; }
    if (Q.get('q') === 'ultra') { isSmartboard = false; isLow = false; }
    return { name: rendererName, low: isLow || isSmartboard, smartboard: isSmartboard };
  })();
  K.SMARTBOARD = K.GPU_INFO.smartboard;
  K.LOW_GPU = K.GPU_INFO.low;
  K._dynScale = 1.0;

  K.init = function (opts) {
    opts = opts || {};
    var canvas = opts.canvas || document.getElementById('scene');
    K.quality = K.Q.get('q') || (K.LOW_GPU ? (K.MOBILE ? 'mobile' : 'board') : 'high');
    var useAA = K.CAPTURE || (!K.LOW_GPU && K.quality !== 'low');
    var r = K.renderer = new T3.WebGLRenderer({
      canvas: canvas,
      antialias: useAA,
      powerPreference: K.MOBILE ? 'default' : 'high-performance',
      stencil: false,
      preserveDrawingBuffer: K.CAPTURE
    });
    r.shadowMap.enabled = true;
    r.shadowMap.type = K.LOW_GPU ? T3.PCFShadowMap : T3.PCFSoftShadowMap;
    if (K.LOW_GPU && !K.CAPTURE) {
      r.shadowMap.autoUpdate = false;
      r.shadowMap.needsUpdate = true;
    }
    if (T3.ACESFilmicToneMapping !== undefined) {
      r.toneMapping = T3.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.05;
    }
    if (T3.SRGBColorSpace) r.outputColorSpace = T3.SRGBColorSpace;
    else if (T3.sRGBEncoding) r.outputEncoding = T3.sRGBEncoding;
    K.scene = new T3.Scene();
    // Calibrated low-density FogExp2 (never milky whiteout!)
    K.scene.fog = new T3.FogExp2(opts.fog || 0xe6f4ff, opts.fogDensity || 0.0026);
    K._initPMREM(r);
    // Retire legacy blurry 512x512 _initPostFX unless explicitly requested via ?legacyBloom=1
    if (Q.get('legacyBloom') === '1') K._initPostFX(r, opts);
    else K._post = null;
    K._baseFov = opts.fov || 42;
    K._autoPortraitFov = opts.autoPortraitFov !== false;
    K.camera = new T3.PerspectiveCamera(K._baseFov, 16 / 9, .1, opts.far || 400);
    function computePixelRatio(w, h) {
      if (K.CAPTURE) return +K.Q.get('pr') || 1;
      if (K.quality === 'ultra') return Math.min(2, root.devicePixelRatio || 1);
      var dpr = root.devicePixelRatio || 1;
      var maxPr = K.LOW_GPU ? Math.min(1.25, dpr) : Math.min(1.65, dpr);
      // Strict shaded-pixel budget so 4K Smartboards (3840x2160) never render 8M-18M pixels/frame!
      var maxPixels = K.quality === 'low' ? 980000 : (K.LOW_GPU ? 1480000 : 2250000);
      var budgetPr = Math.sqrt(maxPixels / Math.max(1, w * h));
      return K.clamp(Math.min(maxPr, budgetPr) * K._dynScale, 0.42, 2.0);
    }
    K._computePixelRatio = computePixelRatio;
    function resize() {
      var vv = root.visualViewport;
      var w = Math.max(2, Math.round((vv && vv.width) || innerWidth || 1280));
      var h = Math.max(2, Math.round((vv && vv.height) || innerHeight || 720));
      r.setPixelRatio(computePixelRatio(w, h));
      r.setSize(w, h, false);
      if (K._resizePostFX) K._resizePostFX(w, h);
      var aspect = w / h;
      K.camera.aspect = aspect;
      if (K._autoPortraitFov) {
        K.camera.fov = aspect < 1.05 ? K.clamp(K._baseFov * (1 + (1.05 - aspect) * 0.68), K._baseFov, 68) : K._baseFov;
      }
      K.camera.updateProjectionMatrix();
      r.shadowMap.needsUpdate = true;
    }
    K.resize = resize;
    addEventListener('resize', resize);
    addEventListener('orientationchange', function () { setTimeout(resize, 120); setTimeout(resize, 360); });
    if (root.visualViewport && root.visualViewport.addEventListener) root.visualViewport.addEventListener('resize', resize);
    if (canvas) {
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); }, false);
      canvas.addEventListener('webglcontextrestored', function () { resize(); }, false);
    }
    resize();
    if (Q.has('preview')) document.body.classList.add('preview');
    return K;
  };

  /* ---------- Stylized PMREM Environment, Selective Soft Bloom Post-FX, GPU Wind & Perf Governor ---------- */
  K.uTime = { value: 0 };
  K.perf = { fps: 60, drawCalls: 0, triangles: 0, bloomOn: false };
  var _fpsAcc = 0, _fpsFrames = 0, _lowFpsStrikes = 0;

  K._initPMREM = function (renderer) {
    try {
      if (!T3.PMREMGenerator) return;
      var pmrem = new T3.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      var envScene = new T3.Scene();
      var domeGeo = new T3.SphereGeometry(20, 24, 16);
      var pos = domeGeo.attributes.position, cols = new Float32Array(pos.count * 3);
      var cTop = new T3.Color(0x5eb8ff), cHor = new T3.Color(0xdcf2ff), cGnd = new T3.Color(0xf6dfb2), cSun = new T3.Color(0xfff5d6), tmp = new T3.Color();
      var sunDir = new T3.Vector3(-0.45, 0.72, 0.52).normalize(), vd = new T3.Vector3();
      for (var i = 0; i < pos.count; i++) {
        vd.fromBufferAttribute(pos, i).normalize();
        if (vd.y >= 0) tmp.copy(cHor).lerp(cTop, Math.pow(vd.y, 0.65));
        else tmp.copy(cHor).lerp(cGnd, Math.min(1, Math.pow(-vd.y, 0.55) * 1.1));
        var sd = Math.max(0, vd.dot(sunDir));
        if (sd > 0.75) tmp.lerp(cSun, Math.pow((sd - 0.75) / 0.25, 2.0) * 0.85);
        cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
      }
      domeGeo.setAttribute('color', new T3.BufferAttribute(cols, 3));
      envScene.add(new T3.Mesh(domeGeo, new T3.MeshBasicMaterial({ vertexColors: true, side: T3.BackSide })));
      var rt = pmrem.fromScene(envScene, 0.04);
      K.scene.environment = rt.texture;
      if ('environmentIntensity' in K.scene) K.scene.environmentIntensity = 0.55;
      domeGeo.dispose();
      pmrem.dispose();
    } catch (e) {}
  };

  K._initPostFX = function (renderer, opts) {
    K._post = null;
    if (K.MOBILE || K.quality === 'low' || K.Q.get('bloom') === '0' || opts.bloom === false) return;
    try {
      var rtType = T3.HalfFloatType || T3.UnsignedByteType;
      var sceneRT = new T3.WebGLRenderTarget(512, 512, { type: rtType, depthBuffer: true, stencilBuffer: false });
      var bloomRT1 = new T3.WebGLRenderTarget(256, 256, { type: rtType, depthBuffer: false });
      var bloomRT2 = new T3.WebGLRenderTarget(256, 256, { type: rtType, depthBuffer: false });
      var orthoCam = new T3.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      var quadGeo = new T3.PlaneGeometry(2, 2);
      var vShader = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
      var threshMat = new T3.ShaderMaterial({
        uniforms: { tDiffuse: { value: null }, uThresh: { value: 0.86 } },
        vertexShader: vShader,
        fragmentShader: 'uniform sampler2D tDiffuse; uniform float uThresh; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float lum = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722)); float k = smoothstep(uThresh, uThresh + 0.38, lum); gl_FragColor = vec4(c.rgb * k, 1.0); }',
        depthTest: false, depthWrite: false
      });
      var blurMat = new T3.ShaderMaterial({
        uniforms: { tDiffuse: { value: null }, uStep: { value: new T3.Vector2(1 / 256, 1 / 256) } },
        vertexShader: vShader,
        fragmentShader: 'uniform sampler2D tDiffuse; uniform vec2 uStep; varying vec2 vUv; void main(){ vec3 s = texture2D(tDiffuse, vUv).rgb * 0.28; s += texture2D(tDiffuse, vUv + vec2(uStep.x, uStep.y)).rgb * 0.18; s += texture2D(tDiffuse, vUv + vec2(-uStep.x, uStep.y)).rgb * 0.18; s += texture2D(tDiffuse, vUv + vec2(uStep.x, -uStep.y)).rgb * 0.18; s += texture2D(tDiffuse, vUv + vec2(-uStep.x, -uStep.y)).rgb * 0.18; gl_FragColor = vec4(s, 1.0); }',
        depthTest: false, depthWrite: false
      });
      var compMat = new T3.ShaderMaterial({
        uniforms: { tScene: { value: sceneRT.texture }, tBloom: { value: bloomRT1.texture }, uStrength: { value: 0.24 } },
        vertexShader: vShader,
        fragmentShader: 'uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uStrength; varying vec2 vUv; vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); } void main(){ vec3 base = texture2D(tScene, vUv).rgb; vec3 glow = texture2D(tBloom, vUv).rgb * uStrength; vec3 col = aces((base + glow) * 1.04); gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0); }',
        depthTest: false, depthWrite: false
      });
      var quad = new T3.Mesh(quadGeo, threshMat);
      var postScene = new T3.Scene(); postScene.add(quad);
      K._post = { sceneRT: sceneRT, b1: bloomRT1, b2: bloomRT2, cam: orthoCam, scene: postScene, quad: quad, thresh: threshMat, blur: blurMat, comp: compMat, enabled: true };
      K.perf.bloomOn = true;
      K._resizePostFX = function (w, h) {
        if (!K._post) return;
        var pr = renderer.getPixelRatio();
        var rw = Math.max(4, Math.round(w * pr)), rh = Math.max(4, Math.round(h * pr));
        sceneRT.setSize(rw, rh);
        var bw = Math.max(4, Math.round(rw * 0.35)), bh = Math.max(4, Math.round(rh * 0.35));
        bloomRT1.setSize(bw, bh); bloomRT2.setSize(bw, bh);
        blurMat.uniforms.uStep.value.set(1.35 / bw, 1.35 / bh);
      };
    } catch (e) { K._post = null; }
  };

  K.windify = function (mat, strength, refH) {
    if (!mat || mat.userData._windified) return mat;
    mat.userData._windified = true;
    var amp = strength != null ? strength : 0.085;
    var h0 = refH || 3.0;
    mat.onBeforeCompile = function (shader) {
      shader.uniforms.uK3Time = K.uTime;
      shader.vertexShader = 'uniform float uK3Time;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' +
        'float _wy = clamp(transformed.y / ' + h0.toFixed(2) + ', 0.0, 1.25);\n' +
        'float _wMask = _wy * _wy;\n' +
        '#ifdef USE_INSTANCING\n' +
        '  vec3 _wOrigin = instanceMatrix[3].xyz;\n' +
        '#else\n' +
        '  vec3 _wOrigin = modelMatrix[3].xyz;\n' +
        '#endif\n' +
        'float _wPhase = uK3Time * 1.85 + _wOrigin.x * 0.37 + _wOrigin.z * 0.29;\n' +
        'transformed.x += sin(_wPhase) * ' + amp.toFixed(4) + ' * _wMask;\n' +
        'transformed.z += cos(_wPhase * 0.82) * ' + (amp * 0.65).toFixed(4) + ' * _wMask;'
      );
    };
    mat.customProgramCacheKey = function () { return 'k3wind_' + amp.toFixed(3) + '_' + h0.toFixed(1); };
    return mat;
  };

  K.waterMat = function (opts) {
    opts = opts || {};
    return new T3.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: K.uTime,
        uDeep: { value: new T3.Color(opts.deep || 0x2eb4e8) },
        uShallow: { value: new T3.Color(opts.shallow || 0x7fe0f7) },
        uFoam: { value: new T3.Color(0xffffff) }
      },
      vertexShader: 'varying vec2 vUv; varying vec3 vWPos; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vWPos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
      fragmentShader: 'uniform float uTime; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam; varying vec2 vUv; varying vec3 vWPos; void main(){ float w1 = sin(vWPos.x * 2.4 + uTime * 2.1) * cos(vWPos.z * 2.2 - uTime * 1.7); float w2 = sin((vWPos.x + vWPos.z) * 3.6 - uTime * 2.8); vec3 col = mix(uDeep, uShallow, 0.5 + 0.35 * w1); float edge = length(vUv - vec2(0.5)) * 2.0; float foam = smoothstep(0.82, 0.96, edge + 0.06 * sin(uTime * 3.2 + edge * 14.0)) + smoothstep(0.86, 0.98, 0.5 * (w1 + w2)); col = mix(col, uFoam, clamp(foam * 0.65, 0.0, 0.85)); gl_FragColor = vec4(col, 0.90); }'
    });
  };

  var _highFpsWindows = 0, _shadowTick = 0, _shadowStride = 2;
  function _isBackgroundCovered() {
    if (document.hidden) return true;
    try {
      if (root.frameElement && root.parent && root.parent !== root) {
        if (root.frameElement.offsetParent === null) return true;
        if (root.frameElement.id === 'pn-home3d-frame') {
          var pd = root.parent.document;
          var gm = pd.getElementById('game-maker-modal');
          if (gm && !gm.classList.contains('hidden') && gm.style.display !== 'none') return true;
          var lv = pd.getElementById('lesson-viewer-modal');
          if (lv && !lv.classList.contains('hidden') && lv.style.display !== 'none') return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function frame(dt) {
    var rawDt = dt;
    dt = Math.min(dt, 1 / 20) * K.timeScale;
    K.now += dt;
    K.uTime.value = K.now;
    if (rawDt > 0 && rawDt < 0.5) {
      _fpsAcc += rawDt; _fpsFrames++;
      if (_fpsAcc >= 0.75) {
        K.perf.fps = Math.round(_fpsFrames / _fpsAcc);
        _fpsAcc = 0; _fpsFrames = 0;
        if (!K.CAPTURE && K.quality !== 'ultra') {
          if (K.perf.fps < 47) {
            _lowFpsStrikes++;
            _highFpsWindows = 0;
            if (K._post && K._post.enabled && _lowFpsStrikes >= 2) { K._post.enabled = false; K.perf.bloomOn = false; }
            if (K._dynScale > 0.64) {
              K._dynScale = Math.max(0.62, +(K._dynScale * 0.86).toFixed(2));
              K.renderer.shadowMap.autoUpdate = false;
              _shadowStride = Math.min(6, _shadowStride + 2);
              if (K.resize) K.resize();
            }
          } else {
            _lowFpsStrikes = 0;
            if (K.perf.fps >= 58 && K._dynScale < 1.0) {
              _highFpsWindows++;
              if (_highFpsWindows >= 5) {
                _highFpsWindows = 0;
                K._dynScale = Math.min(1.0, +(K._dynScale + 0.08).toFixed(2));
                if (K.resize) K.resize();
              }
            } else {
              _highFpsWindows = 0;
            }
          }
        }
      }
    }
    runJobs();
    for (var i = 0; i < frameFns.length; i++) frameFns[i](dt, K.now);
    K.cam.update(dt);
    if (root.GameQualityCore && root.GameQualityCore.Juice) {
      root.GameQualityCore.Juice.update(dt, K.now, K.camera);
    }
    if (!K.renderer.shadowMap.autoUpdate && ((++_shadowTick) % (K.shadowStride || _shadowStride) === 0)) {
      K.renderer.shadowMap.needsUpdate = true;
    }
    var p = K._post;
    if (p && p.enabled && !K.CAPTURE) {
      var prevTM = K.renderer.toneMapping, prevCS = K.renderer.outputColorSpace;
      K.renderer.toneMapping = T3.NoToneMapping;
      if (T3.LinearSRGBColorSpace) K.renderer.outputColorSpace = T3.LinearSRGBColorSpace;
      K.renderer.setRenderTarget(p.sceneRT);
      K.renderer.render(K.scene, K.camera);
      K.perf.drawCalls = K.renderer.info.render.calls;
      K.perf.triangles = K.renderer.info.render.triangles;
      p.quad.material = p.thresh; p.thresh.uniforms.tDiffuse.value = p.sceneRT.texture;
      K.renderer.setRenderTarget(p.b1); K.renderer.render(p.scene, p.cam);
      p.quad.material = p.blur; p.blur.uniforms.tDiffuse.value = p.b1.texture;
      K.renderer.setRenderTarget(p.b2); K.renderer.render(p.scene, p.cam);
      p.blur.uniforms.tDiffuse.value = p.b2.texture;
      K.renderer.setRenderTarget(p.b1); K.renderer.render(p.scene, p.cam);
      K.renderer.setRenderTarget(null);
      p.quad.material = p.comp;
      K.renderer.render(p.scene, p.cam);
      K.renderer.toneMapping = prevTM;
      if (prevCS) K.renderer.outputColorSpace = prevCS;
    } else {
      K.renderer.render(K.scene, K.camera);
      K.perf.drawCalls = K.renderer.info.render.calls;
      K.perf.triangles = K.renderer.info.render.triangles;
    }
    if (K.CAPTURE && document.getAnimations) document.getAnimations().forEach(function (a) { a.pause(); a.__t = (a.__t || 0) + dt * 1000; a.currentTime = a.__t; });
  }
  K.start = function () {
    root.__k3 = {
      step: function (n, dt) { for (var i = 0; i < (n || 1); i++) frame(dt || 1 / 30); },
      sim: function (n, dt) { var rr = K.renderer.render; K.renderer.render = function () {}; for (var i = 0; i < n; i++) frame(dt || 1 / 30); K.renderer.render = rr; },
      ready: true, K: K
    };
    if (K.CAPTURE) { frame(1 / 30); return; }
    var last = 0, ecoTick = 0, bgCheckTick = 0, bgCovered = false;
    (function loop(ts) {
      if (((++bgCheckTick) & 15) === 1) bgCovered = _isBackgroundCovered();
      if (bgCovered) { last = ts; requestAnimationFrame(loop); return; }
      if (K.ecoHalfRate && ((++ecoTick) & 1)) { requestAnimationFrame(loop); return; }
      var dt = last ? Math.min(0.1, (ts - last) / 1000) : 1 / 60;
      last = ts;
      if (!K.paused) frame(dt);
      requestAnimationFrame(loop);
    })(0);
  };

  /* ---------- materials / textures / pictures ---------- */
  K.mat = function (c, o) { return new T3.MeshLambertMaterial(Object.assign({ color: c }, o || {})); };
  K.canvasTex = function (w, h, draw) {
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    var t = new T3.CanvasTexture(cv); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t;
  };
  var texLoader = new T3.TextureLoader();
  K.art = function (file, onOk) {
    texLoader.load('art/' + file, function (t) { t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; onOk(t); }, undefined, function () {});
  };
  K.roundRect = function (x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
  K.label = function (text, color, w) {   // pill sprite
    w = w || 256;
    var tex = K.canvasTex(w, 96, function (x, W, H) {
      x.fillStyle = color; K.roundRect(x, 6, 6, W - 12, H - 12, 40); x.fill();
      x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke();
      x.fillStyle = '#fff'; x.font = '900 46px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, H / 2 + 3);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, depthTest: false }));
    s.scale.set(w / 256 * 1.05, .4, 1); s.renderOrder = 5; return s;
  };

  /* ---------- sound: ./sfx/<name>.mp3 if present, else synth ---------- */
  var AC = null, BUF = {}, loops = {};
  K.muted = false;
  K.audio = function () { if (!AC) { try { AC = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; };
  function tone(f, d, type, vol, slide) {
    var a = K.audio(); if (!a || K.CAPTURE || K.muted) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || .2, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
  }
  function noise(d, vol, freq, type) {
    var a = K.audio(); if (!a || K.CAPTURE || K.muted) return;
    var n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), ch = b.getChannelData(0);
    for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = type || 'bandpass'; f.frequency.value = freq || 1200; g.gain.value = vol || .3;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  K.tone = tone; K.noise = noise;
  /* Polyphonic dual-oscillator ADSR chord helper (AGENTS.md §1.3: zero raw square/sawtooth beeps!) */
  function polyChord(freqs, dur, vol, stagger) {
    var a = K.audio(); if (!a || K.CAPTURE || K.muted) return;
    freqs.forEach(function (f, i) {
      var t0 = a.currentTime + i * (stagger || 0);
      var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
      o1.type = 'triangle'; o2.type = 'sine';
      o1.frequency.setValueAtTime(f, t0); o2.frequency.setValueAtTime(f * 2, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime((vol || 0.16) / Math.sqrt(freqs.length), t0 + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + (dur || 0.34));
      o1.connect(g); o2.connect(g); g.connect(a.destination);
      o1.start(t0); o2.start(t0); o1.stop(t0 + (dur || 0.34) + 0.02); o2.stop(t0 + (dur || 0.34) + 0.02);
    });
  }
  var SYN = {
    countdown: function () { polyChord([523.25, 659.25], .22, .18, 0); },
    go: function () { polyChord([523.25, 659.25, 783.99, 1046.5], .48, .26, .03); noise(.9, .28, 1100); },
    correct: function () { polyChord([523.25, 659.25, 783.99, 1046.5], .34, .26, .075); },
    wrong: function () { polyChord([246.94, 220.00], .36, .18, .12); },
    step: function () { tone(520, .08, 'sine', .14, 620); },
    stumble: function () { polyChord([330, 293.66], .32, .2, .08); },
    hello: function () { polyChord([523.25, 783.99], .18, .16, .05); },
    whoosh: function () { noise(.5, .3, 2200); },
    win: function () { noise(2.0, .38, 1100); polyChord([523.25, 659.25, 783.99, 1046.5], .45, .28, .11); },
    pop: function () { noise(.10, .48, 2500, 'highpass'); polyChord([783.99, 1046.5], .12, .16, .02); },
    boom: function () { noise(.85, .75, 160, 'lowpass'); tone(95, .55, 'sine', .42, 42); },
    fuse: function () { noise(1.2, .12, 5000, 'highpass'); },
    pfft: function () { noise(.55, .32, 420); polyChord([246.94, 220], .38, .15, .09); },
    thud: function () { tone(115, .24, 'sine', .4, 52); noise(.14, .28, 320); },
    hay: function () { noise(.5, .38, 1800); },
    bullseye: function () { polyChord([783.99, 987.77, 1174.66, 1567.98], .32, .26, .075); noise(1.3, .3, 1200); },
    load: function () { polyChord([261.63, 392.00], .22, .22, .05); },
    boing: function () { tone(260, .38, 'sine', .26, 580); },
    pull: function () { noise(.28, .4, 700); tone(165, .24, 'sine', .26, 115); },
    splash: function () { noise(.85, .62, 650, 'lowpass'); tone(220, .42, 'sine', .26, 75); },
    whistle: function () { polyChord([1567.98, 2093.0], .42, .14, .04); },
    dice: function () { for (var i = 0; i < 5; i++) (function (i) { setTimeout(function () { noise(.06, .28, 2600); }, i * 85); })(i); },
    ladder: function () { polyChord([523.25, 659.25, 783.99, 1046.5], .22, .22, .085); },
    slide: function () { tone(987.77, .62, 'sine', .18, 329.63); },
    star: function () { polyChord([1318.5, 1567.98, 2093.0], .26, .18, .065); }
  };
  K.sfx = function (name, vol) {
    if (K.muted || K.CAPTURE) return;
    var a = K.audio();
    if (a && BUF[name]) { var s = a.createBufferSource(), g = a.createGain(); s.buffer = BUF[name]; g.gain.value = vol || 1; s.connect(g); g.connect(a.destination); s.start(); return; }
    if (SYN[name]) SYN[name]();
  };
  K.loadSounds = function (names, opts) {
    var a = K.audio(); if (!a || K.loadSounds.done || K.CAPTURE) return; K.loadSounds.done = true;
    var list = (opts && opts.noLoops) ? names.slice() : names.concat(['music', 'crowd']);
    list.forEach(function (k) {
      fetch('sfx/' + k + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (b) { return a.decodeAudioData(b); })
        .then(function (buf) { BUF[k] = buf; if (k === 'music' || k === 'crowd') K.loop(k); }).catch(function () {});
    });
  };
  /* Unlock iOS Safari / Android Chrome Web Audio on first user tap */
  ['pointerdown', 'touchstart'].forEach(function (ev) {
    root.addEventListener(ev, function unlock() {
      if (!K.CAPTURE) K.audio();
      root.removeEventListener(ev, unlock, true);
    }, { capture: true, passive: true });
  });
  /* short English phrases spoken aloud (rate .88, pitch 1.05, en-US); silent in automatic tests or when muted; ducks music & crowd cleanly */
  var _duckTimer = null;
  K.duckAudio = function (on, holdMs) {
    if (_duckTimer) { clearTimeout(_duckTimer); _duckTimer = null; }
    K.loopVol('music', on ? .06 : .25);
    K.loopVol('crowd', on ? .05 : .18);
    if (on && holdMs) {
      _duckTimer = setTimeout(function () { K.duckAudio(false); }, holdMs);
    }
  };
  K.say = function (text) {
    if (K.muted || K.CAPTURE || K.DEMO || !root.speechSynthesis || !text) return;
    try {
      var u = new SpeechSynthesisUtterance(String(text)); u.lang = 'en-US'; u.rate = .88; u.pitch = 1.05;
      var v = (speechSynthesis.getVoices() || []).filter(function (x) { return /^en(-|_)US/i.test(x.lang); })[0]; if (v) u.voice = v;
      K.duckAudio(true, Math.max(2200, Math.min(7500, String(text).length * 85)));
      u.onend = u.onerror = function () { K.duckAudio(false); };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  };
  K.loop = function (k) {
    if (loops[k] || !BUF[k]) return;
    var a = K.audio(), s = a.createBufferSource(), g = a.createGain();
    s.buffer = BUF[k]; s.loop = true; g.gain.value = K.muted ? 0 : (k === 'music' ? .25 : .18);
    s.connect(g); g.connect(a.destination); s.start(); loops[k] = g;
  };
  K.loopVol = function (k, v) { if (loops[k] && AC) loops[k].gain.setTargetAtTime(K.muted ? 0 : v, AC.currentTime, .3); };

  /* ---------- world pieces ---------- */
  K.world = {};
  K.world.sky = function (top, mid, bot, theme) {
    if (root.GameQualityCore && root.GameQualityCore.Atmosphere && !K.scene.getObjectByName('gqc-sky-dome')) {
      var atm = root.GameQualityCore.Atmosphere.applyCommercialAtmosphere(K.renderer, K.scene, theme || K._gqcTheme || 'stadium');
      K._gqcAtm = atm;
      K.sun = atm.sun;
      K.onFrame(function (dt, t) { atm.update(t, K.camera); });
      return atm.skyDome;
    }
    var m = new T3.ShaderMaterial({
      side: T3.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T3.Color(top || 0x2b8ae8) }, mid: { value: new T3.Color(mid || 0x7bd3ff) }, bot: { value: new T3.Color(bot || 0xfff3de) } },
      vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 p; void main(){ float h = normalize(p).y; vec3 c = h>0.15 ? mix(mid, top, smoothstep(.15,.7,h)) : mix(bot, mid, smoothstep(-.05,.15,h)); gl_FragColor = vec4(c,1.); }'
    });
    var sky = new T3.Mesh(new T3.SphereGeometry(320, 32, 16), m);
    K.onFrame(function () { sky.position.copy(K.camera.position); });
    K.scene.add(sky); return sky;
  };
  K.world.lights = function () {
    if (K._gqcAtm && K._gqcAtm.sun) return K._gqcAtm.sun;
    if (root.GameQualityCore && root.GameQualityCore.Atmosphere) {
      var atm = root.GameQualityCore.Atmosphere.applyCommercialAtmosphere(K.renderer, K.scene, 'stadium');
      K._gqcAtm = atm;
      K.onFrame(function (dt, t) { atm.update(t, K.camera); });
      return atm.sun;
    }
    // Calibrated Sunlight vs. Fill Contrast: Sun 2.5 @ [35,45,25], Hemi 0.55, Warm Rim 0.60 (#FFE4B5)
    K.scene.add(new T3.HemisphereLight(0x9ce0ff, 0xc49a6c, 0.55));
    var sun = K.sun = new T3.DirectionalLight(0xfff2d6, 2.5);
    sun.castShadow = true; var sm = (K.quality === 'low' || K.MOBILE) ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
    var sc = sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 24; sc.bottom = -24; sc.near = 1; sc.far = 120;
    sc.updateProjectionMatrix();
    K.scene.add(sun); K.scene.add(sun.target);
    var rim = new T3.DirectionalLight(0xffe4b5, 0.60);
    rim.position.set(-20, 18, -30);
    K.scene.add(rim);
    K.onFrame(function () {
      var l = K.cam.look; sun.position.set(l.x + 35, 45, l.z + 25); sun.target.position.set(l.x, 0, l.z); sun.target.updateMatrixWorld();
    });
    return sun;
  };
  K.world.ground = function (color, stripes) {
    var g = new T3.Mesh(new T3.PlaneGeometry(600, 600), K.mat(color || 0x6eb84c));
    g.rotation.x = -Math.PI / 2; g.receiveShadow = true; K.scene.add(g);
    if (stripes) stripes.forEach(function (s) {
      var b = new T3.Mesh(new T3.PlaneGeometry(s.w, s.d), K.mat(s.c || 0x62aa43)); b.rotation.x = -Math.PI / 2; b.position.set(s.x, .004, s.z || 0); b.receiveShadow = true; K.scene.add(b);
    });
    return g;
  };
  K.world.hills = function (x0, x1, z, n) {
    var cols = [0x6eb84c, 0x5ea842, 0x4b8b3b];
    for (var i = 0; i < n; i++) {
      var h = new T3.Mesh(new T3.SphereGeometry(K.rnd(10, 18), 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(cols[i % 3]));
      h.scale.y = K.rnd(.3, .55); h.position.set(K.lerp(x0, x1, i / Math.max(1, n - 1)) + K.rnd(-3, 3), -.5, z - K.rnd(0, 14)); K.scene.add(h);
    }
  };
  K.world.tree = function (x, z, s, pink) {
    var tr = new T3.Group(), cols = [0x5cc46a, 0x4fb562, 0x74d37c];
    var trunk = new T3.Mesh(new T3.CylinderGeometry(.15, .2, 1.2, 8), K.mat(0xb07a52)); trunk.position.y = .6; trunk.castShadow = true; tr.add(trunk);
    var lc = pink ? 0xf59ac3 : cols[(Math.random() * 3) | 0];
    for (var b = 0; b < 3; b++) { var leaf = new T3.Mesh(new T3.SphereGeometry(K.rnd(.6, .9), 14, 10), K.mat(lc)); leaf.position.set(K.rnd(-.3, .3), 1.5 + b * .45, K.rnd(-.3, .3)); leaf.castShadow = true; tr.add(leaf); }
    tr.position.set(x, 0, z); tr.scale.setScalar(s || K.rnd(.9, 1.5)); K.scene.add(tr);
    var ph = Math.random() * 6; K.onFrame(function (dt, t) { tr.rotation.z = Math.sin(t * 1.3 + ph) * .025; });
    return tr;
  };
  K.world.clouds = function (n, x0, x1) {
    var cm = new T3.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .35 }), list = [];
    for (var c = 0; c < n; c++) {
      var cg = new T3.Group();
      for (var p = 0; p < 5; p++) { var puff = new T3.Mesh(new T3.SphereGeometry(K.rnd(1.2, 2.2), 14, 10), cm); puff.position.set(p * 1.6 - 3, K.rnd(-.3, .5), K.rnd(-.5, .5)); puff.scale.y = .7; cg.add(puff); }
      cg.position.set(K.rnd(x0, x1), K.rnd(16, 26), K.rnd(-70, -28)); cg.userData.v = K.rnd(.4, 1.1); K.scene.add(cg); list.push(cg);
    }
    K.onFrame(function (dt) { list.forEach(function (c) { c.position.x += c.userData.v * dt; if (c.position.x > x1 + 20) c.position.x = x0 - 20; }); });
  };
  K.world.flowers = function (n, area) {
    var cols = [0xffffff, 0xff9fc8, 0xffe066, 0xc3a6ff], g = new T3.SphereGeometry(.09, 6, 4);
    for (var i = 0; i < n; i++) {
      var f = new T3.Mesh(g, K.mat(cols[i % 4])); f.position.set(K.rnd(area[0], area[1]), .08, K.rnd(area[2], area[3])); K.scene.add(f);
    }
  };

  /* ---------- particles ---------- */
  var parts = [];
  var sphG = new T3.SphereGeometry(.12, 8, 6), confG = new T3.PlaneGeometry(.12, .2), strawG = new T3.BoxGeometry(.04, .04, .35);
  K.CONF = [0xff6fae, 0xffd84a, 0x4f9dff, 0x2fc58a, 0x9b7bff, 0xffffff, 0xff9f68];
  function addPart(mesh, u) { mesh.userData = u; K.scene.add(mesh); parts.push(mesh); }
  K.fx = {
    puff: function (p, n, o) {   // soft smoke / dust
      o = o || {};
      for (var i = 0; i < (n || 4); i++) {
        var m = new T3.Mesh(sphG, new T3.MeshBasicMaterial({ color: o.color || 0xfff3ea, transparent: true, opacity: o.opacity || .6, depthWrite: false }));
        m.position.set(p.x + K.rnd(-.2, .2) * (o.spread || 1), p.y + K.rnd(0, .15), p.z + K.rnd(-.25, .25) * (o.spread || 1));
        var v = o.dir ? o.dir.clone().multiplyScalar(K.rnd(.6, 1.4)).add(new T3.Vector3(K.rnd(-.6, .6), K.rnd(-.3, .6), K.rnd(-.6, .6))) : new T3.Vector3(K.rnd(-1.4, 1.4), K.rnd(.4, 1.3), K.rnd(-1, 1));
        addPart(m, { kind: 'puff', v: v, life: 0, max: K.rnd(.4, .8) * (o.life || 1), s: K.rnd(.4, .8) * (o.size || 1), o: o.opacity || .6, drag: o.drag || 1.5 });
      }
    },
    confetti: function (p, n) {
      for (var i = 0; i < n; i++) {
        var m = new T3.Mesh(confG, new T3.MeshBasicMaterial({ color: K.CONF[i % K.CONF.length], side: T3.DoubleSide }));
        m.position.set(p.x + K.rnd(-.3, .3), p.y, p.z + K.rnd(-.3, .3));
        var a = K.rnd(0, 6.28), sp = K.rnd(2, 7);
        addPart(m, { kind: 'conf', v: new T3.Vector3(Math.cos(a) * sp * .6, K.rnd(5, 11), Math.sin(a) * sp), r: new T3.Vector3(K.rnd(-9, 9), K.rnd(-9, 9), K.rnd(-9, 9)), life: 0 });
      }
    },
    burst: function (p, color, n, speed, geo) {   // chunky pieces flying out (balloon skin, hay, sparks)
      for (var i = 0; i < n; i++) {
        var m = new T3.Mesh(geo === 'straw' ? strawG : sphG, new T3.MeshLambertMaterial({ color: Array.isArray(color) ? color[i % color.length] : color }));
        m.position.copy(p); m.scale.setScalar(K.rnd(.5, 1.1));
        var d = new T3.Vector3(K.rnd(-1, 1), K.rnd(-.3, 1), K.rnd(-1, 1)).normalize().multiplyScalar(K.rnd(.5, 1) * (speed || 6));
        addPart(m, { kind: 'chunk', v: d, r: new T3.Vector3(K.rnd(-8, 8), K.rnd(-8, 8), K.rnd(-8, 8)), life: 0, max: K.rnd(.8, 1.4) });
      }
    },
    ring: function (p, color, size) {   // expanding shock ring
      var m = new T3.Mesh(new T3.RingGeometry(.6, .8, 40), new T3.MeshBasicMaterial({ color: color || 0xffffff, transparent: true, opacity: .9, side: T3.DoubleSide, depthWrite: false }));
      m.position.copy(p); m.lookAt(K.camera.position);
      addPart(m, { kind: 'ring', life: 0, max: .5, s: size || 4 });
    },
    text: function (txt, p, color, size) {   // floating "+20"
      var tex = K.canvasTex(256, 128, function (x, w, h) {
        x.font = '900 92px Trebuchet MS'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 16; x.strokeStyle = '#2b1d40'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = color || '#fff'; x.fillText(txt, w / 2, h / 2);
      });
      var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      var sz = size || 1.6; s.scale.set(sz * 2, sz, 1); s.position.copy(p); s.renderOrder = 9;
      addPart(s, { kind: 'text', life: 0, max: 1.3, sz: sz, y0: p.y });
    }
  };
  K.onFrame(function (dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var m = parts[i], u = m.userData, dead = false; u.life += dt;
      if (u.kind === 'puff') {
        m.position.addScaledVector(u.v, dt); u.v.multiplyScalar(1 - u.drag * dt); u.v.y += .4 * dt;
        var k = u.life / u.max; m.scale.setScalar(u.s * (1 + k * 2.4)); m.material.opacity = u.o * (1 - k); dead = k >= 1;
      } else if (u.kind === 'conf') {
        u.v.y -= 9 * dt; u.v.multiplyScalar(1 - 1.4 * dt); if (u.v.y < -1.6) u.v.y = -1.6;
        m.position.addScaledVector(u.v, dt); m.rotation.x += u.r.x * dt; m.rotation.y += u.r.y * dt; m.rotation.z += u.r.z * dt;
        if (m.position.y < .03) { m.position.y = .03; u.v.set(0, 0, 0); u.r.set(0, 0, 0); m.rotation.set(-Math.PI / 2, 0, m.rotation.z); }
        dead = u.life > 10;
      } else if (u.kind === 'chunk') {
        u.v.y -= 12 * dt; m.position.addScaledVector(u.v, dt); m.rotation.x += u.r.x * dt; m.rotation.z += u.r.z * dt;
        if (m.position.y < .05) { m.position.y = .05; u.v.multiplyScalar(.4); u.v.y = Math.abs(u.v.y) * .3; }
        if (u.life > u.max) m.scale.multiplyScalar(1 - 6 * dt); dead = u.life > u.max + .6;
      } else if (u.kind === 'ring') {
        var kr = u.life / u.max; m.scale.setScalar(1 + kr * u.s); m.material.opacity = .9 * (1 - kr); dead = kr >= 1;
      } else if (u.kind === 'text') {
        var kt = u.life / u.max, pop = Math.min(1, u.life * 6);
        m.position.y = u.y0 + kt * 1.6; m.scale.set(u.sz * 2 * K.easeOutBack(pop), u.sz * K.easeOutBack(pop), 1);
        m.material.opacity = kt > .7 ? 1 - (kt - .7) / .3 : 1; dead = kt >= 1;
      }
      if (dead) { K.scene.remove(m); if (m.material.map && u.kind === 'text') m.material.map.dispose(); m.material.dispose(); parts.splice(i, 1); }
    }
  });

  /* ---------- camera helper ---------- */
  K.cam = {
    pos: new T3.Vector3(0, 3, 10), look: new T3.Vector3(0, 1, 0), tPos: new T3.Vector3(0, 3, 10), tLook: new T3.Vector3(0, 1, 0), k: 2.5, shakeT: 0, drift: true,
    set: function (p, l, k) { this.tPos.copy(p); this.tLook.copy(l); if (k) this.k = k; },
    snap: function () { this.pos.copy(this.tPos); this.look.copy(this.tLook); },
    shake: function (s) { this.shakeT = Math.max(this.shakeT, s || .3); },
    update: function (dt) {
      if (this.manual) return;
      if (this.follow) this.follow(dt);
      var f = 1 - Math.exp(-dt * this.k);
      this.pos.lerp(this.tPos, f); this.look.lerp(this.tLook, f);
      var t = K.now, c = K.camera;
      c.position.copy(this.pos);
      if (!this.noPortraitPull && c.aspect > 0 && c.aspect < 1.15) {
        var pull = K.clamp(1.12 / Math.max(0.45, Math.pow(c.aspect, 0.72)), 1, 1.92);
        c.position.sub(this.look).multiplyScalar(pull).add(this.look);
      }
      if (this.drift) { c.position.x += Math.sin(t * .9) * .05; c.position.y += Math.sin(t * 1.3) * .04; }
      if (this.shakeT > 0) { this.shakeT -= dt; var a = this.shakeT * 1.2; c.position.x += K.rnd(-a, a); c.position.y += K.rnd(-a, a); }
      c.lookAt(this.look);
    }
  };

  /* ---------- 3D models ---------- */
  var bufCache = {};
  K.loadGLB = function (url) {
    var p = bufCache[url] || (bufCache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }));
    return p.then(function (buf) { return new Promise(function (res, rej) { new T3.GLTFLoader().parse(buf.slice(0), '', res, rej); }); });
  };
  K.tryGLB = function (url) { return K.loadGLB(url).catch(function () { return null; }); };
  /* fit a loaded model: height h, feet at y=0, centred */
  K.fitModel = function (obj, h, opts) {
    opts = opts || {};
    obj.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(obj), size = box.getSize(new T3.Vector3());
    var s = opts.byLength ? h / Math.max(size.x, size.z) : h / size.y;
    obj.scale.multiplyScalar(s); obj.updateMatrixWorld(true);
    box.setFromObject(obj); var c = box.getCenter(new T3.Vector3());
    obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= box.min.y;
    obj.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = !!opts.receive; if (o.material) { o.material.metalness = 0; o.material.roughness = Math.max(.6, o.material.roughness || .6); } } });
    return obj;
  };

  /* ---------- characters ----------
     Both kinds share: .root (place it), .body (bounces), .setState(name), .update(dt), .height
     States: idle wave hello cheer clap sad hop fly tumble dizzy shrug ready run stumble */
  var BONES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm', 'LeftHand', 'RightHand', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'];
  var AX = K.AX = { L: new T3.Vector3(1, 0, 0), U: new T3.Vector3(0, 1, 0), F: new T3.Vector3(0, 0, 1) };
  var _q = new T3.Quaternion(), _pw = new T3.Quaternion(), _pwi = new T3.Quaternion(), _rq = new T3.Quaternion(), _ax = new T3.Vector3();

  function Character() {}
  Character.prototype.setState = function (st) { if (this.state !== st) { this.state = st; this.stateT = 0; } };
  Character.prototype.base = function (height) {
    this.root = new T3.Group(); this.body = new T3.Group(); this.inner = new T3.Group();
    this.root.add(this.body); this.body.add(this.inner);
    this.height = height; this.state = 'idle'; this.stateT = 0; this.seed = Math.random() * 10; this.phase = 0; this.speed = 0;
    this.extraSpin = new T3.Euler();
  };

  /* --- rigged kid (Mixamo skeleton from Tripo) --- */
  function Kid(gltf, height) {
    var self = this; this.base(height || 1.6); this.kind = 'kid';
    var model = gltf.scene; this.inner.add(model);
    this.bones = {}; this.allBones = {}; this.rest = {};
    model.traverse(function (o) {
      if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; if (o.material) { o.material.metalness = 0; o.material.roughness = .75; } }
      if (o.isBone) { var k = o.name.replace(/^mixamorig:?/, ''); self.allBones[k] = o; if (BONES.indexOf(k) >= 0) { self.bones[k] = o; self.rest[k] = o.quaternion.clone(); } }
    });
    this.root.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(model), h = box.max.y - box.min.y, s = this.height / h;
    model.scale.multiplyScalar(s); model.position.y -= box.min.y * s;
    this.root.updateMatrixWorld(true);
    var pa = new T3.Vector3(), pb = new T3.Vector3();
    this.bones.LeftArm.getWorldPosition(pa); this.bones.RightArm.getWorldPosition(pb);
    var left = pa.sub(pb); left.y = 0; left.normalize();
    var fwd = new T3.Vector3().crossVectors(left, AX.U).normalize();
    this.inner.rotation.y = -Math.atan2(fwd.x, fwd.z);   // model front -> +Z of root
    this.root.updateMatrixWorld(true);
    model.traverse(function (o) {
      if (o.isMesh && o.geometry && o.geometry.attributes && o.geometry.attributes.position) {
        o.geometry = o.geometry.clone();
        _ensureStandaloneFloatPos(o.geometry);
        o.userData._restToRoot = o.matrixWorld.clone();
      }
    });
    function armOut(a, f, sg) { var p1 = new T3.Vector3(), p2 = new T3.Vector3(); self.bones[a].getWorldPosition(p1); self.bones[f].getWorldPosition(p2); var d = p2.sub(p1); return Math.atan2(sg * d.x, -d.y); }
    this.outL = armOut('LeftArm', 'LeftForeArm', 1); this.outR = armOut('RightArm', 'RightForeArm', -1);
    this.P = this.pose('idle', 0);
    this.model = model;
    this.mixer = new T3.AnimationMixer(model);
    this.actions = {};
    this.activeAction = null;
    this.useMixer = false;
    // Automatically attach shared Blender 5.3 65-bone sports & celebration clips to every rigged Kid!
    if (K.loadAnimClips) {
      Promise.all([
        K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-sports-anims.glb').catch(function () { return []; }),
        K.loadAnimClips(K.ROOT + 'assets/3d/characters/kid-tug-anims.glb').catch(function () { return []; })
      ]).then(function (sets) {
        self.attachClips((sets[0] || []).concat(sets[1] || []));
      });
    }
  }
  Kid.prototype = Object.create(Character.prototype);
  Kid.prototype.pose = function (st, t) {
    var P = { thighL: 0, thighR: 0, kneeL: .05, kneeR: .05, footL: 0, footR: 0, armL: 0, armR: 0, liftL: .08, liftR: .08, elbowL: -.25, elbowR: -.25,
      lean: 0, twist: 0, headP: 0, headY: 0, headR: 0, bob: 0, bodyR: 0, bodyP: 0, jump: 0 };
    var sd = this.seed, s, k, w, u;
    switch (st) {
      case 'idle':
        P.lean = .03 * Math.sin(t * 2 + sd); P.headY = .35 * Math.sin(t * .6 + sd); P.headP = .06 * Math.sin(t * 1.3 + sd);
        P.armL = .06 * Math.sin(t * 2 + sd); P.armR = -.06 * Math.sin(t * 2 + sd); P.bodyR = .03 * Math.sin(t * 1.1 + sd); P.bob = .012 * Math.sin(t * 4 + sd);
        P.kneeL = .08 + .06 * Math.max(0, Math.sin(t * 1.1 + sd)); P.kneeR = .08 + .06 * Math.max(0, -Math.sin(t * 1.1 + sd)); break;
      case 'ready':
        P.lean = .45; P.headP = -.35; P.thighL = -.55; P.thighR = .35; P.kneeL = .9; P.kneeR = .6; P.footL = -.3;
        P.armL = .6; P.armR = -.5; P.elbowL = -1.1; P.elbowR = -1.1; P.bob = -.12 + .015 * Math.sin(t * 9 + sd); P.liftL = P.liftR = .1; break;
      case 'run':
        var p = this.phase; s = Math.sin(p); var c = Math.cos(p); k = K.clamp(this.speed / 7, .35, 1);
        P.thighL = -.95 * s * k; P.thighR = .95 * s * k;
        P.kneeL = .25 + 1.35 * k * Math.max(0, -Math.sin(p - .9)); P.kneeR = .25 + 1.35 * k * Math.max(0, Math.sin(p - .9));
        P.footL = -.35 * k * Math.max(0, c); P.footR = -.35 * k * Math.max(0, -c);
        P.armL = .95 * s * k; P.armR = -.95 * s * k; P.elbowL = -1.35; P.elbowR = -1.35; P.liftL = P.liftR = .14;
        P.lean = .22 + .12 * k; P.twist = .2 * s * k; P.headP = -.12; P.headY = -.12 * s * k; P.bob = .09 * k * Math.abs(c) - .03; break;
      case 'stumble':
        u = K.clamp(t / 1.6, 0, 1); w = Math.sin(u * Math.PI);
        P.bodyP = .55 * Math.sin(u * Math.PI) * (1 - u) + .2 * w * Math.sin(t * 14) * (1 - u); P.bodyR = .35 * Math.sin(t * 9) * (1 - u);
        P.lean = .5 * w; P.headP = -.4 * w; P.headY = .5 * Math.sin(t * 16) * (1 - u);
        P.liftL = 1.9 * w + .25 * Math.sin(t * 22) * w; P.liftR = 1.9 * w + .25 * Math.sin(t * 22 + 1) * w;
        P.elbowL = -.4 - .6 * Math.sin(t * 18) * w; P.elbowR = -.4 + .6 * Math.sin(t * 18) * w;
        P.thighL = -.5 * w; P.kneeL = .3 + .6 * w; P.thighR = .35 * w; P.kneeR = .2 + .5 * w; P.bob = -.12 * w; break;
      case 'wave': case 'hello':
        P.headY = .45; P.lean = -.05; P.bodyR = -.06; P.liftR = 2.7; P.elbowR = -.35 + .55 * Math.sin(t * 11); P.liftL = .2; P.bob = .015 * Math.sin(t * 8); break;
      case 'cheer':
        var j = Math.abs(Math.sin(t * 5.2));
        P.jump = .55 * j; P.liftL = 2.8 + .2 * Math.sin(t * 10.4); P.liftR = 2.8 + .2 * Math.sin(t * 10.4 + 1);
        P.elbowL = P.elbowR = -.25; P.headP = -.25; P.lean = -.12; P.thighL = P.thighR = -.35 * (1 - j); P.kneeL = P.kneeR = .2 + .9 * (1 - j); break;
      case 'clap':
        var cl = Math.sin(t * 13);
        P.armL = -1.0; P.armR = -1.0; P.liftL = .35 + .25 * cl; P.liftR = .35 + .25 * cl; P.elbowL = -1.0; P.elbowR = -1.0;
        P.headP = -.12; P.headY = .2 * Math.sin(t * 2 + sd); P.bob = .04 * Math.abs(Math.sin(t * 6.5)); break;
      case 'sad':
        P.lean = .3; P.headP = .45; P.liftL = .02; P.liftR = .02; P.armL = .15; P.armR = .15; P.kneeL = .15; P.kneeR = .15; P.bob = -.04; break;
      case 'shrug':
        u = Math.sin(Math.min(1, t * 2) * Math.PI * .5);
        P.liftL = .7 * u; P.liftR = .7 * u; P.elbowL = -1.4 * u; P.elbowR = -1.4 * u; P.armL = -.3 * u; P.armR = -.3 * u;
        P.headR = .25 * Math.sin(t * 3); P.headP = -.05; P.bob = .03 * u; break;
      case 'hop':   // crouch then spring (used while flying up into the cannon)
        P.thighL = P.thighR = -.9; P.kneeL = P.kneeR = 1.6; P.lean = .4; P.liftL = P.liftR = 2.2; P.elbowL = P.elbowR = -.3; P.headP = -.3; break;
      case 'fly':   // superhero: arms forward, legs back, wiggling
        P.bodyP = 1.25; P.armL = -2.9 + .15 * Math.sin(t * 9); P.armR = -2.9 + .15 * Math.sin(t * 9 + 1); P.liftL = P.liftR = .25; P.elbowL = P.elbowR = -.1;
        P.thighL = .25 + .3 * Math.sin(t * 12); P.thighR = .25 - .3 * Math.sin(t * 12); P.kneeL = P.kneeR = .5; P.headP = -.7; break;
      case 'tumble':   // flailing while spinning (spin itself is done by the game)
        P.liftL = 1.6 + .6 * Math.sin(t * 17); P.liftR = 1.6 + .6 * Math.sin(t * 17 + 2); P.elbowL = -.8 * Math.abs(Math.sin(t * 13)); P.elbowR = -.8 * Math.abs(Math.cos(t * 13));
        P.thighL = -.8 + .6 * Math.sin(t * 15); P.thighR = -.8 - .6 * Math.sin(t * 15); P.kneeL = P.kneeR = 1.0; P.headP = -.2; break;
      case 'kick':   // wind up then swing the right leg through (0.5 s)
        u = K.clamp(t / .5, 0, 1);
        var sw = u < .45 ? -u / .45 : -1 + (u - .45) / .55 * 2.6;   // back then forward
        P.thighR = K.clamp(sw, -1, 1.6) * -1; P.kneeR = u < .45 ? 1.2 * (u / .45) : 1.2 * (1 - (u - .45) / .55);
        P.thighL = .15; P.kneeL = .25; P.lean = u < .45 ? -.1 : .25; P.liftL = 1.0; P.liftR = .7; P.armL = -.5; P.armR = .6; P.elbowL = P.elbowR = -.4; P.headP = .2; break;
      case 'keeper':   // goalkeeper ready: crouched, arms wide, shuffling
        P.thighL = P.thighR = -.55; P.kneeL = P.kneeR = 1.0; P.lean = .3; P.liftL = P.liftR = 1.1 + .1 * Math.sin(t * 6); P.elbowL = P.elbowR = -.6;
        P.armL = P.armR = -.4; P.headP = -.2; P.bob = -.14 + .03 * Math.abs(Math.sin(t * 6)); P.bodyR = .06 * Math.sin(t * 3); break;
      case 'dive':   // stretched out, arms up over the head
        P.liftL = P.liftR = 2.9; P.elbowL = P.elbowR = -.05; P.thighL = .1; P.thighR = -.2; P.kneeL = .2; P.kneeR = .4; P.headP = -.1; break;
      case 'headhands':   // "oh no!" hands on head
        P.liftL = P.liftR = 2.2; P.elbowL = P.elbowR = -2.3; P.armL = P.armR = -.3; P.headP = .25 + .06 * Math.sin(t * 3); P.lean = .1; P.headY = .25 * Math.sin(t * 2); break;
      case 'dizzy':
        P.bodyR = .22 * Math.sin(t * 4); P.bodyP = .12 * Math.cos(t * 4); P.headR = .3 * Math.sin(t * 4 + 1); P.headY = .3 * Math.cos(t * 4);
        P.liftL = .5 + .2 * Math.sin(t * 4); P.liftR = .5 + .2 * Math.cos(t * 4); P.elbowL = P.elbowR = -.2; P.kneeL = P.kneeR = .35; P.bob = -.06; break;
      case 'sit':   // seated on amphitheatre / classroom bench: thighs horizontal, knees 90°, hands on knees, gentle leg swing
        P.thighL = -1.48; P.thighR = -1.48;
        P.kneeL = 1.50 + .09 * Math.sin(t * 2.1 + sd); P.kneeR = 1.50 - .09 * Math.sin(t * 2.1 + sd);
        P.footL = .08; P.footR = .08;
        P.lean = .07 + .025 * Math.sin(t * 1.5 + sd);
        P.armL = -.56; P.armR = -.56; P.liftL = .14; P.liftR = .14; P.elbowL = -.76; P.elbowR = -.76;
        P.headY = .28 * Math.sin(t * .65 + sd); P.headP = .04 + .05 * Math.sin(t * 1.1 + sd);
        P.bob = -this.height * .235; break;
      case 'sitWave':   // seated on bench raising hand / waving eagerly ("Pick me!")
        P.thighL = -1.48; P.thighR = -1.48; P.kneeL = 1.50; P.kneeR = 1.50; P.footL = P.footR = .08;
        P.lean = -.03; P.armL = -.56; P.liftL = .14; P.elbowL = -.76;
        P.liftR = 2.68; P.armR = -.15; P.elbowR = -.28 + .46 * Math.sin(t * 10.5);
        P.headY = .18; P.headP = -.12; P.bob = -this.height * .235; break;
      case 'sitClap':   // seated on bench clapping happily
        var scl = Math.sin(t * 12.5);
        P.thighL = -1.48; P.thighR = -1.48; P.kneeL = 1.50; P.kneeR = 1.50; P.footL = P.footR = .08;
        P.armL = -.96; P.armR = -.96; P.liftL = .34 + .22 * scl; P.liftR = .34 + .22 * scl; P.elbowL = -.96; P.elbowR = -.96;
        P.headP = -.08; P.headY = .16 * Math.sin(t * 2.2 + sd); P.bob = -this.height * .235 + .02 * Math.abs(Math.sin(t * 6.2)); break;
      case 'sitCheer':   // seated celebration (+XP!)
        P.thighL = -1.42; P.thighR = -1.42; P.kneeL = 1.45; P.kneeR = 1.45; P.footL = P.footR = .08;
        P.liftL = 2.75 + .18 * Math.sin(t * 10); P.liftR = 2.75 + .18 * Math.sin(t * 10 + 1); P.elbowL = P.elbowR = -.25;
        P.lean = -.08; P.headP = -.22; P.bob = -this.height * .215 + .05 * Math.abs(Math.sin(t * 7.5)); break;
    }
    return P;
  };
  Kid.prototype.rot = function (name, axis, ang) {
    if (!ang) return; var b = this.bones[name]; if (!b) return;
    this.body.getWorldQuaternion(_q); _ax.copy(axis).applyQuaternion(_q); _rq.setFromAxisAngle(_ax, ang);
    b.parent.getWorldQuaternion(_pw); _pwi.copy(_pw).invert(); b.quaternion.premultiply(_pwi.multiply(_rq).multiply(_pw));
  };
  var CLIP_CACHE = {};
  K.loadAnimClips = function (url) {
    if (!CLIP_CACHE[url]) {
      CLIP_CACHE[url] = K.loadGLB(url).then(function (g) { return g.animations || []; });
    }
    return CLIP_CACHE[url];
  };
  Kid.prototype.attachClips = function (clips) {
    var self = this;
    (clips || []).forEach(function (cl) {
      self.actions[cl.name] = self.mixer.clipAction(cl);
    });
    return this;
  };
  Kid.prototype.playClip = function (name, opts) {
    opts = opts || {};
    var next = this.actions[name];
    if (!next) return false;
    this.useMixer = true;
    this.body.position.set(0, 0, 0);
    // All Blender clips in kid-sports-anims.glb & kid-tug-anims.glb carry a -90deg Hips yaw;
    // compensate +PI/2 on body so characters always face +Z of kid.root!
    this.body.rotation.set(0, Math.PI / 2, 0);
    next.enabled = true;
    next.setLoop(opts.once ? T3.LoopOnce : T3.LoopRepeat, opts.once ? 1 : Infinity);
    next.clampWhenFinished = !!opts.once;
    next.timeScale = opts.speed != null ? opts.speed : 1;
    if (this.activeAction === next && !opts.restart) return true;
    next.reset();
    if (opts.startPhase) next.time = opts.startPhase * next.getClip().duration;
    if (this.activeAction && this.activeAction !== next) {
      next.play();
      this.activeAction.crossFadeTo(next, opts.fade != null ? opts.fade : 0.22, false);
    } else {
      next.play();
    }
    this.activeAction = next;
    return true;
  };
  Kid.prototype.stopClip = function () {
    if (this.activeAction) { this.activeAction.stop(); this.activeAction = null; }
    this.useMixer = false;
    this.body.rotation.set(0, 0, 0);
  };
  Kid.prototype.getBoneWorldPos = function (shortName, out) {
    var b = this.bones[shortName];
    return b ? b.getWorldPosition(out || new T3.Vector3()) : (out || new T3.Vector3()).copy(this.root.position);
  };
  // Map standard states to real Blender 5.3 skeletal clips automatically when available
  var STATE_CLIP_MAP = {
    run:       { clip: 'SprintRun',  speed: 1.35 },
    turbo:     { clip: 'SprintTurbo', speed: 1.55 },
    ready:     { clip: 'SprintSet',  speed: 1.0  },
    kick:      { clip: 'SoccerKick', speed: 1.35, once: true },
    keeper:    { clip: 'KeeperReady', speed: 1.0 },
    cheer:     { clip: 'TugWin',     speed: 1.05 },
    clap:      { clip: 'SideCheer',  speed: 1.05 },
    headhands: { clip: 'HandsHead',  speed: 1.0  },
    sad:       { clip: 'HandsHead',  speed: 0.85 },
    stumble:   { clip: 'TugSlip',    speed: 1.25 },
    hop:       { clip: 'BoardHop',   speed: 1.25 },
    bowl:      { clip: 'BowlThrow',  speed: 1.25, once: true },
    bombhold:  { clip: 'BombHold',   speed: 1.15 },
    bombpass:  { clip: 'BombPass',   speed: 1.35, once: true }
  };
  Kid.prototype.setState = function (st) {
    if (this.state !== st) { this.state = st; this.stateT = 0; }
    var m = STATE_CLIP_MAP[st];
    if (m && this.actions && this.actions[m.clip]) {
      this.playClip(m.clip, { speed: m.speed, once: !!m.once, fade: 0.16, restart: !!m.once });
    } else if (this.useMixer && !m) {
      this.stopClip();
    }
  };
  Kid.prototype.update = function (dt) {
    this.stateT += dt;
    var hasSync = !!(this._syncHead || (this._itemSyncs && this._itemSyncs.length));
    if (this.useMixer && this.mixer) {
      this.mixer.update(dt);
      if (hasSync) {
        if (this._syncHeadPrep) this._syncHeadPrep();
        this.root.updateMatrixWorld(true);
        if (this._syncHead) this._syncHead(K.now, this.state);
        if (this._itemSyncs) {
          for (var mi = 0; mi < this._itemSyncs.length; mi++) this._itemSyncs[mi](K.now);
        }
      }
      return;
    }
    if (this.state === 'run') this.phase += dt * (5 + this.speed * 1.55);
    var tgt = this.pose(this.state, this.stateT), fast = /run|stumble|cheer|clap|tumble|fly|dizzy|sitWave|sitClap|sitCheer/.test(this.state);
    var rate = 1 - Math.exp(-dt * (fast ? 22 : 10));
    for (var key in tgt) this.P[key] = K.lerp(this.P[key], tgt[key], rate);
    var P = this.P;
    this.body.position.y = P.bob + P.jump;
    this.body.rotation.set(0, 0, 0);
    // pitch around the hips height so lying flat (fly) looks right
    this.body.position.y += Math.sin(Math.abs(P.bodyP)) * this.height * .1;
    this.body.rotateOnAxis(AX.L, P.bodyP); this.body.rotateOnAxis(AX.F, P.bodyR);
    for (var n in this.rest) this.bones[n].quaternion.copy(this.rest[n]);
    var L = AX.L, U = AX.U, F = AX.F;
    this.rot('Spine', L, P.lean * .5); this.rot('Spine1', L, P.lean * .3); this.rot('Spine1', U, P.twist); this.rot('Spine2', L, P.lean * .2);
    this.rot('Neck', L, P.headP * .4); this.rot('Head', L, P.headP * .6 - P.lean * .4); this.rot('Head', U, P.headY); this.rot('Head', F, P.headR);
    this.rot('LeftArm', F, -(this.outL - P.liftL)); this.rot('RightArm', F, (this.outR - P.liftR));
    this.rot('LeftArm', L, -P.armL); this.rot('RightArm', L, -P.armR);
    this.rot('LeftForeArm', L, P.elbowL); this.rot('RightForeArm', L, P.elbowR);
    this.rot('LeftUpLeg', L, P.thighL); this.rot('RightUpLeg', L, P.thighR);
    this.rot('LeftLeg', L, P.kneeL); this.rot('RightLeg', L, P.kneeR);
    this.rot('LeftFoot', L, P.footL - (P.kneeL - .05) * .35 - P.thighL * .3);
    this.rot('RightFoot', L, P.footR - (P.kneeR - .05) * .35 - P.thighR * .3);
    if (hasSync) {
      if (this._syncHeadPrep) this._syncHeadPrep();
      this.root.updateMatrixWorld(true);
      if (this._syncHead) this._syncHead(K.now, this.state);
      if (this._itemSyncs) {
        for (var si = 0; si < this._itemSyncs.length; si++) this._itemSyncs[si](K.now);
      }
    }
  };

  /* --- Seamless 3D Pupil Head Mounting & 3D Shop Items for Rigged Kids (v8 Precision Engine) --- */
  function _smoothstep(e0, e1, x) { var t = K.clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function _ensureStandaloneFloatPos(geom) {
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
    geom.setAttribute('position', new T3.BufferAttribute(f32, 3));
    geom.userData._origPos = new Float32Array(f32);
    return geom.userData._origPos;
  }
  function _sampleHeadSkinRGB(tex) {
    try {
      var img = tex && tex.image; if (!img || !img.width) return [214, 152, 118];
      var cv = document.createElement('canvas'), S = 160; cv.width = S; cv.height = S;
      var ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, S, S);
      var d = ctx.getImageData(0, 0, S, S).data, rs = [], gs = [], bs = [];
      for (var i = 0; i < d.length; i += 4) {
        var r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > 135 && r < 248 && g > 92 && g < 218 && b > 58 && b < 185 &&
            r > g + 16 && g > b + 10 && (r - b) > 36 && (r - b) < 145) { rs.push(r); gs.push(g); bs.push(b); }
      }
      if (rs.length < 25) return [214, 152, 118];
      rs.sort(function (a, b) { return a - b; }); gs.sort(function (a, b) { return a - b; }); bs.sort(function (a, b) { return a - b; });
      var m = Math.floor(rs.length * 0.48); return [rs[m], gs[m], bs[m]];
    } catch (e) { return [214, 152, 118]; }
  }
  function _syncBodySkinToHead(kid, targetRGB) {
    var done = false;
    (kid.inner || kid.root).traverse(function (o) {
      if (done || !o.isMesh || !o.material || !o.material.map || !o.material.map.image) return;
      if (!o.userData._origShirtImg) o.userData._origShirtImg = o.material.map.image;
      var img = o.userData._origShirtImg; if (!img.width) return;
      done = true;
      var cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
      var ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0);
      var id = ctx.getImageData(0, 0, cv.width, cv.height), d = id.data;
      function sw(r, g, b) {
        if (r < 118 || g < 78 || b < 55 || b >= g - 2) return 0;
        var rg = r - g, gb = g - b, rb = r - b;
        return _smoothstep(10, 24, rg) * (1 - _smoothstep(66, 90, rg)) *
               _smoothstep(6, 16, gb) * (1 - _smoothstep(46, 65, gb)) *
               _smoothstep(20, 38, rb) * (1 - _smoothstep(105, 130, rb)) *
               _smoothstep(118, 148, r) * _smoothstep(78, 108, g);
      }
      var rs = [], gs = [], bs = [];
      for (var j = 0; j < d.length; j += 16) if (sw(d[j], d[j + 1], d[j + 2]) > 0.6) { rs.push(d[j]); gs.push(d[j + 1]); bs.push(d[j + 2]); }
      var br = 222, bg = 160, bb = 132;
      if (rs.length > 20) {
        rs.sort(function (a, b) { return a - b; }); gs.sort(function (a, b) { return a - b; }); bs.sort(function (a, b) { return a - b; });
        var m = Math.floor(rs.length * 0.5); br = rs[m]; bg = gs[m]; bb = bs[m];
      }
      var kR = (br * 0.08 + targetRGB[0] * 0.92) / br, kG = (bg * 0.08 + targetRGB[1] * 0.92) / bg, kB = (bb * 0.08 + targetRGB[2] * 0.92) / bb;
      for (var i = 0; i < d.length; i += 4) {
        var r = d[i], g = d[i + 1], b = d[i + 2], w = sw(r, g, b);
        if (w > 0.01) {
          d[i]     = Math.round(r + (K.clamp(r * kR, 0, 255) - r) * w);
          d[i + 1] = Math.round(g + (K.clamp(g * kG, 0, 255) - g) * w);
          d[i + 2] = Math.round(b + (K.clamp(b * kB, 0, 255) - b) * w);
        }
      }
      ctx.putImageData(id, 0, 0);
      var nt = new T3.CanvasTexture(cv); nt.flipY = false;
      if (T3.SRGBColorSpace) nt.colorSpace = T3.SRGBColorSpace;
      nt.anisotropy = 4;
      o.material = o.material.clone(); o.material.map = nt; o.material.roughness = 0.74; o.material.metalness = 0; o.material.needsUpdate = true;
    });
  }
  function _analyzeHeadGeom(headModel) {
    headModel.updateMatrixWorld(true);
    var box = new T3.Box3().setFromObject(headModel), sz = box.getSize(new T3.Vector3()), ctr = box.getCenter(new T3.Vector3());
    var chinY = Infinity, rawNoseY = -Infinity, rawNoseZ = -Infinity, v = new T3.Vector3(), allPts = [];
    headModel.traverse(function (o) {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      var pos = o.geometry.attributes.position;
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
        allPts.push(v.x, v.y, v.z);
        if (Math.abs(v.x - ctr.x) < sz.x * 0.08 && v.z > ctr.z + sz.z * 0.08 && v.y < chinY) chinY = v.y;
      }
    });
    if (!isFinite(chinY)) chinY = box.min.y + sz.y * 0.05;
    for (var pi = 0; pi < allPts.length; pi += 3) {
      var px = allPts[pi], py = allPts[pi + 1], pz = allPts[pi + 2];
      if (Math.abs(px - ctr.x) < sz.x * 0.055 && py >= chinY + sz.y * 0.12 && py <= chinY + sz.y * 0.48) {
        if (pz > rawNoseZ) { rawNoseZ = pz; rawNoseY = py; }
      }
    }
    if (!isFinite(rawNoseY)) { rawNoseY = chinY + sz.y * 0.25; rawNoseZ = box.max.z; }
    var nb = 12, yLo = rawNoseY + sz.y * 0.025, yHi = rawNoseY + sz.y * 0.22, bStep = (yHi - yLo) / nb;
    var bestBridgeZ = Infinity, bestEyeY = NaN;
    for (var bi = 0; bi < nb; bi++) {
      var b0 = yLo + bi * bStep, b1 = b0 + bStep * 1.35, bzs = [];
      for (var qi = 0; qi < allPts.length; qi += 3) {
        if (Math.abs(allPts[qi] - ctr.x) < sz.x * 0.045 && allPts[qi + 1] >= b0 && allPts[qi + 1] <= b1 && allPts[qi + 2] > ctr.z) bzs.push(allPts[qi + 2]);
      }
      if (bzs.length >= 3) {
        bzs.sort(function (a, b) { return a - b; });
        var mz = bzs[Math.floor(bzs.length * 0.85)];
        if (mz < bestBridgeZ) { bestBridgeZ = mz; bestEyeY = 0.5 * (b0 + b1); }
      }
    }
    var dn = Math.max(rawNoseY - chinY, sz.y * 0.08);
    if (!isFinite(bestEyeY) || (bestEyeY - chinY) < 1.28 * dn || (bestEyeY - chinY) > 1.82 * dn) {
      bestEyeY = chinY + dn * 1.48;
      var ezs = [];
      for (var ei = 0; ei < allPts.length; ei += 3) {
        if (Math.abs(allPts[ei] - ctr.x) < sz.x * 0.05 && Math.abs(allPts[ei + 1] - bestEyeY) < sz.y * 0.02 && allPts[ei + 2] > ctr.z) ezs.push(allPts[ei + 2]);
      }
      bestBridgeZ = ezs.length ? Math.max.apply(null, ezs) : (rawNoseZ - 0.12 * dn);
    }
    var rawEyeH = Math.max(0.05, bestEyeY - chinY), cheekXs = [];
    for (var ci = 0; ci < allPts.length; ci += 6) {
      var cy = allPts[ci + 1] - chinY;
      if (cy >= rawEyeH * 0.30 && cy <= rawEyeH * 1.15 && allPts[ci + 2] > ctr.z + sz.z * 0.14) cheekXs.push(Math.abs(allPts[ci] - ctr.x));
    }
    cheekXs.sort(function (a, b) { return a - b; });
    var rawCheekW = cheekXs.length > 16 ? cheekXs[Math.floor(cheekXs.length * 0.90)] * 2 : sz.x * 0.72;
    return { ctr: ctr, sz: sz, chinY: chinY, rawNoseY: rawNoseY, rawNoseZ: rawNoseZ, bestEyeY: bestEyeY, bestBridgeZ: bestBridgeZ, rawEyeH: rawEyeH, rawCheekW: rawCheekW };
  }
  Kid.prototype._refreshHairTuck = function () {
    var self = this, mode = 'none';
    (self._wornCfgs || []).forEach(function (c) {
      var tk = c && c.tuck;
      if (tk === 'wig' || tk === 'helmet') mode = tk;
      else if (tk === 'hat' && mode !== 'wig' && mode !== 'helmet') mode = 'hat';
      else if (tk === 'band' && mode === 'none') mode = 'band';
    });
    var H = self.height || 1.65, kS = H / 1.65;
    if (self._pupilHeadModel && self._pupilPivot && self._headFit) {
      if (self.inner) {
        self.inner.traverse(function (bo) {
          if (!bo.isMesh || !bo.geometry || !bo.geometry.userData._origPos || !bo.userData._restToRoot) return;
          var bOrig = bo.geometry.userData._origPos, bAttr = bo.geometry.attributes.position, bArr = bAttr.array;
          var toR = bo.userData._restToRoot, toBL = new T3.Matrix4().copy(toR).invert();
          var bv = new T3.Vector3(), sink = new T3.Vector3(0, 1.15 * kS, -0.01 * kS);
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
      var hf = self._headFit, invP = new T3.Matrix4().copy(self._pupilPivot.matrixWorld).invert();
      self._pupilHeadModel.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.userData._origPos) return;
        var orig = o.geometry.userData._origPos, attr = o.geometry.attributes.position, arr = attr.array;
        if (mode === 'none') { arr.set(orig); attr.needsUpdate = true; return; }
        var toPiv = new T3.Matrix4().multiplyMatrices(invP, o.matrixWorld), toLoc = new T3.Matrix4().copy(toPiv).invert();
        var v = new T3.Vector3(), dv = new T3.Vector3(), domeCenter = new T3.Vector3(0, 0.174 * kS, -0.012 * kS), domeR = 0.140 * kS;
        for (var i = 0; i < attr.count; i++) {
          var ix = i * 3;
          v.set(orig[ix], orig[ix + 1], orig[ix + 2]).applyMatrix4(toPiv);
          var wy = 1 - _smoothstep(0.180 * kS, 0.214 * kS, v.y);
          var wz = _smoothstep(0.042 * kS, 0.105 * kS, v.z);
          var wx = 1 - _smoothstep(0.136 * kS, 0.174 * kS, Math.abs(v.x));
          var faceKeep = (v.y >= -0.072 * kS) ? (wy * wz * wx) : 0;
          var neckKeep = (v.y < 0.012 * kS && Math.abs(v.x) < 0.068 * kS && v.z > -0.082 * kS && v.z < 0.068 * kS) ? 1 : 0;
          var tuckScale = 1 - Math.max(faceKeep, neckKeep);
          if (tuckScale > 0.001) {
            if (mode === 'wig' || mode === 'helmet') {
              dv.copy(v).sub(domeCenter); var lenW = dv.length();
              if (lenW > 0.001) { dv.multiplyScalar(Math.min(lenW, domeR * 0.90) / lenW).add(domeCenter); v.lerp(dv, 0.88 * tuckScale); }
            } else if (mode === 'hat') {
              var yRim = 0.194 * kS + 0.14 * (v.z + 0.010 * kS);
              var wRim = _smoothstep(0, 0.042 * kS, v.y - yRim);
              var wBack = _smoothstep(0.142 * kS, 0.178 * kS, v.y) * (1 - _smoothstep(-0.135 * kS, -0.085 * kS, v.z)) * 0.78;
              var wHat = Math.max(wRim, wBack) * tuckScale;
              if (wHat > 0.001) {
                dv.copy(v).sub(domeCenter); var lenH = dv.length();
                if (lenH > domeR) { dv.multiplyScalar(domeR / lenH).add(domeCenter); v.lerp(dv, 0.88 * wHat); }
                else v.lerp(domeCenter, 0.22 * wHat);
              }
            } else if (mode === 'band') {
              var dyB = Math.abs(v.y - 0.228 * kS);
              if (dyB < 0.044 * kS) {
                var wb = (1 - _smoothstep(0.014 * kS, 0.044 * kS, dyB)) * tuckScale;
                v.x *= (1 - 0.26 * wb); v.z = -0.010 * kS + (v.z + 0.010 * kS) * (1 - 0.22 * wb);
              }
            }
            v.applyMatrix4(toLoc);
            arr[ix] = v.x; arr[ix + 1] = v.y; arr[ix + 2] = v.z;
          } else { arr[ix] = orig[ix]; arr[ix + 1] = orig[ix + 1]; arr[ix + 2] = orig[ix + 2]; }
        }
        attr.needsUpdate = true;
      });
    } else if (self.inner) {
      self.inner.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.userData._origPos || !o.userData._restToRoot) return;
        var orig = o.geometry.userData._origPos, attr = o.geometry.attributes.position, arr = attr.array;
        if (mode === 'none') { arr.set(orig); attr.needsUpdate = true; return; }
        var toRoot = o.userData._restToRoot, toLoc = new T3.Matrix4().copy(toRoot).invert();
        var v = new T3.Vector3(), core = new T3.Vector3(0, 1.38 * kS, 0.02 * kS);
        for (var i = 0; i < attr.count; i++) {
          var ix = i * 3;
          v.set(orig[ix], orig[ix + 1], orig[ix + 2]).applyMatrix4(toRoot);
          if (v.y > 1.245 * kS) {
            var inNeck = v.y < 1.31 * kS && Math.abs(v.x) < 0.095 * kS && v.z > -0.055 * kS;
            var inFace = v.y < 1.455 * kS && v.z > 0.055 * kS && Math.abs(v.x) < 0.145 * kS;
            if (!inNeck && !inFace) {
              if (mode === 'wig' || mode === 'helmet') v.lerp(core, 0.78);
              else if (mode === 'hat') {
                if (v.y > 1.42 * kS) {
                  var wh = K.clamp((v.y - 1.42 * kS) / (0.08 * kS), 0, 1);
                  v.x *= (1 - 0.42 * wh); v.z *= (1 - 0.40 * wh); v.y -= (v.y - 1.42 * kS) * 0.58 * wh;
                } else if (v.z < -0.065 * kS && v.y > 1.32 * kS) v.lerp(core, 0.72);
              } else if (mode === 'band') {
                var dyNB = Math.abs(v.y - 1.475 * kS);
                if (dyNB < 0.036 * kS) {
                  var wnb = 1 - _smoothstep(0.012 * kS, 0.036 * kS, dyNB);
                  v.x *= (1 - 0.20 * wnb); v.z *= (1 - 0.18 * wnb);
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
  };
  Kid.prototype.mountHead = function (srcOrBuf, opts) {
    var self = this; opts = opts || {};
    if (!srcOrBuf) return Promise.resolve(self);
    var waitShirt = self._shirtDone || Promise.resolve(self);
    var parseP = (typeof srcOrBuf === 'string')
      ? K.loadGLB(srcOrBuf)
      : new Promise(function (res, rej) { new T3.GLTFLoader().parse(srcOrBuf.slice(0), '', res, rej); });
    return Promise.all([waitShirt, parseP]).then(function (pair) {
      var g = pair[1]; if (!g || !g.scene) return self;
      if (self._pupilHead && self._pupilHead.parent) self._pupilHead.parent.remove(self._pupilHead);
      var H = self.height || 1.65, kS = H / 1.65, headModel = g.scene;
      headModel.updateMatrixWorld(true);
      var hb0 = new T3.Box3().setFromObject(headModel), hsz0 = hb0.getSize(new T3.Vector3());
      var isLegacyV18 = Math.max(hsz0.x, hsz0.y, hsz0.z) < 0.50 && hb0.max.y < 0.321;
      var isMasterCalibrated = Math.max(hsz0.x, hsz0.y, hsz0.z) < 0.72;
      var m = isMasterCalibrated ? null : _analyzeHeadGeom(headModel);
      var s = isMasterCalibrated ? (isLegacyV18 ? 1.25 * kS : kS) : ((0.160 * kS) / Math.max(0.05, m.rawEyeH));
      headModel.scale.setScalar(s); headModel.updateMatrixWorld(true);
      var skinRGB = [214, 152, 118];
      headModel.traverse(function (o) {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = false;
        if (o.geometry && o.geometry.attributes && o.geometry.attributes.position && !o.geometry.userData._origPos) {
          o.geometry = o.geometry.clone();
          _ensureStandaloneFloatPos(o.geometry);
        }
        if (o.material) {
          o.material = o.material.clone(); o.material.metalness = 0; o.material.roughness = 0.76;
          if (o.material.map) {
            skinRGB = _sampleHeadSkinRGB(o.material.map);
            o.material.emissive = new T3.Color(0xfff4ea); o.material.emissiveMap = o.material.map; o.material.emissiveIntensity = 0.15;
          }
          o.material.needsUpdate = true;
        }
      });
      _syncBodySkinToHead(self, skinRGB);
      var pivot = new T3.Group();
      if (isMasterCalibrated) {
        headModel.position.set(0, 0, isLegacyV18 ? (0.005 * kS) : 0);
      } else {
        headModel.position.set(-m.ctr.x * s, -m.bestEyeY * s + 0.122 * kS, -m.bestBridgeZ * s + 0.170 * kS);
      }
      pivot.add(headModel);
      pivot.updateMatrixWorld(true);

      var invPivNeck = new T3.Matrix4().copy(pivot.matrixWorld).invert();
      headModel.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
        var attr = o.geometry.attributes.position, arr = attr.array;
        var toP = new T3.Matrix4().multiplyMatrices(invPivNeck, o.matrixWorld), toL = new T3.Matrix4().copy(toP).invert();
        var vn = new T3.Vector3();
        for (var i = 0; i < attr.count; i++) {
          var ix = i * 3;
          vn.set(arr[ix], arr[ix + 1], arr[ix + 2]).applyMatrix4(toP);
          if (vn.y < -0.052 * kS && Math.abs(vn.x) < 0.068 * kS && vn.z > -0.068 * kS && vn.z < 0.068 * kS) {
            var wn = _smoothstep(-0.052 * kS, -0.075 * kS, vn.y);
            vn.x *= (1 - 0.35 * wn); vn.z *= (1 - 0.35 * wn); vn.y = Math.max(vn.y, -0.068 * kS);
            vn.applyMatrix4(toL);
            arr[ix] = vn.x; arr[ix + 1] = vn.y; arr[ix + 2] = vn.z;
          }
        }
        attr.needsUpdate = true;
        o.geometry.userData._origPos = new Float32Array(arr);
      });

      var chScaled = H * 0.252;
      var topHairY = 0.340 * kS, pv = new T3.Vector3();
      var invPiv = new T3.Matrix4().copy(pivot.matrixWorld).invert();
      headModel.traverse(function (o) {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
        var pos = o.geometry.attributes.position, mLoc = new T3.Matrix4().multiplyMatrices(invPiv, o.matrixWorld);
        for (var i = 0; i < pos.count; i += 2) {
          pv.fromBufferAttribute(pos, i).applyMatrix4(mLoc);
          if (Math.abs(pv.x) < 0.085 * kS && pv.z > -0.085 * kS && pv.z < 0.065 * kS && pv.y > topHairY) topHairY = pv.y;
        }
      });
      self._headFit = {
        ch: chScaled,
        noseZ: 0.212 * kS,
        bridgeZ: 0.170 * kS,
        skullZ: -0.010 * kS,
        eyeY: 0.122 * kS,
        noseY: 0.068 * kS,
        browY: 0.185 * kS,
        crownY: K.clamp(topHairY - 0.014 * kS, 0.298 * kS, 0.365 * kS),
        width: 0.36 * kS
      };

      var nc = new T3.Color();
      if (nc.setRGB && T3.SRGBColorSpace) nc.setRGB(skinRGB[0] / 255, skinRGB[1] / 255, skinRGB[2] / 255, T3.SRGBColorSpace);
      else nc.setRGB(skinRGB[0] / 255, skinRGB[1] / 255, skinRGB[2] / 255).convertSRGBToLinear();
      var nr = H * 0.035, nh = H * 0.080;
      var nGeo = new T3.CylinderGeometry(nr * 1.05, nr * 0.98, nh, 20, 4);
      var nPos = nGeo.attributes.position, nCols = new Float32Array(nPos.count * 3);
      for (var i = 0; i < nPos.count; i++) {
        var tTop = (nPos.getY(i) + nh * 0.5) / nh, sh = 0.92 - Math.pow(tTop, 1.8) * 0.20;
        nCols[i * 3] = nc.r * sh; nCols[i * 3 + 1] = nc.g * sh; nCols[i * 3 + 2] = nc.b * sh;
      }
      nGeo.setAttribute('color', new T3.BufferAttribute(nCols, 3));
      var nb = new T3.Mesh(nGeo, new T3.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 }));
      nb.position.set(0, -0.048 * kS, -0.004 * kS);
      pivot.add(nb);
      var holder = new T3.Group();
      pivot.position.set(0, 0, 0);
      holder.add(pivot); self.root.add(holder);
      self._pupilHead = holder; self._pupilPivot = pivot; self._pupilHeadModel = headModel; self._craniumH = chScaled;
      var headBone = self.bones.Head, neckBone = self.bones.Neck;
      var saved = {};
      for (var k in self.rest) { saved[k] = self.bones[k].quaternion.clone(); self.bones[k].quaternion.copy(self.rest[k]); }
      var sbP = self.body.position.clone(), sbR = self.body.rotation.clone();
      self.body.position.set(0, 0, 0); self.body.rotation.set(0, 0, 0);
      if (headBone) headBone.scale.set(1, 1, 1);
      self.root.updateMatrixWorld(true);
      var rInv = new T3.Quaternion(); self.root.getWorldQuaternion(rInv).invert();
      var rtQ = new T3.Quaternion(); if (headBone) headBone.getWorldQuaternion(rtQ);
      rtQ.premultiply(rInv); var restHeadInv = rtQ.clone().invert();
      self.body.position.copy(sbP); self.body.rotation.copy(sbR);
      for (var k2 in saved) self.bones[k2].quaternion.copy(saved[k2]);
      self.root.updateMatrixWorld(true);
      // Zero-cost unit-scale headSocket under headBone.parent so headBone stays 0.001 permanently (1 updateMatrixWorld instead of 3!)
      var headSocket = null;
      if (headBone && headBone.parent) {
        headSocket = new T3.Object3D();
        headSocket.position.copy(headBone.position);
        headSocket.quaternion.copy(headBone.quaternion);
        headBone.parent.add(headSocket);
        headBone.scale.setScalar(0.001);
        if (neckBone) neckBone.scale.set(1, 1, 1);
      }
      var _p = new T3.Vector3(), _q2 = new T3.Quaternion(), _ri = new T3.Quaternion();
      self._syncHeadPrep = function () {
        if (headSocket && headBone) {
          headSocket.position.copy(headBone.position);
          headSocket.quaternion.copy(headBone.quaternion);
          if (headBone.scale.x > 0.01) headBone.scale.setScalar(0.001);
        }
      };
      self._syncHead = function () {
        if (!headSocket) return;
        headSocket.getWorldPosition(_p);
        headSocket.getWorldQuaternion(_q2);
        self.root.worldToLocal(_p);
        self.root.getWorldQuaternion(_ri).invert();
        _q2.premultiply(_ri).multiply(restHeadInv);
        holder.position.copy(_p); holder.quaternion.copy(_q2);
      };
      self._syncHeadPrep();
      self.root.updateMatrixWorld(true);
      self._syncHead();
      self._refreshHairTuck();
      return self;
    }).catch(function () { return self; });
  };

  var _wear3dP = null;
  function _getWear3d() {
    if (!_wear3dP) _wear3dP = fetch(K.ROOT + 'assets/3d/items/wear3d.json?v=19').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return _wear3dP;
  }
  function _makeBoneTracker(kid, bone, localOff, relaxedArms) {
    if (!bone) return function () {};
    var saved = {};
    for (var k in kid.rest) { saved[k] = kid.bones[k].quaternion.clone(); kid.bones[k].quaternion.copy(kid.rest[k]); }
    var sbP = kid.body.position.clone(), sbR = kid.body.rotation.clone();
    kid.body.position.set(0, 0, 0); kid.body.rotation.set(0, 0, 0);
    if (relaxedArms) {
      kid.root.updateMatrixWorld(true);
      kid.rot('LeftArm', AX.F, -(kid.outL - 0.09));
      kid.rot('RightArm', AX.F, (kid.outR - 0.09));
      kid.rot('LeftForeArm', AX.L, -0.24);
      kid.rot('RightForeArm', AX.L, -0.24);
    }
    kid.root.updateMatrixWorld(true);
    var rInv = new T3.Quaternion(); kid.root.getWorldQuaternion(rInv).invert();
    var bR = new T3.Quaternion(); bone.getWorldQuaternion(bR); bR.premultiply(rInv);
    var bRInv = bR.clone().invert();
    kid.body.position.copy(sbP); kid.body.rotation.copy(sbR);
    for (var k2 in saved) kid.bones[k2].quaternion.copy(saved[k2]);
    kid.root.updateMatrixWorld(true);
    var p = new T3.Vector3(), q = new T3.Quaternion(), ri = new T3.Quaternion(), o = new T3.Vector3();
    return function (wrap) {
      bone.getWorldPosition(p); kid.root.worldToLocal(p);
      bone.getWorldQuaternion(q); kid.root.getWorldQuaternion(ri).invert();
      q.premultiply(ri).multiply(bRInv);
      o.copy(localOff).applyQuaternion(q);
      wrap.position.copy(p).add(o); wrap.quaternion.copy(q);
    };
  }
  function _makePalmGripTracker(kid, localOff, kS) {
    var ab = kid.allBones || kid.bones || {};
    var handBone = ab.LeftHand || ab.RightHand;
    if (!handBone) return function () {};
    var mid2 = ab.LeftHandMiddle2 || ab.LeftHandMiddle1 || null;
    var thb2 = ab.LeftHandThumb2  || ab.LeftHandThumb1  || null;
    var baseTrack = _makeBoneTracker(kid, handBone, new T3.Vector3(0, 0, 0), true);
    var pm = new T3.Vector3(), pt = new T3.Vector3(), o = new T3.Vector3();
    if (!mid2 || !thb2) return _makeBoneTracker(kid, handBone, new T3.Vector3(0.028 * kS, -0.052 * kS, 0.032 * kS).add(localOff), true);
    return function (wrap) {
      baseTrack(wrap);
      mid2.getWorldPosition(pm); thb2.getWorldPosition(pt);
      pm.add(pt).multiplyScalar(0.5);
      kid.root.worldToLocal(pm);
      o.copy(localOff).applyQuaternion(wrap.quaternion);
      wrap.position.copy(pm).add(o);
    };
  }
  function _buildKidItemWrapper(kid, cfg, rawScene, kS) {
    var mesh = rawScene.clone(true);
    mesh.traverse(function (o) {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; if (o.material) o.material.metalness = Math.min(o.material.metalness || 0, 0.42); }
    });
    mesh.updateMatrixWorld(true);
    var rawBox = new T3.Box3().setFromObject(mesh), rawSz = rawBox.getSize(new T3.Vector3());
    var maxRawDim = Math.max(rawSz.x, rawSz.y, rawSz.z, 0.001);
    var orientG = new T3.Group(); orientG.add(mesh);
    var pr = cfg.preRot || [0, 0, 0];
    orientG.rotation.set(pr[0] || 0, pr[1] || 0, pr[2] || 0);
    var targetScale = (cfg.scale || 0.30) * kS;
    if ((cfg.slot === 'headwear' || cfg.slot === 'glasses') && cfg.headMode !== 'clip' && (kid._pupilPivot || kid._kind === 'girl')) {
      targetScale *= 0.95;
    }
    orientG.scale.setScalar(targetScale / maxRawDim);
    orientG.updateMatrixWorld(true);
    if (cfg.anchor !== null) {
      var box2 = new T3.Box3().setFromObject(orientG), anc = cfg.anchor || [0.5, 0.5, 0.5];
      orientG.position.set(
        -(box2.min.x + (box2.max.x - box2.min.x) * anc[0]),
        -(box2.min.y + (box2.max.y - box2.min.y) * anc[1]),
        -(box2.min.z + (box2.max.z - box2.min.z) * anc[2])
      );
    }
    var itemNode = new T3.Group(); itemNode.add(orientG);
    var off = cfg.offset || [0, 0, 0];
    itemNode.position.set((off[0] || 0) * kS, (off[1] || 0) * kS, (off[2] || 0) * kS);
    var rot = cfg.rotation || [0, 0, 0];
    itemNode.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    itemNode.scale.setScalar(cfg.userScale != null ? cfg.userScale : 1);
    var wrap = new T3.Group(); wrap.add(itemNode);
    return wrap;
  }
  Kid.prototype.wearItems = function (itemIds) {
    var self = this;
    if (!Array.isArray(itemIds) || !itemIds.length) return Promise.resolve(self);
    self._itemSyncs = self._itemSyncs || [];
    self._wornCfgs = [];
    var H = self.height || 1.65, kS = H / 1.65, isGirl = self._kind === 'girl';
    return _getWear3d().then(function (W3) {
      var bySlot = {};
      itemIds.forEach(function (id) {
        var c = W3[id]; if (!c) return;
        if (bySlot[c.slot] && W3[bySlot[c.slot]] && W3[bySlot[c.slot]].isWig && !c.isWig) return;
        bySlot[c.slot] = id;
      });
      var uniqueIds = Object.keys(bySlot).map(function (sl) { return bySlot[sl]; });
      var jobs = uniqueIds.map(function (id) {
        var cfg = W3[id]; if (!cfg) return null;
        return K.tryGLB(K.ROOT + 'assets/3d/items/' + id + '.glb').then(function (g) {
          if (!g || !g.scene) return;
          self._wornCfgs.push(cfg);
          var slot = cfg.slot, hm = cfg.headMode || 'hat';
          var wrap = _buildKidItemWrapper(self, cfg, g.scene, kS);
          if (slot === 'headwear' || slot === 'glasses') {
            var isPupil = !!(self._pupilPivot && self._headFit);
            var useGirlSkull = isPupil || isGirl;
            var bx = 0, by = 0.208, bz = -0.010;
            if (slot === 'headwear') {
              if (hm === 'clip') { var nco = cfg.clipOffset || [0.125, 0.78, 0.11]; bx = nco[0]; by = useGirlSkull ? 0.245 : 0.260; bz = nco[2]; }
              else if (hm === 'crown') { by = isPupil ? (self._headFit.crownY / kS) : (useGirlSkull ? 0.302 : 0.322); bz = 0.006; }
              else if (hm === 'band') { by = useGirlSkull ? 0.228 : 0.232; bz = 0; }
              else if (hm === 'helmet') { by = useGirlSkull ? 0.155 : 0.165; bz = 0.010; }
              else if (hm === 'wig') { by = useGirlSkull ? 0.182 : 0.192; bz = -0.012; }
              else { by = useGirlSkull ? 0.208 : 0.215; bz = -0.010; }
            } else {
              if (hm === 'band') { by = 0.118; bz = -0.004; }
              else {
                by = cfg.maskMode === 'lower' ? 0.056 : 0.118;
                bz = isPupil ? 0.154 : 0.158;
              }
            }
            if (isPupil) {
              wrap.position.set(bx * kS, by * kS, bz * kS);
              self._pupilPivot.add(wrap);
            } else {
              self.root.add(wrap);
              var fnH = _makeBoneTracker(self, self.bones.Head, new T3.Vector3(bx * kS, by * kS, bz * kS), false);
              self._itemSyncs.push(function () { fnH(wrap); });
              fnH(wrap);
            }
          } else if (slot === 'back' || slot === 'neck') {
            self.root.add(wrap);
            var off = cfg.socketOffset || (slot === 'back' ? [0, 0.01, -0.088] : [0, 0.098, 0.092]);
            var zGirl = (slot === 'neck' && cfg.neckMode === 'medal' && isGirl) ? 0.014 : 0;
            var fnB = _makeBoneTracker(self, self.bones.Spine2 || self.bones.Spine1, new T3.Vector3(off[0] * kS, off[1] * kS, (off[2] + zGirl) * kS), false);
            self._itemSyncs.push(function () { fnB(wrap); });
            fnB(wrap);
          } else if (slot === 'hand_r' || slot === 'hand_l') {
            self.root.add(wrap);
            var hMode = cfg.handMode || 'hand';
            if (hMode === 'hand') {
              var hOff0 = cfg.socketOffset || [0, 0, 0];
              var fnP = _makePalmGripTracker(self, new T3.Vector3(hOff0[0] * kS, hOff0[1] * kS, hOff0[2] * kS), kS);
              self._itemSyncs.push(function () { fnP(wrap); });
              fnP(wrap);
            } else {
              var hBone = hMode === 'chest'
                ? (self.bones.Spine2 || self.bones.Spine1)
                : (self.bones.LeftForeArm || self.bones.LeftHand);
              var hOff = cfg.socketOffset || [0.048, -0.02, 0.042];
              var zChestGirl = (hMode === 'chest' && isGirl) ? 0.014 : 0;
              var fnR = _makeBoneTracker(self, hBone, new T3.Vector3(hOff[0] * kS, hOff[1] * kS, (hOff[2] + zChestGirl) * kS), hMode !== 'chest');
              self._itemSyncs.push(function () { fnR(wrap); });
              fnR(wrap);
            }
          } else if (slot === 'pet') {
            var pOff = cfg.socketOffset || [0.42, 0.015, 0.18];
            var baseY = (cfg.hoverY != null ? cfg.hoverY : pOff[1]) * kS;
            var isFlying = (cfg.hoverY || 0) > 0.3;
            wrap.position.set(pOff[0] * kS, baseY, pOff[2] * kS);
            self.root.add(wrap);
            self._itemSyncs.push(function (t) {
              wrap.position.y = baseY + (isFlying ? Math.sin(t * 3.6) * 0.045 * kS : Math.abs(Math.sin(t * 2.6)) * 0.015 * kS);
              wrap.rotation.y = Math.sin(t * 1.4) * 0.18;
            });
          }
        });
      });
      return Promise.all(jobs).then(function () {
        self._refreshHairTuck();
        return self;
      });
    });
  };

  /* --- monster (one solid model, animated as a whole: squash, stretch, hop, spin) --- */
  function Mon(gltf, height) {
    this.base(height || 1.25); this.kind = 'mon';
    var model = gltf.scene; K.fitModel(model, this.height);
    this.inner.add(model); this.model = model;
    // Tripo image-to-3D models face +Z already; allow a per-model tweak via ?monface=
    this.inner.rotation.y = (+K.Q.get('monface') || 0) * Math.PI / 180;
    this.S = { sy: 1, jump: 0, tilt: 0, roll: 0, yaw: 0, pitch: 0 };
  }
  Mon.prototype = Object.create(Character.prototype);
  Mon.prototype.update = function (dt) {
    this.stateT += dt;
    var t = this.stateT, sd = this.seed, g = { sy: 1, jump: 0, tilt: 0, roll: 0, yaw: 0, pitch: 0 }, j;
    switch (this.state) {
      case 'idle': g.sy = 1 + .035 * Math.sin(K.now * 3 + sd); g.roll = .05 * Math.sin(K.now * 1.3 + sd); g.yaw = .25 * Math.sin(K.now * .5 + sd); break;
      case 'wave': case 'hello': j = Math.abs(Math.sin(t * 7)); g.jump = .22 * j; g.sy = .85 + .25 * j; g.roll = .18 * Math.sin(t * 10); break;
      case 'cheer': j = Math.abs(Math.sin(t * 5.2)); g.jump = .7 * j; g.sy = .78 + .38 * j; g.yaw = t * 4; break;
      case 'clap': j = Math.abs(Math.sin(t * 8)); g.jump = .12 * j; g.sy = .9 + .12 * j; g.roll = .1 * Math.sin(t * 8); break;
      case 'sad': g.sy = .86; g.pitch = .35; g.roll = .05 * Math.sin(t * 2); break;
      case 'shrug': g.roll = .3 * Math.sin(t * 6) * Math.max(0, 1 - t); g.sy = 1 + .1 * Math.sin(t * 6); break;
      case 'hop': g.sy = 1.25; g.pitch = -.2; break;
      case 'fly': g.sy = 1.3; g.pitch = 1.2; g.roll = .25 * Math.sin(t * 10); break;
      case 'tumble': g.sy = 1.1 + .15 * Math.sin(t * 20); break;
      case 'dizzy': g.roll = .3 * Math.sin(t * 4); g.pitch = .2 * Math.cos(t * 4); g.sy = .92; break;
      case 'kick': g.pitch = Math.sin(Math.min(1, t / .5) * Math.PI) * .45; g.sy = .9 + .2 * Math.sin(Math.min(1, t / .5) * Math.PI); break;
      case 'keeper': g.sy = .85 + .05 * Math.abs(Math.sin(t * 6)); g.roll = .08 * Math.sin(t * 3); break;
      case 'dive': g.sy = 1.2; break;
      case 'headhands': g.sy = .88; g.pitch = .25; g.roll = .12 * Math.sin(t * 3); break;
      case 'stumble': g.pitch = .6 * Math.sin(Math.min(1, t) * Math.PI); g.roll = .3 * Math.sin(t * 12) * Math.max(0, 1 - t); break;
      case 'run': j = Math.abs(Math.sin(this.phase)); this.phase += dt * 12; g.jump = .25 * j; g.sy = .9 + .2 * j; g.pitch = .2; break;
      case 'ready': g.sy = .8; g.pitch = .2; break;
    }
    var r = 1 - Math.exp(-dt * 14), S = this.S;
    for (var k in g) S[k] = K.lerp(S[k], g[k], k === 'yaw' && this.state === 'cheer' ? 1 : r);
    this.body.position.y = S.jump;
    this.body.rotation.set(0, 0, 0);
    this.body.rotateOnAxis(AX.U, S.yaw); this.body.rotateOnAxis(AX.L, S.pitch); this.body.rotateOnAxis(AX.F, S.roll);
    var sx = 1 / Math.sqrt(Math.max(.3, S.sy));
    this.inner.scale.set(sx, S.sy, sx);
  };

  K.Kid = Kid; K.Mon = Mon;
  /* ---------- Solo vs AI Crew Mode & Home Island / Practice Island Bridge ---------- */
  var _pathMatch = /\/games\/([^/]+)\//i.exec(location.pathname || '');
  var _inferredGameId = (_pathMatch && _pathMatch[1]) ? _pathMatch[1].toLowerCase() : 'game3d';
  K.solo = {
    on: Q.get('solo') === '1' || (Q.get('from') === 'island' && Q.get('solo') !== '0'),
    studentId: Q.get('student') || ''
  };
  K.isAI = function (teamOrIdx) {
    if (!K.solo.on) return false;
    if (typeof teamOrIdx === 'number') return teamOrIdx > 0;
    if (!teamOrIdx) return false;
    if (typeof teamOrIdx.idx === 'number') return teamOrIdx.idx > 0;
    var ti = K.TEAMS.findIndex(function (t) { return t.name === teamOrIdx.name; });
    return ti > 0;
  };
  K.solo.toggleRow = function (box) {
    if (K.ui.preview) return null;
    var row = K.el('div', 'k3-solorow');
    var bClass = K.el('button', 'k3-solobtn' + (!K.solo.on ? ' on' : ''), '👥 Class Teams');
    var bSolo = K.el('button', 'k3-solobtn' + (K.solo.on ? ' on' : ''), '🤖 1P vs Island Crew');
    bClass.type = bSolo.type = 'button';
    function sync() {
      bClass.classList.toggle('on', !K.solo.on);
      bSolo.classList.toggle('on', K.solo.on);
    }
    bClass.onclick = function () { K.solo.on = false; K.sfx('tap'); sync(); };
    bSolo.onclick = function () { K.solo.on = true; K.sfx('tap'); sync(); };
    row.appendChild(bClass); row.appendChild(bSolo);
    if (box && box.lastChild) box.insertBefore(row, box.lastChild);
    else if (box) box.appendChild(row);
    return row;
  };

  K.island = {
    from: (Q.get('from') || '').toLowerCase(),
    gameId: _inferredGameId,
    _recorded: false,
    backHref: function () {
      var f = K.island.from;
      if (f === 'games3d' || f === 'home3d') {
        return K.ROOT + 'home3d/index.html?island=games&returned=' + encodeURIComponent(K.island.gameId);
      }
      if (f === 'island' || f === 'practice-island') {
        var ret = Q.get('return');
        if (ret && /^(\.\.\/|\/|island\/)/i.test(ret)) return ret;
        var st = Q.get('student');
        return K.ROOT + 'island/index.html' + (st ? '?student=' + encodeURIComponent(st) : '?demo=1');
      }
      var is3dGame = /\/games\/[^/]+3d\//i.test(location.pathname);
      return (is3dGame || f === 'gm') ? (K.ROOT + 'home3d/index.html?island=games') : '../index.html';
    },
    backLabel: function () {
      var f = K.island.from;
      if (f === 'games3d' || f === 'home3d') return '🕹️ ← Games Island';
      if (f === 'island' || f === 'practice-island') return '🏝️ ← Practice Island';
      if (/\/games\/[^/]+3d\//i.test(location.pathname)) return '🕹️ ← Games Island';
      return '🎮 ← Games';
    },
    recordWin: function (gameId, opts) {
      if (K.island._recorded || K.CAPTURE) return;
      K.island._recorded = true;
      opts = opts || {};
      var gid = gameId || K.island.gameId || 'game3d';
      try {
        // 1. Save weekly trophy badge for Home Island 3D landmarks
        var tKey = 'eaa_3d_trophies_v1';
        var trophies = JSON.parse(localStorage.getItem(tKey) || '{}') || {};
        var scope = (K.cls && K.cls.classId) || Q.get('class') || 'default';
        trophies[scope] = trophies[scope] || {};
        trophies[scope][gid] = {
          ts: Date.now(),
          winner: opts.winner || 'Team Pink',
          score: opts.score || 0
        };
        localStorage.setItem(tKey, JSON.stringify(trophies));
      } catch (e) {}
      try {
        // 2. Advance Home Island's daily Treasure Bridge progress (both Demo & Live!)
        var bKey = 'eaa_home3d_bridge_xp_v1';
        var today = new Date().toISOString().slice(0, 10);
        var bData = JSON.parse(localStorage.getItem(bKey) || '{}') || {};
        if (bData.day !== today) bData = { day: today, bonus: 0, games: [] };
        bData.bonus = (Number(bData.bonus) || 0) + (Number(opts.bridgeXp) || 45);
        if (Array.isArray(bData.games) && bData.games.indexOf(gid) < 0) bData.games.push(gid);
        bData.lastGame = gid;
        bData.lastTs = Date.now();
        localStorage.setItem(bKey, JSON.stringify(bData));
      } catch (e) {}
      try {
        // 3. If launched from Student Practice Island, award +25 Gold Coins & +20 Island XP!
        if (K.island.from === 'island' || K.island.from === 'practice-island') {
          var sid = Q.get('student') || 'demo';
          var cKey = 'eaa_island_3d_rewards_v1';
          var rMap = JSON.parse(localStorage.getItem(cKey) || '{}') || {};
          rMap[sid] = rMap[sid] || { pendingCoins: 0, pendingXp: 0, count: 0 };
          rMap[sid].pendingCoins = (Number(rMap[sid].pendingCoins) || 0) + 25;
          rMap[sid].pendingXp = (Number(rMap[sid].pendingXp) || 0) + 20;
          rMap[sid].count = (Number(rMap[sid].count) || 0) + 1;
          rMap[sid].lastGame = gid;
          localStorage.setItem(cKey, JSON.stringify(rMap));
        }
      } catch (e) {}
    },
    endButtons: function (endBox, gameId, opts) {
      if (!endBox) return null;
      var gid = gameId || K.island.gameId;
      K.island.recordWin(gid, opts);
      var f = K.island.from;
      var nav = K.el('div', 'k3-end-nav');
      function autoSendPendingXp() {
        try {
          var sendBtn = endBox.querySelector('.xpcard .btn.green:not([disabled])');
          if (sendBtn) sendBtn.click();
        } catch (e) {}
      }
      if (f === 'island' || f === 'practice-island') {
        var pBtn = K.el('a', 'btn isl-return', '🏝️ Back to Practice Island (+25 🪙)');
        pBtn.href = K.island.backHref();
        pBtn.onclick = autoSendPendingXp;
        nav.appendChild(pBtn);
      } else {
        var gBtn = K.el('a', 'btn isl-return', '🕹️ Back to Games Island');
        gBtn.href = K.ROOT + 'home3d/index.html?island=games&returned=' + encodeURIComponent(gid);
        gBtn.onclick = autoSendPendingXp;
        nav.appendChild(gBtn);

        var hBtn = K.el('a', 'btn blue', '🌉 Home Island (Grow Bridge!)');
        hBtn.href = K.ROOT + 'home3d/index.html?island=home&returned=' + encodeURIComponent(gid);
        hBtn.onclick = autoSendPendingXp;
        nav.appendChild(hBtn);
      }
      endBox.appendChild(nav);
      return nav;
    }
  };

  /* team character: their monster if the model exists, otherwise a kid */
  K.makeCharacter = function (team, opts) {
    opts = opts || {};
    var monUrl = K.ROOT + 'assets/3d/monsters/' + team.mon + '.glb';
    var kind = opts.kid || team.kid, kidUrl2 = K.ROOT + 'assets/3d/characters/kid-' + kind + '.glb?v=2';
    var autoSid = opts.studentId || ((team && team.pupils && team.pupils[0] && team.pupils[0].id) ? team.pupils[0].id : '') || ((team === K.TEAMS[0] && K.solo.studentId) ? K.solo.studentId : '');
    return (opts.kidsOnly || K.Q.has('kids') ? Promise.resolve(null) : K.tryGLB(monUrl)).then(function (g) {
      if (g) return new Mon(g, opts.monHeight);
      return K.loadGLB(kidUrl2).then(function (g2) {
        var kid = new Kid(g2, opts.kidHeight);
        kid._kind = kind;
        kid._team = team;
        kid._shirtDone = (opts.teamShirt !== false) ? K.teamShirt(kid, kind, team) : Promise.resolve(kid);
        // Optional private 3D pupil head + worn 3D shop items (only when teacher is signed in & studentId given)
        var PA = root.PupilAvatars || null;
        if (!PA) { try { if (root.parent && root.parent !== root && root.parent.PupilAvatars) PA = root.parent.PupilAvatars; } catch (e) {} }
        if (autoSid && PA) {
          var headP = (typeof PA.getHead3d === 'function')
            ? PA.getHead3d(autoSid).then(function (buf) { return buf ? kid.mountHead(buf) : kid; })
            : Promise.resolve(kid);
          headP.then(function () {
            if (opts.wear === false) return;
            var w = (typeof PA.wearingOf === 'function') ? PA.wearingOf(autoSid) : null;
            var ids = opts.items || (w ? Object.keys(w).map(function (k) { return w[k]; }).filter(Boolean) : []);
            if (ids.length) kid.wearItems(ids);
          }).catch(function () {});
        } else if (Array.isArray(opts.items) && opts.items.length) {
          kid._shirtDone.then(function () { kid.wearItems(opts.items); });
        }
        return kid;
      });
    });
  };
  /* children wear their team's colour: the same model, with the shirt picture swapped (assets/3d/characters/tex/kid-<girl|boy>-<team>.jpg).
     If the picture is missing the child just keeps the normal shirt. Traverses kid.inner ONLY so mounted 3D heads stay untouched. */
  var SHIRTS = {};
  K.teamShirt = function (kid, kind, team) {
    var url = K.ROOT + 'assets/3d/characters/tex/kid-' + kind + '-' + team.name.toLowerCase() + '.jpg?v=2';
    var p = SHIRTS[url] || (SHIRTS[url] = new Promise(function (res) {
      new T3.TextureLoader().load(url, function (t) { t.flipY = false; t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; res(t); }, undefined, function () { res(null); });
    }));
    return p.then(function (t) {
      if (!t) return kid;
      (kid.inner || kid.root).traverse(function (o) {
        if (!o.isMesh || !o.material || !o.material.map) return;
        if (t.image) o.userData._origShirtImg = t.image;
        o.material = o.material.clone(); o.material.map = t; o.material.needsUpdate = true;
      });
      return kid;
    });
  };

  /* dizzy stars circling a head */
  K.dizzyStars = function (parent, y) {
    var g = new T3.Group(), geo = new T3.OctahedronGeometry(.1, 0);
    for (var i = 0; i < 4; i++) { var s = new T3.Mesh(geo, new T3.MeshBasicMaterial({ color: 0xffd84a })); g.add(s); }
    g.position.y = y; parent.add(g);
    var fn = K.onFrame(function (dt, t) { g.children.forEach(function (s, i) { var a = t * 5 + i * Math.PI / 2; s.position.set(Math.cos(a) * .38, Math.sin(t * 6 + i) * .05, Math.sin(a) * .38); s.rotation.y = t * 6; }); });
    return { remove: function () { K.offFrame(fn); parent.remove(g); } };
  };

  /* ---------- UI ---------- */
  var ui;
  K.ui = {};
  K.el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  K.ui.root = function () { return ui || (ui = document.getElementById('ui')); };
  K.ui.add = function (e) { K.ui.root().appendChild(e); return e; };
  K.ui.clear = function () { K.ui.root().innerHTML = ''; };
  K.ui.big = function (txt, sec, small) { var b = K.ui.add(K.el('div', 'big' + (small ? ' small' : ''), txt)); K.after(sec || .9, function () { b.remove(); }); return b; };
  K.ui.toast = function (txt, sec, color) { var b = K.ui.add(K.el('div', 'toast', txt)); if (color) b.style.setProperty('--c', color); K.after(sec || 2, function () { b.remove(); }); return b; };
  /* a row of big choice buttons in the middle of the screen; resolves with the chosen value */
  K.ui.choose = function (title, choices, opts) {
    opts = opts || {};
    return new Promise(function (res) {
      var w = K.ui.add(K.el('div', 'choice')); if (opts.color) w.style.setProperty('--c', opts.color);
      w.appendChild(K.el('div', 'choice-t', title));
      var row = K.el('div', 'choice-row'); w.appendChild(row); var done = false;
      function pick(v) { if (done) return; done = true; w.remove(); res(v); }
      choices.forEach(function (c) {
        var b = K.el('button', 'cbtn', c.label); if (c.color) b.style.setProperty('--b', c.color);
        b.onclick = function () { pick(c.value); }; row.appendChild(b);
      });
      if (K.DEMO && opts.demo !== undefined) K.after(1.1, function () { pick(typeof opts.demo === 'function' ? opts.demo() : opts.demo); });
    });
  };
  K.ui.teamBar = function (teams, fmt) {
    var bar = K.ui.add(K.el('div', 'hud'));
    teams.forEach(function (t, i) {
      var p = K.el('div', 'tpill', '<i>' + (i + 1) + '</i><span>' + K.esc(t.name) + '</span><b>0</b>'); p.style.setProperty('--c', t.c); t.pill = p; bar.appendChild(p);
    });
    var lastActive = 0;
    var hudApi = {
      refresh: function (active) {
        if (active != null) lastActive = active;
        teams.forEach(function (t, i) {
          if (!t.pill) return;
          t.pill.classList.toggle('turn', i === lastActive);
          var sp = t.pill.querySelector('span'); if (sp) sp.textContent = t.name;
          var b = t.pill.querySelector('b'); if (b) b.textContent = fmt ? fmt(t) : t.score;
        });
      },
      bump: function (i) { var p = teams[i] && teams[i].pill; if (!p) return; p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
    };
    K._activeTeams = teams;
    K._activeHud = hudApi;
    return hudApi;
  };
  K.ui.topButtons = function (back) {
    var tb = K.ui.add(K.el('div', 'topbtns'));
    var scBtn = K.el('button', 'ibtn k3-gm-topbtn', '✏️'); scBtn.title = 'Edit Scores & Team Names';
    scBtn.onclick = function () { if (K.gm) K.gm.scoreEditor(); };
    var flBtn = K.el('button', 'ibtn k3-gm-topbtn', '🔁'); flBtn.title = 'Flashcards Revision (Remember First)';
    flBtn.onclick = function () { if (K.gm && K._qs) K.gm.rememberFirst(K._qs.allItems ? K._qs.allItems() : [], function () {}); };
    var exBtn = K.el('button', 'ibtn k3-gm-topbtn', '📝'); exBtn.title = '3-Question Exit Ticket';
    exBtn.onclick = function () { if (K.gm && K._qs) K.gm.exitTicket(K._qs.allItems ? K._qs.allItems() : []); };
    var mu = K.el('button', 'ibtn', K.muted ? '🔇' : '🔊'); mu.title = 'Sound on/off';
    mu.onclick = function () { K.muted = !K.muted; mu.textContent = K.muted ? '🔇' : '🔊'; K.loopVol('music', .25); K.loopVol('crowd', .18); };
    var de = document.documentElement;
    var canFs = !!(de.requestFullscreen || de.webkitRequestFullscreen);
    var fs = K.el('button', 'ibtn', '⛶'); fs.title = 'Full screen';
    if (!canFs) fs.style.display = 'none';
    fs.onclick = function () {
      try {
        var isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (!isFs) {
          var req = de.requestFullscreen || de.webkitRequestFullscreen;
          if (req) { var p = req.call(de); if (p && p.catch) p.catch(function () {}); }
        } else {
          var ex = document.exitFullscreen || document.webkitExitFullscreen;
          if (ex) { var p2 = ex.call(document); if (p2 && p2.catch) p2.catch(function () {}); }
        }
      } catch (e) {}
    };
    var is3dGame = /\/games\/[^/]+3d\//i.test(location.pathname);
    var fromIsl = K.island && (K.island.from === 'home3d' || K.island.from === 'island' || K.island.from === 'practice-island');
    var backHref = back || (K.island ? K.island.backHref() : (is3dGame || Q.get('from') === 'gm' ? '../../game-maker/index.html' : '../index.html'));
    var backTitle = fromIsl ? K.island.backLabel() : 'Back to All Games';
    function leaveGame(ev) {
      try {
        if (window.parent && window.parent !== window) {
          if (window.parent.ClassroomHub && typeof window.parent.ClassroomHub.closeOverlay === 'function') {
            if (ev) ev.preventDefault();
            window.parent.ClassroomHub.closeOverlay();
            return;
          }
          if (/home3d\/index\.html/i.test(backHref)) {
            if (ev) ev.preventDefault();
            window.parent.postMessage({ type: 'eaa:closeOverlay' }, '*');
            return;
          }
        }
      } catch (e) {}
      if (ev) ev.preventDefault();
      location.href = backHref;
    }
    var bk = K.el('button', 'ibtn', '✕'); bk.title = backTitle; bk.onclick = leaveGame;
    tb.appendChild(scBtn); tb.appendChild(flBtn); tb.appendChild(exBtn); tb.appendChild(mu); tb.appendChild(fs); tb.appendChild(bk);
    if ((is3dGame || Q.get('from') === 'gm' || fromIsl) && !Q.has('preview')) {
      var gmPill = K.ui.add(K.el('a', 'gm-back-pill' + (fromIsl ? ' isl-pill' : ''), K.island ? K.island.backLabel() : '🎮 ← Games'));
      gmPill.href = backHref;
      gmPill.title = backTitle;
      gmPill.addEventListener('click', leaveGame);
    }
    addEventListener('keydown', function (ev) {
      if (ev.target && /input|textarea|select/i.test(ev.target.tagName)) return;
      var k = (ev.key || '').toLowerCase();
      if (k === 'm') mu.click();
      else if (k === 'f' && canFs) fs.click();
    });
  };

  /* ---------- Merged Game Maker Classroom Features (Remember First, Speaking Mode, Smart Mix, Teacher Controls) ---------- */
  var GM_CFG_KEY = 'eaa_k3_gm_cfg_v1';
  var REV_KEY = 'eaa_revision_v1';
  var VID_KEY = 'eaa_k3_rev_videos_v1';
  var gmCfg = { rem: 1, timer: 0, pics: 'off', judge: 'off', cards: 0 };
  try {
    var savedCfg = JSON.parse(localStorage.getItem(GM_CFG_KEY) || 'null');
    if (savedCfg && typeof savedCfg === 'object') Object.assign(gmCfg, savedCfg);
  } catch (e) {}
  function saveGmCfg() { try { localStorage.setItem(GM_CFG_KEY, JSON.stringify(gmCfg)); } catch (e) {} }

  function revHash(s) { var x = 5381, i; for (i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36); }
  function revKeyOf(it) { return revHash(String((it && it.q) || '') + '|' + String((it && it.a) || '')); }
  function revLoad() {
    try {
      var d = JSON.parse(localStorage.getItem(REV_KEY) || 'null');
      if (d && d.v === 1) { d.items = d.items || {}; d.cls = d.cls || {}; d.pup = d.pup || {}; return d; }
    } catch (e) {}
    return { v: 1, items: {}, cls: {}, pup: {} };
  }
  function revSave(d) { d.at = Date.now(); try { localStorage.setItem(REV_KEY, JSON.stringify(d)); } catch (e) {} }
  function revClassId() { return (K.cls && K.cls.classId) || 'class-default'; }
  function revRecordClass(it, frac) {
    if (!it || !it.q || K.DEMO) return;
    var cid = revClassId(), d = revLoad(), k = revKeyOf(it);
    var c = d.cls[cid] = d.cls[cid] || {};
    var r = c[k] = c[k] || { n: 0, s: 0, t: 0 };
    r.n++;
    r.s = Math.round((r.s + Math.max(0, Math.min(1, frac))) * 1000) / 1000;
    r.t = Date.now();
    d.items[k] = { q: String(it.q), a: String(it.a) };
    revSave(d);
  }
  function revNeed(it) {
    var c = (revLoad().cls[revClassId()] || {})[revKeyOf(it)];
    if (!c || !c.n) return 0.55 + Math.random() * 0.1;
    var mean = c.s / c.n, age = Math.min(1, (Date.now() - c.t) / (14 * 864e5));
    return (1 - mean) * 0.8 + age * 0.25 + Math.random() * 0.05;
  }
  function revPickSmart(items, n) {
    var seen = {}, list = (items || []).filter(function (it) {
      if (!it || !it.q) return false;
      var k = revKeyOf(it); if (seen[k]) return false; seen[k] = 1; return true;
    });
    list.forEach(function (it) { it._need = revNeed(it); });
    list.sort(function (a, b) { return b._need - a._need; });
    return K.shuffle(list.slice(0, n || 16));
  }
  function loadRevVideos() { try { return JSON.parse(localStorage.getItem(VID_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveRevVideo(packId, url) {
    var map = loadRevVideos();
    if (url && String(url).trim()) map[packId || 'default'] = String(url).trim();
    else delete map[packId || 'default'];
    try { localStorage.setItem(VID_KEY, JSON.stringify(map)); } catch (e) {}
  }
  function toEmbedHtml(rawUrl) {
    var u = String(rawUrl || '').trim();
    if (!u) return '';
    var yt = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/.exec(u);
    if (yt) return '<iframe class="k3-gm-vid" src="https://www.youtube.com/embed/' + yt[1] + '?rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return '<video class="k3-gm-vid" src="' + K.esc(u) + '" controls playsinline></video>';
    return '';
  }
  function formatCardSentence(it) {
    var q = String((it && it.q) || ''), a = String((it && it.a) || '');
    if (/_{2,}/.test(q)) return { full: q.replace(/_{2,}/, a), gap: q.replace(/_{2,}/, '▢▢▢▢'), a: a, mark: true, spoken: q.replace(/_{2,}/, a) };
    if (it && (it.speak === 1 || !it.w || !it.w.length)) return { full: a, prompt: q, gap: q + ' → ▢▢▢', a: a, mark: false, spoken: a };
    return { full: q + ' → ' + a, prompt: q, gap: q + ' → ▢▢▢', a: a, mark: false, spoken: a };
  }

  K.gm = {
    cfg: gmCfg,
    remDone: false,
    sessionTally: [],
    cardNo: 0,
    videoForPack: function (packId) { var m = loadRevVideos(); return m[packId || 'default'] || ''; },

    /* 1. Pre-Game "Remember First" Flashcards (Auto-built pictures + text + audio + optional video clip) */
    rememberFirst: function (items, done) {
      var list = (items && items.length ? items : (K._qs && K._qs.allItems ? K._qs.allItems() : [])).slice(0, 8);
      if (!list.length) { if (done) done(); return; }
      var pts = revPickSmart(list, Math.min(8, list.length));
      var packId = (K._qs && K._qs.id) || 'default';
      var vidHtml = toEmbedHtml(K.gm.videoForPack(packId));
      var ov = K.el('div', 'k3-gm-ov');
      document.body.appendChild(ov);
      function finish() {
        try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) {}
        ov.remove();
        K.gm.remDone = true;
        if (done) done();
      }
      function renderLook(idx) {
        var it = pts[idx], s = formatCardSentence(it);
        var mediaHtml = '';
        if (idx === 0 && vidHtml) mediaHtml += '<div class="k3-gm-vidwrap">' + vidHtml + '</div>';
        if (it.img) mediaHtml += '<img class="k3-gm-fimg" alt="" src="' + K.ROOT + K.esc(it.img) + '">';
        else if (it.pic) mediaHtml += '<div class="k3-gm-fpic">' + K.esc(it.pic) + '</div>';
        var bigHtml = '';
        if (s.mark) {
          var parts = s.full.split(s.a);
          bigHtml = K.esc(parts[0]) + '<mark>' + K.esc(s.a) + '</mark>' + K.esc(parts.slice(1).join(s.a));
        } else if (s.prompt) {
          bigHtml = '<div class="k3-gm-fsub">' + K.esc(s.prompt) + '</div><mark>' + K.esc(s.a) + '</mark>';
        } else {
          bigHtml = K.esc(s.full);
        }
        var actHtml = it.act ? '<div class="k3-gm-fact">' + K.esc(it.act) + '</div>' : '';
        ov.innerHTML =
          '<div class="k3-gm-card wide">' +
            '<div class="k3-gm-barhead"><b>🔁 Remember First · Flashcards</b><span>Card ' + (idx + 1) + ' of ' + pts.length + '</span><button type="button" class="k3-gm-sbtn ghost" id="k3-rem-skip">Skip to Game ⏭</button></div>' +
            '<div class="k3-gm-flash">' +
              mediaHtml +
              '<div class="k3-gm-fbig">' + bigHtml + '</div>' +
              actHtml +
              '<div class="k3-gm-fdo">👂 Listen · 🗣️ Say it together · 👥 Say it to your partner!</div>' +
            '</div>' +
            '<div class="k3-gm-row">' +
              (idx > 0 ? '<button type="button" class="k3-gm-sbtn ghost" id="k3-rem-prev">◀ Back</button>' : '') +
              '<button type="button" class="k3-gm-sbtn amber" id="k3-rem-say">🔊 Hear It</button>' +
              '<button type="button" class="k3-gm-sbtn green bigbtn" id="k3-rem-next">' + (idx + 1 < pts.length ? 'Next Card ▶' : 'Cover & Recall ▶') + '</button>' +
            '</div>' +
          '</div>';
        ov.querySelector('#k3-rem-skip').onclick = finish;
        ov.querySelector('#k3-rem-say').onclick = function () { K.say(s.spoken || s.full); };
        if (idx > 0) ov.querySelector('#k3-rem-prev').onclick = function () { K.sfx('click'); renderLook(idx - 1); };
        ov.querySelector('#k3-rem-next').onclick = function () {
          K.sfx('click');
          if (idx + 1 < pts.length) renderLook(idx + 1);
          else renderRecall();
        };
        setTimeout(function () { K.say(s.spoken || s.full); }, 220);
      }
      function renderRecall() {
        ov.innerHTML =
          '<div class="k3-gm-card wide">' +
            '<div class="k3-gm-barhead"><b>🧠 Cover &amp; Recall</b><span>Step 2 of 2</span><button type="button" class="k3-gm-sbtn green" id="k3-rem-go">🚀 Start Game!</button></div>' +
            '<p class="k3-gm-hint">Say the missing words together, then tap each bar to check and hear it!</p>' +
            '<div class="k3-gm-rlist" id="k3-rem-rlist"></div>' +
            '<div class="k3-gm-row">' +
              '<button type="button" class="k3-gm-sbtn ghost" id="k3-rem-again">◀ Flashcards Again</button>' +
              '<button type="button" class="k3-gm-sbtn green bigbtn" id="k3-rem-start">🚀 Start Game Now!</button>' +
            '</div>' +
          '</div>';
        var rl = ov.querySelector('#k3-rem-rlist');
        pts.forEach(function (it) {
          var s = formatCardSentence(it);
          var b = K.el('button', 'k3-gm-rrow', (it.pic ? '<span>' + K.esc(it.pic) + '</span> ' : '') + K.esc(s.gap));
          b.type = 'button';
          b.onclick = function () {
            if (b.classList.contains('open')) { K.say(s.spoken || s.full); return; }
            b.classList.add('open');
            b.innerHTML = (it.pic ? '<span>' + K.esc(it.pic) + '</span> ' : '') + K.esc(s.full);
            K.sfx('correct');
            K.say(s.spoken || s.full);
          };
          rl.appendChild(b);
        });
        ov.querySelector('#k3-rem-again').onclick = function () { renderLook(0); };
        ov.querySelector('#k3-rem-go').onclick = finish;
        ov.querySelector('#k3-rem-start').onclick = finish;
      }
      renderLook(0);
    },

    /* 2. Live Score & Team Name Editor */
    scoreEditor: function () {
      var teams = K._activeTeams;
      if (!teams || !teams.length) { K.ui.toast('Start a game first to edit team scores!', 1.8, '#ffb320'); return; }
      var old = document.getElementById('k3-sedit'); if (old) { old.remove(); return; }
      var ov = K.el('div', 'k3-gm-ov'); ov.id = 'k3-sedit';
      var card = K.el('div', 'k3-gm-card');
      card.innerHTML = '<div class="k3-gm-barhead"><b>✏️ Live Scores &amp; Team Names</b><button type="button" class="k3-gm-sbtn ghost" id="k3-se-x">✕</button></div><p class="k3-gm-hint">Adjust any score or rename a team mid-game.</p>';
      var rows = K.el('div', 'k3-gm-serows');
      teams.forEach(function (t, i) {
        var r = K.el('div', 'k3-gm-serow');
        r.style.setProperty('--c', t.c || '#4f9dff');
        var dot = K.el('span', 'k3-gm-sedot'); dot.style.background = t.c || '#4f9dff';
        var inp = K.el('input', 'k3-gm-sename'); inp.value = t.name; inp.maxLength = 16;
        inp.oninput = function () { t.name = inp.value || ('Team ' + (i + 1)); if (K._activeHud) K._activeHud.refresh(); };
        var sc = K.el('input', 'k3-gm-senum'); sc.type = 'number'; sc.value = String(t.score || 0);
        function setV(v) { t.score = Math.max(0, Math.round(+v || 0)); sc.value = String(t.score); if (K._activeHud) { K._activeHud.refresh(); K._activeHud.bump(i); } }
        sc.onchange = function () { setV(sc.value); };
        var m5 = K.el('button', 'k3-gm-sbtn ghost', '−1'); m5.type = 'button'; m5.onclick = function () { setV((t.score || 0) - 1); };
        var p1 = K.el('button', 'k3-gm-sbtn amber', '+1'); p1.type = 'button'; p1.onclick = function () { setV((t.score || 0) + 1); };
        var p5 = K.el('button', 'k3-gm-sbtn green', '+5'); p5.type = 'button'; p5.onclick = function () { setV((t.score || 0) + 5); };
        r.appendChild(dot); r.appendChild(inp); r.appendChild(m5); r.appendChild(sc); r.appendChild(p1); r.appendChild(p5);
        rows.appendChild(r);
      });
      card.appendChild(rows);
      var doneB = K.el('button', 'k3-gm-sbtn green bigbtn', '✔ Done'); doneB.type = 'button';
      doneB.onclick = function () { ov.remove(); if (K._activeHud) K._activeHud.refresh(); };
      card.appendChild(doneB);
      ov.appendChild(card);
      document.body.appendChild(ov);
      ov.querySelector('#k3-se-x').onclick = function () { ov.remove(); };
      ov.onclick = function (e) { if (e.target === ov) ov.remove(); };
    },

    /* 3. Choose Questions + Optional Pre-Game Video Attachment */
    chooseQuestions: function () {
      if (!K._qs || !K._qs.rawItems) { K.ui.toast('Loading question set...', 1.4, '#4f9dff'); return; }
      var all = K._qs.rawItems();
      if (!all.length) return;
      var chosen = {};
      var cur = K._qs.selectedIdx && K._qs.selectedIdx.length ? K._qs.selectedIdx : all.map(function (_, i) { return i; });
      cur.forEach(function (i) { chosen[i] = 1; });
      var packId = K._qs.id || 'default';
      var ov = K.el('div', 'k3-gm-ov');
      var card = K.el('div', 'k3-gm-card wide');
      card.innerHTML =
        '<div class="k3-gm-barhead"><b>✔ Choose Questions &amp; Warm-Up Video</b><span id="k3-cq-cnt"></span><button type="button" class="k3-gm-sbtn ghost" id="k3-cq-x">✕</button></div>' +
        '<div class="k3-gm-vidin"><label>🎬 Optional Pre-Game Video / YouTube Link:</label><input id="k3-cq-vid" type="text" placeholder="Paste YouTube URL or local .mp4 path (optional)"></div>' +
        '<div class="k3-gm-row" style="justify-content:flex-start;margin:6px 0"><button type="button" class="k3-gm-sbtn amber" id="k3-cq-all">Select All</button><button type="button" class="k3-gm-sbtn ghost" id="k3-cq-none">Clear</button></div>' +
        '<div class="k3-gm-qlist" id="k3-cq-list"></div>' +
        '<div class="k3-gm-row"><button type="button" class="k3-gm-sbtn ghost" id="k3-cq-cancel">Cancel</button><button type="button" class="k3-gm-sbtn green bigbtn" id="k3-cq-save">✔ Use Selected Questions</button></div>';
      ov.appendChild(card);
      document.body.appendChild(ov);
      var vidInp = card.querySelector('#k3-cq-vid');
      vidInp.value = K.gm.videoForPack(packId);
      var listEl = card.querySelector('#k3-cq-list'), cntEl = card.querySelector('#k3-cq-cnt');
      function paintCnt() { cntEl.textContent = Object.keys(chosen).length + ' / ' + all.length + ' selected'; }
      all.forEach(function (it, i) {
        var lab = K.el('label', 'k3-gm-qitem');
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!chosen[i];
        cb.onchange = function () { if (cb.checked) chosen[i] = 1; else delete chosen[i]; paintCnt(); };
        lab.appendChild(cb);
        lab.appendChild(K.el('span', '', (it.pic ? K.esc(it.pic) + ' ' : '') + K.esc(it.q) + ' <em>→ ' + K.esc(it.a) + '</em>'));
        listEl.appendChild(lab);
      });
      paintCnt();
      card.querySelector('#k3-cq-all').onclick = function () { all.forEach(function (_, i) { chosen[i] = 1; }); [].forEach.call(listEl.querySelectorAll('input'), function (c) { c.checked = true; }); paintCnt(); };
      card.querySelector('#k3-cq-none').onclick = function () { chosen = {}; [].forEach.call(listEl.querySelectorAll('input'), function (c) { c.checked = false; }); paintCnt(); };
      card.querySelector('#k3-cq-x').onclick = card.querySelector('#k3-cq-cancel').onclick = function () { ov.remove(); };
      card.querySelector('#k3-cq-save').onclick = function () {
        var idxs = all.map(function (_, i) { return i; }).filter(function (i) { return chosen[i]; });
        if (!idxs.length) { K.ui.toast('Pick at least 1 question!', 1.5, '#ff5fa2'); return; }
        saveRevVideo(packId, vidInp.value);
        if (K._qs && K._qs.applySelection) K._qs.applySelection(idxs);
        ov.remove();
        K.ui.toast('✔ ' + idxs.length + ' questions ready!', 1.6, '#2fc58a');
      };
    },

    /* 4. Smart Mix (Spaced Repetition from eaa_revision_v1) */
    activateSmartMix: function () {
      var g = /4/.test(String(revClassId())) ? 4 : 3;
      K.qlib().then(function (QL) {
        var pool = [];
        var sets = (root.GM && root.GM.sets) || [];
        sets.forEach(function (s) {
          if (s && s.grade == g && !s.smart && Array.isArray(s.items)) pool = pool.concat(s.items);
        });
        if (!pool.length && K._qs && K._qs.rawItems) pool = K._qs.rawItems();
        var picked = revPickSmart(pool, 20);
        if (picked.length && K._qs) {
          K._qs.usePack({ id: 'smart-g' + g, name: '🧠 Smart Mix · Grade ' + g + ' (Most Missed)', items: picked });
          K.ui.toast('🧠 Loaded ' + picked.length + ' Smart Mix questions for Grade ' + g + '!', 2, '#9b7bff');
        }
      });
    },

    /* 5. Answer Cards Class Tally Overlay */
    tally: function (item, ok) {
      return new Promise(function (resolve) {
        if (!gmCfg.cards || K.DEMO) { revRecordClass(item, ok ? 1 : 0); return resolve(); }
        var n = ++K.gm.cardNo;
        var ov = K.el('div', 'k3-gm-ov');
        var card = K.el('div', 'k3-gm-card');
        card.innerHTML =
          '<div class="k3-gm-barhead"><b>🃏 Answer Cards · Line ' + n + '</b></div>' +
          '<div class="k3-gm-tans">Answer: <mark>' + K.esc(item.a) + '</mark></div>' +
          '<p class="k3-gm-hint">Cards up! How many pupils got it right?</p>';
        var row = K.el('div', 'k3-gm-row');
        [['🙌 All', 1, 'green'], ['👍 Most', 0.75, 'green'], ['🤔 Half', 0.5, 'amber'], ['😬 A few', 0.25, 'coral'], ['🫥 None', 0, 'coral']].forEach(function (t) {
          var b = K.el('button', 'k3-gm-sbtn ' + t[2], t[0]); b.type = 'button';
          b.onclick = function () {
            revRecordClass(item, t[1]);
            K.gm.sessionTally.push({ n: n, item: item, f: t[1] });
            ov.remove(); resolve();
          };
          row.appendChild(b);
        });
        var sk = K.el('button', 'k3-gm-sbtn ghost', 'Skip'); sk.type = 'button'; sk.onclick = function () { ov.remove(); resolve(); };
        row.appendChild(sk);
        card.appendChild(row); ov.appendChild(card); document.body.appendChild(ov);
      });
    },

    /* 6. Judge Mode (Anyone Can Answer / Partial Credit) */
    judge: function (team, ok) {
      return new Promise(function (resolve) {
        if (gmCfg.judge === 'off' || K.DEMO || !K._activeTeams || !K._activeTeams.length) return resolve(ok);
        var teams = K._activeTeams;
        var selIdx = ok ? teams.indexOf(team) : -1;
        var frac = ok ? 1 : 0;
        var ov = K.el('div', 'k3-gm-ov');
        var card = K.el('div', 'k3-gm-card');
        card.innerHTML = '<div class="k3-gm-barhead"><b>🏅 Teacher Judge</b></div><p class="k3-gm-hint">' + (gmCfg.judge === 'anyone' ? 'Tap which team earned the points:' : 'Choose partial or full credit:') + '</p>';
        var tRow = K.el('div', 'k3-gm-row');
        var fRow = K.el('div', 'k3-gm-row');
        var goBtn = K.el('button', 'k3-gm-sbtn green bigbtn', '✔ Confirm'); goBtn.type = 'button';
        function paint() {
          [].forEach.call(tRow.children, function (b) { b.classList.toggle('sel', +b.dataset.i === selIdx); });
          [].forEach.call(fRow.children, function (b) { b.classList.toggle('sel', +b.dataset.f === frac); });
        }
        if (gmCfg.judge === 'anyone' || gmCfg.judge === 'both') {
          teams.forEach(function (t, i) {
            var b = K.el('button', 'k3-gm-sbtn', K.esc(t.name)); b.type = 'button'; b.dataset.i = String(i);
            b.style.borderColor = t.c;
            b.onclick = function () { selIdx = i; if (frac === 0) frac = 1; paint(); };
            tRow.appendChild(b);
          });
          var nb = K.el('button', 'k3-gm-sbtn ghost', '🙈 Nobody'); nb.type = 'button'; nb.dataset.i = '-1';
          nb.onclick = function () { selIdx = -1; frac = 0; paint(); };
          tRow.appendChild(nb);
          card.appendChild(tRow);
        }
        if (gmCfg.judge === 'partial' || gmCfg.judge === 'both') {
          [[0, '0'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, 'Full']].forEach(function (f) {
            var b = K.el('button', 'k3-gm-sbtn amber', f[1]); b.type = 'button'; b.dataset.f = String(f[0]);
            b.onclick = function () { frac = f[0]; if (frac > 0 && selIdx < 0) selIdx = Math.max(0, teams.indexOf(team)); paint(); };
            fRow.appendChild(b);
          });
          card.appendChild(fRow);
        }
        goBtn.onclick = function () {
          ov.remove();
          if (selIdx >= 0 && teams[selIdx] && teams[selIdx] !== team && frac > 0) {
            teams[selIdx].score = (teams[selIdx].score || 0) + Math.max(1, Math.round(frac * 2));
            if (K._activeHud) { K._activeHud.refresh(); K._activeHud.bump(selIdx); }
          }
          resolve(selIdx >= 0 && frac > 0);
        };
        card.appendChild(goBtn); ov.appendChild(card); document.body.appendChild(ov);
        paint();
      });
    },

    /* 7. End-of-Game "What We Found Hard" Review */
    hardReview: function () {
      var hard = (K.gm.sessionTally || []).filter(function (x) { return x.f <= 0.5; }).sort(function (a, b) { return a.f - b.f; });
      var ov = K.el('div', 'k3-gm-ov');
      var card = K.el('div', 'k3-gm-card wide');
      card.innerHTML = '<div class="k3-gm-barhead"><b>📋 What We Found Hard</b><button type="button" class="k3-gm-sbtn ghost" id="k3-hr-x">✕</button></div>' +
        '<p class="k3-gm-hint">' + (hard.length ? 'Tap each tricky question to reveal and say it together!' : 'Every question was strong for the class! Awesome job!') + '</p>' +
        '<div class="k3-gm-rlist" id="k3-hr-list"></div>';
      var listEl = card.querySelector('#k3-hr-list');
      hard.forEach(function (x) {
        var s = formatCardSentence(x.item);
        var b = K.el('button', 'k3-gm-rrow', 'Line ' + x.n + ' · ' + K.esc(s.gap)); b.type = 'button';
        b.onclick = function () { b.classList.add('open'); b.textContent = 'Line ' + x.n + ' · ' + s.full; K.say(s.spoken || s.full); };
        listEl.appendChild(b);
      });
      var row = K.el('div', 'k3-gm-row');
      if (hard.length) {
        var pr = K.el('button', 'k3-gm-sbtn green bigbtn', '🔁 Practise These ' + Math.min(6, hard.length)); pr.type = 'button';
        pr.onclick = function () { ov.remove(); K.gm.rememberFirst(hard.slice(0, 6).map(function (x) { return x.item; }), function () {}); };
        row.appendChild(pr);
      }
      var cl = K.el('button', 'k3-gm-sbtn ghost', 'Done'); cl.type = 'button'; cl.onclick = function () { ov.remove(); };
      row.appendChild(cl);
      card.appendChild(row); ov.appendChild(card); document.body.appendChild(ov);
      card.querySelector('#k3-hr-x').onclick = function () { ov.remove(); };
    },

    /* 8. 3-Question Exit Ticket + Private Teacher Marking Grid */
    exitTicket: function (items) {
      var list = (items && items.length ? items : (K._qs && K._qs.allItems ? K._qs.allItems() : []));
      var qs = revPickSmart(list, 3);
      if (!qs.length) { K.ui.toast('No questions loaded yet!', 1.5, '#ffb320'); return; }
      var ov = K.el('div', 'k3-gm-ov');
      function showBoard() {
        var card = K.el('div', 'k3-gm-card wide');
        card.innerHTML = '<div class="k3-gm-barhead"><b>📝 Exit Ticket · 3 Quick Questions</b><button type="button" class="k3-gm-sbtn ghost" id="k3-et-x">✕</button></div><p class="k3-gm-hint">Write or say your 3 answers before leaving!</p><div class="k3-gm-etlist" id="k3-et-list"></div>';
        var el = card.querySelector('#k3-et-list'), revFns = [];
        qs.forEach(function (it, i) {
          var opts = (it.w && it.w.length) ? K.shuffle([it.a].concat(it.w.slice(0, 2))) : [];
          var box = K.el('div', 'k3-gm-etq');
          var ans = K.el('div', 'k3-gm-etans', '');
          revFns.push(function () { ans.textContent = '✅ ' + it.a; ans.classList.add('on'); });
          box.innerHTML = '<b>' + (i + 1) + '. ' + (it.pic ? K.esc(it.pic) + ' ' : '') + K.esc(it.q) + '</b>' +
            (opts.length ? '<div class="k3-gm-etopts">' + opts.map(function (o, k) { return '<span><b>' + 'ABC'[k] + ')</b> ' + K.esc(o) + '</span>'; }).join('') + '</div>' : '<div class="k3-gm-etopts"><em>🎤 Speaking answer</em></div>');
          box.appendChild(ans);
          el.appendChild(box);
        });
        var row = K.el('div', 'k3-gm-row');
        var showA = K.el('button', 'k3-gm-sbtn amber', '👀 Show Answers'); showA.type = 'button';
        showA.onclick = function () { revFns.forEach(function (f) { f(); }); K.sfx('correct'); };
        var markB = K.el('button', 'k3-gm-sbtn green bigbtn', '✔ Quick Mark & Save'); markB.type = 'button';
        markB.onclick = function () { showMarking(); };
        row.appendChild(showA); row.appendChild(markB);
        card.appendChild(row); ov.innerHTML = ''; ov.appendChild(card);
        card.querySelector('#k3-et-x').onclick = function () { ov.remove(); };
      }
      function showMarking() {
        var pupils = [];
        if (K._activeTeams) K._activeTeams.forEach(function (t) { if (t.pupils) pupils = pupils.concat(t.pupils); });
        if (!pupils.length && K.cls && K.cls.preview) K.cls.preview.forEach(function (t) { if (t.pupils) pupils = pupils.concat(t.pupils); });
        var marks = {};
        var card = K.el('div', 'k3-gm-card wide');
        card.innerHTML = '<div class="k3-gm-barhead"><b>📝 Exit Ticket · Private Marking</b><button type="button" class="k3-gm-sbtn ghost" id="k3-etm-x">✕</button></div><p class="k3-gm-hint">Tap each box: ✓ right, ✗ missed. Saves privately to spaced repetition.</p>';
        if (!pupils.length) {
          card.innerHTML += '<p class="k3-gm-hint">Select a class on the title screen to mark individual pupils, or tap Save to record these 3 questions.</p>';
        } else {
          var tbl = K.el('div', 'k3-gm-etbl');
          tbl.innerHTML = '<div class="k3-gm-eprow head"><span>Pupil</span><b>Q1</b><b>Q2</b><b>Q3</b></div>';
          pupils.forEach(function (p) {
            var r = K.el('div', 'k3-gm-eprow');
            r.appendChild(K.el('span', '', K.esc(p.name)));
            qs.forEach(function (_, qi) {
              var b = K.el('button', 'k3-gm-emark', ''); b.type = 'button';
              b.onclick = function () {
                var m = marks[p.id] = marks[p.id] || [];
                m[qi] = m[qi] === 1 ? 0 : m[qi] === 0 ? undefined : 1;
                b.textContent = m[qi] === 1 ? '✓' : m[qi] === 0 ? '✗' : '';
                b.className = 'k3-gm-emark' + (m[qi] === 1 ? ' ok' : m[qi] === 0 ? ' no' : '');
              };
              r.appendChild(b);
            });
            tbl.appendChild(r);
          });
          card.appendChild(tbl);
        }
        var row = K.el('div', 'k3-gm-row');
        var bk = K.el('button', 'k3-gm-sbtn ghost', '◀ Back'); bk.type = 'button'; bk.onclick = showBoard;
        var sv = K.el('button', 'k3-gm-sbtn green bigbtn', '💾 Save Marks'); sv.type = 'button';
        sv.onclick = function () {
          var d = revLoad(), count = 0;
          Object.keys(marks).forEach(function (sid) {
            marks[sid].forEach(function (v, qi) {
              if (v === 1 || v === 0) {
                var k = revKeyOf(qs[qi]), p = d.pup[sid] = d.pup[sid] || {}, r = p[k] = p[k] || { lv: 0, n: 0, ok: 0, t: 0, d: '' };
                if (v === 1) { r.lv = Math.min(3, r.lv + 1); r.ok++; } else r.lv = Math.max(0, r.lv - 1);
                r.n++; r.t = Date.now(); r.d = new Date().toISOString().slice(0, 10);
                d.items[k] = { q: String(qs[qi].q), a: String(qs[qi].a) }; count++;
              }
            });
          });
          revSave(d);
          ov.remove();
          K.ui.toast(count ? ('✅ Saved ' + count + ' Exit Ticket marks!') : '✅ Exit Ticket closed!', 2, '#2fc58a');
        };
        row.appendChild(bk); row.appendChild(sv); card.appendChild(row);
        ov.innerHTML = ''; ov.appendChild(card);
        card.querySelector('#k3-etm-x').onclick = function () { ov.remove(); };
      }
      document.body.appendChild(ov);
      showBoard();
    },

    /* 9. Compact Title-Screen Teacher Options Bar */
    optionsBar: function (box) {
      if (K.ui.preview || K.DEMO) return null;
      var bar = K.el('div', 'k3-gm-optbar');
      function paint() {
        bar.innerHTML = '';
        function pill(txt, on, fn, title) {
          var b = K.el('button', 'k3-gm-pill' + (on ? ' on' : ''), txt);
          b.type = 'button'; if (title) b.title = title;
          b.onclick = function () { K.sfx('click'); fn(); saveGmCfg(); paint(); };
          bar.appendChild(b);
        }
        pill(gmCfg.rem ? '🔁 Warm-Up: ON' : '🔁 Warm-Up: OFF', !!gmCfg.rem, function () { gmCfg.rem = gmCfg.rem ? 0 : 1; }, 'Show Remember First flashcards before Question 1');
        pill('📖 Flashcards', false, function () { K.gm.rememberFirst(K._qs && K._qs.allItems ? K._qs.allItems() : [], function () {}); }, 'Preview illustrated flashcards right now');
        pill('✔ Pick Qs / 🎬 Video', false, function () { K.gm.chooseQuestions(); }, 'Tick specific questions or attach a warm-up video');
        pill('🧠 Smart Mix', false, function () { K.gm.activateSmartMix(); }, 'Load the 20 questions the class missed most');
        var tCycle = [0, 10, 15, 20, 30];
        pill(gmCfg.timer ? ('⏱ ' + gmCfg.timer + 's') : '⏱ Timer: Off', !!gmCfg.timer, function () { gmCfg.timer = tCycle[(tCycle.indexOf(gmCfg.timer) + 1) % tCycle.length]; }, 'Countdown timer per question');
        var pCycle = ['off', 'zoom', 'blur'], pLbl = { off: '🖼 Pics: Normal', zoom: '🔍 Super Zoom', blur: '🌫 Blur Reveal' };
        pill(pLbl[gmCfg.pics] || '🖼 Pics: Normal', gmCfg.pics !== 'off', function () { gmCfg.pics = pCycle[(pCycle.indexOf(gmCfg.pics) + 1) % pCycle.length]; }, 'Tap picture to zoom fullscreen or slide to unblur');
        var jCycle = ['off', 'anyone', 'partial', 'both'], jLbl = { off: '🏅 Judge: Off', anyone: '🏅 Anyone', partial: '🏅 Partial', both: '🏅 Full Judge' };
        pill(jLbl[gmCfg.judge] || '🏅 Judge: Off', gmCfg.judge !== 'off', function () { gmCfg.judge = jCycle[(jCycle.indexOf(gmCfg.judge) + 1) % jCycle.length]; }, 'Award points to any team or give partial credit');
        pill(gmCfg.cards ? '🃏 Cards: ON' : '🃏 Cards: Off', !!gmCfg.cards, function () { gmCfg.cards = gmCfg.cards ? 0 : 1; }, 'Whole-class answer card tally after each question');
      }
      paint();
      box.insertBefore(bar, box.lastChild);
      return bar;
    }
  };

  var keyFn = null;
  addEventListener('keydown', function (e) { if (keyFn) keyFn(e); });
  /* question card: supports Quiz, Speaking Choice, AND Speaking & Acting cards + Pre-Game Remember First + Timer + Zoom/Blur + Judge + Answer Cards */
  K.ui.ask = function (item, team, opts) {
    opts = opts || {};
    var skipRev = K.DEMO || Q.get('norev') === '1' || opts.skipRemember;
    if (!skipRev && gmCfg.rem && !K.gm.remDone && K._qs) {
      K.gm.remDone = true;
      return new Promise(function (resolve) {
        var all = K._qs.allItems ? K._qs.allItems() : [item];
        K.gm.rememberFirst(all, function () {
          K.ui.ask(item, team, Object.assign({}, opts, { skipRemember: true })).then(resolve);
        });
      });
    }
    return new Promise(function (resolve) {
      var isAiTurn = !K.DEMO && K.isAI && K.isAI(team);
      var isSpeaking = !item.w || item.w.length === 0 || item.speak === 1;
      var wrap = K.ui.add(K.el('div', 'qwrap')), card = K.el('div', 'qcard' + (isSpeaking ? ' k3-speak-card' : ''));
      card.style.setProperty('--c', team.c);
      var sp = !isAiTurn && K.cls && K.cls.speaker(team);
      var sayPrompt = (typeof item.speak === 'string' && item.speak) ? item.speak : (isSpeaking ? String(item.a || '') : String(item.q || '').replace(/_+/g, 'blank'));
      var badgeHtml = isSpeaking ? '<span class="k3-spk-badge">🎤 SPEAK &amp; ACT</span>' : (item.speakChoice ? '<span class="k3-spk-badge choice">🗣️ CHOOSE &amp; SAY!</span>' : '');
      var picHtml = item.img ? '<span class="k3-picwrap"><img class="qimg" alt="" src="' + K.ROOT + K.esc(item.img) + '"></span>' : (item.pic ? '<span class="k3-picwrap"><span class="pic">' + K.esc(item.pic) + '</span></span>' : '');
      var timerHtml = (gmCfg.timer && !isAiTurn && !K.DEMO) ? '<div class="k3-timer-track"><div class="k3-timer-fill" id="k3-tfill"></div><span class="k3-timer-sec" id="k3-tsec">' + gmCfg.timer + 's</span></div>' : '';

      card.innerHTML = '<div class="qhead"><span>●</span> ' + (sp ? '<i class="qface" data-k3-face="' + sp.id + '">' + sp.initial + '</i>' + K.esc(sp.name) + '\u2019s turn · Team ' + K.esc(team.name) : 'Team ' + K.esc(team.name)) + (isAiTurn ? '<span class="k3-ai-badge">🤖 Crew AI</span>' : '') + badgeHtml + (opts.prompt ? ' — ' + opts.prompt : '') + (isAiTurn || isSpeaking ? '' : '<small class="qkhint">Keys: 1 · 2 · 3</small>') + '</div>' +
        timerHtml +
        '<div class="qtext">' + picHtml + '<span>' + K.esc(item.q) + '</span>' +
        '<button type="button" class="qsay" title="Listen">🔊</button></div>';

      // Picture Tricks: Super Zoom or Blur Slide-to-Reveal
      var picBox = card.querySelector('.k3-picwrap');
      if (picBox && gmCfg.pics === 'zoom') {
        picBox.classList.add('k3-zoomable'); picBox.title = 'Tap to zoom big';
        picBox.onclick = function () {
          var zov = K.el('div', 'k3-gm-ov k3-zoom-ov');
          zov.innerHTML = '<div class="k3-zoom-box">' + picBox.innerHTML + '</div><div class="k3-zoom-x">✕ Tap anywhere to close</div>';
          zov.onclick = function () { zov.remove(); };
          document.body.appendChild(zov);
        };
      } else if (picBox && gmCfg.pics === 'blur') {
        picBox.classList.add('k3-blurpic');
        picBox.style.setProperty('--blur', '20px');
        var rng = K.el('input', 'k3-blur-rng'); rng.type = 'range'; rng.min = '0'; rng.max = '100'; rng.value = '0';
        rng.oninput = function () { picBox.style.setProperty('--blur', (20 * (1 - rng.value / 100)).toFixed(1) + 'px'); };
        picBox.appendChild(rng);
      }

      var timerId = null, done = false;
      function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
      if (gmCfg.timer && !isAiTurn && !K.DEMO) {
        var remSec = gmCfg.timer, tFill = card.querySelector('#k3-tfill'), tSec = card.querySelector('#k3-tsec');
        timerId = setInterval(function () {
          remSec = Math.max(0, remSec - 0.1);
          if (tFill) tFill.style.width = ((remSec / gmCfg.timer) * 100).toFixed(1) + '%';
          if (tSec) tSec.textContent = Math.ceil(remSec) + 's';
          if (remSec <= 0) {
            clearTimer();
            K.sfx('wrong');
            if (tSec) tSec.textContent = '⏰ Time!';
          }
        }, 100);
      }

      function settle(ok) {
        if (done) return;
        done = true; keyFn = null; clearTimer();
        if (sp) { sp.turns++; if (ok) sp.right++; team.speakerIdx = (team.speakerIdx || 0) + 1; }
        K.sfx(ok ? 'correct' : 'wrong');
        if (ok && item.speakChoice) K.say(item.a);
        K.after(isAiTurn ? .55 : (ok ? .65 : 1.15), function () {
          wrap.remove();
          K.gm.tally(item, ok).then(function () {
            return K.gm.judge(team, ok);
          }).then(function (finalOk) {
            if (opts.onAnswer) opts.onAnswer(finalOk);
            resolve(finalOk);
          });
        });
      }

      if (isSpeaking) {
        // SPEAKING & ACTING CARD UI
        var spkBox = K.el('div', 'k3-spk-body');
        if (item.act) spkBox.appendChild(K.el('div', 'k3-spk-act', K.esc(item.act)));
        var ansPill = K.el('div', 'k3-spk-model', '<span>“' + K.esc(item.a) + '”</span>');
        var togBtn = K.el('button', 'k3-spk-tog', '🙈 Hide Model'); togBtn.type = 'button';
        togBtn.onclick = function () {
          var hid = ansPill.classList.toggle('masked');
          togBtn.textContent = hid ? '👀 Show Model' : '🙈 Hide Model';
        };
        ansPill.appendChild(togBtn);
        spkBox.appendChild(ansPill);
        if (item.words && item.words.length) {
          spkBox.appendChild(K.el('div', 'k3-spk-words', item.words.map(function (w) { return '<span>' + K.esc(w) + '</span>'; }).join('')));
        }
        var actRow = K.el('div', 'k3-spk-btns');
        var bOk = K.el('button', 'opt k3-spk-ok', '✅ Great Speaking!'); bOk.type = 'button';
        var bSuper = K.el('button', 'opt k3-spk-super', '⭐ Super Sentence!'); bSuper.type = 'button';
        var bTry = K.el('button', 'opt k3-spk-try', '🔁 Try Again'); bTry.type = 'button';
        bOk.onclick = function () { if (!isAiTurn) settle(true); };
        bSuper.onclick = function () { if (!isAiTurn) { K.ui.toast('⭐ Super Speaking!', 1.4, '#ffb320'); settle(true); } };
        bTry.onclick = function () { if (!isAiTurn) settle(false); };
        actRow.appendChild(bOk); actRow.appendChild(bSuper); actRow.appendChild(bTry);
        spkBox.appendChild(actRow);
        card.appendChild(spkBox);
        if (!isAiTurn) keyFn = function (e) { if (e.key === '1') bOk.click(); else if (e.key === '2') bSuper.click(); else if (e.key === '3') bTry.click(); };
        if (isAiTurn || K.DEMO) K.after(1.1, function () { settle(opts.demoRight !== undefined ? opts.demoRight : true); });
      } else {
        // MULTIPLE-CHOICE & SPEAKING-CHOICE CARD UI
        var choices = K.shuffle([item.a].concat(item.w.slice(0, 2)));
        var grid = K.el('div', 'opts');
        function finishAnswer(b, o) {
          if (done) return;
          var ok = o === item.a;
          Array.prototype.forEach.call(grid.children, function (x) { if (x.dataset.ans === item.a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
          settle(ok);
        }
        choices.forEach(function (o, idx) {
          var b = K.el('button', 'opt');
          b.type = 'button';
          b.dataset.ans = o;
          var kbd = K.el('kbd', 'okbd', String(idx + 1));
          var lbl = K.el('span', 'otxt', K.esc(o));
          var spk = K.el('span', 'osay', '🔊');
          spk.title = 'Hear this answer';
          spk.onclick = function (ev) { ev.stopPropagation(); K.say(o); };
          b.appendChild(kbd); b.appendChild(lbl); b.appendChild(spk);
          b.onclick = function () { if (!isAiTurn) finishAnswer(b, o); };
          if (isAiTurn) b.style.cursor = 'default';
          grid.appendChild(b);
        });
        card.appendChild(grid);
        if (!isAiTurn) keyFn = function (e) { var n = +e.key; if (n >= 1 && n <= 3 && grid.children[n - 1]) grid.children[n - 1].click(); };
        if (isAiTurn) {
          K.after(0.85, function () {
            var aiRight = Math.random() < 0.72;
            var aiBtn = Array.prototype.find.call(grid.children, function (b) { return (b.dataset.ans === item.a) === aiRight; }) || grid.children[0];
            if (aiBtn) finishAnswer(aiBtn, aiBtn.dataset.ans);
          });
        } else if (K.DEMO) K.after(1.7 + Math.random() * .6, function () {
          var right = opts.demoRight !== undefined ? opts.demoRight : Math.random() < .8;
          var targetBtn = Array.prototype.find.call(grid.children, function (b) { return (b.dataset.ans === item.a) === right; });
          if (targetBtn) targetBtn.click();
        });
      }

      wrap.appendChild(card);
      if (sp) K.cls.paintFaces(card);
      var say = function () { K.say(sayPrompt); };
      var sb = card.querySelector('.qsay'); if (sb) sb.onclick = say;
      if (!isAiTurn && ((typeof item.speak === 'string' && item.speak) || isSpeaking)) K.after(.35, say);
    });
  };

  /* ---------- questions from the Game Maker sets ---------- */
  // Questions come from the ONE shared library (games/kit/questions.js): every Game Maker set for Units 1-5,
  // Speaking & Acting sets, Speaking Choice sets, unit packs, teacher sets, and Smart Mix!
  K.questions = function (fallbackId) {
    var GM = root.GM || { sets: [] };
    var customSets = [];
    try { customSets = JSON.parse(localStorage.getItem('eaa_gm_sets_v1') || '[]') || []; } catch (e) { customSets = []; }
    var allLocalSets = (GM.sets || []).concat(customSets);
    function usable(arr) { return (arr || []).filter(function (q) { return q && q.q && q.a != null && String(q.a).trim() !== ''; }); }
    var raw = [], qs = [], i = 0, api = { title: '', id: '', selectedIdx: [] };
    function take(items, id, title) {
      raw = usable(items).map(function (x) { var o = {}; for (var k in x) o[k] = x[k]; if (!o.pic && o.img) o.pic = ''; return o; });
      if (!raw.length) raw = [{ q: 'A king of Ancient Egypt is a…', a: 'pharaoh', w: ['chariot', 'camel'], pic: '👑' }];
      api.selectedIdx = [];
      qs = K.shuffle(raw.slice());
      i = 0; api.id = id || ''; api.title = title || '';
      if (K.gm) K.gm.remDone = false;
    }
    api.usePack = function (p) { if (p) take(p.items, p.id, p.name || p.title); return api; };
    api.rawItems = function () { return raw.slice(); };
    api.allItems = function () { return qs.slice(); };
    api.applySelection = function (idxs) {
      api.selectedIdx = idxs.slice();
      var sub = idxs.map(function (idx) { return raw[idx]; }).filter(Boolean);
      if (sub.length) { qs = K.shuffle(sub); i = 0; if (K.gm) K.gm.remDone = false; }
    };
    api.next = function () { return qs[i++ % qs.length]; };
    var urlSet = Q.get('set') || Q.get('pack') || '';
    var first = urlSet || fallbackId || 'g3-u5-vocab';
    var gs = allLocalSets.find(function (x) { return x.id === first && usable(x.questions || x.items).length; }) || allLocalSets.find(function (x) { return usable(x.questions || x.items).length; });
    var matchedUrlDirectly = !!(urlSet && gs && gs.id === urlSet);
    if (gs) take(gs.questions || gs.items, gs.id, gs.title); else take([], '', '');
    api.ready = K.qlib().then(function (QL) {
      if (!QL) return api;
      if (matchedUrlDirectly) return api;
      var want = urlSet || QL.current();
      return QL.get(want || ('unit:3:5')).then(function (p) { if (p && usable(p.items).length) api.usePack(p); return api; });
    });
    K._qs = api;
    return api;
  };
  var qlibP = null;
  K.qlib = function () {
    if (qlibP) return qlibP;
    kitShim();
    qlibP = (root.Kit && root.Kit.questions ? Promise.resolve() : loadOnce(K.ROOT + 'games/kit/questions.js?v=5'))
      .then(function () { return root.Kit && root.Kit.questions && root.Kit.questions.picker ? root.Kit.questions : null; })
      .catch(function () { return null; });
    return qlibP;
  };

  // The shared question picker on the title screen (now supports ALL Quiz, Speaking Choice & Speaking/Acting sets!).
  K.ui.setPicker = function (box) {
    var holder = K.el('div', 'setpick'); box.insertBefore(holder, box.lastChild);
    K.qlib().then(function (QL) {
      if (!QL || !K._qs) { holder.remove(); return; }
      QL.picker(holder, function (p) { K._qs.usePack(p); }, { quizOnly: false, silentFirst: true });
    });
    if (K.gm && K.gm.optionsBar) K.gm.optionsBar(box);
    return holder;
  };

  /* ---------- the class: real teams, whose turn it is, faces, points to the Class Board ----------
     Uses the same class data, team shuffling and points inbox as the 2D games (games/kit/classroom.js),
     so a 3D game behaves like the others. Names and faces appear ONLY when the teacher has unlocked the
     platform in this browser; otherwise the game plays with colour teams and no pupil data at all.
     Every game: K.cls.setupRow(titleBox) on the title screen, K.cls.assign(TEAMS) when it starts,
     K.cls.pointsPanel(endBox, TEAMS, {game, title}) at the end. K.ui.ask does the turns by itself. */
  var C = K.cls = { on: false, classId: '', pupilsOf: {} };
  var INBOX_KEY = 'eaa_games_points_inbox';
  var clsReady = null;
  function loadOnce(url) {
    return new Promise(function (res) {
      if (document.querySelector('script[data-k3-src="' + url + '"]')) return res(true);
      var s = document.createElement('script'); s.src = url; s.async = true; s.setAttribute('data-k3-src', url);
      s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  /* classroom.js needs a few helpers from the 2D kit; give it small stand-ins when that kit is not on the page */
  function kitShim() {
    var Kit = root.Kit = root.Kit || {};
    if (!Kit.pref) {
      var PKEY = 'eaa_games_prefs', prefs = {};
      try { prefs = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { prefs = {}; }
      Kit.pref = function (k, v) { if (arguments.length < 2) return prefs[k]; prefs[k] = v; try { localStorage.setItem(PKEY, JSON.stringify(prefs)); } catch (e) {} return v; };
    }
    if (!Kit.shuffle) Kit.shuffle = K.shuffle;
    if (!Kit.clamp) Kit.clamp = K.clamp;
    if (!Kit.TEAM_LOOK) Kit.TEAM_LOOK = [];
    if (Kit.preview == null) Kit.preview = false;
    if (!root.KIT_ROOT) root.KIT_ROOT = K.ROOT;
    return Kit;
  }
  C.boot = function () {
    if (clsReady) return clsReady;
    if (K.DEMO && !Q.has('cls')) return (clsReady = Promise.resolve(false));   // ?cls=1 lets the automatic tests use a made-up class
    kitShim();
    clsReady = loadOnce(K.ROOT + 'games/kit/classroom.js?v=3').then(function () {
      var R = root.Kit && root.Kit.classroom;
      return !!(R && R.isTeacherSession());
    });
    return clsReady;
  };
  function R() { return root.Kit && root.Kit.classroom; }
  C.face = function (id) {
    try { return (root.PupilAvatars && root.PupilAvatars.pictureFor && root.PupilAvatars.pictureFor(id)) || ''; } catch (e) { return ''; }
  };
  C.speaker = function (team) {
    if (!team || !team.pupils || !team.pupils.length) return null;
    return team.pupils[(team.speakerIdx || 0) % team.pupils.length];
  };
  /* the title screen row: pick the class (or no names), see the teams, shuffle them */
  C.setupRow = function (box, nTeams) {
    if (!K.ui.preview) K.ui.setPicker(box);
    if (!K.ui.preview && (K.island.from === 'island' || K.island.from === 'practice-island' || Q.has('solo'))) {
      K.solo.toggleRow(box);
    }
    var wrap = K.el('div', 'clsbox'); box.insertBefore(wrap, box.lastChild);
    C.boot().then(function (ok) {
      if (!ok) { wrap.remove(); return; }
      var list = R().classes();
      if (!list.length) { wrap.remove(); return; }
      var Kit = root.Kit;
      var urlCls = Q.get('class') || '';
      var saved = urlCls || Kit.pref('classId');
      C.classId = saved === 'none' ? '' : (list.some(function (c) { return c.id === saved; }) ? saved : R().defaultClassId());
      if (urlCls && C.classId === urlCls) Kit.pref('classId', urlCls);
      function draw(remix) {
        wrap.innerHTML = '';
        var pick = K.el('div', 'clspick');
        list.forEach(function (c) {
          var b = K.el('button', 'clsbtn' + (c.id === C.classId ? ' on' : ''), c.label);
          b.onclick = function () { C.classId = c.id; Kit.pref('classId', c.id); draw(); };
          pick.appendChild(b);
        });
        var none = K.el('button', 'clsbtn' + (!C.classId ? ' on' : ''), '🎨 No names');
        none.title = 'Play with colour teams only';
        none.onclick = function () { C.classId = ''; Kit.pref('classId', 'none'); draw(); };
        pick.appendChild(none);
        var soloBtn = K.el('button', 'clsbtn' + (K.solo.on ? ' on' : ''), '🤖 1P vs AI');
        soloBtn.title = 'Team 1 (Player) vs AI Island Crew';
        soloBtn.onclick = function () { K.solo.on = !K.solo.on; draw(); };
        pick.appendChild(soloBtn);
        wrap.appendChild(pick);
        C.on = false; C.preview = null;
        if (!C.classId) return;
        var teams = R().buildTeams(nTeams, { classId: C.classId, teamMode: 'fair', forceRemix: !!remix });
        if (!teams.some(function (t) { return t.pupils && t.pupils.length; })) return;
        C.on = true; C.preview = teams;
        var grid = K.el('div', 'clsteams');
        teams.slice(0, nTeams).forEach(function (t, i) {
          var col = K.el('div', 'clsteam'); col.style.setProperty('--c', K.TEAMS[i].c);
          col.appendChild(K.el('b', '', K.TEAMS[i].name));
          (t.pupils || []).forEach(function (p) {
            var chip = K.el('span', 'clskid');
            chip.innerHTML = '<i data-k3-face="' + p.id + '">' + p.initial + '</i>' + K.esc(p.name);
            col.appendChild(chip);
          });
          grid.appendChild(col);
        });
        wrap.appendChild(grid);
        var mix = K.el('button', 'clsbtn mix', '🔀 New teams'); mix.onclick = function () { draw(true); };
        wrap.appendChild(mix);
        C.paintFaces(wrap);
      }
      draw();
      root.addEventListener('eaa:avatars-ready', function () { C.paintFaces(wrap); });
      [1500, 4000, 8000].forEach(function (ms) { setTimeout(function () { C.paintFaces(document); }, ms); });
    });
  };
  C.paintFaces = function (scope) {
    var nodes = (scope || document).querySelectorAll('[data-k3-face]');
    Array.prototype.forEach.call(nodes, function (n) {
      var u = C.face(n.getAttribute('data-k3-face'));
      if (!u) return;
      var im = n.querySelector('img');
      if (!im) { n.textContent = ''; im = document.createElement('img'); im.alt = ''; n.appendChild(im); }
      if (im.getAttribute('src') !== u) im.setAttribute('src', u);
    });
  };
  /* when the game starts: give each colour team its pupils */
  C.assign = function (TEAMS) {
    if (!C.on || !C.preview) return;
    TEAMS.forEach(function (t, i) {
      var src = C.preview[i];
      t.pupils = src && src.pupils ? src.pupils.map(function (p) { return { id: p.id, name: p.name, initial: p.initial, right: 0, turns: 0 }; }) : [];
      t.speakerIdx = 0;
    });
  };
  K.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* how many points each child gets: by the team's place, plus 2 for every own right answer (5..30) */
  var PLACE_XP = [20, 15, 10, 10];
  C.pointsPanel = function (box, TEAMS, opts) {
    opts = opts || {};
    var scoreOf = opts.scoreOf || function (t) { return t.score || 0; };
    var bestTeam = (TEAMS && TEAMS[0]) || { name: 'Pink' };
    var bestScore = -Infinity;
    (TEAMS || []).forEach(function (t) {
      var s = scoreOf(t);
      if (s > bestScore) { bestScore = s; bestTeam = t; }
    });
    K.island.recordWin(opts.game || K.island.gameId, {
      winner: 'Team ' + bestTeam.name,
      score: Math.max(0, Math.round(bestScore || 0)),
      bridgeXp: 45
    });
    var hasPupils = C.on && C.classId && TEAMS.some(function (t) { return t.pupils && t.pupils.length; });
    if (K.gm && !K.DEMO) {
      var revRow = K.el('div', 'k3-gm-endrow');
      if (K.gm.sessionTally && K.gm.sessionTally.some(function (x) { return x.f <= 0.5; })) {
        var hrB = K.el('button', 'k3-gm-sbtn amber', '📋 What We Found Hard'); hrB.type = 'button';
        hrB.onclick = function () { K.gm.hardReview(); };
        revRow.appendChild(hrB);
      }
      var etB = K.el('button', 'k3-gm-sbtn green', '📝 Exit Ticket (3 Qs)'); etB.type = 'button';
      etB.onclick = function () { K.gm.exitTicket(K._qs && K._qs.allItems ? K._qs.allItems() : []); };
      revRow.appendChild(etB);
      box.appendChild(revRow);
    }
    if (!hasPupils) {
      K.island.endButtons(box, opts.game || K.island.gameId);
      return null;
    }
    var sorted = TEAMS.map(function (t) { return scoreOf(t); }).sort(function (a, b) { return b - a; });
    var base = TEAMS.map(function (t) { return PLACE_XP[Math.min(3, sorted.indexOf(scoreOf(t)))]; });
    var stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6), sent = false;
    var card = K.el('div', 'xpcard');
    var rows = K.el('div', 'xprows'), send = K.el('button', 'btn green', '');
    function xpFor(t, i, p) { return K.clamp(base[i] + 2 * (p.right || 0), 5, 30); }
    function total() { var n = 0, k = 0; TEAMS.forEach(function (t, i) { (t.pupils || []).forEach(function (p) { n += xpFor(t, i, p); k++; }); }); return { xp: n, kids: k }; }
    function draw() {
      rows.innerHTML = '';
      TEAMS.forEach(function (t, i) {
        if (!t.pupils || !t.pupils.length) return;
        var r = K.el('div', 'xprow'); r.style.setProperty('--c', t.c);
        var minus = K.el('button', 'xpstep', '−'), plus = K.el('button', 'xpstep', '+');
        minus.disabled = sent || base[i] <= 5; plus.disabled = sent || base[i] >= 25;
        minus.onclick = function () { base[i] = Math.max(5, base[i] - 5); draw(); };
        plus.onclick = function () { base[i] = Math.min(25, base[i] + 5); draw(); };
        var kids = t.pupils.map(function (p) { return '<span class="xpkid"><i data-k3-face="' + p.id + '">' + p.initial + '</i>' + K.esc(p.name) + ' <b>+' + xpFor(t, i, p) + '</b></span>'; }).join('');
        r.innerHTML = '<div class="xpteam">' + t.name + '</div><div class="xpkids">' + kids + '</div>';
        var ctl = K.el('div', 'xpctl'); ctl.appendChild(minus); ctl.appendChild(K.el('b', '', base[i] + ' XP')); ctl.appendChild(plus);
        r.appendChild(ctl); rows.appendChild(r);
      });
      var tt = total();
      send.textContent = sent ? '✓ Sent to Class Board & Treasure Bridge!' : '⭐ Send ' + tt.xp + ' XP to ' + tt.kids + ' pupils';
      send.disabled = sent;
      C.paintFaces(card);
    }
    send.onclick = function () {
      if (sent) return;
      var entries = [];
      TEAMS.forEach(function (t, i) {
        (t.pupils || []).forEach(function (p) {
          entries.push({ id: (opts.game || 'game3d') + '_' + stamp + '_' + p.id, studentId: p.id, classId: C.classId, amount: xpFor(t, i, p),
            reason: (opts.title || '3D game') + ' · Team ' + t.name, icon: '🎮', ts: Date.now() });
        });
      });
      var inbox = [];
      try { inbox = JSON.parse(localStorage.getItem(INBOX_KEY) || '[]') || []; } catch (e) { inbox = []; }
      var have = {}; inbox.forEach(function (e) { if (e && e.id) have[e.id] = 1; });
      entries.forEach(function (e) { if (!have[e.id]) inbox.push(e); });
      try { localStorage.setItem(INBOX_KEY, JSON.stringify(inbox)); } catch (e) {}
      try { if (root.BroadcastChannel) { var bc = new BroadcastChannel('eaa_games_xp'); bc.postMessage({ type: 'XP_QUEUED', count: entries.length }); bc.close(); } } catch (e) {}
      sent = true; K.sfx('win'); draw();
    };
    card.appendChild(K.el('div', 'xphead', '⭐ Points for the Class Board <small>place in the game + 2 for each own right answer</small>'));
    card.appendChild(rows); card.appendChild(send);
    box.insertBefore(card, box.firstChild.nextSibling || null);
    draw();
    K.island.endButtons(box, opts.game || K.island.gameId);
    return card;
  };
})(window);
