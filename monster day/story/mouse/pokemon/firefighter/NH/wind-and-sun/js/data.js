/**
 * THE WIND AND THE SUN: WEATHER POWERS & THE JACKET CONTEST
 * Curriculum & Interactive Learning Database (CEFR A1–A1+ | Grades 2–4)
 * Authoritative dataset containing video checkpoints, weather physics, reaction race tokens, and teleprompter scripts.
 */

(function(root) {
  'use strict';

  const WIND_AND_SUN_DATA = {
    meta: {
      id: "wind-and-sun",
      title: "☀️ The Wind and the Sun: Weather Powers & The Jacket Contest",
      subtitle: "Aesop's Fable: YouTube Cinema, Weather Powers Lab & Jacket Reaction Race",
      category: "Language & Quests",
      track: "Track 3: Communication & Literature",
      crossTrack: "Track 1: Earth, Weather & Natural Science",
      grade: "Grades 2–4",
      level: "CEFR A1–A1+",
      ageGroup: "7–11",
      duration: "45 min",
      totalStages: 4,
      totalXP: 150,
      videoId: "l0Z8A4u3CtI",
      videoTitle: "The Wind and the Sun (The Fable Cottage)",
      grammarTargets: [
        "Comparative Power: I can [blow / shine]! I am [stronger / hotter] than you!",
        "Cause & Action: It is cold and windy, so he [zips up] his jacket.",
        "Warmth & Contrast: The sun shines gently, so he [takes off] his jacket."
      ],
      lexicon: [
        "wind", "sun", "jacket", "hood", "snow", "rain", "storm",
        "blow", "shine", "cold", "hot", "warm", "zip up", "take off"
      ]
    },

    // STAGE 1: YouTube Video Checkpoints
    checkpoints: [
      {
        id: "cp1",
        stage: 1,
        timestamp: 55, // 00:55
        badgeText: "Checkpoint 1: The Bet",
        question: "What is the contest? Remove the traveler's...",
        hint: "Look at the man walking in the countryside!",
        options: [
          {
            id: "jacket",
            label: "🧥 Warm Jacket",
            icon: "🧥",
            isCorrect: true,
            feedback: "Correct! The Wind and the Sun want to make the traveler take off his jacket!"
          },
          {
            id: "hat",
            label: "🎩 Magic Hat",
            icon: "🎩",
            isCorrect: false,
            feedback: "Not his hat! Look closely at his warm blue winter jacket."
          }
        ],
        xpReward: 15
      },
      {
        id: "cp2",
        stage: 1,
        timestamp: 84, // 01:24
        badgeText: "Checkpoint 2: The Wind's Turn",
        question: "The wind blows hard! Does the jacket come off?",
        hint: "Listen to the howling gale!",
        options: [
          {
            id: "no",
            label: "🥶 No, he zips it up tightly!",
            icon: "🥶",
            isCorrect: true,
            feedback: "That's right! It is freezing cold, so the traveler pulls his jacket tighter!"
          },
          {
            id: "yes",
            label: "☀️ Yes, it blows away!",
            icon: "☀️",
            isCorrect: false,
            feedback: "No! The harder the wind blows, the tighter he holds his jacket!"
          }
        ],
        xpReward: 15
      },
      {
        id: "cp3",
        stage: 1,
        timestamp: 156, // 02:36
        badgeText: "Checkpoint 3: The Sun's Turn",
        question: "The sun shines warm and bright! What does the man do?",
        hint: "He feels the gentle warmth on his shoulders.",
        options: [
          {
            id: "takes_off",
            label: "☀️ He unzips and takes it off!",
            icon: "☀️",
            isCorrect: true,
            feedback: "Brilliant! The gentle, warm sunshine wins the contest!"
          },
          {
            id: "runs",
            label: "❄️ He runs into the snow!",
            icon: "❄️",
            isCorrect: false,
            feedback: "No, he rests under a tree and takes off his warm jacket!"
          }
        ],
        xpReward: 20
      }
    ],

    // STAGE 2: 3D Weather Powers Lab
    weatherLab: {
      windLevels: [
        { level: 1, name: "Gentle Breeze", desc: "Leaves flutter softly.", audio: "breeze", travelReaction: "pleasant" },
        { level: 2, name: "Brisk Gust", desc: "The wind picks up speed.", audio: "gust", travelReaction: "holds_hat" },
        { level: 3, name: "Cold Gale", desc: "The air turns icy cold!", audio: "gale", travelReaction: "zips_up" },
        { level: 4, name: "Snow Storm", desc: "Snow swirls in the air!", audio: "storm", travelReaction: "shivering" },
        { level: 5, name: "Mega Cyclone", desc: "Fierce howling blizzard!", audio: "cyclone", travelReaction: "tucks_tight" }
      ],
      sunLevels: [
        { level: 1, name: "Soft Glow", desc: "Gentle morning light breaks through.", audio: "glow", travelReaction: "cool" },
        { level: 2, name: "Morning Rays", desc: "Golden light warms the air.", audio: "morning", travelReaction: "comfortable" },
        { level: 3, name: "Warm Sunshine", desc: "Pleasant afternoon heat.", audio: "warm", travelReaction: "unzips_jacket" },
        { level: 4, name: "Radiant Heat", desc: "Basking in the golden rays.", audio: "heat", travelReaction: "takes_off_jacket" },
        { level: 5, name: "Blazing Summer", desc: "Glorious golden noon!", audio: "summer", travelReaction: "fans_self" }
      ],
      xpReward: 35
    },

    // STAGE 3: Jacket Reaction Race (20-Second Sorting Drill)
    reactionRace: {
      durationSeconds: 20,
      xpReward: 35,
      zipTokens: [
        "Freezing Snow",
        "Strong Storm",
        "Icy Rain",
        "Cold Blast",
        "Winter Blizzard",
        "Howling Gale"
      ],
      unzipTokens: [
        "Bright Sunshine",
        "Gentle Breeze",
        "Warm Spring Day",
        "Summer Heat",
        "Golden Rays",
        "Peaceful Warmth"
      ]
    },

    // STAGE 4: Fable Teleprompter Studio (Oral Graduation)
    teleprompter: {
      xpReward: 30, // 15 + 15 + 20 + 35 + 35 + 30 = 150 Total XP
      title: "The Wind and the Sun: Moral Debrief",
      lines: [
        {
          id: "tpLine1",
          text: "The cold wind blew hard, but the man zipped up his jacket!"
        },
        {
          id: "tpLine2",
          text: "The gentle sun shone warm, so the man took off his jacket!"
        },
        {
          id: "tpLine3",
          text: "Gentle warmth is stronger than cold force — kindness wins!"
        }
      ]
    },

    // Worksheet / Comic Strip Companion Data
    comicPanels: [
      {
        panel: 1,
        title: "The Great Bet",
        caption: "The Wind and the Sun look down at the traveler.",
        formula: "I am stronger than you! I can blow!"
      },
      {
        panel: 2,
        title: "The Howling Wind",
        caption: "The Wind blows cold storm clouds and icy rain.",
        formula: "It is cold, so he zips up his jacket."
      },
      {
        panel: 3,
        title: "The Gentle Sunshine",
        caption: "The Sun beams warm golden light across the meadow.",
        formula: "It is warm, so he unzips his jacket."
      },
      {
        panel: 4,
        title: "Kindness Wins",
        caption: "The traveler smiles and takes off his heavy coat.",
        formula: "Gentle warmth is stronger than cold force!"
      }
    ]
  };

  root.WIND_AND_SUN_DATA = WIND_AND_SUN_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WIND_AND_SUN_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
