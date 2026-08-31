/**
 * Room Rescue: The Lost Things Mission (4th Grade English Revision Game)
 * Data structures for interactive room, furniture drop-zones, audio clues,
 * hidden objects, and multi-level challenges.
 */

const ROOM_DATA = {
  // Furniture & Drop Zones in the Room
  furniture: [
    { id: "shelf", name: "Bookshelf", icon: "📚", label: "On the Shelf", x: 10, y: 15, w: 18, h: 42, preposition: "on the shelf" },
    { id: "window", name: "Window", icon: "🪟", label: "Near the Window", x: 32, y: 8, w: 18, h: 28, preposition: "near the window" },
    { id: "picture", name: "Picture", icon: "🖼️", label: "Behind the Picture", x: 55, y: 10, w: 14, h: 20, preposition: "behind the picture" },
    { id: "wardrobe", name: "Wardrobe", icon: "🚪", label: "Inside the Cupboard", x: 74, y: 12, w: 20, h: 50, preposition: "inside the cupboard" },
    { id: "bed", name: "Bed", icon: "🛏️", label: "On the Bed", x: 8, y: 60, w: 32, h: 32, preposition: "on the bed" },
    { id: "under_bed", name: "Under the Bed", icon: "🕳️", label: "Under the Bed", x: 10, y: 86, w: 28, h: 10, preposition: "under the bed" },
    { id: "desk", name: "Desk", icon: "🖥️", label: "On the Desk", x: 44, y: 48, w: 26, h: 32, preposition: "on the desk" },
    { id: "under_desk", name: "Under the Desk", icon: "📦", label: "Under the Desk", x: 46, y: 78, w: 22, h: 14, preposition: "under the desk" },
    { id: "drawer", name: "Desk Drawer", icon: "🗄️", label: "In the Drawer", x: 62, y: 56, w: 8, h: 18, preposition: "in the drawer" },
    { id: "pencil_case", name: "Pencil Case", icon: "✏️", label: "In the Pencil Case", x: 46, y: 44, w: 10, h: 8, preposition: "in the pencil case" },
    { id: "chair", name: "Chair", icon: "🪑", label: "On the Chair", x: 48, y: 64, w: 14, h: 22, preposition: "on the chair" },
    { id: "under_chair", name: "Under the Chair", icon: "🪑", label: "Under the Chair", x: 49, y: 82, w: 12, h: 8, preposition: "under the chair" },
    { id: "behind_chair", name: "Behind the Chair", icon: "🪑", label: "Behind the Chair", x: 44, y: 60, w: 10, h: 20, preposition: "behind the chair" },
    { id: "door", name: "Door", icon: "🚪", label: "Near the Door", x: 84, y: 50, w: 14, h: 42, preposition: "near the door" },
    { id: "box", name: "Toy Box", icon: "📦", label: "Inside the Box", x: 74, y: 72, w: 14, h: 18, preposition: "inside the box" },
    { id: "basket", name: "Clothes Basket", icon: "🧺", label: "In the Basket", x: 86, y: 76, w: 10, h: 16, preposition: "in the basket" }
  ],

  // Objects in the Messy Room
  items: [
    { id: "books", name: "Books", icon: "📚", category: "school", color: "#3b82f6" },
    { id: "shoes", name: "Shoes", icon: "👟", category: "clothes", color: "#f59e0b" },
    { id: "bag", name: "School Bag", icon: "🎒", category: "school", color: "#ef4444" },
    { id: "blue_pencil", name: "Blue Pencil", icon: "✏️", category: "school", color: "#0284c7" },
    { id: "teddy", name: "Teddy Bear", icon: "🧸", category: "toy", color: "#b45309" },
    { id: "clothes", name: "T-Shirt & Clothes", icon: "👕", category: "clothes", color: "#10b981" },
    { id: "toy_car", name: "Toy Car", icon: "🚗", category: "toy", color: "#dc2626" },
    { id: "red_notebook", name: "Red Notebook", icon: "📓", category: "lost", color: "#b91c1c" },
    { id: "key", name: "Golden Key", icon: "🔑", category: "lost", color: "#eab308" },
    { id: "blue_hat", name: "Blue Hat", icon: "🧢", category: "lost", color: "#2563eb" },
    { id: "missing_book", name: "English Storybook", icon: "📖", category: "lost", color: "#8b5cf6" }
  ],

  // =========================================================================
  // LEVEL 1: LISTEN & MOVE (AUDIO INSTRUCTIONS FIRST)
  // =========================================================================
  level1: {
    title: "LEVEL 1 — LISTEN & MOVE",
    subtitle: "Listen carefully to the English instruction and drag the object to the correct place!",
    tasks: [
      {
        itemId: "books",
        targetZoneId: "shelf",
        spoken: "Put the books on the shelf.",
        written: "Put the books on the shelf.",
        hint: "Where do books go? 📚 ➔ On the shelf!",
        points: 1
      },
      {
        itemId: "shoes",
        targetZoneId: "under_bed",
        spoken: "Put the shoes under the bed.",
        written: "Put the shoes under the bed.",
        hint: "Where do shoes go? 👟 ➔ Under the bed!",
        points: 1
      },
      {
        itemId: "bag",
        targetZoneId: "under_desk",
        spoken: "Put the school bag next to the desk.",
        written: "Put the school bag under the desk.",
        hint: "Where does the bag go? 🎒 ➔ Under or next to the desk!",
        points: 1
      },
      {
        itemId: "blue_pencil",
        targetZoneId: "pencil_case",
        spoken: "Put the blue pencil in the pencil case.",
        written: "Put the blue pencil in the pencil case.",
        hint: "Where does the pencil go? ✏️ ➔ In the pencil case!",
        points: 1
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: READ & ORGANIZE (WRITTEN INSTRUCTIONS)
  // =========================================================================
  level2: {
    title: "LEVEL 2 — READ & ORGANIZE",
    subtitle: "Read the written instructions and organize the messy room!",
    instructions: [
      { itemId: "teddy", targetZoneId: "bed", text: "Put the teddy bear on the bed. 🧸 ➔ 🛏️" },
      { itemId: "shoes", targetZoneId: "door", text: "Put the shoes near the door. 👟 ➔ 🚪" },
      { itemId: "books", targetZoneId: "shelf", text: "Put the books on the shelf. 📚 ➔ 📚" },
      { itemId: "bag", targetZoneId: "under_desk", text: "Put the bag under the desk. 🎒 ➔ 🖥️" }
    ]
  },

  // =========================================================================
  // LEVEL 3: REMEMBER (SPATIAL MEMORY CHALLENGE)
  // =========================================================================
  level3: {
    title: "LEVEL 3 — SPATIAL MEMORY",
    subtitle: "Look at the tidy room for 8 seconds! Then answer where the objects are!",
    timeLimit: 8,
    roomLayout: [
      { itemId: "teddy", locationName: "On the bed", preposition: "on the bed", icon: "🧸 🛏️" },
      { itemId: "shoes", locationName: "Near the door", preposition: "near the door", icon: "👟 🚪" },
      { itemId: "bag", locationName: "Under the desk", preposition: "under the desk", icon: "🎒 🖥️" },
      { itemId: "books", locationName: "On the shelf", preposition: "on the shelf", icon: "📚 🗄️" }
    ],
    questions: [
      {
        question: "Where is the teddy bear?",
        spoken: "Where is the teddy bear?",
        correctAnswer: "on the bed",
        options: [
          { text: "On the bed ✅", isCorrect: true, speech: "It is on the bed." },
          { text: "Under the chair", isCorrect: false, speech: "It is under the chair." },
          { text: "In the box", isCorrect: false, speech: "It is in the box." }
        ]
      },
      {
        question: "Where are the shoes?",
        spoken: "Where are the shoes?",
        correctAnswer: "near the door",
        options: [
          { text: "Under the bed", isCorrect: false, speech: "They are under the bed." },
          { text: "Near the door ✅", isCorrect: true, speech: "They are near the door." },
          { text: "On the desk", isCorrect: false, speech: "They are on the desk." }
        ]
      },
      {
        question: "What's under the desk?",
        spoken: "What is under the desk?",
        correctAnswer: "The school bag",
        options: [
          { text: "The school bag ✅", isCorrect: true, speech: "The school bag is under the desk." },
          { text: "The books", isCorrect: false, speech: "The books are under the desk." },
          { text: "The teddy bear", isCorrect: false, speech: "The teddy bear is under the desk." }
        ]
      },
      {
        question: "What's on the shelf?",
        spoken: "What is on the shelf?",
        correctAnswer: "The books",
        options: [
          { text: "The shoes", isCorrect: false, speech: "The shoes are on the shelf." },
          { text: "The books ✅", isCorrect: true, speech: "The books are on the shelf." },
          { text: "The hat", isCorrect: false, speech: "The hat is on the shelf." }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 4: FIND THE LOST OBJECTS (SEARCH MECHANIC)
  // =========================================================================
  level4: {
    title: "LEVEL 4 — FIND THE LOST OBJECTS",
    subtitle: "Read the clues to find 3 lost items! You have 5 search tokens — don't guess randomly!",
    maxSearches: 5,
    lostItems: [
      {
        id: "key",
        name: "Golden Key",
        icon: "🔑",
        clue: "The key is under something you sit on.",
        spokenClue: "The key is under something you sit on.",
        correctZoneId: "under_chair",
        foundText: "🎉 You found the Key under the chair!",
        spokenFound: "You found the key under the chair!"
      },
      {
        id: "blue_hat",
        name: "Blue Hat",
        icon: "🧢",
        clue: "The hat is inside something made of cardboard for storing toys.",
        spokenClue: "The hat is inside something made of cardboard for storing toys.",
        correctZoneId: "box",
        foundText: "🎉 You found the Blue Hat inside the toy box!",
        spokenFound: "You found the blue hat inside the toy box!"
      },
      {
        id: "red_notebook",
        name: "Red Notebook",
        icon: "📓",
        clue: "The notebook is behind the books on the shelf. (Move the books first!)",
        spokenClue: "The notebook is behind the books on the shelf.",
        correctZoneId: "shelf",
        blockingItemId: "books",
        foundText: "🎉 You moved the books and found the Red Notebook!",
        spokenFound: "You moved the books and found the red notebook!"
      }
    ]
  },

  // =========================================================================
  // LEVEL 5: MULTI-STEP CLUES (3-STEP DEDUCTION SEARCH)
  // =========================================================================
  level5: {
    title: "LEVEL 5 — MULTI-STEP CLUES",
    subtitle: "Combine 3 clues to locate the missing Red Notebook!",
    targetItem: { id: "red_notebook", name: "Red Notebook", icon: "📓" },
    maxSearches: 4,
    correctZoneId: "shelf",
    clues: [
      { step: 1, text: "Clue 1: The notebook is NOT on the floor.", spoken: "Clue 1: The notebook is not on the floor." },
      { step: 2, text: "Clue 2: It is near something you use for reading.", spoken: "Clue 2: It is near something you use for reading." },
      { step: 3, text: "Clue 3: Look behind the books on the shelf!", spoken: "Clue 3: Look behind the books on the shelf!" }
    ],
    foundMessage: "🎉 AMAZING DEDUCTION! You used all 3 clues to find the Red Notebook behind the books!"
  },

  // =========================================================================
  // LEVEL 6: LISTENING SEARCH (AUDIO FIRST)
  // =========================================================================
  level6: {
    title: "LEVEL 6 — LISTENING SEARCH",
    subtitle: "Listen to the audio clue! Decide which container or place to search!",
    maxSearches: 4,
    challenges: [
      {
        targetItem: { id: "blue_pencil", name: "Blue Pencil", icon: "✏️" },
        spokenClue: "The blue pencil is inside something on the desk.",
        writtenClue: "The blue pencil is inside something on the desk.",
        correctZoneId: "pencil_case",
        explanation: "The pencil case is on the desk! ✏️"
      },
      {
        targetItem: { id: "clothes", name: "Clean T-Shirt", icon: "👕" },
        spokenClue: "The clean clothes are inside the tall cupboard.",
        writtenClue: "The clean clothes are inside the tall cupboard.",
        correctZoneId: "wardrobe",
        explanation: "The clothes were inside the wardrobe! 🚪"
      }
    ]
  },

  // =========================================================================
  // LEVEL 7: READING SEARCH (COMPLEX PREPOSITIONS)
  // =========================================================================
  level7: {
    title: "LEVEL 7 — READING SEARCH",
    subtitle: "Read complex multi-preposition instructions to find the hidden objects!",
    maxSearches: 4,
    challenges: [
      {
        targetItem: { id: "key", name: "Silver Key", icon: "🔑" },
        textClue: "Look behind the chair that is next to the desk.",
        spokenClue: "Look behind the chair that is next to the desk.",
        correctZoneId: "behind_chair",
        explanation: "You searched behind the chair next to the desk! 🪑"
      },
      {
        targetItem: { id: "missing_book", name: "English Storybook", icon: "📖" },
        textClue: "The missing book is inside the box under the desk.",
        spokenClue: "The missing book is inside the box under the desk.",
        correctZoneId: "under_desk",
        explanation: "You found the storybook inside the box under the desk! 📦"
      }
    ]
  },

  // =========================================================================
  // LEVEL 8: SEQUENCE THE CLEAN-UP
  // =========================================================================
  level8: {
    title: "LEVEL 8 — SEQUENCE THE CLEAN-UP",
    subtitle: "Drag the 5 clean-up actions into the correct logical order: First ➔ Then ➔ Next ➔ After that ➔ Finally!",
    cards: [
      { id: "seq_1", step: 1, seqWord: "First", text: "Put the toys in the box.", icon: "🧸 ➔ 📦", spoken: "First, put the toys in the box." },
      { id: "seq_2", step: 2, seqWord: "Then", text: "Put the books on the shelf.", icon: "📚 ➔ 📚", spoken: "Then, put the books on the shelf." },
      { id: "seq_3", step: 3, seqWord: "Next", text: "Put the clothes in the basket.", icon: "👕 ➔ 🧺", spoken: "Next, put the clothes in the basket." },
      { id: "seq_4", step: 4, seqWord: "After that", text: "Put the shoes near the door.", icon: "👟 ➔ 🚪", spoken: "After that, put the shoes near the door." },
      { id: "seq_5", step: 5, seqWord: "Finally", text: "Clean the floor with the broom.", icon: "🧹 ✨", spoken: "Finally, clean the floor." }
    ]
  },

  // =========================================================================
  // LEVEL 9: THE EFFICIENT ROOM (SPATIAL OPTIMIZATION)
  // =========================================================================
  level9: {
    title: "LEVEL 9 — THE EFFICIENT ROOM",
    subtitle: "“It's tidy... but difficult to use!” Move items to their most convenient spots!",
    tasks: [
      { itemId: "books", currentZone: "door", targetZoneId: "desk", text: "Put the books near the desk for studying. 📚 ➔ 🖥️", spoken: "Put the books near the desk." },
      { itemId: "shoes", currentZone: "bed", targetZoneId: "door", text: "Put the shoes near the door for going outside. 👟 ➔ 🚪", spoken: "Put the shoes near the door." },
      { itemId: "blue_pencil", currentZone: "shelf", targetZoneId: "pencil_case", text: "Put the pencils on the desk. ✏️ ➔ 🖥️", spoken: "Put the pencils on the desk." },
      { itemId: "bag", currentZone: "chair", targetZoneId: "under_desk", text: "Put the bag under the desk so the chair is free. 🎒 ➔ 🖥️", spoken: "Put the bag under the desk." }
    ]
  },

  // =========================================================================
  // FINAL MISSION: GRAND ROOM RESCUE
  // =========================================================================
  finalMission: {
    title: "🔥 FINAL MISSION — ROOM RESCUE",
    subtitle: "Complete the ultimate multi-step clean-up & find all lost treasures to transform the room!",
    steps: [
      {
        stepNum: 1,
        type: "move",
        instruction: "First, put the books on the shelf.",
        spoken: "First, put the books on the shelf.",
        itemId: "books",
        targetZoneId: "shelf"
      },
      {
        stepNum: 2,
        type: "move",
        instruction: "Next, put the shoes near the door.",
        spoken: "Next, put the shoes near the door.",
        itemId: "shoes",
        targetZoneId: "door"
      },
      {
        stepNum: 3,
        type: "search",
        instruction: "Now find the Blue Hat! (Clue: It is inside something under the window).",
        spoken: "Now find the Blue Hat. It is inside something under the window.",
        targetItem: { id: "blue_hat", name: "Blue Hat", icon: "🧢" },
        correctZoneId: "box"
      },
      {
        stepNum: 4,
        type: "search",
        instruction: "Find the Red Notebook! (Clue: It is not on the floor. It is near something you use for writing).",
        spoken: "Find the Red Notebook. It is near something you use for writing.",
        targetItem: { id: "red_notebook", name: "Red Notebook", icon: "📓" },
        correctZoneId: "drawer"
      },
      {
        stepNum: 5,
        type: "move",
        instruction: "Finally, put the school bag under the desk.",
        spoken: "Finally, put the school bag under the desk.",
        itemId: "bag",
        targetZoneId: "under_desk"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_DATA;
}
