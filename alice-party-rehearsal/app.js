/* Alice Tea Party: four rehearsal lessons for the smartboard.
   1 Phrases (team game)   2 Pair rehearsal   3 Dress rehearsal   4 Party day.
   Soft-fail everywhere: no points are ever taken away. Stars stay on this computer only. */
(function () {
  'use strict';
  var P = window.PARTY;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var stage = $('#stage');
  var AV = '../assets/alice-cut/avatars/a_', PR = '../assets/alice-cut/props/', ART = '../alice-party-home/week2-art/', LART = '../alice-party-home/lesson-art/';
  var ORDER_KEY = 'eaa_party_order_v1', STARS_KEY = 'eaa_party_rehearsal_v1';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* not remembered */ } }

  /* sound: soft chords only, started by the first tap */
  var ctx = null;
  function audio() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* none */ } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; }
  function note(f, s, d, v) { var c = audio(); if (!c) return; [['sine', 0], ['triangle', 4]].forEach(function (p) { var o = c.createOscillator(), g = c.createGain(); o.type = p[0]; o.frequency.value = f; o.detune.value = p[1]; var t = c.currentTime + s; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05); }); }
  function sfxOk() { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, i * 0.09, 0.55, 0.11); }); }
  function sfxSoft() { note(246.94, 0, 0.45, 0.10); note(220, 0.22, 0.6, 0.10); }
  function sfxWin() { [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { note(f, i * 0.12, 0.9, 0.12); }); }
  function sfxClap() { for (var i = 0; i < 8; i++) note(392 + (i % 4) * 66, i * 0.07, 0.4, 0.05); sfxWin(); }
  function speak(t) { try { window.EAAVoice.say(t, { rate: 0.88, dir: '../alice-party-home/audio/' }); } catch (e) { /* voice is optional */ } }

  /* class, groups and order */
  var keys = Object.keys(P.classes), cls = load('eaa_party_class', keys[0]); if (!P.classes[cls]) cls = keys[0];
  var lesson = 1;
  function groups(k) { var seen = [], map = {}; P.classes[k].students.forEach(function (s) { if (!map[s.pair]) { map[s.pair] = []; seen.push(s.pair); } map[s.pair].push(s); }); return { order: seen, map: map }; }
  function orderOf(k) { var g = groups(k), saved = (load(ORDER_KEY, {}) || {})[k] || [], o = saved.filter(function (p) { return g.map[p]; }); g.order.forEach(function (p) { if (o.indexOf(p) < 0) o.push(p); }); return { order: o, map: g.map }; }
  function stars() { return load(STARS_KEY, {}) || {}; }
  function setStars(pair, n) { var s = stars(); s[cls + ':' + pair] = n; save(STARS_KEY, s); }

  var PHRASES = [
    { say: 'Would you like some tea?', art: 'tea_would_you_like', e: '🫖', tip: 'Host: offer the tea.' },
    { say: 'Yes, please.', art: 'tea_yes_please', e: '☕', tip: 'Guest: say yes politely.' },
    { say: 'No, thank you.', art: 'tea_no_thanks', e: '✋', tip: 'Guest: say no politely.' },
    { say: 'Pass the cake, please.', art: 'tea_pass_cake', e: '🍰', tip: 'Ask nicely. Say please!' },
    { say: 'Here you are.', art: 'tea_here_you_are', e: '🎁', tip: 'Give something to a friend.' },
    { say: 'Thank you very much!', art: 'tea_thank_you', e: '😊', tip: 'Always say thank you.' },
    { say: 'You are welcome.', art: 'tea_welcome', e: '🤝', tip: 'The answer to thank you.' },
    { say: 'This is a nice tea party!', art: 'tea_nice_party', e: '🎉', tip: 'Say it at the end.' }
  ];
  var SITUATIONS = [
    ['The tea is ready. You offer it to a friend.', 0], ['Your friend offers you tea. You want it.', 1], ['Your friend offers you tea. You do not want it.', 2], ['You want a piece of cake.', 3],
    ['You give a cup to your friend.', 4], ['A friend gives you a cup.', 5], ['Your friend says "Thank you!"', 6], ['The party is great. You say it.', 7]
  ];
  function pic(file, emoji) { return file ? '<img src="' + ART + file + '.png" alt="" onerror="this.replaceWith(document.createTextNode(\'' + emoji + '\'))">' : emoji; }
  /* pictures that Gemini makes: shown when the file exists, otherwise nothing or an emoji (so the lesson always works) */
  function hero(name) { return '<img class="hero" src="' + LART + 'hero_' + name + '.webp" alt="" onerror="this.remove()">'; }
  var TEAM_PIC = ['team_teapot', 'team_cupcake', 'team_hatter', 'team_rabbit'];
  function tIcon(t) { return '<img class="ti" src="' + LART + TEAM_PIC[t.k] + '.png" alt="" onerror="this.replaceWith(document.createTextNode(\'' + t.i + '\'))">'; }
  function setBg(file) {
    var b = document.body;
    if (!file) { b.style.backgroundImage = ''; b.style.backgroundSize = ''; return; }
    var im = new Image(); im.onload = function () { b.style.backgroundImage = 'linear-gradient(rgba(6,9,17,.8),rgba(6,9,17,.8)), url(' + ART + file + ')'; b.style.backgroundSize = 'cover'; b.style.backgroundAttachment = 'fixed'; }; im.src = ART + file;
  }
  /* the 7 lessons of the party week for each class (from the k12 timetable, 19-23 Oct 2026): [day, title, lesson number in this page] */
  var PLAN = {
    '4a': [['Mon 19', 'Phrases', 1], ['Mon 19', 'Pairs: read', 2], ['Tue 20', 'Pairs: by heart', 2], ['Wed 21', 'Dress rehearsal', 3], ['Wed 21', 'Props and fixes', 3], ['Thu 22', 'Final run', 3], ['Thu 22', 'Party day', 4]],
    '4b': [['Mon 19', 'Phrases', 1], ['Tue 20', 'Pairs: read', 2], ['Tue 20', 'Pairs: by heart', 2], ['Wed 21', 'Dress rehearsal', 3], ['Wed 21', 'Props and fixes', 3], ['Fri 23', 'Final run', 3], ['Fri 23', 'Party day', 4]]
  };
  function planStrip() {
    var p = PLAN[cls]; if (!p) return '';
    return '<div class="plan7">' + p.map(function (x, i) { return '<button class="btn sm ' + (x[2] === lesson ? 'on' : 'ghost') + '" data-w="' + x[2] + '"><small>' + (i + 1) + ' · ' + x[0] + '</small>' + esc(x[1]) + '</button>'; }).join('') + '</div>';
  }
  function avatar(role, label) { return '<span class="av"><img src="' + AV + esc(role) + '.webp" alt="" onerror="this.replaceWith(document.createTextNode(\'🙂\'))"></span>'; }

  var PLANS = {
    1: ['<b>5 min</b> Warm-up: the 8 phrase cards. Say each one together, then in whispers.', '<b>15 min</b> Team game "Tea Time Challenge": 12 rounds, soft-fail, no points lost.', '<b>10 min</b> In pairs: each pupil says their 3 sentences, partner guesses the character.', '<b>5 min</b> Exit: one phrase each at the door. Remind about props.'],
    2: ['<b>5 min</b> Recap: the phrases in two lines.', '<b>20 min</b> Pairs rehearse: first with the lines visible, then hide one pupil’s lines (tap the name) and say them by heart.', '<b>8 min</b> Each pair shows the 1-minute dialogue; the class gives a star for loud voice, eye contact, smile, prop.', '<b>2 min</b> Props reminder and homework link (Home practice 3).'],
    3: ['<b>5 min</b> Prop check, pair by pair.', '<b>25 min</b> Run the show in the party order. Each pair 1 minute, then the class says two stars and one wish.', '<b>5 min</b> Fix the wishes. Practise "Would you like some tea?" once more.'],
    4: ['<b>5 min</b> Set the garden and the tables. Props on.', '<b>25 min</b> The party: next performance, applause, tea and cake.', '<b>10 min</b> Certificates, group photo, thank-you phrases, tidy up.']
  };
  function planHtml() { return '<details class="plan panel"><summary>📋 Teacher plan for this lesson</summary><ol>' + PLANS[lesson].map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol></details>'; }

  /* ---------------- header ---------------- */
  function head() {
    $('#clsbtns').innerHTML = keys.map(function (k) { return '<button class="btn ghost sm ' + (k === cls ? 'on' : '') + '" data-c="' + k + '">' + esc(P.classes[k].label) + '</button>'; }).join('');
    [].forEach.call($('#clsbtns').querySelectorAll('button'), function (b) { b.onclick = function () { cls = b.dataset.c; save('eaa_party_class', cls); go(lesson); }; });
    var names = ['', '1 · Phrases', '2 · Pairs', '3 · Dress rehearsal', '4 · Party day'];
    $('#tabs').innerHTML = [1, 2, 3, 4].map(function (n) { return '<button class="btn ' + (n === lesson ? 'on' : 'ghost') + '" data-l="' + n + '">' + names[n] + '</button>'; }).join('') +
      '<span style="flex:1"></span><a class="btn violet sm" href="../alice-party-print/running-order.html">📋 Running order</a><a class="btn violet sm" href="../alice-party-print/prop-templates.html">🖨️ Prop templates</a>' +
      '<a class="btn violet sm" href="../alice-party-print/certificates.html">🏅 Certificates</a>';
    [].forEach.call($('#tabs').querySelectorAll('button'), function (b) { b.onclick = function () { go(+b.dataset.l); }; });
    $('#week').innerHTML = planStrip();
    [].forEach.call($('#week').querySelectorAll('button'), function (b) { b.onclick = function () { go(+b.dataset.w); }; });
  }
  function go(n) { lesson = n; head(); setBg(n === 3 ? 'bg_tea_table.webp' : n === 4 ? 'bg_tea_party_night.webp' : ''); if (n === 1) l1(); else if (n === 2) l2(); else show(n === 3 ? 'dress' : 'party'); window.scrollTo(0, 0); }

  /* ---------------- lesson 1: phrases + team game ---------------- */
  var G = null;
  function l1() {
    G = null;
    stage.innerHTML = hero('phrases') + planHtml() + '<section class="panel"><h2>The 8 tea-party phrases</h2><p class="muted">Tap 🔊, say it together, then whisper it.</p><div class="cards">' +
      PHRASES.map(function (p) { return '<div class="pc"><div class="pic">' + pic(p.art, p.e) + '</div><div class="say">' + esc(p.say) + '</div><div class="tip">' + esc(p.tip) + '</div><button class="btn amber sm sp" data-s="' + esc(p.say) + '">🔊 Listen</button></div>'; }).join('') + '</div></section>' +
      '<section class="panel"><h2>🏆 Tea Time Challenge</h2><p class="muted">How many teams?</p><div class="row">' + [2, 3, 4].map(function (n) { return '<button class="btn green go" data-n="' + n + '">' + n + ' teams</button>'; }).join('') + '</div></section>';
    [].forEach.call(stage.querySelectorAll('.sp'), function (b) { b.onclick = function () { audio(); speak(b.dataset.s); }; });
    [].forEach.call(stage.querySelectorAll('.go'), function (b) { b.onclick = function () { audio(); startGame(+b.dataset.n); }; });
  }
  function startGame(n) {
    var names = ['Teapots', 'Cupcakes', 'Hatters', 'Rabbits'], icons = ['🫖', '🧁', '🎩', '🐰'], qs = [];
    shuffle(SITUATIONS).slice(0, 6).forEach(function (s) { qs.push({ t: 'sit', text: s[0], right: s[1] }); });
    var roles = shuffle(P.classes[cls].students.map(function (s) { return s.role; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    roles.slice(0, 6).forEach(function (r) { var sent = P.roles[r].sentences[Math.floor(Math.random() * 3)]; qs.push({ t: 'who', text: sent, right: r }); });
    G = { teams: names.slice(0, n).map(function (x, i) { return { n: x, i: icons[i], k: i, p: 0 }; }), qs: shuffle(qs), r: 0, tries: 0 };
    askQ();
  }
  function scoreBar() { return '<div class="teams">' + G.teams.map(function (t, i) { return '<div class="team ' + (i === G.r % G.teams.length ? 'now' : '') + '"><b>' + tIcon(t) + ' ' + esc(t.n) + '</b><span>' + t.p + '</span></div>'; }).join('') + '</div>'; }
  function askQ() {
    if (G.r >= G.qs.length) return endGame();
    var q = G.qs[G.r], team = G.teams[G.r % G.teams.length], opts, html;
    G.tries = 0;
    if (q.t === 'sit') {
      var wrong = shuffle(PHRASES.map(function (_, i) { return i; }).filter(function (i) { return i !== q.right; })).slice(0, 2);
      opts = shuffle([q.right].concat(wrong)).map(function (i) { return { id: i, label: PHRASES[i].say }; });
      html = '<div class="q"><small>' + tIcon(team) + ' ' + esc(team.n) + ': what do you say?</small>' + esc(q.text) + '</div>';
    } else {
      var others = shuffle(P.classes[cls].students.map(function (s) { return s.role; }).filter(function (v, i, a) { return a.indexOf(v) === i && v !== q.right; })).slice(0, 2);
      opts = shuffle([q.right].concat(others)).map(function (r) { return { id: r, label: P.roles[r].short, role: r }; });
      html = '<div class="q"><small>' + tIcon(team) + ' ' + esc(team.n) + ': who says it?</small>“' + esc(q.text) + '”</div>';
    }
    stage.innerHTML = '<section class="panel">' + scoreBar() + html + '<div class="choices c3">' + opts.map(function (o) { return '<button class="btn choice" data-id="' + esc(o.id) + '">' + (o.role ? avatar(o.role) : '') + esc(o.label) + '</button>'; }).join('') + '</div>' +
      '<div class="msg" id="msg">Round ' + (G.r + 1) + ' of ' + G.qs.length + '</div></section>';
    [].forEach.call(stage.querySelectorAll('.choice'), function (b) { b.onclick = function () { answer(b, q, team); }; });
  }
  function answer(b, q, team) {
    var ok = String(b.dataset.id) === String(q.right), msg = $('#msg');
    if (ok) { var pts = G.tries === 0 ? 10 : 5; team.p += pts; b.classList.add('right'); sfxOk(); msg.className = 'msg ok'; msg.textContent = '⭐ +' + pts + ' for ' + team.n + '!'; lock(); setTimeout(function () { G.r++; askQ(); }, 1300); return; }
    G.tries++; sfxSoft(); b.classList.add('try'); b.disabled = true; setTimeout(function () { b.classList.remove('try'); }, 450);
    if (G.tries < 2) { msg.className = 'msg no'; msg.textContent = 'Nearly! Try once more 💪'; return; }
    var right = stage.querySelector('.choice[data-id="' + String(q.right).replace(/"/g, '') + '"]'); if (right) right.classList.add('right');
    msg.className = 'msg no'; msg.textContent = 'This is the answer. Let’s say it together!'; lock(); setTimeout(function () { G.r++; askQ(); }, 2200);
  }
  function lock() { [].forEach.call(stage.querySelectorAll('.choice'), function (c) { c.disabled = true; }); }
  function endGame() {
    var sorted = G.teams.slice().sort(function (a, b) { return b.p - a.p; });
    sfxWin();
    stage.innerHTML = '<section class="panel"><h2 style="text-align:center">🎉 Well done, everyone!</h2><div class="podium">' + sorted.map(function (t, i) { return '<div>' + ['🥇', '🥈', '🥉', '⭐'][i] + '<br>' + tIcon(t) + ' ' + esc(t.n) + '<br>' + t.p + '</div>'; }).join('') + '</div>' +
      '<p class="muted" style="text-align:center">Every team is a Tea Party star. Now say your 3 sentences to your partner!</p><div class="row"><button class="btn green" id="again">🔁 Play again</button></div></section>';
    $('#again').onclick = l1;
  }

  /* ---------------- shared: perform a dialogue ---------------- */
  var R = null;   // current performance
  function perform(pairKey, o, done) {
    var g = orderOf(cls), st = g.map[pairKey] || [], script = P.dialogues[pairKey] || [];
    R = { line: 0, secs: 60, timer: null, hidden: {}, chips: {} };
    function lines() {
      return script.map(function (l, i) {
        var role = P.roles[l[0]] || { short: l[0] }, hide = R.hidden[l[0]] && i !== R.line;
        return '<li class="tl ' + (i === R.line ? 'now' : i < R.line ? 'past' : '') + '" data-i="' + i + '">' + avatar(l[0]) + '<span><span class="w">' + esc(role.short.toUpperCase()) + '</span><span class="' + (hide ? 'hide' : '') + '">' + esc(l[1]) + '</span></span></li>';
      }).join('');
    }
    function draw() {
      var chips = o.chips || [];
      stage.innerHTML = (o.head || '') + '<section class="panel"><div class="now-big"><div class="names">' + st.map(function (s) { return esc(s.name); }).join(' + ') + '</div><div class="roles">' + st.map(function (s) { return esc(P.roles[s.role].short); }).join(' + ') + '</div></div>' +
        '<div class="timer ' + (R.secs <= 10 ? 'low' : '') + '" id="tm">' + Math.floor(R.secs / 60) + ':' + String(R.secs % 60).padStart(2, '0') + '</div>' +
        '<ul class="tele">' + lines() + '</ul>' +
        '<div class="row"><button class="btn ghost" id="back">⬅ Back</button><button class="btn green" id="next">Next line ➡</button><button class="btn amber" id="start">' + (R.timer ? '⏸ Pause' : '▶ Start 1:00') + '</button></div>' +
        (o.hideable ? '<div class="row">' + st.map(function (s) { return '<button class="btn sm ' + (R.hidden[s.role] ? 'on' : 'ghost') + '" data-r="' + esc(s.role) + '">🙈 Hide ' + esc(s.name) + '’s lines</button>'; }).join('') + '</div>' : '') +
        (chips.length ? '<div class="chk">' + chips.map(function (c) { return '<button class="btn ' + (R.chips[c[0]] ? 'green' : 'ghost') + ' chip" data-k="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div><div class="stars">' + '⭐'.repeat(Object.keys(R.chips).filter(function (k) { return R.chips[k]; }).length) + '</div>' : '') +
        '<div class="row">' + (o.extra || '') + '<button class="btn violet" id="finish">' + (o.finish || 'Finish ✓') + '</button></div></section>';
      $('#back').onclick = function () { R.line = Math.max(0, R.line - 1); draw(); };
      $('#next').onclick = function () { audio(); sfxOk(); R.line = Math.min(script.length - 1, R.line + 1); draw(); };
      $('#start').onclick = function () { audio(); if (R.timer) { clearInterval(R.timer); R.timer = null; draw(); } else { R.timer = setInterval(function () { R.secs--; var tm = $('#tm'); if (tm) { tm.textContent = Math.floor(R.secs / 60) + ':' + String(R.secs % 60).padStart(2, '0'); tm.className = 'timer ' + (R.secs <= 10 ? 'low' : ''); } if (R.secs <= 0) { clearInterval(R.timer); R.timer = null; sfxWin(); draw(); } }, 1000); draw(); } };
      [].forEach.call(stage.querySelectorAll('[data-r]'), function (b) { b.onclick = function () { R.hidden[b.dataset.r] = !R.hidden[b.dataset.r]; draw(); }; });
      [].forEach.call(stage.querySelectorAll('.chip'), function (b) { b.onclick = function () { R.chips[b.dataset.k] = !R.chips[b.dataset.k]; if (R.chips[b.dataset.k]) sfxOk(); draw(); }; });
      [].forEach.call(stage.querySelectorAll('.tl'), function (b) { b.onclick = function () { R.line = +b.dataset.i; draw(); }; });
      var ap = $('#clap'); if (ap) ap.onclick = function () { audio(); sfxClap(); };
      $('#finish').onclick = function () { if (R.timer) clearInterval(R.timer); var n = Object.keys(R.chips).filter(function (k) { return R.chips[k]; }).length; done(n); };
    }
    draw();
  }
  var CHIPS = [['voice', '🔊 Loud voice'], ['eyes', '👀 Look up'], ['smile', '😊 Smile'], ['prop', '🎭 Prop']];

  /* ---------------- lesson 2: pairs ---------------- */
  function l2() {
    var g = orderOf(cls), s = stars();
    stage.innerHTML = hero('pairs') + planHtml() + '<section class="panel"><h2>Choose a pair or trio</h2><p class="muted">Read together first, then hide a pupil’s lines and say them by heart. Give a star for each: loud voice, look up, smile, prop.</p><div class="pairs">' +
      g.order.map(function (p, i) { var st = g.map[p], n = s[cls + ':' + p]; return '<button class="btn pair ' + (n != null ? 'done' : '') + '" data-p="' + esc(p) + '"><span>' + (i + 1) + '. ' + st.map(function (x) { return esc(x.name); }).join(' + ') + '</span><small>' + st.map(function (x) { return esc(P.roles[x.role].short); }).join(' + ') + (n != null ? ' · ' + '⭐'.repeat(n) : '') + '</small></button>'; }).join('') + '</div></section>';
    [].forEach.call(stage.querySelectorAll('.pair'), function (b) {
      b.onclick = function () { audio(); perform(b.dataset.p, { hideable: true, chips: CHIPS, finish: 'Save and choose next pair ✓', head: '<div class="row" style="margin:0 0 10px"><button class="btn ghost sm" id="all">⬅ All pairs</button></div>' }, function (n) { setStars(b.dataset.p, n); l2(); }); var a = $('#all'); if (a) a.onclick = l2; };
    });
  }

  /* ---------------- lessons 3 and 4: the show ---------------- */
  var SH = null;
  function show(mode) {
    var g = orderOf(cls); SH = { mode: mode, i: 0, order: g.order, map: g.map };
    showIntro();
  }
  function showIntro() {
    var dress = SH.mode === 'dress';
    stage.innerHTML = hero(dress ? 'dress' : 'party') + planHtml() + '<section class="panel"><h2>' + (dress ? '🎭 Dress rehearsal' : '🫖 Party day') + ' · ' + esc(P.classes[cls].label) + '</h2><p class="muted">' + (dress ? 'Props on. Each pair performs one minute. The class says two stars and one wish.' : 'The real show! Press Next performance, then applause.') + '</p>' +
      '<p>Order: ' + SH.order.map(function (p, i) { return (i + 1) + '. ' + SH.map[p].map(function (x) { return esc(x.name); }).join(' + '); }).join(' · ') + '</p>' +
      '<div class="row"><button class="btn green" id="go">▶ Start the show</button><a class="btn ghost" href="../alice-party-print/running-order.html">Change the order</a></div></section>';
    $('#go').onclick = function () { audio(); sfxWin(); SH.i = 0; propCheck(); };
  }
  function propCheck() {
    if (SH.i >= SH.order.length) return showEnd();
    var pair = SH.order[SH.i], st = SH.map[pair], dress = SH.mode === 'dress';
    var pp = st.map(function (s) { return (P.roles[s.role].props || []).map(function (t) { return '<div class="pp">' + (PROPIMG[t] ? '<img src="' + PR + PROPIMG[t] + '.webp" alt="">' : '😁') + '<br>' + esc(t) + '</div>'; }).join(''); }).join('');
    stage.innerHTML = '<section class="panel"><div class="now-big"><div class="roles">Next: performance ' + (SH.i + 1) + ' of ' + SH.order.length + '</div><div class="names">' + st.map(function (s) { return esc(s.name) + ' <small class="muted">' + esc(P.roles[s.role].short) + '</small>'; }).join('<br>') + '</div></div>' +
      '<p class="muted" style="text-align:center">' + (dress ? 'Check the props:' : 'Props ready?') + '</p><div class="props">' + pp + '</div>' +
      '<div class="row"><button class="btn green" id="go">🎬 Perform</button><button class="btn ghost" id="skip">Skip this pair</button></div></section>';
    $('#go').onclick = function () { audio(); runPerf(); };
    $('#skip').onclick = function () { SH.i++; propCheck(); };
  }
  var PROPIMG = { 'a paper key': 'prop_key', 'a teacup': 'prop_teacup', 'a big paper hat': 'prop_hat_big', 'a teapot': 'prop_teapot', 'a paper watch': 'prop_watch', 'a letter': 'prop_letter', 'a paper crown': 'prop_crown_white', 'a small bottle': 'prop_bottle', 'long paper ears': 'prop_ears_hare', 'a carrot': 'prop_carrot', 'cat ears': 'prop_ears_cat', 'a ball of yarn': 'prop_yarn', 'dog ears': 'prop_ears_dog', 'a paper bone': 'prop_bone', 'a red paper crown': 'prop_crown_red', 'a playing card': 'prop_card', 'paper wings': 'prop_wings', 'a toy sword': 'prop_sword_toy', 'paper claws': 'prop_claws', 'a big key': 'prop_key_big', 'a book': 'prop_book', 'a flower': 'prop_flower', 'a nice hat': 'prop_hat_nice', 'a plate of cake': 'prop_cake_plate', 'a big button': 'prop_button', 'a green hat': 'prop_hat_green', 'a small bell': 'prop_bell', 'blue paper antennae': 'prop_antennae', 'a mushroom': 'prop_mushroom', 'a tall hat': 'prop_hat_tall', 'a walking stick': 'prop_stick', 'a green coat': 'prop_coat_green', 'a button': 'prop_button', 'mouse ears': 'prop_ears_mouse', 'a small cup': 'prop_cup_tiny', 'a tiny cup': 'prop_cup_tiny', 'a paper shell': 'prop_shell', 'a pearl': 'prop_pearl' };
  function runPerf() {
    var pair = SH.order[SH.i], dress = SH.mode === 'dress';
    perform(pair, { chips: dress ? [['voice', '🔊 Loud voice'], ['team', '🤝 Teamwork'], ['prop', '🎭 Prop']] : [], finish: dress ? 'Next performance ➡' : 'Next performance ➡', extra: dress ? '' : '<button class="btn amber" id="clap">👏 Applause!</button>' },
      function (n) { if (dress) setStars(pair, n); SH.i++; propCheck(); });
  }
  function showEnd() {
    var s = stars(), dress = SH.mode === 'dress';
    sfxWin();
    stage.innerHTML = '<section class="panel"><h2 style="text-align:center">' + (dress ? '🎭 Dress rehearsal finished!' : '🎉 What a Tea Party!') + '</h2>' +
      (dress ? '<div class="pairs">' + SH.order.map(function (p) { var n = s[cls + ':' + p]; return '<div class="pc"><b>' + SH.map[p].map(function (x) { return esc(x.name); }).join(' + ') + '</b><div class="stars">' + (n != null ? '⭐'.repeat(n) || '·' : '·') + '</div></div>'; }).join('') + '</div><p class="muted" style="text-align:center">Wishes for tomorrow: ask each pair what they will practise.</p>'
        : '<p style="text-align:center;font-size:1.3rem">Thank you, Alice! Thank you, everyone!</p><div class="row"><a class="btn amber" href="../alice-party-print/certificates.html">🏅 Print the certificates</a></div>') +
      '<div class="row"><button class="btn green" id="again">🔁 Start again</button></div></section>';
    $('#again').onclick = function () { show(SH.mode); };
  }

  head(); l1();
})();
