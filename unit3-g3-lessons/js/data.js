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


  /* ---------------- LESSON 3: Money Changes (book pp. 44-45) ---------------- */
  D.missions3 = [
    { e: '⏳', t: 'Remember the money story' }, { e: '🪙', t: 'From coins to cards' }, { e: '🔎', t: 'Learn six money words' },
    { e: '📏', t: 'Compare: easier to carry' }, { e: '🚂', t: 'Ride the Time Train' }, { e: '🗳️', t: 'Vote for the next money' }
  ];
  D.timeline2 = [
    { d: '6000 BCE', e: '🐐', a: 'w_bartered', n: 'barter' }, { d: '1200 BCE', e: '🐚', a: 'w_cowrie_shells', n: 'cowrie shells' },
    { d: '1000 BCE', e: '⚒️', a: 'w_knives_spades', n: 'knives and spades' }, { d: '600 BCE', e: '🪙', a: 'w_lydia_coin', n: 'first coins' },
    { d: '800-900 CE', e: '💵', a: 'w_paper_money', n: 'paper money' }, { d: '1958', e: '💳', a: 'w_credit_card', n: 'credit card' },
    { d: '21st century', e: '📱', a: 'w_electronic_money', n: 'electronic money' }
  ];
  D.recapPrompts = [
    'Last lesson we travelled back in time. What did people use before money?',
    'Which money was easier to carry than goats?',
    'Today we travel forward in time. What do you think comes next?'
  ];
  D.coins = [
    { say: 'Soon, many countries made their own coins from valuable metals like silver and gold.', act: '🪙 Make a coin with your fingers. Shiny!', scene: '🪙', art: 'w_lydia_coin', at: 3 },
    { say: 'This made buying and selling easier.', act: '🛒 Buy! Sell! Buy! Sell! Swap your hands.', scene: '🏪', art: 'w_money', at: 3 },
    { predict: 'Coins are heavy. What can people use that is easier to carry?', say: 'The first paper money came from China, between 800 and 900 CE. It was easier to carry than metal coins!', act: '💵 Fold a note and put it in your pocket. Easy!', scene: '💵', art: 'w_paper_money', at: 4, key: true },
    { say: 'European countries did not use paper money widely until around 1600 CE.', act: '⏳ Wait… wait… wait… Shrug your shoulders.', scene: '⏳', at: 4 },
    { say: 'After that, money did not change for many centuries.', act: '😴 Sleep! Zzz… for many centuries.', scene: '😴', at: 4 },
    { say: 'Then, in 1958, there was the first credit card. People did not have to use paper money or coins.', act: '💳 Tap your card: beep!', scene: '💳', art: 'w_credit_card', at: 5, key: true },
    { say: 'Today, in the 21st century, many people use electronic money. It is very easy to move around.', act: '📱 Tap your phone to pay!', scene: '📱', art: 'w_electronic_money', at: 6, key: true },
    { say: 'People often use it to buy things on the internet.', act: '🖱️ Click, click, click! Add to the basket.', scene: '🌐', at: 6 }
  ];
  D.words3 = [
    { w: 'coin', e: '🪙', def: 'round metal money', ex: 'Coins are made of metal.', gap: '______ are made of metal.' },
    { w: 'paper money', e: '💵', def: 'money made of paper', ex: 'Paper money is easier to carry than metal coins.', gap: '______ is easier to carry than metal coins.' },
    { w: 'credit card', e: '💳', def: 'a small plastic card you use to pay', ex: 'The first credit card was in 1958.', gap: 'The first ______ was in 1958.' },
    { w: 'electronic money', e: '📲', def: 'money on a computer or a phone', ex: 'Many people use electronic money today.', gap: 'Many people use ______ today.' },
    { w: 'internet', e: '🌐', def: 'computers that are connected; we buy things there', ex: 'People buy things on the internet.', gap: 'People buy things on the ______.' },
    { w: 'century', e: '💯', def: 'one hundred years', ex: 'Money did not change for many centuries.', gap: 'One ______ is 100 years.' }
  ];
  D.carryPairs = [
    { l: '🐚 shells', r: '🐐 goats', s: 'Shells are easier to carry than goats.' },
    { l: '🪙 coins', r: '⚒️ knives and spades', s: 'Coins are easier to carry than knives and spades.' },
    { l: '💵 paper money', r: '🪙 metal coins', s: 'Paper money is easier to carry than metal coins.' },
    { l: '💳 a credit card', r: '💵 paper money', s: 'A credit card is easier to carry than paper money.' },
    { l: '📱 electronic money', r: '💳 a credit card', s: 'Electronic money is very easy to move around.' }
  ];
  D.train = [
    { q: 'People bartered. What does bartered mean?', o: ['swapped things without money', 'paid with a credit card', 'made coins'], a: 0, say: 'Bartered means they swapped things without money.' },
    { q: 'Which money was easier to carry than goats?', o: ['cowrie shells', 'big sacks of grain', 'a cow'], a: 0, say: 'Cowrie shells were easier to carry than goats.' },
    { q: 'The metal knives and spades were money in ______.', o: ['China', 'a shop', 'a school'], a: 0, say: 'The metal knives and spades were money in China.' },
    { q: 'The first true coins came from ______.', o: ['Lydia', 'London', 'Paris'], a: 0, say: 'The first true coins came from Lydia, which is part of modern-day Turkey.' },
    { q: 'The first paper money came from ______.', o: ['China', 'a farm', 'the moon'], a: 0, say: 'The first paper money came from China.' },
    { q: 'The first credit card was in ______.', o: ['1958', '1200 BCE', '600 BCE'], a: 0, say: 'The first credit card was in 1958.' },
    { q: 'Electronic money is on a ______ or a computer.', o: ['phone', 'goat', 'shell'], a: 0, say: 'Electronic money is on a phone or a computer.' }
  ];
  D.vote = [
    { e: '💳', n: 'cards' }, { e: '📱', n: 'phones' }, { e: '🪙', n: 'coins' }, { e: '⌚', n: 'watches' }, { e: '👆', n: 'fingerprints' }, { e: '❓', n: 'something new' }
  ];

  /* ---------------- LESSON 4: Design the Next Money (book pp. 46-47) ---------------- */
  D.missions4 = [
    { e: '❓', t: 'Is it or was it money?' }, { e: '📊', t: 'Fill the money chart' }, { e: '🐦', t: 'Find a problem and a solution' },
    { e: '🃏', t: 'Play Problem and Solution Pairs' }, { e: '🎰', t: 'Design the next money' }
  ];
  D.zones4 = [{ k: 'M', t: '💰 IS or WAS money', c: '#15803d' }, { k: 'N', t: '❌ NOT money', c: '#b91c1c' }];
  D.walk4 = [
    { e: '🐚', t: 'cowrie shells', a: 'M', s: 'Cowrie shells were money.' }, { e: '🍴', t: 'a fork and a knife', a: 'N', s: 'A fork and a knife are not money.' },
    { e: '⚒️', t: 'an ancient Chinese knife', a: 'M', s: 'An ancient Chinese knife was money.' }, { e: '👛', t: 'a wallet', a: 'N', s: 'A wallet is not money. We keep money in it.' },
    { e: '💵', t: 'paper money', a: 'M', s: 'Paper money is money.' }, { e: '💳', t: 'a credit card', a: 'M', s: 'A credit card is a way to pay. It is money today.' }
  ];
  D.chart = [
    { type: 'cowrie shells', e: '🐚', when: '1200 BCE', made: 'shells' }, { type: 'knives and spades', e: '⚒️', when: '1000 BCE', made: 'metal' },
    { type: 'paper money', e: '💵', when: '800-900 CE', made: 'paper' }, { type: 'credit card', e: '💳', when: '1958', made: 'plastic' }
  ];
  D.friend = [
    { say: 'One day, Go Ne and his father helped a baby bird.', act: '🐦 Flap your wings: the baby bird!', scene: '🐦' },
    { say: 'To say thank you, the mother bird gave them a special seed.', act: '🌰 Hold out your hand: a special seed!', scene: '🌰' },
    { say: 'Wen Shu wanted a seed too.', act: '🙋 Say: me too! I want one!', scene: '🙋' },
    { predict: 'Wen Shu used his slingshot. What is the problem?', say: 'The baby bird was hurt! That is the PROBLEM.', act: '😟 Make a sad face. Oh no!', scene: '🤕', key: true, tag: 'PROBLEM' },
    { say: 'Go Ne and Wen Shu took the bird to the vet. They asked for help.', act: '🏃 Run to the vet!', scene: '🩺' },
    { say: 'After a long time, the vet came out. The baby bird was OK! That is the SOLUTION.', act: '🎉 Cheer: the bird is OK!', scene: '🕊️', key: true, tag: 'SOLUTION' }
  ];
  D.pairs = [
    { id: 'p1', a: { e: '⏳', t: 'It takes a long time to agree how much things are worth.' }, b: { e: '🪙', t: 'Coins show how much they are worth.' } },
    { id: 'p2', a: { e: '🐐', t: 'Goats and grain are heavy to carry.' }, b: { e: '🐚', t: 'Shells are easier to carry.' } },
    { id: 'p3', a: { e: '⚒️', t: 'Knives and spades are difficult to carry.' }, b: { e: '⭕', t: 'People make round money with holes.' } },
    { id: 'p4', a: { e: '🏋️', t: 'Metal coins are heavy.' }, b: { e: '💵', t: 'Paper money is easier to carry.' } },
    { id: 'p5', a: { e: '👛', t: 'You need paper money or coins to pay.' }, b: { e: '💳', t: 'A small plastic card can pay for you.' } },
    { id: 'p6', a: { e: '🛒', t: 'You cannot go to a shop on the internet.' }, b: { e: '📲', t: 'Electronic money is easy to move around.' } }
  ];
  D.mm = {
    mat: ['glass', 'wooden', 'gold', 'plastic', 'paper', 'magic', 'silver', 'rainbow'],
    shape: ['ring', 'star', 'heart', 'square', 'ball', 'button', 'bracelet', 'circle'],
    use: ['wear it', 'tap it', 'scan it', 'click it', 'plant it', 'spin it', 'hold it', 'sing to it']
  };

  root.U3G3Data = D;
})(window);
