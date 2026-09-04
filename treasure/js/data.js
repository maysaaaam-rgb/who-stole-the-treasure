/**
 * Game Data for "Who Stole the Treasure?" & "Detective Preparation"
 * Contains:
 * 1. 🕵️ DETECTIVE PREPARATION (Warm-Up Activities & Live Classroom Game)
 * 2. 🏴‍☠️ WHO STOLE THE TREASURE? (Full 8-Suspect Investigation Game)
 */

const GAME_DATA = {
  // =========================================================================
  // SECTION 1: 🕵️ DETECTIVE PREPARATION (WARM-UP ACTIVITIES)
  // =========================================================================
  prepGame: {
    // Mini-Game 1: Question Practice (Target ➔ Match Question)
    mg1: [
      {
        targetIcon: "💇‍♂️",
        targetTitle: "BLACK HAIR",
        characterImg: "👦",
        prompt: "Choose the question to ask about this visual target:",
        speechPrompt: "Choose the question for black hair.",
        options: [
          { text: "Does he have black hair?", isCorrect: true, speech: "Does he have black hair?" },
          { text: "Does he sit near the door?", isCorrect: false, speech: "Does he sit near the door?" },
          { text: "Is it a girl?", isCorrect: false, speech: "Is it a girl?" }
        ]
      },
      {
        targetIcon: "📍 🪟",
        targetTitle: "NEAR THE WINDOW",
        characterImg: "👧",
        prompt: "Choose the question to ask about their seating position:",
        speechPrompt: "Choose the question for sitting near the window.",
        options: [
          { text: "Does she wear glasses?", isCorrect: false, speech: "Does she wear glasses?" },
          { text: "Does she sit near the window?", isCorrect: true, speech: "Does she sit near the window?" },
          { text: "Does she have long hair?", isCorrect: false, speech: "Does she have long hair?" }
        ]
      },
      {
        targetIcon: "👓",
        targetTitle: "GLASSES",
        characterImg: "🧑‍🏫",
        prompt: "Choose the question to ask about their glasses:",
        speechPrompt: "Choose the question for wearing glasses.",
        options: [
          { text: "Does he/she wear glasses?", isCorrect: true, speech: "Does he or she wear glasses?" },
          { text: "Is it a boy?", isCorrect: false, speech: "Is it a boy?" },
          { text: "Does he/she sit on the left?", isCorrect: false, speech: "Does he or she sit on the left?" }
        ]
      },
      {
        targetIcon: "🚪",
        targetTitle: "NEAR THE DOOR",
        characterImg: "🧒",
        prompt: "Choose the question for someone near the classroom door:",
        speechPrompt: "Choose the question for sitting near the door.",
        options: [
          { text: "Is he wearing a hat?", isCorrect: false, speech: "Is he wearing a hat?" },
          { text: "Does he have brown hair?", isCorrect: false, speech: "Does he have brown hair?" },
          { text: "Does he sit near the door?", isCorrect: true, speech: "Does he sit near the door?" }
        ]
      },
      {
        targetIcon: "👕 🔵",
        targetTitle: "WEARING BLUE",
        characterImg: "👧",
        prompt: "Choose the question to ask about their clothes color:",
        speechPrompt: "Choose the question for wearing blue.",
        options: [
          { text: "Is she wearing blue?", isCorrect: true, speech: "Is she wearing blue?" },
          { text: "Does she sit in the back?", isCorrect: false, speech: "Does she sit in the back?" },
          { text: "Does she like dogs?", isCorrect: false, speech: "Does she like dogs?" }
        ]
      }
    ],

    // Mini-Game 2: Ask About The Person (Categorized Questions & Answers)
    mg2Characters: [
      {
        id: "lucas",
        name: "Lucas",
        avatar: "👦",
        gender: "boy",
        hair: "black",
        hairLength: "short",
        glasses: false,
        clothesColor: "blue",
        hat: true,
        location: "near the window",
        side: "left",
        row: "front",
        description: "Lucas is a boy with black hair, wearing a hat and blue shirt. He sits near the window in the front on the left!"
      },
      {
        id: "maya",
        name: "Maya",
        avatar: "👧",
        gender: "girl",
        hair: "brown",
        hairLength: "long",
        glasses: true,
        clothesColor: "red",
        hat: false,
        location: "near the door",
        side: "right",
        row: "back",
        description: "Maya is a girl with long brown hair and glasses. She sits near the door in the back on the right!"
      }
    ],

    // Categorized Question Bank for Mini-Game 2 & Question Board
    questionCategories: [
      {
        category: "👤 PERSON",
        categorySpeech: "Person questions",
        questions: [
          { id: "is_boy", text: "Is it a boy?", speech: "Is it a boy?", check: (c) => c.gender === "boy" },
          { id: "is_girl", text: "Is it a girl?", speech: "Is it a girl?", check: (c) => c.gender === "girl" }
        ]
      },
      {
        category: "💇 HAIR",
        categorySpeech: "Hair questions",
        questions: [
          { id: "hair_black", text: "Does he/she have black hair?", speech: "Does he or she have black hair?", check: (c) => c.hair === "black" },
          { id: "hair_brown", text: "Does he/she have brown hair?", speech: "Does he or she have brown hair?", check: (c) => c.hair === "brown" },
          { id: "hair_long", text: "Does he/she have long hair?", speech: "Does he or she have long hair?", check: (c) => c.hairLength === "long" }
        ]
      },
      {
        category: "👓 LOOKS",
        categorySpeech: "Looks questions",
        questions: [
          { id: "wear_glasses", text: "Does he/she wear glasses?", speech: "Does he or she wear glasses?", check: (c) => c.glasses === true },
          { id: "wear_blue", text: "Is he/she wearing blue?", speech: "Is he or she wearing blue?", check: (c) => c.clothesColor === "blue" },
          { id: "wear_hat", text: "Is he/she wearing a hat?", speech: "Is he or she wearing a hat?", check: (c) => c.hat === true }
        ]
      },
      {
        category: "📍 LOCATION & PLACE",
        categorySpeech: "Location questions",
        questions: [
          { id: "loc_window", text: "Does he/she sit near the window?", speech: "Does he or she sit near the window?", check: (c) => c.location === "near the window" },
          { id: "loc_door", text: "Does he/she sit near the door?", speech: "Does he or she sit near the door?", check: (c) => c.location === "near the door" },
          { id: "loc_left", text: "Does he/she sit on the left?", speech: "Does he or she sit on the left?", check: (c) => c.side === "left" },
          { id: "loc_right", text: "Does he/she sit on the right?", speech: "Does he or she sit on the right?", check: (c) => c.side === "right" },
          { id: "loc_front", text: "Does he/she sit in the front?", speech: "Does he or she sit in the front?", check: (c) => c.row === "front" },
          { id: "loc_back", text: "Does he/she sit in the back?", speech: "Does he or she sit in the back?", check: (c) => c.row === "back" }
        ]
      }
    ],

    // Mini-Game 3: Which Question Do We Need? (Detective Goal Matching)
    mg3: [
      {
        goal: "We need to know the person's hair color.",
        goalSpeech: "We need to know the person's hair color.",
        icon: "💇",
        options: [
          { text: "Is it a girl?", isCorrect: false },
          { text: "Does he/she have black hair?", isCorrect: true },
          { text: "Does he/she sit near the door?", isCorrect: false }
        ]
      },
      {
        goal: "We need to know where the person sits.",
        goalSpeech: "We need to know where the person sits.",
        icon: "📍",
        options: [
          { text: "Does he/she wear glasses?", isCorrect: false },
          { text: "Does he/she sit near the window?", isCorrect: true },
          { text: "Does he/she have brown hair?", isCorrect: false }
        ]
      },
      {
        goal: "We need to know if the person wears glasses.",
        goalSpeech: "We need to know if the person wears glasses.",
        icon: "👓",
        options: [
          { text: "Does he/she wear glasses?", isCorrect: true },
          { text: "Is he/she wearing a hat?", isCorrect: false },
          { text: "Is it a boy?", isCorrect: false }
        ]
      },
      {
        goal: "We need to know if the person is a girl.",
        goalSpeech: "We need to know if the person is a girl.",
        icon: "👧",
        options: [
          { text: "Does she sit in the front?", isCorrect: false },
          { text: "Is it a girl?", isCorrect: true },
          { text: "Does she have black hair?", isCorrect: false }
        ]
      },
      {
        goal: "We need to know if the person is wearing blue.",
        goalSpeech: "We need to know if the person is wearing blue.",
        icon: "👕 🔵",
        options: [
          { text: "Is he/she wearing blue?", isCorrect: true },
          { text: "Does he/she sit on the left?", isCorrect: false },
          { text: "Does he/she wear glasses?", isCorrect: false }
        ]
      },
      {
        goal: "We need to know if the person sits in the front or back.",
        goalSpeech: "We need to know if the person sits in the front or back.",
        icon: "🪑",
        options: [
          { text: "Does he/she have long hair?", isCorrect: false },
          { text: "Does he/she sit in the front?", isCorrect: true },
          { text: "Is it a boy?", isCorrect: false }
        ]
      }
    ],

    // Mini-Game 4: Quick Memory Challenge (5-Second Scene)
    mg4Scenes: [
      {
        sceneTitle: "Classroom 3-B Scene",
        students: [
          { name: "Lucas", avatar: "👦", position: "Near the Window (Left Front)", hair: "Black hair", glasses: false, hat: true, isWindow: true, isBlackHair: true, isGlasses: false, isDoor: false },
          { name: "Maya", avatar: "👧", position: "Near the Door (Right Back)", hair: "Brown hair", glasses: true, hat: false, isWindow: false, isBlackHair: false, isGlasses: true, isDoor: true },
          { name: "Noah", avatar: "🧒", position: "Middle Front", hair: "Brown hair", glasses: false, hat: false, isWindow: false, isBlackHair: false, isGlasses: false, isDoor: false },
          { name: "Chloe", avatar: "👧", position: "Middle Back", hair: "Black hair", glasses: true, hat: false, isWindow: false, isBlackHair: true, isGlasses: true, isDoor: false }
        ],
        questions: [
          {
            question: "Who sits near the window?",
            speechQuestion: "Who sits near the window?",
            correctStudent: "Lucas",
            explanation: "Lucas was sitting near the window on the left!"
          },
          {
            question: "Who wears glasses in the back row?",
            speechQuestion: "Who wears glasses in the back row?",
            correctStudent: "Maya",
            explanation: "Maya was wearing glasses near the door in the back!"
          },
          {
            question: "Who sits near the door?",
            speechQuestion: "Who sits near the door?",
            correctStudent: "Maya",
            explanation: "Maya was sitting right by the door on the right!"
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SECTION 2: 🏴‍☠️ WHO STOLE THE TREASURE? (EXISTING HARD MODE INVESTIGATION)
  // =========================================================================
  suspects: [
    {
      id: "alex",
      name: "Alex",
      gender: "boy",
      pronoun: "he",
      possessive: "his",
      avatar: "👦",
      hairColor: "brown",
      hairDesc: "Brown hair",
      age: 9,
      ageDesc: "9 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      can: "swim",
      canDesc: "Can swim",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "blue",
      favColorDesc: "Blue",
      alibi: "I was at the park playing with my ball.",
      alibiLocation: "park",
      bio: "Alex is 9 years old with brown hair. He loves cats and swimming in the pool."
    },
    {
      id: "emma",
      name: "Emma",
      gender: "girl",
      pronoun: "she",
      possessive: "her",
      avatar: "👧",
      hairColor: "brown",
      hairDesc: "Brown hair",
      age: 9,
      ageDesc: "9 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      can: "swim",
      canDesc: "Can swim",
      has: "brother",
      hasDesc: "Has a brother",
      favColor: "pink",
      favColorDesc: "Pink",
      alibi: "I was at home baking cookies.",
      alibiLocation: "home",
      bio: "Emma is 9 years old with brown hair. She loves puppies and has a brother named Jack."
    },
    {
      id: "leo",
      name: "Leo",
      gender: "boy",
      pronoun: "he",
      possessive: "his",
      avatar: "🧑",
      hairColor: "black",
      hairDesc: "Black hair",
      age: 10,
      ageDesc: "10 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      can: "run",
      canDesc: "Can run fast",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "green",
      favColorDesc: "Green",
      alibi: "I was at the swimming pool watching the swimmers.",
      alibiLocation: "swimming pool",
      bio: "Leo is 10 years old with black hair. He can run like lightning, loves cats, and has a sister."
    },
    {
      id: "mia",
      name: "Mia",
      gender: "girl",
      pronoun: "she",
      possessive: "her",
      avatar: "👩",
      hairColor: "brown",
      hairDesc: "Brown hair",
      age: 10,
      ageDesc: "10 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      can: "swim",
      canDesc: "Can swim",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "purple",
      favColorDesc: "Purple",
      alibi: "I was at the park reading a storybook.",
      alibiLocation: "park",
      bio: "Mia is 10 years old with brown hair. She loves cats and swimming in the lake."
    },
    {
      id: "tom",
      name: "Tom",
      gender: "boy",
      pronoun: "he",
      possessive: "his",
      avatar: "🧒",
      hairColor: "brown",
      hairDesc: "Brown hair",
      age: 8,
      ageDesc: "8 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      can: "run",
      canDesc: "Can run fast",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "orange",
      favColorDesc: "Orange",
      alibi: "I was at the library studying English.",
      alibiLocation: "library",
      bio: "Tom is 8 years old with brown hair. He can run super fast, loves dogs, and has a sister."
    },
    {
      id: "sara",
      name: "Sara",
      gender: "girl",
      pronoun: "she",
      possessive: "her",
      avatar: "👧",
      hairColor: "black",
      hairDesc: "Black hair",
      age: 9,
      ageDesc: "9 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      can: "swim",
      canDesc: "Can swim",
      has: "brother",
      hasDesc: "Has a brother",
      favColor: "yellow",
      favColorDesc: "Yellow",
      alibi: "I was at the swimming pool doing laps.",
      alibiLocation: "swimming pool",
      bio: "Sara is 9 years old with black hair. She loves cats, can swim very well, and has a brother."
    },
    {
      id: "jack",
      name: "Jack",
      gender: "boy",
      pronoun: "he",
      possessive: "his",
      avatar: "🧑‍🦱",
      hairColor: "black",
      hairDesc: "Black hair",
      age: 10,
      ageDesc: "10 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      can: "swim",
      canDesc: "Can swim",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "red",
      favColorDesc: "Red",
      alibi: "I was at the park riding my bicycle.",
      alibiLocation: "park",
      bio: "Jack is 10 years old with black hair. He can swim, loves dogs, and has a sister."
    },
    {
      id: "lily",
      name: "Lily",
      gender: "girl",
      pronoun: "she",
      possessive: "her",
      avatar: "👧",
      hairColor: "brown",
      hairDesc: "Brown hair",
      age: 8,
      ageDesc: "8 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      can: "run",
      canDesc: "Can run fast",
      has: "brother",
      hasDesc: "Has a brother",
      favColor: "mint",
      favColorDesc: "Mint",
      alibi: "I was at home playing computer games.",
      alibiLocation: "home",
      bio: "Lily is 8 years old with brown hair. She loves cats, can run fast, and has a brother."
    }
  ],

  // 4 Teams Initial Assignments (Information Disparity!)
  teamAssignments: {
    red: ["alex", "emma"],
    blue: ["leo", "mia"],
    green: ["tom", "sara"],
    yellow: ["jack", "lily"]
  },

  // 4 Teams Configuration
  teams: [
    { id: "red", name: "Team Red", emoji: "🔴", color: "#e63946", border: "#ff6b6b", bg: "#ffe5e8" },
    { id: "blue", name: "Team Blue", emoji: "🔵", color: "#1d3557", border: "#457b9d", bg: "#e8f0fe" },
    { id: "green", name: "Team Green", emoji: "🟢", color: "#2a9d8f", border: "#52b788", bg: "#e8f8f5" },
    { id: "yellow", name: "Team Yellow", emoji: "🟡", color: "#d4a373", border: "#f4a261", bg: "#fef8e7" }
  ],

  // Interrogation Questions with Token Costs (1, 2, or 3 Tokens)
  interrogationQuestions: [
    {
      id: "age",
      text: "How old are you?",
      speechText: "How old are you?",
      cost: 1,
      costLabel: "🟢 1 Token",
      fieldKey: "age",
      fieldLabel: "Age",
      getAnswer: (s) => `I'm ${s.age} years old. 🎂`,
      getSpoken: (s) => `I am ${s.age} years old.`,
      getNotebookValue: (s) => `${s.age} yo`
    },
    {
      id: "alibi",
      text: "Where were you when the treasure disappeared?",
      speechText: "Where were you when the treasure disappeared?",
      cost: 1,
      costLabel: "🟢 1 Token",
      fieldKey: "alibi",
      fieldLabel: "Alibi",
      getAnswer: (s) => `${s.alibi} 🕒`,
      getSpoken: (s) => `${s.alibi}`,
      getNotebookValue: (s) => s.alibiLocation
    },
    {
      id: "canSwim",
      text: "Can you swim?",
      speechText: "Can you swim?",
      cost: 2,
      costLabel: "🟡 2 Tokens",
      fieldKey: "canSwim",
      fieldLabel: "Can Swim",
      getAnswer: (s) => s.can === "swim" ? `Yes, I can! I can swim very well! 🏊` : `No, I can't swim, but I can run fast! 🏃`,
      getSpoken: (s) => s.can === "swim" ? `Yes, I can swim very well.` : `No, I cannot swim, but I can run fast.`,
      getNotebookValue: (s) => s.can === "swim" ? "Yes ✅" : "No ❌"
    },
    {
      id: "canRun",
      text: "Can you run fast?",
      speechText: "Can you run fast?",
      cost: 2,
      costLabel: "🟡 2 Tokens",
      fieldKey: "canRun",
      fieldLabel: "Can Run",
      getAnswer: (s) => s.can === "run" ? `Yes, I can! I can run very fast! 🏃` : `No, I can't run fast, but I can swim! 🏊`,
      getSpoken: (s) => s.can === "run" ? `Yes, I can run very fast.` : `No, I cannot run fast, but I can swim.`,
      getNotebookValue: (s) => s.can === "run" ? "Yes ✅" : "No ❌"
    },
    {
      id: "likesCats",
      text: "Do you like cats?",
      speechText: "Do you like cats?",
      cost: 2,
      costLabel: "🟡 2 Tokens",
      fieldKey: "likesCats",
      fieldLabel: "Likes Cats",
      getAnswer: (s) => s.likes === "cats" ? `Yes, I do! I love cats! 🐱` : `No, I don't. I like dogs! 🐶`,
      getSpoken: (s) => s.likes === "cats" ? `Yes, I do! I love cats.` : `No, I don't. I like dogs.`,
      getNotebookValue: (s) => s.likes === "cats" ? "Yes ✅" : "No ❌"
    },
    {
      id: "likesDogs",
      text: "Do you like dogs?",
      speechText: "Do you like dogs?",
      cost: 2,
      costLabel: "🟡 2 Tokens",
      fieldKey: "likesDogs",
      fieldLabel: "Likes Dogs",
      getAnswer: (s) => s.likes === "dogs" ? `Yes, I do! I love dogs! 🐶` : `No, I don't. I like cats! 🐱`,
      getSpoken: (s) => s.likes === "dogs" ? `Yes, I do! I love dogs.` : `No, I don't. I like cats.`,
      getNotebookValue: (s) => s.likes === "dogs" ? "Yes ✅" : "No ❌"
    },
    {
      id: "hasSister",
      text: "Have you got a sister?",
      speechText: "Have you got a sister?",
      cost: 3,
      costLabel: "🔴 3 Tokens",
      fieldKey: "hasSister",
      fieldLabel: "Has Sister",
      getAnswer: (s) => s.has === "sister" ? `Yes, I have! I have a sister. 👧` : `No, I haven't. I have a brother! 👦`,
      getSpoken: (s) => s.has === "sister" ? `Yes, I have a sister.` : `No, I haven't. I have a brother.`,
      getNotebookValue: (s) => s.has === "sister" ? "Yes 👧" : "No ❌"
    },
    {
      id: "hasBrother",
      text: "Have you got a brother?",
      speechText: "Have you got a brother?",
      cost: 3,
      costLabel: "🔴 3 Tokens",
      fieldKey: "hasBrother",
      fieldLabel: "Has Brother",
      getAnswer: (s) => s.has === "brother" ? `Yes, I have! I have a brother. 👦` : `No, I haven't. I have a sister! 👧`,
      getSpoken: (s) => s.has === "brother" ? `Yes, I have a brother.` : `No, I haven't. I have a sister.`,
      getNotebookValue: (s) => s.has === "brother" ? "Yes 👦" : "No ❌"
    },
    {
      id: "favColor",
      text: "What's your favorite color?",
      speechText: "What is your favorite color?",
      cost: 2,
      costLabel: "🟡 2 Tokens",
      fieldKey: "favColor",
      fieldLabel: "Fav Color",
      getAnswer: (s) => `My favorite color is ${s.favColor}!`,
      getSpoken: (s) => `My favorite color is ${s.favColor}.`,
      getNotebookValue: (s) => s.favColor.toUpperCase()
    }
  ],

  // Mini-Games 1-5 & Boss Lock Data for Who Stole the Treasure
  miniGame1: [
    {
      character: "👦 Alex",
      characterImg: "👦",
      question: "How old are you?",
      speechQuestion: "How old are you?",
      options: [
        { text: "I'm nine.", isCorrect: true, emoji: "🎂", speech: "I'm nine." },
        { text: "I'm blue.", isCorrect: false, emoji: "🔵", speech: "I'm blue." },
        { text: "I can swim.", isCorrect: false, emoji: "🏊‍♂️", speech: "I can swim." }
      ],
      grammarNote: "👉 We answer age with 'I am / I'm [number]'!"
    },
    {
      character: "👧 Emma",
      characterImg: "👧",
      question: "What's your name?",
      speechQuestion: "What is your name?",
      options: [
        { text: "I have a dog.", isCorrect: false, emoji: "🐶", speech: "I have a dog." },
        { text: "My name is Emma.", isCorrect: true, emoji: "🏷️", speech: "My name is Emma." },
        { text: "I am nine.", isCorrect: false, emoji: "9️⃣", speech: "I am nine." }
      ],
      grammarNote: "👉 We answer name with 'My name is...' or 'I'm...'!"
    },
    {
      character: "🧑 Leo",
      characterImg: "🧑",
      question: "What's your favorite color?",
      speechQuestion: "What is your favorite color?",
      options: [
        { text: "Yes, I do.", isCorrect: false, emoji: "👍", speech: "Yes, I do." },
        { text: "I'm ten.", isCorrect: false, emoji: "🎂", speech: "I'm ten." },
        { text: "My favorite color is green.", isCorrect: true, emoji: "🟢", speech: "My favorite color is green." }
      ],
      grammarNote: "👉 We say: 'My favorite color is [color]'!"
    },
    {
      character: "👩 Mia",
      characterImg: "👩",
      question: "Can you swim?",
      speechQuestion: "Can you swim?",
      options: [
        { text: "Yes, I can.", isCorrect: true, emoji: "🏊‍♀️", speech: "Yes, I can." },
        { text: "No, I am not.", isCorrect: false, emoji: "❌", speech: "No, I am not." },
        { text: "I have a sister.", isCorrect: false, emoji: "👧", speech: "I have a sister." }
      ],
      grammarNote: "👉 'Can you...?' ➔ 'Yes, I can.' or 'No, I can't.'"
    },
    {
      character: "🧒 Tom",
      characterImg: "🧒",
      question: "Do you like cats?",
      speechQuestion: "Do you like cats?",
      options: [
        { text: "Yes, I have.", isCorrect: false, emoji: "🤷", speech: "Yes, I have." },
        { text: "Yes, I do.", isCorrect: true, emoji: "🐱", speech: "Yes, I do." },
        { text: "I can run.", isCorrect: false, emoji: "🏃", speech: "I can run." }
      ],
      grammarNote: "👉 'Do you like...?' ➔ 'Yes, I do.' or 'No, I don't.'"
    },
    {
      character: "👧 Sara",
      characterImg: "👧",
      question: "Have you got a brother?",
      speechQuestion: "Have you got a brother?",
      options: [
        { text: "Yes, I have.", isCorrect: true, emoji: "👦", speech: "Yes, I have." },
        { text: "Yes, I can.", isCorrect: false, emoji: "🏊", speech: "Yes, I can." },
        { text: "I am nine.", isCorrect: false, emoji: "🎂", speech: "I am nine." }
      ],
      grammarNote: "👉 'Have you got...?' ➔ 'Yes, I have.' or 'No, I haven't.'"
    }
  ],

  miniGame2: [
    {
      avatar: "👧",
      name: "Emma",
      clues: [
        { icon: "🎂", label: "9 years old" },
        { icon: "❤️", label: "Likes 🐶 Dogs" },
        { icon: "💇", label: "Brown hair" },
        { icon: "🏊‍♀️", label: "Can swim ✅" },
        { icon: "👦", label: "Has a brother" }
      ],
      question: "Look at the profile! Which sentence is TRUE about Emma?",
      speechQuestion: "Look at the profile. Which sentence is true about Emma?",
      options: [
        { text: "She likes dogs and has brown hair. ✅", isCorrect: true, speech: "She likes dogs and has brown hair." },
        { text: "She is 8 years old.", isCorrect: false, speech: "She is eight years old." },
        { text: "She can't swim.", isCorrect: false, speech: "She cannot swim." }
      ],
      sayItSentence: "Emma is 9. She has brown hair and likes dogs!"
    },
    {
      avatar: "👦",
      name: "Alex",
      clues: [
        { icon: "🎂", label: "9 years old" },
        { icon: "❤️", label: "Likes 🐱 Cats" },
        { icon: "💇", label: "Brown hair" },
        { icon: "🏊‍♂️", label: "Can swim ✅" },
        { icon: "👧", label: "Has a sister" }
      ],
      question: "What can Alex do?",
      speechQuestion: "What can Alex do?",
      options: [
        { text: "He can swim. ✅", isCorrect: true, speech: "He can swim." },
        { text: "He can fly. 🦅", isCorrect: false, speech: "He can fly." },
        { text: "He can't swim. ❌", isCorrect: false, speech: "He can't swim." }
      ],
      sayItSentence: "Alex has brown hair and he can swim!"
    },
    {
      avatar: "👩",
      name: "Mia",
      clues: [
        { icon: "🎂", label: "10 years old" },
        { icon: "❤️", label: "Likes 🐱 Cats" },
        { icon: "💇", label: "Brown hair" },
        { icon: "🏊‍♀️", label: "Can swim ✅" },
        { icon: "🟣", label: "Fav Color: Purple" }
      ],
      question: "How old is Mia?",
      speechQuestion: "How old is Mia?",
      options: [
        { text: "She is eight.", isCorrect: false, speech: "She is eight." },
        { text: "She is ten. ✅", isCorrect: true, speech: "She is ten." },
        { text: "She is nine.", isCorrect: false, speech: "She is nine." }
      ],
      sayItSentence: "Mia is ten years old and her favorite color is purple!"
    },
    {
      avatar: "🧒",
      name: "Tom",
      clues: [
        { icon: "🎂", label: "8 years old" },
        { icon: "❤️", label: "Likes 🐶 Dogs" },
        { icon: "💇", label: "Brown hair" },
        { icon: "🏃‍♂️", label: "Can run fast" },
        { icon: "👧", label: "Has a sister" }
      ],
      question: "Does Tom like dogs?",
      speechQuestion: "Does Tom like dogs?",
      options: [
        { text: "Yes, he does. ✅", isCorrect: true, speech: "Yes, he does." },
        { text: "No, he doesn't. ❌", isCorrect: false, speech: "No, he doesn't." },
        { text: "Yes, she does. 🤷‍♀️", isCorrect: false, speech: "Yes, she does." }
      ],
      sayItSentence: "Tom has brown hair and he likes dogs!"
    }
  ],

  miniGame3: [
    {
      subject: "A fish",
      action: "walk",
      imageEmoji: "🐟 🚶‍♂️",
      question: "Can a fish walk?",
      speechQuestion: "Can a fish walk?",
      correctAnswer: "no",
      fullSentence: "A fish can't walk! 🐟❌",
      spokenSentence: "No, it cannot! A fish can't walk, but it can swim!"
    },
    {
      subject: "A bird",
      action: "fly",
      imageEmoji: "🦅 ☁️",
      question: "Can a bird fly?",
      speechQuestion: "Can a bird fly?",
      correctAnswer: "yes",
      fullSentence: "A bird can fly! 🦅✈️",
      spokenSentence: "Yes, it can! A bird can fly high in the sky!"
    },
    {
      subject: "A dog",
      action: "swim",
      imageEmoji: "🐶 🌊",
      question: "Can a dog swim?",
      speechQuestion: "Can a dog swim?",
      correctAnswer: "yes",
      fullSentence: "A dog can swim! 🐶🏊",
      spokenSentence: "Yes, it can! A dog can swim in the water!"
    },
    {
      subject: "An elephant",
      action: "climb a tree",
      imageEmoji: "🐘 🌳",
      question: "Can an elephant climb a tree?",
      speechQuestion: "Can an elephant climb a tree?",
      correctAnswer: "no",
      fullSentence: "An elephant can't climb trees! 🐘❌",
      spokenSentence: "No, it cannot! An elephant cannot climb trees!"
    },
    {
      subject: "A monkey",
      action: "swing in trees",
      imageEmoji: "🐒 🌴",
      question: "Can a monkey swing?",
      speechQuestion: "Can a monkey swing?",
      correctAnswer: "yes",
      fullSentence: "A monkey can swing! 🐒🍌",
      spokenSentence: "Yes, it can! A monkey can swing through the trees!"
    }
  ],

  miniGame4: [
    {
      type: "direct",
      emoji: "🐱",
      title: "Cute Cats",
      question: "Do you like cats?",
      speechQuestion: "Do you like cats?",
      options: [
        { text: "YES, I DO! ❤️", value: "yes", audio: "Yes, I do!" },
        { text: "NO, I DON'T! ❌", value: "no", audio: "No, I don't!" }
      ],
      prompt: "🗣️ Ask your teammates: 'Do you like cats?'"
    },
    {
      type: "direct",
      emoji: "🥦",
      title: "Yummy Broccoli",
      question: "Do you like broccoli?",
      speechQuestion: "Do you like broccoli?",
      options: [
        { text: "YES, I DO! 🥦", value: "yes", audio: "Yes, I do!" },
        { text: "NO, I DON'T! 😝", value: "no", audio: "No, I don't!" }
      ],
      prompt: "🗣️ Ask your teammates: 'Do you like broccoli?'"
    },
    {
      type: "detective",
      suspectName: "Alex",
      suspectEmoji: "👦",
      likesText: "Profile Fact: Alex loves 🐱 cats!",
      itemEmoji: "🐱",
      question: "Does Alex like cats?",
      speechQuestion: "Does Alex like cats?",
      options: [
        { text: "Yes, he does. ✅", isCorrect: true, speech: "Yes, he does." },
        { text: "No, he doesn't. ❌", isCorrect: false, speech: "No, he doesn't." },
        { text: "Yes, she does. 🤷‍♀️", isCorrect: false, speech: "Yes, she does." }
      ],
      hint: "Remember: Alex is a boy (he)!"
    },
    {
      type: "detective",
      suspectName: "Emma",
      suspectEmoji: "👧",
      likesText: "Profile Fact: Emma loves 🐶 dogs, but NOT 🐱 cats!",
      itemEmoji: "🐱",
      question: "Does Emma like cats?",
      speechQuestion: "Does Emma like cats?",
      options: [
        { text: "No, she doesn't. ✅", isCorrect: true, speech: "No, she doesn't." },
        { text: "Yes, she does. ❌", isCorrect: false, speech: "Yes, she does." },
        { text: "No, he doesn't. 🤷‍♂️", isCorrect: false, speech: "No, he doesn't." }
      ],
      hint: "Remember: Emma is a girl (she)!"
    },
    {
      type: "detective",
      suspectName: "Sara",
      suspectEmoji: "👧",
      likesText: "Profile Fact: Sara loves 🐱 cats!",
      itemEmoji: "🐱",
      question: "Does Sara like cats?",
      speechQuestion: "Does Sara like cats?",
      options: [
        { text: "Yes, she does. ✅", isCorrect: true, speech: "Yes, she does." },
        { text: "No, she doesn't. ❌", isCorrect: false, speech: "No, she doesn't." },
        { text: "Yes, I do. 🤷", isCorrect: false, speech: "Yes, I do." }
      ],
      hint: "Sara is a girl (she)!"
    }
  ],

  miniGame5: [
    {
      character: "Alex",
      characterEmoji: "👦",
      familyImg: "👦 + 👧",
      familyDesc: "Alex has a sister named Lucy.",
      question: "Has Alex got a sister?",
      speechQuestion: "Has Alex got a sister?",
      options: [
        { text: "Yes, he has. ✅", isCorrect: true, speech: "Yes, he has." },
        { text: "No, he hasn't. ❌", isCorrect: false, speech: "No, he hasn't." },
        { text: "Yes, she has. 🤷", isCorrect: false, speech: "Yes, she has." }
      ],
      sentenceDisplay: "Yes, he has. Alex has got a sister! 👧"
    },
    {
      character: "Emma",
      characterEmoji: "👧",
      familyImg: "👧 + 👦",
      familyDesc: "Emma has a brother named Jack.",
      question: "Has Emma got a brother?",
      speechQuestion: "Has Emma got a brother?",
      options: [
        { text: "Yes, she has. ✅", isCorrect: true, speech: "Yes, she has." },
        { text: "No, she hasn't. ❌", isCorrect: false, speech: "No, she hasn't." },
        { text: "Yes, he has. 🤷", isCorrect: false, speech: "Yes, he has." }
      ],
      sentenceDisplay: "Yes, she has. Emma has got a brother! 👦"
    },
    {
      character: "Leo",
      characterEmoji: "🧑",
      familyImg: "🧑 + 👧",
      familyDesc: "Leo has a sister, but NO brother.",
      question: "Has Leo got a brother?",
      speechQuestion: "Has Leo got a brother?",
      options: [
        { text: "No, he hasn't. ✅", isCorrect: true, speech: "No, he hasn't." },
        { text: "Yes, he has. ❌", isCorrect: false, speech: "Yes, he has." },
        { text: "No, she hasn't. 🤷", isCorrect: false, speech: "No, she hasn't." }
      ],
      sentenceDisplay: "No, he hasn't. Leo has got a sister! 👧"
    },
    {
      character: "Mia",
      characterEmoji: "👩",
      familyImg: "👩 + 👧",
      familyDesc: "Mia has a sister named Lily.",
      question: "Has Mia got a sister?",
      speechQuestion: "Has Mia got a sister?",
      options: [
        { text: "Yes, she has. ✅", isCorrect: true, speech: "Yes, she has." },
        { text: "No, she hasn't. ❌", isCorrect: false, speech: "No, she hasn't." },
        { text: "Yes, I have. 🤷", isCorrect: false, speech: "Yes, I have." }
      ],
      sentenceDisplay: "Yes, she has. Mia has got a sister! 👧"
    }
  ],

  bossLockQuestions: [
    {
      question: "Can a bird fly?",
      speechQuestion: "Can a bird fly?",
      emoji: "🦅 ☁️",
      options: [
        { text: "Yes, it can. ✅", isCorrect: true, symbol: "🔢 3" },
        { text: "No, it can't.", isCorrect: false }
      ],
      codeDigit: "3"
    },
    {
      question: "Does Alex like cats?",
      speechQuestion: "Does Alex like cats?",
      emoji: "👦 🐱",
      options: [
        { text: "Yes, he does. ✅", isCorrect: true, symbol: "🔢 7" },
        { text: "No, he doesn't.", isCorrect: false }
      ],
      codeDigit: "7"
    },
    {
      question: "Has Emma got a brother?",
      speechQuestion: "Has Emma got a brother?",
      emoji: "👧 👦",
      options: [
        { text: "Yes, she has. ✅", isCorrect: true, symbol: "🔢 9" },
        { text: "No, she hasn't.", isCorrect: false }
      ],
      codeDigit: "9"
    },
    {
      question: "How do you answer: 'How old are you?'",
      speechQuestion: "How do you answer: How old are you?",
      emoji: "🎂 ❓",
      options: [
        { text: "I'm nine. ✅", isCorrect: true, symbol: "🔢 4" },
        { text: "I'm blue. 🔵", isCorrect: false }
      ],
      codeDigit: "4"
    },
    {
      question: "Can a fish walk?",
      speechQuestion: "Can a fish walk?",
      emoji: "🐟 🚶‍♂️",
      options: [
        { text: "No, it can't. ✅", isCorrect: true, symbol: "🔑 1" },
        { text: "Yes, it can.", isCorrect: false }
      ],
      codeDigit: "1"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
