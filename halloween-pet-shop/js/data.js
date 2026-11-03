/* Monster Pet Vet Clinic: Pro CLIL (Health, Symptoms, Causes & Animal Care) + PPP Lesson
   Grade 3 (A1): What's the matter? · It is [feeling] / It has got [symptom] · Give it [cure]!
   Grade 4 (A1+): It has got [symptom] because it [past cause] · It should [do] · It shouldn't [don't]! */
(function (window) {
  'use strict';

  // PPP Stage 1: Core CLIL Vocabulary & Grammar Formulas (taught BEFORE the games!)
  var FORMULAS = {
    3: [
      { tag: '1 · ASK & FEELING', cls: 'amber', img: 'art/sym_cold.webp', pattern: "What's the matter? → It is tired / cold / hungry.", ex: 'It is tired and cold.' },
      { tag: '2 · SYMPTOM (has got)', cls: 'cyan', img: 'art/sym_tummy.webp', pattern: 'It has got + a tummy ache / a sore paw.', ex: 'It has got a tummy ache.' },
      { tag: '3 · CURE (Give it…)', cls: 'emerald', img: 'art/cure_water.webp', pattern: 'Give it + warm water / a blanket / a bandage!', ex: 'Give it warm water!' }
    ],
    4: [
      { tag: '1 · SYMPTOM + CAUSE (because)', cls: 'cyan', img: 'art/sym_tummy.webp', pattern: 'It has got [symptom] BECAUSE it [past action].', ex: 'It has got a stomach ache because it ate ten sweets.' },
      { tag: '2 · GOOD ADVICE (should)', cls: 'emerald', img: 'art/cure_tea.webp', pattern: 'It SHOULD + base verb (drink / rest / wear).', ex: 'It should drink warm tea and rest.' },
      { tag: "3 · WARNING (shouldn't)", cls: 'coral', img: 'art/sym_throat.webp', pattern: "It SHOULDN'T + base verb (eat / fly / shout).", ex: "It shouldn't eat sweets!" }
    ]
  };

  // 6 Visual CLIL Flashcards for Step 1 (with 3D Symptom Art & 3D Cure Art)
  var VOCAB = [
    {
      id: 'tummy', kind: 'symptom', icon: '🤢', symImg: 'art/sym_tummy.webp', cureImg: 'art/cure_water.webp',
      word3: 'a tummy ache', word4: 'a stomach ache',
      meaning: 'Shadow ate too many sweets — its tummy hurts!',
      cause4: 'because it ate too many sweets 🍬',
      cureIcon: '💧', cure3: 'Give it warm water!', cure4: "It should drink warm water. It shouldn't eat sweets!",
      tpr: 'Hold your tummy with both hands and say: "Ooh, a tummy ache!"'
    },
    {
      id: 'cold', kind: 'symptom', icon: '🥶', symImg: 'art/sym_cold.webp', cureImg: 'art/cure_blanket.webp',
      word3: 'cold & shivering', word4: 'a bad cold',
      meaning: 'Flappy flew in the rain — it is freezing and shaking!',
      cause4: 'because it flew in the cold rain 🌧️',
      cureIcon: '🧣', cure3: 'Give it a warm blanket!', cure4: "It should wear a warm blanket. It shouldn't go out in the rain!",
      tpr: 'Hug your arms, shiver, and say: "Brrr! I have got a cold!"'
    },
    {
      id: 'throat', kind: 'symptom', icon: '😷', symImg: 'art/sym_throat.webp', cureImg: 'art/cure_tea.webp',
      word3: 'a sore throat', word4: 'a sore throat',
      meaning: 'Boo shouted "BOO!" all night — its throat hurts!',
      cause4: 'because it shouted "BOO!" all night 📣',
      cureIcon: '🍵', cure3: 'Give it warm honey tea!', cure4: "It should drink warm honey tea. It shouldn't shout!",
      tpr: 'Touch your neck gently and whisper: "Sore throat!"'
    },
    {
      id: 'paw', kind: 'symptom', icon: '🐾', symImg: 'art/sym_paw.webp', cureImg: 'art/cure_bandage.webp',
      word3: 'a hurt paw / wing', word4: 'a sore paw / wing',
      meaning: 'Ginger jumped off a high wall — its front paw hurts!',
      cause4: 'because it jumped off a high wall 🧱',
      cureIcon: '🩹', cure3: 'Put a bandage on its paw!', cure4: "It should wear a clean bandage. It shouldn't jump or climb!",
      tpr: 'Hold up one hand like a sore paw and wrap a pretend bandage!'
    },
    {
      id: 'dizzy', kind: 'symptom', icon: '💫', symImg: 'art/sym_dizzy.webp', cureImg: 'art/cure_pillow.webp',
      word3: 'dizzy & muddy', word4: 'dizzy & exhausted',
      meaning: 'Pumpy rolled down a hill — its head is spinning!',
      cause4: 'because it rolled down a big hill ⛰️',
      cureIcon: '🛌', cure3: 'Wash it and give it a soft pillow!', cure4: "It should rest on a soft pillow. It shouldn't roll down hills!",
      tpr: 'Circle your finger above your head, then rest on a pillow!'
    },
    {
      id: 'bones', kind: 'symptom', icon: '🦴', symImg: 'art/sym_bones.webp', cureImg: 'art/cure_milk.webp',
      word3: 'tired legs & hungry', word4: 'weak bones & tired legs',
      meaning: 'Bones danced for 5 hours — its legs and knees ache!',
      cause4: 'because it danced for five hours 💃',
      cureIcon: '🥛', cure3: 'Give it healthy milk and fruit!', cure4: "It should drink milk for strong bones. It shouldn't dance today!",
      tpr: 'Rub your knees, then mime drinking a big glass of milk!'
    }
  ];

  // 7 Patients with structured visual charts + 3D symptom & cure images
  var PETS = [
    {
      id: 'cat', name: 'Shadow', kind: 'black cat', temp: '39.0°C', badge: '🤢 Tummy Ache',
      symImg: 'art/sym_tummy.webp', cureImg: 'art/cure_water.webp',
      symptomIcon: '🤢', causeIcon: '🍬', cureIcon: '💧',
      chart3: {
        symptom: 'It is tired and it has got a tummy ache.',
        detail: 'It ate too many Halloween sweets!',
        cure: 'Give it warm water and a soft bed!',
        result: 'Now Shadow is happy and healthy!'
      },
      chart4: {
        symptom: 'It has got a stomach ache',
        cause: 'because it ate ten Halloween sweets.',
        state: "It feels dizzy, so it can't climb today.",
        should: 'It should drink warm water and rest in bed.',
        shouldnt: "It shouldn't eat chocolate or sweets!"
      },
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
        '🌡️ Symptom: It has got a tummy ache and it is tired.',
        '🐈‍⬛ Body Clue: It is a black cat with a purple hat.',
        '💊 Cure: Give it warm water and a soft bed!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It has got a stomach ache because it ate ten sweets.',
        "🐈‍⬛ Body Clue: It has got yellow eyes and a purple hat, and it can't climb today.",
        "💊 Vet Advice: It should drink warm water, and it shouldn't eat chocolate!"
      ],
      check3: { q: "What's the matter with Shadow?", right: '🤢 It has got a tummy ache.', wrong: ['🥶 It is freezing cold.', '🪽 Its wing hurts.'] },
      check4: { q: 'Why has Shadow got a stomach ache?', right: '🍬 Because it ate ten Halloween sweets.', wrong: ['🌧️ Because it flew in the rain.', '📣 Because it shouted all night.'] },
      act: '🤢 Hold your tummy, then drink warm water!'
    },
    {
      id: 'bat', name: 'Flappy', kind: 'purple bat', temp: '35.8°C', badge: '🥶 Cold & Hurt Wing',
      symImg: 'art/sym_cold.webp', cureImg: 'art/cure_blanket.webp',
      symptomIcon: '🥶', causeIcon: '🌧️', cureIcon: '🧣',
      chart3: {
        symptom: 'It is cold and its wing hurts.',
        detail: 'It cannot fly tonight.',
        cure: 'Give it a warm blanket and a bandage!',
        result: 'Now Flappy is safe and warm!'
      },
      chart4: {
        symptom: 'It has got a cold and a sore wing',
        cause: 'because it flew in the cold rain.',
        state: "It is shivering, so it can't fly tonight.",
        should: 'It should wear a warm blanket and rest its wing.',
        shouldnt: "It shouldn't fly outside in the wind!"
      },
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
        '🌡️ Symptom: It is very cold and its wing hurts.',
        '🦇 Body Clue: It is small and purple with two wings.',
        '💊 Cure: Give it a warm blanket and a bandage!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It is shivering because it flew in the cold rain.',
        "🦇 Body Clue: It is a purple bat, and its wing hurts so it can't fly.",
        "💊 Vet Advice: It should wear a warm blanket, and it shouldn't fly in the wind!"
      ],
      check3: { q: 'What does Flappy need?', right: '🧣 A warm blanket and a bandage.', wrong: ['🍦 Cold ice cream.', '🥁 A loud drum.'] },
      check4: { q: "What shouldn't Flappy do tonight?", right: "🚫 It shouldn't fly outside in the wind.", wrong: ["🚫 It shouldn't wear a blanket.", "🚫 It shouldn't rest."] },
      act: '🥶 Shiver in the cold, then wrap in a warm blanket!'
    },
    {
      id: 'ghost', name: 'Boo', kind: 'white ghost', temp: '37.5°C', badge: '😷 Sore Throat',
      symImg: 'art/sym_throat.webp', cureImg: 'art/cure_tea.webp',
      symptomIcon: '😷', causeIcon: '📣', cureIcon: '🍵',
      chart3: {
        symptom: 'It is thirsty and it has got a sore throat.',
        detail: 'Its voice is very quiet.',
        cure: 'Give it warm honey tea!',
        result: 'Now Boo can smile again!'
      },
      chart4: {
        symptom: 'It has got a sore throat',
        cause: 'because it shouted "BOO!" all night.',
        state: "Its voice is gone, so it can't sing today.",
        should: 'It should drink warm honey tea and whisper.',
        shouldnt: "It shouldn't shout or drink cold juice!"
      },
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
        '🌡️ Symptom: It is thirsty and it has got a sore throat.',
        '👻 Body Clue: It is white and wears a purple bow tie.',
        '💊 Cure: Give it warm honey tea!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It has got a sore throat because it shouted "BOO!" all night.',
        '👻 Body Clue: It is a friendly white ghost with a bow tie.',
        "💊 Vet Advice: It should drink warm honey tea, and it shouldn't shout!"
      ],
      check3: { q: "What's the matter with Boo?", right: '😷 It has got a sore throat.', wrong: ['🐾 Its paw hurts.', '🧼 It is muddy.'] },
      check4: { q: 'Why has Boo got a sore throat?', right: '📣 Because it shouted "BOO!" all night.', wrong: ['🍕 Because it ate pizza.', '🏊 Because it swam in the sea.'] },
      act: '😷 Touch your throat, then sip warm honey tea!'
    },
    {
      id: 'pumpkin', name: 'Pumpy', kind: 'orange pumpkin', temp: '38.2°C', badge: '💫 Dizzy & Muddy',
      symImg: 'art/sym_dizzy.webp', cureImg: 'art/cure_pillow.webp',
      symptomIcon: '💫', causeIcon: '⛰️', cureIcon: '🛌',
      chart3: {
        symptom: 'It is dizzy and muddy.',
        detail: 'It rolled down a big hill!',
        cure: 'Wash it with water and give it a soft pillow!',
        result: 'Now Pumpy is clean and happy!'
      },
      chart4: {
        symptom: 'It feels dizzy and has got a bump',
        cause: 'because it rolled down a big hill too fast.',
        state: 'It has got mud on its green leaves.',
        should: 'It should rest on a soft pillow and wash with water.',
        shouldnt: "It shouldn't roll down hills today!"
      },
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
        '🌡️ Symptom: It is dizzy and muddy.',
        '🎃 Body Clue: It is round and orange with green leaves.',
        '💊 Cure: Wash it with clean water and let it rest!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It feels dizzy because it rolled down a big hill too fast.',
        '🎃 Body Clue: It is round and orange with green leaves on top.',
        "💊 Vet Advice: It should rest on a pillow, and it shouldn't roll today!"
      ],
      check3: { q: "What's the matter with Pumpy?", right: '💫 It is dizzy and dirty.', wrong: ['🕷️ It has got eight legs.', '🪽 Its wing hurts.'] },
      check4: { q: 'What should Pumpy do now?', right: '🛌 It should sit on a soft pillow and wash.', wrong: ['⛰️ It should roll down the hill again.', '🍬 It should eat ten sweets.'] },
      act: '💫 Spin your finger (dizzy!), then rest on a pillow!'
    },
    {
      id: 'skeleton', name: 'Bones', kind: 'white skeleton', temp: '37.0°C', badge: '🦴 Tired Legs',
      symImg: 'art/sym_bones.webp', cureImg: 'art/cure_milk.webp',
      symptomIcon: '🦴', causeIcon: '💃', cureIcon: '🥛',
      chart3: {
        symptom: 'It is hungry and its legs hurt.',
        detail: 'It danced all night!',
        cure: 'Give it healthy milk and a chair!',
        result: 'Now Bones is strong again!'
      },
      chart4: {
        symptom: 'Its legs and knees hurt',
        cause: 'because it danced for five hours at the party.',
        state: 'It needs calcium for strong bones.',
        should: 'It should drink a glass of milk and sit on a chair.',
        shouldnt: "It shouldn't dance or jump today!"
      },
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
        '🌡️ Symptom: It is hungry and its legs hurt.',
        '💀 Body Clue: It has got white bones and an orange scarf.',
        '💊 Cure: Give it healthy milk and a chair!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: Its legs hurt because it danced for five hours.',
        '💀 Body Clue: It wears an orange scarf and needs calcium for its bones.',
        "💊 Vet Advice: It should drink milk and rest, and it shouldn't jump today!"
      ],
      check3: { q: 'What makes Bones strong again?', right: '🥛 Healthy milk and a chair.', wrong: ['🌧️ Cold rain.', '📣 Loud shouting.'] },
      check4: { q: "Why do Bones's legs hurt?", right: '💃 Because it danced for five hours.', wrong: ['🏊 Because it swam in the sea.', '📖 Because it read a book.'] },
      act: '🦴 Rub your knees, then drink a big glass of milk!'
    },
    {
      id: 'spider', name: 'Dotty', kind: 'black spider', temp: '37.2°C', badge: '😨 Scared & Hungry',
      symImg: 'art/spider.webp', cureImg: 'art/cure_milk.webp',
      symptomIcon: '😨', causeIcon: '🔊', cureIcon: '🍎',
      chart3: {
        symptom: 'It is scared and hungry.',
        detail: 'The music was too loud!',
        cure: 'Give it fresh fruit and a quiet box!',
        result: 'Now Dotty is calm and happy!'
      },
      chart4: {
        symptom: 'It is scared and shaking',
        cause: 'because the party music was too loud.',
        state: 'It has got eight tired legs and an empty tummy.',
        should: 'It should eat fresh fruit and sleep in a quiet room.',
        shouldnt: "It shouldn't listen to loud music!"
      },
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
        '🌡️ Symptom: It is scared and hungry.',
        '🕷️ Body Clue: It is small and black with eight legs and a red bow.',
        '💊 Cure: Give it a quiet box and healthy fruit!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It is shaking because the party music was too loud.',
        '🕷️ Body Clue: It has got eight legs and wears a red bow.',
        "💊 Vet Advice: It should sleep in a quiet corner, and it shouldn't hear loud noises!"
      ],
      check3: { q: "What's the matter with Dotty?", right: '😨 It is scared and hungry.', wrong: ['🥵 It is too hot.', '🪽 It has got wings.'] },
      check4: { q: 'Why is Dotty scared and shaking?', right: '🔊 Because the party music was too loud.', wrong: ['🍎 Because it ate apples.', '🎀 Because it wore a red bow.'] },
      act: '😨 Shake like you are scared, then take a deep breath!'
    },
    {
      id: 'orangecat', name: 'Ginger', kind: 'orange cat', temp: '38.4°C', badge: '🐾 Hurt Paw',
      symImg: 'art/sym_paw.webp', cureImg: 'art/cure_bandage.webp',
      symptomIcon: '🐾', causeIcon: '🧱', cureIcon: '🩹',
      chart3: {
        symptom: 'Its paw hurts and it is thirsty.',
        detail: 'It jumped off a high wall!',
        cure: 'Put a bandage on its paw and give it water!',
        result: 'Now Ginger can purr!'
      },
      chart4: {
        symptom: 'It has got a sore paw',
        cause: 'because it jumped off a high garden wall.',
        state: "It can't run or jump today.",
        should: 'It should wear a clean bandage and drink fresh water.',
        shouldnt: "It shouldn't climb high walls this week!"
      },
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
        '🌡️ Symptom: Its paw hurts and it is thirsty.',
        '🐈 Body Clue: It is an orange cat with a fluffy tail.',
        '💊 Cure: Put a bandage on its paw and give it water!'
      ],
      clues4: [
        '🌡️ Symptom & Cause: It has got a sore paw because it jumped off a high wall.',
        '🐈 Body Clue: It is an orange and white cat with a fluffy tail.',
        "💊 Vet Advice: It should wear a clean bandage, and it shouldn't climb high walls!"
      ],
      check3: { q: 'Where does Ginger need a bandage?', right: '🐾 On its paw.', wrong: ['🪽 On its wings.', '🎩 On its hat.'] },
      check4: { q: "Why does Ginger's paw hurt?", right: '🧱 Because it jumped off a high garden wall.', wrong: ['💧 Because it drank fresh water.', '🛌 Because it slept on a pillow.'] },
      act: '🐾 Hold up one paw, then wrap a bandage around it!'
    }
  ];

  // Step 4 (PPP Controlled Practice): 2-Part Medicine Cabinet + Grammar Slot Check (with 3D cure pictures!)
  var PRACTICE = {
    3: [
      {
        pet: 'cat', problem: 'Shadow has got a tummy ache and is tired!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '💧 Give it warm water and a soft bed!', rightImg: 'art/cure_water.webp',
        wrong: ['🍬 Give it ten more sweets!', '🌧️ Put it outside in the rain!', '🥁 Play a loud drum!'],
        grammarQ: 'Step 2 (Grammar): Complete the sentence → "Shadow ___ a tummy ache."',
        grammarRight: 'has got',
        grammarOpts: ['has got', 'is', 'can'],
        grammarFull: 'Shadow has got a tummy ache. Give it warm water!'
      },
      {
        pet: 'bat', problem: 'Flappy is freezing cold and its wing hurts!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '🧣 Give it a warm blanket and a bandage!', rightImg: 'art/cure_blanket.webp',
        wrong: ['🍦 Give it cold ice cream!', '🏊 Tell it to swim!', '💨 Put it in the cold wind!'],
        grammarQ: 'Step 2 (Grammar): Complete the sentence → "___ it a warm blanket!"',
        grammarRight: 'Give',
        grammarOpts: ['Give', 'Has', 'Is'],
        grammarFull: 'Flappy is cold. Give it a warm blanket and a bandage!'
      },
      {
        pet: 'ghost', problem: 'Boo is thirsty and has got a sore throat!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '🍵 Give it warm honey tea!', rightImg: 'art/cure_tea.webp',
        wrong: ['📣 Tell it to shout louder!', '🧊 Give it ice cubes!', '🏃 Tell it to run fast!'],
        grammarQ: 'Step 2 (Grammar): Complete the question → "What\'s the ___ with Boo?"',
        grammarRight: 'matter',
        grammarOpts: ['matter', 'colour', 'name'],
        grammarFull: "What's the matter with Boo? It has got a sore throat!"
      },
      {
        pet: 'pumpkin', problem: 'Pumpy is dizzy and muddy after rolling down a hill!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '🧼 Wash it with water and give it a pillow!', rightImg: 'art/cure_pillow.webp',
        wrong: ['⛰️ Roll it down the hill again!', '🍫 Give it sticky chocolate!', '🎵 Play loud music!'],
        grammarQ: 'Step 2 (Grammar): Complete the sentence → "Pumpy ___ dizzy and muddy."',
        grammarRight: 'is',
        grammarOpts: ['is', 'has got', 'can'],
        grammarFull: 'Pumpy is dizzy and muddy. Wash it with clean water!'
      },
      {
        pet: 'skeleton', problem: 'Bones is hungry and its legs hurt!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '🥛 Give it healthy milk and a chair!', rightImg: 'art/cure_milk.webp',
        wrong: ['💃 Tell it to dance for 5 hours!', '❄️ Put snow on its head!', '🍭 Give it only lollipops!'],
        grammarQ: 'Step 2 (Grammar): Complete the cure → "___ it healthy milk!"',
        grammarRight: 'Give',
        grammarOpts: ['Give', 'What', 'Has'],
        grammarFull: 'Its legs hurt. Give it healthy milk and a chair!'
      },
      {
        pet: 'orangecat', problem: 'Ginger is thirsty and its paw hurts!',
        q: 'Step 1 (CLIL): Choose the right treatment from the Medicine Cabinet:',
        right: '🩹 Put a bandage on its paw and give it water!', rightImg: 'art/cure_bandage.webp',
        wrong: ['🧱 Tell it to jump off a high wall!', '🌶️ Give it spicy crisps!', '🎺 Blow a loud horn!'],
        grammarQ: 'Step 2 (Grammar): Complete the result → "Now Ginger ___ happy and healthy!"',
        grammarRight: 'is',
        grammarOpts: ['is', 'has', 'give'],
        grammarFull: 'Put a bandage on its paw! Now Ginger is happy and healthy!'
      }
    ],
    4: [
      {
        pet: 'cat', problem: 'Shadow has got a stomach ache because it ate ten sweets.',
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "💧 It should drink warm water, and it shouldn't eat sweets!", rightImg: 'art/cure_water.webp',
        wrong: ['🍬 It should eat more chocolate and jump high!', "🏃 It should run outside, and it shouldn't rest!", '🧊 It should drink icy cola at midnight!'],
        grammarQ: 'Step 2 (Grammar): "It has got a stomach ache ___ it ate ten sweets."',
        grammarRight: 'because',
        grammarOpts: ['because', 'should', 'but'],
        grammarFull: 'It has got a stomach ache because it ate ten sweets!'
      },
      {
        pet: 'bat', problem: 'Flappy has got a cold and a sore wing because it flew in the rain.',
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "🧣 It should wear a warm blanket, and it shouldn't fly in the wind!", rightImg: 'art/cure_blanket.webp',
        wrong: ["🌧️ It should fly in the storm, and it shouldn't sleep!", '🍦 It should eat cold ice cream for breakfast!', '🏊 It should go swimming in the river!'],
        grammarQ: 'Step 2 (Grammar): "It ___ wear a warm blanket and rest its wing."',
        grammarRight: 'should',
        grammarOpts: ['should', "shouldn't", 'because'],
        grammarFull: 'It should wear a warm blanket and rest its wing!'
      },
      {
        pet: 'ghost', problem: 'Boo has got a sore throat because it shouted "BOO!" all night.',
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "🍵 It should drink warm honey tea, and it shouldn't shout!", rightImg: 'art/cure_tea.webp',
        wrong: ["🎤 It should sing loud rock songs, and it shouldn't drink water!", '🧊 It should eat snow and shout at the moon!', '🏃 It should race in the garden!'],
        grammarQ: 'Step 2 (Grammar): "Warning: It ___ shout or drink cold juice!"',
        grammarRight: "shouldn't",
        grammarOpts: ["shouldn't", 'should', 'because'],
        grammarFull: "It should drink warm honey tea, and it shouldn't shout!"
      },
      {
        pet: 'pumpkin', problem: 'Pumpy feels dizzy because it rolled down a big hill too fast.',
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "🛏️ It should rest on a soft pillow, and it shouldn't roll down hills!", rightImg: 'art/cure_pillow.webp',
        wrong: ["🎢 It should spin round and round, and it shouldn't sit down!", '🍬 It should eat twenty sour sweets!', '🧗 It should climb a tall tree!'],
        grammarQ: 'Step 2 (Grammar): "It feels dizzy ___ it rolled down a big hill."',
        grammarRight: 'because',
        grammarOpts: ['because', 'should', 'than'],
        grammarFull: 'It feels dizzy because it rolled down a big hill!'
      },
      {
        pet: 'skeleton', problem: "Bones's legs hurt because it danced for five hours at the party.",
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "🥛 It should drink milk for strong bones, and it shouldn't dance today!", rightImg: 'art/cure_milk.webp',
        wrong: ["💃 It should dance all night again, and it shouldn't sit!", '🍬 It should only eat sugar and never sleep!', '🦘 It should jump over ten fences!'],
        grammarQ: 'Step 2 (Grammar): "It ___ drink milk for strong bones."',
        grammarRight: 'should',
        grammarOpts: ['should', "shouldn't", 'because'],
        grammarFull: "It should drink milk for strong bones, and it shouldn't dance today!"
      },
      {
        pet: 'orangecat', problem: "Ginger's paw hurts because it jumped off a high garden wall.",
        q: 'Step 1 (CLIL): Choose the best Vet Prescription:',
        right: "🩹 It should wear a clean bandage, and it shouldn't climb high walls!", rightImg: 'art/cure_bandage.webp',
        wrong: ["🧗 It should climb the roof, and it shouldn't wear a bandage!", '🎸 It should play football with its sore paw!', '🌊 It should swim in cold water!'],
        grammarQ: 'Step 2 (Grammar): "Warning: It ___ climb high walls this week!"',
        grammarRight: "shouldn't",
        grammarOpts: ["shouldn't", 'should', 'because'],
        grammarFull: "It should wear a clean bandage, and it shouldn't climb high walls!"
      }
    ]
  };

  // Step 5 (Production Prep): Interactive Visual Builder with 3D Image Map
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

  var IMG_MAP = {
    'black cat': 'art/cat.webp', 'purple bat': 'art/bat.webp', 'white ghost': 'art/ghost.webp', 'orange pumpkin': 'art/pumpkin.webp',
    skeleton: 'art/skeleton.webp', 'small spider': 'art/spider.webp', 'orange cat': 'art/orangecat.webp', 'baby dragon': 'art/bat.webp',
    'a tummy ache': 'art/sym_tummy.webp', 'a sore throat': 'art/sym_throat.webp', 'a cold': 'art/sym_cold.webp',
    'a hurt wing': 'art/sym_cold.webp', 'a sore paw': 'art/sym_paw.webp', 'tired legs': 'art/sym_bones.webp',
    'dizzy eyes': 'art/sym_dizzy.webp', 'a fever': 'art/sym_tummy.webp',
    'warm water': 'art/cure_water.webp', 'warm honey tea': 'art/cure_tea.webp', 'healthy milk': 'art/cure_milk.webp',
    'fresh fruit': 'art/cure_milk.webp', 'a warm blanket': 'art/cure_blanket.webp', 'a clean bandage': 'art/cure_bandage.webp',
    'a soft pillow': 'art/cure_pillow.webp', 'a quiet bed': 'art/cure_pillow.webp',
    'drink warm honey tea': 'art/cure_tea.webp', 'drink water and rest': 'art/cure_water.webp',
    'wear a warm blanket': 'art/cure_blanket.webp', 'wear a clean bandage': 'art/cure_bandage.webp',
    'eat healthy fruit': 'art/cure_milk.webp', 'sleep in a quiet bed': 'art/cure_pillow.webp'
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
      '1 · Greeting: "Hello! Welcome to our Monster Vet Clinic!"',
      '2 · Patient: "Look at ___. It is a ___."',
      '3 · Problem: "It is ___ and it has got ___."',
      '4 · Cure: "Give it ___ and ___!"',
      '5 · All Together: "Now our pet is happy and healthy!"'
    ],
    4: [
      '1 · Greeting: "Hello! Welcome to our Monster Vet Clinic!"',
      '2 · Patient: "Our patient is ___, the ___."',
      '3 · Diagnosis: "It has got ___ because it ___."',
      '4 · Advice (Do): "It should ___ and ___."',
      "5 · Warning (Don't): \"It shouldn't ___! Now it feels much better!\""
    ]
  };

  var JOBS = [
    { icon: '🩺', name: 'Head Vet (Speaker)', job: 'Says the diagnosis & leads the team.' },
    { icon: '🎨', name: 'X-Ray Artist', job: 'Draws the patient, symptom & bandage.' },
    { icon: '✏️', name: 'Medical Writer', job: 'Fills in the diagnosis & care boxes.' },
    { icon: '⏱️', name: 'Clinic Manager', job: 'Watches the clock & leads Line 5.' }
  ];

  var LAB_STEPS = [
    '1. Choose your 4 Vet jobs (30s)',
    '2. Tick the symptom & draw your patient',
    '3. Fill in the Problem & Cause boxes',
    '4. Fill in the Treatment (Give it / should)',
    '5. Practise speaking together 2 times'
  ];

  var DOOR = {
    3: ['The ___ has got ___.', 'Give it ___!'],
    4: ['The ___ has got ___ because it ___.', "It should ___, and it shouldn't ___!"]
  };

  var FALLBACK_TEAMS = [
    { name: 'Team Pumpkin Vets', color: '#f97316' },
    { name: 'Team Bat Vets', color: '#a855f7' },
    { name: 'Team Ghost Vets', color: '#38bdf8' },
    { name: 'Team Spider Vets', color: '#10b981' }
  ];

  var TEAM_ICONS = ['🩺', '🏥', '💊', '🩹', '🧪', '💚'];

  window.PetShopData = {
    FORMULAS: FORMULAS,
    VOCAB: VOCAB,
    PETS: PETS,
    PRACTICE: PRACTICE,
    BUILDER: BUILDER,
    IMG_MAP: IMG_MAP,
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
