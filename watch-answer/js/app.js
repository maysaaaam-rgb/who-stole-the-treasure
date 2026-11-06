/* Watch & Answer: Interactive Classroom Cinema Engine (v7 Master Upgrade)
   Steps:
   0 = 🔮 Predict & Movie Words (Prediction + Free Speaking Frame + Interactive Vocabulary Deck)
   1 = 🎬 Watch, Touch-Spot, Freeze-Bet & Live Word-Catcher
   2 = 🧩 Visual Scene Snapshot Story Retell (<canvas> real movie frames)
   3 = 🗣️ Story Speaking & 🎙️ Character Voice Dubbing Studio (Live Web Audio Mic Meter)
   4 = 🏁 Championship Podium & Goals
   5 = ⚙️ Live Checkpoint Editor (+ Copy JSON export) */
(function () {
  'use strict';
  var D = window.WatchData, A = window.KaraokeAudio;
  var KEY = 'eaa_watchlesson_v2';
  var STEPS = [['🔮', 'Predict'], ['🎬', 'Watch'], ['🧩', 'Retell'], ['🗣️', 'Speak & Dub']];
  var stage = document.getElementById('stage'), fx = document.getElementById('fx');
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- lesson selection & persistence ---------- */
  var params = new URLSearchParams(window.location.search);
  var reqId = params.get('lesson') || '';
  var curIdx = 0;
  D.lessons.forEach(function (l, i) { if (l.id === reqId) curIdx = i; });

  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
  var customBlobUrls = {};
  var frameCache = {}; // lessonId -> { index: dataUrl }

  function base() { return D.lessons[curIdx] || D.lessons[0]; }
  function L() {
    var b = base(), o = saved[b.id];
    return o && Array.isArray(o.checkpoints) ? Object.assign({}, b, { checkpoints: o.checkpoints }) : b;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private window */ } }
  function cps() { return L().checkpoints.slice().sort(function (a, b) { return a.t - b.t; }); }

  function speakText(text) {
    if (!text) return;
    A.karaoke([String(text).split(/\s+/)], function () {}, function () {});
  }

  function paintMovieTabs() {
    var host = $('movie-tabs');
    if (!host) return;
    host.innerHTML = D.lessons.map(function (l, i) {
      return '<button type="button" class="btn small movie-tab ' + (i === curIdx ? 'active' : '') + '" data-m="' + i + '">' + esc(l.badge || l.title) + '</button>';
    }).join('');
    host.querySelectorAll('[data-m]').forEach(function (b) {
      b.onclick = function () {
        var idx = +b.dataset.m;
        if (idx === curIdx) return;
        A.play('tap');
        curIdx = idx;
        S.shown = {}; S.awarded = {}; S.goals = [false, false, false]; S.caughtWords = {}; S.bets = {};
        paintMovieTabs();
        updateHeaderSub();
        go(S.step);
      };
    });
    updateHeaderSub();
  }

  function updateHeaderSub() {
    var l = L();
    if ($('h-sub')) $('h-sub').textContent = 'Grade ' + l.grade + ' • ' + l.title;
    if ($('ws-link')) $('ws-link').href = 'worksheet.html?lesson=' + encodeURIComponent(l.id);
    extractRetellSnapshots(l);
  }

  if ($('vfile')) {
    $('vfile').onchange = function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var url = URL.createObjectURL(f);
      customBlobUrls[L().id] = url;
      delete frameCache[L().id];
      extractRetellSnapshots(L());
      A.play('star2');
      if (S.step === 1 || S.step === 5) {
        clearTimers(); killVideo(); render();
      } else {
        go(1);
      }
    };
  }

  /* ---------- Real Movie Snapshot Extractor for Visual Story Retell ---------- */
  function extractRetellSnapshots(lesson, forceRefresh) {
    if (!lesson || !Array.isArray(lesson.retell)) return;
    if (!forceRefresh && frameCache[lesson.id] && frameCache[lesson.id]._ready) return;
    frameCache[lesson.id] = frameCache[lesson.id] || {};
    var src = customBlobUrls[lesson.id] || lesson.localVideo || '';
    if (!src) return;
    var v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.src = src;
    var idx = 0;
    var items = lesson.retell;
    var canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    var ctx = canvas.getContext('2d');

    function grabNext() {
      if (idx >= items.length) {
        frameCache[lesson.id]._ready = true;
        try { v.removeAttribute('src'); v.load(); } catch (e) {}
        return;
      }
      var targetT = items[idx].t || ((idx + 1) * 90);
      try {
        v.currentTime = targetT;
      } catch (e) {
        idx++;
        grabNext();
      }
    }
    v.addEventListener('loadedmetadata', function () {
      grabNext();
    });
    v.addEventListener('seeked', function () {
      try {
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        frameCache[lesson.id][idx] = canvas.toDataURL('image/jpeg', 0.78);
        if (S.step === 2) {
          var imgEl = document.getElementById('rt-snap-' + idx);
          if (imgEl) {
            imgEl.src = frameCache[lesson.id][idx];
            imgEl.style.display = 'block';
          }
        }
      } catch (e) { /* cross-origin fallback uses styled card */ }
      idx++;
      grabNext();
    });
  }

  function captureLiveFrameIfNear(t) {
    if (!player || !player._v) return;
    var l = L();
    frameCache[l.id] = frameCache[l.id] || {};
    (l.retell || []).forEach(function (r, idx) {
      if (!frameCache[l.id][idx] && r.t && Math.abs(t - r.t) < 4) {
        try {
          var c = document.createElement('canvas');
          c.width = 320; c.height = 180;
          c.getContext('2d').drawImage(player._v, 0, 0, 320, 180);
          frameCache[l.id][idx] = c.toDataURL('image/jpeg', 0.78);
        } catch (e) {}
      }
    });
  }

  /* ---------- the video (HTML5 cloud/local video + YouTube fallback) ---------- */
  var player = null, poll = 0, timers = [], ytWait = [], ytAsked = false, activeMicStream = null;
  function stopMic() {
    if (activeMicStream && activeMicStream.getTracks) {
      try { activeMicStream.getTracks().forEach(function (tr) { tr.stop(); }); } catch (e) {}
    }
    activeMicStream = null;
  }

  function loadYT(cb) {
    if (window.YT && window.YT.Player) { cb(true); return; }
    ytWait.push(cb); if (ytAsked) return; ytAsked = true;
    window.onYouTubeIframeAPIReady = function () { ytWait.splice(0).forEach(function (f) { f(true); }); };
    var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = function () { ytWait.splice(0).forEach(function (f) { f(false); }); };
    document.head.appendChild(s);
    setTimeout(function () { if (!(window.YT && window.YT.Player)) ytWait.splice(0).forEach(function (f) { f(false); }); }, 7000);
  }

  function createHtml5Adapter(v, onReady) {
    var p = {
      _v: v,
      getCurrentTime: function () { return v.currentTime || 0; },
      getPlayerState: function () { return v.paused ? 2 : 1; },
      pauseVideo: function () { try { v.pause(); } catch (e) {} },
      playVideo: function () { try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} },
      seekTo: function (t) { try { v.currentTime = t; } catch (e) {} },
      setPlaybackRate: function (r) { try { v.playbackRate = r; } catch (e) {} },
      destroy: function () { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }
    };
    if (onReady) setTimeout(function () { onReady(true); }, 30);
    return p;
  }

  function mountVideo(hostId, onReady) {
    var host = $(hostId); if (!host) return;
    var l = L();
    var isGithubHost = /github\.io$/i.test(window.location.hostname || '');
    var candidates = [];
    if (customBlobUrls[l.id]) candidates.push(customBlobUrls[l.id]);
    if (isGithubHost) {
      if (l.cloudVideo) candidates.push(l.cloudVideo);
      if (l.localVideo) candidates.push(l.localVideo);
    } else {
      if (l.localVideo) candidates.push(l.localVideo);
      if (l.cloudVideo) candidates.push(l.cloudVideo);
    }
    if (candidates.length) {
      var v = document.createElement('video');
      v.controls = true;
      v.playsInline = true;
      v.preload = 'metadata';
      var cIdx = 0;
      v.src = candidates[cIdx];
      if (l.subtitles) {
        var tr = document.createElement('track');
        tr.kind = 'subtitles';
        tr.label = 'English';
        tr.srclang = 'en';
        tr.src = l.subtitles;
        if (S.cc) tr.default = true;
        v.appendChild(tr);
      }
      v.addEventListener('loadedmetadata', function () {
        if (v.textTracks && v.textTracks[0]) {
          v.textTracks[0].mode = S.cc ? 'showing' : 'hidden';
        }
      });
      var fellBack = false;
      v.addEventListener('error', function () {
        cIdx++;
        if (cIdx < candidates.length) {
          v.src = candidates[cIdx];
          v.load();
          return;
        }
        if (fellBack) return;
        fellBack = true;
        mountYouTube(hostId, onReady);
      });
      host.innerHTML = '';
      host.appendChild(v);
      player = createHtml5Adapter(v, onReady);
      return;
    }
    mountYouTube(hostId, onReady);
  }

  function mountYouTube(hostId, onReady) {
    loadYT(function (ok) {
      var host = $(hostId); if (!host) return;
      if (ok) {
        try {
          player = new window.YT.Player(hostId, {
            videoId: L().vid, width: '100%', height: '100%',
            playerVars: { rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: S.cc ? 1 : 0, cc_lang_pref: 'en', hl: 'en' },
            events: { onReady: function () { if (onReady) onReady(true); } }
          });
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
  function videoBox() { return '<div class="vbox"><div id="yt" style="width:100%;height:100%;"></div><div id="spot-layer" class="spot-layer" hidden></div></div>'; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; clearInterval(poll); poll = 0; stopMic(); }

  /* ---------- state and navigation ---------- */
  var S = {
    step: 0,
    shown: {},
    active: -1,
    revealingBet: -1,
    revealEndAt: 0,
    replayStopAt: 0,
    bets: {},
    caughtWords: {},
    activeWordHunt: null,
    scores: [0, 0, 0, 0],
    awarded: {},
    goals: [false, false, false],
    rt: null,
    cc: true,
    pick: -1,
    left: 0,
    giving: false
  };

  function go(n) { clearTimers(); A.stop(); killVideo(); S.active = -1; S.revealingBet = -1; S.replayStopAt = 0; S.step = n; paintFoot(); render(); $('tip').hidden = true; }
  function paintFoot() {
    $('steps').innerHTML = STEPS.map(function (s, i) { return '<button type="button" class="dot ' + (S.step === i ? 'on' : S.step > i ? 'done' : '') + '" data-s="' + i + '" title="' + s[1] + '">' + s[0] + '</button>'; }).join('');
    $('steps').querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { go(+b.dataset.s); }; });
    $('back').disabled = S.step <= 0 || S.step === 5;
    $('next').textContent = S.step === 3 ? 'Finish 🏁' : S.step === 4 ? 'Again ↺' : S.step === 5 ? 'Back ◀' : 'Next ▶';
  }
  $('next').onclick = function () { A.play('tap'); if (S.step === 4) { S.shown = {}; S.scores = [0, 0, 0, 0]; S.awarded = {}; S.caughtWords = {}; S.bets = {}; go(0); } else if (S.step === 5) go(0); else go(S.step + 1); };
  $('back').onclick = function () { A.play('tap'); go(Math.max(0, S.step - 1)); };
  $('setup').onclick = function () { A.play('tap'); go(5); };
  var TIPS = {
    '0': ['🔮 Predict & Movie Words (about 3 min)', '1) Read the prediction question or tap <b>💬 Different Idea</b> for free speaking.<br>2) Tap the <b>Movie Vocabulary Cards</b> on the right to hear each key word and example sentence!'],
    '1': ['🎬 Watch, Spot, Bet & Catch Words (about 20 min)', '1) <b>🔔 Word-Catcher</b>: When the target word glows gold, the first team to tap their buzzer wins +1 ⭐!<br>2) <b>🔮 Freeze-Bet</b>: All 4 teams place bets before the movie plays for 7s to reveal the winner (+2 ⭐)!<br>3) <b>🎯 Touch & Spot</b>: Pupils come to the board and tap the target object right on the paused video screen!'],
    '2': ['🧩 Visual Snapshot Retell (about 5 min)', 'Look at the real movie scene snapshots and tap the 6 story cards in chronological order! Then press 🎬 <b>Say the story</b> and award +2 ⭐.'],
    '3': ['🗣️ Speak & 🎙️ Character Voice Dubbing (about 4 min)', 'Left: Tell the story with <b>First, … Then, … Finally, …</b>.<br>Right: Pupils dub a famous movie character line using the <b>🎙️ Live Mic Meter</b>!'],
    '4': ['🏁 Finish', 'Tick the "I can" goals with the class. 🔁 watches the movie again.'],
    '5': ['⚙️ Edit', 'Press <b>📍</b> to copy the video time. Choose Quiz, 🔮 Freeze-Bet, or 🎯 Touch-Spot mode, edit options, and press <b>Save</b> or <b>📋 Copy JSON</b>.']
  };
  $('tipbtn').onclick = function () { var t = TIPS[String(S.step)] || TIPS['1']; $('tip').innerHTML = '<h4>' + t[0] + '</h4><p>' + t[1] + '</p>'; $('tip').hidden = !$('tip').hidden; };
  function head(t, pill) { return '<div class="sh"><h2>' + t + '</h2>' + (pill ? '<span class="pill">' + pill + '</span>' : '') + '</div>'; }
  function render() { [renderPredict, renderWatch, renderRetell, renderSpeak, renderEnd, renderEdit][S.step](); }

  /* ---------- 0. Predict & Pre-Watch Vocabulary Deck ---------- */
  function renderPredict() {
    var l = L(), p = l.predict, vocab = l.vocab || [];
    stage.innerHTML = head('🔮 Predict & Movie Words • ' + esc(l.title), 'think & learn key words before we watch') +
      '<div class="pred-wrap">' +
        '<div class="pred-col">' +
          '<h3>🔮 1. Before Watching: What Do You Think?</h3>' +
          '<div class="lyr2"><div class="ln2"><div class="em">🎬</div><div class="tx">' + esc(p.q) + '</div><button type="button" class="btn small cyan" id="pred-read" title="Read Question">🔊</button></div></div>' +
          '<div class="qopts" id="po">' +
            p.opts.map(function (o, i) { return '<button type="button" class="btn qo" data-o="' + i + '"><b>' + o[0] + '</b><span>' + esc(o[1]) + '</span></button>'; }).join('') +
            '<button type="button" class="btn qo" id="pred-free" style="--bg:#312e81;--lip:#1e1b4b"><b>💬</b><span>Different Idea! (Free Speaking)</span></button>' +
          '</div>' +
          '<div class="free-speak-box" id="free-box" hidden>' +
            '<div>🎤 <b>Say your own prediction:</b> "' + esc(p.freeFrame || 'I think ___ will ___ because ___.') + '"</div>' +
            '<div class="award">' +
              '<span class="lab">Award +1 ⭐ for speaking:</span>' +
              D.teams.map(function (t, ti) { return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-pt="' + ti + '">' + t.e + ' +1</button>'; }).join('') +
            '</div>' +
          '</div>' +
          '<div class="qfb" id="pfb">Say: <b>I think…</b></div>' +
        '</div>' +
        '<div class="pred-col">' +
          '<h3>📚 2. Key Movie Words (Tap to Hear!)</h3>' +
          '<div class="vocab-grid">' +
            vocab.map(function (v, vi) {
              return '<button type="button" class="btn vocab-card" data-vi="' + vi + '">' +
                '<div class="vw-top"><span>' + v.emoji + ' ' + esc(v.word) + '</span><small>🔊</small></div>' +
                '<div class="vw-def">' + esc(v.def) + '</div>' +
                '<div class="vw-ex">"' + esc(v.ex) + '"</div>' +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';

    if ($('pred-read')) $('pred-read').onclick = function () { speakText(p.q); };
    stage.querySelectorAll('#po .qo[data-o]').forEach(function (b) {
      b.onclick = function () {
        A.play('star1');
        stage.querySelectorAll('#po .qo').forEach(function (x) { x.classList.remove('right'); });
        b.classList.add('right');
        $('pfb').innerHTML = '🎯 ' + esc(p.note);
        if ($('free-box')) $('free-box').hidden = false;
      };
    });
    if ($('pred-free')) {
      $('pred-free').onclick = function () {
        A.play('star2');
        stage.querySelectorAll('#po .qo').forEach(function (x) { x.classList.remove('right'); });
        $('pred-free').classList.add('right');
        if ($('free-box')) $('free-box').hidden = false;
        speakText(p.freeFrame || 'I think');
      };
    }
    stage.querySelectorAll('[data-pt]').forEach(function (b) {
      b.onclick = function () {
        var ti = +b.dataset.pt;
        S.scores[ti]++;
        A.play('star3');
        burst(1);
        $('pfb').innerHTML = '⭐ +1 Star for ' + D.teams[ti].e + ' ' + esc(D.teams[ti].n) + '\'s prediction!';
      };
    });
    stage.querySelectorAll('[data-vi]').forEach(function (b) {
      b.onclick = function () {
        var v = vocab[+b.dataset.vi];
        if (!v) return;
        A.play('tap');
        speakText(v.word + '. ' + v.ex);
      };
    });
  }

  /* ---------- 1. Watch, Touch-Spot, Freeze-Bet & Live Word-Catcher ---------- */
  function hideSpotOverlay() {
    var sl = $('spot-layer');
    if (sl) { sl.hidden = true; sl.innerHTML = ''; }
  }

  function renderWatch() {
    S.active = -1;
    S.revealingBet = -1;
    S.replayStopAt = 0;
    var c = cps();
    stage.innerHTML = head('🎬 ' + esc(L().title), 'watch • spot on screen • freeze-bet • catch live words!') +
      '<div class="two"><div class="left">' + videoBox() +
      '<div class="chips">' +
        '<button type="button" class="btn small cyan" id="rep" title="Watch the last 12 seconds again">🔁 -12s</button>' +
        '<button type="button" class="btn small amber" id="nxt-q" title="Jump straight to the next unanswered stop">⏭ Next Stop</button>' +
        '<button type="button" class="btn small ghost" id="vsl">🐢 Slow</button>' +
        '<button type="button" class="btn small ghost" id="vno">🐇 Normal</button>' +
        '<button type="button" class="btn small ' + (S.cc ? 'cyan' : 'ghost') + '" id="cc">💬 Subtitles</button>' +
      '</div>' +
      '<div class="cp-jump-bar" id="cpbar">' + c.map(function (x, i) {
        var icon = x.kind === 'bet' ? '🔮' : x.kind === 'spot' ? '🎯' : 'Q';
        return '<button type="button" class="btn small cp-jump-btn" data-j="' + i + '" title="Jump to Stop ' + (i + 1) + ' (' + fmt(x.t) + ')">' + icon + (i + 1) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="right"><div class="teams small" id="tms"></div><div class="wc-bar" id="wcbar"></div><div class="qpanel" id="qp"></div></div></div>';
    mountVideo('yt'); paintTeams(); paintWordCatcher(0); paintIdle(); wireJumpBar();
    $('rep').onclick = function () {
      A.play('tap');
      hideSpotOverlay();
      var c = cps(), i = S.active >= 0 ? S.active : lastShown();
      var cur = vid('getCurrentTime');
      var t = typeof cur === 'number' && cur > 12 ? cur - 12 : (i >= 0 ? Math.max(0, c[i].t - 12) : 0);
      S.active = -1; S.revealingBet = -1; S.replayStopAt = 0;
      paintIdle(); vid('seekTo', t, true); vid('playVideo');
    };
    $('nxt-q').onclick = function () {
      var c = cps(), n = nextIdx();
      if (n < 0) n = 0;
      var btn = $('cpbar') && $('cpbar').querySelector('[data-j="' + n + '"]');
      if (btn) btn.click();
    };
    $('vsl').onclick = function () { A.play('tap'); vid('setPlaybackRate', 0.8); };
    $('vno').onclick = function () { A.play('tap'); vid('setPlaybackRate', 1); };
    $('cc').onclick = function () {
      S.cc = !S.cc;
      if (player && player._v && player._v.textTracks && player._v.textTracks[0]) {
        player._v.textTracks[0].mode = S.cc ? 'showing' : 'hidden';
        $('cc').className = 'btn small ' + (S.cc ? 'cyan' : 'ghost');
      } else {
        clearTimers(); killVideo(); renderWatch();
      }
    };
    poll = setInterval(tick, 200);
  }

  /* ---------- Live Word-Catcher Buzzer ---------- */
  function getWordHuntForTime(t) {
    var list = L().wordHunt || [];
    if (!list.length) return null;
    for (var i = 0; i < list.length; i++) {
      var w = list[i];
      if (!S.caughtWords[w.id] && t >= w.tStart && t <= w.tEnd) return { item: w, hot: true };
    }
    for (var j = 0; j < list.length; j++) {
      if (!S.caughtWords[list[j].id] && list[j].tStart > t) return { item: list[j], hot: false };
    }
    for (var k = 0; k < list.length; k++) {
      if (!S.caughtWords[list[k].id]) return { item: list[k], hot: false };
    }
    return { item: list[list.length - 1], hot: false, allDone: true };
  }

  function paintWordCatcher(curT) {
    var host = $('wcbar');
    if (!host) return;
    var wh = getWordHuntForTime(typeof curT === 'number' ? curT : 0);
    if (!wh || !wh.item) { host.hidden = true; return; }
    host.hidden = false;
    var w = wh.item;
    var key = w.id + '|' + (wh.hot ? '1' : '0') + '|' + (wh.allDone ? 'done' : 'open');
    if (host.dataset.stateKey === key) return;
    host.dataset.stateKey = key;
    S.activeWordHunt = wh;

    if (wh.allDone) {
      host.className = 'wc-bar done';
      host.innerHTML = '<div class="wc-top"><span>🏆 <b>All Movie Words Caught!</b> Great listening & watching!</span></div>';
      return;
    }

    host.className = 'wc-bar ' + (wh.hot ? 'hot' : 'armed');
    host.innerHTML =
      '<div class="wc-top">' +
        '<span class="wc-badge">' + (wh.hot ? '🔔 CATCH IT NOW!' : '👂 Listen & Watch For:') + '</span>' +
        '<span class="wc-word">' + w.emoji + ' <b>' + esc(w.word.toUpperCase()) + '</b></span>' +
        '<button type="button" class="btn small ghost wc-hear" id="wc-say" title="Hear target word">🔊</button>' +
      '</div>' +
      '<div class="wc-buzzers">' +
        D.teams.map(function (t, ti) {
          return '<button type="button" class="btn small wc-buzz" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.45)" data-wct="' + ti + '" title="Team ' + esc(t.n) + ' caught the word! (Hotkey: ' + (t.key || '') + ')">🔔 ' + t.e + ' ' + esc(t.n) + '</button>';
        }).join('') +
      '</div>';

    if ($('wc-say')) {
      $('wc-say').onclick = function () { speakText(w.word); };
    }
    host.querySelectorAll('[data-wct]').forEach(function (b) {
      b.onclick = function () {
        var ti = +b.dataset.wct;
        catchWordForTeam(w, ti);
      };
    });
  }

  function catchWordForTeam(w, ti) {
    if (!w || S.caughtWords[w.id]) return;
    S.caughtWords[w.id] = true;
    S.scores[ti]++;
    A.play('star3');
    burst(2);
    paintTeams();
    var host = $('wcbar');
    if (host) {
      host.dataset.stateKey = 'caught-' + w.id;
      host.className = 'wc-bar caught';
      host.innerHTML = '<div class="wc-top"><span>🎉 <b>' + D.teams[ti].e + ' ' + esc(D.teams[ti].n) + '</b> caught <b>"' + w.emoji + ' ' + esc(w.word) + '"</b>! (+1 ⭐) — <em>' + esc(w.phrase) + '</em></span></div>';
    }
    setTimeout(function () {
      var cur = vid('getCurrentTime');
      if ($('wcbar')) $('wcbar').dataset.stateKey = '';
      paintWordCatcher(typeof cur === 'number' ? cur : 0);
    }, 2600);
  }

  function wireJumpBar() {
    var bar = $('cpbar'); if (!bar) return;
    bar.querySelectorAll('[data-j]').forEach(function (b) {
      b.onclick = function () {
        var idx = +b.dataset.j, c = cps();
        if (!c[idx]) return;
        A.play('tap');
        for (var k = 0; k < idx; k++) S.shown[k] = true;
        delete S.shown[idx];
        delete S.awarded['r' + idx];
        delete S.awarded['t' + idx];
        S.revealingBet = -1;
        S.replayStopAt = 0;
        vid('seekTo', Math.max(0, c[idx].t - 1), true);
        ask(idx);
      };
    });
    paintJumpBar();
  }

  function paintJumpBar() {
    var bar = $('cpbar'); if (!bar) return;
    var n = nextIdx();
    bar.querySelectorAll('[data-j]').forEach(function (b) {
      var i = +b.dataset.j;
      b.className = 'btn small cp-jump-btn ' + (S.active === i || S.revealingBet === i ? 'now' : S.shown[i] ? 'done' : i === n ? 'now' : '');
    });
  }

  function lastShown() { var c = cps(), k = -1; c.forEach(function (x, i) { if (S.shown[i]) k = i; }); return k; }
  function nextIdx() { var c = cps(); for (var i = 0; i < c.length; i++) if (!S.shown[i]) return i; return -1; }
  function paintTeams() {
    var el = $('tms'); if (!el) return;
    el.innerHTML = D.teams.map(function (t, i) { return '<div class="tm" style="--c:' + t.c + '">' + t.e + ' <b>' + S.scores[i] + ' ⭐</b></div>'; }).join('');
  }
  function paintIdle() {
    hideSpotOverlay();
    var qp = $('qp'); if (!qp) return; var c = cps(), n = nextIdx();
    var nextLabel = n >= 0 ? ((c[n].kind === 'bet' ? '🔮 Freeze-Bet ' : c[n].kind === 'spot' ? '🎯 Touch-Spot ' : 'Question ') + (n + 1) + ' (' + fmt(c[n].t) + ')') : '';
    qp.innerHTML = '<div class="qidle"><span class="big">🍿</span>' + (n < 0 ? '<b>All ' + c.length + ' stops answered!</b><br>Keep watching or press <b>Next ▶</b> for the Visual Snapshot Retell game.' : 'Watch the movie.<br>It will pause automatically at <b>' + nextLabel + '</b>.<br><small style="color:#94a3b8">Tip: Listen for the 🔔 Word-Catcher target word above, or click any Q/🔮/🎯 button below the video!</small>') + '</div>' +
      '<div class="dots">' + c.map(function (x, i) { return '<i data-d="' + i + '" title="Stop ' + (i + 1) + '" class="' + (S.shown[i] ? 'done' : i === n ? 'now' : '') + '"></i>'; }).join('') + '</div>';
    qp.querySelectorAll('[data-d]').forEach(function (d) {
      d.onclick = function () {
        var idx = +d.dataset.d;
        var btn = $('cpbar') && $('cpbar').querySelector('[data-j="' + idx + '"]');
        if (btn) btn.click();
      };
    });
    paintJumpBar();
  }

  function tick() {
    if (S.step !== 1 || !player || !player.getCurrentTime) return;
    var t = vid('getCurrentTime');
    if (typeof t !== 'number') return;

    captureLiveFrameIfNear(t);
    paintWordCatcher(t);

    // Check if we are replaying a scene up to a stop
    if (S.replayStopAt > 0 && t >= S.replayStopAt) {
      var repIdx = S.active;
      S.replayStopAt = 0;
      if (repIdx >= 0) ask(repIdx);
      return;
    }

    // Check if we are currently playing the reveal window of a Freeze-Bet!
    if (S.revealingBet >= 0) {
      var rem = Math.max(0, Math.ceil(S.revealEndAt - t));
      var cdEl = $('bet-cd');
      if (cdEl) cdEl.textContent = rem + 's';
      if (t >= S.revealEndAt) {
        var rIdx = S.revealingBet;
        S.revealingBet = -1;
        finishBetReveal(rIdx);
      }
      return;
    }

    if (S.active >= 0) return;
    var c = cps(), n = nextIdx();
    while (n >= 0 && t > c[n].t + 12) { S.shown[n] = true; n = nextIdx(); }
    if (n >= 0 && t >= c[n].t && vid('getPlayerState') === 1) ask(n);
  }

  function replaySceneForStop(i) {
    var c = cps()[i];
    if (!c) return;
    A.play('tap');
    hideSpotOverlay();
    var startT = Math.max(0, c.t - 10);
    S.replayStopAt = c.t;
    vid('seekTo', startT, true);
    vid('playVideo');
  }

  /* ---------- Ask Question, Touch-Spot, OR Freeze-Bet ---------- */
  function ask(i, forceKind) {
    if (document.fullscreenElement && document.exitFullscreen) {
      try { document.exitFullscreen(); } catch (e) {}
    }
    S.shown[i] = true; S.active = i; S.revealingBet = -1; S.replayStopAt = 0;
    vid('pauseVideo'); A.play('spot');
    var c = cps()[i], qp = $('qp'); if (!qp || !c) return;
    var mode = forceKind || c.kind || 'quiz';
    if (mode === 'bet') {
      hideSpotOverlay();
      renderFreezeBet(i, c);
      paintJumpBar();
      return;
    }
    if (mode === 'spot') {
      renderTouchSpotOverlay(i, c);
    } else {
      hideSpotOverlay();
    }
    qp.innerHTML =
      '<div class="qn-row">' +
        '<span class="qn ' + (mode === 'spot' ? 'spot-badge' : '') + '">' + (mode === 'spot' ? '🎯 TOUCH & SPOT ON SCREEN • ' : 'Question ' + (i + 1) + ' of ' + cps().length + ' • ') + fmt(c.t) + '</span>' +
        '<div style="display:flex;gap:0.4vh">' +
          '<button type="button" class="btn small ghost mode-switch-btn" id="to-spot" title="Touch & Spot on video screen">🎯 Spot</button>' +
          '<button type="button" class="btn small ghost mode-switch-btn" id="to-bet" title="Switch to 4-Team Freeze-Bet">🔮 Freeze-Bet</button>' +
        '</div>' +
      '</div>' +
      '<div class="qq">' + esc(c.q) + '</div>' +
      '<div class="q-tools">' +
        '<button type="button" class="btn small cyan" id="q-read">🔊 Read Question</button>' +
        '<button type="button" class="btn small ghost" id="q-rep">⏪ Replay Scene (-10s)</button>' +
        '<button type="button" class="btn small amber" id="q-hint">💡 Hint</button>' +
      '</div>' +
      '<div class="qopts">' + c.opts.map(function (o, k) { return '<button type="button" class="btn qo" data-o="' + k + '"><b>' + o[0] + '</b><span>' + esc(o[1]) + '</span></button>'; }).join('') + '</div>' +
      '<div class="qfb" id="qfb">' + (mode === 'spot' ? '👆 Tap the target directly on the paused video frame (or choose below)!' : '') + '</div><div class="award" id="aw"></div>' +
      '<div class="chips"><button type="button" class="btn green" id="go" hidden>▶ Keep watching</button><button type="button" class="btn small ghost" id="sk">⏭ Skip</button></div>';

    qp.querySelectorAll('.qo').forEach(function (b) { b.onclick = function () { choose(i, +b.dataset.o, b); }; });
    if ($('q-read')) $('q-read').onclick = function () { speakText(c.q); };
    if ($('q-rep')) $('q-rep').onclick = function () { replaySceneForStop(i); };
    if ($('q-hint')) $('q-hint').onclick = function () { A.play('tap'); if ($('qfb')) $('qfb').innerHTML = '💡 ' + esc(c.hint || 'Look closely at the scene!'); };
    if ($('to-bet')) $('to-bet').onclick = function () { A.play('tap'); ask(i, 'bet'); };
    if ($('to-spot')) $('to-spot').onclick = function () { A.play('tap'); ask(i, mode === 'spot' ? 'quiz' : 'spot'); };
    $('go').onclick = resume; $('sk').onclick = resume;
    paintJumpBar();
  }

  /* ---------- Mechanic: Direct Touch & Spot on the Paused Video Frame ---------- */
  function renderTouchSpotOverlay(i, c) {
    var sl = $('spot-layer');
    if (!sl) return;
    var winOpt = c.opts[c.a] || ['🎯', 'Target'];
    var zones = (c.spotZones && c.spotZones.length) ? c.spotZones : [
      { label: winOpt[0] + ' ' + winOpt[1], x: 50, y: 45, r: 22, ok: true },
      { label: (c.opts[(c.a + 1) % c.opts.length] || ['❓', 'Other'])[0], x: 22, y: 72, r: 16, ok: false }
    ];
    var promptText = c.spotPrompt || ('👆 Tap on the screen: ' + winOpt[0] + ' ' + winOpt[1] + '!');
    sl.hidden = false;
    sl.innerHTML =
      '<div class="spot-banner">' + esc(promptText) + '</div>' +
      zones.map(function (z, zi) {
        var size = (z.r || 20) * 2;
        return '<button type="button" class="spot-zone" data-sz="' + zi + '" style="left:' + z.x + '%;top:' + z.y + '%;width:' + size + '%;height:' + (size * 1.35) + '%">' +
          '<span>🎯 Tap!</span>' +
        '</button>';
      }).join('');

    sl.querySelectorAll('[data-sz]').forEach(function (btn) {
      btn.onclick = function (ev) {
        ev.stopPropagation();
        var z = zones[+btn.dataset.sz];
        if (!z) return;
        if (z.ok) {
          btn.classList.add('hit');
          btn.innerHTML = '<span>✅ ' + esc(z.label) + '</span>';
          var rightBtn = $('qp') && $('qp').querySelectorAll('.qo')[c.a];
          if (rightBtn) choose(i, c.a, rightBtn);
          setTimeout(hideSpotOverlay, 1100);
        } else {
          A.play('soft');
          btn.classList.add('miss');
          setTimeout(function () { btn.classList.remove('miss'); }, 450);
          if ($('qfb')) $('qfb').innerHTML = '💡 ' + esc(c.hint || 'Try tapping another spot on the video!');
        }
      };
    });
  }

  /* ---------- Mechanic: 4-Team Freeze-Bet ("What Happens Next?") ---------- */
  function renderFreezeBet(i, c) {
    var qp = $('qp'); if (!qp) return;
    S.bets[i] = S.bets[i] || [null, null, null, null];
    var bets = S.bets[i];
    qp.innerHTML =
      '<div class="qn-row">' +
        '<span class="qn bet-badge">🔮 WHAT HAPPENS NEXT? • FREEZE-BET (' + fmt(c.t) + ')</span>' +
        '<button type="button" class="btn small ghost mode-switch-btn" id="to-quiz">❓ Standard Quiz</button>' +
      '</div>' +
      '<div class="qq">' + esc(c.q) + '</div>' +
      '<div class="q-tools">' +
        '<button type="button" class="btn small cyan" id="q-read">🔊 Read</button>' +
        '<button type="button" class="btn small ghost" id="q-rep">⏪ Replay (-10s)</button>' +
        '<button type="button" class="btn small amber" id="q-hint">💡 Hint</button>' +
      '</div>' +
      '<div class="qopts bet-opts">' +
        c.opts.map(function (o, k) {
          var badges = D.teams.map(function (tm, ti) {
            return bets[ti] === k ? '<span class="bet-tm-pill" style="background:' + tm.c + '">' + tm.e + '</span>' : '';
          }).join('');
          return '<div class="qo bet-opt" data-bo="' + k + '"><b>' + (k + 1) + '. ' + o[0] + '</b><span>' + esc(o[1]) + '</span><div class="bet-picks">' + badges + '</div></div>';
        }).join('') +
      '</div>' +
      '<div class="bet-grid">' +
        '<div class="bet-grid-title">🎯 Lock In Each Team\'s Prediction (Wins <b>+2 ⭐</b>!):</div>' +
        D.teams.map(function (tm, ti) {
          return '<div class="bet-team-row" style="--c:' + tm.c + '">' +
            '<span class="bet-tm-name">' + tm.e + ' ' + esc(tm.n) + '</span>' +
            '<div class="bet-tm-btns">' +
              c.opts.map(function (o, k) {
                var on = bets[ti] === k;
                return '<button type="button" class="btn small bet-choice ' + (on ? 'on' : '') + '" style="' + (on ? '--bg:' + tm.c + ';--lip:rgba(0,0,0,.45)' : '') + '" data-bti="' + ti + '" data-bok="' + k + '">' + o[0] + ' #' + (k + 1) + '</button>';
              }).join('') +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="qfb" id="qfb"></div>' +
      '<div class="chips">' +
        '<button type="button" class="btn amber big" id="bet-reveal">🎬 Play ' + (c.revealSec || 7) + 's & Reveal Winner! (+2 ⭐)</button>' +
        '<button type="button" class="btn small ghost" id="sk">⏭ Skip</button>' +
      '</div>';

    if ($('to-quiz')) $('to-quiz').onclick = function () { A.play('tap'); ask(i, 'quiz'); };
    if ($('q-read')) $('q-read').onclick = function () { speakText(c.q); };
    if ($('q-rep')) $('q-rep').onclick = function () { replaySceneForStop(i); };
    if ($('q-hint')) $('q-hint').onclick = function () { A.play('tap'); if ($('qfb')) $('qfb').innerHTML = '💡 ' + esc(c.hint || 'Watch carefully!'); };
    qp.querySelectorAll('[data-bti]').forEach(function (b) {
      b.onclick = function () {
        var ti = +b.dataset.bti, k = +b.dataset.bok;
        S.bets[i][ti] = (S.bets[i][ti] === k) ? null : k;
        A.play('tap');
        renderFreezeBet(i, c);
      };
    });
    $('bet-reveal').onclick = function () {
      startBetReveal(i, c);
    };
    $('sk').onclick = resume;
  }

  function startBetReveal(i, c) {
    A.play('star1');
    var dur = c.revealSec || 7;
    var cur = vid('getCurrentTime');
    var startT = typeof cur === 'number' ? cur : c.t;
    S.revealingBet = i;
    S.revealEndAt = startT + dur;
    var qp = $('qp');
    if (qp) {
      qp.innerHTML =
        '<div class="qidle bet-watching">' +
          '<span class="big">👀</span>' +
          '<b>Watch closely! What happens next?!</b><br>' +
          'Revealing the answer in <b id="bet-cd" style="color:#fde047;font-size:1.4em">' + dur + 's</b>…<br>' +
          '<button type="button" class="btn small amber" id="bet-now" style="margin-top:1.2vh">⚡ Reveal Answer Now</button>' +
        '</div>';
      if ($('bet-now')) {
        $('bet-now').onclick = function () {
          S.revealingBet = -1;
          finishBetReveal(i);
        };
      }
    }
    vid('playVideo');
  }

  function finishBetReveal(i) {
    vid('pauseVideo');
    var c = cps()[i], qp = $('qp');
    if (!qp || !c) return;
    var bets = S.bets[i] || [null, null, null, null];
    var winners = [];
    if (!S.awarded['bet' + i]) {
      S.awarded['bet' + i] = true;
      bets.forEach(function (pick, ti) {
        if (pick === c.a) {
          S.scores[ti] += 2;
          winners.push(D.teams[ti].e + ' ' + D.teams[ti].n);
        }
      });
      paintTeams();
    }
    if (winners.length) {
      A.play('fanfare');
      burst(3);
    } else {
      A.play('star2');
      burst(1);
    }
    var winOpt = c.opts[c.a] || ['', ''];
    qp.innerHTML =
      '<div class="qn bet-badge">🎉 FREEZE-BET REVEALED!</div>' +
      '<div class="qq">' + esc(c.q) + '</div>' +
      '<div class="qo right" style="margin:0.6vh 0"><b>' + winOpt[0] + '</b><span>' + esc(winOpt[1]) + '</span></div>' +
      '<div class="qfb ok">' +
        '<div class="say2">✅ <span id="sy">' + esc(c.say) + '</span><button type="button" class="btn small cyan" id="sayb">🔊 Say it</button></div>' +
      '</div>' +
      '<div class="award">' +
        (winners.length
          ? '<span class="lab" style="color:#fde047;font-size:1.05em">🏆 <b>+2 ⭐ Double Points</b> for: ' + winners.join(', ') + '!</span>'
          : '<span class="lab">😮 Surprise twist! Tap a team to award +1 ⭐:</span>' +
            D.teams.map(function (t, ti) { return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-t="' + ti + '">' + t.e + ' +1</button>'; }).join('')) +
      '</div>' +
      '<div class="chips"><button type="button" class="btn green big" id="go">▶ Keep watching</button></div>';

    if ($('sayb')) $('sayb').onclick = function () { speakText(c.say); };
    qp.querySelectorAll('[data-t]').forEach(function (b) {
      b.onclick = function () {
        if (S.awarded['t' + i]) return;
        S.awarded['t' + i] = true;
        S.scores[+b.dataset.t]++;
        A.play('star3');
        burst(1);
        paintTeams();
        b.parentNode.innerHTML = '<span class="lab">⭐ Point for ' + D.teams[+b.dataset.t].e + ' ' + D.teams[+b.dataset.t].n + '!</span>';
      };
    });
    $('go').onclick = resume;
    paintJumpBar();
  }

  function choose(i, k, btn) {
    var c = cps()[i], fb = $('qfb'); if (!fb || S.awarded['r' + i]) return;
    if (k === c.a) {
      hideSpotOverlay();
      S.awarded['r' + i] = true; A.play('star2'); btn.classList.add('right'); $('qp').querySelectorAll('.qo').forEach(function (x) { if (x !== btn) x.classList.add('dim'); });
      fb.className = 'qfb ok'; fb.innerHTML = '<div class="say2">✅ <span id="sy">' + esc(c.say) + '</span><button type="button" class="btn small cyan" id="sayb">🔊 Say it</button></div>';
      $('sayb').onclick = function () { speakText(c.say); };
      $('aw').innerHTML = '<span class="lab">Point for:</span>' + D.teams.map(function (t, ti) { return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-t="' + ti + '">' + t.e + ' +1</button>'; }).join('');
      $('aw').querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { if (S.awarded['t' + i]) return; S.awarded['t' + i] = true; S.scores[+b.dataset.t]++; A.play('star3'); burst(1); paintTeams(); $('aw').innerHTML = '<span class="lab">⭐ Point for ' + D.teams[+b.dataset.t].e + ' ' + D.teams[+b.dataset.t].n + '!</span>'; }; });
      $('go').hidden = false; $('sk').hidden = true;
    } else {
      A.play('soft'); btn.classList.add('wrong'); setTimeout(function () { btn.classList.remove('wrong'); }, 500);
      fb.className = 'qfb'; fb.innerHTML = '💡 ' + esc(c.hint || 'Look again!') + ' <small>(try another one)</small>';
    }
  }
  function resume() { hideSpotOverlay(); S.active = -1; S.revealingBet = -1; S.replayStopAt = 0; paintIdle(); vid('playVideo'); A.play('tap'); }

  /* ---------- 2. Visual Scene Snapshot Story Retell ---------- */
  function snapshotThumbHtml(item, idx) {
    var l = L();
    var cached = frameCache[l.id] && frameCache[l.id][idx];
    var bg = item.bg || 'linear-gradient(135deg,#1e3a8a,#0f172a)';
    var label = item.sceneTitle || ('Scene ' + (idx + 1));
    return '<div class="rt-snap" style="background:' + bg + '">' +
      (cached ? '<img id="rt-snap-' + idx + '" src="' + cached + '" alt="">' : '<img id="rt-snap-' + idx + '" src="" alt="" style="display:none"><span class="rt-snap-emoji">' + item.e + '</span>') +
      '<span class="rt-snap-tag">🎞️ ' + esc(label) + '</span>' +
    '</div>';
  }

  function renderRetell() {
    var l = L(), r = l.retell;
    extractRetellSnapshots(l);
    S.rt = { pool: shuffled(r.map(function (x, i) { return i; })), next: 0 };
    var lead = ['First,', 'Then,', 'Next,', 'Then,', 'After that,', 'Finally,'];
    stage.innerHTML = head('🧩 Visual Scene Snapshot Retell', 'tap the movie scenes in chronological order!') +
      '<div class="rt"><div class="rcards" id="rcs">' + S.rt.pool.map(function (i) {
        return '<button type="button" class="btn rc rc-photo" data-i="' + i + '">' +
          snapshotThumbHtml(r[i], i) +
          '<div class="rc-caption"><b>' + r[i].e + '</b><span>' + esc(r[i].s) + '</span></div>' +
        '</button>';
      }).join('') + '</div>' +
      '<div class="slots" id="sls">' + r.map(function (x, i) {
        return '<div class="slot" id="sl' + i + '"><span class="n">' + (lead[i] || (i + 1) + '.') + '</span><div class="v"></div></div>';
      }).join('') +
        '<div class="chips">' +
          '<button type="button" class="btn small ghost" id="rt-grab" title="Re-capture movie scene thumbnails">📸 Capture Scene Photos</button>' +
          '<button type="button" class="btn cyan" id="say" hidden>🎬 Say the story</button>' +
        '</div>' +
        '<div class="award" id="rt-aw" hidden>' +
          '<span class="lab">Award +2 ⭐ for retelling:</span>' +
          D.teams.map(function (t, ti) { return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-rtt="' + ti + '">' + t.e + ' +2 ⭐</button>'; }).join('') +
        '</div>' +
      '</div></div>';

    if ($('rt-grab')) {
      $('rt-grab').onclick = function () {
        A.play('tap');
        delete frameCache[l.id];
        extractRetellSnapshots(l, true);
      };
    }
    stage.querySelectorAll('.rc').forEach(function (b) { b.onclick = function () {
      var i = +b.dataset.i;
      if (i === S.rt.next) {
        A.play('star2'); b.classList.add('used');
        var s = $('sl' + i); s.classList.add('fill');
        s.querySelector('.v').innerHTML = snapshotThumbHtml(r[i], i) + '<span>' + r[i].e + ' ' + esc(r[i].s) + '</span>';
        speakText(r[i].s);
        S.rt.next++;
        if (S.rt.next >= r.length) {
          A.play('fanfare'); burst(3);
          $('say').hidden = false;
          if ($('rt-aw')) $('rt-aw').hidden = false;
        }
      } else {
        A.play('soft'); b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500);
      }
    }; });
    $('say').onclick = function () { A.karaoke(r.map(function (x) { return x.s.split(/\s+/); }), function () {}, function () {}); };
    stage.querySelectorAll('[data-rtt]').forEach(function (b) {
      b.onclick = function () {
        var ti = +b.dataset.rtt;
        S.scores[ti] += 2;
        A.play('star3');
        burst(2);
        b.textContent = '✅ ' + D.teams[ti].e + ' +2!';
        b.disabled = true;
      };
    });
  }

  /* ---------- 3. Story Speaking & Character Voice Dubbing Studio ---------- */
  function renderSpeak() {
    var l = L(), r = l.retell, dubs = l.dubs || [];
    S.left = 90;
    stage.innerHTML = head('🗣️ Tell the Story & 🎙️ Character Voice Dubbing', 'speak in full sentences & dub movie characters!') +
      '<div class="speak-split">' +
        '<div class="speak-box">' +
          '<h3>🗣️ 1. Retell the Movie Story</h3>' +
          '<div class="frames"><div class="frame"><span class="lead">First,</span><span class="gap"></span></div><div class="frame"><span class="lead">Then,</span><span class="gap"></span></div><div class="frame"><span class="lead">Finally,</span><span class="gap"></span></div></div>' +
          '<div class="bank">' + r.map(function (x) { return '<span><b>' + x.e + '</b>' + esc(x.s.replace(/\.$/, '')) + '</span>'; }).join('') + '</div>' +
          '<div class="timer" id="tmr">1:30</div>' +
          '<div class="chips center"><button type="button" class="btn green" id="tgo">▶ Start 90s Timer</button></div>' +
        '</div>' +
        '<div class="speak-box">' +
          '<h3>🎙️ 2. Character Voice Dubbing Studio</h3>' +
          '<div class="mic-meter-wrap">' +
            '<span>🎙️ Voice Energy:</span>' +
            '<div class="mic-track"><div class="mic-fill" id="mic-fill"></div></div>' +
            '<span class="mic-pct" id="mic-pct">Ready</span>' +
          '</div>' +
          '<div class="dub-list">' +
            dubs.map(function (d, di) {
              return '<div class="dub-card">' +
                '<div class="dub-head"><span>' + esc(d.role) + '</span><span>' + d.emoji + '</span></div>' +
                '<div class="dub-line">"' + esc(d.line) + '"</div>' +
                '<div class="dub-starter">Frame: ' + esc(d.starter) + '</div>' +
                '<div class="chips">' +
                  '<button type="button" class="btn small cyan" data-dhear="' + di + '">🔊 Hear Line</button>' +
                  '<button type="button" class="btn small amber" data-ddub="' + di + '">🎙️ Dub Character (4s)</button>' +
                  D.teams.map(function (t, ti) {
                    return '<button type="button" class="btn small" style="--bg:' + t.c + ';--lip:rgba(0,0,0,.4)" data-dt="' + ti + '" title="Award +2 ⭐ to ' + esc(t.n) + '">' + t.e + ' +2</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';

    $('tgo').onclick = function () {
      clearInterval(poll); A.play('spot'); S.left = 90; var t = $('tmr');
      poll = setInterval(function () { S.left--; var m = Math.floor(S.left / 60), s = S.left % 60; t.textContent = m + ':' + (s < 10 ? '0' : '') + s; if (S.left <= 0) { clearInterval(poll); poll = 0; A.play('fanfare'); t.textContent = '🔔 Time!'; } }, 1000);
    };

    stage.querySelectorAll('[data-dhear]').forEach(function (b) {
      b.onclick = function () {
        var d = dubs[+b.dataset.dhear];
        if (d) speakText(d.line);
      };
    });
    stage.querySelectorAll('[data-ddub]').forEach(function (b) {
      b.onclick = function () {
        startVoiceDubSession(b);
      };
    });
    stage.querySelectorAll('[data-dt]').forEach(function (b) {
      b.onclick = function () {
        var ti = +b.dataset.dt;
        S.scores[ti] += 2;
        A.play('star3');
        burst(2);
        b.textContent = '✅ +2!';
      };
    });
  }

  function startVoiceDubSession(btn) {
    stopMic();
    A.play('spot');
    var fill = $('mic-fill'), pct = $('mic-pct');
    if (!fill || !pct) return;
    btn.disabled = true;
    var origText = btn.textContent;
    btn.textContent = '🔴 Dubbing Live…';

    var startTime = Date.now(), duration = 4000;
    function finishDub() {
      stopMic();
      fill.style.width = '100%';
      pct.textContent = '100% 🌟';
      btn.disabled = false;
      btn.textContent = origText;
      A.play('fanfare');
      burst(2);
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        activeMicStream = stream;
        var Ctx = window.AudioContext || window.webkitAudioContext;
        var ctx = new Ctx();
        var src = ctx.createMediaStreamSource(stream);
        var analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        var data = new Uint8Array(analyser.frequencyBinCount);
        var peak = 0;

        function pump() {
          if (!activeMicStream || Date.now() - startTime >= duration) {
            try { ctx.close(); } catch (e) {}
            finishDub();
            return;
          }
          analyser.getByteFrequencyData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) sum += data[i];
          var avg = Math.min(100, Math.round((sum / data.length) * 1.9));
          if (avg > peak) peak = avg;
          fill.style.width = Math.max(15, avg) + '%';
          pct.textContent = Math.max(peak, avg) + '% 🎙️';
          requestAnimationFrame(pump);
        }
        pump();
      }).catch(function () {
        runSimulatedMicMeter(fill, pct, duration, finishDub);
      });
    } else {
      runSimulatedMicMeter(fill, pct, duration, finishDub);
    }
  }

  function runSimulatedMicMeter(fill, pct, duration, onDone) {
    var start = Date.now();
    var iv = setInterval(function () {
      var elapsed = Date.now() - start;
      if (elapsed >= duration) {
        clearInterval(iv);
        onDone();
        return;
      }
      var v = Math.min(98, Math.round(35 + Math.sin(elapsed / 140) * 30 + (elapsed / duration) * 40));
      fill.style.width = v + '%';
      pct.textContent = v + '% 🎙️';
    }, 90);
    timers.push(iv);
  }

  /* ---------- 4. The End / Podium ---------- */
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
    $('again').onclick = function () { S.shown = {}; S.awarded = {}; S.caughtWords = {}; S.bets = {}; go(1); };
  }

  /* ---------- 5. Live Checkpoint Editor (+ Copy JSON) ---------- */
  function fmt(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }
  function parseT(s) { s = String(s).trim(); var m = /^(\d+):(\d{1,2})$/.exec(s); return m ? (+m[1]) * 60 + (+m[2]) : (parseFloat(s) || 0); }
  function optStr(o) { return o[0] ? o[0] + ' ' + o[1] : o[1]; }
  function parseOpt(s) { s = String(s).trim(); var m = /^(\S+)\s+(.+)$/.exec(s); return m && m[1].charCodeAt(0) > 255 ? [m[1], m[2]] : ['', s]; }
  function collectEditorRows() {
    var rows = [].slice.call(stage.querySelectorAll('.edrow')), out = [];
    rows.forEach(function (r) {
      var q = r.querySelector('.eq').value.trim(), opts = [].slice.call(r.querySelectorAll('.eo')).map(function (x) { return parseOpt(x.value); }).filter(function (o) { return o[1]; });
      if (!q || opts.length < 2) return;
      var a = +(r.querySelector('input[type=radio]:checked') || { value: 0 }).value; if (a >= opts.length) a = 0;
      var kindSel = r.querySelector('.ekind');
      out.push({ t: parseT(r.querySelector('.tm2').value), kind: kindSel ? kindSel.value : 'quiz', revealSec: 7, q: q, opts: opts, a: a, say: r.querySelector('.es').value.trim() || q, hint: r.querySelector('.eh').value.trim() });
    });
    return out;
  }
  function renderEdit() {
    var c = cps();
    stage.innerHTML = head('⚙️ Change the Questions, Freeze-Bets & Touch-Spots', 'saved in this browser') +
      '<div class="two"><div class="left">' + videoBox() + '<div class="hint">Play or pause the video where a stop should appear, then press 📍 on that row.</div>' +
      '<div class="chips">' +
        '<button type="button" class="btn green" id="esave">💾 Save</button>' +
        '<button type="button" class="btn ghost small" id="eadd">➕ Add a stop</button>' +
        '<button type="button" class="btn cyan small" id="ecopy">📋 Copy JSON</button>' +
        '<button type="button" class="btn ghost small" id="ereset">↩ Original questions</button>' +
      '</div><div class="hint" id="emsg"></div></div>' +
      '<div class="right"><div class="ed" id="ed">' + c.map(row).join('') + '</div></div></div>';
    mountVideo('yt'); wireRows();
    $('esave').onclick = function () {
      var out = collectEditorRows();
      if (!out.length) { $('emsg').textContent = 'Add at least one question with 2 answers.'; return; }
      saved[base().id] = { checkpoints: out }; persist(); A.play('star2'); $('emsg').textContent = '✅ Saved. ' + out.length + ' stops.';
    };
    $('eadd').onclick = function () { var t = vid('getCurrentTime'); $('ed').insertAdjacentHTML('beforeend', row({ t: typeof t === 'number' ? t : 0, kind: 'quiz', q: '', opts: [['', ''], ['', ''], ['', '']], a: 0, say: '', hint: '' }, 99)); wireRows(); };
    $('ecopy').onclick = function () {
      var out = collectEditorRows();
      var json = JSON.stringify(out, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(function () {
          A.play('star2');
          $('emsg').textContent = '📋 Copied ' + out.length + ' stops as JSON to clipboard!';
        });
      }
    };
    $('ereset').onclick = function () { if (!confirm('Go back to the original questions?')) return; delete saved[base().id]; persist(); renderEdit(); };
  }
  function row(c) {
    var id = 'g' + Math.random().toString(36).slice(2, 7), o = c.opts.concat([['', ''], ['', ''], ['', '']]).slice(0, 3);
    return '<div class="edrow"><input class="tm2" value="' + fmt(c.t) + '" title="Time (minutes:seconds)">' +
      '<select class="ekind" title="Stop Mode">' +
        '<option value="quiz"' + (c.kind !== 'bet' && c.kind !== 'spot' ? ' selected' : '') + '>❓ Quiz</option>' +
        '<option value="bet"' + (c.kind === 'bet' ? ' selected' : '') + '>🔮 Freeze-Bet</option>' +
        '<option value="spot"' + (c.kind === 'spot' ? ' selected' : '') + '>🎯 Touch-Spot</option>' +
      '</select>' +
      '<input class="eq" placeholder="Question" value="' + esc(c.q) + '"><button type="button" class="btn small ghost" data-x title="Remove">🗑️</button>' +
      '<div class="opts">' + o.map(function (x, k) { return '<label><input type="radio" name="' + id + '" value="' + k + '"' + (k === c.a ? ' checked' : '') + '><input class="eo" placeholder="🥣 answer ' + (k + 1) + '" value="' + esc(optStr(x)) + '"></label>'; }).join('') + '</div>' +
      '<input class="es" placeholder="Sentence to say after the right answer" value="' + esc(c.say) + '" style="grid-column:1/-1"><input class="eh" placeholder="Hint for a wrong answer" value="' + esc(c.hint || '') + '" style="grid-column:1/-1">' +
      '<button type="button" class="btn small cyan" data-p title="Use the video time" style="grid-column:1/-1">📍 Use the video time</button></div>';
  }
  function wireRows() {
    stage.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { var t = vid('getCurrentTime'); if (typeof t !== 'number') { $('emsg').textContent = 'The video player is not ready. Type the time instead.'; return; } b.parentNode.querySelector('.tm2').value = fmt(t); A.play('tap'); }; });
    stage.querySelectorAll('[data-x]').forEach(function (b) { b.onclick = function () { b.parentNode.remove(); A.play('tap'); }; });
  }

  /* ---------- keys, sound, full screen ---------- */
  document.addEventListener('keydown', function (e) {
    var tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
    if (S.step === 1) {
      var kUp = String(e.key || '').toUpperCase();
      if (S.activeWordHunt && S.activeWordHunt.item && !S.activeWordHunt.allDone) {
        D.teams.forEach(function (tm, ti) {
          if (tm.key === kUp) catchWordForTeam(S.activeWordHunt.item, ti);
        });
      }
      if (S.active >= 0) {
        if (e.key === '1' || e.key === '2' || e.key === '3') { var b = stage.querySelectorAll('.qo')[+e.key - 1]; if (b && b.click) b.click(); }
        else if (e.code === 'Space' && $('go') && !$('go').hidden) { e.preventDefault(); resume(); }
      }
    }
  });
  $('snd').onclick = function () { A.setOn(!A.isOn()); this.textContent = A.isOn() ? '🔊' : '🔇'; };
  $('fs').onclick = function () { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { /* not allowed */ } };

  paintMovieTabs();
  paintFoot();
  render();
})();
