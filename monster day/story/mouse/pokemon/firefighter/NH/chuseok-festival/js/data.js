/**
 * CHUSEOK: KOREA'S HARVEST FESTIVAL
 * Complete 2-Lesson Synchronous Digital Courseware & Game Data
 * Unit 2: "Thank You" • Global Readings 2
 * CEFR A2-B1 | Primary / Lower-Intermediate Level
 */

(function(root) {
  'use strict';

  const CHUSEOK_DATA = {
    meta: {
      id: 'chuseok-festival',
      title: "Chuseok: Korea's Harvest Festival",
      subtitle: "The Weaving Mystery & Honoring Ancestors",
      unit: "Unit 2: Thank You",
      series: "Global Readings 2",
      grade: "Grade 3-5",
      level: "A2 / B1 (Lower Intermediate)",
      duration: "2 x 45 Minutes (90 Mins Total)",
      totalLessons: 2,
      totalSlides: 16,
      totalXP: 250,
      grammarFormula: "Gratitude Expressions: 'I am thankful for...' & 'They gather to [verb]...'",
      clilTopic: "Social Studies & World Cultures: Harvest Celebrations Around the World"
    },

    lessons: [
      {
        id: 1,
        title: "The Weaving Mystery & The Full Moon Feast",
        subtitle: "Lesson 1: Ancient Legends & The King's Challenge",
        slideRange: [1, 8],
        targetVocab: ["weave", "cloth", "contest", "harvest", "festival", "feast"],
        duration: "40-45 mins",
        xpReward: 100
      },
      {
        id: 2,
        title: "Colors, Cakes, and Honoring Ancestors",
        subtitle: "Lesson 2: Modern Traditions & Global Harvests",
        slideRange: [9, 16],
        targetVocab: ["ancestors", "songpyeon", "rice cake", "hanbok", "ceremony", "tradition"],
        duration: "40-45 mins",
        xpReward: 150
      }
    ],

    slides: [
      // ==========================================
      // LESSON 1: SLIDES 1 - 8
      // ==========================================
      {
        id: 1,
        lessonId: 1,
        slideNumber: 1,
        title: "Warm-Up: What Are You Holding?",
        type: "schema_activation",
        timing: "00:00 - 04:00 (4 mins)",
        modality: "[ANNOTATE] & [SPEAK]",
        summary: "Look closely at the items people hold with care. What makes your heart happy today?",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.95,
          pitch: 1.05,
          script: "Welcome back! Look closely at the hands on your screen. They are holding things people love. What makes your heart happy today?"
        },
        sentenceFrame: "I am thankful for my ______.",
        items: [
          { id: "game", icon: "🎮", name: "Game Controller", label: "My Games" },
          { id: "ball", icon: "⚽", name: "Football", label: "My Sports" },
          { id: "sweets", icon: "🍬", name: "Sweets & Treats", label: "Good Food" },
          { id: "home", icon: "🏠", name: "Cozy Home", label: "My Family" }
        ],
        teacherPrompt: "Give 15 seconds for students to stamp items with stars or hearts. Call 2 students to complete: 'I am thankful for my...'."
      },
      {
        id: 2,
        lessonId: 1,
        slideNumber: 2,
        title: "Visual Anchor: Weave & Cloth",
        type: "vocab_reveal",
        timing: "04:00 - 08:00 (4 mins)",
        modality: "[ACTION/TPR] & [CHAT]",
        summary: "Discover how thread turns into warm, colorful cloth using an ancient wooden loom.",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.85,
          pitch: 1.05,
          script: "Listen and repeat: Weave. [pause] Weave. The shuttle goes in and out to weave cloth. Now say: Cloth. [pause] Cloth."
        },
        sentenceFrame: "They ______ cloth together.",
        vocab: [
          { word: "Weave", pos: "verb", icon: "🧵", def: "To move threads over and under to make fabric.", actionPrompt: "Move both hands left and right like a loom shuttle!" },
          { word: "Cloth", pos: "noun", icon: "🧣", def: "A soft material made by weaving threads together.", actionPrompt: "Touch your shirt or sleeves—that is cloth!" }
        ],
        interactiveAction: "Click the loom shuttle to hear the rhythmic wooden clack clack!",
        teacherPrompt: "Verify hand movements on camera. Check the chat waterfall for students typing 'WEAVE' or 'CLOTH'."
      },
      {
        id: 3,
        lessonId: 1,
        slideNumber: 3,
        title: "Wordwall Challenge: Mystery Word Cracker",
        type: "mystery_chests",
        timing: "08:00 - 12:00 (4 mins)",
        modality: "[POLL/CHAT]",
        summary: "Crack open four ancient Korean treasure chests to discover four golden festival words!",
        tts: {
          persona: "Antony - Game Master",
          speed: 1.0,
          pitch: 1.0,
          script: "Four mystery chests, four new words! Which chest should we crack open first?"
        },
        chests: [
          { id: 1, icon: "🏆", word: "Contest", def: "A game or match with two teams trying to win.", clue: "Box 1: Two teams compete!" },
          { id: 2, icon: "🌾", word: "Harvest", def: "Gathering ripe crops and food at the end of summer.", clue: "Box 2: Golden rice and autumn fruit!" },
          { id: 3, icon: "🎉", word: "Festival", def: "A joyful celebration with games, music, and traditions.", clue: "Box 3: Joy, songs, and celebrations!" },
          { id: 4, icon: "🍲", word: "Feast", def: "A giant, delicious celebratory meal for everyone.", clue: "Box 4: Steaming dishes and delicious food!" }
        ],
        teacherPrompt: "Open voted chests, model pronunciation, and challenge students to match definition within 45 seconds."
      },
      {
        id: 4,
        lessonId: 1,
        slideNumber: 4,
        title: "Guided Story: The Great Weaving Challenge",
        type: "story_contest",
        timing: "12:00 - 18:00 (6 mins)",
        modality: "[ANNOTATE]",
        summary: "Long ago in Korea, two royal teams entered a fierce month-long weaving competition!",
        tts: {
          persona: "Adam - Narrative Storyteller",
          speed: 0.90,
          pitch: 1.0,
          script: "Who can weave the most cloth? Two teams have a contest to find out. They weave and weave for a whole month!"
        },
        storyFacts: [
          { label: "How long?", value: "One whole month!", icon: "📅" },
          { label: "Who?", value: "Two royal teams!", icon: "👥" },
          { label: "Goal:", value: "Weave the most rolls of silk cloth!", icon: "🧵" }
        ],
        teams: [
          { name: "Team Blue", color: "#38bdf8", rollsCount: 5 },
          { name: "Team Red", color: "#f43f5e", rollsCount: 6 }
        ],
        teacherPrompt: "Assign Team Blue and Team Red. Have students count and stamp cloth rolls to see who leads!"
      },
      {
        id: 5,
        lessonId: 1,
        slideNumber: 5,
        title: "Story Climax: The King & The Full Moon",
        type: "story_climax",
        timing: "18:00 - 24:00 (6 mins)",
        modality: "[CHAT] & [SPEAK]",
        summary: "On the night of the radiant autumn harvest moon, the King declares the grand prize!",
        tts: {
          persona: "Marcus - Deep Theatrical Monarch",
          speed: 0.88,
          pitch: 0.95,
          script: "It is the night of the full moon! This team wins! The prize is a big feast for both teams!"
        },
        keyElements: [
          { icon: "🌕", text: "Night of the Autumn Full Moon" },
          { icon: "👑", text: "The King chooses the winner" },
          { icon: "🍲", text: "The Prize: A giant delicious FEAST for all!" }
        ],
        sentenceFrame: "The prize is a big _________ (feast / cloth) for everyone!",
        teacherPrompt: "Unmute a student to deliver the King's line in their deepest royal voice!"
      },
      {
        id: 6,
        lessonId: 1,
        slideNumber: 6,
        title: "Consolidation Mini-Game: True or False Fast Dash",
        type: "true_false_quiz",
        timing: "24:00 - 30:00 (6 mins)",
        modality: "[POLL]",
        summary: "Test your quick recall with three fast-paced true or false challenge cards!",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 1.0,
          pitch: 1.05,
          script: "Quick check! Are these statements True or False? Ready... go!"
        },
        questions: [
          {
            id: 1,
            text: "The weaving contest lasted for only two days.",
            correct: false,
            feedback: "False! The teams wove cloth for a whole month!"
          },
          {
            id: 2,
            text: "The King arrived on the night of the full moon.",
            correct: true,
            feedback: "True! The full moon marked the end of the competition."
          },
          {
            id: 3,
            text: "Only the winning team was allowed to eat the feast.",
            correct: false,
            feedback: "False! The prize was a giant feast shared by BOTH teams!"
          }
        ],
        teacherPrompt: "Trigger quick poll responses. Emphasize that in Chuseok spirit, the feast was shared by everyone."
      },
      {
        id: 7,
        lessonId: 1,
        slideNumber: 7,
        title: "Production: The Gratitude Harvest Card",
        type: "gratitude_board",
        timing: "30:00 - 38:00 (8 mins)",
        modality: "[COLLABORATIVE BOARD / SPEAK]",
        summary: "Write your personal harvest gratitude message and pin it to the class autumn board!",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.95,
          pitch: 1.05,
          script: "At Chuseok, people celebrate being together. Write your gratitude card to share with the class."
        },
        template: {
          stem1: "I am thankful for my",
          options1: ["family", "friends", "home", "teacher", "books", "pets"],
          stem2: "They make me feel",
          options2: ["happy", "safe", "loved", "strong", "grateful"]
        },
        teacherPrompt: "Invite students to submit their cards. Read out 3-4 cards live on microphone with high praise."
      },
      {
        id: 8,
        lessonId: 1,
        slideNumber: 8,
        title: "Lesson 1 Wrap-Up: Star Trophies Cleared!",
        type: "milestone_badge",
        timing: "38:00 - 40:00 (2 mins)",
        modality: "[REACTION]",
        summary: "Celebrate completing Lesson 1 and claim your three commemorative ancient tokens!",
        tts: {
          persona: "Antony - Game Master",
          speed: 1.0,
          pitch: 1.05,
          script: "Lesson 1 Cleared! You unlocked the Loom Token, Harvest Moon Badge, and the King's Royal Crown!"
        },
        badges: [
          { id: "loom", icon: "🧵", title: "Loom Master", desc: "Learned how threads make cloth" },
          { id: "moon", icon: "🌕", title: "Harvest Moon", desc: "Discovered the full moon contest" },
          { id: "crown", icon: "👑", title: "King's Crown", desc: "Awarded the feast to everyone" }
        ],
        xpAward: 100,
        nextLessonTeaser: "Up next in Lesson 2: What delicious food and colorful clothes do families share today?"
      },

      // ==========================================
      // LESSON 2: SLIDES 9 - 16
      // ==========================================
      {
        id: 9,
        lessonId: 2,
        slideNumber: 1,
        title: "Fast Recall: Spin-the-Wheel Review",
        type: "spin_wheel",
        timing: "00:00 - 05:00 (5 mins)",
        modality: "[SPIN / SPEAK]",
        summary: "Spin the ancient prize wheel to test your recall of Lesson 1 vocabulary!",
        tts: {
          persona: "Antony - Game Master",
          speed: 1.0,
          pitch: 1.05,
          script: "Round two begins! Let's give the wheel a spin to see who remembers our magic words!"
        },
        wheelItems: [
          { word: "Weave", def: "Making cloth with threads", color: "#38bdf8" },
          { word: "Contest", def: "A game where teams compete", color: "#f59e0b" },
          { word: "Harvest", def: "Gathering autumn crops", color: "#10b981" },
          { word: "Full Moon", def: "The glowing autumn night", color: "#a855f7" },
          { word: "Feast", def: "A giant celebratory meal", color: "#f43f5e" }
        ],
        teacherPrompt: "Spin the wheel, land on a word, and ask the student to define it or construct a sentence within 30 seconds."
      },
      {
        id: 10,
        lessonId: 2,
        slideNumber: 2,
        title: "Modern Chuseok: Meet the Family & Hanbok",
        type: "tradition_spotlight",
        timing: "05:00 - 10:00 (5 mins)",
        modality: "[CHAT] & [ANNOTATE]",
        summary: "See how modern Korean families celebrate for three days wearing bright traditional Hanbok clothes.",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.90,
          pitch: 1.05,
          script: "Today, Chuseok lasts three days at the end of summer. Families travel home to celebrate and give thanks for the harvest."
        },
        facts: [
          { icon: "⏱️", label: "Duration", value: "3 Days Holiday" },
          { icon: "📅", label: "Season", value: "End of Summer / Early Autumn" },
          { icon: "👘", label: "Clothing", value: "Traditional Hanbok (Silk Robes)" },
          { icon: "🚗", label: "Journey", value: "Travel home to visit grandparents" }
        ],
        sentenceFrame: "They go home to see their _________ (grandparents / teachers).",
        chatQuestion: "Do you travel to visit family during holidays? Type YES or NO in chat!",
        teacherPrompt: "Highlight Hanbok colors and ask students to stamp a heart on the child's bright silk jacket."
      },
      {
        id: 11,
        lessonId: 2,
        slideNumber: 3,
        title: "Food Discovery: Songpyeon Rice Cakes",
        type: "food_cutaway",
        timing: "10:00 - 15:00 (5 mins)",
        modality: "[POLL / SPEAK]",
        summary: "Discover Songpyeon—delicious half-moon rice cakes filled with sweet honey, sesame, and beans!",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.85,
          pitch: 1.05,
          script: "Songpyeon! These are special rice cakes. Inside, they are sweet, filled with honey, sesame, and beans!"
        },
        songpyeonFacts: [
          { icon: "🍡", label: "Name", value: "Songpyeon (Rice Cake)" },
          { icon: "🌙", label: "Shape", value: "Shaped like a half-moon" },
          { icon: "🍯", label: "Filling", value: "Sweet honey, sesame seeds, beans" },
          { icon: "🌲", label: "Steamed on", value: "Fresh pine needles for scent" }
        ],
        sentenceFrame: "Songpyeon tastes _________ (sweet / salty / spicy).",
        pollQuestion: "Would you like to taste Songpyeon?",
        pollOptions: [
          "Yes! I love sweet rice cakes! 🍯",
          "No, I prefer crunchy salty snacks! 🥨"
        ],
        teacherPrompt: "Elicit sensory adjectives from students: sweet, chewy, warm, soft, fragrant."
      },
      {
        id: 12,
        lessonId: 2,
        slideNumber: 4,
        title: "Tradition in Motion: The Circle Dance (Ganggangsullae)",
        type: "circle_dance",
        timing: "15:00 - 20:00 (5 mins)",
        modality: "[SPEAK] & [ANNOTATE]",
        summary: "Join hands under the harvest moon in Ganggangsullae—an ancient circular dance of unity and joy.",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.90,
          pitch: 1.05,
          script: "Under the full moon, women and girls join hands. They dance and sing together in a giant circle."
        },
        danceFacts: [
          { icon: "💃", text: "Women and girls join hands in a giant circle" },
          { icon: "🌕", text: "Danced outdoors under the bright autumn moon" },
          { icon: "🥁", text: "Guided by the steady beat of the traditional drum (Janggu)" }
        ],
        sentenceFrame: "In my country, we dance by _________.",
        interactiveRhythm: "Click to start the traditional Janggu drum tempo and watch the dancers revolve!",
        teacherPrompt: "Have all students stand and raise both hands in a circle to feel the rhythm."
      },
      {
        id: 13,
        lessonId: 2,
        slideNumber: 5,
        title: "Honoring Ancestors: The Memorial Ceremony (Charye)",
        type: "ancestor_table",
        timing: "20:00 - 26:00 (6 mins)",
        modality: "[CHAT] & [VOCAB MATCH]",
        summary: "Learn how families prepare ceremonial harvest tables and bow deeply to remember their ancestors.",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.85,
          pitch: 1.05,
          script: "Chuseok is also a time to remember ancestors. Ancestors are family members who lived long ago. Families bow and share harvest food to show love and respect."
        },
        tableElements: [
          { id: "ancestor", term: "Ancestors", match: "Family members from long ago", icon: "👴" },
          { id: "ceremony", term: "Ceremony (Charye)", match: "Special table of fresh harvest food", icon: "🍱" },
          { id: "bow", term: "Deep Bow", match: "Sign of deep love and respect", icon: "🙇" }
        ],
        sentenceFrame: "This shows they care about their __________.",
        teacherPrompt: "Clarify cultural meaning: bowing in this tradition expresses gratitude, memory, and respect."
      },
      {
        id: 14,
        lessonId: 2,
        slideNumber: 6,
        title: "Cultural Bridge: Harvest Around the World",
        type: "venn_diagram",
        timing: "26:00 - 33:00 (7 mins)",
        modality: "[DRAG & DROP / SPEAK]",
        summary: "Compare Chuseok traditions with harvest celebrations in your own culture and family.",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.95,
          pitch: 1.05,
          script: "People all around the world celebrate the harvest! What does Chuseok share with holidays in your country?"
        },
        tiles: [
          { id: "t1", text: "Special sweet food (Songpyeon)", category: "chuseok" },
          { id: "t2", text: "Eating together with family", category: "both" },
          { id: "t3", text: "3 days national holiday", category: "chuseok" },
          { id: "t4", text: "Giving thanks for food", category: "both" },
          { id: "t5", text: "Circle dance (Ganggangsullae)", category: "chuseok" },
          { id: "t6", text: "Autumn harvest season", category: "both" }
        ],
        sentenceFrame: "Both holidays celebrate by _________.",
        teacherPrompt: "Guide students to see that 'Giving thanks' and 'Family food' always belong in the center overlap."
      },
      {
        id: 15,
        lessonId: 2,
        slideNumber: 7,
        title: "High-Energy Quest: 3-Minute Harvest Dash",
        type: "blooket_quiz",
        timing: "33:00 - 38:00 (5 mins)",
        modality: "[GAMIFIED COMPETITION]",
        summary: "Race against the 15-second clock in a four-question rapid quiz challenge!",
        tts: {
          persona: "Antony - Game Master",
          speed: 1.05,
          pitch: 1.05,
          script: "Time for the Final Harvest Quest! Grab your devices or answer right on your screen!"
        },
        quizQuestions: [
          {
            id: 1,
            q: "What sweet food is made especially for Chuseok?",
            options: ["Songpyeon (rice cake)", "Pizza", "Hot dog", "Ice cream"],
            correct: 0
          },
          {
            id: 2,
            q: "Who do families honor during the morning ceremony?",
            options: ["Ancient ancestors", "School teachers", "Movie stars", "Only the king"],
            correct: 0
          },
          {
            id: 3,
            q: "How many days does modern Chuseok holiday last?",
            options: ["1 day", "3 days", "7 days", "1 month"],
            correct: 1
          },
          {
            id: 4,
            q: "What shape are Songpyeon rice cakes?",
            options: ["Half-moon", "Square box", "Triangle star", "Circle coin"],
            correct: 0
          }
        ],
        teacherPrompt: "Cheer on students as the clock ticks! Celebrate top scorers on the microphone."
      },
      {
        id: 16,
        lessonId: 2,
        slideNumber: 8,
        title: "Exit Ticket: The Gratitude Handprint",
        type: "exit_ticket",
        timing: "38:00 - 40:00 (2 mins)",
        modality: "[CHAT EXIT TICKET]",
        summary: "Type your final harvest thank-you note before claiming your master graduation certificate!",
        tts: {
          persona: "Rachel - Warm Educator",
          speed: 0.95,
          pitch: 1.05,
          script: "You did an amazing job today. Before you leave, tell us one thing you will say thank you for today."
        },
        sentenceFrame: "Today I will say thank you to ______ for ______.",
        teacherPrompt: "Read each submitted exit ticket out loud to dismiss students individually with warm encouragement."
      }
    ]
  };

  root.CHUSEOK_DATA = CHUSEOK_DATA;
})(typeof window !== 'undefined' ? window : global);
