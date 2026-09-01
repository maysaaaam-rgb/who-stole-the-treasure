/**
 * STORY DATA FOR "STEP INTO THE STORY: THE WIZARD OF OZ"
 * CEFR Level: A1+ (Primary English)
 * 30-40 Minute Interactive Classroom Experience
 */

export const STORY_DATA = {
  meta: {
    title: "Step into the Story: The Wizard of Oz",
    level: "CEFR A1+",
    duration: "30–40 minutes",
    targetAge: "Primary (7–11 years)",
    teacherRole: "Narrator / Storyteller / Stage Director",
    studentRole: "Listeners → Predictors → Characters → Speakers → Retellers",
  },

  // PART 1: ENTER THE STORY - Visual clues & 5 Key Vocabulary
  enterTheStory: {
    clues: [
      { id: "dorothy", name: "Dorothy", icon: "👧", desc: "A young girl with blue dress and red shoes", prompt: "Who is this?" },
      { id: "toto", name: "Toto", icon: "🐕", desc: "A little brown playful dog", prompt: "Who is her little friend?" },
      { id: "kansas", name: "Kansas Farm", icon: "🏡", desc: "A quiet farm with a big sky", prompt: "Where is she?" },
      { id: "storm", name: "Big Storm", icon: "🌪️", desc: "Dark swirling clouds in the sky", prompt: "Look at the sky! What is this?" },
      { id: "yellow_road", name: "Yellow Road", icon: "🧱", desc: "A bright yellow brick road", prompt: "What is this bright road?" }
    ],
    vocabulary: [
      {
        word: "STORM",
        icon: "🌪️",
        action: "Make whooshing wind sounds with your mouth!",
        tprPrompt: "Point to the storm! Swirl your hands like wind!",
        sentence: "There is a big storm in the sky."
      },
      {
        word: "HOUSE",
        icon: "🏠",
        action: "Make a triangle roof above your head with your hands!",
        tprPrompt: "Make a roof over your head! Show me a house!",
        sentence: "Dorothy lives in a small house."
      },
      {
        word: "FOREST",
        icon: "🌲",
        action: "Stand tall like trees and sway gently in the breeze!",
        tprPrompt: "Where is the forest? Stand tall like a tree!",
        sentence: "They walk into a green forest."
      },
      {
        word: "SCARED",
        icon: "😨",
        action: "Put hands on cheeks and open your eyes wide!",
        tprPrompt: "Show me scared! Make a scared face!",
        sentence: "The little dog is scared."
      },
      {
        word: "ROAD",
        icon: "🛣️",
        action: "March your feet on the floor: step, step, step!",
        tprPrompt: "March on the yellow road! Follow the road!",
        sentence: "Follow the yellow road!"
      }
    ],
    teacherGuide: {
      say: "Welcome class! Today we are stepping INTO a magical story. Look at these clues. Who can point to Dorothy?",
      do: "Click each clue card to show clues. Practice the 5 TPR actions together with the students. Have whole class repeat words.",
      next: "Click 'Prediction Introduction' to make our first story prediction before opening the storybook."
    }
  },

  // PART 2: PREDICTION INTRODUCTION
  predictionIntro: {
    question: "What do you think will happen?",
    prompt: "Look at the dark clouds gathering over the farm. What will Dorothy do?",
    choices: [
      { id: "A", text: "Dorothy goes outside.", icon: "🚪", isCorrect: false },
      { id: "B", text: "Dorothy goes to sleep.", icon: "🛏️", isCorrect: false },
      { id: "C", text: "Dorothy runs to the house.", icon: "🏃‍♀️", isCorrect: true, note: "She runs inside when the storm starts!" }
    ],
    sentenceFrame: "I think Dorothy will ____________.",
    partnerPrompt: "Turn to your partner. Say: 'I think Dorothy will...'",
    teacherGuide: {
      say: "Look at the dark sky over the farm. Talk to your partner. What do you think will happen?",
      do: "Give pairs 20 seconds. Take 2-3 student predictions. Do NOT reveal the answer yet!",
      next: "Click 'Open Storybook' to begin reading Scene 1."
    }
  },

  // PART 3: 11 SCENES & 3 STORY STOPS
  scenes: [
    {
      id: 1,
      title: "Dorothy's Home",
      location: "Kansas Farm",
      time: "Daytime",
      narration: [
        "Dorothy is a young girl.",
        "She lives in Kansas with her aunt, uncle, and her little dog, Toto.",
        "Dorothy loves Toto very much. They are best friends.",
        "One day, Dorothy is outside with Toto.",
        "Suddenly, the sky becomes dark.",
        "The wind starts to blow.",
        "Dorothy looks at the sky: 'Oh no! A storm!'"
      ],
      characterRole: {
        speaker: "Dorothy",
        avatar: "👧",
        line: "Toto, come with me!",
        audioCue: "wind_soft"
      },
      visualElements: {
        bg: "kansas_farm",
        mood: "stormy_brewing",
        charactersPresent: ["dorothy", "toto"]
      },
      soundFx: "wind",
      teacherGuide: {
        say: "Read with gentle warmth, then raise your voice when the sky gets dark: 'Suddenly, the sky becomes dark!'",
        do: "Point to Dorothy and Toto. Signal the student playing Dorothy to say her line loudly to Toto.",
        next: "Click NEXT to see the tornado hit the farm!"
      }
    },
    {
      id: 2,
      title: "The Tornado",
      location: "The Sky & Vortex",
      time: "Storm",
      narration: [
        "The wind becomes stronger and stronger.",
        "Dorothy runs to the house.",
        "But suddenly... BOOM!",
        "The house moves!",
        "Dorothy holds Toto.",
        "The house goes up... Higher... Higher... And higher!",
        "Dorothy and Toto are flying through the sky."
      ],
      characterRole: {
        speaker: "Dorothy",
        avatar: "👧",
        line: "Help!",
        audioCue: "tornado_whoosh"
      },
      visualElements: {
        bg: "tornado_sky",
        mood: "flying_house",
        charactersPresent: ["house_flying", "dorothy", "toto"]
      },
      soundFx: "tornado",
      teacherGuide: {
        say: "Read dramatically! Raise your hands higher and higher as the house spins in the tornado: 'Higher... higher!'",
        do: "Have class make swirling wind sounds. Point to the Dorothy actor for the 'Help!' shout.",
        next: "Click to pause at STORY STOP #1 for prediction and feelings."
      }
    },

    // STORY STOP #1 (After Scene 2)
    {
      id: "stop_1",
      isStoryStop: true,
      stopNumber: 1,
      title: "Story Stop 1: Dorothy's Feelings",
      step1: {
        question: "How does Dorothy feel?",
        options: [
          { label: "HAPPY", icon: "😊", correct: false },
          { label: "SCARED", icon: "😨", correct: true },
          { label: "SLEEPY", icon: "😴", correct: false }
        ],
        expected: "She is scared.",
        frame: "She is ____________."
      },
      step2: {
        question: "What should Dorothy do?",
        options: [
          { label: "Hold Toto tight", icon: "🐕", correct: true },
          { label: "Jump out the window", icon: "🪟", correct: false },
          { label: "Go to sleep", icon: "💤", correct: false }
        ],
        frame: "I think she should ____________."
      },
      teacherGuide: {
        say: "Let's pause! Look at Dorothy in the swirling house. How does she feel? What should she do?",
        do: "Ask pairs: 'Talk to your partner.' Choose 2 students to use the sentence frame. Reveal answer.",
        next: "Click NEXT to land in the magical strange land!"
      }
    },

    {
      id: 3,
      title: "A Strange Place",
      location: "Munchkinland",
      time: "Bright Morning",
      narration: [
        "After a long time... CRASH!",
        "The house comes down.",
        "Dorothy opens the door.",
        "She looks outside.",
        "Everything is different.",
        "The grass is green. The flowers are beautiful. The sky is blue.",
        "Dorothy looks at Toto: 'Where are we?'",
        "Toto doesn't know."
      ],
      characterRole: {
        speaker: "Dorothy",
        avatar: "👧",
        line: "Where are we?",
        audioCue: "chime_magic"
      },
      visualElements: {
        bg: "strange_land",
        mood: "bright_magical",
        charactersPresent: ["dorothy", "toto"]
      },
      soundFx: "crash",
      teacherGuide: {
        say: "Read with a sense of wonder and curiosity. Open your eyes wide when Dorothy opens the door.",
        do: "Ask the class: 'What colors can you see?' (Green, blue, pink, yellow). Prompt Dorothy actor.",
        next: "Click NEXT to meet our first new friend on the road."
      }
    },
    {
      id: 4,
      title: "The Scarecrow",
      location: "Yellow Brick Road / Cornfield",
      time: "Daytime",
      narration: [
        "Dorothy sees a long yellow road.",
        "She starts walking. Toto walks beside her.",
        "After a while, Dorothy sees something strange.",
        "It is a man... But he is not a real man.",
        "He is a scarecrow!"
      ],
      dialogueExchange: [
        { speaker: "Scarecrow", avatar: "🌾", text: "Hello!" },
        { speaker: "Dorothy", avatar: "👧", text: "Hello! Who are you?" },
        { speaker: "Scarecrow", avatar: "🌾", text: "I'm a scarecrow. I need a brain." },
        { speaker: "Dorothy", avatar: "👧", text: "Come with me!" },
        { speaker: "Scarecrow", avatar: "🌾", text: "Thank you!" }
      ],
      visualElements: {
        bg: "yellow_road_scarecrow",
        mood: "friendly_encounter",
        charactersPresent: ["dorothy", "toto", "scarecrow"]
      },
      soundFx: "pop",
      teacherGuide: {
        say: "Introduce the Scarecrow with a funny wobbly voice. Point to his straw head.",
        do: "Have the student playing Scarecrow and the student playing Dorothy do the 5-line exchange with big gestures.",
        next: "Click NEXT to continue down the yellow road."
      }
    },
    {
      id: 5,
      title: "The Tin Man",
      location: "The Green Forest",
      time: "Daytime",
      narration: [
        "Dorothy, Toto, and the Scarecrow continue walking.",
        "Suddenly, they hear a strange sound: 'Help! Help!'",
        "They look around. There is a man made of metal.",
        "He is standing in the forest. He cannot move!",
        "Dorothy finds some oil. She helps him move his arms, then his legs.",
        "The Tin Man smiles."
      ],
      dialogueExchange: [
        { speaker: "Tin Man", avatar: "🤖", text: "Help! I need oil!" },
        { speaker: "Dorothy", avatar: "👧", text: "Are you OK?" },
        { speaker: "Tin Man", avatar: "🤖", text: "Thank you! I want a heart." },
        { speaker: "Dorothy", avatar: "👧", text: "Come with us!" },
        { speaker: "Tin Man", avatar: "🤖", text: "Yes!" }
      ],
      interactiveTool: "oil_can",
      visualElements: {
        bg: "forest_tinman",
        mood: "forest_rusty",
        charactersPresent: ["dorothy", "toto", "scarecrow", "tinman"]
      },
      soundFx: "door_creak",
      teacherGuide: {
        say: "Make stiff robotic sounds. Invite a student to tap the interactive OIL CAN on screen to oil the Tin Man!",
        do: "Watch Tin Man move his arms and smile. Have actors perform the short exchange.",
        next: "Click NEXT to hear something loud in the bushes!"
      }
    },
    {
      id: 6,
      title: "The Lion",
      location: "Forest Path",
      time: "Daytime",
      narration: [
        "Now there are four friends: Dorothy, Toto, the Scarecrow, and the Tin Man.",
        "They walk together.",
        "Suddenly... ROAR! A big lion jumps out!",
        "Everyone stops.",
        "Then the Lion looks scared: 'I'm sorry!'"
      ],
      dialogueExchange: [
        { speaker: "Lion", avatar: "🦁", text: "ROAR! ... I'm sorry!" },
        { speaker: "Dorothy", avatar: "👧", text: "Are you a scary lion?" },
        { speaker: "Lion", avatar: "🦁", text: "No! I'm scared! I need courage." },
        { speaker: "Scarecrow", avatar: "🌾", text: "Come with us!" },
        { speaker: "Lion", avatar: "🦁", text: "OK!" }
      ],
      visualElements: {
        bg: "forest_lion",
        mood: "dramatic_funny",
        charactersPresent: ["dorothy", "toto", "scarecrow", "tinman", "lion"]
      },
      soundFx: "lion_roar",
      teacherGuide: {
        say: "Roar loudly, then suddenly shrink and look super timid and scared. Make the children laugh!",
        do: "Have Lion actor roar, then cover eyes and say 'I'm scared!'",
        next: "Click to pause for STORY STOP #2 quick comprehension check."
      }
    },

    // STORY STOP #2 (After Scene 6)
    {
      id: "stop_2",
      isStoryStop: true,
      stopNumber: 2,
      title: "Story Stop 2: What do they want?",
      step1: {
        question: "What does the Lion want?",
        options: [
          { label: "A HEART", icon: "❤️", correct: false },
          { label: "A BRAIN", icon: "🧠", correct: false },
          { label: "COURAGE", icon: "💪", correct: true }
        ],
        expected: "He wants courage.",
        frame: "He wants ____________."
      },
      step2: {
        question: "Quick Matching Check:",
        pairs: [
          { character: "🌾 Scarecrow", needs: "🧠 A Brain" },
          { character: "🤖 Tin Man", needs: "❤️ A Heart & Oil" },
          { character: "🦁 Lion", needs: "💪 Courage" }
        ]
      },
      teacherGuide: {
        say: "Let's check our friends! What does the Lion want? Who wants a brain? Who needs oil?",
        do: "Ask rapid-fire: 'Who wants a brain?' (Class: 'The Scarecrow!'). 'Who wants courage?' (Class: 'The Lion!')",
        next: "Click NEXT to approach the great green Emerald City!"
      }
    },

    {
      id: 7,
      title: "The Emerald City",
      location: "Gates of Emerald City",
      time: "Afternoon Glow",
      narration: [
        "The four friends continue walking.",
        "They follow the yellow road.",
        "Finally, they see a big green city. It is beautiful.",
        "It is the Emerald City.",
        "Dorothy smiles: 'We are here!'",
        "They reach the great door: KNOCK KNOCK."
      ],
      dialogueExchange: [
        { speaker: "Dorothy", avatar: "👧", text: "We are here!" },
        { speaker: "Wizard (inside)", avatar: "✨", text: "Who is there?" },
        { speaker: "Dorothy", avatar: "👧", text: "We need your help." },
        { speaker: "Wizard", avatar: "✨", text: "Come in." }
      ],
      visualElements: {
        bg: "emerald_city_gates",
        mood: "grand_green",
        charactersPresent: ["dorothy", "scarecrow", "tinman", "lion"]
      },
      soundFx: "knock",
      teacherGuide: {
        say: "Make loud knocking sounds: 'KNOCK KNOCK!' Speak with a booming mysterious voice for the Wizard.",
        do: "Have whole class knock on their desks twice: 'KNOCK KNOCK!'",
        next: "Click NEXT to enter the Wizard's throne room."
      }
    },
    {
      id: 8,
      title: "The Wizard",
      location: "Throne Room of Oz",
      time: "Inside Castle",
      narration: [
        "The friends go inside.",
        "They see the great Wizard in a flash of green smoke.",
        "The friends tell the Wizard what they want.",
        "The Wizard listens carefully: 'I can help you... but first, you must do something.'",
        "'You must find the Witch.'"
      ],
      dialogueExchange: [
        { speaker: "Dorothy", avatar: "👧", text: "I want to go home." },
        { speaker: "Scarecrow", avatar: "🌾", text: "I want a brain." },
        { speaker: "Tin Man", avatar: "🤖", text: "I want a heart." },
        { speaker: "Lion", avatar: "🦁", text: "I want courage." },
        { speaker: "Wizard", avatar: "🧙‍♂️", text: "Find the Witch first!" }
      ],
      visualElements: {
        bg: "wizard_throne",
        mood: "mysterious_throne",
        charactersPresent: ["dorothy", "scarecrow", "tinman", "lion", "wizard"]
      },
      soundFx: "magic",
      teacherGuide: {
        say: "Each character speaks their wish clearly. Then boom with the Wizard's deep voice.",
        do: "Have all 4 character actors line up and say their wishes one by one: 'I want...'",
        next: "Click NEXT to face the dark forest and the Witch!"
      }
    },
    {
      id: 9,
      title: "The Witch",
      location: "Dark Spooky Forest",
      time: "Twilight",
      narration: [
        "The friends leave the city and walk into a dark forest.",
        "The trees are tall. It is quiet.",
        "Suddenly... 'HAHAHAHA! Who are you?'",
        "The friends are scared, but Dorothy holds Toto.",
        "The Lion stands next to Dorothy.",
        "The Tin Man stands tall. The Scarecrow stands tall too."
      ],
      dialogueExchange: [
        { speaker: "Witch", avatar: "🧙‍♀️", text: "HAHAHAHA! You cannot win!" },
        { speaker: "Dorothy", avatar: "👧", text: "We are looking for you!" },
        { speaker: "All Friends", avatar: "⭐", text: "We are not afraid!" }
      ],
      visualElements: {
        bg: "dark_forest_witch",
        mood: "spooky_brave",
        charactersPresent: ["dorothy", "scarecrow", "tinman", "lion", "witch"]
      },
      soundFx: "witch_cackle",
      teacherGuide: {
        say: "Give a playful, child-friendly witch cackle! Then change your tone to strong and brave for the friends.",
        do: "Have the Witch actor laugh, then have the 4 friends stand shoulder-to-shoulder: 'We are not afraid!'",
        next: "Click to pause for STORY STOP #3: Decision time."
      }
    },

    // STORY STOP #3 (After Scene 9)
    {
      id: "stop_3",
      isStoryStop: true,
      stopNumber: 3,
      title: "Story Stop 3: What should they do?",
      step1: {
        question: "What should the friends do?",
        options: [
          { label: "RUN AWAY", icon: "🏃‍♂️", correct: false },
          { label: "STAY TOGETHER", icon: "🤝", correct: true },
          { label: "GO TO SLEEP", icon: "😴", correct: false }
        ],
        expected: "Stay together.",
        frame: "I think they should stay together."
      },
      teacherGuide: {
        say: "Look at the Witch! The forest is dark. What should our four friends do?",
        do: "Students turn to a partner: 'I think they should stay together.' Take a class vote on screen.",
        next: "Click NEXT to see them work together and return victorious!"
      }
    },

    {
      id: 10,
      title: "The Friends Work Together",
      location: "Return to Emerald City",
      time: "Daytime",
      narration: [
        "The friends work together. They help each other.",
        "They are brave. They return to the Emerald City.",
        "The Wizard smiles: 'You don't need me.'",
        "Everyone is surprised!",
        "'Scarecrow, you are clever. Tin Man, you are kind. Lion, you are brave.'",
        "'And Dorothy... you are brave too.'"
      ],
      dialogueExchange: [
        { speaker: "Wizard", avatar: "🧙‍♂️", text: "Scarecrow, you are clever!" },
        { speaker: "Wizard", avatar: "🧙‍♂️", text: "Tin Man, you are kind!" },
        { speaker: "Wizard", avatar: "🧙‍♂️", text: "Lion, you are brave!" },
        { speaker: "Dorothy", avatar: "👧", text: "But I want to go home." }
      ],
      visualElements: {
        bg: "friends_celebration",
        mood: "happy_triumph",
        charactersPresent: ["dorothy", "scarecrow", "tinman", "lion", "wizard"]
      },
      soundFx: "fanfare",
      teacherGuide: {
        say: "Highlight the lesson: They already had brains, heart, and courage inside them all along!",
        do: "Point to each character as the Wizard names their quality: Clever, Kind, Brave.",
        next: "Click NEXT for the heartwarming final scene: Returning Home!"
      }
    },
    {
      id: 11,
      title: "Home",
      location: "Kansas Bedroom / Rainbow",
      time: "Sunny Golden Hour",
      narration: [
        "The Wizard helps Dorothy.",
        "She holds Toto. She closes her eyes.",
        "'There's no place like home.'",
        "WHOOSH!",
        "Dorothy opens her eyes. She is home in Kansas.",
        "She sees her family. She hugs Toto.",
        "'We're home!'"
      ],
      dialogueExchange: [
        { speaker: "Dorothy", avatar: "👧", text: "There's no place like home!" },
        { speaker: "Dorothy", avatar: "👧", text: "We're home!" },
        { speaker: "Toto", avatar: "🐕", text: "WOOF! WOOF!" }
      ],
      visualElements: {
        bg: "kansas_home_safe",
        mood: "warm_family_reunion",
        charactersPresent: ["dorothy", "toto"]
      },
      soundFx: "bark",
      teacherGuide: {
        say: "Say softly with Dorothy: 'There's no place like home.' Then cheer with joy!",
        do: "Everyone clap! Celebrate the end of the story! Toto actor does a happy 'WOOF WOOF!'",
        next: "Click 'Post-Story Activities' to choose from Retelling, Memory, Hot Seat, or Alternative Story."
      }
    }
  ],

  // PART 4: CHARACTER MODE BADGES & PROMPTS
  characters: [
    {
      id: "dorothy",
      name: "Dorothy",
      avatar: "👧",
      color: "#3b82f6",
      feeling: "SCARED ➔ BRAVE",
      goal: "GO HOME TO KANSAS",
      lines: [
        "Toto, come with me!",
        "Help!",
        "Where am I?",
        "Come with me / Come with us!",
        "Are you OK?",
        "I want to go home.",
        "There's no place like home!"
      ],
      props: "Ruby slippers / Red shoes & blue basket"
    },
    {
      id: "toto",
      name: "Toto",
      avatar: "🐕",
      color: "#92400e",
      feeling: "PLAYFUL ➔ SCARED ➔ HAPPY",
      goal: "STAY WITH DOROTHY",
      lines: [
        "WOOF! WOOF!",
        "Whimper... whimper...",
        "WOOF! (Happy tail wag!)"
      ],
      props: "Little dog ears headband"
    },
    {
      id: "scarecrow",
      name: "Scarecrow",
      avatar: "🌾",
      color: "#d97706",
      feeling: "CONFUSED ➔ CLEVER",
      goal: "GET A BRAIN",
      lines: [
        "Hello!",
        "I'm a scarecrow.",
        "I need a brain.",
        "Thank you!",
        "Come with us!",
        "Let's think!"
      ],
      props: "Straw hat / yellow neckerchief"
    },
    {
      id: "tinman",
      name: "Tin Man",
      avatar: "🤖",
      color: "#64748b",
      feeling: "STIFF/SAD ➔ KIND/WARM",
      goal: "GET A HEART & OIL",
      lines: [
        "Help! Help!",
        "I need oil!",
        "I cannot move!",
        "Thank you!",
        "I want a heart.",
        "I will help you!"
      ],
      props: "Silver funnel hat / oil can"
    },
    {
      id: "lion",
      name: "Cowardly Lion",
      avatar: "🦁",
      color: "#ea580c",
      feeling: "SCARED ➔ BRAVE",
      goal: "GET COURAGE",
      lines: [
        "ROAR!",
        "I'm sorry!",
        "I'm scared!",
        "I need courage.",
        "OK! Let's go!",
        "We are brave!"
      ],
      props: "Lion mane / furry tail"
    },
    {
      id: "wizard",
      name: "The Wizard of Oz",
      avatar: "🧙‍♂️",
      color: "#059669",
      feeling: "MYSTERIOUS ➔ WISE/KIND",
      goal: "HELP THE TRAVELERS",
      lines: [
        "Who is there?",
        "Come in.",
        "I can help you.",
        "Find the Witch!",
        "You are clever, kind, and brave!"
      ],
      props: "Green top hat / magic wand"
    },
    {
      id: "witch",
      name: "Wicked Witch",
      avatar: "🧙‍♀️",
      color: "#7c3aed",
      feeling: "ANGRY ➔ DEFEATED",
      goal: "STOP DOROTHY",
      lines: [
        "HAHAHAHA!",
        "Who are you?",
        "You cannot win!",
        "Oh no! My magic is gone!"
      ],
      props: "Black witch hat / broomstick"
    }
  ],

  // PART 5: STUDENT-TO-STUDENT INTERACTION DIALOGUES
  studentDialogues: [
    {
      title: "Asking for Direction (Pair Talk)",
      speakerA: { role: "Dorothy", prompt: "Where should we go?" },
      speakerB: { role: "Partner", prompt: "Go to the ____________ (castle / road / forest)." },
      followUpA: { role: "Dorothy", prompt: "Why?" },
      followUpB: { role: "Partner", prompt: "The ____________ is there (Wizard / Tin Man / house)." }
    },
    {
      title: "Checking on a Friend (Pair Talk)",
      speakerA: { role: "Dorothy", prompt: "Are you OK?" },
      speakerB: { role: "Partner", prompt: "Yes, I am. / No, I'm not. I need ____________ (oil / a brain / courage)." }
    },
    {
      title: "Agreeing & Disagreeing (Group Decision)",
      speakerA: { role: "Student A", prompt: "What do you think we should do?" },
      speakerB: { role: "Student B", prompt: "I think we should ____________ (stay together / walk fast)." },
      responses: ["I agree! 👍", "I don't agree. I think... ✋"]
    }
  ],

  // PART 6: CHOOSE THE STORY (2-3 Major Decision Points)
  storyDecisions: [
    {
      id: "dec_1",
      sceneTitle: "At the Crossroads",
      problem: "Dorothy and Toto arrive at a split in the road. Which way should they go?",
      options: [
        { id: "A", text: "Follow the bright yellow brick road", icon: "🧱", sentence: "I think she should follow the yellow road.", outcome: "They meet the friendly Scarecrow waving in the field!" },
        { id: "B", text: "Walk into the dark spooky bushes", icon: "🌿", sentence: "I think she should look in the bushes.", outcome: "They find a hidden shortcut with juicy apples!" },
        { id: "C", text: "Sit and wait for help", icon: "⏳", sentence: "I think she should sit and wait.", outcome: "A friendly Munchkin points toward the yellow path!" }
      ]
    },
    {
      id: "dec_2",
      sceneTitle: "Facing the Dark Forest Gate",
      problem: "The forest is very dark and quiet. How should the four friends enter?",
      options: [
        { id: "A", text: "Hold hands and walk together", icon: "🤝", sentence: "I think they should hold hands.", outcome: "Together they feel strong and no one gets lost!" },
        { id: "B", text: "Lion walks first with a loud roar", icon: "🦁", sentence: "I think the Lion should roar loudly.", outcome: "The Lion scares away the spooky shadows!" },
        { id: "C", text: "Tin Man shines his shiny metal chest", icon: "✨", sentence: "I think Tin Man should lead the way.", outcome: "Tin Man's bright armor lights up the dark trees!" }
      ]
    }
  ],

  // PART 7: POST-STORY ACTIVITY 1 - STORY MEMORY (8 Event Cards)
  storyMemory: {
    cards: [
      { id: 1, title: "1. Tornado", icon: "🌪️", desc: "A tornado picks up the house in Kansas.", order: 1 },
      { id: 2, title: "2. Strange Land", icon: "🌸", desc: "The house lands in a colorful, strange land.", order: 2 },
      { id: 3, title: "3. The Scarecrow", icon: "🌾", desc: "Dorothy meets the Scarecrow on the yellow road.", order: 3 },
      { id: 4, title: "4. The Tin Man", icon: "🤖", desc: "They oil the rusty Tin Man in the forest.", order: 4 },
      { id: 5, title: "5. The Lion", icon: "🦁", desc: "They meet the scared Lion who wants courage.", order: 5 },
      { id: 6, title: "6. Emerald City", icon: "🏰", desc: "The four friends visit the green Emerald City.", order: 6 },
      { id: 7, title: "7. The Witch", icon: "🧙‍♀️", desc: "The brave friends stand together against the Witch.", order: 7 },
      { id: 8, title: "8. Home", icon: "🏡", desc: "Dorothy closes her eyes and returns home to Kansas.", order: 8 }
    ],
    sentenceFrames: [
      "First, there is a ____________.",
      "Then, Dorothy meets the ____________.",
      "Next, they go to the ____________.",
      "Finally, Dorothy goes ____________."
    ]
  },

  // PART 8: POST-STORY ACTIVITY 2 - RETELL PROMPTS & HINTS
  retellPrompts: [
    {
      sceneNum: 1,
      title: "Kansas & Storm",
      icon: "🏡🌪️",
      keywords: ["Kansas", "Dorothy", "Toto", "Storm", "House"],
      starter: "Dorothy lives in... There is a big...",
      targetOutput: "Dorothy lives in Kansas with Toto. There is a big storm."
    },
    {
      sceneNum: 2,
      title: "Meeting Friends",
      icon: "🌾🤖🦁",
      keywords: ["Scarecrow", "Tin Man", "Lion", "Yellow Road", "Friends"],
      starter: "On the yellow road, she meets...",
      targetOutput: "She meets the Scarecrow, the Tin Man, and the Lion."
    },
    {
      sceneNum: 3,
      title: "The Emerald City & Wizard",
      icon: "🏰🧙‍♂️",
      keywords: ["Emerald City", "Wizard", "Brain", "Heart", "Courage"],
      starter: "They walk to the Emerald City to see...",
      targetOutput: "They go to the Wizard. They want a brain, a heart, courage, and home."
    },
    {
      sceneNum: 4,
      title: "Brave Friends & Home",
      icon: "🤝🏡",
      keywords: ["Together", "Brave", "Ruby Slippers", "Home"],
      starter: "The friends are brave together. Finally, Dorothy...",
      targetOutput: "The friends stay together. Dorothy closes her eyes and goes home."
    }
  ],

  // PART 9: POST-STORY ACTIVITY 3 - CHARACTER HOT SEAT
  hotSeat: {
    characters: [
      {
        id: "lion",
        name: "The Lion",
        avatar: "🦁",
        sampleAnswers: {
          q1: "My name is the Cowardly Lion!",
          q2: "Yes, I am very scared of everything!",
          q3: "I want courage from the Wizard.",
          q4: "Dorothy, Toto, Scarecrow, and Tin Man are my friends.",
          q5: "We are going to the Emerald City."
        }
      },
      {
        id: "scarecrow",
        name: "The Scarecrow",
        avatar: "🌾",
        sampleAnswers: {
          q1: "I am the Scarecrow!",
          q2: "I am made of straw, so I cannot hurt.",
          q3: "I want a brain to think clever thoughts!",
          q4: "Dorothy is my best friend.",
          q5: "I am walking on the yellow brick road."
        }
      },
      {
        id: "tinman",
        name: "The Tin Man",
        avatar: "🤖",
        sampleAnswers: {
          q1: "I am the Tin Woodman!",
          q2: "I am fine now because Dorothy gave me oil!",
          q3: "I want a warm heart to love people.",
          q4: "The Scarecrow and Dorothy are my friends.",
          q5: "We are going to see the Wizard."
        }
      },
      {
        id: "dorothy",
        name: "Dorothy",
        avatar: "👧",
        sampleAnswers: {
          q1: "My name is Dorothy.",
          q2: "I was scared in the storm, but now I am brave.",
          q3: "I want to go home to Kansas with Toto.",
          q4: "Toto, Scarecrow, Tin Man, and Lion are my friends.",
          q5: "I am going to find the Wizard of Oz."
        }
      }
    ],
    questionList: [
      { id: "q1", text: "What's your name?", icon: "🏷️" },
      { id: "q2", text: "Are you scared / Are you OK?", icon: "😨" },
      { id: "q3", text: "What do you want?", icon: "🎁" },
      { id: "q4", text: "Who is your friend?", icon: "👫" },
      { id: "q5", text: "Where are you going?", icon: "🗺️" }
    ]
  },

  // PART 10: POST-STORY ACTIVITY 4 - CHANGE THE STORY (WHAT IF...?)
  whatIfScenarios: [
    {
      id: "whatif_1",
      prompt: "What if the Lion wasn't scared?",
      choices: [
        { text: "He helps Dorothy defeat the storm!", icon: "🌪️💪", resultSentence: "The brave Lion jumps high and protects Dorothy from the wind!" },
        { text: "He becomes the king of the Emerald City!", icon: "👑🏰", resultSentence: "The Lion wears a shiny crown and helps the Wizard rule Oz!" },
        { text: "He carries all four friends on his back!", icon: "🦁🏃", resultSentence: "The strong Lion carries Dorothy and friends quickly down the yellow road!" }
      ]
    },
    {
      id: "whatif_2",
      prompt: "What if the Tin Man had rocket boots?",
      choices: [
        { text: "He flies over the dark forest!", icon: "🚀🌲", resultSentence: "Tin Man zooms through the sky and spots the Emerald City from above!" },
        { text: "He rescues Toto from the tornado!", icon: "🚀🐕", resultSentence: "Tin Man flies into the cloud and catches Toto safely!" }
      ]
    },
    {
      id: "whatif_3",
      prompt: "What if Dorothy invited the Wizard to Kansas?",
      choices: [
        { text: "The Wizard does magic tricks on the farm!", icon: "🎩🏡", resultSentence: "The Wizard visits Kansas and makes giant rainbow corn!" },
        { text: "They all build a warm cozy house together!", icon: "🏠❤️", resultSentence: "Dorothy and the Wizard have tea with Aunt Em and Toto!" }
      ]
    }
  ],

  // PART 11: FINAL PERFORMANCE (GROUP MINI-THEATRE)
  miniTheatreGroups: [
    {
      groupNum: 1,
      title: "Scene A: Meeting in the Cornfield",
      characters: ["Dorothy", "Toto", "Scarecrow"],
      stageBg: "yellow_road_scarecrow",
      soundEffect: "pop",
      lines: [
        "Dorothy: Hello! Who are you?",
        "Scarecrow: I'm a scarecrow. I need a brain!",
        "Dorothy: Come with me!",
        "Scarecrow: Thank you!"
      ]
    },
    {
      groupNum: 2,
      title: "Scene B: Oiling the Rusty Tin Man",
      characters: ["Dorothy", "Tin Man", "Scarecrow"],
      stageBg: "forest_tinman",
      soundEffect: "door_creak",
      lines: [
        "Tin Man: Help! I need oil!",
        "Dorothy: (Applies oil) Are you OK now?",
        "Tin Man: Yes! I want a heart.",
        "Scarecrow: Come with us!"
      ]
    },
    {
      groupNum: 3,
      title: "Scene C: The Lion Jumps Out!",
      characters: ["Dorothy", "Scarecrow", "Lion"],
      stageBg: "forest_lion",
      soundEffect: "lion_roar",
      lines: [
        "Lion: ROAR! ... I'm sorry, I'm scared!",
        "Dorothy: Are you a scary lion?",
        "Lion: No, I need courage!",
        "Scarecrow: Let's walk to the Wizard together!"
      ]
    },
    {
      groupNum: 4,
      title: "Scene D: Facing the Wizard & Going Home",
      characters: ["Dorothy", "Toto", "Wizard", "All Friends"],
      stageBg: "friends_celebration",
      soundEffect: "fanfare",
      lines: [
        "Wizard: You are clever, kind, and brave!",
        "Dorothy: There's no place like home!",
        "Toto: WOOF! WOOF!",
        "All: Hurray! Great job, friends!"
      ]
    }
  ],

  // PART 12: TEACHER ASSESSMENT GRID
  assessmentRubric: [
    { id: "listening", name: "Listening", desc: "Understands main story events and teacher's spoken instructions" },
    { id: "speaking", name: "Speaking", desc: "Produces simple A1+ sentences with sentence frame support" },
    { id: "interaction", name: "Interaction", desc: "Responds to and collaborates with a partner in pair talk" },
    { id: "prediction", name: "Prediction", desc: "Uses 'I think...' / 'I think ... will ...' with choices" },
    { id: "roleplay", name: "Role-Play", desc: "Expresses character feelings, gestures, and short lines" },
    { id: "retelling", name: "Retelling", desc: "Sequences key events using First, Then, Next, Finally" }
  ]
};
