/* Week Song (Grade 4): a song the class learns over the week. Four steps: Move (video + actions), Learn (line by line),
   Sing (video + lyrics that follow), Show (teams sing, teacher gives stars).
   The lyrics are pasted by the teacher and kept only in this browser. Nothing here records or uploads the pupils. */
(function () {
  'use strict';
  var D = window.SongData, A = window.KaraokeAudio;
  var KEY = 'eaa_weeksong_v1';
  var STEPS = [['🎬', 'Move'], ['🧩', 'Learn'], ['🎤', 'Sing'], ['🏆', 'Show']];
  var STAR_TXT = { 1: 'Brave try!', 2: 'Clear voice!', 3: 'Super singers!' };
  var PACE = [['🐢', 'Slow', 520], ['🚶', 'Steady', 400], ['🐇', 'Quick', 300]];
  var stage = document.getElementById('stage'), fx = document.getElementById('fx');

  /* ---------- saved on this computer only ---------- */
  var cfg = load();
  function load() {
    var d = { vid: D.defaultVideo.id, title: D.defaultVideo.title, lyrics: '', picks: null, sync: {}, pace: 1, assign: null, solos: {}, manual: {}, cls: '' };
    try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && typeof v === 'object') d = Object.assign(d, v); } catch (e) { /* private window */ }
    return d;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ } }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  /* ---------- the lyrics, split into parts and lines ---------- */
  var secs = [], lines = [], teach = [], picked = [];
  function parse(text) {
    var out = [], cur = null;
    String(text || '').split(/\r?\n/).forEach(function (l) {
      l = l.trim(); if (!l) return;
      var m = /^\[(.+?)\]$/.exec(l);
      if (m) { cur = { name: m[1], lines: [] }; out.push(cur); return; }
      if (!cur) { cur = { name: 'Song', lines: [] }; out.push(cur); }
      cur.lines.push(l);
    });
    return out.filter(function (s) { return s.lines.length; });
  }
  function build() {
    secs = parse(cfg.lyrics); lines = [];
    secs.forEach(function (s, si) { s.lines.forEach(function (t) { lines.push({ sec: si, text: t, words: t.split(/\s+/).filter(Boolean) }); }); });
    picked = Array.isArray(cfg.picks) ? cfg.picks.filter(function (i) { return i < secs.length; }) : [];
    if (!Array.isArray(cfg.picks)) { secs.forEach(function (s, i) { if (/chorus/i.test(s.name)) picked.push(i); }); if (!picked.length && secs.length) picked = [0]; }
    var seen = {}; teach = [];
    lines.forEach(function (l) { if (picked.indexOf(l.sec) < 0) return; var k = l.text.toLowerCase(); if (seen[k]) return; seen[k] = 1; teach.push(l); });
  }
  function actionList() {
    var seen = {}, out = [];
    lines.forEach(function (l) { l.words.forEach(function (w) {
      var k = w.toLowerCase().replace(/[^a-z]/g, ''), a = D.actions[k];
      if (a && a[1] && !seen[a[1]]) { seen[a[1]] = 1; out.push({ w: k, e: a[0], t: a[1] }); }
    }); });
    return out.slice(0, 9);
  }
  function emojiFor(l) { var out = []; l.words.forEach(function (w) { var a = D.actions[w.toLowerCase().replace(/[^a-z]/g, '')]; if (a && a[0] && out.indexOf(a[0]) < 0) out.push(a[0]); }); return out.slice(0, 3).join(' '); }

  /* ---------- who sings what: one pupil (solo), a team, or everyone. Only codes and first names are saved, never the words. ---------- */
  var KINDS = ['all', 't0', 't1', 't2', 't3', 'solo'];
  function whoOf(i) { return (cfg.assign && cfg.assign[i]) || 'all'; }
  function kindInfo(code, i) {
    if (code === 'solo') return { e: '🎤', n: (cfg.solos && cfg.solos[i]) || 'Solo', c: '#f59e0b' };
    if (code === 'all') return { e: '👥', n: 'Everyone', c: '#10b981' };
    var t = D.teams[+String(code).slice(1)] || D.teams[0]; return { e: t.e, n: t.n, c: t.c };
  }
  function badge(i) { var k = kindInfo(whoOf(i), i); return '<span class="bd" style="--c:' + k.c + '">' + k.e + ' ' + esc(k.n) + '</span>'; }
  function sameSinger(a, b) { return whoOf(a) === whoOf(b) && (whoOf(a) !== 'solo' || (cfg.solos[a] || '') === (cfg.solos[b] || '')); }
  // the pupils of a class, first names only (from this computer's platform data)
  function classList() {
    try {
      var st = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null'); if (!st || !Array.isArray(st.classes)) return [];
      var all = st.classes.filter(function (c) { return c && !c.archived && !/store-sync/.test(c.id); });
      var g4 = all.filter(function (c) { return /4/.test(String(c.grade || '') + String(c.name || '')); });
      return (g4.length ? g4 : all).map(function (c) { return { id: c.id, label: String(c.name || c.id).replace(/^Grade\s*/i, '') }; });
    } catch (e) { return []; }
  }
  function kidsOf(id) {
    try {
      var st = JSON.parse(localStorage.getItem('eaa_master_school_v6') || 'null'); if (!st || !Array.isArray(st.students)) return [];
      return st.students.filter(function (s) { return s && !s.archived && s.classId === id; }).map(function (s) { return String(s.firstName || '').trim() || String(s.name || '').trim().split(/\s+/)[0] || 'Pupil'; });
    } catch (e) { return []; }
  }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pickSolos() {
    // names the teacher typed or chose by hand (cfg.manual) are kept; the rest are drawn from the class
    var pool = shuffled(kidsOf(cfg.cls)), n = 0; if (!cfg.manual) cfg.manual = {}; var keep = {};
    Object.keys(cfg.manual).forEach(function (i) { if (whoOf(+i) === 'solo' && cfg.solos[i]) keep[i] = cfg.solos[i]; });
    cfg.solos = keep;
    lines.forEach(function (l, i) { if (whoOf(i) === 'solo' && !keep[i]) { cfg.solos[i] = pool.length ? pool[n++ % pool.length] : ''; } });
    save();
  }
  function applyPreset(p) {
    var a = [], t = 0;
    lines.forEach(function (l, i) {
      var inChorus = picked.indexOf(l.sec) >= 0, k = secs[l.sec].lines.indexOf(l.text);
      if (p === 'all') a[i] = 'all';
      else if (p === 'teams') a[i] = 't' + (t++ % 4);
      else a[i] = inChorus ? 'all' : (k % 2 === 0 ? 'solo' : 't' + (t++ % 4));   // verses: solo, then a team; the chorus: everyone
    });
    cfg.assign = a; cfg.manual = {}; pickSolos();
  }

  /* ---------- state ---------- */
  var S = { step: -1, li: 0, all: false, hide: 0, cur: -1, mode: 'hand', syncing: false, syncTimes: [], team: 0, k: 0, scores: [0, 0, 0, 0], goals: [false, false, false], giving: false };
  var player = null, poll = 0, timers = [], W = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; clearInterval(poll); poll = 0; }

  /* ---------- the video (YouTube player; a plain embed if the player script cannot load) ---------- */
  var ytWait = [], ytAsked = false;
  function loadYT(cb) {
    if (window.YT && window.YT.Player) { cb(true); return; }
    ytWait.push(cb); if (ytAsked) return; ytAsked = true;
    window.onYouTubeIframeAPIReady = function () { ytWait.splice(0).forEach(function (f) { f(true); }); };
    var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = function () { ytWait.splice(0).forEach(function (f) { f(false); }); };
    document.head.appendChild(s);
    setTimeout(function () { if (!(window.YT && window.YT.Player)) ytWait.splice(0).forEach(function (f) { f(false); }); }, 7000);
  }
  function mountVideo(hostId, onReady) {
    var host = $(hostId); if (!host) return;
    loadYT(function (ok) {
      host = $(hostId); if (!host) return;
      if (ok) {
        try {
          player = new window.YT.Player(hostId, { videoId: cfg.vid, width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: cfg.cc ? 1 : 0, cc_lang_pref: 'en', hl: 'en' },
            events: { onReady: function () { if (onReady) onReady(true); } } });
          return;
        } catch (e) { /* fall through to the plain embed */ }
      }
      player = null;
      host.outerHTML = '<iframe id="' + hostId + '" src="https://www.youtube.com/embed/' + encodeURIComponent(cfg.vid) + '?rel=0&modestbranding=1' + (cfg.cc ? '&cc_load_policy=1&cc_lang_pref=en' : '') + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>';
      if (onReady) onReady(false);
    });
  }
  function killVideo() { if (player && player.destroy) { try { player.destroy(); } catch (e) { /* ignore */ } } player = null; }
  function vid(fn) { try { if (player && player[fn]) return player[fn].apply(player, [].slice.call(arguments, 1)); } catch (e) { /* not ready */ } }
  function videoBox() { return '<div class="vbox"><div id="yt"></div></div>'; }
  function videoBtns() {
    return '<button type="button" class="btn small cyan" id="vre">🔁 From the start</button>' +
      '<button type="button" class="btn small ghost" id="vsl">🐢 Slow</button><button type="button" class="btn small ghost" id="vno">🐇 Normal</button>';
  }
  function wireVideoBtns() {
    $('vre').onclick = function () { A.play('tap'); vid('seekTo', 0, true); vid('playVideo'); };
    $('vsl').onclick = function () { A.play('tap'); vid('setPlaybackRate', 0.75); $('vsl').classList.add('on'); $('vno').classList.remove('on'); };
    $('vno').onclick = function () { A.play('tap'); vid('setPlaybackRate', 1); $('vno').classList.add('on'); $('vsl').classList.remove('on'); };
  }

  /* ---------- navigation ---------- */
  function go(n) {
    clearTimers(); A.stop(); killVideo(); S.giving = false; S.syncing = false; S.cur = -1;
    S.step = n; paintFoot(); render(); tipOff();
  }
  function paintFoot() {
    $('steps').innerHTML = STEPS.map(function (s, i) {
      return '<button type="button" class="dot ' + (S.step === i ? 'on' : S.step > i ? 'done' : '') + '" data-s="' + i + '" title="' + s[1] + '">' + s[0] + '</button>';
    }).join('');
    $('steps').querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { go(+b.dataset.s); }; });
    $('back').disabled = S.step <= -1;
    $('next').textContent = S.step === -1 ? 'Start ▶' : S.step === 3 ? 'Finish 🏁' : S.step >= 4 ? 'Again ↺' : 'Next ▶';
  }
  $('next').onclick = function () { A.play('tap'); if (S.step >= 4) { S.scores = [0, 0, 0, 0]; S.k = 0; go(0); } else go(S.step + 1); };
  $('back').onclick = function () { A.play('tap'); go(Math.max(-1, S.step - 1)); };
  $('setup').onclick = function () { A.play('tap'); go(-1); };

  /* ---------- teacher tips ---------- */
  var TIPS = {
    '-1': ['Set up (once)', 'Paste the lyrics with a line like <b>[Chorus]</b> before each part. They stay on <b>this computer only</b> and are never uploaded. Tap the parts you want to <b>teach</b>: the chorus is enough for A1 learners. The other parts stay on screen so the class can follow along.'],
    '0': ['🎬 Move (about 8 min)', 'Play the video. The class does the <b>action</b> each time they hear the word. Play it once for fun, then again. Use 🐢 Slow if the class wants to practise the moves.'],
    '1': ['🧩 Learn (about 15 min)', 'For each line: 🔊 <b>Listen</b>, then the class <b>echoes</b> as the highlight moves ("Your turn"), then 🙈 hide words and say it from memory. Finish with 🎶 <b>All lines</b>. The computer voice only models the words: the real song sets the rhythm.'],
    '2': ['🎤 Sing (about 10 min)', 'The words only move with the song <b>after a one-time sync</b>: press <b>⏱ Every line</b> (best, about 4 minutes) or <b>⚡ Quick</b> (a few taps, one for each part), then tap the big green button when you hear the line or part start. It is saved on this computer, and after that the words follow the song by themselves. Until then, <b>Space</b> or ⏭ moves the highlight by hand. <b>💬 Subtitles</b> shows the video\'s own subtitles if it has them. Bright lines are the ones we teach.'],
    '3': ['🏆 Show (about 10 min)', 'Four teams take turns singing one line each. Press 🔊 Listen, then 🎤 Sing (the highlight moves at a steady pace), and give 1 to 3 stars (keys 1, 2, 3). Skip a line if a team is not ready.'],
    '4': ['🏁 Finish', 'Tick the "I can" goals with the class. Individual readers can use the 🎤 Karaoke Stage: your lyrics appear there as the Week Song pack.']
  };
  function tipOff() { $('tip').hidden = true; }
  $('tipbtn').onclick = function () { var t = TIPS[String(S.step)] || TIPS['0']; $('tip').innerHTML = '<h4>' + t[0] + '</h4><p>' + t[1] + '</p>'; $('tip').hidden = !$('tip').hidden; };

  function head(t, pill) { return '<div class="sh"><h2>' + t + '</h2>' + (pill ? '<span class="pill">' + pill + '</span>' : '') + '</div>'; }

  function render() {
    build();
    var v = [renderSetup, renderMove, renderLearn, renderSing, renderShow, renderEnd][S.step + 1];
    $('h-sub').textContent = esc0(cfg.title) + ' • Grade 4';
    v();
  }
  function esc0(t) { return String(t).replace(/[<>]/g, ''); }

  /* ---------- step 0: set up ---------- */
  function vidFrom(u) { var m = /(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/.exec(u || ''); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(u || '') ? u : ''); }
  function renderSetup() {
    build();
    stage.innerHTML = head('⚙️ Set up the week song', 'only once') +
      '<div class="setup2"><div class="panel"><h3>1. The video</h3>' +
        '<input id="vurl" placeholder="YouTube link" value="https://www.youtube.com/watch?v=' + esc(cfg.vid) + '"><input id="vtitle" placeholder="Song name" value="' + esc(cfg.title) + '">' +
        '<h3>2. The lyrics</h3><p class="hint">Paste them here. Put a line like <b>[Chorus]</b> before each part. They stay on <b>this computer only</b>.</p>' +
        '<textarea id="lyr" rows="9" placeholder="[Verse 1]&#10;first line&#10;second line&#10;&#10;[Chorus]&#10;...">' + esc(cfg.lyrics) + '</textarea>' +
        '<div class="chips"><button type="button" class="btn cyan small" id="clipl">📋 Paste from clipboard</button><button type="button" class="btn cyan small" id="filel">📂 Load a .txt file</button><input type="file" id="filein" accept=".txt,text/plain" hidden></div>' +
        '<div class="chips"><button type="button" class="btn green" id="savel">💾 Save</button><button type="button" class="btn ghost small" id="clearl">🗑️ Remove the lyrics</button></div><div class="hint" id="smsg"></div></div>' +
      '<div class="panel"><h3>3. Which parts do we teach?</h3>' +
        (secs.length ? '<p class="hint">Tap to choose. We teach the chosen parts line by line. The rest stay on the board to follow.</p><div class="chips" id="parts">' +
          secs.map(function (s, i) { return '<button type="button" class="part ' + (picked.indexOf(i) >= 0 ? 'on' : '') + '" data-p="' + i + '"><b>' + esc(s.name) + '</b><small>' + s.lines.length + ' lines</small></button>'; }).join('') +
          '</div><p class="hint"><b>' + teach.length + '</b> lines to teach · <b>' + actionList().length + '</b> action words found</p>'
          : '<p class="hint">No lyrics yet. You can still use the video and the actions with no lyrics.</p>') +
      '</div>' + turnsPanel() + '</div>';
    $('clipl').onclick = function () {
      if (!navigator.clipboard || !navigator.clipboard.readText) { $('smsg').innerHTML = '🤔 This browser cannot read the clipboard. Click in the box and press <b>Ctrl+V</b>.'; return; }
      navigator.clipboard.readText().then(function (t) { if (!t.trim()) { $('smsg').textContent = 'The clipboard is empty.'; return; } $('lyr').value = t; $('smsg').innerHTML = '📋 Pasted. Press <b>Save</b>.'; },
        function () { $('smsg').innerHTML = '🔒 Allow the clipboard, or click in the box and press <b>Ctrl+V</b>.'; });
    };
    $('filel').onclick = function () { $('filein').click(); };
    $('filein').onchange = function () {
      var f = this.files && this.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { $('lyr').value = String(r.result || ''); $('smsg').innerHTML = '📂 Loaded <b>' + esc(f.name) + '</b>. Press <b>Save</b>.'; }; r.readAsText(f);
    };
    $('savel').onclick = function () {
      var id = vidFrom($('vurl').value.trim());
      if (!id) { $('smsg').innerHTML = '🤔 That does not look like a YouTube link.'; return; }
      if (id !== cfg.vid) cfg.sync = {};
      if ($('lyr').value !== cfg.lyrics) { cfg.assign = null; cfg.solos = {}; cfg.manual = {}; cfg.sync = {}; }
      cfg.vid = id; cfg.title = $('vtitle').value.trim() || 'Week Song'; cfg.lyrics = $('lyr').value; cfg.picks = null; save(); A.play('star2'); renderSetup();
    };
    $('clearl').onclick = function () { if (!confirm('Remove the lyrics from this computer?')) return; cfg.lyrics = ''; cfg.picks = null; cfg.sync = {}; save(); renderSetup(); };
    stage.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () {
      var i = +b.dataset.p, p = picked.slice(), k = p.indexOf(i); if (k >= 0) p.splice(k, 1); else p.push(i);
      cfg.picks = p.sort(function (a, b2) { return a - b2; }); save(); A.play('tap'); renderSetup();
    }; });
    wireTurns();
  }

  /* who sings what: a panel in the set-up screen */
  function turnsList() {
    var html = '', last = -1;
    lines.forEach(function (l, i) {
      if (l.sec !== last) { last = l.sec; html += '<div class="tsec"><b>' + esc(secs[l.sec].name) + '</b><button type="button" class="btn small ghost" data-sec="' + l.sec + '" title="Give the whole part to the next singer">⟳ whole part</button></div>'; }
      var k = kindInfo(whoOf(i), i);
      html += '<div class="trow"><button type="button" class="tn" data-ln="' + i + '" style="--c:' + k.c + '"><span class="bd" style="--c:' + k.c + '">' + k.e + ' ' + esc(k.n) + '</span><em>' + esc(l.text) + '</em></button>' +
        '<button type="button" class="tnp" data-nm="' + i + '" title="Choose the pupils for this line">👤</button></div>';
    });
    return html;
  }
  function turnsPanel() {
    if (!lines.length) return '';
    var cl = classList(); if (cl.length && !cl.some(function (c) { return c.id === cfg.cls; })) { cfg.cls = cl[0].id; save(); }
    return '<div class="panel wide"><h3>4. Who sings what?</h3><p class="hint">Give each line to one pupil (solo), a team, or everyone. Tap a line to change who sings it.</p>' +
      '<div class="chips"><button type="button" class="btn small violet" data-pre="mix">🎤 + 👥 Solos and teams</button><button type="button" class="btn small violet" data-pre="teams">🦊🦉🐻🐇 Teams in turn</button><button type="button" class="btn small violet" data-pre="all">👥 Everyone</button>' +
      '<span class="gap"></span>' + cl.map(function (c) { return '<button type="button" class="btn small ' + (c.id === cfg.cls ? 'cyan' : 'ghost') + '" data-tc="' + esc(c.id) + '">' + esc(c.label) + '</button>'; }).join('') +
      '<button type="button" class="btn small amber" id="pickso">🎲 Pick the soloists</button></div><div class="turns" id="turns">' + turnsList() + '</div></div>';
  }
  // choose the pupils for one line by name (one or several), or type the names
  function openPicker(i, done) {
    var old = $('pk'); if (old) old.remove();
    var kids = kidsOf(cfg.cls), cur = whoOf(i) === 'solo' ? String(cfg.solos[i] || '') : '';
    var m = document.createElement('div'); m.id = 'pk'; m.className = 'pk';
    m.innerHTML = '<div class="box"><h3>👤 Who sings this line?</h3><div class="pl">' + esc(lines[i].text) + '</div>' +
      '<input id="pkin" placeholder="Type the names, or tap the pupils" value="' + esc(cur) + '">' +
      '<div class="chips" id="pkk">' + (kids.length ? kids.map(function (k) { return '<button type="button" class="kid2" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('') : '<span class="hint">No class list on this computer: type the names above.</span>') + '</div>' +
      '<div class="chips"><button type="button" class="btn green" id="pkok">✅ Done</button><button type="button" class="btn small violet" id="pkpart">Same for the whole part</button><button type="button" class="btn small ghost" id="pkclr">Clear</button><button type="button" class="btn small ghost" id="pkx">Cancel</button></div></div>';
    stage.appendChild(m);
    function names() { return $('pkin').value.split(/\s*,\s*/).map(function (s) { return s.trim(); }).filter(Boolean); }
    function paintChips() { var n = names(); m.querySelectorAll('[data-k]').forEach(function (b) { b.classList.toggle('on', n.indexOf(b.dataset.k) >= 0); }); }
    paintChips(); $('pkin').oninput = paintChips; $('pkin').focus();
    m.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { var n = names(), k = b.dataset.k, at = n.indexOf(k); if (at >= 0) n.splice(at, 1); else n.push(k); $('pkin').value = n.join(', '); A.play('tap'); paintChips(); }; });
    function put(idx, n) { cfg.assign[idx] = n.length ? 'solo' : 'all'; if (n.length) { cfg.solos[idx] = n.join(', '); cfg.manual[idx] = true; } else { delete cfg.solos[idx]; delete cfg.manual[idx]; } }
    function finish(whole) {
      var n = names(); if (!cfg.assign) cfg.assign = lines.map(function () { return 'all'; });
      lines.forEach(function (l, idx) { if (idx === i || (whole && l.sec === lines[i].sec)) put(idx, n); });
      save(); m.remove(); A.play(n.length ? 'star2' : 'tap'); done();
    }
    $('pkok').onclick = function () { finish(false); }; $('pkpart').onclick = function () { finish(true); };
    $('pkclr').onclick = function () { $('pkin').value = ''; paintChips(); }; $('pkx').onclick = function () { m.remove(); };
    $('pkin').onkeydown = function (e) { if (e.key === 'Enter') finish(false); if (e.key === 'Escape') m.remove(); };
  }
  function nextKind(code) { return KINDS[(KINDS.indexOf(code) + 1) % KINDS.length]; }
  function wireTurns() {
    var box = $('turns'); if (!box) return;
    function refresh() { box.innerHTML = turnsList(); wireLines(); }
    function ensure() { if (!cfg.assign) cfg.assign = lines.map(function () { return 'all'; }); }
    function solo(i) { if (whoOf(i) === 'solo' && !cfg.solos[i]) { var pool = kidsOf(cfg.cls); cfg.solos[i] = pool.length ? pool[Math.floor(Math.random() * pool.length)] : ''; } }
    function wireLines() {
      box.querySelectorAll('[data-ln]').forEach(function (b) { b.onclick = function () { var i = +b.dataset.ln; ensure(); cfg.assign[i] = nextKind(whoOf(i)); delete cfg.manual[i]; if (cfg.assign[i] !== 'solo') delete cfg.solos[i]; solo(i); save(); A.play('tap'); refresh(); }; });
      box.querySelectorAll('[data-nm]').forEach(function (b) { b.onclick = function () { ensure(); A.play('tap'); openPicker(+b.dataset.nm, refresh); }; });
      box.querySelectorAll('[data-sec]').forEach(function (b) { b.onclick = function () {
        var s = +b.dataset.sec; ensure(); var first = lines.findIndex(function (l) { return l.sec === s; }), nk = nextKind(whoOf(first));
        lines.forEach(function (l, i) { if (l.sec === s) { cfg.assign[i] = nk; solo(i); } }); save(); A.play('tap'); refresh();
      }; });
    }
    wireLines();
    stage.querySelectorAll('[data-pre]').forEach(function (b) { b.onclick = function () { applyPreset(b.dataset.pre); save(); A.play('star1'); refresh(); }; });
    stage.querySelectorAll('[data-tc]').forEach(function (b) { b.onclick = function () { cfg.cls = b.dataset.tc; save(); A.play('tap'); renderSetup(); }; });
    $('pickso').onclick = function () { ensure(); pickSolos(); A.play('spot'); refresh(); };
  }

  /* ---------- step 1: watch and move ---------- */
  function renderMove() {
    var acts = actionList();
    stage.innerHTML = head('🎬 Watch and move!', 'when you hear the word, do the action') +
      '<div class="two"><div class="left">' + videoBox() + '<div class="chips">' + videoBtns() + '</div></div>' +
      '<div class="right">' + (acts.length ? '<div class="acts">' + acts.map(function (a) { return '<button type="button" class="act" data-a="' + esc(a.t) + '"><b>' + a.e + '</b><span class="aw">' + esc(a.w) + '</span><small>' + esc(a.t) + '</small></button>'; }).join('') + '</div>'
        : '<div class="hint">Paste the lyrics in ⚙️ to get an action for the main words. For now: watch, clap and dance!</div>') + '</div></div>';
    mountVideo('yt'); wireVideoBtns();
    stage.querySelectorAll('.act').forEach(function (b) { b.onclick = function () { A.play('tap'); b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); }; });
  }

  /* ---------- step 2: learn line by line ---------- */
  function hideWords() {
    var k = 0;
    W.forEach(function (ws) { ws.forEach(function (el) {
      var t = el.textContent.replace(/[^A-Za-z]/g, ''), h = S.hide === 2 ? k !== 0 : S.hide === 1 ? (t.length > 2 && k % 3 === 1) : false;
      el.classList.toggle('hid', h); k++;
    }); });
  }
  function lightW(li, wi) {
    W.forEach(function (ws, L) { ws.forEach(function (el, I) { el.classList.toggle('done', L < li || (L === li && I < wi)); el.classList.toggle('now', L === li && I === wi); }); });
  }
  function clearLight() { W.forEach(function (ws) { ws.forEach(function (el) { el.classList.remove('now', 'done'); }); }); }
  function wordsOf() { return W.map(function (ws) { return ws.map(function (el) { return el.textContent; }); }); }
  function steady(onEnd) {   // the highlight moves at a steady pace: the class echoes
    clearTimers(); A.stop();
    var ws = wordsOf(), w = ws.map(function (x) { return A.weights(x); }), L = 0, I = 0, ms = PACE[cfg.pace][2];
    (function step() {
      if (L >= ws.length) { clearLight(); if (onEnd) onEnd(); return; }
      lightW(L, I); var wait = Math.max(380, w[L][I] * ms) + (I === ws[L].length - 1 ? 500 : 0);
      I++; if (I >= ws[L].length) { L++; I = 0; }
      timers.push(setTimeout(step, wait));
    })();
  }
  function renderLearn() {
    if (!teach.length) { stage.innerHTML = head('🧩 Learn the lines', '') + '<div class="hint big">Paste the lyrics in ⚙️ first, then choose the parts to teach.</div>'; return; }
    S.li = Math.min(S.li, teach.length - 1);
    var show = S.all ? teach : [teach[S.li]];
    stage.innerHTML = head('🧩 Learn the lines', S.all ? 'all lines together' : 'line ' + (S.li + 1) + ' of ' + teach.length) +
      '<div class="learn"><div class="lyr2' + (S.all ? ' all' : '') + '" id="lyr2">' + show.map(function (l, i) {
        return '<div class="ln2"><div class="em">' + emojiFor(l) + '</div><div class="tx">' + l.words.map(function (w, wi) { return '<span class="w" data-l="' + i + '" data-i="' + wi + '">' + esc(w) + '</span>'; }).join(' ') + '</div></div>';
      }).join('') + '</div>' +
      '<div class="ctrl"><button type="button" class="btn cyan" id="lis">🔊 Listen</button><button type="button" class="btn green big" id="echo">🗣️ Your turn!</button>' +
        '<button type="button" class="btn ghost" id="pace">' + PACE[cfg.pace][0] + ' ' + PACE[cfg.pace][1] + '</button><button type="button" class="btn violet" id="hid">' + ['🙈 Hide words', '🙈 Hide more', '👀 Show all'][S.hide] + '</button></div>' +
      '<div class="ctrl"><button type="button" class="btn ghost" id="prev"' + (S.all || S.li === 0 ? ' disabled' : '') + '>◀ Line</button>' +
        '<button type="button" class="btn ghost" id="all">' + (S.all ? '1️⃣ One line' : '🎶 All lines') + '</button>' +
        '<button type="button" class="btn ghost" id="nextl"' + (S.all || S.li >= teach.length - 1 ? ' disabled' : '') + '>Line ▶</button></div></div>';
    W = show.map(function (l, i) { return [].slice.call(stage.querySelectorAll('.w[data-l="' + i + '"]')); });
    hideWords(); fitLearn();
    stage.querySelectorAll('.w').forEach(function (el) { el.onclick = function () { clearTimers(); A.stop(); lightW(+el.dataset.l, +el.dataset.i); }; });
    $('lis').onclick = function () { clearTimers(); A.play('tap'); A.karaoke(wordsOf(), lightW, clearLight); };
    $('echo').onclick = function () { A.play('spot'); steady(function () { A.play('star1'); }); };
    $('pace').onclick = function () { cfg.pace = (cfg.pace + 1) % PACE.length; save(); this.textContent = PACE[cfg.pace][0] + ' ' + PACE[cfg.pace][1]; A.play('tap'); };
    $('hid').onclick = function () { S.hide = (S.hide + 1) % 3; this.textContent = ['🙈 Hide words', '🙈 Hide more', '👀 Show all'][S.hide]; hideWords(); A.play('tap'); };
    $('prev').onclick = function () { S.li--; clearTimers(); A.stop(); renderLearn(); };
    $('nextl').onclick = function () { S.li++; clearTimers(); A.stop(); renderLearn(); };
    $('all').onclick = function () { S.all = !S.all; clearTimers(); A.stop(); renderLearn(); };
  }
  function fitLearn() {
    var box = $('lyr2'); if (!box) return; var f = 1; box.style.fontSize = '1em';
    while (f > 0.45 && (box.scrollHeight > box.clientHeight + 2)) { f -= 0.05; box.style.fontSize = f + 'em'; }
  }

  /* ---------- step 3: sing along with the video ---------- */
  var secStarts = {};
  function renderSing() {
    if (!lines.length) { stage.innerHTML = head('🎤 Sing along', '') + '<div class="two"><div class="left">' + videoBox() + '<div class="chips">' + videoBtns() + '</div></div><div class="right"><div class="hint big">Paste the lyrics in ⚙️ to see the words here.</div></div></div>'; mountVideo('yt'); wireVideoBtns(); return; }
    S.mode = syncState() ? 'auto' : 'hand'; S.cur = -1; S.syncing = false; S.forceWarn = false;
    var html = '', last = -1;
    lines.forEach(function (l, i) {
      if (l.sec !== last) { last = l.sec; html += '<div class="lsec">' + esc(secs[l.sec].name) + '</div>'; }
      html += '<div class="ly ' + (picked.indexOf(l.sec) >= 0 ? 'teach' : 'dim') + '" data-i="' + i + '">' + (cfg.assign ? badge(i) : '') + esc(l.text) + '</div>';
    });
    stage.innerHTML = head('🎤 Sing along', 'bright lines = ours') +
      '<div class="two sing"><div class="left">' + videoBox() + '<div id="syncui"></div><div class="chips">' + videoBtns() + '<button type="button" class="btn small ' + (cfg.cc ? 'cyan' : 'ghost') + '" id="cc" title="Show the video\'s own subtitles">💬 Subtitles</button></div>' +
        '<div class="chips"><button type="button" class="btn small ghost" id="lp">⏮</button><button type="button" class="btn small green" id="ln">⏭ Next line (Space)</button>' +
        '<button type="button" class="btn small violet" id="mode"></button></div><div class="hint" id="smsg2"></div></div>' +
      '<div class="right">' + (cfg.assign ? '<div class="who2" id="who2"></div>' : '') + '<div class="lylist" id="lylist">' + html + '</div></div></div>';
    paintMode(); paintWho(true); paintSyncUI();
    mountVideo('yt', function (ok) { if (!ok) { $('mode').disabled = true; $('smsg2').textContent = 'No video player (internet?). Move the highlight by hand with Space.'; } });
    wireVideoBtns();
    $('lp').onclick = function () { stepLine(-1); }; $('ln').onclick = function () { stepLine(1); };
    $('mode').onclick = function () { if (S.mode === 'hand' && !syncState()) { $('smsg2').textContent = 'The words need the one-time sync first (the yellow box).'; return; } S.mode = S.mode === 'auto' ? 'hand' : 'auto'; paintMode(); };
    $('cc').onclick = function () { cfg.cc = !cfg.cc; save(); clearTimers(); killVideo(); renderSing(); };
    poll = setInterval(tick, 150);
  }
  function syncState() { return (cfg.sync[cfg.vid] || []).length > 3; }
  // the box under the video: tells the teacher clearly if the words will move, and holds the big TAP button while syncing
  function paintSyncUI() {
    var box = $('syncui'); if (!box) return;
    if (S.syncing) {
      var quick = S.syncKind === 'quick', n = S.syncTimes.length, total = quick ? secs.length : lines.length, ti = syncTarget();
      var what = quick ? 'the part <b>' + esc(secs[lines[ti].sec].name) + '</b>' : 'this line: <b>' + esc(lines[ti].text) + '</b>';
      box.innerHTML = '<div class="syncbox"><div class="sq">👂 Listen to the song. Tap the big button the moment ' + what + ' <b>starts</b>.</div>' +
        '<button type="button" class="btn green big tapbtn" id="tapbig">👆 TAP: it starts now! <small>' + n + ' / ' + total + '</small></button>' +
        '<div class="chips"><button type="button" class="btn small ghost" id="undo">↩ Undo</button><button type="button" class="btn small coral" id="stopsync">⏹ Finish</button></div></div>';
      $('tapbig').onclick = tapSync; $('undo').onclick = undoSync; $('stopsync').onclick = function () { endSync(); };
    } else if (syncState() && !S.forceWarn) {
      box.innerHTML = '<div class="syncok">✅ <b>The words move with the song.</b> <button type="button" class="btn small ghost" id="redo">🔄 Sync again</button></div>';
      $('redo').onclick = function () { S.forceWarn = true; paintSyncUI(); };
    } else {
      box.innerHTML = '<div class="syncwarn"><b>⚠️ The words do not move by themselves yet.</b> Do the sync <b>once</b> (it is saved on this computer): the song plays and you tap a big button when each line starts.' +
        '<div class="chips"><button type="button" class="btn green" id="sfull">⏱ Every line (best)</button><button type="button" class="btn amber" id="squick">⚡ Quick: only the parts</button></div></div>';
      $('sfull').onclick = function () { startSync('full'); }; $('squick').onclick = function () { startSync('quick'); };
    }
  }
  function syncTarget() {   // the line the teacher is about to tap for
    var n = S.syncTimes.length;
    if (S.syncKind === 'quick') { var s = Math.min(n, secs.length - 1); return Math.max(0, lines.findIndex(function (l) { return l.sec === s; })); }
    return Math.min(n, lines.length - 1);
  }
  function paintMode() { var m = $('mode'); if (m) m.textContent = S.mode === 'auto' ? '🤖 Auto (follows the video)' : '✋ By hand'; }
  function paintLines(scroll) {
    var list = $('lylist'); if (!list) return;
    list.querySelectorAll('.ly').forEach(function (el) { var i = +el.dataset.i; el.classList.toggle('now', i === S.cur); el.classList.toggle('past', i < S.cur); el.classList.toggle('next', S.syncing && i === syncTarget()); });
    paintWho();
    var el = list.querySelector('.ly.now') || (S.syncing ? list.querySelector('.ly.next') : null);
    if (el && scroll !== false) { var t = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2; list.scrollTo({ top: Math.max(0, t), behavior: 'smooth' }); }
  }
  // "Now: 🦊 Foxes" and, when the singer changes soon, "Next: 🎤 Ayşe": so the next singer can get ready
  var lastWho = '';
  function paintWho(first) {
    var el = $('who2'); if (!el || !cfg.assign) return;
    var i = S.syncing ? syncTarget() : S.cur, start = false;
    if (i < 0) { i = 0; start = true; } if (i >= lines.length) i = lines.length - 1;
    var nx = -1; for (var j = i + 1; j < lines.length; j++) { if (!sameSinger(i, j)) { nx = j; break; } }
    var key = whoOf(i) + '|' + (cfg.solos[i] || '') + '|' + start;
    el.innerHTML = '<span class="nw">' + (start ? 'First' : 'Now') + '</span>' + badge(i) + (nx >= 0 ? '<span class="nx">Next ' + badge(nx) + '</span>' : '');
    if (key !== lastWho && !first) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    lastWho = key;
  }
  function stepLine(d) { if (S.syncing) return; S.mode = 'hand'; paintMode(); S.cur = Math.max(-1, Math.min(lines.length - 1, S.cur + d)); paintLines(); A.play('tick'); }
  function tick() {
    if (S.step !== 2 || S.mode !== 'auto' || S.syncing || !player || !player.getCurrentTime) return;
    var t = vid('getCurrentTime'), ts = cfg.sync[cfg.vid] || [], idx = -1; if (typeof t !== 'number') return;
    for (var i = 0; i < ts.length; i++) { if (ts[i] <= t + 0.15) idx = i; else break; }
    if (idx !== S.cur) { S.cur = idx; paintLines(); }
  }
  function startSync(kind) {
    if (!player || !player.getCurrentTime) { $('smsg2').textContent = 'The sync needs the video player (and internet).'; return; }
    S.syncing = true; S.syncKind = kind === 'quick' ? 'quick' : 'full'; S.syncTimes = []; S.cur = -1; S.mode = 'hand'; paintMode();
    vid('setPlaybackRate', 1); vid('seekTo', 0, true); vid('playVideo');
    $('smsg2').textContent = ''; paintSyncUI(); paintLines();
  }
  function tapSync() {
    var t = vid('getCurrentTime'); if (typeof t !== 'number' || !S.syncing) return;
    var total = S.syncKind === 'quick' ? secs.length : lines.length; if (S.syncTimes.length >= total) return;
    S.syncTimes.push(+t.toFixed(2)); A.play('tick');
    S.cur = S.syncKind === 'full' ? S.syncTimes.length - 1 : -1;
    if (S.syncTimes.length >= total) { endSync(); return; }
    paintSyncUI(); paintLines();
  }
  function undoSync() { if (!S.syncing || !S.syncTimes.length) return; S.syncTimes.pop(); S.cur = S.syncKind === 'full' ? S.syncTimes.length - 1 : -1; A.play('tap'); paintSyncUI(); paintLines(); }
  // quick sync: the teacher tapped only where each PART starts; the lines inside a part share its time by how long they are to sing
  function quickTimes(got) {
    var durs = [], s, out = [];
    for (s = 0; s + 1 < got.length; s++) durs.push(got[s + 1] - got[s]);
    var avg = durs.length ? durs.reduce(function (a, b) { return a + b; }, 0) / durs.length : 30;
    for (s = 0; s < got.length; s++) {
      var start = got[s], end = s + 1 < got.length ? got[s + 1] : start + avg, mine = [];
      lines.forEach(function (l, i) { if (l.sec === s) mine.push(i); });
      var w = mine.map(function (i) { return A.weights(lines[i].words).reduce(function (a, b) { return a + b; }, 0) + 1; }), tot = w.reduce(function (a, b) { return a + b; }, 0) || 1, acc = 0;
      mine.forEach(function (i, k) { out[i] = +(start + (acc / tot) * (end - start)).toFixed(2); acc += w[k]; });
    }
    return out;
  }
  function endSync() {
    var quick = S.syncKind === 'quick', got = S.syncTimes.slice(), ok = quick ? got.length >= Math.min(2, secs.length) : got.length > 3;
    S.syncing = false;
    if (ok) { cfg.sync[cfg.vid] = quick ? quickTimes(got) : got; save(); S.mode = 'auto'; S.forceWarn = false; vid('seekTo', 0, true); }
    S.cur = -1; paintMode(); paintSyncUI(); paintLines();
    var m = $('smsg2'); if (m) m.innerHTML = ok ? '✅ Saved on this computer. Press <b>▶ play</b> on the video: the words follow the song by themselves.' : 'Not enough taps. Press the yellow button and try again.';
  }

  /* ---------- step 4: team show ---------- */
  function turns() { return Math.max(4, teach.length); }
  function renderShow() {
    if (!teach.length) { stage.innerHTML = head('🏆 Team show', '') + '<div class="hint big">Paste the lyrics in ⚙️ first, then choose the parts to teach.</div>'; return; }
    if (S.k >= turns()) { go(4); return; }
    var T = D.teams[S.k % 4], l = teach[S.k % teach.length];
    stage.innerHTML = head('🏆 Team show', 'turn ' + (S.k + 1) + ' of ' + turns()) +
      '<div class="teams">' + D.teams.map(function (t, i) { return '<div class="tm ' + (i === S.k % 4 ? 'on' : '') + '" style="--c:' + t.c + '">' + t.e + ' ' + t.n + '<b>' + S.scores[i] + ' ⭐</b></div>'; }).join('') + '</div>' +
      '<div class="learn"><div class="turn" style="--c:' + T.c + '">' + T.e + ' ' + T.n + ' sing!</div><div class="lyr2" id="lyr2"><div class="ln2"><div class="em">' + emojiFor(l) + '</div><div class="tx">' +
        l.words.map(function (w, wi) { return '<span class="w" data-l="0" data-i="' + wi + '">' + esc(w) + '</span>'; }).join(' ') + '</div></div></div>' +
      '<div class="ctrl"><button type="button" class="btn cyan" id="lis">🔊 Listen</button><button type="button" class="btn green big" id="echo">🎤 Sing!</button><button type="button" class="btn ghost" id="skip">⏭ Skip</button></div>' +
      '<div class="judge"><span class="q">How did ' + esc(T.n) + ' sing?</span>' + [1, 2, 3].map(function (n) { return '<button type="button" class="btn star s' + n + '" data-star="' + n + '">' + '⭐'.repeat(n) + '<small>' + STAR_TXT[n] + '</small></button>'; }).join('') + '</div></div>';
    W = [[].slice.call(stage.querySelectorAll('.w'))]; fitLearn();
    $('lis').onclick = function () { clearTimers(); A.play('tap'); A.karaoke(wordsOf(), lightW, clearLight); };
    $('echo').onclick = function () { A.play('spot'); steady(); };
    $('skip').onclick = function () { S.k++; clearTimers(); A.stop(); renderShow(); };
    stage.querySelectorAll('[data-star]').forEach(function (b) { b.onclick = function () { give(+b.dataset.star); }; });
  }
  function burst(n) {
    var cols = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#fde047'], count = [0, 14, 30, 70][n];
    for (var i = 0; i < count; i++) {
      var p = document.createElement('i'); p.className = n === 3 ? 'cf' : 'sp';
      p.style.left = (n === 3 ? Math.random() * 100 : 35 + Math.random() * 30) + 'vw'; p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.4) + 's'; p.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw');
      fx.appendChild(p); setTimeout(function (el) { el.remove(); }.bind(null, p), 3200);
    }
  }
  function give(n) {
    if (S.giving) return; S.giving = true; clearTimers(); A.stop();
    var T = D.teams[S.k % 4]; S.scores[S.k % 4] += n; A.play('star' + n); if (n === 3) setTimeout(function () { A.play('applause'); }, 350); burst(n);
    var ov = document.createElement('div'); ov.className = 'praise'; ov.innerHTML = '<div class="st">' + '⭐'.repeat(n) + '</div><div class="pt">' + STAR_TXT[n] + '</div><div class="pn">' + T.e + ' ' + T.n + '</div>'; stage.appendChild(ov);
    setTimeout(function () { S.giving = false; S.k++; renderShow(); }, 2000);
  }

  /* ---------- the end ---------- */
  function renderEnd() {
    S.step = 4; paintFoot(); A.play('fanfare'); burst(3);
    var rank = D.teams.map(function (t, i) { return { t: t, s: S.scores[i] }; }).sort(function (a, b) { return b.s - a.s; });
    stage.innerHTML = head('🏁 What a show!', '') +
      '<div class="endb"><div class="trophy">🎵</div><div class="board">' + rank.map(function (r, i) { return '<div class="row s' + (i === 0 ? 3 : i === 1 ? 2 : 1) + '"><b>' + ['🥇', '🥈', '🥉', '4️⃣'][i] + ' ' + r.t.e + ' ' + r.t.n + '</b><span>' + r.s + ' ⭐</span></div>'; }).join('') + '</div>' +
      '<h3>Tick what we can do!</h3><div class="goals">' + D.goals.map(function (g, i) { return '<button type="button" class="goal ' + (S.goals[i] ? 'on' : '') + '" data-g="' + i + '">' + (S.goals[i] ? '✅' : '⬜') + ' ' + esc(g) + '</button>'; }).join('') + '</div>' +
      '<div class="chips center"><button type="button" class="btn violet" id="again">🎤 Sing it once more</button><a class="btn cyan" href="../karaoke-stage/index.html" style="text-decoration:none">🎤 Karaoke Stage</a></div></div>';
    stage.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { var i = +b.dataset.g; S.goals[i] = !S.goals[i]; A.play(S.goals[i] ? 'star2' : 'tap'); renderEnd2(); }; });
    $('again').onclick = function () { go(2); };
  }
  function renderEnd2() { stage.querySelectorAll('[data-g]').forEach(function (b) { var i = +b.dataset.g; b.className = 'goal ' + (S.goals[i] ? 'on' : ''); b.textContent = (S.goals[i] ? '✅ ' : '⬜ ') + D.goals[i]; }); }

  /* ---------- keys, sound, full screen ---------- */
  document.addEventListener('keydown', function (e) {
    var tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA') return;
    if (S.step === 2 && e.code === 'Space') { e.preventDefault(); if (S.syncing) tapSync(); else stepLine(1); }
    else if (e.key === 'ArrowRight' && S.step === 2) { stepLine(1); }
    else if (e.key === 'ArrowLeft' && S.step === 2) { stepLine(-1); }
    else if (S.step === 3 && (e.key === '1' || e.key === '2' || e.key === '3')) give(+e.key);
  });
  $('snd').onclick = function () { A.setOn(!A.isOn()); this.textContent = A.isOn() ? '🔊' : '🔇'; };
  $('fs').onclick = function () { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { /* not allowed */ } };
  window.addEventListener('resize', function () { if (S.step === 1 || S.step === 3) fitLearn(); });

  build();
  S.step = lines.length ? 0 : -1;
  paintFoot(); render();
})();
