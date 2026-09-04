/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Complete 22-Phase Curriculum, Story, Vocabulary, and Interactive Config
 */

export const PHASES = [
  // ==========================================
  // PHASE 1: JUNGLE RANGER TRAINING (Activities 1-9)
  // ==========================================
  {
    id: 1,
    subActivity: 1,
    title: 'Phase 1: Ranger Training — Meet the Animals',
    category: 'training',
    badge: '🌿 TRAINING 1/9',
    instruction: 'Tap an animal to meet them!',
    narration: 'Welcome, Jungle Rangers! Tap any animal to hear its name and meet your jungle friends.',
    type: 'meet_animals',
    animals: ['rabbit', 'squirrel', 'frog', 'raccoon', 'bear', 'fox', 'owl', 'bird'],
    targetSentences: {
      rabbit: 'The rabbit lives in the green grassland.',
      squirrel: 'Suki the squirrel lives in a tall oak tree.',
      frog: 'Poppy the frog hops on cool lilypads.',
      raccoon: 'Rico the raccoon stays near the river.',
      bear: 'Boris the bear lives in the rocky mountains.',
      fox: 'Felix the fox hunts in the deep forest.',
      owl: 'Oliver the owl watches from high trees.',
      bird: 'Pip the bird sings cheerful songs.'
    }
  },
  {
    id: 1,
    subActivity: 2,
    title: 'Phase 1: Ranger Training — Find the Animal!',
    category: 'training',
    badge: '🔍 TRAINING 2/9',
    instruction: 'Find the animal in the jungle!',
    narration: 'Can you find the hidden animal? Look closely at the picture and tap it!',
    type: 'find_animal',
    rounds: [
      { target: 'rabbit', prompt: 'Find the Rabbit! 🐰', habitat: 'grassland', hint: 'Look near the tall green grass!' },
      { target: 'frog', prompt: 'Find the Frog! 🐸', habitat: 'pond', hint: 'Look on the green lilypad in the water!' },
      { target: 'squirrel', prompt: 'Find Suki the Squirrel! 🐿️', habitat: 'forest', hint: 'Look up in the oak tree branches!' },
      { target: 'bear', prompt: 'Find Boris the Bear! 🐻', habitat: 'mountain', hint: 'Look near the big mountain cave!' }
    ]
  },
  {
    id: 1,
    subActivity: 3,
    title: 'Phase 1: Ranger Training — What Does It Need?',
    category: 'training',
    badge: '💧 TRAINING 3/9',
    instruction: 'What does the animal need to survive? Tap to choose!',
    narration: 'Every animal has basic needs. What does the animal need? Tap water, food, or shelter!',
    type: 'animal_needs',
    rounds: [
      {
        animal: 'rabbit',
        emotion: 'thirsty',
        question: 'What does the rabbit need?',
        targetNeed: 'water',
        options: ['water', 'food', 'shelter'],
        consequenceSentence: 'The rabbit drinks clean water. It feels refreshed!',
        consequenceEmotion: 'drinking'
      },
      {
        animal: 'squirrel',
        emotion: 'hungry',
        question: 'What does Suki need?',
        targetNeed: 'food',
        options: ['food', 'water', 'shelter'],
        consequenceSentence: 'Suki eats crunchy acorns. She has lots of energy!',
        consequenceEmotion: 'eating'
      },
      {
        animal: 'bird',
        emotion: 'scared',
        question: 'What does the bird need?',
        targetNeed: 'shelter',
        options: ['shelter', 'water', 'food'],
        consequenceSentence: 'The bird flies into its safe twig nest. It is protected!',
        consequenceEmotion: 'safe'
      }
    ]
  },
  {
    id: 1,
    subActivity: 4,
    title: 'Phase 1: Ranger Training — Where Does It Live?',
    category: 'training',
    badge: '🗺️ TRAINING 4/9',
    instruction: 'Tap the animal, then tap its home habitat!',
    narration: 'Where does each animal live? Match the animal to its correct habitat!',
    type: 'habitats_match',
    pairs: [
      { animal: 'frog', targetHabitat: 'pond', text: 'Poppy lives in the Pond.' },
      { animal: 'raccoon', targetHabitat: 'river', text: 'Rico lives near the River.' },
      { animal: 'bear', targetHabitat: 'mountain', text: 'Boris lives in the Mountains.' },
      { animal: 'squirrel', targetHabitat: 'forest', text: 'Suki lives in the Forest.' }
    ]
  },
  {
    id: 1,
    subActivity: 5,
    title: 'Phase 1: Ranger Training — Animal Homes',
    category: 'training',
    badge: '🏠 TRAINING 5/9',
    instruction: 'Match the animal to its safe shelter!',
    narration: 'Different animals build different homes. Match each animal to its cozy shelter!',
    type: 'shelter_match',
    items: [
      { animal: 'rabbit', shelter: 'burrow', label: 'Burrow', sentence: 'The rabbit lives in an underground burrow.' },
      { animal: 'squirrel', shelter: 'tree_hollow', label: 'Tree Hollow', sentence: 'The squirrel sleeps in a tree hollow.' },
      { animal: 'bear', shelter: 'cave', label: 'Cave', sentence: 'The bear rests inside a rocky cave.' },
      { animal: 'bird', shelter: 'nest', label: 'Nest', sentence: 'The bird hatches eggs in a woven nest.' }
    ]
  },
  {
    id: 1,
    subActivity: 6,
    title: 'Phase 1: Ranger Training — What Do They Eat?',
    category: 'training',
    badge: '🍎 TRAINING 6/9',
    instruction: 'Choose the correct food for the animal!',
    narration: 'Animals need food for energy! What does each animal like to eat? Tap the right food!',
    type: 'food_match',
    rounds: [
      { animal: 'rabbit', correctFood: 'carrots_grass', wrongFoods: ['fish', 'insects'], prompt: 'What does the rabbit eat?' },
      { animal: 'frog', correctFood: 'insects', wrongFoods: ['nuts', 'leaves_grass'], prompt: 'What does the frog eat?' },
      { animal: 'squirrel', correctFood: 'nuts', wrongFoods: ['fish', 'insects'], prompt: 'What does the squirrel eat?' },
      { animal: 'butterfly', correctFood: 'nectar', wrongFoods: ['nuts', 'fish'], prompt: 'What does the butterfly eat?' }
    ]
  },
  {
    id: 1,
    subActivity: 7,
    title: 'Phase 1: Ranger Training — Predator and Prey',
    category: 'training',
    badge: '🦊 TRAINING 7/9',
    instruction: 'Identify the Predator and the Prey!',
    narration: 'A predator hunts for food. Prey is the animal being hunted. Look at the scene and tap who is the predator and who is the prey!',
    type: 'predator_prey',
    scenarios: [
      {
        predator: 'fox',
        prey: 'rabbit',
        predatorSentence: 'The Fox is the PREDATOR. The fox hunts.',
        preySentence: 'The Rabbit is the PREY. The rabbit hides.',
        environment: 'grassland'
      },
      {
        predator: 'eagle',
        prey: 'fish',
        predatorSentence: 'The Eagle is the PREDATOR. The eagle dives.',
        preySentence: 'The Fish is the PREY. The fish swims away.',
        environment: 'river'
      }
    ]
  },
  {
    id: 1,
    subActivity: 8,
    title: 'Phase 1: Ranger Training — Build a Food Chain',
    category: 'training',
    badge: '🔗 TRAINING 8/9',
    instruction: 'Tap and put the food chain in order: Plant ➔ Herbivore ➔ Predator!',
    narration: 'Energy moves through the jungle in a Food Chain! Put the items in order: Plant first, then Prey, then Predator!',
    type: 'food_chain_builder',
    chains: [
      {
        slots: ['Plant 🌱', 'Rabbit 🐰', 'Fox 🦊'],
        items: [
          { id: 'plant', name: 'Green Plant', icon: '🌱', type: 'plant' },
          { id: 'rabbit', name: 'Rabbit', icon: '🐰', type: 'herbivore' },
          { id: 'fox', name: 'Fox', icon: '🦊', type: 'predator' }
        ],
        sentence: 'Plant gives energy to Rabbit ➔ Rabbit gives energy to Fox.'
      }
    ]
  },
  {
    id: 1,
    subActivity: 9,
    title: 'Phase 1: Ranger Training — What is a Habitat?',
    category: 'training',
    badge: '🌍 TRAINING 9/9',
    instruction: 'Tap the 4 things every habitat must have!',
    narration: 'A habitat is a natural home. It must give animals Food, Water, Shelter, and Space!',
    type: 'habitat_concept',
    targetItems: ['food', 'water', 'shelter', 'space'],
    distractors: ['television', 'plastic_toys'],
    definition: 'HABITAT = A place where an animal lives with Food, Water, and Shelter.'
  },

  // ==========================================
  // PHASE 2: VISUAL VOCABULARY REVIEW
  // ==========================================
  {
    id: 2,
    title: 'Phase 2: Visual Vocabulary Review',
    category: 'review',
    badge: '⭐ VOCABULARY',
    instruction: 'Match the picture to the word!',
    narration: 'Great job, Ranger! Let’s review our key jungle words. Match each picture to the correct word!',
    type: 'vocab_review',
    cards: [
      { word: 'WATER', icon: '💧', sentence: 'Animals drink clean water.' },
      { word: 'FOOD', icon: '🍎', sentence: 'Food gives animals energy.' },
      { word: 'SHELTER', icon: '🏠', sentence: 'Shelter protects animals.' },
      { word: 'HABITAT', icon: '🌳', sentence: 'A habitat is a home for living things.' },
      { word: 'PREDATOR', icon: '🦊', sentence: 'A predator hunts other animals.' },
      { word: 'PREY', icon: '🐰', sentence: 'Prey is hunted by predators.' }
    ]
  },

  // ==========================================
  // PHASE 3: THE STORY BEGINS
  // ==========================================
  {
    id: 3,
    title: 'Phase 3: The Story Begins',
    category: 'story',
    badge: '📖 MISSION BRIEF',
    instruction: 'Welcome, Jungle Rangers! Tap anywhere to begin your mission.',
    narration: 'Welcome to the Great Green Jungle! The animals are happy, the water is clean, and the ecosystem is healthy. You are now official Jungle Rangers!',
    type: 'story_intro',
    habitat: 'forest',
    healthPercent: 100,
    rangers: ['Suki', 'Poppy', 'Rico', 'Boris'],
    dialogue: [
      { speaker: 'Ranger Leader', text: 'Our mission is to explore, protect the animals, and keep the jungle healthy!' }
    ]
  },

  // ==========================================
  // PHASE 4: THE GREAT STORM
  // ==========================================
  {
    id: 4,
    title: 'Phase 4: The Great Storm',
    category: 'story_crisis',
    badge: '🌩️ CRISIS ALERT',
    instruction: 'Watch what happens! A big storm arrives!',
    narration: 'Look at the sky! Dark clouds roll in. Strong wind howls! Heavy rain pours down. A big storm has hit the jungle!',
    type: 'storm_cinematic',
    habitat: 'forest',
    stormStages: ['Dark Clouds Roll In', 'Strong Wind Blows', 'Lightning & Heavy Rain', 'Fallen Branches & Mud'],
    sentence: 'A big storm is damaging the jungle!'
  },

  // ==========================================
  // PHASE 5: RANGER DETECTIVE
  // ==========================================
  {
    id: 5,
    title: 'Phase 5: Ranger Detective',
    category: 'investigation',
    badge: '🔎 DETECTIVE',
    instruction: 'Use your magnifying glass to find 4 damaged spots!',
    narration: 'The storm has passed, but the jungle is in trouble! Put on your detective badge and find 4 problems in the forest.',
    type: 'ranger_detective',
    habitat: 'forest',
    clues: [
      { id: 'clue_shelter', title: 'Broken Tree Branch', x: 28, y: 55, text: 'Suki’s tree nest fell down! Her shelter is broken.', icon: '🪹' },
      { id: 'clue_water', title: 'Muddy Dirty Water', x: 55, y: 78, text: 'The river is full of brown mud and fallen branches.', icon: '🪵' },
      { id: 'clue_food', title: 'Scattered Acorns', x: 42, y: 68, text: 'The food is washed away! Animals are hungry.', icon: '🌰' },
      { id: 'clue_plants', title: 'Torn Berry Bushes', x: 75, y: 62, text: 'The sweet berry bushes are ripped apart by wind.', icon: '🫐' }
    ]
  },

  // ==========================================
  // PHASE 6: SUKI'S PROBLEM
  // ==========================================
  {
    id: 6,
    title: 'Phase 6: Suki’s Shelter Problem',
    category: 'rescue',
    badge: '🐿️ SUKI’S RESCUE',
    instruction: 'Help Suki the squirrel rebuild her safe home!',
    narration: 'Suki the squirrel is shivering and worried. Her tree hollow was broken by the storm. Let’s help Suki restore her shelter!',
    type: 'suki_rescue',
    character: 'squirrel',
    startEmotion: 'worried',
    endEmotion: 'happy',
    steps: [
      { id: 'clear_branches', prompt: 'Tap to clear broken branches!', icon: '🪵', label: 'Clear debris' },
      { id: 'rebuild_nest', prompt: 'Tap soft leaves to rebuild her nest!', icon: '🍃', label: 'Weave warm nest' },
      { id: 'gather_acorns', prompt: 'Tap to store dry acorns!', icon: '🌰', label: 'Store acorns' }
    ],
    outcomeSentence: 'Suki is safe and warm in her cozy tree nest!'
  },

  // ==========================================
  // PHASE 7: RICO'S RIVER
  // ==========================================
  {
    id: 7,
    title: 'Phase 7: Rico’s Dirty River',
    category: 'rescue',
    badge: '🦝 RICO’S RESCUE',
    instruction: 'Clean the dirty river for Rico and the fish!',
    narration: 'Rico the raccoon cannot drink muddy water, and Finny the fish is struggling! Tap the trash and mud to clean the river.',
    type: 'rico_rescue',
    character: 'raccoon',
    startEmotion: 'thirsty',
    endEmotion: 'happy',
    debrisCount: 4,
    debrisItems: [
      { id: 'mud1', name: 'Mud Clump', x: 30, y: 65, icon: '🟤' },
      { id: 'log1', name: 'Fallen Log', x: 48, y: 55, icon: '🪵' },
      { id: 'mud2', name: 'Muddy Driftwood', x: 68, y: 70, icon: '🟫' },
      { id: 'stones', name: 'Place Clean Stones', x: 50, y: 80, icon: '🪨' }
    ],
    outcomeSentence: 'The river is crystal clean! Rico drinks fresh water and fish swim happily.'
  },

  // ==========================================
  // PHASE 8: POPPY'S POND
  // ==========================================
  {
    id: 8,
    title: 'Phase 8: Poppy’s Drying Pond',
    category: 'prediction_action',
    badge: '🐸 POPPY’S POND',
    instruction: 'Predict what might happen, then open the water flow!',
    narration: 'The storm blocked the stream! Poppy’s pond is drying up. What might happen if there is no water?',
    type: 'poppy_pond',
    character: 'frog',
    startEmotion: 'scared',
    endEmotion: 'excited',
    prediction: {
      question: 'What MIGHT happen if the pond dries up?',
      options: [
        { text: 'The frog might lose its water and home.', correct: true, feedback: 'Correct! Frogs need wet ponds to breathe and live.' },
        { text: 'The frog might fly to the clouds.', correct: false, feedback: 'Frogs cannot fly into clouds!' }
      ]
    },
    actionPrompt: 'Tap the blocked rock to let fresh water flow into the pond!',
    outcomeSentence: 'Fresh water fills the pond! Poppy leaps high on the green lilypad.'
  },

  // ==========================================
  // PHASE 9: BORIS'S FOOD PROBLEM
  // ==========================================
  {
    id: 9,
    title: 'Phase 9: Boris’s Food Problem',
    category: 'ecosystem_links',
    badge: '🐻 BORIS’S FOOD',
    instruction: 'Replant berry bushes and clear the fish stream for Boris!',
    narration: 'Boris the big brown bear is hungry. The storm destroyed the wild berry bushes! Let’s trace where Boris gets his food and replant the bushes.',
    type: 'boris_food',
    character: 'bear',
    startEmotion: 'hungry',
    endEmotion: 'happy',
    steps: [
      { id: 'plant_bush', prompt: 'Plant new berry seeds!', icon: '🌱' },
      { id: 'water_bush', prompt: 'Water the berry bushes!', icon: '💧' },
      { id: 'salmon_stream', prompt: 'Guide salmon up the stream!', icon: '🐟' }
    ],
    outcomeSentence: 'Boris has sweet berries and fresh salmon to eat!'
  },

  // ==========================================
  // PHASE 10: FEED THE ANIMALS
  // ==========================================
  {
    id: 10,
    title: 'Phase 10: Feed the Hungry Animals',
    category: 'diet_matching',
    badge: '🍎 FEEDING TIME',
    instruction: 'Give each animal its correct nutritious food!',
    narration: 'All the animals are recovering from the storm. Match each hungry animal with its favorite food to fill their energy bars!',
    type: 'feed_animals',
    animalsToFeed: [
      { animal: 'rabbit', targetFood: 'carrots_grass', label: 'Carrot & Grass' },
      { animal: 'squirrel', targetFood: 'nuts', label: 'Acorns & Nuts' },
      { animal: 'frog', targetFood: 'insects', label: 'Flying Insects' },
      { animal: 'bird', targetFood: 'seeds', label: 'Sweet Berries & Seeds' }
    ],
    outcomeSentence: 'All the animals are full and energized!'
  },

  // ==========================================
  // PHASE 11: STORY SEQUENCING
  // ==========================================
  {
    id: 11,
    title: 'Phase 11: Put the Story in Order',
    category: 'sequencing',
    badge: '🔢 SEQUENCING',
    instruction: 'Tap and order the 5 story cards from first to last!',
    narration: 'What happened first? What happened next? Tap each story card and place it in the correct order (1 to 5).',
    type: 'story_sequencing',
    cards: [
      { step: 1, text: '1. A big storm hits the jungle.', icon: '🌩️' },
      { step: 2, text: '2. Trees and shelters are damaged.', icon: '🪹' },
      { step: 3, text: '3. Animals lose food and clean water.', icon: '💧' },
      { step: 4, text: '4. Jungle Rangers investigate and help.', icon: '🔍' },
      { step: 5, text: '5. The ecosystem begins to heal.', icon: '🌿' }
    ]
  },

  // ==========================================
  // PHASE 12: THE BIGGER PROBLEM — FEWER PLANTS
  // ==========================================
  {
    id: 12,
    title: 'Phase 12: The Bigger Problem — Fewer Plants',
    category: 'cause_effect',
    badge: '🌱 BIG PROBLEM',
    instruction: 'Discover what happens when plants disappear!',
    narration: 'Look at the whole jungle. What happens if there are fewer plants? Let’s predict the chain reaction!',
    type: 'cause_effect_plants',
    questions: [
      {
        question: 'If there are fewer plants, what happens to Rabbits?',
        options: [
          { text: 'Rabbits have LESS food.', correct: true },
          { text: 'Rabbits have MORE food.', correct: false }
        ],
        explanation: 'Rabbits eat plants. Fewer plants means less food for rabbits!'
      },
      {
        question: 'If there are fewer rabbits, what happens to Foxes?',
        options: [
          { text: 'Foxes have LESS prey to hunt.', correct: true },
          { text: 'Foxes start swimming like fish.', correct: false }
        ],
        explanation: 'Foxes hunt rabbits. Without rabbits, predators struggle too!'
      }
    ]
  },

  // ==========================================
  // PHASE 13: FOOD CHAIN CHALLENGE
  // ==========================================
  {
    id: 13,
    title: 'Phase 13: Food Chain Challenge',
    category: 'food_chain_sim',
    badge: '🔗 CHAIN CHALLENGE',
    instruction: 'Rebuild the food chain, then test what happens if one link is removed!',
    narration: 'Build the full jungle food chain. Then tap the scissors to see what happens when one link is broken!',
    type: 'food_chain_challenge',
    chain: [
      { id: 'sun', name: 'Sunlight ☀️', role: 'Energy Source' },
      { id: 'plants', name: 'Green Plants 🌱', role: 'Producer' },
      { id: 'caterpillar', name: 'Insects 🐛', role: 'Primary Consumer (Prey)' },
      { id: 'frog', name: 'Poppy the Frog 🐸', role: 'Secondary Consumer' },
      { id: 'owl', name: 'Oliver the Owl 🦉', role: 'Top Predator' }
    ]
  },

  // ==========================================
  // PHASE 14: ECOSYSTEM WEB OF LIFE
  // ==========================================
  {
    id: 14,
    title: 'Phase 14: Ecosystem Connection — Web of Life',
    category: 'web_of_life',
    badge: '🕸️ WEB OF LIFE',
    instruction: 'Tap any element to see how everything is connected!',
    narration: 'In a healthy jungle, all living things depend on each other. Tap Plants, Water, Shelter, or Animals to see glowing connections!',
    type: 'web_of_life',
    nodes: [
      { id: 'plants', label: 'Plants 🌱', connectsTo: ['herbivores', 'water', 'shelter'], sentence: 'Plants produce oxygen, food, and shelter.' },
      { id: 'water', label: 'Clean Water 💧', connectsTo: ['plants', 'herbivores', 'carnivores'], sentence: 'Water keeps all plants and animals alive.' },
      { id: 'herbivores', label: 'Prey Animals 🐰', connectsTo: ['carnivores', 'plants'], sentence: 'Prey animals eat plants and support predators.' },
      { id: 'carnivores', label: 'Predators 🦊', connectsTo: ['herbivores'], sentence: 'Predators balance the animal population.' },
      { id: 'shelter', label: 'Shelters 🏠', connectsTo: ['herbivores', 'carnivores'], sentence: 'Shelters protect animals from bad weather.' }
    ]
  },

  // ==========================================
  // PHASE 15: RANGER PREDICTION MACHINE
  // ==========================================
  {
    id: 15,
    title: 'Phase 15: Ranger Prediction Machine',
    category: 'prediction_machine',
    badge: '🔮 PREDICTION LAB',
    instruction: 'Use IF, WILL, MIGHT, and BECAUSE to predict outcomes!',
    narration: 'Step into the Ranger Science Lab! Choose a condition, pick your modal verb (MIGHT / WILL), and press RUN SIMULATION to see what happens!',
    type: 'prediction_machine',
    scenarios: [
      {
        id: 'pred1',
        condition: 'IF the river is polluted with mud...',
        modalOptions: ['WILL', 'MIGHT', 'WON’T'],
        outcomeOptions: [
          'fish cannot breathe clean water.',
          'trees turn into gold.',
          'birds grow flippers.'
        ],
        correctModal: 'WILL',
        correctOutcome: 'fish cannot breathe clean water.',
        sentenceResult: 'If the river is polluted with mud, fish WILL NOT be able to breathe clean water.',
        simulationAnim: 'river_mud_sim'
      },
      {
        id: 'pred2',
        condition: 'IF rangers plant new trees...',
        modalOptions: ['MIGHT', 'WILL', 'COULD'],
        outcomeOptions: [
          'birds and squirrels will have more shelters.',
          'it will rain chocolate.',
          'the sun will disappear.'
        ],
        correctModal: 'WILL',
        correctOutcome: 'birds and squirrels will have more shelters.',
        sentenceResult: 'If rangers plant new trees, birds and squirrels WILL have more shelters and food!',
        simulationAnim: 'tree_grow_sim'
      }
    ]
  },

  // ==========================================
  // PHASE 16: BEFORE / AFTER EXPLORER
  // ==========================================
  {
    id: 16,
    title: 'Phase 16: Before & After Comparison',
    category: 'comparison',
    badge: '🔄 BEFORE / AFTER',
    instruction: 'Drag or tap the slider to compare Damaged vs Healthy jungle!',
    narration: 'Look at the differences between the damaged jungle and the healthy jungle. Tap the tags to spot the changes!',
    type: 'before_after',
    spots: [
      { name: 'Water Quality', before: 'Clean, sparkling blue river', after: 'Muddy, clogged river', icon: '💧' },
      { name: 'Animal Shelters', before: 'Cozy tree hollows & burrows', after: 'Broken branches & collapsed nests', icon: '🏠' },
      { name: 'Food Supply', before: 'Abundant berries, seeds, & fish', after: 'Washed-away seeds & torn bushes', icon: '🍎' }
    ]
  },

  // ==========================================
  // PHASE 17: EMERGENCY SIMULATOR
  // ==========================================
  {
    id: 17,
    title: 'Phase 17: Emergency Simulator',
    category: 'fast_triage',
    badge: '🚨 EMERGENCY',
    instruction: 'Quick! Solve 3 urgent ranger emergencies!',
    narration: 'Ranger Alert! Fast action needed! Choose the best tool and action for each emergency before time runs out!',
    type: 'emergency_simulator',
    emergencies: [
      {
        id: 'em1',
        title: 'Emergency 1: Dry Pond!',
        animal: 'frog',
        prompt: 'Poppy’s pond stream is blocked with heavy rocks!',
        actionChoice: ['Move rocks with Ranger Lever 🪨', 'Pour juice in pond 🧃'],
        correctIndex: 0,
        result: 'Water rushes in! Poppy jumps with joy!'
      },
      {
        id: 'em2',
        title: 'Emergency 2: Blocked Burrow!',
        animal: 'rabbit',
        prompt: 'A fallen branch is blocking Bella’s underground burrow!',
        actionChoice: ['Lift branch with Ranger Rope 🪵', 'Eat a carrot 🥕'],
        correctIndex: 0,
        result: 'The burrow is clear! Bella hops safely inside!'
      },
      {
        id: 'em3',
        title: 'Emergency 3: Lost Bird Nest!',
        animal: 'bird',
        prompt: 'Pip’s twig nest fell out of the high tree branch!',
        actionChoice: ['Place nest in secure tree branch 🪹', 'Hide in the mud 🟤'],
        correctIndex: 0,
        result: 'The nest is safely anchored! Pip sings happily!'
      }
    ]
  },

  // ==========================================
  // PHASE 18: FINAL ECOSYSTEM CRISIS
  // ==========================================
  {
    id: 18,
    title: 'Phase 18: Final Ecosystem Crisis Status',
    category: 'triage_overview',
    badge: '⚠️ CRISIS 25%',
    instruction: 'Check the 5 zones of the jungle. Health is at 25%!',
    narration: 'The jungle health meter is at 25%. All 5 zones need our help to be completely restored!',
    type: 'crisis_status',
    zones: [
      { name: 'Forest Trees', status: 'Damaged (30%)', icon: '🌲', need: 'Plant oak seedlings' },
      { name: 'River Water', status: 'Muddy (20%)', icon: '🌊', need: 'Filter river mud' },
      { name: 'Lily Pond', status: 'Low Water (25%)', icon: '🐸', need: 'Restore stream channel' },
      { name: 'Grassland Meadow', status: 'Torn Plants (35%)', icon: '🌾', need: 'Scatter wildflower seeds' },
      { name: 'Mountain Cliffs', status: 'Debris (20%)', icon: '⛰️', need: 'Replant berry slopes' }
    ]
  },

  // ==========================================
  // PHASE 19: RESTORE THE ECOSYSTEM
  // ==========================================
  {
    id: 19,
    title: 'Phase 19: Restore the Ecosystem',
    category: 'restoration',
    badge: '🛠️ RESTORATION',
    instruction: 'Perform the 5 restoration actions to bring the jungle to 100% health!',
    narration: 'Let’s restore the jungle! Tap each tool to plant seeds, clean the river, build shelters, and protect the wildlife.',
    type: 'full_restoration',
    actions: [
      { id: 'plant_trees', name: 'Plant 10 Oak Seedlings 🌱', icon: '🌱', boost: 15, message: 'New trees are sprouting green leaves!' },
      { id: 'clean_water', name: 'Install River Stone Filter 🪨', icon: '💧', boost: 15, message: 'The river is sparkling clean again!' },
      { id: 'restore_pond', name: 'Refill Pond & Lilypads 🪷', icon: '🐸', boost: 15, message: 'Lilypads float on deep cool water!' },
      { id: 'meadow_flowers', name: 'Scatter Wildflower Seeds 🌸', icon: '🌸', boost: 15, message: 'Butterflies and bees return to blooming flowers!' },
      { id: 'shelter_repairs', name: 'Secure Dens & Nests 🏠', icon: '🏠', boost: 15, message: 'All animals have safe, warm shelters!' }
    ]
  },

  // ==========================================
  // PHASE 20: JUNGLE SAVED! CELEBRATION
  // ==========================================
  {
    id: 20,
    title: 'Phase 20: 🌿 JUNGLE SAVED!',
    category: 'celebration',
    badge: '🎉 CELEBRATION',
    instruction: 'Celebration time! The jungle is fully restored!',
    narration: 'JUNGLE SAVED! Look at the green trees, sparkling clean water, and happy animals! You are an amazing Jungle Ranger!',
    type: 'celebration',
    healthPercent: 100,
    cheeringAnimals: ['squirrel', 'frog', 'raccoon', 'bear', 'rabbit', 'fox', 'owl', 'bird', 'butterfly', 'deer'],
    award: 'JUNGLE RANGER GOLD MEDAL 🥇'
  },

  // ==========================================
  // PHASE 21: FINAL PREDICTION
  // ==========================================
  {
    id: 21,
    title: 'Phase 21: Final Prediction — The Future Jungle',
    category: 'future_prediction',
    badge: '🔮 FUTURE PREDICTION',
    instruction: 'Complete the predictions for the healthy jungle!',
    narration: 'Now that the ecosystem is healthy, what will happen in the future? Choose the best words to complete the sentences!',
    type: 'final_prediction',
    sentences: [
      {
        template: 'In the future, the plants ______ healthy and green.',
        options: ['will grow', 'will disappear'],
        correct: 'will grow'
      },
      {
        template: 'The animals ______ plenty of food and clean water.',
        options: ['will have', 'won’t have'],
        correct: 'will have'
      },
      {
        template: 'If we protect the habitat, the ecosystem ______ safe.',
        options: ['will stay', 'might be destroyed'],
        correct: 'will stay'
      }
    ]
  },

  // ==========================================
  // PHASE 22: FINAL RANGER REPORT & CERTIFICATE
  // ==========================================
  {
    id: 22,
    title: 'Phase 22: Official Ranger Report & Certificate',
    category: 'report',
    badge: '📜 RANGER REPORT',
    instruction: 'Fill in your Ranger Report and receive your Certificate!',
    narration: 'Complete your official Jungle Ranger Report! Choose words to finish your mission summary.',
    type: 'ranger_report',
    prompts: [
      { label: '1. I helped protect the...', options: ['animals and plants 🌿', 'broken plastic 🗑️'], correct: 'animals and plants 🌿' },
      { label: '2. All animals need food, water, and...', options: ['safe shelter 🏠', 'fast cars 🚗'], correct: 'safe shelter 🏠' },
      { label: '3. If we protect the habitat, the jungle will be...', options: ['healthy and strong 🌟', 'dry and empty 🏜️'], correct: 'healthy and strong 🌟' }
    ]
  }
];

export const SPEAKING_PROMPTS = [
  {
    id: 'spk1',
    title: 'Describe an Animal',
    animal: 'rabbit',
    stems: [
      'This is a ______ (rabbit / squirrel / frog).',
      'It lives in the ______ (grassland / forest / pond).',
      'It needs ______ (plants / water / shelter).'
    ],
    vocab: ['rabbit', 'grassland', 'plants', 'burrow', 'clean water']
  },
  {
    id: 'spk2',
    title: 'Describe a Food Chain',
    animal: 'fox',
    stems: [
      'The plant gives energy to the ______ (rabbit).',
      'The fox is the ______ (predator).',
      'The rabbit is the ______ (prey).'
    ],
    vocab: ['predator', 'prey', 'hunts', 'energy', 'food chain']
  },
  {
    id: 'spk3',
    title: 'Make a Science Prediction',
    animal: 'bear',
    stems: [
      'If there are fewer plants, animals might ______ (have less food).',
      'If the water is dirty, fish cannot ______ (breathe).',
      'We should protect the ______ (habitat).'
    ],
    vocab: ['if', 'might', 'because', 'protect', 'habitat']
  }
];
