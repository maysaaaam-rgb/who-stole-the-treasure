---
name: new-lesson
description: Build a new 35-minute teacher-led smartboard lesson for English Adventure Academy (Grade 3 or 4): story, four team games, teacher tips, real pictures, registered in the library, timetable and Today list, with a Word + PDF lesson plan. Use when the teacher asks for a new lesson, "a lesson for tomorrow", or lessons from book pages / curriculum outcomes.
---

# New smartboard lesson

The teacher teaches Turkish pupils, Grades 3 and 4 (classes 3A, 3B, 4A, 4B), level A1/A1+, 35-minute lessons, ONE smartboard, four teams. Build lessons like a pro kids' platform: a story, lots of games, meaningful input, real pictures.

## Rules (never break)
- English only on every screen. No Turkish. No translation. No copied textbook text or illustrations; no song lyrics.
- Pupils shown by first name only on kid-facing screens.
- Speaking before writing; movement, TPR, touch/drag, puppets, team games. At least 4 games (one per ~6-8 minutes), mini-whiteboards only as an extra.
- Scene minutes must add up to exactly 35. Book pages unknown = write "p. ___" in tips and plans, never invent.
- Soft fail only: wobble + supportive voice, no buzzers, no point deductions.
- Audio only after the first user gesture; TTS rate 0.88, pitch 1.05, en-US; synthesized chord sounds (no raw beeps).
- Never push. Pushing is the `push-live` skill and only after the teacher says "push it".

## Steps
1. **Ask only what you need** (lesson topic/outcomes, how many lessons, page numbers if known). Reuse the teacher's answers; do not re-ask settled choices.
2. **Pictures first:** use the `art-prompt` skill, short batch (about 14 pictures). If Gemini is unavailable the lesson still works with emoji (missing picture falls back to the emoji).
3. **Build from the existing module shell** (do not invent a new architecture):
   - Data: `week4-g3-daphne/js/data.js` / `week4-g4-captain-quiet/js/data.js` show the data shape.
   - Scenes: `_tmp/w4g3-scenes.js` / `_tmp/w4g4-scenes.js` hold the scene functions and the `LESSONS` object (`title, missions, door, scenes[{t, mins, mode, run, intro, kids{steps,say}, tip[]}]`).
   - Assemble with `node _tmp/w4-build.js` (it copies the shared shell from `unit3-g3-lessons/js/app.js` and wraps your scenes). Put the new module in its own folder (index.html, css/ style.css lesson.css g3.css w4.css, js/ data.js app.js audio.js, art/ with manifest.json).
   - Reusable scene helpers: hookPrompts (briefing), runStory (act-it-out story), walkScene, l2Words (word cards + clue game), timerBtn, pointsRow, gameFinish (podium), wrapStart/wrapScreen.
   - Pictures: `fill(el, emoji, cls, artName)`; `art/manifest.json` lists the pictures that exist.
4. **Process pictures:** `python _tmp/u3-process.py` pattern (cut out the grey #e8e8e8 background for objects and characters with `_tmp/process_cut.py cut_rgba`, resize backgrounds and scenes to 1280 wide, write webp + `manifest.json`).
5. **Register** (explicit, small edits): `js/games-data.js` entry (copy an existing entry, e.g. with a Node script like `_tmp/add-w4-entries.js`), id in `js/unit2-content.js`, `js/timetable.js` CATALOG, Today lessons list and `LESSON_PLANS` in `js/school-app.js`. Bump the `?v=` numbers in `index.html` for every changed script.
6. **Lesson plan (Word + PDF):** copy the pattern in `_tmp/make-w4-plans.js` (docx via the scratchpad `node_modules`, PDF via Chrome headless). Every activity names a book page ("p. ___" if unknown) and an outcome "Students will be able to ...". Timings add to 35. Plans go to the principal.
7. **Test** with the `safe-test` skill: every scene loads, no `undefined`/`NaN`, every game plays once, screenshots look right at 1366x768.
8. Report what was built and what is missing. Wait for "push it".
