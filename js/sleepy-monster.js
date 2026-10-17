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

  // ---- page
  var CSS = '' +
    '#sm-root{position:fixed;inset:0;z-index:100000;display:flex;flex-direction:column;align-items:center;color:#e6edf7;font-family:inherit;background:radial-gradient(circle at 50% 30%,#14213d 0%,#060911 100%);overflow:hidden}' +
    '#sm-root.awake{background:radial-gradient(circle at 50% 30%,#4a1d2a 0%,#120609 100%)}' +
    '#sm-root .sm-top{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 22px;box-sizing:border-box}' +
    '#sm-root h1{margin:0;font-size:1.5rem;font-weight:900}' +
    '#sm-root .sm-btn{border:0;border-bottom:5px solid var(--b,#1e3a8a);background:var(--c,#38bdf8);color:#06101f;font-weight:900;font-size:1rem;padding:10px 18px;border-radius:14px;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s}' +
    '#sm-root .sm-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
    '#sm-root .sm-stage{position:relative;flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:0}' +
    '#sm-root .sm-mon{width:min(46vh,380px);height:min(46vh,380px);display:flex;align-items:center;justify-content:center;transition:filter .4s,transform .3s}' +
    '#sm-root .sm-mon svg{width:100%;height:100%}' +
    '#sm-root.asleep .sm-mon{filter:brightness(.5) saturate(.7);animation:smBreathe 4s ease-in-out infinite}' +
    '#sm-root.stirring .sm-mon{animation:smStir .5s ease-in-out infinite}' +
    '#sm-root.awake .sm-mon{filter:brightness(1.15) saturate(1.2);animation:smJump .6s var(--spring,cubic-bezier(.175,.885,.32,1.275)) 1}' +
    '@keyframes smBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}' +
    '@keyframes smStir{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-5px) rotate(-1.5deg)}75%{transform:translateX(5px) rotate(1.5deg)}}' +
    '@keyframes smJump{0%{transform:translateY(0)}40%{transform:translateY(-40px) scale(1.1)}100%{transform:translateY(0)}}' +
    '#sm-root .sm-zzz{position:absolute;top:8%;right:calc(50% - 190px);font-size:2.4rem;font-weight:900;color:#93c5fd;animation:smZ 3s ease-in-out infinite}' +
    '@keyframes smZ{0%{opacity:0;transform:translate(0,20px) scale(.7)}30%{opacity:1}100%{opacity:0;transform:translate(30px,-50px) scale(1.2)}}' +
    '#sm-root.awake .sm-zzz,#sm-root.stirring .sm-zzz{display:none}' +
    '#sm-root .sm-msg{font-size:1.5rem;font-weight:900;margin:10px 0 4px;text-align:center}' +
    '#sm-root .sm-sub{color:#9fb0cc;font-size:1rem;text-align:center;min-height:1.4em}' +
    '#sm-root .sm-bar{width:min(560px,86vw);height:30px;border-radius:15px;background:rgba(15,23,42,.8);border:2px solid rgba(255,255,255,.14);overflow:hidden;margin-top:12px}' +
    '#sm-root .sm-fill{height:100%;width:0;background:linear-gradient(90deg,#10b981,#f59e0b 60%,#f43f5e);transition:width .15s}' +
    '#sm-root .sm-live{font-size:.8rem;color:#7c8aa5;margin-top:6px}' +
    '#sm-root .sm-blame{width:100%;box-sizing:border-box;padding:12px 18px 18px;background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.12);max-height:44vh;overflow:auto}' +
    '#sm-root .sm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;margin-top:10px}' +
    '#sm-root .sm-pup{position:relative;border:0;border-bottom:5px solid #0f172a;background:rgba(30,41,59,.9);border-radius:16px;padding:6px 4px 8px;color:#e6edf7;cursor:pointer;font-weight:800;font-size:.85rem;transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s}' +
    '#sm-root .sm-pup:active{transform:translateY(4px);border-bottom-width:1px}' +
    '#sm-root .sm-pup .m{height:74px;display:flex;align-items:center;justify-content:center}' +
    '#sm-root .sm-pup .m svg{height:100%;width:auto}' +
    '#sm-root .sm-pup .n{display:block;line-height:1.15}' +
    '#sm-root .sm-pup .c{position:absolute;top:4px;right:6px;background:#f43f5e;color:#fff;border-radius:10px;padding:1px 7px;font-size:.72rem}' +
    '#sm-root .sm-set{display:flex;gap:14px;align-items:center;color:#9fb0cc;font-size:.85rem}' +
    '#sm-root.awake .sm-mon{width:min(24vh,230px);height:min(24vh,230px)}' +
    '#sm-root.asleep .sm-blame,#sm-root.stirring .sm-blame{display:none}' +
    '#sm-root.awake .sm-bar,#sm-root.awake .sm-live{display:none}' +
    '#sm-root .sm-loud{display:none}' +
    '#sm-root.nomic .sm-loud{display:inline-block}#sm-root.awake .sm-loud{display:none!important}';

  function close() {
    if (!st) return;
    st.alive = false;
    if (st.raf) cancelAnimationFrame(st.raf);
    if (st.stream) { try { st.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* ignore */ } }
    if (st.key) document.removeEventListener('keydown', st.key, true);
    var el = document.getElementById('sm-root'); if (el) el.remove();
    st = null;
  }

  function open() {
    if (st) close();
    var store = S(); if (!store) return;
    var cls = store.getActiveClass && store.getActiveClass();
    var pupils = cls ? store.getStudentsByClass(cls.id) : [];
    if (!document.getElementById('sm-css')) { var s = document.createElement('style'); s.id = 'sm-css'; s.textContent = CSS; document.head.appendChild(s); }
    var el = document.createElement('div'); el.id = 'sm-root'; el.className = 'asleep';
    el.innerHTML = '' +
      '<div class="sm-top"><h1>😴 Sleepy Monster' + (cls ? ' · ' + esc(cls.name || cls.id) : '') + '</h1>' +
      '<div class="sm-set"><label>Sensitivity <input id="sm-sens" type="range" min="10" max="90" value="50"></label>' +
      '<button class="sm-btn" id="sm-close" style="--c:#94a3b8;--b:#475569">✕ Close</button></div></div>' +
      '<div class="sm-stage"><div class="sm-zzz">Z z z</div><div class="sm-mon" id="sm-mon"></div>' +
      '<div class="sm-msg" id="sm-msg">Shhh… let Mio sleep</div><div class="sm-sub" id="sm-sub">Keep the room quiet</div>' +
      '<div class="sm-bar"><div class="sm-fill" id="sm-fill"></div></div>' +
      '<div class="sm-live" id="sm-live">Starting the microphone…</div>' +
      '<button class="sm-btn sm-loud" id="sm-loud" style="--c:#f59e0b;--b:#92400e;margin-top:10px">🔊 Too loud! (or press Space)</button></div>' +
      '<div class="sm-blame" id="sm-blame"></div>';
    document.body.appendChild(el);

    st = { alive: true, wake: 0, level: 0, sens: 50, awake: false, mic: false, loudUntil: 0, pupils: pupils };
    st.mon = monsterSvg('advanced', 'purple', {}, 380);
    document.getElementById('sm-mon').innerHTML = st.mon;
    el.querySelector('#sm-close').onclick = close;
    el.querySelector('#sm-sens').oninput = function () { st.sens = parseInt(this.value, 10) || 50; };
    function loud() { ctx(); st.loudUntil = Date.now() + 700; }
    el.querySelector('#sm-loud').onclick = loud;
    st.key = function (e) { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); loud(); } else if (e.key === 'Escape') { close(); } };
    document.addEventListener('keydown', st.key, true);
    renderBlame();

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
      if (msg) msg.textContent = st.wake > 80 ? 'Mio is waking up!' : stirring ? 'Mio is stirring…' : 'Shhh… let Mio sleep';
      if (sub) sub.textContent = st.wake > 80 ? 'Quiet, quiet, quiet!' : stirring ? 'Too much noise. Whisper, please' : 'Keep the room quiet';
      if (st.wake >= 100) wakeUp();
    }
    st.raf = requestAnimationFrame(tick);
  }

  function wakeUp() {
    st.awake = true; st.wake = 100;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('asleep', 'stirring'); root_.classList.add('awake');
    document.getElementById('sm-msg').textContent = 'Mio woke up! 😠';
    document.getElementById('sm-sub').textContent = 'Who woke the monster? Tap their name';
    sndWake(); renderBlame();
  }

  function sleepAgain() {
    if (!st) return;
    st.awake = false; st.wake = 0; st.level = 0;
    var root_ = document.getElementById('sm-root'); if (!root_) return;
    root_.classList.remove('awake', 'stirring'); root_.classList.add('asleep');
    var m = document.getElementById('sm-mon'); if (m) m.innerHTML = st.mon;
    sndLullaby(); renderBlame();
  }

  function blame(id) {
    var p = S().getStudent(id), t = loadTally(), d = today();
    if (!t[d]) t[d] = {};
    t[d][id] = todayCount(t, id) + 1;
    saveTally(t);
    sndBlame();
    var sub = document.getElementById('sm-sub');
    if (sub) sub.innerHTML = '<b>' + esc(p ? p.name : 'Someone') + '</b> woke Mio (' + t[d][id] + ' today). Now sing him back to sleep!';
    var msg = document.getElementById('sm-msg'); if (msg) msg.textContent = '🤫 Shhh… Lullaby time';
    renderBlame(true);
  }
  function blameAll() {
    var sub = document.getElementById('sm-sub'); if (sub) sub.textContent = 'The whole class woke Mio. Teamwork: whisper him back to sleep!';
    sndBlame(); renderBlame(true);
  }

  function renderBlame(afterBlame) {
    var box = document.getElementById('sm-blame'); if (!box || !st) return;
    var t = loadTally();
    var top = st.pupils.map(function (p) { return { p: p, n: todayCount(t, p.id) }; }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 3);
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><b>' + (afterBlame ? 'Mio is calm again?' : 'Who woke Mio?') + '</b>' +
      '<span style="color:#9fb0cc;font-size:.85rem">' + (top.length ? 'Today: ' + top.map(function (x) { return esc((x.p.name || '').split(' ')[0]) + ' ×' + x.n; }).join(' · ') : 'Nobody has woken Mio yet today') + '</span>' +
      '<span><button class="sm-btn" id="sm-all" style="--c:#a855f7;--b:#581c87">👥 The whole class</button> <button class="sm-btn" id="sm-sleep" style="--c:#10b981;--b:#065f46">🎵 Lullaby: back to sleep</button></span></div>' +
      '<div class="sm-grid">' + st.pupils.map(function (p) {
        var n = todayCount(t, p.id);
        return '<button class="sm-pup" data-id="' + esc(p.id) + '">' + (n ? '<span class="c">' + n + '</span>' : '') + '<span class="m">' + pupilMonster(p, 74) + '</span><span class="n">' + esc(p.name || '') + '</span></button>';
      }).join('') + '</div>';
    [].forEach.call(box.querySelectorAll('.sm-pup'), function (b) { b.onclick = function () { blame(b.getAttribute('data-id')); }; });
    box.querySelector('#sm-sleep').onclick = sleepAgain;
    box.querySelector('#sm-all').onclick = blameAll;
  }

  root.SleepyMonster = { open: open, close: close };
  root.openSleepyMonster = open;
})(typeof window !== 'undefined' ? window : this);
