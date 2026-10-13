# Comprehensive Pedagogical & Technical Audit: Unit 1
> **Auditor:** Principal Primary ESL Curriculum Specialist & Game Architect  
> **Target Audience:** Turkish Primary ESL Learners (Classes 3A, 3B, 4A, 4B; CEFR A1 to A1+, Ages 8–10)  
> **Textbooks:** *Global Readings 2* (Grade 3), *Global Readings 3* (Grade 4)  
> **Scope:** Full read-only audit of curriculum lessons, quizzes, progress checks, games, worksheets, and assets.

---

## Part 1: Grade 3 Findings (*Global Readings 2* — "What Does It Do?")

### 1. `js/school-store.js`

- **[severity HIGH]** `js/school-store.js:9031`: `"Which tool does a firefighter use to put out water?"`: The question contains a logical and linguistic absurdity; firefighters use water to put out **fires**, not to "put out water".  
  *Fix:* Change prompt to `"Which tool does a firefighter use to put out a fire?"`.

- **[severity HIGH]** `js/school-store.js:8948`: `subtitle: "Diagnostic Progress Check & Wonderland Tea Party Qualifier"`: In the Grade 3 Unit 1 Master Quest (`quiz-g3-u1-after-school-inventor`), the subtitle references the Grade 4 Wonderland Tea Party qualifier due to a copy-paste error from Grade 4.  
  *Fix:* Replace subtitle with `"Diagnostic Progress Check & Young Inventor Showcase Qualifier"`.

- **[severity HIGH]** `js/school-store.js:6209`: `key: "Order: 2 -> 1 -> 3"`: In `DEFAULT_PROGRESS_CHECKS` (`progress-check-gr2-u1`, Q6), the prompt asks students to put story events in order: `[1: tests the robot, 2: collects materials, 3: paints it blue]`. The passage states Tom collects materials, builds and paints the robot blue, then tests it and sees it works. The key `Order: 2 -> 1 -> 3` erroneously places testing before painting.  
  *Fix:* Change answer key to `Order: 2 -> 3 -> 1`.

- **[severity HIGH]** `js/school-store.js:1290`: `gameRoute: 'monster-day/index.html'`: In `lesson-gr2-1-1` ("See, Think, Wonder - Everyday Inventions", source pages 8–9), the lesson routes students to `monster-day/index.html`. Monster Day teaches body parts, monster health, and emotions (Unit 2), having zero relation to everyday inventions or See-Think-Wonder.  
  *Fix:* Change `gameRoute` to `'inventor-lab/index.html'`.

