/**
 * NASA MISSION: FIND A NEW PLANET — CURRICULUM DATA MODULE
 * Primary CLIL / A1 ESL Educational Game (Ages 6–9)
 * Visual-First, Low-Text Design with Big Visual Symbols
 */
(function(root) {
  'use strict';

  const NASA_MISSION_DATA = {
    meta: {
      id: 'nasa-mission',
      title: 'NASA Mission: Find a New Planet',
      subtitle: 'Space Explorer • CLIL & Phonics Mission',
      grade: 'Grade 3–4',
      level: 'A1',
      totalStages: 6,
      targetXp: 150
    },

    // =========================================================================
    // STAGE 1: PRE-FLIGHT BOOSTER (Phonics: CVC vs. CVCe / Magic "e")
    // =========================================================================
    stage1_phonics: {
      title: "Pre-Flight Booster",
      subtitle: "Add Magic 'E' to fuel your rocket!",
      drills: [
        {
          id: "cap-cape",
          baseWord: "CAP",
          magicWord: "CAPE",
          baseIcon: "🧢",
          magicIcon: "🦸",
          vowel: "a",
          promptAudio: "Listen: Cape! Add Magic E to fuel the rocket!",
          sentence: "The astronaut wears a flying cape.",
          shortSound: "CAP (/æ/)",
          longSound: "CAPE (/eɪ/)"
        },
        {
          id: "kit-kite",
          baseWord: "KIT",
          magicWord: "KITE",
          baseIcon: "🧰",
          magicIcon: "🪁",
          vowel: "i",
          promptAudio: "Listen: Kite! Fly high like a kite!",
          sentence: "A kite flies high in the sky.",
          shortSound: "KIT (/ɪ/)",
          longSound: "KITE (/aɪ/)"
        },
        {
          id: "hop-hope",
          baseWord: "HOP",
          magicWord: "HOPE",
          baseIcon: "🐰",
          magicIcon: "🌟",
          vowel: "o",
          promptAudio: "Listen: Hope! We hope to find a new planet!",
          sentence: "We hope to discover a new planet.",
          shortSound: "HOP (/ɒ/)",
          longSound: "HOPE (/oʊ/)"
        },
        {
          id: "cut-cute",
          baseWord: "CUT",
          magicWord: "CUTE",
          baseIcon: "✂️",
          magicIcon: "🐾",
          vowel: "u",
          promptAudio: "Listen: Cute! A cute alien pet!",
          sentence: "The space alien is very cute.",
          shortSound: "CUT (/ʌ/)",
          longSound: "CUTE (/juː/)"
        }
      ]
    },

    // =========================================================================
    // STAGE 2: PLANET PROBE SCANNER (Visual Adjectives)
    // =========================================================================
    stage2_probe: {
      title: "Planet Probe Scanner",
      subtitle: "Tap the 3 glowing radar beacons to scan the planet!",
      planet: {
        name: "Planet Cryo-Gliese",
        type: "Glacial World",
        landmarks: [
          {
            id: "lm-ice",
            x: 28,
            y: 40,
            title: "Glacier Mountains",
            adjective: "COLD",
            icon: "❄️",
            audioText: "It is cold. Very cold!",
            displayLabel: "❄️ COLD"
          },
          {
            id: "lm-rock",
            x: 74,
            y: 54,
            title: "Sharp Canyon",
            adjective: "ROCKY",
            icon: "🪨",
            audioText: "It is rocky. Lots of rocks!",
            displayLabel: "🪨 ROCKY"
          },
          {
            id: "lm-crater",
            x: 50,
            y: 72,
            title: "Dark Crater",
            adjective: "DARK",
            icon: "🌑",
            audioText: "It is dark. Deep shadow crater!",
            displayLabel: "🌑 DARK"
          }
        ]
      }
    },

    // =========================================================================
    // STAGE 3: SURVIVAL CARGO SORTER (Needs vs. Non-Essentials)
    // =========================================================================
    stage3_cargo: {
      title: "Survival Cargo Sorter",
      subtitle: "Sort items: Need to live 🛡️ or Fun to have 🎮?",
      items: [
        {
          id: "cargo-water",
          name: "Water",
          category: "essential",
          icon: "💧",
          sentence: "People need water to live."
        },
        {
          id: "cargo-oxygen",
          name: "Oxygen",
          category: "essential",
          icon: "🫁",
          sentence: "People need oxygen to breathe."
        },
        {
          id: "cargo-seeds",
          name: "Plant Seeds",
          category: "essential",
          icon: "🌱",
          sentence: "People need food to grow strong."
        },
        {
          id: "cargo-suit",
          name: "Space Suit",
          category: "essential",
          icon: "🧥",
          sentence: "People need warm space suits."
        },
        {
          id: "cargo-gamepad",
          name: "Video Game",
          category: "non-essential",
          icon: "🎮",
          sentence: "Video games are fun, but not essential."
        },
        {
          id: "cargo-cupcake",
          name: "Cupcakes",
          category: "non-essential",
          icon: "🧁",
          sentence: "Cupcakes are sweet treats, not daily food."
        },
        {
          id: "cargo-balloon",
          name: "Balloons",
          category: "non-essential",
          icon: "🎈",
          sentence: "Balloons are fun toys."
        },
        {
          id: "cargo-skateboard",
          name: "Skateboard",
          category: "non-essential",
          icon: "🛹",
          sentence: "A skateboard is a fun toy."
        }
      ]
    },

    // =========================================================================
    // STAGE 4: EMERGENCY ALERT & MODULAR INVENTION LAB
    // =========================================================================
    stage4_invention: {
      title: "Emergency Alert & Invention Lab",
      subtitle: "The water is frozen! Build a rover to melt the ice!",
      crisis: {
        alertTitle: "EMERGENCY: ICE FREEZE!",
        temperature: "-85°C",
        problemText: "The problem is: frozen ice and no water!",
        targetVerb: "MELT ICE"
      },
      chassis: [
        { id: "chassis-treads", name: "Snow Treads", icon: "🚜", isCorrect: true, label: "Grips icy rocks" },
        { id: "chassis-wheels", name: "Race Wheels", icon: "🏎️", isCorrect: false, label: "Slips on ice" }
      ],
      power: [
        { id: "core-atomic", name: "Atomic Dynamo", icon: "⚛️", isCorrect: true, label: "Hot thermal energy" },
        { id: "core-solar", name: "Sun Panel", icon: "☀️", isCorrect: false, label: "No sun in dark storms" }
      ],
      tools: [
        { id: "tool-heatray", name: "Heat Ray", icon: "🔥", isCorrect: true, action: "MELT ICE", label: "Melts hard ice" },
        { id: "tool-fan", name: "Cooling Fan", icon: "💨", isCorrect: false, action: "BLOW COLD AIR", label: "Makes cold wind" },
        { id: "tool-camera", name: "Camera", icon: "📷", isCorrect: false, action: "TAKE PHOTO", label: "Takes pictures" }
      ]
    },

    // =========================================================================
    // STAGE 5: GLOBAL UPGRADE EXCHANGE (Conjunctions: AND)
    // =========================================================================
    stage5_exchange: {
      title: "Global Upgrade Exchange",
      subtitle: "Pick an astronaut teammate. Connect with 'AND'!",
      peers: [
        {
          id: "peer-mia",
          name: "Astronaut Mia",
          flag: "🇯🇵",
          avatar: "👩‍🚀",
          toolName: "Water Filter",
          verb: "filter water",
          icon: "🧪",
          phrase: "FILTER WATER"
        },
        {
          id: "peer-tariq",
          name: "Astronaut Tariq",
          flag: "🇪🇬",
          avatar: "🧑‍🚀",
          toolName: "Bio-Dome",
          verb: "grow vegetables",
          icon: "🥗",
          phrase: "GROW VEGETABLES"
        },
        {
          id: "peer-elena",
          name: "Astronaut Elena",
          flag: "🇪🇸",
          avatar: "👩‍🚀",
          toolName: "Trash Recycler",
          verb: "recycle rubbish",
          icon: "♻️",
          phrase: "RECYCLE RUBBISH"
        }
      ]
    },

    // =========================================================================
    // STAGE 6: NASA LIVE BROADCAST (Teleprompter)
    // =========================================================================
    stage6_broadcast: {
      title: "NASA Live Broadcast",
      subtitle: "Tap BROADCAST to speak your discovery report to Earth!",
      lines: [
        { id: "line1", text: "Hello Earth! We found a new planet." },
        { id: "line2", text: "It is cold and rocky." },
        { id: "line3", text: "People need water and oxygen to live." },
        { id: "line4", text: "My machine can melt ice AND filter water!" },
        { id: "line5", text: "Mission accomplished! Over and out!" }
      ]
    }
  };

  root.NASA_MISSION_DATA = NASA_MISSION_DATA;
})(typeof window !== 'undefined' ? window : global);
