/**
 * 🧠 THE DAY YOUR BRAIN QUIT! — Curriculum & Pedagogical Data
 * Target: Grade 4 ESL Students (A1–A1+, Age 9–10)
 * Main Skill: Reading – Skimming (Unit 1 p17 RG2)
 */

const BRAIN_LESSON_DATA = {
  meta: {
    title: "THE DAY YOUR BRAIN QUIT!",
    subtitle: "Can you save your brain?",
    unit: "Unit 1 Page 17 (RG2)",
    readingTitle: "How Your Brain Learns",
    targetAge: "Grade 4 (A1–A1+)",
    totalClues: 5,
    maxXP: 100
  },

  stages: [
    { id: 1, title: "1. The Mysterious Message", time: "0–3 min", clueId: null },
    { id: 2, title: "2. Brain Emergency Meeting", time: "3–6 min", clueId: null },
    { id: 3, title: "3. Skim Like a Detective", time: "6–10 min", clueId: null },
    { id: 4, title: "4. The Four Doors", time: "10–14 min", clueId: 1 },
    { id: 5, title: "5. Find the Evidence", time: "14–18 min", clueId: 2 },
    { id: 6, title: "6. Brain Job Application", time: "18–23 min", clueId: 3 },
    { id: 7, title: "7. Life Without a Brain?", time: "23–27 min", clueId: 4 },
    { id: 8, title: "8. Convince Your Brain", time: "27–31 min", clueId: 5 },
    { id: 9, title: "9. Mission Complete!", time: "31–34 min", clueId: null },
    { id: 10, title: "10. Exit Ticket", time: "34–35 min", clueId: null }
  ],

  screen1: {
    urgentHeader: "URGENT MESSAGE 🚨",
    letter: [
      "Dear Student,",
      "I am tired.",
      "I think I will stop working tomorrow.",
      "Sorry.",
      "— Your Brain 🧠"
    ],
    question: "What would happen if your brain stopped working?",
    options: [
      {
        id: "A",
        text: "I couldn't learn.",
        correct: true,
        reaction: "That's true! Your brain does all your learning. We must investigate!"
      },
      {
        id: "B",
        text: "Nothing would happen.",
        correct: false,
        reaction: "Wait, really?! Without a brain you couldn't even think of that answer!"
      },
      {
        id: "C",
        text: "I could do everything normally.",
        correct: false,
        reaction: "Oh no! Your brain controls your whole body and mind!"
      }
    ],
    missionBrief: "Find out what your brain does and convince it to stay!"
  },

  screen2: {
    prompt: "What do you think your brain does?",
    subtitle: "Click the 4 power nodes to see how your brain works:",
    nodes: [
      {
        id: "think",
        title: "THINK",
        icon: "💡",
        color: "#f59e0b",
        headline: "Your brain helps you solve problems.",
        example: "When you do a puzzle or answer questions, your brain is thinking fast!",
        voice: "Your brain helps you solve problems. When you do a puzzle or answer questions, your brain is thinking fast!"
      },
      {
        id: "learn",
        title: "LEARN",
        icon: "📚",
        color: "#3b82f6",
        headline: "Your brain helps you learn English.",
        example: "Every time you hear a new word, your brain builds a new connection!",
        voice: "Your brain helps you learn English. Every time you hear a new word, your brain builds a new connection!"
      },
      {
        id: "remember",
        title: "REMEMBER",
        icon: "🧠",
        color: "#8b5cf6",
        headline: "Your brain helps you remember words.",
        example: "Your brain stores memories like names, birthdays, and songs.",
        voice: "Your brain helps you remember words. It stores memories like names, birthdays, and songs!"
      },
      {
        id: "imagine",
        title: "IMAGINE",
        icon: "☁️",
        color: "#ec4899",
        headline: "Your brain helps you imagine new things.",
        example: "You can picture a superhero, a flying elephant, or a story in space!",
        voice: "Your brain helps you imagine new things. You can picture flying animals or stories in space!"
      }
    ]
  },

  screen3: {
    detectiveSaid: "We don't have time to read every word! Use your detective eyes!",
    brainSaid: "Look at my title, pictures, and big bold words!",
    timerSeconds: 30,
    rules: [
      { step: 1, text: "Look at the title.", icon: "🏷️" },
      { step: 2, text: "Look at the pictures.", icon: "🖼️" },
      { step: 3, text: "Look for important words.", icon: "🔤" },
      { step: 4, text: "Try to understand the main idea.", icon: "🎯" },
      { step: 5, text: "DON'T READ EVERY WORD!", icon: "⚡" }
    ],
    textbookHotspots: [
      {
        id: "title",
        title: "Title: How Your Brain Learns",
        text: "The title tells you the topic immediately: LEARNING!",
        badge: "TITLE"
      },
      {
        id: "diagram",
        title: "Brain Diagram: Different Parts",
        text: "Notice the colorful parts: Thinking, Memory, Senses, Words!",
        badge: "PICTURE"
      },
      {
        id: "keywords",
        title: "Key Words: learn, parts, remember",
        text: "These bold words repeat again and again in the reading!",
        badge: "IMPORTANT WORDS"
      }
    ]
  },

  screen4: {
    question: "What is the reading mainly about?",
    subQuestion: "Which door will you choose?",
    doors: [
      {
        id: "A",
        letter: "A",
        title: "The size of the brain",
        icon: "📏",
        correct: false,
        hint: "Not quite! The reading doesn't talk about how heavy or big the brain is."
      },
      {
        id: "B",
        letter: "B",
        title: "The different parts of the brain we use when we learn",
        icon: "📚",
        correct: true,
        hint: "BINGO! The reading shows how different parts (Thinking, Memory, Words) work together to learn!"
      },
      {
        id: "C",
        letter: "C",
        title: "What the brain looks like",
        icon: "👀",
        correct: false,
        hint: "The picture shows the brain, but the whole reading is about how it learns!"
      },
      {
        id: "D",
        letter: "D",
        title: "What the imagination is",
        icon: "🌈",
        correct: false,
        hint: "Imagination is great, but the text focuses on parts we use when we learn."
      }
    ],
    metacognition: {
      question: "Detective Check: How did you know the answer?",
      tools: [
        { id: "title", label: "🏷️ Looked at the Title", feedback: "Yes! 'How Your Brain Learns' gives the clue!" },
        { id: "pictures", label: "🖼️ Looked at the Pictures", feedback: "Yes! The diagram shows different brain parts!" },
        { id: "words", label: "🔤 Looked for Important Words", feedback: "Yes! Words like 'learn' and 'parts' are everywhere!" },
        { id: "all", label: "⭐ All Three! (I Skimmed!)", feedback: "MASTER DETECTIVE! That is the secret of skimming!" }
      ]
    },
    clueUnlocked: {
      number: 1,
      title: "Clue 1 Discovered!",
      desc: "The brain has different parts that work together to help you learn!"
    }
  },

  screen5: {
    header: "DETECTIVE EVIDENCE BOARD",
    instruction: "Match each detective skimming rule with the evidence from the textbook!",
    slots: [
      {
        id: "slot_title",
        name: "CLUE 1: TITLE",
        expectedTag: "title",
        label: "Look at the title",
        correctText: "Title says: 'How Your Brain Learns'"
      },
      {
        id: "slot_pictures",
        name: "CLUE 2: PICTURES",
        expectedTag: "pictures",
        label: "Look at the pictures",
        correctText: "Diagram shows parts: Thinking, Words, Memory, Senses"
      },
      {
        id: "slot_words",
        name: "CLUE 3: IMPORTANT WORDS",
        expectedTag: "words",
        label: "Look for important words",
        correctText: "Bold words repeat: learn, parts, remember, information"
      }
    ],
    cards: [
      { id: "card_title", tag: "title", text: "Title: 'How Your Brain Learns'", icon: "🏷️" },
      { id: "card_pic", tag: "pictures", text: "Diagram showing brain parts & functions", icon: "🖼️" },
      { id: "card_words", tag: "words", text: "Keywords: 'learn', 'parts', 'remember'", icon: "🔤" },
      { id: "card_fake1", tag: "fake", text: "Recipe for chocolate chip cookies", icon: "🍪" },
      { id: "card_fake2", tag: "fake", text: "Map of the shopping mall", icon: "🗺️" }
    ],
    clueUnlocked: {
      number: 2,
      title: "Clue 2 Discovered!",
      desc: "Titles, pictures, and bold words give the main idea in seconds!"
    }
  },

  screen6: {
    title: "BRAIN JOB APPLICATION",
    name: "My Brain",
    jobRoles: [
      "Master Problem Solver",
      "Chief Learning Officer",
      "Super Memory Keeper",
      "Imagination Director"
    ],
    skills: [
      { id: "s1", verb: "THINK", text: "It can THINK and solve difficult puzzles.", icon: "💡" },
      { id: "s2", verb: "LEARN", text: "It can LEARN new English words and facts.", icon: "📚" },
      { id: "s3", verb: "REMEMBER", text: "It can REMEMBER names, faces, and stories.", icon: "🧠" },
      { id: "s4", verb: "IMAGINE", text: "It can IMAGINE flying animals and adventures.", icon: "☁️" }
    ],
    clueUnlocked: {
      number: 3,
      title: "Clue 3 Discovered!",
      desc: "Your brain does 4 giant jobs: Think, Learn, Remember, and Imagine!"
    }
  },

  screen7: {
    title: "Life Without a Brain?",
    subtitle: "Can your brain help in these situations?",
    situations: [
      {
        id: "pizza",
        title: "You want to eat pizza.",
        emoji: "🍕",
        imageIdx: 0,
        question: "Can your brain help?",
        brainYesReaction: "TASTE & SMELL! Your brain tells your tongue: 'Mmm, delicious cheese!'",
        brainNoReaction: "Actually YES! Without your brain, you couldn't taste or chew!"
      },
      {
        id: "english",
        title: "You learn a new English word.",
        emoji: "📚",
        imageIdx: 1,
        question: "Can your brain help?",
        brainYesReaction: "LEARN & REMEMBER! Your brain connects the letters and remembers the sound!",
        brainNoReaction: "Actually YES! Without your brain, words are just random squiggles!"
      },
      {
        id: "puzzle",
        title: "You solve a difficult puzzle.",
        emoji: "🧩",
        imageIdx: 2,
        question: "Can your brain help?",
        brainYesReaction: "THINK & FOCUS! Your brain sees shapes and figures out where each piece fits!",
        brainNoReaction: "Actually YES! Puzzle pieces don't solve themselves—your brain does!"
      },
      {
        id: "elephant",
        title: "You imagine a flying elephant.",
        emoji: "🐘",
        imageIdx: 3,
        question: "Can your brain help?",
        brainYesReaction: "IMAGINATION! Flying elephant with butterfly wings? That is 100% brain power!",
        brainNoReaction: "Actually YES! Only a powerful brain can invent magic creatures!"
      }
    ],
    clueUnlocked: {
      number: 4,
      title: "Clue 4 Discovered!",
      desc: "Everything you do, taste, think, and imagine needs your brain!"
    }
  },

  screen8: {
    dialogue: "Hmm... Maybe I won't quit. But what do you really know about me? Can you convince me?",
    sentenceStarters: [
      {
        label: "Sentence 1:",
        prefix: "The brain is ",
        options: ["amazing", "hard-working", "super", "important", "brilliant"]
      },
      {
        label: "Sentence 2:",
        prefix: "It can ",
        options: ["learn English", "remember facts", "solve puzzles", "create great ideas"]
      },
      {
        label: "Sentence 3:",
        prefix: "It helps us ",
        options: ["grow every day", "speak English", "be happy and curious", "discover the world"]
      }
    ],
    clueUnlocked: {
      number: 5,
      title: "Clue 5 Discovered!",
      desc: "You have all 5 clues! You proved the brain is irreplaceable!"
    }
  },

  screen9: {
    title: "MISSION COMPLETE! 🎉",
    subtitle: "YOU SAVED YOUR BRAIN!",
    brainWords: "Thank you, Brain Detectives! I'm not quitting! I'm staying with you forever!",
    badge: "BRAIN DEFENDER GOLD BADGE",
    xpAward: 100,
    checklist: [
      "We can skim a reading in 30 seconds.",
      "We can find the main idea.",
      "We can use titles and pictures as clues.",
      "We can identify important keywords.",
      "We can talk about what the brain does."
    ]
  },

  screen10: {
    title: "FINAL DETECTIVE NOTE 📓",
    prompt1: "One thing I learned about the brain:",
    options1: [
      "The brain has different parts for learning.",
      "The brain helps me think, learn, remember, and imagine.",
      "Skimming means looking at titles and pictures quickly."
    ],
    prompt2: "My brain can:",
    options2: [
      "Learn new English words every day!",
      "Solve puzzles and think of creative ideas!",
      "Help me imagine wonderful dreams and stories!"
    ],
    motto: "A HEALTHY BRAIN = A BRIGHTER YOU! 🌟",
    footerQuote: "“Your brain is amazing. Take care of it!”"
  }
};

if (typeof window !== "undefined") {
  window.BRAIN_LESSON_DATA = BRAIN_LESSON_DATA;
}
