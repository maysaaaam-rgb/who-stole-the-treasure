/* Grade 4 Worksheet + Class Store lesson (Units 1 and 2). 10 questions = up to 10 coins. Two versions (A and B) so neighbours cannot copy. */
window.WsData = (function () {
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  /* The answer keys: same numbers as the printed sheet (worksheet.html). `say` is the full sentence read aloud when revealed. */
  D.key = {
    A: [
      { n: 1, u: 1, a: 'chased', say: 'Alice chased a White Rabbit.' },
      { n: 2, u: 1, a: 'fell', say: 'Alice fell down a deep hole.' },
      { n: 3, u: 1, a: 'Where', say: 'Where did Alice fall? Down a deep hole.' },
      { n: 4, u: 1, a: 'The monarch butterfly goes on a long journey.', say: 'The monarch butterfly goes on a long journey.' },
      { n: 5, u: 1, a: 'the title and the headings', say: 'When you skim, you look at the title and the headings first.' },
      { n: 6, u: 2, a: 'so', say: 'The hare turns white so it can hide in the snow.' },
      { n: 7, u: 2, a: 'hibernate', say: 'Bears hibernate so they can survive the cold.' },
      { n: 8, u: 2, a: 'coniferous', say: 'Coniferous trees have needles and cones.' },
      { n: 9, u: 2, a: 'gave', say: 'The swallow gave Go Ne a seed.' },
      { n: 10, u: 2, a: 'hit', say: 'Wen Shu hit a swallow with a stone.' }
    ],
    B: [
      { n: 1, u: 1, a: 'fell', say: 'Then Alice fell down a hole.' },
      { n: 2, u: 1, a: 'chased', say: 'Alice chased the White Rabbit.' },
      { n: 3, u: 1, a: 'Why', say: 'Why was Alice sleepy? Because she was bored.' },
      { n: 4, u: 1, a: 'Reading is a workout for your brain.', say: 'Reading is a workout for your brain.' },
      { n: 5, u: 1, a: 'title', say: 'Skimming means looking at the title and the headings first.' },
      { n: 6, u: 2, a: 'so', say: 'The bear eats a lot so it can sleep all winter.' },
      { n: 7, u: 2, a: 'deciduous', say: 'Deciduous trees drop their leaves.' },
      { n: 8, u: 2, a: 'needles', say: 'Coniferous trees have needles instead of leaves.' },
      { n: 9, u: 2, a: 'grew', say: 'The seed grew into a big, round fruit.' },
      { n: 10, u: 2, a: 'paid', say: 'Go Ne paid the vet with his gold coins.' }
    ]
  };

  /* Class Store demo: prices copied from the real Classroom Store (checked 7 Oct 2026). If you change prices in the platform, update them here too. */
  D.demoCoins = 6;
  D.shelves = [
    { id: 'rewards', title: '🎟️ Class rewards', items: [
      { e: '🪑', n: 'Sit anywhere for one lesson', p: 10 }, { e: '🎲', n: 'Pick the next game', p: 10 }, { e: '🌟', n: 'Special sticker', p: 15 },
      { e: '🎵', n: 'Choose the warm-up song', p: 20 }, { e: '🧑‍🏫', n: 'Be the teacher’s helper', p: 20 }, { e: '🎧', n: 'Class DJ for 5 minutes', p: 30 }
    ] },
    { id: 'boxes', title: '🎁 Mystery boxes', items: [
      { e: '🥉', n: 'Bronze Box', p: 3, box: true }, { e: '🥈', n: 'Silver Box', p: 5, box: true }, { e: '🥇', n: 'Gold Box', p: 15, box: true }, { e: '💎', n: 'Diamond Box', p: 50, box: true }
    ] },
    { id: 'monster', title: '👾 Monster items', items: [
      { e: '🎩', n: 'Common item', p: 10 }, { e: '🕶️', n: 'Rare item', p: 20 }, { e: '👑', n: 'Epic item', p: 30 }, { e: '🪽', n: 'Legendary item', p: 70 }
    ] }
  ];
  D.boxPrizes = [
    { e: '🎩', t: 'a cool monster hat!' }, { e: '🪙', t: '5 bonus coins!' }, { e: '🎵', t: 'a new sound!' }, { e: '🏷️', t: 'a special title!' }, { e: '🕶️', t: 'monster glasses!' }
  ];
  return D;
})();
