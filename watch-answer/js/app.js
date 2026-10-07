/* Watch & Answer: the class watches a cartoon; at each checkpoint the video stops by itself and the class answers a question.
   Steps: Predict, Watch and answer, Retell the story, Tell your partner, Finish. The teacher can edit every question (gear button);
   changes are saved only in this browser. Nothing here records or uploads the pupils. */
(function () {
  'use strict';
  var D = window.WatchData, A = window.KaraokeAudio;
  var KEY = 'eaa_watchlesson_v1';
  var STEPS = [['🔮', 'Predict'], ['🎬', 'Watch'], ['🧩', 'Retell'], ['🗣️', 'Speak']];
  var stage = document.getElementById('stage'), fx = document.getElementById('fx');
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- the lesson (defaults + what the teacher changed in this browser) ---------- */
  var base = D.lessons[0], saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
  function L() { var o = saved[base.id]; return o && Array.isArray(o.checkpoints) ? Object.assign({}, base, { checkpoints: o.checkpoints }) : base; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private window */ } }
  function cps() { return L().checkpoints.slice().sort(function (a, b) { return a.t - b.t; }); }

  /* ---------- the video ---------- */
  var player = null, poll = 0, timers = [], ytWait = [], ytAsked = false;
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
    loadYT(function (ok) {
      var host = $(hostId); if (!host) return;
      if (ok) {
        try {
          player = new window.YT.Player(hostId, { videoId: L().vid, width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: S.cc ? 1 : 0, cc_lang_pref: 'en', hl: 'en' },
            events: { onReady: function () { if (onReady) onReady(true); } } });
          return;
        } catch (e) { /* plain embed below */ }
      }
      player = null;
      host.outerHTML = '<iframe id="' + hostId + '" src="https://www.youtube.com/embed/' + encodeURIComponent(L().vid) + '?rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>';
      if (onReady) onReady(false);
    });
  }
  function killVideo() { if (player && player.destroy) { try { player.destroy(); } catch (e) { /* ignore */ } } player = null; }
  function vid(fn) { try { if (player && player[fn]) return player[fn].apply(player, [].slice.call(arguments, 1)); } catch (e) { /* not ready */ } }
  function videoBox() { return '<div class="vbox"><div id="yt"></div></div>'; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; clearInterval(poll); poll = 0; }

  /* ---------- state and navigation ---------- */
  var S = { step: 0, shown: {}, active: -1, scores: [0, 0, 0, 0], awarded: {}, goals: [false, false, false], rt: null, cc: false, pick: -1, left: 0, giving: false };
  function go(n) { clearTimers(); A.stop(); killVideo(); S.active = -1; S.step = n; paintFoot(); render(); $('tip').hidden = true; }
  function paintFoot() {
    $('steps').innerHTML = STEPS.map(function (s, i) { return '<button type="button" class="dot ' + (S.step === i ? 'on' : S.step > i ? 'done' : '') + '" data-s="' + i + '" title="' + s[1] + '">' + s[0] + '</button>'; }).join('');
    $('steps').querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { go(+b.dataset.s); }; });
    $('back').disabled = S.step <= 0 || S.step === 5;
    $('next').textContent = S.step === 3 ? 'Finish 🏁' : S.step === 4 ? 'Again ↺' : S.step === 5 ? 'Back ◀' : 'Next ▶';
  }
  $('next').onclick = function () { A.play('tap'); if (S.step === 4) { S.shown = {}; S.scores = [0, 0, 0, 0]; S.awarded = {}; go(0); } else if (S.step === 5) go(0); else go(S.step + 1); };
  $('back').onclick = function () { A.play('tap'); go(Math.max(0, S.step - 1)); };
  $('setup').onclick = function () { A.play('tap'); go(5); };
  var TIPS = {
    '0': ['🔮 Predict (about 2 min)', 'Read the title with the class. Pupils choose what they think a <b>super trolley</b> can do and say <b>I think it can…</b>. There is no wrong answer: we check after the video.'],
    '1': ['🎬 Watch and answer (about 20 min)', 'Press play. The video <b>stops by itself</b> and shows a question. Tap an answer (or press 1, 2, 3). A wrong answer gives a hint and no points are lost. After a right answer, the class says the sentence, you give the point to a team, then press <b>Keep watching</b>. <b>🔁</b> watches the last part again. The times were set by looking at the video: if a question does not fit, press ⚙️ to change it.'],
    '2': ['🧩 Retell (about 5 min)', 'Tap the sentences in the order the story happened. Then 🎬 <b>Say the story</b>: the class reads the six sentences with the voice.'],
    '3': ['🗣️ Speak (about 3 min)', 'Pairs tell the story with <b>First, … Then, … Finally, …</b> using the word bank. Start the timer. The sentences from the Retell game are the model.'],
    '4': ['🏁 Finish', 'Tick the "I can" goals with the class. 🔁 watches the video again for fun.'],
    '5': ['⚙️ Edit', 'Press <b>📍</b> to copy the video time (play or pause the video where the question should appear). Change the words, choose the right answer, and press <b>Save</b>. Changes stay in this browser.']
  };
  $('tipbtn').onclick = function () { var t = TIPS[String(S.step)] || TIPS['1']; $('tip').innerHTML = '<h4>' + t[0] + '</h4><p>' + t[1] + '</p>'; $('tip').hidden = !$('tip').hidden; };
  function head(t, pill) { return '<div class="sh"><h2>' + t + '</h2>' + (pill ? '<span class="pill">' + pill + '</span>' : '') + '</div>'; }
  function render() { [renderPredict, renderWatch, renderRetell, renderSpeak, renderEnd, renderEdit][S.step](); }

  /* ---------- 1. predict ---------- */
  function renderPredict() {
    var p = L().predict;
    stage.innerHTML = head('🔮 Predict', 'think before we watch') +
      '<div class="learn"><div class="lyr2"><div class="ln2"><div class="em">🎬</div><div class="tx">' + esc(p.q) + '</div></div></div>' +
      '<div class="qopts" id="po">' + p.opts.map(function (o, i) { return '<button type="button" class="btn qo" data-o="' + i + '"><b>' + o[0] + '</b><span>' + esc(o[1]) + '</span></button>'; }).join('') + '</div>' +
      '<div class="qfb" id="pfb">Say: <b>I think it can…</b></div></div>';
    stage.querySelectorAll('.qo').forEach(function (b) { b.onclick = function () { A.play('star1'); stage.querySelectorAll('.qo').forEach(function (x) { x.classList.remove('right'); }); b.classList.add('right'); $('pfb').innerHTML = '🎯 ' + esc(p.note); }; });
  }

  /* ---------- 2. watch and answer ---------- */
  function renderWatch() {
    S.active = -1;
    stage.innerHTML = head('🎬 Watch and answer', 'the video stops for a question') +
      '<div class="two"><div class="left">' + videoBox() + '<div class="chips"><button type="button" class="btn small cyan" id="rep" title="Watch the last part again">🔁 Last part again</button>' +
      '<button type="button" class="btn small ghost" id="vsl">🐢 Slow</button><button type="button" class="btn small ghost" id="vno">🐇 Normal</button>' +
      '<button type="button" class="btn small ' + (S.cc ? 'cyan' : 'ghost') + '" id="cc">💬 Subtitles</button></div></div>' +
      '<div class="right"><div class="teams small" id="tms"></div><div class="qpanel" id="qp"></div></div></div>';
    mountVideo('yt'); paintTeams(); paintIdle();
    $('rep').onclick = function () { A.play('tap'); var c = cps(), i = S.active >= 0 ? S.active : lastShown(); var t = i >= 0 ? Math.max(0, c[i].t - 14) : 0; S.active = -1; paintIdle(); vid('seekTo', t, true); vid('playVideo'); };
    $('vsl').onclick = function () { A.play('tap'); vid('setPlaybackRate', 0.75); };
    $('vno').onclick = function () { A.play('tap'); vid('setPlaybackRate', 1); };
    $('cc').onclick = function () { S.cc = !S.cc; clearTimers(); killVideo(); renderWatch(); };
    poll = setInterval(tick, 200);
  }
  function lastShown() { var c = cps(), k = -1; c.forEach(function (x, i) { if (S.shown[i]) k = i; }); return k; }
  function nextIdx() { var c = cps(); for (var i = 0; i < c.length; i++) if (!S.shown[i]) return i; return -1; }
  function paintTeams() {
    var el = $('tms'); if (!el) return;
    el.innerHTML = D.teams.map(function (t, i) { return '<div class="tm" style="--c:' + t.c + '">' + t.e + ' <b>' + S.scores[i] + ' ⭐</b></div>'; }).join('');
  }
  function paintIdle() {
    var qp = $('qp'); if (!qp) return; var c = cps(), n = nextIdx();
    qp.innerHTML = '<div class="qidle"><span class="big">🍿</span>' + (n < 0 ? '<b>That was the last question!</b><br>When the video ends, press <b>Next</b>.' : 'Watch the cartoon.<br>It will stop for <b>question ' + (n + 1) + '</b> of ' + c.length + '.') + '</div>' +
      '<div class="dots">' + c.map(function (x, i) { return '<i class="' + (S.shown[i] ? 'done' : i === n ? 'now' : '') + '"></i>'; }).join('') + '</div>';
  }
  function tick() {
    if (S.step !== 1 || S.active >= 0 || !player || !player.getCurrentTime) return;
    var t = vid('getCurrentTime'); if (typeof t !== 'number') return;
    var c = cps(), n = nextIdx();
    while (n >= 0 && t > c[n].t + 12) { S.shown[n] = true; n = nextIdx(); }   // the teacher skipped ahead: do not ask the old questions
    if (n >= 0 && t >= c[n].t && vid('getPlayerState') === 1) ask(n);
    else if (n < 0 || t < c[n].t) { /* keep watching */ }
  }
  function ask(i) {
    S.shown[i] = true; S.active = i; vid('pauseVideo'); A.play('spot');
    var c = cps()[i], qp = $('qp'); if (!qp) return;
    qp.innerHTML = '<div class="qn">Question ' + (i + 1) + ' of ' + cps().length + '</div><div class="qq">' + esc(c.q) + '</div>' +
      '<div class="qopts">' + c.opts.map(function (o, k) { return '<button type="button" class="btn qo" data-o="' + k + '"><b>' + o[0] + '</b><span>' + esc(o[1]) + '</span></button>'; }).join('') + '</div>' +
      '<div class="qfb" id="qfb"></div><div class="award" id="aw"></div>' +
      '<div class="chips"><button type="button" class="btn green" id="go" hidden>▶ Keep watching</button><button type="button" class="btn small ghost" id="sk">⏭ Skip</button></div>';
    qp.querySelectorAll('.qo').forEach(function (b) { b.onclick = function () { choose(i, +b.dataset.o, b); }; });
    $('go').onclick = resume; $('sk').onclick = resume;
    paintIdleDots();
  }
  function paintIdleDots() { /* the dots live in the idle view only */ }
  function choose(i, k, btn) {
    var c = cps()[i], fb = $('qfb'); if (!fb || S.awarded['r' + i]) return;
    if (k === c.a) {
      S.awarded['r' + i] = true; A.play('star2'); btn.classList.add('right'); $('qp').querySelectorAll('.qo').forEach(function (x) { if (x !== btn) x.classList.add('dim'); });
      fb.className = 'qfb ok'; fb.innerHTML = '<div class="say2">✅ <span id="sy">' + esc(c.say) + '</span><button type="button" class="btn small cyan" id="sayb">🔊 Say it</button></div>';
      $('sayb').onclick = function () { A.karaoke([c.say.split(/\s+/)], function () {}, function () {}); };
      $('aw').innerHTML = '<span class="lab">Point for:</span>' + D.teams.map(function (t, ti) { return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-t="' + ti + '">' + t.e + ' +1</button>'; }).join('');
      $('aw').querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { if (S.awarded['t' + i]) return; S.awarded['t' + i] = true; S.scores[+b.dataset.t]++; A.play('star3'); burst(1); paintTeams(); $('aw').innerHTML = '<span class="lab">⭐ Point for ' + D.teams[+b.dataset.t].e + ' ' + D.teams[+b.dataset.t].n + '!</span>'; }; });
      $('go').hidden = false; $('sk').hidden = true;
    } else {
      A.play('soft'); btn.classList.add('wrong'); setTimeout(function () { btn.classList.remove('wrong'); }, 500);
      fb.className = 'qfb'; fb.innerHTML = '💡 ' + esc(c.hint || 'Look again!') + ' <small>(try another one)</small>';
    }
  }
  function resume() { S.active = -1; paintIdle(); vid('playVideo'); A.play('tap'); }

  /* ---------- 3. retell ---------- */
  function renderRetell() {
    var r = L().retell; S.rt = { pool: shuffled(r.map(function (x, i) { return i; })), next: 0 };
    var lead = ['First,', 'Then,', 'Next,', 'Then,', 'After that,', 'Finally,'];
    stage.innerHTML = head('🧩 Retell the story', 'tap the sentences in order') +
      '<div class="rt"><div class="rcards" id="rcs">' + S.rt.pool.map(function (i) { return '<button type="button" class="btn rc" data-i="' + i + '"><b>' + r[i].e + '</b><span>' + esc(r[i].s) + '</span></button>'; }).join('') + '</div>' +
      '<div class="slots" id="sls">' + r.map(function (x, i) { return '<div class="slot" id="sl' + i + '"><span class="n">' + (lead[i] || (i + 1) + '.') + '</span><span class="v"></span></div>'; }).join('') +
        '<div class="chips"><button type="button" class="btn cyan" id="say" hidden>🎬 Say the story</button></div></div></div>';
    stage.querySelectorAll('.rc').forEach(function (b) { b.onclick = function () {
      var i = +b.dataset.i;
      if (i === S.rt.next) { A.play('star2'); b.classList.add('used'); var s = $('sl' + i); s.classList.add('fill'); s.querySelector('.v').textContent = r[i].e + ' ' + r[i].s; S.rt.next++;
        if (S.rt.next >= r.length) { A.play('fanfare'); burst(3); $('say').hidden = false; } }
      else { A.play('soft'); b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500); }
    }; });
    $('say').onclick = function () { A.karaoke(r.map(function (x) { return x.s.split(/\s+/); }), function () {}, function () {}); };
  }

  /* ---------- 4. speak ---------- */
  function renderSpeak() {
    var r = L().retell; S.left = 90;
    stage.innerHTML = head('🗣️ Tell your partner', 'what happened in the video?') +
      '<div class="learn"><div class="frames"><div class="frame"><span class="lead">First,</span><span class="gap"></span></div><div class="frame"><span class="lead">Then,</span><span class="gap"></span></div><div class="frame"><span class="lead">Finally,</span><span class="gap"></span></div></div>' +
      '<div class="bank">' + r.map(function (x) { return '<span><b>' + x.e + '</b>' + esc(x.s.replace(/\.$/, '')) + '</span>'; }).join('') + '</div>' +
      '<div class="timer" id="tmr">1:30</div><div class="ctrl"><button type="button" class="btn green big" id="tgo">▶ Start the timer</button></div></div>';
    $('tgo').onclick = function () {
      clearTimers(); A.play('spot'); S.left = 90; var t = $('tmr');
      poll = setInterval(function () { S.left--; var m = Math.floor(S.left / 60), s = S.left % 60; t.textContent = m + ':' + (s < 10 ? '0' : '') + s; if (S.left <= 0) { clearInterval(poll); poll = 0; A.play('fanfare'); t.textContent = '🔔 Time!'; } }, 1000);
    };
  }

  /* ---------- the end ---------- */
  function burst(n) {
    var cols = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#fde047'], count = [0, 14, 30, 70][n];
    for (var i = 0; i < count; i++) {
      var p = document.createElement('i'); p.className = n === 3 ? 'cf' : 'sp';
      p.style.left = (n === 3 ? Math.random() * 100 : 35 + Math.random() * 30) + 'vw'; p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.4) + 's'; p.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw');
      fx.appendChild(p); setTimeout(function (el) { el.remove(); }.bind(null, p), 3200);
    }
  }
  function renderEnd() {
    A.play('fanfare'); burst(3);
    var rank = D.teams.map(function (t, i) { return { t: t, s: S.scores[i] }; }).sort(function (a, b) { return b.s - a.s; }), g = L().goals;
    stage.innerHTML = head('🏁 Well done!', '') +
      '<div class="endb"><div class="trophy">🎬</div><div class="board">' + rank.map(function (r, i) { return '<div class="row s' + (i === 0 ? 3 : i === 1 ? 2 : 1) + '"><b>' + ['🥇', '🥈', '🥉', '4️⃣'][i] + ' ' + r.t.e + ' ' + r.t.n + '</b><span>' + r.s + ' ⭐</span></div>'; }).join('') + '</div>' +
      '<h3>Tick what we can do!</h3><div class="goals">' + g.map(function (x, i) { return '<button type="button" class="goal ' + (S.goals[i] ? 'on' : '') + '" data-g="' + i + '">' + (S.goals[i] ? '✅ ' : '⬜ ') + esc(x) + '</button>'; }).join('') + '</div>' +
      '<div class="chips center"><button type="button" class="btn violet" id="again">🎬 Watch it again</button></div></div>';
    stage.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { var i = +b.dataset.g; S.goals[i] = !S.goals[i]; A.play(S.goals[i] ? 'star2' : 'tap'); b.className = 'goal ' + (S.goals[i] ? 'on' : ''); b.textContent = (S.goals[i] ? '✅ ' : '⬜ ') + g[i]; }; });
    $('again').onclick = function () { S.shown = {}; S.awarded = {}; go(1); };
  }

  /* ---------- edit the questions ---------- */
  function fmt(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }
  function parseT(s) { s = String(s).trim(); var m = /^(\d+):(\d{1,2})$/.exec(s); return m ? (+m[1]) * 60 + (+m[2]) : (parseFloat(s) || 0); }
  function optStr(o) { return o[0] ? o[0] + ' ' + o[1] : o[1]; }
  function parseOpt(s) { s = String(s).trim(); var m = /^(\S+)\s+(.+)$/.exec(s); return m && m[1].charCodeAt(0) > 255 ? [m[1], m[2]] : ['', s]; }
  function renderEdit() {
    var c = cps();
    stage.innerHTML = head('⚙️ Change the questions', 'saved in this browser') +
      '<div class="two"><div class="left">' + videoBox() + '<div class="hint">Play or pause the video where a question should appear, then press 📍 on that question.</div>' +
      '<div class="chips"><button type="button" class="btn green" id="esave">💾 Save</button><button type="button" class="btn ghost small" id="eadd">➕ Add a question</button><button type="button" class="btn ghost small" id="ereset">↩ Original questions</button></div><div class="hint" id="emsg"></div></div>' +
      '<div class="right"><div class="ed" id="ed">' + c.map(row).join('') + '</div></div></div>';
    mountVideo('yt'); wireRows();
    $('esave').onclick = function () {
      var rows = [].slice.call(stage.querySelectorAll('.edrow')), out = [];
      rows.forEach(function (r) {
        var q = r.querySelector('.eq').value.trim(), opts = [].slice.call(r.querySelectorAll('.eo')).map(function (x) { return parseOpt(x.value); }).filter(function (o) { return o[1]; });
        if (!q || opts.length < 2) return;
        var a = +(r.querySelector('input[type=radio]:checked') || { value: 0 }).value; if (a >= opts.length) a = 0;
        out.push({ t: parseT(r.querySelector('.tm2').value), q: q, opts: opts, a: a, say: r.querySelector('.es').value.trim() || q, hint: r.querySelector('.eh').value.trim() });
      });
      if (!out.length) { $('emsg').textContent = 'Add at least one question with 2 answers.'; return; }
      saved[base.id] = { checkpoints: out }; persist(); A.play('star2'); $('emsg').textContent = '✅ Saved. ' + out.length + ' questions.';
    };
    $('eadd').onclick = function () { var t = vid('getCurrentTime'); $('ed').insertAdjacentHTML('beforeend', row({ t: typeof t === 'number' ? t : 0, q: '', opts: [['', ''], ['', ''], ['', '']], a: 0, say: '', hint: '' }, 99)); wireRows(); };
    $('ereset').onclick = function () { if (!confirm('Go back to the original questions?')) return; delete saved[base.id]; persist(); renderEdit(); };
  }
  function row(c, n) {
    var id = 'g' + Math.random().toString(36).slice(2, 7), o = c.opts.concat([['', ''], ['', ''], ['', '']]).slice(0, 3);
    return '<div class="edrow"><input class="tm2" value="' + fmt(c.t) + '" title="Time (minutes:seconds)"><input class="eq" placeholder="Question" value="' + esc(c.q) + '"><button type="button" class="btn small ghost" data-x title="Remove">🗑️</button>' +
      '<div class="opts">' + o.map(function (x, k) { return '<label><input type="radio" name="' + id + '" value="' + k + '"' + (k === c.a ? ' checked' : '') + '><input class="eo" placeholder="🥣 answer ' + (k + 1) + '" value="' + esc(optStr(x)) + '"></label>'; }).join('') + '</div>' +
      '<input class="es" placeholder="Sentence to say after the right answer" value="' + esc(c.say) + '" style="grid-column:1/-1"><input class="eh" placeholder="Hint for a wrong answer" value="' + esc(c.hint || '') + '" style="grid-column:1/-1">' +
      '<button type="button" class="btn small cyan" data-p title="Use the video time" style="grid-column:1/-1">📍 Use the video time</button></div>';
  }
  function wireRows() {
    stage.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { var t = vid('getCurrentTime'); if (typeof t !== 'number') { $('emsg').textContent = 'The video player is not ready (internet?). Type the time instead.'; return; } b.parentNode.querySelector('.tm2').value = fmt(t); A.play('tap'); }; });
    stage.querySelectorAll('[data-x]').forEach(function (b) { b.onclick = function () { b.parentNode.remove(); A.play('tap'); }; });
  }

  /* ---------- keys, sound, full screen ---------- */
  document.addEventListener('keydown', function (e) {
    var tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA') return;
    if (S.step === 1 && S.active >= 0) {
      if (e.key === '1' || e.key === '2' || e.key === '3') { var b = stage.querySelectorAll('.qo')[+e.key - 1]; if (b) b.click(); }
      else if (e.code === 'Space' && !$('go').hidden) { e.preventDefault(); resume(); }
    }
  });
  $('snd').onclick = function () { A.setOn(!A.isOn()); this.textContent = A.isOn() ? '🔊' : '🔇'; };
  $('fs').onclick = function () { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { /* not allowed */ } };

  paintFoot(); render();
})();
