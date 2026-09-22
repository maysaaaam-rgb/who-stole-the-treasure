/**
 * Adventure Academy - Meme Rules Curriculum & Dataset
 * CEFR A1-A2 | Ages 8-12
 * Focus: Positive Imperatives (Base Verb + Object) & Negative Imperatives (Don't + Base Verb)
 */

const LESSON_METADATA = {
  id: "meme-rules",
  title: "🎭 Classroom Meme Rules: Imperatives in Action",
  category: "Grammar & Communication",
  categoryGroup: "Grammar & Communication",
  level: "A1 / A2",
  cefrLevel: "A1–A2",
  ageGroup: "8–12",
  durationText: "40 min",
  xp: 150,
  learningObjectives: [
    "Construct positive imperatives using Base Verb + Object.",
    "Construct negative imperatives using Don't + Base Verb.",
    "Deliver structured classroom behavioral commands orally using a 3-part teleprompter."
  ],
  vocabulary: {
    core: ["raise", "speak", "listen", "whisper", "share", "wait"],
    supporting: ["hallway", "supplies", "patiently", "carefully"]
  },
  grammar: {
    focusPattern: "Base Verb + Object / Don't + Base Verb",
    formulas: [
      "Raise your hand before answering!",
      "Don't shout across the room!",
      "Whisper when working in pairs!"
    ]
  },
  topics: ["Classroom Rules", "Imperatives", "Social Communication"],
  route: "meme-rules/index.html",
  worksheetRoute: "meme-rules/worksheet.html",
  thumbnailIcon: "🎭",
  gradient: "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #10b981 100%)"
};

/**
 * Clean helper to generate fallback SVG meme avatars if memegen.link is offline or slow
 */
function getMemeFallbackSvg(name, type, verb) {
  const isDo = type === "DO";
  const bgGradStart = isDo ? "#064e3b" : "#7f1d1d";
  const bgGradEnd = isDo ? "#10b981" : "#ef4444";
  const badgeText = isDo ? "DO" : "DON'T";
  const badgeColor = isDo ? "#34d399" : "#f87171";
  const emoji = isDo ? "🌟" : "🛑";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgGradStart}"/>
        <stop offset="100%" stop-color="${bgGradEnd}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <circle cx="200" cy="120" r="60" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <text x="200" y="140" font-size="52" text-anchor="middle">${emoji}</text>
    <rect x="50" y="210" width="300" height="46" rx="23" fill="rgba(0,0,0,0.5)"/>
    <text x="200" y="240" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ${name.toUpperCase()}
    </text>
    <rect x="20" y="20" width="90" height="32" rx="16" fill="${badgeColor}"/>
    <text x="65" y="42" font-family="'Outfit', sans-serif" font-weight="900" font-size="15" fill="#0f172a" text-anchor="middle">
      ${badgeText}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 25-Meme Master Dataset
 */
