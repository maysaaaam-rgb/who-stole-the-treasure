/**
 * TWIN GATES: ESCAPE THE SKY CASTLE
 * Primary ESL / CEFR A1 Story Curriculum Database
 * 35–40 Minute Narrative Adventure • Total XP: 150
 */

(function(root) {
  'use strict';

  const SKY_CASTLE_STORY = {
    meta: {
      id: "twin-gates",
      title: "🚪 Mystery of the Twin Gates: Escape the Sky Castle",
      subtitle: "The Sky Castle is shaking! Solve hazards, choose doors, and reach the Golden Airship!",
      category: "Language & Quests",
      track: "Track 3: Communication & Interactive Storytelling",
      grade: "Grades 2–4",
      level: "CEFR A1",
      ageGroup: "7–10",
      duration: "35–40 min",
      totalScenes: 5,
      totalXP: 150,
      lexicon: [
        "dark", "torch", "bread", "beast", "bridge", "jump", "stones", "gold", "key", "door", "airship", "safe"
      ],
      formulas: [
        "It is [dark / cold / hungry / broken].",
        "I use the [torch / bread / key] to [see / feed / open].",
        "Let's go through the [left / right] door!"
      ]
    },

    inventoryItems: [
      { id: "torch", name: "Blazing Torch", icon: "🕯️", img: "assets/item_torch.webp", desc: "Lights dark rooms." },
      { id: "bread", name: "Warm Bread", icon: "🍞", img: "assets/item_bread.webp", desc: "Feeds hungry beasts." },
      { id: "key", name: "Golden Key", icon: "🗝️", img: "assets/item_golden_key.webp", desc: "Opens the Sky Gate." }
    ],

    scenes: [
      // SCENE 1: The Dark Cellar
      {
        id: 1,
        title: "Scene 1: The Dark Cellar",
        subtitle: "It is pitch black! Light the wall sconce!",
        heroSpeech: "The Sky Castle is shaking! It is too dark! Use the torch to light the room!",
        promptFormula: "I use the torch to see in the dark.",
        hazardType: "darkness",
        neededItem: "torch",
        actionBtnText: "🕯️ Use Torch to Light Room",
        successText: "The room is bright and warm! Two colossal doors appear!",
        doors: {
          left: {
            id: "door_ice",
            label: "Left Door",
            badge: "❄️ ICE DOOR",
            cue: "I feel freezing cold air!",
            theme: "ice",
            image: "assets/door_left_ice.webp",
            glow: "#38bdf8"
          },
          right: {
            id: "door_wood",
            label: "Right Door",
            badge: "🪵 WOOD DOOR",
            cue: "I smell ancient pine wood!",
            theme: "wood",
            image: "assets/door_right_wood.webp",
            glow: "#f59e0b"
          }
        }
      },

      // SCENE 2: The Beast Den
      {
        id: 2,
        title: "Scene 2: The Beast Den",
        subtitle: "A giant furry beast is blocking the way!",
        heroSpeech: "The beast is hungry! Give the beast warm bread!",
        promptFormula: "I use the bread to feed the beast.",
        hazardType: "beast",
        neededItem: "bread",
        actionBtnText: "🍞 Give Bread to the Beast",
        successText: "The beast is happy and falls asleep! The double doors unlock!",
        doors: {
          left: {
            id: "door_stone",
            label: "Left Door",
            badge: "🪨 ROCK ARCH",
            cue: "Strong stone path ahead!",
            theme: "stone",
            image: "assets/gate_stone_giant.webp",
            glow: "#10b981"
          },
          right: {
            id: "door_cloud",
            label: "Right Door",
            badge: "☁️ CLOUD ARCH",
            cue: "Soft foggy mist ahead!",
            theme: "cloud",
            image: "assets/door_left_ice.webp",
            glow: "#38bdf8"
          }
        }
      },

      // SCENE 3: The Collapsing Stepping Stones
      {
        id: 3,
        title: "Scene 3: The Abyss Bridge",
        subtitle: "Step on the floating stones in order!",
        heroSpeech: "The bridge is broken! Step on Blue, then Yellow, then Green!",
        promptFormula: "Step on the stones to cross the abyss!",
        hazardType: "broken_bridge",
        sequence: [
          { index: 0, color: "blue", label: "1. Blue Stone", icon: "💎", hex: "#38bdf8" },
          { index: 1, color: "yellow", label: "2. Yellow Stone", icon: "☀️", hex: "#fbbf24" },
          { index: 2, color: "green", label: "3. Green Stone", icon: "🍀", hex: "#10b981" }
        ],
        successText: "You crossed safely! The sky tunnel doors are open!",
        doors: {
          left: {
            id: "door_sky_passage",
            label: "Left Door",
            badge: "⛅ SKY PATH",
            cue: "Leads to the Grand Sky Gate!",
            theme: "sky",
            image: "assets/door_right_wood.webp",
            glow: "#f59e0b"
          },
          right: {
            id: "door_tower_passage",
            label: "Right Door",
            badge: "🏰 TOWER PATH",
            cue: "Leads to the Grand Sky Gate!",
            theme: "tower",
            image: "assets/gate_stone_giant.webp",
            glow: "#10b981"
          }
        }
      },

      // SCENE 4: The Grand Sky Gate
      {
        id: 4,
        title: "Scene 4: The Grand Sky Gate",
        subtitle: "The final colossal lock before the launchpad!",
        heroSpeech: "The giant golden gate is locked! Put the Golden Key into the lock!",
        promptFormula: "I use the golden key to open the gate.",
        hazardType: "golden_lock",
        neededItem: "key",
        actionBtnText: "🗝️ Put Golden Key into the Lock",
        gateImage: "assets/door_vault_gold.webp",
        successText: "The golden gate swings wide open! The airship launchpad is ahead!"
      },

      // SCENE 5: Airship Escape & Teleprompter Studio
      {
        id: 5,
        title: "Scene 5: The Airship Dock",
        subtitle: "Escape into the sunrise! Deliver your 3-sentence broadcast!",
        heroSpeech: "We reached the Golden Airship! Speak into the microphone to launch!",
        airshipImage: "assets/flying_airship.webp",
        teleprompterLines: [
          "We entered the Sky Castle and lit the dark room!",
          "We fed the friendly beast and crossed the magic bridge.",
          "We unlocked the Golden Gate and escaped on the airship!"
        ]
      }
    ]
  };

  root.SKY_CASTLE_STORY = SKY_CASTLE_STORY;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SKY_CASTLE_STORY;
  }
})(typeof window !== 'undefined' ? window : global);
