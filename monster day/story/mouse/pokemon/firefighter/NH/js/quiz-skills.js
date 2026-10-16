/* Unit 3 quiz -> the pupil's 4 skills (listening, reading, writing, speaking) -> saved as an assessment, so the report generator, the Progress & CEFR page and the
   profile all show them (they read store.getStudentSkills, which uses assessments + learning evidence).
   The teacher sees a preview first and presses Save. Saving again replaces the earlier save (it never adds twice), so the speaking marks can be added later and saved again.
   Quiz percentages are mapped to the platform's 0-100 skill scale GENTLY (a hard paper quiz must not turn every pupil into "Pre-A1"):
   80%+ = 90 (A2) · 60%+ = 78 (A1+) · 40%+ = 65 (A1) · 25%+ = 55 · below 25% = 45.
   It does NOT recalculate the pupil's overall CEFR (the old rubric code averages in skills that have no data and would pull everybody down). */
(function (root) {
  'use strict';
  var TAG = 'unit3-quiz-4skills', TITLE = 'Unit 3 quiz: 4 skills';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function S() { return root.schoolStore; }
  function scale(pct) { return pct >= 80 ? 90 : pct >= 60 ? 78 : pct >= 40 ? 65 : pct >= 25 ? 55 : 45; }
  function cefr(v) { return v >= 85 ? 'A2' : v >= 75 ? 'A1+' : v >= 60 ? 'A1' : 'Pre-A1'; }
  var NAMES = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };

  /** The 4 skills of one pupil from the quiz: { skills: {listening: {pct, v}}, comment } or null when there is no quiz. */
  function skillsOf(id) {
    var d = root.QuizResults && root.QuizResults.detailOf ? root.QuizResults.detailOf(id) : null; if (!d) return null;
    var by = {}; d.parts.forEach(function (p) { by[p.label] = p; });
    function pc(labels) { var sc = 0, mx = 0; labels.forEach(function (l) { if (by[l]) { sc += by[l].score; mx += by[l].max; } }); return mx ? Math.round(sc / mx * 100) : null; }
    var g4 = d.grade === 4;
    var raw = {
      listening: pc(['Listening']),
      reading: g4 ? pc(['Reading']) : pc(['Ice-bridge stones', 'Poem table']),
      writing: g4 ? pc(['Writing']) : pc(['Car table', 'Reading summary']),
      speaking: d.spk && d.spk.max ? Math.round(d.spk.score / d.spk.max * 100) : null
    };
    var sk = {}, any = false;
    Object.keys(raw).forEach(function (k) { if (raw[k] != null) { sk[k] = { pct: raw[k], v: scale(raw[k]) }; any = true; } });
    if (!any) return null;
    var best = null, worst = null;
    Object.keys(sk).forEach(function (k) { if (!best || sk[k].pct > sk[best].pct) best = k; if (!worst || sk[k].pct < sk[worst].pct) worst = k; });
    var comment = 'Unit 3 quiz: ' + (best ? 'strongest in ' + NAMES[best].toLowerCase() : '') + (worst && worst !== best ? ', needs more practice in ' + NAMES[worst].toLowerCase() : '') + '.' +
      (sk.speaking ? ' Speaking ' + d.spk.score + '/' + d.spk.max + '.' : ' Speaking not marked yet.') + (d.note ? ' ' + d.note : '');
    return { skills: sk, comment: comment, hasSpeaking: !!sk.speaking };
  }

  function pupils(grade) {
    var st = S(), out = [];
    (grade === '4' ? ['class-4a', 'class-4b'] : ['class-3a', 'class-3b']).forEach(function (c) { (st.getStudents(c) || []).forEach(function (s) { out.push(s); }); });
    return out;
  }
  function plan(grade) {
    return pupils(grade).map(function (s) { var k = skillsOf(s.id); return { s: s, k: k }; });
  }

  /** Write ONE pupil. Replaces the earlier save of this quiz, so saving twice never doubles anything. */
  function write(student, k) {
    var st = S();
    if (!Array.isArray(st.state.assessments)) st.state.assessments = [];
    if (!Array.isArray(st.state.learningEvidence)) st.state.learningEvidence = [];
    st.state.assessments = st.state.assessments.filter(function (a) { return !(a.studentId === student.id && a.syncTag === TAG); });
    st.state.learningEvidence = st.state.learningEvidence.filter(function (e) { return !(e.studentId === student.id && e.activityId === TAG); });
    var rubric = {}, date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    Object.keys(k.skills).forEach(function (key) { rubric[key] = k.skills[key].v; });
    // pushed at the END of the list: the pupil's own teacher rubrics (newer, at the start) keep priority in getStudentSkills
    st.state.assessments.push({ id: 'ass-' + TAG + '-' + student.id, title: TITLE, studentId: student.id, classId: student.classId, date: date, rubricScores: rubric, teacherComment: k.comment, archived: false, syncTag: TAG });
    Object.keys(rubric).forEach(function (key) {
      st.state.learningEvidence.push({ id: 'ev-' + TAG + '-' + student.id + '-' + key, studentId: student.id, activityId: TAG, objectiveId: 'unit3-quiz', skillId: key, score: rubric[key], maxScore: 100, date: date, source: 'Unit 3 quiz' });
    });
  }

  function css() {
    if (document.getElementById('qs-css')) return;
    var s = document.createElement('style'); s.id = 'qs-css';
    s.textContent = '#qs-box{position:fixed;inset:0;z-index:100001;background:#060911;overflow:auto;padding:18px;color:#e8eefc;font-family:Inter,system-ui,sans-serif}' +
      '#qs-box h2{margin:0 0 4px}#qs-box table{border-collapse:collapse;width:100%;margin-top:12px;font-size:.88rem}#qs-box td,#qs-box th{border-bottom:1px solid #232a3d;padding:6px 8px;text-align:left}#qs-box th{color:#8b94a8;font-size:.72rem;text-transform:uppercase}' +
      '.qs-c{font-weight:800;border-radius:8px;padding:2px 8px;display:inline-block}.qs-a2{background:#1d2450;color:#a5b4fc}.qs-a1p{background:#10291f;color:#34d399}.qs-a1{background:#2e2410;color:#fbbf24}.qs-p{background:#1b1e2a;color:#9aa3b8}' +
      '.qs-btns{display:flex;gap:8px;margin:10px 0;flex-wrap:wrap;align-items:center}.qs-b{border:0;border-bottom:5px solid #1d4ed8;background:#38bdf8;color:#06101f;font-weight:800;border-radius:12px;padding:8px 16px;cursor:pointer;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.qs-b:active{transform:translateY(4px);border-bottom-width:1px}.qs-b.g{background:#10b981;border-bottom-color:#047857}.qs-b.o{background:#334155;border-bottom-color:#1e293b;color:#e2e8f0}';
    document.head.appendChild(s);
  }
  function cell(x) { if (!x) return '<span style="color:#475569">–</span>'; var c = cefr(x.v), cl = c === 'A2' ? 'qs-a2' : c === 'A1+' ? 'qs-a1p' : c === 'A1' ? 'qs-a1' : 'qs-p'; return x.pct + '% <span class="qs-c ' + cl + '">' + c + '</span>'; }

  var QS = root.QuizSkills = {
    skillsOf: skillsOf,
    open: function (grade) {
      css(); var g = grade === '4' ? '4' : '3', rows = plan(g);
      var box = document.getElementById('qs-box'); if (!box) { box = document.createElement('div'); box.id = 'qs-box'; document.body.appendChild(box); }
      var ready = rows.filter(function (r) { return r.k; }), noSpeak = ready.filter(function (r) { return !r.k.hasSpeaking; }).length;
      box.dataset.g = g;
      box.innerHTML = '<h2>🧩 Grade ' + g + ' · the 4 skills from the Unit 3 quiz</h2>' +
        '<div style="color:#94a3b8;font-size:.88rem">Saving writes these as an assessment for each pupil ("' + esc(TITLE) + '"), so the report, the Progress &amp; CEFR page and the profile show them. ' +
        'Quiz % is mapped gently to the skill scale: 80%+ = A2, 60%+ = A1+, 40%+ = A1, under 40% = Pre-A1. Saving again replaces the earlier save.</div>' +
        '<div class="qs-btns"><button class="qs-b g" onclick="QuizSkills.save()">💾 Save ' + ready.length + ' pupils to the reports</button><button class="qs-b o" style="margin-left:auto" onclick="QuizSkills.close()">Close ✕</button></div>' +
        (noSpeak ? '<div style="color:#fbbf24;font-size:.85rem">⚠ ' + noSpeak + ' pupil' + (noSpeak > 1 ? 's' : '') + ' have no speaking mark yet: their speaking is left out. Add the marks on the results board, then save again.</div>' : '') +
        '<table><tr><th>Pupil</th><th>Listening</th><th>Reading</th><th>Writing</th><th>Speaking</th></tr>' +
        rows.map(function (r) {
          var nm = esc((r.s.firstName || '') + ' ' + (r.s.lastName || ''));
          return r.k ? '<tr><td>' + nm + '</td><td>' + cell(r.k.skills.listening) + '</td><td>' + cell(r.k.skills.reading) + '</td><td>' + cell(r.k.skills.writing) + '</td><td>' + cell(r.k.skills.speaking) + '</td></tr>' : '<tr><td>' + nm + '</td><td colspan="4" style="color:#64748b">no quiz sheet: nothing to save</td></tr>';
        }).join('') + '</table>';
      box.style.display = 'block';
    },
    save: function () {
      var box = document.getElementById('qs-box'); if (!box) return;
      var rows = plan(box.dataset.g || '3').filter(function (r) { return r.k; }), st = S();
      if (!rows.length) return;
      rows.forEach(function (r) { write(r.s, r.k); });
      st.saveState(); if (st.notify) st.notify();
      var btn = box.querySelector('.qs-b.g'); if (btn) { btn.textContent = '✓ Saved ' + rows.length + ' pupils. Open any report to see them.'; btn.disabled = true; }
    },
    close: function () { var b = document.getElementById('qs-box'); if (b) b.style.display = 'none'; }
  };
})(typeof window !== 'undefined' ? window : this);
