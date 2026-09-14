/**
 * CLARA'S INVENTOR MYSTERY & THE INVENTOR CHALLENGE
 * Pedagogical Data Model & Curriculum Content
 * Based on Global Readings 2 (pp. 10–17)
 */

(function(root) {
  'use strict';

  const CLARA_DATA = {
    meta: {
      title: "Clara's Inventor Mystery & The Inventor Challenge",
      unit: "Unit 1: What Does It Do? / Explore the Reading & Get Ready to Read",
      book: "Global Readings 2, Pages 10–17",
      targetAge: "Ages 8–12 (A1+ Young Learners)",
      totalLessons: 2,
      lessonDurationMinutes: 35
    },

    // =========================================================================
    // LESSON 1: CLARA'S INVENTOR MYSTERY (35 MIN)
    // =========================================================================
    lesson1: {
      id: "lesson1",
      title: "Lesson 1: Clara's Inventor Mystery",
      tagline: "Move • Look • Think • Speak • Build",
      targetTime: "35 Minutes",
      stages: [
        { id: 1, name: "🔍 Wacky Mystery Warm-up", time: "0–5 min" },
        { id: 2, name: "🎴 What Does It Do?", time: "5–10 min" },
        { id: 3, name: "🕵️ Reading Detectives", time: "10–17 min" },
        { id: 4, name: "🏃 4-Corners True/False", time: "17–24 min" },
        { id: 5, name: "📜 Build Clara's Story", time: "24–31 min" },
        { id: 6, name: "🎨 My Invention Studio", time: "31–35 min" }
      ],

      // Part 1: Mystery Warmup combinations
      warmup: {
        title: "Wacky Inventor Combinations",
        instruction: "Look at the two things! What is it? What does it do? Guess with your partner!",
        combos: [
          {
            id: "combo-1",
            iconA: "☂️",
            nameA: "Umbrella",
            iconB: "🖊️",
            nameB: "Pen",
            invention: "The Pen Umbrella",
            clue: "You can write words AND stay dry in the rain!",
            speech: "It is an umbrella pen! It helps you write in the rain!"
          },
          {
            id: "combo-2",
            iconA: "🛏️",
            nameA: "Pillow",
            iconB: "⏰",
            nameB: "Alarm Clock",
            invention: "The Alarm Clock Pillow",
            clue: "You sleep on it... and it wakes you up with a song!",
            speech: "It is an alarm clock pillow! It wakes you up with music!"
          },
          {
            id: "combo-3",
            iconA: "✏️",
            nameA: "Pencil",
            iconB: "🧠",
            nameB: "Smart Eraser",
            invention: "The Smart Eraser",
            clue: "When your math is wrong, this red light flashes 'WRONG!'",
            speech: "It is a smart eraser! It tells you when your homework is wrong!"
          },
          {
            id: "combo-4",
            iconA: "🤖",
            nameA: "Robot",
            iconB: "🧹",
            nameB: "Vacuum & Broom",
            invention: "The Big Clean-up Machine",
            clue: "Your room is a mess? Push a button and it cleans everything!",
            speech: "It is a clean-up machine! It cleans up messy rooms!"
          }
        ]
      },

      // Part 2: The 5 Inventions
      inventions: [
        {
          id: "pen-umbrella",
          title: "The Pen Umbrella",
          icon: "☂️🖊️",
          bookPage: "Page 11",
          bookQuote: "Here are my rain glasses and my umbrella pen.",
          functions: [
            "This invention is for the rain.",
            "It lets you write in the rain.",
            "It keeps your paper dry."
          ],
          primaryFunction: "This invention is for the rain.",
          clue: "It is for the rain. You hold it and write words!"
        },
        {
          id: "alarm-pillow",
          title: "The Alarm Clock Pillow",
          icon: "🛏️⏰",
          bookPage: "Page 13",
          bookQuote: "And my alarm clock pillow wakes me with a song.",
          functions: [
            "This invention wakes Clara with a song.",
            "This invention has buttons.",
            "This invention sings a song."
          ],
          primaryFunction: "This invention sings a song.",
          clue: "It has buttons and sings a song to wake you up!"
        },
        {
          id: "smart-eraser",
          title: "The Smart Eraser",
          icon: "✏️🔴",
          bookPage: "Page 13",
          bookQuote: "Here's my smart eraser. It tells me when I'm wrong.",
          functions: [
            "This invention helps Clara with her homework.",
            "It tells Clara when she is wrong.",
            "It fixes mistakes in math and English."
          ],
          primaryFunction: "This invention helps Clara with her homework.",
          clue: "It tells you when you make a mistake on your homework!"
        },
        {
          id: "special-mirror",
          title: "The Special Mirror",
          icon: "🪞💜",
          bookPage: "Page 14",
          bookQuote: "This is my special mirror. It changes what I see... Oh, no! I have long purple hair and a big long nose.",
          functions: [
            "This invention changes what Clara sees.",
            "It has buttons: Small, Big, Front, Back.",
            "It gives Clara purple hair and a long nose!"
          ],
          primaryFunction: "This invention changes what I see, but it does not work!",
          clue: "You click a button, but it gives you purple hair and a long nose!"
        },
        {
          id: "cleanup-machine",
          title: "The Big Clean-up Machine",
          icon: "🤖🧹",
          bookPage: "Page 15",
          bookQuote: "Mom says my room's a mess, but I don't like to clean. Here's my new invention... it's a big clean-up machine.",
          functions: [
            "This invention cleans Clara's room.",
            "It sweeps and vacuums the floor.",
            "It solves the problem of a messy room."
          ],
          primaryFunction: "This invention cleans.",
          clue: "Mom says the room is a mess! This robot sweeps and cleans!"
        }
      ],

      // Part 3: 6 Detective Missions
      readingMissions: [
        {
          id: 1,
          questionCode: "WHEN?",
          question: "When does Clara invent things?",
          page: "Page 10",
          image: "assets/books/global-readings-2/page_10.jpg",
          textChunk: "My name is Clara Doodle. I invent things after school. I have a lot of new ideas and some of them are cool.",
          sentenceHighlight: "I invent things after school.",
          options: [
            { text: "She invents things before school.", isCorrect: false, hint: "Look at the time when school finishes!" },
            { text: "She invents things after school.", isCorrect: true, hint: "Correct! She invents things after school." },
            { text: "She invents things at night in bed.", isCorrect: false, hint: "Read line 2 on Page 10." }
          ],
          spokenProof: "Clara invents things after school!"
        },
        {
          id: 2,
          questionCode: "BAD IDEA?",
          question: "What does she do if her idea is not very good?",
          page: "Page 11",
          image: "assets/books/global-readings-2/page_11.jpg",
          textChunk: "OK. Some ideas are not so good ... but I always try again!",
          sentenceHighlight: "but I always try again!",
          options: [
            { text: "She cries and gives up.", isCorrect: false, hint: "Inventors never give up!" },
            { text: "She buys a toy from a shop.", isCorrect: false, hint: "Check what Clara says on Page 11." },
            { text: "She tries again.", isCorrect: true, hint: "Super! Clara always tries again!" }
          ],
          spokenProof: "If an idea is not good, she tries again!"
        },
        {
          id: 3,
          questionCode: "NEW IDEA?",
          question: "What does she do when she has a new idea?",
          page: "Page 12",
          image: "assets/books/global-readings-2/page_12.jpg",
          textChunk: "When I have an idea, I always make a plan. I draw and change, and change and draw. I do the best I can.",
          sentenceHighlight: "When I have an idea, I always make a plan.",
          options: [
            { text: "She makes a plan.", isCorrect: true, hint: "Awesome! She always makes a plan and draws." },
            { text: "She forgets it quickly.", isCorrect: false, hint: "Look at Page 12, line 2." },
            { text: "She calls her grandmother.", isCorrect: false, hint: "She draws and plans in her notebook!" }
          ],
          spokenProof: "When she has a new idea, she always makes a plan!"
        },
        {
          id: 4,
          questionCode: "OH, NO!",
          question: "Why does Clara say 'Oh, no!'?",
          page: "Page 14",
          image: "assets/books/global-readings-2/page_14.jpg",
          textChunk: "This is my special mirror. It changes what I see... But something's not quite right! It's changing all my clothes. Oh, no! I have long purple hair and a big long nose.",
          sentenceHighlight: "Oh, no! I have long purple hair and a big long nose.",
          options: [
            { text: "She lost her purple shoes.", isCorrect: false, hint: "Look at her hair in the mirror!" },
            { text: "The mirror doesn't work.", isCorrect: true, hint: "Yes! The mirror gave her purple hair and a long nose!" },
            { text: "It is raining outside.", isCorrect: false, hint: "Check the mirror buttons on Page 14." }
          ],
          spokenProof: "Clara says 'Oh, no!' because the mirror doesn't work!"
        },
        {
          id: 5,
          questionCode: "WHO?",
          question: "Who thinks Clara's room is a mess?",
          page: "Page 15",
          image: "assets/books/global-readings-2/page_15.jpg",
          textChunk: "Mom says my room's a mess, but I don't like to clean. Here's my new invention ... it's a big clean-up machine.",
          sentenceHighlight: "Mom says my room's a mess",
          options: [
            { text: "Her teacher does.", isCorrect: false, hint: "Who is standing at the door?" },
            { text: "Her best friend does.", isCorrect: false, hint: "Look at the woman on Page 15!" },
            { text: "Her mom does.", isCorrect: true, hint: "Spot on! Her mom says 'What a mess!'" }
          ],
          spokenProof: "Her mom thinks Clara's room is a mess!"
        },
        {
          id: 6,
          questionCode: "NEW INVENTION?",
          question: "What does her new invention do?",
          page: "Page 15",
          image: "assets/books/global-readings-2/page_15.jpg",
          textChunk: "Here's my new invention ... it's a big clean-up machine.",
          sentenceHighlight: "it's a big clean-up machine.",
          options: [
            { text: "It plays loud music.", isCorrect: false, hint: "What problem does Clara have with her room?" },
            { text: "It cleans her room.", isCorrect: true, hint: "Brilliant! It is a big clean-up machine!" },
            { text: "It flies to outer space.", isCorrect: false, hint: "Look at the vacuum hose and robot arms!" }
          ],
          spokenProof: "Her new invention cleans her room!"
        }
      ],

      // Part 4: 4-Corners True / False
      fourCorners: [
        {
          id: "tf-1",
          statement: "Clara invents things before school.",
          isTrue: false,
          explanation: "FALSE! Clara invents things AFTER school!",
          speechWhy: "Why? Because the book says: 'I invent things after school!'"
        },
        {
          id: "tf-2",
          statement: "Clara tries again when an idea is not good.",
          isTrue: true,
          explanation: "TRUE! Clara always tries again when something fails!",
          speechWhy: "Why? Because inventors always try again!"
        },
        {
          id: "tf-3",
          statement: "The mirror works perfectly.",
          isTrue: false,
          explanation: "FALSE! The mirror doesn't work! It gave Clara purple hair and a long nose!",
          speechWhy: "Why? Because the mirror made her look funny with purple hair!"
        },
        {
          id: "tf-4",
          statement: "Clara's mom thinks her room is a mess.",
          isTrue: true,
          explanation: "TRUE! Mom says: 'What a mess!'",
          speechWhy: "Why? Because there are papers and inventions all over the floor!"
        },
        {
          id: "tf-5",
          statement: "Clara's new invention cleans her room.",
          isTrue: true,
          explanation: "TRUE! Her clean-up machine cleans up everything!",
          speechWhy: "Why? Because it is a big clean-up robot!"
        }
      ],

      // Part 5: Build Clara's Story (6 cards)
      storyCards: [
        { order: 1, text: "Clara invents things after school.", icon: "🏫🎒" },
        { order: 2, text: "Clara has an idea.", icon: "💡🧠" },
        { order: 3, text: "Clara makes a plan.", icon: "📝📐" },
        { order: 4, text: "The mirror doesn't work.", icon: "🪞❌" },
        { order: 5, text: "Clara tries again.", icon: "🔄💪" },
        { order: 6, text: "Clara makes a clean-up machine.", icon: "🤖🧹" }
      ],

      // Part 6: My Invention Builder options
      builderOptions: {
        bases: [
          { name: "flying backpack", icon: "🎒✨", action: "carries books and flies to school" },
          { name: "robot shoes", icon: "👟⚡", action: "runs fast and jumps over puddles" },
          { name: "magic pencil", icon: "✏️🌟", action: "draws colorful pictures in the air" },
          { name: "pillow drone", icon: "🛏️🚁", action: "sings lullabies and follows you" },
          { name: "pet washer", icon: "🐶🛁", action: "washes dogs with warm bubble soap" }
        ],
        adjectives: ["super", "smart", "turbo", "solar", "flying", "friendly"]
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
        { id: 1, name: "💥 Broken Invention Review", time: "0–5 min" },
        { id: 2, name: "📱 Human Tablet", time: "5–10 min" },
        { id: 3, name: "🧩 Sequence Builder", time: "10–15 min" },
        { id: 4, name: "💡 4-Stage Inventor Process", time: "15–21 min" },
        { id: 5, name: "⏱️ Sequence Relay", time: "21–27 min" },
        { id: 6, name: "🛠️ Inventor Lab Blueprint", time: "27–33 min" },
        { id: 7, name: "🏆 Pitch & Graduation", time: "33–35 min" }
      ],

      // Part 2: Human Tablet Sequence (Textbook Page 17)
      tabletSteps: [
        {
          stepNumber: 1,
          label: "FIRST",
          action: "Press on.",
          icon: "🔘",
          desc: "Turn on the power button on the tablet frame!"
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
          action: "Press play.",
          icon: "▶️",
          desc: "Tap the big green PLAY button on the game menu!"
        },
        {
          stepNumber: 4,
          label: "LAST",
          action: "Play the game.",
          icon: "🎮🐰",
          desc: "Control the bunny and collect carrots!"
        }
      ],

      // Part 4: The 4 Stages of Inventing (Textbook Page 17)
      inventorStages: [
        {
          step: 1,
          sequenceWord: "FIRST",
          title: "Have an Idea",
          icon: "💡",
          tagClass: "cyan-tag",
          textbookText: "An inventor has a good idea for an invention.",
          question: "Where do inventions start?",
          answer: "In your mind! With a spark of curiosity."
        },
        {
          step: 2,
          sequenceWord: "SECOND",
          title: "Write the Plan",
          icon: "📝",
          tagClass: "gold-tag",
          textbookText: "An inventor writes down the plan for the invention.",
          question: "Why do inventors have notebooks?",
          answer: "Because they want to remember things!"
        },
        {
          step: 3,
          sequenceWord: "THIRD",
          title: "Make the Invention",
          icon: "🔨",
          tagClass: "purple-tag",
          textbookText: "An inventor makes the invention.",
          question: "What do inventors use?",
          answer: "Tools, materials, gears, and wires!"
        },
        {
          step: 4,
          sequenceWord: "LAST",
          title: "Test the Invention",
          icon: "🧪",
          tagClass: "green-tag",
          textbookText: "An inventor tests the invention.",
          question: "What if it doesn't work?",
          answer: "Make changes and try again!"
        }
      ],

      // Part 6: Real-World Group Invention Challenges
      challenges: [
        {
          id: "chal-clean",
          title: "The Messy Room Dilemma",
          icon: "🧹🛏️",
          problem: "Your bedroom floor is covered in clothes and toys!",
          machineName: "The Super Room Cleaner",
          first: "Have an idea for a rolling vacuum with robot arms.",
          second: "Draw the plan in a notebook.",
          third: "Build the robot with wheels and dust collectors.",
          last: "Test it on messy socks and books!"
        },
        {
          id: "chal-pet",
          title: "The Hungry Puppy Dilemma",
          icon: "🐕🍖",
          problem: "You are at school and your dog needs food!",
          machineName: "The Auto-Pet Feeder",
          first: "Have an idea for a timer that drops dog treats.",
          second: "Draw a funnel with a clock dial.",
          third: "Make the feeder with a food hopper.",
          last: "Test if the food drops at 3 o'clock!"
        },
        {
          id: "chal-bag",
          title: "The Heavy Backpack Dilemma",
          icon: "🎒🪨",
          problem: "Your school bag has 10 heavy books and hurts your shoulders!",
          machineName: "The Hover-Pack 3000",
          first: "Have an idea for a backpack with air thrusters.",
          second: "Draw wings and a lightweight frame.",
          third: "Assemble the hover propellers.",
          last: "Test it carrying math and English books!"
        },
        {
          id: "chal-pencil",
          title: "The Lost Pencil Mystery",
          icon: "✏️🔍",
          problem: "Pencils roll under desks and disappear!",
          machineName: "The Pencil Boomerang Tracker",
          first: "Have an idea for a beeping pencil grip.",
          second: "Draw a sound chip inside the rubber grip.",
          third: "Build the sensor clip.",
          last: "Test if it beeps when dropped under a chair!"
        }
      ]
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
        { word: "Clara", page: "Page 10", note: "Clara Doodle's name!" },
        { word: "clothes", page: "Page 14", note: "The mirror changes her clothes!" },
        { word: "clean", page: "Page 15", note: "She doesn't like to clean." },
        { word: "clean-up", page: "Page 15", note: "A big clean-up machine!" },
        { word: "clock", page: "Page 13", note: "The alarm clock pillow!" }
      ],
      distractorWords: [
        { word: "rain", icon: "🌧️", isCl: false },
        { word: "book", icon: "📖", isCl: false },
        { word: "robot", icon: "🤖", isCl: false },
        { word: "pen", icon: "🖊️", isCl: false }
      ]
    },

    // =========================================================================
    // TEACHER HUD & DIFFERENTIATION REFERENCE
    // =========================================================================
    teacherMode: {
      lesson1Pacing: [
        { time: "0–5 min", activity: "Wacky Mystery Warmup", setup: "Project combinations on screen; elicit funny guesses from pairs." },
        { time: "5–10 min", activity: "What Does It Do?", setup: "Show 5 invention cards; play clue audio; students point or tap." },
        { time: "10–17 min", activity: "Reading Detectives", setup: "Read story chunks aloud; students locate textual proof for each mission." },
        { time: "17–24 min", activity: "4-Corners True/False", setup: "Physical movement: Label classroom corners TRUE and FALSE; students run and say WHY." },
        { time: "24–31 min", activity: "Build Clara's Story", setup: "Groups sequence 6 event cards using First, Next, Then, Finally." },
        { time: "31–35 min", activity: "My Invention Studio", setup: "Draw wacky machine and speak: 'My invention is a... It...' Award Junior Badges." }
      ],
      lesson2Pacing: [
        { time: "0–5 min", activity: "Broken Invention Review", setup: "Show funny broken machine animation; introduce need for SEQUENCE & PLAN." },
        { time: "5–10 min", activity: "Human Tablet", setup: "4 students hold instruction cards; class arranges them in physical order." },
        { time: "10–15 min", activity: "Sequence Builder", setup: "Match actions under FIRST, SECOND, THIRD, LAST; play 'Spot the Bug'." },
        { time: "15–21 min", activity: "4-Stage Process", setup: "Teach Idea -> Plan -> Make -> Test; choral repetition with hand gestures." },
        { time: "21–27 min", activity: "Sequence Relay", setup: "Team Alpha vs Team Beta relay race; teacher calls stage names." },
        { time: "27–33 min", activity: "Inventor Lab Challenge", setup: "Groups choose dilemma; write 4-step sequence blueprint." },
        { time: "33–35 min", activity: "Pitch & Ceremony", setup: "2-3 presentations; audience star voting; Master Inventor awards." }
      ],
      differentiation: {
        easier: [
          "Provide sentence frames: 'First, we... Second, we...'",
          "Use picture cards alongside sequence words.",
          "Accept 1-word or gesture responses for 'Why?' in 4-Corners."
        ],
        harder: [
          "Ask students: 'What happens if we put TEST before MAKE?'",
          "Encourage full complex sentences: 'I think it is difficult because...'",
          "Have learners invent and script their own 4-step gadget from scratch."
        ],
        noTech: [
          "Printable cut-out cards provided in worksheet.html (TRUE/FALSE, SEQUENCE, PROCESS).",
          "Classroom 4-Corners can be run entirely with printed signs and teacher voice.",
          "Human Tablet can be played with 4 paper sheets held by volunteers."
        ]
      }
    }
  };

  root.CLARA_DATA = CLARA_DATA;
})(window);
