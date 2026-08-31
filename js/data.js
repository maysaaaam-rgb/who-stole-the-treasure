/**
 * Game Data for "Who Stole the Treasure?"
 * Designed for 3rd Grade English Revision (First Week of School)
 *
 * All suspect characteristics are HIDDEN from the cards.
 * Students must discover them exclusively through verbal English interviews.
 */

const GAME_DATA = {
  // 6 Cartoon Suspects with balanced overlapping traits (Hidden from cards!)
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
      bio: "Alex loves outdoor games and spending time with his pets.",
      alibi: "I was at the swimming pool feeding my cat!"
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
      bio: "Emma is cheerful and loves animals and sports.",
      alibi: "I was playing fetch with my puppy and my brother!"
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
      bio: "Leo is active, fast, and loves sports and family games.",
      alibi: "I was running around the sports field with my sister!"
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
      likes: "dogs",
      likesDesc: "Likes dogs",
      can: "swim",
      canDesc: "Can swim",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "purple",
      favColorDesc: "Purple",
      bio: "Mia loves reading storybooks and going swimming.",
      alibi: "I was swimming at the beach with my dog and sister!"
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
      likes: "cats",
      likesDesc: "Likes cats",
      can: "run",
      canDesc: "Can run fast",
      has: "brother",
      hasDesc: "Has a brother",
      favColor: "orange",
      favColorDesc: "Orange",
      bio: "Tom loves drawing pictures, playing games, and running.",
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
      age: 9,
      ageDesc: "9 years old",
      likes: "dogs",
      likesDesc: "Likes dogs",
      can: "swim",
      canDesc: "Can swim",
      has: "sister",
      hasDesc: "Has a sister",
      favColor: "yellow",
      favColorDesc: "Yellow",
      bio: "Sara loves colorful drawings, sunny days, and swimming.",
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

  // Comprehensive Interrogation Questions for the 🕵️ Interview Room
  interrogationQuestions: [
    {
      id: "name",
      text: "What's your name?",
      speechText: "What is your name?",
      fieldKey: "name",
      fieldLabel: "Name",
      getAnswer: (s) => `My name is ${s.name}.`,
      getSpoken: (s) => `My name is ${s.name}.`,
      getNotebookValue: (s) => s.name
    },
    {
      id: "age",
      text: "How old are you?",
      speechText: "How old are you?",
      fieldKey: "age",
      fieldLabel: "Age",
      getAnswer: (s) => `I'm ${s.age} years old. 🎂`,
      getSpoken: (s) => `I am ${s.age} years old.`,
      getNotebookValue: (s) => `${s.age} years old`
    },
    {
      id: "favColor",
      text: "What's your favorite color?",
      speechText: "What is your favorite color?",
      fieldKey: "favColor",
      fieldLabel: "Fav Color",
      getAnswer: (s) => `My favorite color is ${s.favColor}!`,
      getSpoken: (s) => `My favorite color is ${s.favColor}.`,
      getNotebookValue: (s) => s.favColor.toUpperCase()
    },
    {
      id: "likesCats",
      text: "Do you like cats?",
      speechText: "Do you like cats?",
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
      fieldKey: "likesDogs",
      fieldLabel: "Likes Dogs",
      getAnswer: (s) => s.likes === "dogs" ? `Yes, I do! I love dogs! 🐶` : `No, I don't. I like cats! 🐱`,
      getSpoken: (s) => s.likes === "dogs" ? `Yes, I do! I love dogs.` : `No, I don't. I like cats.`,
      getNotebookValue: (s) => s.likes === "dogs" ? "Yes ✅" : "No ❌"
    },
    {
      id: "canSwim",
      text: "Can you swim?",
      speechText: "Can you swim?",
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
      fieldKey: "canRun",
      fieldLabel: "Can Run Fast",
      getAnswer: (s) => s.can === "run" ? `Yes, I can! I can run very fast! 🏃` : `No, I can't run fast, but I can swim! 🏊`,
      getSpoken: (s) => s.can === "run" ? `Yes, I can run very fast.` : `No, I cannot run fast, but I can swim.`,
      getNotebookValue: (s) => s.can === "run" ? "Yes ✅" : "No ❌"
    },
    {
      id: "hasBrother",
      text: "Have you got a brother?",
      speechText: "Have you got a brother?",
      fieldKey: "hasBrother",
      fieldLabel: "Has Brother",
      getAnswer: (s) => s.has === "brother" ? `Yes, I have! I have a brother. 👦` : `No, I haven't. I have a sister! 👧`,
      getSpoken: (s) => s.has === "brother" ? `Yes, I have a brother.` : `No, I haven't. I have a sister.`,
      getNotebookValue: (s) => s.has === "brother" ? "Yes 👦" : "No ❌"
    },
    {
      id: "hasSister",
      text: "Have you got a sister?",
      speechText: "Have you got a sister?",
      fieldKey: "hasSister",
      fieldLabel: "Has Sister",
      getAnswer: (s) => s.has === "sister" ? `Yes, I have! I have a sister. 👧` : `No, I haven't. I have a brother! 👦`,
      getSpoken: (s) => s.has === "sister" ? `Yes, I have a sister.` : `No, I haven't. I have a brother.`,
      getNotebookValue: (s) => s.has === "sister" ? "Yes 👧" : "No ❌"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
