/**
 * INVENTOR'S FORGE — CURRICULUM REGISTRY & GAMEPLAY DATA
 * Grade 3–5 | CLIL Science & Design Thinking (A1+/A2)
 * Pure Vanilla ES6+ | Zero External Dependencies
 */
(function(root) {
  'use strict';

  const INVENTOR_FORGE_DATA = {
    meta: {
      id: "inventor-forge",
      title: "Inventor's Forge: The Apprentice Quest",
      subtitle: "Reconnect historical relics • Craft prototypes with 'Try Again' buffs • Deliver a 60s pitch",
      grade: "Grade 3–5",
      level: "A1 / A2",
      cefrLevel: "A1+",
      languageFocus: "People invented [item] to [verb]. My invention solves [problem] by [mechanic].",
      totalXP: 150,
      stageXP: {
        stage1: 50,
        stage2: 50,
        stage3: 50
      },
      insightBuffXP: 10
    },

    // =========================================================================
    // STAGE 1: THE ARCHIVE VAULT (HISTORICAL INVENTORS & TRY-AGAIN MINDSETS)
    // =========================================================================
    historicalInventors: [
      {
        id: "edison",
        name: "Thomas Edison",
        year: "1879",
        icon: "💡",
        invention: "Long-Lasting Electric Light Bulb",
        portraitTheme: "electric-glow",
        problemSolved: "Gas lamps were dangerous, smoky, and caused indoor fires.",
        obstacleFaced: "He tested over 1,000 different materials for the glowing wire (filament) and they all burned out in seconds!",
        tryAgainMindset: "He never gave up. He said: 'I have not failed 1,000 times! I successfully discovered 1,000 ways that do not work!'",
        solutionFound: "He carbonized a strip of Japanese bamboo, which burned steadily for over 1,200 continuous hours.",
        question: "What problem was Thomas Edison trying to solve?",
        options: [
          "Gas lamps and open flames were dangerous and dim",
          "People needed to travel across the ocean",
          "Horses were too slow on muddy roads"
        ],
        correctIndex: 0,
        insightBuff: "+10 Insight XP (Resilience Formula Unlocked)"
      },
      {
        id: "davinci",
        name: "Leonardo da Vinci",
        year: "1485",
        icon: "🪂",
        invention: "Biomimetic Parachute & Flying Wing",
        portraitTheme: "parchment-sketch",
        problemSolved: "Humans could not travel through the sky or survive falls from high cliffs.",
        obstacleFaced: "People laughed at him and told him humans were too heavy to ever fly like birds.",
        tryAgainMindset: "He spent hours in fields observing birds, bats, and falling sycamore seeds to copy nature's shapes (Biomimicry).",
        solutionFound: "He drew a sealed pyramid of linen cloth 12 arm-lengths wide, proving air resistance could carry human weight safely.",
        question: "How did Leonardo da Vinci design his flying inventions?",
        options: [
          "He studied bird wings and falling seeds in nature",
          "He bought ready-made engines at a store",
          "He used heavy iron chains and steam"
        ],
        correctIndex: 0,
        insightBuff: "+10 Insight XP (Biomimicry Formula Unlocked)"
      },
      {
        id: "benz",
        name: "Karl Benz",
        year: "1886",
        icon: "🚗",
        invention: "The Patent Motorwagen (First Automobile)",
        portraitTheme: "steampunk-gear",
        problemSolved: "Horses were slow, tired easily, and left messy streets.",
        obstacleFaced: "His first engine sputtered, broke its chain, and scared neighbors when it backfired loudly.",
        tryAgainMindset: "Karl Benz rebuilt the ignition system three times until his wife, Bertha Benz, took it on the world's first 66-mile road trip.",
        solutionFound: "He paired a lightweight four-stroke combustion engine with a 3-wheeled tubular steel chassis.",
        question: "Why did Karl Benz iterate his engine three times?",
        options: [
          "His first models backfired, so he kept testing and refining",
          "He wanted to build an airplane instead",
          "The police told him to stop inventing"
        ],
        correctIndex: 0,
        insightBuff: "+10 Insight XP (Mechanical Iteration Unlocked)"
      },
      {
        id: "wright",
        name: "The Wright Brothers",
        year: "1903",
        icon: "✈️",
        invention: "First Controlled Powered Flight (The Flyer)",
        portraitTheme: "wind-tunnel",
        problemSolved: "Gliders constantly crashed because pilots could not steer in crosswinds.",
        obstacleFaced: "Their first glider lost lift and slammed into sandy dunes over 50 times in Kitty Hawk.",
        tryAgainMindset: "They built a homemade 6-foot wind tunnel to measure wing lift instead of guessing.",
        solutionFound: "They invented 3-axis flight controls: wing-warping for roll, elevator for pitch, and rudder for yaw.",
        question: "What tool did the Wright Brothers build after their glider crashed?",
        options: [
          "A small wind tunnel to test wing shapes scientifically",
          "A giant rocket engine",
          "A wooden bicycle with wings"
        ],
        correctIndex: 0,
        insightBuff: "+10 Insight XP (Scientific Testing Unlocked)"
      }
    ],

    // =========================================================================
    // STAGE 2: THE CORE LOOP WORKSHOP (OBSTACLES + MODERN RELICS)
    // =========================================================================
    everydayObstacles: [
      {
        id: "obs-backpack",
        title: "The Dark Backpack Dilemma",
        category: "School & Daily Life",
        icon: "🎒",
        difficulty: "Apprentice",
        problemSummary: "Students waste minutes rummaging inside dark, deep backpacks searching for dropped keys and pencils.",
        targetNeed: "Needs instant hands-free visibility without draining bulky batteries.",
        accentColor: "#38bdf8"
      },
      {
        id: "obs-rainwalker",
        title: "The Soggy Rainwalker Dilemma",
        category: "Weather & Commute",
        icon: "🌧️",
        difficulty: "Journeyman",
        problemSummary: "When walking in storms with bags, umbrellas turn inside-out, soak backpacks, and slip from wet hands.",
        targetNeed: "Needs storm-deflecting toughness and a reliable non-slip grip.",
        accentColor: "#38bdf8"
      },
      {
        id: "obs-noisy-desk",
        title: "The Noisy Study Station Dilemma",
        category: "Focus & Learning",
        icon: "📢",
        difficulty: "Artisan",
        problemSummary: "Loud construction hammering and traffic outside disrupt students doing important homework.",
        targetNeed: "Needs localized silence that powers itself all afternoon.",
        accentColor: "#c084fc"
      },
      {
        id: "obs-rolling-pencil",
        title: "The Rolling Pencil Annoyance",
        category: "Classroom Ergonomics",
        icon: "✏️",
        difficulty: "Apprentice",
        problemSummary: "Round pens and pencils roll off slanted desks, dropping on floors and breaking graphite tips.",
        targetNeed: "Needs anti-roll stability and smart desk anchoring.",
        accentColor: "#10b981"
      }
    ],

    modernRelics: [
      {
        id: "relic-solar",
        name: "Micro Solar Strip",
        code: "RELIC-SOLAR",
        icon: "☀️",
        category: "Energy",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        powerType: "Ambient Light Energy",
        trait: "Trickle-charges electronic circuits silently using classroom lights.",
        actionVerb: "absorbs ambient light to power"
      },
      {
        id: "relic-motion",
        name: "Kinetic Motion Sensor",
        code: "RELIC-MOTION",
        icon: "📡",
        category: "Intelligence",
        color: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.4)",
        powerType: "Infrared Proximity",
        trait: "Detects hands or motion within 30 cm to trigger systems hands-free.",
        actionVerb: "senses movement within 30 centimeters to trigger"
      },
      {
        id: "relic-hex-grip",
        name: "Ultra-Grip Hex Rubber",
        code: "RELIC-GRIP",
        icon: "🛑",
        category: "Material",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.4)",
        powerType: "Biomimetic Friction",
        trait: "6-sided silicone sleeve that stops rolling and sticks with micro-suction.",
        actionVerb: "grips slanted surfaces with 6-sided micro-suction to stabilize"
      },
      {
        id: "relic-soundpod",
        name: "Acoustic Noise-Canceler",
        code: "RELIC-AUDIO",
        icon: "🎧",
        category: "Acoustics",
        color: "#c084fc",
        glow: "rgba(192, 132, 252, 0.4)",
        powerType: "Inverted Sound Waves",
        trait: "Emits inverted sound waves that silence harsh external clatter.",
        actionVerb: "emits anti-phase acoustic waves to cancel"
      },
      {
        id: "relic-hydro",
        name: "Hydro-Shield Nano Coating",
        code: "RELIC-HYDRO",
        icon: "💧",
        category: "Material",
        color: "#0284c7",
        glow: "rgba(2, 132, 199, 0.4)",
        powerType: "Nanotech Lotus Effect",
        trait: "Deflects rain droplets instantly so moisture rolls off like mercury.",
        actionVerb: "repels water droplets with nano-lotus textures to protect"
      },
      {
        id: "relic-fiber",
        name: "Flexible LED Fiber Ribbon",
        code: "RELIC-FIBER",
        icon: "💡",
        category: "Optics",
        color: "#f43f5e",
        glow: "rgba(244, 63, 94, 0.4)",
        powerType: "Cool-Touch Luminescence",
        trait: "Bendable, high-efficiency fiber-optic tape that illuminates corners.",
        actionVerb: "emits cool neon light across tight corners to illuminate"
      }
    ],

    // Known signature recipes (Custom combos also dynamically supported!)
    recipes: {
      "obs-backpack+relic-motion+relic-fiber": {
        name: "The Lumina-Finder Backpack",
        tagline: "Wave your hand into your bag, and neon fiber ribbons illuminate every pocket!",
        formula: "The Lumina-Finder Backpack uses a Kinetic Motion Sensor and Flexible LED Fiber to illuminate the bottom of dark schoolbags hands-free."
      },
      "obs-rainwalker+relic-hydro+relic-hex-grip": {
        name: "The Storm-Grip Aeroshield",
        tagline: "A hydrophobic canopy that never drenches and a hex-suction handle that never slips in gales!",
        formula: "The Storm-Grip Aeroshield uses Hydro-Shield Nano Coating and Ultra-Grip Hex Rubber to repel rainwater and provide a slip-proof grip in heavy winds."
      },
      "obs-noisy-desk+relic-solar+relic-soundpod": {
        name: "The Solar Silent Study Halo",
        tagline: "An archway powered by desk light that creates an invisible bubble of silence!",
        formula: "The Solar Silent Study Halo uses Micro Solar Strips and an Acoustic Noise-Canceler to eliminate harsh construction noise using solar power."
      },
      "obs-rolling-pencil+relic-hex-grip+relic-motion": {
        name: "The Hexa-Stay Smart Stylus",
        tagline: "A hexagon anti-roll body with an alert glow whenever your hand steps away!",
        formula: "The Hexa-Stay Smart Stylus uses Ultra-Grip Hex Rubber and a Motion Sensor to lock pencils to desks and notify you if your pencil drops."
      }
    },

    // =========================================================================
    // STAGE 3: THE PITCH ARENA (60-SECOND CAPSTONE PRESENTATION)
    // =========================================================================
    pitchDeck: {
      timerSeconds: 60,
      targetFrames: [
        {
          id: "card-hook",
          stepNumber: 1,
          title: "The Problem Hook",
          role: "Identify Everyday Frustration",
          template: "Good morning, Grand Guild Investors! Have you ever struggled with [OBSTACLE_TITLE]? Everyday students face this annoying problem because [OBSTACLE_SUMMARY]!",
          cue: "Speak with passion and eye contact!"
        },
        {
          id: "card-name",
          stepNumber: 2,
          title: "The Innovation Reveal",
          role: "Announce Your Prototype",
          template: "Today, we are proud to introduce our breakthrough prototype: [INVENTION_NAME]! It was forged directly inside the Inventor's Workshop.",
          cue: "Hold up your blueprint with pride!"
        },
        {
          id: "card-mechanism",
          stepNumber: 3,
          title: "The Tech Mechanism",
          role: "Explain How It Works",
          template: "It works by fusing two modern relics: [RELIC_1_NAME] and [RELIC_2_NAME]. When activated, it [ACTION_FORMULA]!",
          cue: "Show the components working together!"
        },
        {
          id: "card-call",
          stepNumber: 4,
          title: "The Grand Call to Action",
          role: "Persuade Guild Investors",
          template: "With [INVENTION_NAME], no one will ever suffer from [OBSTACLE_TITLE] again! Who will join us and invest in the future of young inventors?",
          cue: "Deliver your closing call with energy!"
        }
      ]
    }
  };

  root.INVENTOR_FORGE_DATA = INVENTOR_FORGE_DATA;
})(typeof window !== 'undefined' ? window : global);
