/**
 * ENGLISH ADVENTURE ACADEMY — HIGH-QUALITY PROCEDURAL MONSTER RENDERER
 * 
 * Game-quality 17-layer procedural vector character system.
 * Features:
 * - Shared Anatomical Anchor Skeleton (512x512 coordinate space)
 * - Multi-stop gradients, ambient occlusion shadows, specular highlights
 * - 7 Evolution Stages: Mystery Egg -> Cracking Egg -> Baby -> Growing -> Adventurer -> Advanced -> Ultimate
 * - 6 Vibrant Fur Colors: Sky Blue, Berry Pink, Leaf Green, Sunset Orange, Lavender Purple, Royal Gold
 * - 8 Truly Distinct Glossy Eye Expressions (Anime Sparkle, Happy Crescents, Curious Wink, Dragon Glow, Brave Hero, Sleepy, Starry, Galaxy)
 * - 6 Expressive Mouth Sculptures (Sweet Smile, Happy Grin, Brave Smirk, Tiny Smile, Dragon Roar, Sleepy Mouth)
 * - 5 Sculpted 3D Horns (Starter, Golden Ram, Crystal Spire, Curved Dragon, Cosmic Star)
 * - 5 Natural Species Ears (Default Fluffy, Fox, Cat, Dragon, Elf)
 * - 6 Dimensional Outfits (Explorer Vest, Wizard Robe, Knight Armor, Scientist Coat, Space Suit, Academy Uniform)
 * - 4 Layered Wings & 4 Animated Tails (behind body)
 * - 7 Rich Scenic Vector Worlds (Academy Grounds, Enchanted Forest, Space Nebula, Volcano Island, Ice Kingdom, Cloud Kingdom, Neon City)
 * - 6 Magical Auras with dynamic glow
 * - Hardware-accelerated CSS animations with instant Pause/Resume support
 * - Zero external raster dependencies
 */

