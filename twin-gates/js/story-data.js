/**
 * TWIN GATES: THE MAGIC DOOR ADVENTURE (A1 MASTER ARC)
 * Primary ESL / CEFR A1 Story Curriculum Database
 * 35-Minute Interactive Arcade Quest • Total XP: 150
 */

(function(root) {
  'use strict';

  const TWIN_GATES_DATA = {
    meta: {
      id: "twin-gates",
      title: "🚪 Twin Gates: The Magic Door Adventure (A1 Master Arc)",
      subtitle: "Colossal 3D Doors, Big Picture Clues & A1 Speaking Teleprompter",
      category: "Language & Quests",
      track: "Track 3: Communication & Interactive Storytelling",
      grade: "Grade 3–4",
      level: "CEFR A1",
      ageGroup: "7–10",
      duration: "35 min",
      totalChambers: 5,
      totalXP: 150,
      vocabulary: [
        "door", "gate", "ice", "fire", "key", "torch", "shield", "berry", "cave", "dragon", "yeti", "treasure"
      ],
      formulas: [
        "Open the [left / right] door!",
        "It is [cold / hot / dark / safe].",
        "I need a [key / torch / berry] to go inside."
      ]
    },

    inventoryItems: [
      { id: "torch", name: "Fire Torch", icon: "🕯️", img: "assets/fire_torch.webp", desc: "Melts cold ice." },
      { id: "shield", name: "Fire Shield", icon: "🛡️", img: "assets/shield_item.webp", desc: "Blocks hot fire." },
      { id: "berry", name: "Magic Berry", icon: "🍓", img: "assets/magic_berry.webp", desc: "Treat for friends." },
      { id: "key", name: "Golden Key", icon: "🗝️", img: "assets/golden_key.webp", desc: "Opens gold gates." }
    ],

    chambers: [
      // CHAMBER 1: The Two Gates (Ice or Fire?)
      {
        id: 1,
        title: "Chamber 1: The Two Gates",
        subtitle: "Cold Ice or Hot Fire?",
        stepTag: "Chamber 1 of 5",
        speechPrompt: "Look! Two giant magic doors! Is it cold ice or hot fire?",
        shortPrompt: "Choose a tool: Torch for Ice or Shield for Fire!",
        doors: {
          left: {
            id: "gate_ice",
            label: "Left Door",
            theme: "ice",
            glowColor: "#38bdf8",
            clueBadge: { icon: "❄️", label: "ICE", color: "#38bdf8", sfx: "wind" },
            image: "assets/gate_ice_giant.webp",
            promptText: "It is cold ice!",
            neededTool: "torch",
            toolName: "Fire Torch",
            toolIcon: "🕯️",
            formula: "I need a torch to melt the ice."
          },
          right: {
            id: "gate_fire",
            label: "Right Door",
            theme: "fire",
            glowColor: "#f59e0b",
            clueBadge: { icon: "🔥", label: "FIRE", color: "#f59e0b", sfx: "fire" },
            image: "assets/gate_fire_giant.webp",
            promptText: "It is hot fire!",
            neededTool: "shield",
            toolName: "Fire Shield",
            toolIcon: "🛡️",
            formula: "I need a shield to block the fire."
          }
        }
      },

      // CHAMBER 2: The Creature Room (Yeti or Dragon?)
      {
        id: 2,
        title: "Chamber 2: The Creature Cave",
        subtitle: "Feed the Friendly Creature",
        stepTag: "Chamber 2 of 5",
        branches: {
          ice: {
            creatureId: "yeti",
            name: "Fluffy Yeti",
            image: "assets/yeti_companion.webp",
            speechPrompt: "A fluffy Yeti is here! Give the yeti a sweet berry.",
            formula: "I need a berry to feed the yeti.",
            actionLabel: "🍓 Give Magic Berry to the Yeti",
            glowColor: "#38bdf8",
            doors: {
              left: { label: "Stone Arch", image: "assets/gate_stone_giant.webp", badge: "🪨 ROCK", theme: "stone", glow: "#10b981" },
              right: { label: "Cloud Arch", image: "assets/gate_ice_giant.webp", badge: "☁️ CLOUD", theme: "cloud", glow: "#38bdf8" }
            }
          },
          fire: {
            creatureId: "dragon",
            name: "Baby Dragon",
            image: "assets/baby_dragon.webp",
            speechPrompt: "A cute Baby Dragon is here! Give the dragon a sweet berry.",
            formula: "I need a berry to feed the dragon.",
            actionLabel: "🍓 Give Magic Berry to the Dragon",
            glowColor: "#f59e0b",
            doors: {
              left: { label: "Stone Arch", image: "assets/gate_stone_giant.webp", badge: "🪨 ROCK", theme: "stone", glow: "#10b981" },
              right: { label: "Cloud Arch", image: "assets/gate_fire_giant.webp", badge: "☁️ CLOUD", theme: "cloud", glow: "#f59e0b" }
            }
          }
        }
      },

      // CHAMBER 3: The Stepping Bridge (Safe Path)
      {
        id: 3,
        title: "Chamber 3: The Stepping Bridge",
        subtitle: "Build the Rock Bridge",
        stepTag: "Chamber 3 of 5",
        speechPrompt: "The bridge is broken! Choose the strong rocks or the soft clouds.",
        shortPrompt: "Tap the rock tiles in order: 1 - 2 - 3!",
        tiles: [
          { index: 0, order: 1, label: "Rock 1", icon: "🪨", sub: "Step 1" },
          { index: 1, order: 2, label: "Rock 2", icon: "🪨", sub: "Step 2" },
          { index: 2, order: 3, label: "Rock 3", icon: "🪨", sub: "Step 3" }
        ],
        doors: {
          left: {
            id: "door_rock_safe",
            label: "Rock Gate",
            badge: { icon: "🪨", label: "ROCKS", color: "#10b981" },
            image: "assets/gate_stone_giant.webp",
            glowColor: "#10b981"
          },
          right: {
            id: "door_cloud_soft",
            label: "Cloud Gate",
            badge: { icon: "☁️", label: "CLOUDS", color: "#38bdf8" },
            image: "assets/gate_ice_giant.webp",
            glowColor: "#38bdf8"
          }
        }
      },

      // CHAMBER 4: The Golden Gate (The Final Lock)
      {
        id: 4,
        title: "Chamber 4: The Golden Gate",
        subtitle: "Unlock the Giant Lock",
        stepTag: "Chamber 4 of 5",
        speechPrompt: "The giant golden door is locked! Find the big gold key!",
        shortPrompt: "Put the Golden Key into the lock to open the gate!",
        neededItem: "key",
        gateImage: "assets/gate_gold_giant.webp",
        keyImage: "assets/golden_key.webp",
        formula: "I need a key to open the door."
      },

      // CHAMBER 5: The Treasure Vault & Live Teleprompter
      {
        id: 5,
        title: "Chamber 5: The Treasure Vault",
        subtitle: "Final Oral Graduation",
        stepTag: "Chamber 5 of 5",
        speechPrompt: "You found the magic treasure chest! Now speak into the microphone!",
        chestImage: "assets/treasure_chest.webp",
        teleprompterLines: [
          "We opened the giant magic door!",
          "We saw the friendly creature in the cave.",
          "We unlocked the golden gate and found the treasure!"
        ]
      }
    ]
  };

  root.TWIN_GATES_DATA = TWIN_GATES_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TWIN_GATES_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
