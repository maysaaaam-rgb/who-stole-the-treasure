/**
 * ENGLISH ADVENTURE ACADEMY — MASTER APPLICATION CONTROLLER & ROUTER
 * Version 3.0 (Full CRUD & Relational Management)
 * Connects directly to window.schoolStore
 */

(function(root) {
  'use strict';

  const store = window.schoolStore;
  if (!store) {
    console.error('MasterSchoolStore not found on window!');
    return;
  }

  // Application State
  let currentView = 'dashboard';
  let selectedClassDetailId = 'class-3a';
  let selectedClassDetailTab = 'classroom';
  let studentProfileActiveTab = 'overview';
  let currentProfileStudentId = 'student-emma';
  let isLibraryManageMode = false;
  let activeCardMenuId = null;
  let activeCreateMenuOpen = false;

  // Classroom Hub state
  let classroomActiveSubTab = 'students'; // 'students' | 'groups'
  let isMultiSelectMode = false;
  let selectedStudentIds = new Set();
  let timerInterval = null;
  let timerRemainingSeconds = 180;
  let timerIsRunning = false;
  let timerPresetSeconds = 180;
  let randomPickerExclusions = new Set();
  let lastPickedStudentId = null;
  let isClassroomSmartboardMode = false;

  // Library filters
  let libSearchQuery = '';
  let libFilterLevel = 'all';
  let libFilterSkill = 'all';
  let libFilterCategory = 'all';
  let libFilterDuration = 'all';

  // Curriculum active book
  let curriculumActiveBookId = 'book-1';

  // Confirmation modal state
  let pendingActionCallback = null;

  // =========================================================================
  // 1. INITIALIZATION & GLOBAL EVENT LISTENERS
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
      if (activeCardMenuId && !e.target.closest('.card-more-menu-wrap') && !e.target.closest('.row-more-menu-wrap')) {
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
      '<option value="' + c.id + '" ' + (c.id === activeClass.id ? 'selected' : '') + '>' + c.name + '</option>'
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
      if (userName) userName.textContent = 'Mr. Chen (Parent)';
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
  
  // Helper: map avatar hair & outfit to emoji
  function getStudentAvatarEmoji(avatar) {
    if (!avatar) return '👧';
    if (typeof avatar === 'string') return avatar;
    const hair = avatar.hair || 'girl';
    switch (hair) {
      case 'boy': return '👦';
      case 'star': return '🦸';
      case 'bear': return '🐼';
      case 'fox': return '🦊';
      case 'rocket': return '🚀';
      case 'scout': return '🧒';
      case 'lion': return '🦁';
      case 'dolphin': return '🐬';
      default: return '👧';
    }
  }

  // Helper: compute average mastery percentage across all 7 language skills
  function calculateStudentProgressPct(studentId) {
    const skills = store.getStudentSkills(studentId);
    const vals = Object.values(skills).map(s => s.score);
    if (!vals.length) return 75;
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round(sum / vals.length);
  }

  // Helper: determine real-time status (active, attention, absent, unassessed)
  function determineStudentStatus(studentId, classId) {
    const attRecords = store.getAttendanceRecords(classId);
    const latestAtt = attRecords.filter(r => r.studentId === studentId).sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
    if (latestAtt && latestAtt.status === 'Absent') return 'absent';
    const pct = calculateStudentProgressPct(studentId);
    if (pct < 65) return 'attention';
    const ev = (store.state.learningEvidence || []).filter(e => e.studentId === studentId);
    if (!ev.length) return 'unassessed';
    return 'active';
  }

  window.switchClassTab = function(tabName) {
    selectedClassDetailTab = tabName;
    const toolkit = document.getElementById('classroom-floating-toolkit');
    if (toolkit) {
      toolkit.style.display = (currentView === 'classes' || currentView === 'class-detail' || currentView === 'students') ? 'flex' : 'none';
    }
    const container = document.getElementById('app-view-container');
    if (container) renderClassDetailView(container);
  };

  // Switch tab in Student Profile
  window.switchStudentProfileTab = function(tabName) {
    studentProfileActiveTab = tabName;
    window.openStudentDetail(currentProfileStudentId, tabName);
  };

  // =========================================================================
  // 2. MODAL & CONFIRMATION CONTROLLERS
  // =========================================================================
  window.toggleCreateDropdown = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('header-create-menu');
    if (!menu) return;
    activeCreateMenuOpen = !activeCreateMenuOpen;
    if (activeCreateMenuOpen) menu.classList.add('is-open');
    else menu.classList.remove('is-open');
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
    document.querySelectorAll('.card-dropdown-menu.is-open, .row-dropdown-menu.is-open').forEach(m => m.classList.remove('is-open'));
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
      populateModalDropdowns();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => m.classList.remove('is-open'));
    document.body.style.overflow = '';
  };

  // Reusable Confirmation Dialog
  window.confirmAction = function({ title, message, confirmText = 'Confirm', isDanger = true, onConfirm }) {
    const modal = document.getElementById('modal-confirm-action');
    if (!modal) {
      if (confirm(title + '\n\n' + message)) {
        if (onConfirm) onConfirm();
      }
      return;
    }

    document.getElementById('confirm-action-title').textContent = title;
    document.getElementById('confirm-action-message').textContent = message;
    const confirmBtn = document.getElementById('confirm-action-submit-btn');
    confirmBtn.textContent = confirmText;
    confirmBtn.className = isDanger ? 'btn-primary-action btn-danger' : 'btn-primary-action';
    if (isDanger) confirmBtn.style.background = 'var(--color-danger)';
    else confirmBtn.style.background = 'var(--color-primary)';

    pendingActionCallback = onConfirm;
    window.openModal('modal-confirm-action');
  };

  window.handleExecuteConfirmedAction = function() {
    window.closeAllModals();
    if (pendingActionCallback) {
      pendingActionCallback();
      pendingActionCallback = null;
    }
  };

  function populateModalDropdowns() {
    const classes = store.getClasses();
    const students = store.getStudents();
    const resources = store.getResources();

    ['new-stud-class', 'new-asg-class', 'new-hw-class', 'story-post-class'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = classes.map(c => '<option value="' + c.id + '">' + c.name + '</option>').join('');
      }
    });

    const gameSelect = document.getElementById('new-asg-game');
    if (gameSelect) {
      gameSelect.innerHTML = resources.map(r => '<option value="' + r.id + '">' + r.title + ' (' + r.level + ')</option>').join('');
    }

    ['xp-student-select', 'rubric-student-select'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = students.map(s => '<option value="' + s.id + '">' + s.firstName + ' ' + s.lastName + ' (' + s.grade + ')</option>').join('');
      }
    });
  }

  // =========================================================================
  // 3. ENTITY CRUD HANDLERS (STUDENTS, CLASSES, GAMES, CURRICULUM, ETC.)
  // =========================================================================

  // STUDENT CRUD HANDLERS
  window.openStudentModal = function(studentId = null) {
    const title = document.getElementById('student-modal-title');
    const idInput = document.getElementById('edit-stud-id');
    const fname = document.getElementById('new-stud-fname');
    const lname = document.getElementById('new-stud-lname');
    const studIdNum = document.getElementById('new-stud-idnum');
    const age = document.getElementById('new-stud-age');
    const cefr = document.getElementById('new-stud-cefr');
    const cls = document.getElementById('new-stud-class');
    const avatar = document.getElementById('new-stud-avatar');
    const parentName = document.getElementById('new-stud-pname');
    const parentContact = document.getElementById('new-stud-pcontact');
    const submitBtn = document.getElementById('btn-student-modal-submit');

    populateModalDropdowns();

    if (studentId) {
      const s = store.getStudent(studentId);
      if (!s) return;
      title.textContent = 'Edit Student: ' + s.firstName + ' ' + s.lastName;
      if (submitBtn) submitBtn.textContent = 'Save Changes';
      idInput.value = s.id;
      fname.value = s.firstName;
      lname.value = s.lastName;
      if (studIdNum) studIdNum.value = s.studentIdNumber || '';
      age.value = s.age;
      cefr.value = s.overallCefr;
      if (cls && s.classId) cls.value = s.classId;
      if (avatar && s.avatar) avatar.value = s.avatar.hair || 'girl';
      if (parentName) parentName.value = s.parentName || '';
      if (parentContact) parentContact.value = s.parentContact || '';
    } else {
      title.textContent = 'Add Student';
      if (submitBtn) submitBtn.textContent = 'Create Student';
      idInput.value = '';
      fname.value = '';
      lname.value = '';
      if (studIdNum) studIdNum.value = 'EAA-' + new Date().getFullYear() + '-' + String(store.getStudents().length + 1).padStart(3, '0');
      age.value = '8';
      cefr.value = 'A1';
      if (parentName) parentName.value = '';
      if (parentContact) parentContact.value = '';
    }

    window.openModal('modal-student-editor');
  };

  window.handleSaveStudent = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-stud-id').value;
    const firstName = document.getElementById('new-stud-fname').value.trim();
    const lastName = document.getElementById('new-stud-lname').value.trim();
    const studentIdNumber = document.getElementById('new-stud-idnum') ? document.getElementById('new-stud-idnum').value.trim() : '';
    const age = parseInt(document.getElementById('new-stud-age').value, 10) || 8;
    const overallCefr = document.getElementById('new-stud-cefr').value;
    const classId = document.getElementById('new-stud-class').value;
    const avatarHair = document.getElementById('new-stud-avatar') ? document.getElementById('new-stud-avatar').value : 'girl';
    const parentName = document.getElementById('new-stud-pname') ? document.getElementById('new-stud-pname').value.trim() : '';
    const parentContact = document.getElementById('new-stud-pcontact') ? document.getElementById('new-stud-pcontact').value.trim() : '';

    const payload = {
      firstName,
      lastName,
      studentIdNumber,
      age,
      overallCefr,
      classId,
      avatar: { hair: avatarHair, outfit: 'explorer', accessory: 'badge' },
      parentName,
      parentContact
    };

    if (editId) {
      store.updateStudent(editId, payload);
    } else {
      store.addStudent(payload);
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleArchiveStudent = function(studentId) {
    closeAllCardMenus();
    const s = store.getStudent(studentId);
    if (!s) return;
    window.confirmAction({
      title: 'Archive ' + s.firstName + ' ' + s.lastName + '?',
      message: 'Her/his historical grades, attendance, assignments, and progress will be preserved in archived records.',
      confirmText: 'Archive Student',
      isDanger: true,
      onConfirm: () => {
        store.archiveStudent(studentId);
        window.closeAllModals();
        renderCurrentView();
      }
    });
  };

  window.handleRemoveStudentFromClass = function(studentId) {
    closeAllCardMenus();
    const s = store.getStudent(studentId);
    if (!s) return;
    window.confirmAction({
      title: 'Remove ' + s.firstName + ' from Class?',
      message: 'The student will remain in the school directory, but will be un-enrolled from this cohort.',
      confirmText: 'Remove from Class',
      isDanger: false,
      onConfirm: () => {
        store.removeStudentFromClass(studentId);
        window.closeAllModals();
        renderCurrentView();
      }
    });
  };

  window.handleDeleteStudentPermanently = function(studentId) {
    closeAllCardMenus();
    const s = store.getStudent(studentId);
    if (!s) return;
    window.confirmAction({
      title: 'Permanently Delete ' + s.firstName + ' ' + s.lastName + '?',
      message: 'WARNING: This will permanently remove the student record. This action cannot be undone.',
      confirmText: 'Delete Permanently',
      isDanger: true,
      onConfirm: () => {
        store.deleteStudent(studentId);
        window.closeAllModals();
        renderCurrentView();
      }
    });
  };

  // CLASS CRUD HANDLERS
  window.openClassModal = function(classId = null) {
    const title = document.getElementById('class-modal-title');
    const idInput = document.getElementById('edit-cls-id');
    const nameInput = document.getElementById('new-cls-name');
    const gradeInput = document.getElementById('new-cls-grade');
    const yearInput = document.getElementById('new-cls-year');
    const cefrInput = document.getElementById('new-cls-cefr');
    const roomInput = document.getElementById('new-cls-room');
    const scheduleInput = document.getElementById('new-cls-schedule');
    const descInput = document.getElementById('new-cls-desc');
    const submitBtn = document.getElementById('btn-class-modal-submit');

    if (classId) {
      const c = store.getClass(classId);
      if (!c) return;
      title.textContent = 'Edit Class: ' + c.name;
      if (submitBtn) submitBtn.textContent = 'Save Changes';
      idInput.value = c.id;
      nameInput.value = c.name;
      gradeInput.value = c.grade;
      if (yearInput) yearInput.value = c.academicYear || '2026–2027';
      cefrInput.value = c.cefrTarget || 'A1';
      roomInput.value = c.room;
      scheduleInput.value = c.schedule;
      if (descInput) descInput.value = c.description || '';
    } else {
      title.textContent = 'Create Class';
      if (submitBtn) submitBtn.textContent = 'Create Class';
      idInput.value = '';
      nameInput.value = '';
      gradeInput.value = 'Grade 3';
      if (yearInput) yearInput.value = '2026–2027';
      cefrInput.value = 'A1';
      roomInput.value = 'Room 204';
      scheduleInput.value = 'Mon, Wed · 10:00 – 10:45';
      if (descInput) descInput.value = '';
    }

    window.openModal('modal-add-class');
  };

  window.handleSaveClass = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-cls-id').value;
    const name = document.getElementById('new-cls-name').value.trim();
    const grade = document.getElementById('new-cls-grade').value.trim();
    const academicYear = document.getElementById('new-cls-year') ? document.getElementById('new-cls-year').value.trim() : '2026–2027';
    const cefrTarget = document.getElementById('new-cls-cefr').value;
    const room = document.getElementById('new-cls-room').value.trim();
    const schedule = document.getElementById('new-cls-schedule').value.trim();
    const description = document.getElementById('new-cls-desc') ? document.getElementById('new-cls-desc').value.trim() : '';

    const payload = { name, grade, academicYear, cefrTarget, room, schedule, description };

    if (editId) {
      store.updateClass(editId, payload);
      window.closeAllModals();
      renderCurrentView();
    } else {
      const newClass = store.addClass(payload);
      window.closeAllModals();
      window.openClass(newClass.id, 'overview');
    }
  };

  window.handleDuplicateClass = function(classId) {
    closeAllCardMenus();
    store.duplicateClass(classId);
    renderCurrentView();
  };

  window.handleArchiveClass = function(classId) {
    closeAllCardMenus();
    const c = store.getClass(classId);
    if (!c) return;
    window.confirmAction({
      title: 'Archive ' + c.name + '?',
      message: 'The class will be moved to archived status. Student historical records will remain intact.',
      confirmText: 'Archive Class',
      isDanger: true,
      onConfirm: () => {
        store.archiveClass(classId);
        window.switchView('classes');
      }
    });
  };

  // GAME / RESOURCE CRUD HANDLERS
  window.openResourceEditor = function(resourceId = null) {
    closeAllCardMenus();
    const modal = document.getElementById('modal-resource-editor');
    if (!modal) return;
    const form = document.getElementById('form-resource-editor');
    const title = document.getElementById('resource-modal-title');

    if (resourceId) {
      const res = store.getResource(resourceId);
      if (!res) return;
      title.textContent = 'Edit Game: ' + res.title;
      document.getElementById('res-edit-id').value = res.id;
      document.getElementById('res-title').value = res.title;
      document.getElementById('res-category').value = res.category || 'Classroom Game';
      document.getElementById('res-description').value = res.description || '';
      document.getElementById('res-level').value = res.level || 'A1';
      document.getElementById('res-ages').value = res.age || res.ages || '7–9';
      document.getElementById('res-grade').value = res.grade || 'Grade 3';
      document.getElementById('res-duration').value = res.duration || 30;
      document.getElementById('res-topic').value = Array.isArray(res.topics) ? res.topics.join(', ') : (res.topics || '');
      document.getElementById('res-route').value = res.route || '';
      document.getElementById('res-objectives').value = Array.isArray(res.objectives) ? res.objectives.join(', ') : (res.objectives || '');
      document.getElementById('res-worksheet').checked = !!res.worksheet;
      document.getElementById('res-guide').checked = !!res.teacherGuide;
      document.getElementById('res-featured').checked = !!res.featured;

      const skillBoxes = document.querySelectorAll('input[name="res-skills"]');
      skillBoxes.forEach(cb => {
        cb.checked = (res.skills || []).includes(cb.value);
      });
    } else {
      title.textContent = 'Add Game';
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
    const topics = document.getElementById('res-topic').value.split(',').map(s => s.trim()).filter(Boolean);

    const resourceData = {
      title: document.getElementById('res-title').value.trim(),
      category: document.getElementById('res-category').value,
      description: document.getElementById('res-description').value.trim(),
      level: document.getElementById('res-level').value,
      age: document.getElementById('res-ages').value.trim(),
      grade: document.getElementById('res-grade').value.trim(),
      duration: parseInt(document.getElementById('res-duration').value, 10) || 30,
      topics: topics.length ? topics : ['Classroom English'],
      route: document.getElementById('res-route').value.trim(),
      skills: skills.length ? skills : ['Speaking', 'Vocabulary'],
      objectives: objectives.length ? objectives : ['Communicative practice'],
      worksheet: document.getElementById('res-worksheet').checked ? 'Included' : null,
      teacherGuide: document.getElementById('res-guide').checked,
      featured: document.getElementById('res-featured').checked
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
    if (!res) return;
    window.confirmAction({
      title: 'Archive ' + res.title + '?',
      message: 'The game will disappear from the active library, but historical student completions and grades will remain intact.',
      confirmText: 'Archive Game',
      isDanger: true,
      onConfirm: () => {
        store.archiveResource(resourceId);
        renderCurrentView();
      }
    });
  };

  window.handleToggleFeaturedResource = function(resourceId) {
    closeAllCardMenus();
    const res = store.getResource(resourceId);
    if (res) {
      store.updateResource(resourceId, { featured: !res.featured });
      renderCurrentView();
    }
  };

  // CURRICULUM CRUD HANDLERS
  window.openAddUnitModal = function(bookId = null) {
    const targetBook = bookId || curriculumActiveBookId;
    const title = prompt('Enter Unit Title (e.g. Unit 6: Space & Technology):');
    if (title && title.trim()) {
      const vocab = prompt('Enter Target Vocabulary (comma separated):', 'spaceship, astronaut, stars, launch');
      store.addUnit({
        bookId: targetBook,
        title: title.trim(),
        targetVocab: vocab || ''
      });
      renderCurrentView();
    }
  };

  window.openEditUnitModal = function(unitId) {
    const unit = store.getUnits().find(u => u.id === unitId);
    if (!unit) return;
    const newTitle = prompt('Edit Unit Title:', unit.title);
    if (newTitle && newTitle.trim()) {
      const vocab = prompt('Edit Target Vocabulary:', (unit.targetVocab || []).join(', '));
      store.updateUnit(unitId, {
        title: newTitle.trim(),
        targetVocab: vocab || ''
      });
      renderCurrentView();
    }
  };

  window.handleDuplicateUnit = function(unitId) {
    store.duplicateUnit(unitId);
    renderCurrentView();
  };

  window.handleArchiveUnit = function(unitId) {
    const unit = store.getUnits().find(u => u.id === unitId);
    if (!unit) return;
    window.confirmAction({
      title: 'Archive ' + unit.title + '?',
      message: 'The unit will be moved to archived status. Historical assignments will remain intact.',
      confirmText: 'Archive Unit',
      isDanger: true,
      onConfirm: () => {
        store.archiveUnit(unitId);
        renderCurrentView();
      }
    });
  };

  window.openAddLessonModal = function(unitId) {
    const title = prompt('Enter Lesson Title (e.g. Astronaut Daily Routine):');
    if (title && title.trim()) {
      const objective = prompt('Enter Communicative Objective:', 'Describe space daily duties using present simple');
      const gameRoute = prompt('Enter launch game route (optional):', 'story/space/index.html');
      store.addLesson({
        unitId,
        title: title.trim(),
        objective: objective || 'Core communicative objective',
        gameRoute: gameRoute || ''
      });
      renderCurrentView();
    }
  };

  window.openEditLessonModal = function(lessonId) {
    const lesson = store.getLessons().find(l => l.id === lessonId);
    if (!lesson) return;
    const newTitle = prompt('Edit Lesson Title:', lesson.title);
    if (newTitle && newTitle.trim()) {
      const objective = prompt('Edit Communicative Objective:', lesson.objective || '');
      const gameRoute = prompt('Edit launch game route:', lesson.gameRoute || '');
      store.updateLesson(lessonId, {
        title: newTitle.trim(),
        objective: objective || '',
        gameRoute: gameRoute || ''
      });
      renderCurrentView();
    }
  };

  window.handleArchiveLesson = function(lessonId) {
    const lesson = store.getLessons().find(l => l.id === lessonId);
    if (!lesson) return;
    window.confirmAction({
      title: 'Archive ' + lesson.title + '?',
      message: 'The lesson will be archived from the curriculum syllabus.',
      confirmText: 'Archive Lesson',
      isDanger: true,
      onConfirm: () => {
        store.archiveLesson(lessonId);
        renderCurrentView();
      }
    });
  };

  window.openAddObjectiveModal = function(lessonId) {
    const text = prompt('Enter Learning Objective:');
    if (text && text.trim()) {
      const skill = prompt('Enter Target Skill (Speaking, Listening, Vocabulary, Grammar, Reading):', 'Speaking');
      store.addObjective({
        lessonId,
        text: text.trim(),
        skill: skill || 'Speaking',
        cefr: 'A1'
      });
      renderCurrentView();
    }
  };

  window.handleDeleteObjective = function(objId) {
    if (confirm('Delete this learning objective?')) {
      store.deleteObjective(objId);
      renderCurrentView();
    }
  };

  // ASSIGNMENTS & HOMEWORK CRUD HANDLERS
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
    const dueDate = document.getElementById('new-asg-date').value || 'Sep 25, 2026';
    const instructions = document.getElementById('new-asg-inst').value.trim();

    store.createAssignment({ title, classId, activityId, dueDate, instructions });
    window.closeAllModals();
    window.switchView('assignments');
  };

  window.handleArchiveAssignment = function(asgId) {
    const a = store.getAssignment(asgId);
    if (!a) return;
    window.confirmAction({
      title: 'Archive ' + a.title + '?',
      message: 'The assignment will be closed and moved to archived tasks.',
      confirmText: 'Archive Assignment',
      isDanger: true,
      onConfirm: () => {
        store.archiveAssignment(asgId);
        renderCurrentView();
      }
    });
  };

  window.handleDuplicateAssignment = function(asgId) {
    store.duplicateAssignment(asgId);
    renderCurrentView();
  };

  // Homework CRUD
  window.handleCreateHomework = function(e) {
    e.preventDefault();
    const title = document.getElementById('new-hw-title').value.trim();
    const type = document.getElementById('new-hw-type').value;
    const classId = document.getElementById('new-hw-class').value;
    const dueDate = document.getElementById('new-hw-date').value || 'Sep 25, 2026';
    const description = document.getElementById('new-hw-desc').value.trim();

    store.createHomework({ title, type, classId, dueDate, description });
    window.closeAllModals();
    window.switchView('homework');
  };

  window.handleArchiveHomework = function(hwId) {
    const h = store.getHomeworkItem(hwId);
    if (!h) return;
    window.confirmAction({
      title: 'Archive ' + h.title + '?',
      message: 'This homework task will be archived.',
      confirmText: 'Archive Homework',
      isDanger: true,
      onConfirm: () => {
        store.archiveHomework(hwId);
        renderCurrentView();
      }
    });
  };

  // Quizzes CRUD
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
        { id: 'q-1', question: q1, options: [opt1, opt2], correctIndex: 0 }
      ]
    });

    window.closeAllModals();
    window.switchView('quizzes');
  };

  window.handleArchiveQuiz = function(quizId) {
    const q = store.getQuiz(quizId);
    if (!q) return;
    window.confirmAction({
      title: 'Archive ' + q.title + '?',
      message: 'The quiz will be archived from the test bank.',
      confirmText: 'Archive Quiz',
      isDanger: true,
      onConfirm: () => {
        store.archiveQuiz(quizId);
        renderCurrentView();
      }
    });
  };

  // XP & GAMIFICATION HANDLERS
  window.handleGiveXPSubmit = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('xp-student-select').value;
    const amount = parseInt(document.getElementById('xp-amount-val').value, 10) || 50;
    const reason = document.getElementById('xp-reason-select').value;

    const res = store.giveXP(studentId, amount, reason, 'Teacher Award');
    window.closeAllModals();
    alert('⭐ Awarded +' + amount + ' XP to ' + res.student.firstName + ' for "' + reason + '"! New total: ' + res.newTotalXP + ' XP');
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

    const res = store.recordAssessment(studentId, rubricScores, comment);
    window.closeAllModals();
    alert('✓ Assessment recorded for ' + res.student.firstName + '! Updated Overall CEFR: ' + res.overallCefr);
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

  window.handleDeleteStoryPost = function(postId) {
    window.confirmAction({
      title: 'Delete Story Post?',
      message: 'This post will be permanently removed from the class story feed.',
      confirmText: 'Delete Post',
      isDanger: true,
      onConfirm: () => {
        store.deleteStoryPost(postId);
        renderCurrentView();
      }
    });
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

  // =========================================================================
  // 4. STUDENT PROFILE MANAGEMENT CENTER (8 SUB-TABS)
  // =========================================================================
  window.openStudentDetail = function(studentId, activeTab = 'overview') {
    currentProfileStudentId = studentId;
    studentProfileActiveTab = activeTab;
    const student = store.getStudent(studentId);
    if (!student) return;
    const modal = document.getElementById('modal-student-profile');
    if (!modal) return;

    const totalXP = store.getStudentTotalXP(studentId);
    const attRate = store.getStudentAttendanceRate(studentId);
    const skills = store.getStudentSkills(studentId);
    const assignments = store.getAssignments().filter(a => a.studentIds === 'all' || (Array.isArray(a.studentIds) && a.studentIds.includes(studentId)));
    const assessments = store.getAssessments(studentId);
    const notes = store.getTeacherNotes(studentId);
    const xpTxs = store.getXPTransactions(studentId);
    const attRecords = store.state.attendanceRecords.filter(r => r.studentId === studentId);

    const profileTabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'progress', label: 'Progress & CEFR' },
      { id: 'assignments', label: 'Assignments (' + assignments.length + ')' },
      { id: 'assessments', label: 'Assessments (' + assessments.length + ')' },
      { id: 'attendance', label: 'Attendance (' + attRate + '%)' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'xp', label: 'XP Ledger (' + totalXP + ')' },
      { id: 'notes', label: 'Notes (' + notes.length + ')' }
    ];

    modal.innerHTML = 
      '<div class="modal-dialog" style="max-width: 820px; max-height: 90vh; overflow-y: auto;">' +
        '<button class="modal-close-btn" onclick="closeAllModals()">✕</button>' +

        '<!-- Management Header Bar -->' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-light); padding-bottom:16px; margin-bottom:14px; flex-wrap:wrap; gap:12px;">' +
          '<div style="display:flex; align-items:center; gap:14px;">' +
            '<div style="width:56px; height:56px; border-radius:var(--radius-pill); background:var(--color-primary-soft); display:flex; align-items:center; justify-content:center; font-size:30px;">' +
              (student.avatar && student.avatar.hair === 'boy' ? '👦' : '👧') +
            '</div>' +
            '<div>' +
              '<div style="display:flex; align-items:center; gap:8px;">' +
                '<h2 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">' + student.firstName + ' ' + student.lastName + '</h2>' +
                '<span class="badge-cefr badge-cefr-' + student.overallCefr.toLowerCase().replace('+', '-plus') + '">' + student.overallCefr + '</span>' +
              '</div>' +
              '<p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">' +
                'ID: <strong>' + (student.studentIdNumber || 'EAA-001') + '</strong> · ' + student.grade + ' · Age ' + student.age + ' · ⭐ ' + totalXP + ' XP' +
              '</p>' +
            '</div>' +
          '</div>' +

          '<!-- Top Management Controls -->' +
          '<div style="display:flex; gap:8px;">' +
            '<button class="btn-sm-secondary" onclick="openStudentModal(\'' + student.id + '\')">✏️ Edit Student</button>' +
            '<button class="btn-sm-secondary" onclick="openAssignModal()">📝 Assign Activity</button>' +
            '<div class="card-more-menu-wrap" style="position:relative;">' +
              '<button class="btn-card-more" onclick="toggleCardDropdown(\'prof-' + student.id + '\', event)" title="More Management Options">⋯</button>' +
              '<div class="card-dropdown-menu" id="menu-prof-' + student.id + '">' +
                '<button class="card-dropdown-item" onclick="document.getElementById(\'xp-student-select\').value=\'' + student.id + '\'; openModal(\'modal-give-xp\');">⭐ Give XP</button>' +
                '<button class="card-dropdown-item" onclick="openReportGenerator(\'' + student.id + '\')">🖨️ Generate Report</button>' +
                '<button class="card-dropdown-item" onclick="handleRemoveStudentFromClass(\'' + student.id + '\')">Unenroll from Class</button>' +
                '<button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveStudent(\'' + student.id + '\')">Archive Student</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<!-- Profile Navigation Tabs -->' +
        '<div class="class-subnav-tabs" style="margin-top:0; margin-bottom:18px;">' +
          profileTabs.map(t => 
            '<button class="class-tab-btn ' + (studentProfileActiveTab === t.id ? 'is-active' : '') + '" onclick="switchStudentProfileTab(\'' + t.id + '\')">' +
              t.label +
            '</button>'
          ).join('') +
        '</div>' +

        '<!-- Sub-tab Body -->' +
        renderStudentProfileTabContent(student, totalXP, attRate, skills, assignments, assessments, notes, xpTxs, attRecords) +
      '</div>';

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  function renderStudentProfileTabContent(student, totalXP, attRate, skills, assignments, assessments, notes, xpTxs, attRecords) {
    switch (studentProfileActiveTab) {
      case 'overview':
        return '' +
          '<div class="kpi-grid" style="margin-bottom:16px;">' +
            '<div class="kpi-card"><span class="kpi-label">Total XP</span><span class="kpi-val">' + totalXP + '</span><span class="kpi-sub">⭐ Earned from missions</span></div>' +
            '<div class="kpi-card"><span class="kpi-label">Attendance Rate</span><span class="kpi-val">' + attRate + '%</span><span class="kpi-sub">✓ Computed from roll call</span></div>' +
            '<div class="kpi-card"><span class="kpi-label">Current CEFR</span><span class="kpi-val" style="color:var(--color-primary);">' + student.overallCefr + '</span><span class="kpi-sub">Target: A1+</span></div>' +
            '<div class="kpi-card"><span class="kpi-label">Active Streak</span><span class="kpi-val">🔥 ' + student.streakDays + '</span><span class="kpi-sub">Consecutive days</span></div>' +
          '</div>' +
          '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px; font-size:0.86rem;">' +
            '<h4 style="font-weight:700; margin-bottom:8px;">Family &amp; Contact Info</h4>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">' +
              '<div><strong>Parent:</strong> ' + (student.parentName || 'Not specified') + '</div>' +
              '<div><strong>Contact:</strong> ' + (student.parentContact || 'Not specified') + '</div>' +
              '<div><strong>Email:</strong> ' + (student.parentEmail || 'Not specified') + '</div>' +
              '<div><strong>Class:</strong> ' + (store.getClass(student.classId) ? store.getClass(student.classId).name : 'Unenrolled') + '</div>' +
            '</div>' +
          '</div>';

      case 'progress':
        return '' +
          '<div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">' +
            '<h4 style="font-weight:800; font-size:1rem;">Evidence-Based Skill Progress</h4>' +
            '<span style="font-size:0.75rem; color:var(--text-muted);">Scores computed from game attempts &amp; teacher rubrics</span>' +
          '</div>' +
          '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:16px;">' +
            Object.keys(skills).map(sk => {
              const item = skills[sk];
              return '' +
                '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:10px 12px;">' +
                  '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                    '<span style="font-size:0.82rem; font-weight:700; text-transform:capitalize;">' + sk + '</span>' +
                    '<select style="font-size:0.72rem; font-weight:700; padding:1px 4px; border:1px solid var(--border-light); border-radius:4px;" onchange="window.schoolStore.setManualSkillCefr(\'' + student.id + '\', \'' + sk + '\', this.value); window.switchStudentProfileTab(\'progress\');">' +
                      ['Pre-A1', 'A1', 'A1+', 'A2', 'B1'].map(lvl => '<option value="' + lvl + '" ' + (lvl === item.cefr ? 'selected' : '') + '>' + lvl + '</option>').join('') +
                    '</select>' +
                  '</div>' +
                  '<div class="progress-bar-wrap" style="height:6px; margin:8px 0 4px 0;"><div class="progress-bar-fill" style="width:' + item.score + '%;"></div></div>' +
                  '<div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted);">' +
                    '<span>Mastery: ' + item.score + '%</span>' +
                    '<span>' + item.evidenceCount + ' evidence entries</span>' +
                  '</div>' +
                '</div>';
            }).join('') +
          '</div>';

      case 'assignments':
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
            '<h4 style="font-weight:800;">Assigned Missions</h4>' +
            '<button class="btn-sm-secondary" onclick="openAssignModal()">+ Assign New Mission</button>' +
          '</div>' +
          (assignments.length === 0 ? '<p style="color:var(--text-muted); font-size:0.84rem;">No active assignments for this student.</p>' :
            '<div style="display:flex; flex-direction:column; gap:8px;">' +
              assignments.map(a => {
                const res = store.getResource(a.activityId);
                return '' +
                  '<div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-canvas); border:1px solid var(--border-light); padding:10px 14px; border-radius:var(--radius-md);">' +
                    '<div><strong>' + a.title + '</strong><div style="font-size:0.75rem; color:var(--text-muted);">Due ' + a.dueDate + '</div></div>' +
                    (res ? '<a href="' + res.route + '" class="btn-sm-secondary">▶ Play Activity</a>' : '') +
                  '</div>';
              }).join('') +
            '</div>');

      case 'assessments':
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
            '<h4 style="font-weight:800;">Rubric Evaluations</h4>' +
            '<button class="btn-primary-action" onclick="document.getElementById(\'rubric-student-select\').value=\'' + student.id + '\'; openModal(\'modal-assessment-rubric\');">+ New Assessment</button>' +
          '</div>' +
          (assessments.length === 0 ? '<p style="color:var(--text-muted); font-size:0.84rem;">No formal rubric assessments recorded yet.</p>' :
            '<div style="display:flex; flex-direction:column; gap:10px;">' +
              assessments.map(ass => '' +
                '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px 16px;">' +
                  '<div style="display:flex; justify-content:space-between; margin-bottom:6px;">' +
                    '<strong>' + ass.title + '</strong><span style="font-size:0.75rem; color:var(--text-muted);">' + ass.date + '</span>' +
                  '</div>' +
                  '<p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:8px;">' + (ass.teacherComment || 'Satisfactory communicative demonstration.') + '</p>' +
                  '<div style="display:flex; flex-wrap:wrap; gap:8px; font-size:0.75rem;">' +
                    Object.entries(ass.rubricScores || {}).map(([sk, val]) => '<span style="background:var(--bg-surface); padding:2px 6px; border-radius:4px; border:1px solid var(--border-light);">' + sk + ': <strong>' + val + '%</strong></span>').join('') +
                  '</div>' +
                '</div>'
              ).join('') +
            '</div>');

      case 'attendance':
        return '' +
          '<div style="margin-bottom:12px;">' +
            '<h4 style="font-weight:800;">Attendance History · Cumulative Rate: ' + attRate + '%</h4>' +
          '</div>' +
          '<div style="max-height:220px; overflow-y:auto; border:1px solid var(--border-light); border-radius:var(--radius-md);">' +
            '<table style="width:100%; border-collapse:collapse; font-size:0.84rem;">' +
              '<thead><tr style="background:var(--bg-muted); text-align:left;"><th style="padding:6px 12px;">Date</th><th style="padding:6px 12px;">Class</th><th style="padding:6px 12px; text-align:right;">Status</th></tr></thead>' +
              '<tbody>' +
                attRecords.map(r => '' +
                  '<tr style="border-bottom:1px solid var(--border-light);">' +
                    '<td style="padding:8px 12px;">' + r.date + '</td>' +
                    '<td style="padding:8px 12px;">' + (store.getClass(r.classId) ? store.getClass(r.classId).name : 'Grade 3A') + '</td>' +
                    '<td style="padding:8px 12px; text-align:right;"><span style="font-weight:700; color:' + (r.status === 'Present' ? 'var(--color-success)' : r.status === 'Late' ? 'var(--color-warning)' : 'var(--color-danger)') + ';">' + r.status + '</span></td>' +
                  '</tr>'
                ).join('') +
              '</tbody>' +
            '</table>' +
          '</div>';

      case 'portfolio':
        return '' +
          '<h4 style="font-weight:800; margin-bottom:10px;">Student Work &amp; Creative Artifacts</h4>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px;">' +
              '<strong>🎨 My Crazy Monster</strong><p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Drawing + sentence recording</p>' +
              '<div style="font-size:36px; margin:10px 0;">👾</div>' +
              '<p style="font-size:0.78rem; font-style:italic;">"Zorgon has got 4 eyes and big blue wings."</p>' +
            '</div>' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px;">' +
              '<strong>🎙️ Restaurant Dialogue Recording</strong><p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Customer roleplay recording</p>' +
              '<div style="font-size:36px; margin:10px 0;">🍽️</div>' +
              '<p style="font-size:0.78rem; font-style:italic;">"Can I have a pizza and lemonade, please?"</p>' +
            '</div>' +
          '</div>';

      case 'xp':
        return '' +
          '<div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">' +
            '<h4 style="font-weight:800;">XP Audit Ledger (Total: ' + totalXP + ' XP)</h4>' +
            '<button class="btn-sm-secondary" onclick="document.getElementById(\'xp-student-select\').value=\'' + student.id + '\'; openModal(\'modal-give-xp\');">+ Award XP</button>' +
          '</div>' +
          '<div style="max-height:220px; overflow-y:auto; border:1px solid var(--border-light); border-radius:var(--radius-md);">' +
            '<table style="width:100%; border-collapse:collapse; font-size:0.84rem;">' +
              '<thead><tr style="background:var(--bg-muted); text-align:left;"><th style="padding:6px 12px;">Date</th><th style="padding:6px 12px;">Reason</th><th style="padding:6px 12px;">Source</th><th style="padding:6px 12px; text-align:right;">Amount</th></tr></thead>' +
              '<tbody>' +
                xpTxs.map(tx => '' +
                  '<tr style="border-bottom:1px solid var(--border-light);">' +
                    '<td style="padding:8px 12px; color:var(--text-muted);">' + tx.date + '</td>' +
                    '<td style="padding:8px 12px; font-weight:600;">' + tx.reason + '</td>' +
                    '<td style="padding:8px 12px; font-size:0.75rem;">' + tx.source + '</td>' +
                    '<td style="padding:8px 12px; text-align:right; font-weight:800; color:var(--color-primary);">+' + tx.amount + ' XP</td>' +
                  '</tr>'
                ).join('') +
              '</tbody>' +
            '</table>' +
          '</div>';

      case 'notes':
        return '' +
          '<div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">' +
            '<h4 style="font-weight:800;">Private Teacher Notes</h4>' +
            '<button class="btn-sm-secondary" onclick="' +
              'const text = prompt(\'Add private note for ' + student.firstName + ':\');' +
              'if (text && text.trim()) {' +
                'window.schoolStore.addTeacherNote(\'' + student.id + '\', text.trim());' +
                'window.switchStudentProfileTab(\'notes\');' +
              '}' +
            '">+ Add Note</button>' +
          '</div>' +
          (notes.length === 0 ? '<p style="color:var(--text-muted); font-size:0.84rem;">No private teacher notes recorded.</p>' :
            '<div style="display:flex; flex-direction:column; gap:8px;">' +
              notes.map(n => '' +
                '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:flex-start;">' +
                  '<div><p style="font-size:0.85rem; color:var(--text-main); margin-bottom:2px;">' + n.text + '</p><span style="font-size:0.72rem; color:var(--text-muted);">' + n.author + ' · ' + n.date + '</span></div>' +
                  '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-sm-secondary" style="padding:2px 6px; font-size:0.7rem;" onclick="' +
                      'const edit = prompt(\'Edit Note:\', \'' + n.text.replace(/'/g, "\\'") + '\');' +
                      'if (edit && edit.trim()) {' +
                        'window.schoolStore.updateTeacherNote(\'' + n.id + '\', edit.trim());' +
                        'window.switchStudentProfileTab(\'notes\');' +
                      '}' +
                    '">Edit</button>' +
                    '<button class="btn-sm-secondary" style="padding:2px 6px; font-size:0.7rem; color:var(--color-danger);" onclick="' +
                      'if (confirm(\'Delete note?\')) {' +
                        'window.schoolStore.deleteTeacherNote(\'' + n.id + '\');' +
                        'window.switchStudentProfileTab(\'notes\');' +
                      '}' +
                    '">Delete</button>' +
                  '</div>' +
                '</div>'
              ).join('') +
            '</div>');

      default:
        return '<p>Overview</p>';
    }
  }

  // =========================================================================
  // 5. VIEW CONTROLLERS (STUDENTS, CLASSES, CURRICULUM, LIBRARY, ETC.)
  // =========================================================================

  function renderStudentsView(container) {
    // Classroom Hub is the heart of student management
    selectedClassDetailId = store.getActiveClass().id;
    selectedClassDetailTab = 'classroom';
    renderClassDetailView(container);
  }

  function renderClassesView(container) {
    const classes = store.getClasses();

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Class Management</h1>' +
          '<p class="view-sub">Manage school cohorts, student enrollments, schedules, and learning goals.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openClassModal()">+ Create Class</button>' +
      '</div>' +

      (classes.length === 0 ? 
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<div style="font-size:36px; margin-bottom:10px;">👥</div>' +
          '<h3 style="font-size:1.1rem; font-weight:800;">No classes yet</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Create your first class to begin organizing students and assignments.</p>' +
          '<button class="btn-primary-action" style="margin-top:14px;" onclick="openClassModal()">+ Create Class</button>' +
        '</div>' :
        '<div class="classes-grid">' +
          classes.map(cls => {
            const students = store.getStudentsByClass(cls.id);
            const attRate = store.getClassAttendanceRate(cls.id);
            return '' +
              '<div class="class-card">' +
                '<div class="class-card-header">' +
                  '<div>' +
                    '<h3 class="class-card-name">' + cls.name + '</h3>' +
                    '<div class="class-card-sub">' + cls.grade + ' · ' + cls.room + ' · ' + (cls.academicYear || '2026–2027') + '</div>' +
                  '</div>' +
                  '<span class="badge-cefr badge-cefr-' + (cls.cefrTarget || 'A1').toLowerCase().replace('+', '-plus') + '">' + (cls.cefrTarget || 'A1') + '</span>' +
                '</div>' +

                '<div class="class-card-stats">' +
                  '<div class="class-stat-box"><span class="class-stat-num">' + students.length + '</span><span class="class-stat-lbl">Students</span></div>' +
                  '<div class="class-stat-box"><span class="class-stat-num">' + attRate + '%</span><span class="class-stat-lbl">Attendance</span></div>' +
                  '<div class="class-stat-box"><span class="class-stat-num">' + (cls.cefrTarget || 'A1') + '</span><span class="class-stat-lbl">Target</span></div>' +
                '</div>' +

                '<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">🕒 ' + cls.schedule + '</div>' +

                '<div class="class-card-actions">' +
                  '<button class="btn-primary-action" style="flex:1; justify-content:center;" onclick="openClass(\'' + cls.id + '\', \'overview\')">Open Class →</button>' +
                  '<div class="card-more-menu-wrap" style="position:relative;">' +
                    '<button class="btn-card-more" onclick="toggleCardDropdown(\'cls-' + cls.id + '\', event)" title="Class Actions">⋯</button>' +
                    '<div class="card-dropdown-menu" id="menu-cls-' + cls.id + '">' +
                      '<button class="card-dropdown-item" onclick="openClassModal(\'' + cls.id + '\')">✏️ Edit Class</button>' +
                      '<button class="card-dropdown-item" onclick="openClass(\'' + cls.id + '\', \'students\')">👧 Manage Students</button>' +
                      '<button class="card-dropdown-item" onclick="handleDuplicateClass(\'' + cls.id + '\')">📋 Duplicate Class</button>' +
                      '<button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveClass(\'' + cls.id + '\')">🗑️ Archive Class</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>'
      );
  }

  // DEDICATED CLASS DASHBOARD (10 TABS)
  
  // =========================================================================
  // CLASSROOM HUB (Heart of the Class: Visual Avatars, Groups, Points, Toolkit)
  // =========================================================================

  function renderClassDetailView(container) {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const assignments = store.getAssignments(cls.id);
    const attRate = store.getClassAttendanceRate(cls.id);

    // Calculate class average mastery
    let avgMastery = 78;
    if (students.length > 0) {
      const sum = students.reduce((acc, s) => acc + calculateStudentProgressPct(s.id), 0);
      avgMastery = Math.round(sum / students.length);
    }

    // Ensure toolkit is visible
    const toolkit = document.getElementById('classroom-floating-toolkit');
    if (toolkit) toolkit.style.display = 'flex';

    // Top Navigation Tabs for the Class
    const classTabs = [
      { id: 'classroom', label: '🏫 Classroom' },
      { id: 'story', label: '📸 Class Story' },
      { id: 'assignments', label: '📝 Assignments (' + assignments.length + ')' },
      { id: 'progress', label: '📈 Progress' },
      { id: 'assessments', label: '🎯 Assessments' },
      { id: 'calendar', label: '📅 Calendar & Schedule' }
    ];

    container.innerHTML = 
      '<div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">' +
        '<button class="btn-sm-secondary" onclick="switchView(\'classes\')" style="padding:4px 10px; font-size:0.78rem;">← Back to All Classes</button>' +
        (isClassroomSmartboardMode ? 
          '<button class="btn-primary-action" onclick="toggleSmartboardMode()" style="padding:4px 12px; font-size:0.8rem; background:var(--color-danger);">✕ Exit Classroom Mode</button>' : '') +
      '</div>' +

      // Top Banner
      '<div class="classroom-header-banner">' +
        '<div>' +
          '<div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">' +
            '<h1 style="font-size:1.65rem; font-weight:900; color:var(--text-main); margin:0;">🌍 ' + cls.name + '</h1>' +
            '<span class="badge-cefr badge-cefr-' + (cls.cefrTarget || 'A1').toLowerCase().replace('+', '-plus') + '" style="font-size:0.86rem; padding:3px 10px;">' + (cls.cefrTarget || 'A1') + ' Target</span>' +
          '</div>' +
          '<div class="classroom-meta-pills">' +
            '<span class="classroom-meta-pill">👥 ' + students.length + ' Students</span>' +
            '<span class="classroom-meta-pill">📋 ' + attRate + '% Attendance</span>' +
            '<span class="classroom-meta-pill">📈 ' + avgMastery + '% Average Mastery</span>' +
            '<span class="classroom-meta-pill">📍 ' + cls.room + ' · ' + cls.schedule + '</span>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
          '<button class="btn-primary-action" onclick="openStudentModal()" style="font-size:0.86rem; padding:8px 14px;">+ Add Student</button>' +
          '<button class="btn-sm-secondary" onclick="openQuickPointsModal()" style="font-size:0.86rem; padding:8px 14px; font-weight:800; color:#b45309; background:rgba(245,158,11,0.12); border-color:#f59e0b;">⭐ Points</button>' +
          '<button class="btn-sm-secondary" onclick="openFastAttendanceModal()" style="font-size:0.86rem; padding:8px 14px;">✓ Attendance</button>' +
          '<button class="btn-sm-secondary" onclick="toggleSmartboardMode()" style="font-size:0.86rem; padding:8px 14px;">🎓 ' + (isClassroomSmartboardMode ? 'Exit Mode' : 'Classroom Mode') + '</button>' +
        '</div>' +
      '</div>' +

      // Top Navigation Tabs
      '<div class="classroom-top-nav-tabs">' +
        classTabs.map(t => 
          '<button class="classroom-nav-tab-btn ' + (selectedClassDetailTab === t.id ? 'is-active' : '') + '" onclick="switchClassTab(\'' + t.id + '\')">' +
            t.label +
          '</button>'
        ).join('') +
      '</div>' +

      // Tab Content Area
      '<div id="classroom-main-content-wrap">' +
        renderClassroomSubTabContent(cls, students) +
      '</div>';
  }

  function renderClassroomSubTabContent(cls, students) {
    switch (selectedClassDetailTab) {
      case 'classroom':
        return renderClassroomWorkspace(cls, students);
      case 'story':
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
            '<h2 style="font-size:1.3rem; font-weight:800;">Class Story Feed</h2>' +
            '<button class="btn-primary-action" onclick="openModal(\'modal-story-post\')">📸 + New Post</button>' +
          '</div>' +
          '<div class="story-feed-grid">' +
            store.getClassStory(cls.id).map(p => renderStoryPost(p)).join('') +
          '</div>';
      case 'assignments':
        return renderAssignmentsTableForClass(store.getAssignments(cls.id));
      case 'progress':
        return renderClassProgressSubTab(cls, students);
      case 'assessments':
        return renderClassAssessmentsSubTab(cls, students);
      case 'calendar':
        return renderClassCalendarSubTab(cls, students);
      default:
        return renderClassroomWorkspace(cls, students);
    }
  }

  // The Live Classroom Workspace (Students visual grid | Groups view)
  function renderClassroomWorkspace(cls, students) {
    const groups = store.getGroups(cls.id);

    return '' +
      // Subtoolbar: Students | Groups + Quick Filters
      '<div class="classroom-subtoolbar">' +
        '<div class="classroom-view-toggle-pills">' +
          '<button class="classroom-view-pill-btn ' + (classroomActiveSubTab === 'students' ? 'is-active' : '') + '" onclick="switchClassroomSubTab(\'students\')">' +
            '<span>🧒</span> <span>Students (' + students.length + ')</span>' +
          '</button>' +
          '<button class="classroom-view-pill-btn ' + (classroomActiveSubTab === 'groups' ? 'is-active' : '') + '" onclick="switchClassroomSubTab(\'groups\')">' +
            '<span>👥</span> <span>Groups (' + groups.length + ')</span>' +
          '</button>' +
        '</div>' +

        '<div class="classroom-action-buttons-group">' +
          '<button class="btn-sm-secondary ' + (isMultiSelectMode ? 'is-active' : '') + '" onclick="toggleMultiSelectMode()" style="' + (isMultiSelectMode ? 'background:var(--color-primary); color:#fff;' : '') + '">' +
            (isMultiSelectMode ? '✓ Done Selecting' : '☑ Select Multiple') +
          '</button>' +
          (classroomActiveSubTab === 'groups' ?
            '<button class="btn-primary-action" onclick="openCreateGroupModal()">+ Create Group</button>' :
            '<button class="btn-primary-action" onclick="openStudentModal()">+ Add Student</button>'
          ) +
        '</div>' +
      '</div>' +

      // Body View: Students Grid or Groups Grid
      (classroomActiveSubTab === 'students' ? 
        renderClassroomStudentsGrid(cls, students) : 
        renderClassroomGroupsGrid(cls, groups, students)
      ) +

      // Classroom Dashboard Summary Widgets
      renderClassroomDashboardWidgets(cls, students);
  }

  // 1. Students Visual Avatar Grid
  function renderClassroomStudentsGrid(cls, students) {
    if (students.length === 0) {
      return '' +
        '<div class="card-add-student" onclick="openStudentModal()" style="padding:48px 20px; min-height:260px; margin-bottom:24px;">' +
          '<div class="card-add-student-icon">🎓</div>' +
          '<h3 style="font-size:1.2rem; font-weight:800; margin-bottom:6px; color:var(--text-primary);">Your classroom is ready</h3>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:14px;">Add your first student to begin tracking learning adventure.</p>' +
          '<button class="btn-primary-action">+ Add Student</button>' +
        '</div>';
    }

    const cardsHtml = students.map(s => {
      const totalXP = store.getStudentTotalXP(s.id);
      const formattedXP = totalXP.toLocaleString();
      const progressPct = calculateStudentProgressPct(s.id);
      const status = determineStudentStatus(s.id, cls.id);
      const avatarEmoji = getStudentAvatarEmoji(s.avatar);
      const isSelected = selectedStudentIds.has(s.id);
      const streak = s.streakDays || 5;

      return '' +
        '<div class="classroom-student-card ' + (isSelected ? 'is-selected' : '') + '" data-student-id="' + s.id + '" onclick="handleStudentCardClick(\'' + s.id + '\', event)">' +
          // Checkbox
          '<div class="student-card-check-wrap" style="' + (isMultiSelectMode ? 'display:block;' : '') + '">' +
            '<input type="checkbox" class="student-card-checkbox" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation(); toggleSelectStudent(\'' + s.id + '\', event);" />' +
          '</div>' +

          // Status Dot
          '<div class="student-card-status-dot status-' + status + '" title="Status: ' + status + '"></div>' +

          // Avatar Frame
          '<div class="student-avatar-frame">' +
            avatarEmoji +
          '</div>' +

          // Name (Uppercase)
          '<div class="student-card-name">' + s.firstName.toUpperCase() + '</div>' +

          // Meta Row (Points + CEFR)
          '<div class="student-card-meta-row">' +
            '<span class="student-card-xp-badge">⭐ ' + formattedXP + '</span>' +
            '<span class="student-card-cefr-badge">' + (s.overallCefr || 'A1') + '</span>' +
          '</div>' +

          // Streak
          '<div class="student-card-streak-badge">🔥 ' + streak + '-day streak</div>' +

          // Progress Bar
          '<div class="student-card-progress-bar" title="Curriculum Mastery: ' + progressPct + '%">' +
            '<div class="student-card-progress-fill" style="width:' + progressPct + '%;"></div>' +
          '</div>' +
        '</div>';
    }).join('');

    // Append + Add Student card at the end
    const addCardHtml = '' +
      '<div class="card-add-student" onclick="openStudentModal()" title="Add a new student to ' + cls.name + '">' +
        '<div class="card-add-student-icon">+</div>' +
        '<div style="font-weight:800; font-size:1rem;">Add Student</div>' +
        '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Enroll new learner</div>' +
      '</div>';

    return '<div class="classroom-students-grid">' + cardsHtml + addCardHtml + '</div>';
  }

  // 2. Groups View
  function renderClassroomGroupsGrid(cls, groups, students) {
    if (groups.length === 0) {
      return '' +
        '<div class="card-add-student" onclick="openCreateGroupModal()" style="padding:48px 20px; min-height:240px; margin-bottom:24px;">' +
          '<div class="card-add-student-icon">👥</div>' +
          '<h3 style="font-size:1.2rem; font-weight:800; margin-bottom:6px; color:var(--text-primary);">No groups yet</h3>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:14px;">Create teams and tables to organize classroom challenges.</p>' +
          '<button class="btn-primary-action">+ Create Group</button>' +
        '</div>';
    }

    const groupsHtml = groups.map(g => {
      const memberStudents = (g.studentIds || []).map(id => store.getStudent(id)).filter(Boolean);

      return '' +
        '<div class="group-team-card">' +
          '<div class="group-team-color-strip" style="background:' + (g.color || '#2563eb') + ';"></div>' +
          '<div class="group-team-body">' +
            '<div class="group-team-header">' +
              '<div class="group-team-title">' +
                '<span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:' + (g.color || '#2563eb') + ';"></span>' +
                '<span>' + g.name + '</span>' +
              '</div>' +
              '<div style="display:flex; gap:6px;">' +
                '<button class="btn-sm-secondary" onclick="openCreateGroupModal(\'' + g.id + '\')" style="padding:2px 8px; font-size:0.76rem;">✏️ Edit</button>' +
                '<button class="btn-sm-secondary" onclick="handleDeleteGroup(\'' + g.id + '\')" style="padding:2px 8px; font-size:0.76rem; color:var(--color-danger);">🗑️</button>' +
              '</div>' +
            '</div>' +

            '<div style="font-size:0.8rem; color:var(--text-muted);">' + memberStudents.length + ' Members</div>' +

            '<div class="group-members-pills">' +
              memberStudents.map(m => '' +
                '<span class="group-member-pill">' +
                  getStudentAvatarEmoji(m.avatar) + ' ' + m.firstName +
                '</span>'
              ).join('') +
            '</div>' +

            '<div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">' +
              '<button class="btn-sm-secondary" onclick="handleAwardGroupXP(\'' + g.id + '\', 5)" style="font-weight:800; color:#b45309; background:rgba(245,158,11,0.12); border-color:#f59e0b; padding:6px 12px;">' +
                '⭐ +5 XP to Team' +
              '</button>' +
              '<button class="btn-sm-secondary" onclick="openAssignModalForGroup(\'' + g.id + '\')" style="padding:6px 10px; font-size:0.78rem;">' +
                '📝 Assign' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    const addGroupCard = '' +
      '<div class="card-add-student" onclick="openCreateGroupModal()" title="Create a new classroom team" style="min-height:220px;">' +
        '<div class="card-add-student-icon">+</div>' +
        '<div style="font-weight:800; font-size:1rem;">Create Group</div>' +
        '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Organize students into teams</div>' +
      '</div>';

    return '<div class="classroom-groups-grid">' + groupsHtml + addGroupCard + '</div>';
  }

  // 3. Classroom Dashboard Summary Widgets (Today's Classroom + Needs Attention)
  function renderClassroomDashboardWidgets(cls, students) {
    const today = new Date().toISOString().split('T')[0];
    const attRecords = store.getAttendanceRecords(cls.id);
    const todayAttCount = attRecords.filter(r => r.date === today).length;
    const attStatusText = todayAttCount > 0 ? 'Completed for today (' + todayAttCount + ' logged)' : 'Roll call needed today';

    return '' +
      '<div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px; margin-top:16px;">' +
        // Today's Classroom
        '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
          '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">' +
            '<span>📅</span> <span>Today in ' + cls.name + '</span>' +
          '</h3>' +
          '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">' +
            '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:14px; border:1px solid var(--border-subtle);">' +
              '<div style="font-size:0.76rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Next Lesson</div>' +
              '<div style="font-size:0.96rem; font-weight:800; margin:4px 0;">Fire Station Adventure</div>' +
              '<a href="firefighter/index.html" class="btn-primary-action" style="padding:4px 10px; font-size:0.76rem; text-decoration:none; display:inline-flex; margin-top:4px;">▶ Start Lesson</a>' +
            '</div>' +

            '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:14px; border:1px solid var(--border-subtle);">' +
              '<div style="font-size:0.76rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Active Assignment</div>' +
              '<div style="font-size:0.96rem; font-weight:800; margin:4px 0;">My Town Prepositions</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted);">' + students.length + ' Assigned · Due Friday</div>' +
            '</div>' +

            '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:14px; border:1px solid var(--border-subtle);">' +
              '<div style="font-size:0.76rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Attendance Status</div>' +
              '<div style="font-size:0.96rem; font-weight:800; margin:4px 0;">' + attStatusText + '</div>' +
              '<button class="btn-sm-secondary" onclick="openFastAttendanceModal()" style="padding:4px 10px; font-size:0.76rem; margin-top:4px;">📋 Open Roll Call</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Needs Attention
        '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
          '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">' +
            '<span>⚠️</span> <span>Needs Attention</span>' +
          '</h3>' +
          '<div style="display:flex; flex-direction:column; gap:10px;">' +
            '<div style="display:flex; align-items:center; gap:10px; font-size:0.84rem; padding:8px 10px; background:rgba(239,68,68,0.06); border-radius:8px; border-left:3px solid var(--color-danger);">' +
              '<span>🗣</span> <span>2 students need extra speaking practice</span>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:10px; font-size:0.84rem; padding:8px 10px; background:rgba(245,158,11,0.06); border-radius:8px; border-left:3px solid var(--color-warning);">' +
              '<span>✍️</span> <span>1 homework submission awaiting review</span>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:10px; font-size:0.84rem; padding:8px 10px; background:rgba(79,70,229,0.06); border-radius:8px; border-left:3px solid var(--color-primary);">' +
              '<span>🎯</span> <span>Prepositions quiz scheduled for Thursday</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // Secondary sub-tab controllers
  function renderClassProgressSubTab(cls, students) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
        '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:16px;">Classroom CEFR Skill Mastery Distribution</h3>' +
        '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:14px;">' +
          students.map(s => {
            const skills = store.getStudentSkills(s.id);
            const avg = calculateStudentProgressPct(s.id);
            return '' +
              '<div style="background:var(--bg-card-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:14px; cursor:pointer;" onclick="openStudentDetail(\'' + s.id + '\', \'progress\')">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                  '<div style="font-weight:800; font-size:0.95rem;">' + getStudentAvatarEmoji(s.avatar) + ' ' + s.firstName + ' ' + s.lastName + '</div>' +
                  '<span class="badge-cefr badge-cefr-' + (s.overallCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + (s.overallCefr || 'A1') + ' (' + avg + '%)</span>' +
                '</div>' +
                '<div style="display:flex; flex-direction:column; gap:6px; font-size:0.78rem;">' +
                  '<div style="display:flex; justify-content:space-between;"><span>Speaking:</span><strong>' + skills.speaking.score + '% (' + skills.speaking.cefr + ')</strong></div>' +
                  '<div style="display:flex; justify-content:space-between;"><span>Listening:</span><strong>' + skills.listening.score + '% (' + skills.listening.cefr + ')</strong></div>' +
                  '<div style="display:flex; justify-content:space-between;"><span>Vocabulary:</span><strong>' + skills.vocabulary.score + '% (' + skills.vocabulary.cefr + ')</strong></div>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderClassAssessmentsSubTab(cls, students) {
    return '' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
        '<h3 style="font-size:1.15rem; font-weight:800;">Classroom Rubric Evaluations</h3>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-primary-action" onclick="openQuickAssessmentModal()">📝 + Quick Assessment</button>' +
          '<button class="btn-sm-secondary" onclick="openModal(\'modal-assessment-rubric\')">🎯 Full Rubric</button>' +
        '</div>' +
      '</div>' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
        '<div style="display:flex; flex-direction:column; gap:10px;">' +
          (store.state.learningEvidence || []).slice(0, 10).map(ev => '' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card-secondary); border-radius:10px; border:1px solid var(--border-subtle);">' +
              '<div>' +
                '<div style="font-weight:700; font-size:0.88rem;">' + ev.activityTitle + ' · <span style="color:var(--color-primary);">' + ev.skill + '</span></div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted);">' + (ev.notes || '') + '</div>' +
              '</div>' +
              '<div style="text-align:right;">' +
                '<span style="font-weight:800; color:var(--color-success); font-size:0.95rem;">' + ev.percentage + '%</span>' +
                '<div style="font-size:0.74rem; color:var(--text-muted);">' + ev.date + '</div>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
      '</div>';
  }

  function renderClassCalendarSubTab(cls, students) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:24px;">' +
        '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">Classroom Weekly Schedule &amp; Milestones</h3>' +
        '<p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:20px;">Regular class meetings: ' + cls.schedule + ' in ' + cls.room + '</p>' +
        '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">' +
          '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:16px; border:1px solid var(--border-subtle);">' +
            '<div style="font-weight:800; font-size:0.92rem; color:var(--color-primary);">Monday · 10:00</div>' +
            '<div style="font-size:0.88rem; font-weight:700; margin:4px 0;">Unit 1: Fire Station Rescue</div>' +
            '<div style="font-size:0.78rem; color:var(--text-muted);">Emergency calls, speaking drills, action verbs</div>' +
          '</div>' +
          '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:16px; border:1px solid var(--border-subtle);">' +
            '<div style="font-weight:800; font-size:0.92rem; color:var(--color-primary);">Wednesday · 10:00</div>' +
            '<div style="font-size:0.88rem; font-weight:700; margin:4px 0;">Unit 2: My Town Map Navigation</div>' +
            '<div style="font-size:0.78rem; color:var(--text-muted);">Prepositions of place, giving directions</div>' +
          '</div>' +
          '<div style="background:var(--bg-card-secondary); border-radius:12px; padding:16px; border:1px solid var(--border-subtle);">' +
            '<div style="font-weight:800; font-size:0.92rem; color:#f59e0b;">Friday · Diagnostic Check</div>' +
            '<div style="font-size:0.88rem; font-weight:700; margin:4px 0;">Prepositions Worksheet &amp; Speech</div>' +
            '<div style="font-size:0.78rem; color:var(--text-muted);">Worksheet scoring + quick formative assessment</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderAttendanceTableForClass(cls, students) {
    return renderFastAttendanceSheet(cls, students);
  }

  function renderFastAttendanceSheet(cls, students) {
    const today = new Date().toISOString().split('T')[0];
    const attRecords = store.getAttendanceRecords(cls.id);

    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
          '<div>' +
            '<h3 style="font-size:1.15rem; font-weight:800;">Class Attendance Register</h3>' +
            '<div style="font-size:0.82rem; color:var(--text-muted);">Current cohort attendance: ' + store.getClassAttendanceRate(cls.id) + '%</div>' +
          '</div>' +
          '<button class="btn-primary-action" onclick="openFastAttendanceModal()">📋 Take Today\'s Attendance</button>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:8px;">' +
          students.map(s => {
            const studentAtts = attRecords.filter(r => r.studentId === s.id);
            const rate = store.getStudentAttendanceRate(s.id);
            return '' +
              '<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card-secondary); border-radius:10px;">' +
                '<div style="display:flex; align-items:center; gap:10px;">' +
                  '<span style="font-size:1.3rem;">' + getStudentAvatarEmoji(s.avatar) + '</span>' +
                  '<span style="font-weight:700; font-size:0.92rem;">' + s.firstName + ' ' + s.lastName + '</span>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:12px;">' +
                  '<span style="font-weight:800; font-size:0.88rem; color:' + (rate >= 90 ? 'var(--color-success)' : '#f59e0b') + ';">' + rate + '% Rate</span>' +
                  '<span style="font-size:0.78rem; color:var(--text-muted);">' + studentAtts.length + ' Recorded Sessions</span>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderAssignmentsTableForClass(assignments) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
          '<h3 style="font-size:1.15rem; font-weight:800;">Class Assignments</h3>' +
          '<button class="btn-primary-action" onclick="openModal(\'modal-create-assignment\')">+ Create Assignment</button>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:10px;">' +
          assignments.map(a => '' +
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:var(--bg-card-secondary); border-radius:10px; border:1px solid var(--border-subtle);">' +
              '<div>' +
                '<div style="font-weight:800; font-size:0.95rem;">' + a.title + '</div>' +
                '<div style="font-size:0.8rem; color:var(--text-muted);">Due: ' + (a.dueDate || 'This week') + ' · Game: ' + a.gameId + '</div>' +
              '</div>' +
              '<div style="display:flex; gap:8px;">' +
                '<a href="' + (store.getResource(a.gameId) ? store.getResource(a.gameId).route : 'monster day/index.html') + '" class="btn-primary-action" style="padding:4px 10px; font-size:0.78rem; text-decoration:none;">▶ Start</a>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
      '</div>';
  }

  function renderHomeworkCardsForClass(homework) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
          '<h3 style="font-size:1.15rem; font-weight:800;">Homework Tasks</h3>' +
          '<button class="btn-primary-action" onclick="openModal(\'modal-homework-editor\')">+ Create Homework</button>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:12px;">' +
          homework.map(h => '' +
            '<div style="background:var(--bg-card-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:14px;">' +
              '<div style="font-weight:800; font-size:0.95rem; margin-bottom:4px;">' + h.title + '</div>' +
              '<div style="font-size:0.78rem; color:var(--color-primary); font-weight:700;">' + h.type + '</div>' +
              '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">Due: ' + (h.dueDate || 'Friday') + '</div>' +
            '</div>'
          ).join('') +
        '</div>' +
      '</div>';
  }

  function renderCurriculumView(container) {
    const books = store.getBooks();
    const activeBook = books.find(b => b.id === curriculumActiveBookId) || books[0];
    const units = store.getUnits(activeBook.id);

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">ESL Curriculum Framework</h1>' +
          '<p class="view-sub">Hierarchical syllabus: Books → Units → Lessons → Objectives → Activities. Full management control.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="openAddUnitModal(\'' + activeBook.id + '\')">+ Add Unit</button>' +
          '<button class="btn-primary-action" onclick="' +
            'const btitle = prompt(\'Enter Book Title:\');' +
            'if (btitle && btitle.trim()) {' +
              'const nb = window.schoolStore.addBook({ title: btitle.trim(), level: \'A1\' });' +
              'curriculumActiveBookId = nb.id;' +
              'renderCurrentView();' +
            '}' +
          '">+ Add Book</button>' +
        '</div>' +
      '</div>' +

      '<!-- Book Selector Tabs -->' +
      '<div style="display:flex; gap:10px; margin-bottom:20px; overflow-x:auto;">' +
        books.map(b => 
          '<button class="btn-sm-secondary ' + (curriculumActiveBookId === b.id ? 'btn-primary-action' : '') + '" onclick="curriculumActiveBookId=\'' + b.id + '\'; renderCurriculumView(document.getElementById(\'app-view-container\'));">' +
            '📘 ' + b.title + ' (' + b.level + ')' +
          '</button>'
        ).join('') +
      '</div>' +

      (units.length === 0 ? 
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<h3 style="font-size:1.1rem; font-weight:800;">No units in this book yet</h3>' +
          '<button class="btn-primary-action" style="margin-top:12px;" onclick="openAddUnitModal(\'' + activeBook.id + '\')">+ Add First Unit</button>' +
        '</div>' :
        '<div style="display:flex; flex-direction:column; gap:16px;">' +
          units.map(unit => {
            const lessons = store.getLessons(unit.id);
            return '' +
              '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-xs);">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">' +
                  '<div>' +
                    '<span style="font-size:0.75rem; font-weight:800; color:var(--color-primary); text-transform:uppercase;">' + activeBook.title + '</span>' +
                    '<h3 style="font-size:1.2rem; font-weight:800; margin-top:2px;">' + unit.title + '</h3>' +
                    '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">Target Vocabulary: <strong>' + (unit.targetVocab || []).join(', ') + '</strong></p>' +
                  '</div>' +
                  '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-sm-secondary" onclick="openAddLessonModal(\'' + unit.id + '\')">+ Add Lesson</button>' +
                    '<button class="btn-sm-secondary" onclick="openEditUnitModal(\'' + unit.id + '\')">Edit Unit</button>' +
                    '<button class="btn-sm-secondary" onclick="handleDuplicateUnit(\'' + unit.id + '\')">Duplicate</button>' +
                    '<button class="btn-sm-secondary" style="color:var(--color-danger);" onclick="handleArchiveUnit(\'' + unit.id + '\')">Archive</button>' +
                  '</div>' +
                '</div>' +

                '<!-- Lessons inside unit -->' +
                '<div style="background:var(--bg-canvas); border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-light);">' +
                  '<div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Lessons &amp; Objectives</div>' +
                  (lessons.length === 0 ? '<p style="font-size:0.8rem; color:var(--text-muted);">No lessons added yet. Click + Add Lesson above.</p>' :
                    '<div style="display:flex; flex-direction:column; gap:10px;">' +
                      lessons.map(ls => {
                        const objs = store.getObjectives(ls.id);
                        return '' +
                          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px 16px;">' +
                            '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
                              '<div>' +
                                '<strong style="font-size:0.92rem;">' + ls.title + '</strong>' +
                                '<p style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">' + ls.objective + ' (' + ls.duration + ' min)</p>' +
                              '</div>' +
                              '<div style="display:flex; gap:6px;">' +
                                (ls.gameRoute ? '<a href="' + ls.gameRoute + '" class="btn-primary-action" style="padding:4px 10px; font-size:0.78rem;">▶ Launch Game</a>' : '') +
                                '<button class="btn-sm-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="openAddObjectiveModal(\'' + ls.id + '\')">+ Objective</button>' +
                                '<button class="btn-sm-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="openEditLessonModal(\'' + ls.id + '\')">Edit</button>' +
                                '<button class="btn-sm-secondary" style="padding:4px 8px; font-size:0.75rem; color:var(--color-danger);" onclick="handleArchiveLesson(\'' + ls.id + '\')">Archive</button>' +
                              '</div>' +
                            '</div>' +
                            (objs.length > 0 ? '' +
                              '<div style="margin-top:8px; border-top:1px solid var(--border-light); padding-top:6px;">' +
                                '<span style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Objectives:</span>' +
                                '<ul style="margin-left:18px; font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">' +
                                  objs.map(o => '<li>' + o.text + ' <span style="color:var(--text-muted);">(' + o.skill + ')</span> <button style="color:var(--color-danger); cursor:pointer; font-size:0.7rem; margin-left:4px;" onclick="handleDeleteObjective(\'' + o.id + '\')">✕</button></li>').join('') +
                                '</ul>' +
                              '</div>' : '') +
                          '</div>';
                      }).join('') +
                    '</div>'
                  ) +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>'
      );
  }

  // =========================================================================
  // 7. LESSON LIBRARY (FULL MANAGEMENT & 1-CLICK DIRECT LAUNCH)
  // =========================================================================
  function renderLibraryView(container) {
    const allResources = store.getResources();

    const filtered = allResources.filter(r => {
      if (libSearchQuery) {
        const q = libSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = (r.description || '').toLowerCase().includes(q);
        const matchSkills = (r.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
      }
      if (libFilterLevel !== 'all' && r.level !== libFilterLevel) return false;
      if (libFilterSkill !== 'all' && !(r.skills || []).includes(libFilterSkill)) return false;
      if (libFilterCategory !== 'all' && r.category !== libFilterCategory) return false;
      return true;
    });

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 class="view-greeting">Lesson Library</h1>' +
          '<p class="view-sub">' + allResources.length + ' playable games and custom resources. One-click play directly in classroom.</p>' +
        '</div>' +
        '<div style="display:flex; gap:10px;">' +
          '<button class="btn-sm-secondary ' + (isLibraryManageMode ? 'btn-primary-action' : '') + '" onclick="toggleLibraryManageMode()">' +
            (isLibraryManageMode ? '✓ Done Managing' : '⚙️ Manage Library') +
          '</button>' +
          '<button class="btn-primary-action" onclick="openResourceEditor()">+ Add Game</button>' +
        '</div>' +
      '</div>' +

      '<div class="library-search-bar" style="margin-bottom:16px;">' +
        '<div class="search-input-wrap" style="flex:1;">' +
          '<svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
          '<input type="text" id="lib-search-input" class="search-input" placeholder="Search games, topics, vocabulary... (Press /)" value="' + libSearchQuery + '" oninput="' +
            'libSearchQuery = this.value;' +
            'renderLibraryCardsGrid(document.getElementById(\'lib-results-container\'));' +
          '" />' +
        '</div>' +

        '<select class="filter-select" onchange="libFilterLevel = this.value; renderLibraryCardsGrid(document.getElementById(\'lib-results-container\'));">' +
          '<option value="all" ' + (libFilterLevel === 'all' ? 'selected' : '') + '>All Levels</option>' +
          '<option value="Pre-A1" ' + (libFilterLevel === 'Pre-A1' ? 'selected' : '') + '>Pre-A1</option>' +
          '<option value="A1" ' + (libFilterLevel === 'A1' ? 'selected' : '') + '>A1</option>' +
          '<option value="A1+" ' + (libFilterLevel === 'A1+' ? 'selected' : '') + '>A1+</option>' +
          '<option value="A2" ' + (libFilterLevel === 'A2' ? 'selected' : '') + '>A2</option>' +
        '</select>' +

        '<select class="filter-select" onchange="libFilterSkill = this.value; renderLibraryCardsGrid(document.getElementById(\'lib-results-container\'));">' +
          '<option value="all" ' + (libFilterSkill === 'all' ? 'selected' : '') + '>All Skills</option>' +
          '<option value="Speaking" ' + (libFilterSkill === 'Speaking' ? 'selected' : '') + '>Speaking</option>' +
          '<option value="Listening" ' + (libFilterSkill === 'Listening' ? 'selected' : '') + '>Listening</option>' +
          '<option value="Vocabulary" ' + (libFilterSkill === 'Vocabulary' ? 'selected' : '') + '>Vocabulary</option>' +
          '<option value="Grammar" ' + (libFilterSkill === 'Grammar' ? 'selected' : '') + '>Grammar</option>' +
        '</select>' +
      '</div>' +

      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
        '<span style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">Showing ' + filtered.length + ' playable games</span>' +
        (isLibraryManageMode ? '<span style="background:#fef3c7; color:#b45309; padding:2px 10px; border-radius:var(--radius-pill); font-size:0.78rem; font-weight:800;">⚙️ Manage Library Active</span>' : '') +
      '</div>' +

      '<div id="lib-results-container">' +
        renderLibraryCardsGridHTML(filtered) +
      '</div>';
  }

  function renderLibraryCardsGrid(container) {
    if (!container) return;
    const allResources = store.getResources();
    const filtered = allResources.filter(r => {
      if (libSearchQuery) {
        const q = libSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = (r.description || '').toLowerCase().includes(q);
        const matchSkills = (r.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
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
      return '' +
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<div style="font-size:36px; margin-bottom:10px;">🎮</div>' +
          '<h3 style="font-size:1.1rem; font-weight:800;">No games found</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Try changing filters or add a new game.</p>' +
          '<button class="btn-primary-action" style="margin-top:14px;" onclick="openResourceEditor()">+ Add Game</button>' +
        '</div>';
    }
    return '' +
      '<div class="games-grid">' +
        resources.map(r => renderGameCard(r)).join('') +
      '</div>';
  }

  // REUSABLE GAME CARD COMPONENT (STRICT ZERO NESTED LINKS / BUTTONS)
  function renderGameCard(r) {
    return '' +
      '<article class="game-card" data-id="' + r.id + '">' +
        '<div class="card-thumbnail">' +
          '<div style="width:100%; height:100%; background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); display:flex; align-items:center; justify-content:center; font-size:42px;">' +
            (r.category === 'Interactive Story' ? '📖' : r.category === 'Mystery & Detective' ? '🕵️' : r.category === 'Speaking & Roleplay' ? '🗣️' : r.category === 'CLIL / Science' ? '🌍' : '🎮') +
          '</div>' +

          '<div style="position:absolute; top:10px; left:10px; display:flex; gap:6px;">' +
            '<span class="badge-cefr badge-cefr-' + r.level.toLowerCase().replace('+', '-plus') + '">' + r.level + '</span>' +
            '<span style="font-size:0.7rem; font-weight:800; background:rgba(15,23,42,0.7); color:#fff; padding:2px 6px; border-radius:4px; backdrop-filter:blur(4px);">' + r.duration + 'm</span>' +
          '</div>' +

          '<div class="card-more-menu-wrap">' +
            '<button class="btn-card-more" onclick="toggleCardDropdown(\'' + r.id + '\', event)" title="More options" aria-label="More options">⋯</button>' +
            '<div class="card-dropdown-menu" id="menu-' + r.id + '">' +
              '<button class="card-dropdown-item" onclick="openResourceEditor(\'' + r.id + '\')">✏️ Edit Game</button>' +
              '<button class="card-dropdown-item" onclick="handleDuplicateResource(\'' + r.id + '\')">📋 Duplicate</button>' +
              '<button class="card-dropdown-item" onclick="openAssignModal(\'' + r.id + '\')">📝 Assign</button>' +
              '<button class="card-dropdown-item" onclick="handleToggleFeaturedResource(\'' + r.id + '\')">' + (r.featured ? '★ Unfeature' : '☆ Feature') + '</button>' +
              '<button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveResource(\'' + r.id + '\')">🗑️ Archive</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="card-body">' +
          '<h3 class="card-title">' + r.title + '</h3>' +
          '<p class="card-desc">' + (r.description || 'Classroom communicative challenge.') + '</p>' +
          '<div class="card-tags">' +
            (r.skills || []).map(sk => '<span class="card-tag">' + sk + '</span>').join('') +
            '<span class="card-tag" style="background:#f1f5f9; color:var(--text-muted);">' + (r.age || '7–9') + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="card-footer">' +
          '<a href="' + r.route + '" class="btn-start" title="Start ' + r.title + '">▶ START GAME</a>' +
          '<button class="btn-card-assign" onclick="openAssignModal(\'' + r.id + '\')">Assign</button>' +
          '<button class="btn-sm-secondary" style="padding:8px 12px;" onclick="openResourceEditor(\'' + r.id + '\')">Edit</button>' +
        '</div>' +
      '</article>';
  }

  // ASSIGNMENTS VIEW
  function renderAssignmentsView(container) {
    const assignments = store.getAssignments();

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Class Assignments</h1>' +
          '<p class="view-sub">Track active learning missions and student completions.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-create-assignment\')">+ Create Assignment</button>' +
      '</div>' +

      (assignments.length === 0 ? 
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<h3 style="font-size:1.1rem; font-weight:800;">No assignments yet</h3>' +
          '<button class="btn-primary-action" style="margin-top:12px;" onclick="openModal(\'modal-create-assignment\')">+ Create Assignment</button>' +
        '</div>' :
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.86rem;">' +
            '<thead><tr style="border-bottom:2px solid var(--border-light); text-align:left; color:var(--text-muted);"><th style="padding:10px 0;">Assignment</th><th style="padding:10px 0;">Class</th><th style="padding:10px 0;">Due Date</th><th style="padding:10px 0; text-align:right;">Actions</th></tr></thead>' +
            '<tbody>' +
              assignments.map(a => '' +
                '<tr style="border-bottom:1px solid var(--border-light);">' +
                  '<td style="padding:12px 0;"><strong>' + a.title + '</strong></td>' +
                  '<td style="padding:12px 0;">' + (store.getClass(a.classId) ? store.getClass(a.classId).name : 'Grade 3A') + '</td>' +
                  '<td style="padding:12px 0; color:var(--text-muted);">' + a.dueDate + '</td>' +
                  '<td style="padding:12px 0; text-align:right;">' +
                    '<button class="btn-sm-secondary" onclick="handleDuplicateAssignment(\'' + a.id + '\')">Duplicate</button> ' +
                    '<button class="btn-sm-secondary" style="color:var(--color-danger);" onclick="handleArchiveAssignment(\'' + a.id + '\')">Archive</button>' +
                  '</td>' +
                '</tr>'
              ).join('') +
            '</tbody>' +
          '</table>' +
        '</div>'
      );
  }

  // HOMEWORK VIEW
  function renderHomeworkView(container) {
    const homework = store.getHomework();

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Homework Management</h1>' +
          '<p class="view-sub">Home missions, worksheets, and audio assignments with family visibility.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-homework-editor\')">+ Create Homework</button>' +
      '</div>' +

      (homework.length === 0 ? 
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<h3 style="font-size:1.1rem; font-weight:800;">No homework assigned yet</h3>' +
          '<button class="btn-primary-action" style="margin-top:12px;" onclick="openModal(\'modal-homework-editor\')">+ Create Homework</button>' +
        '</div>' :
        '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">' +
          homework.map(h => '' +
            '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--color-primary); background:var(--color-primary-soft); padding:3px 8px; border-radius:4px;">' + h.type + '</span>' +
                '<span style="font-size:0.78rem; color:var(--text-muted);">Due ' + h.dueDate + '</span>' +
              '</div>' +
              '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">' + h.title + '</h3>' +
              '<p style="font-size:0.84rem; color:var(--text-muted); line-height:1.4; margin-bottom:16px;">' + h.description + '</p>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px;">' +
                '<span style="font-size:0.8rem; font-weight:700;">Class: ' + (store.getClass(h.classId) ? store.getClass(h.classId).name : 'Grade 3A') + '</span>' +
                '<div style="display:flex; gap:6px;">' +
                  '<button class="btn-sm-secondary" onclick="store.duplicateHomework(\'' + h.id + '\'); renderCurrentView();">Duplicate</button>' +
                  '<button class="btn-sm-secondary" style="color:var(--color-danger);" onclick="handleArchiveHomework(\'' + h.id + '\')">Archive</button>' +
                '</div>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>'
      );
  }

  // QUIZZES VIEW
  function renderQuizzesView(container) {
    const quizzes = store.getQuizzes();

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Quizzes &amp; Tests</h1>' +
          '<p class="view-sub">CEFR-calibrated diagnostic tests and question banks.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-quiz-builder\')">+ Create Quiz</button>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">' +
        quizzes.map(q => '' +
          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
              '<span class="badge-cefr badge-cefr-' + (q.targetCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + q.targetCefr + '</span>' +
              '<span style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">' + q.skill + '</span>' +
            '</div>' +
            '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">' + q.title + '</h3>' +
            '<p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:16px;">' + (q.questions || []).length + ' Multiple-choice questions</p>' +
            '<div style="display:flex; gap:8px;">' +
              '<button class="btn-primary-action" style="flex:1; justify-content:center;" onclick="alert(\'Previewing ' + q.title.replace(/'/g, "\\'") + '\')">Preview / Take</button>' +
              '<button class="btn-sm-secondary" style="color:var(--color-danger);" onclick="handleArchiveQuiz(\'' + q.id + '\')">Archive</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  // ASSESSMENTS VIEW
  function renderAssessmentsView(container) {
    const students = store.getStudents();

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Teacher Rubrics &amp; Assessments</h1>' +
          '<p class="view-sub">Observational rubric scoring across 7 core CEFR language skills.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-assessment-rubric\')">+ New Assessment</button>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">' +
        students.map(s => {
          const skills = store.getStudentSkills(s.id);
          return '' +
            '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
                '<div>' +
                  '<strong style="font-size:1rem; display:block;">' + s.firstName + ' ' + s.lastName + '</strong>' +
                  '<span style="font-size:0.75rem; color:var(--text-muted);">' + s.grade + ' · Age ' + s.age + '</span>' +
                '</div>' +
                '<span class="badge-cefr badge-cefr-' + s.overallCefr.toLowerCase().replace('+', '-plus') + '">' + s.overallCefr + '</span>' +
              '</div>' +
              '<div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; margin-bottom:16px;">' +
                '<div style="display:flex; justify-content:space-between;"><span>🗣️ Speaking:</span><strong>' + (skills.speaking ? skills.speaking.score : 70) + '%</strong></div>' +
                '<div style="display:flex; justify-content:space-between;"><span>🧠 Vocabulary:</span><strong>' + (skills.vocabulary ? skills.vocabulary.score : 80) + '%</strong></div>' +
                '<div style="display:flex; justify-content:space-between;"><span>📚 Grammar:</span><strong>' + (skills.grammar ? skills.grammar.score : 65) + '%</strong></div>' +
              '</div>' +
              '<button class="btn-primary-action" style="width:100%; justify-content:center;" onclick="document.getElementById(\'rubric-student-select\').value=\'' + s.id + '\'; openModal(\'modal-assessment-rubric\');">Record Rubric</button>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // ATTENDANCE VIEW
  function renderAttendanceView(container) {
    const activeClass = store.getActiveClass();
    const students = store.getStudentsByClass(activeClass.id);

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div>' +
          '<h1 class="view-greeting">Class Attendance Register</h1>' +
          '<p class="view-sub">Real-time daily roll call for <strong>' + activeClass.name + '</strong> with automatic percentage computation.</p>' +
        '</div>' +
      '</div>' +
      renderAttendanceTableForClass(activeClass, students);
  }

  // DASHBOARD VIEW
  function renderTeacherDashboard(container) {
    const activeClass = store.getActiveClass();
    const classStudents = store.getStudentsByClass(activeClass.id);
    const assignments = store.getAssignments(activeClass.id);
    const attRate = store.getClassAttendanceRate(activeClass.id);

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:flex-start;">' +
        '<div>' +
          '<h1 class="view-greeting">Good afternoon, Ms. Sarah 👋</h1>' +
          '<p class="view-sub">English Adventure Academy · <strong>' + activeClass.name + '</strong> overview.</p>' +
        '</div>' +
        '<div style="display:flex; gap:10px;">' +
          '<button class="btn-sm-secondary" onclick="openClass(\'' + activeClass.id + '\', \'attendance\')">📋 Roll Call</button>' +
          '<button class="btn-primary-action" onclick="openClass(\'' + activeClass.id + '\', \'overview\')">Open Class Dashboard →</button>' +
        '</div>' +
      '</div>' +

      '<!-- Quick Actions Bar -->' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">' +
        '<button class="btn-sm-secondary" onclick="openStudentModal()">+ Add Student</button>' +
        '<button class="btn-sm-secondary" onclick="openClassModal()">+ Create Class</button>' +
        '<button class="btn-sm-secondary" onclick="openModal(\'modal-create-assignment\')">+ Create Assignment</button>' +
        '<button class="btn-sm-secondary" onclick="openModal(\'modal-quiz-builder\')">+ Create Quiz</button>' +
        '<button class="btn-sm-secondary" onclick="openModal(\'modal-give-xp\')">+ Give XP</button>' +
        '<button class="btn-sm-secondary" onclick="openModal(\'modal-assessment-rubric\')">+ Add Assessment</button>' +
        '<button class="btn-sm-secondary" onclick="openModal(\'modal-story-post\')">+ New Class Story</button>' +
      '</div>' +

      '<div class="kpi-grid">' +
        '<div class="kpi-card" onclick="openClass(\'' + activeClass.id + '\', \'students\')" style="cursor:pointer;"><span class="kpi-label">Active Students</span><span class="kpi-val">' + classStudents.length + '</span><span class="kpi-sub">Enrolled in cohort</span></div>' +
        '<div class="kpi-card" onclick="openClass(\'' + activeClass.id + '\', \'attendance\')" style="cursor:pointer;"><span class="kpi-label">Class Attendance</span><span class="kpi-val">' + attRate + '%</span><span class="kpi-sub">Computed from records</span></div>' +
        '<div class="kpi-card" onclick="openClass(\'' + activeClass.id + '\', \'assignments\')" style="cursor:pointer;"><span class="kpi-label">Active Assignments</span><span class="kpi-val">' + assignments.length + '</span><span class="kpi-sub">Missions assigned</span></div>' +
        '<div class="kpi-card" onclick="openClass(\'' + activeClass.id + '\', \'assessments\')" style="cursor:pointer;"><span class="kpi-label">Target CEFR</span><span class="kpi-val" style="color:var(--color-primary);">' + (activeClass.cefrTarget || 'A1') + '</span><span class="kpi-sub">' + (activeClass.academicYear || '2026–2027') + '</span></div>' +
      '</div>' +

      '<div class="dashboard-columns">' +
        '<div class="dash-card">' +
          '<div class="dash-card-header"><h2 class="dash-card-title">Today\'s Teaching Schedule</h2><button class="btn-sm-secondary" onclick="switchView(\'library\')">Browse Library</button></div>' +
          '<div class="schedule-list">' +
            '<div class="schedule-item">' +
              '<div class="schedule-time">09:00 - 09:45</div>' +
              '<div class="schedule-details"><div class="schedule-class">' + activeClass.name + ' · Speaking Practice</div><div class="schedule-topic">Build Your Own Monster (Creature Builder)</div></div>' +
              '<a href="monster day/index.html" class="btn-schedule-action">▶ Launch</a>' +
            '</div>' +
            '<div class="schedule-item">' +
              '<div class="schedule-time">11:00 - 11:45</div>' +
              '<div class="schedule-details"><div class="schedule-class">' + activeClass.name + ' · Roleplay &amp; Manners</div><div class="schedule-topic">At the Restaurant (Ordering Dialogue)</div></div>' +
              '<a href="restaurant/index.html" class="btn-schedule-action">▶ Launch</a>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="dash-card">' +
          '<div class="dash-card-header"><h2 class="dash-card-title">Recent Student XP Awards</h2><button class="btn-sm-secondary" onclick="openModal(\'modal-give-xp\')">+ Give XP</button></div>' +
          '<div class="submissions-list">' +
            store.state.xpTransactions.slice(-3).reverse().map(tx => {
              const st = store.getStudent(tx.studentId);
              return '' +
                '<div class="submission-item">' +
                  '<div class="submission-avatar">⭐</div>' +
                  '<div class="submission-info">' +
                    '<div class="submission-name">' + (st ? st.firstName + ' ' + st.lastName : 'Learner') + ' · <span style="font-weight:400; color:var(--text-muted);">' + tx.reason + '</span></div>' +
                    '<div class="submission-score">+' + tx.amount + ' XP awarded on ' + tx.date + '</div>' +
                  '</div>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // PROGRESS, ANALYTICS, REPORTS, STORY, MESSAGES, PORTFOLIOS
  function renderProgressView(container) {
    const students = store.getStudents();
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">CEFR Progress &amp; Evidence Tracking</h1><p class="view-sub">Student advancement across CEFR levels backed by learning evidence records.</p></div>' +
      '<div class="students-grid">' + students.map(s => renderStudentCard(s)).join('') + '</div>';
  }

  function renderAnalyticsView(container) {
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">Class Diagnostic Analytics</h1><p class="view-sub">Evidence-based insights into student speaking fluency, grammar, and vocabulary gaps.</p></div>' +
      '<div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);"><p style="font-size:0.9rem; line-height:1.5;">Class diagnostic: 92% mastery on animal and food terms. Recommended next step: Practice modal dilemmas with The Crazy Advice Academy.</p></div>';
  }

  function renderReportsView(container) {
    const students = store.getStudents();
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">Student Progress Reports</h1><p class="view-sub">Generate printable term report cards with CEFR levels, attendance, and teacher feedback.</p></div>' +
      '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:14px;">' +
        students.map(s => 
          '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px;">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><strong>' + s.firstName + ' ' + s.lastName + '</strong><span class="badge-cefr badge-cefr-' + s.overallCefr.toLowerCase().replace('+', '-plus') + '">' + s.overallCefr + '</span></div>' +
            '<button class="btn-primary-action" style="width:100%; justify-content:center; font-size:0.8rem;" onclick="openReportGenerator(\'' + s.id + '\')">🖨️ View &amp; Print Report</button>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  window.openReportGenerator = function(studentId) {
    const s = store.getStudent(studentId);
    if (!s) return;
    const modal = document.getElementById('modal-student-profile');
    if (!modal) return;
    const skills = store.getStudentSkills(studentId);
    const attRate = store.getStudentAttendanceRate(studentId);

    modal.innerHTML = 
      '<div class="modal-dialog" style="max-width: 780px;">' +
        '<button class="modal-close-btn" onclick="closeAllModals()">✕</button>' +
        '<div class="report-sheet">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-medium); padding-bottom:16px; margin-bottom:20px;">' +
            '<div><h1 style="font-size:1.5rem; font-weight:800;">English Adventure Academy</h1><p style="font-size:0.84rem; color:var(--text-muted);">Official Student Progress Report</p></div>' +
            '<div style="text-align:right;"><span class="badge-cefr badge-cefr-' + s.overallCefr.toLowerCase().replace('+', '-plus') + '" style="font-size:1.1rem; padding:4px 12px;">' + s.overallCefr + '</span></div>' +
          '</div>' +
          '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; background:var(--bg-muted); padding:12px; border-radius:var(--radius-md); margin-bottom:20px; font-size:0.84rem;">' +
            '<div><strong>Student:</strong> ' + s.firstName + ' ' + s.lastName + '</div>' +
            '<div><strong>ID:</strong> ' + (s.studentIdNumber || 'EAA-001') + '</div>' +
            '<div><strong>Grade:</strong> ' + s.grade + '</div>' +
            '<div><strong>Attendance:</strong> ' + attRate + '%</div>' +
          '</div>' +
          '<table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:0.84rem;">' +
            '<thead><tr style="border-bottom:2px solid var(--border-light); text-align:left;"><th style="padding:6px 0;">Skill</th><th style="padding:6px 0;">Level</th><th style="padding:6px 0;">Mastery</th></tr></thead>' +
            '<tbody>' +
              Object.keys(skills).map(sk => 
                '<tr style="border-bottom:1px solid var(--border-light);"><td style="padding:8px 0; text-transform:capitalize;">' + sk + '</td><td><span class="badge-cefr badge-cefr-' + skills[sk].cefr.toLowerCase().replace('+', '-plus') + '">' + skills[sk].cefr + '</span></td><td>' + skills[sk].score + '%</td></tr>'
              ).join('') +
            '</tbody>' +
          '</table>' +
          '<div style="display:flex; justify-content:flex-end; gap:10px;"><button class="btn-sm-secondary" onclick="window.print()">🖨️ Print Report</button><button class="btn-primary-action" onclick="closeAllModals()">Done</button></div>' +
        '</div>' +
      '</div>';

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  function renderClassStoryView(container) {
    const activeClass = store.getActiveClass();
    const posts = store.getClassStory(activeClass.id);

    container.innerHTML = 
      '<div class="view-header" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<div><h1 class="view-greeting">Class Story</h1><p class="view-sub">Share classroom moments, student work, and achievements with parents.</p></div>' +
        '<button class="btn-primary-action" onclick="document.getElementById(\'story-post-class\').value=\'' + activeClass.id + '\'; openModal(\'modal-story-post\');">+ New Post</button>' +
      '</div>' +
      '<div class="story-feed">' +
        posts.map(p => renderStoryPost(p)).join('') +
      '</div>';
  }

  function renderStoryPost(p) {
    return '' +
      '<div class="story-post-card">' +
        '<div class="story-post-header">' +
          '<div class="story-author-box">' +
            '<div class="avatar-initials">SJ</div>' +
            '<div><div class="story-author-name">Ms. Sarah · ' + (p.type || 'Classroom Moment') + '</div><div class="story-post-time">' + p.timestamp + '</div></div>' +
          '</div>' +
          '<button class="btn-sm-secondary" style="color:var(--color-danger); font-size:0.75rem;" onclick="handleDeleteStoryPost(\'' + p.id + '\')">Delete</button>' +
        '</div>' +
        '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">' + p.title + '</h3>' +
        '<p class="story-post-text">' + p.content + '</p>' +
        '<div class="story-post-footer">' +
          '<button class="btn-like ' + ((p.likes || 0) > 0 ? 'is-liked' : '') + '" onclick="handleLikeStoryPost(\'' + p.id + '\')">❤️ ' + (p.likes || 0) + ' Likes</button>' +
        '</div>' +
      '</div>';
  }

  function renderMessagesView(container) {
    const threads = store.getMessageThreads();
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">Family Messaging</h1><p class="view-sub">Two-way communication between teacher and parents.</p></div>' +
      '<div class="messages-split-view">' +
        '<div class="threads-pane">' +
          threads.map((th, idx) => '<div class="thread-item ' + (idx === 0 ? 'is-active' : '') + '"><strong>' + th.parentName + '</strong><p style="font-size:0.75rem; color:var(--text-muted);">Student: ' + th.studentName + '</p></div>').join('') +
        '</div>' +
        '<div class="chat-pane">' +
          '<div class="chat-header"><strong>' + (threads[0] ? threads[0].parentName : 'Parent') + '</strong></div>' +
          '<div class="chat-messages">' +
            (threads[0] ? threads[0].threads.map(m => '<div class="msg-bubble ' + (m.from === 'teacher' ? 'msg-teacher' : 'msg-parent') + '"><p>' + m.text + '</p><span class="msg-time">' + m.time + '</span></div>').join('') : '') +
          '</div>' +
          '<div class="chat-input-bar">' +
            '<input type="text" id="parent-msg-input" class="search-input" placeholder="Type a message to the family..." onkeydown="if(event.key === \'Enter\') handleSendParentMessage(\'' + (threads[0] ? threads[0].id : '') + '\', \'parent-msg-input\');" />' +
            '<button class="btn-primary-action" onclick="handleSendParentMessage(\'' + (threads[0] ? threads[0].id : '') + '\', \'parent-msg-input\');">Send</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderPortfoliosView(container) {
    const students = store.getStudents();
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">Student Portfolios</h1><p class="view-sub">Collections of drawings, audio clips, and achievements.</p></div>' +
      '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">' +
        students.map(s => 
          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px;">' +
            '<div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;"><div style="font-size:28px;">' + (s.avatar && s.avatar.hair === 'boy' ? '👦' : '👧') + '</div><div><strong>' + s.firstName + ' ' + s.lastName + '</strong><span style="font-size:0.75rem; color:var(--text-muted); display:block;">Portfolio Gallery</span></div></div>' +
            '<button class="btn-primary-action" style="width:100%; justify-content:center;" onclick="openStudentDetail(\'' + s.id + '\', \'portfolio\')">Explore Portfolio</button>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  function renderStudentAdventureView(container) {
    const s = store.getActiveStudent();
    container.innerHTML = 
      '<div class="view-header" style="text-align:center;"><h1 class="view-greeting">🌟 Welcome back, ' + s.firstName + '!</h1><p class="view-sub">⭐ ' + store.getStudentTotalXP(s.id) + ' Total XP · Level ' + s.overallCefr + ' Explorer</p></div>' +
      '<div class="adventure-map-container">' +
        '<h2 style="font-size:1.2rem; font-weight:800; margin-bottom:16px;">🗺️ Learning Worlds</h2>' +
        '<div class="worlds-trail">' +
          '<div class="world-node is-completed"><div class="world-icon">👾</div><div class="world-name">Monster Lab</div><span class="world-status-tag">Completed</span></div>' +
          '<div class="world-node is-completed"><div class="world-icon">🚒</div><div class="world-name">Fire Station</div><span class="world-status-tag">Completed</span></div>' +
          '<div class="world-node is-active"><div class="world-icon">🍽️</div><div class="world-name">Restaurant</div><span class="world-status-tag">Current</span></div>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center;"><a href="restaurant/index.html" class="btn-primary-action" style="font-size:1rem; padding:12px 28px; border-radius:var(--radius-pill);">▶ Enter Restaurant Mission</a></div>';
  }

  function renderStudentTasksView(container) {
    container.innerHTML = '<div class="view-header"><h1 class="view-greeting">📋 My Missions</h1><p class="view-sub">Complete tasks to earn XP!</p></div><div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);"><a href="monster day/index.html" class="btn-primary-action">Play Monster Maker</a></div>';
  }

  function renderStudentBadgesView(container) {
    container.innerHTML = '<div class="view-header"><h1 class="view-greeting">🏆 Badges &amp; Trophies</h1><p class="view-sub">Achievements unlocked!</p></div><div style="display:flex; gap:14px;"><div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); text-align:center;"><div style="font-size:48px;">🌟</div><strong>First Explorer</strong></div></div>';
  }

  function renderLeaderboardView(container) {
    const students = [...store.getStudents()].sort((a, b) => store.getStudentTotalXP(b.id) - store.getStudentTotalXP(a.id));
    container.innerHTML = 
      '<div class="view-header"><h1 class="view-greeting">🌟 Leaderboard</h1><p class="view-sub">Top explorers this week</p></div>' +
      '<div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
        students.map((s, idx) => 
          '<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-light);"><span>#' + (idx + 1) + ' ' + s.firstName + ' ' + s.lastName + '</span><strong>' + store.getStudentTotalXP(s.id) + ' XP</strong></div>'
        ).join('') +
      '</div>';
  }

  function renderParentHomeView(container) {
    const s = store.getActiveStudent();
    container.innerHTML = '<div class="view-header"><h1 class="view-greeting">' + s.firstName + '\'s Learning Overview</h1><p class="view-sub">Teacher: Ms. Sarah · ' + (store.getClass(s.classId) ? store.getClass(s.classId).name : 'Grade 3A') + '</p></div><div class="kpi-grid"><div class="kpi-card"><span class="kpi-label">CEFR Level</span><span class="kpi-val">' + s.overallCefr + '</span></div><div class="kpi-card"><span class="kpi-label">Total XP</span><span class="kpi-val">' + store.getStudentTotalXP(s.id) + '</span></div><div class="kpi-card"><span class="kpi-label">Attendance</span><span class="kpi-val">' + store.getStudentAttendanceRate(s.id) + '%</span></div></div>';
  }

  function renderParentHomeworkView(container) {
    container.innerHTML = '<div class="view-header"><h1 class="view-greeting">Homework &amp; Practice Tasks</h1><p class="view-sub">Assigned by Ms. Sarah</p></div><div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-light);"><p><strong>Restaurant Polite Dialogue</strong> · Due Friday</p></div>';
  }

  // =========================================================================
  // 8. NAVIGATION CONTROLLER (5 SECTIONS)
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

      sidebar.innerHTML = 
        '<div class="sidebar-section-title">Dashboard</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'dashboard' ? 'is-active' : '') + '" onclick="switchView(\'dashboard\')"><span class="nav-item-left"><span>📊</span> Overview</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">My School</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'classes' || currentView === 'class-detail' ? 'is-active' : '') + '" onclick="switchView(\'classes\')"><span class="nav-item-left"><span>👥</span> Classes</span><span class="nav-badge-pill">' + classesCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'students' ? 'is-active' : '') + '" onclick="switchView(\'students\')"><span class="nav-item-left"><span>👧</span> Students</span><span class="nav-badge-pill">' + studentsCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'attendance' ? 'is-active' : '') + '" onclick="switchView(\'attendance\')"><span class="nav-item-left"><span>📋</span> Attendance</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Teaching</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'curriculum' ? 'is-active' : '') + '" onclick="switchView(\'curriculum\')"><span class="nav-item-left"><span>📚</span> Curriculum</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'library' ? 'is-active' : '') + '" onclick="switchView(\'library\')"><span class="nav-item-left"><span>🎮</span> Game Library</span><span class="nav-badge-pill">' + resourcesCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'assignments' ? 'is-active' : '') + '" onclick="switchView(\'assignments\')"><span class="nav-item-left"><span>📝</span> Assignments</span><span class="nav-badge-pill">' + assignmentsCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'homework' ? 'is-active' : '') + '" onclick="switchView(\'homework\')"><span class="nav-item-left"><span>✍️</span> Homework</span><span class="nav-badge-pill">' + homeworkCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'quizzes' ? 'is-active' : '') + '" onclick="switchView(\'quizzes\')"><span class="nav-item-left"><span>🧩</span> Quizzes &amp; Tests</span><span class="nav-badge-pill">' + quizzesCount + '</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Assessment</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'assessments' ? 'is-active' : '') + '" onclick="switchView(\'assessments\')"><span class="nav-item-left"><span>🎯</span> Assessments</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'progress' ? 'is-active' : '') + '" onclick="switchView(\'progress\')"><span class="nav-item-left"><span>📈</span> Progress &amp; CEFR</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'analytics' ? 'is-active' : '') + '" onclick="switchView(\'analytics\')"><span class="nav-item-left"><span>📊</span> Analytics</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'reports' ? 'is-active' : '') + '" onclick="switchView(\'reports\')"><span class="nav-item-left"><span>📄</span> Reports</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Community</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'story' ? 'is-active' : '') + '" onclick="switchView(\'story\')"><span class="nav-item-left"><span>📸</span> Class Story</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'messages' ? 'is-active' : '') + '" onclick="switchView(\'messages\')"><span class="nav-item-left"><span>💬</span> Messages</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'portfolios' ? 'is-active' : '') + '" onclick="switchView(\'portfolios\')"><span class="nav-item-left"><span>🎨</span> Portfolios</span></button></li>' +
        '</ul>';
    } else if (role === 'student') {
      sidebar.innerHTML = 
        '<div class="sidebar-section-title">My Adventure</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'adventure' ? 'is-active' : '') + '" onclick="switchView(\'adventure\')"><span class="nav-item-left"><span>🗺️</span> Worlds</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'student-tasks' ? 'is-active' : '') + '" onclick="switchView(\'student-tasks\')"><span class="nav-item-left"><span>📋</span> Missions</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'student-badges' ? 'is-active' : '') + '" onclick="switchView(\'student-badges\')"><span class="nav-item-left"><span>🏆</span> Badges</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'leaderboard' ? 'is-active' : '') + '" onclick="switchView(\'leaderboard\')"><span class="nav-item-left"><span>🌟</span> Leaderboard</span></button></li>' +
        '</ul>';
    } else if (role === 'parent') {
      sidebar.innerHTML = 
        '<div class="sidebar-section-title">Parent Portal</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'parent-home' ? 'is-active' : '') + '" onclick="switchView(\'parent-home\')"><span class="nav-item-left"><span>🏡</span> Child Overview</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'parent-homework' ? 'is-active' : '') + '" onclick="switchView(\'parent-homework\')"><span class="nav-item-left"><span>📝</span> Tasks</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'messages' ? 'is-active' : '') + '" onclick="switchView(\'messages\')"><span class="nav-item-left"><span>💬</span> Messages</span></button></li>' +
        '</ul>';
    }
  }

  // =========================================================================
  // 9. VIEW DISPATCHER
  // =========================================================================
  function renderCurrentView() {
    const container = document.getElementById('app-view-container');
    if (!container) return;

    switch (currentView) {
      case 'dashboard': renderTeacherDashboard(container); break;
      case 'classes': renderClassesView(container); break;
      case 'class-detail': renderClassDetailView(container); break;
      case 'students': renderStudentsView(container); break;
      case 'attendance': renderAttendanceView(container); break;
      case 'curriculum': renderCurriculumView(container); break;
      case 'library': renderLibraryView(container); break;
      case 'assignments': renderAssignmentsView(container); break;
      case 'homework': renderHomeworkView(container); break;
      case 'quizzes': renderQuizzesView(container); break;
      case 'assessments': renderAssessmentsView(container); break;
      case 'progress': renderProgressView(container); break;
      case 'analytics': renderAnalyticsView(container); break;
      case 'reports': renderReportsView(container); break;
      case 'story': renderClassStoryView(container); break;
      case 'messages': renderMessagesView(container); break;
      case 'portfolios': renderPortfoliosView(container); break;
      case 'adventure': renderStudentAdventureView(container); break;
      case 'student-tasks': renderStudentTasksView(container); break;
      case 'student-badges': renderStudentBadgesView(container); break;
      case 'leaderboard': renderLeaderboardView(container); break;
      case 'parent-home': renderParentHomeView(container); break;
      case 'parent-homework': renderParentHomeworkView(container); break;
      default: renderTeacherDashboard(container);
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }


  // =========================================================================
  // CLASSROOM HUB CONTROLLERS & LIVE TOOLKIT EVENT HANDLERS
  // =========================================================================

  // Sub-Tab Switcher (Students vs Groups)
  window.switchClassroomSubTab = function(subTab) {
    classroomActiveSubTab = subTab;
    const container = document.getElementById('app-view-container');
    if (container) renderClassDetailView(container);
  };

  // Student Card Click (Profile vs Selection)
  window.handleStudentCardClick = function(studentId, event) {
    if (isMultiSelectMode) {
      window.toggleSelectStudent(studentId, event);
    } else {
      window.openStudentDetail(studentId);
    }
  };

  // Multi-Select Mode & Student Toggling
  window.toggleMultiSelectMode = function() {
    isMultiSelectMode = !isMultiSelectMode;
    if (!isMultiSelectMode) {
      selectedStudentIds.clear();
      window.updateMultiSelectBar();
    }
    const container = document.getElementById('app-view-container');
    if (container) renderClassDetailView(container);
  };

  window.toggleSelectStudent = function(studentId, event) {
    if (event) event.stopPropagation();
    if (selectedStudentIds.has(studentId)) {
      selectedStudentIds.delete(studentId);
    } else {
      selectedStudentIds.add(studentId);
    }
    window.updateMultiSelectBar();

    // Toggle card selection class
    const card = document.querySelector('.classroom-student-card[data-student-id="' + studentId + '"]');
    if (card) {
      if (selectedStudentIds.has(studentId)) card.classList.add('is-selected');
      else card.classList.remove('is-selected');
      const cb = card.querySelector('.student-card-checkbox');
      if (cb) cb.checked = selectedStudentIds.has(studentId);
    }
  };

  window.updateMultiSelectBar = function() {
    const bar = document.getElementById('floating-multiselect-bar');
    const badge = document.getElementById('multiselect-count-badge');
    if (!bar) return;
    if (selectedStudentIds.size > 0) {
      bar.style.display = 'flex';
      if (badge) badge.textContent = selectedStudentIds.size;
    } else {
      bar.style.display = 'none';
    }
  };

  window.clearSelectedStudents = function() {
    selectedStudentIds.clear();
    window.updateMultiSelectBar();
    const cards = document.querySelectorAll('.classroom-student-card');
    cards.forEach(c => {
      c.classList.remove('is-selected');
      const cb = c.querySelector('.student-card-checkbox');
      if (cb) cb.checked = false;
    });
  };

  // Quick Points Modal Controller
  window.openQuickPointsModal = function(preselectedIds = null) {
    const modal = document.getElementById('modal-quick-points');
    const container = document.getElementById('quick-points-students-list');
    if (!modal || !container) return;

    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const targetSet = preselectedIds ? new Set(preselectedIds) : selectedStudentIds;

    container.innerHTML = students.map(s => '' +
      '<label style="display:flex; align-items:center; gap:8px; padding:4px 6px; border-radius:6px; cursor:pointer; font-size:0.84rem;">' +
        '<input type="checkbox" name="quick-points-student" value="' + s.id + '" ' + (targetSet.size === 0 || targetSet.has(s.id) ? 'checked' : '') + ' />' +
        '<span>' + getStudentAvatarEmoji(s.avatar) + '</span>' +
        '<strong>' + s.firstName + ' ' + s.lastName + '</strong>' +
        '<span style="font-size:0.76rem; color:var(--text-muted); margin-left:auto;">⭐ ' + store.getStudentTotalXP(s.id) + '</span>' +
      '</label>'
    ).join('');

    window.openModal('modal-quick-points');
  };

  window.openQuickPointsForSelected = function() {
    window.openQuickPointsModal(Array.from(selectedStudentIds));
  };

  window.setQuickPointsAmount = function(amount, btn) {
    const input = document.getElementById('quick-points-amount-val');
    if (input) input.value = amount;
    const buttons = document.querySelectorAll('.btn-points-amount');
    buttons.forEach(b => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
  };

  window.setQuickPointsReason = function(reason, btn) {
    const input = document.getElementById('quick-points-reason-val');
    if (input) input.value = reason;
    const custom = document.getElementById('quick-points-custom-reason');
    if (custom) custom.value = '';
    const buttons = document.querySelectorAll('.points-reason-btn');
    buttons.forEach(b => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
  };

  window.handleToggleSelectAllPointsStudents = function() {
    const checkboxes = document.querySelectorAll('#quick-points-students-list input[type="checkbox"]');
    if (!checkboxes.length) return;
    const allChecked = Array.from(checkboxes).every(c => c.checked);
    checkboxes.forEach(c => c.checked = !allChecked);
  };

  window.handleExecuteQuickPoints = function(e) {
    e.preventDefault();
    const amount = parseInt(document.getElementById('quick-points-amount-val').value, 10) || 5;
    const reason = document.getElementById('quick-points-reason-val').value || '👏 Great participation';
    const checkedBoxes = document.querySelectorAll('#quick-points-students-list input[type="checkbox"]:checked');
    const studentIds = Array.from(checkedBoxes).map(c => c.value);

    if (studentIds.length === 0) {
      alert('Please select at least one student to award points.');
      return;
    }

    studentIds.forEach(id => {
      store.giveXP(id, amount, reason, 'Ms. Sarah');
    });

    window.closeAllModals();
    alert('✓ Awarded +' + amount + ' ⭐ to ' + studentIds.length + ' student' + (studentIds.length > 1 ? 's' : '') + ' for ' + reason + '!');
    
    // Clear selection if applicable and re-render
    window.clearSelectedStudents();
    renderCurrentView();
  };

  // Group Management Modal & Handlers
  window.openCreateGroupModal = function(groupId = null) {
    const title = document.getElementById('group-modal-title');
    const idInput = document.getElementById('edit-group-id');
    const nameInput = document.getElementById('new-group-name');
    const container = document.getElementById('group-students-select-container');
    const submitBtn = document.getElementById('btn-save-group-submit');

    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);

    if (groupId) {
      const g = store.getGroup(groupId);
      if (!g) return;
      if (title) title.textContent = '✏️ Edit Group: ' + g.name;
      if (idInput) idInput.value = g.id;
      if (nameInput) nameInput.value = g.name;
      if (submitBtn) submitBtn.textContent = 'Save Changes';
      const colorRadio = document.querySelector('input[name="group-color"][value="' + g.color + '"]');
      if (colorRadio) colorRadio.checked = true;

      const memberSet = new Set(g.studentIds || []);
      if (container) {
        container.innerHTML = students.map(s => '' +
          '<label style="display:flex; align-items:center; gap:8px; padding:4px 6px; cursor:pointer;">' +
            '<input type="checkbox" name="group-student-member" value="' + s.id + '" ' + (memberSet.has(s.id) ? 'checked' : '') + ' />' +
            '<span>' + getStudentAvatarEmoji(s.avatar) + '</span>' +
            '<span>' + s.firstName + ' ' + s.lastName + '</span>' +
          '</label>'
        ).join('');
      }
    } else {
      if (title) title.textContent = '👥 Create Classroom Group';
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (submitBtn) submitBtn.textContent = 'Create Group';
      if (container) {
        container.innerHTML = students.map(s => '' +
          '<label style="display:flex; align-items:center; gap:8px; padding:4px 6px; cursor:pointer;">' +
            '<input type="checkbox" name="group-student-member" value="' + s.id + '" ' + (selectedStudentIds.has(s.id) ? 'checked' : '') + ' />' +
            '<span>' + getStudentAvatarEmoji(s.avatar) + '</span>' +
            '<span>' + s.firstName + ' ' + s.lastName + '</span>' +
          '</label>'
        ).join('');
      }
    }

    window.openModal('modal-create-group');
  };

  window.handleSaveGroup = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-group-id').value;
    const name = document.getElementById('new-group-name').value.trim();
    const colorRadio = document.querySelector('input[name="group-color"]:checked');
    const color = colorRadio ? colorRadio.value : '#2563eb';
    const checked = document.querySelectorAll('input[name="group-student-member"]:checked');
    const studentIds = Array.from(checked).map(c => c.value);

    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();

    if (editId) {
      store.updateGroup(editId, { name, color, studentIds });
    } else {
      store.addGroup({ classId: cls.id, name, color, studentIds });
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleDeleteGroup = function(groupId) {
    const g = store.getGroup(groupId);
    if (!g) return;
    window.confirmAction({
      title: 'Delete Team Group',
      message: 'Are you sure you want to delete ' + g.name + '? The students\' learning records will not be affected.',
      confirmText: 'Delete Group',
      isDanger: true,
      onConfirm: function() {
        store.deleteGroup(groupId);
        renderCurrentView();
      }
    });
  };

  window.handleAwardGroupXP = function(groupId, amount = 5) {
    const group = store.getGroup(groupId);
    if (!group) return;
    const txs = store.awardGroupXP(groupId, amount, 'Team Points');
    alert('✓ Awarded +' + amount + ' ⭐ to all ' + txs.length + ' members of ' + group.name + '!');
    renderCurrentView();
  };

  // Random Student Selector
  window.openRandomStudentModal = function() {
    const avatar = document.getElementById('random-student-avatar');
    const name = document.getElementById('random-student-name');
    const meta = document.getElementById('random-student-meta');
    const rewardBtn = document.getElementById('btn-reward-random');
    if (avatar) avatar.textContent = '🎲';
    if (name) name.textContent = 'Ready to Pick!';
    if (meta) meta.textContent = 'Click Spin to select a random learner';
    if (rewardBtn) rewardBtn.style.display = 'none';
    lastPickedStudentId = null;

    window.openModal('modal-random-selector');
  };

  window.handleSpinRandomStudent = function() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    let students = store.getStudentsByClass(cls.id);
    const excludeCheckbox = document.getElementById('random-exclude-picked');
    if (excludeCheckbox && excludeCheckbox.checked && randomPickerExclusions.size > 0) {
      students = students.filter(s => !randomPickerExclusions.has(s.id));
      if (students.length === 0) {
        alert('All students have had a turn! Resetting exclusions.');
        randomPickerExclusions.clear();
        students = store.getStudentsByClass(cls.id);
      }
    }

    if (students.length === 0) {
      alert('No students in this class to pick from.');
      return;
    }

    const avatarEl = document.getElementById('random-student-avatar');
    const nameEl = document.getElementById('random-student-name');
    const metaEl = document.getElementById('random-student-meta');
    const rewardBtn = document.getElementById('btn-reward-random');

    let count = 0;
    const emojis = ['👧', '👦', '🧒', '🦸', '🦊', '🐼', '🚀', '⭐'];
    const interval = setInterval(() => {
      const rnd = students[Math.floor(Math.random() * students.length)];
      if (avatarEl) avatarEl.textContent = emojis[count % emojis.length];
      if (nameEl) nameEl.textContent = rnd.firstName.toUpperCase();
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalStudent = students[Math.floor(Math.random() * students.length)];
        lastPickedStudentId = finalStudent.id;
        if (excludeCheckbox && excludeCheckbox.checked) {
          randomPickerExclusions.add(finalStudent.id);
        }
        if (avatarEl) {
          avatarEl.textContent = getStudentAvatarEmoji(finalStudent.avatar);
          avatarEl.style.transform = 'scale(1.2)';
          setTimeout(() => { if (avatarEl) avatarEl.style.transform = 'scale(1)'; }, 300);
        }
        if (nameEl) nameEl.textContent = '🎉 ' + finalStudent.firstName.toUpperCase() + '!';
        if (metaEl) metaEl.textContent = cls.name + ' · CEFR: ' + (finalStudent.overallCefr || 'A1') + ' · ⭐ ' + store.getStudentTotalXP(finalStudent.id);
        if (rewardBtn) rewardBtn.style.display = 'inline-flex';
      }
    }, 80);
  };

  window.handleRewardPickedStudent = function() {
    if (!lastPickedStudentId) return;
    const s = store.getStudent(lastPickedStudentId);
    if (!s) return;
    store.giveXP(s.id, 5, '🎲 Random Challenger Spotlight', 'Ms. Sarah');
    alert('✓ Awarded +5 ⭐ to ' + s.firstName + '!');
    renderCurrentView();
  };

  // Floating Live Classroom Timer
  window.toggleFloatingTimer = function(forceState = null) {
    const timer = document.getElementById('classroom-floating-timer');
    if (!timer) return;
    const shouldShow = forceState !== null ? forceState : (timer.style.display === 'none' || !timer.style.display);
    timer.style.display = shouldShow ? 'block' : 'none';
  };

  window.setTimerMinutes = function(mins) {
    timerPresetSeconds = mins * 60;
    timerRemainingSeconds = timerPresetSeconds;
    timerIsRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    const startBtn = document.getElementById('btn-timer-start');
    if (startBtn) startBtn.textContent = '▶ Start';
    window.updateTimerDisplay();

    const presets = document.querySelectorAll('.timer-preset-btn');
    presets.forEach(p => p.classList.remove('is-active'));
    const matching = Array.from(presets).find(p => p.textContent.trim() === mins + 'm');
    if (matching) matching.classList.add('is-active');
  };

  window.promptCustomTimer = function() {
    const custom = prompt('Enter timer minutes (e.g. 2 or 7):', '2');
    const mins = parseInt(custom, 10);
    if (mins && mins > 0) {
      window.setTimerMinutes(mins);
    }
  };

  window.toggleTimerRunning = function() {
    const startBtn = document.getElementById('btn-timer-start');
    if (timerIsRunning) {
      // Pause
      timerIsRunning = false;
      if (timerInterval) clearInterval(timerInterval);
      if (startBtn) startBtn.textContent = '▶ Resume';
    } else {
      // Start
      timerIsRunning = true;
      if (startBtn) startBtn.textContent = '⏸ Pause';
      timerInterval = setInterval(() => {
        if (timerRemainingSeconds > 0) {
          timerRemainingSeconds--;
          window.updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          timerIsRunning = false;
          if (startBtn) startBtn.textContent = '▶ Start';
          window.playTimerChime();
        }
      }, 1000);
    }
  };

  window.resetTimer = function() {
    timerIsRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerRemainingSeconds = timerPresetSeconds;
    const startBtn = document.getElementById('btn-timer-start');
    if (startBtn) startBtn.textContent = '▶ Start';
    window.updateTimerDisplay();
  };

  window.updateTimerDisplay = function() {
    const display = document.getElementById('timer-digits');
    if (!display) return;
    const m = Math.floor(timerRemainingSeconds / 60);
    const s = timerRemainingSeconds % 60;
    display.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };

  window.playTimerChime = function() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.log('Timer chime:', e);
    }
    alert('⏰ Time is up!');
  };

  // Fast Attendance Modal
  window.openFastAttendanceModal = function() {
    const modal = document.getElementById('modal-fast-attendance');
    const container = document.getElementById('fast-attendance-list');
    const dateDisplay = document.getElementById('fast-att-date-display');
    if (!modal || !container) return;

    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const today = new Date().toISOString().split('T')[0];

    if (dateDisplay) {
      dateDisplay.textContent = 'Today · ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Read current statuses or default to Present
    const existing = store.getAttendanceRecords(cls.id).filter(r => r.date === today);
    const statusMap = {};
    existing.forEach(r => { statusMap[r.studentId] = r.status; });

    container.innerHTML = students.map(s => {
      const status = statusMap[s.id] || 'Present';
      return '' +
        '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg-card-secondary); border-radius:10px;" data-att-student="' + s.id + '">' +
          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span style="font-size:1.3rem;">' + getStudentAvatarEmoji(s.avatar) + '</span>' +
            '<span style="font-weight:700; font-size:0.92rem;">' + s.firstName + ' ' + s.lastName + '</span>' +
          '</div>' +
          '<div class="classroom-view-toggle-pills" style="gap:2px;">' +
            '<button type="button" class="classroom-view-pill-btn ' + (status === 'Present' ? 'is-active' : '') + '" onclick="window.handleToggleStudentAttFast(\'' + s.id + '\', \'Present\', this)">✓ Present</button>' +
            '<button type="button" class="classroom-view-pill-btn ' + (status === 'Late' ? 'is-active' : '') + '" onclick="window.handleToggleStudentAttFast(\'' + s.id + '\', \'Late\', this)">◷ Late</button>' +
            '<button type="button" class="classroom-view-pill-btn ' + (status === 'Absent' ? 'is-active' : '') + '" onclick="window.handleToggleStudentAttFast(\'' + s.id + '\', \'Absent\', this)">✕ Absent</button>' +
            '<button type="button" class="classroom-view-pill-btn ' + (status === 'Excused' ? 'is-active' : '') + '" onclick="window.handleToggleStudentAttFast(\'' + s.id + '\', \'Excused\', this)">○ Excused</button>' +
          '</div>' +
        '</div>';
    }).join('');

    window.updateFastAttCounterSummary();
    window.openModal('modal-fast-attendance');
  };

  window.handleToggleStudentAttFast = function(studentId, status, btn) {
    const row = document.querySelector('[data-att-student="' + studentId + '"]');
    if (!row) return;
    const buttons = row.querySelectorAll('.classroom-view-pill-btn');
    buttons.forEach(b => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
    window.updateFastAttCounterSummary();
  };

  window.handleMarkAllPresentFast = function() {
    const rows = document.querySelectorAll('#fast-attendance-list > div');
    rows.forEach(r => {
      const buttons = r.querySelectorAll('.classroom-view-pill-btn');
      buttons.forEach(b => b.classList.remove('is-active'));
      if (buttons[0]) buttons[0].classList.add('is-active'); // Present
    });
    window.updateFastAttCounterSummary();
  };

  window.updateFastAttCounterSummary = function() {
    const summary = document.getElementById('fast-att-counter-summary');
    if (!summary) return;
    let present = 0, late = 0, absent = 0;
    const rows = document.querySelectorAll('#fast-attendance-list > div');
    rows.forEach(r => {
      const active = r.querySelector('.classroom-view-pill-btn.is-active');
      if (active) {
        const text = active.textContent;
        if (text.includes('Present')) present++;
        else if (text.includes('Late')) late++;
        else if (text.includes('Absent')) absent++;
      }
    });
    summary.textContent = present + ' Present · ' + late + ' Late · ' + absent + ' Absent';
  };

  window.handleSaveFastAttendance = function() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const rows = document.querySelectorAll('#fast-attendance-list > div');
    const today = new Date().toISOString().split('T')[0];
    const statusMap = {};

    rows.forEach(r => {
      const studentId = r.getAttribute('data-att-student');
      const active = r.querySelector('.classroom-view-pill-btn.is-active');
      if (studentId && active) {
        const text = active.textContent.trim();
        const status = text.includes('Present') ? 'Present' : text.includes('Late') ? 'Late' : text.includes('Absent') ? 'Absent' : 'Excused';
        statusMap[studentId] = status;
      }
    });

    store.recordBulkAttendance(cls.id, today, statusMap);
    window.closeAllModals();
    alert('✓ Attendance saved for ' + Object.keys(statusMap).length + ' students in ' + cls.name + '!');
    renderCurrentView();
  };

  // Quick Assessment Formative Modal
  window.openQuickAssessmentModal = function(studentId = null) {
    const select = document.getElementById('quick-ass-student');
    if (!select) return;
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);

    select.innerHTML = students.map(s => '' +
      '<option value="' + s.id + '" ' + (studentId === s.id ? 'selected' : '') + '>' +
        getStudentAvatarEmoji(s.avatar) + ' ' + s.firstName + ' ' + s.lastName + ' (' + (s.overallCefr || 'A1') + ')' +
      '</option>'
    ).join('');

    window.openModal('modal-quick-assessment');
  };

  window.handleSaveQuickAssessment = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('quick-ass-student').value;
    const skill = document.getElementById('quick-ass-skill').value;
    const rating = document.getElementById('quick-ass-rating').value;
    const objective = document.getElementById('quick-ass-objective').value.trim();
    const comment = document.getElementById('quick-ass-comment').value.trim();

    store.recordQuickAssessment({
      studentId,
      skill,
      objective,
      rating,
      comment,
      teacherName: 'Ms. Sarah'
    });

    window.closeAllModals();
    alert('✓ Recorded ' + skill + ' assessment for ' + store.getStudent(studentId).firstName + ' (+10 ⭐)!');
    renderCurrentView();
  };

  // Quick Evidence (Worksheets) Modal
  window.openQuickEvidenceModal = function() {
    const container = document.getElementById('quick-ev-students-scores');
    if (!container) return;
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);

    container.innerHTML = students.map(s => '' +
      '<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border-subtle);">' +
        '<div style="display:flex; align-items:center; gap:8px;">' +
          '<span>' + getStudentAvatarEmoji(s.avatar) + '</span>' +
          '<span style="font-weight:700; font-size:0.86rem;">' + s.firstName + ' ' + s.lastName + '</span>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:6px;">' +
          '<input type="number" class="quick-ev-input filter-select" data-student-id="' + s.id + '" value="8" min="0" max="10" style="width:60px; text-align:center; padding:4px;" />' +
          '<span style="font-size:0.8rem; color:var(--text-muted);">/ 10</span>' +
        '</div>' +
      '</div>'
    ).join('');

    window.openModal('modal-quick-evidence');
  };

  window.handleSaveQuickEvidence = function(e) {
    e.preventDefault();
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const title = document.getElementById('quick-ev-title').value.trim();
    const maxScore = parseInt(document.getElementById('quick-ev-max').value, 10) || 10;
    const inputs = document.querySelectorAll('.quick-ev-input');

    const scores = Array.from(inputs).map(inp => ({
      studentId: inp.getAttribute('data-student-id'),
      score: parseInt(inp.value, 10) || 0,
      maxScore,
      skill: 'Writing'
    }));

    store.recordQuickEvidence({
      classId: cls.id,
      activityTitle: title,
      scores,
      teacherName: 'Ms. Sarah'
    });

    window.closeAllModals();
    alert('✓ Recorded worksheet evidence for ' + scores.length + ' students!');
    renderCurrentView();
  };

  // Smartboard / 🎓 Classroom Mode Toggle
  window.toggleSmartboardMode = function() {
    isClassroomSmartboardMode = !isClassroomSmartboardMode;
    if (isClassroomSmartboardMode) {
      document.body.classList.add('classroom-mode-active');
    } else {
      document.body.classList.remove('classroom-mode-active');
    }
    const label = document.getElementById('label-smartboard-mode');
    if (label) label.textContent = isClassroomSmartboardMode ? 'Exit Mode' : 'Classroom Mode';
    renderCurrentView();
  };

  // Delete / Correct Transaction from Student Points History
  window.handleDeleteXPTransaction = function(txId, studentId) {
    window.confirmAction({
      title: 'Remove Points Transaction',
      message: 'Are you sure you want to remove this points transaction? The student\'s total XP will be recalculated.',
      confirmText: 'Remove Transaction',
      isDanger: true,
      onConfirm: function() {
        store.deleteXPTransaction(txId);
        window.openStudentDetail(studentId, 'xp');
      }
    });
  };

  // Multi-Select Shortcuts
  window.openAssignModalForSelected = function() {
    window.openModal('modal-create-assignment');
  };

  window.openAttendanceForSelected = function() {
    window.openFastAttendanceModal();
  };

  window.openAddSelectedToGroup = function() {
    window.openCreateGroupModal();
  };

  window.openMessageForSelected = function() {
    alert('Opening parent message broadcast for ' + selectedStudentIds.size + ' families...');
    switchView('messages');
  };

  window.openAssignModalForGroup = function(groupId) {
    const group = store.getGroup(groupId);
    if (!group) return;
    window.openModal('modal-create-assignment');
  };


})(typeof window !== 'undefined' ? window : global);
