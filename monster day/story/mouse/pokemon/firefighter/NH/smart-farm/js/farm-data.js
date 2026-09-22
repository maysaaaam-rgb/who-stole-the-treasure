/**
 * THE SMART FARM — YOUNG INVENTORS MISSION
 * Game Curriculum Data, Dialogues, Missions, and Invention Parts Catalog
 * Target: Children 7-10 | CEFR A1-A1+
 */
(function(root) {
  'use strict';

  const FARM_DATA = {
    meta: {
      id: 'smart-farm',
      title: '🌾 The Smart Farm: Young Inventors Mission',
      subtitle: 'Solve Failures • Program Robots • Build Inventions',
      targetAge: '7–10',
      level: 'A1 / A1+',
      totalXP: 200
    },

    // Companion Guide Robot
    companion: {
      name: 'Robo-Sprout',
      avatarIcon: '🤖',
      introQuote: "Beep-boop! Young Inventor! We need your help! The smart farm lost its power and the animals are waiting for us!",
      dialogues: {
        intro: "Power is down across the farm! Tap Mission 1 to save the thirsty cow!",
        cowSolved: "Awesome job! You connected the pipes! The cow has fresh water to drink!",
        chickenSolved: "Brilliant! The chicken is warm and cozy now! Great climate control!",
        robotSolved: "Super programming! The boxes are safely moved to the barn!",
        labReady: "All emergency repairs done! Now enter the Inventor Lab to build your dream farm machine!",
        victory: "Hooray! The Smart Farm is 100% powered and fully automated! You are a true Master Inventor!"
      }
    },

    // Farm Zones on the interactive map
    zones: [
      {
        id: 'zone-cow',
        missionId: 1,
        title: 'Cow Pasture',
        icon: '🐄',
        status: 'unlocked', // unlocked | completed | locked
        previewText: 'Save the Thirsty Cow',
        targetSentence: 'The cow needs water.',
        unlockedPart: 'Hydro-Sprayer & Water Valve',
        badge: 'Water Engineer'
      },
      {
        id: 'zone-chicken',
        missionId: 2,
        title: 'Smart Chicken House',
        icon: '🐔',
        status: 'locked',
        previewText: 'Warm the Cold Chicken',
        targetSentence: 'The chicken is cold. Make it warm!',
        unlockedPart: 'Thermo-Heater & Solar Cell',
        badge: 'Climate Master'
      },
      {
        id: 'zone-robot',
        missionId: 3,
        title: 'Silo & Storage Depot',
        icon: '🤖',
        status: 'locked',
        previewText: 'Program the Farm Robot',
        targetSentence: 'Program the robot to carry heavy boxes.',
        unlockedPart: 'Heavy-Duty Robot Chassis',
        badge: 'Code Commander'
      },
      {
        id: 'zone-lab',
        missionId: 4,
        title: 'Inventor Lab',
        icon: '🛠️',
        status: 'locked',
        previewText: 'Build Your Custom Machine',
        targetSentence: 'Combine parts to create your own invention!',
        unlockedPart: 'Master Inventor Trophy',
        badge: 'Young Inventor Laureate'
      }
    ],

    // Mission 1: Pipe Puzzle Layout (4x3 Grid)
    // Types: 'straight-h', 'straight-v', 'corner-tr', 'corner-br', 'corner-bl', 'corner-tl', 'cross'
    pipePuzzle: {
      gridCols: 4,
      gridRows: 3,
      startCell: { row: 0, col: 0, fromDir: 'left' }, // Water Tank at top-left
      targetCell: { row: 2, col: 3, toDir: 'right' },  // Cow Trough at bottom-right
      cells: [
        // Row 0
        { id: 'p-0-0', row: 0, col: 0, type: 'corner-br', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-0-1', row: 0, col: 1, type: 'straight-h', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-0-2', row: 0, col: 2, type: 'corner-bl', rotation: 180, targetRotation: 90, fixed: false },
        { id: 'p-0-3', row: 0, col: 3, type: 'straight-v', rotation: 0, targetRotation: 90, fixed: false },
        // Row 1
        { id: 'p-1-0', row: 1, col: 0, type: 'straight-v', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-1-1', row: 1, col: 1, type: 'corner-tr', rotation: 0, targetRotation: 270, fixed: false },
        { id: 'p-1-2', row: 1, col: 2, type: 'corner-br', rotation: 180, targetRotation: 0, fixed: false },
        { id: 'p-1-3', row: 1, col: 3, type: 'straight-v', rotation: 90, targetRotation: 0, fixed: false },
        // Row 2
        { id: 'p-2-0', row: 2, col: 0, type: 'corner-tr', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-2-1', row: 2, col: 1, type: 'straight-h', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-2-2', row: 2, col: 2, type: 'straight-h', rotation: 90, targetRotation: 0, fixed: false },
        { id: 'p-2-3', row: 2, col: 3, type: 'corner-tl', rotation: 180, targetRotation: 180, fixed: false }
      ]
    },

    // Mission 2: Chicken Coop Climate Controls
    climateGame: {
      initialTemp: 12, // too cold (shivering)
      targetTempMin: 21,
      targetTempMax: 25,
      states: {
        cold: { maxTemp: 18, emoji: '🥶', label: 'Cold', mood: 'shivering', speech: "Brrr! It is cold!" },
        ideal: { minTemp: 21, maxTemp: 25, emoji: '😊', label: 'Warm & Cozy', mood: 'happy', speech: "Cluck! It is warm and nice!" },
        hot: { minTemp: 28, emoji: '🥵', label: 'Hot', mood: 'panting', speech: "Phew! It is too hot!" }
      }
    },

    // Mission 3: Robot Block Sequencing Game
    robotGame: {
      gridCols: 5,
      startPos: { x: 0, y: 0 },
      boxPos: { x: 2, y: 0 },
      dropPos: { x: 4, y: 0 },
      availableBlocks: [
        { id: 'cmd-go', label: 'GO FORWARD', icon: '▶️', action: 'go' },
        { id: 'cmd-pickup', label: 'PICK UP BOX', icon: '📦', action: 'pickup' },
        { id: 'cmd-carry', label: 'CARRY BOX', icon: '🚚', action: 'carry' },
        { id: 'cmd-stop', label: 'STOP & UNLOAD', icon: '🛑', action: 'stop' }
      ],
      correctSequence: ['go', 'pickup', 'carry', 'stop']
    },

    // Mission 4: Modular Invention Lab Catalog
    inventionCatalog: {
      bodies: [
        { id: 'b-crawler', name: 'Smart Agro-Rover', icon: '🚜', speed: 'Steady', bonus: '+20 Strength', description: 'Tough all-terrain robotic treads.' },
        { id: 'b-drone', name: 'Sky-Crop Drone', icon: '🚁', speed: 'Super Fast', bonus: '+25 Agility', description: 'Quad-propellers for high aerial tasks.' },
        { id: 'b-walker', name: 'Bipedal Helper Bot', icon: '🤖', speed: 'Nimble', bonus: '+15 Dexterity', description: 'Cute two-legged robot that climbs steps.' },
        { id: 'b-sub', name: 'Hydro-Float Craft', icon: '⛵', speed: 'Gliding', bonus: '+20 Eco-Flow', description: 'Smooth floating hull for pond and ditch navigation.' }
      ],
      powers: [
        { id: 'p-solar', name: 'Ultra Solar Wing', icon: '☀️', eco: 'Clean Light Energy', color: '#f59e0b', description: 'Absorbs sunlight to work all day.' },
        { id: 'p-wind', name: 'Whirlwind Turbine', icon: '💨', eco: 'Breeze Kinetic Power', color: '#06b6d4', description: 'Spins gently in the country wind.' },
        { id: 'p-bio', name: 'Eco Bio-Battery', icon: '🔋', eco: 'Organic Recharge', color: '#10b981', description: 'Powered by apple peels and plant compost.' }
      ],
      tools: [
        { id: 't-water', name: 'Hydro-Water Cannon', icon: '💧', actionWord: 'gives water', purpose: 'It gives water to thirsty animals.' },
        { id: 't-food', name: 'Auto-Feeder Hopper', icon: '🌾', actionWord: 'gives food', purpose: 'It dispenses delicious fresh grain.' },
        { id: 't-heat', name: 'Thermo-Glow Lamp', icon: '🔥', actionWord: 'keeps animals warm', purpose: 'It provides cozy warmth on chilly nights.' },
        { id: 't-lift', name: 'Robo-Crane Forklift', icon: '🏗️', actionWord: 'carries things', purpose: 'It lifts and carries heavy farm supplies.' },
        { id: 't-seeds', name: 'Precision Seed-Planter', icon: '🌱', actionWord: 'plants vegetables', purpose: 'It gently plants carrots and lettuce.' }
      ],
      recipients: [
        { id: 'r-cow', name: 'The Cow', icon: '🐄', label: 'Cow (Water & Food)' },
        { id: 'r-chicken', name: 'The Chicken', icon: '🐔', label: 'Chicken (Warmth & Seeds)' },
        { id: 'r-horse', name: 'The Horse', icon: '🐴', label: 'Horse (Feed & Transport)' },
        { id: 'r-sheep', name: 'The Sheep', icon: '🐑', label: 'Sheep (Care & Shelter)' }
      ]
    },

    // English Language Scaffolding Tokens (CEFR A1)
    languageFocus: {
      vocabulary: [
        { word: 'cow', icon: '🐄', meaning: 'a farm animal that gives milk' },
        { word: 'water', icon: '💧', meaning: 'liquid animals need to drink' },
        { word: 'chicken', icon: '🐔', meaning: 'a bird that lays eggs' },
        { word: 'warm', icon: '☀️', meaning: 'pleasantly comfortable temperature' },
        { word: 'cold', icon: '❄️', meaning: 'low temperature, chilly' },
        { word: 'robot', icon: '🤖', meaning: 'a helpful smart machine' },
        { word: 'carry', icon: '📦', meaning: 'to move something heavy' },
        { word: 'invention', icon: '💡', meaning: 'a brand new machine created by you' }
      ],
      sentenceTemplates: [
        "The cow needs water.",
        "It gives water to the cow.",
        "The chicken is warm and happy.",
        "The robot carries the heavy box.",
        "This is my new farm invention!"
      ]
    }
  };

  root.SMART_FARM_DATA = FARM_DATA;

})(typeof window !== 'undefined' ? window : global);
