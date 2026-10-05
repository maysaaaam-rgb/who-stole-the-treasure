/* Unit 2 (Grade 4) "What Lives Here?" - two teacher-led smartboard lessons where the CHILDREN do the work
   (move, act, talk, draw, solve) and the board is the stage, the timer and the scoreboard.
   Lesson 1: Forest Rangers (Reading 1: so they can, instead of, forests, headings)
   Lesson 2: The Swallow's Gift (Reading 2: irregular past verbs, ai sound, kindness, retell)
   All sentences are written for these lessons in simple A1+ English. No book text is copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  /* ---------------- LESSON 1 ---------------- */
  D.letter = ['Dear Rangers,', 'Winter is coming to the forest.', 'Two forests need your help: a leaf forest and a needle forest.', 'Can the animals survive? You must find out!', '— Ranger Rosa'];
  D.missions1 = [
    { e: '🎭', t: 'Act out a year in the forest' }, { e: '🚶', t: 'Walk to the right forest' },
    { e: '🎤', t: 'Interview a winter animal' }, { e: '🎨', t: 'Invent a survivor' }
  ];

  D.year = [
    { season: 'spring', say: 'Spring! The trees grow new green leaves.', act: '🙌 Reach up slowly and grow!' },
    { season: 'summer', say: 'Summer! The bear eats lots of berries.', act: '🍓 Pretend to eat. Munch, munch!', focus: 'bear' },
    { season: 'autumn', say: 'Autumn! The leaves turn red and fall down.', act: '🍂 Wiggle your fingers and float down.', focus: 'tree' },
    { season: 'autumn', say: 'The trees drop their leaves so they can save water.', act: '👉 Point forward: SO THEY CAN!', key: true, focus: 'tree' },
    { season: 'winter', say: 'Winter! Snow! Minus 50 degrees!', act: '🥶 Shiver and rub your arms.' },
    { season: 'winter', predict: 'The bear is hungry in autumn. It eats and eats. Why? What does the bear do in winter?', say: 'The bear eats a lot so it can sleep all winter.', act: '😴 Curl up small. Zzz…', key: true, focus: 'bear' },
    { season: 'winter', predict: 'A wolf looks for the hare in the snow. What can the hare do?', say: 'The hare turns white so it can hide in the snow.', act: '🧊 Freeze! Be a white hare.', key: true, focus: 'hare' },
    { season: 'winter', say: 'Pine trees have needles instead of leaves. They stay green!', act: '🌲 Stand tall. Arms like a pine tree.', focus: 'pine' },
    { season: 'spring', say: 'Spring comes. The animals wake up!', act: '🌞 Stretch and yawn. Good morning!' }
  ];

  D.walk = [
    { e: '🍂', t: 'The leaves turn red and fall in autumn.', a: 'D' },
    { e: '🌲', t: 'The trees have needles and cones.', a: 'C' },
    { e: '🥶', t: 'Winter is minus 50 degrees.', a: 'C' },
    { e: '🐻', t: 'Bears hibernate in dens.', a: 'D' },
    { e: '📅', t: 'There are four seasons.', a: 'D' },
    { e: '🐇', t: 'Hares turn white in winter.', a: 'C' },
    { e: '🐺', t: 'Wolves and owls live here.', a: 'C' },
    { e: '🌳', t: 'Trees grow here.', a: 'B' }
  ];

  D.interview = [
    { e: '🐇', n: 'hare', a: 'I turn white so I can hide in the snow.' },
    { e: '🐻', n: 'bear', a: 'I eat a lot so I can sleep all winter.' },
    { e: '🐺', n: 'wolf', a: 'I have thick fur so I can stay warm.' },
    { e: '🦉', n: 'owl', a: 'I have big eyes so I can see at night.' },
    { e: '🐿️', n: 'squirrel', a: 'I hide nuts so I can eat in winter.' },
    { e: '🦌', n: 'deer', a: 'I eat bark and buds so I can find food in winter.' }
  ];
  D.reporterQs = ['Hello! What are you?', 'Where do you live?', 'How do you survive winter?'];

  D.challenges = [
    'It lives in the coniferous forest. It is minus 50 degrees!', 'It lives in the deciduous forest. Winter is coming.',
    'It is a bird.', 'It is very, very small.', 'It must hide from a wolf.', 'It must find food under the snow.', 'It sleeps for months.'
  ];
  D.bank = ['thick fur', 'white fur', 'thick feathers', 'a warm den', 'a long sleep', 'big ears', 'nuts', 'needles'];

  D.race = [
    { type: 'scramble', words: ['hide', 'the', 'turns', 'so', 'white', 'it', 'The', 'hare', 'can', 'in', 'snow.'], answer: 'The hare turns white so it can hide in the snow.' },
    { type: 'scramble', words: ['needles', 'instead', 'Coniferous', 'have', 'trees', 'leaves.', 'of'], answer: 'Coniferous trees have needles instead of leaves.' },
    { type: 'heading', text: 'Bears sleep in dens all winter. Some animals hibernate so they can survive the cold.', options: ['Gold Coins', 'Winter Sleepers', 'Autumn Colours'], answer: 'Winter Sleepers' },
    { type: 'scramble', words: ['save', 'drop', 'Trees', 'they', 'water.', 'leaves', 'so', 'can', 'their'], answer: 'Trees drop their leaves so they can save water.' },
    { type: 'heading', text: 'Coniferous trees have thin needles and hard cones. The needles stay green all year.', options: ['A Baby Bird', 'Four Seasons', 'Needles and Cones'], answer: 'Needles and Cones' },
    { type: 'purpose', text: 'Please plant a tree! Trees give animals a home.', options: ['inform', 'entertain', 'persuade'], answer: 'persuade' }
  ];

  /* ---------------- LESSON 2 ---------------- */
  D.seedPrompts = ['What is it?', 'Who gave it?', 'Why did they give it?'];
  D.missions2 = [
    { e: '👂', t: 'Hear the story and do the verbs' }, { e: '🎭', t: 'Freeze-frame a scene' },
    { e: '🔍', t: 'Solve the roof mystery' }, { e: '🚂', t: 'Ride the Rain Train' }, { e: '⚖️', t: 'Hot seat and kindness vote' }
  ];

  D.beats = [
    { pre: 'Every spring, a swallow', gap: 'built', post: "a nest under Go Ne's roof.", wrong: ['builded', 'build'], gesture: '🔨 Hammer, hammer! (hands)', actors: [{ e: '🏠', x: 8, y: 12, s: 18 }, { e: '🪺', x: 46, y: 36, s: 10, fx: 'grow' }, { e: '🐦', x: 62, y: 8, s: 9 }] },
    { pre: 'One day, a baby bird', gap: 'fell', post: 'out of the nest.', wrong: ['falled', 'fall'], gesture: '⬇️ Drop your hand down!', actors: [{ e: '🪺', x: 30, y: 2, s: 9 }, { e: '🐤', x: 32, y: 22, s: 9, fx: 'drop' }, { e: '👦', x: 66, y: 20, s: 16 }] },
    { pre: 'The mother swallow', gap: 'gave', post: 'Go Ne a gold seed.', wrong: ['gived', 'give'], gesture: '🤲 Hold out your hands.', actors: [{ e: '🐦', x: 14, y: 10, s: 12 }, { e: '✨', x: 38, y: 26, s: 8, fx: 'slide' }, { e: '👦', x: 66, y: 20, s: 16 }] },
    { pre: 'The seed', gap: 'grew', post: 'into a big, round fruit.', wrong: ['growed', 'grow'], gesture: '🌱 Crouch low, then grow up tall!', actors: [{ e: '🌱', x: 24, y: 38, s: 9, fx: 'grow' }, { e: '🍊', x: 58, y: 26, s: 14, fx: 'pop' }, { e: '✨', x: 76, y: 8, s: 8 }] },
    { pre: 'Wen Shu was jealous. He', gap: 'hit', post: 'a swallow with a stone from his slingshot.', wrong: ['hitted', 'hitten'], gesture: '✊ Tap your palm with your fist (gently!)', note: 'hit does not change!', actors: [{ e: '🧒', x: 10, y: 20, s: 16 }, { e: '🪨', x: 38, y: 36, s: 6, fx: 'slide' }, { e: '🐦', x: 70, y: 26, s: 11 }] },
    { pre: 'Go Ne', gap: 'paid', post: 'the vet with his gold coins.', wrong: ['payed', 'pay'], gesture: '💰 Hand over the coins.', actors: [{ e: '🚲', x: 8, y: 34, s: 12 }, { e: '💰', x: 42, y: 36, s: 9, fx: 'pop' }, { e: '🧑‍⚕️', x: 66, y: 20, s: 16 }] }
  ];

  D.freeze = [
    { e: '🔨🪺', t: 'A swallow built a nest.' }, { e: '🐤⬇️', t: 'A baby bird fell.' }, { e: '🤲✨', t: 'The swallow gave Go Ne a seed.' },
    { e: '🌱⬆️', t: 'The seed grew into a big fruit.' }, { e: '🚲🐦', t: 'Go Ne took the bird to the vet.' }, { e: '🏠🎁', t: 'Wen Shu left a gift for the roof.' }
  ];

  D.suspects = [
    { id: 'father', e: '👨', n: "Go Ne's father" }, { id: 'vet', e: '🧑‍⚕️', n: 'The vet' }, { id: 'wen', e: '🧒', n: 'Wen Shu' },
    { id: 'gone', e: '👦', n: 'Go Ne' }, { id: 'mother', e: '🐦', n: 'The mother swallow' }, { id: 'baby', e: '🐤', n: 'The baby bird' }
  ];
  D.clues = [
    { w: 1, t: 'It was not an animal.', out: ['mother', 'baby'] },
    { w: 2, t: 'It was not a grown-up.', out: ['father', 'vet'] },
    { w: 3, t: 'It was not the boy from that house.', out: ['gone'] },
    { w: 4, t: 'He hit a swallow with his slingshot.', out: [] },
    { w: 5, t: 'He watched Go Ne pay the vet.', out: [] },
    { w: 6, t: 'He felt sorry. He left a gift and went home.', out: [] }
  ];

  D.aiWords = ['rain', 'train', 'tail', 'mail', 'paid', 'snail'];
  D.aiPairs = [['rain', 'ran'], ['tail', 'tell'], ['paid', 'pad'], ['mail', 'mall'], ['pain', 'pan'], ['wait', 'wet']];
  D.rap = {
    src: 'audio/snail-rap.mp3',
    title: 'Snail with a Tail',
    chorus: ["I'm a snail with a tail, waiting for the mail!", 'Creeping on the sidewalk, leaving a slimy trail!', 'Snail with a tail, waiting for the mail,', "I'm slow and steady, but I never, ever fail!"],
    verse: ['Got my shell on my back, that\'s my cozy little home,', 'Cruising round the garden everywhere I roam.', 'Two little eye-stalks looking up high,', 'Waving to the ladybugs flying right by!', 'Slide to the left, slide to the right,', 'Checking by the mailbox in the morning light.', 'Did I get a postcard? Did I get a letter?', 'A package full of lettuce leaves would be even better!', "Tick-tock, tick-tock, I don't mind the wait,", 'Even if I\'m slow, I will make it to the gate!'],
    outro: ['Squish, slide, zoom! (Well, not too fast!)', 'Here comes the mail carrier at last!', 'High-five... snail-style!'],
    actions: [['snail', '🐌 Make a slow snail with your hand'], ['tail', '〰️ Wiggle your tail'], ['mail', '✉️ Mime holding a letter'], ['trail', '👣 Draw a trail on your desk'], ['fail', '🙅 Shake your head: no way!']]
  };
  D.aiChant = ['Rain, rain, rain on the train!', 'A snail with a tail waits for the mail.', 'Wait, wait, wait! I paid for the pail!'];

  D.hotseat = [
    { q: 'Why did you hit the swallow?', a: 'Because I wanted gold.' }, { q: 'How did you feel?', a: 'I felt jealous.' },
    { q: 'What did you see at the vet?', a: 'I saw Go Ne pay the vet.' }, { q: 'How do you feel now?', a: 'I feel sorry.' },
    { q: 'What did you leave on the roof?', a: 'I left a gift.' }, { q: 'Are you and Go Ne friends now?', a: 'Yes, we are friends now.' }
  ];

  D.forks = [
    { scene: '🐤🪺', q: 'A baby bird fell from the nest. What can Go Ne do?', a: { t: 'Walk away', out: 'The baby bird was cold and scared. Nobody helped it.', kind: -1 }, b: { t: 'Help the bird', out: 'Go Ne put the bird back. The mother swallow was happy and gave him a seed.', kind: 1 }, say: 'I think Go Ne should help the bird because it is hurt.' },
    { scene: '🧒🪙', q: 'Wen Shu wants gold too. What can he do?', a: { t: 'Hurt a bird', out: 'The swallow was hurt. Wen Shu felt bad inside.', kind: -1 }, b: { t: 'Ask for help', out: 'Go Ne smiled. They talked and they shared.', kind: 1 }, say: 'I think Wen Shu should ask for help because it is kind.' },
    { scene: '🧒💔', q: 'Wen Shu is sorry now. What can he do?', a: { t: 'Run away', out: 'Go Ne was still sad. They were not friends.', kind: -1 }, b: { t: 'Fix the roof', out: 'Go Ne was happy. They became friends.', kind: 1 }, say: 'I think Wen Shu should say sorry and fix the roof.' }
  ];

  D.retell = [
    { lead: 'First,', right: 'Go Ne helped a baby bird.', wrong: ['Wen Shu paid the vet.', 'They became friends.'] },
    { lead: 'Then,', right: 'The swallow gave Go Ne a gold seed.', wrong: ['Wen Shu left a gift.', 'A baby bird fell.'] },
    { lead: 'At the end,', right: 'Wen Shu said sorry and they became friends.', wrong: ['Go Ne walked away.', 'The seed grew big.'] }
  ];

  root.ForestLessonsData = D;
})(typeof window !== 'undefined' ? window : this);
