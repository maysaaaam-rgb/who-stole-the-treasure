/**
 * BRAIN EXPLORERS: HOW YOUR BRAIN READS — CURRICULUM & ENGINE DATA
 * Grade 3-4 | CEFR A1+ / Early A2 | CLIL Human Biology & Neuroscience
 * Production-Grade Cyber-Biology Architecture
 */

(function(root) {
  'use strict';

  const BRAIN_DATA = {
    meta: {
      id: 'brain-explorers',
      title: '🧠 Brain Explorers: How Your Brain Reads',
      subtitle: 'Primary CLIL Neuro-Quest & Cognitive Super-Computer',
      level: 'A1 / A2',
      cefrLevel: 'A1+',
      ageGroup: '7-11',
      durationMinutes: 35,
      totalXP: 100,
      baseEnergy: 20 // The human brain consumes ~20% of resting metabolic energy
    },

    // 4 Primary Lobes + Cerebellum & Brainstem with organic vector parameters
    lobes: {
      frontal: {
        id: 'frontal',
        name: 'Frontal Lobe',
        alias: 'The Thinking & Planning Chief',
        color: '#f59e0b', // Solar Amber
        glowColor: 'rgba(245, 158, 11, 0.45)',
        region: 'Anterior Cortex (Forehead)',
        icon: '💡',
        functions: ['Thinking & Logic', 'Speaking Words Aloud', 'Problem Solving', 'Focus & Decisions'],
        primaryFormula: 'The Frontal Lobe helps us think and speak.',
        useFormula: 'We use our Frontal Lobe to solve problems and understand meaning.',
        roleInReading: 'Step 4: Understands word meaning and commands vocal cords to speak aloud.',
        badgeTitle: 'Frontal Thinker'
      },
      parietal: {
        id: 'parietal',
        name: 'Parietal Lobe',
        alias: 'The Touch & Sensory Navigator',
        color: '#10b981', // Vivid Emerald
        glowColor: 'rgba(16, 185, 129, 0.45)',
        region: 'Superior-Posterior (Crown of Head)',
        icon: '🖐️',
        functions: ['Touch & Texture', 'Taste Sensation', 'Spatial Tracking', 'Book Handling'],
        primaryFormula: 'The Parietal Lobe helps us feel touch and track words.',
        useFormula: 'We use our Parietal Lobe to track lines of text from left to right.',
        roleInReading: 'Step 3: Keeps track of word order and controls finger/hand coordination.',
        badgeTitle: 'Parietal Navigator'
      },
      occipital: {
        id: 'occipital',
        name: 'Occipital Lobe',
        alias: 'The Visual Camera',
        color: '#f43f5e', // Neon Coral / Crimson
        glowColor: 'rgba(244, 63, 94, 0.45)',
        region: 'Posterior Pole (Back of Head)',
        icon: '👁️',
        functions: ['Seeing Colors', 'Recognizing Shapes', 'Detecting Letters', 'Visual Memory'],
        primaryFormula: 'The Occipital Lobe helps us see letters and words.',
        useFormula: 'We use our Occipital Lobe to capture the curved shapes of letters.',
        roleInReading: 'Step 1: Eyes send visual signals to decode the ink lines and shapes on page.',
        badgeTitle: 'Occipital Visionary'
      },
      temporal: {
        id: 'temporal',
        name: 'Temporal Lobe',
        alias: 'The Phonics Sound Studio',
        color: '#a855f7', // Electric Violet
        glowColor: 'rgba(168, 85, 247, 0.45)',
        region: 'Lateral Sides (Near Ears)',
        icon: '👂',
        functions: ['Hearing Sounds', 'Matching Phonics / Phonemes', 'Music & Rhythm', 'Language Memory'],
        primaryFormula: 'The Temporal Lobe helps us hear sounds and phonics.',
        useFormula: 'We use our Temporal Lobe to match letters to sounds like /k/ - /æ/ - /t/.',
        roleInReading: 'Step 2: Connects written letter shapes to phonetic voice sounds in memory.',
        badgeTitle: 'Temporal Listener'
      }
    },

    // Additional anatomical structures for educational depth
    structures: {
      cerebellum: {
        name: 'Cerebellum',
        color: '#64748b',
        role: 'Balance, posture, and smooth motor coordination.'
      },
      brainstem: {
        name: 'Brainstem',
        color: '#475569',
        role: 'Involuntary vital life functions (heartbeat, breathing, and blood pressure).'
      }
    },

    // PHASE 1: SENSORY SORTING ARCADE (6 Dynamic Chips)
    phase1_atlas: {
      title: 'PHASE 1: THE NEURO-ATLAS',
      subtitle: 'Sort sensory impulses to their anatomical control centers on the cortex hologram!',
      instructions: 'Click or drag each sensory chip to the matching brain lobe. Listen to the audio clues!',
      targetFormula: 'The [lobe] helps us [verb]. We use our [lobe] to [verb].',
      chips: [
        {
          id: 'chip-rainbow',
          name: 'Rainbow Letters',
          icon: '👁️',
          targetLobe: 'occipital',
          targetName: 'Occipital Lobe',
          color: '#f43f5e',
          description: 'Recognizing colorful letters: curved C, tall A, and crossed T.',
          audioPrompt: 'Looking at bright rainbow letters and bold shapes!',
          spokenFact: 'The Occipital Lobe at the back of your head helps you see letters!',
          softFailClue: 'Remember: Your eyes look forward, but seeing happens at the back of your head!'
        },
        {
          id: 'chip-phonics',
          name: 'Phoneme Sounds',
          icon: '🎧',
          targetLobe: 'temporal',
          targetName: 'Temporal Lobe',
          color: '#a855f7',
          description: 'Sounding out phonemes like /b/ - /æ/ - /t/ and musical beats.',
          audioPrompt: 'Hearing the letter sounds through your ears!',
          spokenFact: 'The Temporal Lobe near your ears helps you hear letter sounds!',
          softFailClue: 'Look near the ears! Which lobe listens to voice sounds and music?'
        },
        {
          id: 'chip-flavor',
          name: 'Ice Cream Flavor',
          icon: '🍦',
          targetLobe: 'parietal',
          targetName: 'Parietal Lobe',
          color: '#10b981',
          description: 'Tasting cold strawberry sweetness and feeling tongue sensation.',
          audioPrompt: 'Tasting cold sweet ice cream on your tongue!',
          spokenFact: 'The Parietal Lobe processes physical touch, taste, and temperature!',
          softFailClue: 'Taste and touch are sensory! Place this chip on the green crown lobe!'
        },
        {
          id: 'chip-story',
          name: 'Story Meaning',
          icon: '📖',
          targetLobe: 'frontal',
          targetName: 'Frontal Lobe',
          color: '#f59e0b',
          description: 'Understanding the story plot and thinking what happens next.',
          audioPrompt: 'Thinking about the story and solving the mystery!',
          spokenFact: 'The Frontal Lobe is your thinking engine for logic and planning!',
          softFailClue: 'Thinking and planning happen right behind your forehead!'
        },
        {
          id: 'chip-paper',
          name: 'Smooth Paper',
          icon: '✋',
          targetLobe: 'parietal',
          targetName: 'Parietal Lobe',
          color: '#10b981',
          description: 'Feeling the smooth paper cover and turning page two.',
          audioPrompt: 'Feeling the texture of the page with your fingertips!',
          spokenFact: 'The Parietal Lobe senses touch, texture, and finger position!',
          softFailClue: 'Touching and turning pages is spatial sense. Try the Parietal Lobe!'
        },
        {
          id: 'chip-speech',
          name: 'Reading Aloud',
          icon: '🗣️',
          targetLobe: 'frontal',
          targetName: 'Frontal Lobe',
          color: '#f59e0b',
          description: 'Moving your lips, jaw, and tongue to speak "Hello class!"',
          audioPrompt: 'Speaking the word aloud with your mouth and voice!',
          spokenFact: 'The Frontal Lobe contains Broca\'s area that controls speech production!',
          softFailClue: 'Speaking aloud is controlled by the executive lobe behind your forehead!'
        }
      ]
    },

    // PHASE 2: SYNAPTIC SPEED RELAY (3 Progressive Rounds under 0.3s)
    phase2_relay: {
      title: 'PHASE 2: SYNAPTIC SPEED RELAY',
      subtitle: 'Route the reading electrical signal through all 3 cortex stations in under 0.30 seconds!',
      instructions: 'Click the highlighted lobes in sequence: Occipital (See) → Temporal (Hear) → Frontal (Speak)!',
      teamworkMotto: 'Reading is a whole-team effort!',
      rounds: [
        {
          roundNumber: 1,
          word: 'C - A - T',
          pronunciation: '/kæt/',
          icon: '🐱',
          meaning: 'A furry pet that purrs',
          targetTimeSeconds: 0.30,
          steps: [
            {
              lobeId: 'occipital',
              name: 'Occipital Lobe',
              actionLabel: '1. EYES SEE LETTERS',
              formula: 'The Occipital Lobe SEES "C-A-T"',
              color: '#f43f5e'
            },
            {
              lobeId: 'temporal',
              name: 'Temporal Lobe',
              actionLabel: '2. EARS MATCH SOUNDS',
              formula: 'The Temporal Lobe HEARS /k/-/æ/-/t/',
              color: '#a855f7'
            },
            {
              lobeId: 'frontal',
              name: 'Frontal Lobe',
              actionLabel: '3. MOUTH SPEAKS "CAT!"',
              formula: 'The Frontal Lobe UNDERSTANDS & SPEAKS "CAT!"',
              color: '#f59e0b'
            }
          ]
        },
        {
          roundNumber: 2,
          word: 'B - R - A - I - N',
          pronunciation: '/breɪn/',
          icon: '🧠',
          meaning: 'Your amazing super-computer',
          targetTimeSeconds: 0.28,
          steps: [
            {
              lobeId: 'occipital',
              name: 'Occipital Lobe',
              actionLabel: '1. EYES CAPTURE "BRAIN"',
              formula: 'The Occipital Lobe scans 5 letters',
              color: '#f43f5e'
            },
            {
              lobeId: 'temporal',
              name: 'Temporal Lobe',
              actionLabel: '2. EARS BLEND /breɪn/',
              formula: 'The Temporal Lobe blends letter phonemes',
              color: '#a855f7'
            },
            {
              lobeId: 'frontal',
              name: 'Frontal Lobe',
              actionLabel: '3. MIND RECOGNIZES "BRAIN!"',
              formula: 'The Frontal Lobe decodes the word "BRAIN!"',
              color: '#f59e0b'
            }
          ]
        },
        {
          roundNumber: 3,
          word: 'L - E - A - R - N',
          pronunciation: '/lɜːn/',
          icon: '⭐',
          meaning: 'Growing new neural connections',
          targetTimeSeconds: 0.25,
          steps: [
            {
              lobeId: 'occipital',
              name: 'Occipital Lobe',
              actionLabel: '1. EYES READ "LEARN"',
              formula: 'The Occipital Lobe detects glyphs in 0.08s',
              color: '#f43f5e'
            },
            {
              lobeId: 'temporal',
              name: 'Temporal Lobe',
              actionLabel: '2. EARS HEAR /lɜːn/',
              formula: 'The Temporal Lobe routes phonemes in 0.16s',
              color: '#a855f7'
            },
            {
              lobeId: 'frontal',
              name: 'Frontal Lobe',
              actionLabel: '3. MIND MASTERED "LEARN!"',
              formula: 'The Frontal Lobe completes reading in 0.25s!',
              color: '#f59e0b'
            }
          ]
        }
      ]
    },

    // PHASE 3: NEURO-GYM & BATTERY OVERCHARGE (20% -> 100% Neuroplasticity)
    phase3_gym: {
      title: 'PHASE 3: NEURO-GYM & METABOLIC BATTERY',
      subtitle: 'Your brain burns 20% of your daily body fuel! Supercharge it to 100% with healthy neuro-habits!',
      instructions: 'Select the 4 healthy habits to thicken your neuron axon with protective myelin sheathing!',
      habits: [
        {
          id: 'habit-sleep',
          name: '9 to 10 Hours Sleep',
          icon: '💤',
          type: 'booster',
          energyDelta: 20,
          scienceFact: 'During deep sleep, brain waves wash away toxins and store words into long-term memory!',
          spokenFact: 'Sleep supercharges your memory and cleans your brain cells!'
        },
        {
          id: 'habit-water',
          name: 'Hydration & Water',
          icon: '💧',
          type: 'booster',
          energyDelta: 20,
          scienceFact: 'Your brain is 75% water! Dehydration slows synaptic signal speed by 30%.',
          spokenFact: 'Water keeps electrical signals racing fast between neurons!'
        },
        {
          id: 'habit-reading',
          name: 'Daily Reading Practice',
          icon: '📚',
          type: 'booster',
          energyDelta: 20,
          scienceFact: 'Neuroplasticity: Every time you practice, the myelin insulation thickens, making reading automatic!',
          spokenFact: 'Reading practice physically thickens your neural highways!'
        },
        {
          id: 'habit-nutrients',
          name: 'Berries & Omega-3 Fuel',
          icon: '🥑',
          type: 'booster',
          energyDelta: 20,
          scienceFact: 'Neurons need stable glucose and healthy fatty acids to construct cell membranes.',
          spokenFact: 'Healthy berries and vegetables give constant energy to your brain!'
        },
        {
          id: 'distract-screens',
          name: 'All-Night Gaming Screen',
          icon: '📱',
          type: 'drainer',
          energyDelta: -10,
          scienceFact: 'Blue light late at night suppresses melatonin and prevents memory consolidation.',
          spokenFact: 'Late screen time drains your brain battery! Try reading a real book instead.'
        },
        {
          id: 'distract-sugar',
          name: 'Sugary Energy Drink',
          icon: '🍭',
          type: 'drainer',
          energyDelta: -10,
          scienceFact: 'Sugar causes a rapid spike followed by a steep glucose crash, leaving neurons sluggish.',
          spokenFact: 'Sugar causes a brain crash! Clean water is the true super-fuel.'
        }
      ]
    },

    // PHASE 4: LIVE TELEPROMPTER & NEURO-BROADCAST (Karaoke Teleprompter Studio)
    phase4_broadcast: {
      title: 'PHASE 4: LIVE TELEPROMPTER & NEURO-BROADCAST',
      subtitle: 'Step into the TV newsroom! Deliver your capstone science report live to the class!',
      instructions: 'Speak each sentence with confidence as the teleprompter highlights the target words in neon cyan.',
      scriptLines: [
        {
          id: 1,
          speaker: 'NEWS ANCHOR',
          lobe: null,
          color: '#38bdf8',
          text: 'Reading is a whole-team effort!',
          words: ['Reading', 'is', 'a', 'whole-team', 'effort!'],
          formulaType: 'Core Axiom',
          clue: 'Start with high energy and an anchor smile!'
        },
        {
          id: 2,
          speaker: 'OCCIPITAL REPORTER',
          lobe: 'occipital',
          color: '#f43f5e',
          text: 'My red lobe helps me SEE the words.',
          words: ['My', 'red', 'lobe', 'helps', 'me', 'SEE', 'the', 'words.'],
          formulaType: 'The [lobe] helps us [verb]',
          clue: 'Point to the back of your head!'
        },
        {
          id: 3,
          speaker: 'TEMPORAL REPORTER',
          lobe: 'temporal',
          color: '#a855f7',
          text: 'My purple lobe helps me HEAR the sounds.',
          words: ['My', 'purple', 'lobe', 'helps', 'me', 'HEAR', 'the', 'sounds.'],
          formulaType: 'The [lobe] helps us [verb]',
          clue: 'Touch your ears with both fingers!'
        },
        {
          id: 4,
          speaker: 'FRONTAL REPORTER',
          lobe: 'frontal',
          color: '#f59e0b',
          text: 'My yellow lobe helps me THINK and SPEAK!',
          words: ['My', 'yellow', 'lobe', 'helps', 'me', 'THINK', 'and', 'SPEAK!'],
          formulaType: 'The [lobe] helps us [verb]',
          clue: 'Touch your forehead with confidence!'
        },
        {
          id: 5,
          speaker: 'NEURO-ENGINEER',
          lobe: null,
          color: '#10b981',
          text: 'When we practice every day, our brain gets stronger and faster!',
          words: ['When', 'we', 'practice', 'every', 'day,', 'our', 'brain', 'gets', 'stronger', 'and', 'faster!'],
          formulaType: 'Neuroplasticity Axiom',
          clue: 'Wave to the audience and conclude your report!'
        }
      ]
    },

    // Badges and Diplomas
    badges: [
      { id: 'atlas_explorer', name: 'Neuro-Atlas Master', icon: '🧭', desc: 'Sorted all 6 sensory chips to their exact cortical lobes' },
      { id: 'synaptic_racer', name: 'Synaptic Speed Champion', icon: '⚡', desc: 'Routed reading impulses in under 0.30 seconds across 3 rounds' },
      { id: 'battery_overcharge', name: 'Metabolic Overcharge 100%', icon: '🔋', desc: 'Charged brain metabolic battery to 100% with myelin upgrades' },
      { id: 'broadcaster_license', name: 'Licensed Neuro-Broadcaster', icon: '🎙️', desc: 'Delivered a live teleprompter report on how the brain reads' },
      { id: 'licensed_neuroscientist', name: 'Certified Neuro-Engineer', icon: '🎓', desc: 'Completed the master curriculum and earned the Golden Diploma' }
    ]
  };

  root.BRAIN_DATA = BRAIN_DATA;
})(typeof window !== 'undefined' ? window : global);
