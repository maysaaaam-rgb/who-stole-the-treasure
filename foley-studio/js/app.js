/* Foley Sound Engineer Studio — Interactive 35-Minute Smartboard Controller
   Reactive playerSession (energy 20% -> 100%, 4 teams, XP routing),
   Pointer-drag & shake Foley physics, live Canvas Oscilloscope, 4-Beat Loop Mixer, & 4 Team Games. */
(function (root) {
  'use strict';

  var D = root.FOLEY_DATA;
  var SFX = root.FoleyAudio;
  var INBOX_KEY = 'eaa_games_points_inbox';

  var playerSession = {
    sceneIdx: 0,
    activeTeam: 0,
    energy: 20,
    visited: { 0: true },
    storyIdx: 0,
    teams: D.teams.map(function (t) { return Object.assign({}, t); }),
    mixer: [null, null, null, null],
    mixerTimer: null,
    mysteryIdx: 0,
    mysteryOrder: [],
    mysteryRevealed: false,
    movieIdx: 0,
    cueIdx: 0,
    movieRunning: false,
    formulaIdx: 0,
    scriptIdx: 0,
    activeLine: 0,
    xpSent: false
  };

  var waveAnimId = null;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function propById(id) { return D.props.filter(function (p) { return p.id === id; })[0] || D.props[0]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function toast(msg, color) {
    var el = $('fs-toast');
    if (!el) return;
    el.textContent = msg;
    el.style.background = color || '#2fc58a';
    el.classList.remove('hide');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.add('hide'); }, 2200);
  }

  function boostEnergy(delta) {
    playerSession.energy = Math.min(100, Math.max(20, playerSession.energy + (delta || 5)));
    var el = $('fs-energy-val');
    if (el) el.textContent = playerSession.energy + '%';
  }

  function setSpeakLine(text) {
    var el = $('fs-spk-line');
    if (el) el.textContent = text;
  }

  function setOnAir(live, label) {
    var el = $('fs-onair');
    if (!el) return;
    el.classList.toggle('live', !!live);
    el.innerHTML = '<i></i> ' + esc(label || (live ? 'ON AIR · RECORDING' : 'STUDIO READY'));
  }

  function awardTeam(teamIdx, pts, reason) {
    var idx = teamIdx != null ? teamIdx : playerSession.activeTeam;
    var t = playerSession.teams[idx % 4];
    t.score = (Number(t.score) || 0) + (Number(pts) || 10);
    renderTeams(idx);
    boostEnergy(6);
    if (reason) toast('⭐ +' + pts + ' ' + t.name + ' — ' + reason, t.color);
  }

  function renderTeams(bumpIdx) {
    var box = $('fs-teams');
    box.innerHTML = '';
    playerSession.teams.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-tpill' + (i === playerSession.activeTeam ? ' active' : '') + (i === bumpIdx ? ' bump' : '');
      b.style.setProperty('--tc', t.color);
      b.title = 'Tap to select ' + t.name + ' · Double-tap to give +5 bonus';
      b.innerHTML = '<span class="dot"></span><span>' + esc(t.name) + '</span><b>' + t.score + '</b>';
      b.onclick = function () {
        if (playerSession.activeTeam === i) {
          t.score += 5;
          SFX.correct();
          renderTeams(i);
          toast('⭐ +5 bonus for ' + t.name + '!', t.color);
        } else {
          playerSession.activeTeam = i;
          renderTeams();
        }
      };
      box.appendChild(b);
    });
  }

  function renderStepper() {
    var nav = $('fs-stepper');
    nav.innerHTML = '';
    D.scenes.forEach(function (sc, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-step-btn' + (idx === playerSession.sceneIdx ? ' on' : '') + (sc.lightTxt ? ' light-txt' : '') + (playerSession.visited[idx] ? ' done' : '');
      b.style.setProperty('--sc', sc.color);
      b.innerHTML = '<span>' + esc(sc.title) + '</span><small>' + sc.mins + ' min</small>';
      b.onclick = function () { goScene(idx); };
      nav.appendChild(b);
    });
  }

  function stopMixer() {
    if (playerSession.mixerTimer) { clearInterval(playerSession.mixerTimer); playerSession.mixerTimer = null; }
  }
  function stopWaveLoop() {
    if (waveAnimId) { cancelAnimationFrame(waveAnimId); waveAnimId = null; }
  }

  function goScene(idx) {
    stopMixer();
    stopWaveLoop();
    playerSession.sceneIdx = Math.max(0, Math.min(D.scenes.length - 1, idx));
    playerSession.visited[playerSession.sceneIdx] = true;
    var sc = D.scenes[playerSession.sceneIdx];
    setSpeakLine(sc.formula);
    setOnAir(sc.id === 'dubbing' || sc.id === 'onair', sc.id === 'onair' ? 'ON AIR · LIVE SHOW' : (sc.id === 'dubbing' ? 'RECORDING MOVIE' : 'STUDIO READY'));
    renderStepper();
    $('fs-prev-btn').disabled = playerSession.sceneIdx === 0;
    $('fs-next-btn').textContent = playerSession.sceneIdx === D.scenes.length - 1 ? '🏆 Finish!' : 'Next Scene ▶';

    if (sc.id === 'story') renderStory();
    else if (sc.id === 'workbench') renderWorkbench();
    else if (sc.id === 'mystery') renderMystery();
    else if (sc.id === 'dubbing') renderDubbing();
    else if (sc.id === 'formula') renderFormula();
    else if (sc.id === 'onair') renderOnAir();
  }

  /* =====================================================================
     SCENE 1 · STUDIO STORY BRIEFING (5 MIN)
     ===================================================================== */
  function renderStory() {
    var card = D.story[playerSession.storyIdx] || D.story[0];
    setSpeakLine(card.say);
    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🎬 Scene 1 · Shh! The Movie Lost Its Sounds!</h2><span class="fs-badge">⏱ 5 min · Story &amp; TPR</span></div>' +
      '<div class="fs-story-grid">' +
        '<div class="fs-cinema-frame">' +
          '<img class="bg-art" src="' + esc(card.art) + '" alt="Foley Studio Scene">' +
          '<img class="fs-host-float" src="art/studio-host.webp" alt="Foley Host">' +
        '</div>' +
        '<div class="fs-story-card">' +
          '<div>' +
            '<div class="fs-story-tag">' + esc(card.tag) + '</div>' +
            '<div class="fs-story-txt" style="margin-top:8px">' + esc(card.text) + '</div>' +
          '</div>' +
          '<div class="fs-tpr-pill">' + esc(card.tpr) + '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button type="button" class="fs-btn amber sm" id="st-hear">🔊 Read Story</button>' +
            '<button type="button" class="fs-btn pink sm" id="st-clap">🎬 Clapperboard!</button>' +
            (playerSession.storyIdx > 0 ? '<button type="button" class="fs-btn ghost sm" id="st-prev">◀ Prev</button>' : '') +
            '<button type="button" class="fs-btn green" id="st-next">' + (playerSession.storyIdx < D.story.length - 1 ? 'Next Page ▶' : 'Open Sound Lab ▶') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    $('st-hear').onclick = function () { SFX.speak(card.text); };
    $('st-clap').onclick = function () { SFX.clapper(); toast('🎬 Quiet on set! Lights, camera, SOUND!', '#ff5fa2'); boostEnergy(4); };
    if ($('st-prev')) $('st-prev').onclick = function () { playerSession.storyIdx--; renderStory(); };
    $('st-next').onclick = function () {
      SFX.clapper();
      if (playerSession.storyIdx < D.story.length - 1) { playerSession.storyIdx++; boostEnergy(5); renderStory(); }
      else goScene(1);
    };
  }

  /* =====================================================================
     SCENE 2 · INTERACTIVE FOLEY SOUND LAB WORKBENCH + 4-BEAT MIXER (8 MIN)
     ===================================================================== */
  function startOscilloscope(canvas) {
    if (!canvas) return;
    var c = canvas.getContext('2d');
    var buf = new Uint8Array(128);
    function draw() {
      waveAnimId = requestAnimationFrame(draw);
      var W = canvas.width, H = canvas.height;
      c.clearRect(0, 0, W, H);
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, W, H);
      c.strokeStyle = '#e8f1ff';
      c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke();

      var an = SFX.getAnalyser();
      c.strokeStyle = '#4f9dff';
      c.lineWidth = 4;
      c.lineCap = 'round';
      c.beginPath();
      if (an) {
        an.getByteTimeDomainData(buf);
        for (var i = 0; i < buf.length; i++) {
          var x = (i / (buf.length - 1)) * W;
          var v = (buf[i] - 128) / 128;
          var y = H / 2 + v * (H * 0.44);
          if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
      } else {
        c.moveTo(0, H / 2); c.lineTo(W, H / 2);
      }
      c.stroke();
    }
    draw();
  }

  function renderWorkbench() {
    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🎛️ Scene 2 · Interactive Foley Sound Lab — Touch &amp; Create Sounds!</h2><span class="fs-badge">⏱ 8 min · Tap, Shake &amp; Drag Tools Live!</span></div>' +
      '<div class="fs-meter-row">' +
        '<div class="fs-wave-box">' +
          '<canvas id="fs-wave-canvas" width="440" height="64"></canvas>' +
        '</div>' +
        '<div class="fs-live-caption" id="wb-cap">👆 Touch, drag, or shake any Foley tool below!<small>Watch the live sound wave jump &amp; say the sentence aloud!</small></div>' +
      '</div>' +
      '<div class="fs-props-grid" id="wb-grid"></div>' +
      '<div class="fs-mixer">' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<b>🎙️ 4-Beat Movie Soundtrack Mixer:</b>' +
          '<div class="fs-mixer-slots" id="wb-slots"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button type="button" class="fs-btn green sm" id="wb-play-mix">▶ Play Mix</button>' +
          '<button type="button" class="fs-btn ghost sm" id="wb-clear-mix">🗑 Clear</button>' +
        '</div>' +
      '</div>';

    var grid = $('wb-grid');
    var slotsEl = $('wb-slots');

    function paintSlots(activeStep) {
      slotsEl.innerHTML = '';
      playerSession.mixer.forEach(function (pid, i) {
        var p = pid ? propById(pid) : null;
        var s = document.createElement('div');
        s.className = 'fs-slot' + (p ? ' filled' : '') + (activeStep === i ? ' playing' : '');
        s.textContent = p ? (p.emoji + ' ' + p.movieSound.split(' ')[0]) : ('Beat ' + (i + 1));
        slotsEl.appendChild(s);
      });
    }
    paintSlots(-1);

    function triggerProp(p, cardEl, intensity, addToMix) {
      SFX.playProp(p.id, intensity);
      cardEl.classList.add('firing');
      clearTimeout(cardEl._ft);
      cardEl._ft = setTimeout(function () { cardEl.classList.remove('firing'); }, 220);
      $('wb-cap').innerHTML = esc(p.soundWord + ' — ' + p.movieSound + '!') + '<small>' + esc(p.sentence) + '</small>';
      setSpeakLine(p.sentence);
      boostEnergy(2);
      if (addToMix) {
        var empty = playerSession.mixer.indexOf(null);
        if (empty >= 0) { playerSession.mixer[empty] = p.id; paintSlots(-1); }
      }
    }

    D.props.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'fs-prop-card';
      card.style.setProperty('--pc', p.color);
      card.innerHTML =
        '<div class="fs-prop-media">' +
          '<span class="fs-prop-gesture">' + esc(p.gesture) + '</span>' +
          '<img class="fs-prop-img" src="' + esc(p.art) + '" alt="' + esc(p.name) + '">' +
          '<div class="fs-prop-pedestal"></div>' +
        '</div>' +
        '<div class="fs-prop-tray"><b>' + esc(p.name) + '</b><small>' + esc(p.emoji + ' ' + p.movieSound) + '</small></div>';

      // Interactive Touch / Drag / Shake velocity detection!
      var dragging = false, lastX = 0, lastY = 0, accum = 0, lastFire = 0;
      card.addEventListener('pointerdown', function (e) {
        dragging = true; lastX = e.clientX; lastY = e.clientY; accum = 0;
        card.setPointerCapture(e.pointerId);
        triggerProp(p, card, 1.0, true);
        if (p.id === 'metal-sheet' || p.id === 'keys' || p.id === 'rainstick') card.classList.add('shaking');
      });
      card.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX; lastY = e.clientY;
        accum += dist;
        var now = Date.now();
        if (accum > 42 && now - lastFire > 190) {
          lastFire = now;
          var intensity = Math.min(1.38, 0.75 + accum / 110);
          accum = 0;
          triggerProp(p, card, intensity, false);
        }
      });
      function endDrag() { dragging = false; card.classList.remove('shaking'); }
      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);

      grid.appendChild(card);
    });

    $('wb-play-mix').onclick = function () {
      stopMixer();
      var filled = playerSession.mixer.filter(Boolean);
      if (!filled.length) { toast('👆 Tap 2–4 Foley tools first to record your soundtrack!', '#ffb320'); return; }
      var step = 0;
      setOnAir(true, 'PLAYING SOUNDTRACK MIX');
      function beat() {
        var pid = playerSession.mixer[step];
        paintSlots(step);
        if (pid) {
          var p = propById(pid);
          SFX.playProp(p.id, 1.05);
          $('wb-cap').innerHTML = '🎵 Beat ' + (step + 1) + ': ' + esc(p.soundWord + ' (' + p.movieSound + ')') + '<small>' + esc(p.sentence) + '</small>';
        }
        step++;
        if (step >= 4) {
          stopMixer();
          setTimeout(function () { paintSlots(-1); setOnAir(false); }, 650);
        }
      }
      beat();
      playerSession.mixerTimer = setInterval(beat, 750);
    };
    $('wb-clear-mix').onclick = function () {
      stopMixer();
      playerSession.mixer = [null, null, null, null];
      paintSlots(-1);
    };

    startOscilloscope($('fs-wave-canvas'));
  }

  /* =====================================================================
     SCENE 3 · GAME 1: MYSTERY SOUND DETECTIVES (6 MIN)
     ===================================================================== */
  function renderMystery() {
    if (!playerSession.mysteryOrder.length) playerSession.mysteryOrder = shuffle(D.props);
    var target = playerSession.mysteryOrder[playerSession.mysteryIdx % playerSession.mysteryOrder.length];
    var distractors = shuffle(D.props.filter(function (p) { return p.id !== target.id; })).slice(0, 3);
    var choices = shuffle([target].concat(distractors));
    playerSession.mysteryRevealed = false;
    setSpeakLine('Listen carefully! When you ___, it sounds like ___!');

    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🕵️ Game 1 · Mystery Sound Detectives!</h2><span class="fs-badge">Round ' + (playerSession.mysteryIdx + 1) + ' of ' + D.props.length + ' · Team ' + esc(playerSession.teams[playerSession.activeTeam].name) + '</span></div>' +
      '<div class="fs-mystery-wrap">' +
        '<div class="fs-curtain" id="ms-curtain">' +
          '<div style="font-size:4.2rem" id="ms-icon">🎭</div>' +
          '<h3 id="ms-title" style="font-family:Fredoka,sans-serif;font-size:1.55rem">Hidden Behind the Studio Curtain!</h3>' +
          '<p id="ms-sub" style="font-weight:800;opacity:0.95">Tap Play Sound, guess the tool, then SAY the full sentence!</p>' +
          '<button type="button" class="fs-btn amber lg" id="ms-play">🔊 Play Mystery Sound</button>' +
        '</div>' +
        '<div class="fs-mystery-opts" id="ms-opts"></div>' +
      '</div>';

    $('ms-play').onclick = function () {
      SFX.playProp(target.id, 1.15);
      toast('👂 Shh! Listen closely to the mystery sound!', '#4f9dff');
    };

    var optsBox = $('ms-opts');
    choices.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-mopt';
      b.innerHTML = '<img src="' + esc(c.art) + '" alt=""><div><div>' + esc(c.name) + '</div><small style="color:#5a4678">' + esc(c.emoji + ' ' + c.movieSound) + '</small></div>';
      b.onclick = function () {
        if (playerSession.mysteryRevealed) return;
        if (c.id === target.id) {
          playerSession.mysteryRevealed = true;
          b.classList.add('right');
          SFX.correct();
          setTimeout(function () { SFX.speak(target.sentence); }, 350);
          var cur = $('ms-curtain');
          cur.classList.add('revealed');
          cur.innerHTML =
            '<img class="fs-curtain-img" src="' + esc(target.art) + '" alt="' + esc(target.name) + '">' +
            '<h3 style="font-family:Fredoka,sans-serif;font-size:1.45rem">🎉 ' + esc(target.name) + ' → ' + esc(target.movieSound) + '!</h3>' +
            '<p style="font-weight:900;color:#14734d;font-size:1.05rem">' + esc(target.sentence) + '</p>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' +
              '<button type="button" class="fs-btn blue sm" id="ms-replay">🔊 Hear Again</button>' +
              '<button type="button" class="fs-btn green" id="ms-next">Next Mystery ▶</button>' +
            '</div>';
          setSpeakLine(target.sentence);
          awardTeam(playerSession.activeTeam, 10, target.movieSound + '!');
          $('ms-replay').onclick = function () { SFX.playProp(target.id, 1.1); };
          $('ms-next').onclick = function () {
            playerSession.activeTeam = (playerSession.activeTeam + 1) % 4;
            playerSession.mysteryIdx = (playerSession.mysteryIdx + 1) % playerSession.mysteryOrder.length;
            renderTeams();
            renderMystery();
          };
        } else {
          // Soft-fail: warm wobble + helpful voice clue, zero deductions!
          b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
          SFX.softFail();
          SFX.playProp(c.id, 0.85);
          toast('💡 Good try! That sounds like ' + c.movieSound + '. Listen again!', '#ffb320');
        }
      };
      optsBox.appendChild(b);
    });
  }

  /* =====================================================================
     SCENE 4 · GAME 2: LIVE MOVIE FOLEY DUBBING (7 MIN)
     ===================================================================== */
  function renderDubbing() {
    var mv = D.movies[playerSession.movieIdx % D.movies.length];
    playerSession.cueIdx = 0;
    var cuePropIds = mv.cues.map(function (c) { return c.prop; });
    var extra = shuffle(D.props.filter(function (p) { return cuePropIds.indexOf(p.id) < 0; })).slice(0, 3);
    var dockProps = shuffle(cuePropIds.map(propById).concat(extra));

    setSpeakLine(mv.cues[0].line);

    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🎥 Game 2 · Live Movie Foley Dubbing — ' + esc(mv.title) + '</h2>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          D.movies.map(function (m, i) { return '<button type="button" class="fs-btn sm ' + (i === playerSession.movieIdx ? 'pink' : 'ghost') + '" data-mv="' + i + '">Movie ' + (i + 1) + '</button>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="fs-dub-grid">' +
        '<div class="fs-movie-screen">' +
          '<img class="fs-movie-img" src="' + esc(mv.art) + '" alt="' + esc(mv.title) + '">' +
          '<div class="fs-cue-strip" id="db-cues"></div>' +
        '</div>' +
        '<div class="fs-dub-dock" id="db-dock"></div>' +
      '</div>';

    [].forEach.call(document.querySelectorAll('[data-mv]'), function (b) {
      b.onclick = function () { playerSession.movieIdx = Number(b.getAttribute('data-mv')); SFX.clapper(); renderDubbing(); };
    });

    function paintCues() {
      var box = $('db-cues');
      box.innerHTML = mv.cues.map(function (c, i) {
        var cls = i < playerSession.cueIdx ? 'done' : (i === playerSession.cueIdx ? 'now' : '');
        return '<div class="fs-cue ' + cls + '">' + esc(c.icon + ' ' + c.label) + '</div>';
      }).join('');
      if (playerSession.cueIdx < mv.cues.length) {
        setSpeakLine('LIVE CUE: ' + mv.cues[playerSession.cueIdx].line);
      }
    }
    paintCues();

    var dock = $('db-dock');
    dockProps.forEach(function (p) {
      var pad = document.createElement('button');
      pad.type = 'button';
      pad.className = 'fs-dub-pad';
      pad.innerHTML = '<img src="' + esc(p.art) + '" alt=""><span>' + esc(p.name) + '</span><small style="color:#5a4678">' + esc(p.gesture) + '</small>';
      pad.onclick = function () {
        if (playerSession.cueIdx >= mv.cues.length) return;
        SFX.playProp(p.id, 1.15);
        var curCue = mv.cues[playerSession.cueIdx];
        if (p.id === curCue.prop) {
          pad.classList.add('hit');
          setTimeout(function () { pad.classList.remove('hit'); }, 400);
          SFX.speak(curCue.line);
          playerSession.cueIdx++;
          paintCues();
          if (playerSession.cueIdx >= mv.cues.length) {
            setTimeout(function () {
              SFX.fanfare();
              awardTeam(playerSession.activeTeam, 15, 'Movie Dubbed! 🎬');
              playerSession.activeTeam = (playerSession.activeTeam + 1) % 4;
              renderTeams();
              if (playerSession.movieIdx < D.movies.length - 1) {
                toast('🎬 Bravo! Ready for Movie ' + (playerSession.movieIdx + 2) + '!', '#2fc58a');
              }
            }, 650);
          }
        } else {
          pad.classList.remove('wobble'); void pad.offsetWidth; pad.classList.add('wobble');
          SFX.softFail();
          toast('🎬 Try another tool for: ' + curCue.label, '#ffb320');
        }
      };
      dock.appendChild(pad);
    });
  }

  /* =====================================================================
     SCENE 5 · GAME 3: FOLEY FORMULA & GRAMMAR BUILDER (5 MIN)
     ===================================================================== */
  function renderFormula() {
    var f = D.formulas[playerSession.formulaIdx % D.formulas.length];
    var prop = propById(f.prop);
    var opts = shuffle([f.a].concat(f.w));
    var solved = false;
    setSpeakLine(f.q.replace(/<[^>]+>/g, f.a));

    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🧩 Game 3 · Foley Formula Builder!</h2><span class="fs-badge">Question ' + (playerSession.formulaIdx + 1) + ' of ' + D.formulas.length + ' · Team ' + esc(playerSession.teams[playerSession.activeTeam].name) + '</span></div>' +
      '<div class="fs-quiz-card">' +
        '<div style="display:flex;justify-content:center;align-items:center;gap:14px">' +
          '<img src="' + esc(prop.art) + '" alt="" style="width:104px;height:104px;object-fit:contain;filter:drop-shadow(0 8px 12px rgba(43,29,64,0.16))">' +
          '<button type="button" class="fs-btn amber sm" id="fm-sfx">🔊 Play Clue Sound</button>' +
        '</div>' +
        '<div class="fs-quiz-q" id="fm-q">' + f.q + '</div>' +
        '<div class="fs-quiz-opts" id="fm-opts"></div>' +
      '</div>';

    $('fm-sfx').onclick = function () { SFX.playProp(prop.id, 1.05); };
    var box = $('fm-opts');
    opts.forEach(function (choice) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-qopt';
      b.textContent = choice;
      b.onclick = function () {
        if (solved) return;
        if (choice === f.a) {
          solved = true;
          b.classList.add('right');
          var full = f.q.replace(/<mark>____<\/mark>/, '<mark>' + esc(f.a) + '</mark>');
          $('fm-q').innerHTML = full;
          SFX.correct();
          setTimeout(function () { SFX.speak(f.q.replace(/<[^>]+>/g, f.a)); }, 300);
          awardTeam(playerSession.activeTeam, 10, 'Perfect Formula!');
          setTimeout(function () {
            playerSession.activeTeam = (playerSession.activeTeam + 1) % 4;
            playerSession.formulaIdx = (playerSession.formulaIdx + 1) % D.formulas.length;
            renderTeams();
            renderFormula();
          }, 1850);
        } else {
          b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
          SFX.softFail();
          toast('💡 Almost! Read the sentence out loud and try again!', '#ffb320');
        }
      };
      box.appendChild(b);
    });
  }

  /* =====================================================================
     SCENE 6 · GAME 4: ON AIR! 3-SENTENCE SPEAKING SHOW & PODIUM (4 MIN)
     ===================================================================== */
  function renderOnAir() {
    var sc = D.scripts[playerSession.scriptIdx % D.scripts.length];
    var sorted = playerSession.teams.slice().sort(function (a, b) { return b.score - a.score; });

    $('fs-stage').innerHTML =
      '<div class="fs-scene-head"><h2>🎤 Scene 6 · ON AIR! Live Foley Speaking Show &amp; Trophy Podium</h2>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          D.scripts.map(function (s, i) { return '<button type="button" class="fs-btn sm ' + (i === playerSession.scriptIdx ? 'pink' : 'ghost') + '" data-sc="' + i + '">' + esc(s.title) + '</button>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="fs-show-grid">' +
        '<div class="fs-teleprompter">' +
          '<div style="font-weight:900;color:#c93373">🔴 LIVE TELEPROMPTER (3-Sentence Show — Tap each line to read &amp; fire its Foley sound!)</div>' +
          sc.lines.map(function (ln, i) {
            var p = propById(ln.prop);
            return '<div class="fs-line-step' + (i === playerSession.activeLine ? ' active' : '') + '" data-ln="' + i + '">' +
              '<span class="num">' + (i + 1) + '</span>' +
              '<span style="flex:1">' + esc(ln.text) + '</span>' +
              '<img src="' + esc(p.art) + '" alt="" style="width:54px;height:54px;object-fit:contain">' +
            '</div>';
          }).join('') +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:auto">' +
            '<button type="button" class="fs-btn green" id="oa-applause">👏 Bravo! +15 Team Points</button>' +
            '<button type="button" class="fs-btn blue" id="oa-read-all">🔊 Hear Full Drama</button>' +
          '</div>' +
        '</div>' +
        '<div class="fs-podium">' +
          '<h3 style="font-family:Fredoka,sans-serif;font-size:1.55rem">🏆 Foley Studio Podium</h3>' +
          '<div class="fs-podium-rows">' +
            sorted.map(function (t, i) {
              var med = ['🥇', '🥈', '🥉', '⭐'][i] || '⭐';
              return '<div class="fs-prow" style="--tc:' + t.color + '"><span>' + med + ' ' + esc(t.name) + '</span><span>' + t.score + ' pts</span></div>';
            }).join('') +
          '</div>' +
          '<button type="button" class="fs-btn green lg" id="oa-xp"' + (playerSession.xpSent ? ' disabled' : '') + '>' + (playerSession.xpSent ? '✅ Class XP Sent!' : '⭐ Celebrate &amp; Save Studio XP!') + '</button>' +
        '</div>' +
      '</div>';

    [].forEach.call(document.querySelectorAll('[data-sc]'), function (b) {
      b.onclick = function () { playerSession.scriptIdx = Number(b.getAttribute('data-sc')); playerSession.activeLine = 0; renderOnAir(); };
    });
    [].forEach.call(document.querySelectorAll('[data-ln]'), function (row) {
      row.onclick = function () {
        var i = Number(row.getAttribute('data-ln'));
        playerSession.activeLine = i;
        var ln = sc.lines[i];
        SFX.playProp(ln.prop, 1.15);
        setSpeakLine(ln.text);
        setTimeout(function () { SFX.speak(ln.text); }, 350);
        renderOnAir();
      };
    });
    $('oa-applause').onclick = function () {
      SFX.fanfare();
      awardTeam(playerSession.activeTeam, 15, 'Live ON AIR Performance!');
      playerSession.activeTeam = (playerSession.activeTeam + 1) % 4;
      renderOnAir();
    };
    $('oa-read-all').onclick = function () {
      SFX.speak(sc.lines.map(function (l) { return l.text; }).join(' '));
    };
    $('oa-xp').onclick = function () {
      if (playerSession.xpSent) return;
      playerSession.xpSent = true;
      boostEnergy(100);
      SFX.fanfare();
      try {
        var inbox = JSON.parse(localStorage.getItem(INBOX_KEY) || '[]') || [];
        inbox.push({
          id: 'foley_' + Date.now().toString(36),
          classId: (localStorage.getItem('eaa_games_prefs') && (JSON.parse(localStorage.getItem('eaa_games_prefs')).classId || '')) || '',
          amount: 20,
          reason: 'Foley Sound Engineer Studio Completed',
          icon: '🎬',
          ts: Date.now()
        });
        localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
      } catch (e) {}
      toast('🏆 Amazing work, Foley Sound Engineers! Studio Energy 100%!', '#2fc58a');
      renderOnAir();
    };
  }

  /* GLOBAL HEADER & FOOTER CONTROLS */
  $('fs-spk-hear').onclick = function () { SFX.speak($('fs-spk-line').textContent); };
  $('fs-prev-btn').onclick = function () { if (playerSession.sceneIdx > 0) goScene(playerSession.sceneIdx - 1); };
  $('fs-next-btn').onclick = function () {
    if (playerSession.sceneIdx < D.scenes.length - 1) goScene(playerSession.sceneIdx + 1);
    else { SFX.fanfare(); toast('🏆 35-Minute Foley Studio Lesson Complete!', '#2fc58a'); }
  };
  $('fs-mute-btn').onclick = function () {
    SFX.setMuted(!SFX.isMuted());
    this.textContent = SFX.isMuted() ? '🔇' : '🔊';
  };
  $('fs-fs-btn').onclick = function () {
    try {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    } catch (e) {}
  };
  $('fs-tip-btn').onclick = function () {
    var sc = D.scenes[playerSession.sceneIdx];
    $('fs-tip-title').textContent = '📋 Teacher Tips · ' + sc.title + ' (' + sc.mins + ' min)';
    $('fs-tip-body').innerHTML =
      '<p style="font-weight:900;margin-bottom:10px;color:#256bc4">Target Formula: ' + esc(sc.formula) + '</p>' +
      '<ul class="fs-tip-list">' + sc.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    $('fs-tip-modal').classList.remove('hide');
  };
  $('fs-tip-close').onclick = function () { $('fs-tip-modal').classList.add('hide'); };
  $('fs-tip-modal').onclick = function (e) { if (e.target === this) this.classList.add('hide'); };

  /* BOOT */
  renderTeams();
  goScene(0);
})(window);
