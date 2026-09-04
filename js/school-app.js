/**
 * ENGLISH ADVENTURE ACADEMY — SCHOOL PLATFORM CONTROLLER
 * Single-Page Application router, view renderer, and modal controller.
 * Integrates Teacher SaaS, Student Adventure, and Parent views with SchoolStore.
 */

(function() {
  const store = window.schoolStore;
  let currentView = 'dashboard'; // active sub-view for teacher/student

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    setupRoleSwitcher();
    setupHeaderControls();
    setupGlobalShortcuts();

    // Subscribe to store updates
    store.subscribe(() => {
      renderCurrentView();
      updateHeaderBadges();
    });

    // Initial render
    renderNavigation();
    renderCurrentView();
    updateHeaderBadges();
  }

  /* --------------------------------------------------------------------------
     ROLE SWITCHER & HEADER
     -------------------------------------------------------------------------- */
  function setupRoleSwitcher() {
    const roleBtns = document.querySelectorAll('.role-pill-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const role = btn.dataset.role;
        store.setRole(role);

        // Reset default sub-view per role
        if (role === 'teacher') currentView = 'dashboard';
        else if (role === 'student') currentView = 'adventure';
        else if (role === 'parent') currentView = 'parent-home';

        renderNavigation();
        renderCurrentView();
      });
    });
  }

  function setupHeaderControls() {
    const classSelect = document.getElementById('header-class-select');
    if (classSelect) {
      classSelect.value = store.state.activeClassId;
      classSelect.addEventListener('change', (e) => {
        store.setActiveClass(e.target.value);
        renderCurrentView();
      });
    }
  }

  function updateHeaderBadges() {
    const role = store.getRole();
    const classSelect = document.getElementById('header-class-select');
    const userChip = document.getElementById('header-user-chip');

    if (role === 'teacher') {
      if (classSelect) classSelect.style.display = 'block';
      if (userChip) {
        userChip.innerHTML = `
          <div class="avatar-initials">SJ</div>
          <span>Ms. Sarah</span>
        `;
      }
    } else if (role === 'student') {
      if (classSelect) classSelect.style.display = 'none';
      const student = store.getActiveStudent();
      if (userChip) {
        userChip.innerHTML = `
          <div class="avatar-initials" style="background:#fef3c7; color:#b45309;">EC</div>
          <span>Emma Chen (⭐ ${student.xp} XP)</span>
        `;
      }
    } else if (role === 'parent') {
      if (classSelect) classSelect.style.display = 'none';
      if (userChip) {
        userChip.innerHTML = `
          <div class="avatar-initials" style="background:#ecfdf5; color:#047857;">LC</div>
          <span>Mrs. Li Chen</span>
        `;
      }
    }
  }

  function setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input') || document.getElementById('student-search-input');
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  /* --------------------------------------------------------------------------
     NAVIGATION RENDERING
     -------------------------------------------------------------------------- */
  function renderNavigation() {
    const sidebar = document.getElementById('app-sidebar-nav');
    if (!sidebar) return;

    const role = store.getRole();

    if (role === 'teacher') {
      sidebar.innerHTML = `
        <div class="sidebar-group-title" style="padding:4px 8px; font-size:0.72rem; font-weight:700; color:var(--text-subtle); text-transform:uppercase;">Classroom Hub</div>
        <ul class="sidebar-nav-list">
          <li><button class="nav-link-btn ${currentView === 'dashboard' ? 'is-active' : ''}" onclick="switchView('dashboard')"><span class="nav-item-left"><span>📊</span> Dashboard</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'classes' ? 'is-active' : ''}" onclick="switchView('classes')"><span class="nav-item-left"><span>👥</span> Classes</span><span class="nav-badge-pill">${store.getClasses().length}</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'students' ? 'is-active' : ''}" onclick="switchView('students')"><span class="nav-item-left"><span>👧</span> Students</span><span class="nav-badge-pill">${store.state.students.length}</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'curriculum' ? 'is-active' : ''}" onclick="switchView('curriculum')"><span class="nav-item-left"><span>📚</span> Curriculum</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'library' ? 'is-active' : ''}" onclick="switchView('library')"><span class="nav-item-left"><span>🎮</span> Game Library</span><span class="nav-badge-pill">15</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'assignments' ? 'is-active' : ''}" onclick="switchView('assignments')"><span class="nav-item-left"><span>📝</span> Assignments</span><span class="nav-badge-pill">${store.getAssignments().length}</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'attendance' ? 'is-active' : ''}" onclick="switchView('attendance')"><span class="nav-item-left"><span>📋</span> Attendance</span></button></li>
          <div class="sidebar-hr"></div>
          <div class="sidebar-group-title" style="padding:4px 8px; font-size:0.72rem; font-weight:700; color:var(--text-subtle); text-transform:uppercase;">Community</div>
          <li><button class="nav-link-btn ${currentView === 'story' ? 'is-active' : ''}" onclick="switchView('story')"><span class="nav-item-left"><span>📸</span> Class Story</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'messages' ? 'is-active' : ''}" onclick="switchView('messages')"><span class="nav-item-left"><span>💬</span> Messages</span><span class="nav-badge-pill" style="background:#fee2e2; color:#b91c1c;">1</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'reports' ? 'is-active' : ''}" onclick="switchView('reports')"><span class="nav-item-left"><span>📄</span> Student Reports</span></button></li>
        </ul>
      `;
    } else if (role === 'student') {
      sidebar.innerHTML = `
        <div class="sidebar-group-title" style="padding:4px 8px; font-size:0.72rem; font-weight:700; color:var(--text-subtle); text-transform:uppercase;">Emma's Journey</div>
        <ul class="sidebar-nav-list">
          <li><button class="nav-link-btn ${currentView === 'adventure' ? 'is-active' : ''}" onclick="switchView('adventure')"><span class="nav-item-left"><span>🗺️</span> Adventure Map</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'library' ? 'is-active' : ''}" onclick="switchView('library')"><span class="nav-item-left"><span>🎮</span> All Games</span><span class="nav-badge-pill">15</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'student-tasks' ? 'is-active' : ''}" onclick="switchView('student-tasks')"><span class="nav-item-left"><span>⭐</span> My Tasks</span><span class="nav-badge-pill" style="background:#fef3c7; color:#b45309;">2</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'student-badges' ? 'is-active' : ''}" onclick="switchView('student-badges')"><span class="nav-item-left"><span>🏆</span> Badges &amp; Avatar</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'leaderboard' ? 'is-active' : ''}" onclick="switchView('leaderboard')"><span class="nav-item-left"><span>🏅</span> Class Leaderboard</span></button></li>
        </ul>
      `;
    } else if (role === 'parent') {
      sidebar.innerHTML = `
        <div class="sidebar-group-title" style="padding:4px 8px; font-size:0.72rem; font-weight:700; color:var(--text-subtle); text-transform:uppercase;">Parent Portal</div>
        <ul class="sidebar-nav-list">
          <li><button class="nav-link-btn ${currentView === 'parent-home' ? 'is-active' : ''}" onclick="switchView('parent-home')"><span class="nav-item-left"><span>👧</span> Emma's Progress</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'parent-homework' ? 'is-active' : ''}" onclick="switchView('parent-homework')"><span class="nav-item-left"><span>📚</span> Homework Checklist</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'story' ? 'is-active' : ''}" onclick="switchView('story')"><span class="nav-item-left"><span>📸</span> Class Story</span></button></li>
          <li><button class="nav-link-btn ${currentView === 'messages' ? 'is-active' : ''}" onclick="switchView('messages')"><span class="nav-item-left"><span>💬</span> Teacher Messages</span></button></li>
        </ul>
      `;
    }
  }

  window.switchView = function(viewName) {
    currentView = viewName;
    renderNavigation();
    renderCurrentView();
  };

  /* --------------------------------------------------------------------------
     VIEW ROUTER
     -------------------------------------------------------------------------- */
  function renderCurrentView() {
    const container = document.getElementById('app-view-container');
    if (!container) return;

    switch (currentView) {
      case 'dashboard':
        renderTeacherDashboard(container);
        break;
      case 'classes':
        renderClassesView(container);
        break;
      case 'students':
        renderStudentsView(container);
        break;
      case 'curriculum':
        renderCurriculumView(container);
        break;
      case 'library':
        renderLibraryView(container);
        break;
      case 'assignments':
        renderAssignmentsView(container);
        break;
      case 'attendance':
        renderAttendanceView(container);
        break;
      case 'story':
        renderClassStoryView(container);
        break;
      case 'messages':
        renderMessagesView(container);
        break;
      case 'reports':
        renderReportsView(container);
        break;
      case 'adventure':
        renderStudentAdventureView(container);
        break;
      case 'student-tasks':
        renderStudentTasksView(container);
        break;
      case 'student-badges':
        renderStudentBadgesView(container);
        break;
      case 'leaderboard':
        renderLeaderboardView(container);
        break;
      case 'parent-home':
        renderParentHomeView(container);
        break;
      case 'parent-homework':
        renderParentHomeworkView(container);
        break;
      default:
        renderTeacherDashboard(container);
    }
  }

  /* --------------------------------------------------------------------------
     1. TEACHER DASHBOARD
     -------------------------------------------------------------------------- */
  function renderTeacherDashboard(container) {
    const activeClass = store.getActiveClass();
    const classStudents = store.getStudentsByClass(activeClass.id);

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Good afternoon, Ms. Sarah 👋</h1>
        <p class="view-sub">English Adventure Academy · <strong>${activeClass.name}</strong> overview and student performance.</p>
      </div>

      <!-- 4 KPI Stat Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Active Students</span>
          <span class="kpi-val">${classStudents.length}</span>
          <span class="kpi-sub">✓ Enrolled in ${activeClass.grade}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Active Classes</span>
          <span class="kpi-val">${store.getClasses().length}</span>
          <span class="kpi-sub">Grade 3A &amp; Grade 4B</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Average CEFR Progress</span>
          <span class="kpi-val">${activeClass.avgProgress}%</span>
          <span class="kpi-sub">↑ +4% this month</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Attendance Rate</span>
          <span class="kpi-val">${activeClass.attendanceRate}%</span>
          <span class="kpi-sub">✓ High classroom presence</span>
        </div>
      </div>

      <!-- 2-Column Dashboard Panels -->
      <div class="dashboard-columns">
        <div>
          <!-- Today's Schedule -->
          <div class="panel-card">
            <div class="panel-title">
              <span>Today's Classes</span>
              <button class="btn-sm-secondary" onclick="switchView('attendance')">Take Roll Call</button>
            </div>

            <div class="class-schedule-card">
              <div class="class-info-wrap">
                <h4>Grade 3A — The Explorers</h4>
                <p>Unit 4: At the Restaurant (Polite Requests &amp; Menu Ordering) · 14:00 – 14:40 · Room 204</p>
              </div>
              <a href="restaurant/index.html" class="btn-start-class">▶ START CLASS</a>
            </div>

            <div class="class-schedule-card" style="border-left-color: #7c3aed;">
              <div class="class-info-wrap">
                <h4>Grade 4B — The Adventurers</h4>
                <p>Unit 7: The Crazy Advice Academy (Should &amp; Shouldn't) · 10:00 – 10:45 · Room 205</p>
              </div>
              <a href="advice/index.html" class="btn-start-class">▶ START CLASS</a>
            </div>
          </div>

          <!-- Needs Attention Alerts -->
          <div class="panel-card">
            <div class="panel-title">
              <span>Student Alerts: Needs Support</span>
              <span style="font-size:0.75rem; color:var(--text-subtle); font-weight:600;">Automated Diagnostic</span>
            </div>

            <div class="attention-card">
              <h5>⚠️ Adam Miller — Modal Verb "Can/Can't" Support</h5>
              <p>Adam scored 54% on the creature abilities challenge. Recommended action: 10 minutes of Speaking practice with the <strong>Life in the Jungle</strong> animal explorer.</p>
              <div style="margin-top: 8px;">
                <a href="jungle/index.html" class="btn-sm-secondary" style="background:#ffffff; display:inline-block;">Launch Jungle Practice</a>
              </div>
            </div>

            <div class="attention-card" style="border-left-color: #ef4444; background: #fff1f2; border-color: #fecdd3;">
              <h5 style="color: #9f1239;">⚠️ Noah Kim — Absent Yesterday</h5>
              <p style="color: #881337;">Missed Fire Station Adventure roleplay. Sent a catch-up message to parent Eun-Ji Kim with printable worksheet.</p>
            </div>
          </div>
        </div>

        <div>
          <!-- Live Activity Stream -->
          <div class="panel-card">
            <div class="panel-title">Recent Activity</div>
            <div class="activity-item">
              <div class="activity-dot"></div>
              <div>
                <div class="activity-text"><strong>Emma Chen</strong> scored 88% on Monster Builder</div>
                <div class="activity-time">15 minutes ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-dot" style="background:#10b981;"></div>
              <div>
                <div class="activity-text"><strong>Adam Miller</strong> completed Restaurant Roleplay</div>
                <div class="activity-time">45 minutes ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-dot" style="background:#f59e0b;"></div>
              <div>
                <div class="activity-text"><strong>Sophia Rossi</strong> unlocked <em>Animal Kingdom</em> world!</div>
                <div class="activity-time">2 hours ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-dot" style="background:#7c3aed;"></div>
              <div>
                <div class="activity-text"><strong>Ms. Sarah</strong> published a new Class Story update</div>
                <div class="activity-time">3 hours ago</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="panel-card">
            <div class="panel-title">Quick Actions</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn-sm-secondary" onclick="openModal('modal-add-student')">➕ Add New Student</button>
              <button class="btn-sm-secondary" onclick="openModal('modal-create-assignment')">📝 Create Assignment</button>
              <button class="btn-sm-secondary" onclick="switchView('library')">🎮 Browse 15 Games</button>
              <button class="btn-sm-secondary" onclick="switchView('reports')">📄 Generate Term Report</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     2. CLASSES VIEW
     -------------------------------------------------------------------------- */
  function renderClassesView(container) {
    const classes = store.getClasses();

    container.innerHTML = `
      <div class="controls-header-bar">
        <div>
          <h1 class="view-greeting">Class Management</h1>
          <p class="view-sub">Manage your student cohorts, schedules, and learning tracks.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-add-class')">➕ Create New Class</button>
      </div>

      <div class="classes-cards-grid">
        ${classes.map(c => `
          <div class="class-box-card">
            <div>
              <div class="class-box-header">
                <div>
                  <h3 class="class-title">${c.name}</h3>
                  <p class="class-meta-sub">${c.room} · ${c.schedule}</p>
                </div>
                <span class="cefr-pill">${c.cefr}</span>
              </div>

              <div class="class-stat-bars" style="margin-top:16px;">
                <div class="stat-bar-row">
                  <span>Enrolled Students</span>
                  <strong>${store.getStudentsByClass(c.id).length} students</strong>
                </div>
                <div class="stat-bar-row">
                  <span>CEFR Mastery Progress</span>
                  <strong>${c.avgProgress}%</strong>
                </div>
                <div class="stat-bar-row">
                  <span>Attendance Rate</span>
                  <strong>${c.attendanceRate}%</strong>
                </div>
              </div>
            </div>

            <div class="class-actions-row">
              <button class="btn-sm-secondary" onclick="store.setActiveClass('${c.id}'); switchView('students');">Students</button>
              <button class="btn-sm-secondary" onclick="store.setActiveClass('${c.id}'); switchView('attendance');">Attendance</button>
              <button class="btn-sm-secondary" onclick="store.setActiveClass('${c.id}'); switchView('assignments');">Assignments</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     3. STUDENTS VIEW & PROFILE MODAL
     -------------------------------------------------------------------------- */
  function renderStudentsView(container) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);

    container.innerHTML = `
      <div class="controls-header-bar">
        <div>
          <h1 class="view-greeting">Students — ${activeClass.name}</h1>
          <p class="view-sub">Track CEFR proficiency, skill breakdown, and individual can-do learning targets.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="student-search-input" placeholder="Search students..." class="filter-select" style="width:200px;" oninput="filterStudents(this.value)" />
          <button class="btn-primary-action" onclick="openModal('modal-add-student')">➕ Add Student</button>
        </div>
      </div>

      <div class="students-grid" id="students-cards-container">
        ${students.map(s => renderStudentCard(s)).join('')}
      </div>
    `;
  }

  function renderStudentCard(student) {
    return `
      <div class="student-card" onclick="openStudentDetail('${student.id}')">
        <div class="student-avatar-box">
          ${student.firstName.charAt(0)}${student.lastName.charAt(0)}
        </div>
        <div class="student-info-col">
          <div class="student-name">${student.firstName} ${student.lastName}</div>
          <div class="student-meta">
            <span class="cefr-pill">${student.overallCefr}</span>
            <span>·</span>
            <span>Age ${student.age}</span>
            <span>·</span>
            <span class="xp-badge">⭐ ${student.xp} XP</span>
          </div>
        </div>
      </div>
    `;
  }

  window.filterStudents = function(query) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);
    const q = query.toLowerCase().trim();
    const filtered = students.filter(s => 
      s.firstName.toLowerCase().includes(q) || 
      s.lastName.toLowerCase().includes(q) ||
      s.overallCefr.toLowerCase().includes(q)
    );
    const container = document.getElementById('students-cards-container');
    if (container) {
      container.innerHTML = filtered.map(s => renderStudentCard(s)).join('');
    }
  };

  window.openStudentDetail = function(studentId) {
    const student = store.getStudent(studentId);
    if (!student) return;

    const modal = document.getElementById('modal-student-profile');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close-btn" onclick="closeAllModals()">✕</button>

        <div style="display:flex; align-items:center; gap:16px; border-bottom:1px solid var(--border-light); padding-bottom:16px; margin-bottom:20px;">
          <div class="student-avatar-box" style="width:64px; height:64px; font-size:1.6rem;">
            ${student.firstName.charAt(0)}${student.lastName.charAt(0)}
          </div>
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; color:var(--text-main);">${student.firstName} ${student.lastName}</h2>
            <p style="font-size:0.86rem; color:var(--text-muted);">
              ${student.grade} · CEFR: <strong style="color:var(--color-primary);">${student.overallCefr}</strong> · ⭐ ${student.xp} XP · 🔥 ${student.streakDays}-day streak
            </p>
          </div>
        </div>

        <!-- CEFR Skills Breakdown -->
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:10px;">CEFR Skill Breakdown</h3>
        <div class="skills-progress-grid">
          ${Object.entries(student.skills).map(([skillKey, skillObj]) => `
            <div class="skill-bar-item">
              <div class="skill-bar-header">
                <span style="text-transform:capitalize;">${skillKey} (${skillObj.cefr})</span>
                <strong>${skillObj.score}%</strong>
              </div>
              <div class="skill-progress-track">
                <div class="skill-progress-fill" style="width: ${skillObj.score}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Can-Do Statements -->
        <div style="margin-top:20px;">
          <h4 style="font-size:0.9rem; font-weight:700; color:#059669; margin-bottom:6px;">✓ What ${student.firstName} Can Do</h4>
          <ul class="can-do-list">
            ${student.canDo.map(c => `<li class="can-do-item"><span class="can-do-check">✓</span> ${c}</li>`).join('')}
          </ul>
        </div>

        <!-- Developing & Needs Practice -->
        <div style="margin-top:16px;">
          <h4 style="font-size:0.9rem; font-weight:700; color:#d97706; margin-bottom:6px;">🟡 Currently Developing</h4>
          <ul class="can-do-list">
            ${student.developing.map(d => `<li class="can-do-item"><span class="can-do-dev">●</span> ${d}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top:16px;">
          <h4 style="font-size:0.9rem; font-weight:700; color:#e11d48; margin-bottom:6px;">🔴 Needs Practice &amp; Support</h4>
          <ul class="can-do-list">
            ${student.needsPractice.map(n => `<li class="can-do-item"><span class="can-do-need">▲</span> ${n}</li>`).join('')}
          </ul>
        </div>

        <!-- Private Teacher Notes -->
        <div style="margin-top:24px; border-top:1px solid var(--border-light); padding-top:16px;">
          <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:8px;">🔒 Private Teacher Notes</h4>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input type="text" id="new-teacher-note-input" placeholder="Add private observation..." class="filter-select" style="flex:1;" />
            <button class="btn-primary-action" onclick="saveTeacherNote('${student.id}')">Save Note</button>
          </div>
          <div id="teacher-notes-list" style="display:flex; flex-direction:column; gap:6px;">
            ${student.teacherNotes.map(n => `
              <div style="background:var(--bg-muted); padding:8px 12px; border-radius:var(--radius-sm); font-size:0.82rem;">
                <span style="font-weight:700; color:var(--text-subtle);">${n.date}:</span> ${n.note}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    modal.classList.add('is-open');
  };

  window.saveTeacherNote = function(studentId) {
    const input = document.getElementById('new-teacher-note-input');
    if (!input || !input.value.trim()) return;
    store.addTeacherNote(studentId, input.value.trim());
    openStudentDetail(studentId);
  };

  /* --------------------------------------------------------------------------
     4. CURRICULUM VIEW
     -------------------------------------------------------------------------- */
  function renderCurriculumView(container) {
    const units = store.state.curriculum;

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">ESL Curriculum &amp; Syllabus</h1>
        <p class="view-sub">Structured learning progression aligned with CEFR Pre-A1 to A2.</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${units.map(unit => `
          <div class="panel-card" style="border-left:4px solid ${unit.color};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <div>
                <span style="font-size:0.75rem; font-weight:700; color:${unit.color}; text-transform:uppercase;">${unit.book} · Unit ${unit.unitNumber}</span>
                <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-top:2px;">${unit.title}</h3>
                <span style="font-size:0.8rem; color:var(--text-muted);">Level: <strong>${unit.level}</strong> · ${unit.targetAge}</span>
              </div>
              <div style="display:flex; gap:8px;">
                <a href="${unit.lessonRoute}" class="btn-start-class" style="background:${unit.color};">▶ Launch Game Lesson</a>
                ${unit.worksheetRoute ? `
                  <a href="${unit.worksheetRoute}" target="_blank" class="btn-sm-secondary">🖨️ Printable Worksheets</a>
                ` : ''}
              </div>
            </div>

            <h4 style="font-size:0.82rem; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">Learning Objectives:</h4>
            <ul style="list-style:disc; margin-left:20px; font-size:0.84rem; color:var(--text-muted); line-height:1.6;">
              ${unit.objectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     5. GAME LIBRARY VIEW (15 GAMES WITH 1-CLICK LAUNCH)
     -------------------------------------------------------------------------- */
  function renderLibraryView(container) {
    const games = window.GAMES_REGISTRY || [];

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Game Library</h1>
        <p class="view-sub">All 15 interactive English classroom games ready to play with one click.</p>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
        <input type="text" id="lib-search-input" placeholder="Search games, topics, vocabulary..." class="filter-select" style="flex:1; min-width:240px;" oninput="filterLibraryGames(this.value)" />
        <select id="lib-level-select" class="filter-select" onchange="filterLibraryGames()">
          <option value="">All Levels</option>
          <option value="A1">A1 Beginner</option>
          <option value="A1+">A1+ Elementary</option>
          <option value="A2">A2 Pre-Intermediate</option>
        </select>
        <select id="lib-cat-select" class="filter-select" onchange="filterLibraryGames()">
          <option value="">All Categories</option>
          <option value="Classroom Games">Classroom Games</option>
          <option value="Interactive Stories">Interactive Stories</option>
          <option value="Mystery & Detective">Mystery &amp; Detective</option>
          <option value="Speaking Games">Speaking Games</option>
          <option value="Grammar Games">Grammar Games</option>
          <option value="Role Plays">Role Plays</option>
          <option value="Quick Warm-ups">Quick Warm-ups</option>
          <option value="CLIL">CLIL</option>
        </select>
      </div>

      <div class="games-grid" id="lib-games-grid">
        ${games.map(g => renderGameCardMarkup(g)).join('')}
      </div>
    `;
  }

  function renderGameCardMarkup(game) {
    return `
      <article class="game-card" data-id="${game.id}">
        <div class="card-thumbnail">
          ${game.thumbnailSvg}
          <span class="level-badge">${game.level}</span>
        </div>
        <div class="card-body">
          <span class="card-category-pill">${game.category}</span>
          <h3 class="card-title">${game.title}</h3>
          <p class="card-desc">${game.description}</p>
          <div class="card-meta">
            <span>${game.level}</span> · <span>${game.age}</span> · <span>${game.durationText}</span>
          </div>
          <div class="card-skills">
            ${game.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <a href="${game.route}" class="btn-start">
            <span>▶ START GAME</span>
          </a>
          ${game.worksheet ? `
            <a href="${game.worksheet}" target="_blank" class="btn-worksheet">Worksheet</a>
          ` : ''}
        </div>
      </article>
    `;
  }

  window.filterLibraryGames = function() {
    const q = (document.getElementById('lib-search-input')?.value || '').toLowerCase().trim();
    const lvl = document.getElementById('lib-level-select')?.value || '';
    const cat = document.getElementById('lib-cat-select')?.value || '';
    const games = window.GAMES_REGISTRY || [];

    const filtered = games.filter(g => {
      const matchQ = !q || g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || (g.topic && g.topic.toLowerCase().includes(q));
      const matchLvl = !lvl || g.level === lvl;
      const matchCat = !cat || g.category === cat;
      return matchQ && matchLvl && matchCat;
    });

    const grid = document.getElementById('lib-games-grid');
    if (grid) {
      grid.innerHTML = filtered.map(g => renderGameCardMarkup(g)).join('');
    }
  };

  /* --------------------------------------------------------------------------
     6. ASSIGNMENTS VIEW
     -------------------------------------------------------------------------- */
  function renderAssignmentsView(container) {
    const assignments = store.getAssignments();

    container.innerHTML = `
      <div class="controls-header-bar">
        <div>
          <h1 class="view-greeting">Classroom Assignments</h1>
          <p class="view-sub">Assign interactive games, worksheets, and quizzes to your students.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-create-assignment')">➕ Create Assignment</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${assignments.map(a => `
          <div class="panel-card" style="display:flex; justify-content:space-between; align-items:center; gap:16px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span class="cefr-pill" style="background:#fef3c7; color:#b45309; text-transform:capitalize;">${a.type}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">Due: <strong>${a.dueDate}</strong></span>
              </div>
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">${a.title}</h3>
              <p style="font-size:0.8rem; color:var(--text-muted);">Objectives: ${a.objectives.join(' · ')}</p>
            </div>

            <div style="text-align:right;">
              <div style="font-size:0.86rem; font-weight:700; color:var(--text-main);">${a.completedCount} / ${a.assignedCount} Completed</div>
              <div style="font-size:0.75rem; color:var(--color-success); font-weight:600;">Avg Score: ${a.avgScore}%</div>
              <a href="${a.gameRoute}" class="btn-start-class" style="margin-top:6px; display:inline-block;">▶ Open Task</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. ATTENDANCE VIEW
     -------------------------------------------------------------------------- */
  function renderAttendanceView(container) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);
    const records = store.getTodayAttendance(activeClass.id);

    container.innerHTML = `
      <div class="controls-header-bar">
        <div>
          <h1 class="view-greeting">Daily Roll Call &amp; Attendance</h1>
          <p class="view-sub">${activeClass.name} · Today: <strong>September 4, 2026</strong></p>
        </div>
        <button class="btn-primary-action" onclick="saveAttendanceAlert()">💾 Save Attendance</button>
      </div>

      <table class="attendance-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Status</th>
            <th>Attendance Actions</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(s => {
            const currentStatus = records[s.id] || 'present';
            return `
              <tr>
                <td><strong>${s.firstName} ${s.lastName}</strong></td>
                <td>
                  <span class="att-pill-btn is-${currentStatus}" style="text-transform:capitalize;">${currentStatus}</span>
                </td>
                <td>
                  <div class="status-pill-group">
                    <button class="att-pill-btn ${currentStatus === 'present' ? 'is-present' : ''}" onclick="setAttendanceStatus('${s.id}', 'present')">Present</button>
                    <button class="att-pill-btn ${currentStatus === 'late' ? 'is-late' : ''}" onclick="setAttendanceStatus('${s.id}', 'late')">Late</button>
                    <button class="att-pill-btn ${currentStatus === 'absent' ? 'is-absent' : ''}" onclick="setAttendanceStatus('${s.id}', 'absent')">Absent</button>
                    <button class="att-pill-btn ${currentStatus === 'excused' ? 'is-excused' : ''}" onclick="setAttendanceStatus('${s.id}', 'excused')">Excused</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  window.setAttendanceStatus = function(studentId, status) {
    store.setStudentAttendance(studentId, status);
    renderAttendanceView(document.getElementById('app-view-container'));
  };

  window.saveAttendanceAlert = function() {
    alert('✓ Attendance records saved successfully to class register!');
  };

  /* --------------------------------------------------------------------------
     8. CLASS STORY VIEW
     -------------------------------------------------------------------------- */
  function renderClassStoryView(container) {
    const posts = store.getClassStory();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Class Story</h1>
        <p class="view-sub">Share classroom moments, achievements, and announcements with parents.</p>
      </div>

      <!-- Post Composer -->
      <div class="story-composer-box">
        <textarea id="story-post-input" class="story-textarea" placeholder="Share what your class learned today with parents..."></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--text-muted);">Visible to all parents in Grade 3A</span>
          <button class="btn-primary-action" onclick="publishStoryPost()">📢 Post to Class Story</button>
        </div>
      </div>

      <!-- Feed -->
      <div>
        ${posts.map(p => `
          <div class="story-post-card">
            <div class="story-post-header">
              <div class="story-author-info">
                <div class="avatar-initials">SJ</div>
                <div>
                  <div style="font-size:0.9rem; font-weight:700;">${p.author}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${p.date} · <span class="cefr-pill" style="font-size:0.65rem;">${p.tag}</span></div>
                </div>
              </div>
            </div>
            <div class="story-post-body">${p.content}</div>
            ${p.imageSvg ? `<div class="story-post-img-box">${p.imageSvg}</div>` : ''}
            <div class="story-post-footer">
              <button class="btn-like" onclick="store.likeStoryPost('${p.id}')">❤️ ${p.likes} Likes</button>
              <span style="font-size:0.78rem; color:var(--text-subtle);">${p.comments.length} Parent Comments</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.publishStoryPost = function() {
    const input = document.getElementById('story-post-input');
    if (!input || !input.value.trim()) return;
    store.addStoryPost({
      content: input.value.trim(),
      tag: 'Class Update',
      classId: store.state.activeClassId
    });
    input.value = '';
    renderCurrentView();
  };

  /* --------------------------------------------------------------------------
     9. MESSAGES VIEW
     -------------------------------------------------------------------------- */
  function renderMessagesView(container) {
    const messages = store.getMessageThreads();
    const activeThread = messages[0];

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Teacher - Parent Messaging</h1>
        <p class="view-sub">Direct, private communication with families.</p>
      </div>

      <div class="messages-split-view">
        <div class="threads-sidebar">
          ${messages.map((m, idx) => `
            <div class="thread-item-btn ${idx === 0 ? 'is-active' : ''}">
              <div class="thread-name">${m.parentName} (${m.parentRelation})</div>
              <div class="thread-sub">Last activity: ${m.lastActivity}</div>
            </div>
          `).join('')}
        </div>

        <div class="chat-pane">
          <div class="chat-history">
            ${activeThread.threads.map(t => `
              <div class="chat-bubble ${t.sender}">
                <div>${t.text}</div>
                <div style="font-size:0.68rem; opacity:0.75; margin-top:2px;">${t.time}</div>
              </div>
            `).join('')}
          </div>

          <div class="chat-input-bar">
            <input type="text" id="parent-msg-input" class="chat-input" placeholder="Type a private message to parent..." />
            <button class="btn-primary-action" onclick="sendMessageToParent('${activeThread.id}')">Send</button>
          </div>
        </div>
      </div>
    `;
  }

  window.sendMessageToParent = function(threadId) {
    const input = document.getElementById('parent-msg-input');
    if (!input || !input.value.trim()) return;
    store.sendParentMessage(threadId, input.value.trim());
    input.value = '';
    renderCurrentView();
  };

  /* --------------------------------------------------------------------------
     10. REPORTS VIEW
     -------------------------------------------------------------------------- */
  function renderReportsView(container) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);
    const selectedStudent = store.getActiveStudent();

    container.innerHTML = `
      <div class="controls-header-bar">
        <div>
          <h1 class="view-greeting">Student Term Progress Reports</h1>
          <p class="view-sub">Official ESL diagnostic, CEFR benchmark, and learning summary report cards.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <select class="filter-select" onchange="store.setActiveStudent(this.value); renderCurrentView();">
            ${students.map(s => `
              <option value="${s.id}" ${s.id === selectedStudent.id ? 'selected' : ''}>${s.firstName} ${s.lastName} (${s.overallCefr})</option>
            `).join('')}
          </select>
          <button class="btn-primary-action" onclick="window.print()">🖨️ Print / Export PDF</button>
        </div>
      </div>

      <div class="report-card-container">
        <div class="report-header">
          <div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-main);">English Adventure Academy</h2>
            <p style="font-size:0.86rem; color:var(--text-muted);">ESL Student Progress Report · Term 1 (September 2026)</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--color-primary);">${selectedStudent.firstName} ${selectedStudent.lastName}</div>
            <div style="font-size:0.82rem; color:var(--text-muted);">${selectedStudent.grade} · CEFR Level: <strong>${selectedStudent.overallCefr}</strong></div>
          </div>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th>Language Skill Area</th>
              <th>Mastery Score</th>
              <th>CEFR Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(selectedStudent.skills).map(([key, val]) => `
              <tr>
                <td style="text-transform:capitalize; font-weight:600;">${key}</td>
                <td>${val.score}%</td>
                <td><span class="cefr-pill">${val.cefr}</span></td>
                <td>${val.score >= 80 ? '✓ Secure' : val.score >= 65 ? '🟡 Developing' : '🔴 Needs Support'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top:20px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">Key Strengths &amp; Accomplishments:</h4>
          <ul class="can-do-list">
            ${selectedStudent.canDo.map(c => `<li class="can-do-item"><span class="can-do-check">✓</span> ${c}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top:16px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">Target Growth Areas for Next Term:</h4>
          <ul class="can-do-list">
            ${selectedStudent.needsPractice.map(n => `<li class="can-do-item"><span class="can-do-need">▲</span> ${n}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top:24px; padding:16px; background:var(--bg-muted); border-radius:var(--radius-sm);">
          <h4 style="font-size:0.88rem; font-weight:700; margin-bottom:4px;">Lead Teacher Remarks:</h4>
          <p style="font-size:0.84rem; color:var(--text-secondary); line-height:1.5;">
            ${selectedStudent.firstName} shows wonderful enthusiasm and confidence during classroom roleplays and interactive story sessions. Continuing to practice full sentence writing and Wh-question structures at home will solidify these fantastic achievements.
          </p>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     11. STUDENT ADVENTURE VIEW
     -------------------------------------------------------------------------- */
  function renderStudentAdventureView(container) {
    const student = store.getActiveStudent();

    container.innerHTML = `
      <!-- Hero Greeting Banner -->
      <div class="student-hero-banner">
        <div>
          <h1 style="font-size:1.8rem; font-weight:800;">Hi ${student.firstName}! 👋</h1>
          <p style="font-size:0.95rem; opacity:0.9; margin-top:2px;">Your English Adventure is waiting! Play games, earn stars, and unlock new worlds.</p>
          <div class="hero-stats-chips">
            <div class="hero-chip">⭐ ${student.xp} XP</div>
            <div class="hero-chip">🔥 ${student.streakDays}-Day Streak!</div>
            <div class="hero-chip">🏆 ${student.badges.length} Badges</div>
          </div>
        </div>
        <button class="btn-primary-action" style="background:#ffffff; color:#4f46e5;" onclick="openModal('modal-avatar-customizer')">
          🎨 Customize Avatar
        </button>
      </div>

      <!-- 5 Unlockable Worlds Trail -->
      <div class="adventure-map-container">
        <h2 class="map-title">🗺️ Your Learning Worlds</h2>
        <p class="map-sub">Complete lessons and games to power up your rocket and unlock new islands!</p>

        <div class="worlds-trail">
          ${student.unlockedWorlds.map(w => `
            <div class="world-node is-${w.status}">
              <div class="world-icon">${w.icon}</div>
              <div class="world-name">${w.name}</div>
              <span class="world-status-tag">${w.status}</span>
              <div style="font-size:0.72rem; color:var(--text-muted);">${w.progress}% completed</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div class="panel-card" style="border-left:4px solid #f59e0b;">
          <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">⭐ Assigned Mission</h3>
          <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:12px;">Build Your Own Monster: Adjective Workshop</p>
          <a href="monster-day/index.html" class="btn-start-class" style="background:#f59e0b;">▶ Play Mission Now (+50 XP)</a>
        </div>
        <div class="panel-card" style="border-left:4px solid #10b981;">
          <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">📖 Story Stage</h3>
          <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:12px;">The Wizard of Oz: Follow the Yellow Brick Road</p>
          <a href="story/index.html" class="btn-start-class" style="background:#10b981;">▶ Enter Story Stage</a>
        </div>
      </div>
    `;
  }

  function renderStudentTasksView(container) {
    const assignments = store.getAssignments('class-3a');

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">⭐ My Tasks &amp; Missions</h1>
        <p class="view-sub">Complete your missions to earn XP and level up!</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${assignments.map(a => `
          <div class="panel-card" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span class="cefr-pill" style="background:#fef3c7; color:#b45309;">Due: ${a.dueDate}</span>
              <h3 style="font-size:1.1rem; font-weight:700; margin-top:4px;">${a.title}</h3>
              <p style="font-size:0.84rem; color:var(--text-muted);">${a.objectives.join(' · ')}</p>
            </div>
            <a href="${a.gameRoute}" class="btn-start-class">▶ Launch Game (+40 XP)</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderStudentBadgesView(container) {
    const student = store.getActiveStudent();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">🏆 Badges &amp; Trophies</h1>
        <p class="view-sub">Your earned awards for speaking, listening, and storytelling!</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:16px;">
        ${student.badges.map(b => `
          <div class="panel-card" style="text-align:center; padding:24px;">
            <div style="font-size:42px; margin-bottom:8px;">${b.icon}</div>
            <h3 style="font-size:1rem; font-weight:700;">${b.name}</h3>
            <p style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">${b.desc}</p>
            <div style="font-size:0.7rem; color:var(--color-primary); font-weight:700; margin-top:8px;">Earned ${b.date}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderLeaderboardView(container) {
    const students = [...store.getStudentsByClass('class-3a')].sort((a, b) => b.xp - a.xp);

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">🏅 Classroom Stars Leaderboard</h1>
        <p class="view-sub">Positive points showcase celebrating everyone's hard work!</p>
      </div>

      <div class="panel-card" style="max-width:600px;">
        ${students.map((s, idx) => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-light);">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:1.2rem; font-weight:800; width:28px;">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1)}</span>
              <div>
                <strong style="font-size:0.95rem;">${s.firstName} ${s.lastName}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">🔥 ${s.streakDays}-day streak</div>
              </div>
            </div>
            <span class="xp-badge" style="font-size:0.85rem;">⭐ ${s.xp} XP</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     12. PARENT PORTAL VIEWS
     -------------------------------------------------------------------------- */
  function renderParentHomeView(container) {
    const student = store.getActiveStudent();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Welcome, Mrs. Li Chen 👋</h1>
        <p class="view-sub">Viewing learning progress and school activities for <strong>${student.firstName} Chen</strong> (Grade 3A).</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Current CEFR Level</span>
          <span class="kpi-val" style="color:var(--color-primary);">${student.overallCefr}</span>
          <span class="kpi-sub">✓ On track for Grade 3</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Attendance Rate</span>
          <span class="kpi-val">98%</span>
          <span class="kpi-sub">✓ Present all this week</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Completed Missions</span>
          <span class="kpi-val">8</span>
          <span class="kpi-sub">⭐ 1,240 Total XP</span>
        </div>
      </div>

      <div class="dashboard-columns">
        <div>
          <div class="panel-card">
            <div class="panel-title">What Emma Mastered This Week</div>
            <ul class="can-do-list">
              ${student.canDo.map(c => `<li class="can-do-item"><span class="can-do-check">✓</span> ${c}</li>`).join('')}
            </ul>
          </div>

          <div class="panel-card">
            <div class="panel-title">Verified Student Work &amp; Portfolio</div>
            ${store.state.portfolio.map(p => `
              <div style="padding:10px 0; border-bottom:1px solid var(--border-light);">
                <strong>${p.title}</strong> (${p.type})
                <p style="font-size:0.82rem; color:var(--text-muted); margin:2px 0;">${p.teacherComment}</p>
                <span style="font-size:0.72rem; color:var(--color-success); font-weight:700;">✓ Verified by Ms. Sarah</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="panel-card">
            <div class="panel-title">Direct Contact with Ms. Sarah</div>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">Have questions regarding Emma's speaking practice?</p>
            <button class="btn-primary-action" style="width:100%; justify-content:center;" onclick="switchView('messages')">💬 Message Teacher</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderParentHomeworkView(container) {
    const assignments = store.getAssignments('class-3a');

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">📚 Homework Checklist</h1>
        <p class="view-sub">Track Emma's weekly home practice and completed tasks.</p>
      </div>

      <div class="panel-card">
        ${assignments.map(a => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border-light);">
            <div>
              <strong>${a.title}</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">Due: ${a.dueDate} · Target: ${a.objectives.join(', ')}</div>
            </div>
            <span class="cefr-pill" style="background:#ecfdf5; color:#059669;">✓ Submitted</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     MODAL CONTROLS
     -------------------------------------------------------------------------- */
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('is-open');
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-open'));
  };

  // Add Student Handler
  window.handleCreateStudent = function(e) {
    if (e) e.preventDefault();
    const firstName = document.getElementById('new-stud-fname')?.value.trim();
    const lastName = document.getElementById('new-stud-lname')?.value.trim();
    const age = parseInt(document.getElementById('new-stud-age')?.value || '8', 10);
    const cefr = document.getElementById('new-stud-cefr')?.value || 'A1';
    const classId = store.state.activeClassId;

    if (firstName && lastName) {
      store.addStudent({
        firstName,
        lastName,
        age,
        overallCefr: cefr,
        classId
      });
      closeAllModals();
      renderCurrentView();
    }
  };

  // Add Assignment Handler
  window.handleCreateAssignment = function(e) {
    if (e) e.preventDefault();
    const title = document.getElementById('new-asg-title')?.value.trim();
    const dueDate = document.getElementById('new-asg-date')?.value || 'Next Week';
    const gameId = document.getElementById('new-asg-game')?.value || 'firefighter';
    const game = (window.GAMES_REGISTRY || []).find(g => g.id === gameId);

    if (title && game) {
      store.addAssignment({
        classId: store.state.activeClassId,
        title,
        dueDate,
        gameId,
        gameRoute: game.route,
        type: 'game',
        objectives: game.skills
      });
      closeAllModals();
      renderCurrentView();
    }
  };

})();