- **[severity HIGH]** `js/school-store.js:1394`: `gameRoute: 'predictions/index.html'`: In `lesson-gr2-1-5` ("Sequencing Activity: First, Second, Third, Last", source page 17), the lesson routes students to `predictions/index.html`, which teaches A2 future tense (*will / won't*), completely ignoring primary sequence words and device operating order.  
  *Fix:* Change `gameRoute` to `'clara-inventor/index.html'`.

- **[severity HIGH]** `js/school-store.js:1452`: `gameRoute: 'advice/index.html'`: In `lesson-gr2-1-7` ("Problem Solving & Improving Your Idea", source pages 20–22), the lesson routes students to `advice/index.html`, which teaches A2 modal verbs (*should / shouldn't*), instead of the 5-step engineering feedback loop and historical inventor case studies.  
  *Fix:* Change `gameRoute` to `'inventor-forge/index.html'`.

- **[severity MEDIUM]** `js/school-store.js:6201-6202`: `textTitle: "The After-School Inventor"`, `passage: "Tom goes to his room every day after school... made a robot"`: In `progress-check-gr2-u1`, the reading passage is titled after Clara Doodle's textbook reading, but substitutes an invented character named "Tom" making a blue robot, discarding all textbook inventions (umbrella pen, alarm pillow, smart eraser, mirror, clean-up machine).  
  *Fix:* Update the passage to feature Clara Doodle and her authentic textbook inventions so the progress check validly assesses curricular learning.

- **[severity MEDIUM]** `js/school-store.js:2843, 2892, 2934`: `url: 'clara-inventor/worksheet.html'`: In homework entries `hw-animals`, `hw-phonics`, and `hw-self`, the resource links all point to `clara-inventor/worksheet.html` regardless of the topic (Animal Explorers, Phonics Vowel Drill, All About Me).  
  *Fix:* Point `hw-phonics` to `phonics/index.html` and assign topic-specific worksheet URLs rather than recycling Clara's file.

---

### 2. `quiz-briefing/index.html` (Grade 3 Master Quest)

- **[severity HIGH]** `quiz-briefing/index.html:1393-1402`: `<span>3. Kingfisher Bird &amp; Bullet Train</span>`, `<option value="C">C. Both Texts: Inventions &amp; Ideas</option>`, `🔑 Key: ... 3 = C (Both: Kingfisher/Train)`: The answer key marks Kingfisher Bird & Bullet Train as appearing in "Both Texts". In reality, the Kingfisher and bullet train biomimicry appears solely in the Nonfiction text ("My Good Ideas Book", pp. 18–20); Clara Doodle's fiction story never mentions birds or trains.  
  *Fix:* Change option value to `"A"` (`A. Nonfiction: "My Good Ideas Book"`) and update key to `3 = A (Nonfiction: Biomimicry)`.

- **[severity HIGH]** `quiz-briefing/index.html:1360-1363`: `"The Mad Hatter (Tea Master)", "Alice (Explorer)", "The White Rabbit (Time Keeper)", "The Cheshire Cat (Riddle Purr)"`: In the Grade 3 briefing data object (`g3.roles`), four Grade 4 Alice in Wonderland characters appear in the Grade 3 young inventor role draft list.  
  *Fix:* Replace Alice characters with Grade 3 STEM roles: `"Safety Inspector (Quality Control)"`, `"Patent Officer (Legal Protection)"`, `"Presentation Speaker (Pitch Lead)"`, `"Flight Engineer (Aerodynamics)"`.

---

### 3. `clara-inventor/`

- **[severity MEDIUM]** `clara-inventor/js/clara-data.js:404-434`: `stepNumber: 1, action: "Press play."` and `stepNumber: 4, action: "Press on."`: In the tablet operating sequence, step 1 is assigned "Press play" and step 4 is assigned "Press on", telling learners to start a video game before turning the device power on.  
  *Fix:* Swap actions so step 1 is `"Press on."` (switch power on) and step 4 is `"Play the game."` (start game adventure).

- **[severity MEDIUM]** `clara-inventor/js/clara-data.js:781-782`: `answerKey: "1. Press play, 2. Type password, 3. Play the game, 4. Press on..."`: Teacher instructions reflect the inverted tablet order.  
  *Fix:* Update teacher key and expected responses to `"1. Press on, 2. Type password, 3. Press play, 4. Play the game."`.

---

### 4. `good-ideas-lab/`

- **[severity HIGH]** `good-ideas-lab/index.html:6`: `<title>The Inventor’s Odyssey: My Good Ideas Lab 💡 | مختبر الأفكار الرائعة</title>`: Accidental Arabic script is embedded in the HTML title tag. The target learners are Turkish ESL primary students.  
  *Fix:* Change title to `<title>The Inventor’s Odyssey: My Good Ideas Lab 💡</title>`.

- **[severity HIGH]** `good-ideas-lab/index.html:150`: `<p class="text-xs text-cyan-400 font-bold uppercase tracking-wider">My Good Ideas Lab • مختبر الأفكار</p>`: Accidental Arabic text in the top navigation header subtitle.  
  *Fix:* Change to `<p class="text-xs text-cyan-400 font-bold uppercase tracking-wider">My Good Ideas Lab • Inventions &amp; Biomimicry</p>`.

---

### 5. `inventor-forge/`

- **[severity MEDIUM]** `inventor-forge/js/inventor-data.js:48, 68, 88, 108`: `correctIndex: 0`: In Stage 1 (Historical Inventors: Edison, Da Vinci, Karl Benz, Wright Brothers), every single question has its correct answer placed at index 0 (Option A), enabling students to game the system without reading.  
  *Fix:* Randomize the position of the correct answer across indices 0, 1, and 2.

---

### 6. `young-inventor/`

- **[severity MEDIUM]** `young-inventor/js/young-inventor-data.js:15`: `unit: 'Global Readings 3 — Unit 1: Inventions'`: The module header mistakenly attributes Unit 1: Inventions to *Global Readings 3* instead of *Global Readings 2*.  
  *Fix:* Change string to `'Global Readings 2 — Unit 1: Inventions'`.

---

## Part 2: Grade 4 Findings (*Global Readings 3* — "I Love Reading")

### 1. `js/school-store.js`

- **[severity HIGH]** `js/school-store.js:2043`: `gameRoute: 'monster-day/index.html'`: In `lesson-gr3-1-8` ("Brain Facts, Final -er Spelling & Reading Journal", source pages 22–23), students are routed to `monster-day/index.html` (Unit 2 monster customizer) instead of a brain science synthesis module.  
  *Fix:* Change `gameRoute` to `'brain-explorers/index.html'`.

- **[severity HIGH]** `js/school-store.js:1850`: `gameRoute: 'camp-mystery/index.html'`: In `lesson-gr3-rev-1` (Literacy Review 1: Animal Camouflage & -st phonics), students are routed to `camp-mystery/index.html`, which teaches A2 past continuous camping mystery.  
  *Fix:* Re-route to an animal camouflage / reading review module.

- **[severity HIGH]** `js/school-store.js:1902`: `gameRoute: 'city-mouse/index.html'`: In `lesson-gr3-1-2` (Question Starts: Who, What, Where, When, Why, How), students are routed to `city-mouse/index.html` (Aesop comparative adjectives).  
  *Fix:* Re-route to a dedicated WH-question / Alice reading readiness activity.

- **[severity HIGH]** `js/school-store.js:6287-6324`: `textTitle: "The Inventor's Helper"`, listening tasks `"Draw a pen under the chair"`, `"Circle the biggest ball"`: In `DEFAULT_PROGRESS_CHECKS` (`progress-check-gr3-u1`), the reading text is about "Sara making a helper robot", recycling Grade 3 Inventions rather than testing Grade 4 Unit 1 (*Alice in Wonderland* / *How Your Brain Learns*). Furthermore, the listening section tests early kindergarten skills ("circle the biggest ball") completely below Grade 4 A1+ capabilities.  
  *Fix:* Overhaul `progress-check-gr3-u1` with authentic Alice in Wonderland story comprehension, brain skimming questions, and age-appropriate CEFR A1+ listening items.

- **[severity LOW]** `js/school-store.js:1848`: `objective: 'Read story on animal camoflague...'`: Typo in the objective field ("camoflague" instead of "camouflage").  
  *Fix:* Correct spelling to `"camouflage"`.

- **[severity LOW]** `js/school-store.js:9777`: `description: '...workbook for Grade 4 Unit 1 Page 17 (RG2).'`: Textbook reference incorrectly writes RG2 (*Global Readings 2*) for a Grade 4 workbook.  
  *Fix:* Correct to `"(Global Readings 3)"`.

---

### 2. `quiz-briefing/index.html` (Grade 4 Master Quest)

- **[severity HIGH]** `quiz-briefing/index.html:1565, 1693-1704`: `Task 5: The 4-Lobe Brain Diagnostic Console` (`Parietal, Occipital, Temporal, Frontal`) and `line 1724` (`fMRI scanner`): The Master Quest tests university-level medical neuroanatomy (*Parietal Lobe, Occipital Lobe, fMRI scanner*) that does not appear in the Grade 4 textbook *Global Readings 3*. The textbook focuses on the 4 everyday jobs of the brain (*Think, Learn, Remember, Imagine*) and sensory connections. Testing medical terminology penalizes primary ESL students.  
  *Fix:* Align Task 5 prompts with the 4 textbook jobs (*Think, Learn, Remember, Imagine*) while treating cerebral lobes as optional bonus material.

- **[severity MEDIUM]** `quiz-briefing/index.html:1651-1659`: `Task 3: The Final -er Phonics Lock` (`river, center, teacher, fiber, corner`): The curriculum lesson (`lesson-gr3-1-8`, line 2045) specifically teaches the agent / comparative suffix *-er* (`reader, learner, thinker, faster, helper`). However, Task 3 tests root nouns (`river, center, fiber, corner`) where *-er* is not an agent morpheme, confusing young ESL learners on English morphology.  
  *Fix:* Replace with authentic agent/comparative words: `teach-er`, `read-er`, `learn-er`, `think-er`, `fast-er`.

---

### 3. `brain-hackers/`

- **[severity HIGH]** `brain-hackers/index.html:142`: `<p class="text-xs text-cyan-400 font-bold tracking-wider">Same Brain. A Brighter You! • مختبر الدماغ</p>`: Accidental Arabic text in header subtitle.  
  *Fix:* Replace with English: `<p class="text-xs text-cyan-400 font-bold tracking-wider">Same Brain. A Brighter You! • Brain Science Lab</p>`.

- **[severity HIGH]** `brain-hackers/js/brain-hackers-data.js:124-148`: `Cell Body (Soma)`, `Dendrites (Fibers)`, `Axon (Pathway)`, `Synapse (Connection)`: The module teaches microscopic cytology far above CEFR A1+ for 9-year-old Turkish ESL learners.  
  *Fix:* Retire module or simplify terminology to concrete analogies (*Command Center, Receiving Antennas, Sending Cable, Connection Bridge*).

---

### 4. `freeze-game/`

- **[severity LOW]** `freeze-game/js/freeze-data.js:47`: `roleInThinking: 'Processes images, recognizes colors, and creates mental mental pictures.'`: Duplicate word typo ("mental mental").  
  *Fix:* Remove duplicate word to read `"creates mental pictures."`.

---

### 5. `brain/` ("The Day Your Brain Quit!")

- **[severity LOW]** `brain/js/brain-data.js:11`: `unit: "Unit 1 Page 17 (RG2)"`: Textbook acronym RG2 (*Global Readings 2*) used instead of GR3 (*Global Readings 3*).  
  *Fix:* Change to `"Unit 1 Page 17 (Global Readings 3)"`.

---

## Part 3: One-Page Executive Summary — Top 10 Most Critical Problems

1. **Firefighter Putting Out Water (`js/school-store.js:9031`):**  
   Fact/language absurdity in `quiz-1` asking which tool a firefighter uses to "put out water" instead of "put out a fire".
2. **Kingfisher Bird Keyed to "Both Texts" (`quiz-briefing/index.html:1393`):**  
   Factual scoring error marking Kingfisher & Bullet Train as appearing in both fiction and nonfiction, when it is exclusively in Nonfiction biomimicry.
3. **Inverted Chronology in Progress Check Key (`js/school-store.js:6209`):**  
   The answer key requires `Order: 2 -> 1 -> 3` (tests before painting), contradicting the reading passage where Tom builds, paints, and then tests his robot.
4. **Wonderland Characters in Grade 3 Inventions Quest (`quiz-briefing/index.html:1360` & `js/school-store.js:8948`):**  
   Grade 4 Alice in Wonderland roles (*The Mad Hatter, Alice, White Rabbit, Cheshire Cat*) and Tea Party subtitle were copy-pasted into the Grade 3 Inventions Master Quest.
5. **Grade 4 Progress Check Content Mismatch (`js/school-store.js:6287`):**  
   Grade 4 progress check completely omits Alice in Wonderland and Brain Learning, instead testing Grade 3 robot stories alongside kindergarten listening items ("circle the biggest ball").
6. **Mismatched Game Routes in Curriculum Lessons (`js/school-store.js:1290, 1394, 1452, 2043`):**  
   Curriculum lessons route students to unrelated modules (`monster-day` for inventions and brain synthesis; `predictions` for sequence words; `advice` for engineering loops).
7. **Foreign Script Leaks in Game Headers (`good-ideas-lab/index.html:6, 150` & `brain-hackers/index.html:142`):**  
   Accidental Arabic text (`مختبر الأفكار`, `مختبر الدماغ`) appears in page titles and navigation headers for Turkish-speaking primary students.
8. **Inverted Device Sequence in Clara's Human Tablet (`clara-inventor/js/clara-data.js:404`):**  
   Instructional sequence lists "Press play" as step 1 and "Press on" as step 4, instructing children to start an app before turning power on.
9. **University Neuroanatomy Ceiling Breaker (`brain-hackers` & `quiz-briefing/index.html:1565`):**  
   Grade 4 A1+ students are tested on medical lobe names (*Parietal, Occipital*) and cytology (*soma, axon, dendrites, fMRI*) not taught in the textbook.
10. **Phonics Pattern Mismatch in Grade 4 Master Quest (`quiz-briefing/index.html:1651`):**  
    Task 3 tests non-agent root nouns (*river, center, fiber, corner*) instead of the curriculum's target agent/comparative *-er* morphemes (*reader, learner, thinker, faster*).
