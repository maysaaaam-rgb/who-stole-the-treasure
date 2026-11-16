/**
 * ENGLISH ADVENTURE ACADEMY — INTERACTIVE SITE MAP ATLAS CONTROLLER
 * Pure Vanilla ES6+ · Zero External Runtime Dependencies · Zero Cloud Writes
 */
(function () {
  'use strict';

  const MAP = window.EAA_SITE_MAP || {
    generatedAt: '',
    summary: {},
    quickTasks: [],
    navigation: { places: [], switchRoutes: [] },
    indexHtml: { modals: [], scripts: [], cssLinks: [], toolTabs: [] },
    jsModules: [],
    cssModules: [],
    gameMaker: { modes: [], sets: [], engineFiles: [] },
    curriculum: { gamesData: [], timetableCatalog: [], lessonPlans: [], rootInventory: [] },
    cloud: { avatarAssets: {}, monsterLayers: [], supabaseTables: [], storageKeys: [], customEvents: [], sqlFiles: [] },
    git: { modifiedFiles: [], deletedTopFolders: [], untrackedRedactedAvatarCount: 0 }
  };

  const state = {
    activeTab: 'graph',
    graphPreset: 'system',
    selectedNodeId: null,
    panX: 24,
    panY: 20,
    zoom: 1,
    jsCategory: 'All',
    screensSub: 'places',
    gmSub: 'modes',
    currFilter: 'all',
    gitFilter: 'ALL',
    soundOn: true
  };

  // -------------------------------------------------------------------------
  // Polyphonic Web Audio Musical Chimes (AGENTS.md §1.3 — Autoplay Guarded)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  function ensureAudio() {
    if (!state.soundOn) return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playChord(freqs, dur = 0.16) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(f, now + idx * 0.032);
      osc2.frequency.setValueAtTime(f * 2, now + idx * 0.032);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.032);
      gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.032 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.032 + dur);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now + idx * 0.032);
      osc2.start(now + idx * 0.032);
      osc1.stop(now + idx * 0.032 + dur + 0.02);
      osc2.stop(now + idx * 0.032 + dur + 0.02);
    });
  }

  function playTap() { playChord([523.25, 659.25], 0.14); }
  function playSuccess() { playChord([523.25, 659.25, 783.99, 1046.5], 0.2); }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('sm-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 1900);
  }

  window.smCopyPath = function (relPath) {
    playSuccess();
    const text = String(relPath || '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('📋 Copied: ' + text)).catch(() => showToast('📋 ' + text));
    } else {
      showToast('📋 ' + text);
    }
  };

  function safetyBadgeClass(tag) {
    const t = String(tag || '');
    if (t.includes('MISSING') || t.includes('PRIVACY')) return 'badge-danger';
    if (t.includes('LOCAL-ONLY') || t.includes('PARTIALLY')) return 'badge-warn';
    if (t.includes('MODIFIED') || t.includes('NEW')) return 'badge-mod';
    return 'badge-live';
  }

  // -------------------------------------------------------------------------
  // Slide-Over Inspector Drawer (Deep JS File Chapters & Functions)
  // -------------------------------------------------------------------------
  window.smInspectJs = function (relPath) {
    playTap();
    const mod = MAP.jsModules.find((m) => m.path === relPath);
    if (!mod) return;

    const backdrop = document.getElementById('sm-drawer-backdrop');
    const eyebrow = document.getElementById('sm-drawer-eyebrow');
    const title = document.getElementById('sm-drawer-title');
    const body = document.getElementById('sm-drawer-body');

    eyebrow.textContent = `${mod.category.toUpperCase()} · ${mod.lines} LINES · ${mod.kb} KB`;
    title.textContent = mod.path;

    const exportsHtml = mod.exports.length
      ? `<div class="sm-meta-row">${mod.exports.map((e) => `<span class="sm-code-badge">window.${esc(e)}</span>`).join('')}</div>`
      : '<span class="sm-stat-sub">Self-contained IIFE / internal handlers</span>';

    const sectionsHtml = mod.sections.length
      ? mod.sections.map((s) => `
          <div class="sm-chapter-item">
            <div>
              <div style="font-weight:800;font-size:0.9rem;">${esc(s.title)}</div>
              <span class="sm-code-badge">Lines ${s.line}–${s.endLine}</span>
            </div>
            <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(mod.path)}:${s.line}')">📋 Copy Line</button>
          </div>
        `).join('')
      : '<p class="sm-section-desc">Compact module without banner dividers — see function landmarks below.</p>';

    const fnsHtml = mod.keyFunctions.length
      ? mod.keyFunctions.slice(0, 100).map((f) => `
          <div class="sm-chapter-item">
            <div>
              <span class="sm-code-badge">${esc(f.name)}</span>
            </div>
            <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(mod.path)}:${f.line}')">L${f.line} · Copy</button>
          </div>
        `).join('')
      : '<p class="sm-section-desc">No standalone named function declarations detected.</p>';

    body.innerHTML = `
      <div class="sm-card">
        <p class="sm-node-desc">${esc(mod.summary)}</p>
        <div class="sm-meta-row">
          <span class="sm-badge ${mod.loadedInIndex ? 'badge-live' : 'badge-violet'}">
            ${mod.loadedInIndex ? `Loaded in index.html (#${mod.loadOrder}, ?v=${esc(mod.cacheVersion)})` : 'Standalone / On-Demand Script'}
          </span>
          <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smCopyPath('${esc(mod.path)}')">📋 Copy Path</button>
        </div>
      </div>

      <div>
        <h3 class="sm-card-title" style="margin-bottom:8px;">🌐 Global Exports (${mod.totalExports})</h3>
        ${exportsHtml}
      </div>

      <div>
        <h3 class="sm-card-title" style="margin-bottom:8px;">📑 Section Chapters (${mod.sections.length})</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">${sectionsHtml}</div>
      </div>

      <div>
        <h3 class="sm-card-title" style="margin-bottom:8px;">⚡ Function Landmarks (${mod.keyFunctions.length} shown of ${mod.totalFunctions})</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">${fnsHtml}</div>
      </div>
    `;

    backdrop.style.display = 'flex';
  };

  function closeDrawer() {
    const backdrop = document.getElementById('sm-drawer-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  // -------------------------------------------------------------------------
  // Tab 0: Interactive Pan/Zoom Node-and-Wire Graph
  // -------------------------------------------------------------------------
  const GRAPH_PRESETS = {
    system: {
      title: 'Full Platform Architecture Graph',
      lanes: ['1. Entry & Routing', '2. Navigation Places (7)', '3. Engines, Store & Worlds', '4. State, Cloud & Privacy'],
      nodes: [
        // Lane 0: Entry & Routing
        { id: 'n_index', lane: 0, row: 1.2, tone: 'cyan', icon: '🔐', title: 'Main Platform Host', file: 'index.html', meta: 'PBKDF2 PIN Lock · 69 Modals · 68 Scripts', url: '../index.html' },
        { id: 'n_nav', lane: 0, row: 2.8, tone: 'cyan', icon: '🧭', title: 'PlatformNav Router', file: 'js/platform-nav.js', meta: '7-Place Sidebar + Class Mode Rail + Ctrl+K', inspectJs: 'js/platform-nav.js' },
        { id: 'n_404', lane: 0, row: 4.4, tone: 'cyan', icon: '🕵️', title: 'Deep-Link Hub', file: '404.html', meta: '43 friendly GitHub Pages redirects', url: '../404.html' },
        { id: 'n_dir', lane: 0, row: 5.8, tone: 'cyan', icon: '🧒', title: 'Students Directory', file: 'directory.html', meta: 'Standalone roster & monster grid', url: '../directory.html' },

        // Lane 1: 7 Navigation Places
        { id: 'p_today', lane: 1, row: 0.4, tone: 'violet', icon: '▶️', title: 'Today Ribbon', file: 'js/timetable.js', meta: 'Daily classes + 1-tap lesson launch', url: '../index.html#today', inspectJs: 'js/timetable.js' },
        { id: 'p_board', lane: 1, row: 1.5, tone: 'violet', icon: '📺', title: 'Live Class Board', file: 'js/class-board.js', meta: 'Points, Groups, Picker, Karaoke & Mio', url: '../index.html#board', inspectJs: 'js/class-board.js' },
        { id: 'p_shop', lane: 1, row: 2.6, tone: 'emerald', icon: '🛍️', title: 'Unified Avatar Shop', file: 'js/classroom-store.js', meta: 'Single-window Customizer + Mystery Box', url: '../index.html#store-pupil', inspectJs: 'js/classroom-store.js' },
        { id: 'p_lib', lane: 1, row: 3.7, tone: 'violet', icon: '📖', title: 'Library & Plans', file: 'js/library-shelf.js', meta: '120 Lessons, Game Maker & 56 Plans', url: '../index.html#library', inspectJs: 'js/library-shelf.js' },
        { id: 'p_tools', lane: 1, row: 4.8, tone: 'violet', icon: '🪄', title: 'Board & Book Tools', file: 'smart-board/index.html', meta: 'AI Smart Board, Magic Book & Soundboard', url: '../smart-board/index.html' },
        { id: 'p_plan', lane: 1, row: 5.9, tone: 'violet', icon: '📅', title: 'Plan & Calendar', file: 'js/calendar-view.js', meta: 'Weekly timetable & school calendar', url: '../index.html#calendar', inspectJs: 'js/calendar-view.js' },
        { id: 'p_more', lane: 1, row: 7.0, tone: 'violet', icon: '⚙️', title: 'More / Teacher Hub', file: 'js/command-center.js', meta: 'XP logs, Store settings, Island & Backups', url: '../index.html#command', inspectJs: 'js/command-center.js' },

        // Lane 2: Engines, Store & Worlds
        { id: 'e_avatars', lane: 2, row: 0.7, tone: 'emerald', icon: '🧑', title: 'PupilAvatars 2D + 3D', file: 'js/pupil-avatars.js', meta: 'Poses, 50+ wearables & 3D Stadium Rig', inspectJs: 'js/pupil-avatars.js' },
        { id: 'e_monsters', lane: 2, row: 1.9, tone: 'emerald', icon: '🐉', title: '8-Layer Monster Stage', file: 'js/monster-renderer.js', meta: 'z-0..z-70 SVG compositor + Sky Dragon', url: '../monster-studio/index.html', inspectJs: 'js/monster-renderer.js' },
        { id: 'e_gm', lane: 2, row: 3.1, tone: 'amber', icon: '🎮', title: 'Game Maker 2.0', file: 'game-maker/index.html', meta: '22 Arcade Modes + 75 Question Sets', url: '../game-maker/index.html' },
        { id: 'e_pen3d', lane: 2, row: 4.2, tone: 'amber', icon: '⚽', title: '3D Penalty Stadium', file: 'game-maker/js/mode-penalty.js', meta: 'Three.js Stadium + Extruded Pixar 3D', url: '../game-maker/index.html?game=penalty' },
        { id: 'e_lessons', lane: 2, row: 5.3, tone: 'amber', icon: '📚', title: '120 Lessons & Books', file: 'js/games-data.js', meta: 'G3/G4 Units, Magic Book & Pharaoh Book', url: '../pharaoh-living-book.html', inspectJs: 'js/games-data.js' },
        { id: 'e_island', lane: 2, row: 6.5, tone: 'amber', icon: '🏝️', title: 'Practice Island & Passport', file: 'island/index.html', meta: 'Student Home World + 2D Map + Booklets', url: '../island/index.html?demo=1' },

        // Lane 3: State, Cloud & Privacy
        { id: 'c_app', lane: 3, row: 1.0, tone: 'coral', icon: '🎛️', title: 'school-app Controller', file: 'js/school-app.js', meta: '17,214 lines · 42 switchView() routes', inspectJs: 'js/school-app.js' },
        { id: 'c_store', lane: 3, row: 2.5, tone: 'coral', icon: '🗄️', title: 'schoolStore State', file: 'js/school-store.js', meta: '17,598 lines · Roster, XP, Coins, Levels', inspectJs: 'js/school-store.js' },
        { id: 'c_supa', lane: 3, row: 4.1, tone: 'coral', icon: '☁️', title: 'Supabase Cloud Sync', file: 'js/supabase-client.js', meta: '15 PostgreSQL tables + Realtime sync', inspectJs: 'js/supabase-client.js' },
        { id: 'c_priv', lane: 3, row: 5.5, tone: 'coral', icon: '🔒', title: 'EAAPrivate Vault', file: 'js/private-data.js', meta: 'AES-256-GCM memory-only pupil data', inspectJs: 'js/private-data.js' },
        { id: 'c_bak', lane: 3, row: 6.8, tone: 'coral', icon: '💾', title: 'Offline & Daily Backup', file: 'js/daily-backup.js', meta: 'sw.js cache + daily XP/coin snapshots', inspectJs: 'js/daily-backup.js' }
      ],
      edges: [
        ['n_index', 'n_nav'], ['n_index', 'c_app'], ['n_404', 'n_index'], ['n_404', 'e_lessons'], ['n_404', 'e_island'], ['n_dir', 'c_store'],
        ['n_nav', 'p_today'], ['n_nav', 'p_board'], ['n_nav', 'p_shop'], ['n_nav', 'p_lib'], ['n_nav', 'p_tools'], ['n_nav', 'p_plan'], ['n_nav', 'p_more'],
        ['p_today', 'e_lessons'], ['p_today', 'e_gm'], ['p_today', 'c_store'],
        ['p_board', 'e_avatars'], ['p_board', 'e_monsters'], ['p_board', 'c_store'],
        ['p_shop', 'e_avatars'], ['p_shop', 'e_monsters'], ['p_shop', 'c_store'],
        ['p_lib', 'e_gm'], ['p_lib', 'e_lessons'], ['p_tools', 'e_lessons'],
        ['p_plan', 'p_today'], ['p_more', 'e_island'], ['p_more', 'c_store'], ['p_more', 'c_bak'],
        ['e_avatars', 'e_pen3d'], ['e_gm', 'e_pen3d'], ['e_lessons', 'c_app'], ['e_island', 'c_supa'],
        ['c_app', 'c_store'], ['c_store', 'c_supa'], ['c_supa', 'c_priv'], ['c_store', 'c_bak']
      ]
    },

    dataflow: {
      title: 'JS Monoliths, Store & Cloud Data-Flow Graph',
      lanes: ['1. Auth & Cloud Layer', '2. Central Reactive Store', '3. Avatar & Shop Controllers', '4. Classroom & Curriculum UI'],
      nodes: [
        { id: 'd_auth', lane: 0, row: 1.0, tone: 'coral', icon: '🔑', title: 'teacher-auth.js', file: 'js/teacher-auth.js', meta: 'Supabase Teacher Session & RLS Gate', inspectJs: 'js/teacher-auth.js' },
        { id: 'd_supa', lane: 0, row: 2.4, tone: 'coral', icon: '☁️', title: 'supabase-client.js', file: 'js/supabase-client.js', meta: 'students, xp_transactions, mystery_boxes', inspectJs: 'js/supabase-client.js' },
        { id: 'd_sync', lane: 0, row: 3.8, tone: 'coral', icon: '🔄', title: 'school-cloud-sync.js', file: 'js/school-cloud-sync.js', meta: 'Bidirectional merge & conflict guard', inspectJs: 'js/school-cloud-sync.js' },
        { id: 'd_priv', lane: 0, row: 5.2, tone: 'coral', icon: '🔒', title: 'private-data.js', file: 'js/private-data.js', meta: 'AES-256-GCM survey, parentNotes, birthdays', inspectJs: 'js/private-data.js' },

        { id: 'd_store', lane: 1, row: 1.8, tone: 'amber', icon: '🗄️', title: 'school-store.js (17.6k L)', file: 'js/school-store.js', meta: 'Single source of truth + eaa_master_school_v6', inspectJs: 'js/school-store.js' },
        { id: 'd_app', lane: 1, row: 3.6, tone: 'cyan', icon: '🎛️', title: 'school-app.js (17.2k L)', file: 'js/school-app.js', meta: 'Master router, 42 views & CRUD modals', inspectJs: 'js/school-app.js' },
        { id: 'd_sound', lane: 1, row: 5.2, tone: 'cyan', icon: '🎵', title: 'classroom-sounds.js', file: 'js/classroom-sounds.js', meta: 'Web Audio API polyphonic soundboard (1–7)', inspectJs: 'js/classroom-sounds.js' },

        { id: 'd_pav', lane: 2, row: 0.9, tone: 'emerald', icon: '🧑', title: 'pupil-avatars.js', file: 'js/pupil-avatars.js', meta: '2D canvas portraits + 3D pitch rig parts', inspectJs: 'js/pupil-avatars.js' },
        { id: 'd_cstore', lane: 2, row: 2.3, tone: 'emerald', icon: '🛍️', title: 'classroom-store.js', file: 'js/classroom-store.js', meta: 'Unified Store, Try-On & Teacher Pricing', inspectJs: 'js/classroom-store.js' },
        { id: 'd_mbox', lane: 2, row: 3.7, tone: 'emerald', icon: '🎁', title: 'mystery-box-v2.js', file: 'js/mystery-box-v2.js', meta: '3D chest reveal & rarity drops', inspectJs: 'js/mystery-box-v2.js' },
        { id: 'd_mrend', lane: 2, row: 5.1, tone: 'emerald', icon: '🐉', title: 'monster-renderer.js', file: 'js/monster-renderer.js', meta: '8-layer stage + monster-pets.js', inspectJs: 'js/monster-renderer.js' },

        { id: 'd_board', lane: 3, row: 0.8, tone: 'violet', icon: '📺', title: 'class-board.js', file: 'js/class-board.js', meta: 'Live smartboard roster, groups & XP', url: '../index.html#board', inspectJs: 'js/class-board.js' },
        { id: 'd_cmd', lane: 3, row: 2.1, tone: 'violet', icon: '🧑‍🏫', title: 'command-center.js', file: 'js/command-center.js', meta: 'Teacher Hub, logs & bulk tools', url: '../index.html#command', inspectJs: 'js/command-center.js' },
        { id: 'd_tt', lane: 3, row: 3.4, tone: 'violet', icon: '📅', title: 'timetable.js + calendar', file: 'js/timetable.js', meta: 'Today ribbon & weekly lesson planner', url: '../index.html#today', inspectJs: 'js/timetable.js' },
        { id: 'd_rep', lane: 3, row: 4.7, tone: 'violet', icon: '📊', title: 'parent-report & quizzes', file: 'js/parent-report.js', meta: 'Parent reports, All About Me & Progress Check', inspectJs: 'js/parent-report.js' }
      ],
      edges: [
        ['d_auth', 'd_supa'], ['d_auth', 'd_priv'], ['d_supa', 'd_sync'], ['d_sync', 'd_store'],
        ['d_store', 'd_app'], ['d_store', 'd_pav'], ['d_store', 'd_cstore'], ['d_store', 'd_mrend'],
        ['d_cstore', 'd_pav'], ['d_cstore', 'd_mbox'], ['d_app', 'd_board'], ['d_app', 'd_cmd'], ['d_app', 'd_tt'], ['d_app', 'd_rep'],
        ['d_pav', 'd_board'], ['d_mrend', 'd_board'], ['d_priv', 'd_rep'], ['d_sound', 'd_board']
      ]
    },

    curriculum: {
      title: 'Game Maker 2.0, Lessons & Student Worlds Graph',
      lanes: ['1. Curriculum Registries', '2. Question & Media Banks', '3. Game Maker 2.0 Engine', '4. Modes & Student Worlds'],
      nodes: [
        { id: 'g_gd', lane: 0, row: 1.0, tone: 'cyan', icon: '📘', title: 'GAMES_DATA (120)', file: 'js/games-data.js', meta: 'Master registry for Grade 3 & Grade 4', inspectJs: 'js/games-data.js' },
        { id: 'g_tt', lane: 0, row: 2.6, tone: 'cyan', icon: '📅', title: 'Timetable Catalog', file: 'js/timetable.js', meta: 'Ordered Unit 1–5 teaching sequence', inspectJs: 'js/timetable.js' },
        { id: 'g_plans', lane: 0, row: 4.2, tone: 'cyan', icon: '📋', title: '56 Lesson Plans', file: 'lesson-plans/', meta: 'Paired Word (.docx) + PDF teacher plans', url: '../index.html#library' },
        { id: 'g_icdata', lane: 0, row: 5.6, tone: 'cyan', icon: '🏝️', title: 'Island Curriculum Data', file: 'js/island-curriculum-data.js', meta: 'Home practice missions & vocab', inspectJs: 'js/island-curriculum-data.js' },

        { id: 'g_sets5', lane: 1, row: 1.0, tone: 'violet', icon: '🗂️', title: '75 GM Question Sets', file: 'game-maker/js/sets-unit5.js', meta: 'sets-units14, sets-unit4, sets-unit5, bank.js', url: '../game-maker/index.html' },
        { id: 'g_speak', lane: 1, row: 2.6, tone: 'violet', icon: '🗣️', title: 'Speaking & Clue Sets', file: 'game-maker/js/sets-speaking.js', meta: 'Oral prompts for Story Dice, Bingo & Guess-eroo' },
        { id: 'g_pav3d', lane: 1, row: 4.2, tone: 'emerald', icon: '🧑', title: 'PupilAvatars Rig', file: 'js/pupil-avatars.js', meta: 'composePitchRigParts() 3D squad builder', inspectJs: 'js/pupil-avatars.js' },

        { id: 'g_hub', lane: 2, row: 1.4, tone: 'amber', icon: '🎮', title: 'Game Maker Host', file: 'game-maker/index.html', meta: 'Team selector, set picker & revision tools', url: '../game-maker/index.html' },
        { id: 'g_core', lane: 2, row: 3.0, tone: 'amber', icon: '⚙️', title: 'Core + Juice + Audio', file: 'game-maker/js/core.js', meta: '60fps loop, hit-stop, confetti & Web Audio' },
        { id: 'g_three', lane: 2, row: 4.6, tone: 'emerald', icon: '🌐', title: 'Three.js WebGL Engine', file: 'game-maker/js/vendor/three.min.js', meta: 'Real-time 3D shadows, stadium & ball curve' },

        { id: 'g_m3d', lane: 3, row: 0.6, tone: 'emerald', icon: '⚽', title: '3D Penalty Shootout', file: 'game-maker/js/mode-penalty.js', meta: 'Extruded 3D Pixar striker & goalkeeper', url: '../game-maker/index.html?game=penalty' },
        { id: 'g_mskill', lane: 3, row: 1.9, tone: 'amber', icon: '🎯', title: 'Skill & Physics Modes (10)', file: 'game-maker/js/mode-cannon.js', meta: 'Cannon, Fling, Baseball, Bowling, Tower, Balloon…', url: '../game-maker/index.html?game=cannon' },
        { id: 'g_mboard', lane: 3, row: 3.2, tone: 'amber', icon: '🎲', title: 'Board & Strategy Modes (11)', file: 'game-maker/js/mode-board3.js', meta: 'Star Loop Monopoly, Tile Board, Snakes, Bingo…', url: '../game-maker/index.html?game=boardgame' },
        { id: 'g_books', lane: 3, row: 4.5, tone: 'violet', icon: '👑', title: 'Living & Magic Books', file: 'pharaoh-living-book.html', meta: 'Pharaoh Pop-Up Book + Unit 5 Magic Book', url: '../pharaoh-living-book.html' },
        { id: 'g_worlds', lane: 3, row: 5.8, tone: 'cyan', icon: '🛂', title: 'Island + Passport + Home', file: 'island/index.html', meta: 'Practice Island 2D World & Student Booklets', url: '../island/index.html?demo=1' }
      ],
      edges: [
        ['g_gd', 'g_hub'], ['g_gd', 'g_books'], ['g_tt', 'g_hub'], ['g_plans', 'g_books'], ['g_icdata', 'g_worlds'],
        ['g_sets5', 'g_hub'], ['g_speak', 'g_hub'], ['g_hub', 'g_core'], ['g_hub', 'g_three'],
        ['g_pav3d', 'g_three'], ['g_three', 'g_m3d'], ['g_core', 'g_m3d'], ['g_core', 'g_mskill'], ['g_core', 'g_mboard'],
        ['g_gd', 'g_worlds']
      ]
    }
  };

  function getGraphLayout(presetKey) {
    const preset = GRAPH_PRESETS[presetKey] || GRAPH_PRESETS.system;
    const NODE_W = 230;
    const NODE_H = 82;
    const COL_GAP = 325;
    const ROW_GAP = 100;
    const PAD_X = 36;
    const PAD_Y = 64;

    const nodes = preset.nodes.map((n) => ({
      ...n,
      x: PAD_X + n.lane * COL_GAP,
      y: PAD_Y + n.row * ROW_GAP,
      w: NODE_W,
      h: NODE_H
    }));

    const byId = new Map(nodes.map((n) => [n.id, n]));
    const maxX = Math.max(...nodes.map((n) => n.x + n.w)) + PAD_X;
    const maxY = Math.max(...nodes.map((n) => n.y + n.h)) + 44;

    return { preset, nodes, byId, width: maxX, height: maxY, colGap: COL_GAP, padX: PAD_X };
  }

  function renderGraphTab() {
    const layout = getGraphLayout(state.graphPreset);
    const selId = state.selectedNodeId;
    const connectedNodes = new Set();
    if (selId) {
      connectedNodes.add(selId);
      layout.preset.edges.forEach(([a, b]) => {
        if (a === selId) connectedNodes.add(b);
        if (b === selId) connectedNodes.add(a);
      });
    }

    const selNode = selId ? layout.byId.get(selId) : null;

    // Build SVG wires
    const wiresSvg = layout.preset.edges.map(([fromId, toId]) => {
      const a = layout.byId.get(fromId);
      const b = layout.byId.get(toId);
      if (!a || !b) return '';
      const x1 = a.x + a.w;
      const y1 = a.y + a.h / 2;
      const x2 = b.x;
      const y2 = b.y + b.h / 2;
      const dx = Math.max(60, Math.abs(x2 - x1) * 0.48);
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      const isHi = selId && (fromId === selId || toId === selId);
      const cls = selId ? (isHi ? 'sm-wire-group is-highlighted' : 'sm-wire-group is-dimmed') : 'sm-wire-group';
      return `
        <g class="${cls}">
          <path class="sm-wire-base" d="${d}"></path>
          <path class="sm-wire-pulse" d="${d}"></path>
        </g>
      `;
    }).join('');

    const lanesHtml = layout.preset.lanes.map((label, idx) => `
      <div class="sm-lane-label" style="left:${layout.padX + idx * layout.colGap}px; top:14px;">
        ${esc(label)}
      </div>
    `).join('');

    const nodesHtml = layout.nodes.map((n) => {
      let stateCls = '';
      if (selId) {
        if (n.id === selId) stateCls = 'is-selected';
        else if (connectedNodes.has(n.id)) stateCls = 'is-neighbor';
        else stateCls = 'is-dimmed';
      }
      return `
        <div
          class="sm-gnode tone-${n.tone} ${stateCls}"
          data-node-id="${esc(n.id)}"
          style="left:${n.x}px; top:${n.y}px;"
          onclick="smSelectGraphNode('${esc(n.id)}', event)"
          ondblclick="${n.inspectJs ? `smInspectJs('${esc(n.inspectJs)}')` : (n.url ? `location.href='${esc(n.url)}'` : '')}"
          title="Click to trace connections · Double-click to open/inspect"
        >
          <div class="sm-gnode-head">
            <span class="sm-gnode-icon">${n.icon}</span>
            <span class="sm-gnode-title">${esc(n.title)}</span>
          </div>
          <div class="sm-gnode-file">${esc(n.file)}</div>
          <div class="sm-gnode-meta">${esc(n.meta)}</div>
        </div>
      `;
    }).join('');

    const focusBarHtml = selNode ? `
      <div class="sm-graph-focus-bar">
        <div>
          <span class="sm-eyebrow">SELECTED GRAPH NODE · ${connectedNodes.size - 1} DIRECT CONNECTIONS</span>
          <h3 class="sm-card-title" style="font-size:1.1rem;margin-top:2px;">${selNode.icon} ${esc(selNode.title)} <span class="sm-code-badge" style="margin-left:6px;">${esc(selNode.file)}</span></h3>
          <p class="sm-section-desc">${esc(selNode.meta)}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${selNode.url ? `<a href="${esc(selNode.url)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Open Live</a>` : ''}
          ${selNode.inspectJs ? `<button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('${esc(selNode.inspectJs)}')">📑 Inspect Chapters &amp; Lines</button>` : ''}
          <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(selNode.file)}')">📋 Copy Path</button>
          <button type="button" class="btn-3d btn-3d-coral sm-compact-btn" onclick="smSelectGraphNode(null, event)">✕ Clear Focus</button>
        </div>
      </div>
    ` : `
      <div class="sm-graph-focus-bar" style="border-color:rgba(56,189,248,0.28);">
        <div style="font-size:0.88rem;color:var(--text-soft);">
          💡 <strong>Tip:</strong> Click any node above to illuminate its exact upstream &amp; downstream wires, drag empty space to pan, or scroll to zoom!
        </div>
      </div>
    `;

    return `
      <section class="sm-glass-panel">
        <div class="sm-graph-toolbar">
          <div class="sm-graph-controls">
            <button type="button" class="btn-3d sm-filter-pill ${state.graphPreset === 'system' ? 'is-active' : ''}" onclick="smSetGraphPreset('system')">🕸️ Full System Graph (22 Nodes)</button>
            <button type="button" class="btn-3d sm-filter-pill ${state.graphPreset === 'dataflow' ? 'is-active' : ''}" onclick="smSetGraphPreset('dataflow')">🧬 JS Monoliths &amp; Cloud Flow</button>
            <button type="button" class="btn-3d sm-filter-pill ${state.graphPreset === 'curriculum' ? 'is-active' : ''}" onclick="smSetGraphPreset('curriculum')">🎮 Game Maker &amp; Worlds Graph</button>
          </div>
          <div class="sm-graph-controls">
            <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smZoomGraph(1.18)" title="Zoom In">➕ Zoom In</button>
            <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smZoomGraph(0.84)" title="Zoom Out">➖ Zoom Out</button>
            <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smFitGraph()" title="Fit Entire Graph to Screen">🎯 Fit Screen</button>
          </div>
        </div>

        <div class="sm-graph-legend">
          <span class="sm-legend-item"><span class="sm-legend-dot" style="background:var(--cyan);"></span> Entry &amp; Routing</span>
          <span class="sm-legend-item"><span class="sm-legend-dot" style="background:var(--violet);"></span> Screens &amp; Classroom UI</span>
          <span class="sm-legend-item"><span class="sm-legend-dot" style="background:var(--emerald);"></span> 3D Avatars, Monsters &amp; Store</span>
          <span class="sm-legend-item"><span class="sm-legend-dot" style="background:var(--amber);"></span> Game Maker &amp; Worlds</span>
          <span class="sm-legend-item"><span class="sm-legend-dot" style="background:var(--coral);"></span> Store, Supabase &amp; Privacy Vault</span>
        </div>

        <div class="sm-graph-viewport" id="sm-graph-viewport">
          <div class="sm-graph-stage" id="sm-graph-stage" style="width:${layout.width}px; height:${layout.height}px; transform: translate(${state.panX}px, ${state.panY}px) scale(${state.zoom});">
            <svg class="sm-graph-svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
              ${wiresSvg}
            </svg>
            ${lanesHtml}
            ${nodesHtml}
          </div>
          <div class="sm-graph-hud" id="sm-graph-hud">Drag to pan · Scroll to zoom · Click node to trace wires</div>
        </div>

        ${focusBarHtml}
      </section>
    `;
  }

  function applyGraphTransform() {
    const stage = document.getElementById('sm-graph-stage');
    const hud = document.getElementById('sm-graph-hud');
    if (stage) {
      stage.style.transform = `translate(${Math.round(state.panX)}px, ${Math.round(state.panY)}px) scale(${state.zoom.toFixed(3)})`;
    }
    if (hud) {
      hud.textContent = `Zoom: ${Math.round(state.zoom * 100)}% · Drag to pan · Click any node to trace wires`;
    }
  }

  function fitGraphToViewport() {
    const vp = document.getElementById('sm-graph-viewport');
    if (!vp) return;
    const layout = getGraphLayout(state.graphPreset);
    const vw = vp.clientWidth || 1100;
    const vh = vp.clientHeight || 620;
    const scaleX = (vw - 28) / layout.width;
    const scaleY = (vh - 28) / layout.height;
    const fitScale = Math.max(0.42, Math.min(1.08, Math.min(scaleX, scaleY)));
    state.zoom = fitScale;
    state.panX = Math.max(10, (vw - layout.width * fitScale) / 2);
    state.panY = Math.max(8, (vh - layout.height * fitScale) / 2);
    applyGraphTransform();
  }

  function bindGraphInteractions() {
    const vp = document.getElementById('sm-graph-viewport');
    if (!vp) return;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let origPanX = 0;
    let origPanY = 0;

    vp.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.sm-gnode')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origPanX = state.panX;
      origPanY = state.panY;
      vp.classList.add('is-panning');
      try { vp.setPointerCapture(e.pointerId); } catch (_) {}
    });

    vp.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      state.panX = origPanX + (e.clientX - startX);
      state.panY = origPanY + (e.clientY - startY);
      applyGraphTransform();
    });

    const endDrag = () => {
      dragging = false;
      vp.classList.remove('is-panning');
    };
    vp.addEventListener('pointerup', endDrag);
    vp.addEventListener('pointercancel', endDrag);

    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const nextZoom = Math.max(0.38, Math.min(1.85, state.zoom * factor));
      state.panX = mx - ((mx - state.panX) / state.zoom) * nextZoom;
      state.panY = my - ((my - state.panY) / state.zoom) * nextZoom;
      state.zoom = nextZoom;
      applyGraphTransform();
    }, { passive: false });
  }

  window.smSetGraphPreset = function (preset) {
    playTap();
    state.graphPreset = preset;
    state.selectedNodeId = null;
    renderActiveTab();
    fitGraphToViewport();
  };

  window.smSelectGraphNode = function (nodeId, ev) {
    if (ev) ev.stopPropagation();
    playTap();
    state.selectedNodeId = (state.selectedNodeId === nodeId) ? null : nodeId;
    renderActiveTab(false);
  };

  window.smZoomGraph = function (factor) {
    playTap();
    const vp = document.getElementById('sm-graph-viewport');
    const cx = vp ? vp.clientWidth / 2 : 550;
    const cy = vp ? vp.clientHeight / 2 : 310;
    const nextZoom = Math.max(0.38, Math.min(1.85, state.zoom * factor));
    state.panX = cx - ((cx - state.panX) / state.zoom) * nextZoom;
    state.panY = cy - ((cy - state.panY) / state.zoom) * nextZoom;
    state.zoom = nextZoom;
    applyGraphTransform();
  };

  window.smFitGraph = function () {
    playTap();
    fitGraphToViewport();
  };

  // -------------------------------------------------------------------------
  // Tab 1: Overview, Live Launch Deck & "Where Do I Edit X?"
  // -------------------------------------------------------------------------
  function renderOverviewTab() {
    const s = MAP.summary;
    const quickDeck = [
      { icon: '🏫', title: 'Main School Platform', route: '../index.html', desc: 'Teacher Dashboard, Today ribbon, Lock Screen & all 7 places.', btn: 'btn-3d-cyan' },
      { icon: '📺', title: 'Live Class Board', route: '../index.html#board', desc: 'Smartboard pupil tiles, +XP awards, Groups, Picker & Karaoke.', btn: 'btn-3d-violet' },
      { icon: '🛍️', title: 'Unified Avatar Shop', route: '../index.html#store-pupil', desc: 'Single-window 3D avatar customizer, try-on wearables & Mystery Boxes.', btn: 'btn-3d-emerald' },
      { icon: '🎮', title: 'Game Maker 2.0', route: '../game-maker/index.html', desc: `${s.gmModes || 22} classroom arcade modes + ${s.gmSets || 75} question banks.`, btn: 'btn-3d-amber' },
      { icon: '⚽', title: '3D Penalty Shootout', route: '../game-maker/index.html?game=penalty', desc: 'Three.js 3D stadium with extruded Pixar 3D pupil avatars.', btn: 'btn-3d-emerald' },
      { icon: '🏝️', title: 'Practice Island', route: '../island/index.html?demo=1', desc: 'Student home practice island, 2D walking world & harbour shop.', btn: 'btn-3d-cyan' },
      { icon: '🛂', title: 'My Passport', route: '../passport/index.html', desc: 'Student speaking/writing booklets & class gallery.', btn: 'btn-3d-violet' },
      { icon: '🪄', title: 'AI Smart Board', route: '../smart-board/index.html', desc: 'Interactive classroom whiteboard & live drawing stage.', btn: 'btn-3d-amber' },
      { icon: '📖', title: 'The Magic Book', route: '../magic-book/index.html?grade=3', desc: 'Interactive Unit 5 storybook reader for Grade 3 & Grade 4.', btn: 'btn-3d-coral' },
      { icon: '👑', title: 'Pharaoh Living Book', route: '../pharaoh-living-book.html', desc: '3D pop-up living book for Grade 3 Egypt Kingdom (Lessons 1–8).', btn: 'btn-3d-amber' },
      { icon: '🧒', title: 'Students Directory', route: '../directory.html', desc: 'Standalone class roster & elemental monster companions.', btn: 'btn-3d-slate' },
      { icon: '🏠', title: 'Family Home View', route: '../home-view/index.html', desc: 'Parent & student home overview portal.', btn: 'btn-3d-slate' }
    ];

    return `
      <!-- Top Stats Ribbon -->
      <div class="sm-stats-grid">
        <div class="sm-stat-card">
          <span class="sm-stat-num accent-cyan">${s.places || 7} / ${s.switchViews || 42}</span>
          <span class="sm-stat-label">Rail Places / Views</span>
          <span class="sm-stat-sub">${s.modals || 69} reusable modals in index.html</span>
        </div>
        <div class="sm-stat-card">
          <span class="sm-stat-num accent-violet">${s.jsFiles || 88}</span>
          <span class="sm-stat-label">Platform JS Modules</span>
          <span class="sm-stat-sub">${s.cssFiles || 12} CSS stylesheets in css/</span>
        </div>
        <div class="sm-stat-card">
          <span class="sm-stat-num accent-amber">${s.gmModes || 22}</span>
          <span class="sm-stat-label">Game Maker Modes</span>
          <span class="sm-stat-sub">${s.gmSets || 75} built-in question sets</span>
        </div>
        <div class="sm-stat-card">
          <span class="sm-stat-num accent-emerald">${s.gamesDataEntries || 120}</span>
          <span class="sm-stat-label">Curriculum Modules</span>
          <span class="sm-stat-sub">${s.lessonPlans || 56} Word/PDF lesson plans</span>
        </div>
        <div class="sm-stat-card">
          <span class="sm-stat-num accent-coral">${s.supabaseTables || 15}</span>
          <span class="sm-stat-label">Supabase Tables</span>
          <span class="sm-stat-sub">${s.storageKeys || 25} localStorage keys</span>
        </div>
      </div>

      <!-- 1-Click Live Launch Deck -->
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🚀 1-Click Live Launch Deck</h2>
            <p class="sm-section-desc">Jump straight into any major world, hub, or classroom tool on this local server.</p>
          </div>
          <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('node tools/build-site-map.js')">🔄 Copy Refresh Command</button>
        </div>
        <div class="sm-arch-stage">
          ${quickDeck.map((d) => `
            <article class="sm-arch-node">
              <div>
                <div class="sm-node-top">
                  <div class="sm-node-icon">${d.icon}</div>
                  <div>
                    <h3 class="sm-node-title">${esc(d.title)}</h3>
                    <span class="sm-node-route">${esc(d.route.replace(/^\.\.\//, ''))}</span>
                  </div>
                </div>
                <p class="sm-node-desc" style="margin-top:10px;">${esc(d.desc)}</p>
              </div>
              <div class="sm-card-actions">
                <a href="${esc(d.route)}" class="btn-3d ${d.btn} sm-compact-btn">▶ Open Live</a>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(d.route.replace(/^\.\.\//, ''))}')">📋 Path</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- 7-Place Platform Architecture -->
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🧭 The 7-Place Platform Architecture (<span class="accent-cyan">js/platform-nav.js</span>)</h2>
            <p class="sm-section-desc">How the main school platform organizes every daily teaching screen without clutter.</p>
          </div>
          <button type="button" class="btn-3d btn-3d-violet sm-compact-btn" onclick="smInspectJs('js/platform-nav.js')">🔍 Inspect platform-nav.js</button>
        </div>
        <div class="sm-cards-grid">
          ${MAP.navigation.places.map((p) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${p.icon} ${esc(p.label)}</h3>
                <span class="sm-code-badge">#${esc(p.id)}</span>
              </div>
              <p class="sm-node-desc">${esc(p.desc)}</p>
              <div class="sm-meta-row">
                <span class="sm-badge badge-violet">${esc(p.controller)}</span>
              </div>
              <div class="sm-card-actions">
                <a href="../${esc(p.route)}" class="btn-3d btn-3d-cyan sm-compact-btn">▶ Open #${esc(p.id)}</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Where Do I Edit X? -->
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🎯 "Where Do I Edit X?" — Instant Developer &amp; AI Cheat-Sheet</h2>
            <p class="sm-section-desc">Click any JS file to open its full line-by-line chapter &amp; function map in the Inspector Drawer.</p>
          </div>
        </div>
        <div class="sm-cards-grid wide">
          ${MAP.quickTasks.map((t) => {
            const canInspect = MAP.jsModules.some((m) => m.path === t.file);
            return `
              <article class="sm-card">
                <h3 class="sm-card-title">${esc(t.task)}</h3>
                <div class="sm-meta-row">
                  <span class="sm-code-badge">${esc(t.file)} (${esc(t.lines)})</span>
                </div>
                <div class="sm-stat-sub">Symbol: <strong style="color:var(--amber);">${esc(t.symbol)}</strong></div>
                <div class="sm-card-actions">
                  <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(t.file)}')">📋 Copy Path</button>
                  ${canInspect ? `<button type="button" class="btn-3d btn-3d-violet sm-compact-btn" onclick="smInspectJs('${esc(t.file)}')">📑 Chapters &amp; Lines</button>` : ''}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Tab 2: Screens, Modals & All 88 JS Modules (including Giant Monoliths)
  // -------------------------------------------------------------------------
  function renderScreensTab() {
    const categories = ['All', ...new Set(MAP.jsModules.map((m) => m.category))];
    const filteredJs = state.jsCategory === 'All'
      ? [...MAP.jsModules].sort((a, b) => b.lines - a.lines)
      : MAP.jsModules.filter((m) => m.category === state.jsCategory).sort((a, b) => b.lines - a.lines);

    let subHtml = '';
    if (state.screensSub === 'js') {
      subHtml = `
        <div class="sm-filter-bar">
          ${categories.map((c) => `
            <button type="button" class="btn-3d sm-filter-pill ${state.jsCategory === c ? 'is-active' : ''}" onclick="smSetJsCat('${esc(c)}')">
              ${esc(c)}
            </button>
          `).join('')}
        </div>
        <div class="sm-cards-grid wide">
          ${filteredJs.map((m) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">📜 ${esc(m.filename)}</h3>
                <span class="sm-badge ${m.lines > 3000 ? 'badge-danger' : (m.lines > 800 ? 'badge-warn' : 'badge-mod')}">${m.lines}L · ${m.kb} KB</span>
              </div>
              <p class="sm-node-desc">${esc(m.summary)}</p>
              <div class="sm-meta-row">
                <span class="sm-badge badge-violet">${esc(m.category)}</span>
                ${m.loadedInIndex ? `<span class="sm-badge badge-live">index.html #${m.loadOrder} (?v=${esc(m.cacheVersion)})</span>` : '<span class="sm-badge badge-mod">Standalone</span>'}
              </div>
              <div class="sm-card-actions">
                <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('${esc(m.path)}')">📑 Open Line Map (${m.sections.length} ch / ${m.totalFunctions} fn)</button>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(m.path)}')">📋 Copy</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (state.screensSub === 'views') {
      subHtml = `
        <div class="sm-cards-grid">
          ${MAP.navigation.switchRoutes.map((r) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">🖥️ switchView('${esc(r.viewId)}')</h3>
                <span class="sm-code-badge">L${r.line}</span>
              </div>
              <div class="sm-stat-sub">Handler: <strong class="accent-cyan">${esc(r.handler)}</strong></div>
              <div class="sm-card-actions">
                <a href="../${esc(r.hashUrl)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Open #${esc(r.viewId)}</a>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('js/school-app.js:${r.line}')">📋 Line</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (state.screensSub === 'modals') {
      subHtml = `
        <div class="sm-cards-grid">
          ${MAP.indexHtml.modals.map((m) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${esc(m.title)}</h3>
                <span class="sm-code-badge">index.html:${m.line}</span>
              </div>
              <div class="sm-stat-sub">DOM ID: <code class="accent-amber">#${esc(m.id)}</code></div>
              <div class="sm-card-actions">
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('index.html:${m.line}')">📋 Copy index.html:${m.line}</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else {
      // Giant Monoliths Direct Chapter View
      const appMod = MAP.jsModules.find((m) => m.filename === 'school-app.js');
      const storeMod = MAP.jsModules.find((m) => m.filename === 'school-store.js');
      const renderMonolith = (mod) => !mod ? '' : `
        <div class="sm-card" style="margin-bottom:18px;">
          <div class="sm-card-header">
            <div>
              <h3 class="sm-section-title">🏛️ ${esc(mod.path)} (${mod.lines} lines · ${mod.kb} KB)</h3>
              <p class="sm-section-desc">${mod.sections.length} major section banners · ${mod.totalFunctions} functions</p>
            </div>
            <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('${esc(mod.path)}')">🔍 Full Function List</button>
          </div>
          <div class="sm-cards-grid wide" style="margin-top:8px;">
            ${mod.sections.map((s) => `
              <div class="sm-chapter-item">
                <div>
                  <div style="font-weight:800;font-size:0.88rem;">${esc(s.title)}</div>
                  <span class="sm-code-badge">L${s.line}–L${s.endLine}</span>
                </div>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(mod.path)}:${s.line}')">📋 L${s.line}</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      subHtml = renderMonolith(appMod) + renderMonolith(storeMod);
    }

    return `
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🖥️ Platform Views, Modals &amp; JavaScript Architecture</h2>
            <p class="sm-section-desc">Navigate the 17k-line monoliths, all ${MAP.jsModules.length} JS modules, ${MAP.navigation.switchRoutes.length} views, and ${MAP.indexHtml.modals.length} modals.</p>
          </div>
        </div>
        <div class="sm-filter-bar">
          <button type="button" class="btn-3d sm-filter-pill ${state.screensSub === 'places' ? 'is-active' : ''}" onclick="smSetScreensSub('places')">🏛️ Giant Monolith Chapters (school-app &amp; school-store)</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.screensSub === 'js' ? 'is-active' : ''}" onclick="smSetScreensSub('js')">📜 All ${MAP.jsModules.length} JS Modules</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.screensSub === 'views' ? 'is-active' : ''}" onclick="smSetScreensSub('views')">🧭 ${MAP.navigation.switchRoutes.length} switchView() Routes</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.screensSub === 'modals' ? 'is-active' : ''}" onclick="smSetScreensSub('modals')">🪟 ${MAP.indexHtml.modals.length} Modals in index.html</button>
        </div>
        ${subHtml}
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Tab 3: Avatars, Monster Studio & Unified Classroom Store
  // -------------------------------------------------------------------------
  function renderAvatarsTab() {
    const av = MAP.cloud.avatarAssets || {};
    const avatarMods = MAP.jsModules.filter((m) => m.category === 'Avatars, Monsters & Store');

    return `
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🎨 Pixar 3D Pupil Avatars &amp; Unified Store Pipeline</h2>
            <p class="sm-section-desc">Single-window store, live wearable try-on, 2D portrait compositor, and 3D WebGL stadium rig.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="../index.html#store-pupil" class="btn-3d btn-3d-emerald sm-compact-btn">🛍️ Open Unified Shop</a>
            <a href="../game-maker/index.html?game=penalty" class="btn-3d btn-3d-cyan sm-compact-btn">⚽ Preview 3D Pitch Avatars</a>
          </div>
        </div>

        <div class="sm-stats-grid">
          <div class="sm-stat-card">
            <span class="sm-stat-num accent-cyan">${av.studentPortraitCount || 0}</span>
            <span class="sm-stat-label">Anonymized Pupil Heads</span>
            <span class="sm-stat-sub">assets/avatars/student-*</span>
          </div>
          <div class="sm-stat-card">
            <span class="sm-stat-num accent-emerald">${av.wearAssetCount || 0}</span>
            <span class="sm-stat-label">3D Wearable Sprites</span>
            <span class="sm-stat-sub">assets/avatars/wear/*.webp</span>
          </div>
          <div class="sm-stat-card">
            <span class="sm-stat-num accent-amber">${av.bodyAssetCount || 0} + ${av.skinAssetCount || 0}</span>
            <span class="sm-stat-label">3D Poses + Skin Tones</span>
            <span class="sm-stat-sub">stand, wave, cheer, jump + neck/hands</span>
          </div>
          <div class="sm-stat-card">
            <span class="sm-stat-num accent-coral">${av.redactedUntrackedCount || 0}</span>
            <span class="sm-stat-label">Privacy-Redacted Local Files</span>
            <span class="sm-stat-sub">Protected by AGENTS.md §8</span>
          </div>
        </div>

        <div class="sm-cards-grid wide">
          ${avatarMods.map((m) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">✨ ${esc(m.filename)}</h3>
                <span class="sm-badge badge-violet">${m.lines}L · ${m.kb} KB</span>
              </div>
              <p class="sm-node-desc">${esc(m.summary)}</p>
              <div class="sm-card-actions">
                <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('${esc(m.path)}')">📑 Inspect Functions</button>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(m.path)}')">📋 Copy Path</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🐉 Monster Companion 8-Layer Composite Stage (<span class="accent-amber">.monster-composite-stage</span>)</h2>
            <p class="sm-section-desc">Strict Z-index layer contract enforced across Monster Studio &amp; Roster cards (top layer first).</p>
          </div>
          <a href="../monster-studio/index.html" class="btn-3d btn-3d-violet sm-compact-btn">🐉 Open Monster Studio</a>
        </div>
        <div class="sm-layer-stack">
          ${[...MAP.cloud.monsterLayers].reverse().map((l) => `
            <div class="sm-layer-bar">
              <span class="sm-badge badge-mod">z-index: ${l.z}</span>
              <span class="sm-code-badge">${esc(l.id)}</span>
              <span style="font-size:0.88rem;color:var(--text-soft);">${esc(l.purpose)}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Tab 4: Game Maker 2.0 (All 22 Modes + 75 Question Sets)
  // -------------------------------------------------------------------------
  function renderGameMakerTab() {
    return `
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🎮 Game Maker 2.0 — ${MAP.gameMaker.modes.length} Arcade Modes &amp; ${MAP.gameMaker.sets.length} Question Banks</h2>
            <p class="sm-section-desc">Launch any mode directly in the browser or copy its exact source file &amp; line number.</p>
          </div>
          <a href="../game-maker/index.html" class="btn-3d btn-3d-amber sm-compact-btn">🎮 Open Game Maker Hub</a>
        </div>

        <div class="sm-filter-bar">
          <button type="button" class="btn-3d sm-filter-pill ${state.gmSub === 'modes' ? 'is-active' : ''}" onclick="smSetGmSub('modes')">🕹️ ${MAP.gameMaker.modes.length} Playable Modes</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gmSub === 'sets' ? 'is-active' : ''}" onclick="smSetGmSub('sets')">📚 ${MAP.gameMaker.sets.length} Question &amp; Speaking Sets</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gmSub === 'engine' ? 'is-active' : ''}" onclick="smSetGmSub('engine')">⚙️ ${MAP.gameMaker.engineFiles.length} Engine &amp; Mode Files</button>
        </div>

        ${state.gmSub === 'modes' ? `
          <div class="sm-cards-grid wide">
            ${MAP.gameMaker.modes.map((m) => `
              <article class="sm-card">
                <div class="sm-card-header">
                  <h3 class="sm-card-title">${m.emoji} ${esc(m.name)}</h3>
                  <span class="sm-badge ${m.is3D ? 'badge-live' : 'badge-violet'}">${m.is3D ? 'Three.js 3D' : `GM.modes.${esc(m.id)}`}</span>
                </div>
                <p class="sm-node-desc">${esc(m.desc)}</p>
                <div class="sm-meta-row">
                  <span class="sm-code-badge">${esc(m.file)}:${m.line} (${m.lines}L)</span>
                </div>
                <div class="sm-card-actions">
                  <a href="../${esc(m.launchUrl)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Launch ${esc(m.name)}</a>
                  <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(m.file)}:${m.line}')">📋 File:Line</button>
                </div>
              </article>
            `).join('')}
          </div>
        ` : state.gmSub === 'sets' ? `
          <div class="sm-cards-grid">
            ${MAP.gameMaker.sets.map((s) => `
              <article class="sm-card">
                <div class="sm-card-header">
                  <h3 class="sm-card-title">${esc(s.title)}</h3>
                  <span class="sm-badge badge-mod">${s.count} Qs</span>
                </div>
                <div class="sm-meta-row">
                  <span class="sm-code-badge">set: ${esc(s.id)}</span>
                  <span class="sm-badge badge-violet">Grade: ${esc(s.grade)}</span>
                </div>
                <div class="sm-card-actions">
                  <a href="../game-maker/index.html?set=${encodeURIComponent(s.id)}" class="btn-3d btn-3d-cyan sm-compact-btn">▶ Open with Set</a>
                </div>
              </article>
            `).join('')}
          </div>
        ` : `
          <div class="sm-cards-grid">
            ${MAP.gameMaker.engineFiles.map((f) => `
              <article class="sm-card">
                <div class="sm-card-header">
                  <h3 class="sm-card-title">📄 ${esc(f.filename)}</h3>
                  <span class="sm-badge badge-mod">${f.lines}L · ${f.kb} KB</span>
                </div>
                <div class="sm-meta-row">
                  <span class="sm-code-badge">${esc(f.path)}</span>
                  ${f.version ? `<span class="sm-badge badge-live">?v=${esc(f.version)}</span>` : ''}
                </div>
                <div class="sm-card-actions">
                  <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(f.path)}')">📋 Copy Path</button>
                </div>
              </article>
            `).join('')}
          </div>
        `}
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Tab 5: Lessons, Practice Island, Passport & Lesson Plans
  // -------------------------------------------------------------------------
  function renderCurriculumTab() {
    let bodyHtml = '';
    if (state.currFilter === 'plans') {
      bodyHtml = `
        <div class="sm-cards-grid wide">
          ${MAP.curriculum.lessonPlans.map((p) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">📋 ${esc(p.stem)}</h3>
                <span class="sm-badge badge-violet">${esc(p.grade)}</span>
              </div>
              <div class="sm-card-actions">
                ${p.pdf ? `<a href="../${esc(p.pdf)}" target="_blank" class="btn-3d btn-3d-amber sm-compact-btn">📄 Open PDF</a>` : ''}
                ${p.docx ? `<a href="../${esc(p.docx)}" class="btn-3d btn-3d-cyan sm-compact-btn">📝 Download Word (.docx)</a>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (state.currFilter === 'timetable') {
      bodyHtml = `
        <div class="sm-cards-grid wide">
          ${MAP.curriculum.timetableCatalog.map((c) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${c.icon} ${esc(c.title)}</h3>
                <span class="sm-badge badge-live">${esc(c.grade)}</span>
              </div>
              <div class="sm-meta-row">
                <span class="sm-code-badge">${esc(c.route)}</span>
                ${c.added ? `<span class="sm-badge badge-mod">Added ${esc(c.added)}</span>` : ''}
              </div>
              <div class="sm-card-actions">
                <a href="../${esc(c.route)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Launch Lesson</a>
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(c.route)}')">📋 Copy Route</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else {
      const list = MAP.curriculum.gamesData.filter((g) => {
        if (state.currFilter === 'g3') return /3/.test(String(g.grade));
        if (state.currFilter === 'g4') return /4/.test(String(g.grade));
        if (state.currFilter === 'local') return g.existsLocally;
        return true;
      });
      bodyHtml = `
        <div class="sm-cards-grid wide">
          ${list.map((g) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${g.icon} ${esc(g.title)}</h3>
                <span class="sm-badge ${g.existsLocally ? 'badge-live' : 'badge-warn'}">${g.existsLocally ? 'Local Ready' : 'Published Only'}</span>
              </div>
              <div class="sm-meta-row">
                <span class="sm-badge badge-violet">${esc(g.grade)}</span>
                ${g.category ? `<span class="sm-badge badge-mod">${esc(g.category)}</span>` : ''}
                ${g.in404 ? '<span class="sm-badge badge-live">404 Routed</span>' : ''}
              </div>
              <span class="sm-code-badge">${esc(g.url || g.id)}</span>
              <div class="sm-card-actions">
                ${g.existsLocally && g.url ? `<a href="../${esc(g.url)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Play Lesson</a>` : ''}
                ${g.existsLocally && g.worksheetUrl ? `<a href="../${esc(g.worksheetUrl)}" class="btn-3d btn-3d-amber sm-compact-btn">🖨️ Worksheet</a>` : ''}
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(g.url || g.id)}')">📋 Copy</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    return `
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">📚 Curriculum Lessons, Timetable Catalog &amp; Printable Lesson Plans</h2>
            <p class="sm-section-desc">Cross-referenced across GAMES_DATA, Timetable, 404.html, and /lesson-plans.</p>
          </div>
        </div>
        <div class="sm-filter-bar">
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'all' ? 'is-active' : ''}" onclick="smSetCurrFilter('all')">All GAMES_DATA (${MAP.curriculum.gamesData.length})</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'local' ? 'is-active' : ''}" onclick="smSetCurrFilter('local')">✅ On Local Disk (${MAP.curriculum.gamesData.filter((x) => x.existsLocally).length})</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'g3' ? 'is-active' : ''}" onclick="smSetCurrFilter('g3')">Grade 3</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'g4' ? 'is-active' : ''}" onclick="smSetCurrFilter('g4')">Grade 4</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'timetable' ? 'is-active' : ''}" onclick="smSetCurrFilter('timetable')">📅 Timetable Catalog (${MAP.curriculum.timetableCatalog.length})</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.currFilter === 'plans' ? 'is-active' : ''}" onclick="smSetCurrFilter('plans')">📋 Word &amp; PDF Lesson Plans (${MAP.curriculum.lessonPlans.length})</button>
        </div>
        ${bodyHtml}
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Tab 6: Cloud Database, Storage Keys, Privacy & 180-Folder Git Safety Audit
  // -------------------------------------------------------------------------
  function renderCloudTab() {
    const inv = MAP.curriculum.rootInventory.filter((r) => {
      if (state.gitFilter === 'ALL') return true;
      return r.safetyTag.includes(state.gitFilter);
    });

    return `
      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">☁️ Supabase PostgreSQL Tables, Storage Keys &amp; Privacy Vault</h2>
            <p class="sm-section-desc">Real pupil names live ONLY in Supabase. Survey answers, parent notes &amp; birthdays are AES-256-GCM encrypted in js/private-data.js.</p>
          </div>
          <button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('js/supabase-client.js')">🔍 Inspect supabase-client.js</button>
        </div>

        <div class="sm-cards-grid">
          <article class="sm-card">
            <h3 class="sm-card-title">🗄️ Supabase Tables (${MAP.cloud.supabaseTables.length})</h3>
            <div class="sm-meta-row">
              ${MAP.cloud.supabaseTables.map((t) => `<span class="sm-code-badge" title="${esc(t.files.join(', '))}">${esc(t.name)}</span>`).join('')}
            </div>
          </article>

          <article class="sm-card">
            <h3 class="sm-card-title">🔑 Browser Storage Keys (${MAP.cloud.storageKeys.length})</h3>
            <div class="sm-meta-row">
              ${MAP.cloud.storageKeys.map((k) => `<span class="sm-code-badge" title="${esc(k.files.join(', '))}">${esc(k.key)}</span>`).join('')}
            </div>
          </article>

          <article class="sm-card">
            <h3 class="sm-card-title">📡 Custom DOM Events &amp; SQL Schemas</h3>
            <div class="sm-meta-row">
              ${MAP.cloud.customEvents.map((e) => `<span class="sm-badge badge-violet">${esc(e.event)}</span>`).join('')}
              ${MAP.cloud.sqlFiles.map((s) => `<span class="sm-code-badge">${esc(s.path)}</span>`).join('')}
            </div>
          </article>
        </div>
      </section>

      <section class="sm-glass-panel">
        <div class="sm-section-head">
          <div>
            <h2 class="sm-section-title">🛡️ Full Root Folder &amp; Git Safety Classification (${MAP.curriculum.rootInventory.length} entries)</h2>
            <p class="sm-section-desc">Read-only safety audit explaining why <code>git add -A</code> must NEVER be used (${MAP.git.deletedTopFolders.length} published folders absent locally; ${MAP.git.untrackedRedactedAvatarCount} pupil avatar files privacy-guarded).</p>
          </div>
        </div>

        <div class="sm-filter-bar">
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'ALL' ? 'is-active' : ''}" onclick="smSetGitFilter('ALL')">All (${MAP.curriculum.rootInventory.length})</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'MODIFIED' ? 'is-active' : ''}" onclick="smSetGitFilter('MODIFIED')">⚡ Modified / Unpushed</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'NEW' ? 'is-active' : ''}" onclick="smSetGitFilter('NEW')">✨ New / Untracked</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'LOCAL-ONLY' ? 'is-active' : ''}" onclick="smSetGitFilter('LOCAL-ONLY')">🚫 Local-Only (Never Push)</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'PRIVACY' ? 'is-active' : ''}" onclick="smSetGitFilter('PRIVACY')">🔒 Privacy Guard</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'MISSING' ? 'is-active' : ''}" onclick="smSetGitFilter('MISSING')">⚠️ Missing Locally (Git Deleted)</button>
          <button type="button" class="btn-3d sm-filter-pill ${state.gitFilter === 'LIVE' ? 'is-active' : ''}" onclick="smSetGitFilter('LIVE')">✅ Live &amp; Clean</button>
        </div>

        <div class="sm-cards-grid wide">
          ${inv.map((r) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${r.isDir ? '📁' : '📄'} ${esc(r.name)}${r.isDir ? '/' : ''}</h3>
                <span class="sm-badge ${safetyBadgeClass(r.safetyTag)}">${esc(r.safetyTag)}</span>
              </div>
              <p class="sm-node-desc">${esc(r.safetyNote)}</p>
              <div class="sm-meta-row">
                <span class="sm-badge badge-violet">${esc(r.kind)}</span>
                ${r.inGamesData ? '<span class="sm-badge badge-live">In GAMES_DATA</span>' : ''}
                ${r.inTimetable ? '<span class="sm-badge badge-mod">In Timetable</span>' : ''}
                ${r.in404 ? '<span class="sm-badge badge-live">404 Routed</span>' : ''}
              </div>
              <div class="sm-card-actions">
                ${r.exists && r.playUrl ? `<a href="../${esc(r.playUrl)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Open</a>` : ''}
                <button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(r.name)}')">📋 Copy Name</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  // -------------------------------------------------------------------------
  // Global Instant Search Across Everything
  // -------------------------------------------------------------------------
  function runGlobalSearch(rawQuery) {
    const panel = document.getElementById('sm-search-results-panel');
    const clearBtn = document.getElementById('sm-search-clear');
    const q = String(rawQuery || '').trim().toLowerCase();

    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
    if (!q) {
      panel.style.display = 'none';
      panel.innerHTML = '';
      return;
    }

    const hits = [];

    // 1. Quick Tasks
    MAP.quickTasks.forEach((t) => {
      if (`${t.task} ${t.file} ${t.symbol}`.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Task Cheat-Sheet',
          cls: 'badge-warn',
          title: t.task,
          code: `${t.file} (${t.lines})`,
          sub: t.symbol,
          copy: t.file,
          inspectJs: MAP.jsModules.some((m) => m.path === t.file) ? t.file : ''
        });
      }
    });

    // 2. Views & Modals
    MAP.navigation.switchRoutes.forEach((r) => {
      if (`${r.viewId} ${r.handler}`.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Platform View',
          cls: 'badge-live',
          title: `switchView('${r.viewId}')`,
          code: `js/school-app.js:${r.line}`,
          sub: r.handler,
          url: `../${r.hashUrl}`,
          copy: `js/school-app.js:${r.line}`
        });
      }
    });

    MAP.indexHtml.modals.forEach((m) => {
      if (`${m.id} ${m.title}`.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Modal in index.html',
          cls: 'badge-violet',
          title: m.title,
          code: `#${m.id} (index.html:${m.line})`,
          sub: 'Modal Dialog',
          copy: `index.html:${m.line}`
        });
      }
    });

    // 3. JS Modules, Sections & Functions
    MAP.jsModules.forEach((m) => {
      if (`${m.path} ${m.summary} ${m.exports.join(' ')}`.toLowerCase().includes(q)) {
        hits.push({
          badge: 'JS Module',
          cls: 'badge-mod',
          title: m.path,
          code: `${m.lines} lines · ${m.kb} KB`,
          sub: m.summary,
          copy: m.path,
          inspectJs: m.path
        });
      }
      m.sections.forEach((s) => {
        if (s.title.toLowerCase().includes(q)) {
          hits.push({
            badge: 'Monolith Chapter',
            cls: 'badge-warn',
            title: s.title,
            code: `${m.path}:${s.line}–${s.endLine}`,
            sub: m.filename,
            copy: `${m.path}:${s.line}`,
            inspectJs: m.path
          });
        }
      });
      m.keyFunctions.forEach((fn) => {
        if (fn.name.toLowerCase().includes(q)) {
          hits.push({
            badge: 'JS Function',
            cls: 'badge-mod',
            title: fn.name,
            code: `${m.path}:${fn.line}`,
            sub: m.category,
            copy: `${m.path}:${fn.line}`,
            inspectJs: m.path
          });
        }
      });
    });

    // 4. Game Maker Modes & Sets
    MAP.gameMaker.modes.forEach((m) => {
      if (`${m.id} ${m.name} ${m.desc}`.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Game Maker Mode',
          cls: 'badge-live',
          title: `${m.emoji} ${m.name}`,
          code: `${m.file}:${m.line}`,
          sub: m.desc,
          url: `../${m.launchUrl}`,
          copy: `${m.file}:${m.line}`
        });
      }
    });

    // 5. Curriculum Lessons & Lesson Plans
    MAP.curriculum.gamesData.forEach((g) => {
      if (`${g.id} ${g.title} ${g.url} ${g.grade}`.toLowerCase().includes(q)) {
        hits.push({
          badge: `Curriculum (${g.grade})`,
          cls: g.existsLocally ? 'badge-live' : 'badge-warn',
          title: `${g.icon} ${g.title}`,
          code: g.url || g.id,
          sub: g.existsLocally ? 'Available locally' : 'Published on GitHub Pages (deleted locally)',
          url: g.existsLocally && g.url ? `../${g.url}` : '',
          copy: g.url || g.id
        });
      }
    });

    MAP.curriculum.lessonPlans.forEach((p) => {
      if (p.stem.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Lesson Plan',
          cls: 'badge-violet',
          title: `📋 ${p.stem}`,
          code: p.pdf || p.docx || 'lesson-plans/',
          sub: p.grade,
          url: p.pdf ? `../${p.pdf}` : (p.docx ? `../${p.docx}` : ''),
          copy: p.pdf || p.docx || ''
        });
      }
    });

    // 6. Supabase Tables & Storage Keys
    MAP.cloud.supabaseTables.forEach((t) => {
      if (t.name.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Supabase Table',
          cls: 'badge-danger',
          title: `Table: ${t.name}`,
          code: t.files.join(', '),
          sub: 'PostgreSQL Cloud Table',
          copy: t.name
        });
      }
    });

    MAP.cloud.storageKeys.forEach((k) => {
      if (k.key.toLowerCase().includes(q)) {
        hits.push({
          badge: 'Storage Key',
          cls: 'badge-mod',
          title: k.key,
          code: k.files.join(', '),
          sub: 'localStorage / sessionStorage',
          copy: k.key
        });
      }
    });

    const topHits = hits.slice(0, 48);
    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="sm-section-head">
        <div>
          <h2 class="sm-section-title">🔍 Search Results for "${esc(rawQuery)}" (${hits.length} matches)</h2>
          <p class="sm-section-desc">${hits.length > 48 ? 'Showing top 48 matches — refine your search for more specific hits.' : 'Instant cross-platform index.'}</p>
        </div>
      </div>
      ${topHits.length === 0 ? '<p class="sm-section-desc">No matching files, functions, modes, or lessons found.</p>' : `
        <div class="sm-cards-grid wide">
          ${topHits.map((h) => `
            <article class="sm-card">
              <div class="sm-card-header">
                <h3 class="sm-card-title">${esc(h.title)}</h3>
                <span class="sm-badge ${h.cls}">${esc(h.badge)}</span>
              </div>
              <span class="sm-code-badge">${esc(h.code)}</span>
              <p class="sm-node-desc">${esc(h.sub)}</p>
              <div class="sm-card-actions">
                ${h.url ? `<a href="${esc(h.url)}" class="btn-3d btn-3d-emerald sm-compact-btn">▶ Open</a>` : ''}
                ${h.inspectJs ? `<button type="button" class="btn-3d btn-3d-cyan sm-compact-btn" onclick="smInspectJs('${esc(h.inspectJs)}')">📑 Inspect</button>` : ''}
                ${h.copy ? `<button type="button" class="btn-3d btn-3d-slate sm-compact-btn" onclick="smCopyPath('${esc(h.copy)}')">📋 Copy</button>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      `}
    `;
  }

  // -------------------------------------------------------------------------
  // State Transitions & Init
  // -------------------------------------------------------------------------
  function renderActiveTab(autoFitGraph = false) {
    const vp = document.getElementById('sm-tab-viewport');
    if (!vp) return;
    switch (state.activeTab) {
      case 'graph':
        vp.innerHTML = renderGraphTab();
        bindGraphInteractions();
        if (autoFitGraph) requestAnimationFrame(fitGraphToViewport);
        break;
      case 'screens': vp.innerHTML = renderScreensTab(); break;
      case 'avatars': vp.innerHTML = renderAvatarsTab(); break;
      case 'gamemaker': vp.innerHTML = renderGameMakerTab(); break;
      case 'curriculum': vp.innerHTML = renderCurriculumTab(); break;
      case 'cloud': vp.innerHTML = renderCloudTab(); break;
      default: vp.innerHTML = renderOverviewTab(); break;
    }

    document.querySelectorAll('.sm-tab-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === state.activeTab);
    });
  }

  window.smSetScreensSub = function (sub) { playTap(); state.screensSub = sub; renderActiveTab(); };
  window.smSetJsCat = function (cat) { playTap(); state.jsCategory = cat; renderActiveTab(); };
  window.smSetGmSub = function (sub) { playTap(); state.gmSub = sub; renderActiveTab(); };
  window.smSetCurrFilter = function (f) { playTap(); state.currFilter = f; renderActiveTab(); };
  window.smSetGitFilter = function (f) { playTap(); state.gitFilter = f; renderActiveTab(); };

  function init() {
    // Populate header counts & timestamp
    const s = MAP.summary || {};
    const cntGm = document.getElementById('cnt-gm');
    const cntLessons = document.getElementById('cnt-lessons');
    const cntFolders = document.getElementById('cnt-folders');
    const meta = document.getElementById('sm-generated-meta');

    if (cntGm) cntGm.textContent = String(s.gmModes || 22);
    if (cntLessons) cntLessons.textContent = String(s.gamesDataEntries || 120);
    if (cntFolders) cntFolders.textContent = String(s.rootEntries || 180);
    if (meta && MAP.generatedAt) {
      const dt = new Date(MAP.generatedAt);
      meta.textContent = `Auto-mapped ${s.jsFiles || 88} JS files · ${s.gmModes || 22} Game Modes · ${s.gamesDataEntries || 120} Lessons (${isNaN(dt) ? MAP.generatedAt : dt.toLocaleString()})`;
    }

    // Tabs rail click
    document.querySelectorAll('.sm-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        playTap();
        const nextTab = btn.dataset.tab || 'graph';
        const enteringGraph = nextTab === 'graph' && state.activeTab !== 'graph';
        state.activeTab = nextTab;
        renderActiveTab(enteringGraph);
      });
    });

    // Search input & '/' shortcut
    const searchInput = document.getElementById('sm-global-search');
    const clearBtn = document.getElementById('sm-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => runGlobalSearch(e.target.value));
    }
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        playTap();
        searchInput.value = '';
        runGlobalSearch('');
        searchInput.focus();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      } else if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Sound toggle
    const soundBtn = document.getElementById('sm-sound-toggle');
    const soundIcon = document.getElementById('sm-sound-icon');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundOn = !state.soundOn;
        if (soundIcon) soundIcon.textContent = state.soundOn ? '🔊' : '🔇';
        if (state.soundOn) playSuccess();
      });
    }

    // Drawer close
    const closeBtn = document.getElementById('sm-drawer-close');
    const backdrop = document.getElementById('sm-drawer-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => { playTap(); closeDrawer(); });
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeDrawer();
      });
    }

    window.addEventListener('resize', () => {
      if (state.activeTab === 'graph') fitGraphToViewport();
    });

    renderActiveTab(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
