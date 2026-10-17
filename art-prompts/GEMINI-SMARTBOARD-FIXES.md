# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are working on **English Adventure Academy** in `C:\Users\maysa\Desktop\DV\` (vanilla JS, no frameworks, no build step). The teacher (Mr. Maysam) teaches Grade 3 and 4 live on a **classroom smartboard**: pupils come up and tap with a finger, so everything must be big, tactile and keyboard-free. Do ALL tasks below by yourself. Do not ask questions; if something is unclear, choose the simplest safe option and tell me in the final report.

## Hard rules (read first)
1. **Another agent (Claude) also edits this repository.** Before you start, run `git status` and `git pull` is NOT needed (single local copy), but only change the files named in each task. Never reformat, rename, or "clean up" other code. Never revert changes you did not make.
2. **Never commit or push before testing.** Test only through the safe harness `_tmp/safe-cdp.js` (it blocks every cloud write). Never click +1/+5/+10, Give coins, Save, Delete, or anything that changes real pupil data on the live site. XP-giving buttons may only be tested inside the safe harness and the XP you add must be removed again (or use a throwaway class). Never type or print the teacher password.
3. **No deductions, no shaming.** No feature may take XP away or name a pupil as "the one who made noise" on the big screen.
4. **Style:** 60-30-10 cyber-glass (obsidian `#060911`, glass `rgba(15,23,42,.8)` with blur, accents cyan `#38bdf8`, amber `#f59e0b`, emerald `#10b981`). Every button: tactile 3D, `border-bottom:5px solid <darker>`, presses 4px down on `:active` with `cubic-bezier(.175,.885,.32,1.275)`. Minimum tap target 56px on the smartboard views. No raw beeps: any new sound is a soft chord via the existing audio helpers. No `undefined`/`NaN`/`null` in visible text.
5. **Mirror law:** every file you change in the root must be copied to `monster day\story\mouse\pokemon\firefighter\NH\<same relative path>` (use `git add -f` for js there). Then `node --check` every touched `.js` in BOTH places.
6. Bump the `?v=` number of each touched script in `index.html` (and its mirror).
7. Write patch scripts with your file tools, not long shell heredocs with quotes (quoting breaks on Windows). Keep Windows CRLF line endings in files that already use them.

## Tasks

### 1. Sleepy Mio launcher everywhere on the smartboard
Files: `js/class-board.js`, `js/class-view.js`, `js/class-mode.js`.
- `SleepyMonster.open()` (in `js/sleepy-monster.js`, do not edit that file for this task) must be reachable in ONE tap from: the **Class Board bottom dock** (`.cb-dock`), the **Class View** tiles, and the **Class Mode left picture rail** (`.cm-rail`). Add a big **😴 Sleepy Mio** button/tile in each, matching that screen's existing look.
- **Class View:** in Class Mode it currently shows one lonely "Home view" tile. Replace that with a balanced row of launch tiles: 📺 Scoreboard, 😴 Sleepy Mio, 🎲 Pick a Pupil, 🏠 Home view (add 🎤 Karaoke only if a Karaoke opener already exists in the code).

### 2. Unlock lands on Command Center
File: `index.html` (around the unlock code, search for `switchView('dashboard')` near the top) and, if needed, `js/school-app.js`.
- After the password is accepted, open `'classview'` if Class Mode is on, otherwise `'command'`. Respect a URL hash if one was given. The old Classic Dashboard must no longer be the landing page.

### 3. Dock never covers the last rows
File: `css/school-platform.css` (or the CSS file that styles `#app-view-container`).
- Add bottom padding (about `110px`) to the main view container so the floating `.classroom-unified-dock` never hides the last pupil row in Command Center, the last cards on the Class Board, or the end of any list.

### 4. Classroom Store (Rewards) layout
File: `js/class-rewards.js` (and `js/school-app.js` only if the store view is built there).
- The first screen of the Store currently shows "Reward requests" and a 17-row **Worksheet coins** table of 0-10 buttons. Pupils watching the board can't see the prizes.
- Show the **shop and prizes first**. Move the Worksheet-coins table and the reward-request list into a collapsed **teacher drawer** opened by a button "📄 Worksheet coins (teacher)". Keep all existing buttons and behaviour inside it unchanged.

