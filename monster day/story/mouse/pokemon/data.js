/**
 * POKÉMON TRAINER BATTLE - LESSON & GAME DATA
 * Tailored for Grade 4 ESL A1+ Learners
 */

const LESSON_DATA = {
  // ESCAPED POKÉMON FOR INTRO & ICEBREAKER
  escapedPokemon: [
    { name: "Pikachu", image: "assets/images/pikachu.png", soundWord: "Pikachu!", desc: "Electric Mouse" },
    { name: "Eevee", image: "assets/images/eevee.png", soundWord: "Eevee!", desc: "Evolution Pokémon" },
    { name: "Charizard", image: "assets/images/charizard.png", soundWord: "Charizard!", desc: "Flame Pokémon" },
    { name: "Squirtle", image: "assets/images/squirtle.png", soundWord: "Squirtle!", desc: "Tiny Turtle" },
    { name: "Gengar", image: "assets/images/gengar.png", soundWord: "Gengar!", desc: "Shadow Pokémon" },
    { name: "Lucario", image: "assets/images/lucario.png", soundWord: "Lucario!", desc: "Aura Pokémon" }
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
      targetWord: "tiny",
      question: "Find the TINY Pokémon!",
      options: [
        { name: "Joltik", word: "tiny", image: "assets/images/joltik.png", isCorrect: true },
        { name: "Machamp", word: "strong", image: "assets/images/machamp.png", isCorrect: false },
        { name: "Charizard", word: "big", image: "assets/images/charizard.png", isCorrect: false }
      ],
      sentence: "Joltik is tiny!"
    },
    {
      targetWord: "strong",
      question: "Find the STRONG Pokémon!",
      options: [
        { name: "Magikarp", word: "weak", image: "assets/images/magikarp.png", isCorrect: false },
        { name: "Machamp", word: "strong", image: "assets/images/machamp.png", isCorrect: true },
        { name: "Jigglypuff", word: "cute", image: "assets/images/jigglypuff.png", isCorrect: false }
      ],
      sentence: "Machamp is strong!"
    },
    {
      targetWord: "scary",
      question: "Find the SCARY Pokémon!",
      options: [
        { name: "Eevee", word: "cute", image: "assets/images/eevee.png", isCorrect: false },
        { name: "Gengar", word: "scary", image: "assets/images/gengar.png", isCorrect: true },
        { name: "Squirtle", word: "friendly", image: "assets/images/squirtle.png", isCorrect: false }
      ],
      sentence: "Gengar is scary!"
    },
    {
      targetWord: "friendly",
      question: "Find the FRIENDLY Pokémon!",
      options: [
        { name: "Dragonite", word: "friendly", image: "assets/images/dragonite.png", isCorrect: true },
        { name: "Haunter", word: "scary", image: "assets/images/haunter.png", isCorrect: false },
        { name: "Gengar", word: "scary", image: "assets/images/gengar.png", isCorrect: false }
      ],
      sentence: "Dragonite is friendly!"
    }
  ],

  // STAGE 3: ABILITIES (WHAT CAN YOUR POKÉMON DO?)
  abilities: [
    {
      id: "fly",
      name: "fly",
      emoji: "🪽",
      color: "#38bdf8",
      sentence: "It can fly.",
      gesture: "Spread wings and flap arms!",
      examplePokemon: "Pidgeot / Butterfree",
      exampleImage: "assets/images/butterfree.png",
      attackName: "AERIAL DIVE!",
      attackEffect: "fly"
    },
    {
      id: "swim",
      name: "swim",
      emoji: "🌊",
      color: "#0284c7",
      sentence: "It can swim.",
      gesture: "Swim with breaststroke arm moves!",
      examplePokemon: "Squirtle / Lapras",
      exampleImage: "assets/images/squirtle.png",
      attackName: "WATER WAVE!",
      attackEffect: "swim"
    },
    {
      id: "make fire",
      name: "make fire",
      emoji: "🔥",
      color: "#ef4444",
      sentence: "It can make fire.",
      gesture: "Breathe fire and push hands out with whoosh!",
      examplePokemon: "Charmander / Charizard",
      exampleImage: "assets/images/charizard.png",
      attackName: "FIRE BLAST!",
      attackEffect: "fire"
    },
    {
      id: "make electricity",
      name: "make electricity",
      emoji: "⚡",
      color: "#facc15",
      sentence: "It can make electricity.",
      gesture: "Shake fingers with electric buzz!",
      examplePokemon: "Pikachu / Electabuzz",
      exampleImage: "assets/images/pikachu.png",
      attackName: "THUNDERBOLT!",
      attackEffect: "electric"
    },
    {
      id: "make ice",
      name: "make ice",
      emoji: "❄️",
      color: "#06b6d4",
      sentence: "It can make ice.",
      gesture: "Shiver hands and freeze in place!",
      examplePokemon: "Lapras / Articuno",
      exampleImage: "assets/images/lapras.png",
      attackName: "ICE BEAM!",
      attackEffect: "ice"
    },
    {
      id: "jump",
      name: "jump",
      emoji: "🦘",
      color: "#10b981",
      sentence: "It can jump.",
      gesture: "Hop up high like a kangeroo!",
      examplePokemon: "Bulbasaur / Greninja",
      exampleImage: "assets/images/greninja.png",
      attackName: "SUPER JUMP STRIKE!",
      attackEffect: "jump"
    },
    {
      id: "climb",
      name: "climb",
      emoji: "🧗",
      color: "#84cc16",
      sentence: "It can climb.",
      gesture: "Reach up alternating hands climbing a tree!",
      examplePokemon: "Eevee / Lucario",
      exampleImage: "assets/images/lucario.png",
      attackName: "CLIFF CLIMBER TACKLE!",
      attackEffect: "tackle"
    },
    {
      id: "dig",
      name: "dig",
      emoji: "⛏️",
      color: "#d97706",
      sentence: "It can dig.",
      gesture: "Scoop the ground with both paws!",
      examplePokemon: "Diglett / Onix",
      exampleImage: "assets/images/diglett.png",
      attackName: "EARTHQUAKE DIG!",
      attackEffect: "dig"
    },
    {
      id: "run fast",
      name: "run fast",
      emoji: "💨",
      color: "#f59e0b",
      sentence: "It can run fast.",
      gesture: "Pump arms running on the spot!",
      examplePokemon: "Arcanine",
      exampleImage: "assets/images/arcanine.png",
      attackName: "EXTREME SPEED!",
      attackEffect: "tackle"
    },
    {
      id: "become invisible",
      name: "become invisible",
      emoji: "👻",
      color: "#a855f7",
      sentence: "It can become invisible.",
      gesture: "Cover eyes and sneak quietly!",
      examplePokemon: "Gengar / Haunter",
      exampleImage: "assets/images/haunter.png",
      attackName: "SHADOW VANISH!",
      attackEffect: "invisible"
    },
    {
      id: "change colour",
      name: "change colour",
      emoji: "🌈",
      color: "#ec4899",
      sentence: "It can change colour.",
      gesture: "Wave hands like a rainbow shimmer!",
      examplePokemon: "Kecleon",
      exampleImage: "assets/images/greninja.png",
      attackName: "RAINBOW CAMOUFLAGE!",
      attackEffect: "rainbow"
    },
    {
      id: "see in the dark",
      name: "see in the dark",
      emoji: "👁️",
      color: "#6366f1",
      sentence: "It can see in the dark.",
      gesture: "Make circles around eyes like night goggles!",
      examplePokemon: "Gengar",
      exampleImage: "assets/images/gengar.png",
      attackName: "NIGHT VISION PULSE!",
      attackEffect: "dark"
    }
  ],

  // STAGE 4: MODELING - FULL DESCRIPTIONS WITH PIKACHU & CHARIZARD
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

  // CHARACTER CREATION OPTIONS
  creatorOptions: {
    bases: [
      { id: "fox", label: "FOX", emoji: "🦊", defaultImage: "assets/images/fennekin.png" },
      { id: "cat", label: "CAT", emoji: "🐱", defaultImage: "assets/images/litten.png" },
      { id: "rabbit", label: "RABBIT", emoji: "🐰", defaultImage: "assets/images/scorbunny.png" },
      { id: "turtle", label: "TURTLE", emoji: "🐢", defaultImage: "assets/images/squirtle.png" },
      { id: "dragon", label: "DRAGON", emoji: "🐉", defaultImage: "assets/images/dragonite.png" },
      { id: "bird", label: "BIRD", emoji: "🦅", defaultImage: "assets/images/rookidee.png" },
      { id: "wolf", label: "WOLF", emoji: "🐺", defaultImage: "assets/images/rockruff.png" },
      { id: "frog", label: "FROG", emoji: "🐸", defaultImage: "assets/images/froakie.png" },
      { id: "dinosaur", label: "DINOSAUR", emoji: "🦖", defaultImage: "assets/images/fuecoco.png" },
      { id: "mouse", label: "MOUSE", emoji: "🐭", defaultImage: "assets/images/pikachu.png" }
    ],
    size: [
      { id: "tiny", label: "TINY", emoji: "🤏", scale: 0.65 },
      { id: "small", label: "SMALL", emoji: "🐭", scale: 0.82 },
      { id: "big", label: "BIG", emoji: "🐻", scale: 1.05 },
      { id: "huge", label: "HUGE", emoji: "🐉", scale: 1.28 }
    ],
    personality: [
      { id: "cute", label: "CUTE", emoji: "🥰" },
      { id: "scary", label: "SCARY", emoji: "😱" },
      { id: "friendly", label: "FRIENDLY", emoji: "😊" },
      { id: "funny", label: "FUNNY", emoji: "😂" },
      { id: "brave", label: "BRAVE", emoji: "🦁" }
    ],
    power: [
      { id: "fast", label: "FAST", emoji: "⚡" },
      { id: "slow", label: "SLOW", emoji: "🐢" },
      { id: "strong", label: "STRONG", emoji: "💪" },
      { id: "weak", label: "WEAK", emoji: "😴" }
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
