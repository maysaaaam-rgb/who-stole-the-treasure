/**
 * harvest-feast/js/data.js
 * Curriculum Vocabulary, Sentence Frames & Cultural Database
 * Lesson 1: "Story Settings and the Harvest"
 * Lesson 2: "The Chuseok Harvest Feast"
 */

const HARVEST_DATA = {
  meta: {
    id: "harvest-feast",
    title: "🌾 Story Settings & The Chuseok Harvest Feast",
    units: [
      "Lesson 1: Story Settings and the Harvest (Pre-reading & Settings Analysis)",
      "Lesson 2: The Chuseok Harvest Feast (Comprehension & Cultural Traditions)"
    ],
    targetConcept: "The setting is the time and place in the story.",
    grammarFormulas: [
      "Clara is [Verb-ing] because she feels [Adjective].",
      "We find [Items] in the kitchen / on the farm / in both places.",
      "They are thankful for [the harvest / food].",
      "They are also thankful for [family / ancestors]."
    ]
  },

  // STAGE 1: SETTING & EMOTION DECODER (Lesson 1 - Warm-up)
  claraPanels: [
    {
      id: "panel-climbing",
      title: "Clara in the Orchard Tree",
      settingText: "Time: Sunny morning · Place: Apple Orchard Tree",
      description: "Clara climbs up a high apple tree branch. She looks down in surprise!",
      setting: "farm",
      pose: "climbing",
      actions: ["laughing", "climbing", "crying"],
      emotions: ["scared", "happy", "surprised"],
      correctAction: "climbing",
      correctEmotion: "surprised",
      voiceLine: "Whoa! Look how high I am! Clara is climbing and feels surprised!",
      claraQuote: "I reached the top branch! Look at all the red apples!"
    },
    {
      id: "panel-laughing",
      title: "Clara with the Harvest Basket",
      settingText: "Time: Golden afternoon · Place: Kitchen Garden",
      description: "Clara holds a heavy basket of giant orange pumpkins and sweet corn. She is laughing joyfully!",
      setting: "farm",
      pose: "laughing",
      actions: ["laughing", "climbing", "crying"],
      emotions: ["scared", "happy", "sad"],
      correctAction: "laughing",
      correctEmotion: "happy",
      voiceLine: "Hahaha! Yummy pumpkins! Clara is laughing and feels happy!",
      claraQuote: "Our harvest is so big and sweet! We did it together!"
    },
    {
      id: "panel-crying",
      title: "Clara in the Tall Wheat at Twilight",
      settingText: "Time: Windy sunset · Place: Deep Wheat Field",
      description: "The wheat stalks are taller than Clara. The wind howls and she cannot find the path home!",
      setting: "farm",
      pose: "crying",
      actions: ["laughing", "climbing", "crying"],
      emotions: ["scared", "happy", "angry"],
      correctAction: "crying",
      correctEmotion: "scared",
      voiceLine: "Oh no! It is getting dark! Clara is crying because she feels scared!",
      claraQuote: "Where is the wooden gate? The wheat is so tall and dark!"
    }
  ],

  // STAGE 2: DUAL-ZONE VENN DIAGRAM RELAY (Lesson 1 - Core Activity)
  vennDiagram: {
    zones: [
      { id: "kitchen", label: "In the Kitchen", icon: "🍳", desc: "Warm indoor setting, cooking & eating tools" },
      { id: "both", label: "Both Places", icon: "🤝", desc: "Shared across the farm and the home" },
      { id: "farm", label: "On the Farm", icon: "🚜", desc: "Open-air outdoors, soil, fields & crops" }
    ],
    tokens: [
      {
        id: "fruit",
        word: "fruit",
        label: "Fruit",
        icon: "🍎",
        zone: "both",
        hint: "Grows on orchard trees on the farm, washed & eaten in the kitchen!",
        splashType: "fruit"
      },
      {
        id: "vegetables",
        word: "vegetables",
        label: "Vegetables",
        icon: "🥕",
        zone: "both",
        hint: "Harvested from garden soil on the farm, chopped & cooked in the kitchen!",
        splashType: "veggie"
      },
      {
        id: "family",
        word: "family",
        label: "Family",
        icon: "👨‍👩‍👧‍👦",
        zone: "both",
        hint: "Harvests crops together on the farm, gathers to share meals in the kitchen!",
        splashType: "family"
      },
      {
        id: "outside",
        word: "outside",
        label: "Outside",
        icon: "🌤️",
        zone: "farm",
        hint: "Under the wide open autumn sky and gentle breeze!",
        splashType: "wind"
      },
      {
        id: "plants",
        word: "plants",
        label: "Plants",
        icon: "🌾",
        zone: "farm",
        hint: "Wheat, corn, and trees rooted in the rich farm soil!",
        splashType: "wheat"
      },
      {
        id: "inside",
        word: "inside",
        label: "Inside",
        icon: "🏠",
        zone: "kitchen",
        hint: "Protected from wind and rain inside the warm home walls!",
        splashType: "hearth"
      },
      {
        id: "bowls",
        word: "bowls",
        label: "Bowls",
        icon: "🥣",
        zone: "kitchen",
        hint: "Wooden tableware used to hold steaming soup and delicious food!",
        splashType: "soup"
      }
    ]
  },

  // STAGE 3: THE CHUSEOK SONGPYEON FEAST (Lesson 2 - Core Activity)
  songpyeonCakes: [
    {
      id: "cake-1",
      number: 1,
      colorName: "Sesame White",
      colorHex: "#f8fafc",
      accentHex: "#cbd5e1",
      title: "Buy new clothes",
      unlocked: true,
      clue: "Traditional Chuseokbim (New Clothes)",
      koreanTradition: "Hanbok (Chuseokbim)",
      promptQuestion: "What do people prepare to wear on the morning of Chuseok?",
      options: [
        "Buy new clothes (Hanbok)",
        "Wear swimsuits",
        "Put on pajamas"
      ],
      correctIndex: 0,
      culturalFact: "Families wear new festive silk clothes called Hanbok or Chuseokbim to greet the autumn harvest in purity."
    },
    {
      id: "cake-2",
      number: 2,
      colorName: "Mugwort Green",
      colorHex: "#22c55e",
      accentHex: "#15803d",
      title: "Make songpyeon",
      unlocked: false,
      clue: "Half-moon shaped steamed rice cakes",
      koreanTradition: "Songpyeon (Half-Moon Rice Cakes)",
      promptQuestion: "What special crescent-shaped rice cakes do families steam over fragrant pine needles?",
      options: [
        "Make songpyeon",
        "Bake birthday cake",
        "Order takeaway pizza"
      ],
      correctIndex: 0,
      culturalFact: "Songpyeon are shaped like half-moons filled with sesame seeds, honey, and chestnut. As the half-moon grows to a full moon, the family's future will grow bright!"
    },
    {
      id: "cake-3",
      number: 3,
      colorName: "Pumpkin Gold",
      colorHex: "#f59e0b",
      accentHex: "#b45309",
      title: "Visit family & ancestors",
      unlocked: false,
      clue: "Charye Memorial & Homecoming",
      koreanTradition: "Charye & Seongmyo",
      promptQuestion: "Who do families travel across the country to visit, honor, and remember during Chuseok?",
      options: [
        "Visit family & ancestors",
        "Visit the zoo animals",
        "Visit the shopping mall"
      ],
      correctIndex: 0,
      culturalFact: "Chuseok is the great homecoming. Families gather at their hometown to conduct Charye (ancestor memorial table) with fresh harvest offerings."
    },
    {
      id: "cake-4",
      number: 4,
      colorName: "Sweet Purple",
      colorHex: "#a855f7",
      accentHex: "#6d28d9",
      title: "Eat a big meal together",
      unlocked: false,
      clue: "Harvest Banquet & Sharing",
      koreanTradition: "Chuseok Feast Table",
      promptQuestion: "What do all relatives do together around the large dining table after the morning ceremonies?",
      options: [
        "Eat a big meal together",
        "Take a silent nap",
        "Run an obstacle race"
      ],
      correctIndex: 0,
      culturalFact: "A famous Korean proverb says: 'May every day be just like Chuseok'—meaning full of abundance, delicious food, and loving family."
    },
    {
      id: "cake-5",
      number: 5,
      colorName: "Berry Blush Pink",
      colorHex: "#f43f5e",
      accentHex: "#be123c",
      title: "Give thanks for the harvest",
      unlocked: false,
      clue: "Heartfelt Gratitude & Celebration",
      koreanTradition: "Celebration of Gratitude",
      promptQuestion: "What is the heart and true purpose of the Chuseok festival?",
      options: [
        "Give thanks for the harvest",
        "Hide inside from rain",
        "Play video games alone"
      ],
      correctIndex: 0,
      culturalFact: "Under the brilliant autumn full moon, people sing Ganggangsullae and give heartfelt thanks for the earth, the crops, and each other."
    }
  ],

  // STAGE 4: GRATITUDE SENTENCE BUILDER & LANTERN FINALE (Lesson 2 - Exit Ticket)
  sentenceFrames: [
    {
      id: "frame-1",
      starter: "They are thankful for",
      options: ["the harvest", "good food", "warm clothes"],
      correct: "the harvest",
      full: "They are thankful for the harvest."
    },
    {
      id: "frame-2",
      starter: "They are also thankful for",
      options: ["family & ancestors", "fast sports cars", "loud airplanes"],
      correct: "family & ancestors",
      full: "They are also thankful for family & ancestors."
    }
  ],

  presetGratitudeOptions: [
    "my loving family",
    "delicious harvest food",
    "my kind classmates",
    "our hard-working teachers",
    "good health & strength",
    "nature and autumn trees",
    "books and story learning",
    "sunny days on the farm"
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HARVEST_DATA;
}
