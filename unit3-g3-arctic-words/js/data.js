/* Grade 3 Unit 3 "Arctic Words": one teacher-led smartboard lesson (35 minutes) about the poem The Bear and I.
   Words: ice, polar bear, fish, hole, thin, crack, enemy. Sentences are simple A1 English written for this lesson (no book text copied). */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  D.missions = [
    { e: '🖼️', t: 'Match the words to pictures' }, { e: '🧩', t: 'Understand a sentence' }, { e: '🧊', t: 'Build sentences: the bear walks' },
    { e: '🐻', t: 'Man, bear or both?' }, { e: '🐟', t: 'Feed the hungry bear' }
  ];
  D.hookPrompts = [
    'Look at the Arctic. What can you see?',
    'There is a man and a polar bear. The ice is white and cold.',
    'Today we learn Arctic words and help the hungry bear!'
  ];

  /* GAME 1: word -> picture (three pictures) */
  D.match = [
    { q: 'ice', say: 'Ice is cold and hard.', o: [{ e: '🧊', n: 'ice' }, { e: '🔥', n: 'fire' }, { e: '🌳', n: 'tree' }], a: 0 },
    { q: 'polar bear', say: 'A polar bear is big and white.', o: [{ e: '🐻', n: 'brown bear' }, { e: '🐻‍❄️', n: 'polar bear' }, { e: '🐧', n: 'penguin' }], a: 1 },
    { q: 'fish', say: 'A fish swims in the water.', o: [{ e: '🐟', n: 'fish' }, { e: '🐦', n: 'bird' }, { e: '🐄', n: 'cow' }], a: 0 },
    { q: 'hole', say: 'There is a hole in the ice.', o: [{ e: '🕳️', n: 'hole' }, { e: '⛰️', n: 'mountain' }, { e: '☁️', n: 'cloud' }], a: 0 },
    { q: 'enemy', say: 'The bear is the man’s enemy in the poem.', o: [{ e: '🤝', n: 'friends' }, { e: '😠', n: 'enemy' }, { e: '😴', n: 'sleeping' }], a: 1 },
    { q: 'crack', say: 'The ice cracks. Crack!', o: [{ e: '⚡', n: 'crack' }, { e: '☀️', n: 'sun' }, { e: '❄️', n: 'snow' }], a: 0 }
  ];

  /* GAME 2: sentence -> picture that shows the meaning (context) */
  D.context = [
    { q: 'The ice is thin.', say: 'The ice is thin. It can break.', o: [{ e: '🧊', n: 'thick ice' }, { e: '🩹', n: 'thin ice' }, { e: '🏔️', n: 'big mountain' }], a: 1 },
    { q: 'The bear is hungry.', say: 'The bear is hungry. He wants fish.', o: [{ e: '😋', n: 'happy and full' }, { e: '🍽️', n: 'wants food' }, { e: '😴', n: 'sleeping' }], a: 1 },
    { q: 'There is a hole in the ice.', say: 'There is a hole in the ice.', o: [{ e: '🕳️', n: 'a hole' }, { e: '🏠', n: 'a house' }, { e: '🌲', n: 'a tree' }], a: 0 },
    { q: 'The man is fishing.', say: 'The man is fishing with a rod.', o: [{ e: '🎣', n: 'fishing' }, { e: '🏃', n: 'running' }, { e: '🛌', n: 'sleeping' }], a: 0 },
    { q: 'The bear is big.', say: 'The bear is big.', o: [{ e: '🐭', n: 'tiny mouse' }, { e: '🐻‍❄️', n: 'big bear' }, { e: '🐟', n: 'small fish' }], a: 1 }
  ];

  /* GAME 3: build the sentence (the bear walks forward) */
  D.build = [
    { s: 'The bear is big.' }, { s: 'The man has a fish.' }, { s: 'The ice is thin.' }, { s: 'The bear eats fish.' }, { s: 'There is a hole in the ice.' }
  ];

  /* GAME 4 (class walk): man, bear or both */
  D.zones = [{ k: 'M', t: '🧑 MAN', c: '#2563eb' }, { k: 'B', t: '🤝 BOTH', c: '#16a34a' }, { k: 'R', t: '🐻 BEAR', c: '#a16207' }];
  D.walk = [
    { e: '🎣', t: 'has a fishing rod', a: 'M', s: 'The man has a fishing rod.' },
    { e: '🐟', t: 'eats fish', a: 'B', s: 'The man and the bear eat fish.' },
    { e: '🧥', t: 'has white fur', a: 'R', s: 'The bear has white fur.' },
    { e: '😋', t: 'is hungry', a: 'B', s: 'The man and the bear are hungry.' },
    { e: '🏔️', t: 'lives in the Arctic', a: 'R', s: 'The bear lives in the Arctic.' },
    { e: '🧤', t: 'wears gloves', a: 'M', s: 'The man wears gloves.' },
    { e: '🧊', t: 'is on the ice', a: 'B', s: 'The man and the bear are on the ice.' }
  ];

  /* GAME 5: feed the bear (words that end in -ng) */
  D.fish = [
    { w: 'sing', ng: true }, { w: 'long', ng: true }, { w: 'king', ng: true }, { w: 'ring', ng: true }, { w: 'bang', ng: true }, { w: 'spring', ng: true },
    { w: 'hole', ng: false }, { w: 'thin', ng: false }, { w: 'trap', ng: false }, { w: 'ice', ng: false }, { w: 'cat', ng: false }, { w: 'fish', ng: false }
  ];
  root.W5ArcticData = D;
})(window);
