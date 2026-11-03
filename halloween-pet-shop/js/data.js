/* Monster Pet Vet Clinic · Super-Easy 35-Min Whole-Class + Individual PPP Data (Grade 3 A1 & Grade 4 A1+, Zero Group Work) */
window.PetShopData = {
  // Simple scoreboard pods (used as Row 1..4 or Class Pods when individual students answer at the board)
  FALLBACK_TEAMS: [
    { name: 'Row 1 Stars', color: '#a855f7' },
    { name: 'Row 2 Stars', color: '#f97316' },
    { name: 'Row 3 Stars', color: '#10b981' },
    { name: 'Row 4 Stars', color: '#38bdf8' }
  ],
  TEAM_ICONS: ['⭐', '🩺', '💚', '🐾', '✨', '🏆'],

  // ---------------------------------------------------------------------------
  // STEP 1 (PRESENTATION A): 6 Super-Easy Everyday Problems & Cures (2 words each!)
  // ---------------------------------------------------------------------------
  VOCAB: [
    {
      id: 'tummy',
      icon: '🤢',
      symImg: 'art/sym_tummy.webp',
      cureImg: 'art/cure_water.webp',
      word3: 'a tummy ache',
      word4: 'a tummy ache',
      meaning: 'Ouch! My tummy hurts.',
      cause4: '🚫 Don\'t eat sweets!',
      cureIcon: '💧',
      cureLabel: 'warm water',
      cure3: 'Give it warm water!',
      cure4: 'It should drink warm water.',
      tpr: '🤢 Hold your tummy and say: "Ouch! A tummy ache!"'
    },
    {
      id: 'cold',
      icon: '🥶',
      symImg: 'art/sym_cold.webp',
      cureImg: 'art/cure_blanket.webp',
      word3: 'a cold',
      word4: 'a bad cold',
      meaning: 'Brrr! Cold and sneezing.',
      cause4: '🚫 Don\'t go in the rain!',
      cureIcon: '🧣',
      cureLabel: 'a blanket',
      cure3: 'Give it a blanket!',
      cure4: 'It should wear a blanket.',
      tpr: '🥶 Hug your arms and shiver: "Brrr! A cold!"'
    },
    {
      id: 'throat',
      icon: '😷',
      symImg: 'art/sym_throat.webp',
      cureImg: 'art/cure_tea.webp',
      word3: 'a sore throat',
      word4: 'a sore throat',
      meaning: 'Ouch! My neck hurts.',
      cause4: '🚫 Don\'t shout loudly!',
      cureIcon: '🍵',
      cureLabel: 'warm tea',
      cure3: 'Give it warm tea!',
      cure4: 'It should drink warm tea.',
      tpr: '😷 Touch your neck gently and whisper: "A sore throat!"'
    },
    {
      id: 'paw',
      icon: '🐾',
      symImg: 'art/sym_paw.webp',
      cureImg: 'art/cure_bandage.webp',
      word3: 'a hurt paw',
      word4: 'a hurt paw',
      meaning: 'Ouch! It cannot walk.',
      cause4: '🚫 Don\'t run or jump!',
      cureIcon: '🩹',
      cureLabel: 'a bandage',
      cure3: 'Give it a bandage!',
      cure4: 'It should wear a bandage.',
      tpr: '🐾 Hold up one hand like a sore paw: "A hurt paw!"'
    },
    {
      id: 'tired',
      icon: '😴',
      symImg: 'art/sym_dizzy.webp',
      cureImg: 'art/cure_pillow.webp',
      word3: 'tired and dizzy',
      word4: 'tired and dizzy',
      meaning: 'Yawn! Needs to sleep.',
      cause4: '🚫 Don\'t play outside!',
      cureIcon: '🛌',
      cureLabel: 'a soft bed',
      cure3: 'Give it a soft bed!',
      cure4: 'It should sleep in bed.',
      tpr: '😴 Put hands under your cheek and yawn: "Tired!"'
    },
    {
      id: 'hungry',
      icon: '🍽️',
      symImg: 'art/sym_bones.webp',
      cureImg: 'art/cure_milk.webp',
      word3: 'hungry and weak',
      word4: 'hungry and weak',
      meaning: 'Needs healthy food & milk.',
      cause4: '🚫 Don\'t eat junk food!',
      cureIcon: '🥛',
      cureLabel: 'milk and apple',
      cure3: 'Give it milk and an apple!',
      cure4: 'It should drink milk.',
      tpr: '🥛 Pretend to drink a big glass of milk: "Mmm, healthy milk!"'
    }
  ],

  // Explicit PPP Grammar Formula Cards (3 short blocks at the top of Step 1)
  FORMULAS: {
    3: [
      { tag: '1 · ASK', img: 'art/sym_tummy.webp', pattern: "What's the matter?", ex: "What's the matter with Shadow?", cls: 'amber' },
      { tag: '2 · PROBLEM', img: 'art/sym_paw.webp', pattern: 'It has got + [a tummy ache / a cold].', ex: 'It has got a tummy ache.', cls: 'cyan' },
      { tag: '3 · CURE', img: 'art/cure_water.webp', pattern: 'Give it + [warm water / a blanket]!', ex: 'Give it warm water!', cls: 'emerald' }
    ],
    4: [
      { tag: '1 · PROBLEM (has got)', img: 'art/sym_tummy.webp', pattern: 'It has got + [a tummy ache / a cold].', ex: 'Shadow has got a tummy ache.', cls: 'amber' },
      { tag: '2 · DO (It should)', img: 'art/cure_tea.webp', pattern: 'It SHOULD + [drink / wear / sleep].', ex: 'It should drink warm water.', cls: 'emerald' },
      { tag: "3 · DON'T (It shouldn't)", img: 'art/sym_throat.webp', pattern: "It SHOULDN'T + [eat sweets / run]!", ex: "It shouldn't eat sweets!", cls: 'coral' }
    ]
  },

  // ---------------------------------------------------------------------------
  // STEP 2 & 3: 6 Monster Patients — ONLY 3 SHORT LINES PER PET (5-6 words per line!)
  // ---------------------------------------------------------------------------
  PETS: [
    {
      id: 'cat',
      name: 'Shadow',
      kind: 'black cat',
      temp: '39.0°C',
      badge: '🤢 Tummy Ache',
      symptomIcon: '🤢',
      cureIcon: '💧',
      symImg: 'art/sym_tummy.webp',
      cureImg: 'art/cure_water.webp',
      cureShort: '💧 Warm water',
      act: '🤢 Hold your tummy, then drink warm water!',
      chart3: {
        symptom: 'Look at Shadow! It is a black cat.',
        cure: 'It has got a tummy ache.',
        result: 'Give it warm water!'
      },
      chart4: {
        symptom: 'Shadow has got a tummy ache.',
        should: 'It should drink warm water.',
        shouldnt: "It shouldn't eat sweets!"
      },
      g3: ['Look at Shadow! It is a black cat.', 'It has got a tummy ache.', 'Give it warm water!'],
      g4: ['Shadow has got a tummy ache.', 'It should drink warm water.', "It shouldn't eat sweets!"],
      clues3: ['🤒 It has got a tummy ache.', '💧 Give it warm water!', '🐱 It is a black cat.'],
      clues4: ['🤒 It has got a tummy ache.', '✅ It should drink warm water.', '🐱 It is a black cat.'],
      check3: { q: 'What cure does Shadow need?', right: '💧 Warm water', wrong: ['🧣 A blanket', '🩹 A bandage'] },
      check4: { q: 'What SHOULD Shadow do?', right: '💧 Drink warm water', wrong: ['🍬 Eat sweets', '🌧️ Fly in the rain'] }
    },
    {
      id: 'bat',
      name: 'Flappy',
      kind: 'purple bat',
      temp: '35.8°C',
      badge: '🥶 A Cold',
      symptomIcon: '🥶',
      cureIcon: '🧣',
      symImg: 'art/sym_cold.webp',
      cureImg: 'art/cure_blanket.webp',
      cureShort: '🧣 A blanket',
      act: '🥶 Shiver "Brrr!", then wrap in a warm blanket!',
      chart3: {
        symptom: 'Look at Flappy! It is a purple bat.',
        cure: 'It has got a cold.',
        result: 'Give it a warm blanket!'
      },
      chart4: {
        symptom: 'Flappy has got a bad cold.',
        should: 'It should wear a blanket.',
        shouldnt: "It shouldn't fly in the rain!"
      },
      g3: ['Look at Flappy! It is a purple bat.', 'It has got a cold.', 'Give it a warm blanket!'],
      g4: ['Flappy has got a bad cold.', 'It should wear a blanket.', "It shouldn't fly in the rain!"],
      clues3: ['🥶 It has got a cold.', '🧣 Give it a warm blanket!', '🦇 It is a purple bat.'],
      clues4: ['🥶 It has got a bad cold.', '✅ It should wear a blanket.', '🦇 It is a purple bat.'],
      check3: { q: 'What cure does Flappy need?', right: '🧣 A blanket', wrong: ['💧 Warm water', '🩹 A bandage'] },
      check4: { q: 'What SHOULD Flappy do?', right: '🧣 Wear a blanket', wrong: ['🌧️ Fly in the rain', '🍦 Eat ice cream'] }
    },
    {
      id: 'ghost',
      name: 'Boo',
      kind: 'white ghost',
      temp: '38.4°C',
      badge: '😷 Sore Throat',
      symptomIcon: '😷',
      cureIcon: '🍵',
      symImg: 'art/sym_throat.webp',
      cureImg: 'art/cure_tea.webp',
      cureShort: '🍵 Warm tea',
      act: '😷 Touch your neck, then sip warm honey tea!',
      chart3: {
        symptom: 'Look at Boo! It is a white ghost.',
        cure: 'It has got a sore throat.',
        result: 'Give it warm honey tea!'
      },
      chart4: {
        symptom: 'Boo has got a sore throat.',
        should: 'It should drink warm tea.',
        shouldnt: "It shouldn't shout loudly!"
      },
      g3: ['Look at Boo! It is a white ghost.', 'It has got a sore throat.', 'Give it warm honey tea!'],
      g4: ['Boo has got a sore throat.', 'It should drink warm tea.', "It shouldn't shout loudly!"],
      clues3: ['😷 It has got a sore throat.', '🍵 Give it warm honey tea!', '👻 It is a white ghost.'],
      clues4: ['😷 It has got a sore throat.', '✅ It should drink warm tea.', '👻 It is a white ghost.'],
      check3: { q: 'What cure does Boo need?', right: '🍵 Warm tea', wrong: ['🩹 A bandage', '🧣 A blanket'] },
      check4: { q: 'What SHOULD Boo do?', right: '🍵 Drink warm tea', wrong: ['📣 Shout loudly', '🍦 Eat ice'] }
    },
    {
      id: 'orangecat',
      name: 'Ginger',
      kind: 'orange cat',
      temp: '37.9°C',
      badge: '🐾 Hurt Paw',
      symptomIcon: '🐾',
      cureIcon: '🩹',
      symImg: 'art/sym_paw.webp',
      cureImg: 'art/cure_bandage.webp',
      cureShort: '🩹 A bandage',
      act: '🐾 Hold up one sore paw, then wrap a bandage on it!',
      chart3: {
        symptom: 'Look at Ginger! It is an orange cat.',
        cure: 'It has got a hurt paw.',
        result: 'Give it a clean bandage!'
      },
      chart4: {
        symptom: 'Ginger has got a hurt paw.',
        should: 'It should wear a bandage.',
        shouldnt: "It shouldn't jump or run!"
      },
      g3: ['Look at Ginger! It is an orange cat.', 'It has got a hurt paw.', 'Give it a clean bandage!'],
      g4: ['Ginger has got a hurt paw.', 'It should wear a bandage.', "It shouldn't jump or run!"],
      clues3: ['🐾 It has got a hurt paw.', '🩹 Give it a clean bandage!', '🐱 It is an orange cat.'],
      clues4: ['🐾 It has got a hurt paw.', '✅ It should wear a bandage.', '🐱 It is an orange cat.'],
      check3: { q: 'What cure does Ginger need?', right: '🩹 A bandage', wrong: ['🍵 Warm tea', '🥛 Milk'] },
      check4: { q: 'What SHOULD Ginger do?', right: '🩹 Wear a bandage', wrong: ['🏃 Jump and run', '📣 Shout'] }
    },
    {
      id: 'pumpkin',
      name: 'Pumpy',
      kind: 'orange pumpkin',
      temp: '37.6°C',
      badge: '😴 Tired & Dizzy',
      symptomIcon: '😴',
      cureIcon: '🛌',
      symImg: 'art/sym_dizzy.webp',
      cureImg: 'art/cure_pillow.webp',
      cureShort: '🛌 A soft bed',
      act: '😴 Yawn and put your head on a soft pillow!',
      chart3: {
        symptom: 'Look at Pumpy! It is a pumpkin.',
        cure: 'It is tired and dizzy.',
        result: 'Give it a soft bed!'
      },
      chart4: {
        symptom: 'Pumpy is tired and dizzy.',
        should: 'It should sleep in a soft bed.',
        shouldnt: "It shouldn't spin around!"
      },
      g3: ['Look at Pumpy! It is a pumpkin.', 'It is tired and dizzy.', 'Give it a soft bed!'],
      g4: ['Pumpy is tired and dizzy.', 'It should sleep in a soft bed.', "It shouldn't spin around!"],
      clues3: ['😴 It is tired and dizzy.', '🛌 Give it a soft bed!', '🎃 It is a round pumpkin.'],
      clues4: ['😴 It is tired and dizzy.', '✅ It should sleep in a soft bed.', '🎃 It is a round pumpkin.'],
      check3: { q: 'What cure does Pumpy need?', right: '🛌 A soft bed', wrong: ['🩹 A bandage', '🧣 A blanket'] },
      check4: { q: 'What SHOULD Pumpy do?', right: '🛌 Sleep in bed', wrong: ['🌀 Spin around', '🏃 Run fast'] }
    },
    {
      id: 'skeleton',
      name: 'Bones',
      kind: 'white skeleton',
      temp: '37.0°C',
      badge: '🍽️ Hungry & Weak',
      symptomIcon: '🍽️',
      cureIcon: '🥛',
      symImg: 'art/sym_bones.webp',
      cureImg: 'art/cure_milk.webp',
      cureShort: '🥛 Milk & apple',
      act: '🥛 Drink a big glass of milk and show strong arms!',
      chart3: {
        symptom: 'Look at Bones! It is a skeleton.',
        cure: 'It is hungry and weak.',
        result: 'Give it milk and an apple!'
      },
      chart4: {
        symptom: 'Bones is hungry and weak.',
        should: 'It should drink milk and eat fruit.',
        shouldnt: "It shouldn't eat junk food!"
      },
      g3: ['Look at Bones! It is a skeleton.', 'It is hungry and weak.', 'Give it milk and an apple!'],
      g4: ['Bones is hungry and weak.', 'It should drink milk and eat fruit.', "It shouldn't eat junk food!"],
      clues3: ['🍽️ It is hungry and weak.', '🥛 Give it milk and an apple!', '💀 It is a white skeleton.'],
      clues4: ['🍽️ It is hungry and weak.', '✅ It should drink milk.', '💀 It is a white skeleton.'],
      check3: { q: 'What cure does Bones need?', right: '🥛 Milk & apple', wrong: ['🩹 A bandage', '🧣 A blanket'] },
      check4: { q: 'What SHOULD Bones do?', right: '🥛 Drink milk', wrong: ['🍬 Eat sweets', '🌧️ Go in rain'] }
    }
  ],

  // ---------------------------------------------------------------------------
  // STEP 4 (PRACTICE B): 2-WORD PICTURE BUTTONS + 1-TAP GRAMMAR CHOICE
  // ---------------------------------------------------------------------------
  PRACTICE: {
    3: [
      {
        pet: 'cat',
        problem: '🤢 Shadow has got a tummy ache.',
        q: 'Step 1: Tap the right cure picture!',
        right: '💧 Warm water',
        rightImg: 'art/cure_water.webp',
        wrong: ['🧣 A blanket', '🩹 A bandage', '🛌 A soft bed'],
        grammarQ: 'Step 2: "Shadow ___ a tummy ache."',
        grammarRight: 'has got',
        grammarOpts: ['has got', 'give'],
        grammarFull: 'Shadow has got a tummy ache. Give it warm water!'
      },
      {
        pet: 'bat',
        problem: '🥶 Flappy has got a cold.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🧣 A blanket',
        rightImg: 'art/cure_blanket.webp',
        wrong: ['💧 Warm water', '🩹 A bandage', '🥛 Milk & apple'],
        grammarQ: 'Step 2: "___ it a warm blanket!"',
        grammarRight: 'Give',
        grammarOpts: ['Give', 'Has'],
        grammarFull: 'Flappy has got a cold. Give it a warm blanket!'
      },
      {
        pet: 'ghost',
        problem: '😷 Boo has got a sore throat.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🍵 Warm tea',
        rightImg: 'art/cure_tea.webp',
        wrong: ['🩹 A bandage', '🧣 A blanket', '🛌 A soft bed'],
        grammarQ: 'Step 2: "Boo ___ a sore throat."',
        grammarRight: 'has got',
        grammarOpts: ['has got', 'give'],
        grammarFull: 'Boo has got a sore throat. Give it warm tea!'
      },
      {
        pet: 'orangecat',
        problem: '🐾 Ginger has got a hurt paw.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🩹 A bandage',
        rightImg: 'art/cure_bandage.webp',
        wrong: ['🍵 Warm tea', '💧 Warm water', '🥛 Milk & apple'],
        grammarQ: 'Step 2: "___ it a clean bandage!"',
        grammarRight: 'Give',
        grammarOpts: ['Give', 'Has'],
        grammarFull: 'Ginger has got a hurt paw. Give it a clean bandage!'
      },
      {
        pet: 'pumpkin',
        problem: '😴 Pumpy is tired and dizzy.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🛌 A soft bed',
        rightImg: 'art/cure_pillow.webp',
        wrong: ['🩹 A bandage', '🍵 Warm tea', '🧣 A blanket'],
        grammarQ: 'Step 2: "Pumpy ___ tired and dizzy."',
        grammarRight: 'is',
        grammarOpts: ['is', 'give'],
        grammarFull: 'Pumpy is tired and dizzy. Give it a soft bed!'
      },
      {
        pet: 'skeleton',
        problem: '🍽️ Bones is hungry and weak.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🥛 Milk & apple',
        rightImg: 'art/cure_milk.webp',
        wrong: ['🩹 A bandage', '🧣 A blanket', '🍵 Warm tea'],
        grammarQ: 'Step 2: "___ it milk and an apple!"',
        grammarRight: 'Give',
        grammarOpts: ['Give', 'Is'],
        grammarFull: 'Bones is hungry and weak. Give it milk and an apple!'
      }
    ],
    4: [
      {
        pet: 'cat',
        problem: '🤢 Shadow has got a tummy ache.',
        q: 'Step 1: Tap the right cure picture!',
        right: '💧 Warm water',
        rightImg: 'art/cure_water.webp',
        wrong: ['🧣 A blanket', '🩹 A bandage', '🛌 A soft bed'],
        grammarQ: 'Step 2: "It ___ drink warm water."',
        grammarRight: 'should',
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Shadow has got a tummy ache. It should drink warm water. It shouldn't eat sweets!"
      },
      {
        pet: 'bat',
        problem: '🥶 Flappy has got a bad cold.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🧣 A blanket',
        rightImg: 'art/cure_blanket.webp',
        wrong: ['💧 Warm water', '🩹 A bandage', '🥛 Milk & apple'],
        grammarQ: 'Step 2: "It ___ fly in the cold rain!"',
        grammarRight: "shouldn't",
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Flappy has got a bad cold. It should wear a blanket. It shouldn't fly in the rain!"
      },
      {
        pet: 'ghost',
        problem: '😷 Boo has got a sore throat.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🍵 Warm tea',
        rightImg: 'art/cure_tea.webp',
        wrong: ['🩹 A bandage', '🧣 A blanket', '🛌 A soft bed'],
        grammarQ: 'Step 2: "It ___ drink warm honey tea."',
        grammarRight: 'should',
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Boo has got a sore throat. It should drink warm tea. It shouldn't shout!"
      },
      {
        pet: 'orangecat',
        problem: '🐾 Ginger has got a hurt paw.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🩹 A bandage',
        rightImg: 'art/cure_bandage.webp',
        wrong: ['🍵 Warm tea', '💧 Warm water', '🥛 Milk & apple'],
        grammarQ: 'Step 2: "It ___ jump or run today!"',
        grammarRight: "shouldn't",
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Ginger has got a hurt paw. It should wear a bandage. It shouldn't jump or run!"
      },
      {
        pet: 'pumpkin',
        problem: '😴 Pumpy is tired and dizzy.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🛌 A soft bed',
        rightImg: 'art/cure_pillow.webp',
        wrong: ['🩹 A bandage', '🍵 Warm tea', '🧣 A blanket'],
        grammarQ: 'Step 2: "It ___ sleep in a soft bed."',
        grammarRight: 'should',
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Pumpy is tired and dizzy. It should sleep in bed. It shouldn't spin around!"
      },
      {
        pet: 'skeleton',
        problem: '🍽️ Bones is hungry and weak.',
        q: 'Step 1: Tap the right cure picture!',
        right: '🥛 Milk & apple',
        rightImg: 'art/cure_milk.webp',
        wrong: ['🩹 A bandage', '🧣 A blanket', '🍵 Warm tea'],
        grammarQ: 'Step 2: "It ___ eat junk food or sweets!"',
        grammarRight: "shouldn't",
        grammarOpts: ['should', "shouldn't"],
        grammarFull: "Bones is hungry and weak. It should drink milk. It shouldn't eat sweets!"
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // STEP 5: INDIVIDUAL "CIRCLE & SAY" CHECK-UP BUILDER (No Group Work!)
  // ---------------------------------------------------------------------------
  BUILDER: {
    names: ['Shadow', 'Flappy', 'Boo', 'Ginger', 'Pumpy', 'Bones'],
    animal: ['black cat', 'purple bat', 'white ghost', 'orange cat', 'pumpkin', 'skeleton'],
    symptom: ['a tummy ache', 'a cold', 'a sore throat', 'a hurt paw'],
    cure3: ['warm water', 'a blanket', 'warm tea', 'a bandage', 'a soft bed', 'milk'],
    should4: ['drink warm water', 'wear a blanket', 'drink warm tea', 'wear a bandage', 'sleep in bed', 'drink milk'],
    shouldnt4: ['eat sweets', 'fly in the rain', 'shout loudly', 'jump or run']
  },
  ICONS: {
    'black cat': '🐱', 'purple bat': '🦇', 'white ghost': '👻', 'orange cat': '🐱', pumpkin: '🎃', skeleton: '💀',
    'a tummy ache': '🤢', 'a cold': '🥶', 'a sore throat': '😷', 'a hurt paw': '🐾',
    'warm water': '💧', 'a blanket': '🧣', 'warm tea': '🍵', 'a bandage': '🩹', 'a soft bed': '🛌', milk: '🥛',
    'drink warm water': '💧', 'wear a blanket': '🧣', 'drink warm tea': '🍵', 'wear a bandage': '🩹', 'sleep in bed': '🛌', 'drink milk': '🥛',
    'eat sweets': '🚫🍬', 'fly in the rain': '🚫🌧️', 'shout loudly': '🚫📣', 'jump or run': '🚫🏃'
  },
  IMG_MAP: {
    'black cat': 'art/cat.webp', 'purple bat': 'art/bat.webp', 'white ghost': 'art/ghost.webp', 'orange cat': 'art/orangecat.webp', pumpkin: 'art/pumpkin.webp', skeleton: 'art/skeleton.webp',
    'a tummy ache': 'art/sym_tummy.webp', 'a cold': 'art/sym_cold.webp', 'a sore throat': 'art/sym_throat.webp', 'a hurt paw': 'art/sym_paw.webp',
    'warm water': 'art/cure_water.webp', 'a blanket': 'art/cure_blanket.webp', 'warm tea': 'art/cure_tea.webp', 'a bandage': 'art/cure_bandage.webp', 'a soft bed': 'art/cure_pillow.webp', milk: 'art/cure_milk.webp',
    'drink warm water': 'art/cure_water.webp', 'wear a blanket': 'art/cure_blanket.webp', 'drink warm tea': 'art/cure_tea.webp', 'wear a bandage': 'art/cure_bandage.webp', 'sleep in bed': 'art/cure_pillow.webp', 'drink milk': 'art/cure_milk.webp'
  },
  INDIVIDUAL_STEPS: [
    '1 · ✏️ Circle 1 Pet & write its name (1 min)',
    '2 · 🤒 Circle 1 Problem picture (1 min)',
    '3 · 💊 Circle 1 Cure picture (1 min)',
    '4 · 🎨 Draw a quick bandage / cure & say your 3 lines! (2 min)'
  ],

  // ---------------------------------------------------------------------------
  // STEP 6: BRAVE VET STAND-UP (Individual 3-Line Speaking + Spin 1 Question)
  // ---------------------------------------------------------------------------
  SELLER: {
    3: [
      '1 · 🐱 Look at [Name]! It is a [cat / bat / ghost].',
      '2 · 🤒 It has got [a tummy ache / a cold / a hurt paw].',
      '3 · 💊 Give it [warm water / a blanket / a bandage]!'
    ],
    4: [
      '1 · 🤒 [Name] has got [a tummy ache / a cold / a hurt paw].',
      '2 · ✅ It should [drink warm water / wear a blanket / wear a bandage].',
      "3 · 🚫 It shouldn't [eat sweets / fly in the rain / jump]!"
    ]
  },
  QUESTIONS: {
    3: [
      { q: "What's the matter with it?", a: 'It has got ___.' },
      { q: 'What cure does it need?', a: 'Give it ___!' },
      { q: 'Is it happy now?', a: 'Yes, it is!' }
    ],
    4: [
      { q: "What's the matter with your pet?", a: 'It has got ___.' },
      { q: 'What should it do?', a: 'It should ___.' },
      { q: "What shouldn't it do?", a: "It shouldn't ___!" }
    ]
  },
  DOOR: {
    3: ['It has got a tummy ache. Give it warm water!', 'It has got a cold. Give it a blanket!', 'It has got a hurt paw. Give it a bandage!'],
    4: ["It has got a tummy ache. It should drink water!", "It has got a cold. It should wear a blanket!", "It has got a hurt paw. It shouldn't run!"]
  }
};
