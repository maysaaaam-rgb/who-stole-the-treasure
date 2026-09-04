/**
 * ENGLISH ADVENTURE ACADEMY — CENTRAL GAME REGISTRY
 * Single Source of Truth for all 15 playable classroom games.
 */

const GAMES_REGISTRY = [
  {
    id: "firefighter",
    title: "Fire Station Adventure",
    description: "Interactive story about firefighters, emergency equipment, siren audio, and a tap-to-extinguish water hose simulation.",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    age: "Ages 7–9",
    ageGroup: "7-8",
    grade: "Grades 2–4",
    duration: 35,
    durationText: "35 min",
    skills: ["Speaking", "Listening", "Vocabulary"],
    topic: "Community Helpers & Emergencies",
    route: "firefighter/index.html",
    worksheet: "firefighter/worksheet.html",
    featured: true,
    progress: "70% complete",
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fee2e2"/>
        <rect x="25" y="30" width="150" height="110" rx="4" fill="#fca5a5"/>
        <rect x="50" y="65" width="100" height="75" rx="3" fill="#ef4444"/>
        <line x1="50" y1="85" x2="150" y2="85" stroke="#dc2626" stroke-width="2"/>
        <line x1="50" y1="105" x2="150" y2="105" stroke="#dc2626" stroke-width="2"/>
        <line x1="50" y1="125" x2="150" y2="125" stroke="#dc2626" stroke-width="2"/>
        <rect x="68" y="85" width="64" height="42" rx="4" fill="#b91c1c"/>
        <rect x="74" y="90" width="52" height="16" rx="2" fill="#bae6fd"/>
        <circle x="80" y="122" r="6" fill="#1e293b"/>
        <circle x="120" y="122" r="6" fill="#1e293b"/>
        <rect x="94" y="80" width="12" height="5" rx="1" fill="#38bdf8"/>
      </svg>`
  },
  {
    id: "story",
    title: "The Wizard of Oz",
    description: "11-scene dramatized reader's theater stage following Dorothy, Scarecrow, Tin Woodman, and Lion down the Yellow Brick Road.",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    age: "Ages 7–9",
    ageGroup: "7-8",
    grade: "Grades 3–5",
    duration: 40,
    durationText: "40 min",
    skills: ["Reading", "Speaking", "Listening"],
    topic: "Classic Storytelling & Emotions",
    route: "story/index.html",
    worksheet: null,
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ede9fe"/>
        <path d="M 0 140 Q 80 100 100 70 Q 120 40 140 15 L 160 15 Q 140 50 120 80 Q 90 120 0 140 Z" fill="#fde047"/>
        <rect x="130" y="25" width="16" height="45" rx="2" fill="#10b981"/>
        <polygon points="138,12 130,25 146,25" fill="#059669"/>
        <rect x="150" y="35" width="18" height="35" rx="2" fill="#059669"/>
        <polygon points="159,22 150,35 168,35" fill="#047857"/>
      </svg>`
  },
  {
    id: "neighbourhood",
    title: "My Neighbourhood",
    description: "Living town exploration where students identify community locations, practice prepositions, and give walking tour directions.",
    category: "Speaking Games",
    categoryLabel: "🗣️ Speaking Games",
    level: "A1",
    age: "Ages 6–9",
    ageGroup: "7-8",
    grade: "Grades 1–3",
    duration: 30,
    durationText: "30 min",
    skills: ["Speaking", "Vocabulary", "Grammar"],
    topic: "Town Places & Prepositions",
    route: "neighbourhood/index.html",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ccfbf1"/>
        <rect x="0" y="60" width="200" height="24" fill="#94a3b8"/>
        <rect x="88" y="0" width="24" height="140" fill="#94a3b8"/>
        <rect x="25" y="18" width="40" height="32" rx="3" fill="#38bdf8"/>
        <polygon points="45,6 20,18 70,18" fill="#0284c7"/>
        <rect x="135" y="18" width="42" height="32" rx="3" fill="#f59e0b"/>
        <polygon points="156,6 130,18 182,18" fill="#d97706"/>
        <circle cx="45" cy="112" r="16" fill="#10b981"/>
        <rect x="42" y="118" width="6" height="16" fill="#78350f"/>
      </svg>`
  },
  {
    id: "restaurant",
    title: "At the Restaurant",
    description: "Interactive dining role-play practicing 'I'd like...', menu ordering, secret challenge cards, and bill calculation.",
    category: "Role Plays",
    categoryLabel: "🎭 Role Plays",
    level: "A1+",
    age: "Ages 7–11",
    ageGroup: "7-8",
    grade: "Grades 2–5",
    duration: 40,
    durationText: "40 min",
    skills: ["Speaking", "Vocabulary"],
    topic: "Food & Polite Requests",
    route: "restaurant/index.html",
    worksheet: "restaurant/worksheets.html",
    featured: true,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ffedd5"/>
        <ellipse cx="100" cy="105" rx="60" ry="22" fill="#fed7aa"/>
        <rect x="94" y="105" width="12" height="28" fill="#c2410c"/>
        <ellipse cx="100" cy="90" rx="26" ry="9" fill="#e2e8f0"/>
        <path d="M 80 90 A 20 20 0 0 1 120 90 Z" fill="#94a3b8"/>
        <circle cx="100" cy="70" r="3" fill="#64748b"/>
        <rect x="45" y="50" width="24" height="34" rx="2" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "advice",
    title: "The Crazy Advice Academy",
    description: "Practice modal verbs 'should' and 'shouldn't' by solving 10 hilarious everyday dilemmas with Professor Should.",
    category: "Grammar Games",
    categoryLabel: "📚 Grammar Games",
    level: "A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    duration: 35,
    durationText: "35 min",
    skills: ["Grammar", "Speaking"],
    topic: "Modal Verbs: Should & Shouldn't",
    route: "advice/index.html",
    worksheet: "advice/worksheets.html",
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#e0f2fe"/>
        <circle cx="100" cy="60" r="26" fill="#facc15"/>
        <rect x="92" y="84" width="16" height="8" rx="1" fill="#94a3b8"/>
        <line x1="100" y1="24" x2="100" y2="14" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <line x1="128" y1="36" x2="136" y2="30" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <line x1="72" y1="36" x2="64" y2="30" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
        <rect x="40" y="70" width="32" height="42" rx="3" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
        <polyline points="48,86 52,90 58,82" fill="none" stroke="#10b981" stroke-width="2"/>
      </svg>`
  },
  {
    id: "predictions",
    title: "What Will Happen Next?",
    description: "Dramatic frozen cliffhangers where students predict future outcomes with WILL and WON'T before comic reveals.",
    category: "Grammar Games",
    categoryLabel: "📚 Grammar Games",
    level: "A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    duration: 30,
    durationText: "30 min",
    skills: ["Grammar", "Speaking"],
    topic: "Future Predictions with WILL",
    route: "predictions/index.html",
    worksheet: "predictions/worksheets.html",
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#f3e8ff"/>
        <circle cx="100" cy="65" r="32" fill="#c084fc"/>
        <circle cx="92" cy="56" r="10" fill="#ffffff" opacity="0.4"/>
        <path d="M 78 106 L 122 106 L 112 94 L 88 94 Z" fill="#6b21a8"/>
        <rect x="74" y="106" width="52" height="7" rx="2" fill="#581c87"/>
      </svg>`
  },
  {
    id: "monster-day",
    title: "Build Your Own Monster",
    description: "Real-time SVG creator workshop practicing body parts, numbers, colors, and descriptive adjective order.",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "A1",
    age: "Ages 6–8",
    ageGroup: "5-6",
    grade: "Grades 1–4",
    duration: 30,
    durationText: "30 min",
    skills: ["Speaking", "Vocabulary", "Writing"],
    topic: "Body Parts & Descriptive Adjectives",
    route: "monster-day/index.html",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#f5f3ff"/>
        <rect x="68" y="40" width="64" height="70" rx="28" fill="#a855f7"/>
        <polygon points="68,44 58,22 80,36" fill="#fbbf24"/>
        <polygon points="132,44 142,22 120,36" fill="#fbbf24"/>
        <circle cx="84" cy="60" r="8" fill="#ffffff"/><circle cx="84" cy="60" r="3.5" fill="#0f172a"/>
        <circle cx="100" cy="55" r="10" fill="#ffffff"/><circle cx="100" cy="55" r="4.5" fill="#0f172a"/>
        <circle cx="116" cy="60" r="8" fill="#ffffff"/><circle cx="116" cy="60" r="3.5" fill="#0f172a"/>
        <path d="M 86 85 Q 100 98 114 85" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: "city-mouse",
    title: "The City Mouse & The Country Mouse",
    description: "Interactive Aesop's fable contrasting urban skyscrapers with calm country fields and comparative adjectives.",
    category: "Interactive Stories",
    categoryLabel: "📖 Interactive Stories",
    level: "A1",
    age: "Ages 7–10",
    ageGroup: "7-8",
    grade: "Grades 2–4",
    duration: 35,
    durationText: "35 min",
    skills: ["Reading", "Speaking"],
    topic: "Town vs Country & Comparatives",
    route: "city-mouse/index.html",
    worksheet: "city-mouse/worksheet.html",
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <rect x="105" y="20" width="28" height="100" fill="#94a3b8"/>
        <rect x="138" y="35" width="26" height="85" fill="#64748b"/>
        <path d="M 0 120 Q 50 80 100 120 Z" fill="#86efac"/>
        <rect x="35" y="80" width="28" height="22" rx="2" fill="#f59e0b"/>
        <polygon points="49,68 30,80 68,80" fill="#b45309"/>
        <line x1="100" y1="10" x2="100" y2="130" stroke="#d97706" stroke-dasharray="3 3" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: "detective-prep",
    title: "Detective Prep",
    description: "Rapid-fire 10-minute whiteboard warm-up drilling Wh-questions (Who, Where, What) before the detective mystery.",
    category: "Quick Warm-ups",
    categoryLabel: "⚡ Quick Warm-ups",
    level: "A1",
    age: "Ages 8–9",
    ageGroup: "9-10",
    grade: "Grade 3",
    duration: 10,
    durationText: "10 min",
    skills: ["Speaking", "Grammar"],
    topic: "Wh-Questions & Interrogation",
    route: "treasure/index.html#prep-intro",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#eff6ff"/>
        <circle cx="100" cy="60" r="28" fill="none" stroke="#2563eb" stroke-width="5"/>
        <line x1="120" y1="80" x2="148" y2="108" stroke="#1e40af" stroke-width="7" stroke-linecap="round"/>
        <text x="92" y="70" font-family="sans-serif" font-weight="800" font-size="26" fill="#2563eb">?</text>
      </svg>`
  },
  {
    id: "treasure",
    title: "Treasure Mystery",
    description: "Solve the royal theft with a 4-team live scoreboard. Cross-examine suspects and evaluate clues.",
    category: "Mystery & Detective",
    categoryLabel: "🕵️ Mystery & Detective",
    level: "A1",
    age: "Ages 8–10",
    ageGroup: "9-10",
    grade: "Grade 3",
    duration: 40,
    durationText: "40 min",
    skills: ["Speaking", "Listening", "Vocabulary"],
    topic: "Past Continuous & Detective Clues",
    route: "treasure/index.html#intro",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#fef3c7"/>
        <rect x="52" y="60" width="96" height="56" rx="5" fill="#92400e"/>
        <path d="M 52 60 Q 100 32 148 60 Z" fill="#b45309"/>
        <rect x="94" y="62" width="12" height="16" rx="2" fill="#facc15"/>
        <rect x="66" y="60" width="8" height="56" fill="#fbbf24"/>
        <rect x="126" y="60" width="8" height="56" fill="#fbbf24"/>
      </svg>`
  },
  {
    id: "room-rescue",
    title: "Room Rescue",
    description: "Restore disorganized rooms by placing furniture items according to precise coordinate clues.",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "A1",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    duration: 30,
    durationText: "25–35 min",
    skills: ["Vocabulary", "Speaking", "Grammar"],
    topic: "Furniture & Spatial Prepositions",
    route: "treasure/index.html#room-rescue",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ecfdf5"/>
        <polygon points="0,0 200,0 170,25 30,25" fill="#d1fae5"/>
        <polygon points="30,25 170,25 170,105 30,105" fill="#a7f3d0"/>
        <polygon points="30,105 170,105 200,140 0,140" fill="#6ee7b7"/>
        <rect x="68" y="75" width="64" height="30" rx="3" fill="#047857"/>
        <rect x="78" y="60" width="20" height="15" rx="2" fill="#3b82f6"/>
      </svg>`
  },
  {
    id: "clil-lab",
    title: "CLIL Crime Lab",
    description: "Integrate English with science! Examine microscope fibers, compare fingerprint patterns, and test pH.",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    duration: 35,
    durationText: "35 min",
    skills: ["CLIL", "Vocabulary", "Reading"],
    topic: "Forensic Science & Investigation",
    route: "treasure/index.html#clil-lab",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#e0f2fe"/>
        <path d="M 94 30 L 106 30 L 106 55 L 128 100 L 72 100 L 94 55 Z" fill="#38bdf8" opacity="0.8"/>
        <ellipse cx="100" cy="100" rx="28" ry="7" fill="#0284c7"/>
        <circle cx="95" cy="78" r="3.5" fill="#ffffff"/>
        <circle cx="107" cy="88" r="2.5" fill="#ffffff"/>
        <rect x="145" y="95" width="30" height="14" rx="2" fill="#475569"/>
        <path d="M 160 95 L 160 50 L 142 50" fill="none" stroke="#475569" stroke-width="5"/>
      </svg>`
  },
  {
    id: "expedition",
    title: "The Last Expedition",
    description: "Explore world biomes from rainforests to the Arctic, practicing wildlife terms and compass directions.",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    age: "Ages 9–10",
    ageGroup: "9-10",
    grade: "Grade 4",
    duration: 35,
    durationText: "30–40 min",
    skills: ["CLIL", "Speaking", "Listening"],
    topic: "Global Biomes & Navigation",
    route: "treasure/index.html#expedition",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#ecfdf5"/>
        <polygon points="100,20 45,110 155,110" fill="#059669"/>
        <polygon points="100,20 80,55 120,55" fill="#ffffff"/>
        <circle cx="50" cy="45" r="20" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
        <polygon points="50,30 53,44 50,41 47,44" fill="#ef4444"/>
        <polygon points="50,60 53,46 50,49 47,46" fill="#475569"/>
      </svg>`
  },
  {
    id: "pokemon",
    title: "Pokémon Trainer Battle",
    description: "Gamified arena showdown where answering grammar challenges powers up attacks and defenses with animated HP bars.",
    category: "Classroom Games",
    categoryLabel: "🎮 Classroom Games",
    level: "A2",
    age: "Ages 8–12",
    ageGroup: "9-10",
    grade: "Grades 3–6",
    duration: 45,
    durationText: "45 min",
    skills: ["Grammar", "Speaking", "Vocabulary"],
    topic: "Action Verbs & Creature Stats",
    route: "pokemon/index.html",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#dbeafe"/>
        <ellipse cx="100" cy="95" rx="70" ry="26" fill="#93c5fd"/>
        <circle cx="100" cy="55" r="26" fill="#ef4444"/>
        <path d="M 74 55 A 26 26 0 0 0 126 55 Z" fill="#ffffff"/>
        <line x1="74" y1="55" x2="126" y2="55" stroke="#0f172a" stroke-width="4.5"/>
        <circle cx="100" cy="55" r="8" fill="#0f172a"/>
        <circle cx="100" cy="55" r="4" fill="#ffffff"/>
      </svg>`
  },
  {
    id: "jungle",
    title: "Life in the Jungle",
    description: "Join wildlife rangers on conservation missions! Spot jungle animals and evaluate ecosystem health with audio soundscapes.",
    category: "CLIL",
    categoryLabel: "🌍 CLIL",
    level: "A1+",
    age: "Ages 7–11",
    ageGroup: "7-8",
    grade: "Grades 2–5",
    duration: 40,
    durationText: "40 min",
    skills: ["CLIL", "Vocabulary", "Listening"],
    topic: "Rainforest Wildlife & Modal Can",
    route: "jungle/index.html",
    worksheet: null,
    featured: false,
    thumbnailSvg: `
      <svg viewBox="0 0 200 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#d1fae5"/>
        <circle cx="45" cy="55" r="28" fill="#047857"/>
        <circle cx="95" cy="45" r="32" fill="#059669"/>
        <circle cx="150" cy="55" r="26" fill="#10b981"/>
        <rect x="40" y="70" width="10" height="60" fill="#78350f"/>
        <rect x="90" y="65" width="12" height="65" fill="#78350f"/>
        <rect x="145" y="70" width="10" height="60" fill="#78350f"/>
        <path d="M 0 140 Q 40 95 80 140 Z" fill="#065f46"/>
        <path d="M 120 140 Q 160 100 200 140 Z" fill="#065f46"/>
      </svg>`
  }
];

if (typeof window !== "undefined") {
  window.GAMES_REGISTRY = GAMES_REGISTRY;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GAMES_REGISTRY };
}
