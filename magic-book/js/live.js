/* The Magic Book — live pages.
   The real page is taken apart: its own pictures are cut out and move (the guitar swings, the parade marches,
   the awnings flap), every word can be tapped to hear it, and the page's exercises are answered right on the page.
   Data per page: live/G3-p74.json (made by _tmp/live_cut.py + live_build.py). */
(function () {
  'use strict';
  var MB, S, cache = {}, finding = null;
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function key(p) { return 'G' + (S.g === 'g4' ? 4 : 3) + '-p' + p.page; }
  function clean(t) { return String(t).replace(/^[“"'(]+|[”"'.,!?;:)]+$/g, ''); }
  function pct(e, o) { e.style.left = o.x + '%'; e.style.top = o.y + '%'; e.style.width = o.w + '%'; e.style.height = o.h + '%'; }

  function load(k) {
    if (cache[k] !== undefined) return Promise.resolve(cache[k]);
    return fetch('live/' + k + '.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; }).then(function (d) { cache[k] = d; return d; });
  }

  /* ---------- small sounds made in the browser ---------- */
  function tone(freqs, type, len, vol) {
    try {
      var ac = (window.__mbAC = window.__mbAC || new (window.AudioContext || window.webkitAudioContext)());
      freqs.forEach(function (f, i) {
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * (len / 2);
        o.type = type; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .14, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + len);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + len + .05);
      });
    } catch (e) { /* no sound */ }
  }
  var SOUNDS = {
    strum: function () { tone([196, 247, 294, 392], 'triangle', .5, .12); },
    magic: function () { tone([784, 988, 1175, 1568], 'sine', .35, .1); },
    drum: function () { tone([98, 98, 131], 'sine', .3, .3); },
    donkey: function () { tone([520, 260, 520, 260], 'sawtooth', .22, .05); }
  };

  /* ---------- build the live layer of one page ---------- */
  function decorate(pageEl, p, d) {
    if (!pageEl || !d || pageEl.querySelector('.live')) return;
    pageEl.classList.add('is-live');
    pageEl.style.backgroundImage = 'url("' + d.bg + '")';
    var L = el('div', 'live'); L.dataset.page = p.page;
    (d.pieces || []).forEach(function (pc, i) {
      var w = el('div', 'lv-piece lv-hit an-' + (pc.anim || 'bob')); pct(w, pc);
      w.style.backgroundImage = 'url("' + pc.img + '")';
      w.style.transformOrigin = pc.origin || '50% 60%';
      w.style.animationDelay = (-(i * .7) % 4).toFixed(2) + 's';
      w.title = pc.word || '';
      w.addEventListener('click', function (e) { e.stopPropagation(); tapPiece(w, pc); });
      L.appendChild(w);
    });
    (d.words || []).forEach(function (wd) {
      var h = el('div', 'lv-word lv-hit'); pct(h, { x: wd.x - .3, y: wd.y - .4, w: wd.w + .6, h: wd.h + .8 });
      h.dataset.w = clean(wd.t).toLowerCase();
      h.addEventListener('click', function (e) { e.stopPropagation(); tapWord(h, clean(wd.t), p); });
      L.appendChild(h);
    });
    (d.tasks || []).forEach(function (t) { if (t.kind === 'note') noteTask(L, t, p); });
    pageEl.appendChild(L);
  }

  function decorateAll() {
    if (!MB || !S.g) return;
    [].forEach.call(document.querySelectorAll('#book .page-slot .page[data-page]'), function (pg) {
      var p = S.data[S.g].pages[pg.dataset.page]; if (!p) return;
      load(key(p)).then(function (d) { if (d) decorate(pg, p, d); });
    });
  }

  /* ---------- tapping a picture ---------- */
  function tapPiece(w, pc) {
    if (finding) { MB.chime(false); return; }
    w.classList.remove('lv-tap'); void w.offsetWidth; w.classList.add('lv-tap');
    if (SOUNDS[pc.sound]) SOUNDS[pc.sound]();
    bubble(w, (pc.word ? '<b class="lv-bw">' + MB.esc(pc.word) + '</b><br>' : '') + MB.esc(pc.say || ''));
    MB.say(pc.word || '', { rate: .75, end: function () { if (pc.say) setTimeout(function () { MB.say(pc.say, { rate: .88 }); }, 200); } });
  }

  /* ---------- tapping a word ---------- */
  function wordInfo(word) {
    var lw = word.toLowerCase(), hit = null;
    Object.keys(S.data[S.g].pages).some(function (n) {
      return (S.data[S.g].pages[n].popWords || []).some(function (pw) { if (String(pw.word).toLowerCase() === lw) { hit = pw; return true; } return false; });
    });
    return hit;
  }
  function tapWord(h, word, p) {
    if (finding) return checkFind(h, word);
    h.classList.remove('lv-on'); void h.offsetWidth; h.classList.add('lv-on');
    setTimeout(function () { h.classList.remove('lv-on'); }, 1600);
    var info = wordInfo(word);
    if (info) {
      bubble(h, (info.img ? '<img src="' + MB.url(info.img) + '" alt="">' : '') + '<b class="lv-bw">' + MB.esc(word) + '</b><br>' + MB.esc(info.meaning || ''));
      MB.say(word, { rate: .75, end: function () { if (info.meaning) setTimeout(function () { MB.say(info.meaning, { rate: .9 }); }, 200); } });
    } else {
      bubble(h, '<b class="lv-bw">' + MB.esc(word) + '</b>');
      MB.say(word, { rate: .75 });
    }
  }

  /* ---------- exercise 1: a question tag answered right on the page ---------- */
  function noteTask(L, t, p) {
    var spot = (p.spots || []).find(function (s) { return s.id === t.spot; }); if (!spot) return;
    var hit = el('div', 'lv-task lv-hit'); pct(hit, Object.assign({}, t.hit));
    hit.innerHTML = '<span class="lv-ping">✍️</span>';
    var card = el('div', 'lv-note'); card.style.left = t.card.x + '%'; card.style.top = t.card.y + '%'; card.style.width = t.card.w + '%';
    card.hidden = true;
    function done() {
      card.hidden = false;
      card.innerHTML = '<div class="lv-nq">' + MB.esc(spot.prompt) + '</div><div class="lv-na">' + MB.esc(spot.answer) + ' ⭐</div>';
    }
    if (S.solved[spot.id]) done();
    hit.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!card.hidden && S.solved[spot.id]) { card.hidden = true; return; }
      var opts = (spot.options || [spot.answer]).slice().sort(function () { return Math.random() - .5; });
      card.hidden = false;
      card.innerHTML = '<div class="lv-nq">' + MB.esc(spot.prompt) + ' <button class="lv-x" title="Close">✕</button></div>' +
        opts.map(function (o) { return '<button class="lv-opt">' + MB.esc(o) + '</button>'; }).join('') + '<div class="lv-hint" hidden></div>';
      card.querySelector('.lv-x').onclick = function (ev) { ev.stopPropagation(); card.hidden = true; };
      MB.say(spot.prompt);
      [].forEach.call(card.querySelectorAll('.lv-opt'), function (b) {
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (b.textContent === spot.answer) {
            MB.chime(true); MB.say(spot.answer, { rate: .9 });
            S.solved[spot.id] = 1; MB.store('mb-solved-' + S.g + '-' + S.cls, S.solved); MB.updateExCount();
            done(); MB.toast('⭐ Great job!');
          } else {
            b.classList.remove('lv-no'); void b.offsetWidth; b.classList.add('lv-no'); MB.chime(false);
            var hn = card.querySelector('.lv-hint'); hn.hidden = false; hn.textContent = '💡 ' + (spot.hint || 'Try again!');
          }
        });
      });
    });
    L.appendChild(hit); L.appendChild(card);
  }

  /* ---------- exercise 2: Words in Context — find the word in the reading ---------- */
  function findTask(p, d) {
    var t = (d.tasks || []).find(function (x) { return x.kind === 'find'; }); if (!t) return;
    var L = document.querySelector('.live[data-page="' + p.page + '"]'); if (!L) return;
    t.words.forEach(function (w) {
      [].forEach.call(L.querySelectorAll('.lv-word'), function (h) {
        if (h.dataset.w !== w || h.dataset.chip) return;
        // the chip is the copy of the word inside the Words in Context box (lowest on the page)
        var top = parseFloat(h.style.top); if (top < 80) return;
        h.dataset.chip = '1'; h.classList.add('lv-chip');
        h.addEventListener('click', function (e) { e.stopImmediatePropagation(); startFind(w, h); }, true);
      });
    });
  }
  function startFind(word, chip) {
    var spots = [].filter.call(document.querySelectorAll('#book .lv-word'), function (h) { return h.dataset.w === word && !h.dataset.chip; });
    var info = wordInfo(word);
    if (!spots.length) {
      bubble(chip, (info && info.img ? '<img src="' + MB.url(info.img) + '" alt="">' : '') + '<b class="lv-bw">' + MB.esc(word) + '</b><br>' +
        MB.esc((info && info.meaning) || '') + '<br><i>You will find it on the next pages!</i>');
      MB.say(word + '. ' + ((info && info.meaning) || ''), { rate: .85 });
      return;
    }
    finding = { word: word, chip: chip };
    document.querySelector('#book').classList.add('lv-finding');
    chip.classList.add('lv-on');
    bubble(chip, '🔎 Find <b class="lv-bw">' + MB.esc(word) + '</b> in the reading!');
    MB.say('Find the word ' + word + ' in the reading!');
  }
  function checkFind(h, word) {
    var f = finding;
    if (word.toLowerCase() === f.word) {
      finding = null;
      document.querySelector('#book').classList.remove('lv-finding');
      h.classList.add('lv-found'); f.chip.classList.remove('lv-on'); f.chip.classList.add('lv-found');
      var info = wordInfo(word);
      MB.chime(true); MB.toast('⭐ You found it!');
      bubble(h, (info && info.img ? '<img src="' + MB.url(info.img) + '" alt="">' : '') + '<b class="lv-bw">' + MB.esc(word) + '</b><br>' + MB.esc((info && info.meaning) || ''));
      MB.say(word + '. ' + ((info && info.meaning) || ''), { rate: .85 });
    } else {
      h.classList.remove('lv-no'); void h.offsetWidth; h.classList.add('lv-no'); MB.chime(false);
    }
  }

  /* ---------- speech bubble ---------- */
  var bubT = 0;
  function bubble(target, html) {
    var b = $('lv-bubble');
    if (!b) { b = el('div', 'lv-bubble'); b.id = 'lv-bubble'; document.body.appendChild(b); b.addEventListener('click', function () { b.hidden = true; }); }
    b.innerHTML = html; b.hidden = false;
    var r = target.getBoundingClientRect(), bw = b.offsetWidth, bh = b.offsetHeight;
    var top = r.top - bh - 12; if (top < 60) top = r.bottom + 12;
    b.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    b.style.top = Math.min(innerHeight - bh - 8, top) + 'px';
    clearTimeout(bubT); bubT = setTimeout(function () { b.hidden = true; }, 6000);
  }

  function onSpread() {
    finding = null;
    var b = $('lv-bubble'); if (b) b.hidden = true;
    if (!MB || !S.g) return;
    [].forEach.call(document.querySelectorAll('#book .page-slot .page[data-page]'), function (pg) {
      var p = S.data[S.g].pages[pg.dataset.page]; if (!p) return;
      load(key(p)).then(function (d) { if (d) { decorate(pg, p, d); findTask(p, d); } });
    });
  }

  function init() { MB = window.MagicBook; S = MB.state; onSpread(); }
  window.MagicLive = { init: init, onSpread: onSpread };
})();
