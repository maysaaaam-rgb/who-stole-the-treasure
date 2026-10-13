# Unit 3 extraction prompt for Antigravity

**Before you paste:** put the Unit 3 pages in `C:\Users\maysa\Desktop\DV\unit3-work\pages\`. They can be photos or PDF.
- Grade 3 (Global Readings 2): name them `g3_p40.jpg`, `g3_p41.jpg` and so on, using the real page number. One PDF named `g3_unit3.pdf` also works.
- Grade 4 (Global Readings 3): name them `g4_p40.jpg` and so on, or use one PDF named `g4_unit3.pdf`.
- If you have workbook pages, add them as `g3_wb_p20.jpg`, `g4_wb_p20.jpg` and so on.

Paste everything below the line into Antigravity.

---

You are an expert primary ESL curriculum analyst. The learners are aged 8 to 10, at CEFR A1 to A1+, and their first language is Turkish. I teach Grade 3 (classes 3A and 3B, textbook *Global Readings 2*) and Grade 4 (classes 4A and 4B, textbook *Global Readings 3*). Lessons are 35 minutes, on one smartboard.

Your job is **extraction only**. Read every Unit 3 page in `unit3-work\pages\` for both books. Turn everything on them into precise, structured notes. Another AI (Claude) will use these notes later to build lessons, games, karaoke speaking practice, worksheets and quizzes on my platform, so be complete and exact. Do not build lessons or pages.

Work through the whole job by yourself without asking me questions, because I am away. If a step fails, retry it up to 3 times, write it in the log, and continue.

## Hard rules
- Create files ONLY inside `C:\Users\maysa\Desktop\DV\unit3-work\out\` (make the folder if it is missing).
- Do NOT edit, move, rename or delete any other file in this project.
- Do NOT touch code, and do NOT run git or push anything.
- Do NOT open or call the platform's database (Supabase) or any website login.
- Read the real pages and do not invent text. If a page or word is unreadable, write `[unclear]` and list it in the log.
- Do not copy whole pages. For each story or article, give a faithful summary plus key sentences quoted exactly (at most 3 consecutive sentences per quote). If a song or chant is on the page, give only its title and topic, not its lyrics.
- Do not include any pupil names or student data.
- Use English everywhere, except the `tr` fields, which hold the Turkish meaning.

## JOB 1: full unit notes (one file per grade)
Write `out\unit3-grade3.json` and `out\unit3-grade4.json`. Each must be valid JSON with this structure:
```
{
  "book": "...", "grade": 3, "unitNumber": 3, "unitTitle": "...", "pages": "first-last",
  "bigIdea": "the key concept question", "readingSkill": "...", "contentArea": "...", "selFocus": "...",
  "phonicsFocus": "...", "grammarOrLanguageFocus": "...", "writingTask": "...",
  "reading1": {"title": "...", "type": "story|nonfiction|poem|instructional", "pages": "...", "summary": "5-8 simple A1 sentences", "keySentences": ["exact quotes"], "characters": ["..."], "setting": "...", "sequenceOfEvents": ["1 ...", "2 ..."]},
  "reading2": { same shape },
  "vocabulary": [{"word": "...", "page": 42, "partOfSpeech": "...", "simpleDefinition": "A1 definition", "exampleSentence": "book sentence if there is one, otherwise a simple one marked (made)", "tr": "Turkish meaning", "emoji": "one emoji that shows it, or empty", "pictureIdea": "what a picture card should show"}],
  "extraWordsNeeded": [{"word": "...", "why": "needed to understand reading 1 or 2", "simpleDefinition": "...", "tr": "..."}],
  "pageByPage": [{"page": 40, "section": "e.g. Unit opener / Before You Read / Reading / After You Read / Word Work / Phonics / Grammar / Think Together / Writing", "whatIsOnIt": "...", "activityType": "...", "instructionsAsWritten": "exact", "items": ["each question or item exactly"], "answers": ["answer key where it can be worked out, otherwise 'open'"], "needsAudio": true}],
  "comprehensionQuestions": [{"page": 46, "question": "...", "answer": "...", "skill": "recall|inference|opinion", "fromBook": true}],
  "phonics": {"focus": "...", "words": ["..."], "minimalPairs": [["...", "..."]]},
  "grammarPoints": [{"pattern": "...", "bookExamples": ["exact"], "simpleRule": "one sentence a child understands"}],
  "speakingSentences": ["8-12 short sentences (max 8 words) from the unit language that pupils can say aloud, ordered easy to hard"],
  "sentenceFrames": ["e.g. I like ___ because ___."],
  "cultureOrContentFacts": ["short facts a teacher can say aloud"],
  "pictureNotes": [{"page": 41, "describe": "what the picture shows and which words it helps teach"}],
  "difficultyFlags": [{"item": "...", "problem": "why it is hard for A1/A1+", "simplerAlternative": "..."}]
}
```
Include every word the unit highlights (glossary, bold words, Word Work), plus any extra words that A1 learners need to understand the readings (put these in `extraWordsNeeded`).

## JOB 2: question bank (one file per grade)
Write `out\unit3-grade3-questions.json` and `out\unit3-grade4-questions.json`. Each is an array of at least 30 questions taken from the unit content:
```
{"type": "mcq|true_false|fill_gap|match|order|picture_word|short_answer", "skill": "vocabulary|reading|phonics|grammar|listening|speaking", "question": "...", "options": ["...", "...", "..."], "answer": "...", "level": "easy|medium", "sourcePage": 44}
```
Make about 10 vocabulary, 8 reading, 4 phonics, 4 grammar and 4 speaking prompts. Keep every question at A1 level, with no trick questions.

## JOB 3: link to earlier units
Read `unit2-work\out\unit2-grade3.json` and `unit2-work\out\unit2-grade4.json` without changing them. Write `out\unit3-links.json` listing words, grammar or skills that Unit 3 repeats from Unit 2, and anything new that pupils have not met before.

## JOB 4: notes for Claude
Write `out\README-for-claude.md`. Cover:
- What the unit is about in each grade, in 5 lines.
- Anything missing or unreadable in the pages.
- Tasks that need audio, video or pictures that we do not have.
- Which activities would suit the smartboard: games, karaoke speaking, role-play, a song or chant (title only).
- Ideas for an 8-lesson plan per grade (titles only, 35 minutes each).

## Log and finish
Write `out\PROGRESS.txt` listing every page you read, every file you wrote (OK or FAILED) and every `[unclear]` item. Confirm these 7 files exist:
- unit3-grade3.json
- unit3-grade4.json
- unit3-grade3-questions.json
- unit3-grade4-questions.json
- unit3-links.json
- README-for-claude.md
- PROGRESS.txt

Check that every .json file is valid JSON. Then stop and report anything uncertain. Do nothing else.
