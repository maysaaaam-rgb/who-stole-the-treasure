/* Games Collection — Word Arcade Family (6 Games)
   meteor | mochi | bubbles | builder | pairs | bingo */
(function (root) {
  'use strict';

  var Kit = root.Kit;
  var el = Kit.el;
  var doc = root.document;
  var app = doc.getElementById('app');

  var GAMES = {
    meteor: {
      id: 'meteor', name: 'Meteor Spelling', icon: '☄️',
      sub: 'Tap Missing Letters · Rocket Blasts the Meteors!',
      poster: 'posters/meteor.webp',
      bg: 'assets/games/reveal/bg_night_rooftops.webp',
      steps: ['Look at the picture & word with missing letters', 'Tap the missing letter meteors in order', 'Watch the rocket blast & finish the word (+10 ⭐)!']
    },
    mochi: {
      id: 'mochi', name: 'Mochi Word Merge', icon: '🍡',
      sub: 'Match Pictures & Words · Merge the Sweet Mochi!',
      poster: 'posters/mochi.webp',
      bg: 'assets/games/prize/bg_prize_arcade.webp',
      steps: ['Pick a sweet picture mochi tile', 'Match it with its spoken word mochi tile', 'Merge all pairs for sweet bonus stars!']
    },
    bubbles: {
      id: 'bubbles', name: 'Bubble Word Garden', icon: '🫧',
      sub: 'Look at the Picture · Pop Floating Letters in Order!',
      poster: 'posters/bubbles.webp',
      bg: 'assets/games/reveal/bg_sunny_courtyard.webp',
      steps: ['See the picture & listen to the word', 'Pop the floating pastel letter bubbles in spelling order', 'Spell the whole word to bloom (+10 ⭐)!']
    },
    builder: {
      id: 'builder', name: 'Sentence Builder', icon: '🧱',
      sub: 'Snap Scrambled Words into the Right Sentence!',
      poster: 'posters/builder.webp',
      bg: 'assets/games/time-train/bg_past_gate.webp',
      steps: ['Read or listen to the picture clue', 'Tap scrambled word blocks in the right order', 'Snap the full sentence & read it aloud (+10 ⭐)!']
    },
    pairs: {
      id: 'pairs', name: 'Matching Pairs', icon: '🃏',
      sub: 'Flip Cards · Match Words, Pictures & Spoken Audio!',
      poster: 'posters/pairs.webp',
      bg: 'assets/games/scene/bg_cozy_room.webp',
      steps: ['Flip two cards on the pastel board', 'Match each picture card with its partner word card', 'Clear the board to win!']
    },
    bingo: {
      id: 'bingo', name: 'Picture Bingo', icon: '🔢',
      sub: 'Listen to the Caller · Stamp Your 3×3 Board · BINGO!',
      poster: 'posters/bingo.webp',
      bg: 'assets/games/reveal/bg_sunny_courtyard.webp',
      steps: ['Listen to the spoken Picture Caller clue', 'Tap & stamp the matching picture on your 3×3 grid', 'Complete a line of 3 stars for BINGO (+25 ⭐)!']
    }
  };

  var qMatch = /[?&]game=([^&]+)/.exec(root.location.search);
  var GAME_ID = (qMatch && GAMES[qMatch[1]]) ? qMatch[1] : 'meteor';
  var META = GAMES[GAME_ID];

  var S = {
    phase: 'setup',
    packId: Kit.param('set') || Kit.param('pack') || Kit.pref('wd_pack') || '',
    pack: null,
    teams: +(Kit.pref('teams') || 2),
    classId: Kit.param('class') || (Kit.classroom ? Kit.classroom.defaultClassId() : '') || Kit.pref('classId') || '',
    rounds: +(Kit.pref('wd_rounds') || 8),
    teamsData: [],
    turn: 0,
    round: 0,
    classStars: 0,
    busy: false
  };

  var ui = {};
  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  Kit.topbar({
    home: '../index.html',
    homeLabel: 'Games',
    title: META.icon + ' ' + META.name,
    onEdit: function () {
      Kit.studio({ tab: GAME_ID === 'builder' ? 'sentences' : 'pictures' }, function () { if (S.phase === 'setup') setup(); });
    },
    editLabel: GAME_ID === 'builder' ? '✎ Edit sentences' : '✎ Edit pictures'
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

  function loadAllPacks() {
    if (GAME_ID === 'builder' && Kit.sentences) {
      return Kit.sentences.all().then(function (sp) {
        return sp.map(function (p) {
          return {
            id: p.id, name: p.name, icon: p.e || '🧱', grade: p.grade,
            items: (p.items || []).map(function (it) {
              var fm = Kit.sentences.forms(it);
              return { w: fm ? fm.posPlain : (it.subj + ' ' + it.past + ' ' + it.rest), img: it.img, cl: it.pic };
            })
          };
        });
      });
    }
    return Kit.sets.all().then(function (sets) {
      return sets.map(function (s) {
        return {
          id: s.id, name: s.name, icon: s.e || '🖼️', grade: s.grade,
          items: (s.cards || s.items || []).filter(function (c) { return (c.w || c.word || '').length >= 2; })
        };
      });
    });
  }

  /* ======================= SETUP ======================= */
  function setup() {
    clearTimers();
    S.phase = 'setup';
    app.className = 'app';
    app.innerHTML = '';

    loadAllPacks().then(function (packs) {
      var cur = (Kit.matchPack ? Kit.matchPack(packs, S.packId) : packs.filter(function (p) { return p.id === S.packId; })[0]) || packs[0];
      S.packId = cur.id;
      S.pack = cur;

      var hero = el('section', { class: 'hero' }, [
        el('div', { class: 'hero-poster' }, [
          el('img', {
            src: '../' + META.poster + '?v=1',
            alt: META.name,
            onerror: function (e) { e.target.src = Kit.src('assets/games/mascots/bunny.webp'); }
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

      var left = el('section', { class: 'panel' }, [el('h2', { text: GAME_ID === 'builder' ? '🧱 Sentence Pack' : '🖼️ Word & Picture Pack' })]);
      var pGrid = el('div', { class: 'packs' });
      packs.forEach(function (p) {
        pGrid.appendChild(el('button', {
          type: 'button',
          class: 'pack' + (p.id === cur.id ? ' on' : ''),
          onclick: function () { Kit.sound('tap'); S.packId = p.id; Kit.pref('wd_pack', p.id); setup(); }
        }, [
          el('b', { text: (p.icon || '🔤') + ' ' + p.name }),
          el('small', { text: (p.items ? p.items.length : 0) + ' items' })
        ]));
      });
      left.appendChild(pGrid);

      left.appendChild(el('div', { class: 'label', text: '🔄 Rounds' }));
      left.appendChild(seg([[6, '6 rounds'], [8, '8 rounds'], [10, '10 rounds']], S.rounds, function (v) {
        S.rounds = +v; Kit.pref('wd_rounds', +v); setup();
      }));

      var right = el('section', { class: 'panel' }, [el('h2', { text: '🐾 Teams & Class' })]);
      right.appendChild(seg([[0, '🌟 Whole class'], [2, '2 teams'], [3, '3 teams'], [4, '4 teams']], S.teams, function (v) {
        S.teams = +v; Kit.pref('teams', +v); setup();
      }));
      var clsNode = Kit.classroom && Kit.classroom.setupPanel ? Kit.classroom.setupPanel(S, setup) : null;
      if (clsNode) right.appendChild(clsNode);

      var go = el('section', { class: 'go panel' }, [
        el('div', null, [
          el('b', { text: '⏱ About ' + Math.max(5, Math.round(S.rounds * 0.8)) + ' minutes' }),
          el('small', { class: 'muted', text: S.rounds + ' rounds · ' + (S.teams ? S.teams + ' teams' : 'Whole class') })
        ]),
        el('button', {
          type: 'button', class: 'btn pink lg', text: '▶ Play ' + META.name + '!',
          onclick: function () { Kit.sound('reveal'); start(cur); }
        })
      ]);

      app.appendChild(hero);
      app.appendChild(el('div', { class: 'setup-cols' }, [left, el('div', { class: 'setup-side' }, [right, go])]));
      Kit.keys({ enter: function () { Kit.sound('reveal'); start(cur); } });
    });
  }

  /* ======================= PLAY SHELL ======================= */
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
    S.phase = 'play';
    S.round = 0;
    S.turn = 0;
    S.classStars = 0;
    S.busy = false;
    S.teamsData = S.teams > 0
      ? (Kit.classroom && Kit.classroom.makeTeams ? Kit.classroom.makeTeams(S.teams, S.classId) : Kit.makeTeams(S.teams))
      : [];

    app.innerHTML = '';
    app.className = 'app play-screen' + (Kit.preview ? ' preview' : '');

    ui.head = el('div', { class: 'play-head' });
    ui.count = el('div', { class: 'count-pill' });
    ui.teams = el('div', { class: 'team-bar' });
    ui.worth = el('div', { class: 'worth-pill', html: '<span>Goal</span><b>' + META.icon + '</b>' });
    ui.head.appendChild(ui.count); ui.head.appendChild(ui.teams); ui.head.appendChild(ui.worth);

    ui.box = el('div', { class: 'stage-box' });
    ui.stage = el('div', { class: 'stage' });
    ui.bg = el('img', { class: 'wd-bg', src: Kit.src(META.bg), alt: '' });
    ui.body = el('div', { class: 'wd-body' });

    ui.stage.appendChild(ui.bg);
    ui.stage.appendChild(ui.body);
    ui.box.appendChild(ui.stage);

    ui.ctrl = el('div', { class: 'controls' });
    ui.caption = el('div', { class: 'caption hidden' });

    app.appendChild(ui.head); app.appendChild(ui.box); app.appendChild(ui.ctrl); app.appendChild(ui.caption);
    fit();
    drawTeams();

    if (GAME_ID === 'meteor') runMeteor();
    else if (GAME_ID === 'mochi') runMochiOrPairs(false);
    else if (GAME_ID === 'pairs') runMochiOrPairs(true);
    else if (GAME_ID === 'bubbles') runBubbles();
    else if (GAME_ID === 'builder') runBuilder();
    else runBingo();

    Kit.keys({
      space: function () { if (ui.speakCur) ui.speakCur(); },
      escape: function () {
        if (Kit.preview || S.phase === 'setup') return;
        Kit.modal({
          title: 'Leave ' + META.name + '?',
          body: '<p>Current progress will reset.</p>',
          buttons: [{ label: 'Keep playing', cls: 'soft', value: false }, { label: 'Setup', cls: 'peach', value: true }]
        }).then(function (ok) { if (ok) { clearTimers(); setup(); } });
      }
    });
  }

  function drawTeams() {
    if (S.teamsData.length) Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    else {
      ui.teams.innerHTML = '';
      ui.teams.appendChild(el('div', { class: 'class-stars', text: '⭐ ' + S.classStars + ' class stars' }));
    }
    ui.count.innerHTML = '<span>Round</span><b>' + Math.min(S.round + 1, S.rounds) + ' / ' + S.rounds + '</b>';
  }

  function awardTurn(pts) {
    if (S.teamsData.length) {
      S.teamsData[S.turn].score += pts;
      Kit.renderTeams(ui.teams, S.teamsData, { turn: S.turn });
    } else {
      S.classStars += pts;
      drawTeams();
    }
    Kit.sound('correct');
    var c = Kit.centerOf(ui.stage);
    Kit.confetti(c.x, c.y, Kit.preview ? 20 : 45);
  }

  function nextTurn(redraw) {
    S.round++;
    if (S.round >= S.rounds) return showFinale();
    if (S.teamsData.length) S.turn = (S.turn + 1) % S.teamsData.length;
    drawTeams();
    if (redraw) redraw();
  }

  function caption(i, text) {
    if (!Kit.preview) return;
    ui.caption.classList.remove('hidden');
    ui.caption.innerHTML = '<b>' + i + '</b> ' + Kit.esc(text);
  }

  function itemWord(it) { return String((it && (it.w || it.word || it.label)) || 'star'); }

  /* ----------------------- 1. METEOR SPELLING ----------------------- */
  function runMeteor() {
    var list = Kit.shuffle((S.pack.items || []).slice()).filter(function (it) { return /^[a-zA-Z]{3,10}$/.test(itemWord(it).trim()); });
    if (!list.length) list = (S.pack.items || []).slice();
    var idx = 0;

    function drawRound() {
      if (S.round >= S.rounds) return showFinale();
      S.busy = false;
      var it = list[idx % list.length]; idx++;
      var word = itemWord(it).trim().toLowerCase().replace(/[^a-z]/g, '') || 'star';
      var chars = word.split('');
      var missingIndices = [];
      for (var k = 1; k < chars.length; k += 2) {
        if (missingIndices.length < 3) missingIndices.push(k);
      }
      if (!missingIndices.length) missingIndices.push(0);

      var filled = {};
      var nextNeedIdx = 0;
      ui.speakCur = function () { Kit.say(word); };
      if (!Kit.preview) Kit.say(word);

      ui.body.innerHTML = '';
      var card = el('div', { class: 'wd-card' }, [
        el('div', { class: 'wd-banner', text: '☄️ Tap the missing letters to blast the meteors!' }),
        el('div', { class: 'wd-pic' }, [it.img ? el('img', { src: Kit.src(it.img), alt: '' }) : el('span', { text: '☄️', style: { fontSize: '2.2em' } })])
      ]);

      var slotsRow = el('div', { class: 'wd-slots' });
      var slotEls = chars.map(function (ch, cIdx) {
        var isMiss = missingIndices.indexOf(cIdx) >= 0;
        var s = el('div', { class: 'wd-slot' + (isMiss ? '' : ' filled'), text: isMiss ? '_' : ch.toUpperCase() });
        slotsRow.appendChild(s);
        return s;
      });
      card.appendChild(slotsRow);

      var neededLetters = missingIndices.map(function (mIdx) { return chars[mIdx]; });
      var decoys = ['a', 'e', 'i', 'o', 's', 't', 'r', 'n'].filter(function (l) { return neededLetters.indexOf(l) < 0; }).slice(0, 3);
      var bank = Kit.shuffle(neededLetters.concat(decoys));
      var chipRow = el('div', { class: 'wd-chips' });
      var chipEls = bank.map(function (ltr) {
        var b = el('button', {
          type: 'button', class: 'wd-chip', text: ltr.toUpperCase(),
          onclick: function () {
            if (S.busy || b.classList.contains('used')) return;
            var wantChar = chars[missingIndices[nextNeedIdx]];
            if (ltr === wantChar) {
              b.classList.add('used');
              slotEls[missingIndices[nextNeedIdx]].textContent = ltr.toUpperCase();
              slotEls[missingIndices[nextNeedIdx]].classList.add('filled');
              Kit.sound('pop');
              nextNeedIdx++;
              if (nextNeedIdx >= missingIndices.length) {
                S.busy = true;
                awardTurn(10);
                Kit.say(word);
                later(function () { nextTurn(drawRound); }, 1100);
              }
            } else {
              b.classList.add('wrong'); Kit.sound('soft');
              later(function () { b.classList.remove('wrong'); }, 360);
            }
          }
        });
        chipRow.appendChild(b);
        return b;
      });
      card.appendChild(chipRow);
      card.appendChild(el('button', { type: 'button', class: 'icon-btn', text: '🔊', onclick: ui.speakCur }));
      ui.body.appendChild(card);

      if (Kit.preview) {
        caption(1, 'Tap missing letters in order!');
        neededLetters.forEach(function (ltr, step) {
          later(function () {
            var match = chipEls.filter(function (ce) { return !ce.classList.contains('used') && ce.textContent === ltr.toUpperCase(); })[0];
            if (match) match.click();
          }, 750 + step * 550);
        });
      }
    }
    drawRound();
  }

  /* ----------------------- 2 & 5. MOCHI MERGE & MATCHING PAIRS ----------------------- */
  function runMochiOrPairs(isPairs) {
    var pool = Kit.shuffle((S.pack.items || []).slice()).slice(0, 6);
    var tiles = [];
    pool.forEach(function (it, pId) {
      var w = itemWord(it);
      tiles.push({ pairId: pId, kind: 'img', img: it.img, word: w, matched: false, faceUp: !isPairs });
      tiles.push({ pairId: pId, kind: 'word', img: null, word: w, matched: false, faceUp: !isPairs });
    });
    tiles = Kit.shuffle(tiles);
    var sel = [];

    function renderGrid() {
      if (tiles.every(function (t) { return t.matched; })) return showFinale();
      var team = S.teamsData[S.turn];
      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', {
        class: 'wd-banner',
        text: (team ? team.emoji + ' ' + team.name + ' · ' : '') + (isPairs ? '🃏 Flip 2 matching cards!' : '🍡 Merge matching picture + word mochi!')
      }));
      var grid = el('div', { class: 'mochi-grid' });
      tiles.forEach(function (t, i) {
        var showFront = t.matched || t.faceUp;
        var btn = el('button', {
          type: 'button',
          class: 'mochi-tile' + (t.matched ? ' matched' : '') + (sel.indexOf(i) >= 0 ? ' sel' : ''),
          onclick: function () {
            if (S.busy || t.matched || sel.indexOf(i) >= 0) return;
            t.faceUp = true;
            sel.push(i);
            Kit.sound('pop');
            if (t.kind === 'word') Kit.say(t.word);
            renderGrid();

            if (sel.length === 2) {
              S.busy = true;
              var a = tiles[sel[0]], b = tiles[sel[1]];
              if (a.pairId === b.pairId) {
                a.matched = b.matched = true;
                awardTurn(10);
                Kit.say(a.word);
                later(function () { sel = []; S.busy = false; S.round++; drawTeams(); renderGrid(); }, 750);
              } else {
                Kit.sound('soft');
                later(function () {
                  if (isPairs) { a.faceUp = false; b.faceUp = false; }
                  sel = []; S.busy = false;
                  if (S.teamsData.length) S.turn = (S.turn + 1) % S.teamsData.length;
                  drawTeams(); renderGrid();
                }, 900);
              }
            }
          }
        });
        if (!showFront) {
          btn.textContent = '⭐';
        } else if (t.kind === 'img' && t.img) {
          btn.appendChild(el('img', { src: Kit.src(t.img), alt: '' }));
        } else {
          btn.textContent = t.word;
        }
        grid.appendChild(btn);
      });
      ui.body.appendChild(grid);
    }

    renderGrid();
    if (Kit.preview) {
      caption(1, isPairs ? 'Flip matching picture + word cards!' : 'Merge picture & word mochi pairs!');
      later(function () {
        var firstIdx = 0;
        var secondIdx = tiles.findIndex(function (x, i) { return i !== firstIdx && x.pairId === tiles[firstIdx].pairId; });
        var bs = ui.body.querySelectorAll('.mochi-tile');
        if (bs[firstIdx]) bs[firstIdx].click();
        later(function () { if (bs[secondIdx]) bs[secondIdx].click(); }, 600);
      }, 900);
    }
  }

  /* ----------------------- 3. BUBBLE WORD GARDEN ----------------------- */
  function runBubbles() {
    var list = Kit.shuffle((S.pack.items || []).slice()).filter(function (it) { return /^[a-zA-Z]{3,9}$/.test(itemWord(it).trim()); });
    if (!list.length) list = (S.pack.items || []).slice();
    var idx = 0;

    function drawRound() {
      if (S.round >= S.rounds) return showFinale();
      S.busy = false;
      var it = list[idx % list.length]; idx++;
      var word = itemWord(it).trim().toLowerCase().replace(/[^a-z]/g, '') || 'sun';
      var letters = word.split('');
      var pos = 0;
      ui.speakCur = function () { Kit.say(word); };
      if (!Kit.preview) Kit.say(word);

      ui.body.innerHTML = '';
      var card = el('div', { class: 'wd-card' }, [
        el('div', { class: 'wd-banner', text: '🫧 Pop the floating letter bubbles in order!' }),
        el('div', { class: 'wd-pic' }, [it.img ? el('img', { src: Kit.src(it.img), alt: '' }) : el('span', { text: '🫧' })])
      ]);
      var slotsRow = el('div', { class: 'wd-slots' });
      var slotEls = letters.map(function () {
        var s = el('div', { class: 'wd-slot', text: '' });
        slotsRow.appendChild(s); return s;
      });
      card.appendChild(slotsRow);

      var scrambled = Kit.shuffle(letters.slice());
      var bubRow = el('div', { class: 'wd-chips' });
      var bubEls = scrambled.map(function (ch, i) {
        var b = el('button', {
          type: 'button', class: 'wd-chip bubble', text: ch.toUpperCase(),
          style: { '--d': (-(i % 4) * 0.4) + 's' },
          onclick: function () {
            if (S.busy || b.classList.contains('used')) return;
            if (ch === letters[pos]) {
              b.classList.add('used');
              slotEls[pos].textContent = ch.toUpperCase();
              slotEls[pos].classList.add('filled');
              Kit.sound('pop');
              pos++;
              if (pos >= letters.length) {
                S.busy = true;
                awardTurn(10);
                Kit.say(word);
                later(function () { nextTurn(drawRound); }, 1000);
              }
            } else {
              b.classList.add('wrong'); Kit.sound('soft');
              later(function () { b.classList.remove('wrong'); }, 360);
            }
          }
        });
        bubRow.appendChild(b); return b;
      });
      card.appendChild(bubRow);
      ui.body.appendChild(card);

      if (Kit.preview) {
        caption(1, 'Pop floating letter bubbles in spelling order!');
        letters.forEach(function (ch, step) {
          later(function () {
            var match = bubEls.filter(function (be) { return !be.classList.contains('used') && be.textContent === ch.toUpperCase(); })[0];
            if (match) match.click();
          }, 700 + step * 350);
        });
      }
    }
    drawRound();
  }

  /* ----------------------- 4. SENTENCE BUILDER ----------------------- */
  function runBuilder() {
    var list = Kit.shuffle((S.pack.items || []).slice());
    var idx = 0;

    function drawRound() {
      if (S.round >= S.rounds) return showFinale();
      S.busy = false;
      var it = list[idx % list.length]; idx++;
      var sent = String(it.w || 'Jannah opened the book.');
      var words = sent.replace(/[.?!]+$/, '').split(/\s+/).filter(Boolean);
      var pos = 0;
      ui.speakCur = function () { Kit.say(sent); };

      ui.body.innerHTML = '';
      var card = el('div', { class: 'wd-card' }, [
        el('div', { class: 'wd-banner', text: '🧱 Snap the word blocks in order!' }),
        el('div', { class: 'wd-pic' }, [it.img ? el('img', { src: Kit.src(it.img), alt: '' }) : el('span', { text: it.cl || '🧱', style: { fontSize: '2.2em' } })])
      ]);
      var slotsRow = el('div', { class: 'wd-slots' });
      var slotEls = words.map(function () {
        var s = el('div', { class: 'wd-slot word-slot', text: '___' });
        slotsRow.appendChild(s); return s;
      });
      card.appendChild(slotsRow);

      var scrambled = Kit.shuffle(words.slice());
      var chipRow = el('div', { class: 'wd-chips' });
      var chipEls = scrambled.map(function (w) {
        var b = el('button', {
          type: 'button', class: 'wd-chip', text: w,
          onclick: function () {
            if (S.busy || b.classList.contains('used')) return;
            if (w === words[pos]) {
              b.classList.add('used');
              slotEls[pos].textContent = w;
              slotEls[pos].classList.add('filled');
              Kit.sound('pop');
              pos++;
              if (pos >= words.length) {
                S.busy = true;
                awardTurn(10);
                Kit.say(sent);
                later(function () { nextTurn(drawRound); }, 1150);
              }
            } else {
              b.classList.add('wrong'); Kit.sound('soft');
              later(function () { b.classList.remove('wrong'); }, 360);
            }
          }
        });
        chipRow.appendChild(b); return b;
      });
      card.appendChild(chipRow);
      ui.body.appendChild(card);

      if (Kit.preview) {
        caption(1, 'Snap scrambled blocks into a sentence!');
        words.forEach(function (w, step) {
          later(function () {
            var match = chipEls.filter(function (ce) { return !ce.classList.contains('used') && ce.textContent === w; })[0];
            if (match) match.click();
          }, 600 + step * 350);
        });
      }
    }
    drawRound();
  }

  /* ----------------------- 6. PICTURE BINGO (3x3) ----------------------- */
  function runBingo() {
    var boardItems = Kit.shuffle((S.pack.items || []).slice()).slice(0, 9);
    var stamped = boardItems.map(function () { return false; });
    var callOrder = Kit.shuffle(boardItems.slice());
    var cIdx = 0;

    function hasBingo() {
      var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return lines.some(function (l) { return stamped[l[0]] && stamped[l[1]] && stamped[l[2]]; });
    }

    function drawBoard() {
      if (cIdx >= callOrder.length || hasBingo()) return showFinale();
      S.busy = false;
      var target = callOrder[cIdx];
      var tWord = itemWord(target);
      ui.speakCur = function () { Kit.say(tWord); };
      if (!Kit.preview) Kit.say(tWord);

      ui.body.innerHTML = '';
      ui.body.appendChild(el('div', { class: 'wd-banner' }, [
        el('span', { html: '🔢 Caller says: <b>' + Kit.esc(tWord) + '</b>' }),
        el('button', { type: 'button', class: 'icon-btn sm', text: '🔊', onclick: ui.speakCur })
      ]));
      var grid = el('div', { class: 'bingo-grid' });
      boardItems.forEach(function (it, i) {
        var w = itemWord(it);
        grid.appendChild(el('button', {
          type: 'button',
          class: 'bingo-cell' + (stamped[i] ? ' stamped' : ''),
          onclick: function (ev) {
            if (S.busy || stamped[i]) return;
            if (w === tWord) {
              S.busy = true;
              stamped[i] = true;
              ev.currentTarget.classList.add('stamped');
              var bingoNow = hasBingo();
              awardTurn(bingoNow ? 25 : 10);
              if (bingoNow) Kit.toast('🌟 BINGO! +25 ⭐', 1400);
              cIdx++;
              S.round++;
              drawTeams();
              later(drawBoard, 950);
            } else {
              ev.currentTarget.classList.add('wrong'); Kit.sound('soft');
              later(function () { ev.currentTarget.classList.remove('wrong'); }, 360);
            }
          }
        }, [
          it.img ? el('img', { src: Kit.src(it.img), alt: w }) : null,
          el('span', { text: w })
        ]));
      });
      ui.body.appendChild(grid);

      if (Kit.preview) {
        caption(1, 'Listen to the Picture Caller & stamp your 3×3 board!');
        later(function () {
          var mIdx = boardItems.indexOf(target);
          var cells = grid.querySelectorAll('.bingo-cell');
          if (cells[mIdx]) cells[mIdx].click();
        }, 1000);
      }
    }
    drawBoard();
  }

  /* ----------------------- FINALE ----------------------- */
  function showFinale() {
    clearTimers();
    S.phase = 'end';
    ui.body.innerHTML = '';

    var mainCol = el('div', { class: 'finale-main' });
    if (S.teamsData.length) {
      var ranked = S.teamsData.slice().sort(function (a, b) { return b.score - a.score; });
      var top = ranked[0] ? ranked[0].score : 0;
      mainCol.appendChild(el('h2', { text: '🏆 ' + ranked[0].name + ' Wins ' + META.name + '!' }));
      var pod = el('div', { class: 'podium' });
      ranked.forEach(function (t, k) {
        var hgt = top ? 30 + 66 * (t.score / top) : 34;
        pod.appendChild(el('div', { class: 'pod', style: { '--tc': t.color, '--h': hgt + '%' } }, [
          t.mascotImg ? el('img', { src: Kit.src(t.mascotImg), alt: '' }) : el('span', { text: t.emoji }),
          el('div', { class: 'pod-bar' }, [el('b', { text: String(t.score) })]),
          el('span', { text: (k === 0 ? '👑 ' : '') + t.name })
        ]));
      });
      mainCol.appendChild(pod);
    } else {
      mainCol.appendChild(el('h2', { text: '🌟 Great Job! ' + S.classStars + ' Class Stars!' }));
    }

    var card = el('div', { class: 'finale-card' }, [mainCol]);
    var xpPanel = (!Kit.preview && Kit.classroom && Kit.classroom.podiumPanel)
      ? Kit.classroom.podiumPanel({
          classId: S.classId,
          teams: S.teamsData,
          classStars: S.classStars,
          gameId: 'words-' + GAME_ID,
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
    loadAllPacks().then(function (packs) {
      start(packs[0] || { id: 'demo', name: 'Demo', items: [] });
    });
  } else {
    setup();
  }
})(window);