(function(root) {
  'use strict';

  // Rich Multi-Stop Monster Color Palettes
  const MONSTER_PALETTES = {
    blue: {
      name: 'Sky Blue',
      base: '#38bdf8',
      light: '#e0f2fe',
      mid: '#0ea5e9',
      dark: '#0284c7',
      deep: '#0369a1',
      shadow: '#0c4a6e',
      belly: '#f0f9ff',
      bellyBorder: '#bae6fd',
      earInner: '#fce7f3',
      cheek: '#f472b6',
      crest: '#60a5fa',
      rim: '#93c5fd'
    },
    pink: {
      name: 'Berry Pink',
      base: '#f472b6',
      light: '#fdf2f8',
      mid: '#ec4899',
      dark: '#db2777',
      deep: '#be185d',
      shadow: '#831843',
      belly: '#fff1f2',
      bellyBorder: '#fbcfe8',
      earInner: '#fed7aa',
      cheek: '#fb7185',
      crest: '#f43f5e',
      rim: '#f9a8d4'
    },
    green: {
      name: 'Leaf Green',
      base: '#4ade80',
      light: '#f0fdf4',
      mid: '#22c55e',
      dark: '#16a34a',
      deep: '#15803d',
      shadow: '#14532d',
      belly: '#f7fee7',
      bellyBorder: '#bbf7d0',
      earInner: '#fef08a',
      cheek: '#f87171',
      crest: '#34d399',
      rim: '#86efac'
    },
    orange: {
      name: 'Sunset Orange',
      base: '#fb923c',
      light: '#fff7ed',
      mid: '#f97316',
      dark: '#ea580c',
      deep: '#c2410c',
      shadow: '#7c2d12',
      belly: '#fffbeb',
      bellyBorder: '#fed7aa',
      earInner: '#fecdd3',
      cheek: '#f43f5e',
      crest: '#fbbf24',
      rim: '#fdba74'
    },
    purple: {
      name: 'Lavender Purple',
      base: '#c084fc',
      light: '#faf5ff',
      mid: '#a855f7',
      dark: '#9333ea',
      deep: '#7e22ce',
      shadow: '#581c87',
      belly: '#fdf4ff',
      bellyBorder: '#e9d5ff',
      earInner: '#fed7e2',
      cheek: '#ec4899',
      crest: '#818cf8',
      rim: '#d8b4fe'
    },
    gold: {
      name: 'Royal Gold',
      base: '#facc15',
      light: '#fefce8',
      mid: '#eab308',
      dark: '#ca8a04',
      deep: '#a16207',
      shadow: '#713f12',
      belly: '#fffbeb',
      bellyBorder: '#fde047',
      earInner: '#fed7aa',
      cheek: '#fb7185',
      crest: '#f59e0b',
      rim: '#fef08a'
    }
  };

  const STAGE_META = {
    egg: { level: 1, name: 'Mystery Egg', title: 'Level 1: Mystery Egg', icon: '🥚', desc: 'A mysterious egg waiting for your learning journey to begin.' },
    cracking_egg: { level: 2, name: 'Cracking Egg', title: 'Level 2: Cracking Egg', icon: '🥚', desc: 'Glowing fissures appear as you earn XP and practice English!' },
    baby: { level: 3, name: 'Baby Monster', title: 'Level 3: Baby Monster', icon: '🐣', desc: 'Hatched! A cute, curious companion eager to learn with you.' },
    growing: { level: 4, name: 'Growing Monster', title: 'Level 4: Growing Monster', icon: '👾', desc: 'Bigger, bouncier, and sprouting distinctive traits.' },
    adventurer: { level: 5, name: 'Adventurer Monster', title: 'Level 5: Adventurer Monster', icon: '🧭', desc: 'Equipped for quests and eager for English challenges!' },
    advanced: { level: 6, name: 'Advanced Monster', title: 'Level 6: Advanced Monster', icon: '🐲', desc: 'Majestic crystal horns, sweeping wings, and proud posture.' },
    ultimate: { level: 7, name: 'Ultimate Monster', title: 'Level 7: Ultimate Monster', icon: '👑', desc: 'The legendary sovereign form crowned with celestial power!' }
  };

  const STAGE_IMAGES = {
    egg: 'assets/monsters/stage-1-mystery-egg.png',
    cracking_egg: 'assets/monsters/stage-2-cracking-egg.png',
    baby: 'assets/monsters/stage-3-baby-monster.png',
    growing: 'assets/monsters/stage-4-growing-monster.png',
    adventurer: 'assets/monsters/stage-5-adventurer-monster.png',
    advanced: 'assets/monsters/stage-6-advanced-monster.png',
    ultimate: 'assets/monsters/stage-7-ultimate-monster.png'
  };

  const EVOLUTION_STAGES = [
    { level: 1, stageKey: 'egg', name: 'Mystery Egg', title: 'Level 1: Mystery Egg', xpRequired: 0, image: 'assets/monsters/stage-1-mystery-egg.png', subtitle: 'A new adventure begins...', icon: '🥚', desc: 'A mysterious egg waiting for your learning journey to begin.' },
    { level: 2, stageKey: 'cracking_egg', name: 'Cracking Egg', title: 'Level 2: Cracking Egg', xpRequired: 100, image: 'assets/monsters/stage-2-cracking-egg.png', subtitle: 'Life is waking up!', icon: '🥚', desc: 'Glowing fissures appear as you earn XP and practice English!' },
    { level: 3, stageKey: 'baby', name: 'Baby Monster', title: 'Level 3: Baby Monster', xpRequired: 250, image: 'assets/monsters/stage-3-baby-monster.png', subtitle: 'Small steps, big dreams!', icon: '🐣', desc: 'Hatched! A cute, curious companion eager to learn with you.' },
    { level: 4, stageKey: 'growing', name: 'Growing Monster', title: 'Level 4: Growing Monster', xpRequired: 500, image: 'assets/monsters/stage-4-growing-monster.png', subtitle: 'Stronger every day!', icon: '👾', desc: 'Bigger, bouncier, and sprouting distinctive traits.' },
    { level: 5, stageKey: 'adventurer', name: 'Adventurer Monster', title: 'Level 5: Adventurer Monster', xpRequired: 1000, image: 'assets/monsters/stage-5-adventurer-monster.png', subtitle: 'Ready for bigger quests!', icon: '🧭', desc: 'Equipped for quests and eager for English challenges!' },
    { level: 6, stageKey: 'advanced', name: 'Advanced Monster', title: 'Level 6: Advanced Monster', xpRequired: 2000, image: 'assets/monsters/stage-6-advanced-monster.png', subtitle: 'New powers, new places!', icon: '🐲', desc: 'Majestic crystal horns, sweeping wings, and proud posture.' },
    { level: 7, stageKey: 'ultimate', name: 'Ultimate Monster', title: 'Level 7: Ultimate Monster', xpRequired: 5000, image: 'assets/monsters/stage-7-ultimate-monster.png', subtitle: 'A true hero!', icon: '👑', desc: 'The legendary sovereign form crowned with celestial power!' }
  ];

  function normalizeStageKey(stage) {
    if (!stage) return 'baby';
    const s = String(stage).toLowerCase().trim();
    if (s === 'mystery egg' || s === 'egg' || s === 'lvl-1' || s === 'level 1') return 'egg';
    if (s === 'cracking egg' || s === 'cracking_egg' || s === 'cracking' || s === 'lvl-2' || s === 'level 2') return 'cracking_egg';
    if (s === 'baby monster' || s === 'baby' || s === 'lvl-3' || s === 'level 3') return 'baby';
    if (s === 'growing monster' || s === 'growing' || s === 'lvl-4' || s === 'level 4') return 'growing';
    if (s === 'adventurer monster' || s === 'adventurer' || s === 'lvl-5' || s === 'level 5') return 'adventurer';
    if (s === 'advanced monster' || s === 'advanced' || s === 'lvl-6' || s === 'level 6') return 'advanced';
    if (s === 'ultimate monster' || s === 'ultimate' || s === 'lvl-7' || s === 'level 7') return 'ultimate';
    if (STAGE_META[s]) return s;
    return 'baby';
  }

  // --- GRADIENT & SHADER DEFINITIONS (512x512 Coordinate Space) ---
  function buildDefs(colorKey, palette) {
    return `
      <defs>
        <!-- Body Lighting -->
        <linearGradient id="mg-body-${colorKey}" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="${palette.light}" />
          <stop offset="25%" stop-color="${palette.base}" />
          <stop offset="70%" stop-color="${palette.dark}" />
          <stop offset="100%" stop-color="${palette.deep}" />
        </linearGradient>

        <linearGradient id="mg-head-${colorKey}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.light}" />
          <stop offset="35%" stop-color="${palette.base}" />
          <stop offset="85%" stop-color="${palette.dark}" />
          <stop offset="100%" stop-color="${palette.deep}" />
        </linearGradient>

        <linearGradient id="mg-crest-${colorKey}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.light}" />
          <stop offset="40%" stop-color="${palette.crest}" />
          <stop offset="100%" stop-color="${palette.dark}" />
        </linearGradient>

        <linearGradient id="mg-belly-${colorKey}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="${palette.belly}" />
          <stop offset="100%" stop-color="${palette.bellyBorder}" />
        </linearGradient>

        <linearGradient id="mg-ear-inner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa" />
          <stop offset="50%" stop-color="#fca5a5" />
          <stop offset="100%" stop-color="#f472b6" />
        </linearGradient>

        <!-- Horn Materials -->
        <linearGradient id="mg-horn-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef9c3" />
          <stop offset="30%" stop-color="#fde047" />
          <stop offset="65%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#854d0e" />
        </linearGradient>

        <linearGradient id="mg-horn-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#cffafe" />
          <stop offset="35%" stop-color="#38bdf8" />
          <stop offset="70%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>

        <linearGradient id="mg-horn-dragon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="40%" stop-color="#334155" />
          <stop offset="85%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>

        <linearGradient id="mg-horn-cosmic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="40%" stop-color="#e879f9" />
          <stop offset="75%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#1e1b4b" />
        </linearGradient>

        <!-- Wing Materials -->
        <linearGradient id="mg-wing-fairy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ecfdf5" stop-opacity="0.9" />
          <stop offset="45%" stop-color="#6ee7b7" stop-opacity="0.75" />
          <stop offset="85%" stop-color="#059669" stop-opacity="0.6" />
        </linearGradient>

        <linearGradient id="mg-wing-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.95" />
          <stop offset="40%" stop-color="#fde047" stop-opacity="0.85" />
          <stop offset="80%" stop-color="#d97706" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#78350f" stop-opacity="0.7" />
        </linearGradient>

        <!-- Filters -->
        <filter id="mg-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#090d16" flood-opacity="0.22" />
        </filter>

        <filter id="mg-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="mg-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;
  }

  // =========================================================================
  // 1. WORLD BACKGROUND LAYER (Layer 1 & 2)
  // =========================================================================
  function renderWorldBackground(worldId, stage) {
    const id = worldId || 'bg-meadow';

    if (id === 'bg-forest') {
      return `
        <!-- Enchanted Forest World -->
        <rect width="512" height="512" fill="#061a23" />
        <linearGradient id="wf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#041b2d" />
          <stop offset="60%" stop-color="#0d3b4c" />
          <stop offset="100%" stop-color="#0a2e28" />
        </linearGradient>
        <rect width="512" height="512" fill="url(#wf-sky)" />
        <!-- Glowing ancient trees -->
        <path d="M -30 512 L 40 220 Q 80 180 120 120 L 160 512 Z" fill="#051f28" opacity="0.85" />
        <path d="M 542 512 L 470 200 Q 430 160 390 90 L 350 512 Z" fill="#051f28" opacity="0.85" />
        <!-- Giant Bioluminescent Mushroom Left -->
        <ellipse cx="70" cy="380" rx="60" ry="24" fill="#a855f7" filter="url(#mg-soft-glow)" opacity="0.9" />
        <ellipse cx="70" cy="380" rx="45" ry="16" fill="#c084fc" />
        <path d="M 62 380 L 65 470 L 75 470 L 78 380 Z" fill="#3b0764" />
        <!-- Giant Mushroom Right -->
        <ellipse cx="440" cy="395" rx="55" ry="22" fill="#06b6d4" filter="url(#mg-soft-glow)" opacity="0.9" />
        <ellipse cx="440" cy="395" rx="40" ry="14" fill="#67e8f9" />
        <path d="M 432 395 L 435 480 L 445 480 L 448 395 Z" fill="#164e63" />
        <!-- Floating Fireflies -->
        <circle cx="140" cy="240" r="4" fill="#fef08a" filter="url(#mg-soft-glow)" />
        <circle cx="210" cy="160" r="3.5" fill="#67e8f9" filter="url(#mg-soft-glow)" />
        <circle cx="370" cy="210" r="4.5" fill="#fef08a" filter="url(#mg-soft-glow)" />
        <circle cx="310" cy="290" r="3" fill="#a7f3d0" filter="url(#mg-soft-glow)" />
        <!-- Grassy Glade Foreground -->
        <ellipse cx="256" cy="490" rx="280" ry="80" fill="#064e3b" />
        <ellipse cx="256" cy="485" rx="260" ry="65" fill="#047857" opacity="0.75" />
      `;
    }

    if (id === 'bg-cosmos') {
      return `
        <!-- Space World Nebula -->
        <rect width="512" height="512" fill="#050714" />
        <radialGradient id="ws-nebula" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#581c87" stop-opacity="0.8" />
          <stop offset="45%" stop-color="#1e1b4b" stop-opacity="0.6" />
          <stop offset="85%" stop-color="#020617" stop-opacity="0.9" />
        </radialGradient>
        <rect width="512" height="512" fill="url(#ws-nebula)" />
        <!-- Glowing Cyan Sub-Nebula -->
        <circle cx="380" cy="180" r="140" fill="#0284c7" opacity="0.25" filter="url(#mg-glow-strong)" />
        <circle cx="130" cy="320" r="110" fill="#db2777" opacity="0.2" filter="url(#mg-glow-strong)" />
        <!-- Ringed Planet -->
        <circle cx="95" cy="115" r="38" fill="#38bdf8" />
        <ellipse cx="95" cy="115" rx="34" ry="34" fill="#0284c7" opacity="0.6" />
        <ellipse cx="95" cy="115" rx="60" ry="12" fill="none" stroke="#e0f2fe" stroke-width="4.5" opacity="0.7" transform="rotate(-22, 95, 115)" />
        <!-- Twinkling Constellation Stars -->
        <circle cx="260" cy="70" r="2.5" fill="#ffffff" />
        <circle cx="310" cy="85" r="1.8" fill="#ffffff" />
        <circle cx="430" cy="130" r="3.2" fill="#fef08a" filter="url(#mg-soft-glow)" />
        <circle cx="465" cy="220" r="2" fill="#ffffff" />
        <circle cx="190" cy="150" r="2.2" fill="#ffffff" />
        <circle cx="65" cy="240" r="2.8" fill="#bae6fd" />
        <!-- Stardust Platform -->
        <ellipse cx="256" cy="485" rx="270" ry="75" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
      `;
    }

    if (id === 'bg-volcano') {
      return `
        <!-- Volcano Island -->
        <rect width="512" height="512" fill="#1c0a0a" />
        <linearGradient id="wv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#450a0a" />
          <stop offset="45%" stop-color="#7f1d1d" />
          <stop offset="75%" stop-color="#c2410c" />
          <stop offset="100%" stop-color="#f97316" />
        </linearGradient>
        <rect width="512" height="340" fill="url(#wv-sky)" />
        <!-- Dark Basalt Mountain Peaks -->
        <polygon points="0,340 90,140 180,340" fill="#18181b" />
        <polygon points="120,340 256,100 390,340" fill="#09090b" />
        <polygon points="340,340 430,160 512,340" fill="#18181b" />
        <!-- Fiery Lava Veins -->
        <path d="M 256 105 Q 262 180 275 340" stroke="#facc15" stroke-width="5" fill="none" filter="url(#mg-soft-glow)" />
        <path d="M 256 105 Q 248 190 238 340" stroke="#ef4444" stroke-width="4" fill="none" />
        <!-- Floating Magma Embers -->
        <circle cx="120" cy="180" r="3" fill="#facc15" filter="url(#mg-soft-glow)" />
        <circle cx="390" cy="140" r="3.5" fill="#f97316" filter="url(#mg-soft-glow)" />
        <circle cx="290" cy="220" r="2.5" fill="#fef08a" />
        <!-- Obsidian Ground -->
        <ellipse cx="256" cy="485" rx="275" ry="75" fill="#18181b" />
      `;
    }

    if (id === 'bg-cloud') {
      return `
        <!-- Cloud Kingdom -->
        <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="45%" stop-color="#bae6fd" />
          <stop offset="85%" stop-color="#fed7aa" />
          <stop offset="100%" stop-color="#fbcfe8" />
        </linearGradient>
        <rect width="512" height="512" fill="url(#wc-sky)" />
        <!-- Rainbow Arch -->
        <path d="M 40 450 A 240 240 0 0 1 472 450" fill="none" stroke="#f43f5e" stroke-width="7" opacity="0.35" />
        <path d="M 46 450 A 234 234 0 0 1 466 450" fill="none" stroke="#f59e0b" stroke-width="7" opacity="0.35" />
        <path d="M 52 450 A 228 228 0 0 1 460 450" fill="none" stroke="#10b981" stroke-width="7" opacity="0.35" />
        <path d="M 58 450 A 222 222 0 0 1 454 450" fill="none" stroke="#0ea5e9" stroke-width="7" opacity="0.35" />
        <path d="M 64 450 A 216 216 0 0 1 448 450" fill="none" stroke="#a855f7" stroke-width="7" opacity="0.35" />
        <!-- Sunbeams -->
        <circle cx="256" cy="90" r="50" fill="#fef08a" opacity="0.5" filter="url(#mg-glow-strong)" />
        <!-- Floating Dream Clouds -->
        <circle cx="80" cy="430" r="70" fill="#ffffff" opacity="0.9" />
        <circle cx="160" cy="420" r="85" fill="#ffffff" opacity="0.95" />
        <circle cx="256" cy="410" r="95" fill="#ffffff" />
        <circle cx="350" cy="420" r="85" fill="#ffffff" opacity="0.95" />
        <circle cx="430" cy="430" r="70" fill="#ffffff" opacity="0.9" />
      `;
    }

    if (id === 'bg-winter' || id === 'bg-crystal') {
      return `
        <!-- Ice Kingdom Glacial Spire -->
        <linearGradient id="wi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#082f49" />
          <stop offset="50%" stop-color="#0e7490" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>
        <rect width="512" height="512" fill="url(#wi-sky)" />
        <!-- Aurora Borealis Ribbon -->
        <path d="M 0 120 Q 140 60 270 110 T 512 80" fill="none" stroke="#34d399" stroke-width="32" opacity="0.35" filter="url(#mg-glow-strong)" />
        <path d="M 0 140 Q 150 90 290 130 T 512 100" fill="none" stroke="#a7f3d0" stroke-width="20" opacity="0.4" filter="url(#mg-soft-glow)" />
        <!-- Crystal Ice Spires -->
        <polygon points="40,460 90,200 140,460" fill="#bae6fd" opacity="0.8" />
        <polygon points="90,200 140,460 120,460" fill="#0284c7" opacity="0.6" />
        <polygon points="370,460 420,180 470,460" fill="#bae6fd" opacity="0.8" />
        <polygon points="420,180 470,460 450,460" fill="#0284c7" opacity="0.6" />
        <!-- Frozen Ground -->
        <ellipse cx="256" cy="485" rx="275" ry="75" fill="#e0f2fe" />
      `;
    }

    if (id === 'bg-moonlit') {
      return `
        <!-- Neon City Twilight -->
        <rect width="512" height="512" fill="#090514" />
        <linearGradient id="wn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1035" />
          <stop offset="55%" stop-color="#3b0764" />
          <stop offset="100%" stop-color="#701a75" />
        </linearGradient>
        <rect width="512" height="360" fill="url(#wn-sky)" />
        <!-- Cyberpunk Skyline Silhouettes -->
        <rect x="40" y="160" width="65" height="200" fill="#180c2e" />
        <rect x="120" y="120" width="80" height="240" fill="#120722" />
        <rect x="220" y="90" width="90" height="270" fill="#0a0314" />
        <rect x="330" y="140" width="75" height="220" fill="#180c2e" />
        <rect x="420" y="170" width="60" height="190" fill="#120722" />
        <!-- Glowing Neon Signs & Antennas -->
        <line x1="265" y1="90" x2="265" y2="40" stroke="#f43f5e" stroke-width="3" filter="url(#mg-soft-glow)" />
        <line x1="160" y1="120" x2="160" y2="70" stroke="#06b6d4" stroke-width="2.5" filter="url(#mg-soft-glow)" />
        <!-- Neon Hologram Grid Platform -->
        <ellipse cx="256" cy="485" rx="275" ry="75" fill="#1e1035" stroke="#ec4899" stroke-width="2" />
      `;
    }

    // Default: Academy Grounds (Explorer Camp & Castle Fairytale)
    return `
      <!-- Academy Grounds / Explorer Camp -->
      <linearGradient id="wm-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="45%" stop-color="#7dd3fc" />
        <stop offset="75%" stop-color="#bae6fd" />
        <stop offset="100%" stop-color="#e0f2fe" />
      </linearGradient>
      <rect width="512" height="512" fill="url(#wm-sky)" />
      <!-- Warm Sunflare -->
      <circle cx="430" cy="80" r="48" fill="#fef08a" opacity="0.6" filter="url(#mg-glow-strong)" />
      <!-- Distant Castle Towers & Turrets -->
      <path d="M 60 320 L 60 210 L 80 180 L 100 210 L 100 320 Z" fill="#93c5fd" opacity="0.5" />
      <path d="M 130 320 L 130 160 L 160 120 L 190 160 L 190 320 Z" fill="#60a5fa" opacity="0.6" />
      <path d="M 330 320 L 330 180 L 355 140 L 380 180 L 380 320 Z" fill="#60a5fa" opacity="0.6" />
      <path d="M 410 320 L 410 220 L 430 190 L 450 220 L 450 320 Z" fill="#93c5fd" opacity="0.5" />
      <!-- Lush Rolling Meadow Hills -->
      <ellipse cx="110" cy="380" rx="220" ry="110" fill="#34d399" opacity="0.85" />
      <ellipse cx="420" cy="375" rx="240" ry="115" fill="#10b981" opacity="0.85" />
      <!-- Foreground Pedestal / Green Meadow Lawn -->
      <ellipse cx="256" cy="485" rx="280" ry="85" fill="#059669" />
      <ellipse cx="256" cy="480" rx="265" ry="70" fill="#10b981" />
      <!-- Little Wildflower Dots -->
      <circle cx="90" cy="460" r="3.5" fill="#fef08a" />
      <circle cx="140" cy="475" r="4" fill="#f472b6" />
      <circle cx="390" cy="470" r="4" fill="#fef08a" />
      <circle cx="435" cy="455" r="3.5" fill="#f472b6" />
    `;
  }

  // =========================================================================
  // 2. MAGICAL AURA LAYER (Layer 3 - Around Character)
  // =========================================================================
  function renderAuraLayer(auraId, stage, palette) {
    if (!auraId || auraId === 'none') return '';

    if (auraId === 'aura-flame') {
      return `
        <!-- Fiery Flame Aura -->
        <g class="eaa-monster-aura-pulse" filter="url(#mg-glow-strong)" opacity="0.75">
          <ellipse cx="256" cy="280" rx="160" ry="170" fill="none" stroke="#f97316" stroke-width="12" opacity="0.5" />
          <path d="M 120 320 Q 150 180 200 120 Q 220 80 256 60 Q 292 80 312 120 Q 362 180 392 320 Z" fill="#ea580c" opacity="0.3" />
          <circle cx="160" cy="180" r="8" fill="#fde047" />
          <circle cx="350" cy="190" r="9" fill="#fde047" />
          <circle cx="256" cy="90" r="10" fill="#ffffff" />
        </g>
      `;
    }

    if (auraId === 'aura-ice') {
      return `
        <!-- Frosty Ice Aura -->
        <g class="eaa-monster-aura-pulse" filter="url(#mg-glow-strong)" opacity="0.8">
          <ellipse cx="256" cy="275" rx="165" ry="175" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="14 10" opacity="0.7" />
          <circle cx="130" cy="220" r="5" fill="#ffffff" />
          <circle cx="380" cy="220" r="5" fill="#ffffff" />
          <circle cx="200" cy="110" r="6" fill="#e0f2fe" />
          <circle cx="310" cy="110" r="6" fill="#e0f2fe" />
        </g>
      `;
    }

    if (auraId === 'aura-rainbow') {
      return `
        <!-- Rainbow Prismatic Aura -->
        <g class="eaa-monster-aura-pulse" filter="url(#mg-glow-strong)" opacity="0.7">
          <ellipse cx="256" cy="275" rx="175" ry="180" fill="none" stroke="#ec4899" stroke-width="4" opacity="0.6" />
          <ellipse cx="256" cy="275" rx="167" ry="172" fill="none" stroke="#eab308" stroke-width="4" opacity="0.6" />
          <ellipse cx="256" cy="275" rx="159" ry="164" fill="none" stroke="#06b6d4" stroke-width="4" opacity="0.6" />
        </g>
      `;
    }

    if (auraId === 'aura-cosmic') {
      return `
        <!-- Galaxy Cosmic Nebula Aura -->
        <g class="eaa-monster-aura-pulse" filter="url(#mg-glow-strong)" opacity="0.85">
          <ellipse cx="256" cy="275" rx="175" ry="180" fill="none" stroke="#a855f7" stroke-width="7" opacity="0.7" />
          <ellipse cx="256" cy="275" rx="195" ry="60" fill="none" stroke="#38bdf8" stroke-width="3" transform="rotate(-15, 256, 275)" opacity="0.65" />
          <circle cx="140" cy="140" r="4.5" fill="#ffffff" />
          <circle cx="370" cy="140" r="4.5" fill="#ffffff" />
          <circle cx="256" cy="85" r="5" fill="#fef08a" />
        </g>
      `;
    }

    if (auraId === 'aura-royal') {
      return `
        <!-- Royal Sovereign Golden Halo -->
        <g class="eaa-monster-aura-pulse" filter="url(#mg-glow-strong)" opacity="0.85">
          <circle cx="256" cy="275" r="180" fill="none" stroke="#facc15" stroke-width="9" opacity="0.6" />
          <polygon points="256,65 264,80 280,80 267,90 272,105 256,95 240,105 245,90 232,80 248,80" fill="#fde047" />
        </g>
      `;
    }

    // Default: Golden Friendship Sparkles
    return `
      <g class="eaa-monster-aura-pulse" filter="url(#mg-soft-glow)" opacity="0.75">
        <circle cx="140" cy="160" r="5" fill="#fef08a" />
        <circle cx="370" cy="160" r="5" fill="#fef08a" />
        <circle cx="110" cy="270" r="4" fill="#fde047" />
        <circle cx="400" cy="270" r="4" fill="#fde047" />
        <circle cx="256" cy="80" r="6" fill="#ffffff" />
      </g>
    `;
  }

  // =========================================================================
  // 3. WINGS LAYER (Layer 4 - Behind Body)
  // =========================================================================
  function renderWingsLayer(wingsId, stage, palette) {
    if (!wingsId || wingsId === 'none') {
      // Auto-unlock wings for Advanced and Ultimate stages
      if (stage === 'ultimate') wingsId = 'wings-celestial';
      else if (stage === 'advanced') wingsId = 'wings-dragon';
      else return '';
    }

    if (wingsId === 'wings-dragon') {
      return `
        <!-- Spined Dragon Wings (Behind Body) -->
        <g class="eaa-monster-wing-anim" filter="url(#mg-shadow)">
          <!-- Left Wing -->
          <g transform="translate(60, 110)">
            <path d="M 120 160 Q 80 80 10 70 Q 50 120 20 180 Q 70 180 80 220 Z" fill="#334155" stroke="#0f172a" stroke-width="4" />
            <path d="M 120 160 Q 75 90 25 80 Q 55 125 35 170 Q 75 175 85 210 Z" fill="#475569" />
            <!-- Wing Bones -->
            <path d="M 120 160 L 10 70 M 120 160 L 20 180 M 120 160 L 80 220" stroke="#0f172a" stroke-width="3" fill="none" />
          </g>
          <!-- Right Wing -->
          <g transform="translate(250, 110)">
            <path d="M 80 160 Q 120 80 190 70 Q 150 120 180 180 Q 130 180 120 220 Z" fill="#334155" stroke="#0f172a" stroke-width="4" />
            <path d="M 80 160 Q 125 90 175 80 Q 145 125 165 170 Q 125 175 115 210 Z" fill="#475569" />
            <path d="M 80 160 L 190 70 M 80 160 L 180 180 M 80 160 L 120 220" stroke="#0f172a" stroke-width="3" fill="none" />
          </g>
        </g>
      `;
    }

    if (wingsId === 'wings-fairy' || wingsId === 'wings-starter') {
      return `
        <!-- Translucent Gossamer Fairy Wings -->
        <g class="eaa-monster-wing-anim" opacity="0.88">
          <!-- Left Wing -->
          <ellipse cx="110" cy="180" rx="65" ry="40" transform="rotate(-30, 110, 180)" fill="url(#mg-wing-fairy)" stroke="#059669" stroke-width="2.5" />
          <ellipse cx="120" cy="240" rx="45" ry="26" transform="rotate(-15, 120, 240)" fill="url(#mg-wing-fairy)" stroke="#059669" stroke-width="2" />
          <!-- Right Wing -->
          <ellipse cx="402" cy="180" rx="65" ry="40" transform="rotate(30, 402, 180)" fill="url(#mg-wing-fairy)" stroke="#059669" stroke-width="2.5" />
          <ellipse cx="392" cy="240" rx="45" ry="26" transform="rotate(15, 392, 240)" fill="url(#mg-wing-fairy)" stroke="#059669" stroke-width="2" />
        </g>
      `;
    }

    if (wingsId === 'wings-crystal') {
      return `
        <!-- Geometric Amethyst Crystal Wings -->
        <g class="eaa-monster-wing-anim" filter="url(#mg-shadow)">
          <!-- Left Crystal Wing -->
          <polygon points="175,250 80,140 120,130 160,200" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <polygon points="175,250 50,180 80,140 150,220" fill="#a855f7" stroke="#7e22ce" stroke-width="2" />
          <polygon points="175,250 80,240 50,180 140,240" fill="#c084fc" stroke="#6b21a8" stroke-width="2" />
          <!-- Right Crystal Wing -->
          <polygon points="337,250 432,140 392,130 352,200" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <polygon points="337,250 462,180 432,140 362,220" fill="#a855f7" stroke="#7e22ce" stroke-width="2" />
          <polygon points="337,250 432,240 462,180 372,240" fill="#c084fc" stroke="#6b21a8" stroke-width="2" />
        </g>
      `;
    }

    // Default Celestial / Sovereign Golden Wings
    return `
      <!-- Feathered Golden Celestial Wings -->
      <g class="eaa-monster-wing-anim" filter="url(#mg-shadow)">
        <!-- Left Wing -->
        <g transform="translate(45, 90)">
          <path d="M 130 180 Q 90 90 20 60 Q 40 100 25 140 Q 60 140 40 190 Q 90 185 100 230 Z" fill="url(#mg-wing-gold)" stroke="#b45309" stroke-width="3.5" />
          <path d="M 115 175 Q 85 105 35 75 Q 50 110 38 145 Q 70 145 55 185 Q 95 185 105 220 Z" fill="#fde047" opacity="0.75" />
        </g>
        <!-- Right Wing -->
        <g transform="translate(265, 90)">
          <path d="M 72 180 Q 112 90 182 60 Q 162 100 177 140 Q 142 140 162 190 Q 112 185 102 230 Z" fill="url(#mg-wing-gold)" stroke="#b45309" stroke-width="3.5" />
          <path d="M 87 175 Q 117 105 167 75 Q 152 110 164 145 Q 132 145 147 185 Q 107 185 97 220 Z" fill="#fde047" opacity="0.75" />
        </g>
      </g>
    `;
  }

  // =========================================================================
  // 4. TAIL LAYER (Layer 5 - Behind Body)
  // =========================================================================
  function renderTailLayer(tailId, palette) {
    const id = tailId || 'tail-puff';

    if (id === 'tail-perky' || id === 'tail-fluffy') {
      return `
        <!-- Fluffy Curled Tail -->
        <g class="eaa-monster-tail-anim" filter="url(#mg-shadow)">
          <path d="M 175 355 C 130 350, 95 320, 85 270 C 75 220, 110 180, 150 185 C 130 205, 125 240, 145 270 C 160 295, 175 330, 185 365 Z" fill="url(#mg-body-${palette.name ? palette.name.toLowerCase().split(' ')[1] : 'blue'})" stroke="${palette.dark}" stroke-width="3.5" />
          <circle cx="125" cy="210" r="18" fill="${palette.light}" />
        </g>
      `;
    }

    if (id === 'tail-dragon') {
      return `
        <!-- Spined Dragon Tail -->
        <g class="eaa-monster-tail-anim" filter="url(#mg-shadow)">
          <path d="M 180 365 C 120 375, 70 330, 60 260 C 55 220, 75 180, 95 160 C 90 190, 105 230, 135 275 C 155 305, 175 345, 190 375 Z" fill="${palette.dark}" stroke="${palette.shadow}" stroke-width="4" />
          <!-- Dragon Spines -->
          <polygon points="65,250 45,240 62,230" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <polygon points="75,210 55,198 72,190" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
          <polygon points="90,175 75,160 88,155" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        </g>
      `;
    }

    if (id === 'tail-star' || id === 'tail-flame') {
      return `
        <!-- Star / Flame Plume Tail -->
        <g class="eaa-monster-tail-anim" filter="url(#mg-shadow)">
          <path d="M 175 360 C 130 365, 85 330, 75 270 C 70 230, 90 190, 120 170 C 110 200, 120 240, 150 285 C 165 310, 175 340, 185 370 Z" fill="${palette.base}" stroke="${palette.dark}" stroke-width="3.5" />
          <!-- Star Tip -->
          <polygon points="120,165 126,178 140,178 128,188 132,202 120,192 108,202 112,188 100,178 114,178" fill="#fde047" stroke="#eab308" stroke-width="2" filter="url(#mg-soft-glow)" />
        </g>
      `;
    }

    // Default Puff Bunny Tail
    return `
      <!-- Soft Round Bunny Puff Tail -->
      <g class="eaa-monster-tail-anim" filter="url(#mg-shadow)">
        <circle cx="130" cy="340" r="32" fill="${palette.light}" stroke="${palette.dark}" stroke-width="3" />
        <circle cx="120" cy="332" r="16" fill="#ffffff" opacity="0.8" />
      </g>
    `;
  }

  // =========================================================================
  // 5. ANATOMICAL BODY BASE & FEET (Layer 6 & 7)
  // =========================================================================
  function renderBodyAnatomy(stage, palette, colorKey) {
    let bodyRx = 105;
    let bodyRy = 95;
    let bodyY = 320;
    let headY = 185;
    let headRx = 108;
    let headRy = 88;

    if (stage === 'baby') {
      bodyRx = 92;
      bodyRy = 82;
      bodyY = 330;
      headY = 195;
      headRx = 102;
      headRy = 84;
    } else if (stage === 'adventurer' || stage === 'advanced' || stage === 'ultimate') {
      bodyRx = 112;
      bodyRy = 100;
      bodyY = 315;
      headY = 180;
      headRx = 112;
      headRy = 90;
    }

    const cX = 256;

    return `
      <!-- Ground Shadow Under Monster -->
      <ellipse cx="${cX}" cy="435" rx="140" ry="24" fill="rgba(15, 23, 42, 0.22)" />

      <!-- Hind Feet / Paws Planted Solidly on Ground -->
      <g filter="url(#mg-shadow)">
        <!-- Left Foot -->
        <g transform="translate(165, 412)">
          <ellipse cx="0" cy="0" rx="34" ry="20" fill="${palette.dark}" stroke="${palette.shadow}" stroke-width="3" />
          <circle cx="-16" cy="4" r="7" fill="${palette.light}" />
          <circle cx="0" cy="6" r="7.5" fill="${palette.light}" />
          <circle cx="16" cy="4" r="7" fill="${palette.light}" />
        </g>
        <!-- Right Foot -->
        <g transform="translate(347, 412)">
          <ellipse cx="0" cy="0" rx="34" ry="20" fill="${palette.dark}" stroke="${palette.shadow}" stroke-width="3" />
          <circle cx="-16" cy="4" r="7" fill="${palette.light}" />
          <circle cx="0" cy="6" r="7.5" fill="${palette.light}" />
          <circle cx="16" cy="4" r="7" fill="${palette.light}" />
        </g>
      </g>

      <!-- Main Torso / Body -->
      <g filter="url(#mg-shadow)">
        <ellipse cx="${cX}" cy="${bodyY}" rx="${bodyRx}" ry="${bodyRy}" fill="url(#mg-body-${colorKey})" stroke="${palette.shadow}" stroke-width="3.5" />
      </g>

      <!-- Fluffy White Chest & Belly Bib -->
      <g>
        <!-- Layered Belly Tuft -->
        <path d="M ${cX - 65} ${bodyY - 45} 
                 C ${cX - 85} ${bodyY + 20}, ${cX - 75} ${bodyY + 70}, ${cX} ${bodyY + 80} 
                 C ${cX + 75} ${bodyY + 70}, ${cX + 85} ${bodyY + 20}, ${cX + 65} ${bodyY - 45} 
                 C ${cX + 35} ${bodyY - 35}, ${cX - 35} ${bodyY - 35}, ${cX - 65} ${bodyY - 45} Z" 
              fill="url(#mg-belly-${colorKey})" stroke="${palette.bellyBorder}" stroke-width="2" />
        <!-- Chest Fluff Tuft Highlights -->
        <path d="M ${cX - 25} ${bodyY - 25} Q ${cX} ${bodyY - 10} ${cX + 25} ${bodyY - 25}" stroke="${palette.mid}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6" />
        <path d="M ${cX - 35} ${bodyY + 15} Q ${cX} ${bodyY + 30} ${cX + 35} ${bodyY + 15}" stroke="${palette.mid}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5" />
      </g>

      <!-- Dimensional Head with Fluffy Cheek Tufts -->
      <g filter="url(#mg-shadow)">
        <!-- Head Base with Cheek Wings -->
        <path d="M ${cX} ${headY - headRy} 
                 C ${cX + 80} ${headY - headRy + 5}, ${cX + headRx - 10} ${headY - 20}, ${cX + headRx + 15} ${headY + 15}
                 C ${cX + headRx + 25} ${headY + 35}, ${cX + headRx - 10} ${headY + 45}, ${cX + headRx + 10} ${headY + 55}
                 C ${cX + headRx - 15} ${headY + 65}, ${cX + 70} ${headY + headRy}, ${cX} ${headY + headRy + 5}
                 C ${cX - 70} ${headY + headRy}, ${cX - headRx + 15} ${headY + 65}, ${cX - headRx - 10} ${headY + 55}
                 C ${cX - headRx + 10} ${headY + 45}, ${cX - headRx - 25} ${headY + 35}, ${cX - headRx - 15} ${headY + 15}
                 C ${cX - headRx + 10} ${headY - 20}, ${cX - 80} ${headY - headRy + 5}, ${cX} ${headY - headRy} Z" 
              fill="url(#mg-head-${colorKey})" stroke="${palette.shadow}" stroke-width="3.5" />

        <!-- Forehead Hair Crest (3 Layered Feather Tufts) -->
        <path d="M ${cX - 38} ${headY - headRy + 15} 
                 Q ${cX - 20} ${headY - headRy - 42} ${cX} ${headY - headRy - 48} 
                 Q ${cX + 20} ${headY - headRy - 42} ${cX + 38} ${headY - headRy + 15} 
                 Q ${cX} ${headY - headRy + 5} ${cX - 38} ${headY - headRy + 15} Z" 
              fill="url(#mg-crest-${colorKey})" stroke="${palette.shadow}" stroke-width="3" />
        <!-- Inner Crest Highlight -->
        <path d="M ${cX - 18} ${headY - headRy + 8} 
                 Q ${cX} ${headY - headRy - 32} ${cX + 18} ${headY - headRy + 8} Z" 
              fill="${palette.light}" opacity="0.75" />
      </g>
    `;
  }

  // =========================================================================
  // 6. EARS LAYER (Layer 8 - Real Connected Ears)
  // =========================================================================
  function renderEars(earsId, palette) {
    const id = earsId || 'horns-ears';
    const cX = 256;

    if (id === 'ears-fox') {
      return `
        <!-- Tall Pointed Fox Ears -->
        <g filter="url(#mg-shadow)">
          <!-- Left Ear -->
          <g transform="translate(155, 125) rotate(-22)">
            <polygon points="0,35 -40,-65 25,-40" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
            <polygon points="-5,20 -30,-50 15,-32" fill="url(#mg-ear-inner)" />
            <!-- Dark Tip -->
            <polygon points="-28,-45 -40,-65 -15,-52" fill="#0f172a" />
          </g>
          <!-- Right Ear -->
          <g transform="translate(357, 125) rotate(22)">
            <polygon points="0,35 40,-65 -25,-40" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
            <polygon points="5,20 30,-50 -15,-32" fill="url(#mg-ear-inner)" />
            <polygon points="28,-45 40,-65 15,-52" fill="#0f172a" />
          </g>
        </g>
      `;
    }

    if (id === 'ears-cat') {
      return `
        <!-- Alert Feline Cat Ears -->
        <g filter="url(#mg-shadow)">
          <!-- Left Ear -->
          <g transform="translate(162, 130) rotate(-26)">
            <path d="M 0 30 Q -35 -20 -30 -45 Q 5 -25 25 15 Z" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
            <path d="M -5 18 Q -26 -15 -22 -35 Q 2 -18 16 8 Z" fill="url(#mg-ear-inner)" />
          </g>
          <!-- Right Ear -->
          <g transform="translate(350, 130) rotate(26)">
            <path d="M 0 30 Q 35 -20 30 -45 Q -5 -25 -25 15 Z" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
            <path d="M 5 18 Q 26 -15 22 -35 Q -2 -18 -16 8 Z" fill="url(#mg-ear-inner)" />
          </g>
        </g>
      `;
    }

    if (id === 'ears-dragon') {
      return `
        <!-- Webbed Dragon Fin Ears -->
        <g filter="url(#mg-shadow)">
          <!-- Left Dragon Fin -->
          <g transform="translate(150, 140)">
            <path d="M 0 10 L -65 -35 Q -35 5 -75 15 Q -40 25 -60 50 L 0 30 Z" fill="${palette.dark}" stroke="${palette.shadow}" stroke-width="3.5" />
            <path d="M -10 12 L -55 -25 Q -32 6 -60 15 Q -35 24 -50 40 L -10 26 Z" fill="#fde047" opacity="0.6" />
          </g>
          <!-- Right Dragon Fin -->
          <g transform="translate(362, 140)">
            <path d="M 0 10 L 65 -35 Q 35 5 75 15 Q 40 25 60 50 L 0 30 Z" fill="${palette.dark}" stroke="${palette.shadow}" stroke-width="3.5" />
            <path d="M 10 12 L 55 -25 Q 32 6 60 15 Q 35 24 50 40 L 10 26 Z" fill="#fde047" opacity="0.6" />
          </g>
        </g>
      `;
    }

    if (id === 'ears-elf') {
      return `
        <!-- Long Graceful Elf Ears -->
        <g filter="url(#mg-shadow)">
          <!-- Left Elf Ear -->
          <path d="M 160 170 C 130 160, 70 140, 50 120 C 80 150, 120 180, 155 195 Z" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3" />
          <path d="M 150 172 C 125 163, 85 147, 68 132 C 92 153, 122 176, 148 188 Z" fill="url(#mg-ear-inner)" />
          <!-- Right Elf Ear -->
          <path d="M 352 170 C 382 160, 442 140, 462 120 C 432 150, 392 180, 357 195 Z" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3" />
          <path d="M 362 172 C 387 163, 427 147, 444 132 C 420 153, 390 176, 364 188 Z" fill="url(#mg-ear-inner)" />
        </g>
      `;
    }

    // Default: Signature Rounded Creature Ears (Soft, fluffy, bouncy)
    return `
      <g filter="url(#mg-shadow)">
        <!-- Left Fluffy Ear -->
        <g transform="translate(155, 138) rotate(-22)">
          <ellipse cx="-15" cy="-25" rx="38" ry="46" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
          <!-- Inner Warm Peach Pad -->
          <ellipse cx="-15" cy="-25" rx="24" ry="32" fill="url(#mg-ear-inner)" />
        </g>
        <!-- Right Fluffy Ear -->
        <g transform="translate(357, 138) rotate(22)">
          <ellipse cx="15" cy="-25" rx="38" ry="46" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3.5" />
          <ellipse cx="15" cy="-25" rx="24" ry="32" fill="url(#mg-ear-inner)" />
        </g>
      </g>
    `;
  }

  // =========================================================================
  // 7. HORNS LAYER (Layer 9 - 3D Sculpted Attached Horns)
  // =========================================================================
  function renderHorns(hornsId, stage) {
    let id = hornsId;
    if (!id || id === 'none' || id === 'horns-ears') {
      if (stage === 'baby') id = 'horns-nub';
      else if (stage === 'growing') id = 'horns-gold';
      else if (stage === 'adventurer') id = 'horns-gold';
      else if (stage === 'advanced') id = 'horns-crystal';
      else if (stage === 'ultimate') id = 'horns-gold';
      else return '';
    }

    if (id === 'horns-gold') {
      return `
        <!-- Majestic Golden Horns with Segmented 3D Ridges -->
        <g filter="url(#mg-shadow)">
          <!-- Left Golden Horn -->
          <g transform="translate(196, 108) rotate(-16)">
            <path d="M -16 10 C -25 -25, -42 -55, -28 -95 C -12 -75, 4 -40, 16 10 Z" fill="url(#mg-horn-gold)" stroke="#78350f" stroke-width="3.5" />
            <!-- Segment Ridges -->
            <path d="M -18 -15 Q -5 -10 12 -12" stroke="#78350f" stroke-width="2.5" fill="none" />
            <path d="M -26 -42 Q -12 -38 6 -38" stroke="#78350f" stroke-width="2.5" fill="none" />
            <path d="M -30 -68 Q -18 -64 -2 -62" stroke="#78350f" stroke-width="2.5" fill="none" />
            <!-- Base Ring -->
            <ellipse cx="0" cy="10" rx="16" ry="6" fill="#ca8a04" stroke="#78350f" stroke-width="2.5" />
          </g>
          <!-- Right Golden Horn -->
          <g transform="translate(316, 108) rotate(16)">
            <path d="M 16 10 C 25 -25, 42 -55, 28 -95 C 12 -75, -4 -40, -16 10 Z" fill="url(#mg-horn-gold)" stroke="#78350f" stroke-width="3.5" />
            <path d="M 18 -15 Q 5 -10 -12 -12" stroke="#78350f" stroke-width="2.5" fill="none" />
            <path d="M 26 -42 Q 12 -38 -6 -38" stroke="#78350f" stroke-width="2.5" fill="none" />
            <path d="M 30 -68 Q 18 -64 2 -62" stroke="#78350f" stroke-width="2.5" fill="none" />
            <ellipse cx="0" cy="10" rx="16" ry="6" fill="#ca8a04" stroke="#78350f" stroke-width="2.5" />
          </g>
        </g>
      `;
    }

    if (id === 'horns-crystal') {
      return `
        <!-- Multi-Faceted Gemstone Crystal Horns -->
        <g filter="url(#mg-shadow)">
          <!-- Left Crystal Horn -->
          <g transform="translate(196, 110) rotate(-18)">
            <polygon points="0,-95 -22,-30 -14,12 14,12 22,-30" fill="url(#mg-horn-crystal)" stroke="#4c1d95" stroke-width="3" />
            <polygon points="0,-95 -22,-30 0,-15" fill="#cffafe" opacity="0.8" />
            <polygon points="0,-95 0,-15 22,-30" fill="#a855f7" opacity="0.75" />
          </g>
          <!-- Right Crystal Horn -->
          <g transform="translate(316, 110) rotate(18)">
            <polygon points="0,-95 22,-30 14,12 -14,12 -22,-30" fill="url(#mg-horn-crystal)" stroke="#4c1d95" stroke-width="3" />
            <polygon points="0,-95 22,-30 0,-15" fill="#cffafe" opacity="0.8" />
            <polygon points="0,-95 0,-15 -22,-30" fill="#a855f7" opacity="0.75" />
          </g>
        </g>
      `;
    }

    if (id === 'horns-curved' || id === 'horns-dragon') {
      return `
        <!-- Sleek Curved Dragon Horns -->
        <g filter="url(#mg-shadow)">
          <!-- Left Horn -->
          <g transform="translate(195, 112) rotate(-24)">
            <path d="M -14 12 C -24 -20, -55 -60, -50 -92 C -30 -70, 0 -35, 14 12 Z" fill="url(#mg-horn-dragon)" stroke="#020617" stroke-width="3.5" />
          </g>
          <!-- Right Horn -->
          <g transform="translate(317, 112) rotate(24)">
            <path d="M 14 12 C 24 -20, 55 -60, 50 -92 C 30 -70, 0 -35, -14 12 Z" fill="url(#mg-horn-dragon)" stroke="#020617" stroke-width="3.5" />
          </g>
        </g>
      `;
    }

    if (id === 'horns-star' || id === 'horns-cosmic') {
      return `
        <!-- Cosmic Star Horns -->
        <g filter="url(#mg-shadow)">
          <!-- Left Horn -->
          <g transform="translate(196, 110) rotate(-15)">
            <path d="M -12 10 L -22 -60 L 12 10 Z" fill="url(#mg-horn-cosmic)" stroke="#1e1b4b" stroke-width="3" />
            <polygon points="-22,-65 -16,-55 -6,-55 -14,-47 -10,-37 -22,-43 -34,-37 -30,-47 -38,-55 -28,-55" fill="#fde047" stroke="#eab308" stroke-width="1.5" filter="url(#mg-soft-glow)" />
          </g>
          <!-- Right Horn -->
          <g transform="translate(316, 110) rotate(15)">
            <path d="M 12 10 L 22 -60 L -12 10 Z" fill="url(#mg-horn-cosmic)" stroke="#1e1b4b" stroke-width="3" />
            <polygon points="22,-65 28,-55 38,-55 30,-47 34,-37 22,-43 10,-37 14,-47 6,-55 16,-55" fill="#fde047" stroke="#eab308" stroke-width="1.5" filter="url(#mg-soft-glow)" />
          </g>
        </g>
      `;
    }

    // Default Starter Nub Horns
    return `
      <!-- Cute Starter Nub Horns -->
      <g filter="url(#mg-shadow)">
        <g transform="translate(198, 118) rotate(-14)">
          <path d="M -10 8 Q -16 -24 0 -32 Q 16 -24 10 8 Z" fill="url(#mg-horn-gold)" stroke="#78350f" stroke-width="2.5" />
        </g>
        <g transform="translate(314, 118) rotate(14)">
          <path d="M 10 8 Q 16 -24 0 -32 Q -16 -24 -10 8 Z" fill="url(#mg-horn-gold)" stroke="#78350f" stroke-width="2.5" />
        </g>
      </g>
    `;
  }

  // =========================================================================
  // 8. CLOTHING & OUTFITS LAYER (Layer 10 - Wrapping Torso)
  // =========================================================================
  function renderClothingLayer(clothingId, palette) {
    if (!clothingId || clothingId === 'none' || clothingId === 'clothing-none') return '';
    const cX = 256;

    if (clothingId === 'clothing-vest') {
      return `
        <!-- Explorer Safari Vest (Straps, Collar, Brass Buckles) -->
        <g filter="url(#mg-shadow)">
          <!-- Vest Body Left & Right Flaps -->
          <path d="M 175 270 Q 150 330 168 375 L 230 375 L 230 290 Z" fill="#d97706" stroke="#78350f" stroke-width="3" />
          <path d="M 337 270 Q 362 330 344 375 L 282 375 L 282 290 Z" fill="#d97706" stroke="#78350f" stroke-width="3" />
          <!-- Leather Cross Harness Straps -->
          <path d="M 180 270 L 290 370" stroke="#78350f" stroke-width="7" />
          <path d="M 332 270 L 222 370" stroke="#78350f" stroke-width="7" />
          <path d="M 180 270 L 290 370" stroke="#b45309" stroke-width="4" />
          <path d="M 332 270 L 222 370" stroke="#b45309" stroke-width="4" />
          <!-- Golden Center Buckle -->
          <rect x="246" y="310" width="20" height="18" rx="4" fill="#fde047" stroke="#854d0e" stroke-width="2" />
          <!-- Pockets with Button Flaps -->
          <rect x="180" y="335" width="36" height="26" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <circle cx="198" cy="340" r="3" fill="#fde047" />
          <rect x="296" y="335" width="36" height="26" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <circle cx="314" cy="340" r="3" fill="#fde047" />
        </g>
      `;
    }

    if (clothingId === 'clothing-robe') {
      return `
        <!-- Wizard Scholar Robe (Indigo velvet, Gold Runes, Gem Clasp) -->
        <g filter="url(#mg-shadow)">
          <path d="M 180 265 C 150 330, 155 385, 170 410 L 342 410 C 357 385, 362 330, 332 265 Z" fill="#312e81" stroke="#1e1b4b" stroke-width="3.5" />
          <!-- Gold Hem Border -->
          <path d="M 170 405 L 342 405" stroke="#facc15" stroke-width="6" />
          <!-- Flowing Cowl Collar -->
          <path d="M 180 265 Q 256 310 332 265 Q 256 280 180 265 Z" fill="#4338ca" stroke="#facc15" stroke-width="2.5" />
          <!-- Amethyst Amulet Clasp -->
          <polygon points="256,290 266,305 256,320 246,305" fill="#c084fc" stroke="#fde047" stroke-width="2" filter="url(#mg-soft-glow)" />
        </g>
      `;
    }

    if (clothingId === 'clothing-knight-armor') {
      return `
        <!-- Knight Plate Armor (Silver Breastplate, Pauldrons, Sapphire) -->
        <g filter="url(#mg-shadow)">
          <!-- Steel Breastplate -->
          <path d="M 185 270 Q 256 260 327 270 L 320 375 Q 256 395 192 375 Z" fill="#cbd5e1" stroke="#334155" stroke-width="3.5" />
          <!-- Specular Metallic Highlight -->
          <path d="M 215 285 L 297 285 L 285 365 L 227 365 Z" fill="#f1f5f9" opacity="0.65" />
          <!-- Left & Right Gold Pauldrons -->
          <ellipse cx="175" cy="275" rx="24" ry="16" fill="#facc15" stroke="#854d0e" stroke-width="2.5" transform="rotate(-15, 175, 275)" />
          <ellipse cx="337" cy="275" rx="24" ry="16" fill="#facc15" stroke="#854d0e" stroke-width="2.5" transform="rotate(15, 337, 275)" />
          <!-- Sapphire Center Insignia -->
          <polygon points="256,315 268,330 256,345 244,330" fill="#0284c7" stroke="#fde047" stroke-width="2" filter="url(#mg-soft-glow)" />
        </g>
      `;
    }

    if (clothingId === 'clothing-travel-coat' || clothingId === 'clothing-adv-jacket') {
      return `
        <!-- Scientist / Explorer Lab Coat -->
        <g filter="url(#mg-shadow)">
          <path d="M 175 265 Q 148 340 165 400 L 235 400 L 245 280 Z" fill="#f8fafc" stroke="#475569" stroke-width="3" />
          <path d="M 337 265 Q 364 340 347 400 L 277 400 L 267 280 Z" fill="#f8fafc" stroke="#475569" stroke-width="3" />
          <!-- Collar Lapels -->
          <polygon points="200,265 245,280 220,320" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
          <polygon points="312,265 267,280 292,320" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
          <!-- Pocket with Pens -->
          <rect x="185" y="325" width="28" height="26" rx="2" fill="#ffffff" stroke="#64748b" stroke-width="2" />
          <line x1="192" y1="320" x2="192" y2="330" stroke="#ef4444" stroke-width="3" />
          <line x1="198" y1="318" x2="198" y2="330" stroke="#3b82f6" stroke-width="3" />
        </g>
      `;
    }

    if (clothingId === 'clothing-space') {
      return `
        <!-- High-Tech Space Suit (Padded, Oxygen Collar, Display) -->
        <g filter="url(#mg-shadow)">
          <path d="M 175 265 C 150 330, 160 380, 175 405 L 337 405 C 352 380, 362 330, 337 265 Z" fill="#f1f5f9" stroke="#0284c7" stroke-width="3.5" />
          <!-- Glowing Oxygen Collar Ring -->
          <ellipse cx="${cX}" cy="268" rx="72" ry="16" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="3" />
          <!-- Chest Computer Console -->
          <rect x="228" y="305" width="56" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
          <circle cx="242" cy="320" r="5" fill="#22c55e" filter="url(#mg-soft-glow)" />
          <circle cx="256" cy="320" r="5" fill="#facc15" filter="url(#mg-soft-glow)" />
          <circle cx="270" cy="320" r="5" fill="#ef4444" filter="url(#mg-soft-glow)" />
          <line x1="236" y1="335" x2="276" y2="335" stroke="#38bdf8" stroke-width="2.5" />
        </g>
      `;
    }

    // Default: Academy Uniform (Navy Sweater & Gold Striped Scarf)
    return `
      <!-- Academy Sweater & Scarf -->
      <g filter="url(#mg-shadow)">
        <path d="M 180 268 C 160 330, 165 375, 180 395 L 332 395 C 347 375, 352 330, 332 268 Z" fill="#1e3a8a" stroke="#0f172a" stroke-width="3" />
        <!-- Striped Academy Scarf -->
        <path d="M 180 260 Q 256 295 332 260 Q 256 275 180 260 Z" fill="#f59e0b" stroke="#78350f" stroke-width="3" />
        <!-- Hanging Scarf Tail -->
        <path d="M 285 275 L 310 365 L 335 365 L 310 275 Z" fill="#f59e0b" stroke="#78350f" stroke-width="2.5" />
        <line x1="290" y1="300" x2="318" y2="300" stroke="#1e3a8a" stroke-width="4" />
        <line x1="298" y1="330" x2="326" y2="330" stroke="#1e3a8a" stroke-width="4" />
      </g>
    `;
  }

  // =========================================================================
  // 9. FRONT LIMBS & PAWS (Layer 11 - Visibly Attached Front Paws)
  // =========================================================================
  function renderFrontPaws(stage, palette) {
    const leftPawX = 186;
    const rightPawX = 326;
    const pawY = 338;

    return `
      <!-- Left Front Arm & Paw -->
      <g filter="url(#mg-shadow)">
        <g transform="translate(${leftPawX}, ${pawY}) rotate(18)">
          <ellipse cx="0" cy="0" rx="22" ry="32" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3" />
          <circle cx="-10" cy="14" r="5.5" fill="${palette.light}" />
          <circle cx="0" cy="17" r="6" fill="${palette.light}" />
          <circle cx="10" cy="14" r="5.5" fill="${palette.light}" />
        </g>
      </g>
      <!-- Right Front Arm & Paw -->
      <g filter="url(#mg-shadow)">
        <g transform="translate(${rightPawX}, ${pawY}) rotate(-18)">
          <ellipse cx="0" cy="0" rx="22" ry="32" fill="${palette.base}" stroke="${palette.shadow}" stroke-width="3" />
          <circle cx="-10" cy="14" r="5.5" fill="${palette.light}" />
          <circle cx="0" cy="17" r="6" fill="${palette.light}" />
          <circle cx="10" cy="14" r="5.5" fill="${palette.light}" />
        </g>
      </g>
    `;
  }

  // =========================================================================
  // 10. GLOSSY EYES LAYER (Layer 12 - 8 Truly Distinct Expressions)
  // =========================================================================
  function renderEyes(eyesId, palette) {
    const id = eyesId || 'eyes-sparkle';
    const lx = 205;
    const rx = 307;
    const ey = 184;

    if (id === 'eyes-happy') {
      return `
        <!-- Happy Crescent Laughing Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Left Crescent -->
          <path d="M ${lx - 22} ${ey + 8} Q ${lx} ${ey - 18} ${lx + 22} ${ey + 8}" stroke="#0f172a" stroke-width="6.5" stroke-linecap="round" fill="none" />
          <path d="M ${lx + 14} ${ey - 8} L ${lx + 24} ${ey - 16}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
          <!-- Right Crescent -->
          <path d="M ${rx - 22} ${ey + 8} Q ${rx} ${ey - 18} ${rx + 22} ${ey + 8}" stroke="#0f172a" stroke-width="6.5" stroke-linecap="round" fill="none" />
          <path d="M ${rx - 14} ${ey - 8} L ${rx - 24} ${ey - 16}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
        </g>
      `;
    }

    if (id === 'eyes-wink') {
      return `
        <!-- Playful Curious Wink -->
        <g class="eaa-monster-blink-group">
          <!-- Left Open Glossy Anime Eye -->
          <ellipse cx="${lx}" cy="${ey}" rx="20" ry="26" fill="#0f172a" stroke="${palette.shadow}" stroke-width="2" />
          <ellipse cx="${lx}" cy="${ey + 4}" rx="17" ry="20" fill="#0284c7" />
          <circle cx="${lx - 6}" cy="${ey - 6}" r="8.5" fill="#ffffff" />
          <circle cx="${lx + 6}" cy="${ey + 8}" r="4" fill="#ffffff" />
          <path d="M ${lx - 22} ${ey - 22} Q ${lx} ${ey - 30} ${lx + 20} ${ey - 24}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- Right Winking Arc -->
          <path d="M ${rx - 20} ${ey + 6} Q ${rx} ${ey - 14} ${rx + 20} ${ey + 6}" stroke="#0f172a" stroke-width="6" stroke-linecap="round" fill="none" />
          <path d="M ${rx - 20} ${ey - 18} Q ${rx} ${ey - 28} ${rx + 20} ${ey - 24}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none" />
        </g>
      `;
    }

    if (id === 'eyes-dragon') {
      return `
        <!-- Glowing Amber Dragon Slit Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Left Eye -->
          <polygon points="${lx-22},${ey-18} ${lx+22},${ey-10} ${lx+18},${ey+16} ${lx-20},${ey+12}" fill="#d97706" stroke="#451a03" stroke-width="3" />
          <ellipse cx="${lx}" cy="${ey}" rx="18" ry="22" fill="#facc15" />
          <!-- Vertical Slit Pupil -->
          <ellipse cx="${lx}" cy="${ey}" rx="4" ry="20" fill="#020617" />
          <!-- Specular Spark -->
          <circle cx="${lx - 5}" cy="${ey - 6}" r="4" fill="#ffffff" />
          <!-- Right Eye -->
          <polygon points="${rx-22},${ey-10} ${rx+22},${ey-18} ${rx+20},${ey+12} ${rx-18},${ey+16}" fill="#d97706" stroke="#451a03" stroke-width="3" />
          <ellipse cx="${rx}" cy="${ey}" rx="18" ry="22" fill="#facc15" />
          <ellipse cx="${rx}" cy="${ey}" rx="4" ry="20" fill="#020617" />
          <circle cx="${rx - 5}" cy="${ey - 6}" r="4" fill="#ffffff" />
        </g>
      `;
    }

    if (id === 'eyes-brave') {
      return `
        <!-- Heroic Determined Brave Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Fierce Angled Brow Lines -->
          <line x1="${lx - 22}" y1="${ey - 24}" x2="${lx + 20}" y2="${ey - 14}" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round" />
          <line x1="${rx + 22}" y1="${ey - 24}" x2="${rx - 20}" y2="${ey - 14}" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round" />
          <!-- Left Eye -->
          <ellipse cx="${lx}" cy="${ey}" rx="20" ry="24" fill="#0f172a" />
          <ellipse cx="${lx}" cy="${ey + 3}" rx="17" ry="18" fill="#2563eb" />
          <circle cx="${lx - 5}" cy="${ey - 5}" r="8" fill="#ffffff" />
          <!-- Right Eye -->
          <ellipse cx="${rx}" cy="${ey}" rx="20" ry="24" fill="#0f172a" />
          <ellipse cx="${rx}" cy="${ey + 3}" rx="17" ry="18" fill="#2563eb" />
          <circle cx="${rx - 5}" cy="${ey - 5}" r="8" fill="#ffffff" />
        </g>
      `;
    }

    if (id === 'eyes-sleepy') {
      return `
        <!-- Cozy Sleepy Heavy-Lidded Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Left Sleepy Lid -->
          <path d="M ${lx - 22} ${ey - 2} Q ${lx} ${ey + 16} ${lx + 22} ${ey - 2}" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none" />
          <ellipse cx="${lx}" cy="${ey + 4}" rx="12" ry="8" fill="#3b82f6" opacity="0.6" />
          <!-- Right Sleepy Lid -->
          <path d="M ${rx - 22} ${ey - 2} Q ${rx} ${ey + 16} ${rx + 22} ${ey - 2}" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none" />
          <ellipse cx="${rx}" cy="${ey + 4}" rx="12" ry="8" fill="#3b82f6" opacity="0.6" />
        </g>
      `;
    }

    if (id === 'eyes-star') {
      return `
        <!-- Golden Star Pupil Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Left Eye -->
          <ellipse cx="${lx}" cy="${ey}" rx="21" ry="27" fill="#0f172a" stroke="${palette.shadow}" stroke-width="2" />
          <ellipse cx="${lx}" cy="${ey + 3}" rx="18" ry="21" fill="#4338ca" />
          <!-- 4-Point Star Pupil -->
          <polygon points="${lx},${ey-10} ${lx+4},${ey-2} ${lx+12},${ey} ${lx+4},${ey+2} ${lx},${ey+10} ${lx-4},${ey+2} ${lx-12},${ey} ${lx-4},${ey-2}" fill="#fde047" filter="url(#mg-soft-glow)" />
          <circle cx="${lx - 7}" cy="${ey - 8}" r="5" fill="#ffffff" />
          <!-- Right Eye -->
          <ellipse cx="${rx}" cy="${ey}" rx="21" ry="27" fill="#0f172a" stroke="${palette.shadow}" stroke-width="2" />
          <ellipse cx="${rx}" cy="${ey + 3}" rx="18" ry="21" fill="#4338ca" />
          <polygon points="${rx},${ey-10} ${rx+4},${ey-2} ${rx+12},${ey} ${rx+4},${ey+2} ${rx},${ey+10} ${rx-4},${ey+2} ${rx-12},${ey} ${rx-4},${ey-2}" fill="#fde047" filter="url(#mg-soft-glow)" />
          <circle cx="${rx - 7}" cy="${ey - 8}" r="5" fill="#ffffff" />
        </g>
      `;
    }

    if (id === 'eyes-galaxy') {
      return `
        <!-- Swirling Cosmic Galaxy Eyes -->
        <g class="eaa-monster-blink-group">
          <!-- Left Eye -->
          <ellipse cx="${lx}" cy="${ey}" rx="21" ry="27" fill="#020617" stroke="#38bdf8" stroke-width="1.5" />
          <ellipse cx="${lx}" cy="${ey + 3}" rx="18" ry="21" fill="#7c3aed" />
          <circle cx="${lx}" cy="${ey + 3}" r="12" fill="#06b6d4" opacity="0.6" filter="url(#mg-soft-glow)" />
          <circle cx="${lx - 6}" cy="${ey - 6}" r="7" fill="#ffffff" />
          <circle cx="${lx + 6}" cy="${ey + 8}" r="3" fill="#ffffff" />
          <!-- Right Eye -->
          <ellipse cx="${rx}" cy="${ey}" rx="21" ry="27" fill="#020617" stroke="#38bdf8" stroke-width="1.5" />
          <ellipse cx="${rx}" cy="${ey + 3}" rx="18" ry="21" fill="#7c3aed" />
          <circle cx="${rx}" cy="${ey + 3}" r="12" fill="#06b6d4" opacity="0.6" filter="url(#mg-soft-glow)" />
          <circle cx="${rx - 6}" cy="${ey - 6}" r="7" fill="#ffffff" />
          <circle cx="${rx + 6}" cy="${ey + 8}" r="3" fill="#ffffff" />
        </g>
      `;
    }

    // Default: Signature Anime Sparkle Eyes (Large, glossy, multi-tier highlights)
    return `
      <!-- Signature Glossy Anime Sparkle Eyes -->
      <g class="eaa-monster-blink-group">
        <!-- Soft Brow Arcs -->
        <path d="M ${lx - 20} ${ey - 28} Q ${lx} ${ey - 36} ${lx + 18} ${ey - 28}" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M ${rx - 18} ${ey - 28} Q ${rx} ${ey - 36} ${rx + 20} ${ey - 28}" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />

        <!-- Left Eye Base & Iris -->
        <ellipse cx="${lx}" cy="${ey}" rx="21" ry="27" fill="#090d16" stroke="${palette.shadow}" stroke-width="2.5" />
        <ellipse cx="${lx}" cy="${ey + 4}" rx="18" ry="21" fill="#0284c7" />
        <ellipse cx="${lx}" cy="${ey + 12}" rx="14" ry="10" fill="#38bdf8" opacity="0.85" />
        <!-- Giant Primary Glossy Highlight -->
        <ellipse cx="${lx - 6}" cy="${ey - 7}" rx="8.5" ry="11" fill="#ffffff" />
        <!-- Secondary Sparkle Reflection -->
        <circle cx="${lx + 6}" cy="${ey + 8}" r="4.2" fill="#ffffff" />

        <!-- Right Eye Base & Iris -->
        <ellipse cx="${rx}" cy="${ey}" rx="21" ry="27" fill="#090d16" stroke="${palette.shadow}" stroke-width="2.5" />
        <ellipse cx="${rx}" cy="${ey + 4}" rx="18" ry="21" fill="#0284c7" />
        <ellipse cx="${rx}" cy="${ey + 12}" rx="14" ry="10" fill="#38bdf8" opacity="0.85" />
        <!-- Giant Primary Glossy Highlight -->
        <ellipse cx="${rx - 6}" cy="${ey - 7}" rx="8.5" ry="11" fill="#ffffff" />
        <!-- Secondary Sparkle Reflection -->
        <circle cx="${rx + 6}" cy="${ey + 8}" r="4.2" fill="#ffffff" />
      </g>
    `;
  }

  // =========================================================================
  // 11. SNOUT, MOUTH & BLUSH CHEEKS (Layer 13)
  // =========================================================================
  function renderSnoutAndMouth(mouthId, palette) {
    const id = mouthId || 'mouth-smile';
    const cX = 256;
    const noseY = 216;
    const mouthY = 236;

    let mouthMarkup = '';

    if (id === 'mouth-cheer' || id === 'mouth-excited' || id === 'mouth-laughing') {
      mouthMarkup = `
        <!-- Wide Open Cheerful Grin -->
        <path d="M ${cX - 20} ${mouthY} Q ${cX} ${mouthY + 30} ${cX + 20} ${mouthY} Z" fill="#e11d48" stroke="#881337" stroke-width="3" />
        <!-- Cute White Upper Teeth -->
        <path d="M ${cX - 12} ${mouthY} Q ${cX} ${mouthY + 8} ${cX + 12} ${mouthY} Z" fill="#ffffff" />
        <!-- Pink Tongue -->
        <ellipse cx="${cX}" cy="${mouthY + 18}" rx="12" ry="8" fill="#fda4af" />
      `;
    } else if (id === 'mouth-toothy' || id === 'mouth-roar') {
      mouthMarkup = `
        <!-- Playful Dragon Roar with Little White Fangs -->
        <path d="M ${cX - 24} ${mouthY} Q ${cX} ${mouthY + 28} ${cX + 24} ${mouthY} Z" fill="#be123c" stroke="#4c0519" stroke-width="3" />
        <!-- Left & Right Baby Fangs -->
        <polygon points="${cX - 16},${mouthY} ${cX - 11},${mouthY + 10} ${cX - 6},${mouthY}" fill="#ffffff" />
        <polygon points="${cX + 6},${mouthY} ${cX + 11},${mouthY + 10} ${cX + 16},${mouthY}" fill="#ffffff" />
        <!-- Tongue -->
        <ellipse cx="${cX}" cy="${mouthY + 18}" rx="10" ry="6" fill="#f43f5e" />
      `;
    } else if (id === 'mouth-brave') {
      mouthMarkup = `
        <!-- Confident Brave Half-Smirk -->
        <path d="M ${cX - 14} ${mouthY + 3} Q ${cX} ${mouthY + 14} ${cX + 20} ${mouthY - 2}" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
      `;
    } else if (id === 'mouth-tiny') {
      mouthMarkup = `
        <!-- Minimal Sweet Smile -->
        <path d="M ${cX - 8} ${mouthY} Q ${cX} ${mouthY + 6} ${cX + 8} ${mouthY}" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
      `;
    } else if (id === 'mouth-sleepy') {
      mouthMarkup = `
        <!-- Sleepy Gentle Smile -->
        <path d="M ${cX - 12} ${mouthY - 2} Q ${cX} ${mouthY + 8} ${cX + 12} ${mouthY - 2}" fill="none" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" />
      `;
    } else {
      // Default: Sweet Cute Cat Smile (:3)
      mouthMarkup = `
        <path d="M ${cX - 18} ${mouthY} Q ${cX - 9} ${mouthY + 10} ${cX} ${mouthY + 2} Q ${cX + 9} ${mouthY + 10} ${cX + 18} ${mouthY}" fill="none" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" />
      `;
    }

    return `
      <!-- Snout Base & Rosy Blush Cheeks -->
      <g>
        <!-- Soft Blush Cheeks -->
        <ellipse cx="170" cy="226" rx="16" ry="10" fill="${palette.cheek}" opacity="0.65" filter="url(#mg-soft-glow)" />
        <ellipse cx="342" cy="226" rx="16" ry="10" fill="${palette.cheek}" opacity="0.65" filter="url(#mg-soft-glow)" />

        <!-- Adorable Button Snout & Nose -->
        <ellipse cx="${cX}" cy="${noseY}" rx="9" ry="6.5" fill="#f43f5e" stroke="#9f1239" stroke-width="1.8" />
        <!-- Nose Highlight -->
        <circle cx="${cX - 2.5}" cy="${noseY - 2}" r="2" fill="#ffffff" opacity="0.8" />
        <!-- Philtrum Line -->
        <line x1="${cX}" y1="${noseY + 6}" x2="${cX}" y2="${mouthY + 2}" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />

        <!-- Mouth Expression -->
        ${mouthMarkup}
      </g>
    `;
  }

  // =========================================================================
  // 12. FOREGROUND ACCESSORIES, HATS & GEAR (Layer 14)
  // =========================================================================
  function renderForegroundAccessories(stage, equipped, palette) {
    let hatMarkup = '';
    let glassesMarkup = '';
    let accessoryMarkup = '';

    let hatId = equipped.hat;
    if (!hatId || hatId === 'default') {
      if (stage === 'ultimate') hatId = 'hat-crown';
      else if (stage === 'adventurer') hatId = 'hat-explorer';
      else hatId = 'none';
    }

    const cX = 256;

    // --- Hats ---
    if (hatId === 'hat-crown') {
      hatMarkup = `
        <!-- Pure Gold Royal Crown with Rubies -->
        <g transform="translate(${cX}, 96)" filter="url(#mg-shadow)">
          <polygon points="-48,0 -52,-45 -24,-20 0,-55 24,-20 52,-45 48,0" fill="url(#mg-horn-gold)" stroke="#854d0e" stroke-width="3" />
          <ellipse cx="0" cy="0" rx="48" ry="10" fill="#ca8a04" stroke="#854d0e" stroke-width="2.5" />
          <!-- Jewels -->
          <circle cx="0" cy="-25" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" filter="url(#mg-soft-glow)" />
          <circle cx="-24" cy="-10" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.2" />
          <circle cx="24" cy="-10" r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.2" />
        </g>
      `;
    } else if (hatId === 'hat-explorer') {
      hatMarkup = `
        <!-- Explorer Felt Fedora Hat -->
        <g transform="translate(${cX}, 115)" filter="url(#mg-shadow)">
          <ellipse cx="0" cy="8" rx="65" ry="16" fill="#78350f" stroke="#451a03" stroke-width="2.5" />
          <path d="M -36 8 C -36 -28, 36 -28, 36 8 Z" fill="#b45309" stroke="#451a03" stroke-width="2.5" />
          <rect x="-36" y="2" width="72" height="6" fill="#451a03" />
        </g>
      `;
    } else if (hatId === 'hat-scholar') {
      hatMarkup = `
        <!-- Scholar Graduation Cap with Gold Tassel -->
        <g transform="translate(${cX}, 110)" filter="url(#mg-shadow)">
          <polygon points="0,-25 56,-8 0,8 -56,-8" fill="#1e1b4b" stroke="#0f172a" stroke-width="2.5" />
          <circle cx="0" cy="-8" r="4" fill="#facc15" />
          <path d="M 0 -8 Q 30 -5 36 20" stroke="#facc15" stroke-width="3" fill="none" />
        </g>
      `;
    } else if (hatId === 'hat-wizard') {
      hatMarkup = `
        <!-- Wizard Star Hat -->
        <g transform="translate(${cX}, 110)" filter="url(#mg-shadow)">
          <ellipse cx="0" cy="8" rx="60" ry="15" fill="#1e1b4b" stroke="#0f172a" stroke-width="2" />
          <path d="M -35 8 Q 0 -85 30 -75 Q 15 -35 35 8 Z" fill="#312e81" stroke="#0f172a" stroke-width="2.5" />
          <polygon points="12,-40 15,-34 22,-34 16,-29 18,-23 12,-27 6,-23 8,-29 2,-34 9,-34" fill="#facc15" />
        </g>
      `;
    }

    // --- Glasses ---
    const glassesId = equipped.glasses || 'none';
    if (glassesId === 'glasses-round') {
      glassesMarkup = `
        <!-- Scholarly Round Spectacles -->
        <g transform="translate(${cX}, 184)" filter="url(#mg-shadow)">
          <circle cx="-51" cy="0" r="25" fill="none" stroke="#ca8a04" stroke-width="4" />
          <circle cx="-51" cy="0" r="23" fill="#e0f2fe" opacity="0.35" />
          <circle cx="51" cy="0" r="25" fill="none" stroke="#ca8a04" stroke-width="4" />
          <circle cx="51" cy="0" r="23" fill="#e0f2fe" opacity="0.35" />
          <line x1="-26" y1="0" x2="26" y2="0" stroke="#ca8a04" stroke-width="3.5" />
        </g>
      `;
    }

    // --- Accessories ---
    const accId = equipped.accessory || 'none';
    if (accId === 'acc-wand') {
      accessoryMarkup = `
        <!-- Magic Elder Wand -->
        <g transform="translate(370, 310) rotate(-25)" filter="url(#mg-shadow)">
          <rect x="-4" y="-70" width="8" height="110" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2" />
          <polygon points="0,-82 5,-70 16,-70 8,-62 11,-51 0,-57 -11,-51 -8,-62 -16,-70 -5,-70" fill="#facc15" filter="url(#mg-soft-glow)" />
        </g>
      `;
    } else if (accId === 'acc-book') {
      accessoryMarkup = `
        <!-- Spellbook -->
        <g transform="translate(365, 335) rotate(-15)" filter="url(#mg-shadow)">
          <rect x="-24" y="-32" width="48" height="64" rx="4" fill="#831843" stroke="#4c0519" stroke-width="2.5" />
          <polygon points="0,-6 4,-1 9,-1 5,3 7,8 0,5 -7,8 -5,3 -9,-1 -4,-1" fill="#fde047" />
        </g>
      `;
    }

    return `
      ${hatMarkup ? `<g class="eaa-layer eaa-layer-hat eaa-item-${hatId}" data-layer="hat" data-item-id="${hatId}">${hatMarkup}</g>` : ''}
      ${glassesMarkup ? `<g class="eaa-layer eaa-layer-glasses eaa-item-${glassesId}" data-layer="glasses" data-item-id="${glassesId}">${glassesMarkup}</g>` : ''}
      ${accessoryMarkup ? `<g class="eaa-layer eaa-layer-accessory eaa-item-${accId}" data-layer="accessory" data-item-id="${accId}">${accessoryMarkup}</g>` : ''}
    `;
  }

  // =========================================================================
  // 13. MYSTERY EGG & CRACKING EGG (Level 1 & 2)
  // =========================================================================
  function renderEggWhole(palette, colorKey) {
    const cX = 256;

    return `
      <g filter="url(#mg-shadow)">
        <ellipse cx="${cX}" cy="430" rx="110" ry="22" fill="rgba(15, 23, 42, 0.2)" />
        <!-- Oval Egg Base -->
        <path d="M ${cX} 100 C 350 100, 370 380, ${cX} 380 C 142 380, 162 100, ${cX} 100 Z" fill="url(#mg-body-${colorKey})" stroke="${palette.shadow}" stroke-width="4" />
        <!-- Soft Warm Glow Spots -->
        <circle cx="${cX - 30}" cy="220" r="14" fill="#ffffff" opacity="0.65" />
        <circle cx="${cX + 40}" cy="280" r="18" fill="#ffffff" opacity="0.45" />
        <!-- Gentle Shimmer Dots -->
        <circle cx="210" cy="180" r="4" fill="#fef08a" filter="url(#mg-soft-glow)" />
        <circle cx="290" cy="160" r="5" fill="#fef08a" filter="url(#mg-soft-glow)" />
      </g>
    `;
  }

  function renderEggCracking(palette, colorKey) {
    const cX = 256;
    return `
      <g filter="url(#mg-shadow)">
        ${renderEggWhole(palette, colorKey)}
        <!-- Glowing Energy Fissures / Cracks -->
        <path d="M 230 140 L 256 195 L 235 240 L 275 290 L 245 340" stroke="#fef08a" stroke-width="5" fill="none" stroke-linejoin="round" filter="url(#mg-glow-strong)" />
        <path d="M 256 195 L 290 220 L 275 250" stroke="#ffffff" stroke-width="3" fill="none" stroke-linejoin="round" />
      </g>
    `;
  }

  // =========================================================================
  // 14. MAIN COMPOSITION PIPELINE (renderMonsterSVG)
  // =========================================================================
  function renderMonsterSVG(options = {}) {
    const stage = normalizeStageKey(options.stage);
    let colorKey = String(options.color || (options.equipped && options.equipped.body) || 'blue').toLowerCase().trim().replace(/^body-/, '');
    if (!MONSTER_PALETTES[colorKey]) colorKey = 'blue';
    const palette = MONSTER_PALETTES[colorKey] || MONSTER_PALETTES.blue;
    const equipped = Object.assign({}, options.equipped || {});
    const size = options.size || 200;
    const animated = options.animated !== false;

    const defs = buildDefs(colorKey, palette);

    // 1. World Background (Only if showWorld !== false and not transparent)
    let bgLayer = '';
    const showWorld = options.showWorld !== false && options.transparent !== true;
    if (showWorld) {
      bgLayer = `<g class="eaa-layer eaa-layer-world eaa-item-${equipped.background || 'bg-meadow'}" data-layer="world" data-item-id="${equipped.background || 'bg-meadow'}">${renderWorldBackground(equipped.background, stage)}</g>`;
    }

    // 2. Aura Layer
    let auraLayer = '';
    if (equipped.aura && equipped.aura !== 'none') {
      auraLayer = `<g class="eaa-layer eaa-layer-aura eaa-item-${equipped.aura}" data-layer="aura" data-item-id="${equipped.aura}">${renderAuraLayer(equipped.aura, stage, palette)}</g>`;
    }

    // Character or Egg Composition
    let characterMarkup = '';

    if (stage === 'egg') {
      characterMarkup = `<g class="eaa-layer eaa-layer-egg" data-layer="egg">${renderEggWhole(palette, colorKey)}</g>`;
    } else if (stage === 'cracking_egg') {
      characterMarkup = `<g class="eaa-layer eaa-layer-egg" data-layer="egg">${renderEggCracking(palette, colorKey)}</g>`;
    } else {
      // Living Character Assembly (Strict Layer Order)
      const wingsMarkup = renderWingsLayer(equipped.wings, stage, palette);
      const tailMarkup = renderTailLayer(equipped.tail, palette);
      const bodyMarkup = renderBodyAnatomy(stage, palette, colorKey);
      const earsMarkup = renderEars(equipped.ears, palette);
      const hornsMarkup = renderHorns(equipped.horns, stage);
      const clothingMarkup = renderClothingLayer(equipped.clothing, palette);
      const pawsMarkup = renderFrontPaws(stage, palette);
      const eyesMarkup = renderEyes(equipped.eyes, palette);
      const mouthMarkup = renderSnoutAndMouth(equipped.mouth, palette);
      const accessoriesMarkup = renderForegroundAccessories(stage, equipped, palette);

      characterMarkup = `
        <!-- 4. Wings (Behind Body) -->
        ${wingsMarkup ? `<g class="eaa-layer eaa-layer-wings eaa-item-${equipped.wings || ''}" data-layer="wings" data-item-id="${equipped.wings || ''}">${wingsMarkup}</g>` : ''}
        
        <!-- 5. Tail (Behind Body) -->
        <g class="eaa-layer eaa-layer-tail eaa-item-${equipped.tail || 'tail-puff'}" data-layer="tail" data-item-id="${equipped.tail || 'tail-puff'}">${tailMarkup}</g>

        <!-- 6 & 7. Body Anatomy & Chest Tuft -->
        <g class="eaa-layer eaa-layer-body eaa-item-${equipped.body || 'body-' + colorKey}" data-layer="body" data-item-id="${equipped.body || 'body-' + colorKey}">${bodyMarkup}</g>

        <!-- 8. Layered Ears -->
        <g class="eaa-layer eaa-layer-ears eaa-item-${equipped.ears || 'horns-ears'}" data-layer="ears" data-item-id="${equipped.ears || 'horns-ears'}">${earsMarkup}</g>

        <!-- 9. Dimensional Horns -->
        ${hornsMarkup ? `<g class="eaa-layer eaa-layer-horns eaa-item-${equipped.horns || ''}" data-layer="horns" data-item-id="${equipped.horns || ''}">${hornsMarkup}</g>` : ''}

        <!-- 10. Clothing Outfit -->
        ${clothingMarkup ? `<g class="eaa-layer eaa-layer-clothing eaa-item-${equipped.clothing || ''}" data-layer="clothing" data-item-id="${equipped.clothing || ''}">${clothingMarkup}</g>` : ''}

        <!-- 11. Front Paws -->
        <g class="eaa-layer eaa-layer-paws" data-layer="paws">${pawsMarkup}</g>

        <!-- 12. Glossy Eyes -->
        <g class="eaa-layer eaa-layer-eyes eaa-item-${equipped.eyes || 'eyes-sparkle'}" data-layer="eyes" data-item-id="${equipped.eyes || 'eyes-sparkle'}">${eyesMarkup}</g>

        <!-- 13. Snout & Mouth -->
        <g class="eaa-layer eaa-layer-mouth eaa-item-${equipped.mouth || 'mouth-smile'}" data-layer="mouth" data-item-id="${equipped.mouth || 'mouth-smile'}">${mouthMarkup}</g>

        <!-- 14. Foreground Accessories -->
        ${accessoriesMarkup}
      `;
    }

    const animClass = animated ? 'eaa-monster-animated' : '';
    const pauseClass = (animated === false || options.paused === true) ? 'is-paused' : '';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}" class="eaa-monster-svg ${animClass} ${pauseClass} ${options.className || ''}" data-stage="${stage}" data-color="${colorKey}">
        ${defs}
        ${bgLayer}
        ${auraLayer}
        <g class="eaa-monster-character-wrap eaa-monster-breathe-group" data-layer="character">
          ${characterMarkup}
        </g>
      </svg>
    `.trim();
  }

  // =========================================================================
  // 15. WRAPPER & THUMBNAIL APIS
  // =========================================================================
  function renderMonsterArtwork(options = {}) {
    const size = options.size || 160;
    const isRound = options.round !== false;
    const borderRadius = typeof options.radius === 'number' ? options.radius + 'px' : (isRound ? (size >= 100 ? '22px' : '14px') : '0px');
    const stage = options.stage || options.level || options.xp;
    const color = options.color || (options.equipped && options.equipped.body);

    const svg = renderMonsterSVG({
      stage: stage,
      color: color,
      equipped: options.equipped,
      size: size,
      animated: options.animated !== false,
      paused: options.paused === true,
      showWorld: options.showWorld !== false,
      transparent: options.transparent === true
    });

    return `
      <div class="eaa-monster-artwork-wrap ${options.animated !== false ? 'eaa-monster-artwork-anim' : ''} ${options.className || ''}" style="width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; position:relative; border-radius:${borderRadius}; overflow:hidden; ${options.style || ''}">
        ${svg}
      </div>
    `.trim();
  }

  function renderMonsterItemThumbnail(item, options = {}) {
    if (!item) return '';
    const size = options.size || 48;

    if (item.category === 'body') {
      const colKey = item.id.replace('body-', '');
      const pal = MONSTER_PALETTES[colKey] || MONSTER_PALETTES.blue;
      return `
        <svg viewBox="0 0 56 56" width="${size}" height="${size}">
          <circle cx="28" cy="28" r="22" fill="${pal.base}" stroke="${pal.dark}" stroke-width="3" />
          <ellipse cx="28" cy="34" rx="12" ry="8" fill="#ffffff" opacity="0.6" />
        </svg>
      `.trim();
    }

    return `
      <svg viewBox="0 0 56 56" width="${size}" height="${size}">
        <rect width="56" height="56" rx="10" fill="#f8fafc" />
        <text x="28" y="34" font-size="26" text-anchor="middle" dominant-baseline="middle">${item.icon || '✨'}</text>
      </svg>
    `.trim();
  }

  function getMonsterForEvolution(levelOrKeyOrXP) {
    if (typeof levelOrKeyOrXP === 'number') {
      if (levelOrKeyOrXP >= 1 && levelOrKeyOrXP <= 7) {
        return EVOLUTION_STAGES.find(s => s.level === levelOrKeyOrXP) || EVOLUTION_STAGES[2];
      }
      let match = EVOLUTION_STAGES[0];
      for (let i = 0; i < EVOLUTION_STAGES.length; i++) {
        if (levelOrKeyOrXP >= EVOLUTION_STAGES[i].xpRequired) {
          match = EVOLUTION_STAGES[i];
        } else {
          break;
        }
      }
      return match;
    }
    const key = normalizeStageKey(levelOrKeyOrXP);
    return EVOLUTION_STAGES.find(s => s.stageKey === key) || EVOLUTION_STAGES[2];
  }

  function getMonsterStageImage(stageKey) {
    const evo = getMonsterForEvolution(stageKey);
    return evo.image || STAGE_IMAGES.baby;
  }

  function renderMonsterEvolutionStagesBanner() {
    const stages = EVOLUTION_STAGES;
    return `
      <div class="monster-evolution-upgrade-banner" style="background:linear-gradient(180deg, #071328 0%, #0c1e3d 100%); border-radius:20px; padding:24px; color:#fff; box-shadow:0 12px 36px rgba(0,0,0,0.4); margin-bottom:24px; border:1px solid rgba(56,189,248,0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.4rem;">👾</span>
              <h2 style="font-size:1.35rem; font-weight:900; margin:0; letter-spacing:0.02em; color:#fff;">Monster Evolution Upgrade (Visual Progression)</h2>
            </div>
            <p style="font-size:0.84rem; color:#94a3b8; margin:4px 0 0 0;">A real visual evolution, not just accessories. Monsters grow and change as students earn XP!</p>
          </div>
          <div style="font-size:0.75rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
            Same Spirit • Greater Growth • More Adventures • A Brighter You!
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; align-items:stretch;">
          ${stages.map((st, idx) => `
            <div class="evolution-stage-card-premium" style="background:rgba(15,23,42,0.85); border:1.5px solid ${idx === 6 ? '#f59e0b' : 'rgba(56,189,248,0.3)'}; border-radius:14px; padding:12px 10px; display:flex; flex-direction:column; align-items:center; text-align:center; transition:transform 0.2s ease, box-shadow 0.2s ease; position:relative;">
              <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:2px;">Level ${st.level}</div>
              <div style="font-size:0.82rem; font-weight:900; color:#f8fafc; margin-bottom:8px; line-height:1.2;">${st.name}</div>
              
              <div style="width:100%; aspect-ratio:1; border-radius:10px; overflow:hidden; margin-bottom:8px; background:#020617; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 2px 8px rgba(0,0,0,0.6);">
                <img src="${getMonsterStageImage(st.stageKey)}" alt="${st.name}" style="width:100%; height:100%; object-fit:cover; display:block;" />
              </div>

              <div style="font-size:0.78rem; font-weight:900; color:#fbbf24; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:12px; margin-bottom:6px; width:90%;">
                ${st.xpRequired.toLocaleString()} XP
              </div>
              <div style="font-size:0.68rem; color:#cbd5e1; line-height:1.3; font-style:italic;">
                "${st.subtitle}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `.trim();
  }

  function getStageInfo(stageKey) {
    return getMonsterForEvolution(stageKey);
  }

  const MonsterEvolutionRenderer = {
    getMonsterForEvolution: getMonsterForEvolution,
    getMonsterStageImage: getMonsterStageImage,
    renderMonsterArtwork: renderMonsterArtwork,
    renderMonsterEvolutionStagesBanner: renderMonsterEvolutionStagesBanner,
    renderMonsterSVG: renderMonsterSVG,
    renderModularMonsterSVG: renderMonsterSVG,
    renderMonsterItemThumbnail: renderMonsterItemThumbnail,
    getStageInfo: getStageInfo,
    palettes: MONSTER_PALETTES,
    stages: STAGE_META,
    EVOLUTION_STAGES: EVOLUTION_STAGES
  };

  root.MonsterEvolutionRenderer = MonsterEvolutionRenderer;
  root.MonsterRenderer = MonsterEvolutionRenderer;
  root.getMonsterForEvolution = getMonsterForEvolution;
  root.renderMonsterSVG = renderMonsterSVG;
  root.renderModularMonsterSVG = renderMonsterSVG;
  root.renderMonsterItemThumbnail = renderMonsterItemThumbnail;
  root.getStageInfo = getStageInfo;
  root.getMonsterStageImage = getMonsterStageImage;
  root.renderMonsterArtwork = renderMonsterArtwork;
  root.renderMonsterEvolutionStagesBanner = renderMonsterEvolutionStagesBanner;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterEvolutionRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
