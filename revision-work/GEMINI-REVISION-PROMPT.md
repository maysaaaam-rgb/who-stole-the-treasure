# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are an expert primary ESL curriculum reviewer and worksheet designer (CEFR A1 to A1+, Korean learners aged 8 to 10). I teach Grade 3 (classes 3A, 3B) and Grade 4 (classes 4A, 4B). Before I start Unit 2, I want you to check everything we taught in Term 1, build ONE big revision resource for my own use, and make printable class worksheets so I can check the children's English progress. Work through the whole job by yourself without asking me questions. I am away. If something fails, retry up to 3 times, note it in the log and continue.

## Hard rules
- You may ONLY create files inside `C:\Users\maysa\Desktop\DV\revision-work\out\`. Do NOT edit, move, rename or delete any other file. Do NOT touch code (.js .css) or any existing .html. Do NOT run git.
- Use ONLY the material in the input files. Do not invent lessons or games that are not listed. If something is uncertain, say so in the document.
- No student names or personal data anywhere. Worksheets have blank lines for name, class and date.
- Level: simple sentences, A1 for Grade 3, A1+ for Grade 4. Everything must be answerable by 8 to 10 year olds who are learning English.

## Input files (read all three first)
1. `C:\Users\maysa\Desktop\DV\revision-work\inputs\curriculum.md` (textbook units, what the platform records as taught, existing quizzes and worksheets)
2. `C:\Users\maysa\Desktop\DV\revision-work\inputs\library.md` (61 library games and lessons tagged for Grades 3 and 4, with topic, grammar, vocabulary)
3. `C:\Users\maysa\Desktop\DV\revision-work\inputs\review-instructions.md` (exact structure of the master resource document)

## JOB 1: the big revision resource
Follow `review-instructions.md` exactly and write it to `revision-work\out\revision-master-resource.md` (Markdown). It must cover Grade 3 and Grade 4, include the 50-mark class progress check blueprint, and end with the advice section about the existing Unit 1 quiz, progress check and revision.
Important: the platform does not record exactly which library games were played in class. Treat the textbook Unit 1 and the Review units as taught, treat the dated assignments, homework and calendar items as taught, and label everything else "Unconfirmed". The teacher will tick what was really taught.

## JOB 2: the class progress-check worksheets (printable)
Make the check described in your own blueprint, two versions, using ONLY taught content (textbook Unit 1 and Review units, plus the dated assignments and homework). The upcoming Unit 2 content must NOT appear.
Create these four files:
- `revision-work\out\check-grade3.html` (Grade 3 pupil paper)
- `revision-work\out\check-grade3-teacher.html` (Grade 3 answer key, listening script, marking guide)
- `revision-work\out\check-grade4.html` (Grade 4 pupil paper)
- `revision-work\out\check-grade4-teacher.html` (Grade 4 answer key, listening script, marking guide)

Pupil paper requirements:
- Self-contained single HTML file, no external fonts, scripts or images. Print-ready A4: use `@page { size: A4; margin: 12mm }`, readable 14 to 16 px type, clear section headers, big write-in boxes and lines.
- Header: Name ____ Class ____ Date ____ and total /50.
- 35 to 40 minutes, 50 marks, with sections for Listening, Vocabulary, Grammar and sentence patterns, Phonics, Reading, Writing and a Speaking task (speaking is done by the teacher with a rubric; include a one-page speaking rubric in the teacher file with 4 criteria and 0 to 3 scores).
- Use varied item types: matching, circle, fill the gap with a word box, put in order, true/false, short answers, a labelled-picture style task using emoji (not drawings), a short sentence-writing task.
- Every item must map to a can-do statement. In the teacher file include a table: Item | Skill | Can-do statement | Marks.
- Fun and friendly tone, but looks like a clean school test, not a game.

Teacher file requirements: answers for every item, the full listening script to read aloud twice (no audio files), marking rules for partial credit, scoring bands (Secure / Developing / Needs support) with recommended action, and a class record table template (rows for 20 pupils, columns for each section).

## Log and finish
Write `revision-work\out\PROGRESS.txt` listing every file with OK or FAILED. At the end confirm the 5 files exist: revision-master-resource.md, check-grade3.html, check-grade3-teacher.html, check-grade4.html, check-grade4-teacher.html. Then stop and report anything uncertain. Do nothing else.
