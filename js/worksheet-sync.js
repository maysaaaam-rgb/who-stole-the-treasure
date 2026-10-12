/* Worksheet sync: shows this grade's worksheets at the top of the Assignments page, checks that each worksheet file opens,
   and puts a worksheet into Weekly Assignments with one tap (one assignment per class of the grade). Nothing is created until the
   teacher presses a button; existing assignments are never changed. */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var linkState = {};                 // wsId -> 'ok' | 'missing' | 'none' (cached for this visit)
  var FIX = { 'ws-4': 'detectives/worksheet.html' };   // a worksheet whose saved link points to a page that does not exist

  function gradeOf(cls) { var m = /([34])/.exec((cls && cls.name) || ''); return m ? Number(m[1]) : 0; }
  function classesOfGrade(g) { return (S().getClasses() || []).filter(function (c) { return !c.archived && (!g || gradeOf(c) === g); }); }
  function wsGrade(ws) { var t = String(ws.grade || ''); return { g3: /3/.test(t), g4: /4/.test(t) }; }
  function wsFor(g) { return (S().getWorksheets() || []).filter(function (w) { var x = wsGrade(w); return !g || (g === 3 ? x.g3 : x.g4) || (!x.g3 && !x.g4); }); }
  function urlOf(ws) { return ws.pdfUrl || ws.url || ws.gameId || ''; }
  function isFile(u) { return /\.html?$|\.pdf$/i.test(u || ''); }
  function assignedTo(ws) { var m = {}; (S().getAssignments(null, false) || []).forEach(function (a) { if (a.worksheetId === ws.id) m[a.classId] = a; }); return m; }
  function className(id) { var c = (S().getClasses() || []).filter(function (x) { return x.id === id; })[0]; return c ? c.name.replace(/^Grade\s*/i, '') : id; }

  /* the next Friday (or today when it is Friday) in the same style as the other due dates, e.g. "Oct 16, 2026" */
  function defaultDue() {
    var d = new Date(); var add = (5 - d.getDay() + 7) % 7; d.setDate(d.getDate() + add);
    return d;
  }
  function fmt(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function isoDay(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function check(ws) {
    var u = FIX[ws.id] ? FIX[ws.id] : urlOf(ws);
    if (!u || !isFile(u)) { linkState[ws.id] = 'none'; return Promise.resolve('none'); }
    return fetch(u, { method: 'HEAD', cache: 'no-store' }).then(function (r) { linkState[ws.id] = r.ok ? 'ok' : 'missing'; return linkState[ws.id]; }, function () { linkState[ws.id] = 'missing'; return 'missing'; });
  }

  function chip(text, bg, fg) { return '<span style="font-size:.72rem;font-weight:800;padding:2px 9px;border-radius:999px;background:' + bg + ';color:' + fg + ';white-space:nowrap">' + text + '</span>'; }
  function rowHtml(ws, due) {
    var a = assignedTo(ws), ids = Object.keys(a), st = linkState[ws.id], u = urlOf(ws), needFix = !!FIX[ws.id] && u !== FIX[ws.id];
    var status = ids.length ? chip('✔ Assigned: ' + ids.map(className).join(', ') + ' · due ' + esc(a[ids[0]].dueDate || ''), 'rgba(16,185,129,.18)', '#047857') : chip('Not assigned yet', 'rgba(148,163,184,.25)', 'inherit');
    var link = (needFix || st === 'missing') ? chip('⚠ file missing', 'rgba(244,63,94,.2)', '#be123c') : (st === 'ok' ? chip('opens ✓', 'rgba(14,165,233,.15)', '#0369a1') : (st === 'none' ? chip('built-in worksheet', 'rgba(99,102,241,.15)', '#4338ca') : chip('checking…', 'rgba(148,163,184,.2)', 'inherit')));
    var btns = '';
    if (needFix) btns += '<button type="button" class="btn-sm-secondary" onclick="WorksheetSync.fixLink(\'' + esc(ws.id) + '\')">🔧 Fix link</button> ';
    btns += '<button type="button" class="btn-sm-secondary" onclick="openWorksheetPreviewModal(\'' + esc(ws.id) + '\')">👁️ Open</button> ';
    var missing = classesOfGrade(root.__wsGrade || 0).filter(function (c) { return !a[c.id]; });
    if (missing.length) btns += '<button type="button" class="btn-primary-action" style="padding:5px 12px;font-size:.8rem" onclick="WorksheetSync.assign(\'' + esc(ws.id) + '\')">＋ Assign' + (ids.length ? ' to ' + missing.map(function (c) { return c.name.replace(/^Grade\s*/i, ''); }).join(', ') : '') + '</button>';
    return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 0;border-top:1px solid var(--border-subtle,rgba(148,163,184,.3))">' +
      '<div style="min-width:0;flex:1"><div style="font-weight:800;font-size:.92rem">' + esc(ws.title) + '</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">' + status + link + '</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + btns + '</div></div>';
  }

  var open = false;   // collapsed by default: the Assignments page shows the current homework first
  function panelHtml(grade) {
    root.__wsGrade = grade;
    var list = wsFor(grade), due = defaultDue();
    var todo = list.filter(function (w) { var a = assignedTo(w); return classesOfGrade(grade).some(function (c) { return !a[c.id]; }); }).length;
    return '<div id="ws-sync" style="background:var(--bg-card);border:1px solid var(--border-subtle,rgba(148,163,184,.3));border-radius:16px;padding:14px 18px;margin:12px 0 4px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><div style="font-weight:900;font-size:1.05rem">📄 Worksheets ' + (grade ? 'for Grade ' + grade : '') + ' <span style="font-weight:600;opacity:.75;font-size:.85rem">(' + list.length + ' · ' + todo + ' not in Assignments yet)</span></div>' +
      '<div style="font-size:.8rem;opacity:.8;margin-top:2px">One tap puts a worksheet into Weekly Assignments for ' + (classesOfGrade(grade).map(function (c) { return c.name; }).join(' and ') || 'the class') + '.</div></div>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label style="font-size:.8rem;font-weight:700">Due <input type="date" id="ws-due" value="' + isoDay(due) + '" style="padding:5px 8px;border-radius:8px;border:1px solid var(--border-subtle,#cbd5e1)"></label>' +
      (todo ? '<button type="button" class="btn-primary-action" style="padding:6px 14px;font-size:.85rem" onclick="WorksheetSync.assignAll()">＋ Assign all (' + todo + ')</button>' : '') +
      '<button type="button" class="btn-sm-secondary" onclick="WorksheetSync.toggle()">' + (open ? '▲ Hide' : '▼ Show') + '</button></div></div>' +
      (open ? '<div style="margin-top:8px">' + list.map(function (w) { return rowHtml(w, due); }).join('') + '</div>' : '') + '</div>';
  }

  function dueStr() { var el = document.getElementById('ws-due'); var v = el && el.value; var d = v ? new Date(v + 'T12:00:00') : defaultDue(); return fmt(isNaN(d) ? defaultDue() : d); }
  function paint() { var box = document.getElementById('ws-sync'); if (!box) return; var g = root.__wsGrade || 0; var due = document.getElementById('ws-due'); var keep = due && due.value; var tmp = document.createElement('div'); tmp.innerHTML = panelHtml(g); box.replaceWith(tmp.firstChild); if (keep) { var n = document.getElementById('ws-due'); if (n) n.value = keep; } runChecks(); }
  function runChecks() { wsFor(root.__wsGrade || 0).forEach(function (w) { if (!linkState[w.id]) check(w).then(function () { var box = document.getElementById('ws-sync'); if (box) repaintRows(); }); }); }
  var repaintTimer = 0;
  function repaintRows() { clearTimeout(repaintTimer); repaintTimer = setTimeout(paint, 120); }

  function assignOne(ws, due) {
    var st = S(), made = 0, a = assignedTo(ws);
    classesOfGrade(root.__wsGrade || 0).forEach(function (c) {
      if (a[c.id]) return;
      var n = st.createAssignment({ title: ws.title, classId: c.id, gameId: '', dueDate: due, instructions: ws.instructions || 'Complete the worksheet.', objectives: [ws.topic || ws.skill || 'Worksheet practice'] });
      st.updateAssignment(n.id, { id: 'asg-ws-' + ws.id + '-' + c.id, worksheetId: ws.id, worksheetTitle: ws.title, worksheetUrl: FIX[ws.id] || urlOf(ws), activityId: 'worksheet', gameId: '', kind: 'worksheet' });
      made++;
    });
    return made;
  }
  function done(n, what) { try { if (S().saveState) S().saveState(); } catch (e) { /* optional */ } if (root.showNotification) root.showNotification(n ? ('Added ' + n + ' assignment' + (n === 1 ? '' : 's') + (what ? ' for ' + what : '') + '.') : 'Already in Assignments.', 'success'); if (root.renderCurrentView) root.renderCurrentView(); }

  var api = {
    mount: function (container, cls) {
      var g = gradeOf(cls); var host = container.querySelector('h1'); if (!host) return;
      var anchor = host.closest('div[style*="justify-content"]') || host.parentNode; if (container.querySelector('#ws-sync')) return;
      var tmp = document.createElement('div'); tmp.innerHTML = panelHtml(g); anchor.parentNode.insertBefore(tmp.firstChild, anchor.nextSibling); runChecks();
      if (root.SheetSync) { try { root.SheetSync.mount(container); } catch (e) { /* optional */ } }
    },
    toggle: function () { open = !open; paint(); },
    fixLink: function (id) { var st = S(); try { st.updateWorksheet(id, { pdfUrl: FIX[id], gameId: FIX[id] }); linkState[id] = null; if (root.showNotification) root.showNotification('Link fixed.', 'success'); } catch (e) { /* optional */ } paint(); },
    assign: function (id) { var ws = S().getWorksheet(id); if (!ws) return; done(assignOne(ws, dueStr()), ws.title); },
    assignAll: function () {
      var g = root.__wsGrade || 0, due = dueStr(), list = wsFor(g).filter(function (w) { var a = assignedTo(w); return classesOfGrade(g).some(function (c) { return !a[c.id]; }); });
      if (!list.length) return done(0);
      if (root.confirm && !root.confirm('Add ' + list.length + ' worksheet' + (list.length === 1 ? '' : 's') + ' to Weekly Assignments, due ' + due + '?')) return;
      var n = 0; list.forEach(function (w) { n += assignOne(w, due); }); done(n);
    },
    check: check, wsFor: wsFor, assignedTo: assignedTo
  };
  root.WorksheetSync = api;
})(typeof window !== 'undefined' ? window : this);
