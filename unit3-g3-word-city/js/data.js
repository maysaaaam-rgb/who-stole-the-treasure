/* Grade 3 Unit 3 "Word City": one teacher-led smartboard lesson (35 minutes). Words: hole, trap, enemy, thin, sing, long, spring and other -ng words.
   Sentences are simple A1 English written for this lesson (no book text copied). */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  D.missions = [
    { e: '🏙️', t: 'Explore the city and find words' }, { e: '🏭', t: 'Fix the letter factory' }, { e: '🎈', t: 'Catch the -ng balloons' },
    { e: '🚂', t: 'Load the word trains' }, { e: '🚪', t: 'Open the magic gate' }
  ];
  D.hookPrompts = [
    'Welcome to Word City! The words are hidden.',
    'Walk around the city. Find the hidden things. Collect the words in your backpack.',
    'The factory is broken and the magic gate is closed. Can you help?'
  ];

  /* GAME 1: city explore. Six places: four hide a word, two are empty. */
  D.city = [
    { place: '🏠', n: 'the house', e: '🕳️', w: 'hole', say: 'hole. There is a hole in the ground.' },
    { place: '🌳', n: 'the park', e: '🪤', w: 'trap', say: 'trap. A trap is in the park.' },
    { place: '🏰', n: 'the castle', e: '😈', w: 'enemy', say: 'enemy. An enemy is at the castle.' },
    { place: '🏪', n: 'the shop', e: '📏', w: 'thin', say: 'thin. The book is thin.' },
    { place: '🏫', n: 'the school', e: '', w: '', say: 'Nothing here. Try another place!' },
    { place: '⛲', n: 'the fountain', e: '', w: '', say: 'Nothing here. Try another place!' }
  ];

  /* GAME 2: letter factory */
  D.factory = [
    { w: 'SING', clue: '🎤', say: 'sing. I like to sing.' },
    { w: 'LONG', clue: '📏', say: 'long. The snake is long.' },
    { w: 'SPRING', clue: '🌸', say: 'spring. Flowers grow in spring.' }
  ];

  /* GAME 3: -ng balloons */
  D.balloonsGood = ['sing', 'long', 'bang', 'spring', 'king', 'ring'];
  D.balloonsBad = ['thin', 'trap', 'hole', 'enemy', 'sun', 'cat'];

  /* GAME 4: word trains. Car keys: P = places and things, H = people, D = describing words */
  D.cars = [
    { k: 'T', t: 'THINGS and PLACES', e: '🚃', c: '#0ea5e9' },
    { k: 'P', t: 'PEOPLE', e: '🚃', c: '#f59e0b' },
    { k: 'D', t: 'DESCRIBING WORDS', e: '🚃', c: '#10b981' }
  ];
  D.words = [
    { w: 'hole', e: '🕳️', k: 'T' }, { w: 'trap', e: '🪤', k: 'T' }, { w: 'spring', e: '🌸', k: 'T' },
    { w: 'enemy', e: '😈', k: 'P' }, { w: 'king', e: '👑', k: 'P' },
    { w: 'thin', e: '📏', k: 'D' }, { w: 'long', e: '🐍', k: 'D' }
  ];

  /* GAME 5: magic gate sentences */
  D.gate = [
    { s: 'There is a hole in the ground.', e: '🕳️' }, { s: 'The trap is in the park.', e: '🪤' },
    { s: 'The road is long.', e: '🛣️' }, { s: 'Flowers grow in spring.', e: '🌸' }
  ];
  root.W5CityData = D;
})(window);
