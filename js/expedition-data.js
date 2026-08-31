/**
 * THE LAST EXPEDITION: A Grade 4 CLIL Prediction & Problem-Solving Game
 * Section 0: Expedition Training (7-10 Min Vocabulary Mini-Games)
 * + 10 Sequential Main Expedition Scenes
 */

const EXPEDITION_TRAINING_DATA = {
  intro: {
    title: "🎒 EXPEDITION TRAINING",
    subtitle: "Learn Explorer Words Before We Start!",
    tagline: "Before we start, we need to learn some explorer words! Learn the words. You will need them later!",
    spoken: "Before we start, we need to learn some explorer words! Look at the pictures and learn the words."
  },

  // 12 Target Words
  targetWords: [
    { word: "VOLCANO", icon: "🌋", def: "A hot mountain with smoke and fire." },
    { word: "ROCK", icon: "🪨", def: "Hard stone on the ground." },
    { word: "CAVE", icon: "🕳️", def: "A dry stone room inside a mountain." },
    { word: "RIVER", icon: "🌊", def: "Flowing freshwater." },
    { word: "BRIDGE", icon: "🌉", def: "Path to cross over a river." },
    { word: "COMPASS", icon: "🧭", def: "Points North, South, East, West." },
    { word: "MAP", icon: "🗺️", def: "Drawing showing roads and places." },
    { word: "STORM", icon: "🌧️", def: "Heavy rain and strong wind." },
    { word: "TRACKS", icon: "🐾", def: "Animal footprints in the mud." },
    { word: "TEMPERATURE", icon: "🌡️", def: "Shows how hot or cold it is." },
    { word: "SHELTER", icon: "🏕️", def: "A safe place to stay dry." },
    { word: "ROUTE", icon: "🛤️", def: "The path or way you travel." }
  ],

  // Mini-Game 1: Look & Find
  lookAndFind: {
    title: "🎮 GAME 1: LOOK & FIND",
    instruction: "Listen and click the correct object on the island!",
    targets: [
      { id: "volcano", label: "VOLCANO 🌋", spoken: "Find the volcano!", icon: "🌋", x: 730, y: 195, r: 45 },
      { id: "cave", label: "CAVE 🕳️", spoken: "Find the cave!", icon: "🕳️", x: 325, y: 255, r: 40 },
      { id: "river", label: "RIVER 🌊", spoken: "Find the river!", icon: "🌊", x: 425, y: 310, r: 40 },
      { id: "bridge", label: "BRIDGE 🌉", spoken: "Find the bridge!", icon: "🌉", x: 425, y: 245, r: 35 },
      { id: "shelter", label: "SHELTER 🏕️", spoken: "Find the camp shelter!", icon: "🏕️", x: 195, y: 305, r: 35 },
      { id: "station", label: "STATION 🏛️", spoken: "Find the research station!", icon: "🏛️", x: 470, y: 70, r: 45 }
    ]
  },

  // Mini-Game 2: Match the Word
  matchWord: {
    title: "🎮 GAME 2: MATCH THE WORD",
    rounds: [
      {
        word: "CAVE 🕳️",
        spoken: "Match the word: CAVE",
        correctId: "cave",
        options: [
          { id: "volcano", icon: "🌋", text: "VOLCANO" },
          { id: "cave", icon: "🕳️", text: "CAVE" },
          { id: "river", icon: "🌊", text: "RIVER" }
        ]
      },
      {
        word: "COMPASS 🧭",
        spoken: "Match the word: COMPASS",
        correctId: "compass",
        options: [
          { id: "compass", icon: "🧭", text: "COMPASS" },
          { id: "map", icon: "🗺️", text: "MAP" },
          { id: "temp", icon: "🌡️", text: "TEMPERATURE" }
        ]
      },
      {
        word: "BRIDGE 🌉",
        spoken: "Match the word: BRIDGE",
        correctId: "bridge",
        options: [
          { id: "tree", icon: "🌲", text: "FOREST" },
          { id: "bridge", icon: "🌉", text: "BRIDGE" },
          { id: "cave", icon: "🕳️", text: "CAVE" }
        ]
      },
      {
        word: "STORM 🌧️",
        spoken: "Match the word: STORM",
        correctId: "storm",
        options: [
          { id: "sun", icon: "☀️", text: "SUNNY" },
          { id: "storm", icon: "🌧️", text: "STORM" },
          { id: "rainbow", icon: "🌈", text: "RAINBOW" }
        ]
      },
      {
        word: "TRACKS 🐾",
        spoken: "Match the word: TRACKS",
        correctId: "tracks",
        options: [
          { id: "tracks", icon: "🐾", text: "TRACKS" },
          { id: "plant", icon: "🌱", text: "PLANT" },
          { id: "rock", icon: "🪨", text: "ROCK" }
        ]
      },
      {
        word: "SHELTER 🏕️",
        spoken: "Match the word: SHELTER",
        correctId: "shelter",
        options: [
          { id: "water", icon: "🌊", text: "RIVER" },
          { id: "shelter", icon: "🏕️", text: "SHELTER" },
          { id: "fire", icon: "🔥", text: "FIRE" }
        ]
      }
    ]
  },

  // Mini-Game 3: What Am I? (Short Visual Riddles)
  whatAmI: {
    title: "🎮 GAME 3: WHAT AM I?",
    riddles: [
      {
        clue: "I help you find North, South, East, and West.",
        spoken: "I help you find North, South, East, and West. What am I?",
        correct: "compass",
        options: [
          { id: "compass", icon: "🧭", text: "COMPASS" },
          { id: "shoe", icon: "👟", text: "SHOE" },
          { id: "apple", icon: "🍎", text: "APPLE" }
        ]
      },
      {
        clue: "You cross me to go over a river.",
        spoken: "You cross me to go over a river. What am I?",
        correct: "bridge",
        options: [
          { id: "tree", icon: "🌲", text: "TREE" },
          { id: "bridge", icon: "🌉", text: "BRIDGE" },
          { id: "box", icon: "📦", text: "BOX" }
        ]
      },
      {
        clue: "You can stay inside me and be safe from the rain.",
        spoken: "You can stay inside me and be safe from the rain. What am I?",
        correct: "shelter",
        options: [
          { id: "shelter", icon: "🏕️", text: "SHELTER" },
          { id: "river", icon: "🌊", text: "RIVER" },
          { id: "cloud", icon: "☁️", text: "CLOUD" }
        ]
      },
      {
        clue: "Animals leave me in the mud when they walk.",
        spoken: "Animals leave me in the mud when they walk. What am I?",
        correct: "tracks",
        options: [
          { id: "tracks", icon: "🐾", text: "TRACKS" },
          { id: "book", icon: "📚", text: "BOOK" },
          { id: "car", icon: "🚗", text: "CAR" }
        ]
      }
    ]
  },

  // Mini-Game 4: Visual Memory (8s flash)
  visualMemory: {
    title: "🎮 GAME 4: 8-SECOND MEMORY",
    instruction: "Look at the 6 objects for 8 seconds. Remember them!",
    displayTime: 8,
    targetItems: [
      { id: "compass", icon: "🧭", text: "COMPASS" },
      { id: "volcano", icon: "🌋", text: "VOLCANO" },
      { id: "river", icon: "🌊", text: "RIVER" },
      { id: "cave", icon: "🕳️", text: "CAVE" },
      { id: "bridge", icon: "🌉", text: "BRIDGE" },
      { id: "tracks", icon: "🐾", text: "TRACKS" }
    ],
    allItems: [
      { id: "compass", icon: "🧭", text: "COMPASS", isTarget: true },
      { id: "volcano", icon: "🌋", text: "VOLCANO", isTarget: true },
      { id: "river", icon: "🌊", text: "RIVER", isTarget: true },
      { id: "cave", icon: "🕳️", text: "CAVE", isTarget: true },
      { id: "bridge", icon: "🌉", text: "BRIDGE", isTarget: true },
      { id: "tracks", icon: "🐾", text: "TRACKS", isTarget: true },
      { id: "tree", icon: "🌳", text: "TREE", isTarget: false },
      { id: "fish", icon: "🐟", text: "FISH", isTarget: false }
    ]
  },

  // Mini-Game 5: Explorer's Backpack
  backpack: {
    title: "🎮 GAME 5: PACK THE BACKPACK",
    instruction: "What does an explorer need? Choose 4 items!",
    spoken: "What does an explorer need? Choose four useful items for the backpack.",
    items: [
      { id: "compass", icon: "🧭", text: "COMPASS", isNeeded: true, reason: "Finds directions!" },
      { id: "map", icon: "🗺️", text: "MAP", isNeeded: true, reason: "Shows the paths!" },
      { id: "flashlight", icon: "🔦", text: "FLASHLIGHT", isNeeded: true, reason: "Lights dark caves!" },
      { id: "water", icon: "🧃", text: "WATER", isNeeded: true, reason: "Keeps explorers healthy!" },
      { id: "teddy", icon: "🧸", text: "TEDDY BEAR", isNeeded: false, reason: "Too heavy and not needed on a mission!" },
      { id: "pan", icon: "🍳", text: "FRYING PAN", isNeeded: false, reason: "Too heavy to carry across mountains!" },
      { id: "book", icon: "📚", text: "HEAVY BOOK", isNeeded: false, reason: "Too heavy for hiking!" }
    ]
  },

  // Mini-Game 6: Which One?
  whichOne: {
    title: "🎮 GAME 6: WHICH ONE?",
    questions: [
      {
        prompt: "Which picture shows a STORM? ⛈️",
        spoken: "Which picture shows a storm?",
        correctId: "storm",
        options: [
          { id: "sun", icon: "☀️", text: "Sunny Day" },
          { id: "storm", icon: "🌧️ ⚡", text: "Heavy Storm" },
          { id: "rainbow", icon: "🌈", text: "Rainbow" }
        ]
      },
      {
        prompt: "Which picture shows a ROUTE? 🛤️",
        spoken: "Which picture shows a route on a map?",
        correctId: "route",
        options: [
          { id: "route", icon: "🗺️ ➔ ➔", text: "Trail Route" },
          { id: "blank", icon: "📄", text: "Blank Paper" },
          { id: "house", icon: "🏠", text: "House" }
        ]
      },
      {
        prompt: "Which picture shows ANIMAL TRACKS? 🐾",
        spoken: "Which picture shows animal tracks in the mud?",
        correctId: "tracks",
        options: [
          { id: "tracks", icon: "🐾 🐾", text: "Paw Tracks" },
          { id: "plants", icon: "🌱", text: "Green Plant" },
          { id: "rocks", icon: "🪨", text: "Rock" }
        ]
      }
    ]
  },

  // Mini-Game 7: Use the Word (Mini Predictions)
  useTheWord: {
    title: "🎮 GAME 7: USE THE WORD & PREDICT",
    challenges: [
      {
        icons: "🌧️ ➔ 🌊",
        prompt: "The rain is heavy. What will happen to the river?",
        spoken: "The rain is heavy. What will happen to the river?",
        correctId: "rise",
        options: [
          { id: "rise", icon: "🌊 ⬆️", text: "The river will rise." },
          { id: "dry", icon: "🏖️", text: "The river will dry up." }
        ]
      },
      {
        icons: "🌋 ➔ 🌡️ ↑",
        prompt: "The ground temperature is high. What might happen?",
        spoken: "The ground temperature is high. What might happen?",
        correctId: "active",
        options: [
          { id: "active", icon: "🌋 💨", text: "The volcano might become active." },
          { id: "ice", icon: "🧊", text: "It will freeze into ice." }
        ]
      },
      {
        icons: "🌊 ➔ 🌉 ❌",
        prompt: "The river is high and the bridge is broken. What should they do?",
        spoken: "The river is high and the bridge is broken. What should they do?",
        correctId: "route",
        options: [
          { id: "route", icon: "🛤️ 🌲", text: "Find another route." },
          { id: "swim", icon: "🏊 ❌", text: "Swim across the deep flood." }
        ]
      }
    ]
  }
};

