/**
 * WONDERLAND DATA REPOSITORY
 * Grade 3 A1 Mini-Unit • Lesson 1: Welcome to Wonderland (Play & Prop Prep)
 */

(function(root) {
  'use strict';

  const WONDERLAND_DATA = {
    lesson: {
      id: "wonderland-lesson1",
      unit: "Alice in Wonderland Mini-Unit",
      lessonNumber: 1,
      totalLessons: 3,
      title: "Welcome to Wonderland",
      subtitle: "Lesson 1: Characters, Props & The Big Play",
      targetGrade: "Grade 3",
      cefrLevel: "A1",
      durationMinutes: 35,
      totalScreens: 12
    },

    // =========================================================================
    // SCREEN 1: WONDERLAND IS CALLING
    // =========================================================================
    screen1: {
      title: "WELCOME TO WONDERLAND",
      subtitle: "Are you ready for an adventure?",
      btnText: "ENTER WONDERLAND ➔",
      teacherPrompt: "Class, are you ready to enter Wonderland?",
      studentResponse: "YES!",
      atmosphere: "A magical Victorian forest with a glowing keyhole door inside the ancient oak tree."
    },

    // =========================================================================
    // SCREEN 2: THE WHITE RABBIT
    // =========================================================================
    screen2: {
      rabbitQuote: "I'm late! I'm late!",
      question: "WHERE IS HE GOING?",
      options: [
        { id: "school", label: "SCHOOL 🏫", icon: "🏫", isCorrect: false, feedback: "Almost! But rabbits don't go to school! Follow him!" },
        { id: "home", label: "HOME 🏠", icon: "🏠", isCorrect: false, feedback: "Not home! He is running into the magical forest!" },
        { id: "wonderland", label: "WONDERLAND 🐇", icon: "🐇", isCorrect: true, feedback: "YES! WONDERLAND! Run with the White Rabbit!" }
      ],
      rabbitSpeech: "Oh dear, oh dear! I'm late for Wonderland!"
    },

    // =========================================================================
    // SCREEN 3: WONDERLAND SCAVENGER HUNT
    // =========================================================================
    screen3: {
      instruction: "Find 6 Wonderland things!",
      hint: "Tap the glowing hidden items inside the enchanted forest!",
      items: [
        { id: "hat", name: "Mad Hatter Hat", icon: "🎩", x: 18, y: 32, clue: "Look near the tall glowing mushroom on the left!" },
        { id: "key", name: "Golden Key", icon: "🗝️", x: 82, y: 68, clue: "Look in the mossy roots near the stone path!" },
        { id: "clock", name: "Pocket Watch", icon: "🕰️", x: 64, y: 28, clue: "Hanging from a twisted willow branch!" },
        { id: "heart", name: "Red Queen Heart", icon: "❤️", x: 38, y: 72, clue: "Resting among the red Wonderland roses!" },
        { id: "card", name: "Playing Card", icon: "🃏", x: 50, y: 46, clue: "Leaning against the hollow rabbit tree!" },
        { id: "teacup", name: "Porcelain Teacup", icon: "☕", x: 74, y: 44, clue: "Placed on a wooden toadstool table!" }
      ]
    },

    // =========================================================================
    // SCREEN 4: MEET THE CHARACTERS (9 Characters)
    // =========================================================================
    characters: [
      {
        id: "alice",
        name: "ALICE",
        role: "The Adventurer",
        sentence: "The girl in Wonderland.",
        audioSpeech: "Hello! I am Alice. I am the girl in Wonderland.",
        badgeColor: "#0284c7",
        icon: "👧",
        prop: "Golden Key 🗝️"
      },
      {
        id: "rabbit",
        name: "WHITE RABBIT",
        role: "The Timekeeper",
        sentence: "He has a clock.",
        audioSpeech: "Tick tock, tick tock! I have a golden clock!",
        badgeColor: "#d97706",
        icon: "🐇",
        prop: "Pocket Watch 🕰️"
      },
      {
        id: "hatter",
        name: "MAD HATTER",
        role: "The Tea Host",
        sentence: "He loves tea.",
        audioSpeech: "Tea time! A cup of hot tea for everyone!",
        badgeColor: "#059669",
        icon: "🎩",
        prop: "Mad Hatter Hat 🎩"
      },
      {
        id: "queen",
        name: "RED QUEEN",
        role: "The Royal Ruler",
        sentence: "She loves hearts.",
        audioSpeech: "I am the Red Queen! Paint all the roses red!",
        badgeColor: "#dc2626",
        icon: "👑",
        prop: "Ruby Heart ❤️"
      },
      {
        id: "cheshire",
        name: "CHESHIRE CAT",
        role: "The Mystery Friend",
        sentence: "He has a big smile.",
        audioSpeech: "We are all mad here! Look at my big magical smile!",
        badgeColor: "#7c3aed",
        icon: "😺",
        prop: "Cheshire Smile 😺"
      },
      {
        id: "hare",
        name: "MARCH HARE",
        role: "The Tea Partner",
        sentence: "He loves tea.",
        audioSpeech: "More tea! Pour another cup of tea!",
        badgeColor: "#b45309",
        icon: "🐰",
        prop: "Teacup ☕"
      },
      {
        id: "dormouse",
        name: "DORMOUSE",
        role: "The Brave Friend",
        sentence: "She is brave.",
        audioSpeech: "I may be tiny, but I am very brave!",
        badgeColor: "#db2777",
        icon: "🐭",
        prop: "Teapot 🫖"
      },
      {
        id: "absolem",
        name: "ABSOLEM",
        role: "The Caterpillar",
        sentence: "He is wise.",
        audioSpeech: "Who are you? Think carefully, little one.",
        badgeColor: "#0891b2",
        icon: "🐛",
        prop: "Mushroom 🍄"
      },
      {
        id: "jabberwocky",
        name: "JABBERWOCKY",
        role: "The Dragon",
        sentence: "He is a giant creature.",
        audioSpeech: "Roar! I am the giant creature of the forest!",
        badgeColor: "#4338ca",
        icon: "🐉",
        prop: "Dragon Wings 🦋"
      }
    ],

    // =========================================================================
    // SCREEN 5: CHARACTER + PROP MATCH
    // =========================================================================
    propMatch: {
      instruction: "Drag each Wonderland prop to the right character!",
      pairs: [
        { charId: "hatter", charName: "Mad Hatter", propId: "prop-hat", propName: "Hat", icon: "🎩" },
        { charId: "rabbit", charName: "White Rabbit", propId: "prop-clock", propName: "Clock", icon: "🕰️" },
        { charId: "queen", charName: "Red Queen", propId: "prop-heart", propName: "Heart", icon: "❤️" },
        { charId: "cheshire", charName: "Cheshire Cat", propId: "prop-cat", propName: "Cat Mask", icon: "😺" },
        { charId: "alice", charName: "Alice", propId: "prop-key", propName: "Key", icon: "🗝️" }
      ]
    },

    // =========================================================================
    // SCREEN 6: THE TIME MACHINE (PAST SIMPLE DISCOVERY)
    // =========================================================================
    timeMachine: {
      nowSentence: "Alice is here.",
      pastSentence: "Alice went to Wonderland.",
      targetVerb: "WENT",
      teacherPrompt: "Listen: Alice is here today. Yesterday... Alice WENT to Wonderland!",
      events: [
        { text: "Alice WENT to Wonderland.", verb: "WENT", base: "go", icon: "🐇" },
        { text: "Alice SAW the Rabbit.", verb: "SAW", base: "see", icon: "👁️" },
        { text: "Alice OPENED the door.", verb: "OPENED", base: "open", icon: "🚪" },
        { text: "Alice FOUND a key.", verb: "FOUND", base: "find", icon: "🗝️" }
      ]
    },

    // =========================================================================
    // SCREEN 7: WHAT HAPPENED? (4 Story Moments)
    // =========================================================================
    whatHappened: [
      {
        id: "moment1",
        label: "The Rabbit",
        icon: "🐇",
        sentence: "Alice saw the Rabbit.",
        verb: "SAW",
        base: "see",
        audio: "Alice saw the Rabbit running fast!"
      },
      {
        id: "moment2",
        label: "The Door",
        icon: "🚪",
        sentence: "Alice opened the door.",
        verb: "OPENED",
        base: "open",
        audio: "Alice opened the little wooden door."
      },
      {
        id: "moment3",
        label: "The Key",
        icon: "🗝️",
        sentence: "Alice found a key.",
        verb: "FOUND",
        base: "find",
        audio: "Alice found a shiny golden key."
      },
      {
        id: "moment4",
        label: "The Hatter",
        icon: "🎩",
        sentence: "Alice met the Hatter.",
        verb: "MET",
        base: "meet",
        audio: "Alice met the Mad Hatter at the tea party."
      }
    ],

    // =========================================================================
    // SCREEN 8: NOW OR YESTERDAY? (Two Giant Buttons)
    // =========================================================================
    nowOrYesterday: [
      {
        id: "q1",
        sentence: "Alice went to Wonderland.",
        correct: "yesterday",
        explanation: "WENT happened in the past!"
      },
      {
        id: "q2",
        sentence: "Alice is in Wonderland.",
        correct: "now",
        explanation: "IS is happening right now!"
      },
      {
        id: "q3",
        sentence: "Alice opened the door.",
        correct: "yesterday",
        explanation: "OPENED happened in the past!"
      },
      {
        id: "q4",
        sentence: "Alice sees the Rabbit.",
        correct: "now",
        explanation: "SEES is happening right now!"
      }
    ],

    // =========================================================================
    // SCREEN 9: ACT IT! (TPR Drama Actions)
    // =========================================================================
    tprActions: [
      {
        step: 1,
        sentence: "Alice went!",
        actionTitle: "Walk in the Forest!",
        instruction: "Step your feet and walk through Wonderland!",
        icon: "🚶‍♂️",
        audioPrompt: "Alice went! Stand up and walk!"
      },
      {
        step: 2,
        sentence: "Alice saw the Rabbit!",
        actionTitle: "Look through Binoculars!",
        instruction: "Make binoculars with your hands and look left and right!",
        icon: "👀",
        audioPrompt: "Alice saw the Rabbit! Hands to your eyes!"
      },
      {
        step: 3,
        sentence: "Alice opened the door!",
        actionTitle: "Turn the Giant Key!",
        instruction: "Grip the heavy key, turn it click, and pull the door open!",
        icon: "🚪",
        audioPrompt: "Alice opened the door! Turn and pull!"
      },
      {
        step: 4,
        sentence: "Alice found a key!",
        actionTitle: "Pick it up from the ground!",
        instruction: "Reach down, pick up the sparkling golden key, and show it high!",
        icon: "🗝️",
        audioPrompt: "Alice found a key! Pick it up!"
      },
      {
        step: 5,
        sentence: "Alice met the Hatter!",
        actionTitle: "Bow and Take off your Hat!",
        instruction: "Take off your imaginary hat, bow politely, and say: Nice to meet you!",
        icon: "🎩",
        audioPrompt: "Alice met the Hatter! Bow and smile!"
      }
    ],

    // =========================================================================
    // SCREEN 10: THE MYSTERIOUS WORKSHOP CHEST (Future Theatre Props)
    // =========================================================================
    chestProps: [
      { id: "prop1", name: "Mad Hatter Hats", icon: "🎩", detail: "Cardboard & ribbon hats" },
      { id: "prop2", name: "White Rabbit Ears", icon: "🐰", detail: "Fluffy paper headbands" },
      { id: "prop3", name: "Golden Crowns", icon: "👑", detail: "Sparkling heart crowns" },
      { id: "prop4", name: "Golden Keys", icon: "🗝️", detail: "Giant painted wooden keys" },
      { id: "prop5", name: "Pocket Watches", icon: "🕰️", detail: "Big clock dials with yarn" },
      { id: "prop6", name: "Red Queen Hearts", icon: "❤️", detail: "Felt hearts & rose scepters" },
      { id: "prop7", name: "Butterfly Wings", icon: "🦋", detail: "Absolem wearable wings" },
      { id: "prop8", name: "Cheshire Cat Masks", icon: "😺", detail: "Smiley paper-plate masks" },
      { id: "prop9", name: "Card Soldiers", icon: "🃏", detail: "Wearable deck card tunics" }
    ],

    // =========================================================================
    // SCREEN 11: OUR BIG MISSION (The Stage)
    // =========================================================================
    missionSteps: [
      "SOON...",
      "WE WILL MAKE OUR PROPS.",
      "WE WILL WEAR THEM.",
      "WE WILL ACT.",
      "WE WILL TELL THE STORY.",
      "🎭 OUR WONDERLAND PLAY"
    ],

    // =========================================================================
    // SCREEN 12: EXIT TICKET (Oral Assessment Support)
    // =========================================================================
    exitTickets: [
      { icon: "🎩", name: "Hat", target: "I saw a hat.", challenge: "Alice met the Hatter." },
      { icon: "🗝️", name: "Key", target: "I found a key.", challenge: "Alice found a golden key." },
      { icon: "🕰️", name: "Clock", target: "I saw a clock.", challenge: "The Rabbit had a clock." },
      { icon: "❤️", name: "Heart", target: "I saw a heart.", challenge: "The Queen loved hearts." },
      { icon: "🐇", name: "Rabbit", target: "I saw a rabbit.", challenge: "Alice saw the White Rabbit." }
    ],

    // =========================================================================
    // TEACHER GUIDES (12 Pedagogical Breakdowns)
    // =========================================================================
    teacherGuides: {
      1: {
        timing: "0–3 min",
        objective: "Spark curiosity, establish Wonderland setting, activate student imagination.",
        teacherScript: "Class, look at the big enchanted tree! Who lives inside? Let's step into Wonderland together! Tap ENTER WONDERLAND!",
        studentAction: "Whole class shouts 'YES!' and gestures toward the glowing door.",
        boardTip: "Tap the big glowing door button to trigger particle burst and magical sound."
      },
      2: {
        timing: "3–6 min",
        objective: "Introduce the White Rabbit, practice fast visual recognition of Wonderland context.",
        teacherScript: "Look at the Rabbit! He has a clock and he's running! 'I\'m late! I\'m late!' Where is he going?",
        studentAction: "Students call out and point to WONDERLAND button.",
        boardTip: "Tap choice 3; observe the Rabbit sprite run toward the answer."
      },
      3: {
        timing: "6–11 min",
        objective: "Scavenger Hunt: active exploration, name 6 core theatre props in authentic context.",
        teacherScript: "We need 6 Wonderland treasures! Can a detective find the hat? The key? The clock? Come touch the board!",
        studentAction: "Volunteers walk to the Smart Board and tap hidden items.",
        boardTip: "Each tapped item floats into the collection bar with +1 XP."
      },
      4: {
        timing: "11–16 min",
        objective: "Meet 9 Wonderland characters; establish simple A1 descriptive sentences.",
        teacherScript: "Here are our play characters! Listen carefully to each one. Alice... the Mad Hatter... the Cheshire Cat!",
        studentAction: "Students echo character names and repeat single sentences.",
        boardTip: "Tap character cards to hear clear audio pronunciation."
      },
      5: {
        timing: "16–20 min",
        objective: "Match characters with their signature theatre props (pre-workshop link).",
        teacherScript: "Who needs the top hat? Who holds the pocket watch? Match them to get them ready for the play!",
        studentAction: "Students drag or tap character to connect with prop.",
        boardTip: "Large touch targets prevent accidental drop misses."
      },
      6: {
        timing: "20–24 min",
        objective: "Discover Past Simple naturally via Time Machine contrast (Today vs Yesterday).",
        teacherScript: "Today Alice is here in class. Yesterday... Alice WENT to Wonderland! Say it with me: WENT!",
        studentAction: "Choral repetition of target verbs: WENT, SAW, OPENED, FOUND.",
        boardTip: "Tap the Time Machine lever to spin the clock backwards with whoosh SFX."
      },
      7: {
        timing: "24–27 min",
        objective: "Reinforce past verb recognition across 4 illustrated story events.",
        teacherScript: "What happened first? Alice saw the rabbit! What did she open? She opened the door!",
        studentAction: "Students identify the highlighted verb in each card.",
        boardTip: "Tap each moment card to reveal the glowing past verb."
      },
      8: {
        timing: "27–29 min",
        objective: "Rapid-fire formative check: Now vs Yesterday time concepts.",
        teacherScript: "I'll read a sentence. If it's happening right now, shout NOW! If it happened before, shout YESTERDAY!",
        studentAction: "Team voting: Left side of room votes NOW, right votes YESTERDAY.",
        boardTip: "Two giant colored buttons with instant positive feedback."
      },
      9: {
        timing: "29–32 min",
        objective: "Total Physical Response (TPR): translate English verbs into physical body memory.",
        teacherScript: "Everyone stand up! Alice went! (Walk!) Alice saw the Rabbit! (Binoculars!) Alice opened the door! (Turn!)",
        studentAction: "Full classroom physical movement embodying story verbs.",
        boardTip: "Use the Next Action button to keep the pace energetic."
      },
      10: {
        timing: "32–33 min",
        objective: "Unveil the Workshop Chest: link the lesson language to the upcoming prop craft workshop.",
        teacherScript: "Look at this giant locked chest. What's inside? Let's unlock it! ... THESE ARE OUR THEATRE PROPS!",
        studentAction: "Gasp and cheer as 9 future craft props burst from the chest.",
        boardTip: "Tap the golden padlock to trigger the chest open animation."
      },
      11: {
        timing: "33–34 min",
        objective: "Share the Big Mission: motivate learners for the 3-lesson play unit.",
        teacherScript: "We are going to make the props, wear them, and perform the Wonderland Play together!",
        studentAction: "Students raise hands and chant 'OUR PLAY!'",
        boardTip: "Theatre curtains open smoothly to reveal the stage."
      },
      12: {
        timing: "34–35 min",
        objective: "Exit Ticket: individual oral check with scaffolded sentence frames.",
        teacherScript: "Spin the wheel! You get a Key! Tell me one sentence: 'I found a key.' Great job, Detective Explorer!",
        studentAction: "Students produce 1 full English sentence before dismissal.",
        boardTip: "Tap RANDOM PROP to generate instant oral prompts."
      }
    }
  };

  root.WONDERLAND_DATA = WONDERLAND_DATA;

})(typeof window !== 'undefined' ? window : global);
