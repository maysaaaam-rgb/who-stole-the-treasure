#!/usr/bin/env node
/**
 * tools/check-site.js
 * Plain Node.js site health & safety checker for English Adventure Academy.
 * Uses only Node's built-in modules.
 *
 * Usage:
 *   node tools/check-site.js        # Local check (prints note for forbidden folders)
 *   node tools/check-site.js --ci   # CI check (fails if any forbidden folder has files)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const IS_CI = process.argv.includes('--ci');

const TOP_LEVEL_FORBIDDEN = new Set([
  '_tmp',
  'unit3-work',
  'week4-work',
  'platform-work',
  'revision-work',
  'unit2-work',
  'voice-test',
  'island-work',
  'monster day'
]);

const LEGACY_NEW_FOLDERS = new Set([
  'assets/monsters/auras-new',
  'assets/monsters/backgrounds-new',
  'assets/monsters/ui-new',
  'bamboozle/memes-new',
  'unit2-forest-lessons/art-new',
  'unit2-g3-lessons/art-new',
  'unit2-throw/art-new'
]);

const SECRET_EXTENSIONS = new Set(['.js', '.html', '.json', '.md', '.txt', '.yml']);
const PAGES_TO_CHECK = ['index.html', '404.html', 'island/index.html', 'smart-board/index.html'];
const BIG_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

// Build regexes dynamically so this script does not match itself on literal strings
const SECRET_RULES = [
  { label: 'Google API key (AIza...)', re: new RegExp('AI' + 'za[A-Za-z0-9_-]{30,}') },
  { label: 'Google token (AQ....)', re: new RegExp('A' + 'Q\\.[A-Za-z0-9_-]{30,}') },
  { label: 'OpenAI-style key (sk-...)', re: new RegExp('(?:^|[^A-Za-z0-9_-])s' + 'k-[A-Za-z0-9_-]{20,}') },
  { label: 'service_role reference', re: new RegExp('\\bservice_' + 'role\\b') },
  { label: 'PRIVATE KEY block', re: new RegExp('PRIVATE ' + 'KEY') }
];

function isSkippedWorkDir(name) {
  if (name === '.git' || name === 'node_modules' || name === 'monster day' || name === '_tmp') {
    return true;
  }
  if (name.endsWith('-work')) {
    return true;
  }
  return false;
}

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

/**
 * Walk the repository skipping .git/, node_modules/, monster day/, *-work/, and _tmp/.
 */
function walkPublishedRepo(dir, relDir = '', results = { jsFiles: [], secretFiles: [], allFiles: [] }) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = relDir ? toPosix(path.join(relDir, entry.name)) : entry.name;

    if (entry.isDirectory()) {
      if (isSkippedWorkDir(entry.name)) continue;
      walkPublishedRepo(fullPath, relPath, results);
    } else if (entry.isFile()) {
      let size = 0;
      try {
        size = fs.statSync(fullPath).size;
      } catch (_) {}
      results.allFiles.push({ fullPath, relPath, size });

      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.js') {
        results.jsFiles.push({ fullPath, relPath });
      }
      if (SECRET_EXTENSIONS.has(ext)) {
        results.secretFiles.push({ fullPath, relPath });
      }
    }
  }
  return results;
}

/**
 * Count all files recursively inside a folder.
 */
function countFilesRecursive(dir) {
  let count = 0;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return 0;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFilesRecursive(full);
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

/**
 * Find forbidden folders anywhere in the repo (excluding .git and node_modules).
 */
function findForbiddenFolders(dir, relDir = '', list = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return list;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = relDir ? toPosix(path.join(relDir, entry.name)) : entry.name;

    const isTopForbidden = !relDir && (TOP_LEVEL_FORBIDDEN.has(entry.name) || entry.name.endsWith('-work'));
    const isNewFolder = entry.name === 'art-new' || entry.name.endsWith('-new');

    if (isTopForbidden || isNewFolder) {
      const fileCount = countFilesRecursive(fullPath);
      if (fileCount > 0) {
        list.push({ folder: relPath + '/', fileCount });
      }
      continue;
    }

    findForbiddenFolders(fullPath, relPath, list);
  }
  return list;
}

/**
 * Run async tasks with bounded concurrency.
 */
