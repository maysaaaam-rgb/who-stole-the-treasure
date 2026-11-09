/* Talk Show Studio: a 35-minute speaking lesson. Four teams, one smartboard, the teacher judges with one tap.
   Scenes: Studio opens 3 · Quick Questions 7 · Picture Talk 7 · Guest Chair 8 · Fast Talk 6 · That's a wrap 4 = 35 min.
   No microphone. No point is ever taken away: "Try again" only gives the team another go. */
(function () {
  'use strict';
  var D = window.TALK_SHOW, A = window.TSAudio;
  var qs = new URLSearchParams(location.search);
  var $ = function (id) { return document.getElementById(id); };
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function btn(label, cls, fn, title) { return h('button', { type: 'button', class: 'btn ' + (cls || ''), text: label, onclick: function (ev) { A.unlock(); fn(ev); }, title: title || '' }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- state ---------- */
  var S = { key: null, show: null, idx: -1, scores: [0, 0, 0, 0], turn: 0, cleanup: null };
  function saveKey() { return 'ts_scores_' + S.key + '_' + new Date().toDateString(); }
  function save() { try { sessionStorage.setItem(saveKey(), JSON.stringify(S.scores)); } catch (e) { /* private mode */ } }
  function load() { try { var v = JSON.parse(sessionStorage.getItem(saveKey()) || 'null'); if (Array.isArray(v) && v.length === 4) S.scores = v.map(function (n) { return Number(n) || 0; }); } catch (e) { /* ignore */ } }

  /* ---------- teams ---------- */
  function paintTeams() {
    var box = $('teams'); box.innerHTML = '';
    D.teams.forEach(function (t, i) {
      box.appendChild(h('div', { class: 'team' + (i === S.turn && S.idx > 0 && S.idx < 5 ? ' turn' : ''), id: 'tm' + i, style: '--c:' + t.c, title: t.n }, [
        h('span', { text: t.e + ' ' + t.n }), h('b', { text: String(S.scores[i]) })
      ]));
    });
  }
  function addPoints(i, n) {
    S.scores[i] += n; save(); paintTeams();
    var el = $('tm' + i); if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    if (n >= 2) A.star(); else A.good();
  }
  function teamName(i) { return D.teams[i].e + ' ' + D.teams[i].n; }
  function setTurn(i) { S.turn = ((i % 4) + 4) % 4; paintTeams(); }
  function turnBar(i, text) { var t = D.teams[i]; return h('div', { class: 'turnbar', style: '--c:' + t.c, text: t.e + ' ' + (text || (t.n + ', your turn!')) }); }

  /* ---------- signs ---------- */
  function sign(kind) {
    var s = $('sign'); s.hidden = false; s.innerHTML = '';
    s.appendChild(h('div', { class: kind, text: kind === 'clap' ? '👏 APPLAUSE!' : '🤫 QUIET' }));
    if (kind === 'clap') A.applause(); else { A.soft(); }
    clearTimeout(sign.t); sign.t = setTimeout(function () { s.hidden = true; }, kind === 'clap' ? 2400 : 1800);
  }
  function confetti() {
    var cs = ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e', '#a855f7'];
    for (var i = 0; i < 70; i++) {
      var c = h('div', { class: 'conf', style: 'left:' + (Math.random() * 100) + 'vw;background:' + cs[i % 5] + ';animation-duration:' + (1.8 + Math.random() * 1.8) + 's;animation-delay:' + (Math.random() * .6) + 's' });
      document.body.appendChild(c); setTimeout(function (x) { x.remove(); }.bind(null, c), 4200);
    }
  }

  /* ---------- judge panel (shared) ---------- */
  function judge(getTeam, opts) {
    opts = opts || {};
    var wrap = h('div', { class: 'judge' });
    wrap.appendChild(h('span', { class: 'lab', text: 'Teacher:' }));
    wrap.appendChild(btn('✓ Good answer +1', 'green', function () { addPoints(getTeam(), 1); if (opts.after) opts.after(1); }));
    wrap.appendChild(btn('⭐ Full sentence +2', 'violet', function () { addPoints(getTeam(), 2); sign('clap'); if (opts.after) opts.after(2); }));
    wrap.appendChild(btn('🔁 Try again', 'ghost', function () {
      A.soft(); var c = document.querySelector('.card,.pic,.guest'); if (c) { c.classList.remove('wobble'); void c.offsetWidth; c.classList.add('wobble'); }
      A.say('Try again! Your team can help you.');
    }, 'No points lost. The team helps and tries again.'));
    if (opts.help) wrap.appendChild(btn('💡 Help', 'amber', opts.help, 'Show and say a model answer'));
    wrap.appendChild(h('span', { class: 'sp' }));
    if (opts.next) wrap.appendChild(btn(opts.nextLabel || 'Next card ▶', 'cyan', opts.next));
    return wrap;
  }
  function hostFace(img, e) {
    var f = h('div', { class: 'host' });
    if (img) { var im = h('img', { src: img, alt: '', draggable: 'false' }); im.onerror = function () { f.textContent = e || '🎤'; }; f.appendChild(im); } else f.textContent = e || '🎤';
    return f;
  }

  /* ---------- scenes ---------- */
  var SCENES = [
    { t: 'Studio opens', mins: 3, run: sceneOpen, tip: [
      'Pupils sit in 4 teams. Each team has a name on the screen: Mics, Cameras, Stars, Speakers.',
      'Press “Start the show”: jingle, ON AIR light, the host says hello.',
      'Practise the signs: 👏 Applause = everyone claps; 🤫 Quiet = finger on lips. Use them all lesson for classroom control.',
      'Outcome: Students will be able to greet an audience and follow classroom instructions in English.'] },
    { t: 'Quick Questions', mins: 7, run: sceneQuick, tip: [
      'The team on turn chooses one speaker. The speaker answers in a sentence. The team can whisper help.',
      '✓ = a good answer (1 point). ⭐ = a full sentence with the frame (2 points + applause).',
      '🔁 Try again never takes points: the same speaker tries again with team help. 💡 shows and says a model answer.',
      'Change the speaker every time, so many pupils speak. Aim for 8 cards in 7 minutes.',
      'Outcome: Students will be able to answer simple questions about the unit with a full sentence.'] },
    { t: 'Picture Talk', mins: 7, run: scenePics, tip: [
      'One picture per team. The speaker says up to 3 sentences about it, using the word chips and frames.',
      'Tap “+1 sentence” for each correct sentence (max 3). Tap a word chip to hear it.',
      'Weaker pupils: one sentence with a frame is great. Stronger pupils: add a describing word (big, old, loud…).',
      'Outcome: Students will be able to describe a picture with 2–3 simple sentences.'] },
    { t: 'Guest Chair', mins: 8, run: sceneGuest, tip: [
      'Put a chair at the front: the guest’s chair. One pupil from the guest team sits there and becomes the character.',
      'The asking team chooses a question card and asks it out loud. The guest answers as the character.',
      'Points: good question +1 for the askers; good answer +1 or great answer +2 for the guest team.',
      'Then roles move on: the guest team asks next, a new team sits in the chair. Clap for every guest!',
      'Outcome: Students will be able to ask and answer interview questions in role.'] },
    { t: 'Fast Talk 30', mins: 6, run: sceneFast, tip: [
      'Each team gets a topic and 30 seconds. Team members take turns to say one word or sentence about the topic.',
      'Tap the big +1 for every correct one. No repeats. The timer ends with a chime.',
      'Keep the energy high: count down out loud with the class at the end.',
      'Outcome: Students will be able to recall topic vocabulary quickly and fluently.'] },
    { t: 'That’s a wrap!', mins: 4, run: sceneWrap, tip: [
      'The podium shows the winners. Everyone claps for every team.',
      'Each team says the goodbye line together to the camera.',
      'Give the points as XP on the Class Board if you like (Class Board → +10 for each member of the winning team).',
      'Exit question: “What did you say on the show today?” Pupils answer one by one on the way out.'] }
  ];


  /* ---------- "How to play" screen before every round: pupils' steps, an example, the teacher's words ---------- */
  function HOW(i) {
    var sh = S.show, q = sh.quick[0], pic = sh.pics[0], g = sh.guest, f = sh.fast[0];
    return [
      { steps: [['🪑', 'Sit with your team.'], ['👏', 'Applause sign: clap!'], ['🤫', 'Quiet sign: finger on lips.']],
        say: 'Welcome to our TV show! You are in four teams. When you see APPLAUSE, clap. When you see QUIET, be quiet. Let’s practise!' },
      { steps: [['👥', 'Your team chooses ONE speaker.'], ['👀', 'Read the question. Look at the blue sentence.'], ['🗣️', 'Say a full sentence. Your team can whisper help.']],
        ex: [q.q, q.a], say: 'Team ' + D.teams[0].n + ', choose a speaker. Listen to the question. Answer with a full sentence. Full sentence = 2 points!' },
      { steps: [['👀', 'Look at the picture.'], ['🔤', 'Use the words and the blue sentences.'], ['🗣️', 'Say 3 sentences. 1 point for each.']],
        ex: [pic.f[0].replace('___', pic.words[0]), pic.f[1].replace('___', pic.words[1])], say: 'Look at the picture. Tell me 3 things. Use the words on the board. One point for every good sentence.' },
      { steps: [['🪑', 'One pupil sits in the guest chair. You are ' + g.who + '!'], ['❓', 'Another team asks a question from the cards.'], ['🎭', 'The guest answers like ' + g.who + '.']],
        ex: [g.qs[0].q, g.qs[0].a], say: 'Today our guest is ' + g.who + '. One pupil, come and sit in the guest chair. Another team, choose a question and ask it. Guest, answer like ' + g.who + '.' },
      { steps: [['⏱️', 'You have 30 seconds.'], ['🔁', 'Team members take turns.'], ['🗣️', 'Say words or sentences about the topic. No repeats!']],
        ex: [f.e + ' ' + f.t, f.f], say: 'You have 30 seconds. Take turns. Say as many words as you can about the topic. Ready? Go!' },
      null
    ][i];
  }
  function howScreen(st, i, then) {
    var H = HOW(i); if (!H) { then(); return; }
    var box = h('div', { class: 'glass how' });
    box.appendChild(h('div', { class: 'how-k', text: 'How to play' }));
    box.appendChild(h('ol', { class: 'how-steps' }, H.steps.map(function (s, k) { return h('li', {}, [h('span', { class: 'how-i', text: s[0] }), h('b', { text: (k + 1) + '. ' }), document.createTextNode(s[1])]); })));
    if (H.ex) box.appendChild(h('div', { class: 'how-ex' }, [h('span', { class: 'lab', text: 'Example' }), h('div', { class: 'how-q', text: H.ex[0] }), h('div', { class: 'how-a', text: H.ex[1] })]));
    box.appendChild(h('div', { class: 'how-say' }, [h('span', { text: '🧑‍🏫 Teacher says: ' }), document.createTextNode('“' + H.say + '”')]));
    box.appendChild(h('div', { class: 'row', style: 'justify-content:center;margin-top:16px' }, [
      btn('🔈 Read the rules', 'ghost', function () { A.say(H.steps.map(function (s) { return s[1]; }).join(' ')); }),
      i === 0 ? null : btn('▶ Start the round', 'green big', function () { box.remove(); then(); })
    ]));
    st.appendChild(box);
    if (i === 0) then();
  }
  function renderSteps() {
    var box = $('steps'); box.innerHTML = '';
    SCENES.forEach(function (s, i) {
      box.appendChild(h('button', { type: 'button', class: 'step' + (i === S.idx ? ' on' : i < S.idx ? ' done' : ''), text: s.t + ' · ' + s.mins + 'm', onclick: function () { go(i); } }));
    });
    $('back').disabled = S.idx <= 0; $('next').textContent = S.idx >= SCENES.length - 1 ? 'New show ↺' : 'Next ▶';
  }
  function go(i) {
    if (S.cleanup) { try { S.cleanup(); } catch (e) { /* ignore */ } S.cleanup = null; }
    try { window.speechSynthesis.cancel(); } catch (e) { /* no voice */ }
    S.idx = i; $('tip').hidden = true; $('sign').hidden = true;
    var st = $('stage'); st.innerHTML = ''; $('onair').classList.toggle('live', i >= 0 && i < SCENES.length - 1);
    var sc = SCENES[i];
    st.appendChild(h('div', { class: 'scene-h' }, [h('h2', { text: sc.t }), h('span', { text: sc.mins + ' minutes' })]));
    howScreen(st, i, function () { sc.run(st); });
    renderSteps(); paintTeams();
  }
  function tipShow() {
    var t = $('tip'); if (!t.hidden) { t.hidden = true; return; }
    var sc = SCENES[S.idx]; t.innerHTML = '';
    t.appendChild(h('h3', { text: '💡 ' + sc.t + ' (' + sc.mins + ' min)' }));
    t.appendChild(h('ul', {}, sc.tip.map(function (x) { return h('li', { text: x }); })));
    t.hidden = false;
  }

  /* 1. studio opens */
  function sceneOpen(st) {
    var box = h('div', { class: 'glass open' });
    box.appendChild(h('div', { class: 'studio-title', text: S.show.name }));
    box.appendChild(h('div', { class: 'lab', text: S.show.sub }));
    box.appendChild(h('div', { class: 'tlist' }, D.teams.map(function (t) { return h('div', { style: '--c:' + t.c, text: t.e + ' ' + t.n }); })));
    box.appendChild(h('div', { class: 'row', style: 'justify-content:center;margin-top:22px' }, [
      btn('▶ Start the show', 'green huge', function () { A.jingle(); setTimeout(function () { A.say(S.show.host); }, 900); $('onair').classList.add('live'); })
    ]));
    box.appendChild(h('div', { class: 'lab', style: 'margin-top:22px', text: 'Practise the signs with the class:' }));
    box.appendChild(h('div', { class: 'signs' }, [
      btn('👏 Applause! Everyone claps', 'amber big', function () { sign('clap'); A.say('Applause!'); }),
      btn('🤫 Quiet! Finger on lips', 'cyan big', function () { sign('hush'); A.say('Quiet, please.'); })
    ]));
    st.appendChild(box);
  }

  /* 2. quick questions */
  function sceneQuick(st) {
    var cards = shuffle(S.show.quick), i = 0;
    var box = h('div', { class: 'glass' }), body = h('div');
    box.appendChild(body); st.appendChild(box);
    function draw() {
      body.innerHTML = '';
      var c = cards[i % cards.length];
      body.appendChild(turnBar(S.turn));
      var help = h('div', { class: 'help' });
      body.appendChild(h('div', { class: 'card' }, [hostFace('', '🎤'), h('div', {}, [
        h('div', { class: 'count', text: 'Card ' + (i + 1) + ' of ' + cards.length }),
        h('div', { class: 'q', text: c.q }),
        h('div', { class: 'frame', text: c.f }), help,
        h('div', { class: 'row', style: 'margin-top:8px' }, [btn('🔈 Hear the question', 'ghost small', function () { A.say(c.q); })])
      ])]));
      body.appendChild(judge(function () { return S.turn; }, {
        help: function () { help.textContent = '💡 ' + c.a; A.say(c.a); },
        next: function () { i++; setTurn(S.turn + 1); if (i >= cards.length) { cards = shuffle(S.show.quick); i = 0; } draw(); A.tap(); },
        after: function () { setTimeout(function () { i++; setTurn(S.turn + 1); if (i >= cards.length) { cards = shuffle(S.show.quick); i = 0; } draw(); }, 1100); }
      }));
      setTimeout(function () { A.say(c.q); }, 250);
    }
    draw();
  }

  /* 3. picture talk */
  function scenePics(st) {
    var pics = shuffle(S.show.pics), i = 0, said = 0;
    var box = h('div', { class: 'glass' }), body = h('div'); box.appendChild(body); st.appendChild(box);
    function draw() {
      body.innerHTML = ''; said = 0;
      var p = pics[i % pics.length], view = h('div', { class: 'view' });
      if (p.img) { var im = h('img', { src: p.img, alt: '', class: /\/bg_/.test(p.img) ? 'full' : '', draggable: 'false' }); im.onerror = function () { view.innerHTML = ''; view.appendChild(h('span', { class: 'e', text: p.e })); }; view.appendChild(im); }
      else view.appendChild(h('span', { class: 'e', text: p.e }));
      var tally = h('div', { class: 'tally', 'aria-label': 'Sentences said' });
      body.appendChild(turnBar(S.turn, D.teams[S.turn].n + ': say 3 things about the picture!'));
      body.appendChild(h('div', { class: 'pic' }, [view, h('div', {}, [
        h('div', { class: 'lab', text: 'Use these words:' }),
        h('div', { class: 'chips' }, p.words.map(function (w) { return h('button', { type: 'button', class: 'chip', text: w, onclick: function () { A.unlock(); A.say(w); } }); })),
        h('div', { class: 'frames' }, p.f.map(function (f) { return h('div', { text: f }); })),
        tally
      ])]));
      var plus = btn('+1 sentence', 'green big', function () {
        if (said >= 3) return; said++; addPoints(S.turn, 1); tally.textContent = '⭐'.repeat(said);
        if (said >= 3) { sign('clap'); plus.disabled = true; }
      });
      var j = h('div', { class: 'judge' }, [h('span', { class: 'lab', text: 'Teacher: tap once for each correct sentence (max 3).' }), plus,
        btn('🔁 Try again', 'ghost', function () { A.soft(); A.say('Try again! Look at the words.'); }), h('span', { class: 'sp' }),
        btn('Next picture ▶', 'cyan', function () { i++; setTurn(S.turn + 1); draw(); A.tap(); })]);
      body.appendChild(j);
    }
    draw();
  }

  /* 4. guest chair */
  function sceneGuest(st) {
    var g = S.show.guest, guestTeam = S.turn, used = {}, cur = null;
    var box = h('div', { class: 'glass' }), body = h('div'); box.appendChild(body); st.appendChild(box);
    function asker() { return (guestTeam + 1) % 4; }
    function draw() {
      body.innerHTML = '';
      var help = h('div', { class: 'help' });
      body.appendChild(h('div', { class: 'roles' }, [turnBar(guestTeam, D.teams[guestTeam].n + ': one pupil sits in the guest chair'), turnBar(asker(), D.teams[asker()].n + ': ask a question')]));
      var grid = h('div', { class: 'qgrid' });
      g.qs.forEach(function (q, k) {
        grid.appendChild(h('button', { type: 'button', class: 'qc' + (cur === k ? ' on' : used[k] ? ' used' : ''), text: q.q, onclick: function () { A.unlock(); cur = k; used[k] = 1; A.tap(); draw(); A.say(q.q); } }));
      });
      body.appendChild(h('div', { class: 'guest' }, [
        h('div', { class: 'chair' }, [hostFace(g.img, g.e), h('h3', { text: 'Guest: ' + g.who }), h('p', { text: g.intro })]),
        h('div', {}, [h('div', { class: 'lab', style: 'margin-bottom:8px', text: 'Askers: tap a question and ask it out loud.' }), grid, help])
      ]));
      var j = h('div', { class: 'judge' }, [
        h('span', { class: 'lab', text: 'Teacher:' }),
        btn('❓ Good question +1', 'cyan', function () { addPoints(asker(), 1); }),
        btn('✓ Good answer +1', 'green', function () { addPoints(guestTeam, 1); }),
        btn('⭐ Great answer +2', 'violet', function () { addPoints(guestTeam, 2); sign('clap'); }),
        btn('💡 Help', 'amber', function () { if (cur == null) { help.textContent = 'Tap a question first.'; return; } help.textContent = '💡 ' + g.qs[cur].a; A.say(g.qs[cur].a); }),
        h('span', { class: 'sp' }),
        btn('Next guest ▶', 'amber', function () { sign('clap'); guestTeam = (guestTeam + 1) % 4; setTurn(guestTeam); cur = null; used = {}; setTimeout(draw, 300); })
      ]);
      body.appendChild(j);
      setTurn(guestTeam);
    }
    draw();
    setTimeout(function () { A.say('Our guest today is ' + g.who + '!'); }, 300);
  }

  /* 5. fast talk */
  function sceneFast(st) {
    var topics = S.show.fast, i = 0, timer = null, left = 30, got = 0;
    var box = h('div', { class: 'glass fast' }), body = h('div'); box.appendChild(body); st.appendChild(box);
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    S.cleanup = stop;
    function draw() {
      stop(); body.innerHTML = ''; left = 30; got = 0;
      var t = topics[i % topics.length];
      var ring = h('div', { class: 'ring', style: '--p:1' }, [h('b', { text: '30' })]);
      var cnt = h('div', { class: 'fcount', text: '0' });
      var plus = btn('+1', 'green huge plus', function () { if (!timer) return; got++; cnt.textContent = String(got); addPoints(S.turn, 1); });
      plus.disabled = true;
      var start = btn('▶ Start 30 seconds', 'amber big', function () {
        start.disabled = true; plus.disabled = false; A.drumroll();
        timer = setInterval(function () {
          left--; ring.style.setProperty('--p', String(left / 30)); ring.firstChild.textContent = String(left); ring.classList.toggle('low', left <= 5);
          if (left <= 5 && left > 0) A.tick();
          if (left <= 0) { stop(); plus.disabled = true; A.end(); sign('clap'); A.say(got + (got === 1 ? ' point' : ' points') + '! Well done, ' + D.teams[S.turn].n + '!'); }
        }, 1000);
      });
      body.appendChild(turnBar(S.turn));
      body.appendChild(h('div', { class: 'topic', text: t.e + ' ' + t.t }));
      body.appendChild(h('div', { class: 'hint', text: t.f }));
      body.appendChild(ring);
      body.appendChild(h('div', { class: 'row', style: 'justify-content:center' }, [start, plus]));
      body.appendChild(cnt);
      body.appendChild(h('div', { class: 'judge', style: 'justify-content:flex-end' }, [h('span', { class: 'lab', text: 'Tap +1 for every correct word or sentence. No repeats!' }), h('span', { class: 'sp' }),
        btn('Next team ▶', 'cyan', function () { i++; setTurn(S.turn + 1); draw(); A.tap(); })]));
      setTimeout(function () { A.say(D.teams[S.turn].n + '! Your topic is: ' + t.t); }, 250);
    }
    draw();
  }

  /* 6. that's a wrap */
  function sceneWrap(st) {
    var order = D.teams.map(function (t, i) { return { t: t, s: S.scores[i] }; }).sort(function (a, b) { return b.s - a.s; });
    var box = h('div', { class: 'glass open' });
    box.appendChild(h('div', { class: 'studio-title', text: 'That’s a wrap!' }));
    var heights = [190, 140, 105, 80], places = [1, 0, 2, 3], medals = ['🥇', '🥈', '🥉', '⭐'];
    box.appendChild(h('div', { class: 'podium' }, places.map(function (p) {
      var o = order[p]; if (!o) return null;
      return h('div', { class: 'pod', style: '--c:' + o.t.c }, [h('div', { class: 'nm', text: medals[p] + ' ' + o.t.e + ' ' + o.t.n }), h('div', { class: 'blk', style: 'height:' + heights[p] + 'px', text: String(o.s) })]);
    })));
    box.appendChild(h('div', { class: 'frame', text: 'Everyone together: “' + S.show.bye + '”' }));
    box.appendChild(h('div', { class: 'row', style: 'justify-content:center;margin-top:20px' }, [
      btn('🔈 Say goodbye', 'ghost', function () { A.say(S.show.bye); }),
      btn('👏 Applause', 'amber', function () { sign('clap'); }),
      h('a', { class: 'btn cyan', href: '../index.html#board', text: '📺 Give XP on the Class Board' }),
      btn('↺ Reset scores', 'ghost small', function () { if (confirm('Start the scores again at 0?')) { S.scores = [0, 0, 0, 0]; save(); go(S.idx); } })
    ]));
    st.appendChild(box);
    setTimeout(function () { A.drumroll(); setTimeout(function () { confetti(); A.applause(); A.say('And the winner is… ' + order[0].t.n + '!'); }, 1300); }, 300);
  }

  /* ---------- start: pick a show ---------- */
  var ART = { '3-1': '../magic-book/art/o_g3_timebook.webp', '3-2': '../magic-book/art/o_g3_timecapsule.webp', '4-1': '../magic-book/art/o_g4_soundprops.webp', '4-2': '../magic-book/art/o_g4_bigdrum.webp' };
  function startScreen() {
    $('foot').hidden = true; $('onair').classList.remove('live'); S.idx = -1; paintTeams();
    $('h-title').firstChild.nodeValue = 'Talk Show Studio'; $('h-sub').textContent = 'Speaking lesson · 35 minutes';
    var st = $('stage'); st.innerHTML = '';
    var box = h('div', { class: 'open' });
    box.appendChild(h('div', { class: 'studio-title', text: 'Talk Show Studio' }));
    box.appendChild(h('div', { class: 'lab', text: 'Choose tonight’s show. Two episodes per grade, so a second lesson gets a new show.' }));
    var grid = h('div', { class: 'picker' });
    Object.keys(D.shows).forEach(function (k) {
      var s = D.shows[k], b = h('button', { type: 'button', class: 'show', onclick: function () { A.unlock(); begin(k); } }, [
        h('span', { class: 'art' }, [h('img', { src: ART[k], alt: '', draggable: 'false' })]),
        h('span', { class: 'cap' }, [h('b', { text: s.name }), h('small', { text: 'Grade ' + s.grade + ' · ' + s.sub })])
      ]);
      grid.appendChild(b);
    });
    box.appendChild(grid); st.appendChild(box);
  }
  function begin(k) {
    S.key = k; S.show = D.shows[k]; S.scores = [0, 0, 0, 0]; S.turn = 0; load();
    $('h-title').firstChild.nodeValue = S.show.name; $('h-sub').textContent = 'Grade ' + S.show.grade + ' · ' + S.show.sub;
    $('foot').hidden = false;
    try { history.replaceState(null, '', '?grade=' + S.show.grade + '&ep=' + k.split('-')[1]); } catch (e) { /* file:// */ }
    $('printbtn').href = 'worksheet.html?grade=' + S.show.grade + '&ep=' + k.split('-')[1];
    go(0);
  }

  /* ---------- wiring ---------- */
  $('next').addEventListener('click', function () { A.unlock(); if (S.idx >= SCENES.length - 1) startScreen(); else go(S.idx + 1); });
  $('back').addEventListener('click', function () { if (S.idx > 0) go(S.idx - 1); });
  $('tipbtn').addEventListener('click', tipShow);
  $('clap').addEventListener('click', function () { A.unlock(); sign('clap'); });
  $('hush').addEventListener('click', function () { A.unlock(); sign('hush'); });
  $('snd').addEventListener('click', function () { var on = A.toggle(); $('snd').textContent = on ? '🔊' : '🔇'; });
  $('fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* not allowed */ } });
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && S.idx >= 0) $('next').click();
    else if (e.key === 'ArrowLeft' && S.idx > 0) $('back').click();
    else if (e.key === 'a' || e.key === 'A') $('clap').click();
    else if (e.key === 'q' || e.key === 'Q') $('hush').click();
  });

  var g = qs.get('grade'), ep = qs.get('ep') || '1', want = g + '-' + ep;
  if (D.shows[want]) begin(want); else startScreen();
})();
