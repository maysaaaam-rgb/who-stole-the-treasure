/**
 * TIME MACHINE STRUCTURED DATA & PEDAGOGICAL CONTENT
 * Grade 3 A1 Mini-Unit • Lesson 2: The Wonderland Time Machine
 */

(function(root) {
  'use strict';

  const TIME_MACHINE_DATA = {
    lesson: {
      number: 2,
      title: "The Wonderland Time Machine",
      grade: "Grade 3",
      level: "CEFR A1",
      durationMinutes: 35,
      unitContext: "Lesson 2 of 3 • Past Simple Game Adventure preparing for Classroom Play"
    },

    // =========================================================================
    // SCREEN 1: THE TIME MACHINE
    // =========================================================================
    screen1: {
      title: "THE WONDERLAND TIME MACHINE",
      subtitle: "Something happened yesterday...",
      leadText: "Alice and the White Rabbit are standing beside the giant Victorian clock.",
      teacherPrompt: "Class, look at the big clock! Are you ready to travel to yesterday?",
      studentResponse: "YES! START THE TIME MACHINE!",
      btnStart: "START THE TIME MACHINE ➔",
      countdownText: "TRAVELING TO YESTERDAY...",
      countdownSeconds: 3
    },

    // =========================================================================
    // SCREEN 2: NOW OR YESTERDAY? (Warm-Up Portals)
    // =========================================================================
    screen2: {
      title: "NOW OR YESTERDAY?",
      subtitle: "Look at the sentence. Tap the right time portal!",
      questions: [
        {
          id: "q1",
          text: "Alice is in Wonderland.",
          correct: "now",
          verb: "is",
          feedback: "✨ Now! 'IS' is happening today!"
        },
        {
          id: "q2",
          text: "Alice went to Wonderland.",
          correct: "yesterday",
          verb: "went",
          feedback: "✨ Yesterday! 'WENT' is in the past!"
        },
        {
          id: "q3",
          text: "Alice opens the door.",
          correct: "now",
          verb: "opens",
          feedback: "✨ Now! 'OPENS' is happening right now!"
        },
        {
          id: "q4",
          text: "Alice opened the door.",
          correct: "yesterday",
          verb: "opened",
          feedback: "✨ Yesterday! 'OPENED' has -ed for the past!"
        },
        {
          id: "q5",
          text: "The Rabbit has a clock.",
          correct: "now",
          verb: "has",
          feedback: "✨ Now! 'HAS' is today!"
        },
        {
          id: "q6",
          text: "The Rabbit had a clock.",
          correct: "yesterday",
          verb: "had",
          feedback: "✨ Yesterday! 'HAD' means in the past!"
        }
      ]
    },

    // =========================================================================
    // SCREEN 3: THE PAST SIMPLE MACHINE (Transformation)
    // =========================================================================
    screen3: {
      title: "THE PAST SIMPLE MACHINE",
      subtitle: "Drop a present word into the machine. Watch it change to yesterday!",
      conceptBanner: "Yesterday words change! Notice the regular (+ed) and special irregular changes!",
      verbs: [
        {
          id: "v-go",
          base: "GO",
          past: "WENT",
          type: "irregular",
          icon: "🐇",
          example: "Yesterday, Alice WENT to Wonderland.",
          audio: "Go becomes went! Alice went to Wonderland."
        },
        {
          id: "v-see",
          base: "SEE",
          past: "SAW",
          type: "irregular",
          icon: "👁️",
          example: "Yesterday, Alice SAW the White Rabbit.",
          audio: "See becomes saw! Alice saw the Rabbit."
        },
        {
          id: "v-open",
          base: "OPEN",
          past: "OPENED",
          type: "regular",
          icon: "🚪",
          example: "Yesterday, Alice OPENED the door.",
          audio: "Open becomes opened! Alice opened the door."
        },
        {
          id: "v-find",
          base: "FIND",
          past: "FOUND",
          type: "irregular",
          icon: "🗝️",
          example: "Yesterday, Alice FOUND a key.",
          audio: "Find becomes found! Alice found a key."
        },
        {
          id: "v-meet",
          base: "MEET",
          past: "MET",
          type: "irregular",
          icon: "🎩",
          example: "Yesterday, Alice MET the Hatter.",
          audio: "Meet becomes met! Alice met the Hatter."
        },
        {
          id: "v-have",
          base: "HAVE",
          past: "HAD",
          type: "irregular",
          icon: "🕰️",
          example: "The Rabbit HAD a pocket watch.",
          audio: "Have becomes had! The Rabbit had a pocket watch."
        },
        {
          id: "v-eat",
          base: "EAT",
          past: "ATE",
          type: "irregular",
          icon: "🍰",
          example: "Alice ATE a Wonderland mushroom.",
          audio: "Eat becomes ate! Alice ate a mushroom."
        },
        {
          id: "v-drink",
          base: "DRINK",
          past: "DRANK",
          type: "irregular",
          icon: "☕",
          example: "Alice DRANK hot tea.",
          audio: "Drink becomes drank! Alice drank hot tea."
        },
        {
          id: "v-play",
          base: "PLAY",
          past: "PLAYED",
          type: "regular",
          icon: "🃏",
          example: "Alice PLAYED with card soldiers.",
          audio: "Play becomes played! Alice played with card soldiers."
        },
        {
          id: "v-look",
          base: "LOOK",
          past: "LOOKED",
          type: "regular",
          icon: "👀",
          example: "The Queen LOOKED at Alice.",
          audio: "Look becomes looked! The Queen looked at Alice."
        }
      ]
    },

    // =========================================================================
    // SCREEN 4: BUILD ALICE'S STORY (Sequencing)
    // =========================================================================
    screen4: {
      title: "BUILD ALICE'S STORY",
      subtitle: "Tap the pictures in the correct order to recreate Alice's adventure!",
      correctOrder: ["seq-went", "seq-saw", "seq-opened", "seq-found", "seq-met", "seq-drank"],
      cards: [
        {
          id: "seq-went",
          order: 1,
          icon: "🐇",
          title: "Went to Wonderland",
          sentence: "1. Alice went to Wonderland.",
          clue: "Down the rabbit hole!",
          audio: "Number one: Alice went to Wonderland."
        },
        {
          id: "seq-saw",
          order: 2,
          icon: "👁️",
          title: "Saw the Rabbit",
          sentence: "2. Alice saw the Rabbit.",
          clue: "White Rabbit running by!",
          audio: "Number two: Alice saw the Rabbit."
        },
        {
          id: "seq-opened",
          order: 3,
          icon: "🚪",
          title: "Opened the door",
          sentence: "3. Alice opened the door.",
          clue: "The little door in the tree!",
          audio: "Number three: Alice opened the door."
        },
        {
          id: "seq-found",
          order: 4,
          icon: "🗝️",
          title: "Found a key",
          sentence: "4. Alice found a key.",
          clue: "A shiny golden key!",
          audio: "Number four: Alice found a key."
        },
        {
          id: "seq-met",
          order: 5,
          icon: "🎩",
          title: "Met the Hatter",
          sentence: "5. Alice met the Hatter.",
          clue: "Mad Hatter at the table!",
          audio: "Number five: Alice met the Hatter."
        },
        {
          id: "seq-drank",
          order: 6,
          icon: "☕",
          title: "Drank tea",
          sentence: "6. Alice drank tea.",
          clue: "Delicious hot Wonderland tea!",
          audio: "Number six: Alice drank tea."
        }
      ]
    },

    // =========================================================================
    // SCREEN 5: COMPLETE THE MAGIC SENTENCE
    // =========================================================================
    screen5: {
      title: "COMPLETE THE MAGIC SENTENCE",
      subtitle: "Choose the correct past word to complete each magical story sentence!",
      challenges: [
        {
          id: "c1",
          icon: "🐇",
          sentenceStart: "Alice",
          sentenceEnd: "to Wonderland.",
          fullText: "Alice WENT to Wonderland.",
          choices: ["GO", "WENT", "GOES"],
          correct: "WENT",
          levelBHint: "Yesterday, Alice ______ to Wonderland."
        },
        {
          id: "c2",
          icon: "👁️",
          sentenceStart: "Alice",
          sentenceEnd: "the Rabbit.",
          fullText: "Alice SAW the Rabbit.",
          choices: ["SEE", "SAW", "SEES"],
          correct: "SAW",
          levelBHint: "Yesterday, Alice ______ the Rabbit."
        },
        {
          id: "c3",
          icon: "🚪",
          sentenceStart: "Alice",
          sentenceEnd: "the door.",
          fullText: "Alice OPENED the door.",
          choices: ["OPEN", "OPENED", "OPENS"],
          correct: "OPENED",
          levelBHint: "Yesterday, Alice ______ the door."
        },
        {
          id: "c4",
          icon: "🗝️",
          sentenceStart: "Alice",
          sentenceEnd: "a key.",
          fullText: "Alice FOUND a key.",
          choices: ["FIND", "FOUND", "FINDS"],
          correct: "FOUND",
          levelBHint: "Yesterday, Alice ______ a key."
        },
        {
          id: "c5",
          icon: "🎩",
          sentenceStart: "Alice",
          sentenceEnd: "the Hatter.",
          fullText: "Alice MET the Hatter.",
          choices: ["MEET", "MET", "MEETS"],
          correct: "MET",
          levelBHint: "Yesterday, Alice ______ the Hatter."
        }
      ]
    },

    // =========================================================================
    // SCREEN 6: VERB HUNT (5 Hidden Past Verbs)
    // =========================================================================
    screen6: {
      title: "WONDERLAND VERB HUNT",
      subtitle: "5 target past verbs are hiding in the enchanted forest! Tap to find them!",
      items: [
        {
          id: "hunt-went",
          verb: "WENT",
          sentence: "Yesterday, Alice WENT to Wonderland.",
          x: 22,
          y: 68,
          icon: "🐇",
          clue: "Near the mossy rabbit hole roots!"
        },
        {
          id: "hunt-saw",
          verb: "SAW",
          sentence: "Yesterday, Alice SAW the White Rabbit.",
          x: 42,
          y: 28,
          icon: "👁️",
          clue: "Up on the glowing tree branch!"
        },
        {
          id: "hunt-opened",
          verb: "OPENED",
          sentence: "Yesterday, Alice OPENED the door.",
          x: 75,
          y: 62,
          icon: "🚪",
          clue: "Right beside the golden keyhole door!"
        },
        {
          id: "hunt-found",
          verb: "FOUND",
          sentence: "Yesterday, Alice FOUND a key.",
          x: 52,
          y: 82,
          icon: "🗝️",
          clue: "Among the glowing red Wonderland roses!"
        },
        {
          id: "hunt-met",
          verb: "MET",
          sentence: "Yesterday, Alice MET the Hatter.",
          x: 82,
          y: 32,
          icon: "🎩",
          clue: "Behind the giant steaming teapot!"
        }
      ]
    },

    // =========================================================================
    // SCREEN 7: MAD HATTER'S STORY HAS A LIE
    // =========================================================================
    screen7: {
      title: "🎩 THE STORY HAS A LIE!",
      subtitle: "Mad Hatter is telling his story. One sentence is impossible! Find the lie!",
      hatterQuote: "Yesterday at tea time... listen to my true story! Or is it?!",
      statements: [
        { id: "s1", text: "Yesterday, Alice went to Wonderland.", isLie: false, icon: "🐇" },
        { id: "s2", text: "She saw the White Rabbit.", isLie: false, icon: "👁️" },
        { id: "s3", text: "She opened a door.", isLie: false, icon: "🚪" },
        { id: "s4", text: "She ate a hat.", isLie: true, icon: "🎩🍽️", feedback: "🤥 THAT'S THE LIE! Hats are for wearing, not for eating!" },
        { id: "s5", text: "She met the Hatter.", isLie: false, icon: "🎩" }
      ]
    },

    // =========================================================================
    // SCREEN 8: MAKE YOUR OWN LIE
    // =========================================================================
    screen8: {
      title: "MAKE YOUR OWN LIE!",
      subtitle: "Draw 3 picture cards. Tell 2 truths and 1 lie! The class will guess!",
      cardsPool: [
        { id: "c-rabbit", name: "Rabbit", icon: "🐰", sample: "I saw a rabbit." },
        { id: "c-key", name: "Key", icon: "🗝️", sample: "I found a key." },
        { id: "c-hat", name: "Hat", icon: "🎩", sample: "I wore a hat." },
        { id: "c-clock", name: "Clock", icon: "🕰️", sample: "I had a clock." },
        { id: "c-tea", name: "Tea", icon: "☕", sample: "I drank hot tea." },
        { id: "c-cake", name: "Cake", icon: "🍰", sample: "I ate delicious cake." },
        { id: "c-door", name: "Door", icon: "🚪", sample: "I opened a door." },
        { id: "c-queen", name: "Queen", icon: "👑", sample: "I saw the Queen." },
        { id: "c-rose", name: "Rose", icon: "🌹", sample: "I painted a rose." },
        { id: "c-dragon", name: "Dragon", icon: "🐉", sample: "I saw a dragon." }
      ],
      supportFrames: {
        levelA: [
          "I saw ______.",
          "I found ______.",
          "I ate ______."
        ],
        levelB: [
          "Yesterday, I saw ______.",
          "Then, I found ______.",
          "And yesterday, I ate ______."
        ]
      }
    },

    // =========================================================================
    // SCREEN 9: ACT THE PAST (TPR Theatre)
    // =========================================================================
    screen9: {
      title: "🎭 ACT THE PAST!",
      subtitle: "Grammar into physical theatre! Stand up and perform each past action!",
      actions: [
        {
          character: "ALICE",
          verb: "WENT",
          cue: "Walk proudly in place!",
          prompt: "ALICE + WENT",
          icon: "👧🚶‍♀️",
          speech: "Alice went to Wonderland! Stand up and walk!"
        },
        {
          character: "WHITE RABBIT",
          verb: "RAN",
          cue: "Run fast in place holding your pocket watch!",
          prompt: "RABBIT + RAN",
          speech: "Rabbit ran fast! Run, run, run!"
        },
        {
          character: "ALICE",
          verb: "SAW",
          cue: "Make hands like binoculars and look left and right!",
          prompt: "ALICE + SAW",
          speech: "Alice saw the Rabbit! Look through your binoculars!"
        },
        {
          character: "ALICE",
          verb: "OPENED",
          cue: "Turn the heavy golden key and push open the door!",
          prompt: "ALICE + OPENED",
          speech: "Alice opened the door! Turn the key and push!"
        },
        {
          character: "ALICE",
          verb: "FOUND",
          cue: "Reach down, pick up a shiny key, and hold it high!",
          prompt: "ALICE + FOUND",
          speech: "Alice found a key! Reach down and hold it up!"
        },
        {
          character: "MAD HATTER",
          verb: "DRANK",
          cue: "Lift your pinky finger high and sip your royal tea!",
          prompt: "HATTER + DRANK",
          speech: "Hatter drank tea! Pinky up and sip!"
        },
        {
          character: "RED QUEEN",
          verb: "LOOKED",
          cue: "Hands on your hips, make a stern royal face!",
          prompt: "QUEEN + LOOKED",
          speech: "Queen looked around! Hands on hips and royal frown!"
        }
      ]
    },

    // =========================================================================
    // SCREEN 10: WHAT HAPPENED IN WONDERLAND? (Detective Board)
    // =========================================================================
    screen10: {
      title: "🕵️ WHAT HAPPENED IN WONDERLAND?",
      subtitle: "Examine the clue photos. Choose the correct past verb to solve the case!",
      clues: [
        {
          id: "det1",
          photo: "🐇",
          label: "Clue 1: Rabbit Hole",
          sentence: "Alice ______ to Wonderland.",
          options: ["went", "go"],
          correct: "went",
          feedback: "Alice WENT to Wonderland!"
        },
        {
          id: "det2",
          photo: "👁️",
          label: "Clue 2: Pocket Watch",
          sentence: "She ______ the Rabbit.",
          options: ["saw", "see"],
          correct: "saw",
          feedback: "She SAW the Rabbit!"
        },
        {
          id: "det3",
          photo: "🚪",
          label: "Clue 3: Keyhole Door",
          sentence: "She ______ a door.",
          options: ["opened", "open"],
          correct: "opened",
          feedback: "She OPENED a door!"
        },
        {
          id: "det4",
          photo: "🗝️",
          label: "Clue 4: Golden Key",
          sentence: "She ______ a key.",
          options: ["found", "find"],
          correct: "found",
          feedback: "She FOUND a key!"
        },
        {
          id: "det5",
          photo: "🎩",
          label: "Clue 5: Tea Party Table",
          sentence: "She ______ the Hatter.",
          options: ["met", "meet"],
          correct: "met",
          feedback: "She MET the Hatter!"
        }
      ]
    },

    // =========================================================================
    // SCREEN 11: PAST SIMPLE BOSS BATTLE
    // =========================================================================
    screen11: {
      title: "⏰ BEAT THE TIME MONSTER!",
      subtitle: "The friendly Time Monster is spinning the clock out of control! Answer with the past word to save time!",
      totalGems: 7,
      rounds: [
        { base: "GO", icon: "🐇", options: ["WENT", "GOED", "GOING"], correct: "WENT" },
        { base: "SEE", icon: "👁️", options: ["SAW", "SEED", "SEEN"], correct: "SAW" },
        { base: "OPEN", icon: "🚪", options: ["OPENED", "OPENT", "OPENS"], correct: "OPENED" },
        { base: "FIND", icon: "🗝️", options: ["FOUND", "FINDED", "FOUNDS"], correct: "FOUND" },
        { base: "MEET", icon: "🎩", options: ["MET", "MEETED", "METS"], correct: "MET" },
        { base: "HAVE", icon: "🕰️", options: ["HAD", "HAVED", "HAS"], correct: "HAD" },
        { base: "DRINK", icon: "☕", options: ["DRANK", "DRINKED", "DRONK"], correct: "DRANK" }
      ]
    },

    // =========================================================================
    // SCREEN 12: FINAL STORY CHALLENGE (Oral Storytelling)
    // =========================================================================
    screen12: {
      title: "📖 FINAL STORY CHALLENGE",
      subtitle: "Look at the story path. Tell Alice's adventure out loud!",
      pathItems: [
        { icon: "🐇", label: "Rabbit", prompt: "Alice went..." },
        { icon: "👁️", label: "Saw", prompt: "She saw..." },
        { icon: "🚪", label: "Door", prompt: "She opened..." },
        { icon: "🗝️", label: "Key", prompt: "She found..." },
        { icon: "🎩", label: "Hatter", prompt: "She met..." },
        { icon: "☕", label: "Tea", prompt: "She drank..." }
      ],
      sentenceStarters: [
        "Yesterday...",
        "Alice went to Wonderland.",
        "She saw the White Rabbit.",
        "She opened the door.",
        "She found a golden key.",
        "She met the Mad Hatter.",
        "She drank hot tea."
      ]
    },

    // =========================================================================
    // SCREEN 13: THEATRE CONNECTION
    // =========================================================================
    screen13: {
      title: "🎭 OUR STORY USES THE PAST!",
      subtitle: "In our classroom play, every character tells what happened in the past!",
      characters: [
        { name: "ALICE", line: "I went to Wonderland.", icon: "👧", color: "#0284c7" },
        { name: "WHITE RABBIT", line: "I saw Alice.", icon: "🐇", color: "#d97706" },
        { name: "MAD HATTER", line: "I made tea.", icon: "🎩", color: "#059669" },
        { name: "RED QUEEN", line: "I saw Alice.", icon: "👑", color: "#dc2626" },
        { name: "CHESHIRE CAT", line: "I helped Alice.", icon: "😺", color: "#7c3aed" },
        { name: "CARD SOLDIERS", line: "We followed the Queen.", icon: "🃏", color: "#b91c1c" }
      ],
      callToAction: "Next lesson: YOU will tell and act the story on stage!"
    },

    // =========================================================================
    // SCREEN 14: WORKSHOP TEASER
    // =========================================================================
    screen14: {
      title: "🧰 THE MYSTERIOUS WORKSHOP CHEST",
      subtitle: "The chest is waiting for our craft workshop! Can you see the prop silhouettes?",
      leadText: "Something is waiting inside...",
      props: [
        { name: "Mad Hatter Hat", icon: "🎩" },
        { name: "Rabbit Ears", icon: "🐰" },
        { name: "Royal Crown", icon: "👑" },
        { name: "Golden Key", icon: "🗝️" },
        { name: "Pocket Watch", icon: "🕰️" },
        { name: "Ruby Heart", icon: "❤️" },
        { name: "Butterfly Wings", icon: "🦋" },
        { name: "Cheshire Smile", icon: "😺" },
        { name: "Card Soldier", icon: "🃏" }
      ],
      nextLessonTitle: "LESSON 3: WE ARE THE STORY!",
      workshopTeaser: "After Lesson 3: THE CLASSROOM PROP WORKSHOP! ✂️🎨"
    },

    // =========================================================================
    // FINAL CELEBRATION
    // =========================================================================
    celebration: {
      title: "WONDERLAND TIME TRAVELER",
      subtitle: "You traveled to yesterday and mastered the Past Simple!",
      bonusXp: 10,
      verbsRecap: ["WENT", "SAW", "OPENED", "FOUND", "MET", "HAD", "ATE", "DRANK"],
      farewell: "See you in Wonderland for Lesson 3!"
    },

    // =========================================================================
    // TEACHER GUIDES & PEDAGOGICAL TIMING (14 SCREENS)
    // =========================================================================
    teacherGuides: {
      1: {
        timing: "00:00 – 02:30",
        objective: "Establish the time travel premise and engage students emotionally.",
        teacherScript: "Class, look at the giant Victorian clock! Today we are time travelers. Something exciting happened yesterday in Wonderland! Count down with me: 3... 2... 1... WHOOSH!",
        studentAction: "Count down together out loud, making spinning clock motions with fingers.",
        boardTip: "Tap START THE TIME MACHINE to trigger the reverse clock spin."
      },
      2: {
        timing: "02:30 – 05:00",
        objective: "Differentiate NOW vs YESTERDAY in simple affirmative sentences.",
        teacherScript: "Listen carefully: 'Alice is in Wonderland.' Is that NOW or YESTERDAY? Tap the portal! Now listen: 'Alice went to Wonderland.' YESTERDAY!",
        studentAction: "Point to the blue portal for NOW, yellow portal for YESTERDAY.",
        boardTip: "Invite two volunteers to tap the left and right portal buttons."
      },
      3: {
        timing: "05:00 – 08:00",
        objective: "Recognize that 'yesterday words change' and identify regular vs irregular past forms.",
        teacherScript: "Watch the Past Simple Machine! When GO goes in, WENT comes out! Yesterday words change! Regular words add -ed, like OPENED. Special words change completely, like WENT.",
        studentAction: "Chant: 'GO ➔ WENT! SEE ➔ SAW! OPEN ➔ OPENED!'",
        boardTip: "Tap each verb to see gears turn and hear pronunciation."
      },
      4: {
        timing: "08:00 – 11:30",
        objective: "Sequence 6 chronological story events using Past Simple.",
        teacherScript: "What happened first? Did Alice drink tea first, or did she go to Wonderland? Let's drag the cards into the right story order!",
        studentAction: "Hold up fingers 1 to 6 to vote on the next story step.",
        boardTip: "Students can tap cards directly to lock them into sequence."
      },
      5: {
        timing: "11:30 – 14:30",
        objective: "Select correct past simple forms among present/past distractors.",
        teacherScript: "Look at the blank: 'Alice ______ to Wonderland.' Is it GO, WENT, or GOES? WENT!",
        studentAction: "Call out the past verb loudly before the board is tapped.",
        boardTip: "Toggle Level A (choices) or Level B (oral challenge) in the top HUD."
      },
      6: {
        timing: "14:30 – 17:00",
        objective: "Scan the Wonderland environment to find 5 core past verbs.",
        teacherScript: "Time detectives, look at the forest! Where is the word WENT hiding? Where is SAW? Tap when you see them!",
        studentAction: "Raise hand and point to where the hidden cards are on the Smart Board.",
        boardTip: "Tapping each card plays a chime and reads the full model sentence."
      },
      7: {
        timing: "17:00 – 20:00",
        objective: "Critical listening and meaning verification (Two Truths & One Lie).",
        teacherScript: "The Mad Hatter is telling a story. But he loves silly jokes! Four things really happened, but one is a LIE! Did Alice eat a hat?!",
        studentAction: "Shake heads and shout: 'LIE! SHE ATE A HAT IS A LIE!'",
        boardTip: "Tap the lie card to trigger the Mad Hatter's comic reaction."
      },
      8: {
        timing: "20:00 – 23:00",
        objective: "Spoken production of 2 truths and 1 lie using picture prompts.",
        teacherScript: "Now it's your turn! Student volunteer, pick 3 cards and tell us 3 sentences. Class, vote: TRUE or LIE?",
        studentAction: "Thumbs up for TRUE, cross arms for LIE.",
        boardTip: "Use the REROLL button to give multiple students turns."
      },
      9: {
        timing: "23:00 – 26:00",
        objective: "Physical TPR theatre associating past verbs with dynamic movement.",
        teacherScript: "Everybody stand up! Physical theatre rehearsal! When I say ALICE + WENT, we walk! RABBIT + RAN, run fast!",
        studentAction: "Perform all 7 physical actions enthusiastically.",
        boardTip: "Advance to the next action using the NEXT ACTION button."
      },
      10: {
        timing: "26:00 – 28:30",
        objective: "Detective consolidation of target past simple affirmative sentences.",
        teacherScript: "Our detective board has 5 mystery clues. Help me write the report! 'Alice WENT to Wonderland.' Case solved!",
        studentAction: "Say each completed sentence chorally.",
        boardTip: "Tap the correct verb button on each clue card."
      },
      11: {
        timing: "28:30 – 31:00",
        objective: "Gamified retrieval drill against the Time Monster.",
        teacherScript: "Quick! The Time Monster is spinning the clock! What is the past of GO? WENT! What is the past of SEE? SAW! We did it!",
        studentAction: "Chant answers rapidly to defeat the monster.",
        boardTip: "Watch the 7 health gems extinguish as questions are answered."
      },
      12: {
        timing: "31:00 – 32:30",
        objective: "Connected oral storytelling without written scaffolding.",
        teacherScript: "Look at the 6 pictures: Rabbit, Saw, Door, Key, Hatter, Tea. Who can tell the whole story of yesterday?",
        studentAction: "Individual students tell 1–2 sentences connecting the story.",
        boardTip: "Tap cards to trigger audio reminder if a student gets stuck."
      },
      13: {
        timing: "32:30 – 33:45",
        objective: "Connect past simple structures directly to the upcoming play.",
        teacherScript: "Look at our characters on stage! In our play, every actor speaks in the past! In Lesson 3, YOU will take the stage!",
        studentAction: "Echo the character lines in character voices.",
        boardTip: "Tap each character to hear their theatre line."
      },
      14: {
        timing: "33:45 – 35:00",
        objective: "Preview Lesson 3 and the classroom prop workshop.",
        teacherScript: "The workshop chest is waiting! In our next lesson, we practice our play, and then we make our real props!",
        studentAction: "Cheer and applaud their time travel achievement.",
        boardTip: "Tap COMPLETE LESSON 2 to claim the +10 XP reward."
      }
    }
  };

  root.TIME_MACHINE_DATA = TIME_MACHINE_DATA;

})(typeof window !== 'undefined' ? window : global);
