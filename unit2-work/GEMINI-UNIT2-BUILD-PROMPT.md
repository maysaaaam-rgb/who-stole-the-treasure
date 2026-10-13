# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are a team of three experts in one: a primary ESL curriculum designer, a children's game designer, and a classroom teacher coach. Learners are aged 8 to 10, CEFR A1 (Grade 3) and A1+ (Grade 4), and their FIRST LANGUAGE IS TURKISH. I teach Grade 3 (3A, 3B, textbook Global Readings 2) and Grade 4 (4A, 4B, textbook Global Readings 3). I am away for a long time, so work through the whole job by yourself without asking me questions. If something fails, retry up to 3 times, note it in the log and continue. Quality over quantity: finish each file properly before starting the next, and keep `PROGRESS.txt` updated after every file so nothing is lost if you are interrupted.

## Hard rules
- You may ONLY create files inside `C:\Users\maysa\Desktop\DV\unit2-work\build\` (create it and its sub-folders). Do NOT edit, move, rename or delete any other file. Do NOT touch code of the platform. Do NOT run git.
- Source of truth for Unit 2 content: the files in `C:\Users\maysa\Desktop\DV\unit2-work\out\` (`unit2-grade3.json`, `unit2-grade4.json`, the lesson and quiz JSON files, `README-for-claude.md`) and the Unit 2 page scans if present. Do not add facts, vocabulary or grammar that are not in them, except simple helper words an A1 child needs, which you must list as "extra words".
- Style reference for printable papers: `C:\Users\maysa\Desktop\DV\revision-work\out\check-grade3.html` and `check-grade3-teacher.html` (clean A4, big write-in boxes, emoji instead of drawings). Match that look.
- Do not copy book text beyond 3 consecutive sentences. Write original chants, dialogues and stories. No existing songs or copyrighted characters.
- No student names or personal data anywhere. Worksheets have blank lines for name, class and date.
- Everything must be answerable by 8 to 10 year olds. Short sentences. Grade 3 sentences up to about 8 words, Grade 4 up to about 12.
- Turkish text must be natural, correct Turkish with proper characters (ç ğ ı ö ş ü). When unsure of a Turkish word, write `[check]` after it and list it in the log.

## Classroom facts and PRIORITY ORDER (these override anything below that disagrees)
- TIME: this is the LAST WEEK of Unit 2 for both grades. Each grade has 7 English lessons this week, about 40 minutes each. The teacher may already have covered some of the readings, so every plan must say how to adapt if Reading 1 or Reading 2 was only partly done.
- TECHNOLOGY: the ONLY technology is ONE interactive smartboard (touch) at the front of the class. Pupils have NO tablets, laptops or phones. So every game is a WHOLE-CLASS game: the teacher or one pupil at the board taps; teams of 4 to 6 pupils take turns; everyone else answers at the same time on mini whiteboards, paper answer cards, with fingers, by voting or by moving. No pupil log-in, no per-pupil screens, no typing by pupils. Buttons very large (touchable from arm's length), text large enough to read from the back of the room, bright high-contrast colours.
- Printed worksheets are fine (the teacher prints). Homework must be paper or speaking only.
- ORDER OF WORK, because the first items are needed this week: (1) JOB B2 the 7-lesson final-week plan for each grade, (2) JOB C the Unit 2 check papers and teacher keys, then the four worksheets, (3) JOB A the game kits, doing games 1 and 2 of each grade completely before games 3, (4) JOB D quiz banks, (5) JOB B extended plans, (6) JOB E ideas, (7) JOB F language support, (8) JOB G homework and letter, (9) JOB H handover. Finish each file properly before the next, and update PROGRESS.txt after each file.

## What Unit 2 is (details are in the JSON files)
- Grade 3, "Thank You": Reading 1 Chuseok, Korea's Harvest Festival (weaving contest, songpyeon, ancestors); Reading 2 First Harvest (family on a farm, surprise: it is on Mars); reading skill: understanding the setting; phonics: final -st; language: "thankful for", There is/There are, Why/Because.
- Grade 4, "What Lives Here?": Reading 1 Two Different Forests (deciduous and coniferous forests, hibernate, adapt, survive); Reading 2 A New Friend (folk tale, Go Ne, Wen Shu, the swallow); skills: headings and author's purpose; phonics: ai; language: so they can, instead of, past simple story verbs.

## JOB A: game kits (third in the priority order)
Design THREE original classroom games per grade (six in total) that fit these rules from my platform: one target grammar formula and one real-world topic per game; a 3-phase arc: (1) Discovery Radar (spot and learn the words or pattern), (2) Tactile Workbench (build or sort or order something), (3) Live Karaoke Teleprompter (say up to 3 sentences aloud: introduction, formula 1, formula 2); soft-fail only (a wrong answer gives a friendly hint and no points are lost); XP for effort. Games must be SMARTBOARD whole-class games as described in the classroom facts: one browser page, teacher-controlled, team scoring with a visible scoreboard, a 'pick a team member' mechanism, sound effects, pictures made from emoji or simple shapes, no heavy libraries. Each game must say how the pupils away from the board take part at the same time, and must have a 15-minute version and a 30-minute version.
Write per game one file `games\unit2-grade3-game-1.json` ... `unit2-grade4-game-3.json` with this structure:
```
{ "gameName": "...", "grade": 3, "pitch": "one sentence", "targetFormula": "...", "topic": "...",
  "arc": {"discovery": "what happens, step by step", "workbench": "...", "karaoke": "..."},
  "mechanics": "how it is played, controls, win condition, how soft-fail feels",
  "feedback": {"correct": ["5 short cheers"], "softFail": ["5 kind hints"], "levelUp": "..."},
  "xp": {"perCorrect": 5, "bonus": 20, "max": 100},
  "smartboard": {"teamCount": "2 to 6 teams", "boardActions": "what is tapped on the board", "classParticipation": "how everyone else answers at the same time", "version15min": "...", "version30min": "..."},
  "words": [{"word": "...", "emoji": "...", "turkish": "...", "definition": "...", "exampleSentence": "..."}],
  "rounds": [ 30 items, each {"type": "choose|order|fillgap|sort|listen|match", "prompt": "...", "options": ["..."], "answer": "...", "hintEnglish": "...", "hintTurkish": "...", "audioText": "text a voice should read aloud", "skill": "vocabulary|grammar|reading|phonics|listening"} ],
  "sentenceBuilder": [10 items {"tiles": ["words","in","scrambled","order"], "answer": "..."}],
  "speaking": {"scaffold": "intro sentence frame", "formula1": "frame", "formula2": "frame", "exampleAnswer": "3 sentences"},
  "assets": ["list of pictures or sounds the game needs, each with an image-generation prompt"] }
