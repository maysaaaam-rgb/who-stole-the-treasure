/**
 * CAT VS DOG: PREPOSITION CATAPULT — ARSENAL & CURRICULUM DATA
 * Primary ESL / CEFR A1 | Prepositions of Place, Direction & Movement
 * 100% Zero external dependencies.
 */
(function(root) {
  'use strict';

  const WEAPONS = {
    fish: {
      id: 'fish',
      name: 'Stinky Fish',
      icon: '🐟',
      damage: 20,
      gravityMult: 1.0,
      speedMult: 0.23,
      bounces: 0,
      color: '#38bdf8',
      trailColor: 'rgba(56, 189, 248, 0.45)',
      desc: 'Standard trajectory (20 DMG).'
    },
    balloon: {
      id: 'balloon',
      name: 'Water Balloon',
      icon: '🎈',
      damage: 15,
      gravityMult: 0.62,
      speedMult: 0.21,
      bounces: 0,
      color: '#06b6d4',
      trailColor: 'rgba(6, 182, 212, 0.45)',
      desc: 'Floaty flight; dampens wind speed (15 DMG).'
    },
    anvil: {
      id: 'anvil',
      name: 'Heavy Anvil',
      icon: '🪨',
      damage: 35,
      gravityMult: 1.55,
      speedMult: 0.26,
      bounces: 0,
      color: '#94a3b8',
      trailColor: 'rgba(148, 163, 184, 0.55)',
      desc: 'Steep arc, high mass, heavy impact (35 DMG).'
    },
    bouncy: {
      id: 'bouncy',
      name: 'Bouncy Ball',
      icon: '🎾',
      damage: 18,
      gravityMult: 1.0,
      speedMult: 0.24,
      bounces: 1,
      color: '#84cc16',
      trailColor: 'rgba(132, 204, 22, 0.45)',
      desc: 'Elastic rubber; bounces once off surfaces (18 DMG).'
    }
  };

  const PREPOSITION_CHALLENGES = [
    {
      id: "prep-1",
      icon: "🧱",
      prompt: "Where must the projectile fly to hit the opponent?",
      options: ["OVER the fence", "UNDER the fence", "INTO the ground", "BEHIND the fence"],
      correct: 0,
      targetPrep: "OVER",
      reinforce: "Brilliant! The projectile flies OVER the tall wooden fence!"
    },
    {
      id: "prep-2",
      icon: "🗑️",
      prompt: "The Alley Cat is sitting _______ the metal trash bin.",
      options: ["ON TOP OF", "UNDER", "THROUGH", "INSIDE"],
      correct: 0,
      targetPrep: "ON TOP OF",
      reinforce: "Correct! The cat sits comfortably ON TOP OF the bin!"
    },
    {
      id: "prep-3",
      icon: "🥣",
      prompt: "The bone landed directly _______ the dog's food bowl.",
      options: ["INTO", "BEHIND", "UNDER", "ACROSS"],
      correct: 0,
      targetPrep: "INTO",
      reinforce: "Direct strike! The bone drops straight INTO the bowl!"
    },
    {
      id: "prep-4",
      icon: "🌳",
      prompt: "The Yard Dog is waiting _______ the tall fence in the garden.",
      options: ["BEHIND", "UNDER", "BETWEEN", "ON"],
      correct: 0,
      targetPrep: "BEHIND",
      reinforce: "Yes! The dog stands BEHIND the protective wooden fence!"
    },
    {
      id: "prep-5",
      icon: "🚀",
      prompt: "The cat catapulted the fish _______ the whole alley!",
      options: ["ACROSS", "UNDER", "INSIDE", "DOWN"],
      correct: 0,
      targetPrep: "ACROSS",
      reinforce: "Super power! It sails smoothly ACROSS the entire alley!"
    },
    {
      id: "prep-6",
      icon: "📦",
      prompt: "A stray mouse is hiding safely _______ the wooden bench.",
      options: ["UNDER", "OVER", "ACROSS", "THROUGH"],
      correct: 0,
      targetPrep: "UNDER",
      reinforce: "Spot on! The mouse hides safely UNDER the park bench!"
    },
    {
      id: "prep-7",
      icon: "🚪",
      prompt: "The fence stands firmly _______ the cat and the dog.",
      options: ["BETWEEN", "INSIDE", "ACROSS", "UNDER"],
      correct: 0,
      targetPrep: "BETWEEN",
      reinforce: "Exact! The wooden barrier stands BETWEEN the two rivals!"
    },
    {
      id: "prep-8",
      icon: "💨",
      prompt: "The projectile zooms rapidly _______ the night air!",
      options: ["THROUGH", "UNDER", "BEHIND", "ON TOP OF"],
      correct: 0,
      targetPrep: "THROUGH",
      reinforce: "High speed! Whistling fast THROUGH the crisp night air!"
    },
    {
      id: "prep-9",
      icon: "🎾",
      prompt: "The tennis ball bounced _______ the grass lawn.",
      options: ["ON", "INTO", "UNDER", "THROUGH"],
      correct: 0,
      targetPrep: "ON",
      reinforce: "Nice bounce! It bounces cleanly ON the green yard grass!"
    },
    {
      id: "prep-10",
      icon: "🪜",
      prompt: "The streetlamp rises high _______ the cobblestone street.",
      options: ["ABOVE", "UNDER", "INTO", "BEHIND"],
      correct: 0,
      targetPrep: "ABOVE",
      reinforce: "Great lighting! The lamp shines bright ABOVE the street!"
    },
    {
      id: "prep-11",
      icon: "🐾",
      prompt: "The little puppy ran _______ the yard to catch the ball.",
      options: ["INTO", "UNDER", "BEHIND", "BETWEEN"],
      correct: 0,
      targetPrep: "INTO",
      reinforce: "Swift paws! The puppy dashes enthusiastically INTO the yard!"
    },
    {
      id: "prep-12",
      icon: "🏠",
      prompt: "The red doghouse stands _______ the tall oak tree.",
      options: ["NEXT TO", "THROUGH", "ACROSS", "INTO"],
      correct: 0,
      targetPrep: "NEXT TO",
      reinforce: "Perfect location! The doghouse rests right NEXT TO the tree!"
    }
  ];

  const AI_DIFFICULTIES = {
    rookie: {
      label: 'Rookie',
      errorVariance: 9.0,
      windCompensation: 0.75,
      delayMs: 1100
    },
    pro: {
      label: 'Pro',
      errorVariance: 3.5,
      windCompensation: 1.1,
      delayMs: 850
    },
    master: {
      label: 'Master',
      errorVariance: 1.0,
      windCompensation: 1.35,
      delayMs: 650
    }
  };

  root.CAT_VS_DOG_DATA = {
    weapons: WEAPONS,
    challenges: PREPOSITION_CHALLENGES,
    aiDifficulties: AI_DIFFICULTIES
  };
})(typeof window !== 'undefined' ? window : global);
