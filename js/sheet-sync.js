/* Google Sheet sync for the Assignments page.
   Reads the Tea Party Results sheet through its read-only status link (the same one the pupils' Alice page uses) and updates
   the Alice homework cards (Week 1 and Week 2) with who has started and who has finished. It only ever adds or upgrades
   (a finished pupil is never turned back into "started") and it changes nothing in the Google Sheet. The teacher presses the button. */
(function (root) {
  'use strict';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var CFG = (root.PARTY_CONFIG && root.PARTY_CONFIG.submitUrl) ? root.PARTY_CONFIG : {
    submitUrl: 'https://script.google.com/macros/s/AKfycbzW5c8cvntKtAtcM4pDQiwhQpC8sctJJNntK8cpaP6AEtmHu2mz4TNrzdsLy0X0TiDQzQ/exec',
    token: 'eaa-tea-4f7c9d2b81a6'
  };
  /* which homework card each sheet key feeds, and how many steps there are */
  var SOURCES = [
    { hw: 'hw-alice-tea-party-w1', key: 'alice-tea-party-a1plus', steps: 5, label: 'Week 1' },
    { hw: 'hw-alice-tea-party-w2', key: 'alice-tea-party-w2', steps: 3, label: 'Week 2', recordings: true },
    { hw: 'hw-chuseok-w2-cooking', key: 'chuseok-w2-cooking', steps: 1, label: 'Chuseok cooking', src: 'cook' }
  ];
  /* The cooking sheet has its own receiver. Until its status link is switched on, the pupils who had a row in the sheet on 12 Oct 2026
     are used (a pupil with a row has sent the cooking homework). Names are the sheet-style ids "class-firstname[+initial]". */
  var COOK = {
    submitUrl: 'https://script.google.com/macros/s/AKfycbwKTNXOxf9tGkYRPxhqFRrlhaky-XY3juEb2pblzVJ0ELiIQTTy-KP18v7tFWYk0hblvw/exec', token: 'eaa-cook-305208ffc123',
    snapshot: ['3a-ates', '3b-denizk', '3b-deniza', '3b-demir']
  };
  function cookStatus() {
    var snap = {}; COOK.snapshot.forEach(function (id) { snap[id] = { 'chuseok-w2-cooking': { steps: 1, finished: true } }; });
    return fetch(COOK.submitUrl + '?action=status&token=' + encodeURIComponent(COOK.token), { cache: 'no-store' }).then(function (r) { return r.json(); })
      .then(function (d) { return d && d.ok && d.status ? d.status : snap; }, function () { return snap; });
  }
  /* Pupils on the sheet's "Recordings" tab on 14 Oct 2026 (sheet id: [count, last date]). Used until the sheet's script sends recordings itself. */
  var REC_SNAPSHOT = { '4b-ali': [1, '12 Oct'], '4a-defne': [1, '12 Oct'], '4b-utku': [1, '13 Oct'], '4a-belis': [1, '13 Oct'], '4b-ertugrul': [1, '13 Oct'],
    '4a-emire': [1, '13 Oct'], '4b-kerem': [1, '13 Oct'], '4b-mina': [1, '14 Oct'], '4b-ozan': [1, '14 Oct'], '4a-emirb': [1, '14 Oct'] };
  function recordingsOf(status) {
    var out = {}, fromSheet = false;
    Object.keys(status || {}).forEach(function (sid) { var r = status[sid] && status[sid].recordings; if (r && r.count) { fromSheet = true; out[sid] = { count: Number(r.count) || 1, last: r.last || '' }; } });
    if (!fromSheet) Object.keys(REC_SNAPSHOT).forEach(function (sid) { out[sid] = { count: REC_SNAPSHOT[sid][0], last: REC_SNAPSHOT[sid][1] }; });
    return out;
  }
  function applyRecordings(hwId, recs, students, report) {
    var hw = (S().getHomework() || []).filter(function (h) { return h.id === hwId; })[0] || (S().getHomework(true) || []).filter(function (h) { return h.id === hwId; })[0]; if (!hw) return;
    hw.submissions = hw.submissions || {};
    Object.keys(recs).forEach(function (sid) {
      var p = mapId(sid, students); if (!p) { if (report.unmatched.indexOf(sid) < 0) report.unmatched.push(sid); return; }
      var sub = hw.submissions[p.id];
      if (!sub) sub = hw.submissions[p.id] = { status: 'IN_PROGRESS', attempted: 0, correct: 0, score: 0, completedDate: '', optionalDone: false, xpAwarded: 0, notes: 'Sent a recording (sync ' + today() + ')' };
      var r = recs[sid], had = sub.recording && sub.recording.count;
      if (!had || had < r.count) { sub.recording = { count: r.count, last: r.last }; report.recordings++; report.changed++; }
    });
  }
  var CLASS_FIX = {};    // the ids now match the classes (Ozan T. 208 = 4B, Simal 319 = 4A: checked with the teacher 14 Oct)
  /* sheet names that fit two pupils, matched by the teacher (14 Oct 2026) */
  var ALIAS = { '4b-ozan': 'student-4b-208', '4a-ada': 'student-4a-310', '4a-emirb': 'student-4a-342', '4b-elif': 'student-4b-307', '3b-ece': 'student-3b-217' };
  var last = { at: 0, text: '' };

  function slug(s) { return String(s || '').toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, ''); }
  function realClass(st) { if (CLASS_FIX[st.id]) return CLASS_FIX[st.id]; var m = /^student-([0-9][ab])/.exec(st.id || ''); return m ? m[1] : ''; }

  /* "4a-ruzgar" -> the platform pupil of class 4A named Rüzgar. Returns null when there is no single match (never guesses). */
  function mapId(sheetId, students) {
    if (ALIAS[sheetId]) return students.filter(function (s) { return s.id === ALIAS[sheetId]; })[0] || null;
    var m = /^([0-9][ab])-(.+)$/.exec(String(sheetId || '')); if (!m) return null;
    var cls = m[1], nm = m[2];
    var inClass = students.filter(function (s) { return realClass(s) === cls; });
    var exact = inClass.filter(function (s) { return slug(s.firstName) === nm; });
    if (exact.length === 1) return exact[0];
    if (exact.length > 1) return null;
    var loose = inClass.filter(function (s) { return slug(s.firstName) + slug(s.lastName).charAt(0) === nm || slug(s.firstName + s.lastName).indexOf(nm) === 0 || slug(s.firstName + ' ' + (s.middleName || '')) === nm; });
    return loose.length === 1 ? loose[0] : null;
  }

  function today() { return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function apply(hwId, key, steps, status, students, report) {
    var st = S(), hw = (st.getHomework() || []).filter(function (h) { return h.id === hwId; })[0] || (st.getHomework(true) || []).filter(function (h) { return h.id === hwId; })[0]; if (!hw) { report.missing.push(hwId); return; }
    hw.submissions = hw.submissions || {};
    /* two sheet names that point to the same pupil are ambiguous: skip both and tell the teacher */
    var owner = {}, clash = {};
    Object.keys(status).forEach(function (sid) { var p = mapId(sid, students); if (!p) return; if (owner[p.id] && owner[p.id] !== sid) { clash[sid] = 1; clash[owner[p.id]] = 1; } else owner[p.id] = sid; });
    Object.keys(status).forEach(function (sid) {
      var v = status[sid][key]; if (!v) return;
      var pupil = mapId(sid, students); if (!pupil || clash[sid]) { if (!/^TEST/i.test(sid) && report.unmatched.indexOf(sid) < 0) report.unmatched.push(sid); return; }
      var have = hw.submissions[pupil.id], n = Number(v.steps) || 0;
      if (v.finished) {
        if (!have || have.status !== 'COMPLETED') { hw.submissions[pupil.id] = { status: 'COMPLETED', attempted: steps, correct: steps, score: 100, completedDate: today(), optionalDone: false, xpAwarded: (have && have.xpAwarded) || 0, notes: 'From the Results sheet (sync ' + today() + ').' }; report.finished++; report.changed++; }
      } else if (n > 0 || v.started) {   // v.started: the pupil opened the page (cooking) but has not sent it
        if (!have) { hw.submissions[pupil.id] = { status: 'IN_PROGRESS', attempted: n, correct: n, score: Math.round(n / steps * 100), completedDate: '', optionalDone: false, xpAwarded: 0, notes: n > 0 ? 'From the Results sheet (sync ' + today() + '): ' + n + ' of ' + steps + ' steps.' : 'Opened the homework page (sync ' + today() + '), not sent yet.' }; report.started++; report.changed++; }
        else if (have.status !== 'COMPLETED' && n > (Number(have.attempted) || 0)) { have.attempted = n; have.correct = n; have.score = Math.round(n / steps * 100); report.started++; report.changed++; }
      }
    });
    hw.submittedCount = Object.keys(hw.submissions).filter(function (k) { return hw.submissions[k].status === 'COMPLETED'; }).length;
  }

  function sync() {
    var btn = document.getElementById('sheet-sync-btn'); if (btn) { btn.disabled = true; btn.textContent = '⏳ Reading the sheet…'; }
    var url = CFG.submitUrl + '?action=status&token=' + encodeURIComponent(CFG.token || '');
    return Promise.all([fetch(url, { cache: 'no-store' }).then(function (r) { return r.json(); }), cookStatus()]).then(function (res) {
      var d = res[0], cook = res[1];
      if (!d || !d.ok) throw new Error((d && d.error) || 'The sheet did not answer.');
      var students = (S().getStudents() || []).filter(function (s) { return !s.archived; }), rep = { changed: 0, finished: 0, started: 0, recordings: 0, unmatched: [], missing: [] };
      SOURCES.forEach(function (src) { apply(src.hw, src.key, src.steps, src.src === 'cook' ? cook : (d.status || {}), students, rep); });
      SOURCES.forEach(function (src) { if (src.recordings) applyRecordings(src.hw, recordingsOf(d.status || {}), students, rep); });
      try { if (S().saveState) S().saveState(); } catch (e) { /* optional */ }
      last.at = Date.now();
      last.text = rep.changed ? ('Updated ' + rep.changed + ' pupil' + (rep.changed === 1 ? '' : 's') + ': ' + rep.finished + ' newly finished, ' + rep.started + ' started' + (rep.recordings ? ', ' + rep.recordings + ' recording' + (rep.recordings === 1 ? '' : 's') + ' 🎤' : '') + '.') : 'Already up to date.';
      if (rep.unmatched.length) last.text += ' Could not match: ' + rep.unmatched.join(', ') + '.';
      if (root.showNotification) root.showNotification(last.text, rep.unmatched.length ? 'warning' : 'success');
      if (root.renderCurrentView) root.renderCurrentView();
      return rep;
    }).catch(function (e) {
      last.text = 'Could not read the sheet: ' + (e && e.message ? e.message : e) + ' (check the internet and try again).';
      if (root.showNotification) root.showNotification(last.text, 'error');
      if (btn) { btn.disabled = false; btn.textContent = '🔄 Sync from Google Sheets'; }
    });
  }

  /* Read-only snapshot of the Google Sheets for the Command Center (nothing is written anywhere, nothing in the platform changes).
     Resolves { pupils: { pupilId: { tea1: {steps, finished}, tea2: {steps, finished, rec: {count, last}}, cook: {steps, finished} } }, unmatched: [...] }.
     The answer is kept for 90 seconds so that opening the page again does not call the sheets again. */
  var snap = { at: 0, p: null };
  function snapshot(force) {
    if (!force && snap.p && Date.now() - snap.at < 90000) return snap.p;
    snap.at = Date.now();
    var url = CFG.submitUrl + '?action=status&token=' + encodeURIComponent(CFG.token || '');
    snap.p = Promise.all([fetch(url, { cache: 'no-store' }).then(function (r) { return r.json(); }), cookStatus()]).then(function (res) {
      var d = res[0], cook = res[1];
      if (!d || !d.ok) throw new Error((d && d.error) || 'The sheet did not answer.');
      var students = (S().getStudents() || []).filter(function (s) { return !s.archived; }), pupils = {}, unmatched = [];
      function owners(status) {   // two sheet names that point to the same pupil are ambiguous: skipped
        var own = {}, clash = {};
        Object.keys(status).forEach(function (sid) { var p = mapId(sid, students); if (!p) return; if (own[p.id] && own[p.id] !== sid) { clash[sid] = 1; clash[own[p.id]] = 1; } else own[p.id] = sid; });
        return clash;
      }
      function add(status, key, id) {
        var clash = owners(status);
        Object.keys(status).forEach(function (sid) {
          var v = status[sid] && status[sid][key]; if (!v) return;
          var p = mapId(sid, students);
          if (!p || clash[sid]) { if (!/^TEST/i.test(sid) && unmatched.indexOf(sid) < 0) unmatched.push(sid); return; }
          (pupils[p.id] = pupils[p.id] || {})[id] = { steps: Number(v.steps) || 0, finished: !!v.finished };
        });
      }
      var tea = d.status || {};
      add(tea, 'alice-tea-party-a1plus', 'tea1'); add(tea, 'alice-tea-party-w2', 'tea2'); add(cook || {}, 'chuseok-w2-cooking', 'cook');
      var recs = recordingsOf(tea);
      Object.keys(recs).forEach(function (sid) { var p = mapId(sid, students); if (!p) return; var e = (pupils[p.id] = pupils[p.id] || {}); e.tea2 = e.tea2 || { steps: 0, finished: false }; e.tea2.rec = recs[sid]; });
      return { pupils: pupils, unmatched: unmatched, at: Date.now() };
    }).catch(function (e) { snap.p = null; throw e; });
    return snap.p;
  }

  var api = {
    snapshot: snapshot,
    mount: function (container) {
      if (container.querySelector('#sheet-sync-bar')) return;
      var host = container.querySelector('#ws-sync') || (container.querySelector('h1') && container.querySelector('h1').parentNode); if (!host) return;
      var bar = document.createElement('div'); bar.id = 'sheet-sync-bar';
      bar.style.cssText = 'display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:var(--bg-card);border:1px solid var(--border-subtle,rgba(148,163,184,.3));border-radius:16px;padding:10px 16px;margin:12px 0 4px';
      bar.innerHTML = '<div style="flex:1;min-width:220px"><div style="font-weight:900">📊 Google Sheet homework</div><div style="font-size:.8rem;opacity:.8;margin-top:2px">Brings who started and who finished the Alice Tea Party homework (Weeks 1 and 2) and the Chuseok cooking homework into the cards below. Nothing in the sheet is changed.' + (last.at ? ' <b>Last sync: ' + new Date(last.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '. ' + esc(last.text) + '</b>' : '') + '</div></div>' +
        '<button type="button" id="sheet-sync-btn" class="btn-primary-action" style="padding:8px 16px" onclick="SheetSync.sync()">🔄 Sync from Google Sheets</button>';
      host.parentNode.insertBefore(bar, host);
    },
    sync: sync, mapId: mapId, SOURCES: SOURCES
  };
  root.SheetSync = api;
})(typeof window !== 'undefined' ? window : this);
