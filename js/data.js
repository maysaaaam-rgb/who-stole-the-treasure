/**
 * Game Data for "Who Stole the Treasure?"
 * Designed for 3rd Grade English Revision (First Week of School)
 *
 * ATTRIBUTE MATRIX (Strategically Overlapping - No single unique giveaways!):
 * - Hair: Brown (Alex, Mia, Tom = 3), Black (Leo, Sara = 2), Blonde (Emma = 1)
 * - Age: 9 (Alex, Emma, Sara = 3), 10 (Leo, Mia = 2), 8 (Tom = 1)
 * - Likes: Cats (Alex, Leo, Tom = 3), Dogs (Emma, Mia, Sara = 3)
 * - Ability: Swim (Alex, Emma, Mia, Sara = 4), Run (Leo, Tom = 2)
 * - Family: Sister (Alex, Leo, Mia, Sara = 4), Brother (Emma, Tom = 2)
 * - Gender: Boy (Alex, Leo, Tom = 3), Girl (Emma, Mia, Sara = 3)
 */

const GAME_DATA = {
  // 6 Cartoon Suspects with balanced overlapping traits
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
      hairEmoji: "🟤",
      age: 9,
      ageDesc: "9 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      likesEmoji: "🐱",
      can: "swim",
      canDesc: "Can swim",
      canEmoji: "🏊‍♂️",
      cannot: "run fast",
      has: "sister",
      hasDesc: "Has a sister",
      hasEmoji: "👧",
      favColor: "blue",
      favColorDesc: "Favorite color is blue",
      favColorEmoji: "🔵",
      bio: "Alex is 9 years old with brown hair. He loves cats and is great at swimming.",
      alibi: "I was at the swimming pool feeding my ginger cat!"
    },
    {
      id: "emma",
      name: "Emma",
      gender: "girl",
      pronoun: "she",
      possessive: "her",
      avatar: "👧",
      hairColor: "blonde",
      hairDesc: "Blonde hair",
      hairEmoji: "👱‍♀️",
      age: 9,
      ageDesc: "9 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      likesEmoji: "🐶",
      can: "swim",
      canDesc: "Can swim",
      canEmoji: "🏊‍♀️",
      cannot: "run fast",
      has: "brother",
      hasDesc: "Has a brother",
      hasEmoji: "👦",
      favColor: "pink",
      favColorDesc: "Favorite color is pink",
      favColorEmoji: "🌸",
      bio: "Emma is 9 years old with blonde hair. She loves puppies and has a brother named Jack.",
      alibi: "I was playing fetch with my golden puppy and my brother!"
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
      hairEmoji: "⚫",
      age: 10,
      ageDesc: "10 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      likesEmoji: "🐱",
      can: "run",
      canDesc: "Can run fast",
      canEmoji: "🏃‍♂️",
      cannot: "swim",
      has: "sister",
      hasDesc: "Has a sister",
      hasEmoji: "👧",
      favColor: "green",
      favColorDesc: "Favorite color is green",
      favColorEmoji: "🟢",
      bio: "Leo is 10 years old with black hair. He can run like lightning, loves cats, and has a sister.",
      alibi: "I was running around the track with my sister!"
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
      hairEmoji: "🟤",
      age: 10,
      ageDesc: "10 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      likesEmoji: "🐶",
      can: "swim",
      canDesc: "Can swim",
      canEmoji: "🏊‍♀️",
      cannot: "run fast",
      has: "sister",
      hasDesc: "Has a sister",
      hasEmoji: "👧",
      favColor: "purple",
      favColorDesc: "Favorite color is purple",
      favColorEmoji: "🟣",
      bio: "Mia is 10 years old with brown hair. She loves big dogs and swimming in the lake with her sister.",
      alibi: "I was swimming at the beach with my big dog and sister!"
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
      hairEmoji: "🟤",
      age: 8,
      ageDesc: "8 years old",
      likes: "cats",
      likesDesc: "Likes cats",
      likesEmoji: "🐱",
      can: "run",
      canDesc: "Can run fast",
      canEmoji: "🏃‍♂️",
      cannot: "swim",
      has: "brother",
      hasDesc: "Has a brother",
      hasEmoji: "👦",
      favColor: "orange",
      favColorDesc: "Favorite color is orange",
      favColorEmoji: "🟠",
      bio: "Tom is 8 years old with brown hair. He can run super fast, loves cats, and has a brother.",
      alibi: "I was playing race cars in the garden with my brother!"
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
      hairEmoji: "⚫",
      age: 9,
      ageDesc: "9 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      likesEmoji: "🐶",
      can: "swim",
      canDesc: "Can swim",
      canEmoji: "🏊‍♀️",
      cannot: "run fast",
      has: "sister",
      hasDesc: "Has a sister",
      hasEmoji: "👧",
      favColor: "yellow",
      favColorDesc: "Favorite color is yellow",
      favColorEmoji: "🟡",
      bio: "Sara is 9 years old with black hair. She loves dogs, can swim very well, and has a sister.",
      alibi: "I was drawing yellow puppy pictures with my sister!"
    }
  ],

  // 4 Teams Configuration
  teams: [
    { id: "red", name: "Team Red", emoji: "🔴", color: "#e63946", border: "#ff6b6b", bg: "#ffe5e8" },
    { id: "blue", name: "Team Blue", emoji: "🔵", color: "#1d3557", border: "#457b9d", bg: "#e8f0fe" },
    { id: "green", name: "Team Green", emoji: "🟢", color: "#2a9d8f", border: "#52b788", bg: "#e8f8f5" },
    { id: "yellow", name: "Team Yellow", emoji: "🟡", color: "#d4a373", border: "#f4a261", bg: "#fef8e7" }
  ],

  // Mini-Game 1: Detective Question Match
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
      question: "Have you got a sister?",
      speechQuestion: "Have you got a sister?",
      options: [
        { text: "Yes, I have.", isCorrect: true, emoji: "👧", speech: "Yes, I have." },
        { text: "Yes, I can.", isCorrect: false, emoji: "🏊", speech: "Yes, I can." },
        { text: "I am nine.", isCorrect: false, emoji: "🎂", speech: "I am nine." }
      ],
      grammarNote: "👉 'Have you got...?' ➔ 'Yes, I have.' or 'No, I haven't.'"
    }
  ],

  // Mini-Game 2: Who Am I? (Visual Profile Match)
  miniGame2: [
    {
      avatar: "👧",
      name: "Emma",
      clues: [
        { icon: "🎂", label: "9 years old" },
        { icon: "❤️", label: "Likes 🐶 Dogs" },
        { icon: "💇", label: "Blonde hair" },
        { icon: "🏊‍♀️", label: "Can swim ✅" },
        { icon: "👦", label: "Has a brother" }
      ],
      question: "Look at the profile! Which sentence is TRUE about Emma?",
      speechQuestion: "Look at the profile. Which sentence is true about Emma?",
      options: [
        { text: "She likes dogs and has blonde hair. ✅", isCorrect: true, speech: "She likes dogs and has blonde hair." },
        { text: "She is 8 years old.", isCorrect: false, speech: "She is eight years old." },
        { text: "She can't swim.", isCorrect: false, speech: "She cannot swim." }
      ],
      sayItSentence: "Emma is 9. She has blonde hair and likes dogs!"
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
        { icon: "❤️", label: "Likes 🐶 Dogs" },
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
        { icon: "❤️", label: "Likes 🐱 Cats" },
        { icon: "💇", label: "Brown hair" },
        { icon: "🏃‍♂️", label: "Can run fast" },
        { icon: "👦", label: "Has a brother" }
      ],
      question: "Does Tom like cats?",
      speechQuestion: "Does Tom like cats?",
      options: [
        { text: "Yes, he does. ✅", isCorrect: true, speech: "Yes, he does." },
        { text: "No, he doesn't. ❌", isCorrect: false, speech: "No, he doesn't." },
        { text: "Yes, she does. 🤷‍♀️", isCorrect: false, speech: "Yes, she does." }
      ],
      sayItSentence: "Tom has brown hair and he likes cats!"
    }
  ],

  // Mini-Game 3: Can / Can't Challenge
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

  // Mini-Game 4: Do You Like & Does He/She Like?
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
      likesText: "Profile Fact: Sara loves 🐶 dogs!",
      itemEmoji: "🐶",
      question: "Does Sara like dogs?",
      speechQuestion: "Does Sara like dogs?",
      options: [
        { text: "Yes, she does. ✅", isCorrect: true, speech: "Yes, she does." },
        { text: "No, she doesn't. ❌", isCorrect: false, speech: "No, she doesn't." },
        { text: "Yes, I do. 🤷", isCorrect: false, speech: "Yes, I do." }
      ],
      hint: "Sara is a girl (she)!"
    }
  ],

  // Mini-Game 5: Have Got (Family & Pets)
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

  // Boss Lock Questions (Unlocks the 5 combination digits/keys)
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
  ],

  // Interrogation Questions for Investigation Phase
  interrogationQuestions: [
    {
      id: "name",
      text: "What's your name?",
      speechText: "What is your name?",
      getAnswer: (s) => `My name is ${s.name}. ${s.avatar}`,
      getSpoken: (s) => `My name is ${s.name}.`
    },
    {
      id: "age",
      text: "How old are you?",
      speechText: "How old are you?",
      getAnswer: (s) => `I'm ${s.age} years old. 🎂`,
      getSpoken: (s) => `I am ${s.age} years old.`
    },
    {
      id: "hair",
      text: "What color is your hair?",
      speechText: "What color is your hair?",
      getAnswer: (s) => `I have ${s.hairColor} hair! ${s.hairEmoji}`,
      getSpoken: (s) => `I have ${s.hairColor} hair.`
    },
    {
      id: "favColor",
      text: "What's your favorite color?",
      speechText: "What is your favorite color?",
      getAnswer: (s) => `My favorite color is ${s.favColor}! ${s.favColorEmoji}`,
      getSpoken: (s) => `My favorite color is ${s.favColor}.`
    },
    {
      id: "likesCats",
      text: "Do you like cats?",
      speechText: "Do you like cats?",
      getAnswer: (s) => s.likes === "cats" ? `Yes, I do! I love cats! 🐱` : `No, I don't. I like ${s.likes}! ${s.likesEmoji}`,
      getSpoken: (s) => s.likes === "cats" ? `Yes, I do! I love cats.` : `No, I don't. I like ${s.likes}.`
    },
    {
      id: "canSwim",
      text: "Can you swim?",
      speechText: "Can you swim?",
      getAnswer: (s) => s.can === "swim" ? `Yes, I can! I can swim very well! 🏊‍♂️` : `No, I can't swim, but I can run very fast! 🏃‍♂️`,
      getSpoken: (s) => s.can === "swim" ? `Yes, I can swim very well.` : `No, I cannot swim, but I can run very fast.`
    },
    {
      id: "hasSister",
      text: "Have you got a sister?",
      speechText: "Have you got a sister?",
      getAnswer: (s) => s.has === "sister" ? `Yes, I have! I have a sister. 👧` : `No, I haven't. I have a brother! 👦`,
      getSpoken: (s) => s.has === "sister" ? `Yes, I have. I have a sister.` : `No, I haven't. I have a brother.`
    },
    {
      id: "alibi",
      text: "Where were you when the treasure disappeared?",
      speechText: "Where were you when the treasure disappeared?",
      getAnswer: (s) => `${s.alibi} 🕒`,
      getSpoken: (s) => `${s.alibi}`
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
