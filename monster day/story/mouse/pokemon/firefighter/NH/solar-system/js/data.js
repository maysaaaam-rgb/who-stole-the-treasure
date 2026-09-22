/**
 * SOLAR SYSTEM EXPLORER: PLANETARY COMPARATIVES LAB — CURRICULUM & ASSET DATA
 * CEFR A1-A2 | Comparative Adjectives (X is bigger / colder / farther than Y)
 * Zero external dependencies.
 */
(function(root) {
  'use strict';

  // Helper to generate full-bleed (65% card height) celestial hero art on 3D isometric space pedestals
  function getPlanetHeroSvg(planetKey, c1, c2, emoji, ringColor = null, pedestalColor = '#38bdf8') {
    const hasRing = Boolean(ringColor);
    return `<svg viewBox="0 0 280 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedestal-${planetKey}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${pedestalColor}" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="${pedestalColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="skyGlow-${planetKey}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${c1}" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#070a14" stop-opacity="0.98"/>
        </radialGradient>
        <filter id="planetGlow-${planetKey}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${pedestalColor}" flood-opacity="0.65"/>
        </filter>
      </defs>
      
      <!-- Deep Cosmic Backdrop -->
      <rect width="280" height="240" fill="url(#skyGlow-${planetKey})"/>
      
      <!-- Distant Twinkling Stars -->
      <circle cx="28" cy="35" r="1.5" fill="#ffffff" opacity="0.9"/>
      <circle cx="75" cy="20" r="1" fill="#ffffff" opacity="0.6"/>
      <circle cx="210" cy="45" r="2" fill="#facc15" opacity="0.8"/>
      <circle cx="250" cy="80" r="1.5" fill="#38bdf8" opacity="0.7"/>
      <circle cx="40" cy="110" r="1" fill="#ffffff" opacity="0.5"/>
      <circle cx="235" cy="25" r="2.5" fill="#ffffff" opacity="0.85"/>
      <circle cx="120" cy="40" r="1.2" fill="#fbbf24" opacity="0.75"/>

      <!-- Orbit Path Contour -->
      <ellipse cx="140" cy="180" rx="110" ry="28" fill="none" stroke="${pedestalColor}" stroke-width="1.2" stroke-dasharray="5,4" opacity="0.5"/>
      
      <!-- 3D Isometric Holographic Pedestal -->
      <ellipse cx="140" cy="185" rx="96" ry="30" fill="url(#pedestal-${planetKey})"/>
      <ellipse cx="140" cy="180" rx="80" ry="22" fill="#090d16" stroke="${pedestalColor}" stroke-width="2.5" opacity="0.95"/>
      
      <!-- Planetary Ring (if applicable) Back -->
      ${hasRing ? `<ellipse cx="140" cy="125" rx="72" ry="18" fill="none" stroke="${ringColor}" stroke-width="6" opacity="0.75" transform="rotate(-18 140 125)"/>` : ''}

      <!-- Floating Hero Planet Body with Breathing Hover -->
      <g transform="translate(140, 125)" filter="url(#planetGlow-${planetKey})">
        <circle cx="0" cy="0" r="48" fill="${c1}" stroke="${c2}" stroke-width="3"/>
        <text x="0" y="6" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text>
      </g>

      <!-- Planetary Ring (if applicable) Front -->
      ${hasRing ? `<path d="M 72 136 A 72 18 0 0 0 208 114" fill="none" stroke="${ringColor}" stroke-width="6" opacity="0.95" transform="rotate(-18 140 125)"/>` : ''}

      <!-- Holographic Coordinates Ring -->
      <ellipse cx="140" cy="180" rx="55" ry="14" fill="none" stroke="${pedestalColor}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.8"/>
    </svg>`;
  }

  const SOLAR_DATA = {
    meta: {
      id: "solar-system",
      title: "🪐 Solar System Explorer: Planetary Comparatives Lab",
      subtitle: "Discover Worlds • Master Comparative Adjectives • Broadcast from the Space Station",
      cefrLevel: "A1–A2",
      targetAge: "8–11",
      totalXP: 150,
      grammarFormula: {
        shortAdj: "Planet A + is + [adjective + -er] + than + Planet B (e.g., Jupiter is bigger than Mars)",
        longAdj: "Planet A + is + more [adjective] + than + Planet B (e.g., Venus is more massive than Mercury)"
      },
      targetVocabulary: [
        "orbit", "planet", "gravity", "crater", "atmosphere", "solar", "asteroid", "satellite"
      ]
    },

    // Phase 1: 3D Discovery Scanner (5 Core Celestial Trading Cards)
    scannerPlanets: [
      {
        id: "planet-mercury",
        name: "Mercury",
        emoji: "🪨",
        tagline: "The Sun's Swift Neighbor",
        badge: "Swift Orbit Badge",
        diameter: "4,879 km",
        temp: "430°C / -180°C",
        distanceRank: "1st from Sun",
        keyFact: "Mercury is smaller than Earth and closer to the Sun than any other planet.",
        speechPhrase: "Mercury! Mercury is smaller than Earth and closer to the Sun than any other planet.",
        svg: getPlanetHeroSvg("mercury", "#94a3b8", "#475569", "🪨", null, "#cbd5e1")
      },
      {
        id: "planet-venus",
        name: "Venus",
        emoji: "🔥",
        tagline: "The Greenhouse Furnace",
        badge: "Inferno Atmosphere Badge",
        diameter: "12,104 km",
        temp: "465°C",
        distanceRank: "2nd from Sun",
        keyFact: "Venus is hotter than Mercury because of its thick, heavy atmosphere.",
        speechPhrase: "Venus! Venus is hotter than Mercury because of its thick, heavy greenhouse atmosphere.",
        svg: getPlanetHeroSvg("venus", "#f97316", "#9a3412", "🔥", null, "#fb923c")
      },
      {
        id: "planet-earth",
        name: "Earth",
        emoji: "🌍",
        tagline: "The Oasis of Life",
        badge: "Living Ocean Badge",
        diameter: "12,742 km",
        temp: "15°C (Average)",
        distanceRank: "3rd from Sun",
        keyFact: "Earth is denser than Saturn and wetter than all rocky planets.",
        speechPhrase: "Earth! Earth is denser than Saturn and wetter than all other rocky planets.",
        svg: getPlanetHeroSvg("earth", "#0284c7", "#0369a1", "🌍", null, "#38bdf8")
      },
      {
        id: "planet-mars",
        name: "Mars",
        emoji: "🔴",
        tagline: "The Rust-Red Explorer",
        badge: "Red Dust Pioneer Badge",
        diameter: "6,779 km",
        temp: "-60°C",
        distanceRank: "4th from Sun",
        keyFact: "Mars is colder than Earth and farther from the Sun than Venus.",
        speechPhrase: "Mars! Mars is colder than Earth and farther from the Sun than Venus.",
        svg: getPlanetHeroSvg("mars", "#ef4444", "#991b1b", "🔴", null, "#f87171")
      },
      {
        id: "planet-jupiter",
        name: "Jupiter",
        emoji: "🌀",
        tagline: "The Giant Storm Sovereign",
        badge: "Titan Gravity Badge",
        diameter: "139,820 km",
        temp: "-110°C",
        distanceRank: "5th from Sun",
        keyFact: "Jupiter is much bigger than Earth and has stronger gravity than all planets.",
        speechPhrase: "Jupiter! Jupiter is much bigger than Earth and has stronger gravity than all other planets.",
        svg: getPlanetHeroSvg("jupiter", "#d97706", "#78350f", "🌀", "#fcd34d", "#fbbf24")
      }
    ],

    // Phase 2: Arena Showdown Challenges (12 Dynamic Comparative Adjective Rounds)
    showdownChallenges: [
      {
        id: "showdown-1",
        statement: "Jupiter is bigger than Mars.",
        planetA: "Jupiter",
        planetB: "Mars",
        comparative: "bigger than",
        isTrue: true,
        explanation: "Jupiter is the biggest planet in the solar system! It is much bigger than Mars.",
        hint: "Look at the sizes: Jupiter is a giant gas world, while Mars is small and rocky.",
        xp: 15,
        svg: getPlanetHeroSvg("s1-jup", "#d97706", "#78350f", "🪐", "#fcd34d", "#fbbf24")
      },
      {
        id: "showdown-2",
        statement: "Mercury is farther from the Sun than Neptune.",
        planetA: "Mercury",
        planetB: "Neptune",
        comparative: "farther than",
        isTrue: false,
        explanation: "False! Mercury is the closest planet to the Sun. Neptune is much farther away!",
        hint: "Mercury is the 1st planet from the Sun, so it is CLOSER, not farther.",
        xp: 15,
        svg: getPlanetHeroSvg("s2-merc", "#94a3b8", "#475569", "🪨", null, "#cbd5e1")
      },
      {
        id: "showdown-3",
        statement: "Venus is hotter than Earth.",
        planetA: "Venus",
        planetB: "Earth",
        comparative: "hotter than",
        isTrue: true,
        explanation: "True! Venus has a runaway greenhouse effect and reaches a blazing 465°C!",
        hint: "Venus traps heat in thick clouds, making it hotter than any other planet.",
        xp: 15,
        svg: getPlanetHeroSvg("s3-ven", "#f97316", "#9a3412", "🔥", null, "#fb923c")
      },
      {
        id: "showdown-4",
        statement: "Earth is smaller than Mercury.",
        planetA: "Earth",
        planetB: "Mercury",
        comparative: "smaller than",
        isTrue: false,
        explanation: "False! Earth is 12,742 km wide, whereas Mercury is only 4,879 km. Earth is bigger!",
        hint: "Mercury is the smallest rocky planet. Earth is larger than Mercury.",
        xp: 15,
        svg: getPlanetHeroSvg("s4-ear", "#0284c7", "#0369a1", "🌍", null, "#38bdf8")
      },
      {
        id: "showdown-5",
        statement: "Mars is colder than Earth.",
        planetA: "Mars",
        planetB: "Earth",
        comparative: "colder than",
        isTrue: true,
        explanation: "True! Mars averages -60°C because it is farther from the Sun with a thin atmosphere.",
        hint: "Mars is farther from the Sun's warm rays, so temperatures drop far below freezing.",
        xp: 15,
        svg: getPlanetHeroSvg("s5-mar", "#ef4444", "#991b1b", "🔴", null, "#f87171")
      },
      {
        id: "showdown-6",
        statement: "Saturn is more massive than Jupiter.",
        planetA: "Saturn",
        planetB: "Jupiter",
        comparative: "more massive than",
        isTrue: false,
        explanation: "False! Jupiter is the most massive planet. It is more than three times heavier than Saturn.",
        hint: "Jupiter holds the record for maximum planetary mass in our solar system.",
        xp: 15,
        svg: getPlanetHeroSvg("s6-sat", "#eab308", "#854d0e", "🪐", "#fef08a", "#fde047")
      },
      {
        id: "showdown-7",
        statement: "Mercury is closer to the Sun than Venus.",
        planetA: "Mercury",
        planetB: "Venus",
        comparative: "closer than",
        isTrue: true,
        explanation: "True! Mercury orbits at 58 million km, while Venus orbits at 108 million km.",
        hint: "Order of planets: Mercury (1st), Venus (2nd), Earth (3rd), Mars (4th).",
        xp: 15,
        svg: getPlanetHeroSvg("s7-merc", "#94a3b8", "#475569", "☀️", null, "#cbd5e1")
      },
      {
        id: "showdown-8",
        statement: "Jupiter is smaller than Earth.",
        planetA: "Jupiter",
        planetB: "Earth",
        comparative: "smaller than",
        isTrue: false,
        explanation: "False! You could fit over 1,300 Earths inside Jupiter! Jupiter is much bigger.",
        hint: "Jupiter is the colossal King of Planets.",
        xp: 15,
        svg: getPlanetHeroSvg("s8-jup", "#d97706", "#78350f", "🌀", "#fcd34d", "#fbbf24")
      },
      {
        id: "showdown-9",
        statement: "Venus is brighter in the night sky than Mars.",
        planetA: "Venus",
        planetB: "Mars",
        comparative: "brighter than",
        isTrue: true,
        explanation: "True! Venus reflects 70% of sunlight from its clouds, shining brighter than Mars.",
        hint: "Venus is often called the 'Morning Star' because of its blinding white reflection.",
        xp: 15,
        svg: getPlanetHeroSvg("s9-ven", "#f97316", "#9a3412", "✨", null, "#fb923c")
      },
      {
        id: "showdown-10",
        statement: "Neptune is warmer than Mercury.",
        planetA: "Neptune",
        planetB: "Mercury",
        comparative: "warmer than",
        isTrue: false,
        explanation: "False! Neptune is an ice giant at the edge of the solar system (-214°C). It is much colder.",
        hint: "Neptune is billions of kilometers away from the Sun.",
        xp: 15,
        svg: getPlanetHeroSvg("s10-nep", "#3b82f6", "#1d4ed8", "🧊", null, "#60a5fa")
      },
      {
        id: "showdown-11",
        statement: "Earth has stronger gravity than the Moon.",
        planetA: "Earth",
        planetB: "Moon",
        comparative: "stronger than",
        isTrue: true,
        explanation: "True! Earth has six times more gravity than the Moon because it is much more massive.",
        hint: "Astronauts can jump six times higher on the Moon because Earth's pull is stronger.",
        xp: 15,
        svg: getPlanetHeroSvg("s11-ear", "#0284c7", "#0369a1", "🚀", null, "#38bdf8")
      },
      {
        id: "showdown-12",
        statement: "Mars is closer to the asteroid belt than Venus.",
        planetA: "Mars",
        planetB: "Venus",
        comparative: "closer than",
        isTrue: true,
        explanation: "True! The asteroid belt lies right between the orbits of Mars and Jupiter.",
        hint: "Mars is right on the inner edge of the great asteroid belt.",
        xp: 15,
        svg: getPlanetHeroSvg("s12-mar", "#ef4444", "#991b1b", "☄️", null, "#f87171")
      }
    ],

    // Phase 3: Live Teleprompter Studio (Strict 3-Sentence Speaking Scaffolds)
    teleprompterArchetypes: [
      {
        id: "cadet-jup",
        title: "Commander Orion: Jupiter Mission Report",
        badge: "Titan Orbit Command",
        icon: "🪐",
        sentence1: "Welcome to our orbital deep space observatory.",
        sentence2: "Jupiter is much bigger than Earth and has stronger gravity than any world.",
        sentence3: "Our robotic probe discovered sixty-four moons orbiting this giant storm planet!",
        svg: getPlanetHeroSvg("tp-jup", "#d97706", "#78350f", "🪐", "#fcd34d", "#fbbf24")
      },
      {
        id: "cadet-ven",
        title: "Explorer Nova: Venus Atmospheric Scan",
        badge: "Thermal Shield Certified",
        icon: "🔥",
        sentence1: "Greetings from the Venus research space station.",
        sentence2: "Venus is hotter than Mercury because its thick greenhouse clouds trap solar heat.",
        sentence3: "Our titanium rover landed safely on the scorching volcanic surface yesterday!",
        svg: getPlanetHeroSvg("tp-ven", "#f97316", "#9a3412", "🔥", null, "#fb923c")
      },
      {
        id: "cadet-mar",
        title: "Captain Ares: Mars Red Colony Dispatch",
        badge: "Dust Dune Navigator",
        icon: "🔴",
        sentence1: "Reporting live from the Olympus Mons base camp.",
        sentence2: "Mars is colder than Earth and farther from the Sun than our home planet.",
        sentence3: "We excavated ancient red soil to search for ice and signs of past water!",
        svg: getPlanetHeroSvg("tp-mar", "#ef4444", "#991b1b", "🔴", null, "#f87171")
      },
      {
        id: "cadet-merc",
        title: "Cadet Swift: Mercury Solar Flyby",
        badge: "Solar Speed Ace",
        icon: "🪨",
        sentence1: "Welcome to our close solar flyby mission.",
        sentence2: "Mercury is smaller than Earth and travels faster along its orbit than any planet.",
        sentence3: "Our satellite photographed deep rocky craters created by prehistoric asteroid impacts!",
        svg: getPlanetHeroSvg("tp-merc", "#94a3b8", "#475569", "🪨", null, "#cbd5e1")
      },
      {
        id: "cadet-ear",
        title: "Commander Terra: Earth Blue Marble Log",
        badge: "Master Earth Steward",
        icon: "🌍",
        sentence1: "Welcome to the International Space Station cupola.",
        sentence2: "Earth is denser than Saturn and has a better protective atmosphere than Mars.",
        sentence3: "We observed sparkling blue oceans that support millions of thriving species!",
        svg: getPlanetHeroSvg("tp-ear", "#0284c7", "#0369a1", "🌍", null, "#38bdf8")
      }
    ]
  };

  root.SOLAR_DATA = SOLAR_DATA;
})(typeof window !== 'undefined' ? window : global);