### 5. Group Maker without prompt()
File: `js/class-board.js`.
- `ClassBoard` uses `window.prompt('How many groups?')`. Replace it with a modal of big 3D number buttons **2, 3, 4, 5, 6**. Tapping one makes the groups exactly as before.

### 6. Fair pick, Pick 2, winner buttons
File: `js/class-board.js`.
- **Fair queue:** the 🎲 Pick button must not pick a pupil twice until every PRESENT pupil has been picked once (keep the "hat" only in memory for this session). Add a small **↺ Reset hat** button and show "x of y picked".
- **Pick 2:** add a **⚔️ Pick 2** button that picks two different present pupils (from the same hat) and shows both monsters side by side facing each other, with one **Award both +5** and one **Award both +10** button.
- **Winner popup (single pick):** three big buttons: **⭐ +5**, **🌟 +10**, **🔄 Pick another**. Awards must go through the same function the +5/+10 buttons already use (so XP, dates and the cloud queue are handled in one place). Never change how XP is saved.

### 7. Monster tap on the Class Board
File: `js/class-board.js`.
- Today tapping a pupil's monster toggles absent/present, which children trigger by accident. Change it: tapping the **monster** only plays a small bounce and a soft sound. Absent/present moves to a small **✓ / Away** pill in the card's top-left corner (still one tap, but a deliberate one).

### 8. Whole-class "quiet reward" inside Sleepy Mio
File: `js/sleepy-monster.js` only for this task.
- While Mio is asleep, show a small **⭐ Reward the quiet class** button (whole class, no names) and a **🌙 Quiet streak** timer (mm:ss of how long Mio has stayed asleep without stirring; it resets when he stirs or wakes).
- Pressing the button gives **+5 XP to every present pupil of the active class**, reason `Quiet class reward`, category `positive`, through the same XP function the Class Board uses. Mio shows `mio-calm-happy.webp` for 3 seconds with sparkles and a soft chord. Allow it at most once per 60 seconds (button greys out with a countdown).
- Keep the existing private teacher note panel exactly as it is. Do NOT add any list of pupils to the main screen.

### 9. Header: trim "+ Create" and tuck the role pills away
Files: `index.html` (header) and `js/school-app.js` (only the code that handles those buttons).
- **+ Create menu:** keep exactly three actions: **📅 Edit Timetable**, **⭐ Give Class XP**, **😴 Sleepy Mio**. Remove the other items from the menu (do NOT delete their modals or functions, just the menu entries).
- **Role pills (Teacher | Student | Parent):** replace the three pills with ONE small button **👁 View as ▾** that opens a little menu (Teacher, Student, Parent). The Parent view and the Student view must still work exactly as before (the parent report page "Çocuğum · My child" is reached this way). Teacher stays the default and the button must be small and not in the way of the smartboard.

## What NOT to touch
`js/command-center.js`, `js/pupil-profile.js`, `js/parent-report.js`, `js/quiz-results.js`, the Support plan feature, XP history/saving code, cloud sync code, and the menu-hiding lists `HIDDEN_MENU_VIEWS` / `HIDDEN_DOCK_TOOLS` in `js/school-app.js`.

## Testing (required, in the safe harness at 1920x1080 and 1366x768)
For every task: open the screen, take a screenshot, read it, and confirm: no console errors, no overlap with the dock, no `undefined`/`NaN`. Specifically test: Sleepy Mio opens from the Class Board dock, Class View and Class Mode rail; unlock opens Command Center; Store shows prizes first and the drawer opens; group buttons make 2-6 groups; the fair queue never repeats a pupil until the hat is empty; Pick 2 gives two different pupils; tapping a monster does not mark absent but the pill does; the quiet reward gives +5 to present pupils only once per 60 seconds (undo that test XP afterwards); View as ▾ still opens the Student and Parent views.

## Finish
1. Mirror, `node --check` both copies, bump `?v=`.
2. Commit in small conventional-commit commits (`feat:`/`fix:`), push `main`, then merge into `gh-pages` and push it (use a temporary worktree for gh-pages).
3. Final report in plain English: what you did per task, what you tested, what you could NOT test (real microphone, real touch, sound), and anything you decided yourself.
