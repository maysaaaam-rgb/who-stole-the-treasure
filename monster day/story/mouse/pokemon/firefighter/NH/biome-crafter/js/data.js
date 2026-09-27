/**
 * BIOME CRAFTER: THE NIGHT SURVIVAL (70-MIN MASTER ARC)
 * Comprehensive Curriculum & Pedagogical Database
 * Grade 3–4 | CEFR A1–A1+ | 8 Stages (2 Lessons) • Total XP: 200
 */

(function(root) {
  'use strict';

  const BIOME_CRAFTER_DATA = {
    meta: {
      id: "biome-crafter",
      title: "⛏️ Biome Crafter: The Night Survival (70-Min Master Arc)",
      subtitle: "Materials, Infinitives of Purpose & Nocturnal Voxel Defense",
      category: "CLIL & Science",
      track: "Track 1: Earth, Space & Natural Science",
      grade: "Grade 3–4",
      level: "CEFR A1–A1+",
      duration: "70 min (2 Lessons)",
      totalStages: 8,
      totalXP: 200,
      grammarTargets: [
        "Materials & Quantity: I need [number] [material] to make a [item].",
        "Infinitives of Purpose: We use [item] to [verb] the [object].",
        "Environmental Warnings: When the sun sets, we must [action] to survive!"
      ]
    },

    stages: [
      { id: 1, lesson: 1, name: "Biome Scanner", title: "Stage 1: Biome Scanner & Daylight Radar", icon: "🧭", duration: "8 min", xp: 20 },
      { id: 2, lesson: 1, name: "Mining Airlock", title: "Stage 2: Resource Mining Airlock", icon: "⛏️", duration: "10 min", xp: 25 },
      { id: 3, lesson: 1, name: "Tool Smithing", title: "Stage 3: The Tool Smithing Bench", icon: "🔨", duration: "9 min", xp: 25 },
      { id: 4, lesson: 1, name: "Sunset Drill", title: "Stage 4: Sunset Emergency Drill", icon: "🌅", duration: "8 min", xp: 25 },
      { id: 5, lesson: 2, name: "3x3 Forge", title: "Stage 5: 3x3 Tactile Shelter Forge", icon: "🧱", duration: "14 min", xp: 35 },
      { id: 6, lesson: 2, name: "Creeper Defense", title: "Stage 6: The Midnight Creeper Defense", icon: "👾", duration: "10 min", xp: 25 },
      { id: 7, lesson: 2, name: "Teleprompter", title: "Stage 7: Night Survival Teleprompter Studio", icon: "🎙️", duration: "6 min", xp: 25 },
      { id: 8, lesson: 2, name: "Field Blueprint", title: "Stage 8: Field Diagnostic & Survival Blueprint", icon: "📄", duration: "5 min", xp: 20 }
    ],

    biomes: [
      {
        id: "forest",
        name: "Oak Forest Biome",
        icon: "🌲",
        accent: "#10b981",
        accentGlow: "rgba(16, 185, 129, 0.45)",
        mascotImg: "assets/characters/steve_hero.jpg",
        mascotName: "Steve the Crafter",
        keyResource: "Oak Wood",
        resourceImg: "assets/blocks/wood_block.jpg",
        description: "Dense forest of tall oak trees and abundant wildlife. The prime source for building wood and sticks.",
        sentenceFrame: "We chop oak trees to collect wood for our shelter.",
        speechPrompt: "In the Oak Forest, we chop oak trees to collect wood."
      },
      {
        id: "cavern",
        name: "Rocky Cavern Biome",
        icon: "🪨",
        accent: "#94a3b8",
        accentGlow: "rgba(148, 163, 184, 0.45)",
        mascotImg: "assets/characters/steve_hero.jpg",
        mascotName: "Steve the Miner",
        keyResource: "Cobblestone & Coal",
        resourceImg: "assets/blocks/stone_block.jpg",
        description: "Deep subterranean stone walls packed with mineral veins. Vital for heavy stone tools and campfire torches.",
        sentenceFrame: "We mine rocks to collect stone and dark coal.",
        speechPrompt: "In the Rocky Cavern, we mine rocks to collect stone."
      },
      {
        id: "ravine",
        name: "Deep Ravine Biome",
        icon: "🌋",
        accent: "#ef4444",
        accentGlow: "rgba(239, 68, 68, 0.45)",
        mascotImg: "assets/characters/iron_golem.jpg",
        mascotName: "Iron Golem Guardian",
        keyResource: "Iron Ore Veins",
        resourceImg: "assets/items/tools_weapons.jpg",
        description: "A sheer canyon cutting into the bedrock. High risk, but packed with valuable iron for swords and armor.",
        sentenceFrame: "We smelt raw iron ore to make sharp iron swords.",
        speechPrompt: "In the Deep Ravine, we smelt raw iron ore to make iron swords."
      },
      {
        id: "plains",
        name: "Dark Plains Biome",
        icon: "🌾",
        accent: "#f59e0b",
        accentGlow: "rgba(245, 158, 11, 0.45)",
        mascotImg: "assets/characters/creeper_mob.jpg",
        mascotName: "Nocturnal Creeper Mob",
        keyResource: "Flat Bedrock Base",
        resourceImg: "assets/items/torch_door.jpg",
        description: "Wide open grasslands. Perfect for building a large base, but dangerous when the nocturnal creepers spawn!",
        sentenceFrame: "When the sun sets, we must build a shelter to survive!",
        speechPrompt: "When the sun sets, we must build a shelter to survive!"
      }
    ],

    // Stage 2: Mining Airlock Harvest Tasks
    miningTasks: [
      {
        id: "mine-wood",
        title: "Oak Tree Trunk",
        type: "wood",
        maxHits: 4,
        yieldItem: "Wood Block",
        yieldCount: 4,
        img: "assets/blocks/wood_block.jpg",
        audio: "wood",
        stem: "We chop trees to collect wood.",
        purpose: "to make sticks, planks, and doors"
      },
      {
        id: "mine-stone",
        title: "Cobblestone Boulder",
        type: "stone",
        maxHits: 5,
        yieldItem: "Cobblestone",
        yieldCount: 4,
        img: "assets/blocks/stone_block.jpg",
        audio: "stone",
        stem: "We mine rocks to collect stone.",
        purpose: "to upgrade our wooden pickaxe"
      },
      {
        id: "mine-coal",
        title: "Black Coal Seam",
        type: "coal",
        maxHits: 4,
        yieldItem: "Coal Lump",
        yieldCount: 2,
        img: "assets/blocks/stone_block.jpg",
        audio: "stone",
        stem: "We mine coal minerals from stone.",
        purpose: "to craft bright glowing torches"
      },
      {
        id: "mine-iron",
        title: "Raw Iron Ore Vein",
        type: "iron",
        maxHits: 6,
        yieldItem: "Iron Ingot",
        yieldCount: 2,
        img: "assets/items/tools_weapons.jpg",
        audio: "stone",
        stem: "We smelt iron ore in the furnace.",
        purpose: "to forge an indestructible sword"
      }
    ],

    // Stage 3: Tool Smithing Bench Recipes
    smithingRecipes: [
      {
        id: "recipe-wood-pick",
        name: "Wooden Pickaxe",
        tier: "Tier 1: Starter Tool",
        cost: { stick: 2, wood: 3 },
        resultItem: "Wooden Pickaxe",
        img: "assets/items/tools_weapons.jpg",
        formula: "I need 2 sticks and 3 wood to make a wooden pickaxe.",
        purpose: "We use the wooden pickaxe to mine stone."
      },
      {
        id: "recipe-stone-pick",
        name: "Stone Pickaxe",
        tier: "Tier 2: Advanced Miner",
        cost: { stick: 2, stone: 3 },
        resultItem: "Stone Pickaxe",
        img: "assets/items/tools_weapons.jpg",
        formula: "I need 2 sticks and 3 stone to make a stone pickaxe.",
        purpose: "We use the stone pickaxe to mine iron ore."
      }
    ],

    // Stage 4: Sunset Emergency Sorting
    sortingItems: [
      { id: "s-1", name: "Glowing Torches", category: "survival", icon: "🔥", reason: "Lights the dark to stop monster spawns" },
      { id: "s-2", name: "Wooden Door", category: "survival", icon: "🚪", reason: "Blocks monsters from entering shelter" },
      { id: "s-3", name: "Stone Pickaxe", category: "survival", icon: "⛏️", reason: "Mines emergency stone blocks" },
      { id: "s-4", name: "Iron Sword", category: "survival", icon: "🗡️", reason: "Protects crafters against creepers" },
      { id: "s-5", name: "Coal Lumps", category: "survival", icon: "⚫", reason: "Fuel for campfire and torches" },
      { id: "s-6", name: "Baked Bread", category: "survival", icon: "🍞", reason: "Restores crafter energy" },
      { id: "l-1", name: "Gold Trophy", category: "luxury", icon: "🏆", reason: "Shiny decoration, zero defense" },
      { id: "l-2", name: "Diamond Block", category: "luxury", icon: "💎", reason: "Precious display, not for night 1" },
      { id: "l-3", name: "Flower Pot", category: "luxury", icon: "🪴", reason: "Pleasant decoration, no combat use" },
      { id: "l-4", name: "Wooden Jukebox", category: "luxury", icon: "📻", reason: "Plays music, does not block mobs" },
      { id: "l-5", name: "Emerald Shard", category: "luxury", icon: "❇️", reason: "Trading item for daytime villagers" },
      { id: "l-6", name: "Art Painting", category: "luxury", icon: "🖼️", reason: "Wall art, useless against creepers" }
    ],

    // Stage 5: 3x3 Tactile Shelter Forge Recipes
    crafting3x3Recipes: [
      {
        id: "door-3x3",
        name: "Secure Wooden Door",
        targetFormula: "We need a door to block monsters!",
        ingredientsLabel: "6 Wood Planks",
        pattern: [
          ["wood", "wood", ""],
          ["wood", "wood", ""],
          ["wood", "wood", ""]
        ],
        defenseBoost: 30,
        resultImg: "assets/items/torch_door.jpg",
        desc: "Essential entrance barricade. Keep creepers outside!"
      },
      {
        id: "torch-3x3",
        name: "4x Bright Torches",
        targetFormula: "We use torches to light the dark!",
        ingredientsLabel: "1 Coal + 1 Stick",
        pattern: [
          ["", "coal", ""],
          ["", "stick", ""],
          ["", "", ""]
        ],
        defenseBoost: 25,
        resultImg: "assets/items/torch_door.jpg",
        desc: "High illumination stops hostile nocturnal mob spawns."
      },
      {
        id: "sword-3x3",
        name: "Sharp Iron Sword",
        targetFormula: "We need a sword to protect the base!",
        ingredientsLabel: "2 Iron Ingots + 1 Stick",
        pattern: [
          ["", "iron", ""],
          ["", "iron", ""],
          ["", "stick", ""]
        ],
        defenseBoost: 20,
        resultImg: "assets/items/tools_weapons.jpg",
        desc: "Heavy defensive weapon for close combat against creepers."
      }
    ],

    // Stage 6: Creeper Defense Directives
    defenseDirectives: [
      {
        id: "def-1",
        alert: "⚠️ Dark Shadow at West Window!",
        threat: "Creeper sneaking in unlit blindspot.",
        actionNeeded: "torch",
        actionBtn: "🔥 Place Torch on Window",
        reactionSuccess: "Window illuminated! The creeper fled into the woods."
      },
      {
        id: "def-2",
        alert: "⚠️ Footsteps Outside the Main Entrance!",
        threat: "Monsters approaching unbolted door.",
        actionNeeded: "lock",
        actionBtn: "🔒 Fasten Heavy Door Lock",
        reactionSuccess: "Door locked! The monsters cannot enter your shelter."
      },
      {
        id: "def-3",
        alert: "⚠️ Perimeter Breach in the Outer Yard!",
        threat: "A pack of creepers surrounding the base.",
        actionNeeded: "golem",
        actionBtn: "🤖 Summon Iron Golem Defender",
        reactionSuccess: "Iron Golem deployed! The perimeter is secure."
      }
    ],

    // Stage 7: Teleprompter Scripts (3-Sentence Production Ceiling)
    teleprompterTemplates: [
      {
        id: "tp-forest-base",
        title: "Oak Forest Fortified Shelter",
        mascotImg: "assets/characters/steve_hero.jpg",
        line1: "Night has arrived in the Oak Forest biome!",
        line2: "I used wood, stone, and iron to build a strong shelter with torches.",
        line3: "The door is locked — my base is safe from the monsters!"
      },
      {
        id: "tp-cavern-bunker",
        title: "Rocky Cavern Deep Fortress",
        mascotImg: "assets/characters/iron_golem.jpg",
        line1: "The sun has set behind the Rocky Cavern peaks!",
        line2: "We used cobblestone and coal torches to illuminate the underground shelter.",
        line3: "Our iron sword is ready — we survived the midnight trials!"
      }
    ],

    // Stage 8: 3-Question Rapid Diagnostic Checkpoint
    exitQuiz: [
      {
        id: "q1",
        question: "Complete the quantity formula: 'I need 3 wood ___ a door.'",
        options: [
          "to make",
          "for make",
          "making",
          "to made"
        ],
        correct: 0,
        explanation: "Rule: Use 'to + base verb' (infinitive of purpose): 'to make a door'."
      },
      {
        id: "q2",
        question: "Why do crafters place torches around their shelter?",
        options: [
          "We use torches to decorate luxury blocks.",
          "We use torches to light the dark shelter.",
          "We use torches to chop oak trees.",
          "We use torches to dig cobblestone."
        ],
        correct: 1,
        explanation: "Rule: 'We use [item] to [verb]: We use torches to light the dark shelter.'"
      },
      {
        id: "q3",
        question: "What must crafters do when the sun sets?",
        options: [
          "When the sun sets, we must go swimming in the river.",
          "When the sun sets, we must build a shelter to survive!",
          "When the sun sets, we must sleep outside on the grass.",
          "When the sun sets, we drop our tools on the ground."
        ],
        correct: 1,
        explanation: "Rule: 'When the sun sets, we must build a shelter to survive!'"
      }
    ]
  };

  root.BIOME_CRAFTER_DATA = BIOME_CRAFTER_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BIOME_CRAFTER_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
