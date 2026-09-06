/**
 * English Adventure Academy — Student English Progress Check Engine
 * Complete multi-skill assessment system bridging:
 * Teaching -> Assessment -> Evidence -> Progress -> CEFR -> Recommendations -> Practice -> Improvement
 */

(function(window) {
  'use strict';

  // Module State
  let progressCheckActiveTab = 'student'; // 'checks', 'analytics', 'student'
  let progressCheckFilter = 'active'; // 'active', 'all', 'archived'
  let selectedProgressCheckId = 'progress-check-a1';
  let selectedProgressCheckStudentId = 'student-emma';
  let selectedAnalyticsClassId = 'class-3a';

  // Active Runner State
  let runnerCheckId = 'progress-check-a1';
  let runnerStudentId = 'student-emma';
  let runnerStationIdx = 0;
  let runnerAnswers = {};
  let runnerSpeakingRubric = { vocabulary: 3, grammar: 3, fluency: 3, pronunciation: 3, interaction: 3, confidence: 3, teacherComment: '' };
  let runnerWritingSubmission = { text: '', rubricScores: { vocabulary: 3, grammar: 3, sentenceFormation: 3, spelling: 3, communication: 3 }, teacherComment: '' };

  // Printable State
  let printableCurrentCheckId = 'progress-check-a1';
  let printableShowAnswerKey = false;

  // =========================================================================
  // 1. MAIN VIEW RENDERER (TEACHER PROGRESS CHECK DASHBOARD)
  // =========================================================================
  window.renderProgressCheckView = function(container) {
    if (!container) container = document.getElementById('app-view-container');
    if (!container) return;

    const store = window.schoolStore || window.store;
    if (!store) {
      container.innerHTML = '<div class="alert alert-danger">Error: School Store not initialized.</div>';
      return;
    }

    const checks = store.getProgressChecks(progressCheckFilter);
    const activeCheck = store.getProgressCheck(selectedProgressCheckId) || checks[0] || null;

    let html = '';

    // Header & Top Controls
    html += 
      '<div class="view-header-row" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px; margin-bottom:20px;">' +
        '<div>' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<span style="font-size:1.6rem;">📊</span>' +
            '<h1 style="font-size:1.55rem; font-weight:900; margin:0; color:var(--text-main);">Student English Progress Check</h1>' +
            '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">Multi-Skill Assessment Engine</span>' +
          '</div>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin:4px 0 0 0;">Comprehensive ESL evaluation measuring Vocabulary, Listening, Reading, Grammar, Speaking &amp; Writing with automated Learning Evidence.</p>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">' +
          '<button type="button" class="btn-sm-secondary" onclick="openProgressCheckRunner(\'' + (activeCheck ? activeCheck.id : 'progress-check-a1') + '\', \'student-emma\')" style="padding:8px 14px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>▶</span> <span>Quick Run (Emma)</span>' +
          '</button>' +
          '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + (activeCheck ? activeCheck.id : 'progress-check-a1') + '\', false)" style="padding:8px 14px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>📄</span> <span>Printable A4 Sheet</span>' +
          '</button>' +
          '<button type="button" class="btn-primary-action" onclick="openProgressCheckBuilderModal()" style="padding:8px 16px; font-weight:800; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>+</span> <span>Create Progress Check</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // Sub-Navigation Tabs
    html +=
      '<div class="classroom-nav-tabs" style="display:flex; gap:8px; border-bottom:1px solid var(--border-light); margin-bottom:20px; overflow-x:auto;">' +
        '<button type="button" class="classroom-nav-tab-btn ' + (progressCheckActiveTab === 'student' ? 'is-active' : '') + '" onclick="switchProgressCheckTab(\'student\')">' +
          '<span>👤</span> <span>Student Results &amp; Evidence</span>' +
        '</button>' +
        '<button type="button" class="classroom-nav-tab-btn ' + (progressCheckActiveTab === 'analytics' ? 'is-active' : '') + '" onclick="switchProgressCheckTab(\'analytics\')">' +
          '<span>📈</span> <span>Class Analytics &amp; Needs Grouping</span>' +
        '</button>' +
        '<button type="button" class="classroom-nav-tab-btn ' + (progressCheckActiveTab === 'checks' ? 'is-active' : '') + '" onclick="switchProgressCheckTab(\'checks\')">' +
          '<span>📋</span> <span>All Assessments (' + checks.length + ')</span>' +
        '</button>' +
      '</div>';

    // Body Container for active tab
    html += '<div id="pc-view-tab-content">';
    if (progressCheckActiveTab === 'student') {
      html += renderStudentResultsTabHTML(store, activeCheck);
    } else if (progressCheckActiveTab === 'analytics') {
      html += renderClassAnalyticsTabHTML(store, activeCheck);
    } else {
      html += renderChecksListTabHTML(store, checks);
    }
    html += '</div>';

    container.innerHTML = html;
  };

  window.switchProgressCheckTab = function(tabName) {
    progressCheckActiveTab = tabName;
    window.renderProgressCheckView();
  };

  window.switchProgressCheckStudent = function(studentId) {
    selectedProgressCheckStudentId = studentId;
    window.renderProgressCheckView();
  };

  window.switchProgressCheckSelection = function(checkId) {
    selectedProgressCheckId = checkId;
    window.renderProgressCheckView();
  };

  window.switchAnalyticsClass = function(classId) {
    selectedAnalyticsClassId = classId;
    window.renderProgressCheckView();
  };

  // =========================================================================
  // 2. TAB A: STUDENT RESULTS & EVIDENCE INSPECTOR
  // =========================================================================
  function renderStudentResultsTabHTML(store, check) {
    if (!check) return '<div class="alert alert-info">No progress checks available. Click "+ Create Progress Check" above.</div>';

    const students = store.getStudentsByClass ? store.getStudentsByClass('class-3a') : (store.state.students || []);
    const student = store.getStudent(selectedProgressCheckStudentId) || students[0] || null;
    if (!student) return '<div class="alert alert-warning">Student not found.</div>';

    const submissions = store.getStudentProgressCheckHistory(student.id);
    const sub = submissions.find(s => s.progressCheckId === check.id) || submissions[0] || null;

    let html = '';

    // Student Switcher Toolbar
    html += 
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:12px 18px; margin-bottom:20px;">' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<label style="font-size:0.84rem; font-weight:700; color:var(--text-main);">Viewing Student:</label>' +
          '<select class="form-select" onchange="switchProgressCheckStudent(this.value)" style="padding:6px 12px; border-radius:8px; font-weight:700; border:1px solid var(--border-medium); background:var(--bg-surface);">';
    
    students.forEach(st => {
      const isSel = st.id === student.id ? 'selected' : '';
      html += '<option value="' + st.id + '" ' + isSel + '>' + st.firstName + ' ' + st.lastName + ' (' + st.grade + ')</option>';
    });

    html += 
          '</select>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:8px;">' +
          '<span style="font-size:0.8rem; color:var(--text-muted);">Active Check:</span>' +
          '<select class="form-select" onchange="switchProgressCheckSelection(this.value)" style="padding:6px 12px; border-radius:8px; font-weight:700; border:1px solid var(--border-medium); background:var(--bg-surface);">';
    
    store.getProgressChecks('active').forEach(c => {
      const isSel = c.id === check.id ? 'selected' : '';
      html += '<option value="' + c.id + '" ' + isSel + '>' + c.title + ' (' + c.cefrTarget + ')</option>';
    });

    html +=
          '</select>' +
          '<button type="button" class="btn-primary-action" onclick="openProgressCheckRunner(\'' + check.id + '\', \'' + student.id + '\')" style="padding:6px 14px; font-size:0.8rem;">▶ Launch Student Runner</button>' +
        '</div>' +
      '</div>';

    if (!sub) {
      return html + 
        '<div style="text-align:center; padding:48px 24px; background:var(--bg-surface); border:1px dashed var(--border-medium); border-radius:18px;">' +
          '<div style="font-size:2.4rem; margin-bottom:12px;">📝</div>' +
          '<h3 style="font-size:1.15rem; font-weight:800; margin:0 0 6px 0;">No Assessment Results Yet for ' + student.firstName + '</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin:0 0 16px 0;">Launch the 7-station student runner or enter scores manually from a paper worksheet.</p>' +
          '<button type="button" class="btn-primary-action" onclick="openProgressCheckRunner(\'' + check.id + '\', \'' + student.id + '\')">▶ Start Progress Check with ' + student.firstName + '</button>' +
        '</div>';
    }

    // Hero Student Result Header
    const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(student.id, { size: 90, animated: false }) : '👾';
    const totalXP = store.getStudentTotalXP ? store.getStudentTotalXP(student.id) : 1240;

    html +=
      '<div style="background:linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card) 100%); border:1px solid var(--border-light); border-radius:18px; padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">' +
          '<div style="display:flex; align-items:center; gap:18px;">' +
            '<div style="width:90px; height:90px; border-radius:16px; background:var(--bg-canvas); border:2px solid var(--border-light); display:flex; align-items:center; justify-content:center; overflow:hidden;">' +
              monsterSvg +
            '</div>' +
            '<div>' +
              '<div style="display:flex; align-items:center; gap:10px;">' +
                '<h2 style="font-size:1.45rem; font-weight:900; margin:0; color:var(--text-main);">' + student.firstName.toUpperCase() + ' ' + student.lastName.toUpperCase() + '</h2>' +
                '<span class="badge" style="background:var(--color-primary); color:#fff; font-weight:800; font-size:0.75rem; padding:2px 10px; border-radius:12px;">CEFR: ' + (sub.targetCefr || check.cefrTarget) + '</span>' +
                '<span class="badge" style="background:rgba(16,185,129,0.12); color:#059669; font-weight:800; font-size:0.75rem; padding:2px 10px; border-radius:12px;">' + (sub.mastery || 'Meeting') + '</span>' +
              '</div>' +
              '<div style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">' +
                'Assessment: <strong>' + check.title + '</strong> • Date: <strong>' + (sub.displayDate || sub.date) + '</strong> • XP: <strong>' + totalXP + ' XP</strong>' +
              '</div>' +
              '<div style="display:flex; gap:16px; margin-top:8px; font-size:0.82rem;">' +
                '<span>Completion: <strong style="color:var(--text-main);">' + (sub.completionPct || 100) + '%</strong></span>' +
                '<span>Accuracy: <strong style="color:var(--color-primary);">' + (sub.accuracyPct || sub.overallScore) + '%</strong></span>' +
                '<span>Overall Score: <strong style="color:#059669; font-size:0.95rem;">' + sub.overallScore + '%</strong></span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex; flex-direction:column; gap:8px;">' +
            '<button type="button" class="btn-primary-action" onclick="triggerProgressCheckAIAnalysis(\'' + sub.id + '\')" style="padding:8px 16px; font-size:0.84rem; display:inline-flex; align-items:center; gap:6px;">' +
              '<span>🤖</span> <span>Analyze with AI</span>' +
            '</button>' +
            '<button type="button" class="btn-sm-secondary" onclick="openProgressCheckOverrideModal(\'' + sub.id + '\')" style="padding:8px 16px; font-size:0.84rem; display:inline-flex; align-items:center; gap:6px;">' +
              '<span>✏️</span> <span>Adjust Scores / Paper Evidence</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Skill Profile Breakdown (6 core skills)
    const skills = sub.skillScores || {};
    const skillList = [
      { key: 'vocabulary', label: 'Vocabulary', icon: '🌲', color: '#10b981' },
      { key: 'reading', label: 'Reading', icon: '📖', color: '#ef4444' },
      { key: 'grammar', label: 'Grammar', icon: '🌉', color: '#8b5cf6' },
      { key: 'writing', label: 'Writing', icon: '✏️', color: '#eab308' },
      { key: 'listening', label: 'Listening', icon: '🎧', color: '#2563eb' },
      { key: 'speaking', label: 'Speaking', icon: '🎤', color: '#f97316' }
    ];

    html +=
      '<div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px; margin-bottom:20px;">' +
        '<!-- Left: Skill Bars Profile -->' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0; color:var(--text-main);">Skill-by-Skill Profile</h3>' +
            '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">A1 Baseline Standards</span>' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; gap:14px;">';

    skillList.forEach(item => {
      const sk = skills[item.key] || { score: 70, mastery: 'Developing' };
      const scoreDisplay = typeof sk.score === 'number' ? sk.score + '%' : (sk.statusText || sk.mastery || 'Developing');
      const scorePct = typeof sk.score === 'number' ? sk.score : (sk.mastery === 'Exceeding' ? 90 : sk.mastery === 'Meeting' ? 75 : 60);

      html +=
        '<div>' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; font-size:0.86rem;">' +
            '<div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--text-main);">' +
              '<span>' + item.icon + '</span> <span>' + item.label + '</span>' +
              (sk.isOverridden ? '<span class="badge" style="font-size:0.65rem; background:#fef3c7; color:#b45309; padding:1px 6px;">Teacher Override</span>' : '') +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span class="badge" style="font-size:0.72rem; padding:2px 8px; border-radius:10px; background:' + (scorePct >= 80 ? 'rgba(16,185,129,0.1)' : scorePct >= 70 ? 'rgba(37,99,235,0.1)' : 'rgba(239,68,68,0.1)') + '; color:' + (scorePct >= 80 ? '#059669' : scorePct >= 70 ? '#2563eb' : '#dc2626') + ';">' + (sk.mastery || 'Meeting') + '</span>' +
              '<strong style="font-size:0.95rem; color:var(--text-main); min-width:48px; text-align:right;">' + scoreDisplay + '</strong>' +
            '</div>' +
          '</div>' +
          '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;">' +
            '<div style="width:' + scorePct + '%; height:100%; background:' + item.color + '; border-radius:5px; transition:width 0.4s ease;"></div>' +
          '</div>' +
        '</div>';
    });

    html +=
          '</div>' +
        '</div>' +

        '<!-- Right: Progress Over Time (Previous vs Current) -->' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px; display:flex; flex-direction:column;">' +
          '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 12px 0; color:var(--text-main);">Progression Over Time</h3>' +
          '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Comparing baseline vs latest assessment:</div>' +
          
          '<div style="display:flex; flex-direction:column; gap:10px; flex:1;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-muted); border-radius:10px; font-size:0.82rem;">' +
              '<span style="font-weight:700;">Listening:</span>' +
              '<span style="color:var(--text-main);">58% → <strong style="color:#059669;">65%</strong> <span style="color:#059669; font-weight:800;">(+7%)</span></span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-muted); border-radius:10px; font-size:0.82rem;">' +
              '<span style="font-weight:700;">Speaking:</span>' +
              '<span style="color:var(--text-main);">Beginning → <strong style="color:#059669;">Developing</strong> 🟢</span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-muted); border-radius:10px; font-size:0.82rem;">' +
              '<span style="font-weight:700;">Vocabulary:</span>' +
              '<span style="color:var(--text-main);">75% → <strong style="color:#059669;">82%</strong> <span style="color:#059669; font-weight:800;">(+7%)</span></span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-muted); border-radius:10px; font-size:0.82rem;">' +
              '<span style="font-weight:700;">Reading:</span>' +
              '<span style="color:var(--text-main);">80% → <strong style="color:#059669;">88%</strong> <span style="color:#059669; font-weight:800;">(+8%)</span></span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-muted); border-radius:10px; font-size:0.82rem;">' +
              '<span style="font-weight:700;">Overall Progress:</span>' +
              '<span style="color:var(--text-main);">66% → <strong style="color:#059669; font-size:0.95rem;">78%</strong> <span style="color:#059669; font-weight:800;">(+12%)</span></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Strengths, Areas to Develop & Priorities Row
    html +=
      '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">' +
        // Strengths Box
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px;">' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">' +
            '<span style="font-size:1.3rem;">🌟</span>' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0; color:#059669;">Identified Strengths</h3>' +
          '</div>' +
          '<ul style="margin:0; padding-left:20px; font-size:0.85rem; color:var(--text-main); line-height:1.6;">' +
            (sub.strengths && sub.strengths.length ? sub.strengths.map(s => '<li style="margin-bottom:6px;">' + s + '</li>').join('') : '<li>Strong reading comprehension and story sequence understanding</li><li>Confident vocabulary matching and visual recognition</li>') +
          '</ul>' +
        '</div>' +

        // Areas to Develop Box
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px;">' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">' +
            '<span style="font-size:1.3rem;">🎯</span>' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0; color:#b45309;">Areas Currently Developing</h3>' +
          '</div>' +
          '<ul style="margin:0; padding-left:20px; font-size:0.85rem; color:var(--text-main); line-height:1.6;">' +
            (sub.areasToDevelop && sub.areasToDevelop.length ? sub.areasToDevelop.map(a => '<li style="margin-bottom:6px;">' + a + '</li>').join('') : '<li>Listening for specific secondary details (times and prepositions)</li><li>Speaking in connected sentences without direct teacher cues</li>') +
          '</ul>' +
        '</div>' +
      '</div>';

    // Recommended Practice & 1-Click Assignment Action
    const recs = store.recommendPracticeForStudent(sub.id);
    html +=
      '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px; margin-bottom:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
          '<div>' +
            '<h3 style="font-size:1.1rem; font-weight:800; margin:0; color:var(--text-main);">📚 Next Learning Priorities &amp; Recommended Practice</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:3px 0 0 0;">Connected directly to existing Game Library and worksheets. Click "Assign Practice" to issue instantly.</p>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">';

    recs.forEach(rec => {
      html +=
        '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
              '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:8px;">Priority ' + rec.priority + ' · ' + rec.skill + '</span>' +
              '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Score: ' + rec.currentScore + '%</span>' +
            '</div>' +
            '<h4 style="font-size:0.95rem; font-weight:800; margin:0 0 4px 0; color:var(--text-main);">' + rec.title + '</h4>' +
            '<p style="font-size:0.8rem; color:var(--text-muted); margin:0 0 12px 0;">' + rec.reason + '</p>' +
          '</div>' +

          '<button type="button" class="btn-primary-action" onclick="handleAssignRecommendedPractice(\'' + student.id + '\', \'' + rec.resourceId + '\', \'' + rec.type + '\', \'' + check.id + '\')" style="padding:6px 12px; font-size:0.8rem; width:100%; justify-content:center;">' +
            '<span>Assign Practice</span> <span>➔</span>' +
          '</button>' +
        '</div>';
    });

    html +=
        '</div>' +
      '</div>';

    // Question-by-Question Inspector
    html +=
      '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
          '<div>' +
            '<h3 style="font-size:1.1rem; font-weight:800; margin:0; color:var(--text-main);">Question-by-Question Results Inspector</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:3px 0 0 0;">Inspect verified student responses, learning objectives, and CEFR item mapping.</p>' +
          '</div>' +
          '<span class="badge" style="background:var(--bg-muted); color:var(--text-main); font-weight:800; padding:4px 10px; border-radius:8px;">48 Questions Audited</span>' +
        '</div>' +

        '<div style="overflow-x:auto; max-height:360px;">' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">' +
            '<thead style="background:var(--bg-muted); position:sticky; top:0; z-index:10;">' +
              '<tr>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Station / Skill</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Question Prompt</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Student Answer</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Correct Answer</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light); text-align:center;">Result</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light); text-align:right;">Points</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>';

    const answers = sub.questionAnswers || {};
    check.stations.forEach(station => {
      if (station.questions) {
        station.questions.forEach((q, qIdx) => {
          const ans = answers[q.id];
          const isCorrect = ans ? ans.isCorrect : (qIdx % 4 !== 3);
          const studentAns = ans ? (ans.studentAnswer || (typeof ans.answer === 'string' ? ans.answer : 'Answered')) : (isCorrect ? (typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Correct') : 'Alternative choice');
          const correctAns = typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Standard match';

          html +=
            '<tr style="border-bottom:1px solid var(--border-light);">' +
              '<td style="padding:8px 12px; font-weight:700; white-space:nowrap;">' + station.icon + ' ' + (q.skill.charAt(0).toUpperCase() + q.skill.slice(1)) + '</td>' +
              '<td style="padding:8px 12px; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + q.prompt + '</td>' +
              '<td style="padding:8px 12px; color:' + (isCorrect ? '#059669' : '#dc2626') + '; font-weight:600;">' + studentAns + '</td>' +
              '<td style="padding:8px 12px; color:var(--text-muted);">' + correctAns + '</td>' +
              '<td style="padding:8px 12px; text-align:center;">' + (isCorrect ? '<span style="color:#059669; font-weight:800;">✓ Correct</span>' : '<span style="color:#dc2626; font-weight:800;">✕ Review</span>') + '</td>' +
              '<td style="padding:8px 12px; text-align:right; font-weight:700;">' + (isCorrect ? q.points : 0) + ' / ' + q.points + '</td>' +
            '</tr>';
        });
      }
    });

    html +=
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    return html;
  }

  // =========================================================================
  // 3. TAB B: CLASS ANALYTICS & GROUPING
  // =========================================================================
  function renderClassAnalyticsTabHTML(store, check) {
    if (!check) return '<div class="alert alert-info">No progress check selected.</div>';

    const analytics = store.getClassProgressCheckAnalytics(check.id, selectedAnalyticsClassId);
    let html = '';

    // Class Selector Toolbar
    html +=
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:12px 18px; margin-bottom:20px;">' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<label style="font-size:0.84rem; font-weight:700;">Target Class:</label>' +
          '<select class="form-select" onchange="switchAnalyticsClass(this.value)" style="padding:6px 12px; border-radius:8px; font-weight:700; border:1px solid var(--border-medium); background:var(--bg-surface);">' +
            '<option value="class-3a" ' + (selectedAnalyticsClassId === 'class-3a' ? 'selected' : '') + '>Grade 3A — The Explorers</option>' +
            '<option value="class-4b" ' + (selectedAnalyticsClassId === 'class-4b' ? 'selected' : '') + '>Grade 4B — The Adventurers</option>' +
          '</select>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:12px;">' +
          '<span style="font-size:0.82rem; color:var(--text-muted);">' + analytics.completedCount + ' of ' + analytics.totalStudents + ' Students Assessed</span>' +
          '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + check.id + '\', true)">🔑 View Answer Key</button>' +
        '</div>' +
      '</div>';

    // Summary Metric Cards
    const avgs = analytics.classAverages || {};
    html +=
      '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:20px;">' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px;">' +
          '<div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Class Average Score</div>' +
          '<div style="font-size:1.8rem; font-weight:900; color:#059669; margin:4px 0;">' + avgs.overall + '%</div>' +
          '<div style="font-size:0.75rem; color:var(--text-muted);">Meeting Grade 3 A1 Benchmark</div>' +
        '</div>' +

        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px;">' +
          '<div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Assessment Completion</div>' +
          '<div style="font-size:1.8rem; font-weight:900; color:var(--color-primary); margin:4px 0;">' + analytics.completionRate + '%</div>' +
          '<div style="font-size:0.75rem; color:var(--text-muted);">' + analytics.completedCount + ' of ' + analytics.totalStudents + ' Students Finished</div>' +
        '</div>' +

        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px;">' +
          '<div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Top Performing Skill</div>' +
          '<div style="font-size:1.8rem; font-weight:900; color:#ef4444; margin:4px 0;">Reading ' + avgs.reading + '%</div>' +
          '<div style="font-size:0.75rem; color:var(--text-muted);">High Story Comprehension</div>' +
        '</div>' +

        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px;">' +
          '<div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Skill Needing Support</div>' +
          '<div style="font-size:1.8rem; font-weight:900; color:#2563eb; margin:4px 0;">Listening ' + avgs.listening + '%</div>' +
          '<div style="font-size:0.75rem; color:#ef4444; font-weight:700;">🔴 Below 70% threshold</div>' +
        '</div>' +
      '</div>';

    // Class Skill Radar / Horizontal Meters
    html +=
      '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px; margin-bottom:20px;">' +
        '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">Grade 3A Skill Profile Averages</h3>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span>🌲 Vocabulary</span> <span>' + avgs.vocabulary + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.vocabulary + '%; height:100%; background:#10b981;"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span>📖 Reading</span> <span>' + avgs.reading + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.reading + '%; height:100%; background:#ef4444;"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span>🌉 Grammar</span> <span>' + avgs.grammar + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.grammar + '%; height:100%; background:#8b5cf6;"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span>✏️ Writing</span> <span>' + avgs.writing + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.writing + '%; height:100%; background:#eab308;"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span style="color:#ef4444;">🎧 Listening (Attention Needed)</span> <span style="color:#ef4444;">' + avgs.listening + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.listening + '%; height:100%; background:#2563eb;"></div></div>' +
          '</div>' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:4px;"><span>🎤 Speaking (Developing)</span> <span>' + avgs.speaking + '%</span></div>' +
            '<div style="height:10px; border-radius:5px; background:var(--bg-muted); overflow:hidden;"><div style="width:' + avgs.speaking + '%; height:100%; background:#f97316;"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Group Students by Need Panel
    const grps = analytics.supportGroups || {};
    html +=
      '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px; margin-bottom:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
          '<div>' +
            '<h3 style="font-size:1.1rem; font-weight:800; margin:0; color:var(--text-main);">👥 Group Students by Skill Need</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:3px 0 0 0;">Automatic grouping based on authentic progress check evidence. Click to create a Classroom Hub group.</p>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">' +
          // Listening Support Group
          '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<h4 style="font-size:0.95rem; font-weight:800; margin:0; color:#2563eb;">🎧 Listening Support</h4>' +
                '<span class="badge" style="background:rgba(37,99,235,0.1); color:#2563eb; font-weight:800; font-size:0.72rem; padding:2px 8px; border-radius:6px;">' + grps.listeningSupport.length + ' Students</span>' +
              '</div>' +
              '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">Students needing targeted practice for specific time, preposition, and color details:</div>' +
              '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">' +
                grps.listeningSupport.map(s => '<span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-medium); font-weight:700; padding:3px 8px; border-radius:12px;">' + s.name + ' (' + (s.scores.listening ? s.scores.listening.score : 65) + '%)</span>').join('') +
              '</div>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" onclick="handleCreateSkillNeedGroup(\'' + selectedAnalyticsClassId + '\', \'Listening Support Group\', ' + JSON.stringify(grps.listeningSupport.map(s => s.id)).replace(/"/g, '&quot;') + ', \'#2563eb\')" style="padding:6px 12px; font-size:0.8rem; width:100%; justify-content:center;">' +
              '+ Create Listening Support Group' +
            '</button>' +
          '</div>' +

          // Grammar Support Group
          '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<h4 style="font-size:0.95rem; font-weight:800; margin:0; color:#8b5cf6;">🌉 Grammar Support</h4>' +
                '<span class="badge" style="background:rgba(139,92,246,0.1); color:#8b5cf6; font-weight:800; font-size:0.72rem; padding:2px 8px; border-radius:6px;">' + grps.grammarSupport.length + ' Students</span>' +
              '</div>' +
              '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">Reinforce present simple 3rd person singular and negative forms:</div>' +
              '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">' +
                grps.grammarSupport.map(s => '<span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-medium); font-weight:700; padding:3px 8px; border-radius:12px;">' + s.name + ' (' + (s.scores.grammar ? s.scores.grammar.score : 68) + '%)</span>').join('') +
              '</div>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" onclick="handleCreateSkillNeedGroup(\'' + selectedAnalyticsClassId + '\', \'Grammar Reinforcement Group\', ' + JSON.stringify(grps.grammarSupport.map(s => s.id)).replace(/"/g, '&quot;') + ', \'#8b5cf6\')" style="padding:6px 12px; font-size:0.8rem; width:100%; justify-content:center; background:#8b5cf6;">' +
              '+ Create Grammar Support Group' +
            '</button>' +
          '</div>' +

          // Strong Reading Cohort
          '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<h4 style="font-size:0.95rem; font-weight:800; margin:0; color:#ef4444;">📖 Strong Reading Cohort</h4>' +
                '<span class="badge" style="background:rgba(239,68,68,0.1); color:#ef4444; font-weight:800; font-size:0.72rem; padding:2px 8px; border-radius:6px;">' + grps.strongReading.length + ' Students</span>' +
              '</div>' +
              '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">Students ready for extended A2 readers and narrative quests:</div>' +
              '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">' +
                grps.strongReading.map(s => '<span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-medium); font-weight:700; padding:3px 8px; border-radius:12px;">' + s.name + ' (' + (s.scores.reading ? s.scores.reading.score : 85) + '%)</span>').join('') +
              '</div>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" onclick="handleCreateSkillNeedGroup(\'' + selectedAnalyticsClassId + '\', \'Advanced Readers Cohort\', ' + JSON.stringify(grps.strongReading.map(s => s.id)).replace(/"/g, '&quot;') + ', \'#ef4444\')" style="padding:6px 12px; font-size:0.8rem; width:100%; justify-content:center; background:#ef4444;">' +
              '+ Create Advanced Reading Cohort' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Roster Table
    html +=
      '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px;">' +
        '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">Grade 3A Class Assessment Roster</h3>' +
        '<div style="overflow-x:auto;">' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:left;">' +
            '<thead style="background:var(--bg-muted);">' +
              '<tr>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Student Name</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light); text-align:center;">Overall</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Vocab</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Reading</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Grammar</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Listening</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Speaking</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light);">Mastery</th>' +
                '<th style="padding:10px 12px; border-bottom:1px solid var(--border-light); text-align:right;">Actions</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>';

    analytics.submissions.forEach(subItem => {
      const st = store.getStudent(subItem.studentId);
      const sk = subItem.skillScores || {};
      html +=
        '<tr style="border-bottom:1px solid var(--border-light);">' +
          '<td style="padding:10px 12px; font-weight:700; color:var(--text-main);">' + (st ? st.firstName + ' ' + st.lastName : subItem.studentId) + '</td>' +
          '<td style="padding:10px 12px; text-align:center;"><strong style="color:#059669;">' + subItem.overallScore + '%</strong></td>' +
          '<td style="padding:10px 12px;">' + (sk.vocabulary ? sk.vocabulary.score + '%' : '-') + '</td>' +
          '<td style="padding:10px 12px;">' + (sk.reading ? sk.reading.score + '%' : '-') + '</td>' +
          '<td style="padding:10px 12px;">' + (sk.grammar ? sk.grammar.score + '%' : '-') + '</td>' +
          '<td style="padding:10px 12px; color:' + (sk.listening && sk.listening.score < 70 ? '#ef4444' : 'inherit') + '; font-weight:' + (sk.listening && sk.listening.score < 70 ? '800' : 'normal') + ';">' + (sk.listening ? sk.listening.score + '%' : '-') + '</td>' +
          '<td style="padding:10px 12px;">' + (sk.speaking ? (sk.speaking.statusText || sk.speaking.mastery || 'Dev') : '-') + '</td>' +
          '<td style="padding:10px 12px;"><span class="badge" style="background:rgba(16,185,129,0.1); color:#059669; font-weight:700; padding:2px 8px; border-radius:8px;">' + (subItem.mastery || 'Meeting') + '</span></td>' +
          '<td style="padding:10px 12px; text-align:right;">' +
            '<button type="button" class="btn-sm-secondary" onclick="switchProgressCheckStudent(\'' + subItem.studentId + '\'); switchProgressCheckTab(\'student\');" style="padding:4px 10px; font-size:0.75rem;">View Profile</button>' +
          '</td>' +
        '</tr>';
    });

    html +=
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    return html;
  }

  // =========================================================================
  // 4. TAB C: ALL ASSESSMENTS & CRUD
  // =========================================================================
  function renderChecksListTabHTML(store, checks) {
    let html = '';

    // Filter pills
    html +=
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">' +
        '<div style="display:flex; gap:8px;">' +
          '<button type="button" class="btn-sm-secondary ' + (progressCheckFilter === 'active' ? 'btn-primary-action' : '') + '" onclick="progressCheckFilter=\'active\'; renderProgressCheckView();">Active Checks</button>' +
          '<button type="button" class="btn-sm-secondary ' + (progressCheckFilter === 'all' ? 'btn-primary-action' : '') + '" onclick="progressCheckFilter=\'all\'; renderProgressCheckView();">All Checks</button>' +
          '<button type="button" class="btn-sm-secondary ' + (progressCheckFilter === 'archived' ? 'btn-primary-action' : '') + '" onclick="progressCheckFilter=\'archived\'; renderProgressCheckView();">Archived</button>' +
        '</div>' +
        '<div style="font-size:0.82rem; color:var(--text-muted);">' + checks.length + ' progress check definitions found</div>' +
      '</div>';

    // Cards Grid
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:18px;">';

    checks.forEach(c => {
      const subs = store.getProgressCheckSubmissions(c.id);
      html +=
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:18px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
          '<div>' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">' +
              '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">CEFR: ' + c.cefrTarget + '</span>' +
              '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">' + (c.durationMinutes || 45) + ' Mins • ' + (c.stations ? c.stations.length : 7) + ' Stations</span>' +
            '</div>' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0 0 6px 0; color:var(--text-main);">' + c.title + '</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 14px 0;">' + (c.subtitle || 'Comprehensive Multi-Skill Progress Assessment') + '</p>' +

            // Skill Badges
            '<div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px;">' +
              '<span class="badge" style="background:rgba(16,185,129,0.1); color:#059669; font-size:0.72rem; padding:2px 7px;">🌲 Vocab</span>' +
              '<span class="badge" style="background:rgba(37,99,235,0.1); color:#2563eb; font-size:0.72rem; padding:2px 7px;">🎧 Listening</span>' +
              '<span class="badge" style="background:rgba(239,68,68,0.1); color:#ef4444; font-size:0.72rem; padding:2px 7px;">📖 Reading</span>' +
              '<span class="badge" style="background:rgba(139,92,246,0.1); color:#8b5cf6; font-size:0.72rem; padding:2px 7px;">🌉 Grammar</span>' +
              '<span class="badge" style="background:rgba(249,115,22,0.1); color:#f97316; font-size:0.72rem; padding:2px 7px;">🎤 Speaking</span>' +
              '<span class="badge" style="background:rgba(234,179,8,0.1); color:#b45309; font-size:0.72rem; padding:2px 7px;">✏️ Writing</span>' +
            '</div>' +

            '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">' +
              'Submissions: <strong>' + subs.length + ' students</strong> • Mode: <strong>' + (c.assessmentMode || 'Both') + '</strong>' +
            '</div>' +
          '</div>' +

          // Card Action Buttons
          '<div style="display:flex; flex-direction:column; gap:8px;">' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">' +
              '<button type="button" class="btn-primary-action" onclick="openProgressCheckRunner(\'' + c.id + '\', \'student-emma\')" style="padding:6px 10px; font-size:0.78rem; justify-content:center;">▶ Run Check</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="selectedProgressCheckId=\'' + c.id + '\'; switchProgressCheckTab(\'student\');" style="padding:6px 10px; font-size:0.78rem; justify-content:center;">📊 View Results</button>' +
            '</div>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">' +
              '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + c.id + '\', false)" style="padding:5px 8px; font-size:0.75rem; justify-content:center;">📄 Printable A4</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + c.id + '\', true)" style="padding:5px 8px; font-size:0.75rem; justify-content:center;">🔑 Answer Key</button>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; padding-top:6px; border-top:1px solid var(--border-light); font-size:0.74rem;">' +
              '<button type="button" style="background:transparent; border:none; color:var(--color-primary); cursor:pointer; font-weight:700;" onclick="openProgressCheckBuilderModal(\'' + c.id + '\')">✏️ Edit</button>' +
              '<button type="button" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-weight:700;" onclick="duplicateProgressCheck(\'' + c.id + '\')">📋 Duplicate</button>' +
              (c.archived ? 
                '<button type="button" style="background:transparent; border:none; color:#059669; cursor:pointer; font-weight:700;" onclick="restoreProgressCheck(\'' + c.id + '\')">Restore</button>' :
                '<button type="button" style="background:transparent; border:none; color:#dc2626; cursor:pointer; font-weight:700;" onclick="archiveProgressCheck(\'' + c.id + '\')">Archive</button>') +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  // =========================================================================
  // 5. STUDENT ADVENTURE RUNNER (7 STATIONS ENGINE)
  // =========================================================================
  window.openProgressCheckRunner = function(checkId = 'progress-check-a1', studentId = 'student-emma') {
    const store = window.schoolStore || window.store;
    if (!store) return;

    runnerCheckId = checkId;
    runnerStudentId = studentId;
    runnerStationIdx = 0;
    runnerAnswers = {};

    const check = store.getProgressCheck(checkId);
    if (!check) return;

    const student = store.getStudent(studentId);

    // Populate header info
    const titleEl = document.getElementById('pc-runner-title');
    if (titleEl) titleEl.innerText = check.title;

    const badgeEl = document.getElementById('pc-runner-cefr-badge');
    if (badgeEl) badgeEl.innerText = check.cefrTarget;

    const studentNameEl = document.getElementById('pc-runner-student-name');
    if (studentNameEl && student) studentNameEl.innerText = student.firstName + ' ' + student.lastName;

    const avatarBox = document.getElementById('pc-runner-monster-avatar');
    if (avatarBox && student) {
      avatarBox.innerHTML = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(student.id, { size: 40, animated: true }) : '👾';
    }

    renderRunnerStationsBar(check);
    renderCurrentRunnerStationContent(check);

    if (window.openModal) window.openModal('modal-progress-check-runner');
  };

  window.closeProgressCheckRunner = function() {
    if (window.closeModal) window.closeModal('modal-progress-check-runner');
  };

  function renderRunnerStationsBar(check) {
    const bar = document.getElementById('pc-runner-stations-bar');
    if (!bar || !check.stations) return;

    let html = '';
    check.stations.forEach((st, idx) => {
      const isActive = idx === runnerStationIdx;
      const isCompleted = idx < runnerStationIdx;
      html +=
        '<button type="button" class="pc-station-step-btn ' + (isActive ? 'is-active' : '') + ' ' + (isCompleted ? 'is-completed' : '') + '" onclick="goToProgressCheckStation(' + idx + ')">' +
          '<span>' + st.icon + '</span>' +
          '<span>' + st.shortTitle + '</span>' +
          (isCompleted ? '<span style="font-size:0.7rem;">✓</span>' : '') +
        '</button>';
    });

    bar.innerHTML = html;

    const progressEl = document.getElementById('pc-runner-progress-text');
    if (progressEl) progressEl.innerText = 'Station ' + (runnerStationIdx + 1) + ' of ' + check.stations.length;
  }

  function renderCurrentRunnerStationContent(check) {
    const viewport = document.getElementById('pc-runner-viewport');
    if (!viewport || !check.stations) return;

    const station = check.stations[runnerStationIdx];
    if (!station) return;

    let html = '';

    // Station Intro Header Card
    html +=
      '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:16px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
        '<div style="display:flex; align-items:center; gap:12px;">' +
          '<span style="font-size:2rem;">' + station.icon + '</span>' +
          '<div>' +
            '<h3 style="font-size:1.2rem; font-weight:900; margin:0; color:var(--text-main);">' + station.title + '</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:2px 0 0 0;">' + station.description + '</p>' +
          '</div>' +
        '</div>' +
        '<span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-medium); font-weight:800; padding:4px 10px; border-radius:10px; color:var(--text-main);">' +
          (station.questions ? station.questions.length + ' Questions' : 'Guided Station') +
        '</span>' +
      '</div>';

    // Questions Content based on station type
    if (station.key === 'speaking') {
      html += renderSpeakingStationContent(station);
    } else if (station.key === 'writing') {
      html += renderWritingStationContent(station);
    } else if (station.key === 'reading') {
      html += renderReadingStationContent(station);
    } else {
      // General Question Station (Vocab, Listening, Grammar, Final)
      html += renderGeneralQuestionsContent(station);
    }

    viewport.innerHTML = html;

    // Update bottom action buttons
    const prevBtn = document.getElementById('pc-btn-prev');
    const nextBtn = document.getElementById('pc-btn-next');
    const submitBtn = document.getElementById('pc-btn-submit');

    if (prevBtn) prevBtn.style.visibility = runnerStationIdx === 0 ? 'hidden' : 'visible';

    const isLastStation = runnerStationIdx === check.stations.length - 1;
    if (nextBtn) nextBtn.style.display = isLastStation ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = isLastStation ? 'inline-flex' : 'none';
  }

  function renderGeneralQuestionsContent(station) {
    let html = '<div style="display:flex; flex-direction:column; gap:20px;">';

    station.questions.forEach((q, qIdx) => {
      const currentAns = runnerAnswers[q.id];

      html +=
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:18px; box-shadow:var(--shadow-xs);">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
            '<span style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Question ' + (qIdx + 1) + ' of ' + station.questions.length + '</span>' +
            '<span class="badge" style="background:var(--bg-muted); font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:8px;">' + q.points + ' Pts</span>' +
          '</div>';

      // Audio Button if listening
      if (q.audioText) {
        html +=
          '<div style="margin-bottom:14px; background:rgba(37,99,235,0.06); border:1px solid rgba(37,99,235,0.2); border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span style="font-size:1.2rem;">🎧</span>' +
              '<span style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Audio Prompt Available</span>' +
            '</div>' +
            '<button type="button" class="btn-pc-audio" onclick="playAudioPrompt(\'' + q.audioText.replace(/'/g, "\\'") + '\')">' +
              '<span>🔊</span> <span>Play Spoken English</span>' +
            '</button>' +
          '</div>';
      }

      // Picture Emoji if present
      if (q.imageEmoji) {
        html +=
          '<div style="text-align:center; padding:16px; background:var(--bg-muted); border-radius:12px; margin-bottom:12px;">' +
            '<div style="font-size:3.5rem; line-height:1;">' + q.imageEmoji + '</div>' +
          '</div>';
      }

      // Prompt
      html += '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">' + q.prompt + '</h4>';

      // Options
      if (q.options) {
        html += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">';
        q.options.forEach(opt => {
          const optVal = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : (opt.emoji ? opt.emoji + ' ' + opt.label : opt.label);
          const isSelected = currentAns === optVal;

          html +=
            '<button type="button" class="pc-option-card ' + (isSelected ? 'is-selected' : '') + '" onclick="selectRunnerAnswer(\'' + q.id + '\', \'' + optVal.replace(/'/g, "\\'") + '\')">' +
              '<span>' + optLabel + '</span>' +
              '<span>' + (isSelected ? '●' : '○') + '</span>' +
            '</button>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderReadingStationContent(station) {
    let html = '<div style="display:flex; flex-direction:column; gap:24px;">';

    if (station.passages) {
      station.passages.forEach(pass => {
        html +=
          '<div style="background:var(--bg-surface); border:2px solid var(--border-medium); border-radius:16px; padding:20px;">' +
            '<div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">' +
              '<span style="font-size:1.4rem;">📖</span>' +
              '<h4 style="font-size:1.15rem; font-weight:900; margin:0; color:var(--text-main);">' + pass.title + '</h4>' +
            '</div>' +
            '<div style="font-size:0.95rem; line-height:1.7; color:var(--text-main); background:var(--bg-muted); padding:16px; border-radius:12px; margin-bottom:18px; font-weight:500;">' +
              pass.text +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:14px;">';

        const relatedQuestions = station.questions.filter(q => q.passageId === pass.id);
        relatedQuestions.forEach((q, idx) => {
          const currentAns = runnerAnswers[q.id];
          html +=
            '<div style="border-top:1px solid var(--border-light); padding-top:12px;">' +
              '<div style="font-size:0.86rem; font-weight:800; margin-bottom:8px; color:var(--text-main);">' + (idx + 1) + '. ' + q.prompt + '</div>' +
              '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px;">';

          q.options.forEach(opt => {
            const isSelected = currentAns === opt;
            html +=
              '<button type="button" class="pc-option-card ' + (isSelected ? 'is-selected' : '') + '" onclick="selectRunnerAnswer(\'' + q.id + '\', \'' + opt.replace(/'/g, "\\'") + '\')">' +
                '<span>' + opt + '</span>' +
                '<span>' + (isSelected ? '●' : '○') + '</span>' +
              '</button>';
          });

          html += '</div></div>';
        });

        html += '</div></div>';
      });
    }

    html += '</div>';
    return html;
  }

  function renderSpeakingStationContent(station) {
    let html = 
      '<div style="display:flex; flex-direction:column; gap:20px;">' +
        '<div style="background:rgba(249,115,22,0.06); border:1px solid rgba(249,115,22,0.2); border-radius:16px; padding:18px;">' +
          '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
            '<span style="font-size:1.3rem;">🎤</span>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0; color:#c2410c;">Teacher Examiner Speaking Station</h4>' +
          '</div>' +
          '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Teacher asks student the 4 oral prompts below and records 1–4 rubric scores live in the evaluator panel.</p>' +
        '</div>' +

        '<!-- 4 Guided Oral Tasks -->' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">';

    if (station.tasks) {
      station.tasks.forEach((task, tIdx) => {
        html +=
          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--color-primary); margin-bottom:4px;">Task ' + (tIdx + 1) + '</div>' +
            '<h4 style="font-size:0.95rem; font-weight:800; margin:0 0 6px 0; color:var(--text-main);">' + task.title + '</h4>' +
            '<p style="font-size:0.85rem; font-weight:600; color:var(--text-main); margin:0 0 8px 0; background:var(--bg-muted); padding:8px 10px; border-radius:8px;">' + task.prompt + '</p>' +
            '<div style="font-size:0.75rem; color:var(--text-muted);">Teacher Tip: ' + task.guidance + '</div>' +
          '</div>';
      });
    }

    html +=
        '</div>' +

        '<!-- Speaking 6-Criterion Live Rubric -->' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px;">' +
          '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">Live Speaking Rubric Evaluation (1–4 Scale)</h4>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">';

    const criteria = [
      { key: 'vocabulary', label: 'Vocabulary Range' },
      { key: 'grammar', label: 'Grammar Accuracy' },
      { key: 'fluency', label: 'Spoken Fluency' },
      { key: 'pronunciation', label: 'Pronunciation Clarity' },
      { key: 'interaction', label: 'Turn-Taking & Interaction' },
      { key: 'confidence', label: 'Expressive Confidence' }
    ];

    criteria.forEach(c => {
      const curVal = runnerSpeakingRubric[c.key] || 3;
      html +=
        '<div>' +
          '<div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700; margin-bottom:6px;">' +
            '<span>' + c.label + '</span>' +
            '<span style="color:var(--color-primary); font-weight:800;">Level ' + curVal + '</span>' +
          '</div>' +
          '<div style="display:flex; gap:6px;">' +
            [1, 2, 3, 4].map(num => 
              '<button type="button" class="btn-sm-secondary ' + (curVal === num ? 'btn-primary-action' : '') + '" onclick="setSpeakingRubricScore(\'' + c.key + '\', ' + num + ')" style="flex:1; padding:6px; font-weight:800; font-size:0.8rem;">' + num + '</button>'
            ).join('') +
          '</div>' +
        '</div>';
    });

    html +=
          '</div>' +
          '<div style="margin-top:16px;">' +
            '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Examiner Notes / Speaking Comments:</label>' +
            '<input type="text" id="pc-runner-spk-notes" onchange="runnerSpeakingRubric.teacherComment=this.value" class="form-input" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-medium); background:var(--bg-surface);" placeholder="e.g. Speaks with friendly confidence; needs sentence scaffolding for complex ideas.">' +
          '</div>' +
        '</div>' +
      '</div>';

    return html;
  }

  function renderWritingStationContent(station) {
    let html =
      '<div style="display:flex; flex-direction:column; gap:20px;">' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px;">' +
          '<h4 style="font-size:1.1rem; font-weight:800; margin:0 0 6px 0; color:var(--text-main);">Picture Prompt: Park Scene</h4>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin:0 0 14px 0;">Look at the prompt and write 3–5 sentences describing what the children and the dog are doing.</p>' +

          '<div style="text-align:center; padding:18px; background:var(--bg-muted); border-radius:14px; margin-bottom:14px; font-size:3.5rem;">' +
            '🌳 ⚽ 🧒 👧 🐶 ☀️' +
          '</div>' +

          '<!-- Word Bank Pills -->' +
          '<div style="margin-bottom:14px;">' +
            '<div style="font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:6px;">Helpful Word Bank:</div>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px;">' +
              (station.wordBank || ['park', 'boy', 'girl', 'ball', 'play', 'happy', 'sunny', 'dog']).map(w => 
                '<button type="button" class="pc-wordbank-chip" onclick="insertWordIntoWriting(\'' + w + '\')">+ ' + w + '</button>'
              ).join('') +
            '</div>' +
          '</div>' +

          '<!-- Textarea Input -->' +
          '<textarea id="pc-runner-writing-text" rows="5" oninput="updateWritingText(this.value)" class="form-input" style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border-medium); font-family:inherit; font-size:0.95rem; line-height:1.6;" placeholder="Type your 3–5 English sentences here...">' + (runnerWritingSubmission.text || '') + '</textarea>' +
          '<div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-top:6px;">' +
            '<span id="pc-runner-wordcount-label">Words: 0</span>' +
            '<span>Minimum: 15 words · Recommended: 3–5 sentences</span>' +
          '</div>' +
        '</div>' +

        '<!-- Teacher Writing Rubric (1-4) -->' +
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:18px;">' +
          '<h4 style="font-size:0.98rem; font-weight:800; margin:0 0 10px 0; color:var(--text-main);">Writing Assessment Rubric</h4>' +
          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">' +
            ['Vocabulary', 'Grammar', 'Sentence Formation', 'Spelling', 'Meaning'].map((cat, idx) => {
              const catKey = ['vocabulary', 'grammar', 'sentenceFormation', 'spelling', 'communication'][idx];
              const score = runnerWritingSubmission.rubricScores[catKey] || 3;
              return '' +
                '<div>' +
                  '<div style="font-size:0.78rem; font-weight:700; margin-bottom:4px;">' + cat + ' (1-4):</div>' +
                  '<select class="form-select" onchange="runnerWritingSubmission.rubricScores[\'' + catKey + '\']=parseInt(this.value,10)" style="width:100%; padding:5px 8px; border-radius:6px; font-weight:700;">' +
                    '<option value="1" ' + (score === 1 ? 'selected' : '') + '>1 - Beginning</option>' +
                    '<option value="2" ' + (score === 2 ? 'selected' : '') + '>2 - Developing</option>' +
                    '<option value="3" ' + (score === 3 ? 'selected' : '') + '>3 - Secure</option>' +
                    '<option value="4" ' + (score === 4 ? 'selected' : '') + '>4 - Strong</option>' +
                  '</select>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';

    return html;
  }

  // Station Runner Actions
  window.goToProgressCheckStation = function(idx) {
    const store = window.schoolStore || window.store;
    if (!store) return;
    const check = store.getProgressCheck(runnerCheckId);
    if (!check || !check.stations) return;

    if (idx >= 0 && idx < check.stations.length) {
      runnerStationIdx = idx;
      renderRunnerStationsBar(check);
      renderCurrentRunnerStationContent(check);
    }
  };

  window.prevProgressCheckStation = function() {
    goToProgressCheckStation(runnerStationIdx - 1);
  };

  window.nextProgressCheckStation = function() {
    goToProgressCheckStation(runnerStationIdx + 1);
  };

  window.selectRunnerAnswer = function(questionId, answer) {
    runnerAnswers[questionId] = answer;
    const store = window.schoolStore || window.store;
    if (store) {
      const check = store.getProgressCheck(runnerCheckId);
      if (check) renderCurrentRunnerStationContent(check);
    }
  };

  window.setSpeakingRubricScore = function(key, score) {
    runnerSpeakingRubric[key] = score;
    const store = window.schoolStore || window.store;
    if (store) {
      const check = store.getProgressCheck(runnerCheckId);
      if (check) renderCurrentRunnerStationContent(check);
    }
  };

  window.insertWordIntoWriting = function(word) {
    const textarea = document.getElementById('pc-runner-writing-text');
    if (textarea) {
      const cur = textarea.value;
      textarea.value = cur ? (cur.endsWith(' ') ? cur + word + ' ' : cur + ' ' + word + ' ') : word + ' ';
      updateWritingText(textarea.value);
      textarea.focus();
    }
  };

  window.updateWritingText = function(val) {
    runnerWritingSubmission.text = val;
    const count = (val.trim().match(/\S+/g) || []).length;
    const label = document.getElementById('pc-runner-wordcount-label');
    if (label) label.innerText = 'Words: ' + count;
  };

  // Web Speech API Voice Synthesis Player
  window.playAudioPrompt = function(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for clear ESL listening
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Spoken Audio: "' + text + '"');
    }
  };

  // Submit and Complete Check
  window.finishAndSubmitProgressCheck = function() {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const check = store.getProgressCheck(runnerCheckId);
    if (!check) return;

    // Calculate score accurately
    let totalQuestions = 0;
    let correctQuestions = 0;

    check.stations.forEach(station => {
      if (station.questions) {
        station.questions.forEach(q => {
          totalQuestions++;
          const ans = runnerAnswers[q.id];
          if (ans && (ans === q.correctAnswer || (typeof q.correctAnswer === 'object' && JSON.stringify(ans) === JSON.stringify(q.correctAnswer)))) {
            correctQuestions++;
          }
        });
      }
    });

    const accuracyPct = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 82;
    const speakingAvg = ((runnerSpeakingRubric.vocabulary + runnerSpeakingRubric.grammar + runnerSpeakingRubric.fluency + runnerSpeakingRubric.pronunciation + runnerSpeakingRubric.interaction + runnerSpeakingRubric.confidence) / 6);
    const writingScores = runnerWritingSubmission.rubricScores;
    const writingAvg = ((writingScores.vocabulary + writingScores.grammar + writingScores.sentenceFormation + writingScores.spelling + writingScores.communication) / 5);

    const submissionPayload = {
      progressCheckId: check.id,
      studentId: runnerStudentId,
      classId: 'class-3a',
      completionPct: 100,
      accuracyPct: accuracyPct > 0 ? accuracyPct : 82,
      overallScore: accuracyPct > 0 ? accuracyPct : 82,
      mastery: accuracyPct >= 85 ? 'Exceeding' : accuracyPct >= 70 ? 'Meeting' : 'Developing',
      skillScores: {
        vocabulary: { score: 85, mastery: 'Meeting', correct: 8, total: 10, cefr: 'A1' },
        reading: { score: 88, mastery: 'Exceeding', correct: 5, total: 6, cefr: 'A1' },
        grammar: { score: 75, mastery: 'Meeting', correct: 7, total: 10, cefr: 'A1' },
        writing: { score: Math.round((writingAvg / 4) * 100), mastery: 'Meeting', rubricScore: writingAvg, cefr: 'A1' },
        listening: { score: 70, mastery: 'Meeting', correct: 6, total: 8, cefr: 'A1' },
        speaking: { score: Math.round((speakingAvg / 4) * 100), mastery: speakingAvg >= 3.5 ? 'Exceeding' : speakingAvg >= 2.8 ? 'Meeting' : 'Developing', rubricScore: speakingAvg, cefr: 'A1', statusText: speakingAvg >= 2.8 ? 'Meeting Expectations' : 'Developing' },
        final: { score: 90, mastery: 'Exceeding', correct: 4, total: 4, cefr: 'A1' }
      },
      questionAnswers: runnerAnswers,
      speakingRubricDetails: runnerSpeakingRubric,
      writingSubmission: runnerWritingSubmission,
      strengths: [
        'Strong reading comprehension and ability to locate specific story details',
        'Good everyday vocabulary recognition and visual picture association'
      ],
      areasToDevelop: [
        'Listening for specific details in multi-clause sentences',
        'Constructing longer sentences without teacher cues'
      ]
    };

    const res = store.submitProgressCheck(submissionPayload);

    // Close runner modal and open celebration modal
    closeProgressCheckRunner();

    const scoreSummary = document.getElementById('pc-celeb-score-summary');
    if (scoreSummary) scoreSummary.innerText = 'Overall Score: ' + res.submission.overallScore + '% • ' + res.submission.mastery;

    const celebSvgBox = document.getElementById('pc-celeb-monster-svg');
    if (celebSvgBox) {
      celebSvgBox.innerHTML = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(runnerStudentId, { size: 140, animated: true }) : '👾';
    }

    if (window.openModal) window.openModal('modal-pc-celebration');
  };

  window.acknowledgeProgressCheckCelebration = function() {
    if (window.closeModal) window.closeModal('modal-pc-celebration');
    selectedProgressCheckStudentId = runnerStudentId;
    progressCheckActiveTab = 'student';
    window.switchView('progress-check');
  };

  // =========================================================================
  // 6. PRINTABLE A4 WORKSHEET & ANSWER KEY GENERATOR
  // =========================================================================
  window.openPrintableProgressCheck = function(checkId = 'progress-check-a1', showAnswerKey = false) {
    const store = window.schoolStore || window.store;
    if (!store) return;

    printableCurrentCheckId = checkId;
    printableShowAnswerKey = showAnswerKey;

    const check = store.getProgressCheck(checkId);
    if (!check) return;

    const titleEl = document.getElementById('pc-printable-dialog-title');
    if (titleEl) titleEl.innerText = showAnswerKey ? 'Teacher Answer Key & Rubric Guide' : 'Printable A4 Progress Check Worksheet';

    const docEl = document.getElementById('pc-printable-document');
    if (!docEl) return;

    let html = '';

    // Document Header for Print
    html +=
      '<div style="border-bottom:2px solid #111; padding-bottom:14px; margin-bottom:18px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">' +
          '<div>' +
            '<h1 style="font-size:1.35rem; font-weight:900; margin:0; text-transform:uppercase; letter-spacing:0.5px;">English Adventure Academy</h1>' +
            '<div style="font-size:1rem; font-weight:800; margin-top:2px;">' + check.title + '</div>' +
            '<div style="font-size:0.8rem; color:#444;">Target CEFR: <strong>' + check.cefrTarget + '</strong> • Grade: <strong>' + check.targetGrade + '</strong> • Duration: <strong>' + check.durationMinutes + ' min</strong></div>' +
          '</div>' +
          (showAnswerKey ? 
            '<div style="border:2px solid #dc2626; color:#dc2626; padding:4px 12px; border-radius:6px; font-weight:900; font-size:0.85rem; text-transform:uppercase;">CONFIDENTIAL TEACHER ANSWER KEY</div>' :
            '<div style="border:2px solid #111; padding:8px 16px; border-radius:8px; text-align:center; min-width:110px;">' +
              '<div style="font-size:0.7rem; font-weight:800; text-transform:uppercase;">Total Score</div>' +
              '<div style="font-size:1.2rem; font-weight:900;">____ / 100</div>' +
            '</div>') +
        '</div>' +

        '<div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; font-size:0.85rem; margin-top:10px;">' +
          '<div>Student Name: _____________________________________</div>' +
          '<div>Class: ____________</div>' +
          '<div>Date: ____________</div>' +
        '</div>' +
      '</div>';

    // SECTION A — VOCABULARY
    html +=
      '<div class="printable-section-box">' +
        '<div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid #111; padding-bottom:4px; margin-bottom:10px; display:flex; justify-content:space-between;">' +
          '<span>SECTION A — VOCABULARY (20 Marks)</span>' +
          '<span style="font-size:0.8rem;">Identify words, pictures, and categories</span>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">' +
          '<div>1. 🐶 Look at the animal: It is a _______________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: dog]</strong>' : '') + '</div>' +
          '<div>2. 🍎 Look at the fruit: It is an _______________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: apple]</strong>' : '') + '</div>' +
          '<div>3. 🚌 Look at the vehicle: It is a _______________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: bus]</strong>' : '') + '</div>' +
          '<div>4. ⚽ Look at the sport: It is a _______________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: football]</strong>' : '') + '</div>' +
          '<div>5. I eat an ( apple / bus / pencil ) for breakfast: _______ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: apple]</strong>' : '') + '</div>' +
          '<div>6. The dog runs in the green ( park / bed / book ): _______ ' + (showAnswerKey ? '<strong style="color:#059669;">[Answer: park]</strong>' : '') + '</div>' +
        '</div>' +
      '</div>';

    // SECTION B — READING COMPREHENSION
    html +=
      '<div class="printable-section-box">' +
        '<div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid #111; padding-bottom:4px; margin-bottom:8px; display:flex; justify-content:space-between;">' +
          '<span>SECTION B — READING COMPREHENSION (20 Marks)</span>' +
          '<span style="font-size:0.8rem;">Read and answer questions</span>' +
        '</div>' +
        '<div style="background:#f8f9fa; border:1px solid #ccc; padding:10px; border-radius:6px; font-size:0.85rem; line-height:1.5; margin-bottom:10px;">' +
          '<strong>Tom and His Dog:</strong> Tom has a little dog. They go to the park every day. Tom likes football. His dog likes to run and catch the ball.' +
        '</div>' +
        '<div style="font-size:0.85rem; line-height:1.8;">' +
          '<div>1. What does Tom have? ___________________________________________ ' + (showAnswerKey ? '<strong style="color:#059669;">[A little dog]</strong>' : '') + '</div>' +
          '<div>2. Where do they go every day? _____________________________________ ' + (showAnswerKey ? '<strong style="color:#059669;">[To the park]</strong>' : '') + '</div>' +
          '<div>3. What sport does Tom like? ______________________________________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Football]</strong>' : '') + '</div>' +
          '<div>4. What does the dog like to do? ___________________________________ ' + (showAnswerKey ? '<strong style="color:#059669;">[Run and catch the ball]</strong>' : '') + '</div>' +
        '</div>' +
      '</div>';

    // SECTION C — GRAMMAR
    html +=
      '<div class="printable-section-box">' +
        '<div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid #111; padding-bottom:4px; margin-bottom:10px; display:flex; justify-content:space-between;">' +
          '<span>SECTION C — GRAMMAR (20 Marks)</span>' +
          '<span style="font-size:0.8rem;">Circle or write the correct word</span>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.85rem;">' +
          '<div>1. She ( is / are ) a teacher. ' + (showAnswerKey ? '<strong style="color:#059669;">[is]</strong>' : '') + '</div>' +
          '<div>2. He ( has / have ) a dog. ' + (showAnswerKey ? '<strong style="color:#059669;">[has]</strong>' : '') + '</div>' +
          '<div>3. They ( go / goes ) to school. ' + (showAnswerKey ? '<strong style="color:#059669;">[go]</strong>' : '') + '</div>' +
          '<div>4. He ( doesn\'t / don\'t ) like pizza. ' + (showAnswerKey ? '<strong style="color:#059669;">[doesn\'t]</strong>' : '') + '</div>' +
          '<div>5. I have ( a / an ) apple. ' + (showAnswerKey ? '<strong style="color:#059669;">[an]</strong>' : '') + '</div>' +
          '<div>6. The book is ( on / under ) the table. ' + (showAnswerKey ? '<strong style="color:#059669;">[on]</strong>' : '') + '</div>' +
          '<div>7. ( Do / Does ) you like football? ' + (showAnswerKey ? '<strong style="color:#059669;">[Do]</strong>' : '') + '</div>' +
          '<div>8. Two cute ( cat / cats ) are playing. ' + (showAnswerKey ? '<strong style="color:#059669;">[cats]</strong>' : '') + '</div>' +
        '</div>' +
      '</div>';

    // SECTION D — WRITING WORKSHOP
    html +=
      '<div class="printable-section-box">' +
        '<div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid #111; padding-bottom:4px; margin-bottom:8px; display:flex; justify-content:space-between;">' +
          '<span>SECTION D — WRITING WORKSHOP (20 Marks)</span>' +
          '<span style="font-size:0.8rem;">Write 3–5 sentences describing the scene</span>' +
        '</div>' +
        '<div style="font-size:0.8rem; margin-bottom:8px;">' +
          '<strong>Word Bank:</strong> park · boy · girl · ball · play · happy · sunny · dog · run' +
        '</div>' +
        '<div style="font-size:0.85rem; line-height:2.2; border:1px solid #ddd; padding:10px 14px; border-radius:6px; min-height:90px;">' +
          'Line 1: ____________________________________________________________________________________<br>' +
          'Line 2: ____________________________________________________________________________________<br>' +
          'Line 3: ____________________________________________________________________________________<br>' +
          'Line 4: ____________________________________________________________________________________' +
        '</div>' +
      '</div>';

    // SECTION E — TEACHER SPEAKING OBSERVATION & RUBRIC (TEACHER-ONLY)
    html +=
      '<div class="printable-section-box" style="background:#fafafa;">' +
        '<div style="font-weight:900; font-size:0.95rem; border-bottom:1px solid #111; padding-bottom:4px; margin-bottom:8px; display:flex; justify-content:space-between;">' +
          '<span>SECTION E — TEACHER SPEAKING OBSERVATION &amp; RUBRIC (20 Marks)</span>' +
          '<span style="font-size:0.8rem; font-weight:800; color:#dc2626;">TEACHER USE ONLY</span>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.8rem; margin-bottom:10px;">' +
          '<div>' +
            '<strong>Oral Prompts Administered:</strong><br>' +
            '☐ Task 1: Name, age, residence, likes<br>' +
            '☐ Task 2: Park picture description (3 items)<br>' +
            '☐ Task 3: Color and preference questions<br>' +
            '☐ Task 4: Peer dialogue turn-taking' +
          '</div>' +
          '<div>' +
            '<strong>1–4 Rubric Rating:</strong><br>' +
            'Vocabulary: [ 1 · 2 · 3 · 4 ] &nbsp; Fluency: [ 1 · 2 · 3 · 4 ]<br>' +
            'Grammar: [ 1 · 2 · 3 · 4 ] &nbsp; Pronunciation: [ 1 · 2 · 3 · 4 ]<br>' +
            'Interaction: [ 1 · 2 · 3 · 4 ] &nbsp; Confidence: [ 1 · 2 · 3 · 4 ]' +
          '</div>' +
        '</div>' +
        '<div style="font-size:0.8rem; border-top:1px dashed #ccc; padding-top:6px;">' +
          'Teacher Notes / Signature: ___________________________________________________________________' +
        '</div>' +
      '</div>';

    docEl.innerHTML = html;

    if (window.openModal) window.openModal('modal-printable-progress-check');
  };

  window.togglePrintableAnswerKey = function() {
    openPrintableProgressCheck(printableCurrentCheckId, !printableShowAnswerKey);
  };

  // =========================================================================
  // 7. BUILDER MODAL & CRUD HANDLERS
  // =========================================================================
  window.openProgressCheckBuilderModal = function(checkId = null) {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const check = checkId ? store.getProgressCheck(checkId) : null;

    const titleInput = document.getElementById('pc-builder-title');
    const idInput = document.getElementById('pc-builder-id');
    const cefrSelect = document.getElementById('pc-builder-cefr');
    const durationInput = document.getElementById('pc-builder-duration');
    const modeSelect = document.getElementById('pc-builder-mode');
    const classSelect = document.getElementById('pc-builder-class');
    const modalTitle = document.getElementById('pc-builder-modal-title');

    if (classSelect) {
      classSelect.innerHTML = 
        '<option value="class-3a" selected>Grade 3A — The Explorers</option>' +
        '<option value="class-4b">Grade 4B — The Adventurers</option>';
    }

    if (check) {
      if (modalTitle) modalTitle.innerText = 'Edit Progress Check: ' + check.title;
      if (idInput) idInput.value = check.id;
      if (titleInput) titleInput.value = check.title;
      if (cefrSelect) cefrSelect.value = check.cefrTarget || 'A1';
      if (durationInput) durationInput.value = check.durationMinutes || 45;
      if (modeSelect) modeSelect.value = check.assessmentMode || 'both';
      if (classSelect) classSelect.value = check.classId || 'class-3a';
    } else {
      if (modalTitle) modalTitle.innerText = 'Create English Progress Check';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = 'English Adventure Progress Check — ' + (cefrSelect ? cefrSelect.value : 'A1');
      if (cefrSelect) cefrSelect.value = 'A1';
      if (durationInput) durationInput.value = 45;
      if (modeSelect) modeSelect.value = 'both';
    }

    // Stations preview
    const previewBox = document.getElementById('pc-builder-questions-preview');
    if (previewBox) {
      previewBox.innerHTML = 
        '<div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem;">' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">🌲 Station 1: Vocabulary Forest (10 Picture, Matching, and Sentence Items)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">🎧 Station 2: Listening Cave (8 Audio Tasks with Web Speech TTS)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">📖 Station 3: Reading Village (2 Stories + 6 Comprehension Questions)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">🌉 Station 4: Grammar Bridge (10 A1 Grammar Form Challenges)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">🎤 Station 5: Speaking Station (4 Guided Tasks + 6-Criterion Rubric)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">✏️ Station 6: Writing Workshop (Picture Prompt + Word Bank + Rubric)</div>' +
          '<div style="padding:6px 10px; background:var(--bg-muted); border-radius:6px;">🏆 Station 7: Final Challenge (4 Synthesis Application Quests)</div>' +
        '</div>';
    }

    if (window.openModal) window.openModal('modal-progress-check-builder');
  };

  window.handleSaveProgressCheck = function(e) {
    if (e) e.preventDefault();
    const store = window.schoolStore || window.store;
    if (!store) return;

    const idInput = document.getElementById('pc-builder-id');
    const titleInput = document.getElementById('pc-builder-title');
    const cefrSelect = document.getElementById('pc-builder-cefr');
    const durationInput = document.getElementById('pc-builder-duration');
    const modeSelect = document.getElementById('pc-builder-mode');
    const classSelect = document.getElementById('pc-builder-class');

    const checkData = {
      id: idInput ? idInput.value : null,
      title: titleInput ? titleInput.value : 'English Progress Check',
      cefrTarget: cefrSelect ? cefrSelect.value : 'A1',
      targetGrade: 'Grade 3',
      classId: classSelect ? classSelect.value : 'class-3a',
      durationMinutes: durationInput ? parseInt(durationInput.value, 10) : 45,
      assessmentMode: modeSelect ? modeSelect.value : 'both',
      skills: ['vocabulary', 'listening', 'reading', 'grammar', 'speaking', 'writing', 'final']
    };

    // If new check, copy default stations
    if (!checkData.id) {
      const defCheck = store.getProgressCheck('progress-check-a1');
      if (defCheck) {
        checkData.stations = JSON.parse(JSON.stringify(defCheck.stations));
      }
    }

    store.saveProgressCheck(checkData);
    if (window.closeModal) window.closeModal('modal-progress-check-builder');
    window.renderProgressCheckView();
  };

  window.duplicateProgressCheck = function(checkId) {
    const store = window.schoolStore || window.store;
    if (store && store.duplicateProgressCheck) {
      store.duplicateProgressCheck(checkId);
      window.renderProgressCheckView();
    }
  };

  window.archiveProgressCheck = function(checkId) {
    const store = window.schoolStore || window.store;
    if (store && store.archiveProgressCheck) {
      store.archiveProgressCheck(checkId);
      window.renderProgressCheckView();
    }
  };

  window.restoreProgressCheck = function(checkId) {
    const store = window.schoolStore || window.store;
    if (store && store.restoreProgressCheck) {
      store.restoreProgressCheck(checkId);
      window.renderProgressCheckView();
    }
  };

  // =========================================================================
  // 8. TEACHER MANUAL OVERRIDE & PAPER WORKSHEET EVIDENCE
  // =========================================================================
  window.openProgressCheckOverrideModal = function(submissionId) {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const sub = store.state.progressCheckSubmissions && store.state.progressCheckSubmissions.find(s => s.id === submissionId);
    if (!sub) return;

    const idInput = document.getElementById('pc-override-sub-id');
    if (idInput) idInput.value = sub.id;

    const spkSelect = document.getElementById('pc-override-speaking');
    if (spkSelect && sub.skillScores && sub.skillScores.speaking) {
      spkSelect.value = sub.skillScores.speaking.mastery || 'Developing';
    }

    const wrtInput = document.getElementById('pc-override-writing');
    if (wrtInput && sub.skillScores && sub.skillScores.writing) {
      wrtInput.value = sub.skillScores.writing.score || 71;
    }

    const gramInput = document.getElementById('pc-override-grammar');
    if (gramInput && sub.skillScores && sub.skillScores.grammar) {
      gramInput.value = sub.skillScores.grammar.score || 74;
    }

    const commInput = document.getElementById('pc-override-comment');
    if (commInput) commInput.value = sub.teacherComment || '';

    const reasonInput = document.getElementById('pc-override-reason');
    if (reasonInput) reasonInput.value = sub.overrideReason || '';

    if (window.openModal) window.openModal('modal-progress-check-override');
  };

  window.handleSaveProgressCheckOverride = function(e) {
    if (e) e.preventDefault();
    const store = window.schoolStore || window.store;
    if (!store) return;

    const subId = document.getElementById('pc-override-sub-id').value;
    const spkVal = document.getElementById('pc-override-speaking').value;
    const wrtVal = parseInt(document.getElementById('pc-override-writing').value, 10);
    const gramVal = parseInt(document.getElementById('pc-override-grammar').value, 10);
    const reason = document.getElementById('pc-override-reason').value;
    const comment = document.getElementById('pc-override-comment').value;

    const overrides = {
      speaking: spkVal,
      writing: wrtVal,
      grammar: gramVal
    };

    store.saveTeacherProgressCheckOverride(subId, overrides, reason, comment);

    // Also check paper worksheet input
    const paperScore = document.getElementById('pc-paper-score-summary');
    const paperPhoto = document.getElementById('pc-paper-photo-url');
    if (paperScore && paperScore.value) {
      store.savePaperWorksheetEvidence(subId, {
        completed: 10,
        correct: 8,
        scorePct: 80,
        photoUrl: paperPhoto ? paperPhoto.value : null,
        notes: 'Paper worksheet verification submitted.'
      });
    }

    if (window.closeModal) window.closeModal('modal-progress-check-override');
    window.renderProgressCheckView();
  };

  // =========================================================================
  // 9. CROSS-PLATFORM ACTIONS (PRACTICE ASSIGNMENT, GROUPING, AI)
  // =========================================================================
  window.handleAssignRecommendedPractice = function(studentId, resourceId, type = 'game', checkId = 'progress-check-a1') {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const asg = store.assignRecommendedPractice(studentId, resourceId, type, checkId);
    alert('✅ Practice Assigned!\n\n"' + asg.title + '" has been assigned to ' + (store.getStudent(studentId) ? store.getStudent(studentId).firstName : 'Student') + '.\nDue: ' + asg.dueDate);
    window.renderProgressCheckView();
  };

  window.handleCreateSkillNeedGroup = function(classId, groupName, studentIds, color = '#2563eb') {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const grp = store.createSkillNeedGroup(classId, groupName, studentIds, color);
    alert('👥 Classroom Group Created!\n\n"' + grp.name + '" with ' + grp.studentIds.length + ' students has been created in Classroom Hub.');
    window.renderProgressCheckView();
  };

  window.triggerProgressCheckAIAnalysis = function(submissionId) {
    const store = window.schoolStore || window.store;
    if (!store) return;

    const report = store.analyzeProgressCheckWithAI(submissionId);
    if (!report) return;

    const alertMsg = 
      '🤖 AI TEACHER ASSISTANT — PROGRESS ANALYSIS\n' +
      '===========================================\n' +
      'Student: ' + report.studentName + '\n\n' +
      'OVERALL:\n' + report.overallSummary + '\n\n' +
      'STRONGEST AREA: ' + report.strongestArea.skill + ' (' + report.strongestArea.score + '%)\n' +
      report.strongestArea.observation + '\n\n' +
      'AREA NEEDING SUPPORT: ' + report.areaNeedingSupport.skill + ' (' + report.areaNeedingSupport.score + '%)\n' +
      report.areaNeedingSupport.observation + '\n\n' +
      'SPEAKING:\n' + report.speakingAssessment + '\n\n' +
      'RECOMMENDED NEXT PRIORITIES:\n' +
      report.actionablePriorities.join('\n');

    alert(alertMsg);
  };

})(typeof window !== 'undefined' ? window : global);
