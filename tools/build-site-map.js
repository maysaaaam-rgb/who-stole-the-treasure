#!/usr/bin/env node
/**
 * ENGLISH ADVENTURE ACADEMY — AUTOMATED SITE MAP GENERATOR
 * Path: tools/build-site-map.js
 *
 * Usage:
 *   node tools/build-site-map.js
 *
 * Generates & synchronizes:
 *   1. SITE_MAP.md (Master AI & Teacher Quick-Jump Index)
 *   2. docs/map/01-platform-screens-and-dom.md
 *   3. docs/map/02-core-js-and-monoliths.md
 *   4. docs/map/03-avatars-monsters-and-store.md
 *   5. docs/map/04-game-maker.md
 *   6. docs/map/05-lessons-island-and-curriculum.md
 *   7. docs/map/06-cloud-storage-and-privacy.md
 *   8. site-map/data.js (Structured JSON bundle for the Interactive Visual Site Map UI)
 *
 * Also mirrors all generated files + site-map UI files to:
 *   monster day/story/mouse/pokemon/firefighter/NH/
 *
 * STRICT PRIVACY INVARIANT (AGENTS.md §8):
 *   Never writes real pupil names or non-anonymized pupil filenames into any output file.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MIRROR = path.join(ROOT, 'monster day', 'story', 'mouse', 'pokemon', 'firefighter', 'NH');

// Safe filename allowlist inside assets/avatars/ (AGENTS.md §8)
const SAFE_AVATAR_NAME_RE = /^(?:student-\d[a-z]-\d+|head_demo|body_|skin_|wear$|ceremony$|thumbs$|manifest|README|\.gitkeep)/i;

// Local-only / never-push root directories & files (AGENTS.md §2.1 & claude-memory)
const LOCAL_ONLY_NAMES = new Set([
  '_tmp',
  'monster day',
  'unit3-work',
  'src',
  'week4-work',
  'monster-work',
  'platform-work',
  'lingo-work',
  'build',
  'node_modules',
  '.agent',
  '.claude',
  '.git',
  '.github',
  '.vscode'
]);

const LOCAL_ONLY_PATTERNS = [
  /-work$/i,
  /^_tmp/i,
  /\.zip$/i,
  /\.psd$/i,
  /\.blend$/i,
  /^tmp[_-]/i
];

function isLocalOnlyRootName(name) {
  if (LOCAL_ONLY_NAMES.has(name)) return true;
  return LOCAL_ONLY_PATTERNS.some((re) => re.test(name));
}

function toPosix(p) {
  return String(p || '').replace(/\\/g, '/');
}

function readText(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function fileStats(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return { exists: false, bytes: 0, lines: 0 };
  const stat = fs.statSync(full);
  if (!stat.isFile()) return { exists: true, isDir: true, bytes: 0, lines: 0 };
  const txt = fs.readFileSync(full, 'utf8');
  return {
    exists: true,
    bytes: stat.size,
    kb: +(stat.size / 1024).toFixed(1),
    lines: txt.split(/\r?\n/).length
  };
}

function collectPrivateAvatarTokens() {
  const tokens = new Set();
  const avDir = path.join(ROOT, 'assets', 'avatars');
  if (!fs.existsSync(avDir)) return tokens;
  for (const entry of fs.readdirSync(avDir)) {
    if (!SAFE_AVATAR_NAME_RE.test(entry)) {
      const stem = entry.replace(/\.[a-z0-9]+$/i, '').split(/[-_]/)[0];
      if (stem && stem.length >= 3 && !/^(?:student|pupil|head|body|skin|wear|avatar|boy|girl|kid|demo)$/i.test(stem)) {
        tokens.add(stem.toLowerCase());
      }
    }
  }
  return tokens;
}

const PRIVATE_TOKENS = collectPrivateAvatarTokens();

function redactSensitivePath(p) {
  const norm = toPosix(p);
  if (/^assets\/avatars\//i.test(norm)) {
    const parts = norm.split('/');
    const leaf = parts[parts.length - 1];
    if (parts.length === 3 && !SAFE_AVATAR_NAME_RE.test(leaf)) {
      return 'assets/avatars/<redacted-pupil-file>.webp';
    }
  }
  return norm;
}

// ---------------------------------------------------------------------------
// 1. Git Working Tree Status (Read-Only)
// ---------------------------------------------------------------------------
function scanGitStatus() {
  let raw = '';
  try {
    raw = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    raw = '';
  }

  const modifiedFiles = [];
  const untrackedSafe = [];
  let untrackedRedactedAvatarCount = 0;
  const deletedTopFolders = new Map();
  const deletedOtherFiles = [];

  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.length < 4) continue;
    const xy = line.slice(0, 2);
    let file = line.slice(3).trim().replace(/^"|"$/g, '');
    if (file.includes(' -> ')) file = file.split(' -> ').pop().trim();
    const posix = toPosix(file);

    if (/^assets\/avatars\/[^/]+$/i.test(posix)) {
      const leaf = posix.split('/').pop();
      if (!SAFE_AVATAR_NAME_RE.test(leaf)) {
        untrackedRedactedAvatarCount++;
        continue;
      }
    }

    if (xy === '??') {
      untrackedSafe.push(posix);
    } else if (xy.includes('D')) {
      const top = posix.split('/')[0];
      if (posix.includes('/')) {
        deletedTopFolders.set(top, (deletedTopFolders.get(top) || 0) + 1);
      } else {
        deletedOtherFiles.push(posix);
      }
    } else {
      modifiedFiles.push({ status: xy.trim(), path: posix });
    }
  }

  return {
    modifiedFiles,
    untrackedSafe,
    untrackedRedactedAvatarCount,
    deletedTopFolders: [...deletedTopFolders.entries()]
      .map(([folder, count]) => ({ folder, count, existsLocally: fs.existsSync(path.join(ROOT, folder)) }))
      .sort((a, b) => a.folder.localeCompare(b.folder)),
    deletedOtherFiles
  };
}

// ---------------------------------------------------------------------------
// 2. Parse index.html & Other HTML Entry Points
// ---------------------------------------------------------------------------
function parseIndexHtml() {
  const txt = readText('index.html');
  const lines = txt.split(/\r?\n/);

  const cssLinks = [];
  const scripts = [];
  const modals = [];
  const toolTabs = [];
  const topSections = [];

  lines.forEach((line, idx) => {
    const ln = idx + 1;
    const cssMatch = line.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i) ||
                     line.match(/<link[^>]*href=["']([^"']+\.css[^"']*)["']/i);
    if (cssMatch && !cssMatch[1].startsWith('http')) {
      const [file, ver] = cssMatch[1].split('?v=');
      cssLinks.push({ line: ln, href: cssMatch[1], file, version: ver || '' });
    }

    const scrMatch = line.match(/<script[^>]*src=["']([^"']+)["']/i);
    if (scrMatch) {
      const [file, ver] = scrMatch[1].split('?v=');
      scripts.push({ line: ln, src: scrMatch[1], file, version: ver || '' });
    }

    const secBanner = line.match(/^\s*<!--\s*(\d+\.\s+[A-Z0-9 &/()_-]+)/);
    if (secBanner) {
      topSections.push({ line: ln, title: secBanner[1].trim() });
    }

    const modalMatch = line.match(/class=["'][^"']*(?:modal-overlay|edit-xp-modal-overlay)[^"']*["'][^>]*id=["']([^"']+)["']|id=["']((?:modal-|edit-student-xp-modal)[^"']*)["'][^>]*class=["'][^"']*modal/i);
    if (modalMatch) {
      const id = modalMatch[1] || modalMatch[2];
      // Look ahead up to 25 lines for a heading title
      let title = '';
      for (let k = idx; k < Math.min(lines.length, idx + 28); k++) {
        const hm = lines[k].match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
        if (hm) {
          title = hm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          if (title) break;
        }
      }
      modals.push({ id, line: ln, title: title || id });
    }

    const toolMatch = line.match(/id=["'](tab-tool-[a-z0-9-]+)["'][^>]*onclick=["']([^"']+)["'][^>]*>([^<]+)</i);
    if (toolMatch) {
      toolTabs.push({ id: toolMatch[1], line: ln, action: toolMatch[2], label: toolMatch[3].trim() });
    }
  });

  return {
    stats: fileStats('index.html'),
    cssLinks,
    scripts,
    modals,
    toolTabs,
    topSections
  };
}

// ---------------------------------------------------------------------------
// 3. Parse Navigation Places & switchView Routes
// ---------------------------------------------------------------------------
function parsePlatformNavigation() {
  const places = [
    { id: 'today', icon: '▶️', label: 'Today', route: 'index.html#today', controller: 'js/platform-nav.js + js/timetable.js', desc: 'Daily class schedule ribbon, active class hero card, 1-tap launch for today\'s lesson, Game Maker, and k12 checklist.' },
    { id: 'board', icon: '📺', label: 'Class Board', route: 'index.html#board', controller: 'js/class-board.js + js/board-scenes.js', desc: 'Projector classroom scoreboard, pupil avatar cards, +XP awards, Groups, Picker, Karaoke, Bathroom Pass & Sleepy Mio.' },
    { id: 'shop', icon: '🛍️', label: 'Unified Shop & Studio', route: 'index.html#store-pupil', controller: 'js/classroom-store.js + js/pupil-avatars.js', desc: 'Single-window Pupil Avatar Customizer, live try-on, wearable shop, Mystery Boxes & real classroom prizes.' },
    { id: 'library', icon: '📖', label: 'Library', route: 'index.html#library', controller: 'js/library-shelf.js + js/school-app.js', desc: 'Curated Grade 3 & Grade 4 lessons, Game Maker 2.0 launcher, printable worksheets, and Word/PDF lesson plans.' },
    { id: 'tools', icon: '🪄', label: 'Board & Book', route: 'index.html#tools', controller: 'js/platform-nav.js + smart-board/ + magic-book/', desc: '1-tap launcher for AI Smart Board, Magic Book (Grade 3/4), Timer, Random Picker, Group Maker, Karaoke & Voice FX.' },
    { id: 'calendar', icon: '📅', label: 'Plan (Calendar & Timetable)', route: 'index.html#calendar', controller: 'js/calendar-view.js + js/timetable.js', desc: 'Weekly teaching timetable editor, monthly academic calendar, unit pacing & event planner.' },
    { id: 'more', icon: '⚙️', label: 'More & Teacher Hub', route: 'index.html#more', controller: 'js/command-center.js + js/school-app.js', desc: 'Teacher Hub (Command Center), Store Settings, Practice Island, Lesson Archive, School Settings, Restore & Daily Backups.' }
  ];

  const appTxt = readText('js/school-app.js');
  const appLines = appTxt.split(/\r?\n/);
  const switchRoutes = [];
  let inRenderCurrent = false;

  for (let i = 0; i < appLines.length; i++) {
    const line = appLines[i];
    if (/function renderCurrentView\s*\(/.test(line)) inRenderCurrent = true;
    if (inRenderCurrent) {
      const m = line.match(/^\s*case\s+['"]([^'"]+)['"]\s*:\s*(.*)$/);
      if (m) {
        const viewId = m[1];
        const body = m[2].trim();
        const fnMatch = body.match(/(render[A-Za-z0-9_]+)\s*\(/);
        const handler = fnMatch ? fnMatch[1] : (appLines[i + 1] || '').trim().slice(0, 60);
        switchRoutes.push({ viewId, line: i + 1, handler, hashUrl: `index.html#${viewId}` });
      }
      if (i > 10115 && /^\s*\}\s*$/.test(line) && switchRoutes.length > 25) {
        inRenderCurrent = false;
      }
    }
  }

  return { places, switchRoutes };
}

// ---------------------------------------------------------------------------
// 4. Deep Scan All js/*.js and css/*.css Files + Monolith Landmarks
// ---------------------------------------------------------------------------
function classifyJsCategory(filename) {
  if (/^(?:school-app|school-store|platform-nav|ui|command-center|daily-report|daily-backup)\.js$/.test(filename)) return 'Core Platform & State';
  if (/^(?:pupil-avatars|pupil-card|pupil-profile|classroom-store|classroom-cosmetics|monster-|mystery-box|evolution-levels|no-monsters|sleepy-monster)/.test(filename)) return 'Avatars, Monsters & Store';
  if (/^(?:class-board|class-mode|class-view|class-rewards|class-journey|board-scenes|classroom-sounds|voice-fx|bathroom-pass|simon-says|birthday)/.test(filename)) return 'Live Classroom & Smartboard';
  if (/^(?:games-data|library|timetable|calendar-view|unit2-content|revision-board|homework-data|island-|theme-badges|retired-themes)/.test(filename)) return 'Curriculum, Library & Island';
  if (/^(?:quiz-|progress-check|worksheet-sync|sheet-sync|parent-report|all-about-me|gamification-milestones|milestone-ceremony)/.test(filename)) return 'Assessments, Quizzes & Reports';
  if (/^(?:supabase-|school-cloud-sync|teacher-auth|private-data|offline)/.test(filename)) return 'Cloud, Auth & Privacy';
  return 'Utilities & Helpers';
}

function extractJsMetadata(relPath) {
  const txt = readText(relPath);
  const lines = txt.split(/\r?\n/);
  const stats = fileStats(relPath);
  const filename = path.basename(relPath);

  // Extract header comment description
  let summary = '';
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const clean = lines[i].replace(/^\s*(?:\/\*+|\*+\/?|\/\/)\s?/, '').trim();
    if (clean && !/^=+|-+$/.test(clean) && !/^['"]use strict['"]/.test(clean) && !/^\(function/.test(clean)) {
      summary = clean.slice(0, 160);
      break;
    }
  }

  // Section banners (// ===... or /* ---... */)
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*\/\/\s*={10,}/.test(l) && lines[i + 1]) {
      const title = lines[i + 1].replace(/^\s*\/\/\s*/, '').trim();
      if (title && !/^={5,}/.test(title)) {
        sections.push({ line: i + 1, title: title.slice(0, 110) });
        i += (lines[i + 2] && /^\s*\/\/\s*={10,}/.test(lines[i + 2])) ? 2 : 1;
      }
    } else {
      const m2 = l.match(/^\s*\/\*\s*-{8,}\s*([^*]+?)\s*\*\/$/);
      if (m2) sections.push({ line: i + 1, title: m2[1].trim().slice(0, 110) });
    }
  }
  for (let s = 0; s < sections.length; s++) {
    sections[s].endLine = s + 1 < sections.length ? sections[s + 1].line - 1 : lines.length;
  }

  // Top-level / exported functions & window globals
  const exportsSet = new Set();
  const keyFunctions = [];
  const storageKeys = new Set();
  const customEvents = new Set();
  const supabaseTables = new Set();
  const supabaseRpcs = new Set();

  lines.forEach((line, idx) => {
    const ln = idx + 1;

    // window.X or root.X exports
    for (const m of line.matchAll(/\b(?:window|root)\.([A-Za-z][A-Za-z0-9_]{2,})\s*=/g)) {
      if (!['onload', 'onerror', 'location', 'innerHTML', 'onresize', 'onhashchange'].includes(m[1])) {
        exportsSet.add(m[1]);
      }
    }

    // Named function landmarks
    const fnMatch = line.match(/^\s{0,4}(?:async\s+)?function\s+([A-Za-z][A-Za-z0-9_]{2,})\s*\(/);
    if (fnMatch) {
      keyFunctions.push({ name: fnMatch[1], line: ln });
    } else {
      const winFn = line.match(/^\s{0,6}(?:window|root)\.([A-Za-z][A-Za-z0-9_]{2,})\s*=\s*(?:async\s+)?function\b/);
      if (winFn) keyFunctions.push({ name: `window.${winFn[1]}`, line: ln });
      const protoFn = line.match(/^\s{2,6}([a-z][A-Za-z0-9_]{2,})\s*\([^)]*\)\s*\{\s*$/);
      if (protoFn && filename === 'school-store.js' && !['if', 'for', 'while', 'switch', 'catch', 'function'].includes(protoFn[1])) {
        keyFunctions.push({ name: `store.${protoFn[1]}()`, line: ln });
      }
    }

    // localStorage / sessionStorage keys
    for (const sm of line.matchAll(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(\s*['"]([^'"]+)['"]/g)) {
      storageKeys.add(sm[1]);
    }
    for (const km of line.matchAll(/\b[A-Z0-9_]*STORAGE_KEY[A-Z0-9_]*\s*=\s*['"]([^'"]+)['"]/g)) {
      storageKeys.add(km[1]);
    }

    // Custom events (eaa:* or dispatchEvent)
    for (const em of line.matchAll(/CustomEvent\(\s*['"]([^'"]+)['"]|addEventListener\(\s*['"](eaa:[^'"]+|school-store:[^'"]+|avatar:[^'"]+)['"]/g)) {
      customEvents.add(em[1] || em[2]);
    }

    // Supabase tables & RPCs
    for (const tm of line.matchAll(/\.from\(\s*['"]([a-z0-9_]+)['"]\s*\)/g)) {
      supabaseTables.add(tm[1]);
    }
    for (const rm of line.matchAll(/\.rpc\(\s*['"]([a-z0-9_]+)['"]/g)) {
      supabaseRpcs.add(rm[1]);
    }
  });

  return {
    path: relPath,
    filename,
    category: classifyJsCategory(filename),
    bytes: stats.bytes,
    kb: stats.kb,
    lines: stats.lines,
    summary: summary || `${filename} module`,
    sections,
    exports: [...exportsSet].slice(0, 40),
    totalExports: exportsSet.size,
    keyFunctions: keyFunctions.slice(0, 220),
    totalFunctions: keyFunctions.length,
    storageKeys: [...storageKeys],
    customEvents: [...customEvents],
    supabaseTables: [...supabaseTables],
    supabaseRpcs: [...supabaseRpcs]
  };
}

function scanAllJsAndCss(indexScripts, indexCss) {
  const loadedScriptMap = new Map();
  indexScripts.forEach((s, order) => loadedScriptMap.set(s.file, { order: order + 1, version: s.version, line: s.line }));

  const jsDir = path.join(ROOT, 'js');
  const jsFiles = fs.existsSync(jsDir)
    ? fs.readdirSync(jsDir).filter((f) => f.endsWith('.js')).sort()
    : [];

  const jsModules = jsFiles.map((f) => {
    const rel = `js/${f}`;
    const meta = extractJsMetadata(rel);
    const loadInfo = loadedScriptMap.get(rel);
    meta.loadedInIndex = !!loadInfo;
    meta.loadOrder = loadInfo ? loadInfo.order : null;
    meta.cacheVersion = loadInfo ? loadInfo.version : null;
    meta.indexScriptLine = loadInfo ? loadInfo.line : null;
    return meta;
  });

  const loadedCssMap = new Map();
  indexCss.forEach((c, order) => loadedCssMap.set(c.file, { order: order + 1, version: c.version, line: c.line }));

  const cssDir = path.join(ROOT, 'css');
  const cssFiles = fs.existsSync(cssDir)
    ? fs.readdirSync(cssDir).filter((f) => f.endsWith('.css')).sort()
    : [];

  const cssModules = cssFiles.map((f) => {
    const rel = `css/${f}`;
    const stats = fileStats(rel);
    const loadInfo = loadedCssMap.get(rel);
    return {
      path: rel,
      filename: f,
      kb: stats.kb,
      lines: stats.lines,
      loadedInIndex: !!loadInfo,
      loadOrder: loadInfo ? loadInfo.order : null,
      cacheVersion: loadInfo ? loadInfo.version : null
    };
  });

  return { jsModules, cssModules };
}

// ---------------------------------------------------------------------------
// 5. Parse Game Maker 2.0 (Modes, Question Sets, Engine Files)
// ---------------------------------------------------------------------------
function scanGameMaker() {
  const gmIndexTxt = readText('game-maker/index.html');
  const gmScripts = [...gmIndexTxt.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map((m) => {
    const [file, ver] = m[1].split('?v=');
    return { src: m[1], file, version: ver || '' };
  });

  // Find file + line where each GM.modes.<id> is defined
  const modeSourceMap = new Map();
  const gmJsDir = path.join(ROOT, 'game-maker', 'js');
  const gmJsFiles = fs.existsSync(gmJsDir) ? fs.readdirSync(gmJsDir).filter((f) => f.endsWith('.js')).sort() : [];

  for (const f of gmJsFiles) {
    const rel = `game-maker/js/${f}`;
    const lines = readText(rel).split(/\r?\n/);
    lines.forEach((l, idx) => {
      const m = l.match(/GM\.modes\.([A-Za-z0-9_]+)\s*=/);
      if (m) modeSourceMap.set(m[1], { file: rel, line: idx + 1 });
    });
  }

  // Evaluate GM modes & sets in a safe sandboxed VM
  const ctx = {
    window: {
      addEventListener: () => {},
      matchMedia: () => ({ matches: false }),
      location: { search: '', href: '' },
      localStorage: { getItem: () => null, setItem: () => {} }
    },
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      createElement: () => ({ getContext: () => ({}), style: {} }),
      documentElement: { classList: { contains: () => false } }
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    MutationObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    navigator: { userAgent: '' },
    Image: function () {},
    AudioContext: function () {},
    requestAnimationFrame: () => 0,
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    THREE: {}
  };
  ctx.window.document = ctx.document;
  ctx.window.localStorage = ctx.localStorage;
  ctx.window.MutationObserver = ctx.MutationObserver;
  ctx.self = ctx.window;
  vm.createContext(ctx);

  for (const s of gmScripts) {
    if (s.file.includes('vendor/') || s.file.includes('supabase') || s.file.endsWith('app.js')) continue;
    const fp = s.file.startsWith('../')
      ? path.join(ROOT, s.file.slice(3))
      : path.join(ROOT, 'game-maker', s.file);
    if (fs.existsSync(fp)) {
      try {
        vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx, { filename: s.file, timeout: 1500 });
      } catch (e) {
        // Non-critical browser-only init ignored
      }
    }
  }

  const GM = ctx.window.GM || ctx.GM || {};
  const modes = Object.entries(GM.modes || {}).map(([id, m]) => {
    const src = modeSourceMap.get(id) || { file: 'game-maker/js/app.js', line: 1 };
    const stats = fileStats(src.file);
    return {
      id,
      emoji: m.e || '🎮',
      name: m.nameClassic || m.name || id,
      halloweenName: m.name && m.name !== m.nameClassic ? m.name : '',
      desc: String(m.desc || '').replace(/\s+/g, ' ').trim(),
      file: src.file,
      line: src.line,
      kb: stats.kb,
      lines: stats.lines,
      is3D: id === 'penalty',
      launchUrl: `game-maker/index.html?game=${id}`
    };
  });

  const sets = (GM.sets || []).map((s) => ({
    id: s.id || '',
    title: s.title || s.name || s.id || 'Question Set',
    grade: s.grade || s.g || 'All',
    unit: s.unit || s.u || '',
    count: Array.isArray(s.items) ? s.items.length : (Array.isArray(s.q) ? s.q.length : 0)
  }));

  const engineFiles = gmJsFiles.map((f) => {
    const rel = `game-maker/js/${f}`;
    const st = fileStats(rel);
    const verObj = gmScripts.find((x) => x.file === `js/${f}`);
    return {
      path: rel,
      filename: f,
      kb: st.kb,
      lines: st.lines,
      version: verObj ? verObj.version : ''
    };
  });

  return {
    modes,
    sets,
    engineFiles,
    scripts: gmScripts
  };
}

// ---------------------------------------------------------------------------
// 6. Scan Curriculum (GAMES_DATA, Timetable, 404 Routes, Lesson Plans, Root Folders)
// ---------------------------------------------------------------------------
function scanCurriculumAndFolders(gitInfo) {
  // 6a. Evaluate GAMES_DATA
  let gamesData = [];
  try {
    const ctx = { window: {} };
    ctx.self = ctx.window;
    vm.createContext(ctx);
    vm.runInContext(readText('js/games-data.js'), ctx, { timeout: 1500 });
    gamesData = ctx.window.GAMES_DATA || ctx.GAMES_DATA || [];
  } catch (e) {
    gamesData = [];
  }

  // 6b. Evaluate Timetable CATALOG
  let timetableCatalog = [];
  try {
    const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} } };
    ctx.window.localStorage = ctx.localStorage;
    ctx.self = ctx.window;
    vm.createContext(ctx);
    vm.runInContext(readText('js/timetable.js'), ctx, { timeout: 1500 });
    if (ctx.window.Timetable && typeof ctx.window.Timetable.catalog === 'function') {
      timetableCatalog = ctx.window.Timetable.catalog() || [];
    }
  } catch (e) {
    timetableCatalog = [];
  }

  // 6c. Parse 404.html routed paths
  const txt404 = readText('404.html');
  const routed404Targets = new Set();
  for (const m of txt404.matchAll(/basePrefix\s*\+\s*['"]([^'"]+)['"]/g)) {
    routed404Targets.add(m[1].split('/')[0].replace(/\.html$/i, ''));
  }

  // 6d. Lesson plans in lesson-plans/
  const lpDir = path.join(ROOT, 'lesson-plans');
  const lessonPlanFiles = fs.existsSync(lpDir)
    ? fs.readdirSync(lpDir).filter((f) => /\.(?:pdf|docx)$/i.test(f)).sort()
    : [];

  const planGroups = new Map();
  for (const f of lessonPlanFiles) {
    const ext = path.extname(f).toLowerCase().slice(1);
    const base = f.slice(0, -(ext.length + 1));
    if (!planGroups.has(base)) {
      const gradeMatch = base.match(/Grade\s*([34])|G([34])/i);
      planGroups.set(base, {
        stem: base,
        grade: gradeMatch ? `Grade ${gradeMatch[1] || gradeMatch[2]}` : 'All Grades',
        docx: null,
        pdf: null
      });
    }
    planGroups.get(base)[ext] = `lesson-plans/${f}`;
  }

  // Index GAMES_DATA by top folder / file
  const gdByFolder = new Map();
  const gdEntries = gamesData.map((g) => {
    const url = String(g.url || g.route || '');
    const topFolder = url.split('/')[0].split('?')[0];
    if (topFolder) {
      if (!gdByFolder.has(topFolder)) gdByFolder.set(topFolder, []);
      gdByFolder.get(topFolder).push(g);
    }
    return {
      id: g.id,
      title: g.title || g.id,
      grade: g.grade || (Array.isArray(g.grades) ? g.grades.join(', ') : 'All'),
      unit: g.unit || '',
      category: g.categoryLabel || g.category || g.type || 'Lesson',
      url,
      worksheetUrl: g.worksheetUrl || '',
      xp: g.xp || 0,
      duration: g.durationText || (g.estimatedMinutes ? `${g.estimatedMinutes} min` : ''),
      icon: g.thumbnailIcon || '📘',
      existsLocally: url ? fs.existsSync(path.join(ROOT, url.split('?')[0].split('#')[0])) : false,
      in404: routed404Targets.has(topFolder)
    };
  });

  const ttByFolder = new Set(
    timetableCatalog.map((c) => String(c.route || '').split('/')[0].split('?')[0]).filter(Boolean)
  );

  // 6e. Scan ALL Root Entries + Git-Deleted Folders
  const deletedFolderMap = new Map(gitInfo.deletedTopFolders.map((d) => [d.folder, d.count]));
  const modifiedTopSet = new Set(gitInfo.modifiedFiles.map((m) => m.path.split('/')[0]));
  const untrackedTopSet = new Set(gitInfo.untrackedSafe.map((u) => u.replace(/\/$/, '').split('/')[0]));

  const rootDiskNames = fs.readdirSync(ROOT);
  const allRootNames = new Set([...rootDiskNames, ...deletedFolderMap.keys()]);

  const rootInventory = [];
  for (const name of [...allRootNames].sort((a, b) => a.localeCompare(b))) {
    if (name === '.git') continue;
    const full = path.join(ROOT, name);
    const exists = fs.existsSync(full);
    const isDir = exists ? fs.statSync(full).isDirectory() : true;
    const hasIndex = exists && isDir && fs.existsSync(path.join(full, 'index.html'));
    const hasWorksheet = exists && isDir && (
      fs.existsSync(path.join(full, 'worksheet.html')) ||
      fs.existsSync(path.join(full, 'worksheets.html'))
    );
    const gdMatches = gdByFolder.get(name) || [];
    const inTimetable = ttByFolder.has(name);
    const in404 = routed404Targets.has(name);

    // Determine Safety / Git Classification
    let safetyTag = 'LIVE';
    let safetyNote = 'Tracked & safe';
    if (!exists && deletedFolderMap.has(name)) {
      safetyTag = 'MISSING LOCALLY (GIT DELETED)';
      safetyNote = `${deletedFolderMap.get(name)} tracked files missing on local disk — NEVER run git add -A!`;
    } else if (name === 'assets') {
      safetyTag = gitInfo.untrackedRedactedAvatarCount > 0 ? 'PRIVACY GUARD' : (modifiedTopSet.has(name) ? 'MODIFIED' : 'LIVE');
      safetyNote = gitInfo.untrackedRedactedAvatarCount > 0
        ? `Contains ${gitInfo.untrackedRedactedAvatarCount} untracked pupil-named avatar file(s) — DO NOT COMMIT non-student-id files!`
        : 'Shared 3D packs, avatars (`student-*`), icons & audio';
    } else if (isLocalOnlyRootName(name)) {
      safetyTag = 'LOCAL-ONLY (NEVER PUSH)';
      safetyNote = name === 'monster day'
        ? 'Required local mirror clone (`monster day/.../NH`) — gitignored, never push'
        : 'Local workspace / build / agent scratch folder — never publish';
    } else if (untrackedTopSet.has(name)) {
      safetyTag = 'NEW / UNTRACKED';
      safetyNote = 'New local folder/file (not yet committed to git)';
    } else if (modifiedTopSet.has(name)) {
      safetyTag = 'MODIFIED / UNPUSHED';
      safetyNote = 'Has local modifications not yet pushed';
    } else if (deletedFolderMap.has(name)) {
      safetyTag = 'PARTIALLY DELETED LOCALLY';
      safetyNote = `${deletedFolderMap.get(name)} tracked subfiles deleted locally — stage carefully`;
    }

    // Determine kind & grade
    let kind = isDir ? 'Folder' : 'Root File';
    if (!isDir && name.endsWith('.html')) kind = 'HTML Entry Page';
    else if (!isDir && name.endsWith('.md')) kind = 'Documentation / Rule';
    else if (['js', 'css', 'sql', 'supabase', 'tools', 'docs', 'site-map'].includes(name)) kind = 'Platform Infrastructure';
    else if (['game-maker', 'island', 'passport', 'home-view', 'monster-studio', 'smart-board', 'magic-book', 'karaoke-stage'].includes(name)) kind = 'Core App / World';
    else if (hasIndex || gdMatches.length > 0 || deletedFolderMap.has(name)) kind = 'Lesson / Game Module';

    let grade = gdMatches[0]?.grade || '';
    if (!grade) {
      if (/g3|grade3/i.test(name)) grade = 'Grade 3';
      else if (/g4|grade4/i.test(name)) grade = 'Grade 4';
    }

    rootInventory.push({
      name,
      isDir,
      exists,
      kind,
      grade,
      hasIndex,
      hasWorksheet,
      playUrl: hasIndex ? `${name}/index.html` : (!isDir && name.endsWith('.html') ? name : ''),
      worksheetUrl: hasWorksheet
        ? (fs.existsSync(path.join(full, 'worksheet.html')) ? `${name}/worksheet.html` : `${name}/worksheets.html`)
        : '',
      inGamesData: gdMatches.length > 0,
      gamesDataIds: gdMatches.map((g) => g.id),
      title: gdMatches[0]?.title || name,
      inTimetable,
      in404,
      safetyTag,
      safetyNote
    });
  }

  return {
    gamesData: gdEntries,
    timetableCatalog: timetableCatalog.map((c) => ({
      id: c.id,
      icon: c.icon || '📘',
      title: c.title,
      route: c.route,
      grade: c.g ? `Grade ${c.g}` : 'All',
      added: c.added || ''
    })),
    lessonPlans: [...planGroups.values()],
    routed404Count: routed404Targets.size,
    rootInventory
  };
}

// ---------------------------------------------------------------------------
// 7. Scan Avatars, Monster Studio & Cloud/SQL Schemas
// ---------------------------------------------------------------------------
function scanAvatarsAndCloud(jsModules) {
  // Safe summary of assets/avatars
  const avDir = path.join(ROOT, 'assets', 'avatars');
  let studentPortraitCount = 0;
  let bodyAssetCount = 0;
  let skinAssetCount = 0;
  let wearAssetCount = 0;
  let redactedCount = 0;

  if (fs.existsSync(avDir)) {
    for (const f of fs.readdirSync(avDir)) {
      if (/^student-\d[a-z]-\d+/i.test(f)) studentPortraitCount++;
      else if (/^body_/i.test(f)) bodyAssetCount++;
      else if (/^skin_/i.test(f)) skinAssetCount++;
      else if (!SAFE_AVATAR_NAME_RE.test(f)) redactedCount++;
    }
    const wearDir = path.join(avDir, 'wear');
    if (fs.existsSync(wearDir)) {
      wearAssetCount = fs.readdirSync(wearDir).filter((f) => /\.(?:webp|png)$/i.test(f)).length;
    }
  }

  const monsterLayers = [
    { z: 0, id: '#layer-aura-back', cls: 'z-0', purpose: 'Magical aura particles, flames, sparkles, cosmic star rings' },
    { z: 10, id: '#layer-back-gear', cls: 'z-10', purpose: 'Back gear behind torso: Wings, Capes, Tails, Backpacks' },
    { z: 20, id: '#layer-body', cls: 'z-20', purpose: 'Base monster silhouette, paws, torso, front ears (or Dragon body)' },
    { z: 30, id: '#layer-clothing', cls: 'z-30', purpose: 'Outfits wrapped to torso: Vests, Robes, Hoodies, Armor, Uniforms' },
    { z: 40, id: '#layer-face', cls: 'z-40', purpose: 'Face expressions: Eyes, Muzzle/Snout, Mouth, Cheeks (over clothing)' },
    { z: 50, id: '#layer-glasses', cls: 'z-50', purpose: 'Face accessories: Round wire glasses, Goggles, Shades' },
    { z: 60, id: '#layer-horns', cls: 'z-60', purpose: 'Horns & crests (Sprout nubs, Curved horns, Crystal, Gold, Star)' },
    { z: 70, id: '#layer-headwear', cls: 'z-70', purpose: 'Headwear: Hats, Caps, Crowns, Wizard hats, Bandanas, Held items' }
  ];

  // Aggregate Supabase tables, RPCs, storage keys, custom events across all JS + SQL
  const tableMap = new Map();
  const rpcMap = new Map();
  const storageMap = new Map();
  const eventMap = new Map();

  for (const mod of jsModules) {
    for (const t of mod.supabaseTables) {
      if (!tableMap.has(t)) tableMap.set(t, []);
      tableMap.get(t).push(mod.path);
    }
    for (const r of mod.supabaseRpcs) {
      if (!rpcMap.has(r)) rpcMap.set(r, []);
      rpcMap.get(r).push(mod.path);
    }
    for (const k of mod.storageKeys) {
      if (!storageMap.has(k)) storageMap.set(k, []);
      storageMap.get(k).push(mod.path);
    }
    for (const ev of mod.customEvents) {
      if (!eventMap.has(ev)) eventMap.set(ev, []);
      eventMap.get(ev).push(mod.path);
    }
  }

  // Also scan sql/*.sql and supabase/*.sql
  const sqlFiles = [];
  for (const dir of ['sql', 'supabase']) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const f of fs.readdirSync(fullDir)) {
      if (!f.endsWith('.sql')) continue;
      const rel = `${dir}/${f}`;
      const txt = readText(rel);
      const tables = [...txt.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z0-9_]+)/gi)].map((m) => m[1]);
      tables.forEach((t) => {
        if (!tableMap.has(t)) tableMap.set(t, []);
        if (!tableMap.get(t).includes(rel)) tableMap.get(t).push(rel);
      });
      sqlFiles.push({ path: rel, kb: fileStats(rel).kb, tables });
    }
  }

  return {
    avatarAssets: {
      studentPortraitCount,
      bodyAssetCount,
      skinAssetCount,
      wearAssetCount,
      redactedUntrackedCount: redactedCount
    },
    monsterLayers,
    supabaseTables: [...tableMap.entries()].map(([name, files]) => ({ name, files })).sort((a, b) => a.name.localeCompare(b.name)),
    supabaseRpcs: [...rpcMap.entries()].map(([name, files]) => ({ name, files })).sort((a, b) => a.name.localeCompare(b.name)),
    storageKeys: [...storageMap.entries()].map(([key, files]) => ({ key, files })).sort((a, b) => a.key.localeCompare(b.key)),
    customEvents: [...eventMap.entries()].map(([event, files]) => ({ event, files })).sort((a, b) => a.event.localeCompare(b.event)),
    sqlFiles
  };
}

// ---------------------------------------------------------------------------
// 8. "Where Do I Edit X?" Task Cheat-Sheet
// ---------------------------------------------------------------------------
function buildQuickTasks() {
  return [
    { task: 'Change sidebar / 7-place navigation or Class Mode rail', file: 'js/platform-nav.js', lines: 'L11–L92', symbol: 'PLACES, MORE, PlatformNav.go()' },
    { task: 'Add or edit a main platform view (`switchView`)', file: 'js/school-app.js', lines: 'L1046 & L10109–L10168', symbol: 'window.switchView, renderCurrentView()' },
    { task: 'Edit Today view schedule or add lesson to Timetable catalog', file: 'js/timetable.js', lines: 'L7–L260', symbol: 'CATALOG, Timetable.todayHtml()' },
    { task: 'Register a new lesson or game in the Library', file: 'js/games-data.js', lines: 'L1–end', symbol: 'window.GAMES_DATA' },
    { task: 'Add a friendly URL / deep-link redirect on GitHub Pages', file: '404.html', lines: 'L151–L347', symbol: 'pathname routing chain' },
    { task: 'Edit Live Class Board, pupil tiles, Groups, Picker or Karaoke', file: 'js/class-board.js', lines: 'L1–end', symbol: 'window.ClassBoard, renderClassBoardView' },
    { task: 'Edit Pupil 3D Avatars, body proportions, outfits or 3D Pitch Rig', file: 'js/pupil-avatars.js', lines: 'L1–end', symbol: 'window.PupilAvatars, composePitchRigParts()' },
    { task: 'Edit Unified Pupil Shop, Avatar Customizer & try-on drawers', file: 'js/classroom-store.js', lines: 'L1–end', symbol: 'window.ClassroomStore, renderClassroomStoreView' },
    { task: 'Edit Monster 8-layer SVG renderer or Dragon companion', file: 'js/monster-renderer.js', lines: 'L1–end', symbol: 'MonsterRenderer.renderMonsterLiveStage()' },
    { task: 'Edit Mystery Box rewards, probabilities & opening animation', file: 'js/mystery-box-v2.js', lines: 'L1–end', symbol: 'window.MysteryBoxV2' },
    { task: 'Edit Student Roster, XP Ledger, Coins, Classes or Level Unlocks', file: 'js/school-store.js', lines: 'L1–end', symbol: 'window.schoolStore (SchoolPlatformStore)' },
    { task: 'Edit Teacher Hub (Command Center: XP, logs, bulk actions)', file: 'js/command-center.js', lines: 'L1–end', symbol: 'window.renderCommandCenterView' },
    { task: 'Add or tweak a Game Maker arcade mode (22 modes)', file: 'game-maker/js/mode-*.js', lines: 'See 04-game-maker.md', symbol: 'GM.modes.<id>' },
    { task: 'Edit 3D Penalty Shootout stadium, physics or Pixar 3D players', file: 'game-maker/js/mode-penalty.js', lines: 'L1–L960', symbol: 'GM.modes.penalty, makeCharacterRig()' },
    { task: 'Add a new vocabulary / speaking question bank to Game Maker', file: 'game-maker/js/sets-unit5.js', lines: 'L1–end', symbol: 'GM.sets.push(...)' },
    { task: 'Edit Practice Island home world, chapters or harbour shop', file: 'island/js/app.js', lines: 'L1–end', symbol: 'island/index.html & island/world.html' },
    { task: 'Edit Student Passport booklets & class gallery', file: 'passport/index.html', lines: 'L1–end', symbol: 'passport/js/*' },
    { task: 'Edit Supabase PostgreSQL sync, tables or realtime channels', file: 'js/supabase-client.js', lines: 'L1–end', symbol: 'window.supabaseClient + js/school-cloud-sync.js' },
    { task: 'Check encrypted private pupil bundle (survey, parent notes, birthdays)', file: 'js/private-data.js', lines: 'L1–L60', symbol: 'EAAPrivate.load(), EAAPrivate.get()' },
    { task: 'Edit Classroom Soundboard (1–7 hotkeys, Web Audio synthesis)', file: 'js/classroom-sounds.js', lines: 'L1–end', symbol: 'window.classSoundboard' },
    { task: 'Re-generate this entire Site Map after adding files or lessons', file: 'tools/build-site-map.js', lines: 'CLI', symbol: 'node tools/build-site-map.js' }
  ];
}

// ---------------------------------------------------------------------------
// 9. Markdown Generators
// ---------------------------------------------------------------------------
function mdLink(relPath, label, lineStart, lineEnd) {
  const posix = toPosix(relPath);
  const hash = lineStart ? (lineEnd ? `#L${lineStart}-L${lineEnd}` : `#L${lineStart}`) : '';
  const text = label || path.basename(posix);
  return `[${text}](file:///C:/Users/maysa/Desktop/DV/${posix}${hash})`;
}

function generateMasterSiteMapMd(data) {
  const schoolApp = data.jsModules.find((m) => m.filename === 'school-app.js');
  const schoolStore = data.jsModules.find((m) => m.filename === 'school-store.js');

  return `# 🗺️ English Adventure Academy — Master Site Map

> **Auto-Generated & Verified** by ${mdLink('tools/build-site-map.js', 'build-site-map.js')}  
> **Interactive Visual Hub (Local Browser):** \`http://localhost:8155/site-map/index.html\` (${mdLink('site-map/index.html', 'site-map/index.html')})  
> **Refresh Map Anytime:** \`node tools/build-site-map.js\`

---

## ⚡ 1. Platform At-a-Glance

| Metric | Count | Primary Source |
| :--- | :---: | :--- |
| **Top-Level Navigation Places** | **${data.navigation.places.length}** | ${mdLink('js/platform-nav.js', 'platform-nav.js', 11, 28)} |
| **Dynamic \`switchView()\` Views** | **${data.navigation.switchRoutes.length}** | ${mdLink('js/school-app.js', 'school-app.js', 10109, 10168)} |
| **Reusable Modals in \`index.html\`** | **${data.indexHtml.modals.length}** | ${mdLink('index.html', 'index.html', 480, 4390)} |
| **Platform JS Modules (\`js/*.js\`)** | **${data.jsModules.length}** (${data.indexHtml.scripts.length} in \`index.html\`) | ${mdLink('docs/map/02-core-js-and-monoliths.md', '02-core-js-and-monoliths.md')} |
| **Platform Stylesheets (\`css/*.css\`)** | **${data.cssModules.length}** (${data.indexHtml.cssLinks.length} in \`index.html\`) | ${mdLink('docs/map/01-platform-screens-and-dom.md', '01-platform-screens-and-dom.md')} |
| **Game Maker 2.0 Arcade Modes** | **${data.gameMaker.modes.length} modes** + **${data.gameMaker.sets.length} question sets** | ${mdLink('docs/map/04-game-maker.md', '04-game-maker.md')} |
| **Registered \`GAMES_DATA\` Modules** | **${data.curriculum.gamesData.length}** | ${mdLink('js/games-data.js', 'games-data.js')} |
| **Printable Lesson Plans (Word/PDF)** | **${data.curriculum.lessonPlans.length} lessons** | ${mdLink('docs/map/05-lessons-island-and-curriculum.md', '05-lessons-island-and-curriculum.md')} |
| **Supabase Cloud Tables / Storage Keys** | **${data.cloud.supabaseTables.length} tables** / **${data.cloud.storageKeys.length} keys** | ${mdLink('docs/map/06-cloud-storage-and-privacy.md', '06-cloud-storage-and-privacy.md')} |

---

## 📂 2. Modular Deep-Dive Map Index (\`docs/map/\`)

1. **${mdLink('docs/map/01-platform-screens-and-dom.md', '01-platform-screens-and-dom.md')}** — Entry HTML pages, 7-place sidebar/rail, all ${data.navigation.switchRoutes.length} \`switchView\` routes, all ${data.indexHtml.modals.length} modals, toolkit tabs, and exact CSS/JS load order.
2. **${mdLink('docs/map/02-core-js-and-monoliths.md', '02-core-js-and-monoliths.md')}** — All ${data.jsModules.length} \`js/*.js\` & ${data.cssModules.length} \`css/*.css\` files, plus full line-range chapters inside \`school-app.js\` (${schoolApp?.lines || 0} lines) and \`school-store.js\` (${schoolStore?.lines || 0} lines).
3. **${mdLink('docs/map/03-avatars-monsters-and-store.md', '03-avatars-monsters-and-store.md')}** — \`PupilAvatars\` (2D + 3D extruded rig), Unified \`ClassroomStore\`, \`MonsterRenderer\` 8-layer stage, Mystery Boxes, and \`assets/avatars/\` layout.
4. **${mdLink('docs/map/04-game-maker.md', '04-game-maker.md')}** — All ${data.gameMaker.modes.length} Game Maker arcade modes (including 3D Penalty Shootout), ${data.gameMaker.sets.length} question sets, engine & audio architecture.
5. **${mdLink('docs/map/05-lessons-island-and-curriculum.md', '05-lessons-island-and-curriculum.md')}** — All Grade 3 & Grade 4 lessons, \`GAMES_DATA\`, \`Timetable\` catalog, \`lesson-plans/\`, \`island/\`, \`passport/\`, \`home-view/\`, and \`404.html\` routes.
6. **${mdLink('docs/map/06-cloud-storage-and-privacy.md', '06-cloud-storage-and-privacy.md')}** — Supabase tables & SQL schemas, \`localStorage\` keys, \`EAAPrivate\` encrypted pupil data, \`eaa:*\` events, and full **120+ Root Folder Git & Privacy Audit**.

---

## 🧭 3. System Architecture Graph

\`\`\`mermaid
flowchart TB
  Lock["🔐 index.html Lock Screen (PBKDF2 PIN)"] --> Nav["🧭 PlatformNav (7 Places Rail)"]
  Nav --> Today["▶️ Today (timetable.js)"]
  Nav --> Board["📺 Class Board (class-board.js)"]
  Nav --> Shop["🛍️ Unified Shop & Avatar Studio (classroom-store.js + pupil-avatars.js)"]
  Nav --> Lib["📖 Library & Plans (library-shelf.js + games-data.js)"]
  Nav --> Tools["🪄 Board & Book (smart-board/ + magic-book/ + Toolkit)"]
  Nav --> Plan["📅 Plan (calendar-view.js + timetable.js)"]
  Nav --> More["⚙️ More / Teacher Hub (command-center.js)"]

  Lib --> GM["🎮 Game Maker 2.0 (22 Modes + 75 Sets + 3D Penalty)"]
  Lib --> Lessons["📚 120 Curriculum Lessons & Worksheets"]
  More --> Island["🏝️ Practice Island (island/index.html + world.html)"]
  More --> Passport["🛂 My Passport & Home View"]

  Store["🗄️ schoolStore (js/school-store.js)"] <--> Board
  Store <--> Shop
  Store <--> Today
  Store <--> Cloud["☁️ Supabase Cloud Sync + EAAPrivate AES-256-GCM"]
\`\`\`

---

## 🎯 4. "Where Do I Edit X?" — Instant Task Cheat-Sheet

| Task / Feature | File | Lines | Key Symbol / Entry |
| :--- | :--- | :---: | :--- |
${data.quickTasks.map((t) => `| ${t.task} | ${mdLink(t.file, t.file)} | \`${t.lines}\` | \`${t.symbol}\` |`).join('\n')}

---

## 🏛️ 5. Giant Monolith Quick-Jump (\`school-app.js\` & \`school-store.js\`)

### A. ${mdLink('js/school-app.js', 'school-app.js')} (${schoolApp?.lines || 0} lines · ${schoolApp?.kb || 0} KB)
| Line Range | Chapter / Section |
| :---: | :--- |
${(schoolApp?.sections || []).map((s) => `| ${mdLink('js/school-app.js', `L${s.line}–L${s.endLine}`, s.line, s.endLine)} | ${s.title} |`).join('\n')}

### B. ${mdLink('js/school-store.js', 'school-store.js')} (${schoolStore?.lines || 0} lines · ${schoolStore?.kb || 0} KB)
| Line Range | Chapter / Section |
| :---: | :--- |
${(schoolStore?.sections || []).map((s) => `| ${mdLink('js/school-store.js', `L${s.line}–L${s.endLine}`, s.line, s.endLine)} | ${s.title} |`).join('\n')}

---

## 🛡️ 6. Non-Negotiable Safety & Operating Rules

1. **Mirror Every Edit (\`AGENTS.md\` §2.1):** Copy every modified/created file to \`monster day/story/mouse/pokemon/firefighter/NH/<same-path>\` and run \`node --check\` on both copies.
2. **Never Use \`git add -A\` or \`git add .\` (\`AGENTS.md\` §2.3):** **${data.git.deletedTopFolders.length} published folders** are intentionally absent on local disk (see ${mdLink('docs/map/06-cloud-storage-and-privacy.md', '06-cloud-storage-and-privacy.md')}). Stage ONLY the exact files you changed, and push to \`main\` + \`gh-pages\` ONLY when the teacher explicitly says **"push"**.
3. **Pupil Privacy (\`AGENTS.md\` §8):** Never commit real pupil names, photos, survey answers, or non-\`student-*\` files in \`assets/avatars/\` (${data.git.untrackedRedactedAvatarCount} local untracked file(s) currently flagged & redacted by privacy guard).
4. **Safe Local Testing:** Always test \`index.html\` via \`_tmp/safe-cdp.js\` (blocks live Supabase writes). \`site-map/index.html\` is 100% standalone & cloud-free.
`;
}

function generateDoc01(data) {
  const standalonePages = [
    { path: 'index.html', role: 'Main School Platform SPA Host (Teacher, Student, Parent, Class Mode)' },
    { path: 'directory.html', role: 'Students Directory & Monster Companions Grid' },
    { path: 'site-map/index.html', role: 'Interactive Visual Site Map & Developer Explorer (Read-Only)' },
    { path: 'game-maker/index.html', role: 'Game Maker 2.0 Arcade Host (22 Modes + 75 Question Sets)' },
    { path: 'island/index.html', role: 'Practice Island Student Home App (Chapters, Harbour, Shop)' },
    { path: 'island/world.html', role: 'Practice Island 2D Walking World' },
    { path: 'island/teacher.html', role: 'Practice Island Teacher Live Progress Wall' },
    { path: 'passport/index.html', role: 'My Passport Student Booklets & Class Gallery' },
    { path: 'home-view/index.html', role: 'Parent & Student Home Overview Portal' },
    { path: 'smart-board/index.html', role: 'AI Classroom Smart Board' },
    { path: 'magic-book/index.html', role: 'The Magic Book Interactive Unit 5 Textbook Reader' },
    { path: 'monster-studio/index.html', role: 'Standalone Monster Studio Preview Host' },
    { path: 'pharaoh-living-book.html', role: 'The Pharaoh\'s Kingdom 3D Living Pop-Up Book (Grade 3 Egypt)' },
    { path: '404.html', role: 'GitHub Pages Deep-Link Router & Detective Navigation Hub' }
  ];

  return `# 01 — Platform Screens, DOM, Modals & Load Order

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}

---

## 1. Standalone HTML Entry Points

| Entry Page | Size / Lines | Purpose |
| :--- | :---: | :--- |
${standalonePages.map((p) => {
    const st = fileStats(p.path);
    return `| ${st.exists ? mdLink(p.path, p.path) : `\`${p.path}\``} | ${st.exists ? `${st.kb} KB (${st.lines}L)` : '—'} | ${p.role} |`;
  }).join('\n')}

---

## 2. Main Platform 7-Place Navigation (${mdLink('js/platform-nav.js', 'platform-nav.js', 11, 61)})

| Place ID | Label | Hash Route | Primary Controller(s) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
${data.navigation.places.map((p) => `| \`${p.id}\` | ${p.icon} **${p.label}** | \`${p.route}\` | \`${p.controller}\` | ${p.desc} |`).join('\n')}

---

## 3. All \`switchView()\` Routes in ${mdLink('js/school-app.js', 'school-app.js', 10109, 10168)}

| View ID | URL Hash | Line | Render Function / Delegation |
| :--- | :--- | :---: | :--- |
${data.navigation.switchRoutes.map((r) => `| \`${r.viewId}\` | \`${r.hashUrl}\` | ${mdLink('js/school-app.js', `L${r.line}`, r.line)} | \`${r.handler}\` |`).join('\n')}

---

## 4. All Modals & Overlays in ${mdLink('index.html', 'index.html')} (${data.indexHtml.modals.length} total)

| Modal DOM \`#id\` | Line | Heading / Purpose |
| :--- | :---: | :--- |
${data.indexHtml.modals.map((m) => `| \`#${m.id}\` | ${mdLink('index.html', `L${m.line}`, m.line)} | ${m.title} |`).join('\n')}

