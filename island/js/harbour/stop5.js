/* Treasure Island · Chapter 1 · Stop 5: Billy Bones's Sea Chest
   Grade 3 (special days): four padlocks with dates; Billy asks "What special day is 29 October?"; each right answer
   opens a lock. Grade 4 (numbers): Billy says three numbers; turn each dial to it; then ask "Can I open the chest?". */
(function (root) {
  'use strict';
  var H = root.Harbour;
  if (!H || !H.scene) return;
  var FLAT = 'art/flat/';
  var DAYS = [
    { date: '29 October', spoken: 'twenty-nine October', day: 'Republic Day', img: FLAT + 'o_republic_day.webp' },
    { date: '23 April', spoken: 'twenty-three April', day: "Children's Day", img: FLAT + 'o_balloon.webp' },
    { date: '19 May', spoken: 'nineteen May', day: 'Youth and Sports Day', img: 'art/z4/s_players_court.webp' },
    { date: '30 August', spoken: 'thirty August', day: 'Victory Day', img: FLAT + 'subj_trophy.webp' }
  ];
  var CODE = [
    { n: 18, word: 'eighteen', options: [12, 18, 28, 48] },
    { n: 35, word: 'thirty-five', options: [15, 25, 35, 45] },
    { n: 50, word: 'fifty', options: [15, 30, 40, 50] }
  ];

  function chest(S) {
    S.play.insertAdjacentHTML('beforeend',
      '<div class="s5-chest" id="s5-chest"><img class="s5-closed" src="' + FLAT + 'o_billy_chest.webp" alt="" draggable="false">' +
      '<img class="s5-open" src="' + FLAT + 'o_chest_open.webp" alt="" draggable="false"></div>');
  }
  function openChest(S, cb) {
    var c = S.$('#s5-chest');
    if (c) c.classList.add('opened');
    if (root.Ch1Audio && root.Ch1Audio.sfxChestOpen) root.Ch1Audio.sfxChestOpen();
    setTimeout(cb, 1200);
  }

  H.stops[5] = function (ctx) { return ctx.grade === 4 ? numberLock(ctx) : specialDays(ctx); };

  function specialDays(ctx) {
    var order = H.shuffle(DAYS);
    var S = H.scene(ctx, { stop: 5, cls: 's5', bg: ['bg_s5_dock', 'dock'], npc: { art: 'c_billy', name: 'Billy' }, rounds: order.length });
    chest(S);
    var locks = '<div class="s5-locks">';
    DAYS.forEach(function (d, k) { locks += '<div class="s5-lock" data-k="' + k + '"><span>🔒</span><b>' + d.date + '</b></div>'; });
    S.play.insertAdjacentHTML('beforeend', locks + '</div>');
    function round() {
      if (S.closed) return;
      S.quiet();
      var d = order[S.i], k = DAYS.indexOf(d);
      var lock = S.play.querySelector('.s5-lock[data-k="' + k + '"]');
      [].forEach.call(S.play.querySelectorAll('.s5-lock'), function (n) { n.classList.toggle('now', n === lock); });
      var q = 'What special day is ' + d.date + '?';
      S.replay = function () { S.npcSay(q); S.say('What special day is ' + d.spoken + '?'); };
      S.replay();
      var others = H.shuffle(DAYS.filter(function (x) { return x !== d; })).slice(0, 2);
      setTimeout(function () {
        S.choices([{ t: d.day, img: d.img, ok: true, say: "It's " + d.day + '!' }].concat(others.map(function (o) { return { t: o.day, img: o.img, say: "It's " + o.day + '!' }; })), function () {
          lock.classList.remove('now'); lock.classList.add('open');
          lock.querySelector('span').textContent = '🔓';
          S.npcSay(d.date + ' is ' + d.day + '!');
          S.say(d.spoken + ' is ' + d.day + '!', function () {
            if (S.i + 1 >= S.n) openChest(S, function () { S.next(round); });
            else S.next(round);
          });
        }, { cls: 'pics-t' });
      }, 600);
    }
    setTimeout(round, 600);
  }

  function numberLock(ctx) {
    var S = H.scene(ctx, { stop: 5, cls: 's5 g4', bg: ['bg_s5_dock', 'dock'], npc: { art: 'c_billy', name: 'Billy' }, rounds: CODE.length + 1 });
    chest(S);
    var html = '<div class="s5-dials">';
    CODE.forEach(function (c, k) {
      html += '<div class="s5-dial" data-k="' + k + '"><div class="s5-val">?</div><div class="s5-opts">' +
        H.shuffle(c.options).map(function (n) { return '<button type="button" class="s5-opt" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div></div>';
    });
    S.play.insertAdjacentHTML('beforeend', html + '</div>');
    var busy = false, miss = 0;
    function round() {
      if (S.closed) return;
      S.quiet();
      if (S.i >= CODE.length) return askToOpen();
      var c = CODE[S.i], dial = S.play.querySelector('.s5-dial[data-k="' + S.i + '"]');
      miss = 0;
      [].forEach.call(S.play.querySelectorAll('.s5-dial'), function (n) { n.classList.toggle('now', n === dial); });
      S.replay = function () { S.npcSay('Number ' + (S.i + 1) + '!'); S.say('Number ' + (S.i + 1) + ' is ' + c.word + '!'); };
      S.replay();
      [].forEach.call(dial.querySelectorAll('.s5-opt'), function (b) {
        H.mark(b, Number(b.dataset.n) === c.n);
        b.onclick = function () {
          if (busy || S.closed || !dial.classList.contains('now')) return;
          busy = true;
          S.tap();
          var n = Number(b.dataset.n);
          dial.querySelector('.s5-val').textContent = n;
          S.say(String(n), function () {
            if (n === c.n) {
              S.right(dial); dial.classList.remove('now'); dial.classList.add('set');
              [].forEach.call(dial.querySelectorAll('.s5-opt'), function (o) { o.disabled = true; H.mark(o, false); });
              setTimeout(function () { busy = false; S.next(round); }, 500);
            } else {
              S.wrong(b, c.word); miss++;
              setTimeout(function () {
                busy = false; dial.querySelector('.s5-val').textContent = '?';
                if (miss >= 2) { S.hints++; var g = dial.querySelector('.s5-opt[data-n="' + c.n + '"]'); if (g) g.classList.add('hint'); S.slow(c.word); }
                else S.say('Listen! ' + c.word + '!');
              }, 700);
            }
          });
        };
      });
    }
    function askToOpen() {
      var q = 'Click! Now ask me politely!';
      S.replay = function () { S.npcSay(q); S.say(q); };
      S.replay();
      setTimeout(function () {
        S.choices([
          { t: 'Can I open the chest?', ic: '🗝️', ok: true },
          { t: 'Close the door.', ic: '🚪' },
          { t: 'Fifty coins!', ic: '🪙' }
        ], function () {
          S.npcSay('Yes, you can!');
          S.say('Yes, you can!', function () { openChest(S, function () { S.next(round); }); });
        });
      }, 500);
    }
    setTimeout(round, 600);
  }
})(typeof window !== 'undefined' ? window : this);
