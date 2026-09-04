/**
 * Room Rescue: The Lost Things Mission (4th Grade English Revision Game)
 * Data structures for visual room coordinates, interactive furniture drop zones,
 * container states, and levels 1-9.
 */

const ROOM_DATA = {
  // Furniture Target Drop Zones in the Visual Room
  furniture: [
    { id: "shelf", name: "Bookshelf", icon: "📚", label: "On the Shelf", x: 4, y: 12, w: 16, h: 42, preposition: "on the shelf" },
    { id: "window", name: "Window", icon: "🪟", label: "Near the Window", x: 36, y: 5, w: 18, h: 26, preposition: "near the window" },
    { id: "picture", name: "Picture", icon: "🖼️", label: "Behind the Picture", x: 58, y: 6, w: 12, h: 18, preposition: "behind the picture" },
    { id: "wardrobe", name: "Wardrobe", icon: "🚪", label: "Inside the Cupboard", x: 74, y: 8, w: 16, h: 48, preposition: "inside the cupboard" },
    { id: "bed", name: "Bed", icon: "🛏️", label: "On the Bed", x: 4, y: 56, w: 26, h: 36, preposition: "on the bed" },
    { id: "under_bed", name: "Under the Bed", icon: "🕳️", label: "Under the Bed", x: 5, y: 88, w: 24, h: 10, preposition: "under the bed" },
    { id: "desk", name: "Desk Surface", icon: "🖥️", label: "On the Desk", x: 42, y: 45, w: 24, h: 34, preposition: "on the desk" },
    { id: "under_desk", name: "Under the Desk", icon: "📦", label: "Under the Desk", x: 43, y: 76, w: 12, h: 18, preposition: "under the desk" },
    { id: "drawer", name: "Desk Drawer", icon: "🗄️", label: "In the Drawer", x: 55, y: 56, w: 10, h: 16, preposition: "in the drawer" },
    { id: "pencil_case", name: "Pencil Case", icon: "✏️", label: "In the Pencil Case", x: 44, y: 44, w: 9, h: 8, preposition: "in the pencil case" },
    { id: "chair", name: "Chair", icon: "🪑", label: "On the Chair", x: 46, y: 65, w: 9, h: 24, preposition: "on the chair" },
    { id: "under_chair", name: "Under the Chair", icon: "🪑", label: "Under the Chair", x: 46, y: 84, w: 9, h: 10, preposition: "under the chair" },
    { id: "behind_chair", name: "Behind the Chair", icon: "🪑", label: "Behind the Chair", x: 42, y: 64, w: 8, h: 20, preposition: "behind the chair" },
    { id: "door", name: "Door", icon: "🚪", label: "Near the Door", x: 86, y: 40, w: 12, h: 54, preposition: "near the door" },
    { id: "box", name: "Toy Box", icon: "📦", label: "Inside the Box", x: 70, y: 72, w: 12, h: 18, preposition: "inside the box" },
    { id: "basket", name: "Clothes Basket", icon: "🧺", label: "In the Basket", x: 85, y: 74, w: 10, h: 18, preposition: "in the basket" }
  ],

  // Initial Messy Positions of Visual Items on the Floor
  initialItems: [
    { id: "books", name: "Stack of Books", icon: "📚", artClass: "item-art-books", initX: 28, initY: 76, targetZone: "shelf", targetLabel: "Bookshelf" },
    { id: "shoes", name: "Sneakers", icon: "👟", artClass: "item-art-shoes", initX: 62, initY: 82, targetZone: "under_bed", targetLabel: "Under the Bed" },
    { id: "bag", name: "School Bag", icon: "🎒", artClass: "item-art-bag", initX: 47, initY: 66, targetZone: "under_desk", targetLabel: "Under the Desk" },
    { id: "blue_pencil", name: "Blue Pencil", icon: "✏️", artClass: "item-art-pencil", initX: 34, initY: 60, targetZone: "pencil_case", targetLabel: "Pencil Case" },
    { id: "teddy", name: "Teddy Bear", icon: "🧸", artClass: "item-art-teddy", initX: 72, initY: 60, targetZone: "bed", targetLabel: "On the Bed" },
    { id: "clothes", name: "Clothes", icon: "👕", artClass: "item-art-clothes", initX: 30, initY: 84, targetZone: "basket", targetLabel: "In the Basket" }
  ],

  // Hidden Objects mapped to containers / secret spots
  hiddenItems: [
    { id: "key", name: "Golden Key", icon: "🔑", artClass: "item-art-key", containerId: "drawer", zoneId: "drawer", clue: "The key is inside the desk drawer. Pull the drawer open!", spoken: "The key is inside the desk drawer. Pull the drawer open!" },
    { id: "blue_hat", name: "Blue Hat", icon: "🧢", artClass: "item-art-hat", containerId: "box", zoneId: "box", clue: "The hat is inside the pink toy box. Click the lid to open!", spoken: "The hat is inside the pink toy box. Click the lid to open!" },
    { id: "red_notebook", name: "Red Notebook", icon: "📓", artClass: "item-art-notebook", containerId: "shelf", zoneId: "shelf", clue: "The notebook is behind the books on the shelf!", spoken: "The notebook is behind the books on the shelf!" },
    { id: "missing_book", name: "Storybook", icon: "📖", artClass: "item-art-books", containerId: "under_desk", zoneId: "under_desk", clue: "The storybook is inside the box under the desk!", spoken: "The storybook is inside the box under the desk!" }
  ],

  // =========================================================================
  // LEVEL 1: LISTEN & MOVE (AUDIO INSTRUCTIONS -> DRAG OBJECTS)
  // =========================================================================
  level1: {
    title: "LEVEL 1 — LISTEN & DRAG",
    subtitle: "Listen to the English instruction, grab the visual object, and drag it to the correct place in the room!",
    tasks: [
      {
        itemId: "books",
        targetZoneId: "shelf",
        spoken: "Put the books on the shelf.",
        written: "Put the books on the shelf. (Drag 📚 ➔ Bookshelf)",
        hint: "Grab the books from the floor and drag them to the bookshelf!"
      },
      {
        itemId: "shoes",
        targetZoneId: "under_bed",
        spoken: "Put the shoes under the bed.",
        written: "Put the shoes under the bed. (Drag 👟 ➔ Under the Bed)",
        hint: "Grab the shoes from the floor and drag them under the bed!"
      },
      {
        itemId: "bag",
        targetZoneId: "under_desk",
        spoken: "Put the school bag under the desk.",
        written: "Put the school bag under the desk. (Drag 🎒 ➔ Under the Desk)",
        hint: "Grab the school bag and drag it under the desk!"
      },
      {
        itemId: "blue_pencil",
        targetZoneId: "pencil_case",
        spoken: "Put the blue pencil in the pencil case.",
        written: "Put the blue pencil in the pencil case. (Drag ✏️ ➔ Pencil Case)",
        hint: "Grab the blue pencil and drag it onto the pencil case on the desk!"
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: READ & ORGANIZE (WRITTEN CHECKLIST -> PHYSICAL DRAG)
  // =========================================================================
  level2: {
    title: "LEVEL 2 — READ & ORGANIZE",
    subtitle: "Read the written instructions and physically drag each object into place!",
    instructions: [
      { itemId: "teddy", targetZoneId: "bed", text: "Put the teddy bear on the bed.", spoken: "Put the teddy bear on the bed." },
      { itemId: "shoes", targetZoneId: "door", text: "Put the shoes near the door.", spoken: "Put the shoes near the door." },
      { itemId: "clothes", targetZoneId: "basket", text: "Put the clothes in the laundry basket.", spoken: "Put the clothes in the laundry basket." },
      { itemId: "bag", targetZoneId: "under_desk", text: "Put the bag under the desk.", spoken: "Put the bag under the desk." }
    ]
  },

  // =========================================================================
  // LEVEL 3: SPATIAL MEMORY
  // =========================================================================
  level3: {
    title: "LEVEL 3 — SPATIAL MEMORY",
    subtitle: "Look at the tidy room for 8 seconds! Then answer from memory where objects are!",
    timeLimit: 8,
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
  // LEVEL 4: FIND THE LOST OBJECTS (REAL CONTAINER & HIDING SEARCH)
  // =========================================================================
  level4: {
    title: "LEVEL 4 — FIND THE LOST OBJECTS",
    subtitle: "Read the clues and interact with the room (open drawers, open boxes, move items) to find 3 lost treasures!",
    maxSearches: 5,
    lostItems: [
      {
        id: "key",
        name: "Golden Key",
        icon: "🔑",
        clue: "The key is inside the desk drawer. Pull the drawer to open it!",
        spokenClue: "The key is inside the desk drawer. Pull the drawer open!",
        correctZoneId: "drawer",
        interactionType: "open_drawer",
        foundText: "🎉 You pulled the drawer open and found the Golden Key! 🔑"
      },
      {
        id: "blue_hat",
        name: "Blue Hat",
        icon: "🧢",
        clue: "The hat is inside the pink toy box. Click the lid to open!",
        spokenClue: "The hat is inside the pink toy box. Click the lid to open!",
        correctZoneId: "box",
        interactionType: "open_box",
        foundText: "🎉 You opened the toy box lid and found the Blue Hat! 🧢"
      },
      {
        id: "red_notebook",
        name: "Red Notebook",
        icon: "📓",
        clue: "The notebook is behind the books on the shelf. Drag the books onto the shelf to reveal it!",
        spokenClue: "The notebook is behind the books on the shelf. Move the books to reveal it!",
        correctZoneId: "shelf",
        interactionType: "move_books",
        foundText: "🎉 You placed the books on the shelf and discovered the hidden Red Notebook! 📓"
      }
    ]
  },

  // =========================================================================
  // LEVEL 5: MULTI-STEP CLUES (3-STEP DEDUCTION)
  // =========================================================================
  level5: {
    title: "LEVEL 5 — MULTI-STEP CLUES",
    subtitle: "Follow all 3 clues to discover the secret hiding place!",
    targetItem: { id: "red_notebook", name: "Red Notebook", icon: "📓" },
    maxSearches: 4,
    correctZoneId: "shelf",
    clues: [
      { step: 1, text: "Clue 1: The notebook is NOT on the floor.", spoken: "Clue 1: The notebook is not on the floor." },
      { step: 2, text: "Clue 2: It is near something you use for reading.", spoken: "Clue 2: It is near something you use for reading." },
      { step: 3, text: "Clue 3: Look behind the books on the shelf!", spoken: "Clue 3: Look behind the books on the shelf!" }
    ]
  },

  // =========================================================================
  // LEVEL 6: LISTENING SEARCH (AUDIO CLUES)
  // =========================================================================
  level6: {
    title: "LEVEL 6 — LISTENING SEARCH",
    subtitle: "Listen carefully to the audio clue and click/search the exact container!",
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
    subtitle: "Process multi-preposition instructions to search complex locations!",
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
  // LEVEL 8: SEQUENCE THE CLEAN-UP (PICTURE CARDS)
  // =========================================================================
  level8: {
    title: "LEVEL 8 — SEQUENCE THE CLEAN-UP",
    subtitle: "Drag the 5 illustrated action cards into the correct sequence: First ➔ Then ➔ Next ➔ After that ➔ Finally!",
    cards: [
      { id: "seq_1", step: 1, seqWord: "First", text: "Put the toys in the box.", icon: "🧸 ➔ 📦", caption: "Toys in box", spoken: "First, put the toys in the box." },
      { id: "seq_2", step: 2, seqWord: "Then", text: "Put the books on the shelf.", icon: "📚 ➔ 🗄️", caption: "Books on shelf", spoken: "Then, put the books on the shelf." },
      { id: "seq_3", step: 3, seqWord: "Next", text: "Put the clothes in the basket.", icon: "👕 ➔ 🧺", caption: "Clothes in basket", spoken: "Next, put the clothes in the basket." },
      { id: "seq_4", step: 4, seqWord: "After that", text: "Put the shoes near the door.", icon: "👟 ➔ 🚪", caption: "Shoes near door", spoken: "After that, put the shoes near the door." },
      { id: "seq_5", step: 5, seqWord: "Finally", text: "Clean the floor with the broom.", icon: "🧹 ✨", caption: "Clean the floor", spoken: "Finally, clean the floor." }
    ]
  },

  // =========================================================================
  // LEVEL 9: THE EFFICIENT ROOM (SPATIAL OPTIMIZATION)
  // =========================================================================
  level9: {
    title: "LEVEL 9 — THE EFFICIENT ROOM",
    subtitle: "“It's tidy... but difficult to use!” Drag items to their most convenient everyday spots!",
    tasks: [
      { itemId: "books", currentZone: "door", targetZoneId: "desk", text: "Put the books near the desk for studying. (Drag 📚 ➔ Desk)", spoken: "Put the books near the desk." },
      { itemId: "shoes", currentZone: "bed", targetZoneId: "door", text: "Put the shoes near the door for going outside. (Drag 👟 ➔ Door)", spoken: "Put the shoes near the door." },
      { itemId: "blue_pencil", currentZone: "shelf", targetZoneId: "pencil_case", text: "Put the pencils on the desk. (Drag ✏️ ➔ Desk)", spoken: "Put the pencils on the desk." },
      { itemId: "bag", currentZone: "chair", targetZoneId: "under_desk", text: "Put the bag under the desk so the chair is free. (Drag 🎒 ➔ Under Desk)", spoken: "Put the bag under the desk." }
    ]
  },

  // =========================================================================
  // FINAL MISSION: GRAND ROOM RESCUE
  // =========================================================================
  finalMission: {
    title: "🔥 FINAL MISSION — ROOM RESCUE",
    subtitle: "Perform the multi-step sequence, open containers, and rescue the room!",
    steps: [
      {
        stepNum: 1,
        type: "move",
        instruction: "First, drag the books onto the bookshelf.",
        spoken: "First, drag the books onto the bookshelf.",
        itemId: "books",
        targetZoneId: "shelf"
      },
      {
        stepNum: 2,
        type: "move",
        instruction: "Next, drag the shoes beside the door.",
        spoken: "Next, drag the shoes beside the door.",
        itemId: "shoes",
        targetZoneId: "door"
      },
      {
        stepNum: 3,
        type: "search",
        instruction: "Now find the Blue Hat! (Clue: It is inside the toy box under the window. Open the box!)",
        spoken: "Now find the Blue Hat. It is inside the toy box under the window.",
        targetItem: { id: "blue_hat", name: "Blue Hat", icon: "🧢" },
        correctZoneId: "box"
      },
      {
        stepNum: 4,
        type: "search",
        instruction: "Find the Red Notebook! (Clue: Pull the desk drawer open!).",
        spoken: "Find the Red Notebook. Pull the desk drawer open!",
        targetItem: { id: "red_notebook", name: "Red Notebook", icon: "📓" },
        correctZoneId: "drawer"
      },
      {
        stepNum: 5,
        type: "move",
        instruction: "Finally, drag the school bag under the desk.",
        spoken: "Finally, drag the school bag under the desk.",
        itemId: "bag",
        targetZoneId: "under_desk"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_DATA;
}
