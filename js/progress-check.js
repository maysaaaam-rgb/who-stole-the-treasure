/**
 * English Adventure Academy — Simplified Whole-Class Progress Check
 *
 * Workflow:
 * 1. Give ONE test to the whole class (Interactive classroom game on screen).
 * 2. Print the worksheets for all students.
 * 3. Students complete them.
 * 4. Teacher checks the worksheets.
 * 5. Teacher enters results manually in the clean gradebook table.
 * 6. Teacher writes a short note about each student.
 * 7. Results save to each student's profile quietly in background.
 */

(function(window) {
  'use strict';

  // Module State: 'home' | 'enter' | 'view'
  let progressCheckViewMode = 'home';
  let selectedProgressCheckId = 'progress-check-a1';
  let selectedAnalyticsClassId = 'class-3a';

  // Smartboard Game State
  let classGameStationIdx = 0;
  let classGameObservations = {};
  let classGameClassResponse = 'Strong';

  // Printable State
  let printableCurrentCheckId = 'progress-check-a1';
  let printableShowAnswerKey = false;

  // View Mode Controller
  window.setProgressCheckViewMode = function(mode) {
    progressCheckViewMode = mode || 'home';
    window.renderProgressCheckView();
    const el = document.getElementById('pc-main-wrapper');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.switchProgressCheckSelection = function(checkId) {
    selectedProgressCheckId = checkId;
    window.renderProgressCheckView();
  };

  // Backwards compatibility for callers
  window.goToProgressCheckStep = function(stepNum) {
    if (stepNum === 4) {
      window.setProgressCheckViewMode('enter');
    } else if (stepNum === 2) {
      window.openClassGameModal();
    } else if (stepNum === 3) {
      window.openPrintableProgressCheck(selectedProgressCheckId, false);
    } else if (stepNum === 5 || stepNum === 6) {
      window.setProgressCheckViewMode('view');
    } else {
      window.setProgressCheckViewMode('home');
    }
  };

  // =========================================================================
  // 1. MAIN VIEW ROUTER
  // =========================================================================

  window.renderProgressCheckView = function(container) {
    if (!container) container = document.getElementById('app-view-container');
    if (!container) return;

    const store = window.schoolStore || window.store;
    if (!store) {
      container.innerHTML = '<div class="alert alert-danger" style="padding:20px; border-radius:10px;">Error: School Store not initialized.</div>';
      return;
    }

    const checks = store.getProgressChecks ? store.getProgressChecks('active') : [];
    const activeCheck = store.getProgressCheck(selectedProgressCheckId) || checks[0] || {
      id: 'progress-check-a1',
      title: 'English Adventure Progress Check',
      bookTitle: 'Global Readings 2',
      unitTitle: 'Unit 1',
      targetGrade: 'Grade 3A'
    };
    const currentClass = store.getClass(selectedAnalyticsClassId) || store.getActiveClass() || { name: 'Grade 3A — The Explorers' };
    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

    let html = '<div id="pc-main-wrapper" style="padding: 10px 0 40px 0;">';

    if (progressCheckViewMode === 'enter') {
      html += renderEnterResultsViewHTML(store, activeCheck, currentClass, students);
    } else if (progressCheckViewMode === 'view') {
      html += renderViewResultsViewHTML(store, activeCheck, currentClass, students);
    } else {
      html += renderHomeViewHTML(store, activeCheck, currentClass);
    }

    html += '</div>';
    container.innerHTML = html;
  };

  // =========================================================================
  // 2. HOME VIEW (THE 3 BIG BUTTONS)
  // =========================================================================

  function renderHomeViewHTML(store, activeCheck, currentClass) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A — The Explorers') : 'Grade 3A — The Explorers';

    return '' +
      '<div style="max-width:960px; margin:0 auto; padding:10px 16px;">' +
        // Header
        '<div style="text-align:center; margin-bottom:36px; padding:20px 10px;">' +
          '<div style="display:inline-flex; align-items:center; gap:8px; background:rgba(59,130,246,0.1); color:#2563eb; font-weight:800; font-size:0.8rem; padding:4px 14px; border-radius:20px; margin-bottom:12px; letter-spacing:0.04em; text-transform:uppercase;">' +
            '<span>⭐</span> <span>End of Unit Assessment</span>' +
          '</div>' +
          '<h1 style="font-size:2.2rem; font-weight:900; color:var(--text-main); margin:0 0 10px 0; letter-spacing:-0.02em;">' +
            'English Adventure Progress Check' +
          '</h1>' +
          '<div style="font-size:1.15rem; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">' +
            '<strong>' + className + '</strong>' +
          '</div>' +
          '<div style="font-size:1rem; font-weight:600; color:var(--text-muted);">' +
            bookName + ' · ' + unitName +
          '</div>' +
        '</div>' +

        // THREE BIG BUTTONS (Cards)
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:22px; margin-bottom:36px;">' +

          // Button 1: Start Class Test
          '<div class="pc-hero-card" onclick="openClassGameModal()" style="background:#fff; border:2px solid #e0e7ff; border-radius:18px; padding:28px 22px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 14px rgba(99,102,241,0.08); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">' +
            '<div style="position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg, #4f46e5, #6366f1);"></div>' +
            '<div>' +
              '<div style="width:72px; height:72px; margin:0 auto 18px auto; background:linear-gradient(135deg, #e0e7ff, #c7d2fe); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; box-shadow:0 4px 10px rgba(99,102,241,0.15);">' +
                '🎮' +
              '</div>' +
              '<h2 style="font-size:1.35rem; font-weight:900; color:#1e1b4b; margin:0 0 10px 0;">' +
                'Start Class Test' +
              '</h2>' +
              '<p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0 0 20px 0;">' +
                'Runs the interactive classroom test on the screen for the whole class.' +
              '</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:12px; font-size:0.95rem; font-weight:800; background:#4f46e5; border-color:#4338ca; justify-content:center; border-radius:12px;">' +
              '🎮 Launch Class Screen Test' +
            '</button>' +
          '</div>' +

          // Button 2: Print Worksheet
          '<div class="pc-hero-card" onclick="openPrintableProgressCheck(\'' + checkId + '\', false)" style="background:#fff; border:2px solid #d1fae5; border-radius:18px; padding:28px 22px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 14px rgba(16,185,129,0.08); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">' +
            '<div style="position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg, #059669, #10b981);"></div>' +
            '<div>' +
              '<div style="width:72px; height:72px; margin:0 auto 18px auto; background:linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; box-shadow:0 4px 10px rgba(16,185,129,0.15);">' +
                '🖨️' +
              '</div>' +
              '<h2 style="font-size:1.35rem; font-weight:900; color:#064e3b; margin:0 0 10px 0;">' +
                'Print Worksheet' +
              '</h2>' +
              '<p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0 0 20px 0;">' +
                'Prints the same test worksheet for all students (Parts 1–4 + Observation).' +
              '</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:12px; font-size:0.95rem; font-weight:800; background:#059669; border-color:#047857; justify-content:center; border-radius:12px;">' +
              '🖨️ Print Student Worksheets' +
            '</button>' +
          '</div>' +

          // Button 3: Enter Results
          '<div class="pc-hero-card" onclick="setProgressCheckViewMode(\'enter\')" style="background:#fff; border:2px solid #fef3c7; border-radius:18px; padding:28px 22px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 14px rgba(245,158,11,0.1); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">' +
            '<div style="position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg, #d97706, #f59e0b);"></div>' +
            '<div>' +
              '<div style="width:72px; height:72px; margin:0 auto 18px auto; background:linear-gradient(135deg, #fef3c7, #fde68a); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; box-shadow:0 4px 10px rgba(245,158,11,0.18);">' +
                '📝' +
              '</div>' +
              '<h2 style="font-size:1.35rem; font-weight:900; color:#78350f; margin:0 0 10px 0;">' +
                'Enter Results' +
              '</h2>' +
              '<p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin:0 0 20px 0;">' +
                'Enter scores and teacher notes after checking paper worksheets.' +
              '</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:12px; font-size:0.95rem; font-weight:800; background:#d97706; border-color:#b45309; justify-content:center; border-radius:12px;">' +
              '📝 Enter Class Scores' +
            '</button>' +
          '</div>' +

        '</div>' +

        // Subtle Link/Button: View Class Results
        '<div style="text-align:center; padding:12px 0;">' +
          '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'view\')" style="display:inline-flex; align-items:center; gap:8px; padding:10px 22px; font-size:0.88rem; font-weight:700; color:var(--text-secondary); background:transparent; border:1px solid var(--border-medium); border-radius:12px; cursor:pointer;">' +
            '<span>📊</span> <span>View Class Results</span>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 3. ENTER RESULTS VIEW (THE CLEAN GRADEBOOK TABLE)
  // =========================================================================

  function renderEnterResultsViewHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const existingSubs = store.getProgressCheckSubmissions ? store.getProgressCheckSubmissions(checkId) : [];
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A — The Explorers') : 'Grade 3A — The Explorers';

    return '' +
      '<div style="max-width:1100px; margin:0 auto; padding:0 12px;">' +
        // Top Navigation & Header
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="display:inline-flex; align-items:center; gap:6px; margin-bottom:12px; font-weight:700; padding:6px 12px;">' +
              '<span>←</span> <span>Back to Assessment</span>' +
            '</button>' +
            '<h1 style="font-size:1.55rem; font-weight:900; color:var(--text-main); margin:0 0 6px 0;">' +
              'Enter Results — ' + className +
            '</h1>' +
            '<p style="font-size:0.88rem; color:var(--text-muted); margin:0;">' +
              '<strong>' + bookName + ' · ' + unitName + '</strong> — Enter scores from checked paper worksheets and write a short note for each student.' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:10px 24px; font-size:0.95rem; font-weight:900; background:#059669; border-color:#047857; display:inline-flex; align-items:center; gap:8px; box-shadow:0 2px 8px rgba(5,150,105,0.25);">' +
              '<span>💾</span> <span>Save All Results</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Gradebook Table Card
        '<div style="background:#fff; border:1px solid var(--border-light); border-radius:14px; box-shadow:var(--shadow-sm); overflow:hidden; margin-bottom:24px;">' +
          '<div style="overflow-x:auto;">' +
            '<table class="pc-gradebook-table" style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:left;">' +
              '<thead>' +
                '<tr style="background:var(--bg-canvas); border-bottom:2px solid var(--border-medium); color:var(--text-main);">' +
                  '<th style="padding:12px 14px; font-weight:800; min-width:160px;">STUDENT</th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:100px; text-align:center;">VOCABULARY<br><span style="font-size:0.72rem; font-weight:600; color:var(--text-muted);">( / 10 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:90px; text-align:center;">READING<br><span style="font-size:0.72rem; font-weight:600; color:var(--text-muted);">( / 5 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:90px; text-align:center;">GRAMMAR<br><span style="font-size:0.72rem; font-weight:600; color:var(--text-muted);">( / 5 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:90px; text-align:center;">WRITING<br><span style="font-size:0.72rem; font-weight:600; color:var(--text-muted);">( / 5 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:115px;">LISTENING</th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:115px;">SPEAKING</th>' +
                  '<th style="padding:12px 14px; font-weight:800; min-width:260px;">TEACHER NOTE</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center; min-width:80px;">ACTION</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                students.map(function(s, idx) {
                  const sub = existingSubs.find(function(item) { return item.studentId === s.id; }) || {};
                  const scores = sub.scores || {};
                  const vCorrect = scores.vocabulary ? scores.vocabulary.correct : (sub.skillScores && sub.skillScores.vocabulary ? sub.skillScores.vocabulary.correct : 8);
                  const rCorrect = scores.reading ? scores.reading.correct : (sub.skillScores && sub.skillScores.reading ? sub.skillScores.reading.correct : 4);
                  const gCorrect = scores.grammar ? scores.grammar.correct : (sub.skillScores && sub.skillScores.grammar ? sub.skillScores.grammar.correct : 4);
                  const wCorrect = scores.writing ? scores.writing.correct : (sub.skillScores && sub.skillScores.writing ? sub.skillScores.writing.correct : 3);
                  const lRating = scores.listening ? scores.listening.rating : (sub.teacherAssessment && sub.teacherAssessment.listening ? sub.teacherAssessment.listening : (sub.skillScores && sub.skillScores.listening ? sub.skillScores.listening.statusText : 'Developing'));
                  const sRating = scores.speaking ? scores.speaking.rating : (sub.teacherAssessment && sub.teacherAssessment.speaking ? sub.teacherAssessment.speaking : (sub.skillScores && sub.skillScores.speaking ? sub.skillScores.speaking.statusText : 'Developing'));
                  const note = sub.notes || sub.teacherComment || (s.latestTeacherNote || 'Understands familiar vocabulary well. Needs support speaking in full sentences.');

                  const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(s.id, { size: 28, animated: false }) : '👾';
                  const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';

                  return '' +
                    '<tr id="row-student-' + s.id + '" style="border-bottom:1px solid var(--border-light); background:' + rowBg + '; transition:background 0.2s ease;">' +
                      // Student
                      '<td style="padding:10px 14px;">' +
                        '<div style="display:flex; align-items:center; gap:10px;">' +
                          '<div style="width:28px; height:28px; flex-shrink:0;">' + monsterSvg + '</div>' +
                          '<div>' +
                            '<div style="font-weight:800; color:var(--text-main); font-size:0.9rem;">' + s.firstName + ' ' + s.lastName + '</div>' +
                            '<div style="font-size:0.72rem; color:var(--text-muted);">' + (s.grade || 'Grade 3') + '</div>' +
                          '</div>' +
                        '</div>' +
                      '</td>' +

                      // Vocab (/10)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<div style="display:inline-flex; align-items:center; gap:4px;">' +
                          '<input type="number" min="0" max="10" id="inp-vocab-' + s.id + '" value="' + vCorrect + '" class="form-input" style="width:52px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.9rem; border-radius:8px;">' +
                          '<span style="color:var(--text-muted); font-size:0.8rem; font-weight:700;">/ 10</span>' +
                        '</div>' +
                      '</td>' +

                      // Reading (/5)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<div style="display:inline-flex; align-items:center; gap:4px;">' +
                          '<input type="number" min="0" max="5" id="inp-read-' + s.id + '" value="' + rCorrect + '" class="form-input" style="width:52px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.9rem; border-radius:8px;">' +
                          '<span style="color:var(--text-muted); font-size:0.8rem; font-weight:700;">/ 5</span>' +
                        '</div>' +
                      '</td>' +

                      // Grammar (/5)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<div style="display:inline-flex; align-items:center; gap:4px;">' +
                          '<input type="number" min="0" max="5" id="inp-gram-' + s.id + '" value="' + gCorrect + '" class="form-input" style="width:52px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.9rem; border-radius:8px;">' +
                          '<span style="color:var(--text-muted); font-size:0.8rem; font-weight:700;">/ 5</span>' +
                        '</div>' +
                      '</td>' +

                      // Writing (/5)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<div style="display:inline-flex; align-items:center; gap:4px;">' +
                          '<input type="number" min="0" max="5" id="inp-write-' + s.id + '" value="' + wCorrect + '" class="form-input" style="width:52px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.9rem; border-radius:8px;">' +
                          '<span style="color:var(--text-muted); font-size:0.8rem; font-weight:700;">/ 5</span>' +
                        '</div>' +
                      '</td>' +

                      // Listening
                      '<td style="padding:8px 10px;">' +
                        '<select id="inp-listen-' + s.id + '" class="form-input" style="width:100%; padding:6px 8px; font-size:0.82rem; font-weight:700; border-radius:8px;">' +
                          ['Not Assessed', 'Beginning', 'Developing', 'Secure', 'Strong'].map(function(opt) {
                            return '<option value="' + opt + '" ' + (lRating === opt ? 'selected' : '') + '>' + opt + '</option>';
                          }).join('') +
                        '</select>' +
                      '</td>' +

                      // Speaking
                      '<td style="padding:8px 10px;">' +
                        '<select id="inp-speak-' + s.id + '" class="form-input" style="width:100%; padding:6px 8px; font-size:0.82rem; font-weight:700; border-radius:8px;">' +
                          ['Not Assessed', 'Beginning', 'Developing', 'Secure', 'Strong'].map(function(opt) {
                            return '<option value="' + opt + '" ' + (sRating === opt ? 'selected' : '') + '>' + opt + '</option>';
                          }).join('') +
                        '</select>' +
                      '</td>' +

                      // Teacher Note (Simple Text Box)
                      '<td style="padding:8px 14px;">' +
                        '<textarea id="inp-note-' + s.id + '" class="form-input" rows="2" style="width:100%; font-size:0.82rem; line-height:1.4; resize:vertical; border-radius:8px; padding:6px 8px;" placeholder="Write a short note about ' + s.firstName + '...">' + note + '</textarea>' +
                      '</td>' +

                      // Row Save Action
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<button type="button" class="btn-sm-secondary" onclick="saveSingleStudentGradebookRow(\'' + checkId + '\', \'' + s.id + '\')" style="padding:6px 12px; font-weight:800; font-size:0.78rem; background:#ecfdf5; color:#059669; border-color:#10b981; border-radius:8px;">' +
                          '💾 Save' +
                        '</button>' +
                      '</td>' +
                    '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +

        // Bottom Action Bar: Save All Results
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; padding:16px 0;">' +
          '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="padding:10px 18px; font-weight:700;">' +
            '← Back to Progress Check' +
          '</button>' +

          '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:12px 32px; font-size:1.05rem; font-weight:900; background:#059669; border-color:#047857; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(5,150,105,0.3); border-radius:12px;">' +
            '<span>💾</span> <span>Save All Results</span>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 4. VIEW CLASS RESULTS VIEW (CLEAN READ-ONLY TABLE)
  // =========================================================================

  function renderViewResultsViewHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const existingSubs = store.getProgressCheckSubmissions ? store.getProgressCheckSubmissions(checkId) : [];
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A — The Explorers') : 'Grade 3A — The Explorers';

    return '' +
      '<div style="max-width:1050px; margin:0 auto; padding:0 12px;">' +
        // Top Navigation & Header
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="display:inline-flex; align-items:center; gap:6px; margin-bottom:12px; font-weight:700; padding:6px 12px;">' +
              '<span>←</span> <span>Back to Assessment</span>' +
            '</button>' +
            '<h1 style="font-size:1.55rem; font-weight:900; color:var(--text-main); margin:0 0 6px 0;">' +
              'Class Results — ' + className +
            '</h1>' +
            '<p style="font-size:0.88rem; color:var(--text-muted); margin:0;">' +
              '<strong>' + bookName + ' · ' + unitName + '</strong> — Recorded scores and teacher observations.' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="setProgressCheckViewMode(\'enter\')" style="padding:10px 22px; font-weight:800; background:#d97706; border-color:#b45309; display:inline-flex; align-items:center; gap:8px;">' +
              '<span>✏️</span> <span>Edit Results</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Summary Table
        '<div style="background:#fff; border:1px solid var(--border-light); border-radius:14px; box-shadow:var(--shadow-sm); overflow:hidden; margin-bottom:24px;">' +
          '<div style="overflow-x:auto;">' +
            '<table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:left;">' +
              '<thead>' +
                '<tr style="background:var(--bg-canvas); border-bottom:2px solid var(--border-medium); color:var(--text-main);">' +
                  '<th style="padding:12px 14px; font-weight:800;">STUDENT</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">VOCABULARY</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">READING</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">GRAMMAR</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">WRITING</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">LISTENING</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">SPEAKING</th>' +
                  '<th style="padding:12px 14px; font-weight:800; min-width:240px;">TEACHER NOTE</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                students.map(function(s, idx) {
                  const sub = existingSubs.find(function(item) { return item.studentId === s.id; }) || {};
                  const scores = sub.scores || {};
                  const vStr = scores.vocabulary ? (scores.vocabulary.correct + ' / ' + (scores.vocabulary.total || 10)) : (sub.skillScores && sub.skillScores.vocabulary ? (sub.skillScores.vocabulary.correct + ' / 10') : '8 / 10');
                  const rStr = scores.reading ? (scores.reading.correct + ' / ' + (scores.reading.total || 5)) : (sub.skillScores && sub.skillScores.reading ? (sub.skillScores.reading.correct + ' / 5') : '4 / 5');
                  const gStr = scores.grammar ? (scores.grammar.correct + ' / ' + (scores.grammar.total || 5)) : (sub.skillScores && sub.skillScores.grammar ? (sub.skillScores.grammar.correct + ' / 5') : '4 / 5');
                  const wStr = scores.writing ? (scores.writing.correct + ' / ' + (scores.writing.total || 5)) : (sub.skillScores && sub.skillScores.writing ? (sub.skillScores.writing.correct + ' / 5') : '3 / 5');
                  const lRating = scores.listening ? scores.listening.rating : (sub.teacherAssessment && sub.teacherAssessment.listening ? sub.teacherAssessment.listening : (sub.skillScores && sub.skillScores.listening ? sub.skillScores.listening.statusText : 'Developing'));
                  const sRating = scores.speaking ? scores.speaking.rating : (sub.teacherAssessment && sub.teacherAssessment.speaking ? sub.teacherAssessment.speaking : (sub.skillScores && sub.skillScores.speaking ? sub.skillScores.speaking.statusText : 'Developing'));
                  const note = sub.notes || sub.teacherComment || (s.latestTeacherNote || 'Understands familiar vocabulary well.');

                  const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(s.id, { size: 26, animated: false }) : '👾';
                  const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';

                  return '' +
                    '<tr style="border-bottom:1px solid var(--border-light); background:' + rowBg + ';">' +
                      '<td style="padding:10px 14px;">' +
                        '<div style="display:flex; align-items:center; gap:8px;">' +
                          '<div style="width:26px; height:26px; flex-shrink:0;">' + monsterSvg + '</div>' +
                          '<div style="font-weight:800; color:var(--text-main);">' + s.firstName + ' ' + s.lastName + '</div>' +
                        '</div>' +
                      '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + vStr + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + rStr + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + gStr + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + wStr + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700; color:#0369a1;">' + lRating + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700; color:#c2410c;">' + sRating + '</td>' +
                      '<td style="padding:10px 14px; font-size:0.82rem; color:var(--text-main); line-height:1.4;">' + note + '</td>' +
                    '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +

        '<div style="text-align:center;">' +
          '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="padding:10px 20px; font-weight:700;">' +
            '← Back to Assessment' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 5. GRADEBOOK SAVE CONTROLLERS
  // =========================================================================

  window.getStudentGradebookRowData = function(studentId) {
    const vEl = document.getElementById('inp-vocab-' + studentId);
    const rEl = document.getElementById('inp-read-' + studentId);
    const gEl = document.getElementById('inp-gram-' + studentId);
    const wEl = document.getElementById('inp-write-' + studentId);
    const lEl = document.getElementById('inp-listen-' + studentId);
    const sEl = document.getElementById('inp-speak-' + studentId);
    const nEl = document.getElementById('inp-note-' + studentId);

    const vVal = vEl ? Math.max(0, Math.min(10, Number(vEl.value))) : 8;
    const rVal = rEl ? Math.max(0, Math.min(5, Number(rEl.value))) : 4;
    const gVal = gEl ? Math.max(0, Math.min(5, Number(gEl.value))) : 4;
    const wVal = wEl ? Math.max(0, Math.min(5, Number(wEl.value))) : 3;

    return {
      studentId: studentId,
      scores: {
        vocabulary: { correct: vVal, total: 10 },
        reading: { correct: rVal, total: 5 },
        grammar: { correct: gVal, total: 5 },
        writing: { correct: wVal, total: 5 },
        listening: { rating: lEl ? lEl.value : 'Developing' },
        speaking: { rating: sEl ? sEl.value : 'Developing' }
      },
      teacherAssessment: {
        vocabulary: vVal >= 9 ? 'Strong' : vVal >= 7 ? 'Secure' : 'Developing',
        reading: rVal >= 5 ? 'Strong' : rVal >= 4 ? 'Secure' : 'Developing',
        grammar: gVal >= 5 ? 'Strong' : gVal >= 4 ? 'Secure' : 'Developing',
        writing: wVal >= 5 ? 'Strong' : wVal >= 4 ? 'Secure' : 'Developing',
        listening: lEl ? lEl.value : 'Developing',
        speaking: sEl ? sEl.value : 'Developing'
      },
      notes: nEl ? nEl.value.trim() : ''
    };
  };

  window.saveSingleStudentGradebookRow = function(checkId, studentId) {
    const store = window.schoolStore || window.store;
    if (!store || !store.saveClassProgressCheckResults) return;

    const rowData = getStudentGradebookRowData(studentId);
    store.saveClassProgressCheckResults(checkId, [rowData]);

    const rowEl = document.getElementById('row-student-' + studentId);
    if (rowEl) {
      const origBg = rowEl.style.backgroundColor;
      rowEl.style.backgroundColor = '#d1fae5';
      setTimeout(function() { rowEl.style.backgroundColor = origBg; }, 1000);
    }
    if (window.showToast) window.showToast('✓ Result saved for ' + studentId, 'success');
  };

  window.saveAllGradebookResults = function(checkId) {
    const store = window.schoolStore || window.store;
    if (!store || !store.saveClassProgressCheckResults) return;

    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];
    const results = students.map(function(s) { return getStudentGradebookRowData(s.id); });

    const outcome = store.saveClassProgressCheckResults(checkId, results);
    if (outcome && outcome.success) {
      if (window.showToast) {
        window.showToast('✓ Results saved for ' + (outcome.count || students.length) + ' students.', 'success');
      }
      students.forEach(function(s) {
        const rowEl = document.getElementById('row-student-' + s.id);
        if (rowEl) {
          const origBg = rowEl.style.backgroundColor;
          rowEl.style.backgroundColor = '#d1fae5';
          setTimeout(function() { rowEl.style.backgroundColor = origBg; }, 1200);
        }
      });
    }
  };

  // =========================================================================
  // 6. INTERACTIVE CLASSROOM TEST RUNNER (SMARTBOARD MODAL)
  // =========================================================================

  window.openClassGameModal = function() {
    classGameStationIdx = 0;
    if (window.openModal) {
      window.openModal('modal-progress-check-runner');
      renderSmartboardModalBody();
    }
  };

  function renderSmartboardModalBody() {
    const modalContent = document.getElementById('pc-runner-body');
    if (!modalContent) return;
    const store = window.schoolStore || window.store;
    const activeCheck = store ? store.getProgressCheck(selectedProgressCheckId) : null;
    const stations = activeCheck ? activeCheck.stations : [];
    const station = stations[classGameStationIdx] || (stations.length ? stations[0] : null);
    const students = store ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

    if (!station) {
      modalContent.innerHTML = '<div style="padding:20px; text-align:center;">No test stations configured.</div>';
      return;
    }

    modalContent.innerHTML = '' +
      '<div style="padding:10px 0;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:var(--bg-canvas); padding:10px 14px; border-radius:10px;">' +
          '<div style="font-weight:900; font-size:1.1rem; color:var(--text-main);">' + station.title + '</div>' +
          '<div style="display:flex; gap:6px;">' +
            stations.map(function(st, i) {
              return '<button type="button" class="btn-sm-secondary ' + (classGameStationIdx === i ? 'btn-primary-action' : '') + '" onclick="classGameStationIdx = ' + i + '; renderSmartboardModalBody();" style="padding:4px 8px; font-size:0.75rem;">' +
                st.icon + ' ' + (i + 1) +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        renderCurrentStationScreenHTML(station, students) +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid var(--border-light);">' +
          '<button type="button" class="btn-sm-secondary" onclick="if (classGameStationIdx > 0) { classGameStationIdx--; renderSmartboardModalBody(); }" ' + (classGameStationIdx === 0 ? 'disabled' : '') + '>← Previous Station</button>' +
          (classGameStationIdx < stations.length - 1 ?
            '<button type="button" class="btn-primary-action" onclick="classGameStationIdx++; renderSmartboardModalBody();">Next Station →</button>' :
            '<button type="button" class="btn-primary-action" onclick="finishClassroomGame()" style="background:#10b981; border-color:#059669;">🎉 Finish Class Test &amp; Print Worksheets</button>'
          ) +
        '</div>' +
      '</div>';
  }

  function renderCurrentStationScreenHTML(station, students) {
    if (!station) return '<div class="alert alert-info">Select a station above to begin.</div>';

    let html = '';

    // Station 1: Vocabulary
    if (station.key === 'vocabulary') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">🧠 Vocabulary Challenge — Call &amp; Response</h3>' +
            '<div style="font-size:0.8rem; color:var(--text-muted);">Teacher shows picture on screen. Students answer together or when called upon.</div>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:18px;">' +
            station.questions.map(function(q) {
              return '<div style="background:#fff; border:2px solid var(--border-light); border-radius:12px; padding:16px; text-align:center;">' +
                '<div style="font-size:3rem; margin-bottom:8px;">' + (q.imageEmoji || '🎒') + '</div>' +
                '<div style="font-size:0.86rem; font-weight:800; margin-bottom:10px;">' + q.prompt + '</div>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">' +
                  q.options.map(function(opt) {
                    return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="padding:6px; font-size:0.8rem; font-weight:700;">' +
                      opt +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">' +
            '<div style="font-size:0.84rem; font-weight:800; color:var(--text-main);">Quick Class Observation:</div>' +
            '<div style="display:flex; gap:8px;">' +
              '<button type="button" class="btn-sm-secondary" onclick="setClassObservation(\'Strong\')" style="padding:4px 10px; font-weight:800; color:#059669; background:#ecfdf5; border-color:#10b981;">✓ Class Strong</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="setClassObservation(\'Developing\')" style="padding:4px 10px; font-weight:800; color:#b45309; background:#fef3c7; border-color:#f59e0b;">🟡 Mixed / Developing</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="setClassObservation(\'Needs Practice\')" style="padding:4px 10px; font-weight:800; color:#b91c1c; background:#fee2e2; border-color:#ef4444;">🔴 Needs Review</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // Station 2: Listening
    else if (station.key === 'listening') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="margin-bottom:14px;">' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">👂 Listening Cave — Listen &amp; Choose</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:4px 0 0 0;">Press play audio on classroom speaker. Students listen and identify matching picture.</p>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">' +
            station.questions.map(function(q, qIdx) {
              const safeAudio = (q.ttsAudio || '').replace(/'/g, "\\'");
              return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
                  '<span style="font-size:0.8rem; font-weight:800; color:#0284c7;">ITEM ' + (qIdx + 1) + '</span>' +
                  '<button type="button" class="btn-primary-action" onclick="playAudioPrompt(\'' + safeAudio + '\')" style="padding:6px 14px; font-size:0.8rem; font-weight:800; background:#0284c7; display:inline-flex; align-items:center; gap:6px;">' +
                    '<span>🔊</span> <span>Play Audio</span>' +
                  '</button>' +
                '</div>' +
                '<div style="font-size:0.88rem; font-weight:800; margin-bottom:10px; color:var(--text-main);">' + q.prompt + '</div>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">' +
                  q.options.map(function(opt) {
                    return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="padding:8px; font-size:0.8rem; font-weight:700; text-align:left;">' +
                      opt +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    // Station 3: Reading
    else if (station.key === 'reading') {
      const passage = station.readingPassage || {};
      const safeText = (passage.text || '').replace(/'/g, "\\'");
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:18px; margin-bottom:16px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
              '<div style="font-size:0.75rem; font-weight:900; color:#e11d48; text-transform:uppercase;">UNIT 1 ILLUSTRATED PASSAGE</div>' +
              '<button type="button" class="btn-sm-secondary" onclick="playAudioPrompt(\'' + safeText + '\')" style="padding:4px 10px; font-size:0.75rem; font-weight:700;">🔊 Read Aloud</button>' +
            '</div>' +
            '<h4 style="font-size:1.15rem; font-weight:900; margin:0 0 8px 0; color:var(--text-main);">' + (passage.title || 'The Treehouse Club') + '</h4>' +
            '<p style="font-size:0.92rem; line-height:1.6; color:var(--text-main); margin:0;">' + (passage.text || '') + '</p>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">' +
            station.questions.map(function(q, qIdx) {
              return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:14px;">' +
                '<div style="font-size:0.84rem; font-weight:800; margin-bottom:8px; color:var(--text-main);">' + (qIdx + 1) + '. ' + q.prompt + '</div>' +
                '<div style="display:flex; flex-direction:column; gap:6px;">' +
                  q.options.map(function(opt) {
                    return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="padding:6px 10px; font-size:0.8rem; font-weight:700; text-align:left;">' +
                      opt +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    // Station 4: Grammar
    else if (station.key === 'grammar') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="margin-bottom:14px;">' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">🔤 Grammar Garden — Present Simple &amp; Structures</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:4px 0 0 0;">Students call out or show the correct option for third person agreement, is/are, and articles.</p>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">' +
            station.questions.map(function(q, qIdx) {
              return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:16px;">' +
                '<div style="font-size:0.92rem; font-weight:800; margin-bottom:12px; color:var(--text-main);">' + (qIdx + 1) + '. ' + q.prompt + '</div>' +
                '<div style="display:flex; gap:8px;">' +
                  q.options.map(function(opt) {
                    return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="flex:1; padding:10px; font-size:0.86rem; font-weight:800;">' +
                      opt +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    // Station 5: Speaking
    else if (station.key === 'speaking') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="display:grid; grid-template-columns:1.4fr 1fr; gap:18px;">' +
            '<div>' +
              '<h3 style="font-size:1.15rem; font-weight:800; margin:0 0 6px 0; color:var(--text-main);">🗣️ Speaking Circle — Teacher Prompts</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 14px 0;">Teacher asks conversational prompts to small groups or individual students.</p>' +

              '<div style="display:flex; flex-direction:column; gap:10px;">' +
                (station.prompts || [
                  'What can you see in the classroom?',
                  'What is your favorite adventure book?',
                  'Can you describe your backpack?',
                  'What do you do on Saturday mornings?'
                ]).map(function(p, i) {
                  return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:12px 14px; display:flex; align-items:center; gap:10px;">' +
                    '<span style="background:#ea580c; color:#fff; font-size:0.75rem; font-weight:900; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + (i + 1) + '</span>' +
                    '<span style="font-weight:700; font-size:0.88rem; color:var(--text-main);">' + p + '</span>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +

            // Quick live speaking roster
            '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
              '<div style="font-size:0.84rem; font-weight:800; margin-bottom:8px; color:var(--text-main);">Quick Student Observation</div>' +
              '<div style="display:flex; flex-direction:column; gap:6px; max-height:280px; overflow-y:auto;">' +
                students.map(function(s) {
                  const currentObs = classGameObservations[s.id] || 'Not Observed';
                  return '' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:var(--bg-canvas); border-radius:8px; font-size:0.8rem;">' +
                      '<div style="font-weight:800; color:var(--text-main);">' + s.firstName + ' ' + s.lastName + '</div>' +
                      '<div style="display:flex; gap:4px;">' +
                        ['Beginning', 'Developing', 'Secure', 'Strong'].map(function(lvl) {
                          return '<button type="button" onclick="setStudentLiveSpeakingObs(\'' + s.id + '\', \'' + lvl + '\')" class="btn-sm-secondary" style="font-size:0.68rem; padding:2px 6px; font-weight:700; ' + (currentObs === lvl ? 'background:var(--color-primary); color:#fff; border-color:var(--color-primary);' : '') + '">' +
                            lvl.charAt(0) +
                          '</button>';
                        }).join('') +
                      '</div>' +
                    '</div>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // Station 6: Writing Workshop Prompt
    else if (station.key === 'writing') {
      const prompt = station.writingPrompt || {};
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px; text-align:center;">' +
          '<div style="max-width:700px; margin:0 auto;">' +
            '<div style="font-size:0.8rem; font-weight:800; color:#ca8a04; margin-bottom:6px;">WRITING PROMPT INTRODUCTION</div>' +
            '<h3 style="font-size:1.35rem; font-weight:900; margin:0 0 10px 0; color:var(--text-main);">' + (prompt.title || 'A Sunny Day in the Park') + '</h3>' +
            '<p style="font-size:0.95rem; color:var(--text-muted); margin:0 0 16px 0;">' + (prompt.promptText || 'Look at the picture. Write 3–5 sentences describing what the children and the puppy are doing.') + '</p>' +

            '<div style="background:#fff; border:2px dashed #ca8a04; border-radius:14px; padding:20px; margin-bottom:18px;">' +
              '<div style="font-size:4rem; margin-bottom:10px;">☀️ 🌳 👦 ⚽ 🐕 👧 🥪</div>' +
              '<div style="font-size:0.86rem; font-weight:800; margin-bottom:10px; color:var(--text-main);">Word Bank for Your Sentences:</div>' +
              '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">' +
                (prompt.wordBank || ['boy', 'girl', 'puppy', 'ball', 'sunny', 'happy', 'plays', 'runs', 'park']).map(function(w) {
                  return '<span style="background:#fef3c7; color:#92400e; padding:4px 12px; border-radius:16px; font-weight:800; font-size:0.82rem;">' + w + '</span>';
                }).join('') +
              '</div>' +
            '</div>' +

            '<div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px 18px; margin-bottom:20px; font-size:0.88rem; color:#1d4ed8; font-weight:700;">' +
              '📝 ' + (prompt.instructions || 'Students discuss the scene on the screen, then write their 3–5 sentences on Part D of their printed worksheet.') +
            '</div>' +
          '</div>' +
        '</div>';
    }

    return html;
  }

  window.revealAnswer = function(btnEl, correct, choice) {
    if (!btnEl) return;
    const parent = btnEl.parentElement;
    if (parent) {
      const btns = parent.querySelectorAll('button');
      btns.forEach(function(b) {
        b.style.backgroundColor = '#f1f5f9';
        b.style.borderColor = '#cbd5e1';
        b.style.color = '#475569';
      });
      if (choice === correct) {
        btnEl.style.backgroundColor = '#dcfce7';
        btnEl.style.borderColor = '#10b981';
        btnEl.style.color = '#065f46';
      } else {
        btnEl.style.backgroundColor = '#fee2e2';
        btnEl.style.borderColor = '#ef4444';
        btnEl.style.color = '#991b1b';
      }
    }
  };

  window.playAudioPrompt = function(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  window.setClassObservation = function(status) {
    classGameClassResponse = status;
    if (window.showToast) window.showToast('Class response logged: ' + status, 'info');
  };

  window.setStudentLiveSpeakingObs = function(studentId, level) {
    classGameObservations[studentId] = level;
    renderSmartboardModalBody();
  };

  window.awardClassCompletionXP = function() {
    const store = window.schoolStore || window.store;
    if (!store) return;
    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

    students.forEach(function(s) {
      store.giveXP(
        s.id,
        50,
        'Class Assessment Participation: Unit 1 Progress Check',
        'assessment',
        { isPoints: true, category: 'positive', icon: '⭐' }
      );
    });

    if (window.showToast) window.showToast('Awarded +50 XP participation reward to all ' + students.length + ' students!', 'success');
  };

  window.finishClassroomGame = function() {
    awardClassCompletionXP();
    if (window.closeModal) window.closeModal('modal-progress-check-runner');
    openPrintableProgressCheck(selectedProgressCheckId, false);
  };

  // =========================================================================
  // 7. PRINTABLE A4 WORKSHEET & ANSWER KEY
  // =========================================================================

  window.openPrintableProgressCheck = function(checkId, showAnswerKey) {
    if (!checkId) checkId = selectedProgressCheckId || 'progress-check-a1';
    if (showAnswerKey === undefined) showAnswerKey = false;
    const store = window.schoolStore || window.store;
    if (!store) return;
    printableCurrentCheckId = checkId;
    printableShowAnswerKey = showAnswerKey;

    const check = store.getProgressCheck(checkId);
    const body = document.getElementById('printable-progress-check-content');
    if (!body || !check) return;

    let html = '';

    if (!printableShowAnswerKey) {
      // Clean A4 Student Worksheet
      html +=
        '<div style="font-family:inherit; color:#111; max-width:800px; margin:0 auto; padding:20px; line-height:1.5;">' +
          '<div style="border-bottom:2px solid #000; padding-bottom:12px; margin-bottom:16px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
              '<div>' +
                '<h1 style="font-size:1.5rem; font-weight:900; margin:0 0 4px 0; text-transform:uppercase;">English Adventure Progress Check</h1>' +
                '<div style="font-size:0.86rem; font-weight:700;">' + (check.bookTitle || 'Global Readings 2') + ' · ' + (check.unitTitle || 'Unit 1') + ' · 4-Week Assessment</div>' +
              '</div>' +
              '<div style="text-align:right; font-size:0.82rem; font-weight:700;">' +
                '<div>Target: <strong>' + (check.cefrTarget || 'A1') + '</strong></div>' +
                '<div>Time: <strong>45 mins</strong></div>' +
              '</div>' +
            '</div>' +
            '<div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; margin-top:14px; font-size:0.86rem; font-weight:700;">' +
              '<div style="border-bottom:1px solid #666; padding-bottom:4px;">Student: ____________________</div>' +
              '<div style="border-bottom:1px solid #666; padding-bottom:4px;">Class: ________________</div>' +
              '<div style="border-bottom:1px solid #666; padding-bottom:4px;">Date: ____________</div>' +
            '</div>' +
          '</div>' +

          // PART A: VOCABULARY
          '<div style="margin-bottom:18px;">' +
            '<h3 style="font-size:1.05rem; font-weight:900; border-bottom:1px solid #ccc; padding-bottom:4px; margin-bottom:8px;">PART A — VOCABULARY (/10)</h3>' +
            '<p style="font-size:0.82rem; margin:0 0 10px 0; font-style:italic;">Look at the pictures and circle the correct word.</p>' +
            '<div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; text-align:center; font-size:0.8rem;">' +
              '<div style="border:1px solid #999; padding:8px; border-radius:6px;"><div style="font-size:2rem;">🎒</div><div>1. [ backpack / pencil ]</div></div>' +
              '<div style="border:1px solid #999; padding:8px; border-radius:6px;"><div style="font-size:2rem;">🐶</div><div>2. [ cat / dog ]</div></div>' +
              '<div style="border:1px solid #999; padding:8px; border-radius:6px;"><div style="font-size:2rem;">🍎</div><div>3. [ apple / banana ]</div></div>' +
              '<div style="border:1px solid #999; padding:8px; border-radius:6px;"><div style="font-size:2rem;">🚌</div><div>4. [ bus / car ]</div></div>' +
              '<div style="border:1px solid #999; padding:8px; border-radius:6px;"><div style="font-size:2rem;">🌳</div><div>5. [ park / shop ]</div></div>' +
            '</div>' +
          '</div>' +

          // PART B: READING
          '<div style="margin-bottom:18px;">' +
            '<h3 style="font-size:1.05rem; font-weight:900; border-bottom:1px solid #ccc; padding-bottom:4px; margin-bottom:8px;">PART B — READING (/5)</h3>' +
            '<div style="border:1px solid #aaa; padding:10px 14px; border-radius:6px; font-size:0.84rem; line-height:1.6; margin-bottom:10px; background:#fafafa;">' +
              '<strong>The Treehouse Club:</strong> Leo and Mia have a wooden treehouse in their garden. Leo keeps his favorite adventure books on the shelf. Mia has a box of colorful markers. Every Saturday morning, their friendly puppy Toby waits by the ladder.' +
            '</div>' +
            '<div style="font-size:0.82rem; line-height:1.8;">' +
              '<div>1. Where is the treehouse? ___________________________________________</div>' +
              '<div>2. What does Leo keep on the shelf? ____________________________________</div>' +
              '<div>3. Who is Toby? ____________________________________________________</div>' +
              '<div>4. When do they go to the treehouse? ___________________________________</div>' +
            '</div>' +
          '</div>' +

          // PART C: GRAMMAR
          '<div style="margin-bottom:18px;">' +
            '<h3 style="font-size:1.05rem; font-weight:900; border-bottom:1px solid #ccc; padding-bottom:4px; margin-bottom:8px;">PART C — GRAMMAR (/5)</h3>' +
            '<div style="font-size:0.82rem; line-height:1.9;">' +
              '<div>1. She ________ an apple. ( eat / eats )</div>' +
              '<div>2. There ________ two books on the desk. ( is / are )</div>' +
              '<div>3. Leo ________ a big wooden treehouse. ( have / has )</div>' +
              '<div>4. They ________ like rainy days. ( don\'t / doesn\'t )</div>' +
              '<div>5. Mia has ________ orange backpack. ( a / an )</div>' +
            '</div>' +
          '</div>' +

          // PART D: WRITING
          '<div style="margin-bottom:18px;">' +
            '<h3 style="font-size:1.05rem; font-weight:900; border-bottom:1px solid #ccc; padding-bottom:4px; margin-bottom:8px;">PART D — WRITING (/5)</h3>' +
            '<p style="font-size:0.82rem; margin:0 0 6px 0;">Look at the picture. Write 3–5 sentences. Use words from the word bank:</p>' +
            '<div style="border:1px dashed #666; padding:6px 10px; font-size:0.78rem; font-weight:700; margin-bottom:8px;">' +
              'Word Bank: [ boy · girl · puppy · ball · sunny · happy · plays · runs · park ]' +
            '</div>' +
            '<div style="border:1px solid #bbb; height:90px; border-radius:4px; background:repeating-linear-gradient(transparent, transparent 22px, #ddd 23px); padding:4px 8px;"></div>' +
          '</div>' +

          // PART E: TEACHER OBSERVATION
          '<div style="border-top:2px dashed #444; padding-top:10px; font-size:0.78rem;">' +
            '<div style="font-weight:900; margin-bottom:6px; text-transform:uppercase;">PART E — TEACHER OBSERVATION (TEACHER ONLY)</div>' +
            '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:8px;">' +
              '<div><strong>Speaking:</strong><br>☐ Beg  ☐ Dev  ☐ Sec  ☐ Str</div>' +
              '<div><strong>Listening:</strong><br>☐ Beg  ☐ Dev  ☐ Sec  ☐ Str</div>' +
              '<div><strong>Participation:</strong><br>☐ Beg  ☐ Dev  ☐ Sec  ☐ Str</div>' +
              '<div><strong>Communication:</strong><br>☐ Beg  ☐ Dev  ☐ Sec  ☐ Str</div>' +
            '</div>' +
            '<div>Teacher Notes: ________________________________________________________________________________</div>' +
          '</div>' +
        '</div>';
    } else {
      // Teacher Answer Key
      html +=
        '<div style="font-family:inherit; color:#111; max-width:800px; margin:0 auto; padding:20px; line-height:1.6;">' +
          '<div style="border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:16px;">' +
            '<h1 style="font-size:1.4rem; font-weight:900; margin:0 0 4px 0;">🗝️ TEACHER ANSWER KEY &amp; OBJECTIVES</h1>' +
            '<div style="font-size:0.86rem; font-weight:700;">' + (check.bookTitle || 'Global Readings 2') + ' · ' + (check.unitTitle || 'Unit 1') + ' · 4-Week Progress Check</div>' +
          '</div>' +
          '<div style="font-size:0.84rem; display:flex; flex-direction:column; gap:12px;">' +
            '<div><strong>PART A — VOCABULARY:</strong> 1. backpack (2 pts) | 2. dog (2 pts) | 3. apple (2 pts) | 4. bus (2 pts) | 5. park (2 pts) &rarr; <em>Total: 10 pts</em></div>' +
            '<div><strong>PART B — READING:</strong> 1. In their garden (1.25 pts) | 2. Favorite adventure books (1.25 pts) | 3. Their friendly puppy (1.25 pts) | 4. Every Saturday morning (1.25 pts) &rarr; <em>Total: 5 pts</em></div>' +
            '<div><strong>PART C — GRAMMAR:</strong> 1. eats (1 pt) | 2. are (1 pt) | 3. has (1 pt) | 4. don\'t (1 pt) | 5. an (1 pt) &rarr; <em>Total: 5 pts</em></div>' +
            '<div><strong>PART D — WRITING:</strong> 3–5 sentences describing children in park. 5/5: 4+ sentences, good punctuation. 3-4/5: 2-3 sentences. 1-2/5: single words/phrases.</div>' +
            '<div><strong>PART E — OBSERVATION:</strong> Use Beginning, Developing, Secure, Strong. Enter directly into Enter Results Gradebook.</div>' +
          '</div>' +
        '</div>';
    }

    body.innerHTML = html;
    if (window.openModal) window.openModal('modal-printable-progress-check');
  };

  window.togglePrintableAnswerKey = function() {
    printableShowAnswerKey = !printableShowAnswerKey;
    openPrintableProgressCheck(printableCurrentCheckId, printableShowAnswerKey);
  };

  window.openProgressCheckBuilderModal = function() {
    if (window.switchView) window.switchView('progress-check');
    window.setProgressCheckViewMode('home');
  };

})(typeof window !== 'undefined' ? window : global);
