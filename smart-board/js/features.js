/* Smart Board features: lesson words, spelling challenge, board race, "say it, see it" and stamps.
   Uses the shared board API (window.SB) from app.js. */
(function (root) {
  'use strict';
  const SB = root.SB, L = root.SmartLessons;
  if (!SB) return;
  const { $, esc, toast, AU, AI, BUILDERS, HANDLERS } = SB;
  const letters = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const TEAM_COLORS = ['#38bdf8', '#fb923c', '#a855f7', '#4ade80'];
  const TEAM_ICONS = ['🔵', '🟠', '🟣', '🟢'];
  SB.onStart = SB.onStart || [];

  function parseWords(arg) {
    const a = String(arg || '').trim();
    if (!a) return [];
    return (a.includes(',') ? a.split(',') : a.split(/\s+/)).map((w) => w.trim()).filter(Boolean).slice(0, 30);
  }
  async function lessonWords() {
    if (!L) return { words: [] };
    try { return await L.current(); } catch (e) { return { words: [] }; }
  }
  function pictureFor(word) { const p = SB.findArt(word); return p ? '../' + p : ''; }

  // Reads handwriting with the AI: what the child actually wrote (spelling kept)
  async function readWriting(strokes) {
    const box = SB.unionBox(strokes);
    const d = await AI.call('neat', { image: SB.strokesPNG(strokes, box, true) }, 30000);
    return { read: String(d.read || ''), kind: d.kind, box };
  }
  // Puts a neat word on the board where the writing was (returns the new object's id)
  function placeWord(text, box, colour) {
    const fs = SB.clamp(box.h * 0.82, 30, 170);
    const o = { id: 'o' + Math.random().toString(36).slice(2, 9), type: 'text', data: { lines: [text], color: colour, fs, read: text }, x: box.x, y: box.y - fs * 0.1, s: 1, ver: 1 };
    SB.state.objects.push(o);
    SB.renderObjects(); SB.save();
    return o.id;
  }
  function dropObjects(ids) {
    const set = new Set(ids);
    SB.state.objects = SB.state.objects.filter((o) => !set.has(o.id));
    SB.renderObjects(); SB.save();
  }
  function stopHooks() { SB.hooks.write = null; SB.hooks.multi = false; }

  /* ================================================================== 📚 Lesson words */
  BUILDERS.words = function (body, o) {
    const d = o.data;
    body.className += ' card words-card';
    body.innerHTML = `<div class="card-head"><span>📚</span><span>Lesson words</span><span class="src"></span></div><div class="word-chips"></div>
      <div class="card-foot"><button type="button" class="ctrl-btn go-ch">✍️ Challenge</button><button type="button" class="ctrl-btn go-race">🏁 Race</button><button type="button" class="ctrl-btn go-quiz">❓ Quiz</button></div>`;
    body.querySelector('.src').textContent = d.title || '';
    const box = body.querySelector('.word-chips');
    (d.words || []).forEach((w) => {
      const c = document.createElement('button');
      c.type = 'button'; c.className = 'word-chip'; c.textContent = w;
      c.addEventListener('click', (e) => { e.stopPropagation(); AU.speak(w, { rate: 0.8 }); c.classList.remove('said'); void c.offsetWidth; c.classList.add('said'); });
      box.appendChild(c);
    });
    const list = (d.words || []).join(', ');
    body.querySelector('.go-ch').addEventListener('click', (e) => { e.stopPropagation(); HANDLERS.challenge(list); });
    body.querySelector('.go-race').addEventListener('click', (e) => { e.stopPropagation(); HANDLERS.race(list); });
    body.querySelector('.go-quiz').addEventListener('click', (e) => { e.stopPropagation(); HANDLERS.quiz('these words: ' + list); });
  };

  HANDLERS.words = async function () {
    const c = await lessonWords();
    if (!c.words || !c.words.length) { toast('No lesson words found. Choose a lesson in 📚.'); openLessonPanel(); return; }
    SB.addObject('words', { title: c.title, words: c.words });
    AU.pop();
  };

  // Commands with nothing typed after them use today's lesson words
  const origQuiz = HANDLERS.quiz, origWord = HANDLERS.word, origSentences = HANDLERS.sentences;
  HANDLERS.quiz = async function (arg) {
    if (!String(arg || '').trim()) {
      const c = await lessonWords();
      if (c.words && c.words.length) return origQuiz('these words: ' + shuffle(c.words).slice(0, 12).join(', '));
    }
    return origQuiz(arg);
  };
  HANDLERS.word = async function (arg) {
    if (!String(arg || '').trim()) {
      const c = await lessonWords();
      if (c.words && c.words.length) return origWord(shuffle(c.words)[0]);
    }
    return origWord(arg);
  };
  HANDLERS.sentences = async function (arg) {
    if (!String(arg || '').trim()) {
      const c = await lessonWords();
      if (c.words && c.words.length) return origSentences(shuffle(c.words).slice(0, 2).join(' and '));
    }
    return origSentences(arg);
  };

  /* Lesson panel (📚 in the top bar) */
  async function openLessonPanel() {
    const panel = $('#lessonPanel');
    panel.classList.remove('hidden');
    $('#settings').classList.add('hidden');
    const body = $('#lessonBody');
    body.innerHTML = '<p class="set-status">Loading the lessons…</p>';
    if (!L) { body.innerHTML = '<p class="set-status warn">The lesson list could not load.</p>'; return; }
    await L.ensure();
    const c = await lessonWords();
    const classes = L.classes();
    const grade = c.cls ? c.cls.grade : 0;
    const lessons = L.lessonsFor(grade);
    const today = L.todaysLesson(c.classId);
    const own = c.source === 'custom' ? c.words.join(', ') : '';
    body.innerHTML = `
      <section class="set-sec"><h3>🏫 Class</h3><select id="lpClass" class="sb-select"></select>
        <p class="set-hint" id="lpToday"></p></section>
      <section class="set-sec"><h3>📖 Lesson</h3><select id="lpLesson" class="sb-select"></select>
        <div class="word-chips small" id="lpWords"></div></section>
      <section class="set-sec"><h3>✏️ Or my own words</h3>
        <textarea id="lpOwn" class="sb-textarea" rows="3" placeholder="cat, dog, bird, fish"></textarea>
        <div class="pin-row"><button type="button" class="btn-primary" id="lpUseOwn">Use my words</button><button type="button" class="ctrl-btn" id="lpClearOwn">Clear</button></div></section>
      <section class="set-sec"><h3>🚀 Use them</h3><div class="lp-actions">
        <button type="button" class="ctrl-btn" data-go="words">📌 Show on the board</button>
        <button type="button" class="ctrl-btn" data-go="challenge">✍️ Spelling challenge</button>
        <button type="button" class="ctrl-btn" data-go="race">🏁 Board race</button>
        <button type="button" class="ctrl-btn" data-go="quiz">❓ Quiz</button></div></section>`;
    const sc = $('#lpClass'), sl = $('#lpLesson');
    classes.forEach((k) => { const op = document.createElement('option'); op.value = k.id; op.textContent = k.name; sc.appendChild(op); });
    sc.value = c.classId;
    $('#lpToday').textContent = today ? `⭐ ${today.day}${today.time ? ' ' + today.time : ''}: ${today.entry.title}` : 'No lesson with words in the timetable today. Choose one below.';
    const auto = document.createElement('option');
    auto.value = ''; auto.textContent = today ? `⭐ Today: ${today.entry.title}` : '⭐ Newest lesson for this grade';
    sl.appendChild(auto);
    lessons.forEach((e) => { const op = document.createElement('option'); op.value = e.id; op.textContent = e.title; sl.appendChild(op); });
    sl.value = c.source === 'chosen' && c.entry ? c.entry.id : '';
    $('#lpOwn').value = own;
    const showWords = (cc) => {
      const box = $('#lpWords');
      box.innerHTML = '';
      (cc.words || []).forEach((w) => { const s = document.createElement('span'); s.className = 'word-chip'; s.textContent = w; box.appendChild(s); });
      if (!(cc.words || []).length) box.innerHTML = '<span class="set-hint">No words in this lesson.</span>';
    };
    showWords(c);
    sc.addEventListener('change', () => { L.choose({ classId: sc.value, entryId: '' }); openLessonPanel(); });
    sl.addEventListener('change', async () => { L.choose({ entryId: sl.value, custom: [] }); showWords(await lessonWords()); });
    $('#lpUseOwn').addEventListener('click', async () => {
      const w = parseWords($('#lpOwn').value);
      if (!w.length) { toast('Type some words, e.g. cat, dog, bird'); return; }
      L.choose({ custom: w }); showWords(await lessonWords()); toast('✅ The board will use your words today.');
    });
    $('#lpClearOwn').addEventListener('click', async () => { L.choose({ custom: [] }); $('#lpOwn').value = ''; showWords(await lessonWords()); });
    body.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      $('#lessonPanel').classList.add('hidden');
      HANDLERS[b.dataset.go]('');
    }));
  }
  SB.openLessonPanel = openLessonPanel;
  SB.onStart.push(() => {
    $('#btnLessons').addEventListener('click', () => ($('#lessonPanel').classList.contains('hidden') ? openLessonPanel() : $('#lessonPanel').classList.add('hidden')));
    $('#btnCloseLessons').addEventListener('click', () => $('#lessonPanel').classList.add('hidden'));
  });

  /* ================================================================== ✍️ Spelling challenge */
  const games = new Map(); // card id -> game state (kept while the card is on the board)

  function pickChallengeWords(list) {
    const good = list.filter((w) => letters(w).length >= 2 && w.length <= 18);
    const single = good.filter((w) => !/\s/.test(w));
    return shuffle(single.length >= 4 ? single : good).slice(0, 10);
  }

  HANDLERS.challenge = async function (arg) {
    let words = parseWords(arg);
    let title = 'Your words';
    if (!words.length) {
      const c = await lessonWords();
      words = c.words || []; title = c.title || 'Lesson words';
    }
    words = pickChallengeWords(words);
    if (!words.length) { toast('Which words? Try /challenge cat, dog, bird, or choose a lesson in 📚.'); return; }
    endRace(true);
    const o = SB.addObject('challenge', { words, title, teams: 2 });
    if (!AI.ready) toast('The AI is off: you check with ✅ and ❌.', 4500);
    return o;
  };

  BUILDERS.challenge = function (body, o) {
    const d = o.data;
    let g = games.get(o.id);
    if (!g) {
      g = { i: 0, tries: 0, team: 0, scores: Array(d.teams || 2).fill(0), phase: 'write', placed: [], hint: 0 };
      games.set(o.id, g);
      setTimeout(() => sayWord(o.id), 500);
    }
    body.className += ' card challenge-card';
    body.innerHTML = `<div class="card-head"><span>✍️</span><span>Spelling challenge</span><span class="src ch-count"></span></div>
      <div class="ch-main"><div class="ch-pic"></div><div class="ch-right">
        <button type="button" class="btn-primary ch-listen">🔊 Listen</button>
        <div class="ch-hint"></div></div></div>
      <div class="ch-status"></div>
      <div class="ch-teams"></div>
      <div class="card-foot"><button type="button" class="ctrl-btn ch-ok">✅ Right</button><button type="button" class="ctrl-btn ch-no">❌ Try again</button>
        <button type="button" class="ctrl-btn ch-show">👁 Show</button><button type="button" class="btn-primary ch-next">Next ➜</button></div>`;
    body.querySelector('.ch-listen').addEventListener('click', (e) => { e.stopPropagation(); sayWord(o.id); });
    body.querySelector('.ch-ok').addEventListener('click', (e) => { e.stopPropagation(); judge(o.id, true, null); });
    body.querySelector('.ch-no').addEventListener('click', (e) => { e.stopPropagation(); judge(o.id, false, null); });
    body.querySelector('.ch-show').addEventListener('click', (e) => { e.stopPropagation(); reveal(o.id); });
    body.querySelector('.ch-next').addEventListener('click', (e) => { e.stopPropagation(); nextWord(o.id); });
    paintChallenge(o.id, body);
    activate(o.id);
  };

  function activate(id) {
    SB.hooks.multi = false;
    SB.hooks.write = (list) => {
      if (!SB.getObj(id)) { stopHooks(); return []; } // the card was removed: back to normal neat writing
      const g = games.get(id);
      if (!g || g.phase === 'done') { stopHooks(); return []; }
      if (g.phase !== 'write') return list.map((s) => s.id); // between words: ignore scribbles
      if (!AI.ready) { setStatus(id, '👩‍🏫 Teacher: tap ✅ Right or ❌ Try again.'); g.lastStrokes = list.map((s) => s.id); return list.map((s) => s.id); }
      g.phase = 'checking';
      g.lastStrokes = list.map((s) => s.id);
      setStatus(id, '<span class="spinner"></span> Checking…');
      readWriting(list).then((r) => judge(id, isRight(r.read, wordOf(id)), r)).catch((err) => { g.phase = 'write'; SB.aiError(err); setStatus(id, '👩‍🏫 Teacher: tap ✅ or ❌.'); });
      return list.map((s) => s.id);
    };
  }
  const isRight = (read, target) => !!read && letters(read) === letters(target);
  const wordOf = (id) => { const o = SB.getObj(id), g = games.get(id); return o && g ? o.data.words[g.i] : ''; };
  const cardBody = (id) => { const el = SB.els.get(id); return el ? el.querySelector('.obj-body') : null; };
  function setStatus(id, html, body) { const b = body || cardBody(id); if (b) b.querySelector('.ch-status').innerHTML = html; }

  function sayWord(id) {
    const w = wordOf(id); if (!w) return;
    AU.speak(w, { rate: 0.72 });
    setTimeout(() => { if (games.get(id) && wordOf(id) === w) AU.speak(w, { rate: 0.6 }); }, 1600);
  }
  function hintText(w, level) {
    const chars = [...w];
    return chars.map((ch, k) => {
      if (ch === ' ') return '<i class="gap"></i>';
      const show = (level >= 2 && k === 0) || (level >= 3 && k === chars.length - 1) || level >= 4;
      return `<b class="${show ? 'on' : ''}">${show ? esc(ch) : ''}</b>`;
    }).join('');
  }
  function paintChallenge(id, body) {
    body = body || cardBody(id);
    const o = SB.getObj(id), g = games.get(id);
    if (!body || !o || !g) return;
    const d = o.data, w = d.words[g.i] || '';
    body.querySelector('.ch-count').textContent = g.phase === 'done' ? 'Finished!' : `Word ${g.i + 1} / ${d.words.length}`;
    const pic = body.querySelector('.ch-pic'), src = pictureFor(w);
    pic.innerHTML = g.phase === 'done' ? '🏆' : (src ? `<img alt="" draggable="false">` : '👂');
    if (src && g.phase !== 'done') pic.querySelector('img').src = src;
    body.querySelector('.ch-hint').innerHTML = g.phase === 'done' ? '' : (g.hint ? hintText(w, g.hint) : '<span class="ch-hint-msg">Listen and write!</span>');
    const teams = body.querySelector('.ch-teams');
    teams.innerHTML = '';
    g.scores.forEach((sc, t) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'team-chip' + (t === g.team && g.phase !== 'done' ? ' active' : '');
      b.style.setProperty('--tc', TEAM_COLORS[t]);
      b.innerHTML = `${TEAM_ICONS[t]} Team ${t + 1} <b>⭐ ${sc}</b>`;
      b.addEventListener('click', (e) => { e.stopPropagation(); g.team = t; paintChallenge(id); });
      teams.appendChild(b);
    });
    if (g.scores.length < 4 && g.phase !== 'done') {
      const add = document.createElement('button');
      add.type = 'button'; add.className = 'team-chip add'; add.textContent = '＋';
      add.title = 'Add a team';
      add.addEventListener('click', (e) => { e.stopPropagation(); g.scores.push(0); paintChallenge(id); });
      teams.appendChild(add);
    }
    if (g.phase === 'write') setStatus(id, `${TEAM_ICONS[g.team]} <b>Team ${g.team + 1}</b>: write the word on the board ✍️`, body);
    if (g.phase === 'done') {
      const best = Math.max(...g.scores), winners = g.scores.map((s, t) => (s === best ? t : -1)).filter((t) => t >= 0);
      setStatus(id, winners.length > 1 ? `🤝 It's a draw! ⭐ ${best}` : `🏆 <b>Team ${winners[0] + 1}</b> wins with ⭐ ${best}!`, body);
      body.querySelector('.ch-next').textContent = '🔁 Play again';
    }
  }

  function judge(id, right, r) {
    const o = SB.getObj(id), g = games.get(id);
    if (!o || !g || g.phase === 'done' || g.phase === 'right') return;
    const w = wordOf(id);
    const ids = (g.lastStrokes || []).filter((x) => SB.strokeById(x));
    const strokes = ids.map(SB.strokeById);
    const box = r && r.box ? r.box : (strokes.length ? SB.unionBox(strokes) : null);
    const body = cardBody(id);
    if (right) {
      g.phase = 'right';
      const pts = g.tries === 0 ? 2 : 1;
      g.scores[g.team] += pts;
      if (ids.length) SB.removeStrokes(ids);
      if (box) g.placed.push(placeWord(w, box, '#4ade80'));
      AU.fanfare(); AU.speak(`Yes! ${w}!`);
      if (body) { body.classList.remove('flash-bad'); void body.offsetWidth; body.classList.add('flash-good'); }
      setStatus(id, `✅ <b>${esc(w)}</b>! ${TEAM_ICONS[g.team]} Team ${g.team + 1} gets ⭐ +${pts}`);
      paintTeamsOnly(id);
      setTimeout(() => nextWord(id), 2200);
    } else {
      g.tries += 1; g.phase = 'write';
      g.hint = Math.min(4, g.tries + 0);
      AU.softFail();
      if (body) { body.classList.remove('flash-bad'); void body.offsetWidth; body.classList.add('flash-bad'); }
      paintChallenge(id);
      if (g.tries >= 3) { reveal(id); return; }
      const read = r && r.read ? ` (I read “${esc(r.read)}”)` : '';
      setStatus(id, `💪 Almost! Try again${read}`);
      setTimeout(() => { if (ids.length) SB.removeStrokes(ids); sayWord(id); }, 1300);
    }
  }
  function paintTeamsOnly(id) {
    const g = games.get(id), body = cardBody(id); if (!g || !body) return;
    body.querySelectorAll('.team-chip:not(.add)').forEach((b, t) => { b.querySelector('b').textContent = '⭐ ' + g.scores[t]; });
  }
  function reveal(id) {
    const g = games.get(id); if (!g || g.phase === 'done') return;
    const w = wordOf(id);
    g.hint = 4; g.phase = 'reveal';
    const ids = (g.lastStrokes || []).filter((x) => SB.strokeById(x));
    const box = ids.length ? SB.unionBox(ids.map(SB.strokeById)) : null;
    if (ids.length) SB.removeStrokes(ids);
    if (box) g.placed.push(placeWord(w, box, '#fde047'));
    paintChallenge(id);
    setStatus(id, `👀 It's <b>${esc(w)}</b>. Let's write it together! Then tap Next.`);
    AU.speak(`It is ${w}. ${[...w].join(' ')}.`, { rate: 0.7 });
  }
  function nextWord(id) {
    const o = SB.getObj(id), g = games.get(id); if (!o || !g) return;
    if (g.phase === 'done') { // play again
      games.delete(id);
      SB.updateObjData(id, { words: shuffle(o.data.words) });
      return;
    }
    if (g.placed.length) { dropObjects(g.placed); g.placed = []; }
    SB.removeStrokes([...SB.pending]);
    g.i += 1; g.tries = 0; g.hint = 0;
    g.team = (g.team + 1) % g.scores.length;
    if (g.i >= o.data.words.length) { g.phase = 'done'; g.i = o.data.words.length - 1; paintChallenge(id); AU.fanfare(); stopHooks(); return; }
    g.phase = 'write';
    paintChallenge(id);
    sayWord(id);
    activate(id);
  }

  /* ================================================================== 🏁 Board race */
  let race = null;

  HANDLERS.race = async function (arg) {
    let words = parseWords(arg);
    if (!words.length) { const c = await lessonWords(); words = c.words || []; }
    words = pickChallengeWords(words);
    if (!words.length) { toast('Which words? Try /race cat, dog, bird, or choose a lesson in 📚.'); return; }
    startRace(words);
  };

  function startRace(words) {
    endRace(true);
    stopHooks();
    SB.pushHistory();
    race = { words, i: 0, scores: [0, 0], stash: { strokes: SB.state.strokes, objects: SB.state.objects }, undoLen: SB.hist.undo.length, busy: [false, false], done: false, winner: -1, winT: 0 };
    SB.state = { strokes: [], objects: [] };
    SB.pending.clear();
    SB.redrawInk(); SB.renderObjects(); SB.setTool('pen');
    const el = document.createElement('div');
    el.className = 'race';
    el.id = 'raceOverlay';
    el.innerHTML = `<div class="race-line"></div>
      <div class="race-lane l0"><div class="race-name">🔵 Team 1 <b class="rs">0</b></div><div class="race-badge"></div><button type="button" class="ctrl-btn race-win">🏆</button></div>
      <div class="race-lane l1"><div class="race-name">🟠 Team 2 <b class="rs">0</b></div><div class="race-badge"></div><button type="button" class="ctrl-btn race-win">🏆</button></div>
      <div class="race-top"><span class="race-round"></span><div class="race-pic"></div>
        <button type="button" class="btn-primary race-listen">🔊 Listen</button>
        <button type="button" class="ctrl-btn race-next">⏭ Next</button><button type="button" class="ctrl-btn race-end">✖ End</button></div>`;
    $('#board').appendChild(el);
    el.querySelector('.race-listen').addEventListener('click', () => sayRace());
    el.querySelector('.race-next').addEventListener('click', () => nextRace());
    el.querySelector('.race-end').addEventListener('click', () => endRace(false));
    el.querySelectorAll('.race-win').forEach((b, lane) => b.addEventListener('click', () => winLane(lane, Date.now(), true)));
    SB.hooks.multi = true;
    SB.hooks.write = raceWrite;
    paintRace();
    setTimeout(sayRace, 500);
    if (!AI.ready) toast('The AI is off: tap 🏆 for the winner.', 4500);
  }
  const raceWord = () => (race ? race.words[race.i] : '');
  function sayRace() { const w = raceWord(); if (w) { AU.speak(w, { rate: 0.72 }); setTimeout(() => race && raceWord() === w && AU.speak(w, { rate: 0.6 }), 1600); } }
  function paintRace() {
    const el = $('#raceOverlay'); if (!el || !race) return;
    el.querySelector('.race-round').textContent = race.over ? 'Finished!' : `Word ${race.i + 1} / ${race.words.length}`;
    const src = pictureFor(raceWord()), pic = el.querySelector('.race-pic');
    pic.innerHTML = src && !race.over ? '<img alt="" draggable="false">' : '';
    if (src && !race.over) pic.querySelector('img').src = src;
    el.querySelectorAll('.rs').forEach((b, k) => { b.textContent = race.scores[k]; });
    el.querySelectorAll('.race-lane').forEach((ln, k) => {
      ln.classList.toggle('won', race.winner === k);
      ln.querySelector('.race-badge').innerHTML = race.winner === k ? `🏆<span>${esc(raceWord())}</span>` : '';
    });
    el.querySelector('.race-next').textContent = race.over ? '🔁 Again' : '⏭ Next';
  }
  function laneOf(x) { return x < SB.size().W / 2 ? 0 : 1; }
  function raceWrite(list) {
    if (!race) { stopHooks(); return []; }
    const wait = Math.max(1200, SB.opts.neatMs) - 60, now = Date.now(), used = [];
    const lanes = [[], []];
    list.forEach((s) => { const b = SB.bb(s); lanes[laneOf(b.x + b.w / 2)].push(s); });
    const writing = [false, false];
    SB.curs.forEach((c) => { writing[laneOf(c.pts[0][0])] = true; });
    lanes.forEach((strokes, lane) => {
      if (!strokes.length) return;
      if (race.done || race.over) { strokes.forEach((s) => used.push(s.id)); return; }
      const lastT = Math.max(...strokes.map((s) => s.t || 0));
      if (writing[lane] || race.busy[lane] || now - lastT < wait) return; // still writing: wait
      strokes.forEach((s) => used.push(s.id));
      if (!AI.ready) { badge(lane, '👩‍🏫 🏆?'); return; }
      race.busy[lane] = true;
      badge(lane, '<span class="spinner"></span>');
      const word = raceWord();
      readWriting(strokes).then((r) => {
        race && (race.busy[lane] = false);
        if (!race || raceWord() !== word) return;
        if (isRight(r.read, word)) winLane(lane, lastT, false, r.box);
        else {
          badge(lane, '❌ Try again!'); AU.softFail();
          setTimeout(() => { if (race && raceWord() === word) { SB.removeStrokes(strokes.map((s) => s.id).filter((x) => SB.strokeById(x))); badge(lane, ''); } }, 1300);
        }
      }).catch((err) => { if (race) race.busy[lane] = false; badge(lane, ''); SB.aiError(err); });
    });
    return used;
  }
  function badge(lane, html) {
    const el = $('#raceOverlay'); if (!el) return;
    if (race && race.winner === lane) return;
    el.querySelectorAll('.race-badge')[lane].innerHTML = html;
  }
  function winLane(lane, t, manual, box) {
    if (!race || race.over) return;
    if (race.done) {
      if (manual || t >= race.winT || race.winner === lane) return;
      race.scores[race.winner] -= 1; // the other child actually finished first
    }
    race.done = true; race.winner = lane; race.winT = t;
    race.scores[lane] += 1;
    paintRace();
    AU.fanfare(); AU.speak(`Team ${lane + 1} wins!`);
    clearTimeout(race.nextTimer);
    race.nextTimer = setTimeout(() => nextRace(), 3000);
  }
  function nextRace() {
    if (!race) return;
    clearTimeout(race.nextTimer);
    if (race.over) { race.words = shuffle(race.words); race.i = 0; race.scores = [0, 0]; race.over = false; }
    else race.i += 1;
    SB.state.strokes = []; SB.pending.clear(); SB.redrawInk();
    race.done = false; race.winner = -1; race.busy = [false, false];
    badge(0, ''); badge(1, '');
    if (race.i >= race.words.length) {
      race.over = true; race.i = race.words.length - 1;
      paintRace();
      const [a, b] = race.scores;
      const msg = a === b ? `🤝 Draw! ${a} – ${b}` : `🏆 Team ${a > b ? 1 : 2} wins ${Math.max(a, b)} – ${Math.min(a, b)}!`;
      $('#raceOverlay').querySelector('.race-round').textContent = msg;
      AU.fanfare(); AU.speak(msg.replace(/[🤝🏆]/gu, ''));
      return;
    }
    paintRace();
    sayRace();
  }
  function endRace(silent) {
    const el = $('#raceOverlay');
    if (el) el.remove();
    if (!race) return;
    clearTimeout(race.nextTimer);
    SB.state = { strokes: race.stash.strokes, objects: race.stash.objects };
    SB.hist.undo.length = Math.min(SB.hist.undo.length, race.undoLen);
    SB.hist.redo.length = 0;
    race = null;
    stopHooks();
    SB.pending.clear();
    SB.redrawInk(); SB.renderObjects(); SB.updateUndo(); SB.save();
    if (!silent) AU.pop();
  }
  SB.endRace = endRace;

  /* ================================================================== 🎤 Say it, see it */
  let rec = null;
  function listen() {
    const SR = root.SpeechRecognition || root.webkitSpeechRecognition;
    if (!SR) { toast('The microphone needs Chrome or Edge.'); return; }
    if (rec) { rec.stop(); return; }
    let finalText = '';
    rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    const pill = document.createElement('div');
    pill.className = 'mic-pill';
    pill.innerHTML = '<span class="mic-dot"></span><span class="mic-text">Listening… say a word or a sentence</span>';
    document.body.appendChild(pill);
    const btn = $('#btnMic'); if (btn) btn.classList.add('on');
    AU.stopSpeaking(); AU.pop();
    rec.onresult = (e) => {
      let txt = '';
      for (let k = 0; k < e.results.length; k++) { txt += e.results[k][0].transcript; if (e.results[k].isFinal) finalText = txt; }
      pill.querySelector('.mic-text').textContent = '“' + txt + '”';
    };
    rec.onerror = (e) => {
      toast(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Allow the microphone in the browser to use 🎤.'
        : e.error === 'no-speech' ? 'I did not hear anything. Tap 🎤 and try again.' : 'The microphone stopped. Try again.');
    };
    rec.onend = () => {
      pill.remove();
      if (btn) btn.classList.remove('on');
      rec = null;
      const t = finalText.trim();
      if (!t) return;
      const text = t.charAt(0).toUpperCase() + t.slice(1);
      SB.addObject('text', { lines: [text], color: SB.color, fs: 72, read: text });
      AU.sparkle();
      SB.speak(text);
    };
    try { rec.start(); } catch (err) { pill.remove(); rec = null; if (btn) btn.classList.remove('on'); toast('The microphone could not start.'); }
  }
  HANDLERS.listen = listen;
  SB.onStart.push(() => { const b = $('#btnMic'); if (b) b.addEventListener('click', listen); });

  /* ================================================================== ⭐ Stamps and stickers */
  const STAMPS = ['⭐', '🌟', '👍', '👏', '🏆', '🥇', '❤️', '😊', '🎉', '💯', '✅', '🔥'];
  const WORDS = [['Great job!', '#16a34a'], ['Well done!', '#2563eb'], ['Super!', '#9333ea'], ['Wow!', '#ea580c'], ['Excellent!', '#dc2626'], ['Keep going!', '#0891b2']];
  let stampSel = null;

  BUILDERS.stamp = function (body, o) {
    const d = o.data;
    body.className += ' stamp stamp-' + d.kind;
    if (d.kind === 'emoji') body.textContent = d.value;
    else if (d.kind === 'text') { body.textContent = d.value; body.style.setProperty('--sc', d.color || '#16a34a'); }
    else { const im = document.createElement('img'); im.src = d.src; im.alt = d.value || ''; im.draggable = false; body.appendChild(im); }
  };

  function openPalette() {
    const pal = $('#stampPal');
    pal.classList.remove('hidden');
    const grid = pal.querySelector('.pal-stamps'), wgrid = pal.querySelector('.pal-words');
    if (!grid.children.length) {
      STAMPS.forEach((e) => grid.appendChild(palBtn(e, { kind: 'emoji', value: e })));
      WORDS.forEach(([w, c]) => { const b = palBtn(w, { kind: 'text', value: w, color: c }); b.className += ' word'; b.style.color = c; wgrid.appendChild(b); });
      const q = pal.querySelector('.pal-search');
      q.addEventListener('input', () => fillStickers(q.value));
      fillStickers('');
    }
  }
  function fillStickers(q) {
    const box = $('#stampPal').querySelector('.pal-stickers');
    const idx = root.SMART_ART_INDEX || {};
    q = String(q || '').toLowerCase().trim();
    const keys = Object.keys(idx);
    const pick = q ? keys.filter((k) => k.startsWith(q)).concat(keys.filter((k) => !k.startsWith(q) && k.includes(q)))
      : ['star', 'cat', 'dog', 'bird', 'fish', 'ball', 'book', 'tree', 'house', 'ship', 'goat', 'money'].filter((k) => idx[k]);
    box.innerHTML = '';
    pick.slice(0, 12).forEach((k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pal-btn pic'; b.title = k;
      b.innerHTML = '<img alt="" draggable="false">';
      b.querySelector('img').src = '../' + idx[k][0];
      b.addEventListener('click', () => chooseStamp({ kind: 'pic', value: k, src: '../' + idx[k][0] }, b));
      box.appendChild(b);
    });
    if (!box.children.length) box.innerHTML = '<span class="set-hint">No pictures for that word.</span>';
  }
  function palBtn(label, spec) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pal-btn'; b.textContent = label;
    b.addEventListener('click', () => chooseStamp(spec, b));
    return b;
  }
  function chooseStamp(spec, b) {
    stampSel = spec;
    document.querySelectorAll('#stampPal .pal-btn').forEach((x) => x.classList.toggle('sel', x === b));
    SB.setTool('stamp');
    $('#stampPal').classList.add('hidden');
    toast('Tap the board to stamp ' + (spec.kind === 'pic' ? 'the picture' : spec.value) + '. Tap ✏️ to write again.');
  }
  SB.onStampTap = (p) => {
    if (!stampSel) { openPalette(); return; }
    const size = stampSel.kind === 'text' ? [280, 90] : stampSel.kind === 'pic' ? [200, 200] : [130, 130];
    const o = SB.addObject('stamp', Object.assign({}, stampSel), { x: p[0] - size[0] / 2, y: p[1] - size[1] / 2 });
    SB.select(null);
    AU.pop(); if (stampSel.kind !== 'pic') setTimeout(() => AU.sparkle(), 80);
    return o;
  };
  SB.onToolChange = () => { $('#stampPal').classList.add('hidden'); };
  SB.onStart.push(() => {
    const star = $('#btnStamp');
    star.addEventListener('click', () => {
      const pal = $('#stampPal');
      if (!pal.classList.contains('hidden')) { pal.classList.add('hidden'); return; }
      openPalette();
    });
    $('#stampPal').querySelector('.pal-close').addEventListener('click', () => $('#stampPal').classList.add('hidden'));
  });
})(window);
