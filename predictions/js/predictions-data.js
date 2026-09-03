/**
 * Predictions Lesson Data: Freeze Frames, Audio Stories, Sequences, Bingo & Showdowns
 */

window.PREDICTIONS_DATA = {
  // 10 Lesson Stages
  stages: [
    { num: 1, id: 'intro', title: '1. The Freeze Frame', time: '4 min', icon: '🔮' },
    { num: 2, id: 'language', title: '2. Language of Future', time: '4 min', icon: '⏳' },
    { num: 3, id: 'look_predict', title: '3. Look & Predict', time: '5 min', icon: '👀' },
    { num: 4, id: 'listen_guess', title: '4. Listen & Guess', time: '4 min', icon: '🎧' },
    { num: 5, id: 'sequences', title: '5. Picture Sequences', time: '4 min', icon: '🖼️' },
    { num: 6, id: 'what_will_do', title: '6. What Will They Do?', time: '4 min', icon: '🤔' },
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

  // Stage 1: Freeze Frame Cliffhanger
  introFreeze: {
    title: "THE GREAT BANANA DISASTER!",
    situation: "Leo is sprinting down the sidewalk! A slippery yellow banana peel is directly under his foot! A barking puppy is chasing right behind him!",
    choices: [
      { id: 'fall', text: 'A. He will fall! 🍌💥', isCorrect: true, reason: 'Banana peels are super slippery!' },
      { id: 'fly', text: 'B. He will fly to the moon! 🚀', isCorrect: false, reason: 'Humans cannot fly without rockets!' },
      { id: 'banana', text: 'C. He will turn into a banana! 🍌', isCorrect: false, reason: 'People do not transform into fruit!' }
    ],
    revealText: "WHOOOOSH... BOOM! He will slip and fall on the soft grass!",
    sound: 'slide'
  },

  // Stage 3: Look & Predict (3 Visual Cases)
  lookPredictCases: [
    {
      id: 'lp1',
      title: 'The Giant Ice Cream on a Blazing Hot Day! ☀️',
      clues: 'Blazing 35°C sun, melting droplets, leaning giant scoop',
      icon: '🍦',
      question: 'What will happen next?',
      choices: [
        { text: 'A. The ice cream will melt.', isCorrect: true },
        { text: 'B. The ice cream will run away.', isCorrect: false },
        { text: 'C. The ice cream will freeze into ice.', isCorrect: false }
      ],
      sentence: 'The ice cream will melt!'
    },
    {
      id: 'lp2',
      title: 'The Wobbling 5-Tier Birthday Cake! 🎂',
      clues: 'Waiter tripping over a toy car, cake wobbling left and right',
      icon: '🎂',
      question: 'What will happen next?',
      choices: [
        { text: 'A. The cake will fall on the floor.', isCorrect: true },
        { text: 'B. The cake will eat the waiter.', isCorrect: false },
        { text: 'C. The cake will grow wings.', isCorrect: false }
      ],
      sentence: 'The cake will fall!'
    },
    {
      id: 'lp3',
      title: 'Carrying 20 Cupcakes on a Tiny Saucer! 🧁',
      clues: 'Hands shaking, towering pile of cupcakes, walking on slippery tiles',
      icon: '🧁',
      question: 'What will happen next?',
      choices: [
        { text: 'A. The cupcakes will drop!', isCorrect: true },
        { text: 'B. The cupcakes will turn into soup.', isCorrect: false },
        { text: 'C. The cupcakes will dance a jig.', isCorrect: false }
      ],
      sentence: 'The cupcakes will drop!'
    }
  ],

  // Stage 4: Listen & Guess (Auditory Scenes)
  listenGuessCases: [
    {
      id: 'lg1',
      audioText: "Tom is running to the bus stop as fast as he can. The bus doors are closing. The bus engine roars and drives down the road. Tom is still 100 meters away!",
      icon: '🚌',
      question: 'What will happen next?',
      choices: [
        { text: 'Tom will miss the bus.', isCorrect: true },
        { text: 'Tom will drive the bus.', isCorrect: false },
        { text: 'The bus will turn into a plane.', isCorrect: false }
      ],
      sentence: 'Tom will miss the bus!'
    },
    {
      id: 'lg2',
      audioText: "Emma looks outside her bedroom window. Enormous dark black clouds fill the sky. The cold wind howls and thunder rumbles loudly. She forgot her umbrella at school!",
      icon: '🌧️',
      question: 'What will happen next?',
      choices: [
        { text: 'It will rain and she will get wet.', isCorrect: true },
        { text: 'Snow will fall on the beach.', isCorrect: false },
        { text: 'The sun will shine all night.', isCorrect: false }
      ],
      sentence: 'It will rain and she will get wet!'
    },
    {
      id: 'lg3',
      audioText: "Sam is holding a giant bunch of 50 helium balloons at the park. A strong sudden gust of wind sweeps across the playground!",
      icon: '🎈',
      question: 'What will happen next?',
      choices: [
        { text: 'He will float into the sky!', isCorrect: true },
        { text: 'He will dig a hole in the dirt.', isCorrect: false },
        { text: 'The balloons will turn into apples.', isCorrect: false }
      ],
      sentence: 'He will float into the air!'
    }
  ],

  // Stage 5: Picture Sequences (3-panel comics)
  sequences: [
    {
      id: 'seq1',
      title: 'The Great Puddle Jump',
      panel1: { icon: '👦 💧', text: 'Panel 1: Billy sees an enormous mud puddle!' },
      panel2: { icon: '🏃 💨', text: 'Panel 2: He sprints and jumps high in the air!' },
      panel3Choices: [
        { text: 'He will splash into the water! 💦', isCorrect: true },
        { text: 'He will fall asleep in bed! 😴', isCorrect: false },
        { text: 'He will eat a sandwich! 🥪', isCorrect: false }
      ],
      reveal: { icon: '💦 🌊', text: 'Panel 3: SPLASH! He lands right in the mud!' }
    },
    {
      id: 'seq2',
      title: 'The Kitten & The Red Yarn',
      panel1: { icon: '🐱 👀', text: 'Panel 1: The kitten spots a bouncing red ball of yarn.' },
      panel2: { icon: '🐈 💨', text: 'Panel 2: It wiggles its tail and pounces forward!' },
      panel3Choices: [
        { text: 'It will catch the yarn! 🧶', isCorrect: true },
        { text: 'It will read a book! 📚', isCorrect: false },
        { text: 'It will drive a car! 🚗', isCorrect: false }
      ],
      reveal: { icon: '🐱 🧶', text: 'Panel 3: Got it! The kitten tangles up in the yarn!' }
    }
  ],

  // Stage 6: "What Will He/She Do?"
  whatWillDoCases: [
    {
      id: 'wwd1',
      character: 'Hungry Lucy 👧',
      situation: 'Lucy is starving after school. On the kitchen table, she sees:',
      items: [
        { id: 'pizza', name: 'Cheesy Pepperoni Pizza', icon: '🍕', isBest: true },
        { id: 'apple', name: 'Green Crunchy Apple', icon: '🍏', isBest: true },
        { id: 'teddy', name: 'Stuffed Toy Bear', icon: '🧸', isBest: false }
      ],
      prediction: 'She will eat the pizza!'
    },
    {
      id: 'wwd2',
      character: 'Mud-Lover Max 👦',
      situation: 'Max is wearing his rubber rain boots. Ahead on the road, he sees:',
      items: [
        { id: 'puddle', name: 'Giant Muddy Puddle', icon: '🌊', isBest: true },
        { id: 'sidewalk', name: 'Dry Clean Sidewalk', icon: '🧱', isBest: false },
        { id: 'bench', name: 'Wooden Park Bench', icon: '🪑', isBest: false }
      ],
      prediction: 'He will jump in the mud puddle!'
    }
  ],

  // Stage 7: Prediction Bingo 3x3 Board
  bingoBoard: [
    { id: 'b1', text: 'Eat pizza 🍕', marked: false },
    { id: 'b2', text: 'Run fast 🏃', marked: false },
    { id: 'b3', text: 'Fall asleep 😴', marked: false },
    { id: 'b4', text: 'Laugh out loud 😂', marked: false },
    { id: 'b5', text: 'Get wet 🌧️', marked: false },
    { id: 'b6', text: 'See a dog 🐶', marked: false },
    { id: 'b7', text: 'Miss the bus 🚌', marked: false },
    { id: 'b8', text: 'Eat cake 🎂', marked: false },
    { id: 'b9', text: 'Open a gift 🎁', marked: false }
  ],

  // Stage 8: Crazy Predictions
  crazyScenarios: [
    {
      id: 'cs1',
      image: '🦆 🎒 🏫',
      scenario: 'A duck wearing a yellow backpack stands at the school door!',
      ideas: [
        { text: 'The duck will learn English and speak! 🦆📚', type: 'funny' },
        { text: 'The duck will become the new headteacher! 👨‍🏫', type: 'crazy' },
        { text: 'The duck will quack and ask for bread! 🍞', type: 'sensible' }
      ]
    },
    {
      id: 'cs2',
      image: '🐶 🛹 🕶️',
      scenario: 'A dog wearing sunglasses is riding a skateboard downhill!',
      ideas: [
        { text: 'The dog will win the Olympic skateboard medal! 🏅', type: 'funny' },
        { text: 'The dog will do a 360-degree flip! 🛹✨', type: 'crazy' },
        { text: 'The dog will jump off onto the grass! 🐾', type: 'sensible' }
      ]
    }
  ],

  // Stage 9: Prediction Detectives (Find Clues)
  detectiveCases: [
    {
      id: 'det1',
      title: 'Mystery Weather Investigation',
      clues: [
        { id: 'c1', name: 'Dark Clouds ☁️', desc: 'Heavy dark gray clouds overhead' },
        { id: 'c2', name: 'Swirling Wind 💨', desc: 'Blowing hats and leaves off trees' },
        { id: 'c3', name: 'Closed Umbrella 🌂', desc: 'Ready in someone\'s hand' }
      ],
      prediction: 'It will rain!'
    },
    {
      id: 'det2',
      title: 'Secret Celebration Clues',
      clues: [
        { id: 'c1', name: 'Colorful Balloons 🎈', desc: 'Floating decorations in the hall' },
        { id: 'c2', name: 'Wrapped Present 🎁', desc: 'Big shiny box with ribbon' },
        { id: 'c3', name: 'Frosted Cake 🎂', desc: 'Cake with candles waiting' }
      ],
      prediction: 'They will have a birthday party!'
    }
  ],

  // Stage 10: The Big Showdown Final Box
  showdownBox: {
    title: 'THE MYSTERY SHAKING BOX! 🎁',
    description: 'A huge wrapped gift box on stage is shaking and making strange noises: "TICK-TOCK... BEEP... ROOOAAR!"',
    reveals: [
      { id: 'r1', text: 'A friendly singing dinosaur robot leaps out! 🦖🤖', title: 'ROBOT DINOSAUR!' },
      { id: 'r2', text: '100 colorful party balloons explode into the sky! 🎈🎉', title: 'BALLOON SURPRISE!' },
      { id: 'r3', text: 'A cute golden retriever puppy wearing a party hat! 🐶🥳', title: 'PLAYFUL PUPPY!' }
    ]
  }
};
