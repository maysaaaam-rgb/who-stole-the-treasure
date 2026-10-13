# Unit 3 deep study prompt for Antigravity (pass 2)

**Before you paste:** Antigravity must still have the Unit 3 pages it read before. If it does not, give them to it again in chat, or put them in `C:\Users\maysa\Desktop\DV\unit3-work\pages\`.

Paste everything below the line into Antigravity.

---

Good work on pass 1. Now study Unit 3 **in depth** for both books, *Global Readings 2* (Grade 3, "How Much Is It?", pp. 40-55) and *Global Readings 3* (Grade 4, "It Keeps Changing", pp. 40-55).

Extract everything a teacher needs to plan and teach the unit: objectives, language chunks, vocabulary, grammar, functions, pronunciation, skills, values and assessment. The learners are aged 8 to 10, CEFR A1 to A1+, first language Turkish. Lessons are 35 minutes on one smartboard.

Work by yourself without asking me questions, because I am away. Use the same Unit 3 pages you read in pass 1. If they are in chat, use them; otherwise use `C:\Users\maysa\Desktop\DV\unit3-work\pages\`.

## Hard rules (same as before)
- Create files ONLY inside `C:\Users\maysa\Desktop\DV\unit3-work\out\deep\` (make the folder).
- Do NOT edit or delete any other file, including your pass 1 files.
- Do NOT touch code, run git, push, or open the platform's database (Supabase) or any login.
- Do not copy whole pages. Quote at most 3 consecutive sentences, and give no song lyrics.
- Do not include any pupil names. Use English everywhere, except the `tr` fields (Turkish).
- **Truth tag on every item:** each item gets `"source": "book p.NN"` when it is printed on the page, or `"source": "added"` when it is your own suggestion. Never present your own idea as book content. If you cannot read something, write `[unclear]`.

## JOB 1: check pass 1 first
Re-read every page and compare it with `out\unit3-grade3.json` and `out\unit3-grade4.json`. Write `out\deep\pass1-corrections.md`, listing:
- every wrong, missing or invented item (for example CD track numbers, science facts, chant titles), and
- the correct version with its page number.

If pass 1 was right, say so.

## JOB 2: deep study (one file per grade)
Write `out\deep\unit3-grade3-study.json` and `out\deep\unit3-grade4-study.json`. Both must be valid JSON with these sections.

1. **`objectives`**
   - `unitObjectives`: 5-8 "Pupils will be able to ..." statements (measurable, A1).
   - `canDo`: child-friendly "I can ..." statements.
   - `byStrand`: objectives split into `reading`, `listening`, `speaking`, `writing`, `vocabulary`, `grammar`, `phonics`, `content` (the science or social-studies idea), `thinking` and `values`.
   - `successCriteria`: what the teacher sees or hears when a pupil has met each objective.
2. **`vocabulary`**: every word or phrase the pages teach or need (glossary, bold words, Word Work, labels, instructions, the readings). For each one give:
   - `word`, `partOfSpeech`, `tr`, `simpleDefinition` (A1), `bookSentence` (exact, with page), `easySentence` (max 8 words),
   - `type`: `productive` (pupils must say or write it) or `receptive` (understand only),
   - `tier`: 1 everyday, 2 general academic, 3 topic-specific,
   - `wordFamily` (for example: change, changes, changing, changed), `collocations` (for example: *melting ice*, *save money*),
   - `opposite` (if useful), `emoji`, `pictureIdea`, `TPRgesture` (an action pupils can do),
   - `pronunciation`: syllables, stressed syllable, and sounds that are hard for Turkish speakers,
   - `source`.

   Group the words as `mustKnow` (8-12 core words), `shouldKnow` and `niceToKnow`.
3. **`chunks`**: ready-made phrases and patterns pupils can learn as whole units (for example *How much is it?*, *It costs ...*, *money is tight*, *not enemies today*, *instead of*, *I would ... because ...*). For each chunk give:
   - `chunk`, `meaning`, `tr`, `function` (asking price, giving a reason, comparing, agreeing...), `bookExample` with page, `3 easyExamples`, `source`.
   - Include classroom chunks the tasks need (*I think ...*, *I agree / I disagree*, *My answer is ...*, *Can you say it again?*).
4. **`grammar`**: every structure in the unit. For each one give:
   - `form` (pattern with blanks), `meaning`, `use` (when we use it), `bookExamples` with pages, `simpleRule` (one sentence for a child), `3 practiceSentences`,
   - `commonTurkishL1Errors` (for example word order, missing *a/the*, missing *-s*) with a correct version,
   - `source`.
5. **`functions`**: the language functions pupils use (asking about prices, describing changes, comparing, cause and effect, giving opinions, problem and solution), each with its chunks and a 4-line model dialogue (marked `added` if not in the book).
6. **`phonics`**: focus sound, all book words, extra A1 words with the same sound, minimal pairs, tongue twister (`added`), and Turkish-speaker difficulties.
7. **`readings`**: for each reading give:
   - `title`, `genre`, `pages`, `mainIdea`, `summary` (6-8 A1 sentences),
   - `keySentences` (exact, max 3 in a row), `characters` with one-line traits, `setting`, `sequence` (numbered events), `problem`/`solution` or `cause`/`effect` (whichever applies),
   - `moralOrMessage`, `newWordsInOrder` (as they appear), `retellFrame` (5 sentence starters for retelling).
8. **`skills`**: `readingSkill` (what it is, how the book teaches it, and the organiser it uses), `thinkingSkills` (sequencing, comparing, inferring, evaluating), `writingTask` (what the book asks, a model answer at A1 marked `added`, and a 3-step writing frame).
9. **`content`**: the CLIL topic (money history / climate change and clean energy), key facts a teacher says aloud (only facts from the pages, or marked `added`), misconceptions children may have, and real-life links to pupils in Turkey (`added`).
10. **`valuesAndSEL`**: honesty, kindness, caring for animals and the planet, and saving money. For each, give where it appears in the book and a question to discuss.
11. **`pageActivities`**: every task on every page. For each one give:
    - `page`, `section`, `exactInstructions`, all `items`, `answerKey` (or `open`),
    - `skill`, `interactionPattern` (whole class / pairs / groups / individual),
    - `smartboardIdea`: how to run it on one smartboard (`added`),
    - `needsAudio` (true or false).
12. **`classroomLanguage`**: teacher instructions and praise phrases at A1 that this unit's tasks need.
13. **`prerequisites`**: what pupils must already know from Units 1-2 (read `unit2-work\out\unit2-grade3.json` and `unit2-work\out\unit2-grade4.json`, but do not change them).
14. **`assessment`**:
    - 10 can-do checks with how to observe them,
    - a 5-question oral check,
    - a speaking rubric (3 levels),
    - a writing rubric (3 levels).
15. **`differentiation`**: support for weaker pupils (picture cues, sentence frames, fewer words) and challenge for stronger pupils.
16. **`lessonSequence`**: 8 lessons of 35 minutes. For each lesson give:
    - `objective`, `pages`, `targetWords`, `targetChunks`, `grammar`,
    - `stages` (warm-up, presentation, practice, production, exit), with minutes that add up to 35.

## JOB 3: one-page teacher summary per grade
Write `out\deep\unit3-grade3-overview.md` and `out\deep\unit3-grade4-overview.md`. Each is one page with these sections:
- Big idea
- Objectives
- Must-know words (with Turkish)
- Key chunks
- Grammar
- Phonics
- Readings in 3 lines each
- Values
- How I will know they learned it

## Log and finish
Write `out\deep\PROGRESS.txt` covering:
- every file written (OK or FAILED),
- the number of words and chunks per grade,
- how many items are `book` and how many are `added`, and
- every `[unclear]` item.

Check that every .json file is valid JSON. Then stop and report what you were unsure about. Do nothing else.
