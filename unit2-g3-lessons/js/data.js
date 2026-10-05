/* Unit 2 (Grade 3) "Thank You" - two teacher-led smartboard lessons where the CHILDREN do the work.
   Lesson 1: Chuseok Moon Feast (Reading 1: Chuseok; thankful for; There is / There are; harvest words)
   Lesson 2: First Harvest: Where Are They? (Reading 2: First Harvest; setting; -st sound; Can we...?)
   All sentences are written for these lessons in very simple A1 English. No book text is copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];
  D.numw = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];

  /* ---------------- LESSON 1 ---------------- */
  D.letter = ['Dear friends,', 'The moon is big and round tonight.', 'Come to our Chuseok festival!', 'Please bring a thankful heart.', '— Min-ji'];
  D.missions1 = [
    { e: '🌙', t: 'Hear the moon legend' }, { e: '🚶', t: 'Visit the festival corners' },
    { e: '🗣️', t: 'Ask: what are you thankful for?' }, { e: '🏮', t: 'Make a thank-you lantern' }
  ];

  D.legend = [
    { phase: 0.05, scene: '👑', say: 'Long ago, in Korea, a king had a big idea.', act: '👑 Put a crown on your head.' },
    { phase: 0.12, scene: '🧵 🧵', say: 'Two teams make cloth. They weave and weave.', act: '🧶 Weave! Hands go over, under, over, under.', key: true },
    { phase: 0.3, scene: '🏁', say: 'It is a contest! Who can weave the most cloth?', act: '💪 Ready, steady… show your muscles!' },
    { phase: 0.6, scene: '🌙', say: 'They weave for a whole month. The moon grows big.', act: '🌙 Make a round moon with your arms.' },
    { phase: 1, scene: '👑 👀', predict: 'The moon is full. The king looks at the cloth. Which team wins?', say: 'The king chooses the winner. Then he gives a big feast to both teams!', act: '🍽️ Eat, eat! Yum, yum!', key: true },
    { phase: 1, scene: '🍡 🍽️', say: 'Today we celebrate Chuseok. People say thank you for the harvest.', act: '🙏 Put your hands together: thank you!', key: true },
    { phase: 1, scene: '👨‍👩‍👧‍👦', say: 'Families travel home. They eat songpyeon and dance in a circle.', act: '💃 Hold hands and walk in a circle.' },
    { phase: 1, scene: '🙇', say: 'They bow to their ancestors. They say: thank you!', act: '🙇 Bow slowly.' }
  ];

  D.zones1 = [{ k: 'F', t: '🍡 FOOD', c: '#b45309' }, { k: 'D', t: '💃 DANCE', c: '#7c3aed' }, { k: 'H', t: '🏠 FAMILY', c: '#0e7490' }];
  D.walk1 = [
    { e: '🍡', t: 'People eat songpyeon.', a: 'F' }, { e: '🍽️', t: 'There is a big feast.', a: 'F' },
    { e: '💃', t: 'People dance in a circle.', a: 'D' }, { e: '🌕', t: 'They sing under the full moon.', a: 'D' },
    { e: '🚗', t: 'Families travel home.', a: 'H' }, { e: '👘', t: 'People wear new clothes.', a: 'H' }, { e: '🙇', t: 'They bow to their ancestors.', a: 'H' }
  ];

  D.thanks = [
    { e: '👨‍👩‍👧', n: 'family' }, { e: '🧑‍🤝‍🧑', n: 'friends' }, { e: '🍎', n: 'food' }, { e: '🏠', n: 'home' },
    { e: '🏫', n: 'school' }, { e: '🐶', n: 'pets' }, { e: '🧸', n: 'toys' }, { e: '📚', n: 'books' },
    { e: '🎵', n: 'music' }, { e: '☀️', n: 'sun' }, { e: '⚽', n: 'sports' }, { e: '👩‍🏫', n: 'teacher' }
  ];
  D.becauseBank = ['I love them.', 'They help me.', 'It is fun.', 'It makes me happy.', 'I need it.'];

  D.race1 = [
    { type: 'scramble', words: ['travel', 'home', 'Families', 'to', 'celebrate.'], answer: 'Families travel home to celebrate.' },
    { type: 'count', emoji: '🌕', n: 1, answer: 'There is one moon.' },
    { type: 'scramble', words: ['weave', 'a', 'They', 'month.', 'for', 'cloth'], answer: 'They weave cloth for a month.' },
    { type: 'count', emoji: '🍡', n: 5, answer: 'There are five songpyeon.' },
    { type: 'scramble', words: ['thankful', 'I', 'my', 'for', 'am', 'family.'], answer: 'I am thankful for my family.' },
    { type: 'count', emoji: '🏮', n: 3, answer: 'There are three lanterns.' }
  ];

  /* ---------------- LESSON 2 ---------------- */
  D.crops = [
    { e: '🥔', c: 'pink', n: 'potatoes', f: 'hue-rotate(300deg) saturate(3.2) brightness(1.5)' },
    { e: '🌽', c: 'purple', n: 'corn', f: 'hue-rotate(215deg) saturate(1.8)' },
    { e: '🥕', c: 'purple', n: 'carrots', f: 'hue-rotate(270deg) saturate(2)' },
    { e: '🫛', c: 'orange', n: 'peas', f: 'hue-rotate(-85deg) saturate(2.6) brightness(1.1)' },
    { e: '🍅', c: 'striped', n: 'tomatoes', f: 'none' }
  ];
  D.seedPrompts = ['What is strange about this farm?', 'What colours can you see?', 'Where is this farm?'];
  D.missions2 = [
    { e: '👂', t: 'Hear the story and act it' }, { e: '🔍', t: 'Find the setting: Earth or Mars?' },
    { e: '🛑', t: 'Stop at the -st sound' }, { e: '🖍️', t: 'Describe a farm and draw it' }, { e: '🚀', t: 'Win the mission race' }
  ];

  D.farm = [
    { say: 'A family lives on a farm. It is big and bright.', act: '🏠 Draw a big house in the air.', show: 0 },
    { say: 'They dig up vegetables. They pick fruit.', act: '⛏️ Dig, dig! Then pick, pick!', show: 0 },
    { say: 'Dad is worried. There is not much water.', act: '😟 Make a worried face. Say: oh no!', show: 0, key: true },
    { say: 'But look! There are pink potatoes and purple corn!', act: '😮 Make a big surprised face.', show: 2 },
    { say: 'There are orange peas and striped tomatoes. "I do not believe it!"', act: '🙅 Shake your head: I do not believe it!', show: 5, key: true },
    { say: 'Mom says: "Let us have a feast. I can make an apple pie!"', act: '🥧 Pretend to eat pie. Yum!', show: 5 },
    { predict: 'The children ask: "Can we go outside to play?" What does Mom say?', say: 'Mom says: "Yes, but check your space suits. Make sure you have plenty of air!"', act: '🧑‍🚀 Put on your space suit! Zip, zip, helmet on!', show: 5, suits: true, key: true },
    { say: 'The farm is on MARS!', act: '🚀 Everybody shout: MARS!', show: 5, suits: true, mars: true }
  ];

  D.zones2 = [{ k: 'E', t: '🌍 EARTH', c: '#15803d' }, { k: 'B', t: '🌱 BOTH', c: '#475569' }, { k: 'M', t: '🔴 MARS', c: '#b91c1c' }];
  D.walk2 = [
    { e: '🌧️', t: 'Rain falls from the sky.', a: 'E' }, { e: '🧑‍🚀', t: 'People wear space suits outside.', a: 'M' },
    { e: '🏜️', t: 'There is a red desert.', a: 'M' }, { e: '🍎', t: 'People pick apples outside.', a: 'E' },
    { e: '🌱', t: 'Plants need light and water.', a: 'B' }, { e: '🔵', t: 'The sky is blue.', a: 'E' }, { e: '🌬️', t: 'We need air in our helmets.', a: 'M' }
  ];

  D.stWords = ['fast', 'last', 'lost', 'best', 'test', 'first', 'harvest', 'nest'];
  D.stPairs = [['fast', 'fat'], ['best', 'bet'], ['nest', 'net'], ['lost', 'lot'], ['mist', 'miss'], ['past', 'pass']];
  D.stChant = ['Fast, fast, first and last!', 'Best nest, best test!', 'We harvest the best, then rest!'];

  D.dict = [
    { id: 1, items: [['pink', 'potatoes', 3], ['purple', 'corn', 2], ['orange', 'peas', 4]] },
    { id: 2, items: [['purple', 'carrots', 5], ['striped', 'tomatoes', 2], ['pink', 'potatoes', 1]] },
    { id: 3, items: [['orange', 'peas', 3], ['purple', 'corn', 4], ['striped', 'tomatoes', 3]] },
    { id: 4, items: [['pink', 'potatoes', 2], ['purple', 'carrots', 3], ['orange', 'peas', 1]] },
    { id: 5, items: [['striped', 'tomatoes', 4], ['purple', 'corn', 1], ['pink', 'potatoes', 5]] },
    { id: 6, items: [['purple', 'carrots', 2], ['orange', 'peas', 5], ['striped', 'tomatoes', 1]] }
  ];

  D.race2 = [
    { type: 'scramble', words: ['we', 'go', 'Can', 'outside?'], answer: 'Can we go outside?' },
    { type: 'count', emoji: '🥕', n: 5, answer: 'There are five carrots.' },
    { type: 'scramble', words: ['space', 'your', 'Check', 'suits.'], answer: 'Check your space suits.' },
    { type: 'count', emoji: '🍎', n: 1, answer: 'There is one apple.' },
    { type: 'word', letters: ['t', 's', 'a', 'f'], answer: 'fast' },
    { type: 'scramble', words: ['purple', 'are', 'carrots.', 'There'], answer: 'There are purple carrots.' }
  ];

  /* ---------------- LESSON 3: Chuseok Games Arcade Day (checks the games the pupils made at home) ---------------- */
  D.missions3 = [
    { e: '🏠', t: 'Host: welcome 3 classmates' }, { e: '🎮', t: 'Visit 3 stations and play' },
    { e: '📣', t: 'Cheer in English' }, { e: '✍️', t: 'Sign the visitor logs' }
  ];
  D.arcade = {
    games: [
      { e: '🃏', n: 'Ddakji', rule: 'Flip your tile with your tile. If it flips, you win it.' },
      { e: '🪀', n: 'Paengi', rule: 'Spin the top. The last top spinning wins.' },
      { e: '🪨', n: 'Gonggi', rule: 'Throw one stone up. Pick up a stone. Catch the stone.' },
      { e: '🏸', n: 'Jegichagi', rule: 'Kick the jegi. Do not let it fall. Count your kicks.' },
      { e: '🎲', n: 'Yut Nori', rule: 'Throw the sticks. Move your piece. First home wins.' }
    ],
    cheers: ['Great job!', 'Well done!', 'Nice try!', 'Try again!', 'You can do it!', 'That is fun!', 'High five!'],
    host: ['Hello! Welcome to my game.', 'This is …', 'The rules are …', 'Let us play!', 'Good job!', 'Thank you for playing!'],
    visit: ['Can I play?', 'Thank you!', 'That was fun!', 'Can I try again?']
  };

  root.G3LessonsData = D;
})(typeof window !== 'undefined' ? window : this);
