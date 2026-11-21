/* Time Train (games/past/) · Past Simple 3-Station Railway Journey
   Station 1: Past Gate (base -> past + was/were, golden tickets)
   Station 2: Didn't Bridge (negatives, didn't + base verb with ⏪ clock-rewind!)
   Station 3: Did Tower (questions, Did + subj + base...? with ⏪ clock-rewind + Yes/No bonus!)
   Finale: Clockwork Time Tunnel -> Ancient Egypt Podium & Class Board XP! */
(function (root) {
  'use strict';
  root.KIT_ROOT = '../../';
  var Kit = root.Kit, el = Kit.el, doc = root.document;
  var app = doc.getElementById('app');

  var ART = 'assets/games/time-train/';
  var STATIONS = [
    { num: 1, id: 'gate',   name: 'Past Gate',     short: '① Past Gate',     bg: ART + 'bg_past_gate.webp',    mood: 'sunny',   tag: '🕰️ Station 1 · Past Gate (Positive)' },
    { num: 2, id: 'bridge', name: "Didn't Bridge", short: "② Didn't Bridge", bg: ART + 'bg_didnt_bridge.webp', mood: 'mystery', tag: "🌉 Station 2 · Didn't Bridge (Negative)" },
    { num: 3, id: 'tower',  name: 'Did Tower',     short: '③ Did Tower',     bg: ART + 'bg_did_tower.webp',    mood: 'cosmic',  tag: '🗼 Station 3 · Did Tower (Questions)' }
  ];

  var S = {
    packId: Kit.param('pack') || Kit.param('set') || Kit.pref('tt_pack') || 'g3-u5-time-train',
    stationMode: Kit.pref('tt_station') || 'all', // 'all' | '1' | '2' | '3'
    perStation: Kit.pref('tt_per') || 5,
    timerSec: Kit.pref('tt_timer') == null ? 0 : +Kit.pref('tt_timer'),
    yesNoBonus: Kit.pref('tt_yn') !== false,
    classId: Kit.classroom ? Kit.classroom.defaultClassId() : '',
    teams: Kit.pref('teams') == null ? 2 : Kit.pref('teams'),
    pack: null,
    queue: [], // [{ station: 1|2|3, fm: formsObj }]
    qIdx: 0,
    worth: 10,
    carriages: 0,
    teamsData: [],
    turn: 0,
    stealAttempt: false,
    classStars: 0,
    phase: 'setup'
  };

  var ui = {}, timers = [], cdInterval = 0, popOverlayKeys = null;
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() {
    timers.forEach(clearTimeout); timers = [];
    clearInterval(cdInterval); cdInterval = 0;
    if (popOverlayKeys) { popOverlayKeys(); popOverlayKeys = null; }
  }

  function advanceTurn() {
    if (!S.teamsData.length) return;
    if (Kit.classroom && Kit.classroom.advanceSpeaker) {
      Kit.classroom.advanceSpeaker(S.teamsData[S.turn]);
    }
    S.turn = (S.turn + 1) % S.teamsData.length;
  }

  function openLiveEditor() {
    Kit.studio({ tab: 'sentences', sId: S.packId }, function (newId) {
      if (newId) { S.packId = newId; Kit.pref('tt_pack', newId); }
      if (S.phase === 'setup') {
        setup();
      } else {
        Kit.sentences.get(S.packId).then(function (fresh) {
          if (fresh && fresh.items && fresh.items.length) {
            Kit.toast('Loaded "' + fresh.name + '"!');
            start(fresh);
          }
        });
      }
    });
  }

  function mountTopbar() {
    Kit.topbar({
      home: '../index.html',
      title: '🚂 Time Train · Past Simple',
      onEdit: openLiveEditor,
      editLabel: '✎ Edit sentences',
      onResize: function () { if (S.phase !== 'setup') fit(); }
    });
  }

  function seg(list, val, fn) {
    var box = el('div', { class: 'seg' });
    list.forEach(function (o) {
      box.appendChild(el('button', {
        type: 'button',
        class: 'chip' + (String(o[0]) === String(val) ? ' on' : ''),
        text: o[1],
        onclick: function () { Kit.sound('tap'); fn(o[0]); }
      }));
    });
    return box;
  }

  /* ======================= Setup Screen ======================= */
  function setup() {
    clearTimers();
    S.phase = 'setup';
    Kit.clearKeys();
    mountTopbar();
    if (Kit.music) Kit.music.start('sunny');

    Kit.sentences.all().then(function (packs) {
      var cur = (Kit.matchPack ? Kit.matchPack(packs, S.packId) : packs.filter(function (p) { return p.id === S.packId; })[0]) || packs[0];
      S.packId = cur.id;
      app.innerHTML = '';
      app.className = 'app setup-screen';

      var hero = el('section', { class: 'hero panel' }, [
        el('div', { class: 'hero-poster' }, [
          el('img', { src: '../posters/time-train.webp', alt: 'Time Train' })
        ]),
        el('div', { class: 'hero-info' }, [
          el('h1', { text: '🚂 Time Train' }),
          el('p', { class: 'muted', text: 'Fix Past Simple sentences across 3 magical railway stations to ride back in time!' }),
          el('ol', { class: 'how' }, [
            el('li', null, [el('b', { text: '1' }), el('span', { text: 'Past Gate: pick the past verb' })]),
            el('li', null, [el('b', { text: '2' }), el('span', { text: "Didn't Bridge: ⏪ rewind to base verb" })]),
            el('li', null, [el('b', { text: '3' }), el('span', { text: 'Did Tower: build the Did…? question' })])
          ])
        ])
      ]);

      /* Left column: Sentence Packs + Station Picker */
      var leftBox = el('section', { class: 'panel' }, [el('h2', { text: '📜 Sentence Pack & Stations' })]);
      var pGrid = el('div', { class: 'pack-grid' });
      packs.forEach(function (p) {
        var thumbs = el('div', { class: 'pack-thumbs' }, p.items.slice(0, 3).map(function (it) {
          return it.img
            ? el('img', { src: Kit.src(it.img), alt: '', loading: 'lazy' })
            : el('span', { text: it.pic || '🚂' });
        }));
        pGrid.appendChild(el('button', {
          type: 'button',
          class: 'pack-card' + (p.id === S.packId ? ' on' : ''),
          onclick: function () { Kit.sound('tap'); S.packId = p.id; Kit.pref('tt_pack', p.id); setup(); }
        }, [
          thumbs,
          el('b', { text: (p.e ? p.e + ' ' : '') + p.name }),
          el('small', { text: (p.sub ? p.sub + ' · ' : '') + p.items.length + ' sentences' })
        ]));
      });
      leftBox.appendChild(pGrid);
      leftBox.appendChild(el('div', { class: 'row-end' }, [
        el('button', { type: 'button', class: 'btn lilac sm', text: '🎨 Edit or Paste Sentences (Excel / CSV)', onclick: openLiveEditor })
      ]));

      leftBox.appendChild(el('div', { class: 'label', text: '🚂 Which Stations Today?' }));
      leftBox.appendChild(seg([
        ['all', '🌟 All 3 Stations (Full Journey)'],
        ['1', '① Past Gate (was / -ed / irregular)'],
        ['2', "② Didn't Bridge (negatives)"],
        ['3', '③ Did Tower (questions)']
      ], S.stationMode, function (v) { S.stationMode = v; Kit.pref('tt_station', v); setup(); }));

      leftBox.appendChild(el('div', { class: 'label', text: '🎫 Sentences Per Station' }));
      var perOpts = S.stationMode === 'all'
        ? [[4, '4 per station (12 total · ≈ 8m)'], [6, '6 per station (18 total · ≈ 12m)'], [8, '8 per station (24 total · ≈ 16m)']]
        : [[5, '5 sentences · ≈ 5m'], [8, '8 sentences · ≈ 8m'], [10, '10 sentences · ≈ 11m']];
      leftBox.appendChild(seg(perOpts, S.perStation, function (v) { S.perStation = v; Kit.pref('tt_per', v); setup(); }));

      /* Right column: Teams, Classroom, Timer & Bonus */
      var playBox = el('section', { class: 'panel' }, [el('h2', { text: '🐾 Teams & Classroom Rules' })]);
      playBox.appendChild(seg([[0, '🌟 Whole class'], [2, '2 teams'], [3, '3 teams'], [4, '4 teams'], [5, '5'], [6, '6']], S.teams, function (v) {
        S.teams = v; Kit.pref('teams', v);
        if (v > 0 && S.classId && Kit.pref('teamMode') === 'groups' && Kit.classroom && Kit.classroom.groups(S.classId).length !== v) {
          Kit.pref('teamMode', 'fair');
        }
        setup();
      }));

      var clsNode = Kit.classroom && Kit.classroom.setupPanel ? Kit.classroom.setupPanel(S, setup) : null;
      if (clsNode) playBox.appendChild(clsNode);

      playBox.appendChild(el('div', { class: 'label', text: '⏱ Question Timer' }));
      playBox.appendChild(seg([[0, '∞ No timer'], [15, '15s'], [20, '20s'], [30, '30s']], S.timerSec, function (v) { S.timerSec = +v; Kit.pref('tt_timer', +v); setup(); }));

      if (S.stationMode === 'all' || S.stationMode === '3') {
        playBox.appendChild(el('div', { class: 'label', text: '🗼 Station 3 Speaking Bonus' }));
        playBox.appendChild(seg([[true, '✓ Ask "Yes, she did / No, she didn\'t" (+5 ⭐)'], [false, 'Question building only']], S.yesNoBonus, function (v) { S.yesNoBonus = v; Kit.pref('tt_yn', v); setup(); }));
      }

      var stCount = S.stationMode === 'all' ? 3 : 1;
      var totalQ = stCount * (+S.perStation || 5);
      var mins = Math.max(4, Math.round(totalQ * 0.72));
      var go = el('section', { class: 'go panel' }, [
        el('div', null, [
          el('b', { text: '⏱ About ' + mins + ' minutes' }),
          el('small', { class: 'muted', text: totalQ + ' sentences · ' + (stCount === 3 ? '3 stations + Egypt finale' : '1 focused station') + ' · ' + (S.teams ? S.teams + ' teams (with Steal!)' : 'whole class') })
        ]),
        el('button', {
          type: 'button', class: 'btn lg', text: '🚂 All Aboard!',
          onclick: function () { Kit.sound('whistle'); start(cur); }
        })
      ]);

      app.appendChild(hero);
      app.appendChild(el('div', { class: 'setup-cols' }, [leftBox, el('div', { class: 'setup-side' }, [playBox, go])]));
      app.appendChild(el('p', {
        class: 'keys-hint muted',
        html: 'Shortcuts: <span class="kbd">1</span>–<span class="kbd">5</span> pick ticket / chip · <span class="kbd">Space</span> speak sentence · <span class="kbd">H</span> owl hint · <span class="kbd">N</span> next · <span class="kbd">F</span> full screen'
      }));
      Kit.keys({ enter: function () { Kit.sound('whistle'); start(cur); } });
    });
  }

  /* ======================= Build Journey Queue & Play Shell ======================= */
  function buildQueue(pack) {
    var allForms = (pack.items || []).map(Kit.sentences.forms).filter(Boolean);
    var nonBe = allForms.filter(function (f) { return !f.item.isBe; });
    if (!nonBe.length) nonBe = allForms;
    var stationsToRun = S.stationMode === 'all' ? [1, 2, 3] : [+S.stationMode];
    var per = +S.perStation || 5;
    var out = [];

    stationsToRun.forEach(function (stNum) {
      var pool = stNum === 1 ? Kit.shuffle(allForms) : Kit.shuffle(nonBe);
      for (var i = 0; i < per; i++) {
        out.push({ station: stNum, fm: pool[i % pool.length] });
      }
    });
    return out;
  }

  function fit() {
    if (!ui.box) return;
    var r = ui.box.getBoundingClientRect(), ar = 16 / 10;
    var w = r.width, h = w / ar;
    if (h > r.height) { h = r.height; w = h * ar; }
    ui.stage.style.width = Math.floor(w) + 'px';
    ui.stage.style.height = Math.floor(h) + 'px';
  }
  var resizeT = 0;
  root.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { if (S.phase !== 'setup') fit(); }, 100);
  });

  function start(pack) {
    clearTimers();
    S.pack = pack;
    S.queue = Kit.preview ? buildPreviewQueue(pack) : buildQueue(pack);
    S.qIdx = 0;
    S.carriages = 0;
    S.turn = 0;
    S.classStars = 0;
    S.teamsData = S.teams ? Kit.makeTeams(S.teams, { classId: Kit.preview ? '' : S.classId }) : [];
    S.phase = 'play';
    Kit.clearKeys(['enter']);
    buildShell();
    renderStep(true);
  }

  function buildPreviewQueue(pack) {
    var allForms = (pack.items || []).map(Kit.sentences.forms).filter(Boolean);
    var nonBe = allForms.filter(function (f) { return !f.item.isBe; });
    return [
      { station: 1, fm: allForms[0] },
      { station: 2, fm: nonBe[1] || nonBe[0] },
      { station: 3, fm: nonBe[2] || nonBe[0] }
    ];
  }

  function buildShell() {
    app.innerHTML = '';
    app.className = 'app play-screen' + (Kit.preview ? ' is-preview' : '');

    ui.head = el('div', { class: 'play-head' });
    ui.count = el('div', { class: 'count-pill' });
    ui.teams = el('div', { class: 'team-bar' });
    ui.worth = el('div', { class: 'worth-pill' });
    ui.head.appendChild(ui.count); ui.head.appendChild(ui.teams); ui.head.appendChild(ui.worth);

    ui.box = el('div', { class: 'stage-box' });
    ui.stage = el('div', { class: 'stage' });
    ui.box.appendChild(ui.stage);

    ui.ctrl = el('div', { class: 'controls' });
    ui.caption = el('div', { class: 'caption hidden' });

    app.appendChild(ui.head);
    app.appendChild(ui.box);
    app.appendChild(ui.ctrl);
    app.appendChild(ui.caption);

    /* Persistent stage layers so the train smoothly carries carriages across stations */
    ui.bg = el('img', { class: 'tt-bg', src: Kit.src(STATIONS[0].bg), alt: '' });
    ui.portalFx = el('div', { class: 'gate-portal-fx' });
    ui.bridgeBox = el('div', { class: 'bridge-gap-box hidden', text: '⚠️ Broken Bridge' });
    ui.towerBeam = el('div', { class: 'tower-beam' });

    ui.topHud = el('div', { class: 'tt-top-hud' });
    ui.route = el('div', { class: 'tt-route' });
    ui.rightHud = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } });
    ui.topHud.appendChild(ui.route);
    ui.topHud.appendChild(ui.rightHud);

    ui.workbench = el('div', { class: 'tt-workbench' });

    ui.owlSpeech = el('div', { class: 'tt-owl-speech hidden' });
    ui.owlWrap = el('div', { class: 'tt-owl-wrap' }, [
      ui.owlSpeech,
      el('img', { class: 'tt-owl', src: Kit.src(ART + 'conductor.webp'), alt: 'Owl Conductor' })
    ]);

    ui.carsBox = el('div', { class: 'tt-cars' });
    ui.engine = el('div', { class: 'tt-engine' }, [
      el('span', { class: 'tt-puff p1' }),
      el('span', { class: 'tt-puff p2' }),
      el('span', { class: 'tt-puff p3' }),
      el('img', { src: Kit.src(ART + 'train_engine.webp'), alt: 'Time Train' })
    ]);
    ui.train = el('div', { class: 'tt-train arriving' }, [ui.engine, ui.carsBox]);
    ui.railway = el('div', { class: 'tt-railway' }, [ui.train]);

    ui.stage.appendChild(ui.bg);
    ui.stage.appendChild(ui.portalFx);
    ui.stage.appendChild(ui.bridgeBox);
    ui.stage.appendChild(ui.towerBeam);
    ui.stage.appendChild(ui.topHud);
    ui.stage.appendChild(ui.workbench);
    ui.stage.appendChild(ui.owlWrap);
    ui.stage.appendChild(ui.railway);

    drawTeams();
    fit();

    Kit.keys({
      space: function () { if (ui.speakCurrent) ui.speakCurrent(); },
      r: function () { if (ui.speakCurrent) ui.speakCurrent(); },
      enter: function () { if (ui.enterAction) ui.enterAction(); else if (ui.speakCurrent) ui.speakCurrent(); },
      h: function () { if (ui.hintBtn && !ui.hintBtn.disabled) ui.hintBtn.click(); },
      n: function () { if (ui.nextBtn && !ui.nextBtn.disabled) ui.nextBtn.click(); },
      escape: quitAsk
    });
  }

  function drawTeams() {
    if (!S.teamsData.length) {
      ui.teams.innerHTML = '';
      ui.teams.appendChild(el('div', { class: 'play-head-wrap' }, [
        el('div', { class: 'class-stars', text: '⭐ ' + S.classStars + ' class stars' })
      ]));
      return;
    }
    Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
  }

  function setWorth(n) {
    S.worth = Math.max(5, Math.round(n));
    ui.worth.innerHTML = '';
    ui.worth.appendChild(el('span', { text: 'Worth' }));
    ui.worth.appendChild(el('b', { text: '⭐ ' + S.worth }));
  }

  function sayOwl(msg, ms) {
    if (!msg) { ui.owlSpeech.classList.add('hidden'); return; }
    ui.owlSpeech.textContent = msg;
    ui.owlSpeech.classList.remove('hidden');
    if (ms) later(function () { ui.owlSpeech.classList.add('hidden'); }, ms);
  }

  function addCarriage() {
    S.carriages++;
    Kit.sound('couple');
    if (ui.carsBox.children.length < 6) {
      var carIdx = ((S.carriages - 1) % 4) + 1;
      var car = el('div', { class: 'tt-car just-added' }, [
        el('img', { src: Kit.src(ART + 'train_car_' + carIdx + '.webp'), alt: '' })
      ]);
      ui.carsBox.appendChild(car);
    }
  }

  function renderRouteMap(curStationNum) {
    ui.route.innerHTML = '';
    STATIONS.forEach(function (st) {
      var cls = st.num < curStationNum ? 'done' : st.num === curStationNum ? 'now' : '';
      ui.route.appendChild(el('span', { class: 'tt-stop ' + cls, text: st.short }));
    });
    ui.route.appendChild(el('span', { class: 'tt-stop', text: '🏺 Past' }));
  }

  function controls(list) {
    ui.ctrl.innerHTML = ''; ui.hintBtn = null; ui.nextBtn = null;
    list.forEach(function (b) {
      if (!b) return;
      var n = el('button', {
        type: 'button', class: 'btn ' + (b.cls || ''),
        text: b.label, disabled: b.disabled ? true : null, onclick: b.on
      });
      if (b.key === 'hint') ui.hintBtn = n;
      if (b.key === 'next') ui.nextBtn = n;
      ui.ctrl.appendChild(n);
    });
  }

  function caption(i, text) {
    if (!Kit.preview) return;
    ui.caption.classList.remove('hidden');
    ui.caption.innerHTML = '<b>' + i + '</b> ' + Kit.esc(text);
  }

  function startTimer(onExpire) {
    clearInterval(cdInterval);
    ui.rightHud.innerHTML = '';
    if (S.stealAttempt && S.teamsData.length) {
      ui.rightHud.appendChild(el('span', { class: 'steal-pill', text: '⚡ Steal Turn: ' + S.teamsData[S.turn].name + '!' }));
    }
    if (!S.timerSec || Kit.preview) return;
    var left = S.timerSec;
    var pill = el('span', { class: 'tt-timer', text: '⏱ ' + left + 's' });
    ui.rightHud.appendChild(pill);
    cdInterval = setInterval(function () {
      left--;
      pill.textContent = '⏱ ' + left + 's';
      if (left <= 5) pill.classList.add('urgent');
      if (left <= 0) { clearInterval(cdInterval); onExpire(); }
      else if (left <= 4) Kit.sound('tick');
    }, 1000);
  }

  /* ======================= Step & Station Transitions ======================= */
  function renderStep(first) {
    clearTimers();
    if (S.qIdx >= S.queue.length) return playFinale();

    var curEntry = S.queue[S.qIdx];
    var prevEntry = S.qIdx > 0 ? S.queue[S.qIdx - 1] : null;
    var stMeta = STATIONS[curEntry.station - 1];

    /* If moving to a new station, play a joyful train departure + arrival transition! */
    if (!first && prevEntry && prevEntry.station !== curEntry.station && !Kit.preview) {
      Kit.sound('whistle');
      Kit.sound('chug');
      sayOwl('🚂 Next stop: ' + stMeta.name + '!');
      ui.train.classList.remove('arriving');
      ui.train.classList.add('departing');
      ui.workbench.innerHTML = '';
      later(function () {
        ui.bg.src = Kit.src(stMeta.bg);
        if (Kit.music) Kit.music.start(stMeta.mood);
        ui.train.classList.remove('departing');
        void ui.train.offsetWidth;
        ui.train.classList.add('arriving');
        mountQuestion(curEntry, stMeta);
      }, 950);
      return;
    }

    ui.bg.src = Kit.src(stMeta.bg);
    if (first && Kit.music) Kit.music.start(stMeta.mood);
    mountQuestion(curEntry, stMeta);
  }

  function mountQuestion(entry, stMeta) {
    S.phase = 'play';
    S.stealAttempt = false;
    ui.enterAction = null;
    setWorth(10);
    ui.stage.classList.remove('is-end');
    var oldFinale = ui.stage.querySelector('.finale-card');
    if (oldFinale) oldFinale.remove();
    ui.portalFx.classList.remove('open');
    ui.towerBeam.classList.remove('lit');
    ui.bridgeBox.className = 'bridge-gap-box' + (entry.station === 2 ? '' : ' hidden');
    ui.bridgeBox.textContent = '⚠️ Broken Bridge';
    sayOwl('');

    ui.count.innerHTML = '<span>Sentence</span><b>' + (S.qIdx + 1) + ' / ' + S.queue.length + '</b>';
    renderRouteMap(entry.station);
    drawTeams();

    if (entry.station === 1) renderStation1(entry.fm, stMeta);
    else if (entry.station === 2) renderStation2(entry.fm, stMeta);
    else renderStation3(entry.fm, stMeta);
  }

  /* Soft-fail handler with Team Steal pass! */
  function handleWrongAttempt(hintMsg) {
    Kit.sound('soft');
    sayOwl('💡 ' + hintMsg, 3600);
    if (S.teamsData.length && !S.stealAttempt) {
      S.stealAttempt = true;
      advanceTurn();
      drawTeams();
      ui.rightHud.innerHTML = '';
      ui.rightHud.appendChild(el('span', { class: 'steal-pill', text: '⚡ Steal Turn: ' + S.teamsData[S.turn].name + '!' }));
      Kit.toast('⚡ ' + S.teamsData[S.turn].name + ' can steal this point!', 1400);
    }
  }

  function awardCurrentSuccess(spokenSentence, onReadyNext) {
    clearInterval(cdInterval);
    if (popOverlayKeys) { popOverlayKeys(); popOverlayKeys = null; }
    addCarriage();
    Kit.say(spokenSentence);
    var c = Kit.centerOf(ui.workbench);
    Kit.confetti(c.x, c.y, Kit.preview ? 28 : 56);

    if (S.teamsData.length) {
      Kit.award(ui.teams, S.teamsData, S.turn, S.worth);
      advanceTurn();
      drawTeams();
    } else {
      S.classStars += S.worth;
      drawTeams();
      Kit.sound('correct');
    }

    if (onReadyNext) {
      onReadyNext();
    } else {
      showNextControl();
    }
  }

  function showNextControl() {
    var isLast = S.qIdx + 1 >= S.queue.length;
    var nextStationDiff = !isLast && S.queue[S.qIdx + 1].station !== S.queue[S.qIdx].station;
    var lbl = isLast ? '🏺 Travel to the Past! →' : nextStationDiff ? ('🚂 Chug to Station ' + S.queue[S.qIdx + 1].station + ' →') : 'Next sentence →';
    controls([{
      label: lbl, cls: 'mint lg', key: 'next',
      on: function () { S.qIdx++; renderStep(false); }
    }]);
    if (Kit.preview) later(function () { S.qIdx++; renderStep(false); }, 1350);
  }

  function makePicBox(it) {
    return el('div', { class: 'tt-pic' }, [
      it.img ? el('img', { src: Kit.src(it.img), alt: '' }) : doc.createTextNode(it.pic || '🚂')
    ]);
  }

  /* =========================================================================
     STATION 1: PAST GATE (Base Verb -> Past Verb Golden Tickets)
     ========================================================================= */
  function renderStation1(fm, stMeta) {
    ui.workbench.innerHTML = '';
    var it = fm.item;
    var solved = false;

    var gapNode = el('span', { class: 'tt-gap active-slot', text: '___' });
    var subjShown = (it.when && !/^(Jannah|Voyager|Beethoven|Cairo|Boston|Earth|Egypt|Lina|I)\b/.test(it.subj))
      ? it.subj.charAt(0).toLowerCase() + it.subj.slice(1)
      : it.subj;

    var sentEl = el('div', { class: 'tt-sentence' }, [
      it.when ? (it.when + ', ') : '',
      subjShown + ' ',
      gapNode,
      ' ' + it.rest + '.',
      el('span', { class: 'tt-base-hint', text: '(' + it.base + ')' })
    ]);

    ui.speakCurrent = function () {
      Kit.say(solved ? fm.posFull : ((it.when ? it.when + ', ' : '') + subjShown + ' blank ' + it.rest));
    };

    var card = el('div', { class: 'tt-card' }, [
      el('div', { class: 'tt-card-top' }, [
        el('span', { class: 'tt-station-tag', text: stMeta.tag }),
        el('button', { type: 'button', class: 'icon-btn', title: 'Read aloud (Space)', text: '🔊', onclick: function () { ui.speakCurrent(); } })
      ]),
      el('div', { class: 'tt-sentence-row' }, [makePicBox(it), sentEl])
    ]);

    var choices = Kit.shuffle(fm.st1Choices);
    var tRow = el('div', { class: 'ticket-row' });
    var btnNodes = [];

    choices.forEach(function (word, idx) {
      var btn = el('button', {
        type: 'button',
        class: 'verb-ticket',
        onclick: function () { pickTicket(idx); }
      }, [
        el('img', { class: 'tk-bg', src: Kit.src(ART + 'ticket.webp'), alt: '' }),
        el('span', { class: 'tk-num', text: String(idx + 1) }),
        el('span', { class: 'tk-word', text: word })
      ]);
      btnNodes.push(btn);
      tRow.appendChild(btn);
    });
    card.appendChild(tRow);
    ui.workbench.appendChild(card);

    function pickTicket(idx) {
      if (solved || !btnNodes[idx] || btnNodes[idx].classList.contains('wrong')) return;
      var chosen = choices[idx];
      if (chosen === it.past) {
        solved = true;
        btnNodes[idx].classList.add('right');
        gapNode.textContent = it.past;
        gapNode.className = 'tt-gap right';
        ui.portalFx.classList.add('open');
        sayOwl('🌟 ' + fm.hint + '!');
        awardCurrentSuccess(fm.posFull);
      } else {
        btnNodes[idx].classList.add('wrong');
        gapNode.classList.add('wrong');
        later(function () { gapNode.classList.remove('wrong'); }, 380);
        handleWrongAttempt('Past time! ' + fm.hint);
      }
    }

    controls([
      {
        label: '🦉 Owl Hint (H)', cls: 'butter sm', key: 'hint',
        on: function (e) {
          if (solved) return;
          e.currentTarget.disabled = true;
          setWorth(5);
          sayOwl('💡 Hint: ' + fm.hint);
          var wrongIdxs = choices.map(function (w, i) { return w === it.past ? -1 : i; }).filter(function (i) { return i >= 0; });
          Kit.shuffle(wrongIdxs).slice(0, 2).forEach(function (wi) { btnNodes[wi].classList.add('wrong'); });
          Kit.sound('pop');
        }
      },
      { label: 'Skip →', cls: 'soft sm', key: 'next', on: function () { S.qIdx++; renderStep(false); } }
    ]);

    popOverlayKeys = Kit.overlayKeys({
      1: function () { pickTicket(0); },
      2: function () { pickTicket(1); },
      3: function () { pickTicket(2); },
      4: function () { pickTicket(3); }
    });

    startTimer(function () {
      if (!solved) {
        handleWrongAttempt('Time up! ' + fm.hint);
        pickTicket(choices.indexOf(it.past));
      }
    });

    if (Kit.preview) {
      caption(1, 'Pick the past-tense ticket!');
      later(function () { pickTicket(choices.indexOf(it.past)); }, 1050);
    }
  }

  /* Helper: Attach pointer drag-and-drop + keyboard/1-tap click onto word chips */
  function enableChipDrag(chipNode, getDropSlots, onActivateChip) {
    var startX = 0, startY = 0, moved = false, clone = null, lastPointerAt = 0;
    chipNode.addEventListener('pointerdown', function (e) {
      if (chipNode.classList.contains('used')) return;
      startX = e.clientX; startY = e.clientY; moved = false;
      try { chipNode.setPointerCapture(e.pointerId); } catch (err) {}
    });
    chipNode.addEventListener('pointermove', function (e) {
      if (!chipNode.hasPointerCapture || !chipNode.hasPointerCapture(e.pointerId)) return;
      if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) > 10) {
        moved = true;
        clone = chipNode.cloneNode(true);
        clone.classList.add('dragging');
        doc.body.appendChild(clone);
      }
      if (moved && clone) {
        clone.style.left = (e.clientX - clone.offsetWidth / 2) + 'px';
        clone.style.top = (e.clientY - clone.offsetHeight / 2) + 'px';
      }
    });
    chipNode.addEventListener('pointerup', function (e) {
      lastPointerAt = Date.now();
      if (clone) { clone.remove(); clone = null; }
      if (!moved) {
        onActivateChip(null);
        return;
      }
      var slots = getDropSlots();
      var hitSlot = null;
      for (var i = 0; i < slots.length; i++) {
        var r = slots[i].getBoundingClientRect();
        if (e.clientX >= r.left - 12 && e.clientX <= r.right + 12 && e.clientY >= r.top - 12 && e.clientY <= r.bottom + 12) {
          hitSlot = i; break;
        }
      }
      onActivateChip(hitSlot);
    });
    chipNode.addEventListener('click', function () {
      if (Date.now() - lastPointerAt < 380) return;
      if (chipNode.classList.contains('used')) return;
      onActivateChip(null);
    });
  }

  function triggerRewindBadge(targetNode, fromWord, toWord) {
    Kit.sound('rewind');
    targetNode.classList.remove('rewinding');
    void targetNode.offsetWidth;
    targetNode.classList.add('rewinding');
    var badge = el('img', { class: 'rewind-badge', src: Kit.src(ART + 'rewind_icon.webp'), alt: 'Rewind' });
    targetNode.appendChild(badge);
    later(function () {
      var txtNode = targetNode.querySelector('.w-txt') || targetNode;
      if (txtNode && toWord) txtNode.textContent = toWord;
    }, 240);
    later(function () { if (badge.parentNode) badge.remove(); }, 780);
    if (fromWord && toWord) sayOwl('⏪ Rewind! ' + fromWord + ' → ' + toWord + '!');
  }

  /* =========================================================================
     STATION 2: DIDN'T BRIDGE (Negative: didn't + base verb with ⏪ Rewind!)
     ========================================================================= */
  function renderStation2(fm, stMeta) {
    ui.workbench.innerHTML = '';
    var it = fm.item;
    var solved = false;
    var slotVals = [null, null]; // [ "didn't", base ]

    var slot1 = el('span', { class: 'tt-gap active-slot', text: '___', onclick: function () { clearSlot(0); } });
    var slot2 = el('span', { class: 'tt-gap', text: '___', onclick: function () { clearSlot(1); } });

    ui.speakCurrent = function () { Kit.say(solved ? fm.negFull : fm.posPlain); };

    var card = el('div', { class: 'tt-card' }, [
      el('div', { class: 'tt-card-top' }, [
        el('span', { class: 'tt-station-tag', text: stMeta.tag }),
        el('span', { class: 'tt-source-pill', text: 'Positive: ' + fm.posPlain }),
        el('button', { type: 'button', class: 'icon-btn', title: 'Read aloud', text: '🔊', onclick: function () { ui.speakCurrent(); } })
      ]),
      el('div', { class: 'tt-sentence-row' }, [
        makePicBox(it),
        el('div', { class: 'tt-sentence' }, [it.subj + ' ', slot1, ' ', slot2, ' ' + it.rest + '.'])
      ])
    ]);

    var chipWords = Kit.shuffle([
      { word: "didn't", role: 'aux' },
      { word: it.base, role: 'base' },
      { word: fm.trapPast, role: 'trap_past' },
      { word: "don't", role: 'trap_dont' }
    ]);

    var tray = el('div', { class: 'chip-tray' });
    var chipNodes = [];

    chipWords.forEach(function (cw, idx) {
      var cn = el('button', { type: 'button', class: 'word-chip' }, [
        el('span', { class: 'w-txt', text: cw.word })
      ]);
      enableChipDrag(cn, function () { return [slot1, slot2]; }, function (dropIdx) {
        useChip(idx, dropIdx);
      });
      chipNodes.push(cn);
      tray.appendChild(cn);
    });
    card.appendChild(tray);
    ui.workbench.appendChild(card);

    function refreshSlotsUi() {
      [slot1, slot2].forEach(function (sl, i) {
        var v = slotVals[i];
        sl.textContent = v ? v.word : '___';
        sl.className = 'tt-gap' + (v ? ' filled' : '');
      });
      if (!slotVals[0]) slot1.classList.add('active-slot');
      else if (!slotVals[1]) slot2.classList.add('active-slot');
    }

    function clearSlot(sIdx) {
      if (solved || !slotVals[sIdx]) return;
      chipNodes[slotVals[sIdx].chipIdx].classList.remove('used');
      slotVals[sIdx] = null;
      Kit.sound('tap');
      refreshSlotsUi();
    }

    function useChip(cIdx, preferredSlot) {
      if (solved) return;
      var cn = chipNodes[cIdx], cw = chipWords[cIdx];
      if (!cn || cn.classList.contains('used')) return;

      var targetSlot = preferredSlot != null ? preferredSlot : (!slotVals[0] ? 0 : (!slotVals[1] ? 1 : -1));
      if (targetSlot < 0) return;

      /* Immediate pedagogical guard so kids SEE why "don't" or "didn't + saw" rewinds! */
      if (targetSlot === 0) {
        if (cw.word !== "didn't") {
          slot1.classList.add('wrong');
          later(function () { slot1.classList.remove('wrong'); }, 380);
          handleWrongAttempt('In the past, we use "didn\'t" first!');
          return;
        }
        cn.classList.add('used');
        slotVals[0] = { word: cw.word, chipIdx: cIdx };
        Kit.sound('pop');
        refreshSlotsUi();
        sayOwl('⏪ Now rewind "' + it.past + '" back to "' + it.base + '"!');
        return;
      }

      if (targetSlot === 1) {
        if (!slotVals[0]) {
          sayOwl('Put "didn\'t" in the first gap first!');
          Kit.sound('tap');
          return;
        }
        if (cw.role === 'trap_past') {
          /* Signature teaching moment: show saw rewinding to see! */
          slot2.textContent = cw.word;
          slot2.classList.add('wrong');
          triggerRewindBadge(slot2, cw.word, '___');
          later(function () { slot2.classList.remove('wrong'); refreshSlotsUi(); }, 700);
          handleWrongAttempt('After "didn\'t", rewind "' + cw.word + '" ⏪ "' + it.base + '"!');
          return;
        }
        if (cw.role !== 'base') {
          slot2.classList.add('wrong');
          later(function () { slot2.classList.remove('wrong'); }, 380);
          handleWrongAttempt('Pick the base verb "' + it.base + '"!');
          return;
        }
        /* Correct! Show the past verb briefly rewinding into the base verb right in Slot 2! */
        solved = true;
        cn.classList.add('used');
        slotVals[1] = { word: cw.word, chipIdx: cIdx };
        slot1.className = 'tt-gap right';
        slot2.className = 'tt-gap right';
        slot2.innerHTML = '<span class="w-txt">' + Kit.esc(it.past) + '</span>';
        triggerRewindBadge(slot2, it.past, it.base);

        ui.bridgeBox.classList.add('fixed');
        ui.bridgeBox.textContent = '✓ Bridge Fixed!';
        later(function () {
          awardCurrentSuccess(fm.negFull);
        }, 560);
      }
    }

    controls([
      {
        label: '🦉 Owl Hint (H)', cls: 'butter sm', key: 'hint',
        on: function (e) {
          if (solved) return;
          e.currentTarget.disabled = true; setWorth(5);
          sayOwl('💡 didn\'t + base verb: "didn\'t ' + it.base + '"!');
          Kit.sound('pop');
        }
      },
      { label: 'Skip →', cls: 'soft sm', key: 'next', on: function () { S.qIdx++; renderStep(false); } }
    ]);

    popOverlayKeys = Kit.overlayKeys({
      1: function () { useChip(0, null); },
      2: function () { useChip(1, null); },
      3: function () { useChip(2, null); },
      4: function () { useChip(3, null); }
    });

    startTimer(function () {
      if (!solved) {
        var didIdx = chipWords.findIndex(function (x) { return x.word === "didn't"; });
        var baseIdx = chipWords.findIndex(function (x) { return x.role === 'base'; });
        if (!slotVals[0] && didIdx >= 0) useChip(didIdx, 0);
        if (baseIdx >= 0) useChip(baseIdx, 1);
      }
    });

    if (Kit.preview) {
      caption(2, 'Didn\'t ⏪ rewinds verb to base!');
      var dIdx = chipWords.findIndex(function (x) { return x.word === "didn't"; });
      var bIdx = chipWords.findIndex(function (x) { return x.role === 'base'; });
      later(function () { useChip(dIdx, 0); }, 700);
      later(function () { useChip(bIdx, 1); }, 1450);
    }
  }

  /* =========================================================================
     STATION 3: DID TOWER (Build "Did + subj + base + rest + ?" + Yes/No Bonus)
     ========================================================================= */
  function renderStation3(fm, stMeta) {
    ui.workbench.innerHTML = '';
    var it = fm.item;
    var solved = false;
    var rewound = false;

    /* 5 ordered slots: [ 'Did', fm.qSubj, it.base, it.rest, '?' ]
       Note: Verb chip starts as `it.past` and punctuation starts as `.` until `Did` lands in Slot 0! */
    var expected = ['Did', fm.qSubj, it.base, it.rest, '?'];
    var placed = [null, null, null, null, null];

    var slotsRow = el('div', { class: 'chip-slots-row' });
    var slotNodes = expected.map(function (_, sIdx) {
      var sn = el('span', {
        class: 'tt-gap' + (sIdx === 0 ? ' active-slot' : ''),
        style: { minWidth: sIdx === 4 ? '52px' : sIdx === 3 ? '150px' : '86px' },
        text: sIdx === 0 ? 'Did…' : '___',
        onclick: function () { removeFromSlot(sIdx); }
      });
      slotsRow.appendChild(sn);
      return sn;
    });

    ui.speakCurrent = function () { Kit.say(solved ? fm.qFull : fm.posPlain); };

    var card = el('div', { class: 'tt-card' }, [
      el('div', { class: 'tt-card-top' }, [
        el('span', { class: 'tt-station-tag', text: stMeta.tag }),
        el('span', { class: 'tt-source-pill', text: 'Statement: ' + fm.posPlain }),
        el('button', { type: 'button', class: 'icon-btn', title: 'Read aloud', text: '🔊', onclick: function () { ui.speakCurrent(); } })
      ]),
      el('div', { class: 'tt-sentence-row' }, [makePicBox(it), slotsRow])
    ]);

    var rawChips = [
      { role: 'did',  curText: 'Did',      finalText: 'Did' },
      { role: 'subj', curText: it.subj,    finalText: fm.qSubj },
      { role: 'verb', curText: it.past,    finalText: it.base },
      { role: 'rest', curText: it.rest,    finalText: it.rest },
      { role: 'punc', curText: '.',        finalText: '?' }
    ];
    var chips = Kit.shuffle(rawChips);
    var tray = el('div', { class: 'chip-tray' });
    var chipNodes = [];

    chips.forEach(function (ch, idx) {
      var cn = el('button', { type: 'button', class: 'word-chip' }, [
        el('span', { class: 'w-txt', text: ch.curText })
      ]);
      enableChipDrag(cn, function () { return slotNodes; }, function (dropSlot) {
        tapChip(idx, dropSlot);
      });
      chipNodes.push(cn);
      tray.appendChild(cn);
    });
    card.appendChild(tray);
    ui.workbench.appendChild(card);

    function refreshSlots() {
      var firstEmpty = placed.indexOf(null);
      slotNodes.forEach(function (sn, i) {
        sn.textContent = placed[i] ? placed[i].text : (i === 0 ? 'Did…' : '___');
        sn.className = 'tt-gap' + (placed[i] ? ' filled' : '') + (i === firstEmpty ? ' active-slot' : '');
      });
    }

    function removeFromSlot(sIdx) {
      if (solved || !placed[sIdx]) return;
      chipNodes[placed[sIdx].chipIdx].classList.remove('used');
      placed[sIdx] = null;
      Kit.sound('tap');
      refreshSlots();
    }

    function tapChip(cIdx, explicitSlot) {
      if (solved) return;
      var cn = chipNodes[cIdx], ch = chips[cIdx];
      if (!cn || cn.classList.contains('used')) return;

      var sIdx = explicitSlot != null ? explicitSlot : placed.indexOf(null);
      if (sIdx < 0 || placed[sIdx]) sIdx = placed.indexOf(null);
      if (sIdx < 0) return;

      /* Check if this chip belongs in sIdx */
      var wantRole = ['did', 'subj', 'verb', 'rest', 'punc'][sIdx];
      if (ch.role !== wantRole) {
        slotNodes[sIdx].classList.add('wrong');
        later(function () { slotNodes[sIdx].classList.remove('wrong'); }, 360);
        var orderHints = ['Start with "Did"!', 'Next comes who: "' + fm.qSubj + '"!', 'Next comes the verb: "' + it.base + '"!', 'Add "' + it.rest + '"!', 'Finish with "?"!'];
        handleWrongAttempt(orderHints[sIdx]);
        return;
      }

      cn.classList.add('used');
      placed[sIdx] = { text: ch.finalText, chipIdx: cIdx };
      Kit.sound('pop');
      refreshSlots();

      /* THE KEY TEACHING MOMENT: Placing "Did" at Slot 0 visibly rewinds `past -> base` & `. -> ?`! */
      if (sIdx === 0 && !rewound) {
        rewound = true;
        chips.forEach(function (other, oIdx) {
          if (other.role === 'verb' && other.curText !== other.finalText) {
            other.curText = other.finalText;
            triggerRewindBadge(chipNodes[oIdx], it.past, it.base);
          } else if (other.role === 'subj' && other.curText !== other.finalText) {
            other.curText = other.finalText;
            chipNodes[oIdx].querySelector('.w-txt').textContent = other.finalText;
          } else if (other.role === 'punc') {
            other.curText = '?';
            chipNodes[oIdx].classList.add('rewinding');
            chipNodes[oIdx].querySelector('.w-txt').textContent = '?';
          }
        });
      }

      if (placed.every(Boolean)) {
        solved = true;
        slotNodes.forEach(function (sn) { sn.className = 'tt-gap right'; });
        ui.towerBeam.classList.add('lit');

        if (S.yesNoBonus && !Kit.preview) {
          clearInterval(cdInterval);
          Kit.sound('reveal');
          Kit.say(fm.qFull);
          sayOwl('🗼 Question built! Now answer aloud!');
          tray.innerHTML = '';
          var ynRow = el('div', { class: 'yn-bonus-row' }, [
            el('span', { text: '🎤 Answer (+5 ⭐):' }),
            el('button', {
              type: 'button', class: 'btn mint sm', text: fm.yesText + ' 🔈',
              onclick: function () { finishBonus(true); }
            }),
            el('button', {
              type: 'button', class: 'btn peach sm', text: fm.noText + ' 🔈',
              onclick: function () { finishBonus(false); }
            })
          ]);
          card.appendChild(ynRow);
          function finishBonus(pickedYes) {
            ynRow.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
            var chosenSay = pickedYes ? fm.yesText : fm.noText;
            if (pickedYes === (it.ansYes !== false)) {
              setWorth(S.worth + 5);
              sayOwl('🌟 Yes! ' + chosenSay);
            } else {
              sayOwl('📖 In our story: ' + (it.ansYes !== false ? fm.yesText : fm.noText));
            }
            awardCurrentSuccess(chosenSay);
          }
        } else {
          awardCurrentSuccess(fm.qFull);
        }
      }
    }

    controls([
      {
        label: '🦉 Owl Hint (H)', cls: 'butter sm', key: 'hint',
        on: function (e) {
          if (solved) return;
          e.currentTarget.disabled = true; setWorth(5);
          var nextEmpty = placed.indexOf(null);
          if (nextEmpty >= 0) {
            var want = ['did', 'subj', 'verb', 'rest', 'punc'][nextEmpty];
            var matchIdx = chips.findIndex(function (c, i) { return c.role === want && !chipNodes[i].classList.contains('used'); });
            if (matchIdx >= 0) tapChip(matchIdx, nextEmpty);
          }
        }
      },
      { label: 'Skip →', cls: 'soft sm', key: 'next', on: function () { S.qIdx++; renderStep(false); } }
    ]);

    popOverlayKeys = Kit.overlayKeys({
      1: function () { tapChip(0, null); },
      2: function () { tapChip(1, null); },
      3: function () { tapChip(2, null); },
      4: function () { tapChip(3, null); },
      5: function () { tapChip(4, null); }
    });

    startTimer(function () {
      if (!solved) {
        ['did', 'subj', 'verb', 'rest', 'punc'].forEach(function (role, sIdx) {
          if (!placed[sIdx]) {
            var mi = chips.findIndex(function (c, i) { return c.role === role && !chipNodes[i].classList.contains('used'); });
            if (mi >= 0) tapChip(mi, sIdx);
          }
        });
      }
    });

    if (Kit.preview) {
      caption(3, 'Build the "Did…?" question!');
      ['did', 'subj', 'verb', 'rest', 'punc'].forEach(function (role, step) {
        later(function () {
          var mi = chips.findIndex(function (c, i) { return c.role === role && !chipNodes[i].classList.contains('used'); });
          if (mi >= 0) tapChip(mi, step);
        }, 420 + step * 340);
      });
    }
  }

  /* =========================================================================
     FINALE: CLOCKWORK TIME TUNNEL -> ANCIENT EGYPT PODIUM & CLASS BOARD XP!
     ========================================================================= */
  function playFinale() {
    clearTimers();
    S.phase = 'end';
    ui.worth.innerHTML = ''; ui.worth.style.visibility = 'hidden';
    ui.count.innerHTML = '<b>🏺 The Past!</b>';
    ui.workbench.innerHTML = '';
    ui.portalFx.classList.remove('open');
    ui.towerBeam.classList.remove('lit');
    ui.bridgeBox.classList.add('hidden');
    sayOwl('');

    /* Swirling clockwork time-tunnel reveal */
    var tunnel = el('div', { class: 'time-tunnel' }, [
      el('img', { src: Kit.src(ART + 'rewind_icon.webp'), alt: '' })
    ]);
    ui.stage.appendChild(tunnel);
    Kit.sound('whistle');
    Kit.sound('reveal');

    later(function () {
      ui.bg.src = Kit.src(ART + 'bg_finale_past.webp');
      ui.stage.classList.add('is-end');
      fit();
      ui.route.innerHTML = '';
      STATIONS.forEach(function (st) { ui.route.appendChild(el('span', { class: 'tt-stop done', text: st.short })); });
      ui.route.appendChild(el('span', { class: 'tt-stop now', text: '🏺 Ancient Egypt!' }));

      ui.train.classList.remove('departing');
      void ui.train.offsetWidth;
      ui.train.classList.add('arriving');
    }, 520);

    later(function () {
      if (tunnel.parentNode) tunnel.remove();
      var card = el('div', { class: 'finale-card' });
      var mainCol = el('div', { class: 'finale-main' });

      if (S.teamsData.length) {
        var ranked = S.teamsData.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return b.t.score - a.t.score; });
        var top = ranked[0].t.score, winners = ranked.filter(function (r) { return r.t.score === top; });
        var carWord = S.carriages === 1 ? '1 carriage' : S.carriages + ' carriages';
        mainCol.appendChild(el('h2', { class: 'finale-title', text: winners.length > 1 ? '🤝 We Travelled to the Past!' : '🏆 ' + winners[0].t.name + ' Led the Time Train!' }));
        mainCol.appendChild(el('p', { class: 'finale-sub', text: '🚂 ' + carWord + ' coupled all the way to Ancient Egypt!' }));
        var pod = el('div', { class: 'podium' });
        ranked.forEach(function (r, k) {
          var hgt = top ? 32 + 66 * (r.t.score / top) : 34;
          var mascotTop = el('div', { class: 'pod-mascot' });
          if (k === 0 && r.t.score > 0) mascotTop.appendChild(el('span', { class: 'pod-crown', text: '👑' }));
          if (r.t.mascotImg) {
            var im = el('img', { src: Kit.src(r.t.mascotImg), alt: '' });
            im.onerror = function () { im.remove(); mascotTop.appendChild(doc.createTextNode(r.t.emoji)); };
            mascotTop.appendChild(im);
          } else {
            mascotTop.appendChild(doc.createTextNode(r.t.emoji));
          }
          pod.appendChild(el('div', { class: 'pod', style: { '--tc': r.t.color, '--h': hgt + '%', animationDelay: (k * 0.1) + 's' } }, [
            mascotTop,
            el('div', { class: 'pod-bar' }, [el('b', { text: String(r.t.score) })]),
            el('span', { text: r.t.name })
          ]));
        });
        mainCol.appendChild(pod);
      } else {
        mainCol.appendChild(el('h2', { class: 'finale-title', text: '🏺 We Travelled to the Past!' }));
        mainCol.appendChild(el('p', { class: 'finale-sub', text: '⭐ ' + S.classStars + ' Class Stars · 🚂 ' + S.carriages + ' Carriages Coupled!' }));
      }
      card.appendChild(mainCol);

      var xpPanel = (!Kit.preview && Kit.classroom && Kit.classroom.podiumPanel)
        ? Kit.classroom.podiumPanel({
            classId: S.classId,
            teams: S.teamsData,
            classStars: S.classStars,
            gameId: 'time-train',
            gameTitle: 'Time Train (Past Simple)',
            icon: '🚂'
          })
        : null;
      if (xpPanel) {
        card.classList.add('has-xp');
        card.appendChild(xpPanel);
      }

      ui.stage.appendChild(card);
      Kit.sound('fanfare');
      Kit.say('We travelled to the past!');
      Kit.confetti(null, null, Kit.preview ? 35 : 140);

      controls([
        { label: '↺ Ride Again', cls: 'mint lg', on: function () { card.remove(); start(S.pack); } },
        { label: '⚙ Setup & Stations', cls: 'soft', on: setup },
        { label: '✦ All games', cls: 'soft', on: function () { root.location.href = '../index.html'; } }
      ]);

      if (Kit.preview) later(function () { card.remove(); start(S.pack); }, 2200);
    }, 1050);
  }

  function quitAsk() {
    if (Kit.preview || S.phase === 'setup') return;
    Kit.modal({
      title: 'Leave the Time Train?',
      body: '<p>Current journey progress will reset.</p>',
      buttons: [{ label: 'Keep riding', cls: 'soft', value: false }, { label: 'Back to setup', cls: 'peach', value: true }]
    }).then(function (ok) { if (ok) { clearTimers(); setup(); } });
  }

  /* ======================= Boot ======================= */
  if (Kit.preview) {
    doc.body.classList.add('preview');
    Kit.sentences.all().then(function (packs) {
      S.teams = 2;
      start(packs[0]);
    });
  } else {
    setup();
  }
})(window);
