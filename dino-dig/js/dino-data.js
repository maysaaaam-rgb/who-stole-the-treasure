/**
 * DINO DIG: PREHISTORIC PAST TENSE LAB — CURRICULUM & ASSET DATA
 * CEFR A1-A2 | Regular (-ed) vs. Irregular Past Simple Verbs
 * Zero external dependencies.
 */
(function(root) {
  'use strict';

  // Helper to generate full-bleed (65% card height) hero dinosaur art on isometric pedestals
  function getDinoHeroSvg(archetype, color1, color2, emoji, pedestalColor = '#38bdf8') {
    return `<svg viewBox="0 0 280 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedestal-${archetype}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${pedestalColor}" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="${pedestalColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${color2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="skyGlow-${archetype}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${color1}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
        </radialGradient>
        <filter id="dinoGlow-${archetype}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${pedestalColor}" flood-opacity="0.6"/>
        </filter>
      </defs>
      
      <!-- Prehistoric Sky Backdrop -->
      <rect width="280" height="240" fill="url(#skyGlow-${archetype})"/>
      
      <!-- Prehistoric Volcanic / Jungle Silhouettes in Distance -->
      <polygon points="20,200 60,110 100,200" fill="#0b1329" opacity="0.6"/>
      <polygon points="80,200 130,90 180,200" fill="#0b1329" opacity="0.75"/>
      <polygon points="160,200 210,120 260,200" fill="#0b1329" opacity="0.6"/>

      <!-- Ambient Ancient Amber Sparks -->
      <circle cx="45" cy="40" r="3" fill="#facc15" opacity="0.8"/>
      <circle cx="230" cy="55" r="4" fill="#facc15" opacity="0.7"/>
      <circle cx="190" cy="30" r="2.5" fill="#facc15" opacity="0.9"/>
      <circle cx="85" cy="70" r="2" fill="#facc15" opacity="0.6"/>
      
      <!-- 3D Isometric Grounding Pedestal / Stone Platform -->
      <ellipse cx="140" cy="185" rx="100" ry="32" fill="url(#pedestal-${archetype})"/>
      <ellipse cx="140" cy="180" rx="84" ry="24" fill="#0f172a" stroke="${pedestalColor}" stroke-width="2.5" opacity="0.9"/>
      
      <!-- Floating Hero Dinosaur Character / Fossil Icon with Breathing Hover -->
      <g transform="translate(140, 135)" filter="url(#dinoGlow-${archetype})">
        <text x="0" y="8" font-size="78" text-anchor="middle" dominant-baseline="central">${emoji}</text>
      </g>

      <!-- Prehistoric Rune Ring / Specimen Hologram -->
      <ellipse cx="140" cy="180" rx="60" ry="16" fill="none" stroke="${pedestalColor}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.8"/>
    </svg>`;
  }

  const DINO_DATA = {
    meta: {
      id: "dino-dig",
      title: "🦕 Dino Dig: Prehistoric Past Tense Lab",
      subtitle: "Excavate Fossils • Master Regular & Irregular Verbs • Present at the Museum",
      cefrLevel: "A1–A2",
      targetAge: "8–12",
      totalXP: 200,
      grammarFormula: {
        regular: "Base Verb + -ed (e.g., discover ➔ discovered)",
        irregular: "Vowel / Form Change (e.g., dig ➔ dug, find ➔ found)"
      },
      targetVerbs: [
        "discovered", "dug", "found", "roared", "lived", "hunted", "ate", "flew", "protected", "ran"
      ]
    },

    // Phase 1: Fossil Resonance Scanner (5 Iconic Species)
    scannerSpecies: [
      {
        id: "dino-rex",
        name: "Tyrannosaurus Rex",
        period: "Late Cretaceous",
        diet: "Carnivore (Meat Eater)",
        emoji: "🦖",
        coreVerb: "roared",
        verbType: "REGULAR",
        baseVerb: "roar",
        sentence: "The mighty T-Rex roared across the prehistoric valley.",
        badge: "Apex Roar Badge",
        soundPhrase: "Roared! The mighty T-Rex roared!",
        svg: getDinoHeroSvg("rex", "#ef4444", "#7f1d1d", "🦖", "#f87171")
      },
      {
        id: "dino-trike",
        name: "Triceratops",
        period: "Late Cretaceous",
        diet: "Herbivore (Plant Eater)",
        emoji: "🦕",
        coreVerb: "protected",
        verbType: "REGULAR",
        baseVerb: "protect",
        sentence: "The Triceratops protected its herd with three sharp horns.",
        badge: "Triple Shield Badge",
        soundPhrase: "Protected! The Triceratops protected its herd!",
        svg: getDinoHeroSvg("trike", "#10b981", "#064e3b", "🦕", "#34d399")
      },
      {
        id: "dino-raptor",
        name: "Velociraptor",
        period: "Late Cretaceous",
        diet: "Agile Hunter",
        emoji: "⚡",
        coreVerb: "ran",
        verbType: "IRREGULAR",
        baseVerb: "run",
        sentence: "The fast raptor ran through the dense forest.",
        badge: "Lightning Runner Badge",
        soundPhrase: "Ran! The fast raptor ran through the forest!",
        svg: getDinoHeroSvg("raptor", "#f59e0b", "#78350f", "⚡", "#fbbf24")
      },
      {
        id: "dino-ptero",
        name: "Pterodactyl",
        period: "Jurassic Skies",
        diet: "Aerial Fisher",
        emoji: "🦅",
        coreVerb: "flew",
        verbType: "IRREGULAR",
        baseVerb: "fly",
        sentence: "The giant reptile flew high above the ancient ocean.",
        badge: "Sky Sovereign Badge",
        soundPhrase: "Flew! The giant reptile flew high in the sky!",
        svg: getDinoHeroSvg("ptero", "#0284c7", "#0c4a6e", "🦅", "#38bdf8")
      },
      {
        id: "dino-stego",
        name: "Stegosaurus",
        period: "Late Jurassic",
        diet: "Armored Herbivore",
        emoji: "🛡️",
        coreVerb: "lived",
        verbType: "REGULAR",
        baseVerb: "live",
        sentence: "The Stegosaurus lived 150 million years ago.",
        badge: "Armored Plate Badge",
        soundPhrase: "Lived! The Stegosaurus lived long ago!",
        svg: getDinoHeroSvg("stego", "#8b5cf6", "#4c1d95", "🛡️", "#c084fc")
      }
    ],

    // Phase 2: Excavation Time Sorter (15 Fossil Challenges)
    // Regular (-ed) vs. Irregular (Change)
    relayFossils: [
      {
        id: "fossil-1",
        name: "Giant Footprint",
        emoji: "👣",
        verb: "discovered",
        base: "discover",
        type: "REGULAR",
        ruleText: "Scientists discovered a giant footprint in the rock.",
        hint: "Ends in -ed! 'Discover' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-footprint", "#10b981", "#064e3b", "👣", "#34d399")
      },
      {
        id: "fossil-2",
        name: "Deep Quarry Excavator",
        emoji: "⛏️",
        verb: "dug",
        base: "dig",
        type: "IRREGULAR",
        ruleText: "Paleontologists dug deep into the ancient desert cliffs.",
        hint: "Vowel changes from 'i' to 'u'! 'Dig' becomes 'dug' = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-dig", "#ef4444", "#7f1d1d", "⛏️", "#f87171")
      },
      {
        id: "fossil-3",
        name: "Amber Specimen",
        emoji: "💎",
        verb: "found",
        base: "find",
        type: "IRREGULAR",
        ruleText: "The team found a prehistoric bug inside golden amber.",
        hint: "'Find' changes completely to 'found' without -ed = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-amber", "#f59e0b", "#78350f", "💎", "#fbbf24")
      },
      {
        id: "fossil-4",
        name: "T-Rex Jawbone",
        emoji: "🦷",
        verb: "hunted",
        base: "hunt",
        type: "REGULAR",
        ruleText: "The ferocious carnivore hunted large dinosaurs.",
        hint: "Ends in -ed! 'Hunt' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-jaw", "#10b981", "#064e3b", "🦷", "#34d399")
      },
      {
        id: "fossil-5",
        name: "Fern Fossil",
        emoji: "🌿",
        verb: "ate",
        base: "eat",
        type: "IRREGULAR",
        ruleText: "The gentle Brachiosaurus ate fresh leaves from tall trees.",
        hint: "Letters rearrange from 'eat' to 'ate' = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-fern", "#ef4444", "#7f1d1d", "🌿", "#f87171")
      },
      {
        id: "fossil-6",
        name: "Sky Pterosaur Wing",
        emoji: "🪶",
        verb: "flew",
        base: "fly",
        type: "IRREGULAR",
        ruleText: "Ancient winged reptiles flew across volcanic skies.",
        hint: "'Fly' changes to 'flew' without -ed = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-wing", "#ef4444", "#7f1d1d", "🪶", "#f87171")
      },
      {
        id: "fossil-7",
        name: "Armored Tail Club",
        emoji: "🛡️",
        verb: "protected",
        base: "protect",
        type: "REGULAR",
        ruleText: "The Ankylosaurus protected itself with a heavy tail club.",
        hint: "Ends in -ed! 'Protect' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-tail", "#10b981", "#064e3b", "🛡️", "#34d399")
      },
      {
        id: "fossil-8",
        name: "Canyon Roar Chamber",
        emoji: "🌋",
        verb: "roared",
        base: "roar",
        type: "REGULAR",
        ruleText: "The apex predator roared loudly across the canyon.",
        hint: "Ends in -ed! 'Roar' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-canyon", "#10b981", "#064e3b", "🌋", "#34d399")
      },
      {
        id: "fossil-9",
        name: "Prehistoric Riverbed",
        emoji: "🌊",
        verb: "swam",
        base: "swim",
        type: "IRREGULAR",
        ruleText: "The giant Spinosaurus swam swiftly in prehistoric rivers.",
        hint: "Vowel changes from 'i' to 'a'! 'Swim' becomes 'swam' = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-river", "#ef4444", "#7f1d1d", "🌊", "#f87171")
      },
      {
        id: "fossil-10",
        name: "Ancient Nest & Eggs",
        emoji: "🥚",
        verb: "cared",
        base: "care",
        type: "REGULAR",
        ruleText: "The Maiasaura mother cared gently for her hatchlings.",
        hint: "Ends in -ed! 'Care' + '-d' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-nest", "#10b981", "#064e3b", "🥚", "#34d399")
      },
      {
        id: "fossil-11",
        name: "Forest Tracker",
        emoji: "🐾",
        verb: "ran",
        base: "run",
        type: "IRREGULAR",
        ruleText: "The small Compsognathus ran quickly between giant tree roots.",
        hint: "Vowel changes from 'u' to 'a'! 'Run' becomes 'ran' = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-tracker", "#ef4444", "#7f1d1d", "🐾", "#f87171")
      },
      {
        id: "fossil-12",
        name: "Mountain Ridge Fossil",
        emoji: "⛰️",
        verb: "climbed",
        base: "climb",
        type: "REGULAR",
        ruleText: "Agile young raptors climbed rocky cliffs easily.",
        hint: "Ends in -ed! 'Climb' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-ridge", "#10b981", "#064e3b", "⛰️", "#34d399")
      },
      {
        id: "fossil-13",
        name: "Observatory Telescope",
        emoji: "🔭",
        verb: "saw",
        base: "see",
        type: "IRREGULAR",
        ruleText: "The early explorers saw ancient bones sticking out of the mud.",
        hint: "'See' changes to 'saw' without -ed = Irregular!",
        xp: 15,
        svg: getDinoHeroSvg("f-tele", "#ef4444", "#7f1d1d", "🔭", "#f87171")
      },
      {
        id: "fossil-14",
        name: "Jurassic Jungle Trail",
        emoji: "🌴",
        verb: "walked",
        base: "walk",
        type: "REGULAR",
        ruleText: "A family of Diplodocus walked through the misty ferns.",
        hint: "Ends in -ed! 'Walk' + '-ed' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-trail", "#10b981", "#064e3b", "🌴", "#34d399")
      },
      {
        id: "fossil-15",
        name: "Meteor Shield Island",
        emoji: "☄️",
        verb: "escaped",
        base: "escape",
        type: "REGULAR",
        ruleText: "Some small burrowing creatures escaped the fiery blast.",
        hint: "Ends in -ed! 'Escape' + '-d' = Regular Past Simple!",
        xp: 15,
        svg: getDinoHeroSvg("f-meteor", "#10b981", "#064e3b", "☄️", "#34d399")
      }
    ],

    // Phase 3: Museum Hologram Teleprompter Archetypes
    teleprompterArchetypes: [
      {
        id: "tp-rex",
        name: "Tyrannosaurus Rex",
        icon: "🦖",
        badge: "King of Carnivores",
        sentence1: "Welcome to the Prehistoric Museum Grand Exhibit.",
        sentence2: "This is the mighty Tyrannosaurus Rex skeleton.",
        sentence3: "Millions of years ago, it roared and hunted in ancient river valleys.",
        sentence4: "Our paleontology team discovered this massive fossil in the sandstone!",
        svg: getDinoHeroSvg("tp-rex", "#ef4444", "#7f1d1d", "🦖", "#f87171")
      },
      {
        id: "tp-trike",
        name: "Triceratops Prorsus",
        icon: "🦕",
        badge: "Armored Guardian",
        sentence1: "Step into our Late Cretaceous Dinosaur Hall.",
        sentence2: "This is the noble three-horned Triceratops.",
        sentence3: "It lived in peaceful herds and ate leafy prehistoric shrubs.",
        sentence4: "Scientists found its enormous armored skull buried near the canyon!",
        svg: getDinoHeroSvg("tp-trike", "#10b981", "#064e3b", "🦕", "#34d399")
      },
      {
        id: "tp-spino",
        name: "Spinosaurus Aegyptiacus",
        icon: "🌊",
        badge: "River Titan",
        sentence1: "Observe this spectacular aquatic predator exhibit.",
        sentence2: "This is the colossal sail-backed Spinosaurus.",
        sentence3: "It swam through deep jungle waterways and caught giant fish.",
        sentence4: "Explorers dug out these incredible spine bones from the rock!",
        svg: getDinoHeroSvg("tp-spino", "#0284c7", "#0c4a6e", "🌊", "#38bdf8")
      },
      {
        id: "tp-ptero",
        name: "Pteranodon Flyer",
        icon: "🦅",
        badge: "Master of Ancient Skies",
        sentence1: "Look high above our prehistoric gallery ceiling.",
        sentence2: "This is the majestic winged reptile Pteranodon.",
        sentence3: "It flew gracefully across ancient coastlines and dived for food.",
        sentence4: "Researchers discovered its delicate hollow wing bones intact!",
        svg: getDinoHeroSvg("tp-ptero", "#f59e0b", "#78350f", "🦅", "#fbbf24")
      },
      {
        id: "tp-raptor",
        name: "Velociraptor Pack Leader",
        icon: "⚡",
        badge: "Tactical Hunter",
        sentence1: "Welcome to our agile hunter paleontology lab.",
        sentence2: "This is the swift and clever Velociraptor.",
        sentence3: "It ran at incredible speeds and cooperated with its team.",
        sentence4: "We found its razor-sharp curved claws preserved in amber stone!",
        svg: getDinoHeroSvg("tp-raptor", "#8b5cf6", "#4c1d95", "⚡", "#c084fc")
      }
    ]
  };

  root.DINO_DATA = DINO_DATA;

})(typeof window !== 'undefined' ? window : global);
