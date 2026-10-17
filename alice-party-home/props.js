/* Alice Tea Party: home practice 3 (the last one before the party). Short and calm:
   1 Get your prop   2 Learn the 3 tea-party phrases   3 Say your 3 sentences
   No recording this time: rehearsing is done in class. Progress stays on this device and each task is reported to the teacher's Google Sheet. */
(function () {
  'use strict';
  const P = window.PARTY;
  const HOMEWORK = 'alice-tea-party-w3';
  const PROPS = '../assets/alice-cut/props/';
  const ART = 'week2-art/';
  const $ = (s, r) => (r || document).querySelector(s);
  const stage = $('#stage');
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const html = s => { stage.innerHTML = s; };

  const KEY = 'eaa_party_w3_v1';
  let save = { done: {}, have: {}, say: {}, level: {} };
  try { save = Object.assign(save, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* default */ }
  ['done', 'have', 'say', 'level'].forEach(k => { if (!save[k] || typeof save[k] !== 'object') save[k] = {}; });
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* storage may be blocked */ } };

  /* sound: soft chords only, started by the first tap */
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
  const sfxWin = () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => note(f, i * 0.12, 0.9, 0.12));
  const speak = (text, rate) => { try { window.EAAVoice.say(text, { rate: rate, dir: 'audio/' }); } catch (e) { /* voice is optional */ } };

  /* who is it */
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
          return '<a class="btn stu ' + (n >= 3 ? 'done' : '') + '" href="?s=' + s.id + '" style="text-decoration:none">' + esc(s.name) + '<small>' + esc(P.roles[s.role].short) + (n ? ' · ' + n + '/3' : '') + '</small></a>';
        }).join('') + '</div></section>');
      stage.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { cur = b.dataset.k; try { localStorage.setItem('eaa_party_class', cur); } catch (e) { /* ignore */ } draw(); }));
    }
    draw();
  }

  const ROLE = ST.role, ROLEKEY = ST.roleKey;
  if (!save.done[ST.id]) save.done[ST.id] = {};
  const mine = save.done[ST.id];
  $('#sub').textContent = ST.name + ' · ' + ROLE.short;
  const TOTAL = 3;
  const doneCount = () => ['t1', 't2', 't3'].filter(t => mine[t]).length;
  const xpNow = () => doneCount() * 20 + (doneCount() >= TOTAL ? 20 : 0);   // 3 tasks x 20 + 20 bonus = 80 XP

  /* tell the teacher (Google Sheet). Works offline: unsent reports are kept and retried. */
  const CFG = window.PARTY_CONFIG || {};
  const PENDING_KEY = 'eaa_party_pending_w3_v1';
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
      steps: doneCount() >= TOTAL ? 5 : doneCount(), xp: xpNow(), device: (navigator.userAgent || '').slice(0, 60), at: new Date().toISOString() };
    pendingSet(p); flushReports();
  }
  window.addEventListener('online', flushReports);

  /* every prop text of the roles -> picture in assets/alice-cut/props (emoji when there is none) */
  const PROP_PIC = {
    'a paper key': 'prop_key', 'a teacup': 'prop_teacup', 'a big paper hat': 'prop_hat_big', 'a teapot': 'prop_teapot', 'a paper watch': 'prop_watch', 'a letter': 'prop_letter',
    'a paper crown': 'prop_crown_white', 'a small bottle': 'prop_bottle', 'long paper ears': 'prop_ears_hare', 'a carrot': 'prop_carrot', 'cat ears': 'prop_ears_cat',
    'a ball of yarn': 'prop_yarn', 'dog ears': 'prop_ears_dog', 'a paper bone': 'prop_bone', 'a red paper crown': 'prop_crown_red', 'a playing card': 'prop_card',
    'paper wings': 'prop_wings', 'a toy sword': 'prop_sword_toy', 'paper claws': 'prop_claws', 'a big key': 'prop_key_big', 'a book': 'prop_book', 'a flower': 'prop_flower',
    'a nice hat': 'prop_hat_nice', 'a plate of cake': 'prop_cake_plate', 'a big button': 'prop_button', 'a green hat': 'prop_hat_green', 'a small bell': 'prop_bell',
    'blue paper antennae': 'prop_antennae', 'a mushroom': 'prop_mushroom', 'a tall hat': 'prop_hat_tall', 'a walking stick': 'prop_stick', 'a green coat': 'prop_coat_green',
    'a button': 'prop_button', 'mouse ears': 'prop_ears_mouse', 'a small cup': 'prop_cup_tiny', 'a tiny cup': 'prop_cup_tiny', 'a paper shell': 'prop_shell', 'a pearl': 'prop_pearl'
  };
  const propImg = text => { const f = PROP_PIC[text]; return f ? '<img src="' + PROPS + f + '.webp" alt="" onerror="this.replaceWith(document.createTextNode(\'🎭\'))">' : '😁'; };
  const PHRASES = [
    { say: 'Would you like some tea?', art: 'tea_would_you_like', e: '🫖', tip: 'You are the host. Pour the tea.' },
    { say: 'Yes, please. / No, thank you.', art: 'tea_yes_please', e: '☕', tip: 'You are the guest. Choose one.' },
    { say: 'Pass the cake, please.', art: 'tea_pass_cake', e: '🍰', tip: 'Ask nicely. Say please!' }
  ];
  const pic = (file, emoji) => '<img src="' + ART + file + '.png" alt="" onerror="this.replaceWith(document.createTextNode(\'' + emoji + '\'))">';
  const props = ROLE.props || [];

  const TASKS = [
    { id: 't1', ico: '🎭', t: 'Get your prop', body: () =>
      '<p>Your prop makes you ' + esc(ROLE.short) + '. Tick it when you have it. No prop? Print the paper template and cut it out with a grown-up.</p>' +
      props.map((p, i) => '<div class="propbox"><div class="pi">' + propImg(p) + '</div><div style="flex:1"><b>' + esc(p) + '</b><div class="craft"><span>✂️ paper</span><span>🧷 tape</span><span>🖍️ colours</span></div>' +
        '<a class="btn ghost" style="min-height:44px;padding:6px 14px;font-size:.95rem;text-decoration:none" href="../alice-party-print/prop-templates.html?role=' + esc(ROLEKEY) + '">🖨️ Paper template</a> <a class="btn amber" style="min-height:44px;padding:6px 14px;font-size:.95rem;text-decoration:none" href="../alice-party-print/craft-guides.html?role=' + esc(ROLEKEY) + '">🛠️ How to make it</a> <a class="btn ghost" style="min-height:44px;padding:6px 14px;font-size:.95rem;text-decoration:none" href="../alice-party-print/blueprints.html?role=' + esc(ROLEKEY) + '">📐 Blueprint to print</a></div>' +
        '<button class="btn ' + (save.have[ST.id + ':' + i] ? 'green' : 'ghost') + ' havebtn" data-i="' + i + '" style="min-height:56px">' + (save.have[ST.id + ':' + i] ? '✓ I have it' : 'I have it') + '</button></div>').join(''),
      btn: '✅ I have my props', need: () => props.length && props.every((p, i) => save.have[ST.id + ':' + i]) },
    { id: 't2', ico: pic('tool_stars_three', '🫖'), t: 'Learn the 3 tea-party phrases', body: () =>
      '<p>Tap 🔊 and listen. Say it out loud. Then tap "I can say it".</p>' +
      PHRASES.map((ph, i) => '<div class="propbox"><div class="pi">' + pic(ph.art, ph.e) + '</div><div style="flex:1"><div style="font-size:1.25rem;font-weight:800">' + esc(ph.say) + '</div><div style="color:var(--muted);font-size:.9rem">' + esc(ph.tip) + '</div></div>' +
        '<button class="btn amber speak" data-say="' + esc(ph.say.split(' / ')[0]) + '" style="width:56px;height:56px;padding:0;font-size:1.4rem">🔊</button></div>' +
        '<button class="btn ' + (save.say[ST.id + ':p' + i] ? 'green' : 'ghost') + ' saybtn wide" data-k="p' + i + '">' + (save.say[ST.id + ':p' + i] ? '✓ I can say it' : 'I can say it') + '</button>').join(''),
      btn: '✅ I know the 3 phrases', need: () => PHRASES.every((ph, i) => save.say[ST.id + ':p' + i]) },
    { id: 't3', ico: pic('tool_stars_three', '🗣️'), t: 'Say your 3 sentences', body: () =>
      '<p>These are the sentences of ' + esc(ROLE.short) + '. Listen, then say them without looking.</p>' +
      '<ul class="lines">' + (ROLE.sentences || []).map(s => '<li class="line mine"><span class="t">' + esc(s) + '</span><button class="btn amber speak" data-say="' + esc(s) + '" aria-label="Listen">🔊</button></li>').join('') + '</ul>' +
      '<div class="lv">' + [['1', '⭐ I read them'], ['2', '⭐⭐ I looked only sometimes'], ['3', '⭐⭐⭐ I said them without looking!']].map(l => '<button class="btn ghost lvbtn ' + (save.level[ST.id] === l[0] ? 'on' : '') + '" data-l="' + l[0] + '">' + l[1] + '</button>').join('') + '</div>',
      btn: '✅ I can say my sentences', need: () => !!save.level[ST.id] }
  ];

  function renderSteps() { $('#steps').innerHTML = TASKS.map(t => '<div class="step ' + (mine[t.id] ? 'done' : '') + '"></div>').join(''); $('#xp').textContent = '⭐ ' + xpNow() + ' XP'; }
  function draw(keepScroll) {
    const y = window.scrollY; renderSteps();
    let out = '<section class="panel"><div class="plan-hd"><img src="assets/' + esc(ST.photo) + '" alt="' + esc(ROLE.short) + '"><div><h1>My Party Plan</h1><div class="goal" style="margin:0">' + esc(ST.name) + ' · ' + esc(ROLE.short) + '</div></div></div>' +
      '<p class="goal">Three short tasks, about 10 minutes. We rehearse together in class, so there is nothing to record.</p></section>';
    TASKS.forEach((t, i) => {
      out += '<article class="task ' + (mine[t.id] ? 'done' : '') + '"><div class="th"><div class="ico">' + t.ico + '</div><div><div class="tn">Task ' + (i + 1) + (mine[t.id] ? ' · done ✓' : '') + '</div><h2>' + t.t + '</h2></div></div>' +
        t.body() + '<div class="row"><button class="btn green wide donebtn" data-t="' + t.id + '"' + (t.need && !t.need() && !mine[t.id] ? ' disabled' : '') + '>' + (mine[t.id] ? '✓ Done' : t.btn) + '</button></div></article>';
    });
    if (doneCount() >= TOTAL) out += '<section class="panel" id="win"><h1 style="text-align:center">You are ready for the party! 🌟</h1><div class="xp-big">+' + xpNow() + ' XP</div><div class="stars">⭐⭐⭐</div><p class="proof">Bring your prop to class. See you at the tea party, ' + esc(ST.name) + '!</p></section>';
    html(out); wire();
    if (keepScroll) window.scrollTo(0, y);
  }
  function wire() {
    stage.querySelectorAll('.speak').forEach(b => b.addEventListener('click', () => { speak(b.dataset.say, 0.88); }));
    stage.querySelectorAll('.havebtn').forEach(b => b.addEventListener('click', () => { const k = ST.id + ':' + b.dataset.i; save.have[k] = !save.have[k]; persist(); if (save.have[k]) sfxCorrect(); draw(true); }));
    stage.querySelectorAll('.saybtn').forEach(b => b.addEventListener('click', () => { const k = ST.id + ':' + b.dataset.k; save.say[k] = !save.say[k]; persist(); if (save.say[k]) sfxCorrect(); draw(true); }));
    stage.querySelectorAll('.lvbtn').forEach(b => b.addEventListener('click', () => { save.level[ST.id] = b.dataset.l; persist(); sfxCorrect(); draw(true); }));
    stage.querySelectorAll('.donebtn').forEach(b => b.addEventListener('click', () => {
      const t = TASKS.filter(x => x.id === b.dataset.t)[0];
      if (!mine[t.id] && t.need && !t.need()) return;
      const was = doneCount() >= TOTAL;
      mine[t.id] = !mine[t.id]; persist(); report();
      if (mine[t.id]) { if (doneCount() >= TOTAL && !was) sfxWin(); else sfxCorrect(); }
      draw(true);
    }));
  }
  draw(false);
  flushReports();
})();
