/* Alice Tea Party: the pupils' page. One link for the class (pick your name) or one personal link (?s=<pupil id>).
   The personal page shows "Get ready in 4 steps", the pupil's part (chat bubbles, own lines with a star, or the guest job) and the props.
   Each step the pupil does is reported to the teacher's Google Sheet as the homework "alice-party-day" (steps 1-3, ready = 5), so the
   Tea Party HQ can show who opened their link. A teacher preview (&t=1, or this computer opened the HQ) never reports. */
(function () {
  'use strict';
  var P = window.PARTY, CFG = window.PARTY_CONFIG || {}, PM = window.PROPS_MAP || { map: {}, home: {}, pics: {} };
  var $ = function (s) { return document.querySelector(s); };
  var stage = $('#stage');
  var AV = '../assets/alice-cut/avatars/a_', PR = '../assets/alice-cut/props/';
  var HW = 'alice-party-day', DONE_KEY = 'eaa_party_day_v1', PENDING_KEY = 'eaa_party_pending_day_v1';
  var WHEN = { '4a': 'Friday 30 October · 16:05 · garden', '4b': 'Friday 30 October · 14:15 · garden' };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* not remembered */ } }
  var q = new URLSearchParams(location.search);
  var TEACHER = q.get('t') === '1' || load('eaa_party_teacher', false) === true;

  /* earlier weeks (the ticks come from the Sheet) */
  var WEEKS = [
    { n: 1, icon: '🎭', title: 'Meet your character', hw: 'alice-tea-party-a1plus', total: 5, link: function (id) { return 'index.html?s=' + id; } },
    { n: 2, icon: '🗣️', title: 'Say your dialogue', hw: 'alice-tea-party-w2', total: 3, link: function (id) { return 'week2.html?s=' + id; } },
    { n: 3, icon: '🎩', title: 'Get ready for the party', hw: 'alice-tea-party-w3', total: 3, link: function (id) { return 'props.html?s=' + id; } }
  ];
  var REMOTE = null, FAILED = false;
  function rec(id, hw) { return REMOTE && REMOTE[id] && REMOTE[id][hw]; }
  function weekOk(id, w) { var r = rec(id, w.hw); return !!(r && r.finished); }

  function fetchStatus() {
    if (!CFG.submitUrl || typeof fetch !== 'function') { FAILED = true; draw(); return; }
    fetch(CFG.submitUrl + '?action=status&token=' + encodeURIComponent(CFG.token || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.ok && j.status) REMOTE = j.status; else FAILED = true; draw(); })
      .catch(function () { FAILED = true; draw(); });
  }

  /* ---- tell the teacher which steps are done (kept and retried when offline) ---- */
  function flush() {
    if (!CFG.submitUrl || typeof fetch !== 'function') return;
    var p = load(PENDING_KEY, {}) || {};
    Object.keys(p).forEach(function (id) {
      var body = p[id];
      fetch(CFG.submitUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
        .then(function () { var cur = load(PENDING_KEY, {}) || {}; if (JSON.stringify(cur[id]) === JSON.stringify(body)) { delete cur[id]; save(PENDING_KEY, cur); } }, function () { /* retry later */ });
    });
  }
  window.addEventListener('online', flush);
  function report(st, steps) {
    if (TEACHER || !CFG.submitUrl) return;
    var p = load(PENDING_KEY, {}) || {};
    p[st.id] = { token: CFG.token, homework: HW, studentId: st.id, name: st.name, classLabel: st.classLabel, character: st.role.short, steps: steps, xp: 0, device: (navigator.userAgent || '').slice(0, 60), at: new Date().toISOString() };
    save(PENDING_KEY, p); flush();
  }
  function doneOf(id) { var all = load(DONE_KEY, {}) || {}; return all[id] || {}; }
  function mark(st, key) {
    var all = load(DONE_KEY, {}) || {}, d = all[st.id] = all[st.id] || {};
    var first = !d[key]; d[key] = true; save(DONE_KEY, all);
    var n = ['open', 'listen', 'prop'].filter(function (k) { return d[k]; }).length;
    if (first) report(st, d.ready ? 5 : n);
    return first;
  }

  function daysToGo() {
    if (!CFG.partyDate) return '';
    var d = new Date(CFG.partyDate + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0);
    var n = Math.round((d - t) / 864e5);
    return n > 1 ? n + ' days to go' : n === 1 ? 'The party is tomorrow!' : n === 0 ? 'The party is today!' : '';
  }
  function img(src, alt, fb) { return '<img src="' + src + '" alt="' + esc(alt || '') + '" onerror="this.replaceWith(document.createTextNode(\'' + (fb || '🙂') + '\'))">'; }
  function confetti() { var e = ['🎉', '⭐', '🫖', '🍰', '✨', '🎩']; for (var i = 0; i < 26; i++) { var c = document.createElement('span'); c.className = 'conf'; c.textContent = e[i % e.length]; c.style.left = Math.random() * 100 + 'vw'; c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; document.body.appendChild(c); setTimeout(function (x) { return function () { x.remove(); }; }(c), 3400); } }
  function say(t) { try { return window.EAAVoice.say(t, { rate: 0.88, dir: 'audio/' }); } catch (e) { return Promise.resolve(); } }
  try { window.EAAVoice.preload('audio/'); } catch (e) { /* no voice module */ }   /* look for recordings now, so a tap can speak at once */

  /* ---------------- the personal page ---------------- */
  function mine(st) {
    var role = st.role, others = P.partners ? P.partners(st) : [], script = (P.dialogues || {})[st.pair] || [];
    var myLines = script.filter(function (l) { return l[0] === st.roleKey; }), guest = !myLines.length;
    var needPrint = (role.props || []).some(function (t) { return PM.map[t]; });
    mark(st, 'open');
    var d = doneOf(st.id), steps = [
      ['open', '👀', 'Open my page', 'Done! This is your page for the party.'],
      ['listen', '🔊', guest ? 'Read my job' : 'Listen to my lines', guest ? 'You are the tea guest: no lines to learn.' : 'Press Listen. Then say each ⭐ line with the voice.'],
      ['prop', '🎭', 'My prop', needPrint ? 'Print your pattern, or show me you have your prop.' : 'Your props come from home. Find them!'],
      ['ready', '🌟', 'I am ready!', 'Press it when you know your part and your prop is ready.']
    ];
    var n = steps.filter(function (s) { return d[s[0]]; }).length;
    $('#pill').textContent = daysToGo() || '🫖';
    var h = '<section class="card hero"><div class="av">' + img(AV + esc(st.roleKey) + '.webp', role.short) + '</div><div><h1>Hi, ' + esc(st.name) + '!</h1><div class="you">You are <b>' + esc(role.name) + '</b></div>' +
      '<span class="chip">🗓️ ' + esc(WHEN[st.classKey] || 'Friday 30 October') + '</span>' + (others.length ? '<span class="chip">🤝 with ' + others.map(function (o) { return esc(o.name); }).join(', ') + '</span>' : '') + '</div></section>';
    h += '<section class="card"><h2>✅ Get ready in 4 steps</h2><div class="ring"><div class="bar"><i style="width:' + Math.round(n / 4 * 100) + '%"></i></div><b>' + n + ' / 4</b></div>' +
      steps.map(function (s) {
        var extra = '';
        if (s[0] === 'listen') extra = '<div class="btns"><button class="btn teal" id="b-listen">🔊 ' + (guest ? 'Read my job' : 'Listen to my lines') + '</button></div>';
        if (s[0] === 'prop') extra = '<div class="btns">' + (needPrint ? '<a class="btn amber" data-prop="1" href="../alice-party-print/blueprints.html?role=' + esc(st.roleKey) + '">📐 Print my pattern</a>' : '') + '<a class="btn ghost" data-prop="1" href="../alice-party-print/craft-guides.html?role=' + esc(st.roleKey) + '">🛠️ How to make it</a><button class="btn ghost" id="b-have">✋ I have my prop</button></div>';
        if (s[0] === 'ready') extra = '<div class="btns"><button class="btn green big" id="b-ready">' + (d.ready ? '🌟 I am ready! (done)' : '🌟 I am ready!') + '</button></div>';
        return '<div class="step' + (d[s[0]] ? ' done' : '') + '"><span class="ic">' + (d[s[0]] ? '✓' : s[1]) + '</span><div><b>' + esc(s[2]) + '</b><small>' + esc(s[3]) + '</small>' + extra + '</div></div>';
      }).join('') + '</section>';
    /* my part */
    h += '<section class="card"><h2>🎬 My part</h2>';
    if (guest) h += '<div class="guest">🍰 You are the <b>tea guest</b>. Hold the plate of cake, smile and give cake to your friends. Wave at the end! Watch ' + others.map(function (o) { return esc(o.name); }).join(', ') + ' and clap for them.</div>';
    else h += '<p class="muted" style="margin:0 0 10px">Your lines are yellow with a ⭐. Tap any line to hear it.</p><div class="chat">' + script.map(function (l, i) {
      var me = l[0] === st.roleKey, r = P.roles[l[0]] || {};
      return '<div class="msg' + (me ? ' me' : '') + '"><span class="mini">' + img(AV + esc(l[0]) + '.webp', r.short) + '</span><div class="bub" data-i="' + i + '"><small>' + (me ? '⭐ ' : '') + esc(r.short || l[0]) + '</small>' + esc(l[1]) + '</div></div>';
    }).join('') + '</div>';
    h += '</section>';
    /* props */
    h += '<section class="card"><h2>🎭 My props</h2><div class="props">' + (role.props || []).map(function (t) {
      var pic = PM.pics && PM.pics[t];
      return '<div class="prop">' + (pic ? img(PR + pic + '.webp', t, '🎁') : '<div class="e">🎁</div>') + '<b>' + esc(t) + '</b>' + (PM.map[t] ? '<span class="tag bp">📐 print the pattern</span>' : '<span class="tag home">🏠 ' + esc(PM.home[t] || 'from home') + '</span>') + '</div>';
    }).join('') + '</div></section>';
    /* earlier weeks */
    h += '<section class="card"><details class="older"><summary>📚 My earlier practice (weeks 1–3)</summary>' + WEEKS.map(function (w) {
      var ok = weekOk(st.id, w);
      return '<div class="wk"><span class="no">' + (ok ? '✅' : w.icon) + '</span><div><b>Week ' + w.n + ': ' + esc(w.title) + '</b><div class="btns"><a class="btn ghost" href="' + w.link(st.id) + '">Open week ' + w.n + '</a></div></div></div>';
    }).join('') + '</details></section>';
    h += '<div style="text-align:center"><a class="btn ghost" href="party.html?class=' + esc(st.classKey) + '">Not you? Choose your name</a></div>';
    stage.innerHTML = h;
    $('#note').textContent = TEACHER ? 'Teacher preview: nothing is reported.' : '';

    var lb = $('#b-listen'); if (lb) lb.onclick = function () {
      mark(st, 'listen');
      if (guest) { say('You are the tea guest. Hold the plate of cake and smile.'); mine(st); return; }
      var i = 0; (function next() { if (i >= myLines.length) { mine(st); return; } var t = myLines[i++][1]; say(t).then(function () { setTimeout(next, 700); }, function () { setTimeout(next, 700); }); })();
    };
    [].forEach.call(stage.querySelectorAll('[data-prop]'), function (a) { a.addEventListener('click', function () { mark(st, 'prop'); }); });
    var hb = $('#b-have'); if (hb) hb.onclick = function () { mark(st, 'prop'); mine(st); };
    var rb = $('#b-ready'); if (rb) rb.onclick = function () {
      var dd = doneOf(st.id), all = load(DONE_KEY, {}) || {}; all[st.id] = dd; dd.ready = true; save(DONE_KEY, all);
      report(st, 5); confetti(); say('Well done! See you at the tea party!'); mine(st);
    };
    [].forEach.call(stage.querySelectorAll('.bub'), function (b) { b.onclick = function () { say(script[+b.dataset.i][1]); }; });
  }

  /* ---------------- the class page: who are you? ---------------- */
  function picker() {
    var keys = Object.keys(P.classes), cur = load('eaa_party_class', keys[0]);
    if (typeof cur !== 'string' || !P.classes[cur]) cur = keys[0];
    var want = (q.get('class') || '').toLowerCase(); if (P.classes[want]) cur = want;
    $('#pill').textContent = daysToGo() || '🫖';
    stage.innerHTML = '<section class="card"><h1>Who are you?</h1><p class="muted" style="margin:6px 0 0">Choose your class, then tap your name.</p>' +
      '<div class="seg">' + keys.map(function (k) { return '<button class="' + (k === cur ? 'on' : '') + '" data-k="' + k + '">' + esc(P.classes[k].label) + '</button>'; }).join('') + '</div>' +
      '<div class="names">' + P.classes[cur].students.map(function (s) {
        var r = rec(s.id, HW), ready = r && r.finished;
        return '<a class="name" href="?s=' + esc(s.id) + '">' + (ready ? '<span class="ok">ready ✓</span>' : '') + '<span class="mini">' + img(AV + esc(s.role) + '.webp', '') + '</span><b>' + esc(s.name) + '</b><small>' + esc((P.roles[s.role] || {}).short || '') + '</small></a>';
      }).join('') + '</div></section>';
    [].forEach.call(stage.querySelectorAll('.seg button'), function (b) { b.onclick = function () { cur = b.dataset.k; save('eaa_party_class', cur); q.delete('class'); picker(); }; });
    $('#note').textContent = FAILED ? 'I could not check the ticks now. That is OK.' : '';
  }

  function draw() {
    var id = q.get('s'), st = id ? P.find(id) : null;
    if (st) mine(st); else picker();
  }
  draw(); fetchStatus(); flush();
})();
