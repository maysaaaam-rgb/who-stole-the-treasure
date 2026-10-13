# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are a senior children's game designer, game programmer and primary ESL teacher. You built "Alley Fling: Cats vs Dogs" in `C:\Users\maysa\Desktop\DV\unit2-throw\index.html`. Right now it is a thin prototype: one throw type, one question type, one background. I want a **FULL, deep, replayable game** whose gameplay, mechanics and effects are as fun as a real mobile cartoon game, where **every part of the fun is powered by English practice** (Unit 2, Grades 3 and 4, level A1). Work through the whole job by yourself without asking me questions. I am away. If something fails, fix it, note it in the log, and continue.

**Order of work:** If `unit2-throw\PROGRESS.txt` shows the separate visuals job (`GEMINI-THROW-GAME-VISUALS.md`) has been done, build on top of it and keep its look. If it has not been done yet, do this gameplay job first, but keep all colours, sizes and layout easy to restyle later (use CSS variables and clean, separate functions for drawing). Never undo or break the work of the other job.

## Hard rules
- You may ONLY edit/create files inside `C:\Users\maysa\Desktop\DV\unit2-throw\`. Do NOT touch any other file or folder. **Do NOT write to the `monster day\...\NH` mirror folder.** Do NOT run git. Do not edit `js/games-data.js` (I add the library card myself).
- Keep this fix: `#screen-game` must NEVER have `position: relative` (it overrides `.screen { position:absolute; inset:0 }` and collapses the whole screen to 0px).
- One smartboard, no pupil devices, no keyboard. Everything is tapped on the board by the teacher or a pupil. No Turkish anywhere. Pupils are shown by first name only.
- Kind and friendly only: funny, never scary or violent. Nobody is punished: no points are ever subtracted for a wrong answer; a wrong answer only costs the chance to throw. No "kill / die / dead / hurt / weapon" words.
- Pure HTML/CSS/JS in `index.html` (you may add `data.js`/`extra.js` in `unit2-throw/` if the file gets too big). No libraries, no internet. Audio = chords only (no raw single beeps, copy the `chord()`/`sfx()` approach already in the file and in `unit2-arcade/index.html`). Speech = `rate 0.88, pitch 1.05, lang en-US`. Audio and speech start only after the first tap.
- Re-use my data, do not copy it: `../bamboozle/data.js` (`BQ`), `../unit2-arcade/data.js` (`ARC`). Study their structure first. Re-use my reaction stickers `../bamboozle/memes/<animal>_<face>.webp` as already done.

## PART 1: The English practice engine (this is the heart of the game)
The throw must be **earned** with English. Add many question types, so the class practises every skill, and make the *type of English task* change the *type of throw*. Teachers choose which types are on.

