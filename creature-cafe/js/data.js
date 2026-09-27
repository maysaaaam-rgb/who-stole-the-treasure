/**
 * CREATURE CAFÉ: MYTHICAL LIKES & DISLIKES
 * Curriculum Data, Creature Profiles, Preferences Matrix, and Teleprompter Bank
 * Grade 3–4 ESL / CLIL (CEFR A1–A1+)
 */

const CREATURE_CAFE_DATA = {
  meta: {
    id: "creature-cafe",
    title: "Creature Café: Mythical Likes & Dislikes",
    emoji: "🧁",
    grade: "Grade 3–4",
    level: "CEFR A1–A1+",
    topic: "Food Preferences, Likes & Dislikes, Hobbies",
    targetGrammar: {
      positive: "[Creature] likes [Item / Verb-ing].",
      negative: "[Creature] doesn't like [Item / Verb-ing].",
      question: "What does it like?"
    },
    totalXP: 300,
    passingThreshold: 0.8
  },

  foods: [
    {
      id: "spicy_peppers",
      name: "spicy peppers",
      label: "Spicy Peppers",
      emoji: "🌶️",
      taste: "Fiery & Scorching",
      desc: "Super hot chili peppers that spark with little flames!"
    },
    {
      id: "sweet_honey",
      name: "sweet honey",
      label: "Sweet Honey",
      emoji: "🍯",
      taste: "Golden & Sweet",
      desc: "Pure enchanted nectar collected from giant mystic blossoms."
    },
    {
      id: "cold_ice_berries",
      name: "cold ice berries",
      label: "Cold Ice Berries",
      emoji: "🫐",
      taste: "Frosty & Chilled",
      desc: "Glacial blue berries frozen in winter frost crystals."
    },
    {
      id: "golden_nuts",
      name: "golden nuts",
      label: "Golden Nuts",
      emoji: "🌰",
      taste: "Crunchy & Nutty",
      desc: "Roasted forest acorns dipped in shimmering sunlight."
    },
    {
      id: "crunchy_crystals",
      name: "crunchy crystals",
      label: "Crunchy Crystals",
      emoji: "💎",
      taste: "Magical & Crisp",
      desc: "Starlight sugar rocks that crackle with pure cosmic power."
    }
  ],

  actions: [
    { id: "flying", name: "flying", label: "Flying", emoji: "🦅" },
    { id: "swimming", name: "swimming", label: "Swimming", emoji: "🏊" },
    { id: "sleeping", name: "sleeping", label: "Sleeping", emoji: "💤" },
    { id: "roaring", name: "roaring", label: "Roaring", emoji: "🗣️" }
  ],

  creatures: [
    {
      id: "ember-dragon",
      name: "Ember Dragon",
      species: "Flame Wyrm",
      badge: "🔥 Fire Dragon",
      element: "ember",
      accentColor: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.4)",
      asset: "assets/emberwing_stage_growing.webp",
      altAsset: "assets/emberwing_stage_baby.webp",
      likesFood: "spicy peppers",
      dislikesFood: "cold ice berries",
      likesAction: "flying",
      dislikesAction: "swimming",
      greeting: "Roar! Welcome to the warm side of the café!",
      dialogue: {
        ask: "What does Ember Dragon like?",
        like: "Ember Dragon likes spicy peppers!",
        likeAction: "It likes flying across the sky.",
        dislike: "It doesn't like cold ice berries!",
        dislikeAction: "It doesn't like swimming in cold water."
      },
      teleprompter: [
        "Welcome to the sunny table of Ember Dragon!",
        "Ember Dragon likes spicy peppers and flying high in the sky.",
        "It doesn't like cold ice berries or swimming in wet pools!"
      ]
    },
    {
      id: "coral-mermaid",
      name: "Coral Mermaid",
      species: "Tide Caller",
      badge: "🌊 Ocean Nymph",
      element: "aqua",
      accentColor: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.4)",
      asset: "assets/aquafind_stage_growing.webp",
      altAsset: "assets/aquafind_stage_baby.webp",
      likesFood: "sweet honey",
      dislikesFood: "spicy peppers",
      likesAction: "swimming",
      dislikesAction: "sleeping",
      greeting: "Splash! I love sweet café treats after swimming!",
      dialogue: {
        ask: "What does Coral Mermaid like?",
        like: "Coral Mermaid likes sweet honey!",
        likeAction: "It likes swimming in deep ocean coral.",
        dislike: "It doesn't like spicy peppers!",
        dislikeAction: "It doesn't like sleeping all afternoon."
      },
      teleprompter: [
        "Welcome to the aquatic table of Coral Mermaid!",
        "Coral Mermaid likes sweet honey and swimming with dolphin friends.",
        "It doesn't like spicy peppers or sleeping when the waves call!"
      ]
    },
    {
      id: "nature-fox",
      name: "Nature Fox",
      species: "Verdant Sprite",
      badge: "🌿 Forest Fox",
      element: "verdant",
      accentColor: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.4)",
      asset: "assets/florasprout_stage_growing.webp",
      altAsset: "assets/florasprout_stage_baby.webp",
      likesFood: "golden nuts",
      dislikesFood: "crunchy crystals",
      likesAction: "sleeping",
      dislikesAction: "roaring",
      greeting: "Yawn... A quiet corner and crunchy nuts please!",
      dialogue: {
        ask: "What does Nature Fox like?",
        like: "Nature Fox likes golden nuts!",
        likeAction: "It likes sleeping under quiet green trees.",
        dislike: "It doesn't like crunchy crystals!",
        dislikeAction: "It doesn't like roaring loudly in the woods."
      },
      teleprompter: [
        "Welcome to the peaceful garden table of Nature Fox!",
        "Nature Fox likes golden nuts and sleeping in soft green moss.",
        "It doesn't like crunchy crystals or roaring in the quiet woods!"
      ]
    },
    {
      id: "astral-sprite",
      name: "Astral Sprite",
      species: "Cosmic Wanderer",
      badge: "✨ Astral Sprite",
      element: "astral",
      accentColor: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.4)",
      asset: "assets/astralight_stage_growing.webp",
      altAsset: "assets/astralight_stage_baby.webp",
      likesFood: "crunchy crystals",
      dislikesFood: "golden nuts",
      likesAction: "flying",
      dislikesAction: "swimming",
      greeting: "Twinkle! Celestial starlight and crystal rocks are the best!",
      dialogue: {
        ask: "What does Astral Sprite like?",
        like: "Astral Sprite likes crunchy crystals!",
        likeAction: "It likes flying through purple galaxy rings.",
        dislike: "It doesn't like golden nuts!",
        dislikeAction: "It doesn't like swimming in heavy liquid lakes."
      },
      teleprompter: [
        "Welcome to the cosmic sky table of Astral Sprite!",
        "Astral Sprite likes crunchy crystals and flying among distant stars.",
        "It doesn't like golden nuts or swimming in murky pond waters!"
      ]
    },
    {
      id: "thunder-yeti",
      name: "Thunder Yeti",
      species: "Volt Behemoth",
      badge: "⚡ Electric Yeti",
      element: "spark",
      accentColor: "#eab308",
      glowColor: "rgba(234, 179, 8, 0.4)",
      asset: "assets/sparktail_stage_growing.webp",
      altAsset: "assets/sparktail_stage_baby.webp",
      likesFood: "cold ice berries",
      dislikesFood: "sweet honey",
      likesAction: "roaring",
      dislikesAction: "sleeping",
      greeting: "Zzzap! Give me cold snacks to cool my thunder sparks!",
      dialogue: {
        ask: "What does Thunder Yeti like?",
        like: "Thunder Yeti likes cold ice berries!",
        likeAction: "It likes roaring like thunder across the mountains.",
        dislike: "It doesn't like sweet honey!",
        dislikeAction: "It doesn't like sleeping when energy is bursting."
      },
      teleprompter: [
        "Welcome to the high-energy table of Thunder Yeti!",
        "Thunder Yeti likes cold ice berries and roaring through thunder clouds.",
        "It doesn't like sweet honey or sleeping when lightning crackles!"
      ]
    }
  ],

  // Phase 2: Kitchen / Order Workbench Challenges
  orders: [
    {
      round: 1,
      creatureId: "ember-dragon",
      questionType: "like_food",
      prompt: "Ember Dragon is starving after flying! What does it like to eat?",
      targetGrammar: "Ember Dragon likes spicy peppers.",
      negativeFact: "It doesn't like cold ice berries.",
      correctAnswer: "spicy peppers",
      options: ["spicy peppers", "cold ice berries", "sweet honey", "golden nuts"],
      explanation: "Ember Dragon breathes fire, so it likes spicy peppers!"
    },
    {
      round: 2,
      creatureId: "coral-mermaid",
      questionType: "dislike_food",
      prompt: "Watch out! What treat does Coral Mermaid NOT like?",
      targetGrammar: "Coral Mermaid doesn't like spicy peppers.",
      negativeFact: "It likes sweet honey.",
      correctAnswer: "spicy peppers",
      options: ["spicy peppers", "sweet honey", "cold ice berries", "golden nuts"],
      explanation: "Fiery spicy peppers hurt Coral Mermaid's delicate water mouth!"
    },
    {
      round: 3,
      creatureId: "nature-fox",
      questionType: "like_action",
      prompt: "It's nap time in the forest. What activity does Nature Fox like?",
      targetGrammar: "Nature Fox likes sleeping.",
      negativeFact: "It doesn't like roaring.",
      correctAnswer: "sleeping",
      options: ["sleeping", "roaring", "swimming", "flying"],
      explanation: "Nature Fox is quiet and peaceful—it likes sleeping!"
    },
    {
      round: 4,
      creatureId: "astral-sprite",
      questionType: "like_food",
      prompt: "Astral Sprite needs cosmic energy! What does it like to crunch on?",
      targetGrammar: "Astral Sprite likes crunchy crystals.",
      negativeFact: "It doesn't like golden nuts.",
      correctAnswer: "crunchy crystals",
      options: ["crunchy crystals", "golden nuts", "sweet honey", "spicy peppers"],
      explanation: "Astral Sprite eats star minerals—it likes crunchy crystals!"
    },
    {
      round: 5,
      creatureId: "thunder-yeti",
      questionType: "like_food",
      prompt: "Thunder Yeti is overheating with electric power! What cool snack does it like?",
      targetGrammar: "Thunder Yeti likes cold ice berries.",
      negativeFact: "It doesn't like sweet honey.",
      correctAnswer: "cold ice berries",
      options: ["cold ice berries", "sweet honey", "golden nuts", "crunchy crystals"],
      explanation: "Cold ice berries cool down Thunder Yeti's high voltage spark!"
    },
    {
      round: 6,
      creatureId: "ember-dragon",
      questionType: "dislike_action",
      prompt: "Oh no! Fire and water do not mix! What action doesn't Ember Dragon like?",
      targetGrammar: "Ember Dragon doesn't like swimming.",
      negativeFact: "It likes flying.",
      correctAnswer: "swimming",
      options: ["swimming", "flying", "roaring", "sleeping"],
      explanation: "Ember Dragon's flames go out in water, so it doesn't like swimming!"
    },
    {
      round: 7,
      creatureId: "thunder-yeti",
      questionType: "like_action",
      prompt: "Hear the thunderstorm rumbling! What action does Thunder Yeti like?",
      targetGrammar: "Thunder Yeti likes roaring.",
      negativeFact: "It doesn't like sleeping.",
      correctAnswer: "roaring",
      options: ["roaring", "sleeping", "swimming", "golden nuts"],
      explanation: "Thunder Yeti is loud and mighty—it likes roaring!"
    },
    {
      round: 8,
      creatureId: "coral-mermaid",
      questionType: "like_food",
      prompt: "What golden sweet treat does Coral Mermaid order with tea?",
      targetGrammar: "Coral Mermaid likes sweet honey.",
      negativeFact: "It doesn't like spicy peppers.",
      correctAnswer: "sweet honey",
      options: ["sweet honey", "spicy peppers", "crunchy crystals", "golden nuts"],
      explanation: "Coral Mermaid adores floral sweet honey from mystic sea flowers!"
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CREATURE_CAFE_DATA;
}