---

## 5. Classroom Toolkit Modal Tabs (\`#modal-classroom-toolkit\`)

| Tab DOM \`#id\` | Line | Label | Trigger |
| :--- | :---: | :--- | :--- |
${data.indexHtml.toolTabs.map((t) => `| \`#${t.id}\` | ${mdLink('index.html', `L${t.line}`, t.line)} | ${t.label} | \`${t.action}\` |`).join('\n')}

---

## 6. Stylesheet Load Order in ${mdLink('index.html', 'index.html', 24, 31)}

| Order | Stylesheet | \`?v=\` | Index Line |
| :---: | :--- | :---: | :---: |
${data.indexHtml.cssLinks.map((c, idx) => `| ${idx + 1} | ${mdLink(c.file, c.file)} | \`${c.version || '—'}\` | ${mdLink('index.html', `L${c.line}`, c.line)} |`).join('\n')}

---

## 7. Exact Script Load Order in ${mdLink('index.html', 'index.html', 4395, 4424)} (${data.indexHtml.scripts.length} scripts)

| # | Script | \`?v=\` | Index Line |
| :---: | :--- | :---: | :---: |
${data.indexHtml.scripts.map((s, idx) => `| ${idx + 1} | ${s.file.startsWith('http') ? `\`${s.file}\`` : mdLink(s.file, s.file)} | \`${s.version || '—'}\` | ${mdLink('index.html', `L${s.line}`, s.line)} |`).join('\n')}
`;
}

function generateDoc02(data) {
  const byCategory = new Map();
  for (const m of data.jsModules) {
    if (!byCategory.has(m.category)) byCategory.set(m.category, []);
    byCategory.get(m.category).push(m);
  }

  const largeMonoliths = data.jsModules
    .filter((m) => m.lines >= 900)
    .sort((a, b) => b.lines - a.lines);

  return `# 02 — Core JavaScript Modules, CSS & Giant Monolith Maps

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}

