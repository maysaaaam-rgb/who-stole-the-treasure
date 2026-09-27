/**
 * FANTASY CREATURES & MAGICAL HABITATS — CURRICULUM DATA
 * Primary ESL / CLIL • Grade 3 | CEFR A1 | Ages 7–10
 * Focus: "It has [feature] to [action]" & "It needs [habitat]"
 */
(function(root) {
  'use strict';

  const FANTASY_DATA = {
    meta: {
      id: 'fantasy-creatures',
      title: 'Fantasy Creatures & Magical Habitats',
      subtitle: 'Mythical Guardians • Habitats • Adaptations',
      grade: 'Grade 3',
      cefr: 'A1',
      age: 'Ages 7–10',
      grammarStructures: [
        'It has [feature] to [action]',
        'It needs [habitat]'
      ],
      lexicon: [
        'dragon', 'fairy', 'unicorn', 'griffin',
        'wings', 'horn', 'claws',
        'cave', 'forest', 'mountain'
      ],
      totalXP: 160
    },

    creatures: [
      {
        id: 'dragon',
        name: 'Fire Dragon',
        species: 'Draco Magnus',
        element: 'Ember',
        accentColor: '#f97316',
        badgeBg: 'rgba(249, 115, 22, 0.2)',
        borderColor: '#f97316',
        habitat: 'cave',
        habitatName: 'Volcanic Cave',
        habitatIcon: '🌋',
        feature: 'wings',
        featureName: 'Flame Wings',
        action: 'fly high',
        actionText: 'fly high above the smoke',
        speechIntro: 'The Fire Dragon has wings to fly high. It needs a warm volcanic cave!',
        teleprompter: [
          'This is our guardian: Fire Dragon.',
          'It has wings to fly high!',
          'It needs a warm cave to protect the realm.'
        ],
        stats: {
          power: 95,
          speed: 88,
          defense: 90
        },
        discoveryFacts: {
          featureFact: 'Large ruby wings allow it to soar over blazing peaks.',
          habitatFact: 'Sleeps inside deep caves warmed by molten rock.',
          diet: 'Fire crystals and roasted volcanic fruits.'
        },
        workbenchTasks: [
          {
            id: 'd-t1',
            type: 'feature',
            prompt: 'Look at the Fire Dragon! Complete the adaptation sentence:',
            sentencePre: 'The dragon has ',
            sentencePost: ' to fly high into the sky.',
            options: [
              { text: 'wings', correct: true, hint: 'Dragon uses these to soar in the air!' },
              { text: 'fins', correct: false, hint: 'Fins are for swimming underwater, not flying!' },
              { text: 'wheels', correct: false, hint: 'Dragons are magical creatures, not cars!' }
            ],
            explanation: 'The dragon has wings to fly high!'
          },
          {
            id: 'd-t2',
            type: 'purpose',
            prompt: 'Why does the dragon have strong wings?',
            sentencePre: 'It has wings ',
            sentencePost: ' across the stormy mountains.',
            options: [
              { text: 'to fly high', correct: true, hint: 'Use TO + VERB for the creature\'s purpose!' },
              { text: 'for sleep', correct: false, hint: 'Remember the formula: TO + VERB!' },
              { text: 'to swim fast', correct: false, hint: 'Dragons fly through clouds, not oceans!' }
            ],
            explanation: 'The dragon has wings to fly high!'
          },
          {
            id: 'd-t3',
            type: 'habitat',
            prompt: 'The dragon is shivering from the cold wind. What habitat does it need?',
            sentencePre: 'The dragon needs a ',
            sentencePost: ' to stay warm.',
            options: [
              { text: 'warm cave', correct: true, hint: 'Caves shelter large fire dragons!' },
              { text: 'frozen lake', correct: false, hint: 'Frozen water will put out its dragon flames!' },
              { text: 'city apartment', correct: false, hint: 'Dragons are way too big for an apartment!' }
            ],
            explanation: 'The dragon needs a warm cave!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="dragonAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff7a00" stop-opacity="0.75" />
              <stop offset="60%" stop-color="#e11d48" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="dragonScales" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fb923c" />
              <stop offset="50%" stop-color="#ea580c" />
              <stop offset="100%" stop-color="#9a3412" />
            </linearGradient>
            <linearGradient id="wingMembrane" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="40%" stop-color="#f97316" />
              <stop offset="100%" stop-color="#b91c1c" />
            </linearGradient>
            <filter id="dragonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#f97316" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="95" r="75" fill="url(#dragonAura)"/>
          <!-- Wings Back -->
          <g filter="url(#dragonGlow)">
            <!-- Left Wing -->
            <path d="M 90 85 Q 40 40 20 65 Q 45 80 50 110 Q 75 95 90 85 Z" fill="url(#wingMembrane)" opacity="0.95"/>
            <path d="M 90 85 Q 40 40 20 65 M 35 55 Q 50 85 55 105" stroke="#fef08a" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Right Wing -->
            <path d="M 110 85 Q 160 40 180 65 Q 155 80 150 110 Q 125 95 110 85 Z" fill="url(#wingMembrane)" opacity="0.95"/>
            <path d="M 110 85 Q 160 40 180 65 M 165 55 Q 150 85 145 105" stroke="#fef08a" stroke-width="2" fill="none" stroke-linecap="round"/>
          </g>
          <!-- Tail -->
          <path d="M 100 145 Q 60 165 40 150 Q 30 140 35 130 Q 42 142 60 145 Z" fill="url(#dragonScales)" stroke="#7c2d12" stroke-width="1.5"/>
          <polygon points="32,130 40,140 28,145" fill="#f59e0b"/>
          <!-- Body Torso -->
          <ellipse cx="100" cy="115" rx="34" ry="42" fill="url(#dragonScales)" stroke="#7c2d12" stroke-width="2"/>
          <!-- Belly Plates -->
          <path d="M 88 95 Q 100 92 112 95 Q 115 135 100 142 Q 85 135 88 95 Z" fill="#fde047" opacity="0.9"/>
          <line x1="89" y1="105" x2="111" y2="105" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="88" y1="117" x2="112" y2="117" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="90" y1="129" x2="110" y2="129" stroke="#ca8a04" stroke-width="1.5"/>
          <!-- Feet Claws -->
          <ellipse cx="78" cy="148" rx="12" ry="7" fill="#c2410c"/>
          <circle cx="72" cy="151" r="2.5" fill="#fef08a"/>
          <circle cx="78" cy="153" r="2.5" fill="#fef08a"/>
          <circle cx="84" cy="151" r="2.5" fill="#fef08a"/>
          <ellipse cx="122" cy="148" rx="12" ry="7" fill="#c2410c"/>
          <circle cx="116" cy="151" r="2.5" fill="#fef08a"/>
          <circle cx="122" cy="153" r="2.5" fill="#fef08a"/>
          <circle cx="128" cy="151" r="2.5" fill="#fef08a"/>
          <!-- Head -->
          <g filter="url(#dragonGlow)">
            <!-- Horns -->
            <path d="M 88 56 Q 75 30 65 24 Q 78 38 84 52 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
            <path d="M 112 56 Q 125 30 135 24 Q 122 38 116 52 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
            <!-- Head Base -->
            <ellipse cx="100" cy="65" rx="26" ry="22" fill="url(#dragonScales)" stroke="#7c2d12" stroke-width="2"/>
            <!-- Snout -->
            <path d="M 86 68 Q 100 64 114 68 Q 112 82 100 84 Q 88 82 86 68 Z" fill="#f97316"/>
            <!-- Nostrils -->
            <circle cx="95" cy="74" r="2" fill="#7c2d12"/>
            <circle cx="105" cy="74" r="2" fill="#7c2d12"/>
            <!-- Little Flame Puff -->
            <path d="M 100 77 Q 102 85 98 89 Q 105 85 100 77 Z" fill="#fde047" opacity="0.8"/>
            <!-- Eyes -->
            <ellipse cx="88" cy="58" rx="6" ry="7" fill="#fef08a"/>
            <ellipse cx="88" cy="58" rx="2.5" ry="5" fill="#090d16"/>
            <circle cx="87" cy="56" r="1.5" fill="#ffffff"/>
            <ellipse cx="112" cy="58" rx="6" ry="7" fill="#fef08a"/>
            <ellipse cx="112" cy="58" rx="2.5" ry="5" fill="#090d16"/>
            <circle cx="111" cy="56" r="1.5" fill="#ffffff"/>
          </g>
        </svg>`
      },
      {
        id: 'fairy',
        name: 'Crystal Fairy',
        species: 'Sylpha Lumina',
        element: 'Verdant',
        accentColor: '#10b981',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        habitat: 'forest',
        habitatName: 'Secret Forest',
        habitatIcon: '🌲',
        feature: 'glowing wings',
        featureName: 'Prism Wings',
        action: 'heal plants',
        actionText: 'heal enchanted plants and flowers',
        speechIntro: 'The Crystal Fairy has glowing wings to heal plants. It needs a secret enchanted forest!',
        teleprompter: [
          'This is our guardian: Crystal Fairy.',
          'It has glowing wings to heal plants!',
          'It needs a secret forest to protect the realm.'
        ],
        stats: {
          power: 82,
          speed: 94,
          defense: 76
        },
        discoveryFacts: {
          featureFact: 'Shimmering gossamer wings sprinkle healing fairy dust.',
          habitatFact: 'Shelters under giant bioluminescent moss mushrooms in deep woods.',
          diet: 'Dewdrops and sweet flower nectar.'
        },
        workbenchTasks: [
          {
            id: 'f-t1',
            type: 'feature',
            prompt: 'Look at the Crystal Fairy! What does it have?',
            sentencePre: 'The fairy has ',
            sentencePost: ' to flutter between ancient flowers.',
            options: [
              { text: 'glowing wings', correct: true, hint: 'Translucent wings give her gentle flight!' },
              { text: 'heavy armor', correct: false, hint: 'Heavy armor is for knights, not light fairies!' },
              { text: 'sharp claws', correct: false, hint: 'Claws belong to ferocious predators!' }
            ],
            explanation: 'The fairy has glowing wings to heal plants!'
          },
          {
            id: 'f-t2',
            type: 'purpose',
            prompt: 'Why does the fairy sprinkle sparkling dust on the garden?',
            sentencePre: 'She has magical dust ',
            sentencePost: ' after dry summers.',
            options: [
              { text: 'to heal plants', correct: true, hint: 'TO + VERB expresses purpose!' },
              { text: 'to break rocks', correct: false, hint: 'Fairies heal nature, they do not smash rocks!' },
              { text: 'for eating', correct: false, hint: 'Remember the formula: TO + VERB!' }
            ],
            explanation: 'The fairy has glowing wings to heal plants!'
          },
          {
            id: 'f-t3',
            type: 'habitat',
            prompt: 'Where can the fairy find peace and ancient blossoms?',
            sentencePre: 'The fairy needs a ',
            sentencePost: ' with tall glowing trees.',
            options: [
              { text: 'secret forest', correct: true, hint: 'Forests provide the flowers and calm she needs!' },
              { text: 'noisy airport', correct: false, hint: 'Airplanes and jet fuel would hurt her delicate wings!' },
              { text: 'desert dune', correct: false, hint: 'There are no flowering plants on dry sand dunes!' }
            ],
            explanation: 'The fairy needs a secret forest!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fairyAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.8" />
              <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="fairyWingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#a7f3d0" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#67e8f9" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#c084fc" stop-opacity="0.85" />
            </linearGradient>
            <linearGradient id="fairyDressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <filter id="fairyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#34d399" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura & Stars -->
          <circle cx="100" cy="100" r="75" fill="url(#fairyAura)"/>
          <circle cx="45" cy="60" r="2" fill="#fef08a"/>
          <circle cx="155" cy="55" r="2.5" fill="#fef08a"/>
          <circle cx="50" cy="140" r="2" fill="#a7f3d0"/>
          <circle cx="150" cy="135" r="2" fill="#67e8f9"/>
          <!-- Gossamer Wings -->
          <g filter="url(#fairyGlow)">
            <!-- Top Left Wing -->
            <path d="M 95 80 C 40 20 20 50 30 90 C 45 105 75 95 95 85 Z" fill="url(#fairyWingGrad)" stroke="#ecfdf5" stroke-width="1.5"/>
            <!-- Bottom Left Wing -->
            <path d="M 94 92 C 50 95 35 125 50 145 C 65 145 80 120 94 95 Z" fill="url(#fairyWingGrad)" opacity="0.85"/>
            <!-- Top Right Wing -->
            <path d="M 105 80 C 160 20 180 50 170 90 C 155 105 125 95 105 85 Z" fill="url(#fairyWingGrad)" stroke="#ecfdf5" stroke-width="1.5"/>
            <!-- Bottom Right Wing -->
            <path d="M 106 92 C 150 95 165 125 150 145 C 135 145 120 120 106 95 Z" fill="url(#fairyWingGrad)" opacity="0.85"/>
          </g>
          <!-- Fairy Body Dress -->
          <path d="M 94 95 L 106 95 L 118 145 Q 100 152 82 145 Z" fill="url(#fairyDressGrad)" stroke="#065f46" stroke-width="1.5"/>
          <!-- Wand in hand -->
          <line x1="120" y1="110" x2="145" y2="90" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
          <polygon points="145,86 148,90 145,94 142,90" fill="#fde047"/>
          <!-- Little Arms -->
          <path d="M 92 100 Q 75 110 82 118" stroke="#fcd34d" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M 108 100 Q 120 105 125 112" stroke="#fcd34d" stroke-width="3" fill="none" stroke-linecap="round"/>
          <!-- Head -->
          <ellipse cx="100" cy="72" rx="16" ry="17" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>
          <!-- Hair & Tiara -->
          <path d="M 84 72 C 84 50 116 50 116 72 C 116 76 112 60 100 60 C 88 60 84 76 84 72 Z" fill="#9333ea"/>
          <!-- Tiara -->
          <path d="M 92 58 L 96 52 L 100 56 L 104 52 L 108 58 Z" fill="#38bdf8"/>
          <!-- Eyes -->
          <circle cx="94" cy="73" r="3" fill="#0f172a"/>
          <circle cx="93" cy="72" r="1" fill="#ffffff"/>
          <circle cx="106" cy="73" r="3" fill="#0f172a"/>
          <circle cx="105" cy="72" r="1" fill="#ffffff"/>
          <!-- Smile -->
          <path d="M 97 80 Q 100 83 103 80" stroke="#b45309" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- Rosy Cheeks -->
          <circle cx="91" cy="77" r="2.5" fill="#f43f5e" opacity="0.6"/>
          <circle cx="109" cy="77" r="2.5" fill="#f43f5e" opacity="0.6"/>
        </svg>`
      },
      {
        id: 'unicorn',
        name: 'Starlight Unicorn',
        species: 'Equus Celestia',
        element: 'Astral',
        accentColor: '#38bdf8',
        badgeBg: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#38bdf8',
        habitat: 'forest',
        habitatName: 'Mystic Forest',
        habitatIcon: '🌌',
        feature: 'magic horn',
        featureName: 'Prismatic Spiral Horn',
        action: 'purify water',
        actionText: 'purify ancient springs and crystal rivers',
        speechIntro: 'The Starlight Unicorn has a magic horn to purify water. It needs a peaceful mystic forest!',
        teleprompter: [
          'This is our guardian: Starlight Unicorn.',
          'It has a magic horn to purify water!',
          'It needs a mystic forest to protect the realm.'
        ],
        stats: {
          power: 89,
          speed: 96,
          defense: 84
        },
        discoveryFacts: {
          featureFact: 'The spiral golden horn cleanses tainted waters with a single touch.',
          habitatFact: 'Roams alongside moonlit streams under silvery willow canopies.',
          diet: 'Moon petals, silver oats, and pure spring water.'
        },
        workbenchTasks: [
          {
            id: 'u-t1',
            type: 'feature',
            prompt: 'Observe the majestic unicorn! What iconic feature shines on its forehead?',
            sentencePre: 'The unicorn has a ',
            sentencePost: ' that gleams with pure starlight.',
            options: [
              { text: 'magic horn', correct: true, hint: 'The spiral horn is the unicorn\'s signature gift!' },
              { text: 'dragon tail', correct: false, hint: 'Unicorns have soft silky tails, not scaled dragon tails!' },
              { text: 'metal helmet', correct: false, hint: 'No helmet needed; its magic horn shines brightly!' }
            ],
            explanation: 'The unicorn has a magic horn to purify water!'
          },
          {
            id: 'u-t2',
            type: 'purpose',
            prompt: 'Why does the unicorn dip its glowing horn into the river?',
            sentencePre: 'It has a horn ',
            sentencePost: ' so all creatures can drink safely.',
            options: [
              { text: 'to purify water', correct: true, hint: 'TO + VERB describes its magical purpose!' },
              { text: 'to make waves', correct: false, hint: 'Its duty is healing and purifying water!' },
              { text: 'for sleep', correct: false, hint: 'Formula reminder: TO + VERB!' }
            ],
            explanation: 'The unicorn has a horn to purify water!'
          },
          {
            id: 'u-t3',
            type: 'habitat',
            prompt: 'Where does the unicorn find pure streams and starlight?',
            sentencePre: 'The unicorn needs a ',
            sentencePost: ' away from busy city streets.',
            options: [
              { text: 'mystic forest', correct: true, hint: 'A quiet mystic forest protects its pure spring!' },
              { text: 'crowded subway', correct: false, hint: 'Trains and turnstiles are no place for a unicorn!' },
              { text: 'smoky factory', correct: false, hint: 'Pollution harms its pure healing coat!' }
            ],
            explanation: 'The unicorn needs a mystic forest!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="unicornAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.8" />
              <stop offset="50%" stop-color="#c084fc" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="unicornCoat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="60%" stop-color="#f0f9ff" />
              <stop offset="100%" stop-color="#e0e7ff" />
            </linearGradient>
            <linearGradient id="unicornMane" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="50%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="#fbbf24" />
            </linearGradient>
            <linearGradient id="unicornHornGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="50%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
            <filter id="unicornGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.55"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="100" r="75" fill="url(#unicornAura)"/>
          <!-- Tail -->
          <path d="M 55 125 C 30 135 25 160 38 175 C 46 160 52 145 62 135 Z" fill="url(#unicornMane)"/>
          <!-- Back Hooves -->
          <rect x="62" y="138" width="10" height="24" rx="4" fill="#e0e7ff"/>
          <rect x="62" y="156" width="10" height="6" rx="2" fill="#fbbf24"/>
          <rect x="80" y="138" width="10" height="24" rx="4" fill="#e0e7ff"/>
          <rect x="80" y="156" width="10" height="6" rx="2" fill="#fbbf24"/>
          <!-- Body Torso -->
          <ellipse cx="95" cy="125" rx="38" ry="24" fill="url(#unicornCoat)" stroke="#93c5fd" stroke-width="1.5"/>
          <!-- Front Hooves -->
          <rect x="115" y="138" width="10" height="24" rx="4" fill="#e0e7ff"/>
          <rect x="115" y="156" width="10" height="6" rx="2" fill="#fbbf24"/>
          <rect x="130" y="138" width="10" height="24" rx="4" fill="#e0e7ff"/>
          <rect x="130" y="156" width="10" height="6" rx="2" fill="#fbbf24"/>
          <!-- Neck & Mane -->
          <path d="M 112 120 L 132 80 L 146 88 L 130 128 Z" fill="url(#unicornCoat)"/>
          <path d="M 120 75 Q 110 95 105 122 Q 115 110 128 85 Z" fill="url(#unicornMane)"/>
          <!-- Head -->
          <g filter="url(#unicornGlow)">
            <!-- Head Shape -->
            <path d="M 126 80 Q 145 62 160 74 Q 165 88 148 94 Q 132 96 126 80 Z" fill="url(#unicornCoat)" stroke="#93c5fd" stroke-width="1.5"/>
            <!-- Ears -->
            <polygon points="132,74 136,58 142,72" fill="#ffffff" stroke="#93c5fd" stroke-width="1"/>
            <polygon points="135,72 137,62 140,71" fill="#f472b6"/>
            <!-- Magic Spiral Horn -->
            <polygon points="144,70 174,32 152,66" fill="url(#unicornHornGrad)"/>
            <line x1="148" y1="64" x2="156" y2="58" stroke="#d97706" stroke-width="1.5"/>
            <line x1="156" y1="52" x2="164" y2="46" stroke="#d97706" stroke-width="1.5"/>
            <!-- Eye -->
            <ellipse cx="145" cy="80" rx="4" ry="5" fill="#3b82f6"/>
            <circle cx="144" cy="78" r="1.5" fill="#ffffff"/>
            <path d="M 141 74 Q 145 72 149 74" stroke="#1e3a8a" stroke-width="1.5" fill="none"/>
            <!-- Muzzle -->
            <circle cx="158" cy="86" r="1.5" fill="#ec4899"/>
          </g>
        </svg>`
      },
      {
        id: 'griffin',
        name: 'Sun Griffin',
        species: 'Gryphus Solaris',
        element: 'Spark',
        accentColor: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        habitat: 'mountain',
        habitatName: 'High Mountain',
        habitatIcon: '🏔️',
        feature: 'sharp claws',
        featureName: 'Solar Talons & Beak',
        action: 'catch prey',
        actionText: 'catch prey and protect mountain peaks',
        speechIntro: 'The Sun Griffin has sharp claws to catch prey. It needs a high rocky mountain!',
        teleprompter: [
          'This is our guardian: Sun Griffin.',
          'It has sharp claws to catch prey!',
          'It needs a high mountain to protect the realm.'
        ],
        stats: {
          power: 96,
          speed: 91,
          defense: 93
        },
        discoveryFacts: {
          featureFact: 'Razor-sharp golden eagle talons firmly grip sheer rocky crags.',
          habitatFact: 'Builds golden nests upon highest blizzard-swept alpine ridges.',
          diet: 'Mountain trout and wild storm herbs.'
        },
        workbenchTasks: [
          {
            id: 'g-t1',
            type: 'feature',
            prompt: 'Examine the Sun Griffin! What powerful weapons are on its front feet?',
            sentencePre: 'The griffin has ',
            sentencePost: ' to grip rocky cliffs and hunt.',
            options: [
              { text: 'sharp claws', correct: true, hint: 'Sharp claws (talons) help it grip and catch prey!' },
              { text: 'soft pads', correct: false, hint: 'Soft paws cannot grip steep mountain ice!' },
              { text: 'glass slippers', correct: false, hint: 'Cinderella wears glass slippers, not a fierce griffin!' }
            ],
            explanation: 'The griffin has sharp claws to catch prey!'
          },
          {
            id: 'g-t2',
            type: 'purpose',
            prompt: 'Why does the griffin dive swiftly from the clouds?',
            sentencePre: 'It has claws and speed ',
            sentencePost: ' across the alpine valley.',
            options: [
              { text: 'to catch prey', correct: true, hint: 'TO + VERB defines its purpose in nature!' },
              { text: 'to drink juice', correct: false, hint: 'Griffins hunt for survival!' },
              { text: 'for sitting', correct: false, hint: 'Remember the formula: TO + VERB!' }
            ],
            explanation: 'The griffin has sharp claws to catch prey!'
          },
          {
            id: 'g-t3',
            type: 'habitat',
            prompt: 'Where does the sovereign griffin build its fortress nest?',
            sentencePre: 'The griffin needs a ',
            sentencePost: ' to watch over the entire realm.',
            options: [
              { text: 'high mountain', correct: true, hint: 'High mountains give it an eagle-eye vantage point!' },
              { text: 'shallow pond', correct: false, hint: 'Ponds are for ducks and frogs, not giant griffins!' },
              { text: 'dark basement', correct: false, hint: 'Griffins require open sky and roaring winds!' }
            ],
            explanation: 'The griffin needs a high mountain!'
          }
        ],
        svg: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="griffinAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fde047" stop-opacity="0.8" />
              <stop offset="55%" stop-color="#f59e0b" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="griffinGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#a16207" />
            </linearGradient>
            <linearGradient id="lionBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#92400e" />
            </linearGradient>
            <filter id="griffinGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#eab308" flood-opacity="0.6"/>
            </filter>
          </defs>
          <!-- Aura -->
          <circle cx="100" cy="100" r="75" fill="url(#griffinAura)"/>
          <!-- Wings -->
          <g filter="url(#griffinGlow)">
            <!-- Left Wing -->
            <path d="M 85 90 C 35 45 25 70 30 110 C 50 115 70 105 85 90 Z" fill="url(#griffinGold)" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- Right Wing -->
            <path d="M 115 90 C 165 45 175 70 170 110 C 150 115 130 105 115 90 Z" fill="url(#griffinGold)" stroke="#ca8a04" stroke-width="1.5"/>
          </g>
          <!-- Lion Body (Back) -->
          <ellipse cx="100" cy="125" rx="36" ry="26" fill="url(#lionBodyGrad)" stroke="#78350f" stroke-width="1.5"/>
          <!-- Lion Tail with Tuft -->
          <path d="M 66 128 C 45 130 35 155 45 168" stroke="#92400e" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="46" cy="168" rx="7" ry="5" fill="#ca8a04"/>
          <!-- Back Lion Legs -->
          <ellipse cx="78" cy="148" rx="9" ry="12" fill="#92400e"/>
          <ellipse cx="122" cy="148" rx="9" ry="12" fill="#92400e"/>
          <!-- Front Eagle Talons/Claws -->
          <path d="M 86 135 L 82 158" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
          <polygon points="76,160 82,157 80,165" fill="#fef08a"/>
          <polygon points="82,160 86,157 85,166" fill="#fef08a"/>
          <polygon points="88,160 92,157 91,165" fill="#fef08a"/>
          <path d="M 114 135 L 118 158" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
          <polygon points="112,160 116,157 115,165" fill="#fef08a"/>
          <polygon points="118,160 122,157 121,166" fill="#fef08a"/>
          <polygon points="124,160 128,157 127,165" fill="#fef08a"/>
          <!-- Eagle Head & Feather Crest -->
          <g filter="url(#griffinGlow)">
            <!-- Feather Ruff -->
            <path d="M 85 95 Q 100 115 115 95 Q 100 80 85 95 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- Eagle Head -->
            <circle cx="100" cy="72" r="22" fill="url(#griffinGold)" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- Feather Ears/Crest -->
            <polygon points="88,54 94,40 98,52" fill="#ca8a04"/>
            <polygon points="112,54 106,40 102,52" fill="#ca8a04"/>
            <!-- Hooked Golden Beak -->
            <path d="M 94 72 Q 100 68 106 72 Q 108 86 100 92 Q 95 84 94 72 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
            <path d="M 100 76 Q 100 92 98 90" stroke="#78350f" stroke-width="1.5"/>
            <!-- Fierce Eagle Eyes -->
            <ellipse cx="90" cy="68" rx="5" ry="6" fill="#090d16"/>
            <circle cx="89" cy="66" r="2" fill="#fef08a"/>
            <ellipse cx="110" cy="68" rx="5" ry="6" fill="#090d16"/>
            <circle cx="109" cy="66" r="2" fill="#fef08a"/>
          </g>
        </svg>`
      }
    ],

    habitats: {
      cave: {
        id: 'cave',
        name: 'Volcanic Cave',
        element: 'Ember',
        icon: '🌋',
        desc: 'Deep underground caverns heated by glowing magma and volcanic embers.',
        color: '#f97316'
      },
      forest: {
        id: 'forest',
        name: 'Enchanted Forest',
        element: 'Verdant & Astral',
        icon: '🌲',
        desc: 'Ancient woods with giant glowing moss, clean streams, and star-canopied trees.',
        color: '#10b981'
      },
      mountain: {
        id: 'mountain',
        name: 'High Alpine Mountain',
        element: 'Spark',
        icon: '🏔️',
        desc: 'Towering blizzard peaks kissing the open clouds where only griffins soar.',
        color: '#f59e0b'
      }
    }
  };

  root.FANTASY_DATA = FANTASY_DATA;
})(typeof window !== 'undefined' ? window : global);