const EXPEDITION_DATA = {
  mission: {
    title: "THE LAST EXPEDITION",
    subtitle: "A Grade 4 CLIL Prediction & Problem-Solving Game",
    goal: "REACH STATION ALPHA BEFORE THE STORM!",
    initialStormMinutes: 60,
    targetLanguage: "Will / Might / Because / So / They should..."
  },

  // 4 Explorer Characters with simple visual traits
  explorers: [
    { id: "maya", name: "Maya", role: "Navigator", trait: "Careful 👀", avatarClass: "avatar-exp-maya", quote: "Look at the map!" },
    { id: "leo", name: "Leo", role: "Scout", trait: "Brave 🏃", avatarClass: "avatar-exp-leo", quote: "I will check the path!" },
    { id: "emma", name: "Emma", role: "Scientist", trait: "Science 🔬", avatarClass: "avatar-exp-emma", quote: "Look at the weather and temperature!" },
    { id: "noah", name: "Noah", role: "Helper", trait: "Supplies 🎒", avatarClass: "avatar-exp-noah", quote: "I have the flashlights!" }
  ],

  // 10 Visual Scenes with short, simple English
  scenes: [
    // SCENE 1: THE DARK CLOUDS
    {
      sceneNum: 1,
      id: "scene_1",
      title: "SCENE 1 — THE DARK CLOUDS",
      location: "The Beach 🏖️",
      stormMinutesLeft: 55,
      shortLines: [
        "The explorers arrive at the island. ☀️",
        "Look! Dark clouds are forming over the mountain. 🌥️",
        "The wind is getting fast. 🌬️"
      ],
      spokenStory: "The explorers arrive. Look! Dark clouds! The wind is fast.",
      
      prompt: "What will happen next?",
      sentenceFrame: "I think ___ will ___ because ___.",

      predictionOptions: [
        { id: "rain", icon: "🌧️", text: "Rain will start.", isBest: true, clue: "Dark clouds 🌥️ ➔ Rain 🌧️" },
        { id: "sunny", icon: "☀️", text: "It will stay sunny.", isBest: false, clue: "Dark clouds mean rain, not sun." },
        { id: "swim", icon: "🏖️", text: "They will go swimming.", isBest: false, clue: "A storm is coming." }
      ],

      evidenceOptions: [
        { id: "ev_clouds", icon: "🌥️", text: "Dark purple clouds on the mountain.", isCorrect: true },
        { id: "ev_sand", icon: "🏖️", text: "The yellow sand.", isCorrect: false }
      ],

      clilBadge: { word: "STORM ⛈️", shortDef: "Heavy rain + dark clouds + strong wind." }
    },

    // SCENE 2: THE STORM BEGINS (SHELTER)
    {
      sceneNum: 2,
      id: "scene_2",
      title: "SCENE 2 — THE STORM BEGINS",
      location: "The Ridge ⛰️",
      stormMinutesLeft: 50,
      shortLines: [
        "It is raining! 🌧️",
        "The wind is cold. 🌬️",
        "The explorers need shelter to stay dry! 🕳️"
      ],
      spokenStory: "It is raining! The wind is cold. Where should they go?",

      prompt: "Where should they go?",
      sentenceFrame: "They should go to ___ because ___.",

      decisionOptions: [
        { id: "cave", icon: "🕳️", text: "The Cave", isBest: true, reason: "A dry stone cave protects from rain." },
        { id: "tree", icon: "🌲", text: "Under a tree", isBest: false, reason: "Dangerous in a lightning storm!" },
        { id: "river", icon: "🌊", text: "Near the river", isBest: false, reason: "Rivers can flood!" }
      ],

      clilBadge: { word: "SHELTER 🕳️", shortDef: "A safe, dry place away from the storm." }
    },

    // SCENE 3: THE CAVE RIDDLE & COMPASS
    {
      sceneNum: 3,
      id: "scene_3",
      title: "SCENE 3 — THE CAVE RIDDLE",
      location: "The Stone Cave 🕳️",
      stormMinutesLeft: 45,
      shortLines: [
        "They are safe inside the cave. 🕳️",
        "Look! An old box in the stone wall. 📦",
        "Solve the riddle to unlock it!"
      ],
      spokenStory: "Inside the cave, look at the old box. Solve the riddle!",

      riddle: {
        text: "I help you find North, South, East, and West.\nI have a magnetic needle.\nWhat am I? 🧭",
        spoken: "I help you find North, South, East, and West. What am I?",
        answer: "compass",
        acceptableAnswers: ["compass", "a compass"],
        hintIcon: "🧭",
        hintText: "It shows directions: N, S, E, W"
      },

      mapMove: {
        instruction: "Move explorer: GO NORTH ⬆️ ➔ TURN EAST ➡️",
        steps: ["north", "east"]
      },

      clilBadge: { word: "COMPASS 🧭", shortDef: "Points North (⬆️), East (➡️), South (⬇️), West (⬅️)." }
    },

    // SCENE 4: SWELLING RIVER & FLOOD SCIENCE
    {
      sceneNum: 4,
      id: "scene_4",
      title: "SCENE 4 — THE HIGH RIVER",
      location: "The River Gorge 🌊",
      stormMinutesLeft: 38,
      shortLines: [
        "They reach the river. 🌊",
        "The water is high and fast! 💧💧💧",
        "The bridge is broken! 🌉❌"
      ],
      spokenStory: "The river is high! The bridge is broken!",

      floodCycle: [
        { icon: "🌧️", label: "More Rain" },
        { icon: "➔", label: "" },
        { icon: "💧💧💧", label: "More Water" },
        { icon: "➔", label: "" },
        { icon: "🌊 ⬆️", label: "River Rises" },
        { icon: "➔", label: "" },
        { icon: "🚨 FLOOD", label: "Flooding!" }
      ],

      prompt: "What will happen to the river if it keeps raining?",
      sentenceFrame: "The river will ___ because ___.",

      predictionOptions: [
        { id: "flood", icon: "🌊 ⬆️", text: "The river will rise and flood.", isBest: true, reason: "More rain ➔ more water ➔ flooding." },
        { id: "dry", icon: "🏖️", text: "The river will dry up.", isBest: false, reason: "Rain makes more water, not less." },
        { id: "freeze", icon: "🧊", text: "The river will turn to ice.", isBest: false, reason: "It is warm rain." }
      ],

      clilBadge: { word: "FLOOD 🌊", shortDef: "When river water rises over the land." }
    },

    // SCENE 5: ROUTE DECISION
    {
      sceneNum: 5,
      id: "scene_5",
      title: "SCENE 5 — WHICH WAY IS SAFE?",
      location: "The Crossroads 🗺️",
      stormMinutesLeft: 30,
      shortLines: [
        "The bridge is broken. 🌉❌",
        "Look at the map. 🗺️",
        "Which way is safe?"
      ],
      spokenStory: "The bridge is broken. Look at the map. Which way is safe?",

      routes: [
        { id: "route_a", icon: "🌊 ❌", text: "Route A: Cross the river", isSafe: false, reason: "Dangerous! Deep fast water." },
        { id: "route_b", icon: "🌲 ✅", text: "Route B: Forest high path", isSafe: true, reason: "Safest! High ground away from floods." },
        { id: "route_c", icon: "🌋 ❌", text: "Route C: Volcano ledge", isSafe: false, reason: "Dangerous! Loose hot rocks." }
      ],

      prompt: "Which route should they choose?",
      sentenceFrame: "They should choose Route ___ because ___."
    },

    // SCENE 6: THE FOREST & ANIMAL HABITAT
    {
      sceneNum: 6,
      id: "scene_6",
      title: "SCENE 6 — THE FOREST HABITAT",
      location: "The Green Forest 🌲",
      stormMinutesLeft: 24,
      shortLines: [
        "The forest path is high and safe. 🌲",
        "Emma spots animal tracks in the mud! 🐾",
        "Look! A nest with berries in a hollow tree! 🍒"
      ],
      spokenStory: "Look! Animal tracks and berries in a hollow tree!",

      prompt: "What will they find nearby?",
      sentenceFrame: "I think they will find a ___ because ___.",

      predictionOptions: [
        { id: "animal", icon: "🐾 🐒", text: "A small forest animal.", isBest: true, reason: "Tracks + food + nest = animal habitat." },
        { id: "car", icon: "🚗", text: "A city car.", isBest: false, reason: "No cars in a mountain forest." },
        { id: "ship", icon: "🚢", text: "A giant ship.", isBest: false, reason: "Ships stay in the ocean." }
      ],

      clilBadge: { word: "HABITAT 🐾", shortDef: "Where an animal lives, finds food, and stays safe." }
    },

    // SCENE 7: LOST COMPASS & SUN NAVIGATION
    {
      sceneNum: 7,
      id: "scene_7",
      title: "SCENE 7 — LOST COMPASS!",
      location: "Forest Clearing 🌲",
      stormMinutesLeft: 18,
      shortLines: [
        "A playful lemur took the compass! 🐒 🧭",
        "We don't have the compass now! ❌",
        "How can we find North? 🧭"
      ],
      spokenStory: "The lemur took the compass! How can we find North?",

      natureFact: "☀️ The sun rises in the EAST. 🌲 Moss grows on the NORTH side of trees.",

      prompt: "How can we find North without a compass?",
      sentenceFrame: "We can look at ___ because ___.",

      decisionOptions: [
        { id: "nature", icon: "🌲 ☀️", text: "Look at the tree moss and sun.", isBest: true, reason: "Nature shows direction: moss = North, sun = East/West." },
        { id: "run", icon: "🏃 ❓", text: "Run around randomly.", isBest: false, reason: "You will get lost!" },
        { id: "sleep", icon: "😴", text: "Go to sleep.", isBest: false, reason: "The storm is coming soon!" }
      ]
    },

    // SCENE 8: THE VOLCANO & MAGMA VS LAVA
    {
      sceneNum: 8,
      id: "scene_8",
      title: "SCENE 8 — THE HOT VOLCANO",
      location: "The Volcano Plateau 🌋",
      stormMinutesLeft: 12,
      shortLines: [
        "The ground is getting hot! 🌡️ 58°C",
        "White smoke is rising from cracks. 💨",
        "The volcano is active! 🌋"
      ],
      spokenStory: "The ground is hot! Smoke is rising from the rocks! Look at the volcano.",

      volcanoDiagram: [
        { label: "UNDER GROUND: MAGMA 🪨 🔥", desc: "Hot melted rock under the ground." },
        { label: "ON SURFACE: LAVA 🌋 🔥", desc: "Hot melted rock that comes out." }
      ],

      prompt: "What might happen near the hot rocks?",
      sentenceFrame: "The ground might ___ because ___.",

      predictionOptions: [
        { id: "hot_gas", icon: "💨 🔥", text: "Hot smoke and steam will rise.", isBest: true, reason: "Hot ground + smoke = active volcano." },
        { id: "ice_cubes", icon: "🧊", text: "Ice will freeze on the ground.", isBest: false, reason: "It is 58°C hot!" },
        { id: "flowers", icon: "🌸", text: "Flowers will grow instantly.", isBest: false, reason: "Hot volcanic rock does not grow flowers." }
      ],

      clilBadge: { word: "MAGMA & LAVA 🌋", shortDef: "Magma = under ground. Lava = comes out." }
    },

    // SCENE 9: THE SECRET PATH & MEMORY CHECK
    {
      sceneNum: 9,
      id: "scene_9",
      title: "SCENE 9 — CHOOSE THE SAFE PATH",
      location: "Mountain Pass ⛰️",
      stormMinutesLeft: 6,
      shortLines: [
        "Two paths lead to Station Alpha. 🏛️",
        "• Path A: Hot smoking rocks. 🌋 🔥",
        "• Path B: Cool stone path. 🌲 🪨"
      ],
      spokenStory: "Two paths! Path A has hot smoking rocks. Path B is cool. Which path is safe?",

      memoryCheck: {
        question: "Why is Path A dangerous? (Remember Scene 8!)",
        spoken: "Why is Path A dangerous?",
        options: [
          { icon: "🌋 🔥", text: "It is near hot volcanic magma vents. ✅", isCorrect: true },
          { icon: "🌊", text: "It is under water.", isCorrect: false },
          { icon: "❄️", text: "It is covered in ice.", isCorrect: false }
        ]
      },

      decisionOptions: [
        { id: "path_b", icon: "🌲 🪨 ✅", text: "Path B (Cool stone path)", isBest: true, reason: "Safe! Away from hot volcanic vents." },
        { id: "path_a", icon: "🌋 🔥 ❌", text: "Path A (Hot smoking rocks)", isBest: false, reason: "Dangerous heat and smoke!" }
      ]
    },

    // SCENE 10: RESEARCH STATION ALPHA
    {
      sceneNum: 10,
      id: "scene_10",
      title: "SCENE 10 — STATION ALPHA!",
      location: "Summit Station Alpha 🏛️",
      stormMinutesLeft: 1,
      shortLines: [
        "Thunder roars! ⚡ ⛈️",
        "They reached Station Alpha! 🏛️",
        "Unlock the door using the 4 clues!"
      ],
      spokenStory: "Thunder! They reached Station Alpha! Unlock the door with the four clues!",

      clueKeys: [
        { icon: "⛈️", label: "Weather", val: "STORM" },
        { icon: "🧭", label: "Direction", val: "NORTH" },
        { icon: "🌊", label: "Water", val: "FLOOD" },
        { icon: "🌋", label: "Earth", val: "MAGMA" }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXPEDITION_TRAINING_DATA, EXPEDITION_DATA };
}
