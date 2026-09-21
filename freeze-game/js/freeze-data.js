/**
 * THE 20% ENERGY FREEZE GAME: CURRICULUM DATA REGISTRY
 * Grade 2-4 CEFR A1+/A2 | CLIL Human Biology & Metabolic Energy
 * Zero-bug safety: all 12 prompts, lobe mappings, and debrief formulas defined.
 */

(function(root) {
  'use strict';

  const FREEZE_DATA = {
    meta: {
      id: 'freeze-game',
      title: '⚡ The 20% Energy Freeze Game: Brain Power Check',
      subtitle: 'COMPARE MUSCLE ENERGY (0% IN STILLNESS) WITH CONTINUOUS 20% BRAIN FUEL',
      grade: 'Grade 2–4',
      level: 'A1+ / A2',
      cefrLevel: 'A1+',
      duration: '25 min',
      xp: 150,
      curriculum: 'CLIL Human Biology, Brain Energy & Sensory Lobes',
      coreFact: 'Your brain is only 2% of your body weight, but consumes 20% of your metabolic energy every second—even when you freeze!',
      languageFormula: 'My muscles stopped, but my brain burned energy! The [lobe] helps us [action].'
    },

    // 4 Cerebral Lobes with SVG hotspot coordinates and energy roles
    lobes: {
      frontal: {
        id: 'frontal',
        name: 'Frontal Lobe',
        alias: 'Executive Center',
        icon: '💡',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.45)',
        locationText: 'Front of head (behind your forehead)',
        roleInThinking: 'Calculates numbers, solves problems, plans decisions, and controls movement.',
        coords: { x: '72%', y: '56%' },
        targetFormula: 'The frontal lobe calculates and solves problems.'
      },
      occipital: {
        id: 'occipital',
        name: 'Occipital Lobe',
        alias: 'Visual Center',
        icon: '👁️',
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.45)',
        locationText: 'Back of head (above your neck)',
        roleInThinking: 'Processes images, recognizes colors, and creates mental mental pictures.',
        coords: { x: '25%', y: '64%' },
        targetFormula: 'The occipital lobe sees and pictures mental images.'
      },
      temporal: {
        id: 'temporal',
        name: 'Temporal Lobe',
        alias: 'Hearing & Memory',
        icon: '🎧',
        color: '#a855f7',
        glowColor: 'rgba(168, 85, 247, 0.45)',
        locationText: 'Sides of head (above your ears)',
        roleInThinking: 'Processes sounds, spoken language, phonics, rhythm, and memories.',
        coords: { x: '48%', y: '64%' },
        targetFormula: 'The temporal lobes listen, process sounds, and remember.'
      },
      parietal: {
        id: 'parietal',
        name: 'Parietal Lobe',
        alias: 'Sensory & Touch',
        icon: '✋',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.45)',
        locationText: 'Top and crown of head',
        roleInThinking: 'Processes physical touch, temperature, taste, pain, and spatial orientation.',
        coords: { x: '47%', y: '32%' },
        targetFormula: 'The parietal lobe senses touch, temperature, and taste.'
      }
    },

    // 12 Classroom Prompts across 4 Categories
    prompts: [
      // 1. MATH & LOGIC (Frontal Lobe)
      {
        id: 'math-1',
        category: 'Math & Logic',
        categoryIcon: '🔢',
        title: 'Quick Arithmetic Addition',
        taskText: 'Calculate 14 + 7 silently in your frozen mind!',
        spokenPrompt: 'Freeze! Eyes closed. Calculate 14 plus 7 silently in your mind.',
        targetLobe: 'frontal',
        answer: '21',
        options: ['19', '21', '23', '25'],
        revealActionText: 'Unfreeze! Shout the answer on three: 1, 2, 3!',
        scienceDebrief: 'Your frontal lobe burned metabolic glucose to calculate 14 + 7 = 21 while your muscles rested!'
      },
      {
        id: 'math-2',
        category: 'Math & Logic',
        categoryIcon: '🔢',
        title: 'Mental Doubling Challenge',
        taskText: 'Double the number 15 silently in your frozen mind!',
        spokenPrompt: 'Freeze! Eyes closed. Double the number 15 silently without moving.',
        targetLobe: 'frontal',
        answer: '30',
        options: ['25', '28', '30', '35'],
        revealActionText: 'Unfreeze! Whisper 30 to your elbow partner!',
        scienceDebrief: 'Multiplying 15 × 2 required high-speed electrical impulses across your frontal cortex!'
      },
      {
        id: 'math-3',
        category: 'Math & Logic',
        categoryIcon: '🔢',
        title: 'Energy Subtraction',
        taskText: 'Calculate 20 fuel points minus 8 points silently!',
        spokenPrompt: 'Freeze! Eyes closed. You have 20 fuel points. Subtract 8 silently.',
        targetLobe: 'frontal',
        answer: '12',
        options: ['10', '12', '14', '16'],
        revealActionText: 'Unfreeze! Show the answer 12 with your fingers in the air!',
        scienceDebrief: 'Working memory in your frontal cortex held the numbers 20 and 8 in active storage!'
      },

      // 2. STORY & VISUALIZATION (Occipital Lobe)
      {
        id: 'vis-1',
        category: 'Visualization',
        categoryIcon: '🚀',
        title: 'Space Rocket Ignition',
        taskText: 'Picture a bright blue rocket blasting off with giant orange flames!',
        spokenPrompt: 'Freeze! Eyes closed. Picture a bright blue rocket blasting off with giant orange flames.',
        targetLobe: 'occipital',
        answer: 'Blue Rocket & Orange Flames',
        options: ['Red Car', 'Blue Rocket & Orange Flames', 'Green Submarine', 'Yellow Plane'],
        revealActionText: 'Unfreeze! Show your highest silent rocket reach into the sky!',
        scienceDebrief: 'Your eyes were shut, but your occipital visual cortex lit up brightly to render the rocket!'
      },
      {
        id: 'vis-2',
        category: 'Visualization',
        categoryIcon: '🐻',
        title: 'Baby Bear & Sweet Strawberry',
        taskText: 'Picture a fluffy baby bear eating a giant red strawberry!',
        spokenPrompt: 'Freeze! Eyes closed. Picture a fluffy baby bear eating a sweet red strawberry.',
        targetLobe: 'occipital',
        answer: 'Fluffy Bear eating Strawberry',
        options: ['Robot eating Battery', 'Fluffy Bear eating Strawberry', 'Shark swimming', 'Dragon flying'],
        revealActionText: 'Unfreeze! Share two adjectives describing your mental picture!',
        scienceDebrief: 'Your occipital lobe recreated vibrant strawberry red and fluffy fur textures from memory!'
      },
      {
        id: 'vis-3',
        category: 'Visualization',
        categoryIcon: '🗝️',
        title: 'The Glowing Golden Key',
        taskText: 'Picture an ancient glowing gold key resting on a dark wooden table!',
        spokenPrompt: 'Freeze! Eyes closed. Picture a glowing golden key resting on a dark wooden table.',
        targetLobe: 'occipital',
        answer: 'Glowing Gold Key',
        options: ['Silver Spoon', 'Glowing Gold Key', 'Bronze Coin', 'Diamond Ring'],
        revealActionText: 'Unfreeze! Turn your imaginary golden key in the air with a click!',
        scienceDebrief: 'Mental visualization activates the very same visual cortex neurons as seeing a real key!'
      },

      // 3. SENSORY RECALL (Parietal & Temporal Lobes)
      {
        id: 'sens-1',
        category: 'Sensory Recall',
        categoryIcon: '🍋',
        title: 'Sour Lemon Bite',
        taskText: 'Imagine taking a giant bite into a sour, juicy yellow lemon!',
        spokenPrompt: 'Freeze! Eyes closed. Imagine taking a huge bite into a sour, juicy yellow lemon.',
        targetLobe: 'parietal',
        answer: 'Sour & Tangy',
        options: ['Sweet Chocolate', 'Sour & Tangy', 'Salty Pretzel', 'Bitter Coffee'],
        revealActionText: 'Unfreeze! Show your most dramatic sour lemon face to the class!',
        scienceDebrief: 'Your parietal cortex processed sensory taste and puckered your face muscles without real food!'
      },
      {
        id: 'sens-2',
        category: 'Sensory Recall',
        categoryIcon: '❄️',
        title: 'Ice-Cold Polar Plunge',
        taskText: 'Imagine jumping into an ice-cold swimming pool on a freezing morning!',
        spokenPrompt: 'Freeze! Eyes closed. Imagine jumping into an ice-cold swimming pool on a frosty morning.',
        targetLobe: 'parietal',
        answer: 'Freezing Cold Shiver',
        options: ['Warm Bath', 'Freezing Cold Shiver', 'Dry Desert Sand', 'Cozy Blanket'],
        revealActionText: 'Unfreeze! Give a giant physical shiver and say: Brrr!',
        scienceDebrief: 'Temperature perception in your parietal lobe triggered real thermal goosebumps!'
      },
      {
        id: 'sens-3',
        category: 'Sensory Recall',
        categoryIcon: '🔥',
        title: 'Crackling Campfire Embers',
        taskText: 'Listen in your mind to crackling wood sparks popping in a warm campfire!',
        spokenPrompt: 'Freeze! Eyes closed. Listen in your mind to crackling sparks popping in a warm campfire.',
        targetLobe: 'temporal',
        answer: 'Crackle & Pop',
        options: ['Horn Honk', 'Crackle & Pop', 'Water Splashing', 'Siren Wailing'],
        revealActionText: 'Unfreeze! Make one soft campfire pop sound with your mouth: Pop!',
        scienceDebrief: 'Your temporal auditory cortex simulated acoustic soundwaves from memory while the room was silent!'
      },

      // 4. LOBE-ACTION (Frontal, Occipital, Temporal)
      {
        id: 'lobe-1',
        category: 'Lobe-Action',
        categoryIcon: '💡',
        title: 'Frontal Executive Power',
        taskText: 'Frontal lobe working! Calculate 5 × 4 and prepare to touch your forehead!',
        spokenPrompt: 'Freeze! Eyes closed. Frontal lobe working. Solve 5 times 4 and get ready to touch your forehead.',
        targetLobe: 'frontal',
        answer: '20',
        options: ['15', '20', '25', '30'],
        revealActionText: 'Unfreeze! Touch your forehead and whisper: 20! Frontal lobe power!',
        scienceDebrief: 'Your frontal lobe solved the math equation and formulated the motor plan before you even moved!'
      },
      {
        id: 'lobe-2',
        category: 'Lobe-Action',
        categoryIcon: '👁️',
        title: 'Occipital Visual Star',
        taskText: 'Occipital lobe working! Picture a flashing neon green star at the back of your mind!',
        spokenPrompt: 'Freeze! Eyes closed. Occipital lobe working. Picture a flashing neon green star.',
        targetLobe: 'occipital',
        answer: 'Neon Green Star',
        options: ['Yellow Moon', 'Neon Green Star', 'Blue Cloud', 'Pink Heart'],
        revealActionText: 'Unfreeze! Put hands on the back of your head and chant: Occipital sees!',
        scienceDebrief: 'The occipital lobe sits at the very back of your skull, firing signals forward through the brain!'
      },
      {
        id: 'lobe-3',
        category: 'Lobe-Action',
        categoryIcon: '🎧',
        title: 'Temporal Auditory Bell',
        taskText: 'Temporal lobes working! Hear a loud school bell ringing in your mind: Diiiing!',
        spokenPrompt: 'Freeze! Eyes closed. Temporal lobes working. Hear a loud school bell ringing in your ears.',
        targetLobe: 'temporal',
        answer: 'Ringing School Bell',
        options: ['Car Engine', 'Ringing School Bell', 'Dog Barking', 'Clock Ticking'],
        revealActionText: 'Unfreeze! Point to both sides of your head and chant: Temporal lobes hear!',
        scienceDebrief: 'Your twin temporal lobes sit right above your ears, turning vibrations into recognized words and music!'
      }
    ],

    // Debrief Karaoke Comparison Sentences
    debriefSentences: [
      {
        speaker: 'Classroom Scientist',
        text: 'When we froze, our physical muscle energy dropped immediately to 0 percent.',
        highlightWords: ['froze', 'muscle energy', '0 percent']
      },
      {
        speaker: 'Neuro-Explorer',
        text: 'Our brain never shut off. It burned 20 percent of our body fuel to think, imagine, and remember!',
        highlightWords: ['never shut off', '20 percent', 'body fuel', 'think', 'remember']
      },
      {
        speaker: 'Academy Team',
        text: 'The frontal lobe calculates, the occipital lobe sees, and the temporal lobes hear!',
        highlightWords: ['frontal lobe calculates', 'occipital lobe sees', 'temporal lobes hear']
      }
    ],

    // Achievement Badges
    badges: [
      { id: 'freeze_master', name: 'Freeze Master', icon: '❄️', desc: 'Maintained 0% muscle stillness during the freeze.' },
      { id: 'brain_burner', name: '20% Brain Burner', icon: '⚡', desc: 'Demonstrated continuous mental metabolism while still.' },
      { id: 'synapse_spark', name: 'Synapse Sparker', icon: '🧠', desc: 'Solved closed-eye mental challenges across all 4 lobes.' },
      { id: 'science_debriefer', name: 'Science Debriefer', icon: '🎙️', desc: 'Read the full metabolic comparison debrief aloud.' },
      { id: 'master_neuro_diploma', name: 'Master Neuro-Diploma', icon: '🎓', desc: 'Certified Master of Human Brain & Muscle Energy.' }
    ]
  };

  root.FREEZE_DATA = FREEZE_DATA;
})(typeof window !== 'undefined' ? window : global);