async function runPool(items, concurrency, workerFn) {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await workerFn(current);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const fails = [];
  const warnings = [];

  console.log('=== English Adventure Academy: Site Check ===');
  console.log(`Mode: ${IS_CI ? 'CI (--ci enabled)' : 'Local (without --ci)'}`);
  console.log('');

  const { jsFiles, secretFiles, allFiles } = walkPublishedRepo(ROOT);

  // 1. Syntax check on every .js file
  console.log(`[1/5] Checking JavaScript syntax (${jsFiles.length} files)...`);
  let syntaxFailCount = 0;
  await runPool(jsFiles, 16, (file) => new Promise((resolve) => {
    execFile(process.execPath, ['--check', file.fullPath], (err, _stdout, stderr) => {
      if (err) {
        syntaxFailCount++;
        const firstLine = (stderr || err.message || 'Syntax error').split(/\r?\n/).slice(0, 3).join(' | ');
        const msg = `FAIL [Syntax] ${file.relPath} — ${firstLine}`;
        fails.push(msg);
        console.log('  ' + msg);
      }
      resolve();
    });
  }));
  if (syntaxFailCount === 0) {
    console.log(`  OK: All ${jsFiles.length} .js files passed node --check.`);
  }
  console.log('');

  // 2. Secrets check
  console.log(`[2/5] Scanning for secrets (${secretFiles.length} text files)...`);
  let secretFailCount = 0;
  const selfRelPath = 'tools/check-site.js';
  for (const file of secretFiles) {
    if (file.relPath === selfRelPath) continue;
    let content;
    try {
      content = fs.readFileSync(file.fullPath, 'utf8');
    } catch (_) {
      continue;
    }
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const rule of SECRET_RULES) {
        if (rule.re.test(line)) {
          secretFailCount++;
          // Print ONLY file name and line number, never the matching text
          const msg = `FAIL [Secret] ${file.relPath}:${i + 1} (${rule.label})`;
          fails.push(msg);
          console.log('  ' + msg);
        }
      }
    }
  }
  if (secretFailCount === 0) {
    console.log(`  OK: No secret patterns found across ${secretFiles.length} files.`);
  }
  console.log('');

  // 3. Forbidden folders check
  console.log('[3/5] Checking forbidden folders...');
  const forbiddenFound = findForbiddenFolders(ROOT);
  if (IS_CI) {
    if (forbiddenFound.length === 0) {
      console.log('  OK: No forbidden folders with files found.');
    } else {
      for (const item of forbiddenFound) {
        const cleanFolder = item.folder.replace(/\/$/, '');
        if (LEGACY_NEW_FOLDERS.has(cleanFolder)) {
          const msg = `WARNING [Legacy -new Folder] ${item.folder} (${item.fileCount} files — scheduled for cleanup)`;
          warnings.push(msg);
          console.log('  ' + msg);
        } else {
          const msg = `FAIL [Forbidden Folder] ${item.folder} contains ${item.fileCount} file(s) and must never be published`;
          fails.push(msg);
          console.log('  ' + msg);
        }
      }
    }
  } else {
    console.log('  NOTE: Running without --ci; forbidden folders are allowed on the local computer and only fail with --ci.');
    if (forbiddenFound.length > 0) {
      console.log(`  NOTE: Found ${forbiddenFound.length} forbidden/work folder(s) locally: ${forbiddenFound.map(f => `${f.folder} (${f.fileCount} files)`).join(', ')}`);
    }
  }
  console.log('');

  // 4. Missing local files in key HTML pages
  console.log(`[4/5] Checking local src/href links in ${PAGES_TO_CHECK.join(', ')}...`);
  let missingLinkCount = 0;
  let checkedLinksCount = 0;
  const attrRegex = /\b(src|href)\s*=\s*(["'])(.*?)\2/gi;
  let gitTracked = new Set();
  if (!IS_CI) {
    try {
      const { execFileSync } = require('child_process');
      const out = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
      gitTracked = new Set(out.split(/\r?\n/).filter(Boolean));
    } catch (_) { /* ignore */ }
  }

  for (const pageRel of PAGES_TO_CHECK) {
    const pageFull = path.join(ROOT, pageRel);
    if (!fs.existsSync(pageFull)) {
      missingLinkCount++;
      const msg = `FAIL [Missing Page] ${pageRel} does not exist`;
      fails.push(msg);
      console.log('  ' + msg);
      continue;
    }

    const html = fs.readFileSync(pageFull, 'utf8');
    const pageDir = path.dirname(pageFull);
    let match;
    attrRegex.lastIndex = 0;

    while ((match = attrRegex.exec(html)) !== null) {
      const attrName = match[1];
      const rawUrl = match[3].trim();
      if (!rawUrl) continue;

      // Skip remote, data, anchor, mailto, javascript, blob, or protocol-relative URLs
      if (/^(?:https?:|data:|mailto:|#|javascript:|blob:|\/\/)/i.test(rawUrl)) {
        continue;
      }
      // Skip JS template literals inside inline scripts if any
      if (rawUrl.includes('${') || rawUrl.includes('{{')) {
        continue;
      }

      // Strip ?v=... query string and #... hash fragment
      const cleanRel = rawUrl.split('?')[0].split('#')[0].trim();
      if (!cleanRel) continue;

      checkedLinksCount++;
      const resolvedPath = cleanRel.startsWith('/')
        ? path.join(ROOT, cleanRel.slice(1))
        : path.resolve(pageDir, cleanRel);

      const resolvedRel = toPosix(path.relative(ROOT, resolvedPath));
      if (!fs.existsSync(resolvedPath) && !gitTracked.has(resolvedRel)) {
        missingLinkCount++;
        const msg = `FAIL [Missing File] ${pageRel} has ${attrName}="${rawUrl}" -> missing file: ${resolvedRel}`;
        fails.push(msg);
        console.log('  ' + msg);
      }
    }
  }
  if (missingLinkCount === 0) {
    console.log(`  OK: All ${checkedLinksCount} local links exist.`);
  }
  console.log('');

  // 5. Big files (> 8 MB)
  console.log('[5/5] Checking for files over 8 MB...');
  let bigFileCount = 0;
  for (const file of allFiles) {
    if (file.size > BIG_FILE_BYTES) {
      bigFileCount++;
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `WARNING [Big File > 8 MB] ${file.relPath} (${mb} MB)`;
      warnings.push(msg);
      console.log('  ' + msg);
    }
  }
  if (bigFileCount === 0) {
    console.log('  OK: No files over 8 MB.');
  }
  console.log('');

  // 6. Summary
  console.log('=== Summary ===');
  console.log(`Files checked : ${allFiles.length} total (${jsFiles.length} JS syntax, ${secretFiles.length} secret scan, ${checkedLinksCount} HTML links)`);
  console.log(`FAILs         : ${fails.length}`);
  console.log(`WARNINGs      : ${warnings.length}`);

  process.exit(fails.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Unexpected error in check-site.js:', err);
  process.exit(1);
});
