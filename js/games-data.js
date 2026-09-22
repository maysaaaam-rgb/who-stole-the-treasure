/**
 * ENGLISH ADVENTURE ACADEMY — STANDARDIZED EDUCATIONAL RESOURCE REGISTRY
 * Authoritative Single Source of Truth for all 41 classroom games, stories, CLIL modules, and textbooks.
 * 
 * Standardized into 4 Core Categories:
 * - "CLIL & Science"
 * - "Engineering & Inventions"
 * - "Story & Literature"
 * - "Phonics & Language Quests"
 * 
 * Every lesson entry strictly exposes the 5 functional pillars:
 * 1. learningObjectives (Target Outcomes)
 * 2. vocabulary { core: string[], supporting: string[] }
 * 3. grammar { focusPattern: string, formula: string, formulas: string[] }
 * 4. topics: string[], clilTheme: string, clilDomain: string
 * 5. category, categoryGroup, level, cefrLevel, durationText, xp
 */

const GAMES_REGISTRY = [
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
    "clilTheme": "Engineering Design Process & Biomimicry"
  },
  {
    "id": "academy-bamboozle",
    "aliases": [
      "bamboozle",
      "baamboozle"
    ],
    "title": "⚡ Baamboozle Arena: Young Inventors",
    "description": "High-energy classroom team showdown with mystery cards, problem-solving questions, and sudden game-changing power-ups (Swap, Steal, and Double Points)!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "⚡ Team Quiz Show",
    "level": "All Levels (A1–A2+)",
    "cefrLevel": "A1–A2+",
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
    "thumbnailIcon": "⚡",
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
    "clilTheme": "History of Technology & Team Problem Solving"
  },
  {
    "id": "nasa-mission",
    "title": "🚀 NASA Mission: Find a New Planet",
    "description": "Interactive 6-stage CLIL space expedition for primary ESL learners. Fuel thrusters with Magic 'e' phonics, scan uncharted alien surfaces, sort survival cargo, build modular crisis-solving rovers, collaborate with global peers using 'AND', and broadcast the final live discovery report to Earth!",
    "type": "game",
    "category": "CLIL & Science",
    "categoryLabel": "🚀 CLIL & Space Exploration",
    "level": "A1 / A1+",
    "cefrLevel": "A1+",
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
    "clilTheme": "Astrophysics & Exoplanet Habitability"
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
    "clilTheme": "Cognitive Neuroscience & Human Anatomy"
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
    "clilTheme": "Brain Metabolism & Active Reading"
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
    "clilTheme": "Cognitive Linguistics & Neuroplasticity"
  },
  {
    "id": "adventure-engine",
    "aliases": [
      "adventure-academy-engine",
      "eco-rover"
    ],
    "title": "⚡ Adventure Academy Engine: Eco-Rover Expedition",
    "description": "Commercial-grade cyber-glassmorphic interactive learning module. Power the quantum core, align solar, kinetic, radar, and shield subsystems, solve speed hazard relays, and broadcast live on the glowing teleprompter!",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "⚡ CLIL & Clean Energy",
    "level": "A1+ / A2",
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
    "route": "adventure-engine/index.html",
    "worksheet": "adventure-engine/worksheet.html",
    "worksheetRoute": "adventure-engine/worksheet.html",
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
    "clilTheme": "Renewable Energy & Robotic Navigation"
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
    "clilTheme": "Muscle Kinetic Energy vs Cerebral Metabolism"
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
    "clilTheme": "Mechanical Prototyping & Pitching"
  },
  {
    "id": "young-inventor",
    "title": "Young Inventor Academy: From Problem → Idea → Invention → Improvement → Presentation",
    "description": "Comprehensive 10-mission interactive STEM & invention adventure for Grade 4 (CEFR A1+) based on My Good Ideas Book (pp. 18–21). Students detect real classroom problems, explore biomimicry clues, draw blueprint sketches on touch canvas, assemble modular components, formulate CAN/CAN'T sentences, stress-test in testing chamber, upgrade prototypes, and deliver 5-minute capstone Expo presentations.",
    "type": "game",
    "category": "Engineering & Inventions",
    "categoryLabel": "💡 CLIL & STEM Games",
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
    "clilTheme": "Engineering Design Loop (Plan, Build, Test, Improve)"
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
    "clilTheme": "Dramatic Interpretation & Theatre Arts"
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
    "clilTheme": "Narrative Chronology & Past Simple"
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
    "clilTheme": "Literary World Building & Character Archetypes"
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
    "worksheetRoute": null,
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
    "clilTheme": "Interactive Fiction & Branching Decisions"
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
    "worksheetRoute": null,
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
    "clilTheme": "Temperate Forest Ecosystems & Wilderness Decisions"
  },
  {
    "id": "simon-says-classroom",
    "title": "Simon Says: Physical Classroom Game",
    "description": "Teacher-led physical listening and reaction activity for the interactive smartboard. Features massive projector-friendly command displays, valid vs trick logic, procedural audio cues, natural TTS speech pronunciation, and +25 XP champion celebration.",
    "type": "game",
    "category": "Phonics & Language Quests",
    "categoryLabel": "🗣️ Speaking Games",
    "level": "Pre-A1–A2",
    "cefrLevel": "Pre-A1–A2",
    "age": "Ages 5–12",
    "ageGroup": "5-12",
    "grade": "Grades 1–6",
    "grades": [
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6"
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
    "topic": "Action Verbs, Body Parts & Imperatives",
    "topics": [
      "Total Physical Response (TPR)",
      "Action Verbs & Body Movement",
      "Listening Skills"
    ],
    "languageFocus": "Imperatives (Touch, Jump, Turn, Raise, Freeze) & Simon Says Conditional Rules",
    "activityMode": "Classroom / Physical Whole Group",
    "interactionType": "Teacher-Led Smartboard Physical Activity",
    "difficulty": "All Levels (Adaptive Speed)",
    "tags": [
      "simon-says",
      "listening",
      "speaking",
      "total-physical-response",
      "tpr",
      "movement",
      "smartboard",
      "projector",
      "toolkit"
    ],
    "learningObjectives": [
      "Respond physically to oral imperative command structures with speed and accuracy (TPR)",
      "Distinguish between valid commands ('Simon says...') and false commands without Simon",
      "Identify and execute action verbs and body part physical movements",
      "Exercise self-regulation, auditory attention, and inhibitory control"
    ],
    "teacherInstructions": "Launch on your interactive whiteboard or projector. Have all students stand up. Tap any student to eliminate them when you observe them moving on a trick or performing the wrong action.",
    "studentInstructions": "Listen carefully! Only do the action if Simon says! If you move without Simon says, you are out!",
    "route": "#simon-says",
    "worksheet": null,
    "worksheetRoute": null,
    "teacherGuide": true,
    "supportsAssignment": true,
    "supportsProgress": true,
    "featured": true,
    "thumbnailSvg": "\n      <svg viewBox=\"0 0 200 140\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"simonCardBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stop-color=\"#064e3b\"/>\n            <stop offset=\"100%\" stop-color=\"#022c22\"/>\n          </linearGradient>\n        </defs>\n        <rect width=\"200\" height=\"140\" fill=\"url(#simonCardBg)\"/>\n        <rect x=\"20\" y=\"20\" width=\"160\" height=\"100\" rx=\"14\" fill=\"#042f2e\" stroke=\"#10b981\" stroke-width=\"2.5\"/>\n        <circle cx=\"100\" cy=\"55\" r=\"22\" fill=\"#10b981\" opacity=\"0.25\"/>\n        <text x=\"100\" y=\"62\" font-size=\"28\" text-anchor=\"middle\">🗣️</text>\n        <rect x=\"35\" y=\"86\" width=\"130\" height=\"22\" rx=\"11\" fill=\"#059669\"/>\n        <text x=\"100\" y=\"101\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"11\" fill=\"#ffffff\" text-anchor=\"middle\" letter-spacing=\"0.5\">SIMON SAYS 🏆</text>\n      </svg>",
    "categoryGroup": "TPR Action Quests",
    "vocabulary": {
      "core": [
        "touch",
        "jump",
        "clap",
        "turn around",
        "stand up",
        "sit down"
      ],
      "supporting": [
        "shoulders",
        "knees",
        "toes",
        "whisper",
        "freeze",
        "hop"
      ],
      "phonics": [
        "/cl/ in clap",
        "/t/ in touch"
      ]
    },
    "grammar": {
      "focusPattern": "Simon says, [Imperative Verb + Object]!",
      "formula": "Simon says: Touch your [body part] and jump [number] times!",
      "formulas": [
        "Imperative Formula: Verb + Noun Phrase (e.g., 'Touch your nose')",
        "Simon says + [Imperative] vs. [Imperative] (Do not move!)"
      ]
    },
    "clilDomain": "Kinesiology & Auditory Processing",
    "clilTheme": "Kinesiology & Auditory Processing"
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
    "clilTheme": "Forensic Timelines & Interrogative Grammar"
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
    "clilTheme": "Traits of Innovators & Growth Mindset"
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
    "clilTheme": "Household Engineering & Practical Inventions"
  },
  {
    "id": "alice-quest",
    "title": "📖 Alice in Wonderland: XP Challenges",
    "description": "Differentiated reading and speaking challenge deck. Students choose their level (1 to 3) to earn up to 200 XP for vocabulary, creative storytelling, character acting, and full spoken summaries!",
    "type": "presentation",
    "category": "Story & Literature",
    "categoryLabel": "📖 Literature & Speaking",
    "level": "A1 / A2 / B1",
    "cefrLevel": "A1–B1",
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
    "thumbnailIcon": "📖",
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
    "clilTheme": "Literary Analysis & Gamified Roster Grading"
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
    "clilTheme": "Automated Machines & Artificial Intelligence"
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
    "clilTheme": "Emotional Intelligence & Empathy"
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
    "clilTheme": "Fire Safety & Municipal Emergency Services"
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
    "worksheetRoute": null,
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
    "clilTheme": "Outdoor Wilderness & Clue Deduction"
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
    "worksheetRoute": null,
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
    "clilTheme": "Phonological Decoding & Minimal Pairs"
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
    "worksheetRoute": null,
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
    "clilTheme": "Anatomy Description & Attribute Formulas"
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
    "clilTheme": "Hospitality Transactions & Social Etiquette"
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
    "worksheetRoute": null,
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
    "clilTheme": "Spatial Navigation & Civic Landmarks"
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
    "clilTheme": "Functional Ethics & Helpful Recommendations"
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
    "clilTheme": "Futurism & Speculative Technology"
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
    "clilTheme": "Fable Analysis & Environmental Comparison"
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
    "worksheetRoute": null,
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
    "clilTheme": "Heroic Quests & Allegorical Character Virtues"
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
    "worksheetRoute": null,
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
    "clilTheme": "Observational Deduction & Rapid Inquiries"
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
    "worksheetRoute": null,
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
    "clilTheme": "Cartography & Maritime Navigation"
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
    "worksheetRoute": null,
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
    "clilTheme": "Domestic Living & Spatial Organization"
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
    "worksheetRoute": null,
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
    "clilTheme": "Forensic Evidence & Chromatography"
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
    "worksheetRoute": null,
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
    "clilTheme": "Extreme Polar Climates & Survival Gear"
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
    "worksheetRoute": null,
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
    "clilTheme": "Comparative Mathematics & Game Theory"
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
    "worksheetRoute": null,
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
    "clilTheme": "Tropical Biodiversity & Rainforest Strata"
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
    "worksheetRoute": null,
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
    "clilTheme": "Macmillan Primary Literacy Syllabus (Level 2)"
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
    "worksheetRoute": null,
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
    "clilTheme": "Macmillan Primary Literacy Syllabus (Level 3)"
  }
];

// Standardized exports
const GAMES_DATA = GAMES_REGISTRY;

if (typeof window !== 'undefined') {
  window.GAMES_REGISTRY = GAMES_REGISTRY;
  window.GAMES_DATA = GAMES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAMES_REGISTRY, GAMES_DATA };
}
