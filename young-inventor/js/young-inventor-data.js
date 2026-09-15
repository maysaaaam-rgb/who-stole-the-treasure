/**
 * YOUNG INVENTOR ACADEMY — STRUCTURED CURRICULUM DATA
 * Grade 4 A1+ • Based on "My Good Ideas Book", Unit 1, pages 18–21
 * Problem → Idea → Invention → Improvement → Presentation
 */

(function(root) {
  'use strict';

  const YOUNG_INVENTOR_DATA = {
    meta: {
      title: "Young Inventor Academy",
      subtitle: "From Problem → Idea → Invention → Improvement → Presentation",
      unit: "My Good Ideas Book • Unit 1",
      grade: "Grade 4",
      level: "CEFR A1+",
      duration: "35–45 minutes per lesson",
      maxXP: 100,
      totalMissions: 10
    },

    // Mission Map Overview
    missionMap: [
      { id: 1, name: "Inventor Detectives", icon: "🔍", desc: "Find the Problem", xp: 10 },
      { id: 2, name: "Idea Lab", icon: "💡", desc: "Find a Solution", xp: 10 },
      { id: 3, name: "Idea Hunters", icon: "🌱", desc: "Nature & Old Things", xp: 10 },
      { id: 4, name: "Inventor Workshop", icon: "🎨", desc: "Design & Draw", xp: 10 },
      { id: 5, name: "Invention Builder", icon: "⚙️", desc: "Build the Prototype", xp: 10 },
      { id: 6, name: "What Can It Do?", icon: "🚀", desc: "CAN & CAN'T Abilities", xp: 10 },
      { id: 7, name: "How Does It Work?", icon: "📋", desc: "Simple Instructions", xp: 10 },
      { id: 8, name: "Test Lab", icon: "🧪", desc: "Test the Prototype", xp: 10 },
      { id: 9, name: "Make It Better!", icon: "🔧", desc: "Improve & Upgrade", xp: 10 },
      { id: 10, name: "Presentation & Expo", icon: "🏆", desc: "Present to the World", xp: 20 }
    ],

    // =========================================================================
    // MISSION 1: INVENTOR DETECTIVES (Find the Problem)
    // =========================================================================
    mission1: {
      title: "INVENTOR DETECTIVES",
      subtitle: "Every invention starts with a problem!",
      robotPrompt: "Look at the classroom scene! What is the problem? Choose the best answer!",
      definition: {
        term: "PROBLEM",
        meaning: "Something that is difficult or needs to be fixed.",
        icon: "⚠️"
      },
      scenes: [
        {
          id: "p1",
          title: "The Rolling Pencil",
          icon: "✏️💨",
          prompt: "The pencil rolls off the table onto the floor.",
          question: "What is the problem?",
          options: [
            { text: "The pencil falls from the desk.", correct: true },
            { text: "The pencil can fly.", correct: false },
            { text: "The desk is blue.", correct: false }
          ],
          audioClue: "The pencil rolls off the table. The pencil falls from the desk."
        },
        {
          id: "p2",
          title: "The Heavy Backpack",
          icon: "🎒🏋️",
          prompt: "The student is bent over carrying ten thick books.",
          question: "What is the problem?",
          options: [
            { text: "The school bag is too heavy.", correct: true },
            { text: "The school bag has wheels.", correct: false },
            { text: "The bag is singing.", correct: false }
          ],
          audioClue: "Ouch! The student's back hurts. The school bag is too heavy."
        },
        {
          id: "p3",
          title: "Muddy Shoes",
          icon: "👟🍂",
          prompt: "Mud sticks to the shoes after playing outside in the garden.",
          question: "What is the problem?",
          options: [
            { text: "The shoes are dirty.", correct: true },
            { text: "The shoes are made of gold.", correct: false },
            { text: "The shoes can run fast.", correct: false }
          ],
          audioClue: "Look at the mud! The shoes are dirty."
        },
        {
          id: "p4",
          title: "Lost Pencil Case",
          icon: "🔍📦",
          prompt: "The student looks everywhere inside the desk but cannot find the pencil.",
          question: "What is the problem?",
          options: [
            { text: "The student loses the pencil.", correct: true },
            { text: "The pencil has bright lights.", correct: false },
            { text: "The desk is empty.", correct: false }
          ],
          audioClue: "Where is it? The student loses the pencil."
        },
        {
          id: "p5",
          title: "Messy Study Table",
          icon: "📚🌪️",
          prompt: "Papers, scissors, rulers, and markers are everywhere on the table.",
          question: "What is the problem?",
          options: [
            { text: "The study desk is messy.", correct: true },
            { text: "The room is sparkling clean.", correct: false },
            { text: "The books can cook dinner.", correct: false }
          ],
          audioClue: "What a mess! The study desk is messy."
        },
        {
          id: "p6",
          title: "Rainy Walk",
          icon: "🌧️👧",
          prompt: "The rain is pouring and water drips on the student's clothes.",
          question: "What is the problem?",
          options: [
            { text: "The student gets wet in the rain.", correct: true },
            { text: "The rain is warm orange juice.", correct: false },
            { text: "The umbrella is flying.", correct: false }
          ],
          audioClue: "Splish splash! The student gets wet in the rain."
        },
        {
          id: "p7",
          title: "Dropping Books",
          icon: "📖💥",
          prompt: "Carrying a tall stack of books, they tumble to the floor.",
          question: "What is the problem?",
          options: [
            { text: "Too many books to carry.", correct: true },
            { text: "The books can swim.", correct: false },
            { text: "The floor is soft bread.", correct: false }
          ],
          audioClue: "Crash! There are too many books to carry."
        },
        {
          id: "p8",
          title: "Cold Lunch Box",
          icon: "🍱❄️",
          prompt: "The soup and pasta are cold by lunchtime at school.",
          question: "What is the problem?",
          options: [
            { text: "The food is cold.", correct: true },
            { text: "The food has giant wheels.", correct: false },
            { text: "The lunchbox is a computer.", correct: false }
          ],
          audioClue: "Brrr! The food is cold."
        }
      ]
    },

    // =========================================================================
    // MISSION 2: IDEA LAB (Find a Solution)
    // =========================================================================
    mission2: {
      title: "IDEA LAB",
      subtitle: "A solution is an idea that fixes a problem!",
      robotPrompt: "Thomas Edison had hundreds of notebooks filled with ideas. Connect each problem to its smart invention solution!",
      definition: {
        term: "SOLUTION",
        meaning: "An idea or invention that fixes a problem.",
        icon: "💡"
      },
      matchingPairs: [
        {
          id: "sol-shoe",
          problemText: "Dirty Muddy Shoes",
          problemIcon: "👟🍂",
          solutionText: "Automatic Shoe Cleaner",
          solutionIcon: "👞✨",
          explanation: "It cleans the shoes automatically when you step on it!"
        },
        {
          id: "sol-bag",
          problemText: "Heavy Backpack",
          problemIcon: "🎒🏋️",
          solutionText: "Smart Rolling Bag with Wheels",
          solutionIcon: "🎒⚙️",
          explanation: "It has wheels and follows you so your back does not hurt!"
        },
        {
          id: "sol-pencil",
          problemText: "Lost Pencils",
          problemIcon: "✏️❓",
          solutionText: "Pencil Radar Beeper",
          solutionIcon: "📡✏️",
          explanation: "Press a button and the pencil beeps and glows!"
        },
        {
          id: "sol-room",
          problemText: "Messy Study Table",
          problemIcon: "📚🌪️",
          solutionText: "Desk Organizer Robot",
          solutionIcon: "🤖📦",
          explanation: "The robot arm picks up pencils and stacks the books neatly!"
        }
      ],
      brainstormChallenge: {
        problem: "Pencils fall off the desk!",
        question: "Which invention idea is the most useful?",
        choices: [
          { text: "Magnetic Desk Grip (sticks pencils safely)", useful: true, icon: "🧲" },
          { text: "Clip-on Pencil Cradle", useful: true, icon: "📎" },
          { text: "Pencil-Eating Monster", useful: false, icon: "👾" },
          { text: "Desk with soft safety net", useful: true, icon: "🕸️" }
        ]
      }
    },

    // =========================================================================
    // MISSION 3: IDEA HUNTERS (Nature & Old Things)
    // =========================================================================
    mission3: {
      title: "IDEA HUNTERS",
      subtitle: "Where do great ideas come from? Look at nature & old things!",
      robotPrompt: "Biomimicry! Nature already invented amazing solutions. Let's explore how animals and plants inspired real inventions!",
      natureExamples: [
        {
          id: "kingfisher",
          sourceName: "Kingfisher Bird 🐦",
          sourceIcon: "🐦",
          sourceDesc: "Kingfishers dive at high speed into water with zero splash because of their sleek, pointed beak shape.",
          arrow: "➔",
          inventionName: "Shinkansen Bullet Train 🚆",
          inventionIcon: "🚆",
          inventionDesc: "Engineers designed the front of the fastest bullet train in Japan like the kingfisher beak to stop loud sonic booms in tunnels!",
          keySentence: "The train shape is like the kingfisher beak."
        },
        {
          id: "plant",
          sourceName: "Sticky Burdock Plant 🌱",
          sourceIcon: "🌱",
          sourceDesc: "Tiny microscopic hooks on burdock seeds stick tenaciously to dog fur and socks.",
          arrow: "➔",
          inventionName: "Velcro Sticky Shoes 👟",
          inventionIcon: "👟",
          inventionDesc: "George de Mestral saw this in nature and invented Velcro straps for shoes and clothes that stick instantly without laces!",
          keySentence: "This shoe sticks like the plant."
        },
        {
          id: "old-things",
          sourceName: "Old Plastic Bottles & Fabric ♻️",
          sourceIcon: "♻️",
          sourceDesc: "Empty water bottles and leftover denim fabric waiting in the recycling bin.",
          arrow: "➔",
          inventionName: "Eco-Friendly Backpack 🎒",
          inventionIcon: "🎒",
          inventionDesc: "Using old things to make something brand new and super strong!",
          keySentence: "Use old things to make something new."
        }
      ],
      quiz: [
        {
          question: "The kingfisher's beak inspired the shape of the...",
          options: ["Bullet Train 🚆", "Pencil Box 📦", "Umbrella ☂️"],
          correct: "Bullet Train 🚆"
        },
        {
          question: "The sticky burdock plant inspired...",
          options: ["Velcro Shoe Straps 👟", "A loud whistle 📢", "A glass cup 🥤"],
          correct: "Velcro Shoe Straps 👟"
        },
        {
          question: "When you use old plastic bottles to make a new bag, you...",
          options: ["Use old things to make something new ♻️", "Throw things in the river 🌊", "Forget your homework 📝"],
          correct: "Use old things to make something new ♻️"
        }
      ]
    },

    // =========================================================================
    // MISSION 4: INVENTOR WORKSHOP (Design & Draw)
    // =========================================================================
    mission4: {
      title: "INVENTOR WORKSHOP",
      subtitle: "Draw a picture of your idea. Drawing helps you see your idea!",
      robotPrompt: "Step 1: Choose a problem. Step 2: Name your invention. Step 3: Draw your blueprint on the drawing board!",
      problemPresets: [
        { id: "prob-bag", name: "Heavy School Bag", icon: "🎒", defaultInvention: "Super Rolling Backpack 3000" },
        { id: "prob-shoes", name: "Dirty Muddy Shoes", icon: "👟", defaultInvention: "Auto-Clean Step Station" },
        { id: "prob-pencil", name: "Lost Pencils & Rulers", icon: "✏️", defaultInvention: "Pencil Radar Finder" },
        { id: "prob-desk", name: "Messy Study Table", icon: "📚", defaultInvention: "Robo-Tidy Organizer" },
        { id: "prob-rain", name: "Wet Clothes in Rain", icon: "🌧️", defaultInvention: "Bubble Shield Umbrella" },
        { id: "prob-lunch", name: "Cold School Lunch", icon: "🍱", defaultInvention: "Solar Thermo Lunchbox" }
      ],
      canvasColors: ["#38bdf8", "#f59e0b", "#10b981", "#ec4899", "#a855f7", "#ffffff"],
      tips: [
        "Drawing helps you see your idea.",
        "Add labels with arrows to show what parts do.",
        "Don't worry about perfection — great inventors sketch quickly!"
      ]
    },

    // =========================================================================
    // MISSION 5: INVENTION BUILDER (Build the Prototype)
    // =========================================================================
    mission5: {
      title: "INVENTION BUILDER",
      subtitle: "Snap components together to construct your prototype!",
      robotPrompt: "Drag or tap parts from the workshop shelf into the central assembly pod. Watch the sentences generate automatically!",
      grammarFocus: "IT HAS + NOUN PHRASE",
      components: [
        { id: "comp-wheels", name: "Rubber Wheels", icon: "⚙️", countNoun: "two wheels", sentence: "It has two wheels." },
        { id: "comp-wings", name: "Solar Wings", icon: "🪽", countNoun: "wings", sentence: "It has wings." },
        { id: "comp-buttons", name: "Action Buttons", icon: "🔘", countNoun: "three buttons", sentence: "It has three buttons." },
        { id: "comp-screen", name: "Digital Screen", icon: "🖥️", countNoun: "a large screen", sentence: "It has a large screen." },
        { id: "comp-battery", name: "Rechargeable Battery", icon: "🔋", countNoun: "a battery", sentence: "It has a battery." },
        { id: "comp-arm", name: "Robotic Grab Arm", icon: "🦾", countNoun: "a robotic arm", sentence: "It has a robotic arm." },
        { id: "comp-basket", name: "Storage Basket", icon: "🧺", countNoun: "a storage basket", sentence: "It has a storage basket." },
        { id: "comp-handle", name: "Telescopic Handle", icon: "🧰", countNoun: "a strong handle", sentence: "It has a strong handle." },
        { id: "comp-sensor", name: "Radar Sensor", icon: "📡", countNoun: "an obstacle sensor", sentence: "It has an obstacle sensor." },
        { id: "comp-fan", name: "Cooling Propeller", icon: "🪭", countNoun: "a propeller fan", sentence: "It has a cooling fan." },
        { id: "comp-light", name: "LED Spotlight", icon: "💡", countNoun: "bright LED lights", sentence: "It has bright lights." },
        { id: "comp-box", name: "Waterproof Shell", icon: "📦", countNoun: "a waterproof shell", sentence: "It has a waterproof shell." }
      ]
    },

    // =========================================================================
    // MISSION 6: WHAT CAN IT DO? (CAN / CAN'T)
    // =========================================================================
    mission6: {
      title: "WHAT CAN IT DO?",
      subtitle: "Describe your invention's super abilities using CAN and CAN'T!",
      robotPrompt: "Pick 3 action verbs that your invention CAN do, and 1 funny thing it CAN'T do!",
      grammarFocus: "IT CAN + VERB / IT CAN'T + VERB",
      actionVerbs: [
        { id: "v-clean", verb: "clean", icon: "🧼", sentence: "It can clean shoes.", exampleObject: "shoes" },
        { id: "v-carry", verb: "carry", icon: "🎒", sentence: "It can carry heavy books.", exampleObject: "books" },
        { id: "v-find", verb: "find", icon: "🔍", sentence: "It can find lost pencils.", exampleObject: "pencils" },
        { id: "v-fly", verb: "fly", icon: "✈️", sentence: "It can fly over puddles.", exampleObject: "over puddles" },
        { id: "v-help", verb: "help", icon: "🤝", sentence: "It can help students.", exampleObject: "students" },
        { id: "v-protect", verb: "protect", icon: "🛡️", sentence: "It can protect people from rain.", exampleObject: "from rain" },
        { id: "v-save", verb: "save", icon: "⏱️", sentence: "It can save time in the morning.", exampleObject: "time" },
        { id: "v-move", verb: "move", icon: "🚀", sentence: "It can move fast.", exampleObject: "fast" },
        { id: "v-make", verb: "make", icon: "🛠️", sentence: "It can make warm lunch.", exampleObject: "warm lunch" },
        { id: "v-organize", verb: "organize", icon: "📦", sentence: "It can organize books neatly.", exampleObject: "books neatly" }
      ],
      cantOptions: [
        { id: "cant-swim", text: "It can't swim in deep water.", icon: "🌊" },
        { id: "cant-fly", text: "It can't fly to the moon.", icon: "🚀" },
        { id: "cant-cook", text: "It can't cook pizza.", icon: "🍕" },
        { id: "cant-sing", text: "It can't sing opera songs.", icon: "🎵" }
      ],
      quiz: [
        {
          question: "What CAN a smart rolling backpack do?",
          options: [
            "It can carry heavy books. 📚",
            "It can eat your homework. 📄",
            "It can sleep under the bed. 💤"
          ],
          correct: "It can carry heavy books. 📚"
        },
        {
          question: "What CAN a shoe-cleaning station do?",
          options: [
            "It can clean dirty shoes. 👟✨",
            "It can paint shoes green. 🎨",
            "It can dance in the street. 💃"
          ],
          correct: "It can clean dirty shoes. 👟✨"
        }
      ]
    },

    // =========================================================================
    // MISSION 7: HOW DOES IT WORK? (Simple Instructions)
    // =========================================================================
    mission7: {
      title: "HOW DOES IT WORK?",
      subtitle: "Explain the process step-by-step: FIRST, THEN, FINALLY!",
      robotPrompt: "Good inventors give clear, simple instructions so anyone can use their machine. Put the steps in order!",
      grammarFocus: "IMPERATIVE VERBS & SEQUENCING",
      presets: {
        smartBag: [
          { step: "FIRST", text: "Put the books inside.", icon: "📥", correctPos: 0 },
          { step: "THEN", text: "Press the green button.", icon: "🔘", correctPos: 1 },
          { step: "FINALLY", text: "The bag follows you on wheels.", icon: "🚶‍♂️🎒", correctPos: 2 }
        ],
        shoeCleaner: [
          { step: "FIRST", text: "Step on the clean pad.", icon: "🦶", correctPos: 0 },
          { step: "THEN", text: "Turn on the power switch.", icon: "⚡", correctPos: 1 },
          { step: "FINALLY", text: "The brushes clean your shoes.", icon: "✨👟", correctPos: 2 }
        ],
        pencilFinder: [
          { step: "FIRST", text: "Turn on the radar scanner.", icon: "📡", correctPos: 0 },
          { step: "THEN", text: "Listen for the beep sound.", icon: "🔊", correctPos: 1 },
          { step: "FINALLY", text: "Find your glowing pencil.", icon: "✏️🌟", correctPos: 2 }
        ]
      }
    },

    // =========================================================================
    // MISSION 8: TEST LAB (Test Your Idea)
    // =========================================================================
    mission8: {
      title: "TEST LAB",
      subtitle: "Test your idea! Karl Benz tested his first motorcar many times!",
      robotPrompt: "Time to test your prototype in the testing chamber! Will it withstand the classroom challenge?",
      testingChallenges: [
        {
          id: "test1",
          title: "The Weight Test 🏋️",
          prompt: "We place 10 heavy dictionaries inside your invention.",
          simulationText: "Measuring weight... 5kg... 10kg... 15kg...",
          question: "Can your invention carry the heavy load?",
          passMessage: "PASS! The frame is strong and holds all 10 books! 🎉",
          failMessage: "Warning! The frame shakes a little. Time to improve! ⚠️"
        },
        {
          id: "test2",
          title: "The Rain & Splash Test 🌧️",
          prompt: "Simulating a sudden afternoon rainstorm in the schoolyard.",
          simulationText: "Water sprays from overhead jets... Splash!",
          question: "Can your invention protect the books from water?",
          passMessage: "PASS! 100% dry! The waterproof shell works! ☔",
          failMessage: "A few drops got inside. We need a better seal! 🔧"
        }
      ],
      growthMindsetQuote: "Don't give up! Try again. When something doesn't work, we learn how to make it better!"
    },

    // =========================================================================
    // MISSION 9: MAKE IT BETTER! (Improve Your Idea)
    // =========================================================================
    mission9: {
      title: "MAKE IT BETTER!",
      subtitle: "Listen to feedback and improve your invention!",
      robotPrompt: "Great inventors never stop at Version 1. Choose an upgrade to make your invention even more useful!",
      grammarFocus: "I IMPROVED MY IDEA. NOW IT CAN...",
      upgrades: [
        { id: "up-wheels", title: "➕ Add All-Terrain Wheels", desc: "Rolls smoothly over stairs and mud!", icon: "🛞", benefit: "Now it can move on stairs." },
        { id: "up-battery", title: "➕ Add Solar Power Battery", desc: "Never runs out of power on sunny days!", icon: "☀️🔋", benefit: "Now it can work without plugging in." },
        { id: "up-sensor", title: "➕ Add Smart Voice Sensor", desc: "Listens and speaks back in English!", icon: "🎙️🤖", benefit: "Now it can talk and listen." },
        { id: "up-shield", title: "➕ Add Waterproof Bubble Shield", desc: "Opens an umbrella bubble automatically!", icon: "🫧🛡️", benefit: "Now it can protect you from rain." },
        { id: "up-lighter", title: "➕ Make It Ultra-Light", desc: "Made of recycled carbon fiber!", icon: "🪶", benefit: "Now it is super light to carry." },
        { id: "up-faster", title: "➕ Make It Turbo-Fast", desc: "Dual twin-turbo booster fan!", icon: "⚡💨", benefit: "Now it can move super fast." }
      ]
    },

    // =========================================================================
    // MISSION 10: PRESENTATION LAB & YOUNG INVENTOR EXPO
    // =========================================================================
    mission10: {
      title: "PRESENTATION LAB & EXPO",
      subtitle: "Present your invention to the class for the Young Inventor Expo!",
      robotPrompt: "Prepare your 9 presentation cards! Speak with a loud, proud voice!",
      speechCards: [
        { id: "card1", tag: "👋 HELLO", prompt: "Greeting & Name", template: "Hello everyone! My name is [NAME]. Today I will show you my invention." },
        { id: "card2", tag: "🔍 PROBLEM", prompt: "The Problem", template: "The problem is that [PROBLEM]." },
        { id: "card3", tag: "💡 IDEA", prompt: "My Invention", template: "My invention is called [INVENTION NAME]." },
        { id: "card4", tag: "🎨 DESCRIPTION", prompt: "What it looks like", template: "It has [COMPONENTS]. It is [ADJECTIVE]." },
        { id: "card5", tag: "🚀 ABILITIES", prompt: "What it can do", template: "It can [CAN 1] and [CAN 2]. It can't [CAN'T]." },
        { id: "card6", tag: "⚙️ HOW IT WORKS", prompt: "Simple Instructions", template: "First, [STEP 1]. Then, [STEP 2]. Finally, [STEP 3]." },
        { id: "card7", tag: "⭐ USEFUL", prompt: "Why it is useful", template: "It is useful because it [saves time / helps students]." },
        { id: "card8", tag: "🔧 IMPROVEMENT", prompt: "How you improved it", template: "I improved my idea. Now it can [IMPROVEMENT]." },
        { id: "card9", tag: "🎤 END", prompt: "Closing & Questions", template: "Thank you for listening! Do you have any questions?" }
      ],
      audienceCard: {
        title: "🔎 INVENTOR DETECTIVE REVIEW CARD",
        fields: [
          { label: "Inventor Name", placeholder: "e.g. Leo" },
          { label: "Invention Name", placeholder: "e.g. Super Bag 3000" },
          { label: "Problem it fixes", placeholder: "e.g. Heavy books" },
          { label: "One cool thing it can do", placeholder: "e.g. It can fly!" },
          { label: "My question for the inventor", placeholder: "e.g. How does it charge?" }
        ]
      },
      rubric: [
        { id: "rubric-idea", category: "💡 IDEA & PROBLEM", desc: "Clearly explains the problem and the creative solution", max: 3 },
        { id: "rubric-english", category: "🗣️ ENGLISH LANGUAGE", desc: "Uses CAN / CAN'T, HAS / HAVE, and imperative verbs accurately", max: 3 },
        { id: "rubric-description", category: "⚙️ DESCRIPTION & PROCESS", desc: "Describes components and explains First / Then / Finally", max: 3 },
        { id: "rubric-presentation", category: "🎤 PRESENTATION & CONFIDENCE", desc: "Speaks clearly with eye contact and responds to questions", max: 3 }
      ],
      studentChecklist: [
        "I found a problem.",
        "I created an idea.",
        "I designed an invention.",
        "I can describe it.",
        "I can say what it has.",
        "I can say what it can do.",
        "I can explain how it works.",
        "I can explain why it is useful.",
        "I improved my idea.",
        "I am ready to present!"
      ]
    },

    // =========================================================================
    // TEACHER OBSERVATION & LESSON TIMING GUIDES (3-Lesson Classroom Flow)
    // =========================================================================
    teacherGuides: {
      lesson1: {
        title: "Lesson 1: Problem, Solution & Inspiration (35 min)",
        flow: [
          { time: "00:00–05:00", stage: "Hook & Discussion", desc: "Ask: 'What is a problem in our classroom?' Write ideas on board." },
          { time: "05:00–12:00", stage: "Mission 1 (Problem Detectives)", desc: "Interactive Smart Board problem identification across 8 scenarios." },
          { time: "12:00–20:00", stage: "Mission 2 (Idea Lab)", desc: "Connect problems to solutions. Introduce Thomas Edison's notebooks." },
          { time: "20:00–28:00", stage: "Mission 3 (Idea Hunters)", desc: "Nature biomimicry (Kingfisher beak ➔ train, sticky burdock ➔ shoe)." },
          { time: "28:00–35:00", stage: "Mission 4 (Choose Problem & Blueprint)", desc: "Students select their individual problem and sketch preliminary drawings." }
        ]
      },
      lesson2: {
        title: "Lesson 2: Building, CAN/CAN'T & Instructions (35 min)",
        flow: [
          { time: "00:00–05:00", stage: "Review & Warm-Up", desc: "Review vocabulary: problem, solution, useful, machine, wheel, screen." },
          { time: "05:00–15:00", stage: "Mission 5 (Invention Builder)", desc: "Assemble modular components. Practice 'It has two wheels / a screen'." },
          { time: "15:00–25:00", stage: "Mission 6 (What Can It Do?)", desc: "Core language target: 'It can carry / clean / find / help / protect'." },
          { time: "25:00–35:00", stage: "Mission 7 (How Does It Work?)", desc: "Sequencing imperatives: First, put... Then, press... Finally, the bag..." }
        ]
      },
      lesson3: {
        title: "Lesson 3: Testing, Improving & Presentation Rehearsal (35 min)",
        flow: [
          { time: "00:00–05:00", stage: "Resilience Warm-Up", desc: "Introduce Karl Benz's test trials. Emphasize: 'Don't give up! Try again!'" },
          { time: "05:00–12:00", stage: "Mission 8 (Test Lab)", desc: "Simulate stress tests in testing chamber. Celebrate discovering flaws." },
          { time: "12:00–20:00", stage: "Mission 9 (Make It Better)", desc: "Upgrade prototypes: 'I improved my idea. Now it can...'." },
          { time: "20:00–30:00", stage: "Mission 10 (Presentation Rehearsal)", desc: "Rehearse 9 speaking cards with microphone, timer, and partner peer feedback." },
          { time: "30:00–35:00", stage: "Checklist & Expo Launch", desc: "Complete 10-point self-checklist and prepare for the classroom expo." }
        ]
      }
    }
  };

  root.YOUNG_INVENTOR_DATA = YOUNG_INVENTOR_DATA;

})(typeof window !== 'undefined' ? window : global);
