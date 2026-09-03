/**
 * Predictions Lesson Data: Picture-First Visual Storytelling for Young A1 Learners
 * Dual-coded choices (Picture + Sentence), 4-Panel Comic Stories, NOW vs NEXT Visuals
 */

window.PREDICTIONS_DATA = {
  // 10 Lesson Stages
  stages: [
    { num: 1, id: 'intro', title: '1. The Freeze Frame', time: '4 min', icon: '🔮' },
    { num: 2, id: 'language', title: '2. Language of Future', time: '4 min', icon: '⏳' },
    { num: 3, id: 'comic_stories', title: '3. 4-Panel Comic Stories', time: '5 min', icon: '📰' },
    { num: 4, id: 'visual_listening', title: '4. Visual Listening', time: '4 min', icon: '🎧' },
    { num: 5, id: 'which_pic_matches', title: '5. Which Picture Matches?', time: '4 min', icon: '🖼️' },
    { num: 6, id: 'picture_matching', title: '6. Picture-Sentence Match', time: '4 min', icon: '🔗' },
    { num: 7, id: 'bingo', title: '7. Prediction Bingo', time: '4 min', icon: '🎯' },
    { num: 8, id: 'crazy', title: '8. Crazy Predictions', time: '4 min', icon: '🤪' },
    { num: 9, id: 'detectives', title: '9. Clue Detectives', time: '3 min', icon: '🔎' },
    { num: 10, id: 'showdown', title: '10. Big Showdown', time: '4 min', icon: '🏆' }
  ],

  // 4 Teams for Classroom Competition
  teams: [
    { id: 'blue', name: 'Team Future', color: '#0284c7', icon: '🔵', score: 0 },
    { id: 'green', name: 'Prediction Masters', color: '#16a34a', icon: '🟢', score: 0 },
    { id: 'purple', name: 'Time Travelers', color: '#9333ea', icon: '🟣', score: 0 },
    { id: 'orange', name: 'Guessing Heroes', color: '#ea580c', icon: '🟠', score: 0 }
  ],

  // Stage 1: Freeze Frame Cliffhanger (NOW -> NEXT)
  introFreeze: {
    title: "THE GREAT BANANA SLIP!",
    nowScene: {
      tag: "1. NOW (WHAT IS HAPPENING NOW?)",
      icon: "👦 🏃 🍌 🐶",
      desc: "Leo is running fast on the sidewalk. A yellow banana peel is directly under his foot! A barking dog is chasing right behind!"
    },
    choices: [
      { id: 'fall', icon: '💥 👦', text: 'He will fall!', isCorrect: true, reason: 'Banana peels are super slippery!' },
      { id: 'fly', icon: '🚀 👦', text: 'He will fly!', isCorrect: false, reason: 'Humans cannot fly without wings!' },
      { id: 'banana', icon: '🍌 👦', text: 'He will become a banana!', isCorrect: false, reason: 'People cannot turn into fruit!' }
    ],
    nextScene: {
      tag: "2. NEXT (WHAT HAPPENS NEXT?)",
      icon: "💥 💫 👦 💦",
      revealText: "WHOOOOSH... BOOM! He will slip and fall on the grass!",
      sound: 'slide'
    }
  },

  // Stage 2: Language of the Future (Visual Cards)
  futureCards: [
    { id: 'fc1', icon: '👦 💥', sentence: 'He will fall.', audio: 'He will fall.' },
    { id: 'fc2', icon: '👧 🏃', sentence: 'She will run.', audio: 'She will run.' },
    { id: 'fc3', icon: '👫 😂', sentence: 'They will laugh.', audio: 'They will laugh.' },
    { id: 'fc4', icon: '🌧️ ⚡', sentence: 'It will rain.', audio: 'It will rain.' },
    { id: 'fc5', icon: '🐶 🦘', sentence: 'The dog will jump.', audio: 'The dog will jump.' }
  ],

  // Stage 3: 4-Panel Comic Strip Stories (Rules 36 & 46)
  comicStories: [
    {
      id: 'cs1',
      title: 'The Melting Ice Cream Adventure',
      panel1: { icon: '👧 🍦', label: '1. Big Ice Cream', text: 'Lucy has a giant ice cream cone!' },
      panel2: { icon: '☀️ 🔥', label: '2. Very Hot Sun', text: 'The sun is blazing at 38°C!' },
      panel3: { icon: '🍦 💧', label: '3. Melting Drops', text: 'Sweet drops drip down her hand!' },
      panel4Question: '4. WHAT WILL HAPPEN NEXT?',
      choices: [
        { icon: '🍦 🫠 💥', text: 'The ice cream will melt!', isCorrect: true },
        { icon: '🍦 🏃 💨', text: 'The ice cream will run away.', isCorrect: false },
        { icon: '🍦 ❄️ 🧊', text: 'The ice cream will freeze into ice.', isCorrect: false }
      ],
      reveal: { icon: '🍦 🫠 💦', text: 'SPLAT! The ice cream will melt completely!' }
    },
    {
      id: 'cs2',
      title: 'The Wobbling 5-Tier Cake',
      panel1: { icon: '🧑‍🍳 🎂', label: '1. Giant Cake', text: 'Chef carries a towering 5-tier cake.' },
      panel2: { icon: '🧸 🚗', label: '2. Toy Car on Floor', text: 'A plastic toy car is on the floor!' },
      panel3: { icon: '🧑‍🍳 〰️', label: '3. Chef Wobbles', text: 'His shoe hits the toy car wheels!' },
      panel4Question: '4. WHAT WILL HAPPEN NEXT?',
      choices: [
        { icon: '🎂 💥 😱', text: 'The cake will fall!', isCorrect: true },
        { icon: '🎂 🎵 🎤', text: 'The cake will sing a song.', isCorrect: false },
        { icon: '🎂 ✈️ ☁️', text: 'The cake will fly away.', isCorrect: false }
      ],
      reveal: { icon: '🎂 💥 🧁', text: 'CRASH! The cake will fall on the floor!' }
    },
    {
      id: 'cs3',
      title: 'The Puddle Jumper',
      panel1: { icon: '👦 🌊', label: '1. Mud Puddle', text: 'Billy sees an enormous mud puddle!' },
      panel2: { icon: '🏃 💨', label: '2. Big Sprint', text: 'He runs as fast as his legs can go!' },
      panel3: { icon: '🦘 ☁️', label: '3. High Jump', text: 'He leaps high into the air!' },
      panel4Question: '4. WHAT WILL HAPPEN NEXT?',
      choices: [
        { icon: '💦 🌊 👦', text: 'He will splash into the mud!', isCorrect: true },
        { icon: '😴 🛏️ 👦', text: 'He will go to sleep.', isCorrect: false },
        { icon: '🍕 🍽️ 👦', text: 'He will eat pizza in the air.', isCorrect: false }
      ],
      reveal: { icon: '💦 🌊 🤣', text: 'SPLASH! He lands right in the mud!' }
    }
  ],

  // Stage 4: Visual Listening Activities (Rule 40)
  visualListeningCases: [
    {
      id: 'vl1',
      audioText: "Tom is running to the bus stop as fast as he can. The bus doors are closing. The bus engine roars and drives down the road. Tom is very far away!",
      sceneCard: {
        icon: '👦 🏃 ➔ ➔ ➔ 🚌 💨',
        desc: 'Tom is sprinting, but the bus doors are shut and the bus is driving away!'
      },
      choices: [
        { icon: '🚌 ❌ 😱', text: 'Tom will miss the bus.', isCorrect: true },
        { icon: '🚌 🚗 😎', text: 'Tom will drive the bus.', isCorrect: false },
        { icon: '🚌 ✈️ ☁️', text: 'The bus will turn into a plane.', isCorrect: false }
      ],
      sentence: 'Tom will miss the bus!'
    },
    {
      id: 'vl2',
      audioText: "Sarah is carrying a big birthday cake with burning candles. She is walking across the living room. Look out! Her baby brother left his toy truck on the rug!",
      sceneCard: {
        icon: '👧 🎂 🚶‍♀️ ➔ ➔ 🚗 🧸',
        desc: 'Sarah is carrying the cake, but a toy truck is directly in her walking path!'
      },
      choices: [
        { icon: '🎂 💥 😱', text: 'The cake will fall!', isCorrect: true },
        { icon: '🎂 🍽️ 😋', text: 'The cake will go safely on table.', isCorrect: false },
        { icon: '👧 😴 🛏️', text: 'Sarah will fall asleep.', isCorrect: false }
      ],
      sentence: 'The cake will fall!'
    },
    {
      id: 'vl3',
      audioText: "Emma looks outside her bedroom window. Enormous dark grey storm clouds cover the sky. Strong wind is blowing trees. She left her umbrella at school!",
      sceneCard: {
        icon: '👧 ☁️ 💨 ⚡ (❌ 🌂)',
        desc: 'Dark rain clouds and loud thunder! Emma has no umbrella!'
      },
      choices: [
        { icon: '🌧️ 💦 👧', text: 'It will rain and she will get wet.', isCorrect: true },
        { icon: '☀️ 🏖️ 👧', text: 'The sun will shine all day.', isCorrect: false },
        { icon: '❄️ ⛄ 👧', text: 'Snow will fall on the beach.', isCorrect: false }
      ],
      sentence: 'It will rain and she will get wet!'
    }
  ],

  // Stage 5: "Which Picture Matches?" (Rules 43 & 44)
  whichPictureCases: [
    {
      id: 'wpc1',
      sentence: 'She will open the present. 🎁',
      pictures: [
        { id: 'p1', icon: '🎁 🔒', label: 'A. Locked Present', isCorrect: false },
        { id: 'p2', icon: '👧 🎁 ✨', label: 'B. Opening Present', isCorrect: true },
        { id: 'p3', icon: '👧 😴 🛏️', label: 'C. Sleeping in Bed', isCorrect: false }
      ],
      speech: 'She will open the present.'
    },
    {
      id: 'wpc2',
      sentence: 'He will miss the bus. 🚌',
      pictures: [
        { id: 'p1', icon: '👦 🚌 😊', label: 'A. Sitting on Bus', isCorrect: false },
        { id: 'p2', icon: '👦 🏃 🚌💨 😱', label: 'B. Running After Bus', isCorrect: true },
        { id: 'p3', icon: '👦 🍕 🍽️', label: 'C. Eating Pizza', isCorrect: false }
      ],
      speech: 'He will miss the bus.'
    },
    {
      id: 'wpc3',
      sentence: 'The dog will jump into the pool. 🏊‍♂️',
      pictures: [
        { id: 'p1', icon: '🐶 🦘 🏊‍♂️ 💦', label: 'A. Jumping into Pool', isCorrect: true },
        { id: 'p2', icon: '🐶 😴 🪵', label: 'B. Napping on Porch', isCorrect: false },
        { id: 'p3', icon: '🐶 🍎 😋', label: 'C. Eating an Apple', isCorrect: false }
      ],
      speech: 'The dog will jump into the pool.'
    }
  ],

  // Stage 6: Picture + Sentence Matching (Rule 42)
  matchingActivity: {
    sentences: [
      { id: 's1', text: '1. He will fall.', matchId: 'm1' },
      { id: 's2', text: '2. She will eat the cake.', matchId: 'm2' },
      { id: 's3', text: '3. They will play football.', matchId: 'm3' }
    ],
    pictures: [
      { id: 'p2', icon: '👧 🍰 😋', label: 'Picture B', matchId: 'm2' },
      { id: 'p1', icon: '👦 💥 🍌', label: 'Picture A', matchId: 'm1' },
      { id: 'p3', icon: '👫 ⚽ 🥅', label: 'Picture C', matchId: 'm3' }
    ]
  },

  // Stage 7: Prediction Bingo 3x3 Board with Large Visuals
  bingoBoard: [
    { id: 'b1', icon: '🍕 😋', text: 'Eat pizza', marked: false },
    { id: 'b2', icon: '🏃 💨', text: 'Run fast', marked: false },
    { id: 'b3', icon: '😴 🛏️', text: 'Fall asleep', marked: false },
    { id: 'b4', icon: '😂 🤣', text: 'Laugh out loud', marked: false },
    { id: 'b5', icon: '🌧️ 💦', text: 'Get wet', marked: false },
    { id: 'b6', icon: '🐶 🐾', text: 'See a dog', marked: false },
    { id: 'b7', icon: '🚌 ❌', text: 'Miss the bus', marked: false },
    { id: 'b8', icon: '🎂 🍰', text: 'Eat cake', marked: false },
    { id: 'b9', icon: '🎁 ✨', text: 'Open a gift', marked: false }
  ],

  // Stage 8: Crazy Predictions (Funny Situations)
  crazyScenarios: [
    {
      id: 'cs1',
      image: '🦆 🎒 🏫',
      scenario: 'A duck wearing a yellow backpack stands at the school door!',
      ideas: [
        { icon: '🦆 📚 🅰️', text: 'The duck will learn English and speak!', type: 'funny' },
        { icon: '🦆 👨‍🏫 👑', text: 'The duck will become the new headteacher!', type: 'crazy' },
        { icon: '🦆 🍞 😋', text: 'The duck will quack and ask for bread!', type: 'sensible' }
      ]
    },
    {
      id: 'cs2',
      image: '🐶 🛹 🕶️',
      scenario: 'A dog wearing sunglasses is riding a skateboard downhill!',
      ideas: [
        { icon: '🐶 🏅 🥇', text: 'The dog will win the Olympic skateboard medal!', type: 'funny' },
        { icon: '🐶 🛹 ✨', text: 'The dog will do a 360-degree aerial flip!', type: 'crazy' },
        { icon: '🐶 🌿 🐾', text: 'The dog will jump off onto the soft grass!', type: 'sensible' }
      ]
    }
  ],

  // Stage 9: Prediction Detectives (Find Visual Clues)
  detectiveCases: [
    {
      id: 'det1',
      title: 'Mystery Weather Investigation',
      clues: [
        { id: 'c1', icon: '☁️ ⚡', name: 'Dark Storm Clouds', desc: 'Heavy dark black clouds overhead' },
        { id: 'c2', icon: '💨 🍂', name: 'Swirling Cold Wind', desc: 'Blowing hats and leaves off trees' },
        { id: 'c3', icon: '🌂 ✋', name: 'Closed Umbrella', desc: 'Ready in someone\'s hand' }
      ],
      prediction: 'It will rain!'
    },
    {
      id: 'det2',
      title: 'Secret Celebration Clues',
      clues: [
        { id: 'c1', icon: '🎈 🎊', name: 'Colorful Balloons', desc: 'Floating decorations in the classroom' },
        { id: 'c2', icon: '🎁 🎀', name: 'Wrapped Present', desc: 'Big shiny box with a golden ribbon' },
        { id: 'c3', icon: '🎂 🕯️', name: 'Frosted Birthday Cake', desc: 'Cake with candles waiting on the table' }
      ],
      prediction: 'They will have a birthday party!'
    }
  ],

  // Stage 10: The Big Showdown Final Box
  showdownBox: {
    title: 'THE MYSTERY SHAKING BOX! 🎁',
    description: 'A huge gift box on stage is shaking and rumbling: "TICK-TOCK... BEEP... ROOOAAR!"',
    reveals: [
      { id: 'r1', icon: '🦖 🤖 🎵', text: 'A friendly singing dinosaur robot leaps out!', title: 'ROBOT DINOSAUR!' },
      { id: 'r2', icon: '🎈 🎉 🚀', text: '100 colorful party balloons explode into the sky!', title: 'BALLOON SURPRISE!' },
      { id: 'r3', icon: '🐶 🥳 🐾', text: 'A cute golden retriever puppy wearing a party hat!', title: 'PLAYFUL PUPPY!' }
    ]
  }
};
