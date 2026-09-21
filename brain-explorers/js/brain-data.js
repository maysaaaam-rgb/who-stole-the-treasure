/**
 * LEARNING AND YOUR BRAIN — CURRICULUM & ENGINE DATA
 * Target Audience: Primary ESL / CLIL (Ages 7–11 | CEFR A1–A2)
 * Core Language: "The [lobe] helps us [verb]." / "Reading is a whole-team effort!"
 */

(function(root) {
  'use strict';

  const BRAIN_DATA = {
    meta: {
      id: 'learning-and-your-brain',
      title: 'Learning & Your Brain',
      subtitle: 'HOW YOUR SUPER-COMPUTER WORKS!',
      theme: 'Neurobiology & How We Learn',
      grade: 'Primary Grades 2–5',
      cefr: 'CEFR A1+ / A2',
      energyRequirement: '20% of Body Energy',
      coreFormula: 'The [Lobe] helps us [Verb].',
      teamworkMotto: 'Reading is a whole-team effort!'
    },

    // 4 Anatomical Brain Lobes with SVG Paths, Colors, Functions, and ESL Formula
    lobes: {
      frontal: {
        id: 'frontal',
        name: 'Frontal Lobe',
        color: '#f59e0b',       // Amber / Yellow
        glowColor: '#fbbf24',
        accentBg: 'rgba(245, 158, 11, 0.18)',
        borderColor: '#d97706',
        icon: '💡',
        shortRole: 'Thinking & Speaking',
        actionVerb: 'think, plan, and speak',
        formulaSentence: 'The Frontal Lobe helps us think and speak.',
        eslPrompt: 'We use our Frontal Lobe to understand and say words!',
        locationText: 'Front of the brain (behind your forehead)',
        readingRole: 'Understands the meaning and controls your voice to speak the word aloud.',
        readingStepNumber: 4,
        svgPath: 'M 130 95 C 130 65 170 60 215 65 C 265 72 295 105 305 145 C 312 175 305 210 280 235 C 255 255 220 255 195 240 C 185 225 180 200 175 180 C 165 170 145 155 130 145 C 120 135 125 110 130 95 Z',
        center: { x: 235, y: 150 }
      },

      parietal: {
        id: 'parietal',
        name: 'Parietal Lobe',
        color: '#10b981',       // Emerald / Green
        glowColor: '#34d399',
        accentBg: 'rgba(16, 185, 129, 0.18)',
        borderColor: '#059669',
        icon: '🖐️',
        shortRole: 'Touch & Space',
        actionVerb: 'feel touch, taste, and know where our hands are',
        formulaSentence: 'The Parietal Lobe helps us feel touch and turn pages.',
        eslPrompt: 'We use our Parietal Lobe to hold the book and turn the page!',
        locationText: 'Top-middle of the brain',
        readingRole: 'Controls hand touch, holding the book, and tracking where words are on the page.',
        readingStepNumber: 3,
        svgPath: 'M 130 95 C 145 65 195 45 250 50 C 275 52 285 58 295 70 C 270 66 220 62 180 80 C 150 95 135 110 130 95 Z M 130 95 C 140 110 160 115 175 140 C 150 145 125 135 110 120 C 100 105 115 95 130 95 Z M 175 80 C 220 62 270 66 295 70 C 275 100 240 120 205 135 C 190 115 185 95 175 80 Z',
        // Consolidated full anatomical contour:
        contourPath: 'M 130 92 C 150 55 210 40 270 48 C 290 52 300 62 305 75 C 280 115 240 135 195 145 C 175 125 150 110 130 92 Z',
        center: { x: 215, y: 90 }
      },

      occipital: {
        id: 'occipital',
        name: 'Occipital Lobe',
        color: '#ef4444',       // Red / Coral
        glowColor: '#f87171',
        accentBg: 'rgba(239, 68, 68, 0.18)',
        borderColor: '#dc2626',
        icon: '👁️',
        shortRole: 'Vision & Seeing',
        actionVerb: 'see letters, colors, and shapes',
        formulaSentence: 'The Occipital Lobe helps us see letters and words.',
        eslPrompt: 'We use our Occipital Lobe to see the letters on the page!',
        locationText: 'Back of the brain',
        readingRole: 'First reading step: Your eyes capture the visual shape of each letter.',
        readingStepNumber: 1,
        svgPath: 'M 95 135 C 115 120 145 130 165 145 C 150 175 130 205 105 215 C 80 205 70 175 75 155 C 80 142 88 138 95 135 Z',
        center: { x: 115, y: 170 }
      },

      temporal: {
        id: 'temporal',
        name: 'Temporal Lobe',
        color: '#a855f7',       // Purple / Violet
        glowColor: '#c084fc',
        accentBg: 'rgba(168, 85, 247, 0.18)',
        borderColor: '#9333ea',
        icon: '👂',
        shortRole: 'Hearing & Word Sounds',
        actionVerb: 'hear sounds, music, and spoken phonemes',
        formulaSentence: 'The Temporal Lobe helps us hear word sounds.',
        eslPrompt: 'We use our Temporal Lobe to remember what letter sounds sound like!',
        locationText: 'Sides of the brain (near your ears)',
        readingRole: 'Matches the visual letters to their phonemes (/k/ /æ/ /t/).',
        readingStepNumber: 2,
        svgPath: 'M 140 165 C 165 155 195 160 215 180 C 220 205 210 230 190 242 C 160 250 135 235 125 210 C 120 190 130 175 140 165 Z',
        center: { x: 170, y: 205 }
      }
    },

    // Phase 1: Sensory Discovery Tokens
    // Learners inspect sensory cards and match them to the correct lobe
    sensoryTokens: [
      {
        id: 'token-letters',
        name: 'Printed Letters',
        icon: '📖',
        targetLobe: 'occipital',
        description: 'Looking at black letters printed on a white page.',
        spokenFormula: 'The Occipital Lobe helps us see letters!',
        clue: 'Seeing with your eyes'
      },
      {
        id: 'token-colors',
        name: 'Bright Rainbow',
        icon: '🌈',
        targetLobe: 'occipital',
        description: 'Noticing bright red, blue, and yellow colors in a picture.',
        spokenFormula: 'The Occipital Lobe helps us see colors!',
        clue: 'Visual shapes & light'
      },
      {
        id: 'token-phonics',
        name: 'Letter Sounds (/b/-/æ/-/t/)',
        icon: '🔊',
        targetLobe: 'temporal',
        description: 'Hearing teacher sound out the letters in a word.',
        spokenFormula: 'The Temporal Lobe helps us hear word sounds!',
        clue: 'Listening with your ears'
      },
      {
        id: 'token-music',
        name: 'Song Melody',
        icon: '🎵',
        targetLobe: 'temporal',
        description: 'Hearing a rhythm, drum beat, or alphabet song.',
        spokenFormula: 'The Temporal Lobe helps us hear music!',
        clue: 'Hearing rhythms & tones'
      },
      {
        id: 'token-touch',
        name: 'Smooth Book Cover',
        icon: '📘',
        targetLobe: 'parietal',
        description: 'Feeling the smooth paper cover as your fingers hold the book.',
        spokenFormula: 'The Parietal Lobe helps us feel touch!',
        clue: 'Touching with your fingers'
      },
      {
        id: 'token-turn-page',
        name: 'Page Turning',
        icon: '📄',
        targetLobe: 'parietal',
        description: 'Knowing where your hand is as you turn to page two.',
        spokenFormula: 'The Parietal Lobe helps us know where our hands are!',
        clue: 'Body & space sense'
      },
      {
        id: 'token-speaking',
        name: 'Speaking Aloud',
        icon: '🗣️',
        targetLobe: 'frontal',
        description: 'Using your mouth and tongue to speak "Hello class!"',
        spokenFormula: 'The Frontal Lobe helps us speak words aloud!',
        clue: 'Language & speaking'
      },
      {
        id: 'token-thinking',
        name: 'Story Question',
        icon: '🧩',
        targetLobe: 'frontal',
        description: 'Thinking about what happens next in the mystery story.',
        spokenFormula: 'The Frontal Lobe helps us think and solve problems!',
        clue: 'Thinking & planning'
      }
    ],

    // Phase 2: Reading Teamwork Scenarios
    // "Reading is a whole-team effort!" — Step-by-step synapse relay
    readingJourney: {
      word: 'C - A - T',
      wordPronunciation: '/kæt/',
      imageIcon: '🐱',
      headline: 'How Does Your Brain Read a Word?',
      teamworkMotto: 'Reading is a whole-team effort! All 4 lobes work together in 0.3 seconds!',
      steps: [
        {
          step: 1,
          lobeId: 'occipital',
          lobeName: 'Occipital Lobe',
          color: '#ef4444',
          action: '1. EYES SEE THE LETTERS',
          detail: 'Your eyes see the visual shapes: curved C, tall A, and crossed T.',
          voicePrompt: 'First, the Occipital Lobe sees the shapes of C, A, and T.',
          badge: '👁️ Seeing Letters'
        },
        {
          step: 2,
          lobeId: 'temporal',
          lobeName: 'Temporal Lobe',
          color: '#a855f7',
          action: '2. EARS MATCH THE SOUNDS',
          detail: 'Your brain connects letter shapes to phonemes: /k/ - /æ/ - /t/.',
          voicePrompt: 'Next, the Temporal Lobe matches each letter to its sound.',
          badge: '👂 Letter Sounds'
        },
        {
          step: 3,
          lobeId: 'parietal',
          lobeName: 'Parietal Lobe',
          color: '#10b981',
          action: '3. SPATIAL SENSE TRACKS WORDS',
          detail: 'Your hands hold the book still and your brain tracks left-to-right reading order.',
          voicePrompt: 'Then, the Parietal Lobe keeps track of reading from left to right.',
          badge: '🖐️ Spatial Tracking'
        },
        {
          step: 4,
          lobeId: 'frontal',
          lobeName: 'Frontal Lobe',
          color: '#f59e0b',
          action: '4. MEANING & SPEAKING ALOUD',
          detail: 'You understand: "A furry pet cat!" and your mouth says "CAT!"',
          voicePrompt: 'Finally, the Frontal Lobe understands the meaning and speaks the word: Cat!',
          badge: '💡 Meaning & Speech'
        }
      ]
    },

    // Additional Reading Challenge Words for replayability
    challengeWords: [
      { word: 'C - A - T', emoji: '🐱', meaning: 'A playful furry pet that purrs!' },
      { word: 'S - U - N', emoji: '☀️', meaning: 'The bright star that gives us daylight!' },
      { word: 'B - O - O - K', emoji: '📚', meaning: 'Pages full of stories and new facts!' },
      { word: 'S - T - A - R', emoji: '⭐', meaning: 'A glowing light shining in the night sky!' }
    ],

    // Phase 3: Neuro-Energy Challenge (Battery & Neuroplasticity)
    // The brain uses 20% of body energy. Practice makes neurons stronger!
    energyHabits: [
      {
        id: 'habit-sleep',
        name: '9–10 Hours of Sleep',
        icon: '💤',
        isBooster: true,
        energyChange: +25,
        scienceFact: 'While you sleep, your brain organizes memories and clears waste!',
        speech: 'Great job! Sleep helps your brain remember what you learned.'
      },
      {
        id: 'habit-water',
        name: 'Drinking Clean Water',
        icon: '💧',
        isBooster: true,
        energyChange: +20,
        scienceFact: 'Your brain is about 75% water! Hydration speeds up thinking.',
        speech: 'Water powers your electrical brain signals!'
      },
      {
        id: 'habit-healthy-food',
        name: 'Berries, Nuts & Veggies',
        icon: '🥗',
        isBooster: true,
        energyChange: +25,
        scienceFact: 'Your brain needs 20% of your daily food calories to send signals.',
        speech: 'Healthy food provides glucose fuel for active neurons!'
      },
      {
        id: 'habit-practice',
        name: 'Daily Reading Practice',
        icon: '📚',
        isBooster: true,
        energyChange: +30,
        scienceFact: 'Neuroplasticity: Practicing makes your neural pathways thicker and faster!',
        speech: 'Practice makes neural connections stronger and stronger!'
      },
      {
        id: 'drain-nosleep',
        name: 'Staying Up Too Late',
        icon: '🥱',
        isBooster: false,
        energyChange: -15,
        scienceFact: 'Lack of sleep slows down your Frontal Lobe and makes focus hard.',
        speech: 'Being tired drains your brain energy and slows thinking.'
      },
      {
        id: 'drain-sugarcrash',
        name: 'Too Much Sugary Soda',
        icon: '🥤',
        isBooster: false,
        energyChange: -15,
        scienceFact: 'Big sugar spikes lead to crashes, leaving you feeling foggy.',
        speech: 'Too much sugar causes energy crashes in brain cells.'
      }
    ],

    // ESL Sentence Completion Frames for worksheet and interactive HUD
    sentenceFrames: [
      {
        lobe: 'Frontal Lobe',
        color: '#f59e0b',
        frame: 'The Frontal Lobe helps us ________ and ________.',
        options: ['think and speak', 'see in the dark', 'grow taller'],
        correct: 'think and speak'
      },
      {
        lobe: 'Occipital Lobe',
        color: '#ef4444',
        frame: 'The Occipital Lobe helps us see ________ and ________.',
        options: ['letters and words', 'taste and smell', 'footprints'],
        correct: 'letters and words'
      },
      {
        lobe: 'Temporal Lobe',
        color: '#a855f7',
        frame: 'The Temporal Lobe helps us hear ________.',
        options: ['word sounds', 'sunlight', 'heavy rocks'],
        correct: 'word sounds'
      },
      {
        lobe: 'Parietal Lobe',
        color: '#10b981',
        frame: 'The Parietal Lobe helps us feel ________ and turn pages.',
        options: ['touch', 'music', 'colors'],
        correct: 'touch'
      }
    ],

    // Badges awarded during the mission
    badges: [
      { id: 'atlas_explorer', name: 'Neuro-Atlas Explorer', icon: '🧠', desc: 'Discovered all 4 brain lobes and their powers' },
      { id: 'teamwork_champion', name: 'Reading Team Champion', icon: '⚡', desc: 'Connected all 4 lobes in the 0.3s reading relay' },
      { id: 'battery_master', name: 'Neuro-Battery Master', icon: '🔋', desc: 'Supercharged the brain to 100% with healthy habits' },
      { id: 'licensed_neuroscientist', name: 'Junior Neuro-Explorer', icon: '🎓', desc: 'Completed the full curriculum and unlocked the Diploma' }
    ]
  };

  root.BRAIN_DATA = BRAIN_DATA;
})(typeof window !== 'undefined' ? window : global);
