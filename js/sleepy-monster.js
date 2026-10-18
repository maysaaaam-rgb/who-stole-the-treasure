/* Sleepy Monster: a full-screen noise game for the class.
   The monster sleeps while the room is quiet. Noise fills its "wake-up" bar; when the bar is full the monster wakes
   and the teacher taps WHO woke it (every pupil appears with their own monster). No XP is ever taken away: the tally
   is only a friendly "who woke the monster" count, kept on this computer. */
(function (root) {
  'use strict';
  var TALLY_KEY = 'eaa_sleepy_tally_v1';
  var st = null;            // current run state
  var audioCtx = null;

  function S() { return root.schoolStore; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function loadTally() { try { var t = JSON.parse(localStorage.getItem(TALLY_KEY) || '{}'); return t && typeof t === 'object' ? t : {}; } catch (e) { return {}; } }
  function saveTally(t) { try { localStorage.setItem(TALLY_KEY, JSON.stringify(t)); } catch (e) { /* the count just will not be remembered */ } }
  function todayCount(t, id) { return Number(t[today()] && t[today()][id]) || 0; }

  // ---- sound: soft chords only (no raw beeps)
  function ctx() {
    if (!audioCtx) { try { audioCtx = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { audioCtx = null; } }
    if (audioCtx && audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) { /* ignore */ } }
    return audioCtx;
  }
  function chord(freqs, dur, gain, type) {
    var c = ctx(); if (!c) return;
    freqs.forEach(function (f, i) {
      var o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + i * 0.12;
      o.type = type || 'sine'; o2.type = 'triangle'; o.frequency.value = f; o2.frequency.value = f * 2.005;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); o2.connect(g); g.connect(c.destination); o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.05); o2.stop(t0 + dur + 0.05);
    });
  }
  function sndWake() { chord([196, 155.56, 123.47], 1.4, 0.22, 'sawtooth'); }       // a grumbly low chord
  function sndLullaby() { chord([392, 329.63, 261.63, 196], 2.6, 0.12, 'sine'); }  // soft descending lullaby
  function sndBlame() { chord([261.63, 329.63, 392, 523.25], 1.2, 0.14, 'sine'); }

  // ---- monsters
  function monsterSvg(stage, color, equipped, size) {
    try { if (root.MonsterRenderer && root.MonsterRenderer.renderMonsterSVG) return root.MonsterRenderer.renderMonsterSVG({ stage: stage, color: color, equipped: equipped || {}, size: size, animated: false }); } catch (e) { /* fall through */ }
    return '<div style="font-size:' + Math.round(size * 0.7) + 'px">👾</div>';
  }
  function pupilMonster(p, size) {
    var ms = null; try { ms = S().calculateMonsterState(p.id); } catch (e) { ms = null; }
    var stage = ms && ms.stageKey && ms.stageKey !== 'egg' && ms.stageKey !== 'cracking_egg' ? ms.stageKey : 'baby';
    return monsterSvg(stage, ms && ms.profile ? ms.profile.baseColor : 'blue', ms && ms.profile ? ms.profile.equipped : {}, size);
  }

  // ---- Mio art assets (9 full-scene keyframes + overlays)
  var CHAR_DIR = 'assets/packs/characters/sleepy-mio/';
  var BG_DIR = 'assets/packs/backgrounds/';
  var SCENE_DIR = 'assets/packs/backgrounds/sleepy-scenes/';
  var MIO_ART = {
    asleep: SCENE_DIR + 'scene-asleep.webp',
    breatheIn: SCENE_DIR + 'scene-breathe-in.webp',
    twitch: SCENE_DIR + 'scene-twitch.webp',
    stirring: SCENE_DIR + 'scene-stirring.webp',
    peeking: SCENE_DIR + 'scene-peeking.webp',
    awake: SCENE_DIR + 'scene-awake.webp',
    yawn: SCENE_DIR + 'scene-yawn.webp',
    rubbingEyes: SCENE_DIR + 'scene-rubbing-eyes.webp',
    calm: SCENE_DIR + 'scene-calm.webp',
    calmChar: CHAR_DIR + 'mio-calm-happy.webp',
    zzz: CHAR_DIR + 'zzz.webp',
    pillow: CHAR_DIR + 'moon-pillow.webp',
    bubble: CHAR_DIR + 'sleep-bubble.webp',
    bgNight: BG_DIR + 'sleepy-night-room.webp',
    bgAwake: BG_DIR + 'sleepy-awake-room.webp'
  };
  var IMG_CACHE = {};
  function preloadMioArt() {
    Object.keys(MIO_ART).forEach(function (k) {
      if (IMG_CACHE[k]) return;
      var img = new Image();
      img.src = MIO_ART[k];
      IMG_CACHE[k] = img;
    });
  }
  function getImg(key) {
    var im = IMG_CACHE[key];
    return (im && im.complete && im.naturalWidth > 0) ? im : null;
  }
  function setMioPose(pose, ignoreCooldown) {
    if (!st || st.pose === pose) return;
    var now = performance.now();
    if (!ignoreCooldown && now - (st.lastPoseChange || 0) < 520 && pose !== 'awake') return;
    st.prevPose = st.pose || 'asleep';
    st.pose = pose;
    st.poseBlend = 0;
    st.lastPoseChange = now;
    if (pose === 'awake') st.jumpPhase = 0.001;
    else if (pose === 'twitch' || pose === 'stirring' || pose === 'peeking') st.shudderPhase = 0.001;
    var fallbackImg = document.getElementById('sm-mio-img');
    if (fallbackImg && MIO_ART[pose]) fallbackImg.src = MIO_ART[pose];
  }
  function fmtMMSS(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }

  // ---- page
  var CSS = '' +
    '#sm-root{position:fixed;inset:0;z-index:100000;display:flex;flex-direction:column;align-items:center;color:#e6edf7;font-family:inherit;background:#060911;overflow:hidden}' +
    '#sm-root::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,rgba(10,15,30,.12) 0%,rgba(6,9,17,.52) 100%);pointer-events:none;z-index:1;transition:background .6s ease}' +
    '#sm-root.awake::before{background:radial-gradient(circle at 50% 42%,rgba(74,29,42,.18) 0%,rgba(18,6,9,.56) 100%)}' +
    '#sm-root .sm-top,#sm-root .sm-stage,#sm-root .sm-blame{position:relative;z-index:2}' +
    '#sm-root .sm-top{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 22px;box-sizing:border-box;background:rgba(6,9,17,.45);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}' +
    '#sm-root h1{margin:0;font-size:1.5rem;font-weight:900;text-shadow:0 2px 8px rgba(0,0,0,.6)}' +
    '#sm-root .sm-btn{border:0;border-bottom:5px solid var(--b,#1e3a8a);background:var(--c,#38bdf8);color:#06101f;font-weight:900;font-size:1rem;min-height:56px;padding:10px 18px;border-radius:14px;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s,opacity .15s;display:inline-flex;align-items:center;gap:6px}' +
    '#sm-root .sm-btn:active:not(:disabled){transform:translateY(4px);border-bottom-width:1px}' +
    '#sm-root .sm-btn:disabled{opacity:.48;filter:grayscale(.6);cursor:not-allowed}' +
    '#sm-root .sm-btn-icon{width:22px;height:22px;object-fit:contain;pointer-events:none}' +
    '#sm-root .sm-scene{position:absolute;left:50%;top:50%;width:max(100vw,177.78vh);height:max(56.25vw,100vh);transform:translate(-50%,-50%);z-index:0;background:#060911}' +
    '#sm-root .sm-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}' +
    '#sm-root .sm-mon{position:absolute;inset:0;width:100%;height:100%;z-index:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none}' +
    '#sm-root .sm-mon.fallback-on{opacity:1}' +
    '#sm-root .sm-mon img{display:block;width:100%;height:100%;object-fit:cover;user-select:none;-webkit-user-drag:none}' +
    '#sm-root .sm-sparkles{position:absolute;inset:0;pointer-events:none;z-index:3;display:none;align-items:center;justify-content:center}' +
    '#sm-root .sm-sparkles.on{display:flex}' +
    '#sm-root .sm-sparkles .sm-calm-pop{background:rgba(15,23,42,.82);backdrop-filter:blur(12px);border:2px solid #fbbf24;border-radius:28px;padding:16px 28px;display:flex;align-items:center;gap:16px;box-shadow:0 16px 40px rgba(0,0,0,.6);animation:smPopIn .35s cubic-bezier(.175,.885,.32,1.275)}' +
    '#sm-root .sm-sparkles .sm-calm-pop img{width:96px;height:96px;object-fit:contain}' +
    '#sm-root .sm-sparkles .sm-calm-pop b{font-size:1.5rem;color:#fde68a;display:block}' +
    '@keyframes smPopIn{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}' +
    '#sm-root .sm-stage{position:absolute;left:0;right:0;bottom:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:34px 16px 8px;background:linear-gradient(180deg,rgba(6,9,17,0) 0%,rgba(6,9,17,.78) 55%,rgba(6,9,17,.9) 100%);pointer-events:none}' +
    '#sm-root .sm-stage button,#sm-root .sm-stage .sm-blame{pointer-events:auto}' +
    '#sm-root .sm-quiet-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px;pointer-events:auto}' +
    '#sm-root.awake .sm-quiet-bar{display:none}' +
    '#sm-root .sm-streak{background:rgba(15,23,42,.82);backdrop-filter:blur(10px);border:1.5px solid rgba(56,189,248,.35);border-radius:14px;padding:8px 16px;font-weight:800;font-size:1rem;color:#38bdf8;font-variant-numeric:tabular-nums}' +
    '#sm-root .sm-msg{font-size:1.4rem;font-weight:900;margin:6px 0 2px;text-align:center;text-shadow:0 2px 12px rgba(0,0,0,.75)}' +
    '#sm-root .sm-sub{color:#cbd5e1;font-size:1.02rem;font-weight:700;text-align:center;min-height:1.4em;text-shadow:0 2px 8px rgba(0,0,0,.75)}' +
    '#sm-root .sm-bar{width:min(560px,86vw);height:30px;border-radius:15px;background:rgba(15,23,42,.82);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.18);overflow:hidden;margin-top:8px;box-shadow:0 4px 20px rgba(0,0,0,.45)}' +
    '#sm-root .sm-fill{height:100%;width:0;background:linear-gradient(90deg,#10b981,#f59e0b 60%,#f43f5e);transition:width .15s}' +
    '#sm-root .sm-live{font-size:.82rem;color:#cbd5e1;margin-top:6px;text-shadow:0 1px 6px rgba(0,0,0,.8)}' +
    '#sm-root .sm-blame{width:100%;box-sizing:border-box;padding:12px 18px 18px;background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.12);max-height:44vh;overflow:auto}' +
    '#sm-root .sm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;margin-top:10px}' +
    '#sm-root .sm-pup{position:relative;border:0;border-bottom:5px solid #0f172a;background:rgba(30,41,59,.9);border-radius:16px;padding:6px 4px 8px;color:#e6edf7;cursor:pointer;font-weight:800;font-size:.85rem;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s}' +
    '#sm-root .sm-pup:active{transform:translateY(4px);border-bottom-width:1px}' +
    '#sm-root .sm-pup .m{height:74px;display:flex;align-items:center;justify-content:center}' +
    '#sm-root .sm-pup .m svg{height:100%;width:auto}' +
    '#sm-root .sm-pup .n{display:block;line-height:1.15}' +
    '#sm-root .sm-pup .c{position:absolute;top:4px;right:6px;background:#f43f5e;color:#fff;border-radius:10px;padding:1px 7px;font-size:.72rem}' +
    '#sm-root .sm-set{display:flex;gap:14px;align-items:center;color:#e2e8f0;font-size:.85rem;font-weight:700}' +
    '#sm-root .sm-blame{display:none}#sm-root.showwho .sm-blame{display:block}' +
    '#sm-root .sm-acts{display:none;gap:10px;margin-top:14px;flex-wrap:wrap;justify-content:center}#sm-root.awake .sm-acts{display:flex}' +
    '#sm-root.awake .sm-bar,#sm-root.awake .sm-live{display:none}' +
    '#sm-root .sm-loud{display:none}' +
    '#sm-root.nomic .sm-loud{display:inline-flex}#sm-root.awake .sm-loud{display:none!important}';

  var mioBufCvs = null, mioBufCtx = null;
  var BX = 520, BY = 330, BW = 880, BH = 520; // Mio + bed region in 1920x1080 space
  function ensureMioBuf() {
    if (!mioBufCvs) {
      mioBufCvs = document.createElement('canvas');
      mioBufCvs.width = BW;
      mioBufCvs.height = BH;
      mioBufCtx = mioBufCvs.getContext('2d');
    }
    return mioBufCtx;
  }

  function initParticles() {
    var motes = [];
    for (var i = 0; i < 28; i++) {
      motes.push({
        x: 620 + Math.random() * 680,
        y: 160 + Math.random() * 580,
        r: 1.2 + Math.random() * 2.4,
        vx: -8 + Math.random() * 16,
        vy: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2
      });
    }
    var zzzList = [
      { age: 0.0, dur: 3.6, x0: 1035, y0: 455 },
      { age: 1.2, dur: 3.6, x0: 1035, y0: 455 },
      { age: 2.4, dur: 3.6, x0: 1035, y0: 455 }
    ];
    return { motes: motes, zzzList: zzzList };
  }

  function renderCanvasFrame(now, dt) {
    if (!st || !st.alive) return;
    var cvs = document.getElementById('sm-canvas');
    if (!cvs) return;
    var ctx2d = cvs.getContext('2d');
    if (!ctx2d) return;

    var t = now / 1000;
    // Advance pose cross-fade smoothly (no instant cuts!)
    var fadeSpeed = st.pose === 'awake' ? 3.2 : 2.0; // ~500ms smooth dissolve
    if (st.poseBlend < 1) {
      st.poseBlend = Math.min(1, st.poseBlend + dt * fadeSpeed);
    }

    // Natural breathing wave: slower in deep sleep, faster when stirring/awake
    var breathRate = st.awake ? 5.2 : (st.wake > 45 ? 3.1 : 1.55);
    st.breathPhase = (st.breathPhase || 0) + dt * breathRate;
    var breathWave = 0.5 - 0.5 * Math.cos(st.breathPhase); // 0..1..0

    // Compute localized motion offsets (in 1920x1080 pixels)
    var lift = 0, sway = 0, squash = 0;
    if (st.awake) {
      if (st.jumpPhase > 0 && st.jumpPhase < 1) {
        st.jumpPhase = Math.min(1, st.jumpPhase + dt * 2.1);
        var jp = st.jumpPhase;
        lift = Math.sin(jp * Math.PI * 2) * (1 - jp) * 32;
        squash = Math.sin(jp * Math.PI * 2) * (1 - jp) * 0.042;
      } else {
        lift = breathWave * 10;
        squash = breathWave * 0.018;
        sway = Math.sin(t * 3.4) * 3.5;
      }
    } else if (st.pose === 'yawn') {
      lift = Math.sin(t * 2.2) * 13 + 7;
      squash = 0.024 * Math.sin(t * 2.2);
      sway = Math.sin(t * 1.5) * 3.5;
    } else if (st.pose === 'rubbingEyes' || st.pose === 'calm') {
      lift = breathWave * 8.5;
      sway = Math.sin(t * 1.8) * 5.0;
      squash = breathWave * 0.014;
    } else if (st.pose === 'peeking' || st.pose === 'stirring' || st.pose === 'twitch') {
      var intensity = st.pose === 'peeking' ? 1.35 : (st.pose === 'stirring' ? 1.0 : 0.65);
      lift = breathWave * (9 * intensity);
      sway = Math.sin(t * 6.2) * (6.0 * intensity) + Math.sin(t * 12.5) * (2.0 * intensity);
      squash = breathWave * 0.016 * intensity;
    } else {
      // Deep sleep: gentle rhythmic rise & fall of chest and wings
      lift = breathWave * 11.5;
      squash = breathWave * 0.022;
      sway = Math.sin(t * 0.8) * 2.0;
    }

    var curImg = getImg(st.pose) || getImg('asleep');
    var prevImg = getImg(st.prevPose) || curImg;
    var monFallback = document.getElementById('sm-mon');
    if (!curImg) {
      if (monFallback) monFallback.classList.add('fallback-on');
      return;
    }
    if (monFallback) monFallback.classList.remove('fallback-on');

    ctx2d.clearRect(0, 0, 1920, 1080);

    // Smooth ease-in-out for pose blend
    var b = st.poseBlend;
    var easeB = b < 0.5 ? 2 * b * b : 1 - Math.pow(-2 * b + 2, 2) / 2;

    // 1. Draw the full 1920x1080 room static background (cross-fading room lighting only when waking/sleeping)
    if (easeB < 0.999 && prevImg && prevImg !== curImg) {
      ctx2d.globalAlpha = 1;
      ctx2d.drawImage(prevImg, 0, 0, 1920, 1080);
      ctx2d.globalAlpha = easeB;
      ctx2d.drawImage(curImg, 0, 0, 1920, 1080);
      ctx2d.globalAlpha = 1;
    } else {
      ctx2d.globalAlpha = 1;
      ctx2d.drawImage(curImg, 0, 0, 1920, 1080);
    }

    // 2. Compose Mio's blended keyframe into the offscreen buffer (BX, BY, BW, BH) at 100% final opacity
    var bctx = ensureMioBuf();
    if (bctx) {
      bctx.clearRect(0, 0, BW, BH);
      bctx.globalAlpha = 1;
      if (easeB < 0.999 && prevImg && prevImg !== curImg) {
        bctx.drawImage(prevImg, BX, BY, BW, BH, 0, 0, BW, BH);
        bctx.globalAlpha = easeB;
      }
      if (st.pose === 'asleep') {
        var asleepImg = getImg('asleep') || curImg;
        var inhaleImg = getImg('breatheIn');
        bctx.drawImage(asleepImg, BX, BY, BW, BH, 0, 0, BW, BH);
        if (inhaleImg) {
          bctx.globalAlpha = easeB * Math.pow(breathWave, 1.15) * 0.9;
          bctx.drawImage(inhaleImg, BX, BY, BW, BH, 0, 0, BW, BH);
        }
      } else {
        bctx.drawImage(curImg, BX, BY, BW, BH, 0, 0, BW, BH);
      }
      bctx.globalAlpha = 1;

      // Single-pass 2D strip-mesh breathing/sway warp of Mio inside the bed ellipse
      var strips = 22;
      var sh = BH / strips;
      ctx2d.save();
      ctx2d.beginPath();
      ctx2d.ellipse(960, 595, 385, 240, 0, 0, Math.PI * 2);
      ctx2d.clip();
      for (var i = 0; i < strips; i++) {
        var sy = i * sh;
        var tNorm = 1 - (i / strips); // 1 at top of head, 0 at bottom of bed
        var w = Math.sin(tNorm * Math.PI) * Math.pow(tNorm, 0.55);
        var dy = -lift * w;
        var dx = sway * Math.pow(tNorm, 0.85);
        var scaleW = 1 + (squash * w);
        var dw = BW * scaleW;
        var destX = BX - (dw - BW) * 0.5 + dx;
        ctx2d.drawImage(mioBufCvs, 0, sy, BW, sh + 1.5, destX, BY + sy + dy, dw, sh + 1.8);
      }
      ctx2d.restore();
    }

    // 3. Ambient living room details: warm candle lantern flicker + moonbeam dust motes
    ctx2d.save();
    ctx2d.globalCompositeOperation = 'screen';
    var flicker1 = 0.14 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.cos(t * 13.1);
    var flicker2 = 0.14 + 0.05 * Math.cos(t * 6.4) + 0.03 * Math.sin(t * 11.7);
    var lanterns = [
      { x: 252, y: 565, r: 155, a: flicker1 },
      { x: 1516, y: 642, r: 145, a: flicker2 }
    ];
    lanterns.forEach(function (L) {
      var g = ctx2d.createRadialGradient(L.x, L.y, 4, L.x, L.y, L.r);
      g.addColorStop(0, 'rgba(255, 210, 120, ' + L.a.toFixed(3) + ')');
      g.addColorStop(0.5, 'rgba(251, 146, 60, ' + (L.a * 0.45).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx2d.fillStyle = g;
      ctx2d.beginPath();
      ctx2d.arc(L.x, L.y, L.r, 0, Math.PI * 2);
      ctx2d.fill();
    });

    // Moonbeam floating stardust motes
    if (st.particles && st.particles.motes) {
      st.particles.motes.forEach(function (m) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y > 740) { m.y = 160; m.x = 640 + Math.random() * 640; }
        if (m.x < 560) m.x = 1320;
        if (m.x > 1360) m.x = 600;
        var tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + m.phase));
        ctx2d.fillStyle = st.awake ? 'rgba(253, 224, 71, ' + (tw * 0.55).toFixed(3) + ')' : 'rgba(196, 181, 253, ' + tw.toFixed(3) + ')';
        ctx2d.beginPath();
        ctx2d.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx2d.fill();
      });
    }
    ctx2d.restore();

    // 4. Floating Zzz & dream bubbles when Mio is sleeping peacefully
    var zzzAlpha = (!st.awake && (st.pose === 'asleep' || st.pose === 'calm')) ? 1 : 0;
    st.zzzVis = (st.zzzVis == null ? 1 : st.zzzVis) + (zzzAlpha - (st.zzzVis == null ? 1 : st.zzzVis)) * Math.min(1, dt * 4);
    if (st.zzzVis > 0.02 && st.particles && st.particles.zzzList) {
      ctx2d.save();
      ctx2d.font = '900 42px "Nunito", "Comic Sans MS", system-ui, sans-serif';
      ctx2d.textAlign = 'center';
      st.particles.zzzList.forEach(function (z, idx) {
        z.age += dt;
        if (z.age >= z.dur) z.age -= z.dur;
        var p = z.age / z.dur; // 0..1
        var env = p < 0.2 ? (p / 0.2) : (p > 0.75 ? (1 - p) / 0.25 : 1);
        var zx = z.x0 + p * 85 + Math.sin(p * Math.PI * 2 + idx) * 14;
        var zy = z.y0 - p * 145 - lift * 0.5;
        var sc = 0.55 + p * 0.65;
        ctx2d.save();
        ctx2d.translate(zx, zy);
        ctx2d.scale(sc, sc);
        ctx2d.rotate(Math.sin(t * 2 + idx) * 0.14);
        ctx2d.globalAlpha = Math.max(0, Math.min(1, env * st.zzzVis * 0.88));
        ctx2d.shadowColor = 'rgba(139, 92, 246, 0.85)';
        ctx2d.shadowBlur = 14;
        ctx2d.fillStyle = '#e0e7ff';
        ctx2d.strokeStyle = '#6366f1';
        ctx2d.lineWidth = 4;
        ctx2d.strokeText('Z', 0, 0);
        ctx2d.fillText('Z', 0, 0);
        ctx2d.restore();
      });
      ctx2d.restore();
    }
  }

  function clearStepTimers() {
    if (!st) return;
    if (st.yawnTimer) { clearTimeout(st.yawnTimer); st.yawnTimer = null; }
    if (st.yawnTimer2) { clearTimeout(st.yawnTimer2); st.yawnTimer2 = null; }
    if (st.yawnTimer3) { clearTimeout(st.yawnTimer3); st.yawnTimer3 = null; }
    if (st.calmTimer) { clearTimeout(st.calmTimer); st.calmTimer = null; }
  }

  function close() {
    if (!st) return;
    st.alive = false;
    if (st.raf) cancelAnimationFrame(st.raf);
    clearStepTimers();
    if (st.stream) { try { st.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* ignore */ } }
    if (st.key) document.removeEventListener('keydown', st.key, true);
    var el = document.getElementById('sm-root'); if (el) el.remove();
    st = null;
  }

  function open() {
    if (st) close();
    var store = S(); if (!store) return;
    preloadMioArt();
    var cls = store.getActiveClass && store.getActiveClass();
    var pupils = cls ? store.getStudentsByClass(cls.id) : [];
    var cssEl = document.getElementById('sm-css');
    if (!cssEl) { cssEl = document.createElement('style'); cssEl.id = 'sm-css'; document.head.appendChild(cssEl); }
    cssEl.textContent = CSS;
    var el = document.createElement('div'); el.id = 'sm-root'; el.className = 'asleep';
    el.innerHTML = '' +
      '<div class="sm-scene">' +
      '<canvas class="sm-canvas" id="sm-canvas" width="1920" height="1080"></canvas>' +
      '<div class="sm-SparklesWrap"><div class="sm-sparkles" id="sm-sparkles"><div class="sm-calm-pop"><img src="' + MIO_ART.calmChar + '" alt=""><div><b>✨ +5 XP to the quiet class! ✨</b><span>Mio is having sweet dreams</span></div></div></div></div>' +
      '<div class="sm-mon" id="sm-mon"><img id="sm-mio-img" src="' + MIO_ART.asleep + '" alt="Sleepy Mio"></div></div>' +
      '<div class="sm-top"><h1>😴 Sleepy Monster' + (cls ? ' · ' + esc(cls.name || cls.id) : '') + '</h1>' +
      '<div class="sm-set"><label>Sensitivity <input id="sm-sens" type="range" min="10" max="90" value="50"></label>' +
      '<button class="sm-btn" id="sm-close" style="--c:#94a3b8;--b:#475569">✕ Close</button></div></div>' +
      '<div class="sm-stage">' +
      '<div class="sm-msg" id="sm-msg">Shhh… let Mio sleep</div><div class="sm-sub" id="sm-sub">Keep the room quiet</div>' +
      '<div class="sm-bar"><div class="sm-fill" id="sm-fill"></div></div>' +
      '<div class="sm-quiet-bar">' +
        '<span class="sm-streak" id="sm-streak">🌙 Quiet streak 00:00</span>' +
        '<button type="button" class="sm-btn" id="sm-reward" style="--c:#f59e0b;--b:#b45309">⭐ Reward the quiet class</button>' +
      '</div>' +
      '<div class="sm-live" id="sm-live">Starting the microphone…</div>' +
      '<button class="sm-btn sm-loud" id="sm-loud" style="--c:#f59e0b;--b:#92400e;margin-top:10px">🔊 Too loud! (or press Space)</button>' +
      '<div class="sm-acts"><button class="sm-btn" id="sm-sleep" style="--c:#10b981;--b:#065f46"><img class="sm-btn-icon" src="' + MIO_ART.pillow + '" alt=""> Whisper him back to sleep (all together)</button>' +
      '<button class="sm-btn" id="sm-who" style="--c:#475569;--b:#1e293b;color:#e6edf7">🔒 Teacher: private note</button></div>' +
      '<div class="sm-blame" id="sm-blame"></div></div>';
    document.body.appendChild(el);

    st = {
      alive: true, wake: 0, level: 0, sens: 50, awake: false, yawning: false, rewarding: false,
      quietSec: 0, rewardCooldownUntil: 0, pose: 'asleep', prevPose: 'asleep', poseBlend: 1,
      breathPhase: 0, jumpPhase: 0, shudderPhase: 0, zzzVis: 1, lastPoseChange: performance.now(),
      particles: initParticles(), mic: false, loudUntil: 0, cls: cls, pupils: pupils
    };
    var mioImg = document.getElementById('sm-mio-img');
    if (mioImg) {
      mioImg.onerror = function () {
        var m = document.getElementById('sm-mon');
        if (m) { m.classList.add('fallback-on'); m.innerHTML = monsterSvg('advanced', 'purple', {}, 380); }
      };
    }
    el.querySelector('#sm-close').onclick = close;
    el.querySelector('#sm-sens').oninput = function () { st.sens = parseInt(this.value, 10) || 50; };
    function loud() { ctx(); st.loudUntil = Date.now() + 700; }
    el.querySelector('#sm-loud').onclick = loud;
    el.querySelector('#sm-reward').onclick = rewardQuietClass;
    st.key = function (e) { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); loud(); } else if (e.key === 'Escape') { close(); } };
    document.addEventListener('keydown', st.key, true);
    el.querySelector('#sm-sleep').onclick = sleepAgain;
    el.querySelector('#sm-who').onclick = function () { el.classList.toggle('showwho'); renderBlame(); };

    // the microphone only starts after this click (the dock button), so it counts as the user gesture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        if (!st || !st.alive) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
        var c = ctx(); if (!c) throw new Error('no audio');
        st.stream = stream; st.an = c.createAnalyser(); st.an.fftSize = 512; c.createMediaStreamSource(stream).connect(st.an);
        st.data = new Uint8Array(st.an.fftSize); st.mic = true;
        document.getElementById('sm-live').textContent = 'Listening to the room';
      }).catch(noMic);
    } else noMic();
    function noMic() {
      if (!st || !st.alive) return;
      el.classList.add('nomic');
      document.getElementById('sm-live').textContent = 'No microphone: tap the orange button (or Space) when the class gets loud';
    }
    st.last = performance.now();
    st.raf = requestAnimationFrame(tick);
  }

  function pickWakePose(w, curPose) {
    // Hysteresis deadbands (±4%) so Mio never flickers between frames
    if (w >= 76 || (curPose === 'peeking' && w >= 69)) return 'peeking';
    if (w >= 50 || (curPose === 'stirring' && w >= 43)) return 'stirring';
    if (w >= 24 || (curPose === 'twitch' && w >= 18)) return 'twitch';
    return 'asleep';
  }

  function rewardQuietClass() {
    if (!st || st.awake) return;
    var nowMs = Date.now();
    if (nowMs < st.rewardCooldownUntil) return;
    st.rewardCooldownUntil = nowMs + 60000;
    var store = S();
    var away = {};
    try { if (st.cls) away = JSON.parse(sessionStorage.getItem('eaa_board_absent_' + st.cls.id) || '{}') || {}; } catch (e) { away = {}; }
    var presentPupils = (st.pupils || []).filter(function (p) { return !away[p.id]; });
    if (store && store.giveXP) {
      presentPupils.forEach(function (p) {
        store.giveXP(p.id, 5, 'Quiet class reward', 'Teacher', { category: 'positive', icon: '⭐' });
      });
    }
    sndBlame();
    st.rewarding = true;
    setMioPose('calm', true);
    var sp = document.getElementById('sm-sparkles');
    if (sp) sp.classList.add('on');
    if (st.calmTimer) clearTimeout(st.calmTimer);
    st.calmTimer = setTimeout(function () {
      if (!st || !st.alive) return;
      st.rewarding = false;
      var sp2 = document.getElementById('sm-sparkles');
      if (sp2) sp2.classList.remove('on');
      if (!st.awake && !st.yawning) setMioPose(pickWakePose(st.wake, st.pose));
    }, 3200);
  }

  function readLevel() {
    if (st.mic && st.an) {
      st.an.getByteTimeDomainData(st.data);
      var sum = 0; for (var i = 0; i < st.data.length; i++) { var v = (st.data[i] - 128) / 128; sum += v * v; }
      var rms = Math.sqrt(sum / st.data.length);                  // 0..~0.5 for loud speech
      return Math.min(100, Math.round(rms * 420));
    }
    return Date.now() < st.loudUntil ? 85 : 0;
  }

  function tick(now) {
    if (!st || !st.alive) return;
    var dt = Math.min(0.1, (now - st.last) / 1000); st.last = now;
    var lvl = readLevel();
    st.level = st.level * 0.7 + lvl * 0.3;
    if (!st.awake) {
      var thr = 100 - st.sens;                                    // higher sensitivity: lower noise wakes Mio
      var over = st.level - Math.max(8, thr * 0.6);
      st.wake = Math.max(0, Math.min(100, st.wake + (over > 0 ? over * 0.9 * dt * 6 : -9 * dt)));
      var root_ = document.getElementById('sm-root'), fill = document.getElementById('sm-fill'), msg = document.getElementById('sm-msg'), sub = document.getElementById('sm-sub');
      if (fill) fill.style.width = Math.round(st.wake) + '%';
      var stirring = st.wake > 45;
      if (stirring) st.quietSec = 0; else st.quietSec += dt;
      var streakEl = document.getElementById('sm-streak');
      if (streakEl) streakEl.textContent = '🌙 Quiet streak ' + fmtMMSS(st.quietSec);
      var rBtn = document.getElementById('sm-reward');
      if (rBtn) {
        var rem = Math.ceil((st.rewardCooldownUntil - Date.now()) / 1000);
        if (rem > 0) {
          rBtn.disabled = true;
          rBtn.textContent = '⭐ Reward the quiet class (' + rem + 's)';
        } else {
          rBtn.disabled = false;
          rBtn.textContent = '⭐ Reward the quiet class';
        }
      }
      if (root_) { root_.classList.toggle('stirring', stirring); root_.classList.toggle('asleep', !stirring); }
      if (!st.yawning && !st.rewarding) {
        var nextPose = pickWakePose(st.wake, st.pose);
        // During long peaceful streaks, occasionally snuggle the moon pillow ('calm') for a few seconds
        if (nextPose === 'asleep' && st.quietSec > 10 && (Math.floor(st.quietSec) % 18 >= 13)) {
          nextPose = 'calm';
        }
        setMioPose(nextPose);
      }
      if (msg && !st.yawning) {
        msg.textContent = st.wake >= 76 ? 'Mio is peeking! Eyes opening…' : st.wake >= 50 ? 'Mio is stirring…' : st.wake >= 24 ? 'Mio twitched in his sleep…' : 'Shhh… let Mio sleep';
      }
      if (sub && !st.yawning) {
        sub.textContent = st.wake >= 76 ? 'Quiet, quiet, quiet!' : st.wake >= 50 ? 'Too much noise. Whisper, please' : st.wake >= 24 ? 'Softer voices, please' : 'Keep the room quiet';
      }
      if (st.wake >= 100) wakeUp();
    }
    renderCanvasFrame(now, dt);
    st.raf = requestAnimationFrame(tick);
  }

  function wakeUp() {
    clearStepTimers();
    st.yawning = false; st.rewarding = false; st.quietSec = 0;
    var sp = document.getElementById('sm-sparkles'); if (sp) sp.classList.remove('on');
    st.awake = true; st.wake = 100;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('asleep', 'stirring'); root_.classList.add('awake');
    setMioPose('awake', true);
    document.getElementById('sm-msg').textContent = 'Mio woke up! 😠';
    document.getElementById('sm-sub').textContent = 'The whole class can help: whisper him back to sleep';
    sndWake();
  }

  function sleepAgain() {
    if (!st) return;
    clearStepTimers();
    st.awake = false; st.wake = 0; st.level = 0; st.quietSec = 0; st.yawning = true;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('awake', 'stirring', 'showwho'); root_.classList.add('asleep');
    // Step 1: Big stretch & yawn
    setMioPose('yawn', true);
    var msg = document.getElementById('sm-msg'), sub = document.getElementById('sm-sub');
    if (msg) msg.textContent = 'Yaaawn… Mio is stretching and getting sleepy';
    if (sub) sub.textContent = 'Shhh… keep whispering softly';
    // Step 2: Rubbing sleepy eyes while holding the moon pillow
    st.yawnTimer = setTimeout(function () {
      if (!st || !st.alive || st.awake) return;
      if (st.wake < 45) {
        setMioPose('rubbingEyes', true);
        var m1 = document.getElementById('sm-msg');
        if (m1) m1.textContent = 'Rubbing his sleepy eyes…';
      }
      // Step 3: Cuddling the moon pillow with a happy smile
      st.yawnTimer2 = setTimeout(function () {
        if (!st || !st.alive || st.awake) return;
        if (st.wake < 45) {
          setMioPose('calm', true);
          var m2 = document.getElementById('sm-msg');
          if (m2) m2.textContent = 'Cuddling the moon pillow…';
        }
        // Step 4: Deep rhythmic sleep (asleep <-> breatheIn loop)
        st.yawnTimer3 = setTimeout(function () {
          if (!st || !st.alive) return;
          st.yawning = false;
          if (!st.awake && st.wake < 45) setMioPose('asleep', true);
        }, 1600);
      }, 1500);
    }, 1500);
    sndLullaby();
  }

  function blame(id) {
    var p = S().getStudent(id), t = loadTally(), d = today();
    if (!t[d]) t[d] = {};
    t[d][id] = todayCount(t, id) + 1;
    saveTally(t);
    sndBlame();
    renderBlame();
  }
  function renderBlame() {
    var box = document.getElementById('sm-blame'); if (!box || !st) return;
    var t = loadTally();
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><b>🔒 Private note for the teacher: who made noise just now?</b>' +
      '<span style="color:#9fb0cc;font-size:.8rem">Kept only on this computer. Turn the projector off first. Nobody loses XP.</span></div>' +
      '<div class="sm-grid">' + st.pupils.map(function (p) {
        var n = todayCount(t, p.id);
        return '<button class="sm-pup" data-id="' + esc(p.id) + '">' + (n ? '<span class="c">' + n + '</span>' : '') + '<span class="m">' + pupilMonster(p, 74) + '</span><span class="n">' + esc(p.name || '') + '</span></button>';
      }).join('') + '</div>';
    [].forEach.call(box.querySelectorAll('.sm-pup'), function (b) { b.onclick = function () { blame(b.getAttribute('data-id')); }; });
  }

  root.SleepyMonster = { open: open, close: close };
  root.openSleepyMonster = open;
})(typeof window !== 'undefined' ? window : this);
