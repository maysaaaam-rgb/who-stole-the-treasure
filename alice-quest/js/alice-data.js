/**
 * ALICE IN WONDERLAND XP QUEST DECK — DATA & CURRICULUM REGISTRY
 * 12 Differentiated Challenges + Base Participation
 * Pure Vanilla ES6+ | Zero External Dependencies
 */
(function(root) {
  'use strict';

  const ALICE_QUEST_DATA = {
    meta: {
      id: "alice-quest",
      title: "Alice in Wonderland XP Challenges",
      subtitle: "Choose a challenge. The more you challenge yourself, the more XP you earn!",
      quote: "Every adventure starts with a choice. — Alice ❤️",
      slogan: "Same Story. Different Challenges. Brighter Learners!",
      grade: "Grade 3–5",
      cefrLevel: "A1–B1",
      totalQuests: 13,
      maxXP: 200,
      curriculumRef: "Alice's Adventures in Wonderland / Primary ESL Reading & Speaking"
    },

    tiers: {
      baseline: {
        id: "baseline",
        levelNum: 0,
        title: "Base Participation",
        badge: "Every adventure starts with a choice",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        xpRange: "+10 XP",
        focus: "Attendance, Active Listening & Daily Reading Habit",
        characterTheme: "Drink Me Vial & Eat Me Cake"
      },
      level1: {
        id: "level1",
        levelNum: 1,
        title: "LEVEL 1: GET STARTED!",
        badge: "Small steps lead to big adventures!",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.4)",
        xpRange: "+10 to +20 XP",
        focus: "Vocabulary & Understanding",
        characterTheme: "White Rabbit with Pocket Watch"
      },
      level2: {
        id: "level2",
        levelNum: 2,
        title: "LEVEL 2: GO DEEPER!",
        badge: "Curious minds go further!",
        color: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.4)",
        xpRange: "+40 to +50 XP",
        focus: "Thinking & Applied English",
        characterTheme: "Cheshire Cat in the Moonlight"
      },
      level3: {
        id: "level3",
        levelNum: 3,
        title: "LEVEL 3: BIG CHALLENGE! 👑",
        badge: "Think deeper. Speak braver. Earn bigger!",
        color: "#c084fc",
        glow: "rgba(192, 132, 252, 0.4)",
        xpRange: "+80 to +200 XP",
        focus: "Deep Mastery & Performance",
        characterTheme: "Mad Hatter's Tea Party"
      }
    },

    quests: [
      // Card 0: Base Participation Guarantee
      {
        id: "quest-00",
        code: "BASE-00",
        order: 0,
        tier: "baseline",
        level: 0,
        levelLabel: "Base Participation",
        title: "No Challenge? That's Okay!",
        tagline: "Every adventure starts with a choice.",
        xp: 10,
        badgeColor: "#f59e0b",
        icon: "✨",
        character: "drink-me",
        illustrationType: "drink-me",
        instructions: [
          "Join today's classroom reading session.",
          "Follow along with the story and listen carefully.",
          "Log your reading check-in with your teacher."
        ],
        promptTTS: "No Challenge? That's okay! You will still get 10 XP for being here and logging your reading check-in. Every adventure starts with a choice.",
        scaffold: "I listened to the story today. My favorite moment was...",
        criteria: "Presence, active listening, and class participation recorded.",
        learningOutcome: "Builds a daily reading routine and low-stakes positive reinforcement."
      },

      // LEVEL 1: GET STARTED! (Green Tier — Vocabulary & Understanding)
      {
        id: "quest-01",
        code: "LV1-01",
        order: 1,
        tier: "level1",
        level: 1,
        levelLabel: "Level 1: Get Started!",
        title: "Learn 10 New Words",
        tagline: "Find 10 words from the story and explain their meanings.",
        xp: 10,
        badgeColor: "#10b981",
        icon: "📖",
        character: "rabbit",
        illustrationType: "rabbit",
        instructions: [
          "Search your book or reader for 10 unfamiliar vocabulary words.",
          "Write each word clearly in your notebook or quest passport.",
          "Write a simple, clear definition in English or draw a quick sketch.",
          "Share 3 of your words aloud with a partner or the class."
        ],
        promptTTS: "Learn 10 new words from the story and explain their meanings. Write them down and practice using them.",
        scaffold: "One new word is 'curious'. It means wanting to know or learn something new!",
        criteria: "10 words listed with accurate simple definitions.",
        examples: [
          "curious (wanting to know)",
          "waistcoat (small jacket without sleeves)",
          "burrow (a rabbit's underground hole)",
          "furious (very angry)",
          "grinning (smiling broadly)"
        ],
        learningOutcome: "Expand receptive and productive story vocabulary."
      },
      {
        id: "quest-02",
        code: "LV1-02",
        order: 2,
        tier: "level1",
        level: 1,
        levelLabel: "Level 1: Get Started!",
        title: "Favorite Character",
        tagline: "Name your favorite character and give 3 complete reasons why.",
        xp: 15,
        badgeColor: "#10b981",
        icon: "❤️",
        character: "rabbit",
        illustrationType: "rabbit",
        instructions: [
          "Choose 1 character from Wonderland (Alice, White Rabbit, Cheshire Cat, Mad Hatter, Queen).",
          "State your character choice in a clear, full sentence.",
          "Give reason 1 using: 'First, I like them because...'",
          "Give reason 2 using: 'Second, they are...'",
          "Give reason 3 using: 'Third, when they... it was very funny!'"
        ],
        promptTTS: "Tell us your favorite character and give three complete reasons why you like them.",
        scaffold: "My favorite character is the White Rabbit because he is always in a hurry, he wears a funny waistcoat, and he carries a magical pocket watch!",
        criteria: "1 character named + 3 distinct, complete English reasons.",
        learningOutcome: "Express personal preferences using structured causative clauses."
      },
      {
        id: "quest-03",
        code: "LV1-03",
        order: 3,
        tier: "level1",
        level: 1,
        levelLabel: "Level 1: Get Started!",
        title: "Draw & Explain",
        tagline: "Draw a character or scene, color it, and write 2 sentences explaining your drawing.",
        xp: 20,
        badgeColor: "#10b981",
        icon: "🎨",
        character: "rabbit",
        illustrationType: "rabbit",
        instructions: [
          "Pick an exciting scene or character to draw in your quest passport.",
          "Use bright, expressive colors to bring Wonderland to life.",
          "Write Sentence 1 describing who or what is in your picture.",
          "Write Sentence 2 describing what is happening or how the character feels."
        ],
        promptTTS: "Draw a character or scene from Alice in Wonderland, color it, and write two sentences explaining your drawing.",
        scaffold: "This is Alice falling down the deep rabbit hole. She sees floating cupboards, books, and jars of marmalade!",
        criteria: "Vibrant drawing + 2 grammatically accurate explanatory sentences.",
        learningOutcome: "Bridge visual-spatial representation with descriptive writing."
      },
      {
        id: "quest-04",
        code: "LV1-04",
        order: 4,
        tier: "level1",
        level: 1,
        levelLabel: "Level 1: Get Started!",
        title: "Comprehension Questions",
        tagline: "Answer 5 teacher questions in complete sentences with book evidence.",
        xp: 20,
        badgeColor: "#10b981",
        icon: "📝",
        character: "rabbit",
        illustrationType: "rabbit",
        instructions: [
          "Read each of the 5 story questions carefully.",
          "Answer each question using a full sentence (Subject + Verb + Detail).",
          "Include evidence: cite the page number or quote a detail from the story.",
          "Check your punctuation and capitalization."
        ],
        promptTTS: "Answer 5 comprehension questions about the story in complete sentences using evidence from the book.",
        scaffold: "Why did Alice follow the rabbit? Alice followed the rabbit because he took a watch out of his waistcoat pocket and spoke English!",
        criteria: "5 complete sentences with factual evidence from the text.",
        learningOutcome: "Extract textual evidence and formulate written answers."
      },

      // LEVEL 2: GO DEEPER! (Blue Tier — Application & Creative Writing)
      {
        id: "quest-05",
        code: "LV2-01",
        order: 5,
        tier: "level2",
        level: 2,
        levelLabel: "Level 2: Go Deeper!",
        title: "25 Words & 10 Sentences",
        tagline: "Collect 25 vocabulary words and write 10 original sentences.",
        xp: 40,
        badgeColor: "#38bdf8",
        icon: "📚",
        character: "cheshire",
        illustrationType: "cheshire",
        instructions: [
          "Hunt through your chapters to collect 25 exciting descriptive words.",
          "Choose the best 10 words from your master list.",
          "Compose 10 original, imaginative sentences using those words.",
          "Underline or highlight the target vocabulary word in each sentence."
        ],
        promptTTS: "Collect 25 vocabulary words from the story and write 10 original sentences using your new vocabulary.",
        scaffold: "Target word: 'peculiar'. Sentence: The Cheshire Cat had a peculiar habit of disappearing into thin air!",
        criteria: "25 words compiled + 10 original sentences with proper syntax.",
        learningOutcome: "High-volume lexical acquisition and generative sentence production."
      },
      {
        id: "quest-06",
        code: "LV2-02",
        order: 6,
        tier: "level2",
        level: 2,
        levelLabel: "Level 2: Go Deeper!",
        title: "2-Minute Character Talk",
        tagline: "Speak continuously about one character (personality, actions, and story role).",
        xp: 50,
        badgeColor: "#38bdf8",
        icon: "💬",
        character: "cheshire",
        illustrationType: "cheshire",
        instructions: [
          "Select one prominent Wonderland character to spotlight.",
          "Structure your talk: Introduction (Name & role) -> Personality (Adjectives) -> Key Actions -> Conclusion.",
          "Speak out loud for a full 2 minutes without stopping or reading from paper.",
          "Use expressive tone, posture, and eye contact."
        ],
        promptTTS: "Speak about one character for two minutes. Talk about their personality, their actions, and their role in the story.",
        scaffold: "Today I will analyze the Cheshire Cat. He is mysterious, calm, and mischievous. When Alice asks for directions, he teaches her that all roads lead somewhere...",
        criteria: "Continuous 2-minute oral presentation covering personality, actions, and significance.",
        learningOutcome: "Develop oral fluency, stamina, and character analysis."
      },
      {
        id: "quest-07",
        code: "LV2-03",
        order: 7,
        tier: "level2",
        level: 2,
        levelLabel: "Level 2: Go Deeper!",
        title: "Retell a Scene",
        tagline: "Close the book and orally retell a key scene step-by-step (First, Next, Then, Finally).",
        xp: 50,
        badgeColor: "#38bdf8",
        icon: "🎬",
        character: "cheshire",
        illustrationType: "cheshire",
        instructions: [
          "Select an unforgettable scene (The Rabbit Hole, The Mad Tea Party, The Croquet Game).",
          "Close the book completely — do not look at the text!",
          "Use sequence connectors: First..., Next..., Then..., After that..., Finally...",
          "Include descriptive sensory details: sounds, feelings, and character reactions."
        ],
        promptTTS: "Close the book and orally retell one important scene step-by-step using sequence words like first, next, then, and finally.",
        scaffold: "First, Alice sat down at the large tea table. Next, the March Hare shouted 'No room!' Then, the Mad Hatter asked an impossible riddle. Finally, Alice walked away in frustration!",
        criteria: "Smooth oral retelling from memory using at least 4 sequence signal words.",
        learningOutcome: "Master chronological narrative sequencing from memory."
      },
      {
        id: "quest-08",
        code: "LV2-04",
        order: 8,
        tier: "level2",
        level: 2,
        levelLabel: "Level 2: Go Deeper!",
        title: "Write a New Ending",
        tagline: "Write an alternate 100–150 word ending for the trial or tea party.",
        xp: 50,
        badgeColor: "#38bdf8",
        icon: "✍️",
        character: "cheshire",
        illustrationType: "cheshire",
        instructions: [
          "Choose a climax moment to change (e.g. the Queen's trial or the Mad Tea Party).",
          "Introduce an unexpected plot twist or creative solution.",
          "Write 100 to 150 words in clear Past Simple and Past Continuous tense.",
          "Include character dialogue in quotation marks."
        ],
        promptTTS: "Write an alternate ending for the story in 100 to 150 words. Create a surprising twist for the characters!",
        scaffold: "Instead of the cards attacking Alice, the Queen of Hearts smiled and invited everyone to eat cherry tarts together. 'You are brave, Alice,' said the King...",
        criteria: "100–150 words, coherent narrative arc, correct past tense verb usage.",
        learningOutcome: "Creative writing, narrative tension, and past-tense mastery."
      },

      // LEVEL 3: BIG CHALLENGE! (Pink Tier — Critical Thinking & Performance)
      {
        id: "quest-09",
        code: "LV3-01",
        order: 9,
        tier: "level3",
        level: 3,
        levelLabel: "Level 3: Big Challenge!",
        title: "Character Comparison",
        tagline: "Compare two characters in detail (2 similarities and 3 clear differences).",
        xp: 80,
        badgeColor: "#c084fc",
        icon: "👫",
        character: "hatter",
        illustrationType: "hatter",
        instructions: [
          "Select two characters to contrast (e.g. Alice vs. Queen of Hearts, or White Rabbit vs. Mad Hatter).",
          "Identify 2 key similarities (e.g., both live in Wonderland, both care about rules or time).",
          "Identify 3 distinct differences (temperament, treatment of others, problem-solving).",
          "Deliver your comparison as a structured presentation or written comparative essay."
        ],
        promptTTS: "Compare two characters in detail. Explain two similarities and three clear differences between them.",
        scaffold: "While both Alice and the Queen are strong-willed, Alice seeks logic and fairness, whereas the Queen rules through anger and shouting 'Off with their heads!'",
        criteria: "2 explicit similarities + 3 distinct differences with textual justification.",
        learningOutcome: "Comparative analysis and contrastive discourse markers."
      },
      {
        id: "quest-10",
        code: "LV3-02",
        order: 10,
        tier: "level3",
        level: 3,
        levelLabel: "Level 3: Big Challenge!",
        title: "Alice's Journey & Growth",
        tagline: "Explain how Alice changes from timid and confused to brave and confident.",
        xp: 80,
        badgeColor: "#c084fc",
        icon: "💡",
        character: "hatter",
        illustrationType: "hatter",
        instructions: [
          "Analyze Alice at the beginning of the book (curious, timid, crying giant tears).",
          "Identify 2 turning point scenes that test her courage.",
          "Analyze Alice at the end of the book (standing tall in the courtroom, challenging the Queen).",
          "Synthesize the moral: What did Alice learn about herself in Wonderland?"
        ],
        promptTTS: "Explain Alice's personal journey and how she transforms from timid and confused to brave and confident.",
        scaffold: "At the beginning, Alice was bewildered and wept a pool of tears. However, by the trial, she grew tall and proclaimed: 'You're nothing but a pack of cards!' showing true courage.",
        criteria: "Clear contrast between beginning and ending states, backed by specific character growth stages.",
        learningOutcome: "Deep literary character arc analysis and thematic synthesis."
      },
      {
        id: "quest-11",
        code: "LV3-03",
        order: 11,
        tier: "level3",
        level: 3,
        levelLabel: "Level 3: Big Challenge!",
        title: "Act Out a Scene",
        tagline: "Perform a dramatic scene with a partner or solo video using props and expressive voices.",
        xp: 100,
        badgeColor: "#c084fc",
        icon: "🎭",
        character: "hatter",
        illustrationType: "hatter",
        instructions: [
          "Partner up or prepare a solo dramatic monologue.",
          "Choose an iconic scene (Mad Tea Party, Cheshire Cat on the branch, Courtroom confrontation).",
          "Equip or make at least 1 costume piece or physical prop (tea cup, top hat, pocket watch, crown).",
          "Perform with expressive theatrical voices, animated gestures, and eye contact."
        ],
        promptTTS: "Act out a dramatic scene with a partner or record a solo video. Use expressive voices, body language, and creative props!",
        scaffold: "[In an eccentric Mad Hatter voice]: 'Have some tea!' [Alice]: 'I don't see any tea!' [Mad Hatter]: 'There isn't any!' [Laughter]",
        criteria: "Vocal emotion, expressive movement, physical prop use, and memorized or fluent delivery.",
        learningOutcome: "Kinesthetic embodiment, prosodic expression, and dramatic dialogue."
      },
      {
        id: "quest-12",
        code: "LV3-04",
        order: 12,
        tier: "level3",
        level: 3,
        levelLabel: "Level 3: Big Challenge!",
        title: "Mastery Summary",
        tagline: "Give a 5-to-7 minute spoken summary of the ENTIRE book in your own words.",
        xp: 200,
        badgeColor: "#c084fc",
        icon: "👑",
        character: "hatter",
        illustrationType: "hatter",
        instructions: [
          "Read and master the ENTIRE story from cover to cover.",
          "Map the 4 classic narrative stages: Exposition -> Rising Action -> Climax -> Resolution.",
          "Speak for 5 to 7 continuous minutes without reading directly from notes.",
          "Include character quotes, thematic insights, and personal evaluation of the story."
        ],
        promptTTS: "Read the entire book and give a 5 to 7 minute spoken summary in your own words. Cover the exposition, rising action, climax, and resolution!",
        scaffold: "Alice in Wonderland begins on a quiet riverbank when Alice spots a White Rabbit in a waistcoat. Her descent into the rabbit hole initiates a surreal exploration of identity, logic, and nonsensical rules...",
        criteria: "5–7 minute continuous spoken summary covering complete story arc with high vocabulary mastery.",
        learningOutcome: "Holistic literary synthesis, macro-discourse cohesion, and capstone spoken fluency."
      }
    ],

    // Default Classroom Roster (synced with platform store or localStorage)
    defaultRoster: [
      { id: "s-01", name: "Maya Lin", grade: "Grade 3", level: "Lv 4 Explorer", xp: 280, avatar: "👧" },
      { id: "s-02", name: "Lucas Silva", grade: "Grade 3", level: "Lv 3 Seeker", xp: 210, avatar: "👦" },
      { id: "s-03", name: "Noah Chen", grade: "Grade 4", level: "Lv 5 Adventurer", xp: 350, avatar: "🧒" },
      { id: "s-04", name: "Chloe Dubois", grade: "Grade 3", level: "Lv 4 Explorer", xp: 290, avatar: "👧" },
      { id: "s-05", name: "Leo Martinez", grade: "Grade 4", level: "Lv 3 Seeker", xp: 195, avatar: "👦" },
      { id: "s-06", name: "Emma Watson", grade: "Grade 4", level: "Lv 6 Champion", xp: 420, avatar: "👧" },
      { id: "s-07", name: "Sophia Rossi", grade: "Grade 3", level: "Lv 2 Scout", xp: 140, avatar: "👧" },
      { id: "s-08", name: "Ethan Park", grade: "Grade 4", level: "Lv 5 Adventurer", xp: 360, avatar: "👦" }
    ]
  };

  root.ALICE_QUEST_DATA = ALICE_QUEST_DATA;
})(typeof window !== 'undefined' ? window : global);
