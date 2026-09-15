/**
 * WONDERLAND STORY STRUCTURED DATA & PEDAGOGICAL CONTENT
 * Grade 3 A1 Mini-Unit • Lesson 3: We Are the Wonderland Story!
 */

(function(root) {
  'use strict';

  const WONDERLAND_STORY_DATA = {
    lesson: {
      number: 3,
      title: "We Are the Wonderland Story!",
      grade: "Grade 3",
      level: "CEFR A1",
      durationMinutes: 35,
      unitContext: "Lesson 3 of 3 • Theatre & Storytelling Capstone preparing for the Classroom Prop Workshop"
    },

    // =========================================================================
    // SCREEN 1: WELCOME BACK TO WONDERLAND
    // =========================================================================
    screen1: {
      title: "WE ARE THE WONDERLAND STORY!",
      subtitle: "Today YOU become the characters!",
      leadPrompt: "Step through the golden door. Are you ready to act and tell the story?",
      btnEnter: "ENTER WONDERLAND ➔",
      readyPrompt: "Class, are you ready to become Wonderland actors?",
      readyOptions: [
        { id: "ready-yes", text: "YES! 🌟", speech: "Yes! We are ready!" },
        { id: "ready-maybe", text: "MAYBE! 🤔", speech: "Maybe, let's try!" },
        { id: "ready-go", text: "LET'S GO! 🚀", speech: "Let's go! Into Wonderland!" }
      ]
    },

    // =========================================================================
    // SCREEN 2: QUICK MEMORY CHALLENGE
    // =========================================================================
    screen2: {
      title: "QUICK MEMORY CHALLENGE",
      subtitle: "Who or what is this? Tap the matching name!",
      questions: [
        {
          id: "mem1",
          name: "WHITE RABBIT",
          icon: "🐇",
          audioPrompt: "White Rabbit",
          question: "Who is this?",
          choices: ["ALICE", "WHITE RABBIT", "MAD HATTER"],
          correct: "WHITE RABBIT"
        },
        {
          id: "mem2",
          name: "MAD HATTER",
          icon: "🎩",
          audioPrompt: "Mad Hatter",
          question: "Who is this?",
          choices: ["CHESHIRE CAT", "MAD HATTER", "RED QUEEN"],
          correct: "MAD HATTER"
        },
        {
          id: "mem3",
          name: "GOLDEN KEY",
          icon: "🗝️",
          audioPrompt: "Golden Key",
          question: "What is this?",
          choices: ["GOLDEN KEY", "POCKET WATCH", "TEACUP"],
          correct: "GOLDEN KEY"
        },
        {
          id: "mem4",
          name: "RED QUEEN",
          icon: "👑",
          audioPrompt: "Red Queen",
          question: "Who is this?",
          choices: ["ALICE", "MARCH HARE", "RED QUEEN"],
          correct: "RED QUEEN"
        },
        {
          id: "mem5",
          name: "POCKET WATCH",
          icon: "🕰️",
          audioPrompt: "White Rabbit's Watch",
          question: "What is this?",
          choices: ["POCKET WATCH", "GOLDEN KEY", "PLAYING CARD"],
          correct: "POCKET WATCH"
        }
      ]
    },

    // =========================================================================
    // SCREEN 3: WHAT HAPPENED? (Illustrated Sequencing)
    // =========================================================================
    screen3: {
      title: "WHAT HAPPENED?",
      subtitle: "Put the story in order! Drag or tap the 4 scenes into slots 1 to 4!",
      correctOrder: ["wh-saw", "wh-followed", "wh-opened", "wh-found"],
      scenes: [
        {
          id: "wh-saw",
          icon: "🐇",
          title: "Alice saw the White Rabbit.",
          verb: "SAW",
          sentence: "1. Alice saw the White Rabbit.",
          audio: "Number one: Alice saw the White Rabbit."
        },
        {
          id: "wh-followed",
          icon: "🏃‍♀️",
          title: "Alice followed the Rabbit.",
          verb: "FOLLOWED",
          sentence: "2. Alice followed the Rabbit.",
          audio: "Number two: Alice followed the Rabbit."
        },
        {
          id: "wh-opened",
          icon: "🚪",
          title: "Alice opened a door.",
          verb: "OPENED",
          sentence: "3. Alice opened a door.",
          audio: "Number three: Alice opened a door."
        },
        {
          id: "wh-found",
          icon: "🌸",
          title: "Alice found Wonderland.",
          verb: "FOUND",
          sentence: "4. Alice found Wonderland.",
          audio: "Number four: Alice found Wonderland."
        }
      ]
    },

    // =========================================================================
    // SCREEN 4: BUILD THE STORY (Interactive Story Builder)
    // =========================================================================
    screen4: {
      title: "BUILD THE STORY",
      subtitle: "Choose 4 or 5 cards to build your own Wonderland timeline!",
      cards: [
        { id: "b-alice", name: "Alice", icon: "👧", verb: "went", phrase: "Alice went to Wonderland." },
        { id: "b-rabbit", name: "Rabbit", icon: "🐇", verb: "saw", phrase: "She saw the White Rabbit." },
        { id: "b-key", name: "Key", icon: "🗝️", verb: "found", phrase: "She found a golden key." },
        { id: "b-door", name: "Door", icon: "🚪", verb: "opened", phrase: "She opened the little door." },
        { id: "b-wonderland", name: "Wonderland", icon: "✨", verb: "entered", phrase: "She entered magical Wonderland." },
        { id: "b-hatter", name: "Mad Hatter", icon: "🎩", verb: "met", phrase: "She met the Mad Hatter." },
        { id: "b-teaparty", name: "Tea Party", icon: "☕", verb: "drank", phrase: "They drank hot tea together." },
        { id: "b-queen", name: "Red Queen", icon: "👑", verb: "looked", phrase: "The Red Queen looked at her." }
      ]
    },

    // =========================================================================
    // SCREEN 5: CHARACTER VOICE CHALLENGE
    // =========================================================================
    screen5: {
      title: "WHO ARE YOU?",
      subtitle: "Choose your character. Practice your lines with Listen 🔊, Say 🎤, and Act 🎭!",
      characters: [
        {
          id: "char-alice",
          name: "ALICE",
          icon: "👧",
          badgeColor: "#0284c7",
          lines: [
            "I saw the Rabbit!",
            "I followed him!",
            "I found Wonderland!"
          ],
          actionPrompt: "Look around with curious wide eyes!",
          pitch: 1.15
        },
        {
          id: "char-rabbit",
          name: "WHITE RABBIT",
          icon: "🐇",
          badgeColor: "#d97706",
          lines: [
            "I was late!",
            "Come with me!"
          ],
          actionPrompt: "Tap your watch and run on your toes!",
          pitch: 1.35
        },
        {
          id: "char-hatter",
          name: "MAD HATTER",
          icon: "🎩",
          badgeColor: "#059669",
          lines: [
            "Welcome!",
            "Have some tea!"
          ],
          actionPrompt: "Tip your hat and bow with a laugh!",
          pitch: 1.05
        },
        {
          id: "char-hare",
          name: "MARCH HARE",
          icon: "🐰",
          badgeColor: "#b45309",
          lines: [
            "Tea time!",
            "Sit down!"
          ],
          actionPrompt: "Pull up an imaginary chair excitedly!",
          pitch: 1.25
        },
        {
          id: "char-cheshire",
          name: "CHESHIRE CAT",
          icon: "😺",
          badgeColor: "#7c3aed",
          lines: [
            "Hello!",
            "Look here!"
          ],
          actionPrompt: "Make a huge wide grin with your hands!",
          pitch: 1.1
        },
        {
          id: "char-queen",
          name: "RED QUEEN",
          icon: "👑",
          badgeColor: "#dc2626",
          lines: [
            "Where is my crown?",
            "Find it!"
          ],
          actionPrompt: "Hands on hips and stomp your royal foot!",
          pitch: 0.95
        }
      ]
    },

    // =========================================================================
    // SCREEN 6: FREEZE FRAME THEATRE
    // =========================================================================
    screen6: {
      title: "FREEZE FRAME THEATRE!",
      subtitle: "Dance while the music plays. When it stops: FREEZE LIKE THE PICTURE!",
      scenes: [
        {
          id: "fz1",
          title: "Alice falls into Wonderland!",
          sentence: "Alice fell into Wonderland.",
          icon: "🌀👧",
          pose: "Tumble gracefully with arms floating!",
          speech: "Alice fell into Wonderland."
        },
        {
          id: "fz2",
          title: "White Rabbit is running!",
          sentence: "The Rabbit ran fast.",
          icon: "🐇💨",
          pose: "Freeze mid-stride looking at your wrist!",
          speech: "The White Rabbit ran fast."
        },
        {
          id: "fz3",
          title: "Mad Hatter's Tea Party!",
          sentence: "They had tea together.",
          icon: "🎩☕",
          pose: "Freeze with tea cup held high and pinky up!",
          speech: "They had tea together."
        },
        {
          id: "fz4",
          title: "The Red Queen's Garden!",
          sentence: "The Queen looked angry.",
          icon: "👑🌹",
          pose: "Freeze pointing a finger sternly!",
          speech: "The Red Queen looked angry."
        },
        {
          id: "fz5",
          title: "Cheshire Cat appears!",
          sentence: "The Cat smiled in the tree.",
          icon: "😺🌳",
          pose: "Freeze with huge paw hands and giant smile!",
          speech: "The Cat smiled in the tree."
        },
        {
          id: "fz6",
          title: "Alice meets the characters!",
          sentence: "Alice met all the friends.",
          icon: "👧✨",
          pose: "Wave with both hands in amazement!",
          speech: "Alice met all the friends."
        }
      ]
    },

    // =========================================================================
    // SCREEN 7: CREATE OUR MINI SCENE
    // =========================================================================
    screen7: {
      title: "CREATE YOUR WONDERLAND SCENE!",
      subtitle: "Select a setting, actors, and actions for your classroom drama scene!",
      presets: [
        {
          id: "sc-teaparty",
          name: "THE TEA PARTY",
          icon: "🎩",
          availableCharacters: ["Mad Hatter", "March Hare", "Alice"],
          availableProps: ["Hat", "Tea Cup", "Teapot"],
          actions: ["sit", "drink", "eat", "look", "talk"],
          sentenceCards: [
            "Alice came to the tea party.",
            "They drank tea.",
            "The Hatter looked at Alice.",
            "They had a funny tea party."
          ]
        },
        {
          id: "sc-rabbithole",
          name: "THE RABBIT HOLE",
          icon: "🕳️",
          availableCharacters: ["Alice", "White Rabbit"],
          availableProps: ["Pocket Watch", "Golden Key", "Rabbit Ears"],
          actions: ["run", "fall", "see", "follow"],
          sentenceCards: [
            "Alice saw the White Rabbit.",
            "The Rabbit ran fast.",
            "Alice followed the Rabbit.",
            "She fell down the hole."
          ]
        },
        {
          id: "sc-garden",
          name: "THE RED QUEEN'S GARDEN",
          icon: "❤️",
          availableCharacters: ["Red Queen", "Alice", "Card Soldier"],
          availableProps: ["Royal Crown", "Ruby Heart", "Card Soldier"],
          actions: ["bow", "look", "shout", "march"],
          sentenceCards: [
            "Alice met the Red Queen.",
            "The Queen had ruby hearts.",
            "Card soldiers marched together.",
            "The Queen looked at Alice."
          ]
        },
        {
          id: "sc-door",
          name: "THE MYSTERIOUS DOOR",
          icon: "🚪",
          availableCharacters: ["Alice", "Cheshire Cat"],
          availableProps: ["Golden Key", "Cat Mask", "Wonderland Signs"],
          actions: ["find", "turn key", "open", "smile"],
          sentenceCards: [
            "Alice found a shiny golden key.",
            "She opened the tiny door.",
            "The Cheshire Cat smiled.",
            "Alice entered Wonderland."
          ]
        }
      ]
    },

    // =========================================================================
    // SCREEN 8: MINI SCRIPT BUILDER
    // =========================================================================
    screen8: {
      title: "MINI SCRIPT BUILDER",
      subtitle: "Here is your group's rehearsal script! Practice reading your lines aloud!",
      scripts: {
        "sc-teaparty": [
          { speaker: "ALICE", line: "Hello!", speech: "Hello!" },
          { speaker: "MAD HATTER", line: "Welcome to my tea party!", speech: "Welcome to my tea party!" },
          { speaker: "MARCH HARE", line: "Sit down! Have some tea!", speech: "Sit down! Have some tea!" },
          { speaker: "ALICE", line: "Thank you! I found your table!", speech: "Thank you! I found your table!" },
          { speaker: "MAD HATTER", line: "We had tea and cake!", speech: "We had tea and cake!" },
          { speaker: "EVERYONE", line: "Welcome to Wonderland!", speech: "Welcome to Wonderland!" }
        ],
        "sc-rabbithole": [
          { speaker: "WHITE RABBIT", line: "I am late! I am late!", speech: "I am late! I am late!" },
          { speaker: "ALICE", line: "Wait! Where are you going?", speech: "Wait! Where are you going?" },
          { speaker: "WHITE RABBIT", line: "Follow me to Wonderland!", speech: "Follow me to Wonderland!" },
          { speaker: "ALICE", line: "I went down the rabbit hole!", speech: "I went down the rabbit hole!" },
          { speaker: "EVERYONE", line: "Welcome to Wonderland!", speech: "Welcome to Wonderland!" }
        ],
        "sc-garden": [
          { speaker: "CARD SOLDIER", line: "Make way for the Queen!", speech: "Make way for the Queen!" },
          { speaker: "RED QUEEN", line: "Who is this girl?", speech: "Who is this girl?" },
          { speaker: "ALICE", line: "My name is Alice! I opened the door.", speech: "My name is Alice! I opened the door." },
          { speaker: "RED QUEEN", line: "I saw you! Paint the roses red!", speech: "I saw you! Paint the roses red!" },
          { speaker: "EVERYONE", line: "Welcome to Wonderland!", speech: "Welcome to Wonderland!" }
        ],
        "sc-door": [
          { speaker: "ALICE", line: "Look! A tiny door in the tree!", speech: "Look! A tiny door in the tree!" },
          { speaker: "CHESHIRE CAT", line: "Hello Alice! Look at my smile!", speech: "Hello Alice! Look at my smile!" },
          { speaker: "ALICE", line: "I found the golden key!", speech: "I found the golden key!" },
          { speaker: "CHESHIRE CAT", line: "You opened the door! Step inside!", speech: "You opened the door! Step inside!" },
          { speaker: "EVERYONE", line: "Welcome to Wonderland!", speech: "Welcome to Wonderland!" }
        ]
      }
    },

    // =========================================================================
    // SCREEN 9: PROP CONNECTION
    // =========================================================================
    screen9: {
      title: "THE STORY NEEDS PROPS!",
      subtitle: "The Workshop Chest is open! Tap the props your scene needs for the play!",
      allProps: [
        { id: "p-hat", name: "Mad Hatter Hat", icon: "🎩", scene: "sc-teaparty" },
        { id: "p-ears", name: "Rabbit Ears", icon: "🐇", scene: "sc-rabbithole" },
        { id: "p-watch", name: "Rabbit Watch", icon: "⌚", scene: "sc-rabbithole" },
        { id: "p-card", name: "Card Soldier", icon: "🃏", scene: "sc-garden" },
        { id: "p-key", name: "Golden Key", icon: "🔑", scene: "sc-door" },
        { id: "p-teacup", name: "Tea Cup", icon: "☕", scene: "sc-teaparty" },
        { id: "p-heart", name: "Red Queen Hearts", icon: "❤️", scene: "sc-garden" },
        { id: "p-crown", name: "Royal Crown", icon: "👑", scene: "sc-garden" },
        { id: "p-catmask", name: "Cheshire Cat Mask", icon: "🐱", scene: "sc-door" },
        { id: "p-wings", name: "Butterfly Wings", icon: "🦋", scene: "sc-door" },
        { id: "p-signs", name: "Wonderland Signs", icon: "➡️", scene: "sc-rabbithole" }
      ]
    },

    // =========================================================================
    // SCREEN 10: FINAL PERFORMANCE CHALLENGE
    // =========================================================================
    screen10: {
      title: "LIGHTS... CAMERA... WONDERLAND!",
      subtitle: "Step onto the stage! Say your sentence and perform your character!",
      promptChallenge: "Tell us what happened in Wonderland:",
      starterFrames: [
        "Alice went to Wonderland.",
        "She saw the Rabbit.",
        "She opened the door.",
        "She met the Hatter.",
        "They had tea."
      ]
    },

    // =========================================================================
    // SCREEN 11: EXIT TICKET
    // =========================================================================
    screen11: {
      title: "WHAT DID YOU LEARN TODAY?",
      subtitle: "Select all that you achieved today. Then speak your final Wonderland sentence!",
      choices: [
        { id: "ex-act", text: "🎭 I acted like a character.", icon: "🎭" },
        { id: "ex-story", text: "📖 I told a Wonderland story.", icon: "📖" },
        { id: "ex-speak", text: "🗣️ I spoke English aloud.", icon: "🗣️" },
        { id: "ex-workshop", text: "🛠️ I am ready for the workshop.", icon: "🛠️" }
      ],
      speakingStarters: [
        "Alice went...",
        "Alice saw...",
        "Alice found...",
        "Alice met...",
        "I saw...",
        "I found..."
      ]
    },

    // =========================================================================
    // FINAL CELEBRATION
    // =========================================================================
    celebration: {
      title: "WONDERLAND HERO!",
      subtitle: "You are ready for the next adventure!",
      stars: [
        { label: "STORYTELLER", icon: "📖" },
        { label: "ACTOR", icon: "🎭" },
        { label: "ENGLISH SPEAKER", icon: "🗣️" },
        { label: "INVENTOR", icon: "🛠️" }
      ],
      bonusXp: 20,
      nextStopTitle: "NEXT STOP: 🎨 WONDERLAND WORKSHOP!",
      nextStopDesc: "Now we make and decorate the props with our hands!"
    },

    // =========================================================================
    // TEACHER GUIDES & OBSERVATION RUBRIC (11 SCREENS)
    // =========================================================================
    teacherGuides: {
      1: {
        timing: "00:00 – 03:00",
        objective: "Establish theatre excitement and activate student readiness.",
        teacherScript: "Welcome back, actors! Today we don't just read the story — WE ARE THE STORY! Are you ready? Let's go!",
        studentAction: "Tap YES or LET'S GO, strike an actor pose.",
        boardTip: "Tap Enter Wonderland to begin the performance unit."
      },
      2: {
        timing: "03:00 – 07:00",
        objective: "Retrieve core characters and prop vocabulary quickly.",
        teacherScript: "Who is this? Is it Alice or the White Rabbit? Tap the correct name! Great memory!",
        studentAction: "Call out character names chorally.",
        boardTip: "Tap card to enlarge and play child-friendly audio."
      },
      3: {
        timing: "07:00 – 12:00",
        objective: "Sequence 4 story scenes and reinforce Past Simple verbs.",
        teacherScript: "What happened first? Alice SAW the White Rabbit! What happened next? Alice FOLLOWED the Rabbit!",
        studentAction: "Mime the 4 actions in order.",
        boardTip: "Tap cards in order 1 to 4 to reveal the complete timeline."
      },
      4: {
        timing: "12:00 – 17:00",
        objective: "Visually build an oral story sequence without writing pressure.",
        teacherScript: "Pick 4 cards to make our class story. Let's hear our sentence sequence!",
        studentAction: "Echo the generated sentences.",
        boardTip: "Students can tap cards to add or remove them from the timeline."
      },
      5: {
        timing: "17:00 – 22:00",
        objective: "Adopt character voices and rehearse short A1 spoken lines.",
        teacherScript: "Who wants to be the Mad Hatter? Put on your imaginary hat! Listen, say it, and ACT IT!",
        studentAction: "Use facial expressions and body language while speaking.",
        boardTip: "Switch between Listen, Say It, and Act It cues."
      },
      6: {
        timing: "22:00 – 26:00",
        objective: "Total Physical Response freeze frame drama game.",
        teacherScript: "Dance and move! When the music stops: FREEZE! Now, what happened? 'Alice fell!'",
        studentAction: "Freeze instantly when the whistle sounds.",
        boardTip: "Press START to trigger 5s music and the freeze cue."
      },
      7: {
        timing: "26:00 – 30:00",
        objective: "Select setting, characters, and actions for a collaborative mini-scene.",
        teacherScript: "Which scene should our group perform? The Tea Party or The Rabbit Hole? Let's choose!",
        studentAction: "Group discussion and voting.",
        boardTip: "Tap any preset to generate its characters and props."
      },
      8: {
        timing: "30:00 – 32:00",
        objective: "Read and rehearse a formatted A1 theatrical script.",
        teacherScript: "Look at your script! Alice says: 'Hello!' Hatter says: 'Welcome!' Let's read together!",
        studentAction: "Read lines in character turns.",
        boardTip: "Tap Listen or Slow Audio for pronunciation scaffolding."
      },
      9: {
        timing: "32:00 – 33:30",
        objective: "Connect online lesson directly to the upcoming physical prop workshop.",
        teacherScript: "What props do we need for the Tea Party? The Hat and the Tea Cup! Exactly!",
        studentAction: "Point to the matching props.",
        boardTip: "Tap matching props to equip them for the scene."
      },
      10: {
        timing: "33:30 – 34:30",
        objective: "Final oral performance on the illuminated theatre stage.",
        teacherScript: "Lights, camera, Wonderland! Tell us what happened in one sentence!",
        studentAction: "Individual students deliver their final performance line.",
        boardTip: "Give the class a big round of applause!"
      },
      11: {
        timing: "34:30 – 35:00",
        objective: "Self-assessment and transition to the physical craft workshop.",
        teacherScript: "What did you learn today? You acted, spoke English, and are ready for our workshop!",
        studentAction: "Select their self-evaluation badges.",
        boardTip: "Tap Claim Hero Rewards to conclude the mini-unit."
      }
    }
  };

  root.WONDERLAND_STORY_DATA = WONDERLAND_STORY_DATA;

})(typeof window !== 'undefined' ? window : global);
