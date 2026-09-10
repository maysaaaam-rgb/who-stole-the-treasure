/**
 * ENGLISH ADVENTURE ACADEMY — RELATIONAL PERSISTENT SCHOOL DATA ENGINE
 * Version 3.0 (True CRUD & Persistent Relational Store)
 * 
 * Features:
 * - Persistent localStorage (Key: eaa_master_school_v3)
 * - Zero reset on reload
 * - Transaction-based XP (Total XP = sum(transactions))
 * - Evidence-based Skill Mastery & CEFR Calculation + Manual Overrides
 * - Real Attendance Records (Present, Late, Absent, Excused)
 * - Full Curriculum Hierarchy (Book -> Unit -> Lesson -> Objective -> Activity)
 * - Full CRUD for Students, Classes, Games, Curriculum, Assignments, Homework, Quizzes, Assessments, Notes, Story
 */

(function(root) {
  'use strict';

  const STORAGE_KEY = 'eaa_master_school_v6';

  // Canonical list of 15 audited games
  const CANONICAL_GAMES = [
    {
      id: "camp-mystery",
      title: "The Mystery at the Camp",
      category: "Reading Adventure & Mystery",
      level: "A1/A1+",
      age: "7–9",
      grade: "Grade 3",
      duration: 50,
      skills: ["Reading", "Listening", "Speaking", "Prediction", "Cause & Effect", "Sequencing", "Fact vs Opinion", "Phonics"],
      topics: ["Don't Move (Camping Story)", "Suspense & Atmosphere", "Blends ST, TR, ND, NG", "Fact vs Opinion (Monarch Butterflies)"],
      objectives: [
        "Understand the main events and suspense in a forest camping narrative",
        "Identify setting, characters, and predict progressive plot developments",
        "Analyze cause and effect relationships from story events",
        "Sequence narrative events using First, Then, Next, Finally",
        "Distinguish verifiable facts from personal opinions",
        "Decode and locate target phonics clusters: ST, TR, ND, NG in a multi-directional word hunt"
      ],
      route: "camp-mystery/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "An interactive story adventure based on 'Don't Move'. Join Suzie and Mom in the dark windy forest, predict what makes the grunting sound outside the tent, solve cause & effect and sequencing mysteries, master fact vs opinion, and hunt phonics clues."
    },
    {
      id: "phonics-adventure",
      title: "Phonics Adventure – Blends & Digraphs",
      category: "English → Phonics",
      level: "A1",
      age: "7–10",
      grade: "Grade 3-4",
      duration: 45,
      skills: ["Phonics", "Listening", "Speaking", "Reading", "Spelling"],
      topics: ["Sound Detectives Mission", "Digraphs SH & CH", "Blends ST, PL, FL", "Listening PR & FR", "Textbook Units 1–5"],
      objectives: [
        "Hear, see, say, read, build, spell, identify, and use target sounds and vocabulary",
        "Master textbook exercises: Shells/fish/shoes, ST vs CH, unscramble PL/FL, PR vs FR listening, and interactive word search",
        "Solve 4-lock Phonics Escape Room challenge"
      ],
      route: "phonics/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "An interactive, game-based phonics lesson practicing SH, CH, ST, PL, FL, PR and FR through visual teaching, audio, pronunciation, storytelling, movement, listening, reading, spelling, games, textbook exercises, and an escape-room challenge."
    },
    {
      id: "monster-day",
      title: "Build Your Own Monster",
      category: "Classroom Game",
      level: "Pre-A1",
      age: "5–8",
      grade: "Grade 1-2",
      duration: 25,
      skills: ["Speaking", "Vocabulary", "Listening"],
      topics: ["Body Parts", "Colors", "Have Got"],
      objectives: ["Name 6 body parts", "Use have got / has got", "Describe monster colors"],
      route: "monster day/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "Interactive monster builder practicing body parts, colors, and 'I have got...'"
    },
    {
      id: "restaurant",
      title: "At the Restaurant",
      category: "Speaking & Roleplay",
      level: "A1+",
      age: "7–11",
      grade: "Grade 3",
      duration: 40,
      skills: ["Speaking", "Vocabulary"],
      topics: ["Food & Drink", "Polite Requests", "Prices"],
      objectives: ["Order politely with 'I would like...'", "Ask for prices", "Customer/waiter dialogue"],
      route: "restaurant/index.html",
      worksheet: "restaurant/worksheets.html",
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "Dining roleplay with interactive menu, secret order cards, and polite requests."
    },
    {
      id: "firefighter",
      title: "Fire Station Adventure",
      category: "Interactive Story",
      level: "A1",
      age: "7–9",
      grade: "Grade 3",
      duration: 35,
      skills: ["Speaking", "Listening", "Vocabulary"],
      topics: ["Community Helpers", "Emergencies", "Action Verbs"],
      objectives: ["Identify firefighter gear", "Follow emergency instructions", "Name equipment"],
      route: "firefighter/index.html",
      worksheet: "firefighter/worksheet.html",
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "Explore the fire station, sound the alarm, and extinguish fires in a team challenge."
    },
    {
      id: "neighbourhood",
      title: "My Neighbourhood",
      category: "Speaking & Roleplay",
      level: "A1",
      age: "7–9",
      grade: "Grade 3",
      duration: 30,
      skills: ["Speaking", "Vocabulary", "Grammar"],
      topics: ["Places in Town", "Prepositions of Place"],
      objectives: ["Use next to, opposite, between", "Give walking directions", "Form There is/are sentences"],
      route: "neighbourhood/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Living neighbourhood map where students identify town locations and prepositions."
    },
    {
      id: "advice",
      title: "The Crazy Advice Academy",
      category: "Grammar Challenge",
      level: "A2",
      age: "9–12",
      grade: "Grade 4",
      duration: 40,
      skills: ["Grammar", "Speaking"],
      topics: ["Modal Verbs Should & Shouldn't", "Problem Solving"],
      objectives: ["Form positive advice with should", "Form warnings with shouldn't", "Explain reasons"],
      route: "advice/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Solve wacky everyday dilemmas using modal verbs with Professor Should."
    },
    {
      id: "predictions",
      title: "What Will Happen Next?",
      category: "Grammar Challenge",
      level: "A2",
      age: "9–12",
      grade: "Grade 4",
      duration: 35,
      skills: ["Grammar", "Reading", "Speaking"],
      topics: ["Future with Will & Won't", "Predictions"],
      objectives: ["Predict future events with will", "Use negative won't", "Support hypotheses"],
      route: "predictions/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Examine story clues and predict the future using 'will' and 'won't'."
    },
    {
      id: "city-mouse",
      title: "The City Mouse & Country Mouse",
      category: "Interactive Story",
      level: "A1",
      age: "6–9",
      grade: "Grade 2-3",
      duration: 30,
      skills: ["Reading", "Listening", "Vocabulary"],
      topics: ["City vs Country", "Contrasts", "Lifestyles"],
      objectives: ["Compare town and countryside", "Identify sensory adjectives", "Retell the fable"],
      route: "city-mouse/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Aesop's classic fable retold with interactive vocabulary hot-spots."
    },
    {
      id: "pokemon",
      title: "Pokémon Trainer Battle",
      category: "Classroom Game",
      level: "A1",
      age: "7–10",
      grade: "Grade 3",
      duration: 35,
      skills: ["Speaking", "Vocabulary", "Grammar"],
      topics: ["Action Verbs", "Ability with Can / Can't"],
      objectives: ["Use can and can't for special moves", "Describe attack verbs", "Team battle roleplay"],
      route: "pokemon/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Turn-based grammar battle practicing action verbs and 'can/can't' abilities."
    },
    {
      id: "jungle",
      title: "Life in the Jungle",
      category: "CLIL / Science",
      level: "A1",
      age: "7–10",
      grade: "Grade 3",
      duration: 30,
      skills: ["Listening", "Vocabulary", "Reading"],
      topics: ["Rainforest Animals", "Habitats", "Food Chains"],
      objectives: ["Name 8 jungle animals", "Describe animal diets", "Match animals to tree layers"],
      route: "jungle/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "CLIL biology adventure exploring rainforest canopy layers and wildlife."
    },
    {
      id: "treasure",
      title: "Treasure Mystery",
      category: "Mystery & Detective",
      level: "A1",
      age: "8–11",
      grade: "Grade 3-4",
      duration: 40,
      skills: ["Speaking", "Grammar", "Listening"],
      topics: ["Past Continuous", "Interrogatives", "Evidence"],
      objectives: ["Ask 'What were you doing at 3 PM?'", "Answer with 'I was...'", "Cross-examine suspects"],
      route: "treasure/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      description: "Whodunit mystery where students question suspects using past continuous tense."
    },
    {
      id: "story-school",
      title: "School Day Routine",
      category: "Interactive Story",
      level: "A1",
      age: "6–8",
      grade: "Grade 2",
      duration: 25,
      skills: ["Reading", "Speaking"],
      topics: ["School Subjects", "Classroom Objects"],
      objectives: ["Name subjects and supplies", "Tell class timetable", "Express preferences"],
      route: "story/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Follow students through their morning school timetable and activities."
    },
    {
      id: "mouse",
      title: "Daily Routine Adventure",
      category: "Classroom Game",
      level: "A1",
      age: "7–9",
      grade: "Grade 3",
      duration: 30,
      skills: ["Grammar", "Vocabulary"],
      topics: ["Daily Routines", "Telling the Time", "Present Simple"],
      objectives: ["Tell time on the clock", "Use wake up, brush teeth, eat breakfast", "Form routine sentences"],
      route: "mouse/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Help Mickey Mouse organize his busy day by setting clocks and routine verbs."
    },
    {
      id: "hero",
      title: "Super Hero Academy",
      category: "Classroom Game",
      level: "Pre-A1",
      age: "5–7",
      grade: "Grade 1",
      duration: 20,
      skills: ["Listening", "Speaking", "Vocabulary"],
      topics: ["Phonics", "Letter Sounds", "Hero Powers"],
      objectives: ["Recognize letter sounds A-Z", "Pronounce blend sounds", "Match words to pictures"],
      route: "story/hero/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Phonics power-up challenges training young superheroes in sound recognition."
    },
    {
      id: "garden",
      title: "The Magic Garden",
      category: "CLIL / Science",
      level: "Pre-A1",
      age: "5–7",
      grade: "Grade 1",
      duration: 25,
      skills: ["Vocabulary", "Listening"],
      topics: ["Plants", "Flowers", "Insects", "Nature"],
      objectives: ["Identify stem, leaf, flower, root", "Name garden creatures", "Follow planting steps"],
      route: "story/garden/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Plant magical seeds and explore garden biodiversity with sensory sound effects."
    },
    {
      id: "space",
      title: "Space Explorer Mission",
      category: "CLIL / Science",
      level: "A2",
      age: "8–11",
      grade: "Grade 4",
      duration: 35,
      skills: ["Reading", "Vocabulary", "Speaking"],
      topics: ["Solar System", "Planets", "Comparatives & Superlatives"],
      objectives: ["Name 8 planets", "Use bigger than, hottest, furthest", "Navigate spacecraft"],
      route: "story/space/index.html",
      worksheet: null,
      teacherGuide: true,
      featured: false,
      archived: false,
      description: "Interplanetary journey comparing planet sizes, distances, and atmosphere."
    }
  ];

  // =========================================================================
  // GLOBAL READINGS 2 — LEVEL 2 STUDENT'S BOOK (MACMILLAN EDUCATION)
  // Source: CamScanner 09-05-2026 13.23.pdf
  // Full Scope & Sequence + Phonics Review + Units 1-10 + Deep Breakdown
  // =========================================================================
  const GLOBAL_READINGS_2_PAGES = [
    { page: 1, file: 'assets/books/global-readings-2/page_01.jpg', title: "Cover — Global Readings 2: Level 2 Student's Book", unit: "Global Readings 2", section: "Macmillan Education Primary Literacy Anthology" },
    { page: 2, file: 'assets/books/global-readings-2/page_02.jpg', title: "Scope & Sequence (Part 1)", unit: "Scope & Sequence", section: "Phonics Review & Units 1 to 5" },
    { page: 3, file: 'assets/books/global-readings-2/page_03.jpg', title: "Scope & Sequence (Part 2)", unit: "Scope & Sequence", section: "Units 6 to 10" },
    { page: 4, file: 'assets/books/global-readings-2/page_04.jpg', title: "Phonics Review: Long a, Long e, Long i", unit: "Phonics Review", section: "Decode long vowel sounds with picture cues" },
    { page: 5, file: 'assets/books/global-readings-2/page_05.jpg', title: "Phonics Review: Long o, Long u & Rhyme", unit: "Phonics Review", section: "Long vowels reading and rhyme chant" },
    { page: 6, file: 'assets/books/global-readings-2/page_06.jpg', title: "Phonics Review: Blends & Digraphs (sh, st, ch)", unit: "Phonics Review", section: "Minimal pairs: sh vs ch, st endings" },
    { page: 7, file: 'assets/books/global-readings-2/page_07.jpg', title: "Phonics Review: Blends & Digraphs (pl, fl, pr, fr)", unit: "Phonics Review", section: "Contrasts: pl vs fl, pr vs fr & Word Search" },
    { page: 8, file: 'assets/books/global-readings-2/page_08.jpg', title: "Unit 1: What Does It Do? — Opener", unit: "Unit 1", section: "See, Think, Wonder: Technology in the classroom" },
    { page: 9, file: 'assets/books/global-readings-2/page_09.jpg', title: "Unit 1: What Does It Do? — Key Concept", unit: "Unit 1", section: "Why do people invent things? Inquiry discussion" },
    { page: 10, file: 'assets/books/global-readings-2/page_10.jpg', title: "Reading 1: The After-School Inventor (Clara Doodle)", unit: "Unit 1", section: "Story introduction: After-school inventor workshop" },
    { page: 11, file: 'assets/books/global-readings-2/page_11.jpg', title: "Reading 1: The After-School Inventor (Pen Umbrella)", unit: "Unit 1", section: "Words in Context: invent, try again, change, mirror, mess, machine" },
    { page: 12, file: 'assets/books/global-readings-2/page_12.jpg', title: "Reading 1: When I have an idea, I always make a plan", unit: "Unit 1", section: "Clara drafting plans and testing ideas" },
    { page: 13, file: 'assets/books/global-readings-2/page_13.jpg', title: "Reading 1: Smart Eraser & Alarm Clock Pillow", unit: "Unit 1", section: "Inventions: Math error alert & Musical pillow" },
    { page: 14, file: 'assets/books/global-readings-2/page_14.jpg', title: "Reading 1: Special Mirror (Front / Back / Menu)", unit: "Unit 1", section: "Unexpected results: Mirror changing clothes and hair!" },
    { page: 15, file: 'assets/books/global-readings-2/page_15.jpg', title: "Reading 1: Big Clean-up Machine & Dialect Focus", unit: "Unit 1", section: "Messy room solution; clean/tidy, favorite/favourite" },
    { page: 16, file: 'assets/books/global-readings-2/page_16.jpg', title: "Explore the Reading: Matching & Comprehension", unit: "Unit 1", section: "Match inventions to uses, answer questions & cl- blend practice" },
    { page: 17, file: 'assets/books/global-readings-2/page_17.jpg', title: "Get Ready to Read: Identifying a Sequence of Events", unit: "Unit 1", section: "First, Second, Third, Last in instructions & inventing" },
    { page: 18, file: 'assets/books/global-readings-2/page_18.jpg', title: "Reading 2: My Good Ideas Book (Thomas Edison)", unit: "Unit 1", section: "Nonfiction: Write ideas down; Hexagon pencils solution" },
    { page: 19, file: 'assets/books/global-readings-2/page_19.jpg', title: "Reading 2: Biomimicry (Plants to Velcro, Kingfisher to Train)", unit: "Unit 1", section: "Words in Context: problem, solution, hexagon, improve, parachute" },
    { page: 20, file: 'assets/books/global-readings-2/page_20.jpg', title: "Reading 2: Work on Your Idea (Leonardo da Vinci)", unit: "Unit 1", section: "Drawing ideas to test them: da Vinci sketches" },
    { page: 21, file: 'assets/books/global-readings-2/page_21.jpg', title: "Reading 2: Improve Your Idea (Karl Benz Motorcar 1885)", unit: "Unit 1", section: "Engineering feedback cycle: Don't give up! Try again!" },
    { page: 22, file: 'assets/books/global-readings-2/page_22.jpg', title: "Explore the Reading 2: Engineering Process & Science Link", unit: "Unit 1", section: "Sequence diagram, Good Ideas Book checklist & Discussion" },
    { page: 23, file: 'assets/books/global-readings-2/page_23.jpg', title: "Think Together: Inventors Matrix & Reading Journal", unit: "Unit 1", section: "Match inventors to reasons, Round Robin & My Reading Journal" }
  ];

  const GLOBAL_READINGS_2_DATA = {
    book: {
      id: 'book-global-readings-2',
      title: 'Global Readings 2',
      level: 'Level 2',
      targetLevel: 'Level 2',
      grade: 'Grade 3',
      gradeLevel: 'Grade 3',
      weeksPerUnit: 4,
      totalUnits: 10,
      bookType: "Student's Book",
      publisher: 'Macmillan Education',
      description: 'A primary literacy anthology and reading curriculum featuring 10 thematic units, phonics review, rich comprehension, sequencing, and science/social studies connections.',
      cover: 'assets/books/global-readings-2/cover.jpg',
      pdfUrl: 'assets/books/global-readings-2/Global-Readings-2.pdf',
      totalPages: 23,
      archived: false
    },
    units: [
      {
        id: 'unit-gr2-phonics',
        bookId: 'book-global-readings-2',
        title: 'Phonics Review: Sounds, Blends & Digraphs',
        order: 0,
        pages: '4–7',
        reading1: 'Long Vowels Review (a, e, i, o, u)',
        reading2: 'Blends & Digraphs (sh, st, ch, pl, fl, pr, fr)',
        readingSkill: 'Phonological Awareness & Decoding',
        contentArea: 'Foundational Literacy',
        selFocus: 'Self-Correction & Confidence',
        keyConcept: 'How do letters and sounds make words?',
        targetVocab: ['cake', 'lake', 'tape', 'rain', 'tree', 'leaf', 'bike', 'kite', 'rope', 'nose', 'bone', 'cube', 'tube', 'flute', 'ship', 'shop', 'fish', 'bench', 'chips', 'star', 'nest', 'flag', 'frog'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Long Vowels a, e, i', focus: 'Decoding long vowel patterns across decodable rhymes' },
          { weekNumber: 2, title: 'Week 2: Long Vowels o, u & Rhymes', focus: 'Sound substitution and rhythmic vowel chants' },
          { weekNumber: 3, title: 'Week 3: Blends & Digraphs sh, st, ch', focus: 'Minimal pair contrasts (ship/chip, shop/chop) and final -st' },
          { weekNumber: 4, title: 'Week 4: Blends pl, fl, pr, fr & Word Search', focus: 'Initial consonant blends decoding challenge' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-1',
        bookId: 'book-global-readings-2',
        title: 'Unit 1: What Does It Do?',
        durationWeeks: 4,
        duration: '4 weeks',
        order: 1,
        pages: '8–23',
        reading1: 'The After-School Inventor (Story, cl- blend)',
        reading2: 'My Good Ideas Book (Instructional Text)',
        readingSkill: 'Identifying a Sequence of Events',
        contentArea: 'Science: Technology',
        selFocus: 'Self-Awareness (strengths & limitations)',
        keyConcept: 'Why do people invent things?',
        targetVocab: ['invent', 'try again', 'change', 'mirror', 'mess', 'invention', 'machine', 'problem', 'solution', 'hexagon', 'improve', 'parachute', 'plan', 'eraser', 'tidy'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Inquiry & The After-School Inventor', focus: 'See-Think-Wonder, everyday inventions, Clara Doodle story (p. 8–15)' },
          { weekNumber: 2, title: 'Week 2: Words in Context & Comprehension', focus: 'Action verbs, dialect differences (clean/tidy), matching & cl- blends (p. 11, 16)' },
          { weekNumber: 3, title: 'Week 3: Sequencing & My Good Ideas Book', focus: 'First, Second, Third, Last sequence words, Thomas Edison & biomimicry (p. 17–20)' },
          { weekNumber: 4, title: 'Week 4: Problem Solving, da Vinci & Journal', focus: '5-step design feedback cycle, Karl Benz, Round Robin & Reading Journal (p. 21–23)' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-2',
        bookId: 'book-global-readings-2',
        title: 'Unit 2: Thank You',
        order: 2,
        pages: '24–39',
        reading1: "Chuseok: Korea\'s Harvest Festival",
        reading2: 'First Harvest (-st blend)',
        readingSkill: 'Understanding Setting',
        contentArea: 'Social Studies: Communities',
        selFocus: 'Identify triggers',
        keyConcept: 'Why do we celebrate harvests?',
        targetVocab: ['harvest', 'festival', 'celebrate', 'tradition', 'feast', 'gratitude', 'first', 'crops'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Harvest Traditions Around the World', focus: 'Chuseok festival customs, autumn celebration vocabulary' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Chuseok: Korea\'s Harvest Festival', focus: 'Narrative tracking family reunions and special feast foods' },
          { weekNumber: 3, title: 'Week 3: Reading 2: First Harvest (-st blend)', focus: 'Setting analysis in farming narratives, decoding -st clusters' },
          { weekNumber: 4, title: 'Week 4: Gratitude Reflections & Unit 2 Assessment', focus: 'Cultural comparison matrix and reflection journal' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-3',
        bookId: 'book-global-readings-2',
        title: 'Unit 3: It Keeps Changing',
        order: 3,
        pages: '40–55',
        reading1: 'The Bear and I (-ng blend)',
        reading2: 'Clean Cars',
        readingSkill: 'Comparing & Contrasting',
        contentArea: 'Science: Environmental Science',
        selFocus: 'Evaluate reactions',
        keyConcept: 'How can we make good changes in our world?',
        targetVocab: ['environment', 'pollution', 'electric', 'clean', 'change', 'protect', 'nature'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Our Changing Planet & Environmental Inquiry', focus: 'Pollution, renewable energy, eco-friendly transport terms' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Bear and I (-ng blend)', focus: 'Story tracking wildlife encounters, decoding final -ng words' },
          { weekNumber: 3, title: 'Week 3: Reading 2: Clean Cars (Electric Vehicles)', focus: 'Comparing gasoline vs electric cars, fact extraction' },
          { weekNumber: 4, title: 'Week 4: Environmental Action Plan & Review', focus: 'Green living checklist and unit comprehension quiz' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-4',
        bookId: 'book-global-readings-2',
        title: 'Unit 4: What Happened?',
        order: 4,
        pages: '56–71',
        reading1: 'Where Is She?',
        reading2: 'The Angry Mountain (-nd blend)',
        readingSkill: 'Cause & Effect',
        contentArea: 'History: World Events',
        selFocus: 'Label emotions',
        keyConcept: 'How do events change our lives?',
        targetVocab: ['volcano', 'eruption', 'mountain', 'escape', 'ash', 'history', 'event'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Earth Events & Volcanic Mysteries', focus: 'Geological formations, natural disasters, cause and effect inquiry' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Where Is She?', focus: 'Suspense narrative following family during a sudden ash storm' },
          { weekNumber: 3, title: 'Week 3: Reading 2: The Angry Mountain (-nd blend)', focus: 'Nonfiction science link on active volcanoes, -nd blends' },
          { weekNumber: 4, title: 'Week 4: Cause-Effect Mapping & Assessment', focus: 'Sequence diagrams and emotional resilience reflection' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-5',
        bookId: 'book-global-readings-2',
        title: "Unit 5: Let's Go Back",
        order: 5,
        pages: '72–87',
        reading1: 'The Time Book (-nt blend)',
        reading2: 'Time Capsules',
        readingSkill: 'Main Idea & Details',
        contentArea: 'History: Civilizations',
        selFocus: 'Other views',
        keyConcept: 'How can we find out about the past?',
        targetVocab: ['ancient', 'time capsule', 'civilization', 'past', 'history', 'memory', 'bury'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Finding the Past & Time Keeping', focus: 'Artifacts, archaeology, time capsules, history inquiry' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Time Book (-nt blend)', focus: 'Personal journals across generations, decoding -nt words' },
          { weekNumber: 3, title: 'Week 3: Reading 2: Time Capsules (Ancient Civilizations)', focus: 'Main idea and detail extraction on preserved historic relics' },
          { weekNumber: 4, title: 'Week 4: Classroom Time Capsule & Review', focus: 'Creating personal artifact letters and Unit 5 assessment' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-6',
        bookId: 'book-global-readings-2',
        title: 'Unit 6: Look What I Made',
        order: 6,
        pages: '88–103',
        reading1: 'The Superstar (wh- digraph)',
        reading2: "Visit Gaudí\'s World",
        readingSkill: 'Fact & Opinion',
        contentArea: 'Science: Architecture',
        selFocus: 'Work towards goals',
        keyConcept: 'Why do people make things?',
        targetVocab: ['architect', 'mosaic', 'structure', 'cathedral', 'design', 'artist', 'build'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Architects & Creative Makers', focus: 'Structural designs, creative perseverance, architecture terms' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Superstar (wh- digraph)', focus: 'Biography highlighting relentless practice, decoding wh- words' },
          { weekNumber: 3, title: 'Week 3: Reading 2: Visit Gaudí\'s World (Architecture)', focus: 'Fact vs opinion analysis of Antoni Gaudí\'s organic buildings' },
          { weekNumber: 4, title: 'Week 4: Design a Landmark & Assessment', focus: 'Drafting architectural models and unit reflection journal' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-7',
        bookId: 'book-global-readings-2',
        title: "Unit 7: We're a Team",
        order: 7,
        pages: '104–119',
        reading1: 'Great Teamwork',
        reading2: "It\'s Mine (-ck blend)",
        readingSkill: 'Predicting Endings',
        contentArea: 'Science: Symbiotic Relationships',
        selFocus: 'Cooperative learning',
        keyConcept: 'What is good about teamwork?',
        targetVocab: ['teamwork', 'partner', 'ocean', 'symbiosis', 'together', 'help', 'cooperate'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Partnership in Nature & Human Life', focus: 'Symbiotic relationships, cooperation, mutual support inquiry' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Great Teamwork (Symbiosis)', focus: 'Ocean reef mutualism between clownfish and anemone' },
          { weekNumber: 3, title: 'Week 3: Reading 2: It\'s Mine (-ck blend)', focus: 'Predicting story outcomes, resolving sharing conflicts, -ck words' },
          { weekNumber: 4, title: 'Week 4: Team Challenge Showcase & Review', focus: 'Collaborative project presentation and Unit 7 assessment' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-8',
        bookId: 'book-global-readings-2',
        title: "Unit 8: You're My Hero",
        order: 8,
        pages: '120–135',
        reading1: 'In First Place',
        reading2: 'A New Hero (tr- blends)',
        readingSkill: 'Understanding Characters',
        contentArea: 'History: Important People',
        selFocus: 'Responsible decision-making',
        keyConcept: 'What makes a hero?',
        targetVocab: ['hero', 'courage', 'role model', 'inspire', 'brave', 'champion', 'achievement'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Everyday Heroes & Moral Qualities', focus: 'Courage, integrity, role models, community service inquiry' },
          { weekNumber: 2, title: 'Week 2: Reading 1: In First Place', focus: 'Sportsmanship narrative focusing on character under pressure' },
          { weekNumber: 3, title: 'Week 3: Reading 2: A New Hero (tr- blends)', focus: 'Profiles of everyday emergency responders, tr- blend decoding' },
          { weekNumber: 4, title: 'Week 4: Hero Nomination Project & Assessment', focus: 'Writing a tribute to a real-life hero and unit quiz' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-9',
        bookId: 'book-global-readings-2',
        title: 'Unit 9: Do You Live Here?',
        order: 9,
        pages: '136–151',
        reading1: 'The Clever King (br- blend)',
        reading2: 'Amazing Castles',
        readingSkill: 'Scanning',
        contentArea: 'Science: Architecture',
        selFocus: 'Regulate emotions',
        keyConcept: 'Why did people build castles?',
        targetVocab: ['castle', 'fortress', 'moat', 'king', 'kingdom', 'defense', 'stone'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Kingdoms, Castles & Fortresses', focus: 'Medieval architecture, stone defense, royalty vocabulary' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Clever King (br- blend)', focus: 'Folklore tale of wisdom overcoming force, br- blend decoding' },
          { weekNumber: 3, title: 'Week 3: Reading 2: Amazing Castles (Architecture)', focus: 'Scanning text for defensive features: moats, towers, gates' },
          { weekNumber: 4, title: 'Week 4: Castle Blueprint Project & Review', focus: 'Historical timeline synthesis and unit reflection' }
        ],
        archived: false
      },
      {
        id: 'unit-gr2-10',
        bookId: 'book-global-readings-2',
        title: 'Unit 10: Are We There Yet?',
        order: 10,
        pages: '152–167',
        reading1: 'Young Nicholas (sw- blend)',
        reading2: 'The Thirty-Year Journey',
        readingSkill: 'Sequence of Events',
        contentArea: 'History: Important People',
        selFocus: 'Grit & perseverance',
        keyConcept: 'Why do people travel?',
        targetVocab: ['journey', 'travel', 'explorer', 'expedition', 'adventure', 'discovery', 'globe'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Explorers & The Call of Adventure', focus: 'Navigation, global expeditions, why humans explore' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Young Nicholas (sw- blend)', focus: 'Early voyages of discovery, decoding initial sw- blends' },
          { weekNumber: 3, title: 'Week 3: Reading 2: The Thirty-Year Journey', focus: 'Tracing Ibn Battuta and world travellers, chronological sequence' },
          { weekNumber: 4, title: 'Week 4: Capstone Journey & End-of-Year Celebration', focus: 'Global expedition map showcase and Grade 3 reading portfolio' }
        ],
        archived: false
      }
    ],
    lessons: [
      // Phonics Review
      {
        id: 'lesson-gr2-p1',
        unitId: 'unit-gr2-phonics',
        title: 'Long Vowels Review: a, e, i, o, u',
        order: 1,
        sourcePages: '4–5',
        sourceBook: 'Global Readings 2',
        objective: 'Decode and read long vowel words (a_e, ee/ea, i_e, o_e, u_e) across pictures and short rhymes.',
        duration: 30,
        tasks: [
          { type: 'phonics', label: 'Long a', words: ['cake', 'lake', 'tape', 'rain', 'play'] },
          { type: 'phonics', label: 'Long e', words: ['tree', 'bee', 'leaf', 'seat', 'green'] },
          { type: 'phonics', label: 'Long i', words: ['bike', 'kite', 'pine', 'line', 'nine'] },
          { type: 'phonics', label: 'Long o', words: ['rope', 'nose', 'bone', 'cone', 'rose'] },
          { type: 'phonics', label: 'Long u', words: ['cube', 'tube', 'flute', 'mule', 'huge'] }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-p2',
        unitId: 'unit-gr2-phonics',
        title: 'Consonant Blends & Digraphs: sh, st, ch, pl, fl, pr, fr',
        order: 2,
        sourcePages: '6–7',
        sourceBook: 'Global Readings 2',
        objective: 'Differentiate minimal pairs and consonant digraphs (sh vs ch, pl vs fl, pr vs fr) and solve the review word search.',
        duration: 30,
        tasks: [
          { type: 'contrast', pair: 'sh vs ch', words: ['ship / chip', 'shop / chop', 'wish / witch'] },
          { type: 'contrast', pair: 'pl vs fl', words: ['play / flag', 'plane / flame', 'plum / fly'] },
          { type: 'contrast', pair: 'pr vs fr', words: ['prize / frog', 'price / fruit', 'press / free'] },
          { type: 'ending', blend: 'st', words: ['star', 'nest', 'fast', 'last', 'best'] }
        ],
        archived: false
      },

      // Unit 1 Lessons
      {
        id: 'lesson-gr2-1-1',
        unitId: 'unit-gr2-1',
        title: 'Lesson 1: See, Think, Wonder (Everyday Inventions)',
        order: 1,
        sourcePages: '8–9',
        sourceBook: 'Global Readings 2',
        objective: 'Observe classroom and everyday technology, stimulate inquiry, and discuss: Why do people invent things?',
        duration: 25,
        gameRoute: 'monster day/index.html',
        activities: [
          { type: 'discussion', prompt: 'Look at the picture. What do you see? What tools are they using?' },
          { type: 'inquiry', prompt: 'Think: What problems do these tools solve in our daily life?' },
          { type: 'wonder', prompt: 'Wonder: What kind of new invention would make your day easier?' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-2',
        unitId: 'unit-gr2-1',
        title: 'Lesson 2: Reading 1: The After-School Inventor',
        order: 2,
        sourcePages: '10–15',
        sourceBook: 'Global Readings 2',
        objective: "Read Clara Doodle's story aloud, track her 4 inventions, and isolate initial cl- blend sounds.",
        duration: 35,
        activities: [
          { type: 'story', title: 'Part 1: The Plan', text: 'When I have an idea, I always make a plan. I draw and change, and change and draw. I do the best I can.' },
          { type: 'story', title: 'Part 2: Smart Eraser & Alarm Pillow', text: "Here's my smart eraser. It tells me when I'm wrong. And my alarm clock pillow wakes me with a song." },
          { type: 'story', title: 'Part 3: Special Mirror', text: 'This is my special mirror. It changes what I see. When I click this button, I see the back of me.' },
          { type: 'story', title: 'Part 4: Big Clean-up Machine', text: "Mom says my room's a mess, but I don't like to clean. Here's my new invention ... it's a big clean-up machine." }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-3',
        unitId: 'unit-gr2-1',
        title: 'Lesson 3: Words in Context & Language Differences',
        order: 3,
        sourcePages: '11, 15',
        sourceBook: 'Global Readings 2',
        objective: 'Demonstrate comprehension of story action verbs and compare American vs British English vocabulary.',
        duration: 25,
        activities: [
          {
            type: 'vocab_definitions',
            words: [
              { word: 'invent', def: 'to make something new for the first time' },
              { word: 'try again', def: 'to attempt something one more time after a mistake' },
              { word: 'change', def: 'to make something different' },
              { word: 'mirror', def: 'glass that reflects an image of what is in front of it' },
              { word: 'mess', def: 'an untidy or dirty condition' },
              { word: 'machine', def: 'a piece of equipment with moving parts that does work' }
            ]
          },
          {
            type: 'dialects',
            pairs: [
              { us: 'eraser', uk: 'rubber' },
              { us: 'clean', uk: 'tidy' },
              { us: 'favorite', uk: 'favourite' }
            ]
          }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-4',
        unitId: 'unit-gr2-1',
        title: 'Lesson 4: Reading Comprehension & Discussion',
        order: 4,
        sourcePages: '16',
        sourceBook: 'Global Readings 2',
        objective: 'Complete matching of inventions to functions, answer 6 recall and inference questions, and debate whether inventing is easy or difficult.',
        duration: 30,
        activities: [
          {
            type: 'matching',
            title: 'A. Read and match',
            pairs: [
              { invention: 'The clean-up machine', function: 'This invention cleans.' },
              { invention: 'The mirror', function: 'This invention has buttons.' },
              { invention: 'The pen umbrella', function: 'This invention is for the rain.' },
              { invention: 'The smart eraser', function: 'This invention helps Clara with her homework.' },
              { invention: 'The alarm clock pillow', function: 'This invention sings a song.' }
            ]
          },
          {
            type: 'questions',
            title: 'B. Read and choose the answer',
            items: [
              { q: '1. When does Clara invent things?', a: 'She invents things after school.' },
              { q: '2. What does she do if her idea is not very good?', a: 'She tries again.' },
              { q: '3. What does she do when she has a new idea?', a: 'She makes a plan.' },
              { q: '4. Why does Clara say "Oh, no!"?', a: "The mirror doesn't work." },
              { q: "5. Who thinks Clara's room is a mess?", a: 'Her mom does.' },
              { q: '6. What does her new invention do?', a: 'It cleans her room.' }
            ]
          },
          { type: 'phonics_box', title: 'Phonics: Initial cl- blends', words: ['climb', 'clue', 'cloud', 'close', 'clap', 'Clara', 'clean', 'clock', 'clothes', 'click'] },
          { type: 'reflection', title: 'C. Think and discuss', prompt: 'Do you think it is easy or difficult to be an inventor? Why?' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-5',
        unitId: 'unit-gr2-1',
        title: 'Lesson 5: Sequencing Activity: First, Second, Third, Last',
        order: 5,
        sourcePages: '17',
        sourceBook: 'Global Readings 2',
        objective: 'Recognize and use sequence words (First, Second, Third, Last) to describe chronological order in instructions and inventing.',
        duration: 25,
        gameRoute: 'predictions/index.html',
        activities: [
          {
            type: 'sequence_device',
            title: 'A. Look and order: Device Instructions',
            steps: [
              { order: 1, text: 'Press on.' },
              { order: 2, text: 'Type password.' },
              { order: 3, text: 'Press play.' },
              { order: 4, text: 'Play the game.' }
            ]
          },
          {
            type: 'sequence_inventor',
            title: 'B. Read and put in order: Inventor Steps',
            steps: [
              { signal: 'First', text: 'an inventor has a good idea for an invention.' },
              { signal: 'Second', text: 'an inventor writes down the plan for the invention.' },
              { signal: 'Third', text: 'an inventor makes the invention.' },
              { signal: 'Last', text: 'an inventor tests the invention.' }
            ]
          },
          { type: 'discussion', prompt: 'Why do you think inventors have notebooks? (Example: Because they want to remember things.)' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-6',
        unitId: 'unit-gr2-1',
        title: 'Lesson 6: Reading 2: My Good Ideas Book (Nonfiction)',
        order: 6,
        sourcePages: '18–20',
        sourceBook: 'Global Readings 2',
        objective: 'Read informational text about Thomas Edison, Leonardo da Vinci, and biomimicry (burrs to Velcro, kingfisher to bullet train).',
        duration: 35,
        activities: [
          { type: 'profile', name: 'Thomas Edison (1847–1931)', facts: 'Invented movie projector, sound recorder, light bulb. Had thousands of notebooks.' },
          { type: 'problem_solution', problem: 'Pencils always roll off the table.', solution: 'Shape them like hexagons.' },
          {
            type: 'biomimicry',
            examples: [
              { nature: 'Plant burrs sticking to clothes', invention: 'Velcro shoes' },
              { nature: 'Fast-diving Kingfisher bird beak', invention: 'Aerodynamic Bullet Train nose' }
            ]
          },
          { type: 'vocab_context', words: ['problem', 'solution', 'hexagon', 'improve', 'parachute'] }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-7',
        unitId: 'unit-gr2-1',
        title: 'Lesson 7: Problem Solving & Improving Your Idea',
        order: 7,
        sourcePages: '20–22',
        sourceBook: 'Global Readings 2',
        objective: "Understand the 5-step engineering feedback loop and peer testing using Leonardo da Vinci's drawings and Karl Benz's motorcar.",
        duration: 30,
        gameRoute: 'advice/index.html',
        activities: [
          { type: 'design_cycle', steps: ['1. Have a good idea', '2. Make a drawing', '3. Share your idea', '4. Test your idea', '5. Try again and improve'] },
          { type: 'history_spotlight', inventor: 'Karl Benz (1844–1929)', invention: 'First motorcar (1885)', feedback: '"No horses? Good idea!" / "Only three wheels?"' },
          { type: 'needs_check', prompt: 'To make a Good Ideas Book, you need: ideas, time, a notebook, a pencil.' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr2-1-8',
        unitId: 'unit-gr2-1',
        title: 'Lesson 8: Think Together & Reading Journal Reflection',
        order: 8,
        sourcePages: '23',
        sourceBook: 'Global Readings 2',
        objective: 'Synthesize unit learning: match 4 historical inventors to their inventions and purposes, conduct Round Robin, and write in the Reading Journal.',
        duration: 30,
        activities: [
          {
            type: 'inventor_matrix',
            rows: [
              { inventor: 'Clara Doodle', invention: 'The alarm clock pillow', reason: 'To wake up on time' },
              { inventor: 'Karl Benz', invention: 'The car (motorcar)', reason: 'To travel quickly with no horses' },
              { inventor: 'Leonardo da Vinci', invention: 'The parachute / flying machine', reason: 'To travel in the air' },
              { inventor: 'Thomas Edison', invention: 'The movie projector', reason: 'To show movies' }
            ]
          },
          { type: 'round_robin', topic: 'Why are these inventions important? Give reasons: robot, TV, computer, glass.' },
          {
            type: 'reading_journal',
            prompts: [
              'Write three interesting things from this unit.',
              'What is an invention you want to know about? How can you learn about it?'
            ]
          }
        ],
        archived: false
      },

      // Units 2 to 10 Foundational Lessons
      { id: 'lesson-gr2-2-1', unitId: 'unit-gr2-2', title: 'Reading 1: Chuseok: Korea’s Harvest Festival', order: 1, sourcePages: '24–31', sourceBook: 'Global Readings 2', objective: 'Explore autumn harvest traditions, family feasts, and cultural celebrations in Korea.', duration: 35, archived: false },
      { id: 'lesson-gr2-2-2', unitId: 'unit-gr2-2', title: 'Reading 2: First Harvest (-st blend)', order: 2, sourcePages: '32–39', sourceBook: 'Global Readings 2', objective: 'Apply setting analysis skills and practice -st consonant blend words in story context.', duration: 35, archived: false },

      { id: 'lesson-gr2-3-1', unitId: 'unit-gr2-3', title: 'Reading 1: The Bear and I (-ng blend)', order: 1, sourcePages: '40–47', sourceBook: 'Global Readings 2', objective: 'Read narrative on wildlife encounters and decode -ng final nasal blend patterns.', duration: 35, archived: false },
      { id: 'lesson-gr2-3-2', unitId: 'unit-gr2-3', title: 'Reading 2: Clean Cars (Environmental Science)', order: 2, sourcePages: '48–55', sourceBook: 'Global Readings 2', objective: 'Compare electric and traditional vehicles and discuss how green tech reduces pollution.', duration: 35, archived: false },

      { id: 'lesson-gr2-4-1', unitId: 'unit-gr2-4', title: 'Reading 1: Where Is She?', order: 1, sourcePages: '56–63', sourceBook: 'Global Readings 2', objective: 'Follow story suspense, practice cause and effect identification, and track character actions.', duration: 35, archived: false },
      { id: 'lesson-gr2-4-2', unitId: 'unit-gr2-4', title: 'Reading 2: The Angry Mountain (-nd blend)', order: 2, sourcePages: '64–71', sourceBook: 'Global Readings 2', objective: 'Understand how volcanic eruptions reshape geography and historical settlements.', duration: 35, archived: false },

      { id: 'lesson-gr2-5-1', unitId: 'unit-gr2-5', title: "Reading 1: The Time Book (-nt blend)", order: 1, sourcePages: '72–79', sourceBook: 'Global Readings 2', objective: 'Explore personal history records and decode -nt consonant clusters.', duration: 35, archived: false },
      { id: 'lesson-gr2-5-2', unitId: 'unit-gr2-5', title: 'Reading 2: Time Capsules (Ancient Civilizations)', order: 2, sourcePages: '80–87', sourceBook: 'Global Readings 2', objective: 'Identify main ideas and supporting details about preserved artifacts from the past.', duration: 35, archived: false },

      { id: 'lesson-gr2-6-1', unitId: 'unit-gr2-6', title: 'Reading 1: The Superstar (wh- digraph)', order: 1, sourcePages: '88–95', sourceBook: 'Global Readings 2', objective: 'Read character biography highlighting perseverance and isolate wh- digraph pronunciations.', duration: 35, archived: false },
      { id: 'lesson-gr2-6-2', unitId: 'unit-gr2-6', title: 'Reading 2: Visit Gaudí’s World (Architecture)', order: 2, sourcePages: '96–103', sourceBook: 'Global Readings 2', objective: 'Distinguish facts from opinions while exploring Antoni Gaudí’s organic architectural wonders.', duration: 35, archived: false },

      { id: 'lesson-gr2-7-1', unitId: 'unit-gr2-7', title: 'Reading 1: Great Teamwork (Symbiosis)', order: 1, sourcePages: '104–111', sourceBook: 'Global Readings 2', objective: 'Analyze mutually beneficial partnerships among animal species in nature.', duration: 35, archived: false },
      { id: 'lesson-gr2-7-2', unitId: 'unit-gr2-7', title: 'Reading 2: It’s Mine (-ck blend)', order: 2, sourcePages: '112–119', sourceBook: 'Global Readings 2', objective: 'Predict story outcomes based on character dialogue and conflict resolution.', duration: 35, archived: false },

      { id: 'lesson-gr2-8-1', unitId: 'unit-gr2-8', title: 'Reading 1: In First Place', order: 1, sourcePages: '120–127', sourceBook: 'Global Readings 2', objective: 'Examine sportsmanship, character qualities, and determination in competitive events.', duration: 35, archived: false },
      { id: 'lesson-gr2-8-2', unitId: 'unit-gr2-8', title: 'Reading 2: A New Hero (tr- blends)', order: 2, sourcePages: '128–135', sourceBook: 'Global Readings 2', objective: 'Evaluate historical heroes and articulate what makes everyday community role models.', duration: 35, archived: false },

      { id: 'lesson-gr2-9-1', unitId: 'unit-gr2-9', title: 'Reading 1: The Clever King (br- blend)', order: 1, sourcePages: '136–143', sourceBook: 'Global Readings 2', objective: 'Read folklore tale emphasizing wit and wisdom, practicing initial br- blends.', duration: 35, archived: false },
      { id: 'lesson-gr2-9-2', unitId: 'unit-gr2-9', title: 'Reading 2: Amazing Castles (Architecture & Defense)', order: 2, sourcePages: '144–151', sourceBook: 'Global Readings 2', objective: 'Scan informational text quickly for architectural terms (moat, fortress, kingdom).', duration: 35, archived: false },

      { id: 'lesson-gr2-10-1', unitId: 'unit-gr2-10', title: 'Reading 1: Young Nicholas (sw- blend)', order: 1, sourcePages: '152–159', sourceBook: 'Global Readings 2', objective: 'Follow young traveler’s early encounters, practicing sw- initial blend pronunciation.', duration: 35, archived: false },
      { id: 'lesson-gr2-10-2', unitId: 'unit-gr2-10', title: 'Reading 2: The Thirty-Year Journey', order: 2, sourcePages: '160–167', sourceBook: 'Global Readings 2', objective: 'Chart chronological itinerary of world exploration and discuss why humans venture into the unknown.', duration: 35, archived: false }
    ],
    objectives: [
      { id: 'obj-gr2-p1', lessonId: 'lesson-gr2-p1', text: 'Decode words with long vowels a, e, i, o, u in contexts', skill: 'Phonics', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '4–5', archived: false },
      { id: 'obj-gr2-p2', lessonId: 'lesson-gr2-p2', text: 'Distinguish consonant blends and digraphs sh, st, ch, pl, fl, pr, fr', skill: 'Phonics', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '6–7', archived: false },
      { id: 'obj-gr2-1-1', lessonId: 'lesson-gr2-1-1', text: 'Formulate inquiry questions about everyday inventions and tools', skill: 'Speaking', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '8–9', archived: false },
      { id: 'obj-gr2-1-2', lessonId: 'lesson-gr2-1-2', text: 'Read and retell the story of The After-School Inventor', skill: 'Reading', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '10–15', archived: false },
      { id: 'obj-gr2-1-3', lessonId: 'lesson-gr2-1-3', text: 'Use target invention vocabulary (plan, mirror, mess, machine, invent) in sentences', skill: 'Vocabulary', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '11, 15', archived: false },
      { id: 'obj-gr2-1-4', lessonId: 'lesson-gr2-1-4', text: 'Demonstrate reading comprehension by matching inventions to functions', skill: 'Reading', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '16', archived: false },
      { id: 'obj-gr2-1-5', lessonId: 'lesson-gr2-1-5', text: 'Identify and apply sequence transition words: First, Second, Third, Last', skill: 'Writing', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '17', archived: false },
      { id: 'obj-gr2-1-6', lessonId: 'lesson-gr2-1-6', text: 'Extract key facts from informational text on Edison and biomimicry', skill: 'Reading', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '18–20', archived: false },
      { id: 'obj-gr2-1-7', lessonId: 'lesson-gr2-1-7', text: 'Explain the 5-step engineering design feedback cycle', skill: 'Speaking', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '20–22', archived: false },
      { id: 'obj-gr2-1-8', lessonId: 'lesson-gr2-1-8', text: 'Match historical inventors to their inventions and synthesize unit reflections', skill: 'Writing', cefr: 'Level 2', sourceBook: 'Global Readings 2', sourcePages: '23', archived: false }
    ],
    resource: {
      id: "res-global-readings-2",
      title: "Global Readings 2: Student's Book",
      category: "Curriculum Textbook",
      level: "Level 2",
      age: "7–10",
      grade: "Grade 2-3",
      duration: 45,
      skills: ["Reading", "Vocabulary", "Speaking", "Phonics", "Writing"],
      topics: ["Inventions", "Technology", "Problem Solving", "Biomimicry", "History"],
      objectives: ["Identify sequence of events", "Decode long vowels and blends", "Understand engineering design process"],
      route: "javascript:openTextbookViewer(1, 'book-global-readings-2')",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      thumbnail: "assets/books/global-readings-2/cover.jpg",
      description: "Macmillan Education Level 2 student anthology with 10 units, phonics review, and rich non-fiction and literature."
    }
  };



  // =========================================================================
  // GLOBAL READINGS 3 — LEVEL 3 STUDENT'S BOOK (MACMILLAN EDUCATION)
  // Source: CamScanner 09-05-2026 18.11.pdf (Grade 4 Primary Literacy Anthology)
  // Full Scope & Sequence + Literacy Review + Units 1-10 (4 Weeks per Unit)
  // =========================================================================
  const GLOBAL_READINGS_3_PAGES = [
    { page: 1, file: 'assets/books/global-readings-3/page_01.jpg', title: "Cover — Global Readings 3: Level 3 Student's Book", unit: "Global Readings 3", section: "Macmillan Education Primary Literacy Anthology (Grade 4)" },
    { page: 2, file: 'assets/books/global-readings-3/page_02.jpg', title: "Scope & Sequence (Part 1)", unit: "Scope & Sequence", section: "Literacy Review & Units 1 to 5" },
    { page: 3, file: 'assets/books/global-readings-3/page_03.jpg', title: "Scope & Sequence (Part 2)", unit: "Scope & Sequence", section: "Units 6 to 10" },
    { page: 4, file: 'assets/books/global-readings-3/page_04.jpg', title: "Literacy Review: Fiction — Don\'t Move", unit: "Literacy Review", section: "Reading 1: Don\'t Move & Phonics: final st, initial tr" },
    { page: 5, file: 'assets/books/global-readings-3/page_05.jpg', title: "Literacy Review: Don\'t Move Activities", unit: "Literacy Review", section: "Comprehension & Vocabulary Practice" },
    { page: 6, file: 'assets/books/global-readings-3/page_06.jpg', title: "Literacy Review: Nonfiction — The Monarch Butterfly's Journey", unit: "Literacy Review", section: "Reading 2: Migration & Phonics: final nd, ng" },
    { page: 7, file: 'assets/books/global-readings-3/page_07.jpg', title: "Literacy Review: Butterfly Journey Activities", unit: "Literacy Review", section: "Sequencing & Science Link" },
    { page: 8, file: 'assets/books/global-readings-3/page_08.jpg', title: "Unit 1: I Love Reading — Opener", unit: "Unit 1", section: "See, Think, Wonder: Libraries, books and reading" },
    { page: 9, file: 'assets/books/global-readings-3/page_09.jpg', title: "Unit 1: I Love Reading — Key Concept", unit: "Unit 1", section: "Why is reading important? Inquiry & Discussion" },
    { page: 10, file: 'assets/books/global-readings-3/page_10.jpg', title: "Reading 1: The Beginning of Alice\'s Adventures (Part 1)", unit: "Unit 1", section: "Alice and the White Rabbit by Lewis Carroll" },
    { page: 11, file: 'assets/books/global-readings-3/page_11.jpg', title: "Reading 1: The Beginning of Alice\'s Adventures (Part 2)", unit: "Unit 1", section: "Words in Context: sleepy, chased, fell, shelves, corner, vest" },
    { page: 12, file: 'assets/books/global-readings-3/page_12.jpg', title: "Reading 1: Down the Rabbit Hole (Part 3)", unit: "Unit 1", section: "Alice tumbling down the deep rabbit hole" },
    { page: 13, file: 'assets/books/global-readings-3/page_13.jpg', title: "Reading 1: Down the Rabbit Hole (Part 4)", unit: "Unit 1", section: "Maps, cupboards, and floating jars on the way down" },
    { page: 14, file: 'assets/books/global-readings-3/page_14.jpg', title: "Reading 1: The Golden Key & The Garden (Part 5)", unit: "Unit 1", section: "The little door and the lovely garden" },
    { page: 15, file: 'assets/books/global-readings-3/page_15.jpg', title: "Reading 1: The Little Bottle 'Drink Me' (Part 6)", unit: "Unit 1", section: "Unexpected adventures: shrinking and growing" },
    { page: 16, file: 'assets/books/global-readings-3/page_16.jpg', title: "Explore the Reading 1: Alice Comprehension & Sequencing", unit: "Unit 1", section: "Order events, character emotions, and dialogue" },
    { page: 17, file: 'assets/books/global-readings-3/page_17.jpg', title: "Get Ready to Read: Skimming a Text", unit: "Unit 1", section: "Reading Skill: How to skim headings, first sentences & pictures" },
    { page: 18, file: 'assets/books/global-readings-3/page_18.jpg', title: "Reading 2: Learning and Your Brain (Part 1)", unit: "Unit 1", section: "Nonfiction: Brain lobes, memory, and reading workouts" },
    { page: 19, file: 'assets/books/global-readings-3/page_19.jpg', title: "Reading 2: Learning and Your Brain (Part 2)", unit: "Unit 1", section: "Words in Context: workout, cells, fibers, messages, connecting" },
    { page: 20, file: 'assets/books/global-readings-3/page_20.jpg', title: "Reading 2: Neurons & Reading Pathways (Part 3)", unit: "Unit 1", section: "How brain cells connect when learning new words" },
    { page: 21, file: 'assets/books/global-readings-3/page_21.jpg', title: "Reading 2: Creative Brain Power (Part 4)", unit: "Unit 1", section: "Visualizing stories and building memory power" },
    { page: 22, file: 'assets/books/global-readings-3/page_22.jpg', title: "Explore the Reading 2: Brain Science Link & Phonics", unit: "Unit 1", section: "Brain facts check & Spelling pattern: final -er words" },
    { page: 23, file: 'assets/books/global-readings-3/page_23.jpg', title: "Think Together: Why Is Reading Important? & Journal", unit: "Unit 1", section: "Synthesis discussion, Round Robin & My Reading Journal" }
  ];

  const GLOBAL_READINGS_3_DATA = {
    book: {
      id: 'book-global-readings-3',
      title: 'Global Readings 3',
      level: 'Level 3',
      targetLevel: 'Level 3',
      grade: 'Grade 4',
      gradeLevel: 'Grade 4',
      bookType: "Student's Book",
      publisher: 'Macmillan Education',
      description: 'A primary literacy anthology and reading curriculum featuring 10 thematic units structured across 4-week blocks, neuroscience and ecology connections, and comprehensive literacy review.',
      cover: 'assets/books/global-readings-3/cover.jpg',
      pdfUrl: 'assets/books/global-readings-3/Global-Readings-3.pdf',
      totalPages: 23,
      weeksPerUnit: 4,
      totalUnits: 10,
      archived: false
    },
    units: [
      {
        id: 'unit-gr3-review',
        bookId: 'book-global-readings-3',
        title: 'Literacy Review: Reading Foundations & Skills',
        order: 0,
        pages: '4–7',
        reading1: "Don\'t Move (Fiction: final st and initial tr)",
        reading2: "The Monarch Butterfly\'s Journey (Nonfiction: final nd and ng)",
        readingSkill: "Scanning, Cause & Effect, Sequence of Events",
        contentArea: "Foundational Literacy & Ecology",
        selFocus: "Self-Awareness & Persistence",
        keyConcept: "How do stories and informational texts help us learn about the world?",
        targetVocab: ['freeze', 'still', 'branch', 'predator', 'journey', 'migration', 'monarch', 'chrysalis', 'caterpillar', 'route', 'travel'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Fiction Reading & Phonics Review', focus: 'Decode "Don\'t Move", isolate final -st and initial tr- blends' },
          { weekNumber: 2, title: 'Week 2: Story Comprehension & Character Response', focus: 'Animal defense mechanisms and narrative details' },
          { weekNumber: 3, title: 'Week 3: Nonfiction Migration Reading', focus: 'Monarch butterfly migration route and life cycle' },
          { weekNumber: 4, title: 'Week 4: Sequencing, Phonics -nd/-ng & Review Assessment', focus: 'Cause and effect analysis, consonant clusters and review quiz' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-1',
        bookId: 'book-global-readings-3',
        title: 'Unit 1: I Love Reading',
        durationWeeks: 4,
        duration: '4 weeks',
        order: 1,
        pages: '8–23',
        reading1: "The Beginning of Alice\'s Adventures (Lewis Carroll)",
        reading2: "Learning and Your Brain (Neuroscience)",
        readingSkill: "Skimming a text (Headings, First Sentences, Visuals)",
        contentArea: "Science: Neuroscience",
        selFocus: "Self-Awareness (Emotions & Reflection)",
        keyConcept: "Why is reading important?",
        targetVocab: ['sleepy', 'chased', 'fell', 'shelves', 'corner', 'vest', 'waistcoat', 'lobes', 'workout', 'cells', 'fibers', 'messages', 'connecting', 'creative', 'visualize'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Introduction & Vocabulary Preparation', focus: 'Opener, See-Think-Wonder, target vocabulary, question starts (p. 8–9)' },
          { weekNumber: 2, title: 'Week 2: Main Reading — Alice\'s Adventures', focus: 'Story tracking, Lewis Carroll fantasy, words in context (vest/waistcoat, shelves), dialogue (p. 10–15)' },
          { weekNumber: 3, title: 'Week 3: Explore the Reading & Skimming Skills', focus: 'Chronological ordering, Alice\'s emotions, reading skill: skimming headings & visuals (p. 16–17)' },
          { weekNumber: 4, title: 'Week 4: Learning & Your Brain + Synthesis', focus: 'Brain lobes, neuron pathways, final -er spelling, Round Robin & Reading Journal (p. 18–23)' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-2',
        bookId: 'book-global-readings-3',
        title: 'Unit 2: What Lives Here?',
        order: 2,
        pages: '24–39',
        reading1: 'The Secret Burrow (Animal Homes)',
        reading2: 'Ecosystems in Balance',
        readingSkill: 'Identifying Cause and Effect',
        contentArea: 'Science: Ecology & Habitats',
        selFocus: 'Responsible Decision-Making',
        keyConcept: 'How do living things share habitats?',
        targetVocab: ['habitat', 'burrow', 'ecosystem', 'predator', 'prey', 'shelter', 'balance', 'organism'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Habitat Habitants & Key Vocabulary', focus: 'Explore world biomes, animal shelters, and specialized vocabulary' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Secret Burrow', focus: 'Narrative reading tracking underground animal communities' },
          { weekNumber: 3, title: 'Week 3: Explore the Reading & Cause-Effect', focus: 'Cause and effect analysis of ecological changes' },
          { weekNumber: 4, title: 'Week 4: Ecosystem Balance & Unit 2 Assessment', focus: 'Informational text synthesis, food webs, and reflection journal' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-3',
        bookId: 'book-global-readings-3',
        title: 'Unit 3: How Much Is It?',
        order: 3,
        pages: '40–55',
        reading1: 'The Ancient Marketplace',
        reading2: 'The History of Money',
        readingSkill: 'Distinguishing Fact and Opinion',
        contentArea: 'History: Culture & Trade',
        selFocus: 'Responsible Decision-Making',
        keyConcept: 'Why do we trade and use money?',
        targetVocab: ['market', 'currency', 'barter', 'trade', 'valuable', 'merchant', 'exchange', 'economy'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Trade Traditions & Barter Systems', focus: 'Inquiry into how humans exchange goods and services' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Ancient Marketplace', focus: 'Historical fiction story set in an ancient Mediterranean port' },
          { weekNumber: 3, title: 'Week 3: Fact vs Opinion & Economics Practice', focus: 'Evaluating commercial claims and trading scenarios' },
          { weekNumber: 4, title: 'Week 4: Digital Currency, Budgeting & Assessment', focus: 'Modern transactions, money management, and unit quiz' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-4',
        bookId: 'book-global-readings-3',
        title: 'Unit 4: We Can Do It',
        order: 4,
        pages: '56–71',
        reading1: 'The Bridge Builders',
        reading2: 'Incredible Animal Cooperation',
        readingSkill: 'Problem and Solution',
        contentArea: 'Social Studies: Teamwork',
        selFocus: 'Relationship Skills & Collaboration',
        keyConcept: 'How does cooperating help us achieve more?',
        targetVocab: ['teamwork', 'cooperation', 'overcome', 'challenge', 'bridge', 'collective', 'support', 'unity'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: The Power of Cooperation', focus: 'Teamwork dilemmas, collaborative vocabulary, group goals' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Bridge Builders', focus: 'Story of community engineering and persevering together' },
          { weekNumber: 3, title: 'Week 3: Problem and Solution Matrix', focus: 'Analyzing project obstacles and collaborative solutions' },
          { weekNumber: 4, title: 'Week 4: Animal Cooperation & Team Assessment', focus: 'Ant and wolf pack cooperation, group reflection project' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-5',
        bookId: 'book-global-readings-3',
        title: 'Unit 5: Make Some Noise',
        order: 5,
        pages: '72–87',
        reading1: 'The Rhythm of the Jungle',
        reading2: 'How We Hear Sound',
        readingSkill: 'Visualizing Sensory Language',
        contentArea: 'Arts & Humanities: Music & Sound',
        selFocus: 'Social Awareness & Self-Expression',
        keyConcept: 'How does music express who we are?',
        targetVocab: ['rhythm', 'melody', 'vibration', 'pitch', 'percussion', 'tempo', 'harmony', 'acoustic'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Soundscapes & Musical Inquiry', focus: 'Exploring auditory textures, instruments, and expressive terms' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Rhythm of the Jungle', focus: 'Narrative rich in onomatopoeia, percussion, and cultural dance' },
          { weekNumber: 3, title: 'Week 3: Sensory Visualization & Phonics Rhythm', focus: 'Visualizing acoustic descriptions and poetic structure' },
          { weekNumber: 4, title: 'Week 4: Science of Sound Waves & Reflection', focus: 'How sound travels into the ear, musical showcase presentation' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-6',
        bookId: 'book-global-readings-3',
        title: 'Unit 6: That Looks Good',
        order: 6,
        pages: '88–103',
        reading1: 'The Great Baking Festival',
        reading2: 'Flavors of the World',
        readingSkill: 'Understanding Sequence & Process',
        contentArea: 'Arts & Humanities: Culinary Arts',
        selFocus: 'Responsible Decision-Making & Culture',
        keyConcept: 'How does food bring people together?',
        targetVocab: ['recipe', 'ingredient', 'cuisine', 'flavor', 'measure', 'tradition', 'feast', 'nourish'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Global Cuisines & Cooking Terms', focus: 'Cultural culinary traditions, measurements, recipe words' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Great Baking Festival', focus: 'Story of family baking, friendly competition, and sharing' },
          { weekNumber: 3, title: 'Week 3: Sequence in Recipes & Instructional Writing', focus: 'Step-by-step procedural writing and transition words' },
          { weekNumber: 4, title: 'Week 4: Nutrition Science, Flavors & Journal', focus: 'Tasting notes, balanced food groups, and personal recipe project' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-7',
        bookId: 'book-global-readings-3',
        title: 'Unit 7: How Can We Help?',
        order: 7,
        pages: '104–119',
        reading1: 'The Community Garden Rescue',
        reading2: 'Young Changemakers',
        readingSkill: 'Author\'s Purpose',
        contentArea: 'Social Studies: Communities',
        selFocus: 'Self-Management & Empathy',
        keyConcept: 'How can children make a difference in their community?',
        targetVocab: ['volunteer', 'community', 'service', 'improve', 'donate', 'neighborhood', 'organize', 'benefit'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Community Needs & Civic Action', focus: 'Identifying local challenges and volunteer vocabulary' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Community Garden Rescue', focus: 'Students revitalizing an abandoned urban lot' },
          { weekNumber: 3, title: 'Week 3: Author\'s Purpose & Persuasive Skills', focus: 'Analyzing why texts are written: inform, persuade, entertain' },
          { weekNumber: 4, title: 'Week 4: Global Youth Heroes & Action Plan', focus: 'Real-world changemakers case studies, classroom project' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-8',
        bookId: 'book-global-readings-3',
        title: 'Unit 8: Under the Sea',
        order: 8,
        pages: '120–135',
        reading1: 'Voyage to the Abyss',
        reading2: 'Coral Reef Sanctuaries',
        readingSkill: 'Summarizing Main Ideas',
        contentArea: 'Science: Marine Biology',
        selFocus: 'Social Awareness & Conservation',
        keyConcept: 'What secrets lie in the ocean depths?',
        targetVocab: ['ocean', 'trench', 'submarine', 'bioluminescence', 'coral', 'marine', 'depth', 'species'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Ocean Zones & Marine Life', focus: 'Sunlight zone to midnight abyss, oceanographic terms' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Voyage to the Abyss', focus: 'Submersible dive encountering glowing deep-sea creatures' },
          { weekNumber: 3, title: 'Week 3: Summarizing Information & Graphic Organizers', focus: 'Creating 3-point summaries of scientific readings' },
          { weekNumber: 4, title: 'Week 4: Coral Protection & Marine Assessment', focus: 'Reef bleaching threats, marine conservation, unit test' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-9',
        bookId: 'book-global-readings-3',
        title: "Unit 9: What's the Matter?",
        order: 9,
        pages: '136–151',
        reading1: 'The Mystery of the Missing Energy',
        reading2: 'How the Immune System Protects You',
        readingSkill: 'Comparing and Contrasting',
        contentArea: 'Science: Health & Medicine',
        selFocus: 'Self-Management & Wellness',
        keyConcept: 'How do our bodies stay healthy and strong?',
        targetVocab: ['immune', 'antibody', 'wellness', 'nutrition', 'exercise', 'energy', 'defense', 'hygiene'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Body Systems & Health Inquiry', focus: 'Sleep, nutrition, hydration, and energy cycles' },
          { weekNumber: 2, title: 'Week 2: Reading 1: Missing Energy Mystery', focus: 'Detective story investigating habits that cause fatigue' },
          { weekNumber: 3, title: 'Week 3: Compare & Contrast Venn Diagrams', focus: 'Comparing healthy vs unhealthy lifestyles in texts' },
          { weekNumber: 4, title: 'Week 4: Immune System Defense & Health Guide', focus: 'White blood cells, antibodies, creating a wellness poster' }
        ],
        archived: false
      },
      {
        id: 'unit-gr3-10',
        bookId: 'book-global-readings-3',
        title: "Unit 10: Don't Push the Button",
        order: 10,
        pages: '152–167',
        reading1: 'The Runaway Robot',
        reading2: 'Artificial Intelligence & Future Tech',
        readingSkill: 'Drawing Inferences and Predictions',
        contentArea: 'Science: Engineering & Technology',
        selFocus: 'Self-Management & Ethics',
        keyConcept: 'How do machines help and challenge us?',
        targetVocab: ['robot', 'sensor', 'automate', 'code', 'intelligent', 'circuit', 'future', 'safeguard'],
        weeks: [
          { weekNumber: 1, title: 'Week 1: Robotics, Automation & Technology Ethics', focus: 'Emerging tech terms, sensors, automation and logic' },
          { weekNumber: 2, title: 'Week 2: Reading 1: The Runaway Robot', focus: 'Humorous sci-fi adventure with unintended programming glitches' },
          { weekNumber: 3, title: 'Week 3: Inferences, Clues & Predictive Thinking', focus: 'Reading between the lines to anticipate character moves' },
          { weekNumber: 4, title: 'Week 4: AI in Daily Life, Capstone Review & Celebration', focus: 'Ethical tech, end-of-year reading celebration & showcase' }
        ],
        archived: false
      }
    ],
    lessons: [
      // Literacy Review
      {
        id: 'lesson-gr3-rev-1',
        unitId: 'unit-gr3-review',
        title: 'Reading 1: Don\'t Move (Fiction) & Phonics: final -st, initial tr-',
        order: 1,
        weekNumber: 1,
        sourcePages: '4–5',
        sourceBook: 'Global Readings 3',
        objective: 'Read story on animal camoflague, decode final -st (nest, past, fast) and initial tr- (tree, trip, trail).',
        duration: 35,
        gameRoute: 'camp-mystery/index.html',
        tasks: [
          { type: 'phonics', label: 'Final -st', words: ['nest', 'fast', 'past', 'frost', 'blast'] },
          { type: 'phonics', label: 'Initial tr-', words: ['tree', 'trip', 'track', 'trail', 'trust'] }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-rev-2',
        unitId: 'unit-gr3-review',
        title: 'Reading 2: The Monarch Butterfly\'s Journey & Phonics: final -nd, -ng',
        order: 2,
        weekNumber: 3,
        sourcePages: '6–7',
        sourceBook: 'Global Readings 3',
        objective: 'Follow informational timeline of monarch migration and decode nasal clusters (-nd, -ng).',
        duration: 35,
        tasks: [
          { type: 'phonics', label: 'Final -nd', words: ['land', 'wind', 'pond', 'sand', 'blend'] },
          { type: 'phonics', label: 'Final -ng', words: ['wing', 'song', 'long', 'spring', 'strong'] }
        ],
        archived: false
      },

      // Unit 1: I Love Reading Lessons (Spanning 4 Teaching Weeks)
      {
        id: 'lesson-gr3-1-1',
        unitId: 'unit-gr3-1',
        title: 'Lesson 1: See, Think, Wonder (Why Read?)',
        order: 1,
        weekNumber: 1,
        sourcePages: '8–9',
        sourceBook: 'Global Readings 3',
        objective: 'Engage in inquiry around reading habits, book genres, and evaluate: Why is reading important?',
        duration: 25,
        activities: [
          { type: 'discussion', prompt: 'Look at the library picture. What do you see? How are books organized?' },
          { type: 'inquiry', prompt: 'Think: What kind of books do you enjoy the most — real adventures or fantasy?' },
          { type: 'wonder', prompt: 'Wonder: How does reading change what we imagine in our heads?' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-2',
        unitId: 'unit-gr3-1',
        title: 'Lesson 2: Question Starts & Reading Readiness',
        order: 2,
        weekNumber: 1,
        sourcePages: '9',
        sourceBook: 'Global Readings 3',
        objective: 'Practice question formulation using Who, What, Where, When, Why, and How before reading.',
        duration: 30,
        gameRoute: 'city-mouse/index.html',
        activities: [
          {
            type: 'questions',
            title: 'Question Starters Challenge',
            items: [
              { q: 'Who is the author of Alice\'s Adventures?', a: 'Lewis Carroll' },
              { q: 'Where was Alice sitting at the start?', a: 'By her sister on the bank' },
              { q: 'What caught Alice\'s curiosity?', a: 'A White Rabbit with a waistcoat pocket and watch' }
            ]
          }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-3',
        unitId: 'unit-gr3-1',
        title: 'Lesson 3: Reading 1: The Beginning of Alice\'s Adventures (Part 1)',
        order: 3,
        weekNumber: 2,
        sourcePages: '10–13',
        sourceBook: 'Global Readings 3',
        objective: 'Read excerpts from Alice in Wonderland, identify fantasy narrative elements, and track Alice chasing the White Rabbit.',
        duration: 35,
        activities: [
          { type: 'story', title: 'Part 1: The Bank & The Rabbit', text: 'Alice was beginning to get very tired of sitting by her sister on the bank, when suddenly a White Rabbit with pink eyes ran close by her.' },
          { type: 'story', title: 'Part 2: Down the Rabbit-Hole', text: 'In another moment down went Alice after it, never once considering how in the world she was to get out again.' },
          { type: 'story', title: 'Part 3: Floating Cupboards & Maps', text: 'Down, down, down. The sides of the well were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs.' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-4',
        unitId: 'unit-gr3-1',
        title: 'Lesson 4: Words in Context & British English Nuances',
        order: 4,
        weekNumber: 2,
        sourcePages: '11, 14–15',
        sourceBook: 'Global Readings 3',
        objective: 'Master target vocabulary (sleepy, chased, fell, shelves, corner, vest/waistcoat) in literary context.',
        duration: 30,
        activities: [
          {
            type: 'vocab_definitions',
            words: [
              { word: 'sleepy', def: 'feeling tired and ready for sleep' },
              { word: 'chased', def: 'ran after someone or something to catch them' },
              { word: 'fell', def: 'dropped down through the air without control' },
              { word: 'shelves', def: 'flat boards mounted horizontally to hold books and items' },
              { word: 'corner', def: 'the place where two walls or streets meet' },
              { word: 'vest / waistcoat', def: 'a sleeveless upper garment with buttons down the front' }
            ]
          },
          {
            type: 'dialects',
            pairs: [
              { us: 'vest', uk: 'waistcoat' },
              { us: 'closet / cabinet', uk: 'cupboard' },
              { us: 'flashlight', uk: 'torch' }
            ]
          }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-5',
        unitId: 'unit-gr3-1',
        title: 'Lesson 5: Explore the Reading 1: Chronological Order & Feelings',
        order: 5,
        weekNumber: 3,
        sourcePages: '16',
        sourceBook: 'Global Readings 3',
        objective: 'Order chronological events from Alice\'s fall and map character emotion shifts from boredom to astonishment.',
        duration: 30,
        activities: [
          {
            type: 'sequence_device',
            title: 'Order Alice\'s Adventure Events',
            steps: [
              { order: 1, text: 'Alice sits on the river bank feeling sleepy.' },
              { order: 2, text: 'The White Rabbit checks his pocket watch and runs past.' },
              { order: 3, text: 'Alice chases the rabbit into the large hole.' },
              { order: 4, text: 'Alice falls slowly past cupboards, maps, and bookshelves.' },
              { order: 5, text: 'Alice reaches the long hallway with locked little doors.' }
            ]
          },
          { type: 'discussion', prompt: 'How did Alice\'s feelings change when she saw the rabbit pull a watch out of its pocket?' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-6',
        unitId: 'unit-gr3-1',
        title: 'Lesson 6: Get Ready to Read: Skimming a Text',
        order: 6,
        weekNumber: 3,
        sourcePages: '17',
        sourceBook: 'Global Readings 3',
        objective: 'Apply the reading skill of skimming: read headings, first sentences, and examine diagrams quickly before in-depth reading.',
        duration: 25,
        gameRoute: 'predictions/index.html',
        activities: [
          { type: 'skimming_guide', steps: ['1. Read the title and large headings', '2. Look at the illustrations and diagrams', '3. Read the first sentence of each paragraph', '4. Ask: What will this text teach me?'] },
          { type: 'reflection', prompt: 'Why is skimming useful when researching in school?' }
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-7',
        unitId: 'unit-gr3-1',
        title: 'Lesson 7: Reading 2: Learning and Your Brain (Neuroscience)',
        order: 7,
        weekNumber: 4,
        sourcePages: '18–21',
        sourceBook: 'Global Readings 3',
        objective: 'Read informational text explaining how neurons, synapses, and brain lobes strengthen when reading.',
        duration: 35,
        activities: [
          { type: 'science_facts', facts: ['Your brain weighs about 1.4 kg and has 86 billion neurons.', 'Reading gives multiple brain areas an active workout at once.', 'Practicing new words creates stronger neural pathways called myelin fibers.'] },
          { type: 'vocab_definitions', words: [
            { word: 'lobes', def: 'curved or rounded sections of the brain responsible for specific tasks' },
            { word: 'workout', def: 'physical or mental exercise that strengthens abilities' },
            { word: 'neurons', def: 'specialized cells that transmit electrical nerve impulses' },
            { word: 'fibers', def: 'thin connecting strands that send messages between brain regions' },
            { word: 'visualize', def: 'to form a vivid mental picture or scene in your mind' }
          ]}
        ],
        archived: false
      },
      {
        id: 'lesson-gr3-1-8',
        unitId: 'unit-gr3-1',
        title: 'Lesson 8: Brain Facts, Final -er Spelling & Reading Journal',
        order: 8,
        weekNumber: 4,
        sourcePages: '22–23',
        sourceBook: 'Global Readings 3',
        objective: 'Consolidate unit learning: practice final -er spelling patterns, conduct Round Robin, and complete Reading Journal reflections.',
        duration: 35,
        gameRoute: 'monster day/index.html',
        activities: [
          { type: 'phonics_box', title: 'Spelling Pattern: Agent / Comparative final -er', words: ['reader', 'learner', 'thinker', 'writer', 'faster', 'stronger', 'helper', 'speaker'] },
          { type: 'round_robin', topic: 'Why is reading important for your imagination, memory, and everyday life?' },
          {
            type: 'reading_journal',
            prompts: [
              'What was the most surprising thing you learned about your brain while reading?',
              'How does imagining a story help your brain build stronger neural connections?'
            ]
          }
        ],
        archived: false
      },

      // Foundational Lessons for Units 2–10
      { id: 'lesson-gr3-2-1', unitId: 'unit-gr3-2', title: 'Reading 1: The Secret Burrow (Animal Homes)', order: 1, weekNumber: 2, sourcePages: '24–31', sourceBook: 'Global Readings 3', objective: 'Investigate how woodland creatures construct layered underground shelters.', duration: 35, archived: false },
      { id: 'lesson-gr3-2-2', unitId: 'unit-gr3-2', title: 'Reading 2: Ecosystems in Balance (Food Webs)', order: 2, weekNumber: 4, sourcePages: '32–39', sourceBook: 'Global Readings 3', objective: 'Map cause and effect relationships among predators, prey, and flora in habitats.', duration: 35, archived: false },

      { id: 'lesson-gr3-3-1', unitId: 'unit-gr3-3', title: 'Reading 1: The Ancient Marketplace (Barter to Coinage)', order: 1, weekNumber: 2, sourcePages: '40–47', sourceBook: 'Global Readings 3', objective: 'Trace evolution of merchant trade routes and early monetary exchange.', duration: 35, archived: false },
      { id: 'lesson-gr3-3-2', unitId: 'unit-gr3-3', title: 'Reading 2: The History of Money (Paper to Digital)', order: 2, weekNumber: 4, sourcePages: '48–55', sourceBook: 'Global Readings 3', objective: 'Evaluate fact vs opinion regarding value, wealth, and banking systems.', duration: 35, archived: false },

      { id: 'lesson-gr3-4-1', unitId: 'unit-gr3-4', title: 'Reading 1: The Bridge Builders (Teamwork in Action)', order: 1, weekNumber: 2, sourcePages: '56–63', sourceBook: 'Global Readings 3', objective: 'Follow community members uniting to design and erect an essential footbridge.', duration: 35, archived: false },
      { id: 'lesson-gr3-4-2', unitId: 'unit-gr3-4', title: 'Reading 2: Incredible Animal Cooperation', order: 2, weekNumber: 4, sourcePages: '64–71', sourceBook: 'Global Readings 3', objective: 'Analyze problem and solution frameworks in wildlife packs and colonies.', duration: 35, archived: false },

      { id: 'lesson-gr3-5-1', unitId: 'unit-gr3-5', title: 'Reading 1: The Rhythm of the Jungle (Sensory Narrative)', order: 1, weekNumber: 2, sourcePages: '72–79', sourceBook: 'Global Readings 3', objective: 'Visualize auditory sensory words depicting rainforest ambient melodies.', duration: 35, archived: false },
      { id: 'lesson-gr3-5-2', unitId: 'unit-gr3-5', title: 'Reading 2: How We Hear Sound (Auditory Anatomy)', order: 2, weekNumber: 4, sourcePages: '80–87', sourceBook: 'Global Readings 3', objective: 'Diagram sound wave propagation through the outer, middle, and inner ear.', duration: 35, archived: false },

      { id: 'lesson-gr3-6-1', unitId: 'unit-gr3-6', title: 'Reading 1: The Great Baking Festival', order: 1, weekNumber: 2, sourcePages: '88–95', sourceBook: 'Global Readings 3', objective: 'Track sequential process and measurements in competitive pastry creation.', duration: 35, archived: false },
      { id: 'lesson-gr3-6-2', unitId: 'unit-gr3-6', title: 'Reading 2: Flavors of the World (Culinary Geography)', order: 2, weekNumber: 4, sourcePages: '96–103', sourceBook: 'Global Readings 3', objective: 'Discover spice routes and cultural dining rituals worldwide.', duration: 35, archived: false },

      { id: 'lesson-gr3-7-1', unitId: 'unit-gr3-7', title: 'Reading 1: The Community Garden Rescue', order: 1, weekNumber: 2, sourcePages: '104–111', sourceBook: 'Global Readings 3', objective: 'Examine youth leadership and civic engagement transforming neighborhood spaces.', duration: 35, archived: false },
      { id: 'lesson-gr3-7-2', unitId: 'unit-gr3-7', title: 'Reading 2: Young Changemakers (Profiles in Courage)', order: 2, weekNumber: 4, sourcePages: '112–119', sourceBook: 'Global Readings 3', objective: 'Identify author\'s purpose across global child activist biographies.', duration: 35, archived: false },

      { id: 'lesson-gr3-8-1', unitId: 'unit-gr3-8', title: 'Reading 1: Voyage to the Abyss (Deep Sea Exploration)', order: 1, weekNumber: 2, sourcePages: '120–127', sourceBook: 'Global Readings 3', objective: 'Explore bioluminescent organisms inhabiting bathypelagic ocean trenches.', duration: 35, archived: false },
      { id: 'lesson-gr3-8-2', unitId: 'unit-gr3-8', title: 'Reading 2: Coral Reef Sanctuaries (Marine Ecology)', order: 2, weekNumber: 4, sourcePages: '128–135', sourceBook: 'Global Readings 3', objective: 'Summarize ecological interdependencies maintaining barrier reef health.', duration: 35, archived: false },

      { id: 'lesson-gr3-9-1', unitId: 'unit-gr3-9', title: 'Reading 1: The Mystery of the Missing Energy', order: 1, weekNumber: 2, sourcePages: '136–143', sourceBook: 'Global Readings 3', objective: 'Solve sleep, nutrition, and exercise clues to restore peak stamina.', duration: 35, archived: false },
      { id: 'lesson-gr3-9-2', unitId: 'unit-gr3-9', title: 'Reading 2: How the Immune System Protects You', order: 2, weekNumber: 4, sourcePages: '144–151', sourceBook: 'Global Readings 3', objective: 'Compare and contrast physical skin barriers with internal cellular defenses.', duration: 35, archived: false },

      { id: 'lesson-gr3-10-1', unitId: 'unit-gr3-10', title: 'Reading 1: The Runaway Robot (Sci-Fi Adventure)', order: 1, weekNumber: 2, sourcePages: '152–159', sourceBook: 'Global Readings 3', objective: 'Infer character motivations and foresee comical robotic navigation errors.', duration: 35, archived: false },
      { id: 'lesson-gr3-10-2', unitId: 'unit-gr3-10', title: 'Reading 2: Artificial Intelligence & Future Tech', order: 2, weekNumber: 4, sourcePages: '160–167', sourceBook: 'Global Readings 3', objective: 'Predict positive societal impacts and responsible stewardship of automation.', duration: 35, archived: false }
    ],
    objectives: [
      { id: 'obj-gr3-rev-1', lessonId: 'lesson-gr3-rev-1', text: 'Decode words with final -st and initial tr- accurately', skill: 'Phonics', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '4–5', archived: false },
      { id: 'obj-gr3-rev-2', lessonId: 'lesson-gr3-rev-2', text: 'Trace butterfly migration facts and decode nasal blends -nd, -ng', skill: 'Reading', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '6–7', archived: false },
      { id: 'obj-gr3-1-1', lessonId: 'lesson-gr3-1-1', text: 'Articulate personal perspectives on reading value and book choice', skill: 'Speaking', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '8–9', archived: false },
      { id: 'obj-gr3-1-2', lessonId: 'lesson-gr3-1-2', text: 'Construct targeted inquiry questions using 5W1H interrogatives', skill: 'Grammar', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '9', archived: false },
      { id: 'obj-gr3-1-3', lessonId: 'lesson-gr3-1-3', text: 'Track narrative plot progression and dialogue in Alice\'s Adventures', skill: 'Reading', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '10–13', archived: false },
      { id: 'obj-gr3-1-4', lessonId: 'lesson-gr3-1-4', text: 'Utilize story vocabulary in original spoken and written expressions', skill: 'Vocabulary', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '11, 14–15', archived: false },
      { id: 'obj-gr3-1-5', lessonId: 'lesson-gr3-1-5', text: 'Reconstruct chronological sequence of literary story events', skill: 'Reading', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '16', archived: false },
      { id: 'obj-gr3-1-6', lessonId: 'lesson-gr3-1-6', text: 'Demonstrate skimming techniques to predict passage topic and key facts', skill: 'Reading', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '17', archived: false },
      { id: 'obj-gr3-1-7', lessonId: 'lesson-gr3-1-7', text: 'Explain neural network strengthening and brain lobe participation in reading', skill: 'Speaking', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '18–21', archived: false },
      { id: 'obj-gr3-1-8', lessonId: 'lesson-gr3-1-8', text: 'Apply spelling suffix -er to form agent nouns and comparative adjectives', skill: 'Phonics', cefr: 'Level 3', sourceBook: 'Global Readings 3', sourcePages: '22–23', archived: false }
    ],
    resource: {
      id: "res-global-readings-3",
      title: "Global Readings 3: Student's Book",
      category: "Curriculum Textbook",
      level: "Level 3",
      grade: "Grade 4",
      gradeLevel: "Grade 4",
      age: "9–11",
      duration: 45,
      skills: ["Reading", "Vocabulary", "Speaking", "Neuroscience", "Writing"],
      topics: ["Literature", "Brain Science", "Habitats", "Teamwork", "Ecology"],
      objectives: ["Skim informational and literary texts", "Identify chronological order and character feelings", "Understand brain plasticity in reading"],
      route: "javascript:openTextbookViewer(1, 'book-global-readings-3')",
      worksheet: null,
      teacherGuide: true,
      featured: true,
      archived: false,
      thumbnail: "assets/books/global-readings-3/cover.jpg",
      description: "Macmillan Education Level 3 student anthology featuring 10 units structured across 4-week blocks, literature, neuroscience, and comprehensive literacy review."
    }
  };

  // =========================================================================
  // MONSTER EVOLUTION SYSTEM — SEED DATA & MODELS
  // =========================================================================

  const DEFAULT_PROGRESSION_LEVELS = [
    {
      id: 'lvl-1',
      level: 1,
      name: 'Mystery Egg',
      stageKey: 'egg',
      xpRequired: 0,
      description: 'A smooth, mysterious speckled egg waiting for your English journey to begin.',
      unlockedItems: ['body-blue', 'body-pink', 'body-green', 'body-orange', 'body-purple', 'bg-meadow'],
      rewardXP: 0,
      status: 'active'
    },
    {
      id: 'lvl-2',
      level: 2,
      name: 'Cracking Egg',
      stageKey: 'cracking_egg',
      xpRequired: 100,
      description: 'Glowing fissures appear across the shell as early English practice warms the egg.',
      unlockedItems: ['eyes-happy', 'mouth-cheer'],
      rewardXP: 50,
      status: 'active'
    },
    {
      id: 'lvl-3',
      level: 3,
      name: 'Baby Monster',
      stageKey: 'baby',
      xpRequired: 250,
      description: 'Hatched! A cute, chubby baby monster pops out into the English Adventure world.',
      unlockedItems: ['horns-ears', 'tail-puff', 'eyes-wink', 'glasses-round'],
      rewardXP: 100,
      status: 'active'
    },
    {
      id: 'lvl-4',
      level: 4,
      name: 'Growing Monster',
      stageKey: 'growing',
      xpRequired: 500,
      description: 'Stronger and taller! Expressive arms, perky tail, and sprout horns appear.',
      unlockedItems: ['mouth-toothy', 'horns-nub', 'tail-perky', 'wings-starter', 'hat-scholar'],
      rewardXP: 150,
      status: 'active'
    },
    {
      id: 'lvl-5',
      level: 5,
      name: 'Adventurer Monster',
      stageKey: 'adventurer',
      xpRequired: 1000,
      description: 'Equipped with an explorer fedora and satchel, ready for challenging reading quests.',
      unlockedItems: ['body-gold', 'hat-explorer', 'bp-explorer', 'horns-curved', 'aura-flame', 'bg-crystal'],
      rewardXP: 250,
      status: 'active'
    },
    {
      id: 'lvl-6',
      level: 6,
      name: 'Advanced Monster',
      stageKey: 'advanced',
      xpRequired: 2000,
      description: 'Majestic sweeping dragon wings, glowing crystal horns, and confident presence.',
      unlockedItems: ['horns-crystal', 'wings-dragon', 'tail-dragon', 'eyes-dragon', 'hat-wizard', 'bg-cosmos'],
      rewardXP: 500,
      status: 'active'
    },
    {
      id: 'lvl-7',
      level: 7,
      name: 'Ultimate Monster',
      stageKey: 'ultimate',
      xpRequired: 5000,
      description: 'The legendary sovereign form crowned in celestial gold with cosmic wings.',
      unlockedItems: ['hat-crown', 'wings-celestial', 'tail-flame', 'aura-cosmic', 'bg-castle'],
      rewardXP: 1000,
      status: 'active'
    }
  ];

  const DEFAULT_MONSTER_ITEMS = [
    // Body Colors
    { id: 'body-blue', name: 'Sky Blue', category: 'body', description: 'Bright cheerful sky blue fur', icon: '🔵', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'body-pink', name: 'Berry Pink', category: 'body', description: 'Playful sweet berry pink coat', icon: '🌸', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'body-green', name: 'Leaf Green', category: 'body', description: 'Earthy vibrant fresh leaf green', icon: '🍃', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'body-orange', name: 'Sunset Orange', category: 'body', description: 'Energetic sunset orange fur', icon: '🍊', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'body-purple', name: 'Lavender Purple', category: 'body', description: 'Enchanted whimsical lavender', icon: '💜', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'body-gold', name: 'Royal Gold', category: 'body', description: 'Radiant gleaming gold sheen', icon: '⭐', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'epic', status: 'active' },

    // Eyes
    { id: 'eyes-sparkle', name: 'Anime Sparkle', category: 'eyes', description: 'Big glossy eyes filled with wonder', icon: '✨', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'eyes-happy', name: 'Happy Crescents', category: 'eyes', description: 'Joyful cheerful laughing eyes', icon: '😄', unlockType: 'level', unlockRequirement: { level: 2 }, rarity: 'common', status: 'active' },
    { id: 'eyes-wink', name: 'Curious Wink', category: 'eyes', description: 'Playful winking expression', icon: '😉', unlockType: 'level', unlockRequirement: { level: 3 }, rarity: 'rare', status: 'active' },
    { id: 'eyes-dragon', name: 'Dragon Glow', category: 'eyes', description: 'Fierce glowing golden pupils', icon: '🐲', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },

    // Mouth
    { id: 'mouth-smile', name: 'Sweet Smile', category: 'mouth', description: 'Gentle cute cat smile', icon: '😺', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'mouth-cheer', name: 'Open Cheer', category: 'mouth', description: 'Excited wide open happy cheer', icon: '🗣️', unlockType: 'level', unlockRequirement: { level: 2 }, rarity: 'common', status: 'active' },
    { id: 'mouth-toothy', name: 'Toothy Grin', category: 'mouth', description: 'Playful grin with tiny fangs', icon: '😁', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },

    // Horns / Ears
    { id: 'horns-ears', name: 'Floppy Monster Ears', category: 'horns', description: 'Cute soft bouncy creature ears', icon: '🐰', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'horns-nub', name: 'Sprout Nub Horns', category: 'horns', description: 'Little growing horn sprouts', icon: '🌱', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },
    { id: 'horns-curved', name: 'Curved Ram Horns', category: 'horns', description: 'Sturdy swept-back adventurer horns', icon: '🐏', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'rare', status: 'active' },
    { id: 'horns-crystal', name: 'Crystal Dragon Horns', category: 'horns', description: 'Glowing cyan crystalline spires', icon: '💎', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'legendary', status: 'active' },

    // Wings
    { id: 'wings-starter', name: 'Flutter Wings', category: 'wings', description: 'Cute starter wings for small glides', icon: '🪶', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },
    { id: 'wings-dragon', name: 'Dragon Wings', category: 'wings', description: 'Sweeping majestic winged power', icon: '🦇', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },
    { id: 'wings-celestial', name: 'Celestial Gold Wings', category: 'wings', description: 'Feathered gold divine wings', icon: '🪽', unlockType: 'level', unlockRequirement: { level: 7 }, rarity: 'legendary', status: 'active' },

    // Tails
    { id: 'tail-puff', name: 'Puff Bunny Tail', category: 'tail', description: 'Soft round fluffy tail', icon: '⚪', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'tail-perky', name: 'Perky Spike Tail', category: 'tail', description: 'Curved active tail with tip', icon: '🦎', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },
    { id: 'tail-dragon', name: 'Dragon Tail', category: 'tail', description: 'Long heavy tail with armored fins', icon: '🐊', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },
    { id: 'tail-flame', name: 'Blazing Flame Tail', category: 'tail', description: 'Tail blazing with persistent fire', icon: '🔥', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-hardwork' }, rarity: 'legendary', status: 'active' },


    // Clothing
    { id: 'clothing-vest', name: 'Explorer Vest', category: 'clothing', description: 'Sturdy khaki safari utility vest with brass buttons', icon: '🦺', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },
    { id: 'clothing-cape', name: 'Hero Cape', category: 'clothing', description: 'Flowing crimson superhero cape with gold clasp', icon: '🦸', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'rare', status: 'active' },
    { id: 'clothing-scarf', name: 'Cozy Winter Scarf', category: 'clothing', description: 'Warm knitted emerald green scarf with fringe', icon: '🧣', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'clothing-robe', name: 'Wizard Robe', category: 'clothing', description: 'Midnight indigo scholar robe stitched with silver runes', icon: '👘', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },

    // Hats
    { id: 'hat-explorer', name: 'Explorer Fedora', category: 'hat', description: 'Sturdy field hat for world expeditions', icon: '🤠', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'rare', status: 'active' },
    { id: 'hat-scholar', name: 'Scholar Cap', category: 'hat', description: 'Graduation cap with gold tassel', icon: '🎓', unlockType: 'level', unlockRequirement: { level: 4 }, rarity: 'rare', status: 'active' },
    { id: 'hat-wizard', name: 'Wizard Hat', category: 'hat', description: 'Midnight blue starry magic hat', icon: '🧙', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },
    { id: 'hat-crown', name: 'Imperial Crown', category: 'hat', description: 'Pure gold crown set with rubies and sapphires', icon: '👑', unlockType: 'level', unlockRequirement: { level: 7 }, rarity: 'legendary', status: 'active' },

    // Glasses
    { id: 'glasses-round', name: 'Round Wire Glasses', category: 'glasses', description: 'Scholarly intellectual spectacles', icon: '👓', unlockType: 'level', unlockRequirement: { level: 3 }, rarity: 'common', status: 'active' },
    { id: 'glasses-goggles', name: 'Detective Goggles', category: 'glasses', description: 'Brass mystery investigation goggles', icon: '🥽', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-3' }, rarity: 'epic', status: 'active' },

    // Backpacks
    { id: 'bp-explorer', name: 'Explorer Satchel', category: 'backpack', description: 'Leather field pack with compass brass', icon: '🎒', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'rare', status: 'active' },
    { id: 'bp-book', name: 'Magic Book Bag', category: 'backpack', description: 'Ancient leather pack carrying vocab spells', icon: '📚', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-2' }, rarity: 'epic', status: 'active' },

    // Handheld Accessories
    { id: 'acc-microphone', name: 'Golden Microphone', category: 'accessory', description: 'Awarded for confident English speaking', icon: '🎤', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-speaking' }, rarity: 'epic', status: 'active' },
    { id: 'acc-book', name: 'Adventure Spellbook', category: 'accessory', description: 'Leather-bound reading discovery book', icon: '📖', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-1' }, rarity: 'rare', status: 'active' },

    // Auras
    { id: 'aura-sparkle', name: 'Friendship Sparkles', category: 'aura', description: 'Twinkling stars of teamwork and kindness', icon: '🌟', unlockType: 'achievement', unlockRequirement: { achievementId: 'ach-team' }, rarity: 'rare', status: 'active' },
    { id: 'aura-flame', name: 'Perseverance Flame', category: 'aura', description: 'Golden flame of relentless effort', icon: '🔥', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'epic', status: 'active' },
    { id: 'aura-cosmic', name: 'Cosmic Rings', category: 'aura', description: 'Orbital celestial stardust halo', icon: '💫', unlockType: 'level', unlockRequirement: { level: 7 }, rarity: 'legendary', status: 'active' },

    // Backgrounds
    { id: 'bg-meadow', name: 'Academy Grounds', category: 'background', description: 'Sunny green lawns of Adventure Academy', icon: '🌳', unlockType: 'default', unlockRequirement: {}, rarity: 'common', status: 'active' },
    { id: 'bg-crystal', name: 'Crystal Cavern', category: 'background', description: 'Luminescent cavern of glowing minerals', icon: '🔮', unlockType: 'level', unlockRequirement: { level: 5 }, rarity: 'rare', status: 'active' },
    { id: 'bg-cosmos', name: 'Starry Cosmos', category: 'background', description: 'Deep space filled with learning galaxies', icon: '🌌', unlockType: 'level', unlockRequirement: { level: 6 }, rarity: 'epic', status: 'active' },
    { id: 'bg-castle', name: 'Royal Castle', category: 'background', description: 'Majestic fortress of Master English speakers', icon: '🏰', unlockType: 'level', unlockRequirement: { level: 7 }, rarity: 'legendary', status: 'active' }
  ];

  const DEFAULT_MONSTER_PROFILES = {
  "student-3a-224": {
    "studentId": "student-3a-224",
    "petName": "Aslıhan",
    "monsterName": "Aslıhan's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-224-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-229": {
    "studentId": "student-3a-229",
    "petName": "Ateş",
    "monsterName": "Ateş's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-229-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-354": {
    "studentId": "student-3a-354",
    "petName": "Ayça",
    "monsterName": "Ayça's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-354-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-203": {
    "studentId": "student-3a-203",
    "petName": "Ayşe Mila",
    "monsterName": "Ayşe Mila's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-203-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-227": {
    "studentId": "student-3a-227",
    "petName": "Batı Mustafa",
    "monsterName": "Batı Mustafa's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-227-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-207": {
    "studentId": "student-3a-207",
    "petName": "Beren",
    "monsterName": "Beren's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-207-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-202": {
    "studentId": "student-3a-202",
    "petName": "Beste",
    "monsterName": "Beste's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-202-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-214": {
    "studentId": "student-3a-214",
    "petName": "Cemre",
    "monsterName": "Cemre's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-214-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-222": {
    "studentId": "student-3a-222",
    "petName": "Ege",
    "monsterName": "Ege's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-222-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-209": {
    "studentId": "student-3a-209",
    "petName": "Fatih Yetkin",
    "monsterName": "Fatih Yetkin's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-209-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-219": {
    "studentId": "student-3a-219",
    "petName": "Gökçe",
    "monsterName": "Gökçe's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-219-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-210": {
    "studentId": "student-3a-210",
    "petName": "Gurur",
    "monsterName": "Gurur's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-210-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-206": {
    "studentId": "student-3a-206",
    "petName": "Gülce",
    "monsterName": "Gülce's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-206-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-204": {
    "studentId": "student-3a-204",
    "petName": "Güneş Nisa",
    "monsterName": "Güneş Nisa's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-204-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-223": {
    "studentId": "student-3a-223",
    "petName": "Mavi Nil",
    "monsterName": "Mavi Nil's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-223-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-351": {
    "studentId": "student-3a-351",
    "petName": "Melis Ayşen",
    "monsterName": "Melis Ayşen's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-351-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3a-211": {
    "studentId": "student-3a-211",
    "petName": "Melodi",
    "monsterName": "Melodi's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3a-211-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-353": {
    "studentId": "student-3b-353",
    "petName": "Ahmet",
    "monsterName": "Ahmet's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-353-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-200": {
    "studentId": "student-3b-200",
    "petName": "Ayaz",
    "monsterName": "Ayaz's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-200-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-201": {
    "studentId": "student-3b-201",
    "petName": "Begüm",
    "monsterName": "Begüm's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-201-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-221": {
    "studentId": "student-3b-221",
    "petName": "Buğlem",
    "monsterName": "Buğlem's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-221-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-230": {
    "studentId": "student-3b-230",
    "petName": "Demir",
    "monsterName": "Demir's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-230-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-213": {
    "studentId": "student-3b-213",
    "petName": "Deniz",
    "monsterName": "Deniz's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-213-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-220": {
    "studentId": "student-3b-220",
    "petName": "Deniz",
    "monsterName": "Deniz's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-220-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-217": {
    "studentId": "student-3b-217",
    "petName": "Ece",
    "monsterName": "Ece's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-217-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-352": {
    "studentId": "student-3b-352",
    "petName": "Ece",
    "monsterName": "Ece's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-352-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-215": {
    "studentId": "student-3b-215",
    "petName": "Ecem Naz",
    "monsterName": "Ecem Naz's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-215-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-216": {
    "studentId": "student-3b-216",
    "petName": "Elif Miray",
    "monsterName": "Elif Miray's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-216-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-205": {
    "studentId": "student-3b-205",
    "petName": "İlker Mete",
    "monsterName": "İlker Mete's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-205-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-228": {
    "studentId": "student-3b-228",
    "petName": "Mila",
    "monsterName": "Mila's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-228-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-212": {
    "studentId": "student-3b-212",
    "petName": "Rüzgar Sarp",
    "monsterName": "Rüzgar Sarp's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-212-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-218": {
    "studentId": "student-3b-218",
    "petName": "Sena",
    "monsterName": "Sena's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-218-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-3b-225": {
    "studentId": "student-3b-225",
    "petName": "Ülkü",
    "monsterName": "Ülkü's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-3b-225-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-313": {
    "studentId": "student-4a-313",
    "petName": "Ada",
    "monsterName": "Ada's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-313-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-441": {
    "studentId": "student-4a-441",
    "petName": "Ahmet Mete",
    "monsterName": "Ahmet Mete's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-441-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-311": {
    "studentId": "student-4a-311",
    "petName": "Alya Zeynep",
    "monsterName": "Alya Zeynep's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-311-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-310": {
    "studentId": "student-4a-310",
    "petName": "Bahriye Ada",
    "monsterName": "Bahriye Ada's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-310-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-312": {
    "studentId": "student-4a-312",
    "petName": "Belis",
    "monsterName": "Belis's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-312-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-344": {
    "studentId": "student-4a-344",
    "petName": "Defne",
    "monsterName": "Defne's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-344-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-345": {
    "studentId": "student-4a-345",
    "petName": "Efe",
    "monsterName": "Efe's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-345-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-321": {
    "studentId": "student-4a-321",
    "petName": "Elif Su",
    "monsterName": "Elif Su's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-321-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-315": {
    "studentId": "student-4a-315",
    "petName": "Emir Ali",
    "monsterName": "Emir Ali's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-315-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-302": {
    "studentId": "student-4a-302",
    "petName": "Emir",
    "monsterName": "Emir's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-302-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-317": {
    "studentId": "student-4a-317",
    "petName": "Esila Nil",
    "monsterName": "Esila Nil's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-317-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-314": {
    "studentId": "student-4a-314",
    "petName": "İclal",
    "monsterName": "İclal's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-314-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-343": {
    "studentId": "student-4a-343",
    "petName": "İpek",
    "monsterName": "İpek's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-343-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-341": {
    "studentId": "student-4a-341",
    "petName": "Kemal Tahsin",
    "monsterName": "Kemal Tahsin's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-341-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-342": {
    "studentId": "student-4a-342",
    "petName": "Melik Emir",
    "monsterName": "Melik Emir's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-342-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-300": {
    "studentId": "student-4a-300",
    "petName": "Rüzgar",
    "monsterName": "Rüzgar's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-300-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-320": {
    "studentId": "student-4a-320",
    "petName": "Sühan",
    "monsterName": "Sühan's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-320-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-319": {
    "studentId": "student-4a-319",
    "petName": "Ozan",
    "monsterName": "Ozan's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-319-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4a-109": {
    "studentId": "student-4a-109",
    "petName": "Zeynep Derin",
    "monsterName": "Zeynep Derin's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4a-109-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-346": {
    "studentId": "student-4b-346",
    "petName": "Ali İhsan",
    "monsterName": "Ali İhsan's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-346-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-338": {
    "studentId": "student-4b-338",
    "petName": "Derin",
    "monsterName": "Derin's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-338-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-316": {
    "studentId": "student-4b-316",
    "petName": "Egehan",
    "monsterName": "Egehan's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-316-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-307": {
    "studentId": "student-4b-307",
    "petName": "Elif Asya",
    "monsterName": "Elif Asya's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-307-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-306": {
    "studentId": "student-4b-306",
    "petName": "Elif Beren",
    "monsterName": "Elif Beren's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-306-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-348": {
    "studentId": "student-4b-348",
    "petName": "Elisa Berre",
    "monsterName": "Elisa Berre's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-348-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-318": {
    "studentId": "student-4b-318",
    "petName": "Ertuğrul",
    "monsterName": "Ertuğrul's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-318-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-303": {
    "studentId": "student-4b-303",
    "petName": "İlay",
    "monsterName": "İlay's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-303-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-305": {
    "studentId": "student-4b-305",
    "petName": "Kerem",
    "monsterName": "Kerem's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-305-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-349": {
    "studentId": "student-4b-349",
    "petName": "Lina",
    "monsterName": "Lina's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-349-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-439": {
    "studentId": "student-4b-439",
    "petName": "Mina",
    "monsterName": "Mina's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-439-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-304": {
    "studentId": "student-4b-304",
    "petName": "Nilda",
    "monsterName": "Nilda's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-304-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-440": {
    "studentId": "student-4b-440",
    "petName": "Nisa",
    "monsterName": "Nisa's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-440-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-301": {
    "studentId": "student-4b-301",
    "petName": "Ozan",
    "monsterName": "Ozan's Monster",
    "baseColor": "gold",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-gold",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-301-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-208": {
    "studentId": "student-4b-208",
    "petName": "Şimal",
    "monsterName": "Şimal's Monster",
    "baseColor": "blue",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-blue",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-208-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-322": {
    "studentId": "student-4b-322",
    "petName": "Öykü Çiğdem",
    "monsterName": "Öykü Çiğdem's Monster",
    "baseColor": "pink",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-pink",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-322-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-339": {
    "studentId": "student-4b-339",
    "petName": "Uras",
    "monsterName": "Uras's Monster",
    "baseColor": "green",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-green",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-339-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-309": {
    "studentId": "student-4b-309",
    "petName": "Utku Efe",
    "monsterName": "Utku Efe's Monster",
    "baseColor": "orange",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-orange",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-309-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  },
  "student-4b-308": {
    "studentId": "student-4b-308",
    "petName": "Yağmur Ada",
    "monsterName": "Yağmur Ada's Monster",
    "baseColor": "purple",
    "highestUnlockedLevel": 1,
    "lastCelebratedLevel": 1,
    "isHatched": false,
    "hatchDate": null,
    "equipped": {
      "body": "body-purple",
      "eyes": "default",
      "mouth": "mouth-smile",
      "horns": "none",
      "wings": "none",
      "tail": "none",
      "hat": "none",
      "glasses": "none",
      "backpack": "none",
      "accessory": "none",
      "aura": "none",
      "background": "bg-meadow",
      "clothing": "none"
    },
    "unlockedItems": [],
    "evolutionHistory": [
      {
        "id": "ev-student-4b-308-1",
        "date": "Sep 1, 2026",
        "type": "egg",
        "title": "Mystery Egg Received",
        "detail": "Received Mystery Egg upon joining English Adventure Academy."
      }
    ]
  }
};

  const DEFAULT_PROGRESS_CHECKS = [
    {
      id: "progress-check-gr2-u1",
      title: "English Adventure Progress Check — Grade 3 (A1)",
      subtitle: "Global Readings 2 · Unit 1: What Does It Do? · 4-Week Progress Check",
      cefrTarget: "A1",
      targetGrade: "Grade 3",
      classId: "class-3a",
      bookId: "book-global-readings-2",
      bookTitle: "Global Readings 2",
      unitId: "unit-gr2-1",
      unitTitle: "Unit 1: What Does It Do?",
      unitDuration: "4 weeks",
      durationWeeks: 4,
      timeline: "End of Unit 1",
      durationMinutes: 45,
      assessmentType: "Whole-Class Progress Check",
      createdDate: "2026-09-01",
      displayDate: "September 2026",
      author: "Mr. Maysam",
      archived: false,
      skills: ["reading", "listening", "writing", "speaking"],
      maxScore: 40,
      passingScore: 24,
      readingScoreMax: 10,
      listeningScoreMax: 10,
      writingScoreMax: 10,
      speakingScoreMax: 10,
      readingDetails: {
        textTitle: "The After-School Inventor",
        passage: "Tom goes to his room every day after school. He loves making things. He uses cardboard boxes, bottle caps, plastic cups, and blue paint. Last week, Tom made a robot. It is blue with two shiny lights. The robot cannot fly, but it can move across the floor and carry small pencils. Tom is happy because his invention really works!",
        questions: [
          { num: 1, prompt: "What does Tom make?", options: ["a car", "a robot", "a plane"], correct: "b", key: "b robot", points: 1 },
          { num: 2, prompt: "What color is the robot?", options: ["red", "blue", "yellow"], correct: "b", key: "b blue", points: 1 },
          { num: 3, prompt: "What can the robot do?", options: ["fly in the air", "sing songs", "move and carry things"], correct: "c", key: "c move and carry things", points: 1.5 },
          { num: 4, prompt: "When does Tom work on his inventions?", options: ["before school", "after school", "at night"], correct: "b", key: "b after school", points: 1.5 },
          { num: 5, prompt: "True or False: Tom's robot works.", options: ["True", "False"], correct: "True", key: "True", points: 1 },
          { num: 6, prompt: "Put the story events in order (1, 2, 3):", options: ["[ ] Tom tests the robot", "[ ] Tom collects materials", "[ ] Tom paints it blue"], key: "Order: 2 -> 1 -> 3", points: 2 },
          { num: 7, prompt: "Where does Tom go after school?", answer: "Tom goes to his room", key: "Tom goes to his room", points: 1 },
          { num: 8, prompt: "Why is Tom happy at the end?", answer: "He is happy because his robot works", key: "He is happy because his robot works", points: 1 }
        ]
      },
      listeningDetails: {
        teacherScript: {
          partA: [
            "Number 1: Look at the bags. Listen and circle: The red bag is on the desk.",
            "Number 2: Look at the pictures. Listen and circle: The girl is reading her book.",
            "Number 3: Look at the school objects. Listen and circle: I have got a yellow pencil."
          ],
          partB: [
            "Number 4: Look at the classroom scene. Put the pencil next to the book.",
            "Number 5: Look at the desk. Find the red bag. Circle the red bag.",
            "Number 6: Look at the chair. Draw a star above the chair."
          ]
        },
        answerKey: [
          "1. a red bag (1.5 pts)",
          "2. b girl reading (1.5 pts)",
          "3. c pencil (1.5 pts)",
          "4. Put pencil next to book (1.5 pts)",
          "5. Circle red bag (2 pts)",
          "6. Draw star above chair (2 pts)"
        ]
      },
      writingDetails: {
        partA: [
          "1. My name is _______________________.",
          "2. I am _______________________ years old.",
          "3. I like _______________________.",
          "4. I can _______________________.",
          "5. I have got a _______________________."
        ],
        partB: "Write 3 sentences about yourself or an invention you want to create.",
        rubric: "Sentence structure (2 pts), Vocabulary & Spelling (2 pts), Punctuation & Capitalization (1 pt) = 5 pts. Part A = 5 pts. Total: 10 pts."
      },
      speakingDetails: {
        criteria: [
          { name: "Answers questions", desc: "Understands and responds to teacher prompts", max: 4 },
          { name: "Uses simple sentences", desc: "Forms basic subject-verb sentences (I like..., It is...)", max: 4 },
          { name: "Vocabulary", desc: "Uses Unit 1 target words correctly (robot, invent, bag, etc.)", max: 4 },
          { name: "Pronunciation", desc: "Clarity of sounds, word stress, and intelligibility", max: 4 },
          { name: "Confidence", desc: "Willingness to speak, eye contact, and engagement", max: 4 }
        ],
        maxRaw: 20,
        scaleFormula: "Raw Points / 2 = Score /10"
      }
    },
    {
      id: "progress-check-gr3-u1",
      title: "English Adventure Progress Check — Grade 4 (A1+)",
      subtitle: "Global Readings 3 · Unit 1: I Love Reading · 4-Week Progress Check",
      cefrTarget: "A1+",
      targetGrade: "Grade 4",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      unitDuration: "4 weeks",
      durationWeeks: 4,
      timeline: "End of Unit 1",
      durationMinutes: 45,
      assessmentType: "Whole-Class Progress Check",
      createdDate: "2026-09-01",
      displayDate: "September 2026",
      author: "Mr. Maysam",
      archived: false,
      skills: ["reading", "listening", "writing", "speaking"],
      maxScore: 40,
      passingScore: 24,
      readingScoreMax: 10,
      listeningScoreMax: 10,
      writingScoreMax: 10,
      speakingScoreMax: 10,
      readingDetails: {
        textTitle: "The Inventor's Helper",
        passage: "Sara is a young inventor who loves reading books about technology. Last month, she designed a helper robot for her home. The robot is white with smooth wheels and a small sensor on top. Sara programmed it to tidy her room by picking up books and putting them on the shelves. Sara says reading books gave her the best ideas for her machine. Now, the helper cleans her study area every day so she has more time to read!",
        questions: [
          { num: 1, prompt: "What did Sara build?", options: ["a robot", "a clock", "a telescope"], correct: "a", key: "1. a robot", points: 1 },
          { num: 2, prompt: "What is the robot's main task?", options: ["clean room", "cook dinner", "carry heavy boxes"], correct: "a", key: "2. a clean room", points: 1 },
          { num: 3, prompt: "What color is the robot?", options: ["black", "white", "silver"], correct: "b", key: "3. b white", points: 1 },
          { num: 4, prompt: "When did Sara finish building it?", options: ["yesterday", "last month", "last year"], correct: "b", key: "4. b last month", points: 1 },
          { num: 5, prompt: "How does the robot help Sara?", options: ["plays music", "helps her every day", "teaches reading"], correct: "b", key: "5. b helps her every day", points: 1.5 },
          { num: 6, prompt: "Why does Sara love reading books?", key: "Books gave her the best ideas for her inventions", points: 1.5 },
          { num: 7, prompt: "What does the robot have on top?", key: "A small sensor", points: 1.5 },
          { num: 8, prompt: "True or False: Sara has more time to read now.", correct: "True", key: "True", points: 1.5 }
        ]
      },
      listeningDetails: {
        teacherScript: {
          partA: [
            "Number 1: Look at the transport pictures. Listen: The boy rides his blue bicycle to the library.",
            "Number 2: Look at the furniture. Listen: Look at the chair. There is a sleepy cat on the chair.",
            "Number 3: Look at the gadgets. Listen: Maya uses her camera to take a photo of her project."
          ],
          partB: [
            "Number 4: Look at the table. Draw a book on the table.",
            "Number 5: Find the dog near the window. Circle the dog.",
            "Number 6: Look at the chair. Draw a pen under the chair.",
            "Number 7: Look at the window. Draw a star next to the window.",
            "Number 8: Look at the three balls. Circle the biggest ball."
          ]
        },
        answerKey: [
          "1. a bicycle (1.5 pts)",
          "2. b cat on chair (1.5 pts)",
          "3. c camera (1.5 pts)",
          "4. Draw book on table (1.1 pts)",
          "5. Circle dog (1.1 pts)",
          "6. Draw pen under chair (1.1 pts)",
          "7. Draw star next to window (1.1 pts)",
          "8. Circle biggest ball (1.1 pts)"
        ]
      },
      writingDetails: {
        prompt: "Write 5–6 connected sentences about an invention you would like to build, or how a machine helps you learn English.",
        wordBank: ["invention", "machine", "helpful", "brain", "connect", "creative", "problem", "solve", "future"],
        rubric: "Idea development & vocabulary (4 pts), Sentence grammar & connectivity (3 pts), Mechanics & spelling (3 pts) = 10 pts."
      },
      speakingDetails: {
        criteria: [
          { name: "Answers questions", desc: "Responds accurately and elaborates on questions", max: 4 },
          { name: "Uses simple/connected sentences", desc: "Connects clauses using and, but, because", max: 4 },
          { name: "Vocabulary range", desc: "Uses rich unit vocabulary (robot, machine, sensor, idea)", max: 4 },
          { name: "Pronunciation", desc: "Clear pronunciation, intonation, and rhythm", max: 4 },
          { name: "Confidence & fluency", desc: "Speaks smoothly without undue hesitation", max: 4 }
        ],
        maxRaw: 20,
        scaleFormula: "Raw Points / 2 = Score /10"
      }
    }
  ];
  const DEFAULT_PROGRESS_CHECK_SUBMISSIONS = [
    {
      id: "sub-student-4a-313-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-313",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 6,
      maxRawTotal: 40,
      xpEarned: 60,
      accuracyPct: 15,
      overallScore: 15,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 6, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 60, correct: 6, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-441-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-441",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 5,
      maxRawTotal: 40,
      xpEarned: 50,
      accuracyPct: 12,
      overallScore: 12,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 5, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 50, correct: 5, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-311-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-311",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 10,
      maxRawTotal: 40,
      xpEarned: 100,
      accuracyPct: 25,
      overallScore: 25,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 10, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 100, correct: 10, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-310-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-310",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 10,
      maxRawTotal: 40,
      xpEarned: 100,
      accuracyPct: 25,
      overallScore: 25,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 10, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 100, correct: 10, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-312-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-312",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 8,
      maxRawTotal: 40,
      xpEarned: 80,
      accuracyPct: 20,
      overallScore: 20,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 8, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 80, correct: 8, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-345-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-345",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 5,
      maxRawTotal: 40,
      xpEarned: 50,
      accuracyPct: 12,
      overallScore: 12,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 5, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 50, correct: 5, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-315-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-315",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 5.5,
      maxRawTotal: 40,
      xpEarned: 55,
      accuracyPct: 14,
      overallScore: 14,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 5.5, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 55, correct: 5.5, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-302-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-302",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 6,
      maxRawTotal: 40,
      xpEarned: 60,
      accuracyPct: 15,
      overallScore: 15,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 6, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 60, correct: 6, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-314-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-314",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 7,
      maxRawTotal: 40,
      xpEarned: 70,
      accuracyPct: 18,
      overallScore: 18,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 7, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 70, correct: 7, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-343-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-343",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 10,
      maxRawTotal: 40,
      xpEarned: 100,
      accuracyPct: 25,
      overallScore: 25,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 10, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 100, correct: 10, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-316-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-316",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 10,
      maxRawTotal: 40,
      xpEarned: 100,
      accuracyPct: 25,
      overallScore: 25,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 10, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 100, correct: 10, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-307-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-307",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 7,
      maxRawTotal: 40,
      xpEarned: 70,
      accuracyPct: 18,
      overallScore: 18,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 7, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 70, correct: 7, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-306-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-306",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 7,
      maxRawTotal: 40,
      xpEarned: 70,
      accuracyPct: 18,
      overallScore: 18,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 7, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 70, correct: 7, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-305-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-305",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 7,
      maxRawTotal: 40,
      xpEarned: 70,
      accuracyPct: 18,
      overallScore: 18,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 7, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 70, correct: 7, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-439-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-439",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 6,
      maxRawTotal: 40,
      xpEarned: 60,
      accuracyPct: 15,
      overallScore: 15,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 6, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 60, correct: 6, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-304-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-304",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 10,
      maxRawTotal: 40,
      xpEarned: 100,
      accuracyPct: 25,
      overallScore: 25,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 10, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 100, correct: 10, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4a-319-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4a-319",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 9,
      maxRawTotal: 40,
      xpEarned: 90,
      accuracyPct: 22,
      overallScore: 22,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 9, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 90, correct: 9, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-339-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-339",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 6,
      maxRawTotal: 40,
      xpEarned: 60,
      accuracyPct: 15,
      overallScore: 15,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 6, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 60, correct: 6, total: 10, mastery: "Developing", statusText: "Developing" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Developing"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-309-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-309",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 7,
      maxRawTotal: 40,
      xpEarned: 70,
      accuracyPct: 18,
      overallScore: 18,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 7, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 70, correct: 7, total: 10, mastery: "Secure", statusText: "Secure" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Secure"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "sub-student-4b-308-progress-check-gr3-u1",
      progressCheckId: "progress-check-gr3-u1",
      studentId: "student-4b-308",
      classId: "class-4a",
      bookId: "book-global-readings-3",
      bookTitle: "Global Readings 3",
      unitId: "unit-gr3-1",
      unitTitle: "Unit 1: I Love Reading",
      date: "2026-09-01",
      displayDate: "September 2026",
      status: "completed",
      completionPct: 100,
      rawTotal: 9,
      maxRawTotal: 40,
      xpEarned: 90,
      accuracyPct: 22,
      overallScore: 22,
      mastery: "Needs Support",
      scores: {
        reading: { correct: 0, total: 10 },
        listening: { correct: 0, total: 10 },
        writing: { correct: 0, total: 10 },
        speaking: { correct: 9, total: 10 }
      },
      skillScores: {
        reading: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        listening: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        writing: { score: 0, correct: 0, total: 10, mastery: "Needs Support", statusText: "Needs Support" },
        speaking: { score: 90, correct: 9, total: 10, mastery: "Strong", statusText: "Strong" }
      },
      teacherAssessment: {
        reading: "Needs Support",
        listening: "Needs Support",
        writing: "Needs Support",
        speaking: "Strong"
      },
      teacherComment: "",
      notes: "",
      updatedAt: "2026-09-01T09:00:00.000Z"
    }
  ];

  function getInitialState() {
    return {
      currentRole: 'teacher',
      activeClassId: 'class-3a',
      activeStudentId: 'student-3a-224',

      // 1. Classes
      classes: [
        {
          id: 'class-3a',
          name: 'Grade 3A',
          grade: 'Grade 3',
          teacher: 'Mr. Maysam',
          primaryBookId: 'book-global-readings-2',
          academicYear: '2026–2027',
          cefrTarget: 'A1',
          room: 'Room 3A',
          schedule: 'Mon, Wed · 09:00 – 09:40',
          description: 'Grade 3 cohort exploring Global Readings 2 Unit 1.',
          archived: false
        },
        {
          id: 'class-3b',
          name: 'Grade 3B',
          grade: 'Grade 3',
          teacher: 'Mr. Maysam',
          primaryBookId: 'book-global-readings-2',
          academicYear: '2026–2027',
          cefrTarget: 'A1',
          room: 'Room 3B',
          schedule: 'Mon, Wed · 10:00 – 10:40',
          description: 'Grade 3 cohort exploring Global Readings 2 Unit 1.',
          archived: false
        },
        {
          id: 'class-4a',
          name: 'Grade 4A',
          grade: 'Grade 4',
          teacher: 'Mr. Maysam',
          primaryBookId: 'book-global-readings-3',
          academicYear: '2026–2027',
          cefrTarget: 'A2',
          room: 'Room 4A',
          schedule: 'Tue, Thu · 09:00 – 09:40',
          description: 'Grade 4 cohort exploring Global Readings 3 Unit 1.',
          archived: false
        },
        {
          id: 'class-4b',
          name: 'Grade 4B',
          grade: 'Grade 4',
          teacher: 'Mr. Maysam',
          primaryBookId: 'book-global-readings-3',
          academicYear: '2026–2027',
          cefrTarget: 'A2',
          room: 'Room 4B',
          schedule: 'Tue, Thu · 10:00 – 10:40',
          description: 'Grade 4 cohort exploring Global Readings 3 Unit 1.',
          archived: false
        }
      ],

      // 2. Students
      students: [
        {
          id: 'student-3a-224',
          studentIdNumber: '224',
          firstName: 'Aslıhan',
          lastName: 'Akın',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Aslıhan Akın',
          parentContact: '+90 (555) 224-0001',
          parentEmail: 'parent224@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-229',
          studentIdNumber: '229',
          firstName: 'Ateş',
          lastName: 'Özenci',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ateş Özenci',
          parentContact: '+90 (555) 229-0001',
          parentEmail: 'parent229@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-354',
          studentIdNumber: '354',
          firstName: 'Ayça',
          lastName: 'Koca',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ayça Koca',
          parentContact: '+90 (555) 354-0001',
          parentEmail: 'parent354@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-203',
          studentIdNumber: '203',
          firstName: 'Ayşe Mila',
          lastName: 'Yılmaz',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ayşe Mila Yılmaz',
          parentContact: '+90 (555) 203-0001',
          parentEmail: 'parent203@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-227',
          studentIdNumber: '227',
          firstName: 'Batı Mustafa',
          lastName: 'Kır',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Batı Mustafa Kır',
          parentContact: '+90 (555) 227-0001',
          parentEmail: 'parent227@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-207',
          studentIdNumber: '207',
          firstName: 'Beren',
          lastName: 'Umur',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Beren Umur',
          parentContact: '+90 (555) 207-0001',
          parentEmail: 'parent207@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-202',
          studentIdNumber: '202',
          firstName: 'Beste',
          lastName: 'Aksu',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Beste Aksu',
          parentContact: '+90 (555) 202-0001',
          parentEmail: 'parent202@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-214',
          studentIdNumber: '214',
          firstName: 'Cemre',
          lastName: 'Özbay',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Cemre Özbay',
          parentContact: '+90 (555) 214-0001',
          parentEmail: 'parent214@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-222',
          studentIdNumber: '222',
          firstName: 'Ege',
          lastName: 'Taş',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ege Taş',
          parentContact: '+90 (555) 222-0001',
          parentEmail: 'parent222@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-209',
          studentIdNumber: '209',
          firstName: 'Fatih Yetkin',
          lastName: 'Yılmaz',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Fatih Yetkin Yılmaz',
          parentContact: '+90 (555) 209-0001',
          parentEmail: 'parent209@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-219',
          studentIdNumber: '219',
          firstName: 'Gökçe',
          lastName: 'Duman',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Gökçe Duman',
          parentContact: '+90 (555) 219-0001',
          parentEmail: 'parent219@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-210',
          studentIdNumber: '210',
          firstName: 'Gurur',
          lastName: 'Ürek',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Gurur Ürek',
          parentContact: '+90 (555) 210-0001',
          parentEmail: 'parent210@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-206',
          studentIdNumber: '206',
          firstName: 'Gülce',
          lastName: 'Çalışkan',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Gülce Çalışkan',
          parentContact: '+90 (555) 206-0001',
          parentEmail: 'parent206@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-204',
          studentIdNumber: '204',
          firstName: 'Güneş Nisa',
          lastName: 'Aydın',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Güneş Nisa Aydın',
          parentContact: '+90 (555) 204-0001',
          parentEmail: 'parent204@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-223',
          studentIdNumber: '223',
          firstName: 'Mavi Nil',
          lastName: 'Bozkurt',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Mavi Nil Bozkurt',
          parentContact: '+90 (555) 223-0001',
          parentEmail: 'parent223@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-351',
          studentIdNumber: '351',
          firstName: 'Melis Ayşen',
          lastName: 'Şentürk',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Melis Ayşen Şentürk',
          parentContact: '+90 (555) 351-0001',
          parentEmail: 'parent351@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3a-211',
          studentIdNumber: '211',
          firstName: 'Melodi',
          lastName: 'Karaca',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Melodi Karaca',
          parentContact: '+90 (555) 211-0001',
          parentEmail: 'parent211@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-353',
          studentIdNumber: '353',
          firstName: 'Ahmet',
          lastName: 'Alhasan',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ahmet Alhasan',
          parentContact: '+90 (555) 353-0001',
          parentEmail: 'parent353@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-200',
          studentIdNumber: '200',
          firstName: 'Ayaz',
          lastName: 'Kahraman',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ayaz Kahraman',
          parentContact: '+90 (555) 200-0001',
          parentEmail: 'parent200@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-201',
          studentIdNumber: '201',
          firstName: 'Begüm',
          lastName: 'Eren',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Begüm Eren',
          parentContact: '+90 (555) 201-0001',
          parentEmail: 'parent201@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-221',
          studentIdNumber: '221',
          firstName: 'Buğlem',
          lastName: 'Ariöz',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Buğlem Ariöz',
          parentContact: '+90 (555) 221-0001',
          parentEmail: 'parent221@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-230',
          studentIdNumber: '230',
          firstName: 'Demir',
          lastName: 'Susatar',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Demir Susatar',
          parentContact: '+90 (555) 230-0001',
          parentEmail: 'parent230@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-213',
          studentIdNumber: '213',
          firstName: 'Deniz',
          lastName: 'Akıncı',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Deniz Akıncı',
          parentContact: '+90 (555) 213-0001',
          parentEmail: 'parent213@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-220',
          studentIdNumber: '220',
          firstName: 'Deniz',
          lastName: 'Kavasoğlu',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Deniz Kavasoğlu',
          parentContact: '+90 (555) 220-0001',
          parentEmail: 'parent220@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-217',
          studentIdNumber: '217',
          firstName: 'Ece',
          lastName: 'Aras',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ece Aras',
          parentContact: '+90 (555) 217-0001',
          parentEmail: 'parent217@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-352',
          studentIdNumber: '352',
          firstName: 'Ece',
          lastName: 'Yaşar',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ece Yaşar',
          parentContact: '+90 (555) 352-0001',
          parentEmail: 'parent352@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-215',
          studentIdNumber: '215',
          firstName: 'Ecem Naz',
          lastName: 'Yaman',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ecem Naz Yaman',
          parentContact: '+90 (555) 215-0001',
          parentEmail: 'parent215@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-216',
          studentIdNumber: '216',
          firstName: 'Elif Miray',
          lastName: 'Ata',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Elif Miray Ata',
          parentContact: '+90 (555) 216-0001',
          parentEmail: 'parent216@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-205',
          studentIdNumber: '205',
          firstName: 'İlker Mete',
          lastName: 'Kırsaç',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of İlker Mete Kırsaç',
          parentContact: '+90 (555) 205-0001',
          parentEmail: 'parent205@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-228',
          studentIdNumber: '228',
          firstName: 'Mila',
          lastName: 'Topçu',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Mila Topçu',
          parentContact: '+90 (555) 228-0001',
          parentEmail: 'parent228@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-212',
          studentIdNumber: '212',
          firstName: 'Rüzgar Sarp',
          lastName: 'Kutlu',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Rüzgar Sarp Kutlu',
          parentContact: '+90 (555) 212-0001',
          parentEmail: 'parent212@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-218',
          studentIdNumber: '218',
          firstName: 'Sena',
          lastName: 'Varaş',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Sena Varaş',
          parentContact: '+90 (555) 218-0001',
          parentEmail: 'parent218@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-3b-225',
          studentIdNumber: '225',
          firstName: 'Ülkü',
          lastName: 'Sancaklı',
          classId: 'class-3b',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ülkü Sancaklı',
          parentContact: '+90 (555) 225-0001',
          parentEmail: 'parent225@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-313',
          studentIdNumber: '313',
          firstName: 'Ada',
          lastName: 'Özcan',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ada Özcan',
          parentContact: '+90 (555) 313-0001',
          parentEmail: 'parent313@example.com',
          xp: 60,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-441',
          studentIdNumber: '441',
          firstName: 'Ahmet Mete',
          lastName: 'İnal',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ahmet Mete İnal',
          parentContact: '+90 (555) 441-0001',
          parentEmail: 'parent441@example.com',
          xp: 50,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-311',
          studentIdNumber: '311',
          firstName: 'Alya Zeynep',
          lastName: 'Aydoğmuş',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Alya Zeynep Aydoğmuş',
          parentContact: '+90 (555) 311-0001',
          parentEmail: 'parent311@example.com',
          xp: 100,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-310',
          studentIdNumber: '310',
          firstName: 'Bahriye Ada',
          lastName: 'Güler',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Bahriye Ada Güler',
          parentContact: '+90 (555) 310-0001',
          parentEmail: 'parent310@example.com',
          xp: 100,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-312',
          studentIdNumber: '312',
          firstName: 'Belis',
          lastName: 'Erkanat',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Belis Erkanat',
          parentContact: '+90 (555) 312-0001',
          parentEmail: 'parent312@example.com',
          xp: 80,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-344',
          studentIdNumber: '344',
          firstName: 'Defne',
          lastName: 'Nugay',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Defne Nugay',
          parentContact: '+90 (555) 344-0001',
          parentEmail: 'parent344@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-345',
          studentIdNumber: '345',
          firstName: 'Efe',
          lastName: 'Yaldız',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Efe Yaldız',
          parentContact: '+90 (555) 345-0001',
          parentEmail: 'parent345@example.com',
          xp: 50,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-321',
          studentIdNumber: '321',
          firstName: 'Elif Su',
          lastName: 'Yarar',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Elif Su Yarar',
          parentContact: '+90 (555) 321-0001',
          parentEmail: 'parent321@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-315',
          studentIdNumber: '315',
          firstName: 'Emir Ali',
          lastName: 'Gökalp',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Emir Ali Gökalp',
          parentContact: '+90 (555) 315-0001',
          parentEmail: 'parent315@example.com',
          xp: 55,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-302',
          studentIdNumber: '302',
          firstName: 'Emir',
          lastName: 'Ertem',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Emir Ertem',
          parentContact: '+90 (555) 302-0001',
          parentEmail: 'parent302@example.com',
          xp: 60,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-317',
          studentIdNumber: '317',
          firstName: 'Esila Nil',
          lastName: 'Aslan',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Esila Nil Aslan',
          parentContact: '+90 (555) 317-0001',
          parentEmail: 'parent317@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-314',
          studentIdNumber: '314',
          firstName: 'İclal',
          lastName: 'Gökalp',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of İclal Gökalp',
          parentContact: '+90 (555) 314-0001',
          parentEmail: 'parent314@example.com',
          xp: 70,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-343',
          studentIdNumber: '343',
          firstName: 'İpek',
          lastName: 'İlhan',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of İpek İlhan',
          parentContact: '+90 (555) 343-0001',
          parentEmail: 'parent343@example.com',
          xp: 100,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-341',
          studentIdNumber: '341',
          firstName: 'Kemal Tahsin',
          lastName: 'Demirtaş',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Kemal Tahsin Demirtaş',
          parentContact: '+90 (555) 341-0001',
          parentEmail: 'parent341@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-342',
          studentIdNumber: '342',
          firstName: 'Melik Emir',
          lastName: 'Başara',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Melik Emir Başara',
          parentContact: '+90 (555) 342-0001',
          parentEmail: 'parent342@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-300',
          studentIdNumber: '300',
          firstName: 'Rüzgar',
          lastName: 'Dener',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Rüzgar Dener',
          parentContact: '+90 (555) 300-0001',
          parentEmail: 'parent300@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-320',
          studentIdNumber: '320',
          firstName: 'Sühan',
          lastName: 'Bilbey',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Sühan Bilbey',
          parentContact: '+90 (555) 320-0001',
          parentEmail: 'parent320@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-319',
          studentIdNumber: '319',
          firstName: 'Ozan',
          lastName: 'Topçu',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ozan Topçu',
          parentContact: '+90 (555) 319-0001',
          parentEmail: 'parent319@example.com',
          xp: 90,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4a-109',
          studentIdNumber: '109',
          firstName: 'Zeynep Derin',
          lastName: 'Kılıç',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Zeynep Derin Kılıç',
          parentContact: '+90 (555) 109-0001',
          parentEmail: 'parent109@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-346',
          studentIdNumber: '346',
          firstName: 'Ali İhsan',
          lastName: 'Bıçakçı',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ali İhsan Bıçakçı',
          parentContact: '+90 (555) 346-0001',
          parentEmail: 'parent346@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-338',
          studentIdNumber: '338',
          firstName: 'Derin',
          lastName: 'Küçük',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Derin Küçük',
          parentContact: '+90 (555) 338-0001',
          parentEmail: 'parent338@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-316',
          studentIdNumber: '316',
          firstName: 'Egehan',
          lastName: 'Tekin',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Egehan Tekin',
          parentContact: '+90 (555) 316-0001',
          parentEmail: 'parent316@example.com',
          xp: 100,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-307',
          studentIdNumber: '307',
          firstName: 'Elif Asya',
          lastName: 'Durmaz',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Elif Asya Durmaz',
          parentContact: '+90 (555) 307-0001',
          parentEmail: 'parent307@example.com',
          xp: 70,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-306',
          studentIdNumber: '306',
          firstName: 'Elif Beren',
          lastName: 'Alper',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Elif Beren Alper',
          parentContact: '+90 (555) 306-0001',
          parentEmail: 'parent306@example.com',
          xp: 70,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-348',
          studentIdNumber: '348',
          firstName: 'Elisa Berre',
          lastName: 'Eşkin',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Elisa Berre Eşkin',
          parentContact: '+90 (555) 348-0001',
          parentEmail: 'parent348@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-318',
          studentIdNumber: '318',
          firstName: 'Ertuğrul',
          lastName: 'Turan',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ertuğrul Turan',
          parentContact: '+90 (555) 318-0001',
          parentEmail: 'parent318@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-303',
          studentIdNumber: '303',
          firstName: 'İlay',
          lastName: 'Eşkin',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of İlay Eşkin',
          parentContact: '+90 (555) 303-0001',
          parentEmail: 'parent303@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-305',
          studentIdNumber: '305',
          firstName: 'Kerem',
          lastName: 'Özçakmak',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Kerem Özçakmak',
          parentContact: '+90 (555) 305-0001',
          parentEmail: 'parent305@example.com',
          xp: 70,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-349',
          studentIdNumber: '349',
          firstName: 'Lina',
          lastName: 'Koca',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Lina Koca',
          parentContact: '+90 (555) 349-0001',
          parentEmail: 'parent349@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-439',
          studentIdNumber: '439',
          firstName: 'Mina',
          lastName: 'Çakar',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Mina Çakar',
          parentContact: '+90 (555) 439-0001',
          parentEmail: 'parent439@example.com',
          xp: 60,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-304',
          studentIdNumber: '304',
          firstName: 'Nilda',
          lastName: 'Eşkin',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Nilda Eşkin',
          parentContact: '+90 (555) 304-0001',
          parentEmail: 'parent304@example.com',
          xp: 100,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-440',
          studentIdNumber: '440',
          firstName: 'Nisa',
          lastName: 'Kömürcüoğlu',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Nisa Kömürcüoğlu',
          parentContact: '+90 (555) 440-0001',
          parentEmail: 'parent440@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-301',
          studentIdNumber: '301',
          firstName: 'Ozan',
          lastName: 'Metin',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Ozan Metin',
          parentContact: '+90 (555) 301-0001',
          parentEmail: 'parent301@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-208',
          studentIdNumber: '208',
          firstName: 'Şimal',
          lastName: 'Koyun',
          classId: 'class-4b',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Şimal Koyun',
          parentContact: '+90 (555) 208-0001',
          parentEmail: 'parent208@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-322',
          studentIdNumber: '322',
          firstName: 'Öykü Çiğdem',
          lastName: 'Akar',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Öykü Çiğdem Akar',
          parentContact: '+90 (555) 322-0001',
          parentEmail: 'parent322@example.com',
          xp: 0,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-339',
          studentIdNumber: '339',
          firstName: 'Uras',
          lastName: 'Tekay',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Uras Tekay',
          parentContact: '+90 (555) 339-0001',
          parentEmail: 'parent339@example.com',
          xp: 60,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-309',
          studentIdNumber: '309',
          firstName: 'Utku Efe',
          lastName: 'Kulaç',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Utku Efe Kulaç',
          parentContact: '+90 (555) 309-0001',
          parentEmail: 'parent309@example.com',
          xp: 70,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-4b-308',
          studentIdNumber: '308',
          firstName: 'Yağmur Ada',
          lastName: 'Ovalı',
          classId: 'class-4a',
          age: 10,
          grade: 'Grade 4',
          overallCefr: 'A2',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Parent of Yağmur Ada Ovalı',
          parentContact: '+90 (555) 308-0001',
          parentEmail: 'parent308@example.com',
          xp: 90,
          level: 1,
          streakDays: 0,
          equippedMonster: 'Mystery Egg',
          archived: false,
          manualCefrOverrides: {}
        }
      ],

      // 3. Resources (Games & Lessons)
      resources: CANONICAL_GAMES.concat([GLOBAL_READINGS_2_DATA.resource, GLOBAL_READINGS_3_DATA.resource]),

      // 4. Curriculum Hierarchy
      curriculum: {
        books: [
          GLOBAL_READINGS_2_DATA.book,
          GLOBAL_READINGS_3_DATA.book,
          {
            id: 'book-1',
            title: 'English Explorer A1',
            level: 'A1',
            targetLevel: 'A1',
            description: 'Foundational communicative English for young explorers aged 6–9.',
            archived: false
          },
          {
            id: 'book-2',
            title: 'World Navigators A2',
            level: 'A2',
            targetLevel: 'A2',
            description: 'Advanced communicative English featuring grammar dilemmas, past tenses, and science CLIL.',
            archived: false
          }
        ],
        units: [
          ...GLOBAL_READINGS_2_DATA.units,
          ...GLOBAL_READINGS_3_DATA.units,
          {
            id: 'unit-1',
            bookId: 'book-1',
            title: 'Unit 1: Creatures & My Body',
            order: 1,
            description: 'Describing body parts, physical features, adjectives, and using have/has got.',
            targetVocab: ['eyes', 'ears', 'wings', 'tail', 'horns', 'big', 'furry'],
            archived: false
          },
          {
            id: 'unit-2',
            bookId: 'book-1',
            title: 'Unit 2: Community Heroes & Emergencies',
            order: 2,
            description: 'Firefighters, emergency gear, community roles, and giving alerts.',
            targetVocab: ['helmet', 'hose', 'siren', 'ladder', 'extinguish', 'fire station'],
            archived: false
          },
          {
            id: 'unit-3',
            bookId: 'book-1',
            title: 'Unit 3: My Town & Neighbourhood',
            order: 3,
            description: 'Town landmarks, walking directions, and prepositions of place.',
            targetVocab: ['bakery', 'library', 'hospital', 'opposite', 'between', 'next to'],
            archived: false
          },
          {
            id: 'unit-4',
            bookId: 'book-1',
            title: 'Unit 4: At the Restaurant & Polite Dining',
            order: 4,
            description: 'Ordering food politely, reading menus, prices, and waiter roleplay.',
            targetVocab: ['menu', 'starter', 'dessert', 'would like', 'bill', 'delicious'],
            archived: false
          },
          {
            id: 'unit-5',
            bookId: 'book-2',
            title: 'Unit 1: The Advice Academy',
            order: 1,
            description: "Modal verbs should and shouldn't for problem solving.",
            targetVocab: ['should', "shouldn't", 'advice', 'problem', 'dilemma', 'recommend'],
            archived: false
          }
        ],
        lessons: [
          ...GLOBAL_READINGS_2_DATA.lessons,
          ...GLOBAL_READINGS_3_DATA.lessons,
          {
            id: 'lesson-1',
            unitId: 'unit-1',
            title: 'Monster Maker Challenge',
            order: 1,
            objective: 'Students can name 6 monster body parts and use has got accurately.',
            gameRoute: 'monster day/index.html',
            duration: 25,
            archived: false
          },
          {
            id: 'lesson-2',
            unitId: 'unit-2',
            title: 'Fire Station Emergency Drill',
            order: 1,
            objective: 'Students can identify firefighter tools and state emergency actions.',
            gameRoute: 'firefighter/index.html',
            duration: 35,
            archived: false
          },
          {
            id: 'lesson-3',
            unitId: 'unit-3',
            title: 'Neighbourhood Map Exploration',
            order: 1,
            objective: 'Students describe where locations are using between, opposite, next to.',
            gameRoute: 'neighbourhood/index.html',
            duration: 30,
            archived: false
          },
          {
            id: 'lesson-4',
            unitId: 'unit-4',
            title: 'Restaurant Roleplay & Dining',
            order: 1,
            objective: 'Students order food politely with "I would like... please".',
            gameRoute: 'restaurant/index.html',
            duration: 40,
            archived: false
          },
          {
            id: 'lesson-5',
            unitId: 'unit-5',
            title: 'Giving Great Advice (Should & Shouldn\'t)',
            order: 1,
            objective: 'Students formulate recommendations with should and warnings with shouldn\'t.',
            gameRoute: 'advice/index.html',
            duration: 35,
            archived: false
          }
        ],
        objectives: [
          ...GLOBAL_READINGS_2_DATA.objectives,
          ...GLOBAL_READINGS_3_DATA.objectives,
          { id: 'obj-1', lessonId: 'lesson-1', text: 'Identify and name 6 creature body parts', skill: 'Vocabulary', cefr: 'Pre-A1', archived: false },
          { id: 'obj-2', lessonId: 'lesson-1', text: 'Form sentences with "It has got..."', skill: 'Grammar', cefr: 'A1', archived: false },
          { id: 'obj-3', lessonId: 'lesson-2', text: 'State firefighter equipment functions', skill: 'Speaking', cefr: 'A1', archived: false },
          { id: 'obj-4', lessonId: 'lesson-4', text: 'Order meals politely using "I would like"', skill: 'Speaking', cefr: 'A1', archived: false },
          { id: 'obj-5', lessonId: 'lesson-5', text: 'Form sentences using "You should..." and "You shouldn\'t..."', skill: 'Grammar', cefr: 'A2', archived: false },
          { id: 'obj-6', lessonId: 'lesson-5', text: 'Give constructive advice for 4 daily dilemmas', skill: 'Speaking', cefr: 'A2', archived: false }
        ]
      },

      // 5. Assignments
      assignments: [
        {
          id: 'asg-3a-1',
          title: 'Monster Day: Body Parts & Colors',
          classId: 'class-3a',
          activityId: 'monster-day',
          studentIds: 'all',
          dueDate: 'Sep 18, 2026',
          instructions: 'Build a monster with at least 4 eyes and describe its colors to earn XP!',
          objectives: ['Body parts', 'Colors', 'Adjectives'],
          status: 'Active',
          archived: false
        },
        {
          id: 'asg-3b-1',
          title: 'Monster Day: Body Parts & Colors',
          classId: 'class-3b',
          activityId: 'monster-day',
          studentIds: 'all',
          dueDate: 'Sep 18, 2026',
          instructions: 'Build a monster with at least 4 eyes and describe its colors to earn XP!',
          objectives: ['Body parts', 'Colors', 'Adjectives'],
          status: 'Active',
          archived: false
        },
        {
          id: 'asg-4a-1',
          title: 'At the Restaurant: Dining Dialogue',
          classId: 'class-4a',
          activityId: 'restaurant',
          studentIds: 'all',
          dueDate: 'Sep 22, 2026',
          instructions: 'Complete 3 customer roleplay rounds ordering healthy meals.',
          objectives: ['Polite requests', 'Food vocabulary'],
          status: 'Active',
          archived: false
        },
        {
          id: 'asg-4b-1',
          title: 'At the Restaurant: Dining Dialogue',
          classId: 'class-4b',
          activityId: 'restaurant',
          studentIds: 'all',
          dueDate: 'Sep 22, 2026',
          instructions: 'Complete 3 customer roleplay rounds ordering healthy meals.',
          objectives: ['Polite requests', 'Food vocabulary'],
          status: 'Active',
          archived: false
        }
      ],

      // 6. Homework
      homework: [
        {
          id: 'hw-1',
          title: 'Daily Routine Clock Practice',
          type: 'Game Mission',
          classId: 'class-3a',
          studentIds: 'all',
          dueDate: 'Sep 20, 2026',
          description: 'Play the Daily Routine Adventure and set 5 clock times accurately.',
          archived: false
        },
        {
          id: 'hw-2',
          title: 'My Neighbourhood Prepositions Worksheet',
          type: 'Worksheet',
          classId: 'class-3a',
          studentIds: 'all',
          dueDate: 'Sep 24, 2026',
          description: 'Complete the map drawing worksheet circling places opposite the library.',
          archived: false
        }
      ],

      // 7. Quizzes & Tests
      quizzes: [
        {
          id: 'quiz-1',
          title: 'Unit 1 & 2 Vocabulary & Speaking Check',
          targetCefr: 'A1',
          skill: 'Vocabulary',
          questions: [
            {
              id: 'q-1',
              question: 'Which tool does a firefighter use to put out water?',
              options: ['A water hose', 'A frying pan', 'A paint brush'],
              correctIndex: 0
            },
            {
              id: 'q-2',
              question: 'Complete the sentence: "Zorgon the monster _____ three big ears."',
              options: ['has got', 'is having', 'have'],
              correctIndex: 0
            }
          ],
          archived: false
        }
      ],

      // 8. Teacher Rubric Assessments
      assessments: [],

      // 9. Real Attendance Records
      attendanceRecords: [],

      // 10. Transaction-based XP Ledger
      xpTransactions: [
        {
          id: 'xp-init-student-4a-313-progress-check-gr3-u1',
          studentId: 'student-4a-313',
          amount: 60,
          points: 60,
          xpAmount: 60,
          xp: 60,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (6/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-313',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-441-progress-check-gr3-u1',
          studentId: 'student-4a-441',
          amount: 50,
          points: 50,
          xpAmount: 50,
          xp: 50,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (5/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-441',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-311-progress-check-gr3-u1',
          studentId: 'student-4a-311',
          amount: 100,
          points: 100,
          xpAmount: 100,
          xp: 100,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (10/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-311',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-310-progress-check-gr3-u1',
          studentId: 'student-4a-310',
          amount: 100,
          points: 100,
          xpAmount: 100,
          xp: 100,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (10/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-310',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-312-progress-check-gr3-u1',
          studentId: 'student-4a-312',
          amount: 80,
          points: 80,
          xpAmount: 80,
          xp: 80,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (8/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-312',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-345-progress-check-gr3-u1',
          studentId: 'student-4a-345',
          amount: 50,
          points: 50,
          xpAmount: 50,
          xp: 50,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (5/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-345',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-315-progress-check-gr3-u1',
          studentId: 'student-4a-315',
          amount: 55,
          points: 55,
          xpAmount: 55,
          xp: 55,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (5.5/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-315',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-302-progress-check-gr3-u1',
          studentId: 'student-4a-302',
          amount: 60,
          points: 60,
          xpAmount: 60,
          xp: 60,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (6/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-302',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-314-progress-check-gr3-u1',
          studentId: 'student-4a-314',
          amount: 70,
          points: 70,
          xpAmount: 70,
          xp: 70,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (7/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-314',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-343-progress-check-gr3-u1',
          studentId: 'student-4a-343',
          amount: 100,
          points: 100,
          xpAmount: 100,
          xp: 100,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (10/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-343',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-316-progress-check-gr3-u1',
          studentId: 'student-4b-316',
          amount: 100,
          points: 100,
          xpAmount: 100,
          xp: 100,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (10/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-316',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-307-progress-check-gr3-u1',
          studentId: 'student-4b-307',
          amount: 70,
          points: 70,
          xpAmount: 70,
          xp: 70,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (7/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-307',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-306-progress-check-gr3-u1',
          studentId: 'student-4b-306',
          amount: 70,
          points: 70,
          xpAmount: 70,
          xp: 70,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (7/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-306',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-305-progress-check-gr3-u1',
          studentId: 'student-4b-305',
          amount: 70,
          points: 70,
          xpAmount: 70,
          xp: 70,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (7/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-305',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-439-progress-check-gr3-u1',
          studentId: 'student-4b-439',
          amount: 60,
          points: 60,
          xpAmount: 60,
          xp: 60,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (6/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-439',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-304-progress-check-gr3-u1',
          studentId: 'student-4b-304',
          amount: 100,
          points: 100,
          xpAmount: 100,
          xp: 100,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (10/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-304',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4a-319-progress-check-gr3-u1',
          studentId: 'student-4a-319',
          amount: 90,
          points: 90,
          xpAmount: 90,
          xp: 90,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (9/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4a-319',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-339-progress-check-gr3-u1',
          studentId: 'student-4b-339',
          amount: 60,
          points: 60,
          xpAmount: 60,
          xp: 60,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (6/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-339',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-309-progress-check-gr3-u1',
          studentId: 'student-4b-309',
          amount: 70,
          points: 70,
          xpAmount: 70,
          xp: 70,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (7/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-309',
          classId: 'class-4a',
          status: 'active'
        },
        {
          id: 'xp-init-student-4b-308-progress-check-gr3-u1',
          studentId: 'student-4b-308',
          amount: 90,
          points: 90,
          xpAmount: 90,
          xp: 90,
          reason: 'Four-Skill Assessment: English Adventure Progress Check — Grade 4 (A1+) (9/40)',
          category: 'positive',
          icon: '⭐',
          date: 'September 2026',
          timestamp: '2026-09-01T09:00:00.000Z',
          source: 'assessment',
          sourceId: 'pc-assessment-progress-check-gr3-u1-student-4b-308',
          classId: 'class-4a',
          status: 'active'
        }
      ],

      // 11. Learning Evidence (Progress Calculation)
      learningEvidence: [],

      // 12. Persistent Private Teacher Notes
      teacherNotes: [],

      // 13. Class Story Posts
      classStory: [
        {
          id: 'post-1',
          classId: 'class-3a',
          studentIds: 'all',
          type: 'Classroom Moment',
          title: 'Incredible Monster Creators in Action!',
          content: 'Our young explorers designed colorful monsters today and practiced describing their body parts using full English sentences. Wonderful participation!',
          mediaUrl: null,
          timestamp: '2 hours ago',
          likes: 5,
          archived: false
        }
      ],

      // 14. Family Message Threads
      
      // 13. Groups (Classroom Teams)
      groups: [
        {
          id: 'group-3a-1',
          classId: 'class-3a',
          name: 'Blue Dolphins',
          color: '#2563eb',
          studentIds: ['student-3a-224', 'student-3a-229', 'student-3a-354', 'student-3a-203'],
          createdDate: '2026-09-01'
        },
        {
          id: 'group-3a-2',
          classId: 'class-3a',
          name: 'Green Explorers',
          color: '#10b981',
          studentIds: ['student-3a-227', 'student-3a-207', 'student-3a-202', 'student-3a-214'],
          createdDate: '2026-09-01'
        },
        {
          id: 'group-3b-1',
          classId: 'class-3b',
          name: 'Red Dragons',
          color: '#ef4444',
          studentIds: ['student-3b-353', 'student-3b-200', 'student-3b-201', 'student-3b-221'],
          createdDate: '2026-09-01'
        },
        {
          id: 'group-4a-1',
          classId: 'class-4a',
          name: 'Golden Eagles',
          color: '#eab308',
          studentIds: ['student-4a-313', 'student-4a-441', 'student-4a-311', 'student-4a-310'],
          createdDate: '2026-09-01'
        },
        {
          id: 'group-4b-1',
          classId: 'class-4b',
          name: 'Purple Navigators',
          color: '#8b5cf6',
          studentIds: ['student-4b-346', 'student-4b-338', 'student-4b-316', 'student-4b-307'],
          createdDate: '2026-09-01'
        }
      ],

      // 14. Portfolios (Student Work & Multimedia Evidence)
      portfolios: [],

      // 15. Worksheets & Printable Activity Sheets
      worksheets: [
        {
          id: 'ws-1',
          title: 'At the Restaurant: Dining Dialogue & Menu Ordering',
          level: 'A1+',
          grade: 'Grade 3',
          skill: 'Speaking & Roleplay',
          topic: 'Food & Dining',
          duration: '25 min',
          status: 'Ready to Print',
          createdDate: '2026-09-01',
          instructions: 'Read the dialogue with a partner, fill in the missing customer requests, and practice acting out the order.',
          questions: [
            { id: 'q-1', text: 'What polite phrase is used to order food?', type: 'multiple_choice', options: ['I want food', 'I would like... please', 'Give me now', 'Food is good'], answer: 'I would like... please', points: 1 },
            { id: 'q-2', text: 'Fill in the blank: "How _____ is the chocolate cake?"', type: 'fill_blank', options: [], answer: 'much', points: 1 },
            { id: 'q-3', text: 'True or False: In a restaurant, the person serving you is the chef.', type: 'true_false', options: ['True', 'False'], answer: 'False', points: 1 },
            { id: 'q-4', text: 'Write two questions you can ask the waiter about the menu.', type: 'short_answer', options: [], answer: 'Can I have the menu please? How much is the soup?', points: 2 }
          ],
          category: 'Roleplay & Speaking',
          lessonId: 'lesson-1',
          gameId: 'restaurant',
          pdfUrl: 'restaurant/worksheets.html',
          answerKey: '1. I would like... please; 2. much; 3. False; 4. Can I have... / How much is...',
          description: 'Customer and waiter script practice with food vocabulary matching.',
          archived: false
        },
        {
          id: 'ws-2',
          title: 'Fire Station Adventure: Gear & Emergency Protocol',
          level: 'A1',
          grade: 'Grade 3',
          skill: 'Vocabulary & Speaking',
          topic: 'Community Heroes',
          duration: '20 min',
          status: 'Ready to Print',
          createdDate: '2026-09-02',
          instructions: 'Label firefighter tools, sequence the emergency alarm steps, and write 3 safety rules.',
          questions: [
            { id: 'q-1', text: 'Which tool does a firefighter use to put out a fire?', type: 'multiple_choice', options: ['Helmet', 'Hose', 'Ladder', 'Boots'], answer: 'Hose', points: 1 },
            { id: 'q-2', text: 'Fill in the blank: "Firefighters slide down the _____ pole to get to the truck quickly."', type: 'fill_blank', options: [], answer: 'fire', points: 1 },
            { id: 'q-3', text: 'True or False: The loud sound from a fire truck is called a siren.', type: 'true_false', options: ['True', 'False'], answer: 'True', points: 1 }
          ],
          category: 'Interactive Story',
          lessonId: 'lesson-2',
          gameId: 'firefighter',
          pdfUrl: 'firefighter/worksheet.html',
          answerKey: '1. Hose; 2. fire; 3. True',
          description: 'Vocabulary labeling and sequencing exercise for emergency response.',
          archived: false
        },
        {
          id: 'ws-3',
          title: 'My Neighbourhood: Prepositions of Place Map',
          level: 'A1',
          grade: 'Grade 3',
          skill: 'Grammar & Reading',
          topic: 'Town & Places',
          duration: '30 min',
          status: 'Ready to Print',
          createdDate: '2026-09-03',
          instructions: 'Look at the map. Complete the sentences using next to, opposite, and between.',
          questions: [
            { id: 'q-1', text: 'The bakery is _____ the post office and the library.', type: 'multiple_choice', options: ['opposite', 'between', 'next to', 'under'], answer: 'between', points: 1 },
            { id: 'q-2', text: 'Fill in the blank: "There _____ a hospital across the street."', type: 'fill_blank', options: [], answer: 'is', points: 1 },
            { id: 'q-3', text: 'True or False: "Opposite" means on the other side of the road.', type: 'true_false', options: ['True', 'False'], answer: 'True', points: 1 }
          ],
          category: 'Grammar & Vocabulary',
          lessonId: 'lesson-3',
          gameId: 'neighbourhood',
          pdfUrl: 'neighbourhood/index.html',
          answerKey: '1. between; 2. is; 3. True',
          description: 'Map navigation exercise completing "There is a..." sentences.',
          archived: false
        },
        {
          id: 'ws-4',
          title: 'Past Simple Detective Clues Worksheet',
          level: 'A2',
          grade: 'Grade 4',
          skill: 'Grammar & Writing',
          topic: 'Past Events & Mystery',
          duration: '35 min',
          status: 'Ready to Print',
          createdDate: '2026-09-04',
          instructions: 'Convert verbs into past simple regular (-ed) and irregular forms to solve the museum mystery.',
          questions: [
            { id: 'q-1', text: 'What is the past tense of "see"?', type: 'multiple_choice', options: ['seed', 'saw', 'seen', 'sawed'], answer: 'saw', points: 1 },
            { id: 'q-2', text: 'Fill in the blank: "Yesterday at 3 PM, the detective _____ (find) the missing key."', type: 'fill_blank', options: [], answer: 'found', points: 1 },
            { id: 'q-3', text: 'True or False: "Walked" is a regular past tense verb.', type: 'true_false', options: ['True', 'False'], answer: 'True', points: 1 }
          ],
          category: 'Mystery & Grammar',
          lessonId: 'lesson-4',
          gameId: 'story/hotel/index.html',
          pdfUrl: 'story/hotel/index.html',
          answerKey: '1. saw; 2. found; 3. True',
          description: 'Grammar analysis matching witness statements with suspects.',
          archived: false
        }
      ],

      // 16. Rubrics (Customizable Multi-Skill Criteria)
      rubrics: [
        {
          id: 'rubric-speaking-a1',
          name: 'Primary Speaking & Fluency Rubric (CEFR A1)',
          skill: 'Speaking',
          criteria: [
            { id: 'crit-1', name: 'Interactive Fluency', description: 'Can ask and answer simple questions about personal details and familiar topics.', maxScore: 5 },
            { id: 'crit-2', name: 'Vocabulary Range', description: 'Uses basic repertoire of words related to concrete everyday situations.', maxScore: 5 },
            { id: 'crit-3', name: 'Grammatical Accuracy', description: 'Shows only limited control of a few simple grammatical structures and sentence patterns.', maxScore: 5 },
            { id: 'crit-4', name: 'Phonological Clarity', description: 'Pronunciation is clear enough to be understood with some repetition needed.', maxScore: 5 }
          ],
          archived: false
        },
        {
          id: 'rubric-writing-a1',
          name: 'Primary Writing & Composition Rubric (CEFR A1)',
          skill: 'Writing',
          criteria: [
            { id: 'crit-w1', name: 'Content & Task Completion', description: 'Writes short simple phrases and sentences on familiar topics.', maxScore: 5 },
            { id: 'crit-w2', name: 'Spelling & Mechanics', description: 'Can copy familiar words and short phrases correctly with minimal errors.', maxScore: 5 },
            { id: 'crit-w3', name: 'Sentence Construction', description: 'Forms basic SVO sentences using simple conjunctions like and, but.', maxScore: 5 }
          ],
          archived: false
        }
      ],

      // 17. Badges (Gamification Milestones)
      badges: [
        { id: 'badge-1', name: 'Star Explorer', icon: '⭐', description: 'Earned your first 1,000 XP in learning missions.', category: 'Milestones', xpReward: 100, archived: false },
        { id: 'badge-2', name: 'Spoken Fluent', icon: '🗣️', description: 'Spoke English with high confidence in 5 classroom sessions.', category: 'Speaking', xpReward: 150, archived: false },
        { id: 'badge-3', name: 'Grammar Wizard', icon: '🪄', description: 'Mastered 3 consecutive grammar challenges with 90%+ accuracy.', category: 'Grammar', xpReward: 200, archived: false },
        { id: 'badge-4', name: 'Team Helper', icon: '🤝', description: 'Assisted classmates during pairwork and group challenges.', category: 'Social', xpReward: 100, archived: false },
        { id: 'badge-5', name: 'Streak Champion', icon: '🔥', description: 'Maintained a 7-day learning streak in digital activities.', category: 'Consistency', xpReward: 250, archived: false }
      ],

      // 18. Achievements (Unlockable Challenges)
      achievements: [
        { id: 'ach-1', name: 'World Traveler', icon: '🌍', requirement: 'Unlock 3 distinct interactive learning worlds.', category: 'Exploration', xpReward: 300, archived: false },
        { id: 'ach-2', name: 'Vocabulary Collector', icon: '📚', requirement: 'Master 100 core vocabulary words across units.', category: 'Vocabulary', xpReward: 350, archived: false },
        { id: 'ach-3', name: 'Mystery Solver', icon: '🕵️', requirement: 'Complete the Mystery Hotel investigation story.', category: 'Reading & Logic', xpReward: 250, archived: false }
      ],

      // 19. Reports (Dynamic Generated Student Report Cards)
      reports: [],

      // 20. School & Classroom Global Settings
      schoolSettings: {
        schoolName: 'English Adventure Academy',
        teacherName: 'Mr. Maysam',
        academicYear: '2026–2027',
        term: 'Term 1',
        primaryCefrTarget: 'A1',
        leaderboardEnabled: true,
        parentStoryVisibility: true,
        soundEffectsEnabled: true,
        monsterEvolutionEnabled: true,
        xpProgressionEnabled: true,
        achievementRewardsEnabled: true,
        worldUnlocksEnabled: true,
        streaksEnabled: true
      },
      messages: [],

      // Calendar Events collection
      calendarEvents: [
        {
          id: 'event-1',
          classId: 'class-3a',
          title: 'Unit 1: Fire Station Rescue',
          topic: 'Emergency calls, speaking drills, action verbs',
          dayOfWeek: 'Monday',
          time: '10:00 – 10:45',
          date: '2026-09-08',
          room: 'Room 204',
          type: 'Lesson'
        },
        {
          id: 'event-2',
          classId: 'class-3a',
          title: 'Unit 2: My Town Map Navigation',
          topic: 'Prepositions of place, giving directions',
          dayOfWeek: 'Wednesday',
          time: '10:00 – 10:45',
          date: '2026-09-10',
          room: 'Room 204',
          type: 'Lesson'
        },
        {
          id: 'event-3',
          classId: 'class-3a',
          title: 'Unit 1 & 2 Checkpoint Quiz',
          topic: 'Oral speaking review & vocabulary check',
          dayOfWeek: 'Friday',
          time: '10:00 – 10:45',
          date: '2026-09-12',
          room: 'Room 204',
          type: 'Quiz'
        },
        {
          id: 'event-4',
          classId: 'class-4b',
          title: 'Unit 3: Animal Habitats & Discovery',
          topic: 'Comparative adjectives, reading comprehension',
          dayOfWeek: 'Tuesday',
          time: '13:30 – 14:15',
          date: '2026-09-09',
          room: 'Room 302',
          type: 'Lesson'
        }
      ],

      // 28. Editable XP Skills (Positive +1 to +3 and Needs Work -1)
      xpSkills: [
        { id: 'skill-help', name: 'Helping Others', icon: '❤️', points: 1, category: 'positive', description: 'Assisting classmates with kindness and care', status: 'active' },
        { id: 'skill-task', name: 'On Task', icon: '👍', points: 1, category: 'positive', description: 'Staying focused and engaged on lesson activities', status: 'active' },
        { id: 'skill-part', name: 'Participating', icon: '💡', points: 1, category: 'positive', description: 'Raising hand and actively contributing to discussions', status: 'active' },
        { id: 'skill-persist', name: 'Persistence', icon: '🧪', points: 1, category: 'positive', description: 'Working through challenging problems and exercises', status: 'active' },
        { id: 'skill-team', name: 'Teamwork', icon: '🤝', points: 1, category: 'positive', description: 'Collaborating respectfully with peers', status: 'active' },
        { id: 'skill-hard', name: 'Working Hard', icon: '🌟', points: 1, category: 'positive', description: 'Demonstrating exceptional effort throughout the lesson', status: 'active' },
        { id: 'skill-speak', name: 'Speaking English', icon: '🗣️', points: 1, category: 'positive', description: 'Making an active effort to speak in full English sentences', status: 'active' },
        { id: 'skill-creative', name: 'Creative Thinking', icon: '🎨', points: 1, category: 'positive', description: 'Sharing imaginative ideas and original stories', status: 'active' },
        { id: 'skill-talk', name: 'Talking Out of Turn', icon: '⚠️', points: -1, category: 'needs_work', description: 'Speaking while others or teacher are presenting', status: 'active' },
        { id: 'skill-offtask', name: 'Off Task', icon: '💭', points: -1, category: 'needs_work', description: 'Needed reminding to refocus on current task', status: 'active' },
        { id: 'skill-unprepared', name: 'Unprepared', icon: '🎒', points: -1, category: 'needs_work', description: 'Missing required books, worksheets, or materials', status: 'active' }
      ],

      // 29. Classroom Rewards Catalog & Student Redemption
      rewards: [
        { id: 'rew-1', title: 'Choose Class Warm-Up Game', cost: 50, icon: '🎮', description: "Pick the opening ESL warm-up game for tomorrow's lesson", category: 'Activity', active: true },
        { id: 'rew-2', title: "Teacher's Special Assistant", cost: 60, icon: '⭐', description: 'Help pass out flashcards, manage props, and co-run the smartboard', category: 'Privilege', active: true },
        { id: 'rew-3', title: 'Class Story DJ', cost: 75, icon: '🎵', description: 'Choose the background music or phonics rhyme during workshop time', category: 'Privilege', active: true },
        { id: 'rew-4', title: 'Drawing & Doodle Break', cost: 100, icon: '🎨', description: '10 minutes of creative comic or doodle time at the end of class', category: 'Creativity', active: true },
        { id: 'rew-5', title: 'Treasure Chest Mystery Pick', cost: 150, icon: '🎁', description: 'Pick a real sticker pack, pencil topper, or mystery badge from the chest', category: 'Physical', active: true },
        { id: 'rew-6', title: 'Homework Pass', cost: 200, icon: '🎫', description: 'Skip one regular vocabulary practice worksheet', category: 'Academic', active: true }
      ],

      // 30. Big Ideas Classroom Brainstorm Board
      bigIdeas: [
        { id: 'idea-1', classId: 'class-3a', title: 'EAA Science Fair: Alien Planet Descriptions', description: 'Each student invents an exoplanet, draws its landscape, and gives a 2-minute English presentation describing alien flora, fauna, and weather.', category: 'Project', author: 'Mr. Maysam', votes: 14, pinned: true, tags: ['Science', 'Speaking', 'Art'], date: 'Sep 4, 2026' },
        { id: 'idea-2', classId: 'class-3a', title: 'English Puppet Theater Show', description: 'Using paper bag puppets to perform the "Who Stole the Treasure?" mystery for the 2nd grade classes.', category: 'Drama', author: 'Mr. Maysam', votes: 19, pinned: true, tags: ['Roleplay', 'Creativity', 'Teamwork'], date: 'Sep 6, 2026' },
        { id: 'idea-3', classId: 'class-3a', title: 'Treasure Island Illustrated Map', description: 'Students collaborate on a huge butcher paper map with compass directions, obstacles, and prepositions.', category: 'Writing', author: 'Mr. Maysam', votes: 11, pinned: false, tags: ['Writing', 'Geography'], date: 'Sep 8, 2026' },
        { id: 'idea-4', classId: 'class-4b', title: 'Global Pen Pals Exchange', description: 'Writing letters and postcards describing hometown weather, favorite foods, and school life.', category: 'Culture', author: 'Mr. Maysam', votes: 16, pinned: true, tags: ['Culture', 'Writing'], date: 'Sep 7, 2026' }
      ],

      // 31. Original Adventure Avatar Customizer Catalog (6 Categories)
      avatarCatalog: [
        {
          category: 'Fantasy & Dragons',
          icon: '🐉',
          characters: [
            { id: 'dragon_emerald', name: 'Emerald Drake', emoji: '🐲', description: 'Wise and ancient forest dragon who loves story quests' },
            { id: 'dragon_fire', name: 'Flame Dragon', emoji: '🐉', description: 'Energetic dragon with a fiery passion for challenges' },
            { id: 'phoenix', name: 'Golden Phoenix', emoji: '🦅', description: 'Rises above difficulties with perseverance and grace' },
            { id: 'unicorn', name: 'Starlight Unicorn', emoji: '🦄', description: 'Magical creature of kindness, friendship, and wonder' },
            { id: 'wizard', name: 'Enchanted Wizard', emoji: '🧙', description: 'Master of spelling spells and vocabulary incantations' },
            { id: 'knight', name: 'Brave Knight', emoji: '🛡️', description: 'Defender of teamwork, truth, and heroic adventures' }
          ]
        },
        {
          category: 'Space & Explorers',
          icon: '🧑‍🚀',
          characters: [
            { id: 'astronaut', name: 'Cosmic Explorer', emoji: '🧑‍🚀', description: 'Floating through galaxies in search of new words' },
            { id: 'space_cadet', name: 'Orbit Cadet', emoji: '👩‍🚀', description: 'Curious stargazing navigator charting alien worlds' },
            { id: 'alien_scout', name: 'Star Scout', emoji: '👽', description: 'Friendly extraterrestrial eager to learn Earth languages' },
            { id: 'cosmic_rover', name: 'Planetary Rover', emoji: '🛸', description: 'Explores cratered moons and beams back discoveries' },
            { id: 'star_voyager', name: 'Nebula Voyager', emoji: '⭐', description: 'Shining bright and lighting the way for classmates' },
            { id: 'rocket_pilot', name: 'Rocket Ace', emoji: '🚀', description: 'Blasts off to higher CEFR levels at lightning speed' }
          ]
        },
        {
          category: 'Robots & Tech',
          icon: '🤖',
          characters: [
            { id: 'cyber_bot', name: 'Cyber Bot 3000', emoji: '🤖', description: 'High-speed grammar processor with a heart of gold' },
            { id: 'mecha_owl', name: 'Mecha Owl', emoji: '🦉', description: 'Digital night-watcher analyzing sentence patterns' },
            { id: 'pixel_cat', name: 'Pixel Kitten', emoji: '🐱', description: '8-bit companion leaping over learning obstacles' },
            { id: 'steam_gadget', name: 'Clockwork Gear', emoji: '⚙️', description: 'Intricate contraption turning curiosity into wisdom' },
            { id: 'circuit_spark', name: 'Spark Dynamo', emoji: '⚡', description: 'Crackles with electrifying ideas and quick answers' }
          ]
        },
        {
          category: 'Animals & Nature',
          icon: '🦊',
          characters: [
            { id: 'clever_fox', name: 'Clever Fox', emoji: '🦊', description: 'Sharp-minded explorer who solves every riddle' },
            { id: 'panda_zen', name: 'Zen Panda', emoji: '🐼', description: 'Calm, patient, and deeply thoughtful learner' },
            { id: 'tiger_brave', name: 'Brave Tiger', emoji: '🐯', description: 'Fierce and confident when speaking up in class' },
            { id: 'wise_owl', name: 'Professor Owl', emoji: '🦉', description: 'Keeper of storybooks, definitions, and phonics rules' },
            { id: 'koala_climber', name: 'Eucalyptus Koala', emoji: '🐨', description: 'Gentle friend who is always encouraging to peers' },
            { id: 'safari_lion', name: 'Safari King', emoji: '🦁', description: 'Roars with enthusiasm during songs and dialogues' }
          ]
        },
        {
          category: 'Friendly Monsters',
          icon: '👾',
          characters: [
            { id: 'zorgon_puff', name: 'Zorgon Puff', emoji: '👾', description: 'Bouncy purple monster who loves high-fives and games' },
            { id: 'chomper_green', name: 'Chomper', emoji: '🦖', description: 'Hungry for new vocabulary cards and adventure tales' },
            { id: 'fluffy_yeti', name: 'Fluffy Yeti', emoji: '🐻', description: 'Warm-hearted gentle giant from the snowy peaks' },
            { id: 'blobby_sun', name: 'Sunny Blob', emoji: '🌞', description: 'Radiates joy, optimism, and smiles across the room' },
            { id: 'sparkle_beast', name: 'Glimmer Beast', emoji: '✨', description: 'Leaves a trail of sparkling compliments wherever it goes' }
          ]
        },
        {
          category: 'Ocean & Deep Sea',
          icon: '🐙',
          characters: [
            { id: 'ocean_squid', name: 'Inky Squid', emoji: '🦑', description: 'Writes artistic tales with eight energetic tentacles' },
            { id: 'dolphin_blue', name: 'Splash Dolphin', emoji: '🐬', description: 'Leaps joyfully into every listening and speaking challenge' },
            { id: 'coral_turtle', name: 'Coral Turtle', emoji: '🐢', description: 'Steady, persistent explorer who never gives up' },
            { id: 'starfish_gleam', name: 'Tidepool Star', emoji: '⭐', description: 'Glows under water and celebrates everyone’s victories' },
            { id: 'deep_whale', name: 'Oceanic Whale', emoji: '🐳', description: 'Singing melodious phonics ballads across the deep blue' }
          ]
        }
      ],

      // 27. Student Awards (Independently tracked from badge definitions)
      progressionLevels: JSON.parse(JSON.stringify(DEFAULT_PROGRESSION_LEVELS)),
      progressChecks: JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECKS)),
      progressCheckSubmissions: JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECK_SUBMISSIONS)),
      monsterItems: JSON.parse(JSON.stringify(DEFAULT_MONSTER_ITEMS)),
      monsterProfiles: JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES)),
      studentAwards: []
    };
  }

  // =========================================================================
  // CORE STORE ENGINE CLASS
  // =========================================================================
  class MasterSchoolStore {
    constructor() {
      this.state = this.loadState();
      this.listeners = [];
    }

    loadState() {
      try {
        if (typeof localStorage !== 'undefined') {
          // Purge all legacy storage keys across previous versions
          const LEGACY_KEYS = [
            'eaa_master_school_v1',
            'eaa_master_school_v2',
            'eaa_master_school_v3',
            'eaa_master_school_v4',
            'eaa_master_school_v5',
            'eaa_master_school_store',
            'english_adventure_academy_state',
            'eaa_student_data'
          ];
          LEGACY_KEYS.forEach(k => {
            try { localStorage.removeItem(k); } catch (e) {}
          });

          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            const initial = getInitialState();
            const merged = Object.assign({}, initial, parsed);
            if (!merged.groups) merged.groups = initial.groups || [];
            if (!merged.progressChecks || !Array.isArray(merged.progressChecks) || merged.progressChecks.length === 0) {
              merged.progressChecks = JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECKS));
            }
            if (!merged.progressCheckSubmissions || !Array.isArray(merged.progressCheckSubmissions) || merged.progressCheckSubmissions.length === 0) {
              merged.progressCheckSubmissions = JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECK_SUBMISSIONS));
            } else {
              DEFAULT_PROGRESS_CHECK_SUBMISSIONS.forEach(defSub => {
                if (!merged.progressCheckSubmissions.some(s => s.studentId === defSub.studentId && s.progressCheckId === defSub.progressCheckId)) {
                  merged.progressCheckSubmissions.push(JSON.parse(JSON.stringify(defSub)));
                }
              });
            }
            if (!merged.xpTransactions || !Array.isArray(merged.xpTransactions) || merged.xpTransactions.length === 0) {
              merged.xpTransactions = initial.xpTransactions || [];
            } else {
              (initial.xpTransactions || []).forEach(initTx => {
                if (!merged.xpTransactions.some(t => t.sourceId === initTx.sourceId)) {
                  merged.xpTransactions.push(JSON.parse(JSON.stringify(initTx)));
                }
              });
            }
            if (!merged.attendanceRecords || !Array.isArray(merged.attendanceRecords)) {
              merged.attendanceRecords = [];
            }
            if (!merged.learningEvidence || !Array.isArray(merged.learningEvidence)) {
              merged.learningEvidence = [];
            }
            if (!merged.teacherNotes || !Array.isArray(merged.teacherNotes)) {
              merged.teacherNotes = [];
            }
            if (!merged.studentAwards || !Array.isArray(merged.studentAwards)) {
              merged.studentAwards = [];
            }
            if (!merged.portfolios) merged.portfolios = initial.portfolios || [];
            if (!merged.worksheets) merged.worksheets = initial.worksheets || [];
            if (!merged.rubrics) merged.rubrics = initial.rubrics || [];
            if (!merged.badges) merged.badges = initial.badges || [];
            if (!merged.achievements) merged.achievements = initial.achievements || [];
            if (!merged.reports) merged.reports = initial.reports || [];
            if (!merged.schoolSettings) merged.schoolSettings = initial.schoolSettings || {};
            if (!merged.calendarEvents) merged.calendarEvents = initial.calendarEvents || [];
            if (!merged.xpSkills || !merged.xpSkills.length) {
              merged.xpSkills = JSON.parse(JSON.stringify(initial.xpSkills || []));
            } else {
              // Ensure reference skills are present and updated in state
              const existingMap = new Map(merged.xpSkills.map(s => [s.id, s]));
              (initial.xpSkills || []).forEach(refSkill => {
                if (!existingMap.has(refSkill.id)) {
                  merged.xpSkills.push(JSON.parse(JSON.stringify(refSkill)));
                } else {
                  // Update reference attributes like icon and default 1 pt
                  const existing = existingMap.get(refSkill.id);
                  if (refSkill.points !== undefined && (refSkill.id.startsWith('skill-help') || refSkill.id.startsWith('skill-task') || refSkill.id.startsWith('skill-part') || refSkill.id.startsWith('skill-persist') || refSkill.id.startsWith('skill-team') || refSkill.id.startsWith('skill-hard'))) {
                    existing.points = refSkill.points;
                    existing.icon = refSkill.icon;
                    existing.name = refSkill.name;
                  }
                }
              });
            }
            if (!merged.rewards || !merged.rewards.length) merged.rewards = initial.rewards || [];
            if (!merged.bigIdeas || !merged.bigIdeas.length) merged.bigIdeas = initial.bigIdeas || [];
            if (!merged.avatarCatalog || !merged.avatarCatalog.length) merged.avatarCatalog = initial.avatarCatalog || [];
            if (!merged.studentAwards) merged.studentAwards = initial.studentAwards || [];

            // Ensure Monster Evolution models are present
            if (!merged.progressionLevels || !Array.isArray(merged.progressionLevels) || merged.progressionLevels.length === 0) {
              merged.progressionLevels = JSON.parse(JSON.stringify(DEFAULT_PROGRESSION_LEVELS));
            }
            if (!merged.monsterItems || !Array.isArray(merged.monsterItems) || merged.monsterItems.length === 0) {
              merged.monsterItems = JSON.parse(JSON.stringify(DEFAULT_MONSTER_ITEMS));
            }
            if (!merged.monsterProfiles || typeof merged.monsterProfiles !== 'object') {
              merged.monsterProfiles = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES));
            } else {
              // Ensure default profiles merged or freshened for seed students
              for (const sId in DEFAULT_MONSTER_PROFILES) {
                if (!merged.monsterProfiles[sId] || !merged.monsterProfiles[sId].equipped) {
                  merged.monsterProfiles[sId] = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES[sId]));
                }
              }
            }
            // Ensure every existing student in database has a valid, synchronized MonsterProfile
            if (Array.isArray(merged.students)) {
              const colors = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
              merged.students.forEach((st, sIdx) => {
                if (!merged.monsterProfiles[st.id] || !merged.monsterProfiles[st.id].equipped) {
                  if (DEFAULT_MONSTER_PROFILES[st.id]) {
                    merged.monsterProfiles[st.id] = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES[st.id]));
                  } else {
                    const colorIdx = st.id ? Math.abs(st.id.charCodeAt(st.id.length - 1)) % colors.length : (sIdx % colors.length);
                    const assignedColor = colors[colorIdx] || 'blue';
                    merged.monsterProfiles[st.id] = {
                      studentId: st.id,
                      petName: (st.firstName ? st.firstName + "'s Monster" : "My Monster"),
                      baseColor: assignedColor,
                      isHatched: false,
                      equipped: {
                        body: 'body-' + assignedColor,
                        eyes: 'eyes-sparkle',
                        mouth: 'mouth-smile',
                        horns: 'horns-ears',
                        wings: 'none',
                        tail: 'tail-puff',
                        hat: 'none',
                        glasses: 'none',
                        backpack: 'none',
                        accessory: 'none',
                        aura: 'none',
                        background: 'bg-meadow'
                      },
                      unlockedItems: ['body-' + assignedColor, 'eyes-sparkle', 'mouth-smile', 'horns-ears', 'tail-puff', 'bg-meadow'],
                      evolutionHistory: [
                        {
                          id: 'ev-init-' + Date.now(),
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          type: 'egg',
                          title: 'Mystery Egg Registered',
                          detail: 'Student entered Academy with a dormant Mystery Egg.'
                        }
                      ]
                    };
                  }
                }

                // Calculate genuine XP and sync hatch status
                const totalXP = (merged.xpTransactions || [])
                  .filter(tx => tx.studentId === st.id && tx.status !== 'voided')
                  .reduce((sum, tx) => sum + (parseInt(tx.amount, 10) || 0), 0);
                if (totalXP >= 250) {
                  merged.monsterProfiles[st.id].isHatched = true;
                }

                // Canonical link: student.monsterProfile is the single source of truth
                st.monsterProfile = merged.monsterProfiles[st.id];

                // Deprecate old legacy avatar field
                delete st.avatar;
              });
            }
            if (merged.schoolSettings) {
              merged.schoolSettings.teacherName = 'Mr. Maysam';
              if (merged.schoolSettings.monsterEvolutionEnabled === undefined) merged.schoolSettings.monsterEvolutionEnabled = true;
              if (merged.schoolSettings.xpProgressionEnabled === undefined) merged.schoolSettings.xpProgressionEnabled = true;
              if (merged.schoolSettings.achievementRewardsEnabled === undefined) merged.schoolSettings.achievementRewardsEnabled = true;
              if (merged.schoolSettings.worldUnlocksEnabled === undefined) merged.schoolSettings.worldUnlocksEnabled = true;
              if (merged.schoolSettings.streaksEnabled === undefined) merged.schoolSettings.streaksEnabled = true;
            }
            if (Array.isArray(merged.classes)) {
              merged.classes.forEach(c => {
                c.teacher = 'Mr. Maysam';
              });
            }

            // Ensure Global Readings 2 curriculum book, units, lessons, objectives, and resource are present
            if (merged.curriculum && Array.isArray(merged.curriculum.books)) {
              const gr2Book = merged.curriculum.books.find(b => b.id === 'book-global-readings-2');
              if (!gr2Book) {
                merged.curriculum.books.unshift(GLOBAL_READINGS_2_DATA.book);
              } else {
                Object.assign(gr2Book, GLOBAL_READINGS_2_DATA.book, {
                  title: gr2Book.title || GLOBAL_READINGS_2_DATA.book.title,
                  archived: gr2Book.archived || false
                });
              }
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.units)) {
              GLOBAL_READINGS_2_DATA.units.forEach(u => {
                const existingU = merged.curriculum.units.find(item => item.id === u.id);
                if (!existingU) {
                  merged.curriculum.units.push(u);
                } else {
                  Object.assign(existingU, {
                    reading1: u.reading1,
                    reading2: u.reading2,
                    readingSkill: u.readingSkill,
                    contentArea: u.contentArea,
                    selFocus: u.selFocus,
                    keyConcept: u.keyConcept,
                    pages: u.pages,
                    targetVocab: (existingU.targetVocab && existingU.targetVocab.length) ? existingU.targetVocab : u.targetVocab
                  });
                }
              });
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.lessons)) {
              GLOBAL_READINGS_2_DATA.lessons.forEach(l => {
                const existingL = merged.curriculum.lessons.find(item => item.id === l.id);
                if (!existingL) {
                  merged.curriculum.lessons.push(l);
                } else {
                  Object.assign(existingL, {
                    sourcePages: l.sourcePages,
                    sourceBook: l.sourceBook,
                    tasks: l.tasks || existingL.tasks,
                    activities: l.activities || existingL.activities
                  });
                }
              });
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.objectives)) {
              GLOBAL_READINGS_2_DATA.objectives.forEach(o => {
                if (!merged.curriculum.objectives.some(item => item.id === o.id)) {
                  merged.curriculum.objectives.push(o);
                }
              });
            }
            if (Array.isArray(merged.resources)) {
              const campRes = CANONICAL_GAMES.find(g => g.id === 'camp-mystery');
              if (campRes && !merged.resources.some(r => r.id === 'camp-mystery')) {
                merged.resources.unshift(campRes);
              }
              const phonicsRes = CANONICAL_GAMES.find(g => g.id === 'phonics-adventure');
              if (phonicsRes) {
                const pIdx = merged.resources.findIndex(r => r.id === 'phonics-adventure' || r.id === 'phonics-hunters' || r.route === 'phonics/index.html');
                if (pIdx !== -1) {
                  merged.resources[pIdx] = phonicsRes;
                } else {
                  merged.resources.unshift(phonicsRes);
                }
              }
              if (!merged.resources.some(r => r.id === 'res-global-readings-2')) {
                merged.resources.push(GLOBAL_READINGS_2_DATA.resource);
              }
            }

            // Ensure Global Readings 3 curriculum book, units, lessons, objectives, and resource are present in existing saved state
            if (merged.curriculum && Array.isArray(merged.curriculum.books)) {
              const gr3Book = merged.curriculum.books.find(b => b.id === 'book-global-readings-3');
              if (!gr3Book) {
                const gr2Idx = merged.curriculum.books.findIndex(b => b.id === 'book-global-readings-2');
                if (gr2Idx !== -1) {
                  merged.curriculum.books.splice(gr2Idx + 1, 0, GLOBAL_READINGS_3_DATA.book);
                } else {
                  merged.curriculum.books.push(GLOBAL_READINGS_3_DATA.book);
                }
              } else {
                Object.assign(gr3Book, GLOBAL_READINGS_3_DATA.book, {
                  title: gr3Book.title || GLOBAL_READINGS_3_DATA.book.title,
                  grade: 'Grade 4',
                  gradeLevel: 'Grade 4',
                  weeksPerUnit: 4,
                  archived: gr3Book.archived || false
                });
              }
              const gr2Book = merged.curriculum.books.find(b => b.id === 'book-global-readings-2');
              if (gr2Book) {
                gr2Book.grade = 'Grade 3';
                gr2Book.gradeLevel = 'Grade 3';
                gr2Book.weeksPerUnit = 4;
              }
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.units)) {
              GLOBAL_READINGS_3_DATA.units.forEach(u => {
                const existingU = merged.curriculum.units.find(item => item.id === u.id);
                if (!existingU) {
                  merged.curriculum.units.push(u);
                } else {
                  Object.assign(existingU, {
                    reading1: u.reading1,
                    reading2: u.reading2,
                    readingSkill: u.readingSkill,
                    contentArea: u.contentArea,
                    selFocus: u.selFocus,
                    keyConcept: u.keyConcept,
                    pages: u.pages,
                    weeks: u.weeks || existingU.weeks,
                    targetVocab: (existingU.targetVocab && existingU.targetVocab.length) ? existingU.targetVocab : u.targetVocab
                  });
                }
              });
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.lessons)) {
              GLOBAL_READINGS_3_DATA.lessons.forEach(l => {
                const existingL = merged.curriculum.lessons.find(item => item.id === l.id);
                if (!existingL) {
                  merged.curriculum.lessons.push(l);
                } else {
                  Object.assign(existingL, {
                    weekNumber: l.weekNumber || existingL.weekNumber,
                    sourcePages: l.sourcePages,
                    sourceBook: l.sourceBook,
                    tasks: l.tasks || existingL.tasks,
                    activities: l.activities || existingL.activities
                  });
                }
              });
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.objectives)) {
              GLOBAL_READINGS_3_DATA.objectives.forEach(o => {
                if (!merged.curriculum.objectives.some(item => item.id === o.id)) {
                  merged.curriculum.objectives.push(o);
                }
              });
            }
            if (Array.isArray(merged.resources)) {
              if (!merged.resources.some(r => r.id === 'res-global-readings-3')) {
                merged.resources.push(GLOBAL_READINGS_3_DATA.resource);
              }
            }


            // Ensure curriculum books have both level and targetLevel defined
            if (merged.curriculum && Array.isArray(merged.curriculum.books)) {
              merged.curriculum.books.forEach(b => {
                if (!b.targetLevel && b.level) b.targetLevel = b.level;
                if (!b.level && b.targetLevel) b.level = b.targetLevel;
              });
            }

            // Ensure unit-5 has its interactive lesson and objectives
            if (merged.curriculum && Array.isArray(merged.curriculum.lessons)) {
              if (!merged.curriculum.lessons.some(l => l.unitId === 'unit-5')) {
                merged.curriculum.lessons.push({
                  id: 'lesson-5',
                  unitId: 'unit-5',
                  title: 'Giving Great Advice (Should & Shouldn\'t)',
                  order: 1,
                  objective: 'Students formulate recommendations with should and warnings with shouldn\'t.',
                  gameRoute: 'advice/index.html',
                  duration: 35,
                  archived: false
                });
              }
            }
            if (merged.curriculum && Array.isArray(merged.curriculum.objectives)) {
              if (!merged.curriculum.objectives.some(o => o.id === 'obj-5')) {
                merged.curriculum.objectives.push(
                  { id: 'obj-5', lessonId: 'lesson-5', text: 'Form sentences using "You should..." and "You shouldn\'t..."', skill: 'Grammar', cefr: 'A2', archived: false },
                  { id: 'obj-6', lessonId: 'lesson-5', text: 'Give constructive advice for 4 daily dilemmas', skill: 'Speaking', cefr: 'A2', archived: false }
                );
              }
            }

            // Normalize existing transactions: ensure status, category, icon, and timestamp
            if (Array.isArray(merged.xpTransactions)) {
              merged.xpTransactions.forEach(tx => {
                if (!tx.status) tx.status = 'active';
                if (!tx.category) tx.category = (tx.amount < 0 ? 'needs_work' : 'positive');
                if (!tx.icon) tx.icon = (tx.amount > 0 ? '⭐' : '💭');
                if (!tx.timestamp) tx.timestamp = new Date(tx.date || Date.now()).toISOString();
              });
            }
            return merged;
          }
        }
      } catch (e) {
        console.warn('MasterSchoolStore: Failed to read from localStorage', e);
      }
      return getInitialState();
    }

    saveState() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (e) {
        console.warn('MasterSchoolStore: Failed to save state to localStorage', e);
      }
      this.notify();
    }

    getStorageKey() {
      return STORAGE_KEY;
    }

    resetToDefaults() {
      this.state = getInitialState();
      this.saveState();
      this.notify();
    }

    resetAllStudentProgress() {
      // 1. Reset all student personal progress attributes
      if (Array.isArray(this.state.students)) {
        this.state.students.forEach(s => {
          s.xp = 0;
          s.level = 1;
          s.streakDays = 0;
          s.lastActive = null;
          s.equippedMonster = 'Mystery Egg';
          s.manualCefrOverrides = {};
        });
      }
      // 2. Reset all monster profiles to Level 1 Mystery Egg with empty unlockedItems
      this.state.monsterProfiles = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES));
      // 3. Purge all transactional and record stores
      this.state.xpTransactions = [];
      this.state.attendanceRecords = [];
      this.state.learningEvidence = [];
      this.state.assessments = [];
      this.state.progressCheckSubmissions = [];
      this.state.studentAwards = [];
      this.state.teacherNotes = [];
      this.state.reports = [];
      this.state.messages = [];
      this.state.portfolios = [];

      this.saveState();
      this.notify();
      return { success: true, message: 'All student progress reset cleanly to 0.' };
    }

    subscribe(fn) {
      this.listeners.push(fn);
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify() {
      this.listeners.forEach(fn => {
        try { fn(this.state); } catch (err) { console.error('Listener error:', err); }
      });
    }

    // Role & Active context
    getRole() { return this.state.currentRole; }
    setRole(role) {
      this.state.currentRole = role;
      this.saveState();
    }

    getActiveClass() {
      const c = this.state.classes.find(cls => cls.id === this.state.activeClassId && !cls.archived);
      return c || this.state.classes.find(cls => !cls.archived) || this.state.classes[0];
    }
    setActiveClass(id) {
      this.state.activeClassId = id;
      this.saveState();
    }

    getActiveStudent() {
      const s = this.state.students.find(st => st.id === this.state.activeStudentId && !st.archived);
      return s || this.state.students.find(st => !st.archived) || this.state.students[0];
    }
    setActiveStudent(id) {
      this.state.activeStudentId = id;
      this.saveState();
    }

    // =========================================================================
    // 2. STUDENTS & ENROLLMENT (18 METHODS)
    // =========================================================================
    getStudents(classId = null, includeArchived = false) {
      let list = this.state.students || [];
      if (!includeArchived) list = list.filter(s => !s.archived);
      if (classId) list = list.filter(s => s.classId === classId);
      list.forEach(s => {
        if (!s.monsterProfile) s.monsterProfile = this.getMonsterProfile(s.id);
      });
      return list;
    }

    getStudentsByClass(classId, includeArchived = false) {
      return this.getStudents(classId, includeArchived);
    }

    getStudent(id) {
      if (!this.state.students || !id) return null;
      const strId = String(id).trim();
      const s = this.state.students.find(s => s.id === strId || (s.studentIdNumber && String(s.studentIdNumber).trim() === strId));
      if (s && !s.monsterProfile) {
        s.monsterProfile = this.getMonsterProfile(s.id);
      }
      return s;
    }

    addStudent(data) {
      const studentId = data.id || ('student-' + Date.now());
      const studentIdNumber = data.studentIdNumber || ('EAA-' + new Date().getFullYear() + '-' + String(this.state.students.length + 1).padStart(3, '0'));
      const newStudent = {
        id: studentId,
        studentIdNumber,
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'Learner',
        classId: data.classId || this.state.activeClassId,
        age: parseInt(data.age, 10) || 8,
        grade: data.grade || 'Grade 3',
        overallCefr: data.overallCefr || 'A1',
        avatar: data.avatar || { hair: 'girl', outfit: 'explorer', accessory: 'none' },
        parentName: data.parentName || '',
        parentContact: data.parentContact || '',
        parentEmail: data.parentEmail || '',
        xp: parseInt(data.xp, 10) || 0,
        level: parseInt(data.level, 10) || 1,
        streakDays: parseInt(data.streakDays, 10) || 0,
        equippedMonster: data.equippedMonster || 'Mystery Egg',
        archived: Boolean(data.archived),
        manualCefrOverrides: data.manualCefrOverrides || {}
      };

      // Initialize student Mystery Egg profile (starts at 0 XP)
      newStudent.monsterProfile = this.getMonsterProfile(studentId);

      this.state.students.unshift(newStudent);
      this.saveState();

      // Cloud Persistence: Authoritative Supabase INSERT
      if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
        window.AdventureSupabase.saveStudent(newStudent).catch(err => {
          console.error('[SchoolStore] Supabase saveStudent error:', err);
        });
      } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.saveStudent(newStudent).catch(() => {});
      }

      return newStudent;
    }

    updateStudent(id, updates) {
      const s = this.getStudent(id);
      if (s) {
        Object.assign(s, updates);
        this.saveState();

        // Cloud Persistence: Authoritative Supabase UPDATE
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.saveStudent(s).catch(err => {
            console.error('[SchoolStore] Supabase updateStudent error:', err);
          });
        } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.saveStudent(s).catch(() => {});
        }

        return s;
      }
      return null;
    }

    archiveStudent(id) {
      const s = this.getStudent(id);
      if (s) {
        s.archived = true;
        this.saveState();

        // Cloud Persistence: Authoritative Supabase UPDATE
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.saveStudent(s).catch(err => {
            console.error('[SchoolStore] Supabase archiveStudent error:', err);
          });
        } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.saveStudent(s).catch(() => {});
        }

        return true;
      }
      return false;
    }

    removeStudentFromClass(id) {
      const s = this.getStudent(id);
      if (s) {
        s.classId = null;
        this.saveState();

        // Cloud Persistence: Authoritative Supabase UPDATE
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.saveStudent(s).catch(err => {
            console.error('[SchoolStore] Supabase removeStudentFromClass error:', err);
          });
        } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.saveStudent(s).catch(() => {});
        }

        return true;
      }
      return false;
    }

    deleteStudent(id) {
      const idx = this.state.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        this.state.students.splice(idx, 1);
        this.saveState();

        // Cloud Persistence: Authoritative Supabase DELETE
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.deleteStudent(id).catch(err => {
            console.error('[SchoolStore] Supabase deleteStudent error:', err);
          });
        } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.deleteStudent(id).catch(() => {});
        }

        return true;
      }
      return false;
    }

    // =========================================================================
    // TRANSACTION-BASED XP ARCHITECTURE & AUDIT LEDGER
    // =========================================================================
    getStudentTotalXP(studentId) {
      if (!this.state.xpTransactions || !studentId) return 0;
      const s = this.getStudent(studentId);
      const resolvedId = s ? s.id : studentId;
      // Strictly recalculate from active transactions only
      const txs = this.state.xpTransactions.filter(t => (t.studentId === resolvedId || (s && t.studentId === s.studentIdNumber)) && t.status !== 'voided');
      return txs.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);
    }

    getXPTransactions(studentId, includeVoided = false) {
      if (!this.state.xpTransactions) return [];
      const s = this.getStudent(studentId);
      const resolvedId = s ? s.id : studentId;
      return this.state.xpTransactions
        .filter(t => (t.studentId === resolvedId || (s && t.studentId === s.studentIdNumber)) && (includeVoided || t.status !== 'voided'))
        .slice()
        .reverse();
    }

    getStudentXPTransactions(studentId, includeVoided = false) {
      return this.getXPTransactions(studentId, includeVoided);
    }

    getAllXPTransactions(studentId) {
      if (!this.state.xpTransactions) return [];
      return this.state.xpTransactions
        .filter(t => t.studentId === studentId)
        .slice()
        .reverse();
    }

    giveXP(studentId, amount, reason = 'Great effort', source = 'Teacher', options = {}) {
      const s = this.getStudent(studentId);
      if (!s) return null;

      const numAmount = parseInt(amount, 10) || 0;
      // Single source of truth: amount passed is the exact XP points awarded
      const points = numAmount;
      const xpVal = numAmount;
      const category = options.category || (points < 0 ? 'needs_work' : 'positive');
      const tx = {
        id: 'xp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId,
        skillId: options.skillId || null,
        amount: points,
        points: points,
        xpAmount: points,
        xp: xpVal,
        reason: reason || (points >= 0 ? 'Positive Classroom Contribution' : 'Needs Focus'),
        category,
        icon: options.icon || (points > 0 ? '⭐' : '💭'),
        date: options.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString(),
        teacherId: options.teacherId || options.createdBy || 'Teacher',
        createdBy: options.createdBy || options.teacherId || source || 'Teacher',
        source: options.source || source || 'teacher_feedback',
        classId: options.classId || (s ? (s.classId || s.class) : null),
        sourceId: options.sourceId || null,
        status: 'active'
      };

      if (!this.state.xpTransactions) this.state.xpTransactions = [];
      const prevMonsterState = this.calculateMonsterState(studentId);
      const prevLevel = prevMonsterState ? prevMonsterState.currentLevel : 1;
      const prevStageName = prevMonsterState ? prevMonsterState.stageName : 'Mystery Egg';
      const prevStageKey = prevMonsterState ? prevMonsterState.stageKey : 'egg';
      const prevLevelObj = prevMonsterState ? prevMonsterState.currentLevelObj : null;
      const profile = this.getMonsterProfile(studentId);
      const lastCelebrated = profile.lastCelebratedLevel || prevLevel;

      this.state.xpTransactions.push(tx);
      const newTotalXP = this.getStudentTotalXP(studentId);
      if (s) {
        s.xp = newTotalXP;
        s.totalXP = newTotalXP;
      }
      const newMonsterState = this.calculateMonsterState(studentId);
      const newLevel = newMonsterState ? newMonsterState.currentLevel : prevLevel;
      if (s) {
        s.level = newLevel;
      }

      let evolutionEvent = null;
      if (newMonsterState && newLevel > prevLevel && newLevel > lastCelebrated) {
        const isHatch = (newLevel >= 3 && prevLevel < 3);

        profile.highestUnlockedLevel = Math.max(profile.highestUnlockedLevel || 1, newLevel);
        if (isHatch || newLevel >= 3) {
          profile.isHatched = true;
          if (!profile.hatchDate) profile.hatchDate = new Date().toISOString();
        }

        this.logMonsterHistory(studentId, {
          type: isHatch ? 'hatch' : 'evolve',
          title: isHatch ? '✨ Egg Hatched into Baby Monster!' : ('🎉 Evolved to Level ' + newLevel + ': ' + newMonsterState.stageName),
          detail: 'Earned ' + (numAmount >= 0 ? '+' : '') + numAmount + ' XP (' + (reason || 'Activity') + '). New total: ' + newMonsterState.totalXP.toLocaleString() + ' XP.'
        });

        const allItems = this.getMonsterItems(null, true);
        const itemsAvailableAtOldLevel = new Set(
          allItems
            .filter(it => it.unlockType === 'level' && it.unlockRequirement && ((it.unlockRequirement.level || 1) <= prevLevel))
            .map(it => it.id)
        );
        const newlyUnlockedItems = allItems.filter(it => 
          it.unlockType === 'level' &&
          it.unlockRequirement &&
          ((it.unlockRequirement.level || 1) <= newLevel) &&
          !itemsAvailableAtOldLevel.has(it.id)
        );

        evolutionEvent = {
          studentId,
          prevLevel,
          newLevel,
          fromLevel: prevLevel,
          toLevel: newLevel,
          isHatch,
          previousStage: {
            level: prevLevel,
            name: prevStageName,
            stageKey: prevStageKey,
            description: prevLevelObj ? (prevLevelObj.description || '') : ''
          },
          newStage: {
            level: newLevel,
            name: newMonsterState.stageName,
            stageKey: newMonsterState.stageKey,
            description: newMonsterState.stageDescription || ''
          },
          newlyUnlockedItems,
          totalXP: newMonsterState.totalXP,
          nextLevelXP: newMonsterState.nextLevelObj ? newMonsterState.nextLevelObj.xpRequired : null
        };

        profile.lastCelebratedLevel = newLevel;
      }

      this.saveState();
      this.notify('xp', this.state.xpTransactions);

      if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
        window.AdventureSupabase.saveXPTransaction(tx).catch(() => {});
        window.AdventureSupabase.saveStudent(s).catch(() => {});
      } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.saveXPTransaction(tx).catch(e => {
          console.warn('[SchoolStore] XP cloud save warning:', e);
        });
      }
      return { 
        success: true,
        transaction: tx, 
        student: s, 
        newTotalXP: this.getStudentTotalXP(studentId), 
        reason: tx.reason, 
        amount: points, 
        points: points,
        xp: xpVal,
        evolutionEvent, 
        monsterState: newMonsterState 
      };
    }

    awardXP(studentId, amount, reason, teacher, options) {
      return this.giveXP(studentId, amount, reason, teacher, options);
    }

    giveBatchFeedback(studentIds = [], skillIds = [], options = {}) {
      if (!Array.isArray(studentIds) || studentIds.length === 0) return { success: false, count: 0, transactions: [], evolutionEvents: [] };
      if (!Array.isArray(skillIds) || skillIds.length === 0) return { success: false, count: 0, transactions: [], evolutionEvents: [] };

      const allSkills = this.getXPSkills(null, true);
      const skillsToAward = skillIds.map(skId => {
        if (typeof skId === 'object' && skId !== null) return skId;
        return allSkills.find(s => s.id === skId);
      }).filter(Boolean);

      if (skillsToAward.length === 0) return { success: false, count: 0, transactions: [], evolutionEvents: [] };

      const transactions = [];
      const evolutionEvents = [];
      const teacherName = options.teacherName || options.createdBy || 'Teacher';
      const teacherId = options.teacherId || teacherName;
      const customNote = options.note ? (' (' + options.note + ')') : '';

      studentIds.forEach(sId => {
        const student = this.getStudent(sId);
        if (!student) return;

        skillsToAward.forEach(skill => {
          const reason = (skill.name || 'Classroom Skill') + customNote;
          const res = this.giveXP(sId, skill.points, reason, 'teacher_feedback', {
            skillId: skill.id,
            icon: skill.icon,
            category: skill.category,
            teacherId: teacherId,
            createdBy: teacherName,
            classId: student.classId || options.classId || null,
            source: 'teacher_feedback'
          });

          if (res) {
            transactions.push(res.transaction);
            if (res.evolutionEvent) {
              evolutionEvents.push(res.evolutionEvent);
            }
          }
        });
      });

      return {
        success: true,
        count: transactions.length,
        studentCount: studentIds.length,
        skillCount: skillsToAward.length,
        totalXPAwardedPerStudent: skillsToAward.reduce((sum, sk) => sum + (parseInt(sk.points, 10) || 0), 0),
        transactions,
        evolutionEvents
      };
    }

    getStudentClassroomSkillsTally(studentId) {
      if (!this.state.xpTransactions) return [];
      const txs = this.state.xpTransactions.filter(t => t.studentId === studentId && t.status !== 'voided');
      const tallyMap = {};

      txs.forEach(t => {
        const key = t.skillId || t.reason;
        if (!tallyMap[key]) {
          tallyMap[key] = {
            skillId: t.skillId,
            name: t.reason,
            icon: t.icon || '⭐',
            category: t.category || 'positive',
            count: 0,
            totalXP: 0
          };
        }
        tallyMap[key].count++;
        tallyMap[key].totalXP += (parseInt(t.amount, 10) || 0);
      });

      return Object.values(tallyMap).sort((a, b) => b.count - a.count);
    }

    adjustStudentXP(studentId, options = {}) {
      const s = this.getStudent(studentId);
      if (!s) return null;
      const currentXP = this.getStudentTotalXP(studentId);
      let delta = 0;
      if (options.isAbsolute) {
        const target = parseInt(options.targetTotal, 10) || 0;
        delta = target - currentXP;
      } else {
        delta = parseInt(options.delta, 10) || 0;
      }

      if (delta === 0) {
        return {
          success: true,
          delta: 0,
          student: s,
          newTotalXP: currentXP,
          evolutionEvent: null
        };
      }

      const reason = options.reason || (delta > 0 ? 'Teacher point adjustment (+)' : 'Teacher point adjustment (-)');
      const teacher = options.teacher || 'Teacher';
      const category = options.category || 'correction';
      const icon = options.icon || (delta >= 0 ? '⭐' : '⚖️');

      const res = this.giveXP(studentId, delta, reason, teacher, {
        category,
        icon,
        source: teacher,
        createdBy: teacher,
        isPoints: true
      });

      return Object.assign({ success: true, delta }, res);
    }

    voidXPTransaction(txId, voidReason = 'Removed by teacher') {
      if (!this.state.xpTransactions) return false;
      const tx = this.state.xpTransactions.find(t => t.id === txId);
      if (!tx) return false;
      tx.status = 'voided';
      tx.voidReason = voidReason;
      tx.voidedAt = new Date().toISOString();
      this.saveState();
      this.notify('xp', this.state.xpTransactions);
      return true;
    }

    restoreXPTransaction(txId) {
      if (!this.state.xpTransactions) return false;
      const tx = this.state.xpTransactions.find(t => t.id === txId);
      if (!tx) return false;
      tx.status = 'active';
      delete tx.voidReason;
      delete tx.voidedAt;
      this.saveState();
      this.notify('xp', this.state.xpTransactions);
      return true;
    }

    updateXPTransaction(txId, updates) {
      if (!this.state.xpTransactions) return null;
      const tx = this.state.xpTransactions.find(t => t.id === txId);
      if (!tx) return null;
      if (updates.amount !== undefined) tx.amount = parseInt(updates.amount, 10) || 0;
      if (updates.reason !== undefined) tx.reason = updates.reason;
      if (updates.category !== undefined) tx.category = updates.category;
      if (updates.skillId !== undefined) tx.skillId = updates.skillId;
      if (updates.icon !== undefined) tx.icon = updates.icon;
      tx.updatedAt = new Date().toISOString();
      this.saveState();
      this.notify('xp', this.state.xpTransactions);
      return tx;
    }

    getXPReport(studentId) {
      const allTxs = (this.state.xpTransactions || []).filter(t => t.studentId === studentId);
      const activeTxs = allTxs.filter(t => t.status !== 'voided');
      const voidedTxs = allTxs.filter(t => t.status === 'voided');
      const totalXP = activeTxs.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);

      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      const weekTxs = activeTxs.filter(t => {
        const tTime = t.timestamp ? new Date(t.timestamp).getTime() : new Date(t.date).getTime();
        return !isNaN(tTime) && tTime >= sevenDaysAgo;
      });
      const monthTxs = activeTxs.filter(t => {
        const tTime = t.timestamp ? new Date(t.timestamp).getTime() : new Date(t.date).getTime();
        return !isNaN(tTime) && tTime >= thirtyDaysAgo;
      });

      const xpThisWeek = weekTxs.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);
      const xpThisMonth = monthTxs.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);

      const categoryBreakdown = {
        positive: activeTxs.filter(t => t.category === 'positive' || (!t.category && t.amount > 0)).reduce((sum, t) => sum + t.amount, 0),
        needs_work: activeTxs.filter(t => t.category === 'needs_work' || (!t.category && t.amount < 0)).reduce((sum, t) => sum + Math.abs(t.amount), 0),
        redeemed: activeTxs.filter(t => t.category === 'redeemed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
        activity: activeTxs.filter(t => t.source === 'Activity' || t.source === 'Game').reduce((sum, t) => sum + t.amount, 0),
        assessment: activeTxs.filter(t => t.source === 'assessment' || (t.sourceId && t.sourceId.startsWith('pc-assessment-'))).reduce((sum, t) => sum + t.amount, 0),
        attendance: activeTxs.filter(t => t.source === 'attendance' || (t.sourceId && t.sourceId.startsWith('attendance-'))).reduce((sum, t) => sum + t.amount, 0),
        badge: activeTxs.filter(t => t.source === 'badge' || (t.sourceId && t.sourceId.startsWith('badge-'))).reduce((sum, t) => sum + t.amount, 0)
      };

      const skillCounts = {};
      activeTxs.filter(t => t.amount > 0).forEach(t => {
        const key = t.reason || 'Classroom Contribution';
        skillCounts[key] = (skillCounts[key] || 0) + 1;
      });
      const topSkills = Object.entries(skillCounts)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalXP,
        xpThisWeek,
        xpThisMonth,
        activeCount: activeTxs.length,
        voidedCount: voidedTxs.length,
        categoryBreakdown,
        topSkills,
        transactions: activeTxs.slice().reverse(),
        auditHistory: allTxs.slice().reverse()
      };
    }

    // Dynamic Skill Mastery from Evidence
    getStudentSkills(studentId) {
      const s = this.getStudent(studentId);
      if (!s) return {};

      const coreSkills = ['speaking', 'listening', 'vocabulary', 'grammar', 'reading', 'writing', 'pronunciation'];
      const result = {};

      coreSkills.forEach(skillKey => {
        // Find evidence matching this skill
        const evidence = this.state.learningEvidence.filter(e => e.studentId === studentId && (e.skillId || '').toLowerCase() === skillKey);
        
        let calculatedScore = 0;
        let hasData = false;
        if (evidence.length > 0) {
          const totalPct = evidence.reduce((acc, ev) => acc + ((ev.score / (ev.maxScore || 100)) * 100), 0);
          calculatedScore = Math.round(totalPct / evidence.length);
          hasData = true;
        }

        // Check if teacher manually set assessment
        const lastAssessment = this.state.assessments.find(a => a.studentId === studentId && a.rubricScores && a.rubricScores[skillKey]);
        if (lastAssessment) {
          if (hasData) {
            calculatedScore = Math.round((calculatedScore * 0.4) + (lastAssessment.rubricScores[skillKey] * 0.6));
          } else {
            calculatedScore = Math.round(lastAssessment.rubricScores[skillKey]);
            hasData = true;
          }
        }

        // Manual teacher CEFR override
        const overrideCefr = s.manualCefrOverrides && s.manualCefrOverrides[skillKey];
        const cefr = overrideCefr || (hasData ? (calculatedScore >= 85 ? 'A2' : calculatedScore >= 75 ? 'A1+' : calculatedScore >= 60 ? 'A1' : 'Pre-A1') : 'Unassessed');

        result[skillKey] = {
          score: calculatedScore,
          cefr,
          evidenceCount: evidence.length
        };
      });

      return result;
    }

    setManualSkillCefr(studentId, skillKey, cefrLevel) {
      const s = this.getStudent(studentId);
      if (s) {
        if (!s.manualCefrOverrides) s.manualCefrOverrides = {};
        s.manualCefrOverrides[skillKey] = cefrLevel;
        this.saveState();
        return true;
      }
      return false;
    }

    // Teacher Notes CRUD (Shared Online Database Sync)
    getTeacherNotes(studentId) {
      if (!this.state.teacherNotes) return [];
      const s = this.getStudent(studentId);
      const targetId = s ? s.id : studentId;
      const targetNum = s ? s.studentIdNumber : null;
      return this.state.teacherNotes.filter(n => n.studentId === targetId || (targetNum && n.studentId === targetNum));
    }

    addTeacherNote(studentId, text, author = 'Mr. Maysam') {
      const s = this.getStudent(studentId);
      const canonicalStudentId = s ? s.id : studentId;
      const cleanText = (text || '').trim();
      const note = {
        id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        studentId: canonicalStudentId,
        text: cleanText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: author || 'Mr. Maysam',
        updatedAt: new Date().toISOString()
      };
      if (!this.state.teacherNotes) this.state.teacherNotes = [];
      this.state.teacherNotes.unshift(note);
      if (s) {
        s.latestTeacherNote = cleanText;
      }
      this.saveState();

      // Transmit immediately to shared online database
      if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.saveTeacherNote(note).catch(err => {
          console.warn('[SchoolStore] Teacher note cloud sync error:', err.message);
        });
      }
      return note;
    }

    updateTeacherNote(noteId, text) {
      if (!this.state.teacherNotes) return null;
      const n = this.state.teacherNotes.find(note => note.id === noteId);
      if (n) {
        const cleanText = (text || '').trim();
        n.text = cleanText;
        n.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (edited)';
        n.updatedAt = new Date().toISOString();
        const s = this.getStudent(n.studentId);
        if (s) {
          s.latestTeacherNote = cleanText;
        }
        this.saveState();

        // Transmit update immediately to shared online database
        if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.saveTeacherNote(n).catch(err => {
            console.warn('[SchoolStore] Teacher note cloud update error:', err.message);
          });
        }
        return n;
      }
      return null;
    }

    deleteTeacherNote(noteId) {
      if (!this.state.teacherNotes) return false;
      const idx = this.state.teacherNotes.findIndex(n => n.id === noteId);
      if (idx !== -1) {
        this.state.teacherNotes.splice(idx, 1);
        this.saveState();

        // Delete from shared online database
        if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.deleteTeacherNote(noteId).catch(err => {
            console.warn('[SchoolStore] Teacher note cloud delete error:', err.message);
          });
        }
        return true;
      }
      return false;
    }

    // =========================================================================
    // 2. CLASS CRUD & ATTENDANCE CALCULATIONS
    // =========================================================================
    getClasses(includeArchived = false) {
      return this.state.classes.filter(c => includeArchived || !c.archived);
    }

    getClass(id) {
      const c = this.state.classes.find(c => c.id === id);
      if (c) {
        if (c.primaryBookId === 'gr2-book') c.primaryBookId = 'book-global-readings-2';
        if (c.primaryBookId === 'gr3-book') c.primaryBookId = 'book-global-readings-3';
      }
      return c;
    }

    getBook(id) {
      if (!id) return null;
      if (id === 'gr2-book') id = 'book-global-readings-2';
      if (id === 'gr3-book') id = 'book-global-readings-3';
      return (this.state.curriculum && this.state.curriculum.books) ?
        this.state.curriculum.books.find(b => b.id === id) : null;
    }

    getUnit(id) {
      if (!id) return null;
      return (this.state.curriculum && this.state.curriculum.units) ?
        this.state.curriculum.units.find(u => u.id === id) : null;
    }

    addClass(data) {
      const newClass = {
        id: 'class-' + Date.now(),
        name: data.name || 'New Grade Class',
        grade: data.grade || 'Grade 3',
        academicYear: data.academicYear || '2026–2027',
        cefrTarget: data.cefrTarget || 'A1',
        room: data.room || 'Room 204',
        schedule: data.schedule || 'Mon, Wed · 10:00 – 10:45',
        description: data.description || 'Elementary English cohort.',
        archived: false
      };
      this.state.classes.push(newClass);
      this.saveState();
      if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
        window.AdventureSupabase.saveClass(newClass).catch(err => {
          console.error('[SchoolStore] Supabase saveClass error:', err);
        });
      }
      return newClass;
    }

    updateClass(id, updates) {
      const c = this.getClass(id);
      if (c) {
        Object.assign(c, updates);
        this.saveState();
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.saveClass(c).catch(err => {
            console.error('[SchoolStore] Supabase updateClass error:', err);
          });
        }
        return c;
      }
      return null;
    }

    duplicateClass(id) {
      const original = this.getClass(id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'class-' + Date.now();
        copy.name = original.name + ' (Section B)';
        copy.archived = false;
        this.state.classes.push(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    recordHomeworkSubmission(homeworkId, studentId, submissionData) {
      const hw = this.getHomeworkItem(homeworkId);
      if (!hw) return null;
      if (!hw.submissions) hw.submissions = {};

      const totalQuestions = hw.questionsTotal || 10;
      const attempted = Math.min(totalQuestions, Math.max(0, parseInt(submissionData.attempted, 10) || 0));
      const correct = Math.min(attempted, Math.max(0, parseInt(submissionData.correct, 10) || 0));
      const completion = Math.round((attempted / totalQuestions) * 100);
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const status = submissionData.status || (completion === 100 ? 'Complete' : completion > 0 ? 'Partially Complete' : 'Not Started');

      hw.submissions[studentId] = {
        status,
        attempted,
        correct,
        totalQuestions,
        completion,
        accuracy,
        completedDate: submissionData.completedDate || new Date().toISOString().split('T')[0],
        notes: submissionData.notes || ''
      };

      hw.submittedCount = Object.values(hw.submissions).filter(s => s.status === 'Complete' || s.status === 'Partially Complete').length;

      // Connect to learningEvidence: accuracy reflects mastery, completion reflects task completion
      if (attempted > 0) {
        if (!this.state.learningEvidence) this.state.learningEvidence = [];
        const existingEv = this.state.learningEvidence.find(e => e.studentId === studentId && e.sourceId === homeworkId);
        if (existingEv) {
          existingEv.score = accuracy;
          existingEv.completion = completion;
          existingEv.notes = 'Attempted: ' + attempted + '/' + totalQuestions + ', Correct: ' + correct + ', Accuracy: ' + accuracy + '%';
          existingEv.date = new Date().toISOString().split('T')[0];
        } else {
          this.state.learningEvidence.push({
            id: 'ev-hw-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            studentId,
            source: 'homework',
            sourceId: homeworkId,
            title: hw.title,
            skill: hw.skill || 'General',
            score: accuracy,
            completion: completion,
            notes: 'Attempted: ' + attempted + '/' + totalQuestions + ', Correct: ' + correct + ', Accuracy: ' + accuracy + '%',
            date: new Date().toISOString().split('T')[0]
          });
        }
      }

      this.saveState();
      this.notify('homework', this.state.homework);
      return hw.submissions[studentId];
    }

    archiveClass(id) {
      const c = this.getClass(id);
      if (c) {
        c.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteClass(id) {
      const idx = this.state.classes.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.state.classes.splice(idx, 1);
        this.saveState();
        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.deleteClass(id).catch(err => {
            console.error('[SchoolStore] Supabase deleteClass error:', err);
          });
        }
        return true;
      }
      return false;
    }

    // Calculated Attendance Rates
    getAttendanceRecords(classId = null, date = null) {
      return this.state.attendanceRecords.filter(r => {
        const matchClass = !classId || r.classId === classId;
        const matchDate = !date || r.date === date;
        return matchClass && matchDate;
      });
    }

    recordAttendance(records) {
      // records: [{ studentId, classId, date, status }]
      records.forEach(rec => {
        const existing = this.state.attendanceRecords.find(r => r.studentId === rec.studentId && r.date === rec.date);
        if (existing) {
          existing.status = rec.status;
          existing.classId = rec.classId;
        } else {
          this.state.attendanceRecords.push({
            id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            studentId: rec.studentId,
            classId: rec.classId,
            date: rec.date,
            status: rec.status
          });
        }
      });
      this.saveState();

      if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.saveAttendance(records).catch(e => {
          console.warn('[SchoolStore] Attendance cloud save warning:', e);
        });
      }
    }

    setStudentAttendance(studentId, status, date = null) {
      const s = this.getStudent(studentId);
      if (!s) return;
      const d = date || new Date().toISOString().split('T')[0];
      this.recordAttendance([{ studentId, classId: s.classId, date: d, status }]);
    }

    getClassAttendanceRate(classId) {
      const records = this.state.attendanceRecords.filter(r => r.classId === classId);
      if (records.length === 0) return 0;
      const presentOrLate = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      return Math.round((presentOrLate / records.length) * 100);
    }

    getStudentAttendanceRate(studentId) {
      const records = this.state.attendanceRecords.filter(r => r.studentId === studentId);
      if (records.length === 0) return 0;
      const presentOrLate = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      return Math.round((presentOrLate / records.length) * 100);
    }

    // =========================================================================
    // 3. CURRICULUM HIERARCHY CRUD
    // =========================================================================

    getBookPages(bookId = 'book-global-readings-2') {
      if (bookId === 'book-global-readings-3') {
        return GLOBAL_READINGS_3_PAGES;
      }
      return GLOBAL_READINGS_2_PAGES;
    }

    getSidebarCounts() {
      return {
        classes: (this.getClasses() || []).length,
        students: (this.getStudents() || []).length,
        curriculum: (this.getBooks() || []).length,
        resources: (this.getResources() || []).length,
        worksheets: (this.getWorksheets ? this.getWorksheets().length : 4),
        assignments: (this.getAssignments() || []).length,
        homework: (this.getHomework() || []).length,
        quizzes: (this.getQuizzes() || []).length,
        assessments: ((this.state && this.state.assessments) || []).filter(a => !a.archived).length,
        reports: (this.getReports() || []).length,
        messages: ((this.state && this.state.messages) || []).length
      };
    }

    getBooks(includeArchived = false) {
      return this.state.curriculum.books.filter(b => includeArchived || !b.archived);
    }

    addBook(data) {
      const book = {
        id: 'book-' + Date.now(),
        title: data.title || 'New Curriculum Book',
        level: data.level || data.targetLevel || 'A1',
        targetLevel: data.targetLevel || data.level || 'A1',
        description: data.description || '',
        archived: false
      };
      this.state.curriculum.books.push(book);
      this.saveState();
      return book;
    }

    updateBook(id, data) {
      const b = this.state.curriculum.books.find(book => book.id === id);
      if (b) {
        if (data.targetLevel && !data.level) data.level = data.targetLevel;
        if (data.level && !data.targetLevel) data.targetLevel = data.level;
        Object.assign(b, data);
        this.saveState();
        return b;
      }
      return null;
    }

    archiveBook(id) {
      const b = this.state.curriculum.books.find(book => book.id === id);
      if (b) {
        b.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    getUnit(unitId) {
      if (!unitId) return null;
      const all = this.getUnits(null, true);
      return all.find(u => u.id === unitId) || null;
    }

    getUnits(bookId = null, includeArchived = false) {
      return this.state.curriculum.units.filter(u => {
        const matchBook = !bookId || u.bookId === bookId;
        const matchArchived = includeArchived || !u.archived;
        return matchBook && matchArchived;
      });
    }

    addUnit(data) {
      const unit = {
        id: 'unit-' + Date.now(),
        bookId: data.bookId || 'book-1',
        title: data.title || 'New Curriculum Unit',
        order: data.order || (this.state.curriculum.units.length + 1),
        description: data.description || '',
        targetVocab: Array.isArray(data.targetVocab) ? data.targetVocab : (data.targetVocab || '').split(',').map(s => s.trim()).filter(Boolean),
        archived: false
      };
      this.state.curriculum.units.push(unit);
      this.saveState();
      return unit;
    }

    updateUnit(id, data) {
      const u = this.state.curriculum.units.find(unit => unit.id === id);
      if (u) {
        if (data.targetVocab && typeof data.targetVocab === 'string') {
          data.targetVocab = data.targetVocab.split(',').map(s => s.trim()).filter(Boolean);
        }
        Object.assign(u, data);
        this.saveState();
        return u;
      }
      return null;
    }

    duplicateUnit(id) {
      const original = this.state.curriculum.units.find(u => u.id === id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'unit-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.archived = false;
        this.state.curriculum.units.push(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    archiveUnit(id) {
      const u = this.state.curriculum.units.find(unit => unit.id === id);
      if (u) {
        u.archived = !u.archived;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteUnit(id) {
      if (!this.state.curriculum || !this.state.curriculum.units) return null;
      const idx = this.state.curriculum.units.findIndex(u => u.id === id);
      if (idx !== -1) {
        const removed = this.state.curriculum.units.splice(idx, 1)[0];
        this.saveState();
        return removed;
      }
      return null;
    }

    getLessons(unitId = null, includeArchived = false) {
      return this.state.curriculum.lessons.filter(l => {
        const matchUnit = !unitId || l.unitId === unitId;
        const matchArchived = includeArchived || !l.archived;
        return matchUnit && matchArchived;
      });
    }

    addLesson(data) {
      const lesson = {
        id: 'lesson-' + Date.now(),
        unitId: data.unitId || 'unit-1',
        title: data.title || 'New Interactive Lesson',
        order: data.order || 1,
        objective: data.objective || 'Communicative target',
        gameRoute: data.gameRoute || '',
        duration: parseInt(data.duration, 10) || 30,
        archived: false
      };
      this.state.curriculum.lessons.push(lesson);
      this.saveState();
      return lesson;
    }

    updateLesson(id, data) {
      const l = this.state.curriculum.lessons.find(lesson => lesson.id === id);
      if (l) {
        Object.assign(l, data);
        this.saveState();
        return l;
      }
      return null;
    }

    duplicateLesson(id) {
      const original = this.state.curriculum.lessons.find(l => l.id === id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'lesson-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.archived = false;
        this.state.curriculum.lessons.push(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    archiveLesson(id) {
      const l = this.state.curriculum.lessons.find(lesson => lesson.id === id);
      if (l) {
        l.archived = !l.archived;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteLesson(id) {
      if (!this.state.curriculum || !this.state.curriculum.lessons) return null;
      const idx = this.state.curriculum.lessons.findIndex(l => l.id === id);
      if (idx !== -1) {
        const removed = this.state.curriculum.lessons.splice(idx, 1)[0];
        this.saveState();
        return removed;
      }
      return null;
    }

    getObjectives(lessonId = null, includeArchived = false) {
      return this.state.curriculum.objectives.filter(o => {
        const matchLesson = !lessonId || o.lessonId === lessonId;
        const matchArchived = includeArchived || !o.archived;
        return matchLesson && matchArchived;
      });
    }

    addObjective(data) {
      const obj = {
        id: 'obj-' + Date.now(),
        lessonId: data.lessonId || 'lesson-1',
        text: data.text || 'Learning Objective',
        skill: data.skill || 'Speaking',
        cefr: data.cefr || 'A1',
        archived: false
      };
      this.state.curriculum.objectives.push(obj);
      this.saveState();
      return obj;
    }

    updateObjective(id, data) {
      const o = this.state.curriculum.objectives.find(obj => obj.id === id);
      if (o) {
        Object.assign(o, data);
        this.saveState();
        return o;
      }
      return null;
    }

    deleteObjective(id) {
      const idx = this.state.curriculum.objectives.findIndex(o => o.id === id);
      if (idx !== -1) {
        this.state.curriculum.objectives.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // =========================================================================
    // 4. RESOURCE / GAME CRUD
    // =========================================================================
    getResources(includeArchived = false) {
      return this.state.resources.filter(r => includeArchived || !r.archived);
    }

    getResource(id) {
      return this.state.resources.find(r => r.id === id);
    }

    addResource(data) {
      const newId = data.id || ('res-' + Date.now());
      const resource = {
        id: newId,
        title: data.title || 'New ESL Game',
        description: data.description || 'Interactive communicative activity',
        category: data.category || 'Classroom Game',
        level: data.level || 'A1',
        age: data.age || data.ages || '7–9',
        grade: data.grade || 'Grade 3',
        duration: parseInt(data.duration, 10) || 30,
        skills: Array.isArray(data.skills) ? data.skills : ['Speaking', 'Vocabulary'],
        topics: Array.isArray(data.topics) ? data.topics : (data.topic ? [data.topic] : ['Classroom English']),
        objectives: Array.isArray(data.objectives) ? data.objectives : (data.objectives ? [data.objectives] : ['Practice communicative speaking']),
        route: data.route || '',
        thumbnail: data.thumbnail || null,
        worksheet: data.worksheet || null,
        teacherGuide: !!data.teacherGuide,
        featured: !!data.featured,
        archived: false
      };
      this.state.resources.unshift(resource);
      this.saveState();
      return resource;
    }

    updateResource(id, updates) {
      const res = this.getResource(id);
      if (res) {
        Object.assign(res, updates);
        this.saveState();
        return res;
      }
      return null;
    }

    duplicateResource(id) {
      const original = this.getResource(id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'res-copy-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.featured = false;
        copy.archived = false;
        this.state.resources.unshift(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    archiveResource(id) {
      const res = this.getResource(id);
      if (res) {
        res.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteResource(id) {
      const idx = this.state.resources.findIndex(r => r.id === id);
      if (idx !== -1) {
        this.state.resources.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // =========================================================================
    // 5. ASSIGNMENTS & HOMEWORK CRUD
    // =========================================================================
    getAssignments(classId = null, includeArchived = false) {
      return this.state.assignments.filter(a => {
        const matchClass = !classId || a.classId === classId;
        const matchArchived = includeArchived || !a.archived;
        return matchClass && matchArchived;
      });
    }

    getAssignment(id) {
      return this.state.assignments.find(a => a.id === id);
    }

    createAssignment(data) {
      const newAsg = {
        id: 'asg-' + Date.now(),
        title: data.title || 'New Class Assignment',
        classId: data.classId || this.state.activeClassId,
        activityId: data.activityId || 'monster-day',
        studentIds: data.studentIds || 'all',
        dueDate: data.dueDate || 'Sep 25, 2026',
        instructions: data.instructions || '',
        objectives: data.objectives || ['Target communicative practice'],
        status: 'Active',
        completedCount: 0,
        assignedCount: this.getStudents(data.classId || this.state.activeClassId).length,
        archived: false
      };
      this.state.assignments.unshift(newAsg);
      this.saveState();
      return newAsg;
    }

    updateAssignment(id, data) {
      const a = this.getAssignment(id);
      if (a) {
        Object.assign(a, data);
        this.saveState();
        return a;
      }
      return null;
    }

    duplicateAssignment(id) {
      const original = this.getAssignment(id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'asg-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.completedCount = 0;
        copy.archived = false;
        this.state.assignments.unshift(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    archiveAssignment(id) {
      const a = this.getAssignment(id);
      if (a) {
        a.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteAssignment(id) {
      const idx = this.state.assignments.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.state.assignments.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // Homework CRUD
    getHomework(classId = null, includeArchived = false) {
      return this.state.homework.filter(h => {
        const matchClass = !classId || h.classId === classId;
        const matchArchived = includeArchived || !h.archived;
        return matchClass && matchArchived;
      });
    }

    getHomeworkItem(id) {
      return this.state.homework.find(h => h.id === id);
    }

    createHomework(data) {
      const newHw = {
        id: 'hw-' + Date.now(),
        title: data.title || 'New Homework Task',
        type: data.type || 'Game Mission',
        classId: data.classId || this.state.activeClassId,
        studentIds: data.studentIds || 'all',
        dueDate: data.dueDate || 'Sep 25, 2026',
        description: data.description || '',
        submittedCount: 0,
        archived: false
      };
      this.state.homework.unshift(newHw);
      this.saveState();
      return newHw;
    }

    updateHomework(id, data) {
      const h = this.getHomeworkItem(id);
      if (h) {
        Object.assign(h, data);
        this.saveState();
        return h;
      }
      return null;
    }

    duplicateHomework(id) {
      const original = this.getHomeworkItem(id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'hw-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.submittedCount = 0;
        copy.archived = false;
        this.state.homework.unshift(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    archiveHomework(id) {
      const h = this.getHomeworkItem(id);
      if (h) {
        h.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteHomework(id) {
      const idx = this.state.homework.findIndex(h => h.id === id);
      if (idx !== -1) {
        this.state.homework.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // =========================================================================
    // 6. QUIZZES & ASSESSMENTS CRUD
    // =========================================================================
    getQuizzes(includeArchived = false) {
      return this.state.quizzes.filter(q => includeArchived || !q.archived);
    }

    getQuiz(id) {
      return this.state.quizzes.find(q => q.id === id);
    }

    createQuiz(data) {
      const newQuiz = {
        id: 'quiz-' + Date.now(),
        title: data.title || 'New Diagnostic Quiz',
        targetCefr: data.targetCefr || 'A1',
        skill: data.skill || 'Vocabulary',
        questions: Array.isArray(data.questions) ? data.questions : [
          { id: 'q-1', question: data.sampleQuestion || 'Sample Question', options: ['Option A', 'Option B'], correctIndex: 0 }
        ],
        archived: false
      };
      this.state.quizzes.unshift(newQuiz);
      this.saveState();
      return newQuiz;
    }

    updateQuiz(id, data) {
      const q = this.getQuiz(id);
      if (q) {
        Object.assign(q, data);
        this.saveState();
        return q;
      }
      return null;
    }

    duplicateQuiz(id) {
      const original = this.getQuiz(id);
      if (original) {
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = 'quiz-' + Date.now();
        copy.title = original.title + ' (Copy)';
        copy.submissions = {};
        copy.archived = false;
        this.state.quizzes.unshift(copy);
        this.saveState();
        return copy;
      }
      return null;
    }

    recordQuizSubmission(quizId, studentId, resultData) {
      const q = this.getQuiz(quizId);
      if (!q) return null;
      if (!q.submissions) q.submissions = {};

      const totalQuestions = (q.questions || []).length || 5;
      const attempted = parseInt(resultData.attempted, 10) || totalQuestions;
      const correct = parseInt(resultData.correct, 10) || 0;
      const incorrect = Math.max(0, attempted - correct);
      const score = parseFloat(resultData.score) || correct;
      const maxScore = parseFloat(resultData.maxScore) || totalQuestions;
      const percentage = Math.round((score / maxScore) * 100);

      q.submissions[studentId] = {
        studentId,
        score,
        maxScore,
        percentage,
        attempted,
        correct,
        incorrect,
        skills: [q.skill || 'Vocabulary'],
        objectives: q.objective ? [q.objective] : ['Diagnostic Assessment'],
        submittedDate: new Date().toISOString().split('T')[0],
        teacherNotes: resultData.notes || '',
        overridden: false
      };

      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const evIdx = this.state.learningEvidence.findIndex(e => e.studentId === studentId && e.sourceId === quizId);
      const evPayload = {
        id: 'ev-qz-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId,
        source: 'quiz',
        sourceId: quizId,
        title: q.title,
        skill: q.skill || 'Vocabulary',
        score: percentage,
        notes: 'Diagnostic Quiz: ' + correct + '/' + attempted + ' correct (' + percentage + '%)',
        date: new Date().toISOString().split('T')[0]
      };
      if (evIdx !== -1) {
        Object.assign(this.state.learningEvidence[evIdx], evPayload);
      } else {
        this.state.learningEvidence.push(evPayload);
      }

      this.saveState();
      this.notify('quizzes', this.state.quizzes);
      return q.submissions[studentId];
    }

    overrideQuizResult(quizId, studentId, overrideData) {
      const q = this.getQuiz(quizId);
      if (!q) return null;
      if (!q.submissions) q.submissions = {};

      const sub = q.submissions[studentId] || {
        studentId,
        maxScore: (q.questions || []).length || 5,
        attempted: (q.questions || []).length || 5,
        correct: 0,
        incorrect: 0
      };

      if (overrideData.score !== undefined) sub.score = parseFloat(overrideData.score);
      if (overrideData.maxScore !== undefined) sub.maxScore = parseFloat(overrideData.maxScore);
      if (overrideData.percentage !== undefined) sub.percentage = parseFloat(overrideData.percentage);
      else if (sub.maxScore > 0) sub.percentage = Math.round((sub.score / sub.maxScore) * 100);
      if (overrideData.correct !== undefined) sub.correct = parseInt(overrideData.correct, 10);
      if (overrideData.incorrect !== undefined) sub.incorrect = parseInt(overrideData.incorrect, 10);
      if (overrideData.notes !== undefined) sub.teacherNotes = overrideData.notes;
      sub.overridden = true;
      sub.overrideDate = new Date().toISOString().split('T')[0];

      q.submissions[studentId] = sub;

      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const evIdx = this.state.learningEvidence.findIndex(e => e.studentId === studentId && e.sourceId === quizId);
      if (evIdx !== -1) {
        this.state.learningEvidence[evIdx].score = sub.percentage;
        this.state.learningEvidence[evIdx].notes = 'Teacher Override: ' + sub.correct + '/' + sub.attempted + ' correct (' + sub.percentage + '%) - ' + (sub.teacherNotes || '');
      } else {
        this.state.learningEvidence.push({
          id: 'ev-qz-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          studentId,
          source: 'quiz',
          sourceId: quizId,
          title: q.title,
          skill: q.skill || 'Vocabulary',
          score: sub.percentage,
          notes: 'Teacher Override: ' + sub.correct + '/' + sub.attempted + ' correct (' + sub.percentage + '%) - ' + (sub.teacherNotes || ''),
          date: new Date().toISOString().split('T')[0]
        });
      }

      this.saveState();
      this.notify('quizzes', this.state.quizzes);
      return sub;
    }

    archiveQuiz(id) {
      const q = this.getQuiz(id);
      if (q) {
        q.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteQuiz(id) {
      const idx = this.state.quizzes.findIndex(q => q.id === id);
      if (idx !== -1) {
        this.state.quizzes.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // Assessments CRUD
    getAssessments(studentId = null, includeArchived = false) {
      return this.state.assessments.filter(a => {
        const matchStudent = !studentId || a.studentId === studentId;
        const matchArchived = includeArchived || !a.archived;
        return matchStudent && matchArchived;
      });
    }

    recordAssessment(studentId, rubricScores, comment = '', title = 'Teacher Rubric Assessment') {
      const s = this.getStudent(studentId);
      if (!s) return null;

      const ass = {
        id: 'ass-' + Date.now(),
        title,
        studentId,
        classId: s.classId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rubricScores,
        teacherComment: comment,
        archived: false
      };

      this.state.assessments.unshift(ass);

      // Create learning evidence records for each assessed skill
      Object.entries(rubricScores).forEach(([skillKey, scoreVal]) => {
        this.state.learningEvidence.push({
          id: 'ev-' + Date.now() + '-' + skillKey,
          studentId,
          activityId: 'teacher-rubric',
          objectiveId: 'rubric-evaluation',
          skillId: skillKey,
          score: scoreVal,
          maxScore: 100,
          date: ass.date,
          source: 'Teacher Assessment'
        });
      });

      // Recalculate overall CEFR
      const skills = this.getStudentSkills(studentId);
      const avgScore = Object.values(skills).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(skills).length;
      s.overallCefr = avgScore >= 85 ? 'A2' : avgScore >= 75 ? 'A1+' : avgScore >= 60 ? 'A1' : 'Pre-A1';

      this.saveState();
      return Object.assign(ass, { student: s, overallCefr: s.overallCefr });
    }

    deleteAssessment(id) {
      const idx = this.state.assessments.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.state.assessments.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    // =========================================================================
    
    // -----------------------------------------------------------------------
    // MONSTER EVOLUTION & PROGRESSION SYSTEM METHODS
    // -----------------------------------------------------------------------

    getProgressionLevels(includeInactive = false) {
      if (!this.state.progressionLevels) this.state.progressionLevels = JSON.parse(JSON.stringify(DEFAULT_PROGRESSION_LEVELS));
      return this.state.progressionLevels.filter(l => includeInactive || l.status !== 'archived');
    }

    getProgressionLevel(id) {
      return this.getProgressionLevels(true).find(l => l.id === id);
    }

    addProgressionLevel(levelData) {
      if (!this.state.progressionLevels) this.state.progressionLevels = [];
      const newLvl = Object.assign({
        id: 'lvl-' + Date.now(),
        level: this.state.progressionLevels.length + 1,
        name: 'New Level',
        stageKey: 'growing',
        xpRequired: 1000,
        description: '',
        unlockedItems: [],
        rewardXP: 100,
        status: 'active'
      }, levelData);
      this.state.progressionLevels.push(newLvl);
      this.state.progressionLevels.sort((a, b) => a.xpRequired - b.xpRequired);
      this.saveState();
      this.notify();
      return newLvl;
    }

    updateProgressionLevel(id, updates) {
      const lvl = this.getProgressionLevel(id);
      if (lvl) {
        Object.assign(lvl, updates);
        if (updates.xpRequired !== undefined) {
          this.state.progressionLevels.sort((a, b) => a.xpRequired - b.xpRequired);
        }
        this.saveState();
        this.notify();
      }
      return lvl;
    }

    deleteProgressionLevel(id) {
      const idx = (this.state.progressionLevels || []).findIndex(l => l.id === id);
      if (idx !== -1) {
        const removed = this.state.progressionLevels.splice(idx, 1)[0];
        this.saveState();
        this.notify('progressionLevels', this.state.progressionLevels);
        return removed;
      }
      return null;
    }

    archiveProgressionLevel(id) {
      const lvl = this.getProgressionLevel(id);
      if (lvl) {
        lvl.status = lvl.status === 'archived' ? 'active' : 'archived';
        this.saveState();
        this.notify('progressionLevels', this.state.progressionLevels);
      }
      return lvl;
    }

    reorderProgressionLevels(id, direction = 'up') {
      if (!this.state.progressionLevels) return false;
      const idx = this.state.progressionLevels.findIndex(l => l.id === id);
      if (idx === -1) return false;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= this.state.progressionLevels.length) return false;
      const temp = this.state.progressionLevels[idx];
      this.state.progressionLevels[idx] = this.state.progressionLevels[targetIdx];
      this.state.progressionLevels[targetIdx] = temp;
      this.saveState();
      this.notify('progressionLevels', this.state.progressionLevels);
      return true;
    }

    getMonsterItems(category = null, includeArchived = false) {
      if (!this.state.monsterItems) this.state.monsterItems = JSON.parse(JSON.stringify(DEFAULT_MONSTER_ITEMS));
      return this.state.monsterItems.filter(item => {
        const matchCat = !category || item.category === category;
        const matchArchived = includeArchived || item.status !== 'archived';
        return matchCat && matchArchived;
      });
    }

    getMonsterItem(id) {
      return (this.state.monsterItems || []).find(item => item.id === id);
    }

    addMonsterItem(itemData) {
      if (!this.state.monsterItems) this.state.monsterItems = [];
      const newItem = Object.assign({
        id: 'item-' + Date.now(),
        name: 'New Item',
        category: 'accessory',
        description: '',
        icon: '✨',
        unlockType: 'default',
        unlockRequirement: {},
        rarity: 'common',
        status: 'active'
      }, itemData);
      this.state.monsterItems.push(newItem);
      this.saveState();
      this.notify();
      return newItem;
    }

    updateMonsterItem(id, updates) {
      const item = this.getMonsterItem(id);
      if (item) {
        Object.assign(item, updates);
        this.saveState();
        this.notify();
      }
      return item;
    }

    archiveMonsterItem(id) {
      const item = this.getMonsterItem(id);
      if (item) {
        item.status = item.status === 'archived' ? 'active' : 'archived';
        this.saveState();
        this.notify();
      }
      return item;
    }

    deleteMonsterItem(id) {
      const cat = this.state.monsterCatalog || this.state.monsterItems || [];
      const idx = cat.findIndex(i => i.id === id);
      if (idx !== -1) {
        const removed = cat.splice(idx, 1)[0];
        this.saveState();
        this.notify();
        return removed;
      }
      return null;
    }

    getMonsterProfile(studentId) {
      if (!this.state.monsterProfiles) this.state.monsterProfiles = {};
      if (!this.state.monsterProfiles[studentId]) {
        if (DEFAULT_MONSTER_PROFILES[studentId]) {
          this.state.monsterProfiles[studentId] = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES[studentId]));
        } else {
          const student = this.getStudent(studentId);
          const totalXP = this.getStudentTotalXP(studentId);
          const levels = this.getProgressionLevels().slice().sort((a, b) => a.xpRequired - b.xpRequired);

          // Determine initial level from current XP
          let initLevel = 1;
          for (let i = 0; i < levels.length; i++) {
            if (totalXP >= levels[i].xpRequired) {
              initLevel = levels[i].level;
            } else {
              break;
            }
          }

          const name = student ? student.firstName + "'s Monster" : "My Monster";
          const colors = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
          const colorIdx = studentId ? Math.abs(studentId.charCodeAt(studentId.length - 1)) % colors.length : 0;
          const assignedColor = colors[colorIdx] || 'blue';

          this.state.monsterProfiles[studentId] = {
            studentId: studentId,
            petName: name,
            monsterName: name,
            baseColor: assignedColor,
            highestUnlockedLevel: initLevel,
            lastCelebratedLevel: initLevel, // Existing students start with current level acknowledged
            isHatched: initLevel >= 3,
            equipped: {
              body: 'body-' + assignedColor,
              eyes: 'eyes-sparkle',
              mouth: 'mouth-smile',
              horns: 'horns-ears',
              wings: 'none',
              tail: 'tail-puff',
              hat: 'none',
              glasses: 'none',
              backpack: 'none',
              accessory: 'none',
              aura: 'none',
              background: 'bg-meadow'
            },
            unlockedItems: ['body-' + assignedColor, 'eyes-sparkle', 'mouth-smile', 'horns-ears', 'tail-puff', 'bg-meadow'],
            hatchDate: initLevel >= 3 ? new Date().toISOString() : null,
            evolutionHistory: [
              {
                id: 'ev-init-' + Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                type: initLevel >= 3 ? 'hatch' : 'egg',
                title: initLevel >= 3 ? 'Baby Monster Companion' : 'Mystery Egg Received',
                detail: 'Student entered Academy with Level ' + initLevel + ' companion.'
              }
            ]
          };
        }
        this.saveState();
      }

      // Safety checks for existing profiles that may lack highestUnlockedLevel or lastCelebratedLevel:
      const prof = this.state.monsterProfiles[studentId];
      if (!prof.highestUnlockedLevel) {
        const totalXP = this.getStudentTotalXP(studentId);
        const levels = this.getProgressionLevels().slice().sort((a, b) => a.xpRequired - b.xpRequired);
        let initLevel = 1;
        for (let i = 0; i < levels.length; i++) {
          if (totalXP >= levels[i].xpRequired) initLevel = levels[i].level;
          else break;
        }
        prof.highestUnlockedLevel = initLevel;
        if (prof.lastCelebratedLevel === undefined) {
          prof.lastCelebratedLevel = initLevel;
        }
        if (initLevel >= 3) {
          prof.isHatched = true;
        }
      }
      if (!prof.monsterName && prof.petName) {
        prof.monsterName = prof.petName;
      }
      if (!prof.equipped) prof.equipped = {};
      return prof;
    }

    acknowledgeCelebration(studentId, level = null) {
      const profile = this.getMonsterProfile(studentId);
      if (profile) {
        const targetLevel = level || profile.highestUnlockedLevel || 1;
        profile.lastCelebratedLevel = Math.max(profile.lastCelebratedLevel || 1, targetLevel);
        profile.celebratedAt = new Date().toISOString();
        this.saveState();
      }
    }

    updateMonsterProfile(studentId, updates) {
      const profile = this.getMonsterProfile(studentId);
      if (profile) {
        if (updates.equipped) {
          profile.equipped = Object.assign({}, profile.equipped, updates.equipped);
          delete updates.equipped;
        }
        Object.assign(profile, updates);
        this.saveState();
        this.notify();

        // Cloud Persistence: Authoritative Supabase Student Profile Update
        const s = this.getStudent(studentId);
        if (s) {
          s.monsterProfile = profile;
          if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
            window.AdventureSupabase.saveStudent(s).catch(err => {
              console.error('[SchoolStore] Supabase saveStudent (monster) error:', err);
            });
          } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
            window.SchoolCloudSync.saveStudent(s).catch(() => {});
          }
        }
      }
      return profile;
    }

    equipMonsterItem(studentId, category, itemId) {
      const profile = this.getMonsterProfile(studentId);
      if (!profile) return { success: false, reason: 'Profile not found' };

      const state = this.calculateMonsterState(studentId);
      if (itemId !== 'none' && !state.unlockedItemIds.has(itemId)) {
        return { success: false, reason: 'Item is locked. Complete the requirement to unlock.' };
      }

      if (!profile.equipped) profile.equipped = {};
      profile.equipped[category] = itemId;

      if (category === 'body' && itemId.startsWith('body-')) {
        profile.baseColor = itemId.replace('body-', '');
      }

      this.saveState();
      this.notify();
      return { success: true, profile };
    }

    hasStudentAchievement(studentId, achievementId) {
      if (!achievementId) return false;
      const awards = this.state.studentAwards || [];
      return awards.some(a => a.studentId === studentId && (a.achievementId === achievementId || a.id === achievementId));
    }

    calculateMonsterState(studentId) {
      const totalXP = this.getStudentTotalXP(studentId);
      const levels = this.getProgressionLevels().slice().sort((a, b) => a.xpRequired - b.xpRequired);
      const profile = this.getMonsterProfile(studentId);

      let levelFromXP = 1;
      for (let i = 0; i < levels.length; i++) {
        if (totalXP >= levels[i].xpRequired) {
          levelFromXP = levels[i].level;
        } else {
          break;
        }
      }

      // Permanent Evolution Rule: highestUnlockedLevel never downgrades even if XP decreases
      const highestUnlockedLevel = Math.max(profile.highestUnlockedLevel || 1, levelFromXP);
      if (highestUnlockedLevel > (profile.highestUnlockedLevel || 1)) {
        profile.highestUnlockedLevel = highestUnlockedLevel;
        if (highestUnlockedLevel >= 3) profile.isHatched = true;
        this.saveState();
      }

      const currentDisplayedLevel = highestUnlockedLevel;
      const currentLevelObj = levels.find(l => l.level === currentDisplayedLevel) || levels[0];
      const nextLevelObj = levels.find(l => l.level === currentDisplayedLevel + 1) || null;

      const currentLevel = currentLevelObj.level;
      const stageKey = currentLevelObj.stageKey;
      const stageName = currentLevelObj.name;
      const stageDescription = currentLevelObj.description || 'Companion in English Adventure Academy.';
      const levelXP = currentLevelObj.xpRequired;
      const nextLevelXP = nextLevelObj ? nextLevelObj.xpRequired : levelXP;
      const xpToNext = nextLevelObj ? Math.max(0, nextLevelObj.xpRequired - totalXP) : 0;
      
      let progressPct = 100;
      if (nextLevelObj && nextLevelXP > levelXP) {
        progressPct = Math.min(100, Math.max(0, Math.round(((totalXP - levelXP) / (nextLevelXP - levelXP)) * 100)));
      }

      const isHatched = (currentDisplayedLevel >= 3) || !!profile.isHatched;

      let eggCrackPct = 0;
      if (currentDisplayedLevel === 1) {
        eggCrackPct = Math.min(95, Math.round((totalXP / 100) * 100));
      } else if (currentDisplayedLevel === 2) {
        eggCrackPct = 100;
      } else {
        eggCrackPct = 100;
      }

      const allItems = this.getMonsterItems(null, true);
      const unlockedItemIds = new Set(profile.unlockedItems || []);

      allItems.forEach(item => {
        if (item.unlockType === 'default') {
          unlockedItemIds.add(item.id);
        } else if (item.unlockType === 'level') {
          const reqLevel = (item.unlockRequirement && item.unlockRequirement.level) || 1;
          if (currentDisplayedLevel >= reqLevel) {
            unlockedItemIds.add(item.id);
          }
        } else if (item.unlockType === 'achievement') {
          const achId = item.unlockRequirement && item.unlockRequirement.achievementId;
          if (achId && this.hasStudentAchievement(studentId, achId)) {
            unlockedItemIds.add(item.id);
          }
        }
      });

      return {
        studentId,
        totalXP,
        currentLevel,
        stageKey,
        stageName,
        stageDescription,
        levelXP,
        nextLevelXP,
        xpToNext,
        xpRemainingForNextLevel: xpToNext,
        progressPct,
        progressPctToNextLevel: progressPct,
        isHatched,
        eggCrackPct,
        eggCrackPercent: eggCrackPct,
        unlockedItemIds,
        currentLevelObj,
        nextLevelObj,
        highestUnlockedLevel,
        profile
      };
    }

    logMonsterHistory(studentId, event) {
      const profile = this.getMonsterProfile(studentId);
      if (!profile) return;
      if (!profile.evolutionHistory) profile.evolutionHistory = [];

      const newEvent = Object.assign({
        id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'xp',
        title: 'Progression Event',
        detail: ''
      }, event);

      profile.evolutionHistory.unshift(newEvent);
      this.saveState();
      this.notify();
      return newEvent;
    }

    // 7. CLASS STORY & MESSAGING CRUD
    // =========================================================================
    getClassStory(classId = null, includeArchived = false) {
      return this.state.classStory.filter(p => {
        const matchClass = !classId || p.classId === classId || p.classId === 'all';
        const matchArchived = includeArchived || !p.archived;
        return matchClass && matchArchived;
      });
    }

    addStoryPost(data) {
      const post = {
        id: 'post-' + Date.now(),
        classId: data.classId || this.state.activeClassId,
        studentIds: data.studentIds || 'all',
        type: data.category || data.type || 'Classroom Moment',
        title: data.title || 'New Story Update',
        content: data.content || '',
        mediaUrl: data.mediaUrl || null,
        timestamp: 'Just now',
        likes: 0,
        archived: false
      };
      this.state.classStory.unshift(post);
      this.saveState();
      return post;
    }

    updateStoryPost(id, data) {
      const p = this.state.classStory.find(post => post.id === id);
      if (p) {
        Object.assign(p, data);
        this.saveState();
        return p;
      }
      return null;
    }

    likeStoryPost(id) {
      const p = this.state.classStory.find(post => post.id === id);
      if (p) {
        p.likes = (p.likes || 0) + 1;
        this.saveState();
        return p;
      }
      return null;
    }

    deleteStoryPost(id) {
      const idx = this.state.classStory.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.state.classStory.splice(idx, 1);
        this.saveState();
        return true;
      }
      return false;
    }

    getMessageThreads() {
      return this.state.messages.map(t => {
        if (!t.messages && t.threads) t.messages = t.threads;
        return t;
      });
    }

    sendParentMessage(threadId, text) {
      const thread = this.state.messages.find(m => m.id === threadId);
      if (thread) {
        const msgObj = {
          sender: this.state.currentRole === 'parent' ? 'parent' : 'teacher',
          from: this.state.currentRole === 'parent' ? 'parent' : 'teacher',
          time: 'Just now',
          text
        };
        if (!thread.threads) thread.threads = [];
        thread.threads.push(msgObj);
        thread.messages = thread.threads;
        thread.lastActivity = 'Just now';
        this.saveState();
        return thread;
      }
      return null;
    }

    // =========================================================================
    // 8. UNIVERSAL ACTIVITY COMPLETION HOOK
    // =========================================================================
    completeActivity({ studentId, activityId, score, maxScore = 100, objectives = [] }) {
      const targetId = studentId || this.state.activeStudentId;
      const s = this.getStudent(targetId);
      if (!s) return { success: false, reason: 'Student not found' };

      const scorePct = Math.round((score / maxScore) * 100);
      const earnedXP = Math.round(scorePct * 1.5) + 20;

      // 1. Record transaction-based XP
      this.giveXP(targetId, earnedXP, `Completed ${activityId} with ${scorePct}%`, 'Activity');

      // 2. Record learning evidence
      this.state.learningEvidence.push({
        id: 'ev-' + Date.now(),
        studentId: targetId,
        activityId,
        objectiveId: (objectives && objectives[0]) || 'general',
        skillId: 'speaking',
        score: scorePct,
        maxScore: 100,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        source: 'Game'
      });

      this.saveState();
      return {
        success: true,
        earnedXP,
        newTotalXP: this.getStudentTotalXP(targetId),
        scorePct
      };
    }

    // ----------------------------------------------------
    // GROUPS MANAGEMENT (Classroom Teams)
    // ----------------------------------------------------
    getGroups(classId = null) {
      if (!this.state.groups) this.state.groups = [];
      return this.state.groups.filter(g => !classId || g.classId === classId);
    }

    getGroup(id) {
      if (!this.state.groups) this.state.groups = [];
      return this.state.groups.find(g => g.id === id) || null;
    }

    addGroup({ classId, name, color = '#2563eb', studentIds = [] }) {
      if (!this.state.groups) this.state.groups = [];
      const newGroup = {
        id: 'group-' + Date.now(),
        classId: classId || this.state.activeClassId,
        name: (name || 'New Team').trim(),
        color: color || '#2563eb',
        studentIds: Array.isArray(studentIds) ? studentIds : [],
        createdDate: new Date().toISOString().split('T')[0]
      };
      this.state.groups.push(newGroup);
      this.saveState();
      this.notify('groups', this.state.groups);
      return newGroup;
    }

    updateGroup(id, updates) {
      if (!this.state.groups) this.state.groups = [];
      const group = this.state.groups.find(g => g.id === id);
      if (!group) return null;
      if (updates.name !== undefined) group.name = updates.name.trim();
      if (updates.color !== undefined) group.color = updates.color;
      if (updates.studentIds !== undefined) group.studentIds = updates.studentIds;
      this.saveState();
      this.notify('groups', this.state.groups);
      return group;
    }

    deleteGroup(id) {
      if (!this.state.groups) this.state.groups = [];
      this.state.groups = this.state.groups.filter(g => g.id !== id);
      this.saveState();
      this.notify('groups', this.state.groups);
      return true;
    }

    awardGroupXP(groupId, amount, reason, teacherName = 'Mr. Maysam') {
      const group = this.getGroup(groupId);
      if (!group || !Array.isArray(group.studentIds) || group.studentIds.length === 0) return [];
      const transactions = [];
      const uniqueStudentIds = Array.from(new Set(group.studentIds));
      uniqueStudentIds.forEach(studentId => {
        const res = this.giveXP(studentId, amount, (group.name + ': ' + reason), teacherName);
        if (res && res.transaction) transactions.push(res.transaction);
      });
      return transactions;
    }

    // ----------------------------------------------------
    // POINTS AUDIT & TRANSACTION MANAGEMENT
    // ----------------------------------------------------
    deleteXPTransaction(transactionId) {
      const initialLen = this.state.xpTransactions.length;
      this.state.xpTransactions = this.state.xpTransactions.filter(t => t.id !== transactionId);
      if (this.state.xpTransactions.length !== initialLen) {
        this.saveState();
        this.notify('xp', this.state.xpTransactions);
        return true;
      }
      return false;
    }

    // ----------------------------------------------------
    // BULK ATTENDANCE (1-Click Mark All & Fast Adjust)
    // ----------------------------------------------------
    recordBulkAttendance(classId, date, statusMap) {
      if (!this.state.attendanceRecords) this.state.attendanceRecords = [];
      const effectiveDate = date || new Date().toISOString().split('T')[0];
      const recordsUpdated = [];

      Object.entries(statusMap).forEach(([studentId, status]) => {
        let record = this.state.attendanceRecords.find(r => r.classId === classId && r.studentId === studentId && r.date === effectiveDate);
        if (record) {
          record.status = status;
        } else {
          record = {
            id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            classId,
            studentId,
            date: effectiveDate,
            status
          };
          this.state.attendanceRecords.push(record);
        }
        recordsUpdated.push(record);
      });

      this.saveState();
      this.notify('attendance', this.state.attendanceRecords);
      return recordsUpdated;
    }

    // ----------------------------------------------------
    // QUICK ASSESSMENT & QUICK EVIDENCE (Live Classroom)
    // ----------------------------------------------------
    recordQuickAssessment({ studentId, skill = 'Speaking', objective, rating = 'Developing', comment = '', teacherName = 'Mr. Maysam' }) {
      const scoreMap = {
        'Beginning': 50,
        'Developing': 70,
        'Achieving': 85,
        'Excelling': 100
      };
      const score = scoreMap[rating] || 75;

      const evidence = {
        id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        studentId,
        date: new Date().toISOString().split('T')[0],
        activityType: 'Quick Teacher Assessment',
        activityTitle: objective || (skill + ' Assessment'),
        skill,
        score,
        maxScore: 100,
        percentage: score,
        notes: rating + ': ' + (comment || 'Formative observation by ' + teacherName)
      };

      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      this.state.learningEvidence.push(evidence);

      // Award formative encouragement XP (+10 XP)
      this.giveXP(studentId, 10, 'Formative Assessment: ' + skill, teacherName);

      this.saveState();
      this.notify('evidence', this.state.learningEvidence);
      return evidence;
    }

    recordQuickEvidence({ classId, activityTitle, scores = [], teacherName = 'Mr. Maysam' }) {
      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const results = [];
      const today = new Date().toISOString().split('T')[0];

      scores.forEach(item => {
        const pct = Math.round((item.score / item.maxScore) * 100);
        const ev = {
          id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          studentId: item.studentId,
          date: today,
          activityType: 'Worksheet / Written Evidence',
          activityTitle: activityTitle || 'Classroom Worksheet',
          skill: item.skill || 'Writing',
          score: item.score,
          maxScore: item.maxScore,
          percentage: pct,
          notes: item.notes || ('Scored ' + item.score + '/' + item.maxScore + ' (' + pct + '%)')
        };
        this.state.learningEvidence.push(ev);

        const earnedXP = Math.max(5, Math.round(pct / 10));
        this.giveXP(item.studentId, earnedXP, 'Worksheet: ' + (activityTitle || 'Class Assignment'), teacherName);

        results.push(ev);
      });

      this.saveState();
      this.notify('evidence', this.state.learningEvidence);
      return results;
    }

    // ----------------------------------------------------
    // PORTFOLIOS MANAGEMENT
    // ----------------------------------------------------
    getStudentPortfolio(studentId) {
      if (!this.state.portfolios) this.state.portfolios = [];
      return this.state.portfolios.filter(p => p.studentId === studentId);
    }

    addPortfolioItem({ studentId, classId, title, category = 'Projects', type = 'image', date = null, preview = '🎨', notes = '' }) {
      if (!this.state.portfolios) this.state.portfolios = [];
      const item = {
        id: 'port-' + Date.now(),
        studentId,
        classId: classId || this.state.activeClassId,
        title: (title || 'Student Artifact').trim(),
        category,
        type,
        date: date || new Date().toISOString().split('T')[0],
        preview: preview || '🎨',
        notes: notes || ''
      };
      this.state.portfolios.push(item);
      this.saveState();
      this.notify('portfolio', this.state.portfolios);
      return item;
    }

    deletePortfolioItem(id) {
      if (!this.state.portfolios) this.state.portfolios = [];
      this.state.portfolios = this.state.portfolios.filter(p => p.id !== id);
      this.saveState();
      this.notify('portfolio', this.state.portfolios);
      return true;
    }

    // ----------------------------------------------------
    // CURRICULUM REORDERING (Position-Based Ordering)
    // ----------------------------------------------------
    reorderUnits(bookId, unitIdsOrder) {
      if (!this.state.curriculum || !this.state.curriculum.units) return false;
      unitIdsOrder.forEach((id, index) => {
        const u = this.state.curriculum.units.find(item => item.id === id);
        if (u) u.order = index + 1;
      });
      this.state.curriculum.units.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.saveState();
      this.notify('curriculum', this.state.curriculum);
      return true;
    }

    reorderLessons(unitId, lessonIdsOrder) {
      if (!this.state.curriculum || !this.state.curriculum.lessons) return false;
      lessonIdsOrder.forEach((id, index) => {
        const l = this.state.curriculum.lessons.find(item => item.id === id);
        if (l) l.order = index + 1;
      });
      this.state.curriculum.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.saveState();
      this.notify('curriculum', this.state.curriculum);
      return true;
    }

    reorderObjectives(lessonId, objectiveIdsOrder) {
      if (!this.state.curriculum || !this.state.curriculum.objectives) return false;
      objectiveIdsOrder.forEach((id, index) => {
        const o = this.state.curriculum.objectives.find(item => item.id === id);
        if (o) o.order = index + 1;
      });
      this.saveState();
      this.notify('curriculum', this.state.curriculum);
      return true;
    }

    // ----------------------------------------------------
    // WORKSHEETS CRUD
    // ----------------------------------------------------
    getWorksheets(includeArchived = false) {
      if (!this.state.worksheets) this.state.worksheets = [];
      return this.state.worksheets.filter(w => includeArchived || !w.archived);
    }

    getWorksheet(id) {
      if (!this.state.worksheets) this.state.worksheets = [];
      return this.state.worksheets.find(w => w.id === id) || null;
    }

    addWorksheet(data) {
      if (!this.state.worksheets) this.state.worksheets = [];
      const newWs = {
        id: 'ws-' + Date.now(),
        title: (data.title || 'New Worksheet').trim(),
        level: data.level || 'A1',
        category: data.category || 'Worksheet & Drill',
        lessonId: data.lessonId || null,
        gameId: data.gameId || null,
        pdfUrl: data.pdfUrl || 'worksheet.html',
        answerKey: data.answerKey || '',
        description: data.description || '',
        archived: false
      };
      this.state.worksheets.push(newWs);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return newWs;
    }

    updateWorksheet(id, updates) {
      const ws = this.getWorksheet(id);
      if (!ws) return null;
      Object.assign(ws, updates);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return ws;
    }

    archiveWorksheet(id) {
      const ws = this.getWorksheet(id);
      if (ws) {
        ws.archived = true;
        this.saveState();
        this.notify('worksheets', this.state.worksheets);
        return true;
      }
      return false;
    }

    deleteWorksheet(id) {
      if (!this.state.worksheets) this.state.worksheets = [];
      this.state.worksheets = this.state.worksheets.filter(w => w.id !== id);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return true;
    }

    duplicateWorksheet(id) {
      const original = this.getWorksheet(id);
      if (!original) return null;
      const copy = JSON.parse(JSON.stringify(original));
      copy.id = 'ws-' + Date.now();
      copy.title = original.title + ' (Copy)';
      copy.createdDate = new Date().toISOString().split('T')[0];
      copy.archived = false;
      this.state.worksheets.unshift(copy);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return copy;
    }

    addQuestionToWorksheet(wsId, questionData) {
      const ws = this.getWorksheet(wsId);
      if (!ws) return null;
      if (!ws.questions) ws.questions = [];
      const q = {
        id: 'q-' + Date.now(),
        text: (questionData.text || 'New Question').trim(),
        type: questionData.type || 'multiple_choice',
        options: Array.isArray(questionData.options) ? questionData.options : ['Option A', 'Option B'],
        answer: questionData.answer || '',
        points: parseInt(questionData.points, 10) || 1
      };
      ws.questions.push(q);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return q;
    }

    updateWorksheetQuestion(wsId, qId, updates) {
      const ws = this.getWorksheet(wsId);
      if (!ws || !ws.questions) return null;
      const q = ws.questions.find(item => item.id === qId);
      if (q) {
        Object.assign(q, updates);
        this.saveState();
        this.notify('worksheets', this.state.worksheets);
        return q;
      }
      return null;
    }

    deleteWorksheetQuestion(wsId, qId) {
      const ws = this.getWorksheet(wsId);
      if (!ws || !ws.questions) return false;
      const idx = ws.questions.findIndex(item => item.id === qId);
      if (idx !== -1) {
        ws.questions.splice(idx, 1);
        this.saveState();
        this.notify('worksheets', this.state.worksheets);
        return true;
      }
      return false;
    }

    reorderWorksheetQuestions(wsId, qIds) {
      const ws = this.getWorksheet(wsId);
      if (!ws || !ws.questions) return false;
      const map = new Map(ws.questions.map(q => [q.id, q]));
      ws.questions = qIds.map(id => map.get(id)).filter(Boolean);
      this.saveState();
      this.notify('worksheets', this.state.worksheets);
      return true;
    }

    // ----------------------------------------------------
    // QUIZ QUESTIONS CRUD & REORDERING
    // ----------------------------------------------------
    getQuizQuestions(quizId) {
      const q = this.getQuiz(quizId);
      return q && Array.isArray(q.questions) ? q.questions : [];
    }

    addQuizQuestion(quizId, questionData) {
      const q = this.getQuiz(quizId);
      if (!q) return null;
      if (!Array.isArray(q.questions)) q.questions = [];
      const newQuestion = {
        id: 'q-' + Date.now(),
        question: (questionData.question || 'New Question').trim(),
        options: Array.isArray(questionData.options) ? questionData.options : ['Option A', 'Option B', 'Option C'],
        correctIndex: parseInt(questionData.correctIndex, 10) || 0,
        points: parseInt(questionData.points, 10) || 10
      };
      q.questions.push(newQuestion);
      this.saveState();
      this.notify('quizzes', this.state.quizzes);
      return newQuestion;
    }

    updateQuizQuestion(quizId, questionId, updates) {
      const q = this.getQuiz(quizId);
      if (!q || !Array.isArray(q.questions)) return null;
      const question = q.questions.find(item => item.id === questionId);
      if (!question) return null;
      Object.assign(question, updates);
      this.saveState();
      this.notify('quizzes', this.state.quizzes);
      return question;
    }

    deleteQuizQuestion(quizId, questionId) {
      const q = this.getQuiz(quizId);
      if (!q || !Array.isArray(q.questions)) return false;
      const initLen = q.questions.length;
      q.questions = q.questions.filter(item => item.id !== questionId);
      if (q.questions.length !== initLen) {
        this.saveState();
        this.notify('quizzes', this.state.quizzes);
        return true;
      }
      return false;
    }

    reorderQuizQuestions(quizId, questionIdsOrder) {
      const q = this.getQuiz(quizId);
      if (!q || !Array.isArray(q.questions)) return false;
      const sorted = [];
      questionIdsOrder.forEach(id => {
        const found = q.questions.find(item => item.id === id);
        if (found) sorted.push(found);
      });
      // append any unmentioned
      q.questions.forEach(item => {
        if (!sorted.includes(item)) sorted.push(item);
      });
      q.questions = sorted;
      this.saveState();
      this.notify('quizzes', this.state.quizzes);
      return true;
    }

    // ----------------------------------------------------
    // RUBRICS CRUD (Customizable Criteria)
    // ----------------------------------------------------
    getRubrics(includeArchived = false) {
      if (!this.state.rubrics) this.state.rubrics = [];
      return this.state.rubrics.filter(r => includeArchived || !r.archived);
    }

    getRubric(id) {
      if (!this.state.rubrics) this.state.rubrics = [];
      return this.state.rubrics.find(r => r.id === id) || null;
    }

    createRubric(data) {
      if (!this.state.rubrics) this.state.rubrics = [];
      const newRubric = {
        id: 'rubric-' + Date.now(),
        name: (data.name || 'Custom CEFR Rubric').trim(),
        skill: data.skill || 'Speaking',
        criteria: Array.isArray(data.criteria) ? data.criteria : [
          { id: 'crit-' + Date.now() + '-1', name: 'Fluency & Spontaneity', description: 'Speaks clearly with natural rhythm', maxScore: 5 },
          { id: 'crit-' + Date.now() + '-2', name: 'Vocabulary Range', description: 'Uses target words accurately', maxScore: 5 }
        ],
        archived: false
      };
      this.state.rubrics.push(newRubric);
      this.saveState();
      this.notify('rubrics', this.state.rubrics);
      return newRubric;
    }

    updateRubric(id, updates) {
      const r = this.getRubric(id);
      if (!r) return null;
      Object.assign(r, updates);
      this.saveState();
      this.notify('rubrics', this.state.rubrics);
      return r;
    }

    archiveRubric(id) {
      const r = this.getRubric(id);
      if (r) {
        r.archived = true;
        this.saveState();
        this.notify('rubrics', this.state.rubrics);
        return true;
      }
      return false;
    }

    deleteRubric(id) {
      if (!this.state.rubrics) this.state.rubrics = [];
      this.state.rubrics = this.state.rubrics.filter(r => r.id !== id);
      this.saveState();
      this.notify('rubrics', this.state.rubrics);
      return true;
    }

    addCriterionToRubric(rubricId, criterionData) {
      const r = this.getRubric(rubricId);
      if (!r) return null;
      if (!Array.isArray(r.criteria)) r.criteria = [];
      const newCrit = {
        id: 'crit-' + Date.now(),
        name: (criterionData.name || 'New Criterion').trim(),
        description: criterionData.description || '',
        maxScore: parseInt(criterionData.maxScore, 10) || 5
      };
      r.criteria.push(newCrit);
      this.saveState();
      this.notify('rubrics', this.state.rubrics);
      return newCrit;
    }

    removeCriterionFromRubric(rubricId, criterionId) {
      const r = this.getRubric(rubricId);
      if (!r || !Array.isArray(r.criteria)) return false;
      r.criteria = r.criteria.filter(c => c.id !== criterionId);
      this.saveState();
      this.notify('rubrics', this.state.rubrics);
      return true;
    }

    // ----------------------------------------------------
    // BADGES & ACHIEVEMENTS CRUD
    // ----------------------------------------------------
    getBadges(includeArchived = false) {
      if (!this.state.badges) this.state.badges = [];
      return this.state.badges.filter(b => includeArchived || !b.archived);
    }

    getBadge(id) {
      if (!this.state.badges) this.state.badges = [];
      return this.state.badges.find(b => b.id === id) || null;
    }

    createBadge(data) {
      if (!this.state.badges) this.state.badges = [];
      const badge = {
        id: 'badge-' + Date.now(),
        name: (data.name || 'New Badge').trim(),
        icon: data.icon || '⭐',
        description: data.description || '',
        category: data.category || 'General',
        xpReward: parseInt(data.xpReward, 10) || 100,
        archived: false
      };
      this.state.badges.push(badge);
      this.saveState();
      this.notify('badges', this.state.badges);
      return badge;
    }

    updateBadge(id, updates) {
      const b = this.getBadge(id);
      if (!b) return null;
      Object.assign(b, updates);
      this.saveState();
      this.notify('badges', this.state.badges);
      return b;
    }

    addBadge(data) {
      return this.createBadge(data);
    }

    archiveBadge(id) {
      const b = this.getBadge(id);
      if (b) {
        b.archived = !b.archived;
        b.status = b.archived ? 'archived' : 'active';
        this.saveState();
        this.notify('badges', this.state.badges);
        return b;
      }
      return null;
    }

    deleteBadge(id) {
      if (!this.state.badges) return null;
      const idx = this.state.badges.findIndex(b => b.id === id);
      if (idx !== -1) {
        const removed = this.state.badges.splice(idx, 1)[0];
        this.saveState();
        this.notify('badges', this.state.badges);
        return removed;
      }
      return null;
    }

    getAchievements(includeArchived = false) {
      if (!this.state.achievements) this.state.achievements = [];
      return this.state.achievements.filter(a => includeArchived || !a.archived);
    }

    getAchievement(id) {
      if (!this.state.achievements) this.state.achievements = [];
      return this.state.achievements.find(a => a.id === id) || null;
    }

    createAchievement(data) {
      if (!this.state.achievements) this.state.achievements = [];
      const ach = {
        id: 'ach-' + Date.now(),
        name: (data.name || 'New Achievement').trim(),
        icon: data.icon || '🏆',
        requirement: data.requirement || '',
        category: data.category || 'General',
        xpReward: parseInt(data.xpReward, 10) || 200,
        archived: false,
        status: 'active'
      };
      this.state.achievements.push(ach);
      this.saveState();
      this.notify('achievements', this.state.achievements);
      return ach;
    }

    addAchievement(data) {
      return this.createAchievement(data);
    }

    updateAchievement(id, updates) {
      const a = this.getAchievement(id);
      if (!a) return null;
      Object.assign(a, updates);
      this.saveState();
      this.notify('achievements', this.state.achievements);
      return a;
    }

    archiveAchievement(id) {
      const a = this.getAchievement(id);
      if (a) {
        a.archived = !a.archived;
        a.status = a.archived ? 'archived' : 'active';
        this.saveState();
        this.notify('achievements', this.state.achievements);
        return a;
      }
      return null;
    }

    deleteAchievement(id) {
      if (!this.state.achievements) return null;
      const idx = this.state.achievements.findIndex(a => a.id === id);
      if (idx !== -1) {
        const removed = this.state.achievements.splice(idx, 1)[0];
        this.saveState();
        this.notify('achievements', this.state.achievements);
        return removed;
      }
      return null;
    }

    // ----------------------------------------------------
    // LEARNING EVIDENCE EDIT & CORRECTION AUDIT
    // ----------------------------------------------------
    getLearningEvidence(studentId = null) {
      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      return this.state.learningEvidence.filter(e => !studentId || e.studentId === studentId);
    }

    updateLearningEvidence(id, updates, reason = 'Teacher score correction') {
      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const ev = this.state.learningEvidence.find(e => e.id === id);
      if (!ev) return null;

      // Keep audit trail of changes
      if (!ev.history) ev.history = [];
      ev.history.push({
        previousScore: ev.score,
        previousPct: ev.percentage,
        updatedDate: new Date().toISOString().split('T')[0],
        correctionReason: reason
      });

      Object.assign(ev, updates);
      if (updates.score !== undefined && ev.maxScore) {
        ev.percentage = Math.round((ev.score / ev.maxScore) * 100);
      }

      this.saveState();
      this.notify('evidence', this.state.learningEvidence);
      return ev;
    }

    deleteLearningEvidence(id) {
      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const initLen = this.state.learningEvidence.length;
      this.state.learningEvidence = this.state.learningEvidence.filter(e => e.id !== id);
      if (this.state.learningEvidence.length !== initLen) {
        this.saveState();
        this.notify('evidence', this.state.learningEvidence);
        return true;
      }
      return false;
    }

    // ----------------------------------------------------
    // DYNAMIC REPORTS GENERATOR
    // ----------------------------------------------------
    getReports(classId = null) {
      if (!this.state.reports) this.state.reports = [];
      return this.state.reports.filter(r => !classId || r.classId === classId);
    }

    getReport(id) {
      if (!this.state.reports) this.state.reports = [];
      return this.state.reports.find(r => r.id === id) || null;
    }

    generateStudentReport({ studentId, classId, term = 'Term 1', reportType = 'CEFR Progress Report', customNotes = '' }) {
      const s = this.getStudent(studentId);
      if (!s) return null;
      const targetClass = classId || s.classId;
      const totalXP = this.getStudentTotalXP(studentId);
      const attendanceRate = this.getStudentAttendanceRate(studentId);
      const skills = this.getStudentSkills(studentId);

      const report = {
        id: 'rep-' + Date.now(),
        studentId,
        studentName: s.firstName + ' ' + s.lastName,
        classId: targetClass,
        className: (this.getClass(targetClass) || {}).name || 'Class',
        title: s.firstName + ' ' + s.lastName + ' — ' + term + ' ' + reportType,
        reportType,
        term,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dataSnapshot: {
          totalXP,
          attendanceRate,
          overallCefr: s.overallCefr,
          skills
        },
        teacherNotes: customNotes || ('Demonstrated strong learning progress throughout ' + term + '.'),
        archived: false
      };

      if (!this.state.reports) this.state.reports = [];
      this.state.reports.unshift(report);
      this.saveState();
      this.notify('reports', this.state.reports);
      return report;
    }

    saveGeneratedReport(report) {
      if (!this.state.reports) this.state.reports = [];
      const idx = this.state.reports.findIndex(r => r.id === report.id);
      if (idx !== -1) {
        this.state.reports[idx] = report;
      } else {
        this.state.reports.push(report);
      }
      this.saveState();
      this.notify('reports', this.state.reports);
      return report;
    }

    deleteReport(id) {
      if (!this.state.reports) this.state.reports = [];
      this.state.reports = this.state.reports.filter(r => r.id !== id);
      this.saveState();
      this.notify('reports', this.state.reports);
      return true;
    }

    // ----------------------------------------------------
    // GLOBAL SCHOOL SETTINGS
    // ----------------------------------------------------
    getSchoolSettings() {
      if (!this.state.schoolSettings) {
        this.state.schoolSettings = {
          schoolName: 'English Adventure Academy',
          teacherName: 'Mr. Maysam',
          academicYear: '2026–2027',
          term: 'Term 1',
          primaryCefrTarget: 'A1',
          leaderboardEnabled: true,
          parentStoryVisibility: true,
          soundEffectsEnabled: true
        };
      }
      if (!this.state.schoolSettings.teacherName || this.state.schoolSettings.teacherName !== 'Mr. Maysam') {
        this.state.schoolSettings.teacherName = 'Mr. Maysam';
      }
      return this.state.schoolSettings;
    }

    updateSchoolSettings(updates) {
      this.getSchoolSettings();
      Object.assign(this.state.schoolSettings, updates);
      this.saveState();
      this.notify('settings', this.state.schoolSettings);
      return this.state.schoolSettings;
    }




    // =========================================================================
    // CALENDAR EVENTS CRUD
    // =========================================================================
    getCalendarEvents(classId = null) {
      if (!this.state.calendarEvents) this.state.calendarEvents = [];
      if (classId) {
        return this.state.calendarEvents.filter(ev => ev.classId === classId);
      }
      return this.state.calendarEvents;
    }

    getCalendarEvent(id) {
      return (this.state.calendarEvents || []).find(ev => ev.id === id) || null;
    }

    addCalendarEvent(data) {
      if (!this.state.calendarEvents) this.state.calendarEvents = [];
      const newEv = Object.assign({
        id: 'event-' + Date.now(),
        classId: this.state.activeClassId || 'class-3a',
        title: 'New Class Session',
        topic: 'General English Practice',
        dayOfWeek: 'Monday',
        time: '10:00 – 10:45',
        date: new Date().toISOString().split('T')[0],
        room: 'Room 204',
        type: 'Lesson'
      }, data);
      this.state.calendarEvents.push(newEv);
      this.saveState();
      this.notify('calendar', newEv);
      return newEv;
    }

    updateCalendarEvent(id, updates) {
      const ev = this.getCalendarEvent(id);
      if (ev) {
        Object.assign(ev, updates);
        this.saveState();
        this.notify('calendar', ev);
        return ev;
      }
      return null;
    }

    deleteCalendarEvent(id) {
      if (!this.state.calendarEvents) return false;
      const idx = this.state.calendarEvents.findIndex(ev => ev.id === id);
      if (idx !== -1) {
        const removed = this.state.calendarEvents.splice(idx, 1)[0];
        this.saveState();
        this.notify('calendar', { deleted: id });
        return true;
      }
      return false;
    }

    // =========================================================================
    // UNIVERSAL RESTORE & ARCHIVE AUDIT ENGINE
    // =========================================================================
    restoreStudent(id) {
      const s = this.state.students.find(item => item.id === id);
      if (s) { s.archived = false; this.saveState(); this.notify('students', s); return true; }
      return false;
    }

    restoreClass(id) {
      const c = this.state.classes.find(item => item.id === id);
      if (c) { c.archived = false; this.saveState(); this.notify('classes', c); return true; }
      return false;
    }

    restoreBook(id) {
      const b = (this.state.curriculum.books || []).find(item => item.id === id);
      if (b) { b.archived = false; this.saveState(); this.notify('curriculum', b); return true; }
      return false;
    }

    restoreUnit(id) {
      const u = (this.state.curriculum.units || []).find(item => item.id === id);
      if (u) { u.archived = false; this.saveState(); this.notify('curriculum', u); return true; }
      return false;
    }

    restoreLesson(id) {
      const l = (this.state.curriculum.lessons || []).find(item => item.id === id);
      if (l) { l.archived = false; this.saveState(); this.notify('curriculum', l); return true; }
      return false;
    }

    restoreResource(id) {
      const r = this.state.resources.find(item => item.id === id);
      if (r) { r.archived = false; this.saveState(); this.notify('resources', r); return true; }
      return false;
    }

    restoreWorksheet(id) {
      const w = (this.state.worksheets || []).find(item => item.id === id);
      if (w) { w.archived = false; this.saveState(); this.notify('worksheets', w); return true; }
      return false;
    }

    restoreAssignment(id) {
      const a = this.state.assignments.find(item => item.id === id);
      if (a) { a.archived = false; this.saveState(); this.notify('assignments', a); return true; }
      return false;
    }

    restoreHomework(id) {
      const h = this.state.homework.find(item => item.id === id);
      if (h) { h.archived = false; this.saveState(); this.notify('homework', h); return true; }
      return false;
    }

    restoreQuiz(id) {
      const q = this.state.quizzes.find(item => item.id === id);
      if (q) { q.archived = false; this.saveState(); this.notify('quizzes', q); return true; }
      return false;
    }

    restoreRubric(id) {
      const r = (this.state.rubrics || []).find(item => item.id === id);
      if (r) { r.archived = false; this.saveState(); this.notify('rubrics', r); return true; }
      return false;
    }

    restoreBadge(id) {
      const b = (this.state.badges || []).find(item => item.id === id);
      if (b) { b.archived = false; this.saveState(); this.notify('badges', b); return true; }
      return false;
    }

    restoreAchievement(id) {
      const a = (this.state.achievements || []).find(item => item.id === id);
      if (a) { a.archived = false; this.saveState(); this.notify('achievements', a); return true; }
      return false;
    }

    getArchivedEntities(filterType = null) {
      const s = this.state;
      const list = [];

      const addItems = (type, labelKey, arr) => {
        if (!filterType || filterType === type) {
          (arr || []).filter(item => item.archived === true).forEach(item => {
            list.push({
              type,
              id: item.id,
              title: item[labelKey] || item.name || item.title || item.firstName + ' ' + item.lastName,
              meta: item.grade || item.level || item.cefrTarget || item.skill || type,
              item
            });
          });
        }
      };

      addItems('student', 'firstName', s.students);
      addItems('class', 'name', s.classes);
      addItems('book', 'title', (s.curriculum && s.curriculum.books));
      addItems('unit', 'title', (s.curriculum && s.curriculum.units));
      addItems('lesson', 'title', (s.curriculum && s.curriculum.lessons));
      addItems('resource', 'title', s.resources);
      addItems('worksheet', 'title', s.worksheets);
      addItems('assignment', 'title', s.assignments);
      addItems('homework', 'title', s.homework);
      addItems('quiz', 'title', s.quizzes);
      addItems('rubric', 'name', s.rubrics);
      addItems('badge', 'name', s.badges);
      addItems('achievement', 'title', s.achievements);

      return list;
    }

    restoreEntity(type, id) {
      switch (type) {
        case 'student': return this.restoreStudent(id);
        case 'class': return this.restoreClass(id);
        case 'book': return this.restoreBook(id);
        case 'unit': return this.restoreUnit(id);
        case 'lesson': return this.restoreLesson(id);
        case 'resource': return this.restoreResource(id);
        case 'worksheet':
        case 'worksheets': return this.restoreWorksheet(id);
        case 'assignment': return this.restoreAssignment(id);
        case 'homework': return this.restoreHomework(id);
        case 'quiz': return this.restoreQuiz(id);
        case 'rubric': return this.restoreRubric(id);
        case 'badge': return this.restoreBadge(id);
        case 'achievement': return this.restoreAchievement(id);
        default: return false;
      }
    }

    permanentDeleteEntity(type, id) {
      const s = this.state;
      switch (type) {
        case 'student':
          s.students = s.students.filter(item => item.id !== id);
          break;
        case 'class':
          s.classes = s.classes.filter(item => item.id !== id);
          break;
        case 'resource':
          s.resources = s.resources.filter(item => item.id !== id);
          break;
        case 'worksheet':
        case 'worksheets':
          s.worksheets = s.worksheets.filter(item => item.id !== id);
          break;
        case 'assignment':
          s.assignments = s.assignments.filter(item => item.id !== id);
          break;
        case 'homework':
          s.homework = s.homework.filter(item => item.id !== id);
          break;
        case 'quiz':
          s.quizzes = s.quizzes.filter(item => item.id !== id);
          break;
        case 'rubric':
          s.rubrics = s.rubrics.filter(item => item.id !== id);
          break;
        case 'badge':
          s.badges = s.badges.filter(item => item.id !== id);
          break;
        case 'achievement':
          s.achievements = s.achievements.filter(item => item.id !== id);
          break;
        default:
          return false;
      }
      this.saveState();
      this.notify(type + 's', s[type + 's'] || []);
      return true;
    }

    // =========================================================================
    // STUDENT MOVEMENTS & ENROLLMENT
    // =========================================================================
    moveStudentToClass(studentId, targetClassId) {
      const s = this.getStudent(studentId);
      if (s) {
        s.classId = targetClassId || null;
        this.saveState();
        this.notify('students', s);
        return true;
      }
      return false;
    }

    getUnenrolledStudents() {
      return this.state.students.filter(s => !s.archived && !s.classId);
    }

    updateStudentAvatar(studentId, avatarObj) {
      const s = this.getStudent(studentId);
      if (s) {
        s.avatar = Object.assign({}, s.avatar || {}, avatarObj);
        this.saveState();
        this.notify('students', s);

        if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
          window.AdventureSupabase.saveStudent(s).catch(err => {
            console.error('[SchoolStore] Supabase saveStudent (avatar) error:', err);
          });
        } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
          window.SchoolCloudSync.saveStudent(s).catch(() => {});
        }

        return true;
      }
      return false;
    }

    // =========================================================================
    // ENHANCED ENTITY EDITS (Assessments, Portfolios, Books, Objectives, Groups)
    // =========================================================================
    updateAssessment(id, updates) {
      const ass = this.state.assessments.find(a => a.id === id);
      if (ass) {
        Object.assign(ass, updates);
        this.saveState();
        this.notify('assessments', ass);
        return ass;
      }
      return null;
    }

    updateXPTransaction(id, updates) {
      const tx = this.state.xpTransactions.find(t => t.id === id);
      if (tx) {
        Object.assign(tx, updates);
        this.saveState();
        this.notify('xp', tx);
        return tx;
      }
      return null;
    }

    updatePortfolioItem(id, updates) {
      if (!this.state.portfolios) this.state.portfolios = [];
      const it = this.state.portfolios.find(p => p.id === id);
      if (it) {
        Object.assign(it, updates);
        this.saveState();
        this.notify('portfolio', it);
        return it;
      }
      return null;
    }

    deleteBook(id) {
      if (!this.state.curriculum || !this.state.curriculum.books) return false;
      const idx = this.state.curriculum.books.findIndex(b => b.id === id);
      if (idx !== -1) {
        this.state.curriculum.books.splice(idx, 1);
        this.saveState();
        this.notify('curriculum', { deletedBook: id });
        return true;
      }
      return false;
    }

    moveLessonToUnit(lessonId, newUnitId) {
      const l = this.getLessons(null, true).find(item => item.id === lessonId);
      if (l) {
        l.unitId = newUnitId;
        // set order to end of new unit
        const existingInUnit = this.getLessons(newUnitId, true);
        l.order = existingInUnit.length;
        this.saveState();
        this.notify('curriculum', l);
        return true;
      }
      return false;
    }

    createMessageThread(studentId, parentName, initialMessage) {
      if (!this.state.messages) this.state.messages = [];
      const student = this.getStudent(studentId);
      const newThread = {
        id: 'msg-' + Date.now(),
        studentId,
        studentName: student ? (student.firstName + ' ' + student.lastName) : 'Student',
        parentName: parentName || (student ? student.parentName : 'Parent'),
        messages: [
          {
            sender: 'teacher',
            text: initialMessage || 'Hello! Thank you for connecting with English Adventure Academy.',
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      this.state.messages.push(newThread);
      this.saveState();
      this.notify('messages', newThread);
      return newThread;
    }

    archiveMessageThread(threadId) {
      if (!this.state.messages) return false;
      const idx = this.state.messages.findIndex(t => t.id === threadId);
      if (idx !== -1) {
        this.state.messages.splice(idx, 1);
        this.saveState();
        this.notify('messages', { deletedThread: threadId });
        return true;
      }
      return false;
    }

    updateReport(id, updates) {
      if (!this.state.reports) return null;
      const rep = this.state.reports.find(r => r.id === id);
      if (rep) {
        Object.assign(rep, updates);
        this.saveState();
        this.notify('reports', rep);
        return rep;
      }
      return null;
    }



    // Convenient Store Getter Aliases
    getXpTransactions(studentId = null) { return this.getXPTransactions(studentId); }
    getPortfolios(studentId = null) { return studentId ? this.getStudentPortfolio(studentId) : (this.state.portfolios || []); }
    getMessages() { return this.getMessageThreads(); }

    // =========================================================================
    // XP SKILLS MANAGEMENT (ClassDojo-style Positive & Needs Work Skills)
    // =========================================================================
    getXPSkills(category = null, includeArchived = false) {
      if (!this.state.xpSkills) return [];
      return this.state.xpSkills.filter(s => {
        const matchCat = !category || s.category === category;
        const matchArchived = includeArchived || s.status !== 'archived';
        return matchCat && matchArchived;
      });
    }

    getXPSkill(id) {
      if (!this.state.xpSkills) return null;
      return this.state.xpSkills.find(s => s.id === id) || null;
    }

    addXPSkill(data) {
      if (!this.state.xpSkills) this.state.xpSkills = [];
      const newSkill = {
        id: 'skill-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: data.name || 'New Skill',
        icon: data.icon || '⭐',
        points: parseInt(data.points, 10) || 1,
        category: data.category || (parseInt(data.points, 10) < 0 ? 'needs_work' : 'positive'),
        description: data.description || '',
        status: data.status || 'active'
      };
      this.state.xpSkills.push(newSkill);
      this.saveState();
      this.notify('xpSkills', this.state.xpSkills);
      return newSkill;
    }

    updateXPSkill(id, updates) {
      if (!this.state.xpSkills) return null;
      const skill = this.state.xpSkills.find(s => s.id === id);
      if (!skill) return null;
      if (updates.name !== undefined) skill.name = updates.name;
      if (updates.icon !== undefined) skill.icon = updates.icon;
      if (updates.points !== undefined) skill.points = parseInt(updates.points, 10) || 1;
      if (updates.category !== undefined) skill.category = updates.category;
      if (updates.description !== undefined) skill.description = updates.description;
      if (updates.status !== undefined) skill.status = updates.status;
      this.saveState();
      this.notify('xpSkills', this.state.xpSkills);
      return skill;
    }

    archiveXPSkill(id) {
      if (!this.state.xpSkills) return null;
      const skill = this.state.xpSkills.find(s => s.id === id);
      if (skill) {
        skill.status = 'archived';
        this.saveState();
        this.notify('xpSkills', this.state.xpSkills);
      }
      return skill;
    }

    restoreXPSkill(id) {
      if (!this.state.xpSkills) return null;
      const skill = this.state.xpSkills.find(s => s.id === id);
      if (skill) {
        skill.status = 'active';
        this.saveState();
        this.notify('xpSkills', this.state.xpSkills);
      }
      return skill;
    }

    deleteXPSkill(id) {
      if (!this.state.xpSkills) return false;
      const prevLen = this.state.xpSkills.length;
      this.state.xpSkills = this.state.xpSkills.filter(s => s.id !== id);
      if (this.state.xpSkills.length !== prevLen) {
        this.saveState();
        this.notify('xpSkills', this.state.xpSkills);
        return true;
      }
      return false;
    }

    // =========================================================================
    // CLASSROOM REWARDS & REDEMPTION SYSTEM
    // =========================================================================
    getRewards() {
      if (!this.state.rewards) return [];
      return this.state.rewards.filter(r => r.active !== false);
    }

    getAllRewards() {
      return this.state.rewards || [];
    }

    getReward(id) {
      if (!this.state.rewards) return null;
      return this.state.rewards.find(r => r.id === id) || null;
    }

    addReward(data) {
      if (!this.state.rewards) this.state.rewards = [];
      const newReward = {
        id: 'rew-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        title: data.title || 'Classroom Reward',
        cost: Math.abs(parseInt(data.cost, 10)) || 50,
        icon: data.icon || '🎁',
        description: data.description || '',
        category: data.category || 'General',
        active: true
      };
      this.state.rewards.push(newReward);
      this.saveState();
      this.notify('rewards', this.state.rewards);
      return newReward;
    }

    updateReward(id, updates) {
      if (!this.state.rewards) return null;
      const rew = this.state.rewards.find(r => r.id === id);
      if (!rew) return null;
      if (updates.title !== undefined) rew.title = updates.title;
      if (updates.cost !== undefined) rew.cost = Math.abs(parseInt(updates.cost, 10)) || 50;
      if (updates.icon !== undefined) rew.icon = updates.icon;
      if (updates.description !== undefined) rew.description = updates.description;
      if (updates.category !== undefined) rew.category = updates.category;
      if (updates.active !== undefined) rew.active = updates.active;
      this.saveState();
      this.notify('rewards', this.state.rewards);
      return rew;
    }

    deleteReward(id) {
      if (!this.state.rewards) return false;
      const rew = this.state.rewards.find(r => r.id === id);
      if (rew) {
        rew.active = false;
        this.saveState();
        this.notify('rewards', this.state.rewards);
        return true;
      }
      return false;
    }

    redeemReward(studentId, rewardId, teacherName = 'Mr. Maysam') {
      const student = this.getStudent(studentId);
      if (!student) return { success: false, error: 'Student not found' };

      const reward = this.getReward(rewardId);
      if (!reward) return { success: false, error: 'Reward not found' };

      const currentXP = this.getStudentTotalXP(studentId);
      if (currentXP < reward.cost) {
        return { success: false, error: `Insufficient XP: Needs ${reward.cost} XP, but has ${currentXP} XP` };
      }

      const tx = {
        id: 'xp-redeem-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId,
        amount: -reward.cost,
        reason: 'Redeemed: ' + reward.title,
        category: 'redeemed',
        skillId: reward.id,
        icon: reward.icon || '🎁',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString(),
        createdBy: teacherName,
        source: 'Teacher',
        status: 'active'
      };

      if (!this.state.xpTransactions) this.state.xpTransactions = [];
      this.state.xpTransactions.push(tx);
      this.saveState();
      this.notify('xp', this.state.xpTransactions);
      return { success: true, transaction: tx, student, reward, newTotalXP: this.getStudentTotalXP(studentId) };
    }

    // =========================================================================
    // BIG IDEAS CLASSROOM BOARD (ClassDojo-style Brainstorming & Projects)
    // =========================================================================
    getBigIdeas(classId = null) {
      if (!this.state.bigIdeas) return [];
      return this.state.bigIdeas
        .filter(i => !classId || i.classId === classId)
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.votes || 0) - (a.votes || 0));
    }

    getBigIdea(id) {
      if (!this.state.bigIdeas) return null;
      return this.state.bigIdeas.find(i => i.id === id) || null;
    }

    addBigIdea(data) {
      if (!this.state.bigIdeas) this.state.bigIdeas = [];
      const newIdea = {
        id: 'idea-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        classId: data.classId || this.state.activeClassId,
        title: data.title || 'New Big Idea',
        description: data.description || '',
        category: data.category || 'Project',
        author: data.author || 'Teacher',
        votes: 0,
        pinned: data.pinned || false,
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(t => t.trim()) : ['Adventure']),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      this.state.bigIdeas.unshift(newIdea);
      this.saveState();
      this.notify('bigIdeas', this.state.bigIdeas);
      return newIdea;
    }

    updateBigIdea(id, updates) {
      if (!this.state.bigIdeas) return null;
      const idea = this.state.bigIdeas.find(i => i.id === id);
      if (!idea) return null;
      Object.assign(idea, updates);
      this.saveState();
      this.notify('bigIdeas', this.state.bigIdeas);
      return idea;
    }

    pinBigIdea(id) {
      if (!this.state.bigIdeas) return false;
      const idea = this.state.bigIdeas.find(i => i.id === id);
      if (!idea) return false;
      idea.pinned = !idea.pinned;
      this.saveState();
      this.notify('bigIdeas', this.state.bigIdeas);
      return idea.pinned;
    }

    voteBigIdea(id) {
      if (!this.state.bigIdeas) return 0;
      const idea = this.state.bigIdeas.find(i => i.id === id);
      if (!idea) return 0;
      idea.votes = (idea.votes || 0) + 1;
      this.saveState();
      this.notify('bigIdeas', this.state.bigIdeas);
      return idea.votes;
    }

    deleteBigIdea(id) {
      if (!this.state.bigIdeas) return false;
      const prevLen = this.state.bigIdeas.length;
      this.state.bigIdeas = this.state.bigIdeas.filter(i => i.id !== id);
      if (this.state.bigIdeas.length !== prevLen) {
        this.saveState();
        this.notify('bigIdeas', this.state.bigIdeas);
        return true;
      }
      return false;
    }

    // =========================================================================
    // ORIGINAL ADVENTURE AVATAR SYSTEM (6 Categories)
    // =========================================================================
    getAvatarCatalog() {
      return this.state.avatarCatalog || [];
    }

    updateStudentAvatar(studentId, avatarData) {
      const student = this.getStudent(studentId);
      if (!student) return null;
      if (typeof avatarData === 'string') {
        student.avatar = { emoji: avatarData, hair: 'girl' };
      } else {
        student.avatar = Object.assign({}, student.avatar, avatarData);
      }
      this.saveState();
      this.notify('students', this.state.students);

      if (typeof window !== 'undefined' && window.AdventureSupabase && window.AdventureSupabase.isConfigured) {
        window.AdventureSupabase.saveStudent(student).catch(err => {
          console.error('[SchoolStore] Supabase saveStudent (avatar) error:', err);
        });
      } else if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.saveStudent(student).catch(() => {});
      }

      return student;
    }

    // =========================================================================
    // GROUP TOTAL XP (Dynamic Sum of Active Student Transactions)
    // =========================================================================
    getGroupTotalXP(groupId) {
      const group = this.getGroup(groupId);
      if (!group || !Array.isArray(group.studentIds)) return 0;
      return group.studentIds.reduce((total, sId) => total + this.getStudentTotalXP(sId), 0);
    }

    // =========================================================================
    // STUDENT AWARDS (SEPARATE FROM BADGE DEFINITIONS)
    // =========================================================================
    getStudentAwards(studentId = null, includeArchived = false) {
      if (!this.state.studentAwards) this.state.studentAwards = [];
      return this.state.studentAwards.filter(a => {
        const matchStudent = !studentId || a.studentId === studentId;
        const matchArchived = includeArchived || !a.archived;
        return matchStudent && matchArchived;
      });
    }

    awardBadgeToStudent(studentId, badgeId, notes = '') {
      if (!this.state.studentAwards) this.state.studentAwards = [];
      const badge = this.getBadge(badgeId);
      if (!badge) return null;

      const award = {
        id: 'saward-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        studentId,
        badgeId,
        awardedDate: new Date().toISOString().split('T')[0],
        awardedBy: 'Mr. Maysam',
        notes: notes || ('Awarded: ' + badge.name),
        archived: false
      };

      this.state.studentAwards.push(award);

      // Award XP transaction associated with badge
      if (badge.xpReward) {
        this.giveXP(
          studentId,
          badge.xpReward,
          'Badge Award: ' + badge.name,
          'Badge System',
          { category: 'positive', isPoints: true, icon: badge.icon || '🏆', skillId: badge.id }
        );
      }

      this.saveState();
      this.notify('studentAwards', this.state.studentAwards);
      return award;
    }

    removeStudentAward(awardId) {
      if (!this.state.studentAwards) return false;
      const idx = this.state.studentAwards.findIndex(a => a.id === awardId);
      if (idx !== -1) {
        this.state.studentAwards.splice(idx, 1);
        this.saveState();
        this.notify('studentAwards', this.state.studentAwards);
        return true;
      }
      return false;
    }

    // =========================================================================
    // PROGRESS CHECK ENGINE CRUD & PERSISTENCE METHODS
    // =========================================================================

    getProgressChecks(filter = "active") {
      if (!this.state.progressChecks) this.state.progressChecks = JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECKS));
      if (filter === "all") return this.state.progressChecks;
      if (filter === "archived") return this.state.progressChecks.filter(c => c.archived);
      return this.state.progressChecks.filter(c => !c.archived);
    }

    getProgressCheck(id) {
      if (!this.state.progressChecks) this.state.progressChecks = JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECKS));
      return this.state.progressChecks.find(c => c.id === id) || null;
    }

    saveProgressCheck(checkData) {
      if (!this.state.progressChecks) this.state.progressChecks = [];
      const isNew = !checkData.id;
      const id = checkData.id || ("progress-check-" + Date.now());
      const record = Object.assign({}, checkData, {
        id,
        updatedAt: new Date().toISOString()
      });
      if (isNew) {
        record.createdDate = record.createdDate || new Date().toISOString().split("T")[0];
        record.archived = false;
        this.state.progressChecks.push(record);
      } else {
        const idx = this.state.progressChecks.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.state.progressChecks[idx] = Object.assign(this.state.progressChecks[idx], record);
        } else {
          this.state.progressChecks.push(record);
        }
      }
      this.saveState();
      this.notify("progressChecks", this.state.progressChecks);
      return record;
    }

    deleteProgressCheck(id) {
      if (!this.state.progressChecks) return false;
      const initLen = this.state.progressChecks.length;
      this.state.progressChecks = this.state.progressChecks.filter(c => c.id !== id);
      if (this.state.progressCheckSubmissions) {
        this.state.progressCheckSubmissions = this.state.progressCheckSubmissions.filter(s => s.progressCheckId !== id);
      }
      if (this.state.progressChecks.length !== initLen) {
        this.saveState();
        this.notify("progressChecks", this.state.progressChecks);
        return true;
      }
      return false;
    }

    duplicateProgressCheck(id) {
      const original = this.getProgressCheck(id);
      if (!original) return null;
      const clone = JSON.parse(JSON.stringify(original));
      clone.id = "progress-check-" + Date.now();
      clone.title = clone.title + " (Copy)";
      clone.createdDate = new Date().toISOString().split("T")[0];
      clone.archived = false;
      this.state.progressChecks.push(clone);
      this.saveState();
      this.notify("progressChecks", this.state.progressChecks);
      return clone;
    }

    archiveProgressCheck(id) {
      const check = this.getProgressCheck(id);
      if (check) {
        check.archived = true;
        this.saveState();
        this.notify("progressChecks", this.state.progressChecks);
        return true;
      }
      return false;
    }

    restoreProgressCheck(id) {
      const check = this.getProgressCheck(id);
      if (check) {
        check.archived = false;
        this.saveState();
        this.notify("progressChecks", this.state.progressChecks);
        return true;
      }
      return false;
    }

    getProgressCheckSubmissions(checkId = null, studentId = null) {
      if (!this.state.progressCheckSubmissions) {
        this.state.progressCheckSubmissions = JSON.parse(JSON.stringify(DEFAULT_PROGRESS_CHECK_SUBMISSIONS));
      }
      const sObj = studentId ? this.getStudent(studentId) : null;
      const resolvedStudentId = sObj ? sObj.id : studentId;
      return this.state.progressCheckSubmissions.filter(s => {
        if (checkId && s.progressCheckId !== checkId) return false;
        if (resolvedStudentId && s.studentId !== resolvedStudentId && (!sObj || s.studentId !== sObj.studentIdNumber)) return false;
        return true;
      });
    }

    getStudentProgressCheckHistory(studentId) {
      const s = this.getStudent(studentId);
      const resolvedId = s ? s.id : studentId;
      return this.getProgressCheckSubmissions(null, resolvedId).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }

    submitProgressCheck(submissionData) {
      if (!this.state.progressCheckSubmissions) this.state.progressCheckSubmissions = [];
      const id = submissionData.id || ("sub-" + (submissionData.studentId || "student") + "-" + Date.now());
      const checkId = submissionData.progressCheckId || "progress-check-a1";
      const check = this.getProgressCheck(checkId);
      const studentId = submissionData.studentId;
      const student = this.getStudent(studentId);

      const submission = Object.assign({}, submissionData, {
        id,
        date: submissionData.date || new Date().toISOString().split("T")[0],
        displayDate: submissionData.displayDate || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        timestamp: new Date().toISOString(),
        status: "completed"
      });

      // Upsert submission
      const existingIdx = this.state.progressCheckSubmissions.findIndex(s => s.id === id);
      if (existingIdx !== -1) {
        this.state.progressCheckSubmissions[existingIdx] = submission;
      } else {
        this.state.progressCheckSubmissions.push(submission);
      }

      // Automatically generate granular LearningEvidence records for all assessed skills
      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const skillKeys = ["vocabulary", "listening", "reading", "grammar", "speaking", "writing"];
      
      skillKeys.forEach(skillKey => {
        const skillData = submission.skillScores && submission.skillScores[skillKey];
        if (skillData && skillData.score !== undefined) {
          const evId = "ev-pc-" + studentId + "-" + skillKey + "-" + Date.now();
          const existingEvIdx = this.state.learningEvidence.findIndex(e => e.sourceId === id && e.skillId === skillKey);
          const evRecord = {
            id: existingEvIdx !== -1 ? this.state.learningEvidence[existingEvIdx].id : evId,
            studentId,
            activityId: "progress-check-" + checkId,
            sourceId: id,
            objectiveId: "obj-" + skillKey + "-assessment",
            skillId: skillKey,
            score: Math.round(skillData.score),
            maxScore: 100,
            date: submission.date,
            source: "Progress Check",
            activityName: (check ? check.title : "English Adventure Progress Check") + " — " + (skillKey.charAt(0).toUpperCase() + skillKey.slice(1)),
            cefr: skillData.cefr || (check ? check.cefrTarget : "A1"),
            mastery: skillData.mastery || (skillData.score >= 85 ? "Exceeding" : skillData.score >= 70 ? "Meeting" : "Developing"),
            notes: "Assessed via English Adventure Progress Check. Accuracy: " + Math.round(skillData.score) + "%"
          };
          if (existingEvIdx !== -1) {
            this.state.learningEvidence[existingEvIdx] = evRecord;
          } else {
            this.state.learningEvidence.push(evRecord);
          }
        }
      });

      // Award +50 XP completion reward
      const xpAmount = 50;
      this.giveXP(
        studentId,
        xpAmount,
        "Completed " + (check ? check.title : "English Adventure Progress Check"),
        "Assessment",
        { isPoints: true, category: 'positive', icon: '⭐' }
      );

      // Check Monster Evolution threshold
      const evolutionCheck = this.checkMonsterEvolution ? this.checkMonsterEvolution(studentId) : null;

      // Update student latest assessment timestamp
      if (student) {
        student.lastAssessmentDate = submission.date;
        student.latestProgressCheckScore = submission.overallScore;
      }

      this.saveState();
      this.notify("evidence", this.state.learningEvidence);
      this.notify("progressCheckSubmissions", this.state.progressCheckSubmissions);

      return {
        success: true,
        submission,
        xpAwarded: xpAmount,
        evolution: evolutionCheck
      };
    }

    saveTeacherProgressCheckOverride(submissionId, overrides, reason = "", teacherComment = "") {
      if (!this.state.progressCheckSubmissions) return false;
      const sub = this.state.progressCheckSubmissions.find(s => s.id === submissionId);
      if (!sub) return false;

      if (!sub.teacherOverrides) sub.teacherOverrides = {};
      Object.assign(sub.teacherOverrides, overrides);

      if (reason) sub.overrideReason = reason;
      if (teacherComment) sub.teacherComment = teacherComment;

      if (!sub.originalSkillScores) {
        sub.originalSkillScores = JSON.parse(JSON.stringify(sub.skillScores || {}));
      }

      for (const skillKey in overrides) {
        if (sub.skillScores && sub.skillScores[skillKey]) {
          const overrideVal = overrides[skillKey];
          if (typeof overrideVal === "number") {
            sub.skillScores[skillKey].score = overrideVal;
            sub.skillScores[skillKey].isOverridden = true;
          } else if (typeof overrideVal === "string") {
            sub.skillScores[skillKey].mastery = overrideVal;
            sub.skillScores[skillKey].statusText = overrideVal;
            sub.skillScores[skillKey].isOverridden = true;
          }
        }
      }

      if (this.state.learningEvidence) {
        this.state.learningEvidence.forEach(ev => {
          if (ev.sourceId === submissionId && overrides[ev.skillId] !== undefined) {
            const val = overrides[ev.skillId];
            if (typeof val === "number") ev.score = val;
            if (typeof val === "string") ev.mastery = val;
            ev.notes = "Teacher Override: " + reason + (ev.notes ? " | Orig: " + ev.notes : "");
          }
        });
      }

      this.saveState();
      this.notify("progressCheckSubmissions", this.state.progressCheckSubmissions);
      this.notify("evidence", this.state.learningEvidence);
      return true;
    }

    savePaperWorksheetEvidence(submissionId, paperData) {
      if (!this.state.progressCheckSubmissions) return false;
      const sub = this.state.progressCheckSubmissions.find(s => s.id === submissionId);
      if (!sub) return false;

      sub.paperWorksheet = Object.assign({}, sub.paperWorksheet || {}, paperData, {
        submittedAt: new Date().toISOString()
      });

      if (!this.state.learningEvidence) this.state.learningEvidence = [];
      const evId = "ev-paper-" + sub.studentId + "-" + Date.now();
      const pct = paperData.scorePct || Math.round(((paperData.correct || 0) / (paperData.completed || 10)) * 100);

      this.state.learningEvidence.push({
        id: evId,
        studentId: sub.studentId,
        activityId: "paper-progress-check",
        sourceId: submissionId,
        skillId: "writing",
        score: pct,
        maxScore: 100,
        date: new Date().toISOString().split("T")[0],
        source: "Paper Worksheet",
        activityName: "Progress Check — Printable A4 Sheet",
        cefr: sub.targetCefr || "A1",
        mastery: pct >= 80 ? "Meeting" : pct >= 60 ? "Developing" : "Needs practice",
        mediaUrl: paperData.photoUrl || null,
        notes: "Handwritten assessment worksheet: " + (paperData.notes || "Completed paper test")
      });

      this.saveState();
      this.notify("progressCheckSubmissions", this.state.progressCheckSubmissions);
      this.notify("evidence", this.state.learningEvidence);
      return true;
    }

    getClassProgressCheckAnalytics(checkId, classId = "class-3a") {
      const submissions = this.getProgressCheckSubmissions(checkId).filter(s => !classId || s.classId === classId);
      const students = this.getStudentsByClass ? this.getStudentsByClass(classId) : [];

      if (submissions.length === 0) {
        return {
          totalStudents: students.length,
          completedCount: 0,
          completionRate: 0,
          classAverages: { vocabulary: 0, reading: 0, grammar: 0, listening: 0, speaking: 0, writing: 0, overall: 0 },
          skillsNeedingAttention: [],
          supportGroups: { listeningSupport: [], grammarSupport: [], speakingSupport: [], strongReading: [], strongVocabulary: [] }
        };
      }

      const skills = ["vocabulary", "reading", "grammar", "listening", "speaking", "writing"];
      const classAverages = {};
      skills.forEach(skillKey => {
        const validScores = submissions.map(s => s.skillScores && s.skillScores[skillKey] ? s.skillScores[skillKey].score : null).filter(v => v !== null);
        classAverages[skillKey] = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
      });

      const overallScores = submissions.map(s => s.overallScore || 0);
      classAverages.overall = overallScores.length ? Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;

      const skillsNeedingAttention = [];
      if (classAverages.listening < 70) skillsNeedingAttention.push({ skill: "Listening", score: classAverages.listening, status: "Developing", priority: "High", color: "#ef4444" });
      if (classAverages.speaking < 72) skillsNeedingAttention.push({ skill: "Speaking", score: classAverages.speaking, status: "Developing", priority: "Medium", color: "#f97316" });
      if (classAverages.grammar < 74) skillsNeedingAttention.push({ skill: "Grammar", score: classAverages.grammar, status: "Meeting Baseline", priority: "Medium", color: "#eab308" });

      const supportGroups = {
        listeningSupport: [],
        grammarSupport: [],
        speakingSupport: [],
        strongReading: [],
        strongVocabulary: []
      };

      submissions.forEach(sub => {
        const student = this.getStudent(sub.studentId);
        const studentObj = {
          id: sub.studentId,
          name: student ? (student.firstName + " " + student.lastName) : sub.studentId,
          score: sub.overallScore,
          scores: sub.skillScores || {}
        };

        if (sub.skillScores) {
          if (sub.skillScores.listening && sub.skillScores.listening.score < 70) supportGroups.listeningSupport.push(studentObj);
          if (sub.skillScores.grammar && sub.skillScores.grammar.score < 72) supportGroups.grammarSupport.push(studentObj);
          if (sub.skillScores.speaking && (sub.skillScores.speaking.score < 72 || sub.skillScores.speaking.mastery === "Developing")) supportGroups.speakingSupport.push(studentObj);
          if (sub.skillScores.reading && sub.skillScores.reading.score >= 82) supportGroups.strongReading.push(studentObj);
          if (sub.skillScores.vocabulary && sub.skillScores.vocabulary.score >= 82) supportGroups.strongVocabulary.push(studentObj);
        }
      });

      return {
        checkId,
        classId,
        totalStudents: students.length,
        completedCount: submissions.length,
        completionRate: Math.round((submissions.length / (students.length || 1)) * 100),
        classAverages,
        skillsNeedingAttention,
        supportGroups,
        submissions
      };
    }

    recommendPracticeForStudent(submissionId) {
      if (!this.state.progressCheckSubmissions) return [];
      const sub = this.state.progressCheckSubmissions.find(s => s.id === submissionId);
      if (!sub) return [];

      const recommendations = [];
      const scores = sub.skillScores || {};

      const skillRanking = Object.keys(scores).map(k => ({ skill: k, score: scores[k].score || 0 })).sort((a, b) => a.score - b.score);

      const gameMapping = {
        "listening": [
          { resourceId: "firefighter", title: "Fire Station Adventure (Listening Station)", type: "game", reason: "Listening for emergency orders and instructions" },
          { resourceId: "monster-day", title: "Monster Day (Audio Listening)", type: "game", reason: "Listen and build body features" }
        ],
        "speaking": [
          { resourceId: "restaurant", title: "At the Restaurant (Guided Roleplay)", type: "game", reason: "Speaking practice with polite ordering frames" },
          { resourceId: "monster-day", title: "Build Your Own Monster", type: "game", reason: "Speaking sentences describing body parts" }
        ],
        "grammar": [
          { resourceId: "neighbourhood", title: "My Neighbourhood (Prepositions & Present Simple)", type: "game", reason: "Sentence structures and prepositions" },
          { resourceId: "advice", title: "The Crazy Advice Academy", type: "game", reason: "Modal verbs and sentence construction" }
        ],
        "reading": [
          { resourceId: "city-mouse", title: "City Mouse & Country Mouse", type: "game", reason: "Passage reading comprehension and story sequence" },
          { resourceId: "wizard-of-oz", title: "The Wizard of Oz Story Quest", type: "game", reason: "Reading narrative clues" }
        ],
        "vocabulary": [
          { resourceId: "monster-day", title: "Monster Vocabulary Explorer", type: "game", reason: "Body parts, colors, and everyday nouns" },
          { resourceId: "restaurant", title: "Food & Drink Vocabulary", type: "game", reason: "Food items, prices, and meals" }
        ]
      };

      skillRanking.slice(0, 3).forEach((item, idx) => {
        const matches = gameMapping[item.skill] || [];
        if (matches.length > 0) {
          const match = matches[0];
          recommendations.push({
            skill: item.skill.charAt(0).toUpperCase() + item.skill.slice(1),
            currentScore: item.score,
            priority: idx + 1,
            title: match.title,
            resourceId: match.resourceId,
            type: match.type,
            reason: match.reason
          });
        }
      });

      return recommendations;
    }

    assignRecommendedPractice(studentId, resourceId, type = "game", checkId = "progress-check-a1") {
      const student = this.getStudent(studentId);
      const studentName = student ? student.firstName : "Student";
      const newAssignment = {
        id: "asg-practice-" + studentId + "-" + Date.now(),
        classId: student ? student.classId : "class-3a",
        studentId: studentId,
        title: "Follow-up Practice: " + (resourceId.charAt(0).toUpperCase() + resourceId.slice(1).replace("-", " ")),
        type: type === "worksheet" ? "Worksheet" : "Interactive Game",
        resourceId,
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
        status: "Assigned",
        points: 50,
        instructions: "Recommended based on your English Progress Check results. Practice this mission to improve your skills!",
        assignedDate: new Date().toISOString().split("T")[0],
        sourceCheckId: checkId
      };

      if (!this.state.assignments) this.state.assignments = [];
      this.state.assignments.push(newAssignment);
      this.saveState();
      this.notify("assignments", this.state.assignments);
      return newAssignment;
    }

    createSkillNeedGroup(classId, groupName, studentIds, color = "#2563eb") {
      const newGroup = {
        id: "grp-skill-" + Date.now(),
        classId: classId || "class-3a",
        name: groupName,
        color: color,
        studentIds: Array.isArray(studentIds) ? studentIds : [studentIds],
        createdDate: new Date().toISOString().split("T")[0],
        purpose: "Targeted Skill Support"
      };

      if (!this.state.groups) this.state.groups = [];
      this.state.groups.push(newGroup);
      this.saveState();
      this.notify("groups", this.state.groups);
      return newGroup;
    }

    analyzeProgressCheckWithAI(submissionId) {
      const sub = this.state.progressCheckSubmissions && this.state.progressCheckSubmissions.find(s => s.id === submissionId);
      if (!sub) return null;
      const student = this.getStudent(sub.studentId);
      const name = student ? student.firstName : "The student";

      const scores = sub.skillScores || {};
      const strongest = Object.keys(scores).reduce((a, b) => (scores[a].score > scores[b].score ? a : b), "reading");
      const weakest = Object.keys(scores).reduce((a, b) => (scores[a].score < scores[b].score ? a : b), "listening");

      return {
        studentName: name,
        overallSummary: name + " demonstrates developing A1 proficiency with an overall score of " + sub.overallScore + "%. Assessment evidence indicates consistent performance in visual reading tasks and everyday vocabulary, with targeted growth opportunities in spoken fluency and listening comprehension for multi-item sequences.",
        strongestArea: {
          skill: strongest.charAt(0).toUpperCase() + strongest.slice(1),
          score: scores[strongest] ? scores[strongest].score : 88,
          observation: name + " successfully identified key story elements and character actions with high accuracy and confidence."
        },
        areaNeedingSupport: {
          skill: weakest.charAt(0).toUpperCase() + weakest.slice(1),
          score: scores[weakest] ? scores[weakest].score : 65,
          observation: "Struggles primarily with identifying secondary information in spoken sentences (such as times, colors, and spatial prepositions) when spoken at conversational pace."
        },
        speakingAssessment: sub.speakingRubricDetails ? (name + " can answer familiar questions but needs sentence support when explaining reasons. Demonstrates friendly interaction in partner dialogues.") : "Speaking rubric highlights good enthusiasm; encourage full sentence answers.",
        actionablePriorities: [
          "Priority 1: Conduct 10-minute listening warm-ups focusing on numbers, times, and prepositions using audio prompts.",
          "Priority 2: Provide speaking sentence-frames ('I like ___ because it is ___') during daily warm-up circles.",
          "Priority 3: Reinforce present simple 3rd person forms (have/has, do/does) with interactive classroom games."
        ]
      };
    }

    saveClassProgressCheckResults(checkId, resultsArray) {
      if (!this.state.progressCheckSubmissions) this.state.progressCheckSubmissions = [];
      const check = this.getProgressCheck(checkId);
      const updatedSubmissions = [];

      resultsArray.forEach(res => {
        const studentId = res.studentId;
        const student = this.getStudent(studentId);
        const existingIdx = this.state.progressCheckSubmissions.findIndex(
          s => s.progressCheckId === checkId && s.studentId === studentId
        );
        const subId = existingIdx !== -1 ? this.state.progressCheckSubmissions[existingIdx].id : ("sub-" + studentId + "-" + checkId);

        const skillScores = {};
        const fourSkills = ['reading', 'listening', 'writing', 'speaking'];
        let totalRaw = 0;
        let totalMax = 40;

        fourSkills.forEach(skillKey => {
          const s = (res.scores && res.scores[skillKey]) || {};
          let correct = 0;
          let total = 10;

          if (typeof s === 'number') {
            correct = s;
          } else if (s.correct !== undefined) {
            correct = Number(s.correct) || 0;
            total = Number(s.total) || 10;
          } else if (s.score !== undefined) {
            correct = Number(s.score) || 0;
            total = Number(s.total) || 10;
          } else if (res[skillKey] !== undefined) {
            correct = Number(res[skillKey]) || 0;
          }

          correct = Math.max(0, Math.min(total, correct));
          totalRaw += correct;

          const pct = Math.round((correct / total) * 100);
          const teacherRating = (res.teacherAssessment && res.teacherAssessment[skillKey]) ||
            (pct >= 85 ? "Strong" : pct >= 70 ? "Secure" : pct >= 50 ? "Developing" : "Needs Support");

          skillScores[skillKey] = {
            score: pct,
            correct: correct,
            total: total,
            mastery: teacherRating,
            statusText: teacherRating
          };
        });

        const overallPct = Math.round((totalRaw / totalMax) * 100);
        const overallMastery = overallPct >= 85 ? "Strong" : overallPct >= 70 ? "Secure" : overallPct >= 50 ? "Developing" : "Needs Support";

        const derivedBookId = (check && check.bookId) ? check.bookId : ((student && student.grade === 'Grade 4') ? 'book-global-readings-3' : 'book-global-readings-2');
        const derivedBookTitle = (check && check.bookTitle) ? check.bookTitle : ((student && student.grade === 'Grade 4') ? 'Global Readings 3' : 'Global Readings 2');
        const derivedUnitId = (check && check.unitId) ? check.unitId : ((student && student.grade === 'Grade 4') ? 'unit-gr3-1' : 'unit-gr2-1');
        const derivedUnitTitle = (check && check.unitTitle) ? check.unitTitle : ((student && student.grade === 'Grade 4') ? 'Unit 1: I Love Reading' : 'Unit 1: What Does It Do?');

        const subRecord = {
          id: subId,
          progressCheckId: checkId,
          studentId: studentId,
          classId: res.classId || (student ? student.classId : (check ? check.classId : "class-3a")),
          bookId: derivedBookId,
          bookTitle: derivedBookTitle,
          unitId: derivedUnitId,
          unitTitle: derivedUnitTitle,
          date: res.date || new Date().toISOString().split("T")[0],
          displayDate: res.displayDate || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          status: "completed",
          completionPct: 100,
          rawTotal: totalRaw,
          maxRawTotal: totalMax,
          xpEarned: Math.round(totalRaw * 10),
          accuracyPct: overallPct,
          overallScore: overallPct,
          mastery: overallMastery,
          scores: {
            reading: { correct: skillScores.reading.correct, total: 10 },
            listening: { correct: skillScores.listening.correct, total: 10 },
            writing: { correct: skillScores.writing.correct, total: 10 },
            speaking: { correct: skillScores.speaking.correct, total: 10 }
          },
          skillScores: skillScores,
          teacherAssessment: {
            reading: skillScores.reading.mastery,
            listening: skillScores.listening.mastery,
            writing: skillScores.writing.mastery,
            speaking: skillScores.speaking.mastery
          },
          teacherComment: res.notes || res.teacherComment || "",
          notes: res.notes || res.teacherComment || "",
          updatedAt: new Date().toISOString()
        };

        if (existingIdx !== -1) {
          this.state.progressCheckSubmissions[existingIdx] = Object.assign(this.state.progressCheckSubmissions[existingIdx], subRecord);
          updatedSubmissions.push(this.state.progressCheckSubmissions[existingIdx]);
        } else {
          this.state.progressCheckSubmissions.push(subRecord);
          updatedSubmissions.push(subRecord);
        }

        // Create / update LearningEvidence for the four skills
        if (!this.state.learningEvidence) this.state.learningEvidence = [];
        fourSkills.forEach(skillKey => {
          const sData = skillScores[skillKey];
          const evId = "ev-pc-" + studentId + "-" + checkId + "-" + skillKey;
          const existingEvIdx = this.state.learningEvidence.findIndex(
            e => e.studentId === studentId && e.activityId === "progress-check-" + checkId && e.skillId === skillKey
          );

          const evRecord = {
            id: existingEvIdx !== -1 ? this.state.learningEvidence[existingEvIdx].id : evId,
            studentId: studentId,
            activityId: "progress-check-" + checkId,
            sourceId: subId,
            skillId: skillKey,
            rawScore: sData.correct,
            rawMaxScore: sData.total,
            score: sData.score,
            maxScore: 100,
            date: subRecord.date,
            source: "Whole-Class Progress Check",
            activityName: (check ? check.title : "English Adventure Progress Check") + " — " + (skillKey.charAt(0).toUpperCase() + skillKey.slice(1)),
            book: check ? (check.bookTitle || "Global Readings 2") : "Global Readings 2",
            grade: check ? (check.targetGrade === "Grade 4" ? 4 : 3) : 3,
            unit: check ? (check.unitTitle || "Unit 1") : "Unit 1",
            cefr: check ? (check.cefrTarget || "A1") : "A1",
            mastery: sData.mastery,
            teacherAssessment: sData.mastery,
            teacherNote: res.notes || (skillKey + " assessment: " + sData.correct + "/10 (" + sData.mastery + ")"),
            notes: res.notes || ("Unit 1 Progress Check score: " + sData.correct + "/10"),
            archived: false
          };

          if (existingEvIdx !== -1) {
            this.state.learningEvidence[existingEvIdx] = evRecord;
          } else {
            this.state.learningEvidence.push(evRecord);
          }
        });

        // Atomic Assessment XP calculation: XP Earned = totalRaw * 10
        // Strictly prevents duplicate rewards on re-saves, reloads, or cross-device fetches
        const xpEarned = Math.round(totalRaw * 10);
        subRecord.xpEarned = xpEarned;
        const assessmentSourceId = 'pc-assessment-' + checkId + '-' + studentId;
        const legacySourceId = 'pc-reward-' + checkId;

        if (!this.state.xpTransactions) this.state.xpTransactions = [];
        let existingTx = this.state.xpTransactions.find(
          t => t.studentId === studentId && (t.sourceId === assessmentSourceId || t.sourceId === legacySourceId)
        );

        const txReason = 'Four-Skill Assessment: ' + (check ? check.title : 'Progress Check') + ' (' + totalRaw + '/40)';
        const txDate = subRecord.displayDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        if (existingTx) {
          // Update existing transaction in-place (atomic update, zero double-reward)
          existingTx.sourceId = assessmentSourceId;
          existingTx.amount = xpEarned;
          existingTx.points = xpEarned;
          existingTx.xpAmount = xpEarned;
          existingTx.xp = xpEarned;
          existingTx.reason = txReason;
          existingTx.date = txDate;
          existingTx.timestamp = new Date().toISOString();
          existingTx.status = 'active';
        } else if (xpEarned > 0) {
          // First-time grant
          this.giveXP(
            studentId,
            xpEarned,
            txReason,
            'assessment',
            { isPoints: true, category: 'positive', icon: '⭐', sourceId: assessmentSourceId }
          );
        }

        // Update Student Profile
        if (student) {
          student.lastAssessmentDate = subRecord.date;
          student.latestProgressCheck = {
            checkId: checkId,
            title: check ? check.title : "English Adventure Progress Check",
            book: check ? (check.bookTitle || "Global Readings 2") : "Global Readings 2",
            unit: check ? (check.unitTitle || "Unit 1") : "Unit 1",
            overallScore: overallPct,
            rawTotal: totalRaw,
            skillScores: skillScores,
            teacherNote: res.notes || ""
          };
          if (res.notes) {
            student.latestTeacherNote = res.notes.trim();
          }
          student.xp = this.getStudentTotalXP(studentId);
          const mState = this.calculateMonsterState(studentId);
          if (mState) student.level = mState.currentLevel;
        }

        // Add to teacherNotes if provided
        if (res.notes && res.notes.trim()) {
          if (!this.state.teacherNotes) this.state.teacherNotes = [];
          this.state.teacherNotes.unshift({
            id: 'note-pc-' + studentId + '-' + Date.now(),
            studentId: studentId,
            text: res.notes.trim(),
            date: subRecord.displayDate || 'September 2026',
            author: (check && check.author) || 'Teacher',
            source: 'Progress Check'
          });
        }
      });

      this.saveState();
      this.notify('progressCheckSubmissions', this.state.progressCheckSubmissions);
      this.notify('learningEvidence', this.state.learningEvidence);
      this.notify('students', this.state.students);
      this.notify('xp', this.state.xpTransactions);

      // Asynchronously synchronize with shared cloud database across devices
      let cloudPromise = null;
      if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        cloudPromise = window.SchoolCloudSync.saveAssessments(updatedSubmissions).catch(err => {
          console.warn('[SchoolStore] Cloud sync background error:', err);
          return { success: false, error: err.message };
        });
      }

      return { success: true, count: updatedSubmissions.length, cloudPromise: cloudPromise };
    }

    mergeCloudSubmissions(cloudArray) {
      if (!Array.isArray(cloudArray) || cloudArray.length === 0) return { success: true, count: 0 };
      if (!this.state.progressCheckSubmissions) this.state.progressCheckSubmissions = [];
      if (!this.state.xpTransactions) this.state.xpTransactions = [];

      let modified = false;

      cloudArray.forEach(cloudSub => {
        if (!cloudSub || !cloudSub.studentId || !cloudSub.progressCheckId) return;

        const studentId = cloudSub.studentId;
        const checkId = cloudSub.progressCheckId;
        const student = this.getStudent(studentId);
        const check = this.getProgressCheck ? this.getProgressCheck(checkId) : null;

        const existingIdx = this.state.progressCheckSubmissions.findIndex(
          s => s.progressCheckId === checkId && s.studentId === studentId
        );

        const localSub = existingIdx !== -1 ? this.state.progressCheckSubmissions[existingIdx] : null;

        // Content-based comparison ensures cloud state takes precedence regardless of device clock skew
        let needsUpdate = false;
        if (!localSub) {
          needsUpdate = true;
        } else {
          const lScores = localSub.scores || {};
          const cScores = cloudSub.scores || {};
          const lR = (lScores.reading && lScores.reading.correct !== undefined) ? lScores.reading.correct : null;
          const cR = (cScores.reading && cScores.reading.correct !== undefined) ? cScores.reading.correct : null;
          const lL = (lScores.listening && lScores.listening.correct !== undefined) ? lScores.listening.correct : null;
          const cL = (cScores.listening && cScores.listening.correct !== undefined) ? cScores.listening.correct : null;
          const lW = (lScores.writing && lScores.writing.correct !== undefined) ? lScores.writing.correct : null;
          const cW = (cScores.writing && cScores.writing.correct !== undefined) ? cScores.writing.correct : null;
          const lS = (lScores.speaking && lScores.speaking.correct !== undefined) ? lScores.speaking.correct : null;
          const cS = (cScores.speaking && cScores.speaking.correct !== undefined) ? cScores.speaking.correct : null;

          const scoresDiff = (lR !== cR || lL !== cL || lW !== cW || lS !== cS);
          const totalDiff = (localSub.rawTotal !== cloudSub.rawTotal);
          const noteDiff = (localSub.notes || '') !== (cloudSub.notes || cloudSub.teacherComment || '');

          if (scoresDiff || totalDiff || noteDiff) {
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          modified = true;
          const derivedBookId = cloudSub.bookId || (check && check.bookId) || ((student && student.grade === 'Grade 4') ? 'book-global-readings-3' : 'book-global-readings-2');
          const derivedBookTitle = cloudSub.bookTitle || (check && check.bookTitle) || ((student && student.grade === 'Grade 4') ? 'Global Readings 3' : 'Global Readings 2');
          const derivedUnitId = cloudSub.unitId || (check && check.unitId) || ((student && student.grade === 'Grade 4') ? 'unit-gr3-1' : 'unit-gr2-1');
          const derivedUnitTitle = cloudSub.unitTitle || (check && check.unitTitle) || ((student && student.grade === 'Grade 4') ? 'Unit 1: I Love Reading' : 'Unit 1: What Does It Do?');

          cloudSub.bookId = derivedBookId;
          cloudSub.bookTitle = derivedBookTitle;
          cloudSub.unitId = derivedUnitId;
          cloudSub.unitTitle = derivedUnitTitle;

          if (existingIdx !== -1) {
            this.state.progressCheckSubmissions[existingIdx] = Object.assign({}, localSub, cloudSub);
          } else {
            this.state.progressCheckSubmissions.push(cloudSub);
          }

          const rawTotal = (cloudSub.rawTotal !== undefined) ? cloudSub.rawTotal : (
            ((cloudSub.scores && cloudSub.scores.reading && cloudSub.scores.reading.correct) || 0) +
            ((cloudSub.scores && cloudSub.scores.listening && cloudSub.scores.listening.correct) || 0) +
            ((cloudSub.scores && cloudSub.scores.writing && cloudSub.scores.writing.correct) || 0) +
            ((cloudSub.scores && cloudSub.scores.speaking && cloudSub.scores.speaking.correct) || 0)
          );
          const xpEarned = Math.round(rawTotal * 10);
          const assessmentSourceId = 'pc-assessment-' + checkId + '-' + studentId;
          const legacySourceId = 'pc-reward-' + checkId;

          let existingTx = this.state.xpTransactions.find(
            t => t.studentId === studentId && (t.sourceId === assessmentSourceId || t.sourceId === legacySourceId)
          );

          const txReason = 'Four-Skill Assessment: ' + (check ? check.title : 'Progress Check') + ' (' + rawTotal + '/40)';
          const txDate = cloudSub.displayDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          if (existingTx) {
            existingTx.sourceId = assessmentSourceId;
            existingTx.amount = xpEarned;
            existingTx.points = xpEarned;
            existingTx.xpAmount = xpEarned;
            existingTx.xp = xpEarned;
            existingTx.reason = txReason;
            existingTx.date = txDate;
            existingTx.status = 'active';
          } else if (xpEarned > 0) {
            this.state.xpTransactions.push({
              id: 'xp-cloud-' + studentId + '-' + checkId,
              studentId: studentId,
              amount: xpEarned,
              points: xpEarned,
              xpAmount: xpEarned,
              xp: xpEarned,
              reason: txReason,
              category: 'positive',
              icon: '⭐',
              date: txDate,
              timestamp: cloudSub.updatedAt || new Date().toISOString(),
              source: 'assessment',
              sourceId: assessmentSourceId,
              classId: cloudSub.classId || (student ? student.classId : null),
              status: 'active'
            });
          }

          if (student) {
            student.lastAssessmentDate = cloudSub.date;
            student.latestProgressCheck = {
              checkId: checkId,
              title: check ? check.title : "English Adventure Progress Check",
              book: derivedBookTitle,
              unit: derivedUnitTitle,
              overallScore: cloudSub.overallScore || cloudSub.accuracyPct || 0,
              rawTotal: rawTotal,
              skillScores: cloudSub.skillScores || {},
              teacherNote: cloudSub.notes || cloudSub.teacherComment || ""
            };
            if (cloudSub.notes && cloudSub.notes.trim()) {
              student.latestTeacherNote = cloudSub.notes.trim();
            }
            student.xp = this.getStudentTotalXP(studentId);
            const mState = this.calculateMonsterState(studentId);
            if (mState) student.level = mState.currentLevel;
          }
        }
      });

      if (modified) {
        this.saveState();
        this.notify('progressCheckSubmissions', this.state.progressCheckSubmissions);
        this.notify('xp', this.state.xpTransactions);
        this.notify('students', this.state.students);
      }

      return { success: true, count: cloudArray.length, modified: modified };
    }

    /**
     * Complete two-way sync: Merges all cloud collections into store state
     * (Teacher Notes, Assessments, Student Overrides, XP Ledger, Attendance)
     */
    mergeCloudState(cloudData) {
      if (!cloudData || typeof cloudData !== 'object') return { success: false };

      let modified = false;

      // -1. Merge Classes Roster
      if (Array.isArray(cloudData.classes) && cloudData.classes.length > 0) {
        if (!this.state.classes) this.state.classes = [];
        cloudData.classes.forEach(remoteClass => {
          if (!remoteClass || !remoteClass.id) return;
          const localIdx = this.state.classes.findIndex(c => c.id === remoteClass.id);
          if (localIdx !== -1) {
            this.state.classes[localIdx] = Object.assign({}, this.state.classes[localIdx], remoteClass);
          } else {
            this.state.classes.push(remoteClass);
          }
          modified = true;
        });
      }

      // 0. Merge Complete Students Roster (Authoritative Supabase Cloud Roster)
      if (Array.isArray(cloudData.students) && cloudData.students.length > 0) {
        if (!this.state.students) this.state.students = [];
        const remoteMap = new Map();

        cloudData.students.forEach(remoteStudent => {
          if (!remoteStudent || !remoteStudent.id) return;
          remoteMap.set(remoteStudent.id, remoteStudent);

          const localIdx = this.state.students.findIndex(s => s.id === remoteStudent.id);
          if (localIdx !== -1) {
            const local = this.state.students[localIdx];
            // Supabase is authoritative source of truth: merge remote attributes
            this.state.students[localIdx] = Object.assign({}, local, remoteStudent);
            if (remoteStudent.monsterProfile && this.state.monsterProfiles) {
              this.state.monsterProfiles[remoteStudent.id] = Object.assign(
                {},
                this.state.monsterProfiles[remoteStudent.id] || {},
                remoteStudent.monsterProfile
              );
            }
            modified = true;
          } else {
            // Student added on another device: ingest into local state
            this.state.students.push(remoteStudent);
            if (remoteStudent.monsterProfile && this.state.monsterProfiles) {
              this.state.monsterProfiles[remoteStudent.id] = remoteStudent.monsterProfile;
            }
            modified = true;
          }
        });

        // If authoritative cloud list, prune students that were deleted on another device
        if (cloudData.isAuthoritativeList && remoteMap.size > 0) {
          const beforeCount = this.state.students.length;
          this.state.students = this.state.students.filter(s => remoteMap.has(s.id));
          if (this.state.students.length !== beforeCount) {
            modified = true;
          }
        }
      }

      // 1. Merge Teacher Notes (Single source of truth)
      if (Array.isArray(cloudData.teacherNotes)) {
        if (!this.state.teacherNotes) this.state.teacherNotes = [];
        cloudData.teacherNotes.forEach(remoteNote => {
          if (!remoteNote || !remoteNote.id) return;
          const localIdx = this.state.teacherNotes.findIndex(n => n.id === remoteNote.id);
          if (localIdx !== -1) {
            const local = this.state.teacherNotes[localIdx];
            if (local.text !== remoteNote.text || local.date !== remoteNote.date) {
              this.state.teacherNotes[localIdx] = Object.assign({}, local, remoteNote);
              modified = true;
            }
          } else {
            this.state.teacherNotes.push(remoteNote);
            modified = true;
          }
        });

        // Ensure teacher notes are ordered chronologically newest first
        this.state.teacherNotes.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.date || 0).getTime();
          const timeB = new Date(b.updatedAt || b.date || 0).getTime();
          return timeB - timeA;
        });

        // Automatically sync each student's latestTeacherNote to their newest note
        this.state.teacherNotes.forEach(n => {
          const s = this.getStudent(n.studentId);
          if (s && !s._noteSynced) {
            s.latestTeacherNote = n.text;
            s._noteSynced = true;
          }
          if (this.state.progressCheckSubmissions) {
            this.state.progressCheckSubmissions.forEach(sub => {
              if (sub.studentId === n.studentId && (n.source === 'Progress Check' || !sub.notes)) {
                sub.notes = n.text;
                sub.teacherComment = n.text;
              }
            });
          }
        });
        if (this.state.students) {
          this.state.students.forEach(s => { delete s._noteSynced; });
        }
      }

      // 2. Merge Four-Skill Assessment Submissions
      if (cloudData.progressCheckSubmissions && typeof cloudData.progressCheckSubmissions === 'object') {
        const subsArray = Array.isArray(cloudData.progressCheckSubmissions)
          ? cloudData.progressCheckSubmissions
          : Object.values(cloudData.progressCheckSubmissions);
        if (subsArray.length > 0) {
          const subRes = this.mergeCloudSubmissions(subsArray);
          if (subRes && subRes.modified) modified = true;
        }
      }

      // 3. Merge Student Profile Overrides
      if (cloudData.studentOverrides && typeof cloudData.studentOverrides === 'object') {
        Object.keys(cloudData.studentOverrides).forEach(sId => {
          const s = this.getStudent(sId);
          if (s) {
            const overrides = cloudData.studentOverrides[sId];
            if (overrides.latestTeacherNote) s.latestTeacherNote = overrides.latestTeacherNote;
            if (overrides.manualCefrOverrides) s.manualCefrOverrides = Object.assign({}, s.manualCefrOverrides || {}, overrides.manualCefrOverrides);
            modified = true;
          }
        });
      }

      // 4. Merge XP Transactions
      if (Array.isArray(cloudData.xpTransactions)) {
        if (!this.state.xpTransactions) this.state.xpTransactions = [];
        cloudData.xpTransactions.forEach(tx => {
          if (!tx || !tx.id) return;
          const exists = this.state.xpTransactions.some(t => t.id === tx.id);
          if (!exists) {
            this.state.xpTransactions.push(tx);
            modified = true;
          }
        });
      }

      // 5. Merge Attendance Records
      if (Array.isArray(cloudData.attendanceRecords)) {
        if (!this.state.attendanceRecords) this.state.attendanceRecords = [];
        cloudData.attendanceRecords.forEach(rec => {
          if (!rec || !rec.id) return;
          const idx = this.state.attendanceRecords.findIndex(r => r.id === rec.id);
          if (idx !== -1) {
            this.state.attendanceRecords[idx] = Object.assign({}, this.state.attendanceRecords[idx], rec);
          } else {
            this.state.attendanceRecords.push(rec);
          }
          modified = true;
        });
      }

      if (modified) {
        this.saveState();
        this.notify('teacherNotes', this.state.teacherNotes);
        this.notify('progressCheckSubmissions', this.state.progressCheckSubmissions);
        this.notify('students', this.state.students);
        this.notify('xp', this.state.xpTransactions);
        this.notify('attendance', this.state.attendanceRecords);
      }

      return { success: true, modified };
    }

    deleteProgressCheckSubmission(studentId, checkId) {
      if (!this.state.progressCheckSubmissions) return false;
      const idx = this.state.progressCheckSubmissions.findIndex(
        s => s.studentId === studentId && s.progressCheckId === checkId
      );
      if (idx !== -1) {
        this.state.progressCheckSubmissions.splice(idx, 1);
      }

      const assessmentSourceId = 'pc-assessment-' + checkId + '-' + studentId;
      const legacySourceId = 'pc-reward-' + checkId;
      if (this.state.xpTransactions) {
        this.state.xpTransactions.forEach(t => {
          if (t.studentId === studentId && (t.sourceId === assessmentSourceId || t.sourceId === legacySourceId)) {
            t.status = 'voided';
          }
        });
      }

      const student = this.getStudent(studentId);
      if (student) {
        student.xp = this.getStudentTotalXP(studentId);
        const mState = this.calculateMonsterState(studentId);
        if (mState) student.level = mState.currentLevel;
      }

      this.saveState();
      this.notify('progressCheckSubmissions', this.state.progressCheckSubmissions);
      this.notify('xp', this.state.xpTransactions);
      this.notify('students', this.state.students);

      if (typeof window !== 'undefined' && window.SchoolCloudSync) {
        window.SchoolCloudSync.deleteAssessment(studentId, checkId).catch(err => {
          console.warn('[SchoolStore] Cloud delete warning:', err);
        });
      }

      return true;
    }

    compareProgressChecks(checkId1 = "progress-check-a1", checkId2 = "progress-check-u2", classId = "class-3a") {
      const check1 = this.getProgressCheck(checkId1);
      const check2 = this.getProgressCheck(checkId2);
      const subs1 = this.getProgressCheckSubmissions(checkId1).filter(s => !classId || s.classId === classId);
      const subs2 = this.getProgressCheckSubmissions(checkId2).filter(s => !classId || s.classId === classId);

      const skills = ["reading", "vocabulary", "grammar", "writing", "listening", "speaking"];
      const avg1 = {};
      const avg2 = {};
      const deltas = {};

      skills.forEach(k => {
        const vals1 = subs1.map(s => s.skillScores && s.skillScores[k] ? s.skillScores[k].score : null).filter(v => typeof v === "number");
        const vals2 = subs2.map(s => s.skillScores && s.skillScores[k] ? s.skillScores[k].score : null).filter(v => typeof v === "number");
        avg1[k] = vals1.length ? Math.round(vals1.reduce((a, b) => a + b, 0) / vals1.length) : 0;
        avg2[k] = vals2.length ? Math.round(vals2.reduce((a, b) => a + b, 0) / vals2.length) : 0;
        deltas[k] = avg2[k] - avg1[k];
      });

      return {
        check1: { id: checkId1, title: check1 ? check1.title : "Unit 1 Progress Check", averages: avg1 },
        check2: { id: checkId2, title: check2 ? check2.title : "Unit 2 Progress Check", averages: avg2 },
        deltas: deltas,
        topImprovement: Object.keys(deltas).reduce((a, b) => deltas[a] > deltas[b] ? a : b, "reading")
      };
    }

    generateClassReportData(checkId = "progress-check-a1") {
      const check = this.getProgressCheck(checkId) || (this.state.progressChecks && this.state.progressChecks[0]);
      const analytics = this.getClassProgressCheckAnalytics(check ? check.id : "progress-check-a1", check ? check.classId : "class-3a");
      const cls = this.getClass(check ? check.classId : "class-3a");

      return {
        schoolName: (this.state.schoolSettings && this.state.schoolSettings.schoolName) || "English Adventure Academy",
        className: cls ? cls.name : "Grade 3A — The Explorers",
        curriculum: check ? (check.bookTitle || "Global Readings 2") : "Global Readings 2",
        unit: check ? (check.unitTitle || "Unit 1: What Does It Do?") : "Unit 1: What Does It Do?",
        period: check ? (check.unitDuration || "4 weeks") : "4 weeks",
        assessmentDate: check ? (check.createdDate || "September 2026") : "September 2026",
        classAverages: analytics.classAverages,
        strengths: [
          "Reading Comprehension (84% Class Average) — Strong ability to identify key facts and characters in familiar passages.",
          "Vocabulary Acquisition (78% Class Average) — High visual recognition and everyday naming accuracy."
        ],
        areasForDevelopment: [
          "Writing Sentences (68% Class Average) — Need targeted practice combining nouns, adjectives, and verbs into full sentences.",
          "Speaking Production (Developing) — Students require more structured communicative sentence frames.",
          "Grammar Agreements (71% Class Average) — Focus on 3rd person singular verb forms (have/has, eat/eats)."
        ],
        teacherObservations: "Overall, Grade 3A demonstrated strong engagement during the classroom smartboard activities and completed the standardized paper worksheet with diligence. Reading comprehension is a notable strength. Writing and speaking will be reinforced during Unit 2 morning routines.",
        recommendedNextSteps: [
          "Incorporate daily 5-minute oral sentence frames ('I can see ___ because ___').",
          "Assign Fire Station Adventure listening drills from the game library.",
          "Reinforce 3rd person singular verb forms (has/have, does/do) using My Neighbourhood game."
        ],
        students: analytics.submissions
      };
    }

    generateStudentReportData(checkId, studentId) {
      const check = this.getProgressCheck(checkId) || (this.state.progressChecks && this.state.progressChecks[0]);
      const sub = this.state.progressCheckSubmissions && this.state.progressCheckSubmissions.find(
        s => s.progressCheckId === (check ? check.id : checkId) && s.studentId === studentId
      );
      const student = this.getStudent(studentId);
      const cls = student ? this.getClass(student.classId) : null;

      const defaultSkillScores = {
        vocabulary: { score: 0, mastery: "Unassessed" },
        reading: { score: 0, mastery: "Unassessed" },
        grammar: { score: 0, mastery: "Unassessed" },
        writing: { score: 0, mastery: "Unassessed" },
        listening: { score: 0, mastery: "Unassessed" },
        speaking: { score: 0, mastery: "Unassessed" }
      };
      const skillScores = (sub && sub.skillScores) || defaultSkillScores;

      return {
        studentName: student ? (student.firstName + " " + student.lastName) : "Student",
        grade: student ? (student.grade || (cls ? cls.grade : "Grade 3")) : "Grade 3",
        className: cls ? cls.name : "Grade 3A — The Explorers",
        bookTitle: check ? (check.bookTitle || "Global Readings 2") : "Global Readings 2",
        unitTitle: check ? (check.unitTitle || "Unit 1: What Does It Do?") : "Unit 1: What Does It Do?",
        unitDuration: (check && check.unitDuration) || "4 weeks",
        assessmentDate: (sub && sub.displayDate) || "Not yet assessed",
        skillScores: skillScores,
        overallScore: (sub && sub.overallScore !== undefined) ? sub.overallScore : 0,
        mastery: (sub && sub.mastery) || "Unassessed",
        strengths: sub ? "Reading comprehension, vocabulary recognition, enthusiastic participation in classroom activities." : "No assessment data yet recorded.",
        needsSupport: sub ? "Written sentence formation, independent oral production without prompts." : "None yet recorded.",
        teacherNote: (sub && sub.teacherComment) || (student && student.latestTeacherNote) || "No teacher assessment notes yet recorded."
      };
    }

  }

  // Export singleton instance
  const schoolStore = new MasterSchoolStore();
  schoolStore.awardBadge = schoolStore.awardBadgeToStudent.bind(schoolStore);
  schoolStore.addGame = schoolStore.addResource.bind(schoolStore);
  schoolStore.updateGame = schoolStore.updateResource.bind(schoolStore);
  schoolStore.archiveGame = schoolStore.archiveResource.bind(schoolStore);
  schoolStore.deleteGame = schoolStore.deleteResource.bind(schoolStore);

  if (typeof window !== 'undefined') {
    window.SchoolStore = MasterSchoolStore;
    window.schoolStore = schoolStore;
    window.store = schoolStore;
    window.GLOBAL_READINGS_2_PAGES = GLOBAL_READINGS_2_PAGES;
    window.GLOBAL_READINGS_2_DATA = GLOBAL_READINGS_2_DATA;
    window.GLOBAL_READINGS_3_PAGES = GLOBAL_READINGS_3_PAGES;
    window.GLOBAL_READINGS_3_DATA = GLOBAL_READINGS_3_DATA;

    // Initialize continuous background cloud sync & cross-device auto-sync
    if (window.SchoolCloudSync) {
      window.SchoolCloudSync.setupAutoSync(schoolStore);
    }
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterSchoolStore, SchoolStore: MasterSchoolStore, schoolStore, GLOBAL_READINGS_2_PAGES, GLOBAL_READINGS_2_DATA, GLOBAL_READINGS_3_PAGES, GLOBAL_READINGS_3_DATA };
  }

})(typeof window !== 'undefined' ? window : global);
