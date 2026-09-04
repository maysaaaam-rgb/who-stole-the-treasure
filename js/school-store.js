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
      resources: CANONICAL_GAMES,

      // 4. Curriculum Hierarchy
      curriculum: {
        books: [
          {
            id: 'book-1',
            title: 'English Explorer A1',
            level: 'A1',
            description: 'Foundational communicative English for young explorers aged 6–9.',
            archived: false
          },
          {
            id: 'book-2',
            title: 'World Navigators A2',
            level: 'A2',
            description: 'Advanced communicative English featuring grammar dilemmas, past tenses, and science CLIL.',
            archived: false
          }
        ],
        units: [
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
          }
        ],
        objectives: [
          { id: 'obj-1', lessonId: 'lesson-1', text: 'Identify and name 6 creature body parts', skill: 'Vocabulary', cefr: 'Pre-A1', archived: false },
          { id: 'obj-2', lessonId: 'lesson-1', text: 'Form sentences with "It has got..."', skill: 'Grammar', cefr: 'A1', archived: false },
          { id: 'obj-3', lessonId: 'lesson-2', text: 'State firefighter equipment functions', skill: 'Speaking', cefr: 'A1', archived: false },
          { id: 'obj-4', lessonId: 'lesson-4', text: 'Order meals politely using "I would like"', skill: 'Speaking', cefr: 'A1', archived: false }
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
        { id: 'xp-1', studentId: 'student-emma', amount: 500, reason: 'Completed Initial Explorer Orientation', date: 'Sep 1, 2026', source: 'System' },
        { id: 'xp-2', studentId: 'student-emma', amount: 350, reason: 'Mastered Body Parts in Monster Day', date: 'Sep 4, 2026', source: 'Activity' },
        { id: 'xp-3', studentId: 'student-emma', amount: 250, reason: 'Polite Dialogue in Restaurant Roleplay', date: 'Sep 7, 2026', source: 'Activity' },
        { id: 'xp-4', studentId: 'student-emma', amount: 140, reason: 'Great Speaking Participation Award', date: 'Sep 9, 2026', source: 'Teacher' },
        { id: 'xp-5', studentId: 'student-lucas', amount: 500, reason: 'Completed Initial Explorer Orientation', date: 'Sep 1, 2026', source: 'System' },
        { id: 'xp-6', studentId: 'student-lucas', amount: 320, reason: 'Restaurant Roleplay Completion', date: 'Sep 6, 2026', source: 'Activity' },
        { id: 'xp-7', studentId: 'student-sofia', amount: 980, reason: 'Treasure Mystery Super Sleuth', date: 'Sep 8, 2026', source: 'Activity' },
        { id: 'xp-8', studentId: 'student-noah', amount: 620, reason: 'Firefighter Mission Accomplished', date: 'Sep 5, 2026', source: 'Activity' },
        { id: 'xp-9', studentId: 'student-maya', amount: 710, reason: 'Jungle Explorer Mission', date: 'Sep 6, 2026', source: 'Activity' },
        { id: 'xp-10', studentId: 'student-oliver', amount: 450, reason: 'Super Hero Phonics Training', date: 'Sep 3, 2026', source: 'Activity' }
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
          category: 'Roleplay & Speaking',
          lessonId: 'lesson-1',
          gameId: 'restaurant',
          pdfUrl: 'restaurant/worksheets.html',
          answerKey: 'Polite requests: "I would like...", "How much is...?"',
          description: 'Customer and waiter script practice with food vocabulary matching.',
          archived: false
        },
        {
          id: 'ws-2',
          title: 'Fire Station Adventure: Gear & Emergency Protocol',
          level: 'A1',
          category: 'Interactive Story',
          lessonId: 'lesson-2',
          gameId: 'firefighter',
          pdfUrl: 'firefighter/worksheet.html',
          answerKey: 'Helmet, boots, hose, ladder, fire extinguisher matching.',
          description: 'Vocabulary labeling and sequencing exercise for emergency response.',
          archived: false
        },
        {
          id: 'ws-3',
          title: 'My Neighbourhood: Prepositions of Place Map',
          level: 'A1',
          category: 'Grammar & Vocabulary',
          lessonId: 'lesson-3',
          gameId: 'neighbourhood',
          pdfUrl: 'neighbourhood/index.html',
          answerKey: 'next to, opposite, between, behind town locations.',
          description: 'Map navigation exercise completing "There is a..." sentences.',
          archived: false
        },
        {
          id: 'ws-4',
          title: 'Past Simple Detective Clues Worksheet',
          level: 'A2',
          category: 'Mystery & Grammar',
          lessonId: 'lesson-4',
          gameId: 'story/hotel/index.html',
          pdfUrl: 'story/hotel/index.html',
          answerKey: 'Regular (-ed) and irregular past tense crime investigation notes.',
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
        soundEffectsEnabled: true
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

      // Seed initial welcoming XP transaction
      this.giveXP(studentId, 100, 'Welcome to Adventure Academy!', 'System');
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

    // Dynamic XP Calculation
    getStudentTotalXP(studentId) {
      const txs = this.state.xpTransactions.filter(t => t.studentId === studentId);
      return txs.reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    getXPTransactions(studentId) {
      return this.state.xpTransactions.filter(t => t.studentId === studentId).reverse();
    }

    giveXP(studentId, amount, reason = 'Great effort', source = 'Teacher') {
      const s = this.getStudent(studentId);
      if (!s) return null;

      const tx = {
        id: 'xp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId,
        amount: parseInt(amount, 10) || 50,
        reason,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        source
      };

      this.state.xpTransactions.push(tx);
      this.saveState();
      return { transaction: tx, student: s, newTotalXP: this.getStudentTotalXP(studentId), reason, amount };
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
        level: data.level || 'A1',
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
        copy.archived = false;
        this.state.quizzes.unshift(copy);
        this.saveState();
        return copy;
      }
      return null;
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


  }

  // Export singleton instance
  const schoolStore = new MasterSchoolStore();

  if (typeof window !== 'undefined') {
    window.SchoolStore = MasterSchoolStore;
    window.schoolStore = schoolStore;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterSchoolStore, SchoolStore: MasterSchoolStore, schoolStore };
  }

})(typeof window !== 'undefined' ? window : global);
