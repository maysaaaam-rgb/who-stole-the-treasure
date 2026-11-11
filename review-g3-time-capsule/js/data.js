/**
 * Grade 3 • Unit 5 Lesson 2: "Time Capsule Mission"
 * Curriculum Data (Global Readings Level 2, pp. 81–87)
 */
(function () {
  'use strict';

  window.TC_DATA = {
    title: 'Time Capsule Mission',
    unit: "Grade 3 • Unit 5: Let's Go Back — Time Capsules (pp. 81–87)",
    teams: [
      { id: 'v1', name: 'Voyager 1', emoji: '🚀' },
      { id: 'v2', name: 'Voyager 2', emoji: '🛸' },
      { id: 'earth', name: 'Earth Stars', emoji: '🌍' },
      { id: 'time', name: 'Time Explorers', emoji: '⏳' }
    ],

    activities: [
      {
        id: 1,
        num: 'Activity 1',
        minutes: 8,
        title: 'Time Capsule Message',
        subtitle: 'Pack the 6 book capsule objects and write a message to the future! (pp. 81–86)',
        img: 'img/capsule.webp',
        emoji: 'カプセル',
        intro: 'People put letters, pictures, coins, newspapers, toys, and a gold disc in time capsules! First, pack the 6 real capsule items, then complete your message to the future!'
      },
      {
        id: 2,
        num: 'Activity 2',
        minutes: 7,
        title: 'Word Search (10×10 Grid)',
        subtitle: 'Find 8 Unit 5 words across and down: FUTURE, OBJECTS, SPACE, DISC, EARTH, COINS, PAST, WIND!',
        img: 'img/spacecraft.webp',
        emoji: '🔎',
        intro: 'Tap the first letter and last letter of each hidden word in the 10 by 10 grid! Words go across and down!'
      },
      {
        id: 3,
        num: 'Activity 3',
        minutes: 7,
        title: 'Sentence Scramble',
        subtitle: 'Tap the word tiles in order to build 6 sentences about Time Capsules!',
        img: 'img/disc.webp',
        emoji: '🧩',
        intro: 'The words in our space transmission are mixed up! Tap the word tiles in order to build each sentence!'
      },
      {
        id: 4,
        num: 'Activity 4',
        minutes: 7,
        title: 'Word Sorting — 3 Baskets',
        subtitle: 'Sort 9 words into PLACES 🌍, SOUNDS 🔊, and OBJECTS WE CAN TOUCH ✋!',
        img: 'img/earth.webp',
        emoji: '🧺',
        intro: 'On the Voyager gold disc there are places, sounds, and objects! Sort each word into the right basket!'
      },
      {
        id: 5,
        num: 'Activity 5',
        minutes: 6,
        title: 'Opposites Matching',
        subtitle: 'Match 8 pairs of opposite words: past–future, old–new, ancient–modern & more!',
        img: 'img/future.webp',
        emoji: '⚡',
        intro: 'Tap a word on the left and tap its opposite on the right to connect the power cables!'
      }
    ],

    // ACTIVITY 1: Time Capsule Objects (6 correct from pp. 81-85 + 2 distractors) & Message Builder
    capsuleItems: [
      { id: 'coins', label: '1795 Coins', img: 'img/coins.webp', emoji: '🪙', inCapsule: true },
      { id: 'newspaper', label: 'Newspapers', img: 'img/newspaper.webp', emoji: '📰', inCapsule: true },
      { id: 'letter', label: 'A Letter', img: 'img/letter.webp', emoji: '✉️', inCapsule: true },
      { id: 'photo', label: 'Photos of Earth', img: 'img/photo.webp', emoji: '🖼️', inCapsule: true },
      { id: 'toy', label: 'A Toy & Game', img: 'img/toy.webp', emoji: '🤖', inCapsule: true },
      { id: 'disc', label: 'The Gold Disc', img: 'img/disc.webp', emoji: '💿', inCapsule: true },
      { id: 'chariot', label: 'A Huge Chariot', img: 'img/chariot.webp', emoji: '🛞', inCapsule: false },
      { id: 'pharaoh', label: 'A Live Pharaoh', img: 'img/pharaoh.webp', emoji: '👑', inCapsule: false }
    ],
    messageWordCards: [
      'our school and animals',
      'books, movies, and music',
      'things we do every day',
      'photos and letters from Earth',
      'coins and newspapers',
      'our favourite toys and games'
    ],

    // ACTIVITY 2: 10x10 Word Search Grid (Across & Down only)
    // Row 0: F U T U R E M K P L -> FUTURE (0,0..0,5)
    // Row 1: O B J E C T S A A B -> OBJECTS (1,0..1,6)
    // Row 2: C O I N S R P S S C -> COINS (2,0..2,4)
    // Row 3: E A R T H N A T T D -> EARTH (3,0..3,4)
    // Row 4: D I S C Q V C Z M E -> DISC (4,0..4,3)
    // Row 5: W I N D X Y E B N F -> WIND (5,0..5,3)
    // Row 6: P A S T G H J K L M -> PAST (6,0..6,3)
    // Row 7: S P A C E R T Y U I -> SPACE (7,0..7,4)
    // Row 8: N E W S P A P E R S -> (bonus / filler row)
    // Row 9: V O Y A G E R D A Y -> (bonus / filler row)
    wordSearch: {
      grid: [
        ['F', 'U', 'T', 'U', 'R', 'E', 'M', 'K', 'P', 'L'],
        ['O', 'B', 'J', 'E', 'C', 'T', 'S', 'A', 'A', 'B'],
        ['C', 'O', 'I', 'N', 'S', 'R', 'P', 'S', 'S', 'C'],
        ['E', 'A', 'R', 'T', 'H', 'N', 'A', 'T', 'T', 'D'],
        ['D', 'I', 'S', 'C', 'Q', 'V', 'C', 'Z', 'M', 'E'],
        ['W', 'I', 'N', 'D', 'X', 'Y', 'E', 'B', 'N', 'F'],
        ['P', 'A', 'S', 'T', 'G', 'H', 'J', 'K', 'L', 'M'],
        ['S', 'P', 'A', 'C', 'E', 'R', 'T', 'Y', 'U', 'I'],
        ['A', 'N', 'C', 'I', 'E', 'N', 'T', 'W', 'Q', 'R'],
        ['V', 'O', 'Y', 'A', 'G', 'E', 'R', 'D', 'A', 'Y']
      ],
      words: [
        { word: 'FUTURE', r1: 0, c1: 0, r2: 0, c2: 5, emoji: '🚀' },
        { word: 'OBJECTS', r1: 1, c1: 0, r2: 1, c2: 6, emoji: '📦' },
        { word: 'COINS', r1: 2, c1: 0, r2: 2, c2: 4, emoji: '🪙' },
        { word: 'EARTH', r1: 3, c1: 0, r2: 3, c2: 4, emoji: '🌍' },
        { word: 'DISC', r1: 4, c1: 0, r2: 4, c2: 3, emoji: '💿' },
        { word: 'WIND', r1: 5, c1: 0, r2: 5, c2: 3, emoji: '🌬️' },
        { word: 'PAST', r1: 6, c1: 0, r2: 6, c2: 3, emoji: '⏳' },
        { word: 'ANCIENT', r1: 8, c1: 0, r2: 8, c2: 6, emoji: '🏺' }
      ]
    },

    // ACTIVITY 3: Sentence Scramble (6 Sentences from pp. 81–86)
    sentences: [
      { id: 's1', words: ['This', 'is', 'a', 'time', 'capsule.'], img: 'img/capsule.webp', emoji: '📦' },
      { id: 's2', words: ['People', 'lived', 'in', 'the', 'past.'], img: 'img/ancient.webp', emoji: '🏺' },
      { id: 's3', words: ['I', 'want', 'to', 'see', 'the', 'future.'], img: 'img/future.webp', emoji: '🚀' },
      { id: 's4', words: ['It', 'had', 'coins', 'and', 'newspapers.'], img: 'img/coins.webp', emoji: '🪙' },
      { id: 's5', words: ['Each', 'spacecraft', 'has', 'a', 'gold', 'disc.'], img: 'img/disc.webp', emoji: '💿' },
      { id: 's6', words: ['Hello,', 'people', 'of', 'the', 'future!'], img: 'img/earth.webp', emoji: '🌍' }
    ],

    // ACTIVITY 4: Word Sorting (3 Baskets, 9 Words)
    sorting: {
      baskets: [
        { id: 'places', title: 'PLACES 🌍', sub: 'Where people live or visit', color: '#38bdf8' },
        { id: 'sounds', title: 'SOUNDS 🔊', sub: 'Recorded on the Gold Disc', color: '#f59e0b' },
        { id: 'touch', title: 'THINGS WE TOUCH ✋', sub: 'Objects inside the capsule', color: '#10b981' }
      ],
      items: [
        { id: 'w1', label: 'Earth', emoji: '🌍', img: 'img/earth.webp', basket: 'places' },
        { id: 'w2', label: 'wind', emoji: '🌬️', img: 'img/wind.webp', basket: 'sounds' },
        { id: 'w3', label: 'coins', emoji: '🪙', img: 'img/coins.webp', basket: 'touch' },
        { id: 'w4', label: 'ancient city', emoji: '🏛️', img: 'img/ancient.webp', basket: 'places' },
        { id: 'w5', label: 'thunder', emoji: '⛈️', img: 'img/wind.webp', basket: 'sounds' },
        { id: 'w6', label: 'a toy', emoji: '🤖', img: 'img/toy.webp', basket: 'touch' },
        { id: 'w7', label: 'school', emoji: '🏫', img: 'img/photo.webp', basket: 'places' },
        { id: 'w8', label: 'music & songs', emoji: '🎵', img: 'img/disc.webp', basket: 'sounds' },
        { id: 'w9', label: 'a letter', emoji: '✉️', img: 'img/letter.webp', basket: 'touch' }
      ]
    },

    // ACTIVITY 5: Opposites Matching (8 Pairs)
    opposites: [
      { id: 'p1', left: 'past ⏳', right: 'future 🚀' },
      { id: 'p2', left: 'old 📜', right: 'new ✨' },
      { id: 'p3', left: 'ancient 🏺', right: 'modern 🏙️' },
      { id: 'p4', left: 'big 🐘', right: 'small 🐭' },
      { id: 'p5', left: 'loud 📢', right: 'quiet 🤫' },
      { id: 'p6', left: 'happy 😊', right: 'sad 😢' },
      { id: 'p7', left: 'open 🔓', right: 'close 🔒' },
      { id: 'p8', left: 'day ☀️', right: 'night 🌙' }
    ]
  };
})();