---

## 1. All \`css/*.css\` Stylesheets (${data.cssModules.length} files)

| File | Size | Lines | Loaded in \`index.html\`? |
| :--- | :---: | :---: | :---: |
${data.cssModules.map((c) => `| ${mdLink(c.path, c.filename)} | ${c.kb} KB | ${c.lines} | ${c.loadedInIndex ? `Yes (#${c.loadOrder}, \`?v=${c.cacheVersion}\`)` : 'Module / Legacy'} |`).join('\n')}

---

## 2. All \`js/*.js\` Modules Grouped by Subsystem (${data.jsModules.length} files)

${[...byCategory.entries()].map(([cat, mods]) => `### ${cat} (${mods.length})
| File | Size | Lines | In \`index.html\` | \`window.*\` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
${mods.map((m) => `| ${mdLink(m.path, m.filename)} | ${m.kb} KB | ${m.lines} | ${m.loadedInIndex ? `#${m.loadOrder} (\`v=${m.cacheVersion}\`)` : 'Standalone'} | ${m.exports.slice(0, 4).map((e) => `\`${e}\``).join(', ') || '—'} | ${m.summary.replace(/\|/g, '·')} |`).join('\n')}
`).join('\n')}

---

## 3. Deep Chapter & Function Landmarks Inside Large Monoliths (900+ Lines)

