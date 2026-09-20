/**
 * ALICE'S WONDERLAND READING QUEST — DATA MODEL & CURRICULUM
 * Based on Reading Book 3, Pages 16–17
 * Target: A1+ Young ESL Learners (2 × 35 min lessons)
 */

(function(root) {
  'use strict';

  const ALICE_DATA = {
    meta: {
      title: "Alice's Wonderland Reading Quest",
      book: "Reading Book 3 (Pages 16–17)",
      level: "A1+",
      age: "Ages 8–12 (Young Learners)",
      totalLessons: 2,
      lessonDurationMinutes: 35,
      worldName: "Wonderland Reading Kingdom",
      areas: [
        { id: "river", name: "The Quiet River", icon: "🌳" },
        { id: "rabbit-path", name: "The Rabbit Path", icon: "🐇" },
        { id: "hole", name: "The Great Rabbit Hole", icon: "🕳️" },
        { id: "doors", name: "The Hall of Mystery Doors", icon: "🚪" },
        { id: "garden", name: "The Flower Garden", icon: "🌷" },
        { id: "detective", name: "The Skimming Detective Lab", icon: "🔎" },
        { id: "brain", name: "The Brain Power Studio", icon: "🧠" }
      ]
    },

    // Badges & Achievements
    badges: [
      { id: "story-master", title: "STORY MASTER", icon: "🏆", desc: "Reconstructed Alice's 6 adventure events in exact order!" },
      { id: "feeling-detective", title: "FEELING DETECTIVE", icon: "😮", desc: "Identified all 4 feelings: worried, bored, surprised, and interested!" },
      { id: "eagle-eyes", title: "EAGLE EYES", icon: "👁️", desc: "Unlocked the superpower of skimming in under 10 seconds!" },
      { id: "speed-skimmer", title: "SPEED SKIMMER", icon: "⚡", desc: "Defeated the final skimming boss and found the main idea!" }
    ],

    // =========================================================================
    // LESSON 1: ALICE'S WONDERLAND QUEST (35 MIN)
    // Sequence • Feelings • Imagination
    // =========================================================================
    lesson1: {
      id: "lesson1",
      title: "Lesson 1: Alice's Wonderland Quest",
      tagline: "Look • Tap • Move • Guess • Speak • Drag",
      targetTime: "35 Minutes",
      stages: [
        { id: 1, name: "🐇 Follow the Rabbit", time: "0–5 min" },
        { id: 2, name: "🧩 What Happened?", time: "5–10 min" },
        { id: 3, name: "👥 Human Alice", time: "10–15 min" },
        { id: 4, name: "😮 Feeling Monster", time: "15–22 min" },
        { id: 5, name: "🕵️ Feeling Detective", time: "22–27 min" },
        { id: 6, name: "🚪 What's Behind the Door?", time: "27–32 min" },
        { id: 7, name: "🐇 Save Alice (Mini-Boss)", time: "32–35 min" }
      ],

      // Mission 1: Follow the Rabbit (0–5 min)
      mission1: {
        introDialogue: [
          { speaker: "Rabbit", text: "Come on! Oh dear, I am late!", audio: "Come on! Oh dear, I am late!" },
          { speaker: "Alice", text: "Wait! Where are you going?", audio: "Wait! Where are you going?" }
        ],
        rabbitHopPrompt: "Tap the White Rabbit to follow him across the riverbank!",
        holeJumpPrompt: "Everybody JUMP into the rabbit hole!",
        kinestheticAction: "Physical classroom jump on 'JUMP!'"
      },

      // Mission 2: What Happened? (6 Story Event Cards)
      storyCards: [
        {
          order: 1,
          letter: "A",
          title: "By the River",
          icon: "🌳",
          text: "Alice sat by the river with her sister.",
          hint: "The river has tall green trees 🌳."
        },
        {
          order: 2,
          letter: "B",
          title: "White Rabbit",
          icon: "🐇",
          text: "A white rabbit ran past Alice.",
          hint: "A fast white rabbit with pink eyes 🐇."
        },
        {
          order: 3,
          letter: "C",
          title: "Into the Hole",
          icon: "🕳️",
          text: "The rabbit jumped down a large hole. Alice jumped in too.",
          hint: "The rabbit jumped into a dark hole 🕳️."
        },
        {
          order: 4,
          letter: "D",
          title: "Falling Down",
          icon: "🌀",
          text: "Alice fell down the hole. She fell for a long time.",
          hint: "Falling down, down, down through the air 🌀."
        },
        {
          order: 5,
          letter: "E",
          title: "Landing Softly",
          icon: "🌸",
          text: "Alice landed at the bottom of the hole.",
          hint: "Thump! Alice landed softly on dry leaves 🌸."
        },
        {
          order: 6,
          letter: "F",
          title: "Doors and Key",
          icon: "🔑",
          text: "Alice came to a room full of doors and found a little golden key.",
          hint: "A room of locked doors and a shiny key 🔑."
        }
      ],

      // Mission 4: Feeling Monster (4 Core Feelings)
      feelings: [
        {
          id: "surprised",
          name: "SURPRISED",
          emoji: "😮",
          color: "#06b6d4",
          gesture: "Wide eyes, open mouth, hands on cheeks!",
          speech: "I am surprised! Wow!"
        },
        {
          id: "bored",
          name: "BORED",
          emoji: "🥱",
          color: "#94a3b8",
          gesture: "Yawning, head resting on hand, sleepy eyes.",
          speech: "I am bored. There is nothing to do."
        },
        {
          id: "worried",
          name: "WORRIED",
          emoji: "😟",
          color: "#f43f5e",
          gesture: "Frowning, biting nails, anxious look.",
          speech: "I am worried! Oh no!"
        },
        {
          id: "interested",
          name: "INTERESTED",
          emoji: "👀",
          color: "#fbbf24",
          gesture: "Leaning forward, pointing, curious smile.",
          speech: "I am interested! That is so cool!"
        }
      ],

      // Mission 4 & 5 Situations
      feelingSituations: [
        {
          id: 1,
          situation: "The rabbit suddenly runs past Alice wearing a jacket and checking a watch!",
          icon: "🐇⌚",
          correctFeeling: "surprised",
          why: "Because rabbits do not usually wear clothes or check watches!"
        },
        {
          id: 2,
          situation: "Alice is sitting by the river with nothing to do while her sister reads a book without pictures.",
          icon: "🌳📖",
          correctFeeling: "bored",
          why: "Because her sister's book has no pictures or conversations!"
        },
        {
          id: 3,
          situation: "Alice sees a talking white rabbit run into a hole and wonders where it is going.",
          icon: "🕳️👀",
          correctFeeling: "interested",
          why: "Because she is curious and wants to know where the rabbit went!"
        },
        {
          id: 4,
          situation: "Alice is falling down the dark hole for a long time and does not know where she will land.",
          icon: "🌀😟",
          correctFeeling: "worried",
          why: "Because she is falling into the unknown and might get hurt!"
        }
      ],

      // Mission 6: What's Behind the Door? (Imagination)
      imaginationWorlds: [
        { id: "castle", name: "CASTLE", icon: "🏰", prompt: "A magic golden castle in the clouds!" },
        { id: "forest", name: "FOREST", icon: "🌳", prompt: "An enchanted forest with talking trees!" },
        { id: "dragon", name: "DRAGON", icon: "🐉", prompt: "A friendly green dragon who loves tea!" },
        { id: "space", name: "SPACE", icon: "🚀", prompt: "Outer space with purple stars and planets!" },
        { id: "dinosaurs", name: "DINOSAURS", icon: "🦖", prompt: "A prehistoric world with friendly baby dinosaurs!" },
        { id: "candy", name: "CANDY WORLD", icon: "🍭", prompt: "A sweet kingdom made of lollipop flowers!" },
        { id: "underwater", name: "UNDERWATER", icon: "🌊", prompt: "A sunken city with dancing dolphins!" }
      ]
    },

    // =========================================================================
    // LESSON 2: THE SKIMMING DETECTIVES (35 MIN)
    // Skimming = Look Quickly • Titles • Pictures • Important Information
    // =========================================================================
    lesson2: {
      id: "lesson2",
      title: "Lesson 2: The Skimming Detectives",
      tagline: "Look Quickly • Don't Read Every Word • Find Main Idea",
      targetTime: "35 Minutes",
      stages: [
        { id: 1, name: "👀 Don't Read — SKIM!", time: "0–5 min" },
        { id: 2, name: "🦅 Eagle Eyes", time: "5–10 min" },
        { id: 3, name: "🔎 Alice Speed Skim", time: "10–17 min" },
        { id: 4, name: "⚖️ Skim or Read?", time: "17–22 min" },
        { id: 5, name: "🧠 Main Idea Detective", time: "22–28 min" },
        { id: 6, name: "⚡ Brain Power", time: "28–32 min" },
        { id: 7, name: "🏆 Speed Skimmer Boss", time: "32–35 min" }
      ],

      // Mission 1: Don't Read (0–5 min)
      mission1: {
        seconds: 8,
        text: "Alice walked into the great hall. She saw a little wooden door behind a curtain. On the glass table was a tiny golden key. Outside the door was a lovely green garden with red flowers and a bunny.",
        choices: [
          { icon: "🚪", name: "Door", isCorrect: true },
          { icon: "🔑", name: "Key", isCorrect: true },
          { icon: "🌷", name: "Flowers", isCorrect: true },
          { icon: "🐰", name: "Bunny", isCorrect: true },
          { icon: "✈️", name: "Airplane", isCorrect: false },
          { icon: "🍕", name: "Pizza", isCorrect: false }
        ]
      },

      // Mission 2: Eagle Eyes (5–10 min)
      eagleKeywords: ["DOOR", "KEY", "GARDEN", "ALICE"],

      // Mission 3: Alice Speed Skim (Authentic Page 17 Content)
      page17Text: "Alice saw a little door. The door was only 38 centimeters high. She put the golden key into the lock. The door opened! Through the door, Alice saw a lovely garden full of colorful flowers. But Alice was too big to fit through the door. Poor Alice was very sad.",
      speedMissions: [
        {
          id: "number",
          title: "MISSION A: Find the NUMBER!",
          question: "How high was the little door?",
          options: [
            { text: "13 centimeters", isCorrect: false },
            { text: "38 centimeters", isCorrect: true, highlight: "38" },
            { text: "80 centimeters", isCorrect: false }
          ],
          clue: "Look for digits (0–9) in the text!"
        },
        {
          id: "object",
          title: "MISSION B: Find the OBJECT!",
          question: "What did Alice put into the lock?",
          options: [
            { text: "🔑 A golden key", isCorrect: true, highlight: "golden key" },
            { text: "⚽ A small ball", isCorrect: false },
            { text: "🎒 A school bag", isCorrect: false }
          ],
          clue: "Look for what turns a lock!"
        },
        {
          id: "location",
          title: "MISSION C: Find the PLACE!",
          question: "Where was behind the little door?",
          options: [
            { text: "🏫 A school room", isCorrect: false },
            { text: "🌷 A lovely garden", isCorrect: true, highlight: "lovely garden" },
            { text: "🏖️ A sandy beach", isCorrect: false }
          ],
          clue: "Look for colorful flowers!"
        }
      ],

      // Mission 4: Skim or Read? (17–22 min)
      scenarios: [
        {
          text: "I want to know what a whole book or article is about.",
          answer: "SKIM",
          icon: "🔎",
          reason: "Skimming gives you the big picture and main idea quickly!"
        },
        {
          text: "I want to find the exact telephone number of a doctor.",
          answer: "READ CAREFULLY",
          icon: "📖",
          reason: "If you skim a phone number, you might call the wrong person!"
        },
        {
          text: "I am at a restaurant and want to see if they sell ice cream.",
          answer: "SKIM",
          icon: "🔎",
          reason: "Quickly look down the dessert section for 'ice cream'!"
        },
        {
          text: "I am reading medicine instructions to see how many drops to take.",
          answer: "READ CAREFULLY",
          icon: "📖",
          reason: "Medicine dosages must be read carefully and accurately!"
        },
        {
          text: "I want to see if this story is about animals before I choose it.",
          answer: "SKIM",
          icon: "🔎",
          reason: "Look at the title and pictures to see if animals appear!"
        }
      ],

      // Mission 5: Main Idea Detective (Textbook "Learning and Your Brain")
      brainArticle: {
        title: "Learning and Your Brain",
        textChunk: "Did you know that your brain changes when you learn new things? Different parts of your brain help you read, remember, and solve problems. When you practice English, your brain builds strong new connections.",
        question: "Look at the title, picture, and keywords. What is the MAIN IDEA?",
        options: [
          { text: "1. The size and weight of the brain.", isCorrect: false },
          { text: "2. The different parts of the brain we use when we learn.", isCorrect: true },
          { text: "3. What the brain looks like from the outside.", isCorrect: false },
          { text: "4. What imagination is.", isCorrect: false }
        ]
      },

      // Mission 6: Brain Power (28–32 min)
      brainAbilities: [
        { name: "THINK", icon: "💡", sentence: "It can help me think and make good choices." },
        { name: "LEARN", icon: "📚", sentence: "It can help me learn English words and games." },
        { name: "REMEMBER", icon: "🧠", sentence: "It can help me remember where I put my keys." },
        { name: "SLEEP", icon: "🌙", sentence: "It helps my body rest and recharge every night." }
      ],

      // Final Boss: Speed Skimmer (32–35 min)
      finalBoss: {
        text: "Tom has a little robot. The robot cleans his room. It picks up toys and books. Tom loves his robot.",
        seconds: 12,
        questions: [
          { q: "WHO is in the story?", answer: "Tom and his robot" },
          { q: "WHAT does the robot do?", answer: "It cleans his room" },
          { q: "What is the MAIN IDEA?", answer: "Tom has a robot that helps him clean." }
        ]
      }
    },

    // =========================================================================
    // 8-DIMENSION TEACHER MODE HUD REFERENCE
    // =========================================================================
    teacherMode: {
      lesson1: [
        {
          name: "Follow the Rabbit",
          time: "0–5 min",
          objective: "Spark curiosity, introduce Alice and the White Rabbit, establish kinesthetic classroom energy.",
          setup: "Display River scene on Smartboard; have students stand up ready to jump.",
          teacherSays: "Look at the screen! Who is that? Tap the rabbit! Everybody... JUMP into the hole!",
          studentAction: "Tap moving rabbit on screen; physically jump into the classroom 'rabbit hole'.",
          answer: "Rabbit leads Alice to the rabbit hole.",
          noTechVersion: "Teacher hops like rabbit holding rabbit picture; students hop and jump.",
          extension: "Ask: 'Where is the rabbit going? What will happen next?'"
        },
        {
          name: "What Happened?",
          time: "5–10 min",
          objective: "Reconstruct Alice's 6 narrative events in chronological sequence using visual clues.",
          setup: "Show 6 illustrated picture cards without text.",
          teacherSays: "Look at the pictures! What happened first? Look for the river tree 🌳!",
          studentAction: "Drag pictures into slots 1 to 6; observe visual clues (🌳, 🐇, 🕳️, 🌀, 🌸, 🔑).",
          answer: "1. River -> 2. Rabbit -> 3. Hole -> 4. Fall -> 5. Land -> 6. Key.",
          noTechVersion: "Tape 6 large printed cards on whiteboard; students number them 1–6.",
          extension: "Students pair up and point to each card: 'First... Second... Third...'"
        },
        {
          name: "Human Alice",
          time: "10–15 min",
          objective: "Physically act out the 6-step sequence as a living story timeline.",
          setup: "Give 6 student volunteers one printed event card each.",
          teacherSays: "Fix Alice's story! Who is FIRST? River! Who is SECOND? Rabbit! Now, everybody ACT it out!",
          studentAction: "Volunteers stand in line; class directs order and pantomimes all 6 actions together.",
          answer: "Physical sequence matching 1 to 6.",
          noTechVersion: "Fully physical classroom theater activity.",
          extension: "Have a student 'director' give sequence commands: 'Scene 1, Action!'"
        },
        {
          name: "Feeling Monster",
          time: "15–22 min",
          objective: "Introduce 4 core emotions: worried, bored, surprised, interested through facial expression.",
          setup: "Display animated Feeling Monster character on screen.",
          teacherSays: "Meet Feeling Monster! Show me SURPRISED! Now show me BORED! FREEZE!",
          studentAction: "Mimic monster expressions; practice choral pronunciation of the 4 emotions.",
          answer: "Worried 😟, Bored 🥱, Surprised 😮, Interested 👀.",
          noTechVersion: "Teacher makes exaggerated faces; students guess the feeling word.",
          extension: "Game of 'Feeling Statues': teacher calls feeling; students freeze in that face."
        },
        {
          name: "Feeling Detective",
          time: "22–27 min",
          objective: "Connect situations from Alice's story to character feelings with simple 'Why?' justification.",
          setup: "Display 4 story situation cards.",
          teacherSays: "The rabbit has a watch! How does Alice feel? Why?",
          studentAction: "Tap correct feeling; speak: 'She is surprised because the rabbit has a watch!'",
          answer: "1. Surprised, 2. Bored, 3. Interested, 4. Worried.",
          noTechVersion: "Assign 4 classroom corners as feelings; students walk to their chosen feeling corner.",
          extension: "Pairs roleplay Alice speaking her feeling: 'Oh no, I am falling! I am worried!'"
        },
        {
          name: "What's Behind the Door?",
          time: "27–32 min",
          objective: "Stimulate imagination and connect to textbook discussion through mystery doors.",
          setup: "Display glowing golden mystery door with 7 world options.",
          teacherSays: "You found the golden key! Turn the lock! What's behind the door? What do you imagine?",
          studentAction: "Select an imagination world; complete sentence frame: 'Behind the door, I imagine a...'",
          answer: "Open creative response using imagination vocabulary.",
          noTechVersion: "Students sketch their imagined world on Page 3 of the worksheet.",
          extension: "Have students draw 2 strange objects inside their imagined world."
        },
        {
          name: "Save Alice (Mini-Boss)",
          time: "32–35 min",
          objective: "Consolidate Lesson 1 sequence and celebrate completion with 🏆 STORY MASTER badge.",
          setup: "Display scrambled card challenge with friendly 5-second countdown timer.",
          teacherSays: "The White Rabbit mixed up the cards! Quick, put them in order and save Alice!",
          studentAction: "Rapid sequence sorting; receive fanfare and Story Master badge.",
          answer: "Correct 1–6 chronological sequence.",
          noTechVersion: "Fast team card arrangement race on the classroom carpet.",
          extension: "Class chorally chants the entire 6-line story."
        }
      ],
      lesson2: [
        {
          name: "Don't Read — SKIM!",
          time: "0–5 min",
          objective: "Introduce the skimming concept: 'Skimming = LOOK QUICKLY. Don't read every word!'",
          setup: "Display short text with 8-second countdown timer.",
          teacherSays: "STOP! Don't read every word! LOOK QUICKLY! Ready... go!",
          studentAction: "Look at text for 8 seconds; after text blurs, tap pictures of objects seen.",
          answer: "Door, Key, Flowers, Bunny.",
          noTechVersion: "Flash a paper page for 8 seconds, turn it over, elicit remembered words.",
          extension: "Explain: 'Skimming is like taking a quick photograph with your eyes!'"
        },
        {
          name: "Eagle Eyes",
          time: "5–10 min",
          objective: "Train eyes to spot capitalized keywords and prominent nouns rapidly.",
          setup: "Project 10-second keyword detection challenge.",
          teacherSays: "Activate your Eagle Eyes! What words did you spot?",
          studentAction: "Spot DOOR, KEY, GARDEN, ALICE; unlock 👁️ EAGLE EYES badge.",
          answer: "DOOR, KEY, GARDEN, ALICE.",
          noTechVersion: "Spot-the-word circle game on whiteboard.",
          extension: "Challenge students to find the words in their paper books in under 5 seconds."
        },
        {
          name: "Alice Speed Skim",
          time: "10–17 min",
          objective: "Practice scanning authentic Page 17 reading text for numbers, objects, and places.",
          setup: "Display authentic Page 17 reading text with 15-second timer.",
          teacherSays: "Look for the NUMBER! Look for the OBJECT! Look for the PLACE!",
          studentAction: "Answer Mission A (38 cm), Mission B (golden key), Mission C (lovely garden).",
          answer: "38, golden key, garden.",
          noTechVersion: "Students use index fingers as 'Eagle Eyes' in the printed textbook.",
          extension: "Ask: 'Why was Alice sad?' (Because she was too big to fit through the door)."
        },
        {
          name: "Skim or Read?",
          time: "17–22 min",
          objective: "Differentiate between when to skim (gist/overview) and when to read carefully (details/safety).",
          setup: "Display Skimmer 🔎 vs Careful Reader 📖 icons; establish classroom movement sides.",
          teacherSays: "Do you want the main idea? SKIM! Do you need medicine instructions? READ CAREFULLY!",
          studentAction: "Move to SKIM side or READ side; justify choice.",
          answer: "1. Skim, 2. Read carefully, 3. Skim, 4. Read carefully, 5. Skim.",
          noTechVersion: "Students hold up 'SKIM' or 'READ' signs from Page 6 of the worksheet.",
          extension: "Students suggest their own real-life situation (e.g. reading a bus timetable)."
        },
        {
          name: "Main Idea Detective",
          time: "22–28 min",
          objective: "Identify the main idea using Title, Picture, and Keywords strategy.",
          setup: "Project 'Learning and Your Brain' reading passage from textbook Page 17.",
          teacherSays: "Look at the title! Look at the picture! What is the MAIN IDEA?",
          studentAction: "Select Choice 2: 'The different parts of the brain we use when we learn.'",
          answer: "Choice 2.",
          noTechVersion: "Underline the title with blue pencil; discuss in pairs.",
          extension: "Ask students: 'What does the brain do when you learn English?'"
        },
        {
          name: "Brain Power",
          time: "28–32 min",
          objective: "Apply brain function vocabulary (Think, Learn, Remember, Sleep) in speaking frames.",
          setup: "Display interactive Brain Power character.",
          teacherSays: "Say hello to Brain! What can your brain do? Complete: 'It can help me...'",
          studentAction: "Select brain abilities; practice: 'It can help me think/learn/remember.'",
          answer: "Think, Learn, Remember, Sleep.",
          noTechVersion: "Complete sentence frame on Page 4 of the printed worksheet.",
          extension: "Brain workout: Quick memory game of 4 English words."
        },
        {
          name: "Speed Skimmer Boss",
          time: "32–35 min",
          objective: "Apply all skimming strategies to a fresh A1 text in a fun 12-second boss battle.",
          setup: "Display 'Tom's Robot' text with countdown timer.",
          teacherSays: "Final Boss! Skim the robot story in 12 seconds! Who? What? Main idea?",
          studentAction: "Answer WHO, WHAT, and MAIN IDEA; defeat boss and unlock ⚡ SPEED SKIMMER badge.",
          answer: "Tom & robot; cleans room; robot cleans room.",
          noTechVersion: "Teacher reads text once quickly; students write 3 keywords on mini-whiteboards.",
          extension: "Award final Master Reader certificates."
        }
      ]
    }
  };

  root.ALICE_DATA = ALICE_DATA;
})(window);
