/**
 * Lesson Data: Vocabulary, Missions, Dialogues, Sentence Builder Blocks, Tour Stops
 * Sourced directly from Twinkl "My Neighbourhood - ESL Speaking Activity"
 */

window.NEIGHBOURHOOD_DATA = {
  // Core missions that fill the Explorer Badge
  missions: [
    { id: 'house', icon: '🏠', title: 'Find your Home', instruction: 'Where do you live? Choose house or flat!', completed: false, stars: 15 },
    { id: 'inside_house', icon: '🚪', title: 'Look Inside the House', instruction: 'Explore the rooms and tap 3 objects!', completed: false, stars: 15 },
    { id: 'find_cars_houses_trees', icon: '🔍', title: 'What Can You See?', instruction: 'Find 3 houses, 2 cars, and 4 trees on the street!', completed: false, stars: 15 },
    { id: 'park', icon: '🌳', title: 'Park Detective', instruction: 'Find the slide, bench, dog, and trees in the park!', completed: false, stars: 15 },
    { id: 'school', icon: '🏫', title: 'Visit the School', instruction: 'Ring the school bell and answer: Is there a school?', completed: false, stars: 15 },
    { id: 'shop', icon: '🛒', title: 'Explore the Shop', instruction: 'Discover delicious treats at the bakery shop!', completed: false, stars: 15 },
    { id: 'neighbours', icon: '👨‍👩‍👧', title: 'Meet the Neighbours', instruction: 'Say hello to the nice family next door!', completed: false, stars: 10 }
  ],

  // House rooms & objects
  houseRooms: {
    livingRoom: {
      name: 'Living Room',
      objects: [
        { id: 'sofa', name: 'sofa', icon: '🛋️', sentence: 'There is a comfy sofa.', sound: 'playPop' },
        { id: 'tv', name: 'television', icon: '📺', sentence: 'There is a television.', sound: 'playPop' },
        { id: 'lamp', name: 'lamp', icon: '💡', sentence: 'There is a warm lamp.', sound: 'playPop' }
      ]
    },
    kitchen: {
      name: 'Kitchen',
      objects: [
        { id: 'fridge', name: 'fridge', icon: '🧊', sentence: 'The fridge is full of food.', sound: 'playPop' },
        { id: 'food', name: 'food & fruit', icon: '🍎', sentence: 'There is healthy food on the table.', sound: 'playPop' },
        { id: 'cooker', name: 'cooker', icon: '🍳', sentence: 'We cook dinner here.', sound: 'playPop' }
      ]
    },
    bedroom: {
      name: 'Bedroom',
      objects: [
        { id: 'bed', name: 'bed', icon: '🛏️', sentence: 'There is a cozy bed.', sound: 'playPop' },
        { id: 'window', name: 'window', icon: '🪟', sentence: 'I can see the street from my window.', sound: 'playPop' }
      ]
    },
    bathroom: {
      name: 'Bathroom',
      objects: [
        { id: 'bath', name: 'bathtub', icon: '🛁', sentence: 'There is a clean bathtub.', sound: 'playPop' },
        { id: 'mirror', name: 'mirror', icon: '🪞', sentence: 'There is a bright mirror.', sound: 'playPop' }
      ]
    }
  },

  // Park Detective Items
  parkItems: [
    { id: 'slide', name: 'slide', icon: '🛝', phrase: 'There is a fun slide.', sound: 'playSlide' },
    { id: 'bench', name: 'bench', icon: '🪑', phrase: 'There is a wooden bench.', sound: 'playPop' },
    { id: 'tree', name: 'trees', icon: '🌳', phrase: 'There are green trees in the park.', sound: 'playPop' },
    { id: 'dog', name: 'friendly dog', icon: '🐕', phrase: 'The dog loves to play in the park.', sound: 'playDogBark' },
    { id: 'flowers', name: 'flowers', icon: '🌷', phrase: 'I can see pretty flowers.', sound: 'playSparkle' },
    { id: 'ball', name: 'football', icon: '⚽', phrase: 'We kick the ball together.', sound: 'playPop' },
    { id: 'bike', name: 'bicycle', icon: '🚲', phrase: 'I like riding my bike in the park.', sound: 'playPop' }
  ],

  // School Items
  schoolItems: [
    { id: 'teacher', name: 'teacher', icon: '👩‍🏫', phrase: 'Good morning, class!' },
    { id: 'students', name: 'students', icon: '🧑‍🎓', phrase: 'We learn English together.' },
    { id: 'books', name: 'books', icon: '📚', phrase: 'There are colourful story books.' },
    { id: 'desks', name: 'desks', icon: '🪑', phrase: 'There are desks and chairs.' },
    { id: 'bell', name: 'school bell', icon: '🔔', phrase: 'Ding-dong! School is starting!' }
  ],

  // Shop & Bakery Items
  shopItems: [
    { id: 'bread', name: 'fresh bread', icon: '🥖', phrase: 'Smell the fresh warm bread!' },
    { id: 'croissant', name: 'pastries', icon: '🥐', phrase: 'Delicious bakery pastries.' },
    { id: 'fruit', name: 'apples & fruit', icon: '🍎', phrase: 'Sweet red apples.' },
    { id: 'milk', name: 'fresh milk', icon: '🥛', phrase: 'Cold milk from the dairy.' },
    { id: 'cookies', name: 'cookies', icon: '🍪', phrase: 'Chocolate chip cookies!' },
    { id: 'till', name: 'cash register', icon: '💰', phrase: 'Cha-ching! Thank you for visiting the shop!' }
  ],

  // PDF Slide 13: Practice Match the word to the picture
  matchingPairs: [
    { id: 'house', word: 'house', label: '🏠 House', icon: '🏠' },
    { id: 'park', word: 'park', label: '🌳 Park', icon: '🌳' },
    { id: 'school', word: 'school', label: '🏫 School', icon: '🏫' },
    { id: 'shop', word: 'shop', label: '🛒 Shop', icon: '🛒' }
  ],

  // PDF Slides 14-18: Practice the conversation (Q&A dialogues)
  conversations: [
    {
      id: 'where_live',
      question: 'Where do you live?',
      answer: 'I live in a house.',
      altAnswer: 'I live in a flat.',
      context: 'Asking about home'
    },
    {
      id: 'what_see',
      question: 'What can you see in your neighbourhood?',
      answer: 'I can see cars, houses and trees.',
      context: 'Looking down the street'
    },
    {
      id: 'what_in_nh',
      question: 'What is in your neighbourhood?',
      answer: 'There is a park, a school and a shop.',
      altAnswer: 'In my neighbourhood, there are lots of houses.',
      context: 'Exploring places'
    },
    {
      id: 'where_like_go',
      question: 'Where do you like to go in your neighbourhood?',
      answer: 'I like to go to the park.',
      context: 'Favorite places'
    },
    {
      id: 'what_like_do',
      question: 'What do you like to do in your neighbourhood?',
      answer: 'I like to go for walks with my family.',
      context: 'Family fun'
    }
  ],

  // PDF Slide 19: Speaking Builder Options
  speakingBuilder: {
    stages: [
      {
        step: 1,
        prompt: '1. My neighbourhood is...',
        key: 'size',
        options: [
          { text: 'big', label: '🔵 big', sentence: 'My neighbourhood is big.' },
          { text: 'small', label: '🟢 small', sentence: 'My neighbourhood is small.' }
        ]
      },
      {
        step: 2,
        prompt: '2. In my neighbourhood, I can see...',
        key: 'see',
        multi: true,
        options: [
          { text: 'houses', label: '🏠 houses', value: 'houses' },
          { text: 'trees', label: '🌳 trees', value: 'trees' },
          { text: 'cars', label: '🚗 cars', value: 'cars' }
        ]
      },
      {
        step: 3,
        prompt: '3. In my neighbourhood, there is a...',
        key: 'places',
        multi: true,
        options: [
          { text: 'shop', label: '🛒 shop', value: 'a shop' },
          { text: 'school', label: '🏫 school', value: 'a school' },
          { text: 'park', label: '🌳 park', value: 'a park' }
        ]
      },
      {
        step: 4,
        prompt: '4. In my neighbourhood, I like to go...',
        key: 'activity',
        options: [
          { text: 'to the park', label: '🌳 to the park', sentence: 'I like to go to the park.' },
          { text: 'on walks', label: '🚶 on walks', sentence: 'I like to go on walks with my family.' }
        ]
      }
    ]
  },

  // PDF Slide 20: Visual Speaking Prompts for free production
  speakingPrompts: [
    { icon: '🏠', title: 'My Home', text: 'Where do you live?', hint: 'I live in a house / flat.' },
    { icon: '🚗', title: 'On the Street', text: 'What can you see?', hint: 'I can see cars, houses and trees.' },
    { icon: '🏫', title: 'School', text: 'Is there a school?', hint: 'There is a school.' },
    { icon: '🛒', title: 'Shop & Bakery', text: 'Is there a shop?', hint: 'There is a shop.' },
    { icon: '🌳', title: 'The Park', text: 'What is in the park?', hint: 'There is a park with a slide and trees.' },
    { icon: '👨‍👩‍👧', title: 'Neighbours & Family', text: 'Who are your neighbours?', hint: 'My neighbours live next to me. They are a nice family.' },
    { icon: '🚶', title: 'Fun Activities', text: 'What do you like to do?', hint: 'I like to go for walks with my family.' }
  ],

  // Final Walking Tour Guide stops
  tourStops: [
    {
      id: 'home',
      name: 'Stop 1: My Home',
      location: 'House',
      sentence: 'Welcome! I live in a house with a pretty front garden.',
      x: 180,
      y: 460
    },
    {
      id: 'street',
      name: 'Stop 2: The Street',
      location: 'Cul-de-sac Road',
      sentence: 'In my neighbourhood, I can see cars, houses and green trees.',
      x: 480,
      y: 520
    },
    {
      id: 'park',
      name: 'Stop 3: The Park',
      location: 'Community Park',
      sentence: 'There is a lovely park. I like to go to the park and play on the slide!',
      x: 750,
      y: 350
    },
    {
      id: 'school',
      name: 'Stop 4: The School',
      location: 'Primary School',
      sentence: 'There is a school where students and teachers learn together.',
      x: 520,
      y: 200
    },
    {
      id: 'shop',
      name: 'Stop 5: The Shop',
      location: 'Bakery & Shop',
      sentence: 'There is a shop where we buy delicious bread, fruit, and cookies.',
      x: 230,
      y: 240
    },
    {
      id: 'neighbours',
      name: 'Stop 6: The Neighbours',
      location: 'Next Door',
      sentence: 'My neighbours live next to me. They are a very nice family!',
      x: 780,
      y: 600
    },
    {
      id: 'walks',
      name: 'Stop 7: Family Walk',
      location: 'Park Pathway',
      sentence: 'I love my neighbourhood! I like to go for walks with my family.',
      x: 500,
      y: 720
    }
  ],

  // ================= NEW COMPREHENSION & SPEAKING DATA =================

  // 1. Remember the Neighbourhood (Memory check with hidden map)
  memoryQuestions: [
    { id: 'school', q: 'Was there a school in our neighbourhood?', answer: true, feedback: 'Yes! There was a school with a bell! 🏫' },
    { id: 'zoo', q: 'Was there a zoo in our neighbourhood?', answer: false, feedback: 'No! There was no zoo with wild animals! 🦁❌' },
    { id: 'park', q: 'Was there a park in our neighbourhood?', answer: true, feedback: 'Yes! There was a park with a slide! 🌳' },
    { id: 'shop', q: 'Was there a shop in our neighbourhood?', answer: true, feedback: 'Yes! There was a bakery and shop! 🛒' },
    { id: 'houses', q: 'Were there lots of houses in our neighbourhood?', answer: true, feedback: 'Yes! There were lots of houses! 🏠' }
  ],

  // 2. True or False statements
  trueFalseStatements: [
    { id: 'tf_school', text: 'There is a school.', isTrue: true, target: 'school', prompt: 'Look at the school on top!' },
    { id: 'tf_zoo', text: 'There is a zoo.', isTrue: false, target: null, prompt: 'No zoo here! Only houses, park, school, and shop!' },
    { id: 'tf_park', text: 'There is a park.', isTrue: true, target: 'park', prompt: 'Yes! There is a park on the right!' },
    { id: 'tf_houses', text: 'There are lots of houses.', isTrue: true, target: 'houses', prompt: 'Yes! We have houses all around!' },
    { id: 'tf_airport', text: 'There is an airport.', isTrue: false, target: null, prompt: 'No airport in this quiet neighbourhood!' }
  ],

  // 3. Listen and Find audio targets
  listenAndFindPrompts: [
    { id: 'lf_school', audio: 'I can see a school.', target: 'school', label: 'School 🏫' },
    { id: 'lf_park', audio: 'There is a park.', target: 'park', label: 'Park 🌳' },
    { id: 'lf_cars', audio: 'I can see cars.', target: 'car', label: 'Cars 🚗' },
    { id: 'lf_shop', audio: 'There is a shop.', target: 'shop', label: 'Shop 🛒' },
    { id: 'lf_house', audio: 'I can see a house.', target: 'house', label: 'House 🏠' }
  ],

  // 4. Grammar: There is vs There are
  thereIsAreQuestions: [
    { id: 'tia_1', icon: '🏫', text: 'There ___ a school.', correct: 'is', complete: 'There is a school.' },
    { id: 'tia_2', icon: '🏠 🏠 🏠 🏠', text: 'There ___ lots of houses.', correct: 'are', complete: 'There are lots of houses.' },
    { id: 'tia_3', icon: '🛒', text: 'There ___ a shop.', correct: 'is', complete: 'There is a shop.' },
    { id: 'tia_4', icon: '🌳 🌳 🌳', text: 'There ___ green trees.', correct: 'are', complete: 'There are green trees.' },
    { id: 'tia_5', icon: '🛝', text: 'There ___ a fun slide.', correct: 'is', complete: 'There is a fun slide.' }
  ],

  // 5. Where do you like to go? Choices
  favoritePlaces: [
    { id: 'park', icon: '🌳', label: 'Park', sentence: 'I like to go to the park.' },
    { id: 'school', icon: '🏫', label: 'School', sentence: 'I like to go to the school.' },
    { id: 'shop', icon: '🛒', label: 'Shop', sentence: 'I like to go to the shop.' },
    { id: 'home', icon: '🏠', label: 'Home', sentence: 'I like to stay at home.' }
  ],

  // 6. What do you like to do? Choices
  favoriteActivities: [
    { id: 'walks', icon: '👨‍👩‍👧 🚶', label: 'Walk with my family', sentence: 'I like to go for walks with my family.' },
    { id: 'play', icon: '🛝 ⚽', label: 'Play on the slide', sentence: 'I like to play on the slide.' },
    { id: 'bike', icon: '🚲 👦', label: 'Ride a bike', sentence: 'I like to ride my bike.' },
    { id: 'ball', icon: '⚽ 👟', label: 'Kick a ball', sentence: 'I like to play football.' }
  ],

  // 7. Scaffolded Support Levels
  scaffoldLevels: [
    {
      level: 1,
      title: 'Level 1 — Full Support',
      badge: '🟢 FULL SUPPORT',
      desc: 'Complete sentence + picture cues for beginners.',
      items: [
        { icon: '🏠', text: 'I live in a house.' },
        { icon: '🚗 🏠 🌳', text: 'I can see cars, houses and trees.' },
        { icon: '🏫', text: 'There is a school.' },
        { icon: '🛒', text: 'There is a shop.' },
        { icon: '🌳', text: 'I like to go to the park.' },
        { icon: '👨‍👩‍👧 🚶', text: 'I like to go for walks with my family.' }
      ]
    },
    {
      level: 2,
      title: 'Level 2 — Partial Support',
      badge: '🟡 PARTIAL SUPPORT',
      desc: 'Sentence starter + picture cues to encourage memory.',
      items: [
        { icon: '🏠', text: 'I live in a...' },
        { icon: '🚗 🏠 🌳', text: 'I can see...' },
        { icon: '🏫', text: 'There is a...' },
        { icon: '🛒', text: 'There is a...' },
        { icon: '🌳', text: 'I like to go...' },
        { icon: '👨‍👩‍👧 🚶', text: 'I like to go for walks with...' }
      ]
    },
    {
      level: 3,
      title: 'Level 3 — Speaking Challenge',
      badge: '🔴 SPEAKING CHALLENGE',
      desc: 'Visual icons only! You must produce the whole sentence yourself.',
      items: [
        { icon: '🏠', text: '🏠 (Where do you live?)' },
        { icon: '🚗 🏠 🌳', text: '🚗 🏠 🌳 (What can you see?)' },
        { icon: '🏫', text: '🏫 (What is there?)' },
        { icon: '🛒', text: '🛒 (What is there?)' },
        { icon: '🌳', text: '🌳 (Where do you like to go?)' },
        { icon: '👨‍👩‍👧 🚶', text: '👨‍👩‍👧 🚶 (What do you like to do?)' }
      ]
    }
  ],

  // 8. Brand New Neighbourhood (Independent Challenge)
  newNeighbourhood: {
    name: 'Blossom Hill',
    features: [
      { id: 'home', icon: '🏢', label: 'My Flat', sentence: 'I live in a flat.', x: 180, y: 320 },
      { id: 'street', icon: '🚗', label: 'Cars & Trees', sentence: 'I can see cars and tall trees.', x: 450, y: 440 },
      { id: 'school', icon: '🏫', label: 'Sunny School', sentence: 'There is a school.', x: 720, y: 220 },
      { id: 'shop', icon: '🛒', label: 'Fruit Shop', sentence: 'There is a shop.', x: 300, y: 180 },
      { id: 'park', icon: '🌳', label: 'Blossom Park', sentence: 'I like to go to the park.', x: 880, y: 380 },
      { id: 'walks', icon: '👨‍👩‍👧', label: 'Family Walk', sentence: 'I like to go for walks with my family.', x: 580, y: 520 }
    ]
  }
};
