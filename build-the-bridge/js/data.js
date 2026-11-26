/* build-the-bridge/js/data.js
 * Grade 3 & Grade 4 (Units 1-5) Speaking Picture Cards
 * ZERO pre-written sentences given away — ONLY the 3D picture + 1-2 tiny helper words!
 */
(function (root) {
  'use strict';

  var TEAMS = [
    {
      id: 'pink',
      name: 'Emberwing',
      color: '#ff5fa2',
      hex: 0xff5fa2,
      dark: '#c92e70',
      glb: '../assets/3d/monsters/emberwing.glb',
      icon: '../assets/monsters/art/emberwing_growing.webp'
    },
    {
      id: 'blue',
      name: 'Aquafind',
      color: '#4f9dff',
      hex: 0x4f9dff,
      dark: '#1d6bd1',
      glb: '../assets/3d/monsters/aquafind.glb',
      icon: '../assets/monsters/art/aquafind_growing.webp'
    },
    {
      id: 'yellow',
      name: 'Sparktail',
      color: '#ffb320',
      hex: 0xffb320,
      dark: '#c97e00',
      glb: '../assets/3d/monsters/sparktail.glb',
      icon: '../assets/monsters/art/sparktail_growing.webp'
    },
    {
      id: 'green',
      name: 'Florasprout',
      color: '#2fc58a',
      hex: 0x2fc58a,
      dark: '#168d5f',
      glb: '../assets/3d/monsters/florasprout.glb',
      icon: '../assets/monsters/art/florasprout_growing.webp'
    }
  ];

  var UNITS_META = {
    3: {
      1: 'Unit 1 · Inventors',
      2: 'Unit 2 · Harvest',
      3: 'Unit 3 · Money',
      4: 'Unit 4 · Mysteries',
      5: "Unit 5 · Let's Go Back"
    },
    4: {
      1: 'Unit 1 · Brain Power',
      2: 'Unit 2 · Survivors',
      3: 'Unit 3 · Changing Earth',
      4: 'Unit 4 · Teamwork',
      5: 'Unit 5 · Make Some Noise'
    }
  };

  function card(grade, unit, id, word, helper) {
    return {
      grade: grade,
      unit: unit,
      id: 'g' + grade + '-u' + unit + '-' + id,
      word: word,
      helper: helper, // ONLY 1-2 tiny cue words — students invent their OWN full sentence!
      img: '../speak-review/art/describe/g' + grade + '-u' + unit + '-' + id + '.webp'
    };
  }

  var CARDS = {
    3: [
      // Unit 1
      card(3, 1, 'machine', 'machine', 'gears · move'),
      card(3, 1, 'bridge', 'bridge', 'wood · water'),
      card(3, 1, 'wood', 'wood', 'trees · build'),
      card(3, 1, 'messy-room', 'messy room', 'toys · floor'),
      card(3, 1, 'toolbox', 'toolbox', 'hammer · fix'),
      card(3, 1, 'inventor', 'inventor', 'ideas · make'),
      // Unit 2
      card(3, 2, 'full-moon', 'full moon', 'night · yellow'),
      card(3, 2, 'rice-cakes', 'rice cakes', 'eat · soft'),
      card(3, 2, 'fruit-basket', 'fruit basket', 'apples · harvest'),
      card(3, 2, 'farmer', 'farmer', 'farm · grow'),
      card(3, 2, 'thank-you-card', 'thank-you card', 'write · heart'),
      card(3, 2, 'family-dinner', 'family dinner', 'table · together'),
      // Unit 3
      card(3, 3, 'coins', 'coins', 'gold · buy'),
      card(3, 3, 'piggy-bank', 'piggy bank', 'save · money'),
      card(3, 3, 'price-tag', 'price tag', 'shop · how much'),
      card(3, 3, 'cashier', 'cashier', 'shop · pay'),
      card(3, 3, 'wallet', 'wallet', 'pocket · money'),
      card(3, 3, 'shells', 'shells', 'beach · long ago'),
      // Unit 4
      card(3, 4, 'painting', 'painting', 'museum · stolen'),
      card(3, 4, 'museum', 'museum', 'visitors · art'),
      card(3, 4, 'detective', 'detective', 'clues · mystery'),
      card(3, 4, 'volcano', 'volcano', 'hot · ash'),
      card(3, 4, 'thunder', 'thunder', 'loud · storm'),
      card(3, 4, 'sunrise', 'sunrise', 'morning · safe'),
      // Unit 5
      card(3, 5, 'pharaoh', 'pharaoh', 'Egypt · gold'),
      card(3, 5, 'chariot', 'chariot', 'horses · wheels'),
      card(3, 5, 'pyramid', 'pyramid', 'giant · Egypt'),
      card(3, 5, 'time-capsule', 'time capsule', 'future · box'),
      card(3, 5, 'spacecraft', 'spacecraft', 'space · fly'),
      card(3, 5, 'old-newspaper', 'old newspaper', 'read · past')
    ],
    4: [
      // Unit 1
      card(4, 1, 'book', 'book', 'brain · stories'),
      card(4, 1, 'butterfly', 'butterfly', 'wings · change'),
      card(4, 1, 'caterpillar', 'caterpillar', 'leaf · grow'),
      card(4, 1, 'library', 'library', 'quiet · shelves'),
      card(4, 1, 'journey', 'journey', 'map · travel'),
      card(4, 1, 'sleepy-child', 'sleepy child', 'tired · rest'),
      // Unit 2
      card(4, 2, 'owl', 'owl', 'night · eyes'),
      card(4, 2, 'fox', 'fox', 'forest · fast'),
      card(4, 2, 'snake', 'snake', 'long · hide'),
      card(4, 2, 'forest', 'forest', 'trees · homes'),
      card(4, 2, 'birds-nest', "bird's nest", 'sticks · eggs'),
      card(4, 2, 'stick-insect', 'stick insect', 'branch · hide'),
      // Unit 3
      card(4, 3, 'polar-bear', 'polar bear', 'Arctic · swim'),
      card(4, 3, 'melting-ice', 'melting ice', 'warm · sea'),
      card(4, 3, 'arctic-fox', 'Arctic fox', 'white · snow'),
      card(4, 3, 'electric-car', 'electric car', 'clean · no smoke'),
      card(4, 3, 'solar-panel', 'solar panel', 'sun · energy'),
      card(4, 3, 'fish-under-ice', 'fish under ice', 'cold · ocean'),
      // Unit 4
      card(4, 4, 'train', 'train', 'platform · late'),
      card(4, 4, 'theatre-stage', 'stage', 'show · audience'),
      card(4, 4, 'trophy', 'trophy', 'win · team'),
      card(4, 4, 'team', 'team', 'together · help'),
      card(4, 4, 'clock', 'clock', 'time · hurry'),
      card(4, 4, 'nervous-child', 'nervous', 'worried · breath'),
      // Unit 5
      card(4, 5, 'drum', 'drum', 'sticks · loud'),
      card(4, 5, 'orchestra', 'orchestra', 'concert · play'),
      card(4, 5, 'composer', 'composer', 'Beethoven · music'),
      card(4, 5, 'microphone', 'microphone', 'studio · record'),
      card(4, 5, 'coconut-shells', 'coconut shells', 'Foley · horses'),
      card(4, 5, 'thunder-sheet', 'thunder sheet', 'shake · storm')
    ]
  };

  root.BridgeData = {
    TEAMS: TEAMS,
    UNITS_META: UNITS_META,
    CARDS: CARDS
  };
})(window);
