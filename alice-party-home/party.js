/* Alice Tea Party: ONE link for the pupils. Pick your class and name, then see every week of the Tea Party with a green tick for what you did.
   The ticks come from the teacher's Google Sheet (the same sheet the practices report to). Nothing here changes any data. */
(function () {
  'use strict';
  var P = window.PARTY, CFG = window.PARTY_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var stage = $('#stage');
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var q = new URLSearchParams(location.search);

  /* the weeks. hw = the id the practice reports to the Sheet with; total = tasks in that practice */
  var WEEKS = [
    { n: 1, dates: '5 to 9 October', icon: '🎭', title: 'Meet your character', goal: 'Learn who you are in the story and say 3 sentences about yourself.', hw: 'alice-tea-party-a1plus', total: 5,
      links: function (id) { return [['📖 Week 1 practice', 'index.html?s=' + id, 'green'], ['🧸 My Alice monster', 'profile.html?s=' + id, 'ghost']]; } },
    { n: 2, dates: '12 to 16 October', icon: '🗣️', title: 'Say your dialogue', goal: 'Read your dialogue, say it with someone at home and send a 30-second recording.', hw: 'alice-tea-party-w2', total: 3,
      links: function (id) { return [['📖 Week 2 practice', 'week2.html?s=' + id, 'green']]; } },
    { n: 3, dates: '19 to 23 October', icon: '🎩', title: 'Get ready for the party', goal: 'Make your costume and prop, learn the 3 tea-party phrases and your 3 sentences. We rehearse together in class.', hw: 'alice-tea-party-w3', total: 3, now: true,
      links: function (id, role) { return [['🎭 Week 3 practice', 'props.html?s=' + id, 'green'], ['🛠️ How to make my costume', '../alice-party-print/craft-guides.html?role=' + role, 'amber'], ['📐 My blueprint to print', '../alice-party-print/blueprints.html?role=' + role, 'ghost'], ['🖨️ My prop picture to print', '../alice-party-print/prop-templates.html?role=' + role, 'ghost']]; } }
  ];
  var REMOTE = null, FAILED = false;

  function stateOf(id, w) {
    var r = REMOTE && REMOTE[id] && REMOTE[id][w.hw];
    if (!REMOTE) return { k: FAILED ? 'err' : 'load' };
    if (r && r.finished) return { k: 'ok' };
    if (r && r.steps > 0) return { k: 'part', n: Math.min(r.steps, w.total) };
    return { k: 'no' };
  }
  function doneCount(id) { return WEEKS.filter(function (w) { return stateOf(id, w).k === 'ok'; }).length; }

  function load() {
    if (!CFG.submitUrl || typeof fetch !== 'function') { FAILED = true; draw(); return; }
    fetch(CFG.submitUrl + '?action=status&token=' + encodeURIComponent(CFG.token || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.ok && j.status) { REMOTE = j.status; } else FAILED = true; draw(); })
      .catch(function () { FAILED = true; draw(); });
  }

  function picker() {
    var keys = Object.keys(P.classes), cur = keys[0];
    try { cur = localStorage.getItem('eaa_party_class') || cur; } catch (e) { /* default */ }
    var want = (q.get('class') || '').toLowerCase(); if (P.classes[want]) cur = want;
    $('#pill').textContent = ''; $('#sub').textContent = 'My plan, week by week';
    stage.innerHTML = '<section class="panel"><h1>Who are you?</h1><p class="goal">Choose your class. Then tap your name.</p>' +
      '<div class="tabs">' + keys.map(function (k) { return '<button class="btn ghost ' + (k === cur ? 'on' : '') + '" data-k="' + k + '">' + esc(P.classes[k].label) + '</button>'; }).join('') + '</div>' +
      '<div class="grid">' + P.classes[cur].students.map(function (s) {
        var n = REMOTE ? doneCount(s.id) : 0;
        return '<a class="btn stu ' + (n >= WEEKS.length ? 'all' : '') + '" href="?s=' + esc(s.id) + '">' + (n ? '<span class="tk">' + '✅'.repeat(n) + '</span>' : '') + esc(s.name) + '<small>' + esc(P.roles[s.role].short) + '</small></a>';
      }).join('') + '</div>' + (FAILED ? '<p class="note">I could not check the green ticks now. Check the internet and reload.</p>' : REMOTE ? '' : '<p class="note">Checking the green ticks…</p>') + '</section>';
    [].forEach.call(stage.querySelectorAll('.tabs button'), function (b) { b.onclick = function () { cur = b.dataset.k; try { localStorage.setItem('eaa_party_class', cur); } catch (e) { /* ignore */ } q.delete('class'); picker(); }; });
  }

  function daysToGo() {
    if (!CFG.partyDate) return '';
    var d = new Date(CFG.partyDate + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0);
    var n = Math.round((d - t) / 86400000);
    return n > 1 ? n + ' days to the party!' : n === 1 ? 'The party is tomorrow!' : n === 0 ? 'The party is today!' : '';
  }

  function mine(st) {
    var role = st.role, n = doneCount(st.id), pct = Math.round(n / WEEKS.length * 100);
    $('#sub').textContent = st.name + ' · ' + role.short;
    $('#pill').textContent = REMOTE ? '✅ ' + n + ' of ' + WEEKS.length : '';
    var h = '<section class="panel"><div class="hero"><img src="assets/' + esc(st.photo) + '" alt="' + esc(role.short) + '"><div><h1>' + esc(st.name) + '</h1><div class="goal" style="margin:0">You are <b>' + esc(role.name) + '</b></div></div></div>' +
      (REMOTE ? '<div class="bar"><i style="width:' + pct + '%"></i></div><div class="note" style="text-align:left;margin:0">' + n + ' of ' + WEEKS.length + ' weeks done' + (daysToGo() ? ' · ' + daysToGo() : '') + '</div>' : FAILED ? '<p class="note" style="text-align:left">I could not check your green ticks now. The practices still work.</p>' : '<p class="note" style="text-align:left">Checking your green ticks…</p>') +
      '<div style="margin-top:12px"><a class="btn ghost sm" href="party.html?class=' + esc(st.classKey) + '">Not you? Choose another name</a></div></section>';
    WEEKS.forEach(function (w) {
      var s = stateOf(st.id, w), cls = s.k === 'ok' ? 'done' : w.now ? 'now' : '';
      var msg = s.k === 'ok' ? '<div class="state ok">✅ You did it! Well done, ' + esc(st.name) + '!</div>' : s.k === 'part' ? '<div class="state part">🟡 Started: ' + s.n + ' of ' + w.total + ' tasks. Finish it!</div>' : s.k === 'no' ? '<div class="state no">⭐ Not done yet. Let’s start!</div>' : s.k === 'err' ? '<div class="state no">…could not check</div>' : '<div class="state no">Checking…</div>';
      h += '<section class="week ' + cls + '"><div class="wk"><div class="no">' + w.icon + '</div><div><div class="d">WEEK ' + w.n + ' · ' + w.dates + (w.now ? ' · THIS WEEK' : '') + '</div><h2>' + esc(w.title) + '</h2></div></div><p class="goal" style="margin:0 0 4px">' + esc(w.goal) + '</p>' + msg +
        '<div class="links">' + w.links(st.id, st.roleKey).map(function (l) { return '<a class="btn sm ' + l[2] + '" href="' + l[1] + '">' + l[0] + '</a>'; }).join('') + '</div></section>';
    });
    h += '<section class="week soon"><div class="wk"><div class="no">🎉</div><div><div class="d">PARTY DAY</div><h2>Show time!</h2></div></div><p class="goal" style="margin:0">Wear your costume, bring your prop and say your lines. Your teacher will tell you the day.' + (daysToGo() ? ' <b>' + daysToGo() + '</b>' : '') + '</p></section>';
    stage.innerHTML = h;
  }

  function draw() {
    var id = q.get('s'), st = id ? P.find(id) : null;
    if (st) mine(st); else picker();
  }
  draw(); load();
})();
