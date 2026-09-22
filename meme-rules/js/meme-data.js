/**
 * ADVENTURE ACADEMY: MEME RULES CLIL LESSON DATA
 * 25 Complete Meme Archetypes with Inline SVGs, Imperatives, Verbs & Speech Prompts
 * CEFR A1-A2 | Classroom Rules & Imperative Structures
 */
(function(root) {
  'use strict';

  // SVG Avatar Generator helper for crisp, vibrant meme archetypes with glowing filters
  function getMemeSvg(archetype, color1, color2, iconSymbol) {
    return `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${archetype}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
        <filter id="glow-${archetype}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="${color1}" flood-opacity="0.45"/>
        </filter>
      </defs>
      <rect width="120" height="120" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      <circle cx="60" cy="56" r="42" fill="url(#grad-${archetype})" filter="url(#glow-${archetype})"/>
      <circle cx="60" cy="56" r="38" fill="#090d16" opacity="0.4"/>
      <!-- Inner Archetype Icon / Character Silhouette -->
      <g transform="translate(60, 56) scale(1.1)">
        <text x="0" y="14" font-size="36" text-anchor="middle" dominant-baseline="central">${iconSymbol}</text>
      </g>
      <!-- Cyber Frame Badging -->
      <path d="M 24 104 L 96 104" stroke="${color1}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <circle cx="24" cy="104" r="3" fill="#ffffff"/>
      <circle cx="96" cy="104" r="3" fill="#ffffff"/>
    </svg>`;
  }

  const MEME_RULES_DATA = {
    meta: {
      id: "meme-rules",
      title: "🎭 Classroom Meme Rules: Imperatives in Action",
      subtitle: "Master Positive & Negative Imperatives with Classroom Memes",
      cefrLevel: "A1–A2",
      totalMemes: 25,
      xp: 150,
      grammarFormula: {
        positive: "Base Verb + Object",
        negative: "Don't + Base Verb"
      },
      targetVocab: [
        "raise", "speak", "listen", "whisper", "share", "wait"
      ]
    },

    // Phase 1: Meme Reaction Scanner (Input & Discovery)
    scannerMemes: [
      {
        id: "meme-1",
        num: 1,
        name: "Roll Safe (Smart Guy)",
        archetype: "roll-safe",
        icon: "🧠",
        colors: ["#38bdf8", "#0284c7"],
        mood: "Smart & Strategic",
        moodEmoji: "🧐",
        coreVerb: "Think",
        sentence: "Think before you speak in class.",
        type: "DO",
        badge: "Deep Thinker Badge",
        soundPhrase: "Think before you speak!",
        explanation: "Touch your temple! Positive imperative: Base verb 'Think' starts the rule."
      },
      {
        id: "meme-2",
        num: 2,
        name: "Surprised Pikachu",
        archetype: "pikachu",
        icon: "⚡",
        colors: ["#fbbf24", "#d97706"],
        mood: "Shocked & Alert",
        moodEmoji: "😲",
        coreVerb: "Listen",
        sentence: "Listen carefully to the instructions.",
        type: "DO",
        badge: "Super Ears Badge",
        soundPhrase: "Listen carefully to instructions!",
        explanation: "Keep your ears open! Positive imperative: 'Listen' directs immediate action."
      },
      {
        id: "meme-3",
        num: 3,
        name: "Much Doge",
        archetype: "doge",
        icon: "🐕",
        colors: ["#f59e0b", "#b45309"],
        mood: "Curious & Friendly",
        moodEmoji: "🐶",
        coreVerb: "Share",
        sentence: "Share your colored markers with friends.",
        type: "DO",
        badge: "Generous Pal Badge",
        soundPhrase: "Share your markers with friends!",
        explanation: "Such kindness! Positive imperative: 'Share' builds team harmony."
      },
      {
        id: "meme-4",
        num: 4,
        name: "Success Kid",
        archetype: "success-kid",
        icon: "✊",
        colors: ["#10b981", "#047857"],
        mood: "Victorious & Confident",
        moodEmoji: "💪",
        coreVerb: "Finish",
        sentence: "Finish your daily quest on time.",
        type: "DO",
        badge: "Mission Master Badge",
        soundPhrase: "Finish your quest on time!",
        explanation: "Yes! Positive imperative: 'Finish' leads to victory and XP."
      },
      {
        id: "meme-5",
        num: 5,
        name: "Grumpy Cat",
        archetype: "grumpy-cat",
        icon: "😾",
        colors: ["#f43f5e", "#be123c"],
        mood: "Grumpy & Noise-Sensitive",
        moodEmoji: "😠",
        coreVerb: "Shout",
        sentence: "Don't shout loudly across the classroom.",
        type: "DONT",
        badge: "Peacekeeper Badge",
        soundPhrase: "Don't shout loudly in class!",
        explanation: "No noise! Negative imperative: 'Don't' + base verb 'shout' protects quiet study."
      }
    ],

    // Phase 2: Green Light / Red Light Relay Workbench (Tactile Sorting)
    relayMemes: [
      {
        id: "meme-6",
        num: 6,
        name: "Galaxy Brain",
        icon: "🌌",
        colors: ["#a855f7", "#6366f1"],
        type: "DO",
        verb: "Raise",
        ruleText: "Raise your hand to ask a question.",
        hint: "Positive habit! What should you raise before speaking in class?",
        xp: 15
      },
      {
        id: "meme-7",
        num: 7,
        name: "Evil Kermit",
        icon: "🐸",
        colors: ["#059669", "#064e3b"],
        type: "DONT",
        verb: "Copy",
        ruleText: "Don't copy answers from your classmate.",
        hint: "Negative habit! Start with 'Don't' to keep testing honest.",
        xp: 15
      },
      {
        id: "meme-8",
        num: 8,
        name: "Distracted Explorer",
        icon: "👀",
        colors: ["#ec4899", "#9d174d"],
        type: "DONT",
        verb: "Look away",
        ruleText: "Don't look out the window during explanation.",
        hint: "Negative habit! Use 'Don't' to maintain laser focus.",
        xp: 15
      },
      {
        id: "meme-9",
        num: 9,
        name: "Trade Offer Guy",
        icon: "🤝",
        colors: ["#38bdf8", "#1d4ed8"],
        type: "DO",
        verb: "Clean",
        ruleText: "Clean up your station after art experiments.",
        hint: "Positive habit! Leave your laboratory spotless.",
        xp: 15
      },
      {
        id: "meme-10",
        num: 10,
        name: "Boromir Counsel",
        icon: "🛡️",
        colors: ["#f59e0b", "#78350f"],
        type: "DONT",
        verb: "Run",
        ruleText: "Don't run through the crowded science corridor.",
        hint: "Negative habit! One does not simply run indoors.",
        xp: 15
      },
      {
        id: "meme-11",
        num: 11,
        name: "This Is Fine Dog",
        icon: "☕",
        colors: ["#f97316", "#c2410c"],
        type: "DONT",
        verb: "Panic",
        ruleText: "Don't panic when an exercise seems tricky.",
        hint: "Negative habit! Stay calm, breathe, and ask for help.",
        xp: 15
      },
      {
        id: "meme-12",
        num: 12,
        name: "Yelling Lady vs Cat",
        icon: "🥗",
        colors: ["#e11d48", "#881337"],
        type: "DONT",
        verb: "Argue",
        ruleText: "Don't argue during team problem-solving.",
        hint: "Negative habit! Listen politely to everyone's ideas.",
        xp: 15
      },
      {
        id: "meme-13",
        num: 13,
        name: "Hotline Bling Approval",
        icon: "👉",
        colors: ["#10b981", "#065f46"],
        type: "DO",
        verb: "Line up",
        ruleText: "Line up quietly when walking to the lab.",
        hint: "Positive habit! Form a neat queue in single file.",
        xp: 15
      },
      {
        id: "meme-14",
        num: 14,
        name: "Gatsby Toast",
        icon: "🥂",
        colors: ["#fbbf24", "#92400e"],
        type: "DO",
        verb: "Whisper",
        ruleText: "Whisper softly when working in quiet zones.",
        hint: "Positive habit! Keep the volume low and classy.",
        xp: 15
      },
      {
        id: "meme-15",
        num: 15,
        name: "Disappointed Captain",
        icon: "🤦",
        colors: ["#64748b", "#334155"],
        type: "DONT",
        verb: "Forget",
        ruleText: "Don't forget your pencils and workbook.",
        hint: "Negative habit! Double-check your backpack every morning.",
        xp: 15
      },
      {
        id: "meme-16",
        num: 16,
        name: "Squinting Fry",
        icon: "🔍",
        colors: ["#f43f5e", "#9f1239"],
        type: "DO",
        verb: "Read",
        ruleText: "Read every question before choosing an answer.",
        hint: "Positive habit! Take your time to inspect the clues.",
        xp: 15
      },
      {
        id: "meme-17",
        num: 17,
        name: "Is This a Pigeon?",
        icon: "🦋",
        colors: ["#38bdf8", "#0369a1"],
        type: "DONT",
        verb: "Interrupt",
        ruleText: "Don't interrupt while the teacher is speaking.",
        hint: "Negative habit! Wait patiently for your turn.",
        xp: 15
      },
      {
        id: "meme-18",
        num: 18,
        name: "Buff Doge Hero",
        icon: "🦾",
        colors: ["#10b981", "#047857"],
        type: "DO",
        verb: "Push in",
        ruleText: "Push in your chair when standing up.",
        hint: "Positive habit! Strong cadets keep classroom walkways clear.",
        xp: 15
      },
      {
        id: "meme-19",
        num: 19,
        name: "Arthur's Fist",
        icon: "✊",
        colors: ["#ef4444", "#7f1d1d"],
        type: "DONT",
        verb: "Push",
        ruleText: "Don't push others in the line.",
        hint: "Negative habit! Keep your hands to yourself.",
        xp: 15
      },
      {
        id: "meme-20",
        num: 20,
        name: "Spider-Man Pointing",
        icon: "🕸️",
        colors: ["#0284c7", "#1e3a8a"],
        type: "DO",
        verb: "Help",
        ruleText: "Help your teammate when they need a clue.",
        hint: "Positive habit! We support each other in Adventure Academy.",
        xp: 15
      }
    ],

    // Phase 3: Meme Rule Teleprompter Studio (Oral Delivery)
    teleprompterMemes: [
      {
        id: "meme-21",
        num: 21,
        name: "Scientist Dog in Lab",
        icon: "🥽",
        colors: ["#06b6d4", "#0891b2"],
        rule: "Wear your safety goggles in the science lab!",
        type: "DO",
        sentence1: "This is our classroom meme: Scientist Dog in Lab.",
        sentence2: "Our golden rule is: Wear your safety goggles in the science lab!",
        sentence3: "Remember: Always protect your eyes during exciting experiments!",
        audioCues: ["Scientist Dog in Lab", "Wear your safety goggles", "Always protect your eyes"]
      },
      {
        id: "meme-22",
        num: 22,
        name: "Mocking SpongeBob",
        icon: "🧽",
        colors: ["#eab308", "#ca8a04"],
        rule: "Don't tease other students for making mistakes!",
        type: "DONT",
        sentence1: "This is our classroom meme: Mocking SpongeBob.",
        sentence2: "Our golden rule is: Don't tease other students for making mistakes!",
        sentence3: "Remember: Never laugh at mistakes because mistakes help our brains grow!",
        audioCues: ["Mocking SpongeBob", "Don't tease other students", "Never laugh at mistakes"]
      },
      {
        id: "meme-23",
        num: 23,
        name: "Baby Yoda Sipping Soup",
        icon: "🍵",
        colors: ["#10b981", "#059669"],
        rule: "Wait patiently until the teacher dismisses the class!",
        type: "DO",
        sentence1: "This is our classroom meme: Baby Yoda Sipping Soup.",
        sentence2: "Our golden rule is: Wait patiently until the teacher dismisses the class!",
        sentence3: "Remember: Always stay calm and orderly until the final bell rings!",
        audioCues: ["Baby Yoda", "Wait patiently", "Always stay calm"]
      },
      {
        id: "meme-24",
        num: 24,
        name: "Gigachad Champion",
        icon: "🗿",
        colors: ["#8b5cf6", "#6d28d9"],
        rule: "Respect everyone in our learning guild!",
        type: "DO",
        sentence1: "This is our classroom meme: Gigachad Champion.",
        sentence2: "Our golden rule is: Respect everyone in our learning guild!",
        sentence3: "Remember: Always show kindness, courage, and true team spirit!",
        audioCues: ["Gigachad Champion", "Respect everyone", "Always show kindness"]
      },
      {
        id: "meme-25",
        num: 25,
        name: "Sleepy Pikachu",
        icon: "💤",
        colors: ["#f59e0b", "#b45309"],
        rule: "Don't fall asleep during the group presentation!",
        type: "DONT",
        sentence1: "This is our classroom meme: Sleepy Pikachu.",
        sentence2: "Our golden rule is: Don't fall asleep during the group presentation!",
        sentence3: "Remember: Never close your eyes when your brave teammates are presenting!",
        audioCues: ["Sleepy Pikachu", "Don't fall asleep", "Never close your eyes"]
      }
    ]
  };

  // Attach SVG avatar dynamically to each meme item
  [...MEME_RULES_DATA.scannerMemes, ...MEME_RULES_DATA.relayMemes, ...MEME_RULES_DATA.teleprompterMemes].forEach(m => {
    m.svg = getMemeSvg(m.archetype || m.id, m.colors[0], m.colors[1], m.icon);
  });

  root.MEME_RULES_DATA = MEME_RULES_DATA;

})(typeof window !== 'undefined' ? window : global);
