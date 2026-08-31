/**
 * THE LAST EXPEDITION: A Grade 4 CLIL Prediction & Problem-Solving Game
 * Data structures for 10 cinematic scenes, 4 explorers, CLIL science models,
 * predictions, evidence options, routes, and vocabulary.
 */

const EXPEDITION_DATA = {
  mission: {
    title: "THE LAST EXPEDITION",
    subtitle: "A Grade 4 CLIL Prediction & Problem-Solving Game",
    goal: "REACH THE ABANDONED RESEARCH STATION BEFORE THE STORM!",
    initialStormMinutes: 60,
    targetLanguage: "Will / Might / Because / So / Sequencing (First, Then, Next, Finally)"
  },

  // 4 Illustrated Explorer Characters
  explorers: [
    {
      id: "maya",
      name: "Maya",
      role: "The Navigator",
      trait: "Careful & Observant",
      avatarClass: "avatar-exp-maya",
      description: "Always checks the map and remembers details from earlier scenes.",
      quote: "Let's check our compass and map before we move!"
    },
    {
      id: "leo",
      name: "Leo",
      role: "The Scout",
      trait: "Brave & Adventurous",
      avatarClass: "avatar-exp-leo",
      description: "Quick to act, loves exploring new trails, but sometimes takes risks.",
      quote: "I can climb ahead and check if the path is clear!"
    },
    {
      id: "emma",
      name: "Emma",
      role: "The Scientist",
      trait: "Science & Nature Expert",
      avatarClass: "avatar-exp-emma",
      description: "Notices weather shifts, rock temperatures, and animal habitats.",
      quote: "Look at the clouds and temperature — science explains what will happen!"
    },
    {
      id: "noah",
      name: "Noah",
      role: "The Camp Helper",
      trait: "Curious & Resourceful",
      avatarClass: "avatar-exp-noah",
      description: "Funny and observant, carries the supplies, but sometimes gets distracted.",
      quote: "I've got the flashlights and snacks ready!"
    }
  ],

  // 10 Major Scenes with Prediction and CLIL Mechanics
  scenes: [
    // =======================================================================
    // SCENE 1: THE DARK CLOUDS
    // =======================================================================
    {
      sceneNum: 1,
      id: "scene_1",
      title: "SCENE 1 — THE DARK CLOUDS",
      location: "Expedition Base Beach",
      stormMinutesLeft: 55,
      storyText: "The four explorers arrive on the island under bright sunshine. But as they look up toward the high mountain peak, dark purple clouds begin rolling in rapidly from the sea. The wind starts to pick up.",
      spokenStory: "The four explorers arrive on the island. The sun is shining, but dark purple clouds are forming over the mountain peak and the wind is blowing faster.",
      
      discussionPrompt: "Discuss with your team for 30 seconds: What will happen to the weather?",
      sentenceFrame: "I think ___ will ___ because ___.",

      predictionQuestion: "What will happen next with the weather?",
      spokenQuestion: "What will happen next with the weather?",
      predictionOptions: [
        { id: "rain", text: "Heavy rain will start soon.", isBest: true, reason: "Dark thick clouds over mountains indicate precipitation." },
        { id: "sunny", text: "The weather will stay sunny and calm.", isBest: false, reason: "Dark clouds and rising wind contradict calm weather." },
        { id: "snow", text: "A heavy snowstorm will cover the beach.", isBest: false, reason: "Tropical island temperatures do not support sudden snow." }
      ],

      evidenceQuestion: "Which clue supports your prediction?",
      evidenceOptions: [
        { id: "ev_clouds", text: "Dark purple clouds forming over the mountain peak.", isCorrect: true },
        { id: "ev_sand", text: "The color of the beach sand.", isCorrect: false },
        { id: "ev_boat", text: "The boat docked at the shore.", isCorrect: false }
      ],

      clilVocab: {
        word: "STORM",
        definition: "A period of violent weather with heavy rain, dark clouds, and strong wind.",
        icon: "⛈️"
      }
    },

    // =======================================================================
    // SCENE 2: THE STORM BEGINS & FINDING SHELTER
    // =======================================================================
    {
      sceneNum: 2,
      id: "scene_2",
      title: "SCENE 2 — THE STORM BEGINS",
      location: "Coastal Ridge",
      stormMinutesLeft: 50,
      storyText: "Cold raindrops begin pounding the ground! The explorers need to protect their electronic equipment and research notes from the rain. They must find shelter immediately.",
      spokenStory: "Heavy rain starts falling! The explorers need a safe shelter to protect their equipment.",

      discussionPrompt: "Where should the explorers go to stay dry?",
      sentenceFrame: "They should go to ___ because ___.",

      decisionQuestion: "Where is the safest shelter from the storm?",
      decisionOptions: [
        { id: "cave", text: "The stone Cave on the cliff.", isBest: true, reason: "A solid rock cave provides dry overhead shelter from wind and heavy rain." },
        { id: "tree", text: "Under a tall tree in the open field.", isBest: false, reason: "Standing under isolated trees during lightning and storms is dangerous." },
        { id: "river_bank", text: "Right beside the river bank.", isBest: false, reason: "River banks can flood rapidly when heavy rain falls." }
      ],

      clilVocab: {
        word: "SHELTER",
        definition: "A safe, protected place that shields people and animals from bad weather or danger.",
        icon: "🕳️"
      }
    },

    // =======================================================================
    // SCENE 3: THE CAVE RIDDLE & THE COMPASS
    // =======================================================================
    {
      sceneNum: 3,
      id: "scene_3",
      title: "SCENE 3 — THE CAVE RIDDLE",
      location: "Crystal Stone Cave",
      stormMinutesLeft: 45,
      storyText: "Inside the dry cave, the explorers discover an old expedition chest carved into the stone wall. An ancient inscription guards the secret navigation tool.",
      spokenStory: "Inside the cave, the explorers find a stone chest with a riddle.",

      riddle: {
        text: "I can point the way,\nbut I cannot walk.\nI have four main directions: N, S, E, and W.\nMy magnetic needle always points North.\nWhat am I?",
        spoken: "I can point the way, but I cannot walk. I have four main directions: N, S, E, and W. What am I?",
        answer: "compass",
        acceptableAnswers: ["compass", "a compass", "the compass", "magnetic compass"],
        hints: [
          "Hint 1: Explorers hold it in their palm to find directions.",
          "Hint 2: The letters N, S, E, and W stand for North, South, East, West.",
          "Hint 3: It starts with C-O-M-P-A-S-S."
        ]
      },

      mapChallenge: {
        instruction: "Use the compass directions to trace the secret cave exit tunnel: Move NORTH ➔ Turn EAST ➔ Go STRAIGHT!",
        correctSteps: ["north", "east", "straight"]
      },

      clilVocab: {
        word: "COMPASS",
        definition: "A navigation instrument with a magnetic needle that points North, South, East, and West.",
        icon: "🧭"
      }
    },

    // =======================================================================
    // SCENE 4: THE RIVER & FLOOD SCIENCE
    // =======================================================================
    {
      sceneNum: 4,
      id: "scene_4",
      title: "SCENE 4 — THE SWELLING RIVER",
      location: "Gorge River Crossing",
      stormMinutesLeft: 38,
      storyText: "The team emerges from the cave and reaches the river. The water level has risen by two meters! Rapid, brown muddy water is rushing over the wooden bridge, tearing away the planks.",
      spokenStory: "The explorers reach the river. The water has risen rapidly, and the wooden bridge is broken and unsafe!",

      scienceModel: {
        title: "HYDROLOGY CAUSE & EFFECT CYCLE",
        steps: [
          "1. ☁️ Heavy Rain Falls from Storm Clouds",
          "2. 🌧️ Rainwater Runs off Mountains into Riverbeds",
          "3. 🌊 Water Level Rises Dramatically",
          "4. ⚠️ River Floods Surrounding Banks & Bridges"
        ]
      },

      predictionQuestion: "What will happen if the heavy rain continues for another hour?",
      predictionOptions: [
        { id: "flood", text: "The river will flood completely and wash away the banks.", isBest: true, reason: "Continuous runoff from mountains increases water volume causing severe flooding." },
        { id: "dry", text: "The river will dry up into sand.", isBest: false, reason: "Rain adds water, it does not dry up rivers." },
        { id: "freeze", text: "The river will freeze into solid ice.", isBest: false, reason: "Rainstorm temperatures in this region are above freezing." }
      ],

      clilVocab: {
        word: "FLOODING",
        definition: "When water overflows its natural riverbanks onto dry land due to heavy rain.",
        icon: "🌊"
      }
    },

    // =======================================================================
    // SCENE 5: CHOICE OF ROUTE
    // =======================================================================
    {
      sceneNum: 5,
      id: "scene_5",
      title: "SCENE 5 — THE ROUTE DECISION",
      location: "Valley Crossroads",
      stormMinutesLeft: 30,
      storyText: "The broken bridge blocks the direct path. The explorers examine their map. There are three possible ways around the gorge:",
      spokenStory: "The bridge is broken. The explorers must evaluate three different routes on their map to reach the research station.",

      routes: [
        {
          id: "route_a",
          name: "Route A: Wade across the flooded river",
          danger: "HIGH DANGER — Deep fast currents and rising water can sweep explorers away.",
          isSafe: false
        },
        {
          id: "route_b",
          name: "Route B: Forest Trail along the upper ridge",
          danger: "SAFEST ROUTE — Higher ground protects from flooding, trees provide windbreak.",
          isSafe: true
        },
        {
          id: "route_c",
          name: "Route C: Narrow rocky ledge near volcano base",
          danger: "UNSTABLE — Loose volcanic rocks and rising ground heat.",
          isSafe: false
        }
      ],

      discussionPrompt: "Which route should the explorers choose? Explain why using evidence!",
      sentenceFrame: "They should choose Route ___ because ___."
    },

    // =======================================================================
    // SCENE 6: THE FOREST & ANIMAL HABITAT
    // =======================================================================
    {
      sceneNum: 6,
      id: "scene_6",
      title: "SCENE 6 — THE ANIMAL HABITAT",
      location: "Upper Canopy Rainforest",
      stormMinutesLeft: 24,
      storyText: "The team takes the elevated forest trail. Emma notices strange three-toed paw prints in the soft mud, claw marks on low tree trunks, and a hollowed-out log filled with fresh berries.",
      spokenStory: "In the forest, Emma spots fresh paw prints, claw marks on trees, and a nest inside a hollow log.",

      clilConcept: {
        title: "ECOSYSTEM HABITAT",
        definition: "A habitat provides food, water, and shelter for specific living animals."
      },

      predictionQuestion: "What will the explorers encounter nearby based on these tracks and food?",
      predictionOptions: [
        { id: "animal", text: "A curious forest creature foraging for food before the storm.", isBest: true, reason: "Fresh paw prints, claw marks, and berry cache signify an active resident animal." },
        { id: "submarine", text: "A deep-sea submarine.", isBest: false, reason: "Submarines operate underwater, not inside mountain forests." },
        { id: "robot", text: "An ancient factory robot.", isBest: false, reason: "Tracks are biological animal prints, not mechanical tread marks." }
      ],

      clilVocab: {
        word: "HABITAT",
        definition: "The natural home or environment of an animal, plant, or other organism.",
        icon: "🐾"
      }
    },

    // =======================================================================
    // SCENE 7: LOST COMPASS & NATURAL NAVIGATION
    // =======================================================================
    {
      sceneNum: 7,
      id: "scene_7",
      title: "SCENE 7 — NATURAL NAVIGATION",
      location: "Deep Forest Clearing",
      stormMinutesLeft: 18,
      storyText: "A cheeky Golden Lemur darts down from the branches, snatches the shiny brass compass from Noah's pocket, and scurries up into the canopy! The explorers no longer have their compass.",
      spokenStory: "A playful lemur took the compass! The explorers must use natural clues and the sun to find East and North.",

      navigationClue: "Geography Fact: The sun rises in the East and sets in the West. Moss grows thicker on the cooler North side of trees.",

      decisionQuestion: "How can the explorers find North without the compass?",
      decisionOptions: [
        { id: "nature", text: "Look at the tree moss (North side) and the afternoon sun position.", isBest: true, reason: "Natural landmarks provide reliable directional orientation." },
        { id: "guess", text: "Close their eyes and run in a random direction.", isBest: false, reason: "Random running gets explorers deeper into wilderness." },
        { id: "wait", text: "Sit and wait until tomorrow morning.", isBest: false, reason: "The storm will arrive in 18 minutes; they must reach shelter now." }
      ]
    },

    // =======================================================================
    // SCENE 8: THE VOLCANO & MAGMA VS LAVA
    // =======================================================================
    {
      sceneNum: 8,
      id: "scene_8",
      title: "SCENE 8 — VOLCANIC SIGNS",
      location: "Volcanic Plateau",
      stormMinutesLeft: 12,
      storyText: "As they approach the plateau, the ground feels unusually hot under their boots. White sulfur smoke is venting from cracks in the dark basalt rocks, and the thermometer reads 58°C!",
      spokenStory: "The ground is hot, smoke is rising from rock cracks, and temperature is rising near the volcano.",

      clilScience: {
        title: "VOLCANO SCIENCE: MAGMA VS LAVA",
        terms: [
          { term: "MAGMA", def: "Hot molten liquid rock UNDER the Earth's surface." },
          { term: "LAVA", def: "Hot molten rock that has BROKEN OUT onto the Earth's surface." },
          { term: "VENTS", def: "Cracks where hot gases and smoke escape." }
        ]
      },

      predictionQuestion: "What might happen if they stay too close to the hot volcanic vents?",
      predictionOptions: [
        { id: "heat_danger", text: "The ground might crack and release hot steam and toxic gas.", isBest: true, reason: "Rising rock temperatures and venting indicate underground thermal activity." },
        { id: "ice_form", text: "The rocks will turn into cold ice cubes.", isBest: false, reason: "58°C heat prevents ice formation." },
        { id: "rain_stop", text: "The storm clouds will completely vanish.", isBest: false, reason: "Volcanic heat does not magically stop approaching regional storm fronts." }
      ],

      clilVocab: {
        word: "LAVA & MAGMA",
        definition: "Magma is melted rock inside Earth; Lava is melted rock on the surface.",
        icon: "🌋"
      }
    },

    // =======================================================================
    // SCENE 9: THE SECRET PATH & MEMORY CHECK
    // =======================================================================
    {
      sceneNum: 9,
      id: "scene_9",
      title: "SCENE 9 — THE FORK IN THE TRAIL",
      location: "High Mountain Pass",
      stormMinutesLeft: 6,
      storyText: "Two paths lead toward the research station ridge:\n• Path A crosses over black glowing rocks with rising smoke.\n• Path B descends through a cool, reinforced stone ravine.",
      spokenStory: "Two paths appear: Path A has hot smoking rocks. Path B goes through a cool stone ravine.",

      memoryCheck: {
        question: "Why is Path A dangerous based on what we learned in Scene 8?",
        spoken: "Why is Path A dangerous based on what we learned in Scene 8?",
        options: [
          { text: "It is close to hot volcanic magma vents and unstable ground ✅", isCorrect: true },
          { text: "It is flooded with ocean water", isCorrect: false },
          { text: "There are too many snowdrifts", isCorrect: false }
        ]
      },

      decisionQuestion: "Which path should the team take?",
      decisionOptions: [
        { id: "path_b", text: "Path B (Cool stone ravine)", isBest: true, reason: "Safely avoids geothermal heat and volcanic gas vents." },
        { id: "path_a", text: "Path A (Hot smoking rocks)", isBest: false, reason: "High risk of burns and unstable ground collapse." }
      ]
    },

    // =======================================================================
    // SCENE 10: THE ABANDONED RESEARCH STATION
    // =======================================================================
    {
      sceneNum: 10,
      id: "scene_10",
      title: "SCENE 10 — THE RESEARCH STATION",
      location: "Ridge Summit — Station Alpha",
      stormMinutesLeft: 1,
      storyText: "Thunder roars and lightning flashes across the sky! The explorers reach the steel blast doors of Station Alpha. The electronic keypad is locked. They must synthesize all 4 mission clues to unlock the shelter before the storm hits!",
      spokenStory: "Thunder roars! The explorers reach Station Alpha. Enter the four clue keys to open the blast doors!",

      clueKeys: [
        { id: "clue_weather", label: "Weather Clue", val: "STORM", desc: "Arriving storm front from the mountain." },
        { id: "clue_geo", label: "Direction Clue", val: "NORTH", desc: "The compass and moss pointed North." },
        { id: "clue_water", label: "Hydrology Clue", val: "FLOOD", desc: "Heavy rain causes river flooding." },
        { id: "clue_science", label: "Earth Science Clue", val: "MAGMA", desc: "Underground molten rock heating the plateau." }
      ],

      finalAction: "UNLOCK BLAST DOORS & ENTER STATION"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPEDITION_DATA;
}
