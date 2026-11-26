/* courtside-to-curtain/js/app.js
 * Courtside to Curtain Call: The Festival Adventure — Main Controller
 * All 13 complete multi-round activities, dual Drag-and-Drop + Tap-to-Place,
 * Reactive Monster Companion (5 states), Adventure Map with animated walking token,
 * Zone 3 Train Cutscene, and Grand Finale Mastery Certificate.
 */
(function (root) {
  'use strict';

  var D = root.CTCData;
  var A = root.AudioEngine;
  var FX = root.CTCMediaFX;

  var state = {
    view: 'title',       // 'title' | 'map' | 'activity' | 'cutscene' | 'finale'
    currentNode: 1,
    completed: {},       // nodeId -> true
    seenCutscene: false,
    activeTeam: 0,
    teamStars: [0, 0, 0, 0],
    tokenNode: 1
  };

  var el = {};
  function q(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initDom() {
    el.stage = q('stage-host');
    el.starsPill = q('stars-pill');
    el.btnMap = q('btn-map');
    el.btnJump = q('btn-jump');
    el.btnBravo = q('btn-bravo');
    el.btnReplay = q('btn-replay');
    el.btnSlow = q('btn-slow');
    el.btnBgm = q('btn-bgm');
    el.btnSfx = q('btn-sfx');
    el.compBox = q('companion-box');
    el.compImg = q('companion-img');
    el.compName = q('companion-name');
    el.compSay = q('companion-say');
    el.teamsBar = q('teams-bar');
    el.drawerBack = q('drawer-back');
    el.jumpGrid = q('jump-grid');
  }

  function applyZoneTheme(zoneId) {
    var z = D.ZONES[zoneId || 1];
    document.documentElement.style.setProperty('--zone-color', z.color);
    document.documentElement.style.setProperty('--zone-dark', z.dark);
    A.setZone(z.id);
    var t = D.TEAMS[state.activeTeam];
    var role = z.id === 3 ? '🎭 Director ' : (z.id === 2 ? '🎪 Guide ' : '🏀 Coach ');
    el.compName.textContent = role + t.name + ' · ' + z.name;
  }

  /* Reactive Storybook Companion (5 States: idle, speaking, excited, thinking, encouraging) */
  function setCompanion(mood, text, shouldSpeak) {
    var t = D.TEAMS[state.activeTeam];
    var sprite = t.img;
    if (mood === 'excited') sprite = t.cheer;
    else if (mood === 'encouraging') sprite = t.oops;
    else if (mood === 'thinking') sprite = t.think;

    el.compImg.src = sprite;
    el.compBox.classList.remove('idle', 'speaking', 'excited', 'thinking', 'encouraging');
    el.compBox.classList.add(mood || 'idle');
    if (text) el.compSay.textContent = text;
    if (shouldSpeak && text) {
      A.speak(text, function () { el.compBox.classList.add('speaking'); }, function () { el.compBox.classList.remove('speaking'); });
    }
  }

  function awardTeamStar(pts, cx, cy) {
    var add = pts || 1;
    state.teamStars[state.activeTeam] += add;
    renderTeams();
    FX.burst(cx, cy, 'star', 22);
    try {
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP({ team: D.TEAMS[state.activeTeam].id, amount: add * 5, source: 'courtside-to-curtain' });
      }
    } catch (e) {}
  }

  function updateStarsPill() {
    var doneCount = Object.keys(state.completed).length;
    el.starsPill.textContent = '⭐ ' + doneCount + ' / 13';
  }

  function renderTeams() {
    el.teamsBar.innerHTML = D.TEAMS.map(function (t, i) {
      var turn = i === state.activeTeam;
      return '<button type="button" class="team-chip' + (turn ? ' turn' : '') + '" data-team="' + i + '" style="--tc:' + t.color + ';--td:' + t.dark + ';">' +
        '<img src="' + t.img + '" alt="' + esc(t.name) + '">' +
        '<div><b>' + esc(t.name) + '</b><span>⭐ ' + state.teamStars[i] + '</span></div>' +
      '</button>';
    }).join('');
  }

  /* ==================== TITLE SCREEN ==================== */
  function showTitle() {
    FX.destroyStages();
    state.view = 'title';
    applyZoneTheme(1);
    el.stage.innerHTML = '<div class="book-spread"><div class="title-screen">' +
      '<div class="title-hero">' +
        '<h1>Courtside to Curtain Call:<br>The Festival Adventure</h1>' +
        '<p>Travel together from the Sunny Basketball Court, through the Festival Park, to the Grand Theatre across 13 interactive speaking &amp; reading challenges!</p>' +
        '<div class="zone-preview-row">' +
          '<div class="zone-chip" style="--zc:#ffb320;--zd:#c97e00;">🏀 Zone 1<br>Court (1–6)</div>' +
          '<div class="zone-chip" style="--zc:#2fc58a;--zd:#168d5f;">🎪 Zone 2<br>Park (7–10)</div>' +
          '<div class="zone-chip" style="--zc:#ff5fa2;--zd:#c92e70;">🎭 Zone 3<br>Theatre (11–13)</div>' +
        '</div>' +
        '<div class="title-cta-row">' +
          '<button type="button" class="btn green" id="btn-start-adv">🗺️ Start Adventure!</button>' +
          '<button type="button" class="btn yellow" id="btn-play-node1">🏀 Jump to Node 1</button>' +
        '</div>' +
      '</div>' +
      '<div id="title-media-host"></div>' +
    '</div></div>';

    FX.mountStage(q('title-media-host'), 'intro_journey', { controls: true });
    q('btn-start-adv').onclick = function () { A.playSfx('sfx_whistle'); showMap(); };
    q('btn-play-node1').onclick = function () { A.playSfx('sfx_whistle'); openNode(1); };
    setCompanion('idle', 'Welcome! Tap Start Adventure to explore all 13 stops together!', false);
  }

  /* ==================== ADVENTURE MAP (13 MILESTONE NODES) ==================== */
  function showMap() {
    FX.destroyStages();
    state.view = 'map';
    var curNodeObj = D.NODES[(state.tokenNode || 1) - 1] || D.NODES[0];
    applyZoneTheme(curNodeObj.zone);

    // Build dotted SVG trail connecting Nodes 1..13
    var pts = D.NODES.map(function (n) { return (n.x * 10) + ',' + (n.y * 5.6); }).join(' ');

    var nodesHtml = D.NODES.map(function (n) {
      var z = D.ZONES[n.zone];
      var done = !!state.completed[n.id];
      var isCur = n.id === state.tokenNode;
      return '<button type="button" class="map-node' + (done ? ' done' : '') + (isCur ? ' current' : '') + '"' +
        ' data-node="' + n.id + '" style="left:' + n.x + '%;top:' + n.y + '%;--zc:' + z.color + ';--zd:' + z.dark + ';">' +
        (done ? '<span class="mn-seal">⭐</span>' : '') +
        '<span class="mn-num">#' + n.id + '</span>' +
        '<span class="mn-ic">' + n.icon + '</span>' +
        '<span class="mn-lbl">' + esc(n.short) + '</span>' +
      '</button>';
    }).join('');

    var t = D.TEAMS[state.activeTeam];
    el.stage.innerHTML = '<div class="book-spread" style="padding:10px;">' +
      '<div class="map-wrap">' +
        '<div class="map-zone-banners">' +
          '<div class="map-zone-tag" style="--zc:#ffb320;--zd:#c97e00;">🏀 Zone 1 · Sunny Basketball Court</div>' +
          '<div class="map-zone-tag" style="--zc:#2fc58a;--zd:#168d5f;">🎪 Zone 2 · Festival Park</div>' +
          '<div class="map-zone-tag" style="--zc:#ff5fa2;--zd:#c92e70;">🎭 Zone 3 · Grand Theatre</div>' +
        '</div>' +
        '<svg class="map-svg" viewBox="0 0 1000 560" preserveAspectRatio="none">' +
          '<polyline points="' + pts + '" fill="none" stroke="#fff8ec" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<polyline points="' + pts + '" fill="none" stroke="#8f5a2e" stroke-width="6" stroke-dasharray="14 14" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        nodesHtml +
        '<img class="map-token" id="map-token" src="' + t.img + '" alt="Class Token" style="left:' + curNodeObj.x + '%;top:' + curNodeObj.y + '%;">' +
      '</div>' +
    '</div>';

    el.stage.querySelectorAll('.map-node').forEach(function (btn) {
      btn.onclick = function () {
        var id = parseInt(btn.getAttribute('data-node'), 10);
        openNode(id);
      };
    });

    setCompanion('idle', 'Pick any glowing stop on the map! All 13 stops are ready to play.', false);
  }

  /* ==================== ZONE 3 CUTSCENE & GRAND FINALE ==================== */
  function showZone3Cutscene(nextNodeId) {
    FX.destroyStages();
    state.view = 'cutscene';
    state.seenCutscene = true;
    applyZoneTheme(3);
    A.playSfx('sfx_train');

    el.stage.innerHTML = '<div class="book-spread">' +
      '<div class="act-head"><h2 class="act-title">🚂 Story Cutscene: Journey to the Grand Theatre!</h2>' +
        '<button type="button" class="btn green" id="btn-skip-cut">Continue to Node ' + nextNodeId + ' ➡</button>' +
      '</div>' +
      '<div class="act-body" style="align-items:center;">' +
        '<div id="cutscene-host" style="width:100%;max-width:740px;"></div>' +
      '</div>' +
    '</div>';

    FX.mountStage(q('cutscene-host'), 'cutscene_festival_trip', { controls: true });
    setCompanion('speaking', 'Harry and his mother leave home, the train suddenly stops, and they rush to the festival stage!', true);
    q('btn-skip-cut').onclick = function () { A.playSfx('sfx_curtain'); renderActivity(nextNodeId); };
  }

  function showFinale() {
    FX.destroyStages();
    state.view = 'finale';
    applyZoneTheme(3);
    A.playSfx('sfx_applause');
    FX.burst(root.innerWidth * 0.3, root.innerHeight * 0.35, 'confetti', 45);
    FX.burst(root.innerWidth * 0.7, root.innerHeight * 0.35, 'confetti', 45);

    var totalStars = state.teamStars.reduce(function (a, b) { return a + b; }, 0);
    var doneCount = Object.keys(state.completed).length;

    el.stage.innerHTML = '<div class="book-spread">' +
      '<div class="title-screen">' +
        '<div class="title-hero">' +
          '<h1>🎆 Curtain Call!<br>Class Mastery Certificate</h1>' +
          '<p>Amazing teamwork from the Basketball Court to the Grand Theatre! Everyone spoke, read, and cheered together!</p>' +
          '<div class="zone-preview-row">' +
            '<div class="zone-chip" style="--zc:#ffb320;--zd:#c97e00;">⭐ Nodes Done<br><b>' + doneCount + ' / 13</b></div>' +
            '<div class="zone-chip" style="--zc:#2fc58a;--zd:#168d5f;">🏆 Team Stars<br><b>' + totalStars + ' Stars</b></div>' +
            '<div class="zone-chip" style="--zc:#ff5fa2;--zd:#c92e70;">🎭 Festival Award<br><b>GOLD SEAL</b></div>' +
          '</div>' +
          '<div class="title-cta-row">' +
            '<button type="button" class="btn yellow" id="btn-finale-cheer">👏 Encore Fireworks!</button>' +
            '<button type="button" class="btn blue" id="btn-finale-map">🗺️ Back to Map</button>' +
          '</div>' +
        '</div>' +
        '<div id="finale-media-host"></div>' +
      '</div>' +
    '</div>';

    FX.mountStage(q('finale-media-host'), 'finale_curtain_call', { controls: true });
    setCompanion('excited', 'Bravo! Encore! You completed the Festival Adventure!', true);
    q('btn-finale-cheer').onclick = function () {
      A.playSfx('sfx_applause');
      FX.burst(root.innerWidth * 0.5, root.innerHeight * 0.35, 'confetti', 60);
    };
    q('btn-finale-map').onclick = showMap;
  }

  /* ==================== OPEN & COMPLETE NODE ==================== */
  function openNode(nodeId) {
    var node = D.NODES[nodeId - 1];
    if (!node) return;
    state.currentNode = nodeId;
    state.tokenNode = nodeId;
    A.playSfx('sfx_page_turn');

    if (node.zone === 3 && !state.seenCutscene) {
      showZone3Cutscene(nodeId);
      return;
    }
    renderActivity(nodeId);
  }

  function completeNode(nodeId) {
    state.completed[nodeId] = true;
    updateStarsPill();
    awardTeamStar(2);
    A.playSfx('sfx_applause');
    FX.burst(root.innerWidth * 0.5, root.innerHeight * 0.4, 'confetti', 48);

    // Advance team turn automatically
    state.activeTeam = (state.activeTeam + 1) % 4;
    renderTeams();

    if (nodeId === 13) {
      setTimeout(showFinale, 950);
      return;
    }

    var nextId = Math.min(13, nodeId + 1);
    state.tokenNode = nextId;
    var node = D.NODES[nodeId - 1];
    setCompanion('excited', 'Golden Seal earned on #' + nodeId + ' ' + node.title + '! Ready for the next stop!', true);

    var body = el.stage.querySelector('.act-body');
    if (body) {
      body.innerHTML = '<div style="text-align:center;padding:18px;">' +
        '<div style="font-size:4rem;">🏅✨</div>' +
        '<h2 style="margin:6px 0;font-size:2rem;">Golden Seal Unlocked!</h2>' +
        '<p style="font-weight:800;color:#594a72;font-size:1.15rem;">Whole class: give a big clap for completing <strong>#' + nodeId + ' ' + esc(node.title) + '</strong>!</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
          '<button type="button" class="btn green" id="btn-go-next" style="min-height:60px;font-size:1.2rem;padding:10px 24px;">Next Stop: #' + nextId + ' ➡</button>' +
          '<button type="button" class="btn yellow" id="btn-go-map" style="min-height:60px;font-size:1.1rem;">🗺️ Adventure Map</button>' +
        '</div>' +
      '</div>';
      q('btn-go-next').onclick = function () { openNode(nextId); };
      q('btn-go-map').onclick = showMap;
    }
  }

  function buildShell(node, progText) {
    FX.destroyStages();
    state.view = 'activity';
    applyZoneTheme(node.zone);
    el.stage.innerHTML = '<div class="book-spread">' +
      '<div class="act-head">' +
        '<h2 class="act-title">' + node.icon + ' #' + node.id + ' · ' + esc(node.title) + '</h2>' +
        '<span class="act-prog" id="act-prog">' + esc(progText || '') + '</span>' +
      '</div>' +
      '<div class="act-body" id="act-body"></div>' +
    '</div>';
    setCompanion('speaking', node.intro, true);
    return q('act-body');
  }

  function renderActivity(nodeId) {
    var node = D.NODES[nodeId - 1];
    if (!node) return;
    switch (node.type) {
      case 'match': runNode1Match(node); break;
      case 'court': runNode2Court(node); break;
      case 'missing': runNode3Missing(node); break;
      case 'odd': runNode4Odd(node); break;
      case 'meaning': runNode5Meaning(node); break;
      case 'phonics': runNode6Phonics(node); break;
      case 'video_choice': runNode7VideoChoice(node); break;
      case 'unscramble': runNode8Unscramble(node); break;
      case 'whoami': runNode9WhoAmI(node); break;
      case 'strange': runNode10Strange(node); break;
      case 'puzzle': runNode11Puzzle(node); break;
      case 'program': runNode12Program(node); break;
      case 'sequence': runNode13Sequence(node); break;
    }
  }

  /* ==================== NODE 1: WORD-PICTURE MATCH (Tap OR Drag!) ==================== */
  function runNode1Match(node) {
    var rounds = D.ACTIVITIES[1].rounds;
    var rIdx = 0;
    var body = buildShell(node, 'Round 1 / 2');

    function renderRound() {
      q('act-prog').textContent = 'Round ' + (rIdx + 1) + ' / ' + rounds.length;
      var round = rounds[rIdx];
      var pics = round.pairs.slice();
      var words = round.pairs.slice().sort(function () { return Math.random() - 0.5; });
      var matched = {}, selPic = null, selWord = null;

      body.innerHTML = '<div class="match-grid">' +
        '<div class="match-col" id="m-pics">' + pics.map(function (p) {
          return '<button type="button" class="m-card" draggable="true" data-pic="' + p.id + '">' +
            '<img src="' + p.img + '" alt="' + esc(p.word) + '">' +
          '</button>';
        }).join('') + '</div>' +
        '<div class="match-col words" id="m-words">' + words.map(function (p) {
          return '<button type="button" class="m-card word-card" data-word="' + p.id + '">🔊 ' + esc(p.word) + '</button>';
        }).join('') + '</div>' +
      '</div><div id="m-speak-slot"></div>';

      function tryPair(picId, wordId) {
        if (!picId || !wordId || matched[picId]) return;
        var pBtn = body.querySelector('[data-pic="' + picId + '"]');
        var wBtn = body.querySelector('[data-word="' + wordId + '"]');
        if (picId === wordId) {
          matched[picId] = true;
          pBtn.classList.remove('selected'); wBtn.classList.remove('selected');
          pBtn.classList.add('matched'); wBtn.classList.add('matched');
          var obj = round.pairs.filter(function (x) { return x.id === picId; })[0];
          A.playSfx('sfx_swish');
          awardTeamStar(1);
          setCompanion('excited', 'Swish! ' + obj.say, true);
          q('m-speak-slot').innerHTML = '<div class="speak-strip"><span>🗣️ Whole Class Say: "' + esc(obj.say) + '"</span></div>';
          if (Object.keys(matched).length === round.pairs.length) {
            setTimeout(function () {
              rIdx++;
              if (rIdx < rounds.length) renderRound();
              else completeNode(node.id);
            }, 1000);
          }
        } else {
          A.playSfx('sfx_boing');
          setCompanion('encouraging', 'Ooh, almost! Look closely and try again!', false);
          pBtn.classList.add('wobble'); wBtn.classList.add('wobble');
          setTimeout(function () { pBtn.classList.remove('wobble', 'selected'); wBtn.classList.remove('wobble', 'selected'); }, 350);
        }
        selPic = null; selWord = null;
      }

      body.querySelectorAll('[data-pic]').forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute('data-pic');
          if (matched[id]) return;
          body.querySelectorAll('[data-pic]').forEach(function (x) { x.classList.remove('selected'); });
          selPic = id; b.classList.add('selected');
          if (selWord) tryPair(selPic, selWord);
        };
        b.ondragstart = function (ev) { ev.dataTransfer.setData('text/plain', b.getAttribute('data-pic')); };
      });
      body.querySelectorAll('[data-word]').forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute('data-word');
          var obj = round.pairs.filter(function (x) { return x.id === id; })[0];
          if (obj) A.speak(obj.word);
          if (matched[id]) return;
          body.querySelectorAll('[data-word]').forEach(function (x) { x.classList.remove('selected'); });
          selWord = id; b.classList.add('selected');
          if (selPic) tryPair(selPic, selWord);
        };
        b.ondragover = function (ev) { ev.preventDefault(); };
        b.ondrop = function (ev) {
          ev.preventDefault();
          var pid = ev.dataTransfer.getData('text/plain');
          tryPair(pid, b.getAttribute('data-word'));
        };
      });
    }
    renderRound();
  }

  /* ==================== NODE 2: LABEL THE BASKETBALL COURT (Drag + Tap-to-Place) ==================== */
  function runNode2Court(node) {
    var targets = D.ACTIVITIES[2].targets;
    var body = buildShell(node, '0 / 5 Labels');
    var placed = {}, selectedLabel = null;

    var shuffled = targets.slice().sort(function () { return Math.random() - 0.5; });

    body.innerHTML = '<div class="court-layout">' +
      '<div class="court-board" id="court-board">' +
        '<svg viewBox="0 0 800 460" style="width:100%;height:100%;display:block;">' +
          '<rect x="20" y="20" width="760" height="420" rx="14" fill="#f3c173" stroke="#ffffff" stroke-width="6"/>' +
          '<line x1="400" y1="20" x2="400" y2="440" stroke="#ffffff" stroke-width="6"/>' +
          '<circle cx="400" cy="230" r="56" fill="#ff9f43" fill-opacity="0.35" stroke="#ffffff" stroke-width="6"/>' +
          '<rect x="20" y="145" width="165" height="170" fill="#4f9dff" fill-opacity="0.28" stroke="#ffffff" stroke-width="5"/>' +
          '<rect x="615" y="145" width="165" height="170" fill="#4f9dff" fill-opacity="0.28" stroke="#ffffff" stroke-width="5"/>' +
          '<path d="M 20 70 L 120 70 A 175 175 0 0 1 120 390 L 20 390" fill="none" stroke="#ffffff" stroke-width="6"/>' +
          '<path d="M 780 70 L 680 70 A 175 175 0 0 0 680 390 L 780 390" fill="none" stroke="#ffffff" stroke-width="6"/>' +
          '<circle cx="62" cy="230" r="16" fill="#ff5fa2" stroke="#ffffff" stroke-width="5"/>' +
          '<circle cx="738" cy="230" r="16" fill="#ff5fa2" stroke="#ffffff" stroke-width="5"/>' +
        '</svg>' +
        targets.map(function (t) {
          return '<button type="button" class="court-drop" data-target="' + t.id + '" style="left:' + t.x + '%;top:' + t.y + '%;">📍 ' + esc(t.hint) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="court-tray" id="court-tray">' +
        '<div style="font-weight:900;text-align:center;color:#594a72;">Tap OR Drag a label onto the court:</div>' +
        shuffled.map(function (t) {
          return '<button type="button" class="choice-btn" draggable="true" data-lbl="' + t.id + '">🔊 ' + esc(t.label) + '</button>';
        }).join('') +
      '</div>' +
    '</div>';

    function place(lblId, targetId) {
      if (!lblId || !targetId || placed[targetId]) return;
      var tObj = targets.filter(function (x) { return x.id === targetId; })[0];
      var dropEl = body.querySelector('[data-target="' + targetId + '"]');
      var lblEl = body.querySelector('[data-lbl="' + lblId + '"]');
      if (lblId === targetId) {
        placed[targetId] = true;
        dropEl.classList.add('placed');
        dropEl.textContent = '✅ ' + tObj.label;
        lblEl.classList.add('ok');
        lblEl.disabled = true;
        selectedLabel = null;
        A.playSfx('sfx_swish');
        awardTeamStar(1);
        var cnt = Object.keys(placed).length;
        q('act-prog').textContent = cnt + ' / 5 Labels';
        setCompanion('excited', 'Swish! ' + tObj.say, true);
        if (cnt === targets.length) {
          setTimeout(function () { completeNode(node.id); }, 1050);
        }
      } else {
        A.playSfx('sfx_boing');
        setCompanion('encouraging', 'Almost! Look closely at the court lines and try again!', false);
        dropEl.classList.add('wobble');
        setTimeout(function () { dropEl.classList.remove('wobble'); }, 350);
      }
    }

    body.querySelectorAll('[data-lbl]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-lbl');
        var tObj = targets.filter(function (x) { return x.id === id; })[0];
        if (tObj) A.speak(tObj.label);
        body.querySelectorAll('[data-lbl]').forEach(function (x) { x.style.outline = 'none'; });
        selectedLabel = id;
        b.style.outline = '4px solid #ff5fa2';
      };
      b.ondragstart = function (ev) { ev.dataTransfer.setData('text/plain', b.getAttribute('data-lbl')); };
    });

    body.querySelectorAll('[data-target]').forEach(function (d) {
      d.onclick = function () { if (selectedLabel) place(selectedLabel, d.getAttribute('data-target')); };
      d.ondragover = function (ev) { ev.preventDefault(); d.classList.add('hover'); };
      d.ondragleave = function () { d.classList.remove('hover'); };
      d.ondrop = function (ev) {
        ev.preventDefault(); d.classList.remove('hover');
        place(ev.dataTransfer.getData('text/plain'), d.getAttribute('data-target'));
      };
    });
  }

  /* ==================== NODE 3: MISSING LETTER (Spell & Shoot!) ==================== */
  function runNode3Missing(node) {
    var items = D.ACTIVITIES[3].items;
    var idx = 0;
    var body = buildShell(node, '1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Word ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div class="spell-card">' +
        '<img class="spell-art" src="' + it.img + '" alt="' + esc(it.word) + '">' +
        '<div class="spell-word" id="sp-word">' + esc(it.display) + '</div>' +
        '<div class="ball-options">' + it.options.map(function (ch) {
          return '<button type="button" class="ball-btn" data-ch="' + ch + '">' + ch + '</button>';
        }).join('') + '</div>' +
      '</div>';

      body.querySelectorAll('.ball-btn').forEach(function (b) {
        b.onclick = function () {
          var ch = b.getAttribute('data-ch');
          if (ch === it.answer) {
            q('sp-word').textContent = it.word.split('').join(' ');
            q('sp-word').style.borderColor = '#2fc58a';
            A.playSfx('sfx_swish');
            awardTeamStar(1);
            setCompanion('excited', 'Swish! ' + it.say, true);
            setTimeout(function () {
              idx++;
              if (idx < items.length) render(); else completeNode(node.id);
            }, 1350);
          } else {
            A.playSfx('sfx_boing');
            b.style.opacity = '0.45';
            setCompanion('encouraging', 'Try another basketball letter!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 4: ODD ONE OUT ==================== */
  function runNode4Odd(node) {
    var items = D.ACTIVITIES[4].items;
    var idx = 0;
    var body = buildShell(node, '1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Shelf ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div style="text-align:center;font-weight:900;font-size:1.3rem;">' + esc(it.prompt) + '</div>' +
        '<div class="shelf-grid">' + it.cards.map(function (c, i) {
          return '<button type="button" class="shelf-card" data-i="' + i + '">' +
            '<img src="' + c.img + '" alt="' + esc(c.word) + '">' +
            '<b>🔊 ' + esc(c.word) + '</b>' +
          '</button>';
        }).join('') + '</div>' +
        '<div id="odd-fb"></div>';

      body.querySelectorAll('.shelf-card').forEach(function (btn) {
        btn.onclick = function () {
          var i = parseInt(btn.getAttribute('data-i'), 10);
          A.speak(it.cards[i].word);
          if (i === it.answer) {
            btn.classList.add('popped');
            A.playSfx('sfx_chime');
            awardTeamStar(1);
            q('odd-fb').innerHTML = '<div class="speak-strip"><span>🪂 Odd one out: <strong>' + esc(it.cards[i].word) + '</strong> — ' + esc(it.why) + '</span></div>';
            setCompanion('excited', it.say, true);
            setTimeout(function () {
              idx++;
              if (idx < items.length) render(); else completeNode(node.id);
            }, 1800);
          } else {
            A.playSfx('sfx_boing');
            btn.style.opacity = '0.45';
            setCompanion('encouraging', 'That one belongs in the group! Spot the intruder!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 5: WHAT DOES IT MEAN? ==================== */
  function runNode5Meaning(node) {
    var items = D.ACTIVITIES[5].items;
    var idx = 0;
    var body = buildShell(node, '1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Scroll ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:18px;background:#fff;border:4px solid #ffb320;border-radius:24px;padding:12px 22px;">' +
        '<img src="' + it.img + '" style="width:110px;height:110px;object-fit:contain;" alt="' + esc(it.word) + '">' +
        '<div><div style="font-size:2.1rem;font-weight:900;">' + esc(it.word) + '</div>' +
        '<button type="button" class="btn yellow" id="m-say-btn">🔊 Hear Word</button></div>' +
      '</div>' +
      '<div class="choice-grid">' + it.options.map(function (o, i) {
        return '<button type="button" class="choice-btn" data-i="' + i + '">' + o.icon + ' ' + esc(o.text) + '</button>';
      }).join('') + '</div>';

      q('m-say-btn').onclick = function () { A.speak(it.word); };
      body.querySelectorAll('.choice-btn').forEach(function (btn) {
        btn.onclick = function () {
          var i = parseInt(btn.getAttribute('data-i'), 10);
          if (it.options[i].ok) {
            btn.classList.add('ok');
            A.playSfx('sfx_chime');
            awardTeamStar(1);
            setCompanion('excited', it.say, true);
            setTimeout(function () {
              idx++;
              if (idx < items.length) render(); else completeNode(node.id);
            }, 1500);
          } else {
            btn.classList.add('wrong');
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'Almost! Read the clues carefully!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 6: PHONICS HUNT (OR — Catch & Compare SPORT vs WORK!) ==================== */
  function runNode6Phonics(node) {
    var data = D.ACTIVITIES[6];
    var body = buildShell(node, 'Part A · Catch OR Bubbles');
    var found = {};
    var totalOr = data.bubbles.filter(function (b) { return b.hasOr; }).length;

    function renderPartA() {
      body.innerHTML = '<div style="text-align:center;font-weight:900;font-size:1.25rem;">Tap every bubble that has the letters <mark style="background:#ffc93c;padding:2px 8px;border-radius:8px;">OR</mark>!</div>' +
        '<div class="bubble-sky">' + data.bubbles.map(function (b) {
          var disp = found[b.word] ? b.word.replace('OR', '<mark>OR</mark>') : b.word;
          return '<button type="button" class="p-bubble' + (found[b.word] ? ' found' : '') + '" data-w="' + b.word + '">' + disp + '</button>';
        }).join('') + '</div>';

      body.querySelectorAll('.p-bubble').forEach(function (btn) {
        btn.onclick = function () {
          var w = btn.getAttribute('data-w');
          A.speak(w);
          var obj = data.bubbles.filter(function (x) { return x.word === w; })[0];
          if (obj.hasOr) {
            if (!found[w]) {
              found[w] = true;
              A.playSfx('sfx_chime');
              awardTeamStar(1);
              renderPartA();
              if (Object.keys(found).length === totalOr) {
                setCompanion('excited', 'You caught all 5 OR words! Now listen to SPORT vs WORK!', true);
                setTimeout(renderPartB, 1100);
              }
            }
          } else {
            A.playSfx('sfx_boing');
            btn.style.opacity = '0.4';
            setCompanion('encouraging', w + ' does not have OR — keep hunting!', false);
          }
        };
      });
    }

    function renderPartB() {
      q('act-prog').textContent = 'Part B · Sound Ear-Check';
      var queue = data.sortWords.slice();
      var sIdx = 0;
      var chestSport = [], chestWork = [];

      function paintSort() {
        var cur = queue[sIdx];
        body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;">' +
          '<button type="button" class="btn yellow" id="cmp-sport">🔊 Hear SPORT (/ɔː/)</button>' +
          '<button type="button" class="btn pink" id="cmp-work">🔊 Hear WORK (/ɜː/ after W!)</button>' +
        '</div>' +
        (cur ? '<div style="text-align:center;"><div style="display:inline-block;background:#fff;border:4px solid #4f9dff;border-radius:20px;padding:10px 26px;font-size:1.8rem;font-weight:900;cursor:pointer;" id="cur-sort-w">🔊 ' + cur.word.replace('OR', '<mark style="background:#ffc93c;">OR</mark>') + '</div><div style="font-weight:800;color:#594a72;margin-top:4px;">Tap the matching sound chest below!</div></div>' : '') +
        '<div class="chest-grid">' +
          '<button type="button" class="chest-box" data-chest="sport"><div style="font-size:1.3rem;font-weight:900;">🧰 Chest 1 · /ɔː/ like SPORT</div><div style="margin-top:6px;font-weight:800;color:#166534;">' + (chestSport.join(' · ') || 'Tap here!') + '</div></button>' +
          '<button type="button" class="chest-box alt" data-chest="work"><div style="font-size:1.3rem;font-weight:900;">🧰 Chest 2 · /ɜː/ like WORK!</div><div style="margin-top:6px;font-weight:800;color:#9d174d;">' + (chestWork.join(' · ') || 'Different OR sound!') + '</div></button>' +
        '</div>';

        q('cmp-sport').onclick = function () { A.speak('sport'); };
        q('cmp-work').onclick = function () { A.speak('work'); };
        if (cur && q('cur-sort-w')) q('cur-sort-w').onclick = function () { A.speak(cur.word); };

        body.querySelectorAll('[data-chest]').forEach(function (chBtn) {
          chBtn.onclick = function () {
            if (!cur) return;
            var pick = chBtn.getAttribute('data-chest');
            if (pick === cur.chest) {
              if (pick === 'sport') chestSport.push(cur.word); else chestWork.push(cur.word);
              A.playSfx('sfx_chime');
              awardTeamStar(1);
              A.speak(cur.word);
              sIdx++;
              if (sIdx >= queue.length) {
                paintSort();
                setTimeout(function () { completeNode(node.id); }, 1000);
              } else {
                paintSort();
              }
            } else {
              A.playSfx('sfx_boing');
              setCompanion('encouraging', 'Listen again: compare SPORT and WORK!', true);
            }
          };
        });
      }
      paintSort();
    }

    renderPartA();
  }

  /* ==================== NODE 7: LOOK & CHOOSE (LIVE ACTION VIDEO CLIPS!) ==================== */
  function runNode7VideoChoice(node) {
    var items = D.ACTIVITIES[7].items;
    var idx = 0;
    var body = buildShell(node, 'Clip 1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Clip ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:14px;align-items:center;height:100%;">' +
        '<div id="n7-media"></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px;">' +
          '<div style="font-size:1.25rem;font-weight:900;">' + esc(it.question) + '</div>' +
          it.options.map(function (opt, i) {
            return '<button type="button" class="choice-btn" data-i="' + i + '" style="min-height:60px;justify-content:flex-start;">' +
              '<b>' + ['A', 'B', 'C', 'D'][i] + '.</b> ' + esc(opt) +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';

      FX.mountStage(q('n7-media'), it.scene, { controls: true });

      body.querySelectorAll('.choice-btn').forEach(function (btn) {
        btn.onclick = function () {
          var i = parseInt(btn.getAttribute('data-i'), 10);
          A.speak(it.options[i]);
          if (i === it.answer) {
            btn.classList.add('ok');
            A.playSfx('sfx_chime');
            awardTeamStar(1);
            setCompanion('excited', 'Yes! Say it together: ' + it.options[i], true);
            setTimeout(function () {
              idx++;
              if (idx < items.length) render(); else completeNode(node.id);
            }, 1500);
          } else {
            btn.classList.add('wrong');
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'Watch the movement again and try!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 8: UNSCRAMBLE THE SENTENCE (BUILD THE BRIDGE!) ==================== */
  function runNode8Unscramble(node) {
    var items = D.ACTIVITIES[8].items;
    var idx = 0;
    var body = buildShell(node, 'Bridge 1 / ' + items.length);

    function render() {
      var it = items[idx];
      var placed = [];
      q('act-prog').textContent = 'Bridge ' + (idx + 1) + ' / ' + items.length;

      function paint() {
        var remaining = it.scrambled.map(function (w, i) { return { w: w, i: i }; }).filter(function (o) {
          return placed.indexOf(o.i) < 0;
        });

        body.innerHTML = '<div style="text-align:center;font-weight:900;font-size:1.15rem;">Tap OR drag the wooden planks in order to cross the river!</div>' +
          '<div class="bridge-slots" id="u-slots">' + it.words.map(function (_, si) {
            var pIdx = placed[si];
            return '<div class="plank-slot' + (pIdx != null ? ' filled' : '') + '">' + (pIdx != null ? esc(it.scrambled[pIdx]) : (si + 1)) + '</div>';
          }).join('') + '</div>' +
          '<div class="plank-bank">' + remaining.map(function (o) {
            return '<button type="button" class="choice-btn" draggable="true" data-pi="' + o.i + '" style="min-height:60px;min-width:120px;">🪵 ' + esc(o.w) + '</button>';
          }).join('') + '</div>';

        function tryPlace(pi) {
          var expected = it.words[placed.length];
          var chosen = it.scrambled[pi];
          A.speak(chosen);
          if (chosen === expected) {
            placed.push(pi);
            A.playSfx('sfx_chime');
            paint();
            if (placed.length === it.words.length) {
              var full = it.words.join(' ');
              awardTeamStar(1);
              A.playSfx('sfx_swish');
              setCompanion('excited', 'Bridge built! Say together: ' + full, true);
              setTimeout(function () {
                idx++;
                if (idx < items.length) render(); else completeNode(node.id);
              }, 1700);
            }
          } else {
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'Almost! Think: which word comes next?', false);
          }
        }

        body.querySelectorAll('[data-pi]').forEach(function (b) {
          b.onclick = function () { tryPlace(parseInt(b.getAttribute('data-pi'), 10)); };
          b.ondragstart = function (ev) { ev.dataTransfer.setData('text/plain', b.getAttribute('data-pi')); };
        });
        var slotsBox = q('u-slots');
        slotsBox.ondragover = function (ev) { ev.preventDefault(); };
        slotsBox.ondrop = function (ev) {
          ev.preventDefault();
          var pi = parseInt(ev.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(pi)) tryPlace(pi);
        };
      }
      paint();
    }
    render();
  }

  /* ==================== NODE 9: WHO AM I? (3 PROGRESSIVE CLUES) ==================== */
  function runNode9WhoAmI(node) {
    var items = D.ACTIVITIES[9].items;
    var idx = 0;
    var body = buildShell(node, 'Riddle 1 / ' + items.length);

    function render() {
      var it = items[idx];
      var revealedClues = 1;
      var solved = false;
      q('act-prog').textContent = 'Riddle ' + (idx + 1) + ' / ' + items.length;

      function paint() {
        body.innerHTML = '<div class="whoami-grid">' +
          '<div class="curtain-box' + (solved ? ' revealed' : '') + '">' +
            (solved ? '<img src="' + it.revealImg + '" alt="' + esc(it.revealTitle) + '"><div>🎉 ' + esc(it.revealTitle) + '</div>' : '<div style="font-size:3.5rem;">🎭</div><div>Who is behind the curtain?</div>') +
          '</div>' +
          '<div class="clue-list">' +
            it.clues.slice(0, revealedClues).map(function (cl, ci) {
              return '<div class="clue-pill">💡 Clue ' + (ci + 1) + ': ' + esc(cl) + '</div>';
            }).join('') +
            (revealedClues < 3 && !solved ? '<button type="button" class="btn lilac" id="btn-next-clue">➕ Reveal Clue ' + (revealedClues + 1) + '</button>' : '') +
            '<div class="choice-grid" style="margin-top:6px;">' + it.options.map(function (opt, oi) {
              return '<button type="button" class="choice-btn' + (solved && oi === it.answer ? ' ok' : '') + '" data-oi="' + oi + '">🔊 ' + esc(opt) + '</button>';
            }).join('') + '</div>' +
          '</div>' +
        '</div>';

        if (q('btn-next-clue')) {
          q('btn-next-clue').onclick = function () {
            revealedClues++;
            A.speak(it.clues[revealedClues - 1]);
            paint();
          };
        }
        body.querySelectorAll('[data-oi]').forEach(function (btn) {
          btn.onclick = function () {
            if (solved) return;
            var oi = parseInt(btn.getAttribute('data-oi'), 10);
            if (oi === it.answer) {
              solved = true;
              A.playSfx('sfx_curtain');
              awardTeamStar(1);
              setCompanion('excited', 'Bravo! It is the ' + it.options[oi] + '!', true);
              paint();
              setTimeout(function () {
                idx++;
                if (idx < items.length) render(); else completeNode(node.id);
              }, 1600);
            } else {
              btn.classList.add('wrong');
              A.playSfx('sfx_boing');
              setCompanion('encouraging', 'Try revealing another clue!', false);
            }
          };
        });
      }
      A.speak(it.clues[0]);
      paint();
    }
    render();
  }

  /* ==================== NODE 10: LOOK CAREFULLY! (SPOT WHAT IS STRANGE!) ==================== */
  function runNode10Strange(node) {
    var items = D.ACTIVITIES[10].items;
    var idx = 0;
    var body = buildShell(node, 'Scene 1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Scene ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:14px;align-items:center;height:100%;">' +
        '<div id="n10-media" style="position:relative;cursor:zoom-in;"></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px;">' +
          '<div style="font-size:1.2rem;font-weight:900;">🔍 ' + esc(it.question) + '</div>' +
          '<div style="font-size:0.9rem;font-weight:800;color:#594a72;">Tap the funny detail on the picture OR pick the sentence:</div>' +
          it.options.map(function (opt, i) {
            return '<button type="button" class="choice-btn" data-i="' + i + '" style="min-height:62px;justify-content:flex-start;text-align:left;">' +
              '<b>' + ['A', 'B', 'C'][i] + '.</b> ' + esc(opt) +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';

      var mediaEl = q('n10-media');
      FX.mountStage(mediaEl, it.scene, { controls: false });

      function winRound(btnEl) {
        if (btnEl) btnEl.classList.add('ok');
        A.playSfx('sfx_chime');
        awardTeamStar(1);
        setCompanion('excited', 'Haha! Good eyes! ' + it.options[it.answer], true);
        setTimeout(function () {
          idx++;
          if (idx < items.length) render(); else completeNode(node.id);
        }, 1750);
      }

      // Direct hotspot tap on the canvas!
      mediaEl.onclick = function (ev) {
        var r = mediaEl.getBoundingClientRect();
        var px = ((ev.clientX - r.left) / r.width) * 100;
        var py = ((ev.clientY - r.top) / r.height) * 100;
        var dx = px - it.hotspot.x, dy = py - it.hotspot.y;
        if (Math.sqrt(dx * dx + dy * dy) <= it.hotspot.r) {
          winRound(body.querySelector('[data-i="' + it.answer + '"]'));
        }
      };

      body.querySelectorAll('.choice-btn').forEach(function (btn) {
        btn.onclick = function () {
          var i = parseInt(btn.getAttribute('data-i'), 10);
          if (i === it.answer) winRound(btn);
          else {
            btn.classList.add('wrong');
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'That looks normal! Spot the silly surprise!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 11: PICTURE PUZZLE & LANGUAGE CHECK ==================== */
  function runNode11Puzzle(node) {
    var rounds = D.ACTIVITIES[11].rounds;
    var rIdx = 0;
    var body = buildShell(node, 'Poster 1 / 2');

    function renderRound() {
      var rd = rounds[rIdx];
      var missing = rd.missing.slice();
      var selectedPiece = null;
      q('act-prog').textContent = 'Poster ' + (rIdx + 1) + ' / ' + rounds.length;

      function posCss(cellIdx) {
        var cx = (cellIdx % 2) * 100;
        var cy = Math.floor(cellIdx / 2) * 100;
        return 'background-image:url(' + rd.img + ');background-position:' + cx + '% ' + cy + '%;';
      }

      function paint() {
        var solvedPuzzle = missing.length === 0;
        body.innerHTML = '<div class="puzzle-layout">' +
          '<div class="puzzle-board">' + [0, 1, 2, 3].map(function (ci) {
            var isMiss = missing.indexOf(ci) >= 0;
            return '<div class="pz-cell' + (isMiss ? ' missing' : '') + '" data-slot="' + ci + '" style="' + (isMiss ? '' : posCss(ci)) + '">' + (isMiss ? '🧩?' : '') + '</div>';
          }).join('') + '</div>' +
          '<div style="display:flex;flex-direction:column;gap:12px;align-items:center;">' +
            (!solvedPuzzle
              ? '<div style="font-weight:900;font-size:1.15rem;text-align:center;">Step 1: Tap or Drag the missing pieces into the poster!</div>' +
                '<div class="pz-tray">' + missing.map(function (mi) {
                  return '<div class="pz-piece' + (selectedPiece === mi ? ' selected' : '') + '" draggable="true" data-piece="' + mi + '" style="' + posCss(mi) + '"></div>';
                }).join('') + '</div>'
              : '<div style="font-weight:900;font-size:1.3rem;text-align:center;">Step 2: ' + esc(rd.question) + '</div>' +
                '<div class="choice-grid" style="width:100%;">' + rd.options.map(function (opt, oi) {
                  return '<button type="button" class="choice-btn" data-oi="' + oi + '">' + esc(opt) + '</button>';
                }).join('') + '</div>'
            ) +
          '</div>' +
        '</div>';

        function trySnap(pieceIdx, slotIdx) {
          if (pieceIdx === slotIdx) {
            missing = missing.filter(function (x) { return x !== pieceIdx; });
            selectedPiece = null;
            A.playSfx('sfx_chime');
            if (missing.length === 0) {
              setCompanion('excited', 'Poster fixed! Now answer: ' + rd.question, true);
            }
            paint();
          } else {
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'Try the other empty spot!', false);
          }
        }

        body.querySelectorAll('[data-piece]').forEach(function (p) {
          p.onclick = function () { selectedPiece = parseInt(p.getAttribute('data-piece'), 10); paint(); };
          p.ondragstart = function (ev) { ev.dataTransfer.setData('text/plain', p.getAttribute('data-piece')); };
        });
        body.querySelectorAll('[data-slot]').forEach(function (s) {
          var si = parseInt(s.getAttribute('data-slot'), 10);
          s.onclick = function () { if (selectedPiece != null && missing.indexOf(si) >= 0) trySnap(selectedPiece, si); };
          s.ondragover = function (ev) { ev.preventDefault(); };
          s.ondrop = function (ev) {
            ev.preventDefault();
            var pi = parseInt(ev.dataTransfer.getData('text/plain'), 10);
            if (!isNaN(pi) && missing.indexOf(si) >= 0) trySnap(pi, si);
          };
        });
        body.querySelectorAll('[data-oi]').forEach(function (btn) {
          btn.onclick = function () {
            var oi = parseInt(btn.getAttribute('data-oi'), 10);
            if (oi === rd.answer) {
              btn.classList.add('ok');
              A.playSfx('sfx_swish');
              awardTeamStar(1);
              setCompanion('excited', rd.say, true);
              setTimeout(function () {
                rIdx++;
                if (rIdx < rounds.length) renderRound(); else completeNode(node.id);
              }, 1400);
            } else {
              btn.classList.add('wrong');
              A.playSfx('sfx_boing');
              setCompanion('encouraging', 'Look at the picture you just fixed!', false);
            }
          };
        });
      }
      paint();
    }
    renderRound();
  }

  /* ==================== NODE 12: FESTIVAL NOTES (PROGRAM CARDS) ==================== */
  function runNode12Program(node) {
    var items = D.ACTIVITIES[12].items;
    var idx = 0;
    var body = buildShell(node, 'Card 1 / ' + items.length);

    function render() {
      var it = items[idx];
      q('act-prog').textContent = 'Card ' + (idx + 1) + ' / ' + items.length;
      body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:18px;background:#fff;border:4px solid #ff5fa2;border-radius:24px;padding:14px 22px;">' +
        '<img src="' + it.img + '" style="width:125px;height:125px;object-fit:contain;" alt="Story card">' +
        '<div id="prog-sent" style="font-size:clamp(1.3rem,2.1vw,1.9rem);font-weight:900;">' + esc(it.sentence) + '</div>' +
      '</div>' +
      '<div class="choice-grid">' + it.options.map(function (opt, i) {
        return '<button type="button" class="choice-btn" data-i="' + i + '">🎟️ ' + esc(opt) + '</button>';
      }).join('') + '</div>';

      body.querySelectorAll('.choice-btn').forEach(function (btn) {
        btn.onclick = function () {
          var i = parseInt(btn.getAttribute('data-i'), 10);
          A.speak(it.options[i]);
          if (i === it.answer) {
            btn.classList.add('ok');
            q('prog-sent').textContent = it.sentence.replace('______', it.options[i]);
            A.playSfx('sfx_chime');
            awardTeamStar(1);
            setCompanion('excited', 'Stamped! ' + it.say, true);
            setTimeout(function () {
              idx++;
              if (idx < items.length) render(); else completeNode(node.id);
            }, 1500);
          } else {
            btn.classList.add('wrong');
            A.playSfx('sfx_boing');
            setCompanion('encouraging', 'Hmm, remember the story and try again!', false);
          }
        };
      });
    }
    render();
  }

  /* ==================== NODE 13: STORY SEQUENCE (ORDER FESTIVAL DAY!) ==================== */
  function runNode13Sequence(node) {
    var correct = D.ACTIVITIES[13].cards;
    // Deterministic scrambled start order so it is never pre-solved
    var order = [correct[2], correct[0], correct[3], correct[1]];
    var selectedIdx = null;
    var body = buildShell(node, 'Order 1 → 4');

    function paint() {
      body.innerHTML = '<div style="text-align:center;font-weight:900;font-size:1.18rem;">Tap two cards (or drag one onto another) to swap them into order 1 → 2 → 3 → 4!</div>' +
        '<div class="seq-grid">' + order.map(function (c, i) {
          var isRight = c.step === i + 1;
          return '<button type="button" class="seq-card' + (selectedIdx === i ? ' selected' : '') + (isRight ? ' correct' : '') + '" draggable="true" data-si="' + i + '">' +
            '<span class="seq-num">Step ' + (i + 1) + '</span>' +
            '<img src="' + c.img + '" alt="Story step">' +
            '<span>' + esc(c.text) + '</span>' +
          '</button>';
        }).join('') + '</div>' +
        '<div style="text-align:center;margin-top:8px;">' +
          '<button type="button" class="btn green" id="btn-check-seq" style="min-height:58px;font-size:1.2rem;padding:10px 26px;">🎭 Open the Curtains! (Check Order)</button>' +
        '</div>';

      function swap(a, b) {
        if (a === b) return;
        var tmp = order[a]; order[a] = order[b]; order[b] = tmp;
        selectedIdx = null;
        A.playSfx('sfx_page_turn');
        paint();
      }

      body.querySelectorAll('[data-si]').forEach(function (card) {
        var si = parseInt(card.getAttribute('data-si'), 10);
        card.onclick = function () {
          A.speak(order[si].text);
          if (selectedIdx === null) { selectedIdx = si; paint(); }
          else if (selectedIdx === si) { selectedIdx = null; paint(); }
          else swap(selectedIdx, si);
        };
        card.ondragstart = function (ev) { ev.dataTransfer.setData('text/plain', String(si)); };
        card.ondragover = function (ev) { ev.preventDefault(); };
        card.ondrop = function (ev) {
          ev.preventDefault();
          var from = parseInt(ev.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(from)) swap(from, si);
        };
      });

      q('btn-check-seq').onclick = function () {
        var allOk = order.every(function (c, i) { return c.step === i + 1; });
        if (allOk) {
          A.playSfx('sfx_curtain');
          completeNode(node.id);
        } else {
          A.playSfx('sfx_boing');
          setCompanion('encouraging', 'Green cards are in the right place! Swap the blue ones!', true);
        }
      };
    }
    paint();
  }

  /* ==================== TEACHER DRAWER & GLOBAL CONTROLS ==================== */
  function buildQuickJump() {
    el.jumpGrid.innerHTML = D.NODES.map(function (n) {
      var z = D.ZONES[n.zone];
      return '<button type="button" class="btn cream" data-jnode="' + n.id + '" style="justify-content:flex-start;border-color:' + z.color + ';border-bottom-color:' + z.dark + ';">' +
        n.icon + ' #' + n.id + ' ' + esc(n.short) +
      '</button>';
    }).join('');
    el.jumpGrid.querySelectorAll('[data-jnode]').forEach(function (b) {
      b.onclick = function () {
        el.drawerBack.classList.remove('open');
        openNode(parseInt(b.getAttribute('data-jnode'), 10));
      };
    });
  }

  function bindGlobalEvents() {
    el.btnMap.onclick = function () { A.playSfx('sfx_page_turn'); showMap(); };
    el.btnJump.onclick = function () { buildQuickJump(); el.drawerBack.classList.add('open'); };
    q('btn-close-drawer').onclick = function () { el.drawerBack.classList.remove('open'); };
    el.drawerBack.onclick = function (ev) { if (ev.target === el.drawerBack) el.drawerBack.classList.remove('open'); };

    q('btn-spin-team').onclick = function () {
      state.activeTeam = Math.floor(Math.random() * 4);
      renderTeams();
      var t = D.TEAMS[state.activeTeam];
      A.playSfx('sfx_whistle');
      FX.burst(root.innerWidth * 0.5, root.innerHeight * 0.5, 'star', 24);
      setCompanion('excited', 'Team Spinner chose ' + t.name + '! Your turn at the board!', true);
      el.drawerBack.classList.remove('open');
    };
    q('btn-reset-act').onclick = function () {
      el.drawerBack.classList.remove('open');
      if (state.view === 'activity') renderActivity(state.currentNode);
    };
    q('btn-watch-cutscene').onclick = function () {
      el.drawerBack.classList.remove('open');
      showZone3Cutscene(11);
    };
    q('btn-watch-finale').onclick = function () {
      el.drawerBack.classList.remove('open');
      showFinale();
    };

    el.btnBravo.onclick = function () {
      A.playSfx('sfx_applause');
      awardTeamStar(1, root.innerWidth * 0.5, root.innerHeight * 0.35);
      setCompanion('excited', 'Bravo! Fantastic speaking at the board!', true);
    };
    el.btnReplay.onclick = function () { A.replay(); };
    el.btnSlow.onclick = function () {
      var on = A.toggleSlow();
      el.btnSlow.classList.toggle('on', on);
      el.btnSlow.textContent = on ? '🐢 Slow: ON' : '🐢 Slow';
    };
    el.btnBgm.onclick = function () {
      var muted = A.toggleBgm();
      el.btnBgm.classList.toggle('on', !muted);
      el.btnBgm.textContent = muted ? '🎵 BGM: OFF' : '🎵 BGM: ON';
    };
    el.btnSfx.onclick = function () {
      var muted = A.toggleSfx();
      el.btnSfx.textContent = muted ? '🔇' : '🔊';
    };
    el.compBox.onclick = function () { A.speak(el.compSay.textContent); };

    el.teamsBar.onclick = function (ev) {
      var b = ev.target.closest('[data-team]');
      if (!b) return;
      state.activeTeam = parseInt(b.getAttribute('data-team'), 10);
      renderTeams();
      var z = state.view === 'activity' ? (D.NODES[state.currentNode - 1] || D.NODES[0]).zone : 1;
      applyZoneTheme(z);
      setCompanion('idle', D.TEAMS[state.activeTeam].name + ' is up next!', false);
    };
  }

  function boot() {
    initDom();
    FX.initFX(q('fx-canvas'));
    renderTeams();
    updateStarsPill();
    bindGlobalEvents();
    showTitle();

    root.CTCApp = {
      state: state,
      showMap: showMap,
      openNode: openNode,
      showFinale: showFinale
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
