/* Unit 3 (Grade 3) "How Much Is It?" - two teacher-led smartboard lessons where the CHILDREN do the work.
   Lesson 1: How Much Is It? (book pp. 40-41: money jars, where we use money, the farmers' problem, prices)
   Lesson 2: Before Money Was Money (book pp. 42-43: barter, shells, metal money, first coins; Words in Context)
   All sentences are written for these lessons in very simple A1 English. No long book text is copied.
   Facts (dates, places) come from the checked notes in unit3-work/out/final/unit3-grade3.json. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  D.numw = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  /* ---------------- LESSON 1: How Much Is It? ---------------- */
  D.missions1 = [
    { e: '🫙', t: 'Look at the money jars' }, { e: '🛒', t: 'Where do we use money?' },
    { e: '🐐', t: 'Solve the farmers’ problem' }, { e: '🏪', t: 'Ask: How much is it?' }, { e: '🏷️', t: 'Make jar labels' }
  ];
  D.jarPrompts = [
    'Look at the two jars. What can you see?',
    'There is money in the jars. Why do people put money in jars?',
    'What labels do you want on your jars? Think about it.'
  ];

  D.zones1 = [{ k: 'B', t: '🛒 BUY', c: '#b45309' }, { k: 'G', t: '🚶 GO', c: '#0e7490' }];
  D.walk1 = [
    { e: '🍞', t: 'You can buy bread.', a: 'B' }, { e: '🍕', t: 'You can buy pizza.', a: 'B' },
    { e: '🎬', t: 'You can go to the cinema.', a: 'G' }, { e: '📚', t: 'You can buy a book.', a: 'B' },
    { e: '🚌', t: 'You can go by bus.', a: 'G' }, { e: '🎡', t: 'You can go to a fun fair.', a: 'G' },
    { e: '🧸', t: 'You can buy a toy.', a: 'B' }
  ];

  D.farmers = [
    { say: 'Two farmers meet at the market.', act: '🤝 Wave to your partner.', scene: '🤝', art: 'w_bartered' },
    { say: 'One farmer needs a goat.', act: '🐐 Be a goat! Say: meh, meh!', scene: '🐐' },
    { say: 'The other farmer needs some grain.', act: '🌾 Carry a heavy sack of grain.', scene: '🌾' },
    { predict: 'They want to swap. But how much grain is one goat? Two bowls? Five bowls? What is the problem?',
      say: 'They cannot agree how much grain is the same as one goat. It takes a long, long time!', act: '😩 Make a tired face. Say: oh no!', scene: '🐐 ⚖️ 🌾', key: true },
    { say: 'People need something small and easy to carry. Something with a price.', act: '🤔 Think… what can it be?', scene: '❓' },
    { say: 'It is money! With money we can ask: How much is it?', act: '💰 Rub your fingers: money, money!', scene: '💰', key: true }
  ];

  D.shop = [
    { e: '🍎', n: 'an apple', p: 1 }, { e: '🍪', n: 'a cookie', p: 2 }, { e: '🎈', n: 'a balloon', p: 3 },
    { e: '🍕', n: 'a pizza slice', p: 4 }, { e: '📚', n: 'a book', p: 5 }, { e: '🧸', n: 'a teddy bear', p: 8 }, { e: '⚽', n: 'a football', p: 10 }
  ];

  D.labels = [
    { e: '🎮', n: 'video games' }, { e: '📚', n: 'books' }, { e: '🎓', n: 'college' }, { e: '🐶', n: 'animals' },
    { e: '🎁', n: 'a gift for Mom' }, { e: '🧸', n: 'toys' }, { e: '🍕', n: 'pizza' }, { e: '🚲', n: 'a bike' }
  ];

  D.race1 = [
    { type: 'scramble', words: ['much', 'How', 'it?', 'is'], answer: 'How much is it?' },
    { type: 'price', emoji: '🍕', price: 4, answer: 'It’s four dollars.' },
    { type: 'scramble', words: ['buy', 'You', 'bread.', 'can'], answer: 'You can buy bread.' },
    { type: 'price', emoji: '📚', price: 5, answer: 'It’s five dollars.' },
    { type: 'scramble', words: ['expensive!', 'That’s'], answer: 'That’s expensive!' },
    { type: 'price', emoji: '⚽', price: 10, answer: 'It’s ten dollars.' }
  ];

  /* ---------------- LESSON 2: Before Money Was Money ---------------- */
  D.missions2 = [
    { e: '❓', t: 'Guess the mystery money' }, { e: '⏳', t: 'Travel back in time' },
    { e: '🔎', t: 'Find the word meanings' }, { e: '📏', t: 'Put the money in order' }, { e: '💡', t: 'Find problems and solutions' }
  ];

  D.mystery = [
    { e: '🐚', a: 'w_cowrie_shells', n: 'cowrie shell', say: 'A cowrie shell. People used shells as money!' },
    { e: '⚒️', a: 'w_knives_spades', n: 'metal tool', say: 'A small metal tool. In China it was money!' },
    { e: '🪙', a: 'w_lydia_coin', n: 'coin', say: 'A coin. Round and made of metal.' },
    { e: '💵', a: 'w_paper_money', n: 'paper money', say: 'Paper money. Easy to carry!' },
    { e: '💳', n: 'credit card', say: 'A credit card. Plastic money!' }
  ];

  D.timeline = [
    { d: '6000 BCE', e: '🐐', a: 'w_bartered', n: 'barter' }, { d: '1200 BCE', e: '🐚', a: 'w_cowrie_shells', n: 'cowrie shells' },
    { d: '1000 BCE', e: '⚒️', a: 'w_knives_spades', n: 'knives and spades' }, { d: '600 BCE', e: '🪙', a: 'w_lydia_coin', n: 'first coins' }
  ];
  D.history = [
    { say: 'Thousands of years ago, people did not use money.', act: '🙅 Shake your head: no money!', scene: '🏞️', at: -1 },
    { say: 'They bartered. They swapped things they wanted.', act: '🔄 Swap your hands: give, take, give, take!', scene: '🐐 🔄 🌾', art: 'w_bartered', at: 0, key: true },
    { say: 'Around 6000 BCE, a man wanted a new goat. He paid with grain.', act: '🌾 Hold out the grain. Take the goat!', scene: '🐐 🌾', at: 0 },
    { say: 'But it took a long time to agree how much things were worth.', act: '😩 Tired face. Ask: how much?', scene: '⏳', at: 0 },
    { predict: 'People want money that is easy to carry. What can they use? A goat? A stone? A shell?',
      say: 'In 1200 BCE, people used cowrie shells as money. Shells are easier to carry than goats!', act: '🐚 Carry a tiny shell. Easy!', scene: '🐚', art: 'w_cowrie_shells', at: 1, key: true },
    { say: 'Later, in China, people used small metal knives and spades.', act: '⚒️ Show a knife. Careful!', scene: '⚒️', art: 'w_knives_spades', at: 2 },
    { say: 'But this money was difficult to carry. So people made round metal money with holes.', act: '⭕ Make a big O with your fingers.', scene: '⭕', art: 'w_round_holed_coin', at: 2 },
    { say: 'Around 600 BCE, a king in Lydia made the first true coins. Everyone knew how much each coin was worth!', act: '👑 Put on a crown. Hold a coin!', scene: '👑', art: 'w_lydia_coin', at: 3, key: true },
    { say: 'Lydia is part of modern-day Turkey!', act: '🙋 Stand up if you live in Turkey. Wave!', scene: '📍', at: 3 }
  ];

  D.words = [
    { w: 'bartered', e: '🔄', def: 'swapped things without money', ex: 'People bartered a goat for grain.', gap: 'People ______ a goat for grain.' },
    { w: 'metal', e: '🔩', def: 'a hard, shiny material, like gold or silver', ex: 'Coins are made of metal.', gap: 'Coins are made of ______.' },
    { w: 'valuable', e: '💎', def: 'worth a lot of money', ex: 'Gold is very valuable.', gap: 'Gold is very ______.' },
    { w: 'credit card', e: '💳', def: 'a small plastic card you use to pay', ex: 'My mom pays with a credit card.', gap: 'My mom pays with a ______.' },
    { w: 'plastic', e: '🧴', def: 'a light material for bottles and cards', ex: 'This bottle is plastic.', gap: 'This bottle is ______.' }
  ];

  D.order = [{ e: '🪙', a: 'w_lydia_coin', n: 'first coins', d: '600 BCE', k: 4 }, { e: '🐐', a: 'w_bartered', n: 'barter', d: '6000 BCE', k: 1 }, { e: '⚒️', a: 'w_knives_spades', n: 'knives and spades', d: '1000 BCE', k: 3 }, { e: '🐚', a: 'w_cowrie_shells', n: 'cowrie shells', d: '1200 BCE', k: 2 }];
  D.carryChips = ['Shells are easier to carry than goats.', 'Coins are easier to carry than knives and spades.', 'Paper money is easier to carry than metal coins.'];
  D.holesChips = ['I think …', 'I think they can carry them on a string.', 'I think it is easy to count.'];

  D.zones2 = [{ k: 'P', t: '😟 PROBLEM', c: '#b91c1c' }, { k: 'S', t: '💡 SOLUTION', c: '#15803d' }];
  D.walk2 = [
    { e: '⏳', t: 'It takes a long time to agree how much things are worth.', a: 'P' },
    { e: '🐚', t: 'People use cowrie shells as money.', a: 'S' },
    { e: '⚒️', t: 'Knives and spades are difficult to carry.', a: 'P' },
    { e: '🪙', t: 'People make round metal money with holes.', a: 'S' },
    { e: '🐐', t: 'Goats and grain are heavy to carry.', a: 'P' },
    { e: '👑', t: 'The king makes coins. Everyone knows how much they are worth.', a: 'S' }
  ];

  D.race2 = [
    { type: 'scramble', words: ['bartered', 'People', 'long', 'ago.'], answer: 'People bartered long ago.' },
    { type: 'pick', prompt: 'Which came first: shells or coins?', emoji: '🐚 🪙', answer: 'Shells came first (1200 BCE). Coins came later (600 BCE).' },
    { type: 'scramble', words: ['easy', 'Shells', 'to', 'are', 'carry.'], answer: 'Shells are easy to carry.' },
    { type: 'pick', prompt: 'Where were the first true coins made?', emoji: '👑 🪙', answer: 'In Lydia (part of modern-day Turkey).' },
    { type: 'scramble', words: ['is', 'Gold', 'valuable.'], answer: 'Gold is valuable.' },
    { type: 'pick', prompt: 'Which word? A small plastic card you use to pay.', emoji: '💳', answer: 'A credit card.' }
  ];

  /* ---- games ---- */
  D.catchGood = [
    { e: '🐚', a: 'w_cowrie_shells', n: 'cowrie shell' }, { e: '⚒️', a: 'w_knives_spades', n: 'knives and spades' }, { e: '🪙', a: 'w_lydia_coin', n: 'first coin' },
    { e: '⭕', a: 'w_round_holed_coin', n: 'round coin' }, { e: '💵', a: 'w_paper_money', n: 'paper money' }, { e: '💳', a: 'w_credit_card', n: 'credit card' }
  ];
  D.catchBad = [
    { e: '🍴', a: 'w_fork_knife', n: 'fork and knife' }, { e: '👛', a: 'w_wallet', n: 'wallet' }, { e: '🧸', a: 'w_teddy', n: 'toy' }, { e: '⚽', a: 'w_football', n: 'ball' }, { e: '🍕', a: 'w_pizza', n: 'pizza' }
  ];
  D.budgets = [6, 8, 10];

  root.U3G3Data = D;
})(window);
