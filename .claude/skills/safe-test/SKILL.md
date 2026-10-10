---
name: safe-test
description: Test the English Adventure Academy platform or a lesson in the safe local browser harness (no cloud writes, no passwords), with before/after screenshots at laptop, tablet and large-display sizes. Use for any UI change, new lesson, or "test it".
---

# Safe platform test

The platform is real classroom data (pupil XP, cloud sync). On 2026-10-05 an unsafe test wiped XP. So:

## Hard rules
- Test only through `_tmp/safe-cdp.js` (blocks cloud writes; reads are allowed). Never write to the live cloud yourself; the teacher presses the buttons. Back up before any live data change.
- Never type the teacher password. The platform starts locked: in the harness call `t.removeLock()` and then `document.documentElement.classList.remove('platform-locked')`.
- Do NOT click things that change pupils' XP or data (+1/+5/+10, Give coins, Save worksheet, Create, Delete). Open modals only to look, then close.
- Pupil names appear in screenshots: do not paste them into public files.

## Setup
1. Server: `python -m http.server 8137` from `C:\Users\maysa\Desktop\DV` (check `curl http://localhost:8137/index.html` first).
2. Harness (Node): `const { open } = require('./safe-cdp.js'); const t = await open({ width, height, url, wait }); await t.ev('js expression'); await t.shot('name'); await t.close();` Screenshots land in `_tmp/shots/` (pass only the name, no folder or extension).
3. The main app is slow to boot: after `open`, poll until `typeof ClassMode` is an object and `#app-view-container` has more than 500 characters of HTML before calling `ClassMode.set(true)` or `switchView(...)`. Calling too early gives a blank page.
4. Between runs kill leftover test browsers (PowerShell: stop `chrome.exe` processes whose command line contains `remote-debugging-port`), otherwise `open` fails with "Cannot read properties of undefined (reading 'find')".
5. Keep shell snippets simple: write scripts with the Write tool, not long heredocs with `\n` escapes inside template strings.

## What to check
- Lessons (`week4-*/index.html?scene=N`, `W4Lessons.go(1, k)`): every scene loads, `oops` text absent, no `undefined`/`NaN`/`null` in the page text, images complete, each game played once, no console errors.
- Platform views (`switchView('classview'|'board'|'rewards'|'shelf'|'command'|'curriculum'|'library'|'worksheets'|'assignments'|'homework'|'store')`): content present, active rail item correct, class chips switch class, Teacher Mode (`ClassMode.set(false)`) still looks normal.
- Screenshots **before and after** a visual change at 1366x768, 1024x768, 820x1180 and 1920x1080; read them. Helpers: `_tmp/shoot-set.js <tag>` and `_tmp/shoot-pages.js <tag> view1,view2`.
- Report honestly what was tested and what was not (for example sound and real touch were not tested).
