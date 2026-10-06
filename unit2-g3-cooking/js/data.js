/* Grade 3 Unit 2 Week 2: Chuseok Cooking and Treats. Two 35-minute smartboard lessons + a home cooking mission.
   Level A1. Language: food words, kitchen verbs (mix, pour, roll, fill, press, steam, add, cut), First / Then / Finally, It is sweet / yummy. */
window.CookData = (function () {
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  D.videos = {
    song: { id: '_et-dm-6Bl8', title: 'Chuseok Snack Song', by: 'Chillerbox Kids', len: '2:42' },
    cook: { id: 'NX1jRjOfoEs', title: 'How to make Songpyeon', by: 'Kimchimari', len: '2:22' }
  };

  /* Lesson 1 */
  D.missions1 = [
    { e: '🎵', t: 'Sing the Chuseok Snack Song' }, { e: '👩‍🍳', t: 'Learn the kitchen actions' },
    { e: '🎬', t: 'Watch how to make songpyeon' }, { e: '🥣', t: 'Play Mix and Make' }
  ];
  D.mystery = [
    { e: '🍡', n: 'songpyeon', clue: 'It is soft. It is a half moon. It is a rice cake.' },
    { e: '🍘', n: 'gangjeong', clue: 'It is crispy. It is sweet. Crunch, crunch!' },
    { e: '🍪', n: 'yakgwa', clue: 'It is a cookie. It has honey. It is sweet.' },
    { e: '🥛', n: 'sikhye', clue: 'It is a drink. It is cold and sweet. We drink it.' }
  ];
  D.songWords = [
    { e: '🍡', n: 'songpyeon', m: 'rice cake', act: '🌙 Make a half moon with your hands' },
    { e: '🍘', n: 'gangjeong', m: 'crispy sweets', act: '😬 Crunch, crunch with your teeth' },
    { e: '🍪', n: 'yakgwa', m: 'honey cookies', act: '🍯 Lick your fingers: yummy!' },
    { e: '🥛', n: 'sikhye', m: 'sweet rice drink', act: '🥤 Drink from a big cup' }
  ];
  D.verbs = [
    { v: 'mix', e: '🥄', act: 'Turn your hand round and round.' },
    { v: 'pour', e: '🫗', act: 'Tip a jug with your hand.' },
    { v: 'roll', e: '🤲', act: 'Roll a little ball in your hands.' },
    { v: 'fill', e: '🫘', act: 'Put a little filling inside.' },
    { v: 'press', e: '👇', act: 'Press with your fingers.' },
    { v: 'steam', e: '♨️', act: 'Wave your hands up like steam.' },
    { v: 'add', e: '➕', act: 'Drop something into the bowl.' },
    { v: 'cut', e: '🔪', act: 'Chop, chop with a flat hand (only with an adult!).' }
  ];
  D.songpyeonSteps = [
    { v: 'mix', s: 'First, mix the rice flour and water.' },
    { v: 'roll', s: 'Then, roll a small ball.' },
    { v: 'fill', s: 'Next, fill it with honey and sesame.' },
    { v: 'press', s: 'Then, press it into a half moon.' },
    { v: 'steam', s: 'Finally, steam the songpyeon. Yummy!' }
  ];

  /* Mix and Make: the right ingredients, then the actions in order. Silly items make a "yuck" pot. */
  D.shelf = [
    { id: 'flour', e: '🌾', n: 'rice flour' }, { id: 'water', e: '💧', n: 'water' }, { id: 'honey', e: '🍯', n: 'honey' },
    { id: 'sesame', e: '🌰', n: 'sesame' }, { id: 'apple', e: '🍎', n: 'apples' }, { id: 'pear', e: '🍐', n: 'pears' },
    { id: 'straw', e: '🍓', n: 'strawberries' }, { id: 'juice', e: '🧃', n: 'juice' }, { id: 'rice', e: '🍚', n: 'rice' },
    { id: 'salt', e: '🧂', n: 'salt' }, { id: 'sock', e: '🧦', n: 'a sock', silly: true }, { id: 'fish', e: '🐟', n: 'a fish', silly: true },
    { id: 'chili', e: '🌶️', n: 'chili', silly: true }, { id: 'worm', e: '🪱', n: 'a worm', silly: true }
  ];
  D.recipes = [
    { id: 'punch', e: '🍹', n: 'Fruit Punch (hwachae)', need: ['apple', 'pear', 'straw', 'juice', 'honey'], steps: ['cut', 'add', 'pour', 'mix'],
      say: ['First, cut the fruit.', 'Then, add the fruit to the bowl.', 'Next, pour the juice.', 'Finally, mix. It is cold and sweet!'] },
    { id: 'balls', e: '🍙', n: 'Rice Balls (jumeokbap)', need: ['rice', 'salt', 'sesame'], steps: ['add', 'mix', 'roll'],
      say: ['First, add the salt and sesame to the rice.', 'Then, mix.', 'Finally, roll the rice balls. Yummy!'] },
    { id: 'songpyeon', e: '🍡', n: 'Songpyeon (rice cakes)', need: ['flour', 'water', 'honey', 'sesame'], steps: ['mix', 'roll', 'fill', 'press', 'steam'],
      say: ['First, mix the rice flour and water.', 'Then, roll a small ball.', 'Next, fill it with honey and sesame.', 'Then, press it into a half moon.', 'Finally, steam it. Yummy!'] }
  ];

  /* Lesson 2 */
  D.missions2 = [
    { e: '🧊', t: 'Kitchen Freeze warm-up' }, { e: '🏁', t: 'Recipe Race' },
    { e: '📺', t: 'Junior Chef Show' }, { e: '🏠', t: 'Your home cooking mission' }
  ];
  D.race = [
    { r: 'punch', cards: ['Cut the fruit.', 'Add the fruit to the bowl.', 'Pour the juice.', 'Mix it.'] },
    { r: 'balls', cards: ['Add salt and sesame to the rice.', 'Mix it.', 'Roll the rice balls.'] },
    { r: 'songpyeon', cards: ['Mix the rice flour and water.', 'Roll a small ball.', 'Fill it with honey.', 'Press it into a half moon.', 'Steam it.'] }
  ];
  D.showFrames = [
    'Hello! I am Chef ___. Today I make ___.',
    'First, I ___.',
    'Then, I ___.',
    'Finally, I ___.',
    'It is sweet / yummy! Do you like it?'
  ];
  D.homeRecipes = [
    { id: 'punch', e: '🍹', n: 'Fruit Punch (hwachae)', level: 'Easy, no cooking', need: 'fruit (apple, pear, strawberries or watermelon), apple juice, honey',
      steps: ['Wash the fruit.', 'An adult cuts the fruit.', 'Add the fruit to a bowl.', 'Pour the juice.', 'Add a little honey and mix.'] },
    { id: 'balls', e: '🍙', n: 'Rice Balls (jumeokbap)', level: 'Easy, an adult cooks the rice', need: 'cooked rice, a little salt, sesame seeds, a little oil',
      steps: ['An adult cooks the rice.', 'Add salt, sesame and oil.', 'Mix.', 'Wash your hands.', 'Roll small balls.'] },
    { id: 'songpyeon', e: '🍡', n: 'Songpyeon (rice cakes)', level: 'Harder, an adult steams them', need: 'rice flour, warm water, honey, sesame (or sugar)',
      steps: ['Mix the rice flour and warm water.', 'Roll small balls.', 'Fill with honey and sesame.', 'Press into half moons.', 'An adult steams them.'] }
  ];
  return D;
})();
