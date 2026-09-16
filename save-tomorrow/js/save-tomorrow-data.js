/**
 * THE INVENTION THAT MUST SAVE TOMORROW — STRUCTURED CURRICULUM DATA
 * Grade 4 • CEFR A1+ • 55–60 Minutes Slower Paced Comprehensive Lesson
 * Source: My Good Ideas Book, Unit 1, pages 18–21
 */

(function(root) {
  'use strict';

  const SAVE_TOMORROW_DATA = {
    meta: {
      title: "The Invention That Must Save Tomorrow",
      subtitle: "Save The Future Machine • Problem → Idea → Nature → Combine → Draw → Test → Improve → Presentation",
      year: "2045",
      setting: "The Future Invention Lab",
      grade: "Grade 4",
      level: "CEFR A1+",
      ageGroup: "9–10",
      duration: "55–60 minutes (Comfortable & Scaffolding Paced)",
      totalStages: 10,
      totalPhases: 15,
      maxXP: 100
    },

    characters: {
      nova: {
        name: "Nova",
        role: "Senior Young Inventor & Lab Mentor",
        avatar: "🧑‍🔬",
        greeting: "Welcome to the Future Invention Lab, year 2045! We need your bright minds today."
      },
      edi: {
        name: "EDI",
        role: "Robotic Lab Assistant",
        avatar: "🤖",
        catchphrase: "Beep-boop! Don't give up! Try again!"
      },
      machine: {
        name: "The Future Machine",
        statusInitial: "SYSTEM FAILURE — OFFLINE",
        statusFinal: "100% OPERATIONAL — FUTURE SAVED!",
        icon: "🌍⚙️"
      }
    },

    // 10-Stage Visual Progress Conduits
    stages: [
      { id: 1, name: "Problem", icon: "⚠️", phase: 2, desc: "Identify what is difficult" },
      { id: 2, name: "Idea", icon: "💡", phase: 3, desc: "Write ideas in the notebook" },
      { id: 3, name: "Inspiration", icon: "🌱", phase: 4, desc: "Learn from nature's designs" },
      { id: 4, name: "Combine", icon: "🧪", phase: 6, desc: "Old + Old = Something New" },
      { id: 5, name: "Draw", icon: "✏️", phase: 8, desc: "Blueprint drawing helps you see" },
      { id: 6, name: "Test", icon: "💨", phase: 9, desc: "Simulate under real pressure" },
      { id: 7, name: "Discover", icon: "🔍", phase: 9, desc: "Find what needs fixing" },
      { id: 8, name: "Improve", icon: "🔧", phase: 10, desc: "Make something better" },
      { id: 9, name: "Try Again", icon: "💪", phase: 11, desc: "Never give up" },
      { id: 10, name: "Save the Future", icon: "🚀", phase: 14, desc: "Restart the Future Machine" }
    ],

    // Movement & TPR Signals
    tprGuide: [
      { trigger: "PROBLEM", action: "🧠 Touch your head", desc: "A problem is something difficult!" },
      { trigger: "IDEA", action: "💡 Raise one index finger", desc: "An idea lights up your mind!" },
      { trigger: "SOLUTION", action: "👍 Give a big thumbs up", desc: "A solution fixes the problem!" },
      { trigger: "TRY AGAIN", action: "💪 Flex your muscle arm", desc: "Great inventors never give up!" }
    ],

    // =========================================================================
    // 15 PHASES CONTENT & DATA
    // =========================================================================

    // Phase 1: The Emergency (0–5 min)
    phase1: {
      title: "THE EMERGENCY",
      timeText: "0–5 min",
      stageId: 1,
      labState: "emergency",
      alertText: "🚨 ALERT: THE FUTURE MACHINE HAS STOPPED!",
      storyText: "The year is 2045. A giant machine called THE FUTURE MACHINE was created to help people solve everyday problems. But today... the machine has stopped! A message appears: 'WE NEED NEW INVENTORS.'",
      question: "What does an inventor do?",
      options: [
        { id: "opt-b", text: "B. Solve problems 🛠️", correct: true, feedback: "Exactly! Inventors solve problems to make life better." },
        { id: "opt-a", text: "A. Give up 😢", correct: false, feedback: "No, inventors never give up! Try again." },
        { id: "opt-c", text: "C. Do nothing 😴", correct: false, feedback: "No, inventors are active thinkers!" }
      ],
      teacherPrompt: {
        whatToSay: "Boys and girls, look at our lab in 2045! The Future Machine has stopped. What does an inventor do?",
        expectedAnswer: "An inventor solves problems.",
        simplerAnswer: "They fix things / help people.",
        pairDiscussion: "Turn to your partner: What is an inventor?",
        wholeClass: "Who can share one famous inventor you know?"
      }
    },

    // Phase 2: What is a Problem? (5–10 min)
    phase2: {
      title: "WHAT IS A PROBLEM?",
      timeText: "5–10 min",
      stageId: 1,
      definition: {
        term: "PROBLEM",
        meaning: "Something difficult that needs to be fixed.",
        icon: "⚠️",
        movement: "🧠 Touch your head!"
      },
      solutionDefinition: {
        term: "SOLUTION",
        meaning: "An answer or idea that fixes a problem.",
        icon: "💡",
        movement: "👍 Thumbs up!"
      },
      everydaySituations: [
        { id: "sit-bag", name: "Heavy Bag", icon: "🎒", text: "Carrying ten heavy books hurts your back." },
        { id: "sit-pencil", name: "Lost Pencil", icon: "✏️", text: "Pencils always roll off the desk and get lost." },
        { id: "sit-books", name: "Messy Books", icon: "📚", text: "Messy desk with papers falling everywhere." },
        { id: "sit-plant", name: "Dry Plant", icon: "💧", text: "Forgetting to water the classroom plants." },
        { id: "sit-late", name: "Being Late", icon: "⏰", text: "Oversleeping because you cannot hear the alarm." },
        { id: "sit-rain", name: "Getting Wet", icon: "☔", text: "Walking to school in heavy rain and getting soaked." }
      ],
      scenariosYesNo: [
        {
          id: "sc-1",
          scenario: "My pencils always fall on the floor and break.",
          question: "Is this a problem?",
          correct: true,
          explanation: "YES! It is difficult because you cannot write with broken pencils."
        },
        {
          id: "sc-2",
          scenario: "I have an apple for my morning snack.",
          question: "Is this a problem?",
          correct: false,
          explanation: "NO! An apple is a healthy snack, not a problem."
        },
        {
          id: "sc-3",
          scenario: "My school bag is too heavy to carry upstairs.",
          question: "Is this a problem?",
          correct: true,
          explanation: "YES! It hurts your back and tires you out."
        }
      ],
      problemSolutionPairs: [
        { id: "p1", problem: "Pencils roll off the desk", solution: "A hexagon-shaped pencil that does not roll", icon: "✏️" },
        { id: "p2", problem: "School bag is too heavy", solution: "A bag with rolling wheels and a handle", icon: "🎒" },
        { id: "p3", problem: "Shoes get dirty in the rain", solution: "Waterproof clip-on shoe covers", icon: "👟" },
        { id: "p4", problem: "Plants dry out in the classroom", solution: "A slow-drip recycled bottle waterer", icon: "🌱" }
      ],
      teacherPrompt: {
        whatToSay: "Listen carefully: 'A problem is something difficult.' When you hear PROBLEM, touch your head! When you hear SOLUTION, give thumbs up!",
        expectedAnswer: "The bag is a problem because it is too heavy.",
        simplerAnswer: "It is difficult.",
        pairDiscussion: "Tell your partner one small problem you had this morning.",
        wholeClass: "Let's check our thumbs: Is a heavy bag a problem? Thumbs up!"
      }
    },

    // Phase 3: Get an Idea (10–15 min)
    phase3: {
      title: "GET AN IDEA",
      timeText: "10–15 min",
      stageId: 2,
      edisonConcept: {
        quote: "Thomas Edison kept notebooks with thousands of ideas. When you have an idea, write it down!",
        chain: ["1. PROBLEM ⚠️", "2. THINK 💭", "3. IDEA 💡", "4. WRITE IT DOWN 📓"]
      },
      notebookChallenge: [
        {
          id: "nb-1",
          problem: "I always lose my pencils at my desk.",
          problemIcon: "✏️",
          ideas: [
            { id: "id-box", text: "A pencil box with magnetic clips 🧲", correct: true, icon: "🧰" },
            { id: "id-robot", text: "A little robot pencil guard 🤖", correct: true, icon: "🤖" },
            { id: "id-icecream", text: "Eat chocolate ice cream 🍦", correct: false, icon: "🍦" }
          ]
        },
        {
          id: "nb-2",
          problem: "My books get wet when it rains on the way to school.",
          problemIcon: "🌧️",
          ideas: [
            { id: "id-hood", text: "A waterproof backpack hood ☔", correct: true, icon: "🎒" },
            { id: "id-bubble", text: "A pop-up bubble shield 🫧", correct: true, icon: "🛡️" },
            { id: "id-sleep", text: "Stay asleep in bed all day 😴", correct: false, icon: "🛏️" }
          ]
        }
      ],
      teacherPrompt: {
        whatToSay: "Thomas Edison said: 'Always write your ideas down.' Look at the problem. Which ideas can go in our notebook?",
        expectedAnswer: "The magnetic pencil box is a good idea.",
        simplerAnswer: "Pencil box / robot.",
        pairDiscussion: "Which idea do you like better: the magnet box or the robot guard? Tell your partner.",
        wholeClass: "Raise your hand if you chose the robot guard!"
      }
    },

    // Phase 4: Ideas from Nature (15–21 min)
    phase4: {
      title: "IDEAS FROM NATURE (BIOMIMICRY)",
      timeText: "15–21 min",
      stageId: 3,
      conceptText: "Inventors don't only look at computers. They look at NATURE! Plants and animals have solved problems for millions of years.",
      biomimicryCases: [
        {
          id: "bio-burdock",
          natureName: "Sticky Burdock Plant 🌱",
          natureFeature: "Little hooks stick tightly to animal fur and clothes.",
          natureIcon: "🌱",
          inventionName: "Velcro Straps 👟",
          inventionFeature: "Tiny hooks lock onto loops to close shoes and bags without laces.",
          inventionIcon: "👟",
          keySentence: "The burdock plant inspired sticky Velcro shoe straps!"
        },
        {
          id: "bio-kingfisher",
          natureName: "Kingfisher Bird 🐦",
          natureFeature: "Long, sleek beak dives silently and smoothly into water without splashing.",
          natureIcon: "🐦",
          inventionName: "Bullet Train 🚆",
          inventionFeature: "Aerodynamic train nose moves silently through air at 300 km/h.",
          inventionIcon: "🚆",
          keySentence: "The kingfisher's beak inspired the aerodynamic bullet train nose!"
        }
      ],
      sourceQuiz: {
        question: "Where can good ideas come from?",
        options: [
          { text: "🌱 Nature and animals", correct: true },
          { text: "💭 Our imagination", correct: true },
          { text: "📚 Books and stories", correct: true },
          { text: "🗑️ Throwing garbage in the sea", correct: false }
        ]
      },
      teacherPrompt: {
        whatToSay: "Look at the kingfisher bird. How does its beak help the train? Who can see the shape?",
        expectedAnswer: "The beak is long and thin. The train nose is also long and thin.",
        simplerAnswer: "It is fast and sharp.",
        pairDiscussion: "Have you ever seen plants stick to your socks? Tell your partner.",
        wholeClass: "Repeat with me: Nature gives inventors great ideas!"
      }
    },

    // Phase 5: Nature Inventor Challenge (21–26 min)
    phase5: {
      title: "NATURE INVENTOR CHALLENGE",
      timeText: "21–26 min",
      stageId: 3,
      creatures: [
        {
          id: "cr-fish",
          animal: "Fish 🐟",
          ability: "Swims fast and smoothly through deep water.",
          question: "What human machine did fish inspire?",
          options: ["Submarine / Fast boat 🚤", "Toaster 🍞", "Clock ⏰"],
          correct: "Submarine / Fast boat 🚤",
          sentence: "The fish can swim fast. Our boat can move fast."
        },
        {
          id: "cr-bird",
          animal: "Eagle 🦅",
          ability: "Wide wings glide high across the sky.",
          question: "What human machine did birds inspire?",
          options: ["Airplane & Glider ✈️", "Pencil sharpener ✏️", "Fork 🍴"],
          correct: "Airplane & Glider ✈️",
          sentence: "The bird can fly high. Our airplane can fly high."
        },
        {
          id: "cr-lizard",
          animal: "Gecko Lizard 🦎",
          ability: "Sticky toe pads climb smooth glass walls.",
          question: "What invention did gecko lizards inspire?",
          options: ["Wall-climbing rescue gloves 🧤", "Winter coat 🧥", "Rubber boots 👢"],
          correct: "Wall-climbing rescue gloves 🧤",
          sentence: "The gecko can climb walls. The rescue gloves can climb walls."
        }
      ],
      teacherPrompt: {
        whatToSay: "The fish can swim fast. What can our invention do? Use the sentence: 'It can move fast.'",
        expectedAnswer: "The fish can swim fast. The boat can move fast.",
        simplerAnswer: "It can swim.",
        pairDiscussion: "If you could have one animal superpower to invent something, what animal would you pick?",
        wholeClass: "Let's make flying wings with our arms like the eagle!"
      }
    },

    // Phase 6: Old + Old = New (26–31 min)
    phase6: {
      title: "OLD + OLD = SOMETHING NEW!",
      timeText: "26–31 min",
      stageId: 4,
      conceptText: "You don't need expensive new materials to invent! Great inventors combine old everyday things to make something completely new.",
      mixerItems: [
        { id: "item-box", name: "Cardboard Box", icon: "📦" },
        { id: "item-wheel", name: "Old Wheels", icon: "⚙️" },
        { id: "item-umbrella", name: "Broken Umbrella", icon: "☔" },
        { id: "item-rope", name: "Strong Rope", icon: "🪢" },
        { id: "item-bottle", name: "Plastic Bottle", icon: "🍼" },
        { id: "item-funnel", name: "Kitchen Funnel", icon: "🪣" },
        { id: "item-tape", name: "Sticky Tape", icon: "📼" },
        { id: "item-spoon", name: "Wooden Spoon", icon: "🥄" }
      ],
      combos: [
        {
          req: ["item-box", "item-wheel", "item-umbrella"],
          name: "The Mobile Rain-Proof School Bag ☔🎒",
          desc: "A sturdy rolling box with an automatic canopy shield.",
          abilities: ["It can carry heavy books.", "It can keep papers dry.", "It can roll smoothly."]
        },
        {
          req: ["item-bottle", "item-funnel", "item-rope"],
          name: "The Auto Plant Hydrator 🌱💧",
          desc: "A hanging self-watering feeder for classroom plants.",
          abilities: ["It can hold water.", "It can drip slowly.", "It can save plants."]
        }
      ],
      teacherPrompt: {
        whatToSay: "Look at the Invention Mixer! Let's choose three old objects: Box, Wheels, and Umbrella. What does it make?",
        expectedAnswer: "It makes a mobile school bag!",
        simplerAnswer: "A rolling bag.",
        pairDiscussion: "What can this new invention do? Tell your partner: 'It can carry books.'",
        wholeClass: "Let's all read together: 'It can keep papers dry!'"
      }
    },

    // Phase 7: Leonardo's Invention Room (31–35 min)
    phase7: {
      title: "LEONARDO'S INVENTION ROOM",
      timeText: "31–35 min",
      stageId: 5,
      renaissanceSetting: {
        intro: "Step into Leonardo da Vinci's workshop in Italy, 500 years ago! Leonardo was full of brilliant ideas.",
        question: "Leonardo had hundreds of ideas in his head. What did he do with them?",
        options: [
          { text: "A. He drew them in sketchbooks! ✏️", correct: true, feedback: "YES! Drawing helped him test his ideas on paper!" },
          { text: "B. He forgot them immediately 😴", correct: false, feedback: "No, he recorded every single idea!" },
          { text: "C. He threw them in the fire 🔥", correct: false, feedback: "No, he protected his sketches!" }
        ],
        goldenRule: "DRAWING HELPS YOU SEE YOUR IDEA.",
        sketches: [
          { name: "Pyramid Parachute (1485)", icon: "🪂", text: "A wooden pyramid frame covered in cloth that allows a person to jump from any height without danger." },
          { name: "Aerial Screw / Helicopter (1489)", icon: "🚁", text: "A rotating linen screw designed to lift into the air when turned rapidly." }
        ]
      },
      teacherPrompt: {
        whatToSay: "Look at Leonardo's sketches from 500 years ago. Why did he draw his ideas?",
        expectedAnswer: "Because drawing helps you see your idea.",
        simplerAnswer: "To see it.",
        pairDiscussion: "Do you like drawing your ideas before you build them? Tell your partner.",
        wholeClass: "Everyone repeat Leonardo's rule: 'Drawing helps you see your idea!'"
      }
    },

    // Phase 8: Draw Your Blueprint (35–40 min)
    phase8: {
      title: "DRAW YOUR BLUEPRINT",
      timeText: "35–40 min",
      stageId: 5,
      problemChoices: [
        { id: "prob-bag", name: "Heavy School Bag", icon: "🎒", defaultName: "Aero-Roller 2045" },
        { id: "prob-shoes", name: "Muddy Shoes", icon: "👟", defaultName: "Clean-Step 2045" },
        { id: "prob-pencil", name: "Lost Pencils", icon: "✏️", defaultName: "Pencil-Radar 2045" },
        { id: "prob-rain", name: "Wet Clothes in Rain", icon: "☔", defaultName: "Hydro-Shield 2045" },
        { id: "prob-plant", name: "Dry Classroom Plants", icon: "🌱", defaultName: "Eco-Drip 2045" }
      ],
      paletteColors: ["#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#ffffff"],
      components: [
        { id: "part-wheels", name: "Wheels", icon: "⚙️" },
        { id: "part-wings", name: "Solar Wings", icon: "🪽" },
        { id: "part-handle", name: "Handle", icon: "🧰" },
        { id: "part-umbrella", name: "Shield Canopy", icon: "☂️" },
        { id: "part-light", name: "LED Spotlight", icon: "💡" },
        { id: "part-arm", name: "Grab Arm", icon: "🦾" },
        { id: "part-sensor", name: "Radar Sensor", icon: "📡" },
        { id: "part-basket", name: "Storage Box", icon: "📦" }
      ],
      teacherPrompt: {
        whatToSay: "Now it is your turn to be Leonardo da Vinci! Pick your problem, choose parts, and sketch your blueprint on the Smart Board.",
        expectedAnswer: "My invention is Aero-Roller. It has wheels and a handle.",
        simplerAnswer: "It has wheels.",
        pairDiscussion: "Show your drawing to your partner: What parts does your machine have?",
        wholeClass: "60-second drawing time! Ready, set, sketch!"
      }
    },

    // Phase 9: Test Lab (40–45 min)
    phase9: {
      title: "THE TEST LAB",
      timeText: "40–45 min",
      stageId: 6,
      intro: "An invention on paper is only a dream. Real inventors must TEST their ideas in the lab!",
      testChamber: {
        challenge: "WIND TUNNEL & WEIGHT STRESS TEST 💨🏋️",
        simulatedProblem: "The wind is too strong! The prototype begins to shake and wobbles!",
        status: "🚨 PROBLEM FOUND!",
        novaAdvice: "Don't worry! Every great inventor finds problems during testing. Finding a problem helps us make it better!",
        question: "What should we do now?",
        options: [
          { text: "A. Improve our idea and make it stronger! 🔧", correct: true },
          { text: "B. Cry and throw it away 😭", correct: false },
          { text: "C. Give up and go home 🏃", correct: false }
        ]
      },
      teacherPrompt: {
        whatToSay: "Oh no! Look at the red warning light. Is finding a problem bad in science? No, it helps us improve!",
        expectedAnswer: "We must improve our idea.",
        simplerAnswer: "Make it better.",
        pairDiscussion: "Why is testing important? Tell your partner.",
        wholeClass: "Remember: Finding a problem is the first step to making it better!"
      }
    },

    // Phase 10: Improve Your Idea (45–50 min)
    phase10: {
      title: "IMPROVE YOUR IDEA",
      timeText: "45–50 min",
      stageId: 8,
      definition: {
        term: "IMPROVE",
        meaning: "To make something better.",
        icon: "🔧"
      },
      benzHistory: {
        inventor: "Karl Benz (1885)",
        invention: "The First Motorcar 🚗",
        lesson: "Karl Benz's first car only had three wheels and broke down frequently. Did he stop? No! He improved it year after year."
      },
      improvementOptions: [
        { id: "imp-stronger", text: "Make it STRONGER 💪", benefit: "Thick titanium joints carry 20 kg." },
        { id: "imp-lighter", text: "Make it LIGHTER 🪶", benefit: "Carbon fiber makes it easy to carry." },
        { id: "imp-faster", text: "Make it FASTER ⚡", benefit: "High-speed brushless motors." },
        { id: "imp-safer", text: "Make it SAFER 🛡️", benefit: "Soft bumper pads and emergency stop." },
        { id: "imp-solar", text: "Make it SOLAR POWERED ☀️", benefit: "Recharges automatically in sunlight." }
      ],
      teacherPrompt: {
        whatToSay: "Karl Benz's first car was not perfect. Was any invention perfect at the beginning? No! How will you improve your machine?",
        expectedAnswer: "I can improve it by making it stronger.",
        simplerAnswer: "Make it stronger / faster.",
        pairDiscussion: "Tell your partner: 'I can improve my invention by making it...' ",
        wholeClass: "Raise your hand if you chose STRONGER! Raise your hand if you chose LIGHTER!"
      }
    },

    // Phase 11: Try Again! (50–54 min)
    phase11: {
      title: "TRY AGAIN! (DON'T GIVE UP)",
      timeText: "50–54 min",
      stageId: 9,
      ediReaction: "Beep-boop! It failed again! But wait... look at the TRY AGAIN button!",
      retrySteps: [
        { step: 1, text: "Click 1: Reinforce joints with steel bolts 🔩", progress: 35 },
        { step: 2, text: "Click 2: Balance weight distribution ⚖️", progress: 70 },
        { step: 3, text: "Click 3: Calibrate stabilization gyros 🧭", progress: 100 }
      ],
      speechPractice: [
        { phrase: "Try again!", icon: "💪" },
        { phrase: "Don't give up!", icon: "🌟" },
        { phrase: "Improve your idea!", icon: "🔧" }
      ],
      teacherPrompt: {
        whatToSay: "Listen to EDI: 'Try again!' When you hear TRY AGAIN, show me your muscle arms! Let's say it loud: 'Don't give up!'",
        expectedAnswer: "Try again! Don't give up!",
        simplerAnswer: "Try again!",
        pairDiscussion: "Say 'Don't give up!' to your partner with big energy!",
        wholeClass: "All together: One, two, three: TRY AGAIN!"
      }
    },

    // Phase 12: Final Inventor Mission (54–59 min)
    phase12: {
      title: "FINAL INVENTOR MISSION: SAVE THE FUTURE",
      timeText: "54–59 min",
      stageId: 10,
      scaffoldFrames: [
        { label: "1. PROBLEM", prefix: "My problem is", placeholder: "heavy school books" },
        { label: "2. IDEA", prefix: "My idea is", placeholder: "a rolling robotic backpack" },
        { label: "3. INVENTION", prefix: "My invention is called", placeholder: "Aero-Roller 2045" },
        { label: "4. ABILITIES", prefix: "It can", placeholder: "carry books and roll smoothly" },
        { label: "5. IMPROVEMENT", prefix: "I improved it by making it", placeholder: "lighter and stronger" }
      ],
      teacherPrompt: {
        whatToSay: "Now you are an official Future Inventor. Use our 5 magic sentences to explain your machine.",
        expectedAnswer: "My problem is heavy books. My invention is Aero-Roller. It can carry books.",
        simplerAnswer: "It is Aero-Roller. It can carry books.",
        pairDiscussion: "Practice your 5 sentences with your partner before the class presentation.",
        wholeClass: "Let's give 60 seconds of quiet partner practice!"
      }
    },

    // Phase 13: Inventor Presentation (59–62 min)
    phase13: {
      title: "INVENTOR PRESENTATION STAGE",
      timeText: "59–62 min",
      stageId: 10,
      timerSeconds: 30,
      stagePrompts: [
        "👋 'Hello everyone! My name is Inventor [Name].'",
        "⚠️ 'My problem is [Problem].'",
        "🚀 'My invention is [Invention Name].'",
        "✨ 'It can [Ability 1] and [Ability 2].'",
        "🔧 'I improved it by making it [Improvement].'"
      ],
      teacherPrompt: {
        whatToSay: "Step up to the podium! You have 30 seconds. Audience, get ready to give big applause!",
        expectedAnswer: "Clear, confident presentation of the 5 key points.",
        simplerAnswer: "3 key sentences.",
        pairDiscussion: "Audience: What is one thing you liked about their invention?",
        wholeClass: "Press the applause button for our presenter!"
      }
    },

    // Phase 14: Final Celebration (62–64 min)
    phase14: {
      title: "MISSION ACCOMPLISHED: THE FUTURE IS SAVED!",
      timeText: "62–64 min",
      stageId: 10,
      awardXP: 100,
      badgeTitle: "🚀 MASTER FUTURE INVENTOR",
      futureMachineFinal: {
        status: "ONLINE & FULLY CHARGED ⚡",
        message: "The Future Machine is active again! Thank you, inventors of 2045!"
      },
      skillsSummary: [
        "🔍 Problem Detective",
        "💡 Idea Creator",
        "🌱 Biomimicry Explorer",
        "✏️ Blueprint Designer",
        "🧪 Resilience Tester",
        "🎤 Expo Presenter"
      ],
      teacherPrompt: {
        whatToSay: "Look at the Future Machine! All 10 power conduits are glowing bright blue! You saved tomorrow!",
        expectedAnswer: "Hooray! We saved the machine!",
        simplerAnswer: "We did it!",
        pairDiscussion: "High five your partner for great teamwork!",
        wholeClass: "Let's all celebrate together!"
      }
    },

    // Phase 15: Exit Ticket (64–65 min)
    phase15: {
      title: "EXIT TICKET: DIGITAL NOTEBOOK",
      timeText: "64–65 min",
      stageId: 10,
      questions: [
        {
          q: "1. What is a PROBLEM?",
          options: [
            { text: "Something difficult that needs fixing", correct: true },
            { text: "A delicious snack", correct: false }
          ]
        },
        {
          q: "2. What is a SOLUTION?",
          options: [
            { text: "An idea or invention that fixes a problem", correct: true },
            { text: "Another difficult problem", correct: false }
          ]
        },
        {
          q: "3. When something fails during testing, inventors...",
          options: [
            { text: "Try again and make it better!", correct: true },
            { text: "Give up forever", correct: false }
          ]
        }
      ],
      finalTakeaway: "🧠 GREAT INVENTORS KEEP THINKING. NEVER STOP ASKING: HOW CAN WE MAKE IT BETTER?"
    }
  };

  root.SAVE_TOMORROW_DATA = SAVE_TOMORROW_DATA;
})(typeof window !== 'undefined' ? window : global);
