/* Revision board (teacher only): what the class missed, each pupil's level, suggested groups and pairs, and the cloud copy.
   Reads the revision records that Game Maker saves in this browser (eaa_revision_v1). Nothing here is ever shown on the class board;
   the cloud copy is one private row ('class-revision-sync') and never touches XP or any other data. */
(function (root) {
  'use strict';
  var KEY = 'eaa_revision_v1', CLOUD_ID = 'class-revision-sync';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.v === 1) { d.items = d.items || {}; d.cls = d.cls || {}; d.pup = d.pup || {}; return d; } } catch (e) { /* new */ } return { v: 1, items: {}, cls: {}, pup: {} }; }
  function save(d) { d.at = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* not remembered */ } }
  function quizPct(id) { try { var q = root.QuizResults && root.QuizResults.scoreOf ? root.QuizResults.scoreOf(id) : null; return q && q.pct != null ? q.pct : null; } catch (e) { return null; } }

  /* ---- numbers ---- */
  function missed(d, classId) {
    var c = d.cls[classId] || {}, out = [];
    Object.keys(c).forEach(function (k) { var r = c[k]; if (r && r.n && d.items[k]) out.push({ q: d.items[k].q, a: d.items[k].a, pct: Math.round(r.s / r.n * 100), n: r.n, t: r.t }); });
    out.sort(function (a, b) { return a.pct - b.pct || b.n - a.n; });
    return out;
  }
  function pupilRow(d, st) {
    var p = d.pup[st.id] || {}, ks = Object.keys(p), lv = [0, 0, 0, 0];
    ks.forEach(function (k) { lv[Math.max(0, Math.min(3, p[k].lv || 0))]++; });
    var marked = ks.length, known = lv[2] + lv[3], rev = marked ? known / marked * 100 : null, qz = quizPct(st.id), score = null;
    if (qz != null && rev != null && marked >= 6) score = Math.round(qz * 0.5 + rev * 0.5); else if (qz != null) score = qz; else if (rev != null && marked >= 6) score = Math.round(rev);
    return { id: st.id, name: st.firstName || String(st.name || '').split(/\s+/)[0] || 'Pupil', lv: lv, marked: marked, qz: qz, score: score };
  }
  function groups(rows) {
    var have = rows.filter(function (r) { return r.score != null; }).sort(function (a, b) { return a.score - b.score; });
    var none = rows.filter(function (r) { return r.score == null; });
    var sup = have.filter(function (r) { return r.score < 40; }), cha = have.filter(function (r) { return r.score >= 70; }), core = have.filter(function (r) { return r.score >= 40 && r.score < 70; }).concat(none);
    var half = Math.floor(have.length / 2), pairs = [];
    for (var i = 0; i < half; i++) pairs.push([have[have.length - 1 - i], have[i]]);
    if (have.length % 2) pairs.push([have[half], null]);
    return { sup: sup, core: core, cha: cha, pairs: pairs, none: none };
  }

  /* ---- cloud copy (own row; read, merge, write) ---- */
  function client() { var A = root.AdventureSupabase; if (!A || !A.isConfigured) return null; try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; } }
  function mergeInto(a, b) {
    Object.keys(b.items || {}).forEach(function (k) { if (!a.items[k]) a.items[k] = b.items[k]; });
    ['cls', 'pup'].forEach(function (w) {
      Object.keys(b[w] || {}).forEach(function (id) {
        a[w][id] = a[w][id] || {};
        Object.keys(b[w][id]).forEach(function (k) { var x = a[w][id][k], y = b[w][id][k]; if (!x || (y && (y.t || 0) > (x.t || 0))) a[w][id][k] = y; });
      });
    });
    return a;
  }
  async function sync() {
    var c = client(); if (!c) throw new Error('not connected to the cloud');
    var res = await c.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle();
    if (res && res.error) throw res.error;
    var remote = null; try { remote = res && res.data && res.data.description ? JSON.parse(res.data.description) : null; } catch (e) { remote = null; }
    var local = load(), merged = remote && remote.v === 1 ? mergeInto(local, remote) : local;
    save(merged);
    var up = await c.from('classes').upsert({ id: CLOUD_ID, name: 'Revision Sync', grade: 'System', teacher: 'System', description: JSON.stringify(merged), archived: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (up && up.error) throw up.error;
    return Object.keys(merged.items).length;
  }

  /* ---- the board ---- */
  function css() {
    if (document.getElementById('rb-css')) return;
    var st = document.createElement('style'); st.id = 'rb-css';
    st.textContent = '.rb-ovl{position:fixed;inset:0;z-index:9500;background:rgba(2,6,15,.78);backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 12px}' +
      '.rb{width:100%;max-width:900px;background:rgba(15,23,42,.96);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:18px 20px;color:#e5edff;font-family:inherit;box-shadow:0 4px 24px rgba(0,0,0,.5)}' +
      '.rb h2{margin:0 0 4px;font-size:1.25rem}.rb h3{margin:16px 0 6px;font-size:1rem;color:#38bdf8}.rb .rb-dim{opacity:.7;font-size:.85rem}' +
      '.rb table{width:100%;border-collapse:collapse;font-size:.88rem}.rb td,.rb th{padding:6px 8px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08)}' +
      '.rb .rb-bar{display:inline-block;height:9px;border-radius:5px;background:#f43f5e;vertical-align:middle}.rb .rb-bar.g{background:#10b981}.rb .rb-bar.y{background:#f59e0b}' +
      '.rb .rb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.rb .rb-box{background:rgba(255,255,255,.05);border-radius:12px;padding:10px 12px}.rb .rb-box b{display:block;margin-bottom:4px}' +
      '.rb button{font:inherit;cursor:pointer;border:0;border-bottom:4px solid rgba(0,0,0,.35);border-radius:10px;padding:7px 12px;background:#0ea5e9;color:#04121f;font-weight:700;margin:2px 4px 2px 0}.rb button.g{background:#10b981}.rb button.x{background:#334155;color:#e5edff}' +
      '@media(max-width:700px){.rb .rb-grid{grid-template-columns:1fr}}';
    document.head.appendChild(st);
  }
  function bar(p) { return '<span class="rb-bar ' + (p >= 70 ? 'g' : p >= 40 ? 'y' : '') + '" style="width:' + Math.max(4, Math.round(p * 0.9)) + 'px"></span> ' + p + '%'; }
  function open() {
    css();
    var old = document.getElementById('rb-ovl'); if (old) old.remove();
    var st = S(), cls = st && st.getActiveClass && st.getActiveClass(); if (!cls) return;
    var ovl = document.createElement('div'); ovl.id = 'rb-ovl'; ovl.className = 'rb-ovl';
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
    document.body.appendChild(ovl);
    function draw(msg) {
      var d = load(), miss = missed(d, cls.id), pupils = (st.getStudents ? st.getStudents(cls.id) : []).filter(function (s) { return !s.archived; }), rows = pupils.map(function (s) { return pupilRow(d, s); }), g = groups(rows);
      function nm(list) { return list.length ? list.map(function (r) { return esc(r.name); }).join(', ') : '<span class="rb-dim">nobody yet</span>'; }
      ovl.innerHTML = '<div class="rb"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div><h2>🔁 Revision · ' + esc(cls.name) + '</h2><div class="rb-dim">Private. Do not show this on the board. Names are first names only.</div></div><button class="x" data-c="1">Close ✕</button></div>' +
        '<div style="margin-top:8px"><button class="g" data-go="daily">🧠 Remember 5 (daily)</button><button class="g" data-go="exit">📝 Exit ticket</button><button data-go="gm">🎮 Game Maker</button><button class="x" data-sync="1">☁ Sync with the cloud</button><span class="rb-dim" data-msg="1"> ' + esc(msg || '') + '</span></div>' +
        '<h3>Most missed by the class</h3>' + (miss.length ? '<table><tr><th>Question</th><th>Answer</th><th>Right</th><th>Seen</th></tr>' + miss.slice(0, 8).map(function (m) { return '<tr><td>' + esc(m.q) + '</td><td>' + esc(m.a) + '</td><td>' + bar(m.pct) + '</td><td>' + m.n + '</td></tr>'; }).join('') + '</table>' : '<div class="rb-dim">Nothing recorded yet. Play a game with a class chosen under "Monsters", or use the exit ticket.</div>') +
        '<h3>Suggested groups for the next lesson</h3><div class="rb-grid"><div class="rb-box"><b>🟡 Support</b>' + nm(g.sup) + '</div><div class="rb-box"><b>🔵 Core</b>' + nm(g.core) + '</div><div class="rb-box"><b>🟢 Challenge</b>' + nm(g.cha) + '</div></div>' +
        '<div class="rb-dim" style="margin-top:6px">Groups use the paper quiz and the exit tickets. They are a suggestion for you; they are never shown to the pupils. Pupils without a result are in Core.</div>' +
        '<h3>Suggested pairs (strong with support)</h3><div>' + (g.pairs.length ? g.pairs.map(function (p) { return '<span style="display:inline-block;background:rgba(255,255,255,.07);border-radius:10px;padding:4px 10px;margin:3px">' + esc(p[0].name) + (p[1] ? ' + ' + esc(p[1].name) : ' (works with the teacher)') + '</span>'; }).join('') : '<span class="rb-dim">Not enough results yet.</span>') + '</div>' +
        '<h3>Each pupil</h3><table><tr><th>Pupil</th><th>Quiz</th><th>New</th><th>Learning</th><th>Known</th><th>Mastered</th></tr>' + rows.map(function (r) { return '<tr><td>' + esc(r.name) + '</td><td>' + (r.qz != null ? r.qz + '%' : '–') + '</td><td>' + r.lv[0] + '</td><td>' + r.lv[1] + '</td><td>' + r.lv[2] + '</td><td>' + r.lv[3] + '</td></tr>'; }).join('') + '</table>' +
        '<div class="rb-dim" style="margin-top:6px">Levels come from the exit tickets: right answers move a question up (New, Learning, Known, Mastered on another day); a wrong answer moves it down.</div></div>';
    }
    draw('');
    ovl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) { ovl.remove(); return; }
      if (b.dataset.go) { var u = 'game-maker/index.html' + (b.dataset.go === 'daily' ? '?daily=1' : b.dataset.go === 'exit' ? '?exit=1' : ''); root.open(u, '_blank'); return; }
      if (b.dataset.sync) { var m = ovl.querySelector('[data-msg]'); if (m) m.textContent = ' syncing…'; sync().then(function (n) { draw('☁ Synced (' + n + ' questions known)'); }, function (er) { draw('Could not sync: ' + (er && er.message || er)); }); }
    });
    /* quietly pull the cloud copy once when the board opens */
    sync().then(function () { if (document.getElementById('rb-ovl') === ovl) draw('☁ Up to date'); }, function () { /* offline: the local copy is shown */ });
  }
  root.RevisionBoard = { open: open, sync: sync, missed: missed, groups: groups };
})(window);
