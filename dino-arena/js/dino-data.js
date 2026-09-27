/**
 * DINO ARENA: CRETACEOUS ADAPTATIONS & CLASH — CURRICULUM & SPECIMEN DATA
 * Primary ESL / CLIL CEFR A1+–A2 | 70-Minute 2-Lesson 6-Stage Arcade Module
 * Zero procedural SVG characters. 100% Transparent 3D raster assets over glowing isometric pedestals.
 */
(function(root) {
  'use strict';

  const DINO_DATA = [
    {
      id: "trex",
      name: "Tyrannosaurus Rex",
      badge: "🥩 Apex Predator",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#ef4444",
      lengthM: 12,
      lengthMeters: 12,
      weightKg: 8000,
      speedKmh: 27,
      armorRating: 3,
      weapon: "Bone-Crushing Jaws",
      weaponDesc: "Huge 20cm serrated teeth with bone-crushing jaws!",
      teeth: "20cm serrated dagger teeth",
      clue: "I am the 8,000 kg apex predator with 20cm serrated teeth!",
      dietFact: "T-Rex is a carnivore because it has 20cm sharp teeth to hunt prey.",
      asset: "assets/trex.webp",
      fallbackAsset: "assets/trex.png",
      glowColor: "#ef4444",
      glowRgb: "239, 68, 68",
      pedestalColor: "#ef4444",
      accentColor: "#ef4444",
      hotspots: [
        { label: "Diet", text: "Carnivore: Apex hunter with keen binocular vision.", phrase: "T-Rex is a carnivore and eats meat!" },
        { label: "Weapon", text: "Bone-Crushing Jaws with 20cm serrated teeth.", phrase: "T-Rex has twenty-centimeter sharp teeth to crush bones!" },
        { label: "Speed", text: "Runs at 27 km/h across open valleys.", phrase: "T-Rex can run at twenty-seven kilometers per hour!" },
        { label: "Armor", text: "Tough hide rating 3 out of 10.", phrase: "T-Rex relies on pure attack power rather than heavy armor!" }
      ]
    },
    {
      id: "raptor",
      name: "Velociraptor",
      badge: "⚡ Swift Striker",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#f97316",
      lengthM: 2,
      lengthMeters: 2,
      weightKg: 15,
      speedKmh: 60,
      armorRating: 1,
      weapon: "Sickle Claws",
      weaponDesc: "Curved 9cm foot claws designed for swift jumping attacks!",
      teeth: "Sharp backward-curving teeth & sickle claws",
      clue: "I am a swift 60 km/h runner hunting with curved foot claws!",
      dietFact: "Velociraptor is a carnivore because it hunts meat with sharp sickle claws.",
      asset: "assets/raptor.webp",
      fallbackAsset: "assets/raptor.png",
      glowColor: "#f97316",
      glowRgb: "249, 115, 22",
      pedestalColor: "#f97316",
      accentColor: "#f97316",
      hotspots: [
        { label: "Diet", text: "Carnivore: Agile pack hunter targeting small prey.", phrase: "Velociraptor is a swift carnivore!" },
        { label: "Weapon", text: "Retractable sickle claw on each hind foot.", phrase: "Velociraptor has sharp sickle claws for jumping attacks!" },
        { label: "Speed", text: "Sprint speed of 60 km/h.", phrase: "Velociraptor runs at sixty kilometers per hour!" },
        { label: "Armor", text: "Light agile body rating 1 out of 10.", phrase: "Velociraptor relies on speed instead of heavy armor!" }
      ]
    },
    {
      id: "triceratops",
      name: "Triceratops",
      badge: "🛡️ Triple Horn Shield",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthM: 9,
      lengthMeters: 9,
      weightKg: 6000,
      speedKmh: 32,
      armorRating: 8,
      weapon: "Triple Horn Shield",
      weaponDesc: "Three sharp solid horns and a heavy neck frill for protection!",
      teeth: "Beak & scissor-like grinding tooth batteries",
      clue: "I have a massive skull shield and 3 solid ivory horns!",
      dietFact: "Triceratops is a herbivore because it shears tough palm fronds with grinding teeth.",
      asset: "assets/triceratops.webp",
      fallbackAsset: "assets/triceratops.png",
      glowColor: "#10b981",
      glowRgb: "16, 185, 129",
      pedestalColor: "#10b981",
      accentColor: "#10b981",
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on tough palms and cycad roots.", phrase: "Triceratops is a peaceful herbivore!" },
        { label: "Weapon", text: "Three solid facial horns up to 1 meter long.", phrase: "Triceratops has three hard horns to fight predators!" },
        { label: "Speed", text: "Charges at 32 km/h when threatened.", phrase: "Triceratops charges at thirty-two kilometers per hour!" },
        { label: "Armor", text: "Solid bone frill with rating 8 out of 10.", phrase: "Triceratops has a heavy bone frill to shield its neck!" }
      ]
    },
    {
      id: "brachiosaurus",
      name: "Brachiosaurus",
      badge: "🦒 Colossal Titan",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#06b6d4",
      lengthM: 26,
      lengthMeters: 26,
      weightKg: 40000,
      speedKmh: 15,
      armorRating: 4,
      weapon: "Colossal Stomp",
      weaponDesc: "Gigantic height and tree-trunk legs reaching the tallest trees!",
      teeth: "Peg-like chisel teeth for stripping tall trees",
      clue: "I weigh 40,000 kg and can browse leaves 13 meters high!",
      dietFact: "Brachiosaurus is a herbivore because it reaches tall treetops to eat leaves.",
      asset: "assets/brachiosaurus.webp",
      fallbackAsset: "assets/brachiosaurus.png",
      glowColor: "#06b6d4",
      glowRgb: "6, 182, 212",
      pedestalColor: "#06b6d4",
      accentColor: "#06b6d4",
      hotspots: [
        { label: "Diet", text: "Herbivore: Consumes 400 kg of treetop leaves daily.", phrase: "Brachiosaurus eats leafy treetops all day!" },
        { label: "Weapon", text: "Massive stomping feet and towering height.", phrase: "Brachiosaurus uses colossal size to deter carnivores!" },
        { label: "Speed", text: "Slow steady pace of 15 km/h.", phrase: "Brachiosaurus walks steadily at fifteen kilometers per hour!" },
        { label: "Armor", text: "Colossal body mass defense rating 4.", phrase: "Brachiosaurus is forty tons of pure living mountain!" }
      ]
    },
    {
      id: "ankylosaurus",
      name: "Ankylosaurus",
      badge: "🛡️ Living Battle Tank",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#eab308",
      lengthM: 8,
      lengthMeters: 8,
      weightKg: 6000,
      speedKmh: 10,
      armorRating: 10,
      weapon: "Heavy Tail Club",
      weaponDesc: "Thick fused bone armor plates and a heavy stone tail club!",
      teeth: "Small leaf-shaped teeth for crushing low ferns",
      clue: "I am a living battle tank with bone plates and a heavy tail club!",
      dietFact: "Ankylosaurus is a herbivore because it feeds on low forest ferns and shrub roots.",
      asset: "assets/ankylosaurus.webp",
      fallbackAsset: "assets/ankylosaurus.png",
      glowColor: "#eab308",
      glowRgb: "234, 179, 8",
      pedestalColor: "#eab308",
      accentColor: "#eab308",
      hotspots: [
        { label: "Diet", text: "Herbivore: Low-browser feeding on ferns and roots.", phrase: "Ankylosaurus feeds on low ferns and shrubs!" },
        { label: "Weapon", text: "Massive solid bone club on its tail.", phrase: "Ankylosaurus has a heavy tail club to shatter enemy bones!" },
        { label: "Speed", text: "Slow moving tank at 10 km/h.", phrase: "Ankylosaurus marches slowly at ten kilometers per hour!" },
        { label: "Armor", text: "Impenetrable fused bone armor rating 10/10.", phrase: "Ankylosaurus has maximum bone armor plates!" }
      ]
    },
    {
      id: "stegosaurus",
      name: "Stegosaurus",
      badge: "🐊 Spiked Guardian",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthM: 9,
      lengthMeters: 9,
      weightKg: 5000,
      speedKmh: 18,
      armorRating: 7,
      weapon: "Spiked Thagomizer",
      weaponDesc: "Four sharp tail spikes and 17 dorsal plates along its spine!",
      teeth: "Small triangular teeth for grinding soft plants",
      clue: "I have vertical kite plates along my spine and 4 sharp tail spikes!",
      dietFact: "Stegosaurus is a herbivore because it eats soft ground mosses and low shrubs.",
      asset: "assets/stegosaurus.webp",
      fallbackAsset: "assets/stegosaurus.png",
      glowColor: "#22c55e",
      glowRgb: "34, 197, 94",
      pedestalColor: "#10b981",
      accentColor: "#10b981",
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on ground ferns, mosses, and horsetails.", phrase: "Stegosaurus eats low Jurassic ferns!" },
        { label: "Weapon", text: "Four 60-centimeter tail spikes called the Thagomizer.", phrase: "Stegosaurus swings four sharp tail spikes!" },
        { label: "Speed", text: "Trots at 18 km/h.", phrase: "Stegosaurus moves at eighteen kilometers per hour!" },
        { label: "Armor", text: "17 upright bony back plates rating 7.", phrase: "Stegosaurus has seventeen upright bony plates for protection!" }
      ]
    }
  ];

  // Stage 1: Mystery Silhouette & Roar Chamber
  const MYSTERY_ROUNDS = [
    {
      id: "mystery-1",
      dinoId: "triceratops",
      title: "Prehistoric Beast #1",
      clues: [
        { icon: "🌿", label: "Diet", text: "Herbivore (Plant-Eater)" },
        { icon: "⚖️", label: "Weight", text: "6,000 kg (6 metric tons)" },
        { icon: "🛡️", label: "Weapon", text: "3 facial horns & solid bone skull frill" }
      ],
      options: ["triceratops", "trex", "raptor", "ankylosaurus"],
      soundHint: "Heavy stomps echo in the dense palm forest..."
    },
    {
      id: "mystery-2",
      dinoId: "trex",
      title: "Prehistoric Beast #2",
      clues: [
        { icon: "🥩", label: "Diet", text: "Apex Carnivore (Meat-Eater)" },
        { icon: "⚡", label: "Speed", text: "27 km/h sprint speed" },
        { icon: "🦷", label: "Weapon", text: "Huge jaws with 20cm bone-crushing teeth" }
      ],
      options: ["trex", "stegosaurus", "brachiosaurus", "raptor"],
      soundHint: "A deafening, earth-shaking roar vibrates through the canyon!"
    },
    {
      id: "mystery-3",
      dinoId: "raptor",
      title: "Prehistoric Beast #3",
      clues: [
        { icon: "🥩", label: "Diet", text: "Fast Pack-Hunting Carnivore" },
        { icon: "⚡", label: "Speed", text: "Lightning fast: 60 km/h sprint" },
        { icon: "🦅", label: "Weapon", text: "Agile body & curved sickle foot claws" }
      ],
      options: ["raptor", "triceratops", "stegosaurus", "brachiosaurus"],
      soundHint: "Rapid, agile claw clicks tap against the rocky ground..."
    },
    {
      id: "mystery-4",
      dinoId: "brachiosaurus",
      title: "Prehistoric Beast #4",
      clues: [
        { icon: "🌿", label: "Diet", text: "Towering Herbivore (Eats tall cycads)" },
        { icon: "⚖️", label: "Weight", text: "Colossal mass: 40,000 kg (Living Mountain)" },
        { icon: "🦒", label: "Height", text: "13-meter neck reaching the highest trees" }
      ],
      options: ["brachiosaurus", "ankylosaurus", "trex", "stegosaurus"],
      soundHint: "Tremendous, slow vibrations shake ancient tree trunks..."
    },
    {
      id: "mystery-5",
      dinoId: "ankylosaurus",
      title: "Prehistoric Beast #5",
      clues: [
        { icon: "🌿", label: "Diet", text: "Low-Browsing Herbivore (Fern-Eater)" },
        { icon: "🛡️", label: "Armor", text: "Impenetrable fused armor plates (Rating 10/10)" },
        { icon: "🔨", label: "Weapon", text: "Massive solid-bone club on its tail" }
      ],
      options: ["ankylosaurus", "raptor", "trex", "triceratops"],
      soundHint: "A heavy armored scrape echoes in the underbrush..."
    },
    {
      id: "mystery-6",
      dinoId: "stegosaurus",
      title: "Prehistoric Beast #6",
      clues: [
        { icon: "🌿", label: "Diet", text: "Jurassic Ground Herbivore" },
        { icon: "⚖️", label: "Weight", text: "5,000 kg with walnut-sized brain" },
        { icon: "🗡️", label: "Weapon", text: "17 upright back plates & 4 sharp tail spikes" }
      ],
      options: ["stegosaurus", "brachiosaurus", "raptor", "ankylosaurus"],
      soundHint: "Tail spikes swish swiftly through ancient ferns..."
    }
  ];

  // Stage 4: Comparative Balance Scale Gym
  const GRAMMAR_GYM_ROUNDS = [
    {
      id: "gym-1",
      dinoA: "brachiosaurus",
      dinoB: "stegosaurus",
      statLabel: "WEIGHT",
      statA: "40,000 kg",
      statB: "5,000 kg",
      tilt: "left",
      formulaTokens: ["Brachiosaurus", "is heavier than", "Stegosaurus", "."],
      distractors: ["lighter than", "fast"],
      voiceText: "Brachiosaurus is heavier than Stegosaurus."
    },
    {
      id: "gym-2",
      dinoA: "raptor",
      dinoB: "trex",
      statLabel: "SPEED",
      statA: "60 km/h",
      statB: "27 km/h",
      tilt: "left",
      formulaTokens: ["Velociraptor", "is faster than", "Tyrannosaurus Rex", "."],
      distractors: ["slower than", "heavy"],
      voiceText: "Velociraptor is faster than Tyrannosaurus Rex."
    },
    {
      id: "gym-3",
      dinoA: "brachiosaurus",
      dinoB: "triceratops",
      statLabel: "LENGTH",
      statA: "26 m",
      statB: "9 m",
      tilt: "left",
      formulaTokens: ["Brachiosaurus", "is longer than", "Triceratops", "."],
      distractors: ["shorter than", "sharp"],
      voiceText: "Brachiosaurus is longer than Triceratops."
    },
    {
      id: "gym-4",
      dinoA: "ankylosaurus",
      dinoB: "trex",
      statLabel: "ARMOR",
      statA: "Armor 10",
      statB: "Armor 3",
      tilt: "left",
      formulaTokens: ["Ankylosaurus", "has stronger armor than", "Tyrannosaurus Rex", "."],
      distractors: ["weaker than", "quick"],
      voiceText: "Ankylosaurus has stronger armor than Tyrannosaurus Rex."
    },
    {
      id: "gym-5",
      dinoA: "trex",
      dinoB: "raptor",
      statLabel: "SIZE",
      statA: "12 m / 8,000 kg",
      statB: "2 m / 15 kg",
      tilt: "left",
      formulaTokens: ["Tyrannosaurus Rex", "is bigger than", "Velociraptor", "."],
      distractors: ["smaller than", "plates"],
      voiceText: "Tyrannosaurus Rex is bigger than Velociraptor."
    }
  ];

  // Stage 5: 1v1 Cretaceous Showdown Battle Rounds
  const BATTLE_ROUNDS = [
    {
      id: "clash-1",
      dino1: "raptor",
      dino2: "trex",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "raptor",
      comparativeFrame: "Velociraptor is faster than Tyrannosaurus Rex!",
      statComparison: "Velociraptor (60 km/h) vs T-Rex (27 km/h)"
    },
    {
      id: "clash-2",
      dino1: "brachiosaurus",
      dino2: "stegosaurus",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is heavier than Stegosaurus!",
      statComparison: "Brachiosaurus (40,000 kg) vs Stegosaurus (5,000 kg)"
    },
    {
      id: "clash-3",
      dino1: "ankylosaurus",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER ARMOR!",
      winnerId: "ankylosaurus",
      comparativeFrame: "Ankylosaurus has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Ankylosaurus (Armor 10) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-4",
      dino1: "brachiosaurus",
      dino2: "triceratops",
      statKey: "lengthMeters",
      question: "Who is LONGER?",
      stampText: "LONGER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is longer than Triceratops!",
      statComparison: "Brachiosaurus (26 m) vs Triceratops (9 m)"
    },
    {
      id: "clash-5",
      dino1: "triceratops",
      dino2: "raptor",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops is heavier than Velociraptor!",
      statComparison: "Triceratops (6,000 kg) vs Velociraptor (15 kg)"
    },
    {
      id: "clash-6",
      dino1: "stegosaurus",
      dino2: "ankylosaurus",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "stegosaurus",
      comparativeFrame: "Stegosaurus is faster than Ankylosaurus!",
      statComparison: "Stegosaurus (18 km/h) vs Ankylosaurus (10 km/h)"
    },
    {
      id: "clash-7",
      dino1: "triceratops",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER ARMOR!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Triceratops (Armor 8) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-8",
      dino1: "trex",
      dino2: "raptor",
      statKey: "lengthMeters",
      question: "Who is BIGGER & LONGER?",
      stampText: "BIGGER!",
      winnerId: "trex",
      comparativeFrame: "Tyrannosaurus Rex is bigger than Velociraptor!",
      statComparison: "T-Rex (12 m) vs Velociraptor (2 m)"
    }
  ];

  // Stage 6: Teleprompter Archetypes (One per dinosaur)
  const TELEPROMPTER_ARCHETYPES = [
    {
      dinoId: "trex",
      title: "Apex Predator Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the mighty Tyrannosaurus Rex.",
      sentence2: "It is bigger and heavier than the agile Velociraptor.",
      sentence3: "It is an apex carnivore and it uses its bone-crushing jaws to hunt!"
    },
    {
      dinoId: "raptor",
      title: "Lightning Striker Broadcast",
      sentence1: "Welcome to Dino Arena! This is the swift Velociraptor.",
      sentence2: "It is much faster than the giant Tyrannosaurus Rex.",
      sentence3: "It is an agile carnivore and it uses its sickle claws to hunt in packs!"
    },
    {
      dinoId: "triceratops",
      title: "Horned Defender Broadcast",
      sentence1: "Welcome to Dino Arena! This is the armored Triceratops.",
      sentence2: "It has stronger armor than the fearsome Tyrannosaurus Rex.",
      sentence3: "It is a peaceful herbivore and it uses its triple horns to defend its family!"
    },
    {
      dinoId: "brachiosaurus",
      title: "Colossal Titan Broadcast",
      sentence1: "Welcome to Dino Arena! This is the towering Brachiosaurus.",
      sentence2: "It is heavier and longer than all other prehistoric creatures.",
      sentence3: "It is a gentle herbivore and it uses its tall neck to reach high tree leaves!"
    },
    {
      dinoId: "ankylosaurus",
      title: "Living Tank Broadcast",
      sentence1: "Welcome to Dino Arena! This is the impenetrable Ankylosaurus.",
      sentence2: "It has stronger armor than any carnivore in the Cretaceous valley.",
      sentence3: "It is a tough herbivore and it uses its heavy tail club to shatter enemy attacks!"
    },
    {
      dinoId: "stegosaurus",
      title: "Spike-Tailed Guardian Broadcast",
      sentence1: "Welcome to Dino Arena! This is the iconic Stegosaurus.",
      sentence2: "It is faster and lighter than the armored Ankylosaurus.",
      sentence3: "It is a Jurassic herbivore and it uses its sharp tail spikes to protect itself!"
    }
  ];

  // Stage 7: Exit Diagnostic Rapid Checkpoint
  const EXIT_QUIZ_QUESTIONS = [
    {
      id: "quiz-1",
      question: "Which comparative adjective correctly finishes the sentence?\n'Velociraptor is _______ than Tyrannosaurus Rex.'",
      options: [
        { text: "faster", isCorrect: true },
        { text: "fastest", isCorrect: false },
        { text: "more fast", isCorrect: false },
        { text: "fast", isCorrect: false }
      ],
      explanation: "Add '-er than' for one-syllable adjectives: fast ➔ faster than!"
    },
    {
      id: "quiz-2",
      question: "Why is Tyrannosaurus Rex classified as a CARNIVORE?",
      options: [
        { text: "It has 20cm sharp dagger teeth to hunt meat", isCorrect: true },
        { text: "It eats leaves from the tallest Jurassic trees", isCorrect: false },
        { text: "It has a solid bone club on its tail", isCorrect: false },
        { text: "It only grazes on soft forest ferns", isCorrect: false }
      ],
      explanation: "Carnivores eat meat and evolve sharp cutting or bone-crushing teeth!"
    },
    {
      id: "quiz-3",
      question: "How does Triceratops use its physiological adaptations?",
      options: [
        { text: "It has 3 hard horns and a bone frill to defend against predators", isCorrect: true },
        { text: "It has feathered wings to fly away across canyons", isCorrect: false },
        { text: "It has a venomous bite to capture small prey", isCorrect: false },
        { text: "It swims deep underwater to escape enemies", isCorrect: false }
      ],
      explanation: "Herbivores evolve defensive horns, frills, armor, or clubs for protection!"
    }
  ];

  const DINO_ARENA_DATA = {
    dinosaurs: DINO_DATA,
    mysteryRounds: MYSTERY_ROUNDS,
    grammarGymRounds: GRAMMAR_GYM_ROUNDS,
    battles: BATTLE_ROUNDS,
    teleprompter: TELEPROMPTER_ARCHETYPES,
    exitQuiz: EXIT_QUIZ_QUESTIONS
  };

  root.DINO_ARENA_DATA = DINO_ARENA_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DINO_ARENA_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
