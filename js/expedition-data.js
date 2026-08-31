/**
 * THE LAST EXPEDITION: A Grade 4 CLIL Prediction & Problem-Solving Game
 * Simplified English + Rich Visual Symbols + Core CLIL Concepts
 */

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
  module.exports = EXPEDITION_DATA;
}
