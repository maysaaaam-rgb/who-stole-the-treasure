/**
 * DINO ARENA: TOP TRUMPS PALEONTOLOGY CLASH — CURRICULUM & ASSET DATA
 * Primary ESL / CLIL CEFR A1+-A2 | Comparative Adjectives & Adaptations
 * Zero external runtime dependencies. Resilient offline SVG fallbacks.
 */
(function(root) {
  'use strict';

  // Procedural SVG generator for resilient offline 65% hero artwork on 3D isometric pedestals
  function getDinoHeroSvg(id, emoji, c1, c2, pedestalColor = '#38bdf8') {
    return `<svg viewBox="0 0 280 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedestal-${id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${pedestalColor}" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="${pedestalColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="skyGlow-${id}" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${c1}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0a0f1d" stop-opacity="0.98"/>
        </radialGradient>
        <filter id="dinoGlow-${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${pedestalColor}" flood-opacity="0.6"/>
        </filter>
      </defs>
      
      <!-- Prehistoric Arena Backdrop -->
      <rect width="280" height="240" fill="url(#skyGlow-${id})"/>
      
      <!-- Prehistoric Canyon / Volcanic Silhouettes -->
      <polygon points="10,210 50,130 90,210" fill="#080c18" opacity="0.7"/>
      <polygon points="70,210 130,105 190,210" fill="#080c18" opacity="0.85"/>
      <polygon points="170,210 220,135 270,210" fill="#080c18" opacity="0.7"/>

      <!-- Ambient Ancient Amber Sparks -->
      <circle cx="35" cy="45" r="2.5" fill="#facc15" opacity="0.85"/>
      <circle cx="245" cy="50" r="3" fill="#facc15" opacity="0.75"/>
      <circle cx="195" cy="25" r="2" fill="#38bdf8" opacity="0.8"/>
      
      <!-- 3D Isometric Grounding Platform -->
      <ellipse cx="140" cy="188" rx="98" ry="30" fill="url(#pedestal-${id})"/>
      <ellipse cx="140" cy="182" rx="82" ry="22" fill="#0b1222" stroke="${pedestalColor}" stroke-width="2.5" opacity="0.95"/>
      
      <!-- Floating Hero Dinosaur Character with Breathing Hover -->
      <g transform="translate(140, 130)" filter="url(#dinoGlow-${id})">
        <circle cx="0" cy="0" r="46" fill="${c1}" stroke="${c2}" stroke-width="3" opacity="0.4"/>
        <text x="0" y="8" font-size="64" text-anchor="middle" dominant-baseline="central">${emoji}</text>
      </g>

      <!-- Prehistoric Hologram Energy Ring -->
      <ellipse cx="140" cy="182" rx="58" ry="15" fill="none" stroke="${pedestalColor}" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.8"/>
    </svg>`;
  }

  const DINO_DATA = [
    {
      id: "trex",
      name: "Tyrannosaurus Rex",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#ef4444",
      lengthMeters: 12,
      weightKg: 8000,
      speedKmh: 27,
      armorRating: 3,
      weapon: "Bone-Crushing Jaws",
      weaponDesc: "Huge 20cm teeth that can crush bones!",
      img: "https://images.unsplash.com/photo-1570483305545-212239f15970?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🦖",
      pedestalColor: "#ef4444",
      svg: getDinoHeroSvg("trex", "🦖", "#ef4444", "#7f1d1d", "#f87171"),
      hotspots: [
        { label: "Diet", text: "Carnivore: Hunts large prey with powerful senses.", phrase: "T-Rex is a carnivore and eats meat!" },
        { label: "Weapon", text: "Bone-Crushing Jaws with 20-centimeter teeth!", phrase: "T-Rex has twenty-centimeter sharp teeth to crush bones!" },
        { label: "Speed", text: "Runs up to 27 km/h across river valleys.", phrase: "T-Rex can run at twenty-seven kilometers per hour!" },
        { label: "Armor", text: "Tough scaly hide with rating 3 out of 10.", phrase: "T-Rex has light armor but relies on massive bite force!" }
      ]
    },
    {
      id: "raptor",
      name: "Velociraptor",
      period: "Late Cretaceous",
      diet: "Carnivore",
      dietIcon: "🥩",
      dietColor: "#ef4444",
      lengthMeters: 2,
      weightKg: 15,
      speedKmh: 60,
      armorRating: 1,
      weapon: "Sickle Claws",
      weaponDesc: "Curved foot claws designed for swift jumping attacks!",
      img: "https://images.unsplash.com/photo-1525877442103-5dd52293b01a?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🦅",
      pedestalColor: "#fbbf24",
      svg: getDinoHeroSvg("raptor", "⚡", "#f59e0b", "#78350f", "#fbbf24"),
      hotspots: [
        { label: "Diet", text: "Carnivore: Agile pack hunter targeting small dinosaurs.", phrase: "Velociraptor is a swift carnivore!" },
        { label: "Weapon", text: "Retractable sickle claw on each hind foot!", phrase: "Velociraptor has sharp sickle claws for jumping attacks!" },
        { label: "Speed", text: "Lightning speed: 60 km/h sprint!", phrase: "Velociraptor runs at sixty kilometers per hour!" },
        { label: "Armor", text: "Light agile feathers with rating 1 out of 10.", phrase: "Velociraptor relies on speed instead of heavy armor!" }
      ]
    },
    {
      id: "triceratops",
      name: "Triceratops",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthMeters: 9,
      weightKg: 6000,
      speedKmh: 32,
      armorRating: 8,
      weapon: "Triple Horn Shield",
      weaponDesc: "Three sharp solid horns and a heavy neck frill for protection!",
      img: "https://images.unsplash.com/photo-1569793666249-14197ec489d8?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🦏",
      pedestalColor: "#10b981",
      svg: getDinoHeroSvg("triceratops", "🦕", "#10b981", "#064e3b", "#34d399"),
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on tough palms and cycad shrubs.", phrase: "Triceratops is a peaceful herbivore!" },
        { label: "Weapon", text: "3 solid horns up to 1 meter long!", phrase: "Triceratops has three hard horns to fight predators!" },
        { label: "Speed", text: "Charges at 32 km/h when threatened.", phrase: "Triceratops charges at thirty-two kilometers per hour!" },
        { label: "Armor", text: "Massive solid bone frill with rating 8 out of 10.", phrase: "Triceratops has a heavy bone frill to shield its neck!" }
      ]
    },
    {
      id: "brachiosaurus",
      name: "Brachiosaurus",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthMeters: 26,
      weightKg: 40000,
      speedKmh: 15,
      armorRating: 4,
      weapon: "Colossal Stomp",
      weaponDesc: "Gigantic height and tree-trunk legs reaching tallest trees!",
      img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🦒",
      pedestalColor: "#06b6d4",
      svg: getDinoHeroSvg("brachiosaurus", "🌿", "#0284c7", "#0c4a6e", "#38bdf8"),
      hotspots: [
        { label: "Diet", text: "Herbivore: Consumes 400 kilograms of leaves daily.", phrase: "Brachiosaurus eats leafy treetops all day!" },
        { label: "Weapon", text: "Massive stomping feet and towering height.", phrase: "Brachiosaurus uses colossal size to deter carnivores!" },
        { label: "Speed", text: "Slow steady pace of 15 km/h.", phrase: "Brachiosaurus walks steadily at fifteen kilometers per hour!" },
        { label: "Armor", text: "Colossal body mass acting as natural defense (Rating 4).", phrase: "Brachiosaurus is forty tons of pure living mountain!" }
      ]
    },
    {
      id: "ankylosaurus",
      name: "Ankylosaurus",
      period: "Late Cretaceous",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthMeters: 8,
      weightKg: 6000,
      speedKmh: 10,
      armorRating: 10,
      weapon: "Heavy Tail Club",
      weaponDesc: "Thick bone armor plates and a heavy stone tail club!",
      img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🛡️",
      pedestalColor: "#8b5cf6",
      svg: getDinoHeroSvg("ankylosaurus", "🛡️", "#8b5cf6", "#4c1d95", "#c084fc"),
      hotspots: [
        { label: "Diet", text: "Herbivore: Low browser feeding on ferns and roots.", phrase: "Ankylosaurus feeds on low ferns and shrubs!" },
        { label: "Weapon", text: "Massive bone club at the end of its flexible tail!", phrase: "Ankylosaurus has a heavy tail club to shatter enemy bones!" },
        { label: "Speed", text: "Slow moving tank at 10 km/h.", phrase: "Ankylosaurus marches slowly at ten kilometers per hour!" },
        { label: "Armor", text: "Impenetrable fused armor plates (Rating 10 out of 10).", phrase: "Ankylosaurus has maximum bone armor plates!" }
      ]
    },
    {
      id: "stegosaurus",
      name: "Stegosaurus",
      period: "Late Jurassic",
      diet: "Herbivore",
      dietIcon: "🌿",
      dietColor: "#10b981",
      lengthMeters: 9,
      weightKg: 5000,
      speedKmh: 18,
      armorRating: 7,
      weapon: "Spiked Thagomizer",
      weaponDesc: "Four sharp tail spikes and dorsal plates along its spine!",
      img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "🐊",
      pedestalColor: "#eab308",
      svg: getDinoHeroSvg("stegosaurus", "🗡️", "#d97706", "#78350f", "#fde047"),
      hotspots: [
        { label: "Diet", text: "Herbivore: Grazes on ground ferns, mosses, and horsetails.", phrase: "Stegosaurus eats low Jurassic ferns!" },
        { label: "Weapon", text: "Four 60-centimeter tail spikes called the Thagomizer!", phrase: "Stegosaurus swings four sharp tail spikes!" },
        { label: "Speed", text: "Trots at 18 km/h.", phrase: "Stegosaurus moves at eighteen kilometers per hour!" },
        { label: "Armor", text: "17 upright bony plates along its back (Rating 7).", phrase: "Stegosaurus has seventeen upright bony plates for protection!" }
      ]
    }
  ];

  // Phase 2: Dino Clash 1v1 Battle Rounds
  const BATTLE_ROUNDS = [
    {
      id: "clash-1",
      dino1: "raptor",
      dino2: "trex",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "raptor",
      comparativeFrame: "Velociraptor is faster than Tyrannosaurus Rex!",
      statComparison: "Velociraptor (60 km/h) vs T-Rex (27 km/h)"
    },
    {
      id: "clash-2",
      dino1: "brachiosaurus",
      dino2: "stegosaurus",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is heavier than Stegosaurus!",
      statComparison: "Brachiosaurus (40,000 kg) vs Stegosaurus (5,000 kg)"
    },
    {
      id: "clash-3",
      dino1: "ankylosaurus",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER!",
      winnerId: "ankylosaurus",
      comparativeFrame: "Ankylosaurus has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Ankylosaurus (Armor 10) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-4",
      dino1: "brachiosaurus",
      dino2: "triceratops",
      statKey: "lengthMeters",
      question: "Who is LONGER?",
      stampText: "LONGER!",
      winnerId: "brachiosaurus",
      comparativeFrame: "Brachiosaurus is longer than Triceratops!",
      statComparison: "Brachiosaurus (26 m) vs Triceratops (9 m)"
    },
    {
      id: "clash-5",
      dino1: "triceratops",
      dino2: "raptor",
      statKey: "weightKg",
      question: "Who is HEAVIER?",
      stampText: "HEAVIER!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops is heavier than Velociraptor!",
      statComparison: "Triceratops (6,000 kg) vs Velociraptor (15 kg)"
    },
    {
      id: "clash-6",
      dino1: "stegosaurus",
      dino2: "ankylosaurus",
      statKey: "speedKmh",
      question: "Who is FASTER?",
      stampText: "FASTER!",
      winnerId: "stegosaurus",
      comparativeFrame: "Stegosaurus is faster than Ankylosaurus!",
      statComparison: "Stegosaurus (18 km/h) vs Ankylosaurus (10 km/h)"
    },
    {
      id: "clash-7",
      dino1: "triceratops",
      dino2: "trex",
      statKey: "armorRating",
      question: "Who has STRONGER ARMOR?",
      stampText: "STRONGER!",
      winnerId: "triceratops",
      comparativeFrame: "Triceratops has stronger armor than Tyrannosaurus Rex!",
      statComparison: "Triceratops (Armor 8) vs T-Rex (Armor 3)"
    },
    {
      id: "clash-8",
      dino1: "trex",
      dino2: "raptor",
      statKey: "lengthMeters",
      question: "Who is BIGGER & LONGER?",
      stampText: "BIGGER!",
      winnerId: "trex",
      comparativeFrame: "Tyrannosaurus Rex is bigger than Velociraptor!",
      statComparison: "T-Rex (12 m) vs Velociraptor (2 m)"
    }
  ];

  // Phase 3: Teleprompter Broadcast Templates
  const TELEPROMPTER_ARCHETYPES = [
    {
      dinoId: "trex",
      title: "Apex Predator Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the mighty Tyrannosaurus Rex.",
      sentence2: "It is bigger and heavier than the agile Velociraptor.",
      sentence3: "It is a ferocious carnivore and it has bone-crushing jaws to hunt large prey!"
    },
    {
      dinoId: "triceratops",
      title: "Horned Guardian Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the armored Triceratops.",
      sentence2: "It is heavier and has stronger armor than the ferocious T-Rex.",
      sentence3: "It is a peaceful herbivore and it has three sharp horns to protect itself!"
    },
    {
      dinoId: "raptor",
      title: "Speed Striker Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the lightning-fast Velociraptor.",
      sentence2: "It is much faster and more agile than the heavy Tyrannosaurus Rex.",
      sentence3: "It is a clever carnivore and it has sharp sickle claws to leap and hunt!"
    },
    {
      dinoId: "ankylosaurus",
      title: "Armored Tank Arena Broadcast",
      sentence1: "Welcome to Dino Arena! This is the fortress-like Ankylosaurus.",
      sentence2: "It has stronger armor and a heavier tail than the Stegosaurus.",
      sentence3: "It is an armored herbivore and it has a heavy stone tail club to defend its herd!"
    }
  ];

  root.DINO_ARENA_DATA = {
    dinosaurs: DINO_DATA,
    battles: BATTLE_ROUNDS,
    teleprompter: TELEPROMPTER_ARCHETYPES
  };
})(typeof window !== 'undefined' ? window : global);
