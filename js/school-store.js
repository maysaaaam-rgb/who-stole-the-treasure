/**
 * ENGLISH ADVENTURE ACADEMY — SCHOOL DATA STORE
 * Single source of truth for Classes, Students, Curriculum,
 * Assignments, Assessments, Attendance, Gamification, and Communication.
 * Backed by localStorage with fallback to default seed data.
 */

(function() {
  const STORAGE_KEY = 'eaa_school_platform_v1';

  // DEFAULT SEED DATA
  const DEFAULT_DATA = {
    currentRole: 'teacher', // 'teacher' | 'student' | 'parent'
    activeClassId: 'class-3a',
    activeStudentId: 'student-emma',
    teacher: {
      id: 'teacher-1',
      name: 'Ms. Sarah Jenkins',
      title: 'Lead ESL Teacher',
      email: 's.jenkins@adventureacademy.edu',
      school: 'English Adventure Academy',
      avatar: 'SJ'
    },
    classes: [
      {
        id: 'class-3a',
        name: 'Grade 3A — The Explorers',
        grade: 'Grade 3',
        cefr: 'A1',
        room: 'Room 204',
        schedule: 'Mon, Wed, Fri · 14:00 – 14:40',
        studentCount: 6,
        avgProgress: 76,
        attendanceRate: 95,
        color: '#2563eb'
      },
      {
        id: 'class-4b',
        name: 'Grade 4B — The Adventurers',
        grade: 'Grade 4',
        cefr: 'A1+',
        room: 'Room 205',
        schedule: 'Tue, Thu · 10:00 – 10:45',
        studentCount: 2,
        avgProgress: 84,
        attendanceRate: 98,
        color: '#7c3aed'
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
        avatar: {
          style: 'explorer',
          hair: 'pigtails',
          hairColor: '#d97706',
          outfit: 'adventurer-vest',
          accessory: 'compass-badge',
          bg: '#dbeafe'
        },
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
          { id: 'b3', name: 'Story Voice', icon: '📖', desc: 'Narrated 3 scenes of Wizard of Oz', date: 'Aug 20' },
          { id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Completed Fire Station Challenge', date: 'Aug 15' }
        ],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 68 },
          { id: 'w3', name: 'Animal Kingdom', icon: '🐾', status: 'unlocked', progress: 25 },
          { id: 'w4', name: 'Space Station', icon: '🚀', status: 'locked', progress: 0, requiredXp: 1500 },
          { id: 'w5', name: 'Mystery Island', icon: '🏰', status: 'locked', progress: 0, requiredXp: 2000 }
        ],
        teacherNotes: [
          { id: 'n1', date: 'Sep 4, 2026', note: 'Very confident speaking during the restaurant simulation. Acted as both chef and customer with great polite requests.' },
          { id: 'n2', date: 'Sep 1, 2026', note: 'Completed Monster Builder challenge. Good use of adjective order ("big blue eyes"). Needs writing practice.' }
        ],
        parentContact: {
          name: 'Li Chen',
          relation: 'Mother',
          email: 'li.chen@example.com',
          phone: '+1 555-0142'
        }
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
        avatar: {
          style: 'curly',
          hair: 'curly',
          hairColor: '#92400e',
          outfit: 'hoodie',
          accessory: 'star-badge',
          bg: '#e0e7ff'
        },
        skills: {
          speaking: { score: 68, cefr: 'Pre-A1' },
          listening: { score: 76, cefr: 'A1' },
          reading: { score: 70, cefr: 'A1' },
          writing: { score: 58, cefr: 'Pre-A1' },
          vocabulary: { score: 74, cefr: 'A1' },
          grammar: { score: 64, cefr: 'Pre-A1' },
          pronunciation: { score: 66, cefr: 'A1' }
        },
        canDo: [
          'Greet teacher and classmates with daily phrases',
          'Count numbers 1–50 and name colors',
          'Identify classroom objects and school helpers'
        ],
        developing: [
          'Using modal "can" vs "can\'t" for abilities',
          'Expressing food likes and dislikes'
        ],
        needsPractice: [
          'Can/can\'t mastery: 54% — needs speaking & listening practice',
          'Short vowel pronunciation in CVC words'
        ],
        badges: [
          { id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Built a 5-armed purple creature', date: 'Aug 29' },
          { id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Solved fire hose hose puzzle', date: 'Aug 14' }
        ],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 50 },
          { id: 'w3', name: 'Animal Kingdom', icon: '🐾', status: 'locked', progress: 0, requiredXp: 1200 },
          { id: 'w4', name: 'Space Station', icon: '🚀', status: 'locked', progress: 0, requiredXp: 1500 },
          { id: 'w5', name: 'Mystery Island', icon: '🏰', status: 'locked', progress: 0, requiredXp: 2000 }
        ],
        teacherNotes: [
          { id: 'n3', date: 'Sep 3, 2026', note: 'Can/can\'t drill: struggled with "Can a bird swim?". Assigned additional Jungle Ranger mission.' }
        ],
        parentContact: {
          name: 'Sarah Miller',
          relation: 'Mother',
          email: 'sarah.m@example.com',
          phone: '+1 555-0189'
        }
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
        avatar: {
          style: 'bob',
          hair: 'bob',
          hairColor: '#1e293b',
          outfit: 'tshirt',
          accessory: 'ribbon',
          bg: '#ecfdf5'
        },
        skills: {
          speaking: { score: 80, cefr: 'A1' },
          listening: { score: 85, cefr: 'A1+' },
          reading: { score: 82, cefr: 'A1' },
          writing: { score: 70, cefr: 'A1' },
          vocabulary: { score: 88, cefr: 'A1+' },
          grammar: { score: 78, cefr: 'A1' },
          pronunciation: { score: 75, cefr: 'A1' }
        },
        canDo: [
          'Read aloud short readers theatre scenes with expression',
          'Describe her neighbourhood and local shops'
        ],
        developing: ['Comparative adjectives (faster, bigger than)'],
        needsPractice: ['Spelling irregular plural nouns'],
        badges: [
          { id: 'b1', name: 'Word Explorer', icon: '🧭', desc: 'Scored 100% on Town Vocabulary', date: 'Sep 3' }
        ],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'active', progress: 60 }
        ],
        teacherNotes: [],
        parentContact: { name: 'Kenji Tanaka', relation: 'Father', email: 'kenji.t@example.com', phone: '+1 555-0199' }
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
        avatar: {
          style: 'spiky',
          hair: 'spiky',
          hairColor: '#475569',
          outfit: 'jersey',
          accessory: 'sweatband',
          bg: '#fef3c7'
        },
        skills: {
          speaking: { score: 72, cefr: 'A1' },
          listening: { score: 74, cefr: 'A1' },
          reading: { score: 75, cefr: 'A1' },
          writing: { score: 62, cefr: 'Pre-A1' },
          vocabulary: { score: 80, cefr: 'A1' },
          grammar: { score: 68, cefr: 'A1' },
          pronunciation: { score: 72, cefr: 'A1' }
        },
        canDo: ['Participate in classroom team games', 'Identify firefighter tools'],
        developing: ['Prepositions next to / behind'],
        needsPractice: ['Word order in questions'],
        badges: [{ id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Put out all 5 fires', date: 'Aug 22' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Maria Silva', relation: 'Mother', email: 'maria.s@example.com', phone: '+1 555-0122' }
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
        avatar: {
          style: 'long',
          hair: 'long',
          hairColor: '#7c2d12',
          outfit: 'dress',
          accessory: 'flower',
          bg: '#fce7f3'
        },
        skills: {
          speaking: { score: 86, cefr: 'A1+' },
          listening: { score: 90, cefr: 'A2' },
          reading: { score: 92, cefr: 'A2' },
          writing: { score: 78, cefr: 'A1+' },
          vocabulary: { score: 94, cefr: 'A2' },
          grammar: { score: 82, cefr: 'A1+' },
          pronunciation: { score: 84, cefr: 'A1+' }
        },
        canDo: ['Lead team mystery cross-examinations', 'Accurately summarize story chapters'],
        developing: ['Future tense with will/won\'t'],
        needsPractice: ['Complex sentence connectors (because, although)'],
        badges: [
          { id: 'b1', name: 'Word Explorer', icon: '🧭', desc: '100% vocabulary mastery', date: 'Sep 1' },
          { id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Master challenge solved', date: 'Aug 30' }
        ],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 },
          { id: 'w2', name: 'My Town', icon: '🏙️', status: 'completed', progress: 100 },
          { id: 'w3', name: 'Animal Kingdom', icon: '🐾', status: 'active', progress: 40 }
        ],
        teacherNotes: [],
        parentContact: { name: 'Marco Rossi', relation: 'Father', email: 'marco.r@example.com', phone: '+1 555-0155' }
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
        avatar: {
          style: 'short',
          hair: 'short',
          hairColor: '#0f172a',
          outfit: 'hoodie',
          accessory: 'none',
          bg: '#ede9fe'
        },
        skills: {
          speaking: { score: 64, cefr: 'Pre-A1' },
          listening: { score: 72, cefr: 'A1' },
          reading: { score: 70, cefr: 'A1' },
          writing: { score: 55, cefr: 'Pre-A1' },
          vocabulary: { score: 76, cefr: 'A1' },
          grammar: { score: 62, cefr: 'Pre-A1' },
          pronunciation: { score: 64, cefr: 'A1' }
        },
        canDo: ['Understand spoken classroom commands', 'Name basic food and drink'],
        developing: ['Polite restaurant ordering'],
        needsPractice: ['Pronunciation of "th" sounds'],
        badges: [{ id: 'b4', name: 'Fire Chief', icon: '🚒', desc: 'Fire station safety run', date: 'Aug 18' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Eun-Ji Kim', relation: 'Mother', email: 'eunji.k@example.com', phone: '+1 555-0177' }
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
        avatar: {
          style: 'wavy',
          hair: 'wavy',
          hairColor: '#451a03',
          outfit: 'jacket',
          accessory: 'compass',
          bg: '#e0f2fe'
        },
        skills: {
          speaking: { score: 85, cefr: 'A1+' },
          listening: { score: 88, cefr: 'A2' },
          reading: { score: 90, cefr: 'A2' },
          writing: { score: 80, cefr: 'A1+' },
          vocabulary: { score: 92, cefr: 'A2' },
          grammar: { score: 84, cefr: 'A1+' },
          pronunciation: { score: 82, cefr: 'A1+' }
        },
        canDo: ['Express future expectations using will/won\'t', 'Solve CLIL fingerprint lab puzzles'],
        developing: ['Conditional clauses (If it rains...)'],
        needsPractice: ['Writing multi-paragraph diary entries'],
        badges: [{ id: 'b1', name: 'Word Explorer', icon: '🧭', desc: 'Expert badge', date: 'Sep 2' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'Anita Patel', relation: 'Mother', email: 'anita.p@example.com', phone: '+1 555-0166' }
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
        avatar: {
          style: 'braids',
          hair: 'braids',
          hairColor: '#172554',
          outfit: 'sweater',
          accessory: 'glasses',
          bg: '#f1f5f9'
        },
        skills: {
          speaking: { score: 82, cefr: 'A1+' },
          listening: { score: 84, cefr: 'A1+' },
          reading: { score: 86, cefr: 'A2' },
          writing: { score: 76, cefr: 'A1+' },
          vocabulary: { score: 88, cefr: 'A1+' },
          grammar: { score: 80, cefr: 'A1+' },
          pronunciation: { score: 80, cefr: 'A1+' }
        },
        canDo: ['Give sensible advice with should/shouldn\'t', 'Calculate restaurant menus and bills'],
        developing: ['Past continuous story narration'],
        needsPractice: ['Prepositions in/at/on with time'],
        badges: [{ id: 'b2', name: 'Monster Master', icon: '👾', desc: 'Master creature', date: 'Aug 25' }],
        unlockedWorlds: [{ id: 'w1', name: 'My World', icon: '🌳', status: 'completed', progress: 100 }],
        teacherNotes: [],
        parentContact: { name: 'David Martin', relation: 'Father', email: 'david.m@example.com', phone: '+1 555-0133' }
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
          'Apply correct adjective order: size + color + noun ("three big purple horns")',
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
          'Describe jungle habitats, layers, and conservation ranger tasks'
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
        gameId: 'monster-day',
        gameRoute: 'monster-day/index.html',
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
        gameId: 'restaurant',
        gameRoute: 'restaurant/index.html',
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
        gameId: 'neighbourhood',
        gameRoute: 'neighbourhood/index.html',
        dueDate: 'Sep 15, 2026',
        objectives: ['There is / There are', 'Next to, between, opposite'],
        assignedCount: 6,
        completedCount: 2,
        avgScore: 75,
        status: 'active'
      },
      {
        id: 'asg-4',
        classId: 'class-4b',
        title: 'Professor Should\'s Dilemmas',
        type: 'grammar',
        gameId: 'advice',
        gameRoute: 'advice/index.html',
        dueDate: 'Sep 14, 2026',
        objectives: ['Should & shouldn\'t', 'Giving advice'],
        assignedCount: 2,
        completedCount: 2,
        avgScore: 92,
        status: 'completed'
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
        imageSvg: `
          <svg viewBox="0 0 400 200" width="100%" height="100%">
            <rect width="400" height="200" fill="#f5f3ff"/>
            <rect x="160" y="50" width="80" height="90" rx="36" fill="#8b5cf6"/>
            <circle cx="185" cy="85" r="10" fill="#fff"/><circle cx="185" cy="85" r="4" fill="#1e1b4b"/>
            <circle cx="215" cy="85" r="10" fill="#fff"/><circle cx="215" cy="85" r="4" fill="#1e1b4b"/>
            <circle cx="200" cy="70" r="12" fill="#fff"/><circle cx="200" cy="70" r="5" fill="#1e1b4b"/>
            <path d="M 180 115 Q 200 130 220 115" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
            <polygon points="160,55 145,25 175,45" fill="#fbbf24"/>
            <polygon points="240,55 255,25 225,45" fill="#fbbf24"/>
          </svg>`,
        likes: 12,
        comments: [
          { author: 'Li Chen (Emma\'s Mom)', text: 'Emma came home so excited to tell us about her monster! Thank you Ms. Sarah.' },
          { author: 'Sarah Miller (Adam\'s Mom)', text: 'Adam loved the creative speaking part!' }
        ]
      },
      {
        id: 'post-2',
        classId: 'class-3a',
        author: 'Ms. Sarah Jenkins',
        date: 'Yesterday at 16:00',
        content: '📢 Tomorrow we begin our "At the Restaurant" unit! Please encourage your children to look at the dinner menu at home and practice asking for food using "I would like..." 🍕🥗',
        tag: 'Announcement',
        imageSvg: null,
        likes: 8,
        comments: []
      }
    ],
    messages: [
      {
        id: 'msg-emma',
        studentId: 'student-emma',
        parentName: 'Li Chen',
        parentRelation: 'Emma\'s Mother',
        lastActivity: '14:20',
        unread: false,
        threads: [
          { sender: 'teacher', time: 'Yesterday 14:15', text: 'Good afternoon Mrs. Chen! Emma did wonderfully in today\'s speaking reader\'s theater. Her pronunciation of classic story vocabulary was very clear.' },
          { sender: 'parent', time: 'Yesterday 16:40', text: 'Thank you Ms. Sarah! What should we practice at home this weekend?' },
          { sender: 'teacher', time: 'Today 09:10', text: 'I recommend reviewing the short writing sentences and capital letters in the Fire Station worksheet. She\'s doing great!' }
        ]
      },
      {
        id: 'msg-adam',
        studentId: 'student-adam',
        parentName: 'Sarah Miller',
        parentRelation: 'Adam\'s Mother',
        lastActivity: 'Yesterday',
        unread: true,
        threads: [
          { sender: 'teacher', time: 'Sep 2 11:30', text: 'Hi Sarah, Adam has made good progress naming community helpers! We are giving him extra support with modal verbs can/can\'t.' },
          { sender: 'parent', time: 'Yesterday 10:15', text: 'Thanks for letting me know! We\'ll play the Jungle Rangers game together tonight to practice animal abilities.' }
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
      },
      {
        id: 'port-2',
        studentId: 'student-emma',
        title: 'Voice Recording: Ordering at the Pizza Cafe',
        date: 'Aug 28, 2026',
        type: 'Audio Speaking',
        objective: 'Polite requests: "I would like a large cheese pizza, please."',
        teacherComment: 'Clear tone and natural polite intonation.',
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
            // merge with defaults so newly added entities persist
            return Object.assign({}, DEFAULT_DATA, parsed);
          }
        }
      } catch (e) {
        console.warn('SchoolStore: Failed to load from localStorage, using seed defaults', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
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
      this.state = JSON.parse(JSON.stringify(DEFAULT_DATA));
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

    // Role & Navigation getters/setters
    getRole() { return this.state.currentRole; }
    setRole(role) {
      this.state.currentRole = role;
      this.saveState();
    }

    getActiveClass() {
      return this.state.classes.find(c => c.id === this.state.activeClassId) || this.state.classes[0];
    }

    setActiveClass(classId) {
      this.state.activeClassId = classId;
      this.saveState();
    }

    getActiveStudent() {
      return this.state.students.find(s => s.id === this.state.activeStudentId) || this.state.students[0];
    }

    setActiveStudent(studentId) {
      this.state.activeStudentId = studentId;
      this.saveState();
    }

    // Class Management
    getClasses() { return this.state.classes; }
    addClass(classObj) {
      const newClass = Object.assign({
        id: 'class-' + Date.now(),
        studentCount: 0,
        avgProgress: 0,
        attendanceRate: 100,
        color: '#2563eb'
      }, classObj);
      this.state.classes.push(newClass);
      this.saveState();
      return newClass;
    }

    // Student Management
    getStudentsByClass(classId) {
      return this.state.students.filter(s => s.classId === classId);
    }

    getStudent(studentId) {
      return this.state.students.find(s => s.id === studentId);
    }

    addStudent(studentObj) {
      const newStudent = Object.assign({
        id: 'student-' + Date.now(),
        xp: 0,
        streakDays: 0,
        overallCefr: 'A1',
        avatar: {
          style: 'explorer',
          hair: 'short',
          hairColor: '#0f172a',
          outfit: 'tshirt',
          accessory: 'none',
          bg: '#dbeafe'
        },
        skills: {
          speaking: { score: 70, cefr: 'A1' },
          listening: { score: 75, cefr: 'A1' },
          reading: { score: 75, cefr: 'A1' },
          writing: { score: 60, cefr: 'Pre-A1' },
          vocabulary: { score: 75, cefr: 'A1' },
          grammar: { score: 65, cefr: 'A1' },
          pronunciation: { score: 70, cefr: 'A1' }
        },
        canDo: ['Follow basic classroom instructions'],
        developing: ['Forming simple sentences'],
        needsPractice: ['Punctuation and spelling'],
        badges: [],
        unlockedWorlds: [
          { id: 'w1', name: 'My World', icon: '🌳', status: 'active', progress: 10 }
        ],
        teacherNotes: []
      }, studentObj);

      this.state.students.push(newStudent);
      const c = this.state.classes.find(cl => cl.id === newStudent.classId);
      if (c) c.studentCount = this.getStudentsByClass(c.id).length;
      this.saveState();
      return newStudent;
    }

    updateStudent(studentId, updates) {
      const s = this.getStudent(studentId);
      if (s) {
        Object.assign(s, updates);
        this.saveState();
      }
    }

    addTeacherNote(studentId, noteText) {
      const s = this.getStudent(studentId);
      if (s) {
        if (!s.teacherNotes) s.teacherNotes = [];
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        s.teacherNotes.unshift({
          id: 'note-' + Date.now(),
          date: dateStr,
          note: noteText
        });
        this.saveState();
      }
    }

    // Attendance
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

    // Assignments
    getAssignments(classId) {
      if (classId) {
        return this.state.assignments.filter(a => a.classId === classId);
      }
      return this.state.assignments;
    }

    addAssignment(asgObj) {
      const newAsg = Object.assign({
        id: 'asg-' + Date.now(),
        assignedCount: this.getStudentsByClass(asgObj.classId).length,
        completedCount: 0,
        avgScore: 0,
        status: 'active'
      }, asgObj);
      this.state.assignments.unshift(newAsg);
      this.saveState();
      return newAsg;
    }

    // Gamification Engine
    awardStudentXP(studentId, amount, reason) {
      const s = this.getStudent(studentId);
      if (s) {
        s.xp = (s.xp || 0) + amount;
        this.checkWorldUnlocks(s);
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

    // Class Story
    getClassStory(classId) {
      return this.state.classStory.filter(p => !classId || p.classId === classId);
    }

    addStoryPost(postObj) {
      const newPost = Object.assign({
        id: 'post-' + Date.now(),
        date: 'Just now',
        author: this.state.teacher.name,
        likes: 0,
        comments: []
      }, postObj);
      this.state.classStory.unshift(newPost);
      this.saveState();
      return newPost;
    }

    likeStoryPost(postId) {
      const post = this.state.classStory.find(p => p.id === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        this.saveState();
      }
    }

    // Messages
    getMessageThreads() {
      return this.state.messages;
    }

    sendParentMessage(threadId, text) {
      const thread = this.state.messages.find(m => m.id === threadId);
      if (thread) {
        thread.threads.push({
          sender: this.state.currentRole === 'parent' ? 'parent' : 'teacher',
          time: 'Just now',
          text: text
        });
        thread.lastActivity = 'Just now';
        this.saveState();
      }
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

        // Record into student portfolio
        this.state.portfolio.unshift({
          id: 'port-' + Date.now(),
          studentId: targetId,
          title: 'Game Challenge: ' + activityId,
          date: 'Just now',
          type: 'Interactive Game',
          score: pct + '%',
          objective: objectives ? objectives.join(', ') : 'ESL Activity Mastery',
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

  // Expose singleton to window and modules
  const storeInstance = new SchoolStore();
  if (typeof window !== 'undefined') {
    window.schoolStore = storeInstance;
    window.completeActivity = function(data) {
      return storeInstance.completeActivity(data);
    };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SchoolStore, schoolStore: storeInstance };
  }
})();