${largeMonoliths.map((m) => `### 📦 ${mdLink(m.path, m.path)} — ${m.lines} lines (${m.kb} KB)

${m.sections.length > 0 ? `#### Section Banners (${m.sections.length})
| Lines | Section Title |
| :---: | :--- |
${m.sections.map((s) => `| ${mdLink(m.path, `L${s.line}–L${s.endLine}`, s.line, s.endLine)} | ${s.title.replace(/\|/g, '·')} |`).join('\n')}
` : ''}

#### Key Functions & Methods (showing ${Math.min(60, m.keyFunctions.length)} of ${m.totalFunctions})
| Line | Function / Method |
| :---: | :--- |
${m.keyFunctions.slice(0, 60).map((fn) => `| ${mdLink(m.path, `L${fn.line}`, fn.line)} | \`${fn.name}\` |`).join('\n')}
`).join('\n---\n\n')}
`;
}

function generateDoc03(data) {
  const avatarMods = data.jsModules.filter((m) => m.category === 'Avatars, Monsters & Store');
  return `# 03 — Avatars, Monster Studio & Unified Classroom Store

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}

---

## 1. Architecture Overview

English Adventure Academy features **two complementary companion/character pipelines** managed through a **single unified store & customization experience**:

1. **Pixar 3D Pupil Avatars (${mdLink('js/pupil-avatars.js', 'pupil-avatars.js')})**:
   - Composites real 3D rendered pupil heads (\`assets/avatars/student-<class>-<id>-*.webp\`), skin-tone neck/hands (\`skin_*.webp\`), balanced proportional bodies (\`body_stand.webp\`, \`body_wave.webp\`, \`body_cheer.webp\`, \`body_jump.webp\`), and layered 3D store wearables (\`assets/avatars/wear/*.webp\`).
   - **3D WebGL Extruded Stadium Rig (\`PupilAvatars.composePitchRigParts\`)**: Extracts transparent torso, head, and hip-socket articulated left/right legs for real-time Three.js 3D volumetric characters in Game Maker's **3D Penalty Shootout** (${mdLink('game-maker/js/mode-penalty.js', 'mode-penalty.js')}).
2. **Unified Classroom Store & Customizer (${mdLink('js/classroom-store.js', 'classroom-store.js')})**:
   - Single-window shop & live try-on studio (\`switchView('store-pupil')\` for pupils / Class Board, \`switchView('store-teacher')\` for teacher pricing, coins, stock & purchase logs).
   - Connects directly to **Mystery Boxes** (${mdLink('js/mystery-box-v2.js', 'mystery-box-v2.js')}, ${mdLink('js/mystery-box-modal.js', 'mystery-box-modal.js')}) and student coin balances in \`schoolStore\`.
3. **8-Layer Monster Companion Stage (${mdLink('js/monster-renderer.js', 'monster-renderer.js')})**:
   - Renders level-evolving elemental monsters + teacher-approved drawn store creatures (e.g. Sky Dragon \`creature-dragon\`) with anchor-fitted cosmetics (${mdLink('js/monster-anchors.js', 'monster-anchors.js')}).

---

## 2. \`assets/avatars/\` Asset Hierarchy & Privacy Status

| Asset Group | Path Pattern | Count on Disk | Git / Privacy Rule |
| :--- | :--- | :---: | :--- |
| **Anonymized Pupil Heads** | \`assets/avatars/student-<3a..4b>-<id>-*.webp\` | **${data.cloud.avatarAssets.studentPortraitCount}** | Safe placeholder IDs (real names live ONLY in Supabase \`students\`) |
| **3D Body Pose Bases** | \`assets/avatars/body_*.webp\` | **${data.cloud.avatarAssets.bodyAssetCount}** | Safe core 3D pose sprites (\`stand\`, \`wave\`, \`cheer\`, \`jump\`) |
| **Skin Tone Neck/Hands** | \`assets/avatars/skin_*.webp\` | **${data.cloud.avatarAssets.skinAssetCount}** | Safe skin tone tint layers |
| **3D Store Wearables** | \`assets/avatars/wear/*.webp\` | **${data.cloud.avatarAssets.wearAssetCount}** | Safe hats, glasses, shirts, capes, shoes & held items |
| **Untracked Real-Name Files** | \`assets/avatars/<redacted-pupil-file>.webp\` | **${data.cloud.avatarAssets.redactedUntrackedCount}** | **DO NOT COMMIT (\`AGENTS.md\` §8)** — local scratch files only |

---

## 3. Monster Studio 8-Layer Composite Contract (\`.monster-composite-stage\`)

| Z-Index | DOM Layer ID | Class | Contents & Rule |
| :---: | :--- | :---: | :--- |
${data.cloud.monsterLayers.map((l) => `| \`${l.z}\` | \`${l.id}\` | \`${l.cls}\` | ${l.purpose} |`).join('\n')}

