/**
 * ECO-ENGINEERS: OCEAN CLEANERS & REEF RESCUE — CURRICULUM DATA
 * Primary ESL / CLIL • Grade 3–4 | CEFR A1+ | Ages 7–10
 * Focus: "The [Machine] helps to [Verb]" & "We must protect the [Habitat]"
 */
(function(root) {
  'use strict';

  const OCEAN_DATA = {
    meta: {
      id: 'ocean-cleaners',
      title: 'Eco-Engineers: Ocean Cleaners & Reef Rescue',
      subtitle: 'Marine Robotics • Ocean Habitats • Environmental Protection',
      grade: 'Grade 3–4',
      cefr: 'A1+',
      age: 'Ages 7–10',
      grammarStructures: [
        'The [Machine] helps to [Verb]',
        'We must protect the [Habitat]'
      ],
      lexicon: [
        'ocean', 'plastic', 'coral', 'robot', 'net', 'turtle',
        'clean', 'rescue', 'filter', 'collect'
      ],
      totalXP: 160
    },

    machines: [
      {
        id: 'solar-skimmer',
        name: 'Solar Skimmer',
        type: 'Surface Autonomous Catamaran',
        element: 'Solar Clean',
        accentColor: '#38bdf8',
        badgeBg: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#38bdf8',
        habitat: 'ocean',
        habitatName: 'Open Ocean',
        habitatIcon: '🌊',
        feature: 'solar conveyor net',
        featureName: 'Solar Twin Hulls & Net',
        action: 'collect plastic',
        actionVerb: 'collect',
        speechIntro: 'The Solar Skimmer helps to collect plastic from the sea. We must protect the open ocean!',
        teleprompter: [
          'This is our ocean machine: Solar Skimmer.',
          'The Solar Skimmer helps to collect plastic!',
          'We must protect the ocean for our marine life.'
        ],
        stats: {
          speed: 85,
          ecoBattery: 95,
          cleanupRate: 92
        },
        discoveryFacts: {
          featureFact: 'Twin carbon catamaran hulls powered by high-efficiency solar cells.',
          missionFact: 'Scoops up 500 kilograms of floating bottles and debris every day.',
          habitatFact: 'Patrols blue open-ocean currents where plastic trash accumulates.'
        },
        workbenchTasks: [
          {
            id: 'sk-t1',
            type: 'formula1',
            prompt: 'Look at the Solar Skimmer! Complete the eco-robot statement:',
            sentencePre: 'The Solar Skimmer helps ',
            sentencePost: ' floating bottles and trash from the waves.',
            options: [
              { text: 'to collect plastic', correct: true, hint: 'Remember the formula: helps + TO + VERB!' },
              { text: 'for eating fish', correct: false, hint: 'The skimmer cleans trash; it does not harm wildlife!' },
              { text: 'to sink deep', correct: false, hint: 'Catamarans float on the surface of the water!' }
            ],
            explanation: 'The Solar Skimmer helps to collect plastic!'
          },
          {
            id: 'sk-t2',
            type: 'verb',
            prompt: 'What action does the conveyor net do?',
            sentencePre: 'The machine is designed to ',
            sentencePost: ' marine waste before it breaks down.',
            options: [
              { text: 'collect', correct: true, hint: 'Collect means to gather items together safely!' },
              { text: 'drop', correct: false, hint: 'We want to remove trash, not drop more into the ocean!' },
              { text: 'burn', correct: false, hint: 'Burning trash in the water causes heavy pollution!' }
            ],
            explanation: 'The robot helps to collect waste!'
          },
          {
            id: 'sk-t3',
            type: 'formula2',
            prompt: 'Why are the eco-engineers working every day?',
            sentencePre: 'We must ',
            sentencePost: ' from harmful microplastics and pollution.',
            options: [
              { text: 'protect the ocean', correct: true, hint: 'Formula 2: We must protect the [Habitat]!' },
              { text: 'ignore the sea', correct: false, hint: 'Ignoring the ocean damages all sea animals!' },
              { text: 'pollute the water', correct: false, hint: 'Our mission is cleanup and protection!' }
            ],
            explanation: 'We must protect the ocean!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="skimmerAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#060911" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="hullGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="50%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="solarPanelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#0369a1" />
              <stop offset="100%" stop-color="#0c4a6e" />
            </linearGradient>
            <filter id="skimmerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#38bdf8" flood-opacity="0.55"/>
            </filter>
          </defs>
          <!-- Aura Discs -->
          <circle cx="100" cy="100" r="75" fill="url(#skimmerAura)"/>
          <!-- Water Wake Ripples -->
          <ellipse cx="100" cy="142" rx="72" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.7"/>
          <ellipse cx="100" cy="150" rx="84" ry="10" fill="none" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="10 8" opacity="0.45"/>
          <!-- Catamaran Twin Hulls -->
          <g filter="url(#skimmerGlow)">
            <!-- Left Hull -->
            <path d="M 40 90 L 52 135 Q 52 144 42 144 Q 32 144 32 135 L 36 90 Z" fill="url(#hullGrad)" stroke="#334155" stroke-width="1.5"/>
            <!-- Right Hull -->
            <path d="M 160 90 L 168 135 Q 168 144 158 144 Q 148 144 148 135 L 152 90 Z" fill="url(#hullGrad)" stroke="#334155" stroke-width="1.5"/>
            <!-- Central Deck Bridge -->
            <rect x="48" y="95" width="104" height="28" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <!-- Solar Panel Arrays -->
            <rect x="54" y="99" width="44" height="20" rx="4" fill="url(#solarPanelGrad)" stroke="#38bdf8" stroke-width="1"/>
            <line x1="68" y1="99" x2="68" y2="119" stroke="#7dd3fc" stroke-width="1"/>
            <line x1="83" y1="99" x2="83" y2="119" stroke="#7dd3fc" stroke-width="1"/>
            <rect x="102" y="99" width="44" height="20" rx="4" fill="url(#solarPanelGrad)" stroke="#38bdf8" stroke-width="1"/>
            <line x1="116" y1="99" x2="116" y2="119" stroke="#7dd3fc" stroke-width="1"/>
            <line x1="131" y1="99" x2="131" y2="119" stroke="#7dd3fc" stroke-width="1"/>
            <!-- Conveyor Intake Mouth (Front) -->
            <path d="M 70 123 L 130 123 L 122 146 L 78 146 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <line x1="74" y1="129" x2="126" y2="129" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>
            <line x1="76" y1="137" x2="124" y2="137" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>
            <!-- Collected Plastic Bottle Silhouette -->
            <rect x="94" y="132" width="12" height="7" rx="2" fill="#38bdf8" opacity="0.8"/>
            <rect x="106" y="134" width="3" height="3" rx="1" fill="#f8fafc"/>
            <!-- Sensor Mast & Navigation Beacon -->
            <line x1="100" y1="95" x2="100" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <circle cx="100" cy="62" r="5" fill="#f59e0b"/>
            <circle cx="100" cy="62" r="8" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3"/>
            <!-- Antenna Radar Dish -->
            <path d="M 88 72 Q 100 68 112 72" stroke="#38bdf8" stroke-width="2" fill="none"/>
          </g>
        </svg>`
      },
      {
        id: 'reef-rover',
        name: 'Reef Rover',
        type: 'Coral Restoration Submersible',
        element: 'Bio Reef',
        accentColor: '#10b981',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        habitat: 'coral reef',
        habitatName: 'Coral Reef Sanctuary',
        habitatIcon: '🪸',
        feature: 'robotic arms & seed planter',
        featureName: 'Robotic Grippers & Seed Pods',
        action: 'plant coral',
        actionVerb: 'plant',
        speechIntro: 'The Reef Rover helps to plant coral along damaged reefs. We must protect the coral reef!',
        teleprompter: [
          'This is our ocean machine: Reef Rover.',
          'The Reef Rover helps to plant coral!',
          'We must protect the coral reef from damage.'
        ],
        stats: {
          speed: 78,
          ecoBattery: 90,
          cleanupRate: 96
        },
        discoveryFacts: {
          featureFact: 'Micro-robotic arms gently affix living coral polyps to reef substrates.',
          missionFact: 'Can plant up to 200 baby corals on a single battery charge.',
          habitatFact: 'Operates in shallow sunlit tropical reefs teeming with clownfish.'
        },
        workbenchTasks: [
          {
            id: 'rr-t1',
            type: 'formula1',
            prompt: 'Look at the Reef Rover! Complete the conservation formula:',
            sentencePre: 'The Reef Rover helps ',
            sentencePost: ' in areas where the reef is broken.',
            options: [
              { text: 'to plant coral', correct: true, hint: 'Formula: helps + TO + VERB!' },
              { text: 'to break rocks', correct: false, hint: 'We heal fragile coral, we do not destroy rocks!' },
              { text: 'for sleeping', correct: false, hint: 'Remember the formula: TO + VERB!' }
            ],
            explanation: 'The Reef Rover helps to plant coral!'
          },
          {
            id: 'rr-t2',
            type: 'verb',
            prompt: 'What does the rover do with young coral fragments?',
            sentencePre: 'Its soft robotic fingers ',
            sentencePost: ' each baby coral onto solid limestone.',
            options: [
              { text: 'plant', correct: true, hint: 'Plant means to place living organisms in soil or rock to grow!' },
              { text: 'crush', correct: false, hint: 'Crushing will kill the baby corals!' },
              { text: 'throw', correct: false, hint: 'Corals must be planted gently and precisely!' }
            ],
            explanation: 'The robot helps to plant baby coral!'
          },
          {
            id: 'rr-t3',
            type: 'formula2',
            prompt: 'Corals are home to 25% of all sea life. Complete the vow:',
            sentencePre: 'We must ',
            sentencePost: ' so baby fish have a safe home.',
            options: [
              { text: 'protect the coral reef', correct: true, hint: 'Target: We must protect the [Habitat]!' },
              { text: 'take all shells', correct: false, hint: 'Taking shells disrupts the ecosystem!' },
              { text: 'drop heavy anchors', correct: false, hint: 'Anchors crush fragile coral formations!' }
            ],
            explanation: 'We must protect the coral reef!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="reefAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.75" />
              <stop offset="60%" stop-color="#064e3b" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#060911" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="subHullGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="50%" stop-color="#059669" />
              <stop offset="100%" stop-color="#064e3b" />
            </linearGradient>
            <linearGradient id="domeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6" />
            </linearGradient>
            <filter id="reefGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#10b981" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="100" r="75" fill="url(#reefAura)"/>
          <!-- Submarine Spherical Body -->
          <g filter="url(#reefGlow)">
            <!-- Main Torso -->
            <ellipse cx="100" cy="105" rx="46" ry="36" fill="url(#subHullGrad)" stroke="#047857" stroke-width="2"/>
            <!-- Observation Dome -->
            <ellipse cx="100" cy="95" rx="28" ry="22" fill="url(#domeGrad)" stroke="#ffffff" stroke-width="1.5"/>
            <path d="M 85 88 Q 100 80 115 88" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
            <!-- Thruster Jets Back -->
            <rect x="42" y="100" width="14" height="12" rx="3" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
            <rect x="144" y="100" width="14" height="12" rx="3" fill="#1e293b" stroke="#10b981" stroke-width="1"/>
            <!-- Tiny Propeller Spin Blades -->
            <line x1="38" y1="98" x2="38" y2="114" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
            <line x1="162" y1="98" x2="162" y2="114" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
            <!-- Top Bio Seed Pod Tank -->
            <rect x="84" y="60" width="32" height="18" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <!-- Baby Coral Polyps in Tank -->
            <circle cx="92" cy="69" r="3" fill="#f43f5e"/>
            <circle cx="100" cy="67" r="3.5" fill="#f59e0b"/>
            <circle cx="108" cy="70" r="3" fill="#38bdf8"/>
            <!-- Bottom Articulated Robotic Gripper Arms -->
            <!-- Left Arm -->
            <path d="M 78 132 L 65 152 L 72 165" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="65" cy="152" r="3" fill="#10b981"/>
            <path d="M 68 165 L 75 168 M 72 165 L 70 172" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
            <!-- Right Arm Planting Coral -->
            <path d="M 122 132 L 135 152 L 126 166" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="135" cy="152" r="3" fill="#10b981"/>
            <!-- Coral held in claw -->
            <path d="M 124 167 Q 126 161 129 167 Q 132 161 134 167" stroke="#f43f5e" stroke-width="3" fill="none"/>
            <circle cx="129" cy="160" r="2" fill="#fb7185"/>
            <!-- Spotlight Beams -->
            <polygon points="100,125 70,165 130,165" fill="#fef08a" opacity="0.18"/>
            <circle cx="100" cy="126" r="4" fill="#fef08a"/>
          </g>
        </svg>`
      },
      {
        id: 'aqua-drone',
        name: 'Aqua Drone',
        type: 'Marine Life Rescue Patrol',
        element: 'Rescue Speed',
        accentColor: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        habitat: 'coastal lagoon',
        habitatName: 'Coastal Lagoon',
        habitatIcon: '🐢',
        feature: 'sonar locator & rescue net',
        featureName: 'Sonar Pings & Gentle Basket',
        action: 'rescue turtles',
        actionVerb: 'rescue',
        speechIntro: 'The Aqua Drone helps to rescue turtles trapped in ghost fishing nets. We must protect the coastal lagoon!',
        teleprompter: [
          'This is our ocean machine: Aqua Drone.',
          'The Aqua Drone helps to rescue turtles!',
          'We must protect the coastal lagoon for wildlife.'
        ],
        stats: {
          speed: 98,
          ecoBattery: 88,
          cleanupRate: 94
        },
        discoveryFacts: {
          featureFact: 'High-frequency acoustic sonar detects marine animals from 3 kilometers away.',
          missionFact: 'Carries a pneumatic net-cutter to safely free entangled sea turtles.',
          habitatFact: 'Guards mangroves, tidal flats, and quiet nursery lagoons.'
        },
        workbenchTasks: [
          {
            id: 'ad-t1',
            type: 'formula1',
            prompt: 'Look at the swift Aqua Drone! Complete the rescue sentence:',
            sentencePre: 'The Aqua Drone helps ',
            sentencePost: ' when they are tangled in old fishing lines.',
            options: [
              { text: 'to rescue turtles', correct: true, hint: 'Target formula: helps + TO + VERB!' },
              { text: 'to chase birds', correct: false, hint: 'Drones protect ocean wildlife, not chase birds!' },
              { text: 'for racing', correct: false, hint: 'This is a rescue craft, not a racecar!' }
            ],
            explanation: 'The Aqua Drone helps to rescue turtles!'
          },
          {
            id: 'ad-t2',
            type: 'verb',
            prompt: 'What critical verb describes saving an animal in danger?',
            sentencePre: 'Engineers send the drone to ',
            sentencePost: ' injured sea creatures.',
            options: [
              { text: 'rescue', correct: true, hint: 'Rescue means to save someone or an animal from harm!' },
              { text: 'scare', correct: false, hint: 'We comfort and protect animals, never scare them!' },
              { text: 'trap', correct: false, hint: 'Trapping hurts animals; our goal is freeing them!' }
            ],
            explanation: 'The drone helps to rescue animals!'
          },
          {
            id: 'ad-t3',
            type: 'formula2',
            prompt: 'Lagoon nurseries nurture thousands of baby turtles. Complete the pledge:',
            sentencePre: 'We must ',
            sentencePost: ' so turtles can swim safely to the open sea.',
            options: [
              { text: 'protect the coastal lagoon', correct: true, hint: 'Formula 2: We must protect the [Habitat]!' },
              { text: 'fill it with concrete', correct: false, hint: 'Concrete destroys natural turtle nesting grounds!' },
              { text: 'throw plastic bags', correct: false, hint: 'Turtles mistake plastic bags for jellyfish and choke!' }
            ],
            explanation: 'We must protect the coastal lagoon!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="droneAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8" />
              <stop offset="60%" stop-color="#b45309" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#060911" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="droneBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
            <filter id="droneGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#f59e0b" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="100" r="75" fill="url(#droneAura)"/>
          <!-- Hydrodynamic Drone Craft -->
          <g filter="url(#droneGlow)">
            <!-- Swept Wings -->
            <path d="M 100 85 L 30 115 L 42 125 L 100 110 L 158 125 L 170 115 Z" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
            <!-- Wingtip Thrusters -->
            <ellipse cx="32" cy="116" rx="5" ry="8" fill="#38bdf8"/>
            <ellipse cx="168" cy="116" rx="5" ry="8" fill="#38bdf8"/>
            <!-- Torpedo Fuselage -->
            <path d="M 100 55 C 118 68 122 120 100 148 C 78 120 82 68 100 55 Z" fill="url(#droneBodyGrad)" stroke="#78350f" stroke-width="2"/>
            <!-- Cockpit Sensor Visor -->
            <ellipse cx="100" cy="80" rx="14" ry="10" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
            <ellipse cx="98" cy="78" rx="6" ry="3" fill="#ffffff" opacity="0.8"/>
            <!-- Turtle Rescue Net Cradle (Rear) -->
            <path d="M 88 125 Q 100 145 112 125" stroke="#38bdf8" stroke-width="2" fill="none" stroke-dasharray="4 2"/>
            <path d="M 92 130 Q 100 150 108 130" stroke="#38bdf8" stroke-width="1.5" fill="none" stroke-dasharray="4 2"/>
            <!-- Gentle Little Turtle Sprite inside cradle -->
            <ellipse cx="100" cy="132" rx="7" ry="5" fill="#10b981"/>
            <circle cx="107" cy="132" r="2.5" fill="#047857"/>
            <ellipse cx="96" cy="129" rx="2" ry="1" fill="#047857"/>
            <ellipse cx="96" cy="135" rx="2" ry="1" fill="#047857"/>
            <!-- Sonar Pulse Waves Front -->
            <path d="M 86 52 Q 100 42 114 52" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.9"/>
            <path d="M 76 44 Q 100 30 124 44" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.6"/>
            <path d="M 66 36 Q 100 18 134 36" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.35"/>
          </g>
        </svg>`
      },
      {
        id: 'bubble-barrier',
        name: 'Bubble Barrier',
        type: 'Acoustic Microplastic Filter',
        element: 'Eco Filtration',
        accentColor: '#a855f7',
        badgeBg: 'rgba(168, 85, 247, 0.2)',
        borderColor: '#a855f7',
        habitat: 'river estuary',
        habitatName: 'River Estuary',
        habitatIcon: '🫧',
        feature: 'air compressor & micro-filter grid',
        featureName: 'Compressed Air Nozzles & Filter',
        action: 'filter microplastics',
        actionVerb: 'filter',
        speechIntro: 'The Bubble Barrier helps to filter microplastics before they reach the sea. We must protect the river estuary!',
        teleprompter: [
          'This is our ocean machine: Bubble Barrier.',
          'The Bubble Barrier helps to filter microplastics!',
          'We must protect the river estuary from waste.'
        ],
        stats: {
          speed: 82,
          ecoBattery: 96,
          cleanupRate: 98
        },
        discoveryFacts: {
          featureFact: 'Creates an upward curtain of dense bubbles that pushes microplastic to the riverbank.',
          missionFact: 'Catches 86% of small plastic particles without blocking fish migration.',
          habitatFact: 'Anchored at mouth of industrial rivers to shield the marine sanctuary.'
        },
        workbenchTasks: [
          {
            id: 'bb-t1',
            type: 'formula1',
            prompt: 'Observe the Bubble Barrier generator! What is its core function?',
            sentencePre: 'The Bubble Barrier helps ',
            sentencePost: ' so tiny toxic flakes never reach the coral.',
            options: [
              { text: 'to filter microplastics', correct: true, hint: 'Formula 1: helps + TO + VERB!' },
              { text: 'to make waves', correct: false, hint: 'The barrier catches plastic, it does not create surf!' },
              { text: 'for fishing', correct: false, hint: 'Formula reminder: use TO + VERB!' }
            ],
            explanation: 'The Bubble Barrier helps to filter microplastics!'
          },
          {
            id: 'bb-t2',
            type: 'verb',
            prompt: 'What verb explains catching tiny particles from running water?',
            sentencePre: 'The acoustic bubble curtain works to ',
            sentencePost: ' dirt and plastic beads from the river.',
            options: [
              { text: 'filter', correct: true, hint: 'Filter means to separate solid particles from liquid!' },
              { text: 'stir', correct: false, hint: 'Stirring spreads pollution further!' },
              { text: 'paint', correct: false, hint: 'Painting has nothing to do with water filtration!' }
            ],
            explanation: 'The machine helps to filter microplastics!'
          },
          {
            id: 'bb-t3',
            type: 'formula2',
            prompt: 'Estuaries connect rivers and oceans. Complete the conservation sentence:',
            sentencePre: 'We must ',
            sentencePost: ' where fresh river water meets the salty sea.',
            options: [
              { text: 'protect the river estuary', correct: true, hint: 'Formula 2: We must protect the [Habitat]!' },
              { text: 'throw soda cans', correct: false, hint: 'Dumping cans poisons the estuary water!' },
              { text: 'ignore the river', correct: false, hint: 'Rivers carry trash directly into the ocean!' }
            ],
            explanation: 'We must protect the river estuary!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bubbleAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0.8" />
              <stop offset="60%" stop-color="#7e22ce" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#060911" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="barrierBaseGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#a855f7" />
              <stop offset="100%" stop-color="#581c87" />
            </linearGradient>
            <filter id="bubbleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#a855f7" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="100" r="75" fill="url(#bubbleAura)"/>
          <!-- Rising Bubble Curtain Column -->
          <g opacity="0.85">
            <!-- Bubbles left -->
            <circle cx="75" cy="120" r="4" fill="#e0e7ff" opacity="0.7"/>
            <circle cx="70" cy="95" r="5" fill="#c084fc" opacity="0.8"/>
            <circle cx="78" cy="70" r="6" fill="#e0e7ff" opacity="0.9"/>
            <circle cx="72" cy="45" r="4.5" fill="#f8fafc" opacity="0.9"/>
            <!-- Bubbles center -->
            <circle cx="100" cy="125" r="5" fill="#c084fc" opacity="0.7"/>
            <circle cx="95" cy="100" r="6.5" fill="#e0e7ff" opacity="0.85"/>
            <circle cx="104" cy="75" r="7" fill="#f8fafc" opacity="0.9"/>
            <circle cx="98" cy="48" r="5.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="102" cy="28" r="4" fill="#e0e7ff" opacity="0.9"/>
            <!-- Bubbles right -->
            <circle cx="125" cy="120" r="4" fill="#e0e7ff" opacity="0.7"/>
            <circle cx="130" cy="92" r="5.5" fill="#c084fc" opacity="0.8"/>
            <circle cx="122" cy="68" r="6" fill="#f8fafc" opacity="0.9"/>
            <circle cx="128" cy="42" r="4" fill="#e0e7ff" opacity="0.85"/>
          </g>
          <!-- Submerged Base Generator Platform -->
          <g filter="url(#bubbleGlow)">
            <!-- Riverbed Anchoring Base -->
            <path d="M 45 145 L 155 145 L 145 165 L 55 165 Z" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <!-- Compressor Manifold Tube -->
            <rect x="58" y="136" width="84" height="12" rx="4" fill="url(#barrierBaseGrad)" stroke="#c084fc" stroke-width="1.5"/>
            <!-- Air Emitter Nozzles -->
            <circle cx="75" cy="136" r="3.5" fill="#38bdf8"/>
            <circle cx="100" cy="136" r="3.5" fill="#38bdf8"/>
            <circle cx="125" cy="136" r="3.5" fill="#38bdf8"/>
            <!-- LED Status Indicators -->
            <circle cx="88" cy="155" r="2.5" fill="#10b981"/>
            <circle cx="100" cy="155" r="2.5" fill="#10b981"/>
            <circle cx="112" cy="155" r="2.5" fill="#10b981"/>
            <!-- Microplastic Trap Mesh (Bank Side) -->
            <rect x="135" y="60" width="22" height="76" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <line x1="135" y1="75" x2="157" y2="75" stroke="#38bdf8" stroke-width="1"/>
            <line x1="135" y1="90" x2="157" y2="90" stroke="#38bdf8" stroke-width="1"/>
            <line x1="135" y1="105" x2="157" y2="105" stroke="#38bdf8" stroke-width="1"/>
            <line x1="135" y1="120" x2="157" y2="120" stroke="#38bdf8" stroke-width="1"/>
          </g>
        </svg>`
      }
    ],

    habitats: {
      ocean: {
        id: 'ocean',
        name: 'Open Ocean',
        icon: '🌊',
        desc: 'Vast blue currents where whales migrate and floating plastics collect.',
        color: '#38bdf8'
      },
      coral: {
        id: 'coral',
        name: 'Coral Reef Sanctuary',
        icon: '🪸',
        desc: 'Sunlit underwater cities built of living coral polyps.',
        color: '#10b981'
      },
      lagoon: {
        id: 'lagoon',
        name: 'Coastal Lagoon',
        icon: '🐢',
        desc: 'Sheltered mangrove waters where sea turtles lay eggs and nurse young.',
        color: '#f59e0b'
      },
      estuary: {
        id: 'estuary',
        name: 'River Estuary',
        icon: '🫧',
        desc: 'Brackish wetlands where rivers meet the sea before open water.',
        color: '#a855f7'
      }
    }
  };

  root.OCEAN_DATA = OCEAN_DATA;
})(typeof window !== 'undefined' ? window : global);
