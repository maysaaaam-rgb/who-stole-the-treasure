/* Alice Tea Party: home practice 2. Five small tasks per pupil, in any order:
   1 Read your dialogue   2 Say it with someone at home   3 Record it (show it in class)
   4 Make your prop       5 Learn three tea-party phrases
   Progress stays on this device. Each task done is reported to the teacher's Google Sheet (same sheet as practice 1). */
(function () {
  'use strict';
  const P = window.PARTY;
  const HOMEWORK = 'alice-tea-party-w2';
  const ART = 'week2-art/';
  const $ = (s, r) => (r || document).querySelector(s);
  const stage = $('#stage');
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const html = s => { stage.innerHTML = s; };

  /* ---------- progress (this device only) ---------- */
  const KEY = 'eaa_party_w2_v1';
  let save = { done: {}, level: {}, said: {} };
  try { save = Object.assign(save, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* default */ }
  ['done', 'level', 'said'].forEach(k => { if (!save[k] || typeof save[k] !== 'object') save[k] = {}; });
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* storage may be blocked */ } };

  /* ---------- sound: chords only, started by the first tap ---------- */
  let ctx = null;
  function audio() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio */ } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; }
  function note(freq, start, dur, vol) {
    const c = audio(); if (!c) return;
    [['sine', 0], ['triangle', 4]].forEach(([type, detune]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq; o.detune.value = detune;
      const t = c.currentTime + start; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  const sfxCorrect = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, i * 0.09, 0.55, 0.11));
  const sfxSoft = () => { note(246.94, 0, 0.45, 0.10); note(220, 0.22, 0.6, 0.10); };
  const sfxWin = () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => note(f, i * 0.12, 0.9, 0.12));
  const speak = (text, rate) => { try { window.EAAVoice.say(text, { rate: rate, dir: 'audio/' }); } catch (e) { /* voice is optional */ } };

  /* ---------- who is it ---------- */
  const wantedId = new URLSearchParams(location.search).get('s');
  const ST = wantedId ? P.find(wantedId) : null;
  if (!ST) { picker(); return; }

  function picker() {
    $('#xp').textContent = '';
    const keys = Object.keys(P.classes); let cur = keys[0];
    try { cur = localStorage.getItem('eaa_party_class') || cur; } catch (e) { /* default */ }
    const wantClass = (new URLSearchParams(location.search).get('class') || '').toLowerCase();
    if (P.classes[wantClass]) cur = wantClass;
    function draw() {
      html('<section class="panel"><h1>Who are you?</h1><p class="goal">Choose your class. Then tap your name.</p>' +
        '<div class="tabs">' + keys.map(k => '<button class="btn ghost ' + (k === cur ? 'on' : '') + '" data-k="' + k + '">' + P.classes[k].label + '</button>').join('') + '</div>' +
        '<div class="grid">' + P.classes[cur].students.map(s => {
          const n = Object.keys(save.done[s.id] || {}).filter(t => save.done[s.id][t]).length;
          return '<a class="btn stu ' + (n >= 5 ? 'done' : '') + '" href="?s=' + s.id + '" style="text-decoration:none">' + esc(s.name) + '<small>' + esc(P.roles[s.role].short) + (n ? ' · ' + n + '/5' : '') + '</small></a>';
        }).join('') + '</div></section>');
      stage.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { cur = b.dataset.k; try { localStorage.setItem('eaa_party_class', cur); } catch (e) { /* ignore */ } draw(); }));
    }
    draw();
  }

  const ROLE = ST.role, ROLEKEY = ST.roleKey;
  const SCRIPT = P.dialogues[ST.pair] || [];
  const PARTNERS = P.partners(ST);
  if (!save.done[ST.id]) save.done[ST.id] = {};
  const mine = save.done[ST.id];
  $('#sub').textContent = ST.name + ' · ' + ROLE.short;
  const doneCount = () => ['t1', 't2', 't3', 't4', 't5'].filter(t => mine[t]).length;
  const xpNow = () => doneCount() * 12 + (doneCount() >= 5 ? 20 : 0);   // 5 tasks x 12 + 20 bonus = 80 XP

  /* ---------- tell the teacher (Google Sheet). Works offline: unsent reports are kept and retried. ---------- */
  const CFG = window.PARTY_CONFIG || {};
  const PENDING_KEY = 'eaa_party_pending_w2_v1';
  const pendingGet = () => { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '{}'); } catch (e) { return {}; } };
  const pendingSet = o => { try { localStorage.setItem(PENDING_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };
  async function flushReports() {
    if (!CFG.submitUrl) return null;
    const p = pendingGet();
    for (const id of Object.keys(p)) {
      try {
        await fetch(CFG.submitUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p[id]) });
        const cur = pendingGet(); if (JSON.stringify(cur[id]) === JSON.stringify(p[id])) { delete cur[id]; pendingSet(cur); }
      } catch (e) { /* retry later */ }
    }
    return true;
  }
  function report() {
    if (!CFG.submitUrl || !doneCount()) return;
    const p = pendingGet();
    p[ST.id] = { token: CFG.token, homework: HOMEWORK, studentId: ST.id, name: ST.name, classLabel: ST.classLabel, character: ROLE.short,
      steps: doneCount(), xp: xpNow(), device: (navigator.userAgent || '').slice(0, 60), at: new Date().toISOString() };
    pendingSet(p); flushReports();
  }
  window.addEventListener('online', flushReports);

  /* ---------- little helpers ---------- */
  function propArt(text) {
    const t = String(text).toLowerCase();
    const map = [['hat', 'prop_hat'], ['rabbit', 'prop_ears_rabbit'], ['long paper ears', 'prop_ears_rabbit'], ['cat ears', 'prop_ears_cat'], ['dog ears', 'prop_ears_dog'],
      ['red paper crown', 'prop_crown_red'], ['crown', 'prop_crown_white'], ['watch', 'prop_watch'], ['key', 'prop_key'], ['wings', 'prop_wings'], ['claws', 'prop_claws'],
      ['carrot', 'prop_carrot'], ['teapot', 'prop_teapot']];
    for (const m of map) if (t.indexOf(m[0]) >= 0) return m[1];
    return '';
  }
  const propEmoji = text => { const t = String(text).toLowerCase(); return t.indexOf('hat') >= 0 ? '🎩' : t.indexOf('ears') >= 0 ? '🐰' : t.indexOf('crown') >= 0 ? '👑' : t.indexOf('watch') >= 0 ? '⌚' : t.indexOf('key') >= 0 ? '🔑' : t.indexOf('wings') >= 0 ? '🐉' : t.indexOf('carrot') >= 0 ? '🥕' : t.indexOf('sword') >= 0 ? '⚔️' : t.indexOf('claws') >= 0 ? '🐾' : t.indexOf('teapot') >= 0 ? '🫖' : t.indexOf('cup') >= 0 ? '☕' : '🎨'; };
  const pic = (file, emoji) => file ? '<img src="' + ART + file + '.png" alt="" onerror="this.replaceWith(document.createTextNode(\'' + emoji + '\'))">' : emoji;
  const PHRASES = [
    { say: 'Would you like some tea?', art: 'tea_would_you_like', e: '🫖', tip: 'You are the host. Pour the tea.' },
    { say: 'Yes, please. / No, thank you.', art: 'tea_yes_please', e: '☕', tip: 'You are the guest. Choose one.' },
    { say: 'Pass the cake, please.', art: 'tea_pass_cake', e: '🍰', tip: 'Ask nicely. Say please!' }
  ];
  const BONUS = [['Host', 'Would you like some tea?'], ['Guest', 'Yes, please. Pass the cake, please.'], ['Host', 'Here you are. Have some cake!'], ['Guest', 'Thank you. This is a nice tea party!']];

  /* ---------- the five tasks ---------- */
  function lineHtml(who, text, isMine, k, labelOverride) {
    return '<li class="line ' + (isMine ? 'mine' : '') + '"><span class="t"><span class="w">' + esc(labelOverride || (P.roles[who] ? P.roles[who].short : who)) + (isMine ? ' (you)' : '') + '</span>' + esc(text) +
      '</span><button class="btn amber speak" data-say="' + esc(text) + '" aria-label="Listen">🔊</button></li>';
  }
  const TASKS = [
    { id: 't1', ico: pic('', '📖'), t: 'Read your dialogue', body: () =>
      '<p>Tap 🔊 to listen. Your lines are yellow. Read the whole conversation once.</p>' +
      (PARTNERS.length ? '<div class="partner">Your partner: ' + PARTNERS.map(p => esc(p.name) + ' (' + esc(P.roles[p.role].short) + ')').join(' + ') + '</div>' : '') +
      '<ul class="lines">' + SCRIPT.map((l, k) => lineHtml(l[0], l[1], l[0] === ROLEKEY, k)).join('') + '</ul>' +
      '<div class="bonus">⭐ Bonus tea-party lines (add them at the end)</div>' +
      '<ul class="lines">' + BONUS.map((l, k) => lineHtml('', l[1], false, k, l[0])).join('') + '</ul>',
      btn: '✅ I read it' },
    { id: 't2', ico: pic('tool_stars_three', '🗣️'), t: 'Say it with someone at home', body: () =>
      '<p>A parent, brother or sister reads your partner\'s lines. You say yours. Choose how you said it:</p>' +
      '<div class="lv">' +
      [['1', '⭐ I read the card'], ['2', '⭐⭐ I looked at the card only sometimes'], ['3', '⭐⭐⭐ I said it without the card!']].map(l => '<button class="btn ghost lvbtn ' + (save.level[ST.id] === l[0] ? 'on' : '') + '" data-l="' + l[0] + '">' + l[1] + '</button>').join('') + '</div>' +
      '<label class="chk"><input type="checkbox" data-c="1"> Loud voice</label><label class="chk"><input type="checkbox" data-c="2"> I look up</label><label class="chk"><input type="checkbox" data-c="3"> I smile</label>',
      btn: '✅ I said it with someone', need: () => save.level[ST.id] },
    { id: 't3', ico: pic('tool_phone_record', '📱'), t: 'Record it', body: () =>
      '<p>Use a phone. Press record. Say your lines (about 1 minute). Keep the video or voice message. <b>Show it in class.</b></p>' +
      '<div class="safe">You can record a voice message if you do not want a video.</div>',
      btn: '✅ I recorded it' },
    { id: 't4', ico: pic('', '✂️'), t: 'Make your prop', body: () => {
      const props = ROLE.props || [];
      return '<p>Make ONE prop from paper. Bring it to class. Wear it for the dialogue!</p>' +
        props.map(p => '<div class="propbox"><div class="pi">' + pic(propArt(p), propEmoji(p)) + '</div><div><b>' + esc(p) + '</b></div></div>').join('') +
        '<div class="craft"><span>1. Draw</span><span>2. Cut</span><span>3. Fold and tape</span></div>' +
        '<p>Say it: <b>"This is my ' + esc(String(props[0] || 'prop').replace(/^(a|an) /, '')) + '. It is big and funny."</b> <button class="btn amber speak" data-say="This is my ' + esc(String(props[0] || 'prop').replace(/^(a|an) /, '')) + '. It is big and funny." aria-label="Listen" style="min-height:44px;width:52px;padding:0">🔊</button></p>' +
        '<div class="safe">Ask an adult to help with scissors.</div>';
    }, btn: '✅ I made my prop' },
    { id: 't5', ico: pic('tea_would_you_like', '🫖'), t: 'Learn 3 tea-party phrases', body: () =>
      '<p>Tap 🔊, then say each phrase out loud. Practise with a cup and a plate at home!</p>' +
      PHRASES.map((p, k) => '<div class="propbox"><div class="pi">' + pic(p.art, p.e) + '</div><div style="flex:1"><b>' + esc(p.say) + '</b><br><small>' + esc(p.tip) + '</small></div>' +
        '<div style="display:grid;gap:6px"><button class="btn amber speak" data-say="' + esc(p.say.split(' / ')[0]) + '" aria-label="Listen" style="min-height:44px;width:52px;padding:0">🔊</button>' +
        '<button class="btn ' + (save.said[ST.id + k] ? 'green' : 'ghost') + ' saidbtn" data-k="' + k + '" style="min-height:44px;padding:0 6px;font-size:.85rem">' + (save.said[ST.id + k] ? '✓' : 'I said it') + '</button></div></div>').join(''),
      btn: '✅ I know the 3 phrases', need: () => PHRASES.every((p, k) => save.said[ST.id + k]) }
  ];

  /* ---------- draw ---------- */
  function renderSteps() { $('#steps').innerHTML = TASKS.map(t => '<div class="step ' + (mine[t.id] ? 'done' : '') + '"></div>').join(''); $('#xp').textContent = '⭐ ' + xpNow() + ' XP'; }
  function draw(keepScroll) {
    const y = window.scrollY; renderSteps();
    const n = doneCount();
    let out = '<section class="panel"><div class="plan-hd"><img src="assets/' + esc(ST.photo) + '" alt="' + esc(ROLE.short) + '"><div><h1>My Tea Party Plan</h1><div class="goal" style="margin:0">' + esc(ST.name) + ' · ' + esc(ROLE.short) + ' · ' + n + ' of 5 done</div></div></div>' +
      '<p class="goal">Do the five tasks in any order. Each one takes about 5 minutes. A little every day is best!</p>' +
      '<a class="btn ghost" href="profile.html?s=' + esc(ST.id) + '" style="text-decoration:none">🫖 My Alice profile</a></section>';
    TASKS.forEach((t, i) => {
      out += '<article class="task ' + (mine[t.id] ? 'done' : '') + '" data-t="' + t.id + '"><div class="th"><div class="ico">' + t.ico + '</div><div><div class="tn">Task ' + (i + 1) + (mine[t.id] ? ' · done ✓' : '') + '</div><h2>' + esc(t.t) + '</h2></div></div>' +
        t.body() + '<div class="row"><button class="btn green wide donebtn" data-t="' + t.id + '"' + (t.need && !t.need() ? ' disabled' : '') + '>' + (mine[t.id] ? '✓ Done' : t.btn) + '</button></div></article>';
    });
    if (n >= 5) out += winHtml();
    html(out);
    wire();
    if (keepScroll) window.scrollTo(0, y);
  }
  function winHtml() {
    return '<section class="panel" id="win"><h1 style="text-align:center">You are a Tea Party Star! 🌟</h1>' +
      '<div class="card"><img src="assets/' + esc(ST.photo) + '" alt="' + esc(ROLE.short) + ' card"><div class="tray"><div class="nm">' + esc(ROLE.name) + '</div><div class="who">Tea Party Star: ' + esc(ST.name) + ' · ' + esc(ST.classLabel) + '</div>' +
      '<ul>' + (ROLE.sentences || []).map(s => '<li>' + esc(s) + '</li>').join('') + '</ul></div></div>' +
      '<div class="xp-big">+' + xpNow() + ' XP</div><div class="stars">⭐⭐⭐</div><p class="proof">Show this screen to your teacher. See you at the tea party!</p></section>';
  }
  function wire() {
    stage.querySelectorAll('.speak').forEach(b => b.addEventListener('click', () => { speak(b.dataset.say, 0.88); }));
    stage.querySelectorAll('.lvbtn').forEach(b => b.addEventListener('click', () => { save.level[ST.id] = b.dataset.l; persist(); sfxCorrect(); draw(true); }));
    stage.querySelectorAll('.saidbtn').forEach(b => b.addEventListener('click', () => { save.said[ST.id + b.dataset.k] = true; persist(); sfxCorrect(); draw(true); }));
    stage.querySelectorAll('.donebtn').forEach(b => b.addEventListener('click', () => {
      const t = TASKS.filter(x => x.id === b.dataset.t)[0];
      if (t.need && !t.need()) { sfxSoft(); return; }
      const was = doneCount() >= 5;
      mine[t.id] = !mine[t.id]; persist(); report();
      if (mine[t.id]) { if (doneCount() >= 5 && !was) { sfxWin(); speak('Well done! You are a Tea Party Star!', 0.8); } else sfxCorrect(); }
      draw(true);
      if (doneCount() >= 5 && !was) { const w = $('#win'); if (w && w.scrollIntoView) w.scrollIntoView({ behavior: 'smooth' }); }
    }));
  }
  draw(false);
  flushReports();
})();
