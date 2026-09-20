/**
 * 🧠 THE BRAIN HACKERS: PEDAGOGICAL CURRICULUM DATA
 * Aligned with Macmillan Global Readings 3, Unit 1 (pp. 18–21)
 * Target: Young ESL Explorers (A1+/A2, Ages 8–11)
 */

(function(window) {
  'use strict';

  const BRAIN_DATA = {
    meta: {
      id: 'brain-hackers',
      title: 'THE BRAIN HACKERS',
      subtitle: 'MISSION: UNLOCK YOUR BRAIN',
      level: 'A1+/A2',
      targetAge: '8–11 years',
      grade: 'Grade 4',
      durationMinutes: 40,
      totalMissions: 8,
      totalXP: 100
    },

    missions: [
      {
        id: 1,
        title: 'Detect the Brain',
        icon: '🔬',
        subtitle: 'Discover which lobes power hearing, seeing, speaking, and thinking.'
      },
      {
        id: 2,
        title: 'Neuron Network',
        icon: '🧩',
        subtitle: 'Assemble a biological neuron under 10,000x magnification.'
      },
      {
        id: 3,
        title: 'Send the Message',
        icon: '⚡',
        subtitle: 'Pass high-speed electrical signals along a human neuron chain.'
      },
      {
        id: 4,
        title: 'Visualize the Invisible',
        icon: '👁️',
        subtitle: 'Listen, build a mental projection, and spot the 4 differences.'
      },
      {
        id: 5,
        title: 'Unlock Creativity',
        icon: '🎨',
        subtitle: 'Draw on the digital canvas and discover how each brain creates unique ideas.'
      },
      {
        id: 6,
        title: 'Brain vs Brain',
        icon: '🏫',
        subtitle: 'Explore 4 subject portals and watch active lobe heatmaps light up.'
      },
      {
        id: 7,
        title: 'Save the Brain',
        icon: '🔋',
        subtitle: 'Fuel depleted brain energy to 100% OVERLOAD POWER with healthy habits.'
      },
      {
        id: 8,
        title: 'Become a Brain Scientist',
        icon: '🎓',
        subtitle: 'Complete your scientific discovery statement and earn Academy honors.'
      }
    ],

    // Mission 1: Detect the Brain (PET Lobes & Senses)
    mission1_detect: {
      scenarios: [
        {
          id: 'clue1',
          icon: '👂',
          clue: 'You listen to the teacher explain a secret science mystery.',
          targetAction: 'hearing',
          targetLobe: 'temporal',
          colorClass: 'active-yellow',
          explanation: 'Hearing words activates your Temporal Lobe!'
        },
        {
          id: 'clue2',
          icon: '👁️',
          clue: 'You look at the glowing microscope screen.',
          targetAction: 'seeing',
          targetLobe: 'occipital',
          colorClass: 'active-green',
          explanation: 'Seeing visual images lights up your Occipital Lobe!'
        },
        {
          id: 'clue3',
          icon: '🗣️',
          clue: 'You answer: "The brain has billions of neurons!"',
          targetAction: 'speaking',
          targetLobe: 'frontal',
          colorClass: 'active-red',
          explanation: 'Speaking aloud activates the speech network in your Frontal Lobe!'
        },
        {
          id: 'clue4',
          icon: '🧠',
          clue: 'You think deeply to solve the logic puzzle.',
          targetAction: 'thinking',
          targetLobe: 'frontal',
          colorClass: 'active-red',
          explanation: 'Deep thinking and planning activate your Frontal Lobe!'
        }
      ],
      actions: [
        { id: 'hearing', name: 'Hearing Sounds', icon: '👂', lobeName: 'Temporal Lobe' },
        { id: 'seeing', name: 'Seeing Pictures', icon: '👁️', lobeName: 'Occipital Lobe' },
        { id: 'speaking', name: 'Speaking Aloud', icon: '🗣️', lobeName: 'Frontal Lobe' },
        { id: 'thinking', name: 'Thinking & Planning', icon: '💡', lobeName: 'Frontal Lobe' }
      ]
    },

    // Mission 2: Neuron Network (Microscopic Neuron Anatomy)
    mission2_neurons: {
      parts: [
        {
          id: 'cellbody',
          name: 'Cell Body (Soma)',
          definition: 'The main center command station containing the cell nucleus.',
          analogy: 'The computer CPU of the neuron.'
        },
        {
          id: 'dendrites',
          name: 'Dendrites (Fibers)',
          definition: 'Branch-like antennas that receive incoming messages from other neurons.',
          analogy: 'The antennas catching Wi-Fi signals.'
        },
        {
          id: 'axon',
          name: 'Axon (Pathway)',
          definition: 'The long insulated cable that sends electrical signals away at 250 mph.',
          analogy: 'The high-speed fiber-optic cable.'
        },
        {
          id: 'synapse',
          name: 'Synapse (Connection)',
          definition: 'The junction gap where neurons connect and send messages to each other.',
          analogy: 'The spark bridge between two power lines.'
        }
      ]
    },

    // Mission 3: Send the Message (Relay Race Chains)
    mission3_chain: {
      chains: [
        {
          targetSentence: 'DOG RUN FAST',
          tokens: ['DOG', 'RUN', 'FAST'],
          speed: '1.0x Regular Speed',
          nodes: [
            { role: 'Sensor Neuron', icon: '🐶' },
            { role: 'Brain Processor', icon: '⚡' },
            { role: 'Motor Neuron', icon: '🏃' }
          ]
        },
        {
          targetSentence: 'ROBOT TALK ENGLISH',
          tokens: ['ROBOT', 'TALK', 'ENGLISH'],
          speed: '2.5x High Speed',
          nodes: [
            { role: 'Auditory Sensor', icon: '🤖' },
            { role: 'Language Center', icon: '💬' },
            { role: 'Vocal Motor', icon: '🗣️' }
          ]
        },
        {
          targetSentence: 'PRACTICE MAKES STRONGER',
          tokens: ['PRACTICE', 'MAKES', 'STRONGER'],
          speed: '5.0x SUPER SPEED!',
          nodes: [
            { role: 'Effort Signal', icon: '📚' },
            { role: 'Synapse Growth', icon: '🔗' },
            { role: 'Mastery Highway', icon: '🌟' }
          ]
        }
      ]
    },

    // Mission 4: Visualize the Invisible
    mission4_visualize: {
      storyText: 'Close your eyes and visualize. Imagine a blue house with a silver triangular roof. It has two round yellow windows, and a golden lightning rod on top.',
      differencesCount: 4
    },

    // Mission 6: Subject Portals & Heatmaps
    mission6_subjects: {
      subjects: [
        {
          id: 'pe',
          name: 'Physical Education & Sports',
          icon: '⚽',
          activeLobe: 'Frontal Motor Cortex',
          description: 'Controls running, kicking, balancing, and reflex reactions.',
          pathway: 'Sensory Eyes ➔ Motor Cortex ➔ Leg Muscles'
        },
        {
          id: 'music',
          name: 'Music & Rhythm',
          icon: '🎵',
          activeLobe: 'Temporal Auditory Lobe',
          description: 'Processes pitch, harmony, rhythm tempo, and musical memory.',
          pathway: 'Ear Cochlea ➔ Auditory Cortex ➔ Emotional Memory'
        },
        {
          id: 'math',
          name: 'Mathematics & Logic',
          icon: '➕',
          activeLobe: 'Parietal Calculation Lobe',
          description: 'Processes quantities, geometry, spatial shapes, and numbers.',
          pathway: 'Visual Symbols ➔ Parietal Number Line ➔ Solution'
        },
        {
          id: 'reading',
          name: 'English Reading & Stories',
          icon: '📖',
          activeLobe: 'Occipital + Temporal Language',
          description: 'Converts printed letters into spoken sounds and mental pictures.',
          pathway: 'Eyes (Occipital) ➔ Word Sound (Temporal) ➔ Meaning (Frontal)'
        }
      ]
    },

    // Mission 7: Save the Brain (Habits & Fuels)
    mission7_habits: {
      habits: [
        { id: 'sleep', name: '8 to 10 Hours Sleep', icon: '💤', isHealthy: true, reason: 'Brain reorganizes memory and clears waste during sleep!' },
        { id: 'water', name: 'Fresh Water & Nutrients', icon: '💧', isHealthy: true, reason: 'The brain is 75% water and needs hydration!' },
        { id: 'exercise', name: '30 Min Daily Exercise', icon: '🏃', isHealthy: true, reason: 'Pumps fresh oxygen-rich blood to your neurons!' },
        { id: 'reading', name: 'Daily Reading Practice', icon: '📚', isHealthy: true, reason: 'Builds thicker, permanent neural highways!' },
        { id: 'mindful', name: 'Mindful Rest & Calming', icon: '🧘', isHealthy: true, reason: 'Resets stress and recharges focus!' },
        { id: 'screen', name: 'All-Night Phone Screens', icon: '📱', isHealthy: false, reason: 'Blue light drains energy and prevents sleep!' },
        { id: 'sugar', name: 'Eating Pure Sugar & Candy', icon: '🍬', isHealthy: false, reason: 'Causes severe energy crashes in brain cells!' }
      ]
    },

    // Mission 8: Graduation
    mission8_graduation: {
      diplomaTitle: 'CERTIFIED BRAIN SCIENTIST',
      xpAward: 100
    }
  };

  window.BRAIN_DATA = BRAIN_DATA;
  window.BRAIN_HACKERS_DATA = BRAIN_DATA;
})(typeof window !== 'undefined' ? window : global);