- **Ground Reflection Pedestal:** \`#preview-pedestal\` (\`.pedestal-disk\` / \`.pedestal-disc\`) sits immediately below \`.monster-composite-stage\`.
- **Level Lock Invariant (\`AGENTS.md\` §3.4):** Cosmetics with \`unlockLevel > currentMonster.level\` render \`🔒 Level X\` with \`pointer-events: none; opacity: 0.45; filter: grayscale(0.7)\` and are rejected in both \`handleSelectMonsterItem\` and \`equipItem\`.

---

## 4. All Avatar, Monster & Store Modules (${avatarMods.length} files)

| Module | Lines / Size | Exports | Purpose |
| :--- | :---: | :--- | :--- |
${avatarMods.map((m) => `| ${mdLink(m.path, m.filename)} | ${m.lines}L (${m.kb} KB) | ${m.exports.slice(0, 5).map((e) => `\`${e}\``).join(', ') || '—'} | ${m.summary.replace(/\|/g, '·')} |`).join('\n')}
`;
}

function generateDoc04(data) {
  return `# 04 — Game Maker 2.0 (\`game-maker/\`)

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}  
> **Host Entry:** ${mdLink('game-maker/index.html', 'game-maker/index.html')} · **Local URL:** \`http://localhost:8155/game-maker/index.html\`

---

## 1. All ${data.gameMaker.modes.length} Playable Arcade Modes (\`GM.modes.*\`)

| Mode ID | Title | Source File & Line | Launch Query | Gameplay Summary |
| :--- | :--- | :--- | :--- | :--- |
${data.gameMaker.modes.map((m) => `| \`${m.id}\` | ${m.emoji} **${m.name}**${m.is3D ? ' *(Three.js 3D)*' : ''} | ${mdLink(m.file, `${path.basename(m.file)}:L${m.line}`, m.line)} (${m.lines}L) | \`?game=${m.id}\` | ${m.desc.replace(/\|/g, '·')} |`).join('\n')}

