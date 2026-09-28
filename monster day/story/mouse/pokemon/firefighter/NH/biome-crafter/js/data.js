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
      { id: 3, lesson: 1, name: "3x3 Tool Forge", title: "Stage 3: The 3x3 Real Crafting Forge with English Gates", icon: "🔨", duration: "12–15 min", xp: 35 },
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
        mascotImg: "assets/characters/steve_hero.webp",
        mascotName: "Steve the Crafter",
        keyResource: "Oak Wood",
        resourceImg: "assets/wood_block.webp",
        description: "Dense forest of tall oak trees and abundant timber. The prime source for building wood and sticks.",
        sentenceFrame: "We chop oak trees to collect wood for our shelter.",
        speechPrompt: "In the Oak Forest, we chop oak trees to collect wood."
      },
      {
        id: "cavern",
        name: "Rocky Cavern Biome",
        icon: "🪨",
        accent: "#94a3b8",
        accentGlow: "rgba(148, 163, 184, 0.45)",
        mascotImg: "assets/characters/steve_hero.webp",
        mascotName: "Steve the Miner",
        keyResource: "Cobblestone & Coal",
        resourceImg: "assets/stone_block.webp",
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
        mascotImg: "assets/characters/iron_golem.webp",
        mascotName: "Iron Golem Guardian",
        keyResource: "Iron Ore Veins",
        resourceImg: "assets/iron_sword.webp",
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
        mascotImg: "assets/characters/creeper_mob.webp",
        mascotName: "Nocturnal Creeper Mob",
        keyResource: "Flat Bedrock Base",
        resourceImg: "assets/wooden_door.webp",
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
        yieldItem: "Wood Planks",
        yieldCount: 4,
        img: "assets/wood_block.webp",
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
        img: "assets/stone_block.webp",
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
        img: "assets/coal_lump.webp",
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
        img: "assets/iron_ingot.webp",
        audio: "stone",
        stem: "We smelt iron ore in the furnace.",
        purpose: "to forge an indestructible sword"
      }
    ],

    // Stage 3: The 3x3 Authentic Sandbox Crafting Table (RECIPE_REGISTRY)
    recipeRegistry: [
      {
        id: "wooden-pickaxe",
        name: "Wooden Pickaxe",
        category: "Mining Tool",
        icon: "⛏️",
        img: "assets/wooden_pickaxe_transparent.webp",
        xp: 35,
        desc: "Essential starter tool to mine stone blocks and coal ore.",
        grid: [
          "wood", "wood", "wood",
          "",     "stick", "",
          "",     "stick", ""
        ]
      },
      {
        id: "stone-pickaxe",
        name: "Stone Pickaxe",
        category: "Mining Tool",
        icon: "⛏️",
        img: "assets/stone_pickaxe_transparent.webp",
        xp: 45,
        desc: "Upgraded stone pickaxe capable of extracting iron ore veins.",
        grid: [
          "stone", "stone", "stone",
          "",      "stick", "",
          "",      "stick", ""
        ]
      },
      {
        id: "iron-pickaxe",
        name: "Forged Iron Pickaxe",
        category: "Heavy Mining Tool",
        icon: "⛏️",
        img: "assets/stone_pickaxe_transparent.webp",
        imgFilter: "hue-rotate(185deg) brightness(1.25) contrast(1.15)",
        xp: 60,
        desc: "Durable metallic pickaxe for deep diamond and redstone mining.",
        grid: [
          "iron", "iron", "iron",
          "",     "stick", "",
          "",     "stick", ""
        ]
      },
      {
        id: "wooden-sword",
        name: "Wooden Sword",
        category: "Basic Weapon",
        icon: "🗡️",
        img: "assets/iron_sword_transparent.webp",
        imgFilter: "sepia(0.8) saturate(1.8) hue-rotate(-20deg) brightness(0.9)",
        xp: 30,
        desc: "Light wooden blade to defend against nocturnal spiders and creepers.",
        grid: [
          "", "wood", "",
          "", "wood", "",
          "", "stick", ""
        ],
        altGrids: [
          ["wood", "", "", "wood", "", "", "stick", "", ""],
          ["", "", "wood", "", "", "wood", "", "", "stick"]
        ]
      },
      {
        id: "iron-broadsword",
        name: "Forged Iron Broadsword",
        category: "Combat Weapon",
        icon: "⚔️",
        img: "assets/iron_sword_transparent.webp",
        xp: 55,
        desc: "Razor-sharp forged iron blade dealing massive critical damage.",
        grid: [
          "", "iron", "",
          "", "iron", "",
          "", "stick", ""
        ],
        altGrids: [
          ["iron", "", "", "iron", "", "", "stick", "", ""],
          ["", "", "iron", "", "", "iron", "", "", "stick"]
        ]
      },
      {
        id: "stone-axe",
        name: "Stone War Axe",
        category: "Lumber & Combat",
        icon: "🪓",
        img: "assets/stone_hatchet_transparent.webp",
        xp: 40,
        desc: "Heavy stone wedge for rapid timber harvesting and woodchopping.",
        grid: [
          "stone", "stone", "",
          "stone", "stick", "",
          "",      "stick", ""
        ],
        altGrids: [
          ["", "stone", "stone", "", "stick", "stone", "", "stick", ""]
        ]
      },
      {
        id: "stone-shovel",
        name: "Stone Shovel",
        category: "Excavator",
        icon: "🥄",
        img: "assets/stone_hatchet_transparent.webp",
        imgFilter: "hue-rotate(85deg) brightness(0.9)",
        xp: 25,
        desc: "Rapid excavation tool to clear dirt, gravel, and sand.",
        grid: [
          "", "stone", "",
          "", "stick", "",
          "", "stick", ""
        ],
        altGrids: [
          ["stone", "", "", "stick", "", "", "stick", "", ""],
          ["", "", "stone", "", "", "stick", "", "", "stick"]
        ]
      },
      {
        id: "torches",
        name: "Torches (x4)",
        category: "Illumination",
        icon: "🔥",
        img: "assets/torch_item_transparent.webp",
        xp: 20,
        desc: "Essential light source that keeps darkness and nocturnal creepers away.",
        grid: [
          "", "coal", "",
          "", "stick", "",
          "", "",     ""
        ],
        altGrids: [
          ["coal", "", "", "stick", "", "", "", "", ""],
          ["", "", "coal", "", "", "stick", "", "", ""],
          ["", "", "", "", "coal", "", "", "stick", ""],
          ["", "", "", "coal", "", "", "stick", "", ""],
          ["", "", "", "", "", "coal", "", "", "stick"]
        ]
      },
      {
        id: "wooden-door",
        name: "Oak Shelter Door",
        category: "Fortification",
        icon: "🚪",
        img: "assets/wooden_door_transparent.webp",
        xp: 35,
        desc: "Reinforced wooden door safeguarding your shelter entrance at night.",
        grid: [
          "wood", "wood", "",
          "wood", "wood", "",
          "wood", "wood", ""
        ],
        altGrids: [
          ["", "wood", "wood", "", "wood", "wood", "", "wood", "wood"]
        ]
      }
    ],

    // Backward compatibility pointers
    get smithing3x3Tiers() {
      return this.recipeRegistry;
    },
    get smithing2x2Recipes() {
      return this.recipeRegistry;
    },

    // Backwards compatibility for existing references
    smithingRecipes: [
      {
        id: "recipe-wood-pick",
        name: "Wooden Pickaxe",
        tier: "Tier 1: Starter Tool",
        cost: { stick: 2, wood: 2 },
        resultItem: "Wooden Pickaxe",
        img: "assets/stone_pickaxe.webp",
        formula: "I need 2 sticks and 2 wood to make a wooden pickaxe.",
        purpose: "We use the wooden pickaxe to mine stone."
      },
      {
        id: "recipe-stone-pick",
        name: "Stone Pickaxe",
        tier: "Tier 2: Advanced Miner",
        cost: { stick: 2, stone: 2 },
        resultItem: "Stone Pickaxe",
        img: "assets/stone_pickaxe.webp",
        formula: "I need 2 sticks and 2 stone to make a stone pickaxe.",
        purpose: "We use the stone pickaxe to mine iron ore."
      }
    ],

    // Stage 4: Sunset Emergency Sorting
    sortingItems: [
      { id: "s-1", name: "Glowing Torches", category: "survival", icon: "🕯️", reason: "Lights the dark to stop monster spawns" },
      { id: "s-2", name: "Wooden Door", category: "survival", icon: "🚪", reason: "Blocks monsters from entering shelter" },
      { id: "s-3", name: "Stone Pickaxe", category: "survival", icon: "⛏️", reason: "Mines emergency stone blocks" },
      { id: "s-4", name: "Iron Sword", category: "survival", icon: "⚔️", reason: "Protects crafters against creepers" },
      { id: "s-5", name: "Coal Lumps", category: "survival", icon: "⬛", reason: "Fuel for campfire and torches" },
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
        stepNumber: 1,
        icon: "🚪",
        badge: "Step 1 of 3: Wooden Door",
        name: "Secure Wooden Door",
        targetFormula: "We need a door to block monsters!",
        ingredientsLabel: "6 Wood Planks",
        pattern: [
          ["wood", "wood", ""],
          ["wood", "wood", ""],
          ["wood", "wood", ""]
        ],
        defenseBoost: 30,
        resultImg: "assets/wooden_door.webp",
        previewAnimation: "floating-door",
        miniGuide: "Fill column 1 and column 2 with 6 wood planks. Leave column 3 empty.",
        stampText: "CRAFTED: WOODEN DOOR! ⭐",
        desc: "Essential entrance barricade. Keep creepers outside!"
      },
      {
        id: "torch-3x3",
        stepNumber: 2,
        icon: "🕯️",
        badge: "Step 2 of 3: 4x Torches",
        name: "4x Bright Torches",
        targetFormula: "We use torches to light the dark!",
        ingredientsLabel: "1 Coal + 1 Stick",
        pattern: [
          ["", "coal", ""],
          ["", "stick", ""],
          ["", "", ""]
        ],
        defenseBoost: 25,
        resultImg: "assets/torch_item.webp",
        previewAnimation: "flaming-torch",
        miniGuide: "Place 1 Coal in the top-center, and 1 Stick in the middle-center.",
        stampText: "CRAFTED: 4x TORCHES! ⭐",
        desc: "High illumination stops hostile nocturnal mob spawns."
      },
      {
        id: "sword-3x3",
        stepNumber: 3,
        icon: "⚔️",
        badge: "Step 3 of 3: Iron Sword",
        name: "Sharp Iron Sword",
        targetFormula: "We need a sword to protect the base!",
        ingredientsLabel: "2 Iron Ingots + 1 Stick",
        pattern: [
          ["", "iron", ""],
          ["", "iron", ""],
          ["", "stick", ""]
        ],
        defenseBoost: 20,
        resultImg: "assets/iron_sword.webp",
        previewAnimation: "shimmering-sword",
        miniGuide: "Place 2 Iron Ingots vertically down the center, with 1 Stick at the bottom.",
        stampText: "CRAFTED: IRON SWORD! ⭐",
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
        actionBtn: "🕯️ Mount Torch on Window",
        reactionSuccess: "Window illuminated! The creeper fled into the woods."
      },
      {
        id: "def-2",
        alert: "⚠️ Footsteps Outside the Main Entrance!",
        threat: "Monsters approaching unbolted door.",
        actionNeeded: "lock",
        actionBtn: "🔒 Bolt Heavy Wooden Door",
        reactionSuccess: "Door bolted! The monsters cannot enter your shelter."
      },
      {
        id: "def-3",
        alert: "⚠️ Perimeter Breach in the Outer Yard!",
        threat: "A pack of creepers surrounding the base.",
        actionNeeded: "golem",
        actionBtn: "🤖 Deploy Iron Golem Defender",
        reactionSuccess: "Iron Golem deployed! The perimeter is secure."
      }
    ],

    // Stage 7: Teleprompter Scripts (3-Sentence Production Ceiling)
    teleprompterTemplates: [
      {
        id: "tp-forest-base",
        title: "Oak Forest Fortified Shelter",
        mascotImg: "assets/characters/steve_hero.webp",
        line1: "Night has arrived in the biome!",
        line2: "I used wood, stone, and iron to build a strong shelter with torches.",
        line3: "The door is locked — my base is safe from the monsters!"
      },
      {
        id: "tp-cavern-bunker",
        title: "Rocky Cavern Deep Fortress",
        mascotImg: "assets/characters/iron_golem.webp",
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
