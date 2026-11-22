/* Games Collection — Team Prize Family (6 Games)
   bomb | claw | keepgive | croc | cups | tug
   Uses Kit.questions (75+ curriculum packs), Kit.classroom (real pupils + Class Board XP),
   and ?preview=1 3-step showcase clips for the hub hover cards. */
(function (root) {
  'use strict';

  var Kit = root.Kit;
  var el = Kit.el;
  var doc = root.document;
  var app = doc.getElementById('app');

  var GAMES = {
    bomb: {
      id: 'bomb', name: 'Bomb or Bonus', icon: '🎁',
      sub: 'Pick a Mystery Box · Safe Points or Silly Boom?',
      poster: 'posters/bomb.webp',
      steps: ['Answer a question for your team', 'Pick any bobbing mystery gift box', 'Watch it shake & burst into +Stars, 2×, Swap or a Silly Bomb!']
    },
    claw: {
      id: 'claw', name: 'Claw Prize', icon: '🧸',
      sub: 'Drop the Arcade Claw · Grab a Plush Toy',
      poster: 'posters/claw.webp',
      steps: ['Answer a question to power the arcade claw', 'Tap any plushie slot to position the claw', 'Drop the claw & win +10 to +40 Stars!']
    },
    keepgive: {
      id: 'keepgive', name: 'Keep It or Give It', icon: '🎀',
      sub: 'Keep the Mystery Gift or Give It to Rivals',
      poster: 'posters/keepgive.webp',
      steps: ['Answer a question to unlock a gift box', 'Peek inside at the secret prize (or silly bomb!)', 'Choose: KEEP IT or GIVE IT to a rival team!']
    },
    croc: {
      id: 'croc', name: 'Crocodile Snap', icon: '🐊',
      sub: "Press a Tooth · Don't Wake the Croc!",
      poster: 'posters/croc.webp',
      steps: ['Answer a question right to earn a tooth press', 'Tap any shiny white crocodile tooth (+10 ⭐ if safe!)', 'Avoid the 1 secret sore tooth that makes Croc SNAP!']
    },
    cups: {
      id: 'cups', name: '3-House Cup Shuffle', icon: '🏠',
      sub: 'Follow the Shuffling Houses · Spot the Trophy',
      poster: 'posters/cups.webp',
      steps: ['Watch the Golden Trophy hide under one pastel cottage', 'Follow the 3 cottages as they shuffle!', 'Answer the question & tap the cottage hiding the trophy!']
    },
    tug: {
      id: 'tug', name: 'Tug of War', icon: '🪢',
      sub: 'Team Showdown · Correct Answers Pull the Rope',
      poster: 'posters/tug.webp',
      steps: ['Two teams face off on opposite ends of the rope', 'Answer right to yank the rope toward your side (+10 ⭐)', 'Pull the flag over your line to win the +30 ⭐ match bonus!']
    }
  };

  var qMatch = /[?&]game=([^&]+)/.exec(root.location.search);
  var rawG = qMatch ? qMatch[1] : '';
  if (rawG === 'bomb') { root.location.replace('../bomb3d/' + (root.location.search || '')); return; }
  if (rawG === 'keepgive') { root.location.replace('../bomb3d/?mode=keepgive'); return; }
  if (rawG === 'tug') { root.location.replace('../tug3d/' + (root.location.search || '')); return; }
  var ALLOWED_PRIZE = { croc: 1, cups: 1 };
  var GAME_ID = (rawG && ALLOWED_PRIZE[rawG] && GAMES[rawG]) ? rawG : 'croc';
  var META = GAMES[GAME_ID];

  var ART = 'assets/games/prize/';
  var MASCOTS = ['assets/games/mascots/bunny.webp', 'assets/games/mascots/kitty.webp', 'assets/games/mascots/bear.webp', 'assets/games/mascots/ducky.webp', 'assets/games/mascots/fox.webp', 'assets/games/mascots/frog.webp'];

  var S = {
    phase: 'setup',
    packId: Kit.param('set') || Kit.param('pack') || (Kit.questions && Kit.questions.current && Kit.questions.current()) || Kit.pref('pz_pack') || '',
    pack: null,
    mode: Kit.pref('pz_mode') || 'choice', // 'choice' | 'speak'
    teams: GAME_ID === 'tug' ? 2 : (+Kit.pref('teams') || 2),
    classId: Kit.pref('classId') || '',
    rounds: +(Kit.pref('pz_rounds') || 8),
    timerSec: +(Kit.pref('pz_timer') || 0),
    teamsData: [],
    turn: 0,
    round: 0,
    qIdx: 0,
    items: [],
    classStars: 0,
    busy: false
  };

  var ui = {};
  var timers = [];
  var cdInterval = 0;
  var popKeys = null;

  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() {
    clearInterval(cdInterval);
    timers.forEach(clearTimeout);
    timers = [];
    if (popKeys) { popKeys(); popKeys = null; }
  }

  Kit.topbar({
    home: '../index.html',
    homeLabel: 'Games',
    title: META.icon + ' ' + META.name,
    onEdit: function () {
      Kit.studio({ tab: 'questions' }, function () { if (S.phase === 'setup') setup(); });
    },
    editLabel: '✎ Edit questions'
  });

  function seg(opts, val, onPick) {
    var box = el('div', { class: 'seg' });
    opts.forEach(function (o) {
      box.appendChild(el('button', {
        type: 'button',
        class: 'chip' + (o[0] === val ? ' on' : ''),
        text: o[1],
        onclick: function () { Kit.sound('tap'); onPick(o[0]); }
      }));
    });
    return box;
  }

  /* ======================= SETUP SCREEN ======================= */
  function setup() {
    clearTimers();
    S.phase = 'setup';
    app.className = 'app';
    app.innerHTML = '';

    Kit.questions.all().then(function (packs) {
      if (!packs.length) return;
      var cur = packs.filter(function (p) { return p.id === S.packId; })[0] || packs[0];
      S.packId = cur.id;
      S.pack = cur;

      var hero = el('section', { class: 'hero' }, [
        el('div', { class: 'hero-poster' }, [
          el('img', {
            src: '../' + META.poster + '?v=1',
            alt: META.name,
            onerror: function (e) { e.target.src = Kit.src(ART + 'box_closed.webp'); }
          })
        ]),
        el('div', null, [
          el('h1', { text: META.icon + ' ' + META.name }),
          el('p', { text: META.sub }),
          el('div', { class: 'steps' }, META.steps.map(function (st, idx) {
            return el('span', { class: 'step' }, [el('b', { text: String(idx + 1) }), st]);
          }))
        ])
      ]);

      /* Left: Question Pack Picker + Answer Mode + Rounds */
      var left = el('section', { class: 'panel' }, [el('h2', { text: '📚 Question Pack' })]);
      // the shared question picker: the same choice as every other game (2D and 3D) on this computer
      var pHost = el('div', { class: 'qpick-host' });
      Kit.questions.picker(pHost, function (p) { S.packId = p.id; S.pack = p; Kit.pref('pz_pack', p.id); });
      left.appendChild(pHost);

      left.appendChild(el('div', { class: 'label', text: '🗣️ Question Style' }));
      left.appendChild(seg([['choice', '4-Choice (A/B/C/D + 🔊)'], ['speak', 'Speak Aloud → Teacher ✓']], S.mode, function (v) {
        S.mode = v; Kit.pref('pz_mode', v); setup();
      }));

      left.appendChild(el('div', { class: 'label', text: '🔄 Rounds' }));
      left.appendChild(seg([[6, '6 rounds'], [8, '8 rounds'], [12, '12 rounds'], [16, '16 rounds']], S.rounds, function (v) {
        S.rounds = +v; Kit.pref('pz_rounds', +v); setup();
      }));

      left.appendChild(el('div', { style: { marginTop: '12px' } }, [
        el('button', {
          type: 'button', class: 'btn lilac sm', text: '🎨 Open Studio (Paste Excel / CSV)',
          onclick: function () { Kit.sound('tap'); Kit.studio({ tab: 'questions' }, setup); }
        })
      ]));

      /* Right: Teams, Classroom & Timer */
      var right = el('section', { class: 'panel' }, [el('h2', { text: '🐾 Teams & Rules' })]);
      if (GAME_ID === 'tug') {
        right.appendChild(el('div', { class: 'label', text: '🪢 2-Team Tug of War Showdown' }));
        S.teams = 2;
      } else {
        right.appendChild(seg([[2, '2 teams'], [3, '3 teams'], [4, '4 teams'], [5, '5'], [6, '6']], S.teams || 2, function (v) {
          S.teams = +v; Kit.pref('teams', +v); setup();
        }));
      }

      var clsNode = Kit.classroom && Kit.classroom.setupPanel ? Kit.classroom.setupPanel(S, setup) : null;
      if (clsNode) right.appendChild(clsNode);

      right.appendChild(el('div', { class: 'label', text: '⏱ Question Timer' }));
      right.appendChild(seg([[0, '∞ No timer'], [15, '15s'], [20, '20s'], [30, '30s']], S.timerSec, function (v) {
        S.timerSec = +v; Kit.pref('pz_timer', +v); setup();
      }));

      var mins = Math.max(5, Math.round(S.rounds * 0.9));
      var go = el('section', { class: 'go panel' }, [
        el('div', null, [
          el('b', { text: '⏱ About ' + mins + ' minutes' }),
          el('small', { class: 'muted', text: S.rounds + ' rounds · ' + S.teams + ' teams · ' + (S.mode === 'speak' ? 'Speak Aloud' : '4-Choice Quiz') })
        ]),
        el('button', {
          type: 'button', class: 'btn pink lg', text: '▶ Start ' + META.name + '!',
          onclick: function () { Kit.sound('reveal'); start(cur); }
        })
      ]);

      app.appendChild(hero);
      app.appendChild(el('div', { class: 'setup-cols' }, [left, el('div', { class: 'setup-side' }, [right, go])]));
      Kit.keys({ enter: function () { Kit.sound('reveal'); start(cur); } });
    });
  }

  /* ======================= PLAY SHELL & QUESTION ENGINE ======================= */
  function fit() {
    if (!ui.box) return;
    var r = ui.box.getBoundingClientRect(), ar = 16 / 10;
    var w = r.width, h = w / ar;
    if (h > r.height) { h = r.height; w = h * ar; }
    ui.stage.style.width = Math.floor(w) + 'px';
    ui.stage.style.height = Math.floor(h) + 'px';
  }
  root.addEventListener('resize', function () { if (S.phase !== 'setup') fit(); });

  function start(pack) {
    clearTimers();
    S.pack = pack;
    S.items = Kit.shuffle((pack.items || []).slice());
    S.qIdx = 0;
    S.round = 0;
    S.turn = 0;
    S.busy = false;
    S.teamsData = Kit.classroom && Kit.classroom.makeTeams
      ? Kit.classroom.makeTeams(S.teams || 2, S.classId)
      : Kit.makeTeams(S.teams || 2);

    buildShell();
    launchMode();
  }

  function buildShell() {
    app.innerHTML = '';
    app.className = 'app play-screen' + (Kit.preview ? ' preview' : '');

    ui.head = el('div', { class: 'play-head' });
    ui.count = el('div', { class: 'count-pill' });
    ui.teams = el('div', { class: 'team-bar' });
    ui.worth = el('div', { class: 'worth-pill' });
    ui.head.appendChild(ui.count);
    ui.head.appendChild(ui.teams);
    ui.head.appendChild(ui.worth);

    ui.box = el('div', { class: 'stage-box' });
    ui.stage = el('div', { class: 'stage' });
    ui.bg = el('img', { class: 'pz-bg', src: Kit.src(ART + 'bg_prize_arcade.webp'), alt: '' });
    ui.scrim = el('div', { class: 'pz-scrim' });
    ui.body = el('div', { class: 'pz-body' });

    ui.stage.appendChild(ui.bg);
    ui.stage.appendChild(ui.scrim);
    ui.stage.appendChild(ui.body);
    ui.box.appendChild(ui.stage);

    ui.ctrl = el('div', { class: 'controls' });
    ui.caption = el('div', { class: 'caption hidden' });

    app.appendChild(ui.head);
    app.appendChild(ui.box);
    app.appendChild(ui.ctrl);
    app.appendChild(ui.caption);

    fit();
    drawTeams();
    if (Kit.music && !Kit.preview) Kit.music.start('playful');

    Kit.keys({
      escape: function () {
        if (Kit.preview || S.phase === 'setup') return;
        Kit.modal({
          title: 'Leave ' + META.name + '?',
          body: '<p>Current scores will reset.</p>',
          buttons: [{ label: 'Keep playing', cls: 'soft', value: false }, { label: 'Setup', cls: 'peach', value: true }]
        }).then(function (ok) { if (ok) { clearTimers(); setup(); } });
      }
    });
  }

  function drawTeams() {
    Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    ui.count.innerHTML = '<span>Round</span><b>' + Math.min(S.round + 1, S.rounds) + ' / ' + S.rounds + '</b>';
  }

  function nextQuestionItem() {
    if (!S.items.length) return { q: 'Say an English sentence!', a: 'Great job!', d: ['Well done!', 'Try again!', 'Nice work!'] };
    var it = S.items[S.qIdx % S.items.length];
    S.qIdx++;
    return it;
  }

  function addTeamScore(teamIdx, delta, sayMsg) {
    var t = S.teamsData[teamIdx];
    if (!t) return;
    t.score = Math.max(0, t.score + delta);
    Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    if (delta > 0) {
      Kit.sound('correct');
      var c = Kit.centerOf(ui.body);
      Kit.confetti(c.x, c.y, Kit.preview ? 24 : 50);
    } else if (delta < 0) {
      Kit.sound('soft');
    }
    if (sayMsg) Kit.toast(sayMsg, 1500);
  }

  function nextTurn() {
    S.round++;
    if (S.round >= S.rounds) {
      return showFinale();
    }
    S.turn = (S.turn + 1) % S.teamsData.length;
    drawTeams();
  }

  function showQuestionCard(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var item = nextQuestionItem();
      var team = S.teamsData[S.turn];
      var resolved = false;
      clearInterval(cdInterval);
      if (popKeys) { popKeys(); popKeys = null; }

      var timerPill = el('span', { class: 'pz-qtimer' + (S.timerSec ? '' : ' hidden'), text: '⏱ ' + S.timerSec + 's' });
      var card = el('div', { class: 'pz-qcard' }, [
        el('div', { class: 'pz-qtop' }, [
          el('span', { class: 'pz-qbadge', text: team.emoji + ' ' + team.name + ' · ' + (opts.title || 'Answer to win your turn!') }),
          el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
            timerPill,
            el('button', { type: 'button', class: 'icon-btn', text: '🔊', title: 'Read aloud', onclick: function () { Kit.say(item.q); } })
          ])
        ]),
        el('div', { class: 'pz-qprompt', text: item.q })
      ]);

      function done(ok) {
        if (resolved) return;
        resolved = true;
        clearInterval(cdInterval);
        if (popKeys) { popKeys(); popKeys = null; }
        card.remove();
        resolve(ok);
      }

      if (S.mode === 'speak') {
        card.appendChild(el('div', { class: 'kg-btns' }, [
          el('button', { type: 'button', class: 'btn mint lg', text: '✓ Great Answer!', onclick: function () { Kit.sound('pop'); done(true); } }),
          el('button', { type: 'button', class: 'btn soft', text: 'Skip →', onclick: function () { Kit.sound('tap'); done(false); } })
        ]));
      } else {
        var ans = String(item.a || 'Yes!');
        var wrongs = (item.d || ['Option B', 'Option C', 'Option D']).filter(function (x) { return x !== ans; }).slice(0, 3);
        while (wrongs.length < 3) wrongs.push(['Try again', 'Maybe', 'Not sure'][wrongs.length]);
        var choices = Kit.shuffle([ans].concat(wrongs));
        var grid = el('div', { class: 'pz-qchoices' });
        var btns = [];
        choices.forEach(function (ch, idx) {
          var b = el('button', {
            type: 'button', class: 'pz-choice',
            onclick: function () {
              if (resolved) return;
              if (ch === ans) {
                b.classList.add('right');
                Kit.sound('correct');
                Kit.say(ans);
                later(function () { done(true); }, 500);
              } else {
                b.classList.add('wrong');
                b.disabled = true;
                Kit.sound('soft');
                Kit.toast('Almost! Try another or pass turn!', 1200);
              }
            }
          }, [
            el('span', { class: 'c-key', text: ['A', 'B', 'C', 'D'][idx] }),
            el('span', { class: 'c-txt', text: ch }),
            el('span', {
              class: 'c-spk', text: '🔊', title: 'Hear choice',
              onclick: function (ev) { ev.stopPropagation(); Kit.say(ch); }
            })
          ]);
          btns.push(b);
          grid.appendChild(b);
        });
        card.appendChild(grid);
        card.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: 'Pass Turn →', onclick: function () { done(false); } }));

        popKeys = Kit.overlayKeys({
          1: function () { if (btns[0]) btns[0].click(); },
          2: function () { if (btns[1]) btns[1].click(); },
          3: function () { if (btns[2]) btns[2].click(); },
          4: function () { if (btns[3]) btns[3].click(); }
        });
      }

      ui.body.innerHTML = '';
      ui.body.appendChild(card);
      Kit.say(item.q);

      if (S.timerSec > 0 && !Kit.preview) {
        var left = S.timerSec;
        cdInterval = setInterval(function () {
          left--;
          timerPill.textContent = '⏱ ' + left + 's';
          if (left <= 0) done(false);
        }, 1000);
      }
    });
  }

  function caption(i, text) {
    if (!Kit.preview) return;
    ui.caption.classList.remove('hidden');
    ui.caption.innerHTML = '<b>' + i + '</b> ' + Kit.esc(text);
  }

  /* ======================= LAUNCH SELECTED GAME ======================= */
  function launchMode() {
    S.phase = 'play';
    ui.worth.innerHTML = '<span>Goal</span><b>' + META.icon + '</b>';
    if (GAME_ID === 'bomb') runBombOrBonus();
    else if (GAME_ID === 'claw') runClawPrize();
    else if (GAME_ID === 'keepgive') runKeepOrGive();
    else if (GAME_ID === 'croc') runCrocSnap();
    else if (GAME_ID === 'cups') runCupsShuffle();
    else runTugOfWar();
  }

  /* ----------------------- 1. BOMB OR BONUS ----------------------- */
  function runBombOrBonus() {
    var totalBoxes = 12;
    var prizes = Kit.shuffle([
      { kind: 'pts', val: 15, label: '+15 ⭐', img: 'trophy_cup.webp' },
      { kind: 'pts', val: 20, label: '+20 ⭐', img: 'trophy_cup.webp' },
      { kind: 'pts', val: 25, label: '+25 ⭐', img: 'box_open.webp' },
      { kind: 'pts', val: 35, label: '+35 ⭐', img: 'box_open.webp' },
      { kind: 'pts', val: 50, label: '+50 👑', img: 'trophy_cup.webp' },
      { kind: 'pts', val: 15, label: '+15 ⭐', img: 'box_open.webp' },
      { kind: 'pts', val: 20, label: '+20 ⭐', img: 'box_open.webp' },
      { kind: 'double', val: 0, label: '2× DOUBLE!', img: 'trophy_cup.webp' },
      { kind: 'bomb', val: -10, label: '💣 POOF -10!', img: 'bomb.webp' },
      { kind: 'bomb', val: -15, label: '💣 SILLY BOOM!', img: 'bomb.webp' },
      { kind: 'swap', val: 0, label: '🔄 SWAP SCORE!', img: 'box_open.webp' },
      { kind: 'pts', val: 30, label: '+30 ⭐', img: 'box_open.webp' }
    ]);
    var boxes = prizes.map(function (p, i) { return { i: i, prize: p, opened: false }; });

    function drawBoard() {
      if (S.round >= S.rounds || boxes.every(function (b) { return b.opened; })) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: team.emoji + ' ' + team.name + ' — Pick a Mystery Box!' }));
      var grid = el('div', { class: 'bomb-grid' });
      boxes.forEach(function (bx, idx) {
        var btn = el('button', {
          type: 'button',
          class: 'mbox' + (bx.opened ? ' opened' : ''),
          style: { '--hue': ((idx * 42) % 360) + 'deg', '--d': (-(idx % 5) * 0.4) + 's' },
          disabled: bx.opened ? true : null,
          onclick: function () { pickBox(bx); }
        });
        if (bx.opened) {
          btn.appendChild(el('span', { class: 'mres', text: bx.prize.label }));
        } else {
          btn.appendChild(el('img', { src: Kit.src(ART + 'box_closed.webp'), alt: 'Box ' + (idx + 1) }));
          btn.appendChild(el('span', { class: 'mnum', text: String(idx + 1) }));
        }
        grid.appendChild(btn);
      });
      ui.body.appendChild(grid);
    }

    function pickBox(bx) {
      if (S.busy || bx.opened) return;
      S.busy = true;
      Kit.sound('pop');

      var afterQuestion = function (ok) {
        if (!ok) {
          S.busy = false;
          nextTurn();
          if (S.phase === 'play') drawBoard();
          return;
        }
        bx.opened = true;
        var overlay = el('div', { class: 'burst-stage' }, [
          el('img', { class: 'burst-box', src: Kit.src(ART + 'box_closed.webp'), alt: '' }),
          el('div', { class: 'pz-banner', text: '🥁 Drumroll… What is inside?' })
        ]);
        ui.stage.appendChild(overlay);
        Kit.sound('drum');

        later(function () {
          var p = bx.prize;
          var team = S.teamsData[S.turn];
          if (p.kind === 'pts') addTeamScore(S.turn, p.val, team.name + ' wins ' + p.label);
          else if (p.kind === 'double') addTeamScore(S.turn, Math.max(15, team.score), team.name + ' DOUBLED!');
          else if (p.kind === 'bomb') addTeamScore(S.turn, p.val, '💣 Silly Sparkle Bomb! ' + p.val);
          else if (p.kind === 'swap' && S.teamsData.length > 1) {
            var other = (S.turn + 1) % S.teamsData.length;
            var tmp = team.score; team.score = S.teamsData[other].score; S.teamsData[other].score = tmp;
            Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
            Kit.sound('reveal');
          }

          overlay.innerHTML = '';
          overlay.appendChild(el('div', { class: 'burst-res' }, [
            el('img', { src: Kit.src(ART + p.img), alt: '' }),
            el('b', { text: p.label })
          ]));
          later(function () {
            overlay.remove();
            S.busy = false;
            nextTurn();
            if (S.phase === 'play') drawBoard();
          }, 1250);
        }, 900);
      };

      if (Kit.preview) afterQuestion(true);
      else showQuestionCard({ title: 'Box #' + (bx.i + 1) }).then(afterQuestion);
    }

    drawBoard();
    if (Kit.preview) {
      caption(1, 'Pick a mystery box!');
      later(function () { pickBox(boxes[4]); }, 900);
      later(function () { caption(2, 'Bonus Stars or Silly Bomb!'); }, 2100);
      later(function () { caption(3, 'Play 4-choice or Speak Aloud!'); if (!boxes[8].opened) pickBox(boxes[8]); }, 3800);
    }
  }

  /* ----------------------- 2. CLAW PRIZE ----------------------- */
  function runClawPrize() {
    var plushList = [
      { img: 'assets/games/mascots/bunny.webp', pts: 15, name: 'Bunny' },
      { img: 'assets/games/mascots/kitty.webp', pts: 20, name: 'Kitty' },
      { img: ART + 'claw_plush.webp', pts: 30, name: 'Star Plush' },
      { img: ART + 'trophy_cup.webp', pts: 40, name: 'Gold Cup' },
      { img: 'assets/games/mascots/ducky.webp', pts: 25, name: 'Ducky' }
    ];
    var selCol = 2;

    function drawClaw() {
      if (S.round >= S.rounds) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: team.emoji + ' ' + team.name + ' — Answer & Drop the Claw!' }));

      var cab = el('div', { class: 'claw-cab' }, [el('div', { class: 'claw-rail' })]);
      var arm = el('div', { class: 'claw-arm', style: { left: (12 + selCol * 19) + '%' } }, [
        el('div', { class: 'claw-cable' }),
        el('div', { class: 'claw-head', text: '🪝' })
      ]);
      cab.appendChild(arm);

      var row = el('div', { class: 'claw-plushies' });
      var slotEls = [];
      plushList.forEach(function (pl, idx) {
        var sl = el('button', {
          type: 'button',
          class: 'plush-slot' + (idx === selCol ? ' sel' : ''),
          onclick: function () {
            if (S.busy) return;
            selCol = idx;
            arm.style.left = (12 + selCol * 19) + '%';
            slotEls.forEach(function (s, i) { s.classList.toggle('sel', i === selCol); });
            Kit.sound('tap');
          }
        }, [
          el('img', { src: Kit.src(pl.img), alt: pl.name }),
          el('span', { text: '+' + pl.pts + ' ⭐' })
        ]);
        slotEls.push(sl);
        row.appendChild(sl);
      });
      cab.appendChild(row);
      ui.body.appendChild(cab);

      var dropBtn = el('button', {
        type: 'button', class: 'btn pink lg', text: '⬇ Answer & Drop Claw!',
        onclick: function () { triggerClaw(arm, slotEls); }
      });
      ui.body.appendChild(dropBtn);
    }

    function triggerClaw(arm, slotEls) {
      if (S.busy) return;
      S.busy = true;
      var runDrop = function (ok) {
        if (!ok) {
          S.busy = false; nextTurn(); if (S.phase === 'play') drawClaw(); return;
        }
        drawClaw();
        var freshArm = ui.body.querySelector('.claw-arm');
        var freshSlots = ui.body.querySelectorAll('.plush-slot');
        var cable = freshArm.querySelector('.claw-cable');
        Kit.sound('pop');
        later(function () { cable.style.height = '180px'; }, 80);
        later(function () {
          var chosen = plushList[selCol];
          if (freshSlots[selCol]) freshSlots[selCol].classList.add('grabbed');
          cable.style.height = '42px';
          addTeamScore(S.turn, chosen.pts, '🧸 Grabbed ' + chosen.name + ' +' + chosen.pts + ' ⭐!');
        }, 640);
        later(function () {
          S.busy = false;
          nextTurn();
          if (S.phase === 'play') drawClaw();
        }, 1600);
      };

      if (Kit.preview) runDrop(true);
      else showQuestionCard({ title: 'Power the Claw!' }).then(runDrop);
    }

    drawClaw();
    if (Kit.preview) {
      caption(1, 'Aim the pastel arcade claw!');
      later(function () {
        selCol = 3;
        var a = ui.body.querySelector('.claw-arm'); if (a) a.style.left = (12 + 3 * 19) + '%';
        caption(2, 'Drop the claw to grab a plushie!');
        triggerClaw(a, ui.body.querySelectorAll('.plush-slot'));
      }, 1100);
      later(function () { caption(3, 'Win +10 to +40 Stars for your team!'); }, 3100);
    }
  }

  /* ----------------------- 3. KEEP IT OR GIVE IT ----------------------- */
  function runKeepOrGive() {
    var gifts = [
      { label: '+25 ⭐ Golden Gift!', val: 25, img: 'box_open.webp' },
      { label: '+40 ⭐ Royal Trophy!', val: 40, img: 'trophy_cup.webp' },
      { label: '💣 Silly Bomb (-15 ⭐)!', val: -15, img: 'bomb.webp' },
      { label: '+15 ⭐ Star Box!', val: 15, img: 'box_open.webp' },
      { label: '💣 Cheeky Bomb (-10 ⭐)!', val: -10, img: 'bomb.webp' }
    ];

    function drawStage() {
      if (S.round >= S.rounds) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: team.emoji + ' ' + team.name + ' — Win the Box, then Keep or Give!' }));
      var card = el('div', { class: 'kg-box-card' }, [
        el('img', { src: Kit.src(ART + 'box_closed.webp'), alt: 'Mystery Gift' }),
        el('div', { style: { fontWeight: '900', fontSize: '1.15em', color: 'var(--plum)', margin: '8px 0 12px' }, text: 'Answer right to peek inside!' }),
        el('button', { type: 'button', class: 'btn pink lg', text: '🎁 Answer & Peek Inside!', onclick: openGiftFlow })
      ]);
      ui.body.appendChild(card);
    }

    function openGiftFlow() {
      if (S.busy) return;
      S.busy = true;
      var onAns = function (ok) {
        if (!ok) { S.busy = false; nextTurn(); if (S.phase === 'play') drawStage(); return; }
        var gift = gifts[Math.floor(Math.random() * gifts.length)];
        var team = S.teamsData[S.turn];
        var rivalIdx = (S.turn + 1) % S.teamsData.length;
        var rival = S.teamsData[rivalIdx];

        ui.body.innerHTML = '';
        ui.body.appendChild(el('div', { class: 'pz-banner', text: '👀 Only ' + team.name + ' decides: KEEP IT or GIVE IT?' }));
        var peekCard = el('div', { class: 'kg-box-card' }, [
          el('img', { src: Kit.src(ART + gift.img), alt: '' }),
          el('div', { style: { fontWeight: '900', fontSize: '1.5em', color: 'var(--plum)', margin: '8px 0 14px' }, text: gift.label }),
          el('div', { class: 'kg-btns' }, [
            el('button', {
              type: 'button', class: 'btn mint lg', text: '🎁 KEEP IT!',
              onclick: function () { finishDecision(S.turn, gift, team.name + ' kept it!'); }
            }),
            el('button', {
              type: 'button', class: 'btn peach lg', text: '😈 GIVE IT TO ' + rival.name + '!',
              onclick: function () { finishDecision(rivalIdx, gift, team.name + ' gave it to ' + rival.name + '!'); }
            })
          ])
        ]);
        ui.body.appendChild(peekCard);
        Kit.sound('reveal');
      };

      if (Kit.preview) onAns(true);
      else showQuestionCard({ title: 'Unlock the Mystery Gift!' }).then(onAns);
    }

    function finishDecision(targetIdx, gift, msg) {
      addTeamScore(targetIdx, gift.val, msg);
      later(function () { S.busy = false; nextTurn(); if (S.phase === 'play') drawStage(); }, 1200);
    }

    drawStage();
    if (Kit.preview) {
      caption(1, 'Answer to peek inside the gift!');
      later(openGiftFlow, 1000);
      later(function () {
        caption(2, 'Keep the +Stars or give the Bomb away!');
        var btn = ui.body.querySelector('.kg-btns .btn');
        if (btn) btn.click();
      }, 2800);
    }
  }

  /* ----------------------- 4. CROCODILE SNAP ----------------------- */
  function runCrocSnap() {
    var soreTooth = Math.floor(Math.random() * 10);
    var pressed = [];

    function drawCroc(snapped) {
      if (S.round >= S.rounds) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: snapped ? '🐊 CHOMP! Fresh Croc next round!' : (team.emoji + ' ' + team.name + ' — Answer & Press a Croc Tooth!') }));

      var arena = el('div', { class: 'croc-arena' + (snapped ? ' snapped' : '') }, [
        el('img', { class: 'croc-pic', src: Kit.src(ART + 'crocodile.webp'), alt: 'Crocodile' })
      ]);
      var teeth = el('div', { class: 'croc-teeth' });
      for (var i = 0; i < 10; i++) {
        (function (tIdx) {
          var isDown = pressed.indexOf(tIdx) >= 0;
          teeth.appendChild(el('button', {
            type: 'button',
            class: 'tooth-btn' + (isDown ? (tIdx === soreTooth ? ' snap' : ' safe') : ''),
            text: isDown ? (tIdx === soreTooth ? '💥' : '✓') : String(tIdx + 1),
            disabled: isDown || snapped ? true : null,
            onclick: function () { pressTooth(tIdx); }
          }));
        })(i);
      }
      arena.appendChild(teeth);
      ui.body.appendChild(arena);
    }

    function pressTooth(tIdx) {
      if (S.busy || pressed.indexOf(tIdx) >= 0) return;
      S.busy = true;
      var afterAns = function (ok) {
        if (!ok) { S.busy = false; nextTurn(); if (S.phase === 'play') drawCroc(false); return; }
        pressed.push(tIdx);
        if (tIdx === soreTooth) {
          Kit.sound('crack');
          drawCroc(true);
          Kit.toast('🐊 SNAP! Croc woke up! (0 pts)', 1400);
          later(function () {
            soreTooth = Math.floor(Math.random() * 10);
            pressed = [];
            S.busy = false;
            nextTurn();
            if (S.phase === 'play') drawCroc(false);
          }, 1450);
        } else {
          addTeamScore(S.turn, 10, '🦷 Safe tooth! +10 ⭐');
          drawCroc(false);
          later(function () {
            S.busy = false;
            nextTurn();
            if (S.phase === 'play') drawCroc(false);
          }, 1100);
        }
      };

      if (Kit.preview) afterAns(true);
      else showQuestionCard({ title: 'Press Tooth #' + (tIdx + 1) }).then(afterAns);
    }

    drawCroc(false);
    if (Kit.preview) {
      caption(1, 'Pick a shiny crocodile tooth!');
      later(function () { pressTooth((soreTooth + 2) % 10); }, 1000);
      later(function () { caption(2, 'Safe teeth score +10 Stars!'); pressTooth(soreTooth); }, 2700);
      later(function () { caption(3, "Watch out — don't wake the Croc!"); }, 3400);
    }
  }

  /* ----------------------- 5. 3-HOUSE CUP SHUFFLE ----------------------- */
  function runCupsShuffle() {
    var trophyUnder = Math.floor(Math.random() * 3);
    var slots = [0, 1, 2]; // visual left->right position of house 0, 1, 2
    var hues = ['0deg', '145deg', '52deg'];

    function drawHouses(liftedIdx, canPick) {
      if (S.round >= S.rounds) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: canPick ? (team.emoji + ' ' + team.name + ' — Which house hides the Trophy?') : '👀 Watch carefully!' }));

      var row = el('div', { class: 'cups-row' });
      [0, 1, 2].forEach(function (hIdx) {
        var posIdx = slots[hIdx];
        var isLift = liftedIdx === hIdx;
        var hasTrophy = hIdx === trophyUnder;
        var btn = el('button', {
          type: 'button',
          class: 'cup-slot' + (isLift ? ' lifted' : '') + (isLift && hasTrophy ? ' show-trophy' : ''),
          style: { left: (10 + posIdx * 32) + '%', '--hue': hues[hIdx] },
          onclick: function () { if (canPick && !S.busy) pickHouse(hIdx); }
        }, [
          el('img', { class: 'cup-trophy', src: Kit.src(ART + 'trophy_cup.webp'), alt: '' }),
          el('img', { class: 'house', src: Kit.src(ART + 'house.webp'), alt: 'House ' + (hIdx + 1) }),
          el('span', { class: 'cup-lbl', text: 'House ' + (posIdx + 1) })
        ]);
        row.appendChild(btn);
      });
      ui.body.appendChild(row);
    }

    function startShuffleRound() {
      S.busy = true;
      trophyUnder = Math.floor(Math.random() * 3);
      slots = [0, 1, 2];
      drawHouses(trophyUnder, false);
      Kit.sound('reveal');

      later(function () { drawHouses(-1, false); }, 950);
      var swaps = 5;
      for (var k = 0; k < swaps; k++) {
        (function (step) {
          later(function () {
            var a = step % 3, b = (step + 1 + Math.floor(Math.random() * 2)) % 3;
            var tmp = slots[a]; slots[a] = slots[b]; slots[b] = tmp;
            Kit.sound('pop');
            drawHouses(-1, false);
          }, 1450 + step * 480);
        })(k);
      }
      later(function () {
        S.busy = false;
        drawHouses(-1, true);
        if (Kit.preview) {
          caption(2, 'Follow the shuffling pastel cottages!');
          later(function () { pickHouse(trophyUnder); }, 900);
        }
      }, 1450 + swaps * 480 + 250);
    }

    function pickHouse(hIdx) {
      if (S.busy) return;
      S.busy = true;
      var afterAns = function (ok) {
        if (!ok) { S.busy = false; nextTurn(); if (S.phase === 'play') startShuffleRound(); return; }
        drawHouses(hIdx, false);
        if (hIdx === trophyUnder) {
          addTeamScore(S.turn, 25, '🏆 Found the Golden Trophy! +25 ⭐');
        } else {
          later(function () { drawHouses(trophyUnder, false); }, 550);
          addTeamScore(S.turn, 10, 'Nice try! +10 ⭐');
        }
        later(function () {
          nextTurn();
          if (S.phase === 'play') startShuffleRound();
        }, 1600);
      };

      if (Kit.preview) afterAns(true);
      else showQuestionCard({ title: 'Spot the Trophy!' }).then(afterAns);
    }

    if (Kit.preview) caption(1, 'Remember where the Trophy hides!');
    startShuffleRound();
  }

  /* ----------------------- 6. TUG OF WAR ----------------------- */
  function runTugOfWar() {
    var tugPos = 0; // -3 (Left wins) .. +3 (Right wins)

    function drawTug() {
      if (S.round >= S.rounds) return showFinale();
      var team = S.teamsData[S.turn];
      var t0 = S.teamsData[0], t1 = S.teamsData[1] || S.teamsData[0];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'pz-banner', text: team.emoji + ' ' + team.name + "'s Pull! Answer right to yank the rope!" }));

      var arena = el('div', { class: 'tug-arena' }, [
        el('div', { class: 'tug-track' }, [
          el('div', { class: 'tug-rig', style: { transform: 'translateX(' + (tugPos * 36) + 'px)' } }, [
            el('img', { class: 'tug-mascot', src: Kit.src(t0.mascotImg || MASCOTS[0]), alt: t0.name }),
            el('div', { class: 'tug-rope' }),
            el('span', { class: 'tug-flag', text: '🎀' }),
            el('img', { class: 'tug-mascot', src: Kit.src(t1.mascotImg || MASCOTS[1]), alt: t1.name })
          ])
        ]),
        el('button', { type: 'button', class: 'btn pink lg', text: '🪢 Answer & Pull!', onclick: pullTurn })
      ]);
      ui.body.appendChild(arena);
    }

    function pullTurn() {
      if (S.busy) return;
      S.busy = true;
      var onAns = function (ok) {
        if (ok) {
          tugPos += (S.turn === 0 ? -1 : 1);
          addTeamScore(S.turn, 10, '💪 Strong pull! +10 ⭐');
          if (Math.abs(tugPos) >= 3) {
            addTeamScore(S.turn, 30, '🏆 ' + S.teamsData[S.turn].name + ' pulled over the line! +30 ⭐');
            tugPos = 0;
          }
        } else {
          Kit.sound('soft');
        }
        drawTug();
        later(function () {
          S.busy = false;
          nextTurn();
          if (S.phase === 'play') drawTug();
        }, 1050);
      };

      if (Kit.preview) onAns(true);
      else showQuestionCard({ title: 'Pull for ' + S.teamsData[S.turn].name + '!' }).then(onAns);
    }

    drawTug();
    if (Kit.preview) {
      caption(1, 'Teams tug across the arena!');
      later(pullTurn, 900);
      later(function () { caption(2, 'Right answers yank the flag!'); pullTurn(); }, 2600);
    }
  }

  /* ----------------------- FINALE PODIUM + CLASS BOARD XP ----------------------- */
  function showFinale() {
    clearTimers();
    S.phase = 'end';
    ui.body.innerHTML = '';
    var ranked = S.teamsData.map(function (t) { return t; }).sort(function (a, b) { return b.score - a.score; });
    var top = ranked[0] ? ranked[0].score : 0;

    var pod = el('div', { class: 'podium' });
    ranked.forEach(function (t, k) {
      var hgt = top ? 30 + 66 * (t.score / top) : 34;
      pod.appendChild(el('div', { class: 'pod', style: { '--tc': t.color, '--h': hgt + '%' } }, [
        t.mascotImg ? el('img', { src: Kit.src(t.mascotImg), alt: '' }) : el('span', { text: t.emoji }),
        el('div', { class: 'pod-bar' }, [el('b', { text: String(t.score) })]),
        el('span', { text: (k === 0 ? '👑 ' : '') + t.name })
      ]));
    });

    var mainCol = el('div', { class: 'finale-main' }, [
      el('h2', { text: '🏆 ' + (ranked[0] ? ranked[0].name + ' Wins ' + META.name + '!' : 'Great Game!') }),
      pod
    ]);

    var card = el('div', { class: 'finale-card' }, [mainCol]);
    var xpPanel = (!Kit.preview && Kit.classroom && Kit.classroom.podiumPanel)
      ? Kit.classroom.podiumPanel({
          classId: S.classId,
          teams: S.teamsData,
          gameId: 'prize-' + GAME_ID,
          gameTitle: META.name,
          icon: META.icon
        })
      : null;
    if (xpPanel) card.appendChild(xpPanel);

    ui.stage.appendChild(card);
    Kit.sound('fanfare');
    Kit.confetti(null, null, Kit.preview ? 30 : 120);

    ui.ctrl.innerHTML = '';
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn mint lg', text: '↺ Play Again', onclick: function () { card.remove(); start(S.pack); } }));
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn soft', text: '⚙ Setup', onclick: setup }));
    ui.ctrl.appendChild(el('button', { type: 'button', class: 'btn soft', text: '✦ All games', onclick: function () { root.location.href = '../index.html'; } }));
  }

  /* ======================= BOOT ======================= */
  if (Kit.preview) {
    doc.body.classList.add('preview');
    Kit.questions.all().then(function (packs) {
      start(packs[0] || { id: 'demo', name: 'Demo', items: [] });
    });
  } else {
    setup();
  }
})(window);