const MEME_TOOLKIT = [
  {
    id: 1,
    name: "Roll Safe",
    type: "DO",
    imperative: "Think before you speak!",
    verb: "Think / Speak",
    img: "https://api.memegen.link/images/rollsafe.png",
    hint: "Positive imperative! Starts directly with the action verb 'Think'.",
    speechVoiceText: "Think before you speak."
  },
  {
    id: 2,
    name: "Surprised Pikachu",
    type: "DONT",
    imperative: "Don't forget your homework!",
    verb: "Forget",
    img: "https://api.memegen.link/images/pika.png",
    hint: "Negative imperative! Notice 'Don't' before 'forget'.",
    speechVoiceText: "Don't forget your homework."
  },
  {
    id: 3,
    name: "Grumpy Cat",
    type: "DONT",
    imperative: "Don't complain about reading tasks!",
    verb: "Complain",
    img: "https://api.memegen.link/images/grumpycat.png",
    hint: "Negative imperative! 'Don't' + base verb 'complain'.",
    speechVoiceText: "Don't complain about reading tasks."
  },
  {
    id: 4,
    name: "Gatsby Cheers",
    type: "DO",
    imperative: "Always do your best work!",
    verb: "Do",
    img: "https://api.memegen.link/images/gatsby.png",
    hint: "Positive imperative! We encourage great effort: 'Do your best!'.",
    speechVoiceText: "Always do your best work."
  },
  {
    id: 5,
    name: "Doge",
    type: "DO",
    imperative: "Be quiet and listen carefully!",
    verb: "Be / Listen",
    img: "https://api.memegen.link/images/doge.png",
    hint: "Positive imperative! Action command: 'Be quiet and listen!'.",
    speechVoiceText: "Be quiet and listen carefully."
  },
  {
    id: 6,
    name: "Success Kid",
    type: "DO",
    imperative: "Raise your hand before answering!",
    verb: "Raise",
    img: "https://api.memegen.link/images/sk.png",
    hint: "Positive imperative! Starts with the action verb 'Raise'.",
    speechVoiceText: "Raise your hand before answering."
  },
  {
    id: 7,
    name: "Smudge the Cat",
    type: "DO",
    imperative: "Stay in your seat during lessons!",
    verb: "Stay",
    img: "https://api.memegen.link/images/smudge.png",
    hint: "Positive imperative! Action verb: 'Stay'.",
    speechVoiceText: "Stay in your seat during lessons."
  },
  {
    id: 8,
    name: "Grogu",
    type: "DO",
    imperative: "Sit down and wait patiently!",
    verb: "Sit / Wait",
    img: "https://api.memegen.link/images/grogu.png",
    hint: "Positive imperative! Begins with base verbs 'Sit' and 'wait'.",
    speechVoiceText: "Sit down and wait patiently."
  },
  {
    id: 9,
    name: "Evil Kermit",
    type: "DONT",
    imperative: "Don't copy your classmate's paper!",
    verb: "Copy",
    img: "https://api.memegen.link/images/ermg.png",
    hint: "Negative imperative! 'Don't' + base verb 'copy'.",
    speechVoiceText: "Don't copy your classmate's paper."
  },
  {
    id: 10,
    name: "Distracted Boyfriend",
    type: "DO",
    imperative: "Keep your eyes on your own test!",
    verb: "Keep",
    img: "https://api.memegen.link/images/db.png",
    hint: "Positive imperative! Action command: 'Keep your eyes on your test!'.",
    speechVoiceText: "Keep your eyes on your own test."
  },
  {
    id: 11,
    name: "Drake (Reject)",
    type: "DONT",
    imperative: "Don't shout across the room!",
    verb: "Shout",
    img: "https://api.memegen.link/images/drake/_/Don't_shout_across_the_room.png",
    fallbackImg: "https://api.memegen.link/images/drake.png",
    hint: "Negative imperative! Begins with 'Don't' + 'shout'.",
    speechVoiceText: "Don't shout across the room."
  },
  {
    id: 12,
    name: "Drake (Approve)",
    type: "DO",
    imperative: "Whisper when working in pairs!",
    verb: "Whisper",
    img: "https://api.memegen.link/images/drake/Whisper_when_working_in_pairs/_.png",
    fallbackImg: "https://api.memegen.link/images/drake.png",
    hint: "Positive imperative! Starts with the soft action verb 'Whisper'.",
    speechVoiceText: "Whisper when working in pairs."
  },
  {
    id: 13,
    name: "Woman Yelling at Cat",
    type: "DONT",
    imperative: "Don't yell at your group members!",
    verb: "Yell",
    img: "https://api.memegen.link/images/wyac.png",
    hint: "Negative imperative! Starts with 'Don't' + 'yell'.",
    speechVoiceText: "Don't yell at your group members."
  },
  {
    id: 14,
    name: "Boromir",
    type: "DONT",
    imperative: "Don't pack up before the bell rings!",
    verb: "Pack up",
    img: "https://api.memegen.link/images/mordor.png",
    hint: "Negative imperative! 'Don't' + 'pack up'.",
    speechVoiceText: "Don't pack up before the bell rings."
  },
  {
    id: 15,
    name: "Disaster Girl",
    type: "DONT",
    imperative: "Don't run in the hallways!",
    verb: "Run",
    img: "https://api.memegen.link/images/disastergirl.png",
    hint: "Negative imperative! Safety rule: 'Don't' + 'run'.",
    speechVoiceText: "Don't run in the hallways."
  },
  {
    id: 16,
    name: "Kermit Drinking Tea",
    type: "DO",
    imperative: "Mind your own work!",
    verb: "Mind",
    img: "https://api.memegen.link/images/kermit.png",
    hint: "Positive imperative! Action command: 'Mind your own work'.",
    speechVoiceText: "Mind your own work."
  },
  {
    id: 17,
    name: "Spider-Man Pointing",
    type: "DONT",
    imperative: "Don't blame your group partner!",
    verb: "Blame",
    img: "https://api.memegen.link/images/spiderman.png",
    hint: "Negative imperative! 'Don't' + 'blame'.",
    speechVoiceText: "Don't blame your group partner."
  },
  {
    id: 18,
    name: "Bernie in Mittens",
    type: "DO",
    imperative: "Bring all your supplies to class!",
    verb: "Bring",
    img: "https://api.memegen.link/images/bernie.png",
    hint: "Positive imperative! Starts directly with 'Bring'.",
    speechVoiceText: "Bring all your supplies to class."
  },
  {
    id: 19,
    name: "Side-Eye Chloe",
    type: "DONT",
    imperative: "Don't interrupt while others read!",
    verb: "Interrupt",
    img: "https://api.memegen.link/images/chloe.png",
    hint: "Negative imperative! Notice 'Don't' + 'interrupt'.",
    speechVoiceText: "Don't interrupt while others read."
  },
  {
    id: 20,
    name: "Buff Doge",
    type: "DO",
    imperative: "Speak loud and clear in presentations!",
    verb: "Speak",
    img: "https://api.memegen.link/images/doge.png",
    hint: "Positive imperative! Confident command: 'Speak loud and clear!'.",
    speechVoiceText: "Speak loud and clear in presentations."
  },
  {
    id: 21,
    name: "Cheems Doge",
    type: "DONT",
    imperative: "Don't give up when it's hard!",
    verb: "Give up",
    img: "https://api.memegen.link/images/cheems.png",
    hint: "Negative imperative! Resilience rule: 'Don't' + 'give up'.",
    speechVoiceText: "Don't give up when it's hard."
  },
  {
    id: 22,
    name: "Is This a Pigeon?",
    type: "DO",
    imperative: "Check your spelling before submitting!",
    verb: "Check",
    img: "https://api.memegen.link/images/pigeon.png",
    hint: "Positive imperative! Action command: 'Check your spelling'.",
    speechVoiceText: "Check your spelling before submitting."
  },
  {
    id: 23,
    name: "Confused Math Lady",
    type: "DO",
    imperative: "Ask questions when you don't understand!",
    verb: "Ask",
    img: "https://api.memegen.link/images/math.png",
    hint: "Positive imperative! Curiosity command: 'Ask questions'.",
    speechVoiceText: "Ask questions when you don't understand."
  },
  {
    id: 24,
    name: "Hide the Pain Harold",
    type: "DONT",
    imperative: "Don't pretend you finished early!",
    verb: "Pretend",
    img: "https://api.memegen.link/images/harold.png",
    hint: "Negative imperative! 'Don't' + 'pretend'.",
    speechVoiceText: "Don't pretend you finished early."
  },
  {
    id: 25,
    name: "Trade Offer",
    type: "DO",
    imperative: "Share your colored pencils and glue!",
    verb: "Share",
    img: "https://api.memegen.link/images/tradeoffer.png",
    hint: "Positive imperative! Sharing is caring: 'Share your supplies'.",
    speechVoiceText: "Share your colored pencils and glue."
  }
];

// Attach fallback SVGs automatically
MEME_TOOLKIT.forEach(meme => {
  meme.fallbackSvg = getMemeFallbackSvg(meme.name, meme.type, meme.verb);
});

/**
 * Universal Route Resolver Helper
 */
function resolveAcademyRoute(pathname, basePrefix = '') {
  if (pathname.includes('meme') || pathname.includes('imperative') || pathname.includes('rules')) {
    return {
      targetUrl: basePrefix + 'meme-rules/index.html',
      targetName: 'Classroom Meme Rules: Imperatives in Action'
    };
  }
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LESSON_METADATA, MEME_TOOLKIT, resolveAcademyRoute, getMemeFallbackSvg };
}
