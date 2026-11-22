/* games/engine3d/JuiceManager.js
 * GameQualityCore — Module 3: Angry Birds / Nintendo "Game Feel & Juice"
 * Powers: Anticipation & Squash/Stretch Tweens, True 40ms Hitstop Freeze,
 * Damped Spring Camera Micro-Shake, Typed 3D Particle Bursts (Splinters/Dust/Stars/Splash),
 * Bouncy Screen-Projected Score Popups, Avatar Head-Tracking Idle Life & Bottom 18% UI Safe Zone Camera.
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var GQC = root.GameQualityCore = root.GameQualityCore || {};

  var _tweens = [];       // { obj, baseScale, sx, sy, sz, elapsed, dur }
  var _particles = [];    // { mesh, vx, vy, vz, rx, ry, rz, age, life, gravity, baseScale }
  var _idleTrackers = []; // { obj, baseRotY, baseScaleY, getTarget, phase }
  var _hitstopUntilMs = 0;
  var _preHitstopTimeScale = 1.0;
  var _shake = { amp: 0, elapsed: 0, dur: 0.3, seed: 0 };
  var _sharedBoxGeo = null;
  var _sharedSphereGeo = null;
  var _popupContainer = null;

  function ensurePopupContainer() {
    if (_popupContainer && _popupContainer.parentNode) return _popupContainer;
    _popupContainer = document.createElement('div');
    _popupContainer.id = 'gqc-juice-popups';
    _popupContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:28;overflow:hidden;';
    document.body.appendChild(_popupContainer);

    if (!document.getElementById('gqc-juice-style')) {
      var st = document.createElement('style');
      st.id = 'gqc-juice-style';
      st.textContent = [
        '@keyframes gqcPopFloat {',
        '  0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0; }',
        '  22%  { transform: translate(-50%, -78%) scale(1.18); opacity: 1; }',
        '  42%  { transform: translate(-50%, -92%) scale(0.98); opacity: 1; }',
        '  100% { transform: translate(-50%, -155%) scale(1.04); opacity: 0; }',
        '}',
        '.gqc-score-pop {',
        '  position: absolute;',
        '  font-family: "Nunito", "Fredoka", "Trebuchet MS", system-ui, sans-serif;',
        '  font-weight: 900;',
        '  letter-spacing: 0.01em;',
        '  white-space: nowrap;',
        '  color: #ffffff;',
        '  text-shadow: 0 3px 0 #2b1d40, -2px -2px 0 #2b1d40, 2px -2px 0 #2b1d40, -2px 2px 0 #2b1d40, 2px 2px 0 #2b1d40, 0 8px 18px rgba(43,29,64,0.35);',
        '  animation: gqcPopFloat 1.08s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;',
        '  will-change: transform, opacity;',
        '}'
      ].join('\n');
      document.head.appendChild(st);
    }
    return _popupContainer;
  }

  // 1. ANTICIPATION & SQUASH/STRETCH
  function rememberBaseScale(obj) {
    if (!obj.userData._gqcBaseScale) {
      obj.userData._gqcBaseScale = obj.scale.clone();
    }
    return obj.userData._gqcBaseScale;
  }

  function setPullTension(obj, tension01) {
    if (!obj) return;
    var bs = rememberBaseScale(obj);
    var t = Math.max(0, Math.min(1, tension01 || 0));
    // Anticipation squash: hunkers down & widens slightly as charge builds!
    obj.scale.set(
      bs.x * (1 + 0.14 * t),
      bs.y * (1 - 0.15 * t),
      bs.z * (1 + 0.10 * t)
    );
  }

  function squashStretch(obj, sx, sy, sz, durationSec) {
    if (!obj) return;
    var bs = rememberBaseScale(obj);
    for (var i = _tweens.length - 1; i >= 0; i--) {
      if (_tweens[i].obj === obj) _tweens.splice(i, 1);
    }
    obj.scale.set(bs.x * (sx || 1.2), bs.y * (sy || 0.8), bs.z * (sz || 1.2));
    _tweens.push({
      obj: obj,
      baseScale: bs,
      sx: sx || 1.2,
      sy: sy || 0.8,
      sz: sz || 1.2,
      elapsed: 0,
      dur: durationSec || 0.38
    });
  }

  // 2. TRUE 40ms HITSTOP (Wall-Clock Guarded so K.timeScale ALWAYS Recovers!)
  function hitstop(ms) {
    var durMs = Math.min(110, Math.max(20, ms || 42));
    var now = performance.now();
    if (now >= _hitstopUntilMs && root.K3) {
      _preHitstopTimeScale = root.K3.timeScale || 1.0;
    }
    _hitstopUntilMs = Math.max(_hitstopUntilMs, now + durMs);
    if (root.K3) root.K3.timeScale = 0.04;
    setTimeout(function () {
      if (performance.now() >= _hitstopUntilMs - 2 && root.K3) {
        root.K3.timeScale = 1.0;
      }
    }, durMs + 6);
  }

  // 3. DAMPED SPRING CAMERA SHAKE
  function shakeCamera(intensity, durationSec) {
    _shake.amp = Math.max(_shake.amp, intensity || 0.32);
    _shake.dur = durationSec || 0.34;
    _shake.elapsed = 0;
    _shake.seed = Math.random() * 100;
    if (root.K3 && root.K3.cam && root.K3.cam.shake) {
      root.K3.cam.shake((intensity || 0.32) * 0.85);
    }
  }

  // 4. TYPED 3D PARTICLE BURSTS ('splinters' | 'dust' | 'stars' | 'splash')
  function spawnBurst(scene, pos, type, countOverride) {
    if (!scene || !pos) return;
    if (!_sharedBoxGeo) _sharedBoxGeo = new T3.BoxGeometry(0.24, 0.07, 0.11);
    if (!_sharedSphereGeo) _sharedSphereGeo = new T3.SphereGeometry(0.14, 8, 6);

    var kind = type || 'splinters';
    var palette = kind === 'stars'     ? [0xffb320, 0xff5fa2, 0x4f9dff, 0x2fc58a, 0xfff3b0]
                : kind === 'splash'    ? [0xffffff, 0x9ef3ff, 0x48dbfb]
                : kind === 'dust'      ? [0xf7e6c4, 0xfff5e0, 0xe2c799]
                :                        [0xc88746, 0xdfb07a, 0x9c6230, 0xf2d399];
    var count = countOverride || (kind === 'stars' ? 16 : kind === 'splash' ? 14 : 11);
    var isBox = kind === 'splinters' || kind === 'stars';

    for (var i = 0; i < count; i++) {
      var col = palette[i % palette.length];
      var mat = new T3.MeshLambertMaterial({
        color: col,
        emissive: new T3.Color(col),
        emissiveIntensity: kind === 'stars' ? 0.45 : 0.12,
        transparent: kind === 'dust',
        opacity: kind === 'dust' ? 0.85 : 1.0
      });
      var m = new T3.Mesh(isBox ? _sharedBoxGeo : _sharedSphereGeo, mat);
      var s = kind === 'dust' ? (1.1 + Math.random() * 0.9) : (0.75 + Math.random() * 0.75);
      m.scale.setScalar(s);
      m.position.set(
        pos.x + (Math.random() - 0.5) * 0.5,
        pos.y + Math.random() * 0.4,
        pos.z + (Math.random() - 0.5) * 0.5
      );
      scene.add(m);

      var ang = Math.random() * Math.PI * 2;
      var spd = (kind === 'dust' ? 2.6 : 5.2) + Math.random() * 4.8;
      _particles.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: (kind === 'dust' ? 2.2 : 4.6) + Math.random() * 5.2,
        vz: Math.sin(ang) * spd,
        rx: (Math.random() - 0.5) * 14,
        ry: (Math.random() - 0.5) * 14,
        rz: (Math.random() - 0.5) * 14,
        age: 0,
        life: kind === 'dust' ? 0.55 : (0.68 + Math.random() * 0.28),
        gravity: kind === 'dust' ? -2.5 : -17.5,
        baseScale: s
      });
    }
  }

  // 5. BOUNCY SCREEN-PROJECTED SCORE POPUPS (+100!, BOOM!, SUNK!)
  var _projVec = null;
  function popupScore(text, worldPos, camera, colorHexOrCss, scaleMul) {
    // Support both (text, worldPos, camera, color, scaleMul) AND legacy (worldPos, camera, text, color, scaleMul)
    if (text && typeof text === 'object' && text.isVector3) {
      var tmpPos = text, tmpCam = worldPos, tmpText = camera;
      text = tmpText;
      worldPos = tmpPos;
      camera = tmpCam;
    }
    if (!text || !worldPos || !camera || !camera.matrixWorldInverse) return;
    var host = ensurePopupContainer();
    if (!_projVec) _projVec = new T3.Vector3();
    _projVec.copy(worldPos);
    _projVec.y += 1.05;
    _projVec.project(camera);
    if (_projVec.z > 1.0) return;

    var x = (_projVec.x * 0.5 + 0.5) * (window.innerWidth || 1280);
    var y = (-_projVec.y * 0.5 + 0.5) * (window.innerHeight || 720);

    var el = document.createElement('div');
    el.className = 'gqc-score-pop';
    el.textContent = text;
    var fs = Math.round(26 * (scaleMul || 1.0));
    el.style.fontSize = fs + 'px';
    if (colorHexOrCss) {
      el.style.color = typeof colorHexOrCss === 'number'
        ? ('#' + ('000000' + colorHexOrCss.toString(16)).slice(-6))
        : colorHexOrCss;
    }
    el.style.left = Math.max(60, Math.min((window.innerWidth || 1280) - 60, x)) + 'px';
    el.style.top = Math.max(70, Math.min((window.innerHeight || 720) - 90, y)) + 'px';
    host.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1120);
  }

  // 6. AVATAR & MONSTER IDLE BREATHING + TARGET/PROJECTILE HEAD-TRACKING
  function attachIdleLife(obj3d, baseRotY, getFocusWorldPosFn) {
    if (!obj3d) return;
    rememberBaseScale(obj3d);
    for (var i = _idleTrackers.length - 1; i >= 0; i--) {
      if (_idleTrackers[i].obj === obj3d) _idleTrackers.splice(i, 1);
    }
    _idleTrackers.push({
      obj: obj3d,
      baseRotY: baseRotY != null ? baseRotY : obj3d.rotation.y,
      getTarget: getFocusWorldPosFn || null,
      phase: Math.random() * Math.PI * 2
    });
  }

  // 7. CAMERA CHOREOGRAPHY WITH STRICT BOTTOM 18% UI SAFE ZONE!
  function computeSafeZoneAimCamera(yaw, pitch, charge01, aspect, outPos, outLook) {
    var isPortrait = aspect < 0.68;
    var zoomBack = (charge01 || 0) * 1.35; // Subtle anticipation pull-back during charge!
    // Exact projection math: places cannon/avatar/monster feet at ~79.5% screen Y,
    // keeping the entire bottom 20% UI Safe Zone 100% clear while framing targets at 44%-52% Y!
    outPos.set(
      Math.sin(yaw) * -2.2,
      (isPortrait ? 6.95 : 6.35) + (charge01 || 0) * 0.30,
      (isPortrait ? 25.4 : 23.4) + zoomBack
    );
    outLook.set(
      Math.sin(yaw) * -11.5,
      0.55 + (pitch - 0.19) * 2.4,
      -13.0
    );
  }

  var _worldPosTmp = null;
  var _lastUpdateTimeSec = -999;
  function update(dt, timeSec, activeCamera) {
    if (Math.abs(timeSec - _lastUpdateTimeSec) < 1e-6 && _hitstopUntilMs === 0) return;
    _lastUpdateTimeSec = timeSec;
    if (!_worldPosTmp) _worldPosTmp = new T3.Vector3();

    if (_hitstopUntilMs > 0 && performance.now() >= _hitstopUntilMs) {
      _hitstopUntilMs = 0;
      if (root.K3 && root.K3.timeScale < 0.2) root.K3.timeScale = _preHitstopTimeScale || 1.0;
    }

    // Update Squash/Stretch elastic spring tweens
    for (var i = _tweens.length - 1; i >= 0; i--) {
      var tw = _tweens[i];
      tw.elapsed += dt;
      var u = Math.min(1, tw.elapsed / tw.dur);
      var damp = Math.exp(-6.5 * u) * Math.cos(u * Math.PI * 2.5);
      var bs = tw.baseScale;
      tw.obj.scale.set(
        bs.x * (1 + (tw.sx - 1) * damp),
        bs.y * (1 + (tw.sy - 1) * damp),
        bs.z * (1 + (tw.sz - 1) * damp)
      );
      if (u >= 1) {
        tw.obj.scale.copy(bs);
        _tweens.splice(i, 1);
      }
    }

    // Update 3D burst particles
    for (var p = _particles.length - 1; p >= 0; p--) {
      var pt = _particles[p];
      pt.age += dt;
      if (pt.age >= pt.life) {
        if (pt.mesh.parent) pt.mesh.parent.remove(pt.mesh);
        if (pt.mesh.material) pt.mesh.material.dispose();
        _particles.splice(p, 1);
        continue;
      }
      pt.vy += pt.gravity * dt;
      pt.mesh.position.x += pt.vx * dt;
      pt.mesh.position.y += pt.vy * dt;
      pt.mesh.position.z += pt.vz * dt;
      pt.mesh.rotation.x += pt.rx * dt;
      pt.mesh.rotation.y += pt.ry * dt;
      pt.mesh.rotation.z += pt.rz * dt;
      var fade = 1 - pt.age / pt.life;
      pt.mesh.scale.setScalar(pt.baseScale * (0.35 + 0.65 * fade));
    }

    // Update Idle Breathing + Target/Projectile Look-Tracking
    for (var k = _idleTrackers.length - 1; k >= 0; k--) {
      var tr = _idleTrackers[k];
      if (!tr.obj || !tr.obj.parent) {
        _idleTrackers.splice(k, 1);
        continue;
      }
      var bs2 = tr.obj.userData._gqcBaseScale;
      if (bs2) {
        var breathe = Math.sin(timeSec * 2.8 + tr.phase) * 0.024;
        tr.obj.scale.y = bs2.y * (1 + breathe);
        tr.obj.scale.x = bs2.x * (1 - breathe * 0.45);
      }
      if (tr.getTarget) {
        var focus = tr.getTarget();
        if (focus) {
          tr.obj.getWorldPosition(_worldPosTmp);
          var desiredYaw = Math.atan2(focus.x - _worldPosTmp.x, focus.z - _worldPosTmp.z);
          // Clamp turn relative to baseRotY so characters turn naturally without twisting 180° backward
          var diff = desiredYaw - tr.baseRotY;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          var clamped = tr.baseRotY + Math.max(-0.68, Math.min(0.68, diff));
          var cur = tr.obj.rotation.y;
          var stepDiff = clamped - cur;
          while (stepDiff > Math.PI) stepDiff -= Math.PI * 2;
          while (stepDiff < -Math.PI) stepDiff += Math.PI * 2;
          tr.obj.rotation.y = cur + stepDiff * Math.min(1, dt * 6.5);
        }
      }
    }

    // Optional damped micro-shake on non-kit3d cameras
    if (_shake.amp > 0.001) {
      _shake.elapsed += dt;
      if (_shake.elapsed >= _shake.dur) {
        _shake.amp = 0;
      } else if (activeCamera && !(root.K3 && root.K3.cam)) {
        var decay = Math.exp(-8 * (_shake.elapsed / _shake.dur)) * _shake.amp;
        activeCamera.position.x += Math.sin(timeSec * 52 + _shake.seed) * decay * 0.08;
        activeCamera.position.y += Math.cos(timeSec * 47 + _shake.seed) * decay * 0.06;
      }
    }
  }

  GQC.Juice = {
    setPullTension: setPullTension,
    squashStretch: squashStretch,
    hitstop: hitstop,
    shakeCamera: shakeCamera,
    spawnBurst: spawnBurst,
    popupScore: popupScore,
    attachIdleLife: attachIdleLife,
    computeSafeZoneAimCamera: computeSafeZoneAimCamera,
    update: update
  };
})(typeof window !== 'undefined' ? window : this);
