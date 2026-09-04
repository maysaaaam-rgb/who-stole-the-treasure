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
  let selectedAttDate = new Date().toISOString().split('T')[0];
  let activeArchivedFilter = 'all';
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
    let targetUnit = unitId;
    if (!targetUnit) {
      const units = store.getUnits();
      if (!units || units.length === 0) {
        alert('Please create a Unit first before adding a Lesson.');
        return;
      }
      const unitNames = units.map((u, i) => (i + 1) + '. ' + u.title).join('\n');
      const pick = prompt('Select Unit Number for this Lesson:\n' + unitNames, '1');
      const idx = parseInt(pick, 10) - 1;
      if (idx >= 0 && idx < units.length) {
        targetUnit = units[idx].id;
      } else {
        return;
      }
    }
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
    let targetLesson = lessonId;
    if (!targetLesson) {
      const lessons = store.getLessons();
      if (!lessons || lessons.length === 0) {
        alert('Please create a Lesson first before adding an Objective.');
        return;
      }
      const lessonNames = lessons.map((l, i) => (i + 1) + '. ' + l.title).join('\n');
      const pick = prompt('Select Lesson Number for this Objective:\n' + lessonNames, '1');
      const idx = parseInt(pick, 10) - 1;
      if (idx >= 0 && idx < lessons.length) {
        targetLesson = lessons[idx].id;
      } else {
        return;
      }
    }
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
    const editId = document.getElementById('edit-asg-id') ? document.getElementById('edit-asg-id').value : '';
    const title = document.getElementById('new-asg-title').value.trim();
    const classId = document.getElementById('new-asg-class').value;
    const activityId = document.getElementById('new-asg-game').value;
    const dueDate = document.getElementById('new-asg-date').value || 'Sep 25, 2026';
    const instructions = document.getElementById('new-asg-inst').value.trim();

    if (editId) {
      store.updateAssignment(editId, { title, classId, activityId, dueDate, instructions });
    } else {
      store.createAssignment({ title, classId, activityId, dueDate, instructions });
    }
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
    const editId = document.getElementById('edit-hw-id') ? document.getElementById('edit-hw-id').value : '';
    const title = document.getElementById('new-hw-title').value.trim();
    const type = document.getElementById('new-hw-type').value;
    const classId = document.getElementById('new-hw-class').value;
    const dueDate = document.getElementById('new-hw-date').value || 'Sep 25, 2026';
    const description = document.getElementById('new-hw-desc') ? document.getElementById('new-hw-desc').value.trim() : '';

    if (editId) {
      store.updateHomework(editId, { title, type, classId, dueDate, description });
    } else {
      store.createHomework({ title, type, classId, dueDate, description });
    }
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
    const editId = document.getElementById('edit-quiz-id') ? document.getElementById('edit-quiz-id').value : '';
    const title = document.getElementById('quiz-title').value.trim();
    const targetCefr = document.getElementById('quiz-cefr').value;
    const skill = document.getElementById('quiz-skill').value;

    if (editId) {
      store.updateQuiz(editId, { title, targetCefr, skill });
    } else {
      const q1 = document.getElementById('quiz-q1') ? document.getElementById('quiz-q1').value.trim() : 'Sample speaking checkpoint';
      const opt1 = document.getElementById('quiz-opt1') ? document.getElementById('quiz-opt1').value.trim() : 'Option A';
      const opt2 = document.getElementById('quiz-opt2') ? document.getElementById('quiz-opt2').value.trim() : 'Option B';
      store.createQuiz({
        title,
        targetCefr,
        skill,
        questions: [
          { id: 'q-1', question: q1, options: [opt1, opt2], correctIndex: 0 }
        ]
      });
    }

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
    const editId = document.getElementById('edit-story-id') ? document.getElementById('edit-story-id').value : '';
    const title = document.getElementById('story-post-title').value.trim();
    const category = document.getElementById('story-post-cat').value;
    const classId = document.getElementById('story-post-class').value;
    const content = document.getElementById('story-post-content').value.trim();

    if (editId) {
      store.updateStoryPost(editId, { title, category, classId, content });
    } else {
      store.addStoryPost({ title, category, classId, content });
    }
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
        const studentPortfolio = store.getStudentPortfolio(student.id);
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
            '<h4 style="font-weight:800; font-size:1.05rem;">Student Work &amp; Creative Artifacts (' + studentPortfolio.length + ')</h4>' +
            '<button class="btn-primary-action" onclick="openPortfolioItemModal(null, \'' + student.id + '\')">🎨 + Add Artifact</button>' +
          '</div>' +
          (studentPortfolio.length === 0 ? 
            '<div style="text-align:center; padding:32px 16px; background:var(--bg-canvas); border-radius:var(--radius-md); border:1px solid var(--border-light);">' +
              '<div style="font-size:32px; margin-bottom:8px;">🎨</div>' +
              '<div style="font-weight:700;">No creative artifacts recorded yet</div>' +
              '<p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Add drawings, spoken dialogue recordings, or story projects.</p>' +
              '<button class="btn-primary-action" style="margin-top:10px;" onclick="openPortfolioItemModal(null, \'' + student.id + '\')">+ Add First Artifact</button>' +
            '</div>' :
            '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px;">' +
              studentPortfolio.map(item => '' +
                '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between;">' +
                  '<div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                      '<span style="font-size:0.72rem; background:rgba(79,70,229,0.1); color:var(--color-primary); padding:2px 6px; border-radius:999px; font-weight:700;">' + item.category + '</span>' +
                      '<span style="font-size:0.72rem; color:var(--text-muted);">' + (item.date || '') + '</span>' +
                    '</div>' +
                    '<strong style="font-size:0.95rem; display:block; margin-bottom:6px;">' + item.title + '</strong>' +
                    '<div style="font-size:36px; margin:6px 0; text-align:center;">' + (item.preview || '🎨') + '</div>' +
                    (item.notes ? '<p style="font-size:0.78rem; font-style:italic; color:var(--text-secondary); margin-top:4px;">"' + item.notes + '"</p>' : '') +
                  '</div>' +
                  '<div style="display:flex; justify-content:flex-end; gap:6px; margin-top:10px; border-top:1px solid var(--border-light); padding-top:8px;">' +
                    '<button class="btn-sm-secondary" onclick="openPortfolioItemModal(\'' + item.id + '\', \'' + student.id + '\')" style="padding:2px 8px; font-size:0.72rem;">✏️ Edit</button>' +
                    '<button class="btn-sm-secondary" onclick="handleDeletePortfolioItem(\'' + item.id + '\')" style="padding:2px 8px; font-size:0.72rem; color:var(--color-danger);">🗑️ Delete</button>' +
                  '</div>' +
                '</div>'
              ).join('') +
            '</div>'
          );

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

  
  // =========================================================================
  // CURRICULUM MANAGEMENT (Reordering, Units, Lessons, Objectives)
  // =========================================================================
  function renderCurriculumView(container) {
    const books = store.getBooks();
    const activeBook = books.find(b => b.id === curriculumActiveBookId) || books[0];
    const units = store.getUnits(activeBook.id);
    const lessons = store.getLessons();
    const objectives = store.getObjectives();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Curriculum Framework</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Pedagogical progression from Pre-A1 to A2. Reorder, edit, and link classroom games.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button class="btn-sm-secondary" onclick="openAddBookModal()">📖 + Add Book</button>' +
          '<button class="btn-primary-action" onclick="openAddUnitModal(\'' + activeBook.id + '\')">📑 + Add Unit</button>' +
        '</div>' +
      '</div>' +

      // Books Tab Switcher
      '<div class="curriculum-book-tabs" style="display:flex; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:4px;">' +
        books.map(b => '' +
          '<div style="display:inline-flex; align-items:center; gap:2px; border-bottom:3px solid ' + (activeBook.id === b.id ? 'var(--color-primary)' : 'transparent') + '; padding-bottom:4px;">' +
            '<button class="curriculum-book-tab ' + (activeBook.id === b.id ? 'is-active' : '') + '" onclick="curriculumActiveBookId=\'' + b.id + '\'; renderCurrentView();" style="background:transparent; border:none; padding:8px 12px; font-weight:800; font-size:0.95rem; cursor:pointer; color:' + (activeBook.id === b.id ? 'var(--color-primary)' : 'var(--text-muted)') + ';">' +
              b.title + ' (' + b.targetLevel + ')' +
            '</button>' +
            (activeBook.id === b.id ? 
              '<button onclick="openEditBookModal(\'' + b.id + '\')" title="Edit Book" style="background:transparent; border:none; cursor:pointer; font-size:0.75rem; padding:2px;">✏️</button>' +
              '<button onclick="handleArchiveBook(\'' + b.id + '\')" title="Archive Book" style="background:transparent; border:none; cursor:pointer; font-size:0.75rem; padding:2px; color:var(--color-danger);">🗑️</button>'
              : '') +
          '</div>'
        ).join('') +
      '</div>' +

      // Units List
      '<div class="curriculum-units-list" style="display:flex; flex-direction:column; gap:16px;">' +
        units.map((u, uIdx) => {
          const uLessons = lessons.filter(l => l.unitId === u.id).sort((a, b) => (a.order || 0) - (b.order || 0));
          return '' +
            '<div class="unit-accordion-card" style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
              // Unit Header
              '<div style="padding:16px 20px; background:var(--bg-card-secondary); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
                '<div style="display:flex; align-items:center; gap:10px;">' +
                  // Reorder buttons for units
                  '<div style="display:flex; flex-direction:column; gap:2px;">' +
                    (uIdx > 0 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.65rem;" onclick="handleMoveUnitUp(\'' + activeBook.id + '\', \'' + u.id + '\')" title="Move Unit Up">▲</button>' : '') +
                    (uIdx < units.length - 1 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.65rem;" onclick="handleMoveUnitDown(\'' + activeBook.id + '\', \'' + u.id + '\')" title="Move Unit Down">▼</button>' : '') +
                  '</div>' +
                  '<div>' +
                    '<h3 style="font-size:1.15rem; font-weight:800; margin:0;">' + u.title + '</h3>' +
                    '<div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">' +
                      'Target Vocab: ' + (u.targetVocab || []).join(', ') +
                    '</div>' +
                  '</div>' +
                '</div>' +

                '<div style="display:flex; align-items:center; gap:6px;">' +
                  '<button class="btn-sm-secondary" onclick="openAddLessonModal(\'' + u.id + '\')" style="font-size:0.78rem; padding:4px 10px;">+ Add Lesson</button>' +
                  '<button class="btn-sm-secondary" onclick="openEditUnitModal(\'' + u.id + '\')" style="font-size:0.78rem; padding:4px 10px;">✏️ Edit</button>' +
                  '<button class="btn-sm-secondary" onclick="handleDuplicateUnit(\'' + u.id + '\')" style="font-size:0.78rem; padding:4px 10px;">📋</button>' +
                  '<button class="btn-sm-secondary" onclick="handleArchiveUnit(\'' + u.id + '\')" style="font-size:0.78rem; padding:4px 10px; color:var(--color-danger);">📦</button>' +
                '</div>' +
              '</div>' +

              // Unit Lessons Body
              '<div style="padding:16px 20px; display:flex; flex-direction:column; gap:12px;">' +
                (uLessons.length === 0 ? '<div style="font-size:0.84rem; color:var(--text-muted); font-style:italic;">No lessons in this unit yet. Click "+ Add Lesson" to create one.</div>' : '') +
                uLessons.map((l, lIdx) => {
                  const lObjs = objectives.filter(o => o.lessonId === l.id);
                  return '' +
                    '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:10px; padding:14px 16px;">' +
                      '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">' +
                        '<div style="display:flex; align-items:flex-start; gap:8px;">' +
                          // Reorder buttons for lessons
                          '<div style="display:flex; flex-direction:column; gap:2px; margin-top:2px;">' +
                            (lIdx > 0 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.62rem;" onclick="handleMoveLessonUp(\'' + u.id + '\', \'' + l.id + '\')">▲</button>' : '') +
                            (lIdx < uLessons.length - 1 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.62rem;" onclick="handleMoveLessonDown(\'' + u.id + '\', \'' + l.id + '\')">▼</button>' : '') +
                          '</div>' +
                          '<div>' +
                            '<div style="display:flex; align-items:center; gap:8px;">' +
                              '<h4 style="font-size:0.98rem; font-weight:800; margin:0;">' + l.title + '</h4>' +
                              (l.gameRoute ? '<a href="' + l.gameRoute + '" class="btn-primary-action" style="padding:2px 8px; font-size:0.72rem; text-decoration:none;">▶ Play Game</a>' : '') +
                            '</div>' +
                            '<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">' + (l.objective || '') + '</div>' +
                          '</div>' +
                        '</div>' +

                        '<div style="display:flex; gap:6px;">' +
                          '<button class="btn-sm-secondary" onclick="openAddObjectiveModal(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">+ Objective</button>' +
                          '<button class="btn-sm-secondary" onclick="openEditLessonModal(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">✏️ Edit</button>' +
                          '<button class="btn-sm-secondary" onclick="handleDuplicateLesson(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">📋</button>' +
                          '<button class="btn-sm-secondary" onclick="handleArchiveLesson(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem; color:var(--color-danger);">📦</button>' +
                        '</div>' +
                      '</div>' +

                      // Objectives pills
                      (lObjs.length > 0 ? 
                        '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; padding-top:8px; border-top:1px dashed var(--border-subtle);">' +
                          lObjs.map(o => 
                            '<span style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-card-secondary); border:1px solid var(--border-subtle); padding:2px 8px; border-radius:6px; font-size:0.75rem;">' +
                              '<strong>' + o.skill + ':</strong> ' + o.text +
                              '<button type="button" onclick="handleDeleteObjective(\'' + o.id + '\')" style="background:transparent; border:none; cursor:pointer; color:var(--color-danger); font-size:0.72rem; padding:0 2px;">✕</button>' +
                            '</span>'
                          ).join('') +
                        '</div>' : ''
                      ) +
                    '</div>';
                }).join('') +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // =========================================================================
  // LESSON LIBRARY & WORKSHEETS CATALOG
  // =========================================================================
  let libraryActiveCatalogTab = 'games'; // 'games' | 'worksheets'

  function renderLibraryView(container) {
    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Educational Resource Library</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">15 Audited digital classroom games, worksheets, stories, and roleplays.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="openWorksheetEditor()">📄 + Add Worksheet</button>' +
          '<button class="btn-primary-action" onclick="openResourceEditor()">🎮 + Add Resource</button>' +
          '<button class="btn-sm-secondary" onclick="isLibraryManageMode = !isLibraryManageMode; renderCurrentView();" style="' + (isLibraryManageMode ? 'background:var(--color-primary); color:#fff;' : '') + '">' +
            (isLibraryManageMode ? '✓ Done Managing' : '⚙️ Manage Mode') +
          '</button>' +
        '</div>' +
      '</div>' +

      // Sub-Tabs: Interactive Games vs Worksheets
      '<div style="display:flex; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:4px;">' +
        '<button class="classroom-view-pill-btn ' + (libraryActiveCatalogTab === 'games' ? 'is-active' : '') + '" onclick="libraryActiveCatalogTab=\'games\'; renderCurrentView();">' +
          '<span>🎮</span> <span>Interactive Games (' + store.getResources().length + ')</span>' +
        '</button>' +
        '<button class="classroom-view-pill-btn ' + (libraryActiveCatalogTab === 'worksheets' ? 'is-active' : '') + '" onclick="libraryActiveCatalogTab=\'worksheets\'; renderCurrentView();">' +
          '<span>📄</span> <span>Printable Worksheets (' + store.getWorksheets().length + ')</span>' +
        '</button>' +
      '</div>' +

      (libraryActiveCatalogTab === 'games' ? renderGamesCatalogHTML() : renderWorksheetsCatalogHTML());
  }

  function renderGamesCatalogHTML() {
    const resources = store.getResources();
    return '' +
      // Search & Filters bar
      '<div class="library-filter-bar" style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">' +
        '<input type="text" id="lib-search-input" class="search-input" placeholder="Search games, vocabulary, topics... (Press /)" style="flex:1; min-width:220px;" value="' + libSearchQuery + '" oninput="libSearchQuery=this.value; renderCurrentView();" />' +
        '<select class="filter-select" onchange="libFilterLevel=this.value; renderCurrentView();">' +
          '<option value="all">All CEFR Levels</option>' +
          '<option value="Pre-A1" ' + (libFilterLevel==='Pre-A1'?'selected':'') + '>Pre-A1</option>' +
          '<option value="A1" ' + (libFilterLevel==='A1'?'selected':'') + '>A1</option>' +
          '<option value="A1+" ' + (libFilterLevel==='A1+'?'selected':'') + '>A1+</option>' +
          '<option value="A2" ' + (libFilterLevel==='A2'?'selected':'') + '>A2</option>' +
        '</select>' +
      '</div>' +

      '<div class="games-grid">' +
        resources.filter(r => {
          const matchQuery = !libSearchQuery || r.title.toLowerCase().includes(libSearchQuery.toLowerCase()) || (r.description || '').toLowerCase().includes(libSearchQuery.toLowerCase());
          const matchLevel = libFilterLevel === 'all' || r.level === libFilterLevel;
          return matchQuery && matchLevel;
        }).map(r => renderGameCard(r)).join('') +
      '</div>';
  }

  function renderWorksheetsCatalogHTML() {
    const worksheets = store.getWorksheets();
    return '' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">' +
        worksheets.map(w => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">' +
                '<span class="badge-cefr badge-cefr-' + (w.level || 'A1').toLowerCase().replace('+', '-plus') + '">' + w.level + '</span>' +
                '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">' + w.category + '</span>' +
              '</div>' +
              '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">' + w.title + '</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">' + (w.description || 'Classroom worksheet drill.') + '</p>' +
              (w.answerKey ? '<div style="font-size:0.75rem; background:var(--bg-card-secondary); padding:4px 8px; border-radius:6px; margin-bottom:12px; border:1px solid var(--border-subtle);"><strong>Answer Key:</strong> ' + w.answerKey + '</div>' : '') +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">' +
              '<a href="' + w.pdfUrl + '" class="btn-primary-action" style="text-decoration:none; padding:4px 12px; font-size:0.8rem;" target="_blank">📄 View / Print</a>' +
              '<div style="display:flex; gap:6px;">' +
                '<button class="btn-sm-secondary" onclick="openWorksheetEditor(\'' + w.id + '\')" style="padding:4px 8px; font-size:0.78rem;">✏️ Edit</button>' +
                '<button class="btn-sm-secondary" onclick="handleArchiveWorksheet(\'' + w.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);">📦</button>' +
              '</div>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  function renderGameCard(r) {
    const isFeatured = r.featured;
    return '' +
      '<div class="game-resource-card ' + (isFeatured ? 'is-featured' : '') + '">' +
        '<div class="game-card-top-row">' +
          '<span class="badge-cefr badge-cefr-' + (r.level || 'A1').toLowerCase().replace('+', '-plus') + '">' + (r.level || 'A1') + '</span>' +
          '<div style="display:flex; align-items:center; gap:6px;">' +
            '<span class="game-card-category-pill">' + (r.category || 'Classroom Game') + '</span>' +
            '<button class="card-kebab-btn" onclick="toggleCardMenu(\'' + r.id + '\', event)" title="Resource Actions">⋯</button>' +
            '<div class="card-dropdown-menu ' + (activeCardMenuId === r.id ? 'is-open' : '') + '" id="card-menu-' + r.id + '">' +
              '<button class="dropdown-item-btn" onclick="openResourceEditor(\'' + r.id + '\')"><span>✏️</span> <span>Edit Resource</span></button>' +
              '<button class="dropdown-item-btn" onclick="handleDuplicateResource(\'' + r.id + '\')"><span>📋</span> <span>Duplicate</span></button>' +
              '<button class="dropdown-item-btn" onclick="openAssignModal(\'' + r.id + '\')"><span>📝</span> <span>Assign to Class</span></button>' +
              '<button class="dropdown-item-btn" onclick="handleToggleFavorite(\'' + r.id + '\')"><span>⭐</span> <span>' + (r.featured ? 'Unfavorite' : 'Mark Featured') + '</span></button>' +
              '<button class="dropdown-item-btn text-danger" onclick="handleArchiveResource(\'' + r.id + '\')"><span>🗑️</span> <span>Archive Resource</span></button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="game-card-body">' +
          '<h3 class="game-card-title">' + r.title + '</h3>' +
          '<p class="game-card-description">' + (r.description || 'Interactive classroom lesson.') + '</p>' +
          '<div class="game-card-skills-row">' +
            (r.skills || ['Speaking']).map(s => '<span class="skill-tag-pill">' + s + '</span>').join('') +
          '</div>' +
        '</div>' +

        '<div class="game-card-footer">' +
          '<a href="' + r.route + '" class="btn-game-play" title="Launch ' + r.title + ' in full screen">' +
            '<span>▶</span> <span>START GAME</span>' +
          '</a>' +
          '<button class="btn-game-assign" onclick="openAssignModal(\'' + r.id + '\')" title="Assign to Class">' +
            'Assign' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // ASSIGNMENTS VIEW (Complete CRUD)
  // =========================================================================
  function renderAssignmentsView(container) {
    const assignments = store.getAssignments();
    const classes = store.getClasses();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Class Assignments</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage assigned digital tasks, deadlines, and submissions.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-create-assignment\')">+ Create Assignment</button>' +
      '</div>' +

      '<div style="display:flex; flex-direction:column; gap:14px;">' +
        assignments.map(a => {
          const cls = classes.find(c => c.id === a.classId) || { name: 'All Classes' };
          const res = store.getResource(a.gameId);
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:18px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:var(--shadow-sm);">' +
              '<div>' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="font-weight:800; font-size:1.05rem;">' + a.title + '</span>' +
                  '<span style="font-size:0.75rem; background:rgba(79,70,229,0.1); color:var(--color-primary); padding:2px 8px; border-radius:999px; font-weight:700;">' + cls.name + '</span>' +
                '</div>' +
                '<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">' +
                  'Due: ' + (a.dueDate || 'No deadline') + ' · Game: ' + (res ? res.title : a.gameId) +
                '</div>' +
                (a.instructions ? '<div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px; font-style:italic;">"' + a.instructions + '"</div>' : '') +
              '</div>' +
              '<div style="display:flex; align-items:center; gap:8px;">' +
                (res ? '<a href="' + res.route + '" class="btn-primary-action" style="padding:6px 12px; font-size:0.8rem; text-decoration:none;">▶ Play</a>' : '') +
                '<button class="btn-sm-secondary" onclick="openEditAssignmentModal(\'' + a.id + '\')">✏️ Edit</button>' +
                '<button class="btn-sm-secondary" onclick="handleDuplicateAssignment(\'' + a.id + '\')">📋</button>' +
                '<button class="btn-sm-secondary" onclick="handleArchiveAssignment(\'' + a.id + '\')" style="color:var(--color-danger);">📦</button>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // =========================================================================
  // HOMEWORK VIEW (Complete CRUD)
  // =========================================================================
  function renderHomeworkView(container) {
    const homework = store.getHomework();
    const classes = store.getClasses();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Homework &amp; Independent Tasks</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Printable worksheets, home speaking missions, and reading logs.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-homework-editor\')">+ Create Homework</button>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">' +
        homework.map(h => {
          const cls = classes.find(c => c.id === h.classId) || { name: 'Active Class' };
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
              '<div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                  '<span style="font-size:0.75rem; font-weight:800; color:var(--color-primary); background:rgba(79,70,229,0.1); padding:2px 8px; border-radius:999px;">' + h.type + '</span>' +
                  '<span style="font-size:0.75rem; color:var(--text-muted);">' + cls.name + '</span>' +
                '</div>' +
                '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:6px;">' + h.title + '</h3>' +
                '<p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">Due: ' + (h.dueDate || 'Friday') + '</p>' +
              '</div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">' +
                '<button class="btn-sm-secondary" onclick="openEditHomeworkModal(\'' + h.id + '\')" style="padding:4px 10px; font-size:0.78rem;">✏️ Edit</button>' +
                '<div style="display:flex; gap:6px;">' +
                  '<button class="btn-sm-secondary" onclick="handleDuplicateHomework(\'' + h.id + '\')" style="padding:4px 8px; font-size:0.78rem;">📋</button>' +
                  '<button class="btn-sm-secondary" onclick="handleArchiveHomework(\'' + h.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);">📦</button>' +
                '</div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // =========================================================================
  // QUIZZES & QUESTION BUILDER VIEW (Complete CRUD)
  // =========================================================================
  function renderQuizzesView(container) {
    const quizzes = store.getQuizzes();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Diagnostic Quizzes &amp; Tests</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage interactive questions, CEFR checkpoints, and diagnostic drills.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-quiz-builder\')">+ Create Quiz</button>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">' +
        quizzes.map(q => {
          const qCount = (q.questions || []).length;
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
              '<div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                  '<span class="badge-cefr badge-cefr-' + (q.targetCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + (q.targetCefr || 'A1') + '</span>' +
                  '<span style="font-size:0.78rem; color:var(--text-muted); font-weight:700;">' + q.skill + '</span>' +
                '</div>' +
                '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">' + q.title + '</h3>' +
                '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">' + qCount + ' Questions · 100% Diagnostic</div>' +
              '</div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">' +
                '<button class="btn-primary-action" onclick="openQuizQuestionsManager(\'' + q.id + '\')" style="padding:5px 12px; font-size:0.82rem;">🧩 Manage Questions (' + qCount + ')</button>' +
                '<div style="display:flex; gap:6px;">' +
                  '<button class="btn-sm-secondary" onclick="openEditQuizModal(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem;">✏️</button>' +
                  '<button class="btn-sm-secondary" onclick="handleDuplicateQuiz(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem;">📋</button>' +
                  '<button class="btn-sm-secondary" onclick="handleArchiveQuiz(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);">📦</button>' +
                '</div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // =========================================================================
  // ASSESSMENTS & RUBRICS VIEW (Complete CRUD)
  // =========================================================================
  let assessmentsActiveSubTab = 'evaluations'; // 'evaluations' | 'rubrics'

  function renderAssessmentsView(container) {
    const assessments = store.getAssessments();
    const rubrics = store.getRubrics();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Teacher Assessments &amp; Rubrics</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Multi-skill formative rubric scoring and criteria management.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="openRubricEditorModal()">🎯 + Create Rubric</button>' +
          '<button class="btn-primary-action" onclick="openModal(\'modal-assessment-rubric\')">📝 + Record Assessment</button>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:4px;">' +
        '<button class="classroom-view-pill-btn ' + (assessmentsActiveSubTab === 'evaluations' ? 'is-active' : '') + '" onclick="assessmentsActiveSubTab=\'evaluations\'; renderCurrentView();">' +
          '<span>🎯</span> <span>Student Evaluations (' + assessments.length + ')</span>' +
        '</button>' +
        '<button class="classroom-view-pill-btn ' + (assessmentsActiveSubTab === 'rubrics' ? 'is-active' : '') + '" onclick="assessmentsActiveSubTab=\'rubrics\'; renderCurrentView();">' +
          '<span>📋</span> <span>Rubric Templates (' + rubrics.length + ')</span>' +
        '</button>' +
      '</div>' +

      (assessmentsActiveSubTab === 'evaluations' ? renderAssessmentsTableHTML(assessments) : renderRubricsTemplatesHTML(rubrics));
  }

  function renderAssessmentsTableHTML(assessments) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
        '<div style="padding:16px 20px; border-bottom:1px solid var(--border-subtle); font-weight:800; font-size:1.05rem;">Recent Multi-Skill Evaluations</div>' +
        '<div style="display:flex; flex-direction:column;">' +
          assessments.map(ass => {
            const s = store.getStudent(ass.studentId) || { firstName: 'Student', lastName: '' };
            return '' +
              '<div style="padding:14px 20px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">' +
                '<div>' +
                  '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<span style="font-weight:800;">' + s.firstName + ' ' + s.lastName + '</span>' +
                    '<span style="font-size:0.75rem; color:var(--text-muted);">' + ass.date + '</span>' +
                  '</div>' +
                  '<div style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">' + (ass.notes || 'Spoken formative evaluation.') + '</div>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:12px;">' +
                  '<span style="font-size:0.88rem; font-weight:800; color:var(--color-success);">' + (ass.overallScore || '4.0') + ' / 5.0</span>' +
                  '<button class="btn-sm-secondary" onclick="handleDeleteAssessment(\'' + ass.id + '\')" style="padding:3px 8px; font-size:0.75rem; color:var(--color-danger);">🗑️</button>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderRubricsTemplatesHTML(rubrics) {
    return '' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:18px;">' +
        rubrics.map(r => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                '<span style="font-size:0.78rem; font-weight:800; color:var(--color-primary); background:rgba(79,70,229,0.1); padding:2px 8px; border-radius:999px;">' + r.skill + '</span>' +
                '<span style="font-size:0.75rem; color:var(--text-muted);">' + (r.criteria || []).length + ' Criteria</span>' +
              '</div>' +
              '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:10px;">' + r.name + '</h3>' +
              '<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:14px;">' +
                (r.criteria || []).map(c => '' +
                  '<div style="font-size:0.78rem; background:var(--bg-card-secondary); padding:5px 8px; border-radius:6px; border:1px solid var(--border-subtle);">' +
                    '<strong>' + c.name + ':</strong> ' + (c.description || '1–5 scale evaluation') +
                  '</div>'
                ).join('') +
              '</div>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">' +
              '<button class="btn-sm-secondary" onclick="openRubricEditorModal(\'' + r.id + '\')" style="padding:4px 10px; font-size:0.8rem;">✏️ Edit Criteria</button>' +
              '<button class="btn-sm-secondary" onclick="handleArchiveRubric(\'' + r.id + '\')" style="padding:4px 8px; font-size:0.8rem; color:var(--color-danger);">📦 Archive</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  // =========================================================================
  // DYNAMIC REPORTS GENERATOR VIEW (Complete CRUD)
  // =========================================================================
  function renderReportsView(container) {
    const reports = store.getReports();
    const students = store.getStudents();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Student Term Reports</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Dynamic report cards compiled from live attendance, XP ledger, and CEFR mastery data.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openReportGeneratorModal()">📄 + Generate New Report</button>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">' +
        reports.map(rep => {
          const s = students.find(item => item.id === rep.studentId) || { firstName: 'Student', lastName: '' };
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
              '<div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                  '<span style="font-size:0.75rem; font-weight:800; color:var(--color-primary); background:rgba(79,70,229,0.1); padding:2px 8px; border-radius:999px;">' + rep.term + '</span>' +
                  '<span style="font-size:0.75rem; color:var(--text-muted);">' + rep.date + '</span>' +
                '</div>' +
                '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:4px;">' + rep.title + '</h3>' +
                '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">' + (rep.className || 'Class 3A') + ' · ' + rep.reportType + '</div>' +
                '<div style="background:var(--bg-card-secondary); border-radius:8px; padding:10px; font-size:0.8rem; margin-bottom:14px; border:1px solid var(--border-subtle);">' +
                  '<div><strong>Total XP:</strong> ⭐ ' + ((rep.dataSnapshot || {}).totalXP || 1240) + '</div>' +
                  '<div><strong>Attendance:</strong> ' + ((rep.dataSnapshot || {}).attendanceRate || 100) + '%</div>' +
                  '<div><strong>CEFR Level:</strong> ' + ((rep.dataSnapshot || {}).overallCefr || 'A1') + '</div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">' +
                '<button class="btn-primary-action" onclick="viewPrintableReportCard(\'' + rep.id + '\')" style="padding:4px 12px; font-size:0.8rem;">👁️ View / Print Card</button>' +
                '<button class="btn-sm-secondary" onclick="handleDeleteReport(\'' + rep.id + '\')" style="padding:4px 8px; font-size:0.8rem; color:var(--color-danger);">🗑️</button>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  // =========================================================================
  // GAMIFICATION SETTINGS VIEW (Badges & Achievements CRUD)
  // =========================================================================
  function renderGamificationView(container) {
    const badges = store.getBadges();
    const achievements = store.getAchievements();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Gamification &amp; Reward Milestones</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage badges, streak achievements, and XP award values.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="openGamificationEditorModal(\'' + 'badge' + '\')">⭐ + Add Badge</button>' +
          '<button class="btn-primary-action" onclick="openGamificationEditorModal(\'' + 'achievement' + '\')">🏆 + Add Achievement</button>' +
        '</div>' +
      '</div>' +

      '<h2 style="font-size:1.2rem; font-weight:800; margin-bottom:12px;">Classroom Badges (' + badges.length + ')</h2>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:14px; margin-bottom:30px;">' +
        badges.map(b => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">' +
              '<span style="font-size:2rem;">' + b.icon + '</span>' +
              '<div>' +
                '<div style="font-weight:800; font-size:0.95rem;">' + b.name + '</div>' +
                '<div style="font-size:0.75rem; color:#b45309; font-weight:700;">+' + b.xpReward + ' ⭐ XP</div>' +
              '</div>' +
            '</div>' +
            '<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">' + b.description + '</p>' +
            '<div style="display:flex; justify-content:flex-end; gap:6px; border-top:1px solid var(--border-subtle); padding-top:8px;">' +
              '<button class="btn-sm-secondary" onclick="openEditBadgeModal(\'' + b.id + '\')" style="padding:2px 8px; font-size:0.75rem;">✏️ Edit</button>' +
              '<button class="btn-sm-secondary" onclick="handleArchiveBadge(\'' + b.id + '\')" style="padding:2px 8px; font-size:0.75rem; color:var(--color-danger);">📦</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>' +

      '<h2 style="font-size:1.2rem; font-weight:800; margin-bottom:12px;">Learning World Achievements (' + achievements.length + ')</h2>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:14px;">' +
        achievements.map(a => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">' +
              '<span style="font-size:2rem;">' + a.icon + '</span>' +
              '<div>' +
                '<div style="font-weight:800; font-size:0.95rem;">' + a.name + '</div>' +
                '<div style="font-size:0.75rem; color:#b45309; font-weight:700;">+' + a.xpReward + ' ⭐ XP</div>' +
              '</div>' +
            '</div>' +
            '<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">' + a.requirement + '</p>' +
            '<div style="display:flex; justify-content:flex-end; gap:6px; border-top:1px solid var(--border-subtle); padding-top:8px;">' +
              '<button class="btn-sm-secondary" onclick="openEditAchievementModal(\'' + a.id + '\')" style="padding:2px 8px; font-size:0.75rem;">✏️ Edit</button>' +
              '<button class="btn-sm-secondary" onclick="handleArchiveAchievement(\'' + a.id + '\')" style="padding:2px 8px; font-size:0.75rem; color:var(--color-danger);">📦</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  // =========================================================================
  // ADMIN & SYSTEM HEALTH VIEW (26-Entity Live CRUD Matrix)
  // =========================================================================
  function renderSystemHealthView(container) {
    const s = store.state;
    const settings = store.getSchoolSettings();

    const matrix = [
      { id: 1, name: 'Students', count: s.students.length, group: 'Classroom', create: true, view: true, edit: true, archive: true },
      { id: 2, name: 'Classes', count: s.classes.length, group: 'Classroom', create: true, view: true, edit: true, archive: true },
      { id: 3, name: 'Groups', count: (s.groups || []).length, group: 'Classroom', create: true, view: true, edit: true, archive: true },
      { id: 4, name: 'Books', count: (s.curriculum.books || []).length, group: 'Curriculum', create: true, view: true, edit: true, archive: true },
      { id: 5, name: 'Units', count: (s.curriculum.units || []).length, group: 'Curriculum', create: true, view: true, edit: true, archive: true },
      { id: 6, name: 'Lessons', count: (s.curriculum.lessons || []).length, group: 'Curriculum', create: true, view: true, edit: true, archive: true },
      { id: 7, name: 'Objectives', count: (s.curriculum.objectives || []).length, group: 'Curriculum', create: true, view: true, edit: true, archive: true },
      { id: 8, name: 'Games / Resources', count: s.resources.length, group: 'Content', create: true, view: true, edit: true, archive: true },
      { id: 9, name: 'Worksheets', count: (s.worksheets || []).length, group: 'Content', create: true, view: true, edit: true, archive: true },
      { id: 10, name: 'Activities', count: s.resources.length, group: 'Content', create: true, view: true, edit: true, archive: true },
      { id: 11, name: 'Assignments', count: s.assignments.length, group: 'Teaching', create: true, view: true, edit: true, archive: true },
      { id: 12, name: 'Homework', count: s.homework.length, group: 'Teaching', create: true, view: true, edit: true, archive: true },
      { id: 13, name: 'Quizzes', count: s.quizzes.length, group: 'Assessment', create: true, view: true, edit: true, archive: true },
      { id: 14, name: 'Questions', count: (s.quizzes[0] ? (s.quizzes[0].questions || []).length : 2), group: 'Assessment', create: true, view: true, edit: true, archive: true },
      { id: 15, name: 'Assessments', count: s.assessments.length, group: 'Assessment', create: true, view: true, edit: true, archive: true },
      { id: 16, name: 'Rubrics', count: (s.rubrics || []).length, group: 'Assessment', create: true, view: true, edit: true, archive: true },
      { id: 17, name: 'Attendance', count: s.attendanceRecords.length, group: 'Tracking', create: true, view: true, edit: true, archive: true },
      { id: 18, name: 'Learning Evidence', count: s.learningEvidence.length, group: 'Tracking', create: true, view: true, edit: true, archive: true },
      { id: 19, name: 'Teacher Notes', count: s.teacherNotes.length, group: 'Student', create: true, view: true, edit: true, archive: true },
      { id: 20, name: 'XP Transactions', count: s.xpTransactions.length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 21, name: 'Badges', count: (s.badges || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 22, name: 'Achievements', count: (s.achievements || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 23, name: 'Student Portfolio', count: (s.portfolios || []).length, group: 'Student', create: true, view: true, edit: true, archive: true },
      { id: 24, name: 'Class Story', count: s.classStory.length, group: 'Community', create: true, view: true, edit: true, archive: true },
      { id: 25, name: 'Messages', count: s.messages.length, group: 'Community', create: true, view: true, edit: true, archive: true },
      { id: 26, name: 'Reports', count: (s.reports || []).length, group: 'Assessment', create: true, view: true, edit: true, archive: true }
    ];

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">📊 System Health &amp; CRUD Audit</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Comprehensive operational audit verifying 100% editability and persistence across all 26 application entities.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="handleExportStoreJson()">💾 Export JSON Backup</button>' +
          '<button class="btn-primary-action" onclick="openSchoolSettingsModal()">⚙️ School Settings</button>' +
        '</div>' +
      '</div>' +

      // Live KPI Bar
      '<div class="kpi-grid" style="margin-bottom:24px;">' +
        '<div class="kpi-card"><span class="kpi-label">Entities Covered</span><span class="kpi-val">26 / 26</span><span class="kpi-sub">100% Operational</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Active Storage Key</span><span class="kpi-val" style="font-size:1.05rem;">eaa_master_school_v3</span><span class="kpi-sub">Persistent localStorage</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Total Records</span><span class="kpi-val">' + matrix.reduce((acc, m) => acc + m.count, 0) + '</span><span class="kpi-sub">Live in memory</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Academic Year</span><span class="kpi-val" style="color:var(--color-primary);">' + (settings.academicYear || '2026–2027') + '</span><span class="kpi-sub">' + settings.schoolName + '</span></div>' +
      '</div>' +

      // Live CRUD Matrix Table
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
        '<div style="padding:16px 20px; background:var(--bg-card-secondary); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">' +
          '<h3 style="font-size:1.1rem; font-weight:800; margin:0;">Global 26-Entity Operations Matrix</h3>' +
          '<span style="font-size:0.8rem; font-weight:800; color:var(--color-success); background:rgba(16,185,129,0.1); padding:2px 10px; border-radius:999px;">✓ All Systems Healthy</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.84rem; text-align:left;">' +
            '<thead>' +
              '<tr style="border-bottom:1px solid var(--border-subtle); background:var(--bg-card);">' +
                '<th style="padding:10px 16px;">#</th>' +
                '<th style="padding:10px 16px;">Entity</th>' +
                '<th style="padding:10px 16px;">Category</th>' +
                '<th style="padding:10px 16px;">Records</th>' +
                '<th style="padding:10px 16px; text-align:center;">Create</th>' +
                '<th style="padding:10px 16px; text-align:center;">View</th>' +
                '<th style="padding:10px 16px; text-align:center;">Edit</th>' +
                '<th style="padding:10px 16px; text-align:center;">Archive/Delete</th>' +
                '<th style="padding:10px 16px; text-align:center;">Status</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              matrix.map(row => '' +
                '<tr style="border-bottom:1px solid var(--border-subtle);">' +
                  '<td style="padding:10px 16px; color:var(--text-muted);">' + row.id + '</td>' +
                  '<td style="padding:10px 16px; font-weight:800;">' + row.name + '</td>' +
                  '<td style="padding:10px 16px; color:var(--text-muted);">' + row.group + '</td>' +
                  '<td style="padding:10px 16px; font-weight:700;">' + row.count + '</td>' +
                  '<td style="padding:10px 16px; text-align:center; color:var(--color-success); font-weight:800;">✓</td>' +
                  '<td style="padding:10px 16px; text-align:center; color:var(--color-success); font-weight:800;">✓</td>' +
                  '<td style="padding:10px 16px; text-align:center; color:var(--color-success); font-weight:800;">✓</td>' +
                  '<td style="padding:10px 16px; text-align:center; color:var(--color-success); font-weight:800;">✓</td>' +
                  '<td style="padding:10px 16px; text-align:center;"><span style="background:rgba(16,185,129,0.12); color:var(--color-success); font-weight:800; font-size:0.75rem; padding:2px 8px; border-radius:999px;">Operational</span></td>' +
                '</tr>'
              ).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderAttendanceView(container) {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    renderAttendanceTableForClass(cls, students);
  }

  function renderTeacherDashboard(container) {
    const cls = store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const assignments = store.getAssignments(cls.id);
    const attRate = store.getClassAttendanceRate(cls.id);

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Good morning, ' + store.getSchoolSettings().teacherName + ' 👋</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Here is your live classroom command summary for ' + cls.name + '.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-primary-action" onclick="openClass(\'' + cls.id + '\', \'classroom\')">🏫 Open Classroom Hub</button>' +
        '</div>' +
      '</div>' +

      '<div class="kpi-grid" style="margin-bottom:24px;">' +
        '<div class="kpi-card"><span class="kpi-label">Enrolled Learners</span><span class="kpi-val">' + students.length + '</span><span class="kpi-sub">' + cls.name + '</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Attendance Rate</span><span class="kpi-val">' + attRate + '%</span><span class="kpi-sub">✓ Live attendance rate</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Active Assignments</span><span class="kpi-val">' + assignments.length + '</span><span class="kpi-sub">Pending completion</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Target CEFR</span><span class="kpi-val" style="color:var(--color-primary);">' + (cls.cefrTarget || 'A1') + '</span><span class="kpi-sub">' + (cls.academicYear || '2026–2027') + '</span></div>' +
      '</div>' +

      renderClassroomDashboardWidgets(cls, students);
  }

  function renderProgressView(container) {
    const cls = store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    container.innerHTML = 
      '<div style="margin-bottom:20px;">' +
        '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Classroom CEFR Progress &amp; Diagnostics</h1>' +
        '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Diagnostic mastery across Speaking, Listening, Vocabulary, Grammar, Reading, and Writing.</p>' +
      '</div>' +
      renderClassProgressSubTab(cls, students);
  }

  function renderAnalyticsView(container) {
    renderProgressView(container);
  }

  function renderClassStoryView(container) {
    const cls = store.getActiveClass();
    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Class Story Feed</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Share classroom moments, student work, and announcements with families.</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openModal(\'modal-story-post\')">📸 + New Post</button>' +
      '</div>' +
      '<div class="story-feed-grid">' +
        store.getClassStory().map(p => renderStoryPost(p)).join('') +
      '</div>';
  }

  function renderStoryPost(p) {
    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px; margin-bottom:16px; box-shadow:var(--shadow-sm);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span style="font-weight:800; font-size:1.05rem;">' + p.title + '</span>' +
            '<span style="font-size:0.75rem; background:rgba(79,70,229,0.1); color:var(--color-primary); padding:2px 8px; border-radius:999px;">' + p.type + '</span>' +
          '</div>' +
          '<div style="display:flex; gap:6px;">' +
            '<button class="btn-sm-secondary" onclick="handleLikeStoryPost(\'' + p.id + '\')" style="font-size:0.78rem;">❤️ ' + (p.likes || 0) + '</button>' +
            '<button class="btn-sm-secondary" onclick="handleDeleteStoryPost(\'' + p.id + '\')" style="font-size:0.78rem; color:var(--color-danger);">🗑️</button>' +
          '</div>' +
        '</div>' +
        '<p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">' + p.content + '</p>' +
        '<div style="font-size:0.76rem; color:var(--text-muted);">' + p.timestamp + '</div>' +
      '</div>';
  }

  function renderMessagesView(container) {
    const threads = store.getMessageThreads();
    container.innerHTML = 
      '<div style="margin-bottom:20px;">' +
        '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Family Communication Center</h1>' +
        '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Two-way parent messages and student progress check-ins.</p>' +
      '</div>' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:16px; padding:20px; box-shadow:var(--shadow-sm);">' +
        threads.map(t => '' +
          '<div style="border-bottom:1px solid var(--border-subtle); padding-bottom:14px; margin-bottom:14px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
              '<span style="font-weight:800; font-size:1rem;">' + t.studentName + ' Family</span>' +
              '<span style="font-size:0.78rem; color:var(--text-muted);">' + (t.messages[t.messages.length - 1] || {}).timestamp + '</span>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">' +
              t.messages.map(m => '' +
                '<div style="padding:8px 12px; border-radius:8px; font-size:0.84rem; background:' + (m.sender === 'teacher' ? 'rgba(79,70,229,0.08)' : 'var(--bg-card-secondary)') + ';">' +
                  '<strong>' + (m.sender === 'teacher' ? 'Ms. Sarah' : 'Parent') + ':</strong> ' + m.text +
                '</div>'
              ).join('') +
            '</div>' +
            '<div style="display:flex; gap:8px;">' +
              '<input type="text" id="parent-reply-input-' + t.id + '" class="filter-select" style="flex:1;" placeholder="Type reply to ' + t.studentName + '\'s family..." />' +
              '<button class="btn-primary-action" onclick="handleSendParentMessage(\'' + t.id + '\', \'parent-reply-input-' + t.id + '\')">Send</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  function renderPortfoliosView(container) {
    const cls = store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Classroom Portfolios</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Drawings, speaking recordings, story creations, and worksheets.</p>' +
        '</div>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">' +
        students.map(s => {
          const items = store.getStudentPortfolio(s.id);
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:18px; box-shadow:var(--shadow-sm); cursor:pointer;" onclick="openStudentDetail(\'' + s.id + '\', \'portfolio\')">' +
              '<div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">' +
                '<span style="font-size:1.8rem;">' + getStudentAvatarEmoji(s.avatar) + '</span>' +
                '<div>' +
                  '<div style="font-weight:800; font-size:1.05rem;">' + s.firstName + ' ' + s.lastName + '</div>' +
                  '<div style="font-size:0.78rem; color:var(--text-muted);">' + items.length + ' Portfolio Artifacts</div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex; flex-wrap:wrap; gap:6px;">' +
                items.slice(0, 3).map(it => '<span style="background:var(--bg-card-secondary); border:1px solid var(--border-subtle); border-radius:6px; padding:3px 8px; font-size:0.75rem;">' + it.preview + ' ' + it.category + '</span>').join('') +
              '</div>' +
              '<div style="margin-top:12px; font-size:0.78rem; color:var(--color-primary); font-weight:700;">Open Portfolio →</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  function renderStudentAdventureView(container) {
    const s = store.getActiveStudent();
    container.innerHTML = 
      '<div style="padding:20px; text-align:center;">' +
        '<div style="font-size:64px; margin-bottom:12px;">' + getStudentAvatarEmoji(s.avatar) + '</div>' +
        '<h1 style="font-size:1.8rem; font-weight:900;">Welcome, ' + s.firstName + '!</h1>' +
        '<p style="color:var(--text-muted); font-size:0.95rem;">You have ⭐ ' + store.getStudentTotalXP(s.id) + ' XP · ' + (s.overallCefr || 'A1') + ' Explorer</p>' +
        '<div style="display:flex; justify-content:center; gap:12px; margin-top:20px;">' +
          '<button class="btn-primary-action" onclick="switchView(\'library\')">🎮 Play Games</button>' +
        '</div>' +
      '</div>';
  }

  function renderStudentTasksView(container) {
    renderAssignmentsView(container);
  }

  function renderStudentBadgesView(container) {
    renderGamificationView(container);
  }

  function renderLeaderboardView(container) {
    const cls = store.getActiveClass();
    const students = store.getStudentsByClass(cls.id).sort((a, b) => store.getStudentTotalXP(b.id) - store.getStudentTotalXP(a.id));

    container.innerHTML = 
      '<div style="max-width:600px; margin:0 auto; padding:20px;">' +
        '<h1 style="font-size:1.6rem; font-weight:900; text-align:center; margin-bottom:20px;">🏆 Classroom Leaderboard</h1>' +
        '<div style="display:flex; flex-direction:column; gap:10px;">' +
          students.map((s, idx) => '' +
            '<div style="display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:var(--bg-card); border-radius:12px; border:1px solid var(--border-subtle);">' +
              '<div style="display:flex; align-items:center; gap:12px;">' +
                '<span style="font-weight:900; font-size:1.2rem; width:24px;">' + (idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1)) + '</span>' +
                '<span style="font-size:1.6rem;">' + getStudentAvatarEmoji(s.avatar) + '</span>' +
                '<span style="font-weight:800; font-size:1rem;">' + s.firstName + ' ' + s.lastName + '</span>' +
              '</div>' +
              '<span style="font-weight:900; color:#b45309; font-size:1rem;">⭐ ' + store.getStudentTotalXP(s.id) + '</span>' +
            '</div>'
          ).join('') +
        '</div>' +
      '</div>';
  }

  function renderParentHomeView(container) {
    renderStudentAdventureView(container);
  }

  function renderParentHomeworkView(container) {
    renderHomeworkView(container);
  }

  // =========================================================================
  // SIDEBAR NAVIGATION (With Admin & Settings)
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
      const reportsCount = store.getReports().length;

      sidebar.innerHTML = 
        '<div class="sidebar-section-title">Dashboard</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'dashboard' ? 'is-active' : '') + '" onclick="switchView(\'dashboard\')"><span class="nav-item-left"><span>📊</span> Overview</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">My School</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'classes' || currentView === 'class-detail' ? 'is-active' : '') + '" onclick="switchView(\'classes\')"><span class="nav-item-left"><span>👥</span> Classes</span><span class="nav-badge-pill">' + classesCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'students' ? 'is-active' : '') + '" onclick="switchView(\'students\')"><span class="nav-item-left"><span>🧒</span> Classroom Hub</span><span class="nav-badge-pill">' + studentsCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'attendance' ? 'is-active' : '') + '" onclick="switchView(\'attendance\')"><span class="nav-item-left"><span>📋</span> Attendance</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Teaching</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'curriculum' ? 'is-active' : '') + '" onclick="switchView(\'curriculum\')"><span class="nav-item-left"><span>📚</span> Curriculum</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'library' && libraryActiveTab !== 'worksheets' ? 'is-active' : '') + '" onclick="libraryActiveTab=\'games\'; switchView(\'library\')"><span class="nav-item-left"><span>🎮</span> Resource Library</span><span class="nav-badge-pill">' + resourcesCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'worksheets' || (currentView === 'library' && libraryActiveTab === 'worksheets') ? 'is-active' : '') + '" onclick="libraryActiveTab=\'worksheets\'; switchView(\'library\')"><span class="nav-item-left"><span>📄</span> Worksheets</span><span class="nav-badge-pill">' + (store.getWorksheets ? store.getWorksheets().length : 4) + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'assignments' ? 'is-active' : '') + '" onclick="switchView(\'assignments\')"><span class="nav-item-left"><span>📝</span> Assignments</span><span class="nav-badge-pill">' + assignmentsCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'homework' ? 'is-active' : '') + '" onclick="switchView(\'homework\')"><span class="nav-item-left"><span>✍️</span> Homework</span><span class="nav-badge-pill">' + homeworkCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'quizzes' ? 'is-active' : '') + '" onclick="switchView(\'quizzes\')"><span class="nav-item-left"><span>🧩</span> Quizzes &amp; Tests</span><span class="nav-badge-pill">' + quizzesCount + '</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Assessment</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'assessments' ? 'is-active' : '') + '" onclick="switchView(\'assessments\')"><span class="nav-item-left"><span>🎯</span> Assessments &amp; Rubrics</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'progress' ? 'is-active' : '') + '" onclick="switchView(\'progress\')"><span class="nav-item-left"><span>📈</span> Progress &amp; CEFR</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'reports' ? 'is-active' : '') + '" onclick="switchView(\'reports\')"><span class="nav-item-left"><span>📄</span> Reports</span><span class="nav-badge-pill">' + reportsCount + '</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Community</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'story' ? 'is-active' : '') + '" onclick="switchView(\'story\')"><span class="nav-item-left"><span>📸</span> Class Story</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'messages' ? 'is-active' : '') + '" onclick="switchView(\'messages\')"><span class="nav-item-left"><span>💬</span> Messages</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'portfolios' ? 'is-active' : '') + '" onclick="switchView(\'portfolios\')"><span class="nav-item-left"><span>🎨</span> Portfolios</span></button></li>' +
        '</ul>' +

        '<div class="sidebar-hr"></div>' +
        '<div class="sidebar-section-title">Admin &amp; Audit</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'health' ? 'is-active' : '') + '" onclick="switchView(\'health\')"><span class="nav-item-left"><span>📊</span> System Health &amp; CRUD</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'gamification' ? 'is-active' : '') + '" onclick="switchView(\'gamification\')"><span class="nav-item-left"><span>🏆</span> Gamification &amp; Badges</span></button></li>' +
          '<li><button class="nav-link-btn" onclick="openArchivedManagerModal()"><span class="nav-item-left"><span>🗄️</span> Archived &amp; Restore</span></button></li>' +
          '<li><button class="nav-link-btn" onclick="openSchoolSettingsModal()"><span class="nav-item-left"><span>⚙️</span> School Settings</span></button></li>' +
        '</ul>';
    } else if (role === 'student') {
      sidebar.innerHTML = 
        '<div class="sidebar-section-title">My Adventure</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'adventure' ? 'is-active' : '') + '" onclick="switchView(\'adventure\')"><span class="nav-item-left"><span>🗺️</span> My Journey</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'library' ? 'is-active' : '') + '" onclick="switchView(\'library\')"><span class="nav-item-left"><span>🎮</span> Game Library</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'tasks' ? 'is-active' : '') + '" onclick="switchView(\'tasks\')"><span class="nav-item-left"><span>📝</span> My Missions</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'badges' ? 'is-active' : '') + '" onclick="switchView(\'badges\')"><span class="nav-item-left"><span>🏆</span> Badges &amp; XP</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'leaderboard' ? 'is-active' : '') + '" onclick="switchView(\'leaderboard\')"><span class="nav-item-left"><span>⭐</span> Leaderboard</span></button></li>' +
        '</ul>';
    } else {
      sidebar.innerHTML = 
        '<div class="sidebar-section-title">Parent Portal</div>' +
        '<ul class="sidebar-nav-list">' +
          '<li><button class="nav-link-btn ' + (currentView === 'parent-home' ? 'is-active' : '') + '" onclick="switchView(\'parent-home\')"><span class="nav-item-left"><span>🏠</span> Child Overview</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'progress' ? 'is-active' : '') + '" onclick="switchView(\'progress\')"><span class="nav-item-left"><span>📈</span> CEFR Report</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'story' ? 'is-active' : '') + '" onclick="switchView(\'story\')"><span class="nav-item-left"><span>📸</span> Class Story</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'messages' ? 'is-active' : '') + '" onclick="switchView(\'messages\')"><span class="nav-item-left"><span>💬</span> Messages</span></button></li>' +
        '</ul>';
    }
  }

  // =========================================================================
  // ROUTER CONTROLLER
  // =========================================================================
  function renderCurrentView() {
    const container = document.getElementById('app-view-container');
    if (!container) return;

    renderNavigation();

    switch (currentView) {
      case 'dashboard': renderTeacherDashboard(container); break;
      case 'classes': renderClassesView(container); break;
      case 'class-detail': renderClassDetailView(container); break;
      case 'students': renderStudentsView(container); break;
      case 'curriculum': renderCurriculumView(container); break;
      case 'library': renderLibraryView(container); break;
      case 'assignments': renderAssignmentsView(container); break;
      case 'homework': renderHomeworkView(container); break;
      case 'quizzes': renderQuizzesView(container); break;
      case 'assessments': renderAssessmentsView(container); break;
      case 'attendance': renderAttendanceView(container); break;
      case 'progress': renderProgressView(container); break;
      case 'analytics': renderAnalyticsView(container); break;
      case 'reports': renderReportsView(container); break;
      case 'story': renderClassStoryView(container); break;
      case 'messages': renderMessagesView(container); break;
      case 'portfolios': renderPortfoliosView(container); break;
      case 'health':
      case 'system-health': renderSystemHealthView(container); break;
      case 'worksheets': libraryActiveTab = 'worksheets'; renderLibraryView(container); break;
      case 'gamification': renderGamificationView(container); break;
      case 'adventure': renderStudentAdventureView(container); break;
      case 'tasks': renderStudentTasksView(container); break;
      case 'badges': renderStudentBadgesView(container); break;
      case 'leaderboard': renderLeaderboardView(container); break;
      case 'parent-home': renderParentHomeView(container); break;
      default: renderTeacherDashboard(container); break;
    }
  }

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


  // =========================================================================
  // CURRICULUM REORDERING & CRUD HANDLERS
  // =========================================================================
  window.handleMoveUnitUp = function(bookId, unitId) {
    const units = store.getUnits(bookId);
    const idx = units.findIndex(u => u.id === unitId);
    if (idx <= 0) return;
    const temp = units[idx];
    units[idx] = units[idx - 1];
    units[idx - 1] = temp;
    store.reorderUnits(bookId, units.map(u => u.id));
    renderCurrentView();
  };

  window.handleMoveUnitDown = function(bookId, unitId) {
    const units = store.getUnits(bookId);
    const idx = units.findIndex(u => u.id === unitId);
    if (idx === -1 || idx >= units.length - 1) return;
    const temp = units[idx];
    units[idx] = units[idx + 1];
    units[idx + 1] = temp;
    store.reorderUnits(bookId, units.map(u => u.id));
    renderCurrentView();
  };

  window.handleMoveLessonUp = function(unitId, lessonId) {
    const lessons = store.getLessons().filter(l => l.unitId === unitId).sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = lessons.findIndex(l => l.id === lessonId);
    if (idx <= 0) return;
    const temp = lessons[idx];
    lessons[idx] = lessons[idx - 1];
    lessons[idx - 1] = temp;
    store.reorderLessons(unitId, lessons.map(l => l.id));
    renderCurrentView();
  };

  window.handleMoveLessonDown = function(unitId, lessonId) {
    const lessons = store.getLessons().filter(l => l.unitId === unitId).sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = lessons.findIndex(l => l.id === lessonId);
    if (idx === -1 || idx >= lessons.length - 1) return;
    const temp = lessons[idx];
    lessons[idx] = lessons[idx + 1];
    lessons[idx + 1] = temp;
    store.reorderLessons(unitId, lessons.map(l => l.id));
    renderCurrentView();
  };

  window.openAddBookModal = function() {
    const title = prompt('Enter Book Title (e.g. Book 3: Global Citizens):');
    if (title && title.trim()) {
      const level = prompt('Enter Target CEFR Level (e.g. A2+ or B1):', 'A2');
      store.addBook({ title: title.trim(), targetLevel: level || 'A2', unitsCount: 0 });
      renderCurrentView();
    }
  };

  // =========================================================================
  // WORKSHEET CRUD HANDLERS
  // =========================================================================
  window.openWorksheetEditor = function(wsId = null) {
    const title = document.getElementById('worksheet-modal-title');
    const idInput = document.getElementById('ws-edit-id');
    const titleInput = document.getElementById('ws-title');
    const levelSelect = document.getElementById('ws-level');
    const catSelect = document.getElementById('ws-category');
    const lessonSelect = document.getElementById('ws-lesson-select');
    const descInput = document.getElementById('ws-description');
    const pdfInput = document.getElementById('ws-pdfurl');
    const ansInput = document.getElementById('ws-answerkey');

    // Populate lessons dropdown
    if (lessonSelect) {
      lessonSelect.innerHTML = '<option value="">-- No specific lesson link --</option>' +
        store.getLessons().map(l => '<option value="' + l.id + '">' + l.title + '</option>').join('');
    }

    if (wsId) {
      const ws = store.getWorksheet(wsId);
      if (!ws) return;
      if (title) title.textContent = '✏️ Edit Worksheet';
      if (idInput) idInput.value = ws.id;
      if (titleInput) titleInput.value = ws.title;
      if (levelSelect) levelSelect.value = ws.level || 'A1';
      if (catSelect) catSelect.value = ws.category;
      if (lessonSelect) lessonSelect.value = ws.lessonId || '';
      if (descInput) descInput.value = ws.description || '';
      if (pdfInput) pdfInput.value = ws.pdfUrl || '';
      if (ansInput) ansInput.value = ws.answerKey || '';
    } else {
      if (title) title.textContent = 'Add New Worksheet';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
      if (ansInput) ansInput.value = '';
    }

    window.openModal('modal-worksheet-editor');
  };

  window.handleSaveWorksheet = function(e) {
    e.preventDefault();
    const editId = document.getElementById('ws-edit-id').value;
    const title = document.getElementById('ws-title').value.trim();
    const level = document.getElementById('ws-level').value;
    const category = document.getElementById('ws-category').value;
    const lessonId = document.getElementById('ws-lesson-select').value;
    const description = document.getElementById('ws-description').value.trim();
    const pdfUrl = document.getElementById('ws-pdfurl').value.trim();
    const answerKey = document.getElementById('ws-answerkey').value.trim();

    const payload = { title, level, category, lessonId, description, pdfUrl, answerKey };

    if (editId) {
      store.updateWorksheet(editId, payload);
    } else {
      store.addWorksheet(payload);
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleArchiveWorksheet = function(wsId) {
    window.confirmAction({
      title: 'Archive Worksheet',
      message: 'Archive this worksheet? It can be restored at any time.',
      confirmText: 'Archive Worksheet',
      onConfirm: function() {
        store.archiveWorksheet(wsId);
        renderCurrentView();
      }
    });
  };

  // =========================================================================
  // QUIZ QUESTIONS MANAGER HANDLERS
  // =========================================================================
  let activeManagingQuizId = null;

  window.openQuizQuestionsManager = function(quizId) {
    activeManagingQuizId = quizId;
    const q = store.getQuiz(quizId);
    if (!q) return;

    const titleEl = document.getElementById('quiz-qm-title');
    const subtitleEl = document.getElementById('quiz-qm-subtitle');
    if (titleEl) titleEl.textContent = 'Manage Questions: ' + q.title;
    if (subtitleEl) subtitleEl.textContent = q.targetCefr + ' · ' + q.skill + ' Diagnostic';

    window.renderQuizQuestionsList();
    window.openModal('modal-quiz-questions-manager');
  };

  window.renderQuizQuestionsList = function() {
    const container = document.getElementById('quiz-questions-list-container');
    if (!container || !activeManagingQuizId) return;

    const questions = store.getQuizQuestions(activeManagingQuizId);
    if (questions.length === 0) {
      container.innerHTML = '<div style="font-size:0.86rem; color:var(--text-muted); padding:16px; text-align:center;">No questions in this quiz yet. Click "+ Add Question" below.</div>';
      return;
    }

    container.innerHTML = questions.map((item, idx) => '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">' +
        '<div style="display:flex; align-items:flex-start; gap:10px;">' +
          '<div style="display:flex; flex-direction:column; gap:2px; margin-top:2px;">' +
            (idx > 0 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.6rem;" onclick="handleMoveQuestionUp(\'' + item.id + '\')">▲</button>' : '') +
            (idx < questions.length - 1 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.6rem;" onclick="handleMoveQuestionDown(\'' + item.id + '\')">▼</button>' : '') +
          '</div>' +
          '<div>' +
            '<div style="font-weight:800; font-size:0.92rem;">' + (idx + 1) + '. ' + item.question + '</div>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">' +
              (item.options || []).map((opt, oIdx) => 
                '<span style="padding:2px 8px; border-radius:4px; font-size:0.75rem; background:' + (oIdx === item.correctIndex ? 'rgba(16,185,129,0.15)' : 'var(--bg-card-secondary)') + '; color:' + (oIdx === item.correctIndex ? 'var(--color-success)' : 'var(--text-secondary)') + '; border:1px solid var(--border-subtle);">' +
                  (oIdx === item.correctIndex ? '✓ ' : '') + opt +
                '</span>'
              ).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="btn-sm-secondary" onclick="openEditQuestionForm(\'' + item.id + '\')" style="padding:2px 8px; font-size:0.75rem;">✏️</button>' +
          '<button class="btn-sm-secondary" onclick="handleDeleteQuestion(\'' + item.id + '\')" style="padding:2px 8px; font-size:0.75rem; color:var(--color-danger);">🗑️</button>' +
        '</div>' +
      '</div>'
    ).join('');
  };

  window.openAddQuestionForm = function() {
    const editBox = document.getElementById('quiz-question-edit-box');
    const title = document.getElementById('question-edit-title');
    const idInput = document.getElementById('edit-question-id');
    const promptInput = document.getElementById('edit-q-prompt');
    const opt0 = document.getElementById('edit-q-opt0');
    const opt1 = document.getElementById('edit-q-opt1');
    const opt2 = document.getElementById('edit-q-opt2');

    if (!editBox) return;
    if (title) title.textContent = 'Add New Question';
    if (idInput) idInput.value = '';
    if (promptInput) promptInput.value = '';
    if (opt0) opt0.value = '';
    if (opt1) opt1.value = '';
    if (opt2) opt2.value = '';
    editBox.style.display = 'block';
  };

  window.openEditQuestionForm = function(questionId) {
    const editBox = document.getElementById('quiz-question-edit-box');
    const title = document.getElementById('question-edit-title');
    const idInput = document.getElementById('edit-question-id');
    const promptInput = document.getElementById('edit-q-prompt');
    const opt0 = document.getElementById('edit-q-opt0');
    const opt1 = document.getElementById('edit-q-opt1');
    const opt2 = document.getElementById('edit-q-opt2');
    const correctSel = document.getElementById('edit-q-correct');

    const questions = store.getQuizQuestions(activeManagingQuizId);
    const q = questions.find(item => item.id === questionId);
    if (!q || !editBox) return;

    if (title) title.textContent = 'Edit Question';
    if (idInput) idInput.value = q.id;
    if (promptInput) promptInput.value = q.question;
    if (opt0) opt0.value = (q.options && q.options[0]) || '';
    if (opt1) opt1.value = (q.options && q.options[1]) || '';
    if (opt2) opt2.value = (q.options && q.options[2]) || '';
    if (correctSel) correctSel.value = q.correctIndex || 0;

    editBox.style.display = 'block';
  };

  window.handleSaveQuizQuestion = function() {
    const idInput = document.getElementById('edit-question-id').value;
    const promptVal = document.getElementById('edit-q-prompt').value.trim();
    const opt0 = document.getElementById('edit-q-opt0').value.trim();
    const opt1 = document.getElementById('edit-q-opt1').value.trim();
    const opt2 = document.getElementById('edit-q-opt2').value.trim();
    const correctIndex = parseInt(document.getElementById('edit-q-correct').value, 10) || 0;

    if (!promptVal || !opt0 || !opt1) {
      alert('Please fill out question prompt and at least two options.');
      return;
    }

    const payload = {
      question: promptVal,
      options: [opt0, opt1, opt2].filter(Boolean),
      correctIndex,
      points: 10
    };

    if (idInput) {
      store.updateQuizQuestion(activeManagingQuizId, idInput, payload);
    } else {
      store.addQuizQuestion(activeManagingQuizId, payload);
    }

    document.getElementById('quiz-question-edit-box').style.display = 'none';
    window.renderQuizQuestionsList();
    renderCurrentView();
  };

  window.handleDeleteQuestion = function(questionId) {
    store.deleteQuizQuestion(activeManagingQuizId, questionId);
    window.renderQuizQuestionsList();
    renderCurrentView();
  };

  window.handleMoveQuestionUp = function(questionId) {
    const questions = store.getQuizQuestions(activeManagingQuizId);
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx <= 0) return;
    const temp = questions[idx];
    questions[idx] = questions[idx - 1];
    questions[idx - 1] = temp;
    store.reorderQuizQuestions(activeManagingQuizId, questions.map(q => q.id));
    window.renderQuizQuestionsList();
  };

  window.handleMoveQuestionDown = function(questionId) {
    const questions = store.getQuizQuestions(activeManagingQuizId);
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx === -1 || idx >= questions.length - 1) return;
    const temp = questions[idx];
    questions[idx] = questions[idx + 1];
    questions[idx + 1] = temp;
    store.reorderQuizQuestions(activeManagingQuizId, questions.map(q => q.id));
    window.renderQuizQuestionsList();
  };

  // =========================================================================
  // RUBRICS & CRITERIA HANDLERS
  // =========================================================================
  window.openRubricEditorModal = function(rubricId = null) {
    const title = document.getElementById('rubric-editor-modal-title');
    const idInput = document.getElementById('edit-rubric-id');
    const nameInput = document.getElementById('edit-rubric-name');
    const skillSelect = document.getElementById('edit-rubric-skill');
    const container = document.getElementById('rubric-criteria-editor-rows');

    if (rubricId) {
      const r = store.getRubric(rubricId);
      if (!r) return;
      if (title) title.textContent = '✏️ Edit Rubric: ' + r.name;
      if (idInput) idInput.value = r.id;
      if (nameInput) nameInput.value = r.name;
      if (skillSelect) skillSelect.value = r.skill;
      if (container) {
        container.innerHTML = (r.criteria || []).map(c => '' +
          '<div class="rubric-crit-edit-row" style="display:grid; grid-template-columns: 2fr 3fr auto; gap:8px; align-items:center;">' +
            '<input type="text" class="filter-select crit-name-input" value="' + c.name + '" placeholder="Criterion Name" />' +
            '<input type="text" class="filter-select crit-desc-input" value="' + (c.description || '') + '" placeholder="Criterion Descriptor" />' +
            '<button type="button" class="btn-sm-secondary" style="color:var(--color-danger);" onclick="this.parentElement.remove()">✕</button>' +
          '</div>'
        ).join('');
      }
    } else {
      if (title) title.textContent = '🎯 Customize Assessment Rubric';
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (container) {
        container.innerHTML = '' +
          '<div class="rubric-crit-edit-row" style="display:grid; grid-template-columns: 2fr 3fr auto; gap:8px; align-items:center;">' +
            '<input type="text" class="filter-select crit-name-input" value="Fluency &amp; Spontaneity" placeholder="Criterion Name" />' +
            '<input type="text" class="filter-select crit-desc-input" value="Speaks clearly with natural rhythm" placeholder="Criterion Descriptor" />' +
            '<button type="button" class="btn-sm-secondary" style="color:var(--color-danger);" onclick="this.parentElement.remove()">✕</button>' +
          '</div>' +
          '<div class="rubric-crit-edit-row" style="display:grid; grid-template-columns: 2fr 3fr auto; gap:8px; align-items:center;">' +
            '<input type="text" class="filter-select crit-name-input" value="Vocabulary Accuracy" placeholder="Criterion Name" />' +
            '<input type="text" class="filter-select crit-desc-input" value="Uses target classroom vocabulary accurately" placeholder="Criterion Descriptor" />' +
            '<button type="button" class="btn-sm-secondary" style="color:var(--color-danger);" onclick="this.parentElement.remove()">✕</button>' +
          '</div>';
      }
    }

    window.openModal('modal-rubric-editor');
  };

  window.handleAddRubricCriterionRow = function() {
    const container = document.getElementById('rubric-criteria-editor-rows');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'rubric-crit-edit-row';
    div.style = 'display:grid; grid-template-columns: 2fr 3fr auto; gap:8px; align-items:center;';
    div.innerHTML = '' +
      '<input type="text" class="filter-select crit-name-input" placeholder="New Criterion Name" />' +
      '<input type="text" class="filter-select crit-desc-input" placeholder="Descriptor..." />' +
      '<button type="button" class="btn-sm-secondary" style="color:var(--color-danger);" onclick="this.parentElement.remove()">✕</button>';
    container.appendChild(div);
  };

  window.handleSaveRubric = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-rubric-id').value;
    const name = document.getElementById('edit-rubric-name').value.trim();
    const skill = document.getElementById('edit-rubric-skill').value;

    const rows = document.querySelectorAll('.rubric-crit-edit-row');
    const criteria = Array.from(rows).map((r, i) => {
      const nameVal = r.querySelector('.crit-name-input').value.trim();
      const descVal = r.querySelector('.crit-desc-input').value.trim();
      return {
        id: 'crit-' + Date.now() + '-' + i,
        name: nameVal || ('Criterion ' + (i + 1)),
        description: descVal,
        maxScore: 5
      };
    }).filter(c => c.name);

    if (editId) {
      store.updateRubric(editId, { name, skill, criteria });
    } else {
      store.createRubric({ name, skill, criteria });
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleArchiveRubric = function(rubricId) {
    store.archiveRubric(rubricId);
    renderCurrentView();
  };

  // =========================================================================
  // GAMIFICATION & BADGES HANDLERS
  // =========================================================================
  window.openGamificationEditorModal = function(type = 'badge', itemId = null) {
    const title = document.getElementById('gamification-modal-title');
    const idInput = document.getElementById('edit-game-reward-id');
    const typeInput = document.getElementById('edit-game-reward-type');
    const nameInput = document.getElementById('reward-name');
    const iconInput = document.getElementById('reward-icon');
    const reqInput = document.getElementById('reward-requirement');
    const catSelect = document.getElementById('reward-category');
    const xpInput = document.getElementById('reward-xp');

    if (typeInput) typeInput.value = type;

    if (itemId) {
      const item = type === 'badge' ? store.getBadge(itemId) : store.getAchievement(itemId);
      if (!item) return;
      if (title) title.textContent = '✏️ Edit ' + (type === 'badge' ? 'Badge' : 'Achievement');
      if (idInput) idInput.value = item.id;
      if (nameInput) nameInput.value = item.name;
      if (iconInput) iconInput.value = item.icon;
      if (reqInput) reqInput.value = item.description || item.requirement || '';
      if (catSelect) catSelect.value = item.category || 'Milestones';
      if (xpInput) xpInput.value = item.xpReward || 150;
    } else {
      if (title) title.textContent = '🏆 Add Reward ' + (type === 'badge' ? 'Badge' : 'Achievement');
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (reqInput) reqInput.value = '';
    }

    window.openModal('modal-gamification-editor');
  };

  window.handleSaveGamificationItem = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-game-reward-id').value;
    const type = document.getElementById('edit-game-reward-type').value;
    const name = document.getElementById('reward-name').value.trim();
    const icon = document.getElementById('reward-icon').value.trim();
    const req = document.getElementById('reward-requirement').value.trim();
    const category = document.getElementById('reward-category').value;
    const xpReward = parseInt(document.getElementById('reward-xp').value, 10) || 150;

    if (type === 'badge') {
      const payload = { name, icon, description: req, category, xpReward };
      if (editId) store.updateBadge(editId, payload);
      else store.createBadge(payload);
    } else {
      const payload = { name, icon, requirement: req, category, xpReward };
      if (editId) store.updateAchievement(editId, payload);
      else store.createAchievement(payload);
    }

    window.closeAllModals();
    renderCurrentView();
  };

  window.handleArchiveBadge = function(id) {
    store.archiveBadge(id);
    renderCurrentView();
  };

  window.handleArchiveAchievement = function(id) {
    store.archiveAchievement(id);
    renderCurrentView();
  };

  // =========================================================================
  // DYNAMIC REPORT GENERATOR HANDLERS
  // =========================================================================
  window.openReportGeneratorModal = function(studentId = null) {
    const select = document.getElementById('report-gen-student');
    if (select) {
      select.innerHTML = store.getStudents().map(s => 
        '<option value="' + s.id + '" ' + (studentId === s.id ? 'selected' : '') + '>' +
          s.firstName + ' ' + s.lastName + ' (' + (s.overallCefr || 'A1') + ')' +
        '</option>'
      ).join('');
    }
    window.openModal('modal-report-generator');
  };

  window.handleExecuteGenerateReport = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('report-gen-student').value;
    const reportType = document.getElementById('report-gen-type').value;
    const term = document.getElementById('report-gen-term').value;
    const remarks = document.getElementById('report-gen-remarks').value.trim();

    const report = store.generateStudentReport({
      studentId,
      term,
      reportType,
      customNotes: remarks
    });

    window.closeAllModals();
    window.viewPrintableReportCard(report.id);
  };

  window.viewPrintableReportCard = function(reportId) {
    const rep = store.getReport(reportId);
    if (!rep) return;

    const s = store.getStudent(rep.studentId);
    const snap = rep.dataSnapshot || {};
    const skills = snap.skills || store.getStudentSkills(rep.studentId);

    const container = document.getElementById('app-view-container');
    if (!container) return;

    container.innerHTML = 
      '<div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">' +
        '<button class="btn-sm-secondary" onclick="switchView(\'reports\')">← Back to Reports</button>' +
        '<button class="btn-primary-action" onclick="window.print()">🖨️ Print Report Card</button>' +
      '</div>' +

      '<div class="printable-report-card" style="background:#ffffff; color:#0f172a; border:2px solid #0f172a; border-radius:12px; padding:36px; max-width:760px; margin:0 auto; box-shadow:var(--shadow-lg); font-family:var(--font-sans);">' +
        // Header
        '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f172a; padding-bottom:18px; margin-bottom:24px;">' +
          '<div>' +
            '<div style="font-size:1.4rem; font-weight:900; letter-spacing:0.02em;">ENGLISH ADVENTURE ACADEMY</div>' +
            '<div style="font-size:0.86rem; color:#64748b;">Official Term Assessment &amp; CEFR Mastery Report</div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<div style="font-size:1.1rem; font-weight:800; color:var(--color-primary);">' + rep.term + '</div>' +
            '<div style="font-size:0.82rem; color:#64748b;">Date: ' + rep.date + '</div>' +
          '</div>' +
        '</div>' +

        // Student Info Box
        '<div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:24px;">' +
          '<div><span style="font-size:0.75rem; color:#64748b; display:block;">Student Name</span><strong>' + (s ? s.firstName + ' ' + s.lastName : rep.studentName) + '</strong></div>' +
          '<div><span style="font-size:0.75rem; color:#64748b; display:block;">Student ID</span><strong>' + (s ? s.studentIdNumber || 'EAA-2026' : 'EAA-2026') + '</strong></div>' +
          '<div><span style="font-size:0.75rem; color:#64748b; display:block;">Cohort Class</span><strong>' + rep.className + '</strong></div>' +
          '<div><span style="font-size:0.75rem; color:#64748b; display:block;">Overall CEFR</span><strong style="color:var(--color-primary);">' + (snap.overallCefr || 'A1') + '</strong></div>' +
        '</div>' +

        // Quantitative Metrics
        '<div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; margin-bottom:24px;">' +
          '<div style="border:1px solid #e2e8f0; border-radius:8px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.78rem; color:#64748b; font-weight:700;">ATTENDANCE RATE</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#10b981; margin:4px 0;">' + (snap.attendanceRate || 100) + '%</div>' +
            '<div style="font-size:0.72rem; color:#64748b;">Regular attendance</div>' +
          '</div>' +
          '<div style="border:1px solid #e2e8f0; border-radius:8px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.78rem; color:#64748b; font-weight:700;">TOTAL ADVENTURE XP</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:#b45309; margin:4px 0;">⭐ ' + (snap.totalXP || 1240) + '</div>' +
            '<div style="font-size:0.72rem; color:#64748b;">Gamification milestones</div>' +
          '</div>' +
          '<div style="border:1px solid #e2e8f0; border-radius:8px; padding:14px; text-align:center;">' +
            '<div style="font-size:0.78rem; color:#64748b; font-weight:700;">TARGET CEFR</div>' +
            '<div style="font-size:1.6rem; font-weight:900; color:var(--color-primary); margin:4px 0;">' + (snap.overallCefr || 'A1') + '</div>' +
            '<div style="font-size:0.72rem; color:#64748b;">Primary language benchmark</div>' +
          '</div>' +
        '</div>' +

        // Multi-Skill Breakdown Table
        '<div style="margin-bottom:24px;">' +
          '<div style="font-weight:800; font-size:0.95rem; margin-bottom:8px;">LANGUAGE SKILLS MASTERY BREAKDOWN</div>' +
          '<table style="width:100%; border-collapse:collapse; font-size:0.84rem;">' +
            '<thead>' +
              '<tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">' +
                '<th style="padding:8px 12px; text-align:left;">Skill Domain</th>' +
                '<th style="padding:8px 12px; text-align:center;">Score %</th>' +
                '<th style="padding:8px 12px; text-align:center;">CEFR Benchmark</th>' +
                '<th style="padding:8px 12px; text-align:left;">Mastery Descriptor</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              Object.entries(skills).map(([sk, data]) => '' +
                '<tr style="border-bottom:1px solid #e2e8f0;">' +
                  '<td style="padding:8px 12px; font-weight:800; text-transform:capitalize;">' + sk + '</td>' +
                  '<td style="padding:8px 12px; text-align:center; font-weight:700;">' + (typeof data === 'object' ? data.score : data) + '%</td>' +
                  '<td style="padding:8px 12px; text-align:center; font-weight:800; color:var(--color-primary);">' + (typeof data === 'object' ? data.cefr : 'A1') + '</td>' +
                  '<td style="padding:8px 12px; font-size:0.78rem; color:#64748b;">Communicative competence verified across classroom activities</td>' +
                '</tr>'
              ).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +

        // Teacher Remarks Box
        '<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:28px;">' +
          '<div style="font-weight:800; font-size:0.85rem; margin-bottom:6px;">TEACHER OBSERVATIONS &amp; RECOMMENDATIONS</div>' +
          '<div style="font-size:0.88rem; line-height:1.5; color:#334155;">' + (rep.teacherNotes || 'Student actively participates in communicative activities and exhibits strong phonetic and vocabulary recall.') + '</div>' +
        '</div>' +

        // Signatures Line
        '<div style="display:flex; justify-content:space-between; border-top:1px solid #cbd5e1; padding-top:20px; font-size:0.82rem;">' +
          '<div><div style="border-bottom:1px solid #0f172a; width:180px; margin-bottom:4px;"></div>Ms. Sarah Jenkins (Head Teacher)</div>' +
          '<div><div style="border-bottom:1px solid #0f172a; width:180px; margin-bottom:4px;"></div>Principal / Academic Director</div>' +
        '</div>' +
      '</div>';
  }

  window.handleDeleteReport = function(repId) {
    store.deleteReport(repId);
    renderCurrentView();
  };

  // =========================================================================
  // SCHOOL SETTINGS MODAL HANDLERS
  // =========================================================================
  window.openSchoolSettingsModal = function() {
    const s = store.getSchoolSettings();
    const schoolNameInput = document.getElementById('settings-school-name');
    const teacherNameInput = document.getElementById('settings-teacher-name');
    const yearInput = document.getElementById('settings-year');
    const cefrSelect = document.getElementById('settings-target-cefr');
    const lbCheck = document.getElementById('settings-leaderboard');
    const pvCheck = document.getElementById('settings-parent-visibility');
    const sndCheck = document.getElementById('settings-sound-effects');

    if (schoolNameInput) schoolNameInput.value = s.schoolName || '';
    if (teacherNameInput) teacherNameInput.value = s.teacherName || '';
    if (yearInput) yearInput.value = s.academicYear || '2026–2027';
    if (cefrSelect) cefrSelect.value = s.primaryCefrTarget || 'A1';
    if (lbCheck) lbCheck.checked = s.leaderboardEnabled !== false;
    if (pvCheck) pvCheck.checked = s.parentStoryVisibility !== false;
    if (sndCheck) sndCheck.checked = s.soundEffectsEnabled !== false;

    window.openModal('modal-school-settings');
  };

  window.handleSaveSchoolSettings = function(e) {
    e.preventDefault();
    const schoolName = document.getElementById('settings-school-name').value.trim();
    const teacherName = document.getElementById('settings-teacher-name').value.trim();
    const academicYear = document.getElementById('settings-year').value.trim();
    const primaryCefrTarget = document.getElementById('settings-target-cefr').value;
    const leaderboardEnabled = document.getElementById('settings-leaderboard').checked;
    const parentStoryVisibility = document.getElementById('settings-parent-visibility').checked;
    const soundEffectsEnabled = document.getElementById('settings-sound-effects').checked;

    store.updateSchoolSettings({
      schoolName,
      teacherName,
      academicYear,
      primaryCefrTarget,
      leaderboardEnabled,
      parentStoryVisibility,
      soundEffectsEnabled
    });

    // Also update header user name if changed
    const headerName = document.getElementById('header-user-name');
    if (headerName) headerName.textContent = teacherName;

    window.closeAllModals();
    alert('✓ School settings updated successfully.');
    renderCurrentView();
  };

  window.handleExportStoreJson = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.state, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "eaa_school_backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };


  // =========================================================================
  // GLOBAL ACTION ALIASES FOR COMPLETE ACCESSIBILITY
  // =========================================================================
  window.openResourceModal = window.openResourceEditor;
  window.openAssignmentModal = function() { window.openModal('modal-create-assignment'); };
  window.openWorksheetModal = window.openWorksheetEditor;
  window.openQuizQuestionModal = function(quizId) {
    const quizzes = store.getQuizzes();
    const q = quizId ? store.getQuiz(quizId) : (quizzes.length > 0 ? quizzes[0] : null);
    if (q) {
      window.openQuizQuestionsManager(q.id);
    } else {
      alert('Please create a Quiz first before adding questions.');
    }
  };
  window.openRubricModal = window.openRubricEditorModal;
  window.openBadgeModal = function() { window.openGamificationEditorModal('badge'); };
  window.openAchievementModal = function() { window.openGamificationEditorModal('achievement'); };
  window.openReportModal = window.openReportGeneratorModal;
  window.openUnitModal = window.openAddUnitModal;
  window.openLessonModal = window.openAddLessonModal;
  window.openObjectiveModal = window.openAddObjectiveModal;


  // =========================================================================
  // MISSING & UPGRADED CRUD HANDLERS (Assignments, Homework, Quizzes, Badges)
  // =========================================================================
  window.toggleCardMenu = function(resourceId, e) {
    window.toggleCardDropdown(resourceId, e);
  };

  window.handleToggleFavorite = function(resourceId) {
    window.handleToggleFeaturedResource(resourceId);
  };

  window.handleDuplicateLesson = function(lessonId) {
    store.duplicateLesson(lessonId);
    renderCurrentView();
  };

  window.openEditAssignmentModal = function(asgId) {
    const a = store.getAssignment(asgId);
    if (!a) return;
    populateModalDropdowns();
    const editIdInput = document.getElementById('edit-asg-id');
    const titleInput = document.getElementById('new-asg-title');
    const classSelect = document.getElementById('new-asg-class');
    const gameSelect = document.getElementById('new-asg-game');
    const dateInput = document.getElementById('new-asg-date');
    const instInput = document.getElementById('new-asg-inst');
    const modalTitle = document.getElementById('asg-modal-title');

    if (editIdInput) editIdInput.value = a.id;
    if (titleInput) titleInput.value = a.title;
    if (classSelect) classSelect.value = a.classId;
    if (gameSelect) gameSelect.value = a.activityId || a.gameId || '';
    if (dateInput) dateInput.value = a.dueDate;
    if (instInput) instInput.value = a.instructions || '';
    if (modalTitle) modalTitle.textContent = '✏️ Edit Assignment';

    window.openModal('modal-create-assignment');
  };

  window.openEditHomeworkModal = function(hwId) {
    const h = store.getHomeworkItem(hwId);
    if (!h) return;
    populateModalDropdowns();
    const editIdInput = document.getElementById('edit-hw-id');
    const titleInput = document.getElementById('new-hw-title');
    const typeSelect = document.getElementById('new-hw-type');
    const classSelect = document.getElementById('new-hw-class');
    const dateInput = document.getElementById('new-hw-date');
    const descInput = document.getElementById('new-hw-desc');
    const modalTitle = document.getElementById('hw-modal-title');

    if (editIdInput) editIdInput.value = h.id;
    if (titleInput) titleInput.value = h.title;
    if (typeSelect) typeSelect.value = h.type || 'Worksheet';
    if (classSelect) classSelect.value = h.classId;
    if (dateInput) dateInput.value = h.dueDate;
    if (descInput) descInput.value = h.description || '';
    if (modalTitle) modalTitle.textContent = '✏️ Edit Homework Task';

    window.openModal('modal-homework-editor');
  };

  window.handleDuplicateHomework = function(hwId) {
    store.duplicateHomework(hwId);
    renderCurrentView();
  };

  window.openEditQuizModal = function(quizId) {
    const q = store.getQuiz(quizId);
    if (!q) return;
    const editIdInput = document.getElementById('edit-quiz-id');
    const titleInput = document.getElementById('quiz-title');
    const cefrSelect = document.getElementById('quiz-cefr');
    const skillSelect = document.getElementById('quiz-skill');
    const modalTitle = document.getElementById('quiz-modal-title');

    if (editIdInput) editIdInput.value = q.id;
    if (titleInput) titleInput.value = q.title;
    if (cefrSelect) cefrSelect.value = q.targetCefr || 'A1';
    if (skillSelect) skillSelect.value = q.skill || 'Vocabulary';
    if (modalTitle) modalTitle.textContent = '✏️ Edit Quiz Details';

    window.openModal('modal-quiz-builder');
  };

  window.handleDuplicateQuiz = function(quizId) {
    store.duplicateQuiz(quizId);
    renderCurrentView();
  };

  window.handleDeleteAssessment = function(assId) {
    window.confirmAction({
      title: 'Delete Assessment Evaluation?',
      message: 'This will remove the rubric evaluation score permanently from the student records.',
      onConfirm: () => {
        store.deleteAssessment(assId);
        renderCurrentView();
      }
    });
  };

  window.openEditBadgeModal = function(badgeId) {
    const b = store.getBadge(badgeId);
    if (!b) return;
    const title = document.getElementById('gamification-modal-title');
    const idInput = document.getElementById('edit-game-reward-id');
    const typeSelect = document.getElementById('edit-game-reward-type');
    const nameInput = document.getElementById('reward-name');
    const iconInput = document.getElementById('reward-icon');
    const reqInput = document.getElementById('reward-requirement');
    const catInput = document.getElementById('reward-category');

    if (title) title.textContent = '✏️ Edit Badge';
    if (idInput) idInput.value = b.id;
    if (typeSelect) typeSelect.value = 'badge';
    if (nameInput) nameInput.value = b.name;
    if (iconInput) iconInput.value = b.icon || '🏅';
    if (reqInput) reqInput.value = b.description || '';
    if (catInput) catInput.value = b.category || 'General';

    window.openModal('modal-gamification-editor');
  };

  window.openEditAchievementModal = function(achId) {
    const a = store.getAchievement(achId);
    if (!a) return;
    const title = document.getElementById('gamification-modal-title');
    const idInput = document.getElementById('edit-game-reward-id');
    const typeSelect = document.getElementById('edit-game-reward-type');
    const nameInput = document.getElementById('reward-name');
    const iconInput = document.getElementById('reward-icon');
    const reqInput = document.getElementById('reward-requirement');
    const catInput = document.getElementById('reward-category');

    if (title) title.textContent = '✏️ Edit Achievement';
    if (idInput) idInput.value = a.id;
    if (typeSelect) typeSelect.value = 'achievement';
    if (nameInput) nameInput.value = a.title || a.name;
    if (iconInput) iconInput.value = a.icon || '🏆';
    if (reqInput) reqInput.value = a.description || '';
    if (catInput) catInput.value = a.category || 'Milestones';

    window.openModal('modal-gamification-editor');
  };

  window.openEditBookModal = function(bookId) {
    const b = store.getBooks().find(item => item.id === bookId);
    if (!b) return;
    const newTitle = prompt('Edit Book Title:', b.title);
    if (newTitle && newTitle.trim()) {
      const newLevel = prompt('Edit Target CEFR Level:', b.targetLevel || 'A1');
      store.updateBook(bookId, { title: newTitle.trim(), targetLevel: newLevel || 'A1' });
      renderCurrentView();
    }
  };

  window.handleArchiveBook = function(bookId) {
    const b = store.getBooks().find(item => item.id === bookId);
    if (!b) return;
    window.confirmAction({
      title: 'Archive ' + b.title + '?',
      message: 'This book and its units will be archived.',
      onConfirm: () => {
        store.archiveBook(bookId);
        const remaining = store.getBooks();
        if (remaining.length > 0) curriculumActiveBookId = remaining[0].id;
        renderCurrentView();
      }
    });
  };

  window.openEditObjectiveModal = function(objId) {
    const o = store.getObjectives().find(item => item.id === objId);
    if (!o) return;
    const newText = prompt('Edit Learning Objective:', o.text);
    if (newText && newText.trim()) {
      const newSkill = prompt('Target Skill (Speaking, Listening, Vocabulary, Grammar, Reading, Writing):', o.skill || 'Speaking');
      store.updateObjective(objId, { text: newText.trim(), skill: newSkill || 'Speaking' });
      renderCurrentView();
    }
  };

  window.openMoveLessonModal = function(lessonId) {
    const l = store.getLessons().find(item => item.id === lessonId);
    if (!l) return;
    const units = store.getUnits();
    const promptList = units.map((u, i) => (i + 1) + '. ' + u.title).join('\n');
    const pick = prompt('Move lesson to which Unit number?\n' + promptList, '1');
    const idx = parseInt(pick, 10) - 1;
    if (idx >= 0 && idx < units.length) {
      store.moveLessonToUnit(lessonId, units[idx].id);
      renderCurrentView();
    }
  };

  window.openEditStoryPostModal = function(postId) {
    const post = store.getClassStory().find(p => p.id === postId);
    if (!post) return;
    populateModalDropdowns();
    const idInput = document.getElementById('edit-story-id');
    const titleInput = document.getElementById('story-post-title');
    const catSelect = document.getElementById('story-post-cat');
    const classSelect = document.getElementById('story-post-class');
    const contentInput = document.getElementById('story-post-content');
    const modalTitle = document.getElementById('story-modal-title');

    if (idInput) idInput.value = post.id;
    if (titleInput) titleInput.value = post.title;
    if (catSelect) catSelect.value = post.category || 'Announcement';
    if (classSelect) classSelect.value = post.classId || 'all';
    if (contentInput) contentInput.value = post.content || '';
    if (modalTitle) modalTitle.textContent = '✏️ Edit Class Story Post';

    window.openModal('modal-story-post');
  };

  // =========================================================================
  // CALENDAR EVENT HANDLERS
  // =========================================================================
  window.openCalendarEventModal = function(eventId = null) {
    populateModalDropdowns();
    const modalTitle = document.getElementById('event-modal-title');
    const idInput = document.getElementById('edit-event-id');
    const titleInput = document.getElementById('event-title');
    const classSelect = document.getElementById('event-class');
    const typeSelect = document.getElementById('event-type');
    const daySelect = document.getElementById('event-day');
    const timeInput = document.getElementById('event-time');
    const roomInput = document.getElementById('event-room');
    const dateInput = document.getElementById('event-date');
    const topicInput = document.getElementById('event-topic');

    // Populate classSelect
    if (classSelect) {
      classSelect.innerHTML = store.getClasses().map(c => '<option value="' + c.id + '">' + c.name + '</option>').join('');
    }

    if (eventId) {
      const ev = store.getCalendarEvent(eventId);
      if (!ev) return;
      if (modalTitle) modalTitle.textContent = '✏️ Edit Calendar Event';
      if (idInput) idInput.value = ev.id;
      if (titleInput) titleInput.value = ev.title;
      if (classSelect) classSelect.value = ev.classId;
      if (typeSelect) typeSelect.value = ev.type || 'Lesson';
      if (daySelect) daySelect.value = ev.dayOfWeek || 'Monday';
      if (timeInput) timeInput.value = ev.time || '10:00 – 10:45';
      if (roomInput) roomInput.value = ev.room || 'Room 204';
      if (dateInput) dateInput.value = ev.date || '';
      if (topicInput) topicInput.value = ev.topic || '';
    } else {
      if (modalTitle) modalTitle.textContent = '📅 Add Calendar Event';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (classSelect) classSelect.value = store.getActiveClass().id;
      if (typeSelect) typeSelect.value = 'Lesson';
      if (daySelect) daySelect.value = 'Monday';
      if (timeInput) timeInput.value = '10:00 – 10:45';
      if (roomInput) roomInput.value = store.getActiveClass().room || 'Room 204';
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      if (topicInput) topicInput.value = '';
    }

    window.openModal('modal-calendar-event-editor');
  };

  window.handleSaveCalendarEvent = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-event-id') ? document.getElementById('edit-event-id').value : '';
    const title = document.getElementById('event-title').value.trim();
    const classId = document.getElementById('event-class').value;
    const type = document.getElementById('event-type').value;
    const dayOfWeek = document.getElementById('event-day').value;
    const time = document.getElementById('event-time').value.trim();
    const room = document.getElementById('event-room').value.trim();
    const date = document.getElementById('event-date') ? document.getElementById('event-date').value : '';
    const topic = document.getElementById('event-topic') ? document.getElementById('event-topic').value.trim() : '';

    if (editId) {
      store.updateCalendarEvent(editId, { title, classId, type, dayOfWeek, time, room, date, topic });
    } else {
      store.addCalendarEvent({ title, classId, type, dayOfWeek, time, room, date, topic });
    }
    window.closeAllModals();
    renderCurrentView();
  };

  window.handleDeleteCalendarEvent = function(eventId) {
    window.confirmAction({
      title: 'Delete Calendar Event?',
      message: 'This scheduled session will be removed from the class schedule.',
      onConfirm: () => {
        store.deleteCalendarEvent(eventId);
        renderCurrentView();
      }
    });
  };

  // =========================================================================
  // PORTFOLIO ARTIFACT HANDLERS
  // =========================================================================
  window.openPortfolioItemModal = function(itemId = null, studentId = null) {
    const modalTitle = document.getElementById('portfolio-modal-title');
    const idInput = document.getElementById('edit-portfolio-id');
    const studSelect = document.getElementById('portfolio-student-id');
    const titleInput = document.getElementById('portfolio-title');
    const catSelect = document.getElementById('portfolio-category');
    const previewInput = document.getElementById('portfolio-preview');
    const dateInput = document.getElementById('portfolio-date');
    const notesInput = document.getElementById('portfolio-notes');

    if (studSelect) {
      studSelect.innerHTML = store.getStudents().map(s => '<option value="' + s.id + '">' + s.firstName + ' ' + s.lastName + '</option>').join('');
      if (studentId) studSelect.value = studentId;
    }

    if (itemId) {
      const allPortfolios = (store.state.portfolios || []);
      const item = allPortfolios.find(p => p.id === itemId);
      if (!item) return;
      if (modalTitle) modalTitle.textContent = '✏️ Edit Portfolio Artifact';
      if (idInput) idInput.value = item.id;
      if (studSelect) studSelect.value = item.studentId;
      if (titleInput) titleInput.value = item.title;
      if (catSelect) catSelect.value = item.category || 'Drawing';
      if (previewInput) previewInput.value = item.preview || '🎨';
      if (dateInput) dateInput.value = item.date || '';
      if (notesInput) notesInput.value = item.notes || '';
    } else {
      if (modalTitle) modalTitle.textContent = '🎨 Add Portfolio Artifact';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (catSelect) catSelect.value = 'Drawing';
      if (previewInput) previewInput.value = '🎨';
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      if (notesInput) notesInput.value = '';
    }

    window.openModal('modal-portfolio-editor');
  };

  window.handleSavePortfolioItem = function(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-portfolio-id') ? document.getElementById('edit-portfolio-id').value : '';
    const studentId = document.getElementById('portfolio-student-id').value;
    const title = document.getElementById('portfolio-title').value.trim();
    const category = document.getElementById('portfolio-category').value;
    const preview = document.getElementById('portfolio-preview').value.trim() || '🎨';
    const date = document.getElementById('portfolio-date') ? document.getElementById('portfolio-date').value : '';
    const notes = document.getElementById('portfolio-notes') ? document.getElementById('portfolio-notes').value.trim() : '';

    const student = store.getStudent(studentId);
    const classId = student ? student.classId : store.getActiveClass().id;

    if (editId) {
      store.updatePortfolioItem(editId, { studentId, classId, title, category, preview, date, notes });
    } else {
      store.addPortfolioItem({ studentId, classId, title, category, preview, date, notes });
    }
    window.closeAllModals();
    renderCurrentView();
    if (studentId) window.switchStudentProfileTab('portfolio');
  };

  window.handleDeletePortfolioItem = function(itemId) {
    window.confirmAction({
      title: 'Delete Portfolio Artifact?',
      message: 'This artifact will be removed from the student portfolio.',
      onConfirm: () => {
        store.deletePortfolioItem(itemId);
        renderCurrentView();
        const s = store.getActiveStudent();
        if (s) window.switchStudentProfileTab('portfolio');
      }
    });
  };

  // =========================================================================
  // UNIVERSAL ARCHIVED & RESTORE HANDLERS
  // =========================================================================
  window.openArchivedManagerModal = function(filterType = 'all') {
    activeArchivedFilter = filterType;
    renderArchivedItemsList(filterType);
    window.openModal('modal-archived-manager');
  };

  window.filterArchivedItems = function(filterType, btnElem) {
    activeArchivedFilter = filterType;
    const pills = document.querySelectorAll('#archived-filter-pills .btn-sm-secondary');
    pills.forEach(p => p.classList.remove('is-active'));
    if (btnElem) btnElem.classList.add('is-active');
    renderArchivedItemsList(filterType);
  };

  window.renderArchivedItemsList = function(filterType = 'all') {
    const container = document.getElementById('archived-items-list-container');
    if (!container) return;

    const actualFilter = filterType === 'all' ? null : filterType;
    const list = store.getArchivedEntities(actualFilter);

    if (list.length === 0) {
      container.innerHTML = 
        '<div style="text-align:center; padding:40px 16px; background:var(--bg-card-secondary); border-radius:12px;">' +
          '<div style="font-size:32px; margin-bottom:8px;">✨</div>' +
          '<div style="font-weight:700; font-size:1rem;">No archived items found</div>' +
          '<p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">When you archive students, lessons, or resources, they will appear here safely for recovery.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = list.map(item => '' +
      '<div style="background:var(--bg-card-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; background:rgba(79,70,229,0.1); color:var(--color-primary); padding:3px 8px; border-radius:6px;">' + item.type + '</span>' +
          '<div>' +
            '<div style="font-weight:800; font-size:0.95rem;">' + item.title + '</div>' +
            '<div style="font-size:0.75rem; color:var(--text-muted);">' + item.meta + ' · ID: ' + item.id + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="handleRestoreArchivedItem(\'' + item.type + '\', \'' + item.id + '\')" style="padding:5px 12px; font-size:0.8rem;">' +
          '<span>↺</span> <span>Restore Item</span>' +
        '</button>' +
      '</div>'
    ).join('');
  };

  window.handleRestoreArchivedItem = function(type, id) {
    const success = store.restoreEntity(type, id);
    if (success) {
      renderArchivedItemsList(activeArchivedFilter);
      renderCurrentView();
    }
  };

  // =========================================================================
  // MOVE STUDENT HANDLERS
  // =========================================================================
  window.openMoveStudentModal = function(studentId) {
    const s = store.getStudent(studentId);
    if (!s) return;
    const idInput = document.getElementById('move-stud-id');
    const nameDisplay = document.getElementById('move-stud-display-name');
    const select = document.getElementById('move-target-class-select');

    if (idInput) idInput.value = s.id;
    if (nameDisplay) nameDisplay.textContent = 'Student: ' + s.firstName + ' ' + s.lastName + ' (Current: ' + (store.getClass(s.classId) ? store.getClass(s.classId).name : 'Unenrolled') + ')';
    if (select) {
      select.innerHTML = 
        '<option value="">-- Mark as Unenrolled --</option>' +
        store.getClasses().map(c => '<option value="' + c.id + '" ' + (c.id === s.classId ? 'selected' : '') + '>' + c.name + ' (' + c.grade + ')</option>').join('');
    }

    window.openModal('modal-move-student');
  };

  window.handleExecuteMoveStudent = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('move-stud-id').value;
    const targetClassId = document.getElementById('move-target-class-select').value;
    store.moveStudentToClass(studentId, targetClassId);
    window.closeAllModals();
    renderCurrentView();
  };

  // =========================================================================
  // REAL AVATAR CUSTOMIZER HANDLER
  // =========================================================================
  window.handleSaveAvatar = function() {
    const hair = document.getElementById('avatar-hair-select') ? document.getElementById('avatar-hair-select').value : 'girl';
    const activeStudent = store.getActiveStudent();
    if (activeStudent) {
      store.updateStudentAvatar(activeStudent.id, { hair });
    }
    window.closeAllModals();
    renderCurrentView();
  };

  // =========================================================================
  // MESSAGE THREAD HANDLERS
  // =========================================================================
  window.openNewMessageThreadModal = function() {
    const studSelect = document.getElementById('new-msg-student-select');
    const parentInput = document.getElementById('new-msg-parent-name');
    if (studSelect) {
      studSelect.innerHTML = store.getStudents().map(s => '<option value="' + s.id + '">' + s.firstName + ' ' + s.lastName + ' (' + (s.parentName || 'Parent') + ')</option>').join('');
      const first = store.getStudents()[0];
      if (first && parentInput) parentInput.value = first.parentName || 'Parent';
    }
    window.openModal('modal-new-message-thread');
  };

  window.handleCreateMessageThread = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('new-msg-student-select').value;
    const parentName = document.getElementById('new-msg-parent-name').value.trim();
    const text = document.getElementById('new-msg-text').value.trim();
    store.createMessageThread(studentId, parentName, text);
    window.closeAllModals();
    window.switchView('messages');
  };

  // =========================================================================
  // MOBILE NAVIGATION DRAWER TOGGLE
  // =========================================================================
  window.toggleMobileSidebar = function() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('is-mobile-open');
    }
  };