1. **Listen and choose** (the sentence is spoken, pupils pick the picture or the word). Reward: a **Fish/Bone throw** (normal).
2. **Word to picture / picture to word** (from `ARC[grade].words` with emoji). Reward: a **Quick throw** (a smaller object, faster, harder to dodge).
3. **Sentence builder** (tap the word tiles in the right order, like `order` questions in `BQ`; build a proper tile UI with big tiles, undo and clear buttons; accept exactly the right order; a second try is allowed). Reward: a **Big throw** (a bigger object that has a larger hit area and does 35 damage).
4. **Spelling builder** (a picture is shown, the word is shown as blanks `_ _ _ _`, pupils tap letter tiles that include the right letters plus 2 to 3 extra letters; on-screen letter tiles, no keyboard). Reward: a **Curve throw** (the flight has a gentle curve; the aim preview line shows it).
5. **Speak it!** (the card shows a sentence or a picture prompt such as "Say a sentence with *harvest*". The pupil speaks aloud, and the teacher taps ✅ "Good English!" or 🔁 "Try again" (never a harsh red; "Try again" is a soft blue). A ✅ gives a **Rainbow throw** (hits for 40 and charges a bonus). This is the highest value task and appears roughly once every 5 turns.)
6. **True or false / "Which is correct?"** sentence-grammar question (use the grammar items already in `BQ`: has got/have got, there is/there are, so they can, instead of, past tense, etc.). Reward: a **Shield-breaker** (also breaks the other side's shield).
7. **Reading mini-question** (a one-sentence passage and a question; large readable text).

Rules for tasks:
- Every task has one correct answer, a second try, a spoken hint on the second miss (read the correct answer aloud kindly) and a coloured "skill" tag so pupils know what skill it is.
- Pick tasks by difficulty ramp (see Part 4). Never repeat a task in one game until the bank is used up. Shuffle options and keep the right answer position random.
- If a bank for a type is empty, skip that type silently.
- Build **extra question banks** in a new file `unit2-throw/extra.js` ONLY from words and sentences already present in my data (`ARC`, `BQ`). Never invent facts about the textbook. Generate spelling, picture-word, builder and speaking prompts from `ARC[grade].words` (word `w`, emoji `e`, definition `d`, example sentence `x`). Check that every generated task is correct, has no duplicate options and no `undefined`.
- **Mastery tracking:** keep a per-word and per-skill record of first-try correct, second-try correct, missed. This feeds the end screen (Part 6).

## PART 2: Throwing mechanics (make the physics feel great)
- Keep the angle + power aim. Add: **drag-to-aim** with a rubber-band pull back on the character, **angle snap** helpers, and a **dotted preview arc** that shows only part of the flight and fades (the rest must be judged by the pupil).
- **Object types** (each a different look, flight and effect), unlocked by the task type that earned it: Fish/Bone (normal), Quick (small, fast), Big (large and slow, bigger hit area), Curve (gentle curve), Rainbow (glowing, leaves a rainbow trail, hits harder and can bounce once off the fence top), Shield-breaker (sparkling).
- **Bounce physics:** a throw that hits the ground in front of the fence can **bounce once** (a funny boing) and sometimes still hit. A throw that clips the top of the fence deflects with a clang-less friendly "tink". Add a tiny random wobble for liveliness but keep it fair and repeatable: a good throw must always be possible at every wind and fence height.
- **Hit zones:** head = 30, body = 25, feet/graze = 10. Show which zone you hit with a different silly effect. Normal damage values are shown above; the Double doubles them.
- **Dodge:** the defending character does a small funny hop or duck animation just before impact (cosmetic only, it never changes the result).
- **Wind:** changes each turn with a flag/windsock, blowing leaves, and strong "gust" turns that are announced by a banner ("Windy turn! 🌬️").
- **Fence:** moves up and down with the level; some levels have a **moving obstacle** (a bird flying across the middle, a washing line, a kite) that a throw can bounce off in a funny way, or a **trampoline** that sends it higher. Hazards never harm characters.
- **Mystery crate:** every few turns a crate drops in the middle of the alley. Hitting it gives the thrower a random friendly bonus (extra Double, a Shield, free refill of 20 Energy, "Wind off" for one turn, a "Triple throw" next turn).

## PART 3: Power-ups, combos and the team feel
- Each team has: **×2 Double**, **🛡️ Shield**, plus new friendly helpers:
  - **🎤 Ask the class** (once per game): the class whispers the answer, the thinking time is extended and one wrong option is removed (for choose-type questions) or an extra hint line appears.
  - **⭐ Teammate boost** (earned by a 3-streak, once per game): the next pupil on the same team gets an extra try at the question.
  - **🍀 Lucky wind** (earned by a perfect 5-streak): the next throw ignores the wind.
- **Combos:** a streak of correct first-try answers fills a "Combo meter" (3 = +5 bonus damage, 5 = rainbow trail, 7 = "SUPER STREAK" with confetti). The streak is lost only when the team misses, never as a punishment, just a reset.
- **Comeback help (important for fairness):** if a team is behind by 50 or more Energy, it gets a gentle assist: a slightly larger hit area for the next 2 throws and a free Double. Show it kindly ("Super comeback power! 💪"). Never show anything that makes the losing team feel bad.
- **Taunts and emotes:** after a hit, the characters show a funny emote (laugh, shocked, cool, celebrate, oops) using the existing reaction sticker pictures, with Impact-style captions that rotate (not too frequent).

## PART 4: Levels, arenas and game modes
- **Arenas by theme** (the arena changes as the game goes on or by the teacher's choice; build each with CSS layers and optional `art/bg_<name>.webp` pictures, with a good fallback):
  1. **Alley** (default).
  2. **Harvest field** (Grade 3 Unit 2: Chuseok, harvest, crops, greenhouse): hay bales, a scarecrow, a greenhouse in the distance.
  3. **Forest** (Grade 4 Unit 2: forests and animals): tall trees, a log fence, mushrooms, a river in the back.
  4. **Moon night** (a fun bonus arena with a big moon, for the Chuseok full moon): lanterns, stars.
  5. **Rainbow rooftop** (a final celebration arena).
- **Difficulty ramp (turns):** 1 to 3 easy tasks, a short fence, weak wind; 4 to 8 medium, taller fence, a moving obstacle appears; 9+ hard tasks, tallest fence, gusts, the Speak it! task. Show the level change with a fun banner.
- **Game modes** (settings screen, kid-friendly big chips):
  1. **Team Battle** (Cats vs Dogs, the main mode, Energy bars).
  2. **Friendly Co-op**: the whole class vs the **Big Bin Monster**, a silly, friendly, round raccoon-like boss ("Bin Boss") that the class defeats together by earning throws; the boss does nothing mean: it tosses harmless banana peels at the class and its Energy bar drops as the class earns hits. Boss has 3 phases (each uses harder English tasks). Everyone is a winner at the end.
  3. **Quick Quiz Fling**: 5-minute mode with a visible timer; the team with the most hits wins.
  4. **Practice** (no scores, teacher picks the skill, unlimited tries).
- **Length:** Short, Normal, Long as before, with a round limit. A game must always end.
- **Teams:** keep the roster logic (first names, random split, mix again, type names). Add a **Pupil of the turn** wheel: before a question a fun name picker highlights the next pupil on that team, so everyone plays.

## PART 5: Effects, juice and feedback (make every action feel good)
Build all with CSS animations, canvas particles and Web Audio. Keep them light (60 fps on a school PC).
- Flight: spin, squash and stretch, a motion trail, a whoosh, tiny sparkles. On a hit: freeze for 80 ms (hit-stop), a squash on the target, a "BONK!/BOING!/SPLAT!" comic bubble, a stars burst, a short gentle screen shake, a cream or confetti splat, a funny boing-bonk chord.
- On a miss: a dust puff, a bounce, a soft thud and "So close!" with a gentle sad-trombone-free chime (never a buzzer).
- Energy bar: smooth drain animation, a glow when low, and a happy bounce when refilled.
- Streak/combo: flame icon that grows, "COMBO ×3" popups, fireworks on the highest tier.
- Turn banner swoosh, level-up banner, confetti on a win, victory fanfare chord.
- **Slow-motion replay** of the winning hit (re-play the last throw once at 0.5 speed with a "Replay!" label) and a short **"Hit of the game"** callout at the end.
- Optional soft music loop (chord pad) with a light drum-free groove that speeds up a little when Energy is low. Off by default. Sound on/off must silence speech too.
- Respect `prefers-reduced-motion`: a **Calm mode** toggle in settings that turns off shakes and heavy flashes.

## PART 6: The teacher's toolbar and the end screen
- A small, tidy **teacher toolbar** (a tray that does not cover the scene): ⏸ Pause, ⏭ Skip question (no penalty), ⏪ Back to the question, 🔄 Re-roll the question, ➕ Give +1 star / bonus, ⏱ optional timer per turn (off, 20 s, 40 s), 👥 swap a pupil, and 🔇 mute.
- **End screen:**
  - Winners shown with confetti, both teams cheer, "Everyone played well!".
  - **Skill report** (kind and clear): for each skill tag (Listening, Words, Sentences, Spelling, Speaking, Grammar, Reading) show a big happy bar of how many were right the first time. Highlight the best skill ("Super at Listening!").
  - **Words to practise next:** list up to 6 words or sentences the class missed most, each with a 🔊 button that reads it aloud. (This reuses the weak-skills idea from `bamboozle/index.html`.)
  - **Stars earned** and a fun badge for the class (e.g. "Word Wizards", "Sentence Builders", "Super Speakers").
  - Buttons: Play again (same settings), New game, Practise the missed words (starts Practice mode with only those items).
- Optional: if the page was opened from the platform (`window.opener && window.opener.schoolStore`), you may show the winning team's names for the teacher to award XP by hand. Do NOT award XP automatically and do not write to the store.

## PART 7: Polish and robustness
- Settings are remembered between games in `localStorage` (inside try/catch), including grade, length, mode, task-type switches, calm mode and sound.
- Works with a finger on a touch board and with a mouse. Minimum touch target 56 px. All text readable from 8 metres. No page scrolling.
- Must work and look right at **1920×1080, 1134×417 (very wide and short), 1024×600, 800×520 and 1134×914**.
- Never show `undefined`, `null` or `NaN` anywhere. Guard all dynamic text.
- No console errors. The game can always be finished and can always be quit.
- Keep the code tidy and commented in plain English so a teacher-developer can edit it.

## Quality bar: do not report "done" until all of this is true and really tested
1. `node --check` (or `new Function`) on every script in the page and on `extra.js`.
2. A Node script that unit-tests: the physics at all wind values and fence heights (a good throw always possible; a bad throw always misses; the bounce never traps the object), the damage maths and zone hits, the combo meter, the comeback assist, the turn engine and the winner logic including a draw, and the boss phases. Print real results.
3. A Node script that validates **every generated task** in every bank for both grades: one correct answer, the answer present in the options, no duplicate options, no empty text, spelling tasks have the right letters, builder tasks have the right order. Print counts per type and per grade, and fail loudly on any bad task.
4. **Run the game in a real browser** (a local web server plus any browser automation you can run). Take screenshots of: the settings screen, each of the 7 task types, the aiming screen, a flight with the trail, a hit, a miss, a bounce, the crate bonus, the boss mode, the teacher toolbar and the end screen with the skill report. Do this at **1134×417** and **1920×1080** at least and look at every screenshot carefully. Fix every overlap, cut-off, tiny text and hidden button you find. Save them in `unit2-throw\screens\` and list them.
5. By script, check with `document.elementFromPoint` at the centre of every visible button, at all five screen sizes, that none is hidden, covered or off-screen.
6. Play, by automated clicks, at least 2 full games in each of the 4 modes and both grades, and confirm that each finishes, the Energy stays within 0 to 100, there are no console errors and no `undefined`, `null` or `NaN` on screen.
7. Scan the whole page and all data for Turkish text: there must be none.
8. Update `unit2-throw\README.txt` (how to play, the task types, the modes, the list of optional art files and sizes, and how to edit banks) and append to `unit2-throw\PROGRESS.txt`.

## Final report (short and honest)
Tell me: (1) what you built, part by part (1 to 7), (2) the real test results, (3) the screenshots you took and what you fixed because of them, (4) anything you skipped, simplified or could not test, and why, (5) any art files I could add later. Do not claim a test passed unless you really ran it. If you ran out of time on something, say so plainly and leave the game in a working state.
