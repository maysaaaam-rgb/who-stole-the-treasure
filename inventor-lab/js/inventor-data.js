/**
 * INVENTOR LAB — LESSON DATA & CURRICULUM ASSETS
 * Based on Global Readings Unit 1: "What Does It Do? / What Does It Take to Be an Inventor?"
 * Integrating Textbook Pages 08, 09, 10, 11, 12, 13, 14, 15.
 */

(function(root) {
  'use strict';

  const INVENTOR_DATA = {
    // Lesson Meta
    meta: {
      title: "INVENTOR LAB: What Does It Take to Be an Inventor?",
      unit: "Unit 1: What Does It Do?",
      targetAge: "Ages 8–12 (A1+/A2 Young Learners)",
      duration: "45–50 minutes",
      totalStages: 9
    },

    // Stage 2: Mystery Picture Hotspots (page_08.jpg)
    hotspots: [
      {
        id: "boy",
        x: 48,
        y: 44,
        title: "The Young Thinker",
        icon: "👦",
        prompt: "Who is he? What is he wearing and doing?",
        detail: "He is wearing overalls and spectacles, reading deeply from an antique book in a rocking chair.",
        sentence: "I see a boy reading an old book."
      },
      {
        id: "robot",
        x: 76,
        y: 31,
        title: "The Robot Silhouette",
        icon: "🤖",
        prompt: "Look at the window sill! What is that?",
        detail: "A small mechanical robot standing against the evening window glow. Did the boy build it?",
        sentence: "There's a small robot on the window sill."
      },
      {
        id: "books",
        x: 33,
        y: 20,
        title: "Towering Bookshelves",
        icon: "📚",
        prompt: "Why are there so many books?",
        detail: "Dozens of heavy vintage volumes on engineering, science, and history. Inventors read to get ideas!",
        sentence: "I see many thick books on the tall shelves."
      },
      {
        id: "lamp",
        x: 74,
        y: 13,
        title: "Workshop Lamp & Wires",
        icon: "💡",
        prompt: "How does the room stay bright at night?",
        detail: "An electric desk lamp with hanging wires. The electric light bulb was one of history's greatest inventions!",
        sentence: "I see a glowing lamp lighting up the room."
      },
      {
        id: "cup",
        x: 87,
        y: 45,
        title: "Cozy Teacup on Crate",
        icon: "☕",
        prompt: "Why is there a cup of tea here?",
        detail: "A blue teacup on a wooden crate. Inventors spend hours working, thinking, and experimenting.",
        sentence: "I see a blue teacup resting on a wooden crate."
      },
      {
        id: "floorBooks",
        x: 38,
        y: 90,
        title: "Floor Research Piles",
        icon: "📖",
        prompt: "Look under the rocking chair!",
        detail: "More open books scattered on the floor. It looks like a busy inventor's active study!",
        sentence: "I see books piled on the wooden floor."
      }
    ],

    // Stage 3: See, Think, Wonder Routine
    seeThinkWonderItems: [
      {
        id: "stw-1",
        text: "A boy wearing glasses reading an old book",
        category: "see",
        icon: "👓",
        hint: "You can see this clearly with your own eyes!"
      },
      {
        id: "stw-2",
        text: "A small robot standing by the window",
        category: "see",
        icon: "🤖",
        hint: "Look at the window sill silhouette."
      },
      {
        id: "stw-3",
        text: "A blue teacup resting on a wooden box",
        category: "see",
        icon: "☕",
        hint: "Directly visible next to the rocking chair."
      },
      {
        id: "stw-4",
        text: "He is very smart and curious about science",
        category: "think",
        icon: "🧠",
        hint: "This is a clever guess based on his books and focus."
      },
      {
        id: "stw-5",
        text: "He wants to build something new",
        category: "think",
        icon: "🛠️",
        hint: "He is studying hard to make things work."
      },
      {
        id: "stw-6",
        text: "The books on the shelves are very old",
        category: "think",
        icon: "📜",
        hint: "Based on their leather covers and golden titles."
      },
      {
        id: "stw-7",
        text: "Maybe the robot can talk and walk at night!",
        category: "wonder",
        icon: "✨",
        hint: "An imaginative thought about what could happen."
      },
      {
        id: "stw-8",
        text: "Maybe he has a secret workshop behind the bookcase!",
        category: "wonder",
        icon: "🚪",
        hint: "A fun and mysterious possibility."
      },
      {
        id: "stw-9",
        text: "How old is the robot? Who invented it?",
        category: "wonder",
        icon: "❓",
        hint: "A curious question that makes us wonder."
      }
    ],

    // Stage 3: Sentence Builder Options
    sentenceBuilderReasons: [
      { id: "r1", label: "he reads books about machines", text: "I think he is an inventor because he reads books about machines." },
      { id: "r2", label: "he built a small robot", text: "I think he is an inventor because he built a small robot." },
      { id: "r3", label: "he is looking for new ideas", text: "I think he is an inventor because he is looking for new ideas." },
      { id: "r4", label: "he has many tools and blueprints", text: "I think he is an inventor because he has many tools and blueprints." }
    ],

    // Stage 4: What Do Inventors Do First? (Textbook Page 9 E)
    firstStepQuiz: {
      question: "Which of these things do you think inventors do first?",
      options: [
        {
          id: "opt-draw",
          text: "1. Draw a picture.",
          correct: false,
          feedback: "Drawing a picture is step 2! Before you draw, you need an idea in your head!"
        },
        {
          id: "opt-change",
          text: "2. Make changes.",
          correct: false,
          feedback: "Making changes happens when you test! You cannot make changes before having an idea!"
        },
        {
          id: "opt-idea",
          text: "3. Have ideas.",
          correct: true,
          feedback: "YES! 💡 Every invention in human history starts with a spark of an IDEA!"
        }
      ]
    },

    // Stage 4: 5-Stage Invention Cycle
    inventionCycle: [
      {
        step: 1,
        title: "Have an Idea",
        icon: "💡",
        color: "#f59e0b",
        desc: "Inventors notice a problem or imagine something new that nobody has made before.",
        example: "Example: Clara notices her homework gets wet in the rain."
      },
      {
        step: 2,
        title: "Draw a Plan",
        icon: "📝",
        color: "#06b6d4",
        desc: "Inventors sketch blueprints, write notes, and plan the parts they need.",
        example: "Example: Clara draws an umbrella attached to a pen."
      },
      {
        step: 3,
        title: "Try It & Build It",
        icon: "🛠️",
        color: "#10b981",
        desc: "Inventors gather materials and build a first test model (a prototype).",
        example: "Example: Clara builds rain glasses and tries them outside."
      },
      {
        step: 4,
        title: "Make Changes",
        icon: "🔧",
        color: "#8b5cf6",
        desc: "CRUCIAL! If it fails or breaks, inventors don't quit. They change and redesign it!",
        example: "Example: Clara says: 'OK. Some ideas are not so good ... but I always try again!'"
      },
      {
        step: 5,
        title: "Solve Problems",
        icon: "🚀",
        color: "#ec4899",
        desc: "The improved invention works! It helps people, saves time, or makes life fun.",
        example: "Example: Clara's clean-up machine helps clean up messy bedrooms!"
      }
    ],

    // Stage 5: Guided Reading — Clara Doodle Story Passages & Evidence
    claraStory: {
      title: "The After-School Inventor",
      author: "Global Readings Unit 1",
      passages: [
        {
          page: 10,
          image: "../assets/books/global-readings-2/page_10.jpg",
          textLines: [
            { id: "line-1", text: "My name is Clara Doodle." },
            { id: "line-2", text: "I invent things after school.", key: "clara-when" },
            { id: "line-3", text: "I have a lot of new ideas and some of them are cool." }
          ]
        },
        {
          page: 11,
          image: "../assets/books/global-readings-2/page_11.jpg",
          textLines: [
            { id: "line-4", text: "Here are my rain glasses and my umbrella pen.", key: "clara-rain" },
            { id: "line-5", text: "OK. Some ideas are not so good ...", key: "clara-fail" },
            { id: "line-6", text: "... but I always try again!", key: "clara-try-again" }
          ]
        },
        {
          page: 12,
          image: "../assets/books/global-readings-2/page_12.jpg",
          textLines: [
            { id: "line-7", text: "When I have an idea, I always make a plan.", key: "clara-plan" },
            { id: "line-8", text: "I draw and change, and change and draw." },
            { id: "line-9", text: "I do the best I can." }
          ]
        },
        {
          page: 13,
          image: "../assets/books/global-readings-2/page_13.jpg",
          textLines: [
            { id: "line-10", text: "Here's my smart eraser. It tells me when I'm wrong." },
            { id: "line-11", text: "And my alarm clock pillow wakes me with a song." }
          ]
        },
        {
          page: 15,
          image: "../assets/books/global-readings-2/page_15.jpg",
          textLines: [
            { id: "line-12", text: "Mom says my room's a mess, but I don't like to clean." },
            { id: "line-13", text: "Here's my new invention ... it's a big clean-up machine!", key: "clara-clean" }
          ]
        }
      ],

      // Words in context (Page 11 bottom glossary)
      glossary: [
        { word: "invent", def: "To design or create something completely new that didn't exist before.", icon: "💡" },
        { word: "try again", def: "To attempt something another time after it doesn't work.", icon: "🔄" },
        { word: "change", def: "To make something different, better, or improved.", icon: "🔧" },
        { word: "invention", def: "A new machine, tool, or process created by an inventor.", icon: "⚙️" },
        { word: "machine", def: "A piece of equipment with moving parts that does work.", icon: "🤖" },
        { word: "mess", def: "A dirty or untidy state with things scattered everywhere.", icon: "📦" },
        { word: "mirror", def: "A shiny glass surface that reflects your reflection.", icon: "🪞" },
        { word: "plan", def: "A drawing or list of steps decided beforehand.", icon: "📝" }
      ],

      // Evidence Detective Missions
      evidenceMissions: [
        {
          id: "m1",
          question: "When does Clara invent things?",
          targetKey: "clara-when",
          targetLineId: "line-2",
          expectedText: "I invent things after school.",
          explanation: "Spot on! Clara invents things after school when she finishes her classes."
        },
        {
          id: "m2",
          question: "What two things did she invent for rainy days?",
          targetKey: "clara-rain",
          targetLineId: "line-4",
          expectedText: "Here are my rain glasses and my umbrella pen.",
          explanation: "Great job! She invented rain glasses and an umbrella pen for rainy days."
        },
        {
          id: "m3",
          question: "What does Clara do when her idea is not so good?",
          targetKey: "clara-fail",
          targetLineId: "line-6",
          expectedText: "... but I always try again!",
          explanation: "Golden rule of inventors! She does not give up—she always tries again!"
        },
        {
          id: "m4",
          question: "What does Clara do before building her invention?",
          targetKey: "clara-plan",
          targetLineId: "line-7",
          expectedText: "When I have an idea, I always make a plan.",
          explanation: "Inventors always plan first! She draws and plans before she starts building."
        },
        {
          id: "m5",
          question: "What machine did Clara invent to solve her messy room problem?",
          targetKey: "clara-clean",
          targetLineId: "line-13",
          expectedText: "Here's my new invention ... it's a big clean-up machine!",
          explanation: "Brilliant! She invented a big clean-up machine to clean her room."
        }
      ]
    },

    // Stage 6: Fast-Paced Binary Sorting "Inventor or Not?"
    inventorScenarios: [
      {
        id: "sc-1",
        title: "Leo & The Cardboard Robot",
        text: "Leo builds a cardboard robot. The arms fall off. He throws it in the trash and cries: 'I give up! This is impossible!'",
        isInventor: false,
        badge: "❌ NOT AN INVENTOR MINDSET",
        reason: "Inventors don't throw things away and quit when parts break. They fix them and try again!"
      },
      {
        id: "sc-2",
        title: "Maya & The Sinking Toy Boat",
        text: "Maya makes a toy boat. It sinks in the bathtub. She attaches corks to the sides and tests it again until it floats.",
        isInventor: true,
        badge: "💡 TRUE INVENTOR MINDSET",
        reason: "Maya tests, notices the problem, makes changes, and succeeds!"
      },
      {
        id: "sc-3",
        title: "Sam & The Night Reader",
        text: "Sam wants to read in bed in the dark without waking his brother. He tapes a small LED flashlight to his glasses.",
        isInventor: true,
        badge: "💡 TRUE INVENTOR MINDSET",
        reason: "Sam noticed a daily problem and created a clever new wearable solution!"
      },
      {
        id: "sc-4",
        title: "Emma & The Video Game",
        text: "Emma buys a new video game and plays it for 6 hours straight without wondering how the graphics or controls were made.",
        isInventor: false,
        badge: "❌ NOT AN INVENTOR MINDSET",
        reason: "Playing is fun, but inventors are curious about how machines and programs work!"
      },
      {
        id: "sc-5",
        title: "Carlos & The Spilling Dog Bowl",
        text: "Carlos notices his clumsy puppy keeps kicking over its water bowl. He designs a wide, heavy wooden stand that won't flip.",
        isInventor: true,
        badge: "💡 TRUE INVENTOR MINDSET",
        reason: "Carlos solved a real household problem by designing something useful!"
      },
      {
        id: "sc-6",
        title: "Aisha & The Paper Plane",
        text: "Aisha folds a paper plane. It drops straight down. She changes the wing folds 8 times until it glides across the entire room.",
        isInventor: true,
        badge: "💡 TRUE INVENTOR MINDSET",
        reason: "Aisha demonstrated persistence, testing, and redesigning—just like aerospace engineers!"
      },
      {
        id: "sc-7",
        title: "Ben & The Broken Clock",
        text: "Ben drops his desk clock. The battery cover pops off. He leaves it broken under his bed for six months.",
        isInventor: false,
        badge: "❌ NOT AN INVENTOR MINDSET",
        reason: "Inventors love taking things apart and fixing them, not ignoring problems!"
      },
      {
        id: "sc-8",
        title: "Zara & The Rainy Bike",
        text: "Zara clamps a mini clear umbrella bracket to her bike handlebars so her hands and jacket stay dry in the rain.",
        isInventor: true,
        badge: "💡 TRUE INVENTOR MINDSET",
        reason: "Zara combined two existing items (bike + umbrella) to create an awesome new invention!"
      }
    ],

    // Stage 7: Problem-Solving Dilemma — Heavy Backpack
    dilemma: {
      title: "The Heavy Backpack Dilemma",
      problem: "Every morning, students have to carry 12 heavy textbooks and notebooks to school. Their backs and shoulders ache!",
      step1Title: "Step 1: Brainstorm an Invention Idea",
      ideas: [
        {
          id: "d-rocket",
          name: "🚀 Mini Rocket Boosters",
          desc: "Strap rocket thrusters to the backpack to fly to school!",
          pros: "Super fast and exciting!",
          cons: "Dangerous! Might burn your shoes or hit a tree!",
          viable: false
        },
        {
          id: "d-wheels",
          name: "🛞 Fold-Out Wheels & Telescopic Handle",
          desc: "Add sturdy rubber wheels and a pull handle to roll it like a suitcase.",
          pros: "Easy to roll, saves your back, safe!",
          cons: "What happens when it rains or gets muddy?",
          viable: true
        },
        {
          id: "d-helium",
          name: "🎈 Giant Helium Balloons",
          desc: "Attach 10 giant floating balloons to lift the bag off the ground.",
          pros: "Very light, floats in the air.",
          cons: "A strong wind might blow your backpack into the clouds!",
          viable: false
        }
      ],
      testFailScenario: {
        title: "Oh No! The First Test Failed!",
        text: "You built the wheeled backpack! It rolls smoothly on dry sidewalks. But on Wednesday it rains! Mud and dirty water splash all over your white school socks and uniform!",
        question: "What should a true inventor do now?",
        options: [
          {
            id: "fail-quit",
            text: "Throw the backpack away and carry 12 heavy books again.",
            correct: false,
            feedback: "No! Remember Clara Doodle: Inventors never just quit!"
          },
          {
            id: "fail-change",
            text: "MAKE CHANGES! Add clip-on mudguards and a waterproof rain cover!",
            correct: true,
            feedback: "EXCELLENT! 🔧 You made changes, tested again, and created the perfect invention!"
          }
        ]
      }
    },

    // Stage 8: Invention Studio Builder Matrix
    builder: {
      bodies: [
        { id: "b-robot", name: "Helper Robot", icon: "🤖", desc: "A friendly metal companion with glowing eyes and articulated joints." },
        { id: "b-drone", name: "Hover Drone", icon: "🛸", desc: "A sleek flying vehicle with 4 silent propellers and GPS." },
        { id: "b-backpack", name: "Smart Backpack", icon: "🎒", desc: "An intelligent wearable pack with automated storage compartments." },
        { id: "b-box", name: "Magic Mystery Box", icon: "📦", desc: "A compact desktop unit with touch screen and robotic drawer." }
      ],
      functions: [
        { id: "f-clean", name: "Clean up messy rooms", icon: "🧹", action: "clean messy bedrooms and organize clothes", helps: "parents and busy students" },
        { id: "f-hw", name: "Help with difficult homework", icon: "📚", action: "explain difficult math and science problems step by step", helps: "students who want to learn faster" },
        { id: "f-find", name: "Find lost toys and keys", icon: "🔍", action: "scan the house to locate lost pencils, books, and keys", helps: "forgetful people" },
        { id: "f-snack", name: "Make delicious healthy snacks", icon: "🥪", action: "prepare fresh smoothies and warm toast in 10 seconds", helps: "hungry kids after school" },
        { id: "f-rain", name: "Protect from heavy rain & wind", icon: "🛡️", action: "open an invisible warm shield against rain", helps: "walkers in bad weather" },
        { id: "f-music", name: "Play cheerful songs and tell jokes", icon: "🎵", action: "play happy music and tell funny jokes when you are sad", helps: "cheer up everyone" }
      ],
      features: [
        { id: "ft-wings", name: "Turbo Wings", icon: "🪽", desc: "Retractable wings that glide through the sky smoothly." },
        { id: "ft-arms", name: "Robotic Grabber Arms", icon: "🦾", desc: "Extendable mechanical arms that pick up heavy items." },
        { id: "ft-light", name: "Night-Vision Beam", icon: "💡", desc: "Ultra-bright light that illuminates dark rooms." },
        { id: "ft-voice", name: "Polite Talking Speaker", icon: "🔊", desc: "Speaks 5 languages with a friendly AI voice." },
        { id: "ft-solar", name: "Solar Power Panels", icon: "🔋", desc: "Recharges automatically from sunlight." },
        { id: "ft-wheels", name: "All-Terrain Wheels", icon: "🛞", desc: "Climbs stairs, mud, grass, and rocky ground easily." }
      ],
      nameSuggestions: [
        "The Robo-Tidy 3000",
        "The Homework Hero",
        "The Sky-Glider Pro",
        "The Pocket Helper",
        "The Rain-Buster 500",
        "The Snack-O-Matic",
        "The Wonder-Bot X"
      ]
    },

    // Stage 9: Pitch Awards & Graduation
    pitchAwards: [
      { id: "aw-useful", title: "Most Useful", icon: "🏆", color: "#3b82f6" },
      { id: "aw-creative", title: "Most Creative", icon: "💡", color: "#f59e0b" },
      { id: "aw-funny", title: "Funniest Idea", icon: "😂", color: "#10b981" },
      { id: "aw-tech", title: "Best Future Tech", icon: "🚀", color: "#8b5cf6" },
      { id: "aw-star", title: "Classroom Favorite", icon: "🌟", color: "#ec4899" }
    ],

    goldenRules: [
      { rule: "1. Inventors have ideas.", icon: "💡", desc: "Everything starts with imagination and curiosity." },
      { rule: "2. Inventors make a plan.", icon: "📝", desc: "They draw sketches and plan before building." },
      { rule: "3. Inventors try and build.", icon: "🛠️", desc: "They test real materials and models." },
      { rule: "4. Inventors make changes.", icon: "🔧", desc: "When something fails, they change and improve it." },
      { rule: "5. Inventors NEVER give up!", icon: "🚀", desc: "They always try again until they succeed!" }
    ]
  };

  root.INVENTOR_DATA = INVENTOR_DATA;

})(typeof window !== 'undefined' ? window : this);
