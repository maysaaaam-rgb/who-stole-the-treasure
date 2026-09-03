/**
 * POKÉMON TRAINER CHALLENGE - COMPREHENSIVE CURRICULUM DATA
 * Level: Grade 4 ESL (A1 / A1+)
 * Designed for Interactive Smartboards (16:9 Fullscreen)
 */

const LESSON_DATA = {
  // 16 RICH ABILITIES WITH VISUAL DEMOS AND ANIMATIONS
  abilities: [
    {
      id: "fly",
      name: "Fly",
      emoji: "🪽",
      color: "#38bdf8",
      sentence: "It can fly.",
      cantSentence: "It can't fly.",
      gesture: "Spread arms wide and flap like big wings!",
      animClass: "anim-fly",
      sound: "wind",
      demoPokemon: "Charizard",
      demoImage: "assets/images/charizard.png"
    },
    {
      id: "swim",
      name: "Swim",
      emoji: "🌊",
      color: "#0284c7",
      sentence: "It can swim.",
      cantSentence: "It can't swim.",
      gesture: "Paddle hands through the water like swimming!",
      animClass: "anim-swim",
      sound: "water",
      demoPokemon: "Lapras",
      demoImage: "assets/images/lapras.png"
    },
    {
      id: "run fast",
      name: "Run Fast",
      emoji: "🏃",
      color: "#f59e0b",
      sentence: "It can run fast.",
      cantSentence: "It can't run fast.",
      gesture: "Pump elbows and run on the spot very fast!",
      animClass: "anim-run",
      sound: "dash",
      demoPokemon: "Arcanine",
      demoImage: "assets/images/arcanine.png"
    },
    {
      id: "jump high",
      name: "Jump High",
      emoji: "🦘",
      color: "#10b981",
      sentence: "It can jump high.",
      cantSentence: "It can't jump high.",
      gesture: "Bend knees and spring up high into the air!",
      animClass: "anim-jump",
      sound: "jump",
      demoPokemon: "Greninja",
      demoImage: "assets/images/greninja.png"
    },
    {
      id: "climb",
      name: "Climb",
      emoji: "🧗",
      color: "#84cc16",
      sentence: "It can climb.",
      cantSentence: "It can't climb.",
      gesture: "Reach up alternating hands climbing a big tree!",
      animClass: "anim-climb",
      sound: "climb",
      demoPokemon: "Eevee",
      demoImage: "assets/images/eevee.png"
    },
    {
      id: "dig",
      name: "Dig",
      emoji: "⛏️",
      color: "#d97706",
      sentence: "It can dig.",
      cantSentence: "It can't dig.",
      gesture: "Scoop the ground with both paws down low!",
      animClass: "anim-dig",
      sound: "dig",
      demoPokemon: "Diglett",
      demoImage: "assets/images/diglett.png"
    },
    {
      id: "breathe fire",
      name: "Breathe Fire",
      emoji: "🔥",
      color: "#ef4444",
      sentence: "It can breathe fire.",
      cantSentence: "It can't breathe fire.",
      gesture: "Hands near mouth then burst open roaring!",
      animClass: "anim-fire",
      sound: "fire",
      demoPokemon: "Charmander",
      demoImage: "assets/images/charmander.png"
    },
    {
      id: "make electricity",
      name: "Make Electricity",
      emoji: "⚡",
      color: "#eab308",
      sentence: "It can make electricity.",
      cantSentence: "It can't make electricity.",
      gesture: "Finger-points like lightning bolts: ZZZ-ZAP!",
      animClass: "anim-electric",
      sound: "electric",
      demoPokemon: "Pikachu",
      demoImage: "assets/images/pikachu.png"
    },
    {
      id: "freeze things",
      name: "Freeze Things",
      emoji: "❄️",
      color: "#06b6d4",
      sentence: "It can freeze things.",
      cantSentence: "It can't freeze things.",
      gesture: "Shiver arms and freeze like a solid ice statue!",
      animClass: "anim-ice",
      sound: "ice",
      demoPokemon: "Glaceon",
      demoImage: "assets/images/glaceon.png"
    },
    {
      id: "create wind",
      name: "Create Wind",
      emoji: "🌪️",
      color: "#64748b",
      sentence: "It can create wind.",
      cantSentence: "It can't create wind.",
      gesture: "Swirl arms in big circles like a giant tornado!",
      animClass: "anim-wind",
      sound: "wind",
      demoPokemon: "Pidgeot",
      demoImage: "assets/images/pidgeot.png"
    },
    {
      id: "control plants",
      name: "Control Plants",
      emoji: "🌱",
      color: "#22c55e",
      sentence: "It can control plants.",
      cantSentence: "It can't control plants.",
      gesture: "Wiggle fingers growing upward like climbing vines!",
      animClass: "anim-plant",
      sound: "plant",
      demoPokemon: "Bulbasaur",
      demoImage: "assets/images/bulbasaur.png"
    },
    {
      id: "control water",
      name: "Control Water",
      emoji: "💧",
      color: "#3b82f6",
      sentence: "It can control water.",
      cantSentence: "It can't control water.",
      gesture: "Make smooth rolling waves with both hands!",
      animClass: "anim-water",
      sound: "water",
      demoPokemon: "Squirtle",
      demoImage: "assets/images/squirtle.png"
    },
    {
      id: "become invisible",
      name: "Become Invisible",
      emoji: "👻",
      color: "#a855f7",
      sentence: "It can become invisible.",
      cantSentence: "It can't become invisible.",
      gesture: "Cover eyes and tiptoe quietly: Shhh!",
      animClass: "anim-invisible",
      sound: "ghost",
      demoPokemon: "Gengar",
      demoImage: "assets/images/gengar.png"
    },
    {
      id: "make light",
      name: "Make Light",
      emoji: "✨",
      color: "#facc15",
      sentence: "It can make light.",
      cantSentence: "It can't make light.",
      gesture: "Open closed fists like flashing bright lights!",
      animClass: "anim-light",
      sound: "light",
      demoPokemon: "Shinx",
      demoImage: "assets/images/shinx.png"
    },
    {
      id: "move rocks",
      name: "Move Rocks",
      emoji: "🪨",
      color: "#78350f",
      sentence: "It can move rocks.",
      cantSentence: "It can't move rocks.",
      gesture: "Lift hands with heavy muscles: HEEAVE!",
      animClass: "anim-rock",
      sound: "rock",
      demoPokemon: "Onix",
      demoImage: "assets/images/onix.png"
    },
    {
      id: "see in the dark",
      name: "See in the Dark",
      emoji: "🌙",
      color: "#475569",
      sentence: "It can see in the dark.",
      cantSentence: "It can't see in the dark.",
      gesture: "Circle fingers around eyes like night goggles!",
      animClass: "anim-dark",
      sound: "dark",
      demoPokemon: "Houndour",
      demoImage: "assets/images/houndour.png"
    }
  ],

  // 10 DIVERSE CREATURE ARCHETYPES
  archetypes: [
    {
      id: "dragon",
      name: "Dragon",
      emoji: "🐉",
      desc: "Flying reptile with wings and fiery power",
      defaultImage: "assets/images/dragonite.png",
      elementalImages: {
        fire: "assets/images/charizard.png",
        water: "assets/images/dratini.png",
        ground: "assets/images/gible.png",
        strong: "assets/images/axew.png",
        default: "assets/images/dragonite.png"
      }
    },
    {
      id: "bird",
      name: "Bird",
      emoji: "🦅",
      desc: "Feathered creature with majestic wings",
      defaultImage: "assets/images/rookidee.png",
      elementalImages: {
        fire: "assets/images/fletchling.png",
        cute: "assets/images/torchic.png",
        grass: "assets/images/rowlet.png",
        wind: "assets/images/pidgeot.png",
        default: "assets/images/rookidee.png"
      }
    },
    {
      id: "aquatic",
      name: "Aquatic",
      emoji: "🌊",
      desc: "Water dweller with fins and swimming power",
      defaultImage: "assets/images/squirtle.png",
      elementalImages: {
        swim: "assets/images/lapras.png",
        ice: "assets/images/vaporeon.png",
        fast: "assets/images/totodile.png",
        cute: "assets/images/marill.png",
        default: "assets/images/squirtle.png"
      }
    },
    {
      id: "cat",
      name: "Cat",
      emoji: "🐱",
      desc: "Graceful feline with sharp claws and stealth",
      defaultImage: "assets/images/litten.png",
      elementalImages: {
        fire: "assets/images/litten.png",
        electric: "assets/images/shinx.png",
        psychic: "assets/images/espurr.png",
        agile: "assets/images/meowth.png",
        default: "assets/images/litten.png"
      }
    },
    {
      id: "fox",
      name: "Fox",
      emoji: "🦊",
      desc: "Clever kitsune with bushy tail and magic",
      defaultImage: "assets/images/fennekin.png",
      elementalImages: {
        fire: "assets/images/fennekin.png",
        electric: "assets/images/jolteon.png",
        ice: "assets/images/glaceon.png",
        dark: "assets/images/zorua.png",
        default: "assets/images/vulpix.png"
      }
    },
    {
      id: "dinosaur",
      name: "Dinosaur",
      emoji: "🦖",
      desc: "Mighty prehistoric beast with powerful stomp",
      defaultImage: "assets/images/tyrunt.png",
      elementalImages: {
        fire: "assets/images/fuecoco.png",
        strong: "assets/images/tyrunt.png",
        earth: "assets/images/larvitar.png",
        default: "assets/images/charmander.png"
      }
    },
    {
      id: "insect",
      name: "Insect",
      emoji: "🦋",
      desc: "Winged arthropod with antenna and agile speed",
      defaultImage: "assets/images/butterfree.png",
      elementalImages: {
        fly: "assets/images/butterfree.png",
        strong: "assets/images/heracross.png",
        fast: "assets/images/scyther.png",
        tiny: "assets/images/joltik.png",
        default: "assets/images/butterfree.png"
      }
    },
    {
      id: "robot",
      name: "Robot",
      emoji: "🤖",
      desc: "Magnetic high-tech machine powered by energy",
      defaultImage: "assets/images/magnemite.png",
      elementalImages: {
        electric: "assets/images/magnemite.png",
        default: "assets/images/magnemite.png"
      }
    },
    {
      id: "plant",
      name: "Plant",
      emoji: "🌱",
      desc: "Forest creature blooming with leaves and vines",
      defaultImage: "assets/images/bulbasaur.png",
      elementalImages: {
        grass: "assets/images/bulbasaur.png",
        cute: "assets/images/oddish.png",
        friendly: "assets/images/chikorita.png",
        default: "assets/images/turtwig.png"
      }
    },
    {
      id: "cute_round",
      name: "Cute Round",
      emoji: "🧸",
      desc: "Adorable soft ball creature that cheers everyone",
      defaultImage: "assets/images/jigglypuff.png",
      elementalImages: {
        cute: "assets/images/jigglypuff.png",
        electric: "assets/images/dedenne.png",
        water: "assets/images/marill.png",
        default: "assets/images/poliwag.png"
      }
    }
  ],

  // APPEARANCE VOCABULARY TEACHING ITEMS
  appearanceVocab: [
    {
      id: "big_small",
      pairName: "BIG vs SMALL",
      word1: "big",
      word2: "small",
      sentence1: "It is big.",
      sentence2: "It is small.",
      image1: "assets/images/snorlax.png",
      image2: "assets/images/joltik.png",
      name1: "Snorlax",
      name2: "Joltik",
      gesture1: "Stretch arms out wide like a giant!",
      gesture2: "Crouch down low and pinch fingers!"
    },
    {
      id: "tall_short",
      pairName: "TALL vs SHORT",
      word1: "tall",
      word2: "short",
      sentence1: "It is tall.",
      sentence2: "It is short.",
      image1: "assets/images/onix.png",
      image2: "assets/images/diglett.png",
      name1: "Onix",
      name2: "Diglett",
      gesture1: "Reach hands straight up to the ceiling!",
      gesture2: "Pat your hands down near the floor!"
    },
    {
      id: "fast_strong",
      pairName: "FAST vs STRONG",
      word1: "fast",
      word2: "strong",
      sentence1: "It is fast.",
      sentence2: "It is strong.",
      image1: "assets/images/pikachu.png",
      image2: "assets/images/machamp.png",
      name1: "Pikachu",
      name2: "Machamp",
      gesture1: "Zoom hands across like a sports car: WHOOSH!",
      gesture2: "Flex big arm muscles like a bodybuilder!"
    },
    {
      id: "cute_scary",
      pairName: "CUTE vs SCARY",
      word1: "cute",
      word2: "scary",
      sentence1: "It is cute.",
      sentence2: "It is scary.",
      image1: "assets/images/eevee.png",
      image2: "assets/images/gengar.png",
      name1: "Eevee",
      name2: "Gengar",
      gesture1: "Put hands on cheeks and smile warmly: AWWW!",
      gesture2: "Raise monster claws with a scary face: ROAR!"
    },
    {
      id: "colorful",
      pairName: "COLORFUL",
      word1: "colorful",
      word2: "blue & red",
      sentence1: "It is colorful.",
      sentence2: "It is blue and red.",
      image1: "assets/images/butterfree.png",
      image2: "assets/images/lapras.png",
      name1: "Butterfree",
      name2: "Lapras",
      gesture1: "Wave both hands in a big rainbow arc!",
      gesture2: "Point to blue water and red fire!"
    }
  ],

  // SILHOUETTE MYSTERY GUESSING GAME (ICEBREAKER)
  silhouetteRounds: [
    {
      id: "round1",
      answerName: "Charizard",
      image: "assets/images/charizard.png",
      clues: [
        "1. It is big.",
        "2. It is orange and red.",
        "3. It can fly.",
        "4. It has big wings and a fire tail."
      ],
      choices: [
        { name: "Charizard", image: "assets/images/charizard.png", isCorrect: true },
        { name: "Pikachu", image: "assets/images/pikachu.png", isCorrect: false },
        { name: "Squirtle", image: "assets/images/squirtle.png", isCorrect: false }
      ]
    },
    {
      id: "round2",
      answerName: "Pikachu",
      image: "assets/images/pikachu.png",
      clues: [
        "1. It is small and cute.",
        "2. It is yellow.",
        "3. It can make electricity.",
        "4. It has long ears and a lightning tail."
      ],
      choices: [
        { name: "Gengar", image: "assets/images/gengar.png", isCorrect: false },
        { name: "Pikachu", image: "assets/images/pikachu.png", isCorrect: true },
        { name: "Lapras", image: "assets/images/lapras.png", isCorrect: false }
      ]
    },
    {
      id: "round3",
      answerName: "Lapras",
      image: "assets/images/lapras.png",
      clues: [
        "1. It is huge and friendly.",
        "2. It is blue.",
        "3. It can swim and freeze things.",
        "4. It has a hard shell on its back."
      ],
      choices: [
        { name: "Machamp", image: "assets/images/machamp.png", isCorrect: false },
        { name: "Eevee", image: "assets/images/eevee.png", isCorrect: false },
        { name: "Lapras", image: "assets/images/lapras.png", isCorrect: true }
      ]
    },
    {
      id: "round4",
      answerName: "Gengar",
      image: "assets/images/gengar.png",
      clues: [
        "1. It is scary and funny.",
        "2. It is purple.",
        "3. It can become invisible.",
        "4. It has big red eyes and a wide smile."
      ],
      choices: [
        { name: "Gengar", image: "assets/images/gengar.png", isCorrect: true },
        { name: "Bulbasaur", image: "assets/images/bulbasaur.png", isCorrect: false },
        { name: "Dragonite", image: "assets/images/dragonite.png", isCorrect: false }
      ]
    }
  ],

  // APPEARANCE EXPLORER CARDS (FOR FILTERING)
  explorerCards: [
    {
      name: "Dragonite",
      image: "assets/images/dragonite.png",
      size: "big",
      height: "tall",
      color: "yellow",
      look: "friendly",
      abilities: ["fly", "breathe fire"]
    },
    {
      name: "Joltik",
      image: "assets/images/joltik.png",
      size: "small",
      height: "short",
      color: "yellow",
      look: "cute",
      abilities: ["make electricity", "jump high"]
    },
    {
      name: "Squirtle",
      image: "assets/images/squirtle.png",
      size: "small",
      height: "short",
      color: "blue",
      look: "cute",
      abilities: ["swim", "control water"]
    },
    {
      name: "Machamp",
      image: "assets/images/machamp.png",
      size: "big",
      height: "tall",
      color: "blue",
      look: "strong",
      abilities: ["move rocks", "run fast"]
    },
    {
      name: "Litten",
      image: "assets/images/litten.png",
      size: "small",
      height: "short",
      color: "red",
      look: "cute",
      abilities: ["breathe fire", "climb"]
    },
    {
      name: "Onix",
      image: "assets/images/onix.png",
      size: "big",
      height: "tall",
      color: "black",
      look: "scary",
      abilities: ["dig", "move rocks"]
    },
    {
      name: "Bulbasaur",
      image: "assets/images/bulbasaur.png",
      size: "small",
      height: "short",
      color: "green",
      look: "friendly",
      abilities: ["control plants", "make light"]
    },
    {
      name: "Gengar",
      image: "assets/images/gengar.png",
      size: "big",
      height: "tall",
      color: "purple",
      look: "scary",
      abilities: ["become invisible", "see in the dark"]
    }
  ],

  // CAN VS CAN'T CHALLENGE QUESTIONS
  canCantQuestions: [
    {
      pokemonName: "Magikarp (Fish Pokémon)",
      image: "assets/images/magikarp.png",
      prompts: [
        { statement: "It can swim.", isCan: true, explanation: "YES! Magikarp lives in the water and can swim!" },
        { statement: "It can fly.", isCan: false, explanation: "NO! Magikarp has no wings. It can't fly!" },
        { statement: "It can breathe fire.", isCan: false, explanation: "NO! It is a water fish. It can't breathe fire!" }
      ]
    },
    {
      pokemonName: "Charizard (Dragon Pokémon)",
      image: "assets/images/charizard.png",
      prompts: [
        { statement: "It can fly.", isCan: true, explanation: "YES! Charizard has huge wings and can fly high!" },
        { statement: "It can breathe fire.", isCan: true, explanation: "YES! It breathes giant hot flames!" },
        { statement: "It can become invisible.", isCan: false, explanation: "NO! Charizard is huge and visible. It can't vanish!" }
      ]
    },
    {
      pokemonName: "Diglett (Mole Pokémon)",
      image: "assets/images/diglett.png",
      prompts: [
        { statement: "It can dig.", isCan: true, explanation: "YES! Diglett digs tunnels underground!" },
        { statement: "It can swim.", isCan: false, explanation: "NO! Diglett lives in the soil. It can't swim!" },
        { statement: "It can jump high.", isCan: false, explanation: "NO! Diglett has no legs. It can't jump!" }
      ]
    },
    {
      pokemonName: "Gengar (Shadow Pokémon)",
      image: "assets/images/gengar.png",
      prompts: [
        { statement: "It can become invisible.", isCan: true, explanation: "YES! Gengar can hide in shadows!" },
        { statement: "It can see in the dark.", isCan: true, explanation: "YES! Gengar has night vision!" },
        { statement: "It can control plants.", isCan: false, explanation: "NO! Gengar is a ghost. It can't control plants!" }
      ]
    }
  ],

  // MYSTERY POKÉMON CLASS GAME QUESTIONS
  mysteryClassQuestions: [
    {
      speakerHint: "Listen to the description and tap the matching Pokémon!",
      lines: [
        "It is small and yellow.",
        "It is cute.",
        "It has long ears.",
        "It can run fast and make electricity."
      ],
      correctId: "pikachu",
      options: [
        { id: "pikachu", name: "Pikachu", image: "assets/images/pikachu.png" },
        { id: "snorlax", name: "Snorlax", image: "assets/images/snorlax.png" },
        { id: "gengar", name: "Gengar", image: "assets/images/gengar.png" },
        { id: "bulbasaur", name: "Bulbasaur", image: "assets/images/bulbasaur.png" }
      ]
    },
    {
      speakerHint: "Listen to the description and tap the matching Pokémon!",
      lines: [
        "It is big and strong.",
        "It is green.",
        "It has a plant bulb on its back.",
        "It can control plants and make light."
      ],
      correctId: "bulbasaur",
      options: [
        { id: "charmander", name: "Charmander", image: "assets/images/charmander.png" },
        { id: "bulbasaur", name: "Bulbasaur", image: "assets/images/bulbasaur.png" },
        { id: "machamp", name: "Machamp", image: "assets/images/machamp.png" },
        { id: "lapras", name: "Lapras", image: "assets/images/lapras.png" }
      ]
    },
    {
      speakerHint: "Listen to the description and tap the matching Pokémon!",
      lines: [
        "It is huge and blue.",
        "It has a hard shell.",
        "It can swim in the ocean.",
        "It can freeze things."
      ],
      correctId: "lapras",
      options: [
        { id: "joltik", name: "Joltik", image: "assets/images/joltik.png" },
        { id: "onix", name: "Onix", image: "assets/images/onix.png" },
        { id: "lapras", name: "Lapras", image: "assets/images/lapras.png" },
        { id: "arcanine", name: "Arcanine", image: "assets/images/arcanine.png" }
      ]
    }
  ],

  // FINAL BOSS CHALLENGE
  finalBoss: {
    name: "SHADOW TITAN",
    image: "assets/images/charizard.png",
    appearanceAnswers: {
      size: ["big", "tall"],
      look: ["strong", "scary"],
      color: "red",
      body: "wings",
      abilities: ["fly", "breathe fire"]
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LESSON_DATA;
}