---

## 2. Game Maker Core Engine & Support Files (${data.gameMaker.engineFiles.length} JS files)

| File | Size | Lines | Cache \`?v=\` |
| :--- | :---: | :---: | :---: |
${data.gameMaker.engineFiles.map((f) => `| ${mdLink(f.path, f.filename)} | ${f.kb} KB | ${f.lines} | \`${f.version || '—'}\` |`).join('\n')}

---

## 3. All ${data.gameMaker.sets.length} Built-In Question & Speaking Sets (\`GM.sets\`)

| Set ID | Grade | Questions | Title |
| :--- | :---: | :---: | :--- |
${data.gameMaker.sets.map((s) => `| \`${s.id}\` | \`${s.grade}\` | **${s.count}** | ${String(s.title).replace(/\|/g, '·')} |`).join('\n')}
`;
}

function generateDoc05(data) {
  const g3 = data.curriculum.gamesData.filter((g) => /3/.test(String(g.grade)));
  const g4 = data.curriculum.gamesData.filter((g) => /4/.test(String(g.grade)) && !/3/.test(String(g.grade)));
  const shared = data.curriculum.gamesData.filter((g) => !/3|4/.test(String(g.grade)));

  const renderGdTable = (list) => `| ID | Title | URL | Worksheet | Local Disk | \`404.html\` |
| :--- | :--- | :--- | :---: | :---: | :---: |
${list.map((g) => `| \`${g.id}\` | ${g.icon} ${String(g.title).replace(/\|/g, '·')} | \`${g.url}\` | ${g.worksheetUrl ? '🖨️ Yes' : '—'} | ${g.existsLocally ? '✅ Present' : '⚠️ Published Only'} | ${g.in404 ? '✅' : '—'} |`).join('\n')}`;

  return `# 05 — Lessons, Practice Island, Passport & Curriculum Plans

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}

