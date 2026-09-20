/**
 * THE MYSTERY OF YESTERDAY — PEDAGOGICAL DATA & ADVENTURE ASSETS
 * Authoritative learning repository for 35-Minute Past Simple Lesson (A1/A1+ CEFR)
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. TARGET PAST SIMPLE VERBS (A1 / A1+)
  // =========================================================================
  const TARGET_VERBS = [
    { base: 'go', past: 'went', type: 'irregular', icon: '🏃', sentence: 'Yesterday I went to school.', question: 'Did you go to school?' },
    { base: 'eat', past: 'ate', type: 'irregular', icon: '🍕', sentence: 'Yesterday I ate pizza.', question: 'Did you eat pizza?' },
    { base: 'see', past: 'saw', type: 'irregular', icon: '👀', sentence: 'Yesterday I saw a dinosaur.', question: 'Did you see a dinosaur?' },
    { base: 'play', past: 'played', type: 'regular', icon: '⚽', sentence: 'Yesterday I played football.', question: 'Did you play football?' },
    { base: 'watch', past: 'watched', type: 'regular', icon: '📺', sentence: 'Yesterday I watched a cartoon.', question: 'Did you watch a cartoon?' },
    { base: 'visit', past: 'visited', type: 'regular', icon: '🏡', sentence: 'Yesterday I visited my grandma.', question: 'Did you visit your grandma?' },
    { base: 'have', past: 'had', type: 'irregular', icon: '🎒', sentence: 'Yesterday I had an English lesson.', question: 'Did you have an English lesson?' },
    { base: 'run', past: 'ran', type: 'irregular', icon: '⚡', sentence: 'Yesterday I ran in the park.', question: 'Did you run in the park?' }
  ];

  // =========================================================================
  // 2. LEVEL 1: THE MYSTERY BEGINS (0–5 MIN)
  // =========================================================================
  const LEVEL1_DATA = {
    title: 'The Mystery Begins',
    time: '0–5 min',
    boxStory: {
      headline: 'Mystery at Adventure School!',
      text: 'Yesterday, something strange happened at Adventure School...\nThe teacher found a mysterious box. 📦\nThere was a note inside:',
      noteSnippet: '"I did THREE things yesterday.\nTWO are TRUE.\nONE is a LIE.\nFind the lie and open the box!"'
    },
    visualVerbs: [
      { base: 'GO', past: 'WENT', icon: '🏃', label: 'Go → Went', actionText: 'Yesterday I went to school.' },
      { base: 'EAT', past: 'ATE', icon: '🍕', label: 'Eat → Ate', actionText: 'Yesterday I ate pizza.' },
      { base: 'SEE', past: 'SAW', icon: '🦖', label: 'See → Saw', actionText: 'Yesterday I saw a dinosaur!' }
    ],
    teacherStatements: [
      { id: 's1', text: '1. Yesterday I went to school. 🏫', isLie: false, tag: 'TRUE' },
      { id: 's2', text: '2. Yesterday I ate pizza. 🍕', isLie: false, tag: 'TRUE' },
      { id: 's3', text: '3. Yesterday I saw a dinosaur! 🦖', isLie: true, tag: 'LIE' }
    ],
    dinosaurQuestion: {
      prompt: "Did the teacher really see a dinosaur yesterday?",
      options: [
        { text: "👍 YES, you did!", value: "yes", isCorrect: false, feedback: "Wait a second! Dinosaurs lived millions of years ago! Dinosaurs are extinct!" },
        { text: "👎 NO, you didn't!", value: "no", isCorrect: true, feedback: "Spot on, Detective! That was the LIE! Dinosaurs lived millions of years ago!" }
      ],
      ruleDiscovery: "💡 DETECTIVE DISCOVERY: We use Past Simple (went, ate, saw) for actions completed YESTERDAY!"
    }
  };

  // =========================================================================
  // 3. LEVEL 2: RUN TO THE ANSWER (5–10 MIN)
  // =========================================================================
  const LEVEL2_DATA = {
    title: 'Run to the Answer!',
    time: '5–10 min',
    instructions: 'Look at the Smart Board! Move or point to the correct Past Simple verb!',
    questions: [
      {
        id: 'q1',
        prompt: 'Yesterday I ___ pizza.',
        icon: '🍕',
        options: ['GO', 'EAT', 'ATE'],
        correctIndex: 2,
        correctVerb: 'ATE',
        speech: 'Yesterday I ate pizza.',
        explanation: 'Eat becomes ATE in the past! Super job!'
      },
      {
        id: 'q2',
        prompt: 'Yesterday I ___ to the park.',
        icon: '🌳',
        options: ['GO', 'WENT', 'SEE'],
        correctIndex: 1,
        correctVerb: 'WENT',
        speech: 'Yesterday I went to the park.',
        explanation: 'Go becomes WENT in the past! Fantastic!'
      },
      {
        id: 'q3',
        prompt: 'Yesterday I ___ a funny dog.',
        icon: '🐶',
        options: ['SAW', 'SEE', 'EAT'],
        correctIndex: 0,
        correctVerb: 'SAW',
        speech: 'Yesterday I saw a funny dog.',
        explanation: 'See becomes SAW in the past! Sharp eyes, Detective!'
      },
      {
        id: 'q4',
        prompt: 'Yesterday I ___ football with my friends.',
        icon: '⚽',
        options: ['PLAY', 'PLAYED', 'WATCH'],
        correctIndex: 1,
        correctVerb: 'PLAYED',
        speech: 'Yesterday I played football with my friends.',
        explanation: 'For regular verbs, we add -ED! Play becomes PLAYED!'
      },
      {
        id: 'q5',
        prompt: 'Yesterday I ___ an exciting movie on TV.',
        icon: '📺',
        options: ['WATCH', 'WATCHED', 'VISITED'],
        correctIndex: 1,
        correctVerb: 'WATCHED',
        speech: 'Yesterday I watched an exciting movie on TV.',
        explanation: 'Watch becomes WATCHED! Five in a row! Detective streak!'
      }
    ]
  };

  // =========================================================================
  // 4. LEVEL 3: TWO TRUTHS & ONE LIE (10–18 MIN)
  // =========================================================================
  const LEVEL3_DATA = {
    title: 'Two Truths & One Lie',
    time: '10–18 min',
    tagline: 'TWO are TRUE. ONE is a LIE. Vote 1️⃣, 2️⃣, or 3️⃣!',
    rounds: [
      {
        roundNumber: 1,
        theme: "Space Adventure",
        difficulty: "Easy (Absurd Lie)",
        cards: [
          { num: 1, text: "Yesterday, I played football.", icon: "⚽", isLie: false, tag: "TRUE" },
          { num: 2, text: "Yesterday, I ate pizza.", icon: "🍕", isLie: false, tag: "TRUE" },
          { num: 3, text: "Yesterday, I flew to the moon on a rocket!", icon: "🚀", isLie: true, tag: "LIE" }
        ],
        lieIndex: 2,
        explanation: "Number 3 was the LIE! You did not fly to the moon yesterday! You were in class!",
        didQuestion: "Did you fly to the moon? → No, I didn't!"
      },
      {
        roundNumber: 2,
        theme: "Animal Magic",
        difficulty: "Medium (Silly Lie)",
        cards: [
          { num: 1, text: "Yesterday, I saw a brown bird in the garden.", icon: "🐦", isLie: false, tag: "TRUE" },
          { num: 2, text: "Yesterday, I talked to a pink dancing elephant.", icon: "🐘", isLie: true, tag: "LIE" },
          { num: 3, text: "Yesterday, I drank a glass of orange juice.", icon: "🍊", isLie: false, tag: "TRUE" }
        ],
        lieIndex: 1,
        explanation: "Number 2 was the LIE! Elephants don't wear pink dresses or speak English!",
        didQuestion: "Did you talk to an elephant? → No, I didn't!"
      },
      {
        roundNumber: 3,
        theme: "Greedy Monster Lunch",
        difficulty: "Medium (Hyperbolic Lie)",
        cards: [
          { num: 1, text: "Yesterday, I ate twenty giant hamburgers for lunch!", icon: "🍔", isLie: true, tag: "LIE" },
          { num: 2, text: "Yesterday, I watched a movie with my family.", icon: "🎬", isLie: false, tag: "TRUE" },
          { num: 3, text: "Yesterday, I went to sleep at nine o'clock.", icon: "😴", isLie: false, tag: "TRUE" }
        ],
        lieIndex: 0,
        explanation: "Number 1 was the LIE! Twenty giant hamburgers would make your tummy explode!",
        didQuestion: "Did you eat twenty hamburgers? → No, I didn't!"
      },
      {
        roundNumber: 4,
        theme: "Clever Weekend",
        difficulty: "Hard (Believable Lie - Listen Carefully!)",
        cards: [
          { num: 1, text: "Yesterday, I watched TV in the evening.", icon: "📺", isLie: false, tag: "TRUE" },
          { num: 2, text: "Yesterday, I played football in the afternoon.", icon: "⚽", isLie: false, tag: "TRUE" },
          { num: 3, text: "Yesterday, I visited my grandmother in Antarctica!", icon: "❄️", isLie: true, tag: "LIE" }
        ],
        lieIndex: 2,
        explanation: "Number 3 was the LIE! Grandmother lives in town, not with the penguins in Antarctica!",
        didQuestion: "Did you visit grandma in Antarctica? → No, I didn't!"
      }
    ]
  };

  // =========================================================================
  // 5. LEVEL 4: CRAZY SUSPECT (18–25 MIN)
  // =========================================================================
  const LEVEL4_DATA = {
    title: "Crazy Suspect: The Monster!",
    time: "18–25 min",
    suspectName: "Barnaby the Berry Monster 🧟",
    suspectDescription: "A friendly blue-green furry monster caught near the mystery box.",
    introSpeech: "Grrr! Hello Detectives! I did three things yesterday! Which one is my LIE?",
    monsterStatements: [
      { id: "m1", text: "1. Yesterday I went to school. 🏫", isLie: false },
      { id: "m2", text: "2. Yesterday I ate five pizzas. 🍕", isLie: false },
      { id: "m3", text: "3. Yesterday I saw a dinosaur. 🦖", isLie: true }
    ],
    interrogationQuestions: [
      {
        id: "q1",
        text: "Did you go to school?",
        response: "YES, I DID! 😄",
        responseSpeech: "Yes, I did! I love English school! I sat at the big desk!",
        monsterEmotion: "happy",
        isLieQuestion: false
      },
      {
        id: "q2",
        text: "Did you eat pizza?",
        response: "YES, I DID! 😋",
        responseSpeech: "Yes, I did! I was super hungry! Mushroom, cheese, and berry pizza! Delicious!",
        monsterEmotion: "laughing",
        isLieQuestion: false
      },
      {
        id: "q3",
        text: "Did you see a dinosaur?",
        response: "NO, I DIDN'T! 😈",
        responseSpeech: "No, I didn't! You caught me! It was just a little green lizard in the grass! That was my LIE!",
        monsterEmotion: "caught",
        isLieQuestion: true
      }
    ],
    dialogueDrill: {
      prompt: "Practice with your detective partner:",
      frameQuestion: "A: Did you [verb] yesterday?",
      frameAnswerYes: "B: Yes, I did!",
      frameAnswerNo: "B: No, I didn't!"
    }
  };

  // =========================================================================
  // 6. LEVEL 5: STUDENTS BECOME SUSPECTS (25–31 MIN)
  // =========================================================================
  const LEVEL5_DATA = {
    title: "Students Become Suspects",
    time: "25–31 min",
    instructions: "Choose THREE action cards. Pick ONE to be your secret LIE! Then challenge Team B!",
    actionPalette: [
      { id: "act-go", base: "go", past: "went", icon: "🏃", options: ["to the park", "to the zoo", "to the moon", "to school"] },
      { id: "act-eat", base: "eat", past: "ate", icon: "🍕", options: ["a big pizza", "strawberry ice cream", "ten burgers", "a smelly shoe"] },
      { id: "act-play", base: "play", past: "played", icon: "⚽", options: ["football", "computer games", "with a robot", "basketball"] },
      { id: "act-watch", base: "watch", past: "watched", icon: "📺", options: ["a funny cartoon", "a movie", "TV with grandma", "a football match"] },
      { id: "act-see", base: "see", past: "saw", icon: "🐶", options: ["a cute dog", "a flying pig", "a golden spaceship", "a rainbow"] },
      { id: "act-visit", base: "visit", past: "visited", icon: "🏡", options: ["my grandparents", "a dinosaur museum", "planet Mars", "my best friend"] },
      { id: "act-sleep", base: "sleep", past: "slept", icon: "😴", options: ["for ten hours", "in a cozy tent", "on the classroom roof", "in bed"] },
      { id: "act-run", base: "run", past: "ran", icon: "⚡", options: ["very fast", "in the school race", "away from a bee", "in the rain"] }
    ],
    presetChallenges: [
      {
        author: "Detective Sam",
        s1: "Yesterday I went to the park. 🌳",
        s2: "Yesterday I played football with my cat. 🐱",
        s3: "Yesterday I ate chocolate cake. 🎂",
        lieSlot: 2,
        explanation: "Cats don't play football!"
      },
      {
        author: "Detective Lily",
        s1: "Yesterday I watched TV. 📺",
        s2: "Yesterday I saw a spaceship in my kitchen. 🛸",
        s3: "Yesterday I visited my grandma. 🏡",
        lieSlot: 2,
        explanation: "Spaceships don't land in kitchens!"
      }
    ]
  };

  // =========================================================================
  // 7. LEVEL 6: FINAL DETECTIVE CHALLENGE (31–35 MIN)
  // =========================================================================
  const LEVEL6_DATA = {
    title: "Final Detective Challenge",
    time: "31–35 min",
    caseTitle: "The Mystery of Mia's Sunday",
    storyPassage: [
      "Yesterday, Mia went to the park. 🌳",
      "She played football with her friends. ⚽",
      "She ate delicious ice cream. 🍦",
      "She saw a giant purple dragon breathing fire! 🐉"
    ],
    challenge1: {
      question: "Which sentence is the LIE?",
      options: [
        "1. Mia went to the park.",
        "2. She played football.",
        "3. She ate ice cream.",
        "4. She saw a giant purple dragon! 🐉"
      ],
      correctIndex: 3,
      explanation: "Sentence 4 is the LIE! Dragons are mythical creatures!"
    },
    challenge2: {
      question: 'Detective Question: "Did Mia see a dragon yesterday?"',
      options: [
        "Yes, she did. 😄",
        "No, she didn't. 🕵️"
      ],
      correctIndex: 1,
      correctSpeech: "No, she didn't! Dragons do not exist!",
      explanation: "Grammar Rule: Did Mia see...? → No, she didn't!"
    },
    unlockReward: {
      xpBonus: 100,
      badgeName: "MASTER DETECTIVE 🏆",
      badgeDesc: "Official Past Simple Detective Certificate & Golden Magnifying Glass",
      finalMessage: "🎉 MYSTERY SOLVED! The mysterious box is open! You have mastered the Past Simple!"
    }
  };

  // =========================================================================
  // 8. 8-DIMENSION TEACHER HUD REPOSITORIES (35-MIN LESSON PLAN)
  // =========================================================================
  const TEACHER_HUD_GUIDES = {
    1: {
      level: 1,
      name: "The Mystery Begins (0–5 min)",
      objective: "Hook learners via curiosity; notice Past Simple forms (went, ate, saw) without explicit grammar lecturing.",
      timing: "00:00 – 05:00 (5 minutes)",
      teacherScript: "Good morning Detectives! Look at this mysterious box on my desk... It arrived yesterday! Let's tap it to see what's inside!",
      physicalAction: "Students tap their desks like drums to build suspense, then vote YES/NO with thumbs up/down.",
      formFocus: "Past affirmative: went, ate, saw. Notice that these describe YESTERDAY.",
      commonErrors: "Saying 'Yesterday I go' or 'Yesterday I see'. Remind: 'Yesterday = different word!'",
      smartBoardTip: "Touch the box to make it shake. Give classroom points for confident voting.",
      differentiation: "Support: Use picture flashcards for go/eat/see. Challenge: Ask 'Why is the dinosaur a lie?'"
    },
    2: {
      level: 2,
      name: "Run to the Answer (5–10 min)",
      objective: "Kinesthetic retrieval practice of high-frequency Past Simple irregular and regular verbs.",
      timing: "05:00 – 10:00 (5 minutes)",
      teacherScript: "Detectives on your feet! When you see the missing word, point or take two steps toward the correct answer!",
      physicalAction: "Whole-class movement: Point left, center, or right (or sprint in designated classroom zones).",
      formFocus: "Verb transformation: eat → ate, go → went, see → saw, play → played, watch → watched.",
      commonErrors: "Confusing base form and past form (e.g. choosing 'eat' instead of 'ate').",
      smartBoardTip: "Tap the answer card to reveal instant feedback and hear the audio pronunciation.",
      differentiation: "Support: Underline the clue 'Yesterday'. Challenge: Have students repeat the full sentence in a detective voice."
    },
    3: {
      level: 3,
      name: "Two Truths & One Lie (10–18 min)",
      objective: "Core communicative game: listen critically, identify the false statement, and formulate 'Did you...?' questions.",
      timing: "10:00 – 18:00 (8 minutes)",
      teacherScript: "Two are TRUE. One is a LIE. Read with me... Which one is completely impossible? Ready? 3, 2, 1... VOTE!",
      physicalAction: "Hold up 1, 2, or 3 fingers. Dramatic countdown chant: '3... 2... 1... CATCH THE LIE!'",
      formFocus: "Discourse context and real-world logic: evaluating plausibility using Past Simple sentences.",
      commonErrors: "Voting before hearing all three options. Insist: 'Listen to 1, listen to 2, listen to 3 first!'",
      smartBoardTip: "Press the Countdown button to trigger suspense sound before stamping the LIE in red.",
      differentiation: "Support: Visual icons on cards clarify meaning. Challenge: Students explain WHY it is a lie."
    },
    4: {
      level: 4,
      name: "Crazy Suspect Interrogation (18–25 min)",
      objective: "Interactive questioning with 'Did you...?' and short answers 'Yes, I did / No, I didn't'.",
      timing: "18:00 – 25:00 (7 minutes)",
      teacherScript: "We have a suspect! Barnaby the Berry Monster! Let's interrogate him. Ask him: 'Did you go to school?'",
      physicalAction: "Students raise magnifying glasses (or hands shaped like binoculars) and speak to the monster in unison.",
      formFocus: "Question inversion: 'Did you [base verb]...?' (Notice: Did you GO, not Did you went!). Short answers: 'Yes, I did / No, I didn't'.",
      commonErrors: "Saying 'Did you went?' or 'Did you saw?'. Rule chant: 'DID steals the past! Verb stays base!'",
      smartBoardTip: "Click the questions on screen to trigger the monster's dynamic voice and emotional animations.",
      differentiation: "Support: Display sentence frame: 'Did you + [verb]?'. Challenge: Students invent a 4th question for Barnaby."
    },
    5: {
      level: 5,
      name: "Students Become Suspects (25–31 min)",
      objective: "Productive sentence synthesis: build 2 Truths + 1 Lie and engage in peer interrogation.",
      timing: "25:00 – 31:00 (6 minutes)",
      teacherScript: "Now YOU are the suspects! Team A builds 3 sentences. One must be a sneaky lie. Team B will interrogate you!",
      physicalAction: "Pair or team stand-up challenge: Team A reads; Team B whispers, confers, and stamps TRUE or LIE.",
      formFocus: "First-person production: 'Yesterday I [went / ate / played / watched / visited]...'",
      commonErrors: "Mixing tenses (e.g. 'Yesterday I play'). Prompt: 'What does play become in the past? -ED!'",
      smartBoardTip: "Use the interactive sentence builder to create and display a team's live challenge on the Smart Board.",
      differentiation: "Support: Use pre-built cards from the palette. Challenge: Students create their own sentences on paper."
    },
    6: {
      level: 6,
      name: "Final Detective Challenge (31–35 min)",
      objective: "Consolidation, reading comprehension, mastery check, and celebratory gamified payoff.",
      timing: "31:00 – 35:00 (4 minutes)",
      teacherScript: "Final case file, Detectives! Look at Mia's Sunday... Which sentence opens the mystery box?",
      physicalAction: "Drumroll on desks, hands up for the final vote, celebration cheer when the box unlocks!",
      formFocus: "Complete mastery check: 3rd person Past Simple ('She went, she played, she ate, she saw') and short answer ('No, she didn't').",
      commonErrors: "Rushing without reading all sentences. Encourage scanning for the impossible detail.",
      smartBoardTip: "Click 'UNLOCK THE BOX' to fire gold particles, confetti, and play the victory fanfare.",
      differentiation: "Support: Point to the dragon icon. Challenge: Hand out the printable Detective Certificate from the worksheet."
    }
  };

  // Export to global scope
  root.DETECTIVES_DATA = {
    TARGET_VERBS,
    LEVEL1_DATA,
    LEVEL2_DATA,
    LEVEL3_DATA,
    LEVEL4_DATA,
    LEVEL5_DATA,
    LEVEL6_DATA,
    TEACHER_HUD_GUIDES
  };

})(typeof window !== 'undefined' ? window : global);
