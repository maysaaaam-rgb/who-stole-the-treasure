/**
 * English Adventure Academy — Whole-Class Teacher-Led Progress Check Engine
 * Redesigned around a whole-class classroom assessment workflow:
 * 1. Setup (Class, Book, 4-Week Unit 1 Timeline)
 * 2. Class Game (Smartboard presentation, teacher controlled, zero student logins)
 * 3. Worksheet (Standardized whole-class A4 printable test & teacher answer key)
 * 4. Enter Results (THE HERO SCREEN: Fast, compact, keyboard-friendly class roster gradebook)
 * 5. Class Analysis (Averages, Needs, Strengths, Follow-up Planning & History Comparisons)
 * 6. Reports (Printable Class & Student Progress Reports)
 */

(function(window) {
  'use strict';

  // Module State
  let progressCheckCurrentStep = 4; // Default to the Hero Screen (Enter Results)
  let selectedProgressCheckId = 'progress-check-a1';
  let selectedAnalyticsClassId = 'class-3a';
  let reportSelectedStudentId = 'student-emma';

  // Smartboard Game State
  let classGameStationIdx = 0;
  let classGameObservations = {}; // studentId -> status (Beginning, Developing, Secure, Strong)
  let classGameClassResponse = 'Strong'; // 'Strong', 'Developing', 'Needs Practice'

  // Printable State
  let printableCurrentCheckId = 'progress-check-a1';
  let printableShowAnswerKey = false;

  // =========================================================================
  // 1. NAVIGATION & STEP CONTROLLER
  // =========================================================================

  window.goToProgressCheckStep = function(stepNum) {
    progressCheckCurrentStep = Math.max(1, Math.min(6, stepNum));
    window.renderProgressCheckView();
    const stepEl = document.getElementById('pc-step-container');
    if (stepEl) stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.switchProgressCheckSelection = function(checkId) {
    selectedProgressCheckId = checkId;
    window.renderProgressCheckView();
  };

  window.switchAnalyticsClass = function(classId) {
    selectedAnalyticsClassId = classId;
    window.renderProgressCheckView();
  };

  window.setReportSelectedStudent = function(studentId) {
    reportSelectedStudentId = studentId;
    window.renderProgressCheckView();
  };

  // =========================================================================
  // 2. MAIN VIEW RENDERER
  // =========================================================================

  window.renderProgressCheckView = function(container) {
    if (!container) container = document.getElementById('app-view-container');
    if (!container) return;

    const store = window.schoolStore || window.store;
    if (!store) {
      container.innerHTML = '<div class="alert alert-danger">Error: School Store not initialized.</div>';
      return;
    }

    const checks = store.getProgressChecks ? store.getProgressChecks('active') : [];
    const activeCheck = store.getProgressCheck(selectedProgressCheckId) || checks[0] || null;
    const currentClass = store.getClass(selectedAnalyticsClassId) || store.getActiveClass();
    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

    let html = '';

    // Main Header Row
    html +=
      '<div class="view-header-row" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:18px;">' +
        '<div>' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<span style="font-size:1.75rem;">📊</span>' +
            '<h1 style="font-size:1.6rem; font-weight:900; margin:0; color:var(--text-main);">English Adventure Progress Check</h1>' +
            '<span class="badge" style="background:#10b981; color:#fff; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">Whole-Class Assessment</span>' +
            '<span class="badge" style="background:#e0e7ff; color:#3730a3; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:12px;">Unit Duration: 4 Weeks</span>' +
          '</div>' +
          '<p style="font-size:0.88rem; color:var(--text-muted); margin:6px 0 0 0;">' +
            'Teacher-led classroom evaluation for <strong>' + (activeCheck ? (activeCheck.bookTitle || "Global Readings 2") : "Global Readings 2") + '</strong> · ' +
            '<strong>' + (activeCheck ? (activeCheck.unitTitle || "Unit 1") : "Unit 1") + '</strong> · End of Unit Assessment.' +
          '</p>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
          '<button type="button" class="btn-sm-secondary" onclick="openClassGameModal()" style="padding:8px 14px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>🎮</span> <span>Launch Class Game</span>' +
          '</button>' +
          '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(null, false)" style="padding:8px 14px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>🖨️</span> <span>Print Worksheets</span>' +
          '</button>' +
          '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(4)" style="padding:8px 16px; font-weight:800; background:#f59e0b; color:#78350f; border-color:#d97706; display:inline-flex; align-items:center; gap:6px;">' +
            '<span>📝</span> <span>Enter Results</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // 6-Step Workflow Stepper Bar
    html += renderWorkflowStepperHTML();

    // Step Container Body
    html += '<div id="pc-step-container" style="min-height:500px;">';
    switch (progressCheckCurrentStep) {
      case 1:
        html += renderStep1SetupHTML(store, activeCheck, checks, currentClass);
        break;
      case 2:
        html += renderStep2ClassGameHTML(store, activeCheck, currentClass, students);
        break;
      case 3:
        html += renderStep3WorksheetHTML(store, activeCheck);
        break;
      case 4:
        html += renderStep4EnterResultsHTML(store, activeCheck, currentClass, students);
        break;
      case 5:
        html += renderStep5AnalysisHTML(store, activeCheck, currentClass, students);
        break;
      case 6:
        html += renderStep6ReportsHTML(store, activeCheck, currentClass, students);
        break;
      default:
        html += renderStep4EnterResultsHTML(store, activeCheck, currentClass, students);
        break;
    }
    html += '</div>';

    container.innerHTML = html;
  };

  // =========================================================================
  // 3. STEPPER COMPONENT
  // =========================================================================

  function renderWorkflowStepperHTML() {
    const steps = [
      { num: 1, title: 'Step 1: Setup', desc: 'Class & Unit (4 Wks)' },
      { num: 2, title: 'Step 2: Class Game', desc: 'Screen Adventure' },
      { num: 3, title: 'Step 3: Worksheet', desc: 'Print A4 & Key' },
      { num: 4, title: 'Step 4: Enter Results ⭐', desc: 'Class Gradebook', isHero: true },
      { num: 5, title: 'Step 5: Class Analysis', desc: 'Averages & Needs' },
      { num: 6, title: 'Step 6: Reports', desc: 'Class & Student' }
    ];

    let html = 
      '<div class="pc-workflow-stepper" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; margin-bottom:24px;">';

    steps.forEach(s => {
      const isActive = progressCheckCurrentStep === s.num;
      const isCompleted = progressCheckCurrentStep > s.num;
      const borderCol = isActive ? 'var(--color-primary)' : isCompleted ? '#10b981' : 'var(--border-light)';
      const bg = isActive ? (s.isHero ? '#fef3c7' : 'var(--color-primary-soft)') : isCompleted ? '#ecfdf5' : 'var(--bg-surface)';

      html +=
        '<div class="pc-step-item" onclick="goToProgressCheckStep(' + s.num + ')" style="cursor:pointer; border:2px solid ' + borderCol + '; background:' + bg + '; border-radius:12px; padding:12px 14px; transition:all 0.2s ease; display:flex; align-items:center; gap:10px;">' +
          '<div style="width:28px; height:28px; border-radius:50%; background:' + (isActive ? 'var(--color-primary)' : isCompleted ? '#10b981' : 'var(--border-medium)') + '; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900; flex-shrink:0;">' +
            (isCompleted ? '✓' : s.num) +
          '</div>' +
          '<div style="overflow:hidden;">' +
            '<div style="font-size:0.85rem; font-weight:800; color:' + (isActive ? 'var(--color-primary)' : 'var(--text-main)') + '; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + s.title + '</div>' +
            '<div style="font-size:0.72rem; color:var(--text-muted);">' + s.desc + '</div>' +
          '</div>' +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  // =========================================================================
  // 4. STEP 1: SETUP VIEW
  // =========================================================================

  function renderStep1SetupHTML(store, activeCheck, checks, currentClass) {
    const isGR2 = (activeCheck && activeCheck.bookId === 'book-gr3') ? false : true;

    return '' +
      '<div style="display:grid; grid-template-columns:2fr 1fr; gap:20px; align-items:start;">' +
        '<div>' +
          '<div class="card-panel" style="padding:24px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light); margin-bottom:20px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">' +
              '<h2 style="font-size:1.3rem; font-weight:900; margin:0; color:var(--text-main);">Assessment Configuration</h2>' +
              '<span class="badge" style="background:#e0e7ff; color:#3730a3; font-weight:800; padding:4px 10px; border-radius:8px;">Whole-Class Mode</span>' +
            '</div>' +

            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">ASSESSMENT TITLE</label>' +
                '<input type="text" id="setup-check-title" value="' + (activeCheck ? activeCheck.title : 'English Adventure Progress Check — Unit 1') + '" class="form-input" style="width:100%; font-weight:700;" readonly>' +
              '</div>' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">CLASS</label>' +
                '<select class="form-input" style="width:100%; font-weight:700;" onchange="switchAnalyticsClass(this.value)">' +
                  '<option value="class-3a" ' + (selectedAnalyticsClassId === 'class-3a' ? 'selected' : '') + '>Grade 3A — The Explorers</option>' +
                  '<option value="class-4a" ' + (selectedAnalyticsClassId === 'class-4a' ? 'selected' : '') + '>Grade 4A — Global Navigators</option>' +
                '</select>' +
              '</div>' +
            '</div>' +

            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">CURRICULUM BOOK (AUTH TEXTBOOK)</label>' +
                '<div style="background:var(--bg-canvas); padding:10px 14px; border-radius:8px; border:1px solid var(--border-light); font-weight:800; display:flex; align-items:center; gap:8px;">' +
                  '<span>📘</span> <span>' + (isGR2 ? 'Global Readings 2 (Grade 3)' : 'Global Readings 3 (Grade 4)') + '</span>' +
                '</div>' +
              '</div>' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">UNIT</label>' +
                '<div style="background:var(--bg-canvas); padding:10px 14px; border-radius:8px; border:1px solid var(--border-light); font-weight:800; display:flex; align-items:center; gap:8px;">' +
                  '<span>🧭</span> <span>' + (activeCheck ? (activeCheck.unitTitle || "Unit 1: What Does It Do?") : "Unit 1: What Does It Do?") + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:20px;">' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">UNIT DURATION</label>' +
                '<div style="background:#eff6ff; color:#1d4ed8; padding:8px 12px; border-radius:8px; font-weight:800; font-size:0.86rem;">4 Weeks</div>' +
              '</div>' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">PROGRESS CHECK</label>' +
                '<div style="background:#ecfdf5; color:#065f46; padding:8px 12px; border-radius:8px; font-weight:800; font-size:0.86rem;">End of Unit 1</div>' +
              '</div>' +
              '<div>' +
                '<label style="display:block; font-size:0.78rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">ASSESSMENT TIME</label>' +
                '<div style="background:#fef3c7; color:#92400e; padding:8px 12px; border-radius:8px; font-weight:800; font-size:0.86rem;">30–45 minutes</div>' +
              '</div>' +
            '</div>' +

            // 4-Week Unit Roadmap
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:16px; margin-bottom:20px;">' +
              '<h4 style="font-size:0.88rem; font-weight:800; margin:0 0 10px 0; color:var(--text-main);">Unit 1 Timeline (4 Weeks of Instruction &rarr; Progress Check)</h4>' +
              '<div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; text-align:center;">' +
                '<div style="background:#fff; border:1px solid var(--border-light); padding:8px; border-radius:8px;">' +
                  '<div style="font-size:0.72rem; font-weight:800; color:#3b82f6;">WEEK 1</div>' +
                  '<div style="font-size:0.76rem; font-weight:700;">Foundation &amp; Vocab</div>' +
                '</div>' +
                '<div style="background:#fff; border:1px solid var(--border-light); padding:8px; border-radius:8px;">' +
                  '<div style="font-size:0.72rem; font-weight:800; color:#3b82f6;">WEEK 2</div>' +
                  '<div style="font-size:0.76rem; font-weight:700;">Reading 1 &amp; Comp</div>' +
                '</div>' +
                '<div style="background:#fff; border:1px solid var(--border-light); padding:8px; border-radius:8px;">' +
                  '<div style="font-size:0.72rem; font-weight:800; color:#3b82f6;">WEEK 3</div>' +
                  '<div style="font-size:0.76rem; font-weight:700;">Reading 2 &amp; Grammar</div>' +
                '</div>' +
                '<div style="background:#fff; border:1px solid var(--border-light); padding:8px; border-radius:8px;">' +
                  '<div style="font-size:0.72rem; font-weight:800; color:#3b82f6;">WEEK 4</div>' +
                  '<div style="font-size:0.76rem; font-weight:700;">Synthesis &amp; Projects</div>' +
                '</div>' +
                '<div style="background:#ecfdf5; border:2px solid #10b981; padding:8px; border-radius:8px;">' +
                  '<div style="font-size:0.72rem; font-weight:900; color:#059669;">CHECKPOINT</div>' +
                  '<div style="font-size:0.76rem; font-weight:900; color:#059669;">Progress Check</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div style="display:flex; gap:10px; flex-wrap:wrap;">' +
              '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(2)" style="padding:9px 18px; font-weight:800;">' +
                '<span>Next: Launch Class Game (Step 2) ➔</span>' +
              '</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="goToProgressCheckStep(3)" style="padding:9px 16px; font-weight:700;">' +
                '<span>Print Worksheets (Step 3)</span>' +
              '</button>' +
              '<button type="button" class="btn-sm-secondary" onclick="goToProgressCheckStep(4)" style="padding:9px 16px; font-weight:800; background:#fef3c7; color:#92400e; border-color:#f59e0b;">' +
                '<span>Enter Class Results (Step 4) ⭐</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Right Sidebar: Objectives & Available Checks
        '<div>' +
          '<div class="card-panel" style="padding:20px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light); margin-bottom:16px;">' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 12px 0;">🎯 Measured Competencies</h3>' +
            '<ul style="margin:0; padding-left:18px; font-size:0.84rem; line-height:1.6; color:var(--text-main);">' +
              '<li><strong>Vocabulary:</strong> Everyday tools, vehicles, food, animals</li>' +
              '<li><strong>Listening:</strong> Color, quantity, actions, prepositions</li>' +
              '<li><strong>Reading:</strong> Story passage comprehension &amp; details</li>' +
              '<li><strong>Grammar:</strong> Present simple 3rd person, is/are, has</li>' +
              '<li><strong>Speaking:</strong> Oral description &amp; response to prompts</li>' +
              '<li><strong>Writing:</strong> 3–5 descriptive sentences with word bank</li>' +
            '</ul>' +
          '</div>' +

          '<div class="card-panel" style="padding:20px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 12px 0;">📋 Assessment Switcher</h3>' +
            '<div style="display:flex; flex-direction:column; gap:8px;">' +
              checks.map(c => 
                '<div onclick="switchProgressCheckSelection(\'' + c.id + '\')" style="cursor:pointer; padding:10px 12px; border-radius:8px; border:1px solid ' + (selectedProgressCheckId === c.id ? 'var(--color-primary)' : 'var(--border-light)') + '; background:' + (selectedProgressCheckId === c.id ? 'var(--color-primary-soft)' : 'var(--bg-canvas)') + '; font-size:0.84rem; font-weight:700;">' +
                  '<div>' + c.title + '</div>' +
                  '<div style="font-size:0.72rem; color:var(--text-muted);">' + (c.targetGrade || 'Grade 3') + ' · ' + (c.displayDate || 'September 2026') + '</div>' +
                '</div>'
              ).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 5. STEP 2: CLASS GAME (SMARTBOARD PRESENTATION MODE)
  // =========================================================================

  function renderStep2ClassGameHTML(store, activeCheck, currentClass, students) {
    const stations = (activeCheck && activeCheck.stations) ? activeCheck.stations : [];
    const currentStation = stations[classGameStationIdx] || stations[0] || null;

    return '' +
      '<div class="card-panel" style="padding:24px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
        // Smartboard Game Header
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div style="display:flex; align-items:center; gap:12px;">' +
            '<span style="font-size:2rem;">🎮</span>' +
            '<div>' +
              '<h2 style="font-size:1.35rem; font-weight:900; margin:0; color:var(--text-main);">Class Progress Adventure (Classroom Screen Mode)</h2>' +
              '<div style="font-size:0.84rem; color:var(--text-muted);">Teacher-controlled screen · All students participate together · Zero student logins required</div>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<button type="button" class="btn-primary-action" onclick="openClassGameModal()" style="padding:8px 16px; font-weight:800; background:#2563eb;">' +
              '⛶ Fullscreen Smartboard View' +
            '</button>' +
            '<button type="button" class="btn-sm-secondary" onclick="awardClassCompletionXP()" style="padding:8px 14px; font-weight:800; color:#059669; background:#ecfdf5; border-color:#10b981;">' +
              '⭐ Award +50 XP to Class' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Station Selector Buttons
        '<div style="display:flex; gap:8px; overflow-x:auto; margin-bottom:20px; padding-bottom:6px;">' +
          stations.map((st, idx) => 
            '<button type="button" class="btn-sm-secondary ' + (classGameStationIdx === idx ? 'btn-primary-action' : '') + '" onclick="classGameStationIdx = ' + idx + '; renderProgressCheckView();" style="padding:7px 14px; font-weight:700; white-space:nowrap; border-radius:10px;">' +
              '<span>' + st.icon + '</span> <span>' + st.shortTitle + '</span>' +
            '</button>'
          ).join('') +
        '</div>' +

        // Interactive Station Screen Container
        renderCurrentStationScreenHTML(currentStation, students) +

        // Bottom Navigation Bar
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-light);">' +
          '<button type="button" class="btn-sm-secondary" onclick="if (classGameStationIdx > 0) { classGameStationIdx--; renderProgressCheckView(); }" ' + (classGameStationIdx === 0 ? 'disabled' : '') + ' style="padding:8px 16px; font-weight:700;">' +
            '← Previous Station' +
          '</button>' +

          '<div style="font-size:0.86rem; font-weight:800; color:var(--text-muted);">' +
            'Station ' + (classGameStationIdx + 1) + ' of ' + stations.length +
          '</div>' +

          (classGameStationIdx < stations.length - 1 ?
            '<button type="button" class="btn-primary-action" onclick="classGameStationIdx++; renderProgressCheckView();" style="padding:8px 18px; font-weight:800;">' +
              'Next Station →' +
            '</button>' :
            '<button type="button" class="btn-primary-action" onclick="finishClassroomGame()" style="padding:8px 20px; font-weight:900; background:#10b981;">' +
              '🎉 Finish &amp; Transition to Worksheet ➔' +
            '</button>'
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

          // Fast Teacher Observation Tally
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
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:4px 0 0 0;">Press play audio on the classroom speaker. Students listen and identify the matching picture.</p>' +
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
          '<div style="display:grid; grid-template-columns:1.2fr 1.8fr; gap:18px;">' +
            // Passage Panel
            '<div style="background:#fff; border:2px solid #fbcfe8; border-radius:12px; padding:18px;">' +
              '<div style="font-size:0.75rem; font-weight:800; color:#be185d; margin-bottom:6px;">AUTHENTIC READING PASSAGE</div>' +
              '<h4 style="font-size:1.1rem; font-weight:900; margin:0 0 10px 0; color:var(--text-main);">' + (passage.title || 'The Treehouse Club') + '</h4>' +
              '<p style="font-size:0.92rem; line-height:1.7; color:var(--text-main); margin:0 0 14px 0;">' + (passage.text || '') + '</p>' +
              '<button type="button" class="btn-sm-secondary" onclick="playAudioPrompt(\'' + safeText + '\')" style="font-size:0.78rem; font-weight:700; display:inline-flex; align-items:center; gap:6px;">' +
                '<span>🔊</span> <span>Read Aloud with Audio</span>' +
              '</button>' +
            '</div>' +

            // Questions Panel
            '<div>' +
              '<h4 style="font-size:0.92rem; font-weight:800; margin:0 0 10px 0;">Comprehension Questions (Class Discussion)</h4>' +
              '<div style="display:flex; flex-direction:column; gap:10px;">' +
                station.questions.map(function(q, idx) {
                  return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:12px 14px;">' +
                    '<div style="font-size:0.84rem; font-weight:800; margin-bottom:6px;">' + (idx + 1) + '. ' + q.prompt + '</div>' +
                    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">' +
                      q.options.map(function(opt) {
                        return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="padding:6px; font-size:0.78rem; font-weight:700;">' +
                          opt +
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

    // Station 4: Grammar
    else if (station.key === 'grammar') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="margin-bottom:14px;">' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">🔤 Grammar Bridge — Present Simple &amp; Verb Forms</h3>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:4px 0 0 0;">Short visual questions testing 3rd person singular, is/are, has/have.</p>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">' +
            station.questions.map(function(q) {
              return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px;">' +
                (q.imageContext ? '<div style="font-size:0.78rem; font-weight:800; color:#7c3aed; margin-bottom:4px;">' + q.imageContext + '</div>' : '') +
                '<div style="font-size:0.92rem; font-weight:800; margin-bottom:10px;">' + q.prompt + '</div>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">' +
                  q.options.map(function(opt) {
                    return '<button type="button" class="btn-sm-secondary" onclick="revealAnswer(this, \'' + q.correctAnswer + '\', \'' + opt + '\')" style="padding:6px 10px; font-size:0.82rem; font-weight:700;">' +
                      opt +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    // Station 5: Speaking Check (Teacher-Led with Side Observation Roster)
    else if (station.key === 'speaking') {
      html +=
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
          '<div style="display:grid; grid-template-columns:1.4fr 1.6fr; gap:18px;">' +
            // Prompts Panel
            '<div>' +
              '<h3 style="font-size:1.15rem; font-weight:800; margin:0 0 6px 0; color:var(--text-main);">🗣️ Teacher Speaking Prompts</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 14px 0;">Teacher shows picture and asks prompts. Observe response and tag students on the right.</p>' +

              '<div style="background:#fff; border:2px dashed var(--border-medium); border-radius:12px; padding:16px; text-align:center; margin-bottom:14px;">' +
                '<div style="font-size:3.5rem; margin-bottom:6px;">🌳 👦 ⚽ 🐕 👧</div>' +
                '<div style="font-size:0.82rem; font-weight:800; color:var(--text-muted);">Classroom Visual Scene: Children Playing in Sunny Park</div>' +
              '</div>' +

              '<div style="display:flex; flex-direction:column; gap:8px;">' +
                station.teacherPrompts.map(function(p, idx) {
                  return '<div style="background:#fff; border:1px solid var(--border-light); border-radius:8px; padding:10px 14px;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                      '<span style="font-size:0.75rem; font-weight:800; color:#ea580c;">PROMPT ' + (idx + 1) + '</span>' +
                      '<span style="font-size:0.7rem; color:var(--text-muted);">' + p.suggestedTime + '</span>' +
                    '</div>' +
                    '<div style="font-size:0.9rem; font-weight:800; margin:4px 0;">"' + p.promptText + '"</div>' +
                    '<div style="font-size:0.72rem; color:var(--text-muted);">Target: ' + p.targetSkill + '</div>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +

            // Quick Observation Roster
            '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
                '<h4 style="font-size:0.95rem; font-weight:800; margin:0;">Live Class Speaking Roster</h4>' +
                '<span style="font-size:0.72rem; color:var(--text-muted);">Tally for later grade entry</span>' +
              '</div>' +

              '<div style="display:flex; flex-direction:column; gap:8px;">' +
                students.map(function(s) {
                  const currentObs = classGameObservations[s.id] || 'Not Observed';
                  return '' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:var(--bg-canvas); border-radius:8px; font-size:0.82rem;">' +
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

    // Station 6: Writing Workshop
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

            '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(3)" style="padding:10px 24px; font-weight:900; font-size:0.92rem; background:#10b981;">' +
              '🖨️ Step 3: Print Class Worksheets ➔' +
            '</button>' +
          '</div>' +
        '</div>';
    }

    return html;
  }

  // =========================================================================
  // 6. STEP 3: WORKSHEET VIEW (PRINTABLE A4 WORKSHEET & ANSWER KEY)
  // =========================================================================

  function renderStep3WorksheetHTML(store, activeCheck) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    return '' +
      '<div class="card-panel" style="padding:24px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<h2 style="font-size:1.35rem; font-weight:900; margin:0; color:var(--text-main);">Printable Class Worksheets &amp; Answer Key</h2>' +
            '<p style="font-size:0.85rem; color:var(--text-muted); margin:4px 0 0 0;">Single standardized A4 assessment for the whole class · Clear layout for young learners</p>' +
          '</div>' +

          '<div style="display:flex; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="openPrintableProgressCheck(\'' + checkId + '\', false)" style="padding:8px 18px; font-weight:800; display:inline-flex; align-items:center; gap:8px;">' +
              '<span>🖨️</span> <span>Print Student Worksheets</span>' +
            '</button>' +
            '<button type="button" class="btn-sm-secondary" onclick="openPrintableProgressCheck(\'' + checkId + '\', true)" style="padding:8px 16px; font-weight:700; display:inline-flex; align-items:center; gap:8px;">' +
              '<span>🗝️</span> <span>Print Teacher Answer Key</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Worksheet Sections Preview Cards
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:24px;">' +
          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
            '<div style="font-size:0.76rem; font-weight:900; color:#10b981; margin-bottom:4px;">PART A (5 ITEMS)</div>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 6px 0;">🧠 Vocabulary</h4>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Picture-based multiple choice. Students identify backpack, dog, apple, bus, park.</p>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
            '<div style="font-size:0.76rem; font-weight:900; color:#e11d48; margin-bottom:4px;">PART B (4 ITEMS)</div>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 6px 0;">📖 Reading Comprehension</h4>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Illustrated passage "The Treehouse Club" followed by 4 factual detail and sequence questions.</p>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
            '<div style="font-size:0.76rem; font-weight:900; color:#7c3aed; margin-bottom:4px;">PART C (5 ITEMS)</div>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 6px 0;">🔤 Grammar</h4>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Present simple 3rd person agreement (eats/has), there is/are, don\'t/doesn\'t, and articles a/an.</p>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
            '<div style="font-size:0.76rem; font-weight:900; color:#ca8a04; margin-bottom:4px;">PART D (WRITTEN TASK)</div>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 6px 0;">✏️ Writing</h4>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Picture prompt "A Sunny Day in the Park" + word bank. Large ruled lines for 3–5 sentences.</p>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:16px;">' +
            '<div style="font-size:0.76rem; font-weight:900; color:#ea580c; margin-bottom:4px;">PART E (TEACHER-ONLY)</div>' +
            '<h4 style="font-size:1.05rem; font-weight:800; margin:0 0 6px 0;">🗣️ Teacher Observation Rubric</h4>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Checkboxes for Speaking, Listening, Participation, Communication (Beginning / Developing / Secure / Strong) + teacher note lines.</p>' +
          '</div>' +
        '</div>' +

        // Action Forward
        '<div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">' +
          '<div>' +
            '<div style="font-size:0.95rem; font-weight:800; color:#92400e;">Finished checking student worksheets?</div>' +
            '<div style="font-size:0.82rem; color:#b45309;">Open the Enter Results gradebook to enter scores and your teacher progress notes in one compact screen.</div>' +
          '</div>' +
          '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(4)" style="padding:10px 22px; font-weight:900; background:#d97706; color:#fff;">' +
            '📝 Go to Step 4: Enter Class Results ⭐ ➔' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // 7. STEP 4: ENTER RESULTS VIEW (THE HERO SCREEN!)
  // =========================================================================

  function renderStep4EnterResultsHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const existingSubs = store.getProgressCheckSubmissions(checkId);

    return '' +
      '<div class="card-panel" style="padding:22px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
        // Header Row
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span style="font-size:1.8rem;">👩‍🏫</span>' +
              '<h2 style="font-size:1.45rem; font-weight:900; margin:0; color:var(--text-main);">Enter Class Results (Gradebook Roster)</h2>' +
              '<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:900; padding:4px 10px; border-radius:10px;">Primary Teacher Action</span>' +
            '</div>' +
            '<p style="font-size:0.86rem; color:var(--text-muted); margin:4px 0 0 0;">' +
              'Fast keyboard-friendly entry. Enter worksheet scores (Vocab, Reading, Grammar, Writing) and observational ratings (Listening, Speaking). Partial results allowed.' +
            '</p>' +
          '</div>' +

          '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">' +
            '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:9px 20px; font-weight:900; font-size:0.9rem; background:#059669; display:inline-flex; align-items:center; gap:8px; box-shadow:0 2px 6px rgba(5,150,105,0.3);">' +
              '<span>💾</span> <span>Save All Results</span>' +
            '</button>' +
            '<button type="button" class="btn-sm-secondary" onclick="goToProgressCheckStep(5)" style="padding:9px 16px; font-weight:700;">' +
              '<span>📈</span> <span>View Class Analysis ➔</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Info Banner
        '<div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:10px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:0.82rem; color:#1e40af;">' +
          '<div>' +
            '💡 <strong>Teacher Note:</strong> Accuracy % does NOT equal automatic mastery. You can select Teacher Assessment (Beginning, Developing, Secure, Strong) and leave uncompleted sections as <em>Not Assessed</em>.' +
          '</div>' +
          '<div style="font-weight:800;">' +
            'Total Class Roster: ' + students.length + ' Students' +
          '</div>' +
        '</div>' +

        // The Gradebook Table
        '<div style="overflow-x:auto; margin-bottom:20px;">' +
          '<table class="pc-gradebook-table" style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:left;">' +
            '<thead>' +
              '<tr style="background:var(--bg-canvas); border-bottom:2px solid var(--border-medium); color:var(--text-main);">' +
                '<th style="padding:10px 12px; font-weight:800; min-width:160px;">STUDENT</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:90px;">VOCAB (/10)</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:90px;">READING (/5)</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:90px;">GRAMMAR (/5)</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:90px;">WRITING (/5)</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:110px;">LISTENING</th>' +
                '<th style="padding:10px 8px; font-weight:800; min-width:110px;">SPEAKING</th>' +
                '<th style="padding:10px 12px; font-weight:800; min-width:240px;">TEACHER PROGRESS NOTE</th>' +
                '<th style="padding:10px 8px; font-weight:800; text-align:center; min-width:90px;">ACTION</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              students.map(function(s, idx) {
                const sub = existingSubs.find(function(sub) { return sub.studentId === s.id; }) || {};
                const scores = sub.scores || {};
                const vCorrect = scores.vocabulary ? scores.vocabulary.correct : (sub.skillScores && sub.skillScores.vocabulary ? sub.skillScores.vocabulary.correct : 8);
                const rCorrect = scores.reading ? scores.reading.correct : (sub.skillScores && sub.skillScores.reading ? sub.skillScores.reading.correct : 4);
                const gCorrect = scores.grammar ? scores.grammar.correct : (sub.skillScores && sub.skillScores.grammar ? sub.skillScores.grammar.correct : 4);
                const wCorrect = scores.writing ? scores.writing.correct : (sub.skillScores && sub.skillScores.writing ? sub.skillScores.writing.correct : 3);
                const lRating = scores.listening ? scores.listening.rating : (sub.teacherAssessment && sub.teacherAssessment.listening ? sub.teacherAssessment.listening : (sub.skillScores && sub.skillScores.listening ? sub.skillScores.listening.statusText : 'Developing'));
                const sRating = scores.speaking ? scores.speaking.rating : (sub.teacherAssessment && sub.teacherAssessment.speaking ? sub.teacherAssessment.speaking : (sub.skillScores && sub.skillScores.speaking ? sub.skillScores.speaking.statusText : 'Developing'));
                const note = sub.notes || sub.teacherComment || (s.latestTeacherNote || 'Understands familiar vocabulary well. Needs support speaking in full sentences.');

                const monsterSvg = window.renderStudentMonsterAvatar ? window.renderStudentMonsterAvatar(s.id, { size: 30, animated: false }) : '👾';

                return '' +
                  '<tr id="row-student-' + s.id + '" style="border-bottom:1px solid var(--border-light); background:' + (idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-canvas)') + ';">' +
                    // Student info
                    '<td style="padding:10px 12px;">' +
                      '<div style="display:flex; align-items:center; gap:8px;">' +
                        '<div style="width:30px; height:30px; flex-shrink:0;">' + monsterSvg + '</div>' +
                        '<div>' +
                          '<div style="font-weight:800; color:var(--text-main);">' + s.firstName + ' ' + s.lastName + '</div>' +
                          '<div style="font-size:0.72rem; color:var(--text-muted);">' + (s.grade || 'Grade 3') + ' · ⭐ ' + (s.xp || 0) + '</div>' +
                        '</div>' +
                      '</div>' +
                    '</td>' +

                    // Vocab input (/10)
                    '<td style="padding:8px;">' +
                      '<div style="display:flex; align-items:center; gap:4px;">' +
                        '<input type="number" min="0" max="10" id="inp-vocab-' + s.id + '" value="' + vCorrect + '" class="form-input" style="width:50px; padding:4px 6px; font-weight:700; text-align:center;">' +
                        '<span style="color:var(--text-muted); font-size:0.78rem;">/10</span>' +
                      '</div>' +
                    '</td>' +

                    // Reading input (/5)
                    '<td style="padding:8px;">' +
                      '<div style="display:flex; align-items:center; gap:4px;">' +
                        '<input type="number" min="0" max="5" id="inp-read-' + s.id + '" value="' + rCorrect + '" class="form-input" style="width:50px; padding:4px 6px; font-weight:700; text-align:center;">' +
                        '<span style="color:var(--text-muted); font-size:0.78rem;">/5</span>' +
                      '</div>' +
                    '</td>' +

                    // Grammar input (/5)
                    '<td style="padding:8px;">' +
                      '<div style="display:flex; align-items:center; gap:4px;">' +
                        '<input type="number" min="0" max="5" id="inp-gram-' + s.id + '" value="' + gCorrect + '" class="form-input" style="width:50px; padding:4px 6px; font-weight:700; text-align:center;">' +
                        '<span style="color:var(--text-muted); font-size:0.78rem;">/5</span>' +
                      '</div>' +
                    '</td>' +

                    // Writing input (/5)
                    '<td style="padding:8px;">' +
                      '<div style="display:flex; align-items:center; gap:4px;">' +
                        '<input type="number" min="0" max="5" id="inp-write-' + s.id + '" value="' + wCorrect + '" class="form-input" style="width:50px; padding:4px 6px; font-weight:700; text-align:center;">' +
                        '<span style="color:var(--text-muted); font-size:0.78rem;">/5</span>' +
                      '</div>' +
                    '</td>' +

                    // Listening Select
                    '<td style="padding:8px;">' +
                      '<select id="inp-listen-' + s.id + '" class="form-input" style="width:100%; padding:4px 6px; font-size:0.78rem; font-weight:700;">' +
                        ['Beginning', 'Developing', 'Secure', 'Strong', 'Not Assessed'].map(function(opt) {
                          return '<option value="' + opt + '" ' + (lRating === opt ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                      '</select>' +
                    '</td>' +

                    // Speaking Select
                    '<td style="padding:8px;">' +
                      '<select id="inp-speak-' + s.id + '" class="form-input" style="width:100%; padding:4px 6px; font-size:0.78rem; font-weight:700;">' +
                        ['Beginning', 'Developing', 'Secure', 'Strong', 'Not Assessed'].map(function(opt) {
                          return '<option value="' + opt + '" ' + (sRating === opt ? 'selected' : '') + '>' + opt + '</option>';
                        }).join('') +
                      '</select>' +
                    '</td>' +

                    // Teacher Progress Note (editable textarea)
                    '<td style="padding:8px 12px;">' +
                      '<textarea id="inp-note-' + s.id + '" class="form-input" rows="2" style="width:100%; font-size:0.78rem; line-height:1.4; resize:vertical;" placeholder="Enter observation note...">' + note + '</textarea>' +
                    '</td>' +

                    // Save row action
                    '<td style="padding:8px; text-align:center;">' +
                      '<button type="button" class="btn-sm-secondary" onclick="saveSingleStudentGradebookRow(\'' + checkId + '\', \'' + s.id + '\')" style="padding:5px 10px; font-weight:800; font-size:0.76rem; background:#ecfdf5; color:#059669; border-color:#10b981;">' +
                        '💾 Save' +
                      '</button>' +
                    '</td>' +
                  '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +

        // Bottom Save All Button & Quick Navigation
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:14px; border-top:1px solid var(--border-light);">' +
          '<div style="font-size:0.84rem; color:var(--text-muted);">' +
            '✓ Saves create authentic Learning Evidence records and update Student Profiles automatically.' +
          '</div>' +

          '<div style="display:flex; gap:10px;">' +
            '<button type="button" class="btn-primary-action" onclick="saveAllGradebookResults(\'' + checkId + '\')" style="padding:10px 22px; font-weight:900; background:#059669;">' +
              '💾 Save All Results (Whole Class)' +
            '</button>' +
            '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(5)" style="padding:10px 20px; font-weight:800;">' +
              'Next: View Class Analysis ➔' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // Helper to collect row inputs
  window.getStudentGradebookRowData = function(studentId) {
    const vEl = document.getElementById('inp-vocab-' + studentId);
    const rEl = document.getElementById('inp-read-' + studentId);
    const gEl = document.getElementById('inp-gram-' + studentId);
    const wEl = document.getElementById('inp-write-' + studentId);
    const lEl = document.getElementById('inp-listen-' + studentId);
    const sEl = document.getElementById('inp-speak-' + studentId);
    const nEl = document.getElementById('inp-note-' + studentId);

    const vVal = vEl ? Number(vEl.value) : 8;
    const rVal = rEl ? Number(rEl.value) : 4;
    const gVal = gEl ? Number(gEl.value) : 4;
    const wVal = wEl ? Number(wEl.value) : 3;

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
    if (window.showToast) window.showToast('Saved results for ' + studentId, 'success');
  };

  window.saveAllGradebookResults = function(checkId) {
    const store = window.schoolStore || window.store;
    if (!store || !store.saveClassProgressCheckResults) return;

    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];
    const results = students.map(function(s) { return getStudentGradebookRowData(s.id); });

    const outcome = store.saveClassProgressCheckResults(checkId, results);
    if (outcome && outcome.success) {
      if (window.showToast) window.showToast('✓ Successfully saved all ' + outcome.count + ' student results & learning evidence!', 'success');
      window.renderProgressCheckView();
    }
  };

  // =========================================================================
  // 8. STEP 5: CLASS ANALYSIS VIEW
  // =========================================================================

  function renderStep5AnalysisHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const analytics = store.getClassProgressCheckAnalytics(checkId, selectedAnalyticsClassId);
    const avg = analytics.classAverages || { vocabulary: 78, reading: 84, grammar: 71, writing: 68, listening: 65, speaking: 65 };
    const comparison = store.compareProgressChecks ? store.compareProgressChecks('progress-check-a1', 'progress-check-u2', selectedAnalyticsClassId) : null;

    return '' +
      '<div class="card-panel" style="padding:24px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<h2 style="font-size:1.35rem; font-weight:900; margin:0; color:var(--text-main);">' + (currentClass ? currentClass.name : 'Grade 3A') + ' — Unit 1 Progress Analysis</h2>' +
            '<p style="font-size:0.85rem; color:var(--text-muted); margin:4px 0 0 0;">Automatic cohort metrics computed from teacher-entered worksheet scores and observations</p>' +
          '</div>' +

          '<div style="display:flex; gap:8px;">' +
            '<button type="button" class="btn-primary-action" onclick="goToProgressCheckStep(6)" style="padding:8px 16px; font-weight:800;">' +
              'Generate Reports (Step 6) ➔' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Cohort Skill Averages Cards
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:24px;">' +
          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">VOCABULARY</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#10b981; margin:4px 0;">' + avg.vocabulary + '%</div>' +
            '<div style="font-size:0.72rem; color:var(--text-muted);">Class Average</div>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">READING</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#e11d48; margin:4px 0;">' + avg.reading + '%</div>' +
            '<div style="font-size:0.72rem; color:#059669; font-weight:800;">🌟 Class Strength</div>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">GRAMMAR</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#7c3aed; margin:4px 0;">' + avg.grammar + '%</div>' +
            '<div style="font-size:0.72rem; color:var(--text-muted);">Meeting Baseline</div>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">WRITING</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#ca8a04; margin:4px 0;">' + avg.writing + '%</div>' +
            '<div style="font-size:0.72rem; color:#b91c1c; font-weight:800;">🎯 Focus Area</div>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">LISTENING</div>' +
            '<div style="font-size:1.25rem; font-weight:900; color:#0284c7; margin:6px 0;">Developing</div>' +
            '<div style="font-size:0.72rem; color:var(--text-muted);">' + (avg.listening || 65) + '% Benchmark</div>' +
          '</div>' +

          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:12px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">SPEAKING</div>' +
            '<div style="font-size:1.25rem; font-weight:900; color:#ea580c; margin:6px 0;">Developing</div>' +
            '<div style="font-size:0.72rem; color:var(--text-muted);">' + (avg.speaking || 65) + '% Benchmark</div>' +
          '</div>' +
        '</div>' +

        // 2-Column Priorities & Strengths
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:24px;">' +
          // Class Needs
          '<div style="background:#fff; border:2px solid #fed7aa; border-radius:14px; padding:18px;">' +
            '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">' +
              '<span style="font-size:1.3rem;">🎯</span>' +
              '<h3 style="font-size:1.1rem; font-weight:900; margin:0; color:#9a3412;">Identified Class Priorities</h3>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:10px;">' +
              '<div style="background:#fff7ed; padding:10px 12px; border-radius:8px; border:1px solid #ffedd5;">' +
                '<div style="font-weight:800; color:#c2410c;">1. Written Sentence Formation (Class Avg: ' + avg.writing + '%)</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Students can name words from word banks but require scaffolding to combine subjects and verbs accurately.</div>' +
              '</div>' +
              '<div style="background:#fff7ed; padding:10px 12px; border-radius:8px; border:1px solid #ffedd5;">' +
                '<div style="font-weight:800; color:#c2410c;">2. Spoken Production Fluency (Most: Developing)</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Need structured daily sentence frames (\'I can see ___ because ___\') during morning circle routines.</div>' +
              '</div>' +
              '<div style="background:#fff7ed; padding:10px 12px; border-radius:8px; border:1px solid #ffedd5;">' +
                '<div style="font-weight:800; color:#c2410c;">3. Grammar Agreements (Class Avg: ' + avg.grammar + '%)</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Reinforce 3rd person singular verb forms (have/has, eat/eats) with interactive games.</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Class Strengths
          '<div style="background:#fff; border:2px solid #bbf7d0; border-radius:14px; padding:18px;">' +
            '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">' +
              '<span style="font-size:1.3rem;">🌟</span>' +
              '<h3 style="font-size:1.1rem; font-weight:900; margin:0; color:#166534;">Class Strengths</h3>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:10px;">' +
              '<div style="background:#f0fdf4; padding:10px 12px; border-radius:8px; border:1px solid #dcfce7;">' +
                '<div style="font-weight:800; color:#15803d;">Reading Comprehension (' + avg.reading + '%)</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Exceptional ability to locate key details, characters, and settings in illustrated A1 passages.</div>' +
              '</div>' +
              '<div style="background:#f0fdf4; padding:10px 12px; border-radius:8px; border:1px solid #dcfce7;">' +
                '<div style="font-weight:800; color:#15803d;">Everyday Vocabulary Recognition (' + avg.vocabulary + '%)</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">High confidence in visual identification of familiar objects, classroom supplies, animals, and food.</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Follow-Up Planning: What should I teach next?
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:20px; margin-bottom:24px;">' +
          '<h3 style="font-size:1.15rem; font-weight:900; margin:0 0 10px 0; color:var(--text-main);">🧭 Follow-up Planning — "What should I teach next?"</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin:0 0 16px 0;">Recommended activities connected directly to existing platform games and worksheets based on entered results:</p>' +

          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px;">' +
            '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:14px;">' +
              '<div style="font-size:0.76rem; font-weight:800; color:#ea580c; margin-bottom:4px;">PRIORITY 1 · SPEAKING</div>' +
              '<div style="font-weight:800; font-size:0.92rem; margin-bottom:6px;">At the Restaurant (Guided Roleplay)</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">Structured communicative roleplay with polite sentence frames and social interaction.</div>' +
              '<button type="button" class="btn-sm-secondary" onclick="assignRecommendedPracticeToClass(\'restaurant\', \'game\')" style="font-size:0.76rem; font-weight:800; width:100%;">+ Assign to Grade 3A</button>' +
            '</div>' +

            '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:14px;">' +
              '<div style="font-size:0.76rem; font-weight:800; color:#0284c7; margin-bottom:4px;">PRIORITY 2 · LISTENING</div>' +
              '<div style="font-weight:800; font-size:0.92rem; margin-bottom:6px;">Fire Station Adventure (Audio Detective)</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">Audio challenges training listening comprehension for emergency equipment and instructions.</div>' +
              '<button type="button" class="btn-sm-secondary" onclick="assignRecommendedPracticeToClass(\'firefighter\', \'game\')" style="font-size:0.76rem; font-weight:800; width:100%;">+ Assign to Grade 3A</button>' +
            '</div>' +

            '<div style="background:#fff; border:1px solid var(--border-light); border-radius:10px; padding:14px;">' +
              '<div style="font-size:0.76rem; font-weight:800; color:#7c3aed; margin-bottom:4px;">PRIORITY 3 · GRAMMAR</div>' +
              '<div style="font-weight:800; font-size:0.92rem; margin-bottom:6px;">My Neighbourhood (Prepositions &amp; Verbs)</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">Interactive town exploration reinforcing place prepositions and 3rd person singular verb forms.</div>' +
              '<button type="button" class="btn-sm-secondary" onclick="assignRecommendedPracticeToClass(\'neighbourhood\', \'game\')" style="font-size:0.76rem; font-weight:800; width:100%;">+ Assign to Grade 3A</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Assessment History & Progress Comparison
        (comparison ?
          '<div style="background:#fff; border:1px solid var(--border-light); border-radius:14px; padding:20px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
              '<h3 style="font-size:1.15rem; font-weight:900; margin:0; color:var(--text-main);">📈 Compare Progress Over Time (Unit 1 vs Unit 2)</h3>' +
              '<span class="badge" style="background:#ecfdf5; color:#059669; font-weight:800; padding:4px 10px; border-radius:8px;">Top Gain: Reading +' + (comparison.deltas.reading || 9) + '%</span>' +
            '</div>' +

            '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">' +
              Object.keys(comparison.deltas).map(function(skill) {
                const delta = comparison.deltas[skill];
                const isPos = delta >= 0;
                return '' +
                  '<div style="background:var(--bg-canvas); padding:10px 12px; border-radius:8px; border:1px solid var(--border-light); text-align:center;">' +
                    '<div style="font-size:0.74rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">' + skill + '</div>' +
                    '<div style="font-size:0.86rem; font-weight:700; margin:4px 0;">' + comparison.check1.averages[skill] + '% &rarr; ' + comparison.check2.averages[skill] + '%</div>' +
                    '<div style="font-size:0.82rem; font-weight:900; color:' + (isPos ? '#059669' : '#dc2626') + ';">' + (isPos ? '+' + delta : delta) + '%</div>' +
                  '</div>';
              }).join('') +
            '</div>' +
          '</div>' : '') +
      '</div>';
  }

  // =========================================================================
  // 9. STEP 6: REPORTS VIEW (CLASS REPORT & INDIVIDUAL STUDENT REPORT)
  // =========================================================================

  function renderStep6ReportsHTML(store, activeCheck, currentClass, students) {
    const checkId = activeCheck ? activeCheck.id : 'progress-check-a1';
    const reportData = store.generateStudentReportData ? store.generateStudentReportData(checkId, reportSelectedStudentId) : null;

    return '' +
      '<div class="card-panel" style="padding:24px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-light);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-light);">' +
          '<div>' +
            '<h2 style="font-size:1.35rem; font-weight:900; margin:0; color:var(--text-main);">Progress Reports &amp; Evidence Summaries</h2>' +
            '<p style="font-size:0.85rem; color:var(--text-muted); margin:4px 0 0 0;">Printable official progress reports for the whole class and individual students</p>' +
          '</div>' +

          '<div style="display:gap:10px; display:flex;">' +
            '<button type="button" class="btn-primary-action" onclick="openClassReportModal(\'' + checkId + '\')" style="padding:8px 18px; font-weight:800;">' +
              '📊 Generate Class Report' +
            '</button>' +
            '<button type="button" class="btn-sm-secondary" onclick="window.print()" style="padding:8px 16px; font-weight:700;">' +
              '🖨️ Print Student Report' +
            '</button>' +
          '</div>' +
        '</div>' +

        // Student Switcher
        '<div style="display:flex; align-items:center; gap:8px; overflow-x:auto; margin-bottom:20px; padding-bottom:6px;">' +
          students.map(function(s) {
            return '<button type="button" class="btn-sm-secondary ' + (reportSelectedStudentId === s.id ? 'btn-primary-action' : '') + '" onclick="setReportSelectedStudent(\'' + s.id + '\')" style="padding:6px 14px; font-weight:700; white-space:nowrap; border-radius:10px;">' +
              s.firstName + ' ' + s.lastName +
            '</button>';
          }).join('') +
        '</div>' +

        // Student Individual Report Card
        (reportData ?
          '<div style="background:#fff; border:2px solid var(--border-medium); border-radius:14px; padding:24px; max-width:850px; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.04);">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid var(--border-light); padding-bottom:16px; margin-bottom:20px;">' +
              '<div>' +
                '<div style="font-size:0.75rem; font-weight:800; color:#3b82f6; text-transform:uppercase;">OFFICIAL STUDENT PROGRESS REPORT</div>' +
                '<h3 style="font-size:1.5rem; font-weight:900; margin:4px 0; color:var(--text-main);">' + reportData.studentName + '</h3>' +
                '<div style="font-size:0.84rem; color:var(--text-muted);">' + reportData.className + ' · ' + reportData.grade + ' · Assessment: ' + reportData.assessmentDate + '</div>' +
              '</div>' +

              '<div style="text-align:right;">' +
                '<div style="font-size:0.82rem; font-weight:800; color:var(--text-muted);">' + reportData.bookTitle + '</div>' +
                '<div style="font-size:1.1rem; font-weight:900; color:var(--color-primary);">' + reportData.unitTitle + '</div>' +
                '<span class="badge" style="background:#ecfdf5; color:#059669; font-weight:800; padding:2px 8px; border-radius:8px;">4-Week Assessment</span>' +
              '</div>' +
            '</div>' +

            // Skill Breakdown Grid
            '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(110px, 1fr)); gap:10px; margin-bottom:22px;">' +
              Object.keys(reportData.skillScores).map(function(k) {
                const s = reportData.skillScores[k];
                return '' +
                  '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:10px; padding:10px; text-align:center;">' +
                    '<div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">' + k + '</div>' +
                    '<div style="font-size:1.3rem; font-weight:900; margin:4px 0; color:var(--text-main);">' + s.score + '%</div>' +
                    '<div style="font-size:0.7rem; font-weight:800; color:#059669;">' + (s.mastery || 'Secure') + '</div>' +
                  '</div>';
              }).join('') +
            '</div>' +

            // Strengths and Areas to Develop
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">' +
              '<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px;">' +
                '<div style="font-size:0.8rem; font-weight:900; color:#166534; margin-bottom:4px;">🌟 OBSERVED STRENGTHS</div>' +
                '<div style="font-size:0.84rem; color:var(--text-main); line-height:1.5;">' + reportData.strengths + '</div>' +
              '</div>' +
              '<div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:14px;">' +
                '<div style="font-size:0.8rem; font-weight:900; color:#9a3412; margin-bottom:4px;">🎯 NEXT LEARNING PRIORITIES</div>' +
                '<div style="font-size:0.84rem; color:var(--text-main); line-height:1.5;">' + reportData.needsSupport + '</div>' +
              '</div>' +
            '</div>' +

            // Teacher Progress Note (editable right on the report)
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:10px; padding:16px; margin-bottom:20px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<label style="font-size:0.82rem; font-weight:900; color:var(--text-main);">👩‍🏫 Teacher Progress Note &amp; Feedback (Editable):</label>' +
                '<button type="button" class="btn-sm-secondary" onclick="saveReportNote(\'' + checkId + '\', \'' + reportSelectedStudentId + '\')" style="padding:3px 10px; font-size:0.75rem; font-weight:800; background:#ecfdf5; color:#059669;">' +
                  '💾 Update Note' +
                '</button>' +
              '</div>' +
              '<textarea id="report-teacher-note" class="form-input" rows="3" style="width:100%; font-size:0.84rem; line-height:1.5;">' + reportData.teacherNote + '</textarea>' +
            '</div>' +

            // Signature block
            '<div style="display:flex; justify-content:space-between; align-items:flex-end; padding-top:14px; border-top:1px solid var(--border-light); font-size:0.82rem; color:var(--text-muted);">' +
              '<div>Teacher: <strong>Ms. Sarah</strong> · English Adventure Academy</div>' +
              '<div>CEFR Level Decision: <strong style="color:var(--color-primary);">A1</strong></div>' +
            '</div>' +
          '</div>' : '') +
      '</div>';
  }

  // =========================================================================
  // 10. MODALS & AUXILIARY ACTIONS
  // =========================================================================

  window.saveReportNote = function(checkId, studentId) {
    const noteEl = document.getElementById('report-teacher-note');
    if (!noteEl) return;
    const store = window.schoolStore || window.store;
    if (!store) return;

    const rowData = getStudentGradebookRowData(studentId);
    rowData.notes = noteEl.value.trim();
    store.saveClassProgressCheckResults(checkId, [rowData]);

    if (window.showToast) window.showToast('Updated progress note for ' + studentId, 'success');
  };

  window.revealAnswer = function(btnEl, correctAnswer, chosenAnswer) {
    if (btnEl.parentElement) {
      const allBtns = btnEl.parentElement.querySelectorAll('button');
      allBtns.forEach(function(b) {
        if (b.innerText.trim().toLowerCase().indexOf(correctAnswer.toLowerCase()) !== -1) {
          b.style.backgroundColor = '#d1fae5';
          b.style.borderColor = '#10b981';
          b.style.color = '#065f46';
          b.innerText = '✓ ' + b.innerText.replace('✓ ', '');
        }
      });
      if (chosenAnswer.toLowerCase().indexOf(correctAnswer.toLowerCase()) === -1) {
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
    window.renderProgressCheckView();
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
    goToProgressCheckStep(3);
  };

  window.assignRecommendedPracticeToClass = function(resourceId, type) {
    const store = window.schoolStore || window.store;
    if (!store) return;
    const students = store.getStudentsByClass ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

    students.forEach(function(s) {
      if (store.assignRecommendedPractice) {
        store.assignRecommendedPractice(s.id, resourceId, type, selectedProgressCheckId);
      }
    });

    if (window.showToast) window.showToast('Assigned ' + resourceId + ' follow-up practice to Grade 3A!', 'success');
  };

  // Fullscreen Smartboard Modal Runner
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
    const station = stations[classGameStationIdx] || stations[0];
    const students = store ? store.getStudentsByClass(selectedAnalyticsClassId) : [];

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
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">' +
          '<button type="button" class="btn-sm-secondary" onclick="if (classGameStationIdx > 0) { classGameStationIdx--; renderSmartboardModalBody(); }" ' + (classGameStationIdx === 0 ? 'disabled' : '') + '>← Previous Station</button>' +
          (classGameStationIdx < stations.length - 1 ?
            '<button type="button" class="btn-primary-action" onclick="classGameStationIdx++; renderSmartboardModalBody();">Next Station →</button>' :
            '<button type="button" class="btn-primary-action" onclick="closeModal(\'modal-progress-check-runner\'); finishClassroomGame();" style="background:#10b981;">🎉 Complete Assessment</button>'
          ) +
        '</div>' +
      '</div>';
  }

  // Printable A4 Sheet
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
          // Header
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
            '<div><strong>PART E — OBSERVATION:</strong> Use Beginning (1), Developing (2), Secure (3), Strong (4). Enter directly into Step 4 Gradebook.</div>' +
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

  // Class Report Modal
  window.openClassReportModal = function(checkId) {
    const store = window.schoolStore || window.store;
    if (!store) return;
    const rData = store.generateClassReportData ? store.generateClassReportData(checkId) : null;
    if (!rData) return;

    let modal = document.getElementById('modal-progress-check-class-report');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'modal-progress-check-class-report';
      modal.style.zIndex = '1120';
      document.body.appendChild(modal);
    }

    modal.innerHTML = '' +
      '<div class="modal-dialog" style="max-width:800px; max-height:90vh; overflow-y:auto; padding:28px; background:#fff; border-radius:14px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-light); padding-bottom:14px; margin-bottom:20px;">' +
          '<div>' +
            '<div style="font-size:0.75rem; font-weight:800; color:#3b82f6;">CLASSROOM EVIDENCE REPORT</div>' +
            '<h2 style="font-size:1.4rem; font-weight:900; margin:4px 0;">' + rData.className + ' — Progress Report</h2>' +
            '<div style="font-size:0.82rem; color:var(--text-muted);">' + rData.curriculum + ' · ' + rData.unit + ' · ' + rData.period + '</div>' +
          '</div>' +
          '<div style="display:flex; gap:8px;">' +
            '<button type="button" class="btn-primary-action" onclick="window.print()" style="padding:6px 14px; font-weight:800;">🖨️ Print Report</button>' +
            '<button type="button" class="modal-close-btn" style="position:static;" onclick="closeModal(\'modal-progress-check-class-report\')">✕</button>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<h4 style="font-size:0.92rem; font-weight:800; margin-bottom:8px;">Class Skill Performance Averages</h4>' +
          '<div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px; text-align:center;">' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">VOCAB</div><div style="font-size:1.1rem; font-weight:900; color:#10b981;">' + rData.classAverages.vocabulary + '%</div></div>' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">READING</div><div style="font-size:1.1rem; font-weight:900; color:#e11d48;">' + rData.classAverages.reading + '%</div></div>' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">GRAMMAR</div><div style="font-size:1.1rem; font-weight:900; color:#7c3aed;">' + rData.classAverages.grammar + '%</div></div>' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">WRITING</div><div style="font-size:1.1rem; font-weight:900; color:#ca8a04;">' + rData.classAverages.writing + '%</div></div>' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">LISTENING</div><div style="font-size:1.1rem; font-weight:900; color:#0284c7;">' + rData.classAverages.listening + '%</div></div>' +
            '<div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;"><div style="font-size:0.7rem; color:#64748b;">SPEAKING</div><div style="font-size:1.1rem; font-weight:900; color:#ea580c;">' + rData.classAverages.speaking + '%</div></div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:18px;">' +
          '<h4 style="font-size:0.92rem; font-weight:800; margin-bottom:6px;">Teacher Cohort Observations</h4>' +
          '<p style="font-size:0.86rem; line-height:1.6; color:var(--text-main); margin:0;">' + rData.teacherObservations + '</p>' +
        '</div>' +
        '<div>' +
          '<h4 style="font-size:0.92rem; font-weight:800; margin-bottom:6px;">Recommended Next Steps</h4>' +
          '<ul style="margin:0; padding-left:18px; font-size:0.84rem; line-height:1.6;">' +
            rData.recommendedNextSteps.map(function(st) { return '<li>' + st + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +
      '</div>';

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  window.openProgressCheckBuilderModal = function() {
    if (window.openModal) window.openModal('modal-progress-check-builder');
  };

  window.handleSaveProgressCheck = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const store = window.schoolStore || window.store;
    if (!store) return;

    const title = document.getElementById('pc-builder-title') ? document.getElementById('pc-builder-title').value : 'English Adventure Progress Check';
    const grade = document.getElementById('pc-builder-grade') ? document.getElementById('pc-builder-grade').value : 'Grade 3';
    const cefr = document.getElementById('pc-builder-cefr') ? document.getElementById('pc-builder-cefr').value : 'A1';

    store.saveProgressCheck({
      id: 'progress-check-' + Date.now(),
      title: title,
      targetGrade: grade,
      cefrTarget: cefr,
      bookTitle: grade === 'Grade 4' ? 'Global Readings 3' : 'Global Readings 2',
      unitTitle: 'Unit 1',
      unitDuration: '4 weeks',
      assessmentType: 'Whole-Class Progress Check',
      durationMinutes: 45
    });

    if (window.closeModal) window.closeModal('modal-progress-check-builder');
    if (window.showToast) window.showToast('Created new whole-class progress check!', 'success');
    window.renderProgressCheckView();
  };

})(typeof window !== 'undefined' ? window : global);