---

## 1. Student Worlds & Companion Apps

| World / App | Entry File | Companion Pages & Purpose |
| :--- | :--- | :--- |
| **🏝️ Practice Island** | ${mdLink('island/index.html', 'island/index.html')} | Student home practice world (${mdLink('island/world.html', 'world.html')} 2D walking map, ${mdLink('island/teacher.html', 'teacher.html')} live wall, \`island/js/chapter1\`, \`chapter2\`, \`harbour\`, \`minigames\`, \`realgame\`). Curriculum fed by ${mdLink('js/island-curriculum-data.js', 'island-curriculum-data.js')}. |
| **🛂 My Passport** | ${mdLink('passport/index.html', 'passport/index.html')} | Printable & digital student passport booklets + teacher gallery (${mdLink('passport/teacher.html', 'passport/teacher.html')}). |
| **🏠 Home View** | ${mdLink('home-view/index.html', 'home-view/index.html')} | Family & student home progress portal. |
| **📖 The Magic Book** | ${mdLink('magic-book/index.html', 'magic-book/index.html')} | Interactive Grade 3 & Grade 4 textbook storybook (\`?grade=3\` / \`?grade=4\`). |
| **🪄 Smart Board (AI)** | ${mdLink('smart-board/index.html', 'smart-board/index.html')} | Classroom interactive whiteboard & live teaching canvas. |
| **👑 Pharaoh Living Book** | ${mdLink('pharaoh-living-book.html', 'pharaoh-living-book.html')} | 3D pop-up living book covering Grade 3 Egypt Lessons 1–8. |

---

## 2. Timetable Teaching Catalog (${mdLink('js/timetable.js', 'timetable.js')} — ${data.curriculum.timetableCatalog.length} items)

| Catalog ID | Grade | Added | Route | Title |
| :--- | :---: | :---: | :--- | :--- |
${data.curriculum.timetableCatalog.map((c) => `| \`${c.id}\` | ${c.grade} | \`${c.added || '—'}\` | \`${c.route}\` | ${c.icon} ${String(c.title).replace(/\|/g, '·')} |`).join('\n')}

---

