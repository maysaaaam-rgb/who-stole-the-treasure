# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are an expert primary ESL curriculum auditor and editor (CEFR A1 to A1+, learners aged 8 to 10 whose first language is TURKISH). I teach Grade 3 (classes 3A, 3B, textbook Global Readings 2) and Grade 4 (classes 4A, 4B, textbook Global Readings 3) on my own web platform. Before I start Unit 2, I want you to READ the actual Unit 1 lessons, quizzes, games and worksheets that already exist in the platform, find everything wrong or weak, and give me exact fixes. Another AI (Claude) will apply your fixes, so be precise. Work through the whole job by yourself without asking me questions. I am away. If something fails, retry up to 3 times, note it in the log and continue.

## Hard rules
- READ-ONLY on the whole project. You may ONLY create files inside `C:\Users\maysa\Desktop\DV\revision-work\audit\` (create it if missing). Do NOT edit, move, rename or delete any other file. Do NOT run git. Do NOT run or install anything; just read files.
- Report only what you actually read. Quote the exact words of the problem (short quotes) and give file path and line number. If unsure, say "unsure".
- No student data is involved. Do not look at student names.

## What to read (all under `C:\Users\maysa\Desktop\DV\`)
A. The curriculum lessons, in `js\school-store.js`:
- Grade 3 Phonics Review and Unit 1: ids `lesson-gr2-p1`, `lesson-gr2-p2`, and `lesson-gr2-1-1` to `lesson-gr2-1-8` (lines about 1245 to 1491). Unit record `unit-gr2-1`.
- Grade 4 Literacy Review and Unit 1: ids `lesson-gr3-review...` and `lesson-gr3-1-1` to `lesson-gr3-1-8` (lines about 1876 to 2058). Unit record `unit-gr3-1`.
B. The quizzes in `js\school-store.js`: "Unit 1 Master Quest: The After-School Inventor" (about line 8947) and "Unit 1 Master Quest: Wonderland & Brain Lab" (about line 8867), and the "Unit 1 & 2 Vocabulary & Speaking Check" (search the file for that title). Read every question, option and correct answer.
C. The progress checks: `DEFAULT_PROGRESS_CHECKS` in `js\school-store.js` (line 6172 on) and `js\progress-check.js`.
D. The games and lessons for Unit 1 content. For each folder read `index.html`, `js\*.js` (data and app), `worksheet.html` if present, and `css` only if needed:
- Grade 3 content: `clara-inventor\`, `inventor-lab\`, `good-ideas-lab\`, `inventor-forge\`, `inventors-odyssey\`, `young-inventor\`, `monster-day\`, `phonics\`
- Grade 4 content: `alice-quest\`, `alice-wonderland\`, `alice-cards-4a\`, `alice-cards-4b\`, `alice-party-home\`, `brain-hackers\`, `brain\`, `brain-explorers\`, `freeze-game\`
(`brain\` and `monster-day\` contain big image or audio assets: do not open the binary assets, just check that the files the code refers to exist.)
E. The worksheet entries in `js\school-store.js` (search for "Ready to Print") for the same topics.

## What to look for
1. WRONG ANSWERS: quiz or worksheet answers that are incorrect, ambiguous (two correct options) or missing.
2. FACT ERRORS: wrong facts about Edison, Leonardo da Vinci, Karl Benz, biomimicry (Velcro, bullet train), neurons, brain lobes, Alice in Wonderland, anything else.
3. LEVEL PROBLEMS: sentences, instructions or vocabulary clearly above A1 (Grade 3) or A1+ (Grade 4), with a simpler rewrite.
4. LANGUAGE ERRORS: spelling, grammar, punctuation, unnatural English, inconsistent terms (for example First/Second/Third/Last versus First/Next/Finally; has got versus has; American versus British words).
5. CONFUSING TASKS: instructions a child could not follow, tasks that need audio or pictures that do not exist, questions with no answer in the text.
6. BROKEN REFERENCES: images, audio, scripts or links the code refers to that do not exist in the project (list the exact missing path).
7. TURKISH-LEARNER ISSUES: items that assume a Korean first language, and false-friend or sound traps for Turkish speakers in this vocabulary.
8. OVERLAP: games that teach the same thing, so I can keep the best and retire the rest.

## Output files (all in `revision-work\audit\`)
1. `unit1-audit.md`: grouped by Grade 3 then Grade 4, then by file. Each finding as a bullet: **[severity HIGH/MEDIUM/LOW]** `file:line`: "short quote": what is wrong: your fix. End with a one-page summary listing the 10 most important problems first.
2. `unit1-fixes.json`: a valid JSON array of exact, safe, text-only fixes that Claude can apply with find-and-replace. Each item: `{"id": 1, "severity": "HIGH", "file": "js/school-store.js", "line": 8950, "find": "exact existing text, long enough to be unique", "replace": "exact new text", "reason": "one sentence"}`. Only content fixes (answers, wording, typos, facts). Never change code logic. If the exact text is not unique, include more surrounding words.
3. `unit1-keep-merge-retire.md`: a table of every game and lesson you read: Name | Grade | Unit 1 content it matches | Quality (good / ok / weak) | Level fit | Recommendation (KEEP for revision / MERGE with X / RETIRE for now) | One-line reason. Then your recommended TOP 5 for Grade 3 revision and TOP 5 for Grade 4 revision.
4. `turkish-learner-notes.md`: for Grade 3 and for Grade 4 separately: the Unit 1 vocabulary list with a Turkish translation of each word (flag any word with no good single Turkish equivalent), the top 10 mistakes Turkish-speaking learners make with THIS content (sounds like /w/ versus /v/, th, final consonant clusters, missing articles, word order, "has got", plural -s, he/she, past -ed, and so on) each with a one-line teacher fix, and 6 minimal pairs for the phonics targets that Turkish speakers find hard.
5. `PROGRESS.txt`: every file read (OK or could not read) and every output file with OK or FAILED.

## Finish
Confirm the 5 output files exist and report the 5 most serious problems you found in one short list. Then stop. Do nothing else.
