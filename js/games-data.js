/**
 * ENGLISH ADVENTURE ACADEMY — STANDARDIZED 4-TRACK EDUCATIONAL RESOURCE REGISTRY
 * Authoritative registry containing all 58 curriculum learning modules across 4 sequential tracks.
 */

const CURRICULUM_TRACKS = [
  {
    "id": "track-1",
    "key": "space",
    "label": "🚀 Science & Space",
    "title": "Track 1: 🚀 Science & Space Exploration",
    "subtitle": "Planetary astronomy, earth systems, environmental science, and animal adaptations.",
    "count": 23
  },
  {
    "id": "track-2",
    "key": "stem",
    "label": "🛠️ STEM & Inventions",
    "title": "Track 2: 🛠️ Applied STEM & Creative Engineering",
    "subtitle": "Famous inventors, clean energy Eco-Rover build labs, robotics, and team showdowns.",
    "count": 13
  },
  {
    "id": "track-3",
    "key": "language",
    "label": "🗣️ Language & Quests",
    "title": "Track 3: 🗣️ Language Mechanics & Communication Quests",
    "subtitle": "Preposition physics catapults, acoustic phonics labs, imperative meme rules, and roleplay.",
    "count": 19
  },
  {
    "id": "track-4",
    "key": "literature",
    "label": "📖 Literature & Tests",
    "title": "Track 4: 📖 Literature, Story Quests & Diagnostic Tests",
    "subtitle": "Classic storyboards (Alice in Wonderland, Wizard of Oz), timed reading quests, and diagnostic vaults.",
    "count": 20
  },
  {
    "id": "all",
    "key": "all",
    "label": "🌟 All Lessons (70+)",
    "title": "Complete Learning Library (All Lessons)",
    "subtitle": "All 72 interactive ESL/CLIL games, engineering workshops, story adventures, and diagnostic labs.",
    "count": 72
  }
];

