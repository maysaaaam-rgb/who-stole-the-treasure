/* Karaoke Stage: pupils come to the board one by one and read the lines on the screen.
   The model voice reads first with a bouncing ball, then the ball follows the pupil at a slow, steady pace,
   and the teacher gives 1, 2 or 3 stars. With 👂 Ears on (the teacher's choice), voice recognition moves the ball with the pupil's voice
   and suggests a star. No audio is saved.
   Names come from the platform's class list on this device (first names only). Results stay on this device. */
(function () {
  'use strict';
  var A = window.KaraokeAudio, D = window.KaraokeData;
  var stage = document.getElementById('stage'), fx = document.getElementById('fx'), totEl = document.getElementById('tot');
  var LOG_KEY = 'eaa_karaoke_log_v1', PREF_KEY = 'eaa_karaoke_prefs_v1';
  var STAR_TXT = { 1: 'Brave try!', 2: 'Clear voice!', 3: 'Super reader!' };
  var SPEEDS = [['🐢', 'Slow', 430], ['🚶', 'Steady', 330], ['🐇', 'Quick', 250]];

  var prefs = load(PREF_KEY, { speed: 0, order: 'random', same: false, ear: false, earOk: false });
  var S = null;   // the current round

  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : Object.assign({}, d, v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window: fine */ } }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // first name only (a double first name like "Emir Ali" stays whole)
  function first(s) { var n = String(s.firstName || '').trim() || String(s.name || '').trim().split(/\s+/)[0]; return n || 'Reader'; }
  // two pupils with the same first name get the first letter of the family name: Emir B., Emir E.
  function dedupe(kids) {
    var cnt = {}; kids.forEach(function (k) { cnt[k.name] = (cnt[k.name] || 0) + 1; });
    kids.forEach(function (k) { if (cnt[k.name] > 1 && k.last) k.name += ' ' + k.last.charAt(0).toLocaleUpperCase('tr') + '.'; });
    return kids;
  }
  function lastOf(s) { var l = String(s.lastName || '').trim(); if (l) return l; var p = String(s.name || '').trim().split(/\s+/); return p.length > 1 ? p[p.length - 1] : ''; }

  /* ---------- class lists ---------- */
  // the class the Class Board sent (same names and monsters as the board, away pupils marked)
  function handoff() { try { var h = JSON.parse(sessionStorage.getItem('eaa_karaoke_roster') || 'null'); return h && Array.isArray(h.kids) ? h : null; } catch (e) { return null; } }
  function imgPath(u) { u = String(u || ''); return !u ? '' : /^(data:|https?:|blob:|\/)/.test(u) ? u : '../' + u; }
  function boardAway(id) { var h = handoff(); if (h && h.cls === id && h.away) return Object.assign({}, h.away); try { return JSON.parse(sessionStorage.getItem('eaa_board_absent_' + id) || '{}') || {}; } catch (e) { return {}; } }
  function gradeOf(t) { return parseInt(String(t || '').replace(/\D/g, '').charAt(0), 10) || 0; }

  function rosters() {
    var out = [], h = handoff();
    try {
      var st = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null');
      if (st && Array.isArray(st.classes) && Array.isArray(st.students)) {
        st.classes.filter(function (c) { return c && !c.archived && !/store-sync/.test(c.id); }).forEach(function (c) {
          // names exactly as the Class Board shows them
          var kids = st.students.filter(function (s) { return s && !s.archived && s.classId === c.id; }).map(function (s) { return { id: s.id, name: String(s.firstName || s.name || 'Student').trim(), last: lastOf(s) }; });
          dedupe(kids);
          if (kids.length) out.push({ id: c.id, label: String(c.name || c.id).replace(/^Grade\s*/i, ''), grade: gradeOf(c.grade || c.name), kids: kids.sort(byName) });
        });
      }
    } catch (e) { /* no platform data on this device */ }
    if (h) {
      var mine = { id: h.cls, label: String(h.label || h.cls).replace(/^Grade\s*/i, ''), grade: gradeOf(h.grade || h.label), kids: h.kids.map(function (k) { return { id: k.id, name: String(k.name || 'Student'), img: imgPath(k.img) }; }).sort(byName) };
      out = out.filter(function (c) { return c.id !== h.cls; }).concat([mine]);
    }
    if (!out.length && window.PARTY && window.PARTY.classes) {
      Object.keys(window.PARTY.classes).forEach(function (k) {
        var c = window.PARTY.classes[k];
        out.push({ id: 'alice-' + k, label: k.toUpperCase(), grade: parseInt(k, 10) || 4, kids: (c.students || []).map(function (s) { return { id: s.id, name: String(s.name || 'Reader') }; }).sort(byName) });
      });
    }
    out.sort(function (a, b) { return a.label.localeCompare(b.label); });
    return out;
  }
  function byName(a, b) { return a.name.localeCompare(b.name, 'tr'); }

  /* ---------- 1. set up the round ---------- */
  var setup = { cls: null, away: {}, pack: null };
  (function () { var q = /[?&]cls=([^&]+)/.exec(location.search); if (q) { setup.cls = decodeURIComponent(q[1]); setup.away = boardAway(setup.cls); } })();
  function renderSetup() {
    A.stop(); totEl.hidden = true;
    var R = rosters();
    if ((!setup.cls || (setup.cls !== 'teams' && !R.some(function (c) { return c.id === setup.cls; }))) && R.length) { setup.cls = R[0].id; setup.away = boardAway(setup.cls); }
    var cls = R.filter(function (c) { return c.id === setup.cls; })[0] || null, grade = cls ? cls.grade : 0;
    var packs = D.packs.slice().sort(function (a, b) { return (b.grade === grade) - (a.grade === grade); });
    if (!setup.pack || !packs.some(function (p) { return p.id === setup.pack; })) setup.pack = (packs[0] || {}).id;
    stage.innerHTML =
      '<div class="setup">' +
        '<div class="panel"><h2>1. Who is reading?</h2><div class="chips">' +
          R.map(function (c) { return '<button type="button" class="btn small ' + (c.id === setup.cls ? 'cyan' : 'ghost') + '" data-cls="' + esc(c.id) + '">' + esc(c.label) + '</button>'; }).join('') +
          '<button type="button" class="btn small ' + (setup.cls === 'teams' ? 'cyan' : 'ghost') + '" data-cls="teams">🦊🦉🐻🐇 Teams</button>' +
        '</div>' +
        (cls ? '<p class="hint">Tap a name if the pupil is away today.</p><div class="kids">' + cls.kids.map(function (k) {
          return '<button type="button" class="kid ' + (setup.away[k.id] ? 'away' : '') + '" data-kid="' + esc(k.id) + '">' + (setup.away[k.id] ? '💤 ' : '') + esc(k.name) + '</button>'; }).join('') + '</div>' +
          '<p class="hint"><b>' + cls.kids.filter(function (k) { return !setup.away[k.id]; }).length + '</b> readers today</p>'
        : setup.cls === 'teams' ? '<p class="hint">Each team sends one reader to the board. Teams take turns: Foxes, Owls, Bears, Hares.</p>'
        : '<p class="hint">No class list on this device yet. Open the platform once, or use Teams.</p>') +
        '</div>' +
        '<div class="panel"><h2>2. What do we read?</h2><div class="packs">' + packs.map(function (p) {
          return '<button type="button" class="pack ' + (p.id === setup.pack ? 'on' : '') + '" data-pack="' + p.id + '"><span class="pe">' + p.e + '</span><b>' + esc(p.title) + '</b><small>Grade ' + p.grade + ' · ' + p.cards.length + ' cards</small><small>' + esc(p.note) + '</small></button>';
        }).join('') + '</div>' +
        '<h2 style="margin-top:1.6vh">3. How?</h2><div class="chips">' +
          '<button type="button" class="btn small ' + (prefs.order === 'random' ? 'violet' : 'ghost') + '" data-order="random">🎲 Random order</button>' +
          '<button type="button" class="btn small ' + (prefs.order === 'abc' ? 'violet' : 'ghost') + '" data-order="abc">🔤 A to Z</button>' +
          '<button type="button" class="btn small ' + (!prefs.same ? 'violet' : 'ghost') + '" data-same="0">➡️ Next card each reader</button>' +
          '<button type="button" class="btn small ' + (prefs.same ? 'violet' : 'ghost') + '" data-same="1">🔁 Same card until I change it</button>' +
        '</div></div>' +
        '<div class="go-row"><button type="button" class="btn green big" id="start">🎤 Start the show</button></div>' +
      '</div>';
    stage.querySelectorAll('[data-cls]').forEach(function (b) { b.onclick = function () { A.play('tap'); setup.cls = b.dataset.cls; setup.away = boardAway(setup.cls); renderSetup(); }; });
    stage.querySelectorAll('[data-kid]').forEach(function (b) { b.onclick = function () { A.play('tap'); setup.away[b.dataset.kid] = !setup.away[b.dataset.kid]; renderSetup(); }; });
    stage.querySelectorAll('[data-pack]').forEach(function (b) { b.onclick = function () { A.play('tap'); setup.pack = b.dataset.pack; renderSetup(); }; });
    stage.querySelectorAll('[data-order]').forEach(function (b) { b.onclick = function () { prefs.order = b.dataset.order; save(PREF_KEY, prefs); renderSetup(); }; });
    stage.querySelectorAll('[data-same]').forEach(function (b) { b.onclick = function () { prefs.same = b.dataset.same === '1'; save(PREF_KEY, prefs); renderSetup(); }; });
    document.getElementById('start').onclick = function () { startRound(cls); };
  }

  function startRound(cls) {
    var pack = D.packs.filter(function (p) { return p.id === setup.pack; })[0]; if (!pack) return;
    var readers;
    if (setup.cls === 'teams' || !cls) readers = [['🦊', 'Foxes'], ['🦉', 'Owls'], ['🐻', 'Bears'], ['🐇', 'Hares']].map(function (t, i) { return { id: 'team' + i, name: t[1], e: t[0], team: true }; });
    else {
      readers = cls.kids.filter(function (k) { return !setup.away[k.id]; }).map(function (k) { return { id: k.id, name: k.name, img: k.img || '' }; });
      if (prefs.order === 'random') readers = shuffle(readers);
    }
    if (!readers.length) return;
    S = { pack: pack, cls: cls ? cls.label : 'Teams', teams: !cls || setup.cls === 'teams', queue: readers, done: [], ri: 0, ci: 0, hide: 0, total: 0, round: 1 };
    document.getElementById('h-sub').textContent = (cls && !S.teams ? cls.label + ' · ' : '') + pack.title;
    totEl.hidden = false; setTot();
    spotlight();
  }

  /* ---------- 2. the stage ---------- */
  function reader() { return S.queue[S.ri] || null; }
  function cardFor(r) {
    var p = S.pack;
    if (p.roleOf && r && !r.team) { var mine = p.roleOf(r.name); if (mine) { var c = p.cards.filter(function (x) { return x.key === mine.role; })[0]; if (c) return Object.assign({}, c, { img: mine.img || c.img }); } }
    return p.cards[S.ci % p.cards.length];
  }
  function setTot() { totEl.querySelector('span').textContent = S.total; totEl.classList.remove('bump'); void totEl.offsetWidth; totEl.classList.add('bump'); }

  // a short drum roll over the names, then the spotlight lands on the reader
  function spotlight() {
    A.stop(); Ear.stop(true);
    var r = reader(); if (!r) return finish();
    S.hide = S.pack.hideStart ? 1 : 0;
    var names = S.queue.map(function (x) { return x.name; }), n = 0;
    stage.innerHTML = '<div class="roll"><div class="mic">🎤</div><div class="rname" id="rn"></div><p class="hint">Next reader…</p></div>';
    var rn = document.getElementById('rn'); A.play('drum');
    var spins = Math.min(9, names.length > 1 ? 9 : 0), iv = setInterval(function () {
      if (n++ >= spins) { clearInterval(iv); rn.innerHTML = (r.img ? '<img class="mon" src="' + esc(r.img) + '" alt="" onerror="this.remove()">' : '') + esc((r.e ? r.e + ' ' : '') + r.name); rn.classList.add('land'); A.play('spot'); setTimeout(renderStage, 900); return; }
      rn.textContent = names[Math.floor(Math.random() * names.length)];
    }, 85);
    S.spinIv = iv;
  }

  var W = [];   // word elements by line
  var pos = null, mode = '', autoT = 0;
  function renderStage() {
    Ear.reset();
    var r = reader(), c = cardFor(r), next = S.queue[S.ri + 1];
    var lines = c.lines.map(function (l) { return String(l).split(/\s+/).filter(Boolean); });
    stage.innerHTML =
      '<div class="ks">' +
        '<aside class="side">' +
          '<div class="who">' + (r.img ? '<img class="mon" src="' + esc(r.img) + '" alt="" onerror="this.remove()">' : '') + '<div class="tag">🎤 Now reading</div><div class="big">' + (r.e ? r.e + ' ' : '') + esc(r.name) + '</div>' +
            (S.pack.roleOf && !r.team ? '<div class="role">' + esc(c.title || '') + '</div>' : '') + '</div>' +
          '<div class="up">' + (next ? 'Then: <b>' + esc(next.name) + '</b>' : '<b>Last reader!</b>') + '</div>' +
          '<div class="prog"><i style="width:' + Math.round(S.ri / S.queue.length * 100) + '%"></i></div>' +
          '<div class="cnt">' + (S.ri + 1) + ' / ' + S.queue.length + (S.round > 1 ? ' · round ' + S.round : '') + '</div>' +
          '<div class="sidebtns">' +
            '<button type="button" class="btn small ghost" id="later" title="This reader goes to the end of the line">⏭ Later</button>' +
            '<button type="button" class="btn small ghost" id="awayb" title="Not today">💤 Away</button>' +
            '<button type="button" class="btn small ghost" id="cardb" title="Show another card">🔄 Card</button>' +
            '<button type="button" class="btn small coral" id="fin">🏁 Finish</button>' +
          '</div>' +
        '</aside>' +
        '<div class="mainc">' +
          '<div class="card">' +
            '<div class="pic">' + (c.img ? '<img src="' + esc(c.img) + '" alt="" onerror="this.remove()">' : '') + (c.e && !c.img ? '<span class="pe">' + esc(c.e) + '</span>' : '') + '<div class="ped"></div></div>' +
            '<div class="lyrics" id="lyr">' + (c.title && !S.pack.roleOf ? '<div class="ctitle">' + esc(c.title) + '</div>' : '') +
              lines.map(function (ws, li) { return '<div class="ln">' + ws.map(function (w, wi) { return '<span class="w" data-l="' + li + '" data-i="' + wi + '">' + esc(w) + '</span>'; }).join(' ') + '</div>'; }).join('') +
              '<div class="ball" id="ball"></div>' +
              (c.answer ? '<button type="button" class="btn small amber ans" id="ans">❓ What is it?</button>' : '') +
            '</div>' +
          '</div>' +
          '<div class="ctrl">' +
            '<button type="button" class="btn cyan" id="lis" title="L">🔊 Listen</button>' +
            '<button type="button" class="btn green big" id="go" title="Enter">🎤 Your turn!</button>' +
            '<button type="button" class="btn ghost" id="spd" title="Speed of the ball">' + SPEEDS[prefs.speed][0] + ' ' + SPEEDS[prefs.speed][1] + '</button>' +
            '<button type="button" class="btn violet" id="hid" title="H">' + ['🙈 Hide words', '🙈 Hide more', '👀 Show all'][S.hide] + '</button>' +
            '<button type="button" class="btn ' + (Ear.on() ? 'amber' : 'ghost') + '" id="earb" title="Voice recognition on / off">' + (Ear.on() ? '👂 Ears on' : '👂 Ears off') + '</button>' +
          '</div>' +
          '<div class="earbox" id="earbox"' + (Ear.on() ? '' : ' hidden') + '><span class="lvl"><i id="lvl"></i></span><span id="earmsg">Press 🎤 Your turn! and read. The ball follows your voice.</span></div>' +
          '<div class="judge" id="judge"><span class="q">How did ' + esc(r.name) + ' read?</span>' +
            [1, 2, 3].map(function (n) { return '<button type="button" class="btn star s' + n + '" data-star="' + n + '" title="' + n + '">' + '⭐'.repeat(n) + '<small>' + STAR_TXT[n] + '</small></button>'; }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
    W = lines.map(function (ws, li) { return Array.prototype.slice.call(stage.querySelectorAll('.w[data-l="' + li + '"]')); });
    pos = null; mode = ''; applyHide(); fitLyrics();
    stage.querySelectorAll('.w').forEach(function (el) { el.onclick = function () { stopAuto(); A.stop(); mode = 'kid'; light(+el.dataset.l, +el.dataset.i); }; });
    $('lis').onclick = listen; $('go').onclick = go;
    $('spd').onclick = function () { prefs.speed = (prefs.speed + 1) % SPEEDS.length; save(PREF_KEY, prefs); this.textContent = SPEEDS[prefs.speed][0] + ' ' + SPEEDS[prefs.speed][1]; A.play('tap'); };
    $('hid').onclick = function () { S.hide = (S.hide + 1) % 3; this.textContent = ['🙈 Hide words', '🙈 Hide more', '👀 Show all'][S.hide]; applyHide(); A.play('tap'); };
    $('later').onclick = function () { var x = S.queue.splice(S.ri, 1)[0]; S.queue.push(x); spotlight(); };
    $('awayb').onclick = function () { S.queue.splice(S.ri, 1); spotlight(); };
    $('cardb').onclick = function () { S.ci++; renderStage(); A.play('tap'); };
    $('fin').onclick = finish;
    $('earb').onclick = function () { Ear.toggle(); };
    if ($('ans')) $('ans').onclick = function () { this.outerHTML = '<div class="reveal">' + esc(c.answer) + '</div>'; A.play('star2'); };
    stage.querySelectorAll('[data-star]').forEach(function (b) { b.onclick = function () { give(+b.dataset.star); }; });
    requestAnimationFrame(function () { light(0, 0, true); });
  }
  function $(id) { return document.getElementById(id); }
  // long story parts: make the words smaller until they fit inside the card
  function fitLyrics() {
    var box = $('lyr'), card = box && box.parentNode; if (!box) return;
    var f = 1; box.style.fontSize = '1em';
    while (f > 0.45 && (box.scrollHeight > card.clientHeight - 16 || box.scrollWidth > box.clientWidth + 2)) { f -= 0.05; box.style.fontSize = f + 'em'; }
  }

  // hide some words (every third longer word), or all of them except the first word
  function applyHide() {
    var k = 0;
    W.forEach(function (ws) { ws.forEach(function (el, i) {
      var t = el.textContent.replace(/[^A-Za-z]/g, ''), h = S.hide === 2 ? !(k === 0) : S.hide === 1 ? (t.length > 2 && k % 3 === 1) : false;
      el.classList.toggle('hid', h); k++;
    }); });
  }

  // light one word: earlier words done, this word big, the ball jumps on top of it
  function light(li, wi, quiet) {
    pos = { l: li, i: wi };
    W.forEach(function (ws, L) { ws.forEach(function (el, I) {
      var before = L < li || (L === li && I < wi), now = L === li && I === wi;
      el.classList.toggle('done', !quiet && before); el.classList.toggle('now', !quiet && now);
      el.classList.toggle('model', mode === 'model'); el.classList.toggle('peek', !quiet && now && mode === 'model');
    }); });
    var el = W[li] && W[li][wi], ball = $('ball'), box = $('lyr'); if (!el || !ball || !box) return;
    var r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
    ball.style.left = (r.left - b.left + r.width / 2) + 'px'; ball.style.top = (r.top - b.top) + 'px';
    ball.classList.toggle('show', !quiet); ball.classList.toggle('kid', mode === 'kid');
    ball.classList.remove('hop'); void ball.offsetWidth; if (!quiet) ball.classList.add('hop');
  }
  function words() { return W.map(function (ws) { return ws.map(function (el) { return el.textContent; }); }); }

  function listen() {
    stopAuto(); mode = 'model'; A.play('tap');
    A.karaoke(words(), function (l, i) { light(l, i); }, function () { mode = ''; W.forEach(function (ws) { ws.forEach(function (el) { el.classList.remove('now', 'done', 'model', 'peek'); }); }); var b = $('ball'); if (b) b.classList.remove('show'); });
  }
  // the ball moves along at the chosen speed; Space or a tap on a word moves it by hand
  function go() {
    if (Ear.on()) { Ear.toggleListen(); return; }
    A.stop(); stopAuto(); mode = 'kid'; A.play('spot');
    var w = W.map(function (ws) { return A.weights(ws.map(function (el) { return el.textContent; })); }), L = 0, I = 0, ms = SPEEDS[prefs.speed][2];
    $('go').classList.add('live');
    function step() {
      if (L >= W.length) { stopAuto(); allDone(); return; }
      light(L, I);
      var wait = Math.max(450, w[L][I] * ms) + (I === W[L].length - 1 ? 500 : 0);
      I++; if (I >= W[L].length) { L++; I = 0; }
      autoT = setTimeout(step, wait);
    }
    autoT = setTimeout(step, 700);
  }
  function stopAuto() { clearTimeout(autoT); autoT = 0; var g = $('go'); if (g) g.classList.remove('live'); }
  function stepByHand() {
    if (Ear.live()) return;
    stopAuto(); A.stop(); mode = 'kid';
    if (!pos || !$('ball').classList.contains('show')) { light(0, 0); return; }
    var L = pos.l, I = pos.i + 1; if (I >= W[L].length) { L++; I = 0; }
    if (L >= W.length) { allDone(); return; }
    light(L, I); A.play('tick');
  }
  function allDone() {
    W.forEach(function (ws) { ws.forEach(function (el) { el.classList.add('done'); el.classList.remove('now'); }); });
    var b = $('ball'); if (b) b.classList.remove('show');
    var j = $('judge'); if (j) { j.classList.remove('ask'); void j.offsetWidth; j.classList.add('ask'); }
  }

  /* ---------- ears: voice recognition (the teacher turns it on) ----------
     Chrome and Edge only. When the browser has English on this computer, the voice never leaves the computer.
     Otherwise the browser's online speech service turns the voice into words (Chrome: Google) and it needs internet.
     This page saves no audio. Young learners' voices can be missed, so the computer only suggests a star: the teacher decides. */
  var Ear = (function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = null, live = false, E = [], fixed = [], lastPct = null, gotAny = false, local = 'unknown', doneIdx = {};
    var maxT = 0, quietT = 0, endT = 0, stream = null, mac = null, raf = 0;
    var NUM = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10' };

    function checkLocal(cb) {
      local = 'unavailable';
      if (!SR || !SR.available) { if (cb) cb(); return; }
      try { SR.available({ langs: ['en-US'], processLocally: true }).then(function (st) { local = st; if (cb) cb(); }, function () { if (cb) cb(); }); } catch (e) { if (cb) cb(); }
    }
    checkLocal();

    function key(w) { var k = String(w).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]/g, ''); return NUM[k] || k; }
    function lev(a, b) {
      var m = a.length, n = b.length, d = [], i, j; for (i = 0; i <= m; i++) d[i] = [i]; for (j = 0; j <= n; j++) d[0][j] = j;
      for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      return d[m][n];
    }
    // close enough: short words must be exact, longer words may have one (or two) letters different
    function same(a, b) { if (!a || !b) return false; if (a === b) return true; var L = Math.max(a.length, b.length); if (L <= 3) return false; return lev(a, b) <= (L >= 7 ? 2 : 1); }
    function nextIdx(got) { for (var j = got.length - 1; j >= 0; j--) if (got[j]) return j + 1; return 0; }
    // walk through what was heard and tick the expected words in order (a pupil may skip or repeat a word)
    function align(text, got, from) {
      var p = from;
      String(text).split(/\s+/).map(key).forEach(function (h) {
        if (!h) return;
        for (var j = p; j < E.length; j++) {
          if (j >= p + 4 && h.length < 5) break;
          if (!got[j] && same(E[j].key, h)) { got[j] = true; p = j + 1; break; }
        }
      });
    }
    function paint(got, end) {
      var nx = nextIdx(got);
      E.forEach(function (x, j) { x.el.classList.toggle('heard', !!got[j]); x.el.classList.toggle('miss', !got[j] && (end || j < nx)); });
      if (!end && E.length) { var x = E[Math.min(nx, E.length - 1)]; light(x.l, x.i); }
    }
    function msg(t) { var m = $('earmsg'); if (m) m.innerHTML = t; }

    function onResult(e) {
      gotAny = true; clearTimeout(quietT);
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        if (r.isFinal) {
          if (doneIdx[i]) continue; doneIdx[i] = true;
          var p0 = nextIdx(fixed);
          for (var a = 0; a < r.length; a++) align(r[a].transcript, fixed, p0);
        } else interim += ' ' + r[0].transcript;
      }
      var tmp = fixed.slice(); if (interim) align(interim, tmp, nextIdx(fixed));
      paint(tmp);
      var said = [], k; for (k = 0; k < e.results.length; k++) said.push(e.results[k][0].transcript);
      msg('👂 I hear: <i>' + esc(said.join(' ').trim().slice(-90)) + '</i>');
      if (fixed.every(Boolean)) { stopListen(); return; }
      quietT = setTimeout(stopListen, 4000);   // four quiet seconds after speaking: the reader has finished
    }
    function onError(e) {
      var t = {
        'no-speech': '🤔 I can’t hear anyone. Speak louder, or check the microphone.',
        'audio-capture': '🎙️ No microphone found. Plug in the microphone and try again.',
        'not-allowed': '🔒 The microphone is blocked. Click the lock next to the address and allow the microphone.',
        'service-not-allowed': '🔒 The microphone is blocked. Click the lock next to the address and allow the microphone.',
        'network': '🌐 Voice recognition needs the internet on this computer.',
        'language-not-supported': '🌐 This browser cannot listen to English here. Use Chrome or Edge.'
      }[e.error];
      if (t) msg(t);
    }

    function start() {
      if (live) return;
      A.stop(); stopAuto(); mode = 'kid';
      E = []; W.forEach(function (ws) { ws.forEach(function (el) { E.push({ el: el, key: key(el.textContent), l: +el.dataset.l, i: +el.dataset.i }); el.classList.remove('heard', 'miss', 'done', 'now'); }); });
      fixed = E.map(function () { return false; }); gotAny = false; lastPct = null; doneIdx = {};
      stage.querySelectorAll('.star.sug').forEach(function (b) { b.classList.remove('sug'); });
      try {
        rec = new SR(); rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 3;
        if (local === 'available') { try { rec.processLocally = true; } catch (e) { /* older browser */ } }
        rec.onresult = onResult; rec.onerror = onError; rec.onend = function () { if (live) finish(); };
        rec.start();
      } catch (e) { msg('🤔 Voice recognition could not start. Use Chrome or Edge.'); rec = null; return; }
      live = true; A.play('tap');
      var g = $('go'); if (g) { g.textContent = '🛑 Stop'; g.classList.add('live'); }
      light(0, 0); msg('👂 Listening… read now!');
      meterOn();
      maxT = setTimeout(stopListen, Math.min(45000, 8000 + E.length * 1500));
    }
    function stopListen() {
      if (!live) return;
      try { rec.stop(); } catch (e) { finish(); return; }
      endT = setTimeout(function () { if (live) finish(); }, 1500);   // the last words arrive just after stop
    }
    function clear() {
      live = false; clearTimeout(maxT); clearTimeout(quietT); clearTimeout(endT); meterOff();
      if (rec) { rec.onend = null; rec.onresult = null; rec.onerror = null; try { rec.abort(); } catch (e) { /* already stopped */ } rec = null; }
      var g = $('go'); if (g) { g.textContent = '🎤 Your turn!'; g.classList.remove('live'); }
    }
    function finish() {
      clear();
      var b = $('ball'); if (b) b.classList.remove('show');
      E.forEach(function (x) { x.el.classList.remove('now'); });
      if (!gotAny) { lastPct = null; msg('🤔 I didn’t hear anything. Check the microphone, or give the stars yourself.'); return; }
      var n = fixed.filter(Boolean).length; lastPct = E.length ? Math.round(n * 100 / E.length) : 0;
      paint(fixed, true);
      var sug = lastPct >= 85 ? 3 : lastPct >= 50 ? 2 : 1, sb = stage.querySelector('.star.s' + sug);
      if (sb) sb.classList.add('sug');
      msg('👂 I heard <b>' + n + ' of ' + E.length + '</b> words. My idea: ' + '⭐'.repeat(sug) + '. You decide!');
      A.play(n === E.length ? 'star2' : 'soft');
      var j = $('judge'); if (j) { j.classList.remove('ask'); void j.offsetWidth; j.classList.add('ask'); }
    }

    // a live volume bar, so pupils see their big voice
    function meterOn() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        if (!live) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        stream = s; var AC = window.AudioContext || window.webkitAudioContext; mac = new AC();
        var an = mac.createAnalyser(); an.fftSize = 512; mac.createMediaStreamSource(s).connect(an);
        var buf = new Uint8Array(an.fftSize);
        (function loop() {
          an.getByteTimeDomainData(buf); var sum = 0; for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
          var lv = Math.min(100, Math.round(Math.sqrt(sum / buf.length) * 420)), el = $('lvl');
          if (el) el.style.width = lv + '%';
          raf = requestAnimationFrame(loop);
        })();
      }, function () { /* the recognition message explains a blocked microphone */ });
    }
    function meterOff() {
      cancelAnimationFrame(raf);
      if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
      if (mac) { try { mac.close(); } catch (e) { /* ignore */ } mac = null; }
      var el = $('lvl'); if (el) el.style.width = '0%';
    }

    // first time: tell the teacher how it works before the microphone is used
    function info() {
      checkLocal(function () {
        var where = local === 'available' ? '<p>✅ This computer understands English <b>by itself</b>. The pupils’ voices stay on this computer.</p>'
          : local === 'downloadable' || local === 'downloading' ? '<p>⬇️ Chrome can understand English <b>on this computer</b> after a one-time download. Then the voices stay here and no internet is needed.</p><p><button type="button" class="btn small cyan" id="ear-dl">⬇️ Get offline English</button> <span id="ear-dls"></span></p><p>Until then, Chrome sends the voice to Google’s online speech service to turn it into words (it needs internet).</p>'
          : '<p>🌐 Your browser sends the voice to its online speech service (Chrome: Google, Edge: Microsoft) to turn it into words. It needs internet.</p>';
        var ov = document.createElement('div'); ov.className = 'earinfo';
        ov.innerHTML = '<div class="box"><h2>👂 Ears: the computer listens</h2>' + where +
          '<p>This page keeps <b>no recordings</b>. Words that were heard turn green, missed words turn orange.</p>' +
          '<p>The computer can miss names and young voices. It only <b>suggests</b> a star. You decide.</p>' +
          '<p>🎙️ It uses the computer’s <b>default microphone</b>. Plug in your class microphone and choose it in Windows sound settings (Input).</p>' +
          '<div class="chips center"><button type="button" class="btn green" id="ear-yes">👂 Turn on ears</button><button type="button" class="btn ghost" id="ear-no">Not now</button></div></div>';
        stage.appendChild(ov);
        $('ear-yes').onclick = function () { prefs.ear = true; prefs.earOk = true; save(PREF_KEY, prefs); ov.remove(); renderStage(); };
        $('ear-no').onclick = function () { ov.remove(); };
        if ($('ear-dl')) $('ear-dl').onclick = function () {
          var st = $('ear-dls'); st.textContent = 'Downloading…'; this.disabled = true;
          try {
            SR.install({ langs: ['en-US'], processLocally: true }).then(function (ok) { checkLocal(); st.textContent = ok ? '✅ Ready. Voices now stay on this computer.' : 'Not possible on this computer. The online service will be used.'; },
              function () { st.textContent = 'Not possible on this computer. The online service will be used.'; });
          } catch (e) { st.textContent = 'Not possible on this computer. The online service will be used.'; }
        };
      });
    }

    return {
      on: function () { return !!SR && !!prefs.ear; },
      live: function () { return live; },
      toggle: function () {
        if (!SR) { alert('Voice recognition works in Chrome or Edge.'); return; }
        if (!prefs.ear && !prefs.earOk) { info(); return; }
        clear(); prefs.ear = !prefs.ear; save(PREF_KEY, prefs); renderStage();
      },
      toggleListen: function () { if (live) stopListen(); else start(); },
      stop: function () { if (live) { if (gotAny) lastPct = Math.round(fixed.filter(Boolean).length * 100 / Math.max(1, E.length)); clear(); } },
      result: function () { return lastPct; },
      reset: function () { clear(); lastPct = null; }
    };
  })();

  /* ---------- stars ---------- */
  function give(n) {
    var r = reader(); if (!r || S.giving) return; S.giving = true;
    stopAuto(); A.stop(); Ear.stop(true);
    var c = cardFor(r);
    S.done.push({ id: r.id, name: r.name, e: r.e || '', img: r.img || '', stars: n, line: c.lines[0], heard: Ear.result() });
    S.total += n; setTot();
    A.play('star' + n); if (n === 3) setTimeout(function () { A.play('applause'); }, 350);
    burst(n);
    var ov = document.createElement('div'); ov.className = 'praise p' + n;
    ov.innerHTML = '<div class="st">' + '⭐'.repeat(n) + '</div><div class="pt">' + STAR_TXT[n] + '</div><div class="pn">' + esc(r.name) + '</div>';
    stage.appendChild(ov);
    setTimeout(function () {
      S.giving = false; S.ri++; if (!prefs.same) S.ci++;
      if (S.ri >= S.queue.length) finish(); else spotlight();
    }, 2300);
  }
  function burst(n) {
    var cols = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#fde047'], count = [0, 14, 30, 70][n];
    for (var i = 0; i < count; i++) {
      var p = document.createElement('i'); p.className = n === 3 ? 'cf' : 'sp';
      p.style.left = (n === 3 ? Math.random() * 100 : 35 + Math.random() * 30) + 'vw';
      p.style.background = cols[i % cols.length]; p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw');
      fx.appendChild(p); setTimeout(function (el) { el.remove(); }.bind(null, p), 3200);
    }
  }

  /* ---------- 3. the end: everybody's stars ---------- */
  function finish() {
    A.stop(); stopAuto(); Ear.stop(true); if (S.spinIv) clearInterval(S.spinIv);
    var notYet = S.queue.slice(S.ri).filter(function (q) { return !S.done.some(function (d) { return d.id === q.id; }); });
    var log = load(LOG_KEY, { rounds: [] });
    if (S.done.length) { log.rounds = (log.rounds || []).concat([{ at: Date.now(), cls: S.cls, pack: S.pack.title, done: S.done }]).slice(-40); save(LOG_KEY, log); }
    var three = S.done.filter(function (d) { return d.stars === 3; }).length;
    A.play('fanfare'); burst(3);
    stage.innerHTML =
      '<div class="endb">' +
        '<div class="trophy">🎤</div><h2>What a show!</h2>' +
        '<div class="score">⭐ ' + S.total + ' stars · ' + S.done.length + ' readers' + (three ? ' · ' + three + (three === 1 ? ' super reader' : ' super readers') : '') + '</div>' +
        '<div class="board">' + S.done.map(function (d) { return '<div class="row s' + d.stars + '"><b>' + (d.e ? d.e + ' ' : '') + esc(d.name) + '</b><span>' + (d.heard != null ? '<em>👂 ' + d.heard + '%</em> ' : '') + '⭐'.repeat(d.stars) + '</span></div>'; }).join('') + '</div>' +
        (notYet.length ? '<p class="hint">Not read yet: ' + notYet.map(function (q) { return esc(q.name); }).join(', ') + '</p>' : '') +
        (!S.teams && S.done.length ? '<p class="hint">Teacher: give XP on the Class Board if you like: ⭐⭐⭐ +15 · ⭐⭐ +10 · ⭐ +5</p>' : '') +
        '<div class="chips center">' +
          (notYet.length ? '<button type="button" class="btn cyan" id="more">▶ Go on with the others</button>' : '') +
          '<button type="button" class="btn violet" id="again">🔁 Another round, new cards</button>' +
          '<button type="button" class="btn ghost" id="setupb">⚙️ Change class or cards</button>' +
        '</div>' +
      '</div>';
    if ($('more')) $('more').onclick = function () { spotlight(); };
    $('again').onclick = function () {
      var all = S.done.map(function (d) { return { id: d.id, name: d.name, e: d.e, img: d.img, team: S.teams }; }).concat(notYet);
      S.queue = prefs.order === 'random' && !S.teams ? shuffle(all) : all; S.ri = 0; S.done = []; S.ci += 1; S.round++; spotlight();
    };
    $('setupb').onclick = renderSetup;
  }

  /* ---------- keys, sound, full screen ---------- */
  document.addEventListener('keydown', function (e) {
    if (!S || !$('judge') || e.target.tagName === 'INPUT') return;
    var k = e.key;
    if (k === ' ') { e.preventDefault(); stepByHand(); }
    else if (k === 'Enter') { e.preventDefault(); go(); }
    else if (k === 'l' || k === 'L') listen();
    else if (k === 'h' || k === 'H') $('hid').click();
    else if (k === '1' || k === '2' || k === '3') give(+k);
  });
  $('snd').onclick = function () { A.setOn(!A.isOn()); this.textContent = A.isOn() ? '🔊' : '🔇'; };
  $('fs').onclick = function () { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { /* not allowed */ } };
  window.addEventListener('resize', function () { fitLyrics(); if (pos && $('ball') && $('ball').classList.contains('show')) light(pos.l, pos.i); });

  renderSetup();
})();
