/**
 * YESTERDAY DETECTIVES — PEDAGOGICAL DATA & MYSTERY ASSETS
 * Authoritative learning repository for Past Simple ESL (A1+ CEFR)
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. VERBS DATA: REGULAR & IRREGULAR
  // =========================================================================

  const REGULAR_VERBS = [
    {
      base: 'play',
      past: 'played',
      type: 'regular',
      icon: '⚽',
      category: 'Sports & Games',
      examplePresent: 'I play football today.',
      examplePast: 'I played football yesterday.',
      question: 'Did you play football yesterday?',
      negative: "I didn't play football yesterday.",
      imageDesc: 'A child kicking a soccer ball'
    },
    {
      base: 'watch',
      past: 'watched',
      type: 'regular',
      icon: '📺',
      category: 'Home & Media',
      examplePresent: 'She watches TV today.',
      examplePast: 'She watched TV yesterday.',
      question: 'Did she watch TV yesterday?',
      negative: "She didn't watch TV yesterday.",
      imageDesc: 'Watching an exciting movie on television'
    },
    {
      base: 'visit',
      past: 'visited',
      type: 'regular',
      icon: '🏡',
      category: 'Family & Friends',
      examplePresent: 'We visit grandma today.',
      examplePast: 'We visited grandma yesterday.',
      question: 'Did you visit grandma yesterday?',
      negative: "We didn't visit grandma yesterday.",
      imageDesc: 'Visiting grandparents at their house'
    },
    {
      base: 'clean',
      past: 'cleaned',
      type: 'regular',
      icon: '🧹',
      category: 'Chore',
      examplePresent: 'He cleans his room today.',
      examplePast: 'He cleaned his room yesterday.',
      question: 'Did he clean his room yesterday?',
      negative: "He didn't clean his room yesterday.",
      imageDesc: 'Sweeping and tidying up a bedroom'
    },
    {
      base: 'walk',
      past: 'walked',
      type: 'regular',
      icon: '🚶',
      category: 'Movement',
      examplePresent: 'They walk to the park today.',
      examplePast: 'They walked to the park yesterday.',
      question: 'Did they walk to the park yesterday?',
      negative: "They didn't walk to the park yesterday.",
      imageDesc: 'Walking down a sunny park path'
    },
    {
      base: 'jump',
      past: 'jumped',
      type: 'regular',
      icon: '🦘',
      category: 'Action',
      examplePresent: 'The puppy jumps high today.',
      examplePast: 'The puppy jumped high yesterday.',
      question: 'Did the puppy jump high yesterday?',
      negative: "The puppy didn't jump high yesterday.",
      imageDesc: 'A playful puppy jumping in the air'
    }
  ];

  const IRREGULAR_VERBS = [
    {
      base: 'go',
      past: 'went',
      type: 'irregular',
      icon: '🚌',
      category: 'Travel',
      examplePresent: 'I go to the zoo today.',
      examplePast: 'I went to the zoo yesterday.',
      question: 'Did you go to the zoo yesterday?',
      negative: "I didn't go to the zoo yesterday.",
      imageDesc: 'Riding a big yellow bus to the zoo'
    },
    {
      base: 'eat',
      past: 'ate',
      type: 'irregular',
      icon: '🍕',
      category: 'Food',
      examplePresent: 'They eat delicious pizza today.',
      examplePast: 'They ate delicious pizza yesterday.',
      question: 'Did they eat pizza yesterday?',
      negative: "They didn't eat pizza yesterday.",
      imageDesc: 'Enjoying a slice of hot cheese pizza'
    },
    {
      base: 'see',
      past: 'saw',
      type: 'irregular',
      icon: '🦁',
      category: 'Observation',
      examplePresent: 'I see a wild lion today.',
      examplePast: 'I saw a wild lion yesterday.',
      question: 'Did you see a wild lion yesterday?',
      negative: "I didn't see a wild lion yesterday.",
      imageDesc: 'Looking through binoculars at a golden lion'
    },
    {
      base: 'ride',
      past: 'rode',
      type: 'irregular',
      icon: '🚲',
      category: 'Movement',
      examplePresent: 'She rides her bicycle today.',
      examplePast: 'She rode her bicycle yesterday.',
      question: 'Did she ride her bicycle yesterday?',
      negative: "She didn't ride her bicycle yesterday.",
      imageDesc: 'Pedaling happily on a red bicycle'
    },
    {
      base: 'have',
      past: 'had',
      type: 'irregular',
      icon: '🎈',
      category: 'Experience',
      examplePresent: 'We have a great party today.',
      examplePast: 'We had a great party yesterday.',
      question: 'Did you have a party yesterday?',
      negative: "We didn't have a party yesterday.",
      imageDesc: 'Celebrating with balloons and party hats'
    },
    {
      base: 'find',
      past: 'found',
      type: 'irregular',
      icon: '🔍',
      category: 'Discovery',
      examplePresent: 'The detective finds a secret clue.',
      examplePast: 'The detective found a secret clue.',
      question: 'Did the detective find a clue?',
      negative: "The detective didn't find a clue.",
      imageDesc: 'Using a magnifying glass to inspect footprints'
    }
  ];

  const ALL_VERBS = [...REGULAR_VERBS, ...IRREGULAR_VERBS];

  // =========================================================================
  // 2. STAGE 5: MEMORY THIEF 10-CARD DECK
  // =========================================================================

  const MEMORY_THIEF_DECK = [
    { id: 'c1', label: 'Pizza', icon: '🍕', pastAction: 'ate pizza', sentence: 'The detective ate pizza.' },
    { id: 'c2', label: 'Lion', icon: '🦁', pastAction: 'saw a lion', sentence: 'The girl saw a lion.' },
    { id: 'c3', label: 'Football', icon: '⚽', pastAction: 'played football', sentence: 'The boy played football.' },
    { id: 'c4', label: 'Guitar', icon: '🎸', pastAction: 'played guitar', sentence: 'The detective played the guitar.' },
    { id: 'c5', label: 'Bus', icon: '🚌', pastAction: 'went on a bus', sentence: 'They went on a bus.' },
    { id: 'c6', label: 'Ice Cream', icon: '🍦', pastAction: 'ate ice cream', sentence: 'She ate cold ice cream.' },
    { id: 'c7', label: 'Dog', icon: '🐶', pastAction: 'saw a dog', sentence: 'He saw a playful dog.' },
    { id: 'c8', label: 'Bicycle', icon: '🚲', pastAction: 'rode a bicycle', sentence: 'She rode her bicycle.' },
    { id: 'c9', label: 'Book', icon: '📚', pastAction: 'read a book', sentence: 'He read a mystery book.' },
    { id: 'c10', label: 'Cake', icon: '🎂', pastAction: 'had a birthday cake', sentence: 'They had a delicious cake.' }
  ];

  const MEMORY_ROUNDS = [
    { round: 1, title: 'Round 1 (Warm Up)', hideCount: 2, desc: 'Remember the cards! 2 cards will disappear!' },
    { round: 2, title: 'Round 2 (Challenging)', hideCount: 3, desc: 'Careful! 3 cards will disappear this time!' },
    { round: 3, title: 'Round 3 (Shuffle Shift)', hideCount: 2, shuffle: true, desc: 'The cards shifted positions AND 2 vanished!' },
    { round: 4, title: 'Round 4 (The Imposter Swapper)', isSwap: true, desc: 'HARD: One card was secretly replaced by an imposter object!' }
  ];

  // =========================================================================
  // 3. STAGE 6: FIX THE DETECTIVE MISTAKE REPAIR BANK
  // =========================================================================

  const FIX_DETECTIVE_CHALLENGES = [
    {
      broken: 'Did you went to the park?',
      correctVerb: 'go',
      options: ['go', 'went', 'going'],
      fullFixed: 'Did you go to the park?',
      rule: 'Remember: DID steals the past tense! DID + GO (base form).'
    },
    {
      broken: 'Did she ate pizza yesterday?',
      correctVerb: 'eat',
      options: ['eat', 'ate', 'eating'],
      fullFixed: 'Did she eat pizza yesterday?',
      rule: 'Remember: After DID, the verb goes back to normal: DID SHE EAT?'
    },
    {
      broken: "I didn't went home after school.",
      correctVerb: 'go',
      options: ['go', 'went', 'gone'],
      fullFixed: "I didn't go home after school.",
      rule: "Remember: DIDN'T + base verb! ❌ didn't went ➔ ✅ didn't go."
    },
    {
      broken: 'Did they played football in the rain?',
      correctVerb: 'play',
      options: ['play', 'played', 'playing'],
      fullFixed: 'Did they play football in the rain?',
      rule: 'Remove the -ED after DID! DID THEY PLAY?'
    },
    {
      broken: "He didn't saw the secret note.",
      correctVerb: 'see',
      options: ['see', 'saw', 'seen'],
      fullFixed: "He didn't see the secret note.",
      rule: "Negative form: DIDN'T + SEE! The verb returns to base form."
    }
  ];

  // =========================================================================
  // 4. STAGES 7 & 8: SUSPECT STORIES WITH EVIDENCE & LIES
  // =========================================================================

  const SUSPECT_STORIES = [
    {
      id: 'story1',
      suspectName: 'Inspector Sneaky Sam',
      avatar: '🕵️‍♂️',
      intro: 'Yesterday was a very busy day for me, Detective! Here is what I did:',
      statements: [
        { id: 's1', text: 'I went to the zoo.', icon: '🚌', isLie: false },
        { id: 's2', text: 'I saw a big lion.', icon: '🦁', isLie: false },
        { id: 's3', text: 'I ate hot pizza.', icon: '🍕', isLie: false },
        { id: 's4', text: 'I rode a wild horse.', icon: '🐎', isLie: true }
      ],
      evidence: [
        { type: 'ticket', name: 'Zoo Entry Ticket', icon: '🎟️', details: 'Valid: Yesterday 10:30 AM · City Zoo', confirms: 'went to the zoo' },
        { type: 'photo', name: 'Camera Photo', icon: '📸', details: 'Timestamp: 11:15 AM · Big golden lion behind fence', confirms: 'saw a lion' },
        { type: 'receipt', name: 'Luigi’s Pizza Receipt', icon: '🧾', details: 'Timestamp: 1:20 PM · 1x Pepperoni Slice ($3.50)', confirms: 'ate pizza' },
        { type: 'bus', name: 'Bus Ride Card', icon: '🚌', details: 'Timestamp: 2:15 PM · Bus #14 Zoo ➔ Downtown', confirms: 'bus transport' }
      ],
      missingEvidence: 'No horse stables at the zoo, and no horse receipt or photo exists!',
      truthCorrection: "I didn't ride a horse."
    },
    {
      id: 'story2',
      suspectName: 'Clever Chloe',
      avatar: '👩‍🎤',
      intro: 'Detectives, my memory is crystal clear! Yesterday I had a productive afternoon:',
      statements: [
        { id: 's1', text: 'I walked to the public library.', icon: '🚶', isLie: false },
        { id: 's2', text: 'I found an ancient mystery book.', icon: '📚', isLie: false },
        { id: 's3', text: 'I cleaned my entire bedroom.', icon: '🧹', isLie: true },
        { id: 's4', text: 'I visited my friend Leo.', icon: '🏡', isLie: false }
      ],
      evidence: [
        { type: 'receipt', name: 'Library Borrow Card', icon: '📖', details: 'Item: Secrets of Sherlock · Return in 14 days', confirms: 'found a book & walked there' },
        { type: 'photo', name: 'Selfie with Leo', icon: '🤳', details: 'Timestamp: 4:30 PM · Leo’s front porch', confirms: 'visited Leo' },
        { type: 'note', name: 'Mom’s Note', icon: '📝', details: 'Note on desk: "Chloe, your bedroom floor is still messy!"', confirms: 'did not clean room' }
      ],
      missingEvidence: 'Mom’s note proves the bedroom was never cleaned!',
      truthCorrection: "She didn't clean her bedroom."
    }
  ];

  // =========================================================================
  // 5. STAGE 9: INTERROGATION ROOM (DETECTIVE QUESTIONING)
  // =========================================================================

  const INTERROGATION_SUSPECT = {
    name: 'Barnaby the Butler',
    avatar: '🤵',
    initialSpeech: "Ask me anything, Detectives! I have nothing to hide about yesterday!",
    cluesFound: [],
    questions: [
      {
        id: 'q1',
        text: 'Did you go to the kitchen yesterday?',
        answerSpeech: 'Yes, I did! I went to the kitchen at 8:00 AM.',
        answerType: 'yes',
        clue: 'Kitchen attendance confirmed at 8:00 AM.'
      },
      {
        id: 'q2',
        text: 'Did you eat the chocolate cake in the fridge?',
        answerSpeech: "No, I didn't! I never eat sweets on weekdays!",
        answerType: 'no',
        clue: 'Claims he did not eat the chocolate cake (Chocolate stains on sleeve!).'
      },
      {
        id: 'q3',
        text: 'Did you clean the silver spoons?',
        answerSpeech: 'Yes, I did! All twenty spoons were polished before lunch.',
        answerType: 'yes',
        clue: 'Silver spoons are sparkling clean in the dining room.'
      },
      {
        id: 'q4',
        text: 'Did you see who opened the safe?',
        answerSpeech: "No, I didn't! The office door was firmly closed all afternoon.",
        answerType: 'no',
        clue: 'Denies seeing the open safe.'
      },
      {
        id: 'q5',
        text: 'Where did you go at 3:00 PM?',
        answerSpeech: 'I walked in the garden to trim the rose bushes.',
        answerType: 'yes',
        clue: 'Garden shears were found in his coat pocket.'
      }
    ],
    hiddenLieQuestionId: 'q2',
    lieExplanation: 'Barnaby said "No, I didn\'t eat chocolate cake", BUT look at the chocolate frosting on his cuffs! He DID eat the cake!'
  };

  // =========================================================================
  // 6. STAGE 10: BUILD THE STORY (EVENT CARDS)
  // =========================================================================

  const STORY_BUILDER_EVENTS = [
    { id: 'ev1', verbBase: 'play', verbPast: 'played', object: 'football in the park', icon: '⚽', label: 'Play football' },
    { id: 'ev2', verbBase: 'eat', verbPast: 'ate', object: 'a pepperoni pizza', icon: '🍕', label: 'Eat pizza' },
    { id: 'ev3', verbBase: 'see', verbPast: 'saw', object: 'a stray puppy', icon: '🐶', label: 'See a dog' },
    { id: 'ev4', verbBase: 'go', verbPast: 'went', object: 'on the city bus', icon: '🚌', label: 'Ride the bus' },
    { id: 'ev5', verbBase: 'play', verbPast: 'played', object: 'my red electric guitar', icon: '🎸', label: 'Play guitar' },
    { id: 'ev6', verbBase: 'visit', verbPast: 'visited', object: 'my best friend', icon: '🏡', label: 'Visit friend' },
    { id: 'ev7', verbBase: 'find', verbPast: 'found', object: 'a gold coin on the sidewalk', icon: '🪙', label: 'Find a coin' }
  ];

  // =========================================================================
  // 7. STAGE 13: HARD MODE MYSTERY (5-EVENT CHALLENGE)
  // =========================================================================

  const HARD_MODE_CASE = {
    storyText: [
      'Yesterday, Mia visited her grandmother in the morning.',
      'She played with her cute dog in the sunny backyard.',
      'She ate three slices of cheese pizza for lunch.',
      "She didn't watch TV all afternoon.",
      'Finally, she went to the park to meet her friends.'
    ],
    challenges: [
      {
        id: 'h1',
        title: 'Challenge 1: What did Mia do?',
        prompt: 'Which of these did Mia ACTUALLY do yesterday?',
        options: ['She watched TV', 'She visited her grandmother', 'She rode a horse'],
        correctIndex: 1,
        feedback: 'Correct! "Mia visited her grandmother" is one of the completed actions!'
      },
      {
        id: 'h2',
        title: "Challenge 2: What didn't she do?",
        prompt: 'Look at the negative sentence with DIDN\'T:',
        options: ["She didn't eat pizza", "She didn't watch TV", "She didn't play with her dog"],
        correctIndex: 1,
        feedback: 'Sharp eye! "She didn\'t watch TV" is the exact negative structure used!'
      },
      {
        id: 'h3',
        title: 'Challenge 3: Which verbs are IRREGULAR?',
        prompt: 'Identify the two irregular verbs in Mia\'s story:',
        options: ['visited & played', 'ate & went', 'played & watched'],
        correctIndex: 1,
        feedback: 'Brilliant grammar deduction! ATE (eat ➔ ate) and WENT (go ➔ went) are irregular!'
      },
      {
        id: 'h4',
        title: 'Challenge 4: Event Timeline Order',
        prompt: 'What did Mia do right before meeting her friends at the park?',
        options: ['She visited grandma', 'She had lunch (ate pizza)', 'She played with the dog'],
        correctIndex: 1,
        feedback: 'Spot on! Lunch happened before heading out to the park!'
      },
      {
        id: 'h5',
        title: 'Challenge 5: The Sneaky Inconsistency',
        prompt: 'If Mia\'s grandmother says: "Mia was glued to cartoons on my living room screen all afternoon", what is the lie?',
        options: [
          'Mia lied when she claimed: "I didn\'t watch TV."',
          'Mia lied about visiting grandma.',
          'Mia did not eat pizza.'
        ],
        correctIndex: 0,
        feedback: 'Case solved! Grandmother caught the lie: Mia claimed she didn\'t watch TV, but she did!'
      }
    ]
  };

  // =========================================================================
  // 8. STAGE 14: FINAL ASSESSMENT 5-PART RUBRIC
  // =========================================================================

  const FINAL_ASSESSMENT_DATA = {
    part1: [
      { prompt: 'A boy pedaling a bike:', options: ['ride', 'clean', 'jump'], correct: 'ride', icon: '🚲' },
      { prompt: 'Holding a slice of pizza:', options: ['eat', 'walk', 'visit'], correct: 'eat', icon: '🍕' },
      { prompt: 'Kicking a soccer ball:', options: ['play', 'go', 'find'], correct: 'play', icon: '⚽' },
      { prompt: 'Looking through binoculars:', options: ['see', 'clean', 'ride'], correct: 'see', icon: '🦁' },
      { prompt: 'Sweeping with a broom:', options: ['clean', 'jump', 'watch'], correct: 'clean', icon: '🧹' }
    ],
    part2: [
      { sentence: 'Yesterday, I ___ to the museum.', options: ['went', 'go', 'going'], correct: 'went' },
      { sentence: 'She ___ her grandmother last Sunday.', options: ['visited', 'visit', 'visiting'], correct: 'visited' },
      { sentence: 'We ___ two wild lions at the sanctuary.', options: ['saw', 'see', 'seen'], correct: 'saw' },
      { sentence: 'They ___ pizza for dinner.', options: ['ate', 'eat', 'eating'], correct: 'ate' }
    ],
    part3: [
      { broken: 'Did you went to the cinema?', options: ['Did you go', 'Did you went', 'Did you going'], correct: 'Did you go' },
      { broken: "I didn't ate breakfast today.", options: ["I didn't eat", "I didn't ate", "I not ate"], correct: "I didn't eat" },
      { broken: 'Did she saw the detective?', options: ['Did she see', 'Did she saw', 'Did she seen'], correct: 'Did she see' }
    ],
    part4: [
      { subject: 'He', verb: 'play', obj: 'guitar', icon: '🎸', expected: 'He played guitar yesterday.' },
      { subject: 'They', verb: 'go', obj: 'to the zoo', icon: '🚌', expected: 'They went to the zoo yesterday.' },
      { subject: 'She', verb: 'find', obj: 'a clue', icon: '🔍', expected: 'She found a clue yesterday.' }
    ]
  };

  // Export to global scope
  root.DETECTIVES_DATA = {
    REGULAR_VERBS,
    IRREGULAR_VERBS,
    ALL_VERBS,
    MEMORY_THIEF_DECK,
    MEMORY_ROUNDS,
    FIX_DETECTIVE_CHALLENGES,
    SUSPECT_STORIES,
    INTERROGATION_SUSPECT,
    STORY_BUILDER_EVENTS,
    HARD_MODE_CASE,
    FINAL_ASSESSMENT_DATA
  };

})(typeof window !== 'undefined' ? window : global);
