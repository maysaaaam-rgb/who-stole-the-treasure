/**
 * ENGLISH ADVENTURE ACADEMY — COMPLETE SCHOOL DATA STORE (CRUD ENABLED)
 * Single source of truth for Classes, Students, Resources/Games, Curriculum,
 * Assignments, Homework, Quizzes, Assessments, Attendance, Gamification, and Messages.
 * Backed by localStorage with reactive event subscriptions.
 */

(function() {
  const STORAGE_KEY = 'eaa_school_crud_store_v2';

  // INITIAL 15 AUDITED GAMES AS BASE RESOURCES
  const DEFAULT_RESOURCES = [
    {
      id: "firefighter",
      title: "Fire Station Adventure",
      description: "Interactive story about firefighters, emergency equipment, siren audio, and a tap-to-extinguish water hose simulation.",
      type: "Interactive Story",
      category: "Interactive Stories",
      level: "A1",
      age: "Ages 7–9",
      grade: "Grade 3",
      duration: 35,
      durationText: "35 min",
      skills: ["Speaking", "Listening", "Vocabulary"],
      topics: ["Community Helpers", "Emergencies", "Action Verbs"],
      objectives: ["Identify firefighter equipment", "Describe people and jobs", "Follow emergency action sequences"],
      book: "English Explorer A1",
      unit: "Unit 2: Community Heroes",
      route: "firefighter/index.html",
      worksheet: "firefighter/worksheet.html",
      teacherGuide: "Included in app",
      featured: true,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#fee2e2"/><rect x="25" y="30" width="150" height="110" rx="4" fill="#fca5a5"/><rect x="50" y="65" width="100" height="75" rx="3" fill="#ef4444"/><rect x="68" y="85" width="64" height="42" rx="4" fill="#b91c1c"/><rect x="74" y="90" width="52" height="16" rx="2" fill="#bae6fd"/><circle cx="80" cy="122" r="6" fill="#1e293b"/><circle cx="120" cy="122" r="6" fill="#1e293b"/><rect x="94" y="80" width="12" height="5" rx="1" fill="#38bdf8"/></svg>`
    },
    {
      id: "story",
      title: "The Wizard of Oz",
      description: "11-scene dramatized reader's theater stage following Dorothy, Scarecrow, Tin Woodman, and Lion down the Yellow Brick Road.",
      type: "Interactive Story",
      category: "Interactive Stories",
      level: "A1",
      age: "Ages 7–9",
      grade: "Grade 3",
      duration: 40,
      durationText: "40 min",
      skills: ["Reading", "Speaking", "Listening"],
      topics: ["Classic Literature", "Emotions", "Character Traits"],
      objectives: ["Read dialogue with character emotion", "Sequence story events", "Retell character motives"],
      book: "English Explorer A1",
      unit: "Unit 2: Classic Stories",
      route: "story/index.html",
      worksheet: null,
      teacherGuide: "Included in scene cards",
      featured: true,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#ede9fe"/><path d="M 0 140 Q 80 100 100 70 Q 120 40 140 15 L 160 15 Q 140 50 120 80 Q 90 120 0 140 Z" fill="#fde047"/><rect x="130" y="25" width="16" height="45" rx="2" fill="#10b981"/><polygon points="138,12 130,25 146,25" fill="#059669"/></svg>`
    },
    {
      id: "neighbourhood",
      title: "My Neighbourhood",
      description: "Living town exploration where students identify community locations, practice prepositions, and give walking tour directions.",
      type: "Speaking Game",
      category: "Speaking Games",
      level: "A1",
      age: "Ages 6–9",
      grade: "Grade 3",
      duration: 30,
      durationText: "30 min",
      skills: ["Speaking", "Vocabulary", "Grammar"],
      topics: ["Places in Town", "Prepositions of Place", "There is / There are"],
      objectives: ["Identify 10 town locations", "Use next to, opposite, between", "Form accurate There is/are sentences"],
      book: "English Explorer A1",
      unit: "Unit 3: My Town & Neighbourhood",
      route: "neighbourhood/index.html",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#ccfbf1"/><rect x="0" y="60" width="200" height="24" fill="#94a3b8"/><rect x="88" y="0" width="24" height="140" fill="#94a3b8"/><rect x="25" y="18" width="40" height="32" rx="3" fill="#38bdf8"/><polygon points="45,6 20,18 70,18" fill="#0284c7"/></svg>`
    },
    {
      id: "restaurant",
      title: "At the Restaurant",
      description: "Interactive dining role-play practicing 'I'd like...', menu ordering, secret challenge cards, and bill calculation.",
      type: "Role Play",
      category: "Role Plays",
      level: "A1+",
      age: "Ages 7–11",
      grade: "Grade 3",
      duration: 40,
      durationText: "40 min",
      skills: ["Speaking", "Vocabulary"],
      topics: ["Food & Drink", "Polite Requests", "Prices"],
      objectives: ["Order politely with 'I would like...'", "Ask for prices and calculate total", "Perform customer/waiter dialogue"],
      book: "English Explorer A1",
      unit: "Unit 4: Dining Out",
      route: "restaurant/index.html",
      worksheet: "restaurant/worksheets.html",
      teacherGuide: "Included in app",
      featured: true,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#ffedd5"/><ellipse cx="100" cy="105" rx="60" ry="22" fill="#fed7aa"/><rect x="94" y="105" width="12" height="28" fill="#c2410c"/><ellipse cx="100" cy="90" rx="26" ry="9" fill="#e2e8f0"/><path d="M 80 90 A 20 20 0 0 1 120 90 Z" fill="#94a3b8"/></svg>`
    },
    {
      id: "advice",
      title: "The Crazy Advice Academy",
      description: "Practice modal verbs 'should' and 'shouldn't' by solving 10 hilarious everyday dilemmas with Professor Should.",
      type: "Grammar Game",
      category: "Grammar Games",
      level: "A2",
      age: "Ages 8–12",
      grade: "Grade 4",
      duration: 35,
      durationText: "35 min",
      skills: ["Grammar", "Speaking"],
      topics: ["Modal Verbs Should & Shouldn't", "Giving Advice", "Problem Solving"],
      objectives: ["Form positive advice with should", "Form warnings with shouldn't", "Explain reasons for recommendations"],
      book: "Grammar & Adventure A2",
      unit: "Unit 1: The Advice Academy",
      route: "advice/index.html",
      worksheet: "advice/worksheets.html",
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#e0f2fe"/><circle cx="100" cy="60" r="26" fill="#facc15"/><rect x="92" y="84" width="16" height="8" rx="1" fill="#94a3b8"/><line x1="100" y1="24" x2="100" y2="14" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    {
      id: "predictions",
      title: "What Will Happen Next?",
      description: "Dramatic frozen cliffhangers where students predict future outcomes with WILL and WON'T before comic reveals.",
      type: "Grammar Game",
      category: "Grammar Games",
      level: "A2",
      age: "Ages 8–12",
      grade: "Grade 4",
      duration: 30,
      durationText: "30 min",
      skills: ["Grammar", "Speaking"],
      topics: ["Future Predictions with WILL", "Speculation", "Comic Sequencing"],
      objectives: ["Use will and won't for future outcomes", "Express probability with maybe/probably", "Sequence dramatic reveals"],
      book: "Grammar & Adventure A2",
      unit: "Unit 2: What Will Happen Next?",
      route: "predictions/index.html",
      worksheet: "predictions/worksheets.html",
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#f3e8ff"/><circle cx="100" cy="65" r="32" fill="#c084fc"/><path d="M 78 106 L 122 106 L 112 94 L 88 94 Z" fill="#6b21a8"/></svg>`
    },
    {
      id: "monster-day",
      title: "Build Your Own Monster",
      description: "Real-time SVG creator workshop practicing body parts, numbers, colors, and descriptive adjective order.",
      type: "Classroom Game",
      category: "Classroom Games",
      level: "A1",
      age: "Ages 6–8",
      grade: "Grade 3",
      duration: 30,
      durationText: "30 min",
      skills: ["Speaking", "Vocabulary", "Writing"],
      topics: ["Body Parts", "Adjectives Order", "Have Got"],
      objectives: ["Apply size + color + body part order", "Use has got / hasn't got", "Present descriptive monster card"],
      book: "English Explorer A1",
      unit: "Unit 5: Monster Workshop",
      route: "monster-day/index.html",
      worksheet: null,
      teacherGuide: "Included in teacherMode.js",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#f5f3ff"/><rect x="68" y="40" width="64" height="70" rx="28" fill="#a855f7"/><circle cx="84" cy="60" r="8" fill="#ffffff"/><circle cx="84" cy="60" r="3.5" fill="#0f172a"/><circle cx="100" cy="55" r="10" fill="#ffffff"/><circle cx="100" cy="55" r="4.5" fill="#0f172a"/><circle cx="116" cy="60" r="8" fill="#ffffff"/><circle cx="116" cy="60" r="3.5" fill="#0f172a"/><path d="M 86 85 Q 100 98 114 85" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/></svg>`
    },
    {
      id: "city-mouse",
      title: "The City Mouse & The Country Mouse",
      description: "Interactive Aesop's fable contrasting urban skyscrapers with calm country fields and comparative adjectives.",
      type: "Interactive Story",
      category: "Interactive Stories",
      level: "A1",
      age: "Ages 7–10",
      grade: "Grade 3",
      duration: 35,
      durationText: "35 min",
      skills: ["Reading", "Speaking"],
      topics: ["Town vs Country", "Comparatives", "Fables"],
      objectives: ["Compare city and country settings", "Use -er than adjectives", "Discuss fable moral message"],
      book: "English Explorer A1",
      unit: "Unit 6: Creatures of the Wild",
      route: "city-mouse/index.html",
      worksheet: "city-mouse/worksheet.html",
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#fef3c7"/><rect x="105" y="20" width="28" height="100" fill="#94a3b8"/><path d="M 0 120 Q 50 80 100 120 Z" fill="#86efac"/><rect x="35" y="80" width="28" height="22" rx="2" fill="#f59e0b"/></svg>`
    },
    {
      id: "detective-prep",
      title: "Detective Prep",
      description: "Rapid-fire 10-minute whiteboard warm-up drilling Wh-questions (Who, Where, What) before the detective mystery.",
      type: "Quick Activity",
      category: "Quick Warm-ups",
      level: "A1",
      age: "Ages 8–9",
      grade: "Grade 3",
      duration: 10,
      durationText: "10 min",
      skills: ["Speaking", "Grammar"],
      topics: ["Wh-Questions", "Interrogation Drill", "Warm-up"],
      objectives: ["Select correct Wh-question word", "Ask about people, places, and objects with speed"],
      book: "English Explorer A1",
      unit: "Unit 1: Who Stole the Treasure?",
      route: "treasure/index.html#prep-intro",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#eff6ff"/><circle cx="100" cy="60" r="28" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="120" y1="80" x2="148" y2="108" stroke="#1e40af" stroke-width="7" stroke-linecap="round"/><text x="92" y="70" font-family="sans-serif" font-weight="800" font-size="26" fill="#2563eb">?</text></svg>`
    },
    {
      id: "treasure",
      title: "Treasure Mystery",
      description: "Solve the royal theft with a 4-team live scoreboard. Cross-examine suspects and evaluate clues.",
      type: "Mystery Game",
      category: "Mystery & Detective",
      level: "A1",
      age: "Ages 8–10",
      grade: "Grade 3",
      duration: 40,
      durationText: "40 min",
      skills: ["Speaking", "Listening", "Vocabulary"],
      topics: ["Past Continuous", "Detective Clues", "Deductions"],
      objectives: ["State what suspects were doing at 8 PM", "Correlate clues to eliminate innocent suspects", "Accuse the culprit with evidence"],
      book: "English Explorer A1",
      unit: "Unit 1: Who Stole the Treasure?",
      route: "treasure/index.html#intro",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#fef3c7"/><rect x="52" y="60" width="96" height="56" rx="5" fill="#92400e"/><path d="M 52 60 Q 100 32 148 60 Z" fill="#b45309"/><rect x="94" y="62" width="12" height="16" rx="2" fill="#facc15"/></svg>`
    },
    {
      id: "room-rescue",
      title: "Room Rescue",
      description: "Restore disorganized rooms by placing furniture items according to precise coordinate clues.",
      type: "Classroom Game",
      category: "Classroom Games",
      level: "A1",
      age: "Ages 9–10",
      grade: "Grade 3",
      duration: 30,
      durationText: "25–35 min",
      skills: ["Vocabulary", "Speaking", "Grammar"],
      topics: ["Furniture", "Spatial Prepositions", "Coordinates"],
      objectives: ["Identify 15 household items", "Follow spatial preposition commands (on, under, in front of)", "Place items accurately"],
      book: "English Explorer A1",
      unit: "Unit 3: My Town & Neighbourhood",
      route: "treasure/index.html#room-rescue",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#ecfdf5"/><polygon points="0,0 200,0 170,25 30,25" fill="#d1fae5"/><polygon points="30,25 170,25 170,105 30,105" fill="#a7f3d0"/><polygon points="30,105 170,105 200,140 0,140" fill="#6ee7b7"/><rect x="68" y="75" width="64" height="30" rx="3" fill="#047857"/></svg>`
    },
    {
      id: "clil-lab",
      title: "CLIL Crime Lab",
      description: "Integrate English with science! Examine microscope fibers, compare fingerprint patterns, and test pH.",
      type: "CLIL Activity",
      category: "CLIL",
      level: "A1+",
      age: "Ages 9–10",
      grade: "Grade 4",
      duration: 35,
      durationText: "35 min",
      skills: ["CLIL", "Vocabulary", "Reading"],
      topics: ["Forensic Science", "Fibers & Fingerprints", "pH Reactions"],
      objectives: ["Understand science lab terms", "Compare fingerprint loops and whorls", "Describe chemical acid/base results"],
      book: "Grammar & Adventure A2",
      unit: "Unit 4: CLIL Science Lab",
      route: "treasure/index.html#clil-lab",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#e0f2fe"/><path d="M 94 30 L 106 30 L 106 55 L 128 100 L 72 100 L 94 55 Z" fill="#38bdf8" opacity="0.8"/><ellipse cx="100" cy="100" rx="28" ry="7" fill="#0284c7"/></svg>`
    },
    {
      id: "expedition",
      title: "The Last Expedition",
      description: "Explore world biomes from rainforests to the Arctic, practicing wildlife terms and compass directions.",
      type: "CLIL Activity",
      category: "CLIL",
      level: "A1+",
      age: "Ages 9–10",
      grade: "Grade 4",
      duration: 35,
      durationText: "30–40 min",
      skills: ["CLIL", "Speaking", "Listening"],
      topics: ["World Biomes", "Wildlife Habitats", "Compass Directions"],
      objectives: ["Navigate with compass directions (North, South, East, West)", "Identify Arctic and desert fauna", "Describe survival equipment"],
      book: "Grammar & Adventure A2",
      unit: "Unit 4: Global Expedition",
      route: "treasure/index.html#expedition",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#ecfdf5"/><polygon points="100,20 45,110 155,110" fill="#059669"/><circle cx="50" cy="45" r="20" fill="#ffffff" stroke="#10b981" stroke-width="2"/></svg>`
    },
    {
      id: "pokemon",
      title: "Pokémon Trainer Battle",
      description: "Gamified arena showdown where answering grammar challenges powers up attacks and defenses with animated HP bars.",
      type: "Classroom Game",
      category: "Classroom Games",
      level: "A2",
      age: "Ages 8–12",
      grade: "Grade 4",
      duration: 45,
      durationText: "45 min",
      skills: ["Grammar", "Speaking", "Vocabulary"],
      topics: ["Action Verbs", "Creature Stats", "Turn-based Battle"],
      objectives: ["Form correct verb tenses to execute attacks", "Read creature stats and compare power levels"],
      book: "Grammar & Adventure A2",
      unit: "Unit 3: ESL Arena Showdown",
      route: "pokemon/index.html",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#dbeafe"/><ellipse cx="100" cy="95" rx="70" ry="26" fill="#93c5fd"/><circle cx="100" cy="55" r="26" fill="#ef4444"/><path d="M 74 55 A 26 26 0 0 0 126 55 Z" fill="#ffffff"/><circle cx="100" cy="55" r="8" fill="#0f172a"/><circle cx="100" cy="55" r="4" fill="#ffffff"/></svg>`
    },
    {
      id: "jungle",
      title: "Life in the Jungle",
      description: "Join wildlife rangers on conservation missions! Spot jungle animals and evaluate ecosystem health with audio soundscapes.",
      type: "CLIL Activity",
      category: "CLIL",
      level: "A1+",
      age: "Ages 7–11",
      grade: "Grade 3",
      duration: 40,
      durationText: "40 min",
      skills: ["CLIL", "Vocabulary", "Listening"],
      topics: ["Rainforest Wildlife", "Modal Can/Can't", "Ecosystems"],
      objectives: ["Identify 12 rainforest animals", "Use modal can/can't for animal abilities", "Complete ranger missions"],
      book: "English Explorer A1",
      unit: "Unit 6: Creatures of the Wild",
      route: "jungle/index.html",
      worksheet: null,
      teacherGuide: "Included in app",
      featured: false,
      archived: false,
      thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#d1fae5"/><circle cx="45" cy="55" r="28" fill="#047857"/><circle cx="95" cy="45" r="32" fill="#059669"/><circle cx="150" cy="55" r="26" fill="#10b981"/><rect x="40" y="70" width="10" height="60" fill="#78350f"/><rect x="90" y="65" width="12" height="65" fill="#78350f"/></svg>`
    }
  ];

  const INITIAL_STATE = {
    currentRole: 'teacher',
    activeClassId: 'class-3a',
    activeStudentId: 'student-emma',
    teacher: {
      name: 'Ms. Sarah Jenkins',
      title: 'Lead ESL Teacher',
      school: 'English Adventure Academy'
    },
    resources: DEFAULT_RESOURCES,
    classes: [
      {
        id: 'class-3a',
        name: 'Grade 3A — The Explorers',
        grade: 'Grade 3',
        cefr: 'A1',
        room: 'Room 204',
        schedule: 'Mon, Wed, Fri · 14:00 – 14:40',
        attendanceRate: 95,
        avgProgress: 76,
        archived: false
      },
      {
        id: 'class-4b',
        name: 'Grade 4B — The Adventurers',
        grade: 'Grade 4',
        cefr: 'A1+',
        room: 'Room 205',
        schedule: 'Tue, Thu · 10:00 – 10:45',
        attendanceRate: 98,
        avgProgress: 84,
        archived: false
      }
    ],
    students: [
      {
        id: 'student-emma',
        classId: 'class-3a',
        firstName: 'Emma',
        lastName: 'Chen',
        age: 8,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 1240,
        streakDays: 5,
        archived: false,
        avatar: { hair: 'pigtails', outfit: 'explorer', accessory: 'ribbon' },
        skills: {
          speaking: { score: 74, cefr: 'A1' },
          listening: { score: 82, cefr: 'A1+' },
          reading: { score: 88, cefr: 'A1+' },
          writing: { score: 65, cefr: 'Pre-A1' },
          vocabulary: { score: 91, cefr: 'A1+' },
          grammar: { score: 76, cefr: 'A1' },
          pronunciation: { score: 70, cefr: 'A1' }
        },
        canDo: [
          'Describe familiar objects using 3+ adjectives',
          'Name 40+ common animals and their body parts',
          'Talk about family members and their professions',
          'Order food politely using "I would like..."'
        ],
        developing: [
          'Asking and answering Wh-questions in past tense',
          'Using "There is" vs "There are" accurately',
          'Prepositions of place (opposite, between, next to)'
        ],
        needsPractice: [
          'Writing complete sentences with capital letters and full stops',
          'Modal verb "should" for giving advice'
        ],
        badges: [
          { id: 'b1', name: 'Word Explorer', icon: '🧭', desc: 'Mastered 50 new vocabulary items', date: 'Sep 2' },
          { id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Built a 3-eyed descriptive monster', date: 'Aug 28' },
          { id: 'b3', name: 'Story Voice', icon: '📖', desc: 'Narrated 3 scenes of Wizard of Oz', date: 'Aug 20' }
        ],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 68 },
          { id: 'w3', name: 'Animal Kingdom', icon: '🐾', status: 'unlocked', progress: 25 },
          { id: 'w4', name: 'Space Station', icon: '🚀', status: 'locked', progress: 0, requiredXp: 1500 },
          { id: 'w5', name: 'Mystery Island', icon: '🏰', status: 'locked', progress: 0, requiredXp: 2000 }
        ],
        teacherNotes: [
          { id: 'n1', date: 'Sep 4, 2026', note: 'Very confident speaking during restaurant roleplay. Used polite requests naturally.' }
        ],
        parentContact: { name: 'Li Chen', relation: 'Mother', email: 'li.chen@example.com' }
      },
      {
        id: 'student-adam',
        classId: 'class-3a',
        firstName: 'Adam',
        lastName: 'Miller',
        age: 8,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 1180,
        streakDays: 4,
        archived: false,
        avatar: { hair: 'curly', outfit: 'hoodie', accessory: 'glasses' },
        skills: {
          speaking: { score: 68, cefr: 'Pre-A1' },
          listening: { score: 76, cefr: 'A1' },
          reading: { score: 70, cefr: 'A1' },
          writing: { score: 58, cefr: 'Pre-A1' },
          vocabulary: { score: 74, cefr: 'A1' },
          grammar: { score: 64, cefr: 'Pre-A1' },
          pronunciation: { score: 66, cefr: 'A1' }
        },
        canDo: ['Greet teacher and peers', 'Count 1–50 and name colors', 'Identify classroom items'],
        developing: ['Using modal can vs can\'t for ability', 'Food preferences'],
        needsPractice: ['Can/can\'t mastery: 54% — needs speaking practice', 'Short vowel sounds'],
        badges: [{ id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Built 5-armed purple creature', date: 'Aug 29' }],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 50 }
        ],
        teacherNotes: [{ id: 'n2', date: 'Sep 3, 2026', note: 'Struggled with "Can a bird swim?". Assigned additional Jungle Ranger mission.' }],
        parentContact: { name: 'Sarah Miller', relation: 'Mother', email: 'sarah.m@example.com' }
      },
      {
        id: 'student-mia',
        classId: 'class-3a',
        firstName: 'Mia',
        lastName: 'Tanaka',
        age: 9,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 1050,
        streakDays: 3,
        archived: false,
        avatar: { hair: 'bob', outfit: 'tshirt', accessory: 'cap' },
        skills: {
          speaking: { score: 80, cefr: 'A1' },
          listening: { score: 85, cefr: 'A1+' },
          reading: { score: 82, cefr: 'A1' },
          writing: { score: 70, cefr: 'A1' },
          vocabulary: { score: 88, cefr: 'A1+' },
          grammar: { score: 78, cefr: 'A1' },
          pronunciation: { score: 75, cefr: 'A1' }
        },
        canDo: ['Read aloud readers theater with emotion', 'Describe neighbourhood locations'],
        developing: ['Comparative adjectives'],
        needsPractice: ['Irregular plural spelling'],
        badges: [{ id: 'b1', name: 'Word Explorer', icon: '🧭', desc: '100% Town vocab', date: 'Sep 3' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Kenji Tanaka', relation: 'Father', email: 'kenji.t@example.com' }
      },
      {
        id: 'student-lucas',
        classId: 'class-3a',
        firstName: 'Lucas',
        lastName: 'Silva',
        age: 8,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 980,
        streakDays: 2,
        archived: false,
        avatar: { hair: 'spiky', outfit: 'jersey', accessory: 'headband' },
        skills: {
          speaking: { score: 72, cefr: 'A1' },
          listening: { score: 74, cefr: 'A1' },
          reading: { score: 75, cefr: 'A1' },
          writing: { score: 62, cefr: 'Pre-A1' },
          vocabulary: { score: 80, cefr: 'A1' },
          grammar: { score: 68, cefr: 'A1' },
          pronunciation: { score: 72, cefr: 'A1' }
        },
        canDo: ['Participate in team challenges', 'Name emergency helpers'],
        developing: ['Prepositions between/opposite'],
        needsPractice: ['Question word order'],
        badges: [{ id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Solved hose puzzle', date: 'Aug 22' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Maria Silva', relation: 'Mother', email: 'maria.s@example.com' }
      },
      {
        id: 'student-sophia',
        classId: 'class-3a',
        firstName: 'Sophia',
        lastName: 'Rossi',
        age: 9,
        grade: 'Grade 3',
        overallCefr: 'A1+',
        xp: 1320,
        streakDays: 7,
        archived: false,
        avatar: { hair: 'long', outfit: 'dress', accessory: 'flower' },
        skills: {
          speaking: { score: 86, cefr: 'A1+' },
          listening: { score: 90, cefr: 'A2' },
          reading: { score: 92, cefr: 'A2' },
          writing: { score: 78, cefr: 'A1+' },
          vocabulary: { score: 94, cefr: 'A2' },
          grammar: { score: 82, cefr: 'A1+' },
          pronunciation: { score: 84, cefr: 'A1+' }
        },
        canDo: ['Lead team mystery cross-examinations', 'Summarize story chapters'],
        developing: ['Future predictions with will/won\'t'],
        needsPractice: ['Complex sentence connectors (because, so)'],
        badges: [{ id: 'b1', name: 'Word Explorer', icon: '🧭', desc: '100% vocabulary mastery', date: 'Sep 1' }],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'completed', progress: 100 },
          { id: 'w3', name: 'Animal Kingdom', icon: '🐾', status: 'active', progress: 40 }
        ],
        teacherNotes: [],
        parentContact: { name: 'Marco Rossi', relation: 'Father', email: 'marco.r@example.com' }
      },
      {
        id: 'student-noah',
        classId: 'class-3a',
        firstName: 'Noah',
        lastName: 'Kim',
        age: 8,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 940,
        streakDays: 1,
        archived: false,
        avatar: { hair: 'short', outfit: 'hoodie', accessory: 'none' },
        skills: {
          speaking: { score: 64, cefr: 'Pre-A1' },
          listening: { score: 72, cefr: 'A1' },
          reading: { score: 70, cefr: 'A1' },
          writing: { score: 55, cefr: 'Pre-A1' },
          vocabulary: { score: 76, cefr: 'A1' },
          grammar: { score: 62, cefr: 'Pre-A1' },
          pronunciation: { score: 64, cefr: 'A1' }
        },
        canDo: ['Understand spoken commands', 'Name basic food items'],
        developing: ['Polite restaurant ordering'],
        needsPractice: ['Pronunciation of "th" sounds'],
        badges: [{ id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Fire safety run', date: 'Aug 18' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Eun-Ji Kim', relation: 'Mother', email: 'eunji.k@example.com' }
      },
      {
        id: 'student-oliver',
        classId: 'class-4b',
        firstName: 'Oliver',
        lastName: 'Patel',
        age: 10,
        grade: 'Grade 4',
        overallCefr: 'A1+',
        xp: 1420,
        streakDays: 6,
        archived: false,
        avatar: { hair: 'wavy', outfit: 'jacket', accessory: 'compass' },
        skills: {
          speaking: { score: 85, cefr: 'A1+' },
          listening: { score: 88, cefr: 'A2' },
          reading: { score: 90, cefr: 'A2' },
          writing: { score: 80, cefr: 'A1+' },
          vocabulary: { score: 92, cefr: 'A2' },
          grammar: { score: 84, cefr: 'A1+' },
          pronunciation: { score: 82, cefr: 'A1+' }
        },
        canDo: ['Make future predictions with will/won\'t', 'Solve CLIL fingerprint puzzles'],
        developing: ['Conditional clauses'],
        needsPractice: ['Multi-paragraph writing'],
        badges: [{ id: 'b1', name: 'Word Explorer', icon: '🧭', desc: 'Expert badge', date: 'Sep 2' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Anita Patel', relation: 'Mother', email: 'anita.p@example.com' }
      },
      {
        id: 'student-chloe',
        classId: 'class-4b',
        firstName: 'Chloe',
        lastName: 'Martin',
        age: 10,
        grade: 'Grade 4',
        overallCefr: 'A1+',
        xp: 1310,
        streakDays: 4,
        archived: false,
        avatar: { hair: 'braids', outfit: 'sweater', accessory: 'glasses' },
        skills: {
          speaking: { score: 82, cefr: 'A1+' },
          listening: { score: 84, cefr: 'A1+' },
          reading: { score: 86, cefr: 'A2' },
          writing: { score: 76, cefr: 'A1+' },
          vocabulary: { score: 88, cefr: 'A1+' },
          grammar: { score: 80, cefr: 'A1+' },
          pronunciation: { score: 80, cefr: 'A1+' }
        },
        canDo: ['Give sensible advice with should/shouldn\'t', 'Calculate restaurant menus'],
        developing: ['Past continuous story narration'],
        needsPractice: ['Time prepositions in/at/on'],
        badges: [{ id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Master creature', date: 'Aug 25' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'David Martin', relation: 'Father', email: 'david.m@example.com' }
      }
    ],
    curriculum: [
      {
        id: 'unit-1',
        book: 'English Explorer A1',
        unitNumber: 1,
        title: 'Community Helpers & Emergencies',
        level: 'A1',
        targetAge: 'Ages 7–9',
        objectives: [
          'Identify common community helpers (firefighter, doctor, police officer)',
          'Describe emergency tools, sirens, and safety procedures',
          'Use present simple action verbs (rescue, extinguish, protect, climb)'
        ],
        primaryGameId: 'firefighter',
        worksheetRoute: 'firefighter/worksheet.html',
        lessonRoute: 'firefighter/index.html',
        color: '#ef4444'
      },
      {
        id: 'unit-2',
        book: 'English Explorer A1',
        unitNumber: 2,
        title: 'Classic Stories & Reader\'s Theater',
        level: 'A1',
        targetAge: 'Ages 7–9',
        objectives: [
          'Read aloud 11 dramatic reader\'s theater scenes with character expression',
          'Express character feelings (scared, brave, wise, happy)',
          'Retell the sequence of Dorothy\'s journey down the Yellow Brick Road'
        ],
        primaryGameId: 'story',
        worksheetRoute: null,
        lessonRoute: 'story/index.html',
        color: '#8b5cf6'
      },
      {
        id: 'unit-3',
        book: 'English Explorer A1',
        unitNumber: 3,
        title: 'Places in Town & Prepositions',
        level: 'A1',
        targetAge: 'Ages 6–9',
        objectives: [
          'Name 10+ essential town locations (bakery, park, library, hospital)',
          'Give accurate directions using spatial prepositions (next to, between, opposite)',
          'Construct location sentences with "There is" and "There are"'
        ],
        primaryGameId: 'neighbourhood',
        worksheetRoute: null,
        lessonRoute: 'neighbourhood/index.html',
        color: '#0284c7'
      },
      {
        id: 'unit-4',
        book: 'English Explorer A1',
        unitNumber: 4,
        title: 'Dining Out & Polite Requests',
        level: 'A1+',
        targetAge: 'Ages 7–11',
        objectives: [
          'Order food and beverages politely using "I would like (I\'d like)..."',
          'Understand menu categories (starters, mains, desserts, drinks)',
          'Calculate simple dining totals and bills'
        ],
        primaryGameId: 'restaurant',
        worksheetRoute: 'restaurant/worksheets.html',
        lessonRoute: 'restaurant/index.html',
        color: '#f59e0b'
      },
      {
        id: 'unit-5',
        book: 'English Explorer A1',
        unitNumber: 5,
        title: 'Body Parts & Creature Descriptions',
        level: 'A1',
        targetAge: 'Ages 6–8',
        objectives: [
          'Identify body parts (eyes, ears, horns, tail, wings, fur)',
          'Apply correct adjective order: size + color + noun',
          'Use "has got" and "hasn\'t got" to describe strange creatures'
        ],
        primaryGameId: 'monster-day',
        worksheetRoute: null,
        lessonRoute: 'monster-day/index.html',
        color: '#10b981'
      },
      {
        id: 'unit-6',
        book: 'English Explorer A1',
        unitNumber: 6,
        title: 'Wildlife Conservation & Habitats',
        level: 'A1+',
        targetAge: 'Ages 7–11',
        objectives: [
          'Name rainforest animals (toucan, jaguar, sloth, tree frog)',
          'Use modal verb "can" and "can\'t" to express animal abilities',
          'Describe jungle habitats and conservation ranger tasks'
        ],
        primaryGameId: 'jungle',
        worksheetRoute: null,
        lessonRoute: 'jungle/index.html',
        color: '#059669'
      },
      {
        id: 'unit-7',
        book: 'Grammar & Adventure A2',
        unitNumber: 7,
        title: 'Giving Advice with Should & Shouldn\'t',
        level: 'A2',
        targetAge: 'Ages 8–12',
        objectives: [
          'Form positive advice sentences with "You should..."',
          'Form warnings with "You shouldn\'t..."',
          'Provide reasoned solutions to 10 hilarious everyday dilemmas'
        ],
        primaryGameId: 'advice',
        worksheetRoute: 'advice/worksheets.html',
        lessonRoute: 'advice/index.html',
        color: '#6366f1'
      },
      {
        id: 'unit-8',
        book: 'Grammar & Adventure A2',
        unitNumber: 8,
        title: 'Future Predictions with Will & Won\'t',
        level: 'A2',
        targetAge: 'Ages 8–12',
        objectives: [
          'Make speculative future predictions using "I think it will..."',
          'Use "won\'t" for impossible or unlikely comic outcomes',
          'Sequence 3-panel cliffhangers before the comedic reveal'
        ],
        primaryGameId: 'predictions',
        worksheetRoute: 'predictions/worksheets.html',
        lessonRoute: 'predictions/index.html',
        color: '#a855f7'
      }
    ],
    assignments: [
      {
        id: 'asg-1',
        classId: 'class-3a',
        title: 'Monster Builder Adjective Challenge',
        type: 'game',
        resourceId: 'monster-day',
        route: 'monster-day/index.html',
        dueDate: 'Sep 10, 2026',
        objectives: ['Body parts', 'Color & size adjectives', 'Have got'],
        assignedCount: 6,
        completedCount: 5,
        avgScore: 88,
        status: 'active'
      },
      {
        id: 'asg-2',
        classId: 'class-3a',
        title: 'Restaurant Roleplay Order Practice',
        type: 'roleplay',
        resourceId: 'restaurant',
        route: 'restaurant/index.html',
        dueDate: 'Sep 12, 2026',
        objectives: ['Polite requests', 'I\'d like...', 'Food menu items'],
        assignedCount: 6,
        completedCount: 4,
        avgScore: 82,
        status: 'active'
      },
      {
        id: 'asg-3',
        classId: 'class-3a',
        title: 'Town Prepositions Detective Mission',
        type: 'game',
        resourceId: 'neighbourhood',
        route: 'neighbourhood/index.html',
        dueDate: 'Sep 15, 2026',
        objectives: ['There is / There are', 'Next to, between, opposite'],
        assignedCount: 6,
        completedCount: 2,
        avgScore: 75,
        status: 'active'
      }
    ],
    homework: [
      {
        id: 'hw-1',
        classId: 'class-3a',
        title: 'Record Speaking: Describe Your Bedroom',
        type: 'Speaking Task',
        dueDate: 'Sep 11, 2026',
        instructions: 'Record 3-5 sentences describing your room using prepositions (on, under, next to, between).',
        submissions: [
          { studentId: 'student-emma', status: 'Completed', score: 92, feedback: 'Wonderful prepositions!' },
          { studentId: 'student-adam', status: 'Needs Revision', score: 65, feedback: 'Try to use complete sentences.' }
        ]
      },
      {
        id: 'hw-2',
        classId: 'class-3a',
        title: 'Fire Station Worksheet (A4 Printout)',
        type: 'Worksheet',
        dueDate: 'Sep 14, 2026',
        instructions: 'Complete matching activity and write 4 emergency tool names.',
        submissions: []
      }
    ],
    quizzes: [
      {
        id: 'quiz-1',
        title: 'Town Places & Prepositions Quiz',
        level: 'A1',
        skill: 'Vocabulary & Grammar',
        questions: [
          {
            q: 'Where do you buy fresh bread and rolls?',
            options: ['Hospital', 'Bakery', 'Library', 'Fire Station'],
            answer: 1
          },
          {
            q: 'The bakery is ________ the post office and the cafe.',
            options: ['between', 'opposite', 'under', 'on'],
            answer: 0
          },
          {
            q: 'True or False: We say "There are a hospital in my town."',
            options: ['True', 'False'],
            answer: 1
          }
        ]
      },
      {
        id: 'quiz-2',
        title: 'Modal Verbs: Should & Shouldn\'t',
        level: 'A2',
        skill: 'Grammar',
        questions: [
          {
            q: 'You have a severe toothache. You ________ visit the dentist.',
            options: ['should', 'shouldn\'t', 'won\'t', 'can\'t'],
            answer: 0
          },
          {
            q: 'It is raining heavily outside. You ________ go outside without an umbrella.',
            options: ['should', 'shouldn\'t', 'will', 'must'],
            answer: 1
          }
        ]
      }
    ],
    assessments: [
      {
        id: 'ass-1',
        studentId: 'student-emma',
        title: 'Unit 4 Speaking & Polite Ordering Rubric',
        date: 'Sep 4, 2026',
        scores: {
          vocabulary: 5,
          grammar: 4,
          speaking: 4,
          listening: 5,
          pronunciation: 4
        },
        teacherComment: 'Excellent use of "I\'d like" and polite intonation during the bakery roleplay.'
      }
    ],
    attendanceToday: {
      date: '2026-09-04',
      classId: 'class-3a',
      records: {
        'student-emma': 'present',
        'student-adam': 'late',
        'student-mia': 'present',
        'student-lucas': 'present',
        'student-sophia': 'present',
        'student-noah': 'absent'
      }
    },
    classStory: [
      {
        id: 'post-1',
        classId: 'class-3a',
        author: 'Ms. Sarah Jenkins',
        date: 'Today at 15:30',
        content: '🎉 Fantastic work today in the Monster Creator Workshop! Students practiced descriptive adjectives and presented their monsters using "It has got three green eyes and big purple wings!" 👾✨',
        tag: 'Achievement',
        imageSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%"><rect width="400" height="200" fill="#f5f3ff"/><rect x="160" y="50" width="80" height="90" rx="36" fill="#8b5cf6"/><circle cx="185" cy="85" r="10" fill="#fff"/><circle cx="215" cy="85" r="10" fill="#fff"/><path d="M 180 115 Q 200 130 220 115" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
        likes: 12,
        comments: [
          { author: 'Li Chen (Emma\'s Mom)', text: 'Emma came home so excited to tell us about her monster! Thank you Ms. Sarah.' }
        ]
      }
    ],
    messages: [
      {
        id: 'msg-emma',
        studentId: 'student-emma',
        parentName: 'Li Chen',
        parentRelation: 'Emma\'s Mother',
        lastActivity: '14:20',
        threads: [
          { sender: 'teacher', time: 'Yesterday 14:15', text: 'Good afternoon Mrs. Chen! Emma did wonderfully in today\'s speaking reader\'s theater.' },
          { sender: 'parent', time: 'Yesterday 16:40', text: 'Thank you Ms. Sarah! What should we practice at home this weekend?' },
          { sender: 'teacher', time: 'Today 09:10', text: 'I recommend reviewing short writing sentences and capital letters in the Fire Station worksheet.' }
        ]
      },
      {
        id: 'msg-adam',
        studentId: 'student-adam',
        parentName: 'Sarah Miller',
        parentRelation: 'Adam\'s Mother',
        lastActivity: 'Yesterday',
        threads: [
          { sender: 'teacher', time: 'Sep 2 11:30', text: 'Hi Sarah, Adam has made good progress naming community helpers! We are giving him extra support with modal verbs can/can\'t.' }
        ]
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        studentId: 'student-emma',
        title: 'Build Your Own Monster: Zorgon the Friendly',
        date: 'Sep 1, 2026',
        type: 'Drawing & Writing',
        objective: 'Body parts, colors, have got',
        teacherComment: 'Superb sentence formation! "Zorgon has got three eyes and big purple wings."',
        verified: true
      }
    ]
  };

  class SchoolStore {
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
            return Object.assign({}, INITIAL_STATE, parsed);
          }
        }
      } catch (e) {
        console.warn('SchoolStore: Failed to load from localStorage, using seed defaults', e);
      }
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }

    saveState() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (e) {
        console.warn('SchoolStore: Failed to save to localStorage', e);
      }
      this.notify();
    }

    resetToDefaults() {
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
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
        try { fn(this.state); } catch(e) { console.error('Listener error:', e); }
      });
    }

    // Role & Active context
    getRole() { return this.state.currentRole; }
    setRole(role) {
      this.state.currentRole = role;
      this.saveState();
    }

    getActiveClass() {
      return this.state.classes.find(c => c.id === this.state.activeClassId && !c.archived) || this.state.classes[0];
    }
    setActiveClass(id) {
      this.state.activeClassId = id;
      this.saveState();
    }

    getActiveStudent() {
      return this.state.students.find(s => s.id === this.state.activeStudentId && !s.archived) || this.state.students[0];
    }
    setActiveStudent(id) {
      this.state.activeStudentId = id;
      this.saveState();
    }

    // =========================================================================
    // 1. RESOURCE & GAME CRUD
    // =========================================================================
    getResources(includeArchived = false) {
      return this.state.resources.filter(r => includeArchived || !r.archived);
    }

    getResource(id) {
      return this.state.resources.find(r => r.id === id);
    }

    addResource(data) {
      const newId = data.id || ('res-' + Date.now());
      const resource = Object.assign({
        id: newId,
        title: 'New ESL Resource',
        description: 'Classroom activity',
        type: 'Classroom Game',
        category: 'Classroom Games',
        level: 'A1',
        age: 'Ages 7–9',
        grade: 'Grade 3',
        duration: 30,
        durationText: '30 min',
        skills: ['Speaking', 'Vocabulary'],
        topics: ['General English'],
        objectives: ['Practice English target phrases'],
        book: 'English Explorer A1',
        unit: 'Unit 1',
        route: 'monster-day/index.html',
        worksheet: null,
        teacherGuide: null,
        featured: false,
        archived: false,
        thumbnailSvg: `<svg viewBox="0 0 200 140" width="100%" height="100%"><rect width="200" height="140" fill="#e0f2fe"/><circle cx="100" cy="70" r="30" fill="#0284c7"/><text x="92" y="78" font-family="sans-serif" font-weight="bold" font-size="24" fill="#ffffff">★</text></svg>`
      }, data);

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
      }
    }

    // =========================================================================
    // 2. CLASS CRUD
    // =========================================================================
    getClasses(includeArchived = false) {
      return this.state.classes.filter(c => includeArchived || !c.archived);
    }

    getClass(id) {
      return this.state.classes.find(c => c.id === id);
    }

    addClass(data) {
      const newClass = Object.assign({
        id: 'class-' + Date.now(),
        name: 'Grade 3 New Class',
        grade: 'Grade 3',
        cefr: 'A1',
        room: 'Room 204',
        schedule: 'Mon, Wed · 10:00 – 10:45',
        attendanceRate: 100,
        avgProgress: 70,
        archived: false
      }, data);
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

    archiveClass(id) {
      const c = this.getClass(id);
      if (c) {
        c.archived = true;
        this.saveState();
      }
    }

    // =========================================================================
    // 3. STUDENT CRUD & GAMIFICATION
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

    _unused_getStudents(classId = null, includeArchived = false) {
      return this.state.students.filter(s => {
        const matchClass = !classId || s.classId === classId;
        const matchArchived = includeArchived || !s.archived;
        return matchClass && matchArchived;
      });
    }

    getStudent(id) {
      return this.state.students.find(s => s.id === id);
    }

    addStudent(data) {
      const student = Object.assign({
        id: 'student-' + Date.now(),
        classId: this.state.activeClassId,
        firstName: 'New',
        lastName: 'Learner',
        age: 8,
        grade: 'Grade 3',
        overallCefr: 'A1',
        xp: 100,
        streakDays: 1,
        archived: false,
        avatar: { hair: 'short', outfit: 'explorer', accessory: 'none' },
        skills: {
          speaking: { score: 70, cefr: 'A1' },
          listening: { score: 75, cefr: 'A1' },
          reading: { score: 75, cefr: 'A1' },
          writing: { score: 60, cefr: 'Pre-A1' },
          vocabulary: { score: 75, cefr: 'A1' },
          grammar: { score: 65, cefr: 'A1' },
          pronunciation: { score: 70, cefr: 'A1' }
        },
        canDo: ['Participate in classroom team activities'],
        developing: ['Forming polite questions'],
        needsPractice: ['Sentence punctuation'],
        badges: [],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 10 }
        ],
        teacherNotes: [],
        parentContact: { name: 'Parent', relation: 'Guardian', email: 'parent@example.com' }
      }, data);

      this.state.students.push(student);
      this.saveState();
      return student;
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
      }
    }

    giveXP(studentId, amount, reason = 'Great effort') {
      const s = this.getStudent(studentId);
      if (s) {
        s.xp = (s.xp || 0) + amount;
        this.checkWorldUnlocks(s);
        this.saveState();
        return { student: s, newTotalXP: s.xp, amount, reason };
      }
      return 0;
    }

    addTeacherNote(studentId, text) {
      const s = this.getStudent(studentId);
      if (s) {
        if (!s.teacherNotes) s.teacherNotes = [];
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        s.teacherNotes.unshift({ id: 'note-' + Date.now(), date: dateStr, note: text });
        this.saveState();
      }
    }

    checkWorldUnlocks(student) {
      if (!student.unlockedWorlds) return;
      student.unlockedWorlds.forEach(w => {
        if (w.status === 'locked' && w.requiredXp && student.xp >= w.requiredXp) {
          w.status = 'unlocked';
        }
      });
    }

    // =========================================================================
    // 4. CURRICULUM CRUD
    // =========================================================================
    getCurriculum() {
      return this.state.curriculum;
    }

    addCurriculumUnit(data) {
      const unit = Object.assign({
        id: 'unit-' + Date.now(),
        book: 'English Explorer A1',
        unitNumber: this.state.curriculum.length + 1,
        title: 'New Unit',
        level: 'A1',
        targetAge: 'Ages 7–9',
        objectives: ['Master new vocabulary and grammar patterns'],
        primaryGameId: 'monster-day',
        worksheetRoute: null,
        lessonRoute: 'monster-day/index.html',
        color: '#2563eb'
      }, data);
      this.state.curriculum.push(unit);
      this.saveState();
      return unit;
    }

    // =========================================================================
    // 5. ASSIGNMENTS & HOMEWORK CRUD
    // =========================================================================
    getAssignments(classId = null) {
      if (classId) {
        return this.state.assignments.filter(a => a.classId === classId);
      }
      return this.state.assignments;
    }

    createAssignment(data) {
      const asg = Object.assign({
        id: 'asg-' + Date.now(),
        classId: this.state.activeClassId,
        title: 'New Assignment',
        type: 'game',
        resourceId: 'firefighter',
        route: 'firefighter/index.html',
        dueDate: 'Next Week',
        objectives: ['Practice target English language skills'],
        assignedCount: this.getStudents(data.classId || this.state.activeClassId).length,
        completedCount: 0,
        avgScore: 0,
        status: 'active'
      }, data);

      this.state.assignments.unshift(asg);
      this.saveState();
      return asg;
    }

    getHomework(classId = null) {
      if (classId) {
        return this.state.homework.filter(h => h.classId === classId);
      }
      return this.state.homework;
    }

    createHomework(data) {
      const hw = Object.assign({
        id: 'hw-' + Date.now(),
        classId: this.state.activeClassId,
        title: 'New Homework Task',
        type: 'Speaking Task',
        dueDate: 'Next Week',
        instructions: 'Follow teacher instructions',
        submissions: []
      }, data);
      this.state.homework.unshift(hw);
      this.saveState();
      return hw;
    }

    // =========================================================================
    // 6. QUIZZES & ASSESSMENTS CRUD
    // =========================================================================
    getQuizzes() {
      return this.state.quizzes;
    }

    createQuiz(data) {
      const quiz = Object.assign({
        id: 'quiz-' + Date.now(),
        title: 'New Grammar & Vocabulary Quiz',
        level: 'A1',
        skill: 'Vocabulary',
        questions: []
      }, data);
      this.state.quizzes.unshift(quiz);
      this.saveState();
      return quiz;
    }

    recordAssessment(studentId, rubricScores, comment) {
      const s = this.getStudent(studentId);
      if (!s) return null;

      const ass = {
        id: 'ass-' + Date.now(),
        studentId,
        title: 'Teacher Rubric Assessment',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        scores: rubricScores,
        teacherComment: comment
      };

      this.state.assessments.unshift(ass);

      // Recalculate student skill scores (convert 1-5 scale to percentage)
      Object.entries(rubricScores).forEach(([skillKey, scoreVal]) => {
        if (s.skills[skillKey]) {
          const newPct = Math.round((scoreVal / 5) * 100);
          s.skills[skillKey].score = Math.round((s.skills[skillKey].score * 0.6) + (newPct * 0.4));
        }
      });

      this.saveState();
      return Object.assign(ass, { student: s, overallCefr: s.overallCefr });
    }

    // =========================================================================
    // 7. ATTENDANCE & STORY & MESSAGING
    // =========================================================================
    getTodayAttendance(classId) {
      return this.state.attendanceToday.records || {};
    }

    setStudentAttendance(studentId, status) {
      if (!this.state.attendanceToday.records) {
        this.state.attendanceToday.records = {};
      }
      this.state.attendanceToday.records[studentId] = status;
      this.saveState();
    }

    getClassStory(classId = null) {
      return this.state.classStory.filter(p => !classId || p.classId === classId);
    }

    addStoryPost(data) {
      const post = Object.assign({
        id: 'post-' + Date.now(),
        date: 'Just now',
        author: this.state.teacher.name,
        tag: 'Update',
        likes: 0,
        comments: []
      }, data);
      this.state.classStory.unshift(post);
      this.saveState();
      return post;
    }

    likeStoryPost(id) {
      const p = this.state.classStory.find(post => post.id === id);
      if (p) {
        p.likes = (p.likes || 0) + 1;
        this.saveState();
        return p;
      }
    }

    getMessageThreads() {
      return this.state.messages;
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

    // Universal Game Integration API (Phase 43)
    completeActivity({ studentId, activityId, score, maxScore, duration, objectives }) {
      const targetId = studentId || this.state.activeStudentId;
      const s = this.getStudent(targetId);
      if (s) {
        const pct = Math.round((score / (maxScore || 100)) * 100);
        const earnedXP = Math.round(score * 1.5) + 20;
        s.xp = (s.xp || 0) + earnedXP;
        s.streakDays = Math.max(1, (s.streakDays || 0) + 1);

        this.state.portfolio.unshift({
          id: 'port-' + Date.now(),
          studentId: targetId,
          title: 'Game Activity: ' + activityId,
          date: 'Just now',
          type: 'Interactive Game',
          score: pct + '%',
          objective: objectives ? objectives.join(', ') : 'Target ESL skill practice',
          teacherComment: `Completed with score ${pct}% (+ ${earnedXP} XP)`,
          verified: true
        });

        this.checkWorldUnlocks(s);
        this.saveState();
        return { success: true, earnedXP, newTotalXP: s.xp, scorePct: pct };
      }
      return { success: false };
    }
  }

  const instance = new SchoolStore();
  if (typeof window !== 'undefined') {
    window.schoolStore = instance;
    window.completeActivity = function(data) {
      return instance.completeActivity(data);
    };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SchoolStore, schoolStore: instance };
  }
})();
