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

  const STORAGE_KEY = 'eaa_master_school_v3';

  // Canonical list of 15 audited games
  const CANONICAL_GAMES = [
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
        archived: false
      },
      {
        id: 'unit-gr2-1',
        bookId: 'book-global-readings-2',
        title: 'Unit 1: What Does It Do?',
        order: 1,
        pages: '8–23',
        reading1: 'The After-School Inventor (Story, cl- blend)',
        reading2: 'My Good Ideas Book (Instructional Text)',
        readingSkill: 'Identifying a Sequence of Events',
        contentArea: 'Science: Technology',
        selFocus: 'Self-Awareness (strengths & limitations)',
        keyConcept: 'Why do people invent things?',
        targetVocab: ['invent', 'try again', 'change', 'mirror', 'mess', 'invention', 'machine', 'problem', 'solution', 'hexagon', 'improve', 'parachute', 'plan', 'eraser', 'tidy'],
        archived: false
      },
      {
        id: 'unit-gr2-2',
        bookId: 'book-global-readings-2',
        title: 'Unit 2: Thank You',
        order: 2,
        pages: '24–39',
        reading1: "Chuseok: Korea's Harvest Festival",
        reading2: 'First Harvest (-st blend)',
        readingSkill: 'Understanding Setting',
        contentArea: 'Social Studies: Communities',
        selFocus: 'Identify triggers',
        keyConcept: 'Why do we celebrate harvests?',
        targetVocab: ['harvest', 'festival', 'celebrate', 'tradition', 'feast', 'gratitude', 'first', 'crops'],
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
        archived: false
      },
      {
        id: 'unit-gr2-6',
        bookId: 'book-global-readings-2',
        title: 'Unit 6: Look What I Made',
        order: 6,
        pages: '88–103',
        reading1: 'The Superstar (wh- digraph)',
        reading2: "Visit Gaudí's World",
        readingSkill: 'Fact & Opinion',
        contentArea: 'Science: Architecture',
        selFocus: 'Work towards goals',
        keyConcept: 'Why do people make things?',
        targetVocab: ['architect', 'mosaic', 'structure', 'cathedral', 'design', 'artist', 'build'],
        archived: false
      },
      {
        id: 'unit-gr2-7',
        bookId: 'book-global-readings-2',
        title: "Unit 7: We're a Team",
        order: 7,
        pages: '104–119',
        reading1: 'Great Teamwork',
        reading2: "It's Mine (-ck blend)",
        readingSkill: 'Predicting Endings',
        contentArea: 'Science: Symbiotic Relationships',
        selFocus: 'Cooperative learning',
        keyConcept: 'What is good about teamwork?',
        targetVocab: ['teamwork', 'partner', 'ocean', 'symbiosis', 'together', 'help', 'cooperate'],
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
    'student-emma': {
      studentId: 'student-emma',
      petName: 'Skywing',
      baseColor: 'blue',
      equipped: {
        body: 'body-blue',
        eyes: 'eyes-sparkle',
        mouth: 'mouth-smile',
        horns: 'horns-curved',
        wings: 'wings-starter',
        tail: 'tail-perky',
        hat: 'hat-explorer',
        glasses: 'none',
        backpack: 'bp-explorer',
        accessory: 'acc-microphone',
        aura: 'aura-sparkle',
        background: 'bg-meadow'
      },
      unlockedItems: ['body-blue', 'hat-explorer', 'bp-explorer', 'acc-microphone', 'aura-sparkle'],
      hatchDate: '2026-09-02T10:00:00Z',
      evolutionHistory: [
        { id: 'ev-1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Received the Mystery Egg upon entering Academy.' },
        { id: 'ev-2', date: 'Sep 2, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Crossed 250 XP milestone with Monster Day vocabulary.' },
        { id: 'ev-3', date: 'Sep 4, 2026', type: 'evolve', title: 'Evolved to Growing Monster', detail: 'Crossed 500 XP milestone with body parts mastery.' },
        { id: 'ev-4', date: 'Sep 7, 2026', type: 'evolve', title: 'Evolved to Adventurer Monster!', detail: 'Crossed 1,000 XP threshold! Unlocked Explorer Fedora & Satchel.' },
        { id: 'ev-5', date: 'Sep 9, 2026', type: 'unlock', title: 'Unlocked Golden Microphone', detail: 'Awarded for exceptional classroom speaking participation.' }
      ]
    },
    'student-lucas': {
      studentId: 'student-lucas',
      petName: 'Blaze',
      baseColor: 'orange',
      equipped: {
        body: 'body-orange',
        eyes: 'eyes-happy',
        mouth: 'mouth-toothy',
        horns: 'horns-nub',
        wings: 'wings-starter',
        tail: 'tail-perky',
        hat: 'none',
        glasses: 'glasses-round',
        backpack: 'none',
        accessory: 'none',
        aura: 'none',
        background: 'bg-meadow'
      },
      unlockedItems: ['body-orange', 'glasses-round', 'horns-nub'],
      hatchDate: '2026-09-03T11:00:00Z',
      evolutionHistory: [
        { id: 'ev-l1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Mystery Egg registered.' },
        { id: 'ev-l2', date: 'Sep 3, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Reached 250 XP.' },
        { id: 'ev-l3', date: 'Sep 6, 2026', type: 'evolve', title: 'Evolved to Growing Monster', detail: 'Reached 500 XP with teamwork.' }
      ]
    },
    'student-sofia': {
      studentId: 'student-sofia',
      petName: 'Rosie',
      baseColor: 'pink',
      equipped: {
        body: 'body-pink',
        eyes: 'eyes-sparkle',
        mouth: 'mouth-cheer',
        horns: 'horns-ears',
        wings: 'wings-starter',
        tail: 'tail-puff',
        hat: 'none',
        glasses: 'none',
        backpack: 'bp-book',
        accessory: 'acc-book',
        aura: 'aura-sparkle',
        background: 'bg-meadow'
      },
      unlockedItems: ['body-pink', 'bp-book', 'acc-book', 'aura-sparkle'],
      hatchDate: '2026-09-02T14:00:00Z',
      evolutionHistory: [
        { id: 'ev-s1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Mystery Egg registered.' },
        { id: 'ev-s2', date: 'Sep 2, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Reached 250 XP.' },
        { id: 'ev-s3', date: 'Sep 5, 2026', type: 'evolve', title: 'Evolved to Growing Monster', detail: 'Reached 500 XP.' }
      ]
    },
    'student-noah': {
      studentId: 'student-noah',
      petName: 'Fern',
      baseColor: 'green',
      equipped: {
        body: 'body-green',
        eyes: 'eyes-wink',
        mouth: 'mouth-smile',
        horns: 'horns-ears',
        wings: 'none',
        tail: 'tail-puff',
        hat: 'hat-scholar',
        glasses: 'none',
        backpack: 'none',
        accessory: 'none',
        aura: 'none',
        background: 'bg-meadow'
      },
      unlockedItems: ['body-green', 'hat-scholar'],
      hatchDate: '2026-09-03T16:00:00Z',
      evolutionHistory: [
        { id: 'ev-n1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Mystery Egg registered.' },
        { id: 'ev-n2', date: 'Sep 3, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Reached 250 XP.' },
        { id: 'ev-n3', date: 'Sep 7, 2026', type: 'evolve', title: 'Evolved to Growing Monster', detail: 'Reached 500 XP.' }
      ]
    },
    'student-maya': {
      studentId: 'student-maya',
      petName: 'Starlight',
      baseColor: 'purple',
      equipped: {
        body: 'body-purple',
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
      unlockedItems: ['body-purple'],
      hatchDate: '2026-09-03T15:00:00Z',
      evolutionHistory: [
        { id: 'ev-m1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Mystery Egg registered.' },
        { id: 'ev-m2', date: 'Sep 3, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Reached 250 XP.' },
        { id: 'ev-m3', date: 'Sep 6, 2026', type: 'evolve', title: 'Evolved to Growing Monster', detail: 'Reached 500 XP.' }
      ]
    },
    'student-oliver': {
      studentId: 'student-oliver',
      petName: 'Nugget',
      baseColor: 'gold',
      equipped: {
        body: 'body-gold',
        eyes: 'eyes-happy',
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
      unlockedItems: ['body-gold'],
      hatchDate: '2026-09-04T12:00:00Z',
      evolutionHistory: [
        { id: 'ev-o1', date: 'Sep 1, 2026', type: 'egg', title: 'Egg Received', detail: 'Mystery Egg registered.' },
        { id: 'ev-o2', date: 'Sep 4, 2026', type: 'hatch', title: 'Hatched into Baby Monster!', detail: 'Reached 250 XP.' }
      ]
    }
  };
  // Initial Seed Data
  function getInitialState() {
    return {
      currentRole: 'teacher',
      activeClassId: 'class-3a',
      activeStudentId: 'student-emma',

      // 1. Classes
      classes: [
        {
          id: 'class-3a',
          name: 'Grade 3A — The Explorers',
          grade: 'Grade 3',
          academicYear: '2026–2027',
          cefrTarget: 'A1',
          room: 'Room 204',
          schedule: 'Mon, Wed · 10:00 – 10:45',
          description: 'Primary cohort focusing on conversational confidence, story listening, and foundational grammar.',
          archived: false
        },
        {
          id: 'class-4b',
          name: 'Grade 4B — The Adventurers',
          grade: 'Grade 4',
          academicYear: '2026–2027',
          cefrTarget: 'A2',
          room: 'Room 302',
          schedule: 'Tue, Thu · 13:30 – 14:15',
          description: 'Upper elementary class mastering past tenses, modal verbs, and structured roleplays.',
          archived: false
        }
      ],

      // 2. Students
      students: [
        {
          id: 'student-emma',
          studentIdNumber: 'EAA-2026-001',
          firstName: 'Emma',
          lastName: 'Chen',
          classId: 'class-3a',
          age: 8,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'badge' },
          parentName: 'Mr. Peter Chen',
          parentContact: '+1 (555) 342-9811',
          parentEmail: 'peter.chen@example.com',
          streakDays: 5,
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-lucas',
          studentIdNumber: 'EAA-2026-002',
          firstName: 'Lucas',
          lastName: 'Silva',
          classId: 'class-3a',
          age: 8,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Maria Silva',
          parentContact: '+1 (555) 782-1204',
          parentEmail: 'maria.silva@example.com',
          streakDays: 3,
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-sofia',
          studentIdNumber: 'EAA-2026-003',
          firstName: 'Sofia',
          lastName: 'Martinez',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'A1+',
          avatar: { hair: 'girl', outfit: 'scout', accessory: 'star' },
          parentName: 'Carlos Martinez',
          parentContact: '+1 (555) 671-3329',
          parentEmail: 'carlos.m@example.com',
          streakDays: 7,
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-noah',
          studentIdNumber: 'EAA-2026-004',
          firstName: 'Noah',
          lastName: 'Kim',
          classId: 'class-3a',
          age: 8,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'boy', outfit: 'scout', accessory: 'none' },
          parentName: 'Hannah Kim',
          parentContact: '+1 (555) 441-9022',
          parentEmail: 'hannah.kim@example.com',
          streakDays: 2,
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-maya',
          studentIdNumber: 'EAA-2026-005',
          firstName: 'Maya',
          lastName: 'Patel',
          classId: 'class-3a',
          age: 8,
          grade: 'Grade 3',
          overallCefr: 'A1',
          avatar: { hair: 'girl', outfit: 'explorer', accessory: 'none' },
          parentName: 'Dev Patel',
          parentContact: '+1 (555) 912-4481',
          parentEmail: 'dev.patel@example.com',
          streakDays: 4,
          archived: false,
          manualCefrOverrides: {}
        },
        {
          id: 'student-oliver',
          studentIdNumber: 'EAA-2026-006',
          firstName: 'Oliver',
          lastName: 'Brown',
          classId: 'class-3a',
          age: 9,
          grade: 'Grade 3',
          overallCefr: 'Pre-A1',
          avatar: { hair: 'boy', outfit: 'explorer', accessory: 'none' },
          parentName: 'Sarah Brown',
          parentContact: '+1 (555) 553-2911',
          parentEmail: 'sarah.brown@example.com',
          streakDays: 1,
          archived: false,
          manualCefrOverrides: {}
        }
      ],

      // 3. Resources (Games & Lessons)
      resources: CANONICAL_GAMES.concat([GLOBAL_READINGS_2_DATA.resource]),

      // 4. Curriculum Hierarchy
      curriculum: {
        books: [
          GLOBAL_READINGS_2_DATA.book,
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
          id: 'asg-1',
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
          id: 'asg-2',
          title: 'At the Restaurant Polite Dialogue',
          classId: 'class-3a',
          activityId: 'restaurant',
          studentIds: 'all',
          dueDate: 'Sep 22, 2026',
          instructions: 'Complete 3 customer roleplay rounds ordering healthy drinks and main meals.',
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
      assessments: [
        {
          id: 'ass-1',
          title: 'Term 1 Mid-Term Rubric Evaluation',
          studentId: 'student-emma',
          classId: 'class-3a',
          date: 'Sep 10, 2026',
          rubricScores: {
            speaking: 80,
            vocabulary: 85,
            grammar: 70,
            listening: 85,
            reading: 75,
            writing: 65,
            pronunciation: 80
          },
          teacherComment: 'Emma demonstrates wonderful communicative confidence and enthusiasm in roleplay.',
          archived: false
        }
      ],

      // 9. Real Attendance Records
      attendanceRecords: [
        { id: 'att-1', studentId: 'student-emma', classId: 'class-3a', date: '2026-09-01', status: 'Present' },
        { id: 'att-2', studentId: 'student-emma', classId: 'class-3a', date: '2026-09-03', status: 'Present' },
        { id: 'att-3', studentId: 'student-emma', classId: 'class-3a', date: '2026-09-08', status: 'Present' },
        { id: 'att-4', studentId: 'student-emma', classId: 'class-3a', date: '2026-09-10', status: 'Present' },
        { id: 'att-5', studentId: 'student-lucas', classId: 'class-3a', date: '2026-09-01', status: 'Present' },
        { id: 'att-6', studentId: 'student-lucas', classId: 'class-3a', date: '2026-09-03', status: 'Late' },
        { id: 'att-7', studentId: 'student-lucas', classId: 'class-3a', date: '2026-09-08', status: 'Present' },
        { id: 'att-8', studentId: 'student-lucas', classId: 'class-3a', date: '2026-09-10', status: 'Present' }
      ],

      // 10. Transaction-based XP Ledger
      xpTransactions: [
        { id: 'xp-1', studentId: 'student-emma', amount: 500, reason: 'Completed Initial Explorer Orientation', category: 'positive', icon: '⭐', date: 'Sep 1, 2026', timestamp: '2026-09-01T09:00:00Z', createdBy: 'System', source: 'System', status: 'active' },
        { id: 'xp-2', studentId: 'student-emma', amount: 350, reason: 'Mastered Body Parts in Monster Day', category: 'positive', icon: '🦖', date: 'Sep 4, 2026', timestamp: '2026-09-04T10:30:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-3', studentId: 'student-emma', amount: 250, reason: 'Polite Dialogue in Restaurant Roleplay', category: 'positive', icon: '🍽️', date: 'Sep 7, 2026', timestamp: '2026-09-07T11:15:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-4', studentId: 'student-emma', amount: 140, reason: 'Speaking English in Class', category: 'positive', icon: '🗣️', date: 'Sep 9, 2026', timestamp: '2026-09-09T14:00:00Z', createdBy: 'Ms. Sarah', source: 'Teacher', status: 'active' },
        { id: 'xp-5', studentId: 'student-lucas', amount: 500, reason: 'Completed Initial Explorer Orientation', category: 'positive', icon: '⭐', date: 'Sep 1, 2026', timestamp: '2026-09-01T09:00:00Z', createdBy: 'System', source: 'System', status: 'active' },
        { id: 'xp-6', studentId: 'student-lucas', amount: 320, reason: 'Restaurant Roleplay Completion', category: 'positive', icon: '🍽️', date: 'Sep 6, 2026', timestamp: '2026-09-06T10:45:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-7', studentId: 'student-sofia', amount: 980, reason: 'Treasure Mystery Super Sleuth', category: 'positive', icon: '🗝️', date: 'Sep 8, 2026', timestamp: '2026-09-08T13:20:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-8', studentId: 'student-noah', amount: 620, reason: 'Firefighter Mission Accomplished', category: 'positive', icon: '🚒', date: 'Sep 5, 2026', timestamp: '2026-09-05T11:00:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-9', studentId: 'student-maya', amount: 710, reason: 'Jungle Explorer Mission', category: 'positive', icon: '🌴', date: 'Sep 6, 2026', timestamp: '2026-09-06T14:10:00Z', createdBy: 'System', source: 'Activity', status: 'active' },
        { id: 'xp-10', studentId: 'student-oliver', amount: 450, reason: 'Super Hero Phonics Training', category: 'positive', icon: '🦸', date: 'Sep 3, 2026', timestamp: '2026-09-03T10:00:00Z', createdBy: 'System', source: 'Activity', status: 'active' }
      ],

      // 11. Learning Evidence (Progress Calculation)
      learningEvidence: [
        { id: 'ev-1', studentId: 'student-emma', activityId: 'monster-day', objectiveId: 'obj-1', skillId: 'vocabulary', score: 95, maxScore: 100, date: 'Sep 4, 2026', source: 'Game' },
        { id: 'ev-2', studentId: 'student-emma', activityId: 'monster-day', objectiveId: 'obj-2', skillId: 'grammar', score: 85, maxScore: 100, date: 'Sep 4, 2026', source: 'Game' },
        { id: 'ev-3', studentId: 'student-emma', activityId: 'restaurant', objectiveId: 'obj-4', skillId: 'speaking', score: 80, maxScore: 100, date: 'Sep 7, 2026', source: 'Roleplay' },
        { id: 'ev-4', studentId: 'student-emma', activityId: 'firefighter', objectiveId: 'obj-3', skillId: 'listening', score: 90, maxScore: 100, date: 'Sep 8, 2026', source: 'Game' },
        { id: 'ev-5', studentId: 'student-lucas', activityId: 'restaurant', objectiveId: 'obj-4', skillId: 'speaking', score: 75, maxScore: 100, date: 'Sep 6, 2026', source: 'Roleplay' }
      ],

      // 12. Persistent Private Teacher Notes
      teacherNotes: [
        { id: 'note-1', studentId: 'student-emma', text: 'Emma excels in speaking roleplays when given a character prop. Very supportive of her peers.', date: 'Sep 8, 2026', author: 'Ms. Sarah' },
        { id: 'note-2', studentId: 'student-lucas', text: 'Lucas is improving his pronunciation with phonics warm-ups. Encourage full sentences.', date: 'Sep 7, 2026', author: 'Ms. Sarah' }
      ],

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
          id: 'group-blue',
          classId: 'class-3a',
          name: 'Blue Dolphins',
          color: '#2563eb',
          studentIds: ['student-emma', 'student-lucas', 'student-sophia'],
          createdDate: '2026-09-01'
        },
        {
          id: 'group-green',
          classId: 'class-3a',
          name: 'Green Explorers',
          color: '#10b981',
          studentIds: ['student-liam', 'student-olivia', 'student-noah'],
          createdDate: '2026-09-01'
        }
      ],

      // 14. Portfolios (Student Work & Multimedia Evidence)
      portfolios: [
        {
          id: 'port-1',
          studentId: 'student-emma',
          classId: 'class-3a',
          title: 'Monster Day: Gloop the Friendly Alien',
          category: 'Projects',
          type: 'image',
          date: '2026-09-02',
          preview: '👾',
          notes: 'Emma used 8 body parts and 5 color adjectives accurately during show & tell.'
        },
        {
          id: 'port-2',
          studentId: 'student-emma',
          classId: 'class-3a',
          title: 'Fire Station Radio Call Audio',
          category: 'Speaking',
          type: 'audio',
          date: '2026-09-03',
          preview: '🎙️',
          notes: 'Clear pronunciation of emergency vocabulary and polite request structures.'
        },
        {
          id: 'port-3',
          studentId: 'student-emma',
          classId: 'class-3a',
          title: 'At the Restaurant Menu Worksheet',
          category: 'Worksheets',
          type: 'document',
          date: '2026-09-04',
          preview: '📄',
          notes: 'Scored 10/10 on food categories and dialogue writing.'
        },
        {
          id: 'port-4',
          studentId: 'student-lucas',
          classId: 'class-3a',
          title: 'Prepositions of Place Map Drawing',
          category: 'Projects',
          type: 'image',
          date: '2026-09-03',
          preview: '🗺️',
          notes: 'Drawn neighbourhood layout with accurate labels for between, next to, opposite.'
        }
      ],
      
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
      reports: [
        {
          id: 'rep-1',
          studentId: 'student-emma',
          classId: 'class-3a',
          title: 'Term 1 Mid-Year Progress Report Card',
          reportType: 'CEFR Progress Report',
          date: '2026-09-01',
          term: 'Term 1',
          dataSnapshot: {
            totalXP: 1240,
            attendanceRate: 100,
            overallCefr: 'A1+',
            skills: { speaking: 80, listening: 85, vocabulary: 89, grammar: 75, reading: 80, writing: 70 }
          },
          teacherNotes: 'Emma shows remarkable enthusiasm during interactive speaking games and leads group discussions naturally.',
          archived: false
        }
      ],

      // 20. School & Classroom Global Settings
      schoolSettings: {
        schoolName: 'English Adventure Academy',
        teacherName: 'Ms. Sarah Jenkins',
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
      messages: [
        {
          id: 'msg-th-1',
          studentId: 'student-emma',
          parentName: 'Mr. Peter Chen',
          studentName: 'Emma Chen',
          lastActivity: '10:30 AM',
          threads: [
            { from: 'teacher', text: "Hello Mr. Chen! Emma was brilliant in today's restaurant roleplay and earned +50 XP!", time: '10:15 AM' },
            { from: 'parent', text: 'Thank you Ms. Sarah! She came home excited and was asking for dinner in English.', time: '10:30 AM' }
          ]
        }
      ],

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
        { id: 'skill-help', name: 'Helping others', icon: '🤝', points: 1, category: 'positive', description: 'Assisting classmates with kindness and patience' },
        { id: 'skill-speak', name: 'Speaking English', icon: '🗣️', points: 1, category: 'positive', description: 'Making an effort to use English sentences in class' },
        { id: 'skill-focus', name: 'On task & focused', icon: '🎯', points: 1, category: 'positive', description: 'Staying engaged and completing classroom tasks' },
        { id: 'skill-part', name: 'Participating enthusiastically', icon: '🙋', points: 1, category: 'positive', description: 'Raising hand and actively contributing to discussions' },
        { id: 'skill-team', name: 'Teamwork & collaboration', icon: '🌟', points: 2, category: 'positive', description: 'Working respectfully and productively in group activities' },
        { id: 'skill-ideas', name: 'Creative ideas', icon: '💡', points: 2, category: 'positive', description: 'Sharing original thoughts, stories, and solutions' },
        { id: 'skill-hard', name: 'Hard work & perseverance', icon: '💪', points: 2, category: 'positive', description: 'Overcoming difficult vocabulary or pronunciation hurdles' },
        { id: 'skill-leader', name: 'Adventure leadership', icon: '👑', points: 3, category: 'positive', description: 'Leading class quests, roleplays, or helping coordinate games' },
        { id: 'skill-distract', name: 'Off task / distracted', icon: '💭', points: -1, category: 'needs_work', description: 'Needed reminding to refocus on current exercise' },
        { id: 'skill-interrupt', name: 'Talking out of turn', icon: '🤫', points: -1, category: 'needs_work', description: 'Speaking while others or teacher are presenting' },
        { id: 'skill-unprepared', name: 'Unprepared for lesson', icon: '🎒', points: -1, category: 'needs_work', description: 'Missing required books, worksheets, or materials' }
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
        { id: 'idea-1', classId: 'class-3a', title: 'EAA Science Fair: Alien Planet Descriptions', description: 'Each student invents an exoplanet, draws its landscape, and gives a 2-minute English presentation describing alien flora, fauna, and weather.', category: 'Project', author: 'Ms. Sarah', votes: 14, pinned: true, tags: ['Science', 'Speaking', 'Art'], date: 'Sep 4, 2026' },
        { id: 'idea-2', classId: 'class-3a', title: 'English Puppet Theater Show', description: 'Using paper bag puppets to perform the "Who Stole the Treasure?" mystery for the 2nd grade classes.', category: 'Drama', author: 'Ms. Sarah', votes: 19, pinned: true, tags: ['Roleplay', 'Creativity', 'Teamwork'], date: 'Sep 6, 2026' },
        { id: 'idea-3', classId: 'class-3a', title: 'Treasure Island Illustrated Map', description: 'Students collaborate on a huge butcher paper map with compass directions, obstacles, and prepositions.', category: 'Writing', author: 'Ms. Sarah', votes: 11, pinned: false, tags: ['Writing', 'Geography'], date: 'Sep 8, 2026' },
        { id: 'idea-4', classId: 'class-4b', title: 'Global Pen Pals Exchange', description: 'Writing letters and postcards describing hometown weather, favorite foods, and school life.', category: 'Culture', author: 'Ms. Sarah', votes: 16, pinned: true, tags: ['Culture', 'Writing'], date: 'Sep 7, 2026' }
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
      monsterItems: JSON.parse(JSON.stringify(DEFAULT_MONSTER_ITEMS)),
      monsterProfiles: JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES)),
      studentAwards: [
        { id: 'award-1', studentId: 'student-emma', badgeId: 'badge-1', awardedDate: '2026-09-01', awardedBy: 'Ms. Sarah', notes: 'Reached 1,000 XP milestone with high enthusiasm', archived: false },
        { id: 'award-2', studentId: 'student-emma', badgeId: 'badge-2', awardedDate: '2026-09-03', awardedBy: 'Ms. Sarah', notes: 'Great spoken performance during restaurant roleplay', archived: false },
        { id: 'award-3', studentId: 'student-lucas', badgeId: 'badge-4', awardedDate: '2026-09-02', awardedBy: 'Ms. Sarah', notes: 'Excellent teamwork and helping group members', archived: false }
      ]
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
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            const initial = getInitialState();
            const merged = Object.assign({}, initial, parsed);
            if (!merged.groups) merged.groups = initial.groups || [];
            if (!merged.portfolios) merged.portfolios = initial.portfolios || [];
            if (!merged.worksheets) merged.worksheets = initial.worksheets || [];
            if (!merged.rubrics) merged.rubrics = initial.rubrics || [];
            if (!merged.badges) merged.badges = initial.badges || [];
            if (!merged.achievements) merged.achievements = initial.achievements || [];
            if (!merged.reports) merged.reports = initial.reports || [];
            if (!merged.schoolSettings) merged.schoolSettings = initial.schoolSettings || {};
            if (!merged.calendarEvents) merged.calendarEvents = initial.calendarEvents || [];
            if (!merged.xpSkills || !merged.xpSkills.length) merged.xpSkills = initial.xpSkills || [];
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
              // Ensure default profiles merged for seed students
              for (const sId in DEFAULT_MONSTER_PROFILES) {
                if (!merged.monsterProfiles[sId]) {
                  merged.monsterProfiles[sId] = JSON.parse(JSON.stringify(DEFAULT_MONSTER_PROFILES[sId]));
                }
              }
            }
            if (merged.schoolSettings) {
              if (merged.schoolSettings.monsterEvolutionEnabled === undefined) merged.schoolSettings.monsterEvolutionEnabled = true;
              if (merged.schoolSettings.xpProgressionEnabled === undefined) merged.schoolSettings.xpProgressionEnabled = true;
              if (merged.schoolSettings.achievementRewardsEnabled === undefined) merged.schoolSettings.achievementRewardsEnabled = true;
              if (merged.schoolSettings.worldUnlocksEnabled === undefined) merged.schoolSettings.worldUnlocksEnabled = true;
              if (merged.schoolSettings.streaksEnabled === undefined) merged.schoolSettings.streaksEnabled = true;
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
              if (!merged.resources.some(r => r.id === 'res-global-readings-2')) {
                merged.resources.push(GLOBAL_READINGS_2_DATA.resource);
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

    resetToDefaults() {
      this.state = getInitialState();
      this.saveState();
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
    // 1. STUDENT CRUD & COMPUTED METRICS
    // =========================================================================
    getStudents(classId = null, includeArchived = false) {
      return this.state.students.filter(s => {
        const matchClass = !classId || s.classId === classId;
        const matchArchived = includeArchived || !s.archived;
        return matchClass && matchArchived;
      });
    }

    getStudentsByClass(classId, includeArchived = false) {
      return this.getStudents(classId, includeArchived);
    }

    getStudent(id) {
      return this.state.students.find(s => s.id === id);
    }

    addStudent(data) {
      const studentId = 'student-' + Date.now();
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
        streakDays: 1,
        archived: false,
        manualCefrOverrides: {}
      };

      this.state.students.unshift(newStudent);

      // Initialize student Mystery Egg profile (starts at 0 XP)
      this.getMonsterProfile(studentId);
      this.saveState();
      return newStudent;
    }

    updateStudent(id, updates) {
      const s = this.getStudent(id);
      if (s) {
        Object.assign(s, updates);
        this.saveState();
        return s;
      }
      return null;
    }

    archiveStudent(id) {
      const s = this.getStudent(id);
      if (s) {
        s.archived = true;
        this.saveState();
        return true;
      }
      return false;
    }

    removeStudentFromClass(id) {
      const s = this.getStudent(id);
      if (s) {
        s.classId = null;
        this.saveState();
        return true;
      }
      return false;
    }

    deleteStudent(id) {
      const idx = this.state.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        this.state.students.splice(idx, 1);
        // Also clean up or preserve dependent records
        this.saveState();
        return true;
      }
      return false;
    }

    // =========================================================================
    // TRANSACTION-BASED XP ARCHITECTURE & AUDIT LEDGER
    // =========================================================================
    getStudentTotalXP(studentId) {
      if (!this.state.xpTransactions) return 0;
      // Strictly recalculate from active transactions only
      const txs = this.state.xpTransactions.filter(t => t.studentId === studentId && t.status !== 'voided');
      return txs.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);
    }

    getXPTransactions(studentId, includeVoided = false) {
      if (!this.state.xpTransactions) return [];
      return this.state.xpTransactions
        .filter(t => t.studentId === studentId && (includeVoided || t.status !== 'voided'))
        .slice()
        .reverse();
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
      const category = options.category || (numAmount < 0 ? 'needs_work' : 'positive');
      const tx = {
        id: 'xp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId,
        amount: numAmount,
        reason: reason || (numAmount >= 0 ? 'Positive Classroom Contribution' : 'Needs Focus'),
        category,
        skillId: options.skillId || null,
        icon: options.icon || (numAmount > 0 ? '⭐' : '💭'),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString(),
        createdBy: options.createdBy || source || 'Teacher',
        source: source || 'Teacher',
        status: 'active'
      };

      if (!this.state.xpTransactions) this.state.xpTransactions = [];
      this.state.xpTransactions.push(tx);
      this.saveState();
      this.notify('xp', this.state.xpTransactions);
      return { transaction: tx, student: s, newTotalXP: this.getStudentTotalXP(studentId), reason: tx.reason, amount: numAmount };
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
        activity: activeTxs.filter(t => t.source === 'Activity' || t.source === 'Game').reduce((sum, t) => sum + t.amount, 0)
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
        
        let calculatedScore = 70; // baseline
        if (evidence.length > 0) {
          const totalPct = evidence.reduce((acc, ev) => acc + ((ev.score / (ev.maxScore || 100)) * 100), 0);
          calculatedScore = Math.round(totalPct / evidence.length);
        }

        // Check if teacher manually set assessment
        const lastAssessment = this.state.assessments.find(a => a.studentId === studentId && a.rubricScores && a.rubricScores[skillKey]);
        if (lastAssessment) {
          calculatedScore = Math.round((calculatedScore * 0.4) + (lastAssessment.rubricScores[skillKey] * 0.6));
        }

        // Manual teacher CEFR override
        const overrideCefr = s.manualCefrOverrides && s.manualCefrOverrides[skillKey];
        const cefr = overrideCefr || (calculatedScore >= 85 ? 'A2' : calculatedScore >= 75 ? 'A1+' : calculatedScore >= 60 ? 'A1' : 'Pre-A1');

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

    // Teacher Notes CRUD
    getTeacherNotes(studentId) {
      return this.state.teacherNotes.filter(n => n.studentId === studentId);
    }

    addTeacherNote(studentId, text, author = 'Ms. Sarah') {
      const note = {
        id: 'note-' + Date.now(),
        studentId,
        text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author
      };
      this.state.teacherNotes.unshift(note);
      this.saveState();
      return note;
    }

    updateTeacherNote(noteId, text) {
      const n = this.state.teacherNotes.find(note => note.id === noteId);
      if (n) {
        n.text = text;
        n.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (edited)';
        this.saveState();
        return n;
      }
      return null;
    }

    deleteTeacherNote(noteId) {
      const idx = this.state.teacherNotes.findIndex(n => n.id === noteId);
      if (idx !== -1) {
        this.state.teacherNotes.splice(idx, 1);
        this.saveState();
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
      return this.state.classes.find(c => c.id === id);
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
      return newClass;
    }

    updateClass(id, updates) {
      const c = this.getClass(id);
      if (c) {
        Object.assign(c, updates);
        this.saveState();
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
    }

    setStudentAttendance(studentId, status, date = null) {
      const s = this.getStudent(studentId);
      if (!s) return;
      const d = date || new Date().toISOString().split('T')[0];
      this.recordAttendance([{ studentId, classId: s.classId, date: d, status }]);
    }

    getClassAttendanceRate(classId) {
      const records = this.state.attendanceRecords.filter(r => r.classId === classId);
      if (records.length === 0) return 95; // default fallback
      const presentOrLate = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      return Math.round((presentOrLate / records.length) * 100);
    }

    getStudentAttendanceRate(studentId) {
      const records = this.state.attendanceRecords.filter(r => r.studentId === studentId);
      if (records.length === 0) return 96;
      const presentOrLate = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      return Math.round((presentOrLate / records.length) * 100);
    }

    // =========================================================================
    // 3. CURRICULUM HIERARCHY CRUD
    // =========================================================================
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
        u.archived = true;
        this.saveState();
        return true;
      }
      return false;
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
        l.archived = true;
        this.saveState();
        return true;
      }
      return false;
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
        this.notify();
        return removed;
      }
      return null;
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

    getMonsterProfile(studentId) {
      if (!this.state.monsterProfiles) this.state.monsterProfiles = {};
      if (!this.state.monsterProfiles[studentId]) {
        const student = this.getStudent(studentId);
        const name = student ? student.firstName + "'s Monster" : "My Monster";
        const colors = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
        const colorIdx = studentId ? Math.abs(studentId.charCodeAt(studentId.length - 1)) % colors.length : 0;
        const assignedColor = colors[colorIdx] || 'blue';

        this.state.monsterProfiles[studentId] = {
          studentId: studentId,
          petName: name,
          baseColor: assignedColor,
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
          hatchDate: null,
          evolutionHistory: [
            {
              id: 'ev-init-' + Date.now(),
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              type: 'egg',
              title: 'Mystery Egg Received',
              detail: 'Student entered Academy with a dormant Mystery Egg.'
            }
          ]
        };
        this.saveState();
      }
      return this.state.monsterProfiles[studentId];
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

      let currentLevelObj = levels[0] || { level: 1, name: 'Mystery Egg', stageKey: 'egg', xpRequired: 0 };
      let nextLevelObj = levels[1] || null;

      for (let i = 0; i < levels.length; i++) {
        if (totalXP >= levels[i].xpRequired) {
          currentLevelObj = levels[i];
          nextLevelObj = levels[i + 1] || null;
        } else {
          break;
        }
      }

      const currentLevel = currentLevelObj.level;
      const stageKey = currentLevelObj.stageKey;
      const stageName = currentLevelObj.name;
      const levelXP = currentLevelObj.xpRequired;
      const nextLevelXP = nextLevelObj ? nextLevelObj.xpRequired : levelXP;
      const xpToNext = nextLevelObj ? Math.max(0, nextLevelObj.xpRequired - totalXP) : 0;
      
      let progressPct = 100;
      if (nextLevelObj && nextLevelXP > levelXP) {
        progressPct = Math.min(100, Math.max(0, Math.round(((totalXP - levelXP) / (nextLevelXP - levelXP)) * 100)));
      }

      const isHatched = (currentLevel >= 3);

      let eggCrackPct = 0;
      if (currentLevel === 1) {
        eggCrackPct = Math.min(95, Math.round((totalXP / 100) * 100));
      } else if (currentLevel === 2) {
        eggCrackPct = 100;
      }

      const allItems = this.getMonsterItems();
      const unlockedItemIds = new Set(profile.unlockedItems || []);

      allItems.forEach(item => {
        if (item.unlockType === 'default') {
          unlockedItemIds.add(item.id);
        } else if (item.unlockType === 'level') {
          if (item.unlockRequirement && currentLevel >= (item.unlockRequirement.level || 1)) {
            unlockedItemIds.add(item.id);
          }
        } else if (item.unlockType === 'achievement') {
          if (item.unlockRequirement && this.hasStudentAchievement(studentId, item.unlockRequirement.achievementId)) {
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
        levelXP,
        nextLevelXP,
        xpToNext,
        progressPct,
        isHatched,
        eggCrackPct,
        unlockedItemIds,
        currentLevelObj,
        nextLevelObj,
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

    awardGroupXP(groupId, amount, reason, teacherName = 'Ms. Sarah') {
      const group = this.getGroup(groupId);
      if (!group || !Array.isArray(group.studentIds) || group.studentIds.length === 0) return [];
      const transactions = [];
      group.studentIds.forEach(studentId => {
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
    recordQuickAssessment({ studentId, skill = 'Speaking', objective, rating = 'Developing', comment = '', teacherName = 'Ms. Sarah' }) {
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

    recordQuickEvidence({ classId, activityTitle, scores = [], teacherName = 'Ms. Sarah' }) {
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

    archiveBadge(id) {
      const b = this.getBadge(id);
      if (b) {
        b.archived = true;
        this.saveState();
        this.notify('badges', this.state.badges);
        return true;
      }
      return false;
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
        archived: false
      };
      this.state.achievements.push(ach);
      this.saveState();
      this.notify('achievements', this.state.achievements);
      return ach;
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
        a.archived = true;
        this.saveState();
        this.notify('achievements', this.state.achievements);
        return true;
      }
      return false;
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
          teacherName: 'Ms. Sarah Jenkins',
          academicYear: '2026–2027',
          term: 'Term 1',
          primaryCefrTarget: 'A1',
          leaderboardEnabled: true,
          parentStoryVisibility: true,
          soundEffectsEnabled: true
        };
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
    getXPSkills(category = null) {
      if (!this.state.xpSkills) return [];
      return this.state.xpSkills.filter(s => !category || s.category === category);
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
        description: data.description || ''
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
      this.saveState();
      this.notify('xpSkills', this.state.xpSkills);
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

    redeemReward(studentId, rewardId, teacherName = 'Ms. Sarah') {
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
        awardedBy: 'Ms. Sarah',
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
          'positive',
          badge.id,
          badge.icon || '🏆'
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
  }

  // Export singleton instance
  const schoolStore = new MasterSchoolStore();

  if (typeof window !== 'undefined') {
    window.SchoolStore = MasterSchoolStore;
    window.schoolStore = schoolStore;
    window.store = schoolStore;
    window.GLOBAL_READINGS_2_PAGES = GLOBAL_READINGS_2_PAGES;
    window.GLOBAL_READINGS_2_DATA = GLOBAL_READINGS_2_DATA;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterSchoolStore, SchoolStore: MasterSchoolStore, schoolStore, GLOBAL_READINGS_2_PAGES, GLOBAL_READINGS_2_DATA };
  }

})(typeof window !== 'undefined' ? window : global);
