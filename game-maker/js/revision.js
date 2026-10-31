/* Game Maker: revision tools for the 4 units.
   1. Smart mix: a question set that brings back what the class missed (spaced repetition).
   2. Remember first: before a game the screen reminds everybody of the language (look and say, cover and recall, warm-up check).
   3. Answer cards: every pupil answers on a paper card; the teacher taps how many were right. Nobody waits.
   4. Exit ticket: 3 questions on paper; the teacher taps who got them right. Builds each pupil's level for each question.
   5. Remember 5: a 5 minute daily practice built from what the class still misses.
   Data stays in this browser (localStorage eaa_revision_v1). The platform's Command Center shows it and syncs it to the cloud. No pupil name is ever shown to the class. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, KEY = 'eaa_revision_v1', LV = ['New', 'Learning', 'Known', 'Mastered'];

  /* ---------------- data ---------------- */
  function hash(s) { var x = 5381, i; for (i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36); }
  function keyOf(it) { return hash(String(it.q) + '|' + String(it.a)); }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.v === 1) { d.items = d.items || {}; d.cls = d.cls || {}; d.pup = d.pup || {}; return d; } } catch (e) { /* new */ } return { v: 1, items: {}, cls: {}, pup: {} }; }
  function save(d) { d.at = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* not remembered */ } }
  function today() { return new Date().toISOString().slice(0, 10); }
  function st() { return GM.state || {}; }
  function recClass(classId, it, frac) {
    if (!classId || !it || !it.q) return;
    var d = load(), k = keyOf(it), c = d.cls[classId] = d.cls[classId] || {}, r = c[k] = c[k] || { n: 0, s: 0, t: 0 };
    r.n++; r.s = Math.round((r.s + Math.max(0, Math.min(1, frac))) * 1000) / 1000; r.t = Date.now(); d.items[k] = { q: String(it.q), a: String(it.a) }; save(d);
  }
  function recPupil(d, sid, it, ok) {
    var k = keyOf(it), p = d.pup[sid] = d.pup[sid] || {}, r = p[k] = p[k] || { lv: 0, n: 0, ok: 0, t: 0, d: '' };
    if (ok) { if (r.lv < 2) r.lv++; else if (r.lv === 2 && r.d !== today()) r.lv = 3; r.ok++; } else r.lv = Math.max(0, r.lv - 1);
    r.n++; r.t = Date.now(); r.d = today(); d.items[k] = { q: String(it.q), a: String(it.a) };
  }
  /* how much the class still needs this question: missed questions first, then the ones not seen for a while, then new ones */
  function need(classId, it) {
    var c = (load().cls[classId] || {})[keyOf(it)];
    if (!c || !c.n) return 0.55 + Math.random() * 0.1;
    var mean = c.s / c.n, age = Math.min(1, (Date.now() - c.t) / (14 * 864e5));
    return (1 - mean) * 0.8 + age * 0.25 + Math.random() * 0.05;
  }
  function pick(items, n, classId) {
    var seen = {}, list = items.filter(function (it) { var k = keyOf(it); if (seen[k]) return false; seen[k] = 1; return true; });
    list.forEach(function (it) { it._need = need(classId, it); });
    list.sort(function (a, b) { return b._need - a._need; });
    return U.shuffle(list.slice(0, n));
  }
  function gradeOf(classId) {
    var c = (GM.mon.classes() || []).filter(function (x) { return x.id === classId; })[0], m = c && /(\d)/.exec(c.label || c.id); return m ? +m[1] : 0;
  }
  function pool(grade) {
    var out = [];
    (GM.sets || []).forEach(function (s) { if (s.grade === grade && !s.smart && s.id !== 'halloween' && s.items) out = out.concat(s.items); });
    return out;
  }
  /* the smart sets: the questions are chosen when the game starts, from every question set of that grade */
  [3, 4].forEach(function (g) {
    var s = { id: 'smart-g' + g, title: 'Smart mix · Grade ' + g, grade: g, e: '🧠', smart: true };
    Object.defineProperty(s, 'items', { get: function () { return pick(pool(g), 20, st().classId); }, enumerable: true });
    (GM.sets = GM.sets || []).push(s);
  });

  /* ---------------- small ui helpers ---------------- */
  function stage() { return document.getElementById('gm-stage'); }
  function layer(cls) { var o = h('div', { class: 'gm-rev ' + (cls || '') }); stage().appendChild(o); return o; }
  function say(t) { try { A.speak(t); } catch (e) { /* no voice */ } }
  function team0() { var t = (st().teams || [])[0]; return t || { name: 'Class', color: '#38bdf8', score: 0, mon: GM.mon.defaults(1, 'classic')[0] }; }
  function sentence(it) {
    var q = String(it.q), a = String(it.a);
    if (/_{2,}/.test(q)) return { full: q.replace(/_{2,}/, a), gap: q.replace(/_{2,}/, '▢▢▢▢'), a: a, mark: true };
    return { full: q + ' → ' + a, gap: q + ' → ▢▢▢', a: a, mark: false, spoken: q + ' ' + a };
  }
  function bar(o, title, step, total, onSkip) {
    var b = h('div', { class: 'gm-rev-bar' }, [h('b', { text: title }), h('span', { class: 'gm-rev-steps', text: step ? 'Step ' + step + ' of ' + total : '' })]);
    if (onSkip) b.appendChild(btn('Skip ⏭', 'sm ghost', function () { onSkip(); }));
    o.appendChild(b);
  }
  function needClass(cb) {
    if (st().classId) return cb();
    var o = layer('center'); bar(o, '🧠 Which class is this for?', 0, 0, null);
    o.appendChild(h('p', { class: 'gm-rev-p', text: 'The results are saved for this class (privately).' }));
    var row = h('div', { class: 'gm-rev-row' });
    GM.mon.classes().forEach(function (c) { row.appendChild(btn(c.label, 'huge amber', function () { GM.app.setClass(c.id); o.remove(); cb(); })); });
    o.appendChild(row); o.appendChild(btn('◀ Back', 'ghost', function () { o.remove(); }));
  }

  /* ---------------- 2. Remember first ---------------- */
  function check(items, done) {
    var i = 0;
    (function next() {
      if (i >= items.length) return done();
      var it = items[i++];
      U.ask({ q: it.q, a: it.a, w: it.w || [], pic: it.pic || '' }, team0(), { timer: 0, label: 'Warm-up ' + i + ' of ' + items.length }).then(function (r) { if (r && r.skipped) return done(); next(); });
    })();
  }
  function remember(items, opts, done) {
    opts = opts || {}; var n = opts.points || 8, pts = pick(items, n, st().classId), ck = pts.slice(0, opts.check || 3), o = layer('');
    function end() { try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } if (o.parentNode) o.remove(); done(); }
    function stepLook(k) {
      o.innerHTML = ''; bar(o, '🔁 Remember first', 1, 3, end);
      var it = pts[k], s = sentence(it);
      var big = h('div', { class: 'gm-rev-big' }); if (s.mark) { var parts = s.full.split(s.a); big.appendChild(document.createTextNode(parts[0])); big.appendChild(h('mark', { text: s.a })); big.appendChild(document.createTextNode(parts.slice(1).join(s.a))); } else big.textContent = s.full;
      o.appendChild(h('div', { class: 'gm-rev-card' }, [h('div', { class: 'gm-rev-n', text: (k + 1) + ' / ' + pts.length }), it.pic ? h('div', { class: 'gm-rev-pic', html: U.pic(it.pic) }) : null, big,
        h('div', { class: 'gm-rev-do', text: 'Listen. Say it together. Then say it to your partner.' })]));
      var row = h('div', { class: 'gm-rev-row' }, [btn('🔊 Hear it again', 'amber', function () { say(s.spoken || s.full); }), btn(k + 1 < pts.length ? 'Next ▶' : 'Cover and recall ▶', 'huge green', function () { A.play('tap'); if (k + 1 < pts.length) stepLook(k + 1); else stepRecall(); })]);
      if (k > 0) row.insertBefore(btn('◀ Back', 'ghost', function () { stepLook(k - 1); }), row.firstChild);
      o.appendChild(row); setTimeout(function () { say(s.spoken || s.full); }, 250);
    }
    function stepRecall() {
      o.innerHTML = ''; bar(o, '🔁 Remember first', 2, 3, end);
      o.appendChild(h('p', { class: 'gm-rev-p', text: 'Cover and recall. Say or write the missing words on your card. Then tap to check.' }));
      var list = h('div', { class: 'gm-rev-list' });
      pts.forEach(function (it) {
        var s = sentence(it), b = h('button', { type: 'button', class: 'gm-rev-row1', text: s.gap });
        b.addEventListener('click', function () { if (b.classList.contains('open')) { say(s.spoken || s.full); return; } b.classList.add('open'); b.textContent = s.full; A.play('tap'); say(s.spoken || s.full); });
        list.appendChild(b);
      });
      o.appendChild(list);
      o.appendChild(h('div', { class: 'gm-rev-row' }, [btn('◀ Look again', 'ghost', function () { stepLook(0); }), btn('Warm-up check ▶', 'huge green', function () { A.play('tap'); o.innerHTML = ''; bar(o, '🔁 Remember first', 3, 3, end); o.appendChild(h('p', { class: 'gm-rev-p', text: 'Three easy questions. Everybody answers on a card.' })); setTimeout(function () { if (o.parentNode) o.remove(); check(ck, done); }, 700); })]));
    }
    if (!pts.length) return done();
    stepLook(0);
  }

  /* ---------------- 3. Answer cards: the class tally ---------------- */
  var TALLY = [['All', 1, '🙌'], ['Most', 0.75, '👍'], ['About half', 0.5, '🤔'], ['A few', 0.25, '😬'], ['None', 0, '🫥']];
  function tally(item, res, n) {
    return new Promise(function (resolve) {
      var cfg = st().cfg || {};
      if (!cfg.cards || !st().classId || (res && res.skipped)) { if (st().classId && !(res && res.skipped)) recClass(st().classId, item, res && res.ok ? (res.second ? 0.5 : 1) : 0); return resolve(); }
      var o = layer('center small');
      o.appendChild(h('div', { class: 'gm-rev-ans', html: 'The answer is <mark>' + String(item.a).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</mark>' }));
      o.appendChild(h('p', { class: 'gm-rev-p', text: (n ? 'Line ' + n + ': cards' : 'Cards') + ' up! How many pupils had it right?' }));
      var row = h('div', { class: 'gm-rev-row wrap' });
      TALLY.forEach(function (t) { row.appendChild(btn(t[2] + ' ' + t[0], t[1] >= 0.75 ? 'green' : t[1] >= 0.5 ? 'amber' : 'coral', function () { recClass(st().classId, item, t[1]); if (n) GM.sessionTally.push({ n: n, item: item, f: t[1] }); o.remove(); resolve(); })); });
      row.appendChild(btn('Skip', 'sm ghost', function () { o.remove(); resolve(); }));
      o.appendChild(row);
    });
  }
  /* with answer cards on, every game question gets a number (pupils write it on that line of the answer sheet) and the class tally is kept for the review at the end */
  GM.cardNo = 0; GM.sessionTally = [];
  var rawAsk = U.ask;
  U.ask = function (item, team, opts) {
    var cfg = st().cfg || {}, n = 0, warm = opts && /^Warm-up/.test(String(opts.label || ''));
    var p = rawAsk(item, team, opts);
    if (cfg.cards && st().classId && !warm) {
      n = ++GM.cardNo;
      var heads = document.querySelectorAll('#gm-stage .gm-qhead'), hd = heads[heads.length - 1];
      if (hd && hd.children[1]) hd.insertBefore(h('div', { class: 'gm-qno', text: '✏️ Line ' + n }), hd.children[1]);
    }
    return p.then(function (res) { return tally(item, res, n).then(function () { return res; }); });
  };
  /* the questions the class found hard in this game (half or fewer cards right), hardest first */
  function hardList() { return (GM.sessionTally || []).filter(function (x) { return x.f <= 0.5; }).sort(function (a, b) { return a.f - b.f || a.n - b.n; }); }
  function hardReview(onBack) {
    var L = hardList(), o = layer('');
    bar(o, '📋 What we found hard', 0, 0, null);
    o.appendChild(h('p', { class: 'gm-rev-p', text: L.length ? 'Check your paper. Tap a question to see the answer, then say it together.' : 'Every question was right for most of the class. Well done!' }));
    var TXT = { 1: '🙌 All', 0.75: '👍 Most', 0.5: '🤔 About half', 0.25: '😬 A few', 0: '🫥 None' };
    var list = h('div', { class: 'gm-rev-list' });
    L.forEach(function (x) {
      var s = sentence(x.item), b = h('button', { type: 'button', class: 'gm-rev-row1', text: 'Line ' + x.n + ' · ' + s.gap + '   (' + (TXT[x.f] || '') + ')' });
      b.addEventListener('click', function () { b.classList.add('open'); b.textContent = 'Line ' + x.n + ' · ' + s.full; A.play('tap'); say(s.spoken || s.full); });
      list.appendChild(b);
    });
    o.appendChild(list);
    var row = h('div', { class: 'gm-rev-row' }, [btn('◀ Back', 'ghost', function () { o.remove(); if (onBack) onBack(); })]);
    if (L.length) row.appendChild(btn('🧠 Practise these ' + Math.min(6, L.length), 'huge green', function () { o.remove(); remember(L.slice(0, 6).map(function (x) { return x.item; }), { points: Math.min(6, L.length), check: Math.min(3, L.length) }, function () { if (onBack) onBack(); }); }));
    o.appendChild(row);
  }

  /* ---------------- 4. Exit ticket ---------------- */
  function exitTicket(items) {
    needClass(function () {
      var classId = st().classId, qs = pick(items, 3, classId), o = layer(''), pupils = GM.mon.pupils(classId);
      if (!qs.length) { o.remove(); return; }
      bar(o, '📝 Exit ticket', 1, 2, function () { o.remove(); });
      o.appendChild(h('p', { class: 'gm-rev-p', text: 'Write the answers on your paper. Three questions.' }));
      var list = h('div', { class: 'gm-rev-ticket' }), shown = false, ans = [];
      qs.forEach(function (it, i) {
        var opts = U.shuffle([it.a].concat((it.w || []).slice(0, 3)).filter(Boolean)), a = h('div', { class: 'gm-rev-tans', text: '' });
        ans.push(function () { a.textContent = '✅ ' + it.a; a.classList.add('on'); });
        list.appendChild(h('div', { class: 'gm-rev-tq' }, [h('b', { text: (i + 1) + '. ' + String(it.q) }), h('div', { class: 'gm-rev-opts', text: opts.map(function (x, k) { return 'ABCD'[k] + ' ' + x; }).join('    ') }), a]));
      });
      o.appendChild(list);
      var row = h('div', { class: 'gm-rev-row' }, [btn('Show the answers', 'amber', function () { if (shown) return; shown = true; ans.forEach(function (f) { f(); }); A.play('right'); }), btn('Mark the papers ▶', 'huge green', function () { marking(); })]);
      o.appendChild(row);
      function marking() {
        o.innerHTML = ''; bar(o, '📝 Exit ticket · marking', 2, 2, function () { o.remove(); });
        o.appendChild(h('p', { class: 'gm-rev-p', text: 'Do this on your own screen, not on the board. Tap a box: ✓ right, ✗ wrong, empty = not marked.' }));
        var marks = {}, tbl = h('div', { class: 'gm-rev-tbl' });
        tbl.appendChild(h('div', { class: 'gm-rev-prow' }, [h('span', { class: 'gm-rev-pname', text: '' }), h('b', { class: 'gm-rev-qh', text: 'Q1' }), h('b', { class: 'gm-rev-qh', text: 'Q2' }), h('b', { class: 'gm-rev-qh', text: 'Q3' })]));
        pupils.forEach(function (p) {
          var row1 = h('div', { class: 'gm-rev-prow' }, [h('span', { class: 'gm-rev-pname', text: p.name })]);
          for (var q = 0; q < qs.length; q++) (function (q) {
            var b = h('button', { type: 'button', class: 'gm-rev-mark', text: '' });
            b.addEventListener('click', function () { var m = marks[p.id] = marks[p.id] || []; m[q] = m[q] === 1 ? 0 : m[q] === 0 ? undefined : 1; b.textContent = m[q] === 1 ? '✓' : m[q] === 0 ? '✗' : ''; b.className = 'gm-rev-mark' + (m[q] === 1 ? ' ok' : m[q] === 0 ? ' no' : ''); A.play('tap'); });
            row1.appendChild(b);
          })(q);
          tbl.appendChild(row1);
        });
        o.appendChild(tbl);
        o.appendChild(h('div', { class: 'gm-rev-row' }, [btn('◀ Back', 'ghost', function () { o.remove(); exitTicket(items); }), btn('💾 Save', 'huge green', function () {
          var d = load(), n = 0, right = [0, 0, 0], seenq = [0, 0, 0];
          Object.keys(marks).forEach(function (sid) { marks[sid].forEach(function (v, q) { if (v === 1 || v === 0) { recPupil(d, sid, qs[q], v === 1); seenq[q]++; if (v === 1) right[q]++; n++; } }); });
          qs.forEach(function (it, q) { if (seenq[q]) { var c = d.cls[classId] = d.cls[classId] || {}, k = keyOf(it), r = c[k] = c[k] || { n: 0, s: 0, t: 0 }; r.n++; r.s += right[q] / seenq[q]; r.t = Date.now(); } });
          save(d); o.innerHTML = ''; o.classList.add('center'); o.appendChild(h('div', { class: 'gm-rev-ans', text: n ? '✅ Saved ' + n + ' marks' : 'Nothing was marked' })); o.appendChild(btn('Done', 'huge green', function () { o.remove(); }));
        })]));
      }
    });
  }

  /* ---------------- 5. Remember 5 (daily) ---------------- */
  function daily() {
    needClass(function () {
      var g = gradeOf(st().classId) || ((GM.sets || []).filter(function (s) { return s.id === st().setId; })[0] || {}).grade || 4;
      var items = pick(pool(g), 5, st().classId);
      remember(items, { points: 5, check: 5 }, function () {
        var o = layer('center'); o.appendChild(h('div', { class: 'gm-rev-ans', text: '⭐ Remember 5 done!' })); o.appendChild(h('p', { class: 'gm-rev-p', text: 'See you tomorrow for 5 more.' })); o.appendChild(btn('Done', 'huge green', function () { o.remove(); GM.app.go('home'); }));
        A.play('win'); U.confetti(24);
      });
    });
  }

  GM.rev = { hardList: hardList, hardReview: hardReview, load: load, save: save, keyOf: keyOf, pick: pick, pool: pool, remember: remember, exitTicket: exitTicket, daily: daily, needClass: needClass, LV: LV, recClass: recClass };
})(window);
