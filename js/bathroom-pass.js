/* Bathroom pass: a pupil signs out and back in on the Class Board, the teacher gets the times.
   - 🚻 Bathroom button in the Class Board dock: tap a name to sign out, tap Back when the pupil returns.
   - While somebody is out a small pill shows the name and the minutes (amber after 5 minutes, a soft chime at 5 and 10).
   - One pupil out at a time by default (the teacher can allow a second).
   - The log stays on THIS computer (localStorage 'eaa_bathroom_v1'); the teacher can see it per pupil and download it as a CSV file.
     It is never shown to the class and never sent anywhere (how often a child goes is private). */
(function (root) {
  'use strict';
  var KEY = 'eaa_bathroom_v1', MAX_KEY = 'eaa_bathroom_max_v1';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && Array.isArray(d.log)) { d.out = d.out || {}; return d; } } catch (e) { /* new */ } return { out: {}, log: [] }; }
  function save(d) { d.log = d.log.slice(-1500); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* not remembered */ } }
  function maxOut() { try { return +(localStorage.getItem(MAX_KEY) || 1) || 1; } catch (e) { return 1; } }
  function nameOf(st) { return st ? (st.firstName || String(st.name || '').split(/\s+/)[0] || 'Pupil') : 'Pupil'; }
  function mmss(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function chime() { try { root.classSoundboard && root.classSoundboard.playQuietChime && root.classSoundboard.playQuietChime(); } catch (e) { /* optional */ } }
  function activeClass() { var st = S(); return st && st.getActiveClass ? st.getActiveClass() : null; }

  function signOut(id) {
    var d = load(), st = S().getStudent ? S().getStudent(id) : null; if (!st || d.out[id]) return;
    if (Object.keys(d.out).length >= maxOut()) { alert('One pupil is already out. Wait until they are back (or allow 2 in the bathroom settings).'); return; }
    d.out[id] = { t: Date.now(), name: nameOf(st), classId: st.classId, warned: 0 }; save(d); chime(); paint();
  }
  function signIn(id) {
    var d = load(), o = d.out[id]; if (!o) return;
    var now = Date.now();
    d.log.push({ id: id, name: o.name, classId: o.classId, out: o.t, back: now, min: Math.round((now - o.t) / 6000) / 10 });
    delete d.out[id]; save(d); paint();
  }

  /* ---- the pill while someone is out ---- */
  var tick = null;
  function css() {
    if (document.getElementById('bp-css')) return;
    var st = document.createElement('style'); st.id = 'bp-css';
    st.textContent = '.bp-pill{position:fixed;top:76px;right:16px;z-index:9400;display:flex;flex-direction:column;gap:6px}.bp-p{display:flex;align-items:center;gap:10px;background:#ecfeff;color:#164e63;border:2px solid #67e8f9;border-radius:999px;padding:6px 8px 6px 14px;font:700 1rem Fredoka,system-ui,sans-serif;box-shadow:0 8px 20px -8px rgba(0,0,0,.35)}' +
      '.bp-p.late{background:#fffbeb;border-color:#fbbf24;color:#78350f}.bp-p b{font-variant-numeric:tabular-nums}.bp-p button{font:inherit;border:0;border-bottom:3px solid #047857;border-radius:999px;background:#10b981;color:#fff;padding:4px 12px;cursor:pointer}' +
      '.bp-ovl{position:fixed;inset:0;z-index:9500;background:rgba(10,5,40,.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.bp-box{width:min(920px,100%);max-height:92vh;overflow:auto;background:#fff;color:#1e1b4b;border-radius:24px;padding:18px 20px;font-family:Fredoka,system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.4)}' +
      '.bp-box h2{margin:0 0 4px}.bp-dim{color:#64748b;font-size:.9rem}.bp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin:12px 0}' +
      '.bp-n{font:700 1.05rem Fredoka,system-ui,sans-serif;border:2px solid #e2e8f0;border-bottom:5px solid #cbd5e1;border-radius:16px;background:#f8fafc;color:#1e1b4b;padding:12px 6px;cursor:pointer}.bp-n:active{transform:translateY(3px);border-bottom-width:2px}' +
      '.bp-n.out{background:#ecfeff;border-color:#67e8f9;color:#155e75}.bp-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}' +
      '.bp-b{font:700 .95rem Fredoka,system-ui,sans-serif;border:0;border-bottom:4px solid rgba(0,0,0,.25);border-radius:12px;padding:8px 14px;cursor:pointer;background:#e0e7ff;color:#312e81}.bp-b.go{background:#10b981;color:#fff}' +
      '.bp-box table{width:100%;border-collapse:collapse;font-size:.92rem;margin-top:8px}.bp-box td,.bp-box th{padding:6px 8px;border-bottom:1px solid #e2e8f0;text-align:left}.bp-box th{background:#f1f5f9}';
    document.head.appendChild(st);
  }
  function paint() {
    css();
    var d = load(), ids = Object.keys(d.out), box = document.getElementById('bp-pill');
    if (!ids.length) { if (box) box.remove(); if (tick) { clearInterval(tick); tick = null; } return; }
    if (!box) { box = document.createElement('div'); box.id = 'bp-pill'; box.className = 'bp-pill'; document.body.appendChild(box); }
    var now = Date.now();
    box.innerHTML = ids.map(function (id) { var o = d.out[id], ms = now - o.t; return '<div class="bp-p' + (ms >= 5 * 60000 ? ' late' : '') + '">🚻 ' + esc(o.name) + ' <b>' + mmss(ms) + '</b><button data-back="' + esc(id) + '">✓ Back</button></div>'; }).join('');
    ids.forEach(function (id) { var o = d.out[id], m = (now - o.t) / 60000; if (m >= 5 && o.warned < 1) { o.warned = 1; chime(); save(d); } else if (m >= 10 && o.warned < 2) { o.warned = 2; chime(); save(d); } });
    if (!tick) tick = setInterval(paint, 1000);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-back]'); if (b && b.closest('#bp-pill')) signIn(b.getAttribute('data-back')); });

  /* ---- the panel: sign out / back, and the log ---- */
  /* in Class Mode the board is on the projector: the log button is hidden there (the log opens from the Command Center) */
  function onBoard() { try { return !!(root.ClassMode && root.ClassMode.on && root.ClassMode.on()); } catch (e) { return false; } }
  function open(showLog) {
    css();
    var cls = activeClass(); if (!cls) return;
    var old = document.getElementById('bp-ovl'); if (old) old.remove();
    var ovl = document.createElement('div'); ovl.id = 'bp-ovl'; ovl.className = 'bp-ovl';
    function draw() {
      var d = load(), pupils = (S().getStudents ? S().getStudents(cls.id) : []).filter(function (s) { return !s.archived; }).sort(function (a, b) { return nameOf(a).localeCompare(nameOf(b), 'tr'); });
      ovl.innerHTML = '<div class="bp-box"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><h2>🚻 Bathroom · ' + esc(cls.name) + '</h2><div class="bp-dim">Tap your name to go. Tap it again (or ✓ Back) when you come back. One pupil at a time.</div></div><button class="bp-b" data-x="1">Close ✕</button></div>' +
        '<div class="bp-grid">' + pupils.map(function (s) { var o = d.out[s.id]; return '<button class="bp-n' + (o ? ' out' : '') + '" data-id="' + esc(s.id) + '">' + (o ? '🚻 ' : '') + esc(nameOf(s)) + (o ? '<br><small>out · tap when back</small>' : '') + '</button>'; }).join('') + '</div>' +
        '<div class="bp-row">' + (onBoard() ? '' : '<button class="bp-b" data-log="1">📊 Teacher: the log</button>') + '<button class="bp-b" data-max="1">' + (maxOut() > 1 ? '2 pupils may go' : '1 pupil at a time') + '</button></div></div>';
    }
    function logView() {
      var d = load(), wk = Date.now() - 7 * 864e5, rows = {}, cid = cls.id;
      d.log.filter(function (r) { return r.classId === cid; }).forEach(function (r) { var x = rows[r.id] = rows[r.id] || { name: r.name, week: 0, all: 0, min: 0, last: 0 }; x.all++; x.min += r.min || 0; if (r.out >= wk) x.week++; if (r.out > x.last) x.last = r.out; });
      var list = Object.keys(rows).map(function (k) { return rows[k]; }).sort(function (a, b) { return b.week - a.week || b.all - a.all; });
      ovl.innerHTML = '<div class="bp-box"><div style="display:flex;justify-content:space-between;gap:10px"><div><h2>📊 Bathroom log · ' + esc(cls.name) + '</h2><div class="bp-dim">Private: only on this computer, never shown to the class. A child who goes often may simply need to: talk privately first.</div></div><button class="bp-b" data-x="1">Close ✕</button></div>' +
        (list.length ? '<table><tr><th>Pupil</th><th>This week</th><th>All</th><th>Minutes (all)</th><th>Average</th><th>Last time</th></tr>' + list.map(function (x) { return '<tr><td><b>' + esc(x.name) + '</b></td><td>' + x.week + '</td><td>' + x.all + '</td><td>' + Math.round(x.min) + '</td><td>' + (x.all ? (Math.round(x.min / x.all * 10) / 10) + ' min' : '–') + '</td><td>' + new Date(x.last).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</td></tr>'; }).join('') + '</table>' : '<p class="bp-dim" style="margin-top:12px">Nothing yet for this class.</p>') +
        '<div class="bp-row"><button class="bp-b go" data-csv="1">⬇ Download the log (CSV)</button><button class="bp-b" data-back2="1">◀ Back</button></div></div>';
    }
    if (showLog) logView(); else draw(); document.body.appendChild(ovl);
    ovl.addEventListener('mousedown', function (e) { if (e.target === ovl) ovl.remove(); });
    ovl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.x) { ovl.remove(); return; }
      if (b.dataset.id) { var d = load(); if (d.out[b.dataset.id]) signIn(b.dataset.id); else signOut(b.dataset.id); draw(); return; }
      if (b.dataset.max) { try { localStorage.setItem(MAX_KEY, maxOut() > 1 ? '1' : '2'); } catch (x) { /* ignore */ } draw(); return; }
      if (b.dataset.log) { logView(); return; }
      if (b.dataset.back2) { draw(); return; }
      if (b.dataset.csv) {
        var rows = [['Class', 'Pupil', 'Out', 'Back', 'Minutes']].concat(load().log.map(function (r) { var c = S().getClass ? S().getClass(r.classId) : null; return [c ? c.name : r.classId, r.name, new Date(r.out).toLocaleString('en-GB'), new Date(r.back).toLocaleString('en-GB'), r.min]; }));
        var csv = '﻿' + rows.map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'bathroom-log.csv'; document.body.appendChild(a); a.click(); a.remove();
      }
    });
  }
  function isOut(id) { return !!load().out[id]; }
  root.BathroomPass = { open: function () { open(false); }, log: function () { open(true); }, isOut: isOut, signOut: signOut, signIn: signIn, paint: paint };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();
})(window);
