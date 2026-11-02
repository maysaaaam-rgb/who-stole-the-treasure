/* Halloween Monster Pet Shop: lesson content for Grade 3 and Grade 4 (A1, ages 8-10).
   Built on the All About Me survey (2 Nov 2026): cats and pets, drawing, singing and teamwork were the top answers;
   speaking in front of the class and finishing in time were the hardest things. */
(function (window) {
  'use strict';

  // Every sentence matches the picture (colours, things it has got). "can" sentences are pretend Halloween magic.
  var PETS = [
    { id: 'cat', name: 'Shadow', kind: 'black cat', price: 10, colour: 'black',
      g3: ["It's a black cat.", 'It has got a purple hat.', 'It can climb.'],
      g4: ["It's a black cat with yellow eyes.", 'It has got a purple hat and a long tail.', "It can climb, but it can't swim."],
      clues3: ["It's black.", 'It has got a hat.', 'It can climb.'],
      clues4: ['It has got yellow eyes.', 'It has got a long tail and a purple hat.', "It can climb, but it can't swim."],
      act: '🧗 Climb!' },
    { id: 'bat', name: 'Flappy', kind: 'bat', price: 15, colour: 'purple',
      g3: ["It's a purple bat.", 'It has got big ears.', 'It can fly.'],
      g4: ["It's a small purple bat.", 'It has got big ears and two wings.', "It can fly, but it can't swim."],
      clues3: ["It's purple.", 'It has got wings.', 'It can fly.'],
      clues4: ["It's small and purple.", 'It has got big ears.', "It can fly, but it isn't a ghost."],
      act: '🦇 Fly!' },
    { id: 'ghost', name: 'Boo', kind: 'ghost', price: 20, colour: 'white',
      g3: ["It's a white ghost.", 'It has got a bow tie.', 'It can fly.'],
      g4: ["It's a friendly white ghost.", 'It has got a purple bow tie and pink cheeks.', "It can fly, but it can't walk."],
      clues3: ["It's white.", 'It has got a bow tie.', 'It can fly.'],
      clues4: ["It's white and friendly.", "It hasn't got legs.", "It can fly, but it can't walk."],
      act: '👻 Float!' },
    { id: 'pumpkin', name: 'Pumpy', kind: 'pumpkin', price: 5, colour: 'orange',
      g3: ["It's an orange pumpkin.", 'It has got green leaves.', 'It can roll.'],
      g4: ["It's a round orange pumpkin.", 'It has got green leaves and a big smile.', "It can roll, but it can't run."],
      clues3: ["It's orange.", 'It has got leaves.', 'It can roll.'],
      clues4: ["It's round and orange.", 'It has got green leaves.', "It can roll, but it can't run."],
      act: '🎃 Roll!' },
    { id: 'skeleton', name: 'Bones', kind: 'skeleton', price: 15, colour: 'white',
      g3: ["It's a white skeleton.", 'It has got an orange scarf.', 'It can dance.'],
      g4: ["It's a funny white skeleton.", 'It has got an orange scarf.', "It can dance, but it can't fly."],
      clues3: ["It's white.", 'It has got a scarf.', 'It can dance.'],
      clues4: ["It's white and funny.", 'It has got an orange scarf.', "It can dance, but it can't fly."],
      act: '💃 Dance!' },
    { id: 'spider', name: 'Dotty', kind: 'spider', price: 10, colour: 'black',
      g3: ["It's a black spider.", 'It has got a red bow.', 'It can climb.'],
      g4: ["It's a small black spider.", 'It has got eight legs and a red bow.', "It can climb, but it can't fly."],
      clues3: ["It's black.", 'It has got eight legs.', 'It can climb.'],
      clues4: ["It's small and black.", 'It has got eight legs and a red bow.', "It can climb, but it isn't a cat."],
      act: '🕷️ Climb!' },
    { id: 'orangecat', name: 'Ginger', kind: 'orange cat', price: 10, colour: 'orange',
      g3: ["It's an orange cat.", 'It has got a long tail.', 'It can jump.'],
      g4: ["It's a happy orange and white cat.", 'It has got a long, fluffy tail.', "It can jump, but it can't fly."],
      clues3: ["It's orange.", 'It has got a long tail.', 'It can jump.'],
      clues4: ["It's orange and white.", 'It has got a long, fluffy tail.', "It can jump, but it can't fly."],
      act: '🐈 Jump!' }
  ];

  // Sentence Builder chips (the Team Pet Lab). Pupils can also invent their own words on paper.
  var BUILDER = {
    colour: ['black', 'white', 'orange', 'purple', 'green', 'red', 'blue', 'pink'],
    animal: ['cat', 'dog', 'bat', 'spider', 'owl', 'frog', 'ghost', 'pumpkin', 'skeleton', 'monster'],
    hasGot: ['big eyes', 'a long tail', 'wings', 'eight legs', 'a hat', 'a scarf', 'sharp teeth', 'a bow tie'],
    can: ['fly', 'climb', 'jump', 'run', 'dance', 'swim', 'sing', 'roll'],
    cant: ['fly', 'swim', 'run', 'sing', 'read', 'cook'],
    adj: ['small', 'big', 'funny', 'friendly', 'fast', 'cute'],
    likes: ['pizza', 'burgers', 'pasta', 'sweets', 'fish', 'apples'],
    price: [5, 10, 15, 20],
    names: ['Shadow', 'Pumpy', 'Boo', 'Luna', 'Max', 'Mochi']
  };

  // picture help for every word (A1: many pupils follow the teacher only "sometimes")
  var ICONS = {
    black: '⚫', white: '⚪', orange: '🟠', purple: '🟣', green: '🟢', red: '🔴', blue: '🔵', pink: '🩷',
    cat: '🐈', dog: '🐕', bat: '🦇', spider: '🕷️', owl: '🦉', frog: '🐸', ghost: '👻', pumpkin: '🎃', skeleton: '💀', monster: '👾',
    'big eyes': '👀', 'a long tail': '➰', wings: '🪽', 'eight legs': '🕸️', 'a hat': '🎩', 'a scarf': '🧣', 'sharp teeth': '🦷', 'a bow tie': '🎀',
    fly: '🪽', climb: '🧗', jump: '🦘', run: '🏃', dance: '💃', swim: '🏊', sing: '🎤', roll: '🔄', read: '📖', cook: '🍳',
    small: '🤏', big: '🐘', funny: '😂', friendly: '🤗', fast: '⚡', cute: '🥰',
    pizza: '🍕', burgers: '🍔', pasta: '🍝', sweets: '🍬', fish: '🐟', apples: '🍎'
  };

  var QUESTIONS = {
    3: [
      { q: 'What colour is it?', a: "It's ___." },
      { q: 'Can it fly?', a: "Yes, it can. / No, it can't." },
      { q: 'Has it got a tail?', a: "Yes, it has. / No, it hasn't." },
      { q: 'How much is it?', a: "It's ___ coins." }
    ],
    4: [
      { q: 'What can it do?', a: 'It can ___.' },
      { q: 'Can it swim?', a: "Yes, it can. / No, it can't." },
      { q: 'Has it got wings?', a: "Yes, it has. / No, it hasn't." },
      { q: 'Is it friendly?', a: "Yes, it is. / No, it isn't." },
      { q: 'What does it like?', a: 'It likes ___.' },
      { q: 'How much is it?', a: "It's ___ coins." }
    ]
  };

  var SELLER = {
    3: ['Hello! Welcome to our pet shop!', 'This is ___.', "It's a ___ ___.", 'It has got ___.', 'It can ___.', "It's ___ coins!"],
    4: ['Hello! Welcome to our pet shop!', 'This is ___.', "It's a ___, ___ ___.", 'It has got ___ and ___.', "It can ___, but it can't ___.", 'It likes ___!', "It's ___ coins. Do you want it?"]
  };

  var JOBS = [
    { icon: '🎨', name: 'Artist', job: 'Draws and colours the pet.' },
    { icon: '✏️', name: 'Writer', job: 'Writes the sentences on the card.' },
    { icon: '🗣️', name: 'Speaker', job: 'Practises the sentences. The team helps!' },
    { icon: '⏱️', name: 'Timer Boss', job: 'Watches the clock and says "2 minutes left!"' }
  ];

  var LAB_STEPS = ['Choose your jobs', 'Draw your pet', 'Give it a name', 'Write 3 sentences', 'Say it together 2 times'];

  var DOOR = {
    3: ['My favourite pet is the ___.', 'It can ___.'],
    4: ['My favourite pet is the ___ because it can ___.', "It can't ___."]
  };

  var FALLBACK_TEAMS = [
    { name: 'Team Pumpkin', color: '#f97316' }, { name: 'Team Bat', color: '#a855f7' },
    { name: 'Team Ghost', color: '#38bdf8' }, { name: 'Team Spider', color: '#10b981' }
  ];

  var TEAM_ICONS = ['🎃', '🦇', '👻', '🕷️', '🐈‍⬛', '💀'];

  window.PetShopData = { PETS: PETS, BUILDER: BUILDER, ICONS: ICONS, QUESTIONS: QUESTIONS, SELLER: SELLER, JOBS: JOBS, LAB_STEPS: LAB_STEPS, DOOR: DOOR, FALLBACK_TEAMS: FALLBACK_TEAMS, TEAM_ICONS: TEAM_ICONS };
})(window);
