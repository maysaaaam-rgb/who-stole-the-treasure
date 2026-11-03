/* Halloween Monster Pet Vet Clinic: CLIL (Health, Symptoms, Causes & Animal Care) + PPP lesson for Grade 3 (A1) and Grade 4 (A1+).
   Built on the All About Me survey (2 Nov 2026): pets, drawing, teamwork, and clear scaffolding for speaking in front of the class. */
(function (window) {
  'use strict';

  // 7 Halloween patients visiting Dr. Luna's Monster Vet Clinic after Halloween night.
  // Colour coding: Symptom/Feeling = amber, Cause/Body part = cyan, Treatment/Advice = emerald.
  var PETS = [
    {
      id: 'cat', name: 'Shadow', kind: 'black cat', temp: '39°C', badge: '🤢 Tummy Ache',
      g3: [
        "Look at Shadow! What's the matter?",
        'It is tired and it has got a tummy ache.',
        'Give it warm water and a soft bed!',
        'Now Shadow is happy!'
      ],
      g4: [
        'Patient: Shadow the black cat.',
        'It has got a stomach ache because it ate ten Halloween sweets.',
        "It feels dizzy and it can't climb today.",
        'It should drink warm water and rest in a quiet bed.',
        "It shouldn't eat chocolate or sweets!"
      ],
      clues3: [
        'It is black and it has got a tummy ache.',
        'It is very tired after Halloween.',
        'Give it warm water and a soft bed! It says "Meow!"'
      ],
      clues4: [
        'This patient has got a stomach ache because it ate too many sweets.',
        "It has got yellow eyes and a purple hat, and it can't climb today.",
        'It should drink warm water, and it shouldn\'t eat chocolate!'
      ],
      check3: { q: "What's the matter with Shadow?", right: 'It has got a tummy ache.', wrong: ['It is very cold.', 'Its wing hurts.'] },
      check4: { q: 'Why has Shadow got a stomach ache?', right: 'Because it ate ten Halloween sweets.', wrong: ['Because it flew in the rain.', 'Because it sang all night.'] },
      act: '🤢 Hold your tummy, then drink warm water!'
    },
    {
      id: 'bat', name: 'Flappy', kind: 'purple bat', temp: '36°C', badge: '🥶 Cold & Tired Wing',
      g3: [
        "Look at Flappy! What's the matter?",
        'It is cold and its wing hurts.',
        'Give it a warm blanket and a bandage!',
        'Now Flappy is safe and warm!'
      ],
      g4: [
        'Patient: Flappy the purple bat.',
        'It has got a cold and a sore wing because it flew in the cold rain.',
        "It is shivering and it can't fly tonight.",
        'It should wear a warm blanket and rest its wing.',
        "It shouldn't fly outside in the wind!"
      ],
      clues3: [
        'It is purple and it is very cold.',
        'Its wing hurts and it cannot fly.',
        'Give it a warm blanket and a bandage!'
      ],
      clues4: [
        'This small purple patient is shivering because it flew in the cold rain.',
        "Its wing hurts, so it can't fly tonight.",
        'It should wear a warm blanket and stay inside!'
      ],
      check3: { q: 'What does Flappy need?', right: 'A warm blanket and a bandage.', wrong: ['Ice cream and cold water.', 'Loud rock music.'] },
      check4: { q: 'What shouldn\'t Flappy do tonight?', right: "It shouldn't fly outside in the wind.", wrong: ["It shouldn't rest its wing.", "It shouldn't stay warm."] },
      act: '🥶 Shiver in the cold, then wrap in a blanket!'
    },
    {
      id: 'ghost', name: 'Boo', kind: 'white ghost', temp: '37°C', badge: '😷 Sore Throat',
      g3: [
        "Look at Boo! What's the matter?",
        'It is thirsty and it has got a sore throat.',
        'Give it warm honey tea!',
        'Now Boo can smile again!'
      ],
      g4: [
        'Patient: Boo the friendly ghost.',
        'It has got a sore throat because it shouted "BOO!" all night.',
        "Its voice is quiet and it can't sing today.",
        'It should drink warm honey tea and whisper quietly.',
        "It shouldn't shout or drink cold juice!"
      ],
      clues3: [
        'It is white and it has got a bow tie.',
        'It is thirsty and it has got a sore throat.',
        'Give it warm honey tea!'
      ],
      clues4: [
        'This white patient has got a sore throat because it shouted "BOO!" all night.',
        "It has got a purple bow tie, and it can't sing today.",
        'It should drink warm honey tea and whisper quietly!'
      ],
      check3: { q: "What's the matter with Boo?", right: 'It has got a sore throat.', wrong: ['Its leg hurts.', 'It is muddy.'] },
      check4: { q: 'Why has Boo got a sore throat?', right: 'Because it shouted "BOO!" all night.', wrong: ['Because it ate cold pizza.', 'Because it jumped on a rock.'] },
      act: '😷 Point to your throat, then sip honey tea!'
    },
    {
      id: 'pumpkin', name: 'Pumpy', kind: 'orange pumpkin', temp: '38°C', badge: '💫 Dizzy & Muddy',
      g3: [
        "Look at Pumpy! What's the matter?",
        'It is dizzy and dirty.',
        'Wash it with clean water and let it rest!',
        'Now Pumpy is clean and happy!'
      ],
      g4: [
        'Patient: Pumpy the orange pumpkin.',
        'It feels dizzy because it rolled down a big hill too fast.',
        'It has got mud on its leaves and a bump on its head.',
        'It should sit on a soft pillow and wash with clean water.',
        "It shouldn't roll down hills today!"
      ],
      clues3: [
        'It is round and orange with green leaves.',
        'It is dizzy after rolling down a hill.',
        'Wash it with clean water and let it rest!'
      ],
      clues4: [
        'This round orange patient feels dizzy because it rolled down a big hill too fast.',
        'It has got green leaves and a small bump on its head.',
        "It should sit on a soft pillow, and it shouldn't roll today!"
      ],
      check3: { q: "What's the matter with Pumpy?", right: 'It is dizzy and dirty.', wrong: ['It has got eight legs.', 'Its wing hurts.'] },
      check4: { q: 'What should Pumpy do now?', right: 'It should sit on a soft pillow and wash.', wrong: ['It should roll down the hill again.', 'It should eat ten sweets.'] },
      act: '💫 Spin your finger (dizzy!), then rest on a pillow!'
    },
    {
      id: 'skeleton', name: 'Bones', kind: 'white skeleton', temp: '37°C', badge: '🦴 Tired Legs',
      g3: [
        "Look at Bones! What's the matter?",
        'It is hungry and its legs hurt.',
        'Give it healthy milk and a chair!',
        'Now Bones is strong again!'
      ],
      g4: [
        'Patient: Bones the funny skeleton.',
        'Its legs hurt because it danced for five hours at the party.',
        'It is very tired and it needs calcium for strong bones.',
        'It should drink a glass of milk and put its feet up.',
        "It shouldn't dance or jump today!"
      ],
      clues3: [
        'It is white and it wears an orange scarf.',
        'Its legs hurt after dancing.',
        'Give it healthy milk and a chair!'
      ],
      clues4: [
        'This patient wears an orange scarf, and its legs hurt because it danced for five hours.',
        'It needs calcium for strong bones.',
        "It should drink milk and rest, and it shouldn't jump today!"
      ],
      check3: { q: 'What makes Bones strong again?', right: 'Healthy milk and a chair.', wrong: ['Cold rain.', 'Loud shouting.'] },
      check4: { q: 'Why do Bones\'s legs hurt?', right: 'Because it danced for five hours.', wrong: ['Because it swam in the sea.', 'Because it read a book.'] },
      act: '🦴 Rub your knees, then drink a big glass of milk!'
    },
    {
      id: 'spider', name: 'Dotty', kind: 'black spider', temp: '37°C', badge: '😨 Scared & Hungry',
      g3: [
        "Look at Dotty! What's the matter?",
        'It is scared and hungry.',
        'Give it a quiet box and healthy fruit!',
        'Now Dotty is calm and happy!'
      ],
      g4: [
        'Patient: Dotty the small spider.',
        'It is scared and shaking because the party music was too loud.',
        'It has got eight tired legs and an empty tummy.',
        'It should eat fresh fruit and sleep in a quiet dark corner.',
        "It shouldn't listen to loud noises!"
      ],
      clues3: [
        'It is small and black with eight legs.',
        'It is scared and hungry.',
        'Give it a quiet box and healthy fruit!'
      ],
      clues4: [
        'This eight-legged patient is shaking because the party music was too loud.',
        'It wears a red bow and has got an empty tummy.',
        "It should sleep in a quiet corner, and it shouldn't hear loud noises!"
      ],
      check3: { q: "What's the matter with Dotty?", right: 'It is scared and hungry.', wrong: ['It is too hot.', 'It has got wings.'] },
      check4: { q: 'Why is Dotty scared and shaking?', right: 'Because the party music was too loud.', wrong: ['Because it ate apples.', 'Because it wore a red bow.'] },
      act: '😨 Shake like you are scared, then take a deep breath!'
    },
    {
      id: 'orangecat', name: 'Ginger', kind: 'orange cat', temp: '38.5°C', badge: '🐾 Hurt Paw',
      g3: [
        "Look at Ginger! What's the matter?",
        'Its paw hurts and it is thirsty.',
        'Put a bandage on its paw and give it water!',
        'Now Ginger can purr!'
      ],
      g4: [
        'Patient: Ginger the orange cat.',
        'Its paw hurts because it jumped off a high garden wall.',
        "It has got a sore paw, so it can't run or jump today.",
        'It should wear a clean bandage and drink fresh water.',
        "It shouldn't climb high walls this week!"
      ],
      clues3: [
        'It is orange with a long fluffy tail.',
        'Its paw hurts and it is thirsty.',
        'Put a bandage on its paw and give it water!'
      ],
      clues4: [
        'This orange cat has got a sore paw because it jumped off a high wall.',
        "It has got a fluffy tail, and it can't run today.",
        "It should wear a clean bandage, and it shouldn't climb high walls!"
      ],
      check3: { q: 'Where does Ginger need a bandage?', right: 'On its paw.', wrong: ['On its wings.', 'On its hat.'] },
      check4: { q: 'Why does Ginger\'s paw hurt?', right: 'Because it jumped off a high garden wall.', wrong: ['Because it drank fresh water.', 'Because it slept on a pillow.'] },
      act: '🐾 Hold up one paw, then wrap a bandage around it!'
    }
  ];

  // Station 3 (Practice): Medicine Cabinet Match (6 interactive CLIL rounds per grade)
  var PRACTICE = {
    3: [
      { pet: 'cat', problem: 'Shadow has got a tummy ache and is tired!', q: 'Which treatment helps Shadow?',
        right: '💧 Give it warm water and a soft bed!',
        wrong: ['🍬 Give it ten more sweets!', '🌧️ Put it outside in the rain!', '🥁 Play a loud drum!'] },
      { pet: 'bat', problem: 'Flappy is cold and its wing hurts!', q: 'Which treatment helps Flappy?',
        right: '🧣 Give it a warm blanket and a bandage!',
        wrong: ['🍦 Give it cold ice cream!', '🏊 Tell it to swim!', '💨 Put it in the cold wind!'] },
      { pet: 'ghost', problem: 'Boo is thirsty and has got a sore throat!', q: 'Which treatment helps Boo?',
        right: '🍵 Give it warm honey tea!',
        wrong: ['📣 Tell it to shout louder!', '🧊 Give it ice cubes!', '🏃 Tell it to run fast!'] },
      { pet: 'pumpkin', problem: 'Pumpy is dizzy and muddy!', q: 'Which treatment helps Pumpy?',
        right: '🧼 Wash it with water and let it rest!',
        wrong: ['⛰️ Roll it down the hill again!', '🍫 Give it sticky chocolate!', '🎵 Play loud music!'] },
      { pet: 'skeleton', problem: 'Bones is hungry and its legs hurt!', q: 'Which treatment helps Bones?',
        right: '🥛 Give it healthy milk and a chair!',
        wrong: ['💃 Tell it to dance for 5 hours!', '❄️ Put snow on its head!', '🍭 Give it only lollipops!'] },
      { pet: 'orangecat', problem: 'Ginger is thirsty and its paw hurts!', q: 'Which treatment helps Ginger?',
        right: '🩹 Put a bandage on its paw and give it water!',
        wrong: ['🧱 Tell it to jump off a high wall!', '🌶️ Give it spicy crisps!', '🎺 Blow a loud horn!'] }
    ],
    4: [
      { pet: 'cat', problem: 'Shadow has got a stomach ache because it ate ten sweets.', q: 'What is the best Vet Advice?',
        right: "💧 It should drink warm water, and it shouldn't eat sweets!",
        wrong: ['🍬 It should eat more chocolate and jump high!', "🏃 It should run outside, and it shouldn't rest!", '🧊 It should drink icy cola at midnight!'] },
      { pet: 'bat', problem: 'Flappy has got a cold and a sore wing because it flew in the rain.', q: 'What is the best Vet Advice?',
        right: "🧣 It should wear a warm blanket, and it shouldn't fly in the wind!",
        wrong: ["🌧️ It should fly in the storm, and it shouldn't sleep!", '🍦 It should eat cold ice cream for breakfast!', '🏊 It should go swimming in the river!'] },
      { pet: 'ghost', problem: 'Boo has got a sore throat because it shouted "BOO!" all night.', q: 'What is the best Vet Advice?',
        right: "🍵 It should drink warm honey tea, and it shouldn't shout!",
        wrong: ["🎤 It should sing loud rock songs, and it shouldn't drink water!", '🧊 It should eat snow and shout at the moon!', '🏃 It should race in the garden!'] },
      { pet: 'pumpkin', problem: 'Pumpy feels dizzy because it rolled down a big hill too fast.', q: 'What is the best Vet Advice?',
        right: "🛏️ It should rest on a soft pillow, and it shouldn't roll down hills!",
        wrong: ["🎢 It should spin round and round, and it shouldn't sit down!", '🍬 It should eat twenty sour sweets!', '🧗 It should climb a tall tree!'] },
      { pet: 'skeleton', problem: 'Bones\'s legs hurt because it danced for five hours at the party.', q: 'What is the best Vet Advice?',
        right: "🥛 It should drink milk for strong bones, and it shouldn't dance today!",
        wrong: ["💃 It should dance all night again, and it shouldn't sit!", '🍬 It should only eat sugar and never sleep!', '🦘 It should jump over ten fences!'] },
      { pet: 'orangecat', problem: 'Ginger\'s paw hurts because it jumped off a high garden wall.', q: 'What is the best Vet Advice?',
        right: "🩹 It should wear a clean bandage, and it shouldn't climb high walls!",
        wrong: ["🧗 It should climb the roof, and it shouldn't wear a bandage!", '🎸 It should play football with its sore paw!', '🌊 It should swim in cold water!'] }
    ]
  };

  // Station 4 (Production Prep): Interactive Vet Prescription Builder
  var BUILDER = {
    names: ['Shadow', 'Flappy', 'Boo', 'Pumpy', 'Bones', 'Dotty', 'Ginger', 'Mochi'],
    animal: ['black cat', 'purple bat', 'white ghost', 'orange pumpkin', 'skeleton', 'small spider', 'orange cat', 'baby dragon'],
    symptom: ['a tummy ache', 'a sore throat', 'a cold', 'a hurt wing', 'a sore paw', 'tired legs', 'dizzy eyes', 'a fever'],
    feeling: ['tired', 'hungry', 'thirsty', 'cold', 'scared', 'dizzy'],
    cause: ['ate too many sweets', 'flew in the cold rain', 'shouted all night', 'danced for five hours', 'rolled down a hill', 'jumped off a high wall'],
    cure3: ['warm water', 'warm honey tea', 'healthy milk', 'fresh fruit', 'a warm blanket', 'a clean bandage', 'a soft pillow', 'a quiet bed'],
    should4: ['drink warm honey tea', 'drink water and rest', 'wear a warm blanket', 'wear a clean bandage', 'eat healthy fruit', 'sleep in a quiet bed'],
    shouldnt4: ['eat sweets or chocolate', 'fly in the cold rain', 'shout or sing loudly', 'jump or run today', 'drink cold fizzy drinks', 'stay up late']
  };

  var ICONS = {
    'black cat': '🐈‍⬛', 'purple bat': '🦇', 'white ghost': '👻', 'orange pumpkin': '🎃', skeleton: '💀', 'small spider': '🕷️', 'orange cat': '🐈', 'baby dragon': '🐉',
    'a tummy ache': '🤢', 'a sore throat': '😷', 'a cold': '🥶', 'a hurt wing': '🪽', 'a sore paw': '🐾', 'tired legs': '🦴', 'dizzy eyes': '💫', 'a fever': '🌡️',
    tired: '😴', hungry: '🍽️', thirsty: '💧', cold: '🥶', scared: '😨', dizzy: '💫',
    'ate too many sweets': '🍬', 'flew in the cold rain': '🌧️', 'shouted all night': '📣', 'danced for five hours': '💃', 'rolled down a hill': '⛰️', 'jumped off a high wall': '🧱',
    'warm water': '💧', 'warm honey tea': '🍵', 'healthy milk': '🥛', 'fresh fruit': '🍎', 'a warm blanket': '🧣', 'a clean bandage': '🩹', 'a soft pillow': '🛏️', 'a quiet bed': '🛌',
    'drink warm honey tea': '🍵', 'drink water and rest': '💧', 'wear a warm blanket': '🧣', 'wear a clean bandage': '🩹', 'eat healthy fruit': '🍎', 'sleep in a quiet bed': '🛌',
    'eat sweets or chocolate': '🚫🍬', 'fly in the cold rain': '🚫🌧️', 'shout or sing loudly': '🚫📣', 'jump or run today': '🚫🏃', 'drink cold fizzy drinks': '🚫🥤', 'stay up late': '🚫🌙'
  };

  var QUESTIONS = {
    3: [
      { q: "What's the matter with it?", a: 'It is ___ / It has got ___.' },
      { q: 'Is it hungry or thirsty?', a: 'It is ___.' },
      { q: 'What does it need?', a: 'Give it ___!' },
      { q: 'Is it happy and healthy now?', a: 'Yes, it is!' }
    ],
    4: [
      { q: "What's the matter with the patient?", a: 'It has got ___.' },
      { q: 'Why is it sick or hurt?', a: 'Because it ___.' },
      { q: 'What should it do to get better?', a: 'It should ___.' },
      { q: "What shouldn't it do today?", a: "It shouldn't ___." },
      { q: 'How many days should it rest?', a: 'It should rest for ___ days.' }
    ]
  };

  var SELLER = {
    3: [
      'Hello! Welcome to our Monster Vet Clinic!',
      'This is our patient, ___. It is a ___.',
      'It is ___ and it has got ___.',
      'Treatment: Give it ___ and ___!',
      'Now our pet is happy and healthy!'
    ],
    4: [
      'Hello! Welcome to our Monster Vet Clinic!',
      'Our patient is ___, the ___.',
      'Diagnosis: It has got ___ because it ___.',
      'Prescription: It should ___ and ___.',
      "Warning: It shouldn't ___! Now it feels much better!"
    ]
  };

  var JOBS = [
    { icon: '🩺', name: 'Head Vet (Speaker)', job: 'Presents the diagnosis & leads the team.' },
    { icon: '🎨', name: 'X-Ray Artist', job: 'Draws the patient, thermometer & bandage.' },
    { icon: '✏️', name: 'Medical Writer', job: 'Writes the diagnosis & care sentences.' },
    { icon: '⏱️', name: 'Clinic Manager', job: 'Watches the clock & checks every step.' }
  ];

  var LAB_STEPS = [
    'Choose your 4 Vet Clinic jobs (30s)',
    'Draw the patient & its symptom / bandage',
    'Write the Diagnosis (What is the matter?)',
    'Write the Treatment (Give it… / It should…)',
    'Practise speaking together 2 times'
  ];

  var DOOR = {
    3: ['The ___ has got ___.', 'Give it ___!'],
    4: ['The ___ has got ___ because it ___.', 'It should ___, and it shouldn\'t ___!']
  };

  var FALLBACK_TEAMS = [
    { name: 'Team Pumpkin Vets', color: '#f97316' },
    { name: 'Team Bat Vets', color: '#a855f7' },
    { name: 'Team Ghost Vets', color: '#38bdf8' },
    { name: 'Team Spider Vets', color: '#10b981' }
  ];

  var TEAM_ICONS = ['🩺', '🏥', '💊', '🩹', '🧪', '💚'];

  window.PetShopData = {
    PETS: PETS,
    PRACTICE: PRACTICE,
    BUILDER: BUILDER,
    ICONS: ICONS,
    QUESTIONS: QUESTIONS,
    SELLER: SELLER,
    JOBS: JOBS,
    LAB_STEPS: LAB_STEPS,
    DOOR: DOOR,
    FALLBACK_TEAMS: FALLBACK_TEAMS,
    TEAM_ICONS: TEAM_ICONS
  };
})(window);
