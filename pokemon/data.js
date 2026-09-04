/**
 * POKÉMON TRAINER BATTLE - LESSON & GAME DATA
 * Tailored for Grade 4 ESL A1+ Learners
 */

const LESSON_DATA = {
  // ESCAPED POKÉMON FOR INTRO
  escapedPokemon: [
    { name: "Pikachu", image: "assets/images/pikachu.png", soundWord: "Pikachu!", desc: "Electric Mouse" },
    { name: "Eevee", image: "assets/images/eevee.png", soundWord: "Eevee!", desc: "Evolution Pokémon" },
    { name: "Charizard", image: "assets/images/charizard.png", soundWord: "Charizard!", desc: "Flame Pokémon" },
    { name: "Squirtle", image: "assets/images/squirtle.png", soundWord: "Squirtle!", desc: "Tiny Turtle" },
    { name: "Gengar", image: "assets/images/gengar.png", soundWord: "Gengar!", desc: "Shadow Pokémon" },
    { name: "Lucario", image: "assets/images/lucario.png", soundWord: "Lucario!", desc: "Aura Pokémon" }
  ],

  // NEW ICEBREAKER: "WHO'S THAT POKÉMON?" MYSTERY CLUE CHALLENGE
  // 5 Multi-Round Challenges with ZERO silhouettes and distinct mystery visual themes
  mysteryPokemonRounds: [
    {
      id: "round-1",
      targetName: "Pikachu",
      typeDesc: "Electric Mouse Pokémon",
      targetImage: "assets/images/pikachu.png",
      mysteryTheme: "electric",
      mysteryTitle: "⚡ ELECTRIC MYSTERY CAPSULE",
      clues: [
        { num: 1, text: "It is small.", emoji: "🐭" },
        { num: 2, text: "It is yellow.", emoji: "🟡" },
        { num: 3, text: "It has long ears.", emoji: "👂" },
        { num: 4, text: "It can make electricity.", emoji: "⚡" }
      ],
      options: [
        { name: "Gengar", image: "assets/images/gengar.png", type: "Ghost", isCorrect: false },
        { name: "Pikachu", image: "assets/images/pikachu.png", type: "Electric", isCorrect: true },
        { name: "Lapras", image: "assets/images/lapras.png", type: "Water", isCorrect: false }
      ]
    },
    {
      id: "round-2",
      targetName: "Charizard",
      typeDesc: "Flame Dragon Pokémon",
      targetImage: "assets/images/charizard.png",
      mysteryTheme: "fire",
      mysteryTitle: "🔥 FIERY MAGMA VAULT",
      clues: [
        { num: 1, text: "It is huge.", emoji: "🐉" },
        { num: 2, text: "It is orange.", emoji: "🟠" },
        { num: 3, text: "It has big wings.", emoji: "🪽" },
        { num: 4, text: "It can breathe fire.", emoji: "🔥" }
      ],
      options: [
        { name: "Bulbasaur", image: "assets/images/bulbasaur.png", type: "Grass", isCorrect: false },
        { name: "Charizard", image: "assets/images/charizard.png", type: "Fire", isCorrect: true },
        { name: "Snorlax", image: "assets/images/snorlax.png", type: "Normal", isCorrect: false }
      ]
    },
    {
      id: "round-3",
      targetName: "Squirtle",
      typeDesc: "Tiny Turtle Pokémon",
      targetImage: "assets/images/squirtle.png",
      mysteryTheme: "water",
      mysteryTitle: "🌊 DEEP OCEAN PRESSURE ORB",
      clues: [
        { num: 1, text: "It is small.", emoji: "🤏" },
        { num: 2, text: "It is blue.", emoji: "🔵" },
        { num: 3, text: "It has a hard shell.", emoji: "🐢" },
        { num: 4, text: "It can swim very fast.", emoji: "🏊" }
      ],
      options: [
        { name: "Machamp", image: "assets/images/machamp.png", type: "Fighting", isCorrect: false },
        { name: "Squirtle", image: "assets/images/squirtle.png", type: "Water", isCorrect: true },
        { name: "Diglett", image: "assets/images/diglett.png", type: "Ground", isCorrect: false }
      ]
    },
    {
      id: "round-4",
      targetName: "Gengar",
      typeDesc: "Shadow Phantom Pokémon",
      targetImage: "assets/images/gengar.png",
      mysteryTheme: "shadow",
      mysteryTitle: "🔮 SHADOW VOID PRISM",
      clues: [
        { num: 1, text: "It is purple.", emoji: "🟣" },
        { num: 2, text: "It is scary.", emoji: "😱" },
        { num: 3, text: "It has red eyes and a big smile.", emoji: "😈" },
        { num: 4, text: "It can become invisible.", emoji: "👻" }
      ],
      options: [
        { name: "Eevee", image: "assets/images/eevee.png", type: "Normal", isCorrect: false },
        { name: "Gengar", image: "assets/images/gengar.png", type: "Ghost", isCorrect: true },
        { name: "Onix", image: "assets/images/onix.png", type: "Rock", isCorrect: false }
      ]
    },
    {
      id: "round-5",
      targetName: "Bulbasaur",
      typeDesc: "Seed Plant Pokémon",
      targetImage: "assets/images/bulbasaur.png",
      mysteryTheme: "forest",
      mysteryTitle: "🌿 ANCIENT FOREST RELIC",
      clues: [
        { num: 1, text: "It is green.", emoji: "🟢" },
        { num: 2, text: "It is friendly.", emoji: "😊" },
        { num: 3, text: "It has a plant bulb on its back.", emoji: "🌱" },
        { num: 4, text: "It can jump and control plants.", emoji: "🌿" }
      ],
      options: [
        { name: "Jigglypuff", image: "assets/images/jigglypuff.png", type: "Fairy", isCorrect: false },
        { name: "Bulbasaur", image: "assets/images/bulbasaur.png", type: "Grass", isCorrect: true },
        { name: "Lucario", image: "assets/images/lucario.png", type: "Fighting", isCorrect: false }
      ]
    }
  ],

  // STAGE 1: ADJECTIVE CATEGORIES & CONTRASTS
  adjectives: [
    {
      category: "SIZE",
      words: [
        { word: "tiny", emoji: "🤏", gesture: "Make yourself very small!", examplePokemon: "joltik", image: "assets/images/joltik.png", sentence: "It is tiny." },
        { word: "small", emoji: "🐭", gesture: "Hold hands close together!", examplePokemon: "diglett", image: "assets/images/diglett.png", sentence: "It is small." },
        { word: "big", emoji: "🐻", gesture: "Open arms wide!", examplePokemon: "snorlax", image: "assets/images/snorlax.png", sentence: "It is big." },
        { word: "huge", emoji: "🐉", gesture: "Stretch arms and stand on tiptoes!", examplePokemon: "onix", image: "assets/images/onix.png", sentence: "It is huge." }
      ],
      contrast: {
        title: "SIZE CONTRAST",
        left: { word: "tiny", image: "assets/images/joltik.png", label: "🤏 TINY" },
        right: { word: "huge", image: "assets/images/onix.png", label: "🐉 HUGE" },
        prompt: "Which Pokémon is tiny? Which Pokémon is huge?"
      }
    },
    {
      category: "SPEED",
      words: [
        { word: "fast", emoji: "⚡", gesture: "Move hands quickly back and forth!", examplePokemon: "pikachu", image: "assets/images/pikachu.png", sentence: "It is fast." },
        { word: "slow", emoji: "🐢", gesture: "Move hands very slowly in slow-motion!", examplePokemon: "slowpoke", image: "assets/images/slowpoke.png", sentence: "It is slow." }
      ],
      contrast: {
        title: "SPEED CONTRAST",
        left: { word: "fast", image: "assets/images/pikachu.png", label: "⚡ FAST" },
        right: { word: "slow", image: "assets/images/slowpoke.png", label: "🐢 SLOW" },
        prompt: "Which Pokémon is fast? Which Pokémon is slow?"
      }
    },
    {
      category: "POWER",
      words: [
        { word: "strong", emoji: "💪", gesture: "Flex your big muscles!", examplePokemon: "machamp", image: "assets/images/machamp.png", sentence: "It is strong." },
        { word: "weak", emoji: "😴", gesture: "Slump shoulders and act tired/weak!", examplePokemon: "magikarp", image: "assets/images/magikarp.png", sentence: "It is weak." }
      ],
      contrast: {
        title: "POWER CONTRAST",
        left: { word: "strong", image: "assets/images/machamp.png", label: "💪 STRONG" },
        right: { word: "weak", image: "assets/images/magikarp.png", label: "😴 WEAK" },
        prompt: "Which Pokémon is strong? Which Pokémon is weak?"
      }
    },
    {
      category: "PERSONALITY",
      words: [
        { word: "cute", emoji: "🥰", gesture: "Hands on cheeks and smile warmly!", examplePokemon: "eevee", image: "assets/images/eevee.png", sentence: "It is cute." },
        { word: "scary", emoji: "😱", gesture: "Make a scary face with monster claws!", examplePokemon: "gengar", image: "assets/images/gengar.png", sentence: "It is scary." },
        { word: "friendly", emoji: "😊", gesture: "Big wave and friendly smile!", examplePokemon: "dragonite", image: "assets/images/dragonite.png", sentence: "It is friendly." },
        { word: "funny", emoji: "😂", gesture: "Wiggle ears and make a silly face!", examplePokemon: "jigglypuff", image: "assets/images/jigglypuff.png", sentence: "It is funny." },
        { word: "brave", emoji: "🦁", gesture: "Stand tall like a heroic champion!", examplePokemon: "lucario", image: "assets/images/lucario.png", sentence: "It is brave." }
      ],
      contrast: {
        title: "PERSONALITY CONTRAST",
        left: { word: "cute", image: "assets/images/eevee.png", label: "🥰 CUTE" },
        right: { word: "scary", image: "assets/images/gengar.png", label: "😱 SCARY" },
        prompt: "Which Pokémon is cute? Which Pokémon is scary?"
      }
    }
  ],

  // STAGE 2: ADJECTIVE QUICK GAME ("FIND THE...")
  adjectiveQuiz: [
    {
      targetWord: "huge",
      question: "Find the HUGE Pokémon!",
      options: [
        { name: "Diglett", word: "small", image: "assets/images/diglett.png", isCorrect: false },
        { name: "Onix", word: "huge", image: "assets/images/onix.png", isCorrect: true },
        { name: "Joltik", word: "tiny", image: "assets/images/joltik.png", isCorrect: false }
      ],
      sentence: "Onix is huge!"
    },
    {
      targetWord: "fast",
      question: "Find the FAST Pokémon!",
      options: [
        { name: "Slowpoke", word: "slow", image: "assets/images/slowpoke.png", isCorrect: false },
        { name: "Snorlax", word: "slow", image: "assets/images/snorlax.png", isCorrect: false },
        { name: "Pikachu", word: "fast", image: "assets/images/pikachu.png", isCorrect: true }
      ],
      sentence: "Pikachu is fast!"
    },
    {
      targetWord: "strong",
      question: "Find the STRONG Pokémon!",
      options: [
        { name: "Machamp", word: "strong", image: "assets/images/machamp.png", isCorrect: true },
        { name: "Magikarp", word: "weak", image: "assets/images/magikarp.png", isCorrect: false },
        { name: "Diglett", word: "small", image: "assets/images/diglett.png", isCorrect: false }
      ],
      sentence: "Machamp is strong!"
    },
    {
      targetWord: "scary",
      question: "Find the SCARY Pokémon!",
      options: [
        { name: "Eevee", word: "cute", image: "assets/images/eevee.png", isCorrect: false },
        { name: "Jigglypuff", word: "cute", image: "assets/images/jigglypuff.png", isCorrect: false },
        { name: "Gengar", word: "scary", image: "assets/images/gengar.png", isCorrect: true }
      ],
      sentence: "Gengar is scary!"
    },
    {
      targetWord: "tiny",
      question: "Find the TINY Pokémon!",
      options: [
        { name: "Onix", word: "huge", image: "assets/images/onix.png", isCorrect: false },
        { name: "Joltik", word: "tiny", image: "assets/images/joltik.png", isCorrect: true },
        { name: "Snorlax", word: "big", image: "assets/images/snorlax.png", isCorrect: false }
      ],
      sentence: "Joltik is tiny!"
    },
    {
      targetWord: "friendly",
      question: "Find the FRIENDLY Pokémon!",
      options: [
        { name: "Gengar", word: "scary", image: "assets/images/gengar.png", isCorrect: false },
        { name: "Dragonite", word: "friendly", image: "assets/images/dragonite.png", isCorrect: true },
        { name: "Magikarp", word: "weak", image: "assets/images/magikarp.png", isCorrect: false }
      ],
      sentence: "Dragonite is friendly!"
    }
  ],

  // STAGE 3: ABILITIES (16 ACTIONS)
  abilities: [
    { id: "fly", name: "fly", emoji: "🪽", color: "#38bdf8", sentence: "It can fly.", gesture: "Flap arms like wings!", examplePokemon: "Charizard / Pidgeot", exampleImage: "assets/images/charizard.png", attackName: "HURRICANE WING!", attackEffect: "wind" },
    { id: "swim", name: "swim", emoji: "🏊", color: "#0284c7", sentence: "It can swim.", gesture: "Breaststroke arms forwards!", examplePokemon: "Squirtle / Lapras", exampleImage: "assets/images/squirtle.png", attackName: "HYDRO WATER WAVE!", attackEffect: "water" },
    { id: "run fast", name: "run fast", emoji: "💨", color: "#f59e0b", sentence: "It can run fast.", gesture: "Pump arms running on the spot!", examplePokemon: "Arcanine / Pikachu", exampleImage: "assets/images/arcanine.png", attackName: "EXTREME SPEED!", attackEffect: "tackle" },
    { id: "jump", name: "jump high", emoji: "🦘", color: "#10b981", sentence: "It can jump high.", gesture: "Hop up high like a kangaroo!", examplePokemon: "Greninja / Buneary", exampleImage: "assets/images/greninja.png", attackName: "SUPER JUMP STRIKE!", attackEffect: "jump" },
    { id: "climb", name: "climb", emoji: "🧗", color: "#84cc16", sentence: "It can climb.", gesture: "Reach up alternating hands climbing a tree!", examplePokemon: "Eevee / Lucario", exampleImage: "assets/images/lucario.png", attackName: "CLIFF CLIMBER TACKLE!", attackEffect: "tackle" },
    { id: "dig", name: "dig", emoji: "⛏️", color: "#d97706", sentence: "It can dig.", gesture: "Scoop the ground with both paws!", examplePokemon: "Diglett / Onix", exampleImage: "assets/images/diglett.png", attackName: "EARTHQUAKE DIG!", attackEffect: "dig" },
    { id: "make fire", name: "breathe fire", emoji: "🔥", color: "#ef4444", sentence: "It can breathe fire.", gesture: "Hands around mouth and push forward blowing fire!", examplePokemon: "Charizard / Fuecoco", exampleImage: "assets/images/charizard.png", attackName: "FIRE BLAST!", attackEffect: "fire" },
    { id: "make electricity", name: "make electricity", emoji: "⚡", color: "#facc15", sentence: "It can make electricity.", gesture: "Shake hands and body with electric buzzing!", examplePokemon: "Pikachu / Jolteon", exampleImage: "assets/images/pikachu.png", attackName: "THUNDERBOLT!", attackEffect: "electric" },
    { id: "make ice", name: "freeze things", emoji: "❄️", color: "#06b6d4", sentence: "It can freeze things.", gesture: "Shiver hands and freeze in place!", examplePokemon: "Lapras / Glaceon", exampleImage: "assets/images/glaceon.png", attackName: "ICE BEAM FREEZE!", attackEffect: "ice" },
    { id: "create wind", name: "create wind", emoji: "🌪️", color: "#a7f3d0", sentence: "It can create wind.", gesture: "Spin arms in a circle like a tornado!", examplePokemon: "Pidgeot / Butterfree", exampleImage: "assets/images/butterfree.png", attackName: "TORNADO GUST!", attackEffect: "wind" },
    { id: "control plants", name: "control plants", emoji: "🌿", color: "#22c55e", sentence: "It can control plants.", gesture: "Wave hands like growing vines!", examplePokemon: "Bulbasaur / Chikorita", exampleImage: "assets/images/bulbasaur.png", attackName: "VINE WHIP!", attackEffect: "grass" },
    { id: "control water", name: "control water", emoji: "🌊", color: "#38bdf8", sentence: "It can control water.", gesture: "Push hands like crashing ocean waves!", examplePokemon: "Vaporeon / Marill", exampleImage: "assets/images/vaporeon.png", attackName: "TIDAL SURGE!", attackEffect: "water" },
    { id: "become invisible", name: "become invisible", emoji: "👻", color: "#a855f7", sentence: "It can become invisible.", gesture: "Cover eyes and sneak quietly!", examplePokemon: "Gengar / Haunter", exampleImage: "assets/images/haunter.png", attackName: "SHADOW VANISH!", attackEffect: "invisible" },
    { id: "make light", name: "make light", emoji: "✨", color: "#fbbf24", sentence: "It can make light.", gesture: "Spread fingers wide like a flash of light!", examplePokemon: "Magnemite / Shinx", exampleImage: "assets/images/shinx.png", attackName: "FLASH BURST!", attackEffect: "electric" },
    { id: "move rocks", name: "move rocks", emoji: "🪨", color: "#78350f", sentence: "It can move rocks.", gesture: "Push arms heavy like lifting a boulder!", examplePokemon: "Onix / Larvitar", exampleImage: "assets/images/larvitar.png", attackName: "ROCK SLIDE!", attackEffect: "rock" },
    { id: "see in the dark", name: "see in the dark", emoji: "👁️", color: "#6366f1", sentence: "It can see in the dark.", gesture: "Make circles around eyes like night goggles!", examplePokemon: "Gengar / Houndour", exampleImage: "assets/images/houndour.png", attackName: "NIGHT VISION PULSE!", attackEffect: "dark" }
  ],

  // STAGE 4: MODELING - FULL DESCRIPTIONS
  modelingExamples: [
    {
      name: "Pikachu",
      image: "assets/images/pikachu.png",
      adjectives: ["small", "fast", "cute"],
      abilities: ["jump", "make electricity"],
      sentence1: "My Pokémon is small and fast.",
      sentence2: "It is cute.",
      sentence3: "It can jump and make electricity.",
      fullSpeech: "My Pokémon is small and fast. It is cute. It can jump and make electricity!"
    },
    {
      name: "Charizard",
      image: "assets/images/charizard.png",
      adjectives: ["huge", "strong", "brave"],
      abilities: ["fly", "make fire"],
      sentence1: "My Pokémon is huge and strong.",
      sentence2: "It is brave.",
      sentence3: "It can fly and make fire.",
      fullSpeech: "My Pokémon is huge and strong. It is brave. It can fly and make fire!"
    },
    {
      name: "Squirtle",
      image: "assets/images/squirtle.png",
      adjectives: ["small", "friendly", "strong"],
      abilities: ["swim", "jump"],
      sentence1: "My Pokémon is small and friendly.",
      sentence2: "It is strong.",
      sentence3: "It can swim and jump.",
      fullSpeech: "My Pokémon is small and friendly. It is strong. It can swim and jump!"
    }
  ],

  // CHARACTER CREATION OPTIONS - 3-STEP SMARTBOARD ARCHITECTURE
  creatorOptions: {
    // PAGE 1: BODY ARCHETYPE + SIZE
    archetypes: [
      { id: "dragon", label: "DRAGON", emoji: "🐉", defaultImage: "assets/images/dragonite.png" },
      { id: "bird", label: "BIRD", emoji: "🦅", defaultImage: "assets/images/rookidee.png" },
      { id: "aquatic", label: "AQUATIC", emoji: "🌊", defaultImage: "assets/images/vaporeon.png" },
      { id: "cat", label: "CAT", emoji: "🐱", defaultImage: "assets/images/litten.png" },
      { id: "fox", label: "FOX", emoji: "🦊", defaultImage: "assets/images/fennekin.png" },
      { id: "dinosaur", label: "DINOSAUR", emoji: "🦖", defaultImage: "assets/images/fuecoco.png" },
      { id: "insect", label: "INSECT", emoji: "🪲", defaultImage: "assets/images/heracross.png" },
      { id: "robot", label: "ROBOT", emoji: "🤖", defaultImage: "assets/images/magnemite.png" },
      { id: "plant", label: "PLANT", emoji: "🌿", defaultImage: "assets/images/bulbasaur.png" },
      { id: "cute_round", label: "CUTE ROUND", emoji: "🌸", defaultImage: "assets/images/jigglypuff.png" }
    ],
    size: [
      { id: "tiny", label: "TINY", emoji: "🤏", scale: 0.70 },
      { id: "small", label: "SMALL", emoji: "🐭", scale: 0.85 },
      { id: "big", label: "BIG", emoji: "🐻", scale: 1.08 },
      { id: "huge", label: "HUGE", emoji: "🐉", scale: 1.30 }
    ],

    // PAGE 2: LOOK/PERSONALITY + COLOR
    looks: [
      { id: "cute", label: "CUTE", emoji: "🥰" },
      { id: "brave", label: "BRAVE", emoji: "🦁" },
      { id: "strong", label: "STRONG", emoji: "💪" },
      { id: "scary", label: "SCARY", emoji: "😱" },
      { id: "friendly", label: "FRIENDLY", emoji: "😊" }
    ],
    colors: [
      { id: "blue", label: "BLUE", hex: "#0284c7" },
      { id: "red", label: "RED", hex: "#ef4444" },
      { id: "green", label: "GREEN", hex: "#22c55e" },
      { id: "yellow", label: "YELLOW", hex: "#facc15" },
      { id: "purple", label: "PURPLE", hex: "#a855f7" },
      { id: "black", label: "BLACK", hex: "#1e293b" },
      { id: "white", label: "WHITE", hex: "#f8fafc" }
    ],

    // PAGE 3: BODY FEATURES + ABILITIES
    features: [
      { id: "big wings", label: "BIG WINGS", emoji: "🪽" },
      { id: "long tail", label: "LONG TAIL", emoji: "🦎" },
      { id: "sharp horns", label: "SHARP HORNS", emoji: "🦄" },
      { id: "long ears", label: "LONG EARS", emoji: "🐰" }
    ]
  },

  // SCORING RUBRIC FOR TEACHER IN BATTLE
  scoringRubric: [
    { label: "+1 Adjective", points: 1, sound: "point", desc: "e.g. 'big', 'fast', 'strong'" },
    { label: "+1 Ability", points: 1, sound: "point", desc: "e.g. 'fly', 'make fire'" },
    { label: "+1 Full Sentence", points: 1, sound: "super", desc: "e.g. 'My Pokémon is...'" },
    { label: "+1 Double Sentence", points: 1, sound: "super", desc: "e.g. 'It can fly and make fire'" },
    { label: "+1 Super Pronunciation", points: 1, sound: "fanfare", desc: "Clear, loud, proud English!" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LESSON_DATA;
}
