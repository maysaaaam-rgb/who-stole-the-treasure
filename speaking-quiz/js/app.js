/* Units 1-5 Speaking Quiz Studio — Controller (Privacy-Safe, Teacher-Unlocked Roster, XP Inbox Wired) */
(function (root) {
  'use strict';

  var RES_KEY = 'eaa_speaking_quiz_u15_v1';
  var INBOX_KEY = 'eaa_games_points_inbox';
  var DATA = root.SPEAKING_QUIZ_DATA;
  var SFX = root.SpeakingQuizAudio;

  var state = {
    grade: new URLSearchParams(location.search).get('grade') === '4' ? 4 : 3,
    classId: '',
    pupilId: '',
    running: false,
    step: 0,
    versions: [0, 0, 0, 0, 0],
    scores: [null, null, null, null, null],
    hintUsed: [false, false, false, false, false],
    timerSec: 45,
    timerId: null
  };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function loadResults() {
    try { return JSON.parse(localStorage.getItem(RES_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveResults(obj) {
    try { localStorage.setItem(RES_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function isTeacherUnlocked() {
    try {
      if (root.parent && root.parent !== root && root.parent.schoolStore && typeof root.parent.schoolStore.getRole === 'function') {
        return root.parent.schoolStore.getRole() === 'teacher';
      }
      return sessionStorage.getItem('eaa_teacher_unlocked') === '1' || localStorage.getItem('eaa_role') === 'teacher';
    } catch (e) { return false; }
  }

  function readPlatformStore() {
    try {
      if (root.parent && root.parent !== root && root.parent.schoolStore && root.parent.schoolStore.state) {
        return root.parent.schoolStore.state;
      }
      var raw = localStorage.getItem('englishAdventureAcademy_v2');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function classesForGrade(g) {
    var st = isTeacherUnlocked() ? readPlatformStore() : null;
    if (st && Array.isArray(st.classes)) {
      var list = st.classes.filter(function (c) {
        if (!c || c.archived || /sync/i.test(c.id) || c.grade === 'System') return false;
        return new RegExp(String(g)).test(String(c.grade || c.name || c.id));
      }).map(function (c) { return { id: c.id, name: c.name || c.id }; });
      if (list.length) return list;
    }
    return g === 4
      ? [{ id: 'class-4a', name: 'Class 4A' }, { id: 'class-4b', name: 'Class 4B' }]
      : [{ id: 'class-3a', name: 'Class 3A' }, { id: 'class-3b', name: 'Class 3B' }];
  }

  function pupilsForClass(classId) {
    var st = isTeacherUnlocked() ? readPlatformStore() : null;
    if (st && Array.isArray(st.students)) {
      var real = st.students.filter(function (s) { return s && !s.archived && s.classId === classId; }).map(function (s, i) {
        var nm = String(s.name || ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || ('Pupil ' + (i + 1))).trim();
        return { id: s.id, name: nm, real: true };
      });
      if (real.length) return real;
    }
    var demo = [];
    for (var i = 1; i <= 12; i++) demo.push({ id: classId + '-demo-' + i, name: 'Pupil ' + i, real: false });
    return demo;
  }

  function bandOf(score10) {
    if (score10 <= 2) return { lbl: 'Below A1', cls: 'sq-b0', xp: 10 };
    if (score10 <= 5) return { lbl: 'A1', cls: 'sq-b1', xp: 15 };
    if (score10 <= 8) return { lbl: 'A1+', cls: 'sq-b2', xp: 20 };
    return { lbl: 'A1+ Strong ⭐', cls: 'sq-b3', xp: 25 };
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }
  function paintTimer() {
    var m = Math.floor(state.timerSec / 60), s = state.timerSec % 60;
    var el = $('sq-timer');
    if (!el) return;
    el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    el.classList.toggle('low', state.timerSec <= 10);
  }
  function startTimer() {
    stopTimer();
    state.timerSec = 45;
    paintTimer();
    state.timerId = setInterval(function () {
      state.timerSec = Math.max(0, state.timerSec - 1);
      paintTimer();
      if (state.timerSec === 0) { stopTimer(); SFX.score0(); }
    }, 1000);
  }

  function currentPack() { return DATA[state.grade] || DATA[3]; }
  function currentTask() {
    var pack = currentPack();
    var unitTasks = pack.tasks[state.step] || [];
    return unitTasks[state.versions[state.step] % unitTasks.length] || unitTasks[0];
  }

  function populateSelectors(keepClass) {
    var clsList = classesForGrade(state.grade);
    var cSel = $('sq-class');
    cSel.innerHTML = clsList.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('');
    if (keepClass && clsList.some(function (c) { return c.id === state.classId; })) cSel.value = state.classId;
    else state.classId = clsList[0].id;
    cSel.value = state.classId;

    var pList = pupilsForClass(state.classId);
    var res = loadResults();
    var pSel = $('sq-pupil');
    pSel.innerHTML = pList.map(function (p) {
      var r = res[p.id];
      var tag = r && r.total != null ? (' ✓ ' + r.total + '/10') : '';
      return '<option value="' + esc(p.id) + '">' + esc(p.name + tag) + '</option>';
    }).join('');
    if (!pList.some(function (p) { return p.id === state.pupilId; })) state.pupilId = pList[0].id;
    pSel.value = state.pupilId;
    $('sq-subtitle').textContent = currentPack().title + ' · 5 short tasks (1 per Unit) · ~1 min per pupil · 0–2 per task';
    renderResults();
  }

  function renderSteps() {
    var html = '';
    for (var i = 0; i < 5; i++) {
      var cls = i < state.step ? 'done' : (state.running && i === state.step ? 'now' : '');
      var txt = state.scores[i] != null ? String(state.scores[i]) : ('U' + (i + 1));
      html += '<div class="sq-dot ' + cls + '" title="Unit ' + (i + 1) + '">' + txt + '</div>';
    }
    $('sq-steps').innerHTML = html;
  }

  function renderTask() {
    renderSteps();
    $('sq-done').classList.add('hide');
    var pack = currentPack();
    if (!state.running) {
      $('sq-unit-badge').textContent = 'Grade ' + state.grade + ' · Units 1–5';
      $('sq-unit-badge').style.background = '#4f9dff';
      $('sq-where').textContent = 'Choose a class & pupil, then press ▶ Start Quiz!';
      $('sq-pic').textContent = '🎤';
      $('sq-q').textContent = 'Ready for your 1-minute speaking adventure?';
      $('sq-act').textContent = '';
      $('sq-hint').textContent = '';
      $('sq-model').textContent = '';
      $('sq-listen-for').textContent = '';
      [].forEach.call(document.querySelectorAll('.sq-score-btn'), function (b) { b.disabled = true; });
      return;
    }

    var u = pack.units[state.step];
    var t = currentTask();
    var pName = ($('sq-pupil').selectedOptions[0] && $('sq-pupil').selectedOptions[0].textContent.replace(/\s*✓.*$/, '')) || 'Pupil';
    $('sq-unit-badge').textContent = 'Unit ' + u.n + ' · ' + u.short;
    $('sq-unit-badge').style.background = u.color;
    $('sq-where').textContent = pName + ' · Task ' + (state.step + 1) + ' of 5';
    $('sq-pic').textContent = t.pic;
    $('sq-q').textContent = t.q;
    $('sq-act').textContent = t.act || '';
    $('sq-hint').textContent = state.hintUsed[state.step] ? ('💡 Starter: ' + t.h) : '';
    $('sq-model').textContent = '';
    $('sq-listen-for').textContent = '👂 Listen for: ' + t.f;

    var supportOn = $('sq-support').checked;
    [].forEach.call(document.querySelectorAll('.sq-score-btn'), function (b) {
      var v = Number(b.getAttribute('data-s'));
      b.disabled = (v === 2 && state.hintUsed[state.step] && !supportOn);
    });
  }

  function startQuiz() {
    SFX.tap();
    state.running = true;
    state.step = 0;
    state.scores = [null, null, null, null, null];
    state.hintUsed = [false, false, false, false, false];
    // Deterministic-free random version per unit so consecutive pupils get fresh prompts!
    state.versions = [0, 1, 2, 3, 4].map(function () { return Math.floor(Math.random() * 3); });
    var existing = loadResults()[state.pupilId];
    $('sq-note').value = (existing && existing.note) || '';
    startTimer();
    renderTask();
  }

  function awardQuizXP(pupilId, pupilName, amount) {
    var sent = false;
    try {
      if (root.parent && root.parent !== root && root.parent.schoolStore && typeof root.parent.schoolStore.giveXP === 'function' && isTeacherUnlocked()) {
        root.parent.schoolStore.giveXP(pupilId, amount, 'Units 1–5 Speaking Quiz', 'Speaking Quiz');
        sent = true;
      }
    } catch (e) {}
    if (!sent && isTeacherUnlocked() && !/-demo-/.test(pupilId)) {
      try {
        var inbox = JSON.parse(localStorage.getItem(INBOX_KEY) || '[]') || [];
        inbox.push({
          id: 'speakquiz_' + Date.now().toString(36) + '_' + pupilId,
          studentId: pupilId,
          classId: state.classId,
          amount: amount,
          reason: 'Units 1–5 Speaking Quiz',
          icon: '🎤',
          ts: Date.now()
        });
        localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
        if (root.BroadcastChannel) {
          var bc = new BroadcastChannel('eaa_games_xp');
          bc.postMessage({ type: 'XP_QUEUED', count: 1 });
          bc.close();
        }
        sent = true;
      } catch (e) {}
    }
    SFX.celebrate();
    return sent;
  }

  function finishPupil() {
    stopTimer();
    state.running = false;
    renderSteps();
    var total = state.scores.reduce(function (a, b) { return a + (Number(b) || 0); }, 0);
    var band = bandOf(total);
    var pList = pupilsForClass(state.classId);
    var pObj = pList.filter(function (p) { return p.id === state.pupilId; })[0] || { id: state.pupilId, name: 'Pupil' };

    var all = loadResults();
    var prev = all[state.pupilId] || {};
    all[state.pupilId] = {
      id: state.pupilId,
      name: pObj.name,
      classId: state.classId,
      grade: state.grade,
      scores: state.scores.slice(),
      total: total,
      written: prev.written != null ? prev.written : null,
      note: $('sq-note').value.trim(),
      xpGiven: !!prev.xpGiven,
      at: new Date().toISOString()
    };
    saveResults(all);
    SFX.celebrate();

    var doneEl = $('sq-done');
    doneEl.classList.remove('hide');
    doneEl.innerHTML =
      '<h2>🎉 Great Speaking, ' + esc(pObj.name) + '!</h2>' +
      '<div class="sq-band-pill">' + total + ' / 10 · ' + band.lbl + '</div>' +
      '<p class="sq-sub">Units breakdown: ' + state.scores.map(function (s, i) { return 'U' + (i + 1) + ': <b>' + s + '</b>'; }).join(' · ') + '</p>' +
      '<div class="sq-tools-row" style="margin-top:14px">' +
        '<button type="button" class="sq-btn green" id="sq-give-xp">⭐ Give +' + band.xp + ' XP</button>' +
        '<button type="button" class="sq-btn blue" id="sq-go-next">Next Pupil ⏭</button>' +
      '</div>';
    try { doneEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    $('sq-give-xp').onclick = function () {
      var btn = this;
      awardQuizXP(pObj.id, pObj.name, band.xp);
      var a2 = loadResults();
      if (a2[pObj.id]) { a2[pObj.id].xpGiven = true; saveResults(a2); }
      btn.textContent = '✅ +' + band.xp + ' XP Sent!';
      btn.disabled = true;
      renderResults();
    };
    $('sq-go-next').onclick = nextPupil;
    populateSelectors(true);
  }

  function recordScore(val) {
    if (!state.running) return;
    if (val === 2) SFX.score2();
    else if (val === 1) SFX.score1();
    else SFX.score0();
    state.scores[state.step] = val;
    if (state.step < 4) {
      state.step++;
      renderTask();
    } else {
      finishPupil();
    }
  }

  function nextPupil() {
    var sel = $('sq-pupil');
    if (sel.selectedIndex < sel.options.length - 1) sel.selectedIndex++;
    else sel.selectedIndex = 0;
    state.pupilId = sel.value;
    startQuiz();
  }

  function renderResults() {
    var tbody = $('sq-tbl').querySelector('tbody');
    var pList = pupilsForClass(state.classId);
    var all = loadResults();
    tbody.innerHTML = pList.map(function (p) {
      var r = all[p.id];
      var sc = (r && Array.isArray(r.scores)) ? r.scores : [null, null, null, null, null];
      var tot = (r && r.total != null) ? r.total : null;
      var band = tot != null ? bandOf(tot) : null;
      var wr = (r && r.written != null) ? r.written : '';
      var comb = (tot != null && wr !== '') ? (tot + Number(wr)) : '—';
      return '<tr>' +
        '<td>' + esc(p.name) + '</td>' +
        sc.map(function (v) { return '<td>' + (v == null ? '·' : v) + '</td>'; }).join('') +
        '<td><b>' + (tot == null ? '—' : tot + '/10') + '</b></td>' +
        '<td class="' + (band ? band.cls : '') + '">' + (band ? band.lbl : '—') + '</td>' +
        '<td><input type="number" min="0" max="30" data-wr="' + esc(p.id) + '" value="' + esc(wr) + '" aria-label="Written quiz mark"></td>' +
        '<td><b>' + comb + '</b></td>' +
        '<td>' + (r && r.xpGiven ? '⭐' : '·') + '</td>' +
      '</tr>';
    }).join('');
    [].forEach.call(tbody.querySelectorAll('input[data-wr]'), function (inp) {
      inp.onchange = function () {
        var pid = inp.getAttribute('data-wr');
        var a = loadResults();
        a[pid] = a[pid] || { id: pid, classId: state.classId, grade: state.grade, scores: [null, null, null, null, null], total: null };
        a[pid].written = inp.value === '' ? null : Math.max(0, Math.min(30, Number(inp.value) || 0));
        saveResults(a);
        renderResults();
      };
    });
  }

  function copyTSV() {
    var pList = pupilsForClass(state.classId), all = loadResults();
    var lines = ['Pupil\tU1\tU2\tU3\tU4\tU5\tSpeaking /10\tBand\tWritten /30\tTotal /40\tNotes'];
    pList.forEach(function (p) {
      var r = all[p.id];
      var sc = (r && r.scores) || ['', '', '', '', ''];
      var tot = (r && r.total != null) ? r.total : '';
      var band = tot !== '' ? bandOf(tot).lbl : '';
      var wr = (r && r.written != null) ? r.written : '';
      var comb = (tot !== '' && wr !== '') ? (tot + Number(wr)) : '';
      lines.push([p.name, sc[0], sc[1], sc[2], sc[3], sc[4], tot, band, wr, comb, (r && r.note) || ''].join('\t'));
    });
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lines.join('\n')).then(function () {
        var b = $('sq-copy'); b.textContent = '✅ Copied!';
        setTimeout(function () { b.textContent = '📋 Copy TSV'; }, 1600);
      });
    }
  }

  /* Wire UI */
  [].forEach.call(document.querySelectorAll('.sq-tabs .sq-btn[data-tab]'), function (btn) {
    btn.onclick = function () {
      SFX.tap();
      var tab = btn.getAttribute('data-tab');
      [].forEach.call(document.querySelectorAll('.sq-tabs .sq-btn[data-tab]'), function (b) {
        b.classList.toggle('on', b === btn);
        b.classList.toggle('blue', b === btn);
        b.classList.toggle('ghost', b !== btn);
      });
      ['assess', 'results', 'guide'].forEach(function (t) {
        $('tab-' + t).classList.toggle('hide', t !== tab);
      });
      if (tab === 'results') renderResults();
    };
  });

  [].forEach.call(document.querySelectorAll('.sq-pill[data-grade]'), function (pill) {
    pill.onclick = function () {
      SFX.tap();
      state.grade = Number(pill.getAttribute('data-grade')) === 4 ? 4 : 3;
      [].forEach.call(document.querySelectorAll('.sq-pill[data-grade]'), function (p) {
        p.classList.toggle('on', Number(p.getAttribute('data-grade')) === state.grade);
      });
      state.running = false;
      stopTimer();
      populateSelectors(false);
      renderTask();
    };
  });

  $('sq-class').onchange = function () { state.classId = this.value; state.running = false; stopTimer(); populateSelectors(true); renderTask(); };
  $('sq-pupil').onchange = function () { state.pupilId = this.value; };
  $('sq-support').onchange = function () { if (state.running) renderTask(); };
  $('sq-start').onclick = startQuiz;
  $('sq-next-pupil').onclick = nextPupil;
  $('sq-tstart').onclick = function () { SFX.tap(); startTimer(); };
  $('sq-say').onclick = function () { if (state.running) SFX.speak(currentTask().q); };
  $('sq-hbtn').onclick = function () {
    if (!state.running) return;
    SFX.tap();
    state.hintUsed[state.step] = true;
    renderTask();
  };
  $('sq-mbtn').onclick = function () {
    if (!state.running) return;
    SFX.tap();
    var t = currentTask();
    $('sq-model').textContent = '💬 Model: ' + t.m;
    SFX.speak(t.m);
  };
  $('sq-back').onclick = function () {
    if (!state.running || state.step === 0) return;
    SFX.tap();
    state.step--;
    renderTask();
  };
  [].forEach.call(document.querySelectorAll('.sq-score-btn'), function (b) {
    b.onclick = function () { recordScore(Number(b.getAttribute('data-s'))); };
  });
  $('sq-copy').onclick = copyTSV;
  $('sq-clear').onclick = function () {
    if (!confirm('Clear all saved Speaking Quiz marks for this class?')) return;
    var all = loadResults();
    Object.keys(all).forEach(function (k) { if (all[k] && all[k].classId === state.classId) delete all[k]; });
    saveResults(all);
    populateSelectors(true);
  };

  /* Init */
  [].forEach.call(document.querySelectorAll('.sq-pill[data-grade]'), function (p) {
    p.classList.toggle('on', Number(p.getAttribute('data-grade')) === state.grade);
  });
  populateSelectors(false);
  renderTask();
})(window);
