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

  // ---- Mio art assets
  var CHAR_DIR = 'assets/packs/characters/sleepy-mio/';
  var BG_DIR = 'assets/packs/backgrounds/';
  var MIO_ART = {
    asleep: CHAR_DIR + 'mio-asleep.webp',
    stirring: CHAR_DIR + 'mio-stirring.webp',
    awake: CHAR_DIR + 'mio-awake-grumpy.webp',
    yawn: CHAR_DIR + 'mio-yawn.webp',
    calm: CHAR_DIR + 'mio-calm-happy.webp',
    zzz: CHAR_DIR + 'zzz.webp',
    pillow: CHAR_DIR + 'moon-pillow.webp',
    bubble: CHAR_DIR + 'sleep-bubble.webp',
    bgNight: BG_DIR + 'sleepy-night-room.webp',
    bgAwake: BG_DIR + 'sleepy-awake-room.webp'
  };
  var preloaded = false;
  function preloadMioArt() {
    if (preloaded) return;
    preloaded = true;
    Object.keys(MIO_ART).forEach(function (k) {
      var img = new Image();
      img.src = MIO_ART[k];
    });
  }
  function setMioPose(pose) {
    if (!st || st.pose === pose) return;
    st.pose = pose;
    var img = document.getElementById('sm-mio-img');
    if (img && MIO_ART[pose]) img.src = MIO_ART[pose];
  }

  // ---- page
  var CSS = '' +
    '#sm-root{position:fixed;inset:0;z-index:100000;display:flex;flex-direction:column;align-items:center;color:#e6edf7;font-family:inherit;background:#060911 url("' + MIO_ART.bgNight + '") center/cover no-repeat;overflow:hidden;transition:background-image .45s ease}' +
    '#sm-root::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,rgba(10,15,30,.22) 0%,rgba(6,9,17,.68) 100%);pointer-events:none;z-index:0;transition:background .45s ease}' +
    '#sm-root.awake{background-image:url("' + MIO_ART.bgAwake + '")}' +
    '#sm-root.awake::before{background:radial-gradient(circle at 50% 42%,rgba(74,29,42,.25) 0%,rgba(18,6,9,.72) 100%)}' +
    '#sm-root .sm-top,#sm-root .sm-stage,#sm-root .sm-blame{position:relative;z-index:1}' +
    '#sm-root .sm-top{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 22px;box-sizing:border-box;background:rgba(6,9,17,.45);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}' +
    '#sm-root h1{margin:0;font-size:1.5rem;font-weight:900;text-shadow:0 2px 8px rgba(0,0,0,.6)}' +
    '#sm-root .sm-btn{border:0;border-bottom:5px solid var(--b,#1e3a8a);background:var(--c,#38bdf8);color:#06101f;font-weight:900;font-size:1rem;padding:10px 18px;border-radius:14px;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s;display:inline-flex;align-items:center;gap:6px}' +
    '#sm-root .sm-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
    '#sm-root .sm-btn-icon{width:22px;height:22px;object-fit:contain;pointer-events:none}' +
    '#sm-root .sm-stage{position:relative;flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:0}' +
    '#sm-root .sm-mon-wrap{position:relative;display:flex;align-items:center;justify-content:center}' +
    '#sm-root .sm-mon{width:min(46vh,380px);height:min(46vh,380px);display:flex;align-items:center;justify-content:center;transition:filter .4s,transform .3s;filter:drop-shadow(0 18px 28px rgba(0,0,0,.55))}' +
    '#sm-root .sm-mon img,#sm-root .sm-mon svg{width:100%;height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none}' +
    '#sm-root.asleep .sm-mon{filter:brightness(.92) saturate(.95) drop-shadow(0 18px 28px rgba(0,0,0,.55));animation:smBreathe 4s ease-in-out infinite}' +
    '#sm-root.stirring .sm-mon{animation:smStir .5s ease-in-out infinite}' +
    '#sm-root.awake .sm-mon{filter:brightness(1.06) saturate(1.1) drop-shadow(0 18px 30px rgba(0,0,0,.6));animation:smJump .6s var(--spring,cubic-bezier(.175,.885,.32,1.275)) 1}' +
    '@keyframes smBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}' +
    '@keyframes smStir{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-6px) rotate(-2deg)}75%{transform:translateX(6px) rotate(2deg)}}' +
    '@keyframes smJump{0%{transform:translateY(0)}40%{transform:translateY(-40px) scale(1.1)}100%{transform:translateY(0)}}' +
    '#sm-root .sm-zzz{position:absolute;top:-6%;right:-18%;width:min(14vh,120px);height:min(14vh,120px);pointer-events:none;animation:smZ 3.2s ease-in-out infinite}' +
    '#sm-root .sm-zzz img{width:100%;height:100%;object-fit:contain}' +
    '#sm-root .sm-bubble{position:absolute;top:24%;left:18%;width:min(6.5vh,54px);height:min(6.5vh,54px);pointer-events:none;animation:smBubble 4s ease-in-out infinite}' +
    '#sm-root .sm-bubble img{width:100%;height:100%;object-fit:contain}' +
    '@keyframes smZ{0%{opacity:0;transform:translate(0,18px) scale(.65)}30%{opacity:1}100%{opacity:0;transform:translate(26px,-44px) scale(1.18)}}' +
    '@keyframes smBubble{0%,100%{transform:scale(.75);opacity:.65}50%{transform:scale(1.18);opacity:.95}}' +
    '#sm-root.awake .sm-zzz,#sm-root.stirring .sm-zzz,#sm-root.awake .sm-bubble,#sm-root.stirring .sm-bubble{display:none}' +
    '#sm-root .sm-msg{font-size:1.6rem;font-weight:900;margin:10px 0 4px;text-align:center;text-shadow:0 2px 12px rgba(0,0,0,.75)}' +
    '#sm-root .sm-sub{color:#cbd5e1;font-size:1.02rem;font-weight:700;text-align:center;min-height:1.4em;text-shadow:0 2px 8px rgba(0,0,0,.75)}' +
    '#sm-root .sm-bar{width:min(560px,86vw);height:30px;border-radius:15px;background:rgba(15,23,42,.82);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.18);overflow:hidden;margin-top:12px;box-shadow:0 4px 20px rgba(0,0,0,.45)}' +
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
    '#sm-root.awake .sm-mon{width:min(28vh,250px);height:min(28vh,250px)}' +
    '#sm-root .sm-blame{display:none}#sm-root.showwho .sm-blame{display:block}' +
    '#sm-root .sm-acts{display:none;gap:10px;margin-top:14px;flex-wrap:wrap;justify-content:center}#sm-root.awake .sm-acts{display:flex}' +
    '#sm-root.awake .sm-bar,#sm-root.awake .sm-live{display:none}' +
    '#sm-root .sm-loud{display:none}' +
    '#sm-root.nomic .sm-loud{display:inline-flex}#sm-root.awake .sm-loud{display:none!important}';

  function close() {
    if (!st) return;
    st.alive = false;
    if (st.raf) cancelAnimationFrame(st.raf);
    if (st.yawnTimer) clearTimeout(st.yawnTimer);
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
    if (!document.getElementById('sm-css')) { var s = document.createElement('style'); s.id = 'sm-css'; s.textContent = CSS; document.head.appendChild(s); }
    var el = document.createElement('div'); el.id = 'sm-root'; el.className = 'asleep';
    el.innerHTML = '' +
      '<div class="sm-top"><h1>😴 Sleepy Monster' + (cls ? ' · ' + esc(cls.name || cls.id) : '') + '</h1>' +
      '<div class="sm-set"><label>Sensitivity <input id="sm-sens" type="range" min="10" max="90" value="50"></label>' +
      '<button class="sm-btn" id="sm-close" style="--c:#94a3b8;--b:#475569">✕ Close</button></div></div>' +
      '<div class="sm-stage">' +
      '<div class="sm-mon-wrap">' +
      '<div class="sm-zzz"><img src="' + MIO_ART.zzz + '" alt="Zzz"></div>' +
      '<div class="sm-bubble"><img src="' + MIO_ART.bubble + '" alt=""></div>' +
      '<div class="sm-mon" id="sm-mon"><img id="sm-mio-img" src="' + MIO_ART.asleep + '" alt="Sleepy Mio"></div>' +
      '</div>' +
      '<div class="sm-msg" id="sm-msg">Shhh… let Mio sleep</div><div class="sm-sub" id="sm-sub">Keep the room quiet</div>' +
      '<div class="sm-bar"><div class="sm-fill" id="sm-fill"></div></div>' +
      '<div class="sm-live" id="sm-live">Starting the microphone…</div>' +
      '<button class="sm-btn sm-loud" id="sm-loud" style="--c:#f59e0b;--b:#92400e;margin-top:10px">🔊 Too loud! (or press Space)</button>' +
      '<div class="sm-acts"><button class="sm-btn" id="sm-sleep" style="--c:#10b981;--b:#065f46"><img class="sm-btn-icon" src="' + MIO_ART.pillow + '" alt=""> Whisper him back to sleep (all together)</button>' +
      '<button class="sm-btn" id="sm-who" style="--c:#475569;--b:#1e293b;color:#e6edf7">🔒 Teacher: private note</button></div></div>' +
      '<div class="sm-blame" id="sm-blame"></div>';
    document.body.appendChild(el);

    st = { alive: true, wake: 0, level: 0, sens: 50, awake: false, yawning: false, pose: 'asleep', mic: false, loudUntil: 0, pupils: pupils };
    var mioImg = document.getElementById('sm-mio-img');
    if (mioImg) {
      mioImg.onerror = function () {
        var m = document.getElementById('sm-mon');
        if (m) m.innerHTML = monsterSvg('advanced', 'purple', {}, 380);
      };
    }
    el.querySelector('#sm-close').onclick = close;
    el.querySelector('#sm-sens').oninput = function () { st.sens = parseInt(this.value, 10) || 50; };
    function loud() { ctx(); st.loudUntil = Date.now() + 700; }
    el.querySelector('#sm-loud').onclick = loud;
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
      var stirring = st.wake > 55;
      if (root_) { root_.classList.toggle('stirring', stirring); root_.classList.toggle('asleep', !stirring); }
      if (!st.yawning) setMioPose(stirring ? 'stirring' : 'asleep');
      if (msg) msg.textContent = st.wake > 80 ? 'Mio is waking up!' : stirring ? 'Mio is stirring…' : 'Shhh… let Mio sleep';
      if (sub) sub.textContent = st.wake > 80 ? 'Quiet, quiet, quiet!' : stirring ? 'Too much noise. Whisper, please' : 'Keep the room quiet';
      if (st.wake >= 100) wakeUp();
    }
    st.raf = requestAnimationFrame(tick);
  }

  function wakeUp() {
    if (st.yawnTimer) { clearTimeout(st.yawnTimer); st.yawnTimer = null; }
    st.yawning = false;
    st.awake = true; st.wake = 100;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('asleep', 'stirring'); root_.classList.add('awake');
    setMioPose('awake');
    document.getElementById('sm-msg').textContent = 'Mio woke up! 😠';
    document.getElementById('sm-sub').textContent = 'The whole class can help: whisper him back to sleep';
    sndWake();
  }

  function sleepAgain() {
    if (!st) return;
    if (st.yawnTimer) { clearTimeout(st.yawnTimer); st.yawnTimer = null; }
    st.awake = false; st.wake = 0; st.level = 0; st.yawning = true;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('awake', 'stirring', 'showwho'); root_.classList.add('asleep');
    setMioPose('yawn');
    var msg = document.getElementById('sm-msg'), sub = document.getElementById('sm-sub');
    if (msg) msg.textContent = 'Yaaawn… Mio is getting sleepy';
    if (sub) sub.textContent = 'Shhh… keep the room quiet';
    st.yawnTimer = setTimeout(function () {
      if (!st || !st.alive) return;
      st.yawning = false;
      if (!st.awake && st.wake <= 55) setMioPose('asleep');
    }, 1800);
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