const GAMES_REGISTRY = [
  {
    "id": "alice-cards-4a",
    "aliases": [
      "alice-cards-4a",
      "tea-party-cards-4a",
      "class-4a-cards",
      "alice-cards"
    ],
    "title": "🎩 Alice in Wonderland: Mad Tea Party Cards (4A)",
    "description": "Double-sided Victorian fantasy trading cards and student acting guide suite for Class 4-A (18 cast members). Features 300 DPI high-resolution character portraits, RPG stat badges, costume and prop checklists, 1-minute performance speeches, and exact stage interaction cues with 3x3 duplex print sheets.",
    "type": "game",
    "category": "Literature & Story Quests",
    "categoryGroup": "Alice Series",
    "categoryLabel": "🎩 Literature & Roleplay",
    "level": "A2–B1",
    "cefrLevel": "A2–B1",
    "age": "Ages 8–14",
    "ageGroup": "8-14",
    "grade": "Grade 4A",
    "grades": [
      "Grade 4",
      "Grade 4A"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 250,
    "targetClass": "4A",
    "skills": [
      "Drama & Character Portrayal",
      "Dialogue Memorization & Delivery",
      "Victorian Vocabulary & Idioms",
      "Stage Cues & Acting Interactions",
      "Oral Fluency & Public Speaking",
      "Costume & Prop Preparation"
    ],
    "topic": "Alice in Wonderland, The Mad Tea Party & Victorian Theatre",
    "topics": [
      "Alice in Wonderland",
      "Character Acting",
      "Storytelling"
    ],
    "languageFocus": "I’m late for an important date! / Off with their heads! / It is no use going back to yesterday... / Contrariwise! / Nohow!",
    "activityMode": "Double-Sided Collectible Trading Cards / 3x3 Duplex Print Sheets / 18 Student Acting Dossiers",
    "interactionType": "3D Flip Cards, Audio Speech Synthesis, Duplex Cardstock Print Engine",
    "route": "alice-cards-4a/index.html",
    "url": "alice-cards-4a/index.html",
    "path": "alice-cards-4a/index.html",
    "worksheetUrl": "alice-cards-4a/worksheet.html",
    "worksheetRoute": "alice-cards-4a/worksheet.html",
    "thumbnailIcon": "🫖",
    "thumbnailUrl": "alice-cards-4a/assets/characters/mad-hatter.jpg",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "Class 4-A Character Acting Guides, RPG Stats & Duplex Cards",
    "grammar": {
      "focusPattern": "Character Dialogue & Motives",
      "formula": "Class 4-A Character Acting Guides, RPG Stats & Duplex Cards"
    },
    "learningObjectives": [
      "Perform character roleplay using character-specific quotes and modal phrases.",
      "Formulate character motives and RPG battle stats."
    ],
    "vocabulary": {
      "core": [
        "tea power",
        "madness",
        "courage",
        "muchness",
        "bonkers",
        "contrariwise",
        "nohow",
        "oraculum",
        "chrysalis",
        "jabberwocky"
      ]
    },
    "badges": [
      "Class 4-A Cast",
      "Collectible Cards",
      "3x3 Duplex Print Ready",
      "18 Character Dossiers",
      "Speech & Audio"
    ]
  },
  {
    "id": "alice-cards-4b",
    "aliases": [
      "alice-cards-4b",
      "tea-party-cards-4b",
      "class-4b-cards"
    ],
    "title": "😸 Alice in Wonderland: Mad Tea Party Cards (4B)",
    "description": "Double-sided Victorian fantasy trading cards and student acting guide suite for Class 4-B (19 cast members). Features 300 DPI high-resolution character portraits, RPG stat badges, costume and prop checklists, 1-minute performance speeches, and exact stage interaction cues with 3x3 duplex print sheets.",
    "type": "game",
    "category": "Literature & Story Quests",
    "categoryGroup": "Alice Series",
    "categoryLabel": "😸 Literature & Roleplay",
    "level": "A2–B1",
    "cefrLevel": "A2–B1",
    "age": "Ages 8–14",
    "ageGroup": "8-14",
    "grade": "Grade 4B",
    "grades": [
      "Grade 4",
      "Grade 4B"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 250,
    "targetClass": "4B",
    "skills": [
      "Drama & Character Portrayal",
      "Dialogue Memorization & Delivery",
      "Victorian Vocabulary & Idioms",
      "Stage Cues & Acting Interactions",
      "Oral Fluency & Public Speaking",
      "Costume & Prop Preparation"
    ],
    "topic": "Alice in Wonderland, The Mad Tea Party & Victorian Theatre",
    "topics": [
      "Alice in Wonderland",
      "Character Acting",
      "Storytelling"
    ],
    "languageFocus": "I’m late for an important date! / Off with their heads! / It is no use going back to yesterday... / Contrariwise! / Nohow!",
    "activityMode": "Double-Sided Collectible Trading Cards / 3x3 Duplex Print Sheets / 19 Student Acting Dossiers",
    "interactionType": "3D Flip Cards, Audio Speech Synthesis, Duplex Cardstock Print Engine",
    "route": "alice-cards-4b/index.html",
    "url": "alice-cards-4b/index.html",
    "path": "alice-cards-4b/index.html",
    "worksheetUrl": "alice-cards-4b/worksheet.html",
    "worksheetRoute": "alice-cards-4b/worksheet.html",
    "thumbnailIcon": "🎩",
    "thumbnailUrl": "alice-cards-4b/assets/characters/cheshire-cat.jpg",
    "gradient": "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #0f172a 100%)",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "Class 4-B Character Acting Guides, RPG Stats & Duplex Cards",
    "grammar": {
      "focusPattern": "Character Dialogue & Motives",
      "formula": "Class 4-B Character Acting Guides, RPG Stats & Duplex Cards"
    },
    "learningObjectives": [
      "Perform character roleplay using character-specific quotes and modal phrases.",
      "Formulate character motives and RPG battle stats."
    ],
    "vocabulary": {
      "core": [
        "tea power",
        "madness",
        "courage",
        "muchness",
        "bonkers",
        "contrariwise",
        "nohow",
        "oraculum",
        "chrysalis",
        "jabberwocky"
      ]
    },
    "badges": [
      "Class 4-B Cast",
      "Collectible Cards",
      "3x3 Duplex Print Ready",
      "19 Character Dossiers",
      "Speech & Audio"
    ]
  },
  {
    "id": "nasa-mission",
    "title": "🚀 NASA Mission: Find a New Planet",
    "description": "Interactive 6-stage CLIL space expedition for primary ESL learners. Fuel thrusters with Magic 'e' phonics, scan uncharted alien surfaces, sort survival cargo, build modular crisis-solving rovers, collaborate with global peers using 'AND', and broadcast the final live discovery report to Earth!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🚀 CLIL & Space Exploration",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 6–9",
    "ageGroup": "6-9",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 150,
    "skills": [
      "CLIL Science & Astronomy",
      "Phonics (Magic 'e')",
      "Speaking & Presentation",
      "Descriptive Adjectives",
      "Survival Vocabulary",
      "Engineering & Problem Solving"
    ],
    "topic": "Planetary Science, Survival Needs & Engineering Inventions",
    "topics": [
      "Planetary Astronomy",
      "Space Exploration",
      "Environmental Science"
    ],
    "languageFocus": "It is [cold / rocky / red]. People need [water / oxygen] to live. The problem is [no water]. It can [melt / filter] AND [clean].",
    "activityMode": "Whole Class Smart Board Interactive / Individual Space Cadet Mode",
    "interactionType": "Phonics Booster Canister, Radar Surface Scanner, Airlock Cargo Sorter, Snap-Together Machine Builder, Peer Upgrade Bay, Live Teleprompter",
    "difficulty": "Grade 3–4 A1 / A1+",
    "tags": [
      "space",
      "nasa",
      "clil",
      "science",
      "phonics",
      "magic-e",
      "survival",
      "inventions",
      "speaking",
      "grade-3",
      "grade-4"
    ],
    "learningObjectives": [
      "Identify planetary characteristics, atmospheres, and biosignatures in English",
      "Use comparative and superlative adjectives to evaluate exoplanet viability",
      "Analyze scientific data strips (temperature, water, oxygen) to justify space mission decisions",
      "Formulate complete scientific mission reports and expedition logs"
    ],
    "teacherInstructions": "Project on Smart Board. Guide students through the 6 sequential space stages. Use the built-in Teacher HUD to view curriculum targets and print student mission logbooks & diplomas.",
    "studentInstructions": "Join NASA as a Planetary Cadet! Fuel your rocket, scan an alien world, sort survival gear, build a crisis-solving rover, and broadcast your discovery to Earth!",
    "route": "nasa-mission/index.html",
    "worksheet": "nasa-mission/worksheet.html",
    "worksheetRoute": "nasa-mission/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🚀",
    "gradient": "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0369a1 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"nasaGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#090d16\"/>\n          <stop offset=\"50%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"100%\" stop-color=\"#0369a1\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#nasaGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"44\" fill=\"#0ea5e9\" opacity=\"0.25\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"28\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n      <text x=\"100\" y=\"78\" font-size=\"34\" text-anchor=\"middle\">🚀</text>\n    </svg>",
    "categoryGroup": "Space Exploration",
    "vocabulary": {
      "core": [
        "planet",
        "gravity",
        "atmosphere",
        "orbit",
        "solar system",
        "oxygen"
      ],
      "supporting": [
        "exoplanet",
        "spacecraft",
        "habitable",
        "telescope",
        "radiation"
      ],
      "phonics": [
        "/pl/ in planet",
        "/sp/ in space"
      ]
    },
    "grammar": {
      "focusPattern": "Planet X is [comparative] than Earth because...",
      "formula": "Planet [X] is colder than Earth, so explorers need [oxygen/heat] to survive.",
      "formulas": [
        "Subject + is + Comparative Adjective + than + Object",
        "It has + [Quantity] + of + [Element], so humans can/cannot survive"
      ]
    },
    "clilDomain": "Astrophysics & Exoplanet Habitability",
    "clilTheme": "Astrophysics & Exoplanet Habitability",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "trackOrder": 1,
    "formula": "Planet [X] is colder than Earth, so explorers need [oxygen/heat] to survive.",
    "status": "active",
    "worksheetUrl": "nasa-mission/worksheet.html",
    "url": "nasa-mission/index.html"
  },
  {
    "id": "dino-arena",
    "aliases": [
      "dino-clash",
      "top-trumps-dino",
      "paleo-clash",
      "dino-battle"
    ],
    "title": "🦖 Dino Arena: Cretaceous Adaptations & Clash",
    "description": "Commercial 70-Minute (2-Lesson) 7-Stage CLIL arcade module (Grade 3–4 | CEFR A1+–A2 | 200 XP). Lesson 1 (Prehistoric Anatomy & Comparison): 1. Mystery Silhouette & Roar Chamber, 2. 3D Hologram Anatomy Scanner, 3. Diet Airlock Sorter, 4. Comparative Balance Scale Gym; Lesson 2 (Arena Clash & Field Report): 5. 1v1 Cretaceous Showdown Arena, 6. Paleontologist Teleprompter Studio, 7. Exit Diagnostic & Printable Field Passport.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🦖 Paleontology & Top Trumps",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7–11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 70,
    "durationText": "70 min (2 Lessons)",
    "estimatedMinutes": 70,
    "xp": 200,
    "skills": [
      "Silhouette & Prehistoric Roar Deduction",
      "CLIL Diet Classification & Anatomical Adaptations",
      "Comparative Adjective Sentence Building (-er than)",
      "Top Trumps 1v1 Stat Clash Analysis",
      "Spoken Teleprompter Karaoke Presentation",
      "Diagnostic Exit Assessment"
    ],
    "topic": "Dinosaurs, Comparative Adjectives, Animal Adaptations & Paleontology",
    "topics": [
      "Paleontology",
      "Comparative Adjectives",
      "Animal Adaptations",
      "Cretaceous Period",
      "Diet Classification"
    ],
    "languageFocus": "Comparative Adjectives: [Dino A] is [bigger / faster / heavier / longer] than [Dino B]. Classification & Function: [Dino] is a [carnivore / herbivore]. It has [sharp claws / horns / armor] to [hunt / protect itself].",
    "activityMode": "6-Stage Interactive CLIL Master Arcade / Smart Board Challenge",
    "interactionType": "Silhouette Mystery Chamber, Drag & Drop Diet Crates, Digital Balance Scale Beam, Top Trumps 65/35 Cards, Slap Winner Stamps, Teleprompter Karaoke, Diagnostic Exit Passport",
    "difficulty": "Grade 3–5 (A1+–A2)",
    "tags": [
      "dino-arena",
      "dinosaurs",
      "top-trumps",
      "comparatives",
      "clil",
      "science",
      "paleontology",
      "speech-karaoke",
      "guessing-game",
      "sentence-builder"
    ],
    "learningObjectives": [
      "Identify dinosaurs by silhouette, roar, and anatomical clues.",
      "Classify dinosaurs by diet (carnivore vs. herbivore) based on teeth and adaptations.",
      "Construct comparative adjective sentences using physical digital balance mechanics.",
      "Compare dinosaur physical stats in 1v1 Top Trumps showdown battles.",
      "Deliver a 3-part oral teleprompter report with calibrated speech synthesis.",
      "Demonstrate mastery in a 3-question diagnostic checkpoint and export a printable Field Passport."
    ],
    "teacherInstructions": "Run through all 6 sequential stages: 1. Silhouette Guessing Hook (audio cues + 3 clues), 2. CLIL Diet Sorter (teeth inspection + drag/drop crates), 3. Grammar Gym (interactive balance scale + sentence formula builder), 4. 1v1 Battle Arena (8 Top Trumps clash rounds), 5. Teleprompter Studio (karaoke speech presentation), 6. Exit Checkpoint (diagnostic quiz + A4 printable passport).",
    "studentInstructions": "Enter the 6-stage Dino Arena! Solve the silhouette mysteries, sort dinosaur diets, balance giant prehistoric titans, clash in 1v1 showdowns, broadcast your discovery, and earn your Certified Field Passport!",
    "route": "dino-arena/index.html",
    "worksheetRoute": "dino-arena/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🦕",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #059669 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"dinoArenaThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#070a14\"/>\n          <stop offset=\"50%\" stop-color=\"#151f38\"/>\n          <stop offset=\"100%\" stop-color=\"#f59e0b\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#dinoArenaThumbGrad)\"/>\n      <ellipse cx=\"100\" cy=\"105\" rx=\"55\" ry=\"18\" fill=\"#f59e0b\" opacity=\"0.3\"/>\n      <ellipse cx=\"100\" cy=\"102\" rx=\"42\" ry=\"12\" fill=\"#0c1222\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n      <text x=\"100\" y=\"72\" font-size=\"44\" text-anchor=\"middle\">🦖</text>\n    </svg>",
    "categoryGroup": "Science & Paleontology",
    "vocabulary": {
      "core": [
        "carnivore",
        "herbivore",
        "claws",
        "horns",
        "armor",
        "heavy",
        "fast"
      ],
      "supporting": [
        "predator",
        "tail club",
        "protect",
        "weight",
        "extinct"
      ],
      "phonics": [
        "/k/ in carnivore",
        "/h/ in herbivore",
        "/kl/ in claws"
      ]
    },
    "grammar": {
      "focusPattern": "[Dino A] is [comparative] than [Dino B] / It has [feature] to [action]",
      "formula": "[Dino A] is [bigger / faster / heavier] than [Dino B] / It has [feature] to [action]",
      "formulas": [
        "T-Rex is bigger than Velociraptor.",
        "Velociraptor is faster than T-Rex.",
        "Triceratops has three horns to fight predators."
      ]
    },
    "clilDomain": "Paleontology & Animal Biology",
    "clilTheme": "Prehistoric Fauna & Physical Adaptations",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "trackOrder": 2,
    "formula": "[Dino A] is [bigger / faster / heavier] than [Dino B] / It has [feature] to [action]",
    "status": "active",
    "worksheetUrl": "dino-arena/worksheet.html",
    "url": "dino-arena/index.html"
  },
  {
    "id": "dino-expedition",
    "aliases": [
      "dino-expedition",
      "prehistoric-habitats",
      "dino-habitats",
      "paleo-expedition"
    ],
    "title": "🦖 Dino Expedition: Prehistoric Habitats",
    "description": "High-craft 3-phase CLIL & ESL paleontology expedition (CEFR A1+ | 150 XP). Phase 1: 3D Discovery Radar with 360° flip cards and authentic 3D raster fossils; Phase 2: Tactile Adaptation Workbench with comparative syntax engine, energy gauge, and rubber stamp slam; Phase 3: Live Karaoke Teleprompter broadcast studio with speech synthesis and A4 Field Passport.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🦖 Prehistoric Habitats & Comparatives",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–11",
    "ageGroup": "8–11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 150,
    "skills": [
      "3D Prehistoric Fossil Scanning",
      "Comparative Adjective Formulation (-er than)",
      "CLIL Diet & Habitat Classification (Carnivore vs. Herbivore)",
      "Survival Feature Mechanics & Rubber Stamp Verification",
      "3-Sentence Oral Teleprompter Broadcast"
    ],
    "topic": "Dinosaurs, Habitats, Diets & Comparative Adjectives",
    "topics": [
      "Paleontology",
      "Comparative Adjectives",
      "Habitats",
      "Animal Adaptations",
      "Herbivore vs Carnivore"
    ],
    "languageFocus": "Comparative Adjectives: [Dino A] was [bigger / faster / heavier] than [Dino B]. Habitat & Diet: It lived in the [habitat] to find [food/plants].",
    "activityMode": "3-Phase Interactive CLIL Arcade & Teleprompter Studio",
    "interactionType": "3D Radar Flip Cards, Tactile Adaptation Workbench, Dynamic Energy Reactor, Rubber Stamp Slam, Live Karaoke Teleprompter, A4 Printable Field Passport",
    "difficulty": "Grade 3–4 (A1+)",
    "tags": [
      "dino-expedition",
      "dinosaurs",
      "comparatives",
      "habitats",
      "clil",
      "science",
      "paleontology",
      "speech-teleprompter",
      "audio-synthesis"
    ],
    "learningObjectives": [
      "Compare physical dinosaur traits using comparative adjectives (bigger, faster, heavier).",
      "Classify prehistoric creatures by diet and environmental habitat requirements.",
      "Deliver a 3-part oral paleontologist field report via the live teleprompter."
    ],
    "teacherInstructions": "Guide students through the 3-phase arc: 1. Discovery Radar (flip 3D fossil cards to inspect height, weight, and habitat), 2. Tactile Workbench (build comparative sentences and slam the rubber stamp to fill energy to 100%), 3. Live Teleprompter (deliver 3-sentence broadcast with audio accompaniment and print the A4 Field Passport).",
    "studentInstructions": "Enter the Prehistoric Dino Expedition! Scan all 6 fossil specimens, master comparative sentences at the workbench, and deliver your live teleprompter field debrief to earn your Senior Paleontologist Diploma!",
    "route": "dino-expedition/index.html",
    "worksheetRoute": "dino-expedition/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🦖",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #059669 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"dinoExpThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#060911\"/>\n          <stop offset=\"50%\" stop-color=\"#064e3b\"/>\n          <stop offset=\"100%\" stop-color=\"#10b981\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#dinoExpThumbGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"42\" fill=\"rgba(16, 185, 129, 0.2)\" stroke=\"#10b981\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/>\n      <text x=\"100\" y=\"82\" font-size=\"48\" text-anchor=\"middle\">🦖</text>\n    </svg>",
    "categoryGroup": "Science & Paleontology",
    "vocabulary": {
      "core": [
        "carnivore",
        "herbivore",
        "claws",
        "horns",
        "armor",
        "forest",
        "swamp",
        "plains"
      ],
      "supporting": [
        "heavier",
        "faster",
        "fossil",
        "predator",
        "extinct"
      ],
      "phonics": [
        "/k/ in carnivore",
        "/h/ in herbivore",
        "/kl/ in claws"
      ]
    },
    "grammar": {
      "focusPattern": "[Dino A] was [comparative] than [Dino B] / It lived in [habitat]",
      "formula": "[Dino A] was [bigger / faster / heavier] than [Dino B] / It lived in [habitat] to find [food/plants]",
      "formulas": [
        "T-Rex was faster than Triceratops.",
        "Brachiosaurus was heavier than Stegosaurus.",
        "It lived in the prehistoric forest to find food."
      ]
    },
    "clilDomain": "Paleontology & Animal Biology",
    "clilTheme": "Prehistoric Fauna, Diets & Habitats",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "trackOrder": 3,
    "formula": "[Dino A] was [bigger / faster / heavier] than [Dino B] / It lived in [habitat] to find [food/plants]",
    "status": "active",
    "worksheetUrl": "dino-expedition/worksheet.html",
    "url": "dino-expedition/index.html"
  },
  {
    "id": "monster-evolution",
    "aliases": [
      "monster-evolution",
      "creature-evolution",
      "evolution-lab",
      "elemental-monsters"
    ],
    "title": "🐉 Monster Evolution: Elemental Growth Cycles",
    "description": "5-Layer EdTech CLIL & ESL arcade module (Grade 3–4 | CEFR A1+ | 180 XP). Phase 1: Specimen Growth Scanner with 3D flip cards inspecting Baby, Growing, and Ultimate elemental stages; Phase 2: Evolution Chamber Workbench with interactive socket docking, comparative stat bars, energy reactor, and rubber stamp slam (STAMP: EVOLVED!); Phase 3: Teleprompter Studio with real-time word-by-word karaoke highlighting and printable A4 Evolution Dossier.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🐉 Elemental Biology & Life Cycles",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–11",
    "ageGroup": "8–11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 180,
    "skills": [
      "3D Elemental Specimen Reconnaissance",
      "Life Cycle Progression Stems (Baby to Ultimate)",
      "Physical Purpose Formulas (has wings to fly / has armor to protect)",
      "Evolution Chamber Socket Docking & Rubber Stamp Verification",
      "3-Sentence Oral Teleprompter Broadcast"
    ],
    "topic": "Elemental Biology, Growth Stages & Physical Purpose",
    "topics": [
      "Life Cycles",
      "Evolution",
      "Physical Adaptations",
      "Elemental Habitats",
      "Animals & Biology"
    ],
    "languageFocus": "Growth Cycle: The [creature] grows from a [baby] into an [ultimate] [titan]. Physical Purpose: It has [feature] to [action verb].",
    "activityMode": "3-Phase Interactive CLIL Evolution Lab & Teleprompter Studio",
    "interactionType": "3D Perspective Flip Cards, Socket Docking Target, Growth Energy Reactor, Rubber Stamp Impact, Live Word-by-Word Karaoke Teleprompter, A4 Printable Field Dossier",
    "difficulty": "Grade 3–4 (A1+)",
    "tags": [
      "monster-evolution",
      "creature-evolution",
      "life-cycles",
      "adaptations",
      "clil",
      "science",
      "biology",
      "speech-teleprompter",
      "audio-synthesis"
    ],
    "learningObjectives": [
      "Identify the three growth stages of elemental creatures (Baby, Growing, Ultimate).",
      "Formulate life cycle sentences: 'The creature grows from a baby into an ultimate titan.'",
      "Express physical purpose: 'It has wings/armor/fins to fly/protect/swim.'",
      "Broadcast a 3-sentence live field debrief in the teleprompter studio."
    ],
    "teacherInstructions": "Lead cadets through the 3-phase arc: 1. Growth Scanner (flip 3D cards to examine stats and life stages from hatchling to ultimate), 2. Evolution Workbench (dock comparative and purpose traits to charge energy to 100% and slam the stamp), 3. Live Teleprompter (deliver 3-sentence broadcast with audio accompaniment and print the A4 Evolution Dossier).",
    "studentInstructions": "Welcome to the Evolution Lab! Scan 5 elemental species, dock target adaptations in the chamber to trigger evolution, and broadcast your research debrief to earn your Senior Evolutionist Diploma!",
    "route": "monster-evolution/index.html",
    "worksheetRoute": "monster-evolution/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🐉",
    "gradient": "linear-gradient(135deg, #060911 0%, #3b0764 50%, #a855f7 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"monsterEvolThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#060911\"/>\n          <stop offset=\"50%\" stop-color=\"#3b0764\"/>\n          <stop offset=\"100%\" stop-color=\"#a855f7\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#monsterEvolThumbGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"42\" fill=\"rgba(168, 85, 247, 0.2)\" stroke=\"#a855f7\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/>\n      <text x=\"100\" y=\"82\" font-size=\"48\" text-anchor=\"middle\">🐉</text>\n    </svg>",
    "categoryGroup": "Science & Paleontology",
    "vocabulary": {
      "core": [
        "evolve",
        "baby",
        "growing",
        "ultimate",
        "wings",
        "horns",
        "fins",
        "armor"
      ],
      "supporting": [
        "hatchling",
        "crest",
        "protect",
        "harness",
        "charge"
      ],
      "phonics": [
        "/v/ in evolve",
        "/w/ in wings",
        "/kw/ in aqua"
      ]
    },
    "grammar": {
      "focusPattern": "The [creature] grows into a [titan] / It has [feature] to [action]",
      "formula": "The [creature] grows from a [baby] into a [titan] / It has [feature] to [action]",
      "formulas": [
        "The Emberwing grows from a baby into an ultimate titan.",
        "It has fiery wings to fly above magma peaks.",
        "It has tough bark armor to protect forest life."
      ]
    },
    "clilDomain": "Elemental Biology & Life Cycles",
    "clilTheme": "Growth Stages & Physical Purpose",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "trackOrder": 4,
    "formula": "The [creature] grows from a [baby] into a [titan] / It has [feature] to [action]",
    "status": "active",
    "worksheetUrl": "monster-evolution/worksheet.html",
    "url": "monster-evolution/index.html"
  },
  {
    "id": "creature-cafe",
    "aliases": [
      "creature-cafe",
      "mythical-cafe",
      "likes-dislikes",
      "mythical-creatures-cafe"
    ],
    "title": "🧁 Creature Café: Mythical Likes & Dislikes",
    "description": "5-Layer EdTech CLIL & ESL arcade module (Grade 3–4 | CEFR A1+ | 200 XP). Phase 1: Menu Scanner inspecting 5 legendary creatures and their taste/activity preferences with 65% full-bleed 3D cards; Phase 2: Café Kitchen Workbench with interactive treat serving, target sentence slots, stamp slam feedback, and soft-wobble hints; Phase 3: Live Café Review Teleprompter with real-time word-by-word karaoke highlighting and printable A4 Café Menu & Review Log.",
    "type": "game",
    "category": "Language & Quests",
    "categoryLabel": "🧁 Mythical Likes & Dislikes",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 200,
    "skills": [
      "Likes & Dislikes Sentence Construction",
      "Food & Treat Vocabulary",
      "Mythical Creature Trait Association",
      "Interactive Kitchen Workbench Order Serving",
      "3-Sentence Oral Teleprompter Presentation"
    ],
    "topic": "Food Preferences, Likes & Dislikes, Hobbies",
    "topics": [
      "Food & Drink",
      "Likes & Dislikes",
      "Mythical Creatures",
      "Hobbies & Actions",
      "Speaking & Presentation"
    ],
    "languageFocus": "Positive: [Creature] likes [Item / Verb-ing]. Negative: [Creature] doesn't like [Item / Verb-ing]. Question: What does it like?",
    "activityMode": "3-Phase Interactive CLIL Café & Teleprompter Studio",
    "interactionType": "65% Full-Bleed 3D Cards, Kitchen Workbench Order Matching, Rubber Stamp Impact, Live Word-by-Word Karaoke Teleprompter, A4 Printable Field Dossier",
    "difficulty": "Grade 3–4 (A1+)",
    "tags": [
      "creature-cafe",
      "likes-dislikes",
      "food",
      "creatures",
      "clil",
      "speaking",
      "speech-teleprompter",
      "audio-synthesis"
    ],
    "learningObjectives": [
      "Express creature food and hobby preferences using 'likes' and 'doesn't like'.",
      "Ask and answer: 'What does [creature] like?'",
      "Serve correct items in the kitchen workbench based on sensory clues.",
      "Deliver a 3-sentence speaking review using the live teleprompter."
    ],
    "teacherInstructions": "Guide students through the 3-phase arc: 1. Menu Scanner (explore the 5 creatures and listen to their preferences), 2. Kitchen Workbench (serve the right food tokens to earn XP and boost customer happiness), 3. Live Teleprompter (deliver a 3-sentence customer review and complete the companion worksheet).",
    "studentInstructions": "Welcome to Creature Café! Explore the menu to learn what dragons, mermaids, and yetis love to eat. Serve their orders in the kitchen and read your review on the live teleprompter!",
    "route": "creature-cafe/index.html",
    "worksheetRoute": "creature-cafe/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🧁",
    "gradient": "linear-gradient(135deg, #060911 0%, #0c4a6e 50%, #0284c7 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"cafeThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#060911\"/>\n          <stop offset=\"50%\" stop-color=\"#0c4a6e\"/>\n          <stop offset=\"100%\" stop-color=\"#0284c7\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#cafeThumbGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"42\" fill=\"rgba(56, 189, 248, 0.2)\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/>\n      <text x=\"100\" y=\"82\" font-size=\"48\" text-anchor=\"middle\">🧁</text>\n    </svg>",
    "categoryGroup": "Language & Quests",
    "vocabulary": {
      "core": [
        "spicy peppers",
        "sweet honey",
        "cold ice berries",
        "golden nuts",
        "crunchy crystals"
      ],
      "supporting": [
        "flying",
        "swimming",
        "sleeping",
        "roaring"
      ],
      "phonics": [
        "/p/ in peppers",
        "/h/ in honey",
        "/b/ in berries"
      ]
    },
    "grammar": {
      "focusPattern": "[Creature] likes [Item] / It doesn't like [Item]",
      "formula": "[Creature] likes [Item / Verb-ing]. It doesn't like [Item / Verb-ing].",
      "formulas": [
        "Ember Dragon likes spicy peppers.",
        "Coral Mermaid doesn't like spicy peppers.",
        "Thunder Yeti likes cold ice berries."
      ]
    },
    "clilDomain": "Mythical Preferences & Diets",
    "clilTheme": "Food, Flavors & Hobbies",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 5,
    "formula": "[Creature] likes [Item / Verb-ing]. It doesn't like [Item / Verb-ing].",
    "status": "active",
    "worksheetUrl": "creature-cafe/worksheet.html",
    "url": "creature-cafe/index.html"
  },
  {
    "id": "wildlife-detective",
    "aliases": [
      "wildlife",
      "detective",
      "animal-adaptations",
      "conservation",
      "ranger"
    ],
    "title": "🐾 Wildlife Detective: TikTok vs. Nature",
    "description": "Interactive 3-Phase wildlife CLIL mission (CEFR A1+ | 150 XP). Investigate the wild habitat requirements of exotic animals (Axolotl, Bearded Dragon, Ball Python), analyze viral trends like the bathtub capybara vs. silicone nightlight, and broadcast the live Ranger Dispatch: 'Keep it wild! Buy the toy lamp!'.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryGroup": "Ecology & Wildlife",
    "categoryLabel": "🐾 Wildlife Conservation & Science Literacy",
    "level": "A2",
    "cefrLevel": "A2",
    "age": "Ages 8–11",
    "ageGroup": "8–11",
    "grade": "Grade 4",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 150,
    "skills": [
      "Animal Structural & Behavioral Adaptations",
      "Wildlife Conservation & Habitat Protection",
      "Critical Social Media & Viral Clickbait Literacy",
      "Oral Field Dispatch Teleprompter Recitation"
    ],
    "topic": "Animal Adaptations, Endangered Species Conservation & Media Literacy",
    "topics": [
      "Wildlife Conservation",
      "Animal Adaptations",
      "Media Literacy",
      "Social Media Trends"
    ],
    "learningObjectives": [
      "Differentiate wild animals from domestic pets based on physiological needs.",
      "Formulate requirement and prohibition sentences using 'needs' and 'cannot live in'.",
      "Deliver a structured 3-sentence conservation broadcast using the karaoke teleprompter."
    ],
    "vocabulary": {
      "core": [
        "wetland",
        "herd",
        "chew",
        "teeth",
        "webbed feet",
        "snorkel face",
        "lamp",
        "expert",
        "zookeeper",
        "wild",
        "pet"
      ],
      "supporting": [
        "habitat",
        "protect",
        "apartment",
        "swimming",
        "adaptations"
      ]
    },
    "grammar": {
      "focusPattern": "It needs [noun] / It cannot [verb] / Keep it wild!",
      "formula": "The [animal] needs [requirement]. / Keep it wild! Buy the [item]!",
      "formulas": [
        "The axolotl needs cold, clean water.",
        "A capybara cannot live in a bedroom because it needs a wetland.",
        "Keep wild animals in nature and buy the toy lamp!"
      ]
    },
    "path": "wildlife-detective/index.html",
    "url": "wildlife-detective/index.html",
    "route": "wildlife-detective/index.html",
    "worksheetRoute": "wildlife-detective/worksheet.html",
    "icon": "🐾",
    "thumbnailIcon": "🦫",
    "gradient": "linear-gradient(135deg, #060d0a 0%, #0f241a 50%, #10b981 100%)",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "trackOrder": 3,
    "formula": "The [animal] needs [requirement]. / Keep it wild! Buy the [item]!",
    "worksheetUrl": "wildlife-detective/worksheet.html"
  },
  {
    "id": "young-inventor",
    "title": "🛠️ Young Inventor: Innovation Workshop",
    "description": "Comprehensive 10-mission interactive STEM & invention adventure for Grade 4 (CEFR A1+) based on My Good Ideas Book (pp. 18–21). Students detect real classroom problems, explore biomimicry clues, draw blueprint sketches on touch canvas, assemble modular components, formulate CAN/CAN'T sentences, stress-test in testing chamber, upgrade prototypes, and deliver 5-minute capstone Expo presentations.",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "💡 CLIL & STEM Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 8–11",
    "ageGroup": "8-11",
    "grade": "Grade 4",
    "grades": [
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 120,
    "skills": [
      "Speaking",
      "CLIL",
      "Grammar",
      "Creative Thinking",
      "Vocabulary"
    ],
    "topic": "The Small Inventor & STEM Design",
    "topics": [
      "Invention Cycle",
      "Design Blueprints",
      "Prototyping & Testing"
    ],
    "languageFocus": "Modals of ability CAN / CAN'T + verb (It can fly, It can't swim), HAS / HAVE (It has two wheels), IS / ARE, sequencing (First, Then, Finally), problem/solution (The problem is..., The solution is...)",
    "activityMode": "Whole Class Smart Board Interactive / Team Inventor Challenge",
    "interactionType": "Touch Drawing Canvas, Modular Assembly Pod, Stress Test Chamber, Ability Selector, 5-Minute Pitch Timer, Audience Detective Scoring",
    "difficulty": "Grade 4 Scaffolded A1+",
    "tags": [
      "inventor",
      "small-inventor",
      "young-inventor",
      "stem",
      "clil",
      "can-cant",
      "grade-4",
      "presentation",
      "expo",
      "biomimicry",
      "good-ideas-book"
    ],
    "learningObjectives": [
      "Trace the 5-step invention lifecycle: Problem -> Idea -> Blueprint -> Prototype -> Improvement",
      "Formulate purpose statements using to + verb (e.g. He invented the telephone to talk to distant people)",
      "Evaluate engineering trade-offs when testing and improving prototypes",
      "Deliver an oral presentation detailing an original classroom invention"
    ],
    "teacherInstructions": "Project on Smart Board. Guide young inventors through 10 interactive missions: problem detection, biomimicry inspiration, canvas blueprinting, modular assembly, ability verification, chamber testing, upgrades, and the Capstone Expo pitch.",
    "studentInstructions": "Join the Young Inventor Academy! Discover problems, invent high-tech gadgets, test them in the lab, upgrade your prototype, and present your invention at the Grand Expo!",
    "route": "young-inventor/index.html",
    "worksheet": "young-inventor/worksheet.html",
    "worksheetRoute": "young-inventor/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"yiThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#083344\"/><stop offset=\"50%\" stop-color=\"#0e7490\"/><stop offset=\"100%\" stop-color=\"#0f172a\"/></linearGradient></defs><rect width=\"200\" height=\"140\" fill=\"url(#yiThumbBg)\"/><rect x=\"12\" y=\"12\" width=\"176\" height=\"116\" rx=\"12\" fill=\"#0f172a\" opacity=\"0.75\" stroke=\"#06b6d4\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#06b6d4\" opacity=\"0.25\"/><text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🚀</text><rect x=\"16\" y=\"92\" width=\"168\" height=\"22\" rx=\"11\" fill=\"#06b6d4\"/><text x=\"100\" y=\"107\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"9\" fill=\"#0f172a\" text-anchor=\"middle\" letter-spacing=\"0.5\">YOUNG INVENTOR ACADEMY</text></svg>",
    "categoryGroup": "Young Inventor Academy",
    "vocabulary": {
      "core": [
        "invent",
        "plan",
        "build",
        "test",
        "improve",
        "problem",
        "solution"
      ],
      "supporting": [
        "blueprint",
        "measure",
        "device",
        "material",
        "present"
      ],
      "phonics": [
        "/bl/ in blueprint",
        "/pl/ in plan"
      ]
    },
    "grammar": {
      "focusPattern": "Inventors plan before they [verb]",
      "formula": "Real inventors plan blueprints before they build and test their inventions.",
      "formulas": [
        "People invented [Item] to + Base Verb",
        "First we plan, then we build, next we test, finally we improve"
      ]
    },
    "clilDomain": "Engineering Design Loop (Plan, Build, Test, Improve)",
    "clilTheme": "Engineering Design Loop (Plan, Build, Test, Improve)",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "trackOrder": 1,
    "formula": "Real inventors plan blueprints before they build and test their inventions.",
    "thumbnailIcon": "🛠️",
    "status": "active",
    "worksheetUrl": "young-inventor/worksheet.html",
    "url": "young-inventor/index.html"
  },
  {
    "id": "eco-engineers",
    "aliases": [
      "adventure-engine"
    ],
    "title": "⚡ Eco-Engineers: Clean Energy Rover",
    "description": "Commercial-grade cyber-glassmorphic interactive learning module. Power the quantum core, align solar, kinetic, radar, and shield subsystems, solve speed hazard relays, and broadcast live on the glowing teleprompter!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "⚡ CLIL & Clean Energy",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–12",
    "ageGroup": "8-12",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 150,
    "skills": [
      "CLIL Clean Energy",
      "Engineering Design Cycle",
      "Oral Debrief & Presentation",
      "Functional Modals (uses [Energy] to [Verb])"
    ],
    "topic": "Clean Energy & Eco-Rover Engineering",
    "topics": [
      "Robotics & Automation",
      "Renewable Energy",
      "Algorithmic Thinking"
    ],
    "languageFocus": "The [Subsystem] uses [Energy] to [Verb]. Teamwork powers adventure!",
    "activityMode": "Interactive Cyber-Glassmorphism Lab / Smart Board Challenge",
    "interactionType": "Persistent Holographic Rover SVG, Subsystem Slotting, Speed Hazard Relay, Glowing Karaoke Teleprompter, Printable A4 Diploma",
    "difficulty": "Scaffolded A1+ / A2",
    "tags": [
      "adventure-engine",
      "eco-rover",
      "clean-energy",
      "clil",
      "stem",
      "teleprompter",
      "engineering",
      "speaking"
    ],
    "learningObjectives": [
      "Program navigation commands and route algorithms for an autonomous planetary eco-rover",
      "Apply environmental science concepts: solar charging, battery storage, and terrain mapping",
      "Use directional prepositions and sequencing adverbs in step-by-step robotic instructions",
      "Diagnose rover hardware faults and engineer iterative repair scripts"
    ],
    "teacherInstructions": "Launch on Smart Board or individual student tablets. Guide students through Subsystem Alignment, the 3-round Hazard Speed Relay, and the Live Studio Teleprompter Speech.",
    "studentInstructions": "Power the quantum core of the Eco-Rover! Slot the energy subsystems, survive the dust storms and thermal chasms, and broadcast live to Earth!",
    "route": "eco-engineers/index.html",
    "worksheet": "adventure-engine/worksheet.html",
    "worksheetRoute": "eco-engineers/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "⚡",
    "gradient": "linear-gradient(135deg, #060911 0%, #0c1a30 50%, #0284c7 100%)",
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"advEngGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#060911\"/>\n          <stop offset=\"50%\" stop-color=\"#0c1a30\"/>\n          <stop offset=\"100%\" stop-color=\"#0284c7\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#advEngGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"42\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"28\" fill=\"#0284c7\" opacity=\"0.8\"/>\n      <text x=\"100\" y=\"78\" font-size=\"26\" text-anchor=\"middle\">⚡</text>\n      <rect x=\"18\" y=\"106\" width=\"164\" height=\"20\" rx=\"10\" fill=\"#0284c7\"/>\n      <text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"8.5\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">ADVENTURE ENGINE ⚡</text>\n    </svg>",
    "categoryGroup": "Eco-Rover Robotics",
    "vocabulary": {
      "core": [
        "rover",
        "battery",
        "solar panel",
        "sensor",
        "terrain",
        "command"
      ],
      "supporting": [
        "autonomous",
        "chassis",
        "efficiency",
        "navigate",
        "obstacle"
      ],
      "phonics": [
        "/r/ in rover",
        "/s/ in sensor"
      ]
    },
    "grammar": {
      "focusPattern": "The rover needs to [action] in order to [purpose]",
      "formula": "Drive forward [X] meters and turn [direction] in order to recharge the solar battery.",
      "formulas": [
        "Imperative: Turn [Direction] + Drive [Distance] meters",
        "In order to + Base Verb, the rover must + Base Verb"
      ]
    },
    "clilDomain": "Renewable Energy & Robotic Navigation",
    "clilTheme": "Renewable Energy & Robotic Navigation",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "trackOrder": 2,
    "formula": "Drive forward [X] meters and turn [direction] in order to recharge the solar battery.",
    "status": "active",
    "worksheetUrl": "eco-engineers/worksheet.html",
    "url": "eco-engineers/index.html"
  },
  {
    "id": "baamboozle",
    "aliases": [
      "academy-bamboozle",
      "bamboozle"
    ],
    "title": "⚡ Baamboozle Arena: STEM Showdown",
    "description": "High-energy classroom team showdown with mystery cards, problem-solving questions, and sudden game-changing power-ups (Swap, Steal, and Double Points)!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "⚡ Team Quiz Show",
    "level": "A1–A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 7–12",
    "ageGroup": "7-12",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 15,
    "durationText": "15 min",
    "estimatedMinutes": 15,
    "xp": 100,
    "skills": [
      "Speaking",
      "Quick Recall",
      "Team Collaboration"
    ],
    "topic": "Inventions, Tools & Problem Solving",
    "topics": [
      "Inventors & Inventions",
      "Classroom Game Show",
      "Team Communication"
    ],
    "languageFocus": "Why did people invent...? People invented... to [verb].",
    "activityMode": "Whole Class Team Arena (Red Team vs Blue Team)",
    "interactionType": "Interactive Mystery Grid, Power-up Reveal, Team Scoreboard",
    "difficulty": "All Levels (A1–A2+)",
    "tags": [
      "baamboozle",
      "bamboozle",
      "game-show",
      "quiz",
      "team-battle",
      "inventions",
      "speaking",
      "review"
    ],
    "learningObjectives": [
      "Review and master primary science and invention vocabulary in high-energy team tournament format",
      "Formulate fast affirmative and interrogative responses under time pressure",
      "Distinguish between problems, tools, and technological solutions",
      "Collaborate with peers using strategic gameplay and respectful sportsmanship"
    ],
    "teacherInstructions": "Divide the classroom into Red Team and Blue Team. Project on the main screen. Take turns choosing mystery boxes, revealing answers, and resolving power-up bamboozles!",
    "studentInstructions": "Pick a box, answer the invention question, or bamboozle the opposing team to claim victory!",
    "route": "baamboozle/index.html",
    "featured": true,
    "thumbnailIcon": "🎮",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"baamboozleGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"50%\" stop-color=\"#312e81\"/>\n          <stop offset=\"100%\" stop-color=\"#4338ca\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#baamboozleGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"44\" fill=\"#f59e0b\" opacity=\"0.25\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"28\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n      <text x=\"100\" y=\"78\" font-size=\"34\" text-anchor=\"middle\">⚡</text>\n    </svg>",
    "categoryGroup": "Invention Game Show",
    "vocabulary": {
      "core": [
        "inventor",
        "invention",
        "machine",
        "blueprint",
        "experiment",
        "solution"
      ],
      "supporting": [
        "gadget",
        "teamwork",
        "score",
        "power-up",
        "challenge"
      ],
      "phonics": [
        "/v/ in inventor",
        "/bl/ in blueprint"
      ]
    },
    "grammar": {
      "focusPattern": "Who invented the [item]? / What does it do?",
      "formula": "The [item] was invented in [year] by [inventor] to solve [problem].",
      "formulas": [
        "Subject + was invented in [Year] by [Inventor]",
        "It is used to + Base Verb"
      ]
    },
    "clilDomain": "History of Technology & Team Problem Solving",
    "clilTheme": "History of Technology & Team Problem Solving",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "trackOrder": 3,
    "formula": "The [item] was invented in [year] by [inventor] to solve [problem].",
    "worksheetRoute": "baamboozle/worksheet.html",
    "status": "active",
    "worksheetUrl": "baamboozle/worksheet.html",
    "url": "baamboozle/index.html"
  },
  {
    "id": "cat-vs-dog",
    "aliases": [
      "preposition-catapult",
      "catapult",
      "cat-dog",
      "dog-vs-cat",
      "fleabag",
      "mutt",
      "fleabag-vs-mutt"
    ],
    "title": "🐱 Cat vs. Dog: Preposition Catapult",
    "description": "Real-time 60FPS parabolic physics catapult clash (CEFR A1 | 130 XP). Launch fish bones over the tall wooden fence, calculate wind vectors, and solve preposition linguistic gates to unlock tactical Double Shot, Super Power, and Grammar Medic power-ups!",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryGroup": "Grammar & Speaking Quests",
    "categoryLabel": "🐱 Arcade Physics & Prepositions",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7–10",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 130,
    "skills": [
      "Prepositions of Place (over, into, behind, under, on top of)",
      "Directional Prepositions & Movement (across, through)",
      "Trajectory & Wind Vector Physics",
      "Oral Teleprompter Victory Recitation"
    ],
    "topic": "Prepositions of Place & Movement, Trajectory Physics & Turn-Based Strategy",
    "topics": [
      "Prepositions of Place",
      "Action Verbs",
      "Trajectory Physics"
    ],
    "learningObjectives": [
      "Identify and apply spatial prepositions (over, into, on top of, behind).",
      "Calculate projectile trajectory angles and force against dynamic wind meters.",
      "Express spatial actions orally using 'The cat threw the projectile OVER the fence'."
    ],
    "vocabulary": {
      "core": [
        "over",
        "into",
        "on top of",
        "behind",
        "throw",
        "hit",
        "fence",
        "yard"
      ],
      "supporting": [
        "wind",
        "angle",
        "power",
        "catapult",
        "trajectory"
      ]
    },
    "grammar": {
      "focusPattern": "Prepositions of Place: over / into / on top of / behind",
      "formula": "[Noun] + [Verb] + [Preposition] + [Noun Phrase]",
      "formulas": [
        "The cat throws the fish over the fence.",
        "The bone lands into the dog's bowl.",
        "The cat sits on top of the trash bin."
      ]
    },
    "path": "cat-vs-dog/index.html",
    "url": "cat-vs-dog/index.html",
    "route": "cat-vs-dog/index.html",
    "worksheetRoute": "cat-vs-dog/worksheet.html",
    "icon": "🐱",
    "thumbnailIcon": "🐱",
    "gradient": "linear-gradient(135deg, #070b14 0%, #1e1b4b 50%, #0284c7 100%)",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 1,
    "formula": "[Noun] + [Verb] + [Preposition] + [Noun Phrase]",
    "worksheetUrl": "cat-vs-dog/worksheet.html"
  },
  {
    "id": "sound-detective",
    "aliases": [
      "sound",
      "household-sound",
      "household-mystery",
      "sound-detective-arcade",
      "sound-arcade",
      "what-is-that-sound"
    ],
    "title": "🎧 Sound Detective: Acoustic Lab",
    "description": "Fun 4-Stage Auditory Listening & Sound Arcade Game (CEFR A1+ | 250 XP). Practice auditory recognition across 12 household objects and 8 sound verbs, speed-slap reflexes with 6-second timers, crack the sonic safe distinguishing 'It's a...' vs. 'They're...', and broadcast live from the Foley DJ Studio with karaoke teleprompter.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryGroup": "Phonics & Language Quests",
    "categoryLabel": "🎧 Listening & Speaking Arcade",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7–10",
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 250,
    "learningObjectives": [
      "Identify 12 common household objects from blind synthesized sound cues.",
      "Match and conjugate 8 sound action verbs: tick, ring, drip, click, whistle, knock, clink, shuffle.",
      "Differentiate singular ('It's a [object]') and plural ('They're [cards/dice]') structures in the Sonic Safe Cracker.",
      "Broadcast a structured 3-sentence presentation using the live karaoke teleprompter and 4-channel soundboard."
    ],
    "languageFocus": "Inquiring: 'What's that sound?' / Singular: 'It's a [object]. It [sound verb]s!' / Plural: 'They're [cards / dice]. They [sound verb]!'",
    "topics": [
      "Household Objects",
      "Sound Verbs",
      "Singular vs Plural",
      "Auditory Discrimination",
      "Teleprompter Speaking"
    ],
    "vocabulary": {
      "core": [
        "clock",
        "bell",
        "tap",
        "light switch",
        "kettle",
        "door",
        "computer",
        "cards",
        "dice",
        "cup",
        "spoon",
        "backpack",
        "tick",
        "ring",
        "drip",
        "click",
        "whistle",
        "knock",
        "clink",
        "shuffle"
      ],
      "supporting": [
        "sound",
        "listen",
        "singular",
        "plural",
        "broadcast",
        "effects",
        "safe",
        "tumbler"
      ]
    },
    "grammar": {
      "focusPattern": "Inquiring & Identification: What's that sound? / It's a [object]. It [verbs]! / They're [objects]. They [verb]!",
      "formula": "What's that sound? / It's a [singular noun]. It [verb]s! / They're [plural noun]. They [verb]!",
      "formulas": [
        "What's that sound?",
        "It's a clock. It ticks!",
        "They're cards. They shuffle!",
        "When the kettle moves, it goes whistle!"
      ]
    },
    "path": "sound-detective/index.html",
    "url": "sound-detective/index.html",
    "route": "sound-detective/index.html",
    "worksheetRoute": "sound-detective/worksheet.html",
    "featured": true,
    "icon": "🎧",
    "thumbnailIcon": "🎧",
    "gradient": "linear-gradient(135deg, #070b14 0%, #0f172a 50%, #0284c7 100%)",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 2,
    "formula": "What's that sound? / It's a [singular noun]. It [verb]s! / They're [plural noun]. They [verb]!",
    "worksheetUrl": "sound-detective/worksheet.html"
  },
  {
    "id": "meme-rules",
    "aliases": [
      "meme-imperatives",
      "classroom-memes",
      "meme-workbench"
    ],
    "title": "⭐ Meme Rules: Imperatives in Action",
    "description": "Tactical 3-phase interactive CLIL lab. Scan 25 iconic meme reactions, sort rules into Green Light (Base Verb) and Red Light (Don't + Verb) dropzones, and deliver a live teleprompter speech!",
    "category": "Phonics & Language Quests",
    "categoryGroup": "Grammar & Communication",
    "cefrLevel": "A1+",
    "level": "A1+",
    "ageGroup": "8–12",
    "grade": "Grade 4",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "xp": 150,
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "type": "game",
    "topics": [
      "Classroom Rules",
      "Imperatives",
      "Social Communication"
    ],
    "learningObjectives": [
      "Construct positive imperatives using Base Verb + Object.",
      "Construct negative imperatives using Don't + Base Verb.",
      "Deliver classroom behavior rules orally using a 3-part teleprompter."
    ],
    "teacherInstructions": "Use the Green/Red light relay for tactile sorting practice, then have students present their favorite meme rule using the teleprompter studio.",
    "route": "meme-rules/index.html",
    "worksheet": "meme-rules/worksheet.html",
    "worksheetRoute": "meme-rules/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "⭐",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #059669 100%)",
    "tags": [
      "memes",
      "imperatives",
      "grammar",
      "rules",
      "speaking",
      "clil"
    ],
    "vocabulary": {
      "core": [
        "raise",
        "speak",
        "listen",
        "whisper",
        "share",
        "wait"
      ],
      "supporting": [
        "hallway",
        "supplies",
        "patiently",
        "carefully"
      ]
    },
    "grammar": {
      "focusPattern": "Base Verb + Object / Don't + Base Verb",
      "formula": "Base Verb + Object / Don't + Base Verb",
      "formulas": [
        "Raise your hand before answering!",
        "Don't shout across the room!",
        "Whisper when working in pairs!"
      ]
    },
    "clilDomain": "Media Literacy & Social-Emotional Learning",
    "clilTheme": "Classroom Community & Digital Communication",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 3,
    "formula": "Base Verb + Object / Don't + Base Verb",
    "status": "active",
    "worksheetUrl": "meme-rules/worksheet.html",
    "url": "meme-rules/index.html"
  },
  {
    "id": "biome-crafter",
    "aliases": [
      "minecraft-survival",
      "night-survival",
      "voxel-crafter",
      "biome-survival"
    ],
    "title": "⛏️ Biome Crafter: The Night Survival (70-Min Master Arc)",
    "description": "8-Stage interactive voxel survival & CLIL science arcade module. Explore 4 biomes, harvest timber and cobblestone in the mining airlock, craft tier-upgraded pickaxes, sort emergency supplies during sunset, assemble a 3x3 tactical shelter forge, repel midnight creepers, and broadcast a 3-sentence teleprompter report!",
    "category": "CLIL & Science",
    "categoryGroup": "Earth, Space & Natural Science",
    "cefrLevel": "A1–A1+",
    "level": "A1+",
    "ageGroup": "7–11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "xp": 200,
    "duration": 70,
    "durationText": "70 min (2 Lessons)",
    "estimatedMinutes": 70,
    "type": "game",
    "topics": [
      "Earth Science & Biomes",
      "Materials & Tools",
      "Infinitives of Purpose",
      "Nocturnal Animal Adaptations",
      "3x3 Tactical Crafting"
    ],
    "learningObjectives": [
      "Express quantities and materials using: 'I need [number] [material] to make a [tool/item].'",
      "Formulate infinitives of purpose: 'We use [item] to [verb] the [object].'",
      "Recognize environmental survival conditions: 'When the sun sets, we must build a shelter to survive!'",
      "Classify survival gear vs. luxury items under timed sunset pressure.",
      "Execute modular recipe patterns on an interactive 3x3 crafting grid."
    ],
    "teacherInstructions": "Run through 8 sequential stages across 2 35-minute lessons: Lesson 1 (Biome Scanner, Mining Airlock, Tool Smithing, Sunset Drill), Lesson 2 (3x3 Shelter Forge, Creeper Defense, Teleprompter Studio, Diagnostic Checkpoint & Field Manual).",
    "route": "biome-crafter/index.html",
    "worksheet": "biome-crafter/worksheet.html",
    "worksheetRoute": "biome-crafter/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "⛏️",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #10b981 100%)",
    "tags": [
      "biome",
      "minecraft",
      "voxel",
      "crafting",
      "materials",
      "clil",
      "science",
      "survival",
      "night"
    ],
    "vocabulary": {
      "core": [
        "wood",
        "stone",
        "iron",
        "coal",
        "stick",
        "torch",
        "door",
        "pickaxe",
        "sword",
        "shelter"
      ],
      "supporting": [
        "chop",
        "mine",
        "craft",
        "light",
        "block",
        "protect",
        "survive",
        "workbench",
        "bedrock",
        "sunset"
      ]
    },
    "grammar": {
      "focusPattern": "I need [number] [material] to make / We use [item] to [verb]",
      "formula": "I need [number] [material] to make a [item]. / We use [item] to [verb].",
      "formulas": [
        "I need 3 wood to make a door.",
        "We use torches to light the shelter.",
        "When the sun sets, we must build a shelter to survive!"
      ]
    },
    "clilDomain": "Earth Science, Materials & Environmental Engineering",
    "clilTheme": "Ecosystem Resources & Structural Defense",
    "trackId": "track-1",
    "trackTitle": "🌍 Earth, Space & Natural Science",
    "trackOrder": 5,
    "formula": "I need [materials] to make / We use [item] to [verb]",
    "status": "active",
    "worksheetUrl": "biome-crafter/worksheet.html",
    "url": "biome-crafter/index.html"
  },
  {
    "id": "twin-gates",
    "aliases": [
      "crystal-citadel",
      "twin-doors",
      "citadel-escape",
      "the-twin-gates"
    ],
    "title": "🚪 Mystery of the Twin Gates: Escape the Sky Castle",
    "description": "5-Scene narrative interactive story quest for primary ESL learners. The Sky Castle is shaking! Solve hazards in each room using inventory tools (light dark cellars with torches, feed hungry beasts bread, cross abyss bridges with stones), choose colossal 3D doors, unlock the Grand Sky Gate, and broadcast a 3-sentence teleprompter report to launch the Golden Airship!",
    "category": "Language & Quests",
    "categoryGroup": "Communication & Interactive Storytelling",
    "cefrLevel": "A1",
    "level": "A1",
    "ageGroup": "7–10",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "xp": 150,
    "duration": 35,
    "durationText": "35–40 min",
    "estimatedMinutes": 35,
    "type": "game",
    "topics": [
      "Room Hazards & Solutions",
      "Direction & Door Choices",
      "Tool Purpose Formulas",
      "3-Layer Scene Architecture",
      "Live Karaoke Teleprompter"
    ],
    "learningObjectives": [
      "Describe environmental conditions: 'It is [dark / cold / hungry / broken].'",
      "Formulate action and solution sentences: 'I use the [torch / bread / key] to [see / feed / open].'",
      "Express directional choices: 'Let's go through the [left / right] door!'",
      "Perform a 3-sentence speaking ceiling broadcast with calibrated karaoke teleprompter timing."
    ],
    "teacherInstructions": "Guide students through 5 cinematic scenes: Scene 1 (Dark Cellar & Wall Sconce), Scene 2 (Hungry Beast Den & Warm Bread), Scene 3 (Abyss Bridge & Stepping Stones), Scene 4 (Grand Sky Gate & Golden Key), and Scene 5 (Golden Airship Launch & Teleprompter).",
    "route": "twin-gates/index.html",
    "worksheet": "twin-gates/worksheet.html",
    "worksheetRoute": "twin-gates/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🚪",
    "gradient": "linear-gradient(135deg, #060911 0%, #0369a1 50%, #f59e0b 100%)",
    "tags": [
      "story",
      "interactive",
      "citadel",
      "gates",
      "directions",
      "teleprompter",
      "clil",
      "speaking",
      "riddle",
      "airship"
    ],
    "vocabulary": {
      "core": [
        "gate",
        "door",
        "shield",
        "torch",
        "gear",
        "crystal",
        "left",
        "right",
        "behind",
        "airship"
      ],
      "supporting": [
        "freeze",
        "melt",
        "power",
        "launch",
        "citadel",
        "guardian",
        "riddle",
        "bridge",
        "chasm",
        "sunrise"
      ]
    },
    "grammar": {
      "focusPattern": "Go through the [left/right] door! / I need [item] to [verb]",
      "formula": "Go through the [left / right] door! / I need a [tool] to [verb] the [object].",
      "formulas": [
        "Go through the left door! I hear cold wind.",
        "I need a torch to melt the ice for the Yeti.",
        "We use a bronze gear to power the lift.",
        "We launched the Golden Airship — mission complete!"
      ]
    },
    "clilDomain": "Interactive Storytelling & Spatial Navigation",
    "clilTheme": "Fantasy Quests & Cause-and-Effect Decisions",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 4,
    "formula": "Go through the [direction] door / I need [tool] to [verb]",
    "status": "active",
    "worksheetUrl": "twin-gates/worksheet.html",
    "url": "twin-gates/index.html"
  },
  {
    "id": "wind-and-sun",
    "aliases": [
      "wind-sun",
      "the-wind-and-the-sun",
      "jacket-contest",
      "weather-powers"
    ],
    "title": "☀️ The Wind and the Sun: Weather Powers & The Jacket Contest",
    "description": "Interactive 4-stage fable cinema and arcade module. Watch the Aesop fable with auto-pausing video checkpoints, manipulate wind and sun sliders to observe reactive weather physics, test rapid sorting reflexes in the 20-second Jacket Reaction Race, and deliver oral karaoke teleprompter graduation!",
    "category": "Language & Quests",
    "categoryGroup": "Communication & Literature",
    "cefrLevel": "A1–A1+",
    "level": "A1+",
    "ageGroup": "7–11",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "xp": 150,
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "type": "game",
    "topics": [
      "Aesop's Fable & Video Checkpoints",
      "Weather Powers & Wind vs Sun Physics",
      "Cause & Action: Jacket Reaction Race",
      "Comparative Language & Speaking Ceiling",
      "Live Karaoke Teleprompter Graduation"
    ],
    "learningObjectives": [
      "Compare elemental strength: 'I can [blow / shine]! I am [stronger / hotter] than you!'",
      "Express cause and action: 'It is cold and windy, so he [zips up] his jacket.'",
      "Express warmth and contrast: 'The sun shines gently, so he [takes off] his jacket.'",
      "Reflect on moral resolution: 'Gentle warmth is stronger than cold force — kindness wins!'"
    ],
    "teacherInstructions": "Launch Stage 1 for full-screen YouTube fable cinema with auto-pausing checkpoints at 00:55, 01:24, and 02:36. Transition to Stage 2 Weather Powers Lab for slider-based wind/sun physics. Move to Stage 3 for the 20-second Jacket Reaction Race drill, and graduate in Stage 4 Fable Teleprompter Studio with word-by-word karaoke highlight.",
    "route": "wind-and-sun/index.html",
    "worksheet": "wind-and-sun/worksheet.html",
    "worksheetRoute": "wind-and-sun/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "☀️",
    "gradient": "linear-gradient(135deg, #060911 0%, #0284c7 50%, #f59e0b 100%)",
    "tags": [
      "fable",
      "aesop",
      "weather",
      "wind",
      "sun",
      "jacket",
      "youtube",
      "cinema",
      "karaoke",
      "teleprompter",
      "science"
    ],
    "vocabulary": {
      "core": [
        "wind",
        "sun",
        "jacket",
        "blow",
        "shine",
        "cold",
        "warm",
        "zip up",
        "take off",
        "stronger"
      ],
      "supporting": [
        "hood",
        "snow",
        "storm",
        "gale",
        "breeze",
        "traveler",
        "kindness",
        "force",
        "contest",
        "heat"
      ]
    },
    "grammar": {
      "focusPattern": "I am [stronger/hotter] than you / It is [cold/warm], so he [zips up/takes off] his jacket",
      "formula": "I am [comparative] than you / It is [weather], so [subject] [verb] [object]",
      "formulas": [
        "I can blow! I am stronger than you!",
        "It is cold and windy, so he zips up his jacket.",
        "The sun shines gently, so he takes off his jacket.",
        "Gentle warmth is stronger than cold force — kindness wins!"
      ]
    },
    "clilDomain": "Literature & Earth/Weather Science",
    "clilTheme": "Aesop's Fables, Weather Dynamics & Moral Reasoning",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 5,
    "formula": "I am [stronger/hotter] than you / It is [weather], so he [zips up/takes off]",
    "status": "active",
    "worksheetUrl": "wind-and-sun/worksheet.html",
    "url": "wind-and-sun/index.html"
  },
  {
    "id": "ninja-trials",
    "aliases": [
      "ninja-academy",
      "can-you-do-it",
      "ninja-challenges"
    ],
    "title": "🥋 Ninja Trials: Body, Brain & Sonic Challenges (Hard Mode)",
    "description": "7-Stage kinesthetic action, decibel stealth & sonic mimicry arcade module. Scan 7 disciplines, execute active physical challenges on a digital stopwatch with whistle freeze cues, master multi-action memory chains, test vocal decibels & waveforms on an oscilloscope, race 15s tongue twister sprints, and deliver a live oral teleprompter showcase!",
    "category": "Language & Quests",
    "categoryGroup": "Communication & Kinesthetic Action",
    "cefrLevel": "A1–A1+",
    "level": "A1+",
    "ageGroup": "7–11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "xp": 200,
    "duration": 70,
    "durationText": "70 min (2 Lessons)",
    "estimatedMinutes": 70,
    "type": "game",
    "topics": [
      "Kinesthetic Action",
      "Ability Formulas",
      "Motor Memory & Coordination",
      "Sonic Mimicry & Decibel Control",
      "Phonics Tongue Twister Sprints"
    ],
    "learningObjectives": [
      "Ask and answer questions about physical and sonic ability using 'Can you [Verb]?' -> 'Yes, I can! / No, I can't.'",
      "Express declarative physical confidence with 'I can [Verb] and [Verb]!'",
      "Structure multi-step action sequences using 'First..., then..., finally...!'",
      "Demonstrate safe classroom proprioception, balance holds, and whistle freeze stops.",
      "Explore vocal dynamics through decibel whisper control (<= 30 dB), battle cry surges (100 dB), and live oscilloscope waveforms.",
      "Articulate phonics speed sprints (/s/, /f/, /k/) under a 15-second countdown timer."
    ],
    "teacherInstructions": "Clear space around student desks. Use the digital stopwatch timer for balance holds and sprints, practice instant statue freezes with the referee whistle, and debrief on the teleprompter stage.",
    "route": "ninja-trials/index.html",
    "worksheet": "ninja-trials/worksheet.html",
    "worksheetRoute": "ninja-trials/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🥋",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #f59e0b 100%)",
    "tags": [
      "ninja",
      "ability",
      "can-you",
      "physical",
      "clil",
      "kinesthetic",
      "speaking"
    ],
    "vocabulary": {
      "core": [
        "balance",
        "jump",
        "squat",
        "turn",
        "freeze",
        "clap",
        "run",
        "punch",
        "kick"
      ],
      "supporting": [
        "seconds",
        "tiptoes",
        "silently",
        "whistle",
        "statue",
        "straight"
      ]
    },
    "grammar": {
      "focusPattern": "Can you + Verb / I can + Verb",
      "formula": "Can you [Verb + Manner]? -> Yes, I can! / No, I can't.",
      "formulas": [
        "Can you balance on one leg for 15 seconds?",
        "Yes, I can balance on one leg!",
        "First jump, then clap, finally freeze!"
      ]
    },
    "clilDomain": "Physical Education & Motor Skill Development",
    "clilTheme": "Proprioception, Coordination & Physical Literacy",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "trackOrder": 4,
    "formula": "Can you [Verb]? / I can [Verb]!",
    "status": "active",
    "worksheetUrl": "ninja-trials/worksheet.html",
    "url": "ninja-trials/index.html"
  },
  {
    "id": "alice-quest",
    "title": "🫖 Alice Quest: Mad Tea Party Storyboard",
    "description": "Differentiated reading and speaking challenge deck. Students choose their level (1 to 3) to earn up to 200 XP for vocabulary, creative storytelling, character acting, and full spoken summaries!",
    "type": "presentation",
    "category": "Story & Literature",
    "categoryLabel": "📖 Literature & Speaking",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–12",
    "ageGroup": "8-12",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "xp": 200,
    "skills": [
      "Differentiated Reading Comprehension",
      "Creative Writing & Alternate Endings",
      "Public Speaking & Spoken Summaries",
      "Drama & Character Portrayal"
    ],
    "topic": "Alice in Wonderland Differentiated Quests",
    "languageFocus": "My favorite character is... because... / At first Alice was... but later she became...",
    "route": "alice-quest/index.html",
    "worksheet": "alice-quest/worksheet.html",
    "worksheetRoute": "alice-quest/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🫖",
    "gradient": "linear-gradient(135deg, #070b14 0%, #312e81 50%, #c084fc 100%)",
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"aliceQuestThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#070b14\"/>\n            <stop offset=\"50%\" stop-color=\"#312e81\"/>\n            <stop offset=\"100%\" stop-color=\"#c084fc\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#aliceQuestThumbBg)\"/>\n        <rect x=\"15\" y=\"15\" width=\"170\" height=\"110\" rx=\"12\" fill=\"rgba(15,23,42,0.8)\" stroke=\"#c084fc\" stroke-width=\"2\" stroke-dasharray=\"5,3\"/>\n        <circle cx=\"65\" cy=\"52\" r=\"22\" fill=\"#c084fc\" opacity=\"0.25\"/>\n        <text x=\"65\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">🐇</text>\n        <circle cx=\"135\" cy=\"52\" r=\"22\" fill=\"#f59e0b\" opacity=\"0.25\"/>\n        <text x=\"135\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">👑</text>\n        <rect x=\"25\" y=\"90\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#c084fc\"/>\n        <text x=\"100\" y=\"105\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"9\" fill=\"#070b14\" text-anchor=\"middle\" letter-spacing=\"0.5\">ALICE XP QUEST ⚡</text>\n      </svg>",
    "categoryGroup": "Alice in Wonderland",
    "learningObjectives": [
      "Progress through 4 graded tiers of Wonderland literary comprehension challenges (Bronze to Legend)",
      "Demonstrate mastery of character analysis, narrative recall, and quote identification",
      "Engage in gamified classroom roster grading with live XP rewards and tier badges",
      "Defend literary interpretations using evidence from the original Lewis Carroll text"
    ],
    "vocabulary": {
      "core": [
        "quest",
        "riddle",
        "tier",
        "legend",
        "nonsense",
        "crown"
      ],
      "supporting": [
        "wonderland",
        "monarch",
        "croquet",
        "cheshire",
        "whimsical"
      ],
      "phonics": [
        "/kw/ in quest",
        "/r/ in riddle"
      ]
    },
    "grammar": {
      "focusPattern": "Why did [Character] say [Quote]?",
      "formula": "Why did the Queen of Hearts demand [action]? Because [character motive].",
      "formulas": [
        "Wh- Questions: Why + did + Subject + Verb + ...?",
        "Cause & Effect: [Character] acted this way because + Clause"
      ]
    },
    "topics": [
      "Literature Quests",
      "Roster Grading & Assessment",
      "Alice in Wonderland"
    ],
    "clilDomain": "Literary Analysis & Gamified Roster Grading",
    "clilTheme": "Literary Analysis & Gamified Roster Grading",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "trackOrder": 1,
    "formula": "Why did the Queen of Hearts demand [action]? Because [character motive].",
    "status": "active",
    "worksheetUrl": "alice-quest/worksheet.html",
    "url": "alice-quest/index.html"
  },
  {
    "id": "unit-1-diagnostic",
    "title": "📋 Unit 1 Diagnostic: 8-Task Audit Vault",
    "description": "Standardized curricular module in 📖 Literature, Storytelling & Diagnostic Vaults.",
    "learningObjectives": [
      "Demonstrate proficiency in target formula: 8-Task Diagnostic & Proficiency Matrix",
      "Participate in classroom team tasks and digital checkpoint activities"
    ],
    "vocabulary": {
      "core": [
        "lesson",
        "mission",
        "practice",
        "target"
      ]
    },
    "grammar": {
      "formula": "8-Task Diagnostic & Proficiency Matrix",
      "focusPattern": "8-Task Diagnostic & Proficiency Matrix"
    },
    "xp": 120,
    "duration": 35,
    "durationText": "35 min",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "trackOrder": 2,
    "cefrLevel": "A1–A2",
    "level": "A1–A2",
    "formula": "8-Task Diagnostic & Proficiency Matrix",
    "route": "unit-1-diagnostic/index.html",
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "thumbnailIcon": "📋",
    "category": "Story & Literature",
    "status": "active",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html",
    "url": "unit-1-diagnostic/index.html"
  },
  {
    "id": "wonderland-quiz-briefing",
    "aliases": [
      "quiz-briefing",
      "wonderland-briefing",
      "master-quest-briefing",
      "unit-1-quiz",
      "pre-quiz-hud"
    ],
    "title": "🍄 Unit 1 Master Quest: Briefing & Timer HUD",
    "description": "Smartboard mission briefing, teleprompter rules, 25-minute timer with Web Audio cues, interactive 4-vault quiz with answer key, student check-in, and Wonderland Character Draft prize ledger.",
    "type": "tool",
    "category": "Classroom Tools",
    "categoryGroup": "Classroom Management & Timers",
    "categoryLabel": "⏱️ Briefing & Timer",
    "level": "Grade 4",
    "duration": 25,
    "durationText": "25 min",
    "xp": 120,
    "route": "quiz-briefing/index.html",
    "url": "quiz-briefing/index.html",
    "path": "quiz-briefing/index.html",
    "thumbnailIcon": "🍄",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #f59e0b 100%)",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "Unit 1 Master Quest & Timer Challenge Matrix",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html",
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "cefrLevel": "Grade 4"
  },
  {
    "id": "quiz-g3-u1-after-school-inventor",
    "aliases": [
      "inventor-quiz",
      "after-school-inventor",
      "grade3-unit1-quiz",
      "inventor-briefing",
      "clara-doodle-quiz"
    ],
    "title": "🛠️ Unit 1 Master Quest: The After-School Inventor",
    "subtitle": "Diagnostic Progress Check & Wonderland Tea Party Qualifier",
    "description": "Smartboard mission briefing, 4-step inventor timeline, famous inventors console (Da Vinci, Edison, Karl Benz), biomimicry clues, and Young Inventor blueprint grading ledger.",
    "type": "tool",
    "category": "Classroom Tools",
    "categoryGroup": "Classroom Management & Timers",
    "categoryLabel": "⏱️ Briefing & Timer",
    "level": "Grade 3",
    "duration": 25,
    "durationText": "25 min",
    "xp": 120,
    "route": "quiz-briefing/index.html#g3",
    "url": "quiz-briefing/index.html#g3",
    "path": "quiz-briefing/index.html",
    "thumbnailIcon": "🛠️",
    "gradient": "linear-gradient(135deg, #060911 0%, #0f2744 50%, #38bdf8 100%)",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "The [invention] was created by Clara to solve [problem].",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html",
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "cefrLevel": "Grade 3"
  },
  {
    "id": "solar-system",
    "aliases": [
      "planets",
      "space-explorer",
      "planetary-comparatives",
      "solar"
    ],
    "title": "🪐 Solar System Explorer: Planetary Comparatives Lab",
    "description": "High-end 3D arcade space lab (CEFR A1–A2 | 150 XP). Explore planets with interactive 3D flip trading cards, master comparative adjectives (bigger, colder, farther than) with physical DO/DON'T impact rubber stamps, and broadcast from the orbital teleprompter studio!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🪐 Astronomy & Space Science",
    "level": "A1 / A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 8–11",
    "ageGroup": "8-11",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 25,
    "durationText": "25 min",
    "estimatedMinutes": 25,
    "xp": 150,
    "skills": [
      "Comparative Adjectives (-er than / more than)",
      "Planetary Science & Astronomy",
      "Interactive 3D Card Analysis",
      "Real-Time Speech Teleprompter Karaoke",
      "Tactile Decision Making"
    ],
    "topic": "Solar System, Planetary Comparatives & Deep Space Science",
    "topics": [
      "Solar System & Planets",
      "Comparative Adjectives",
      "Astronomy & Space Exploration",
      "Atmospheres & Gravity",
      "Scientific Observations"
    ],
    "languageFocus": "Comparative Adjectives: bigger than, colder than, hotter than, smaller than, farther than, closer than, more massive than. Formula: Planet A + is + comparative adjective + than + Planet B.",
    "activityMode": "3D Single-Focus Arena / Smart Board Challenge",
    "interactionType": "3D Card Flips, 65/35 Full-Bleed Arena Cards, 3D Push Buttons, DO/DON'T Rubber Stamps, Teleprompter Karaoke, Printable Passport",
    "difficulty": "Grade 3–5 (A1–A2)",
    "tags": [
      "solar-system",
      "planets",
      "space",
      "comparatives",
      "grammar",
      "clil",
      "science",
      "astronomy",
      "3d-cards"
    ],
    "learningObjectives": [
      "Form and use comparative adjectives with -er than and more than to compare planets",
      "Identify the key characteristics and orders of the 5 inner and outer planets",
      "Accurately evaluate comparative planetary statements using evidence and clues",
      "Deliver a 3-sentence deep space broadcast report with real-time teleprompter speech tracking",
      "Complete and print an A4 Space Cadet Mission Passport"
    ],
    "teacherInstructions": "Launch on interactive display or assign independently. In Phase 1, learners tap 3D cards to flip between orbital views and planetary spec sheets. In Phase 2, cadets classify 12 comparative statements using 3D TRUE/FALSE buttons or hotkeys [T] and [F]. In Phase 3, learners read aloud with the real-time karaoke broadcast studio.",
    "studentInstructions": "Power up your rocket! Flip 3D planet cards to gather data, then enter the Showdown Arena to verify planetary comparatives and earn your Master Space Cadet Diploma!",
    "route": "solar-system/index.html",
    "worksheetRoute": "solar-system/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🪐",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #10b981 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"solarThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#060911\"/>\n          <stop offset=\"50%\" stop-color=\"#151f38\"/>\n          <stop offset=\"100%\" stop-color=\"#38bdf8\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#solarThumbGrad)\"/>\n      <ellipse cx=\"100\" cy=\"105\" rx=\"55\" ry=\"18\" fill=\"#38bdf8\" opacity=\"0.3\"/>\n      <ellipse cx=\"100\" cy=\"102\" rx=\"42\" ry=\"12\" fill=\"#0c1222\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"100\" y=\"72\" font-size=\"44\" text-anchor=\"middle\">🪐</text>\n    </svg>",
    "categoryGroup": "Astronomy & Space Science",
    "vocabulary": {
      "core": [
        "orbit",
        "planet",
        "gravity",
        "crater",
        "atmosphere",
        "solar",
        "asteroid",
        "satellite"
      ],
      "supporting": [
        "terrestrial",
        "gas giant",
        "greenhouse",
        "massive",
        "dense",
        "exoplanet"
      ],
      "phonics": [
        "/pl/ in planet",
        "/gr/ in gravity",
        "/st/ in asteroid"
      ]
    },
    "grammar": {
      "focusPattern": "Subject + is + [adjective + -er] + than + Object",
      "formula": "Planet A is [bigger / colder / farther] than Planet B. Planet A is more [massive / dense] than Planet B.",
      "formulas": [
        "Comparative with -er: Planet A is [colder / hotter / bigger] than Planet B",
        "Comparative with more: Planet A is more [massive] than Planet B"
      ]
    },
    "clilDomain": "Astronomy & Earth Science",
    "clilTheme": "Planetary Systems & Celestial Bodies",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "Planet A is [bigger / colder / farther] than Planet B. Planet A is more [massive / dense] than Planet B.",
    "url": "solar-system/index.html",
    "worksheetUrl": "solar-system/worksheet.html"
  },
  {
    "id": "dino-dig",
    "aliases": [
      "dino",
      "dinosaurs",
      "prehistoric-lab",
      "past-tense-dino"
    ],
    "title": "🦕 Dino Dig: Prehistoric Past Tense Lab",
    "description": "Commercial-grade arcade paleontology showdown (CEFR A1–A2 | 200 XP). Excavate ancient fossils, master regular (-ed) vs. irregular past simple verbs, stamp classifications with 3D physical tactile feedback, and present museum exhibits with calibrated karaoke speech synthesis!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🦕 Paleontology & Past Tense",
    "level": "A1 / A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 8–12",
    "ageGroup": "8-12",
    "grade": "Grade 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 25,
    "durationText": "25 min",
    "estimatedMinutes": 25,
    "xp": 200,
    "skills": [
      "Regular Past Simple Verbs (-ed)",
      "Irregular Past Simple Verbs",
      "Paleontology & Fossil Classification",
      "Interactive Speech Presentation",
      "Tactile Arcade Decision Making"
    ],
    "topic": "Prehistoric Life, Dinosaurs, Excavation & Past Simple Grammar",
    "topics": [
      "Dinosaurs & Prehistoric World",
      "Fossils & Excavation",
      "Regular vs Irregular Past Verbs",
      "Museum Presentations",
      "Scientific Inquiry"
    ],
    "languageFocus": "Regular Past Simple: discovered, hunted, roared, protected, lived, climbed, walked, escaped. Irregular Past Simple: dug, found, ate, flew, ran, saw, swam. Formula: Subject + Past Verb + Object.",
    "activityMode": "Tactile Single-Focus Arena / Classroom Smart Board Challenge",
    "interactionType": "65/35 Full-Bleed Arena Cards, 3D Push Buttons, Tactile Rubber-Stamp Slam, Calibrated Speech Karaoke, Printable Dossier",
    "difficulty": "Grade 3–6 (A1–A2)",
    "tags": [
      "dinosaur",
      "fossils",
      "past-tense",
      "regular-verbs",
      "irregular-verbs",
      "paleontology",
      "clil",
      "science",
      "grammar",
      "speech-karaoke"
    ],
    "learningObjectives": [
      "Identify and classify regular past tense verbs with -ed ending versus irregular vowel-change verbs",
      "Accurately use 10+ target prehistoric verbs in descriptive past simple sentences",
      "Explore 5 iconic dinosaur species and their unique prehistoric adaptations",
      "Deliver a guided museum teleprompter exhibit report with calibrated pronunciation support",
      "Complete and print an A4 Fossil Excavation Field Dossier with blueprint diagram"
    ],
    "teacherInstructions": "Launch on interactive display or assign as independent practice. In Phase 1, students scan specimens and listen to native pronunciation. In Phase 2, students use 3D buttons or keyboard hotkeys [R] and [I] to sort 15 fossils into Regular and Irregular verbs. In Phase 3, students read aloud with the karaoke teleprompter before printing their Field Dossier.",
    "studentInstructions": "Grab your paleontology hammer! Identify whether excavated dinosaur verbs are Regular (-ed) or Irregular to build a massive score streak. Then step up to the museum teleprompter to present your discoveries!",
    "route": "dino-dig/index.html",
    "featured": true,
    "thumbnailIcon": "🦕",
    "gradient": "linear-gradient(135deg, #090d16 0%, #1e293b 50%, #f59e0b 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"dinoGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#090d16\"/>\n          <stop offset=\"50%\" stop-color=\"#1e293b\"/>\n          <stop offset=\"100%\" stop-color=\"#f59e0b\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#dinoGrad)\"/>\n      <ellipse cx=\"100\" cy=\"105\" rx=\"55\" ry=\"18\" fill=\"#f59e0b\" opacity=\"0.3\"/>\n      <ellipse cx=\"100\" cy=\"102\" rx=\"42\" ry=\"12\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n      <text x=\"100\" y=\"72\" font-size=\"44\" text-anchor=\"middle\">🦕</text>\n    </svg>",
    "categoryGroup": "Paleontology & CLIL Science",
    "vocabulary": {
      "core": [
        "fossil",
        "excavate",
        "skeleton",
        "discovered",
        "dug",
        "found",
        "hunted",
        "roared"
      ],
      "supporting": [
        "claws",
        "amber",
        "herbivore",
        "carnivore",
        "footprint",
        "prehistoric",
        "specimen"
      ],
      "phonics": [
        "/-ed/ voiced /d/ in roared, lived",
        "/-ed/ unvoiced /t/ in walked, hunted",
        "/-ed/ syllable /ɪd/ in protected"
      ]
    },
    "grammar": {
      "focusPattern": "Subject + Past Simple Verb + Prepositional Phrase",
      "formula": "Regular: Base + -ed (discover ➔ discovered). Irregular: Vowel / Form Change (dig ➔ dug, find ➔ found).",
      "formulas": [
        "Regular Past Simple: Base + -ed / -d",
        "Irregular Past Simple: Unique Past Form (dig -> dug, fly -> flew)"
      ]
    },
    "clilDomain": "Paleontology & Earth History",
    "clilTheme": "Prehistoric Life & Fossil Evidence",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "Regular: Base + -ed (discover ➔ discovered). Irregular: Vowel / Form Change (dig ➔ dug, find ➔ found).",
    "url": "dino-dig/index.html",
    "worksheetUrl": "dino-dig/worksheet.html",
    "worksheetRoute": "dino-dig/worksheet.html"
  },
  {
    "id": "good-ideas-lab",
    "aliases": [
      "inventors-odyssey",
      "my-good-ideas-lab",
      "the-inventors-odyssey",
      "ideas-lab"
    ],
    "title": "💡 The Inventor’s Odyssey: My Good Ideas Lab",
    "description": "High-engagement 4-stage interactive design thinking adventure (Global Readings pp. 18–21). Solve the rolling pencil physics puzzle with 6-sided hexagons, match nature's biomimicry secrets, test Leonardo da Vinci's parachute canopy prototype, and iterate Karl Benz's motorcar to unlock the Master Inventor Diploma!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "💡 Design Thinking & Inventions",
    "level": "A1 / A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 7–12",
    "ageGroup": "7-12",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 150,
    "skills": [
      "Design Thinking Cycle",
      "Biomimicry Innovation",
      "Problem & Solution Vocabulary",
      "Prototype Testing",
      "Iterative Engineering"
    ],
    "topic": "Problem Solving, Biomimicry, Prototyping & Iteration",
    "topics": [
      "Problems & Solutions",
      "Biomimicry in Nature",
      "Shapes (Hexagon)",
      "Aviation (Parachute)",
      "Engineering Iteration"
    ],
    "languageFocus": "Target Vocabulary: problem, solution, hexagon, parachute, improve. 'When you have a problem, look for a solution!' 'Don't give up! Try again and improve.'",
    "activityMode": "Interactive Multi-Stage Lab / Classroom Smart Board Challenge",
    "interactionType": "Canvas Physics Simulation, Biomimicry Matcher, Canopy Drag Tester, Iteration Engine, Printable Diploma",
    "difficulty": "Grade 3–5 (A1–A2)",
    "tags": [
      "inventions",
      "design-thinking",
      "biomimicry",
      "clil",
      "stem",
      "problem-solving",
      "hexagon",
      "parachute",
      "improve",
      "edison",
      "leonardo",
      "benz"
    ],
    "learningObjectives": [
      "Identify and use the 5 core target words: problem, solution, hexagon, parachute, improve",
      "Apply the Design Thinking cycle: identify a problem, design a prototype, test, and iterate",
      "Understand biomimicry principles by connecting natural adaptations (burrs, kingfishers) to human engineering (Velcro, bullet trains)",
      "Explore historical inventors (Thomas Edison, Leonardo da Vinci, Karl Benz) and model resilient growth mindsets ('Try again... and again!')",
      "Create and print a personal Good Ideas Card proposing a creative solution to an everyday problem"
    ],
    "teacherInstructions": "Launch on classroom Smart Board or assign individually. Guide students through Quest 1 (Pencil shape & Biomimicry), Quest 2 (Leonardo's canopy drop test), and Quest 3 (Karl Benz's 3-step iteration loop). Students enter their name on the final screen to print their Master Inventor Diploma & Good Ideas Card.",
    "studentInstructions": "Enter the Good Ideas Lab! Solve the rolling pencil puzzle, match nature's secrets, test Leonardo's parachute, and upgrade Karl Benz's motorcar to collect all 5 vocabulary badges!",
    "route": "good-ideas-lab/index.html",
    "featured": true,
    "thumbnailIcon": "💡",
    "gradient": "linear-gradient(135deg, #0d1527 0%, #1e1b4b 50%, #f59e0b 100%)",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"ideasGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#0d1527\"/>\n          <stop offset=\"50%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"100%\" stop-color=\"#f59e0b\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#ideasGrad)\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"44\" fill=\"#f59e0b\" opacity=\"0.25\"/>\n      <circle cx=\"100\" cy=\"70\" r=\"28\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n      <text x=\"100\" y=\"80\" font-size=\"36\" text-anchor=\"middle\">💡</text>\n    </svg>",
    "categoryGroup": "Design Thinking & Biomimicry",
    "vocabulary": {
      "core": [
        "problem",
        "solution",
        "hexagon",
        "parachute",
        "improve"
      ],
      "supporting": [
        "biomimicry",
        "inventor",
        "prototype",
        "iterate",
        "canopy"
      ],
      "phonics": [
        "/h/ in hexagon",
        "/pr/ in problem",
        "/ch/ in parachute"
      ]
    },
    "grammar": {
      "focusPattern": "When you have a [problem], look for a [solution]!",
      "formula": "People need [solution] when they have a [problem]. Karl Benz improved the motorcar by adding [gear].",
      "formulas": [
        "When + Subject + Verb, Imperative + Object",
        "Subject + can improve + Object + by + Gerund"
      ]
    },
    "clilDomain": "Engineering Design Process & Biomimicry",
    "clilTheme": "Engineering Design Process & Biomimicry",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "People need [solution] when they have a [problem]. Karl Benz improved the motorcar by adding [gear].",
    "url": "good-ideas-lab/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html",
    "worksheetRoute": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "brain-hackers",
    "title": "🧠 The Brain Hackers: Mission Unlock Your Brain",
    "description": "Premium 8-mission interactive ESL science adventure based on Global Readings 3 Unit 1 (pp. 18–21). Students become Brain Scientists to detect cerebrum lobes on PET scans, zoom into 10,000x microscopic neurons, assemble dendrites & axons, conduct high-speed human neuron message chains, visualize invisible concepts, unleash creative drawing, test subject lobe heatmaps, charge brain energy habits to 100%, and earn the Certified Brain Scientist diploma!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🧠 CLIL & STEM Games",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–11",
    "ageGroup": "8-11",
    "grade": "Grade 4",
    "grades": [
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 100,
    "skills": [
      "Science & CLIL",
      "Speaking",
      "Reading",
      "Vocabulary",
      "Critical Thinking"
    ],
    "topic": "The Brain, Neurons & Creativity (Global Readings 3 Unit 1)",
    "topics": [
      "Human Anatomy & Neuroscience",
      "Cognitive Functions",
      "Brain Health"
    ],
    "languageFocus": "Brain lobes & senses (hearing, seeing, speaking, thinking), Neuron parts (cell body, dendrites, axon, synapse), Action & habit verbs, Descriptive language for imagination",
    "activityMode": "Whole Class Smart Board Interactive / Team Relay Challenge",
    "interactionType": "Interactive PET Lobe Scanner, Microscopic Neuron Assembly, Real-Time Message Relay Chain, Spot-the-Difference Imagination Matrix, Neon Drawing Canvas, Multi-Lobe Heatmap, Energy Core Charging, Cloze Statement Graduation",
    "difficulty": "Grade 4 A1+/A2",
    "tags": [
      "brain",
      "neurons",
      "brain-hackers",
      "science",
      "clil",
      "global-readings",
      "grade-4",
      "unit-1",
      "creativity",
      "habits"
    ],
    "learningObjectives": [
      "Label and describe the functions of the 4 major cerebral lobes (Frontal, Parietal, Occipital, Temporal)",
      "Connect cognitive tasks (reading, math, vision, memory) to specific brain regions",
      "Explain how neurons transmit electrical signals through synaptic connections",
      "Practice executive function drills including working memory and inhibitory control"
    ],
    "teacherInstructions": "Project on Smart Board. Guide student teams (Team Brain, Team Neuron, Team Genius, Team Explorer) through the 8 sequential missions. Use the built-in Teacher HUD (F1) to jump missions, award XP, and print the 4-page student lab dossier.",
    "studentInstructions": "Become an elite Brain Hacker! Complete 8 missions to unlock how your brain learns, builds neural connections, and imagines creative ideas!",
    "route": "brain-hackers/index.html",
    "worksheet": "brain-hackers/worksheets.html",
    "worksheetRoute": "brain-hackers/worksheets.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"bhGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#050c1a\"/>\n          <stop offset=\"50%\" stop-color=\"#0a192f\"/>\n          <stop offset=\"100%\" stop-color=\"#020813\"/>\n        </linearGradient>\n        <linearGradient id=\"bhNeon\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n          <stop offset=\"0%\" stop-color=\"#00ffff\"/>\n          <stop offset=\"100%\" stop-color=\"#ff007f\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#bhGrad)\"/>\n      <circle cx=\"100\" cy=\"55\" r=\"34\" fill=\"#00ffff\" opacity=\"0.15\"/>\n      <path d=\"M 75 60 C 65 45, 80 25, 100 25 C 120 25, 135 45, 125 60 C 135 75, 120 90, 100 90 C 80 90, 65 75, 75 60 Z\" fill=\"none\" stroke=\"#00ffff\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n      <circle cx=\"90\" cy=\"45\" r=\"4\" fill=\"#ff007f\"/>\n      <circle cx=\"110\" cy=\"45\" r=\"4\" fill=\"#ffff00\"/>\n      <circle cx=\"100\" cy=\"65\" r=\"5\" fill=\"#00ff88\"/>\n      <line x1=\"90\" y1=\"45\" x2=\"100\" y2=\"65\" stroke=\"#00ffff\" stroke-width=\"2\"/>\n      <line x1=\"110\" y1=\"45\" x2=\"100\" y2=\"65\" stroke=\"#00ffff\" stroke-width=\"2\"/>\n      <rect x=\"14\" y=\"98\" width=\"172\" height=\"26\" rx=\"13\" fill=\"url(#bhNeon)\"/>\n      <text x=\"100\" y=\"115\" font-family=\"system-ui, sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">THE BRAIN HACKERS 🧠⚡</text>\n    </svg>",
    "categoryGroup": "Neuroscience & Biology",
    "vocabulary": {
      "core": [
        "brain",
        "neuron",
        "synapse",
        "frontal lobe",
        "occipital lobe",
        "temporal lobe"
      ],
      "supporting": [
        "cerebrum",
        "parietal lobe",
        "signal",
        "memory",
        "impulse"
      ],
      "phonics": [
        "/br/ in brain",
        "/l/ in lobe"
      ]
    },
    "grammar": {
      "focusPattern": "The [Lobe] controls [Function / Gerund]",
      "formula": "The [frontal lobe] helps us to [plan and calculate] when we solve puzzles.",
      "formulas": [
        "The + [Lobe] + helps us to + Base Verb",
        "When we [Action], our [Lobe] sends electrical signals"
      ]
    },
    "clilDomain": "Cognitive Neuroscience & Human Anatomy",
    "clilTheme": "Cognitive Neuroscience & Human Anatomy",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🧠",
    "formula": "The [frontal lobe] helps us to [plan and calculate] when we solve puzzles.",
    "url": "brain-hackers/index.html",
    "worksheetUrl": "brain-hackers/worksheets.html"
  },
  {
    "id": "brain-quit",
    "title": "🧠 The Day Your Brain Quit! — Can You Save Your Brain?",
    "description": "Premium 10-screen interactive reading & skimming adventure for Grade 4 (A1–A1+) based on Unit 1 p17 RG2 ('How Your Brain Learns'). Students receive an urgent letter from their tired brain, race against a 30-second skimming clock, unlock 4 sci-fi doors, gather evidence on the detective corkboard, fill out the Brain's Job Application, test life without a brain, and record their speech to save their brain!",
    "type": "reading",
    "category": "CLIL & Science",
    "categoryLabel": "📖 Reading & Stories",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 100,
    "skills": [
      "Reading",
      "Speaking",
      "Vocabulary",
      "Critical Thinking"
    ],
    "topic": "Reading – Skimming & The Human Brain",
    "topics": [
      "Brain Metabolism",
      "Reading Comprehension & Skimming",
      "Wellness & Rest"
    ],
    "languageFocus": "Skimming rules (title, pictures, important words), Can / Can't, Function verbs (think, learn, remember, imagine), Body & mind vocabulary",
    "activityMode": "Whole Class Smart Board Interactive / Team Detective Challenge",
    "interactionType": "30-Second Timed Skimming Challenge, 4 Sci-Fi Doors, Interactive Evidence Board, Brain Job Application Form, Humorous Reaction Comics, Microphone Voice Recorder",
    "difficulty": "Grade 4 A1–A1+",
    "tags": [
      "brain",
      "brain-quit",
      "skimming",
      "reading",
      "grade-4",
      "unit-1",
      "rg2",
      "detective",
      "memory",
      "learning"
    ],
    "learningObjectives": [
      "Apply rapid skimming and scanning strategies to retrieve key factual information from text",
      "Explain the energetic needs of the human brain (oxygen, glucose, 20% resting metabolic energy)",
      "Identify the consequences of mental fatigue and effective brain recovery strategies (sleep, hydration, nutrition)",
      "Construct cause-and-effect sentences describing brain functioning"
    ],
    "teacherInstructions": "Project on Smart Board. Guide student detectives through the 10-screen mission: urgent letter, 30s skimming countdown, four doors check, evidence board, job application, humorous comic test, and voice speech recording.",
    "studentInstructions": "Your brain is tired and wants to quit! Use your detective eyes to skim the textbook page in 30 seconds, collect 5 evidence clues, and convince your brain to stay!",
    "route": "brain/index.html",
    "worksheet": "brain/worksheets.html",
    "worksheetRoute": "brain/worksheets.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"bqGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"50%\" stop-color=\"#312e81\"/>\n          <stop offset=\"100%\" stop-color=\"#0f172a\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#bqGrad)\"/>\n      <circle cx=\"100\" cy=\"55\" r=\"32\" fill=\"#ec4899\" opacity=\"0.25\"/>\n      <circle cx=\"100\" cy=\"55\" r=\"24\" fill=\"#f472b6\"/>\n      <path d=\"M 88 50 Q 100 42 112 50 Q 100 62 88 50\" fill=\"none\" stroke=\"#be185d\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n      <circle cx=\"94\" cy=\"53\" r=\"3\" fill=\"#0f172a\"/>\n      <circle cx=\"106\" cy=\"53\" r=\"3\" fill=\"#0f172a\"/>\n      <circle cx=\"130\" cy=\"40\" r=\"14\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"3\"/>\n      <line x1=\"140\" y1=\"50\" x2=\"152\" y2=\"62\" stroke=\"#d97706\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n      <rect x=\"14\" y=\"94\" width=\"172\" height=\"26\" rx=\"13\" fill=\"#ec4899\"/>\n      <text x=\"100\" y=\"111\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">THE DAY YOUR BRAIN QUIT! 🧠</text>\n    </svg>",
    "categoryGroup": "Neuroscience & Health",
    "vocabulary": {
      "core": [
        "energy",
        "fuel",
        "oxygen",
        "glucose",
        "rest",
        "focus"
      ],
      "supporting": [
        "metabolism",
        "fatigue",
        "hydrate",
        "nutrition",
        "recover"
      ],
      "phonics": [
        "/kw/ in quit",
        "/gl/ in glucose"
      ]
    },
    "grammar": {
      "focusPattern": "If your brain doesn't get [Need], it cannot [Function]",
      "formula": "If the brain does not get [glucose/sleep], it cannot focus or learn.",
      "formulas": [
        "If + Present Simple, Modal (can/cannot) + Base Verb",
        "The brain consumes [Percentage] of energy even when resting"
      ]
    },
    "clilDomain": "Brain Metabolism & Active Reading",
    "clilTheme": "Brain Metabolism & Active Reading",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🧠",
    "formula": "If the brain does not get [glucose/sleep], it cannot focus or learn.",
    "url": "brain/index.html",
    "worksheetUrl": "brain/worksheets.html"
  },
  {
    "id": "brain-explorers",
    "title": "🧠 Brain Explorers: How Your Brain Reads",
    "description": "Interactive CLIL neuro-quest where students map the 4 brain lobes, link neural pathways during reading challenges, and deliver a live teleprompter broadcast on how the brain learns.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🧠 CLIL & Neuroscience",
    "level": "A1 / A2",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-11",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 100,
    "skills": [
      "CLIL Human Biology",
      "Reading Comprehension",
      "Speaking & Presentation",
      "Functional Modals (helps us / use to)"
    ],
    "topic": "CLIL Human Biology & Neuroscience",
    "topics": [
      "The Science of Reading",
      "Brain Plasticity",
      "Phonics & Literacy"
    ],
    "languageFocus": "The [lobe] helps us [verb]. We use our [lobe] to [verb]. Reading is a whole-team effort.",
    "activityMode": "Whole Class Smart Board Interactive / Team Neuro-Lab Challenge",
    "interactionType": "Interactive 4-Lobe SVG Map, Sensory Token Connector, 0.3s Reading Circuit Simulation, Habit Battery Charger, Live Speaking Teleprompter",
    "difficulty": "Scaffolded A1 / A2",
    "tags": [
      "brain",
      "brain-explorers",
      "neuroscience",
      "clil",
      "stem",
      "teleprompter",
      "reading-relay",
      "speaking"
    ],
    "learningObjectives": [
      "Trace the neurological pathway of reading: eyes -> visual cortex -> phonological processor -> meaning",
      "Differentiate how the brain decodes graphemes into phonemes and blends them into words",
      "Explain why regular reading practice strengthens neural pathways (neuroplasticity)",
      "Complete phonemic awareness and sound-to-symbol matching puzzles"
    ],
    "teacherInstructions": "Project on Smart Board. Guide student cadets through 4 interactive phases: 4-Lobe Anatomical Mapping, 0.3-Second Reading Teamwork Relay, Brain Battery Habit Balancer, and the capstone Live Teleprompter News Broadcast.",
    "studentInstructions": "Embark on an interactive neuro-quest! Map the 4 brain lobes, test the 0.3-second reading relay, power up your brain battery, and step up to the studio teleprompter to broadcast live to the class!",
    "route": "brain-explorers/index.html",
    "worksheet": "brain-explorers/worksheet.html",
    "worksheetRoute": "brain-explorers/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🧠",
    "gradient": "linear-gradient(135deg, #090d16 0%, #3b0764 50%, #0284c7 100%)",
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"beThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#090d16\"/>\n          <stop offset=\"50%\" stop-color=\"#3b0764\"/>\n          <stop offset=\"100%\" stop-color=\"#0284c7\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#beThumbBg)\"/>\n      <rect x=\"10\" y=\"10\" width=\"180\" height=\"120\" rx=\"12\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"1.5\" stroke-dasharray=\"4,3\" opacity=\"0.6\"/>\n      <path d=\"M 65 38 C 50 38 40 52 40 68 C 40 82 52 92 68 92 C 75 92 80 88 84 82 C 80 70 80 50 84 42 C 78 39 72 38 65 38 Z\" fill=\"#f59e0b\" opacity=\"0.85\"/>\n      <path d=\"M 86 40 C 96 38 114 38 126 46 C 132 50 134 56 132 64 C 118 64 102 62 86 66 Z\" fill=\"#10b981\" opacity=\"0.85\"/>\n      <path d=\"M 134 66 C 146 72 152 82 148 94 C 144 102 134 104 124 100 C 122 92 122 80 132 68 Z\" fill=\"#ef4444\" opacity=\"0.85\"/>\n      <path d=\"M 86 70 C 102 66 118 68 120 78 C 122 88 114 96 98 98 C 86 98 84 88 86 70 Z\" fill=\"#a855f7\" opacity=\"0.85\"/>\n      <text x=\"100\" y=\"70\" font-size=\"24\" text-anchor=\"middle\">⚡</text>\n      <rect x=\"18\" y=\"106\" width=\"164\" height=\"20\" rx=\"10\" fill=\"#0284c7\"/>\n      <text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"8.5\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">BRAIN EXPLORERS 🧠</text>\n    </svg>",
    "categoryGroup": "Neuroscience & Reading Science",
    "vocabulary": {
      "core": [
        "pathway",
        "decode",
        "sound",
        "letter",
        "cortex",
        "connection"
      ],
      "supporting": [
        "visual",
        "auditory",
        "neuroplasticity",
        "processor",
        "comprehend"
      ],
      "phonics": [
        "/p/ in pathway",
        "/d/ in decode"
      ]
    },
    "grammar": {
      "focusPattern": "First the eye sees [letters], then the brain decodes [sounds]",
      "formula": "First the visual cortex sees [letters], then the brain decodes [sounds].",
      "formulas": [
        "First + Clause, then + Clause, finally + Clause",
        "The more you read, the stronger your brain connections become"
      ]
    },
    "clilDomain": "Cognitive Linguistics & Neuroplasticity",
    "clilTheme": "Cognitive Linguistics & Neuroplasticity",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "First the visual cortex sees [letters], then the brain decodes [sounds].",
    "url": "brain-explorers/index.html",
    "worksheetUrl": "brain-explorers/worksheet.html"
  },
  {
    "id": "freeze-game",
    "aliases": [
      "the-20-energy-freeze-game",
      "energy-freeze",
      "brain-power-check"
    ],
    "title": "⚡ The 20% Energy Freeze Game",
    "description": "High-energy CLIL science and movement game demonstrating human metabolic energy. Kids dance and freeze to compare muscle stillness with the 20% fuel their brain burns while thinking!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "⚡ Biology & Neuroscience",
    "level": "A1 / A2",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-11",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 25,
    "durationText": "25 min",
    "estimatedMinutes": 25,
    "xp": 150,
    "skills": [
      "CLIL Human Biology",
      "Mental Arithmetic",
      "Sensory & Lobe Vocabulary",
      "Listening & Kinesthetic Response"
    ],
    "topic": "Brain Energy, Neurons, and the 4 Lobes",
    "topics": [
      "Physiology & Movement",
      "Muscle vs Brain Energy",
      "Sensory Awareness"
    ],
    "languageFocus": "My muscles stopped, but my brain burned energy! The frontal lobe thinks. The occipital lobe sees.",
    "activityMode": "Interactive Classroom Movement & Neuro-Science Challenge",
    "interactionType": "Dual Live Energy Gauges, Dancing vs Frozen Statue Stage, 528Hz Neuron Hum, Closed-Eyes Prompt Solver, Printable A4 Diploma",
    "difficulty": "Scaffolded A1 / A2",
    "tags": [
      "freeze-game",
      "brain-energy",
      "clil",
      "stem",
      "biology",
      "kinesthetic",
      "movement",
      "science"
    ],
    "learningObjectives": [
      "Contrast physical muscular kinetic energy (0% during complete stillness) with continuous cerebral metabolic energy (~20% fuel consumption at rest)",
      "Respond to rapid physical auditory cues by freezing immediately with eyes closed",
      "Execute cognitive mental arithmetic and visualization challenges during physical immobility",
      "Articulate how the brain remains active and alert even when the body is completely still"
    ],
    "teacherInstructions": "Launch on Smart Board. Lead the class in 120 BPM dancing, call FREEZE to drop muscle fuel to 0%, have students close eyes for the 528Hz neuron hum task, and call UNFREEZE for the physical answer reveal!",
    "studentInstructions": "Dance to the beat! When the music cuts, freeze like an ice statue with eyes closed, solve the secret brain task, and unfreeze to shout your answer!",
    "route": "freeze-game/index.html",
    "worksheet": "freeze-game/worksheet.html",
    "worksheetRoute": "freeze-game/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "⚡",
    "gradient": "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #f97316 100%)",
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"freezeThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#090d16\"/>\n          <stop offset=\"50%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"100%\" stop-color=\"#f97316\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#freezeThumbGrad)\"/>\n      <circle cx=\"100\" cy=\"65\" r=\"40\" fill=\"none\" stroke=\"#f97316\" stroke-width=\"2\" stroke-dasharray=\"6,4\"/>\n      <circle cx=\"100\" cy=\"65\" r=\"26\" fill=\"#38bdf8\" opacity=\"0.85\"/>\n      <text x=\"100\" y=\"73\" font-size=\"24\" text-anchor=\"middle\">❄️</text>\n      <rect x=\"18\" y=\"106\" width=\"164\" height=\"20\" rx=\"10\" fill=\"#ea580c\"/>\n      <text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"8.5\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">20% FREEZE GAME ⚡</text>\n    </svg>",
    "categoryGroup": "Exercise Physiology",
    "vocabulary": {
      "core": [
        "freeze",
        "muscle",
        "energy",
        "fuel",
        "stillness",
        "metabolism"
      ],
      "supporting": [
        "continuous",
        "synaptic",
        "kinetic",
        "cerebral",
        "immobility"
      ],
      "phonics": [
        "/fr/ in freeze",
        "/m/ in muscle"
      ]
    },
    "grammar": {
      "focusPattern": "While the body is [still], the brain uses [20%] of your energy",
      "formula": "While the body is frozen at 0% muscle energy, the brain uses 20% of resting fuel.",
      "formulas": [
        "While + Subject + is + Adjective, Subject + Verb + Object",
        "Muscle energy drops to 0%, but brain energy stays at 20%"
      ]
    },
    "clilDomain": "Muscle Kinetic Energy vs Cerebral Metabolism",
    "clilTheme": "Muscle Kinetic Energy vs Cerebral Metabolism",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "While the body is frozen at 0% muscle energy, the brain uses 20% of resting fuel.",
    "url": "freeze-game/index.html",
    "worksheetUrl": "freeze-game/worksheet.html"
  },
  {
    "id": "inventor-forge",
    "aliases": [
      "inventors-forge",
      "rpg-invention-lab",
      "forge-game",
      "apprentice-quest"
    ],
    "title": "🛠️ Inventor's Forge: The Apprentice Quest",
    "description": "Playable classroom RPG loop. Reconnect historical inventor relics, craft prototypes with the 'Try Again' buff, fuse modern relics in the forge, and deliver a 60-second invention pitch!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "🛠️ CLIL & Inventions",
    "level": "A1 / A2",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-11",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 150,
    "skills": [
      "Invention Vocabulary",
      "Infinitive of Purpose (to + verb)",
      "Compound Problem Solving",
      "60-Second Timed Pitching"
    ],
    "topic": "Inventors, Engineering Design Loop & Creative Pitches",
    "languageFocus": "People invented [item] to [verb]. My invention solves [problem] by [mechanic].",
    "route": "inventor-forge/index.html",
    "worksheet": "inventor-forge/worksheet.html",
    "worksheetRoute": "inventor-forge/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🛠️",
    "gradient": "linear-gradient(135deg, #070b14 0%, #1e1b4b 50%, #f59e0b 100%)",
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"forgeThumbGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n          <stop offset=\"0%\" stop-color=\"#070b14\"/>\n          <stop offset=\"50%\" stop-color=\"#1e1b4b\"/>\n          <stop offset=\"100%\" stop-color=\"#f59e0b\"/>\n        </linearGradient>\n      </defs>\n      <rect width=\"200\" height=\"140\" fill=\"url(#forgeThumbGrad)\"/>\n      <circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#38bdf8\" opacity=\"0.25\"/>\n      <text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🛠️</text>\n      <rect x=\"18\" y=\"104\" width=\"164\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/>\n      <text x=\"100\" y=\"119\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"8.5\" fill=\"#070b14\" text-anchor=\"middle\" letter-spacing=\"0.5\">INVENTOR'S FORGE ⚡</text>\n    </svg>",
    "categoryGroup": "Historical Relics & Prototyping",
    "learningObjectives": [
      "Identify historical inventions and their inventors (Karl Benz, Bell, Edison, Wright Brothers)",
      "Formulate purpose statements using the infinitive of purpose (to + verb)",
      "Engage in iterative engineering: retest broken components to earn the Try Again buff",
      "Synthesize and pitch a novel dual-relic invention using a structured 60-second elevator pitch framework"
    ],
    "vocabulary": {
      "core": [
        "gear",
        "spring",
        "patent",
        "prototype",
        "forge",
        "invent"
      ],
      "supporting": [
        "blueprint",
        "assembly",
        "relic",
        "fuse",
        "iteration"
      ],
      "phonics": [
        "/pr/ in prototype",
        "/sp/ in spring"
      ]
    },
    "grammar": {
      "focusPattern": "People invented [item] to [verb]",
      "formula": "People invented [item] to [verb]. My invention solves [problem] by [gerund].",
      "formulas": [
        "Subject + invented + Object + to + Base Verb",
        "My invention solves [problem] by [gerund/action]"
      ]
    },
    "topics": [
      "Inventions & Engineering",
      "Design Thinking",
      "Timed Oral Pitching"
    ],
    "clilDomain": "Mechanical Prototyping & Pitching",
    "clilTheme": "Mechanical Prototyping & Pitching",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "People invented [item] to [verb]. My invention solves [problem] by [gerund].",
    "url": "inventor-forge/index.html",
    "worksheetUrl": "inventor-forge/worksheet.html"
  },
  {
    "id": "wonderland-lesson3",
    "title": "We Are the Wonderland Story! — Lesson 3: Theatre & Prop Performance",
    "description": "Spectacular 11-screen interactive theatre and storytelling adventure for Grade 3 (A1). Students sequence the story, practice character voices, play Freeze Frame Theatre, build mini-scripts, equip workshop props, perform on the Wonderland stage, and complete their 4-page Actor Dossier.",
    "type": "game",
    "category": "Story & Literature",
    "categoryLabel": "🎭 Speaking & Drama Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 105,
    "skills": [
      "Speaking",
      "Drama / Theatre",
      "Storytelling",
      "Listening",
      "TPR"
    ],
    "topic": "Alice in Wonderland Theatre & Prop Workshop",
    "topics": [
      "Drama & Theatre Arts",
      "Alice in Wonderland",
      "Oral Interpretation"
    ],
    "languageFocus": "Oral storytelling using Past Simple verbs (saw, followed, opened, found, met, drank), character dialogue lines, theatre expressions",
    "activityMode": "Whole Class Smart Board Interactive / Team Drama Challenge",
    "interactionType": "Stage Curtain, Timeline Sequencer, Voice Mimic Challenge, Freeze Frame Whistle, Mini-Script Rehearsal & Prop Chest",
    "difficulty": "Scaffolded A1",
    "tags": [
      "wonderland",
      "alice",
      "theatre",
      "drama",
      "props",
      "past-simple",
      "freeze-frame",
      "speaking",
      "lesson-3",
      "grade-3"
    ],
    "learningObjectives": [
      "Perform dramatic character dialogues from Alice in Wonderland using expressive prosody and vocal gestures",
      "Identify and utilize theatrical props to enhance narrative comprehension",
      "Demonstrate turn-taking, active listening, and stage presence in a group readers theatre",
      "Recite character lines with target pronunciation, intonation, and emotional affect"
    ],
    "teacherInstructions": "Project on Interactive Board. Guide students through sequencing, voice practice, freeze game, script builder, and prop equipping for the class play.",
    "studentInstructions": "Step onto the Wonderland Stage! Become Alice, the Rabbit, or the Mad Hatter, freeze when the whistle blows, pick your props, and perform our story!",
    "route": "wonderland-story/index.html",
    "worksheet": "wonderland-story/worksheet.html",
    "worksheetRoute": "wonderland-story/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"wsThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#450a0a\"/><stop offset=\"50%\" stop-color=\"#1e1b4b\"/><stop offset=\"100%\" stop-color=\"#0f172a\"/></linearGradient></defs><rect width=\"200\" height=\"140\" fill=\"url(#wsThumbBg)\"/><rect x=\"12\" y=\"12\" width=\"176\" height=\"116\" rx=\"12\" fill=\"#0f172a\" opacity=\"0.6\" stroke=\"#ec4899\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#ec4899\" opacity=\"0.3\"/><text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🎭</text><rect x=\"20\" y=\"92\" width=\"160\" height=\"22\" rx=\"11\" fill=\"#ec4899\"/><text x=\"100\" y=\"107\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">WONDERLAND STORY L3</text></svg>",
    "categoryGroup": "Alice in Wonderland",
    "vocabulary": {
      "core": [
        "stage",
        "costume",
        "prop",
        "audience",
        "character",
        "act"
      ],
      "supporting": [
        "rehearse",
        "dialogue",
        "curtain",
        "gesture",
        "expression"
      ],
      "phonics": [
        "/st/ in stage",
        "/pr/ in prop"
      ]
    },
    "grammar": {
      "focusPattern": "I am [Character] and I [Action/Dialogue]",
      "formula": "I am [character] and I am holding [prop] on the royal stage!",
      "formulas": [
        "Subject + is holding + [Prop] + on stage",
        "When [Character] speaks, the audience + [Action Verb]"
      ]
    },
    "clilDomain": "Dramatic Interpretation & Theatre Arts",
    "clilTheme": "Dramatic Interpretation & Theatre Arts",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "🎭",
    "formula": "I am [character] and I am holding [prop] on the royal stage!",
    "url": "wonderland-story/index.html",
    "worksheetUrl": "wonderland-story/worksheet.html"
  },
  {
    "id": "wonderland-lesson2",
    "title": "The Wonderland Time Machine — Lesson 2: Past Simple Adventure",
    "description": "Fast-paced 14-screen interactive Past Simple time travel adventure for Grade 3 (A1). Students spin the Victorian clock machine, sort NOW vs YESTERDAY, transform regular/irregular verbs, sequence Alice's story, solve Mad Hatter's lie, act out past actions, and defeat the friendly Time Monster.",
    "type": "game",
    "category": "Story & Literature",
    "categoryLabel": "⏰ Grammar & Story Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 100,
    "skills": [
      "Speaking",
      "Listening",
      "Grammar",
      "Vocabulary",
      "TPR / Drama"
    ],
    "topic": "Past Simple & Time Machine Adventure",
    "topics": [
      "Past Simple Grammar",
      "Narrative Sequencing",
      "Alice in Wonderland"
    ],
    "languageFocus": "Past Simple affirmative (went, saw, opened, found, met, had, ate, drank, played, looked), Regular vs Irregular, Now vs Yesterday contrast",
    "activityMode": "Whole Class Smart Board Interactive / Team Time Travel Challenge",
    "interactionType": "Interactive Time Machine with Countdown, Verb Transformer, Story Sequencer, Mad Hatter Lie Game & Boss Battle",
    "difficulty": "Scaffolded A1 (Level A Support / Level B Challenge)",
    "tags": [
      "wonderland",
      "time-machine",
      "past-simple",
      "regular-irregular",
      "storytelling",
      "tpr",
      "speaking",
      "lesson-2",
      "grade-3"
    ],
    "learningObjectives": [
      "Identify and conjugate regular and irregular past simple verbs in a narrative context",
      "Sequence Wonderland story events chronologically using time markers (yesterday, then, suddenly)",
      "Formulate affirmative, negative, and interrogative sentences in Past Simple tense",
      "Retell key narrative milestones of Alice's journey down the rabbit hole"
    ],
    "teacherInstructions": "Launch on the Smart Board. Use countdown, verb transformer, story sequence, Lie voting, and Time Monster battle. Press T anytime for Teacher Mode.",
    "studentInstructions": "Step into the Time Machine! Spin the clock hands backward, change words to yesterday, catch the Mad Hatter's lie, and save the Time Machine!",
    "route": "wonderland-time-machine/index.html",
    "worksheet": "wonderland-time-machine/worksheet.html",
    "worksheetRoute": "wonderland-time-machine/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"tmThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#0f172a\"/><stop offset=\"50%\" stop-color=\"#1e1b4b\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"200\" height=\"140\" fill=\"url(#tmThumbBg)\"/><rect x=\"12\" y=\"12\" width=\"176\" height=\"116\" rx=\"12\" fill=\"#0f172a\" opacity=\"0.6\" stroke=\"#f59e0b\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#f59e0b\" opacity=\"0.3\"/><text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">⏰</text><rect x=\"20\" y=\"92\" width=\"160\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/><text x=\"100\" y=\"107\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#000000\" text-anchor=\"middle\" letter-spacing=\"0.5\">TIME MACHINE L2</text></svg>",
    "categoryGroup": "Alice in Wonderland",
    "vocabulary": {
      "core": [
        "fell",
        "drank",
        "ate",
        "shrank",
        "grew",
        "followed"
      ],
      "supporting": [
        "rabbit hole",
        "wonderland",
        "potion",
        "cake",
        "key",
        "door"
      ],
      "phonics": [
        "/shr/ in shrank",
        "/gr/ in grew"
      ]
    },
    "grammar": {
      "focusPattern": "Alice fell down the rabbit hole and drank the potion",
      "formula": "Alice fell down the rabbit hole, drank the potion, and shrank to 10 inches.",
      "formulas": [
        "Subject + Past Simple Verb + Object + Prepositional Phrase",
        "Did + Subject + Base Verb + ...? Yes, they did. / No, they didn't."
      ]
    },
    "clilDomain": "Narrative Chronology & Past Simple",
    "clilTheme": "Narrative Chronology & Past Simple",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "⏰",
    "formula": "Alice fell down the rabbit hole, drank the potion, and shrank to 10 inches.",
    "url": "wonderland-time-machine/index.html",
    "worksheetUrl": "wonderland-time-machine/worksheet.html"
  },
  {
    "id": "wonderland-lesson1",
    "title": "Welcome to Wonderland — Lesson 1: Play & Prop Prep",
    "description": "Magical 12-screen interactive adventure for Grade 3 (A1). Students explore the enchanted forest, meet 9 Wonderland characters, match signature theatre props, discover the Past Simple with the Time Machine, practice physical TPR acting, and unlock the Workshop Chest for their upcoming classroom play.",
    "type": "game",
    "category": "Story & Literature",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 100,
    "skills": [
      "Speaking",
      "Listening",
      "Vocabulary",
      "Grammar",
      "TPR / Drama"
    ],
    "topic": "Alice in Wonderland & Classroom Play Prep",
    "topics": [
      "Introduction to Classic Fiction",
      "Character Archetypes",
      "Fantasy Setting"
    ],
    "languageFocus": "Wonderland Characters & Props, Past Simple affirmative (went, saw, opened, found, met), Now vs Yesterday contrast",
    "activityMode": "Whole Class Smart Board Interactive / Drama Workshop Prep",
    "interactionType": "Interactive Story Stage with Scavenger Hunt, Prop Match, Time Machine & Workshop Chest",
    "difficulty": "Scaffolded A1",
    "tags": [
      "wonderland",
      "alice",
      "play",
      "props",
      "past-simple",
      "tpr",
      "speaking",
      "listening",
      "interactive-lesson",
      "grade-3"
    ],
    "learningObjectives": [
      "Introduce the central characters and fantastical setting of Lewis Carroll's Alice in Wonderland",
      "Identify and describe key literary props (pocket watch, white gloves, key, potion bottle)",
      "Use descriptive adjectives to describe Wonderland character personalities and traits",
      "Construct introductory predictions about Wonderland plot events"
    ],
    "teacherInstructions": "Launch on the Smart Board. Use touch interactions for Scavenger Hunt, matching, Time Machine, and chest opening. Press T anytime for the teacher guide.",
    "studentInstructions": "Step into Wonderland! Meet the White Rabbit, find hidden treasures, match theatre props, and get ready for our classroom play!",
    "route": "wonderland/index.html",
    "worksheet": "wonderland/worksheet.html",
    "worksheetRoute": "wonderland/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"wlThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#1e1b4b\"/><stop offset=\"60%\" stop-color=\"#2e1065\"/><stop offset=\"100%\" stop-color=\"#064e3b\"/></linearGradient></defs><rect width=\"200\" height=\"140\" fill=\"url(#wlThumbBg)\"/><rect x=\"12\" y=\"12\" width=\"176\" height=\"116\" rx=\"12\" fill=\"#0f172a\" opacity=\"0.6\" stroke=\"#f59e0b\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#f59e0b\" opacity=\"0.25\"/><text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🐇</text><rect x=\"25\" y=\"92\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/><text x=\"100\" y=\"107\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#000000\" text-anchor=\"middle\" letter-spacing=\"0.5\">WONDERLAND PLAY 1</text></svg>",
    "categoryGroup": "Alice in Wonderland",
    "vocabulary": {
      "core": [
        "rabbit",
        "curious",
        "pocket watch",
        "gloves",
        "potion",
        "wonderland"
      ],
      "supporting": [
        "burrow",
        "waistcoat",
        "tumble",
        "adventure",
        "mysterious"
      ],
      "phonics": [
        "/w/ in watch",
        "/gl/ in gloves"
      ]
    },
    "grammar": {
      "focusPattern": "The White Rabbit is carrying a [prop] because he is [adjective]",
      "formula": "The White Rabbit is carrying a pocket watch because he is late for the Queen.",
      "formulas": [
        "Subject + is + Adjective + and + Present Continuous Verb",
        "There is / There are + [Object(s)] + in + [Place]"
      ]
    },
    "clilDomain": "Literary World Building & Character Archetypes",
    "clilTheme": "Literary World Building & Character Archetypes",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "🐇",
    "formula": "The White Rabbit is carrying a pocket watch because he is late for the Queen.",
    "url": "wonderland/index.html",
    "worksheetUrl": "wonderland/worksheet.html"
  },
  {
    "id": "story-engine-alice",
    "title": "Alice in Wonderland: The Story Adventure",
    "description": "Full 9-chapter playable children's adventure with invisible adaptive AI learning: follow the White Rabbit, fall down the well, shrink & grow in the Hall of Doors, solve Caterpillar & Cheshire Cat riddles, join the Mad Tea Party, and stand your ground at the Royal Court!",
    "type": "story_adventure",
    "category": "Story & Literature",
    "categoryLabel": "📖 Interactive Stories",
    "level": "A1–A1+",
    "cefrLevel": "A1–A1+",
    "age": "Ages 7–12",
    "ageGroup": "7-12",
    "grade": "Grades 2–6",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 45,
    "durationText": "40–50 min",
    "estimatedMinutes": 45,
    "xp": 300,
    "skills": [
      "Reading",
      "Listening",
      "Speaking",
      "Vocabulary",
      "Exploration",
      "Problem Solving"
    ],
    "topic": "Alice in Wonderland & Adaptive English Learning",
    "topics": [
      "Branching Storytelling",
      "Interactive Narrative",
      "Alice in Wonderland"
    ],
    "languageFocus": "Target Verbs (follow, fall, drink, eat, paint, stand), Adjectives (small, big, tall, short, clean, late), Questions (Who are you? Which way?)",
    "activityMode": "Playable 2.5D Adventure Game",
    "interactionType": "Real 2D/2.5D Player Movement, NPC Dialogue, Adaptive Hints, In-Game Speaking",
    "difficulty": "Adaptive (Supportive / Standard / Challenging)",
    "tags": [
      "alice",
      "wonderland",
      "adventure",
      "story",
      "adaptive",
      "ai-director",
      "speaking",
      "listening",
      "vocabulary",
      "cefr-a1"
    ],
    "learningObjectives": [
      "Navigate an interactive branching story narrative by making comprehension-driven choices",
      "Infer character motives, settings, and consequences from literary context cues",
      "Practice reading fluency and decoding through karaoke-style read-along text passages",
      "Demonstrate deep narrative recall by answering post-chapter comprehension quests"
    ],
    "teacherInstructions": "Assign directly to classes or individual learners. The AI Game Director automatically tracks vocabulary, listening, and speaking competencies without quizzes.",
    "studentInstructions": "Explore Wonderland as Alice! Follow the White Rabbit, solve magical puzzles, and talk with friends along the path!",
    "route": "story-engine/index.html?story=alice",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 400 220\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"aliceBg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#1e1b4b\"/><stop offset=\"50%\" stop-color=\"#064e3b\"/><stop offset=\"100%\" stop-color=\"#022c22\"/></linearGradient><linearGradient id=\"clockGold\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#fef08a\"/><stop offset=\"100%\" stop-color=\"#ca8a04\"/></linearGradient></defs><rect width=\"400\" height=\"220\" fill=\"url(#aliceBg)\"/><circle cx=\"200\" cy=\"100\" r=\"70\" fill=\"#38bdf8\" opacity=\"0.15\"/><circle cx=\"200\" cy=\"100\" r=\"42\" fill=\"url(#clockGold)\" stroke=\"#fef08a\" stroke-width=\"3\"/><circle cx=\"200\" cy=\"100\" r=\"35\" fill=\"#fefce8\"/><line x1=\"200\" y1=\"100\" x2=\"200\" y2=\"76\" stroke=\"#1e293b\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"200\" y1=\"100\" x2=\"218\" y2=\"108\" stroke=\"#1e293b\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><circle cx=\"200\" cy=\"54\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"2.5\" fill=\"none\"/><text x=\"120\" y=\"140\" font-size=\"34\">🐇</text><text x=\"270\" y=\"140\" font-size=\"34\">🍄</text><text x=\"200\" y=\"192\" font-family=\"Plus Jakarta Sans, sans-serif\" font-size=\"15\" font-weight=\"800\" fill=\"#fef08a\" text-anchor=\"middle\" letter-spacing=\"1\">ALICE IN WONDERLAND</text><text x=\"200\" y=\"210\" font-family=\"Plus Jakarta Sans, sans-serif\" font-size=\"10\" font-weight=\"700\" fill=\"#93c5fd\" text-anchor=\"middle\" letter-spacing=\"0.5\">ADAPTIVE AI STORY ADVENTURE • CEFR A1/A1+</text></svg>",
    "categoryGroup": "Alice in Wonderland",
    "vocabulary": {
      "core": [
        "choice",
        "corridor",
        "shrink",
        "enormous",
        "caterpillar",
        "riddle"
      ],
      "supporting": [
        "mushroom",
        "tea party",
        "cheshire cat",
        "nonsense",
        "croquet"
      ],
      "phonics": [
        "/ch/ in choice",
        "/sh/ in shrink"
      ]
    },
    "grammar": {
      "focusPattern": "If Alice chooses to [action], she will [outcome]",
      "formula": "If Alice chooses the left door, she will meet the Cheshire Cat in the forest.",
      "formulas": [
        "First Conditional: If + Present Simple, will + Base Verb",
        "What happened after + Clause?"
      ]
    },
    "clilDomain": "Interactive Fiction & Branching Decisions",
    "clilTheme": "Interactive Fiction & Branching Decisions",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "🫖",
    "formula": "If Alice chooses the left door, she will meet the Cheshire Cat in the forest.",
    "url": "story-engine/index.html?story=alice",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "story-engine-forest",
    "title": "Interactive Story Adventure: Forest Clearing",
    "description": "2.5D playable story adventure foundation: control an explorer character, navigate forest obstacles, talk to the Forest Ranger, solve the Golden Key quest, and unlock the Ancient Gate.",
    "type": "story_adventure",
    "category": "Story & Literature",
    "categoryLabel": "📖 Interactive Stories",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–11",
    "ageGroup": "7-11",
    "grade": "Grades 2–5",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 30,
    "durationText": "25–35 min",
    "estimatedMinutes": 30,
    "xp": 50,
    "skills": [
      "Reading",
      "Listening",
      "Vocabulary",
      "Exploration",
      "Problem Solving"
    ],
    "topic": "Forest Exploration & Quest Solving",
    "topics": [
      "Nature & Forest Ecosystems",
      "Adventure Storytelling",
      "Sensory Description"
    ],
    "languageFocus": "Action Verbs, Prepositions (near, behind, to), Keys & Doors",
    "activityMode": "Playable 2.5D Adventure Game",
    "interactionType": "Real 2D Player Movement & World Exploration",
    "difficulty": "Beginner",
    "tags": [
      "adventure",
      "story",
      "game",
      "exploration",
      "quest",
      "forest",
      "keys",
      "interactive"
    ],
    "learningObjectives": [
      "Explore forest ecosystem habitats and wildlife through an immersive branching narrative",
      "Make ethical and ecological decisions that affect forest creatures and outcomes",
      "Identify sensory details (sight, sound, touch, smell) used in narrative descriptive passages",
      "Develop reading stamina through chapter-based storytelling"
    ],
    "teacherInstructions": "Project onto classroom screen or assign to individual student devices. Encourage learners to read the Ranger's speech bubble aloud before exploring.",
    "studentInstructions": "Use arrow keys or tap to explore the forest! Talk to the Ranger, find the hidden Golden Key, and unlock the Ancient Gate!",
    "route": "story-engine/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "featured": true,
    "thumbnailSvg": "<svg viewBox=\"0 0 400 220\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"forestTh\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#064e3b\"/><stop offset=\"100%\" stop-color=\"#022c22\"/></linearGradient></defs><rect width=\"400\" height=\"220\" fill=\"url(#forestTh)\"/><circle cx=\"200\" cy=\"110\" r=\"80\" fill=\"#047857\" opacity=\"0.4\"/><path d=\"M 60 170 Q 200 130 340 170\" stroke=\"#78350f\" stroke-width=\"32\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"90\" cy=\"80\" r=\"38\" fill=\"#15803d\"/><circle cx=\"310\" cy=\"90\" r=\"42\" fill=\"#166534\"/><circle cx=\"200\" cy=\"90\" r=\"24\" fill=\"#f59e0b\" opacity=\"0.3\"/><text x=\"200\" y=\"100\" font-size=\"34\" text-anchor=\"middle\">🗝️</text><text x=\"200\" y=\"185\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"800\" fill=\"#fef08a\" text-anchor=\"middle\" letter-spacing=\"1\">PLAYABLE ADVENTURE</text></svg>",
    "categoryGroup": "Forest Ecology Narrative",
    "vocabulary": {
      "core": [
        "clearing",
        "canopy",
        "creature",
        "stream",
        "whisper",
        "moss"
      ],
      "supporting": [
        "foliage",
        "sanctuary",
        "nocturnal",
        "burrow",
        "rustle"
      ],
      "phonics": [
        "/cl/ in clearing",
        "/cr/ in creature"
      ]
    },
    "grammar": {
      "focusPattern": "As the explorer walked through the [forest], they noticed [object]",
      "formula": "As the ranger walked into the clearing, they observed a deer drinking at the stream.",
      "formulas": [
        "As + Subject + Past Continuous, Subject + Past Simple",
        "Sensory: Subject + could hear/see/smell + Noun Phrase"
      ]
    },
    "clilDomain": "Temperate Forest Ecosystems & Wilderness Decisions",
    "clilTheme": "Temperate Forest Ecosystems & Wilderness Decisions",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "🌲",
    "formula": "As the ranger walked into the clearing, they observed a deer drinking at the stream.",
    "url": "story-engine/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "simon-says-grade3",
    "title": "🦉 Simon Says: Inventors, Monsters & Harvest (Grade 3)",
    "description": "Whole-class smartboard Simon Says for Grade 3. Commands come from Unit 1 (inventions, sound moves), Monster Day and Unit 2 (harvest, Chuseok, Mars). Pupils who slip are out and tap back in as helpers. The game gets harder with sneaky tricks. Uses your class list.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 8–9",
    "ageGroup": "8-9",
    "grade": "Grade 3",
    "grades": [
      "Grade 3"
    ],
    "duration": 20,
    "durationText": "15–20 min",
    "estimatedMinutes": 20,
    "xp": 25,
    "skills": [
      "Listening",
      "Physical Response",
      "Vocabulary",
      "Focus",
      "Action Verbs"
    ],
    "topic": "Unit 1 Inventions, Monster Parts & Unit 2 Harvest",
    "topics": [
      "Unit 1: plan, build, test, try again, tidy, mess, machine, invent",
      "Monster Day: tail, claws, fangs, wings, horns",
      "Unit 2: pick, dig, weave, bow, harvest, space suit, helmet"
    ],
    "languageFocus": "Imperatives with Unit 1 and Unit 2 words; First, Second, Third, Last commands; Simon says rules",
    "activityMode": "Classroom / Physical Whole Group",
    "interactionType": "Teacher-Led Smartboard Physical Activity",
    "difficulty": "All Levels (Adaptive Speed)",
    "tags": [
      "simon-says",
      "tpr",
      "listening",
      "smartboard",
      "grade-3",
      "unit-1",
      "unit-2",
      "names-elimination"
    ],
    "learningObjectives": [
      "Respond to spoken imperatives using Unit 1 and Unit 2 vocabulary",
      "Tell a real Simon command from a sneaky one (no Simon, or a different name)",
      "Follow a two- or four-step command with First, Second, Third, Last",
      "Practise -st, sh, fl and fr sounds in context"
    ],
    "teacherInstructions": "Open from the library on the smartboard. Choose your class and tap away any absent pupils. During the game tap the name of any pupil who moves by mistake: they are out and can become a helper who reads the next command. The game gets harder every few rounds. The last pupil standing wins, and you can give them +25 XP when you open the game from the platform.",
    "studentInstructions": "Listen carefully! Only do the action if Simon says! If Simon does not say it, freeze!",
    "route": "simon-says/index.html?grade=3",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"simonCardBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#064e3b\"/>\n            <stop offset=\"100%\" stop-color=\"#022c22\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#simonCardBg)\"/>\n        <rect x=\"20\" y=\"20\" width=\"160\" height=\"100\" rx=\"14\" fill=\"#042f2e\" stroke=\"#10b981\" stroke-width=\"2.5\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"22\" fill=\"#10b981\" opacity=\"0.25\"/>\n        <text x=\"100\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">🗣️</text>\n        <rect x=\"35\" y=\"86\" width=\"130\" height=\"22\" rx=\"11\" fill=\"#059669\"/>\n        <text x=\"100\" y=\"101\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"11\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">SIMON SAYS 🏆</text>\n      </svg>",
    "categoryGroup": "TPR Action Quests",
    "vocabulary": {
      "core": [
        "plan",
        "build",
        "test",
        "try again",
        "tidy",
        "mess",
        "machine",
        "invent",
        "pick",
        "harvest",
        "bow",
        "celebrate"
      ],
      "supporting": [
        "mirror",
        "parachute",
        "tail",
        "claws",
        "fangs",
        "wings",
        "horns",
        "space suit",
        "helmet",
        "weave",
        "songpyeon"
      ],
      "phonics": [
        "-st: stand, stamp, stir, stretch",
        "sh: shake, shut",
        "fl / fr: flap, freeze, frog"
      ]
    },
    "grammar": {
      "focusPattern": "Simon says + [imperative]!",
      "formula": "Simon says: Build a machine! / Pick the fruit!",
      "formulas": [
        "Simon says + imperative: do it",
        "No Simon says: do not move",
        "First…, Second…, Third…, Last…"
      ]
    },
    "clilDomain": "Kinesiology & Auditory Processing",
    "clilTheme": "Kinesiology & Auditory Processing",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "👑",
    "formula": "Simon says: Touch your [body part] and jump [number] times!",
    "url": "simon-says/index.html?grade=3",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "simon-says-grade4",
    "title": "🦉 Simon Says: Alice, Brain & Forests (Grade 4)",
    "description": "Whole-class smartboard Simon Says for Grade 4. Commands come from Unit 1 (Alice in Wonderland, the brain, reading) and Unit 2 (forest animals, A New Friend, ai words). Pupils who slip are out and can become helpers. The game adds two-step and past-tense commands. Uses your class list.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 4"
    ],
    "duration": 20,
    "durationText": "15–20 min",
    "estimatedMinutes": 20,
    "xp": 25,
    "skills": [
      "Listening",
      "Physical Response",
      "Vocabulary",
      "Focus",
      "Action Verbs"
    ],
    "topic": "Unit 1 Alice & the Brain, Unit 2 Forests & A New Friend",
    "topics": [
      "Unit 1: fall, chase, shelves, sleepy, visualize, skim",
      "Unit 2: hibernate, freeze, shiver, nest, roof, vet",
      "Spelling pattern ai: sail, wait, paint, train, tail"
    ],
    "languageFocus": "Imperatives with Unit 1 and 2 words; two-step commands; past simple story verbs; so they can / instead of",
    "activityMode": "Classroom / Physical Whole Group",
    "interactionType": "Teacher-Led Smartboard Physical Activity",
    "difficulty": "All Levels (Adaptive Speed)",
    "tags": [
      "simon-says",
      "tpr",
      "listening",
      "smartboard",
      "grade-4",
      "unit-1",
      "unit-2",
      "names-elimination"
    ],
    "learningObjectives": [
      "Respond to spoken imperatives using Unit 1 and Unit 2 vocabulary",
      "Tell a real Simon command from a sneaky one (no Simon, or a different name)",
      "Follow two-step and past-tense story commands",
      "Practise the ai spelling pattern words in context"
    ],
    "teacherInstructions": "Open from the library on the smartboard. Choose your class and tap away any absent pupils. During the game tap the name of any pupil who moves by mistake: they are out and can become a helper who reads the next command. The game gets harder every few rounds. The last pupil standing wins, and you can give them +25 XP when you open the game from the platform.",
    "studentInstructions": "Listen carefully! Only do the action if Simon says! If Simon does not say it, freeze!",
    "route": "simon-says/index.html?grade=4",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"simonCardBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#064e3b\"/>\n            <stop offset=\"100%\" stop-color=\"#022c22\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#simonCardBg)\"/>\n        <rect x=\"20\" y=\"20\" width=\"160\" height=\"100\" rx=\"14\" fill=\"#042f2e\" stroke=\"#10b981\" stroke-width=\"2.5\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"22\" fill=\"#10b981\" opacity=\"0.25\"/>\n        <text x=\"100\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">🗣️</text>\n        <rect x=\"35\" y=\"86\" width=\"130\" height=\"22\" rx=\"11\" fill=\"#059669\"/>\n        <text x=\"100\" y=\"101\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"11\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">SIMON SAYS 🏆</text>\n      </svg>",
    "categoryGroup": "TPR Action Quests",
    "vocabulary": {
      "core": [
        "fall",
        "chase",
        "visualize",
        "skim",
        "hibernate",
        "survive",
        "adapt",
        "nest",
        "roof",
        "vet"
      ],
      "supporting": [
        "shelves",
        "sleepy",
        "creative",
        "shiver",
        "tiptoe",
        "howl",
        "hoot",
        "pine tree",
        "gold coins",
        "predator"
      ],
      "phonics": [
        "ai: sail, wait, paint, train, tail"
      ]
    },
    "grammar": {
      "focusPattern": "Simon says + [imperative]!",
      "formula": "Simon says: Hibernate like a bear!",
      "formulas": [
        "Simon says + imperative: do it",
        "Two-step commands: First…, then…",
        "Hide so the wolf cannot see you (so…can)",
        "Wave with your feet instead of your hands (instead of)"
      ]
    },
    "clilDomain": "Kinesiology & Auditory Processing",
    "clilTheme": "Kinesiology & Auditory Processing",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "👑",
    "formula": "Simon says: Touch your [body part] and jump [number] times!",
    "url": "simon-says/index.html?grade=4",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "yesterday-detectives",
    "title": "The Mystery of Yesterday: A Past Simple Detective Adventure",
    "description": "Complete 35-minute interactive ESL adventure for Grade 3–4 (A1/A1+) learners. Students investigate a shaking mystery box, sprint in the physical Smart Board verb challenge, detect Two Truths and One Lie, interrogate Barnaby the Berry Monster with 'Did you...?', build suspect statements, and unlock the final treasure box with +100 XP!",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1/A1+",
    "cefrLevel": "A1/A1+",
    "age": "Ages 8–10",
    "ageGroup": "8-10",
    "grade": "Grade 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 150,
    "skills": [
      "Grammar",
      "Listening",
      "Speaking",
      "Reading",
      "Vocabulary",
      "Deduction"
    ],
    "topic": "Past Simple Tense & Mystery Investigation",
    "topics": [
      "Past Simple Interrogations",
      "Detective Mystery",
      "Alibis & Timelines"
    ],
    "languageFocus": "Past Simple Affirmative (played, went, ate), Questions (Did you go?), Negatives (didn't eat), and Did + base verb rule",
    "activityMode": "Interactive Whole Group / Pair Investigation",
    "interactionType": "Interactive Game-Based Lesson with Team Scoreboard & Evidence System",
    "difficulty": "Scaffolded (A1+ to Hard Mode)",
    "tags": [
      "past-simple",
      "detective",
      "grammar",
      "mystery",
      "did",
      "irregular-verbs",
      "regular-verbs",
      "speaking",
      "listening",
      "interactive-lesson"
    ],
    "learningObjectives": [
      "Formulate and answer past simple questions with 'Did you...?' and 'Where were you...?'",
      "Use past simple affirmative and negative forms to provide alibis and interrogate suspects",
      "Analyze detective clue cards to deduce the timeline of events from 'yesterday'",
      "Collaborate in pairs to roleplay detective and suspect interviews"
    ],
    "teacherInstructions": "Launch on the smartboard or assign to student teams. Use the teacher control panel to jump between the 14 scaffolded stages and manage team points.",
    "studentInstructions": "Grab your magnifying glass, Detective! Examine clues from yesterday, catch the suspect's lies, and crack the case of the missing memory!",
    "route": "detectives/index.html",
    "worksheet": "detectives/worksheet.html",
    "worksheetRoute": "detectives/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"detThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#0f172a\"/>\n            <stop offset=\"100%\" stop-color=\"#1e293b\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#detThumbBg)\"/>\n        <rect x=\"15\" y=\"15\" width=\"170\" height=\"110\" rx=\"12\" fill=\"#1e293b\" stroke=\"#f59e0b\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"28\" fill=\"#f59e0b\" opacity=\"0.2\"/>\n        <text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">🕵️</text>\n        <rect x=\"25\" y=\"90\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/>\n        <text x=\"100\" y=\"105\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#000000\" text-anchor=\"middle\" letter-spacing=\"0.5\">YESTERDAY DETECTIVES</text>\n      </svg>",
    "categoryGroup": "Grammar Detectives",
    "vocabulary": {
      "core": [
        "yesterday",
        "clue",
        "suspect",
        "alibi",
        "witness",
        "detective"
      ],
      "supporting": [
        "magnifying glass",
        "footprint",
        "innocent",
        "guilty",
        "interrogate"
      ],
      "phonics": [
        "/st/ in yesterday",
        "/cl/ in clue"
      ]
    },
    "grammar": {
      "focusPattern": "Where were you yesterday at [time]? I was at [place] [gerund]",
      "formula": "Where were you yesterday at [time]? I was in the library inspecting clues.",
      "formulas": [
        "Past Continuous/Simple: I was + [Place] / I [Past Simple Verb] + [Object]",
        "Interrogative: Did you see + [Person/Object] yesterday?"
      ]
    },
    "clilDomain": "Forensic Timelines & Interrogative Grammar",
    "clilTheme": "Forensic Timelines & Interrogative Grammar",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🕵️",
    "formula": "Where were you yesterday at [time]? I was in the library inspecting clues.",
    "url": "detectives/index.html",
    "worksheetUrl": "detectives/worksheet.html"
  },
  {
    "id": "inventor-lab",
    "title": "Inventor Lab: What Does It Take to Be an Inventor?",
    "description": "Interactive classroom ESL lesson based on Global Readings Unit 1. Students become junior inventors, investigate a mystery room with clickable hotspots, practice See/Think/Wonder, read Clara Doodle's story with evidence highlighting, test inventor mindsets, and engineer their own invention.",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1+",
    "cefrLevel": "A1+/A2",
    "age": "Ages 8–12",
    "ageGroup": "8-12",
    "grade": "Grades 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 50,
    "durationText": "45–50 min",
    "estimatedMinutes": 50,
    "xp": 150,
    "skills": [
      "Speaking",
      "Reading",
      "Vocabulary",
      "Prediction",
      "Critical Thinking",
      "Reasoning"
    ],
    "topic": "Invention, Problem Solving & Clara Doodle",
    "topics": [
      "Invention History",
      "Character Traits of Inventors",
      "Classroom Debate"
    ],
    "languageFocus": "I see..., I think..., Maybe..., I think [X] because [Y], It can [verb], It helps [noun]",
    "activityMode": "Interactive Whole Group / Team Lab",
    "interactionType": "Interactive Smartboard Lesson with Dual-Team Scoreboard & Studio Builder",
    "difficulty": "Scaffolded (A1+ to A2)",
    "tags": [
      "inventor",
      "reading",
      "speaking",
      "global-readings",
      "clara-doodle",
      "see-think-wonder",
      "problem-solving",
      "stem"
    ],
    "learningObjectives": [
      "Examine what traits and habits define great historical inventors (curiosity, perseverance, creativity)",
      "Express opinions and agree/disagree politely about which inventions changed the world most",
      "Match everyday problems with inventive mechanical solutions",
      "Draft a personal inventor profile card specifying a target invention"
    ],
    "teacherInstructions": "Launch on the smartboard for whole-class engagement. Use the dual-team scoreboard to reward speaking participation. Guide students to discover the core concept: inventors make changes and try again!",
    "studentInstructions": "Welcome to the Inventor Lab! Inspect clues, help Clara Doodle test her inventions, and design your own machine!",
    "route": "inventor-lab/index.html",
    "worksheet": "inventor-lab/worksheet.html",
    "worksheetRoute": "inventor-lab/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"invThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#0b1329\"/>\n            <stop offset=\"100%\" stop-color=\"#152754\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#invThumbBg)\"/>\n        <rect x=\"15\" y=\"15\" width=\"170\" height=\"110\" rx=\"12\" fill=\"#132247\" stroke=\"#06b6d4\" stroke-width=\"2\" stroke-dasharray=\"5,3\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"26\" fill=\"#06b6d4\" opacity=\"0.2\"/>\n        <text x=\"100\" y=\"66\" font-size=\"34\" text-anchor=\"middle\">💡</text>\n        <rect x=\"25\" y=\"90\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#f59e0b\"/>\n        <text x=\"100\" y=\"105\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#0b1329\" text-anchor=\"middle\" letter-spacing=\"0.5\">INVENTOR LAB ⚙️</text>\n      </svg>",
    "categoryGroup": "Inventor Workshop",
    "vocabulary": {
      "core": [
        "inventor",
        "curiosity",
        "laboratory",
        "gadget",
        "create",
        "experiment"
      ],
      "supporting": [
        "persistence",
        "patent",
        "innovation",
        "discovery",
        "tinker"
      ],
      "phonics": [
        "/l/ in laboratory",
        "/k/ in curiosity"
      ]
    },
    "grammar": {
      "focusPattern": "To be an inventor, you must be [adjective] and [verb]",
      "formula": "To be an inventor, you must be curious, observe problems, and never give up.",
      "formulas": [
        "Modal of Obligation: You must / need to + Base Verb",
        "Opinion: In my opinion, [Invention] is the most important because..."
      ]
    },
    "clilDomain": "Traits of Innovators & Growth Mindset",
    "clilTheme": "Traits of Innovators & Growth Mindset",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "thumbnailIcon": "⚙️",
    "formula": "To be an inventor, you must be curious, observe problems, and never give up.",
    "url": "inventor-lab/index.html",
    "worksheetUrl": "inventor-lab/worksheet.html"
  },
  {
    "id": "clara-inventor",
    "title": "Clara's Inventor Mystery & The Inventor Challenge",
    "description": "Two energetic, interactive 35-minute ESL lessons based on Global Readings 2 (pp. 10–17). Lesson 1 explores Clara's workshop, 5 bizarre inventions, 6 reading detective missions, and 4-Corners True/False. Lesson 2 teaches SEQUENCE (First, Second, Third, Last), the Human Tablet game, and the 4-Stage Inventor Process.",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 8–12",
    "ageGroup": "8-12",
    "grade": "Grades 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 70,
    "durationText": "2 × 35 min",
    "estimatedMinutes": 70,
    "xp": 250,
    "skills": [
      "Reading",
      "Speaking",
      "Vocabulary",
      "Sequencing",
      "Deduction",
      "Phonics"
    ],
    "topic": "Inventions, Sequence & Problem Solving",
    "topics": [
      "After-School Inventions",
      "Growth Mindset",
      "Household Solutions"
    ],
    "languageFocus": "First, Second, Third, Last, It can [verb], This invention is for [noun], What does it do?",
    "activityMode": "Interactive Whole Group / Pair Investigation / Kinesthetic 4-Corners",
    "interactionType": "Interactive Game-Based Lessons with Dual-Team Scoreboard, Tablet Simulator & Pitch Stage",
    "difficulty": "Scaffolded (A1+ to Hard Mode)",
    "tags": [
      "clara-doodle",
      "inventions",
      "sequence",
      "first-second-third-last",
      "reading-detective",
      "four-corners",
      "phonics-cl",
      "stem"
    ],
    "learningObjectives": [
      "Read and comprehend Clara's After-School Inventor Workshop storyline (Global Readings 2 Unit 1)",
      "Identify Clara's quirky inventions: pen umbrella, special mirror, smart eraser, clean-up machine",
      "Sequence Clara's inventing workflow: idea -> sketch -> assemble -> test -> fix",
      "Design a custom quirky invention to solve a humorous household challenge"
    ],
    "teacherInstructions": "Launch on the smartboard for whole-class engagement. Switch between Lesson 1 (35m) and Lesson 2 (35m) using the top HUD tabs. Utilize the dual-team scoreboard and printable companion worksheet.",
    "studentInstructions": "Join Clara Doodle's workshop! Crack 6 reading mysteries, test the Human Tablet, arrange the 4-stage sequence, and build your own wacky invention!",
    "route": "clara-inventor/index.html",
    "worksheet": "clara-inventor/worksheet.html",
    "worksheetRoute": "clara-inventor/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"claraThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#0a1124\"/>\n            <stop offset=\"100%\" stop-color=\"#1e293b\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#claraThumbBg)\"/>\n        <rect x=\"15\" y=\"15\" width=\"170\" height=\"110\" rx=\"12\" fill=\"#0f1c38\" stroke=\"#38bdf8\" stroke-width=\"2.5\" stroke-dasharray=\"5,3\"/>\n        <circle cx=\"70\" cy=\"52\" r=\"22\" fill=\"#38bdf8\" opacity=\"0.2\"/>\n        <text x=\"70\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">💡</text>\n        <circle cx=\"130\" cy=\"52\" r=\"22\" fill=\"#fbbf24\" opacity=\"0.2\"/>\n        <text x=\"130\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">📱</text>\n        <rect x=\"25\" y=\"90\" width=\"150\" height=\"22\" rx=\"11\" fill=\"#38bdf8\"/>\n        <text x=\"100\" y=\"105\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"9\" fill=\"#041226\" text-anchor=\"middle\" letter-spacing=\"0.5\">CLARA'S INVENTOR MYSTERY 🚀</text>\n      </svg>",
    "categoryGroup": "After-School Inventions",
    "vocabulary": {
      "core": [
        "mess",
        "machine",
        "mirror",
        "umbrella",
        "change",
        "try again"
      ],
      "supporting": [
        "workshop",
        "tidy",
        "doodle",
        "special",
        "gadget"
      ],
      "phonics": [
        "/m/ in mess",
        "/m/ in mirror",
        "/ch/ in change"
      ]
    },
    "grammar": {
      "focusPattern": "When Clara has an idea, she makes a [plan]",
      "formula": "When Clara has an idea, she makes a sketch and tests it in her workshop.",
      "formulas": [
        "Zero Conditional: When + Subject + Present Simple, Subject + Present Simple",
        "Clara used her [Invention] to + Base Verb"
      ]
    },
    "clilDomain": "Household Engineering & Practical Inventions",
    "clilTheme": "Household Engineering & Practical Inventions",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "thumbnailIcon": "💡",
    "formula": "When Clara has an idea, she makes a sketch and tests it in her workshop.",
    "url": "clara-inventor/index.html",
    "worksheetUrl": "clara-inventor/worksheet.html"
  },
  {
    "id": "robots",
    "title": "Amazing Robots Around the World",
    "description": "Interactive STEM & WH-Questions ESL lesson: explore 5 real-world biomimetic and rescue robots, practice What/Where/When/Who/Why/How, read authentic dossiers, and present team discoveries.",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1–A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 9–12",
    "ageGroup": "9-12",
    "grade": "Grades 4–6",
    "grades": [
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 65,
    "durationText": "60–70 min",
    "estimatedMinutes": 65,
    "xp": 100,
    "skills": [
      "Reading",
      "Speaking",
      "Listening",
      "Vocabulary",
      "Teamwork"
    ],
    "topic": "WH-Questions & Real-World Robotics",
    "topics": [
      "Robotics Around the World",
      "AI & Automation",
      "Future Technology"
    ],
    "languageFocus": "WH-Questions (What, Where, When, Who, Why, How)",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Interactive STEM Dossier & Presentation",
    "difficulty": "Intermediate",
    "tags": [
      "robots",
      "science",
      "stem",
      "questions",
      "wh-questions",
      "dossier",
      "teamwork"
    ],
    "learningObjectives": [
      "Identify diverse robotic applications: domestic, medical, manufacturing, and planetary rovers",
      "Use modal verbs 'can' and 'cannot' to describe robotic capabilities and physical constraints",
      "Compare autonomous artificial intelligence robots with remote-controlled machines",
      "Design and present a specialized robotic assistant for school or home"
    ],
    "teacherInstructions": "Group students into research squads. Assign one robot dossier to each squad, have them complete the WH-matrix, and conduct a 2-minute press conference presentation.",
    "studentInstructions": "Explore the secret robot files, find answers to the WH-questions, and present your team's robot to the class!",
    "route": "robots/index.html",
    "worksheet": "robots/worksheet.html",
    "worksheetRoute": "robots/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#0f172a\"/>\n        <path d=\"M 10 30 L 50 30 L 70 50 L 130 50 L 150 30 L 190 30\" stroke=\"#0284c7\" stroke-width=\"2\" fill=\"none\" opacity=\"0.6\"/>\n        <path d=\"M 20 110 L 60 110 L 80 90 L 120 90 L 140 110 L 180 110\" stroke=\"#38bdf8\" stroke-width=\"2\" fill=\"none\" opacity=\"0.6\"/>\n        <rect x=\"55\" y=\"42\" width=\"90\" height=\"56\" rx=\"12\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"3\"/>\n        <circle cx=\"80\" cy=\"70\" r=\"10\" fill=\"#0284c7\"/>\n        <circle cx=\"80\" cy=\"70\" r=\"5\" fill=\"#38bdf8\"/>\n        <circle cx=\"80\" cy=\"70\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"120\" cy=\"70\" r=\"10\" fill=\"#0284c7\"/>\n        <circle cx=\"120\" cy=\"70\" r=\"5\" fill=\"#38bdf8\"/>\n        <circle cx=\"120\" cy=\"70\" r=\"2\" fill=\"#ffffff\"/>\n        <line x1=\"100\" y1=\"42\" x2=\"100\" y2=\"24\" stroke=\"#38bdf8\" stroke-width=\"3\"/>\n        <circle cx=\"100\" cy=\"20\" r=\"5\" fill=\"#f59e0b\"/>\n        <rect x=\"25\" y=\"112\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#0284c7\"/>\n        <text x=\"100\" y=\"125\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">AMAZING ROBOTS 🤖</text>\n      </svg>",
    "categoryGroup": "Robotics Around the World",
    "vocabulary": {
      "core": [
        "robot",
        "sensor",
        "motor",
        "wire",
        "metal",
        "program"
      ],
      "supporting": [
        "autonomous",
        "artificial intelligence",
        "humanoid",
        "mechanic",
        "operate"
      ],
      "phonics": [
        "/r/ in robot",
        "/m/ in motor"
      ]
    },
    "grammar": {
      "focusPattern": "Robots can [verb], but they cannot [verb]",
      "formula": "This robot can clean floors and navigate rooms, but it cannot feel emotions.",
      "formulas": [
        "Modal of Ability: Subject + can/cannot + Base Verb",
        "This robot is programmed to + Base Verb + in order to + Base Verb"
      ]
    },
    "clilDomain": "Automated Machines & Artificial Intelligence",
    "clilTheme": "Automated Machines & Artificial Intelligence",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "thumbnailIcon": "🤖",
    "formula": "This robot can clean floors and navigate rooms, but it cannot feel emotions.",
    "url": "robots/index.html",
    "worksheetUrl": "robots/worksheet.html"
  },
  {
    "id": "feelings",
    "title": "How Would You Feel?",
    "description": "Interactive A1+ situational thinking lesson: evaluate real-life, funny & challenging dilemmas, choose appropriate emotions, and speak using natural chunks.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grades 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 45,
    "durationText": "45–50 min",
    "estimatedMinutes": 45,
    "xp": 75,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Listening"
    ],
    "topic": "Feelings, Emotions & Situational Reactions",
    "topics": [
      "Emotional Intelligence (SEL)",
      "Empathy & Perspective Taking",
      "Feelings & Moods"
    ],
    "languageFocus": "I'd feel... / I would feel [emotion] because...",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Situational Dilemma & Voting Stage",
    "difficulty": "Elementary",
    "tags": [
      "feelings",
      "emotions",
      "speaking",
      "reactions",
      "chunks",
      "sel"
    ],
    "learningObjectives": [
      "Identify and label nuanced emotional states: proud, excited, anxious, frustrated, surprised, relieved",
      "Use second conditional and modal expressions to empathize with classmates ('How would you feel if...?')",
      "Express empathy and recommend constructive socio-emotional coping strategies",
      "Roleplay interpersonal conflict resolution scenarios with emotional authenticity"
    ],
    "teacherInstructions": "Project each dilemma on the whiteboard. Prompt students to vote using thumbs up/down or emoji cards, then call on pairs to explain their emotional rationale.",
    "studentInstructions": "Read the story dilemma, choose how you would feel, and tell your partner what you would do next!",
    "route": "feelings/index.html",
    "worksheet": "feelings/worksheet.html",
    "worksheetRoute": "feelings/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#fef3c7\"/>\n        <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#fbbf24\"/>\n        <circle cx=\"56\" cy=\"58\" r=\"4.5\" fill=\"#1e293b\"/>\n        <circle cx=\"74\" cy=\"58\" r=\"4.5\" fill=\"#1e293b\"/>\n        <path d=\"M 54 75 Q 65 88 76 75\" fill=\"none\" stroke=\"#1e293b\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>\n        <path d=\"M 105 35 L 180 35 Q 188 35 188 43 L 188 85 Q 188 93 180 93 L 125 93 L 110 108 L 115 93 L 105 93 Q 97 93 97 85 L 97 43 Q 97 35 105 35 Z\" fill=\"#ffffff\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n        <text x=\"142\" y=\"58\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"11\" fill=\"#b45309\" text-anchor=\"middle\">HOW WOULD</text>\n        <text x=\"142\" y=\"74\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"12\" fill=\"#d97706\" text-anchor=\"middle\">YOU FEEL? 🎭</text>\n        <rect x=\"25\" y=\"112\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#3b82f6\"/>\n        <text x=\"100\" y=\"125\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">THINK • CHOOSE • REACT</text>\n      </svg>",
    "categoryGroup": "Socio-Emotional Communication",
    "vocabulary": {
      "core": [
        "happy",
        "sad",
        "angry",
        "excited",
        "scared",
        "proud",
        "calm"
      ],
      "supporting": [
        "frustrated",
        "anxious",
        "empathy",
        "relieved",
        "jealous"
      ],
      "phonics": [
        "/pr/ in proud",
        "/sc/ in scared"
      ]
    },
    "grammar": {
      "focusPattern": "How would you feel if [situation]? I would feel [adjective]",
      "formula": "How would you feel if [situation]? I would feel [adjective] because [reason].",
      "formulas": [
        "Conditional Question: How would you feel if + Subject + Past Simple?",
        "Empathy Response: I would feel + Adjective + because + Clause"
      ]
    },
    "clilDomain": "Emotional Intelligence & Empathy",
    "clilTheme": "Emotional Intelligence & Empathy",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "😊",
    "formula": "How would you feel if [situation]? I would feel [adjective] because [reason].",
    "url": "feelings/index.html",
    "worksheetUrl": "feelings/worksheet.html"
  },
  {
    "id": "firefighter",
    "title": "Fire Station Adventure",
    "description": "Interactive story about firefighters, emergency equipment, siren audio, and a tap-to-extinguish water hose simulation.",
    "type": "story",
    "category": "CLIL & Science",
    "categoryLabel": "📖 Interactive Stories",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–9",
    "ageGroup": "7-8",
    "grade": "Grades 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 60,
    "skills": [
      "Speaking",
      "Listening",
      "Vocabulary"
    ],
    "topic": "Community Helpers & Emergencies",
    "topics": [
      "Community Helpers",
      "Fire Safety & Prevention",
      "Emergency Protocols"
    ],
    "languageFocus": "Action verbs & Community Helper vocabulary (hose, helmet, alarm, rescue)",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Interactive Story & Hose Drill",
    "difficulty": "Beginner",
    "tags": [
      "firefighter",
      "emergency",
      "community",
      "story",
      "listening",
      "safety"
    ],
    "learningObjectives": [
      "Describe the duties, protective equipment, and rescue vehicles of municipal firefighters",
      "Practice emergency communication formulas: reporting location, hazards, and emergency status",
      "Sequence fire safety protocol procedures (Stop, Drop, and Roll / Evacuation Drills)",
      "Roleplay emergency dispatcher and firefighter radio conversations"
    ],
    "teacherInstructions": "Lead whole-class choral drill of emergency action verbs. Let students take turns operating the interactive water hose simulator.",
    "studentInstructions": "Sound the fire alarm, put on your gear, and work with your squad to put out the fire!",
    "route": "firefighter/index.html",
    "worksheet": "firefighter/worksheet.html",
    "worksheetRoute": "firefighter/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#fee2e2\"/>\n        <rect x=\"25\" y=\"30\" width=\"150\" height=\"110\" rx=\"4\" fill=\"#fca5a5\"/>\n        <rect x=\"50\" y=\"65\" width=\"100\" height=\"75\" rx=\"3\" fill=\"#ef4444\"/>\n        <line x1=\"50\" y1=\"85\" x2=\"150\" y2=\"85\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n        <line x1=\"50\" y1=\"105\" x2=\"150\" y2=\"105\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n        <line x1=\"50\" y1=\"125\" x2=\"150\" y2=\"125\" stroke=\"#dc2626\" stroke-width=\"2\"/>\n        <rect x=\"68\" y=\"85\" width=\"64\" height=\"42\" rx=\"4\" fill=\"#b91c1c\"/>\n        <rect x=\"74\" y=\"90\" width=\"52\" height=\"16\" rx=\"2\" fill=\"#bae6fd\"/>\n        <circle cx=\"80\" cy=\"122\" r=\"6\" fill=\"#1e293b\"/>\n        <circle cx=\"120\" cy=\"122\" r=\"6\" fill=\"#1e293b\"/>\n        <rect x=\"94\" y=\"80\" width=\"12\" height=\"5\" rx=\"1\" fill=\"#38bdf8\"/>\n      </svg>",
    "categoryGroup": "Community Civics & Safety",
    "vocabulary": {
      "core": [
        "firefighter",
        "hose",
        "helmet",
        "ladder",
        "engine",
        "rescue",
        "emergency"
      ],
      "supporting": [
        "hydrant",
        "smoke detector",
        "siren",
        "extinguisher",
        "dispatcher"
      ],
      "phonics": [
        "/f/ in firefighter",
        "/h/ in hose"
      ]
    },
    "grammar": {
      "focusPattern": "Firefighters use a [tool] to [verb] and protect people",
      "formula": "Firefighters use high-pressure hoses and ladders to rescue citizens from fires.",
      "formulas": [
        "Purpose: Subject + uses + Tool + to + Base Verb",
        "Emergency Imperative: In case of fire, do not [Verb], always [Verb]!"
      ]
    },
    "clilDomain": "Fire Safety & Municipal Emergency Services",
    "clilTheme": "Fire Safety & Municipal Emergency Services",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🚒",
    "formula": "Firefighters use high-pressure hoses and ladders to rescue citizens from fires.",
    "url": "firefighter/index.html",
    "worksheetUrl": "firefighter/worksheet.html"
  },
  {
    "id": "camp-mystery",
    "title": "The Mystery at the Camp",
    "description": "An interactive story adventure based on 'Don't Move'. Join Suzie and Mom in the dark windy forest, predict plot twists, solve cause & effect mysteries, and hunt phonics clues.",
    "type": "story",
    "category": "Story & Literature",
    "categoryLabel": "📖 Reading Adventure",
    "level": "A1/A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 50,
    "durationText": "45–55 min",
    "estimatedMinutes": 50,
    "xp": 85,
    "skills": [
      "Reading",
      "Listening",
      "Speaking",
      "Prediction",
      "Phonics"
    ],
    "topic": "Camping Mystery & Forest Animals",
    "topics": [
      "Camping & Outdoors",
      "Mystery & Clue Deduction",
      "Narrative Reading"
    ],
    "languageFocus": "Sequencing (First, Then, Next, Finally), Fact vs Opinion, Consonant Blends",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Interactive Reading & Investigation",
    "difficulty": "Elementary",
    "tags": [
      "mystery",
      "camp",
      "forest",
      "story",
      "blends",
      "phonics",
      "reading",
      "sequencing"
    ],
    "learningObjectives": [
      "Read and decode an outdoor summer camp mystery narrative",
      "Identify setting details, suspicious suspects, and camping gear items",
      "Synthesize circumstantial clues to eliminate suspects and uncover the missing camp item",
      "Sequence camping adventure events using past tense narrative time markers"
    ],
    "teacherInstructions": "Read each scene aloud with expressive tension. Pause at the prediction points to have students vote on what is making the strange grunting sound.",
    "studentInstructions": "Look for clues in the dark forest, sequence the story events, and solve the mystery of the campsite visitor!",
    "route": "camp-mystery/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#0f172a\"/>\n        <polygon points=\"100,20 40,110 160,110\" fill=\"#1e293b\"/>\n        <polygon points=\"100,25 45,105 155,105\" fill=\"#0f766e\"/>\n        <polygon points=\"100,55 70,105 130,105\" fill=\"#134e4a\"/>\n        <polygon points=\"100,75 85,105 115,105\" fill=\"#facc15\" opacity=\"0.8\"/>\n        <circle cx=\"165\" cy=\"35\" r=\"14\" fill=\"#fef08a\"/>\n        <circle cx=\"160\" cy=\"32\" r=\"12\" fill=\"#0f172a\"/>\n        <polygon points=\"25,60 10,110 40,110\" fill=\"#064e3b\"/>\n        <polygon points=\"175,65 160,115 190,115\" fill=\"#064e3b\"/>\n        <rect x=\"25\" y=\"116\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#0f766e\"/>\n        <text x=\"100\" y=\"129\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">CAMP MYSTERY 🏕️</text>\n      </svg>",
    "categoryGroup": "Camp Mystery Stories",
    "vocabulary": {
      "core": [
        "tent",
        "campfire",
        "flashlight",
        "forest",
        "footprint",
        "mystery"
      ],
      "supporting": [
        "marshmallow",
        "sleeping bag",
        "cabin",
        "shadow",
        "creak"
      ],
      "phonics": [
        "/fl/ in flashlight",
        "/sp/ in suspect"
      ]
    },
    "grammar": {
      "focusPattern": "Someone took the [item] while we were [activity]",
      "formula": "While the campers were sleeping in their tents, someone took the golden compass.",
      "formulas": [
        "Past Continuous + Past Simple: While + Subject + was/were + Gerund, Subject + Past Simple",
        "Deduction: It could not be [Suspect] because they were + [Place]"
      ]
    },
    "clilDomain": "Outdoor Wilderness & Clue Deduction",
    "clilTheme": "Outdoor Wilderness & Clue Deduction",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "⛺",
    "formula": "While the campers were sleeping in their tents, someone took the golden compass.",
    "url": "camp-mystery/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "phonics-adventure",
    "title": "Phonics Adventure: Blends & Digraphs",
    "description": "Interactive sound detectives mission practicing SH, CH, ST, PL, FL, PR, and FR through audio recognition, reading, spelling challenges, and a 4-lock escape room.",
    "type": "phonics",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🔤 Phonics & Literacy",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grades 3–4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 45,
    "durationText": "40–50 min",
    "estimatedMinutes": 45,
    "xp": 80,
    "skills": [
      "Phonics",
      "Listening",
      "Speaking",
      "Reading",
      "Spelling"
    ],
    "topic": "Digraphs & Consonant Blends",
    "topics": [
      "Consonant Blends",
      "Digraphs & Vowels",
      "Phonics Decoding"
    ],
    "languageFocus": "Digraphs (SH, CH) and Consonant Blends (ST, PL, FL, PR, FR)",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Audio Soundboard & Escape Room Challenge",
    "difficulty": "Elementary",
    "tags": [
      "phonics",
      "blends",
      "digraphs",
      "reading",
      "spelling",
      "escape-room",
      "audio"
    ],
    "learningObjectives": [
      "Differentiate initial and final consonant blends (st, pl, fl, br, tr, cl)",
      "Decode consonant digraphs (sh, ch, th, wh) and identify minimal pairs",
      "Contrast short and long vowel phonemes (a_e, e_e, i_e, o_e, u_e)",
      "Blend phonemes rapidly to decode unfamiliar multisyllabic words"
    ],
    "teacherInstructions": "Use the interactive audio soundboard for whole-class listening drills, then divide into small groups to crack the 4 Phonics Escape Room locks.",
    "studentInstructions": "Listen carefully to the target sounds, spot the correct blends, and unlock the escape room chest!",
    "route": "phonics/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#312e81\"/>\n        <circle cx=\"100\" cy=\"65\" r=\"38\" fill=\"#4338ca\"/>\n        <circle cx=\"90\" cy=\"55\" r=\"26\" fill=\"#6366f1\" stroke=\"#fbbf24\" stroke-width=\"4\"/>\n        <line x1=\"110\" y1=\"75\" x2=\"135\" y2=\"100\" stroke=\"#fbbf24\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n        <text x=\"90\" y=\"64\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"20\" fill=\"#ffffff\" text-anchor=\"middle\">SH</text>\n        <rect x=\"25\" y=\"114\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#f59e0b\"/>\n        <text x=\"100\" y=\"127\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">PHONICS DETECTIVE 🔤</text>\n      </svg>",
    "categoryGroup": "Phonics & Digraphs",
    "vocabulary": {
      "core": [
        "ship",
        "chip",
        "star",
        "frog",
        "flag",
        "plane",
        "whale"
      ],
      "supporting": [
        "digraph",
        "blend",
        "vowel",
        "consonant",
        "phoneme",
        "rhyme"
      ],
      "phonics": [
        "/sh/ vs /ch/",
        "/st/ vs /sk/",
        "/pl/ vs /fl/",
        "/br/ vs /fr/"
      ]
    },
    "grammar": {
      "focusPattern": "The [word] starts with the sound [/sound/]",
      "formula": "The blend [st/pl/fl] combines with [ar/ane/ag] to decode the word [star/plane/flag].",
      "formulas": [
        "Phonics Formula: [Letter Blend] + [Rime] = [Word] (e.g., /fl/ + /ag/ = flag)",
        "Does [Word A] rhyme with [Word B]?"
      ]
    },
    "clilDomain": "Phonological Decoding & Minimal Pairs",
    "clilTheme": "Phonological Decoding & Minimal Pairs",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🔤",
    "formula": "The blend [st/pl/fl] combines with [ar/ane/ag] to decode the word [star/plane/flag].",
    "url": "phonics/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "monster-day",
    "title": "Build Your Own Monster!",
    "description": "Interactive real-time SVG monster creator workshop practicing body parts, colors, numbers, and 'It has got / I have got...' with speaking, listening, and secret monster modes.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🎮 Classroom Games",
    "level": "Pre-A1–A1+",
    "cefrLevel": "A1",
    "age": "Ages 5–9",
    "ageGroup": "5-8",
    "grade": "Grades 1–4",
    "grades": [
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 30,
    "durationText": "25–35 min",
    "estimatedMinutes": 30,
    "xp": 60,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Listening",
      "Writing"
    ],
    "topic": "Body Parts & Descriptive Adjectives",
    "topics": [
      "Body Parts & Anatomy",
      "Adjective Order & Describing Monsters",
      "Have got / Has got"
    ],
    "languageFocus": "It has got [number] [color] [body parts] / I have got...",
    "activityMode": "Interactive Creator Wizard / Whiteboard / Partner Challenges",
    "interactionType": "Real-Time SVG Monster Builder with 12-Step Customizer & Speech Engine",
    "difficulty": "Scaffolded (Pre-A1 to A1+)",
    "tags": [
      "monster",
      "body-parts",
      "colors",
      "have-got",
      "adjectives",
      "creative",
      "speaking",
      "listening"
    ],
    "learningObjectives": [
      "Use body part vocabulary (horns, claws, tentacles, wings, fangs) in creative descriptions",
      "Apply 'have got' and 'has got' in affirmative, negative, and interrogative sentences",
      "Follow color and quantity adjective order (e.g., 'three sharp purple horns')",
      "Build a custom digital monster and recite its morphological profile to the class"
    ],
    "teacherInstructions": "Have students dictate monster features to a student operator at the whiteboard, then have everyone write a 3-sentence description in their notebooks.",
    "studentInstructions": "Choose body, eyes, horns, colors, and accessories to build your custom monster, then describe what it has got!",
    "route": "monster-day/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"monsterThumbBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#4c1d95\"/>\n            <stop offset=\"50%\" stop-color=\"#7c3aed\"/>\n            <stop offset=\"100%\" stop-color=\"#db2777\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#monsterThumbBg)\"/>\n        <!-- Horns -->\n        <polygon points=\"68,38 52,14 80,28\" fill=\"#fbbf24\"/>\n        <polygon points=\"132,38 148,14 120,28\" fill=\"#fbbf24\"/>\n        <!-- Monster Body -->\n        <rect x=\"55\" y=\"30\" width=\"90\" height=\"74\" rx=\"36\" fill=\"#a855f7\" stroke=\"#ffffff\" stroke-width=\"2.5\"/>\n        <!-- 3 Eyes -->\n        <circle cx=\"76\" cy=\"52\" r=\"10\" fill=\"#ffffff\"/><circle cx=\"76\" cy=\"52\" r=\"4.5\" fill=\"#0f172a\"/><circle cx=\"74\" cy=\"50\" r=\"1.5\" fill=\"#ffffff\"/>\n        <circle cx=\"100\" cy=\"46\" r=\"13\" fill=\"#ffffff\"/><circle cx=\"100\" cy=\"46\" r=\"6\" fill=\"#0f172a\"/><circle cx=\"98\" cy=\"43\" r=\"2\" fill=\"#ffffff\"/>\n        <circle cx=\"124\" cy=\"52\" r=\"10\" fill=\"#ffffff\"/><circle cx=\"124\" cy=\"52\" r=\"4.5\" fill=\"#0f172a\"/><circle cx=\"122\" cy=\"50\" r=\"1.5\" fill=\"#ffffff\"/>\n        <!-- Smile & Teeth -->\n        <path d=\"M 76 76 Q 100 96 124 76\" fill=\"#4c1d95\" stroke=\"#ffffff\" stroke-width=\"2\"/>\n        <polygon points=\"86,77 92,86 98,78\" fill=\"#ffffff\"/>\n        <polygon points=\"102,78 108,86 114,77\" fill=\"#ffffff\"/>\n        <!-- Label Badge -->\n        <rect x=\"25\" y=\"112\" width=\"150\" height=\"20\" rx=\"10\" fill=\"#fde047\"/>\n        <text x=\"100\" y=\"126\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"9.5\" fill=\"#581c87\" text-anchor=\"middle\" letter-spacing=\"0.5\">BUILD YOUR MONSTER! 👾</text>\n      </svg>",
    "categoryGroup": "Monster Morphology",
    "vocabulary": {
      "core": [
        "horn",
        "tail",
        "wing",
        "claw",
        "eye",
        "fang",
        "fur",
        "monster"
      ],
      "supporting": [
        "tentacle",
        "scale",
        "spooky",
        "fuzzy",
        "gigantic",
        "slimy"
      ],
      "phonics": [
        "/h/ in horn",
        "/w/ in wing",
        "/cl/ in claw"
      ]
    },
    "grammar": {
      "focusPattern": "My monster has got [number] [adjective] [body parts]",
      "formula": "My monster has got [three] [sharp] [purple horns] and [two big wings].",
      "formulas": [
        "Subject + have/has got + [Number] + [Adjective] + [Plural Noun]",
        "Has it got [Body Part]? Yes, it has. / No, it hasn't."
      ]
    },
    "clilDomain": "Anatomy Description & Attribute Formulas",
    "clilTheme": "Anatomy Description & Attribute Formulas",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "👾",
    "formula": "My monster has got [three] [sharp] [purple horns] and [two big wings].",
    "url": "monster-day/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "restaurant",
    "title": "At the Restaurant",
    "description": "Interactive dining role-play practicing 'I would like...', menu ordering, secret challenge cards, polite requests, and bill calculation.",
    "type": "roleplay",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🎭 Role Plays",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-8",
    "grade": "Grades 2–5",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 75,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Roleplay"
    ],
    "topic": "Food & Polite Requests",
    "topics": [
      "Food & Dining",
      "Polite Requests & Social Interaction",
      "Transactions & Currency"
    ],
    "languageFocus": "I would like [food] please / How much is...?",
    "activityMode": "Turn-taking & Pairs",
    "interactionType": "Interactive Restaurant Stage & Bill Calculator",
    "difficulty": "Elementary",
    "tags": [
      "restaurant",
      "food",
      "roleplay",
      "polite",
      "ordering",
      "dialogue",
      "math"
    ],
    "learningObjectives": [
      "Roleplay restaurant dining transactions: greeting, ordering food, asking for the bill, paying",
      "Use polite modal request structures ('Can I have...?', 'I would like...')",
      "Categorize food items into courses: appetizers, main dishes, sides, beverages, desserts",
      "Calculate simple menu prices and practice currency vocabulary"
    ],
    "teacherInstructions": "Distribute secret menu challenge cards to students. Pair students up as Waiter and Customer to perform interactive dialogues.",
    "studentInstructions": "Look at the menu, decide what you want to eat, and politely place your order with the waiter!",
    "route": "restaurant/index.html",
    "worksheet": "restaurant/worksheets.html",
    "worksheetRoute": "restaurant/worksheets.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#ffedd5\"/>\n        <ellipse cx=\"100\" cy=\"105\" rx=\"60\" ry=\"22\" fill=\"#fed7aa\"/>\n        <rect x=\"94\" y=\"105\" width=\"12\" height=\"28\" fill=\"#c2410c\"/>\n        <ellipse cx=\"100\" cy=\"90\" rx=\"26\" ry=\"9\" fill=\"#e2e8f0\"/>\n        <path d=\"M 80 90 A 20 20 0 0 1 120 90 Z\" fill=\"#94a3b8\"/>\n        <circle cx=\"100\" cy=\"70\" r=\"3\" fill=\"#64748b\"/>\n        <rect x=\"45\" y=\"50\" width=\"24\" height=\"34\" rx=\"2\" fill=\"#ffffff\" stroke=\"#ea580c\" stroke-width=\"1.5\"/>\n      </svg>",
    "categoryGroup": "Everyday Roleplay",
    "vocabulary": {
      "core": [
        "menu",
        "order",
        "waiter",
        "customer",
        "bill",
        "delicious",
        "drink"
      ],
      "supporting": [
        "appetizer",
        "dessert",
        "napkin",
        "receipt",
        "chef",
        "table"
      ],
      "phonics": [
        "/m/ in menu",
        "/w/ in waiter"
      ]
    },
    "grammar": {
      "focusPattern": "I would like [food/drink], please. Can I have the bill?",
      "formula": "Could I please order [food item]? I would like [drink], thank you.",
      "formulas": [
        "Polite Request: Could / Can I have + Noun Phrase, please?",
        "Polite Desire: I would like / I'd like + Noun / to order + Noun"
      ]
    },
    "clilDomain": "Hospitality Transactions & Social Etiquette",
    "clilTheme": "Hospitality Transactions & Social Etiquette",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🍕",
    "formula": "Could I please order [food item]? I would like [drink], thank you.",
    "url": "restaurant/index.html",
    "worksheetUrl": "restaurant/worksheets.html"
  },
  {
    "id": "neighbourhood",
    "title": "My Neighbourhood",
    "description": "Living town exploration where students identify community locations, practice prepositions of place, and give walking tour directions.",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 6–9",
    "ageGroup": "7-8",
    "grade": "Grades 1–3",
    "grades": [
      "Grade 1",
      "Grade 2",
      "Grade 3"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 50,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Grammar"
    ],
    "topic": "Town Places & Prepositions",
    "topics": [
      "Places in Town",
      "Giving Directions",
      "Prepositions of Place"
    ],
    "languageFocus": "Prepositions of place (next to, opposite, between, behind)",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Interactive Town Map & Coordinate Quests",
    "difficulty": "Beginner",
    "tags": [
      "town",
      "neighbourhood",
      "prepositions",
      "places",
      "map",
      "directions"
    ],
    "learningObjectives": [
      "Identify municipal buildings and public landmarks (bakery, library, police station, park)",
      "Give and follow spatial directions using prepositions of place and directional imperatives",
      "Read an interactive town map and trace optimal walking routes to key locations",
      "Describe one personal neighbourhood and community facilities in spoken English"
    ],
    "teacherInstructions": "Display the town map. Call out a starting point and destination, prompting students to formulate direction sentences.",
    "studentInstructions": "Navigate the neighbourhood map, find the community buildings, and describe where they are located!",
    "route": "neighbourhood/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#ccfbf1\"/>\n        <rect x=\"0\" y=\"60\" width=\"200\" height=\"24\" fill=\"#94a3b8\"/>\n        <rect x=\"88\" y=\"0\" width=\"24\" height=\"140\" fill=\"#94a3b8\"/>\n        <rect x=\"25\" y=\"18\" width=\"40\" height=\"32\" rx=\"3\" fill=\"#38bdf8\"/>\n        <polygon points=\"45,6 20,18 70,18\" fill=\"#0284c7\"/>\n        <rect x=\"135\" y=\"18\" width=\"42\" height=\"32\" rx=\"3\" fill=\"#f59e0b\"/>\n        <polygon points=\"156,6 130,18 182,18\" fill=\"#d97706\"/>\n        <circle cx=\"45\" cy=\"112\" r=\"16\" fill=\"#10b981\"/>\n        <rect x=\"42\" y=\"118\" width=\"6\" height=\"16\" fill=\"#78350f\"/>\n      </svg>",
    "categoryGroup": "Urban Geography",
    "vocabulary": {
      "core": [
        "bakery",
        "library",
        "hospital",
        "supermarket",
        "park",
        "street",
        "corner"
      ],
      "supporting": [
        "post office",
        "pharmacy",
        "crossroad",
        "sidewalk",
        "avenue"
      ],
      "phonics": [
        "/b/ in bakery",
        "/st/ in street"
      ]
    },
    "grammar": {
      "focusPattern": "The [building] is [preposition] the [landmark]. Turn [direction]!",
      "formula": "The library is between the bakery and the park. Turn left at the corner.",
      "formulas": [
        "Prepositions of Place: Subject + is + opposite / next to / between / behind + Object",
        "Directions: Go straight on, turn left/right at the [Landmark]"
      ]
    },
    "clilDomain": "Spatial Navigation & Civic Landmarks",
    "clilTheme": "Spatial Navigation & Civic Landmarks",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🏘️",
    "formula": "The library is between the bakery and the park. Turn left at the corner.",
    "url": "neighbourhood/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "advice",
    "title": "The Crazy Advice Academy",
    "description": "Practice modal verbs 'should' and 'shouldn't' by solving 10 hilarious everyday dilemmas with Professor Should.",
    "type": "grammar",
    "category": "Phonics & Language Quests",
    "categoryLabel": "📚 Grammar Games",
    "level": "A2",
    "cefrLevel": "A2",
    "age": "Ages 8–12",
    "ageGroup": "9-10",
    "grade": "Grades 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 70,
    "skills": [
      "Grammar",
      "Speaking",
      "Problem Solving"
    ],
    "topic": "Modal Verbs: Should & Shouldn't",
    "topics": [
      "Giving Advice",
      "Modal Verbs (Should / Should Not)",
      "Health & Common Problems"
    ],
    "languageFocus": "Modal verbs: You should [verb] / You shouldn't [verb]",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Dilemma Decision Tree & Advice Matrix",
    "difficulty": "Intermediate",
    "tags": [
      "advice",
      "grammar",
      "should",
      "modal-verbs",
      "problem-solving",
      "dilemmas"
    ],
    "learningObjectives": [
      "Use modal verbs 'should' and 'should not' to give reasonable and humorous advice",
      "Analyze eccentric everyday dilemmas and formulate creative solutions",
      "Distinguish between imperative commands and gentle modal recommendations",
      "Collaborate in pairs to stage an interactive advice helpline radio show"
    ],
    "teacherInstructions": "Present each dilemma to the class. Have students write down their best advice on whiteboards before revealing Professor Should's funny solution.",
    "studentInstructions": "Help characters solve their wacky problems by giving them smart advice with 'should' and 'shouldn't'!",
    "route": "advice/index.html",
    "worksheet": "advice/worksheets.html",
    "worksheetRoute": "advice/worksheets.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#e0f2fe\"/>\n        <circle cx=\"100\" cy=\"60\" r=\"26\" fill=\"#facc15\"/>\n        <rect x=\"92\" y=\"84\" width=\"16\" height=\"8\" rx=\"1\" fill=\"#94a3b8\"/>\n        <line x1=\"100\" y1=\"24\" x2=\"100\" y2=\"14\" stroke=\"#0284c7\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <line x1=\"128\" y1=\"36\" x2=\"136\" y2=\"30\" stroke=\"#0284c7\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <line x1=\"72\" y1=\"36\" x2=\"64\" y2=\"30\" stroke=\"#0284c7\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <rect x=\"40\" y=\"70\" width=\"32\" height=\"42\" rx=\"3\" fill=\"#ffffff\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/>\n        <polyline points=\"48,86 52,90 58,82\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/>\n      </svg>",
    "categoryGroup": "Modals & Advice Quests",
    "vocabulary": {
      "core": [
        "should",
        "shouldn",
        "advice",
        "problem",
        "dilemma",
        "recommend",
        "idea"
      ],
      "supporting": [
        "headache",
        "stomachache",
        "exhausted",
        "helpful",
        "silly"
      ],
      "phonics": [
        "/sh/ in should",
        "/v/ in advice"
      ]
    },
    "grammar": {
      "focusPattern": "You should [verb] / You should not [verb]",
      "formula": "If your alarm clock breaks, you should invent a musical pillow!",
      "formulas": [
        "Modal Formula: Subject + should / should not + Base Verb",
        "Advice Pattern: If you have [Problem], you should + Base Verb"
      ]
    },
    "clilDomain": "Functional Ethics & Helpful Recommendations",
    "clilTheme": "Functional Ethics & Helpful Recommendations",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "💡",
    "formula": "If your alarm clock breaks, you should invent a musical pillow!",
    "url": "advice/index.html",
    "worksheetUrl": "advice/worksheets.html"
  },
  {
    "id": "predictions",
    "title": "What Will Happen Next?",
    "description": "Dramatic frozen cliffhangers where students predict future outcomes with WILL and WON'T before comic reveals.",
    "type": "grammar",
    "category": "Phonics & Language Quests",
    "categoryLabel": "📚 Grammar Games",
    "level": "A2",
    "cefrLevel": "A2",
    "age": "Ages 8–12",
    "ageGroup": "9-10",
    "grade": "Grades 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 65,
    "skills": [
      "Grammar",
      "Reading",
      "Speaking"
    ],
    "topic": "Future Predictions with WILL",
    "topics": [
      "Future Predictions",
      "Future Simple Tense (Will / Won't)",
      "Future Tech & Society"
    ],
    "languageFocus": "Future predictions: It will... / He won't...",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Comic Cliffhanger & Reveal Stage",
    "difficulty": "Intermediate",
    "tags": [
      "predictions",
      "grammar",
      "will",
      "future",
      "won't",
      "comic",
      "cliffhanger"
    ],
    "learningObjectives": [
      "Express future certainty and prediction using 'will' and 'will not'",
      "Use adverbs of probability (probably, definitely, maybe) in future forecasts",
      "Interpret crystal ball clues to predict technological and lifestyle developments in 2050",
      "Formulate fortune-telling sentences about classmates future careers and adventures"
    ],
    "teacherInstructions": "Freeze each comic strip at the cliffhanger. Ask students to make predictions using 'I think he will...' before advancing to the reveal.",
    "studentInstructions": "Examine the comic clues, predict what will happen next, and see if you guessed right!",
    "route": "predictions/index.html",
    "worksheet": "predictions/worksheets.html",
    "worksheetRoute": "predictions/worksheets.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#f3e8ff\"/>\n        <circle cx=\"100\" cy=\"65\" r=\"32\" fill=\"#c084fc\"/>\n        <circle cx=\"92\" cy=\"56\" r=\"10\" fill=\"#ffffff\" opacity=\"0.4\"/>\n        <path d=\"M 78 106 L 122 106 L 112 94 L 88 94 Z\" fill=\"#6b21a8\"/>\n        <rect x=\"74\" y=\"106\" width=\"52\" height=\"7\" rx=\"2\" fill=\"#581c87\"/>\n      </svg>",
    "categoryGroup": "Future Tense Quests",
    "vocabulary": {
      "core": [
        "will",
        "won",
        "future",
        "predict",
        "tomorrow",
        "soon",
        "fortune"
      ],
      "supporting": [
        "crystal ball",
        "destiny",
        "flying car",
        "astronaut",
        "invent"
      ],
      "phonics": [
        "/w/ in will",
        "/f/ in future"
      ]
    },
    "grammar": {
      "focusPattern": "In the future, people will [verb]. It will not [verb]",
      "formula": "In 2050, children will travel in flying solar cars and robots will assist teachers.",
      "formulas": [
        "Future Simple: Subject + will / will not + Base Verb",
        "Probability: Subject + will probably + Base Verb + in [Year/Time]"
      ]
    },
    "clilDomain": "Futurism & Speculative Technology",
    "clilTheme": "Futurism & Speculative Technology",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🔮",
    "formula": "In 2050, children will travel in flying solar cars and robots will assist teachers.",
    "url": "predictions/index.html",
    "worksheetUrl": "predictions/worksheets.html"
  },
  {
    "id": "city-mouse",
    "title": "The City Mouse & The Country Mouse",
    "description": "Interactive Aesop's fable contrasting urban skyscrapers with calm country fields and comparative adjectives.",
    "type": "story",
    "category": "Story & Literature",
    "categoryLabel": "📖 Interactive Stories",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grades 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 60,
    "skills": [
      "Reading",
      "Speaking",
      "Vocabulary"
    ],
    "topic": "Town vs Country & Comparatives",
    "topics": [
      "Aesop's Fables",
      "City vs Country Life",
      "Comparative Adjectives"
    ],
    "languageFocus": "Comparative adjectives: bigger, quieter, faster, cleaner",
    "activityMode": "Classroom / Whole Group",
    "interactionType": "Interactive Fable & Contrast Hotspots",
    "difficulty": "Beginner",
    "tags": [
      "fable",
      "city-mouse",
      "country-mouse",
      "reading",
      "comparatives",
      "story"
    ],
    "learningObjectives": [
      "Read and analyze Aesop's classic fable 'The City Mouse and the Country Mouse'",
      "Compare and contrast urban and rural environments using comparative adjectives",
      "Identify the moral lesson of the fable (peace and safety vs luxury and danger)",
      "Retell the fable from the perspective of either the city mouse or the country mouse"
    ],
    "teacherInstructions": "Engage students in a Venn diagram activity comparing the two mice's houses and food.",
    "studentInstructions": "Follow the mice to town and country, tap on hidden items, and compare city life with country life!",
    "route": "city-mouse/index.html",
    "worksheet": "city-mouse/worksheet.html",
    "worksheetRoute": "city-mouse/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#fef3c7\"/>\n        <rect x=\"105\" y=\"20\" width=\"28\" height=\"100\" fill=\"#94a3b8\"/>\n        <rect x=\"138\" y=\"35\" width=\"26\" height=\"85\" fill=\"#64748b\"/>\n        <path d=\"M 0 120 Q 50 80 100 120 Z\" fill=\"#86efac\"/>\n        <rect x=\"35\" y=\"80\" width=\"28\" height=\"22\" rx=\"2\" fill=\"#f59e0b\"/>\n        <polygon points=\"49,68 30,80 68,80\" fill=\"#b45309\"/>\n        <line x1=\"100\" y1=\"10\" x2=\"100\" y2=\"130\" stroke=\"#d97706\" stroke-dasharray=\"3 3\" stroke-width=\"1.5\"/>\n      </svg>",
    "categoryGroup": "Aesop's Fables",
    "vocabulary": {
      "core": [
        "city",
        "country",
        "mouse",
        "quiet",
        "noisy",
        "danger",
        "feast"
      ],
      "supporting": [
        "luxurious",
        "simple",
        "frightened",
        "pantry",
        "meadow",
        "barn"
      ],
      "phonics": [
        "/s/ in city",
        "/m/ in mouse"
      ]
    },
    "grammar": {
      "focusPattern": "The city is [more dangerous] than the country, but the food is [fresher]",
      "formula": "The city has more delicious food than the country, but the country is safer.",
      "formulas": [
        "Comparative Adjectives: Noun 1 + is + Comparative + than + Noun 2",
        "Preference: Subject + prefers + Noun + because + Clause"
      ]
    },
    "clilDomain": "Fable Analysis & Environmental Comparison",
    "clilTheme": "Fable Analysis & Environmental Comparison",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "🐭",
    "formula": "The city has more delicious food than the country, but the country is safer.",
    "url": "city-mouse/index.html",
    "worksheetUrl": "city-mouse/worksheet.html"
  },
  {
    "id": "story",
    "title": "The Wizard of Oz",
    "description": "11-scene dramatized reader's theater stage following Dorothy, Scarecrow, Tin Woodman, and Lion down the Yellow Brick Road.",
    "type": "story",
    "category": "Story & Literature",
    "categoryLabel": "📖 Interactive Stories",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grades 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 75,
    "skills": [
      "Reading",
      "Speaking",
      "Listening",
      "Roleplay"
    ],
    "topic": "Classic Storytelling & Emotions",
    "topics": [
      "Classic American Literature",
      "Character Virtues & Quests",
      "The Wizard of Oz"
    ],
    "languageFocus": "Dialogue reading, Character feelings, Narrative past tense",
    "activityMode": "Reader's Theater & Whole Group",
    "interactionType": "11-Scene Dramatized Classroom Stage",
    "difficulty": "Elementary",
    "tags": [
      "wizard-of-oz",
      "story",
      "theater",
      "reading",
      "dorothy",
      "drama"
    ],
    "learningObjectives": [
      "Explore Frank L. Baum's The Wonderful Wizard of Oz narrative journey",
      "Identify the key character traits and aspirations of Dorothy, Scarecrow, Tin Woodman, and Cowardly Lion",
      "Sequence the heroes quest along the Yellow Brick Road to the Emerald City",
      "Infer the allegorical meaning of brain (wisdom), heart (love), and courage (bravery)"
    ],
    "teacherInstructions": "Assign roles to student actors (Dorothy, Scarecrow, Tin Woodman, Lion, Narrator). Advance scenes as students act out their lines.",
    "studentInstructions": "Step into the story, choose your character role, and follow the Yellow Brick Road to meet the Wizard!",
    "route": "story/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#ede9fe\"/>\n        <path d=\"M 0 140 Q 80 100 100 70 Q 120 40 140 15 L 160 15 Q 140 50 120 80 Q 90 120 0 140 Z\" fill=\"#fde047\"/>\n        <rect x=\"130\" y=\"25\" width=\"16\" height=\"45\" rx=\"2\" fill=\"#10b981\"/>\n        <polygon points=\"138,12 130,25 146,25\" fill=\"#059669\"/>\n        <rect x=\"150\" y=\"35\" width=\"18\" height=\"35\" rx=\"2\" fill=\"#059669\"/>\n        <polygon points=\"159,22 150,35 168,35\" fill=\"#047857\"/>\n      </svg>",
    "categoryGroup": "The Wizard of Oz",
    "vocabulary": {
      "core": [
        "tornado",
        "brick",
        "emerald",
        "scarecrow",
        "courage",
        "heart",
        "brain"
      ],
      "supporting": [
        "slippers",
        "yellow brick road",
        "wizard",
        "witch",
        "kingdom"
      ],
      "phonics": [
        "/sc/ in scarecrow",
        "/br/ in brick"
      ]
    },
    "grammar": {
      "focusPattern": "The Scarecrow wants a [brain] because he wants to [verb]",
      "formula": "The Scarecrow travels to the Emerald City in order to ask the Wizard for a brain.",
      "formulas": [
        "Desire & Motivation: Subject + wants + Noun + in order to + Base Verb",
        "There's no place like [Home]!"
      ]
    },
    "clilDomain": "Heroic Quests & Allegorical Character Virtues",
    "clilTheme": "Heroic Quests & Allegorical Character Virtues",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "📖",
    "formula": "The Scarecrow travels to the Emerald City in order to ask the Wizard for a brain.",
    "url": "story/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "detective-prep",
    "title": "Detective Prep",
    "description": "Rapid-fire 10-minute whiteboard warm-up drilling Wh-questions (Who, Where, What) before the detective mystery.",
    "type": "warmup",
    "category": "Phonics & Language Quests",
    "categoryLabel": "⚡ Quick Warm-ups",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 8–9",
    "ageGroup": "9-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 10,
    "durationText": "10 min",
    "estimatedMinutes": 10,
    "xp": 25,
    "skills": [
      "Speaking",
      "Grammar"
    ],
    "topic": "Wh-Questions & Interrogation",
    "topics": [
      "Observation Skills",
      "Wh- Questions",
      "Detective Warm-up Drills"
    ],
    "languageFocus": "Interrogative syntax: Who / What / Where / When",
    "activityMode": "Fast-Paced Whole Group Drill",
    "interactionType": "Rapid Interactive Quiz",
    "difficulty": "Beginner",
    "tags": [
      "warmup",
      "detective",
      "questions",
      "wh-questions",
      "fast"
    ],
    "learningObjectives": [
      "Warm up visual observation and memory recall with 30-second clue flashcards",
      "Practice interrogative Wh- questions (Who, What, Where, When, Why)",
      "Formulate quick hypotheses based on partial visual footprints and silhouettes",
      "Engage in energetic classroom call-and-response deductive drills"
    ],
    "teacherInstructions": "Use this 10-minute warm-up immediately prior to starting the Treasure Mystery.",
    "studentInstructions": "Answer the quick detective questions and earn your junior investigator badge!",
    "route": "treasure/index.html#prep-intro",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#eff6ff\"/>\n        <circle cx=\"100\" cy=\"60\" r=\"28\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"5\"/>\n        <line x1=\"120\" y1=\"80\" x2=\"148\" y2=\"108\" stroke=\"#1e40af\" stroke-width=\"7\" stroke-linecap=\"round\"/>\n        <text x=\"92\" y=\"70\" font-family=\"sans-serif\" font-weight=\"800\" font-size=\"26\" fill=\"#2563eb\">?</text>\n      </svg>",
    "categoryGroup": "Deduction Warm-ups",
    "vocabulary": {
      "core": [
        "magnifying glass",
        "clue",
        "fingerprint",
        "footstep",
        "mystery",
        "spot"
      ],
      "supporting": [
        "badge",
        "trench coat",
        "evidence",
        "observe",
        "detect"
      ],
      "phonics": [
        "/sp/ in spot",
        "/cl/ in clue"
      ]
    },
    "grammar": {
      "focusPattern": "Who took the [item]? What did they leave behind?",
      "formula": "Who left these muddy footprints? What clue did they drop near the door?",
      "formulas": [
        "Wh- Questions: Wh- + did + Subject + Base Verb?",
        "Modal of Deduction: It might / could be + [Noun]"
      ]
    },
    "clilDomain": "Observational Deduction & Rapid Inquiries",
    "clilTheme": "Observational Deduction & Rapid Inquiries",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🔍",
    "formula": "Who left these muddy footprints? What clue did they drop near the door?",
    "url": "treasure/index.html#prep-intro",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "treasure",
    "title": "Treasure Mystery",
    "description": "Solve the royal theft with a 4-team live scoreboard. Cross-examine suspects and evaluate clues using the past continuous tense.",
    "type": "game",
    "category": "Story & Literature",
    "categoryLabel": "🕵️ Mystery & Detective",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 8–10",
    "ageGroup": "9-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 80,
    "skills": [
      "Speaking",
      "Listening",
      "Vocabulary",
      "Grammar"
    ],
    "topic": "Past Continuous & Detective Clues",
    "topics": [
      "Pirate Adventures",
      "Compass Navigation & Maps",
      "Treasure Mysteries"
    ],
    "languageFocus": "What were you doing at [time]? / I was [verb-ing]",
    "activityMode": "4-Team Competition",
    "interactionType": "Live Scoreboard Whodunit Investigation",
    "difficulty": "Elementary",
    "tags": [
      "treasure",
      "mystery",
      "detective",
      "past-continuous",
      "teams",
      "investigation"
    ],
    "learningObjectives": [
      "Follow pirate treasure map compass directions (North, South, East, West)",
      "Decode navigational riddles and counting rhymes to locate hidden treasure chests",
      "Use imperative navigation sentences to guide pirate ship crews across treacherous waters",
      "Construct descriptive pirate log entries recounting maritime adventures"
    ],
    "teacherInstructions": "Divide class into 4 detective teams. Award points on the live scoreboard as teams uncover evidence and evaluate suspect alibis.",
    "studentInstructions": "Question the suspects, check their alibis, and identify who stole the royal treasure!",
    "route": "treasure/index.html#intro",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#fef3c7\"/>\n        <rect x=\"52\" y=\"60\" width=\"96\" height=\"56\" rx=\"5\" fill=\"#92400e\"/>\n        <path d=\"M 52 60 Q 100 32 148 60 Z\" fill=\"#b45309\"/>\n        <rect x=\"94\" y=\"62\" width=\"12\" height=\"16\" rx=\"2\" fill=\"#facc15\"/>\n        <rect x=\"66\" y=\"60\" width=\"8\" height=\"56\" fill=\"#fbbf24\"/>\n        <rect x=\"126\" y=\"60\" width=\"8\" height=\"56\" fill=\"#fbbf24\"/>\n      </svg>",
    "categoryGroup": "Pirate Island Quests",
    "vocabulary": {
      "core": [
        "treasure",
        "chest",
        "compass",
        "island",
        "pirate",
        "sail",
        "anchor"
      ],
      "supporting": [
        "skull",
        "crossbones",
        "reef",
        "latitude",
        "gold coins",
        "voyage"
      ],
      "phonics": [
        "/tr/ in treasure",
        "/ch/ in chest"
      ]
    },
    "grammar": {
      "focusPattern": "Walk [number] paces [direction] from the [landmark]",
      "formula": "Walk twenty paces North from the skull rock and dig where X marks the spot.",
      "formulas": [
        "Cardinal Navigation: Go / Walk + [Number] steps + North / South / East / West",
        "Location: The treasure is buried + Prepositional Phrase"
      ]
    },
    "clilDomain": "Cartography & Maritime Navigation",
    "clilTheme": "Cartography & Maritime Navigation",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "thumbnailIcon": "💎",
    "formula": "Walk twenty paces North from the skull rock and dig where X marks the spot.",
    "url": "treasure/index.html#intro",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "room-rescue",
    "title": "Room Rescue",
    "description": "Restore disorganized rooms by placing furniture items according to precise coordinate and spatial prepositions clues.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🎮 Classroom Games",
    "level": "A1",
    "cefrLevel": "A1",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 30,
    "durationText": "25–35 min",
    "estimatedMinutes": 30,
    "xp": 50,
    "skills": [
      "Vocabulary",
      "Speaking",
      "Grammar"
    ],
    "topic": "Furniture & Spatial Prepositions",
    "topics": [
      "Furniture & House Objects",
      "Prepositions of Place",
      "Cleaning & Organizing"
    ],
    "languageFocus": "Place the [item] next to / above / under / between the [item]",
    "activityMode": "Turn-taking & Pairs",
    "interactionType": "Drag-and-Drop Room Staging Challenge",
    "difficulty": "Beginner",
    "tags": [
      "room",
      "furniture",
      "prepositions",
      "placement",
      "coordinates"
    ],
    "learningObjectives": [
      "Identify household furniture, bedroom items, and toys in English",
      "Use spatial prepositions (on, in, under, behind, next to, above) to locate messy items",
      "Formulate imperative cleaning and organizing commands ('Put the socks in the drawer')",
      "Collaborate in a timed clean-up challenge to restore bedroom order"
    ],
    "teacherInstructions": "Have one student give verbal placement directions while another places items on the interactive board.",
    "studentInstructions": "Listen to the clues and put all the messy furniture in the right spots!",
    "route": "treasure/index.html#room-rescue",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#ecfdf5\"/>\n        <polygon points=\"0,0 200,0 170,25 30,25\" fill=\"#d1fae5\"/>\n        <polygon points=\"30,25 170,25 170,105 30,105\" fill=\"#a7f3d0\"/>\n        <polygon points=\"30,105 170,105 200,140 0,140\" fill=\"#6ee7b7\"/>\n        <rect x=\"68\" y=\"75\" width=\"64\" height=\"30\" rx=\"3\" fill=\"#047857\"/>\n        <rect x=\"78\" y=\"60\" width=\"20\" height=\"15\" rx=\"2\" fill=\"#3b82f6\"/>\n      </svg>",
    "categoryGroup": "Spatial Organization",
    "vocabulary": {
      "core": [
        "bed",
        "wardrobe",
        "desk",
        "carpet",
        "shelf",
        "drawer",
        "tidy",
        "messy"
      ],
      "supporting": [
        "pillow",
        "blanket",
        "laundry",
        "bin",
        "clutter",
        "organize"
      ],
      "phonics": [
        "/b/ in bed",
        "/sh/ in shelf"
      ]
    },
    "grammar": {
      "focusPattern": "Where is the [item]? It is [preposition] the [furniture]",
      "formula": "Put the textbooks on the desk and place the sneakers inside the wardrobe.",
      "formulas": [
        "Spatial Location: Subject + is / are + [Preposition of Place] + the + [Furniture]",
        "Imperative: Put the [Object] + [Preposition] + the + [Container/Furniture]"
      ]
    },
    "clilDomain": "Domestic Living & Spatial Organization",
    "clilTheme": "Domestic Living & Spatial Organization",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "🚪",
    "formula": "Put the textbooks on the desk and place the sneakers inside the wardrobe.",
    "url": "treasure/index.html#room-rescue",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "clil-lab",
    "title": "CLIL Crime Lab",
    "description": "Integrate English with science! Examine microscope fibers, compare fingerprint patterns, and test pH chemistry.",
    "type": "clil",
    "category": "CLIL & Science",
    "categoryLabel": "🌍 CLIL",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 4",
      "Grade 5"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 70,
    "skills": [
      "CLIL",
      "Vocabulary",
      "Reading"
    ],
    "topic": "Forensic Science & Investigation",
    "topics": [
      "Forensic Science",
      "Laboratory Experiments",
      "Scientific Evidence"
    ],
    "languageFocus": "Scientific observation chunks: It looks like... / It contains...",
    "activityMode": "Interactive Science Exploration",
    "interactionType": "Virtual Science Lab Simulation",
    "difficulty": "Intermediate",
    "tags": [
      "clil",
      "science",
      "forensics",
      "microscope",
      "chemistry",
      "reading"
    ],
    "learningObjectives": [
      "Apply forensic scientific methods: collection of evidence, chromatography, and fingerprint matching",
      "Formulate scientific hypotheses and record objective lab observations",
      "Use passive and descriptive language to detail chemical and physical reactions",
      "Deduce forensic conclusions using evidence-based reasoning"
    ],
    "teacherInstructions": "Guide students through the 3 forensic stations, connecting science concepts directly to descriptive language.",
    "studentInstructions": "Put on your lab coat, analyze the evidence under the microscope, and find the forensic match!",
    "route": "treasure/index.html#clil-lab",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#e0f2fe\"/>\n        <path d=\"M 94 30 L 106 30 L 106 55 L 128 100 L 72 100 L 94 55 Z\" fill=\"#38bdf8\" opacity=\"0.8\"/>\n        <ellipse cx=\"100\" cy=\"100\" rx=\"28\" ry=\"7\" fill=\"#0284c7\"/>\n        <circle cx=\"95\" cy=\"78\" r=\"3.5\" fill=\"#ffffff\"/>\n        <circle cx=\"107\" cy=\"88\" r=\"2.5\" fill=\"#ffffff\"/>\n        <rect x=\"145\" y=\"95\" width=\"30\" height=\"14\" rx=\"2\" fill=\"#475569\"/>\n        <path d=\"M 160 95 L 160 50 L 142 50\" fill=\"none\" stroke=\"#475569\" stroke-width=\"5\"/>\n      </svg>",
    "categoryGroup": "Forensic Chemistry",
    "vocabulary": {
      "core": [
        "evidence",
        "fingerprint",
        "microscope",
        "sample",
        "analyze",
        "chemical"
      ],
      "supporting": [
        "chromatography",
        "powder",
        "test tube",
        "magnify",
        "forensics"
      ],
      "phonics": [
        "/ev/ in evidence",
        "/s/ in sample"
      ]
    },
    "grammar": {
      "focusPattern": "The sample showed that [reaction occurred]",
      "formula": "The chemical chromatography test proved that the ink sample matched the ransom note.",
      "formulas": [
        "Reported Observation: The test indicates that + Clause",
        "Passive / Result: The fingerprint was found on the + [Surface]"
      ]
    },
    "clilDomain": "Forensic Evidence & Chromatography",
    "clilTheme": "Forensic Evidence & Chromatography",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🔬",
    "formula": "The chemical chromatography test proved that the ink sample matched the ransom note.",
    "url": "treasure/index.html#clil-lab",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "expedition",
    "title": "The Last Expedition",
    "description": "Explore world biomes from rainforests to the Arctic, practicing wildlife terms, compass directions, and survival gear.",
    "type": "clil",
    "category": "CLIL & Science",
    "categoryLabel": "🌍 CLIL",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 4",
      "Grade 5"
    ],
    "duration": 35,
    "durationText": "30–40 min",
    "estimatedMinutes": 35,
    "xp": 70,
    "skills": [
      "CLIL",
      "Speaking",
      "Listening"
    ],
    "topic": "Global Biomes & Navigation",
    "topics": [
      "Polar Exploration",
      "Survival Gear & Wilderness",
      "Arctic Geography"
    ],
    "languageFocus": "Compass directions (North, South, East, West) & Habitat vocabulary",
    "activityMode": "Whole Group Expedition",
    "interactionType": "Interactive Biome Map & Navigation Challenge",
    "difficulty": "Intermediate",
    "tags": [
      "clil",
      "geography",
      "biomes",
      "compass",
      "navigation",
      "expedition"
    ],
    "learningObjectives": [
      "Plan a polar arctic expedition: survival gear, caloric nutrition, and navigation instruments",
      "Use modal verbs of necessity (need to, must, have to) for extreme survival situations",
      "Understand severe weather conditions (blizzard, subzero temperatures, ice floes)",
      "Write daily explorer journal entries documenting arctic wildlife and endurance"
    ],
    "teacherInstructions": "Have students work in navigation pairs to chart courses across biomes using compass bearings.",
    "studentInstructions": "Pack your expedition backpack, use your compass, and lead your team across the extreme biomes!",
    "route": "treasure/index.html#expedition",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#ecfdf5\"/>\n        <polygon points=\"100,20 45,110 155,110\" fill=\"#059669\"/>\n        <polygon points=\"100,20 80,55 120,55\" fill=\"#ffffff\"/>\n        <circle cx=\"50\" cy=\"45\" r=\"20\" fill=\"#ffffff\" stroke=\"#10b981\" stroke-width=\"2\"/>\n        <polygon points=\"50,30 53,44 50,41 47,44\" fill=\"#ef4444\"/>\n        <polygon points=\"50,60 53,46 50,49 47,46\" fill=\"#475569\"/>\n      </svg>",
    "categoryGroup": "Polar Exploration",
    "vocabulary": {
      "core": [
        "expedition",
        "glacier",
        "blizzard",
        "compass",
        "sledge",
        "survival",
        "frost"
      ],
      "supporting": [
        "crevasse",
        "thermal",
        "rations",
        "polar bear",
        "endurance"
      ],
      "phonics": [
        "/gl/ in glacier",
        "/fr/ in frost"
      ]
    },
    "grammar": {
      "focusPattern": "Explorers must carry [gear] because the weather is [adjective]",
      "formula": "Arctic explorers must wear insulated thermal parkas because the blizzard is freezing.",
      "formulas": [
        "Modal of Necessity: Subject + must / have to + Base Verb + in order to survive",
        "Weather Condition: If temperature drops below [Degrees], Subject + must + Base Verb"
      ]
    },
    "clilDomain": "Extreme Polar Climates & Survival Gear",
    "clilTheme": "Extreme Polar Climates & Survival Gear",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🧭",
    "formula": "Arctic explorers must wear insulated thermal parkas because the blizzard is freezing.",
    "url": "treasure/index.html#expedition",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "pokemon",
    "title": "Pokémon Trainer Battle",
    "description": "Gamified arena showdown where answering grammar challenges powers up attacks and defenses with animated HP bars.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🎮 Classroom Games",
    "level": "A1–A2",
    "cefrLevel": "A1–A2",
    "age": "Ages 8–12",
    "ageGroup": "9-10",
    "grade": "Grades 3–6",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 80,
    "skills": [
      "Grammar",
      "Speaking",
      "Vocabulary"
    ],
    "topic": "Action Verbs & Ability with Can",
    "topics": [
      "Comparatives & Superlatives",
      "Tactical Gaming & Elemental Types",
      "Creature Battles"
    ],
    "languageFocus": "Modal ability (can / can't) and action verb commands",
    "activityMode": "Team Arena Battle",
    "interactionType": "Gamified Battle Arena with Animated HP Bars",
    "difficulty": "Elementary",
    "tags": [
      "pokemon",
      "battle",
      "can",
      "verbs",
      "game",
      "competition"
    ],
    "learningObjectives": [
      "Compare creature stats (HP, Attack, Defense, Speed) using comparative and superlative adjectives",
      "Formulate tactical conditional statements (If Pikachu uses Thunderbolt, Charizard will take damage)",
      "Categorize creature types by elemental attributes (Fire, Water, Grass, Electric)",
      "Present a balanced 3-creature team justifying strengths and tactical advantages"
    ],
    "teacherInstructions": "Split the classroom into Red and Blue Trainer Gyms. Teams take turns answering grammar prompts to unleash attacks.",
    "studentInstructions": "Pick your Pokémon companion, answer grammar questions correctly, and battle to become the champion!",
    "route": "pokemon/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#dbeafe\"/>\n        <ellipse cx=\"100\" cy=\"95\" rx=\"70\" ry=\"26\" fill=\"#93c5fd\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"26\" fill=\"#ef4444\"/>\n        <path d=\"M 74 55 A 26 26 0 0 0 126 55 Z\" fill=\"#ffffff\"/>\n        <line x1=\"74\" y1=\"55\" x2=\"126\" y2=\"55\" stroke=\"#0f172a\" stroke-width=\"4.5\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"8\" fill=\"#0f172a\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"4\" fill=\"#ffffff\"/>\n      </svg>",
    "categoryGroup": "Comparatives & Gaming",
    "vocabulary": {
      "core": [
        "battle",
        "trainer",
        "stronger",
        "fastest",
        "attack",
        "defense",
        "element"
      ],
      "supporting": [
        "evolution",
        "super-effective",
        "stamina",
        "strategy",
        "champion"
      ],
      "phonics": [
        "/tr/ in trainer",
        "/st/ in stronger"
      ]
    },
    "grammar": {
      "focusPattern": "[Creature A] is [stronger / faster] than [Creature B], but [Creature C] is the [most powerful]",
      "formula": "Pikachu is faster than Blastoise, but Charizard has the strongest Fire attack.",
      "formulas": [
        "Comparative: Subject A + is + Comparative Adjective + than + Subject B",
        "Superlative: Subject + is the + Superlative Adjective + in the team"
      ]
    },
    "clilDomain": "Comparative Mathematics & Game Theory",
    "clilTheme": "Comparative Mathematics & Game Theory",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "thumbnailIcon": "⚡",
    "formula": "Pikachu is faster than Blastoise, but Charizard has the strongest Fire attack.",
    "url": "pokemon/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "jungle",
    "title": "Life in the Jungle",
    "description": "Join wildlife rangers on conservation missions! Spot jungle animals and evaluate ecosystem health with audio soundscapes.",
    "type": "clil",
    "category": "CLIL & Science",
    "categoryLabel": "🌍 CLIL",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-8",
    "grade": "Grades 2–5",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 35,
    "durationText": "35 min",
    "estimatedMinutes": 35,
    "xp": 65,
    "skills": [
      "CLIL",
      "Vocabulary",
      "Listening"
    ],
    "topic": "Rainforest Wildlife & Modal Can",
    "topics": [
      "Tropical Rainforests",
      "Rainforest Layers & Animals",
      "Ecology & Biodiversity"
    ],
    "languageFocus": "Rainforest habitats, animal diets (carnivore/herbivore), ability with can",
    "activityMode": "Interactive Wildlife Tour",
    "interactionType": "Audio Soundscape & Canopy Explorer",
    "difficulty": "Elementary",
    "tags": [
      "jungle",
      "animals",
      "clil",
      "rainforest",
      "science",
      "listening"
    ],
    "learningObjectives": [
      "Identify the 4 layers of the tropical rainforest (Emergent, Canopy, Understory, Forest Floor)",
      "Classify rainforest fauna according to their specific ecological niche and diet",
      "Explain the importance of rainforest biodiversity and the global oxygen cycle",
      "Construct food chains connecting producers, herbivores, predators, and decomposers"
    ],
    "teacherInstructions": "Play jungle audio soundscapes. Have students guess animal sounds before revealing them in their respective canopy layers.",
    "studentInstructions": "Climb through the jungle trees, listen to animal calls, and identify where each creature lives!",
    "route": "jungle/index.html",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#d1fae5\"/>\n        <circle cx=\"45\" cy=\"55\" r=\"28\" fill=\"#047857\"/>\n        <circle cx=\"95\" cy=\"45\" r=\"32\" fill=\"#059669\"/>\n        <circle cx=\"150\" cy=\"55\" r=\"26\" fill=\"#10b981\"/>\n        <rect x=\"40\" y=\"70\" width=\"10\" height=\"60\" fill=\"#78350f\"/>\n        <rect x=\"90\" y=\"65\" width=\"12\" height=\"65\" fill=\"#78350f\"/>\n        <rect x=\"145\" y=\"70\" width=\"10\" height=\"60\" fill=\"#78350f\"/>\n        <path d=\"M 0 140 Q 40 95 80 140 Z\" fill=\"#065f46\"/>\n        <path d=\"M 120 140 Q 160 100 200 140 Z\" fill=\"#065f46\"/>\n      </svg>",
    "categoryGroup": "Rainforest Ecology",
    "vocabulary": {
      "core": [
        "jungle",
        "rainforest",
        "canopy",
        "creature",
        "predator",
        "habitat",
        "layer"
      ],
      "supporting": [
        "understory",
        "biodiversity",
        "herbivore",
        "camouflage",
        "humidity"
      ],
      "phonics": [
        "/j/ in jungle",
        "/r/ in rainforest"
      ]
    },
    "grammar": {
      "focusPattern": "Animals in the [canopy] layer eat [food] and sleep on [trees]",
      "formula": "Toucan birds inhabit the canopy layer because they eat tropical fruits and seeds.",
      "formulas": [
        "Ecosystem Classification: [Animal] lives in the [Layer] because it needs [Resource]",
        "Food Chain: [Predator] hunts [Prey], which eats [Plant]"
      ]
    },
    "clilDomain": "Tropical Biodiversity & Rainforest Strata",
    "clilTheme": "Tropical Biodiversity & Rainforest Strata",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "🌴",
    "formula": "Toucan birds inhabit the canopy layer because they eat tropical fruits and seeds.",
    "url": "jungle/index.html",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "res-global-readings-2",
    "title": "Global Readings 2: Student's Book",
    "description": "Macmillan Primary Literacy Anthology featuring 10 thematic units, phonics review, sequencing, Clara Doodle's inventions, Chuseok festival, and science connections.",
    "type": "textbook",
    "category": "CLIL & Science",
    "categoryLabel": "📖 Curriculum Textbook",
    "level": "Level 2",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-8",
    "grade": "Grade 2-3",
    "grades": [
      "Grade 2",
      "Grade 3"
    ],
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "xp": 60,
    "skills": [
      "Reading",
      "Vocabulary",
      "Speaking",
      "Phonics",
      "Writing"
    ],
    "topic": "Inventions, Technology & Culture",
    "topics": [
      "Macmillan Literacy Curriculum",
      "Level 2 Scope & Sequence",
      "Primary Anthology"
    ],
    "languageFocus": "Identifying sequence of events, Long vowels & blends, Action verbs in context",
    "activityMode": "Whole Class Reading & Anthologies",
    "interactionType": "Digital Textbook Reader & Interactive Annotator",
    "difficulty": "Elementary",
    "tags": [
      "textbook",
      "macmillan",
      "reading",
      "inventions",
      "phonics",
      "anthology"
    ],
    "learningObjectives": [
      "Master the Macmillan Global Readings 2 Level 2 primary syllabus (Units 1 to 10)",
      "Practice phonics reviews (long vowels a, e, i, o, u, consonant blends sh, ch, st, pl, fl, pr, fr)",
      "Engage with CLIL inquiry units: inventions, animal habitats, weather, community helpers, traditions",
      "Track student reading fluency, journal reflections, and workbook exercises"
    ],
    "teacherInstructions": "Launch the textbook reader to display authentic high-resolution page scans, accompanying phonics drills, and discussion questions.",
    "studentInstructions": "Turn the pages, read about real-life inventors and celebrations, and solve the reading comprehension challenges!",
    "route": "javascript:openTextbookViewer(1, 'book-global-readings-2')",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#fef3c7\"/>\n        <rect x=\"45\" y=\"20\" width=\"110\" height=\"95\" rx=\"6\" fill=\"#3b82f6\" stroke=\"#1d4ed8\" stroke-width=\"2\"/>\n        <path d=\"M 100 20 L 100 115\" stroke=\"#ffffff\" stroke-width=\"3\"/>\n        <rect x=\"55\" y=\"32\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#ffffff\" opacity=\"0.9\"/>\n        <rect x=\"55\" y=\"44\" width=\"30\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"55\" y=\"52\" width=\"32\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"110\" y=\"32\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#facc15\"/>\n        <rect x=\"110\" y=\"44\" width=\"30\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"110\" y=\"52\" width=\"32\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"25\" y=\"116\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#1d4ed8\"/>\n        <text x=\"100\" y=\"129\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">GLOBAL READINGS 2 📚</text>\n      </svg>",
    "categoryGroup": "Curriculum Anthologies",
    "vocabulary": {
      "core": [
        "invent",
        "problem",
        "solution",
        "habitat",
        "community",
        "tradition",
        "explore"
      ],
      "supporting": [
        "after-school",
        "biomimicry",
        "da Vinci",
        "Edison",
        "comprehension",
        "anthology"
      ],
      "phonics": [
        "long vowels (a_e, e_e, i_e, o_e, u_e)",
        "blends: sh, ch, st, pl, fl, pr, fr"
      ]
    },
    "grammar": {
      "focusPattern": "Primary Stage 2 English Scope & Sequence grammar patterns",
      "formula": "Students apply Phonics reviews, Infinitive of Purpose, and CLIL inquiry units.",
      "formulas": [
        "Present Simple & Past Simple narratives",
        "Infinitive of Purpose: to + Base Verb",
        "Adjective comparisons & sequencing markers (first, next, then, finally)"
      ]
    },
    "clilDomain": "Macmillan Primary Literacy Syllabus (Level 2)",
    "clilTheme": "Macmillan Primary Literacy Syllabus (Level 2)",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "📚",
    "formula": "Students apply Phonics reviews, Infinitive of Purpose, and CLIL inquiry units.",
    "url": "javascript:openTextbookViewer(1, 'book-global-readings-2')",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "res-global-readings-3",
    "title": "Global Readings 3: Student's Book",
    "description": "Macmillan Primary Literacy Anthology featuring 10 advanced units on neuroscience, wildlife habitats, teamwork, ecology, and literature.",
    "type": "textbook",
    "category": "CLIL & Science",
    "categoryLabel": "📖 Curriculum Textbook",
    "level": "Level 3",
    "cefrLevel": "A2",
    "age": "Ages 9–11",
    "ageGroup": "9-10",
    "grade": "Grade 4",
    "grades": [
      "Grade 4",
      "Grade 5"
    ],
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "xp": 75,
    "skills": [
      "Reading",
      "Vocabulary",
      "Speaking",
      "Neuroscience",
      "Writing"
    ],
    "topic": "Literature, Brain Science & Ecology",
    "topics": [
      "Macmillan Literacy Curriculum",
      "Level 3 Scope & Sequence",
      "Advanced Primary Anthology"
    ],
    "languageFocus": "Skimming, Scanning, Chronological order, Cause and effect, Character analysis",
    "activityMode": "Whole Class Reading & Anthologies",
    "interactionType": "Digital Textbook Reader & Interactive Annotator",
    "difficulty": "Intermediate",
    "tags": [
      "textbook",
      "macmillan",
      "brain",
      "habitats",
      "literature",
      "advanced"
    ],
    "learningObjectives": [
      "Master the Macmillan Global Readings 3 Level 3 primary syllabus (Units 1 to 10)",
      "Deepen CLIL science reading comprehension: engineering design, neuroscience, space, ecosystems",
      "Develop paragraph-level expository writing and structured debate argumentation",
      "Synthesize multi-chapter fiction and non-fiction text structures"
    ],
    "teacherInstructions": "Open the digital anthology viewer for Grade 4 units. Use reading check exercises for collaborative literature circles.",
    "studentInstructions": "Explore advanced stories, discover how your brain learns new languages, and answer the reading comprehension challenges!",
    "route": "javascript:openTextbookViewer(1, 'book-global-readings-3')",
    "worksheet": null,
    "worksheetRoute": "unit-1-diagnostic/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <rect width=\"200\" height=\"140\" fill=\"#f0fdf4\"/>\n        <rect x=\"45\" y=\"20\" width=\"110\" height=\"95\" rx=\"6\" fill=\"#10b981\" stroke=\"#047857\" stroke-width=\"2\"/>\n        <path d=\"M 100 20 L 100 115\" stroke=\"#ffffff\" stroke-width=\"3\"/>\n        <circle cx=\"75\" cy=\"50\" r=\"14\" fill=\"#d1fae5\"/>\n        <rect x=\"110\" y=\"32\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#fbbf24\"/>\n        <rect x=\"110\" y=\"44\" width=\"30\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"110\" y=\"52\" width=\"32\" height=\"4\" rx=\"1\" fill=\"#ffffff\" opacity=\"0.7\"/>\n        <rect x=\"25\" y=\"116\" width=\"150\" height=\"18\" rx=\"4\" fill=\"#047857\"/>\n        <text x=\"100\" y=\"129\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#ffffff\" text-anchor=\"middle\">GLOBAL READINGS 3 📚</text>\n      </svg>",
    "categoryGroup": "Curriculum Anthologies",
    "vocabulary": {
      "core": [
        "engineering",
        "neuroscience",
        "ecosystem",
        "expository",
        "argument",
        "evidence"
      ],
      "supporting": [
        "prototype",
        "metabolism",
        "exoplanet",
        "biodiversity",
        "thesis",
        "anthology"
      ],
      "phonics": [
        "multisyllabic word decoding",
        "prefix & suffix morphological patterns (un-, re-, -tion, -ment)"
      ]
    },
    "grammar": {
      "focusPattern": "Primary Stage 3 English Scope & Sequence grammar patterns",
      "formula": "Students synthesize non-fiction text structures, neuroscience passages, and debates.",
      "formulas": [
        "Complex sentences with subordinating conjunctions (because, although, since)",
        "Conditionals (Zero, First, Second)",
        "Modal verbs of obligation, probability, and ability"
      ]
    },
    "clilDomain": "Macmillan Primary Literacy Syllabus (Level 3)",
    "clilTheme": "Macmillan Primary Literacy Syllabus (Level 3)",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "thumbnailIcon": "📚",
    "formula": "Students synthesize non-fiction text structures, neuroscience passages, and debates.",
    "url": "javascript:openTextbookViewer(1, 'book-global-readings-3')",
    "worksheetUrl": "unit-1-diagnostic/worksheet.html"
  },
  {
    "id": "alice-homework",
    "title": "🐇 Alice in Wonderland: Homework Deck",
    "description": "Interactive homework presentation and quest deck with 6 animated story scenes, voice recording rehearsal, and gradebook integration.",
    "category": "Story & Literature",
    "categoryGroup": "Alice in Wonderland",
    "level": "A1 / A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Grade 4"
    ],
    "duration": 25,
    "durationText": "25 min",
    "estimatedMinutes": 25,
    "xp": 120,
    "skills": [
      "Speaking",
      "Reading",
      "Story Sequencing",
      "Oral Recaps"
    ],
    "topic": "Wonderland Scenes, Character Dialogue & Past Simple",
    "topics": [
      "Classic English Literature",
      "Theatre Recaps",
      "Homework Presentation"
    ],
    "languageFocus": "First, Alice [fell/saw]. Then she [drank/met] the [character].",
    "learningObjectives": [
      "Review and present 6 Wonderland scenes and story sequences",
      "Practice Past Simple regular and irregular verbs in homework recaps",
      "Deliver a structured oral report summarizing Alice's adventures"
    ],
    "teacherInstructions": "Have students present their homework deck scene-by-scene and record their oral reflection using the integrated voice recorder.",
    "studentInstructions": "Click through each scene, solve the comprehension prompts, and record your voice talking about Alice in Wonderland!",
    "route": "alice-homework/index.html",
    "worksheet": "alice-homework-quest/index.html",
    "worksheetRoute": "alice-homework-quest/index.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailIcon": "🐇",
    "gradient": "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #7c3aed 100%)",
    "tags": [
      "alice",
      "homework",
      "past-simple",
      "literature",
      "theatre"
    ],
    "vocabulary": {
      "core": [
        "rabbit",
        "potion",
        "caterpillar",
        "tea party",
        "croquet"
      ],
      "supporting": [
        "curious",
        "adventurer",
        "shrink",
        "grow",
        "pocket watch"
      ]
    },
    "grammar": {
      "focusPattern": "Past Simple Narrative (Alice was... / Alice drank...)",
      "formula": "First, Alice [fell/saw]. Then she [drank/met] the [character].",
      "formulas": [
        "First, Alice followed the White Rabbit down the hole.",
        "She found a tiny key and drank a magic potion.",
        "The Queen shouted: 'Off with their heads!'"
      ]
    },
    "clilDomain": "Classic Children's Literature",
    "clilTheme": "Narrative Sequencing & Performance Recaps",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "First, Alice [fell/saw]. Then she [drank/met] the [character].",
    "url": "alice-homework/index.html",
    "worksheetUrl": "alice-homework-quest/index.html"
  },
  {
    "id": "bamboozle",
    "title": "🎮 Bamboozle Meme Arena",
    "description": "High-octane classroom quiz battle arena. 16 mystery tiles, animated meme power-ups, swap scores, point steals, and curriculum trivia.",
    "category": "Engineering & Inventions",
    "categoryGroup": "Invention Game Show",
    "level": "A1 / A2",
    "cefrLevel": "A1+",
    "age": "Ages 7–12",
    "ageGroup": "7-12",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 150,
    "skills": [
      "Speaking",
      "Listening",
      "Vocabulary Recall",
      "Team Collaboration"
    ],
    "topic": "Invention Trivia, Science Facts & Rapid Problem Solving",
    "topics": [
      "Team Trivia",
      "Inventions",
      "Engineering Quiz"
    ],
    "languageFocus": "We choose Card [number]. We believe the answer is [answer] because [reason].",
    "learningObjectives": [
      "Answer fast-paced team quiz questions across science and historical inventors",
      "Communicate strategically using swap, trap, and 2x points power-ups",
      "Articulate team consensus answers within 20-second countdowns"
    ],
    "teacherInstructions": "Split class into 2 to 4 teams. Teams take turns picking tiles, answering questions, and triggering wacky game-show power-ups.",
    "studentInstructions": "Pick a lucky tile for your team, answer the curriculum question correctly, and dodge the score-swapping traps!",
    "route": "bamboozle/index.html",
    "worksheet": "bamboozle/index.html",
    "worksheetRoute": "bamboozle/index.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "⚡",
    "gradient": "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)",
    "tags": [
      "bamboozle",
      "quiz",
      "game-show",
      "speaking",
      "teamwork"
    ],
    "vocabulary": {
      "core": [
        "points",
        "swap",
        "team",
        "challenge",
        "power-up"
      ],
      "supporting": [
        "bonus",
        "double",
        "steal",
        "mystery",
        "congratulations"
      ]
    },
    "grammar": {
      "focusPattern": "Wh- Questions & Modal Answers (Can we swap? / It is...)",
      "formula": "We choose Card [number]. We believe the answer is [answer] because [reason].",
      "formulas": [
        "Which inventor created the light bulb?",
        "Can Team Red swap points with Team Blue?",
        "If we get this right, we will earn fifty bonus points!"
      ]
    },
    "clilDomain": "Interactive EdTech Game Mechanics",
    "clilTheme": "Competitive Classroom Engagement & Knowledge Retrieval",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "We choose Card [number]. We believe the answer is [answer] because [reason].",
    "url": "bamboozle/index.html",
    "worksheetUrl": "bamboozle/index.html"
  },
  {
    "id": "monster-lab",
    "title": "🧪 Monster Morphology & Bio Lab",
    "description": "Interactive genetic creature builder. Combine animal traits, balance biological stats, and articulate physical anatomy in English.",
    "category": "Phonics & Language Quests",
    "categoryGroup": "Monster Morphology",
    "level": "Pre-A1 / A1",
    "cefrLevel": "A1",
    "age": "Ages 6–10",
    "ageGroup": "6-10",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 30,
    "durationText": "30 min",
    "estimatedMinutes": 30,
    "xp": 130,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Physical Descriptions",
      "Classification"
    ],
    "topic": "Creature Anatomy, Body Parts & Sensory Adjectives",
    "topics": [
      "Biology & Anatomy",
      "Creature Design",
      "Physical Descriptions"
    ],
    "languageFocus": "My monster has [number] [body part] and can [action].",
    "learningObjectives": [
      "Construct alien creatures using body part and sensory adjectives",
      "Use 'has got / hasn't got' to specify creature attributes",
      "Synthesize monster health stats and diet requirements"
    ],
    "teacherInstructions": "Guide students to combine different heads, horns, and appendages. Have each learner describe their monster's special adaptations to the class.",
    "studentInstructions": "Pick wild parts from the Bio Lab tanks to build your custom monster companion, then present its powers!",
    "route": "monster-lab/index.html",
    "worksheet": "monster-lab/index.html",
    "worksheetRoute": "monster-lab/index.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailIcon": "🧪",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
    "tags": [
      "monsters",
      "anatomy",
      "has-got",
      "biology",
      "adjectives"
    ],
    "vocabulary": {
      "core": [
        "horns",
        "tentacles",
        "claws",
        "fur",
        "wings"
      ],
      "supporting": [
        "spiky",
        "slimy",
        "fluffy",
        "gigantic",
        "scales"
      ]
    },
    "grammar": {
      "focusPattern": "Has / Has Got for Physical Anatomy",
      "formula": "My monster has [number] [body part] and can [action].",
      "formulas": [
        "It has got three bright purple eyes and long green wings.",
        "It hasn't got any fur, but it has thick protective scales.",
        "My monster can breathe underwater and run at super speed."
      ]
    },
    "clilDomain": "Comparative Animal Biology",
    "clilTheme": "Adaptations & Anatomical Morphology",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "My monster has [number] [body part] and can [action].",
    "url": "monster-lab/index.html",
    "worksheetUrl": "monster-lab/index.html"
  },
  {
    "id": "monster-studio",
    "title": "🎨 Monster Creator Studio & Wardrobe",
    "description": "Dynamic avatar wardrobe customizer. Equip hats, capes, tech goggles, and describe character outfits using present continuous.",
    "category": "Phonics & Language Quests",
    "categoryGroup": "Monster Morphology",
    "level": "A1 / A1+",
    "cefrLevel": "A1",
    "age": "Ages 6–10",
    "ageGroup": "6-10",
    "grade": "Grade 2–4",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "duration": 25,
    "durationText": "25 min",
    "estimatedMinutes": 25,
    "xp": 120,
    "skills": [
      "Speaking",
      "Vocabulary",
      "Present Continuous",
      "Color Adjectives"
    ],
    "topic": "Clothing Items, Accessories & Character Styling",
    "topics": [
      "Fashion & Clothing",
      "Character Customization",
      "Present Continuous"
    ],
    "languageFocus": "My monster is wearing a [color] [clothing item] to protect against [weather].",
    "learningObjectives": [
      "Customize student monster companions with accessories and outfits",
      "Describe clothing, colors, and gear using present continuous",
      "Deliver personal avatar introductions to classmates"
    ],
    "teacherInstructions": "Ask students: 'What is your monster wearing today?' Prompt complete sentences: 'He is wearing a red hat and sunglasses.'",
    "studentInstructions": "Dress up your monster for an adventure! Choose hats, boots, and tools, then tell your partner what it is wearing.",
    "route": "monster-studio/index.html",
    "worksheet": "monster-studio/index.html",
    "worksheetRoute": "monster-studio/index.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": false,
    "thumbnailIcon": "🎨",
    "gradient": "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #a855f7 100%)",
    "tags": [
      "monster",
      "customizer",
      "clothes",
      "present-continuous",
      "colors"
    ],
    "vocabulary": {
      "core": [
        "hat",
        "glasses",
        "cape",
        "boots",
        "scarf"
      ],
      "supporting": [
        "wearing",
        "colorful",
        "stylish",
        "accessory",
        "jacket"
      ]
    },
    "grammar": {
      "focusPattern": "Present Continuous with Clothes (He is wearing...)",
      "formula": "My monster is wearing a [color] [clothing item] to protect against [weather].",
      "formulas": [
        "She is wearing bright yellow boots and a purple rain jacket.",
        "He is wearing steampunk goggles on his forehead.",
        "They are wearing warm scarves because it is cold in the lab."
      ]
    },
    "clilDomain": "Visual Design & Self-Expression",
    "clilTheme": "Seasonal Dress & Character Identity",
    "status": "active",
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "formula": "My monster is wearing a [color] [clothing item] to protect against [weather].",
    "url": "monster-studio/index.html",
    "worksheetUrl": "monster-studio/index.html"
  },
  {
    "id": "wizard-of-oz",
    "title": "🌪️ The Wizard of Oz Interactive Stage",
    "description": "Classroom reader's theatre & story quest along the Yellow Brick Road. Help Dorothy, Scarecrow, Tin Man, and Lion solve dilemmas.",
    "category": "Story & Literature",
    "categoryGroup": "The Wizard of Oz",
    "level": "A1+ / A2",
    "cefrLevel": "A1+",
    "age": "Ages 7–11",
    "ageGroup": "7-11",
    "grade": "Grade 3–5",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "xp": 160,
    "skills": [
      "Reading",
      "Speaking",
      "Dialogue Roleplay",
      "Character Needs"
    ],
    "topic": "Classic American Literature, Character Goals & Desires",
    "topics": [
      "Classic American Literature",
      "Character Motivations",
      "Story Sequencing"
    ],
    "languageFocus": "I don't have [noun], but I want to [verb] because [reason].",
    "learningObjectives": [
      "Follow Dorothy along the Yellow Brick Road across 5 story scenes",
      "Identify character needs (brain, heart, courage, home)",
      "Roleplay dialogues between Dorothy, Scarecrow, Tin Man, and Lion"
    ],
    "teacherInstructions": "Assign student character roles. Perform the interactive stage dialogues with choral reading and sound effects.",
    "studentInstructions": "Travel to the Emerald City with Dorothy! Choose lines for your character and help your friends find what they are looking for.",
    "route": "wizard-of-oz/index.html",
    "worksheet": "wizard-of-oz/worksheet.html",
    "worksheetRoute": "wizard-of-oz/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🌪️",
    "gradient": "linear-gradient(135deg, #14532d 0%, #15803d 50%, #eab308 100%)",
    "tags": [
      "oz",
      "literature",
      "theatre",
      "wants-to",
      "roleplay"
    ],
    "vocabulary": {
      "core": [
        "tornado",
        "brick road",
        "scarecrow",
        "courage",
        "heart"
      ],
      "supporting": [
        "emerald",
        "slippers",
        "journey",
        "wizard",
        "cunning"
      ]
    },
    "grammar": {
      "focusPattern": "Need / Want to + Verb (The Scarecrow wants to have a brain)",
      "formula": "I don't have [noun], but I want to [verb] because [reason].",
      "formulas": [
        "The Scarecrow wants to have a brain so he can think.",
        "The Tin Woodman needs a warm heart to feel love.",
        "The Cowardly Lion wishes to find true courage."
      ]
    },
    "clilDomain": "Children's Literature & Theatre",
    "clilTheme": "Narrative Journey & Character Values",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "I don't have [noun], but I want to [verb] because [reason].",
    "url": "wizard-of-oz/index.html",
    "worksheetUrl": "wizard-of-oz/worksheet.html"
  },
  {
    "id": "space-cadet",
    "aliases": [
      "space-cadet-mission",
      "cadet-mission",
      "space-mission-homework"
    ],
    "title": "🚀 Space Cadet Mission: Blueprint & Report Card",
    "description": "Design your space vehicle on the interactive blueprint canvas, select mission technology, build mission sentences, and present your Show & Tell report card!",
    "category": "CLIL & Science",
    "categoryGroup": "Science & Engineering",
    "cefrLevel": "A2",
    "level": "A2",
    "grade": "Grade 4",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "xp": 200,
    "duration": 30,
    "durationText": "30 mins",
    "estimatedMinutes": 30,
    "type": "game",
    "topics": [
      "Space Exploration",
      "Spacecraft Engineering",
      "Scientific Reporting"
    ],
    "learningObjectives": [
      "Formulate mission goals using 'My mission is to + Verb' and 'It will + Verb'",
      "Identify aerospace engineering parts (thrusters, solar sails, telescope, lander legs)",
      "Deliver an oral Show & Tell report summarizing vehicle features and mission purpose"
    ],
    "teacherInstructions": "Have students blueprint their space vehicle on the canvas and record their oral Show & Tell speech using the integrated voice recorder.",
    "route": "space-cadet/index.html",
    "worksheet": "space-cadet/index.html",
    "worksheetRoute": "space-cadet/index.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🚀",
    "gradient": "linear-gradient(135deg, #0b132b 0%, #0f172a 45%, #0369a1 85%, #0284c7 100%)",
    "tags": [
      "space",
      "cadet",
      "blueprint",
      "science",
      "clil",
      "homework"
    ],
    "vocabulary": {
      "core": [
        "rocket",
        "thrusters",
        "solar sails",
        "telescope",
        "rover"
      ],
      "supporting": [
        "probe",
        "cryosleep",
        "shielding",
        "lander legs",
        "habitat pod"
      ]
    },
    "grammar": {
      "focusPattern": "Purpose and Future Action (My mission is to + Verb / It will + Verb)",
      "formula": "My mission is to [verb] so it will [action].",
      "formulas": [
        "My mission is to study a new planet.",
        "It will travel far and scan deep atmosphere.",
        "It has plasma engines and lander legs."
      ]
    },
    "clilDomain": "Planetary Science & Aerospace Engineering",
    "clilTheme": "Exoplanet Exploration & Mission Design",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "My mission is to [verb] so it will [action].",
    "url": "space-cadet/index.html",
    "worksheetUrl": "space-cadet/index.html"
  },
  {
    "id": "smart-farm",
    "aliases": [
      "farm-inventor",
      "smart-farm-mission",
      "farm-robot"
    ],
    "title": "🌾 The Smart Farm: Young Inventors Mission",
    "description": "AAA-style children's adventure game. Save the animals after a farm-wide system failure: connect pipes for the thirsty cow, balance temperatures in the smart coop, program a delivery robot, and assemble an original farm invention!",
    "category": "Inventions & Engineering",
    "categoryGroup": "Engineering & Technology",
    "cefrLevel": "A1–A1+",
    "level": "A1 / A1+",
    "ageGroup": "7–10",
    "grade": "Grade 3",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "xp": 200,
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "type": "game",
    "topics": [
      "Smart Agriculture",
      "Robotics & Coding",
      "Invention & Design",
      "Animal Care"
    ],
    "learningObjectives": [
      "Identify farm animals and basic biological needs (water, warmth, food)",
      "Formulate imperative purpose statements (It gives water, It keeps animals warm)",
      "Program a robot using sequential imperative commands (Go, Pick Up, Carry, Stop)",
      "Deliver a 4-part invention presentation using a live teleprompter"
    ],
    "teacherInstructions": "Guide students through the 4 emergency repair missions. Have learners customize their own farm machines in the Inventor Lab and present their inventions orally.",
    "route": "smart-farm/index.html",
    "worksheet": "smart-farm/worksheet.html",
    "worksheetRoute": "smart-farm/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🌾",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0284c7 100%)",
    "tags": [
      "farm",
      "animals",
      "robot",
      "engineering",
      "clil",
      "inventions"
    ],
    "vocabulary": {
      "core": [
        "cow",
        "chicken",
        "water",
        "warm",
        "cold",
        "carry"
      ],
      "supporting": [
        "heater",
        "pipes",
        "robot",
        "invention",
        "solar",
        "wind"
      ]
    },
    "grammar": {
      "focusPattern": "Subject + Verb + Object (Needs & Purpose Statements)",
      "formula": "The [Animal] needs [Noun] / It [Verbs] [Noun] to the [Animal]!",
      "formulas": [
        "The cow needs water.",
        "It gives water to the cow.",
        "The chicken is warm and happy.",
        "The robot carries the heavy box."
      ]
    },
    "clilDomain": "Agro-Technology & Ecological Engineering",
    "clilTheme": "Automated Farm Systems & Animal Welfare",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "The [Animal] needs [Noun] / It [Verbs] [Noun] to the [Animal]!",
    "url": "smart-farm/index.html",
    "worksheetUrl": "smart-farm/worksheet.html"
  },
  {
    "id": "fantasy-creatures",
    "aliases": [
      "mythical-creatures",
      "magical-habitats",
      "guardian-creatures"
    ],
    "title": "🐉 Fantasy Creatures & Magical Habitats",
    "description": "Tactile 3-phase CLIL & ESL adventure for Grade 3. Explore 4 mythical guardians on 3D radar flip cards, match anatomical adaptations with 'It has [feature] to [action]' in the Care Workbench, and broadcast a live karaoke field debrief to the Academy!",
    "category": "CLIL & Science",
    "categoryGroup": "Natural Science & Habitats",
    "cefrLevel": "A1",
    "level": "A1",
    "ageGroup": "7–10",
    "grade": "Grade 3",
    "grades": [
      "Grade 2",
      "Grade 3",
      "Grade 4"
    ],
    "xp": 160,
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "type": "game",
    "topics": [
      "Mythical Creatures",
      "Animal Adaptations",
      "Magical Habitats",
      "Care & Conservation"
    ],
    "learningObjectives": [
      "Identify mythical guardians and their anatomical features (wings, horn, claws)",
      "Formulate purpose statements using 'It has [feature] to [action]'",
      "Identify suitable habitats using 'It needs [habitat]'",
      "Deliver a 3-sentence spoken broadcast report with live karaoke teleprompter"
    ],
    "teacherInstructions": "Use Phase 1 for classroom discovery and vocabulary elicitation. Transition to Phase 2 for grammar scaffolding and tactile sentence construction. Complete Phase 3 with whole-class or paired oral speaking presentations.",
    "route": "fantasy-creatures/index.html",
    "worksheet": "fantasy-creatures/worksheet.html",
    "worksheetRoute": "fantasy-creatures/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🐉",
    "gradient": "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #f97316 100%)",
    "tags": [
      "fantasy",
      "creatures",
      "clil",
      "dragon",
      "unicorn",
      "fairy",
      "griffin",
      "habitats",
      "adaptations"
    ],
    "vocabulary": {
      "core": [
        "dragon",
        "fairy",
        "unicorn",
        "griffin",
        "wings",
        "horn",
        "claws",
        "cave",
        "forest",
        "mountain"
      ],
      "supporting": [
        "habitat",
        "guardian",
        "purify",
        "heal",
        "soar",
        "prey"
      ]
    },
    "grammar": {
      "focusPattern": "Purpose & Needs Statements",
      "formula": "It has [feature] to [action] / It needs [habitat]",
      "formulas": [
        "The dragon has wings to fly high.",
        "The fairy has glowing wings to heal plants.",
        "The unicorn has a magic horn to purify water.",
        "The griffin has sharp claws to catch prey.",
        "It needs a warm volcanic cave."
      ]
    },
    "clilDomain": "Zoological Adaptations & Habitats",
    "clilTheme": "Mythological Biology & Habitat Conservation",
    "status": "active",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration",
    "formula": "It has [feature] to [action] / It needs [habitat]",
    "url": "fantasy-creatures/index.html",
    "worksheetUrl": "fantasy-creatures/worksheet.html"
  },
  {
    "id": "ocean-cleaners",
    "aliases": [
      "eco-engineers-ocean",
      "ocean-cleaners-lab",
      "reef-rescue"
    ],
    "title": "🌊 Eco-Engineers: Ocean Cleaners & Reef Rescue",
    "description": "Tactile 3-phase CLIL & ESL engineering adventure for Grade 3–4. Calibrate autonomous cleanup catamarans, coral restoration submersibles, turtle rescue drones, and acoustic bubble barriers. Practice 'The [Machine] helps to [Verb]' and 'We must protect the [Habitat]', then broadcast your field report live!",
    "category": "Inventions & Engineering",
    "categoryGroup": "Marine Robotics & Environmental STEM",
    "cefrLevel": "A1+",
    "level": "A1+ / A2",
    "ageGroup": "7–10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "xp": 160,
    "duration": 40,
    "durationText": "40 min",
    "estimatedMinutes": 40,
    "type": "game",
    "topics": [
      "Ocean Engineering",
      "Marine Conservation",
      "Robotics & Sensors",
      "Habitat Protection"
    ],
    "learningObjectives": [
      "Identify marine cleanup machines and engineering features (solar hulls, robotic arms, sonar)",
      "Formulate purpose statements using 'The [Machine] helps to [Verb]'",
      "Formulate environmental protection pledges using 'We must protect the [Habitat]'",
      "Deliver a 3-sentence live spoken debrief with karaoke teleprompter synchronization"
    ],
    "teacherInstructions": "Launch Phase 1 for classroom discovery and vocabulary elicitation. Use Phase 2 for tactile grammar assembly and battery charging. Conclude with Phase 3 paired or whole-class oral broadcasts.",
    "route": "ocean-cleaners/index.html",
    "worksheet": "ocean-cleaners/worksheet.html",
    "worksheetRoute": "ocean-cleaners/worksheet.html",
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailIcon": "🌊",
    "gradient": "linear-gradient(135deg, #060911 0%, #0f172a 50%, #0284c7 100%)",
    "tags": [
      "ocean",
      "plastic",
      "coral",
      "robot",
      "net",
      "turtle",
      "clean",
      "rescue",
      "filter",
      "collect",
      "stem",
      "clil"
    ],
    "vocabulary": {
      "core": [
        "ocean",
        "plastic",
        "coral",
        "robot",
        "net",
        "turtle",
        "clean",
        "rescue",
        "filter",
        "collect"
      ],
      "supporting": [
        "catamaran",
        "estuary",
        "lagoon",
        "battery",
        "conveyor",
        "barrier"
      ]
    },
    "grammar": {
      "focusPattern": "Purpose & Conservation Statements",
      "formula": "The [Machine] helps to [Verb] / We must protect the [Habitat]",
      "formulas": [
        "The Solar Skimmer helps to collect plastic.",
        "The Reef Rover helps to plant coral.",
        "The Aqua Drone helps to rescue turtles.",
        "The Bubble Barrier helps to filter microplastics.",
        "We must protect the coral reef."
      ]
    },
    "clilDomain": "Marine Robotics & Ecological Engineering",
    "clilTheme": "Ocean Plastics Remediation & Habitat Restoration",
    "status": "active",
    "trackId": "track-2",
    "trackTitle": "🛠️ Applied STEM & Creative Engineering",
    "formula": "The [Machine] helps to [Verb] / We must protect the [Habitat]",
    "url": "ocean-cleaners/index.html",
    "worksheetUrl": "ocean-cleaners/worksheet.html"
  },
  {
    "id": "chuseok-festival",
    "title": "🌾 Chuseok: Korea's Harvest Festival",
    "description": "Comprehensive 2-part synchronous courseware based on Unit 2 'Thank You' (Global Readings 2). Features the ancient month-long weaving contest, King's full moon feast verdict, Hanbok traditions, Songpyeon rice cakes, Ganggangsullae circle dance, ancestor memorial ceremonies, and global harvest comparisons.",
    "type": "game",
    "category": "Literature & Stories",
    "categoryLabel": "🌾 World Cultures & Social Studies",
    "level": "A2-B1",
    "cefrLevel": "A2-B1",
    "age": "Ages 8–11",
    "ageGroup": "8-11",
    "topic": "Harvest Festivals, Gratitude, Ancient Legends & World Traditions",
    "duration": "2 x 45 Mins",
    "clilDomain": "Social Studies & World Cultures",
    "clilTheme": "Harvest Celebrations & Gratitude Around the World",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "I am thankful for my [Noun] because they make me feel [Adjective].",
    "grammar": {
      "focusPattern": "Gratitude & Collective Purpose Statements",
      "formula": "I am thankful for my [Noun] / They gather to [Verb]",
      "formulas": [
        "I am thankful for my family because they make me feel loved.",
        "They gather to weave cloth together.",
        "The King awarded a feast to both teams.",
        "Families travel home to honor their ancestors.",
        "Both holidays celebrate by eating together."
      ]
    },
    "vocabulary": {
      "core": [
        "weave",
        "cloth",
        "contest",
        "harvest",
        "festival",
        "feast",
        "songpyeon",
        "ancestors",
        "hanbok",
        "ceremony"
      ],
      "supporting": [
        "full moon",
        "pine needles",
        "circle dance",
        "shuttle",
        "tradition",
        "respect"
      ]
    },
    "learningObjectives": [
      "Identify ancient and modern traditions of Chuseok (weaving contest, Hanbok, Songpyeon, Ganggangsullae, Charye).",
      "Express gratitude using the scaffolded formula: 'I am thankful for my ______ because they make me feel ______.'",
      "Compare harvest celebrations across cultures using an interactive 3-zone Venn diagram.",
      "Deliver a live graduation exit ticket on the class Gratitude Board."
    ],
    "url": "chuseok-festival/index.html",
    "route": "chuseok-festival/index.html",
    "worksheetUrl": "chuseok-festival/worksheet.html",
    "worksheetRoute": "chuseok-festival/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🌾",
    "gradient": "linear-gradient(135deg, #060911 0%, #78350f 50%, #f59e0b 100%)"
  },
  {
    "id": "chuseok-games",
    "title": "🌕 Chuseok Game Master Portal: Traditional Korean Folk Games",
    "description": "Interactive classroom smartboard portal and printable A4 quest workbook for Grade 3 (A1+). Features 5 traditional Korean games (Ddakji, Paengi, Gonggi, Jegichagi, Yut Nori), a fair 19-student randomizer for Classes 3A & 3B, embedded video craft guides, open-ended guided response prompts with clickable sentence starters, cut-out host pocket scripts, 3-peer visitor logs, and a gamified 100 XP quest tracker.",
    "type": "game",
    "category": "Language & Quests",
    "categoryLabel": "🌕 World Cultures & Folk Games",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 7–10",
    "ageGroup": "7-10",
    "grade": "Grade 3",
    "grades": [
      "Grade 3",
      "Class 3A",
      "Class 3B"
    ],
    "duration": 45,
    "durationText": "45 min",
    "estimatedMinutes": 45,
    "xp": 145,
    "skills": [
      "Recycled Material DIY Game Crafting",
      "Imperative Procedural Steps (First, Next, Finally)",
      "English Speaking & Cheering Frames",
      "Interactive Arcade Station Hosting"
    ],
    "topic": "Korean Chuseok Festival: Traditional Folk Games & Sustainable Recycling",
    "topics": [
      "Chuseok Festival",
      "Korean Folk Games",
      "Folk Games",
      "Ddakji",
      "Paengi",
      "Gonggi",
      "Jegichagi",
      "Yut Nori",
      "Recycled Crafting",
      "Imperative Instructions",
      "Class 3A",
      "Class 3B"
    ],
    "languageFocus": "Hit the card and flip it over! / Twist the top and make it spin! / Toss the Gonggi and catch them fast! / Kick it high and keep it in the air! / Roll the dice, move your pieces home!",
    "grammar": {
      "focusPattern": "Hit the [card] and [action]! / Toss the [item] and [action]!",
      "formula": "Hit the card and flip it over! / Toss the Gonggi and catch them fast!"
    },
    "learningObjectives": [
      "Craft a traditional Korean folk game using recycled household materials (paper, caps, string).",
      "Chant and produce target English game rules clearly and fluently.",
      "Host peer classmates at an interactive classroom arcade station using cheering frames."
    ],
    "vocabulary": {
      "core": [
        "fold",
        "twist",
        "toss",
        "kick",
        "roll",
        "catch",
        "spin",
        "flip"
      ],
      "supporting": [
        "cardboard",
        "bottle cap",
        "shuttlecock",
        "stone",
        "dice",
        "turn"
      ]
    },
    "trackId": "track-3",
    "trackTitle": "🗣️ Language Mechanics & Communication Quests",
    "activityMode": "Interactive Smartboard Arcade Portal / Fair Roster Randomizer / Printable A4 Workbook",
    "interactionType": "Open-Ended Guided Prompts, Clickable Sentence Starters, Video Tutorials, 3D Push-Buttons, Web Audio Chimes, Confetti",
    "url": "chuseok-games/index.html",
    "route": "chuseok-games/index.html",
    "worksheetUrl": "chuseok-games/worksheet.html",
    "worksheetRoute": "chuseok-games/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🌕",
    "gradient": "linear-gradient(135deg, #060911 0%, #1e1b4b 50%, #f59e0b 100%)"
  },
  {
    "id": "forest-safari",
    "title": "🌲 Forest Ranger Pet Safari: Two Different Forests",
    "description": "Interactive Junior Ranger safari quest for A1+ kids (Ages 7–10). Explore Deciduous and Coniferous forests, clap big words, spot wildlife camouflage, bundle up for -50°C winter, sort forest treasures, and earn the Certified Junior Biome Ranger Gold Badge.",
    "category": "Ecology & Wildlife Biomes",
    "categoryGroup": "Forest Ecology",
    "level": "A1+ (Ages 7–10)",
    "duration": "2x 45 min",
    "xp": 350,
    "topic": "Two Different Forests: Deciduous vs. Coniferous Biomes",
    "grammar": {
      "focusPattern": "I see a [animal]. It is [color/size].",
      "formula": "I see a [animal]. It is [color/size] to hide in the [habitat].",
      "formulas": [
        "I see a + [Animal]",
        "It is + [Adjective]",
        "I like the + [Animal]"
      ]
    },
    "clilDomain": "Forest Ecology & Animal Biome Adaptations",
    "clilTheme": "Deciduous vs. Coniferous Forests",
    "vocabulary": {
      "core": [
        "deciduous",
        "coniferous",
        "leaves",
        "pine cone",
        "hibernate",
        "camouflage",
        "bear",
        "deer",
        "squirrel",
        "wolf"
      ],
      "supporting": [
        "autumn",
        "freezing",
        "coat",
        "gloves",
        "hare",
        "owl",
        "lynx",
        "evergreen"
      ]
    },
    "learningObjectives": [
      "Distinguish between deciduous (leaves fall down) and coniferous (evergreen cones) forests.",
      "Recognize how animals adapt to winter through hibernation (bear) and white camouflage (hare).",
      "Produce scaffolded A1+ speaking statements using 'I see a...' and 'I like the...'.",
      "Sort natural objects and animals into their correct forest biome baskets."
    ],
    "url": "forest-safari/index.html",
    "route": "forest-safari/index.html",
    "worksheetUrl": "forest-safari/worksheet.html",
    "worksheetRoute": "forest-safari/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🌲",
    "gradient": "linear-gradient(135deg, #060911 0%, #064e3b 50%, #10b981 100%)",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration"
  },
  {
    "id": "harvest-feast",
    "title": "🌾 Story Settings & The Chuseok Harvest Feast",
    "description": "High-end 4K Smartboard interactive CLIL experience for primary ESL learners. Decode Clara's story settings and emotions across orchard trees and golden wheat fields, master the dual-zone Venn diagram relay, unlock the 5 steaming half-moon Songpyeon cakes on a traditional lacquered Korean table, and send student gratitude lanterns floating to the autumn Harvest Moon.",
    "category": "Literature, Settings & Culture",
    "categoryGroup": "Story & Culture",
    "level": "A1–A2 (Ages 7–11)",
    "duration": "45–60 min",
    "xp": 350,
    "topic": "Story Settings (Time and Place) & The Chuseok Harvest Feast",
    "grammar": {
      "focusPattern": "The setting is the time and place in the story.",
      "formula": "Clara is [Verb-ing] because she feels [Adjective]. / They are thankful for [Noun Phrase].",
      "formulas": [
        "The setting is the time and place in the story.",
        "Clara is [Verb-ing] because she feels [Adjective].",
        "We find [Items] in the kitchen / on the farm / in both places.",
        "They are thankful for [the harvest / food].",
        "They are also thankful for [family / ancestors]."
      ]
    },
    "clilDomain": "Narrative Elements (Setting & Emotion) & Cultural Harvest Traditions",
    "clilTheme": "Farm Harvests, Home Kitchens & Korean Chuseok Traditions",
    "vocabulary": {
      "core": [
        "setting",
        "time",
        "place",
        "laughing",
        "climbing",
        "crying",
        "scared",
        "happy",
        "surprised",
        "fruit",
        "vegetables",
        "family",
        "outside",
        "plants",
        "inside",
        "bowls",
        "songpyeon",
        "thankful"
      ],
      "supporting": [
        "orchard",
        "harvest",
        "wheat",
        "ancestors",
        "half-moon",
        "pine needles",
        "gratitude",
        "autumn",
        "full moon",
        "lantern"
      ]
    },
    "learningObjectives": [
      "Define and analyze story setting as the time and place of narrative events.",
      "Identify character actions and emotions based on visual cues and environmental context.",
      "Categorize vocabulary into kitchen, farm, and intersecting zones using a Venn diagram.",
      "Explore Korean Chuseok traditions including Hanbok, Songpyeon cakes, and ancestral honor.",
      "Construct gratitude statements using the formula: 'They are thankful for [X].'"
    ],
    "url": "harvest-feast/index.html",
    "route": "harvest-feast/index.html",
    "worksheetUrl": "harvest-feast/worksheet.html",
    "worksheetRoute": "harvest-feast/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🌾",
    "gradient": "linear-gradient(135deg, #060911 0%, #78350f 50%, #f59e0b 100%)",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests"
  },
  {
    "id": "forest-adaptation",
    "title": "🌲 Nature's Armor & The Detective's Lens",
    "description": "High-resolution, audio-rich Smartboard ESL experience. Compare deciduous and coniferous forest adaptations, match winter survival armor (bear hibernation and hare camouflage), master the 4-season human adaptation matrix, and decode author's purpose (Entertain, Teach, Persuade) with Alice in Wonderland and the Korean swallow story 'A New Friend'.",
    "category": "Science, Biomes & Literature",
    "categoryGroup": "Biome & Reading Strategy",
    "level": "A1–A2 (Ages 7–11)",
    "duration": "45–60 min",
    "xp": 350,
    "topic": "Forest Adaptations & Decoding Author's Purpose",
    "grammar": {
      "focusPattern": "In [Season], I adapt by [Action/Clothing]. / The author wrote [Title] to [teach/entertain/persuade].",
      "formula": "In [Season], I adapt by [wearing/using] [Item].",
      "formulas": [
        "In [Season], I adapt by [wearing/using] [Item].",
        "The author wrote [Title] to [teach / entertain / persuade].",
        "[Organism] adapts by [Adaptation]."
      ]
    },
    "clilDomain": "Forest Ecology (Deciduous vs. Coniferous) & Reading Strategies (Author's Purpose)",
    "clilTheme": "Seasonal Plant/Animal Armor & Reading Comprehension",
    "vocabulary": {
      "core": [
        "deciduous",
        "coniferous",
        "needles",
        "leaves",
        "hibernate",
        "camouflage",
        "bears",
        "hares",
        "entertain",
        "teach",
        "persuade",
        "swallow",
        "nest",
        "adaptation"
      ],
      "supporting": [
        "autumn",
        "winter",
        "spring",
        "summer",
        "evergreen",
        "broadleaf",
        "opinion",
        "purpose",
        "speech",
        "airplane"
      ]
    },
    "learningObjectives": [
      "Distinguish between deciduous and coniferous forest biomes and their leaf adaptations.",
      "Identify plant and animal winter survival strategies (hibernation, snow camouflage, waxy needles).",
      "Categorize human seasonal adaptations across Spring, Summer, Autumn, and Winter.",
      "Identify the 3 main author's purposes: To Entertain, To Teach/Inform, and To Persuade.",
      "Analyze the dual purpose of the narrative story 'A New Friend' and craft an author statement."
    ],
    "url": "forest-adaptation/index.html",
    "route": "forest-adaptation/index.html",
    "worksheetUrl": "forest-adaptation/worksheet.html",
    "worksheetRoute": "forest-adaptation/worksheet.html",
    "featured": true,
    "thumbnailIcon": "🌲",
    "gradient": "linear-gradient(135deg, #060911 0%, #064e3b 50%, #10b981 100%)",
    "trackId": "track-1",
    "trackTitle": "🚀 Science & Space Exploration"
  },
  {
    "id": "alice-party-home-4a",
    "aliases": [
      "alice-party-home-4a",
      "tea-party-home-4a",
      "party-home-4a",
      "alice-party-home",
      "tea-party-home"
    ],
    "title": "🫖 Alice Tea Party: Home Practice + Cards (Class 4A)",
    "description": "A1+ home practice for the Class 4A tea party. Every student gets a personal character card and a 10-minute practice app (meet, words, word order, speaking, pair role-play) to prepare a 1-minute conversation with a partner. Printable A5 double-sided cards for all 18 students; works offline on phones.",
    "type": "game",
    "category": "Literature & Story Quests",
    "categoryGroup": "Alice Series",
    "categoryLabel": "🎩 Literature & Roleplay",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4A",
    "grades": [
      "Grade 4",
      "Grade 4A"
    ],
    "duration": 10,
    "durationText": "10 min at home + 1 min at the party",
    "estimatedMinutes": 10,
    "xp": 60,
    "targetClass": "4A",
    "skills": [
      "Listening",
      "Speaking",
      "Vocabulary",
      "Sentence Building",
      "Role-play with a Partner"
    ],
    "topic": "Alice in Wonderland: The Mad Tea Party",
    "topics": [
      "Alice in Wonderland",
      "Role-play",
      "Home Practice"
    ],
    "languageFocus": "I am… / I have… / I can… / I like… / Do you like…? Yes, I do. / Can you…? Yes, I can.",
    "activityMode": "Home practice app + printable A5 double-sided character cards",
    "interactionType": "Listen, match, order, say; pair role-play (1 minute)",
    "route": "alice-party-home/index.html?class=4a",
    "url": "alice-party-home/index.html?class=4a",
    "path": "alice-party-home/index.html?class=4a",
    "worksheetUrl": "alice-party-home/cards.html?class=4a",
    "worksheetRoute": "alice-party-home/cards.html?class=4a",
    "thumbnailIcon": "🫖",
    "thumbnailUrl": "alice-party-home/assets/alice.jpg",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "Home practice → 1-minute pair conversation (8–10 short lines)",
    "grammar": {
      "focusPattern": "Be / have / can / like + Yes–No questions",
      "formula": "Do you like…? Yes, I do. / Can you…? Yes, I can."
    },
    "learningObjectives": [
      "Understand and say 3 short sentences about a character (I am / I have / I like).",
      "Recognise and use 6 picture words for the character.",
      "Listen to a partner and choose and say the correct reply in a 1-minute conversation."
    ],
    "vocabulary": {
      "core": [
        "ball",
        "bed",
        "bell",
        "blue",
        "bone",
        "book",
        "bow",
        "butter",
        "butterfly",
        "button",
        "cake",
        "card",
        "carrot",
        "castle",
        "cat",
        "caterpillar",
        "chair",
        "claws",
        "clock",
        "coat",
        "crown",
        "cup",
        "dog",
        "door",
        "dragon",
        "dress",
        "drum",
        "ears",
        "eyes",
        "fire",
        "fish",
        "flower",
        "forest",
        "friend",
        "garden",
        "hat",
        "heart",
        "hurry",
        "key",
        "letter",
        "magic",
        "milk",
        "money",
        "monster",
        "mouse",
        "mushroom",
        "night",
        "nose",
        "party",
        "paw",
        "potion",
        "purple",
        "question",
        "rabbit",
        "rose",
        "run",
        "shield",
        "sister",
        "smile",
        "smoke",
        "star",
        "stick",
        "sun",
        "sword",
        "tail",
        "tea",
        "teacup",
        "teapot",
        "tree",
        "watch",
        "yarn"
      ]
    },
    "badges": [
      "Class 4A Cast",
      "A1+ Home Practice",
      "Printable A5 Cards",
      "18 Student Cards",
      "Pair Role-play"
    ]
  },
  {
    "id": "alice-party-home-4b",
    "aliases": [
      "alice-party-home-4b",
      "tea-party-home-4b",
      "party-home-4b"
    ],
    "title": "🫖 Alice Tea Party: Home Practice + Cards (Class 4B)",
    "description": "A1+ home practice for the Class 4B tea party. Every student gets a personal character card and a 10-minute practice app (meet, words, word order, speaking, pair role-play) to prepare a 1-minute conversation with a partner. Printable A5 double-sided cards for all 19 students; works offline on phones.",
    "type": "game",
    "category": "Literature & Story Quests",
    "categoryGroup": "Alice Series",
    "categoryLabel": "🎩 Literature & Roleplay",
    "level": "A1+",
    "cefrLevel": "A1+",
    "age": "Ages 9–10",
    "ageGroup": "9-10",
    "grade": "Grade 4B",
    "grades": [
      "Grade 4",
      "Grade 4B"
    ],
    "duration": 10,
    "durationText": "10 min at home + 1 min at the party",
    "estimatedMinutes": 10,
    "xp": 60,
    "targetClass": "4B",
    "skills": [
      "Listening",
      "Speaking",
      "Vocabulary",
      "Sentence Building",
      "Role-play with a Partner"
    ],
    "topic": "Alice in Wonderland: The Mad Tea Party",
    "topics": [
      "Alice in Wonderland",
      "Role-play",
      "Home Practice"
    ],
    "languageFocus": "I am… / I have… / I can… / I like… / Do you like…? Yes, I do. / Can you…? Yes, I can.",
    "activityMode": "Home practice app + printable A5 double-sided character cards",
    "interactionType": "Listen, match, order, say; pair role-play (1 minute)",
    "route": "alice-party-home/index.html?class=4b",
    "url": "alice-party-home/index.html?class=4b",
    "path": "alice-party-home/index.html?class=4b",
    "worksheetUrl": "alice-party-home/cards.html?class=4b",
    "worksheetRoute": "alice-party-home/cards.html?class=4b",
    "thumbnailIcon": "🫖",
    "thumbnailUrl": "alice-party-home/assets/alice.jpg",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    "status": "active",
    "trackId": "track-4",
    "trackTitle": "📖 Literature, Story Quests & Diagnostic Tests",
    "formula": "Home practice → 1-minute pair conversation (8–10 short lines)",
    "grammar": {
      "focusPattern": "Be / have / can / like + Yes–No questions",
      "formula": "Do you like…? Yes, I do. / Can you…? Yes, I can."
    },
    "learningObjectives": [
      "Understand and say 3 short sentences about a character (I am / I have / I like).",
      "Recognise and use 6 picture words for the character.",
      "Listen to a partner and choose and say the correct reply in a 1-minute conversation."
    ],
    "vocabulary": {
      "core": [
        "ball",
        "bed",
        "bell",
        "bone",
        "book",
        "bow",
        "butter",
        "button",
        "cake",
        "card",
        "carrot",
        "castle",
        "cat",
        "chair",
        "cheese",
        "claws",
        "clock",
        "coat",
        "crown",
        "cup",
        "dog",
        "door",
        "dragon",
        "dress",
        "drum",
        "ears",
        "eyes",
        "father",
        "fire",
        "fish",
        "flower",
        "forest",
        "friend",
        "garden",
        "hat",
        "heart",
        "hurry",
        "key",
        "letter",
        "magic",
        "milk",
        "money",
        "monster",
        "mouse",
        "night",
        "nose",
        "party",
        "paw",
        "potion",
        "purple",
        "rabbit",
        "rose",
        "run",
        "same",
        "shield",
        "sleep",
        "smile",
        "star",
        "stick",
        "sun",
        "sword",
        "tail",
        "tea",
        "teacup",
        "teapot",
        "tree",
        "twin",
        "watch",
        "yarn"
      ]
    },
    "badges": [
      "Class 4B Cast",
      "A1+ Home Practice",
      "Printable A5 Cards",
      "19 Student Cards",
      "Pair Role-play"
    ]
  }
];

const GAMES_DATA = GAMES_REGISTRY;

if (typeof window !== "undefined") {
  window.CURRICULUM_TRACKS = CURRICULUM_TRACKS;
  window.GAMES_REGISTRY = GAMES_REGISTRY;
  window.GAMES_DATA = GAMES_DATA;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CURRICULUM_TRACKS, GAMES_REGISTRY, GAMES_DATA };
}
