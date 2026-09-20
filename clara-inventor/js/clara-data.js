/**
 * CLARA'S INVENTION MYSTERY & THE INVENTOR CHALLENGE
 * Pedagogical Data Model & Curriculum Content
 * Based on Reading Book 3 / Global Readings 2 (pp. 16–17)
 * Target: A1+ Young ESL Learners (2 × 35 min lessons)
 */

(function(root) {
  'use strict';

  const CLARA_DATA = {
    meta: {
      title: "Clara's Invention Mystery & The Inventor Challenge",
      unit: "Unit 1: Inventions / Inventors",
      book: "Reading Book 3 (Pages 16–17) / Global Readings 2",
      targetAge: "Ages 8–12 (A1+ Young Learners)",
      totalLessons: 2,
      lessonDurationMinutes: 35,
      pedagogy: "LOOK -> GUESS -> MOVE -> READ -> DISCOVER -> SPEAK -> BUILD -> PLAY -> CREATE"
    },

    // Badges system for 🏆 INVENTOR SCORE
    badges: [
      { id: "detective", title: "READING DETECTIVE", icon: "🔎", desc: "Found all 6 story evidence clues in Clara's text!" },
      { id: "sequence", title: "SEQUENCE MASTER", icon: "🧩", desc: "Mastered FIRST, SECOND, THIRD, and LAST!" },
      { id: "creative", title: "CREATIVE INVENTOR", icon: "💡", desc: "Designed a wacky machine to solve a classroom dilemma!" },
      { id: "speaker", title: "INVENTOR SPEAKER", icon: "🎤", desc: "Presented the 4-step sequence pitch to the class!" }
    ],

    // =========================================================================
    // LESSON 1: CLARA'S INVENTION MYSTERY (35 MIN)
    // =========================================================================
    lesson1: {
      id: "lesson1",
      title: "Lesson 1: Clara's Invention Mystery",
      tagline: "Look • Guess • Move • Read • Discover • Speak • Build",
      targetTime: "35 Minutes",
      stages: [
        { id: 1, name: "🔍 Inventor Mystery Warm-up", time: "0–5 min" },
        { id: 2, name: "🎴 What Does The Invention Do?", time: "5–10 min" },
        { id: 3, name: "🕵️ Reading Detectives", time: "10–17 min" },
        { id: 4, name: "🏃 True or False — MOVE!", time: "17–24 min" },
        { id: 5, name: "📜 Build Clara's Story", time: "24–31 min" },
        { id: 6, name: "🎨 Create Your Invention", time: "31–35 min" }
      ],

      // Activity 1: Inventor Mystery (0–5 min)
      warmup: {
        title: "Visual Invention Mystery",
        instruction: "Look at the two things! What is it? What does it do? Guess with your partner!",
        teacherLanguage: "Look! What is this? What does it do? Today, YOU are inventors!",
        combos: [
          {
            id: "combo-1",
            iconA: "🖊️",
            nameA: "PEN",
            iconB: "☂️",
            nameB: "UMBRELLA",
            invention: "The Pen Umbrella",
            clue: "You can write words AND stay dry in the rain!",
            speech: "It is a pen umbrella! It helps you write in the rain!"
          },
          {
            id: "combo-2",
            iconA: "🛏️",
            nameA: "BED / PILLOW",
            iconB: "⏰",
            nameB: "ALARM CLOCK",
            invention: "The Alarm Clock Pillow",
            clue: "You sleep on it... and it wakes you up with a song!",
            speech: "It is an alarm clock pillow! It wakes you up with music!"
          },
          {
            id: "combo-3",
            iconA: "✏️",
            nameA: "SMART",
            iconB: "🧠",
            nameB: "ERASER",
            invention: "The Smart Eraser",
            clue: "When your homework is wrong, it tells you and fixes mistakes!",
            speech: "It is a smart eraser! It tells you when your homework is wrong!"
          },
          {
            id: "combo-4",
            iconA: "🤖",
            nameA: "ROBOT",
            iconB: "🧹",
            nameB: "CLEANING",
            invention: "The Clean-up Machine",
            clue: "Mom says your room is a mess? Push a button and it cleans everything!",
            speech: "It is a clean-up machine! It cleans up messy rooms!"
          },
          {
            id: "combo-5",
            iconA: "🪞",
            nameA: "MAGIC",
            iconB: "✨",
            nameB: "MIRROR",
            invention: "The Mirror",
            clue: "It changes what you see... but wait, it doesn't work!",
            speech: "It is the mirror! It gives Clara purple hair and a long nose!"
          }
        ]
      },

      // Activity 2: What Does The Invention Do? (5–10 min)
      inventions: [
        {
          id: "pen-umbrella",
          title: "The Pen Umbrella",
          icon: "☂️🖊️",
          bookPage: "Page 16 / Page 11",
          bookQuote: "Here are my rain glasses and my umbrella pen.",
          functions: [
            "This invention is for the rain.",
            "It lets you write in the rain.",
            "It keeps your paper dry."
          ],
          primaryFunction: "This invention is for the rain.",
          clue: "It is for the rain."
        },
        {
          id: "alarm-pillow",
          title: "The Alarm Clock Pillow",
          icon: "🛏️⏰",
          bookPage: "Page 16 / Page 13",
          bookQuote: "And my alarm clock pillow wakes me with a song.",
          functions: [
            "This invention wakes Clara with a song.",
            "This invention has buttons.",
            "This invention sings a song."
          ],
          primaryFunction: "This invention sings a song.",
          clue: "It sings a song."
        },
        {
          id: "smart-eraser",
          title: "The Smart Eraser",
          icon: "✏️🔴",
          bookPage: "Page 16 / Page 13",
          bookQuote: "Here's my smart eraser. It tells me when I'm wrong.",
          functions: [
            "This invention helps Clara with her homework.",
            "It tells Clara when she is wrong.",
            "It fixes mistakes in math and English."
          ],
          primaryFunction: "This invention helps Clara with her homework.",
          clue: "It helps Clara with her homework."
        },
        {
          id: "cleanup-machine",
          title: "The Clean-up Machine",
          icon: "🧹🤖",
          bookPage: "Page 16 / Page 15",
          bookQuote: "Mom says my room's a mess... it's a big clean-up machine.",
          functions: [
            "This invention cleans.",
            "It cleans Clara's room.",
            "It sweeps and vacuums the toys and clothes."
          ],
          primaryFunction: "This invention cleans.",
          clue: "It cleans."
        },
        {
          id: "mirror",
          title: "The Mirror",
          icon: "🪞💜",
          bookPage: "Page 16 / Page 14",
          bookQuote: "This is my special mirror... Oh, no! I have long purple hair and a big long nose.",
          functions: [
            "This invention has buttons.",
            "The mirror doesn't work.",
            "It changes what Clara sees."
          ],
          primaryFunction: "This invention has buttons, but it doesn't work!",
          clue: "This invention has buttons."
        }
      ],

      // Think & Discuss (Page 16)
      thinkAndDiscuss: {
        question: "Do you think it is easy or difficult to be an inventor? Why?",
        expectedAnswer: "I think it's difficult because you have to work hard.",
        speechText: "Do you think it is easy or difficult to be an inventor? I think it is difficult because you have to work hard and try again!"
      },

      // Activity 3: Reading Detectives (10–17 min)
      readingMissions: [
        {
          id: 1,
          questionCode: "WHEN?",
          question: "When does Clara invent things?",
          page: "Page 16 Comprehension Q1",
          textChunk: "My name is Clara Doodle. I invent things after school. I have a lot of new ideas and some of them are cool.",
          sentenceHighlight: "She invents things after school.",
          expectedAnswer: "She invents things after school.",
          options: [
            { text: "She invents things before school.", isCorrect: false, hint: "Look at the time when school finishes!" },
            { text: "She invents things after school.", isCorrect: true, hint: "Correct! She invents things after school." },
            { text: "She invents things at night in bed.", isCorrect: false, hint: "She works after school in her room." }
          ],
          spokenProof: "She invents things after school."
        },
        {
          id: 2,
          questionCode: "TRY AGAIN?",
          question: "What does she do if her idea is not very good?",
          page: "Page 16 Comprehension Q2",
          textChunk: "Some ideas are not so good ... but I always try again!",
          sentenceHighlight: "She tries again.",
          expectedAnswer: "She tries again.",
          options: [
            { text: "She cries and gives up.", isCorrect: false, hint: "Inventors never give up!" },
            { text: "She buys a toy from a shop.", isCorrect: false, hint: "Clara is an inventor, she doesn't buy toys." },
            { text: "She tries again.", isCorrect: true, hint: "Super! Clara always tries again!" }
          ],
          spokenProof: "She tries again."
        },
        {
          id: 3,
          questionCode: "NEW IDEA?",
          question: "What does she do when she has a new idea?",
          page: "Page 16 Comprehension Q3",
          textChunk: "When I have an idea, I always make a plan. I draw and change, and change and draw. I do the best I can.",
          sentenceHighlight: "She makes a plan.",
          expectedAnswer: "She makes a plan.",
          options: [
            { text: "She makes a plan.", isCorrect: true, hint: "Awesome! She makes a plan and draws." },
            { text: "She forgets it quickly.", isCorrect: false, hint: "She writes it down in her notebook." },
            { text: "She calls her grandmother.", isCorrect: false, hint: "She makes a plan in her room." }
          ],
          spokenProof: "She makes a plan."
        },
        {
          id: 4,
          questionCode: "THE PROBLEM",
          question: "Why does Clara say 'Oh, no!'?",
          page: "Page 16 Comprehension Q4",
          textChunk: "This is my special mirror... But something's not quite right! Oh, no! I have long purple hair and a big long nose.",
          sentenceHighlight: "The mirror doesn't work.",
          expectedAnswer: "The mirror doesn't work.",
          options: [
            { text: "She lost her purple shoes.", isCorrect: false, hint: "Look at what happens in the mirror!" },
            { text: "The mirror doesn't work.", isCorrect: true, hint: "Yes! The mirror doesn't work!" },
            { text: "It is raining outside.", isCorrect: false, hint: "Her invention had a problem." }
          ],
          spokenProof: "The mirror doesn't work."
        },
        {
          id: 5,
          questionCode: "WHO?",
          question: "Who thinks Clara's room is a mess?",
          page: "Page 16 Comprehension Q5",
          textChunk: "Mom says my room's a mess, but I don't like to clean.",
          sentenceHighlight: "Her mom.",
          expectedAnswer: "Her mom.",
          options: [
            { text: "Her teacher.", isCorrect: false, hint: "Who says 'What a mess!' at home?" },
            { text: "Her best friend.", isCorrect: false, hint: "Think of family at home." },
            { text: "Her mom.", isCorrect: true, hint: "Spot on! Her mom thinks her room is a mess!" }
          ],
          spokenProof: "Her mom."
        },
        {
          id: 6,
          questionCode: "THE INVENTION",
          question: "What does her new invention do?",
          page: "Page 16 Comprehension Q6",
          textChunk: "Here's my new invention ... it's a big clean-up machine.",
          sentenceHighlight: "It cleans her room.",
          expectedAnswer: "It cleans her room.",
          options: [
            { text: "It plays loud music.", isCorrect: false, hint: "What does a clean-up machine do?" },
            { text: "It cleans her room.", isCorrect: true, hint: "Brilliant! It cleans her room!" },
            { text: "It flies to outer space.", isCorrect: false, hint: "It tidies up her toys and floor." }
          ],
          spokenProof: "It cleans her room."
        }
      ],

      // Activity 4: True or False — MOVE! (17–24 min)
      fourCorners: [
        {
          id: "tf-1",
          statement: "Clara invents things before school.",
          isTrue: false,
          correct: "FALSE",
          explanation: "FALSE! Clara invents things after school!",
          whyResponse: "Because she invents things AFTER school, not before school."
        },
        {
          id: "tf-2",
          statement: "Clara tries again when an idea is not very good.",
          isTrue: true,
          correct: "TRUE",
          explanation: "TRUE! Clara always tries again!",
          whyResponse: "Because good inventors never give up—she always tries again!"
        },
        {
          id: "tf-3",
          statement: "The mirror works perfectly.",
          isTrue: false,
          correct: "FALSE",
          explanation: "FALSE! The mirror doesn't work! It gave Clara purple hair and a long nose!",
          whyResponse: "Because the mirror doesn't work—it makes her look funny!"
        },
        {
          id: "tf-4",
          statement: "Clara's mom thinks her room is a mess.",
          isTrue: true,
          correct: "TRUE",
          explanation: "TRUE! Her mom thinks Clara's room is a mess!",
          whyResponse: "Because there are inventions, clothes, and papers everywhere!"
        },
        {
          id: "tf-5",
          statement: "Clara's new invention cleans her room.",
          isTrue: true,
          correct: "TRUE",
          explanation: "TRUE! Her clean-up machine cleans her room!",
          whyResponse: "Because it is a big clean-up robot that vacuums and tidies!"
        }
      ],

      // Activity 5: Build Clara's Story (24–31 min)
      storyCards: [
        { order: 1, text: "Clara invents things after school.", icon: "🏫🎒", sequenceWord: "FIRST" },
        { order: 2, text: "Clara has an idea.", icon: "💡🧠", sequenceWord: "THEN" },
        { order: 3, text: "Clara makes a plan.", icon: "📝📐", sequenceWord: "NEXT" },
        { order: 4, text: "The mirror doesn't work.", icon: "🪞❌", sequenceWord: "THEN" },
        { order: 5, text: "Clara tries again.", icon: "🔄💪", sequenceWord: "NEXT" },
        { order: 6, text: "Clara makes a clean-up machine.", icon: "🤖🧹", sequenceWord: "FINALLY" }
      ],

      // Activity 6: Create Your Invention (31–35 min)
      builderOptions: {
        combinations: [
          { name: "ROBOT + CLEANING", icon: "🤖🧹", desc: "A robot cleaner that cleans your room" },
          { name: "PEN + UMBRELLA", icon: "🖊️☂️", desc: "A pen umbrella that writes in the rain" },
          { name: "BACKPACK + ROBOT", icon: "🎒🤖", desc: "A flying backpack that carries heavy books" },
          { name: "SHOES + WINGS", icon: "👟🪽", desc: "Super shoes with wings that jump over puddles" },
          { name: "BED + ALARM", icon: "🛏️⏰", desc: "A musical alarm bed that sings to wake you up" },
          { name: "ERASER + MAGIC", icon: "✏️✨", desc: "A magic smart eraser that checks your homework" }
        ],
        sentenceFrames: [
          "My invention is a ______.",
          "It can ______."
        ]
      },

      // Phonics Mini-Activity (2–3 minutes max)
      phonicsMini: {
        title: "Quick Phonics Challenge: CL / cl-",
        time: "2–3 min",
        targetSound: "/kl/",
        instruction: "Listen to the word! Is it a CL sound or NOT CL?",
        words: [
          { word: "climb", sound: "/kl/", isCl: true, sentence: "Monkeys climb tall trees." },
          { word: "clue", sound: "/kl/", isCl: true, sentence: "The detective found a clue." },
          { word: "cloud", sound: "/kl/", isCl: true, sentence: "Look at the white cloud." },
          { word: "close", sound: "/kl/", isCl: true, sentence: "Please close the door." },
          { word: "clap", sound: "/kl/", isCl: true, sentence: "Clap your hands together!" },
          { word: "rain", sound: "/r/", isCl: false, sentence: "Rain falls from the sky." },
          { word: "book", sound: "/b/", isCl: false, sentence: "Open your reading book." },
          { word: "robot", sound: "/r/", isCl: false, sentence: "The robot has shiny gears." }
        ],
        storySearch: [
          { word: "Clara", page: "Page 16" },
          { word: "clean", page: "Page 16" },
          { word: "clothes", page: "Page 16" },
          { word: "clock", page: "Page 16" }
        ]
      }
    },

    // =========================================================================
    // LESSON 2: THE INVENTOR CHALLENGE (35 MIN)
    // =========================================================================
    lesson2: {
      id: "lesson2",
      title: "Lesson 2: The Inventor Challenge",
      tagline: "Sequence • Order • First • Second • Third • Last",
      targetTime: "35 Minutes",
      stages: [
        { id: 1, name: "💥 The Broken Invention", time: "0–5 min" },
        { id: 2, name: "📱 Human Tablet", time: "5–10 min" },
        { id: 3, name: "🧩 Sequence Builder", time: "10–15 min" },
        { id: 4, name: "💡 Inventor Process", time: "15–21 min" },
        { id: 5, name: "⏱️ Sequence Relay", time: "21–27 min" },
        { id: 6, name: "🛠️ Inventor Lab", time: "27–33 min" },
        { id: 7, name: "🏆 Inventor Presentation", time: "33–35 min" }
      ],

      // Activity 1: The Broken Invention (0–5 min)
      brokenReview: {
        title: "Oh No! The Invention Doesn't Work!",
        introText: "Look at Clara's invention! 🤖💥 It doesn't work! Why? Because we need a PLAN! Inventions must follow an ORDER!",
        teacherScript: "Oh no! The invention doesn't work! What do we do? We need a PLAN!",
        stagesReview: ["IDEA", "PLAN", "MAKE", "TEST"]
      },

      // Activity 2: Human Tablet (5–10 min)
      tabletSteps: [
        {
          stepNumber: 1,
          label: "FIRST",
          action: "Press play.",
          altAction: "Press on.",
          icon: "▶️",
          desc: "Tap the play button to begin!"
        },
        {
          stepNumber: 2,
          label: "SECOND",
          action: "Type password.",
          icon: "🔢",
          desc: "Type the 4-digit security code (1-2-3-4)!"
        },
        {
          stepNumber: 3,
          label: "THIRD",
          action: "Play the game.",
          altAction: "Press play.",
          icon: "🎮",
          desc: "Start your game adventure!"
        },
        {
          stepNumber: 4,
          label: "LAST",
          action: "Press on.",
          altAction: "Play the game.",
          icon: "🔘",
          desc: "Switch on power and jump into the bunny carrot hop!"
        }
      ],

      // Activity 3: Sequence Builder & Bug Spotter (10–15 min)
      sequenceBuilder: {
        title: "Sequence Builder & Bug Spotter",
        correctSequence: [
          { order: "FIRST", action: "Press play." },
          { order: "SECOND", action: "Type password." },
          { order: "THIRD", action: "Play the game." },
          { order: "LAST", action: "Press on." }
        ],
        altAcceptable: [
          { order: "FIRST", action: "Press on." },
          { order: "SECOND", action: "Type password." },
          { order: "THIRD", action: "Press play." },
          { order: "LAST", action: "Play the game." }
        ],
        bugs: [
          {
            title: "Bug 1: Playing Before Playing!",
            scrambled: ["Play the game.", "Type password.", "Press play.", "Press on."],
            bugExplanation: "You cannot play the game before you press play or type the password!",
            hint: "Look at what happens FIRST!"
          },
          {
            title: "Bug 2: Password at the End!",
            scrambled: ["Press play.", "Play the game.", "Press on.", "Type password."],
            bugExplanation: "You cannot enter the password AFTER playing!",
            hint: "Password must be SECOND!"
          }
        ]
      },

      // Activity 4: Inventor Process (15–21 min)
      inventorStages: [
        {
          step: 1,
          sequenceWord: "FIRST",
          title: "Have a Good Idea",
          icon: "💡",
          tagClass: "cyan-tag",
          textbookText: "An inventor has a good idea for an invention.",
          question: "What happens first?",
          answer: "An inventor has a good idea for an invention."
        },
        {
          step: 2,
          sequenceWord: "SECOND",
          title: "Write the Plan",
          icon: "📝",
          tagClass: "gold-tag",
          textbookText: "An inventor writes down the plan for the invention.",
          question: "Why do inventors have notebooks?",
          answer: "Because they want to remember things."
        },
        {
          step: 3,
          sequenceWord: "THIRD",
          title: "Make the Invention",
          icon: "🔨",
          tagClass: "purple-tag",
          textbookText: "An inventor makes the invention.",
          question: "What happens after the plan?",
          answer: "An inventor makes the invention."
        },
        {
          step: 4,
          sequenceWord: "LAST",
          title: "Test the Invention",
          icon: "🧪",
          tagClass: "green-tag",
          textbookText: "An inventor tests the invention.",
          question: "What does an inventor do last?",
          answer: "An inventor tests the invention."
        }
      ],

      // Activity 5: Sequence Relay (21–27 min)
      relayGame: {
        title: "Sequence Relay Race",
        instructions: "Teacher calls 'FIRST!', 'SECOND!', 'THIRD!', or 'LAST!'. Students rush to select the matching card. Accuracy earns 10 points!",
        scoringRule: "Accuracy is more important than speed. Correct sequence = 10 points. Fast but incorrect = 0 points until corrected.",
        callouts: [
          { call: "FIRST!", target: "IDEA", matchText: "An inventor has a good idea for an invention." },
          { call: "SECOND!", target: "PLAN", matchText: "An inventor writes down the plan for the invention." },
          { call: "THIRD!", target: "MAKE", matchText: "An inventor makes the invention." },
          { call: "LAST!", target: "TEST", matchText: "An inventor tests the invention." }
        ]
      },

      // Activity 6: Inventor Lab (27–33 min) - All 8 dilemmas from prompt!
      challenges: [
        {
          id: "chal-clean",
          title: "Cleans Your Room",
          icon: "🧹🛏️",
          problem: "Your room is a mess! Clothes and toys are everywhere!",
          machineName: "The Super Room Cleaner",
          first: "Have an idea for a robot cleaner with arms.",
          second: "Make a plan in our notebook.",
          third: "Make the robot cleaner.",
          last: "Test it on messy toys and socks!"
        },
        {
          id: "chal-pet",
          title: "Feeds Your Pet",
          icon: "🐕🍖",
          problem: "Your puppy is hungry when you are at school!",
          machineName: "The Auto-Pet Feeder",
          first: "Have an idea for an automatic bowl.",
          second: "Draw the plan with a timer clock.",
          third: "Make the feeder box.",
          last: "Test it with puppy treats!"
        },
        {
          id: "chal-pencils",
          title: "Finds Lost Pencils",
          icon: "✏️🔍",
          problem: "Pencils roll under desks and disappear forever!",
          machineName: "The Lost Pencil Finder",
          first: "Have an idea for a beeping pencil radar.",
          second: "Draw a sound chip inside the pencil cap.",
          third: "Make the pencil tracker.",
          last: "Test it under the classroom chairs!"
        },
        {
          id: "chal-bag",
          title: "Carries Your School Bag",
          icon: "🎒🪽",
          problem: "Your school backpack has 10 heavy books and hurts your shoulders!",
          machineName: "The Flying Backpack",
          first: "Have an idea for wings on a backpack.",
          second: "Make a blueprint with air propellers.",
          third: "Make the flying backpack.",
          last: "Test it carrying math and English books!"
        },
        {
          id: "chal-wakeup",
          title: "Helps You Wake Up",
          icon: "🛏️🎵",
          problem: "You are always sleepy and late for school in the morning!",
          machineName: "The Musical Wakeup Bed",
          first: "Have an idea for a singing pillow.",
          second: "Write the plan with gentle music buttons.",
          third: "Make the alarm clock pillow.",
          last: "Test it at 7:00 AM tomorrow!"
        },
        {
          id: "chal-rain",
          title: "Protects You From Rain",
          icon: "☂️🌧️",
          problem: "Heavy rain gets your notebook and clothes wet!",
          machineName: "The Pen Umbrella Shield",
          first: "Have an idea for a dry umbrella pen.",
          second: "Draw a waterproof cover on a pen.",
          third: "Make the pen umbrella.",
          last: "Test it under water drops!"
        },
        {
          id: "chal-bed",
          title: "Makes Your Bed",
          icon: "🛏️✨",
          problem: "Sheets are tangled and blankets are messy every morning!",
          machineName: "The Auto-Bed Maker",
          first: "Have an idea for magnetic blanket clips.",
          second: "Make a plan for folding arms.",
          third: "Make the bed maker robot.",
          last: "Test it after waking up!"
        },
        {
          id: "chal-homework",
          title: "Helps With Homework",
          icon: "✏️🧠",
          problem: "Math mistakes take a long time to spot and fix!",
          machineName: "The Smart Homework Eraser",
          first: "Have an idea for an eraser that reads questions.",
          second: "Write down the plan with a red hint light.",
          third: "Make the smart eraser.",
          last: "Test it on reading exercises!"
        }
      ],

      // Activity 7: Inventor Presentation (33–35 min)
      presentation: {
        title: "Inventor Presentation & Ceremony",
        speakingFrame: [
          "Our invention is a ______.",
          "It can ______.",
          "First, we ______.",
          "Second, we ______.",
          "Third, we ______.",
          "Last, we ______."
        ],
        audienceReactions: [
          { id: "idea", label: "GOOD IDEA ⭐", count: 0 },
          { id: "useful", label: "USEFUL ⭐", count: 0 },
          { id: "funny", label: "FUNNY ⭐", count: 0 },
          { id: "applause", label: "APPLAUSE 👏", count: 0 }
        ],
        notebookDiscussion: {
          question: "Why do inventors have notebooks?",
          expectedAnswer: "To remember their ideas."
        }
      }
    },

    // =========================================================================
    // PHONICS EXTENSION: CL / cl- BLENDS
    // =========================================================================
    phonics: {
      blend: "CL / cl-",
      description: "Listen to the /kl/ sound at the start of words!",
      coreWords: [
        { word: "climb", icon: "🧗", sentence: "Monkeys climb tall trees.", isCl: true },
        { word: "clue", icon: "🔍", sentence: "The detective found a secret clue.", isCl: true },
        { word: "cloud", icon: "☁️", sentence: "There is a fluffy white cloud.", isCl: true },
        { word: "close", icon: "🚪", sentence: "Please close the door quietly.", isCl: true },
        { word: "clap", icon: "👏", sentence: "Clap your hands if you are happy!", isCl: true }
      ],
      bookScavengerWords: [
        { word: "Clara", page: "Page 16", note: "Clara Doodle's name!" },
        { word: "clean", page: "Page 16", note: "She doesn't like to clean." },
        { word: "clean-up", page: "Page 16", note: "A big clean-up machine!" },
        { word: "clock", page: "Page 16", note: "The alarm clock pillow!" },
        { word: "clothes", page: "Page 16", note: "The mirror changes her clothes!" }
      ],
      distractorWords: [
        { word: "rain", icon: "🌧️", isCl: false },
        { word: "book", icon: "📖", isCl: false },
        { word: "robot", icon: "🤖", isCl: false },
        { word: "pen", icon: "🖊️", isCl: false }
      ]
    },

    // =========================================================================
    // DETAILED 11-FIELD TEACHER MODE HUD REFERENCE
    // =========================================================================
    teacherMode: {
      lesson1Activities: [
        {
          name: "Inventor Mystery",
          time: "0–5 min",
          objective: "Spark curiosity about inventions; elicit 'What is it?' and 'What does it do?'",
          setup: "Display mashup cards on smartboard; award Junior Inventor badges.",
          instructions: "Show unusual combinations (PEN+UMBRELLA, BED+ALARM CLOCK). Elicit funny guesses in pairs.",
          teacherLanguage: "Look! What is this? What does it do? Today, YOU are inventors!",
          answerKey: "Pen Umbrella, Alarm Clock Pillow, Smart Eraser, Clean-up Machine, Mirror.",
          expectedResponses: "It is a pen umbrella! It writes in the rain!",
          physicalVersion: "Hold up two classroom objects (pen + umbrella); students shout ideas.",
          digitalVersion: "Click mashup cards to flip and reveal Clara's invention with sound.",
          easierVersion: "Provide 2 picture choices: 'Is it for sleeping or writing?'",
          harderVersion: "Ask students to invent a 3rd object combo on their own."
        },
        {
          name: "What Does The Invention Do?",
          time: "5–10 min",
          objective: "Identify 5 authentic textbook inventions and their primary functions.",
          setup: "Display 5 invention cards; prepare audio clues.",
          instructions: "Teacher gives a clue (e.g., 'It is for the rain'). Students tap or move to the matching card.",
          teacherLanguage: "Listen carefully! Which machine cleans? Great inventor!",
          answerKey: "1. Pen umbrella (rain), 2. Pillow (sings), 3. Eraser (homework), 4. Clean-up machine (cleans), 5. Mirror (buttons).",
          expectedResponses: "The clean-up machine! It cleans Clara's room!",
          physicalVersion: "Tape 5 cards in 5 room corners; students walk to the correct corner.",
          digitalVersion: "Tap the glowing card that matches the spoken clue audio.",
          easierVersion: "Highlight keyword on screen: 'RAIN -> ☂️'.",
          harderVersion: "Students describe the invention to a partner without saying its name."
        },
        {
          name: "Reading Detectives",
          time: "10–17 min",
          objective: "Locate textual evidence in short reading chunks for 6 comprehension missions.",
          setup: "Project textbook reading chunks; unlock mission pins.",
          instructions: "Students read chunks aloud; search for answer to mission question; highlight sentence evidence.",
          teacherLanguage: "Detectives, search the reading! Where does it say when Clara invents?",
          answerKey: "1. After school, 2. Tries again, 3. Makes a plan, 4. Mirror doesn't work, 5. Her mom, 6. Cleans room.",
          expectedResponses: "She invents things after school! Line 2!",
          physicalVersion: "Pairs underline evidence sentences in their paper books with yellow highlighter.",
          digitalVersion: "Click the multiple-choice option; text lights up with glowing green evidence.",
          easierVersion: "Read the target sentence twice with vocal emphasis.",
          harderVersion: "Students read the evidence sentence aloud using dramatic teacher voice."
        },
        {
          name: "True or False — MOVE!",
          time: "17–24 min",
          objective: "Verify comprehension kinesthetically; elicit short 'Why?' justification.",
          setup: "Designate classroom Left side as TRUE, Right side as FALSE.",
          instructions: "Teacher reads a statement. Students physically move to TRUE or FALSE. Ask 'Why?'",
          teacherLanguage: "Clara invents things before school! True or False? Move! Why?",
          answerKey: "1. False (after school), 2. True, 3. False (doesn't work), 4. True, 5. True.",
          expectedResponses: "False! Because she invents things after school!",
          physicalVersion: "Students jump to the left for TRUE, right for FALSE.",
          digitalVersion: "Tap giant TRUE or FALSE buttons; instant audio feedback and explanation.",
          easierVersion: "Accept 1-word answers for 'Why?': 'After!' or 'Mess!'.",
          harderVersion: "Require a full sentence: 'It is false because the mirror doesn't work.'"
        },
        {
          name: "Build Clara's Story",
          time: "24–31 min",
          objective: "Reconstruct Clara's narrative chronologically using First, Then, Next, Finally.",
          setup: "Groups of 4; give each group 6 scrambled illustrated story cards.",
          instructions: "Arrange cards in order from 1 to 6. Practice retelling the story together.",
          teacherLanguage: "What happened first? What did she do when the mirror failed?",
          answerKey: "1. Invents after school -> 2. Has idea -> 3. Makes plan -> 4. Mirror doesn't work -> 5. Tries again -> 6. Clean-up machine.",
          expectedResponses: "First, Clara invents after school. Then, she has an idea...",
          physicalVersion: "Place large paper cards on the floor; student volunteers step onto each card in sequence.",
          digitalVersion: "Drag-and-drop cards into 6 glowing slots with snapping animation.",
          easierVersion: "Provide cards 1 and 6 already locked in place.",
          harderVersion: "Students retell the story from memory without looking at the cards."
        },
        {
          name: "Create Your Invention",
          time: "31–35 min",
          objective: "Design an original invention and state its name and function orally.",
          setup: "Smartboard drawing canvas; Page 4 student blueprints.",
          instructions: "Pick two components or draw a unique machine. Fill in speaking frame: 'My invention is a... It can...'",
          teacherLanguage: "What does your machine do? Can it fly? Tell your partner!",
          answerKey: "Open creative task with sentence frames.",
          expectedResponses: "My invention is a flying backpack! It can carry my heavy books!",
          physicalVersion: "Draw on Page 4 worksheet with pencils; show to partner.",
          digitalVersion: "Draw with digital ink and select chips to generate live blueprint preview.",
          easierVersion: "Circle 2 pre-made choices: 'Robot' + 'Cleaning'.",
          harderVersion: "Add a 3rd sentence: 'It helps students because...'"
        }
      ],
      lesson2Activities: [
        {
          name: "The Broken Invention",
          time: "0–5 min",
          objective: "Introduce the critical need for SEQUENCE and ORDER in innovation.",
          setup: "Trigger broken machine animation on screen (robot smoking).",
          instructions: "Show broken machine; ask why it broke; introduce need for ORDER and the 4 stages.",
          teacherLanguage: "Oh no! The invention doesn't work! What do we do? We need a PLAN!",
          answerKey: "Machines need an order: IDEA -> PLAN -> MAKE -> TEST.",
          expectedResponses: "We need a plan! We must fix the order!",
          physicalVersion: "Pretend a classroom gadget won't turn on; ask what step we forgot.",
          digitalVersion: "Tap 'Simulate Failure' to see sparks, smoke, and gear sound effects.",
          easierVersion: "Use thumbs up / thumbs down: 'Does it work?'",
          harderVersion: "Ask: 'What happens if you test before you make?'"
        },
        {
          name: "Human Tablet",
          time: "5–10 min",
          objective: "Physically act out the 4-step sequence: Press play, Type password, Play game, Press on.",
          setup: "Give 4 students large instruction cards.",
          instructions: "Students stand scrambled at the front. Class directs them into correct order.",
          teacherLanguage: "Can we play the game? No! Put them in order! Who is FIRST?",
          answerKey: "1. Press play, 2. Type password, 3. Play the game, 4. Press on (or Power On -> Pin -> Play -> Hop).",
          expectedResponses: "First, press play! Second, type password! Third, play the game! Last, press on!",
          physicalVersion: "4 students step forward in sequence when their step is called.",
          digitalVersion: "Operate the virtual tablet: enter PIN 1-2-3-4, tap play, hop bunny.",
          easierVersion: "Color-code the cards (Green = First, Blue = Second, Purple = Third, Gold = Last).",
          harderVersion: "Have a student give spoken commands to the 4 human tablet volunteers."
        },
        {
          name: "Sequence Builder",
          time: "10–15 min",
          objective: "Master sequence words FIRST, SECOND, THIRD, LAST; identify chronological bugs.",
          setup: "Interactive 4-slot sequence board; Bug Spotter button.",
          instructions: "Match actions under sequence words; inspect deliberately scrambled sequences to spot bugs.",
          teacherLanguage: "Is this correct? Can you play before you type the password? Spot the bug!",
          answerKey: "First, Second, Third, Last. Bug: You cannot play before entering password.",
          expectedResponses: "No! That is a bug! Second is type password!",
          physicalVersion: "Use clothespins to pin action cards under First, Second, Third, Last ribbons.",
          digitalVersion: "Drag action cards into sequence columns; click 'Spot the Bug' to test logic.",
          easierVersion: "Two-step choice: 'Which is FIRST? Press on or play the game?'",
          harderVersion: "Explain in English why the bug makes the tablet crash."
        },
        {
          name: "Inventor Process",
          time: "15–21 min",
          objective: "Learn the 4 official inventor stages: Idea -> Plan -> Make -> Test.",
          setup: "Display 4 stage cards with icons: 💡, 📝, 🔨, 🧪.",
          instructions: "Teach gestures for each stage. Elicit discussion: 'Why do inventors have notebooks?'",
          teacherLanguage: "First, an inventor has an idea! Second, writes down the plan! Why have notebooks?",
          answerKey: "First: Idea, Second: Plan, Third: Make, Last: Test. Notebooks: To remember things.",
          expectedResponses: "To remember their ideas! So they don't forget!",
          physicalVersion: "Hand gesture choreography: Finger to head (Idea), writing motion (Plan), hammering (Make), peering through beaker (Test).",
          digitalVersion: "Tap each process card to hear authentic pronunciation; answer discussion question.",
          easierVersion: "Match icon directly to sequence word (💡 -> FIRST).",
          harderVersion: "Students describe their own past craft project using the 4 stages."
        },
        {
          name: "Sequence Relay",
          time: "21–27 min",
          objective: "Reinforce sequence accuracy under dynamic classroom relay conditions.",
          setup: "Place IDEA, PLAN, MAKE, TEST cards on the far wall. Split class into Team Alpha & Team Beta.",
          instructions: "Teacher calls 'FIRST!'. Runners retrieve matching card. 10 points for accuracy, not just speed.",
          teacherLanguage: "Team Alpha ready? Team Beta ready? FIRST! Run and find the right step!",
          answerKey: "First = IDEA, Second = PLAN, Third = MAKE, Last = TEST.",
          expectedResponses: "Here is FIRST! An inventor has an idea!",
          physicalVersion: "Relay race with beanbags or cards retrieved from baskets across the room.",
          digitalVersion: "On-screen relay timer with teacher callout button and team point counters.",
          easierVersion: "Teacher calls both sequence word and icon: 'FIRST! Lightbulb!'.",
          harderVersion: "Caller switches to reverse order: 'LAST! THIRD! SECOND! FIRST!'."
        },
        {
          name: "Inventor Lab",
          time: "27–33 min",
          objective: "Apply the 4-step sequence to solve 1 of 8 real-world classroom/home dilemmas.",
          setup: "Group students into pairs or trios; assign challenge dilemma.",
          instructions: "Choose a challenge (e.g. cleans room, feeds pet, lost pencils); complete 4-step blueprint.",
          teacherLanguage: "How will your group solve the lost pencil problem? What is step 1?",
          answerKey: "8 challenges with complete 4-step sequence scripts.",
          expectedResponses: "Our invention is the Lost Pencil Finder! First, we have an idea...",
          physicalVersion: "Complete Page 4 of the printed worksheet in groups.",
          digitalVersion: "Select dilemma from dropdown; listen to audio model; customize machine.",
          easierVersion: "Use provided dilemma templates and fill in only the machine name.",
          harderVersion: "Invent an entirely new 4-step machine for a school problem."
        },
        {
          name: "Inventor Presentation",
          time: "33–35 min",
          objective: "Present 4-step invention to classmates; audience votes with reaction stars.",
          setup: "Presentation podium; audience star voting buttons; fanfare audio.",
          instructions: "2–3 groups present their blueprint. Audience awards stars (GOOD IDEA, USEFUL, FUNNY, APPLAUSE).",
          teacherLanguage: "Let's welcome Team 1! Audience, get ready to vote! Why do inventors have notebooks?",
          answerKey: "Final wrap-up discussion & award of Master Inventor badges.",
          expectedResponses: "To remember their ideas! Thank you, everyone!",
          physicalVersion: "Groups stand at the front and hold their drawing paper; classmates clap and vote with thumbs up.",
          digitalVersion: "Audience taps on-screen star buttons; graduation certificate and confetti trigger.",
          easierVersion: "Choral presentation where the whole group reads together.",
          harderVersion: "Individual student presents without looking at their notes."
        }
      ]
    }
  };

  root.CLARA_DATA = CLARA_DATA;
})(window);
