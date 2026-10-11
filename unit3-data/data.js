/* Unit 3 game data for Grade 3 (How Much Is It? - money) and Grade 4 (It Keeps Changing - the Arctic poem and Clean Cars).
   Built only from the checked Unit 3 notes of the readings (words, facts, grammar and sentences); nothing is copied from the books.
   One data set feeds four games: Bamboozle (BQ[grade][3]), the Arcade (ARC), Mountain Race (DATA) and Alley Fling: Cats vs Dogs (ARC + BQ).
   Load it AFTER the Unit 2 data of the page. It adds Unit 3 to BQ and, when the page is opened with ?unit=3, it switches ARC and DATA to Unit 3.
   Question fields: s = skill (Listening, Words, Sounds, Sentences, Reading), q = question, o = options, a = answer, say = spoken sentence,
   big = large picture options, pass = short passage (Reading). ARC: words {w,e,d,x}, concrete (picture words), builders {order, answer}. */
(function (root) {
  'use strict';
  function Q(s, q, o, a, extra) { var r = { s: s, q: q, o: o, a: a, say: '', pic: '', big: false, pass: '', order: null }; for (var k in (extra || {})) r[k] = extra[k]; return r; }
  function L(say, o, a) { return Q('Listening', 'Listen. Which picture?', o, a, { say: say, big: true }); }

  /* ================= GRADE 3 · Unit 3 · How Much Is It? ================= */
  var A3 = {
    words: [
      { w: 'bartered', e: '🔄', d: 'Gave things to get other things, without using money.', x: 'Long ago, people bartered.' },
      { w: 'goat', e: '🐐', d: 'A farm animal with horns.', x: 'The farmer has a goat.' },
      { w: 'grain', e: '🌾', d: 'Seeds like wheat or rice that we eat.', x: 'He paid with grain.' },
      { w: 'shell', e: '🐚', d: 'A hard cover from a sea animal. People used small shells as money.', x: 'A shell is easy to carry.' },
      { w: 'metal', e: '🔩', d: 'A hard material like gold, silver or iron.', x: 'This money is made of metal.' },
      { w: 'valuable', e: '💎', d: 'Worth a lot of money.', x: 'Gold is valuable.' },
      { w: 'coin', e: '🪙', d: 'Round metal money.', x: 'I have a coin in my hand.' },
      { w: 'bill', e: '💵', d: 'Paper money.', x: 'Paige found a hundred dollar bill.' },
      { w: 'credit card', e: '💳', d: 'A small plastic card you use to pay.', x: 'I pay with a credit card.' },
      { w: 'plastic', e: '🧴', d: 'A light material. Cards and bottles are made of it.', x: 'The card is plastic.' },
      { w: 'pocket', e: '👖', d: 'A small bag in your clothes.', x: 'She put the money in her pocket.' },
      { w: 'restaurant', e: '🍽️', d: 'A place where you pay to eat a meal.', x: 'We go to a restaurant.' },
      { w: 'expensive', e: '💸', d: 'Costs a lot of money.', x: 'The phone is expensive.' },
      { w: 'pay', e: '🤝', d: 'Give money for something.', x: 'I pay for my lunch.' },
      { w: 'buy', e: '🛒', d: 'Get something by paying money.', x: 'I want to buy a book.' },
      { w: 'save', e: '🐷', d: 'Keep money to use later.', x: 'I save my money.' },
      { w: 'carry', e: '🎒', d: 'Hold something and take it with you.', x: 'Coins are easy to carry.' },
      { w: 'worth', e: '🏷️', d: 'How much money something is.', x: 'How much is it worth?' },
      { w: 'internet', e: '🌐', d: 'The computer network we use online.', x: 'We can buy things on the internet.' },
      { w: 'cashier', e: '🧾', d: 'The person who takes your money in a shop.', x: 'The cashier says hello.' },
      { w: 'store', e: '🏬', d: 'A shop.', x: 'The phone store is open.' },
      { w: 'problem', e: '❗', d: 'Something difficult that happens.', x: 'Goats are a problem to carry.' },
      { w: 'solution', e: '✅', d: 'A way to fix a problem.', x: 'Shells are a good solution.' },
      { w: 'farmer', e: '🧑‍🌾', d: 'A person who works on a farm.', x: 'The farmer needs some grain.' }
    ],
    concrete: [
      { w: 'goat', e: '🐐', d: 'A farm animal with horns.', x: 'The farmer has a goat.' }, { w: 'grain', e: '🌾', d: 'Seeds like wheat or rice that we eat.', x: 'He paid with grain.' },
      { w: 'shell', e: '🐚', d: 'A hard cover from a sea animal.', x: 'A shell is easy to carry.' }, { w: 'metal', e: '🔩', d: 'A hard material like gold, silver or iron.', x: 'This money is made of metal.' },
      { w: 'coin', e: '🪙', d: 'Round metal money.', x: 'I have a coin in my hand.' }, { w: 'bill', e: '💵', d: 'Paper money.', x: 'Paige found a hundred dollar bill.' },
      { w: 'credit card', e: '💳', d: 'A small plastic card you use to pay.', x: 'I pay with a credit card.' }, { w: 'pocket', e: '👖', d: 'A small bag in your clothes.', x: 'She put the money in her pocket.' },
      { w: 'restaurant', e: '🍽️', d: 'A place where you pay to eat a meal.', x: 'We go to a restaurant.' }, { w: 'cashier', e: '🧾', d: 'The person who takes your money in a shop.', x: 'The cashier says hello.' },
      { w: 'store', e: '🏬', d: 'A shop.', x: 'The phone store is open.' }, { w: 'farmer', e: '🧑‍🌾', d: 'A person who works on a farm.', x: 'The farmer needs some grain.' },
      { w: 'wallet', e: '👛', d: 'A small case for money and cards.', x: 'My money is in my wallet.' }, { w: 'cell phone', e: '📱', d: 'A phone you carry with you.', x: 'Paige does not have a cell phone.' },
      { w: 'piggy bank', e: '🐷', d: 'A pot where you save money.', x: 'I save money in my piggy bank.' }
    ],
    builders: [
      { order: ['Long', 'ago,', 'people', 'bartered.'], answer: 'Long ago, people bartered.' },
      { order: ['Shells', 'were', 'easy', 'to', 'carry.'], answer: 'Shells were easy to carry.' },
      { order: ['The', 'first', 'coins', 'came', 'from', 'Lydia.'], answer: 'The first coins came from Lydia.' },
      { order: ['China', 'made', 'the', 'first', 'paper', 'money.'], answer: 'China made the first paper money.' },
      { order: ['How', 'much', 'is', 'it?'], answer: 'How much is it?' },
      { order: ['It', 'is', 'five', 'dollars.'], answer: 'It is five dollars.' },
      { order: ['That', 'is', 'expensive.'], answer: 'That is expensive.' },
      { order: ['Paige', 'found', 'a', 'hundred', 'dollars.'], answer: 'Paige found a hundred dollars.' },
      { order: ['She', 'put', 'it', 'in', 'her', 'pocket.'], answer: 'She put it in her pocket.' },
      { order: ['She', 'did', 'not', 'buy', 'the', 'phone.'], answer: 'She did not buy the phone.' },
      { order: ['Money', 'is', 'tight', 'right', 'now.'], answer: 'Money is tight right now.' },
      { order: ['I', 'should', 'save', 'the', 'money.'], answer: 'I should save the money.' },
      { order: ['I', 'should', 'give', 'it', 'back.'], answer: 'I should give it back.' },
      { order: ['Let', 'us', 'go', 'to', 'a', 'restaurant.'], answer: 'Let us go to a restaurant.' },
      { order: ['Paige', 'walked', 'through', 'the', 'park.'], answer: 'Paige walked through the park.' },
      { order: ['She', 'saw', 'something', 'in', 'the', 'leaves.'], answer: 'She saw something in the leaves.' },
      { order: ['Paige', 'did', 'not', 'have', 'a', 'cell', 'phone.'], answer: 'Paige did not have a cell phone.' },
      { order: ['People', 'paid', 'for', 'a', 'goat', 'with', 'grain.'], answer: 'People paid for a goat with grain.' },
      { order: ['Coins', 'are', 'easier', 'to', 'carry', 'than', 'goats.'], answer: 'Coins are easier to carry than goats.' },
      { order: ['Paper', 'money', 'is', 'easier', 'to', 'carry', 'than', 'coins.'], answer: 'Paper money is easier to carry than coins.' },
      { order: ['The', 'cashier', 'asked,', 'Can', 'I', 'help', 'you?'], answer: 'The cashier asked, Can I help you?' },
      { order: ['I', 'can', 'buy', 'things', 'on', 'the', 'internet.'], answer: 'I can buy things on the internet.' },
      { order: ['A', 'credit', 'card', 'is', 'made', 'of', 'plastic.'], answer: 'A credit card is made of plastic.' },
      { order: ['Gold', 'and', 'silver', 'are', 'valuable', 'metals.'], answer: 'Gold and silver are valuable metals.' },
      { order: ['I', 'would', 'save', 'the', 'money.'], answer: 'I would save the money.' },
      { order: ['The', 'bill', 'was', 'wet', 'and', 'dirty.'], answer: 'The bill was wet and dirty.' },
      { order: ['Who', 'does', 'the', 'money', 'belong', 'to?'], answer: 'Who does the money belong to?' },
      { order: ['The', 'farmer', 'needs', 'a', 'goat.'], answer: 'The farmer needs a goat.' },
      { order: ['We', 'can', 'save', 'money', 'every', 'week.'], answer: 'We can save money every week.' },
      { order: ['The', 'first', 'credit', 'card', 'came', 'in', '1958.'], answer: 'The first credit card came in 1958.' }
    ]
  };

  var B3 = [
    /* Listening (11) */
    L('I can see a goat.', ['🐐', '🐑', '🐄', '🐴'], '🐐'), L('This is a coin.', ['🪙', '💵', '💳', '🔑'], '🪙'), L('She has a credit card.', ['💳', '🪙', '👛', '📱'], '💳'),
    L('Put it in your pocket.', ['👖', '🎒', '👛', '🧦'], '👖'), L('We eat at a restaurant.', ['🍽️', '🏬', '🏫', '🏥'], '🍽️'), L('The shell is on the sand.', ['🐚', '🐟', '🦀', '⭐'], '🐚'),
    L('I save money in my piggy bank.', ['🐷', '🐶', '🐱', '🐰'], '🐷'), L('This is a bill. It is paper money.', ['💵', '🪙', '💳', '🧾'], '💵'), L('The farmer has some grain.', ['🌾', '🍎', '🥕', '🥛'], '🌾'),
    L('My cell phone is new.', ['📱', '💻', '📺', '⌚'], '📱'), L('I go to the store.', ['🏬', '🏠', '🏫', '🌳'], '🏬'),
    /* Words (12) */
    Q('Words', 'Long ago, people ___ for things. They gave a goat for grain.', ['bartered', 'saved', 'painted', 'carried'], 'bartered'),
    Q('Words', 'A coin is round ___ money.', ['metal', 'paper', 'water', 'cloth'], 'metal'),
    Q('Words', 'Gold is ___. It is worth a lot of money.', ['valuable', 'dirty', 'tired', 'wet'], 'valuable'),
    Q('Words', 'A credit card is made of ___.', ['plastic', 'grain', 'shells', 'leaves'], 'plastic'),
    Q('Words', 'She put the money in her ___.', ['pocket', 'goat', 'park', 'shell'], 'pocket'),
    Q('Words', 'We pay for our meal at a ___.', ['restaurant', 'farm', 'beach', 'road'], 'restaurant'),
    Q('Words', 'What does “expensive” mean?', ['costs a lot of money', 'costs no money', 'very small', 'very old'], 'costs a lot of money'),
    Q('Words', 'What does “save” mean?', ['keep money to use later', 'give money back', 'lose money', 'find money'], 'keep money to use later'),
    Q('Words', 'What does “solution” mean?', ['a way to fix a problem', 'a big problem', 'a shop', 'a kind of money'], 'a way to fix a problem'),
    Q('Words', 'The ___ takes your money in a shop.', ['cashier', 'farmer', 'goat', 'pocket'], 'cashier'),
    Q('Words', 'What does “carry” mean?', ['hold something and take it with you', 'throw something away', 'sleep', 'pay for'], 'hold something and take it with you'),
    Q('Words', 'You use the ___ to buy things online.', ['internet', 'pocket', 'grain', 'shell'], 'internet'),
    /* Sounds (8): the ar sound as in park, card, car */
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['card', 'coin', 'cake', 'bill'], 'card'),
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['car', 'cup', 'cat', 'cow'], 'car'),
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['hard', 'hot', 'hen', 'hill'], 'hard'),
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['farm', 'fish', 'fan', 'fox'], 'farm'),
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['start', 'stop', 'stick', 'step'], 'start'),
    Q('Sounds', 'Which word has the ar sound, as in “park”?', ['jar', 'jam', 'jet', 'job'], 'jar'),
    Q('Sounds', 'Which word does NOT have the ar sound?', ['pocket', 'card', 'park', 'hard'], 'pocket'),
    Q('Sounds', 'Which word does NOT have the ar sound?', ['coin', 'farm', 'car', 'start'], 'coin'),
    /* Sentences (13): past simple, didn't, could, should, easier than, let's, there was */
    Q('Sentences', 'Paige ___ through the park.', ['walked', 'walk', 'walking'], 'walked'),
    Q('Sentences', 'She ___ something in the leaves.', ['saw', 'see', 'seen'], 'saw'),
    Q('Sentences', 'People ___ for a goat with grain.', ['paid', 'payed', 'pay'], 'paid'),
    Q('Sentences', 'Paige ___ buy the phone.', ['did not', 'do not', 'does not'], 'did not'),
    Q('Sentences', 'She ___ the money in her pocket.', ['put', 'putted', 'puts'], 'put'),
    Q('Sentences', 'Shells are ___ to carry than goats.', ['easier', 'easy', 'more easy'], 'easier'),
    Q('Sentences', 'Paper money is easier to carry ___ metal coins.', ['than', 'then', 'that'], 'than'),
    Q('Sentences', 'You ___ save your money. It is a good idea.', ['should', 'did', 'were'], 'should'),
    Q('Sentences', 'Let’s ___ to a restaurant.', ['go', 'went', 'goes'], 'go'),
    Q('Sentences', 'There ___ a beautiful black phone in the store.', ['was', 'were', 'are'], 'was'),
    Q('Sentences', 'Long ago, people ___ use money.', ['did not', 'does not', 'is not'], 'did not'),
    Q('Sentences', 'Paige ___ buy a cell phone with the money. It was possible.', ['could', 'should not', 'did'], 'could'),
    Q('Sentences', 'Money ___ tight right now.', ['is', 'are', 'am'], 'is'),
    /* Reading (11): short passages from the checked summaries */
    Q('Reading', 'What did people do before money?', ['They bartered.', 'They used credit cards.', 'They used the internet.', 'They used paper money.'], 'They bartered.',
      { pass: 'Thousands of years ago, people did not use money. They bartered. They gave one thing for another thing.' }),
    Q('Reading', 'Why were shells good money?', ['They were easy to carry.', 'They were very big.', 'They were hot.', 'They were made of paper.'], 'They were easy to carry.',
      { pass: 'People later used small shells as money. Shells were easier to carry than goats or bags of grain.' }),
    Q('Reading', 'Where did the first true coins come from?', ['Lydia', 'Paris', 'Mars', 'a farm'], 'Lydia',
      { pass: 'In Lydia, a king made the first true coins. Lydia is part of modern-day Turkey.' }),
    Q('Reading', 'What did China make first?', ['paper money', 'credit cards', 'plastic bags', 'the internet'], 'paper money',
      { pass: 'In China, people used metal knives and spades. Later China made the first paper money. It was easier to carry than metal coins.' }),
    Q('Reading', 'When was the first credit card?', ['1958', '1200 BCE', '1600', '2020'], '1958',
      { pass: 'In 1958 there was the first credit card. People could pay with a small plastic card.' }),
    Q('Reading', 'What do many people use today to buy things on the internet?', ['electronic money', 'cowrie shells', 'goats', 'metal knives'], 'electronic money',
      { pass: 'Today many people use electronic money. They can buy things on the internet.' }),
    Q('Reading', 'Why did Jodie and Nina laugh at Paige?', ['She did not have a cell phone.', 'She was tired.', 'She had a goat.', 'She was late.'], 'She did not have a cell phone.',
      { pass: 'After school, Jodie and Nina laughed. Paige did not have a cell phone.' }),
    Q('Reading', 'What did Paige find in the park?', ['a $100 bill', 'a goat', 'a phone', 'a shell'], 'a $100 bill',
      { pass: 'Paige walked home through the park. She saw something in the leaves. It was a wet, dirty $100 bill.' }),
    Q('Reading', 'Did Paige buy the phone?', ['No, she did not.', 'Yes, she did.', 'She bought two phones.', 'She bought a goat.'], 'No, she did not.',
      { pass: 'Paige looked at a phone in the store. It was ninety-five dollars. She did not buy it. She thought she should save the money.' }),
    Q('Reading', 'Why was money tight at home?', ['Dad was tired and there was not much money.', 'Paige had a lot of money.', 'The store was closed.', 'Dad had a new phone.'], 'Dad was tired and there was not much money.',
      { pass: 'At home Dad was tired. Money was tight right now.' }),
    Q('Reading', 'Where did Paige and her dad go at the end?', ['to a restaurant', 'to a store', 'to the park', 'to school'], 'to a restaurant',
      { pass: 'Paige paid. She and Dad went out to a restaurant.' })
  ];

  /* ================= GRADE 4 · Unit 3 · It Keeps Changing ================= */
  var A4 = {
    words: [
      { w: 'gasoline', e: '⛽', d: 'The fuel that many cars use. It comes from oil.', x: 'A lot of cars use gasoline.' },
      { w: 'energy', e: '⚡', d: 'The power that makes things move or work.', x: 'Cars need energy to go.' },
      { w: 'oil', e: '🛢️', d: 'A thick black liquid from under the ground.', x: 'Gasoline comes from oil.' },
      { w: 'noisy', e: '🔊', d: 'Making a lot of sound.', x: 'Gasoline cars are noisy.' },
      { w: 'quiet', e: '🤫', d: 'Making very little sound.', x: 'Electric cars are quiet.' },
      { w: 'electricity', e: '🔌', d: 'The energy for lamps, TVs and electric cars.', x: 'An electric car uses electricity.' },
      { w: 'expensive', e: '💸', d: 'Costs a lot of money.', x: 'Some clean cars are expensive.' },
      { w: 'clean', e: '✨', d: 'Not dirty.', x: 'Clean cars are good for the world.' },
      { w: 'dirty', e: '🌫️', d: 'Not clean.', x: 'Smoke makes the air dirty.' },
      { w: 'fast', e: '🏎️', d: 'Quick; not slow.', x: 'The race car is fast.' },
      { w: 'slow', e: '🐢', d: 'Not quick.', x: 'The air car is slow.' },
      { w: 'solar', e: '☀️', d: 'Using energy from the sun.', x: 'A solar car uses the sun.' },
      { w: 'biofuel', e: '🌽', d: 'Fuel made from plants like corn.', x: 'Biofuels come from plants.' },
      { w: 'wheels', e: '🛞', d: 'The round parts a car moves on.', x: 'A car has four wheels.' },
      { w: 'climate', e: '🌍', d: 'The usual weather of a place.', x: 'Dirty air changes our climate.' },
      { w: 'ice', e: '🧊', d: 'Frozen water.', x: 'The Arctic has a lot of ice.' },
      { w: 'thin', e: '📄', d: 'Not thick. Easy to break.', x: 'The ice was thin.' },
      { w: 'melting', e: '🫠', d: 'Turning from ice into water.', x: 'The ice is melting.' },
      { w: 'trap', e: '🪤', d: 'A place you cannot get out of.', x: 'They were in a trap of ice and sea.' },
      { w: 'enemy', e: '😠', d: 'Someone who is against you. Not a friend.', x: 'The bear was the man’s enemy.' },
      { w: 'hole', e: '🕳️', d: 'An opening, like the hole in the ice for fishing.', x: 'He fishes through a hole.' },
      { w: 'danger', e: '⚠️', d: 'Something that can hurt you.', x: 'Thin ice is a danger.' },
      { w: 'hope', e: '🙏', d: 'Want something good to happen.', x: 'I hope to see the bear.' },
      { w: 'polar bear', e: '🐻‍❄️', d: 'A big white bear that lives in the Arctic.', x: 'The polar bear is very big.' }
    ],
    concrete: [
      { w: 'gasoline', e: '⛽', d: 'The fuel that many cars use.', x: 'A lot of cars use gasoline.' }, { w: 'oil', e: '🛢️', d: 'A thick black liquid from under the ground.', x: 'Gasoline comes from oil.' },
      { w: 'electricity', e: '🔌', d: 'The energy for lamps, TVs and electric cars.', x: 'An electric car uses electricity.' }, { w: 'wheels', e: '🛞', d: 'The round parts a car moves on.', x: 'A car has four wheels.' },
      { w: 'ice', e: '🧊', d: 'Frozen water.', x: 'The Arctic has a lot of ice.' }, { w: 'hole', e: '🕳️', d: 'An opening, like the hole in the ice for fishing.', x: 'He fishes through a hole.' },
      { w: 'trap', e: '🪤', d: 'A place you cannot get out of.', x: 'They were in a trap of ice and sea.' }, { w: 'polar bear', e: '🐻‍❄️', d: 'A big white bear that lives in the Arctic.', x: 'The polar bear is very big.' },
      { w: 'solar', e: '☀️', d: 'Using energy from the sun.', x: 'A solar car uses the sun.' }, { w: 'biofuel', e: '🌽', d: 'Fuel made from plants like corn.', x: 'Biofuels come from plants.' },
      { w: 'trash', e: '🗑️', d: 'Things we throw away.', x: 'I can clean up trash.' }, { w: 'bike', e: '🚲', d: 'A two-wheel vehicle you ride with your legs.', x: 'I can ride a bike to school.' },
      { w: 'race', e: '🏁', d: 'A competition to see who is fastest.', x: 'There are solar car races.' }, { w: 'fish', e: '🐟', d: 'An animal that lives in water.', x: 'The bear takes his fish.' },
      { w: 'snow', e: '❄️', d: 'Soft white frozen rain.', x: 'The Arctic has snow and ice.' }, { w: 'wind', e: '🌬️', d: 'Moving air.', x: 'The land is cold and windy.' }
    ],
    builders: [
      { order: ['The', 'bear', 'was', 'twice', 'my', 'size.'], answer: 'The bear was twice my size.' },
      { order: ['The', 'ice', 'was', 'thin.'], answer: 'The ice was thin.' },
      { order: ['The', 'ice', 'is', 'melting.'], answer: 'The ice is melting.' },
      { order: ['The', 'bear', 'was', 'his', 'enemy.'], answer: 'The bear was his enemy.' },
      { order: ['They', 'fell', 'into', 'the', 'water.'], answer: 'They fell into the water.' },
      { order: ['After', 'warm', 'winters,', 'the', 'ice', 'was', 'thin.'], answer: 'After warm winters, the ice was thin.' },
      { order: ['The', 'man', 'hopes', 'to', 'see', 'the', 'bear.'], answer: 'The man hopes to see the bear.' },
      { order: ['Gasoline', 'comes', 'from', 'oil.'], answer: 'Gasoline comes from oil.' },
      { order: ['Gasoline', 'cars', 'are', 'fast', 'but', 'noisy.'], answer: 'Gasoline cars are fast but noisy.' },
      { order: ['Electric', 'cars', 'are', 'quiet', 'and', 'clean.'], answer: 'Electric cars are quiet and clean.' },
      { order: ['Air', 'cars', 'are', 'small', 'and', 'slow.'], answer: 'Air cars are small and slow.' },
      { order: ['Solar', 'cars', 'use', 'energy', 'from', 'the', 'sun.'], answer: 'Solar cars use energy from the sun.' },
      { order: ['Biofuels', 'come', 'from', 'plants', 'like', 'corn.'], answer: 'Biofuels come from plants like corn.' },
      { order: ['An', 'electric', 'car', 'uses', 'electricity.'], answer: 'An electric car uses electricity.' },
      { order: ['Dirty', 'air', 'is', 'bad', 'for', 'animals', 'and', 'people.'], answer: 'Dirty air is bad for animals and people.' },
      { order: ['Clean', 'cars', 'are', 'good', 'for', 'the', 'world.'], answer: 'Clean cars are good for the world.' },
      { order: ['I', 'like', 'the', 'solar', 'car', 'because', 'it', 'is', 'quiet.'], answer: 'I like the solar car because it is quiet.' },
      { order: ['I', 'can', 'ride', 'a', 'bike', 'to', 'school.'], answer: 'I can ride a bike to school.' },
      { order: ['I', 'can', 'clean', 'up', 'trash.'], answer: 'I can clean up trash.' },
      { order: ['Electric', 'cars', 'are', 'clean,', 'but', 'they', 'are', 'expensive.'], answer: 'Electric cars are clean, but they are expensive.' },
      { order: ['The', 'red', 'car', 'is', 'big,', 'but', 'the', 'white', 'car', 'is', 'small.'], answer: 'The red car is big, but the white car is small.' },
      { order: ['Both', 'cars', 'have', 'four', 'wheels.'], answer: 'Both cars have four wheels.' },
      { order: ['Cars', 'are', 'everywhere!'], answer: 'Cars are everywhere!' },
      { order: ['They', 'are', 'not', 'very', 'expensive.'], answer: 'They are not very expensive.' },
      { order: ['Solar', 'cars', 'are', 'not', 'noisy', 'or', 'dirty.'], answer: 'Solar cars are not noisy or dirty.' },
      { order: ['Not', 'many', 'people', 'have', 'a', 'solar', 'car.'], answer: 'Not many people have a solar car.' },
      { order: ['Clean', 'cars', 'are', 'one', 'way', 'to', 'have', 'a', 'clean', 'world.'], answer: 'Clean cars are one way to have a clean world.' },
      { order: ['I', 'think', 'they', 'are', 'not', 'friends', 'because', 'the', 'bear', 'takes', 'his', 'fish.'], answer: 'I think they are not friends because the bear takes his fish.' },
      { order: ['Today', 'the', 'ice', 'is', 'melting', 'in', 'the', 'Arctic.'], answer: 'Today the ice is melting in the Arctic.' },
      { order: ['An', 'electric', 'car', 'was', 'the', 'first', 'car', 'to', 'go', '100', 'km', 'per', 'hour.'], answer: 'An electric car was the first car to go 100 km per hour.' }
    ]
  };

  var B4 = [
    /* Listening (11) */
    L('Gasoline comes from oil.', ['⛽', '🔌', '☀️', '🌽'], '⛽'), L('This car uses electricity.', ['🔌', '⛽', '🌽', '🛢️'], '🔌'), L('A solar car uses the sun.', ['☀️', '🌧️', '❄️', '🌙'], '☀️'),
    L('Look at the polar bear.', ['🐻‍❄️', '🐻', '🐼', '🦊'], '🐻‍❄️'), L('The ice is melting.', ['🫠', '🧊', '🔥', '❄️'], '🫠'), L('A car has four wheels.', ['🛞', '🚲', '✈️', '🚀'], '🛞'),
    L('Biofuels come from corn.', ['🌽', '🥕', '🍎', '🥔'], '🌽'), L('I can ride a bike to school.', ['🚲', '🚗', '🚌', '🚂'], '🚲'), L('I can clean up trash.', ['🗑️', '📚', '🎒', '🍎'], '🗑️'),
    L('They are in a trap of ice.', ['🪤', '🎣', '🐟', '🏠'], '🪤'), L('The man fishes through a hole.', ['🕳️', '🏠', '🌊', '🏔️'], '🕳️'),
    /* Words (12) */
    Q('Words', 'Gasoline cars are ___. They make a lot of sound.', ['noisy', 'quiet', 'slow', 'clean'], 'noisy'),
    Q('Words', 'Electric cars are ___. They make very little sound.', ['quiet', 'noisy', 'dirty', 'thin'], 'quiet'),
    Q('Words', 'Dirty air is ___ for animals, plants and people.', ['bad', 'good', 'happy', 'warm'], 'bad'),
    Q('Words', 'A car uses ___ to move. Gasoline, electricity or the sun.', ['energy', 'wheels', 'trash', 'fur'], 'energy'),
    Q('Words', 'What does “expensive” mean?', ['costs a lot of money', 'very fast', 'very quiet', 'very small'], 'costs a lot of money'),
    Q('Words', 'What does “melting” mean?', ['turning from ice into water', 'turning water into ice', 'getting very big', 'swimming'], 'turning from ice into water'),
    Q('Words', 'What does “thin” mean?', ['not thick; easy to break', 'very big', 'very hot', 'very old'], 'not thick; easy to break'),
    Q('Words', 'What does “enemy” mean?', ['someone who is against you', 'a good friend', 'a kind of fish', 'a place'], 'someone who is against you'),
    Q('Words', 'What does “solar” mean?', ['using energy from the sun', 'using gasoline', 'using wind from a fan', 'using water'], 'using energy from the sun'),
    Q('Words', 'What does “trap” mean?', ['a place you cannot get out of', 'a kind of car', 'a warm coat', 'a fish'], 'a place you cannot get out of'),
    Q('Words', 'Gasoline comes from ___ in the ground.', ['oil', 'ice', 'corn', 'snow'], 'oil'),
    Q('Words', 'Things ___ as years go by. They become different.', ['change', 'sleep', 'cook', 'paint'], 'change'),
    /* Sounds (8): final -ng */
    Q('Sounds', 'Which word ends with the -ng sound?', ['sing', 'sit', 'sun', 'sip'], 'sing'),
    Q('Sounds', 'Which word ends with the -ng sound?', ['long', 'lot', 'log', 'lock'], 'long'),
    Q('Sounds', 'Which word ends with the -ng sound?', ['spring', 'spin', 'spot', 'spill'], 'spring'),
    Q('Sounds', 'Which word ends with the -ng sound?', ['young', 'yes', 'yellow', 'yard'], 'young'),
    Q('Sounds', 'Which word ends with the -ng sound?', ['fishing', 'fish', 'fist', 'fit'], 'fishing'),
    Q('Sounds', 'Which word ends with the -ng sound?', ['morning', 'more', 'moon', 'mouse'], 'morning'),
    Q('Sounds', 'Which word does NOT end with -ng?', ['ice', 'ring', 'king', 'song'], 'ice'),
    Q('Sounds', 'Which word does NOT end with -ng?', ['bear', 'bang', 'hang', 'sing'], 'bear'),
    /* Sentences (13) */
    Q('Sentences', 'After many warm winters, the ice ___ thin.', ['was', 'were', 'is being'], 'was'),
    Q('Sentences', 'Today the ice ___ melting.', ['is', 'was', 'were'], 'is'),
    Q('Sentences', 'The polar bear ___ twice my size.', ['was', 'were', 'are'], 'was'),
    Q('Sentences', 'Gasoline cars ___ fast but noisy.', ['are', 'is', 'am'], 'are'),
    Q('Sentences', 'A solar car ___ energy from the sun.', ['uses', 'use', 'using'], 'uses'),
    Q('Sentences', 'Solar cars ___ energy from the sun.', ['use', 'uses', 'used to'], 'use'),
    Q('Sentences', 'They are clean, ___ they are expensive.', ['but', 'because', 'so'], 'but'),
    Q('Sentences', 'The red car is big, ___ the white car is small.', ['but', 'because', 'and'], 'but'),
    Q('Sentences', 'I like the solar car ___ it is quiet.', ['because', 'but', 'or'], 'because'),
    Q('Sentences', 'I can ride a bike to school ___ bikes do not make the air dirty.', ['because', 'but', 'then'], 'because'),
    Q('Sentences', 'Air cars are ___ expensive.', ['not very', 'not much', 'no'], 'not very'),
    Q('Sentences', 'Both cars ___ four wheels.', ['have', 'has', 'having'], 'have'),
    Q('Sentences', 'There ___ so many rocks!', ['are', 'is', 'am'], 'are'),
    /* Reading (11) */
    Q('Reading', 'Where does gasoline come from?', ['oil in the ground', 'corn', 'the sun', 'the wind'], 'oil in the ground',
      { pass: 'A lot of cars use gasoline for energy. Gasoline comes from oil in the ground. Gasoline cars are fast, but they are noisy and they make the air dirty.' }),
    Q('Reading', 'What is bad about gasoline cars?', ['They make the air dirty.', 'They are very slow.', 'They are very small.', 'They have no wheels.'], 'They make the air dirty.',
      { pass: 'Gasoline cars are fast, but they are noisy. They make the air dirty. Dirty air is bad for animals, plants and people.' }),
    Q('Reading', 'What do biofuels come from?', ['plants like corn', 'oil', 'the sun', 'ice'], 'plants like corn',
      { pass: 'Biofuels come from plants like corn. The plants need big fields and a lot of water. The air is only a little dirty.' }),
    Q('Reading', 'What is good about electric cars?', ['They are fast, quiet and clean.', 'They are cheap.', 'They are slow.', 'They are noisy.'], 'They are fast, quiet and clean.',
      { pass: 'Electric cars use electricity, just like a TV or a lamp. They are fast and quiet. They are clean, but they are expensive.' }),
    Q('Reading', 'Which car is small and slow?', ['the air car', 'the solar car', 'the electric car', 'the gasoline car'], 'the air car',
      { pass: 'Air cars use air for energy. They are not very expensive. They are quiet and clean, but they are small and slow.' }),
    Q('Reading', 'Where does a solar car get its energy?', ['from the sun', 'from oil', 'from corn', 'from the ground'], 'from the sun',
      { pass: 'Solar cars use energy from the sun. Some are fast, and there are even races. They are not noisy or dirty, but they can be expensive.' }),
    Q('Reading', 'What is the main idea of Clean Cars?', ['Clean cars are good for the world.', 'All cars are noisy.', 'Cars are cheap.', 'Bikes are slow.'], 'Clean cars are good for the world.',
      { pass: 'Cars are everywhere. Some cars make the air dirty. Clean cars are one way to have a clean world.' }),
    Q('Reading', 'Why was the ice thin?', ['after many warm winters', 'because it was very cold', 'because of the bear', 'because of the fish'], 'after many warm winters',
      { pass: 'After many warm winters, the ice on the sea was thin. It cracked, and the man and the bear fell in the water.' }),
    Q('Reading', 'Were the man and the bear enemies for many years?', ['Yes, they were.', 'No, they were best friends.', 'They never met.', 'The bear was a toy.'], 'Yes, they were.',
      { pass: 'For many years the bear was the man’s enemy. It was hungry, just like him. Then they were in a trap of ice and sea together.' }),
    Q('Reading', 'What does the man hope at the end?', ['to see the bear once more', 'to catch many fish', 'to buy a car', 'to go to sleep'], 'to see the bear once more',
      { pass: 'Today the ice is melting and the man is old. There is danger in this changing world. He hopes to see the bear once more.' }),
    Q('Reading', 'How many stanzas does the poem The Bear and I have?', ['8', '2', '4', '16'], '8',
      { pass: 'The Bear and I is a poem. It has eight stanzas. A stanza is a group of lines in a poem.' })
  ];

  /* ---------------- hand it to the pages ---------------- */
  var U3 = { ARC: { '3': A3, '4': A4 }, BQ: { '3': B3, '4': B4 }, META: { '3': 'Unit 3: How Much Is It?', '4': 'Unit 3: It Keeps Changing' } };
  root.U3DATA = U3;
  if (typeof root.BQ === 'object' && root.BQ) {
    ['3', '4'].forEach(function (g) { if (root.BQ[g]) root.BQ[g]['3'] = U3.BQ[g]; });
  }
  if (typeof root.BQ_META === 'object' && root.BQ_META) {
    ['3', '4'].forEach(function (g) { if (root.BQ_META[g]) root.BQ_META[g]['3'] = U3.META[g]; });
  }
  var unit = ((root.location && root.location.search) || '').match(/unit=(\d)/);
  root.EAA_UNIT = unit ? unit[1] : '2';
  if (root.EAA_UNIT === '3') {
    root.ARC = U3.ARC;                                    /* Arcade and Alley Fling use the Unit 3 words and sentences */
    if (typeof root.DATA === 'object') root.DATA = U3.BQ; /* Mountain Race */
  }
})(typeof window !== 'undefined' ? window : this);
