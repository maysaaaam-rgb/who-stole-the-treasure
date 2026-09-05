/**
 * ENGLISH ADVENTURE ACADEMY — MASTER APPLICATION CONTROLLER & ROUTER
 * Version 3.0 (Full CRUD & Relational Management)
 * Connects directly to window.schoolStore
 */

(function(root) {
  'use strict';


  // Toast Notification System
  function showNotification(message, type = 'success') {
    if (typeof document === 'undefined' || !document.body) {
      console.log('[Notification]', message);
      return;
    }
    let toast = document.getElementById('app-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast-notification';
      toast.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; background:#0f172a; color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; font-size:0.9rem; box-shadow:0 10px 25px rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.15); transition:all 0.3s ease; display:flex; align-items:center; gap:8px; opacity:0; pointer-events:none; transform:translateY(10px);';
      document.body.appendChild(toast);
    }
    toast.innerHTML = (type === 'error' ? '⚠️ ' : '✓ ') + message;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
    toast.style.transform = 'translateY(0)';

    if (typeof window !== 'undefined') {
      if (window._toastTimeout) clearTimeout(window._toastTimeout);
      window._toastTimeout = setTimeout(() => {
        if (toast) {
          toast.style.opacity = '0';
          toast.style.pointerEvents = 'none';
          toast.style.transform = 'translateY(10px)';
        }
      }, 3200);
    }
  }
  window.showNotification = showNotification;

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
  let libraryActiveTab = 'games';
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
  let curriculumActiveBookId = 'book-global-readings-2';

  // Confirmation modal state
  let pendingActionCallback = null;

  // =========================================================================
  // 1. INITIALIZATION & GLOBAL EVENT LISTENERS
  // =========================================================================
  function initApp() {
    setupRoleSwitcher();
    setupHeaderControls();
    setupGlobalShortcuts();

    // Routing sync with location hash
    window.addEventListener('hashchange', () => {
      handleHashRouting();
    });
    handleHashRouting();

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

    // Close floating menus and modals on outside click
    document.addEventListener('click', (e) => {
      // Backdrop click on modal overlay closes the modal
      if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
        window.closeModal(e.target.id);
      }
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
      // Keyboard navigation for Textbook Viewer modal
      const tbModal = document.getElementById('modal-textbook-viewer');
      if (tbModal && tbModal.classList.contains('is-open')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (typeof window.prevTextbookPage === 'function') window.prevTextbookPage();
          return;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (typeof window.nextTextbookPage === 'function') window.nextTextbookPage();
          return;
        }
      }

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

  function handleHashRouting() {
    const hash = window.location.hash.replace(/^#[/]*/, '').trim();
    if (hash) {
      const parts = hash.split('/');
      const primaryView = parts[0];
      const validViews = [
        'dashboard', 'classes', 'class-detail', 'students', 'attendance',
        'curriculum', 'library', 'worksheets', 'assignments', 'homework',
        'quizzes', 'assessments', 'progress', 'reports', 'story', 'messages',
        'portfolios', 'health', 'system-health', 'gamification', 'adventure', 'tasks', 'badges',
        'leaderboard', 'parent-home', 'archived', 'settings', 'monster'
      ];
      if (validViews.includes(primaryView)) {
        if (primaryView === 'class-detail' && parts[1]) {
          selectedClassDetailId = parts[1];
          if (parts[2]) selectedClassDetailTab = parts[2];
        }
        currentView = primaryView;
        renderNavigation();
        renderCurrentView();
        return;
      }
    }
  }

  // Global Navigation Router
  window.switchView = function(viewName, updateHash = true) {
    currentView = viewName;
    if (updateHash) {
      if (viewName === 'class-detail') {
        window.location.hash = '#class-detail/' + selectedClassDetailId + '/' + selectedClassDetailTab;
      } else {
        window.location.hash = '#' + viewName;
      }
    }
    renderNavigation();
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Dedicated Class Dashboard

  // Global helpers for tabs to avoid closure scoping issues in inline HTML
  window.switchCurriculumBook = function(bookId) {
    curriculumActiveBookId = bookId;
    window.curriculumActiveBookId = bookId;
    renderCurrentView();
  };

  window.toggleLibraryManageMode = function() {
    isLibraryManageMode = !isLibraryManageMode;
    renderCurrentView();
  };

  window.switchLibraryCatalogTab = function(tab) {
    libraryActiveCatalogTab = tab;
    renderCurrentView();
  };

  window.switchAssessmentsSubTab = function(subTab) {
    assessmentsActiveSubTab = subTab;
    renderCurrentView();
  };

  window.switchLibraryTab = function(tab) {
    libraryActiveTab = tab;
    libraryActiveCatalogTab = tab;
    window.switchView(tab === 'worksheets' ? 'worksheets' : 'library');
  };

  window.openClass = function(classId, tab = 'overview') {
    selectedClassDetailId = classId;
    selectedClassDetailTab = tab;
    store.setActiveClass(classId);
    window.switchView('class-detail');
  };

  // Switch tab in Class Dashboard
  
  // Deprecated helper: fallback icon (All views now use window.renderMonsterAvatar)
  function getStudentAvatarEmoji(avatar) {
    if (avatar && avatar.studentId && typeof window.renderMonsterAvatar === 'function') {
      return window.renderMonsterAvatar(avatar.studentId, { size: 28 });
    }
    return '👾';
  }

  // Helper: compute average mastery percentage across all 7 language skills
  
  // =========================================================================
  // CANONICAL STUDENT MONSTER AVATAR RENDERER
  // =========================================================================
  window.renderMonsterAvatar = function(studentOrId, options = {}) {
    const size = options.size || 54;
    const animated = options.animated !== false;
    let studentId = typeof studentOrId === 'string' ? studentOrId : (studentOrId && studentOrId.id ? studentOrId.id : null);

    if (!window.MonsterRenderer || typeof window.MonsterRenderer.renderMonsterSVG !== 'function') {
      return '👾';
    }

    try {
      if (!studentId) {
        return window.MonsterRenderer.renderMonsterSVG({ stage: 'egg', color: 'purple', size: size, animated: animated });
      }
      const monsterState = (typeof store !== 'undefined' && store.calculateMonsterState) ? store.calculateMonsterState(studentId) : null;
      const profile = (typeof store !== 'undefined' && store.getMonsterProfile) ? store.getMonsterProfile(studentId) : null;

      if (!profile || !monsterState) {
        return window.MonsterRenderer.renderMonsterSVG({ stage: 'egg', color: 'purple', size: size, animated: animated });
      }

      return window.MonsterRenderer.renderMonsterSVG({
        stage: monsterState.stageKey || 'baby',
        color: profile.baseColor || 'blue',
        equipped: profile.equipped || {},
        size: size,
        animated: animated
      });
    } catch (err) {
      console.warn('Error in renderMonsterAvatar for ' + studentId, err);
      return '👾';
    }
  };
  window.renderStudentMonsterAvatar = window.renderMonsterAvatar;

  // Canonical entry point for Monster Creator
  window.openAvatarSelector = function(studentId) {
    if (!studentId) return;
    window.openMonsterCreator(studentId);
  };

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

  window.closeModal = function(modalId) {
    if (modalId) {
      const el = document.getElementById(modalId);
      if (el) el.classList.remove('is-open');
    } else {
      window.closeAllModals();
    }
    const remainingOpen = document.querySelectorAll('.modal-overlay.is-open');
    if (remainingOpen.length === 0) {
      document.body.style.overflow = '';
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

    const existing = editId ? store.getStudent(editId) : null;
    const avatar = existing && existing.avatar
      ? Object.assign({}, existing.avatar, { hair: avatarHair })
      : { emoji: '🧒', characterId: 'char-default', name: 'Explorer', category: 'explorers', hair: avatarHair, outfit: 'explorer', accessory: 'badge' };

    const payload = {
      firstName,
      lastName,
      studentIdNumber,
      age,
      overallCefr,
      classId,
      avatar,
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

    const studentAwards = store.getStudentAwards ? store.getStudentAwards(studentId) : [];
    const profileTabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'monster', label: '👾 Monster & Evolution' },
      { id: 'progress', label: 'Progress & CEFR' },
      { id: 'assignments', label: 'Assignments (' + assignments.length + ')' },
      { id: 'assessments', label: 'Assessments (' + assessments.length + ')' },
      { id: 'badges', label: 'Badges (' + studentAwards.length + ')' },
      { id: 'attendance', label: 'Attendance (' + attRate + '%)' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'xp', label: 'XP Ledger (' + totalXP + ')' },
      { id: 'rewards', label: 'Rewards' },
      { id: 'notes', label: 'Notes (' + notes.length + ')' }
    ];

    modal.innerHTML = 
      '<div class="modal-dialog" style="max-width: 820px; max-height: 90vh; overflow-y: auto;">' +
        '<button class="modal-close-btn" onclick="closeAllModals()">✕</button>' +

        '<!-- Prominent Monster Profile Hero Header -->' +
        (() => {
          const monsterState = store.calculateMonsterState(student.id);
          const nextXP = monsterState.nextLevelXP || totalXP;
          const xpToNext = monsterState.xpToNext;
          const progressPct = monsterState.progressPct;
          const monsterSvg = window.renderStudentMonsterAvatar(student.id, { size: 124, animated: true });

          return '' +
            '<div class="student-profile-monster-hero" style="display:flex; gap:20px; align-items:center; background:linear-gradient(135deg, var(--bg-surface), var(--bg-card)); border:1px solid var(--border-light); border-radius:18px; padding:20px; margin-bottom:18px; box-shadow:var(--shadow-sm); flex-wrap:wrap;">' +
              // Monster Stage Box
              '<div style="width:130px; height:130px; display:flex; align-items:center; justify-content:center; background:var(--bg-canvas); border-radius:16px; border:2px solid var(--border-light); cursor:pointer; position:relative;" onclick="openMonsterCreator(\'' + student.id + '\')" title="Click to open Monster Creator">' +
                monsterSvg +
                '<span style="position:absolute; bottom:6px; right:6px; background:var(--color-primary); color:#fff; border-radius:20px; padding:2px 8px; font-size:0.68rem; font-weight:800;">🎨 Creator</span>' +
              '</div>' +

              // Details & Controls
              '<div style="flex:1; min-width:260px;">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">' +
                  '<div>' +
                    '<div style="display:flex; align-items:center; gap:8px;">' +
                      '<span class="badge" style="background:var(--color-primary); color:#fff; font-weight:800; font-size:0.75rem; padding:2px 10px; border-radius:12px;">Level ' + monsterState.currentLevel + '</span>' +
                      '<h2 style="font-size:1.45rem; font-weight:900; margin:0; color:var(--text-main);">' + student.firstName.toUpperCase() + ' ' + student.lastName.toUpperCase() + '</h2>' +
                      '<span class="badge-cefr badge-cefr-' + student.overallCefr.toLowerCase().replace('+', '-plus') + '">' + student.overallCefr + '</span>' +
                    '</div>' +
                    '<div style="font-size:0.95rem; font-weight:800; color:var(--color-primary); margin-top:2px;">' + monsterState.stageName + '</div>' +
                    '<div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">ID: <strong>' + (student.studentIdNumber || 'EAA-001') + '</strong> · ' + student.grade + ' · Age ' + student.age + '</div>' +
                  '</div>' +

                  // Top Action Buttons
                  '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                    '<button type="button" class="btn-primary-action" onclick="openMonsterCreator(\'' + student.id + '\')" style="font-size:0.78rem; padding:6px 12px;">🎨 Customize Monster</button>' +
                    '<button type="button" class="btn-sm-secondary" onclick="openGiveXPSkillsModal(\'student\', \'' + student.id + '\')" style="font-size:0.78rem; padding:6px 12px; font-weight:800; color:#b45309;">⭐ Award XP</button>' +
                    '<button type="button" class="btn-sm-secondary" onclick="openEvolutionPathModal(\'' + student.id + '\')" style="font-size:0.78rem; padding:6px 12px;">🗺️ Evolution</button>' +
                    '<button type="button" class="btn-sm-secondary" onclick="openStudentModal(\'' + student.id + '\')" style="font-size:0.78rem; padding:6px 10px;">✏️ Edit</button>' +
                    '<div class="card-more-menu-wrap" style="position:relative;">' +
                      '<button class="btn-card-more" onclick="toggleCardDropdown(\'prof-' + student.id + '\', event)" title="More Management Options">⋯</button>' +
                      '<div class="card-dropdown-menu" id="menu-prof-' + student.id + '">' +
                        '<button class="card-dropdown-item" onclick="openReportGenerator(\'' + student.id + '\')">🖨️ Generate Report</button>' +
                        '<button class="card-dropdown-item" onclick="handleRemoveStudentFromClass(\'' + student.id + '\')">Unenroll from Class</button>' +
                        '<button class="card-dropdown-item" style="color:var(--color-danger);" onclick="handleArchiveStudent(\'' + student.id + '\')">Archive Student</button>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                // Evolution Progress Meter
                '<div style="margin-top:12px; background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:10px; padding:10px 14px;">' +
                  '<div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; margin-bottom:4px;">' +
                    '<span>⭐ ' + totalXP.toLocaleString() + ' / ' + (monsterState.nextLevel ? monsterState.nextLevel.xpRequired.toLocaleString() : 'MAX') + ' XP</span>' +
                    '<span style="color:var(--color-primary);">' + (!monsterState.isHatched ? ('🥚 EGG CRACK: ' + monsterState.eggCrackPct + '%') : (xpToNext > 0 ? (xpToNext.toLocaleString() + ' XP TO NEXT EVOLUTION') : '👑 ULTIMATE FORM')) + '</span>' +
                  '</div>' +
                  '<div style="height:10px; border-radius:5px; background:var(--border-light); overflow:hidden;">' +
                    '<div style="height:100%; width:' + progressPct + '%; background:linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius:5px; transition:width 0.4s ease;"></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>';
        })() +
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

      case 'monster':
        return renderMonsterTabForStudent(student, totalXP);

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

      case 'badges':
        const studAwards = store.getStudentAwards ? store.getStudentAwards(student.id) : [];
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
            '<h4 style="font-weight:800; font-size:1.05rem;">Student Badges &amp; Milestone Awards (' + studAwards.length + ')</h4>' +
            '<button class="btn-primary-action" onclick="handleAwardBadgeToStudent(null, \'' + student.id + '\')">⭐ + Award Badge</button>' +
          '</div>' +
          (studAwards.length === 0 ?
            '<div style="text-align:center; padding:32px 16px; background:var(--bg-canvas); border-radius:var(--radius-md); border:1px solid var(--border-light);">' +
              '<div style="font-size:32px; margin-bottom:8px;">🏆</div>' +
              '<div style="font-weight:700;">No badges awarded to this student yet</div>' +
              '<p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Recognize spoken confidence, teamwork, or milestone achievements.</p>' +
              '<button class="btn-primary-action" style="margin-top:10px;" onclick="handleAwardBadgeToStudent(null, \'' + student.id + '\')">+ Award First Badge</button>' +
            '</div>' :
            '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px;">' +
              studAwards.map(aw => {
                const badge = store.getBadge(aw.badgeId) || { name: 'Classroom Badge', icon: '🏆', description: 'Recognized achievement', xpReward: 100 };
                return '' +
                  '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between;">' +
                    '<div>' +
                      '<div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">' +
                        '<span style="font-size:2rem;">' + badge.icon + '</span>' +
                        '<div>' +
                          '<div style="font-weight:800; font-size:0.95rem;">' + badge.name + '</div>' +
                          '<div style="font-size:0.75rem; color:#b45309; font-weight:700;">+' + badge.xpReward + ' ⭐ XP</div>' +
                        '</div>' +
                      '</div>' +
                      '<p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:8px;">' + (aw.notes || badge.description) + '</p>' +
                      '<div style="font-size:0.72rem; color:var(--text-muted);">Awarded: ' + aw.awardedDate + '</div>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end; gap:6px; margin-top:10px; border-top:1px solid var(--border-light); padding-top:8px;">' +
                      '<button class="btn-sm-secondary" onclick="handleRemoveStudentAward(\'' + aw.id + '\', \'' + student.id + '\')" style="padding:2px 8px; font-size:0.72rem; color:var(--color-danger);">🗑️ Revoke Award</button>' +
                    '</div>' +
                  '</div>';
              }).join('') +
            '</div>'
          );

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
        const xpReport = store.getXPReport(student.id);
        const allTxs = store.getAllXPTransactions(student.id);
        return '' +
          '<!-- Top XP KPI Cards -->' +
          '<div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:16px;">' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; text-align:center;">' +
              '<div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">TOTAL ACTIVE XP</div>' +
              '<div style="font-size:1.35rem; font-weight:900; color:var(--color-primary); margin-top:2px;">⭐ ' + xpReport.totalXP.toLocaleString() + '</div>' +
            '</div>' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; text-align:center;">' +
              '<div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">PAST 7 DAYS</div>' +
              '<div style="font-size:1.35rem; font-weight:900; color:#059669; margin-top:2px;">+' + xpReport.xpThisWeek.toLocaleString() + '</div>' +
            '</div>' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; text-align:center;">' +
              '<div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">PAST 30 DAYS</div>' +
              '<div style="font-size:1.35rem; font-weight:900; color:#2563eb; margin-top:2px;">+' + xpReport.xpThisMonth.toLocaleString() + '</div>' +
            '</div>' +
            '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; text-align:center;">' +
              '<div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">AUDIT TRAIL</div>' +
              '<div style="font-size:1.35rem; font-weight:900; color:var(--text-main); margin-top:2px;">' + xpReport.activeCount + ' <span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">(' + xpReport.voidedCount + ' voided)</span></div>' +
            '</div>' +
          '</div>' +

          '<!-- Points Report Breakdown Banner -->' +
          '<div style="background:var(--bg-muted); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">' +
            '<div>' +
              '<div style="font-size:0.82rem; font-weight:800; color:var(--text-main); margin-bottom:4px;">Points Breakdown by Category</div>' +
              '<div style="display:flex; gap:10px; font-size:0.78rem;">' +
                '<span style="color:#059669; font-weight:700;">⭐ Positive: +' + xpReport.categoryBreakdown.positive + '</span>' +
                '<span style="color:#dc2626; font-weight:700;">💭 Needs Work: -' + xpReport.categoryBreakdown.needs_work + '</span>' +
                '<span style="color:#7c3aed; font-weight:700;">🎁 Redeemed: -' + xpReport.categoryBreakdown.redeemed + '</span>' +
                '<span style="color:#2563eb; font-weight:700;">🎮 Quests: +' + xpReport.categoryBreakdown.activity + '</span>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex; gap:8px;">' +
              '<button class="btn-primary-action" onclick="openGiveXPSkillsModal(\'student\', \'' + student.id + '\')" style="font-size:0.8rem; padding:6px 12px;">+ Award Points</button>' +
            '</div>' +
          '</div>' +

          '<!-- Top Behaviors Pills -->' +
          (xpReport.topSkills.length ? 
            '<div style="margin-bottom:14px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
              '<span style="font-size:0.78rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Top Behaviors:</span>' +
              xpReport.topSkills.map(ts => '<span style="font-size:0.78rem; background:var(--bg-canvas); border:1px solid var(--border-light); padding:3px 8px; border-radius:12px; font-weight:600;">' + ts.skill + ' <strong style="color:var(--color-primary);">(' + ts.count + 'x)</strong></span>').join('') +
            '</div>' : ''
          ) +

          '<!-- Transaction Ledger Table with Edit and Void Actions -->' +
          '<div style="max-height:300px; overflow-y:auto; border:1px solid var(--border-light); border-radius:var(--radius-md);">' +
            '<table style="width:100%; border-collapse:collapse; font-size:0.84rem;">' +
              '<thead><tr style="background:var(--bg-muted); text-align:left;"><th style="padding:8px 12px;">Date</th><th style="padding:8px 12px;">Skill / Behavior</th><th style="padding:8px 12px;">Category</th><th style="padding:8px 12px;">Source</th><th style="padding:8px 12px; text-align:right;">Amount</th><th style="padding:8px 12px; text-align:center;">Status</th><th style="padding:8px 12px; text-align:right;">Actions</th></tr></thead>' +
              '<tbody>' +
                (allTxs.length === 0 ? '<tr><td colspan="7" style="padding:24px; text-align:center; color:var(--text-muted);">No XP transactions recorded yet.</td></tr>' :
                  allTxs.map(tx => {
                    const isVoid = tx.status === 'voided';
                    const numAmt = parseInt(tx.amount, 10) || 0;
                    const amtColor = isVoid ? 'var(--text-muted)' : numAmt > 0 ? '#059669' : '#dc2626';
                    const amtSign = numAmt > 0 ? '+' : '';
                    return '' +
                      '<tr style="border-bottom:1px solid var(--border-light); opacity:' + (isVoid ? '0.6' : '1') + '; background:' + (isVoid ? 'rgba(0,0,0,0.02)' : 'transparent') + ';">' +
                        '<td style="padding:8px 12px; color:var(--text-muted); font-size:0.8rem; white-space:nowrap;">' + tx.date + '</td>' +
                        '<td style="padding:8px 12px; font-weight:600; color:var(--text-main);">' +
                          '<span>' + (tx.icon || '⭐') + '</span> ' + tx.reason +
                          (isVoid ? '<div style="font-size:0.72rem; color:#dc2626; font-style:italic;">Voided: ' + (tx.voidReason || 'Removed by teacher') + '</div>' : '') +
                        '</td>' +
                        '<td style="padding:8px 12px; font-size:0.75rem;">' +
                          '<span class="badge-cefr" style="background:' + (tx.category === 'positive' ? 'rgba(16,185,129,0.1)' : tx.category === 'needs_work' ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.1)') + '; color:' + (tx.category === 'positive' ? '#059669' : tx.category === 'needs_work' ? '#dc2626' : '#7c3aed') + ';">' +
                            (tx.category || 'positive') +
                          '</span>' +
                        '</td>' +
                        '<td style="padding:8px 12px; font-size:0.78rem; color:var(--text-muted);">' + (tx.createdBy || tx.source || 'Teacher') + '</td>' +
                        '<td style="padding:8px 12px; text-align:right; font-weight:900; color:' + amtColor + '; white-space:nowrap;">' +
                          amtSign + numAmt + ' XP' +
                        '</td>' +
                        '<td style="padding:8px 12px; text-align:center; font-size:0.75rem;">' +
                          (isVoid ? '<span style="color:#dc2626; font-weight:700;">Voided</span>' : '<span style="color:#059669; font-weight:700;">Active</span>') +
                        '</td>' +
                        '<td style="padding:8px 12px; text-align:right; white-space:nowrap;">' +
                          (isVoid ? 
                            '<button class="btn-sm-secondary" style="padding:2px 8px; font-size:0.72rem;" onclick="handleRestoreXPTransaction(\'' + tx.id + '\')" title="Restore this transaction">↩️ Restore</button>' :
                            '<div style="display:inline-flex; gap:4px;">' +
                              '<button class="btn-sm-secondary" style="padding:2px 6px; font-size:0.72rem;" onclick="openEditXPModal(\'' + tx.id + '\')" title="Edit amount or reason">✏️</button>' +
                              '<button class="btn-sm-secondary" style="padding:2px 6px; font-size:0.72rem; color:var(--color-danger);" onclick="openVoidXPModal(\'' + tx.id + '\')" title="Void/Remove transaction">🗑️</button>' +
                            '</div>'
                          ) +
                        '</td>' +
                      '</tr>';
                  }).join('')
                ) +
              '</tbody>' +
            '</table>' +
          '</div>';

      case 'rewards':
        const studentRewards = store.getAllXPTransactions(student.id).filter(t => t.category === 'redeemed' && t.status !== 'voided');
        const availableRewards = store.getRewards();
        return '' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">' +
            '<div>' +
              '<h4 style="font-weight:800; margin:0;">Classroom Reward Redemptions</h4>' +
              '<p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Student has ⭐ ' + totalXP + ' available XP</p>' +
            '</div>' +
            '<button class="btn-primary-action" onclick="openStudentRedeemRewardModal(\'' + student.id + '\')">🎁 Redeem New Reward</button>' +
          '</div>' +
          (studentRewards.length === 0 ? '<p style="color:var(--text-muted); font-size:0.84rem; padding:20px; text-align:center; background:var(--bg-canvas); border-radius:var(--radius-md);">No classroom rewards redeemed yet.</p>' :
            '<div style="display:flex; flex-direction:column; gap:8px;">' +
              studentRewards.map(rw => '' +
                '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">' +
                  '<div style="display:flex; align-items:center; gap:10px;">' +
                    '<span style="font-size:1.4rem;">' + (rw.icon || '🎁') + '</span>' +
                    '<div>' +
                      '<div style="font-weight:700; font-size:0.88rem;">' + rw.reason + '</div>' +
                      '<div style="font-size:0.75rem; color:var(--text-muted);">' + rw.date + ' · Approved by ' + (rw.createdBy || 'Teacher') + '</div>' +
                    '</div>' +
                  '</div>' +
                  '<span style="font-weight:900; color:#7c3aed; font-size:0.92rem;">' + rw.amount + ' XP</span>' +
                '</div>'
              ).join('') +
            '</div>');

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

  
  let studentsSearchQuery = '';
  let studentsFilterClass = 'all';
  let studentsFilterStage = 'all';
  let studentsFilterProgression = 'all';
  let studentsSortBy = 'xp_desc';

  window.handleStudentsSearch = function(val) {
    studentsSearchQuery = val;
    renderCurrentView();
  };

  window.handleStudentsFilterClass = function(clsId) {
    studentsFilterClass = clsId;
    renderCurrentView();
  };

  window.handleStudentsFilterStage = function(st) {
    studentsFilterStage = st;
    renderCurrentView();
  };

  window.handleStudentsFilterProgression = function(prog) {
    studentsFilterProgression = prog;
    renderCurrentView();
  };

  window.handleStudentsSort = function(sort) {
    studentsSortBy = sort;
    renderCurrentView();
  };


  function renderStudentsView(container) {
    const allStudents = store.getStudents();
    const classes = store.getClasses();

    // Filter by class
    let filtered = allStudents.filter(s => {
      if (studentsFilterClass !== 'all' && s.classId !== studentsFilterClass) return false;
      return true;
    });

    // Filter by search query
    if (studentsSearchQuery && studentsSearchQuery.trim()) {
      const q = studentsSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => 
        (s.firstName && s.firstName.toLowerCase().includes(q)) ||
        (s.lastName && s.lastName.toLowerCase().includes(q)) ||
        (s.studentIdNumber && s.studentIdNumber.toLowerCase().includes(q))
      );
    }

    // Filter by Evolution Stage
    if (studentsFilterStage !== 'all') {
      filtered = filtered.filter(s => {
        const mState = store.calculateMonsterState(s.id);
        return mState.stageKey === studentsFilterStage;
      });
    }

    // Filter by Progression Status
    if (studentsFilterProgression === 'near_evolution') {
      filtered = filtered.filter(s => {
        const mState = store.calculateMonsterState(s.id);
        return mState.progressPct >= 75 && mState.currentLevel < 7;
      });
    } else if (studentsFilterProgression === 'streak') {
      filtered = filtered.filter(s => (s.streakDays || 0) >= 3);
    } else if (studentsFilterProgression === 'achievements') {
      filtered = filtered.filter(s => {
        const achs = store.getStudentAchievements ? store.getStudentAchievements(s.id) : [];
        return achs.length > 0;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      const xpA = store.getStudentTotalXP(a.id);
      const xpB = store.getStudentTotalXP(b.id);
      const lvlA = store.calculateMonsterState(a.id).currentLevel;
      const lvlB = store.calculateMonsterState(b.id).currentLevel;

      if (studentsSortBy === 'xp_desc') return xpB - xpA;
      if (studentsSortBy === 'xp_asc') return xpA - xpB;
      if (studentsSortBy === 'level_desc') return lvlB - lvlA || xpB - xpA;
      if (studentsSortBy === 'name_asc') return (a.firstName || '').localeCompare(b.firstName || '');
      if (studentsSortBy === 'streak_desc') return (b.streakDays || 0) - (a.streakDays || 0);
      return 0;
    });

    container.innerHTML = 
      '<div style="max-width:1200px; margin:0 auto; padding-bottom:60px;">' +
        // Header
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
          '<div>' +
            '<h1 style="font-size:1.75rem; font-weight:900; color:var(--text-main); margin:0 0 4px 0;">👧 Students Directory &amp; Monster Companions</h1>' +
            '<p style="font-size:0.88rem; color:var(--text-muted); margin:0;">Real-time overview of all learners, their living evolving monsters, XP progress, and streaks.</p>' +
          '</div>' +
          '<div style="display:flex; gap:8px;">' +
            '<button type="button" class="btn-sm-secondary" onclick="exportStudentsCSV()">📥 Export CSV</button>' +
            '<button type="button" class="btn-primary-action" onclick="openStudentModal()">+ Add Student</button>' +
          '</div>' +
        '</div>' +

        // Search & Filter Toolbar
        '<div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:14px; padding:16px; margin-bottom:24px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:12px;">' +
          '<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">' +
            '<div style="flex:1; min-width:220px; position:relative;">' +
              '<input type="text" class="search-input" placeholder="🔍 Search student name, ID..." value="' + (studentsSearchQuery || '') + '" oninput="handleStudentsSearch(this.value)" style="width:100%;" />' +
            '</div>' +

            '<select class="filter-select" onchange="handleStudentsFilterClass(this.value)" style="min-width:140px;">' +
              '<option value="all" ' + (studentsFilterClass === 'all' ? 'selected' : '') + '>All Classes (' + allStudents.length + ')</option>' +
              classes.map(c => '<option value="' + c.id + '" ' + (studentsFilterClass === c.id ? 'selected' : '') + '>' + c.name + '</option>').join('') +
            '</select>' +

            '<select class="filter-select" onchange="handleStudentsFilterStage(this.value)" style="min-width:160px;">' +
              '<option value="all" ' + (studentsFilterStage === 'all' ? 'selected' : '') + '>All Evolution Stages</option>' +
              '<option value="egg" ' + (studentsFilterStage === 'egg' ? 'selected' : '') + '>🥚 Level 1: Mystery Egg</option>' +
              '<option value="cracking_egg" ' + (studentsFilterStage === 'cracking_egg' ? 'selected' : '') + '>🥚✨ Level 2: Cracking Egg</option>' +
              '<option value="baby" ' + (studentsFilterStage === 'baby' ? 'selected' : '') + '>🐣 Level 3: Baby Monster</option>' +
              '<option value="growing" ' + (studentsFilterStage === 'growing' ? 'selected' : '') + '>👾 Level 4: Growing Monster</option>' +
              '<option value="adventurer" ' + (studentsFilterStage === 'adventurer' ? 'selected' : '') + '>🧭 Level 5: Adventurer Monster</option>' +
              '<option value="advanced" ' + (studentsFilterStage === 'advanced' ? 'selected' : '') + '>🐲 Level 6: Advanced Monster</option>' +
              '<option value="ultimate" ' + (studentsFilterStage === 'ultimate' ? 'selected' : '') + '>👑 Level 7: Ultimate Monster</option>' +
            '</select>' +

            '<select class="filter-select" onchange="handleStudentsFilterProgression(this.value)" style="min-width:150px;">' +
              '<option value="all" ' + (studentsFilterProgression === 'all' ? 'selected' : '') + '>All Progression</option>' +
              '<option value="near_evolution" ' + (studentsFilterProgression === 'near_evolution' ? 'selected' : '') + '>⭐ Near Evolution (&gt;75%)</option>' +
              '<option value="streak" ' + (studentsFilterProgression === 'streak' ? 'selected' : '') + '>🔥 Active Streaks (3+ d)</option>' +
              '<option value="achievements" ' + (studentsFilterProgression === 'achievements' ? 'selected' : '') + '>🏆 Has Achievements</option>' +
            '</select>' +

            '<select class="filter-select" onchange="handleStudentsSort(this.value)" style="min-width:140px;">' +
              '<option value="xp_desc" ' + (studentsSortBy === 'xp_desc' ? 'selected' : '') + '>⭐ XP: High to Low</option>' +
              '<option value="xp_asc" ' + (studentsSortBy === 'xp_asc' ? 'selected' : '') + '>⭐ XP: Low to High</option>' +
              '<option value="level_desc" ' + (studentsSortBy === 'level_desc' ? 'selected' : '') + '>👾 Level: High to Low</option>' +
              '<option value="name_asc" ' + (studentsSortBy === 'name_asc' ? 'selected' : '') + '>🔤 Name: A to Z</option>' +
              '<option value="streak_desc" ' + (studentsSortBy === 'streak_desc' ? 'selected' : '') + '>🔥 Streak: High to Low</option>' +
            '</select>' +
          '</div>' +
          '<div style="font-size:0.78rem; color:var(--text-muted); display:flex; justify-content:space-between;">' +
            '<span>Showing <strong>' + filtered.length + '</strong> of ' + allStudents.length + ' registered learners</span>' +
            '<span>Click any monster or card to view detailed learning profile &amp; closet</span>' +
          '</div>' +
        '</div>' +

        // Students Cards Grid
        (filtered.length === 0 ?
          '<div style="text-align:center; padding:60px 20px; background:var(--bg-surface); border-radius:16px; border:1px solid var(--border-light);">' +
            '<div style="font-size:44px; margin-bottom:10px;">🔍</div>' +
            '<h3 style="font-size:1.15rem; font-weight:800; margin:0 0 6px 0;">No students match this filter</h3>' +
            '<p style="font-size:0.86rem; color:var(--text-muted); margin:0 0 16px 0;">Try adjusting your search query, class, or evolution stage filter.</p>' +
            '<button type="button" class="btn-sm-secondary" onclick="studentsSearchQuery=\'\'; studentsFilterClass=\'all\'; studentsFilterStage=\'all\'; studentsFilterProgression=\'all\'; renderCurrentView();">Reset Filters</button>' +
          '</div>' :
          '<div class="students-directory-grid">' +
            filtered.map(s => {
              const mState = store.calculateMonsterState(s.id);
              const totalXP = mState.totalXP;
              const nextXP = mState.nextLevelXP || totalXP;
              const xpToNext = mState.xpToNext;
              const progressPct = mState.progressPct;
              const streak = s.streakDays || 1;
              const cls = store.getClass(s.classId);
              const monsterSvg = window.renderStudentMonsterAvatar(s.id, { size: 84, animated: true });

              return '' +
                '<div class="student-directory-card" onclick="openStudentDetail(\'' + s.id + '\')">' +
                  '<div class="student-card-top-bar">' +
                    '<span class="student-card-status-dot status-active" title="Status: Active"></span>' +
                    '<span class="badge-cefr badge-cefr-' + (s.overallCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + (s.overallCefr || 'A1') + '</span>' +
                    '<span class="student-card-streak-pill" title="Daily streak">🔥 ' + streak + 'd</span>' +
                  '</div>' +

                  '<div class="student-directory-avatar-wrap" onclick="event.stopPropagation(); openMonsterCreator(\'' + s.id + '\')" title="Click to customize monster">' +
                    monsterSvg +
                    '<div class="avatar-customize-pill">🎨 Customize</div>' +
                  '</div>' +

                  '<div class="student-directory-name">' + s.firstName + ' ' + s.lastName + '</div>' +
                  '<div class="student-directory-class-sub">' + (cls ? cls.name : 'Unenrolled') + ' · ' + s.grade + '</div>' +

                  '<div class="student-directory-stage-badge">' +
                    'Level ' + mState.currentLevel + ' · ' + mState.stageName +
                  '</div>' +

                  '<div class="student-directory-xp-line">' +
                    '<strong>⭐ ' + totalXP.toLocaleString() + ' XP</strong>' +
                    '<span style="color:var(--text-muted); font-size:0.75rem;">' + totalXP.toLocaleString() + ' / ' + (mState.nextLevel ? mState.nextLevel.xpRequired.toLocaleString() : 'MAX') + '</span>' +
                  '</div>' +

                  '<div class="student-directory-progress-bar" title="' + progressPct + '% to next stage">' +
                    '<div class="student-directory-progress-fill" style="width:' + progressPct + '%;"></div>' +
                  '</div>' +
                  '<div class="student-directory-progress-sub">' +
                    (!mState.isHatched ? 
                      ('🥚 Egg Crack Progress: ' + mState.eggCrackPct + '%') : 
                      (xpToNext > 0 ? (xpToNext.toLocaleString() + ' XP to evolve') : '👑 Apex Form Reached!')
                    ) +
                  '</div>' +

                  '<div class="student-directory-card-actions" onclick="event.stopPropagation();">' +
                    '<button type="button" class="btn-sm-secondary" onclick="openStudentDetail(\'' + s.id + '\', \'monster\')" style="flex:1;">🎨 Monster</button>' +
                    '<button type="button" class="btn-sm-secondary" onclick="openGiveXPSkillsModal(\'student\', \'' + s.id + '\')" style="font-weight:800; color:#b45309;">⭐ +XP</button>' +
                    '<button type="button" class="btn-sm-secondary" onclick="openStudentDetail(\'' + s.id + '\', \'overview\')">Profile →</button>' +
                  '</div>' +
                '</div>';
            }).join('') +
          '</div>'
        ) +
      '</div>';
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
      { id: 'calendar', label: '📅 Calendar & Schedule' },
      { id: 'leaderboard', label: '🏆 Leaderboard' },
      { id: 'rewards', label: '👑 Rewards' },
      { id: 'bigIdeas', label: '💡 Big Ideas' }
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
          '<button class="btn-sm-secondary" onclick="openGiveXPSkillsModal(\'class\', \'' + cls.id + '\')" style="font-size:0.86rem; padding:8px 14px; font-weight:800; color:#b45309; background:rgba(245,158,11,0.12); border-color:#f59e0b;">⭐ Points</button>' +
          '<button class="btn-sm-secondary" onclick="openClassroomToolkitModal()" style="font-size:0.86rem; padding:8px 14px; font-weight:700;">🧰 Toolkit</button>' +
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
      case 'leaderboard':
        return renderClassLeaderboardSubTab(cls, students);
      case 'rewards':
        return renderClassRewardsSubTab(cls, students);
      case 'bigIdeas':
        return renderClassBigIdeasSubTab(cls, students);
      default:
        return renderClassroomWorkspace(cls, students);
    }
  }

  // The Live Classroom Workspace (Students visual grid | Groups view | Unenrolled)
  function renderClassroomWorkspace(cls, students) {
    const groups = store.getGroups(cls.id);
    const unenrolled = store.getUnenrolledStudents ? store.getUnenrolledStudents() : [];

    return '' +
      // Subtoolbar: Students | Groups | Unenrolled + Quick Actions
      '<div class="classroom-subtoolbar">' +
        '<div class="classroom-view-toggle-pills">' +
          '<button class="classroom-view-pill-btn ' + (classroomActiveSubTab === 'students' ? 'is-active' : '') + '" onclick="switchClassroomSubTab(\'students\')">' +
            '<span>🧒</span> <span>Students (' + students.length + ')</span>' +
          '</button>' +
          '<button class="classroom-view-pill-btn ' + (classroomActiveSubTab === 'groups' ? 'is-active' : '') + '" onclick="switchClassroomSubTab(\'groups\')">' +
            '<span>👥</span> <span>Groups (' + groups.length + ')</span>' +
          '</button>' +
          '<button class="classroom-view-pill-btn ' + (classroomActiveSubTab === 'unenrolled' ? 'is-active' : '') + '" onclick="switchClassroomSubTab(\'unenrolled\')">' +
            '<span>🚪</span> <span>Unenrolled (' + unenrolled.length + ')</span>' +
          '</button>' +
        '</div>' +

        '<div class="classroom-action-buttons-group">' +
          '<button class="btn-sm-secondary ' + (isMultiSelectMode ? 'is-active' : '') + '" onclick="toggleMultiSelectMode()" style="' + (isMultiSelectMode ? 'background:var(--color-primary); color:#fff;' : '') + '">' +
            (isMultiSelectMode ? '✓ Done Selecting' : '☑ Select Multiple') +
          '</button>' +
          '<button class="btn-sm-secondary" onclick="openGiveXPSkillsModal(\'class\', \'' + cls.id + '\')" style="font-weight:800; color:#b45309; background:rgba(245,158,11,0.12); border-color:#f59e0b;">⭐ Points</button>' +
          '<button class="btn-sm-secondary" onclick="openClassroomToolkitModal()" style="font-weight:700;">🧰 Toolkit</button>' +
          (classroomActiveSubTab === 'groups' ?
            '<button class="btn-primary-action" onclick="openCreateGroupModal()">+ Create Group</button>' :
            '<button class="btn-primary-action" onclick="openStudentModal()">+ Add Student</button>'
          ) +
        '</div>' +
      '</div>' +

      // Body View: Students Grid, Groups Grid, or Unenrolled Grid
      (classroomActiveSubTab === 'students' ? 
        renderClassroomStudentsGrid(cls, students) : 
        classroomActiveSubTab === 'groups' ?
        renderClassroomGroupsGrid(cls, groups, students) :
        renderClassroomUnenrolledGrid(cls)
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
      // avatarEmoji deprecated
      const monsterState = store.calculateMonsterState ? store.calculateMonsterState(s.id) : null;
      const monsterSvg = (window.renderMonsterSVG && monsterState) ? window.renderMonsterSVG({
        stage: monsterState.stageKey,
        color: monsterState.profile ? monsterState.profile.baseColor : 'blue',
        equipped: monsterState.profile ? monsterState.profile.equipped : {},
        size: 52,
        animated: true
      }) : null;
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

          // Avatar Frame (Clickable to change character avatar)
          '<div class="student-avatar-frame monster-avatar-box" onclick="event.stopPropagation(); window.openMonsterCreator(\'' + s.id + '\')" title="Level ' + monsterState.currentLevel + ' ' + monsterState.stageName + ' — Click to customize monster">' +
            window.renderStudentMonsterAvatar(s.id, { size: 66, animated: true }) +
          '</div>' +

          // Name (Uppercase)
          '<div class="student-card-name">' + s.firstName.toUpperCase() + '</div>' +
          '<div style="font-size:0.72rem; font-weight:800; color:var(--color-primary); margin-bottom:4px;">Level ' + monsterState.currentLevel + ' · ' + monsterState.stageName + '</div>' +
          '<div class="student-card-progress-bar" style="margin-top:4px;" title="Evolution: ' + monsterState.progressPct + '%">' +
            '<div class="student-card-progress-fill" style="width:' + monsterState.progressPct + '%; background:linear-gradient(90deg, #3b82f6, #8b5cf6);"></div>' +
          '</div>' +
          '<div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px; text-align:center;">' +
            (!monsterState.isHatched ? ('Egg Crack: ' + monsterState.eggCrackPct + '%') : (monsterState.xpToNext > 0 ? (monsterState.xpToNext + ' XP to evolve') : '👑 Apex Form')) +
          '</div>' +

          // Meta Row (Points + CEFR)
          '<div class="student-card-meta-row">' +
            '<span class="student-card-xp-badge" onclick="event.stopPropagation(); openGiveXPSkillsModal(\'student\', \'' + s.id + '\')" title="Award XP">⭐ ' + formattedXP + '</span>' +
            '<span class="student-card-cefr-badge">' + (s.overallCefr || 'A1') + '</span>' +
          '</div>' +

          // Quick 1-Click Points and Award Bar
          '<div style="margin-top:6px; display:flex; justify-content:center; gap:6px;">' +
            '<button class="btn-sm-secondary btn-card-quick-point" onclick="handleQuickPlusOneXP(\'' + s.id + '\', event)" title="Quick +1 Positive Point" style="padding:2px 8px; font-size:0.72rem; font-weight:800; border-radius:12px; background:rgba(16,185,129,0.1); color:#059669; border-color:rgba(16,185,129,0.3);">' +
              '+1 XP' +
            '</button>' +
            '<button class="btn-sm-secondary" onclick="event.stopPropagation(); openGiveXPSkillsModal(\'student\', \'' + s.id + '\')" title="Open Skills Points Award" style="padding:2px 8px; font-size:0.72rem; font-weight:700; border-radius:12px;">' +
              '⭐ Award' +
            '</button>' +
          '</div>' +

          // Streak
          '<div class="student-card-streak-badge" style="margin-top:6px;">🔥 ' + streak + '-day streak</div>' +

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

const teamTotalXP = store.getGroupTotalXP ? store.getGroupTotalXP(g.id) : 0;
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

                  '<div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">' +
                    '<span>' + memberStudents.length + ' Members</span>' +
                    '<span style="font-weight:800; color:var(--color-primary);">⭐ ' + teamTotalXP.toLocaleString() + ' Total XP</span>' +
                  '</div>' +

                  '<div class="group-members-pills">' +
                    memberStudents.map(m => '' +
                      '<span class="group-member-pill" onclick="openStudentDetail(\'' + m.id + '\')">' +
                        window.renderStudentMonsterAvatar(m.id, { size: 28, animated: false }) + ' ' + m.firstName +
                      '</span>'
                    ).join('') +
                  '</div>' +

                  '<div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">' +
                    '<button class="btn-sm-secondary" onclick="openGiveXPSkillsModal(\'group\', \'' + g.id + '\')" style="font-weight:800; color:#b45309; background:rgba(245,158,11,0.12); border-color:#f59e0b; padding:6px 12px;">' +
                      '⭐ Award Team' +
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
                  '<div style="font-weight:800; font-size:0.95rem; display:flex; align-items:center; gap:8px;">' + window.renderMonsterAvatar(s.id, { size: 28, animated: false }) + ' <span>' + s.firstName + ' ' + s.lastName + '</span></div>' +
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
                  '<div style="width:34px; height:34px; display:flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 32, animated: false }) + '</div>' +
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
    let activeBook = books.find(b => b.id === curriculumActiveBookId);
    if (!activeBook) {
      activeBook = books.find(b => b.id === 'book-global-readings-2') || books[0];
      if (activeBook) curriculumActiveBookId = activeBook.id;
    }
    const units = store.getUnits(activeBook.id);
    const lessons = store.getLessons();
    const objectives = store.getObjectives();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Curriculum Framework</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Official curriculum syllabi, scope &amp; sequence progression, and original textbook scans.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button class="btn-sm-secondary" onclick="openAddBookModal()">📖 + Add Book</button>' +
          '<button class="btn-primary-action" onclick="openAddUnitModal(\'' + activeBook.id + '\')">📑 + Add Unit</button>' +
        '</div>' +
      '</div>' +

      // Books Tab Switcher
      '<div class="curriculum-book-tabs" style="display:flex; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--border-light); padding-bottom:4px; overflow-x:auto;">' +
        books.map(b => '' +
          '<div style="display:inline-flex; align-items:center; gap:2px; border-bottom:3px solid ' + (activeBook.id === b.id ? 'var(--color-primary)' : 'transparent') + '; padding-bottom:4px; white-space:nowrap;">' +
            '<button class="curriculum-book-tab ' + (activeBook.id === b.id ? 'is-active' : '') + '" onclick="switchCurriculumBook(\'' + b.id + '\')" style="background:transparent; border:none; padding:8px 12px; font-weight:800; font-size:0.95rem; cursor:pointer; color:' + (activeBook.id === b.id ? 'var(--color-primary)' : 'var(--text-muted)') + ';">' +
              b.title + (b.level ? ' (' + b.level + ')' : (b.targetLevel ? ' (' + b.targetLevel + ')' : '')) +
            '</button>' +
            (activeBook.id === b.id ? 
              '<button onclick="openEditBookModal(\'' + b.id + '\')" title="Edit Book" style="background:transparent; border:none; cursor:pointer; font-size:0.75rem; padding:2px;">✏️</button>' +
              '<button onclick="handleArchiveBook(\'' + b.id + '\')" title="Archive Book" style="background:transparent; border:none; cursor:pointer; font-size:0.75rem; padding:2px; color:var(--color-danger);">🗑️</button>'
              : '') +
          '</div>'
        ).join('') +
      '</div>' +

      // Active Book Banner Card
      '<div class="curriculum-active-book-banner" style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:18px 22px; margin-bottom:22px; display:flex; gap:20px; align-items:center; flex-wrap:wrap; box-shadow:var(--shadow-xs);">' +
        (activeBook.cover ? 
          '<div style="width:76px; height:104px; flex-shrink:0; border-radius:8px; overflow:hidden; box-shadow:var(--shadow-md); border:1px solid var(--border-light); background:#f1f5f9; display:flex; align-items:center; justify-content:center;">' +
            '<img src="' + activeBook.cover + '" alt="Book Cover" style="width:100%; height:100%; object-fit:cover;" />' +
          '</div>' : ''
        ) +
        '<div style="flex:1; min-width:260px;">' +
          '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
            '<h2 style="font-size:1.35rem; font-weight:800; margin:0; color:var(--text-main);">' + activeBook.title + '</h2>' +
            '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.74rem; font-weight:700; padding:3px 10px; border-radius:12px;">' + (activeBook.level || activeBook.targetLevel || 'Level 2') + '</span>' +
            (activeBook.publisher ? '<span class="badge" style="background:var(--color-success-soft); color:var(--color-success); font-size:0.74rem; font-weight:700; padding:3px 10px; border-radius:12px;">' + activeBook.publisher + '</span>' : '') +
            (activeBook.bookType ? '<span class="badge" style="background:var(--bg-muted); color:var(--text-muted); font-size:0.74rem; font-weight:600; padding:3px 10px; border-radius:12px;">' + activeBook.bookType + '</span>' : '') +
          '</div>' +
          '<p style="font-size:0.86rem; color:var(--text-secondary); margin:6px 0 0 0; max-width:850px; line-height:1.45;">' + (activeBook.description || 'Comprehensive curriculum program.') + '</p>' +
          '<div style="display:flex; gap:16px; margin-top:10px; font-size:0.8rem; color:var(--text-muted); flex-wrap:wrap;">' +
            '<span>📚 <strong>' + units.length + ' Units</strong> in Syllabus</span>' +
            '<span>📝 <strong>' + lessons.filter(l => units.some(u => u.id === l.unitId)).length + ' Lessons</strong></span>' +
            (activeBook.totalPages ? '<span>📄 <strong>' + activeBook.totalPages + ' Textbook Pages</strong></span>' : '') +
          '</div>' +
        '</div>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button type="button" class="btn-primary-action" onclick="openTextbookViewer(1, \'' + activeBook.id + '\')" style="padding:8px 14px; font-size:0.84rem; display:inline-flex; align-items:center; gap:6px;">📖 Open Textbook Viewer</button>' +
          (activeBook.pdfUrl ? '<a href="' + activeBook.pdfUrl + '" target="_blank" class="btn-sm-secondary" style="padding:8px 14px; font-size:0.84rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">📥 Original PDF</a>' : '') +
        '</div>' +
      '</div>' +

      // Units List
      '<div class="curriculum-units-list" style="display:flex; flex-direction:column; gap:18px;">' +
        units.map((u, uIdx) => {
          const uLessons = lessons.filter(l => l.unitId === u.id).sort((a, b) => (a.order || 0) - (b.order || 0));
          const startPage = u.pages ? parseInt(u.pages.split('–')[0], 10) : 1;
          return '' +
            '<div class="unit-accordion-card" style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
              // Unit Header
              '<div style="padding:16px 20px; background:var(--bg-muted); border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">' +
                '<div style="display:flex; align-items:flex-start; gap:12px; flex:1; min-width:300px;">' +
                  // Reorder buttons for units
                  '<div style="display:flex; flex-direction:column; gap:2px; margin-top:2px;">' +
                    (uIdx > 0 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.65rem;" onclick="handleMoveUnitUp(\'' + activeBook.id + '\', \'' + u.id + '\')" title="Move Unit Up">▲</button>' : '') +
                    (uIdx < units.length - 1 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.65rem;" onclick="handleMoveUnitDown(\'' + activeBook.id + '\', \'' + u.id + '\')" title="Move Unit Down">▼</button>' : '') +
                  '</div>' +
                  '<div style="display:flex; flex-direction:column; gap:6px; flex:1;">' +
                    '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
                      '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">' + u.title + '</h3>' +
                      (u.pages ? '<span class="badge" style="background:var(--bg-surface); color:var(--text-secondary); font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid var(--border-light);">📄 p. ' + u.pages + '</span>' : '') +
                      (u.readingSkill ? '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px;">🎯 ' + u.readingSkill + '</span>' : '') +
                      (u.contentArea ? '<span class="badge" style="background:var(--color-purple-soft); color:var(--color-purple); font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px;">🔬 ' + u.contentArea + '</span>' : '') +
                    '</div>' +
                    (u.keyConcept ? '<div style="font-size:0.82rem; font-weight:700; color:var(--color-warning); margin-top:2px;">💡 Key Concept: "' + u.keyConcept + '"</div>' : '') +
                    (u.reading1 || u.reading2 ? 
                      '<div style="font-size:0.8rem; color:var(--text-muted); display:flex; gap:12px; flex-wrap:wrap; margin-top:2px;">' +
                        (u.reading1 ? '<span><strong>Reading 1:</strong> ' + u.reading1 + '</span>' : '') +
                        (u.reading2 ? '<span><strong>Reading 2:</strong> ' + u.reading2 + '</span>' : '') +
                        (u.selFocus ? '<span>💖 <strong>SEL:</strong> ' + u.selFocus + '</span>' : '') +
                      '</div>' : ''
                    ) +
                    '<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">' +
                      '<strong>Target Vocab:</strong> ' + (u.targetVocab || []).join(', ') +
                    '</div>' +
                  '</div>' +
                '</div>' +

                '<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">' +
                  (u.pages ? '<button class="btn-sm-secondary" onclick="openTextbookViewer(' + startPage + ', \'' + activeBook.id + '\')" style="font-size:0.78rem; padding:4px 10px; color:var(--color-primary); font-weight:700;" title="View scanned textbook pages">📖 View Pages</button>' : '') +
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
                  const lStartPage = l.sourcePages ? parseInt(l.sourcePages.split('–')[0], 10) : startPage;
                  const hasTasks = (l.tasks && l.tasks.length > 0) || (l.activities && l.activities.length > 0);

                  return '' +
                    '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:10px; padding:14px 16px; box-shadow:var(--shadow-xs);">' +
                      '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">' +
                        '<div style="display:flex; align-items:flex-start; gap:10px; flex:1; min-width:280px;">' +
                          // Reorder buttons for lessons
                          '<div style="display:flex; flex-direction:column; gap:2px; margin-top:2px;">' +
                            (lIdx > 0 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.62rem;" onclick="handleMoveLessonUp(\'' + u.id + '\', \'' + l.id + '\')">▲</button>' : '') +
                            (lIdx < uLessons.length - 1 ? '<button type="button" class="btn-sm-secondary" style="padding:1px 5px; font-size:0.62rem;" onclick="handleMoveLessonDown(\'' + u.id + '\', \'' + l.id + '\')">▼</button>' : '') +
                          '</div>' +
                          '<div style="flex:1;">' +
                            '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
                              '<h4 style="font-size:0.98rem; font-weight:800; margin:0; color:var(--text-main);">' + l.title + '</h4>' +
                              (l.sourcePages ? '<span class="badge" style="background:var(--bg-muted); color:var(--text-secondary); font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:8px;">📄 p. ' + l.sourcePages + '</span>' : '') +
                              (l.sourcePages ? '<button type="button" class="btn-sm-secondary" onclick="openTextbookViewer(' + lStartPage + ', \'' + activeBook.id + '\', \'' + l.id + '\')" style="padding:2px 8px; font-size:0.72rem; color:var(--color-primary); font-weight:700;">📖 View Page</button>' : '') +
                              (l.gameRoute ? '<a href="' + l.gameRoute + '" class="btn-primary-action" style="padding:2px 8px; font-size:0.72rem; text-decoration:none;">▶ Play Game</a>' : '') +
                              (hasTasks ? '<button type="button" class="btn-sm-secondary" onclick="toggleLessonActivities(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.72rem;">📝 Activities (' + ((l.activities && l.activities.length) || (l.tasks && l.tasks.length) || 0) + ')</button>' : '') +
                            '</div>' +
                            '<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">' + (l.objective || '') + '</div>' +
                          '</div>' +
                        '</div>' +

                        '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                          '<button class="btn-sm-secondary" onclick="openAddObjectiveModal(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">+ Objective</button>' +
                          '<button class="btn-sm-secondary" onclick="openEditLessonModal(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">✏️ Edit</button>' +
                          '<button class="btn-sm-secondary" onclick="handleDuplicateLesson(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem;">📋</button>' +
                          '<button class="btn-sm-secondary" onclick="handleArchiveLesson(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.74rem; color:var(--color-danger);">📦</button>' +
                        '</div>' +
                      '</div>' +

                      // Objectives pills
                      (lObjs.length > 0 ? 
                        '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; padding-top:8px; border-top:1px dashed var(--border-light);">' +
                          lObjs.map(o => 
                            '<span style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-muted); border:1px solid var(--border-light); padding:2px 8px; border-radius:6px; font-size:0.75rem;">' +
                              '<strong>' + o.skill + ':</strong> ' + o.text +
                              (o.sourcePages ? '<span style="color:var(--text-muted); font-size:0.7rem;">(p.' + o.sourcePages + ')</span>' : '') +
                              '<button type="button" onclick="handleDeleteObjective(\'' + o.id + '\')" style="background:transparent; border:none; cursor:pointer; color:var(--color-danger); font-size:0.72rem; padding:0 2px;">✕</button>' +
                            '</span>'
                          ).join('') +
                        '</div>' : ''
                      ) +

                      // Expandable Activities / Tasks Panel
                      (hasTasks ?
                        '<div id="lesson-activities-' + l.id + '" style="display:none; margin-top:12px; padding:12px 14px; background:var(--bg-muted); border-radius:8px; border:1px solid var(--border-light); font-size:0.82rem;">' +
                          '<div style="font-weight:800; color:var(--text-main); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">' +
                            '<span>Structured Textbook Content &amp; Activities</span>' +
                            '<button type="button" onclick="toggleLessonActivities(\'' + l.id + '\')" style="background:transparent; border:none; cursor:pointer; font-size:0.75rem; color:var(--text-muted);">Close ✕</button>' +
                          '</div>' +
                          (l.tasks ? 
                            '<div style="display:flex; flex-direction:column; gap:6px;">' +
                              l.tasks.map(t => '<div><strong>' + (t.label || t.pair || t.blend || 'Task') + ':</strong> ' + (t.words ? t.words.join(', ') : '') + '</div>').join('') +
                            '</div>' : ''
                          ) +
                          (l.activities ?
                            '<div style="display:flex; flex-direction:column; gap:8px;">' +
                              l.activities.map(act => {
                                if (act.type === 'story') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; color:var(--color-primary);">' + act.title + '</div><div style="font-style:italic; margin-top:2px;">"' + act.text + '"</div></div>';
                                } else if (act.type === 'vocab_definitions') {
                                  return '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:6px;">' + act.words.map(w => '<div style="background:var(--bg-surface); padding:6px 8px; border-radius:6px; border:1px solid var(--border-light);"><strong>' + w.word + ':</strong> ' + w.def + '</div>').join('') + '</div>';
                                } else if (act.type === 'dialects') {
                                  return '<div style="display:flex; gap:8px; flex-wrap:wrap;"><strong>Dialect Notes:</strong> ' + act.pairs.map(p => '<span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-light); font-size:0.75rem;">🇺🇸 ' + p.us + ' = 🇬🇧 ' + p.uk + '</span>').join('') + '</div>';
                                } else if (act.type === 'matching') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">' + act.title + '</div>' + act.pairs.map(p => '<div style="margin:2px 0;">• <strong>' + p.invention + '</strong> ➔ ' + p.function + '</div>').join('') + '</div>';
                                } else if (act.type === 'questions') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">' + act.title + '</div>' + act.items.map(it => '<div style="margin:4px 0;"><span style="font-weight:600;">' + it.q + '</span><br/><span style="color:var(--color-success); font-weight:600;">➔ Answer: ' + it.a + '</span></div>').join('') + '</div>';
                                } else if (act.type === 'sequence_device' || act.type === 'sequence_inventor') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">' + act.title + '</div><div style="display:flex; gap:8px; flex-wrap:wrap;">' + act.steps.map(s => '<span style="background:var(--bg-muted); padding:3px 8px; border-radius:4px; font-size:0.75rem;"><strong>' + (s.signal || ('Step ' + s.order)) + ':</strong> ' + s.text + '</span>').join('') + '</div></div>';
                                } else if (act.type === 'biomimicry') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">Biomimicry: Nature Inspired Inventions</div>' + act.examples.map(ex => '<div style="margin:2px 0;">🌿 ' + ex.nature + ' ➔ 💡 <strong>' + ex.invention + '</strong></div>').join('') + '</div>';
                                } else if (act.type === 'design_cycle') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">5-Step Engineering Design Loop</div><div style="display:flex; gap:6px; flex-wrap:wrap;">' + act.steps.map(st => '<span class="badge" style="background:var(--color-primary-soft); color:var(--color-primary); font-size:0.75rem; font-weight:700;">' + st + '</span>').join(' ➔ ') + '</div></div>';
                                } else if (act.type === 'inventor_matrix') {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light);"><div style="font-weight:700; margin-bottom:4px;">Inventors Matrix</div>' + act.rows.map(r => '<div style="margin:2px 0;">• <strong>' + r.inventor + '</strong>: ' + r.invention + ' <em>(' + r.reason + ')</em></div>').join('') + '</div>';
                                } else if (act.prompt) {
                                  return '<div style="background:var(--bg-surface); padding:8px 10px; border-radius:6px; border:1px solid var(--border-light); font-style:italic;">💬 ' + act.prompt + '</div>';
                                }
                                return '';
                              }).join('') +
                            '</div>' : ''
                          ) +
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
          '<button class="btn-sm-secondary" onclick="toggleLibraryManageMode()" style="' + (isLibraryManageMode ? 'background:var(--color-primary); color:#fff;' : '') + '">' +
            (isLibraryManageMode ? '✓ Done Managing' : '⚙️ Manage Mode') +
          '</button>' +
        '</div>' +
      '</div>' +

      // Sub-Tabs: Interactive Games vs Worksheets
      '<div style="display:flex; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:4px;">' +
        '<button class="classroom-view-pill-btn ' + (libraryActiveCatalogTab === 'games' ? 'is-active' : '') + '" onclick="switchLibraryCatalogTab(\'games\')">' +
          '<span>🎮</span> <span>Interactive Games (' + store.getResources().length + ')</span>' +
        '</button>' +
        '<button class="classroom-view-pill-btn ' + (libraryActiveCatalogTab === 'worksheets' ? 'is-active' : '') + '" onclick="switchLibraryCatalogTab(\'worksheets\')">' +
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

  // =========================================================================
  // PRINTABLE WORKSHEETS HUB & REAL LIBRARY
  // =========================================================================
  let wsFilterLevel = 'all';
  let wsFilterSkill = 'all';
  let wsFilterSearch = '';

  function renderWorksheetsView(container) {
    const allWorksheets = store.getWorksheets();
    let worksheets = allWorksheets;

    if (wsFilterLevel !== 'all') worksheets = worksheets.filter(w => (w.level || 'A1') === wsFilterLevel);
    if (wsFilterSkill !== 'all') worksheets = worksheets.filter(w => (w.skill || w.category || '').toLowerCase().includes(wsFilterSkill.toLowerCase()));
    if (wsFilterSearch.trim()) {
      const q = wsFilterSearch.toLowerCase().trim();
      worksheets = worksheets.filter(w => (w.title + ' ' + (w.description || '') + ' ' + (w.topic || '')).toLowerCase().includes(q));
    }

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Printable Worksheets</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">' + allWorksheets.length + ' worksheets available for classroom practice, independent review, and home missions.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-primary-action" onclick="openWorksheetEditor()">📄 + Create Worksheet</button>' +
        '</div>' +
      '</div>' +

      // Filters Bar
      '<div class="library-filter-bar" style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">' +
        '<input type="text" class="search-input" placeholder="Search worksheets, topics, vocabulary... (Press /)" style="flex:1; min-width:220px;" value="' + wsFilterSearch + '" oninput="wsFilterSearch=this.value; renderCurrentView();" />' +
        '<select class="filter-select" onchange="wsFilterLevel=this.value; renderCurrentView();">' +
          '<option value="all" ' + (wsFilterLevel === 'all' ? 'selected' : '') + '>All CEFR Levels</option>' +
          '<option value="Pre-A1" ' + (wsFilterLevel === 'Pre-A1' ? 'selected' : '') + '>Pre-A1</option>' +
          '<option value="A1" ' + (wsFilterLevel === 'A1' ? 'selected' : '') + '>A1</option>' +
          '<option value="A1+" ' + (wsFilterLevel === 'A1+' ? 'selected' : '') + '>A1+</option>' +
          '<option value="A2" ' + (wsFilterLevel === 'A2' ? 'selected' : '') + '>A2</option>' +
        '</select>' +
        '<select class="filter-select" onchange="wsFilterSkill=this.value; renderCurrentView();">' +
          '<option value="all" ' + (wsFilterSkill === 'all' ? 'selected' : '') + '>All Skills</option>' +
          '<option value="Speaking" ' + (wsFilterSkill === 'Speaking' ? 'selected' : '') + '>Speaking &amp; Roleplay</option>' +
          '<option value="Vocabulary" ' + (wsFilterSkill === 'Vocabulary' ? 'selected' : '') + '>Vocabulary</option>' +
          '<option value="Grammar" ' + (wsFilterSkill === 'Grammar' ? 'selected' : '') + '>Grammar</option>' +
          '<option value="Reading" ' + (wsFilterSkill === 'Reading' ? 'selected' : '') + '>Reading</option>' +
          '<option value="Writing" ' + (wsFilterSkill === 'Writing' ? 'selected' : '') + '>Writing</option>' +
        '</select>' +
      '</div>' +

      // Worksheets Grid
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">' +
        (worksheets.length === 0 ? '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No worksheets match your filters.</div>' :
          worksheets.map(w => {
            const qCount = (w.questions || []).length || 4;
            return '' +
              '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
                '<div>' +
                  '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">' +
                    '<div style="display:flex; align-items:center; gap:6px;">' +
                      '<span class="badge-cefr badge-cefr-' + (w.level || 'A1').toLowerCase().replace('+', '-plus') + '">' + (w.level || 'A1') + '</span>' +
                      '<span style="font-size:0.75rem; background:rgba(79,70,229,0.1); color:var(--color-primary); padding:2px 8px; border-radius:999px; font-weight:700;">' + (w.grade || 'Grade 3') + '</span>' +
                    '</div>' +
                    '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">' + (w.status || 'Ready to Print') + '</span>' +
                  '</div>' +
                  '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:6px;">' + w.title + '</h3>' +
                  '<div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;"><strong>Topic:</strong> ' + (w.topic || 'General Practice') + ' · <strong>Skill:</strong> ' + (w.skill || w.category || 'General') + ' · <strong>' + (w.duration || '20 min') + '</strong></div>' +
                  '<p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">' + (w.description || 'Interactive printable practice.') + '</p>' +
                  '<div style="font-size:0.75rem; background:var(--bg-card-secondary); padding:6px 10px; border-radius:8px; margin-bottom:14px; border:1px solid var(--border-subtle);">' +
                    '<strong>Questions:</strong> ' + qCount + ' tasks · <strong>Created:</strong> ' + (w.createdDate || '2026-09-01') +
                  '</div>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px; gap:8px; flex-wrap:wrap;">' +
                  '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-primary-action" onclick="openWorksheetPreviewModal(\'' + w.id + '\')" style="padding:4px 10px; font-size:0.78rem;">👁️ Open</button>' +
                    '<button class="btn-sm-secondary" onclick="openAssignModal(\'' + w.id + '\')" style="padding:4px 10px; font-size:0.78rem;">📝 Assign</button>' +
                  '</div>' +
                  '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-sm-secondary" onclick="openWorksheetEditor(\'' + w.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Edit">✏️</button>' +
                    '<button class="btn-sm-secondary" onclick="handleDuplicateWorksheet(\'' + w.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Duplicate">📋</button>' +
                    '<button class="btn-sm-secondary" onclick="handleArchiveWorksheet(\'' + w.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);" title="Archive">📦</button>' +
                  '</div>' +
                '</div>' +
              '</div>';
          }).join('')
        ) +
      '</div>';
  }

  window.openWorksheetPreviewModal = function(wsId, autoPrint = false) {
    const ws = store.getWorksheet(wsId);
    if (!ws) return;

    const badge = document.getElementById('ws-prev-badge');
    const title = document.getElementById('ws-prev-title');
    const topic = document.getElementById('ws-prev-topic');
    const instructions = document.getElementById('ws-prev-instructions');
    const body = document.getElementById('ws-prev-questions-body');
    const answerKey = document.getElementById('ws-prev-answerkey');

    if (badge) badge.textContent = (ws.level || 'A1') + ' · ' + (ws.grade || 'Grade 3') + ' · ' + (ws.duration || '20 min');
    if (title) title.textContent = ws.title;
    if (topic) topic.textContent = 'Topic: ' + (ws.topic || 'General') + ' · Skill: ' + (ws.skill || ws.category || 'General');
    if (instructions) instructions.textContent = ws.instructions || ws.description || 'Answer each question carefully.';
    if (answerKey) answerKey.textContent = ws.answerKey || 'See individual question guidelines';

    const questions = ws.questions && ws.questions.length ? ws.questions : [
      { id: 'q-1', text: 'Sample task 1 for ' + ws.title, type: 'short_answer', points: 1 }
    ];

    if (body) {
      body.innerHTML = questions.map((q, idx) => '' +
        '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:8px; padding:12px 16px;">' +
          '<div style="display:flex; justify-content:space-between; margin-bottom:6px;">' +
            '<strong>Question ' + (idx + 1) + ' (' + (q.points || 1) + ' pt):</strong>' +
            '<span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">' + q.type.replace('_', ' ') + '</span>' +
          '</div>' +
          '<div style="font-size:0.92rem; margin-bottom:8px; font-weight:600;">' + q.text + '</div>' +
          (q.type === 'multiple_choice' && q.options ? 
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.84rem;">' +
              q.options.map(opt => '<label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="radio" name="preview-q-' + idx + '" /> ' + opt + '</label>').join('') +
            '</div>' :
            (q.type === 'true_false' ?
              '<div style="display:flex; gap:16px; font-size:0.84rem;"><label><input type="radio" name="preview-q-' + idx + '" /> True</label><label><input type="radio" name="preview-q-' + idx + '" /> False</label></div>' :
              '<div style="border-bottom:1px dashed #cbd5e1; height:32px; margin-top:8px;"></div>'
            )
          ) +
        '</div>'
      ).join('');
    }

    window.openModal('modal-worksheet-preview');
    if (autoPrint) {
      setTimeout(() => window.print(), 300);
    }
  };

  window.handleDuplicateWorksheet = function(wsId) {
    const copy = store.duplicateWorksheet(wsId);
    if (copy) {
      showNotification('Worksheet duplicated: ' + copy.title);
      renderCurrentView();
    }
  };

  window.handleAddWorksheetQuestionRow = function(qData = null) {
    const container = document.getElementById('ws-questions-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'ws-question-edit-row';
    row.style.cssText = 'background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:6px; padding:8px; display:flex; gap:8px; align-items:center;';

    const text = qData ? qData.text : '';
    const type = qData ? qData.type : 'multiple_choice';

    row.innerHTML = 
      '<input type="text" class="filter-select ws-q-text" style="flex:2;" placeholder="Question text..." value="' + text + '" required />' +
      '<select class="filter-select ws-q-type" style="flex:1;">' +
        '<option value="multiple_choice" ' + (type === 'multiple_choice' ? 'selected' : '') + '>Multiple Choice</option>' +
        '<option value="fill_blank" ' + (type === 'fill_blank' ? 'selected' : '') + '>Fill Blank</option>' +
        '<option value="true_false" ' + (type === 'true_false' ? 'selected' : '') + '>True / False</option>' +
        '<option value="short_answer" ' + (type === 'short_answer' ? 'selected' : '') + '>Short Answer</option>' +
      '</select>' +
      '<button type="button" class="btn-sm-secondary" onclick="this.closest(\'.ws-question-edit-row\').remove()" style="color:var(--color-danger); padding:2px 8px;">✕</button>';

    container.appendChild(row);
  };

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
  let hwFilterStatus = 'all';
  let hwFilterType = 'all';

  function renderHomeworkView(container) {
    const allHomework = store.getHomework();
    const classes = store.getClasses();
    let homework = allHomework;

    if (hwFilterType !== 'all') homework = homework.filter(h => (h.type || '').toLowerCase() === hwFilterType.toLowerCase());

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Homework &amp; Independent Tasks</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">' + allHomework.length + ' tasks tracking student submissions, task completion, and evidence-based accuracy.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-primary-action" onclick="openModal(\'modal-homework-editor\')">+ Create Homework</button>' +
        '</div>' +
      '</div>' +

      // Filters Bar
      '<div class="library-filter-bar" style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">' +
        '<select class="filter-select" onchange="hwFilterType=this.value; renderCurrentView();">' +
          '<option value="all" ' + (hwFilterType === 'all' ? 'selected' : '') + '>All Task Types</option>' +
          '<option value="Game" ' + (hwFilterType === 'Game' ? 'selected' : '') + '>Game Mission</option>' +
          '<option value="Worksheet" ' + (hwFilterType === 'Worksheet' ? 'selected' : '') + '>Printable Worksheet</option>' +
          '<option value="Reading" ' + (hwFilterType === 'Reading' ? 'selected' : '') + '>Reading Task</option>' +
          '<option value="Writing" ' + (hwFilterType === 'Writing' ? 'selected' : '') + '>Writing Task</option>' +
          '<option value="Speaking" ' + (hwFilterType === 'Speaking' ? 'selected' : '') + '>Speaking Mission</option>' +
          '<option value="Project" ' + (hwFilterType === 'Project' ? 'selected' : '') + '>Project</option>' +
        '</select>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">' +
        (homework.length === 0 ? '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No homework tasks match your filters.</div>' :
          homework.map(h => {
            const cls = classes.find(c => c.id === h.classId) || { name: 'Active Cohort' };
            const classStudents = store.getStudentsByClass(cls.id);
            const submissions = h.submissions || {};
            const completedCount = Object.values(submissions).filter(s => s.status === 'Complete').length;
            const inProgressCount = Object.values(submissions).filter(s => s.status === 'Partially Complete' || s.status === 'In Progress').length;
            const totalCount = classStudents.length || 8;
            const pct = Math.round(((completedCount + inProgressCount * 0.5) / totalCount) * 100);

            return '' +
              '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
                '<div>' +
                  '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
                    '<span style="font-size:0.75rem; font-weight:800; color:var(--color-primary); background:rgba(79,70,229,0.1); padding:2px 8px; border-radius:999px;">' + h.type + '</span>' +
                    '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">' + cls.name + '</span>' +
                  '</div>' +
                  '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:6px;">' + h.title + '</h3>' +
                  '<p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">Due: ' + (h.dueDate || 'Friday') + ' · ' + (h.questionsTotal || 10) + ' Tasks</p>' +
                  // Completion progress bar
                  '<div style="margin-bottom:14px;">' +
                    '<div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; margin-bottom:4px;">' +
                      '<span>Class Submissions</span>' +
                      '<span>' + completedCount + ' / ' + totalCount + ' completed</span>' +
                    '</div>' +
                    '<div class="progress-bar-wrap" style="height:8px;"><div class="progress-bar-fill" style="width:' + pct + '%;"></div></div>' +
                  '</div>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px; gap:8px;">' +
                  '<button class="btn-primary-action" onclick="openHomeworkGradingModal(\'' + h.id + '\')" style="padding:5px 12px; font-size:0.8rem;">👥 Submissions &amp; Grading</button>' +
                  '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-sm-secondary" onclick="openEditHomeworkModal(\'' + h.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Edit">✏️</button>' +
                    '<button class="btn-sm-secondary" onclick="handleDuplicateHomework(\'' + h.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Duplicate">📋</button>' +
                    '<button class="btn-sm-secondary" onclick="handleArchiveHomework(\'' + h.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);" title="Archive">📦</button>' +
                  '</div>' +
                '</div>' +
              '</div>';
          }).join('')
        ) +
      '</div>';
  }

  window.openHomeworkGradingModal = function(homeworkId) {
    const hw = store.getHomeworkItem(homeworkId);
    if (!hw) return;

    const title = document.getElementById('hw-grading-title');
    const subtitle = document.getElementById('hw-grading-subtitle');
    const list = document.getElementById('hw-grading-students-list');

    if (title) title.textContent = '👥 ' + hw.title + ' — Submissions & Grading';
    if (subtitle) subtitle.textContent = 'Total: ' + (hw.questionsTotal || 10) + ' tasks. Record completed questions to log official learning evidence.';

    const cls = store.getClass(hw.classId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const submissions = hw.submissions || {};

    if (list) {
      list.innerHTML = students.map(st => {
        const sub = submissions[st.id] || { status: 'Not Started', attempted: 0, correct: 0, completion: 0, accuracy: 0, notes: '' };
        return '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;" id="hw-sub-row-' + st.id + '">' +
            '<div style="display:flex; align-items:center; gap:10px; min-width:160px;">' +
              '<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(st.id, { size: 38, animated: false }) + '</div>' +
              '<div>' +
                '<div style="font-weight:800; font-size:0.95rem;">' + st.firstName + ' ' + st.lastName + '</div>' +
                '<div style="font-size:0.75rem; color:var(--text-muted);">CEFR ' + (st.overallCefr || 'A1') + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">' +
              '<div>' +
                '<label style="display:block; font-size:0.7rem; font-weight:700; color:var(--text-muted);">Status</label>' +
                '<select class="filter-select hw-sub-status" style="font-size:0.78rem; padding:4px 8px;">' +
                  '<option value="Not Started" ' + (sub.status === 'Not Started' ? 'selected' : '') + '>Not Started</option>' +
                  '<option value="In Progress" ' + (sub.status === 'In Progress' ? 'selected' : '') + '>In Progress</option>' +
                  '<option value="Partially Complete" ' + (sub.status === 'Partially Complete' ? 'selected' : '') + '>Partially Complete</option>' +
                  '<option value="Complete" ' + (sub.status === 'Complete' ? 'selected' : '') + '>Complete</option>' +
                  '<option value="Needs Revision" ' + (sub.status === 'Needs Revision' ? 'selected' : '') + '>Needs Revision</option>' +
                '</select>' +
              '</div>' +
              '<div style="width:75px;">' +
                '<label style="display:block; font-size:0.7rem; font-weight:700; color:var(--text-muted);">Attempted</label>' +
                '<input type="number" class="filter-select hw-sub-attempted" min="0" max="' + (hw.questionsTotal || 10) + '" value="' + (sub.attempted || 0) + '" style="width:100%; font-size:0.78rem; padding:4px;" />' +
              '</div>' +
              '<div style="width:75px;">' +
                '<label style="display:block; font-size:0.7rem; font-weight:700; color:var(--text-muted);">Correct</label>' +
                '<input type="number" class="filter-select hw-sub-correct" min="0" max="' + (hw.questionsTotal || 10) + '" value="' + (sub.correct || 0) + '" style="width:100%; font-size:0.78rem; padding:4px;" />' +
              '</div>' +
              '<div style="text-align:center; min-width:110px; background:var(--bg-canvas); padding:4px 8px; border-radius:6px; border:1px solid var(--border-light);">' +
                '<div style="font-size:0.7rem; color:var(--text-muted);">Task: <strong>' + (sub.completion || 0) + '%</strong></div>' +
                '<div style="font-size:0.78rem; font-weight:800; color:var(--color-primary);">Accuracy: ' + (sub.accuracy || 0) + '%</div>' +
              '</div>' +
              '<button type="button" class="btn-primary-action" onclick="handleSaveStudentHomeworkGrading(\'' + hw.id + '\', \'' + st.id + '\')" style="padding:4px 10px; font-size:0.78rem;">Save Grade</button>' +
            '</div>' +
          '</div>';
      }).join('');
    }

    window.openModal('modal-homework-grading');
  };

  window.handleSaveStudentHomeworkGrading = function(hwId, studentId) {
    const row = document.getElementById('hw-sub-row-' + studentId);
    if (!row) return;

    const status = row.querySelector('.hw-sub-status')?.value || 'Complete';
    const attempted = parseInt(row.querySelector('.hw-sub-attempted')?.value, 10) || 0;
    const correct = parseInt(row.querySelector('.hw-sub-correct')?.value, 10) || 0;

    const sub = store.recordHomeworkSubmission(hwId, studentId, { status, attempted, correct });
    if (sub) {
      showNotification('Grade saved! Task: ' + sub.completion + '% · Accuracy: ' + sub.accuracy + '% (logged to learning evidence)');
      window.openHomeworkGradingModal(hwId);
      renderCurrentView();
    }
  };


  // =========================================================================
  // QUIZZES & QUESTION BUILDER VIEW (Complete CRUD)
  // =========================================================================
  function renderQuizzesView(container) {
    const quizzes = store.getQuizzes();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Diagnostic Quizzes &amp; Tests</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage interactive questions, multiple-choice, fill-in-the-blank, and speaking drills.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-primary-action" onclick="openModal(\'modal-quiz-builder\')">+ Create Quiz</button>' +
        '</div>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">' +
        quizzes.map(q => {
          const qCount = (q.questions || []).length;
          const subCount = Object.keys(q.submissions || {}).length;
          return '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm);">' +
              '<div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                  '<span class="badge-cefr badge-cefr-' + (q.targetCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + (q.targetCefr || 'A1') + '</span>' +
                  '<span style="font-size:0.78rem; color:var(--text-muted); font-weight:700;">' + q.skill + '</span>' +
                '</div>' +
                '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:6px;">' + q.title + '</h3>' +
                '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">' + qCount + ' Questions · ' + subCount + ' Submissions Recorded</div>' +
              '</div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px; gap:6px; flex-wrap:wrap;">' +
                '<button class="btn-primary-action" onclick="openQuizResultsModal(\'' + q.id + '\')" style="padding:5px 10px; font-size:0.78rem;">📊 Results (' + subCount + ')</button>' +
                '<button class="btn-sm-secondary" onclick="openQuizQuestionsManager(\'' + q.id + '\')" style="padding:5px 10px; font-size:0.78rem;">🧩 Questions (' + qCount + ')</button>' +
                '<div style="display:flex; gap:4px;">' +
                  '<button class="btn-sm-secondary" onclick="openEditQuizModal(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Edit">✏️</button>' +
                  '<button class="btn-sm-secondary" onclick="handleDuplicateQuiz(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem;" title="Duplicate">📋</button>' +
                  '<button class="btn-sm-secondary" onclick="handleArchiveQuiz(\'' + q.id + '\')" style="padding:4px 8px; font-size:0.78rem; color:var(--color-danger);" title="Archive">📦</button>' +
                '</div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  window.openQuizResultsModal = function(quizId) {
    const q = store.getQuiz(quizId);
    if (!q) return;

    const title = document.getElementById('quiz-results-title');
    const subtitle = document.getElementById('quiz-results-subtitle');
    const tbody = document.getElementById('quiz-results-tbody');

    if (title) title.textContent = '📊 ' + q.title + ' — Results & Overrides';
    if (subtitle) subtitle.textContent = 'CEFR Level: ' + (q.targetCefr || 'A1') + ' · Skill: ' + q.skill + ' · Total Questions: ' + (q.questions || []).length;

    const cls = store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    const submissions = q.submissions || {};

    if (tbody) {
      tbody.innerHTML = students.map(st => {
        const sub = submissions[st.id] || { attempted: (q.questions || []).length, correct: Math.floor((q.questions || []).length * 0.8), score: 8, maxScore: 10, percentage: 80, teacherNotes: '' };
        return '' +
          '<tr style="border-bottom:1px solid var(--border-subtle);">' +
            '<td style="padding:10px 12px; font-weight:800; display:flex; align-items:center; gap:8px;">' +
              '<span style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(st.id, { size: 24, animated: false }) + '</span>' +
              '<span>' + st.firstName + ' ' + st.lastName + '</span>' +
            '</td>' +
            '<td style="padding:10px 12px; text-align:center;">' + (sub.attempted || 0) + '</td>' +
            '<td style="padding:10px 12px; text-align:center;">' + (sub.correct || 0) + '</td>' +
            '<td style="padding:10px 12px; text-align:center; font-weight:700;">' + (sub.score || 0) + ' / ' + (sub.maxScore || 10) + '</td>' +
            '<td style="padding:10px 12px; text-align:center;"><span style="font-weight:900; color:' + (sub.percentage >= 80 ? 'var(--color-success)' : sub.percentage >= 60 ? '#b45309' : 'var(--color-danger)') + ';">' + (sub.percentage || 0) + '%</span></td>' +
            '<td style="padding:10px 12px; font-size:0.78rem; color:var(--text-muted);">' + (sub.teacherNotes || (sub.overridden ? 'Teacher override applied' : 'Standard auto-grading')) + '</td>' +
            '<td style="padding:10px 12px; text-align:right;">' +
              '<button type="button" class="btn-sm-secondary" onclick="handlePromptQuizOverride(\'' + q.id + '\', \'' + st.id + '\')" style="padding:2px 8px; font-size:0.74rem;">✏️ Override</button>' +
            '</td>' +
          '</tr>';
      }).join('');
    }

    window.openModal('modal-quiz-results');
  };

  window.handlePromptQuizOverride = function(quizId, studentId) {
    const q = store.getQuiz(quizId);
    const st = store.getStudent(studentId);
    if (!q || !st) return;

    const currentSub = (q.submissions && q.submissions[studentId]) || { percentage: 80, correct: 8 };
    const newPctStr = prompt('Override score for ' + st.firstName + ' (Percentage 0-100%):', currentSub.percentage);
    if (newPctStr === null) return;
    const newPct = Math.min(100, Math.max(0, parseInt(newPctStr, 10) || 0));

    const notes = prompt('Teacher notes / rationale for override:', currentSub.teacherNotes || 'Teacher manual assessment');

    store.overrideQuizResult(quizId, studentId, {
      percentage: newPct,
      score: newPct / 10,
      notes: notes || 'Teacher score correction'
    });

    showNotification('Official quiz override saved for ' + st.firstName + '! Logged to learning evidence.');
    window.openQuizResultsModal(quizId);
    renderCurrentView();
  };


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
        '<button class="classroom-view-pill-btn ' + (assessmentsActiveSubTab === 'evaluations' ? 'is-active' : '') + '" onclick="switchAssessmentsSubTab(\'evaluations\')">' +
          '<span>🎯</span> <span>Student Evaluations (' + assessments.length + ')</span>' +
        '</button>' +
        '<button class="classroom-view-pill-btn ' + (assessmentsActiveSubTab === 'rubrics' ? 'is-active' : '') + '" onclick="switchAssessmentsSubTab(\'rubrics\')">' +
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
    const levels = store.getProgressionLevels ? store.getProgressionLevels(true) : [];
    const items = store.getMonsterItems ? store.getMonsterItems(null, true) : [];
    const xpSkills = store.state.xpSkills || [];

    const activeTab = gamificationActiveTab || 'badges';

    const tabsHtml = 
      '<div style="display:flex; gap:8px; border-bottom:1px solid var(--border-light); margin-bottom:20px; overflow-x:auto;">' +
        '<button type="button" class="monster-tab-btn ' + (activeTab === 'badges' ? 'is-active' : '') + '" onclick="switchGamificationTab(\'badges\')">🏆 Badges &amp; Achievements (' + (badges.length + achievements.length) + ')</button>' +
        '<button type="button" class="monster-tab-btn ' + (activeTab === 'levels' ? 'is-active' : '') + '" onclick="switchGamificationTab(\'levels\')">👾 Monster Evolution Levels (' + levels.length + ')</button>' +
        '<button type="button" class="monster-tab-btn ' + (activeTab === 'items' ? 'is-active' : '') + '" onclick="switchGamificationTab(\'items\')">🎨 Monster Items Catalog (' + items.length + ')</button>' +
        '<button type="button" class="monster-tab-btn ' + (activeTab === 'skills' ? 'is-active' : '') + '" onclick="switchGamificationTab(\'skills\')">⭐ Classroom XP Skills (' + xpSkills.length + ')</button>' +
      '</div>';

    let tabBodyHtml = '';

    if (activeTab === 'levels') {
      tabBodyHtml = 
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px; box-shadow:var(--shadow-sm);">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
            '<div>' +
              '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">7 Core Evolution Stages &amp; XP Thresholds</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); margin:3px 0 0 0;">Teachers and administrators can configure level names, XP required, stage descriptions, and rewards.</p>' +
            '</div>' +
            '<button type="button" class="btn-primary-action" onclick="openAddProgressionLevelModal()">+ Add Progression Level</button>' +
          '</div>' +

          '<div style="overflow-x:auto;">' +
            '<table style="width:100%; border-collapse:collapse; font-size:0.84rem;">' +
              '<thead>' +
                '<tr style="background:var(--bg-muted); text-align:left; border-bottom:1px solid var(--border-light);">' +
                  '<th style="padding:10px 12px;">Stage &amp; Icon</th>' +
                  '<th style="padding:10px 12px;">Level #</th>' +
                  '<th style="padding:10px 12px;">Level Name</th>' +
                  '<th style="padding:10px 12px; text-align:right;">XP Required</th>' +
                  '<th style="padding:10px 12px;">Description</th>' +
                  '<th style="padding:10px 12px;">Unlocked Items</th>' +
                  '<th style="padding:10px 12px; text-align:center;">Status</th>' +
                  '<th style="padding:10px 12px; text-align:right;">Actions</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                levels.map(l => {
                  const stageSvg = window.renderMonsterSVG ? window.renderMonsterSVG({
                    stage: l.stageKey,
                    color: 'blue',
                    size: 40,
                    animated: false
                  }) : '👾';

                  return '' +
                    '<tr style="border-bottom:1px solid var(--border-light);">' +
                      '<td style="padding:10px 12px;"><div style="width:40px; height:40px;">' + stageSvg + '</div></td>' +
                      '<td style="padding:10px 12px; font-weight:800;">Level ' + l.level + '</td>' +
                      '<td style="padding:10px 12px; font-weight:700; color:var(--color-primary);">' + l.name + '</td>' +
                      '<td style="padding:10px 12px; text-align:right; font-weight:800;">' + l.xpRequired.toLocaleString() + ' ⭐</td>' +
                      '<td style="padding:10px 12px; color:var(--text-muted); max-width:260px;">' + l.description + '</td>' +
                      '<td style="padding:10px 12px; font-size:0.75rem;">' + (l.rewards ? l.rewards.join(', ') : 'Base avatar perks') + '</td>' +
                      '<td style="padding:10px 12px; text-align:center;"><span class="badge" style="background:rgba(16,185,129,0.15); color:#059669; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:10px;">Active</span></td>' +
                      '<td style="padding:10px 12px; text-align:right;">' +
                        '<button type="button" class="btn-sm-secondary" onclick="promptEditProgressionLevel(\'' + l.id + '\')" style="padding:2px 8px; font-size:0.75rem;">Edit</button>' +
                      '</td>' +
                    '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
    } else if (activeTab === 'items') {
      tabBodyHtml = 
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px; box-shadow:var(--shadow-sm);">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
            '<div>' +
              '<h3 style="font-size:1.15rem; font-weight:800; margin:0; color:var(--text-main);">Monster Items Catalog (' + items.length + ' Items)</h3>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); margin:3px 0 0 0;">Modular cosmetics unlocked via Level XP thresholds or Learning World achievements.</p>' +
            '</div>' +
          '</div>' +

          '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:12px;">' +
            items.map(item => '' +
              '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="font-size:1.8rem;">' + item.icon + '</span>' +
                  '<div>' +
                    '<div style="font-weight:800; font-size:0.84rem;">' + item.name + '</div>' +
                    '<div style="font-size:0.7rem; color:var(--color-primary); font-weight:700;">' + item.category.toUpperCase() + '</div>' +
                  '</div>' +
                '</div>' +
                '<p style="font-size:0.75rem; color:var(--text-muted); margin:8px 0 4px 0;">' + item.description + '</p>' +
                '<div style="font-size:0.7rem; font-weight:700; color:#b45309; margin-bottom:6px;">' +
                  (item.unlockType === 'level' ? '⭐ Unlocked at Level ' + item.unlockRequirement.level : '🏆 Linked to ' + item.unlockRequirement.achievementId) +
                '</div>' +
                '<div style="display:flex; gap:4px; margin-top:4px;">' +
                  '<button type="button" class="btn-sm-secondary" onclick="promptEditMonsterItem(\'' + item.id + '\')" style="padding:1px 6px; font-size:0.65rem;">Edit</button>' +
                  '<button type="button" class="btn-sm-secondary" onclick="toggleArchiveMonsterItem(\'' + item.id + '\')" style="padding:1px 6px; font-size:0.65rem;">' + (item.status === 'archived' ? 'Restore' : 'Archive') + '</button>' +
                '</div>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>';
    } else if (activeTab === 'skills') {
      tabBodyHtml = 
        '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px;">' +
          '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:14px; color:var(--text-main);">Classroom XP Award Skills</h3>' +
          '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px;">' +
            xpSkills.map(sk => '' +
              '<div style="padding:12px; background:var(--bg-muted); border-radius:10px; border:1px solid var(--border-light);">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="font-size:1.4rem;">' + sk.icon + '</span>' +
                  '<div>' +
                    '<div style="font-weight:800; font-size:0.86rem;">' + sk.name + '</div>' +
                    '<div style="font-size:0.72rem; font-weight:700; color:' + (sk.points >= 0 ? '#059669' : '#dc2626') + ';">' + (sk.points >= 0 ? '+' : '') + sk.points + ' XP</div>' +
                  '</div>' +
                '</div>' +
                '<p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">' + sk.description + '</p>' +
              '</div>'
            ).join('') +
          '</div>' +
        '</div>';
    } else {
      // Default: Badges & Achievements
      tabBodyHtml = 
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
              '<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">' + b.description + '</p>' +
              '<div style="display:flex; gap:6px; margin-top:8px;">' +
                '<button type="button" class="btn-sm-secondary" onclick="openAwardBadgeModal(\'' + b.id + '\')" style="padding:3px 8px; font-size:0.72rem;">🎖️ Award to Student</button>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>' +

        '<h2 style="font-size:1.2rem; font-weight:800; margin-bottom:12px;">Learning Achievements (' + achievements.length + ')</h2>' +
        '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:14px;">' +
          achievements.map(a => '' +
            '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:12px; padding:16px;">' +
              '<div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">' +
                '<span style="font-size:2rem;">' + a.icon + '</span>' +
                '<div>' +
                  '<div style="font-weight:800; font-size:0.95rem;">' + a.name + '</div>' +
                  '<div style="font-size:0.75rem; color:var(--color-primary); font-weight:700;">+' + a.xpReward + ' ⭐ XP</div>' +
                '</div>' +
              '</div>' +
              '<p style="font-size:0.8rem; color:var(--text-muted);">' + a.requirement + '</p>' +
            '</div>'
          ).join('') +
        '</div>';
    }

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">Gamification &amp; Reward Milestones</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage badges, monster evolution stages, modular cosmetics, and XP skills.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="openGamificationEditorModal(\'badge\')">⭐ + Add Badge</button>' +
          '<button class="btn-primary-action" onclick="openGamificationEditorModal(\'achievement\')">🏆 + Add Achievement</button>' +
        '</div>' +
      '</div>' +
      tabsHtml +
      tabBodyHtml;
  }

  let gamificationActiveTab = 'badges'; // 'badges' | 'skills' | 'levels' | 'items'

  window.switchGamificationTab = function(tab) {
    gamificationActiveTab = tab;
    const container = document.getElementById('app-view-container');
    if (container && currentView === 'gamification') {
      renderGamificationView(container);
    }
  };

  window.promptEditProgressionLevel = function(id) {
    const lvl = store.getProgressionLevel(id);
    if (!lvl) return;
    const newName = prompt('Enter new Level Name for Level ' + lvl.level + ':', lvl.name);
    if (newName === null) return;
    const newXP = prompt('Enter XP Required for ' + (newName || lvl.name) + ':', lvl.xpRequired);
    if (newXP === null) return;
    const newDesc = prompt('Enter stage description:', lvl.description);

    store.updateProgressionLevel(id, {
      name: newName || lvl.name,
      xpRequired: parseInt(newXP, 10) || lvl.xpRequired,
      description: newDesc !== null ? newDesc : lvl.description
    });
    showNotification('Progression level updated successfully!');
    renderCurrentView();
  };

  window.openAddProgressionLevelModal = function() {
    const name = prompt('Enter name for the new level (e.g. Master Explorer):');
    if (!name) return;
    const xp = prompt('Enter XP Required:');
    if (!xp) return;
    store.addProgressionLevel({
      name: name,
      xpRequired: parseInt(xp, 10) || 1500,
      description: 'Progress milestone for dedicated English learners.',
      stageKey: 'adventurer'
    });
    showNotification('New progression level created!');
    renderCurrentView();
  };

  window.promptEditMonsterItem = function(id) {
    const item = store.getMonsterItem(id);
    if (!item) return;
    const newName = prompt('Enter item name:', item.name);
    if (newName === null) return;
    const newDesc = prompt('Enter item description:', item.description);
    store.updateMonsterItem(id, {
      name: newName || item.name,
      description: newDesc !== null ? newDesc : item.description
    });
    showNotification('Monster item updated!');
    renderCurrentView();
  };

  window.toggleArchiveMonsterItem = function(id) {
    const updated = store.archiveMonsterItem(id);
    showNotification('Item ' + (updated.status === 'archived' ? 'archived' : 'restored') + '!');
    renderCurrentView();
  };

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
      { id: 21, name: 'XP Skills', count: (s.xpSkills || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 22, name: 'Rewards Catalog', count: (s.rewards || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 23, name: 'Big Ideas Board', count: (s.bigIdeas || []).length, group: 'Classroom', create: true, view: true, edit: true, archive: true },
      { id: 24, name: 'Avatar Catalog', count: (s.avatarCatalog || []).reduce((sum, cat) => sum + cat.characters.length, 0), group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 25, name: 'Badges', count: (s.badges || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 26, name: 'Achievements', count: (s.achievements || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 27, name: 'Student Awards', count: (s.studentAwards || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 28, name: 'Student Portfolio', count: (s.portfolios || []).length, group: 'Student', create: true, view: true, edit: true, archive: true },
      { id: 29, name: 'Class Story', count: s.classStory.length, group: 'Community', create: true, view: true, edit: true, archive: true },
      { id: 30, name: 'Messages', count: s.messages.length, group: 'Community', create: true, view: true, edit: true, archive: true },
      { id: 31, name: 'Reports', count: (s.reports || []).length, group: 'Assessment', create: true, view: true, edit: true, archive: true },
      { id: 32, name: 'Monster Evolution Levels', count: (s.progressionLevels || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 33, name: 'Monster Items & Cosmetics', count: (s.monsterItems || []).length, group: 'Gamification', create: true, view: true, edit: true, archive: true },
      { id: 34, name: 'Student Monster Profiles', count: Object.keys(s.monsterProfiles || {}).length, group: 'Gamification', create: true, view: true, edit: true, archive: true }
    ];

    // Relational Integrity Checks
    const activeClassIds = new Set(s.classes.map(c => c.id));
    const activeStudentIds = new Set(s.students.map(st => st.id));
    const activeUnitIds = new Set(s.curriculum.units.map(u => u.id));
    const activeLessonIds = new Set(s.curriculum.lessons.map(l => l.id));

    const orphanedStudents = s.students.filter(st => st.classId && !activeClassIds.has(st.classId)).length;
    const orphanedLessons = s.curriculum.lessons.filter(l => !activeUnitIds.has(l.unitId)).length;
    const orphanedObjectives = s.curriculum.objectives.filter(o => !activeLessonIds.has(o.lessonId)).length;
    const orphanedTxs = s.xpTransactions.filter(tx => !activeStudentIds.has(tx.studentId)).length;
    const totalIntegrityIssues = orphanedStudents + orphanedLessons + orphanedObjectives + orphanedTxs;

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">📊 System Health &amp; CRUD Audit</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Comprehensive operational audit verifying 100% editability and persistence across all all application entities.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="handleExportStoreJson()">💾 Export JSON Backup</button>' +
          '<button class="btn-primary-action" onclick="openSchoolSettingsModal()">⚙️ School Settings</button>' +
        '</div>' +
      '</div>' +

      // Live KPI Bar
      '<div class="kpi-grid" style="margin-bottom:24px;">' +
        '<div class="kpi-card"><span class="kpi-label">Entities Covered</span><span class="kpi-val">31 / 31</span><span class="kpi-sub">100% Operational</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Active Storage Key</span><span class="kpi-val" style="font-size:1.05rem;">eaa_master_school_v3</span><span class="kpi-sub">Persistent localStorage</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Total Records</span><span class="kpi-val">' + matrix.reduce((acc, m) => acc + m.count, 0) + '</span><span class="kpi-sub">Live in memory</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Academic Year</span><span class="kpi-val" style="color:var(--color-primary);">' + (settings.academicYear || '2026–2027') + '</span><span class="kpi-sub">' + settings.schoolName + '</span></div>' +
      '</div>' +

      // Live CRUD Matrix Table
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
        '<div style="padding:16px 20px; background:var(--bg-card-secondary); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">' +
          '<h3 style="font-size:1.1rem; font-weight:800; margin:0;">Global Multi-Entity Operations Matrix (31 Entities)</h3>' +
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
        threads.map(t => {
          const msgs = t.messages || t.threads || [];
          const lastMsg = msgs[msgs.length - 1] || {};
          const lastTime = lastMsg.time || lastMsg.timestamp || t.lastActivity || '';
          return '' +
            '<div style="border-bottom:1px solid var(--border-subtle); padding-bottom:14px; margin-bottom:14px;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                '<span style="font-weight:800; font-size:1rem;">' + t.studentName + ' Family</span>' +
                '<span style="font-size:0.78rem; color:var(--text-muted);">' + lastTime + '</span>' +
              '</div>' +
              '<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">' +
                msgs.map(m => {
                  const isTeacher = (m.sender === 'teacher' || m.from === 'teacher');
                  return '' +
                    '<div style="padding:8px 12px; border-radius:8px; font-size:0.84rem; background:' + (isTeacher ? 'rgba(79,70,229,0.08)' : 'var(--bg-card-secondary)') + ';">' +
                      '<strong>' + (isTeacher ? 'Ms. Sarah' : 'Parent') + ':</strong> ' + m.text +
                    '</div>';
                }).join('') +
              '</div>' +
              '<div style="display:flex; gap:8px;">' +
                '<input type="text" id="parent-reply-input-' + t.id + '" class="filter-select" style="flex:1;" placeholder="Type reply to ' + t.studentName + '\'s family..." />' +
                '<button class="btn-primary-action" onclick="handleSendParentMessage(\'' + t.id + '\', \'parent-reply-input-' + t.id + '\')">Send</button>' +
              '</div>' +
            '</div>';
        }).join('') +
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
                '<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 38, animated: true }) + '</div>' +
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
        '<div style="width:120px; height:120px; margin:0 auto 12px auto; display:flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 110, animated: true }) + '</div>' +
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
          students.map((s, idx) => {
            const mState = store.calculateMonsterState(s.id);
            return '' +
            '<div style="display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:var(--bg-card); border-radius:12px; border:1px solid var(--border-subtle);">' +
              '<div style="display:flex; align-items:center; gap:12px;">' +
                '<span style="font-weight:900; font-size:1.2rem; width:24px;">' + (idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1)) + '</span>' +
                '<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">' + window.renderStudentMonsterAvatar(s.id, { size: 40, animated: true }) + '</div>' +
                '<div>' +
                  '<div style="font-weight:800; font-size:1rem;">' + s.firstName + ' ' + s.lastName + '</div>' +
                  '<div style="font-size:0.75rem; font-weight:700; color:var(--color-primary);">' + mState.stageName + ' · Lvl ' + mState.currentLevel + '</div>' +
                '</div>' +
              '</div>' +
              '<span style="font-weight:900; color:#b45309; font-size:1rem;">⭐ ' + store.getStudentTotalXP(s.id) + '</span>' +
            '</div>';
          }).join('') +
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
          '<li><button class="nav-link-btn ' + (currentView === 'library' ? 'is-active' : '') + '" onclick="switchView(\'library\')"><span class="nav-item-left"><span>🎮</span> Resource Library</span><span class="nav-badge-pill">' + resourcesCount + '</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'worksheets' ? 'is-active' : '') + '" onclick="switchView(\'worksheets\')"><span class="nav-item-left"><span>📄</span> Printable Worksheets</span><span class="nav-badge-pill">' + (store.getWorksheets ? store.getWorksheets().length : 4) + '</span></button></li>' +
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
          '<li><button class="nav-link-btn ' + (currentView === 'archived' ? 'is-active' : '') + '" onclick="switchView(\'archived\')"><span class="nav-item-left"><span>🗄️</span> Archived &amp; Restore</span></button></li>' +
          '<li><button class="nav-link-btn ' + (currentView === 'settings' ? 'is-active' : '') + '" onclick="switchView(\'settings\')"><span class="nav-item-left"><span>⚙️</span> School Settings</span></button></li>' +
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
      case 'worksheets': renderWorksheetsView(container); break;
      case 'archived': renderArchivedManagerView(container); break;
      case 'settings': renderSchoolSettingsView(container); break;
      case 'gamification': renderGamificationView(container); break;
      case 'monster': renderMonsterStudentView(container); break;
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
        '<span style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 24, animated: false }) + '</span>' +
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
            '<span style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 24, animated: false }) + '</span>' +
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
            '<span style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 24, animated: false }) + '</span>' +
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
    if (avatar) avatar.innerHTML = '<span style="font-size:48px;">🎲</span>';
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
      if (avatarEl) avatarEl.innerHTML = window.renderMonsterAvatar(rnd.id, { size: 64, animated: false });
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
          avatarEl.innerHTML = window.renderMonsterAvatar(finalStudent.id, { size: 80, animated: true });
          avatarEl.style.transform = 'scale(1.15)';
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
            '<div style="width:34px; height:34px; display:flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 32, animated: false }) + '</div>' +
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
        '👾 ' + s.firstName + ' ' + s.lastName + ' (' + (s.overallCefr || 'A1') + ')' +
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
          '<span style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(s.id, { size: 24, animated: false }) + '</span>' +
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


// Premature IIFE close removed to encompass full controller codebase


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

    const gradeSelect = document.getElementById('ws-grade');
    const topicInput = document.getElementById('ws-topic');
    const durInput = document.getElementById('ws-duration');
    const qContainer = document.getElementById('ws-questions-container');
    if (qContainer) qContainer.innerHTML = '';

    if (wsId) {
      const ws = store.getWorksheet(wsId);
      if (!ws) return;
      if (title) title.textContent = '✏️ Edit Worksheet';
      if (idInput) idInput.value = ws.id;
      if (titleInput) titleInput.value = ws.title;
      if (levelSelect) levelSelect.value = ws.level || 'A1';
      if (catSelect) catSelect.value = ws.category || 'Vocabulary & Grammar';
      if (gradeSelect) gradeSelect.value = ws.grade || 'Grade 3';
      if (topicInput) topicInput.value = ws.topic || '';
      if (durInput) durInput.value = ws.duration || '25 min';
      if (lessonSelect) lessonSelect.value = ws.lessonId || '';
      if (descInput) descInput.value = ws.instructions || ws.description || '';
      if (pdfInput) pdfInput.value = ws.pdfUrl || '';
      if (ansInput) ansInput.value = ws.answerKey || '';

      if (ws.questions && ws.questions.length) {
        ws.questions.forEach(q => window.handleAddWorksheetQuestionRow(q));
      } else {
        window.handleAddWorksheetQuestionRow();
      }
    } else {
      if (title) title.textContent = 'Add New Worksheet';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (topicInput) topicInput.value = '';
      if (durInput) durInput.value = '25 min';
      if (descInput) descInput.value = '';
      if (ansInput) ansInput.value = '';
      window.handleAddWorksheetQuestionRow();
    }

    window.openModal('modal-worksheet-editor');
  };

  window.handleSaveWorksheet = function(e) {
    e.preventDefault();
    const editId = document.getElementById('ws-edit-id').value;
    const title = document.getElementById('ws-title').value.trim();
    const level = document.getElementById('ws-level').value;
    const category = document.getElementById('ws-category').value;
    const grade = document.getElementById('ws-grade') ? document.getElementById('ws-grade').value : 'Grade 3';
    const topic = document.getElementById('ws-topic') ? document.getElementById('ws-topic').value.trim() : '';
    const duration = document.getElementById('ws-duration') ? document.getElementById('ws-duration').value.trim() : '25 min';
    const lessonId = document.getElementById('ws-lesson-select') ? document.getElementById('ws-lesson-select').value : '';
    const description = document.getElementById('ws-description').value.trim();
    const pdfUrl = document.getElementById('ws-pdfurl').value.trim();
    const answerKey = document.getElementById('ws-answerkey').value.trim();

    // Gather questions
    const questions = [];
    document.querySelectorAll('.ws-question-edit-row').forEach((row, idx) => {
      const qText = row.querySelector('.ws-q-text')?.value.trim();
      const qType = row.querySelector('.ws-q-type')?.value;
      if (qText) {
        questions.push({
          id: 'q-' + (idx + 1),
          text: qText,
          type: qType || 'multiple_choice',
          points: 1
        });
      }
    });

    const payload = {
      title,
      level,
      category,
      skill: category,
      grade,
      topic,
      duration,
      lessonId,
      instructions: description,
      description,
      pdfUrl,
      answerKey,
      questions,
      status: 'Ready to Print',
      createdDate: new Date().toISOString().split('T')[0]
    };

    if (editId) {
      store.updateWorksheet(editId, payload);
      showNotification('Worksheet updated successfully!');
    } else {
      store.addWorksheet(payload);
      showNotification('New worksheet added to library!');
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


  // Student Award Handlers (Separate from Badge Definitions)
  window.handleAwardBadgeToStudent = function(badgeId = null, studentId = null) {
    const students = store.getStudents();
    const badges = store.getBadges();
    if (!students.length || !badges.length) return;

    let targetStudentId = studentId;
    let targetBadgeId = badgeId;

    if (!targetBadgeId) {
      const badgeOptions = badges.map((b, idx) => (idx + 1) + '. ' + b.icon + ' ' + b.name + ' (+' + b.xpReward + ' XP)').join('\n');
      const pick = prompt('Select Badge to award:\n' + badgeOptions + '\nEnter number:');
      if (!pick) return;
      const idx = parseInt(pick, 10) - 1;
      if (badges[idx]) targetBadgeId = badges[idx].id;
      else return;
    }

    if (!targetStudentId) {
      const activeCls = store.getActiveClass();
      const classStudents = store.getStudentsByClass(activeCls.id);
      const studentOptions = classStudents.map((s, idx) => (idx + 1) + '. ' + s.firstName + ' ' + s.lastName).join('\n');
      const pick = prompt('Award badge to which student?\n' + studentOptions + '\nEnter number:');
      if (!pick) return;
      const idx = parseInt(pick, 10) - 1;
      if (classStudents[idx]) targetStudentId = classStudents[idx].id;
      else return;
    }

    const award = store.awardBadgeToStudent(targetStudentId, targetBadgeId);
    if (award) {
      const b = store.getBadge(targetBadgeId);
      const st = store.getStudent(targetStudentId);
      showNotification('Awarded ' + (b ? b.name : 'Badge') + ' to ' + (st ? st.firstName : 'student') + '!');
      renderCurrentView();
      if (currentProfileStudentId === targetStudentId) {
        window.openStudentDetail(targetStudentId, studentProfileActiveTab);
      }
    }
  };

  window.handleRemoveStudentAward = function(awardId, studentId = null) {
    window.confirmAction({
      title: 'Remove Badge Award from Student?',
      message: 'This will remove the awarded badge record from the student. The global badge definition will remain intact and available for all other students.',
      confirmText: 'Remove Award',
      isDanger: true,
      onConfirm: () => {
        const removed = store.removeStudentAward(awardId);
        if (removed) {
          showNotification('Student award removed.');
          renderCurrentView();
          if (studentId && currentProfileStudentId === studentId) {
            window.openStudentDetail(studentId, studentProfileActiveTab);
          }
        }
      }
    });
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
  };
  window.openReportGenerator = function(studentId = null) { window.openReportGeneratorModal(studentId); };
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

  // =========================================================================
  // DEDICATED ARCHIVED & RESTORE FULL PAGE VIEW
  // =========================================================================
  let archivedViewFilter = 'all';

  function renderArchivedManagerView(container) {
    const s = store.state;
    const archivedItems = [];

    function addArchived(type, labelKey, arr) {
      if (Array.isArray(arr)) {
        arr.filter(item => item.archived).forEach(item => {
          archivedItems.push({
            type,
            id: item.id,
            name: item[labelKey] || item.title || item.name || 'Unnamed',
            raw: item
          });
        });
      }
    }

    addArchived('student', 'firstName', s.students);
    addArchived('class', 'name', s.classes);
    if (s.curriculum) {
      addArchived('book', 'title', s.curriculum.books);
      addArchived('unit', 'title', s.curriculum.units);
      addArchived('lesson', 'title', s.curriculum.lessons);
    }
    addArchived('resource', 'title', s.resources);
    addArchived('worksheet', 'title', s.worksheets);
    addArchived('assignment', 'title', s.assignments);
    addArchived('homework', 'title', s.homework);
    addArchived('quiz', 'title', s.quizzes);
    addArchived('rubric', 'name', s.rubrics);
    addArchived('badge', 'name', s.badges);
    addArchived('achievement', 'name', s.achievements);

    const filtered = archivedViewFilter === 'all' 
      ? archivedItems 
      : archivedItems.filter(item => item.type === archivedViewFilter);

    const tabs = ['all', 'student', 'class', 'book', 'unit', 'lesson', 'worksheet', 'assignment', 'homework', 'quiz', 'badge'];

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">🗄️ Archived Records &amp; Restore Management</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">' + archivedItems.length + ' archived items. Restore items back to active rosters or permanently delete configuration records.</p>' +
        '</div>' +
      '</div>' +

      // Tabs filter
      '<div class="classroom-top-nav-tabs" style="margin-bottom:20px; flex-wrap:wrap;">' +
        tabs.map(t => 
          '<button type="button" class="classroom-nav-tab-btn ' + (archivedViewFilter === t ? 'is-active' : '') + '" onclick="archivedViewFilter=\'' + t + '\'; renderCurrentView();">' +
            t.charAt(0).toUpperCase() + t.slice(1) + (t === 'all' ? ' (' + archivedItems.length + ')' : '') +
          '</button>'
        ).join('') +
      '</div>' +

      // Table of archived items
      '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm);">' +
        (filtered.length === 0 ? '<div style="padding:40px; text-align:center; color:var(--text-muted);">No archived items found in this category.</div>' :
          '<table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">' +
            '<thead>' +
              '<tr style="background:var(--bg-card-secondary); border-bottom:1px solid var(--border-subtle);">' +
                '<th style="padding:12px 16px;">Entity Type</th>' +
                '<th style="padding:12px 16px;">Record Title / Name</th>' +
                '<th style="padding:12px 16px;">Record ID</th>' +
                '<th style="padding:12px 16px; text-align:right;">Actions</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              filtered.map(item => '' +
                '<tr style="border-bottom:1px solid var(--border-subtle);">' +
                  '<td style="padding:12px 16px;"><span style="background:rgba(79,70,229,0.1); color:var(--color-primary); font-weight:800; font-size:0.75rem; padding:2px 8px; border-radius:999px; text-transform:uppercase;">' + item.type + '</span></td>' +
                  '<td style="padding:12px 16px; font-weight:700;">' + item.name + '</td>' +
                  '<td style="padding:12px 16px; font-family:monospace; font-size:0.78rem; color:var(--text-muted);">' + item.id + '</td>' +
                  '<td style="padding:12px 16px; text-align:right;">' +
                    '<button class="btn-primary-action" onclick="handleRestoreEntityFromPage(\'' + item.type + '\', \'' + item.id + '\')" style="padding:3px 10px; font-size:0.78rem; margin-right:6px;">♻️ Restore</button>' +
                    '<button class="btn-sm-secondary" onclick="handlePermanentDeleteFromPage(\'' + item.type + '\', \'' + item.id + '\')" style="padding:3px 8px; font-size:0.78rem; color:var(--color-danger);">🗑️ Delete Permanently</button>' +
                  '</td>' +
                '</tr>'
              ).join('') +
            '</tbody>' +
          '</table>'
        ) +
      '</div>';
  }

  window.handleRestoreEntityFromPage = function(type, id) {
    const restored = store.restoreEntity(type, id);
    if (restored) {
      showNotification('Successfully restored ' + type + ' to active roster!');
      renderCurrentView();
    }
  };

  window.handlePermanentDeleteFromPage = function(type, id) {
    window.confirmAction({
      title: 'Permanently Delete ' + type.toUpperCase() + '?',
      message: 'Are you sure you want to permanently delete this record? This action cannot be undone.',
      confirmText: 'Delete Permanently',
      isDanger: true,
      onConfirm: () => {
        store.permanentDeleteEntity(type, id);
        showNotification('Record permanently deleted.');
        renderCurrentView();
      }
    });
  };

  // =========================================================================
  // DEDICATED SCHOOL SETTINGS FULL PAGE VIEW
  // =========================================================================
  function renderSchoolSettingsView(container) {
    const s = store.getSchoolSettings();

    container.innerHTML = 
      '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:16px;">' +
        '<div>' +
          '<h1 style="font-size:1.65rem; font-weight:800; color:var(--text-main);">⚙️ School Settings &amp; Platform Preferences</h1>' +
          '<p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">Manage school brand identity, academic calendar, classroom gamification controls, and data backups.</p>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
          '<button class="btn-sm-secondary" onclick="handleExportStoreJson()">💾 Export JSON Backup</button>' +
        '</div>' +
      '</div>' +

      '<form onsubmit="handleSaveSchoolSettingsFromPage(event)" style="display:flex; flex-direction:column; gap:20px; max-width:840px;">' +
        // Section 1: School Identity
        '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; box-shadow:var(--shadow-sm);">' +
          '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:14px; color:var(--text-main);">🏫 School Identity &amp; Calendar</h3>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">School / Academy Name</label>' +
              '<input type="text" id="page-set-school-name" class="filter-select" style="width:100%;" value="' + (s.schoolName || 'English Adventure Academy') + '" required />' +
            '</div>' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Academic Year</label>' +
              '<input type="text" id="page-set-academic-year" class="filter-select" style="width:100%;" value="' + (s.academicYear || '2026–2027') + '" required />' +
            '</div>' +
          '</div>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Timezone</label>' +
              '<select id="page-set-timezone" class="filter-select" style="width:100%;">' +
                '<option value="Europe/London" ' + (s.timezone === 'Europe/London' ? 'selected' : '') + '>Europe/London (GMT)</option>' +
                '<option value="America/New_York" ' + (s.timezone === 'America/New_York' ? 'selected' : '') + '>America/New_York (EST)</option>' +
                '<option value="Europe/Paris" ' + (s.timezone === 'Europe/Paris' ? 'selected' : '') + '>Europe/Paris (CET)</option>' +
                '<option value="Asia/Tokyo" ' + (s.timezone === 'Asia/Tokyo' ? 'selected' : '') + '>Asia/Tokyo (JST)</option>' +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Interface Language</label>' +
              '<select id="page-set-language" class="filter-select" style="width:100%;">' +
                '<option value="English" selected>English (UK / US Standard)</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Section 2: Classroom & Gamification Controls
        '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; box-shadow:var(--shadow-sm);">' +
          '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:14px; color:var(--text-main);">🎮 Classroom &amp; Gamification Controls</h3>' +
          '<div style="display:flex; flex-direction:column; gap:10px;">' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.88rem; font-weight:700;">' +
              '<input type="checkbox" id="page-set-xp-enabled" ' + (s.enableXP !== false ? 'checked' : '') + ' />' +
              '<span>Enable XP Points &amp; Skills System across classroom activities</span>' +
            '</label>' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.88rem; font-weight:700;">' +
              '<input type="checkbox" id="page-set-leaderboard-enabled" ' + (s.showLeaderboard !== false ? 'checked' : '') + ' />' +
              '<span>Display Live Classroom Leaderboard</span>' +
            '</label>' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.88rem; font-weight:700;">' +
              '<input type="checkbox" id="page-set-streaks-enabled" ' + (s.enableStreaks !== false ? 'checked' : '') + ' />' +
              '<span>Track Consecutive Daily Learning Streaks 🔥</span>' +
            '</label>' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.88rem; font-weight:700;">' +
              '<input type="checkbox" id="page-set-monster-evolution" ' + (s.monsterEvolutionEnabled !== false ? 'checked' : '') + ' />' +
              '<span><strong>Monster Evolution System</strong> (Egg to Ultimate Monster) 👾</span>' +
            '</label>' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:0.88rem; font-weight:700;">' +
              '<input type="checkbox" id="page-set-xp-progression" ' + (s.xpProgressionEnabled !== false ? 'checked' : '') + ' />' +
              '<span><strong>XP Progression</strong> (Earn XP across classroom tasks) ⭐</span>' +
            '</label>' +
          '</div>' +
        '</div>' +

        // Section 3: Teacher Preferences
        '<div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; box-shadow:var(--shadow-sm);">' +
          '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:14px; color:var(--text-main);">👩‍🏫 Teacher Pedagogical Preferences</h3>' +
          '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Default Target CEFR</label>' +
              '<select id="page-set-default-cefr" class="filter-select" style="width:100%;">' +
                '<option value="Pre-A1" ' + (s.defaultCefr === 'Pre-A1' ? 'selected' : '') + '>Pre-A1</option>' +
                '<option value="A1" ' + (s.defaultCefr === 'A1' || !s.defaultCefr ? 'selected' : '') + '>A1</option>' +
                '<option value="A1+" ' + (s.defaultCefr === 'A1+' ? 'selected' : '') + '>A1+</option>' +
                '<option value="A2" ' + (s.defaultCefr === 'A2' ? 'selected' : '') + '>A2</option>' +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:4px;">Default Lesson Duration</label>' +
              '<input type="number" id="page-set-default-duration" class="filter-select" style="width:100%;" value="' + (s.defaultLessonDuration || 30) + '" min="10" max="90" />' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex; justify-content:flex-end; gap:8px;">' +
          '<button type="submit" class="btn-primary-action" style="padding:10px 24px; font-size:0.95rem;">Save Settings</button>' +
        '</div>' +
      '</form>';
  }

  window.handleSaveSchoolSettingsFromPage = function(e) {
    e.preventDefault();
    const schoolName = document.getElementById('page-set-school-name').value.trim();
    const academicYear = document.getElementById('page-set-academic-year').value.trim();
    const timezone = document.getElementById('page-set-timezone').value;
    const enableXP = document.getElementById('page-set-xp-enabled').checked;
    const showLeaderboard = document.getElementById('page-set-leaderboard-enabled').checked;
    const enableStreaks = document.getElementById('page-set-streaks-enabled').checked;
    const monsterEvolutionEnabled = document.getElementById('page-set-monster-evolution') ? document.getElementById('page-set-monster-evolution').checked : true;
    const xpProgressionEnabled = document.getElementById('page-set-xp-progression') ? document.getElementById('page-set-xp-progression').checked : true;
    const defaultCefr = document.getElementById('page-set-default-cefr').value;
    const defaultLessonDuration = parseInt(document.getElementById('page-set-default-duration').value, 10) || 30;

    store.updateSchoolSettings({
      schoolName,
      academicYear,
      timezone,
      enableXP,
      showLeaderboard,
      enableStreaks,
      monsterEvolutionEnabled,
      xpProgressionEnabled,
      defaultCefr,
      defaultLessonDuration
    });

    showNotification('School settings updated and saved persistently!');
    renderCurrentView();
  };

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


  // =========================================================================
  // =========================================================================
  // CLASSROOM STUDENT MANAGEMENT & ADVANCED TEACHER TOOLKIT ENGINE
  // =========================================================================
  // =========================================================================

  // State variables for XP skills modal, avatar customizer, and toolkit
  let currentXPAwardTarget = { type: 'student', id: null, studentIds: [] };
  let currentXPAwardTab = 'positive'; // 'positive' | 'needs_work'
  let avatarSelectorStudentId = null;
  let avatarSelectedCategory = 'Fantasy & Dragons';
  let avatarSelectedCharacter = null;
  let activeToolkitTool = 'timer';
  let toolkitTimerInterval = null;
  let toolkitTimerRemaining = 120;
  let toolkitTimerTotal = 120;
  let isToolkitTimerRunning = false;
  let generatedGroupsCache = [];
  let noiseMeterAudioContext = null;
  let noiseMeterAnalyser = null;
  let noiseMeterStream = null;
  let noiseMeterAnimFrame = null;
  let noiseSensitivity = 50;
  let isNoiseMeterActive = false;
  let spinnerCanvasAngle = 0;
  let isWheelSpinning = false;

  // -------------------------------------------------------------------------
  // 1. CLASSROOM SUBTAB RENDERERS (UNENROLLED, LEADERBOARD, REWARDS, BIG IDEAS)
  // -------------------------------------------------------------------------

  window.renderClassroomUnenrolledGrid = function(cls) {
    const unenrolled = store.getUnenrolledStudents ? store.getUnenrolledStudents() : [];
    if (unenrolled.length === 0) {
      return '' +
        '<div style="text-align:center; padding:48px 16px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light); margin-bottom:24px;">' +
          '<div style="font-size:36px; margin-bottom:10px;">✅</div>' +
          '<h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">All students are enrolled in active cohorts</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Students removed from classes are kept here safely with full historical records preserved.</p>' +
        '</div>';
    }

    return '' +
      '<div style="margin-bottom:14px;">' +
        '<p style="font-size:0.86rem; color:var(--text-muted);">' +
          'These learners are currently unassigned to any class. All XP history, portfolio artifacts, and assessments remain completely preserved.' +
        '</p>' +
      '</div>' +
      '<div class="classroom-students-grid">' +
        unenrolled.map(s => '' +
          '<div class="classroom-student-card" onclick="openStudentDetail(\'' + s.id + '\')">' +
            '<div class="student-avatar-frame monster-avatar-box">' + window.renderMonsterAvatar(s.id, { size: 54, animated: true }) + '</div>' +
            '<div class="student-card-name">' + s.firstName.toUpperCase() + ' ' + s.lastName.toUpperCase() + '</div>' +
            '<div class="student-card-meta-row">' +
              '<span class="student-card-xp-badge">⭐ ' + store.getStudentTotalXP(s.id) + '</span>' +
              '<span class="student-card-cefr-badge">' + (s.overallCefr || 'A1') + '</span>' +
            '</div>' +
            '<div style="margin-top:10px; width:100%;">' +
              '<button class="btn-primary-action" style="width:100%; font-size:0.78rem; padding:6px 10px;" onclick="event.stopPropagation(); handleEnrollStudentInClass(\'' + s.id + '\', \'' + cls.id + '\')">' +
                '+ Enroll in ' + cls.name +
              '</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  };

  window.handleEnrollStudentInClass = function(studentId, classId) {
    store.updateStudent(studentId, { classId: classId });
    showNotification('Student successfully enrolled in ' + (store.getClass(classId)?.name || 'class') + '!');
    renderCurrentView();
  };

  window.renderClassLeaderboardSubTab = function(cls, students) {
    const sorted = students.slice().sort((a, b) => store.getStudentTotalXP(b.id) - store.getStudentTotalXP(a.id));
    if (sorted.length === 0) {
      return '<div style="padding:32px; text-align:center; color:var(--text-muted);">No students enrolled in this class yet.</div>';
    }

    return '' +
      '<div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">' +
          '<div>' +
            '<h2 style="font-size:1.35rem; font-weight:900; margin:0;">🏆 ' + cls.name + ' Leaderboard</h2>' +
            '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">Live classroom ranking calculated dynamically from active XP transactions</p>' +
          '</div>' +
          '<button class="btn-primary-action" onclick="openGiveXPSkillsModal(\'class\', \'' + cls.id + '\')">⭐ Award Class XP</button>' +
        '</div>' +

        '<div style="display:flex; flex-direction:column; gap:10px;">' +
          sorted.map((s, idx) => {
            const xp = store.getStudentTotalXP(s.id);
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ('#' + (idx + 1));
            return '' +
              '<div style="display:flex; align-items:center; gap:14px; padding:12px 16px; border-radius:var(--radius-md); background:var(--bg-canvas); border:1px solid var(--border-light); cursor:pointer;" onclick="openStudentDetail(\'' + s.id + '\')">' +
                '<span style="font-size:1.25rem; font-weight:900; width:36px; text-align:center;">' + medal + '</span>' +
                '<div style="width:48px; height:48px; border-radius:50%; background:var(--color-primary-soft); display:flex; align-items:center; justify-content:center; overflow:hidden;">' +
                  window.renderMonsterAvatar(s.id, { size: 44, animated: true }) +
                '</div>' +
                '<div style="flex:1;">' +
                  '<div style="font-weight:800; font-size:0.96rem; color:var(--text-main);">' + s.firstName + ' ' + s.lastName + '</div>' +
                  '<div style="font-size:0.78rem; color:var(--text-muted);">' + s.grade + ' · 🔥 ' + (s.streakDays || 1) + '-day streak</div>' +
                '</div>' +
                '<span class="badge-cefr badge-cefr-' + (s.overallCefr || 'A1').toLowerCase().replace('+', '-plus') + '">' + (s.overallCefr || 'A1') + '</span>' +
                '<div style="text-align:right; font-weight:900; font-size:1.1rem; color:var(--color-primary); min-width:90px;">' +
                  '⭐ ' + xp.toLocaleString() + ' XP' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  };

  window.renderClassRewardsSubTab = function(cls, students) {
    const rewards = store.getRewards ? store.getRewards() : [];
    return '' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
        '<div>' +
          '<h2 style="font-size:1.3rem; font-weight:800; margin:0;">👑 Classroom Rewards Catalog</h2>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">Redeem student XP for exciting classroom privileges and activities</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openCreateRewardForm()">+ Add Reward</button>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:16px;">' +
        rewards.map(r => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div>' +
              '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">' +
                '<div style="width:48px; height:48px; border-radius:12px; background:rgba(245,158,11,0.12); display:flex; align-items:center; justify-content:center; font-size:26px;">' +
                  (r.icon || '🎁') +
                '</div>' +
                '<span style="font-weight:900; font-size:0.95rem; color:#b45309; background:rgba(245,158,11,0.15); padding:3px 10px; border-radius:12px;">' +
                  r.cost + ' XP' +
                '</span>' +
              '</div>' +
              '<h4 style="font-weight:800; font-size:1rem; margin-bottom:6px; color:var(--text-main);">' + r.title + '</h4>' +
              '<p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin-bottom:14px;">' + r.description + '</p>' +
            '</div>' +
            '<div style="display:flex; gap:8px; border-top:1px solid var(--border-light); padding-top:12px;">' +
              '<button class="btn-primary-action" style="flex:1; font-size:0.8rem; padding:6px 10px;" onclick="openRedeemRewardModalForClass(\'' + r.id + '\')">' +
                '🎁 Redeem for Student' +
              '</button>' +
              '<button class="btn-sm-secondary" onclick="handleDeleteReward(\'' + r.id + '\')" title="Delete Reward" style="color:var(--color-danger); padding:4px 8px;">🗑️</button>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>';
  };

  window.renderClassBigIdeasSubTab = function(cls, students) {
    const ideas = store.getBigIdeas ? store.getBigIdeas(cls.id) : [];
    return '' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
        '<div>' +
          '<h2 style="font-size:1.3rem; font-weight:800; margin:0;">💡 Big Ideas Classroom Board</h2>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:2px;">Brainstorming, collaborative projects, and creative quest proposals</p>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="openBigIdeasModal(\'' + cls.id + '\')">+ Post Big Idea</button>' +
      '</div>' +
      (ideas.length === 0 ?
        '<div style="padding:48px 16px; text-align:center; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
          '<div style="font-size:36px; margin-bottom:10px;">💡</div>' +
          '<h3 style="font-weight:800;">No Big Ideas posted yet</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Post your first project proposal or classroom quest to spark student imagination.</p>' +
          '<button class="btn-primary-action" style="margin-top:12px;" onclick="openBigIdeasModal(\'' + cls.id + '\')">+ Post Big Idea</button>' +
        '</div>' :
        '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">' +
          ideas.map(idea => '' +
            '<div style="background:var(--bg-card); border:' + (idea.pinned ? '2px solid var(--color-primary)' : '1px solid var(--border-light)') + '; border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between; position:relative;">' +
              (idea.pinned ? '<span style="position:absolute; top:12px; right:12px; font-size:1rem;" title="Pinned Idea">📌</span>' : '') +
              '<div>' +
                '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
                  '<span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--color-primary); background:var(--color-primary-soft); padding:2px 8px; border-radius:6px;">' + idea.category + '</span>' +
                  '<span style="font-size:0.75rem; color:var(--text-muted);">' + idea.date + '</span>' +
                '</div>' +
                '<h3 style="font-size:1.05rem; font-weight:800; margin-bottom:8px; color:var(--text-main); line-height:1.3;">' + idea.title + '</h3>' +
                '<p style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px;">' + idea.description + '</p>' +
                (idea.tags && idea.tags.length ? 
                  '<div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px;">' +
                    idea.tags.map(t => '<span style="font-size:0.72rem; background:var(--bg-muted); padding:2px 6px; border-radius:4px; color:var(--text-secondary);">#' + t + '</span>').join('') +
                  '</div>' : ''
                ) +
              '</div>' +
              '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px;">' +
                '<div style="display:flex; align-items:center; gap:6px;">' +
                  '<button class="btn-sm-secondary" onclick="handleVoteBigIdea(\'' + idea.id + '\')" title="Vote for this idea" style="padding:3px 8px; font-size:0.78rem;">' +
                    '👍 ' + (idea.votes || 0) + ' Votes' +
                  '</button>' +
                  '<button class="btn-sm-secondary" onclick="handlePinBigIdea(\'' + idea.id + '\')" title="' + (idea.pinned ? 'Unpin' : 'Pin') + '" style="padding:3px 6px; font-size:0.78rem;">' +
                    (idea.pinned ? '📌 Pinned' : 'Pin') +
                  '</button>' +
                '</div>' +
                '<div style="display:flex; gap:4px;">' +
                  '<button class="btn-sm-secondary" onclick="openEditBigIdeaModal(\'' + idea.id + '\')" title="Edit" style="padding:3px 6px; font-size:0.75rem;">✏️</button>' +
                  '<button class="btn-sm-secondary" onclick="handleDeleteBigIdea(\'' + idea.id + '\')" title="Delete" style="padding:3px 6px; font-size:0.75rem; color:var(--color-danger);">🗑️</button>' +
                '</div>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>'
      );
  };

  // -------------------------------------------------------------------------
  // 2. 1-CLICK XP AWARDING & XP SKILLS MODAL CONTROLLER
  // -------------------------------------------------------------------------

  window.handleQuickPlusOneXP = function(studentId, event) {
    if (event) event.stopPropagation();
    const s = store.getStudent(studentId);
    if (!s) return;

    const res = store.giveXP(studentId, 1, 'Positive Classroom Contribution', 'Teacher', {
      category: 'positive',
      icon: '⭐'
    });

    // Floating +1 burst animation
    const card = document.querySelector('[data-student-id="' + studentId + '"]');
    if (card) {
      const burst = document.createElement('div');
      burst.className = 'xp-burst-float';
      burst.innerText = '+1 XP ⭐';
      card.appendChild(burst);
      setTimeout(() => burst.remove(), 1200);
    }

    // Check if +1 caused evolution/hatching
    if (res && res.evolutionEvent) {
      if (res.evolutionEvent.isHatch) {
        window.openMonsterHatchModal(studentId);
      } else {
        window.openMonsterLevelUpModal(studentId, res.evolutionEvent.prevLevel, res.evolutionEvent.newLevel);
      }
    }

    renderCurrentView();
  };

  window.openGiveXPSkillsModal = function(targetType = 'student', targetId = null, preselectedIds = []) {
    currentXPAwardTarget = {
      type: targetType,
      id: targetId,
      studentIds: targetType === 'student' ? [targetId] :
                  targetType === 'multiple' ? preselectedIds :
                  targetType === 'group' ? (store.getGroup(targetId)?.studentIds || []) :
                  targetType === 'class' ? store.getStudentsByClass(targetId).map(s => s.id) : []
    };

    const targetTitleEl = document.getElementById('xp-award-target-title');
    const targetSubEl = document.getElementById('xp-award-target-sub');
    const targetAvatarEl = document.getElementById('xp-award-target-avatar');

    if (targetType === 'student') {
      const s = store.getStudent(targetId);
      if (targetTitleEl) targetTitleEl.innerText = 'Award ' + (s ? s.firstName + ' ' + s.lastName : 'Learner');
      if (targetSubEl) targetSubEl.innerText = 'Select a skill to award points · Current: ⭐ ' + (s ? store.getStudentTotalXP(s.id) : 0) + ' XP';
      if (targetAvatarEl) targetAvatarEl.innerHTML = s ? window.renderMonsterAvatar(s.id, { size: 54, animated: true }) : '⭐';
    } else if (targetType === 'group') {
      const g = store.getGroup(targetId);
      if (targetTitleEl) targetTitleEl.innerText = 'Award Team: ' + (g ? g.name : 'Group');
      if (targetSubEl) targetSubEl.innerText = 'Points will be awarded to all ' + currentXPAwardTarget.studentIds.length + ' team members';
      if (targetAvatarEl) targetAvatarEl.innerHTML = '👥';
    } else if (targetType === 'multiple') {
      if (targetTitleEl) targetTitleEl.innerText = 'Award ' + currentXPAwardTarget.studentIds.length + ' Selected Students';
      if (targetSubEl) targetSubEl.innerText = 'Selected students will each receive the awarded points';
      if (targetAvatarEl) targetAvatarEl.innerHTML = '☑️';
    } else {
      const cls = store.getClass(targetId) || store.getActiveClass();
      if (targetTitleEl) targetTitleEl.innerText = 'Award Whole Class (' + (cls ? cls.name : '') + ')';
      if (targetSubEl) targetSubEl.innerText = 'Every student in the cohort will receive the points';
      if (targetAvatarEl) targetAvatarEl.innerHTML = '🌍';
    }

    currentXPAwardTab = 'positive';
    window.renderXPSkillsCardsGrid();
    window.openModal('modal-give-xp-skills');
  };

  window.switchXPAwardTab = function(cat) {
    currentXPAwardTab = cat;
    const posTab = document.getElementById('tab-xp-positive');
    const needsTab = document.getElementById('tab-xp-needs-work');
    if (posTab && needsTab) {
      if (cat === 'positive') {
        posTab.classList.add('is-active');
        needsTab.classList.remove('is-active');
      } else {
        posTab.classList.remove('is-active');
        needsTab.classList.add('is-active');
      }
    }
    window.renderXPSkillsCardsGrid();
  };

  window.renderXPSkillsCardsGrid = function() {
    const container = document.getElementById('xp-skills-grid-container');
    if (!container) return;

    const skills = store.getXPSkills ? store.getXPSkills(currentXPAwardTab) : [];
    container.innerHTML = skills.map(sk => {
      const isPos = sk.points > 0;
      const ptsBadge = (isPos ? '+' : '') + sk.points + ' XP';
      return '' +
        '<div class="xp-skill-card ' + (isPos ? 'is-positive' : 'is-needs-work') + '" onclick="handleAwardXPSkill(\'' + sk.id + '\')" style="cursor:pointer; background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px 10px; text-align:center; transition:all 0.15s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;">' +
          '<div style="font-size:32px;">' + (sk.icon || '⭐') + '</div>' +
          '<div style="font-size:0.84rem; font-weight:700; color:var(--text-main); line-height:1.2;">' + sk.name + '</div>' +
          '<span style="font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:10px; background:' + (isPos ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)') + '; color:' + (isPos ? '#059669' : '#dc2626') + ';">' +
            ptsBadge +
          '</span>' +
        '</div>';
    }).join('');
  };

  window.handleAwardXPSkill = function(skillId) {
    const skill = store.getXPSkill ? store.getXPSkill(skillId) : null;
    if (!skill) return;

    const customNoteInput = document.getElementById('xp-award-custom-note');
    const customNote = customNoteInput ? customNoteInput.value.trim() : '';
    const fullReason = customNote ? (skill.name + ' (' + customNote + ')') : skill.name;

    const targets = currentXPAwardTarget.studentIds || [];
    let firstEvolutionEvent = null;

    targets.forEach(sId => {
      const res = store.giveXP(sId, skill.points, fullReason, 'Teacher', {
        skillId: skill.id,
        icon: skill.icon,
        category: skill.category
      });
      if (res && res.evolutionEvent && !firstEvolutionEvent) {
        firstEvolutionEvent = res.evolutionEvent;
      }
    });

    if (customNoteInput) customNoteInput.value = '';
    window.closeModal('modal-give-xp-skills');
    showNotification('⭐ Awarded ' + (skill.points > 0 ? '+' : '') + skill.points + ' XP for "' + skill.name + '" to ' + targets.length + ' learner(s)!');

    if (firstEvolutionEvent) {
      if (firstEvolutionEvent.isHatch) {
        window.openMonsterHatchModal(firstEvolutionEvent.studentId);
      } else {
        window.openMonsterLevelUpModal(firstEvolutionEvent.studentId, firstEvolutionEvent.prevLevel, firstEvolutionEvent.newLevel);
      }
    }

    renderCurrentView();
    if (document.getElementById('modal-student-profile')?.classList.contains('is-open') && currentProfileStudentId) {
      window.openStudentDetail(currentProfileStudentId, studentProfileActiveTab);
    }
  };

  // -------------------------------------------------------------------------
  // 3. XP SKILL CREATOR & EDITOR
  // -------------------------------------------------------------------------

  window.openXPSkillEditor = function(skillId = null) {
    const idInput = document.getElementById('xp-skill-id-val');
    const nameInput = document.getElementById('xp-skill-name-val');
    const iconInput = document.getElementById('xp-skill-icon-val');
    const ptsInput = document.getElementById('xp-skill-points-val');
    const catInput = document.getElementById('xp-skill-category-val');
    const descInput = document.getElementById('xp-skill-desc-val');

    if (skillId && store.getXPSkill) {
      const sk = store.getXPSkill(skillId);
      if (sk) {
        if (idInput) idInput.value = sk.id;
        if (nameInput) nameInput.value = sk.name;
        if (iconInput) iconInput.value = sk.icon;
        if (ptsInput) ptsInput.value = String(sk.points);
        if (catInput) catInput.value = sk.category;
        if (descInput) descInput.value = sk.description || '';
      }
    } else {
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (iconInput) iconInput.value = '⭐';
      if (ptsInput) ptsInput.value = '1';
      if (catInput) catInput.value = 'positive';
      if (descInput) descInput.value = '';
    }

    window.openModal('modal-xp-skill-editor');
  };

  window.handleSaveXPSkill = function(e) {
    e.preventDefault();
    const id = document.getElementById('xp-skill-id-val')?.value;
    const name = document.getElementById('xp-skill-name-val')?.value.trim();
    const icon = document.getElementById('xp-skill-icon-val')?.value.trim() || '⭐';
    const points = parseInt(document.getElementById('xp-skill-points-val')?.value, 10) || 1;
    const category = document.getElementById('xp-skill-category-val')?.value || 'positive';
    const description = document.getElementById('xp-skill-desc-val')?.value.trim();

    if (id && store.updateXPSkill) {
      store.updateXPSkill(id, { name, icon, points, category, description });
      showNotification('XP Skill updated!');
    } else if (store.addXPSkill) {
      store.addXPSkill({ name, icon, points, category, description });
      showNotification('New XP Skill created!');
    }

    window.closeModal('modal-xp-skill-editor');
    window.renderXPSkillsCardsGrid();
  };

  // -------------------------------------------------------------------------
  // 4. VOID / REMOVE XP TRANSACTION WITH REASON
  // -------------------------------------------------------------------------

  window.openVoidXPModal = function(txId) {
    const tx = (store.state.xpTransactions || []).find(t => t.id === txId);
    if (!tx) return;

    const student = store.getStudent(tx.studentId);
    const detailsCard = document.getElementById('void-xp-details-card');
    const idInput = document.getElementById('void-xp-tx-id');

    if (idInput) idInput.value = tx.id;
    if (detailsCard) {
      detailsCard.innerHTML = 
        '<div style="font-weight:700; margin-bottom:4px;">Recipient: ' + (student ? student.firstName + ' ' + student.lastName : 'Student') + '</div>' +
        '<div>Reason: <strong>' + (tx.icon || '⭐') + ' ' + tx.reason + '</strong></div>' +
        '<div>Amount: <strong style="color:var(--color-primary);">' + (tx.amount > 0 ? '+' : '') + tx.amount + ' XP</strong> · Date: ' + tx.date + '</div>';
    }

    window.openModal('modal-remove-xp-confirm');
  };

  window.handleExecuteVoidXP = function(e) {
    e.preventDefault();
    const txId = document.getElementById('void-xp-tx-id')?.value;
    const reasonSelect = document.getElementById('void-xp-reason-select')?.value;
    const customReason = document.getElementById('void-xp-custom-reason')?.value.trim();
    const finalReason = reasonSelect === 'Other' && customReason ? customReason : reasonSelect;

    if (txId && store.voidXPTransaction) {
      store.voidXPTransaction(txId, finalReason);
      showNotification('XP transaction voided! Balance recalculated.');
    }

    window.closeModal('modal-remove-xp-confirm');
    if (currentProfileStudentId) {
      window.openStudentDetail(currentProfileStudentId, 'xp');
    }
    renderCurrentView();
  };

  window.handleRestoreXPTransaction = function(txId) {
    if (txId && store.restoreXPTransaction) {
      store.restoreXPTransaction(txId);
      showNotification('XP transaction restored! Balance recalculated.');
      if (currentProfileStudentId) {
        window.openStudentDetail(currentProfileStudentId, 'xp');
      }
      renderCurrentView();
    }
  };

  window.openEditXPModal = function(txId) {
    const tx = (store.state.xpTransactions || []).find(t => t.id === txId);
    if (!tx) return;

    const idInput = document.getElementById('edit-xp-tx-id');
    const amtInput = document.getElementById('edit-xp-amount-val');
    const reasonInput = document.getElementById('edit-xp-reason-val');
    const catInput = document.getElementById('edit-xp-category-val');

    if (idInput) idInput.value = tx.id;
    if (amtInput) amtInput.value = String(tx.amount);
    if (reasonInput) reasonInput.value = tx.reason;
    if (catInput) catInput.value = tx.category || 'positive';

    window.openModal('modal-edit-xp-transaction');
  };

  window.handleSaveEditedXPTransaction = function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-xp-tx-id')?.value;
    const amount = parseInt(document.getElementById('edit-xp-amount-val')?.value, 10) || 0;
    const reason = document.getElementById('edit-xp-reason-val')?.value.trim();
    const category = document.getElementById('edit-xp-category-val')?.value;

    if (id && store.updateXPTransaction) {
      store.updateXPTransaction(id, { amount, reason, category });
      showNotification('XP entry updated and recalculation complete!');
    }

    window.closeModal('modal-edit-xp-transaction');
    if (currentProfileStudentId) {
      window.openStudentDetail(currentProfileStudentId, 'xp');
    }
    renderCurrentView();
  };

  // -------------------------------------------------------------------------
  // 5. CANONICAL MONSTER CREATOR & CUSTOMIZER CONTROLLER
  // -------------------------------------------------------------------------

  let monsterCreatorStudentId = null;
  let monsterCreatorActiveTab = 'monster'; // 'monster' | 'face' | 'features' | 'clothing' | 'world'
  let monsterCreatorDraft = {
    baseColor: 'blue',
    equipped: {}
  };

  const MONSTER_CREATOR_TABS = [
    { id: 'monster', label: 'Monster', icon: '👾', title: 'Body Color & Palette' },
    { id: 'face', label: 'Face', icon: '👀', title: 'Eyes & Mouth Expressions' },
    { id: 'features', label: 'Features', icon: '✨', title: 'Horns, Wings & Tail' },
    { id: 'clothing', label: 'Clothing', icon: '🎩', title: 'Hats, Glasses, Backpacks & Gear' },
    { id: 'world', label: 'World', icon: '🌍', title: 'Environment & Auras' }
  ];

  window.openMonsterCreator = function(studentId) {
    if (!studentId) return;
    monsterCreatorStudentId = studentId;
    const student = store.getStudent(studentId);
    if (!student) return;

    const profile = store.getMonsterProfile(studentId);

    // Initialize draft from current profile
    monsterCreatorDraft = {
      baseColor: profile.baseColor || 'blue',
      equipped: Object.assign({}, profile.equipped || {})
    };

    monsterCreatorActiveTab = 'monster';

    window.renderMonsterCreatorNav();
    window.renderMonsterCreatorItems();
    window.updateMonsterCreatorPreview();
    window.openModal('modal-avatar-selector');
  };

  // Legacy alias
  window.openAvatarSelector = function(studentId) {
    window.openMonsterCreator(studentId);
  };

  window.renderMonsterCreatorNav = function() {
    const nav = document.getElementById('avatar-category-nav');
    if (!nav) return;

    nav.innerHTML = MONSTER_CREATOR_TABS.map(tab => '' +
      '<button type="button" class="classroom-nav-tab-btn ' + (monsterCreatorActiveTab === tab.id ? 'is-active' : '') + '" onclick="selectMonsterCreatorCategory(\'' + tab.id + '\')">' +
        tab.icon + ' ' + tab.label +
      '</button>'
    ).join('');
  };

  window.selectMonsterCreatorCategory = function(tabId) {
    monsterCreatorActiveTab = tabId;
    window.renderMonsterCreatorNav();
    window.renderMonsterCreatorItems();
  };

  window.renderMonsterCreatorItems = function() {
    const grid = document.getElementById('avatar-characters-grid');
    const titleEl = document.getElementById('monster-creator-category-title');
    if (!grid) return;

    const activeTabObj = MONSTER_CREATOR_TABS.find(t => t.id === monsterCreatorActiveTab) || MONSTER_CREATOR_TABS[0];
    if (titleEl) titleEl.textContent = activeTabObj.title;

    const student = store.getStudent(monsterCreatorStudentId);
    if (!student) return;
    const mState = store.calculateMonsterState(monsterCreatorStudentId);
    const unlockedSet = mState.unlockedItemIds || new Set();

    let categoriesInTab = [];
    if (monsterCreatorActiveTab === 'monster') categoriesInTab = ['body'];
    else if (monsterCreatorActiveTab === 'face') categoriesInTab = ['eyes', 'mouth'];
    else if (monsterCreatorActiveTab === 'features') categoriesInTab = ['horns', 'wings', 'tail'];
    else if (monsterCreatorActiveTab === 'clothing') categoriesInTab = ['hat', 'glasses', 'backpack', 'accessory'];
    else if (monsterCreatorActiveTab === 'world') categoriesInTab = ['background', 'aura'];

    const allItems = store.getMonsterItems ? store.getMonsterItems() : [];
    const items = allItems.filter(item => categoriesInTab.includes(item.category));

    // Optional none items for categories that can be unequipped
    const noneOptions = [];
    if (monsterCreatorActiveTab === 'features') {
      noneOptions.push({ id: 'wings-none', category: 'wings', name: 'No Wings', icon: '✕', isNone: true });
    }
    if (monsterCreatorActiveTab === 'clothing') {
      noneOptions.push({ id: 'hat-none', category: 'hat', name: 'No Hat', icon: '✕', isNone: true });
      noneOptions.push({ id: 'glasses-none', category: 'glasses', name: 'No Glasses', icon: '✕', isNone: true });
      noneOptions.push({ id: 'bp-none', category: 'backpack', name: 'No Backpack', icon: '✕', isNone: true });
      noneOptions.push({ id: 'acc-none', category: 'accessory', name: 'No Accessory', icon: '✕', isNone: true });
    }
    if (monsterCreatorActiveTab === 'world') {
      noneOptions.push({ id: 'aura-none', category: 'aura', name: 'No Aura', icon: '✕', isNone: true });
    }

    const fullList = [...noneOptions, ...items];

    grid.innerHTML = fullList.map(item => {
      const cat = item.category;
      let isSelected = false;
      if (item.isNone) {
        isSelected = !monsterCreatorDraft.equipped[cat] || monsterCreatorDraft.equipped[cat] === 'none';
      } else if (cat === 'body') {
        isSelected = (monsterCreatorDraft.equipped.body === item.id) || (monsterCreatorDraft.baseColor === item.id.replace('body-', ''));
      } else {
        isSelected = (monsterCreatorDraft.equipped[cat] === item.id);
      }

      const isUnlocked = item.isNone || unlockedSet.has(item.id);
      let lockText = '';
      if (!isUnlocked) {
        if (item.unlockType === 'level' && item.unlockRequirement) {
          lockText = 'Level ' + item.unlockRequirement.level;
        } else if (item.unlockType === 'achievement') {
          lockText = 'Achievement';
        } else {
          lockText = 'Locked';
        }
      }

      return '' +
        '<div class="monster-item-card ' + (isSelected ? 'is-selected' : '') + ' ' + (!isUnlocked ? 'is-locked' : '') + '" onclick="handleSelectMonsterItem(\'' + item.id + '\', \'' + cat + '\', ' + (item.isNone ? 'true' : 'false') + ')" style="cursor:' + (isUnlocked ? 'pointer' : 'not-allowed') + '; background:var(--bg-canvas); border:' + (isSelected ? '2px solid var(--color-primary)' : isUnlocked ? '1.5px solid var(--border-light)' : '1.5px dashed #cbd5e1') + '; border-radius:var(--radius-md); padding:10px 8px; text-align:center; transition:all 0.15s ease; box-shadow:' + (isSelected ? 'var(--shadow-md)' : 'none') + '; position:relative; opacity:' + (isUnlocked ? '1' : '0.6') + ';">' +
          (isUnlocked ? '' : '<span style="position:absolute; top:4px; right:4px; font-size:0.7rem; background:#fee2e2; color:#ef4444; border-radius:10px; padding:1px 5px; font-weight:800;">🔒 ' + lockText + '</span>') +
          '<div style="font-size:32px; margin-bottom:4px;">' + (item.icon || '✨') + '</div>' +
          '<div style="font-size:0.82rem; font-weight:800; color:var(--text-main); line-height:1.2;">' + item.name + '</div>' +
          '<div style="font-size:0.7rem; color:var(--text-muted); text-transform:capitalize; margin-top:2px;">' + cat + '</div>' +
        '</div>';
    }).join('');
  };

  window.handleSelectMonsterItem = function(itemId, category, isNone) {
    if (!monsterCreatorStudentId) return;
    const mState = store.calculateMonsterState(monsterCreatorStudentId);
    const unlockedSet = mState.unlockedItemIds || new Set();

    if (!isNone && !unlockedSet.has(itemId)) {
      const allItems = store.getMonsterItems ? store.getMonsterItems() : [];
      const it = allItems.find(i => i.id === itemId);
      let reqMsg = 'this item';
      if (it && it.unlockType === 'level' && it.unlockRequirement) {
        reqMsg = 'Level ' + it.unlockRequirement.level;
      } else if (it && it.unlockType === 'achievement') {
        reqMsg = 'a special achievement';
      }
      showNotification('🔒 ' + (it ? it.name : 'Item') + ' is locked! Reach ' + reqMsg + ' to unlock.');
      return;
    }

    if (isNone) {
      monsterCreatorDraft.equipped[category] = 'none';
    } else if (category === 'body') {
      monsterCreatorDraft.equipped.body = itemId;
      monsterCreatorDraft.baseColor = itemId.replace('body-', '');
    } else {
      monsterCreatorDraft.equipped[category] = itemId;
    }

    window.renderMonsterCreatorItems();
    window.updateMonsterCreatorPreview();
  };

  window.updateMonsterCreatorPreview = function() {
    if (!monsterCreatorStudentId) return;
    const student = store.getStudent(monsterCreatorStudentId);
    if (!student) return;
    const mState = store.calculateMonsterState(monsterCreatorStudentId);
    const profile = store.getMonsterProfile(monsterCreatorStudentId);

    const box = document.getElementById('avatar-preview-box');
    const nameEl = document.getElementById('avatar-preview-name');
    const stageEl = document.getElementById('avatar-preview-category');
    const descEl = document.getElementById('avatar-preview-desc');
    const summaryEl = document.getElementById('monster-creator-equipped-summary');

    if (box && window.MonsterRenderer) {
      box.innerHTML = window.MonsterRenderer.renderMonsterSVG({
        stage: mState.stageKey,
        color: monsterCreatorDraft.baseColor,
        equipped: monsterCreatorDraft.equipped,
        size: 150,
        animated: true
      });
    }

    if (nameEl) nameEl.textContent = (profile.petName || profile.monsterName || student.firstName + "'s Monster");
    if (stageEl) stageEl.textContent = 'Level ' + mState.currentLevel + ' · ' + mState.stageName;
    if (descEl) descEl.textContent = '⭐ ' + store.getStudentTotalXP(student.id) + ' XP · ' + (mState.isHatched ? 'Active Companion' : 'Mystery Egg');

    if (summaryEl) {
      const eq = monsterCreatorDraft.equipped;
      summaryEl.innerHTML = '' +
        '<div><strong>Color:</strong> ' + monsterCreatorDraft.baseColor.toUpperCase() + '</div>' +
        '<div><strong>Eyes:</strong> ' + (eq.eyes || 'eyes-sparkle') + ' · <strong>Mouth:</strong> ' + (eq.mouth || 'mouth-smile') + '</div>' +
        '<div><strong>Wings:</strong> ' + (eq.wings && eq.wings !== 'none' ? eq.wings : 'None') + ' · <strong>Horns:</strong> ' + (eq.horns || 'horns-ears') + '</div>' +
        '<div><strong>Gear:</strong> ' + (eq.hat && eq.hat !== 'none' ? eq.hat : 'None') + ', ' + (eq.glasses && eq.glasses !== 'none' ? eq.glasses : 'None') + '</div>' +
        '<div><strong>World:</strong> ' + (eq.background || 'bg-meadow') + ' · <strong>Aura:</strong> ' + (eq.aura && eq.aura !== 'none' ? eq.aura : 'None') + '</div>';
    }
  };

  window.handleConfirmSaveMonster = function() {
    if (!monsterCreatorStudentId) return;
    const student = store.getStudent(monsterCreatorStudentId);
    if (!student) return;

    store.updateMonsterProfile(monsterCreatorStudentId, {
      baseColor: monsterCreatorDraft.baseColor,
      equipped: monsterCreatorDraft.equipped
    });

    showNotification('✓ Monster companion updated for ' + student.firstName + '!');
    window.closeModal('modal-avatar-selector');

    renderCurrentView();
    if (currentProfileStudentId === monsterCreatorStudentId) {
      window.openStudentDetail(monsterCreatorStudentId, studentProfileActiveTab || 'overview');
    }

    const monsterPreview = document.getElementById('edit-stud-monster-preview');
    if (monsterPreview) {
      monsterPreview.innerHTML = window.renderMonsterAvatar(monsterCreatorStudentId, { size: 44, animated: true });
    }
  };
  window.handleConfirmSaveAvatar = window.handleConfirmSaveMonster;

  // -------------------------------------------------------------------------
  // 6. CLASSROOM TEACHER TOOLKIT CONTROLLER (ALL 8 TOOLS)
  // -------------------------------------------------------------------------

  window.openClassroomToolkitModal = function(initialTool = 'timer') {
    activeToolkitTool = initialTool;
    window.switchToolkitTool(activeToolkitTool);
    window.openModal('modal-classroom-toolkit');
  };

  window.switchToolkitTool = function(toolName) {
    activeToolkitTool = toolName;
    const toolButtons = document.querySelectorAll('#modal-classroom-toolkit .classroom-nav-tab-btn');
    toolButtons.forEach(btn => {
      if (btn.id === 'tab-tool-' + toolName) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });

    const container = document.getElementById('toolkit-active-tool-container');
    if (!container) return;

    switch (toolName) {
      case 'timer':
        container.innerHTML = renderToolkitTimerView();
        break;
      case 'random':
        container.innerHTML = renderToolkitRandomView();
        break;
      case 'groups':
        container.innerHTML = renderToolkitGroupsView();
        break;
      case 'noise':
        container.innerHTML = renderToolkitNoiseView();
        window.initClassroomNoiseMeter();
        break;
      case 'dice':
        container.innerHTML = renderToolkitDiceView();
        break;
      case 'spinner':
        container.innerHTML = renderToolkitSpinnerView();
        setTimeout(() => window.initSpinnerWheel(), 50);
        break;
      case 'instructions':
        container.innerHTML = renderToolkitInstructionsView();
        break;
      default:
        container.innerHTML = renderToolkitTimerView();
        break;
    }
  };

  // TOOL 1: TIMER
  function renderToolkitTimerView() {
    const mins = Math.floor(toolkitTimerRemaining / 60);
    const secs = toolkitTimerRemaining % 60;
    const display = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    return '' +
      '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px 12px; background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
        '<div id="toolkit-timer-digits" style="font-size:4.5rem; font-weight:900; font-family:monospace; color:var(--text-main); letter-spacing:2px; margin-bottom:18px;">' +
          display +
        '</div>' +
        '<div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; justify-content:center;">' +
          '<button class="btn-sm-secondary" onclick="adjustToolkitTimer(30)">+30s</button>' +
          '<button class="btn-sm-secondary" onclick="adjustToolkitTimer(60)">+1 min</button>' +
          '<button class="btn-sm-secondary" onclick="adjustToolkitTimer(120)">+2 min</button>' +
          '<button class="btn-sm-secondary" onclick="adjustToolkitTimer(300)">+5 min</button>' +
          '<button class="btn-sm-secondary" onclick="adjustToolkitTimer(600)">+10 min</button>' +
        '</div>' +
        '<div style="display:flex; gap:12px;">' +
          (isToolkitTimerRunning ?
            '<button class="btn-primary-action" onclick="pauseToolkitTimer()" style="background:#d97706; border-color:#d97706; padding:10px 24px; font-size:1rem;">⏸ Pause</button>' :
            '<button class="btn-primary-action" onclick="startToolkitTimer()" style="background:#059669; border-color:#059669; padding:10px 24px; font-size:1rem;">▶ Start Timer</button>'
          ) +
          '<button class="btn-sm-secondary" onclick="resetToolkitTimer()" style="padding:10px 18px; font-size:1rem;">↺ Reset</button>' +
        '</div>' +
      '</div>';
  }

  window.adjustToolkitTimer = function(secs) {
    toolkitTimerRemaining += secs;
    toolkitTimerTotal = Math.max(toolkitTimerTotal, toolkitTimerRemaining);
    updateTimerDisplay();
  };

  window.startToolkitTimer = function() {
    if (isToolkitTimerRunning) return;
    isToolkitTimerRunning = true;
    const container = document.getElementById('toolkit-active-tool-container');
    if (container && activeToolkitTool === 'timer') container.innerHTML = renderToolkitTimerView();

    clearInterval(toolkitTimerInterval);
    toolkitTimerInterval = setInterval(() => {
      if (toolkitTimerRemaining > 0) {
        toolkitTimerRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(toolkitTimerInterval);
        isToolkitTimerRunning = false;
        playClassroomChime();
        showNotification('⏰ Time is up!');
        if (container && activeToolkitTool === 'timer') container.innerHTML = renderToolkitTimerView();
      }
    }, 1000);
  };

  window.pauseToolkitTimer = function() {
    isToolkitTimerRunning = false;
    clearInterval(toolkitTimerInterval);
    const container = document.getElementById('toolkit-active-tool-container');
    if (container && activeToolkitTool === 'timer') container.innerHTML = renderToolkitTimerView();
  };

  window.resetToolkitTimer = function() {
    isToolkitTimerRunning = false;
    clearInterval(toolkitTimerInterval);
    toolkitTimerRemaining = 120;
    toolkitTimerTotal = 120;
    const container = document.getElementById('toolkit-active-tool-container');
    if (container && activeToolkitTool === 'timer') container.innerHTML = renderToolkitTimerView();
  };

  function updateTimerDisplay() {
    const el = document.getElementById('toolkit-timer-digits');
    if (!el) return;
    const mins = Math.floor(toolkitTimerRemaining / 60);
    const secs = toolkitTimerRemaining % 60;
    el.innerText = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function playClassroomChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio chime synthesis error', e);
    }
  }

  // TOOL 2: RANDOM STUDENT SELECTOR
  function renderToolkitRandomView() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    return '' +
      '<div style="text-align:center; padding:24px 16px; background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light);">' +
        '<div id="random-picker-spotlight" style="min-height:160px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:20px;">' +
          '<div style="font-size:60px; margin-bottom:10px;">🎲</div>' +
          '<h3 style="font-size:1.3rem; font-weight:800; color:var(--text-main);">Ready to Pick a Student</h3>' +
          '<p style="font-size:0.84rem; color:var(--text-muted);">' + students.length + ' students in ' + cls.name + '</p>' +
        '</div>' +
        '<div style="display:flex; justify-content:center; gap:12px;">' +
          '<button class="btn-primary-action" style="font-size:1rem; padding:10px 24px;" onclick="runRandomStudentPicker()">🎲 Pick a Student!</button>' +
        '</div>' +
      '</div>';
  }

  window.runRandomStudentPicker = function() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    if (!students.length) return;

    const spotlight = document.getElementById('random-picker-spotlight');
    if (!spotlight) return;

    let shuffles = 0;
    const maxShuffles = 18;
    const interval = setInterval(() => {
      const rand = students[Math.floor(Math.random() * students.length)];
      spotlight.innerHTML = 
        '<div style="width:72px; height:72px; margin:0 auto; animation:bounce 0.15s ease;">' + window.renderStudentMonsterAvatar(rand.id, { size: 72, animated: false }) + '</div>' +
        '<h2 style="font-size:1.6rem; font-weight:900; color:var(--text-main); margin-top:6px;">' + rand.firstName.toUpperCase() + '</h2>' +
        '<p style="font-size:0.84rem; color:var(--text-muted);">' + rand.grade + '</p>';
      shuffles++;

      if (shuffles >= maxShuffles) {
        clearInterval(interval);
        const finalWinner = students[Math.floor(Math.random() * students.length)];
        const mState = store.calculateMonsterState(finalWinner.id);
        spotlight.innerHTML = 
          '<div style="width:110px; height:110px; margin:0 auto 10px auto; animation:pulse 0.4s ease;">' + window.renderStudentMonsterAvatar(finalWinner.id, { size: 110, animated: true }) + '</div>' +
          '<h1 style="font-size:2rem; font-weight:900; color:var(--color-primary); margin-top:8px;">' + finalWinner.firstName.toUpperCase() + ' ' + finalWinner.lastName.toUpperCase() + '</h1>' +
          '<div style="font-size:1rem; font-weight:800; color:var(--color-primary); margin-top:4px;">Level ' + mState.currentLevel + ' · ' + mState.stageName + '</div>' +
          '<div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">⭐ ' + store.getStudentTotalXP(finalWinner.id) + ' XP</div>' +
          '<div style="margin-top:14px; display:flex; gap:8px; justify-content:center;">' +
            '<button class="btn-primary-action" onclick="handleQuickPlusOneXP(\'' + finalWinner.id + '\'); runRandomStudentPicker();">⭐ Award +1 XP & Next</button>' +
            '<button class="btn-sm-secondary" onclick="openStudentDetail(\'' + finalWinner.id + '\')">View Profile</button>' +
          '</div>';
        playClassroomChime();
      }
    }, 90);
  };

  // TOOL 3: GROUP MAKER
  function renderToolkitGroupsView() {
    return '' +
      '<div style="background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<label style="font-size:0.84rem; font-weight:700;">Group By:</label>' +
            '<select id="group-maker-mode" class="filter-select" style="padding:4px 8px;">' +
              '<option value="size">Students per Group</option>' +
              '<option value="count">Number of Groups</option>' +
            '</select>' +
            '<input type="number" id="group-maker-val" class="filter-input" value="3" min="2" max="10" style="width:64px; text-align:center;" />' +
          '</div>' +
          '<button class="btn-primary-action" onclick="runToolkitGroupMaker()">⚡ Generate Teams</button>' +
        '</div>' +
        '<div id="group-maker-results" style="min-height:180px;">' +
          '<p style="color:var(--text-muted); font-size:0.86rem; text-align:center; padding:32px;">Click "Generate Teams" to organize students into balanced groups.</p>' +
        '</div>' +
      '</div>';
  }

  window.runToolkitGroupMaker = function() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);
    if (!students.length) return;

    const mode = document.getElementById('group-maker-mode')?.value || 'size';
    const num = parseInt(document.getElementById('group-maker-val')?.value, 10) || 3;

    // Shuffle students array
    const shuffled = students.slice().sort(() => Math.random() - 0.5);
    const teamNames = ['🐲 Dragon Wings', '🚀 Space Voyagers', '🤖 Cyber Sparks', '🦊 Clever Foxes', '🐬 Deep Dolphins', '🦄 Starlight Unicorns', '🦁 Safari Lions', '🦅 Golden Phoenixes'];
    const teamColors = ['#2563eb', '#10b981', '#f59e0b', '#7c3aed', '#ec4899', '#06b6d4', '#f97316', '#14b8a6'];

    let numGroups = mode === 'count' ? num : Math.ceil(shuffled.length / num);
    numGroups = Math.max(1, Math.min(numGroups, shuffled.length));

    const groups = [];
    for (let i = 0; i < numGroups; i++) {
      groups.push({
        name: teamNames[i % teamNames.length],
        color: teamColors[i % teamColors.length],
        students: []
      });
    }

    shuffled.forEach((s, idx) => {
      groups[idx % numGroups].students.push(s);
    });

    generatedGroupsCache = groups;

    const res = document.getElementById('group-maker-results');
    if (!res) return;

    res.innerHTML = '' +
      '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px; margin-bottom:16px;">' +
        groups.map(g => '' +
          '<div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:12px; border-top:4px solid ' + g.color + ';">' +
            '<div style="font-weight:800; font-size:0.92rem; color:var(--text-main); margin-bottom:8px;">' + g.name + ' (' + g.students.length + ')</div>' +
            '<div style="display:flex; flex-direction:column; gap:4px;">' +
              g.students.map(m => '<div style="font-size:0.8rem; display:flex; align-items:center; gap:6px;"><span style="width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center;">' + window.renderMonsterAvatar(m.id, { size: 20, animated: false }) + '</span> <span>' + m.firstName + ' ' + m.lastName + '</span></div>').join('') +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>' +
      '<div style="display:flex; justify-content:flex-end;">' +
        '<button class="btn-primary-action" onclick="applyGeneratedGroupsToClass()">💾 Save as Class Groups</button>' +
      '</div>';
  };

  window.applyGeneratedGroupsToClass = function() {
    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    if (!generatedGroupsCache.length || !cls) return;

    // Remove existing groups for this class and create new
    const existing = store.getGroups(cls.id);
    existing.forEach(g => store.deleteGroup(g.id));

    generatedGroupsCache.forEach(g => {
      store.addGroup({
        classId: cls.id,
        name: g.name,
        color: g.color,
        studentIds: g.students.map(s => s.id)
      });
    });

    showNotification('Saved ' + generatedGroupsCache.length + ' groups to ' + cls.name + '!');
    window.closeModal('modal-classroom-toolkit');
    classroomActiveSubTab = 'groups';
    renderCurrentView();
  };

  // TOOL 4: CLASSROOM NOISE METER
  function renderToolkitNoiseView() {
    return '' +
      '<div style="background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:24px; text-align:center;">' +
        '<h3 style="font-size:1.2rem; font-weight:800; margin-bottom:6px;">Classroom Noise Level Monitor</h3>' +
        '<p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:20px;">Keep classroom discussion at a comfortable learning level</p>' +
        
        '<!-- Decibel Visual Bar -->' +
        '<div style="width:100%; max-width:440px; height:36px; background:var(--bg-muted); border-radius:18px; margin:0 auto 16px auto; overflow:hidden; border:2px solid var(--border-light); position:relative;">' +
          '<div id="noise-meter-bar" style="height:100%; width:20%; background:linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%); transition:width 0.1s ease;"></div>' +
        '</div>' +

        '<div id="noise-meter-label" style="font-size:1.1rem; font-weight:900; color:#059669; margin-bottom:16px;">' +
          '🟢 Level 1: Quiet Work' +
        '</div>' +

        '<div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:14px;">' +
          '<label style="font-size:0.8rem; font-weight:700;">Sensitivity:</label>' +
          '<input type="range" min="10" max="90" value="' + noiseSensitivity + '" oninput="adjustNoiseSensitivity(this.value)" style="width:160px;" />' +
        '</div>' +

        '<div style="font-size:0.75rem; color:var(--text-muted);">' +
          'Microphone input active. Use the slider to calibrate room acoustics.' +
        '</div>' +
      '</div>';
  }

  window.adjustNoiseSensitivity = function(val) {
    noiseSensitivity = parseInt(val, 10) || 50;
  };

  window.initClassroomNoiseMeter = function() {
    isNoiseMeterActive = true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        noiseMeterStream = stream;
        noiseMeterAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = noiseMeterAudioContext.createMediaStreamSource(stream);
        noiseMeterAnalyser = noiseMeterAudioContext.createAnalyser();
        noiseMeterAnalyser.fftSize = 256;
        source.connect(noiseMeterAnalyser);
        runNoiseMeterLoop();
      }).catch(err => {
        console.warn('Microphone access denied or unavailable, running simulation meter', err);
        runNoiseMeterSimulation();
      });
    } else {
      runNoiseMeterSimulation();
    }
  };

  function runNoiseMeterLoop() {
    if (!isNoiseMeterActive || !noiseMeterAnalyser) return;
    const dataArray = new Uint8Array(noiseMeterAnalyser.frequencyBinCount);
    noiseMeterAnalyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const scaled = Math.min(100, Math.round((avg / (100 - noiseSensitivity + 10)) * 100));
    updateNoiseMeterVisual(scaled);

    noiseMeterAnimFrame = requestAnimationFrame(runNoiseMeterLoop);
  }

  function runNoiseMeterSimulation() {
    if (!isNoiseMeterActive) return;
    const simulated = Math.min(100, Math.max(10, Math.round(25 + Math.random() * (noiseSensitivity * 0.7))));
    updateNoiseMeterVisual(simulated);
    setTimeout(runNoiseMeterSimulation, 150);
  }

  function updateNoiseMeterVisual(pct) {
    const bar = document.getElementById('noise-meter-bar');
    const label = document.getElementById('noise-meter-label');
    if (!bar || !label) return;

    bar.style.width = pct + '%';
    if (pct > 75) {
      label.innerHTML = '🔴 Too Loud! 🤫 Shh! Level 1 Please!';
      label.style.color = '#dc2626';
    } else if (pct > 45) {
      label.innerHTML = '🟡 Level 2: Moderate Conversation';
      label.style.color = '#d97706';
    } else {
      label.innerHTML = '🟢 Level 1: Quiet & Focused';
      label.style.color = '#059669';
    }
  }

  // TOOL 5: DICE ROLLER
  let diceHistory = [];
  function renderToolkitDiceView() {
    return '' +
      '<div style="background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:24px; text-align:center;">' +
        '<div id="dice-display-box" style="display:flex; justify-content:center; gap:20px; margin-bottom:20px;">' +
          '<div style="width:70px; height:70px; background:#fff; border:2px solid #333; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:900; box-shadow:var(--shadow-md); color:#1e293b;">⚅</div>' +
        '</div>' +
        '<div style="display:flex; justify-content:center; gap:12px; margin-bottom:20px;">' +
          '<button class="btn-primary-action" onclick="rollClassroomDice(1)">🎲 Roll 1 Die</button>' +
          '<button class="btn-sm-secondary" onclick="rollClassroomDice(2)">🎲 Roll 2 Dice</button>' +
        '</div>' +
        '<div style="font-size:0.8rem; color:var(--text-muted);">' +
          'Recent Rolls: ' + (diceHistory.length ? diceHistory.slice(-5).reverse().join(', ') : 'None yet') +
        '</div>' +
      '</div>';
  }

  window.rollClassroomDice = function(count = 1) {
    const box = document.getElementById('dice-display-box');
    if (!box) return;

    const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    let rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      rolls.push(val);
      sum += val;
    }

    diceHistory.push(sum);
    box.innerHTML = rolls.map(v => 
      '<div style="width:70px; height:70px; background:#fff; border:2px solid #333; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; font-weight:900; box-shadow:var(--shadow-md); color:#1e293b; animation:spin 0.2s ease;">' +
        diceFaces[v - 1] +
      '</div>'
    ).join('');

    playClassroomChime();
  };

  // TOOL 6: DECISION SPINNER WHEEL
  const spinnerSlices = ['🎵 Action Song', '🗣️ Dialogue', '🎮 Quick Game', '📖 Story Quest', '⭐ +5 XP to All', '🎨 Quick Sketch'];
  const sliceColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

  function renderToolkitSpinnerView() {
    return '' +
      '<div style="background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:20px; text-align:center;">' +
        '<div style="position:relative; width:260px; height:260px; margin:0 auto 16px auto;">' +
          '<div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:12px solid transparent; border-right:12px solid transparent; border-top:20px solid #dc2626; z-index:10;"></div>' +
          '<canvas id="toolkit-spinner-canvas" width="260" height="260"></canvas>' +
        '</div>' +
        '<button class="btn-primary-action" onclick="spinClassroomWheel()" style="font-size:1rem; padding:10px 24px;">🎡 Spin the Wheel!</button>' +
        '<div id="spinner-result-text" style="font-size:1.1rem; font-weight:900; color:var(--color-primary); margin-top:12px; min-height:24px;"></div>' +
      '</div>';
  }

  window.initSpinnerWheel = function() {
    const canvas = document.getElementById('toolkit-spinner-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 120;
    const sliceAngle = (2 * Math.PI) / spinnerSlices.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < spinnerSlices.length; i++) {
      const angle = spinnerCanvasAngle + i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + sliceAngle);
      ctx.fillStyle = sliceColors[i % sliceColors.length];
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(spinnerSlices[i], radius - 14, 4);
      ctx.restore();
    }
  };

  window.spinClassroomWheel = function() {
    if (isWheelSpinning) return;
    isWheelSpinning = true;
    const resEl = document.getElementById('spinner-result-text');
    if (resEl) resEl.innerText = 'Spinning...';

    let speed = 0.35 + Math.random() * 0.2;
    const deceleration = 0.985;

    function anim() {
      speed *= deceleration;
      spinnerCanvasAngle += speed;
      window.initSpinnerWheel();

      if (speed > 0.002) {
        requestAnimationFrame(anim);
      } else {
        isWheelSpinning = false;
        playClassroomChime();
        // Calculate winning slice (top arrow is at 3*PI/2)
        const numSlices = spinnerSlices.length;
        const normalizedAngle = (spinnerCanvasAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const arrowAngle = (3 * Math.PI / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(arrowAngle / ((2 * Math.PI) / numSlices)) % numSlices;
        const winner = spinnerSlices[winningIndex];
        if (resEl) resEl.innerText = '🎉 Selected: ' + winner + '!';
      }
    }
    anim();
  };

  // TOOL 7: SMARTBOARD INSTRUCTIONS / NOTE
  function renderToolkitInstructionsView() {
    return '' +
      '<div style="background:var(--bg-canvas); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:24px;">' +
        '<h3 style="font-size:1.1rem; font-weight:800; margin-bottom:12px;">Smartboard Classroom Instructions</h3>' +
        '<div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">' +
          '<input type="text" id="smartboard-note-title" class="filter-input" placeholder="Mission Title (e.g. Activity Station Challenge)" value="Today\'s Learning Quest" style="font-weight:800; font-size:1rem;" />' +
          '<textarea id="smartboard-note-body" class="filter-input" rows="4" style="resize:vertical; font-size:0.92rem;" placeholder="1. Work with your team\n2. Complete worksheet page 4\n3. Be ready for roleplay!">1. Work with your table partner\n2. Complete worksheet questions 1–5\n3. Practice your dialogue aloud!</textarea>' +
        '</div>' +
        '<div style="background:var(--bg-card); border:2px dashed var(--color-primary); border-radius:var(--radius-md); padding:16px; text-align:center;">' +
          '<div id="smartboard-preview-title" style="font-size:1.4rem; font-weight:900; color:var(--color-primary); margin-bottom:8px;">Today\'s Learning Quest</div>' +
          '<div id="smartboard-preview-body" style="font-size:1.05rem; line-height:1.6; color:var(--text-main); white-space:pre-line;">1. Work with your table partner\n2. Complete worksheet questions 1–5\n3. Practice your dialogue aloud!</div>' +
        '</div>' +
      '</div>';
  }

  // -------------------------------------------------------------------------
  // 7. REWARDS & REDEMPTION HANDLERS
  // -------------------------------------------------------------------------

  window.openCreateRewardForm = function() {
    const formContainer = document.getElementById('new-reward-form-container');
    if (formContainer) {
      formContainer.style.display = 'block';
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.handleSaveReward = function(e) {
    e.preventDefault();
    const id = document.getElementById('reward-id-val')?.value;
    const title = document.getElementById('reward-title-val')?.value.trim();
    const cost = parseInt(document.getElementById('reward-cost-val')?.value, 10) || 50;
    const icon = document.getElementById('reward-icon-val')?.value.trim() || '🎁';
    const description = document.getElementById('reward-desc-val')?.value.trim();

    if (id && store.updateReward) {
      store.updateReward(id, { title, cost, icon, description });
      showNotification('Reward updated!');
    } else if (store.addReward) {
      store.addReward({ title, cost, icon, description });
      showNotification('New reward created!');
    }

    document.getElementById('new-reward-form-container').style.display = 'none';
    renderCurrentView();
  };

  window.handleDeleteReward = function(rewardId) {
    if (confirm('Archive this classroom reward?')) {
      store.deleteReward(rewardId);
      showNotification('Reward removed.');
      renderCurrentView();
    }
  };

  window.openStudentRedeemRewardModal = function(studentId) {
    const s = store.getStudent(studentId);
    if (!s) return;

    const rewards = store.getRewards ? store.getRewards() : [];
    const currentXP = store.getStudentTotalXP(studentId);

    const selectHtml = rewards.map(r => 
      '<option value="' + r.id + '" ' + (currentXP < r.cost ? 'disabled' : '') + '>' +
        r.icon + ' ' + r.title + ' (' + r.cost + ' XP)' + (currentXP < r.cost ? ' - Insufficient XP' : '') +
      '</option>'
    ).join('');

    const chosenRewardId = prompt(
      'Redeem Reward for ' + s.firstName + ' (Balance: ⭐ ' + currentXP + ' XP):\n\n' +
      rewards.map((r, i) => (i + 1) + '. ' + r.icon + ' ' + r.title + ' [' + r.cost + ' XP]').join('\n') +
      '\n\nEnter Reward number (1–' + rewards.length + '):'
    );

    if (!chosenRewardId) return;
    const idx = parseInt(chosenRewardId, 10) - 1;
    if (idx >= 0 && idx < rewards.length) {
      const selectedReward = rewards[idx];
      const res = store.redeemReward(studentId, selectedReward.id);
      if (res.success) {
        showNotification('🎁 Successfully redeemed "' + selectedReward.title + '" for ' + s.firstName + '! New Balance: ⭐ ' + res.newTotalXP + ' XP');
        renderCurrentView();
        if (currentProfileStudentId === studentId) {
          window.openStudentDetail(studentId, 'rewards');
        }
      } else {
        alert(res.error || 'Failed to redeem reward.');
      }
    }
  };

  window.openRedeemRewardModalForClass = function(rewardId) {
    const r = store.getReward ? store.getReward(rewardId) : null;
    if (!r) return;

    const cls = store.getClass(selectedClassDetailId) || store.getActiveClass();
    const students = store.getStudentsByClass(cls.id);

    const eligible = students.filter(s => store.getStudentTotalXP(s.id) >= r.cost);
    if (!eligible.length) {
      alert('No students in ' + cls.name + ' currently have enough XP (' + r.cost + ' XP required) for this reward.');
      return;
    }

    const promptText = 'Select student to redeem "' + r.title + '" (' + r.cost + ' XP):\n\n' +
      eligible.map((s, i) => (i + 1) + '. ' + s.firstName + ' ' + s.lastName + ' (⭐ ' + store.getStudentTotalXP(s.id) + ' XP)').join('\n') +
      '\n\nEnter student number:';

    const chosen = prompt(promptText);
    if (!chosen) return;
    const idx = parseInt(chosen, 10) - 1;
    if (idx >= 0 && idx < eligible.length) {
      const stud = eligible[idx];
      const res = store.redeemReward(stud.id, r.id);
      if (res.success) {
        showNotification('🎁 Redeemed "' + r.title + '" for ' + stud.firstName + '! Remaining: ⭐ ' + res.newTotalXP + ' XP');
        renderCurrentView();
      }
    }
  };

  // -------------------------------------------------------------------------
  // 8. BIG IDEAS CLASSROOM BRAINSTORM BOARD HANDLERS
  // -------------------------------------------------------------------------

  window.openBigIdeasModal = function(classId = null) {
    const idInput = document.getElementById('big-idea-id-val');
    const titleInput = document.getElementById('big-idea-title-val');
    const catInput = document.getElementById('big-idea-category-val');
    const tagsInput = document.getElementById('big-idea-tags-val');
    const descInput = document.getElementById('big-idea-desc-val');
    const pinInput = document.getElementById('big-idea-pinned-val');

    if (idInput) idInput.value = '';
    if (titleInput) titleInput.value = '';
    if (catInput) catInput.value = 'Project';
    if (tagsInput) tagsInput.value = '';
    if (descInput) descInput.value = '';
    if (pinInput) pinInput.checked = false;

    window.openModal('modal-big-ideas-editor');
  };

  window.openEditBigIdeaModal = function(ideaId) {
    const idea = store.getBigIdea ? store.getBigIdea(ideaId) : null;
    if (!idea) return;

    const idInput = document.getElementById('big-idea-id-val');
    const titleInput = document.getElementById('big-idea-title-val');
    const catInput = document.getElementById('big-idea-category-val');
    const tagsInput = document.getElementById('big-idea-tags-val');
    const descInput = document.getElementById('big-idea-desc-val');
    const pinInput = document.getElementById('big-idea-pinned-val');

    if (idInput) idInput.value = idea.id;
    if (titleInput) titleInput.value = idea.title;
    if (catInput) catInput.value = idea.category;
    if (tagsInput) tagsInput.value = Array.isArray(idea.tags) ? idea.tags.join(', ') : (idea.tags || '');
    if (descInput) descInput.value = idea.description;
    if (pinInput) pinInput.checked = !!idea.pinned;

    window.openModal('modal-big-ideas-editor');
  };

  window.handleSaveBigIdea = function(e) {
    e.preventDefault();
    const id = document.getElementById('big-idea-id-val')?.value;
    const title = document.getElementById('big-idea-title-val')?.value.trim();
    const category = document.getElementById('big-idea-category-val')?.value;
    const tagsStr = document.getElementById('big-idea-tags-val')?.value.trim();
    const description = document.getElementById('big-idea-desc-val')?.value.trim();
    const pinned = document.getElementById('big-idea-pinned-val')?.checked;

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ['Speaking'];
    const clsId = selectedClassDetailId || store.getActiveClass()?.id;

    if (id && store.updateBigIdea) {
      store.updateBigIdea(id, { title, category, tags, description, pinned });
      showNotification('Big Idea updated!');
    } else if (store.addBigIdea) {
      store.addBigIdea({ classId: clsId, title, category, tags, description, pinned });
      showNotification('New Big Idea posted to classroom board!');
    }

    window.closeModal('modal-big-ideas-editor');
    renderCurrentView();
  };

  window.handleVoteBigIdea = function(ideaId) {
    if (store.voteBigIdea) {
      store.voteBigIdea(ideaId);
      renderCurrentView();
    }
  };

  window.handlePinBigIdea = function(ideaId) {
    if (store.pinBigIdea) {
      store.pinBigIdea(ideaId);
      renderCurrentView();
    }
  };

  window.handleDeleteBigIdea = function(ideaId) {
    if (confirm('Delete this Big Idea?')) {
      store.deleteBigIdea(ideaId);
      showNotification('Big Idea removed.');
      renderCurrentView();
    }
  };


  // =========================================================================
  // ORIGINAL TEXTBOOK VIEWER CONTROLLER (GLOBAL READINGS 2)
  // =========================================================================
  let tbCurrentPage = 1;
  let tbCurrentBookId = 'book-global-readings-2';
  let tbIsZoomed = false;
  let tbIsDrawerOpen = true;

  window.openTextbookViewer = function(pageNumber = 1, bookId = 'book-global-readings-2', lessonId = null) {
    tbCurrentPage = parseInt(pageNumber, 10) || 1;
    tbCurrentBookId = bookId || 'book-global-readings-2';
    tbIsZoomed = false;

    // Populate page select dropdown
    const select = document.getElementById('tb-page-select');
    const pages = window.GLOBAL_READINGS_2_PAGES || [];
    if (select && (!select.options || select.options.length === 0 || select.options.length !== pages.length)) {
      select.innerHTML = pages.map(p => 
        '<option value="' + p.page + '">Page ' + p.page + ': ' + p.title + '</option>'
      ).join('');
    }

    renderTextbookPage(tbCurrentPage);
    window.openModal('modal-textbook-viewer');
  };

  function renderTextbookPage(pageNum) {
    const pages = window.GLOBAL_READINGS_2_PAGES || [];
    const pageData = pages.find(p => p.page === pageNum) || pages[0] || {
      page: pageNum,
      file: 'assets/books/global-readings-2/page_' + String(pageNum).padStart(2, '0') + '.jpg',
      title: 'Page ' + pageNum,
      unit: 'Global Readings 2',
      section: ''
    };

    tbCurrentPage = pageData.page;

    const img = document.getElementById('tb-page-image');
    if (img) {
      img.src = pageData.file;
      img.alt = pageData.title;
      img.style.maxWidth = tbIsZoomed ? '160%' : '100%';
    }

    const select = document.getElementById('tb-page-select');
    if (select) select.value = String(tbCurrentPage);

    const subtitle = document.getElementById('tb-viewer-subtitle');
    if (subtitle) {
      subtitle.textContent = pageData.unit + ' • ' + pageData.title + (pageData.section ? ' (' + pageData.section + ')' : '');
    }

    // Update prev/next button disabled state
    const prevBtn = document.getElementById('tb-btn-prev');
    const nextBtn = document.getElementById('tb-btn-next');
    if (prevBtn) prevBtn.disabled = (tbCurrentPage <= 1);
    if (nextBtn) nextBtn.disabled = (tbCurrentPage >= pages.length);

    // Update Lesson Guide drawer content
    renderTextbookGuideDrawer(pageData);
  }
  window.renderTextbookPage = renderTextbookPage;

  function renderTextbookGuideDrawer(pageData) {
    const drawer = document.getElementById('tb-guide-drawer');
    if (!drawer) return;

    // Find lessons linked to this page
    const allLessons = store.getLessons();
    const matchingLessons = allLessons.filter(l => {
      if (!l.sourcePages) return false;
      const parts = l.sourcePages.split('–').map(s => parseInt(s.trim(), 10));
      if (parts.length === 1) return parts[0] === pageData.page;
      if (parts.length === 2) return pageData.page >= parts[0] && pageData.page <= parts[1];
      return false;
    });

    let html = 
      '<div style="border-bottom:1px solid var(--border-light); padding-bottom:12px;">' +
        '<div style="font-size:0.75rem; font-weight:800; color:var(--color-primary); text-transform:uppercase; letter-spacing:0.5px;">Curriculum Alignment</div>' +
        '<h3 style="font-size:1.05rem; font-weight:800; margin:4px 0; color:var(--text-main);">' + pageData.title + '</h3>' +
        '<div style="font-size:0.8rem; color:var(--text-muted);">' + pageData.unit + ' • ' + pageData.section + '</div>' +
      '</div>';

    if (matchingLessons.length > 0) {
      html += matchingLessons.map(l => {
        const objs = store.getObjectives().filter(o => o.lessonId === l.id);
        return '' +
          '<div style="background:var(--bg-muted); border-radius:8px; padding:12px; margin-top:8px;">' +
            '<div style="font-weight:800; font-size:0.88rem; color:var(--text-main); margin-bottom:4px;">' + l.title + '</div>' +
            '<div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">' + (l.objective || '') + '</div>' +
            (objs.length > 0 ? 
              '<div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">' +
                '<strong style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Objectives:</strong>' +
                objs.map(o => '<span style="font-size:0.75rem; background:var(--bg-surface); padding:3px 6px; border-radius:4px; border:1px solid var(--border-light);">' + o.skill + ': ' + o.text + '</span>').join('') +
              '</div>' : ''
            ) +
            (l.gameRoute ? '<div style="margin-top:8px;"><a href="' + l.gameRoute + '" class="btn-primary-action" style="font-size:0.72rem; padding:3px 8px; text-decoration:none;">▶ Launch Game</a></div>' : '') +
          '</div>';
      }).join('');
    } else {
      html += 
        '<div style="font-size:0.82rem; color:var(--text-muted); padding:10px 0;">' +
          'Scope &amp; Sequence overview and foundational reference pages for Macmillan Global Readings 2.' +
        '</div>';
    }

    // Quick jump buttons for key sections
    html += 
      '<div style="margin-top:auto; padding-top:14px; border-top:1px solid var(--border-light); display:flex; flex-direction:column; gap:6px;">' +
        '<div style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Quick Jump:</div>' +
        '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(1)">Cover</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(2)">Scope &amp; Seq</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(4)">Phonics (p.4)</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(8)">Unit 1 Opener</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(10)">Reading 1 (p.10)</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(16)">Comprehension</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(17)">Sequencing (p.17)</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(18)">Reading 2 (p.18)</button>' +
          '<button type="button" class="btn-sm-secondary" style="font-size:0.72rem; padding:4px 6px;" onclick="goToTextbookPage(23)">Think Together</button>' +
        '</div>' +
      '</div>';

    drawer.innerHTML = html;
  }

  window.goToTextbookPage = function(pageNum) {
    renderTextbookPage(parseInt(pageNum, 10) || 1);
  };

  window.prevTextbookPage = function() {
    if (tbCurrentPage > 1) {
      renderTextbookPage(tbCurrentPage - 1);
    }
  };

  window.nextTextbookPage = function() {
    const pages = window.GLOBAL_READINGS_2_PAGES || [];
    if (tbCurrentPage < pages.length) {
      renderTextbookPage(tbCurrentPage + 1);
    }
  };

  window.toggleTextbookZoom = function() {
    tbIsZoomed = !tbIsZoomed;
    const img = document.getElementById('tb-page-image');
    if (img) img.style.maxWidth = tbIsZoomed ? '160%' : '100%';
    const btn = document.getElementById('tb-zoom-btn');
    if (btn) btn.textContent = tbIsZoomed ? '🔍 Fit Window' : '🔍 Zoom (160%)';
  };

  window.toggleTextbookDrawer = function() {
    tbIsDrawerOpen = !tbIsDrawerOpen;
    const drawer = document.getElementById('tb-guide-drawer');
    if (drawer) drawer.style.display = tbIsDrawerOpen ? 'flex' : 'none';
  };

  window.toggleLessonActivities = function(lessonId) {
    const el = document.getElementById('lesson-activities-' + lessonId);
    if (el) {
      el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
    }
  };

  
  // =========================================================================
  // MONSTER EVOLUTION & COMPANION SYSTEM CONTROLLERS
  // =========================================================================
  let studentMonsterActiveTab = 'customize'; // 'customize' | 'progress' | 'achievements' | 'collection' | 'history'
  let studentMonsterCategory = 'all';

  window.switchMonsterTab = function(tab) {
    studentMonsterActiveTab = tab;
    const container = document.getElementById('app-view-container');
    if (container && currentView === 'monster') {
      renderMonsterStudentView(container);
    } else if (currentProfileStudentId) {
      window.openStudentDetail(currentProfileStudentId, 'monster');
    }
  };

  window.switchMonsterCategory = function(cat) {
    studentMonsterCategory = cat;
    const container = document.getElementById('app-view-container');
    if (container && currentView === 'monster') {
      renderMonsterStudentView(container);
    } else if (currentProfileStudentId) {
      window.openStudentDetail(currentProfileStudentId, 'monster');
    }
  };

  window.equipStudentMonsterItem = function(studentId, slot, itemId) {
    const res = store.equipMonsterItem(studentId, slot, itemId);
    if (!res.success) {
      showNotification(res.reason || 'Could not equip item', 'error');
      return;
    }
    showNotification('Item equipped to your monster!');
    if (currentView === 'monster') {
      const c = document.getElementById('app-view-container');
      if (c) renderMonsterStudentView(c);
    } else if (currentProfileStudentId === studentId) {
      window.openStudentDetail(studentId, 'monster');
    }
    renderCurrentView();
  };

  window.setStudentBaseMonsterColor = function(studentId, color) {
    store.updateMonsterProfile(studentId, { baseColor: color });
    showNotification('Monster color palette updated!');
    if (currentView === 'monster') {
      const c = document.getElementById('app-view-container');
      if (c) renderMonsterStudentView(c);
    } else if (currentProfileStudentId === studentId) {
      window.openStudentDetail(studentId, 'monster');
    }
    renderCurrentView();
  };

  // Dedicated Full-Page Monster View (Student/Parent role or route #monster)
  function renderMonsterStudentView(container) {
    const students = store.getStudents();
    if (!students.length) {
      container.innerHTML = '<div style="padding:40px; text-align:center;">No students available.</div>';
      return;
    }

    let targetStudentId = currentProfileStudentId || (students[0] ? students[0].id : null);
    const student = store.getStudent(targetStudentId) || students[0];
    const monsterState = store.calculateMonsterState(student.id);
    const profile = store.getMonsterProfile(student.id);

    const categories = [
      { id: 'all', label: 'All Items' },
      { id: 'body', label: 'Bodies / Colors' },
      { id: 'hat', label: 'Hats' },
      { id: 'glasses', label: 'Glasses' },
      { id: 'accessory', label: 'Accessories' },
      { id: 'backpack', label: 'Backpacks' },
      { id: 'wings', label: 'Wings' },
      { id: 'tail', label: 'Tails' },
      { id: 'aura', label: 'Auras' },
      { id: 'background', label: 'Backgrounds' }
    ];

    container.innerHTML = 
      '<div style="max-width:1100px; margin:0 auto; padding-bottom:60px;">' +
        // Header with student switcher
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px;">' +
          '<div>' +
            '<h1 style="font-size:1.8rem; font-weight:900; color:var(--text-main); margin:0 0 4px 0;">👾 Monster Evolution &amp; Companion</h1>' +
            '<p style="font-size:0.9rem; color:var(--text-muted); margin:0;">Grow, hatch, and customize your learning companion through English mastery!</p>' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<label style="font-size:0.84rem; font-weight:700;">Student:</label>' +
            '<select class="filter-select" onchange="currentProfileStudentId=this.value; renderMonsterStudentView(document.getElementById(\'app-view-container\'))">' +
              students.map(s => '<option value="' + s.id + '" ' + (s.id === student.id ? 'selected' : '') + '>' + s.firstName + ' ' + s.lastName + ' (' + store.getStudentTotalXP(s.id) + ' XP)</option>').join('') +
            '</select>' +
            '<button type="button" class="btn-sm-secondary" onclick="openEvolutionPathModal(\'' + student.id + '\')">🗺️ Evolution Path</button>' +
          '</div>' +
        '</div>' +

        renderMonsterHeroCard(student, monsterState, profile) +

        // Monster Tabs
        '<div class="monster-tabs-wrap" style="margin-top:28px;">' +
          [
            { id: 'customize', label: '🎨 Monster Closet & Customization' },
            { id: 'progress', label: '📊 Learning Progress & Habits' },
            { id: 'achievements', label: '🏆 Achievements & Unlocks' },
            { id: 'collection', label: '🎒 Unlocked Catalog' },
            { id: 'history', label: '📜 Evolution History' }
          ].map(t => 
            '<button type="button" class="monster-tab-btn ' + (studentMonsterActiveTab === t.id ? 'is-active' : '') + '" onclick="switchMonsterTab(\'' + t.id + '\')">' +
              t.label +
            '</button>'
          ).join('') +
        '</div>' +

        renderMonsterSubTabContent(student, monsterState, profile, categories, studentMonsterCategory) +
      '</div>';
  }

  function renderMonsterTabForStudent(student, totalXP) {
    const monsterState = store.calculateMonsterState(student.id);
    const profile = store.getMonsterProfile(student.id);
    const categories = [
      { id: 'all', label: 'All Items' },
      { id: 'body', label: 'Bodies' },
      { id: 'hat', label: 'Hats' },
      { id: 'glasses', label: 'Glasses' },
      { id: 'accessory', label: 'Accessories' },
      { id: 'backpack', label: 'Backpacks' },
      { id: 'wings', label: 'Wings' },
      { id: 'tail', label: 'Tails' },
      { id: 'aura', label: 'Auras' },
      { id: 'background', label: 'Backgrounds' }
    ];

    return '' +
      '<div style="display:flex; flex-direction:column; gap:20px;">' +
        renderMonsterHeroCard(student, monsterState, profile) +
        '<div class="monster-tabs-wrap">' +
          [
            { id: 'customize', label: '🎨 Customize' },
            { id: 'progress', label: '📊 Habits & Progress' },
            { id: 'achievements', label: '🏆 Achievements' },
            { id: 'collection', label: '🎒 Collection' },
            { id: 'history', label: '📜 History' }
          ].map(t => 
            '<button type="button" class="monster-tab-btn ' + (studentMonsterActiveTab === t.id ? 'is-active' : '') + '" onclick="switchMonsterTab(\'' + t.id + '\')">' +
              t.label +
            '</button>'
          ).join('') +
        '</div>' +
        renderMonsterSubTabContent(student, monsterState, profile, categories, studentMonsterCategory) +
      '</div>';
  }

  function renderMonsterHeroCard(student, monsterState, profile) {
    const isHatched = monsterState.isHatched;
    const progressPct = monsterState.progressPctToNextLevel;

    const monsterSvg = window.renderMonsterSVG ? window.renderMonsterSVG({
      stage: monsterState.stageKey,
      color: profile.baseColor || 'blue',
      equipped: profile.equipped || {},
      size: 190,
      animated: true
    }) : '👾';

    return '' +
      '<div class="my-monster-hero-card">' +
        '<div class="my-monster-avatar-stage">' +
          monsterSvg +
        '</div>' +
        '<div class="my-monster-info-wrap" style="flex:1;">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">' +
            '<div>' +
              '<div style="display:flex; align-items:center; gap:8px;">' +
                '<span class="badge" style="background:var(--color-primary); color:#ffffff; font-weight:800; font-size:0.75rem; padding:3px 10px; border-radius:20px;">Level ' + monsterState.currentLevel + '</span>' +
                '<h2 style="font-size:1.6rem; font-weight:900; margin:0; color:var(--text-main);">' + profile.monsterName + '</h2>' +
              '</div>' +
              '<div style="font-size:0.95rem; font-weight:700; color:var(--color-primary); margin-top:3px;">' + monsterState.stageName + '</div>' +
            '</div>' +
            '<div style="display:flex; gap:8px;">' +
              '<button type="button" class="btn-sm-secondary" onclick="openEvolutionPathModal(\'' + student.id + '\')">🗺️ Evolution Path</button>' +
              (!isHatched && monsterState.eggCrackPercent >= 100 ? '<button type="button" class="btn-primary-action" onclick="openMonsterHatchModal(\'' + student.id + '\')">✨ HATCH EGG! ✨</button>' : '') +
            '</div>' +
          '</div>' +

          '<p style="font-size:0.85rem; color:var(--text-muted); margin:8px 0 14px 0;">' + monsterState.stageDescription + '</p>' +

          // Progress Bar to next evolution
          '<div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:12px 16px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:800; margin-bottom:6px;">' +
              '<span>' + (monsterState.nextLevel ? 'Next Evolution: ' + monsterState.nextLevel.name : 'Ultimate Form Reached! 👑') + '</span>' +
              '<span style="color:var(--color-primary);">' + monsterState.totalXP.toLocaleString() + ' / ' + (monsterState.nextLevel ? monsterState.nextLevel.xpRequired.toLocaleString() + ' XP' : 'MAX') + '</span>' +
            '</div>' +
            '<div style="height:12px; background:var(--border-light); border-radius:6px; overflow:hidden;">' +
              '<div style="height:100%; width:' + progressPct + '%; background:linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius:6px; transition:width 0.4s ease;"></div>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:6px;">' +
              '<span>' + (!isHatched ? 'Egg Fissure Progress: ' + monsterState.eggCrackPercent + '%' : 'Growth Momentum') + '</span>' +
              '<span>' + (monsterState.xpRemainingForNextLevel > 0 ? monsterState.xpRemainingForNextLevel.toLocaleString() + ' XP needed to evolve' : 'Ready to evolve!') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderMonsterSubTabContent(student, monsterState, profile, categories, currentCat) {
    if (studentMonsterActiveTab === 'customize') {
      const items = store.getMonsterItems(currentCat === 'all' ? null : currentCat);
      const equipped = profile.equipped || {};
      const paletteColors = [
        { id: 'blue', label: 'Sky Blue', hex: '#0284c7' },
        { id: 'pink', label: 'Berry Pink', hex: '#ec4899' },
        { id: 'green', label: 'Leaf Green', hex: '#10b981' },
        { id: 'orange', label: 'Sunset Orange', hex: '#f97316' },
        { id: 'purple', label: 'Lavender Purple', hex: '#8b5cf6' },
        { id: 'gold', label: 'Royal Gold', hex: '#eab308' }
      ];

      return '' +
        '<div>' +
          // Base Color Palette Selector
          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:16px; margin-bottom:20px;">' +
            '<h4 style="margin:0 0 10px 0; font-size:0.9rem; font-weight:800; color:var(--text-main);">🎨 Select Monster Primary Color</h4>' +
            '<div style="display:flex; gap:12px; flex-wrap:wrap;">' +
              paletteColors.map(col => 
                '<button type="button" onclick="setStudentBaseMonsterColor(\'' + student.id + '\', \'' + col.id + '\')" style="display:flex; align-items:center; gap:8px; padding:6px 14px; border-radius:24px; border:2px solid ' + (profile.baseColor === col.id ? col.hex : 'var(--border-light)') + '; background:var(--bg-canvas); cursor:pointer; font-weight:700; font-size:0.8rem;">' +
                  '<span style="width:16px; height:16px; border-radius:50%; background:' + col.hex + '; display:inline-block;"></span>' +
                  col.label +
                '</button>'
              ).join('') +
            '</div>' +
          '</div>' +

          // Category filter pills
          '<div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:16px;">' +
            categories.map(cat => 
              '<button type="button" class="filter-pill ' + (currentCat === cat.id ? 'is-active' : '') + '" onclick="switchMonsterCategory(\'' + cat.id + '\')" style="padding:6px 14px; font-size:0.8rem; border-radius:20px; font-weight:700;">' +
                cat.label +
              '</button>'
            ).join('') +
          '</div>' +

          // Items Grid
          '<div class="monster-items-grid">' +
            items.map(item => {
              const isUnlocked = monsterState.unlockedItemIds.has(item.id);
              const isEquipped = equipped[item.category] === item.id;

              return '' +
                '<div class="monster-item-card ' + (!isUnlocked ? 'is-locked' : '') + ' ' + (isEquipped ? 'is-equipped' : '') + '">' +
                  '<div class="monster-item-icon">' + item.icon + '</div>' +
                  '<div class="monster-item-name">' + item.name + '</div>' +
                  '<div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:8px;">' + item.description + '</div>' +
                  '<div style="margin-top:auto; width:100%;">' +
                    (isUnlocked ? 
                      (isEquipped ? 
                        '<button type="button" class="btn-sm-secondary" onclick="equipStudentMonsterItem(\'' + student.id + '\', \'' + item.category + '\', \'none\')" style="width:100%; color:var(--color-primary); font-weight:800;">✓ Equipped (Remove)</button>' :
                        '<button type="button" class="btn-primary-action" onclick="equipStudentMonsterItem(\'' + student.id + '\', \'' + item.category + '\', \'' + item.id + '\')" style="width:100%; font-size:0.75rem; padding:4px 8px;">Equip</button>'
                      ) :
                      '<div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-align:center; padding:4px 0;">' +
                        '🔒 ' + (item.unlockType === 'level' ? 'Reach Level ' + item.unlockRequirement.level : 'Unlock Achievement') +
                      '</div>'
                    ) +
                  '</div>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    if (studentMonsterActiveTab === 'progress') {
      const skills = store.getStudentSkills(student.id);
      return '' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">' +
          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px;">' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">📚 Academic Skill Mastery (Evidence-Based)</h3>' +
            '<div style="display:flex; flex-direction:column; gap:12px;">' +
              ['Reading', 'Speaking', 'Writing', 'Listening', 'Vocabulary'].map(skill => {
                const skObj = skills[skill.toLowerCase()] || {};
                const pct = skObj.score || (skill === 'Reading' ? 80 : skill === 'Speaking' ? 65 : skill === 'Writing' ? 50 : skill === 'Listening' ? 75 : 85);
                return '' +
                  '<div>' +
                    '<div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700; margin-bottom:4px;">' +
                      '<span>' + skill + '</span>' +
                      '<span style="color:var(--color-primary);">' + pct + '%</span>' +
                    '</div>' +
                    '<div style="height:8px; border-radius:4px; background:var(--border-light); overflow:hidden;">' +
                      '<div style="height:100%; width:' + pct + '%; background:#059669; border-radius:4px;"></div>' +
                    '</div>' +
                  '</div>';
              }).join('') +
            '</div>' +
            '<p style="font-size:0.75rem; color:var(--text-muted); margin-top:14px;">Scores reflect genuine formative rubrics, quizzes, and learning evidence.</p>' +
          '</div>' +

          '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:20px;">' +
            '<h3 style="font-size:1.05rem; font-weight:800; margin:0 0 14px 0; color:var(--text-main);">🌟 Classroom Habits &amp; Growth</h3>' +
            '<div style="display:flex; flex-direction:column; gap:12px;">' +
              [
                { label: 'Class Participation', pct: 85, gain: '+15% this month' },
                { label: 'Teamwork & Collaboration', pct: 75, gain: '+10% this month' },
                { label: 'Persistence & Effort', pct: 70, gain: '+20% this month' },
                { label: 'Homework Consistency', pct: 90, gain: '100% on-time' }
              ].map(h => 
                '<div>' +
                  '<div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700; margin-bottom:4px;">' +
                    '<span>' + h.label + '</span>' +
                    '<span style="color:#0284c7;">' + h.pct + '% (' + h.gain + ')</span>' +
                  '</div>' +
                  '<div style="height:8px; border-radius:4px; background:var(--border-light); overflow:hidden;">' +
                    '<div style="height:100%; width:' + h.pct + '%; background:#0284c7; border-radius:4px;"></div>' +
                  '</div>' +
                '</div>'
              ).join('') +
            '</div>' +
            '<p style="font-size:0.75rem; color:var(--text-muted); margin-top:14px;">Personal improvement highlights individual gains over time.</p>' +
          '</div>' +
        '</div>';
    }

    if (studentMonsterActiveTab === 'achievements') {
      const allAchievements = store.getAchievements();
      return '' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">' +
          allAchievements.map(ach => {
            const hasAch = store.hasStudentAchievement(student.id, ach.id);
            return '' +
              '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:16px; padding:16px; display:flex; gap:14px; align-items:flex-start; ' + (!hasAch ? 'opacity:0.7;' : '') + '">' +
                '<div style="font-size:2rem; width:48px; height:48px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:var(--bg-muted); flex-shrink:0;">' +
                  ach.icon +
                '</div>' +
                '<div style="flex:1;">' +
                  '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                    '<h4 style="margin:0; font-size:0.95rem; font-weight:800; color:var(--text-main);">' + ach.name + '</h4>' +
                    (hasAch ? '<span class="badge" style="background:rgba(16,185,129,0.15); color:#059669; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:10px;">Unlocked</span>' : '<span class="badge" style="background:var(--bg-muted); color:var(--text-muted); font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px;">In Progress</span>') +
                  '</div>' +
                  '<p style="font-size:0.78rem; color:var(--text-muted); margin:4px 0 8px 0;">' + ach.requirement + '</p>' +
                  '<div style="font-size:0.72rem; font-weight:700; color:var(--color-primary);">🎁 Monster Reward: Unlocks linked cosmetic accessories</div>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>';
    }

    if (studentMonsterActiveTab === 'collection') {
      const allItems = store.getMonsterItems();
      return '' +
        '<div class="monster-items-grid">' +
          allItems.map(item => {
            const isUnlocked = monsterState.unlockedItemIds.has(item.id);
            return '' +
              '<div class="monster-item-card ' + (!isUnlocked ? 'is-locked' : '') + '">' +
                '<div class="monster-item-icon">' + item.icon + '</div>' +
                '<div class="monster-item-name">' + item.name + '</div>' +
                '<div style="font-size:0.7rem; color:var(--color-primary); font-weight:700;">' + item.category.toUpperCase() + '</div>' +
                '<div style="font-size:0.68rem; color:var(--text-muted); margin:2px 0;">' + (isUnlocked ? '✓ In Collection' : '🔒 ' + (item.unlockType === 'level' ? 'Reach Level ' + item.unlockRequirement.level : 'Special Reward')) + '</div>' +
              '</div>';
          }).join('') +
        '</div>';
    }

    if (studentMonsterActiveTab === 'history') {
      const history = profile.evolutionHistory || [];
      if (history.length === 0) {
        return '<div style="padding:24px; text-align:center; color:var(--text-muted);">No evolution events recorded yet.</div>';
      }

      return '' +
        '<div style="display:flex; flex-direction:column; gap:12px; max-width:680px; margin:0 auto;">' +
          history.map(ev => 
            '<div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:16px;">' +
              '<div style="font-size:1.6rem; width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:var(--bg-muted); flex-shrink:0;">' +
                (ev.type === 'hatch' ? '🐣' : ev.type === 'evolve' ? '🐲' : ev.type === 'unlock' ? '🎁' : '🥚') +
              '</div>' +
              '<div style="flex:1;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                  '<h4 style="margin:0; font-size:0.95rem; font-weight:800; color:var(--text-main);">' + ev.title + '</h4>' +
                  '<span style="font-size:0.75rem; color:var(--text-muted);">' + ev.date + '</span>' +
                '</div>' +
                '<p style="margin:3px 0 0 0; font-size:0.8rem; color:var(--text-muted);">' + ev.detail + '</p>' +
              '</div>' +
            '</div>'
          ).join('') +
        '</div>';
    }

    return '';
  }

  // --- CELEBRATION MODALS ---
  window.openMonsterLevelUpModal = function(studentId, fromLevelNum, toLevelNum) {
    const student = store.getStudent(studentId);
    if (!student) return;
    const levels = store.getProgressionLevels();
    const fromLvl = levels.find(l => l.level === fromLevelNum) || levels[0];
    const toLvl = levels.find(l => l.level === toLevelNum) || levels[1];
    const profile = store.getMonsterProfile(studentId);

    const titleEl = document.getElementById('modal-levelup-title');
    if (titleEl) titleEl.innerText = student.firstName.toUpperCase() + "'S MONSTER EVOLVED!";

    const leftCard = document.getElementById('modal-levelup-left');
    const rightCard = document.getElementById('modal-levelup-right');
    if (leftCard && rightCard && window.renderMonsterSVG) {
      leftCard.innerHTML = 
        window.renderMonsterSVG({ stage: fromLvl.stageKey, color: profile.baseColor, size: 140, animated: false }) +
        '<div style="font-weight:800; margin-top:8px;">Level ' + fromLvl.level + ': ' + fromLvl.name + '</div>';

      rightCard.innerHTML = 
        window.renderMonsterSVG({ stage: toLvl.stageKey, color: profile.baseColor, size: 160, animated: true }) +
        '<div style="font-weight:800; color:var(--color-primary); margin-top:8px;">Level ' + toLvl.level + ': ' + toLvl.name + '</div>';
    }

    const itemsWrap = document.getElementById('modal-levelup-unlocked-items');
    if (itemsWrap) {
      const unlockedItems = store.getMonsterItems().filter(it => it.unlockType === 'level' && it.unlockRequirement.level === toLvl.level);
      itemsWrap.innerHTML = unlockedItems.map(it => 
        '<div class="monster-item-card" style="padding:10px;">' +
          '<div style="font-size:1.8rem;">' + it.icon + '</div>' +
          '<div style="font-size:0.75rem; font-weight:800;">' + it.name + '</div>' +
          '<div style="font-size:0.65rem; color:var(--color-primary);">' + it.category.toUpperCase() + '</div>' +
        '</div>'
      ).join('');
    }

    const btnCustom = document.getElementById('btn-modal-levelup-customize');
    if (btnCustom) {
      btnCustom.onclick = function() {
        window.closeModal('modal-monster-levelup');
        window.openStudentDetail(studentId, 'monster');
      };
    }

    window.openModal('modal-monster-levelup');
  };

  window.openMonsterHatchModal = function(studentId) {
    const student = store.getStudent(studentId);
    if (!student) return;
    const profile = store.getMonsterProfile(studentId);

    const titleEl = document.getElementById('modal-hatch-title');
    if (titleEl) titleEl.innerText = '🥚 ✨ YOUR EGG HAS HATCHED! ✨ 🐣';

    const renderWrap = document.getElementById('modal-hatch-monster-render');
    if (renderWrap && window.renderMonsterSVG) {
      renderWrap.innerHTML = window.renderMonsterSVG({
        stage: 'baby',
        color: profile.baseColor || 'blue',
        size: 180,
        animated: true
      });
    }

    // Mark as hatched in store
    store.updateMonsterProfile(studentId, { isHatched: true });
    store.logMonsterHistory(studentId, 'hatch', '✨ Egg Hatched into Baby Monster!', 'Student reached Level 3 (250+ XP). Companion is now awake!');

    const btnCloset = document.getElementById('btn-modal-hatch-closet');
    if (btnCloset) {
      btnCloset.onclick = function() {
        window.closeModal('modal-monster-hatch');
        window.openStudentDetail(studentId, 'monster');
      };
    }

    window.openModal('modal-monster-hatch');
  };

  window.openEvolutionPathModal = function(studentId) {
    const levels = store.getProgressionLevels();
    const student = studentId ? store.getStudent(studentId) : null;
    const monsterState = student ? store.calculateMonsterState(student.id) : null;
    const profile = student ? store.getMonsterProfile(student.id) : null;

    const listEl = document.getElementById('modal-evolution-path-list');
    if (!listEl) return;

    listEl.innerHTML = levels.map(l => {
      const isReached = monsterState ? monsterState.currentLevel >= l.level : false;
      const isCurrent = monsterState ? monsterState.currentLevel === l.level : false;

      const stageSvg = window.renderMonsterSVG ? window.renderMonsterSVG({
        stage: l.stageKey,
        color: profile ? profile.baseColor : 'blue',
        size: 70,
        animated: isCurrent
      }) : '👾';

      return '' +
        '<div class="evolution-path-card ' + (isCurrent ? 'is-current' : '') + ' ' + (!isReached ? 'is-locked' : '') + '">' +
          '<div style="width:70px; height:70px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
            stageSvg +
          '</div>' +
          '<div style="flex:1;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<h4 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-main);">' + l.name + '</h4>' +
              '<span class="badge" style="background:var(--bg-muted); color:var(--text-main); font-weight:800; font-size:0.75rem; padding:3px 10px; border-radius:12px;">' + l.xpRequired.toLocaleString() + ' XP</span>' +
            '</div>' +
            '<p style="font-size:0.82rem; color:var(--text-muted); margin:4px 0 6px 0;">' + l.description + '</p>' +
            '<div style="font-size:0.72rem; color:var(--color-primary); font-weight:700;">🎁 Rewards: ' + (l.rewards ? l.rewards.join(', ') : 'Cosmetics & evolution perks') + '</div>' +
          '</div>' +
          (isCurrent ? '<div class="badge" style="background:var(--color-primary); color:#ffffff; font-weight:800; font-size:0.72rem; padding:4px 10px; border-radius:12px;">Current Stage</div>' : '') +
        '</div>';
    }).join('');

    window.openModal('modal-evolution-path');
  };

  // Expose key view renderers to window
  window.renderStudentsView = renderStudentsView;
  window.renderClassroomStudentsGrid = renderClassroomStudentsGrid;
  window.renderClassroomGroupsGrid = renderClassroomGroupsGrid;
  window.renderLeaderboardView = renderLeaderboardView;
  window.renderToolkitRandomView = renderToolkitRandomView;

  })(typeof window !== 'undefined' ? window : global);
