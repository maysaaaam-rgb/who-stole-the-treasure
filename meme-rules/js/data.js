/**
 * MEME RULES ARENA: THE CLASSROOM IMPERATIVES CLASH
 * Authoritative 25 Meme Toolkit Matrix, Imperatives, Verbs & Scenario Bank
 * CEFR A1–A2 | Primary ESL / CLIL (Ages 8–12)
 */

(function(root) {
  'use strict';

  // Rich arcade badge renderer with feDropShadow filters, radial sunbursts & character styling
  function createMemeGraphic(archetype, color1, color2, emblem, label) {
    return `<svg viewBox="0 0 160 160" width="100%" height="100%" class="meme-hero-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${archetype}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
        <radialGradient id="sunburst-${archetype}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${color1}" stop-opacity="0.05"/>
        </radialGradient>
        <filter id="glow-${archetype}" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${color1}" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Base 3D Shield -->
      <rect x="6" y="6" width="148" height="148" rx="28" fill="#0f172a" stroke="#334155" stroke-width="3"/>
      <rect x="10" y="10" width="140" height="140" rx="24" fill="url(#grad-${archetype})" opacity="0.95"/>
      <!-- Starburst Action Rays -->
      <g opacity="0.25">
        <polygon points="80,80 48,10 112,10" fill="#ffffff"/>
        <polygon points="80,80 150,48 150,112" fill="#ffffff"/>
        <polygon points="80,80 112,150 48,150" fill="#ffffff"/>
        <polygon points="80,80 10,112 10,48" fill="#ffffff"/>
        <polygon points="80,80 14,14 42,10" fill="#ffffff"/>
        <polygon points="80,80 146,14 142,42" fill="#ffffff"/>
        <polygon points="80,80 146,146 118,150" fill="#ffffff"/>
        <polygon points="80,80 14,146 18,118" fill="#ffffff"/>
      </g>
      <!-- Glowing Inner Stage -->
      <circle cx="80" cy="76" r="48" fill="#0b1120" stroke="#ffffff" stroke-width="3" opacity="0.92" filter="url(#glow-${archetype})"/>
      <circle cx="80" cy="76" r="45" fill="url(#sunburst-${archetype})"/>
      <!-- Emblem Centerpiece -->
      <g transform="translate(80, 76)">
        <text x="0" y="6" font-size="52" text-anchor="middle" dominant-baseline="central" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.6))">${emblem}</text>
      </g>
      <!-- Arcade Rarity Badge -->
      <rect x="46" y="132" width="68" height="16" rx="8" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" opacity="0.95"/>
      <text x="80" y="141" font-size="9" font-weight="900" fill="#fbbf24" text-anchor="middle" dominant-baseline="central" letter-spacing="1">${label || 'MEME RULE'}</text>
    </svg>`;
  }

  const MEME_RULES_DATA = {
    meta: {
      id: "meme-rules",
      title: "🎭 Meme Rules Arena: The Classroom Imperatives Clash",
      subtitle: "Master Positive & Negative Imperatives with 25 Classic Memes",
      category: "Language & Quests",
      grade: "Grade 3–6",
      cefrLevel: "A1–A2",
      totalMemes: 25,
      totalXP: 200,
      grammarFormulas: {
        positive: "Base Verb + Object / Adverb!",
        negative: "Don't + Base Verb + Object / Adverb!"
      },
      lexicon: [
        "think", "raise", "listen", "whisper", "share", "wait", 
        "run", "shout", "line up", "clean", "push in", "open", "write"
      ]
    },

    // Authoritative 25 Meme Toolkit Matrix
    memes: [
      {
        id: "meme-1",
        num: 1,
        name: "Roll Safe (Smart Guy)",
        archetype: "roll-safe",
        emblem: "🧠",
        type: "DO",
        coreVerb: "Think",
        ruleText: "Think before you speak!",
        scenario: "You are about to shout out an answer before the teacher finishes.",
        colors: ["#38bdf8", "#0284c7"],
        mood: "Smart & Strategic",
        badge: "Deep Thinker Badge",
        soundPhrase: "Think before you speak in class!",
        explanation: "Touch your temple! Base verb 'Think' starts the positive imperative rule."
      },
      {
        id: "meme-2",
        num: 2,
        name: "Surprised Pikachu",
        archetype: "pikachu",
        emblem: "⚡",
        type: "DON'T",
        coreVerb: "Forget",
        ruleText: "Don't forget your homework!",
        scenario: "The teacher asks for homework and your backpack is empty!",
        colors: ["#fbbf24", "#d97706"],
        mood: "Shocked & Alert",
        badge: "Homework Shield",
        soundPhrase: "Don't forget your homework!",
        explanation: "Shocked expression! Negative imperative uses 'Don't' + base verb 'forget'."
      },
      {
        id: "meme-3",
        num: 3,
        name: "Success Kid",
        archetype: "success-kid",
        emblem: "✊",
        type: "DO",
        coreVerb: "Raise",
        ruleText: "Raise your hand before answering!",
        scenario: "You know the correct answer to the teacher's challenge.",
        colors: ["#10b981", "#047857"],
        mood: "Determined & Victorious",
        badge: "Champion Hand Badge",
        soundPhrase: "Raise your hand before speaking!",
        explanation: "Clenched fist of triumph! Use positive command: 'Raise your hand!'"
      },
      {
        id: "meme-4",
        num: 4,
        name: "Disaster Girl",
        archetype: "disaster-girl",
        emblem: "🔥",
        type: "DON'T",
        coreVerb: "Run",
        ruleText: "Don't run in the hallways!",
        scenario: "The lunch bell rings and kids sprint toward the cafeteria.",
        colors: ["#ef4444", "#991b1b"],
        mood: "Mischievous Warning",
        badge: "Hallway Safety Badge",
        soundPhrase: "Don't run in the hallways! Walk safely.",
        explanation: "Smirking near the flames! Negative imperative: 'Don't run in the halls!'"
      },
      {
        id: "meme-5",
        num: 5,
        name: "Drake Reject / Approve",
        archetype: "drake",
        emblem: "🤫",
        type: "DO",
        coreVerb: "Whisper",
        ruleText: "Whisper when working in pairs!",
        scenario: "Partner activity time in English class.",
        colors: ["#8b5cf6", "#6d28d9"],
        mood: "Tactical & Chill",
        badge: "Volume Master Badge",
        soundPhrase: "Whisper when working in pairs!",
        explanation: "Disapprove shouting, approve whispering! 'Whisper quietly!'"
      },
      {
        id: "meme-6",
        num: 6,
        name: "Grogu / Baby Yoda",
        archetype: "grogu",
        emblem: "🍵",
        type: "DO",
        coreVerb: "Wait",
        ruleText: "Sit down and wait patiently!",
        scenario: "Waiting for art supplies to be handed out.",
        colors: ["#10b981", "#065f46"],
        mood: "Peaceful & Patient",
        badge: "Patience Medal",
        soundPhrase: "Sit down and wait patiently!",
        explanation: "Sipping soup calmly! Positive command: 'Sit down and wait!'"
      },
      {
        id: "meme-7",
        num: 7,
        name: "Spider-Man Pointing",
        archetype: "spiderman",
        emblem: "👉",
        type: "DON'T",
        coreVerb: "Blame",
        ruleText: "Don't blame your group partner!",
        scenario: "Your team project tower falls down.",
        colors: ["#ef4444", "#1d4ed8"],
        mood: "Team Accountability",
        badge: "Unity Shield",
        soundPhrase: "Don't blame your group partner! Work together.",
        explanation: "Pointing fingers at each other! Negative imperative: 'Don't blame!'"
      },
      {
        id: "meme-8",
        num: 8,
        name: "Trade Offer",
        archetype: "trade-offer",
        emblem: "🤝",
        type: "DO",
        coreVerb: "Share",
        ruleText: "Share your colored pencils and glue!",
        scenario: "Your classmate forgot their red pencil for drawing.",
        colors: ["#f59e0b", "#d97706"],
        mood: "Generous & Friendly",
        badge: "Master Sharer Badge",
        soundPhrase: "Share your colored pencils with friends!",
        explanation: "Holding out a fair trade! Positive imperative: 'Share your pencils!'"
      },
      {
        id: "meme-9",
        num: 9,
        name: "Distracted Boyfriend",
        archetype: "distracted",
        emblem: "👀",
        type: "DON'T",
        coreVerb: "Look",
        ruleText: "Don't look at other screens!",
        scenario: "During computer lab research time.",
        colors: ["#f43f5e", "#be123c"],
        mood: "Distraction Alert",
        badge: "Laser Focus Badge",
        soundPhrase: "Don't look at other screens! Focus on your task.",
        explanation: "Looking away from your work! Negative imperative: 'Don't look!'"
      },
      {
        id: "meme-10",
        num: 10,
        name: "Grumpy Cat",
        archetype: "grumpy-cat",
        emblem: "😾",
        type: "DON'T",
        coreVerb: "Complain",
        ruleText: "Don't complain about group work!",
        scenario: "The teacher announces team reading projects.",
        colors: ["#64748b", "#334155"],
        mood: "Positive Attitude",
        badge: "Good Vibes Badge",
        soundPhrase: "Don't complain about group work! Give it your best.",
        explanation: "Frowning face! Negative imperative: 'Don't complain!'"
      },
      {
        id: "meme-11",
        num: 11,
        name: "Doge / Shibe",
        archetype: "doge",
        emblem: "🐕",
        type: "DO",
        coreVerb: "Listen",
        ruleText: "Listen carefully to instructions!",
        scenario: "The teacher explains the three rules for the game.",
        colors: ["#f59e0b", "#b45309"],
        mood: "Much Attention",
        badge: "Golden Ear Badge",
        soundPhrase: "Listen carefully to teacher instructions!",
        explanation: "Such focus! Very listen! Positive imperative: 'Listen carefully!'"
      },
      {
        id: "meme-12",
        num: 12,
        name: "This Is Fine Dog",
        archetype: "this-is-fine",
        emblem: "☕",
        type: "DON'T",
        coreVerb: "Panic",
        ruleText: "Don't panic when tests start!",
        scenario: "The pop quiz paper is placed on your desk.",
        colors: ["#f97316", "#c2410c"],
        mood: "Calm Under Fire",
        badge: "Zen Master Badge",
        soundPhrase: "Don't panic! Take a deep breath.",
        explanation: "Coffee cup in flames! Negative command: 'Don't panic!'"
      },
      {
        id: "meme-13",
        num: 13,
        name: "One Does Not Simply",
        archetype: "boromir",
        emblem: "💍",
        type: "DON'T",
        coreVerb: "Shout",
        ruleText: "Don't shout across the room!",
        scenario: "You want to say hello to a friend on the opposite side.",
        colors: ["#78716c", "#44403c"],
        mood: "Epic Rule",
        badge: "Quiet Council Badge",
        soundPhrase: "Don't shout across the room! Walk and whisper.",
        explanation: "Epic hand gesture! Negative command: 'Don't shout!'"
      },
      {
        id: "meme-14",
        num: 14,
        name: "Woman Yelling at Cat",
        archetype: "yelling-cat",
        emblem: "🥗",
        type: "DON'T",
        coreVerb: "Argue",
        ruleText: "Don't argue during team games!",
        scenario: "A dispute arises over who scored the point in spelling bee.",
        colors: ["#ec4899", "#be185d"],
        mood: "Peacekeeper",
        badge: "Fair Play Badge",
        soundPhrase: "Don't argue during team games! Play fairly.",
        explanation: "Confused cat at the salad table! Negative command: 'Don't argue!'"
      },
      {
        id: "meme-15",
        num: 15,
        name: "Expanding Brain",
        archetype: "expanding-brain",
        emblem: "🌌",
        type: "DO",
        coreVerb: "Push in",
        ruleText: "Push in your chair when leaving!",
        scenario: "The bell rings and everyone gets up from their desks.",
        colors: ["#a855f7", "#7e22ce"],
        mood: "Cosmic Courtesy",
        badge: "Galaxy Clean Badge",
        soundPhrase: "Push in your chair when leaving your desk!",
        explanation: "Glowing cosmic brain! Positive imperative: 'Push in your chair!'"
      },
      {
        id: "meme-16",
        num: 16,
        name: "Buff Doge vs Cheems",
        archetype: "buff-doge",
        emblem: "💪",
        type: "DO",
        coreVerb: "Stand",
        ruleText: "Stand up straight in line!",
        scenario: "Waiting in the hallway for the library doors to open.",
        colors: ["#eab308", "#a16207"],
        mood: "Strong Posture",
        badge: "Line Leader Badge",
        soundPhrase: "Stand up straight in line!",
        explanation: "Mighty Doge muscles! Positive imperative: 'Stand up straight!'"
      },
      {
        id: "meme-17",
        num: 17,
        name: "Bernie in Mittens",
        archetype: "bernie-mittens",
        emblem: "🧤",
        type: "DO",
        coreVerb: "Sit",
        ruleText: "Sit quietly and keep warm!",
        scenario: "Morning carpet reading session before announcements.",
        colors: ["#0284c7", "#0369a1"],
        mood: "Cozy & Patient",
        badge: "Cozy Reader Badge",
        soundPhrase: "Sit quietly and listen to the story!",
        explanation: "Folded arms with warm mittens! Positive command: 'Sit quietly!'"
      },
      {
        id: "meme-18",
        num: 18,
        name: "Galaxy Brain",
        archetype: "galaxy-brain",
        emblem: "✨",
        type: "DO",
        coreVerb: "Clean",
        ruleText: "Clean up your art desk!",
        scenario: "Paint brushes, scissors, and scrap paper left scattered.",
        colors: ["#06b6d4", "#0891b2"],
        mood: "Neat & Organized",
        badge: "Eco Hero Badge",
        soundPhrase: "Clean up your art supplies and recycle paper!",
        explanation: "Infinite intellect! Positive imperative: 'Clean up your desk!'"
      },
      {
        id: "meme-19",
        num: 19,
        name: "Mocking SpongeBob",
        archetype: "spongebob",
        emblem: "🐔",
        type: "DON'T",
        coreVerb: "Interrupt",
        ruleText: "Don't interrupt while others speak!",
        scenario: "A classmate is presenting their science poster.",
        colors: ["#facc15", "#ca8a04"],
        mood: "Respectful Listener",
        badge: "Respect Shield",
        soundPhrase: "Don't interrupt while others are speaking!",
        explanation: "Mocking stance! Negative imperative: 'Don't interrupt!'"
      },
      {
        id: "meme-20",
        num: 20,
        name: "Is This A Pigeon",
        archetype: "pigeon-butterfly",
        emblem: "🦋",
        type: "DO",
        coreVerb: "Open",
        ruleText: "Open your books to page ten!",
        scenario: "The reading lesson starts and everyone looks around.",
        colors: ["#38bdf8", "#0284c7"],
        mood: "Curious Scholar",
        badge: "Bookworm Badge",
        soundPhrase: "Open your books to page ten!",
        explanation: "Reaching out to the butterfly! Positive imperative: 'Open your books!'"
      },
      {
        id: "meme-21",
        num: 21,
        name: "Gru's Plan",
        archetype: "grus-plan",
        emblem: "📋",
        type: "DO",
        coreVerb: "Write",
        ruleText: "Write down your homework task!",
        scenario: "The teacher writes three exercises on the board.",
        colors: ["#475569", "#1e293b"],
        mood: "Careful Planner",
        badge: "Planner Star",
        soundPhrase: "Write down your homework in your agenda!",
        explanation: "Pointing at the presentation board! Positive: 'Write down homework!'"
      },
      {
        id: "meme-22",
        num: 22,
        name: "Change My Mind",
        archetype: "change-my-mind",
        emblem: "☕",
        type: "DO",
        coreVerb: "Ask",
        ruleText: "Ask questions when you don't know!",
        scenario: "You do not understand the math fraction problem.",
        colors: ["#3b82f6", "#1d4ed8"],
        mood: "Inquisitive Mind",
        badge: "Curiosity Crown",
        soundPhrase: "Ask questions when you don't understand!",
        explanation: "Sitting with coffee banner! Positive command: 'Ask questions!'"
      },
      {
        id: "meme-23",
        num: 23,
        name: "Two Buttons",
        archetype: "two-buttons",
        emblem: "🔘",
        type: "DO",
        coreVerb: "Choose",
        ruleText: "Choose kindness and help others!",
        scenario: "A classmate drops their colored markers on the floor.",
        colors: ["#ef4444", "#3b82f6"],
        mood: "Compassionate Choice",
        badge: "Kindness Heart",
        soundPhrase: "Choose kindness and help your classmates!",
        explanation: "Sweating superhero choosing a button! Positive: 'Choose kindness!'"
      },
      {
        id: "meme-24",
        num: 24,
        name: "Leo DiCaprio Toast",
        archetype: "leo-toast",
        emblem: "🥂",
        type: "DO",
        coreVerb: "Celebrate",
        ruleText: "Celebrate your partner's success!",
        scenario: "Your table partner gets 100% on their vocabulary quiz.",
        colors: ["#eab308", "#ca8a04"],
        mood: "Generous Cheer",
        badge: "Team Cheers Badge",
        soundPhrase: "Celebrate your partner's good work!",
        explanation: "Raising a glass in respect! Positive: 'Celebrate success!'"
      },
      {
        id: "meme-25",
        num: 25,
        name: "Arthur's Fist",
        archetype: "arthurs-fist",
        emblem: "👊",
        type: "DON'T",
        coreVerb: "Fight",
        ruleText: "Don't fight when you feel upset!",
        scenario: "Someone accidentally bumps into your desk.",
        colors: ["#eab308", "#ef4444"],
        mood: "Self-Control Master",
        badge: "Peace Hero Badge",
        soundPhrase: "Don't fight! Take three deep breaths and talk calmly.",
        explanation: "Clenched yellow sweater fist! Negative command: 'Don't fight!'"
      }
    ]
  };

  // Attach artwork generator & pedagogical sentences to each meme
  MEME_RULES_DATA.memes.forEach(m => {
    m.graphic = createMemeGraphic(m.archetype, m.colors[0], m.colors[1], m.emblem, m.type === 'DO' ? 'DO [✓]' : "DON'T [✕]");
    m.svg = m.graphic;
    m.verb = m.coreVerb;
    m.hint = m.type === 'DO'
      ? `Start positive commands with a Base Verb! Say: "${m.coreVerb}..."`
      : `Start negative commands with "Don't"! Say: "${m.ruleText}"`;
    m.sentence1 = "Welcome to Adventure Academy! This is our classroom rule.";
    m.sentence2 = `When you are in class, ${m.ruleText.replace(/!$/, '')}!`;
    m.sentence3 = "Follow the rules and earn XP!";
    m.xp = 20;
  });

  // Featured subsets for stages
  MEME_RULES_DATA.scannerMemes = MEME_RULES_DATA.memes.slice(0, 8);
  MEME_RULES_DATA.relayMemes = [...MEME_RULES_DATA.memes];
  MEME_RULES_DATA.teleprompterMemes = MEME_RULES_DATA.memes.slice(0, 6);

  root.MEME_RULES_DATA = MEME_RULES_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MEME_RULES_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
