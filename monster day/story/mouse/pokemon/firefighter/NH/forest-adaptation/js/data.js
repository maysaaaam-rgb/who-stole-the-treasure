/**
 * forest-adaptation/js/data.js
 * Curriculum Database & Question Banks
 * Module 1: Nature's Armor — Deciduous vs. Coniferous Forests (Image 3)
 * Module 2: The Detective's Lens — Decoding Author's Purpose (Image 4)
 */

const FOREST_ADAPTATION_DATA = {
  meta: {
    id: "forest-adaptation",
    title: "🌲 Nature's Armor & The Detective's Lens",
    subtitle: "Forest Biome Adaptations & Decoding Author's Purpose",
    modules: [
      { id: 1, title: "Module 1: Nature's Armor — Deciduous vs. Coniferous Forests" },
      { id: 2, title: "Module 2: The Detective's Lens — Decoding Author's Purpose" }
    ],
    targetFormulas: [
      "In [Season], I adapt by [Action/Clothing].",
      "The author wrote [Title] to [teach / entertain / persuade].",
      "[Organism] adapts by [Adaptation]."
    ]
  },

  // =========================================================================
  // MODULE 1: FOREST ECOLOGY & SEASONAL ADAPTATION (IMAGE 3)
  // =========================================================================

  // Stage 1: Biome Scanner & True/False Arena (Activity A)
  biomeStatements: [
    {
      id: "stmt-1",
      number: 1,
      text: "The trees don't lose their leaves in autumn.",
      correctBiome: "coniferous", // Coniferous evergreen needles stay on trees
      explanation: "Coniferous trees are evergreen! Their waxy needles stay green and do not fall off in autumn.",
      icon: "🌲"
    },
    {
      id: "stmt-2",
      number: 2,
      text: "Winters are shorter here.",
      correctBiome: "deciduous", // Deciduous temperate forests have milder, shorter winters
      explanation: "Deciduous forests have four distinct seasons with warmer, shorter winters than cold taiga coniferous forests.",
      icon: "🍂"
    },
    {
      id: "stmt-3",
      number: 3,
      text: "The animals find food in the trees.",
      correctBiome: "coniferous", // Conifer seeds in pine cones provide winter food
      explanation: "Animals in coniferous forests rely on nutritious seeds hidden inside pine cones high up in the trees.",
      icon: "🐿️"
    },
    {
      id: "stmt-4",
      number: 4,
      text: "The leaves stay the same color in autumn.",
      correctBiome: "coniferous", // Coniferous needles don't turn red/orange
      explanation: "Needles on coniferous trees remain deep green all year round, while deciduous broadleaves change to red and gold.",
      icon: "🌲"
    },
    {
      id: "stmt-5",
      number: 5,
      text: "Some animals change color in winter.",
      correctBiome: "coniferous", // Snowshoe hares, ermines adapt to snowy northern taiga
      explanation: "In harsh coniferous snow forests, animals like the snowshoe hare turn from summer brown to winter snow-white for camouflage!",
      icon: "🐇"
    },
    {
      id: "stmt-6",
      number: 6,
      text: "The leaves of these trees are not thin.",
      correctBiome: "deciduous", // Broad, flat leaves (not thin needles)
      explanation: "Deciduous trees have broad, flat leaves that catch maximum sunlight in spring and summer, rather than thin needles.",
      icon: "🍁"
    }
  ],

  // Stage 2: Winter Survival Match (Activity B)
  survivalOrganisms: [
    {
      id: "org-deciduous",
      name: "Deciduous Trees",
      icon: "🌳",
      targetId: "target-b",
      soundEffect: "leavesRustle",
      actionFeedback: "Deciduous trees drop their broad leaves in autumn to save water and prevent freezing, then grow fresh green buds in spring!"
    },
    {
      id: "org-coniferous",
      name: "Coniferous Trees",
      icon: "🌲",
      targetId: "target-a",
      soundEffect: "pineChime",
      actionFeedback: "Coniferous trees have thin, wax-coated needles that resist heavy snow and stay green through freezing blizzards!"
    },
    {
      id: "org-bears",
      name: "Bears",
      icon: "🐻",
      targetId: "target-d",
      soundEffect: "bearSnore",
      actionFeedback: "Bears eat berries and fish in autumn to gain fat, then hibernate deep in cozy dens until the warm spring sun wakes them!"
    },
    {
      id: "org-hares",
      name: "Hares",
      icon: "🐇",
      targetId: "target-c",
      soundEffect: "hareMorph",
      actionFeedback: "Snowshoe hares molt their brown summer coat into fluffy white fur so predators cannot spot them against the winter snow!"
    }
  ],

  survivalTargets: [
    {
      id: "target-a",
      letter: "a",
      text: "have thin leaves.",
      correctOrgId: "org-coniferous"
    },
    {
      id: "target-b",
      letter: "b",
      text: "lose their leaves in autumn and grow them again in spring.",
      correctOrgId: "org-deciduous"
    },
    {
      id: "target-c",
      letter: "c",
      text: "change from brown to white.",
      correctOrgId: "org-hares"
    },
    {
      id: "target-d",
      letter: "d",
      text: "hibernate and wake up in spring.",
      correctOrgId: "org-bears"
    }
  ],

  // Stage 3: The 4-Season Human Adaptation Matrix (Activity C)
  seasonalAdaptations: {
    seasons: [
      { id: "spring", label: "Spring", icon: "🌱", color: "#22c55e", theme: "Mild & Rainy" },
      { id: "summer", label: "Summer", icon: "☀️", color: "#f59e0b", theme: "Hot & Sunny" },
      { id: "autumn", label: "Autumn", icon: "🍁", color: "#ea580c", theme: "Cool & Crisp" },
      { id: "winter", label: "Winter", icon: "❄️", color: "#38bdf8", theme: "Freezing & Snowy" }
    ],
    items: [
      { id: "item-coat", name: "Heavy Winter Coat", icon: "🧥", season: "winter", tip: "Protects against sub-zero chills and blizzards" },
      { id: "item-boots", name: "Snow Boots", icon: "🥾", season: "winter", tip: "Keeps feet dry and warm in deep snow" },
      { id: "item-soup", name: "Steaming Hot Soup", icon: "🍲", season: "winter", tip: "Warms our core body temperature inside" },
      { id: "item-swim", name: "Swimsuit & Towel", icon: "🩳", season: "summer", tip: "Helps us cool down in the lake or sea" },
      { id: "item-sunglasses", name: "Sunglasses", icon: "🕶️", season: "summer", tip: "Shields eyes from bright summer ultraviolet light" },
      { id: "item-fan", name: "Hand Fan / Cool Drink", icon: "🍹", season: "summer", tip: "Prevents heatstroke during hot summer afternoons" },
      { id: "item-umbrella", name: "Rain Umbrella", icon: "☂️", season: "spring", tip: "Keeps us dry during frequent spring rain showers" },
      { id: "item-lightjacket", name: "Light Windbreaker", icon: "🧥", season: "autumn", tip: "Perfect for breezy autumn afternoons" },
      { id: "item-rake", name: "Harvest Garden Gloves", icon: "🧤", season: "autumn", tip: "Helps gather fallen autumn leaves and crops" }
    ]
  },

  // =========================================================================
  // MODULE 2: AUTHOR'S PURPOSE INVESTIGATOR (IMAGE 4)
  // =========================================================================

  // Stage 4: Alice's Portal & Purpose Wheel (Activity A)
  aliceWarmup: {
    prompt: "The author wrote 'The Beginning of Alice's Adventures' to...",
    options: [
      { id: "opt-rabbits", text: "teach me about rabbits", correct: false, badge: "TEACH" },
      { id: "opt-alice", text: "help me understand Alice", correct: false, badge: "INFORM" },
      { id: "opt-fun", text: "help me have fun", correct: true, badge: "ENTERTAIN" }
    ],
    goldenRule: {
      title: "🌟 The Golden Rule of Author's Purpose",
      ruleText: "Authors usually write to TEACH something, CHANGE someone's opinion (PERSUADE), or ENTERTAIN.",
      badges: [
        {
          id: "entertain",
          label: "TO ENTERTAIN",
          icon: "🎭",
          color: "#ec4899",
          desc: "Makes you laugh, feel thrilled, imagine magic, or have fun with a creative story!"
        },
        {
          id: "teach",
          label: "TO TEACH / INFORM",
          icon: "📖",
          color: "#38bdf8",
          desc: "Gives real-world facts, science knowledge, explanations, or step-by-step instructions!"
        },
        {
          id: "persuade",
          label: "TO PERSUADE",
          icon: "📢",
          color: "#f59e0b",
          desc: "Tries to convince you to agree, change your mind, take action, or buy an idea!"
        }
      ]
    }
  },

  // Stage 5: "A New Friend" Story Teaser & Case File (Activity B)
  storyTeaser: {
    title: "A New Friend",
    koreanSetting: "Go Ne's House (Traditional Korean Tiled Roof)",
    audioWords: [
      "Every", "spring,", "a", "swallow", "comes", "back", "and", "builds", "her", "nest", 
      "under", "the", "roof", "of", "Go", "Ne's", "house.", "Go", "Ne", "and", "his", "father", 
      "love", "watching", "the", "baby", "birds", "grow.", "One", "day,", "a", "little", "chick", 
      "falls", "from", "the", "nest!", "Go", "Ne", "and", "father", "gently", "help", "the", "bird", 
      "and", "make", "a", "warm", "new", "friend."
    ],
    textFull: "Every spring, a swallow comes back and builds her nest under the roof of Go Ne's house. Go Ne and his father love watching the baby birds grow. One day, a little chick falls from the nest! Go Ne and father gently help the bird and make a warm new friend.",
    verdictQuestions: [
      {
        id: "q-entertain",
        prompt: "Does the author want to entertain me?",
        correctYes: true,
        feedback: "YES! The charming story of Go Ne and the baby bird entertains and warms our hearts."
      },
      {
        id: "q-teach",
        prompt: "Does the author want to teach me about birds?",
        correctYes: true,
        feedback: "YES! It teaches real nature facts about how swallows build nests under roofs in spring."
      },
      {
        id: "q-persuade",
        prompt: "Does the author want to change my opinion about birds?",
        correctYes: false,
        feedback: "NO! The author is not arguing or trying to convince you to change an opinion."
      }
    ],
    synthesisFrame: {
      starter: "I think the author's purpose is to",
      slots: ["entertain", "teach"],
      availableTokens: ["entertain", "teach", "persuade", "sell things"],
      fullSentence: "I think the author's purpose is to entertain and teach."
    }
  },

  // Stage 6: The Young Author's Speech Studio & Paper Airplane Vault (Activity C)
  authorStudio: {
    formats: ["a poem", "a story", "a letter", "a birthday card"],
    purposes: [
      { value: "entertain", label: "entertain (make them laugh)", icon: "🎭" },
      { value: "teach", label: "teach (share a cool fact)", icon: "📖" },
      { value: "thank", label: "thank (show gratitude)", icon: "❤️" },
      { value: "persuade", label: "persuade (convince them)", icon: "📢" }
    ],
    recipients: ["my best friend", "my mom and dad", "my teacher", "my whole class"],
    presets: [
      { format: "a poem", purpose: "entertain", recipient: "my best friend", note: "to make them laugh at funny rhymes!" },
      { format: "a birthday card", purpose: "thank", recipient: "my mom and dad", note: "to thank them for cooking warm meals!" },
      { format: "a story", purpose: "teach", recipient: "my whole class", note: "to teach them how bears survive winter!" },
      { format: "a letter", purpose: "persuade", recipient: "my teacher", note: "to convince our class to have extra reading time!" }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FOREST_ADAPTATION_DATA;
}
