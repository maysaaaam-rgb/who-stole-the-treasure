/**
 * 🧠 THE BRAIN HACKERS: PEDAGOGICAL CURRICULUM DATA
 * Aligned with Macmillan Global Readings 3, Unit 1 (pp. 18–21)
 * Target: Young ESL Explorers (A1+/A2, Ages 8–11)
 */

(function(window) {
  'use strict';

  const BRAIN_HACKERS_DATA = {
    meta: {
      id: 'brain-hackers',
      title: 'THE BRAIN HACKERS',
      subtitle: 'MISSION: UNLOCK YOUR BRAIN',
      level: 'A1+/A2',
      targetAge: '8–11 years',
      grade: 'Grade 4',
      durationMinutes: 65,
      totalMissions: 8,
      totalXP: 100
    },

    vocabulary: [
      { word: 'brain', icon: '🧠', def: 'The control center of your body and thoughts.' },
      { word: 'neuron', icon: '⚡', def: 'A special cell inside your brain.' },
      { word: 'cell body', icon: '🟢', def: 'The main center of a neuron.' },
      { word: 'fiber', icon: '〰️', def: 'A long wire that carries brain signals.' },
      { word: 'connection', icon: '🔗', def: 'Where two neurons link together.' },
      { word: 'message', icon: '✉️', def: 'Information sent through your nerves.' },
      { word: 'visualize', icon: '👁️', def: 'To imagine a picture in your mind.' },
      { word: 'creative', icon: '🎨', def: 'Using your imagination to make new ideas.' }
    ],

    missions: [
      {
        id: 'm1',
        number: '01',
        title: 'DETECT THE BRAIN',
        badge: 'MISSION 01',
        desc: 'Scan the brain and discover which areas activate for hearing, seeing, speaking, and thinking.',
        xp: 10,
        energyGain: 10,
        narrativeTransition: 'We discovered which brain areas are active. But HOW do they communicate? Let us zoom in!'
      },
      {
        id: 'm2',
        number: '02',
        title: 'NEURON NETWORK',
        badge: 'MISSION 02',
        desc: 'Zoom into the microscopic world. Assemble a neuron cell body, fiber, connection, and message.',
        xp: 10,
        energyGain: 10,
        narrativeTransition: 'We found the connections. But WHAT do they send across the network?'
      },
      {
        id: 'm3',
        number: '03',
        title: 'SEND THE MESSAGE',
        badge: 'MISSION 03',
        desc: 'Become a human neuron chain! Pass the electric message: DOG → RUN → FAST.',
        xp: 15,
        energyGain: 15,
        narrativeTransition: 'We can send messages. But can the brain create pictures without eyes?'
      },
      {
        id: 'm4',
        number: '04',
        title: 'VISUALIZE THE INVISIBLE',
        badge: 'MISSION 04',
        desc: 'Close your eyes, build a picture in your mind, then spot the visual discrepancies.',
        xp: 15,
        energyGain: 15,
        narrativeTransition: 'Can different brains imagine different things? Let us unleash our creativity!'
      },
      {
        id: 'm5',
        number: '05',
        title: 'UNLOCK CREATIVITY',
        badge: 'MISSION 05',
        desc: 'Bring impossible sentences to life on the digital imagination canvas.',
        xp: 20,
        energyGain: 15,
        narrativeTransition: 'How does your amazing brain perform in sports, music, and numbers?'
      },
      {
        id: 'm6',
        number: '06',
        title: 'BRAIN VS BRAIN',
        badge: 'MISSION 06',
        desc: 'Power up four subject portals: PE, Music, Mathematics, and Reading.',
        xp: 20,
        energyGain: 15,
        narrativeTransition: 'Warning! The brain has worked hard and energy is running low!'
      },
      {
        id: 'm7',
        number: '07',
        title: 'SAVE THE BRAIN',
        badge: 'MISSION 07',
        desc: 'Recharge the Brain Energy meter to 100% using powerful learning and health habits.',
        xp: 10,
        energyGain: 20,
        narrativeTransition: 'All systems are operating at maximum power! Final Scientist evaluation ready!'
      },
      {
        id: 'final',
        number: '08',
        title: 'BECOME A BRAIN SCIENTIST',
        badge: 'FINAL DISCOVERY',
        desc: 'Synthesize what your brain can do and claim your official Brain Hacker License.',
        xp: 0,
        energyGain: 0,
        narrativeTransition: 'Mission Accomplished! You are certified Brain Scientists!'
      }
    ],

    // Mission 01 Audio Prompts & Activity sets
    detectActivities: [
      {
        id: 'hearing',
        label: 'Hearing',
        icon: '🎧',
        lobe: 'temporal',
        promptSentence: 'Listen: "The cat is hiding under the table."',
        explanation: 'Your temporal lobe hears sounds and speech!'
      },
      {
        id: 'seeing',
        label: 'Seeing',
        icon: '👀',
        lobe: 'occipital',
        promptSentence: 'Look: "See the big yellow star in the night sky."',
        explanation: 'Your occipital lobe at the back processes visual pictures!'
      },
      {
        id: 'speaking',
        label: 'Speaking',
        icon: '🗣',
        lobe: 'motor',
        promptSentence: 'Say: "Hello! My name is Alex and I love English."',
        explanation: 'Your motor and frontal speech areas activate to talk!'
      },
      {
        id: 'thinking',
        label: 'Thinking',
        icon: '💭',
        lobe: 'frontal',
        promptSentence: 'Solve: "What is 7 plus 5? How does an invention work?"',
        explanation: 'Your frontal lobe does planning, math, and thinking!'
      }
    ],

    // Mission 02: Neuron Anatomy
    neuronParts: [
      { id: 'cell_body', label: 'Cell Body', x: 28, y: 50, hint: 'The main round center of the cell' },
      { id: 'fiber', label: 'Fiber', x: 55, y: 50, hint: 'The long electrical wire (axon)' },
      { id: 'connection', label: 'Connection', x: 80, y: 50, hint: 'Where neurons link and touch' },
      { id: 'message', label: 'Message', x: 42, y: 35, hint: 'The electrical signal moving fast' }
    ],

    // Mission 03: Human Neuron Chains
    messageChains: [
      {
        id: 'dog_fast',
        targetWords: ['DOG', 'RUN', 'FAST'],
        nodes: [
          { id: 'n1', word: 'DOG', icon: '🐕' },
          { id: 'n2', word: 'RUN', icon: '🏃' },
          { id: 'n3', word: 'FAST', icon: '⚡' }
        ]
      },
      {
        id: 'robot_english',
        targetWords: ['ROBOT', 'TALK', 'ENGLISH'],
        nodes: [
          { id: 'n1', word: 'ROBOT', icon: '🤖' },
          { id: 'n2', word: 'TALK', icon: '🗣' },
          { id: 'n3', word: 'ENGLISH', icon: '🇬🇧' }
        ]
      }
    ],

    // Mission 04: Visualization Script
    visualizationStory: {
      spokenScript: 'Imagine a tiny blue house. There is a red door. A yellow cat is sitting next to the door. A green tree is behind the house.',
      discrepancies: [
        { id: 'disc_door', name: 'Green Door', expected: 'Should be RED', x: 50, y: 65 },
        { id: 'disc_cat', name: 'Purple Cat', expected: 'Should be YELLOW', x: 68, y: 75 },
        { id: 'disc_house', name: 'Orange House', expected: 'Should be BLUE', x: 32, y: 50 },
        { id: 'disc_tree', name: 'Missing Tree', expected: 'Tree is missing behind the house', x: 80, y: 30 }
      ]
    },

    // Mission 05: Creative Prompts
    creativePrompts: [
      { id: 'p1', text: 'A robot is dancing on the moon with a sparkling hat.' },
      { id: 'p2', text: 'A purple elephant is riding a bicycle through a sunny garden.' },
      { id: 'p3', text: 'A friendly friendly green monster is eating a giant pizza slice.' }
    ],

    // Mission 06: Subject Portals
    subjectPortals: [
      {
        id: 'pe',
        subject: 'Physical Education',
        short: 'PE',
        icon: '⚽',
        title: 'Motor & Movement Challenge',
        taskText: 'Your cerebellum balances your body! Stand up and perform a soccer kick or jump 3 times!',
        actionType: 'movement',
        seconds: 10
      },
      {
        id: 'music',
        subject: 'Music',
        short: 'MUSIC',
        icon: '🎵',
        title: 'Auditory Rhythm Decode',
        taskText: 'Listen to the rhythm pulse! Tap the rhythm button 3 times in time with the beat.',
        actionType: 'rhythm',
        pattern: [1, 1, 2]
      },
      {
        id: 'math',
        subject: 'Mathematics',
        short: 'MATH',
        icon: '➕',
        title: 'Frontal Calculation Lab',
        taskText: 'What is 7 + 5?',
        options: ['10', '12', '14'],
        correct: '12'
      },
      {
        id: 'reading',
        subject: 'Reading',
        short: 'READING',
        icon: '📖',
        title: 'Visualization Riddle',
        taskText: 'I have pages, words, and stories, but no voice. When you open me, your brain builds pictures. What am I?',
        options: ['A Book', 'A Table', 'A Shoe'],
        correct: 'A Book'
      }
    ],

    // Mission 07: Brain Energy Habits
    habits: [
      { id: 'h1', text: 'Reading Books', icon: '📖', fuel: 15, isGood: true },
      { id: 'h2', text: 'Learning English', icon: '🧠', fuel: 15, isGood: true },
      { id: 'h3', text: 'Deep Thinking', icon: '💭', fuel: 15, isGood: true },
      { id: 'h4', text: 'Imagining Stories', icon: '🎨', fuel: 15, isGood: true },
      { id: 'h5', text: 'Making Connections', icon: '🔗', fuel: 10, isGood: true },
      { id: 'h6', text: '9 Hours Good Sleep', icon: '😴', fuel: 10, isGood: true },
      { id: 'bad1', text: 'All-Night Screens', icon: '📺', fuel: 0, isGood: false, tip: 'Screens make your brain exhausted!' },
      { id: 'bad2', text: 'Only Eating Candy', icon: '🍭', fuel: 0, isGood: false, tip: 'Your brain needs healthy nutrients!' }
    ],

    // Final Mission: Brain Discovery
    finalDiscoveryOptions: [
      { word: 'think', desc: 'solve problems and make smart choices' },
      { word: 'learn', desc: 'absorb new English words and ideas' },
      { word: 'imagine', desc: 'create colorful pictures in my mind' },
      { word: 'connect', desc: 'link neurons together like a superhero network' },
      { word: 'visualize', desc: 'see entire stories when I read' }
    ]
  };

  window.BRAIN_HACKERS_DATA = BRAIN_HACKERS_DATA;
})(typeof window !== 'undefined' ? window : global);