## 3. Registered \`GAMES_DATA\` Modules (${data.curriculum.gamesData.length} total in ${mdLink('js/games-data.js', 'games-data.js')})

### Grade 3 Modules (${g3.length})
${renderGdTable(g3)}

### Grade 4 Modules (${g4.length})
${renderGdTable(g4)}

### Shared / Multi-Grade Modules (${shared.length})
${renderGdTable(shared)}

---

## 4. Printable Word & PDF Lesson Plans (\`lesson-plans/\` — ${data.curriculum.lessonPlans.length} plans)

| Lesson Plan Stem | Grade | Word (\`.docx\`) | PDF (\`.pdf\`) |
| :--- | :---: | :---: | :---: |
${data.curriculum.lessonPlans.map((p) => `| \`${p.stem}\` | ${p.grade} | ${p.docx ? mdLink(p.docx, '📝 .docx') : '—'} | ${p.pdf ? mdLink(p.pdf, '📄 .pdf') : '—'} |`).join('\n')}
`;
}

function generateDoc06(data) {
  return `# 06 — Cloud Database, Storage Keys, Privacy & Full Git Folder Audit

> Back to ${mdLink('SITE_MAP.md', 'SITE_MAP.md')}

---

## 1. Pupil Privacy Architecture (\`AGENTS.md\` §8)

1. **Zero Real Pupil Names in Repo:** Public seed data in ${mdLink('js/school-store.js', 'school-store.js')} uses \`student-3a-224\` / \`Pupil 224\` placeholders.
2. **Real Names Only in Supabase (\`students\` table):** Loaded only after authenticated teacher sign-in (${mdLink('js/teacher-auth.js', 'teacher-auth.js')} + ${mdLink('js/school-cloud-sync.js', 'school-cloud-sync.js')}).
3. **AES-256-GCM Encrypted Private Bundle (${mdLink('js/private-data.js', 'private-data.js')}):**
   - Stores \`survey\` (All About Me), \`parentNotes\`, and \`birthdays\` as ciphertext.
   - Decrypted **in memory only** via \`EAAPrivate.load()\` using the key in Supabase table \`private_bundle_key\` (protected by RLS \`is_teacher()\`). Never written to \`localStorage\`.
4. **Avatar Filename Guard:** Currently **${data.git.untrackedRedactedAvatarCount}** untracked non-\`student-*\` file(s) exist locally in \`assets/avatars/\` and are redacted by \`build-site-map.js\`. **Never stage or commit them.**

---

## 2. Supabase PostgreSQL Tables (${data.cloud.supabaseTables.length} referenced across JS & SQL)

| Table Name | Referenced In |
| :--- | :--- |
${data.cloud.supabaseTables.map((t) => `| \`${t.name}\` | ${t.files.map((f) => mdLink(f, path.basename(f))).join(', ')} |`).join('\n')}

### SQL Schema & Migration Files
| SQL File | Size | Tables Created |
| :--- | :---: | :--- |
${data.cloud.sqlFiles.map((s) => `| ${mdLink(s.path, s.path)} | ${s.kb} KB | ${s.tables.map((t) => `\`${t}\``).join(', ') || 'Policies / Storage / Functions'} |`).join('\n')}

${data.cloud.supabaseRpcs.length > 0 ? `### Supabase RPC Functions
| RPC Name | Called From |
| :--- | :--- |
${data.cloud.supabaseRpcs.map((r) => `| \`${r.name}\` | ${r.files.map((f) => mdLink(f, path.basename(f))).join(', ')} |`).join('\n')}
` : ''}

---

## 3. Browser \`localStorage\` & \`sessionStorage\` Keys (${data.cloud.storageKeys.length} keys)

| Storage Key | Used In |
| :--- | :--- |
${data.cloud.storageKeys.map((k) => `| \`${k.key}\` | ${k.files.slice(0, 4).map((f) => mdLink(f, path.basename(f))).join(', ')} |`).join('\n')}

---

## 4. Custom DOM Events (${data.cloud.customEvents.length} events)

| Event Name | Dispatched / Listened In |
| :--- | :--- |
${data.cloud.customEvents.map((e) => `| \`${e.event}\` | ${e.files.map((f) => mdLink(f, path.basename(f))).join(', ')} |`).join('\n')}

---

## 5. Complete Root Directory & Git Safety Classification (${data.curriculum.rootInventory.length} entries)

> **Why \`git add -A\` is forbidden:** Entries marked \`MISSING LOCALLY (GIT DELETED)\` exist on the live published site (\`main\` / \`gh-pages\`) but were cleaned from this local disk. Running \`git add -A\` would delete them from the live school website!

| Name | Kind | Local? | \`GAMES_DATA\` | \`404.html\` | Git / Privacy Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
${data.curriculum.rootInventory.map((r) => `| \`${r.name}${r.isDir ? '/' : ''}\` | ${r.kind} | ${r.exists ? '✅' : '❌'} | ${r.inGamesData ? '✅' : '—'} | ${r.in404 ? '✅' : '—'} | **${r.safetyTag}** | ${r.safetyNote.replace(/\|/g, '·')} |`).join('\n')}
`;
}

// ---------------------------------------------------------------------------
// 10. Privacy Verification Guard + Write & Mirror Output
// ---------------------------------------------------------------------------
function assertZeroPrivacyLeak(fileLabel, content) {
  if (PRIVATE_TOKENS.size === 0) return;
  const lower = content.toLowerCase();
  for (const tok of PRIVATE_TOKENS) {
    // Check if `<tok>-1-` or `avatars/<tok>` leaked
    if (lower.includes(`avatars/${tok}`) || lower.includes(`${tok}-1-`) || lower.includes(`${tok}-2-`)) {
      throw new Error(`PRIVACY GUARD TRIPPED in ${fileLabel}: detected redacted token "${tok}"!`);
    }
  }
}

function writeAndMirror(relPath, content) {
  assertZeroPrivacyLeak(relPath, content);
  const fullRoot = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullRoot), { recursive: true });
  fs.writeFileSync(fullRoot, content, 'utf8');

  if (fs.existsSync(MIRROR)) {
    const fullMirror = path.join(MIRROR, relPath);
    fs.mkdirSync(path.dirname(fullMirror), { recursive: true });
    fs.writeFileSync(fullMirror, content, 'utf8');
  }
}

function mirrorExistingIfPresent(relPath) {
  const fullRoot = path.join(ROOT, relPath);
  if (!fs.existsSync(fullRoot) || !fs.existsSync(MIRROR)) return;
  const fullMirror = path.join(MIRROR, relPath);
  fs.mkdirSync(path.dirname(fullMirror), { recursive: true });
  fs.copyFileSync(fullRoot, fullMirror);
}

function main() {
  const t0 = Date.now();
  const git = scanGitStatus();
  const indexHtml = parseIndexHtml();
  const navigation = parsePlatformNavigation();
  const { jsModules, cssModules } = scanAllJsAndCss(indexHtml.scripts, indexHtml.cssLinks);
  const gameMaker = scanGameMaker();
  const curriculum = scanCurriculumAndFolders(git);
  const cloud = scanAvatarsAndCloud(jsModules);
  const quickTasks = buildQuickTasks();

  const bundle = {
    generatedAt: new Date().toISOString(),
    summary: {
      places: navigation.places.length,
      switchViews: navigation.switchRoutes.length,
      modals: indexHtml.modals.length,
      jsFiles: jsModules.length,
      cssFiles: cssModules.length,
      gmModes: gameMaker.modes.length,
      gmSets: gameMaker.sets.length,
      gamesDataEntries: curriculum.gamesData.length,
      lessonPlans: curriculum.lessonPlans.length,
      supabaseTables: cloud.supabaseTables.length,
      storageKeys: cloud.storageKeys.length,
      rootEntries: curriculum.rootInventory.length
    },
    quickTasks,
    navigation,
    indexHtml,
    jsModules,
    cssModules,
    gameMaker,
    curriculum,
    cloud,
    git: {
      modifiedCount: git.modifiedFiles.length,
      modifiedFiles: git.modifiedFiles,
      untrackedSafe: git.untrackedSafe,
      untrackedRedactedAvatarCount: git.untrackedRedactedAvatarCount,
      deletedTopFolders: git.deletedTopFolders
    }
  };

  writeAndMirror('SITE_MAP.md', generateMasterSiteMapMd(bundle));
  writeAndMirror('docs/map/01-platform-screens-and-dom.md', generateDoc01(bundle));
  writeAndMirror('docs/map/02-core-js-and-monoliths.md', generateDoc02(bundle));
  writeAndMirror('docs/map/03-avatars-monsters-and-store.md', generateDoc03(bundle));
  writeAndMirror('docs/map/04-game-maker.md', generateDoc04(bundle));
  writeAndMirror('docs/map/05-lessons-island-and-curriculum.md', generateDoc05(bundle));
  writeAndMirror('docs/map/06-cloud-storage-and-privacy.md', generateDoc06(bundle));

  const dataJs = `/* Auto-generated by tools/build-site-map.js — DO NOT EDIT BY HAND */\nwindow.EAA_SITE_MAP = ${JSON.stringify(bundle, null, 2)};\n`;
  writeAndMirror('site-map/data.js', dataJs);

  // Mirror generator & UI files if they exist
  mirrorExistingIfPresent('tools/build-site-map.js');
  mirrorExistingIfPresent('site-map/index.html');
  mirrorExistingIfPresent('site-map/style.css');
  mirrorExistingIfPresent('site-map/app.js');

  const elapsed = Date.now() - t0;
  console.log(`[build-site-map] Done in ${elapsed}ms!`);
  console.log('  Summary:', JSON.stringify(bundle.summary));
  console.log(`  Privacy Guard: ${git.untrackedRedactedAvatarCount} pupil-named file(s) redacted; 0 leaks.`);
}

main();
