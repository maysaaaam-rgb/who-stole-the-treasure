/**
 * ENGLISH ADVENTURE ACADEMY — STANDARDIZED EDUCATIONAL RESOURCE REGISTRY
 * Authoritative Single Source of Truth for all 21 classroom games, stories, CLIL modules, and textbooks.
 * Preserves 100% legacy compatibility while exposing standardized pedagogical schema.
 */

const GAMES_REGISTRY = [
  {
  "id": "wonderland-lesson1",
  "title": "Welcome to Wonderland — Lesson 1: Play & Prop Prep",
  "description": "Magical 12-screen interactive adventure for Grade 3 (A1). Students explore the enchanted forest, meet 9 Wonderland characters, match signature theatre props, discover the Past Simple with the Time Machine, practice physical TPR acting, and unlock the Workshop Chest for their upcoming classroom play.",
  "type": "game",
  "category": "Speaking Games",
  "categoryLabel": "🗣️ Speaking Games",
  "level": "A1",
  "cefrLevel": "A1",
  "age": "Ages 7–10",
  "ageGroup": "7-10",
  "grade": "Grade 3",
  "grades": [
    "Grade 3"
  ],
  "duration": 35,
  "durationText": "35 min",
  "estimatedMinutes": 35,
  "xp": 100,
  "skills": [
    "Speaking",
    "Listening",
    "Vocabulary",
    "Grammar",
    "TPR / Drama"
  ],
  "topic": "Alice in Wonderland & Classroom Play Prep",
  "topics": [
    "Alice in Wonderland",
    "Theatre Props",
    "Characters",
    "Past Simple",
    "TPR Drama"
  ],
  "languageFocus": "Wonderland Characters & Props, Past Simple affirmative (went, saw, opened, found, met), Now vs Yesterday contrast",
  "activityMode": "Whole Class Smart Board Interactive / Drama Workshop Prep",
  "interactionType": "Interactive Story Stage with Scavenger Hunt, Prop Match, Time Machine & Workshop Chest",
  "difficulty": "Scaffolded A1",
  "tags": [
    "wonderland",
    "alice",
    "play",
    "props",
    "past-simple",
    "tpr",
    "speaking",
    "listening",
    "interactive-lesson",
    "grade-3"
  ],
  "learningObjectives": [
    "Identify 9 core Alice in Wonderland characters and their single A1 descriptions",
    "Connect 5 signature theatre props (hat, clock, heart, cat mask, key) to characters in preparation for play workshop",
    "Recognize completed past actions using high-frequency verbs: went, saw, opened, found, met",
    "Perform physical TPR drama gestures representing story events and produce an oral exit ticket sentence"
  ],
  "teacherInstructions": "Launch on the Smart Board. Use touch interactions for Scavenger Hunt, matching, Time Machine, and chest opening. Press T anytime for the teacher guide.",
  "studentInstructions": "Step into Wonderland! Meet the White Rabbit, find hidden treasures, match theatre props, and get ready for our classroom play!",
  "route": "wonderland/index.html",
  "worksheet": "wonderland/worksheet.html",
  "worksheetRoute": "wonderland/worksheet.html",
  "teacherGuide": true,
  "supportsAssignment": true,
  "supportsProgress": true,
  "featured": true,
  "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"wlThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#1e1b4b\"/><stop offset=\"60%\" stop-color=\"#2e1065\"/><stop offset=\"100%\" stop-color=\"#064e3b\"/></linearGradient></defs><rect width=\"200\" height=\"140\" fill=\"url(#wlThumbBg)\"/><rect x=\"12\" y=\"12\" width=\"176\" height=\"116\" rx=\"12\" fill=\"#0f172a\" opacity=\"0.6\" stroke=\"#f59e0b\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#f59e0b\" opacity=\"0.25\"/><text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🐇</text><rect x=\"25\" y=\"92\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/><text x=\"100\" y=\"107\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#000000\" text-anchor=\"middle\" letter-spacing=\"0.5\">WONDERLAND PLAY 1</text></svg>"
},

  {
    id: "story-engine-alice",
    title: "Alice in Wonderland: The Story Adventure",
    description: "Full 9-chapter playable children's adventure with invisible adaptive AI learning: follow the White Rabbit, fall down the well, shrink & grow in the Hall of Doors, solve Caterpillar & Cheshire Cat riddles, join the Mad Tea Party, and stand your ground at the Royal Court!",
    type: "story_adventure",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1–A1+",
    cefrLevel: "A1–A1+",
    age: "Ages 7–12",
    ageGroup: "7-12",
    grade: "Grades 2–6",
    grades: ["Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 45,
    durationText: "40–50 min",
    estimatedMinutes: 45,
    xp: 300,
    skills: ["Reading", "Listening", "Speaking", "Vocabulary", "Exploration", "Problem Solving"],
    topic: "Alice in Wonderland & Adaptive English Learning",
    topics: ["Action Verbs", "Spatial Directions", "Size Transformations", "Contextual Dialogue", "Speaking Challenges"],
    languageFocus: "Target Verbs (follow, fall, drink, eat, paint, stand), Adjectives (small, big, tall, short, clean, late), Questions (Who are you? Which way?)",
    activityMode: "Playable 2.5D Adventure Game",
    interactionType: "Real 2D/2.5D Player Movement, NPC Dialogue, Adaptive Hints, In-Game Speaking",
    difficulty: "Adaptive (Supportive / Standard / Challenging)",
    tags: ["alice", "wonderland", "adventure", "story", "adaptive", "ai-director", "speaking", "listening", "vocabulary", "cefr-a1"],
    learningObjectives: [
      "Follow narrative instructions given by Wonderland characters in authentic contexts",
      "Demonstrate behavioral comprehension through direct in-world physical actions",
      "Participate in spoken dialogue moments using character voice and target phrases",
      "Develop durable vocabulary mastery across multiple story chapters (A1–A1+ CEFR)"
    ],
    teacherInstructions: "Assign directly to classes or individual learners. The AI Game Director automatically tracks vocabulary, listening, and speaking competencies without quizzes.",
    studentInstructions: "Explore Wonderland as Alice! Follow the White Rabbit, solve magical puzzles, and talk with friends along the path!",
    route: "story-engine/index.html?story=alice",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `<svg viewBox="0 0 400 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="aliceBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="50%" stop-color="#064e3b"/><stop offset="100%" stop-color="#022c22"/></linearGradient><linearGradient id="clockGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#ca8a04"/></linearGradient></defs><rect width="400" height="220" fill="url(#aliceBg)"/><circle cx="200" cy="100" r="70" fill="#38bdf8" opacity="0.15"/><circle cx="200" cy="100" r="42" fill="url(#clockGold)" stroke="#fef08a" stroke-width="3"/><circle cx="200" cy="100" r="35" fill="#fefce8"/><line x1="200" y1="100" x2="200" y2="76" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/><line x1="200" y1="100" x2="218" y2="108" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/><circle cx="200" cy="54" r="6" stroke="#ca8a04" stroke-width="2.5" fill="none"/><text x="120" y="140" font-size="34">🐇</text><text x="270" y="140" font-size="34">🍄</text><text x="200" y="192" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1">ALICE IN WONDERLAND</text><text x="200" y="210" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#93c5fd" text-anchor="middle" letter-spacing="0.5">ADAPTIVE AI STORY ADVENTURE • CEFR A1/A1+</text></svg>`
  },
  {
    id: "story-engine-forest",
    title: "Interactive Story Adventure: Forest Clearing",
    description: "2.5D playable story adventure foundation: control an explorer character, navigate forest obstacles, talk to the Forest Ranger, solve the Golden Key quest, and unlock the Ancient Gate.",
    type: "story_adventure",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 7–11",
    ageGroup: "7-11",
    grade: "Grades 2–5",
    grades: ["Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    duration: 30,
    durationText: "25–35 min",
    estimatedMinutes: 30,
    xp: 50,
    skills: ["Reading", "Listening", "Vocabulary", "Exploration", "Problem Solving"],
    topic: "Forest Exploration & Quest Solving",
    topics: ["Exploration", "Forest Quests", "Direction & Movement", "Key Vocabulary"],
    languageFocus: "Action Verbs, Prepositions (near, behind, to), Keys & Doors",
    activityMode: "Playable 2.5D Adventure Game",
    interactionType: "Real 2D Player Movement & World Exploration",
    difficulty: "Beginner",
    tags: ["adventure", "story", "game", "exploration", "quest", "forest", "keys", "interactive"],
    learningObjectives: [
      "Follow narrative instructions given by an in-game NPC",
      "Navigate a 2.5D game environment using spatial vocabulary (north, behind, near)",
      "Recognize and collect key items to solve contextual problems",
      "Demonstrate reading comprehension through direct gameplay actions"
    ],
    teacherInstructions: "Project onto classroom screen or assign to individual student devices. Encourage learners to read the Ranger's speech bubble aloud before exploring.",
    studentInstructions: "Use arrow keys or tap to explore the forest! Talk to the Ranger, find the hidden Golden Key, and unlock the Ancient Gate!",
    route: "story-engine/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    featured: true,
    thumbnailSvg: `<svg viewBox="0 0 400 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="forestTh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#022c22"/></linearGradient></defs><rect width="400" height="220" fill="url(#forestTh)"/><circle cx="200" cy="110" r="80" fill="#047857" opacity="0.4"/><path d="M 60 170 Q 200 130 340 170" stroke="#78350f" stroke-width="32" stroke-linecap="round" fill="none"/><circle cx="90" cy="80" r="38" fill="#15803d"/><circle cx="310" cy="90" r="42" fill="#166534"/><circle cx="200" cy="90" r="24" fill="#f59e0b" opacity="0.3"/><text x="200" y="100" font-size="34" text-anchor="middle">🗝️</text><text x="200" y="185" font-family="sans-serif" font-size="14" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1">PLAYABLE ADVENTURE</text></svg>`
  },
  {
    id: "simon-says-classroom",
    title: "Simon Says: Physical Classroom Game",
    description: "Teacher-led physical listening and reaction activity for the interactive smartboard. Features massive projector-friendly command displays, valid vs trick logic, procedural audio cues, natural TTS speech pronunciation, and +25 XP champion celebration.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "Pre-A1–A2",
    cefrLevel: "Pre-A1–A2",
    age: "Ages 5–12",
    ageGroup: "5-12",
    grade: "Grades 1–6",
    grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 20,
    durationText: "15–20 min",
    estimatedMinutes: 20,
    xp: 25,
    skills: ["Listening", "Physical Response", "Vocabulary", "Focus", "Action Verbs"],
    topic: "Action Verbs, Body Parts & Imperatives",
    topics: ["Body Parts", "Action Verbs", "Movement Commands", "Classroom Instructions", "Imperative Grammar"],
    languageFocus: "Imperatives (Touch, Jump, Turn, Raise, Freeze) & Simon Says Conditional Rules",
    activityMode: "Classroom / Physical Whole Group",
    interactionType: "Teacher-Led Smartboard Physical Activity",
    difficulty: "All Levels (Adaptive Speed)",
    tags: ["simon-says", "listening", "speaking", "total-physical-response", "tpr", "movement", "smartboard", "projector", "toolkit"],
    learningObjectives: [
      "Follow spoken imperative instructions with instant Total Physical Response (TPR)",
      "Distinguish between valid commands ('Simon says...') and trick commands",
      "Reinforce vocabulary for body parts, classroom actions, and spatial directions",
      "Build joyful whole-class listening focus and kinesthetic energy"
    ],
    teacherInstructions: "Launch on your interactive whiteboard or projector. Have all students stand up. Tap any student to eliminate them when you observe them moving on a trick or performing the wrong action.",
    studentInstructions: "Listen carefully! Only do the action if Simon says! If you move without Simon says, you are out!",
    route: "#simon-says",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="simonCardBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#022c22"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#simonCardBg)"/>
        <rect x="20" y="20" width="160" height="100" rx="14" fill="#042f2e" stroke="#10b981" stroke-width="2.5"/>
        <circle cx="100" cy="55" r="22" fill="#10b981" opacity="0.25"/>
        <text x="100" y="62" font-size="28" text-anchor="middle">🗣️</text>
        <rect x="35" y="86" width="130" height="22" rx="11" fill="#059669"/>
        <text x="100" y="101" font-family="sans-serif" font-weight="900" font-size="11" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">SIMON SAYS 🏆</text>
      </svg>`
  },
  {
    id: "yesterday-detectives",
    title: "The Mystery of Yesterday: A Past Simple Detective Adventure",
    description: "Complete 35-minute interactive ESL adventure for Grade 3–4 (A1/A1+) learners. Students investigate a shaking mystery box, sprint in the physical Smart Board verb challenge, detect Two Truths and One Lie, interrogate Barnaby the Berry Monster with 'Did you...?', build suspect statements, and unlock the final treasure box with +100 XP!",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1/A1+",
    cefrLevel: "A1/A1+",
    age: "Ages 8–10",
    ageGroup: "8-10",
    grade: "Grade 3–4",
    grades: ["Grade 3", "Grade 4"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 150,
    skills: ["Grammar", "Listening", "Speaking", "Reading", "Vocabulary", "Deduction"],
    topic: "Past Simple Tense & Mystery Investigation",
    topics: ["Past Simple", "Regular Verbs (-ED)", "Irregular Verbs", "Questions with Did", "Negatives with Didn't", "Timeline Deductions"],
    languageFocus: "Past Simple Affirmative (played, went, ate), Questions (Did you go?), Negatives (didn't eat), and Did + base verb rule",
    activityMode: "Interactive Whole Group / Pair Investigation",
    interactionType: "Interactive Game-Based Lesson with Team Scoreboard & Evidence System",
    difficulty: "Scaffolded (A1+ to Hard Mode)",
    tags: ["past-simple", "detective", "grammar", "mystery", "did", "irregular-verbs", "regular-verbs", "speaking", "listening", "interactive-lesson"],
    learningObjectives: [
      "Differentiate and use regular (-ED) and irregular past simple verbs in authentic contexts",
      "Form affirmative, negative (didn't + base verb), and question (Did + base verb) structures accurately",
      "Apply past tense knowledge to interrogate suspects, evaluate evidence, and detect factual lies",
      "Produce a structured 5-event personal narrative containing believable past statements"
    ],
    teacherInstructions: "Launch on the smartboard or assign to student teams. Use the teacher control panel to jump between the 14 scaffolded stages and manage team points.",
    studentInstructions: "Grab your magnifying glass, Detective! Examine clues from yesterday, catch the suspect's lies, and crack the case of the missing memory!",
    route: "detectives/index.html",
    worksheet: "detectives/worksheet.html",
    worksheetRoute: "detectives/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="detThumbBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#detThumbBg)"/>
        <rect x="15" y="15" width="170" height="110" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,4"/>
        <circle cx="100" cy="55" r="28" fill="#f59e0b" opacity="0.2"/>
        <text x="100" y="66" font-size="34" text-anchor="middle">🕵️</text>
        <rect x="25" y="90" width="150" height="22" rx="11" fill="#f59e0b"/>
        <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="10" fill="#000000" text-anchor="middle" letter-spacing="0.5">YESTERDAY DETECTIVES</text>
      </svg>`
  },
  {
    id: "inventor-lab",
    title: "Inventor Lab: What Does It Take to Be an Inventor?",
    description: "Interactive classroom ESL lesson based on Global Readings Unit 1. Students become junior inventors, investigate a mystery room with clickable hotspots, practice See/Think/Wonder, read Clara Doodle's story with evidence highlighting, test inventor mindsets, and engineer their own invention.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1+",
    cefrLevel: "A1+/A2",
    age: "Ages 8–12",
    ageGroup: "8-12",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 50,
    durationText: "45–50 min",
    estimatedMinutes: 50,
    xp: 150,
    skills: ["Speaking", "Reading", "Vocabulary", "Prediction", "Critical Thinking", "Reasoning"],
    topic: "Invention, Problem Solving & Clara Doodle",
    topics: ["Invention Cycle", "See Think Wonder", "Clara Doodle", "Try Again Mindset", "Persistence", "Problem Solving"],
    languageFocus: "I see..., I think..., Maybe..., I think [X] because [Y], It can [verb], It helps [noun]",
    activityMode: "Interactive Whole Group / Team Lab",
    interactionType: "Interactive Smartboard Lesson with Dual-Team Scoreboard & Studio Builder",
    difficulty: "Scaffolded (A1+ to A2)",
    tags: ["inventor", "reading", "speaking", "global-readings", "clara-doodle", "see-think-wonder", "problem-solving", "stem"],
    learningObjectives: [
      "Distinguish direct observations (I SEE) from inferences (I THINK) and speculations (MAYBE)",
      "Understand and explain the 5-stage invention cycle (Idea, Plan, Build, Change, Solve)",
      "Read Clara Doodle's story and locate exact textual evidence to answer questions",
      "Adopt an inventor's persistence mindset: make changes and always try again",
      "Design an original invention and present it using structured pitch frames"
    ],
    teacherInstructions: "Launch on the smartboard for whole-class engagement. Use the dual-team scoreboard to reward speaking participation. Guide students to discover the core concept: inventors make changes and try again!",
    studentInstructions: "Welcome to the Inventor Lab! Inspect clues, help Clara Doodle test her inventions, and design your own machine!",
    route: "inventor-lab/index.html",
    worksheet: "inventor-lab/worksheet.html",
    worksheetRoute: "inventor-lab/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="invThumbBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0b1329"/>
            <stop offset="100%" stop-color="#152754"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#invThumbBg)"/>
        <rect x="15" y="15" width="170" height="110" rx="12" fill="#132247" stroke="#06b6d4" stroke-width="2" stroke-dasharray="5,3"/>
        <circle cx="100" cy="55" r="26" fill="#06b6d4" opacity="0.2"/>
        <text x="100" y="66" font-size="34" text-anchor="middle">💡</text>
        <rect x="25" y="90" width="150" height="22" rx="11" fill="#f59e0b"/>
        <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="10" fill="#0b1329" text-anchor="middle" letter-spacing="0.5">INVENTOR LAB ⚙️</text>
      </svg>`
  },
  {
    id: "clara-inventor",
    title: "Clara's Inventor Mystery & The Inventor Challenge",
    description: "Two energetic, interactive 35-minute ESL lessons based on Global Readings 2 (pp. 10–17). Lesson 1 explores Clara's workshop, 5 bizarre inventions, 6 reading detective missions, and 4-Corners True/False. Lesson 2 teaches SEQUENCE (First, Second, Third, Last), the Human Tablet game, and the 4-Stage Inventor Process.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 8–12",
    ageGroup: "8-12",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 70,
    durationText: "2 × 35 min",
    estimatedMinutes: 70,
    xp: 250,
    skills: ["Reading", "Speaking", "Vocabulary", "Sequencing", "Deduction", "Phonics"],
    topic: "Inventions, Sequence & Problem Solving",
    topics: ["Inventions", "Clara Doodle", "Sequence Words", "First Second Third Last", "4 Stages of Inventing", "Phonics CL"],
    languageFocus: "First, Second, Third, Last, It can [verb], This invention is for [noun], What does it do?",
    activityMode: "Interactive Whole Group / Pair Investigation / Kinesthetic 4-Corners",
    interactionType: "Interactive Game-Based Lessons with Dual-Team Scoreboard, Tablet Simulator & Pitch Stage",
    difficulty: "Scaffolded (A1+ to Hard Mode)",
    tags: ["clara-doodle", "inventions", "sequence", "first-second-third-last", "reading-detective", "four-corners", "phonics-cl", "stem"],
    learningObjectives: [
      "Understand Clara Doodle's story and locate textual evidence for 6 reading missions",
      "Identify 5 wacky inventions and explain their primary functions in simple sentences",
      "Master temporal sequencing words: First, Second, Third, and Last in oral and written tasks",
      "Apply the 4-stage inventor process (Idea, Plan, Make, Test) to solve real-world dilemmas",
      "Pronounce and identify initial CL- consonant blends (climb, clue, cloud, close, clap)"
    ],
    teacherInstructions: "Launch on the smartboard for whole-class engagement. Switch between Lesson 1 (35m) and Lesson 2 (35m) using the top HUD tabs. Utilize the dual-team scoreboard and printable companion worksheet.",
    studentInstructions: "Join Clara Doodle's workshop! Crack 6 reading mysteries, test the Human Tablet, arrange the 4-stage sequence, and build your own wacky invention!",
    route: "clara-inventor/index.html",
    worksheet: "clara-inventor/worksheet.html",
    worksheetRoute: "clara-inventor/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="claraThumbBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0a1124"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#claraThumbBg)"/>
        <rect x="15" y="15" width="170" height="110" rx="12" fill="#0f1c38" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5,3"/>
        <circle cx="70" cy="52" r="22" fill="#38bdf8" opacity="0.2"/>
        <text x="70" y="62" font-size="28" text-anchor="middle">💡</text>
        <circle cx="130" cy="52" r="22" fill="#fbbf24" opacity="0.2"/>
        <text x="130" y="62" font-size="28" text-anchor="middle">📱</text>
        <rect x="25" y="90" width="150" height="22" rx="11" fill="#38bdf8"/>
        <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="9" fill="#041226" text-anchor="middle" letter-spacing="0.5">CLARA'S INVENTOR MYSTERY 🚀</text>
      </svg>`
  },
  {
    id: "alice-quest",
    title: "Alice's Wonderland Reading Quest & The Skimming Detectives",
    description: "Two energetic, interactive 35-minute ESL lessons based on Reading Book 3 (pp. 16–17). Lesson 1 explores the 6-event story sequence, 4 feeling monsters (worried, bored, surprised, interested), and the Mystery Door creative studio. Lesson 2 trains Eagle Eye Skimming Detectives (38 cm, golden key, garden), Skim vs. Read Carefully, and the 'Learning and Your Brain' superpower challenge.",
    type: "game",
    category: "Reading Games",
    categoryLabel: "📖 Reading Games",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 8–12",
    ageGroup: "8-12",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 70,
    durationText: "2 × 35 min",
    estimatedMinutes: 70,
    xp: 250,
    skills: ["Reading", "Speaking", "Vocabulary", "Sequencing", "Feelings & Emotions", "Skimming", "Creative Writing"],
    topic: "Story Sequence, Feelings, Skimming & Brain Power",
    topics: ["Alice in Wonderland", "Story Sequence", "Feelings: Worried Bored Surprised Interested", "Skimming", "Main Idea", "Learning and Your Brain", "Mystery Door"],
    languageFocus: "First / Then / Next / Finally, Alice felt [feeling] because [reason], Look quickly! Don't read every word! Behind the door there is [noun]",
    activityMode: "Interactive Whole Group / Pair Skim Relay / Kinesthetic Rabbit Jump",
    interactionType: "Interactive Game-Based Lessons with Timed Skim Drills, Feeling Monster Morphing, Story Card Drag-Drop & Boss Battles",
    difficulty: "Scaffolded (A1+ to Hard Mode)",
    tags: ["alice-in-wonderland", "reading-book-3", "sequence", "feelings", "skimming", "speed-skim", "brain-power", "mystery-door"],
    learningObjectives: [
      "Sequence the 6 canonical events of Alice in Wonderland chronologically from memory and textual clues",
      "Identify and use 4 key feelings: worried, bored, surprised, and interested with 'because' causal frames",
      "Master the reading strategy of skimming: look quickly to find main ideas and specific details without reading every word",
      "Locate target details (38 cm, golden key, garden) in under 10 seconds using Eagle Eye scanning",
      "Express creative ideas using the Mystery Door studio: 'Behind my door there is a...'"
    ],
    teacherInstructions: "Launch on the smartboard for whole-class engagement. Switch between Lesson 1 (35m) and Lesson 2 (35m) using the top HUD tabs. Utilize the 8-dimension Teacher HUD modal and printable companion worksheet.",
    studentInstructions: "Join Alice down the rabbit hole! Put the story in order, feed the feeling monsters, master the 5-second Speed Skim challenge, and unlock the secret garden!",
    route: "alice-quest/index.html",
    worksheet: "alice-quest/worksheet.html",
    worksheetRoute: "alice-quest/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aliceThumbBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#311042"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#aliceThumbBg)"/>
        <rect x="15" y="15" width="170" height="110" rx="12" fill="#061f1c" stroke="#2dd4bf" stroke-width="2.5" stroke-dasharray="5,3"/>
        <circle cx="65" cy="52" r="22" fill="#2dd4bf" opacity="0.25"/>
        <text x="65" y="62" font-size="28" text-anchor="middle">🐇</text>
        <circle cx="135" cy="52" r="22" fill="#fbbf24" opacity="0.25"/>
        <text x="135" y="62" font-size="28" text-anchor="middle">🔑</text>
        <rect x="25" y="90" width="150" height="22" rx="11" fill="#2dd4bf"/>
        <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="9" fill="#041226" text-anchor="middle" letter-spacing="0.5">ALICE'S READING QUEST 📖</text>
      </svg>`
  },
  {
    id: "robots",
    title: "Amazing Robots Around the World",
    description: "Interactive STEM & WH-Questions ESL lesson: explore 5 real-world biomimetic and rescue robots, practice What/Where/When/Who/Why/How, read authentic dossiers, and present team discoveries.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1–A2",
    cefrLevel: "A1–A2",
    age: "Ages 9–12",
    ageGroup: "9-12",
    grade: "Grades 4–6",
    grades: ["Grade 4", "Grade 5", "Grade 6"],
    duration: 65,
    durationText: "60–70 min",
    estimatedMinutes: 65,
    xp: 100,
    skills: ["Reading", "Speaking", "Listening", "Vocabulary", "Teamwork"],
    topic: "WH-Questions & Real-World Robotics",
    topics: ["WH-Questions", "Real-World Robotics", "Biomimetic Science", "Search & Rescue"],
    languageFocus: "WH-Questions (What, Where, When, Who, Why, How)",
    activityMode: "Classroom / Whole Group",
    interactionType: "Interactive STEM Dossier & Presentation",
    difficulty: "Intermediate",
    tags: ["robots", "science", "stem", "questions", "wh-questions", "dossier", "teamwork"],
    learningObjectives: [
      "Master the 6 WH-question forms (What, Where, When, Who, Why, How)",
      "Read and extract factual information from real scientific robot dossiers",
      "Differentiate real engineering capabilities from imaginary guesses",
      "Collaborate in teams of 3–4 to present a discovery to the class"
    ],
    teacherInstructions: "Group students into research squads. Assign one robot dossier to each squad, have them complete the WH-matrix, and conduct a 2-minute press conference presentation.",
    studentInstructions: "Explore the secret robot files, find answers to the WH-questions, and present your team's robot to the class!",
    route: "robots/index.html",
    worksheet: "robots/worksheet.html",
    worksheetRoute: "robots/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#0f172a"/>
        <path d="M 10 30 L 50 30 L 70 50 L 130 50 L 150 30 L 190 30" stroke="#0284c7" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M 20 110 L 60 110 L 80 90 L 120 90 L 140 110 L 180 110" stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.6"/>
        <rect x="55" y="42" width="90" height="56" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="80" cy="70" r="10" fill="#0284c7"/>
        <circle cx="80" cy="70" r="5" fill="#38bdf8"/>
        <circle cx="80" cy="70" r="2" fill="#ffffff"/>
        <circle cx="120" cy="70" r="10" fill="#0284c7"/>
        <circle cx="120" cy="70" r="5" fill="#38bdf8"/>
        <circle cx="120" cy="70" r="2" fill="#ffffff"/>
        <line x1="100" y1="42" x2="100" y2="24" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="100" cy="20" r="5" fill="#f59e0b"/>
        <rect x="25" y="112" width="150" height="18" rx="4" fill="#0284c7"/>
        <text x="100" y="125" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">AMAZING ROBOTS 🤖</text>
      </svg>`
  },
  {
    id: "feelings",
    title: "How Would You Feel?",
    description: "Interactive A1+ situational thinking lesson: evaluate real-life, funny & challenging dilemmas, choose appropriate emotions, and speak using natural chunks.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grades 2–4",
    grades: ["Grade 2", "Grade 3", "Grade 4"],
    duration: 45,
    durationText: "45–50 min",
    estimatedMinutes: 45,
    xp: 75,
    skills: ["Speaking", "Vocabulary", "Listening"],
    topic: "Feelings, Emotions & Situational Reactions",
    topics: ["Feelings & Emotions", "Situational Reactions", "Hypothetical Speaking Chunks"],
    languageFocus: "I'd feel... / I would feel [emotion] because...",
    activityMode: "Classroom / Whole Group",
    interactionType: "Situational Dilemma & Voting Stage",
    difficulty: "Elementary",
    tags: ["feelings", "emotions", "speaking", "reactions", "chunks", "sel"],
    learningObjectives: [
      "Identify and use common and A1+ feelings and emotions",
      "Express emotional reactions using 'I'd feel...'",
      "Formulate justified actions using 'I'd... because...'",
      "Connect authentic dilemmas to appropriate emotional coping strategies"
    ],
    teacherInstructions: "Project each dilemma on the whiteboard. Prompt students to vote using thumbs up/down or emoji cards, then call on pairs to explain their emotional rationale.",
    studentInstructions: "Read the story dilemma, choose how you would feel, and tell your partner what you would do next!",
    route: "feelings/index.html",
    worksheet: "feelings/worksheet.html",
    worksheetRoute: "feelings/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <circle cx="65" cy="65" r="32" fill="#fbbf24"/>
        <circle cx="56" cy="58" r="4.5" fill="#1e293b"/>
        <circle cx="74" cy="58" r="4.5" fill="#1e293b"/>
        <path d="M 54 75 Q 65 88 76 75" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 105 35 L 180 35 Q 188 35 188 43 L 188 85 Q 188 93 180 93 L 125 93 L 110 108 L 115 93 L 105 93 Q 97 93 97 85 L 97 43 Q 97 35 105 35 Z" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
        <text x="142" y="58" font-family="sans-serif" font-weight="900" font-size="11" fill="#b45309" text-anchor="middle">HOW WOULD</text>
        <text x="142" y="74" font-family="sans-serif" font-weight="900" font-size="12" fill="#d97706" text-anchor="middle">YOU FEEL? 🎭</text>
        <rect x="25" y="112" width="150" height="18" rx="4" fill="#3b82f6"/>
        <text x="100" y="125" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">THINK • CHOOSE • REACT</text>
      </svg>`
  },
  {
    id: "firefighter",
    title: "Fire Station Adventure",
    description: "Interactive story about firefighters, emergency equipment, siren audio, and a tap-to-extinguish water hose simulation.",
    type: "story",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 7–9",
    ageGroup: "7-8",
    grade: "Grades 2–4",
    grades: ["Grade 2", "Grade 3", "Grade 4"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 60,
    skills: ["Speaking", "Listening", "Vocabulary"],
    topic: "Community Helpers & Emergencies",
    topics: ["Community Helpers", "Emergencies", "Action Verbs", "Safety Equipment"],
    languageFocus: "Action verbs & Community Helper vocabulary (hose, helmet, alarm, rescue)",
    activityMode: "Classroom / Whole Group",
    interactionType: "Interactive Story & Hose Drill",
    difficulty: "Beginner",
    tags: ["firefighter", "emergency", "community", "story", "listening", "safety"],
    learningObjectives: [
      "Identify and name 6 key firefighter emergency tools",
      "Follow and recite step-by-step emergency evacuation instructions",
      "Use present action verbs (spraying water, climbing the ladder, sounding the siren)"
    ],
    teacherInstructions: "Lead whole-class choral drill of emergency action verbs. Let students take turns operating the interactive water hose simulator.",
    studentInstructions: "Sound the fire alarm, put on your gear, and work with your squad to put out the fire!",
    route: "firefighter/index.html",
    worksheet: "firefighter/worksheet.html",
    worksheetRoute: "firefighter/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fee2e2"/>
        <rect x="25" y="30" width="150" height="110" rx="4" fill="#fca5a5"/>
        <rect x="50" y="65" width="100" height="75" rx="3" fill="#ef4444"/>
        <line x1="50" y1="85" x2="150" y2="85" stroke="#dc2626" stroke-width="2"/>
        <line x1="50" y1="105" x2="150" y2="105" stroke="#dc2626" stroke-width="2"/>
        <line x1="50" y1="125" x2="150" y2="125" stroke="#dc2626" stroke-width="2"/>
        <rect x="68" y="85" width="64" height="42" rx="4" fill="#b91c1c"/>
        <rect x="74" y="90" width="52" height="16" rx="2" fill="#bae6fd"/>
        <circle cx="80" cy="122" r="6" fill="#1e293b"/>
        <circle cx="120" cy="122" r="6" fill="#1e293b"/>
        <rect x="94" y="80" width="12" height="5" rx="1" fill="#38bdf8"/>
      </svg>`
  },
  {
    id: "camp-mystery",
    title: "The Mystery at the Camp",
    description: "An interactive story adventure based on 'Don't Move'. Join Suzie and Mom in the dark windy forest, predict plot twists, solve cause & effect mysteries, and hunt phonics clues.",
    type: "story",
    category: "Reading Adventure & Mystery",
    categoryLabel: "📖 Reading Adventure",
    level: "A1/A1+",
    cefrLevel: "A1+",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grade 3",
    grades: ["Grade 3", "Grade 4"],
    duration: 50,
    durationText: "45–55 min",
    estimatedMinutes: 50,
    xp: 85,
    skills: ["Reading", "Listening", "Speaking", "Prediction", "Phonics"],
    topic: "Camping Mystery & Forest Animals",
    topics: ["Camping Narrative", "Atmosphere & Suspense", "Blends ST, TR, ND, NG", "Fact vs Opinion"],
    languageFocus: "Sequencing (First, Then, Next, Finally), Fact vs Opinion, Consonant Blends",
    activityMode: "Classroom / Whole Group",
    interactionType: "Interactive Reading & Investigation",
    difficulty: "Elementary",
    tags: ["mystery", "camp", "forest", "story", "blends", "phonics", "reading", "sequencing"],
    learningObjectives: [
      "Understand main narrative events and identify clues in a forest camping story",
      "Analyze cause-and-effect relationships and sequence events accurately",
      "Distinguish verifiable factual statements from subjective opinions",
      "Locate and decode phonics clusters (ST, TR, ND, NG) in context"
    ],
    teacherInstructions: "Read each scene aloud with expressive tension. Pause at the prediction points to have students vote on what is making the strange grunting sound.",
    studentInstructions: "Look for clues in the dark forest, sequence the story events, and solve the mystery of the campsite visitor!",
    route: "camp-mystery/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#0f172a"/>
        <polygon points="100,20 40,110 160,110" fill="#1e293b"/>
        <polygon points="100,25 45,105 155,105" fill="#0f766e"/>
        <polygon points="100,55 70,105 130,105" fill="#134e4a"/>
        <polygon points="100,75 85,105 115,105" fill="#facc15" opacity="0.8"/>
        <circle cx="165" cy="35" r="14" fill="#fef08a"/>
        <circle cx="160" cy="32" r="12" fill="#0f172a"/>
        <polygon points="25,60 10,110 40,110" fill="#064e3b"/>
        <polygon points="175,65 160,115 190,115" fill="#064e3b"/>
        <rect x="25" y="116" width="150" height="18" rx="4" fill="#0f766e"/>
        <text x="100" y="129" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">CAMP MYSTERY 🏕️</text>
      </svg>`
  },
  {
    id: "phonics-adventure",
    title: "Phonics Adventure: Blends & Digraphs",
    description: "Interactive sound detectives mission practicing SH, CH, ST, PL, FL, PR, and FR through audio recognition, reading, spelling challenges, and a 4-lock escape room.",
    type: "phonics",
    category: "Phonics & Literacy",
    categoryLabel: "🔤 Phonics & Literacy",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grades 3–4",
    grades: ["Grade 3", "Grade 4"],
    duration: 45,
    durationText: "40–50 min",
    estimatedMinutes: 45,
    xp: 80,
    skills: ["Phonics", "Listening", "Speaking", "Reading", "Spelling"],
    topic: "Digraphs & Consonant Blends",
    topics: ["Digraphs SH & CH", "Initial Blends ST, PL, FL", "Auditory Pairs PR & FR", "Phonics Escape Room"],
    languageFocus: "Digraphs (SH, CH) and Consonant Blends (ST, PL, FL, PR, FR)",
    activityMode: "Classroom / Whole Group",
    interactionType: "Audio Soundboard & Escape Room Challenge",
    difficulty: "Elementary",
    tags: ["phonics", "blends", "digraphs", "reading", "spelling", "escape-room", "audio"],
    learningObjectives: [
      "Hear, identify, and contrast minimal pairs (ship/chip, flag/frog)",
      "Unscramble target sound words and apply correct blend spellings",
      "Crack 4 security locks in the Sound Detectives Escape Room challenge"
    ],
    teacherInstructions: "Use the interactive audio soundboard for whole-class listening drills, then divide into small groups to crack the 4 Phonics Escape Room locks.",
    studentInstructions: "Listen carefully to the target sounds, spot the correct blends, and unlock the escape room chest!",
    route: "phonics/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#312e81"/>
        <circle cx="100" cy="65" r="38" fill="#4338ca"/>
        <circle cx="90" cy="55" r="26" fill="#6366f1" stroke="#fbbf24" stroke-width="4"/>
        <line x1="110" y1="75" x2="135" y2="100" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>
        <text x="90" y="64" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">SH</text>
        <rect x="25" y="114" width="150" height="18" rx="4" fill="#f59e0b"/>
        <text x="100" y="127" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">PHONICS DETECTIVE 🔤</text>
      </svg>`
  },
  {
    id: "monster-day",
    title: "Build Your Own Monster!",
    description: "Interactive real-time SVG monster creator workshop practicing body parts, colors, numbers, and 'It has got / I have got...' with speaking, listening, and secret monster modes.",
    type: "game",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "Pre-A1–A1+",
    cefrLevel: "A1",
    age: "Ages 5–9",
    ageGroup: "5-8",
    grade: "Grades 1–4",
    grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"],
    duration: 30,
    durationText: "25–35 min",
    estimatedMinutes: 30,
    xp: 60,
    skills: ["Speaking", "Vocabulary", "Listening", "Writing"],
    topic: "Body Parts & Descriptive Adjectives",
    topics: ["Body Parts", "Colors", "Have Got / Has Got", "Descriptive Adjectives"],
    languageFocus: "It has got [number] [color] [body parts] / I have got...",
    activityMode: "Interactive Creator Wizard / Whiteboard / Partner Challenges",
    interactionType: "Real-Time SVG Monster Builder with 12-Step Customizer & Speech Engine",
    difficulty: "Scaffolded (Pre-A1 to A1+)",
    tags: ["monster", "body-parts", "colors", "have-got", "adjectives", "creative", "speaking", "listening"],
    learningObjectives: [
      "Name 8 monster body parts (eyes, horns, wings, legs, teeth, fur, ears, mouth)",
      "Form complete spoken sentences with 'It has got...' and 'I have got...'",
      "Apply correct adjective order: Number + Color + Noun in description missions"
    ],
    teacherInstructions: "Have students dictate monster features to a student operator at the whiteboard, then have everyone write a 3-sentence description in their notebooks.",
    studentInstructions: "Choose body, eyes, horns, colors, and accessories to build your custom monster, then describe what it has got!",
    route: "monster-day/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="monsterThumbBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4c1d95"/>
            <stop offset="50%" stop-color="#7c3aed"/>
            <stop offset="100%" stop-color="#db2777"/>
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#monsterThumbBg)"/>
        <!-- Horns -->
        <polygon points="68,38 52,14 80,28" fill="#fbbf24"/>
        <polygon points="132,38 148,14 120,28" fill="#fbbf24"/>
        <!-- Monster Body -->
        <rect x="55" y="30" width="90" height="74" rx="36" fill="#a855f7" stroke="#ffffff" stroke-width="2.5"/>
        <!-- 3 Eyes -->
        <circle cx="76" cy="52" r="10" fill="#ffffff"/><circle cx="76" cy="52" r="4.5" fill="#0f172a"/><circle cx="74" cy="50" r="1.5" fill="#ffffff"/>
        <circle cx="100" cy="46" r="13" fill="#ffffff"/><circle cx="100" cy="46" r="6" fill="#0f172a"/><circle cx="98" cy="43" r="2" fill="#ffffff"/>
        <circle cx="124" cy="52" r="10" fill="#ffffff"/><circle cx="124" cy="52" r="4.5" fill="#0f172a"/><circle cx="122" cy="50" r="1.5" fill="#ffffff"/>
        <!-- Smile & Teeth -->
        <path d="M 76 76 Q 100 96 124 76" fill="#4c1d95" stroke="#ffffff" stroke-width="2"/>
        <polygon points="86,77 92,86 98,78" fill="#ffffff"/>
        <polygon points="102,78 108,86 114,77" fill="#ffffff"/>
        <!-- Label Badge -->
        <rect x="25" y="112" width="150" height="20" rx="10" fill="#fde047"/>
        <text x="100" y="126" font-family="sans-serif" font-weight="900" font-size="9.5" fill="#581c87" text-anchor="middle" letter-spacing="0.5">BUILD YOUR MONSTER! 👾</text>
      </svg>`
  },
  {
    id: "restaurant",
    title: "At the Restaurant",
    description: "Interactive dining role-play practicing 'I would like...', menu ordering, secret challenge cards, polite requests, and bill calculation.",
    type: "roleplay",
    category: "Role Plays",
    categoryLabel: "🎭 Role Plays",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 7–11",
    ageGroup: "7-8",
    grade: "Grades 2–5",
    grades: ["Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    duration: 40,
    durationText: "40 min",
    estimatedMinutes: 40,
    xp: 75,
    skills: ["Speaking", "Vocabulary", "Roleplay"],
    topic: "Food & Polite Requests",
    topics: ["Food & Drink", "Polite Requests", "Prices", "Restaurant Dialogue"],
    languageFocus: "I would like [food] please / How much is...?",
    activityMode: "Turn-taking & Pairs",
    interactionType: "Interactive Restaurant Stage & Bill Calculator",
    difficulty: "Elementary",
    tags: ["restaurant", "food", "roleplay", "polite", "ordering", "dialogue", "math"],
    learningObjectives: [
      "Order food politely using 'I would like... please'",
      "Ask for prices using 'How much is the...?'",
      "Act out natural waiter and customer conversational turns"
    ],
    teacherInstructions: "Distribute secret menu challenge cards to students. Pair students up as Waiter and Customer to perform interactive dialogues.",
    studentInstructions: "Look at the menu, decide what you want to eat, and politely place your order with the waiter!",
    route: "restaurant/index.html",
    worksheet: "restaurant/worksheets.html",
    worksheetRoute: "restaurant/worksheets.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ffedd5"/>
        <ellipse cx="100" cy="105" rx="60" ry="22" fill="#fed7aa"/>
        <rect x="94" y="105" width="12" height="28" fill="#c2410c"/>
        <ellipse cx="100" cy="90" rx="26" ry="9" fill="#e2e8f0"/>
        <path d="M 80 90 A 20 20 0 0 1 120 90 Z" fill="#94a3b8"/>
        <circle cx="100" cy="70" r="3" fill="#64748b"/>
        <rect x="45" y="50" width="24" height="34" rx="2" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "neighbourhood",
    title: "My Neighbourhood",
    description: "Living town exploration where students identify community locations, practice prepositions of place, and give walking tour directions.",
    type: "game",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 6–9",
    ageGroup: "7-8",
    grade: "Grades 1–3",
    grades: ["Grade 1", "Grade 2", "Grade 3"],
    duration: 30,
    durationText: "30 min",
    estimatedMinutes: 30,
    xp: 50,
    skills: ["Speaking", "Vocabulary", "Grammar"],
    topic: "Town Places & Prepositions",
    topics: ["Places in Town", "Prepositions of Place", "Directions", "There is / There are"],
    languageFocus: "Prepositions of place (next to, opposite, between, behind)",
    activityMode: "Classroom / Whole Group",
    interactionType: "Interactive Town Map & Coordinate Quests",
    difficulty: "Beginner",
    tags: ["town", "neighbourhood", "prepositions", "places", "map", "directions"],
    learningObjectives: [
      "Use spatial prepositions (next to, opposite, between) to describe locations",
      "Form complete sentences with 'There is a...' and 'There are...'",
      "Give simple 2-step walking directions across town"
    ],
    teacherInstructions: "Display the town map. Call out a starting point and destination, prompting students to formulate direction sentences.",
    studentInstructions: "Navigate the neighbourhood map, find the community buildings, and describe where they are located!",
    route: "neighbourhood/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ccfbf1"/>
        <rect x="0" y="60" width="200" height="24" fill="#94a3b8"/>
        <rect x="88" y="0" width="24" height="140" fill="#94a3b8"/>
        <rect x="25" y="18" width="40" height="32" rx="3" fill="#38bdf8"/>
        <polygon points="45,6 20,18 70,18" fill="#0284c7"/>
        <rect x="135" y="18" width="42" height="32" rx="3" fill="#f59e0b"/>
        <polygon points="156,6 130,18 182,18" fill="#d97706"/>
        <circle cx="45" cy="112" r="16" fill="#10b981"/>
        <rect x="42" y="118" width="6" height="16" fill="#78350f"/>
      </svg>`
  },
  {
    id: "advice",
    title: "The Crazy Advice Academy",
    description: "Practice modal verbs 'should' and 'shouldn't' by solving 10 hilarious everyday dilemmas with Professor Should.",
    type: "grammar",
    category: "Grammar Games",
    categoryLabel: "📚 Grammar Games",
    level: "A2",
    cefrLevel: "A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 70,
    skills: ["Grammar", "Speaking", "Problem Solving"],
    topic: "Modal Verbs: Should & Shouldn't",
    topics: ["Modal Verbs Should & Shouldn't", "Problem Solving", "Giving Recommendations"],
    languageFocus: "Modal verbs: You should [verb] / You shouldn't [verb]",
    activityMode: "Classroom / Whole Group",
    interactionType: "Dilemma Decision Tree & Advice Matrix",
    difficulty: "Intermediate",
    tags: ["advice", "grammar", "should", "modal-verbs", "problem-solving", "dilemmas"],
    learningObjectives: [
      "Form affirmative advice using 'You should...'",
      "Form negative warnings using 'You shouldn't...'",
      "Explain the rationale behind advice using 'because...'"
    ],
    teacherInstructions: "Present each dilemma to the class. Have students write down their best advice on whiteboards before revealing Professor Should's funny solution.",
    studentInstructions: "Help characters solve their wacky problems by giving them smart advice with 'should' and 'shouldn't'!",
    route: "advice/index.html",
    worksheet: "advice/worksheets.html",
    worksheetRoute: "advice/worksheets.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#e0f2fe"/>
        <circle cx="100" cy="60" r="26" fill="#facc15"/>
        <rect x="92" y="84" width="16" height="8" rx="1" fill="#94a3b8"/>
        <line x1="100" y1="24" x2="100" y2="14" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <line x1="128" y1="36" x2="136" y2="30" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <line x1="72" y1="36" x2="64" y2="30" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <rect x="40" y="70" width="32" height="42" rx="3" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
        <polyline points="48,86 52,90 58,82" fill="none" stroke="#10b981" stroke-width="2"/>
      </svg>`
  },
  {
    id: "predictions",
    title: "What Will Happen Next?",
    description: "Dramatic frozen cliffhangers where students predict future outcomes with WILL and WON'T before comic reveals.",
    type: "grammar",
    category: "Grammar Games",
    categoryLabel: "📚 Grammar Games",
    level: "A2",
    cefrLevel: "A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 30,
    durationText: "30 min",
    estimatedMinutes: 30,
    xp: 65,
    skills: ["Grammar", "Reading", "Speaking"],
    topic: "Future Predictions with WILL",
    topics: ["Future with Will & Won't", "Hypotheses", "Cause & Effect"],
    languageFocus: "Future predictions: It will... / He won't...",
    activityMode: "Classroom / Whole Group",
    interactionType: "Comic Cliffhanger & Reveal Stage",
    difficulty: "Intermediate",
    tags: ["predictions", "grammar", "will", "future", "won't", "comic", "cliffhanger"],
    learningObjectives: [
      "Formulate future predictions using 'will + base verb'",
      "Formulate negative predictions using 'won't + base verb'",
      "Defend hypotheses with evidence from visual scene clues"
    ],
    teacherInstructions: "Freeze each comic strip at the cliffhanger. Ask students to make predictions using 'I think he will...' before advancing to the reveal.",
    studentInstructions: "Examine the comic clues, predict what will happen next, and see if you guessed right!",
    route: "predictions/index.html",
    worksheet: "predictions/worksheets.html",
    worksheetRoute: "predictions/worksheets.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#f3e8ff"/>
        <circle cx="100" cy="65" r="32" fill="#c084fc"/>
        <circle cx="92" cy="56" r="10" fill="#ffffff" opacity="0.4"/>
        <path d="M 78 106 L 122 106 L 112 94 L 88 94 Z" fill="#6b21a8"/>
        <rect x="74" y="106" width="52" height="7" rx="2" fill="#581c87"/>
      </svg>`
  },
  {
    id: "city-mouse",
    title: "The City Mouse & The Country Mouse",
    description: "Interactive Aesop's fable contrasting urban skyscrapers with calm country fields and comparative adjectives.",
    type: "story",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grades 2–4",
    grades: ["Grade 2", "Grade 3", "Grade 4"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 60,
    skills: ["Reading", "Speaking", "Vocabulary"],
    topic: "Town vs Country & Comparatives",
    topics: ["City vs Country", "Contrasts", "Lifestyles", "Comparative Adjectives"],
    languageFocus: "Comparative adjectives: bigger, quieter, faster, cleaner",
    activityMode: "Classroom / Whole Group",
    interactionType: "Interactive Fable & Contrast Hotspots",
    difficulty: "Beginner",
    tags: ["fable", "city-mouse", "country-mouse", "reading", "comparatives", "story"],
    learningObjectives: [
      "Compare city and countryside environments using comparative adjectives",
      "Identify sensory adjectives in context (noisy, peaceful, dangerous, tasty)",
      "Retell the fable events and discuss moral choices"
    ],
    teacherInstructions: "Engage students in a Venn diagram activity comparing the two mice's houses and food.",
    studentInstructions: "Follow the mice to town and country, tap on hidden items, and compare city life with country life!",
    route: "city-mouse/index.html",
    worksheet: "city-mouse/worksheet.html",
    worksheetRoute: "city-mouse/worksheet.html",
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <rect x="105" y="20" width="28" height="100" fill="#94a3b8"/>
        <rect x="138" y="35" width="26" height="85" fill="#64748b"/>
        <path d="M 0 120 Q 50 80 100 120 Z" fill="#86efac"/>
        <rect x="35" y="80" width="28" height="22" rx="2" fill="#f59e0b"/>
        <polygon points="49,68 30,80 68,80" fill="#b45309"/>
        <line x1="100" y1="10" x2="100" y2="130" stroke="#d97706" stroke-dasharray="3 3" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "story",
    title: "The Wizard of Oz",
    description: "11-scene dramatized reader's theater stage following Dorothy, Scarecrow, Tin Woodman, and Lion down the Yellow Brick Road.",
    type: "story",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grades 3–5",
    grades: ["Grade 3", "Grade 4", "Grade 5"],
    duration: 40,
    durationText: "40 min",
    estimatedMinutes: 40,
    xp: 75,
    skills: ["Reading", "Speaking", "Listening", "Roleplay"],
    topic: "Classic Storytelling & Emotions",
    topics: ["Classic Literature", "Yellow Brick Road", "Character Traits & Feelings"],
    languageFocus: "Dialogue reading, Character feelings, Narrative past tense",
    activityMode: "Reader's Theater & Whole Group",
    interactionType: "11-Scene Dramatized Classroom Stage",
    difficulty: "Elementary",
    tags: ["wizard-of-oz", "story", "theater", "reading", "dorothy", "drama"],
    learningObjectives: [
      "Read dialogue aloud with expressive character intonation",
      "Sequence the 11 journey scenes from Kansas to the Emerald City",
      "Describe character motivations (brain, heart, courage, home)"
    ],
    teacherInstructions: "Assign roles to student actors (Dorothy, Scarecrow, Tin Woodman, Lion, Narrator). Advance scenes as students act out their lines.",
    studentInstructions: "Step into the story, choose your character role, and follow the Yellow Brick Road to meet the Wizard!",
    route: "story/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ede9fe"/>
        <path d="M 0 140 Q 80 100 100 70 Q 120 40 140 15 L 160 15 Q 140 50 120 80 Q 90 120 0 140 Z" fill="#fde047"/>
        <rect x="130" y="25" width="16" height="45" rx="2" fill="#10b981"/>
        <polygon points="138,12 130,25 146,25" fill="#059669"/>
        <rect x="150" y="35" width="18" height="35" rx="2" fill="#059669"/>
        <polygon points="159,22 150,35 168,35" fill="#047857"/>
      </svg>`
  },
  {
    id: "detective-prep",
    title: "Detective Prep",
    description: "Rapid-fire 10-minute whiteboard warm-up drilling Wh-questions (Who, Where, What) before the detective mystery.",
    type: "warmup",
    category: "Quick Warm-ups",
    categoryLabel: "⚡ Quick Warm-ups",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 8–9",
    ageGroup: "9-10",
    grade: "Grade 3",
    grades: ["Grade 3", "Grade 4"],
    duration: 10,
    durationText: "10 min",
    estimatedMinutes: 10,
    xp: 25,
    skills: ["Speaking", "Grammar"],
    topic: "Wh-Questions & Interrogation",
    topics: ["Wh-Questions", "Detective Warm-up", "Interrogation"],
    languageFocus: "Interrogative syntax: Who / What / Where / When",
    activityMode: "Fast-Paced Whole Group Drill",
    interactionType: "Rapid Interactive Quiz",
    difficulty: "Beginner",
    tags: ["warmup", "detective", "questions", "wh-questions", "fast"],
    learningObjectives: [
      "Select the correct WH-question word based on answer clues",
      "Form rapid question structures under timed conditions"
    ],
    teacherInstructions: "Use this 10-minute warm-up immediately prior to starting the Treasure Mystery.",
    studentInstructions: "Answer the quick detective questions and earn your junior investigator badge!",
    route: "treasure/index.html#prep-intro",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#eff6ff"/>
        <circle cx="100" cy="60" r="28" fill="none" stroke="#2563eb" stroke-width="5"/>
        <line x1="120" y1="80" x2="148" y2="108" stroke="#1e40af" stroke-width="7" stroke-linecap="round"/>
        <text x="92" y="70" font-family="sans-serif" font-weight="800" font-size="26" fill="#2563eb">?</text>
      </svg>`
  },
  {
    id: "treasure",
    title: "Treasure Mystery",
    description: "Solve the royal theft with a 4-team live scoreboard. Cross-examine suspects and evaluate clues using the past continuous tense.",
    type: "game",
    category: "Mystery & Detective",
    categoryLabel: "🕵️ Mystery & Detective",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 8–10",
    ageGroup: "9-10",
    grade: "Grade 3",
    grades: ["Grade 3", "Grade 4"],
    duration: 40,
    durationText: "40 min",
    estimatedMinutes: 40,
    xp: 80,
    skills: ["Speaking", "Listening", "Vocabulary", "Grammar"],
    topic: "Past Continuous & Detective Clues",
    topics: ["Past Continuous", "Interrogatives", "Evidence Evaluation", "Team Scoreboard"],
    languageFocus: "What were you doing at [time]? / I was [verb-ing]",
    activityMode: "4-Team Competition",
    interactionType: "Live Scoreboard Whodunit Investigation",
    difficulty: "Elementary",
    tags: ["treasure", "mystery", "detective", "past-continuous", "teams", "investigation"],
    learningObjectives: [
      "Ask interrogative past continuous questions ('What were you doing at 3 PM?')",
      "Answer with appropriate continuous structures ('I was baking a pie in the kitchen')",
      "Cross-examine witness testimonies to expose contradictory alibis"
    ],
    teacherInstructions: "Divide class into 4 detective teams. Award points on the live scoreboard as teams uncover evidence and evaluate suspect alibis.",
    studentInstructions: "Question the suspects, check their alibis, and identify who stole the royal treasure!",
    route: "treasure/index.html#intro",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <rect x="52" y="60" width="96" height="56" rx="5" fill="#92400e"/>
        <path d="M 52 60 Q 100 32 148 60 Z" fill="#b45309"/>
        <rect x="94" y="62" width="12" height="16" rx="2" fill="#facc15"/>
        <rect x="66" y="60" width="8" height="56" fill="#fbbf24"/>
        <rect x="126" y="60" width="8" height="56" fill="#fbbf24"/>
      </svg>`
  },
  {
    id: "room-rescue",
    title: "Room Rescue",
    description: "Restore disorganized rooms by placing furniture items according to precise coordinate and spatial prepositions clues.",
    type: "game",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "A1",
    cefrLevel: "A1",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    grades: ["Grade 3", "Grade 4"],
    duration: 30,
    durationText: "25–35 min",
    estimatedMinutes: 30,
    xp: 50,
    skills: ["Vocabulary", "Speaking", "Grammar"],
    topic: "Furniture & Spatial Prepositions",
    topics: ["Furniture Vocabulary", "Spatial Prepositions", "Coordinate Placement"],
    languageFocus: "Place the [item] next to / above / under / between the [item]",
    activityMode: "Turn-taking & Pairs",
    interactionType: "Drag-and-Drop Room Staging Challenge",
    difficulty: "Beginner",
    tags: ["room", "furniture", "prepositions", "placement", "coordinates"],
    learningObjectives: [
      "Name 10 common bedroom and living room furniture items",
      "Follow audio and written spatial placement instructions accurately"
    ],
    teacherInstructions: "Have one student give verbal placement directions while another places items on the interactive board.",
    studentInstructions: "Listen to the clues and put all the messy furniture in the right spots!",
    route: "treasure/index.html#room-rescue",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ecfdf5"/>
        <polygon points="0,0 200,0 170,25 30,25" fill="#d1fae5"/>
        <polygon points="30,25 170,25 170,105 30,105" fill="#a7f3d0"/>
        <polygon points="30,105 170,105 200,140 0,140" fill="#6ee7b7"/>
        <rect x="68" y="75" width="64" height="30" rx="3" fill="#047857"/>
        <rect x="78" y="60" width="20" height="15" rx="2" fill="#3b82f6"/>
      </svg>`
  },
  {
    id: "clil-lab",
    title: "CLIL Crime Lab",
    description: "Integrate English with science! Examine microscope fibers, compare fingerprint patterns, and test pH chemistry.",
    type: "clil",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    grades: ["Grade 4", "Grade 5"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 70,
    skills: ["CLIL", "Vocabulary", "Reading"],
    topic: "Forensic Science & Investigation",
    topics: ["Forensic Science", "Microscope Analysis", "Fingerprint Patterns", "Chemical pH"],
    languageFocus: "Scientific observation chunks: It looks like... / It contains...",
    activityMode: "Interactive Science Exploration",
    interactionType: "Virtual Science Lab Simulation",
    difficulty: "Intermediate",
    tags: ["clil", "science", "forensics", "microscope", "chemistry", "reading"],
    learningObjectives: [
      "Identify scientific lab equipment (microscope, test tube, dropper)",
      "Compare 3 fingerprint patterns (loop, arch, whorl) in English",
      "Form conclusions based on chemical test reactions"
    ],
    teacherInstructions: "Guide students through the 3 forensic stations, connecting science concepts directly to descriptive language.",
    studentInstructions: "Put on your lab coat, analyze the evidence under the microscope, and find the forensic match!",
    route: "treasure/index.html#clil-lab",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#e0f2fe"/>
        <path d="M 94 30 L 106 30 L 106 55 L 128 100 L 72 100 L 94 55 Z" fill="#38bdf8" opacity="0.8"/>
        <ellipse cx="100" cy="100" rx="28" ry="7" fill="#0284c7"/>
        <circle cx="95" cy="78" r="3.5" fill="#ffffff"/>
        <circle cx="107" cy="88" r="2.5" fill="#ffffff"/>
        <rect x="145" y="95" width="30" height="14" rx="2" fill="#475569"/>
        <path d="M 160 95 L 160 50 L 142 50" fill="none" stroke="#475569" stroke-width="5"/>
      </svg>`
  },
  {
    id: "expedition",
    title: "The Last Expedition",
    description: "Explore world biomes from rainforests to the Arctic, practicing wildlife terms, compass directions, and survival gear.",
    type: "clil",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    grades: ["Grade 4", "Grade 5"],
    duration: 35,
    durationText: "30–40 min",
    estimatedMinutes: 35,
    xp: 70,
    skills: ["CLIL", "Speaking", "Listening"],
    topic: "Global Biomes & Navigation",
    topics: ["World Biomes", "Compass Navigation", "Wildlife Adaptations", "Survival Gear"],
    languageFocus: "Compass directions (North, South, East, West) & Habitat vocabulary",
    activityMode: "Whole Group Expedition",
    interactionType: "Interactive Biome Map & Navigation Challenge",
    difficulty: "Intermediate",
    tags: ["clil", "geography", "biomes", "compass", "navigation", "expedition"],
    learningObjectives: [
      "Use compass directions to plot journey courses",
      "Identify adaptational traits of animals in Arctic and Desert biomes"
    ],
    teacherInstructions: "Have students work in navigation pairs to chart courses across biomes using compass bearings.",
    studentInstructions: "Pack your expedition backpack, use your compass, and lead your team across the extreme biomes!",
    route: "treasure/index.html#expedition",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ecfdf5"/>
        <polygon points="100,20 45,110 155,110" fill="#059669"/>
        <polygon points="100,20 80,55 120,55" fill="#ffffff"/>
        <circle cx="50" cy="45" r="20" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
        <polygon points="50,30 53,44 50,41 47,44" fill="#ef4444"/>
        <polygon points="50,60 53,46 50,49 47,46" fill="#475569"/>
      </svg>`
  },
  {
    id: "pokemon",
    title: "Pokémon Trainer Battle",
    description: "Gamified arena showdown where answering grammar challenges powers up attacks and defenses with animated HP bars.",
    type: "game",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "A1–A2",
    cefrLevel: "A1–A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    duration: 40,
    durationText: "40 min",
    estimatedMinutes: 40,
    xp: 80,
    skills: ["Grammar", "Speaking", "Vocabulary"],
    topic: "Action Verbs & Ability with Can",
    topics: ["Action Verbs", "Ability with Can / Can't", "Creature Stats", "Turn-Based Battles"],
    languageFocus: "Modal ability (can / can't) and action verb commands",
    activityMode: "Team Arena Battle",
    interactionType: "Gamified Battle Arena with Animated HP Bars",
    difficulty: "Elementary",
    tags: ["pokemon", "battle", "can", "verbs", "game", "competition"],
    learningObjectives: [
      "Use 'can' and 'can't' to describe attack moves and special abilities",
      "Formulate rapid grammatical responses to power up attacks",
      "Engage in supportive team competition"
    ],
    teacherInstructions: "Split the classroom into Red and Blue Trainer Gyms. Teams take turns answering grammar prompts to unleash attacks.",
    studentInstructions: "Pick your Pokémon companion, answer grammar questions correctly, and battle to become the champion!",
    route: "pokemon/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#dbeafe"/>
        <ellipse cx="100" cy="95" rx="70" ry="26" fill="#93c5fd"/>
        <circle cx="100" cy="55" r="26" fill="#ef4444"/>
        <path d="M 74 55 A 26 26 0 0 0 126 55 Z" fill="#ffffff"/>
        <line x1="74" y1="55" x2="126" y2="55" stroke="#0f172a" stroke-width="4.5"/>
        <circle cx="100" cy="55" r="8" fill="#0f172a"/>
        <circle cx="100" cy="55" r="4" fill="#ffffff"/>
      </svg>`
  },
  {
    id: "jungle",
    title: "Life in the Jungle",
    description: "Join wildlife rangers on conservation missions! Spot jungle animals and evaluate ecosystem health with audio soundscapes.",
    type: "clil",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    cefrLevel: "A1+",
    age: "Ages 7–11",
    ageGroup: "7-8",
    grade: "Grades 2–5",
    grades: ["Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    duration: 35,
    durationText: "35 min",
    estimatedMinutes: 35,
    xp: 65,
    skills: ["CLIL", "Vocabulary", "Listening"],
    topic: "Rainforest Wildlife & Modal Can",
    topics: ["Rainforest Animals", "Canopy Layers", "Food Chains", "Wildlife Conservation"],
    languageFocus: "Rainforest habitats, animal diets (carnivore/herbivore), ability with can",
    activityMode: "Interactive Wildlife Tour",
    interactionType: "Audio Soundscape & Canopy Explorer",
    difficulty: "Elementary",
    tags: ["jungle", "animals", "clil", "rainforest", "science", "listening"],
    learningObjectives: [
      "Name 8 rainforest animals and their canopy habitats",
      "Describe animal diets and abilities using 'It can climb/fly/hunt'",
      "Identify rainforest layers (emergent, canopy, understory, forest floor)"
    ],
    teacherInstructions: "Play jungle audio soundscapes. Have students guess animal sounds before revealing them in their respective canopy layers.",
    studentInstructions: "Climb through the jungle trees, listen to animal calls, and identify where each creature lives!",
    route: "jungle/index.html",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#d1fae5"/>
        <circle cx="45" cy="55" r="28" fill="#047857"/>
        <circle cx="95" cy="45" r="32" fill="#059669"/>
        <circle cx="150" cy="55" r="26" fill="#10b981"/>
        <rect x="40" y="70" width="10" height="60" fill="#78350f"/>
        <rect x="90" y="65" width="12" height="65" fill="#78350f"/>
        <rect x="145" y="70" width="10" height="60" fill="#78350f"/>
        <path d="M 0 140 Q 40 95 80 140 Z" fill="#065f46"/>
        <path d="M 120 140 Q 160 100 200 140 Z" fill="#065f46"/>
      </svg>`
  },
  {
    id: "res-global-readings-2",
    title: "Global Readings 2: Student's Book",
    description: "Macmillan Primary Literacy Anthology featuring 10 thematic units, phonics review, sequencing, Clara Doodle's inventions, Chuseok festival, and science connections.",
    type: "textbook",
    category: "Curriculum Textbook",
    categoryLabel: "📖 Curriculum Textbook",
    level: "Level 2",
    cefrLevel: "A1+",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grade 2-3",
    grades: ["Grade 2", "Grade 3"],
    duration: 45,
    durationText: "45 min",
    estimatedMinutes: 45,
    xp: 60,
    skills: ["Reading", "Vocabulary", "Speaking", "Phonics", "Writing"],
    topic: "Inventions, Technology & Culture",
    topics: ["Inventions", "Technology", "Problem Solving", "Biomimicry", "Culture & Harvest"],
    languageFocus: "Identifying sequence of events, Long vowels & blends, Action verbs in context",
    activityMode: "Whole Class Reading & Anthologies",
    interactionType: "Digital Textbook Reader & Interactive Annotator",
    difficulty: "Elementary",
    tags: ["textbook", "macmillan", "reading", "inventions", "phonics", "anthology"],
    learningObjectives: [
      "Identify chronological sequence of events (First, Second, Third, Last)",
      "Decode long vowels and consonant blend minimal pairs",
      "Analyze the 5-step engineering process: Think -> Plan -> Test -> Improve"
    ],
    teacherInstructions: "Launch the textbook reader to display authentic high-resolution page scans, accompanying phonics drills, and discussion questions.",
    studentInstructions: "Turn the pages, read about real-life inventors and celebrations, and solve the reading comprehension challenges!",
    route: "javascript:openTextbookViewer(1, 'book-global-readings-2')",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <rect x="45" y="20" width="110" height="95" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
        <path d="M 100 20 L 100 115" stroke="#ffffff" stroke-width="3"/>
        <rect x="55" y="32" width="36" height="6" rx="2" fill="#ffffff" opacity="0.9"/>
        <rect x="55" y="44" width="30" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="55" y="52" width="32" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="110" y="32" width="36" height="6" rx="2" fill="#facc15"/>
        <rect x="110" y="44" width="30" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="110" y="52" width="32" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="25" y="116" width="150" height="18" rx="4" fill="#1d4ed8"/>
        <text x="100" y="129" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">GLOBAL READINGS 2 📚</text>
      </svg>`
  },
  {
    id: "res-global-readings-3",
    title: "Global Readings 3: Student's Book",
    description: "Macmillan Primary Literacy Anthology featuring 10 advanced units on neuroscience, wildlife habitats, teamwork, ecology, and literature.",
    type: "textbook",
    category: "Curriculum Textbook",
    categoryLabel: "📖 Curriculum Textbook",
    level: "Level 3",
    cefrLevel: "A2",
    age: "Ages 9–11",
    ageGroup: "9-10",
    grade: "Grade 4",
    grades: ["Grade 4", "Grade 5"],
    duration: 45,
    durationText: "45 min",
    estimatedMinutes: 45,
    xp: 75,
    skills: ["Reading", "Vocabulary", "Speaking", "Neuroscience", "Writing"],
    topic: "Literature, Brain Science & Ecology",
    topics: ["Literature", "Brain Science", "Habitats", "Teamwork", "Ecology"],
    languageFocus: "Skimming, Scanning, Chronological order, Cause and effect, Character analysis",
    activityMode: "Whole Class Reading & Anthologies",
    interactionType: "Digital Textbook Reader & Interactive Annotator",
    difficulty: "Intermediate",
    tags: ["textbook", "macmillan", "brain", "habitats", "literature", "advanced"],
    learningObjectives: [
      "Skim informational and literary texts for main themes and specific details",
      "Identify chronological order and character motivations",
      "Understand brain growth and learning plasticity through reading"
    ],
    teacherInstructions: "Open the digital anthology viewer for Grade 4 units. Use reading check exercises for collaborative literature circles.",
    studentInstructions: "Explore advanced stories, discover how your brain learns new languages, and answer the reading comprehension challenges!",
    route: "javascript:openTextbookViewer(1, 'book-global-readings-3')",
    worksheet: null,
    worksheetRoute: null,
    teacherGuide: true,
    supportsAssignment: true,
    supportsProgress: true,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#f0fdf4"/>
        <rect x="45" y="20" width="110" height="95" rx="6" fill="#10b981" stroke="#047857" stroke-width="2"/>
        <path d="M 100 20 L 100 115" stroke="#ffffff" stroke-width="3"/>
        <circle cx="75" cy="50" r="14" fill="#d1fae5"/>
        <rect x="110" y="32" width="36" height="6" rx="2" fill="#fbbf24"/>
        <rect x="110" y="44" width="30" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="110" y="52" width="32" height="4" rx="1" fill="#ffffff" opacity="0.7"/>
        <rect x="25" y="116" width="150" height="18" rx="4" fill="#047857"/>
        <text x="100" y="129" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">GLOBAL READINGS 3 📚</text>
      </svg>`
  }
];

if (typeof window !== "undefined") {
  window.GAMES_REGISTRY = GAMES_REGISTRY;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GAMES_REGISTRY };
}
