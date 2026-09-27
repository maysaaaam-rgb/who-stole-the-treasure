/**
 * MONSTER EVOLUTION: ELEMENTAL GROWTH CYCLES — CURRICULUM DATA
 * Grade 3–4 | CEFR A1+ | Ages 8–11
 * Formulas:
 * 1. "The [creature] grows from a [baby/juvenile] into a [growing/ultimate] [titan]."
 * 2. "It has [feature] to [action verb]."
 */
(function(root) {
  'use strict';

  const MONSTER_EVOLUTION_DATA = {
    meta: {
      id: 'monster-evolution',
      title: '🐉 Monster Evolution: Elemental Growth Cycles',
      subtitle: 'Elemental Life Cycles, Physical Adaptations & Growth Workbench',
      grade: 'Grade 3–4',
      cefr: 'CEFR A1+',
      ageRange: '8–11',
      topic: 'Elemental Biology, Life Cycles & Physical Adaptations',
      grammarFormulas: [
        'The [Creature] grows from a [baby stage] into a [growing/ultimate] [creature].',
        'It has [wings / horns / fins / armor] to [fly / protect / swim / harness energy].'
      ],
      lexicon: [
        'evolve', 'baby', 'growing', 'ultimate', 'hatchling',
        'wings', 'horns', 'fins', 'armor', 'claws', 'crest',
        'fly', 'swim', 'protect', 'harness', 'charge'
      ],
      totalXP: 180
    },

    elements: [
      { id: 'ember', name: 'Ember (Fire)', icon: '🔥', color: '#ef4444', habitat: 'Magma Peaks' },
      { id: 'aqua', name: 'Aqua (Water)', icon: '💧', color: '#38bdf8', habitat: 'Coral Depths' },
      { id: 'verdant', name: 'Verdant (Nature)', icon: '🌿', color: '#10b981', habitat: 'Emerald Grove' },
      { id: 'astral', name: 'Astral (Cosmic)', icon: '✨', color: '#a855f7', habitat: 'Starlight Crater' },
      { id: 'spark', name: 'Spark (Electric)', icon: '⚡', color: '#f59e0b', habitat: 'Thunder Canyon' }
    ],

    monsters: [
      {
        id: 'emberwing',
        name: 'Emberwing',
        element: 'Ember (Fire)',
        elementIcon: '🔥',
        elementBadge: '🔥 Ember Beast',
        elementBg: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        accentColor: '#f43f5e',
        habitat: 'Magma Peaks',
        habitatIcon: '🌋',
        feature: 'fiery wings & molten horns',
        speechIntro: 'Emberwing is an ember creature. It evolves from a small hatchling into a mighty volcanic dragon!',
        currentStage: 'ultimate',
        imageSrc: 'assets/emberwing_stage_ultimate.webp',
        stages: [
          {
            stageId: 'baby',
            stageName: 'Baby Emberling',
            level: 'Stage 1 (Hatchling)',
            imageSrc: 'assets/emberwing_stage_baby.webp',
            weight: '12 kg',
            height: '0.6 m',
            description: 'A glowing hatchling that radiates gentle thermal heat from its fluffy embers.'
          },
          {
            stageId: 'growing',
            stageName: 'Blaze Drake',
            level: 'Stage 2 (Growing)',
            imageSrc: 'assets/emberwing_stage_growing.webp',
            weight: '210 kg',
            height: '2.1 m',
            description: 'Developing durable obsidian scales and learning to glide on hot updrafts.'
          },
          {
            stageId: 'ultimate',
            stageName: 'Inferno Phoenix Titan',
            level: 'Stage 3 (Ultimate)',
            imageSrc: 'assets/emberwing_stage_ultimate.webp',
            weight: '1,800 kg',
            height: '4.8 m',
            description: 'A colossal sovereign of fire that soars across skies and defends volcanic peaks.'
          }
        ],
        stats: {
          power: 96,
          agility: 82,
          affinity: 90
        },
        workbenchTasks: [
          {
            id: 'ew-t1',
            type: 'growth',
            prompt: 'Complete the life cycle formula for the Fire beast. What stage comes first?',
            sentencePre: 'The Emberwing grows from a ',
            sentencePost: ' into an ultimate Inferno Titan.',
            options: [
              { text: 'baby hatchling', correct: true, hint: 'Every dragon starts as a small baby hatchling!' },
              { text: 'giant boulder', correct: false, hint: 'Boulders are heavy rocks, not living elemental creatures!' },
              { text: 'steel machine', correct: false, hint: 'Emberwing is a living creature, not an industrial robot!' }
            ],
            explanation: 'The Emberwing grows from a baby hatchling into an ultimate Inferno Titan!'
          },
          {
            id: 'ew-t2',
            type: 'adaptation',
            prompt: 'Inspect Emberwing’s powerful anatomical adaptation. Why does it have blazing wings?',
            sentencePre: 'It has powerful fiery wings to ',
            sentencePost: ' above the fiery magma peaks.',
            options: [
              { text: 'fly and glide', correct: true, hint: 'Wings allow creatures to generate lift, glide, and soar high!' },
              { text: 'freeze ice cubes', correct: false, hint: 'Fire wings generate extreme heat, not freezing ice!' },
              { text: 'sleep underwater', correct: false, hint: 'Fire creatures breathe air and fly above magma, not underwater!' }
            ],
            explanation: 'It has powerful fiery wings to fly and glide above the fiery magma peaks!'
          }
        ],
        teleprompter: [
          'Welcome to the Evolution Lab! Today we examined the majestic Emberwing.',
          'It grows from a baby hatchling into a mighty volcanic titan.',
          'It has fiery wings to fly above the magma peaks and protect its home!'
        ]
      },

      {
        id: 'aquafind',
        name: 'Aquafind',
        element: 'Aqua (Water)',
        elementIcon: '💧',
        elementBadge: '💧 Aqua Swimmer',
        elementBg: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#38bdf8',
        accentColor: '#0284c7',
        habitat: 'Coral Depths',
        habitatIcon: '🌊',
        feature: 'hydrodynamic fins & bioluminescence',
        speechIntro: 'Aquafind is a graceful aqua creature. It evolves from a water sprout into a colossal ocean leviathan!',
        currentStage: 'ultimate',
        imageSrc: 'assets/aquafind_stage_ultimate.webp',
        stages: [
          {
            stageId: 'baby',
            stageName: 'Aqua Sprout',
            level: 'Stage 1 (Baby)',
            imageSrc: 'assets/aquafind_stage_baby.webp',
            weight: '8 kg',
            height: '0.4 m',
            description: 'A playful water nymph that dances through shallow tidal pools and coral reefs.'
          },
          {
            stageId: 'growing',
            stageName: 'Tide Glider',
            level: 'Stage 2 (Growing)',
            imageSrc: 'assets/aquafind_stage_growing.webp',
            weight: '160 kg',
            height: '1.9 m',
            description: 'Fast-swimming marine guardian equipped with hydrodynamic crests.'
          },
          {
            stageId: 'ultimate',
            stageName: 'Ocean Leviathan',
            level: 'Stage 3 (Ultimate)',
            imageSrc: 'assets/aquafind_stage_ultimate.webp',
            weight: '2,400 kg',
            height: '6.2 m',
            description: 'A deep-trench sovereign able to dive thousands of meters below light.'
          }
        ],
        stats: {
          power: 84,
          agility: 94,
          affinity: 92
        },
        workbenchTasks: [
          {
            id: 'af-t1',
            type: 'growth',
            prompt: 'Trace the marine life cycle! What does Aquafind develop into as it matures?',
            sentencePre: 'The Aquafind grows from a small sprout into a ',
            sentencePost: ' ocean leviathan.',
            options: [
              { text: 'colossal', correct: true, hint: 'Colossal means gigantic and magnificent in size!' },
              { text: 'invisible', correct: false, hint: 'The leviathan is huge and colorful, not invisible!' },
              { text: 'dry desert', correct: false, hint: 'Aquafind requires ocean water, not dry desert sand!' }
            ],
            explanation: 'The Aquafind grows from a small sprout into a colossal ocean leviathan!'
          },
          {
            id: 'af-t2',
            type: 'adaptation',
            prompt: 'Observe Aquafind’s sleek anatomical fins. What is their physical purpose?',
            sentencePre: 'It has flexible hydrodynamic fins to ',
            sentencePost: ' swiftly through deep ocean trenches.',
            options: [
              { text: 'swim and dive', correct: true, hint: 'Hydrodynamic fins push against water currents to swim smoothly!' },
              { text: 'climb tall trees', correct: false, hint: 'Fins are adapted for liquid ocean water, not climbing tree trunks!' },
              { text: 'dig sand holes', correct: false, hint: 'Fins glide through currents rather than digging dry dirt!' }
            ],
            explanation: 'It has flexible hydrodynamic fins to swim and dive swiftly through deep ocean trenches!'
          }
        ],
        teleprompter: [
          'Welcome to the Evolution Lab! Today we observed the remarkable Aquafind.',
          'It grows from a small sprout into a colossal ocean leviathan.',
          'It has hydrodynamic fins to swim and dive swiftly through coral depths!'
        ]
      },

      {
        id: 'florasprout',
        name: 'Florasprout',
        element: 'Verdant (Nature)',
        elementIcon: '🌿',
        elementBadge: '🌿 Nature Guardian',
        elementBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        accentColor: '#059669',
        habitat: 'Emerald Grove',
        habitatIcon: '🌲',
        feature: 'living bark armor & vine tendrils',
        speechIntro: 'Florasprout is a peaceful nature guardian. It evolves from a moss seedling into an ancient forest titan!',
        currentStage: 'ultimate',
        imageSrc: 'assets/florasprout_stage_ultimate.webp',
        stages: [
          {
            stageId: 'baby',
            stageName: 'Moss Seedling',
            level: 'Stage 1 (Baby)',
            imageSrc: 'assets/florasprout_stage_baby.webp',
            weight: '5 kg',
            height: '0.3 m',
            description: 'A tiny plant companion that absorbs sunlight and nurtures flowering seeds.'
          },
          {
            stageId: 'growing',
            stageName: 'Bloom Warden',
            level: 'Stage 2 (Growing)',
            imageSrc: 'assets/florasprout_stage_growing.webp',
            weight: '180 kg',
            height: '1.8 m',
            description: 'Armored in tough leafy bark and able to accelerate plant growth around it.'
          },
          {
            stageId: 'ultimate',
            stageName: 'Prime Forest Guardian',
            level: 'Stage 3 (Ultimate)',
            imageSrc: 'assets/florasprout_stage_ultimate.webp',
            weight: '3,100 kg',
            height: '5.5 m',
            description: 'An ancient colossus that commands forest roots and shields ancient trees.'
          }
        ],
        stats: {
          power: 88,
          agility: 70,
          affinity: 98
        },
        workbenchTasks: [
          {
            id: 'fs-t1',
            type: 'growth',
            prompt: 'Examine Florasprout’s growth cycle from the soil. How does it evolve?',
            sentencePre: 'The Florasprout grows from a seedling into an ',
            sentencePost: ' forest guardian.',
            options: [
              { text: 'ancient', correct: true, hint: 'Ancient means existing for centuries with immense wisdom and strength!' },
              { text: 'electric', correct: false, hint: 'Florasprout harnesses plant chlorophyll, not electricity!' },
              { text: 'frozen', correct: false, hint: 'Florasprout thrives in warm sunny forests, not arctic ice!' }
            ],
            explanation: 'The Florasprout grows from a seedling into an ancient forest guardian!'
          },
          {
            id: 'fs-t2',
            type: 'adaptation',
            prompt: 'Inspect the dense timber bark shielding Florasprout. What is its function?',
            sentencePre: 'It has tough bark armor to ',
            sentencePost: ' gentle forest creatures from predators.',
            options: [
              { text: 'protect and shield', correct: true, hint: 'Heavy natural bark absorbs impacts to protect allies!' },
              { text: 'burn dry leaves', correct: false, hint: 'Florasprout protects plants, it never burns leaves!' },
              { text: 'fly to space', correct: false, hint: 'Trees are rooted deeply in the rich earth ground!' }
            ],
            explanation: 'It has tough bark armor to protect and shield gentle forest creatures from predators!'
          }
        ],
        teleprompter: [
          'Welcome to the Evolution Lab! Today we analyzed the ancient Florasprout.',
          'It grows from a small seedling into an ancient forest guardian.',
          'It has tough bark armor to protect the emerald grove and shield wildlife!'
        ]
      },

      {
        id: 'astralight',
        name: 'Astralight',
        element: 'Astral (Cosmic)',
        elementIcon: '✨',
        elementBadge: '✨ Cosmic Sovereign',
        elementBg: 'rgba(168, 85, 247, 0.2)',
        borderColor: '#a855f7',
        accentColor: '#9333ea',
        habitat: 'Starlight Crater',
        habitatIcon: '🌌',
        feature: 'orbital star rings & crystal crest',
        speechIntro: 'Astralight is a cosmic marvel. It evolves from a celestial star spark into a stellar astral sovereign!',
        currentStage: 'ultimate',
        imageSrc: 'assets/astralight_stage_ultimate.webp',
        stages: [
          {
            stageId: 'baby',
            stageName: 'Star Spark',
            level: 'Stage 1 (Baby)',
            imageSrc: 'assets/astralight_stage_baby.webp',
            weight: '2 kg',
            height: '0.3 m',
            description: 'A floating orb of starlight that pulses with curious interstellar energy.'
          },
          {
            stageId: 'growing',
            stageName: 'Cosmic Wanderer',
            level: 'Stage 2 (Growing)',
            imageSrc: 'assets/astralight_stage_growing.webp',
            weight: '120 kg',
            height: '1.7 m',
            description: 'Surrounded by spinning meteor rings that bend local gravity.'
          },
          {
            stageId: 'ultimate',
            stageName: 'Astral Celestial Sovereign',
            level: 'Stage 3 (Ultimate)',
            imageSrc: 'assets/astralight_stage_ultimate.webp',
            weight: '1,400 kg',
            height: '4.2 m',
            description: 'A master of gravitational energy that channels stellar power from deep space.'
          }
        ],
        stats: {
          power: 92,
          agility: 88,
          affinity: 99
        },
        workbenchTasks: [
          {
            id: 'al-t1',
            type: 'growth',
            prompt: 'Decode the cosmic ascension cycle! How does Astralight transform?',
            sentencePre: 'The Astralight grows from a tiny spark into a ',
            sentencePost: ' cosmic sovereign.',
            options: [
              { text: 'celestial', correct: true, hint: 'Celestial relates to the beauty and mysteries of the stars!' },
              { text: 'wooden', correct: false, hint: 'Astralight is composed of pure starlight, not wooden planks!' },
              { text: 'muddy', correct: false, hint: 'Astralight hovers in the stratosphere above mud and dirt!' }
            ],
            explanation: 'The Astralight grows from a tiny spark into a celestial cosmic sovereign!'
          },
          {
            id: 'al-t2',
            type: 'adaptation',
            prompt: 'Look at the spinning crystal rings orbiting Astralight. What is their function?',
            sentencePre: 'It has orbital crystal rings to ',
            sentencePost: ' pure cosmic energy from passing meteor showers.',
            options: [
              { text: 'harness and channel', correct: true, hint: 'Crystals concentrate and channel glowing radiant light!' },
              { text: 'cook soup pots', correct: false, hint: 'Cosmic crystals conduct gravitational energy, not cooking stoves!' },
              { text: 'row ocean boats', correct: false, hint: 'Astralight floats effortlessly through zero-gravity space!' }
            ],
            explanation: 'It has orbital crystal rings to harness and channel pure cosmic energy!'
          }
        ],
        teleprompter: [
          'Welcome to the Evolution Lab! Today we observed the cosmic Astralight.',
          'It grows from a tiny star spark into a celestial cosmic sovereign.',
          'It has orbital crystal rings to harness energy and illuminate the night sky!'
        ]
      },

      {
        id: 'sparktail',
        name: 'Sparktail',
        element: 'Spark (Electric)',
        elementIcon: '⚡',
        elementBadge: '⚡ Electric Dynamo',
        elementBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        accentColor: '#d97706',
        habitat: 'Thunder Canyon',
        habitatIcon: '🌩️',
        feature: 'lightning tail & conductive prongs',
        speechIntro: 'Sparktail is an electric powerhouse. It evolves from a volt nibbler into a thunder storm dragon!',
        currentStage: 'ultimate',
        imageSrc: 'assets/sparktail_stage_ultimate.webp',
        stages: [
          {
            stageId: 'baby',
            stageName: 'Volt Nibbler',
            level: 'Stage 1 (Baby)',
            imageSrc: 'assets/sparktail_stage_baby.webp',
            weight: '7 kg',
            height: '0.4 m',
            description: 'An energetic creature that discharges harmless static sparks when excited.'
          },
          {
            stageId: 'growing',
            stageName: 'Shock Striker',
            level: 'Stage 2 (Growing)',
            imageSrc: 'assets/sparktail_stage_growing.webp',
            weight: '140 kg',
            height: '1.8 m',
            description: 'Runs at lightning speeds and stores high voltage in its jagged tail.'
          },
          {
            stageId: 'ultimate',
            stageName: 'Thunder Storm Dragon',
            level: 'Stage 3 (Ultimate)',
            imageSrc: 'assets/sparktail_stage_ultimate.webp',
            weight: '1,650 kg',
            height: '4.5 m',
            description: 'A terrifying dynamo capable of generating lightning storms across canyons.'
          }
        ],
        stats: {
          power: 94,
          agility: 98,
          affinity: 86
        },
        workbenchTasks: [
          {
            id: 'st-t1',
            type: 'growth',
            prompt: 'Analyze the voltage growth progression! What does the Volt Nibbler become?',
            sentencePre: 'The Sparktail grows from a volt nibbler into a ',
            sentencePost: ' storm dragon.',
            options: [
              { text: 'thunderous', correct: true, hint: 'Thunderous describes mighty acoustic roaring power like lightning!' },
              { text: 'silent', correct: false, hint: 'Lightning cracks with massive roaring sonic booms!' },
              { text: 'sleeping', correct: false, hint: 'Electric dynamos buzz with energetic power!' }
            ],
            explanation: 'The Sparktail grows from a volt nibbler into a thunderous storm dragon!'
          },
          {
            id: 'st-t2',
            type: 'adaptation',
            prompt: 'Inspect the sharp jagged prongs on Sparktail’s tail. Why are they charged?',
            sentencePre: 'It has a conductive lightning tail to ',
            sentencePost: ' high-voltage electricity during sudden storms.',
            options: [
              { text: 'charge and discharge', correct: true, hint: 'Capacitors and lightning conductors store electrical charges!' },
              { text: 'catch river salmon', correct: false, hint: 'Sparktail is an electric canyon predator, not a fishing bear!' },
              { text: 'sweep dust bunnies', correct: false, hint: 'Lightning bolts generate power, not cleaning brooms!' }
            ],
            explanation: 'It has a conductive lightning tail to charge and discharge high-voltage electricity!'
          }
        ],
        teleprompter: [
          'Welcome to the Evolution Lab! Today we analyzed the electric Sparktail.',
          'It grows from a small volt nibbler into a thunderous storm dragon.',
          'It has a conductive lightning tail to charge high-voltage energy and roar across canyons!'
        ]
      }
    ]
  };

  root.MONSTER_EVOLUTION_DATA = MONSTER_EVOLUTION_DATA;
})(typeof window !== 'undefined' ? window : global);
