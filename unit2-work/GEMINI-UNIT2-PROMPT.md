# Paste everything below the line into Gemini (the agent that can read and write files in this project)

Before you paste: put the Unit 2 pages in `C:\Users\maysa\Desktop\DV\unit2-work\pages\` as images or PDF, named like `g3_p24.jpg` ... `g3_p39.jpg` (Grade 3, Global Readings 2, pages 24-39) and `g4_p24.jpg` ... `g4_p39.jpg` (Grade 4, Global Readings 3, pages 24-39). A single PDF per book is fine too (`g3_unit2.pdf`, `g4_unit2.pdf`).

---

You are an expert primary ESL curriculum analyst (CEFR A1 to A1+, learners aged 8 to 10 whose first language (L1) is: ______ (TEACHER: write it here before pasting, for example Turkish or Korean)). I teach Grade 3 (classes 3A, 3B, textbook Global Readings 2) and Grade 4 (classes 4A, 4B, textbook Global Readings 3). Read the Unit 2 pages of both books and turn them into precise structured notes that another AI will use to build lessons. Work through the whole job by yourself without asking me questions. I am away. If something fails, retry up to 3 times, note it in the log and continue.

## Hard rules
- You may ONLY create files inside `C:\Users\maysa\Desktop\DV\unit2-work\out\`. Create it if missing. Do NOT edit, move, rename or delete any other file. Do NOT touch code. Do NOT run git.
- Read the real pages. Do not invent text. If a page is unreadable or a word is unclear, write `[unclear]` and list it in the log. Quote the book's own sentences where I ask for text.
- Do not copy whole pages. For stories and articles, give a faithful short summary plus the key sentences (at most 3 consecutive sentences quoted), not the full text.
- No student data.

## JOB 1: structured notes (one file per grade)
Write `out\unit2-grade3.json` (Grade 3, pages 24-39) and `out\unit2-grade4.json` (Grade 4, pages 24-39). Valid JSON. Structure:
```
{
  "book": "...", "grade": 3, "unitTitle": "...", "pages": "24-39",
  "bigIdea": "the key concept question", "readingSkill": "...", "contentArea": "...", "selFocus": "...", "phonicsFocus": "...", "grammarOrLanguageFocus": "...",
  "reading1": {"title": "...", "type": "story|nonfiction|instructional", "summary": "5-8 simple sentences", "keySentences": ["..."], "pages": "..."},
  "reading2": { same shape },
  "vocabulary": [{"word": "...", "page": 26, "partOfSpeech": "...", "simpleDefinition": "A1-level definition", "exampleSentence": "...", "l1Hint": "translation of the word in the learners' first language named at the top"}],
  "pageByPage": [{"page": 24, "whatIsOnIt": "...", "activityType": "...", "instructionsAsWritten": "...", "answersIfDeterminable": "..."}],
  "comprehensionQuestions": [{"page": 30, "question": "...", "answer": "...", "skill": "recall|inference|opinion"}],
  "phonicsWords": ["..."],
  "grammarPoints": [{"pattern": "...", "examples": ["...", "..."]}],
  "cultureOrContentFacts": ["short facts a teacher can say aloud"],
  "pictureNotes": [{"page": 27, "describe": "what the picture shows, useful for vocabulary teaching"}],
  "difficultyFlags": ["words or tasks likely too hard for A1/A1+, with a simpler alternative"]
}
```
Include every vocabulary word the unit highlights, plus any extra words you judge necessary for A1 learners to understand the two readings.

## JOB 2: ready-to-use lesson plans (one file per grade)
Write `out\unit2-grade3-lessons.json` and `out\unit2-grade4-lessons.json`: an array of 8 lessons (40 min each) in the same style as the Unit 1 lessons of the platform:
```
{"title": "Lesson 1: See, Think, Wonder (...)", "order": 1, "sourcePages": "24-25", "objective": "one sentence, measurable", "duration": 40,
 "activities": [{"type": "discussion|inquiry|story|vocab_definitions|matching|questions|phonics_box|sequence_device|reflection|round_robin|reading_journal", "title": "...", "prompt": "teacher-facing instruction", "text": "student-facing text if needed", "words": [{"word": "...", "def": "..."}], "answer": "..."}]}
```
Lesson pattern for both grades: 1 See-Think-Wonder; 2 Reading 1 (read aloud and track); 3 words in context; 4 comprehension; 5 skill lesson (sequence or setting or cause and effect, whichever the unit teaches); 6 Reading 2; 7 skill practice and speaking; 8 Think Together plus Reading Journal and a 10-minute exit check. Keep the text simple. Use only content from the pages.

## JOB 3: assessment material for Unit 2 (teacher use)
Write `out\unit2-grade3-quiz.json` and `out\unit2-grade4-quiz.json`: 12 questions each (4 vocabulary, 3 reading comprehension, 2 phonics, 2 grammar or language focus, 1 short writing prompt) with answers, marks (20 total) and a can-do statement for each.

## JOB 4: a short notes file for the other AI
Write `out\README-for-claude.md`: what you found that I should know before building the lessons: mismatches with Unit 1, anything missing from the pages, tasks that need audio or pictures that we do not have, any copyright concerns (long quotations avoided), and anything you could do next to help (for example: sound-alike minimal pairs, picture prompt lists, song or chant lyrics for the target words, simple roleplay scripts, a glossary in the learners' first language).

## Log and finish
Write `out\PROGRESS.txt` listing every file with OK or FAILED and every `[unclear]` item. Confirm these 9 files exist: unit2-grade3.json, unit2-grade4.json, unit2-grade3-lessons.json, unit2-grade4-lessons.json, unit2-grade3-quiz.json, unit2-grade4-quiz.json, README-for-claude.md, PROGRESS.txt. Then stop and report anything uncertain. Do nothing else.
