/* Practice Island 2.0 — the mini-games. Each zone is one little game, and a wrong answer is only ever funny.
   The answers still go through IslandApp (pickOption, placeBuildWord...), so stars and XP work exactly as before. */
(function (root) {
  'use strict';

  var GAMES = {
    1: { name: 'Fix-it Factory', cls: 'gm-z1', target: { pic: 'o_machine', other: 'z_meadow', emoji: '🏭' }, token: '⚙️', mark: '💡', start: 'Tap the right gear!', right: ['It fits!', 'Whirr! Good!', 'Clank! Great!'], wrong: 'Boing! Try again!' },
    2: { name: 'Signal Fishing', cls: 'gm-z2', target: { pic: 'o_lighthouse', other: 'z_beach', emoji: '🗼' }, token: '🐟', mark: '🔆', start: 'Catch the right fish!', right: ['Got it!', 'A new light!', 'Nice catch!'], wrong: 'Bye, fish! Try again!' },
    3: { name: 'River Hop', cls: 'gm-z3', target: { pic: 'o_market', other: 'z_forest', emoji: '🏪' }, token: '', mark: '🏷️', start: 'Hop to the right stone!', right: ['Hop! Good!', 'Dry feet!', 'Great hop!'], wrong: 'Splash! Try again!' },
    4: { name: 'Hiccup Rockets', cls: 'gm-z4', target: { pic: 'o_volcano', other: 'z_mountain', emoji: '🌋' }, token: '🫧', mark: '💧', start: 'Hit the right bubble!', right: ['Pop! Good!', 'Less hiccups!', 'Splash! Great!'], wrong: 'Hic! Try again!' }
  };
  var CAVE = { name: 'Echo Cave', target: { pic: 'o_cave', emoji: '🕳️' }, start: 'Listen, then say it loud!' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function zoneOf(mission, unlockedCount) {
    var p = root.IslandStory.parseId(mission.id);
    if (p) return p.zone;
    var day = new Date().getDate();
    return 1 + (day % Math.max(1, unlockedCount || 1));
  }

  function marks(game, done, total) {
    var out = '';
    for (var i = 0; i < total; i++) out += '<span class="gm-mark' + (i < done ? ' on' : '') + '">' + game.mark + '</span>';
    return out;
  }

  function sceneRow(game, zone, run, monsterHtml, startText) {
    var target = (game.target || GAMES[zone].target);
    var calm = zone === 4 ? ' style="--calm:' + (run.qIndex / Math.max(1, run.total)) + '"' : '';
    return (
      '<div class="gm-row">' +
        '<div class="gm-actor gm-player" id="gm-player"><div class="gm-player-sprite">' + monsterHtml + '</div><div class="gm-disc"></div></div>' +
        '<div class="gm-target" id="gm-target"' + calm + '>' +
          root.IslandStory.pic(target.pic, target.emoji, 'gm-target-pic', target.other) +
          '<div class="gm-marks">' + marks(GAMES[zone], run.qIndex, run.total) + '</div>' +
        '</div>' +
        '<div class="gm-actor gm-friend" id="gm-friend">' +
          '<div class="gm-bubble gm-bubble-mini" id="gm-cheer">' + esc(run.cheerText || startText) + '</div>' +
          root.IslandStory.charPic(zone, 'gm-friend-pic') +
        '</div>' +
      '</div>'
    );
  }

  function promptBox(q, qType) {
    if (qType === 'listen') {
      return '<div class="gm-prompt"><span class="gm-prompt-pic">' + esc(q.pic || '🎧') + '</span><span class="isl-q-text">' + esc(q.prompt || 'Listen and tap the matching word!') + '</span>' +
        '<button type="button" class="isl-btn cyan gm-hear" id="isl-listen-btn" onclick="IslandApp.replayMissionAudio()">🔊 Listen</button></div>';
    }
    return '<div class="gm-prompt"><span class="gm-prompt-pic">' + esc(q.pic || '📖') + '</span><span class="isl-q-text">' + esc(q.q) + '</span>' +
      '<button type="button" class="isl-btn gm-hear" onclick="IslandApp.replayMissionAudio()">🔊</button></div>';
  }

  function tokenFor(zone, game, idx) {
    if (zone === 2) return ['🐟', '🐠', '🐡', '🐟'][idx % 4];
    return game.token;
  }

  function choiceGame(zone, run, q, qType, monsterHtml) {
    var game = GAMES[zone];
    var opts = q.options || [q.a];
    var isStar = !!run.mission.isStar;
    return (
      promptBox(q, qType) +
      '<div class="gm-world">' +
        sceneRow(game, zone, run, monsterHtml, game.start) +
        '<div class="gm-field">' +
          opts.map(function (opt, idx) {
            var speaker = isStar ? '<span class="isl-opt-speaker" onclick="event.stopPropagation(); IslandApp.speakText(\'' + esc(opt) + '\')">🔊</span> ' : '';
            var token = tokenFor(zone, game, idx);
            return '<div class="gm-lane gm-lane-' + (idx % 4) + '">' +
              '<button type="button" class="isl-btn isl-opt-btn gm-tok" data-opt="' + esc(opt) + '" onclick="IslandApp.pickOption(' + idx + ',this)">' +
                (token ? '<span class="gm-tok-icon">' + token + '</span>' : '') + speaker + '<span class="gm-tok-word">' + esc(opt) + '</span>' +
              '</button>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>'
    );
  }

  /* Word match and sentence building keep their tiles and get the zone's world around them */
  function wrapped(zone, run, monsterHtml, bodyHtml, qType) {
    var game = GAMES[zone];
    var start = qType === 'build' ? (zone === 3 ? 'Hop on the words in order!' : 'Put the words in order!') : 'Match them for me!';
    return '<div class="gm-world gm-tiles">' + sceneRow(game, zone, run, monsterHtml, start) + bodyHtml + '</div>';
  }

  function cave(zone, run, monsterHtml, bodyHtml) {
    return '<div class="gm-world gm-cave"><div class="gm-cave-name">🦇 ' + CAVE.name + '</div>' + sceneRow(CAVE, zone, run, monsterHtml, CAVE.start) + bodyHtml + '<div class="gm-echoes" id="gm-echoes"></div></div>';
  }

  /* bodyHtml is the plain version from app.js, used for the word tiles and the say box */
  function render(run, q, qType, monsterHtml, bodyHtml, unlockedCount) {
    var zone = run.zone || (run.zone = zoneOf(run.mission, unlockedCount));
    var html;
    if (qType === 'listen' || qType === 'read') html = choiceGame(zone, run, q, qType, monsterHtml);
    else if (qType === 'say') html = cave(zone, run, monsterHtml, bodyHtml);
    else html = wrapped(zone, run, monsterHtml, bodyHtml, qType);
    return '<div class="gm-stage ' + GAMES[zone].cls + '" id="gm-stage" data-game="' + esc(qType === 'say' ? CAVE.name : GAMES[zone].name) + '">' + html + '</div>';
  }

  function cheer(text) {
    var el = document.getElementById('gm-cheer');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function centre(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /* Something small flies from one place to another across the game */
  function fly(fromEl, toEl, content, ms) {
    if (!fromEl || !toEl) return;
    var a = centre(fromEl), b = centre(toEl);
    var f = document.createElement('div');
    f.className = 'gm-fly';
    f.innerHTML = content;
    f.style.left = a.x + 'px';
    f.style.top = a.y + 'px';
    document.body.appendChild(f);
    var hop = Math.min(a.y, b.y) - 50;
    var mid = { x: (a.x + b.x) / 2, y: hop };
    if (f.animate) {
      f.animate([
        { transform: 'translate(-50%,-50%) scale(1)' },
        { transform: 'translate(calc(-50% + ' + (mid.x - a.x) + 'px),calc(-50% + ' + (mid.y - a.y) + 'px)) scale(1.3)', offset: 0.55 },
        { transform: 'translate(calc(-50% + ' + (b.x - a.x) + 'px),calc(-50% + ' + (b.y - a.y) + 'px)) scale(0.7)' }
      ], { duration: ms || 520, easing: 'ease-in-out', fill: 'forwards' });
    }
    setTimeout(function () { f.remove(); }, (ms || 520) + 60);
  }

  function burst(el, emoji) {
    if (!el) return;
    var c = centre(el);
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('div');
      s.className = 'gm-spark';
      s.textContent = emoji || '✨';
      s.style.left = c.x + 'px';
      s.style.top = c.y + 'px';
      var ang = (i / 7) * Math.PI * 2;
      s.style.setProperty('--dx', Math.round(Math.cos(ang) * 70) + 'px');
      s.style.setProperty('--dy', Math.round(Math.sin(ang) * 60) + 'px');
      document.body.appendChild(s);
      setTimeout(function (n) { n.remove(); }.bind(null, s), 700);
    }
  }

  function shake() {
    var st = document.getElementById('gm-stage');
    if (!st) return;
    st.classList.remove('gm-shake');
    void st.offsetWidth;
    st.classList.add('gm-shake');
  }

  function lightNextMark() {
    var m = document.querySelector('#gm-target .gm-mark:not(.on)');
    if (m) m.classList.add('on', 'pop');
  }

  /* A right answer: the action of that zone's game */
  function onRight(zone, btn, run) {
    var game = GAMES[zone];
    if (!game) return;
    run.cheerText = game.right[Math.floor(Math.random() * game.right.length)];
    cheer(run.cheerText);
    var target = document.getElementById('gm-target');
    var player = document.getElementById('gm-player');
    var friend = document.getElementById('gm-friend');
    var word = btn ? (btn.querySelector('.gm-tok-word') || {}).textContent || '' : '';
    if (btn) btn.closest('.gm-lane') && btn.closest('.gm-lane').classList.add('gm-picked');

    if (zone === 1) {
      fly(btn, target, '⚙️', 460);
      setTimeout(function () { if (target) target.classList.add('gm-jump'); lightNextMark(); burst(target, '💨'); shake(); }, 440);
    } else if (zone === 2) {
      fly(btn, player, '🐟', 460);
      setTimeout(function () { lightNextMark(); burst(target, '🔆'); }, 420);
    } else if (zone === 3) {
      root.IslandAudio.playHop();
      if (player) player.classList.add('gm-hop-out');
      fly(player, btn, '<div class="gm-fly-monster">' + (player ? player.querySelector('.gm-player-sprite').innerHTML : '') + '</div>', 500);
      setTimeout(function () { lightNextMark(); burst(btn, '🏷️'); }, 460);
    } else if (zone === 4) {
      fly(friend, btn, '🚀', 420);
      setTimeout(function () {
        root.IslandAudio.playPop();
        burst(btn, '💧');
        lightNextMark();
        if (target) target.classList.add('gm-calmer');
        shake();
        if (btn) btn.style.visibility = 'hidden';
      }, 400);
    }
    return word;
  }

  /* A wrong answer takes nothing away: just a funny reaction */
  function onWrong(zone, btn, run) {
    var game = GAMES[zone];
    if (!game) return;
    cheer(game.wrong);
    root.IslandAudio.playBoing();
    if (!btn) return;
    var lane = btn.closest('.gm-lane');
    if (zone === 2 && lane) {
      lane.classList.remove('gm-swim-off');
      void lane.offsetWidth;
      lane.classList.add('gm-swim-off');
    }
    if (zone === 3) {
      burst(btn, '💦');
      var p = document.getElementById('gm-player');
      if (p) { p.classList.remove('gm-splash'); void p.offsetWidth; p.classList.add('gm-splash'); }
    }
    if (zone === 4) {
      var t = document.getElementById('gm-target');
      if (t) { t.classList.remove('gm-hic'); void t.offsetWidth; t.classList.add('gm-hic'); }
    }
  }

  /* Echo Cave: the cave answers back */
  function echo(text) {
    root.IslandAudio.playEcho();
    var box = document.getElementById('gm-echoes');
    if (!box) return;
    var last = String(text || '').replace(/[.!?]/g, '').trim().split(/\s+/).pop() || '';
    [0, 1, 2].forEach(function (i) {
      var e = document.createElement('div');
      e.className = 'gm-echo gm-echo-' + i;
      e.textContent = last + '!';
      box.appendChild(e);
    });
    cheer('Your voice is big!');
  }

  root.IslandGames = {
    GAMES: GAMES,
    zoneOf: zoneOf,
    render: render,
    cheer: cheer,
    onRight: onRight,
    onWrong: onWrong,
    echo: echo,
    burst: burst
  };
})(typeof window !== 'undefined' ? window : this);
