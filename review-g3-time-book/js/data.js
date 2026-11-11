/**
 * Grade 3 • Unit 5 Lesson 1: "The Time Book – Help Jannah!"
 * Curriculum Data (Global Readings Level 2, pp. 72–81)
 */
(function () {
  'use strict';

  window.TB_DATA = {
    title: 'The Time Book – Help Jannah!',
    unit: "Grade 3 • Unit 5: Let's Go Back (pp. 72–81)",
    teams: [
      { id: 'croc', name: 'Crocodiles', emoji: '🐊' },
      { id: 'falcon', name: 'Falcons', emoji: '🦅' },
      { id: 'lion', name: 'Lions', emoji: '🦁' },
      { id: 'scarab', name: 'Scarabs', emoji: '🪲' }
    ],

    activities: [
      {
        id: 1,
        num: 'Activity 1',
        minutes: 8,
        title: 'Help Jannah Escape!',
        subtitle: 'Guide Jannah through the Ancient Egyptian City Maze and unlock 5 Story Gates!',
        img: 'img/jannah.webp',
        emoji: '🏺',
        intro: 'Oh no! The Pharaoh’s guards are chasing Jannah through the ancient city! Move Jannah along the path and answer 5 story questions to unlock the gates back to her bedroom!'
      },
      {
        id: 2,
        num: 'Activity 2',
        minutes: 6,
        title: 'Unscramble the Letters',
        subtitle: 'Tap the golden hieroglyph tiles in order to spell 6 Unit 5 words!',
        img: 'img/pharaoh.webp',
        emoji: '🔤',
        intro: 'Look at the picture and the first letter hint! Tap the mixed-up letter tiles in the right order to spell each word from The Time Book!'
      },
      {
        id: 3,
        num: 'Activity 3',
        minutes: 7,
        title: 'Put the Events in Order',
        subtitle: 'Order the 6 story cards from Jannah’s bedroom to ancient Egypt and back!',
        img: 'img/book.webp',
        emoji: '📖',
        intro: 'The pages of The Time Book are out of order! Tap or drag the 6 story cards into the right order from 1 to 6!'
      },
      {
        id: 4,
        num: 'Activity 4',
        minutes: 7,
        title: 'Main Idea or Detail?',
        subtitle: 'Is the sentence the Big Main Idea ⭐ or an Extra Detail 🔍? (p. 73 & p. 81)',
        img: 'img/old-woman.webp',
        emoji: '⭐',
        intro: 'Remember page 81! The Main Idea gives the most important big idea. Details give extra information! Tap MAIN IDEA or DETAIL for each sentence!'
      },
      {
        id: 5,
        num: 'Activity 5',
        minutes: 7,
        title: 'Who Am I? — Egyptian Riddles',
        subtitle: 'Listen to 7 riddles and tap the matching character or object!',
        img: 'img/chariot.webp',
        emoji: '🕵️',
        intro: 'Listen carefully to my ancient Egyptian riddle! Who or what am I? Tap the right picture card!'
      }
    ],

    // ACTIVITY 1: 7x7 Ancient City Maze
    // S = Start (0,0), E = End (6,6), 1..5 = Story Gates, G = Guard Dead-End, W = Wall, . = Path
    maze: {
      grid: [
        ['S', '.', '1', '.', 'W', 'G', 'W'],
        ['W', 'W', 'W', '.', 'W', '.', 'W'],
        ['G', '.', '2', '.', '.', '.', 'W'],
        ['W', '.', 'W', 'W', 'W', 'W', 'W'],
        ['W', '.', '3', '.', '4', '.', 'G'],
        ['W', 'W', 'W', 'W', '.', 'W', 'W'],
        ['G', '.', '.', '.', '5', '.', 'E']
      ],
      gates: {
        '1': {
          num: 1,
          question: 'Gate 1: What did Jannah find before going to bed? (p. 74)',
          answerId: 'book',
          options: [
            { id: 'book', label: 'A strange book (The Time Book)', img: 'img/book.webp', emoji: '📖' },
            { id: 'chariot', label: 'A huge golden chariot', img: 'img/chariot.webp', emoji: '🛞' },
            { id: 'pharaoh', label: 'A golden crown', img: 'img/pharaoh.webp', emoji: '👑' }
          ]
        },
        '2': {
          num: 2,
          question: 'Gate 2: Where did Jannah travel when she opened the book? (p. 75)',
          answerId: 'city',
          options: [
            { id: 'city', label: 'An ancient Egyptian city', img: 'img/city.webp', emoji: '🏛️' },
            { id: 'bed', label: 'A modern school bus', img: 'img/bed.webp', emoji: '🚌' },
            { id: 'glasses', label: 'A noisy music concert', img: 'img/glasses.webp', emoji: '🎻' }
          ]
        },
        '3': {
          num: 3,
          question: 'Gate 3: Who did Jannah meet standing next to her in the street? (p. 75)',
          answerId: 'woman',
          options: [
            { id: 'woman', label: 'A kind old woman', img: 'img/old-woman.webp', emoji: '👵' },
            { id: 'guards', label: 'Two astronauts', img: 'img/guards.webp', emoji: '🧑‍🚀' },
            { id: 'book', label: 'A little puppy', img: 'img/book.webp', emoji: '🐶' }
          ]
        },
        '4': {
          num: 4,
          question: 'Gate 4: What did Jannah give the old woman to help her see? (p. 77)',
          answerId: 'glasses',
          options: [
            { id: 'glasses', label: 'Her red polka-dot glasses', img: 'img/glasses.webp', emoji: '👓' },
            { id: 'chariot', label: 'A two-wheeled chariot', img: 'img/chariot.webp', emoji: '🐎' },
            { id: 'strange', label: 'A pair of shoes', img: 'img/strange.webp', emoji: '👟' }
          ]
        },
        '5': {
          num: 5,
          question: 'Gate 5: Who shouted "What strange clothes! Stop her!"? (p. 78)',
          answerId: 'pharaoh',
          options: [
            { id: 'pharaoh', label: 'The Pharaoh', img: 'img/pharaoh.webp', emoji: '👑' },
            { id: 'woman', label: 'The old woman', img: 'img/old-woman.webp', emoji: '👵' },
            { id: 'jannah', label: 'Jannah’s mom', img: 'img/jannah.webp', emoji: '👩' }
          ]
        }
      }
    },

    // ACTIVITY 2: Unscramble the Letters (Words in Context, p. 75)
    unscramble: [
      {
        word: 'ANCIENT',
        clue: 'Very, very old; from a long time ago (like ancient Egypt!).',
        img: 'img/ancient.webp',
        emoji: '🏺'
      },
      {
        word: 'STRANGE',
        clue: 'Unusual or not normal—like Jannah’s red polka-dot pyjamas in the past!',
        img: 'img/strange.webp',
        emoji: '❓'
      },
      {
        word: 'PHARAOH',
        clue: 'A ruler or king of ancient Egypt wearing a blue and gold crown.',
        img: 'img/pharaoh.webp',
        emoji: '👑'
      },
      {
        word: 'CHARIOT',
        clue: 'A two-wheeled cart pulled fast by horses in the parade.',
        img: 'img/chariot.webp',
        emoji: '🛞'
      },
      {
        word: 'SURPRISED',
        clue: 'How the old woman felt when she put on Jannah’s glasses and could see!',
        img: 'img/surprised.webp',
        emoji: '😮'
      },
      {
        word: 'SCARED',
        clue: 'Feeling afraid—how Jannah felt when the guards chased her!',
        img: 'img/scared.webp',
        emoji: '😨'
      }
    ],

    // ACTIVITY 3: Put the Events in Order (6 Story Cards, pp. 74–79)
    events: [
      {
        step: 1,
        id: 'ev1',
        text: 'Jannah found a strange book called The Time Book before bed.',
        img: 'img/book.webp',
        emoji: '📖'
      },
      {
        step: 2,
        id: 'ev2',
        text: 'She opened the book and travelled to an ancient Egyptian city.',
        img: 'img/scene-book-open.webp',
        emoji: '🏛️'
      },
      {
        step: 3,
        id: 'ev3',
        text: 'She met an old woman who could not see the huge chariot.',
        img: 'img/old-woman.webp',
        emoji: '👵'
      },
      {
        step: 4,
        id: 'ev4',
        text: 'She gave the old woman her red glasses so she could see the Pharaoh.',
        img: 'img/glasses.webp',
        emoji: '👓'
      },
      {
        step: 5,
        id: 'ev5',
        text: 'The Pharaoh told the guards to stop Jannah, and she ran through the streets.',
        img: 'img/scene-pharaoh-chase.webp',
        emoji: '💂'
      },
      {
        step: 6,
        id: 'ev6',
        text: 'Jannah woke up in her bed—and the old woman on the book cover had her glasses!',
        img: 'img/bed.webp',
        emoji: '🛏️'
      }
    ],

    // ACTIVITY 4: Main Idea or Detail? (pp. 73 & 81)
    mainIdea: [
      {
        id: 'mi1',
        sentence: 'With her special book, Jannah explores Cairo in ancient Egypt.',
        answer: 'main',
        img: 'img/book.webp',
        emoji: '⭐',
        explain: 'Main Idea! Page 81 shows this is the big idea of the whole story.'
      },
      {
        id: 'mi2',
        sentence: 'The old woman cannot see well, so Jannah says, "Try my glasses."',
        answer: 'detail',
        img: 'img/glasses.webp',
        emoji: '🔍',
        explain: 'Detail! This is one helpful moment that happens inside the story.'
      },
      {
        id: 'mi3',
        sentence: 'Jannah lives in Cairo and loves to read one more story before bed.',
        answer: 'detail',
        img: 'img/jannah.webp',
        emoji: '🔍',
        explain: 'Detail! Page 73 shows this gives extra information about Jannah.'
      },
      {
        id: 'mi4',
        sentence: 'The Pharaoh sees Jannah’s strange clothes and shouts, "Stop her!"',
        answer: 'detail',
        img: 'img/pharaoh.webp',
        emoji: '🔍',
        explain: 'Detail! This explains why the guards run after Jannah.'
      },
      {
        id: 'mi5',
        sentence: 'Jannah travels into the past to ancient Egypt with a magic book.',
        answer: 'main',
        img: 'img/scene-book-open.webp',
        emoji: '⭐',
        explain: 'Main Idea! This tells the most important big idea of the story!'
      },
      {
        id: 'mi6',
        sentence: 'At the end, Jannah wakes up in her bed and cannot find her glasses.',
        answer: 'detail',
        img: 'img/bed.webp',
        emoji: '🔍',
        explain: 'Detail! This is the surprise ending detail on page 79.'
      }
    ],

    // ACTIVITY 5: Who Am I? (7 Riddles)
    riddles: [
      {
        id: 'rid1',
        clue: '“I am the king of ancient Egypt. I wear a blue and gold crown and shout: Stop her!” Who am I?',
        answerId: 'pharaoh',
        options: [
          { id: 'pharaoh', label: 'The Pharaoh', img: 'img/pharaoh.webp', emoji: '👑' },
          { id: 'woman', label: 'The Old Woman', img: 'img/old-woman.webp', emoji: '👵' },
          { id: 'jannah', label: 'Jannah', img: 'img/jannah.webp', emoji: '👧' },
          { id: 'guards', label: 'The Guards', img: 'img/guards.webp', emoji: '💂' }
        ]
      },
      {
        id: 'rid2',
        clue: '“Put me in front of your eyes! Ancient Egyptians did not have me, and I help people see better.” What am I?',
        answerId: 'glasses',
        options: [
          { id: 'glasses', label: 'Red Glasses', img: 'img/glasses.webp', emoji: '👓' },
          { id: 'chariot', label: 'A Chariot', img: 'img/chariot.webp', emoji: '🛞' },
          { id: 'book', label: 'The Time Book', img: 'img/book.webp', emoji: '📖' },
          { id: 'bed', label: 'Jannah’s Bed', img: 'img/bed.webp', emoji: '🛏️' }
        ]
      },
      {
        id: 'rid3',
        clue: '“I am an old woman in the street. Jannah shares her glasses with me, and I tell her: Run!” Who am I?',
        answerId: 'woman',
        options: [
          { id: 'woman', label: 'The Old Woman', img: 'img/old-woman.webp', emoji: '👵' },
          { id: 'pharaoh', label: 'The Pharaoh', img: 'img/pharaoh.webp', emoji: '👑' },
          { id: 'guards', label: 'The Guards', img: 'img/guards.webp', emoji: '💂' },
          { id: 'jannah', label: 'Jannah', img: 'img/jannah.webp', emoji: '👧' }
        ]
      },
      {
        id: 'rid4',
        clue: '“I have a picture of an old street on my cover. When you open me, I take you to the past!” What am I?',
        answerId: 'book',
        options: [
          { id: 'book', label: 'The Time Book', img: 'img/book.webp', emoji: '📖' },
          { id: 'glasses', label: 'Red Glasses', img: 'img/glasses.webp', emoji: '👓' },
          { id: 'chariot', label: 'A Chariot', img: 'img/chariot.webp', emoji: '🛞' },
          { id: 'city', label: 'Ancient City', img: 'img/city.webp', emoji: '🏛️' }
        ]
      },
      {
        id: 'rid5',
        clue: '“I am a girl from Cairo who loves reading. I travel in time wearing my red polka-dot pyjamas!” Who am I?',
        answerId: 'jannah',
        options: [
          { id: 'jannah', label: 'Jannah', img: 'img/jannah.webp', emoji: '👧' },
          { id: 'woman', label: 'The Old Woman', img: 'img/old-woman.webp', emoji: '👵' },
          { id: 'pharaoh', label: 'The Pharaoh', img: 'img/pharaoh.webp', emoji: '👑' },
          { id: 'guards', label: 'The Guards', img: 'img/guards.webp', emoji: '💂' }
        ]
      },
      {
        id: 'rid6',
        clue: '“We work for the Pharaoh! We shout Wait! and chase Jannah through the hot, dark streets.” Who are we?',
        answerId: 'guards',
        options: [
          { id: 'guards', label: 'The Guards', img: 'img/guards.webp', emoji: '💂' },
          { id: 'pharaoh', label: 'The Pharaoh', img: 'img/pharaoh.webp', emoji: '👑' },
          { id: 'woman', label: 'The Old Woman', img: 'img/old-woman.webp', emoji: '👵' },
          { id: 'chariot', label: 'A Chariot', img: 'img/chariot.webp', emoji: '🛞' }
        ]
      },
      {
        id: 'rid7',
        clue: '“I am huge and have wheels! Horses pull me fast in the Pharaoh’s street parade.” What am I?',
        answerId: 'chariot',
        options: [
          { id: 'chariot', label: 'A Chariot', img: 'img/chariot.webp', emoji: '🛞' },
          { id: 'book', label: 'The Time Book', img: 'img/book.webp', emoji: '📖' },
          { id: 'glasses', label: 'Red Glasses', img: 'img/glasses.webp', emoji: '👓' },
          { id: 'bed', label: 'Jannah’s Bed', img: 'img/bed.webp', emoji: '🛏️' }
        ]
      }
    ]
  };
})();
