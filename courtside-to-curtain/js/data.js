/* courtside-to-curtain/js/data.js
 * Courtside to Curtain Call: The Festival Adventure (Grade 4 · Unit 4 · CEFR A1-A1+)
 * 13 Complete Playable Nodes across 3 Zones (Basketball Court -> Festival Park -> Grand Theatre)
 * Uses 100% REAL glossy 3D .webp artwork already in the repo (zero SVG character blobs!)
 */
(function (root) {
  'use strict';

  var IMG = {
    // Backdrops
    bgCourt: '../review-g4-teamwork/art/bg_court.webp',
    bgPark: '../review-g4-teamwork/art/bg_team_stage.webp',
    bgPlatform: '../review-g4-show/art/bg_platform.webp',
    bgStage: '../review-g4-show/art/bg_stage.webp',

    // Real 3D Characters & Props
    coach: '../review-g4-show/art/c_mr_williams.webp',
    audience: '../review-g4-teamwork/art/o_team_hands.webp',
    basket: '../review-g4-teamwork/art/o_basket.webp',
    basketball: '../review-g4-teamwork/art/o_basketball.webp',
    costumes: '../review-g4-show/art/c_harry_tree.webp',
    court: '../review-g4-teamwork/art/o_court.webp',
    player: '../review-g4-teamwork/art/o_shooting.webp',
    theatre: '../speak-review/art/describe/g4-u4-theatre-stage.webp',
    train: '../review-g4-show/art/o_train.webp',
    dancers: '../review-g4-teamwork/art/o_dancers.webp',
    music: '../review-g4-teamwork/art/o_orchestra.webp',
    mom: '../review-g4-show/art/c_mom.webp',
    harryTree: '../review-g4-show/art/c_harry_tree.webp',
    viola: '../review-g4-show/art/c_lynn.webp',
    sebastian: '../review-g4-show/art/c_arush.webp',
    riya: '../review-g4-show/art/c_riya.webp',
    clock: '../review-g4-show/art/o_clock.webp',
    curtain: '../review-g4-show/art/o_curtain.webp',
    trophy: '../speak-review/art/describe/g4-u4-trophy.webp',
    team: '../speak-review/art/describe/g4-u4-team.webp',
    drum: '../speak-review/art/describe/g4-u5-drum.webp',
    mic: '../speak-review/art/describe/g4-u5-microphone.webp',
    football: '../review-g4-teamwork/art/o_football.webp',
    score: '../review-g4-teamwork/art/o_score.webp',
    polarBear: '../speak-review/art/describe/g4-u3-polar-bear.webp',
    guitar: '../speak-review/art/describe/g4-u5-composer.webp'
  };

  var TEAMS = [
    {
      id: 'pink', name: 'Emberwing', color: '#ff5fa2', dark: '#c92e70', soft: '#ffe6f1',
      img: '../assets/monsters/art/emberwing_growing.webp',
      cheer: '../assets/monsters/art/emberwing_growing_cheer.webp',
      oops: '../assets/monsters/art/emberwing_growing_oops.webp',
      think: '../assets/monsters/art/emberwing_growing_think.webp'
    },
    {
      id: 'blue', name: 'Aquafind', color: '#4f9dff', dark: '#1d6bd1', soft: '#e4f1ff',
      img: '../assets/monsters/art/aquafind_growing.webp',
      cheer: '../assets/monsters/art/aquafind_growing_cheer.webp',
      oops: '../assets/monsters/art/aquafind_growing_oops.webp',
      think: '../assets/monsters/art/aquafind_growing_think.webp'
    },
    {
      id: 'yellow', name: 'Sparktail', color: '#ffb320', dark: '#c97e00', soft: '#fff4d6',
      img: '../assets/monsters/art/sparktail_growing.webp',
      cheer: '../assets/monsters/art/sparktail_growing_cheer.webp',
      oops: '../assets/monsters/art/sparktail_growing_oops.webp',
      think: '../assets/monsters/art/sparktail_growing_think.webp'
    },
    {
      id: 'green', name: 'Florasprout', color: '#2fc58a', dark: '#168d5f', soft: '#e0faef',
      img: '../assets/monsters/art/florasprout_growing.webp',
      cheer: '../assets/monsters/art/florasprout_growing_cheer.webp',
      oops: '../assets/monsters/art/florasprout_growing_oops.webp',
      think: '../assets/monsters/art/florasprout_growing_think.webp'
    }
  ];

  var ZONES = {
    1: { id: 1, name: 'Sunny Basketball Court', color: '#ffb320', dark: '#c97e00', icon: '🏀', badge: 'Coach Hat', bg: IMG.bgCourt },
    2: { id: 2, name: 'Festival Park Walkway', color: '#2fc58a', dark: '#168d5f', icon: '🎪', badge: 'Park Ribbon', bg: IMG.bgPark },
    3: { id: 3, name: 'The Grand Theatre', color: '#ff5fa2', dark: '#c92e70', icon: '🎭', badge: 'Stage Bow-Tie', bg: IMG.bgStage }
  };

  /* 13 Milestone Nodes on the Adventure Map (x,y in % of map canvas) */
  var NODES = [
    // ZONE 1: Sunny Basketball Court (1-6)
    { id: 1, zone: 1, type: 'match', title: 'Match the Cards!', short: 'Word Match', icon: '🃏', x: 10, y: 74, intro: 'Match each picture to the right word, then say it aloud!' },
    { id: 2, zone: 1, type: 'court', title: 'Explore the Court!', short: 'Court Map', icon: '🏀', x: 19, y: 50, intro: 'Place all 5 basketball court labels on the glowing spots!' },
    { id: 3, zone: 1, type: 'missing', title: 'Spell & Shoot!', short: 'Missing Letter', icon: '🔤', x: 26, y: 27, intro: 'Pick the missing letter to shoot the basketball through the hoop!' },
    { id: 4, zone: 1, type: 'odd', title: 'Spot the Intruder!', short: 'Odd One Out', icon: '🎈', x: 35, y: 46, intro: 'Three cards belong together. Tap the one that does NOT belong!' },
    { id: 5, zone: 1, type: 'meaning', title: 'What Does It Mean?', short: 'Meanings', icon: '📜', x: 32, y: 74, intro: 'Listen to the word and pick its simple English meaning!' },
    { id: 6, zone: 1, type: 'phonics', title: 'Phonics Hunt: OR', short: 'OR Phonics', icon: '🫧', x: 44, y: 60, intro: 'Catch every bubble with OR, then compare SPORT and WORK!' },

    // ZONE 2: Festival Park Walkway (7-10)
    { id: 7, zone: 2, type: 'video_choice', title: 'What Are They Doing?', short: 'Action Clips', icon: '🎬', x: 52, y: 34, intro: 'Watch the live action loop and pick the matching full sentence!' },
    { id: 8, zone: 2, type: 'unscramble', title: 'Build the Bridge!', short: 'Unscramble', icon: '🌉', x: 60, y: 58, intro: 'Put the wooden word planks in order to cross the park river!' },
    { id: 9, zone: 2, type: 'whoami', title: 'Who Am I?', short: '3 Clues', icon: '🕵️', x: 66, y: 28, intro: 'Listen to the 3 clues and guess who is hiding behind the curtain!' },
    { id: 10, zone: 2, type: 'strange', title: 'Spot What Is Strange!', short: 'Look Carefully', icon: '🔍', x: 73, y: 54, intro: 'Look carefully at the scene! Tap or choose the funny strange detail!' },

    // ZONE 3: The Grand Theatre (11-13)
    { id: 11, zone: 3, type: 'puzzle', title: 'Fix the Torn Poster!', short: 'Poster Puzzle', icon: '🧩', x: 81, y: 32, intro: 'Snap the missing poster pieces in place, then answer the question!' },
    { id: 12, zone: 3, type: 'program', title: 'Festival Notes!', short: 'Program Fill', icon: '🎟️', x: 85, y: 66, intro: 'Stamp the missing story words onto the Golden Festival Program!' },
    { id: 13, zone: 3, type: 'sequence', title: 'Order the Festival Day!', short: 'Story Order', icon: '🌟', x: 92, y: 42, intro: 'Put the 4 Festival Day story cards in order for the Grand Curtain Call!' }
  ];

  var ACTIVITIES = {
    1: {
      rounds: [
        {
          label: 'Round 1 · On the Court & Stage',
          pairs: [
            { id: 'coach', word: 'Coach', img: IMG.coach, say: 'This is the coach.' },
            { id: 'audience', word: 'Audience', img: IMG.audience, say: 'The audience watches the show.' },
            { id: 'basket', word: 'Basket', img: IMG.basket, say: 'Throw the ball into the basket.' },
            { id: 'costumes', word: 'Costumes', img: IMG.costumes, say: 'They wear fun costumes.' }
          ]
        },
        {
          label: 'Round 2 · Around the Festival',
          pairs: [
            { id: 'court', word: 'Court', img: IMG.court, say: 'We play on the court.' },
            { id: 'player', word: 'Player', img: IMG.player, say: 'The player shoots the ball.' },
            { id: 'theatre', word: 'Theatre', img: IMG.theatre, say: 'The show is at the theatre.' },
            { id: 'train', word: 'Train', img: IMG.train, say: 'We travel on the train.' }
          ]
        }
      ]
    },

    2: {
      targets: [
        { id: 'court', label: 'Court', say: 'This is the basketball court.', x: 50, y: 88, hint: 'Whole playing floor' },
        { id: 'basket', label: 'Basket', say: 'Shoot into the basket!', x: 84, y: 50, hint: 'Hoop and net' },
        { id: 'half', label: 'Half-court line', say: 'The half-court line is in the middle.', x: 50, y: 50, hint: 'Middle dividing line' },
        { id: 'freethrow', label: 'Free-throw line', say: 'Stand at the free-throw line.', x: 24, y: 50, hint: 'Line inside the key' },
        { id: 'threepoint', label: 'Three-point line', say: 'The curved line is the three-point line.', x: 35, y: 18, hint: 'Curved big arc' }
      ]
    },

    3: {
      items: [
        { word: 'BASKET', display: 'B A S _ E T', answer: 'K', options: ['K', 'N', 'R'], img: IMG.basket, say: 'Basket! Throw the ball into the basket!' },
        { word: 'COACH', display: 'C O _ C H', answer: 'A', options: ['A', 'E', 'U'], img: IMG.coach, say: 'Coach! The coach helps the players!' },
        { word: 'COSTUMES', display: 'C O S T _ M E S', answer: 'U', options: ['O', 'U', 'I'], img: IMG.costumes, say: 'Costumes! They wear colourful costumes!' },
        { word: 'THEATRE', display: 'T H E A _ R E', answer: 'T', options: ['P', 'D', 'T'], img: IMG.theatre, say: 'Theatre! The audience is at the theatre!' }
      ]
    },

    4: {
      items: [
        {
          prompt: 'Which one is the odd one out?',
          answer: 3,
          why: 'Place for a show, not basketball!',
          say: 'Theatre is the odd one out. It is a place for a show!',
          cards: [
            { word: 'Basket', img: IMG.basket },
            { word: 'Court', img: IMG.court },
            { word: 'Coach', img: IMG.coach },
            { word: 'Theatre', img: IMG.theatre }
          ]
        },
        {
          prompt: 'Spot the intruder on this shelf!',
          answer: 3,
          why: 'Part of a basketball court!',
          say: 'Free-throw line is the odd one out. It is on a basketball court!',
          cards: [
            { word: 'Costumes', img: IMG.costumes },
            { word: 'Audience', img: IMG.audience },
            { word: 'Stage', img: IMG.theatre },
            { word: 'Free-throw line', img: IMG.court }
          ]
        },
        {
          prompt: 'Three are actions — which one is NOT?',
          answer: 3,
          why: 'A thing, not an action!',
          say: 'Basket is the odd one out. It is a thing, not an action!',
          cards: [
            { word: 'Playing', img: IMG.player },
            { word: 'Running', img: IMG.team },
            { word: 'Dancing', img: IMG.dancers },
            { word: 'Basket', img: IMG.basket }
          ]
        },
        {
          prompt: 'Three are story characters — spot the object!',
          answer: 3,
          why: 'An object, not a character!',
          say: 'Whistle is the odd one out. It is an object, not a character!',
          cards: [
            { word: 'Viola', img: IMG.viola },
            { word: 'Sebastian', img: IMG.sebastian },
            { word: 'Harry', img: IMG.harryTree },
            { word: 'Whistle', img: IMG.score }
          ]
        }
      ]
    },

    5: {
      items: [
        {
          word: 'Audience', img: IMG.audience,
          options: [
            { text: 'People watching a show', icon: '👏', ok: true },
            { text: 'People training a team', icon: '🏀', ok: false },
            { text: 'Clothes for a play', icon: '👗', ok: false }
          ],
          say: 'The audience are the people watching a show.'
        },
        {
          word: 'Coach', img: IMG.coach,
          options: [
            { text: 'A line on the court', icon: '📏', ok: false },
            { text: 'A person who trains players', icon: '📣', ok: true },
            { text: 'A ticket for a train', icon: '🎟️', ok: false }
          ],
          say: 'A coach is a person who trains players.'
        },
        {
          word: 'Costumes', img: IMG.costumes,
          options: [
            { text: 'Special clothes for a show', icon: '🎭', ok: true },
            { text: 'Shoes for running fast', icon: '👟', ok: false },
            { text: 'Seats in a theatre', icon: '🪑', ok: false }
          ],
          say: 'Costumes are special clothes for a show.'
        },
        {
          word: 'Court', img: IMG.court,
          options: [
            { text: 'A big musical instrument', icon: '🥁', ok: false },
            { text: 'A stage with red curtains', icon: '🎪', ok: false },
            { text: 'A place to play basketball', icon: '🏀', ok: true }
          ],
          say: 'A court is a place to play basketball.'
        }
      ]
    },

    6: {
      bubbles: [
        { word: 'SPORT', hasOr: true, chest: 'sport' },
        { word: 'SHORT', hasOr: true, chest: 'sport' },
        { word: 'TEAM', hasOr: false, chest: null },
        { word: 'MORE', hasOr: true, chest: 'sport' },
        { word: 'DANCE', hasOr: false, chest: null },
        { word: 'WORK', hasOr: true, chest: 'work' },
        { word: 'CORN', hasOr: true, chest: 'sport' },
        { word: 'PLAY', hasOr: false, chest: null }
      ],
      sortWords: [
        { word: 'SPORT', chest: 'sport' },
        { word: 'SHORT', chest: 'sport' },
        { word: 'MORE', chest: 'sport' },
        { word: 'CORN', chest: 'sport' },
        { word: 'WORK', chest: 'work' }
      ]
    },

    7: {
      items: [
        {
          scene: 'act7_basketball',
          video: './assets/videos/act7_basketball.mp4',
          question: 'Watch closely! What are they doing?',
          answer: 0,
          options: [
            'They are playing basketball.',
            'They are dancing.',
            'They are running.',
            'They are playing music.'
          ]
        },
        {
          scene: 'act7_dancing',
          video: './assets/videos/act7_dancing.mp4',
          question: 'Watch the festival park! What are they doing?',
          answer: 1,
          options: [
            'They are playing basketball.',
            'They are dancing.',
            'They are sleeping.',
            'They are eating lunch.'
          ]
        },
        {
          scene: 'act7_music',
          video: './assets/videos/act7_music.mp4',
          question: 'Listen and watch! What are they doing?',
          answer: 3,
          options: [
            'They are running.',
            'They are reading books.',
            'They are jumping.',
            'They are playing music.'
          ]
        },
        {
          scene: 'act7_running',
          video: './assets/videos/act7_running.mp4',
          question: 'Look at the track! What are they doing?',
          answer: 2,
          options: [
            'They are dancing.',
            'They are playing music.',
            'They are running.',
            'They are watching a show.'
          ]
        }
      ]
    },

    8: {
      items: [
        { words: ['They', 'are', 'playing', 'basketball.'], scrambled: ['playing', 'are', 'They', 'basketball.'] },
        { words: ['The', 'audience', 'is', 'watching', 'quietly.'], scrambled: ['watching', 'The', 'is', 'audience', 'quietly.'] },
        { words: ['They', 'are', 'wearing', 'funny', 'costumes.'], scrambled: ['wearing', 'are', 'costumes.', 'They', 'funny'] },
        { words: ['The', 'coach', 'is', 'helping', 'the', 'players.'], scrambled: ['helping', 'coach', 'The', 'is', 'players.', 'the'] }
      ]
    },

    9: {
      items: [
        {
          clues: ['I train a team.', 'I help players.', 'I give advice. Who am I?'],
          answer: 0,
          revealImg: IMG.coach,
          revealTitle: 'Coach!',
          options: ['Coach', 'Audience', 'Tree']
        },
        {
          clues: ['We sit in seats.', 'We watch the stage.', 'We clap at the end! Who are we?'],
          answer: 1,
          revealImg: IMG.audience,
          revealTitle: 'Audience!',
          options: ['Coach', 'Audience', 'Basketball']
        },
        {
          clues: ['I wear sports shoes.', 'I run on the court.', 'I throw the ball into the basket! Who am I?'],
          answer: 2,
          revealImg: IMG.player,
          revealTitle: 'Player!',
          options: ['Stage Director', 'Audience', 'Player']
        }
      ]
    },

    10: {
      items: [
        {
          scene: 'strange_court',
          title: 'Scene 1 · Basketball Court',
          question: 'Look carefully! What is strange in the picture?',
          hotspot: { x: 64, y: 54, r: 18 },
          answer: 0,
          options: [
            'A composer is playing a grand piano on the court.',
            'Players are wearing sports shoes.',
            'There is a basket on the court.'
          ]
        },
        {
          scene: 'strange_theatre',
          title: 'Scene 2 · Theatre Audience',
          question: 'Look carefully! What is strange in the theatre?',
          hotspot: { x: 28, y: 66, r: 19 },
          answer: 1,
          options: [
            'The audience is looking at the stage.',
            'A giant polar bear is eating popcorn in the front row.',
            'There are bright curtains on the stage.'
          ]
        },
        {
          scene: 'strange_bench',
          title: 'Scene 3 · Team Bench',
          question: 'Look carefully! What is strange about the coach?',
          hotspot: { x: 52, y: 74, r: 18 },
          answer: 2,
          options: [
            'The coach has a whistle.',
            'The players are listening to the coach.',
            'The coach is wearing giant flippers on the court.'
          ]
        }
      ]
    },

    11: {
      rounds: [
        {
          title: 'Poster 1 · Grand Theatre Stage',
          img: IMG.bgStage,
          missing: [1, 3], // 2x2 grid indices 0..3
          question: 'Where are the children now?',
          answer: 0,
          options: ['At the theatre', 'On the basketball court'],
          say: 'They are at the theatre!'
        },
        {
          title: 'Poster 2 · Sunny Basketball Court',
          img: IMG.bgCourt,
          missing: [0, 2],
          question: 'What can they do here?',
          answer: 0,
          options: ['Play basketball', 'Watch a train'],
          say: 'They can play basketball on the court!'
        }
      ]
    },

    12: {
      items: [
        { sentence: 'Harry played the role of ______.', answer: 1, options: ['Viola', 'The Tree', 'Sebastian'], img: IMG.harryTree, say: 'Harry played the role of the tree!' },
        { sentence: 'Harry travelled to the festival with his ______.', answer: 0, options: ['Mother', 'Coach', 'Dog'], img: IMG.mom, say: 'Harry travelled to the festival with his mother.' },
        { sentence: 'On the way to the festival, the ______ suddenly stopped!', answer: 2, options: ['Bus', 'Bicycle', 'Train'], img: IMG.train, say: 'On the way to the festival, the train suddenly stopped!' },
        { sentence: 'The children wore special ______ on stage.', answer: 0, options: ['Costumes', 'Basketballs', 'Whistles'], img: IMG.costumes, say: 'The children wore special costumes on stage!' }
      ]
    },

    13: {
      cards: [
        { step: 1, text: 'Harry and his mother leave home.', img: IMG.mom },
        { step: 2, text: 'Suddenly, the train stops on the tracks!', img: IMG.train },
        { step: 3, text: 'They arrive at the theatre and put on costumes.', img: IMG.harryTree },
        { step: 4, text: 'The children perform the show on stage!', img: IMG.theatre }
      ]
    }
  };

  root.CTCData = {
    IMG: IMG,
    TEAMS: TEAMS,
    ZONES: ZONES,
    NODES: NODES,
    ACTIVITIES: ACTIVITIES
  };
})(window);
