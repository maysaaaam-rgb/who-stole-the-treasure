// Quiet Island — Reactive Classroom Noise System for Adventure Island (home3d)
// Follows island-work/QUIET-ISLAND-PLAN.md & docs/STYLE_GUIDE.md
// Privacy: microphone starts ONLY when turned ON, measures RMS loudness only (never recorded/sent), stops tracks on OFF/leave.
(function () {
  'use strict';

  var HOST = null;
  var QS = new URLSearchParams(location.search);
  var TEST_MODE = QS.get('quiettest') === '1';

  // Activity presets: threshold offsets above room baseline (dB), beacon colour, allowStorm
  var ACTIVITIES = {
    silent:  { label: 'Silent work', color: '#ff5fa2', hex: 0xff5fa2, uneasyDb: 7,  loudDb: 15, storm: true  },
    whisper: { label: 'Whisper',     color: '#ffb320', hex: 0xffb320, uneasyDb: 13, loudDb: 22, storm: true  },
    talk:    { label: 'Group talk',  color: '#2fc58a', hex: 0x2fc58a, uneasyDb: 20, loudDb: 30, storm: true  },
    free:    { label: 'Free play',   color: '#9b7bff', hex: 0x9b7bff, uneasyDb: 99, loudDb: 99, storm: false }
  };

  // Core state
  var isOn = false;
  var activity = 'whisper';
  var sensitivity = 0.5; // 0 = more gentle (+6 dB), 1 = more strict (-6 dB)
  var baselineDb = -52;  // calibrated room quiet floor
  var curState = 'calm'; // 'calm' | 'uneasy' | 'loud' | 'returning'
  var smoothLevel = 0;   // 0..1 normalized noise level
  var testSliderVal = 0; // 0..100 in ?quiettest=1 mode
  var testForced = false;
  var stateTimer = 0;    // seconds condition met for transition
  var returnElapsed = 0; // seconds since entering 'returning'
  var calmSeconds = 0;   // continuous calm seconds while ON
  var isCalibrating = false;
  var calSamples = [];
  var calStart = 0;

  // Audio / Mic state
  var micStream = null;
  var micCtx = null;
  var micAnalyser = null;
  var micBuf = null;
  var soundMuted = false;

  // Weather & FX state
  var stormMix = 0;      // 0..1 visual storm blend
  var rainMix = 0;       // 0..1 rain blend
  var sunbeamMix = 0;    // 0..1 returning sunbeams
  var sunbeamAge = 99;
  var lightningTimer = 6;
  var lightningStreak = 0;
  var lightningFlash = 0;
  var cloudSprites = [];
  var sunbeamMeshes = [];
  var rainLines = null;
  var rainVel = null;
  var ripples = [];
  var puffs = [];
  var sparkles = [];
  var qMarks = [];

  // Living creature objects
  var birds = [];
  var butterflies = [];
  var crab = null;
  var frog = null;
  var fishes = [];
  var beaconOrb = null;
  var beaconCone = null;
  var beaconMat = null;
  var beaconConeMat = null;
  var beaconLight = null;
  var monOrigin = [];
  var balloonOrigin = null;
  var castleDoor = { x: -4.9, z: -19.2 };

  // Returning schedule (~1.5s apart)
  var RETURN_ORDER = [
    { key: 'butterflies', at: 0.0  },
    { key: 'bunny',       at: 1.5  },
    { key: 'sheep',       at: 3.0  },
    { key: 'crab',        at: 4.5  },
    { key: 'axolotl',     at: 6.0  },
    { key: 'owl',         at: 7.5  },
    { key: 'kids',        at: 9.0  },
    { key: 'birds',       at: 10.5 }
  ];
  var returnedFlags = {};
  var islandReturnSparkled = false;

  // DOM refs
  var domTopBtn = null;
  var domPanel = null;
  var domPowerBtn = null;
  var domStatePill = null;
  var domCalBtn = null;
  var domCalBar = null;
  var domCalFill = null;
  var domMsg = null;
  var domFlash = null;
  var domTestSlider = null;

  // Helpers
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutBack(t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  // =========================================================================
  // 1. PROCEDURAL WEB AUDIO SOUNDSCAPE (0 external files, low volume, smooth fades)
  // =========================================================================
  var SFX = (function () {
    var ctx = null, master = null;
    var waveGain = null, windGain = null, rainGain = null;
    var noiseBuf = null;
    var nextBird = 2.0, nextNote = 1.0, noteIdx = 0;
    var PENT = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

    function ensure() {
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume().catch(function () {});
        return true;
      }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = soundMuted ? 0 : 0.22;
        master.connect(ctx.destination);

        // Shared 3s pink-ish noise buffer
        var len = ctx.sampleRate * 3;
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = noiseBuf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
        for (var i = 0; i < len; i++) {
          var w = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + w * 0.029;
          b1 = 0.985 * b1 + w * 0.032;
          b2 = 0.950 * b2 + w * 0.048;
          d[i] = (b0 + b1 + b2 + w * 0.015) * 0.6;
        }

        // Gentle waves loop
        var wSrc = ctx.createBufferSource(); wSrc.buffer = noiseBuf; wSrc.loop = true;
        var wFilt = ctx.createBiquadFilter(); wFilt.type = 'lowpass'; wFilt.frequency.value = 340;
        var wLfo = ctx.createOscillator(); wLfo.frequency.value = 0.14;
        var wLfoG = ctx.createGain(); wLfoG.gain.value = 140;
        wLfo.connect(wLfoG); wLfoG.connect(wFilt.frequency);
        waveGain = ctx.createGain(); waveGain.gain.value = 0.0001;
        wSrc.connect(wFilt); wFilt.connect(waveGain); waveGain.connect(master);
        wSrc.start(); wLfo.start();

        // Soft wind loop
        var wiSrc = ctx.createBufferSource(); wiSrc.buffer = noiseBuf; wiSrc.loop = true;
        var wiFilt = ctx.createBiquadFilter(); wiFilt.type = 'bandpass'; wiFilt.frequency.value = 520; wiFilt.Q.value = 1.6;
        windGain = ctx.createGain(); windGain.gain.value = 0.0001;
        wiSrc.connect(wiFilt); wiFilt.connect(windGain); windGain.connect(master);
        wiSrc.start();

        // Rain patter loop
        var rSrc = ctx.createBufferSource(); rSrc.buffer = noiseBuf; rSrc.loop = true;
        var rFilt = ctx.createBiquadFilter(); rFilt.type = 'bandpass'; rFilt.frequency.value = 1850; rFilt.Q.value = 0.7;
        rainGain = ctx.createGain(); rainGain.gain.value = 0.0001;
        rSrc.connect(rFilt); rFilt.connect(rainGain); rainGain.connect(master);
        rSrc.start();

        return true;
      } catch (e) {
        ctx = null;
        return false;
      }
    }

    function setMuted(m) {
      soundMuted = !!m;
      if (master && ctx) {
        master.gain.setTargetAtTime(soundMuted ? 0 : 0.22, ctx.currentTime, 0.15);
      }
    }

    function updateBed(dt) {
      if (!ctx || !isOn) {
        if (ctx && waveGain) {
          var t0 = ctx.currentTime;
          waveGain.gain.setTargetAtTime(0.0001, t0, 0.4);
          windGain.gain.setTargetAtTime(0.0001, t0, 0.4);
          rainGain.gain.setTargetAtTime(0.0001, t0, 0.4);
        }
        return;
      }
      var t = ctx.currentTime;
      var wTarget = curState === 'calm' ? 0.16 : curState === 'returning' ? 0.18 : curState === 'uneasy' ? 0.22 : 0.26;
      var wiTarget = curState === 'calm' ? 0.02 : curState === 'returning' ? 0.04 : curState === 'uneasy' ? 0.14 : 0.24;
      var rTarget = curState === 'loud' ? 0.25 : 0.0001;
      // 1.5s smooth crossfade time constant (~0.5s tau -> ~1.5s 95% settle)
      waveGain.gain.setTargetAtTime(wTarget, t, 0.5);
      windGain.gain.setTargetAtTime(wiTarget, t, 0.5);
      rainGain.gain.setTargetAtTime(rTarget, t, 0.5);

      if (soundMuted) return;

      // Soft birdsong in calm / returning
      if (curState === 'calm' || curState === 'returning') {
        nextBird -= dt;
        if (nextBird <= 0) {
          nextBird = 2.6 + Math.random() * 4.2;
          playBirdChirp();
        }
      }
      // Gentle pentatonic ukulele/marimba melody in returning (and softly in calm)
      if (curState === 'returning' || curState === 'calm') {
        nextNote -= dt;
        if (nextNote <= 0) {
          nextNote = curState === 'returning' ? (0.75 + Math.random() * 0.45) : (2.4 + Math.random() * 2.2);
          playSoftPluck(PENT[noteIdx % PENT.length], curState === 'returning' ? 0.11 : 0.045);
          noteIdx += 1 + ((Math.random() * 2) | 0);
        }
      }
    }

    function playBirdChirp() {
      if (!ctx || soundMuted) return;
      var t = ctx.currentTime;
      var o = ctx.createOscillator(), g = ctx.createGain();
      var f0 = 2100 + Math.random() * 700;
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.32, t + 0.08);
      o.frequency.exponentialRampToValueAtTime(f0 * 0.92, t + 0.17);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.21);
    }

    function playSoftPluck(freq, vol) {
      if (!ctx || soundMuted) return;
      var t = ctx.currentTime;
      var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o1.type = 'triangle'; o2.type = 'sine';
      o1.frequency.setValueAtTime(freq, t);
      o2.frequency.setValueAtTime(freq * 2, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      var g2 = ctx.createGain(); g2.gain.value = 0.25;
      o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
      o1.start(t); o2.start(t); o1.stop(t + 0.72); o2.stop(t + 0.72);
    }

    function playDing(step) {
      if (!ctx || soundMuted) return;
      var f = PENT[(step || 0) % PENT.length];
      playSoftPluck(f, 0.14);
    }

    function playCalmChime() {
      if (!ctx || soundMuted) return;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        setTimeout(function () { playSoftPluck(f, 0.13); }, i * 110);
      });
    }

    function playSplash() {
      if (!ctx || soundMuted || !noiseBuf) return;
      var t = ctx.currentTime;
      var s = ctx.createBufferSource(); s.buffer = noiseBuf;
      var flt = ctx.createBiquadFilter(); flt.type = 'bandpass';
      flt.frequency.setValueAtTime(1100, t);
      flt.frequency.exponentialRampToValueAtTime(320, t + 0.28);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      s.connect(flt); flt.connect(g); g.connect(master);
      s.start(t); s.stop(t + 0.35);
    }

    function playThunder() {
      if (!ctx || soundMuted || !noiseBuf) return;
      var t = ctx.currentTime;
      var s = ctx.createBufferSource(); s.buffer = noiseBuf;
      var flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 95;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.26, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      s.connect(flt); flt.connect(g); g.connect(master);
      s.start(t); s.stop(t + 2.5);
    }

    return {
      ensure: ensure, setMuted: setMuted, updateBed: updateBed,
      playDing: playDing, playCalmChime: playCalmChime, playSplash: playSplash, playThunder: playThunder
    };
  })();

  // =========================================================================
  // 2. MICROPHONE MEASUREMENT (STRICT PRIVACY: RMS ONLY, NEVER RECORDED)
  // =========================================================================
  function stopMic() {
    if (micStream) {
      micStream.getTracks().forEach(function (tr) { try { tr.stop(); } catch (e) {} });
      micStream = null;
    }
    if (micCtx) {
      try { micCtx.close(); } catch (e) {}
      micCtx = null;
    }
    micAnalyser = null;
    micBuf = null;
  }

  function startMic() {
    if (TEST_MODE) return Promise.resolve(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showMicError('No microphone found — Quiet Island needs a microphone');
      return Promise.resolve(false);
    }
    return navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    }).then(function (stream) {
      micStream = stream;
      var AC = window.AudioContext || window.webkitAudioContext;
      micCtx = new AC();
      var src = micCtx.createMediaStreamSource(stream);
      micAnalyser = micCtx.createAnalyser();
      micAnalyser.fftSize = 1024;
      src.connect(micAnalyser);
      micBuf = new Float32Array(micAnalyser.fftSize);
      clearMicError();
      return true;
    }).catch(function () {
      showMicError('No microphone found — Quiet Island needs a microphone');
      return false;
    });
  }

  function readRawDb() {
    if (TEST_MODE) {
      // Map 0..100 slider to baselineDb .. baselineDb + 38 dB
      return baselineDb + (testSliderVal / 100) * 38;
    }
    if (!micAnalyser || !micBuf) return baselineDb;
    micAnalyser.getFloatTimeDomainData(micBuf);
    var sum = 0;
    for (var i = 0; i < micBuf.length; i++) sum += micBuf[i] * micBuf[i];
    var rms = Math.sqrt(sum / micBuf.length);
    return rms > 1e-6 ? 20 * Math.log10(rms) : -90;
  }

  function getThresholds() {
    var preset = ACTIVITIES[activity] || ACTIVITIES.whisper;
    // sensitivity 0..1 -> +6 dB (gentle) to -6 dB (strict)
    var shift = (0.5 - sensitivity) * 12;
    return {
      uneasy: Math.max(3, preset.uneasyDb + shift),
      loud: Math.max(8, preset.loudDb + shift),
      storm: preset.storm
    };
  }

  function setState(next) {
    if (curState === next) return;
    var prev = curState;
    curState = next;
    stateTimer = 0;

    if (next !== 'uneasy' && qMarks.length) {
      qMarks.forEach(function (q) { HOST.scene.remove(q.sp); q.mat.dispose(); });
      qMarks.length = 0;
    }

    if (next === 'returning') {
      returnElapsed = 0;
      returnedFlags = {};
      islandReturnSparkled = false;
      sunbeamAge = 0;
    } else if (next === 'loud') {
      lightningTimer = 3.5 + Math.random() * 2.5;
      lightningStreak = 0;
      calmSeconds = 0;
      // Trigger splash/dust FX on dive
      spawnSplashAt(HOST.homes[1].mon.x, HOST.homes[1].mon.z);
      spawnDustAt(HOST.homes[3].mon.x, HOST.homes[3].mon.y + 0.5, HOST.homes[3].mon.z);
      if (crab) spawnDustAt(crab.base.x, crab.base.y + 0.2, crab.base.z);
      SFX.playSplash();
    } else if (next === 'uneasy') {
      calmSeconds = 0;
      triggerQuestionMarks();
    } else if (next === 'calm') {
      if (prev === 'returning') {
        SFX.playCalmChime();
      }
    }

    updateUIState();
    window.dispatchEvent(new CustomEvent('quiet:state', { detail: { state: curState } }));
  }

  function updateNoiseAndState(dt) {
    if (!isOn) {
      smoothLevel = lerp(smoothLevel, 0, clamp(dt * 2, 0, 1));
      return;
    }

    var rawDb = readRawDb();

    // Calibration (5 seconds)
    if (isCalibrating) {
      calSamples.push(rawDb);
      var pct = clamp((performance.now() - calStart) / 5000, 0, 1);
      if (domCalFill) domCalFill.style.width = Math.round(pct * 100) + '%';
      if (pct >= 1) {
        isCalibrating = false;
        if (calSamples.length) {
          calSamples.sort(function (a, b) { return a - b; });
          baselineDb = calSamples[Math.floor(calSamples.length * 0.5)];
        }
        if (domCalBar) domCalBar.classList.remove('on');
        if (domCalBtn) domCalBtn.textContent = '🎚️ Room quiet level saved!';
        setTimeout(function () {
          if (domCalBtn) domCalBtn.textContent = '🎚️ Calibrate quiet room (5s)';
        }, 2200);
      }
      return;
    }

    var relDb = Math.max(0, rawDb - baselineDb);
    var th = getThresholds();
    var targetNorm = th.storm ? clamp(relDb / Math.max(1, th.loud * 1.15), 0, 1) : clamp(relDb / 40, 0, 0.35);

    // Asymmetric smoothing: rises over ~0.4s, falls over ~1.5s
    var tau = targetNorm > smoothLevel ? 0.18 : 0.65;
    smoothLevel += (targetNorm - smoothLevel) * (1 - Math.exp(-dt / tau));

    // Free play never storms
    if (!th.storm && !testForced) {
      if (curState !== 'calm') setState('calm');
      trackCalmMinute(dt);
      return;
    }

    if (testForced) {
      if (curState === 'returning') advanceReturning(dt);
      else if (curState === 'calm') trackCalmMinute(dt);
      return;
    }

    // State machine with hysteresis & min durations
    var aboveUneasy = relDb >= th.uneasy;
    var aboveLoud = relDb >= th.loud;
    var belowQuiet = relDb < Math.max(2, th.uneasy - 2.5);

    if (curState === 'calm') {
      trackCalmMinute(dt);
      if (aboveUneasy) {
        stateTimer += dt;
        if (stateTimer >= 1.5) setState('uneasy');
      } else {
        stateTimer = Math.max(0, stateTimer - dt * 1.5);
      }
    } else if (curState === 'uneasy') {
      if (aboveLoud) {
        stateTimer += dt;
        if (stateTimer >= 2.5) setState('loud');
      } else if (belowQuiet) {
        stateTimer -= dt;
        if (stateTimer <= -2.0) setState('calm');
      } else {
        stateTimer = lerp(stateTimer, 0, dt);
      }
    } else if (curState === 'loud') {
      if (belowQuiet) {
        stateTimer += dt;
        if (stateTimer >= 3.0) setState('returning');
      } else {
        stateTimer = Math.max(0, stateTimer - dt * 2);
      }
    } else if (curState === 'returning') {
      if (aboveLoud) {
        stateTimer += dt;
        if (stateTimer >= 2.0) setState('loud');
      } else {
        stateTimer = 0;
        advanceReturning(dt);
      }
    }
  }

  function advanceReturning(dt) {
    returnElapsed += dt;
    RETURN_ORDER.forEach(function (step, idx) {
      if (!returnedFlags[step.key] && returnElapsed >= step.at) {
        returnedFlags[step.key] = true;
        SFX.playDing(idx);
      }
    });
    if (!islandReturnSparkled && returnElapsed >= 11.4) {
      islandReturnSparkled = true;
      spawnIslandSparkles();
    }
    if (returnElapsed >= 12.2) {
      testForced = false;
      setState('calm');
    }
  }

  function trackCalmMinute(dt) {
    calmSeconds += dt;
    if (calmSeconds >= 60) {
      calmSeconds -= 60;
      triggerCalmMinuteReward();
    }
  }

  function triggerCalmMinuteReward() {
    SFX.playCalmChime();
    spawnBridgeSparkles();
    var toast = document.createElement('div');
    toast.className = 'qi-calm-toast';
    toast.textContent = '✨ +1 calm minute';
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3400);
    window.dispatchEvent(new CustomEvent('quiet:calm-minute'));
  }

  // =========================================================================
  // 3. 3D VISUALS: LIGHTHOUSE BEACON, WEATHER, RAIN, SUNBEAMS & CREATURES
  // =========================================================================
  function makeCanvasTex(w, h, drawFn) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    drawFn(cv.getContext('2d'), w, h);
    var tex = new HOST.T3.CanvasTexture(cv);
    tex.colorSpace = HOST.T3.SRGBColorSpace;
    return tex;
  }

  function buildLighthouseBeacon() {
    var T3 = HOST.T3, lh = HOST.extrasByModel.lighthouse;
    if (!lh || !lh.group) return;
    var box = new T3.Box3().setFromObject(lh.group);
    var topY = box.max.y - lh.group.position.y;
    var pivot = new T3.Group();
    pivot.position.set(0, Math.max(6.2, topY - 0.35), 0);

    beaconMat = new T3.MeshBasicMaterial({ color: 0xffb320 });
    beaconOrb = new T3.Mesh(new T3.SphereGeometry(0.72, 16, 12), beaconMat);
    pivot.add(beaconOrb);

    // Soft rotating beam cone
    var coneGeo = new T3.ConeGeometry(2.6, 11, 16, 1, true);
    coneGeo.translate(0, -5.5, 0);
    coneGeo.rotateZ(Math.PI * 0.5);
    beaconConeMat = new T3.MeshBasicMaterial({
      color: 0xffb320, transparent: true, opacity: 0.24,
      side: T3.DoubleSide, depthWrite: false, blending: T3.AdditiveBlending
    });
    beaconCone = new T3.Mesh(coneGeo, beaconConeMat);
    pivot.add(beaconCone);

    beaconLight = new T3.PointLight(0xffb320, 0, 22);
    pivot.add(beaconLight);
    lh.group.add(pivot);
    updateBeaconColor(0);
  }

  function updateBeaconColor(t) {
    if (!beaconMat || !beaconConeMat) return;
    if (!isOn) {
      beaconMat.color.setHex(0xfff3c4);
      beaconConeMat.opacity = 0.05;
      if (beaconLight) beaconLight.intensity = 0;
      return;
    }
    var col = new HOST.T3.Color(ACTIVITIES[activity].hex);
    if (activity === 'free') {
      col.setHSL((t * 0.16) % 1, 0.85, 0.62);
    }
    beaconMat.color.copy(col);
    beaconConeMat.color.copy(col);
    beaconConeMat.opacity = 0.26 + Math.sin(t * 3) * 0.05;
    if (beaconLight) {
      beaconLight.color.copy(col);
      beaconLight.intensity = 2.4;
    }
    if (beaconCone) beaconCone.rotation.y = t * 0.9;
  }

  function buildStormClouds() {
    var T3 = HOST.T3, scene = HOST.scene;
    var cloudTex = makeCanvasTex(256, 128, function (g, w, h) {
      var puffs2 = [
        [68, 76, 46], [112, 60, 54], [158, 68, 48], [192, 82, 36], [96, 86, 42], [148, 86, 44]
      ];
      puffs2.forEach(function (p) {
        var gr = g.createRadialGradient(p[0], p[1] - 10, 6, p[0], p[1], p[2]);
        gr.addColorStop(0, 'rgba(130, 148, 175, 0.92)');
        gr.addColorStop(0.65, 'rgba(84, 100, 126, 0.88)');
        gr.addColorStop(1, 'rgba(62, 76, 98, 0)');
        g.fillStyle = gr;
        g.beginPath(); g.arc(p[0], p[1], p[2], 0, Math.PI * 2); g.fill();
      });
    });

    var specs = [
      { homeX: -24, homeZ: -18, outX: -92, y: 18, sx: 46, sy: 22 },
      { homeX:  18, homeZ: -15, outX:  90, y: 20, sx: 50, sy: 24 },
      { homeX:  -6, homeZ:   8, outX: -88, y: 17, sx: 48, sy: 22 },
      { homeX:  24, homeZ:  12, outX:  94, y: 19, sx: 44, sy: 20 }
    ];
    specs.forEach(function (s, i) {
      var sm = new T3.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0, depthWrite: false });
      var sp = new T3.Sprite(sm);
      sp.scale.set(s.sx, s.sy, 1);
      sp.position.set(s.outX, s.y, s.homeZ);
      scene.add(sp);
      cloudSprites.push({ sp: sp, mat: sm, s: s, ph: i * 1.7 });
    });
  }

  function buildRain() {
    var T3 = HOST.T3, scene = HOST.scene;
    var count = 1500;
    var pos = new Float32Array(count * 2 * 3);
    rainVel = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      var rx = (Math.random() - 0.5) * 125;
      var ry = Math.random() * 44;
      var rz = (Math.random() - 0.5) * 115;
      var idx = i * 6;
      pos[idx] = rx; pos[idx + 1] = ry; pos[idx + 2] = rz;
      pos[idx + 3] = rx - 0.55; pos[idx + 4] = ry - 2.3; pos[idx + 5] = rz + 0.25;
      rainVel[i] = 36 + Math.random() * 14;
    }
    var geo = new T3.BufferGeometry();
    geo.setAttribute('position', new T3.BufferAttribute(pos, 3));
    var mat = new T3.LineBasicMaterial({ color: 0xd4ecff, transparent: true, opacity: 0, depthWrite: false });
    rainLines = new T3.LineSegments(geo, mat);
    rainLines.visible = false;
    scene.add(rainLines);
  }

  function buildSunbeams() {
    var T3 = HOST.T3, scene = HOST.scene;
    var tex = makeCanvasTex(128, 256, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, 'rgba(255, 240, 175, 0)');
      gr.addColorStop(0.25, 'rgba(255, 236, 155, 0.34)');
      gr.addColorStop(0.75, 'rgba(255, 244, 195, 0.16)');
      gr.addColorStop(1, 'rgba(255, 244, 195, 0)');
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(w * 0.36, 0); g.lineTo(w * 0.64, 0);
      g.lineTo(w * 0.96, h); g.lineTo(w * 0.04, h);
      g.closePath(); g.fill();
    });
    var positions = [[-16, 15, -10], [-2, 16, -4], [12, 15, -8], [4, 15, 12], [-18, 14, 10]];
    positions.forEach(function (p, i) {
      var m = new T3.MeshBasicMaterial({
        map: tex, transparent: true, opacity: 0, depthWrite: false,
        side: T3.DoubleSide, blending: T3.AdditiveBlending
      });
      var mesh = new T3.Mesh(new T3.PlaneGeometry(14, 42), m);
      mesh.position.set(p[0], p[1], p[2]);
      mesh.rotation.z = -0.34;
      mesh.rotation.y = 0.25 + i * 0.18;
      mesh.visible = false;
      scene.add(mesh);
      sunbeamMeshes.push({ mesh: mesh, mat: m, baseRotY: mesh.rotation.y, ph: i * 1.1 });
    });
  }

  // Particle FX helpers (splash rings, dust puffs, golden sparkles, "?" pop sprites)
  function spawnSplashAt(x, z) {
    var T3 = HOST.T3;
    var geo = new T3.RingGeometry(0.45, 0.85, 20);
    geo.rotateX(-Math.PI * 0.5);
    var mat = new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false });
    var mesh = new T3.Mesh(geo, mat);
    mesh.position.set(x, -1.25, z);
    HOST.scene.add(mesh);
    ripples.push({ mesh: mesh, mat: mat, age: 0, life: 0.9 });
  }

  function spawnDustAt(x, y, z) {
    var T3 = HOST.T3;
    for (var i = 0; i < 6; i++) {
      var mat = new T3.MeshBasicMaterial({ color: 0xffecc7, transparent: true, opacity: 0.85 });
      var m = new T3.Mesh(new T3.SphereGeometry(0.32, 7, 6), mat);
      m.position.set(x + (Math.random() - 0.5) * 0.8, y + 0.2, z + (Math.random() - 0.5) * 0.8);
      HOST.scene.add(m);
      puffs.push({
        mesh: m, mat: mat, age: 0, life: 0.65,
        vx: (Math.random() - 0.5) * 2.2, vy: 1.6 + Math.random() * 1.4, vz: (Math.random() - 0.5) * 2.2
      });
    }
  }

  function spawnSparkleBurst(cx, cy, cz, count, spread) {
    var T3 = HOST.T3;
    var cols = [0xffd84a, 0xff5fa2, 0x4f9dff, 0x2fc58a, 0xffffff];
    for (var i = 0; i < count; i++) {
      var mat = new T3.MeshBasicMaterial({ color: cols[i % cols.length], transparent: true, opacity: 1 });
      var m = new T3.Mesh(new T3.OctahedronGeometry(0.38, 0), mat);
      m.position.set(cx + (Math.random() - 0.5) * spread, cy + Math.random() * 2, cz + (Math.random() - 0.5) * spread);
      HOST.scene.add(m);
      sparkles.push({
        mesh: m, mat: mat, age: 0, life: 1.5 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 3.5, vy: 3.5 + Math.random() * 4.5, vz: (Math.random() - 0.5) * 3.5
      });
    }
  }

  function spawnBridgeSparkles() {
    var mx = (HOST.DOCK.x + HOST.TI.x) * 0.5;
    var mz = (HOST.DOCK.z + HOST.TI.z) * 0.5;
    spawnSparkleBurst(mx, 1.5, mz, 24, 10);
  }

  function spawnIslandSparkles() {
    spawnSparkleBurst(0, 5, 0, 34, 42);
  }

  var qMarkTex = null;
  function triggerQuestionMarks() {
    var T3 = HOST.T3;
    if (!qMarkTex) {
      qMarkTex = makeCanvasTex(96, 96, function (g, w, h) {
        g.fillStyle = '#fffdf8';
        g.strokeStyle = '#ffb320';
        g.lineWidth = 8;
        g.beginPath(); g.arc(w / 2, h / 2, 38, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = '#2b1d40';
        g.font = '900 54px Nunito, Trebuchet MS, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('?', w / 2, h / 2 + 3);
      });
    }
    HOST.mons.forEach(function (m) {
      if (!m || !m.root) return;
      var sm = new T3.SpriteMaterial({ map: qMarkTex, transparent: true, opacity: 1, depthWrite: false });
      var sp = new T3.Sprite(sm);
      sp.scale.set(2.2, 2.2, 1);
      sp.position.set(m.root.position.x, m.root.position.y + 5.2, m.root.position.z);
      HOST.scene.add(sp);
      qMarks.push({ sp: sp, mat: sm, age: 0, life: 1.8, baseY: sp.position.y });
    });
  }

  // =========================================================================
  // 4. LIVING CREATURES (BIRDS, BUTTERFLIES, CRAB, FROG, FISH + EXISTING CAST)
  // =========================================================================
  function buildLivingCreatures() {
    var T3 = HOST.T3, scene = HOST.scene;

    // Save origins of existing monsters & balloon
    HOST.mons.forEach(function (m, i) {
      var h = HOST.homes[i];
      if (!m || !h) return;
      monOrigin[i] = {
        pos: h.mon.clone(),
        face: h.face,
        scale: m.root.scale.clone(),
        hidePos: h.mon.clone()
      };
      // Custom hide spots matching QUIET-ISLAND-PLAN.md §3
      if (i === 0) { // Owl ducks into nest
        monOrigin[i].hidePos.y -= 1.8;
      } else if (i === 1) { // Axolotl dives into pond
        monOrigin[i].hidePos.y -= 2.4;
      } else if (i === 2) { // Sheep hides behind windmill
        monOrigin[i].hidePos.x -= 4.2;
        monOrigin[i].hidePos.z -= 3.6;
      } else if (i === 3) { // Bunny dives into burrow
        monOrigin[i].hidePos.y -= 2.3;
      }
    });

    if (HOST.extrasByModel['hot-air-balloon']) {
      var bg = HOST.extrasByModel['hot-air-balloon'];
      balloonOrigin = { group: bg.group, y0: bg.y0, ry: bg.spec.ry || 0 };
    }

    var castle = HOST.places.filter(function (p) { return p.id === 'today'; })[0];
    if (castle) castleDoor = { x: castle.x, z: castle.z + 4.5 };

    // A. Flock of 10 flapping seagulls/birds
    var birdMat = new T3.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
    var beakMat = new T3.MeshStandardMaterial({ color: 0xffb320, roughness: 0.5 });
    var wingGeo = new T3.BoxGeometry(0.95, 0.08, 0.36);
    wingGeo.translate(0.45, 0, 0);
    for (var bi = 0; bi < 10; bi++) {
      var bg2 = new T3.Group();
      var body = new T3.Mesh(new T3.SphereGeometry(0.32, 8, 6), birdMat);
      body.scale.set(0.8, 0.75, 1.5);
      var beak = new T3.Mesh(new T3.ConeGeometry(0.11, 0.35, 6), beakMat);
      beak.rotation.x = Math.PI * 0.5; beak.position.set(0, 0, 0.58);
      var lw = new T3.Mesh(wingGeo, birdMat);
      var rw = new T3.Mesh(wingGeo, birdMat); rw.scale.x = -1;
      bg2.add(body, beak, lw, rw);
      scene.add(bg2);
      birds.push({
        g: bg2, lw: lw, rw: rw,
        angle: (bi / 10) * Math.PI * 2,
        rad: 14 + (bi % 4) * 5.5,
        y: 12.5 + (bi % 3) * 3.2,
        spd: 0.28 + (bi % 3) * 0.07,
        ph: bi * 0.9
      });
    }

    // B. 8 Butterflies over Florasprout's flower garden (homes[3])
    var fh = HOST.homes[3] ? HOST.homes[3].spec : { x: 15.2, z: -14 };
    var bCols = [0xff5fa2, 0xffd84a, 0x4f9dff, 0x2fc58a, 0xff8c42, 0xc37bff];
    var bWingGeo = new T3.PlaneGeometry(0.55, 0.48);
    bWingGeo.translate(0.28, 0, 0);
    for (var fi = 0; fi < 8; fi++) {
      var bfg = new T3.Group();
      var bm = new T3.MeshBasicMaterial({ color: bCols[fi % bCols.length], side: T3.DoubleSide });
      var bl = new T3.Mesh(bWingGeo, bm);
      var br = new T3.Mesh(bWingGeo, bm); br.scale.x = -1;
      bfg.add(bl, br);
      scene.add(bfg);
      var bx = fh.x + (Math.random() - 0.5) * 10;
      var bz = fh.z + (Math.random() - 0.5) * 10;
      var by = (HOST.groundAt(bx, bz) || 1.2) + 1.5 + Math.random() * 1.4;
      butterflies.push({ g: bfg, lw: bl, rw: br, cx: bx, cy: by, cz: bz, ph: fi * 1.3, rad: 1.5 + Math.random() * 1.8 });
    }

    // C. Beach Crab near harbour sand
    var crabX = HOST.DOCK.x - 4.5, crabZ = HOST.DOCK.z - 2.2;
    var crabY = HOST.groundAt(crabX, crabZ);
    if (crabY === null) crabY = 0.2;
    var cg = new T3.Group();
    var cRed = new T3.MeshStandardMaterial({ color: 0xff5a36, roughness: 0.45 });
    var cWhite = new T3.MeshBasicMaterial({ color: 0xffffff });
    var cBlack = new T3.MeshBasicMaterial({ color: 0x2b1d40 });
    var cShell = new T3.Mesh(new T3.SphereGeometry(0.65, 10, 8), cRed);
    cShell.scale.set(1.25, 0.58, 0.92); cShell.position.y = 0.35;
    cg.add(cShell);
    [-0.3, 0.3].forEach(function (ex) {
      var eye = new T3.Mesh(new T3.SphereGeometry(0.14, 7, 6), cWhite);
      eye.position.set(ex, 0.72, 0.42);
      var pup = new T3.Mesh(new T3.SphereGeometry(0.07, 6, 5), cBlack);
      pup.position.set(ex, 0.74, 0.53);
      var claw = new T3.Mesh(new T3.SphereGeometry(0.24, 7, 6), cRed);
      claw.scale.set(0.9, 0.7, 1.3);
      claw.position.set(ex * 2.5, 0.44, 0.56);
      cg.add(eye, pup, claw);
    });
    cg.position.set(crabX, crabY, crabZ);
    scene.add(cg);
    crab = { g: cg, base: new T3.Vector3(crabX, crabY, crabZ) };

    // D. Pond Frog on lily pad near Aquafind's pond (homes[1])
    var ph2 = HOST.homes[1] ? HOST.homes[1].mon : new T3.Vector3(32, 0.4, 21);
    var fx = ph2.x - 2.6, fz = ph2.z + 2.2;
    var fy = (HOST.groundAt(fx, fz) || 0.2);
    var fg2 = new T3.Group();
    var fGreen = new T3.MeshStandardMaterial({ color: 0x2fc58a, roughness: 0.45 });
    var lily = new T3.Mesh(new T3.CylinderGeometry(0.95, 0.95, 0.08, 12), new T3.MeshStandardMaterial({ color: 0x1e9666, roughness: 0.6 }));
    lily.position.set(fx, fy + 0.05, fz);
    scene.add(lily);
    var fBody = new T3.Mesh(new T3.SphereGeometry(0.42, 9, 7), fGreen);
    fBody.scale.set(1.1, 0.75, 1.2); fBody.position.y = 0.32;
    fg2.add(fBody);
    [-0.18, 0.18].forEach(function (ex) {
      var eye = new T3.Mesh(new T3.SphereGeometry(0.13, 7, 6), cWhite);
      eye.position.set(ex, 0.62, 0.22);
      var pup = new T3.Mesh(new T3.SphereGeometry(0.06, 6, 5), cBlack);
      pup.position.set(ex, 0.64, 0.33);
      fg2.add(eye, pup);
    });
    fg2.position.set(fx, fy + 0.08, fz);
    scene.add(fg2);
    frog = { g: fg2, base: new T3.Vector3(fx, fy + 0.08, fz) };

    // E. 5 Jumping Sea Fish
    var fishMat = new T3.MeshStandardMaterial({ color: 0x7bd3ff, metalness: 0.25, roughness: 0.3 });
    for (var si = 0; si < 5; si++) {
      var fgrp = new T3.Group();
      var fb = new T3.Mesh(new T3.SphereGeometry(0.38, 8, 6), fishMat);
      fb.scale.set(0.55, 0.8, 1.8);
      var ft = new T3.Mesh(new T3.ConeGeometry(0.28, 0.45, 4), fishMat);
      ft.rotation.x = -Math.PI * 0.5; ft.position.z = -0.68;
      fgrp.add(fb, ft);
      fgrp.visible = false;
      scene.add(fgrp);
      var ang = 0.6 + si * 1.1;
      fishes.push({
        g: fgrp,
        x: Math.cos(ang) * 44,
        z: Math.sin(ang) * 38,
        timer: 1.5 + si * 1.7,
        jumping: false,
        jumpT: 0
      });
    }
  }

  // Helper: is a creature key currently hidden or returning?
  function creaturePresence(key) {
    if (!isOn || curState === 'calm' || curState === 'uneasy') return 1;
    if (curState === 'loud') return 0;
    // returning
    var step = RETURN_ORDER.filter(function (s) { return s.key === key; })[0];
    if (!step) return 1;
    var localT = returnElapsed - step.at;
    if (localT <= 0) return 0;
    return clamp(localT / 1.35, 0, 1);
  }

  function updateCreatures(dt, t) {
    var activeOverride = isOn && curState !== 'calm';
    HOST.quietHooks.overrideMons = activeOverride;
    HOST.quietHooks.overrideKids = activeOverride;
    HOST.quietHooks.overrideBalloon = activeOverride;

    // 1. Existing 4 Monsters (with cartoon squash & stretch, peeks, hides)
    var monKeys = ['owl', 'axolotl', 'sheep', 'bunny'];
    HOST.mons.forEach(function (m, i) {
      var o = monOrigin[i];
      if (!m || !o) return;
      var key = monKeys[i];
      var p = creaturePresence(key);

      if (!isOn || curState === 'calm') {
        m.root.position.lerp(o.pos, clamp(dt * 5, 0, 1));
        m.root.scale.lerp(o.scale, clamp(dt * 6, 0, 1));
        m.root.visible = true;
      } else if (curState === 'uneasy') {
        // Anticipation crouch + look side-to-side
        var look = Math.sin(t * 4.5 + i) * 0.55;
        m.root.position.lerp(o.pos, clamp(dt * 6, 0, 1));
        m.root.rotation.y = o.face + look;
        var sq = 1 - Math.abs(Math.sin(t * 4 + i)) * 0.08;
        m.root.scale.set(o.scale.x * (2 - sq), o.scale.y * sq, o.scale.z * (2 - sq));
        m.root.visible = true;
      } else if (curState === 'loud') {
        // Duck / dive / hide behind shelter
        m.root.position.lerp(o.hidePos, clamp(dt * 4.2, 0, 1));
        var hideScale = i === 2 ? 0.82 : 0.35;
        m.root.scale.lerp(o.scale.clone().multiplyScalar(hideScale), clamp(dt * 4.5, 0, 1));
        m.root.visible = m.root.position.distanceTo(o.hidePos) > 0.22 || i === 2;
      } else if (curState === 'returning') {
        if (p <= 0) {
          m.root.position.lerp(o.hidePos, clamp(dt * 6, 0, 1));
          m.root.visible = i === 2;
        } else if (p < 0.45) {
          // Peek out & look left-right
          m.root.visible = true;
          var peekPos = o.hidePos.clone().lerp(o.pos, 0.55);
          m.root.position.lerp(peekPos, clamp(dt * 6, 0, 1));
          m.root.rotation.y = o.face + Math.sin(p * 24) * 0.65;
          m.root.scale.lerp(o.scale.clone().multiplyScalar(0.85), clamp(dt * 6, 0, 1));
        } else {
          // Hop out with cartoon squash-and-stretch arc!
          m.root.visible = true;
          var hopT = (p - 0.45) / 0.55;
          var arcY = Math.sin(hopT * Math.PI) * 1.45;
          m.root.position.copy(o.hidePos).lerp(o.pos, easeOutBack(clamp(hopT, 0, 1)));
          m.root.position.y += arcY;
          m.root.rotation.y = lerp(m.root.rotation.y, o.face, clamp(dt * 8, 0, 1));
          var stretch = 1 + Math.sin(hopT * Math.PI) * 0.22;
          m.root.scale.set(o.scale.x / Math.sqrt(stretch), o.scale.y * stretch, o.scale.z / Math.sqrt(stretch));
        }
      }
    });

    // 2. Existing 4 Kids
    if (activeOverride) {
      var kp = creaturePresence('kids');
      HOST.kidStates.forEach(function (ks, i) {
        var kr = ks.k.root;
        if (curState === 'uneasy') {
          // Pause on road and look up nervously
          kr.rotation.y += Math.sin(t * 3 + i) * dt * 1.5;
          kr.visible = true;
        } else if (curState === 'loud') {
          // Run into Castle door
          var dx = castleDoor.x - kr.position.x, dz = castleDoor.z - kr.position.z;
          var dist = Math.hypot(dx, dz);
          if (dist > 1.2) {
            var sp = Math.min(dist, 9.5 * dt);
            kr.position.x += (dx / dist) * sp;
            kr.position.z += (dz / dist) * sp;
            var gy = HOST.groundAt(kr.position.x, kr.position.z);
            if (gy !== null) kr.position.y = gy + 0.08 + Math.abs(Math.sin(t * 14 + i)) * 0.25;
            kr.rotation.y = Math.atan2(dx, dz);
            kr.visible = true;
          } else {
            kr.visible = false;
          }
        } else if (curState === 'returning') {
          if (kp <= 0) {
            kr.visible = false;
          } else {
            kr.visible = true;
            var targetPt = ks.road.getPointAt(ks.u);
            kr.position.lerp(new HOST.T3.Vector3(targetPt.x + ks.off, targetPt.y + 0.08, targetPt.z), clamp(dt * 3.5, 0, 1));
            kr.rotation.y = Math.atan2(targetPt.x - kr.position.x, targetPt.z - kr.position.z);
          }
        }
      });
    } else {
      HOST.kidStates.forEach(function (ks) { ks.k.root.visible = true; });
    }

    // 3. Hot-Air Balloon
    if (balloonOrigin && activeOverride) {
      var bp = creaturePresence('kids');
      var targetY = curState === 'loud' ? balloonOrigin.y0 - 9.5 :
                    curState === 'uneasy' ? balloonOrigin.y0 - 1.2 + Math.sin(t * 3.5) * 0.6 :
                    lerp(balloonOrigin.y0 - 9.5, balloonOrigin.y0, bp);
      balloonOrigin.group.position.y = lerp(balloonOrigin.group.position.y, targetY, clamp(dt * 2.2, 0, 1));
      balloonOrigin.group.rotation.y = balloonOrigin.ry + Math.sin(t * 0.7) * 0.25;
    }

    // 4. Flock of 10 Birds
    var birdP = creaturePresence('birds');
    birds.forEach(function (b, i) {
      var flapSpd = curState === 'uneasy' ? 14 : curState === 'loud' ? 18 : 9;
      var flap = Math.sin(t * flapSpd + b.ph) * 0.7;
      b.lw.rotation.z = flap;
      b.rw.rotation.z = -flap;
      b.angle += b.spd * (curState === 'uneasy' ? 1.55 : 1) * dt;
      var rad = curState === 'loud' ? 92 : curState === 'uneasy' ? b.rad * 0.78 : lerp(92, b.rad, birdP);
      var ty = curState === 'loud' ? 28 : curState === 'uneasy' ? b.y + 5 : lerp(28, b.y, birdP);
      var tx = Math.cos(b.angle) * rad;
      var tz = Math.sin(b.angle) * rad * 0.85;
      b.g.position.x = lerp(b.g.position.x, tx, clamp(dt * 2.5, 0, 1));
      b.g.position.y = lerp(b.g.position.y, ty + Math.sin(t * 2 + b.ph) * 0.6, clamp(dt * 2.5, 0, 1));
      b.g.position.z = lerp(b.g.position.z, tz, clamp(dt * 2.5, 0, 1));
      b.g.rotation.y = -b.angle;
      b.g.visible = rad < 84;
    });

    // 5. 8 Butterflies
    var bfP = creaturePresence('butterflies');
    butterflies.forEach(function (bf) {
      var flap = Math.sin(t * 18 + bf.ph) * 0.95;
      bf.lw.rotation.y = flap;
      bf.rw.rotation.y = -flap;
      var show = curState === 'loud' ? 0 : (curState === 'returning' ? bfP : 1);
      bf.g.visible = show > 0.05;
      var a = t * 1.1 + bf.ph;
      bf.g.position.set(
        bf.cx + Math.cos(a) * bf.rad,
        lerp(bf.cy - 1.4, bf.cy + Math.sin(t * 3.5 + bf.ph) * 0.45, show),
        bf.cz + Math.sin(a * 1.3) * bf.rad
      );
      bf.g.rotation.y = -a;
      bf.g.scale.setScalar(0.3 + show * 0.7);
    });

    // 6. Beach Crab
    if (crab) {
      var cp = creaturePresence('crab');
      var scuttle = (curState === 'calm' || (curState === 'returning' && cp > 0.5)) ? Math.sin(t * 1.4) * 2.4 : 0;
      var targetY2 = curState === 'loud' ? crab.base.y - 0.85 : lerp(crab.base.y - 0.85, crab.base.y, cp);
      crab.g.position.x = lerp(crab.g.position.x, crab.base.x + scuttle, clamp(dt * 4, 0, 1));
      crab.g.position.y = lerp(crab.g.position.y, targetY2, clamp(dt * 5, 0, 1));
      crab.g.rotation.z = Math.sin(t * 9) * 0.08 * (curState === 'calm' ? 1 : 0);
      crab.g.visible = crab.g.position.y > crab.base.y - 0.72;
    }

    // 7. Pond Frog
    if (frog) {
      var fp = creaturePresence('axolotl');
      var hop = (curState === 'calm') ? Math.max(0, Math.sin(t * 2.2)) * 0.45 : 0;
      var fyT = curState === 'loud' ? frog.base.y - 1.2 : lerp(frog.base.y - 1.2, frog.base.y + hop, fp);
      frog.g.position.y = lerp(frog.g.position.y, fyT, clamp(dt * 6, 0, 1));
      frog.g.visible = frog.g.position.y > frog.base.y - 0.9;
    }

    // 8. 5 Jumping Sea Fish
    var allowFish = !isOn || curState === 'calm' || (curState === 'returning' && birdP > 0.6);
    fishes.forEach(function (f) {
      if (f.jumping) {
        f.jumpT += dt * 1.15;
        if (f.jumpT >= 1) {
          f.jumping = false;
          f.g.visible = false;
          f.timer = 3 + Math.random() * 5;
          spawnSplashAt(f.x + 2.4, f.z);
        } else {
          f.g.visible = true;
          var arc = Math.sin(f.jumpT * Math.PI);
          f.g.position.set(f.x + f.jumpT * 2.4, -1.6 + arc * 3.1, f.z);
          f.g.rotation.x = (0.5 - f.jumpT) * 1.6;
          f.g.rotation.y = Math.PI * 0.5;
        }
      } else if (allowFish) {
        f.timer -= dt;
        if (f.timer <= 0) {
          f.jumping = true;
          f.jumpT = 0;
          spawnSplashAt(f.x, f.z);
        }
      }
    });
  }

  // =========================================================================
  // 5. WEATHER, BREATHING SEA, LIGHTNING & PARTICLE LOOP
  // =========================================================================
  var COL_SKY_CALM = null, COL_SKY_UNEASY = null, COL_SKY_LOUD = null, COL_SKY_RET = null;
  var COL_SUN_CALM = null, COL_SUN_LOUD = null, COL_SUN_RET = null;

  function updateWeatherAndFX(dt, t) {
    var T3 = HOST.T3, scene = HOST.scene;
    if (!COL_SKY_CALM) {
      COL_SKY_CALM = new T3.Color(0x78c4ff);
      COL_SKY_UNEASY = new T3.Color(0x6d99c0);
      COL_SKY_LOUD = new T3.Color(0x415875);
      COL_SKY_RET = new T3.Color(0x8fd0ff);
      COL_SUN_CALM = new T3.Color(0xfff4d6);
      COL_SUN_LOUD = new T3.Color(0x9bb2cc);
      COL_SUN_RET = new T3.Color(0xffe7a8);
    }

    var targetStorm = !isOn ? 0 :
      curState === 'calm' ? smoothLevel * 0.18 :
      curState === 'uneasy' ? 0.48 :
      curState === 'loud' ? 1.0 : 0.14;
    stormMix = lerp(stormMix, targetStorm, clamp(dt * 1.4, 0, 1));

    var targetRain = (isOn && curState === 'loud') ? 1 : 0;
    rainMix = lerp(rainMix, targetRain, clamp(dt * 1.8, 0, 1));

    // Sea shader + sea breathing height as living noise meter
    if (HOST.seaU && HOST.seaU.uStorm) {
      HOST.seaU.uStorm.value = stormMix;
    }
    if (HOST.seaMesh) {
      HOST.seaMesh.position.y = -1.6 + (isOn ? smoothLevel * 0.3 : 0);
    }

    // Sky, fog & lighting lerp
    var targetSky = !isOn || curState === 'calm' ? COL_SKY_CALM :
                    curState === 'uneasy' ? COL_SKY_UNEASY :
                    curState === 'loud' ? COL_SKY_LOUD : COL_SKY_RET;
    if (scene.background && scene.background.isColor) {
      scene.background.lerp(targetSky, clamp(dt * 1.5, 0, 1));
    }
    if (scene.fog) {
      scene.fog.color.lerp(targetSky, clamp(dt * 1.5, 0, 1));
    }

    // Soft lightning in loud state (every 6-10s, max 3 in a row, 25% opacity for 80ms)
    if (isOn && curState === 'loud' && lightningStreak < 3) {
      lightningTimer -= dt;
      if (lightningTimer <= 0) {
        lightningTimer = 6 + Math.random() * 4;
        lightningStreak++;
        lightningFlash = 1;
        if (domFlash) {
          domFlash.style.opacity = '0.25';
          setTimeout(function () { if (domFlash) domFlash.style.opacity = '0'; }, 80);
        }
        SFX.playThunder();
      }
    }
    lightningFlash = Math.max(0, lightningFlash - dt * 5);

    var targetSunInt = !isOn || curState === 'calm' ? 1.28 :
                       curState === 'uneasy' ? 0.88 :
                       curState === 'loud' ? 0.45 : 1.38;
    var targetHemiInt = !isOn || curState === 'calm' ? 0.95 :
                        curState === 'uneasy' ? 0.78 :
                        curState === 'loud' ? 0.56 : 1.05;
    if (HOST.sun) {
      HOST.sun.intensity = lerp(HOST.sun.intensity, targetSunInt, clamp(dt * 1.8, 0, 1)) + lightningFlash * 0.55;
      var sc = curState === 'loud' ? COL_SUN_LOUD : curState === 'returning' ? COL_SUN_RET : COL_SUN_CALM;
      HOST.sun.color.lerp(sc, clamp(dt * 1.5, 0, 1));
    }
    if (HOST.hemiLight) {
      HOST.hemiLight.intensity = lerp(HOST.hemiLight.intensity, targetHemiInt, clamp(dt * 1.8, 0, 1)) + lightningFlash * 0.35;
    }

    // Corner cloud canvas tint
    if (HOST.cloudCv) {
      var br = 1 - stormMix * 0.32;
      var sat = 1 - stormMix * 0.4;
      HOST.cloudCv.style.filter = stormMix > 0.04 ? ('brightness(' + br.toFixed(2) + ') saturate(' + sat.toFixed(2) + ')') : '';
    }

    // Overhead storm clouds roll in during uneasy/loud and part on returning
    var cloudIn = !isOn ? 0 : curState === 'loud' ? 1 : curState === 'uneasy' ? 0.52 : curState === 'returning' ? clamp(1 - returnElapsed / 3.5, 0, 0.5) : 0;
    cloudSprites.forEach(function (c) {
      var tx = lerp(c.s.outX, c.s.homeX + Math.sin(t * 0.25 + c.ph) * 4, cloudIn);
      c.sp.position.x = lerp(c.sp.position.x, tx, clamp(dt * 1.4, 0, 1));
      c.mat.opacity = lerp(c.mat.opacity, cloudIn * 0.88, clamp(dt * 1.6, 0, 1));
      c.sp.visible = c.mat.opacity > 0.02;
    });

    // Rain streaks
    if (rainLines) {
      rainLines.visible = rainMix > 0.03;
      rainLines.material.opacity = rainMix * 0.65;
      if (rainLines.visible) {
        var pos = rainLines.geometry.attributes.position.array;
        for (var i = 0; i < rainVel.length; i++) {
          var idx = i * 6;
          var dy = rainVel[i] * dt;
          var dx = -dy * 0.22;
          pos[idx] += dx; pos[idx + 1] -= dy;
          pos[idx + 3] += dx; pos[idx + 4] -= dy;
          if (pos[idx + 1] < -2) {
            var rx = (Math.random() - 0.5) * 125;
            var ry = 38 + Math.random() * 8;
            var rz = (Math.random() - 0.5) * 115;
            pos[idx] = rx; pos[idx + 1] = ry; pos[idx + 2] = rz;
            pos[idx + 3] = rx - 0.55; pos[idx + 4] = ry - 2.3; pos[idx + 5] = rz + 0.25;
          }
        }
        rainLines.geometry.attributes.position.needsUpdate = true;
        if (Math.random() < dt * 7) {
          spawnSplashAt((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 80);
        }
      }
    }

    // Returning sunbeams (fade in, then fade out over 5s)
    if (curState === 'returning') {
      sunbeamAge += dt;
      sunbeamMix = sunbeamAge < 0.8 ? (sunbeamAge / 0.8) : clamp(1 - (sunbeamAge - 0.8) / 4.6, 0, 1);
    } else {
      sunbeamMix = lerp(sunbeamMix, 0, clamp(dt * 3, 0, 1));
    }
    sunbeamMeshes.forEach(function (sb) {
      sb.mesh.visible = sunbeamMix > 0.01;
      sb.mat.opacity = sunbeamMix * 0.78;
      sb.mesh.rotation.y = sb.baseRotY + Math.sin(t * 0.4 + sb.ph) * 0.08;
    });

    // Update splash ripples
    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var r = ripples[ri];
      r.age += dt;
      var k = r.age / r.life;
      if (k >= 1) {
        scene.remove(r.mesh); r.mesh.geometry.dispose(); r.mat.dispose();
        ripples.splice(ri, 1);
      } else {
        r.mesh.scale.setScalar(1 + k * 2.6);
        r.mat.opacity = (1 - k) * 0.75;
      }
    }

    // Update dust puffs
    for (var pi = puffs.length - 1; pi >= 0; pi--) {
      var p = puffs[pi];
      p.age += dt;
      var pk = p.age / p.life;
      if (pk >= 1) {
        scene.remove(p.mesh); p.mesh.geometry.dispose(); p.mat.dispose();
        puffs.splice(pi, 1);
      } else {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.scale.setScalar(1 + pk * 1.4);
        p.mat.opacity = (1 - pk) * 0.8;
      }
    }

    // Update sparkles
    for (var spi = sparkles.length - 1; spi >= 0; spi--) {
      var sp = sparkles[spi];
      sp.age += dt;
      var sk = sp.age / sp.life;
      if (sk >= 1) {
        scene.remove(sp.mesh); sp.mesh.geometry.dispose(); sp.mat.dispose();
        sparkles.splice(spi, 1);
      } else {
        sp.mesh.position.x += sp.vx * dt;
        sp.mesh.position.y += sp.vy * dt;
        sp.mesh.position.z += sp.vz * dt;
        sp.vy -= 4.2 * dt;
        sp.mesh.rotation.y += dt * 5;
        sp.mat.opacity = 1 - sk;
      }
    }

    // Update "?" sprites
    for (var qi = qMarks.length - 1; qi >= 0; qi--) {
      var q = qMarks[qi];
      q.age += dt;
      var qk = q.age / q.life;
      if (qk >= 1) {
        scene.remove(q.sp); q.mat.dispose();
        qMarks.splice(qi, 1);
      } else {
        q.sp.position.y = q.baseY + Math.sin(qk * Math.PI) * 1.2;
        q.mat.opacity = qk < 0.7 ? 1 : (1 - (qk - 0.7) / 0.3);
      }
    }

    updateBeaconColor(t);
  }

  // =========================================================================
  // 6. TEACHER UI PANEL, TOP BUTTON & ?quiettest=1 TEST BAR
  // =========================================================================
  function showMicError(text) {
    if (!domMsg) return;
    domMsg.textContent = text;
    domMsg.classList.add('on');
  }
  function clearMicError() {
    if (!domMsg) return;
    domMsg.textContent = '';
    domMsg.classList.remove('on');
  }

  function updateUIState() {
    if (domTopBtn) {
      domTopBtn.classList.toggle('on', isOn && (curState === 'calm' || curState === 'returning'));
      domTopBtn.classList.toggle('uneasy', isOn && curState === 'uneasy');
      domTopBtn.classList.toggle('loud', isOn && curState === 'loud');
      domTopBtn.textContent = '🏮';
      domTopBtn.title = isOn ? 'Quiet Island: ON (tap to open)' : 'Quiet Island (or tap the Lighthouse)';
    }
    if (domPowerBtn) {
      domPowerBtn.classList.toggle('on', isOn);
      domPowerBtn.textContent = isOn ? '● Listening (Tap to turn OFF)' : '○ Off (Tap to turn ON)';
    }
    if (domStatePill) {
      domStatePill.className = 'qi-state-pill' + (isOn ? (' s-' + curState) : '');
      domStatePill.textContent = !isOn ? 'Off' : (curState === 'loud' ? 'Too loud' : curState);
    }
    if (domPanel) {
      domPanel.querySelectorAll('.qi-act').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-act') === activity);
      });
    }
  }

  function buildUI() {
    // Soft lightning overlay
    domFlash = document.createElement('div');
    domFlash.className = 'qi-flash';
    document.body.appendChild(domFlash);

    // Top bar button beside Sound / Fullscreen / Settings
    var topbtns = document.querySelector('.topbtns');
    if (topbtns) {
      domTopBtn = document.createElement('button');
      domTopBtn.type = 'button';
      domTopBtn.className = 'qi-top-btn';
      domTopBtn.textContent = '🏮';
      domTopBtn.title = 'Quiet Island (or tap the Lighthouse)';
      domTopBtn.onclick = function () { togglePanel(); };
      topbtns.insertBefore(domTopBtn, topbtns.firstChild);

      // Sync mute with existing sound button in .topbtns
      var soundBtn = topbtns.querySelectorAll('button')[1];
      if (soundBtn) {
        soundBtn.addEventListener('click', function () {
          setTimeout(function () {
            SFX.setMuted(soundBtn.textContent.indexOf('🔇') >= 0);
          }, 20);
        });
      }
    }

    // Teacher Panel
    domPanel = document.createElement('div');
    domPanel.className = 'qi-panel hidden';
    domPanel.innerHTML =
      '<div class="qi-head"><h3>🏮 Quiet Island</h3><button type="button" class="qi-close" aria-label="Close">✕</button></div>' +
      '<div class="qi-power-row">' +
        '<button type="button" class="qi-power-btn" id="qiPowerBtn">○ Off (Tap to turn ON)</button>' +
        '<span class="qi-state-pill" id="qiStatePill">Off</span>' +
      '</div>' +
      '<div class="qi-sec-lbl">Class Activity (Lighthouse Light)</div>' +
      '<div class="qi-acts">' +
        '<button type="button" class="qi-act" data-act="silent" style="--ac:#ff5fa2"><span class="qi-act-dot"></span>Silent work</button>' +
        '<button type="button" class="qi-act" data-act="whisper" style="--ac:#ffb320"><span class="qi-act-dot"></span>Whisper</button>' +
        '<button type="button" class="qi-act" data-act="talk" style="--ac:#2fc58a"><span class="qi-act-dot"></span>Group talk</button>' +
        '<button type="button" class="qi-act" data-act="free" style="--ac:#9b7bff"><span class="qi-act-dot"></span>Free play</button>' +
      '</div>' +
      '<button type="button" class="qi-cal-btn" id="qiCalBtn">🎚️ Calibrate quiet room (5s)</button>' +
      '<div class="qi-cal-bar" id="qiCalBar"><div class="qi-cal-fill" id="qiCalFill"></div></div>' +
      '<div class="qi-sec-lbl">Sensitivity</div>' +
      '<div class="qi-sens-row"><span>More gentle</span><input type="range" id="qiSens" min="0" max="100" value="50"><span>More strict</span></div>' +
      '<div class="qi-msg" id="qiMsg"></div>' +
      '<div class="qi-privacy">🔒 Measures loudness only — never records, saves, or sends audio.</div>';
    document.body.appendChild(domPanel);

    domPowerBtn = domPanel.querySelector('#qiPowerBtn');
    domStatePill = domPanel.querySelector('#qiStatePill');
    domCalBtn = domPanel.querySelector('#qiCalBtn');
    domCalBar = domPanel.querySelector('#qiCalBar');
    domCalFill = domPanel.querySelector('#qiCalFill');
    domMsg = domPanel.querySelector('#qiMsg');

    domPanel.querySelector('.qi-close').onclick = closePanel;
    domPowerBtn.onclick = function () { if (isOn) turnOff(); else turnOn(); };
    domPanel.querySelectorAll('.qi-act').forEach(function (b) {
      b.onclick = function () { setActivity(b.getAttribute('data-act')); };
    });
    domCalBtn.onclick = function () { startCalibration(); };
    domPanel.querySelector('#qiSens').oninput = function (e) {
      sensitivity = clamp(Number(e.target.value) / 100, 0, 1);
    };

    // ?quiettest=1 Test Bar (replaces microphone)
    if (TEST_MODE) {
      var tb = document.createElement('div');
      tb.className = 'qi-testbar';
      tb.innerHTML =
        '<span>🧪 Quiet Test:</span>' +
        '<input type="range" id="qiTestSlider" min="0" max="100" value="0">' +
        '<button type="button" class="qi-tbtn c-calm" data-st="calm">Calm</button>' +
        '<button type="button" class="qi-tbtn c-uneasy" data-st="uneasy">Uneasy</button>' +
        '<button type="button" class="qi-tbtn c-loud" data-st="loud">Too loud</button>' +
        '<button type="button" class="qi-tbtn c-ret" data-st="returning">Returning</button>';
      document.body.appendChild(tb);
      domTestSlider = tb.querySelector('#qiTestSlider');
      domTestSlider.oninput = function (e) {
        if (!isOn) turnOn();
        testForced = false;
        testSliderVal = Number(e.target.value);
      };
      tb.querySelectorAll('.qi-tbtn').forEach(function (b) {
        b.onclick = function () { forceState(b.getAttribute('data-st')); };
      });
    }

    updateUIState();
  }

  // =========================================================================
  // 7. PUBLIC API (window.QuietIsland)
  // =========================================================================
  function turnOn() {
    SFX.ensure();
    return startMic().then(function (ok) {
      if (!ok) {
        isOn = false;
        updateUIState();
        return false;
      }
      isOn = true;
      calmSeconds = 0;
      updateUIState();
      return true;
    });
  }

  function turnOff() {
    isOn = false;
    isCalibrating = false;
    testForced = false;
    stopMic();
    if (curState !== 'calm') setState('calm');
    updateUIState();
  }

  function setActivity(mode) {
    if (!ACTIVITIES[mode]) return;
    activity = mode;
    updateUIState();
  }

  function startCalibration() {
    if (!isOn) {
      turnOn().then(function (ok) { if (ok) beginCal(); });
    } else {
      beginCal();
    }
  }
  function beginCal() {
    isCalibrating = true;
    calSamples = [];
    calStart = performance.now();
    if (domCalBtn) domCalBtn.textContent = '👂 Listening to the quiet room...';
    if (domCalBar) domCalBar.classList.add('on');
    if (domCalFill) domCalFill.style.width = '0%';
  }

  function openPanel() { if (domPanel) domPanel.classList.remove('hidden'); }
  function closePanel() { if (domPanel) domPanel.classList.add('hidden'); }
  function togglePanel() { if (domPanel) domPanel.classList.toggle('hidden'); }

  function forceState(st) {
    if (['calm', 'uneasy', 'loud', 'returning'].indexOf(st) < 0) return;
    if (!isOn) {
      isOn = true;
      SFX.ensure();
    }
    testForced = true;
    if (st === 'calm') { testSliderVal = 8; smoothLevel = 0.08; }
    else if (st === 'uneasy') { testSliderVal = 55; smoothLevel = 0.55; }
    else if (st === 'loud') { testSliderVal = 95; smoothLevel = 0.95; }
    else if (st === 'returning') { testSliderVal = 12; smoothLevel = 0.14; }
    if (domTestSlider) domTestSlider.value = String(testSliderVal);
    setState(st);
    updateUIState();
  }

  window.QuietIsland = {
    on: turnOn,
    off: turnOff,
    state: function () { return curState; },
    level: function () { return smoothLevel; },
    setActivity: setActivity,
    calibrate: startCalibration,
    togglePanel: togglePanel,
    openPanel: openPanel,
    closePanel: closePanel,
    forceState: forceState
  };

  // Stop microphone tracks cleanly when leaving the page
  window.addEventListener('pagehide', stopMic);
  window.addEventListener('beforeunload', stopMic);

  // =========================================================================
  // 8. INITIALIZATION ON home3d:ready
  // =========================================================================
  function init() {
    HOST = window.__home3dQuietHost;
    if (!HOST) return;

    buildUI();
    buildLighthouseBeacon();
    buildStormClouds();
    buildRain();
    buildSunbeams();
    buildLivingCreatures();

    HOST.K.onFrame(function (dt, t) {
      var stepDt = Math.min(dt, 0.05);
      updateNoiseAndState(stepDt);
      updateWeatherAndFX(stepDt, t);
      updateCreatures(stepDt, t);
      SFX.updateBed(stepDt);
    });
  }

  if (window.__home3dQuietHost) init();
  else window.addEventListener('home3d:ready', init, { once: true });
})();