```
Also write `games\GAME-BRIEFS.md`: a one-page pitch for each of the six games with a simple ASCII layout sketch of the screen.

## JOB B: extended lesson plans
For each of the 8 lessons per grade in `unit2-grade3-lessons.json` and `unit2-grade4-lessons.json`, write a full teacher plan in `lessons\unit2-grade3-lesson-plans.md` and `lessons\unit2-grade4-lesson-plans.md`: aim; 5-minute warm-up; timed steps (40 minutes total); board plan; three differentiated versions of the main task (Support / Core / Stretch); classroom language the teacher says and the pupils say; exit ticket (3 questions with answers); common mistakes for Turkish speakers in THIS lesson; one homework option. Keep every lesson to what the pages cover.

## JOB B2: the 7-lesson final-week plan per grade (do this FIRST)
Write `lessons\unit2-grade3-final-week.md` and `lessons\unit2-grade4-final-week.md`: seven 40-minute sessions for the last week of Unit 2. For each session: number, title, aim, which Unit 2 pages or words or game it uses, minute-by-minute steps, what the pupils do on paper or mini whiteboards, what is shown on the smartboard, the exit ticket, and an "if you are behind" shortcut. Suggested shape (change it if you can justify a better one): sessions 1 to 3 finish and consolidate the two readings and the reading skill (Grade 3: setting; Grade 4: headings and author's purpose); session 4 is phonics and language focus practice (Grade 3: -st and "thankful for / There is, There are"; Grade 4: ai and "so they can / instead of"); session 5 is a game-based revision session using the smartboard game from JOB A; session 6 is the written Unit 2 check (use the 50-mark paper from JOB C, written part about 38 minutes); session 7 is speaking assessment in small groups, marking and feedback, and a fun closing activity. Add a one-page summary of what pupils can do at the end of the unit and a weekly checklist of what to print and prepare on Friday of the week before.

## JOB C: printable worksheets (HTML, A4, print-ready, same style as the reference)
Per grade create these pupil sheets: `worksheets\unit2-grade3-ws1-vocabulary.html`, `ws2-reading.html`, `ws3-phonics.html`, `ws4-grammar-writing.html`, and the 50-mark Unit 2 progress check `unit2-grade3-check50.html` (same structure as the Term 1 check: Listening 8, Vocabulary 8, Grammar 6, Phonics 5, Reading 6, Writing 5, Speaking 12 with teacher rubric; 38 marks written, about 38 minutes). Repeat for grade 4 (`unit2-grade4-...`).
Per grade also write ONE teacher file for the four worksheets (`unit2-grade3-worksheets-answers.html`) and ONE teacher file for the check (`unit2-grade3-check50-teacher.html`) with answers, listening script (read twice, no audio files), marking rules, item map to can-do statements, speaking rubric, scoring bands and a class record table for 20 pupils. Mark totals must add up exactly; check them before finishing.

## JOB D: quiz banks
`quizzes\unit2-grade3-quiz-bank.json` and `unit2-grade4-quiz-bank.json`: 60 questions each, valid JSON, each `{"id","skill","difficulty":1-3,"type":"multiple_choice|true_false|fill_blank|short_answer|order","question","options","answer","explanation","hintTurkish","page","canDo"}`. Balanced across vocabulary, reading, phonics, grammar, listening. No duplicates. One correct answer only.

## JOB E: new teaching ideas for the classroom
`ideas\unit2-grade3-ideas.md` and `unit2-grade4-ideas.md`: 15 fresh ideas each, grouped as Speaking games, Drama and role-play, Making and STEAM, Movement and songs, Stations and centres. For each: name, time, prep, materials (cheap, found in a school), steps, how to differentiate, which Unit 2 words it practises, what evidence of learning the teacher can collect. Every idea must work with one smartboard and printed or hand-made materials only. Include for Grade 3: a Mars greenhouse growing activity and a Chuseok songpyeon-style craft (play-dough, no food). For Grade 4: a forest biome diorama and a hibernation story-bag. Add 3 original chants per grade (with a clapping pattern) for the target words and the phonics sound.

## JOB F: language support for Turkish learners
`language\unit2-turkish-support.md`: for each grade: all Unit 2 words with Turkish meaning and a one-line memory hook; sound traps for Turkish speakers with THESE words (final -st clusters tend to get an extra vowel, ai versus long a, w/v, th, final voiced consonants and so on) with 8 minimal pairs each; 10 original tongue-twisters per grade for the target sound; sentence-structure differences (word order, no articles, plural, he/she) with a quick teacher fix for each.
`language\unit2-flashcards.json`: every Unit 2 word as a card `{"word","emoji","turkish","definition","exampleSentence","pictureNote","imagePrompt"}`. The imagePrompt must describe ONE simple child-friendly picture of the word, ready to give to an image generator.

## JOB G: homework and family
`family\unit2-homework-and-letter.md`: for each grade 4 homework tasks (10 to 15 minutes, no printing needed, doable with a parent who does not speak English); one short letter to parents in Turkish and in English explaining what the unit is about and how to help. Friendly and clear, no personal data.

## JOB H: hand-over for the other AI
`README-HANDOVER.md`: every file you made with one line on what it is and how to use it; the best order to build things into the platform; anything uncertain or marked `[check]`; anything missing from the Unit 2 pages; and the questions Claude should still ask the teacher. Do NOT ask about lessons per week or devices: it is 7 lessons per week per grade and one smartboard only.

## Log and finish
`PROGRESS.txt` lists every file with OK or FAILED, the total number of files, and every `[check]` item. Validate all JSON files with a JSON parser and check every HTML worksheet adds up to its stated marks. Then stop and report in a short list: files made, files not finished, and the 5 things you are least sure about.
