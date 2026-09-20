/**
 * NASA MISSION: FIND A NEW PLANET — CURRICULUM DATA MODULE
 * Primary CLIL / A1–A1+ ESL Educational Space Expedition
 */
(function(root) {
  'use strict';

  const NASA_MISSION_DATA = {
    meta: {
      id: 'nasa-mission',
      title: 'NASA Mission: Find a New Planet',
      subtitle: 'Space Explorer • CLIL & Phonics Mission',
      grade: 'Grade 3–4',
      level: 'A1 / A1+',
      totalStages: 6,
      targetXp: 150
    },

    // =========================================================================
    // STAGE 1: PRE-FLIGHT BOOSTER (Phonics: CVC vs. CVCe / Magic "e")
    // =========================================================================
    stage1_phonics: {
      title: "Pre-Flight Booster",
      subtitle: "Add Magic 'E' to boost the rocket engine!",
      instructions: "Listen to the word. Click the Magic 'E' power crystal to transform the sound and fuel your thrusters!",
      fuelPerCorrect: 25,
      targetFuel: 100,
      drills: [
        {
          id: "cap-cape",
          baseWord: "CAP",
          magicWord: "CAPE",
          vowel: "a",
          phoneticShort: "/æ/ as in cat",
          phoneticLong: "/eɪ/ as in cake",
          promptAudio: "The astronaut needs a space CAPE! Add Magic E to fuel the rocket!",
          sentence: "The astronaut wears a flying cape.",
          meaning: "From a little hat to a flying hero cape!"
        },
        {
          id: "kit-kite",
          baseWord: "KIT",
          magicWord: "KITE",
          vowel: "i",
          phoneticShort: "/ɪ/ as in sit",
          phoneticLong: "/aɪ/ as in fly",
          promptAudio: "Fly high like a KITE! Add Magic E to power up!",
          sentence: "A kite flies high in the sky.",
          meaning: "From a tool kit to a soaring kite!"
        },
        {
          id: "hop-hope",
          baseWord: "HOP",
          magicWord: "HOPE",
          vowel: "o",
          phoneticShort: "/ɒ/ as in hot",
          phoneticLong: "/oʊ/ as in boat",
          promptAudio: "We HOPE to find life in space! Add Magic E!",
          sentence: "We hope to discover a new home.",
          meaning: "From a bunny hop to our biggest hope!"
        },
        {
          id: "cut-cute",
          baseWord: "CUT",
          magicWord: "CUTE",
          vowel: "u",
          phoneticShort: "/ʌ/ as in cup",
          phoneticLong: "/juː/ as in music",
          promptAudio: "Look at that CUTE alien pet! Add Magic E!",
          sentence: "The space alien is very cute.",
          meaning: "From scissors that cut to a cute companion!"
        },
        {
          id: "pin-pine",
          baseWord: "PIN",
          magicWord: "PINE",
          vowel: "i",
          phoneticShort: "/ɪ/ as in pin",
          phoneticLong: "/aɪ/ as in line",
          promptAudio: "Plant a green PINE tree on Mars! Add Magic E!",
          sentence: "We need green pine trees for oxygen.",
          meaning: "From a tiny metal pin to a giant pine tree!"
        }
      ]
    },

    // =========================================================================
    // STAGE 2: PLANET PROBE SCANNER (Visual Adjectives & Physical Traits)
    // =========================================================================
    stage2_probe: {
      title: "Planet Probe Scanner",
      subtitle: "Scan uncharted alien terrain for survival clues!",
      instructions: "Click on the 3 glowing radar beacons on the planet's surface to analyze climate, temperature, and geology.",
      planetPresets: [
        {
          id: "kepler-glacier",
          name: "Planet Cryo-Gliese",
          type: "Glacial Ice World",
          atmosphere: "Thin Nitrogen & Methane Ice",
          surfaceColor: "#0ea5e9",
          landmarks: [
            {
              id: "lm-ice",
              x: 28,
              y: 42,
              title: "Glacier Spire",
              noun: "ice mountains",
              adjective: "COLD",
              sensorySentence: "It is freezing cold!",
              icon: "❄️",
              description: "Towering glaciers of blue nitrogen ice at -95°C."
            },
            {
              id: "lm-rock",
              x: 72,
              y: 58,
              title: "Basalt Canyon",
              noun: "sharp rocks",
              adjective: "ROCKY",
              sensorySentence: "It is very rocky!",
              icon: "🪨",
              description: "Jagged obsidian boulders carved by frozen gales."
            },
            {
              id: "lm-crater",
              x: 50,
              y: 76,
              title: "Shadow Crater",
              noun: "deep crater",
              adjective: "DARK",
              sensorySentence: "It is deep and dark!",
              icon: "🌑",
              description: "A dark impact crater where sunlight never reaches."
            }
          ]
        },
        {
          id: "ares-desert",
          name: "Planet Pyros-IV",
          type: "Crimson Sand Desert",
          atmosphere: "Dense Carbon Dioxide Dust",
          surfaceColor: "#f97316",
          landmarks: [
            {
              id: "lm-sand",
              x: 35,
              y: 45,
              title: "Red Dune Basin",
              noun: "red sand",
              adjective: "RED",
              sensorySentence: "It is dry and red!",
              icon: "🔴",
              description: "Vast expanses of iron oxide crimson dust."
            },
            {
              id: "lm-vent",
              x: 65,
              y: 38,
              title: "Sulfur Steam Vent",
              noun: "hot volcanic vent",
              adjective: "HOT",
              sensorySentence: "It is extremely hot!",
              icon: "🌋",
              description: "Thermal vents spitting boiling subterranean steam."
            },
            {
              id: "lm-storm",
              x: 48,
              y: 68,
              title: "Cyclone Eddy",
              noun: "dust storm",
              adjective: "STORMY",
              sensorySentence: "It is fiercely stormy!",
              icon: "🌪️",
              description: "High-velocity dust storms howling across the plains."
            }
          ]
        }
      ]
    },

    // =========================================================================
    // STAGE 3: SURVIVAL CARGO SORTER (Needs vs. Non-Essentials)
    // =========================================================================
    stage3_cargo: {
      title: "Survival Cargo Sorter",
      subtitle: "Load essential survival gear to keep our astronauts alive!",
      instructions: "Sort each cargo capsule: Is it ESSENTIAL FOR SURVIVAL or a NON-ESSENTIAL luxury item?",
      items: [
        {
          id: "cargo-oxygen",
          name: "Pressurized Oxygen Tanks",
          category: "essential",
          icon: "🫁",
          sentence: "People need oxygen to breathe and live.",
          explanation: "Humans cannot live more than 3 minutes without oxygen."
        },
        {
          id: "cargo-water",
          name: "Fresh Water Recycler",
          category: "essential",
          icon: "💧",
          sentence: "People need water to drink and survive.",
          explanation: "Water is vital for cell hydration and biological function."
        },
        {
          id: "cargo-seeds",
          name: "Hydroponic Crop Seeds",
          category: "essential",
          icon: "🌱",
          sentence: "People need nutritious food to grow strong.",
          explanation: "Space seeds grow vegetables inside planetary domes."
        },
        {
          id: "cargo-blanket",
          name: "Thermal Space Suits",
          category: "essential",
          icon: "🧥",
          sentence: "People need thermal warmth against extreme cold.",
          explanation: "Insulated space suits prevent hypothermia at -100°C."
        },
        {
          id: "cargo-gamepad",
          name: "Video Game Console",
          category: "non-essential",
          icon: "🎮",
          sentence: "Video games are fun, but humans do not need them to live.",
          explanation: "Entertainment is great for recreation, not physical survival."
        },
        {
          id: "cargo-candy",
          name: "Giant Box of Cupcakes",
          category: "non-essential",
          icon: "🧁",
          sentence: "Cupcakes are sweet treats, not essential daily nutrition.",
          explanation: "Sugar spikes do not provide long-term survival nutrition."
        },
        {
          id: "cargo-balloons",
          name: "Party Balloons & Streamers",
          category: "non-essential",
          icon: "🎈",
          sentence: "Party balloons look cheerful, but they cannot save our lives.",
          explanation: "Balloons take up precious payload bay volume."
        },
        {
          id: "cargo-skateboard",
          name: "Lunar Skateboard",
          category: "non-essential",
          icon: "🛹",
          sentence: "A skateboard is an exciting toy, not a life-support tool.",
          explanation: "Wheeled skateboards cannot navigate rugged alien rocks."
        }
      ]
    },

    // =========================================================================
    // STAGE 4: EMERGENCY ALERT & MODULAR INVENTION LAB (Crisis & Solution)
    // =========================================================================
    stage4_invention: {
      title: "Emergency Alert & Invention Lab",
      subtitle: "Build a custom planetary machine to overcome the environmental crisis!",
      crisis: {
        id: "crisis-ice-water",
        alertTitle: "CRITICAL HAZARD DETECTED!",
        hazardName: "Extreme Sub-Zero Freeze & Frozen Reservoir",
        temperature: "-85°C",
        problemStatement: "The problem is: extreme cold and no drinkable liquid water!",
        targetAction: "MELT frozen ice to make fresh drinking water"
      },
      modularParts: {
        chassis: [
          {
            id: "chassis-treads",
            name: "Snow-Track Tank",
            type: "All-Terrain High Traction",
            icon: "🚜",
            advantage: "Grips icy glaciers and climbs steep frozen slopes.",
            isOptimal: true
          },
          {
            id: "chassis-wheels",
            name: "City Slick Wheels",
            type: "Smooth Highway Cruiser",
            icon: "🏎️",
            advantage: "Fast on smooth asphalt, but slips and slides on ice.",
            isOptimal: false
          }
        ],
        powerCores: [
          {
            id: "core-thermal",
            name: "Atomic Thermal Dynamo",
            type: "Sub-Zero Heat Generator",
            icon: "⚛️",
            advantage: "Produces continuous 1,500°C concentrated thermal power.",
            isOptimal: true
          },
          {
            id: "core-solar",
            name: "Standard Solar Panel",
            type: "Sunlight Collector",
            icon: "☀️",
            advantage: "Works under bright sunlight, but fails in dark cold storms.",
            isOptimal: false
          }
        ],
        tools: [
          {
            id: "tool-heatray",
            name: "Thermal Heat Ray",
            verb: "melt",
            target: "frozen ice",
            purposeText: "melt the rock-hard ice into clean liquid water",
            icon: "🔥",
            sentence: "My machine can melt frozen ice to produce fresh water.",
            isOptimal: true
          },
          {
            id: "tool-fan",
            name: "Cooling Wind Fan",
            verb: "blow",
            target: "cold air",
            purposeText: "blow cold wind",
            icon: "💨",
            sentence: "A cooling fan blows cold air, making the freeze worse!",
            isOptimal: false
          },
          {
            id: "tool-camera",
            name: "Scenic Photo Camera",
            verb: "photograph",
            target: "ice crystals",
            purposeText: "take pretty landscape pictures",
            icon: "📷",
            sentence: "A camera takes photos, but cannot melt ice for water!",
            isOptimal: false
          }
        ]
      }
    },

    // =========================================================================
    // STAGE 5: GLOBAL UPGRADE EXCHANGE (Peer Collaboration & Conjunctions)
    // =========================================================================
    stage5_exchange: {
      title: "Global Upgrade Exchange",
      subtitle: "Collaborate with international space teams using the conjunction 'AND'!",
      instructions: "Choose an upgrade from a fellow astronaut station. Connect both tools using 'AND' to create a dual-action machine!",
      peers: [
        {
          id: "peer-mia",
          name: "Astronaut Mia",
          station: "Station Tokyo 🇯🇵",
          avatar: "👩‍🚀",
          toolName: "UV Water Filter",
          verb: "filter",
          noun: "dirty water",
          actionSentence: "filter dirty water to make it safe",
          dialogue: "Greetings, Captain! Our UV purifier can filter toxic water and make it 100% pure!"
        },
        {
          id: "peer-tariq",
          name: "Astronaut Tariq",
          station: "Station Cairo 🇪🇬",
          avatar: "🧑‍🚀",
          toolName: "Hydroponic Bio-Dome",
          verb: "grow",
          noun: "fresh vegetables",
          actionSentence: "grow fresh vegetables for food",
          dialogue: "Salam! Combine our green bio-dome with your rover to grow fresh space crops!"
        },
        {
          id: "peer-elena",
          name: "Astronaut Elena",
          station: "Station Madrid 🇪🇸",
          avatar: "👩‍🚀",
          toolName: "Robotic Trash Recycler",
          verb: "recycle",
          noun: "plastic rubbish",
          actionSentence: "recycle plastic rubbish into building blocks",
          dialogue: "Hola! Add our recycler arm so your rover can clean up space debris and build shelter!"
        }
      ]
    },

    // =========================================================================
    // STAGE 6: NASA LIVE BROADCAST (Scaffolded Speaking Teleprompter)
    // =========================================================================
    stage6_broadcast: {
      title: "NASA Live Broadcast",
      subtitle: "Report your discovery to Mission Control Earth via the live teleprompter!",
      instructions: "Review each sentence of your mission report. Tap the microphone to broadcast your discovery to Earth!",
      reportTemplates: [
        {
          id: "line-greeting",
          label: "1. Astronaut Greeting",
          stem: "Hello Earth! We found a new planet.",
          tts: "Hello Earth! We found a new planet."
        },
        {
          id: "line-condition",
          label: "2. Planetary Trait",
          stem: "It is [TRAIT_1] and [TRAIT_2].",
          tts: "It is cold and rocky."
        },
        {
          id: "line-needs",
          label: "3. Survival Needs",
          stem: "People need [SURVIVAL_1] and [SURVIVAL_2] to live here.",
          tts: "People need water and oxygen to live here."
        },
        {
          id: "line-invention",
          label: "4. Machine Superpower (AND)",
          stem: "My machine can [ACTION_1] AND [ACTION_2]!",
          tts: "My machine can melt ice and filter water!"
        },
        {
          id: "line-signoff",
          label: "5. Sign-Off",
          stem: "Mission accomplished! Over and out!",
          tts: "Mission accomplished! Over and out!"
        }
      ]
    }
  };

  root.NASA_MISSION_DATA = NASA_MISSION_DATA;
})(typeof window !== 'undefined' ? window : global);
