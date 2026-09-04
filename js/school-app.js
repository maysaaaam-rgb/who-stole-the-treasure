/**
 * ENGLISH ADVENTURE ACADEMY — DIGITAL ESL SCHOOL PLATFORM
 * Master Application Controller, Router, View Renderer & CRUD Manager
 * Single Source of Truth: window.schoolStore
 */

(function() {
  'use strict';

  const store = window.schoolStore;
  if (!store) {
    console.error('SchoolStore not loaded!');
    return;
  }

  // Application State
  let currentView = 'dashboard';
  let selectedClassDetailId = 'class-3a';
  let selectedClassDetailTab = 'overview';
  let isLibraryManageMode = false;
  let activeCardMenuId = null;
  let activeCreateMenuOpen = false;

  // Library filters
  let libSearchQuery = '';
  let libFilterLevel = 'all';
  let libFilterSkill = 'all';
  let libFilterCategory = 'all';
  let libFilterDuration = 'all';

  // Curriculum active book
  let curriculumActiveBookId = 'book-1';

  // =========================================================================
  // 1. INITIALIZATION & GLOBAL LISTENERS
  // =========================================================================
  function initApp() {
    setupRoleSwitcher();
    setupHeaderControls();
    setupGlobalShortcuts();

    // Subscribe to store updates for reactive re-renders
    store.subscribe(() => {
      renderNavigation();
      updateHeaderBadges();
      renderCurrentView();
    });

    // Initial render
    renderNavigation();
    updateHeaderBadges();
    renderCurrentView();

    // Close floating menus on outside click
    document.addEventListener('click', (e) => {
      // Create menu
      const createWrap = document.getElementById('header-create-wrap');
      if (createWrap && !createWrap.contains(e.target) && activeCreateMenuOpen) {
        activeCreateMenuOpen = false;
        const menu = document.getElementById('header-create-menu');
        if (menu) menu.classList.remove('is-open');
      }

      // Card ⋯ dropdowns
      if (activeCardMenuId && !e.target.closest('.card-more-menu-wrap')) {
        closeAllCardMenus();
      }
    });

    // ESC closes modals and menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeAllModals();
        closeAllCardMenus();
        if (activeCreateMenuOpen) {
          activeCreateMenuOpen = false;
          const menu = document.getElementById('header-create-menu');
          if (menu) menu.classList.remove('is-open');
        }
      }
    });
  }

  // Role Switcher Setup
  function setupRoleSwitcher() {
    const buttons = document.querySelectorAll('.role-pill-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const role = btn.getAttribute('data-role');
        store.setRole(role);

        // Update default view for role
        if (role === 'teacher') currentView = 'dashboard';
        else if (role === 'student') currentView = 'adventure';
        else if (role === 'parent') currentView = 'parent-home';

        renderNavigation();
        updateHeaderBadges();
        renderCurrentView();
      });
    });
  }

  // Header Controls Setup
  function setupHeaderControls() {
    const classSelect = document.getElementById('header-class-select');
    if (classSelect) {
      populateHeaderClassSelect();
      classSelect.addEventListener('change', (e) => {
        store.setActiveClass(e.target.value);
        selectedClassDetailId = e.target.value;
        renderCurrentView();
      });
    }
  }

  function populateHeaderClassSelect() {
    const classSelect = document.getElementById('header-class-select');
    if (!classSelect) return;
    const classes = store.getClasses();
    const activeClass = store.getActiveClass();
    classSelect.innerHTML = classes.map(c => 
      `<option value="${c.id}" ${c.id === activeClass.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
  }

  function updateHeaderBadges() {
    const role = store.getRole();
    const userName = document.getElementById('header-user-name');
    const userInitials = document.getElementById('header-avatar-initials');
    const classSelect = document.getElementById('header-class-select');
    const createWrap = document.getElementById('header-create-wrap');

    if (role === 'teacher') {
      if (userName) userName.textContent = 'Ms. Sarah';
      if (userInitials) userInitials.textContent = 'SJ';
      if (classSelect) classSelect.style.display = 'inline-block';
      if (createWrap) createWrap.style.display = 'block';
    } else if (role === 'student') {
      const student = store.getActiveStudent();
      if (userName) userName.textContent = (student.firstName + ' ' + student.lastName);
      if (userInitials) userInitials.textContent = student.firstName[0] + student.lastName[0];
      if (classSelect) classSelect.style.display = 'none';
      if (createWrap) createWrap.style.display = 'none';
    } else if (role === 'parent') {
      if (userName) userName.textContent = 'Mr. Chen (Emma’s Parent)';
      if (userInitials) userInitials.textContent = 'PC';
      if (classSelect) classSelect.style.display = 'none';
      if (createWrap) createWrap.style.display = 'none';
    }
    populateHeaderClassSelect();
  }

  function setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const search = document.getElementById('search-input') || document.getElementById('lib-search-input');
        if (search) {
          search.focus();
          search.select();
        }
      }
    });
  }

  // Global Navigation Router
  window.switchView = function(viewName) {
    currentView = viewName;
    renderNavigation();
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Dedicated Class Dashboard
  window.openClass = function(classId, tab = 'overview') {
    selectedClassDetailId = classId;
    selectedClassDetailTab = tab;
    store.setActiveClass(classId);
    window.switchView('class-detail');
  };

  // Switch tab in Class Dashboard
  window.switchClassTab = function(tabName) {
    selectedClassDetailTab = tabName;
    const container = document.getElementById('app-view-container');
    if (container) renderClassDetailView(container);
  };

  // =========================================================================
  // 2. MODAL & DROPDOWN CONTROLLERS (FULL CRUD)
  // =========================================================================

  window.toggleCreateDropdown = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('header-create-menu');
    if (!menu) return;
    activeCreateMenuOpen = !activeCreateMenuOpen;
    if (activeCreateMenuOpen) {
      menu.classList.add('is-open');
    } else {
      menu.classList.remove('is-open');
    }
  };

  window.toggleCardDropdown = function(cardId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetMenu = document.getElementById('menu-' + cardId);
    if (!targetMenu) return;

    if (activeCardMenuId && activeCardMenuId !== cardId) {
      closeAllCardMenus();
    }

    if (targetMenu.classList.contains('is-open')) {
      targetMenu.classList.remove('is-open');
      activeCardMenuId = null;
    } else {
      targetMenu.classList.add('is-open');
      activeCardMenuId = cardId;
    }
  };

  function closeAllCardMenus() {
    document.querySelectorAll('.card-dropdown-menu.is-open').forEach(m => m.classList.remove('is-open'));
    activeCardMenuId = null;
  }

  window.toggleLibraryManageMode = function() {
    isLibraryManageMode = !isLibraryManageMode;
    const container = document.getElementById('app-view-container');
    if (currentView === 'library' && container) {
      renderLibraryView(container);
    }
  };

  window.openModal = function(modalId) {
    if (activeCreateMenuOpen) {
      activeCreateMenuOpen = false;
      const m = document.getElementById('header-create-menu');
      if (m) m.classList.remove('is-open');
    }
    const modal = document.getElementById(modalId);
    if (modal) {
      // Dynamic dropdown populations
      populateModalDropdowns();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => m.classList.remove('is-open'));
    document.body.style.overflow = '';
  };

  function populateModalDropdowns() {
    const classes = store.getClasses();
    const students = store.getStudents();
    const resources = store.getResources();

    // Populate class selects
    ['new-stud-class', 'new-asg-class', 'new-hw-class', 'story-post-class'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      }
    });

    // Populate game selects
    const gameSelect = document.getElementById('new-asg-game');
    if (gameSelect) {
      gameSelect.innerHTML = resources.map(r => `<option value="${r.id}">${r.title} (${r.level})</option>`).join('');
    }

    // Populate student selects
    ['xp-student-select', 'rubric-student-select'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = students.map(s => `<option value="${s.id}">${s.firstName} ${s.lastName} (${s.grade})</option>`).join('');
      }
    });
  }

  // RESOURCE CRUD HANDLERS
  window.openResourceEditor = function(resourceId = null) {
    const modal = document.getElementById('modal-resource-editor');
    if (!modal) return;
    const form = document.getElementById('form-resource-editor');
    const title = document.getElementById('resource-modal-title');

    if (resourceId) {
      const res = store.getResource(resourceId);
      if (!res) return;
      title.textContent = 'Edit Resource: ' + res.title;
      document.getElementById('res-edit-id').value = res.id;
      document.getElementById('res-title').value = res.title;
      document.getElementById('res-category').value = res.category || 'Game';
      document.getElementById('res-description').value = res.description || '';
      document.getElementById('res-level').value = res.level || 'A1';
      document.getElementById('res-ages').value = res.ages || '7–9';
      document.getElementById('res-grade').value = res.grade || 'Grade 3';
      document.getElementById('res-duration').value = res.duration || 30;
      document.getElementById('res-topic').value = res.topic || '';
      document.getElementById('res-route').value = res.route || '';
      document.getElementById('res-objectives').value = Array.isArray(res.objectives) ? res.objectives.join(', ') : (res.objectives || '');
      document.getElementById('res-worksheet').checked = !!res.worksheet;
      document.getElementById('res-guide').checked = !!res.teacherGuide;
      document.getElementById('res-featured').checked = !!res.featured;

      // Skills checkboxes
      const skillBoxes = document.querySelectorAll('input[name="res-skills"]');
      skillBoxes.forEach(cb => {
        cb.checked = (res.skills || []).includes(cb.value);
      });
    } else {
      title.textContent = 'Add New Resource';
      form.reset();
      document.getElementById('res-edit-id').value = '';
    }

    window.openModal('modal-resource-editor');
  };

  window.handleSaveResource = function(e) {
    e.preventDefault();
    const editId = document.getElementById('res-edit-id').value;
    const skills = Array.from(document.querySelectorAll('input[name="res-skills"]:checked')).map(cb => cb.value);
    const objectives = document.getElementById('res-objectives').value.split(',').map(s => s.trim()).filter(Boolean);

    const resourceData = {
      title: document.getElementById('res-title').value.trim(),
      category: document.getElementById('res-category').value,
      description: document.getElementById('res-description').value.trim(),
      level: document.getElementById('res-level').value,
      ages: document.getElementById('res-ages').value.trim(),
      grade: document.getElementById('res-grade').value.trim(),
      duration: parseInt(document.getElementById('res-duration').value, 10) || 30,
      topic: document.getElementById('res-topic').value.trim(),
      route: document.getElementById('res-route').value.trim(),
      skills: skills.length ? skills : ['Speaking', 'Vocabulary'],
      objectives: objectives,
      worksheet: document.getElementById('res-worksheet').checked,
      teacherGuide: document.getElementById('res-guide').checked,
      featured: document.getElementById('res-featured').checked,
      playable: true
    };

    if (editId) {
      store.updateResource(editId, resourceData);
    } else {
      store.addResource(resourceData);
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleDuplicateResource = function(resourceId) {
    closeAllCardMenus();
    store.duplicateResource(resourceId);
    renderCurrentView();
  };

  window.handleArchiveResource = function(resourceId) {
    closeAllCardMenus();
    const res = store.getResource(resourceId);
    const name = res ? res.title : 'this resource';
    if (confirm(`Are you sure you want to archive "${name}"? It will be safely moved to archived status without breaking historical student records.`)) {
      store.archiveResource(resourceId);
      renderCurrentView();
    }
  };

  window.handleToggleFavorite = function(resourceId) {
    closeAllCardMenus();
    const res = store.getResource(resourceId);
    if (res) {
      store.updateResource(resourceId, { isFavorite: !res.isFavorite });
      renderCurrentView();
    }
  };

  // STUDENT CRUD HANDLERS
  window.openStudentModal = function(studentId = null) {
    const title = document.getElementById('student-modal-title');
    const idInput = document.getElementById('edit-stud-id');
    const fname = document.getElementById('new-stud-fname');
    const lname = document.getElementById('new-stud-lname');
    const age = document.getElementById('new-stud-age');
    const cefr = document.getElementById('new-stud-cefr');
    const cls = document.getElementById('new-stud-class');

    populateModalDropdowns();

    if (studentId) {
      const s = store.getStudent(studentId);
      if (!s) return;
      title.textContent = 'Edit Student: ' + s.firstName + ' ' + s.lastName;
      idInput.value = s.id;
      fname.value = s.firstName;
      lname.value = s.lastName;
      age.value = s.age;
      cefr.value = s.overallCefr;
      if (cls) cls.value = s.classId;
    } else {
      title.textContent = 'Add New Student';
      idInput.value = '';
      fname.value = '';
      lname.value = '';
      age.value = '8';
      cefr.value = 'A1';
    }

    window.openModal('modal-student-editor');
  };

  window.handleCreateStudent = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-stud-id').value;
    const firstName = document.getElementById('new-stud-fname').value.trim();
    const lastName = document.getElementById('new-stud-lname').value.trim();
    const age = parseInt(document.getElementById('new-stud-age').value, 10) || 8;
    const overallCefr = document.getElementById('new-stud-cefr').value;
    const classId = document.getElementById('new-stud-class').value || store.getActiveClass().id;

    if (editId) {
      store.updateStudent(editId, { firstName, lastName, age, overallCefr, classId });
    } else {
      store.addStudent({ firstName, lastName, age, overallCefr, classId });
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleArchiveStudent = function(studentId) {
    const s = store.getStudent(studentId);
    const name = s ? (s.firstName + ' ' + s.lastName) : 'this student';
    if (confirm(`Are you sure you want to archive ${name}? Their historical progress, assessments and XP will be preserved.`)) {
      store.archiveStudent(studentId);
      window.closeAllModals();
      renderCurrentView();
    }
  };

  // CLASS CRUD HANDLERS
  window.handleCreateClass = function(e) {
    e.preventDefault();
    const name = document.getElementById('new-cls-name').value.trim();
    const grade = document.getElementById('new-cls-grade').value.trim() || 'Grade 3';
    const cefr = document.getElementById('new-cls-cefr').value || 'A1';
    const room = document.getElementById('new-cls-room').value.trim() || 'Room 204';
    const schedule = document.getElementById('new-cls-schedule').value.trim() || 'Mon, Wed 10:00';

    if (name) {
      const newClass = store.addClass({ name, grade, cefr, room, schedule });
      window.closeAllModals();
      window.openClass(newClass.id, 'overview');
    }
  };

  // ASSIGNMENT CRUD HANDLERS
  window.openAssignModal = function(resourceId = null) {
    closeAllCardMenus();
    populateModalDropdowns();
    if (resourceId) {
      const gameSelect = document.getElementById('new-asg-game');
      if (gameSelect) gameSelect.value = resourceId;
      const res = store.getResource(resourceId);
      if (res) {
        document.getElementById('new-asg-title').value = res.title + ' Assignment';
      }
    }
    window.openModal('modal-create-assignment');
  };

  window.handleCreateAssignment = function(e) {
    e.preventDefault();
    const title = document.getElementById('new-asg-title').value.trim();
    const classId = document.getElementById('new-asg-class').value;
    const activityId = document.getElementById('new-asg-game').value;
    const dueDate = document.getElementById('new-asg-date').value || 'Sep 20, 2026';
    const instructions = document.getElementById('new-asg-inst').value.trim();

    store.createAssignment({ title, classId, activityId, dueDate, instructions });
    window.closeAllModals();
    window.switchView('assignments');
  };

  // HOMEWORK CRUD HANDLERS
  window.handleCreateHomework = function(e) {
    e.preventDefault();
    const title = document.getElementById('new-hw-title').value.trim();
    const type = document.getElementById('new-hw-type').value;
    const classId = document.getElementById('new-hw-class').value;
    const dueDate = document.getElementById('new-hw-date').value || 'Sep 22, 2026';
    const description = document.getElementById('new-hw-desc').value.trim();

    store.createHomework({ title, type, classId, dueDate, description });
    window.closeAllModals();
    window.switchView('homework');
  };

  // QUIZ CRUD HANDLERS
  window.handleCreateQuiz = function(e) {
    e.preventDefault();
    const title = document.getElementById('quiz-title').value.trim();
    const targetCefr = document.getElementById('quiz-cefr').value;
    const skill = document.getElementById('quiz-skill').value;
    const q1 = document.getElementById('quiz-q1').value.trim();
    const opt1 = document.getElementById('quiz-opt1').value.trim();
    const opt2 = document.getElementById('quiz-opt2').value.trim();

    store.createQuiz({
      title,
      targetCefr,
      skill,
      questions: [
        { question: q1, options: [opt1, opt2], correctIndex: 0 }
      ]
    });

    window.closeAllModals();
    window.switchView('quizzes');
  };

  // XP & GAMIFICATION HANDLERS
  window.handleGiveXPSubmit = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('xp-student-select').value;
    const amount = parseInt(document.getElementById('xp-amount-val').value, 10) || 50;
    const reason = document.getElementById('xp-reason-select').value;

    const res = store.giveXP(studentId, amount, reason);
    window.closeAllModals();
    alert(`⭐ Awarded +${amount} XP to ${res.student.firstName} for "${reason}"! New total: ${res.student.xp} XP`);
    renderCurrentView();
  };

  // ASSESSMENT RUBRIC HANDLERS
  window.handleRecordAssessment = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('rubric-student-select').value;
    const speaking = parseInt(document.getElementById('slider-rubric-speaking').value, 10) || 4;
    const vocab = parseInt(document.getElementById('slider-rubric-vocab').value, 10) || 4;
    const grammar = parseInt(document.getElementById('slider-rubric-grammar').value, 10) || 3;
    const listening = parseInt(document.getElementById('slider-rubric-listening').value, 10) || 4;
    const pronun = parseInt(document.getElementById('slider-rubric-pronun').value, 10) || 4;
    const comment = document.getElementById('rubric-comment').value.trim();

    const rubricScores = {
      speaking: speaking * 20,
      vocabulary: vocab * 20,
      grammar: grammar * 20,
      listening: listening * 20,
      pronunciation: pronun * 20
    };

    const student = store.recordAssessment(studentId, rubricScores, comment);
    window.closeAllModals();
    alert(`✓ Assessment recorded for ${student.firstName}! Overall CEFR: ${student.overallCefr}`);
    renderCurrentView();
  };

  // CLASS STORY HANDLERS
  window.handleCreateStoryPost = function(e) {
    e.preventDefault();
    const title = document.getElementById('story-post-title').value.trim();
    const category = document.getElementById('story-post-cat').value;
    const classId = document.getElementById('story-post-class').value;
    const content = document.getElementById('story-post-content').value.trim();

    store.addStoryPost({ title, category, classId, content });
    window.closeAllModals();
    window.switchView('story');
  };

  window.handleLikeStoryPost = function(postId) {
    store.likeStoryPost(postId);
    const container = document.getElementById('app-view-container');
    if (currentView === 'story' && container) renderClassStoryView(container);
  };

  // MESSAGES HANDLER
  window.handleSendParentMessage = function(threadId, inputId) {
    const input = document.getElementById(inputId);
    if (!input || !input.value.trim()) return;
    store.sendParentMessage(threadId, input.value.trim());
    input.value = '';
    const container = document.getElementById('app-view-container');
    if (currentView === 'messages' && container) renderMessagesView(container);
  };

  // ATTENDANCE ROLL CALL HANDLER
  window.handleRollCall = function(studentId, status) {
    store.setStudentAttendance(studentId, status);
    renderCurrentView();
  };

  // STUDENT DRILLDOWN PROFILE
  window.openStudentDetail = function(studentId) {
    const student = store.getStudent(studentId);
    if (!student) return;
    const modal = document.getElementById('modal-student-profile');
    if (!modal) return;

    const skills = student.skills || {};
    const skillList = [
      { name: 'Speaking', data: skills.speaking || { score: 70, cefr: 'A1' }, icon: '🗣️' },
      { name: 'Listening', data: skills.listening || { score: 80, cefr: 'A1+' }, icon: '👂' },
      { name: 'Vocabulary', data: skills.vocabulary || { score: 85, cefr: 'A2' }, icon: '🧠' },
      { name: 'Grammar', data: skills.grammar || { score: 65, cefr: 'A1' }, icon: '📚' },
      { name: 'Reading', data: skills.reading || { score: 75, cefr: 'A1' }, icon: '📖' },
      { name: 'Writing', data: skills.writing || { score: 60, cefr: 'Pre-A1' }, icon: '✍️' },
      { name: 'Pronunciation', data: skills.pronunciation || { score: 78, cefr: 'A1+' }, icon: '🎵' }
    ];

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 720px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" onclick="closeAllModals()">✕</button>
        
        <!-- Header Profile -->
        <div style="display:flex; align-items:center; gap:16px; border-bottom:1px solid var(--border-light); padding-bottom:16px; margin-bottom:18px;">
          <div style="width:60px; height:60px; border-radius:var(--radius-pill); background:var(--color-primary-soft); display:flex; align-items:center; justify-content:center; font-size:32px;">
            ${student.avatar && student.avatar.hair === 'boy' ? '👦' : '👧'}
          </div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:10px;">
              <h2 style="font-size:1.4rem; font-weight:800;">${student.firstName} ${student.lastName}</h2>
              <span class="badge-cefr badge-cefr-${student.overallCefr.toLowerCase().replace('+', '-plus')}">${student.overallCefr}</span>
              <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">${student.grade} · Age ${student.age}</span>
            </div>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">
              ⭐ ${student.xp} XP earned · 🔥 ${student.streakDays}-day active streak · 🌍 ${(student.unlockedWorlds || []).length} worlds explored
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-sm-secondary" onclick="openStudentModal('${student.id}')">✏️ Edit</button>
            <button class="btn-primary-action" onclick="document.getElementById('xp-student-select').value='${student.id}'; openModal('modal-give-xp');">+ Give XP</button>
          </div>
        </div>

        <!-- 7-Skill CEFR Breakdown -->
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:12px;">CEFR Skill Mastery Matrix</h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:20px;">
          ${skillList.map(s => `
            <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:0.8rem; font-weight:700;">${s.icon} ${s.name}</span>
                <span class="badge-cefr badge-cefr-${s.data.cefr.toLowerCase().replace('+', '-plus')}">${s.data.cefr}</span>
              </div>
              <div class="progress-bar-wrap" style="height:6px; margin-top:6px;">
                <div class="progress-bar-fill" style="width: ${s.data.score}%;"></div>
              </div>
              <div style="text-align:right; font-size:0.72rem; color:var(--text-muted); margin-top:2px; font-weight:700;">${s.data.score}%</div>
            </div>
          `).join('')}
        </div>

        <!-- Can-Do Checklist -->
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:8px;">Can-Do Learning Descriptors</h3>
        <div class="can-do-list" style="margin-bottom:20px;">
          ${(student.canDo || []).map((cd, idx) => `
            <div class="can-do-item">
              <input type="checkbox" class="can-do-check" ${cd.mastered ? 'checked' : ''} onchange="
                const st = window.schoolStore.getStudent('${student.id}');
                if (st && st.canDo[${idx}]) {
                  st.canDo[${idx}].mastered = this.checked;
                  window.schoolStore.saveState();
                }
              " />
              <div>
                <strong style="font-size:0.86rem; color:var(--text-main);">${cd.text}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">Skill: ${cd.skill} · Target: ${cd.cefr}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Teacher Notes -->
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:8px;">Teacher Observations & Notes</h3>
        <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; margin-bottom:14px;">
          ${(student.teacherNotes || []).length === 0 ? '<p style=\"font-size:0.84rem; color:var(--text-muted);\">No teacher notes yet.</p>' :
            student.teacherNotes.map(n => `
              <div style=\"padding:6px 0; border-bottom:1px solid var(--border-light); font-size:0.84rem;\">
                <span style=\"color:var(--text-muted); font-size:0.75rem;\">${n.date}: </span>
                ${n.text}
              </div>
            `).join('')}
        </div>

        <!-- Add Note Composer -->
        <div style="display:flex; gap:8px;">
          <input type="text" id="add-stud-note-input" class="filter-select" style="flex:1;" placeholder="Add teacher note for ${student.firstName}..." />
          <button class="btn-primary-action" onclick="
            const inp = document.getElementById('add-stud-note-input');
            if (inp && inp.value.trim()) {
              window.schoolStore.addTeacherNote('${student.id}', inp.value.trim());
              window.openStudentDetail('${student.id}');
            }
          ">Add Note</button>
        </div>

        <!-- Archive Student Non-Destructive -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:14px; border-top:1px solid var(--border-light);">
          <button class="btn-sm-secondary" onclick="openReportGenerator('${student.id}')">🖨️ Generate Report Card</button>
          <button style="color:var(--color-danger); font-size:0.84rem; font-weight:700; cursor:pointer;" onclick="handleArchiveStudent('${student.id}')">Archive Student</button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  // REPORT GENERATOR
  window.openReportGenerator = function(studentId) {
    const student = store.getStudent(studentId);
    if (!student) return;
    const modal = document.getElementById('modal-student-profile');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 780px;">
        <button class="modal-close-btn" onclick="closeAllModals()">✕</button>
        
        <div class="report-sheet">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-medium); padding-bottom:16px; margin-bottom:20px;">
            <div>
              <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-main);">English Adventure Academy</h1>
              <p style="font-size:0.84rem; color:var(--text-muted);">Official Student Progress &amp; CEFR Mastery Report</p>
            </div>
            <div style="text-align:right;">
              <span class="badge-cefr badge-cefr-${student.overallCefr.toLowerCase().replace('+', '-plus')}" style="font-size:1.1rem; padding:4px 12px;">${student.overallCefr}</span>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Term 1, 2026</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; background:var(--bg-muted); padding:12px; border-radius:var(--radius-md); margin-bottom:20px; font-size:0.84rem;">
            <div><strong>Student:</strong> ${student.firstName} ${student.lastName}</div>
            <div><strong>Grade:</strong> ${student.grade}</div>
            <div><strong>Age:</strong> ${student.age}</div>
            <div><strong>Attendance:</strong> 96% (Present)</div>
          </div>

          <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:10px;">Core Skill Assessment</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:0.84rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);">
                <th style="padding:6px 0;">Skill</th>
                <th style="padding:6px 0;">Level</th>
                <th style="padding:6px 0;">Mastery Score</th>
                <th style="padding:6px 0;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(student.skills || {}).map(sk => {
                const s = student.skills[sk];
                return `
                  <tr style="border-bottom:1px solid var(--border-light);">
                    <td style="padding:8px 0; text-transform:capitalize; font-weight:600;">${sk}</td>
                    <td style="padding:8px 0;"><span class="badge-cefr badge-cefr-${s.cefr.toLowerCase().replace('+', '-plus')}">${s.cefr}</span></td>
                    <td style="padding:8px 0;">${s.score}%</td>
                    <td style="padding:8px 0; color:var(--color-success); font-weight:700;">${s.score >= 70 ? '✓ Proficient' : 'In Progress'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:6px;">Teacher Evaluation</h3>
          <p style="font-size:0.86rem; line-height:1.5; color:var(--text-secondary); background:var(--bg-canvas); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-light); margin-bottom:20px;">
            ${student.firstName} has made exemplary progress this term, demonstrating natural curiosity and confidence during speaking roleplays. Active in class discussions, receptive to new vocabulary, and consistently finishes homework missions with top scores.
          </p>

          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button class="btn-sm-secondary" onclick="window.print()">🖨️ Print Report</button>
            <button class="btn-primary-action" onclick="closeAllModals()">Done</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };



// =========================================================================
  // 3. 5-SECTION PROFESSIONAL NAVIGATION CONTROLLER
  // =========================================================================
  function renderNavigation() {
    const sidebar = document.getElementById('app-sidebar-nav');
    if (!sidebar) return;

    const role = store.getRole();

    if (role === 'teacher') {
      const classesCount = store.getClasses().length;
      const studentsCount = store.getStudents().length;
      const resourcesCount = store.getResources().length;
      const assignmentsCount = store.getAssignments().length;
      const homeworkCount = store.getHomework().length;
      const quizzesCount = store.getQuizzes().length;

      sidebar.innerHTML = `
        <!-- SECTION 1: DASHBOARD -->
        <div class="sidebar-section-title">Dashboard</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'dashboard' ? 'is-active' : ''}" onclick="switchView('dashboard')">
              <span class="nav-item-left"><span>📊</span> Overview</span>
            </button>
          </li>
        </ul>

        <div class="sidebar-hr"></div>

        <!-- SECTION 2: MY SCHOOL -->
        <div class="sidebar-section-title">My School</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'classes' || currentView === 'class-detail' ? 'is-active' : ''}" onclick="switchView('classes')">
              <span class="nav-item-left"><span>👥</span> Classes</span>
              <span class="nav-badge-pill">${classesCount}</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'students' ? 'is-active' : ''}" onclick="switchView('students')">
              <span class="nav-item-left"><span>👧</span> Students</span>
              <span class="nav-badge-pill">${studentsCount}</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'attendance' ? 'is-active' : ''}" onclick="switchView('attendance')">
              <span class="nav-item-left"><span>📋</span> Attendance</span>
            </button>
          </li>
        </ul>

        <div class="sidebar-hr"></div>

        <!-- SECTION 3: TEACHING -->
        <div class="sidebar-section-title">Teaching</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'curriculum' ? 'is-active' : ''}" onclick="switchView('curriculum')">
              <span class="nav-item-left"><span>📚</span> Curriculum</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'library' ? 'is-active' : ''}" onclick="switchView('library')">
              <span class="nav-item-left"><span>🎮</span> Lesson Library</span>
              <span class="nav-badge-pill">${resourcesCount}</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'assignments' ? 'is-active' : ''}" onclick="switchView('assignments')">
              <span class="nav-item-left"><span>📝</span> Assignments</span>
              <span class="nav-badge-pill">${assignmentsCount}</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'homework' ? 'is-active' : ''}" onclick="switchView('homework')">
              <span class="nav-item-left"><span>✍️</span> Homework</span>
              <span class="nav-badge-pill">${homeworkCount}</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'quizzes' ? 'is-active' : ''}" onclick="switchView('quizzes')">
              <span class="nav-item-left"><span>🧩</span> Quizzes &amp; Tests</span>
              <span class="nav-badge-pill">${quizzesCount}</span>
            </button>
          </li>
        </ul>

        <div class="sidebar-hr"></div>

        <!-- SECTION 4: ASSESSMENT -->
        <div class="sidebar-section-title">Assessment</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'assessments' ? 'is-active' : ''}" onclick="switchView('assessments')">
              <span class="nav-item-left"><span>🎯</span> Assessments</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'progress' ? 'is-active' : ''}" onclick="switchView('progress')">
              <span class="nav-item-left"><span>📈</span> Progress &amp; CEFR</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'analytics' ? 'is-active' : ''}" onclick="switchView('analytics')">
              <span class="nav-item-left"><span>📊</span> Analytics</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'reports' ? 'is-active' : ''}" onclick="switchView('reports')">
              <span class="nav-item-left"><span>📄</span> Reports</span>
            </button>
          </li>
        </ul>

        <div class="sidebar-hr"></div>

        <!-- SECTION 5: COMMUNITY -->
        <div class="sidebar-section-title">Community</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'story' ? 'is-active' : ''}" onclick="switchView('story')">
              <span class="nav-item-left"><span>📸</span> Class Story</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'messages' ? 'is-active' : ''}" onclick="switchView('messages')">
              <span class="nav-item-left"><span>💬</span> Messages</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'portfolios' ? 'is-active' : ''}" onclick="switchView('portfolios')">
              <span class="nav-item-left"><span>🎨</span> Portfolios</span>
            </button>
          </li>
        </ul>
      `;
    } else if (role === 'student') {
      sidebar.innerHTML = `
        <div class="sidebar-section-title">My Adventure</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'adventure' ? 'is-active' : ''}" onclick="switchView('adventure')">
              <span class="nav-item-left"><span>🗺️</span> Learning Worlds</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'student-tasks' ? 'is-active' : ''}" onclick="switchView('student-tasks')">
              <span class="nav-item-left"><span>📋</span> My Missions</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'student-badges' ? 'is-active' : ''}" onclick="switchView('student-badges')">
              <span class="nav-item-left"><span>🏆</span> Badges &amp; Trophies</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'leaderboard' ? 'is-active' : ''}" onclick="switchView('leaderboard')">
              <span class="nav-item-left"><span>🌟</span> Class Leaderboard</span>
            </button>
          </li>
        </ul>
      `;
    } else if (role === 'parent') {
      sidebar.innerHTML = `
        <div class="sidebar-section-title">Parent Portal</div>
        <ul class="sidebar-nav-list">
          <li>
            <button class="nav-link-btn ${currentView === 'parent-home' ? 'is-active' : ''}" onclick="switchView('parent-home')">
              <span class="nav-item-left"><span>🏡</span> Child Overview</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'parent-homework' ? 'is-active' : ''}" onclick="switchView('parent-homework')">
              <span class="nav-item-left"><span>📝</span> Homework &amp; Tasks</span>
            </button>
          </li>
          <li>
            <button class="nav-link-btn ${currentView === 'messages' ? 'is-active' : ''}" onclick="switchView('messages')">
              <span class="nav-item-left"><span>💬</span> Messages with Teacher</span>
            </button>
          </li>
        </ul>
      `;
    }
  }

  // =========================================================================
  // 4. MAIN ROUTER & VIEW RENDERER
  // =========================================================================
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
      case 'class-detail':
        renderClassDetailView(container);
        break;
      case 'students':
        renderStudentsView(container);
        break;
      case 'attendance':
        renderAttendanceView(container);
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
      case 'homework':
        renderHomeworkView(container);
        break;
      case 'quizzes':
        renderQuizzesView(container);
        break;
      case 'assessments':
        renderAssessmentsView(container);
        break;
      case 'progress':
        renderProgressView(container);
        break;
      case 'analytics':
        renderAnalyticsView(container);
        break;
      case 'reports':
        renderReportsView(container);
        break;
      case 'story':
        renderClassStoryView(container);
        break;
      case 'messages':
        renderMessagesView(container);
        break;
      case 'portfolios':
        renderPortfoliosView(container);
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
    const assignments = store.getAssignments().filter(a => a.classId === activeClass.id);
    const homework = store.getHomework().filter(h => h.classId === activeClass.id);

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h1 class="view-greeting">Good afternoon, Ms. Sarah 👋</h1>
          <p class="view-sub">English Adventure Academy · <strong>${activeClass.name}</strong> overview and student performance.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-sm-secondary" onclick="openClass('${activeClass.id}', 'attendance')">📋 Roll Call</button>
          <button class="btn-primary-action" onclick="openClass('${activeClass.id}', 'overview')">Open Class Dashboard →</button>
        </div>
      </div>

      <!-- 4 KPI Stat Cards -->
      <div class="kpi-grid">
        <div class="kpi-card" onclick="openClass('${activeClass.id}', 'students')" style="cursor:pointer;">
          <span class="kpi-label">Active Students</span>
          <span class="kpi-val">${classStudents.length}</span>
          <span class="kpi-sub">✓ Enrolled in ${activeClass.grade}</span>
        </div>
        <div class="kpi-card" onclick="openClass('${activeClass.id}', 'attendance')" style="cursor:pointer;">
          <span class="kpi-label">Class Attendance</span>
          <span class="kpi-val">94%</span>
          <span class="kpi-sub" style="color:var(--color-success); font-weight:700;">+2% from last week</span>
        </div>
        <div class="kpi-card" onclick="openClass('${activeClass.id}', 'lessons')" style="cursor:pointer;">
          <span class="kpi-label">Curriculum Progress</span>
          <span class="kpi-val">72%</span>
          <span class="kpi-sub">Unit 4: Animal Habitats</span>
        </div>
        <div class="kpi-card" onclick="openClass('${activeClass.id}', 'assessments')" style="cursor:pointer;">
          <span class="kpi-label">Average CEFR</span>
          <span class="kpi-val" style="color:var(--color-primary);">${activeClass.cefr}</span>
          <span class="kpi-sub">Target: ${activeClass.cefr}+ by Term 2</span>
        </div>
      </div>

      <!-- Dashboard Columns: Today's Schedule & Recent Activity -->
      <div class="dashboard-columns">
        <!-- Column 1: Today's Teaching Schedule -->
        <div class="dash-card">
          <div class="dash-card-header">
            <h2 class="dash-card-title">Today's Teaching Schedule</h2>
            <button class="btn-sm-secondary" onclick="switchView('library')">Browse Library</button>
          </div>
          <div class="schedule-list">
            <div class="schedule-item">
              <div class="schedule-time">09:00 - 09:45</div>
              <div class="schedule-details">
                <div class="schedule-class">${activeClass.name} · Speaking Practice</div>
                <div class="schedule-topic">Build Your Own Monster (Creature Builder)</div>
                <div class="schedule-tags">
                  <span class="badge-cefr badge-cefr-a1">A1</span>
                  <span>Body Parts &amp; Adjectives</span>
                </div>
              </div>
              <a href="monster day/index.html" class="btn-schedule-action">▶ Launch</a>
            </div>

            <div class="schedule-item">
              <div class="schedule-time">11:00 - 11:45</div>
              <div class="schedule-details">
                <div class="schedule-class">${activeClass.name} · Roleplay &amp; Manners</div>
                <div class="schedule-topic">At the Restaurant (Ordering Dialogue)</div>
                <div class="schedule-tags">
                  <span class="badge-cefr badge-cefr-a1">A1</span>
                  <span>Polite Requests &amp; Food</span>
                </div>
              </div>
              <a href="restaurant/index.html" class="btn-schedule-action">▶ Launch</a>
            </div>

            <div class="schedule-item">
              <div class="schedule-time">13:30 - 14:15</div>
              <div class="schedule-details">
                <div class="schedule-class">Grade 4B — The Adventurers</div>
                <div class="schedule-topic">Fire Station Adventure (Emergency Story)</div>
                <div class="schedule-tags">
                  <span class="badge-cefr badge-cefr-a1">A1</span>
                  <span>Community Helpers</span>
                </div>
              </div>
              <a href="firefighter/index.html" class="btn-schedule-action">▶ Launch</a>
            </div>
          </div>
        </div>

        <!-- Column 2: Recent Submissions & Action Banner -->
        <div class="dash-card">
          <div class="dash-card-header">
            <h2 class="dash-card-title">Recent Student Submissions</h2>
            <button class="btn-sm-secondary" onclick="switchView('assignments')">View All (${assignments.length})</button>
          </div>
          
          <div class="submissions-list">
            <div class="submission-item">
              <div class="submission-avatar">👧</div>
              <div class="submission-info">
                <div class="submission-name">Emma Chen · <span style="font-weight:400; color:var(--text-muted);">Monster Day</span></div>
                <div class="submission-score">Score: <strong>95%</strong> · +50 XP awarded</div>
              </div>
              <button class="btn-sm-secondary" onclick="openStudentDetail('student-emma')">Review</button>
            </div>

            <div class="submission-item">
              <div class="submission-avatar">👦</div>
              <div class="submission-info">
                <div class="submission-name">Lucas Silva · <span style="font-weight:400; color:var(--text-muted);">Restaurant Dialogue</span></div>
                <div class="submission-score">Score: <strong>88%</strong> · +40 XP awarded</div>
              </div>
              <button class="btn-sm-secondary" onclick="openStudentDetail('student-lucas')">Review</button>
            </div>

            <div class="submission-item">
              <div class="submission-avatar">👧</div>
              <div class="submission-info">
                <div class="submission-name">Sofia Martinez · <span style="font-weight:400; color:var(--text-muted);">Treasure Mystery</span></div>
                <div class="submission-score">Score: <strong>92%</strong> · +45 XP awarded</div>
              </div>
              <button class="btn-sm-secondary" onclick="openStudentDetail('student-sofia')">Review</button>
            </div>
          </div>

          <!-- Class Diagnostics Callout -->
          <div style="background:var(--color-primary-soft); border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:14px; margin-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:0.84rem; font-weight:800; color:var(--color-primary);">💡 Teaching Recommendation</span>
              <button class="btn-sm-secondary" onclick="switchView('analytics')" style="padding:2px 8px; font-size:0.75rem;">Diagnostics</button>
            </div>
            <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">
              Grade 3A shows 92% mastery in <strong>Food Vocabulary</strong>, but speaking confidence during open dialogue is at 68%. Try <strong>The Crazy Advice Academy</strong> next.
            </p>
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
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Class Management</h1>
          <p class="view-sub">Manage school cohorts, student rosters, schedules, and learning objectives.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-add-class')">+ Create Class</button>
      </div>

      <div class="classes-grid">
        ${classes.map(cls => {
          const students = store.getStudentsByClass(cls.id);
          return `
            <div class="class-card">
              <div class="class-card-header">
                <div>
                  <h3 class="class-card-name">${cls.name}</h3>
                  <div class="class-card-sub">${cls.grade} · ${cls.room}</div>
                </div>
                <span class="badge-cefr badge-cefr-${cls.cefr.toLowerCase().replace('+', '-plus')}">${cls.cefr}</span>
              </div>

              <div class="class-card-stats">
                <div class="class-stat-box">
                  <span class="class-stat-num">${students.length}</span>
                  <span class="class-stat-lbl">Students</span>
                </div>
                <div class="class-stat-box">
                  <span class="class-stat-num">94%</span>
                  <span class="class-stat-lbl">Attendance</span>
                </div>
                <div class="class-stat-box">
                  <span class="class-stat-num">72%</span>
                  <span class="class-stat-lbl">Mastery</span>
                </div>
              </div>

              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
                🕒 ${cls.schedule}
              </div>

              <div class="class-card-actions">
                <button class="btn-primary-action" style="flex:1; justify-content:center;" onclick="openClass('${cls.id}', 'overview')">Open Class →</button>
                <button class="btn-sm-secondary" onclick="openClass('${cls.id}', 'attendance')">Roll Call</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     3. DEDICATED CLASS DASHBOARD (OPEN CLASS)
     -------------------------------------------------------------------------- */
  function renderClassDetailView(container) {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const assignments = store.getAssignments().filter(a => a.classId === cls.id);
    const homework = store.getHomework().filter(h => h.classId === cls.id);
    const attendanceRecords = store.getTodayAttendance(cls.id);

    const tabs = [
      { id: 'overview', label: '📊 Overview' },
      { id: 'students', label: `👧 Students (${students.length})` },
      { id: 'attendance', label: '📋 Attendance' },
      { id: 'lessons', label: '🎮 Lessons' },
      { id: 'assignments', label: `📝 Assignments (${assignments.length})` },
      { id: 'homework', label: `✍️ Homework (${homework.length})` },
      { id: 'assessments', label: '🎯 Assessments' },
      { id: 'progress', label: '📈 Progress' },
      { id: 'analytics', label: '📊 Analytics' },
      { id: 'story', label: '📸 Class Story' }
    ];

    container.innerHTML = `
      <!-- Breadcrumb & Class Header -->
      <div style="margin-bottom:12px;">
        <button class="btn-sm-secondary" onclick="switchView('classes')" style="padding:4px 10px; font-size:0.78rem;">← Back to All Classes</button>
      </div>

      <div class="class-detail-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:12px;">
              <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-main);">${cls.name}</h1>
              <span class="badge-cefr badge-cefr-${cls.cefr.toLowerCase().replace('+', '-plus')}" style="font-size:0.9rem; padding:3px 10px;">${cls.cefr} Target</span>
            </div>
            <p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">
              ${cls.grade} · ${cls.room} · Schedule: <strong>${cls.schedule}</strong> · ${students.length} Enrolled Learners
            </p>
          </div>

          <!-- Class Actions -->
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <button class="btn-sm-secondary" onclick="openStudentModal()">+ Add Student</button>
            <button class="btn-sm-secondary" onclick="openModal('modal-create-assignment')">+ Assign Activity</button>
            <button class="btn-sm-secondary" onclick="openModal('modal-homework-editor')">+ Create Homework</button>
            <button class="btn-primary-action" onclick="switchClassTab('attendance')">📋 Take Attendance</button>
          </div>
        </div>

        <!-- Sub-navigation Tabs -->
        <div class="class-subnav-tabs">
          ${tabs.map(t => `
            <button class="class-tab-btn ${selectedClassDetailTab === t.id ? 'is-active' : ''}" onclick="switchClassTab('${t.id}')">
              ${t.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Sub-Tab Content -->
      <div id="class-tab-content-container">
        ${renderClassSubTabContent(cls, students, assignments, homework, attendanceRecords)}
      </div>
    `;
  }

  function renderClassSubTabContent(cls, students, assignments, homework, attendanceRecords) {
    switch (selectedClassDetailTab) {
      case 'overview':
        return `
          <div class="kpi-grid" style="margin-bottom:20px;">
            <div class="kpi-card">
              <span class="kpi-label">Class Roster</span>
              <span class="kpi-val">${students.length}</span>
              <span class="kpi-sub">Active Students</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Attendance Rate</span>
              <span class="kpi-val">96%</span>
              <span class="kpi-sub" style="color:var(--color-success); font-weight:700;">Consistent Attendance</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Assignments Due</span>
              <span class="kpi-val">${assignments.length}</span>
              <span class="kpi-sub">Active Tasks</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Avg Skill Score</span>
              <span class="kpi-val">76%</span>
              <span class="kpi-sub">CEFR A1 Level</span>
            </div>
          </div>

          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:800;">Quick Roster Snapshot</h3>
              <button class="btn-sm-secondary" onclick="switchClassTab('students')">View All Students →</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px;">
              ${students.slice(0, 6).map(s => `
                <div style="display:flex; align-items:center; gap:10px; background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:10px 12px; cursor:pointer;" onclick="openStudentDetail('${s.id}')">
                  <div style="font-size:24px;">${s.avatar && s.avatar.hair === 'boy' ? '👦' : '👧'}</div>
                  <div style="flex:1;">
                    <div style="font-size:0.86rem; font-weight:700;">${s.firstName} ${s.lastName}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">⭐ ${s.xp} XP · ${s.overallCefr}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'students':
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:800;">Enrolled Students (${students.length})</h3>
            <button class="btn-primary-action" onclick="openStudentModal()">+ Add Student</button>
          </div>
          <div class="students-grid">
            ${students.map(s => renderStudentCard(s)).join('')}
          </div>
        `;

      case 'attendance':
        return renderAttendanceTableForClass(cls, students, attendanceRecords);

      case 'lessons':
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:800;">Assigned &amp; Recommended Lessons</h3>
            <button class="btn-sm-secondary" onclick="switchView('library')">Open Full Library</button>
          </div>
          <div class="games-grid">
            ${store.getResources().slice(0, 4).map(r => renderGameCard(r)).join('')}
          </div>
        `;

      case 'assignments':
        return renderAssignmentsTableForClass(assignments);

      case 'homework':
        return renderHomeworkCardsForClass(homework);

      case 'assessments':
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:800;">Class Rubric Evaluations</h3>
            <button class="btn-primary-action" onclick="openModal('modal-assessment-rubric')">+ New Assessment</button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px;">
            ${students.map(s => `
              <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <strong style="font-size:0.95rem;">${s.firstName} ${s.lastName}</strong>
                  <span class="badge-cefr badge-cefr-${s.overallCefr.toLowerCase().replace('+', '-plus')}">${s.overallCefr}</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Speaking: 74% · Listening: 80% · Vocab: 85%</div>
                <button class="btn-sm-secondary" style="width:100%; justify-content:center;" onclick="document.getElementById('rubric-student-select').value='${s.id}'; openModal('modal-assessment-rubric');">Evaluate Rubric</button>
              </div>
            `).join('')}
          </div>
        `;

      case 'progress':
        return `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:14px;">Skill Distribution — ${cls.name}</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <div style="background:var(--bg-canvas); padding:14px; border-radius:var(--radius-md);">
                <div style="font-size:0.84rem; font-weight:700;">🗣️ Speaking</div>
                <div class="progress-bar-wrap" style="margin:8px 0;"><div class="progress-bar-fill" style="width:72%;"></div></div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Class Avg: 72% (A1)</div>
              </div>
              <div style="background:var(--bg-canvas); padding:14px; border-radius:var(--radius-md);">
                <div style="font-size:0.84rem; font-weight:700;">👂 Listening</div>
                <div class="progress-bar-wrap" style="margin:8px 0;"><div class="progress-bar-fill" style="width:84%;"></div></div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Class Avg: 84% (A1+)</div>
              </div>
              <div style="background:var(--bg-canvas); padding:14px; border-radius:var(--radius-md);">
                <div style="font-size:0.84rem; font-weight:700;">🧠 Vocabulary</div>
                <div class="progress-bar-wrap" style="margin:8px 0;"><div class="progress-bar-fill" style="width:88%;"></div></div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Class Avg: 88% (A2)</div>
              </div>
              <div style="background:var(--bg-canvas); padding:14px; border-radius:var(--radius-md);">
                <div style="font-size:0.84rem; font-weight:700;">📚 Grammar</div>
                <div class="progress-bar-wrap" style="margin:8px 0;"><div class="progress-bar-fill" style="width:68%;"></div></div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Class Avg: 68% (A1)</div>
              </div>
            </div>
          </div>
        `;

      case 'analytics':
        return `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:12px;">Diagnostic Insights &amp; Interventions</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="border-left:4px solid var(--color-success); background:var(--color-success-soft); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0;">
                <strong style="color:var(--color-success); font-size:0.88rem;">Key Strength: Animal &amp; Food Vocabulary</strong>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">92% of students can identify and pronounce target vocabulary without hesitation.</p>
              </div>
              <div style="border-left:4px solid var(--color-warning); background:var(--color-warning-soft); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0;">
                <strong style="color:var(--color-warning); font-size:0.88rem;">Target Area for Growth: Speaking Fluency</strong>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">Hesitation occurs when ordering in full sentences. Recommended lesson: <strong>At the Restaurant</strong> or <strong>The Crazy Advice Academy</strong>.</p>
              </div>
            </div>
          </div>
        `;

      case 'story':
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:800;">${cls.name} Story Feed</h3>
            <button class="btn-primary-action" onclick="document.getElementById('story-post-class').value='${cls.id}'; openModal('modal-story-post');">+ New Post</button>
          </div>
          <div class="story-feed">
            ${store.getClassStory(cls.id).map(p => renderStoryPost(p)).join('')}
          </div>
        `;

      default:
        return '<p>Select a tab above.</p>';
    }
  }

  function renderAttendanceTableForClass(cls, students, records) {
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    students.forEach(s => {
      const st = records[s.id] || 'present';
      if (st === 'present') presentCount++;
      else if (st === 'late') lateCount++;
      else absentCount++;
    });

    return `
      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="font-size:1.1rem; font-weight:800;">Today's Roll Call — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
            <span style="font-size:0.82rem; color:var(--text-muted);">Click status buttons below to update attendance in real-time.</span>
          </div>
          <div style="display:flex; gap:8px;">
            <span style="background:var(--color-success-soft); color:var(--color-success); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:var(--radius-pill);">✓ ${presentCount} Present</span>
            <span style="background:var(--color-warning-soft); color:var(--color-warning); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:var(--radius-pill);">⏱️ ${lateCount} Late</span>
            <span style="background:var(--color-danger-soft); color:var(--color-danger); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:var(--radius-pill);">✕ ${absentCount} Absent</span>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);">
              <th style="padding:10px 0;">Student</th>
              <th style="padding:10px 0;">Grade</th>
              <th style="padding:10px 0;">Streak</th>
              <th style="padding:10px 0; text-align:right;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const status = records[s.id] || 'present';
              return `
                <tr style="border-bottom:1px solid var(--border-light);">
                  <td style="padding:10px 0; font-weight:700;">
                    <span style="margin-right:8px;">${s.avatar && s.avatar.hair === 'boy' ? '👦' : '👧'}</span>
                    ${s.firstName} ${s.lastName}
                  </td>
                  <td style="padding:10px 0; color:var(--text-muted);">${s.grade}</td>
                  <td style="padding:10px 0;">🔥 ${s.streakDays} days</td>
                  <td style="padding:10px 0; text-align:right;">
                    <div style="display:inline-flex; gap:4px;">
                      <button class="btn-sm-secondary ${status === 'present' ? 'btn-primary-action' : ''}" style="padding:3px 8px; font-size:0.75rem;" onclick="handleRollCall('${s.id}', 'present')">Present</button>
                      <button class="btn-sm-secondary ${status === 'late' ? 'btn-primary-action' : ''}" style="padding:3px 8px; font-size:0.75rem;" onclick="handleRollCall('${s.id}', 'late')">Late</button>
                      <button class="btn-sm-secondary ${status === 'absent' ? 'btn-primary-action' : ''}" style="padding:3px 8px; font-size:0.75rem;" onclick="handleRollCall('${s.id}', 'absent')">Absent</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAssignmentsTableForClass(assignments) {
    return `
      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-size:1.1rem; font-weight:800;">Assigned Activities</h3>
          <button class="btn-primary-action" onclick="openModal('modal-create-assignment')">+ Create Assignment</button>
        </div>
        ${assignments.length === 0 ? '<p style=\"color:var(--text-muted); font-size:0.86rem;\">No assignments currently assigned to this class.</p>' : `
          <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);">
                <th style="padding:10px 0;">Title</th>
                <th style="padding:10px 0;">Due Date</th>
                <th style="padding:10px 0;">Completed</th>
                <th style="padding:10px 0; text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${assignments.map(a => `
                <tr style="border-bottom:1px solid var(--border-light);">
                  <td style="padding:10px 0; font-weight:700;">${a.title}</td>
                  <td style="padding:10px 0; color:var(--text-muted);">${a.dueDate}</td>
                  <td style="padding:10px 0;">${a.completedCount} / ${a.assignedCount}</td>
                  <td style="padding:10px 0; text-align:right;">
                    <button class="btn-sm-secondary" onclick="openAssignModal('${a.activityId}')">View</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;
  }

  function renderHomeworkCardsForClass(homework) {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:1.1rem; font-weight:800;">Class Homework Tasks</h3>
        <button class="btn-primary-action" onclick="openModal('modal-homework-editor')">+ Create Homework</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:14px;">
        ${homework.map(h => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--color-primary); background:var(--color-primary-soft); padding:2px 8px; border-radius:4px;">${h.type}</span>
              <span style="font-size:0.78rem; color:var(--text-muted);">Due ${h.dueDate}</span>
            </div>
            <h4 style="font-size:1rem; font-weight:800; margin-bottom:6px;">${h.title}</h4>
            <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin-bottom:14px;">${h.description}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.8rem; font-weight:700;">Submissions: ${h.submittedCount || 0}</span>
              <button class="btn-sm-secondary" onclick="alert('Grading sheet opened for ' + '${h.title}')">Grade Submissions</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     4. STUDENTS VIEW
     -------------------------------------------------------------------------- */
  function renderStudentsView(container) {
    const students = store.getStudents();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Student Directory</h1>
          <p class="view-sub">${students.length} enrolled learners · CEFR progress, individual skill profiles, and gamification rewards.</p>
        </div>
        <button class="btn-primary-action" onclick="openStudentModal()">+ Add Student</button>
      </div>

      <div class="students-grid">
        ${students.map(s => renderStudentCard(s)).join('')}
      </div>
    `;
  }

  function renderStudentCard(s) {
    return `
      <div class="student-card">
        <div class="student-card-header">
          <div class="student-avatar-box">
            ${s.avatar && s.avatar.hair === 'boy' ? '👦' : '👧'}
          </div>
          <div style="flex:1;">
            <div class="student-name">${s.firstName} ${s.lastName}</div>
            <div class="student-meta">${s.grade} · Age ${s.age}</div>
          </div>
          <span class="badge-cefr badge-cefr-${s.overallCefr.toLowerCase().replace('+', '-plus')}">${s.overallCefr}</span>
        </div>

        <div style="margin:12px 0;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); font-weight:700; margin-bottom:4px;">
            <span>Overall Progress</span>
            <span>${s.skills && s.skills.speaking ? s.skills.speaking.score : 70}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${s.skills && s.skills.speaking ? s.skills.speaking.score : 70}%;"></div>
          </div>
        </div>

        <div class="student-stats-row">
          <span>⭐ <strong>${s.xp}</strong> XP</span>
          <span>🔥 <strong>${s.streakDays}</strong>-day streak</span>
          <span>🌍 <strong>${(s.unlockedWorlds || []).length}</strong> worlds</span>
        </div>

        <div class="student-card-actions">
          <button class="btn-primary-action" style="flex:1; justify-content:center;" onclick="openStudentDetail('${s.id}')">View Profile</button>
          <button class="btn-sm-secondary" onclick="document.getElementById('xp-student-select').value='${s.id}'; openModal('modal-give-xp');">+ Give XP</button>
          <button class="btn-sm-secondary" onclick="openStudentModal('${s.id}')">Edit</button>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     5. ATTENDANCE VIEW
     -------------------------------------------------------------------------- */
  function renderAttendanceView(container) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);
    const records = store.getTodayAttendance(activeClass.id);

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Class Attendance &amp; Roll Call</h1>
          <p class="view-sub">Tracking daily classroom participation and historical attendance records for <strong>${activeClass.name}</strong>.</p>
        </div>
        <button class="btn-primary-action" onclick="alert('✓ Attendance register confirmed and saved for today!')">Save Register</button>
      </div>

      ${renderAttendanceTableForClass(activeClass, students, records)}
    `;
  }

  /* --------------------------------------------------------------------------
     6. CURRICULUM VIEW
     -------------------------------------------------------------------------- */
  function renderCurriculumView(container) {
    const curriculum = store.getCurriculum();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">ESL Curriculum Framework</h1>
          <p class="view-sub">Structured learning pathway from Pre-A1 to A2+. Books, Units, Lessons, and Can-Do Objectives.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-resource-editor')">+ Add Unit / Lesson</button>
      </div>

      <!-- Curriculum Books Tabs -->
      <div style="display:flex; gap:10px; margin-bottom:20px;">
        <button class="btn-sm-secondary ${curriculumActiveBookId === 'book-1' ? 'btn-primary-action' : ''}" onclick="curriculumActiveBookId='book-1'; renderCurriculumView(document.getElementById('app-view-container'));">
          📘 Book 1: Young Explorers (Pre-A1 → A1)
        </button>
        <button class="btn-sm-secondary ${curriculumActiveBookId === 'book-2' ? 'btn-primary-action' : ''}" onclick="curriculumActiveBookId='book-2'; renderCurriculumView(document.getElementById('app-view-container'));">
          📙 Book 2: World Navigators (A1 → A2)
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${curriculum.map(unit => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:0.75rem; font-weight:800; color:var(--color-primary); text-transform:uppercase;">${unit.book}</span>
                  <span class="badge-cefr badge-cefr-${unit.level.toLowerCase().replace('+', '-plus')}">${unit.level}</span>
                </div>
                <h3 style="font-size:1.2rem; font-weight:800; margin-top:2px;">${unit.title}</h3>
                <p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">Target Vocabulary: ${(unit.targetVocab || []).join(', ')}</p>
              </div>
              <div style="display:flex; gap:6px;">
                <button class="btn-sm-secondary" onclick="openAssignModal('${unit.gameRoute || ''}')">Assign Unit</button>
              </div>
            </div>

            <!-- Lessons in this unit -->
            <div style="background:var(--bg-canvas); border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-light);">
              <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">Unit Lessons &amp; Activities</div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${(unit.lessons || []).map(ls => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); border:1px solid var(--border-light); padding:10px 14px; border-radius:var(--radius-md);">
                    <div>
                      <strong style="font-size:0.88rem;">${ls.title}</strong>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${ls.objective || 'Core communicative objective'}</div>
                    </div>
                    ${ls.route ? `<a href="${ls.route}" class="btn-sm-secondary" style="font-weight:700;">▶ Play Lesson</a>` : '<span style=\"font-size:0.75rem; color:var(--text-muted);\">In Unit</span>'}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. LESSON LIBRARY (FULL CRUD & ONE-CLICK DIRECT LAUNCH)
     -------------------------------------------------------------------------- */
  function renderLibraryView(container) {
    const allResources = store.getResources();

    // Filtering logic
    const filtered = allResources.filter(r => {
      // Search query
      if (libSearchQuery) {
        const q = libSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = (r.description || '').toLowerCase().includes(q);
        const matchTopic = (r.topic || '').toLowerCase().includes(q);
        const matchSkills = (r.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTopic && !matchSkills) return false;
      }

      // Level filter
      if (libFilterLevel !== 'all' && r.level !== libFilterLevel) return false;

      // Skill filter
      if (libFilterSkill !== 'all' && !(r.skills || []).includes(libFilterSkill)) return false;

      // Category filter
      if (libFilterCategory !== 'all' && r.category !== libFilterCategory) return false;

      return true;
    });

    // Recently played items (top 2)
    const recentlyPlayed = allResources.slice(0, 2);

    container.innerHTML = `
      <!-- Library Header -->
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h1 class="view-greeting">Lesson Library</h1>
          <p class="view-sub">All 15 interactive games + custom teacher materials. Ready for one-click classroom play.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-sm-secondary ${isLibraryManageMode ? 'btn-primary-action' : ''}" onclick="toggleLibraryManageMode()">
            ${isLibraryManageMode ? '✓ Done Managing' : '⚙️ Manage Library'}
          </button>
          <button class="btn-primary-action" onclick="openResourceEditor()">+ Add Resource</button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="library-search-bar" style="margin-bottom:16px;">
        <div class="search-input-wrap" style="flex:1;">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" id="lib-search-input" class="search-input" placeholder="Search lessons by title, topic, grammar, or vocabulary... (Press /)" value="${libSearchQuery}" oninput="
            libSearchQuery = this.value;
            const c = document.getElementById('lib-results-container');
            if (c) renderLibraryCardsGrid(c);
          " />
        </div>

        <select class="filter-select" onchange="libFilterLevel = this.value; renderLibraryCardsGrid(document.getElementById('lib-results-container'));">
          <option value="all" ${libFilterLevel === 'all' ? 'selected' : ''}>All Levels</option>
          <option value="Pre-A1" ${libFilterLevel === 'Pre-A1' ? 'selected' : ''}>Pre-A1</option>
          <option value="A1" ${libFilterLevel === 'A1' ? 'selected' : ''}>A1</option>
          <option value="A1+" ${libFilterLevel === 'A1+' ? 'selected' : ''}>A1+</option>
          <option value="A2" ${libFilterLevel === 'A2' ? 'selected' : ''}>A2</option>
          <option value="B1" ${libFilterLevel === 'B1' ? 'selected' : ''}>B1</option>
        </select>

        <select class="filter-select" onchange="libFilterSkill = this.value; renderLibraryCardsGrid(document.getElementById('lib-results-container'));">
          <option value="all" ${libFilterSkill === 'all' ? 'selected' : ''}>All Skills</option>
          <option value="Speaking" ${libFilterSkill === 'Speaking' ? 'selected' : ''}>Speaking</option>
          <option value="Listening" ${libFilterSkill === 'Listening' ? 'selected' : ''}>Listening</option>
          <option value="Vocabulary" ${libFilterSkill === 'Vocabulary' ? 'selected' : ''}>Vocabulary</option>
          <option value="Grammar" ${libFilterSkill === 'Grammar' ? 'selected' : ''}>Grammar</option>
          <option value="Reading" ${libFilterSkill === 'Reading' ? 'selected' : ''}>Reading</option>
        </select>

        <select class="filter-select" onchange="libFilterCategory = this.value; renderLibraryCardsGrid(document.getElementById('lib-results-container'));">
          <option value="all" ${libFilterCategory === 'all' ? 'selected' : ''}>All Types</option>
          <option value="Story" ${libFilterCategory === 'Story' ? 'selected' : ''}>Story</option>
          <option value="Mystery" ${libFilterCategory === 'Mystery' ? 'selected' : ''}>Mystery</option>
          <option value="Roleplay" ${libFilterCategory === 'Roleplay' ? 'selected' : ''}>Roleplay</option>
          <option value="Game" ${libFilterCategory === 'Game' ? 'selected' : ''}>Game</option>
          <option value="CLIL" ${libFilterCategory === 'CLIL' ? 'selected' : ''}>CLIL</option>
        </select>
      </div>

      <!-- Continue Teaching (Recent) -->
      ${!libSearchQuery && libFilterLevel === 'all' ? `
        <div style="margin-bottom:24px;">
          <h2 style="font-size:1.1rem; font-weight:800; margin-bottom:12px;">Continue Teaching (Recently Used)</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:14px;">
            ${recentlyPlayed.map(r => `
              <div style="display:flex; align-items:center; gap:14px; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:14px; box-shadow:var(--shadow-xs);">
                <div style="width:54px; height:54px; border-radius:var(--radius-md); background:var(--color-primary-soft); display:flex; align-items:center; justify-content:center; font-size:26px;">
                  ${getCategoryIcon(r.category)}
                </div>
                <div style="flex:1;">
                  <strong style="font-size:0.95rem; display:block;">${r.title}</strong>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${r.level} · ${r.duration} min · ${(r.skills || []).slice(0, 2).join(', ')}</span>
                </div>
                <a href="${r.route}" class="btn-primary-action" style="padding:6px 14px; font-size:0.82rem;">▶ Continue</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Category Filter Pills -->
      <div class="category-pills-row" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:20px;">
        <button class="cat-pill ${libFilterCategory === 'all' ? 'is-active' : ''}" onclick="libFilterCategory='all'; renderCurrentView();">All Lessons (${allResources.length})</button>
        <button class="cat-pill ${libFilterCategory === 'Story' ? 'is-active' : ''}" onclick="libFilterCategory='Story'; renderCurrentView();">📖 Stories</button>
        <button class="cat-pill ${libFilterCategory === 'Mystery' ? 'is-active' : ''}" onclick="libFilterCategory='Mystery'; renderCurrentView();">🕵️ Mystery</button>
        <button class="cat-pill ${libFilterCategory === 'Roleplay' ? 'is-active' : ''}" onclick="libFilterCategory='Roleplay'; renderCurrentView();">🗣️ Roleplay</button>
        <button class="cat-pill ${libFilterCategory === 'Game' ? 'is-active' : ''}" onclick="libFilterCategory='Game'; renderCurrentView();">🎮 Games</button>
        <button class="cat-pill ${libFilterCategory === 'CLIL' ? 'is-active' : ''}" onclick="libFilterCategory='CLIL'; renderCurrentView();">🌍 CLIL</button>
      </div>

      <!-- Results Count & Active Mode Indicator -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">Showing ${filtered.length} resources</span>
        ${isLibraryManageMode ? '<span style=\"background:#fef3c7; color:#b45309; padding:2px 10px; border-radius:var(--radius-pill); font-size:0.78rem; font-weight:800;\">⚙️ Manage Mode Active: Edit or Archive Resources</span>' : ''}
      </div>

      <!-- Grid Container -->
      <div id="lib-results-container">
        ${renderLibraryCardsGridHTML(filtered)}
      </div>
    `;
  }

  function renderLibraryCardsGrid(container) {
    if (!container) return;
    const allResources = store.getResources();
    const filtered = allResources.filter(r => {
      if (libSearchQuery) {
        const q = libSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = (r.description || '').toLowerCase().includes(q);
        const matchTopic = (r.topic || '').toLowerCase().includes(q);
        const matchSkills = (r.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTopic && !matchSkills) return false;
      }
      if (libFilterLevel !== 'all' && r.level !== libFilterLevel) return false;
      if (libFilterSkill !== 'all' && !(r.skills || []).includes(libFilterSkill)) return false;
      if (libFilterCategory !== 'all' && r.category !== libFilterCategory) return false;
      return true;
    });
    container.innerHTML = renderLibraryCardsGridHTML(filtered);
  }

  function renderLibraryCardsGridHTML(resources) {
    if (resources.length === 0) {
      return `
        <div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">
          <div style="font-size:36px; margin-bottom:10px;">🔍</div>
          <h3 style="font-size:1.1rem; font-weight:800;">No matching lessons found</h3>
          <p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Try clearing your filters or create a new resource.</p>
          <button class="btn-primary-action" style="margin-top:14px;" onclick="openResourceEditor()">+ Add New Resource</button>
        </div>
      `;
    }
    return `
      <div class="games-grid">
        ${resources.map(r => renderGameCard(r)).join('')}
      </div>
    `;
  }

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'Story': return '📖';
      case 'Mystery': return '🕵️';
      case 'Roleplay': return '🎭';
      case 'CLIL': return '🌍';
      case 'Grammar': return '📚';
      case 'Vocabulary': return '🧠';
      default: return '🎮';
    }
  }

  // REUSABLE GAME CARD COMPONENT (ZERO NESTED A OR BUTTON TAGS)
  function renderGameCard(r) {
    const isFav = !!r.isFavorite;

    return `
      <article class="game-card" data-id="${r.id}">
        <!-- Thumbnail Wrap -->
        <div class="card-thumbnail">
          ${r.thumbnail ? `<img src="${r.thumbnail}" alt="${r.title}" style="width:100%; height:100%; object-fit:cover;" />` : `
            <div style="width:100%; height:100%; background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); display:flex; align-items:center; justify-content:center; font-size:42px;">
              ${getCategoryIcon(r.category)}
            </div>
          `}

          <!-- Badges Overlay -->
          <div style="position:absolute; top:10px; left:10px; display:flex; gap:6px;">
            <span class="badge-cefr badge-cefr-${r.level.toLowerCase().replace('+', '-plus')}">${r.level}</span>
            <span style="font-size:0.7rem; font-weight:800; background:rgba(15,23,42,0.7); color:#fff; padding:2px 6px; border-radius:4px; backdrop-filter:blur(4px);">${r.duration}m</span>
          </div>

          <!-- Card ⋯ Dropdown Menu (No nesting) -->
          <div class="card-more-menu-wrap">
            <button class="btn-card-more" onclick="toggleCardDropdown('${r.id}', event)" title="More options" aria-label="More options">⋯</button>
            <div class="card-dropdown-menu" id="menu-${r.id}">
              <button class="card-dropdown-item" onclick="openResourceEditor('${r.id}')">✏️ Edit Resource</button>
              <button class="card-dropdown-item" onclick="handleDuplicateResource('${r.id}')">📋 Duplicate</button>
              <button class="card-dropdown-item" onclick="openAssignModal('${r.id}')">📝 Assign to Class</button>
              <button class="card-dropdown-item" onclick="handleToggleFavorite('${r.id}')">${isFav ? '★ Favorited' : '☆ Add to Favorites'}</button>
              <button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveResource('${r.id}')">🗑️ Archive</button>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <h3 class="card-title">${r.title}</h3>
          <p class="card-desc">${r.description || 'Interactive communicative task for ESL learners.'}</p>
          
          <div class="card-tags">
            ${(r.skills || []).map(sk => `<span class="card-tag">${sk}</span>`).join('')}
            <span class="card-tag" style="background:#f1f5f9; color:var(--text-muted);">Ages ${r.ages || '7–9'}</span>
          </div>
        </div>

        <!-- Card Footer Actions: 1-Click Direct Start & Assign -->
        <div class="card-footer">
          <a href="${r.route}" class="btn-start" title="Launch ${r.title}">▶ START GAME</a>
          <button class="btn-card-assign" onclick="openAssignModal('${r.id}')">Assign</button>
        </div>
      </article>
    `;
  }

  /* --------------------------------------------------------------------------
     8. ASSIGNMENTS VIEW
     -------------------------------------------------------------------------- */
  function renderAssignmentsView(container) {
    const assignments = store.getAssignments();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Class Assignments</h1>
          <p class="view-sub">Track active learning missions, student submissions, and auto-graded scores.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-create-assignment')">+ Create Assignment</button>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">
        <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);">
              <th style="padding:10px 0;">Assignment Title</th>
              <th style="padding:10px 0;">Class</th>
              <th style="padding:10px 0;">Due Date</th>
              <th style="padding:10px 0;">Submissions</th>
              <th style="padding:10px 0;">Status</th>
              <th style="padding:10px 0; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${assignments.map(a => {
              const res = store.getResource(a.activityId);
              return `
                <tr style="border-bottom:1px solid var(--border-light);">
                  <td style="padding:12px 0;">
                    <strong style="display:block; color:var(--text-main);">${a.title}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Activity: ${res ? res.title : a.activityId}</span>
                  </td>
                  <td style="padding:12px 0; font-weight:600;">${a.classId === 'class-3a' ? 'Grade 3A' : 'Grade 4B'}</td>
                  <td style="padding:12px 0; color:var(--text-muted);">${a.dueDate}</td>
                  <td style="padding:12px 0; font-weight:700;">${a.completedCount} / ${a.assignedCount}</td>
                  <td style="padding:12px 0;">
                    <span style="background:var(--color-success-soft); color:var(--color-success); padding:3px 8px; border-radius:var(--radius-pill); font-size:0.75rem; font-weight:800;">Active</span>
                  </td>
                  <td style="padding:12px 0; text-align:right;">
                    <div style="display:inline-flex; gap:6px;">
                      ${res ? `<a href="${res.route}" class="btn-sm-secondary">▶ Play</a>` : ''}
                      <button class="btn-primary-action" style="padding:4px 10px; font-size:0.78rem;" onclick="alert('Viewing student submissions for ' + '${a.title}')">Submissions</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     9. HOMEWORK VIEW
     -------------------------------------------------------------------------- */
  function renderHomeworkView(container) {
    const homework = store.getHomework();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Homework Management</h1>
          <p class="view-sub">Digital &amp; printable home missions for young learners with parent visibility.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-homework-editor')">+ Create Homework</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
        ${homework.map(h => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--color-primary); background:var(--color-primary-soft); padding:3px 8px; border-radius:4px;">${h.type}</span>
              <span style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">Due ${h.dueDate}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">${h.title}</h3>
            <p style="font-size:0.84rem; color:var(--text-muted); line-height:1.4; margin-bottom:16px;">${h.description}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px;">
              <span style="font-size:0.8rem; font-weight:700;">Class: ${h.classId === 'class-3a' ? 'Grade 3A' : 'Grade 4B'}</span>
              <button class="btn-primary-action" style="padding:4px 12px; font-size:0.8rem;" onclick="alert('Submissions view for ' + '${h.title}')">Submissions (${h.submittedCount || 0})</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     10. QUIZZES & TESTS VIEW
     -------------------------------------------------------------------------- */
  function renderQuizzesView(container) {
    const quizzes = store.getQuizzes();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Quizzes &amp; Diagnostic Tests</h1>
          <p class="view-sub">CEFR-calibrated checks to assess student grammar, vocabulary, listening and comprehension.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-quiz-builder')">+ Create Quiz</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
        ${quizzes.map(q => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge-cefr badge-cefr-${q.targetCefr.toLowerCase().replace('+', '-plus')}">${q.targetCefr}</span>
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">${q.skill}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">${q.title}</h3>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:16px;">${(q.questions || []).length} Multiple-choice questions</p>
            <div style="display:flex; gap:8px;">
              <button class="btn-primary-action" style="flex:1; justify-content:center;" onclick="alert('Interactive quiz preview opened: ' + '${q.title}')">Preview / Take Quiz</button>
              <button class="btn-sm-secondary" onclick="openAssignModal()">Assign</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     11. ASSESSMENTS VIEW
     -------------------------------------------------------------------------- */
  function renderAssessmentsView(container) {
    const students = store.getStudents();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Teacher Assessments &amp; Rubrics</h1>
          <p class="view-sub">Multi-skill observational rubric scoring across Speaking, Vocabulary, Grammar, Listening, and Pronunciation.</p>
        </div>
        <button class="btn-primary-action" onclick="openModal('modal-assessment-rubric')">+ New Assessment</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
        ${students.map(s => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div>
                <strong style="font-size:1rem; display:block;">${s.firstName} ${s.lastName}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${s.grade} · Age ${s.age}</span>
              </div>
              <span class="badge-cefr badge-cefr-${s.overallCefr.toLowerCase().replace('+', '-plus')}">${s.overallCefr}</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between;">
                <span>🗣️ Speaking:</span>
                <strong>${s.skills && s.skills.speaking ? s.skills.speaking.score : 70}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>🧠 Vocabulary:</span>
                <strong>${s.skills && s.skills.vocabulary ? s.skills.vocabulary.score : 80}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>📚 Grammar:</span>
                <strong>${s.skills && s.skills.grammar ? s.skills.grammar.score : 65}%</strong>
              </div>
            </div>

            <button class="btn-primary-action" style="width:100%; justify-content:center;" onclick="document.getElementById('rubric-student-select').value='${s.id}'; openModal('modal-assessment-rubric');">Record Assessment Rubric</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     12. PROGRESS & CEFR VIEW
     -------------------------------------------------------------------------- */
  function renderProgressView(container) {
    const students = store.getStudents();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">CEFR Progress &amp; Proficiency Tracking</h1>
        <p class="view-sub">Student advancement across Common European Framework of Reference levels (Pre-A1, A1, A1+, A2).</p>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:24px; margin-bottom:24px;">
        <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:16px;">Cohort Level Distribution</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px; text-align:center;">
            <span class="badge-cefr badge-cefr-pre-a1" style="font-size:1rem; padding:4px 12px;">Pre-A1</span>
            <div style="font-size:1.8rem; font-weight:800; margin-top:8px;">1</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Starter Level</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px; text-align:center;">
            <span class="badge-cefr badge-cefr-a1" style="font-size:1rem; padding:4px 12px;">A1</span>
            <div style="font-size:1.8rem; font-weight:800; margin-top:8px;">5</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Target Mastery</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px; text-align:center;">
            <span class="badge-cefr badge-cefr-a1-plus" style="font-size:1rem; padding:4px 12px;">A1+</span>
            <div style="font-size:1.8rem; font-weight:800; margin-top:8px;">2</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Advanced Learners</div>
          </div>
        </div>
      </div>

      <div class="students-grid">
        ${students.map(s => renderStudentCard(s)).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     13. ANALYTICS VIEW
     -------------------------------------------------------------------------- */
  function renderAnalyticsView(container) {
    const activeClass = store.getActiveClass();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Class Diagnostic Analytics</h1>
        <p class="view-sub">AI-driven diagnostics for <strong>${activeClass.name}</strong> identifying skill gaps and recommended activities.</p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
        <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--color-success); margin-bottom:12px;">🌟 Demonstrated Strengths</h3>
          <ul style="display:flex; flex-direction:column; gap:10px; font-size:0.86rem; color:var(--text-secondary); list-style:none;">
            <li>✓ <strong>Vocabulary Retention:</strong> 92% accuracy on animal and food terms.</li>
            <li>✓ <strong>Listening Discrimination:</strong> High comprehension of spoken instructions.</li>
            <li>✓ <strong>Game Engagement:</strong> Average time-on-task is 28 minutes per session.</li>
          </ul>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--color-warning); margin-bottom:12px;">⚠️ Recommended Growth Areas</h3>
          <ul style="display:flex; flex-direction:column; gap:10px; font-size:0.86rem; color:var(--text-secondary); list-style:none;">
            <li>⚡ <strong>Spontaneous Speaking:</strong> Students hesitate forming full modal sentences.</li>
            <li>⚡ <strong>Prepositions of Place:</strong> 4 students need reinforcement on "in front of" / "behind".</li>
            <li>⚡ <strong>Action Plan:</strong> Play <em>My Neighbourhood</em> and <em>The Crazy Advice Academy</em>.</li>
          </ul>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     14. REPORTS VIEW
     -------------------------------------------------------------------------- */
  function renderReportsView(container) {
    const students = store.getStudents();

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Student Progress Reports</h1>
          <p class="view-sub">Generate printable term report cards with CEFR levels, attendance, and teacher feedback.</p>
        </div>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:24px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:14px;">
          ${students.map(s => `
            <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:0.95rem;">${s.firstName} ${s.lastName}</strong>
                <span class="badge-cefr badge-cefr-${s.overallCefr.toLowerCase().replace('+', '-plus')}">${s.overallCefr}</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Term 1 Report Card Ready</div>
              <button class="btn-primary-action" style="width:100%; justify-content:center; font-size:0.8rem;" onclick="openReportGenerator('${s.id}')">🖨️ View &amp; Print Report</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     15. CLASS STORY VIEW
     -------------------------------------------------------------------------- */
  function renderClassStoryView(container) {
    const activeClass = store.getActiveClass();
    const posts = store.getClassStory(activeClass.id);

    container.innerHTML = `
      <div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="view-greeting">Class Story</h1>
          <p class="view-sub">Share classroom moments, student work, and learning milestones with parents.</p>
        </div>
        <button class="btn-primary-action" onclick="document.getElementById('story-post-class').value='${activeClass.id}'; openModal('modal-story-post');">+ New Post</button>
      </div>

      <div class="story-feed">
        ${posts.map(p => renderStoryPost(p)).join('')}
      </div>
    `;
  }

  function renderStoryPost(p) {
    return `
      <div class="story-post-card">
        <div class="story-post-header">
          <div class="story-author-box">
            <div class="avatar-initials">SJ</div>
            <div>
              <div class="story-author-name">Ms. Sarah · ${p.authorRole || 'Teacher'}</div>
              <div class="story-post-time">${p.timestamp || 'Today'} · ${p.category || 'Classroom Moment'}</div>
            </div>
          </div>
        </div>
        <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">${p.title}</h3>
        <p class="story-post-text">${p.content}</p>
        ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:var(--radius-md); margin-top:10px;" />` : ''}
        <div class="story-post-footer">
          <button class="btn-like ${(p.likes || 0) > 0 ? 'is-liked' : ''}" onclick="handleLikeStoryPost('${p.id}')">
            ❤️ ${p.likes || 0} Likes
          </button>
          <span style="font-size:0.75rem; color:var(--text-muted);">Visible to all parents in class</span>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     16. MESSAGES VIEW
     -------------------------------------------------------------------------- */
  function renderMessagesView(container) {
    const threads = store.getMessageThreads();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Family Messaging</h1>
        <p class="view-sub">Direct two-way communication between teachers and parents.</p>
      </div>

      <div class="messages-split-view">
        <div class="threads-pane">
          ${threads.map((th, idx) => `
            <div class="thread-item ${idx === 0 ? 'is-active' : ''}">
              <div style="font-weight:700; font-size:0.9rem;">${th.parentName}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Student: ${th.studentName}</div>
            </div>
          `).join('')}
        </div>

        <div class="chat-pane">
          <div class="chat-header">
            <strong>${threads[0] ? threads[0].parentName : 'Parent'}</strong>
            <span style="font-size:0.78rem; color:var(--text-muted);">Online</span>
          </div>
          <div class="chat-messages">
            ${threads[0] ? threads[0].messages.map(m => `
              <div class="msg-bubble ${m.from === 'teacher' ? 'msg-teacher' : 'msg-parent'}">
                <p>${m.text}</p>
                <span class="msg-time">${m.time}</span>
              </div>
            `).join('') : ''}
          </div>
          <div class="chat-input-bar">
            <input type="text" id="parent-msg-input" class="search-input" placeholder="Type a message to the family..." onkeydown="if(event.key === 'Enter') handleSendParentMessage('${threads[0] ? threads[0].id : ''}', 'parent-msg-input');" />
            <button class="btn-primary-action" onclick="handleSendParentMessage('${threads[0] ? threads[0].id : ''}', 'parent-msg-input');">Send</button>
          </div>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     17. PORTFOLIOS VIEW
     -------------------------------------------------------------------------- */
  function renderPortfoliosView(container) {
    const students = store.getStudents();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Student Learning Portfolios</h1>
        <p class="view-sub">Curated collections of student creative work, voice recordings, drawings, and badges.</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
        ${students.map(s => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div style="font-size:28px;">${s.avatar && s.avatar.hair === 'boy' ? '👦' : '👧'}</div>
              <div>
                <strong style="font-size:0.95rem; display:block;">${s.firstName} ${s.lastName}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${s.grade} · 4 Portfolio Artifacts</span>
              </div>
            </div>
            <div style="background:var(--bg-canvas); padding:10px; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:12px;">
              🎨 <em>"My Crazy Monster"</em> drawing &amp; audio description
            </div>
            <button class="btn-primary-action" style="width:100%; justify-content:center; font-size:0.82rem;" onclick="openStudentDetail('${s.id}')">Explore Portfolio</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     18. STUDENT & PARENT VIEWS
     -------------------------------------------------------------------------- */
  function renderStudentAdventureView(container) {
    const student = store.getActiveStudent();

    container.innerHTML = `
      <div class="view-header" style="text-align:center;">
        <h1 class="view-greeting" style="font-size:1.8rem;">🌟 Welcome back, ${student.firstName}!</h1>
        <p class="view-sub">Level ${student.overallCefr} Explorer · ${student.xp} Total XP · 🔥 ${student.streakDays}-Day Streak</p>
      </div>

      <div class="adventure-map-container">
        <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:16px;">🗺️ Your Learning Worlds Trail</h2>
        <div class="worlds-trail">
          <div class="world-node is-completed">
            <div class="world-icon">👾</div>
            <div class="world-name">Monster Lab</div>
            <span class="world-status-tag">Completed</span>
          </div>
          <div class="world-node is-completed">
            <div class="world-icon">🚒</div>
            <div class="world-name">Fire Station</div>
            <span class="world-status-tag">Completed</span>
          </div>
          <div class="world-node is-active">
            <div class="world-icon">🍽️</div>
            <div class="world-name">Restaurant</div>
            <span class="world-status-tag">Current</span>
          </div>
          <div class="world-node is-locked">
            <div class="world-icon">🏝️</div>
            <div class="world-name">Treasure Isle</div>
            <span class="world-status-tag">Locked</span>
          </div>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="restaurant/index.html" class="btn-primary-action" style="font-size:1rem; padding:12px 28px; border-radius:var(--radius-pill);">▶ Enter Today's Mission (Restaurant)</a>
      </div>
    `;
  }

  function renderStudentTasksView(container) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">📋 My Missions</h1>
        <p class="view-sub">Complete your daily missions to earn XP and unlock badges!</p>
      </div>
      <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border-light);">
          <div>
            <strong>Build Your Monster</strong>
            <p style="font-size:0.8rem; color:var(--text-muted);">Name 5 body parts and describe colors</p>
          </div>
          <a href="monster day/index.html" class="btn-primary-action">Play Mission</a>
        </div>
      </div>
    `;
  }

  function renderStudentBadgesView(container) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">🏆 Badges &amp; Trophies</h1>
        <p class="view-sub">Trophies earned on your learning adventure.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:14px; text-align:center;">
        <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">
          <div style="font-size:48px;">🌟</div>
          <strong style="display:block; margin-top:8px;">First Words</strong>
          <span style="font-size:0.75rem; color:var(--color-success); font-weight:700;">Unlocked</span>
        </div>
        <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">
          <div style="font-size:48px;">🔥</div>
          <strong style="display:block; margin-top:8px;">5-Day Streak</strong>
          <span style="font-size:0.75rem; color:var(--color-success); font-weight:700;">Unlocked</span>
        </div>
      </div>
    `;
  }

  function renderLeaderboardView(container) {
    const students = store.getStudents();
    const sorted = [...students].sort((a, b) => b.xp - a.xp);

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">🌟 Class Leaderboard</h1>
        <p class="view-sub">Top explorers in Grade 3A this week!</p>
      </div>
      <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">
        ${sorted.map((s, idx) => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border-light);">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-weight:800; width:24px;">#${idx + 1}</span>
              <span>${s.firstName} ${s.lastName}</span>
            </div>
            <strong>${s.xp} XP</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderParentHomeView(container) {
    const student = store.getActiveStudent();

    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Emma Chen's Learning Journey</h1>
        <p class="view-sub">Grade 3A · English Adventure Academy · Teacher: Ms. Sarah</p>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">CEFR Level</span>
          <span class="kpi-val" style="color:var(--color-primary);">${student.overallCefr}</span>
          <span class="kpi-sub">On Track for Grade 3</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Total XP</span>
          <span class="kpi-val">${student.xp}</span>
          <span class="kpi-sub">⭐ Excellent Engagement</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Attendance</span>
          <span class="kpi-val">96%</span>
          <span class="kpi-sub" style="color:var(--color-success); font-weight:700;">Present Every Class</span>
        </div>
      </div>
    `;
  }

  function renderParentHomeworkView(container) {
    container.innerHTML = `
      <div class="view-header">
        <h1 class="view-greeting">Homework &amp; Practice Tasks</h1>
        <p class="view-sub">Assignments set by Ms. Sarah for home reinforcement.</p>
      </div>
      <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">
        <p style="font-size:0.9rem;"><strong>At the Restaurant Roleplay</strong> · Due Friday</p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Practice ordering food politely using "Can I have... please?".</p>
      </div>
    `;
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();