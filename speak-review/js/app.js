/* speak-review/js/app.js
 * 5-Unit Speaking Review: two 35-minute lessons per grade.
 * Games: Describe & guess (hot seat / slow reveal) and Spot the difference.
 * Team points stay on this screen only (no XP, no cloud).
 */
(function (root) {
  'use strict';

  var D = root.SpeakReviewData, A = root.SRAudio;
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);

  var TEAMS = [
    { name: 'Pink', mon: 'emberwing', color: '#ff5fa2', score: 0 },
    { name: 'Blue', mon: 'aquafind', color: '#4f9dff', score: 0 },
    { name: 'Yellow', mon: 'sparktail', color: '#ffb320', score: 0 },
    { name: 'Green', mon: 'florasprout', color: '#2fc58a', score: 0 }
  ];

  var S = {
    grade: params.get('grade') === '4' ? 4 : 3,
    lesson: params.get('lesson') === '2' ? 2 : 1,
    view: 'home',
    team: 0,
    clockStart: 0,
    describe: null,
    spot: null
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function monImg(t, mood) { return '../assets/monsters/art/' + t.mon + '_growing' + (mood ? '_' + mood : '') + '.webp'; }
  function picSrc(g, u, id) { return 'art/describe/g' + g + '-u' + u + '-' + id + '.webp'; }
  function lessonUnits() { return D.LESSONS[S.lesson].units; }

  /* ---------- teams ---------- */
  function renderTeams() {
    var bar = $('sr-teams');
    bar.innerHTML = TEAMS.map(function (t, i) {
      return '<div class="sr-team' + (i === S.team ? ' on' : '') + '" style="--tc:' + t.color + '" data-i="' + i + '">' +
        '<button type="button" class="sr-team-pick" data-i="' + i + '" aria-label="Team ' + t.name + ' speaks">' +
        '<img src="' + monImg(t) + '" alt="" draggable="false"><span class="sr-team-name">' + t.name + '</span>' +
        '<b class="sr-team-score" id="sr-score-' + i + '">' + t.score + '</b></button>' +
        '<span class="sr-team-adj"><button type="button" class="sr-mini" data-add="1" data-i="' + i + '" aria-label="Add a point">+</button>' +
        '<button type="button" class="sr-mini" data-add="-1" data-i="' + i + '" aria-label="Take a point away">−</button></span></div>';
    }).join('');
  }
  function addPoints(i, n) {
    var t = TEAMS[i]; if (!t) return;
    t.score = Math.max(0, t.score + n);
    var el = $('sr-score-' + i);
    if (el) { el.textContent = t.score; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    if (n > 0) A.play('point');
  }
  function nextTeam() { S.team = (S.team + 1) % TEAMS.length; renderTeams(); }

  /* ---------- header & steps ---------- */
  function renderHeader() {
    $('sr-grade').textContent = 'Grade ' + S.grade;
    $('sr-lesson').textContent = 'Lesson ' + S.lesson + (S.lesson === 1 ? ' · Units 1–3' : ' · Units 4–5');
    var steps = D.LESSONS[S.lesson].steps;
    $('sr-steps').innerHTML = steps.map(function (st, i) {
      return '<button type="button" class="sr-step' + (S.view === st.key ? ' on' : '') + '" data-step="' + st.key + '">' +
        '<span class="sr-step-n">' + (i + 1) + '</span>' + esc(st.label) + '<small>' + st.min + ' min</small></button>';
    }).join('');
    var u = new URL(location.href);
    u.searchParams.set('grade', S.grade); u.searchParams.set('lesson', S.lesson);
    try { history.replaceState(null, '', u.pathname + u.search); } catch (e) {}
  }

  function tickClock() {
    var el = $('sr-clock');
    if (!S.clockStart) { el.textContent = '⏱ 0:00'; return; }
    var s = Math.floor((Date.now() - S.clockStart) / 1000);
    el.textContent = '⏱ ' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    el.classList.toggle('late', s > 35 * 60);
  }

  function go(view) {
    stopTimers();
    if (!S.clockStart && view !== 'home') S.clockStart = Date.now();
    S.view = view;
    renderHeader();
    var st = $('sr-stage');
    st.className = 'sr-stage v-' + view;
    ({ home: viewHome, hook: viewHook, describe: viewDescribe, spot: viewSpot, game: viewGame, exit: viewExit }[view] || viewHome)(st);
  }

  /* ---------- timers ---------- */
  var timers = [];
  function stopTimers() { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; if (root.speechSynthesis) root.speechSynthesis.cancel(); }

  /* ---------- HOME ---------- */
  function viewHome(st) {
    var L = D.LESSONS[S.lesson];
    var cards = L.units.map(function (u) {
      var un = D.UNITS[S.grade][u];
      return '<div class="sr-unitcard"><img src="' + picSrc(S.grade, u, un.pics[0].id) + '" alt=""><b>Unit ' + u + '</b><span>' + esc(un.title) + '</span></div>';
    }).join('');
    st.innerHTML =
      '<section class="sr-home">' +
      '<div class="sr-home-card">' +
      '<h1>Talk Time Review</h1>' +
      '<p class="sr-sub">Grade ' + S.grade + ' · Lesson ' + S.lesson + ' of 2 · 35 minutes</p>' +
      '<div class="sr-units">' + cards + '</div>' +
      '<ol class="sr-plan">' + L.steps.map(function (s) { return '<li><b>' + esc(s.label) + '</b> <span>' + s.min + ' min</span></li>'; }).join('') + '</ol>' +
      '<div class="sr-home-btns">' +
      '<button type="button" class="sr-btn big green" data-go="hook">▶ Start the lesson</button>' +
      '<button type="button" class="sr-btn blue" data-go="describe">🗣️ Describe &amp; guess</button>' +
      '<button type="button" class="sr-btn pink" data-go="spot">🔍 Spot the difference</button>' +
      '</div></div></section>';
  }

  /* ---------- HOOK ---------- */
  function viewHook(st) {
    var slides = D.HOOK[S.grade][S.lesson];
    st.innerHTML = '<section class="sr-hook"><div class="sr-hook-frame" id="sr-hook-frame"></div>' +
      '<div class="sr-row"><button type="button" class="sr-btn" id="sr-hook-again">↻ Again</button>' +
      '<button type="button" class="sr-btn big green" data-go="describe">Next: Describe &amp; guess →</button></div></section>';
    var frame = $('sr-hook-frame');
    var vidSrc = 'video/g' + S.grade + '-hook-' + S.lesson + '.mp4';
    var v = document.createElement('video');
    v.className = 'sr-hook-video'; v.controls = true; v.playsInline = true; v.preload = 'auto';
    var usedFallback = false;
    function fallback() {
      if (usedFallback) return; usedFallback = true;
      if (v.parentNode) v.parentNode.removeChild(v);
      playSlides(frame, slides);
    }
    v.addEventListener('error', fallback);
    v.addEventListener('loadeddata', function () { if (!usedFallback) { frame.innerHTML = ''; frame.appendChild(v); try { v.play(); } catch (e) {} } });
    v.src = vidSrc;
    timers.push(setTimeout(function () { if (v.readyState < 2) fallback(); }, 1500));
    $('sr-hook-again').onclick = function () { stopTimers(); usedFallback = false; viewHook(st); };
  }

  function playSlides(frame, slides) {
    var i = 0;
    function show() {
      if (i >= slides.length) {
        frame.innerHTML = '<div class="sr-hook-end"><b>Let’s talk!</b><span>Who can remember the most words?</span></div>';
        A.play('fanfare'); A.say("Let's talk!");
        return;
      }
      var s = slides[i], u = parseInt(s[0].slice(1), 10);
      frame.innerHTML = '<div class="sr-slide"><img src="' + picSrc(S.grade, u, s[1]) + '" alt=""><div class="sr-slide-cap">' + esc(s[2]) + '</div></div>';
      A.play('whoosh'); A.say(s[2]);
      i++;
      timers.push(setTimeout(show, 3800));
    }
    show();
  }

  /* ---------- DESCRIBE & GUESS ---------- */
  function buildDeck(mix) {
    var units = mix ? [1, 2, 3, 4, 5] : lessonUnits(), deck = [];
    units.forEach(function (u) { D.UNITS[S.grade][u].pics.forEach(function (p) { deck.push({ u: u, p: p }); }); });
    return shuffle(deck);
  }

  function viewDescribe(st) {
    if (!S.describe || S.describe.grade !== S.grade || S.describe.lesson !== S.lesson) {
      S.describe = { grade: S.grade, lesson: S.lesson, mode: 'hot', mix: false, deck: buildDeck(false), i: 0, phase: 'ready', help: false };
    }
    drawDescribe(st);
  }

  function drawDescribe(st) {
    var d = S.describe, item = d.deck[d.i], t = TEAMS[S.team];
    var mixBtn = S.lesson === 2 ? '<button type="button" class="sr-chip' + (d.mix ? ' on' : '') + '" id="sr-mix">🔀 Mix all 5 units</button>' : '';
    var top = '<div class="sr-toolbar">' +
      '<div class="sr-seg"><button type="button" class="sr-chip' + (d.mode === 'hot' ? ' on' : '') + '" data-mode="hot">🪑 Hot seat</button>' +
      '<button type="button" class="sr-chip' + (d.mode === 'blur' ? ' on' : '') + '" data-mode="blur">🌫️ Slow reveal</button></div>' + mixBtn +
      '<span class="sr-count">Picture ' + Math.min(d.i + 1, d.deck.length) + ' / ' + d.deck.length + '</span></div>';

    if (!item) {
      st.innerHTML = '<section class="sr-desc">' + top + '<div class="sr-done"><b>All pictures done! 🎉</b>' +
        '<button type="button" class="sr-btn green" id="sr-desc-restart">↻ Shuffle again</button>' +
        '<button type="button" class="sr-btn big pink" data-go="spot">Next: Spot the difference →</button></div></section>';
      $('sr-desc-restart').onclick = function () { d.deck = buildDeck(d.mix); d.i = 0; d.phase = 'ready'; drawDescribe(st); };
      wireDescTop(st);
      return;
    }

    var how = d.mode === 'hot'
      ? 'One pupil from <b style="color:' + t.color + '">Team ' + t.name + '</b> sits with their back to the board. Their team describes the picture. No pointing and no saying the word!'
      : 'The picture starts blurry. <b style="color:' + t.color + '">Team ' + t.name + '</b> says what they can see. Guess it before it is clear!';

    var frames = D.FRAMES[S.grade].map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    var clues = item.p.clues.map(function (c) { return '<span class="sr-clue">' + esc(c) + '</span>'; }).join('');

    var body;
    if (d.phase === 'ready') {
      body = '<div class="sr-ready" style="--tc:' + t.color + '"><img src="' + monImg(t, 'think') + '" alt="">' +
        '<p>' + how + '</p><button type="button" class="sr-btn big" style="--bc:' + t.color + '" id="sr-show">👀 Show the picture</button></div>';
    } else {
      body = '<div class="sr-desc-main">' +
        '<div class="sr-picwrap' + (d.mode === 'blur' && d.phase === 'show' ? ' blurring' : '') + '" id="sr-picwrap">' +
        '<img id="sr-pic" src="' + picSrc(S.grade, item.u, item.p.id) + '" alt="Mystery picture" draggable="false">' +
        (d.phase === 'done' ? '<div class="sr-word">' + esc(item.p.word) + '</div>' : '') +
        '<div class="sr-timer" id="sr-timer">45</div></div>' +
        '<aside class="sr-side"><h3>Say it!</h3><ul class="sr-frames">' + frames + '</ul>' +
        '<button type="button" class="sr-chip" id="sr-help">' + (d.help ? '🙈 Hide' : '💡 Help') + ' words</button>' +
        '<div class="sr-clues' + (d.help ? ' on' : '') + '">' + clues + '</div>' +
        '<div class="sr-actions">' +
        (d.phase === 'show'
          ? '<button type="button" class="sr-btn big green" id="sr-got">✓ Guessed! +2</button>' +
            '<button type="button" class="sr-btn" id="sr-reveal">Show the word</button>'
          : '<button type="button" class="sr-btn big blue" id="sr-next">Next team →</button>') +
        '</div></aside></div>';
    }
    st.innerHTML = '<section class="sr-desc">' + top + body + '</section>';
    wireDescTop(st);

    if (d.phase === 'ready') {
      $('sr-show').onclick = function () { A.play('flip'); d.phase = 'show'; drawDescribe(st); startDescTimer(st); };
    } else {
      $('sr-help').onclick = function () { d.help = !d.help; A.play('tap'); drawDescribe(st); if (d.phase === 'show') startDescTimer(st, true); };
      if (d.phase === 'show') {
        $('sr-got').onclick = function () { addPoints(S.team, 2); finishDesc(st, true); };
        $('sr-reveal').onclick = function () { finishDesc(st, false); };
      } else {
        $('sr-next').onclick = function () { d.i++; d.phase = 'ready'; nextTeam(); drawDescribe(st); };
      }
    }
  }

  function wireDescTop(st) {
    var d = S.describe;
    st.querySelectorAll('[data-mode]').forEach(function (b) {
      b.onclick = function () { d.mode = b.getAttribute('data-mode'); d.phase = 'ready'; stopTimers(); A.play('tap'); drawDescribe(st); };
    });
    var mix = $('sr-mix');
    if (mix) mix.onclick = function () { d.mix = !d.mix; d.deck = buildDeck(d.mix); d.i = 0; d.phase = 'ready'; stopTimers(); A.play('tap'); drawDescribe(st); };
  }

  var descLeft = 45;
  function startDescTimer(st, resume) {
    stopTimers();
    if (!resume) descLeft = 45;
    var el = $('sr-timer'), wrap = $('sr-picwrap'), pic = $('sr-pic');
    function paint() {
      if (!el) return;
      el.textContent = descLeft;
      el.classList.toggle('low', descLeft <= 10);
      if (S.describe.mode === 'blur' && pic) {
        var px = Math.max(0, Math.round(26 * (descLeft - 8) / 37));
        pic.style.filter = 'blur(' + px + 'px)';
      }
    }
    paint();
    timers.push(setInterval(function () {
      descLeft--;
      if (descLeft <= 5 && descLeft > 0) A.play('tick');
      paint();
      if (descLeft <= 0) { A.play('timeUp'); finishDesc(st, false); }
    }, 1000));
    if (wrap) wrap.classList.add('live');
  }

  function finishDesc(st, won) {
    stopTimers();
    var d = S.describe, item = d.deck[d.i];
    d.phase = 'done';
    drawDescribe(st);
    var pic = $('sr-pic'); if (pic) pic.style.filter = 'none';
    if (won) { A.play('right'); confetti(18); }
    A.say((won ? 'Yes! ' : '') + "It's " + item.p.word + '!');
  }

  /* ---------- SPOT THE DIFFERENCE ---------- */
  function viewSpot(st) {
    var units = lessonUnits();
    if (!S.spot || S.spot.grade !== S.grade || S.spot.lesson !== S.lesson) {
      S.spot = { grade: S.grade, lesson: S.lesson, u: units[0], found: {} };
    }
    drawSpot(st);
  }

  function spotKey() { return S.grade + '-' + S.spot.u; }

  function drawSpot(st) {
    var sp = S.spot, sc = D.SPOT[S.grade][sp.u], key = spotKey();
    var found = sp.found[key] || (sp.found[key] = []);
    var tabs = lessonUnits().map(function (u) {
      var k = S.grade + '-' + u, n = (sp.found[k] || []).length;
      return '<button type="button" class="sr-chip' + (u === sp.u ? ' on' : '') + '" data-unit="' + u + '">Unit ' + u + ' · ' + esc(D.SPOT[S.grade][u].title) + (n ? ' <b>' + n + '/5</b>' : '') + '</button>';
    }).join('');
    var dots = sc.diffs.map(function (df, i) { return '<span class="sr-dot' + (found.indexOf(i) >= 0 ? ' on' : '') + '">' + (found.indexOf(i) >= 0 ? '✓' : (i + 1)) + '</span>'; }).join('');
    function pane(ab) {
      return '<div class="sr-pane" data-ab="' + ab + '"><span class="sr-pane-tag">' + ab.toUpperCase() + '</span>' +
        '<img src="art/spot/g' + S.grade + '-u' + sp.u + '-' + ab + '.webp" alt="Picture ' + ab.toUpperCase() + '" draggable="false">' +
        '<div class="sr-rings" id="sr-rings-' + ab + '"></div></div>';
    }
    st.innerHTML = '<section class="sr-spot">' +
      '<div class="sr-toolbar">' + tabs + '<button type="button" class="sr-btn" id="sr-hint">💡 Show one</button>' +
      '<button type="button" class="sr-btn blue" id="sr-spot-next">Next →</button></div>' +
      '<div class="sr-frame-bar"><span class="sr-frame-lbl">Say:</span> <span>' + esc(sc.frame) + '</span><span class="sr-dots">' + dots + '</span></div>' +
      '<div class="sr-panes">' + pane('a') + pane('b') +
      '<div class="sr-said" id="sr-said">Say the sentence first, then tap the difference!</div></div>' +
      '</section>';

    found.forEach(function (i) { drawRings(sc.diffs[i], false); });
    showSaid(found.length ? found.length + ' of 5 found. Keep looking!' : 'Say the sentence first, then tap the difference!', 3500);

    st.querySelectorAll('[data-unit]').forEach(function (b) {
      b.onclick = function () { sp.u = parseInt(b.getAttribute('data-unit'), 10); A.play('tap'); drawSpot(st); };
    });
    st.querySelectorAll('.sr-pane').forEach(function (p) {
      p.addEventListener('pointerdown', function (e) { onSpotTap(st, p, e); });
    });
    $('sr-hint').onclick = function () {
      for (var i = 0; i < sc.diffs.length; i++) if (found.indexOf(i) < 0) { markFound(st, i, false); return; }
    };
    $('sr-spot-next').onclick = function () {
      var us = lessonUnits(), at = us.indexOf(sp.u);
      if (at < us.length - 1) { sp.u = us[at + 1]; drawSpot(st); }
      else go(S.lesson === 2 ? 'game' : 'exit');
    };
  }

  var saidT = 0;
  function showSaid(html, ms) {
    var el = $('sr-said'); if (!el) return;
    el.innerHTML = html; el.classList.remove('gone');
    clearTimeout(saidT);
    saidT = setTimeout(function () { var e2 = $('sr-said'); if (e2) e2.classList.add('gone'); }, ms || 4500);
  }

  function drawRings(df, fresh) {
    ['a', 'b'].forEach(function (ab) {
      var box = $('sr-rings-' + ab); if (!box) return;
      df.rects.forEach(function (r) {
        if (r[4] && r[4] !== ab) return;
        var el = document.createElement('div');
        el.className = 'sr-ring' + (fresh ? ' fresh' : '');
        el.style.left = (r[0] / 15.36) + '%';
        el.style.top = (r[1] / 10.24) + '%';
        el.style.width = ((r[2] - r[0]) / 15.36) + '%';
        el.style.height = ((r[3] - r[1]) / 10.24) + '%';
        box.appendChild(el);
      });
    });
  }

  function onSpotTap(st, pane, e) {
    var img = pane.querySelector('img'), rc = img.getBoundingClientRect();
    if (!rc.width) return;
    var x = (e.clientX - rc.left) / rc.width * 1536, y = (e.clientY - rc.top) / rc.height * 1024;
    var side = pane.getAttribute('data-ab');
    var sc = D.SPOT[S.grade][S.spot.u], found = S.spot.found[spotKey()], pad = 34, best = -1, bestArea = 1e12;
    sc.diffs.forEach(function (df, i) {
      if (found.indexOf(i) >= 0) return;
      df.rects.forEach(function (r) {
        if (r[4] && r[4] !== side) return;
        if (x >= r[0] - pad && x <= r[2] + pad && y >= r[1] - pad && y <= r[3] + pad) {
          var area = (r[2] - r[0]) * (r[3] - r[1]);
          if (area < bestArea) { bestArea = area; best = i; }
        }
      });
    });
    if (best >= 0) { markFound(st, best, true); return; }
    var miss = document.createElement('div');
    miss.className = 'sr-miss';
    miss.style.left = (x / 15.36) + '%'; miss.style.top = (y / 10.24) + '%';
    pane.querySelector('.sr-rings').appendChild(miss);
    setTimeout(function () { if (miss.parentNode) miss.parentNode.removeChild(miss); }, 700);
    A.play('soft');
    showSaid('Not there. Look closely!', 1600);
    var said = $('sr-said');
    if (said) { said.classList.remove('wobble'); void said.offsetWidth; said.classList.add('wobble'); }
  }

  function markFound(st, i, byPupil) {
    var sc = D.SPOT[S.grade][S.spot.u], found = S.spot.found[spotKey()];
    if (found.indexOf(i) >= 0) return;
    found.push(i);
    var df = sc.diffs[i];
    drawRings(df, true);
    var said = $('sr-said');
    if (said) said.classList.remove('wobble');
    showSaid('<span class="sr-sa">' + esc(df.a) + '</span> <span class="sr-sb">' + esc(df.b) + '</span>', 5000);
    var dots = st.querySelectorAll('.sr-dot');
    if (dots[i]) { dots[i].classList.add('on'); dots[i].textContent = '✓'; }
    if (byPupil) { addPoints(S.team, 1); A.play('right'); } else { A.play('flip'); }
    A.say(df.a + ' ' + df.b);
    if (found.length === sc.diffs.length) {
      timers.push(setTimeout(function () { A.play('fanfare'); confetti(40); showSaid('<b>All 5 found! 🎉</b>', 4000); }, 2600));
    }
  }

  /* ---------- TEAM GAME ---------- */
  function viewGame(st) {
    st.innerHTML = '<section class="sr-home"><div class="sr-home-card"><h1>Team Game</h1>' +
      '<p class="sr-sub">5 minutes · every right answer moves your team on</p>' +
      '<div class="sr-home-btns">' +
      '<a class="sr-btn big blue" href="../games/board3d/index.html">🎲 3D Board Game</a>' +
      '<a class="sr-btn big pink" href="../game-maker/index.html">🎮 All Games</a>' +
      '</div><div class="sr-row"><button type="button" class="sr-btn green" data-go="exit">Next: Traffic light →</button></div></div></section>';
  }

  /* ---------- EXIT ---------- */
  function viewExit(st) {
    if (S.lesson === 1) return viewExitSentence(st);
    var key = 'eaa_speakreview_traffic_g' + S.grade, saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) {}
    var rows = [1, 2, 3, 4, 5].map(function (u) {
      var cur = saved['u' + u] || '';
      return '<div class="sr-tl-row"><img src="' + picSrc(S.grade, u, D.UNITS[S.grade][u].pics[0].id) + '" alt="">' +
        '<b>Unit ' + u + '</b><span>' + esc(D.UNITS[S.grade][u].title) + '</span>' +
        ['green', 'amber', 'red'].map(function (c) {
          return '<button type="button" class="sr-tl ' + c + (cur === c ? ' on' : '') + '" data-u="' + u + '" data-c="' + c + '" aria-label="' + c + '"></button>';
        }).join('') + '</div>';
    }).join('');
    st.innerHTML = '<section class="sr-home"><div class="sr-home-card wide"><h1>Traffic Light</h1>' +
      '<p class="sr-sub">🟢 I can talk about it · 🟡 A little · 🔴 I need help</p>' +
      '<div class="sr-tl-list">' + rows + '</div>' +
      '<div class="sr-row"><button type="button" class="sr-btn big green" id="sr-party">🏆 Finish &amp; celebrate</button></div></div></section>';
    st.querySelectorAll('.sr-tl').forEach(function (b) {
      b.onclick = function () {
        var u = b.getAttribute('data-u'), c = b.getAttribute('data-c');
        saved['u' + u] = c; saved.updated = new Date().toISOString().slice(0, 10);
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        st.querySelectorAll('.sr-tl[data-u="' + u + '"]').forEach(function (x) { x.classList.toggle('on', x === b); });
        A.play('tap');
      };
    });
    $('sr-party').onclick = celebrate;
  }

  function viewExitSentence(st) {
    var deck = buildDeck(false), i = 0;
    function draw() {
      var it = deck[i % deck.length];
      st.innerHTML = '<section class="sr-home"><div class="sr-home-card"><h1>Exit Sentence</h1>' +
        '<p class="sr-sub">Every child says one sentence about the picture before leaving.</p>' +
        '<div class="sr-exit-pic"><img src="' + picSrc(S.grade, it.u, it.p.id) + '" alt=""></div>' +
        '<div class="sr-row"><button type="button" class="sr-btn big blue" id="sr-exit-next">Next pupil →</button>' +
        '<button type="button" class="sr-btn green" id="sr-party">🏆 Finish &amp; celebrate</button></div></div></section>';
      $('sr-exit-next').onclick = function () { i++; A.play('flip'); draw(); };
      $('sr-party').onclick = celebrate;
    }
    draw();
  }

  function celebrate() {
    var max = Math.max.apply(null, TEAMS.map(function (t) { return t.score; }));
    var winners = TEAMS.filter(function (t) { return t.score === max; });
    var ov = document.createElement('div');
    ov.className = 'sr-party';
    ov.innerHTML = '<div class="sr-party-card"><div class="sr-party-mons">' +
      TEAMS.map(function (t) { return '<img src="' + monImg(t, 'cheer') + '" alt="" class="' + (winners.indexOf(t) >= 0 && max > 0 ? 'win' : '') + '">'; }).join('') +
      '</div><h2>' + (max > 0 ? 'Well done, Team ' + winners.map(function (w) { return w.name; }).join(' & ') + '!' : 'Great talking, everyone!') + '</h2>' +
      '<p>You reviewed ' + (S.lesson === 1 ? 'Units 1, 2 and 3' : 'all 5 units') + '. Super speaking!</p>' +
      '<button type="button" class="sr-btn big green" id="sr-party-close">Close</button></div>';
    document.body.appendChild(ov);
    A.play('fanfare'); confetti(80);
    A.say(max > 0 ? 'Well done, team ' + winners.map(function (w) { return w.name; }).join(' and ') + '!' : 'Great talking, everyone!');
    $('sr-party-close').onclick = function () { ov.parentNode.removeChild(ov); };
  }

  /* ---------- confetti ---------- */
  function confetti(n) {
    var fx = $('sr-fx'), cols = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a', '#9b7bff'];
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      fx.appendChild(p);
      (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3400); })(p);
    }
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', function (e) {
    A.unlock();
    var g = e.target.closest('[data-go]');
    if (g) { A.play('tap'); go(g.getAttribute('data-go')); return; }
    var stp = e.target.closest('[data-step]');
    if (stp) { A.play('tap'); go(stp.getAttribute('data-step')); return; }
    var add = e.target.closest('[data-add]');
    if (add) { addPoints(+add.getAttribute('data-i'), +add.getAttribute('data-add')); return; }
    var pick = e.target.closest('.sr-team-pick');
    if (pick) { S.team = +pick.getAttribute('data-i'); A.play('tap'); renderTeams(); if (S.view === 'describe' && S.describe && S.describe.phase === 'ready') drawDescribe($('sr-stage')); }
  });

  $('sr-grade').onclick = function () { S.grade = S.grade === 3 ? 4 : 3; S.describe = null; S.spot = null; go(S.view); };
  $('sr-lesson').onclick = function () { S.lesson = S.lesson === 1 ? 2 : 1; S.describe = null; S.spot = null; go(S.view === 'game' || S.view === 'exit' ? 'home' : S.view); };
  $('sr-snd').onclick = function () { var m = A.toggle(); this.textContent = m ? '🔇' : '🔊'; };
  $('sr-fs').onclick = function () {
    try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) {}
  };
  $('sr-home').onclick = function () { go('home'); };

  renderTeams();
  setInterval(tickClock, 1000);
  tickClock();
  var start = params.get('game');
  go(start === 'describe' || start === 'spot' ? start : 'home');
})(window);
