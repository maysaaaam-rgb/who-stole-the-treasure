# UNIT 2 HANDOVER ARCHITECTURE & DEPLOYMENT MANUAL
**English Adventure Academy — Global Readings 2 & 3: Unit 2**  
*Audience:* Lead AI Engineer / Platform Developer (Claude / Antigravity)  
*Hardware Environment:* Classroom Smartboard (Single Touch Display, 1920x1080), Desk Mini-Whiteboards  
*Pedagogical Engine:* 4-Pillar Architecture, 60-30-10 Glassmorphic Tokens, Web Audio Procedural Synthesis  

---

## 1. Complete Deliverable Inventory (Directory Index)

| File Path | Description & Intended Usage |
| :--- | :--- |
| `PROGRESS.txt` | Active tracking log confirming completion status and `[check]` verification items. |
| `README-HANDOVER.md` | This technical manual, curriculum overview, platform integration sequence, and open questions. |
| **LESSONS** | |
| `lessons/unit2-grade3-final-week.md` | 7 × 40-min final week lesson plan for Grade 3 (Reading consolidation, phonics, game, check, speaking). |
| `lessons/unit2-grade4-final-week.md` | 7 × 40-min final week lesson plan for Grade 4 (Biomes, author's purpose, phonics, game, check, speaking). |
| `lessons/unit2-grade3-lesson-plans.md` | Complete 8-lesson curriculum teacher plans for Grade 3 (Warm-up, board plan, 3 tiers, exit tickets). |
| `lessons/unit2-grade4-lesson-plans.md` | Complete 8-lesson curriculum teacher plans for Grade 4 (Warm-up, board plan, 3 tiers, exit tickets). |
| **WORKSHEETS & ASSESSMENTS** | |
| `worksheets/unit2-grade3-check50.html` | Print-ready A4 50-mark progress test for Grade 3 (38 written marks + 12 speaking marks). |
| `worksheets/unit2-grade3-check50-teacher.html` | Teacher guide, audio scripts (read twice), 50-mark key, marking rules, speaking rubric, 20-pupil roster. |
| `worksheets/unit2-grade4-check50.html` | Print-ready A4 50-mark progress test for Grade 4 (38 written marks + 12 speaking marks). |
| `worksheets/unit2-grade4-check50-teacher.html` | Teacher guide, audio scripts, 50-mark key, marking rules, speaking rubric, 20-pupil roster. |
| `worksheets/unit2-grade3-ws1-vocabulary.html` | 15-mark A4 worksheet: Harvest, weave, cloth, contest, ancestors, songpyeon. |
| `worksheets/unit2-grade3-ws2-reading.html` | 15-mark A4 worksheet: Understanding Setting (Earth vs Mars sort, comprehension, T/F). |
| `worksheets/unit2-grade3-ws3-phonics.html` | 15-mark A4 worksheet: Final `-st` blend (fast, last, lost, best, test, harvest, first). |
| `worksheets/unit2-grade3-ws4-grammar-writing.html` | 15-mark A4 worksheet: *There is / There are*, *thankful for*, *Why/Because*, guided paragraph. |
| `worksheets/unit2-grade3-worksheets-answers.html` | Teacher answer key and Turkish ESL learner tips for Grade 3 Worksheets 1–4. |
| `worksheets/unit2-grade4-ws1-vocabulary.html` | 15-mark A4 worksheet: Deciduous, coniferous, hibernate, survive, adapt, swallow, vet. |
| `worksheets/unit2-grade4-ws2-reading.html` | 15-mark A4 worksheet: Headings detective, Author's Purpose (inform vs entertain). |
| `worksheets/unit2-grade4-ws3-phonics.html` | 15-mark A4 worksheet: Vowel team `ai` (/eɪ/), minimal pairs vs short a, rhyme families. |
| `worksheets/unit2-grade4-ws4-grammar-writing.html` | 15-mark A4 worksheet: *so they can*, *instead of*, irregular past verbs (*built, fell, paid*). |
| `worksheets/unit2-grade4-worksheets-answers.html` | Teacher answer key and Turkish ESL learner tips for Grade 4 Worksheets 1–4. |
| **GAMES & INTERACTIVE MEDIA** | |
| `games/GAME-BRIEFS.md` | 1-page design brief per game with ASCII smartboard layout sketches and parallel desk mechanics. |
| `games/unit2-grade3-game-1.json` | Smartboard game kit: *Chuseok Full Moon Weavers* (30 rounds, 10 sentence builders, audio prompts). |
| `games/unit2-grade3-game-2.json` | Smartboard game kit: *The Mars Greenhouse Mystery* (30 rounds, 10 sentence builders, *There is/are*). |
| `games/unit2-grade3-game-3.json` | Smartboard game kit: *The -st Sound Vault* (30 rounds, 10 sentence builders, sharp stop phonics). |
| `games/unit2-grade4-game-1.json` | Smartboard game kit: *Two Forests: Biome Explorer* (30 rounds, 10 sentence builders, *instead of*). |
| `games/unit2-grade4-game-2.json` | Smartboard game kit: *The Golden Swallow's Gift* (30 rounds, 10 sentence builders, irregular verbs). |
| `games/unit2-grade4-game-3.json` | Smartboard game kit: *The 'ai' Rain Train* (30 rounds, 10 sentence builders, vowel team `ai`). |
| **QUIZ BANKS** | |
| `quizzes/unit2-grade3-quiz-bank.json` | 60 verified JSON questions across 5 skills (Vocab, Reading, Phonics, Grammar, Listening). |
| `quizzes/unit2-grade4-quiz-bank.json` | 60 verified JSON questions across 5 skills (Vocab, Reading, Phonics, Grammar, Listening). |
| **TEACHING IDEAS & STEAM** | |
| `ideas/unit2-grade3-ideas.md` | 15 classroom activities: Mars cup greenhouse, play-dough songpyeon, 3 clapping chants, stations. |
| `ideas/unit2-grade4-ideas.md` | 15 classroom activities: Forest diorama, hibernation story-bag, 3 clapping chants, stations. |
| **LANGUAGE SUPPORT & VOCABULARY** | |
| `language/unit2-turkish-support.md` | Turkish contrastive analysis: memory hooks, sound traps, 8 minimal pairs, 10 tongue-twisters, L1 grammar fixes. |
| `language/unit2-flashcards.json` | 35 curriculum flashcards with child-friendly image prompts, definitions, and Turkish anchors. |
| **FAMILY & HOMEWORK** | |
| `family/unit2-homework-and-letter.md` | 4 low-prep homework tasks per grade (zero printing) and bilingual Turkish/English parent letters. |

---

## 2. Recommended Platform Build Order (For Claude / Next Agent)

When wiring these materials into the central web application (`who-stole-the-treasure`):

1. **Step 1: Curriculum Database Update (`js/games-data.js`):**
   - Register the 6 new game metadata entries into `GAMES_DATA`.
   - Set `grade: 3` and `grade: 4`, category tags (`"reading"`, `"phonics"`, `"grammar"`, `"clil"`).
2. **Step 2: Smartboard Arcade Engine Loading:**
   - Wire the JSON loaders to dynamically mount `unit2-grade3-game-1.json` through `unit2-grade4-game-3.json` inside the platform's arcade runner.
   - Bind keyboard hotkeys (Keys 1–4) for team voting and spacebar for the audio reader.
3. **Step 3: Worksheet Printable Submodule:**
   - Link `worksheets/unit2-grade3-check50.html` and companion sheets into the teacher dashboard resource drawer under "Printable Check Papers".
4. **Step 4: Interactive Quiz Engine Integration:**
   - Import `quizzes/unit2-grade3-quiz-bank.json` and `unit2-grade4-quiz-bank.json` into the classroom battle/quiz module (`js/school-store.js` XP routing).

---

## 3. Items Marked `[check]` (Vocabulary & Facts to Note)

1. **[check] Songpyeon Cultural Accuracy:** The Korean rice cake is traditionally written *songpyeon* (송편). It is shaped like a crescent/half-moon (*ban-dal*) to represent growth and a bright future, unlike full-moon round cakes. All worksheets and stories reflect this.
2. **[check] Mars Farm Science Plausibility:** In *First Harvest*, crops develop unusual colors (pink potatoes, purple corn) due to synthetic ultraviolet grow lights and mineral-altered Martian soil. The dome is sealed; exterior atmospheric pressure is lethal without helmets.
3. **[check] Coniferous Forest Freezing Threshold:** Coniferous taiga winter temperatures drop below **-50°C** in northern Siberia and Canada. Needle adaptations prevent moisture desiccation through thick cuticle wax.
4. **[check] Folk Tale Regional Origin:** *A New Friend* is adapted from the beloved Korean folk tale *Heungbu and Nolbu* (흥부와 놀부). The character names were simplified in the textbook to *Go Ne* (good neighbor) and *Wen Shu* (envious neighbor).

---

## 4. Curricular Questions Claude Should Still Ask the Teacher
*(Note: Do NOT ask about devices or weekly periods; these are locked at 7 periods/week and 1 smartboard).*

1. **Speaking Assessment Window:** Does the teacher prefer assessing speaking (12 marks) in pairs during Session 7, or spreading 2–3 pupil interviews across earlier lessons as an exit ticket routine?
2. **Worksheet Printing Constraints:** Does the school support double-sided A4 printing, or should the two-page worksheets be printed as single facing sheets?
3. **Play-Dough Craft Materials:** Does the classroom already have modeling clay/play-dough for the Songpyeon activity (Idea 8), or should pupils bring their own small pot?
4. **Classroom Team Names:** Would the teacher like custom team badges (e.g. *Ember, Aqua, Verdant, Astral*) mapped directly to the Monster Studio elements for smartboard scoring?
