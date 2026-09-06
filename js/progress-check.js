/**
 * ENGLISH ADVENTURE ACADEMY — FOUR-SKILL WHOLE-CLASS PROGRESS CHECK
 * Exact implementation matching uploaded reference (media_1788697610637.jpg)
 *
 * Core Capabilities:
 * 1. Whole-Class Assessment for Grade 3 (Global Readings 2 Unit 1) and Grade 4 (Global Readings 3 Unit 1).
 * 2. Four Skills: Reading (/10), Listening (/10), Writing (/10), Speaking (/10) = Total (/40).
 * 3. Printable Student Worksheet (Clear visuals: red bag, pencil, book, chair with star target; NO teacher script on student sheet).
 * 4. Printable Teacher Sheet (Full Reading Answer Key, Teacher Spoken Script, Writing Guidance, Speaking Rubric, Class Results Table).
 * 5. Interactive Gradebook: Auto-calculates row totals, row save & save-all, updates Learning Evidence, Student Profile, and +50 XP reward.
 * 6. Interactive Speaking Rubric Drawer (5 criteria x 0-4 = raw 20 / 2 = /10 with teacher override).
 */

(function(window) {
  'use strict';

  // Module State
  let progressCheckViewMode = 'home'; // 'home' | 'enter' | 'view'
  let selectedProgressCheckId = 'progress-check-gr2-u1';
  let selectedAnalyticsClassId = 'class-3a';

  // Printable State
  let printableCurrentCheckId = 'progress-check-gr2-u1';
  let printableShowTeacherSheet = false;

  // Speaking Rubric Modal State
  let activeRubricStudentId = null;
  let activeRubricCheckId = null;

  // Smartboard Screen Test State
  let classGameStationIdx = 0;

  // =========================================================================
  // VIEW MODE ROUTER
  // =========================================================================

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

  window.switchProgressCheckClass = function(classId) {
    selectedAnalyticsClassId = classId;
    const store = window.schoolStore || window.store;
    if (store) store.setActiveClass(classId);
    window.renderProgressCheckView();
  };

  // =========================================================================
  // 1. MAIN PROGRESS CHECK VIEW
  // =========================================================================

  window.renderProgressCheckView = function(container) {
    if (!container) container = document.getElementById('app-view-container');
    if (!container) return;

    const store = window.schoolStore || window.store;
    if (!store) {
      container.innerHTML = '<div class="alert alert-danger" style="padding:20px; border-radius:10px;">Error: School Store not initialized.</div>';
      return;
    }

    const activeClass = store.getActiveClass();
    if (activeClass && activeClass.id) {
      selectedAnalyticsClassId = activeClass.id;
    }

    const currentClass = store.getClass(selectedAnalyticsClassId) || activeClass || { id: 'class-3a', name: 'Grade 3A', grade: 'Grade 3' };
    const students = store.getStudentsByClass ? store.getStudentsByClass(currentClass.id) : [];

    // Select authentic progress check based on grade
    const checks = store.getProgressChecks ? store.getProgressChecks('active') : [];
    let activeCheck = null;

    if (currentClass.grade === 'Grade 4') {
      activeCheck = checks.find(c => c.id === 'progress-check-gr3-u1' || c.targetGrade === 'Grade 4') || checks[1] || checks[0];
    } else {
      activeCheck = checks.find(c => c.id === 'progress-check-gr2-u1' || c.targetGrade === 'Grade 3') || checks[0];
    }

    if (activeCheck) {
      selectedProgressCheckId = activeCheck.id;
    }

    let html = '<div id="pc-main-wrapper" style="padding: 10px 0 40px 0;">';

    if (progressCheckViewMode === 'enter') {
      html += renderEnterResultsViewHTML(store, activeCheck, currentClass, students);
    } else if (progressCheckViewMode === 'view') {
      html += renderViewResultsViewHTML(store, activeCheck, currentClass, students);
    } else {
      html += renderHomeViewHTML(store, activeCheck, currentClass, students);
    }

    html += '</div>';
    container.innerHTML = html;
  };

  // =========================================================================
  // 2. HOME VIEW (THE OVERVIEW & ACTION CARDS)
  // =========================================================================

  function renderHomeViewHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-gr2-u1';
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A') : 'Grade 3A';
    const cefrTarget = activeCheck ? (activeCheck.cefrTarget || 'A1') : 'A1';

    const submissions = store.getProgressCheckSubmissions ? store.getProgressCheckSubmissions(checkId) : [];
    const completedCount = submissions.filter(s => s.status === 'completed').length;
    const totalStudents = students.length;

    return '' +
      '<div style="max-width:1040px; margin:0 auto; padding:10px 16px;">' +

        // Class Switcher & Badge Header
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<span style="font-size:1.6rem;">📊</span>' +
            '<div>' +
              '<h1 style="font-size:1.45rem; font-weight:900; color:var(--text-main); margin:0;">Four-Skill Progress Check</h1>' +
              '<p style="font-size:0.84rem; color:var(--text-muted); margin:2px 0 0 0;">End-of-Unit Whole-Class Assessment · 40 Points Total</p>' +
            '</div>' +
          '</div>' +

          // Class Switcher Pills
          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Active Class:</span>' +
            (store.getClasses ? store.getClasses() : []).map(cls => '' +
              '<button type="button" class="btn-sm-secondary ' + (cls.id === currentClass.id ? 'btn-primary-action' : '') + '" onclick="switchProgressCheckClass(\'' + cls.id + '\')" style="padding:5px 12px; font-weight:800; font-size:0.82rem;">' +
                cls.name +
              '</button>'
            ).join('') +
          '</div>' +
        '</div>' +

        // Hero Card with Unit & Roster Overview
        '<div style="background:linear-gradient(135deg, #1e293b, #0f172a); color:#fff; border-radius:18px; padding:26px 28px; margin-bottom:30px; box-shadow:0 8px 24px rgba(15,23,42,0.15); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">' +
          '<div>' +
            '<div style="display:inline-flex; align-items:center; gap:8px; background:rgba(59,130,246,0.25); color:#93c5fd; font-weight:800; font-size:0.75rem; padding:4px 12px; border-radius:14px; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.04em;">' +
              '<span>🎯</span> <span>' + cefrTarget + ' · Unit 1 Assessment (4-Week Timeline)</span>' +
            '</div>' +
            '<h2 style="font-size:1.6rem; font-weight:900; margin:0 0 6px 0; color:#fff;">' + (activeCheck ? activeCheck.title : 'Progress Check') + '</h2>' +
            '<p style="font-size:0.92rem; color:#cbd5e1; margin:0 0 14px 0;">' + bookName + ' · ' + unitName + ' — Whole-Class Assessment for <strong>' + className + '</strong> (' + totalStudents + ' Students)</p>' +
            '<div style="display:flex; gap:16px; font-size:0.82rem; font-weight:700; color:#94a3b8;">' +
              '<span>📖 Reading: 10 pts</span>' +
              '<span>👂 Listening: 10 pts</span>' +
              '<span>✍️ Writing: 10 pts</span>' +
              '<span>🗣️ Speaking: 10 pts</span>' +
              '<span style="color:#38bdf8;">⭐ Total: 40 pts</span>' +
            '</div>' +
          '</div>' +

          '<div style="text-align:right; background:rgba(255,255,255,0.08); padding:16px 22px; border-radius:14px; border:1px solid rgba(255,255,255,0.12);">' +
            '<div style="font-size:2rem; font-weight:900; color:#38bdf8;">' + completedCount + ' / ' + totalStudents + '</div>' +
            '<div style="font-size:0.78rem; font-weight:700; color:#94a3b8; text-transform:uppercase;">Class Submissions</div>' +
          '</div>' +
        '</div>' +

        // ACTION TILES (4 Interactive Options)
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:18px; margin-bottom:32px;">' +

          // Option 1: Enter Results (Primary Teacher Gradebook)
          '<div onclick="setProgressCheckViewMode(\'enter\')" style="background:#fff; border:2px solid #fef3c7; border-radius:16px; padding:22px 18px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 12px rgba(245,158,11,0.08); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="width:58px; height:58px; margin:0 auto 14px auto; background:#fef3c7; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:2rem;">✏️</div>' +
              '<h3 style="font-size:1.15rem; font-weight:900; color:#92400e; margin:0 0 6px 0;">Enter Results</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin:0 0 16px 0;">Input 4-skill scores (/10 each) and short notes for the whole class roster.</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:9px; font-size:0.88rem; font-weight:800; background:#d97706; border-color:#b45309; justify-content:center; border-radius:10px;">' +
              '✏️ Open Gradebook' +
            '</button>' +
          '</div>' +

          // Option 2: Print Student Worksheet
          '<div onclick="openPrintableProgressCheck(\'' + checkId + '\', false)" style="background:#fff; border:2px solid #d1fae5; border-radius:16px; padding:22px 18px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 12px rgba(16,185,129,0.08); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="width:58px; height:58px; margin:0 auto 14px auto; background:#d1fae5; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:2rem;">📄</div>' +
              '<h3 style="font-size:1.15rem; font-weight:900; color:#065f46; margin:0 0 6px 0;">Student Worksheet</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin:0 0 16px 0;">Print clean A4 test sheets with pictures, questions, and lined writing areas.</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:9px; font-size:0.88rem; font-weight:800; background:#059669; border-color:#047857; justify-content:center; border-radius:10px;">' +
              '🖨️ Print Student Test' +
            '</button>' +
          '</div>' +

          // Option 3: Print Teacher Sheet
          '<div onclick="openPrintableProgressCheck(\'' + checkId + '\', true)" style="background:#fff; border:2px solid #e0e7ff; border-radius:16px; padding:22px 18px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 12px rgba(99,102,241,0.08); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="width:58px; height:58px; margin:0 auto 14px auto; background:#e0e7ff; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:2rem;">📋</div>' +
              '<h3 style="font-size:1.15rem; font-weight:900; color:#3730a3; margin:0 0 6px 0;">Teacher Sheet</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin:0 0 16px 0;">Spoken listening scripts, reading answer keys, speaking rubrics & results table.</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" style="width:100%; padding:9px; font-size:0.88rem; font-weight:800; background:#4f46e5; border-color:#4338ca; justify-content:center; border-radius:10px;">' +
              '🗝️ Print Teacher Sheet' +
            '</button>' +
          '</div>' +

          // Option 4: View Class Results
          '<div onclick="setProgressCheckViewMode(\'view\')" style="background:#fff; border:2px solid #f1f5f9; border-radius:16px; padding:22px 18px; text-align:center; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 12px rgba(0,0,0,0.04); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="width:58px; height:58px; margin:0 auto 14px auto; background:#f1f5f9; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:2rem;">📈</div>' +
              '<h3 style="font-size:1.15rem; font-weight:900; color:var(--text-main); margin:0 0 6px 0;">Class Results</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin:0 0 16px 0;">View student totals (/40), mastery ratings, and performance analytics.</p>' +
            '</div>' +
            '<button type="button" class="btn-sm-secondary" style="width:100%; padding:9px; font-size:0.88rem; font-weight:800; justify-content:center; border-radius:10px;">' +
              '📊 View Results' +
            '</button>' +
          '</div>' +

        '</div>' +

        // Smartboard Classroom Interactive Activity Bar
        '<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">' +
          '<div style="display:flex; align-items:center; gap:12px;">' +
            '<span style="font-size:1.8rem;">🖥️</span>' +
            '<div>' +
              '<div style="font-weight:900; font-size:1rem; color:var(--text-main);">Interactive Smartboard Test Activity</div>' +
              '<div style="font-size:0.82rem; color:var(--text-muted);">Display questions on the classroom screen while students complete worksheets</div>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn-primary-action" onclick="openClassGameModal()" style="padding:10px 20px; font-weight:800; font-size:0.88rem; background:#0f172a; border-color:#020617; border-radius:10px;">' +
            '🖥️ Launch Screen Test' +
          '</button>' +
        '</div>' +

      '</div>';
  }

  // =========================================================================
  // 3. ENTER RESULTS VIEW (AUTHENTIC FOUR-SKILL GRADEBOOK TABLE)
  // =========================================================================

  function renderEnterResultsViewHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-gr2-u1';
    const existingSubs = store.getProgressCheckSubmissions ? store.getProgressCheckSubmissions(checkId) : [];
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A') : 'Grade 3A';

    return '' +
      '<div style="max-width:1100px; margin:0 auto; padding:0 12px;">' +

        // Navigation Header
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="display:inline-flex; align-items:center; gap:6px; margin-bottom:10px; font-weight:700; padding:6px 12px;">' +
              '<span>←</span> <span>Back to Progress Check</span>' +
            '</button>' +
            '<h1 style="font-size:1.55rem; font-weight:900; color:var(--text-main); margin:0 0 4px 0;">' +
              'Enter Four-Skill Scores — ' + className +
            '</h1>' +
            '<p style="font-size:0.86rem; color:var(--text-muted); margin:0;">' +
              '<strong>' + bookName + ' · ' + unitName + '</strong> — Enter scores (/10 each) for Reading, Listening, Writing, and Speaking.' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:10px 24px; font-size:0.95rem; font-weight:900; background:#059669; border-color:#047857; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(5,150,105,0.25); border-radius:10px;">' +
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
                  '<th style="padding:12px 14px; font-weight:800; min-width:170px;">STUDENT</th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:95px; text-align:center;">READING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">( / 10 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:95px; text-align:center;">LISTENING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">( / 10 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:95px; text-align:center;">WRITING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">( / 10 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:135px; text-align:center;">SPEAKING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">( / 10 )</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; min-width:85px; text-align:center;">TOTAL<br><span style="font-size:0.72rem; color:var(--color-primary); font-weight:800;">( / 40 )</span></th>' +
                  '<th style="padding:12px 14px; font-weight:800; min-width:240px;">TEACHER NOTE</th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center; min-width:80px;">ACTION</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                (students.length === 0 ? '<tr><td colspan="8" style="padding:30px; text-align:center; color:var(--text-muted);">No students registered in this class.</td></tr>' : '') +
                students.map(function(s, idx) {
                  const sub = existingSubs.find(function(item) { return item.studentId === s.id; }) || {};
                  const scores = sub.scores || {};

                  // Defaults for fresh students are empty (null/0)
                  const rVal = (scores.reading && scores.reading.correct !== undefined) ? scores.reading.correct : (sub.skillScores && sub.skillScores.reading ? sub.skillScores.reading.correct : '');
                  const lVal = (scores.listening && scores.listening.correct !== undefined) ? scores.listening.correct : (sub.skillScores && sub.skillScores.listening ? sub.skillScores.listening.correct : '');
                  const wVal = (scores.writing && scores.writing.correct !== undefined) ? scores.writing.correct : (sub.skillScores && sub.skillScores.writing ? sub.skillScores.writing.correct : '');
                  const sVal = (scores.speaking && scores.speaking.correct !== undefined) ? scores.speaking.correct : (sub.skillScores && sub.skillScores.speaking ? sub.skillScores.speaking.correct : '');

                  const totalVal = (Number(rVal) || 0) + (Number(lVal) || 0) + (Number(wVal) || 0) + (Number(sVal) || 0);
                  const note = sub.notes || sub.teacherComment || (s.latestTeacherNote || '');

                  const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(s.id, { size: 28, animated: false }) : '👾';
                  const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';

                  return '' +
                    '<tr id="row-student-' + s.id + '" style="border-bottom:1px solid var(--border-light); background:' + rowBg + '; transition:background 0.2s ease;">' +

                      // Student Info
                      '<td style="padding:10px 14px;">' +
                        '<div style="display:flex; align-items:center; gap:10px;">' +
                          '<div style="width:28px; height:28px; flex-shrink:0;">' + monsterSvg + '</div>' +
                          '<div>' +
                            '<div style="font-weight:800; color:var(--text-main); font-size:0.9rem;">' + s.firstName + ' ' + s.lastName + '</div>' +
                            '<div style="font-size:0.72rem; color:var(--text-muted);">' + (s.studentIdNumber ? 'ID: ' + s.studentIdNumber : (s.grade || 'Grade 3')) + '</div>' +
                          '</div>' +
                        '</div>' +
                      '</td>' +

                      // Reading (/10)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<input type="number" min="0" max="10" step="0.5" id="inp-read-' + s.id + '" value="' + rVal + '" oninput="updateRowTotal(\'' + s.id + '\')" class="form-input" style="width:56px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.92rem; border-radius:8px;">' +
                      '</td>' +

                      // Listening (/10)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<input type="number" min="0" max="10" step="0.5" id="inp-listen-' + s.id + '" value="' + lVal + '" oninput="updateRowTotal(\'' + s.id + '\')" class="form-input" style="width:56px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.92rem; border-radius:8px;">' +
                      '</td>' +

                      // Writing (/10)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<input type="number" min="0" max="10" step="0.5" id="inp-write-' + s.id + '" value="' + wVal + '" oninput="updateRowTotal(\'' + s.id + '\')" class="form-input" style="width:56px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.92rem; border-radius:8px;">' +
                      '</td>' +

                      // Speaking (/10) with Rubric Shortcut
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<div style="display:inline-flex; align-items:center; gap:6px;">' +
                          '<input type="number" min="0" max="10" step="0.5" id="inp-speak-' + s.id + '" value="' + sVal + '" oninput="updateRowTotal(\'' + s.id + '\')" class="form-input" style="width:52px; padding:6px 4px; font-weight:800; text-align:center; font-size:0.92rem; border-radius:8px;">' +
                          '<button type="button" title="Open 5-Criteria Speaking Rubric" onclick="openSpeakingRubricModal(\'' + s.id + '\', \'' + checkId + '\')" style="background:#e0e7ff; color:#3730a3; border:1px solid #c7d2fe; border-radius:6px; font-size:0.72rem; font-weight:800; padding:5px 7px; cursor:pointer;">' +
                            '🎯 Rubric' +
                          '</button>' +
                        '</div>' +
                      '</td>' +

                      // Row Total (/40)
                      '<td style="padding:8px 10px; text-align:center;">' +
                        '<span id="cell-total-' + s.id + '" style="font-size:1.05rem; font-weight:900; color:' + (totalVal >= 24 ? '#059669' : '#b45309') + ';">' +
                          (totalVal > 0 ? totalVal : '—') +
                        '</span>' +
                      '</td>' +

                      // Teacher Note
                      '<td style="padding:8px 14px;">' +
                        '<textarea id="inp-note-' + s.id + '" class="form-input" rows="2" style="width:100%; font-size:0.82rem; line-height:1.4; resize:vertical; border-radius:8px; padding:6px 8px;" placeholder="Optional teacher observation...">' + note + '</textarea>' +
                      '</td>' +

                      // Action (Save single)
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

        // Bottom Action Bar
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; padding:10px 0;">' +
          '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="padding:10px 18px; font-weight:700;">' +
            '← Back to Progress Check' +
          '</button>' +

          '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:12px 32px; font-size:1.05rem; font-weight:900; background:#059669; border-color:#047857; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(5,150,105,0.3); border-radius:12px;">' +
            '<span>💾</span> <span>Save All Results</span>' +
          '</button>' +
        '</div>' +

      '</div>';
  }

  // Live Auto-Calculation of Row Total
  window.updateRowTotal = function(studentId) {
    const rEl = document.getElementById('inp-read-' + studentId);
    const lEl = document.getElementById('inp-listen-' + studentId);
    const wEl = document.getElementById('inp-write-' + studentId);
    const sEl = document.getElementById('inp-speak-' + studentId);
    const totalEl = document.getElementById('cell-total-' + studentId);

    const r = rEl ? (parseFloat(rEl.value) || 0) : 0;
    const l = lEl ? (parseFloat(lEl.value) || 0) : 0;
    const w = wEl ? (parseFloat(wEl.value) || 0) : 0;
    const s = sEl ? (parseFloat(sEl.value) || 0) : 0;

    const total = Math.round((r + l + w + s) * 10) / 10;

    if (totalEl) {
      totalEl.textContent = total > 0 ? total : '—';
      totalEl.style.color = total >= 24 ? '#059669' : '#b45309';
    }
  };

  // Helper: Read row data from gradebook DOM
  window.getStudentGradebookRowData = function(studentId) {
    const rEl = document.getElementById('inp-read-' + studentId);
    const lEl = document.getElementById('inp-listen-' + studentId);
    const wEl = document.getElementById('inp-write-' + studentId);
    const sEl = document.getElementById('inp-speak-' + studentId);
    const nEl = document.getElementById('inp-note-' + studentId);

    const rVal = rEl && rEl.value !== '' ? parseFloat(rEl.value) : 0;
    const lVal = lEl && lEl.value !== '' ? parseFloat(lEl.value) : 0;
    const wVal = wEl && wEl.value !== '' ? parseFloat(wEl.value) : 0;
    const sVal = sEl && sEl.value !== '' ? parseFloat(sEl.value) : 0;

    return {
      studentId: studentId,
      scores: {
        reading: { correct: rVal, total: 10 },
        listening: { correct: lVal, total: 10 },
        writing: { correct: wVal, total: 10 },
        speaking: { correct: sVal, total: 10 }
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
  // 4. VIEW CLASS RESULTS VIEW (CLEAN READ-ONLY SUMMARY)
  // =========================================================================

  function renderViewResultsViewHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-gr2-u1';
    const existingSubs = store.getProgressCheckSubmissions ? store.getProgressCheckSubmissions(checkId) : [];
    const bookName = activeCheck ? (activeCheck.bookTitle || 'Global Readings 2') : 'Global Readings 2';
    const unitName = activeCheck ? (activeCheck.unitTitle || 'Unit 1') : 'Unit 1';
    const className = currentClass ? (currentClass.name || 'Grade 3A') : 'Grade 3A';

    return '' +
      '<div style="max-width:1050px; margin:0 auto; padding:0 12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<button type="button" class="btn-sm-secondary" onclick="setProgressCheckViewMode(\'home\')" style="display:inline-flex; align-items:center; gap:6px; margin-bottom:10px; font-weight:700; padding:6px 12px;">' +
              '<span>←</span> <span>Back to Progress Check</span>' +
            '</button>' +
            '<h1 style="font-size:1.55rem; font-weight:900; color:var(--text-main); margin:0 0 4px 0;">' +
              'Class Results Summary — ' + className +
            '</h1>' +
            '<p style="font-size:0.86rem; color:var(--text-muted); margin:0;">' +
              '<strong>' + bookName + ' · ' + unitName + '</strong> — Final recorded 4-skill scores (/40).' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="setProgressCheckViewMode(\'enter\')" style="padding:10px 22px; font-weight:800; background:#d97706; border-color:#b45309; display:inline-flex; align-items:center; gap:8px;">' +
              '<span>✏️</span> <span>Edit Scores in Gradebook</span>' +
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
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">READING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">/ 10</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">LISTENING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">/ 10</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">WRITING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">/ 10</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">SPEAKING<br><span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">/ 10</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">TOTAL<br><span style="font-size:0.72rem; color:var(--color-primary); font-weight:800;">/ 40</span></th>' +
                  '<th style="padding:12px 10px; font-weight:800; text-align:center;">MASTERY</th>' +
                  '<th style="padding:12px 14px; font-weight:800; min-width:200px;">TEACHER NOTE</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                (students.length === 0 ? '<tr><td colspan="8" style="padding:30px; text-align:center; color:var(--text-muted);">No students in class.</td></tr>' : '') +
                students.map(function(s, idx) {
                  const sub = existingSubs.find(function(item) { return item.studentId === s.id; }) || {};
                  const scores = sub.scores || {};
                  const r = scores.reading ? scores.reading.correct : (sub.skillScores && sub.skillScores.reading ? sub.skillScores.reading.correct : '—');
                  const l = scores.listening ? scores.listening.correct : (sub.skillScores && sub.skillScores.listening ? sub.skillScores.listening.correct : '—');
                  const w = scores.writing ? scores.writing.correct : (sub.skillScores && sub.skillScores.writing ? sub.skillScores.writing.correct : '—');
                  const spk = scores.speaking ? scores.speaking.correct : (sub.skillScores && sub.skillScores.speaking ? sub.skillScores.speaking.correct : '—');

                  const rawTotal = sub.rawTotal !== undefined ? sub.rawTotal : (sub.overallScore !== undefined ? Math.round((sub.overallScore / 100) * 40) : '—');
                  const mastery = sub.mastery || (sub.overallScore >= 85 ? 'Strong' : sub.overallScore >= 70 ? 'Secure' : sub.overallScore >= 50 ? 'Developing' : 'Not Assessed');
                  const note = sub.notes || sub.teacherComment || '—';

                  const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(s.id, { size: 26, animated: false }) : '👾';
                  const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';

                  const badgeColor = mastery === 'Strong' ? '#dcfce7; color:#166534;' : mastery === 'Secure' ? '#dbeafe; color:#1e40af;' : mastery === 'Developing' ? '#fef3c7; color:#92400e;' : '#f1f5f9; color:#475569;';

                  return '' +
                    '<tr style="border-bottom:1px solid var(--border-light); background:' + rowBg + ';">' +
                      '<td style="padding:10px 14px;">' +
                        '<div style="display:flex; align-items:center; gap:8px;">' +
                          '<div style="width:26px; height:26px;">' + monsterSvg + '</div>' +
                          '<strong style="color:var(--text-main);">' + s.firstName + ' ' + s.lastName + '</strong>' +
                        '</div>' +
                      '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + r + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + l + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + w + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:700;">' + spk + '</td>' +
                      '<td style="padding:10px; text-align:center; font-weight:900; font-size:0.95rem; color:#0f172a;">' + (rawTotal !== '—' ? rawTotal + ' / 40' : '—') + '</td>' +
                      '<td style="padding:10px; text-align:center;">' +
                        '<span style="padding:3px 8px; border-radius:12px; font-weight:800; font-size:0.75rem; background:' + badgeColor + '">' + mastery + '</span>' +
                      '</td>' +
                      '<td style="padding:10px 14px; font-size:0.8rem; color:var(--text-muted);">' + note + '</td>' +
                    '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 5. INTERACTIVE SPEAKING RUBRIC MODAL / DRAWER
  // =========================================================================

  window.openSpeakingRubricModal = function(studentId, checkId) {
    activeRubricStudentId = studentId;
    activeRubricCheckId = checkId || selectedProgressCheckId;

    const store = window.schoolStore || window.store;
    if (!store) return;

    const student = store.getStudent(studentId);
    const check = store.getProgressCheck(activeRubricCheckId);
    if (!student || !check) return;

    const isGrade4 = check.targetGrade === 'Grade 4';
    const criteria = (check.speakingDetails && check.speakingDetails.criteria) || [
      { name: "Answers questions", desc: "Understands and responds to teacher prompts", max: 4 },
      { name: "Uses simple sentences", desc: "Forms basic sentences (I like..., It is...)", max: 4 },
      { name: "Vocabulary", desc: "Uses Unit 1 target words correctly", max: 4 },
      { name: "Pronunciation", desc: "Clarity of sounds and intelligibility", max: 4 },
      { name: "Confidence", desc: "Willingness to speak and engage", max: 4 }
    ];

    // Check existing speaking score if any
    const existingInput = document.getElementById('inp-speak-' + studentId);
    const existingVal = existingInput ? parseFloat(existingInput.value) : 0;
    const defaultCriterionScore = existingVal > 0 ? Math.round(existingVal * 2 / 5) : 3;

    let modal = document.getElementById('modal-speaking-rubric');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-speaking-rubric';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = '' +
      '<div class="modal-dialog" style="max-width:680px; width:94vw; border-radius:18px; padding:0; overflow:hidden;">' +
        // Header
        '<div style="background:#4f46e5; color:#fff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">' +
          '<div>' +
            '<h2 style="font-size:1.25rem; font-weight:900; margin:0 0 4px 0; color:#fff;">🎯 Speaking Assessment Rubric</h2>' +
            '<div style="font-size:0.84rem; color:#e0e7ff;">Evaluating <strong>' + student.firstName + ' ' + student.lastName + '</strong> · ' + (isGrade4 ? 'Grade 4 (A1+)' : 'Grade 3 (A1)') + '</div>' +
          '</div>' +
          '<button type="button" class="modal-close-btn" onclick="closeModal(\'modal-speaking-rubric\')" style="color:#fff; font-size:1.2rem; background:transparent; border:none; cursor:pointer;">✕</button>' +
        '</div>' +

        // Rubric Body
        '<div style="padding:22px 24px; max-height:70vh; overflow-y:auto;">' +
          '<div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:10px 14px; margin-bottom:18px; font-size:0.84rem; color:#1e40af; font-weight:700;">' +
            'ℹ️ Score each of the 5 criteria from 0 to 4. Total Raw (out of 20) ÷ 2 = Final Speaking Score (/10).' +
          '</div>' +

          criteria.map((crit, idx) => '' +
            '<div style="background:#fafafa; border:1px solid var(--border-light); border-radius:12px; padding:14px 16px; margin-bottom:12px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                '<strong style="color:var(--text-main); font-size:0.92rem;">' + (idx + 1) + '. ' + crit.name + '</strong>' +
                '<span id="crit-val-badge-' + idx + '" style="font-weight:900; font-size:0.85rem; color:#4f46e5; background:#e0e7ff; padding:2px 8px; border-radius:10px;">' + defaultCriterionScore + ' / 4</span>' +
              '</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">' + crit.desc + '</div>' +
              '<div style="display:flex; gap:8px;">' +
                [0, 1, 2, 3, 4].map(pt => '' +
                  '<button type="button" id="crit-btn-' + idx + '-' + pt + '" onclick="selectRubricPoint(' + idx + ', ' + pt + ')" style="flex:1; padding:8px 0; border-radius:8px; font-weight:800; font-size:0.86rem; cursor:pointer; transition:all 0.15s ease; border:' + (pt === defaultCriterionScore ? '2px solid #4f46e5; background:#4f46e5; color:#fff;' : '1.5px solid #cbd5e1; background:#fff; color:#475569;') + '">' +
                    pt +
                  '</button>'
                ).join('') +
              '</div>' +
            '</div>'
          ).join('') +

          // Score Summary & Manual Override Box
          '<div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:14px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; margin-top:18px;">' +
            '<div>' +
              '<div style="font-size:0.78rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Calculated Score:</div>' +
              '<div style="font-size:1.3rem; font-weight:900; color:var(--text-main);"><span id="rubric-raw-total">' + (defaultCriterionScore * 5) + '</span> / 20 raw &rarr; <span id="rubric-scaled-score" style="color:#4f46e5;">' + (defaultCriterionScore * 5 / 2) + '</span> / 10</div>' +
            '</div>' +

            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<label style="font-size:0.8rem; font-weight:800; color:var(--text-main);">Teacher Override (/10):</label>' +
              '<input type="number" min="0" max="10" step="0.5" id="rubric-override-input" value="' + (defaultCriterionScore * 5 / 2) + '" style="width:60px; padding:6px; font-weight:900; text-align:center; font-size:0.95rem; border-radius:8px; border:2px solid #4f46e5;">' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Footer
        '<div style="background:var(--bg-canvas); padding:14px 24px; border-top:1px solid var(--border-light); display:flex; justify-content:flex-end; gap:10px;">' +
          '<button type="button" class="btn-sm-secondary" onclick="closeModal(\'modal-speaking-rubric\')" style="padding:8px 16px;">Cancel</button>' +
          '<button type="button" class="btn-primary-action" onclick="applySpeakingRubricScore()" style="padding:8px 22px; font-weight:800; background:#4f46e5; border-color:#4338ca;">Apply to Gradebook</button>' +
        '</div>' +
      '</div>';

    window.openModal('modal-speaking-rubric');
  };

  // Rubric Point Selection Helper
  const rubricScores = [3, 3, 3, 3, 3];
  window.selectRubricPoint = function(critIdx, pt) {
    rubricScores[critIdx] = pt;

    // Update buttons
    for (let i = 0; i <= 4; i++) {
      const btn = document.getElementById('crit-btn-' + critIdx + '-' + i);
      if (btn) {
        if (i === pt) {
          btn.style.borderColor = '#4f46e5';
          btn.style.backgroundColor = '#4f46e5';
          btn.style.color = '#fff';
        } else {
          btn.style.borderColor = '#cbd5e1';
          btn.style.backgroundColor = '#fff';
          btn.style.color = '#475569';
        }
      }
    }

    const badge = document.getElementById('crit-val-badge-' + critIdx);
    if (badge) badge.textContent = pt + ' / 4';

    const rawTotal = rubricScores.reduce((a, b) => a + b, 0);
    const scaled = Math.round((rawTotal / 2) * 10) / 10;

    const rawEl = document.getElementById('rubric-raw-total');
    const scaledEl = document.getElementById('rubric-scaled-score');
    const overrideEl = document.getElementById('rubric-override-input');

    if (rawEl) rawEl.textContent = rawTotal;
    if (scaledEl) scaledEl.textContent = scaled;
    if (overrideEl) overrideEl.value = scaled;
  };

  window.applySpeakingRubricScore = function() {
    if (!activeRubricStudentId) return;
    const overrideEl = document.getElementById('rubric-override-input');
    const finalScore = overrideEl ? parseFloat(overrideEl.value) : 8;

    const inp = document.getElementById('inp-speak-' + activeRubricStudentId);
    if (inp) {
      inp.value = finalScore;
      updateRowTotal(activeRubricStudentId);
    }

    window.closeModal('modal-speaking-rubric');
    if (window.showToast) window.showToast('✓ Applied speaking score (' + finalScore + '/10) to gradebook', 'success');
  };

  // =========================================================================
  // 6. PRINTABLE PROGRESS CHECK (STUDENT WORKSHEET & TEACHER SHEET)
  // Exact match to media_1788697610637.jpg
  // =========================================================================

  window.openPrintableProgressCheck = function(checkId, showTeacherSheet) {
    if (!checkId) checkId = selectedProgressCheckId || 'progress-check-gr2-u1';
    printableCurrentCheckId = checkId;
    printableShowTeacherSheet = (showTeacherSheet !== undefined) ? showTeacherSheet : false;

    const store = window.schoolStore || window.store;
    if (!store) return;

    const check = store.getProgressCheck(checkId);
    if (!check) return;

    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass ? store.getStudentsByClass(activeClass.id) : [];

    let body = document.getElementById('printable-progress-check-content');
    if (!body) {
      // Create modal container if not already in index.html
      let modal = document.getElementById('modal-printable-progress-check');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-printable-progress-check';
        modal.className = 'modal-overlay';
        modal.innerHTML = '<div class="modal-dialog" style="max-width:960px; width:96vw; max-height:92vh; display:flex; flex-direction:column; padding:0; border-radius:16px; overflow:hidden;"><div id="printable-progress-check-content" style="overflow-y:auto; flex:1; background:#f8fafc;"></div></div>';
        document.body.appendChild(modal);
      }
      body = document.getElementById('printable-progress-check-content');
    }

    const isGrade4 = check.targetGrade === 'Grade 4';
    let html = '';

    // Action Toolbar at the Top of Modal
    html += '' +
      '<div style="background:#0f172a; color:#fff; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; position:sticky; top:0; z-index:10;">' +
        '<div style="display:flex; align-items:center; gap:12px;">' +
          '<span style="font-size:1.3rem;">🖨️</span>' +
          '<div>' +
            '<strong style="font-size:0.95rem; color:#fff;">' + (printableShowTeacherSheet ? 'Teacher Assessment Sheet & Answer Key' : 'Student Printable Progress Check') + '</strong>' +
            '<div style="font-size:0.75rem; color:#94a3b8;">' + (check.bookTitle || 'Global Readings') + ' · ' + (check.unitTitle || 'Unit 1') + ' · ' + (isGrade4 ? 'Grade 4 (A1+)' : 'Grade 3 (A1)') + '</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:8px;">' +
          // Switch between Student Worksheet and Teacher Sheet
          '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + checkId + '\', ' + (!printableShowTeacherSheet) + ')" style="font-size:0.78rem; font-weight:800; background:#334155; color:#fff; border-color:#475569; padding:6px 12px;">' +
            (printableShowTeacherSheet ? '📄 Switch to Student Test Sheet' : '🗝️ Switch to Teacher Answer Sheet') +
          '</button>' +

          // Trigger Print
          '<button type="button" class="btn-primary-action" onclick="window.print()" style="font-size:0.82rem; font-weight:800; padding:6px 16px; background:#059669; border-color:#047857;">' +
            '🖨️ Print Document' +
          '</button>' +

          '<button type="button" class="modal-close-btn" onclick="closeModal(\'modal-printable-progress-check\')" style="color:#fff; font-size:1.1rem; background:transparent; border:none; cursor:pointer; padding:4px 8px;">✕</button>' +
        '</div>' +
      '</div>';

    // RENDER BODY: EITHER STUDENT WORKSHEET OR TEACHER SHEET
    if (!printableShowTeacherSheet) {
      html += renderStudentWorksheetPrintableHTML(check, isGrade4);
    } else {
      html += renderTeacherSheetPrintableHTML(check, isGrade4, students, store);
    }

    body.innerHTML = html;
    window.openModal('modal-printable-progress-check');
  };

  // -------------------------------------------------------------------------
  // STUDENT PRINTABLE WORKSHEET
  // -------------------------------------------------------------------------
  function renderStudentWorksheetPrintableHTML(check, isGrade4) {
    const bookTitle = check.bookTitle || (isGrade4 ? 'Global Readings 3' : 'Global Readings 2');
    const unitTitle = check.unitTitle || (isGrade4 ? 'Unit 1: I Love Reading' : 'Unit 1: What Does It Do?');
    const cefrTarget = isGrade4 ? 'A1+' : 'A1';

    return '' +
      '<div class="printable-a4-sheet" style="font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; color:#111; max-width:820px; margin:20px auto; background:#fff; padding:32px 36px; box-shadow:0 4px 20px rgba(0,0,0,0.08); border-radius:8px; line-height:1.5;">' +

        // Header Block
        '<div style="border-bottom:2.5px solid #000; padding-bottom:14px; margin-bottom:18px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
            '<div>' +
              '<h1 style="font-size:1.55rem; font-weight:900; margin:0 0 4px 0; text-transform:uppercase; letter-spacing:-0.01em;">English Adventure Progress Check</h1>' +
              '<div style="font-size:0.95rem; font-weight:800; color:#1e293b;">' + bookTitle + ' · ' + unitTitle + '</div>' +
              '<div style="font-size:0.8rem; color:#475569; margin-top:2px;">4-Week Timeline Assessment · Four Skills (Total: 40 Points)</div>' +
            '</div>' +
            '<div style="text-align:right; font-size:0.82rem; font-weight:800;">' +
              '<div style="background:#0f172a; color:#fff; padding:4px 10px; border-radius:6px; display:inline-block; margin-bottom:4px;">CEFR Target: ' + cefrTarget + '</div>' +
              '<div>Time: 45 Minutes</div>' +
            '</div>' +
          '</div>' +

          // Student Identification Fields
          '<div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:14px; margin-top:16px; font-size:0.86rem; font-weight:800;">' +
            '<div style="border-bottom:1.5px solid #475569; padding-bottom:4px;">Student Name: __________________________________</div>' +
            '<div style="border-bottom:1.5px solid #475569; padding-bottom:4px;">Class: ______________</div>' +
            '<div style="border-bottom:1.5px solid #475569; padding-bottom:4px;">Date: ______________</div>' +
          '</div>' +
        '</div>' +

        // ==========================================
        // PART A — READING COMPREHENSION (/10)
        // ==========================================
        '<div style="margin-bottom:22px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #000; padding-bottom:4px; margin-bottom:10px;">' +
            '<h2 style="font-size:1.08rem; font-weight:900; margin:0; text-transform:uppercase;">Part A — Reading Comprehension (/10)</h2>' +
            '<span style="font-size:0.8rem; font-weight:800; color:#475569;">10 Points</span>' +
          '</div>' +

          (!isGrade4 ?
            // Grade 3 Reading (The After-School Inventor)
            '<div>' +
              '<div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:12px; font-size:0.88rem; line-height:1.6;">' +
                '<strong style="font-size:0.95rem; color:#0f172a;">The After-School Inventor</strong><br>' +
                'Tom goes to his room every day after school. He loves making things. He uses cardboard boxes, bottle caps, plastic cups, and blue paint. Last week, Tom made a robot. It is blue with two shiny lights. The robot cannot fly, but it can move across the floor and carry small pencils. Tom is happy because his invention really works!' +
              '</div>' +

              '<div style="font-size:0.84rem; display:flex; flex-direction:column; gap:8px;">' +
                '<div><strong>1. What does Tom make?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) a car &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) a robot &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) a plane</span>' +
                '</div>' +
                '<div><strong>2. What color is the robot?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) red &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) blue &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) yellow</span>' +
                '</div>' +
                '<div><strong>3. What can the robot do?</strong> (1.5 pts)<br>' +
                  '<span style="margin-left:14px;">☐ a) fly in the air &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) sing songs &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) move and carry things</span>' +
                '</div>' +
                '<div><strong>4. When does Tom work on his inventions?</strong> (1.5 pts)<br>' +
                  '<span style="margin-left:14px;">☐ a) before school &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) after school &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) on Sundays</span>' +
                '</div>' +
                '<div><strong>5. True or False:</strong> Tom\'s robot works. (1 pt) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>' +
                '<div><strong>6. Put the story events in order (1, 2, 3):</strong> (2 pts)<br>' +
                  '<span style="margin-left:14px;">[ &nbsp;&nbsp;&nbsp;&nbsp; ] Tom tests the robot in his room. &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp;&nbsp;&nbsp; ] Tom collects materials. &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp;&nbsp;&nbsp; ] Tom paints it blue.</span>' +
                '</div>' +
                '<div><strong>7. Where does Tom go after school?</strong> (1 pt)<br>' +
                  '<span style="border-bottom:1px solid #94a3b8; display:inline-block; width:90%; height:18px;"></span>' +
                '</div>' +
                '<div><strong>8. Why is Tom happy at the end?</strong> (1 pt)<br>' +
                  '<span style="border-bottom:1px solid #94a3b8; display:inline-block; width:90%; height:18px;"></span>' +
                '</div>' +
              '</div>' +
            '</div>'
          :
            // Grade 4 Reading (The Inventor\'s Helper)
            '<div>' +
              '<div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:12px; font-size:0.88rem; line-height:1.6;">' +
                '<strong style="font-size:0.95rem; color:#0f172a;">The Inventor\'s Helper</strong><br>' +
                'Sara is a young inventor who loves reading books about technology. Last month, she designed a helper robot for her home. The robot is white with smooth wheels and a small sensor on top. Sara programmed it to tidy her room by picking up books and putting them on the shelves. Sara says reading books gave her the best ideas for her machine. Now, the helper cleans her study area every day so she has more time to read!' +
              '</div>' +

              '<div style="font-size:0.84rem; display:flex; flex-direction:column; gap:8px;">' +
                '<div><strong>1. What did Sara build?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) a robot &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) a clock &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) a radio</span>' +
                '</div>' +
                '<div><strong>2. What is the robot\'s main task?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) clean room &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) cook dinner &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) drive a car</span>' +
                '</div>' +
                '<div><strong>3. What color is the machine?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) black &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) white &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) yellow</span>' +
                '</div>' +
                '<div><strong>4. When did Sara finish building it?</strong> (1 pt)<br>' +
                  '<span style="margin-left:14px;">☐ a) yesterday &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) last month &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) last year</span>' +
                '</div>' +
                '<div><strong>5. How does the robot help Sara?</strong> (1.5 pts)<br>' +
                  '<span style="margin-left:14px;">☐ a) it plays music &nbsp;&nbsp;&nbsp;&nbsp; ☐ b) helps her every day &nbsp;&nbsp;&nbsp;&nbsp; ☐ c) it sleeps</span>' +
                '</div>' +
                '<div><strong>6. Why does Sara love reading books?</strong> (1.5 pts)<br>' +
                  '<span style="border-bottom:1px solid #94a3b8; display:inline-block; width:90%; height:18px;"></span>' +
                '</div>' +
                '<div><strong>7. What does the robot have on top?</strong> (1.5 pts)<br>' +
                  '<span style="border-bottom:1px solid #94a3b8; display:inline-block; width:90%; height:18px;"></span>' +
                '</div>' +
                '<div><strong>8. True or False:</strong> Sara has more time to read now. (1.5 pts) &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>' +
              '</div>' +
            '</div>'
          ) +
        '</div>' +

        // ==========================================
        // PART B — LISTENING COMPREHENSION (/10)
        // Authentic visual items (Red Bag, Pencil, Book, Chair with Star Target)
        // NO teacher script printed on student sheet!
        // ==========================================
        '<div style="margin-bottom:22px; page-break-before:auto;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #000; padding-bottom:4px; margin-bottom:10px;">' +
            '<h2 style="font-size:1.08rem; font-weight:900; margin:0; text-transform:uppercase;">Part B — Listening Comprehension (/10)</h2>' +
            '<span style="font-size:0.8rem; font-weight:800; color:#475569;">10 Points</span>' +
          '</div>' +

          '<p style="font-size:0.82rem; font-style:italic; color:#475569; margin:0 0 10px 0;">' +
            'Listen carefully as your teacher speaks. Follow the instructions and circle the correct picture or follow directions.' +
          '</p>' +

          // Section 1: Choose Picture (Items 1, 2, 3)
          '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">Section 1 — Listen and circle the correct picture:</div>' +
          '<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:16px;">' +

            // Item 1: Bags
            '<div style="border:1.5px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">' +
              '<div style="font-size:0.75rem; font-weight:800; color:#475569; margin-bottom:4px;">1. Bags</div>' +
              '<div style="display:flex; justify-content:space-around; align-items:center;">' +
                '<div>' +
                  renderVectorSVG('red-bag', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">a) red bag</div>' +
                '</div>' +
                '<div>' +
                  renderVectorSVG('blue-bag', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">b) blue bag</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Item 2: Actions
            '<div style="border:1.5px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">' +
              '<div style="font-size:0.75rem; font-weight:800; color:#475569; margin-bottom:4px;">2. Activity</div>' +
              '<div style="display:flex; justify-content:space-around; align-items:center;">' +
                '<div>' +
                  renderVectorSVG('girl-reading', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">a) girl reading</div>' +
                '</div>' +
                '<div>' +
                  renderVectorSVG('boy-playing', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">b) boy playing</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Item 3: School Object
            '<div style="border:1.5px solid #cbd5e1; border-radius:8px; padding:8px; text-align:center;">' +
              '<div style="font-size:0.75rem; font-weight:800; color:#475569; margin-bottom:4px;">3. Tool</div>' +
              '<div style="display:flex; justify-content:space-around; align-items:center;">' +
                '<div>' +
                  renderVectorSVG('pencil', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">a) pencil</div>' +
                '</div>' +
                '<div>' +
                  renderVectorSVG('camera', 46) +
                  '<div style="font-size:0.72rem; font-weight:700;">b) camera</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

          '</div>' +

          // Section 2: Visual Classroom Scene with Chair, Star Target, Desk, Pencil
          '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">Section 2 — Listen to your teacher\'s instructions and draw or circle in the scene below:</div>' +
          '<div style="border:2px solid #0f172a; border-radius:10px; padding:14px; background:#fff; margin-bottom:10px; position:relative; min-height:180px; display:flex; justify-content:space-around; align-items:flex-end;">' +

            // Chair with clear Star Target Area
            '<div style="text-align:center; position:relative;">' +
              '<div style="border:1.5px dashed #94a3b8; border-radius:6px; padding:4px 8px; font-size:0.68rem; color:#64748b; margin-bottom:4px;">[ Target Area ]</div>' +
              renderVectorSVG('chair', 90) +
              '<div style="font-size:0.75rem; font-weight:800; margin-top:4px;">Wooden Chair</div>' +
            '</div>' +

            // Desk with Book and Pencil
            '<div style="text-align:center; position:relative;">' +
              '<div style="display:flex; justify-content:center; gap:12px; align-items:flex-end; margin-bottom:4px;">' +
                renderVectorSVG('book', 44) +
                renderVectorSVG('pencil-horizontal', 48) +
              '</div>' +
              renderVectorSVG('desk', 120) +
              '<div style="font-size:0.75rem; font-weight:800; margin-top:4px;">Classroom Table</div>' +
            '</div>' +

            // Red Bag and Dog / Balls
            '<div style="text-align:center;">' +
              renderVectorSVG('red-bag', 72) +
              '<div style="font-size:0.75rem; font-weight:800; margin-top:4px;">School Backpack</div>' +
            '</div>' +

          '</div>' +
        '</div>' +

        // ==========================================
        // PART C — WRITING (/10)
        // ==========================================
        '<div style="margin-bottom:22px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #000; padding-bottom:4px; margin-bottom:10px;">' +
            '<h2 style="font-size:1.08rem; font-weight:900; margin:0; text-transform:uppercase;">Part C — Writing (/10)</h2>' +
            '<span style="font-size:0.8rem; font-weight:800; color:#475569;">10 Points</span>' +
          '</div>' +

          (!isGrade4 ?
            // Grade 3 Writing
            '<div>' +
              '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">1. Complete the sentences about yourself: (5 pts)</div>' +
              '<div style="font-size:0.84rem; line-height:2.0; margin-bottom:12px;">' +
                '1. My name is ___________________________________________________________________.<br>' +
                '2. I am ______________________________________________________________ years old.<br>' +
                '3. I like _______________________________________________________________________.<br>' +
                '4. I can _______________________________________________________________________.<br>' +
                '5. I have got a _________________________________________________________________.' +
              '</div>' +

              '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">2. Write 3 sentences about your favorite invention or something you want to make: (5 pts)</div>' +
              '<div style="border:1.5px solid #cbd5e1; height:80px; border-radius:6px; background:repeating-linear-gradient(transparent, transparent 24px, #e2e8f0 25px); padding:6px 12px;"></div>' +
            '</div>'
          :
            // Grade 4 Writing
            '<div>' +
              '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">Write 5–6 sentences about an invention that helps at home or school: (10 pts)</div>' +
              '<div style="background:#f8fafc; border:1px dashed #94a3b8; border-radius:6px; padding:6px 10px; font-size:0.78rem; font-weight:700; color:#475569; margin-bottom:8px;">' +
                'Word Bank: [ invention · machine · helpful · clean · robot · sensors · solve · creative ]' +
              '</div>' +
              '<div style="border:1.5px solid #cbd5e1; height:120px; border-radius:6px; background:repeating-linear-gradient(transparent, transparent 24px, #e2e8f0 25px); padding:6px 12px;"></div>' +
            '</div>'
          ) +
        '</div>' +

        // ==========================================
        // PART D — SPEAKING & OBSERVATION (/10)
        // ==========================================
        '<div style="border-top:2px dashed #000; padding-top:12px; margin-top:16px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
            '<h2 style="font-size:1rem; font-weight:900; margin:0; text-transform:uppercase;">Part D — Speaking Assessment (Teacher Only)</h2>' +
            '<div style="font-size:0.88rem; font-weight:900; border:1.5px solid #000; padding:2px 10px; border-radius:4px;">Score: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 10</div>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; font-size:0.75rem; text-align:center;">' +
            '<div style="border:1px solid #cbd5e1; padding:4px; border-radius:4px;"><strong>Q &amp; A:</strong><br>0 1 2 3 4</div>' +
            '<div style="border:1px solid #cbd5e1; padding:4px; border-radius:4px;"><strong>Sentences:</strong><br>0 1 2 3 4</div>' +
            '<div style="border:1px solid #cbd5e1; padding:4px; border-radius:4px;"><strong>Vocabulary:</strong><br>0 1 2 3 4</div>' +
            '<div style="border:1px solid #cbd5e1; padding:4px; border-radius:4px;"><strong>Pronunciation:</strong><br>0 1 2 3 4</div>' +
            '<div style="border:1px solid #cbd5e1; padding:4px; border-radius:4px;"><strong>Confidence:</strong><br>0 1 2 3 4</div>' +
          '</div>' +
          '<div style="margin-top:8px; font-size:0.78rem;">Teacher Comments: ____________________________________________________________________________________</div>' +
        '</div>' +

      '</div>';
  }

  // -------------------------------------------------------------------------
  // TEACHER PRINTABLE SHEET (Exact match to media_1788697610637.jpg)
  // -------------------------------------------------------------------------
  function renderTeacherSheetPrintableHTML(check, isGrade4, students, store) {
    const bookTitle = check.bookTitle || (isGrade4 ? 'Global Readings 3' : 'Global Readings 2');
    const unitTitle = check.unitTitle || (isGrade4 ? 'Unit 1: I Love Reading' : 'Unit 1: What Does It Do?');
    const cefrTarget = isGrade4 ? 'A1+' : 'A1';

    return '' +
      '<div class="printable-a4-sheet" style="font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; color:#111; max-width:860px; margin:20px auto; background:#fff; padding:32px 36px; box-shadow:0 4px 20px rgba(0,0,0,0.08); border-radius:8px; line-height:1.5;">' +

        // Header Block
        '<div style="border-bottom:2.5px solid #000; padding-bottom:12px; margin-bottom:18px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
            '<div>' +
              '<h1 style="font-size:1.5rem; font-weight:900; margin:0 0 4px 0; text-transform:uppercase;">🗝️ Teacher Assessment Sheet &amp; Answer Key</h1>' +
              '<div style="font-size:0.95rem; font-weight:800; color:#1e293b;">' + (isGrade4 ? 'Grade 4 (A1+) · Global Readings 3' : 'Grade 3 (A1) · Global Readings 2') + ' · ' + unitTitle + '</div>' +
              '<div style="font-size:0.8rem; color:#475569;">Teacher Instructions · Spoken Script · Marking Rubrics · Class Results</div>' +
            '</div>' +
            '<div style="text-align:right; font-size:0.82rem; font-weight:800;">' +
              '<div style="background:#4f46e5; color:#fff; padding:4px 10px; border-radius:6px; display:inline-block; margin-bottom:4px;">CEFR Target: ' + cefrTarget + '</div>' +
              '<div>Time: 45 Mins</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // SECTION 1: READING ANSWER KEY (/10)
        '<div style="margin-bottom:20px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:14px 18px;">' +
          '<h2 style="font-size:1.05rem; font-weight:900; color:#0f172a; margin:0 0 8px 0; text-transform:uppercase; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">' +
            '1. Reading Answer Key (/10)' +
          '</h2>' +

          (!isGrade4 ?
            '<div style="font-size:0.84rem; line-height:1.7; display:grid; grid-template-columns:1fr 1fr; gap:6px 16px;">' +
              '<div><strong>1.</strong> b robot (1 pt)</div>' +
              '<div><strong>2.</strong> b blue (1 pt)</div>' +
              '<div><strong>3.</strong> c move and carry things (1.5 pts)</div>' +
              '<div><strong>4.</strong> b after school (1.5 pts)</div>' +
              '<div><strong>5.</strong> True (1 pt)</div>' +
              '<div><strong>6.</strong> Order: 2 &rarr; 1 &rarr; 3 (2 pts)</div>' +
              '<div><strong>7.</strong> Tom goes to his room (1 pt)</div>' +
              '<div><strong>8.</strong> He is happy because his robot works (1 pt)</div>' +
            '</div>'
          :
            '<div style="font-size:0.84rem; line-height:1.7; display:grid; grid-template-columns:1fr 1fr; gap:6px 16px;">' +
              '<div><strong>1.</strong> a robot (1 pt)</div>' +
              '<div><strong>2.</strong> a clean room (1 pt)</div>' +
              '<div><strong>3.</strong> b white (1 pt)</div>' +
              '<div><strong>4.</strong> b last month (1 pt)</div>' +
              '<div><strong>5.</strong> b helps her every day (1.5 pts)</div>' +
              '<div><strong>6.</strong> Books gave her ideas (1.5 pts)</div>' +
              '<div><strong>7.</strong> A small sensor on top (1.5 pts)</div>' +
              '<div><strong>8.</strong> True (1.5 pts)</div>' +
            '</div>'
          ) +
        '</div>' +

        // SECTION 2: LISTENING TEACHER SPOKEN SCRIPT & ANSWER KEY (/10)
        '<div style="margin-bottom:20px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:14px 18px;">' +
          '<h2 style="font-size:1.05rem; font-weight:900; color:#1e40af; margin:0 0 8px 0; text-transform:uppercase; border-bottom:1px solid #bfdbfe; padding-bottom:4px;">' +
            '2. Listening Spoken Script &amp; Instructions (/10)' +
          '</h2>' +
          '<p style="font-size:0.78rem; font-style:italic; color:#1e3a8a; margin:0 0 8px 0;">' +
            'Speak clearly at a moderate pace. Repeat each prompt twice.' +
          '</p>' +

          (!isGrade4 ?
            '<div style="font-size:0.84rem; line-height:1.6; display:flex; flex-direction:column; gap:8px;">' +
              '<div><strong style="color:#1e40af;">Part A — Teacher Spoken Prompts:</strong>' +
                '<ul style="margin:4px 0 0 16px; padding:0;">' +
                  '<li><strong>1.</strong> <em>"Number 1: Look at the bags. Listen and circle: The red bag is on the desk."</em> &rarr; <strong>Key: a red bag</strong> (1.5 pts)</li>' +
                  '<li><strong>2.</strong> <em>"Number 2: Look at the pictures. Listen and circle: The girl is reading her favorite book."</em> &rarr; <strong>Key: b girl reading</strong> (1.5 pts)</li>' +
                  '<li><strong>3.</strong> <em>"Number 3: Look at the school objects. Listen and circle: I have got a yellow pencil."</em> &rarr; <strong>Key: c pencil</strong> (1.5 pts)</li>' +
                '</ul>' +
              '</div>' +
              '<div><strong style="color:#1e40af;">Part B — Spoken Classroom Directions:</strong>' +
                '<ul style="margin:4px 0 0 16px; padding:0;">' +
                  '<li><strong>4.</strong> <em>"Look at the classroom scene. Put the pencil next to the book."</em> &rarr; <strong>Key: Pencil placed/drawn next to book</strong> (1.5 pts)</li>' +
                  '<li><strong>5.</strong> <em>"Find the red bag. Circle the red bag."</em> &rarr; <strong>Key: Red bag circled</strong> (2 pts)</li>' +
                  '<li><strong>6.</strong> <em>"Look at the chair. Draw a star above the chair."</em> &rarr; <strong>Key: Star drawn above chair</strong> (2 pts)</li>' +
                '</ul>' +
              '</div>' +
            '</div>'
          :
            '<div style="font-size:0.84rem; line-height:1.6; display:flex; flex-direction:column; gap:8px;">' +
              '<div><strong style="color:#1e40af;">Part A — Teacher Spoken Prompts:</strong>' +
                '<ul style="margin:4px 0 0 16px; padding:0;">' +
                  '<li><strong>1.</strong> <em>"Number 1: The boy is riding his new blue bicycle to school."</em> &rarr; <strong>Key: a bicycle</strong> (1.5 pts)</li>' +
                  '<li><strong>2.</strong> <em>"Number 2: Look at the chair. There is a sleeping cat on the chair."</em> &rarr; <strong>Key: b cat on chair</strong> (1.5 pts)</li>' +
                  '<li><strong>3.</strong> <em>"Number 3: Maya uses a camera to take photos of nature."</em> &rarr; <strong>Key: c camera</strong> (1.5 pts)</li>' +
                '</ul>' +
              '</div>' +
              '<div><strong style="color:#1e40af;">Part B — Multi-Step Directions:</strong>' +
                '<ul style="margin:4px 0 0 16px; padding:0;">' +
                  '<li><strong>4.</strong> <em>"Draw a book on the table."</em> (1.1 pts)</li>' +
                  '<li><strong>5.</strong> <em>"Find the dog. Circle the dog."</em> (1.1 pts)</li>' +
                  '<li><strong>6.</strong> <em>"Draw a pen under the chair."</em> (1.1 pts)</li>' +
                  '<li><strong>7.</strong> <em>"Draw a star next to the window."</em> (1.1 pts)</li>' +
                  '<li><strong>8.</strong> <em>"Look at the three balls on the floor. Circle the biggest ball."</em> (1.1 pts)</li>' +
                '</ul>' +
              '</div>' +
            '</div>'
          ) +
        '</div>' +

        // SECTION 3: WRITING GUIDANCE & RUBRIC (/10)
        '<div style="margin-bottom:20px; background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:10px; padding:14px 18px;">' +
          '<h2 style="font-size:1.05rem; font-weight:900; color:#166534; margin:0 0 8px 0; text-transform:uppercase; border-bottom:1px solid #bbf7d0; padding-bottom:4px;">' +
            '3. Writing Guidance &amp; Rubric (/10)' +
          '</h2>' +
          (!isGrade4 ?
            '<div style="font-size:0.84rem; line-height:1.6;">' +
              '<div><strong>Part A (5 pts):</strong> 1 pt per completed sentence (name, age, like, can, have got). Accept minor spelling slips if phonetically clear.</div>' +
              '<div><strong>Part B (5 pts):</strong> 3 sentences about an invention. 5 pts: 3 complete sentences, proper capitalization & periods. 3-4 pts: 2 sentences. 1-2 pts: isolated words.</div>' +
            '</div>'
          :
            '<div style="font-size:0.84rem; line-height:1.6;">' +
              '<div><strong>Paragraph (10 pts):</strong> 5-6 connected sentences about an invention. 9-10 pts: 5+ sentences, connective words (and, but, because), unit vocabulary. 7-8 pts: 4-5 simple sentences. 4-6 pts: 2-3 sentences. 1-3 pts: fragmented phrases.</div>' +
            '</div>'
          ) +
        '</div>' +

        // SECTION 4: SPEAKING RUBRIC (/10)
        '<div style="margin-bottom:20px; background:#fef3c7; border:1.5px solid #fde68a; border-radius:10px; padding:14px 18px;">' +
          '<h2 style="font-size:1.05rem; font-weight:900; color:#92400e; margin:0 0 8px 0; text-transform:uppercase; border-bottom:1px solid #fde68a; padding-bottom:4px;">' +
            '4. Speaking Rubric (/10)' +
          '</h2>' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left; margin-bottom:8px;">' +
            '<thead>' +
              '<tr style="border-bottom:1.5px solid #d97706; color:#78350f;">' +
                '<th style="padding:4px 8px;">Criteria</th>' +
                '<th style="padding:4px 8px; text-align:center;">0 - No Attempt</th>' +
                '<th style="padding:4px 8px; text-align:center;">1 - Beginning</th>' +
                '<th style="padding:4px 8px; text-align:center;">2 - Developing</th>' +
                '<th style="padding:4px 8px; text-align:center;">3 - Secure</th>' +
                '<th style="padding:4px 8px; text-align:center;">4 - Strong</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (!isGrade4 ?
                '<tr><td style="padding:4px 8px; font-weight:700;">1. Answers questions</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">2. Simple sentences</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">3. Vocabulary</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">4. Pronunciation</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">5. Confidence</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>'
              :
                '<tr><td style="padding:4px 8px; font-weight:700;">1. Answers questions</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">2. Connected sentences</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">3. Vocabulary range</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">4. Pronunciation</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>' +
                '<tr><td style="padding:4px 8px; font-weight:700;">5. Confidence & fluency</td><td style="padding:4px; text-align:center;">0</td><td style="padding:4px; text-align:center;">1</td><td style="padding:4px; text-align:center;">2</td><td style="padding:4px; text-align:center;">3</td><td style="padding:4px; text-align:center;">4</td></tr>'
              ) +
            '</tbody>' +
          '</table>' +
          '<div style="font-size:0.8rem; font-weight:800; color:#92400e;">Calculation: Total Raw Points (0–20) &divide; 2 = Final Speaking Score (/10). Teacher can override.</div>' +
        '</div>' +

        // SECTION 5: CLASS RESULTS TABLE (/40)
        '<div style="margin-bottom:10px;">' +
          '<h2 style="font-size:1.05rem; font-weight:900; color:#0f172a; margin:0 0 8px 0; text-transform:uppercase;">' +
            '5. Whole-Class Results Gradebook Table' +
          '</h2>' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:left; border:1px solid #cbd5e1;">' +
            '<thead>' +
              '<tr style="background:#f1f5f9; border-bottom:1.5px solid #94a3b8;">' +
                '<th style="padding:6px 8px; border-right:1px solid #cbd5e1;">Student Name</th>' +
                '<th style="padding:6px 6px; text-align:center; border-right:1px solid #cbd5e1;">Reading /10</th>' +
                '<th style="padding:6px 6px; text-align:center; border-right:1px solid #cbd5e1;">Listening /10</th>' +
                '<th style="padding:6px 6px; text-align:center; border-right:1px solid #cbd5e1;">Writing /10</th>' +
                '<th style="padding:6px 6px; text-align:center; border-right:1px solid #cbd5e1;">Speaking /10</th>' +
                '<th style="padding:6px 6px; text-align:center; border-right:1px solid #cbd5e1;">Total /40</th>' +
                '<th style="padding:6px 8px;">Teacher Notes</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              students.map(s => '' +
                '<tr style="border-bottom:1px solid #e2e8f0;">' +
                  '<td style="padding:6px 8px; font-weight:700; border-right:1px solid #cbd5e1;">' + s.firstName + ' ' + s.lastName + '</td>' +
                  '<td style="padding:6px; text-align:center; border-right:1px solid #cbd5e1;">&nbsp;</td>' +
                  '<td style="padding:6px; text-align:center; border-right:1px solid #cbd5e1;">&nbsp;</td>' +
                  '<td style="padding:6px; text-align:center; border-right:1px solid #cbd5e1;">&nbsp;</td>' +
                  '<td style="padding:6px; text-align:center; border-right:1px solid #cbd5e1;">&nbsp;</td>' +
                  '<td style="padding:6px; text-align:center; border-right:1px solid #cbd5e1; font-weight:800;">&nbsp;</td>' +
                  '<td style="padding:6px 8px;">&nbsp;</td>' +
                '</tr>'
              ).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +

      '</div>';
  }

  // =========================================================================
  // 7. CLEAN VECTOR SVG ILLUSTRATIONS FOR STUDENT WORKSHEETS
  // =========================================================================
  function renderVectorSVG(type, size) {
    const s = size || 48;
    switch (type) {
      case 'red-bag':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><rect x="14" y="20" width="36" height="36" rx="6" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5"/><path d="M22 20V14C22 9.5 26.5 6 32 6C37.5 6 42 9.5 42 14V20" stroke="#b91c1c" stroke-width="3" stroke-linecap="round"/><rect x="20" y="32" width="24" height="16" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/><circle cx="32" cy="40" r="2.5" fill="#facc15"/></svg>';
      case 'blue-bag':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><rect x="14" y="20" width="36" height="36" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/><path d="M22 20V14C22 9.5 26.5 6 32 6C37.5 6 42 9.5 42 14V20" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round"/><rect x="20" y="32" width="24" height="16" rx="3" fill="#2563eb" stroke="#1e40af" stroke-width="1.5"/><circle cx="32" cy="40" r="2.5" fill="#facc15"/></svg>';
      case 'pencil':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><polygon points="12,52 14,42 46,10 54,18 22,50" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><polygon points="12,52 14,42 22,50" fill="#fde047"/><polygon points="8,56 12,52 14,54" fill="#0f172a"/><rect x="48" y="8" width="8" height="8" rx="2" transform="rotate(45 52 12)" fill="#f43f5e"/></svg>';
      case 'pencil-horizontal':
        return '<svg width="' + s + '" height="24" viewBox="0 0 80 24" fill="none" style="display:inline-block;"><polygon points="10,12 18,6 70,6 70,18 18,18" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><polygon points="2,12 10,6 10,18" fill="#0f172a"/><rect x="68" y="6" width="10" height="12" rx="2" fill="#f43f5e" stroke="#e11d48" stroke-width="1.5"/></svg>';
      case 'book':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><path d="M8 12C16 8 28 8 32 14C36 8 48 8 56 12V50C48 46 36 46 32 52C28 46 16 46 8 50V12Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><path d="M32 14V52" stroke="#1e40af" stroke-width="2"/><line x1="14" y1="20" x2="26" y2="18" stroke="#fff" stroke-width="1.5"/><line x1="14" y1="26" x2="26" y2="24" stroke="#fff" stroke-width="1.5"/><line x1="38" y1="18" x2="50" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="38" y1="24" x2="50" y2="26" stroke="#fff" stroke-width="1.5"/></svg>';
      case 'chair':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><rect x="18" y="10" width="28" height="22" rx="2" fill="#d97706" stroke="#92400e" stroke-width="2"/><rect x="14" y="32" width="36" height="8" rx="2" fill="#b45309" stroke="#78350f" stroke-width="2"/><line x1="18" y1="40" x2="18" y2="58" stroke="#78350f" stroke-width="3" stroke-linecap="round"/><line x1="46" y1="40" x2="46" y2="58" stroke="#78350f" stroke-width="3" stroke-linecap="round"/><line x1="26" y1="40" x2="26" y2="54" stroke="#92400e" stroke-width="2"/><line x1="38" y1="40" x2="38" y2="54" stroke="#92400e" stroke-width="2"/></svg>';
      case 'desk':
        return '<svg width="' + s + '" height="60" viewBox="0 0 120 60" fill="none" style="display:inline-block;"><rect x="10" y="8" width="100" height="14" rx="2" fill="#b45309" stroke="#78350f" stroke-width="2.5"/><line x1="18" y1="22" x2="18" y2="54" stroke="#78350f" stroke-width="3.5" stroke-linecap="round"/><line x1="102" y1="22" x2="102" y2="54" stroke="#78350f" stroke-width="3.5" stroke-linecap="round"/><line x1="18" y1="36" x2="102" y2="36" stroke="#92400e" stroke-width="2"/></svg>';
      case 'girl-reading':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><circle cx="32" cy="18" r="10" fill="#fed7aa" stroke="#ca8a04" stroke-width="1.5"/><path d="M22 18C22 10 42 10 42 18C42 22 22 22 22 18Z" fill="#92400e"/><path d="M20 44C20 32 44 32 44 44V56H20V44Z" fill="#ec4899"/><path d="M22 36C28 34 36 34 42 36V48C36 46 28 46 22 48V36Z" fill="#3b82f6"/></svg>';
      case 'boy-playing':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><circle cx="28" cy="18" r="10" fill="#fed7aa" stroke="#ca8a04" stroke-width="1.5"/><path d="M18 16C18 8 38 8 38 16Z" fill="#451a03"/><rect x="20" y="28" width="16" height="22" rx="4" fill="#0284c7"/><circle cx="48" cy="46" r="8" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/></svg>';
      case 'camera':
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" style="display:inline-block;"><rect x="12" y="22" width="40" height="28" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/><circle cx="32" cy="36" r="8" fill="#64748b" stroke="#facc15" stroke-width="2"/><rect x="22" y="16" width="12" height="6" rx="1" fill="#475569"/></svg>';
      default:
        return '<span>📦</span>';
    }
  }

  // =========================================================================
  // 8. SMARTBOARD SCREEN TEST RUNNER MODAL
  // =========================================================================

  window.openClassGameModal = function() {
    classGameStationIdx = 0;
    const store = window.schoolStore || window.store;
    if (!store) return;

    let modal = document.getElementById('modal-progress-check-runner');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-progress-check-runner';
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="modal-dialog" style="max-width:880px; width:94vw; border-radius:18px; padding:0; overflow:hidden;"><div id="pc-runner-body"></div></div>';
      document.body.appendChild(modal);
    }

    renderSmartboardModalBody();
    window.openModal('modal-progress-check-runner');
  };

  function renderSmartboardModalBody() {
    const modalContent = document.getElementById('pc-runner-body');
    if (!modalContent) return;

    const store = window.schoolStore || window.store;
    const check = store ? store.getProgressCheck(selectedProgressCheckId) : null;
    const isGrade4 = check && check.targetGrade === 'Grade 4';

    const slides = [
      {
        title: 'Station 1: Reading Together',
        subtitle: isGrade4 ? 'The Inventor\'s Helper' : 'The After-School Inventor',
        body: '<div style="background:#f8fafc; padding:20px; border-radius:12px; font-size:1.15rem; line-height:1.7; border:2px solid #cbd5e1; margin-bottom:16px;">' + (isGrade4 ? check.readingDetails.passage : check.readingDetails.passage) + '</div>' +
              '<div style="font-size:0.92rem; font-weight:800; color:#4f46e5;">📝 Students read along and answer questions 1–8 on Part A of their worksheets.</div>'
      },
      {
        title: 'Station 2: Listening — Picture Selection',
        subtitle: 'Listen to your teacher and circle the correct picture',
        body: '<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; margin:20px 0; text-align:center;">' +
                '<div style="background:#fff; border:2px solid #cbd5e1; border-radius:12px; padding:16px;">' + renderVectorSVG('red-bag', 72) + '<div style="font-weight:900; margin-top:8px;">1. The Red Bag</div></div>' +
                '<div style="background:#fff; border:2px solid #cbd5e1; border-radius:12px; padding:16px;">' + renderVectorSVG('girl-reading', 72) + '<div style="font-weight:900; margin-top:8px;">2. Reading a Book</div></div>' +
                '<div style="background:#fff; border:2px solid #cbd5e1; border-radius:12px; padding:16px;">' + renderVectorSVG('pencil', 72) + '<div style="font-weight:900; margin-top:8px;">3. Yellow Pencil</div></div>' +
              '</div>' +
              '<div style="background:#eff6ff; color:#1e40af; padding:12px; border-radius:8px; font-weight:800; font-size:0.9rem;">🎙️ Teacher speaks: <em>"Number 1: The red bag is on the desk..."</em></div>'
      },
      {
        title: 'Station 3: Writing Challenge',
        subtitle: isGrade4 ? 'Write 5-6 sentences about an invention' : 'Complete the sentences about yourself',
        body: '<div style="background:#fff; border:2px dashed #059669; border-radius:12px; padding:24px; text-align:center; margin:20px 0;">' +
                '<div style="font-size:2.8rem; margin-bottom:10px;">💡 🤖 🛠️ 📖 🌟</div>' +
                '<div style="font-size:1.1rem; font-weight:900; color:#065f46; margin-bottom:8px;">Focus on Writing Clearly</div>' +
                '<p style="font-size:0.92rem; color:var(--text-muted); margin:0;">Capital letters at the start · Punctuation at the end · Vocabulary from Unit 1</p>' +
              '</div>'
      }
    ];

    const currentSlide = slides[classGameStationIdx] || slides[0];

    modalContent.innerHTML = '' +
      '<div style="background:#0f172a; color:#fff; padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<div style="font-size:0.75rem; font-weight:800; color:#38bdf8; text-transform:uppercase; letter-spacing:0.04em;">Screen Test Presentation</div>' +
          '<h2 style="font-size:1.25rem; font-weight:900; color:#fff; margin:2px 0 0 0;">' + currentSlide.title + '</h2>' +
        '</div>' +
        '<div style="display:flex; gap:6px;">' +
          slides.map((s, idx) => '' +
            '<button type="button" onclick="classGameStationIdx = ' + idx + '; renderSmartboardModalBody();" style="width:32px; height:32px; border-radius:8px; font-weight:900; font-size:0.85rem; cursor:pointer; border:none; background:' + (classGameStationIdx === idx ? '#38bdf8; color:#0f172a;' : 'rgba(255,255,255,0.15); color:#fff;') + '">' +
              (idx + 1) +
            '</button>'
          ).join('') +
        '</div>' +
      '</div>' +

      '<div style="padding:26px 28px; background:#f8fafc; min-height:260px;">' +
        '<div style="font-size:0.95rem; font-weight:800; color:#64748b; margin-bottom:12px;">' + currentSlide.subtitle + '</div>' +
        currentSlide.body +
      '</div>' +

      '<div style="background:#fff; padding:14px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">' +
        '<button type="button" class="btn-sm-secondary" onclick="closeModal(\'modal-progress-check-runner\')">Close Screen Test</button>' +
        '<div style="display:flex; gap:10px;">' +
          (classGameStationIdx > 0 ? '<button type="button" class="btn-sm-secondary" onclick="classGameStationIdx--; renderSmartboardModalBody();">◀ Previous</button>' : '') +
          (classGameStationIdx < slides.length - 1 ? '<button type="button" class="btn-primary-action" onclick="classGameStationIdx++; renderSmartboardModalBody();">Next Station ▶</button>' : '<button type="button" class="btn-primary-action" style="background:#059669; border-color:#047857;" onclick="closeModal(\'modal-progress-check-runner\')"; setProgressCheckViewMode(\'enter\');">Finish &amp; Enter Results ✏️</button>') +
        '</div>' +
      '</div>';
  }

})(typeof window !== 'undefined' ? window : global);
