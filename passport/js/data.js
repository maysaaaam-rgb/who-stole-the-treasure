/* My Passport — Curriculum Database, Sentence Frames & Stamp Catalog
   Follows A1 ESL/CLIL standards (Units 1-4 vocabulary)
   Child safety: IDs and pre-approved words only. Zero free typing.
*/
(function (root) {
  'use strict';

  var PassportData = root.PassportData = root.PassportData || {};

  /* 1. SENTENCE FRAMES (All About Me) */
  var FRAMES = [
    {
      id: 'fav_animal',
      label: 'Favourite Animal',
      icon: '🐾',
      template: 'My favourite animal is a {pick}.',
      q: 'What is your favourite animal?',
      choices: [
        { id: 'cat', text: 'cat', icon: '🐱', audio: 'My favourite animal is a cat.' },
        { id: 'dog', text: 'dog', icon: '🐶', audio: 'My favourite animal is a dog.' },
        { id: 'rabbit', text: 'rabbit', icon: '🐰', audio: 'My favourite animal is a rabbit.' },
        { id: 'dolphin', text: 'dolphin', icon: '🐬', audio: 'My favourite animal is a dolphin.' },
        { id: 'lion', text: 'lion', icon: '🦁', audio: 'My favourite animal is a lion.' },
        { id: 'panda', text: 'panda', icon: '🐼', audio: 'My favourite animal is a panda.' },
        { id: 'dragon', text: 'dragon', icon: '🐲', audio: 'My favourite animal is a dragon.' },
        { id: 'penguin', text: 'penguin', icon: '🐧', audio: 'My favourite animal is a penguin.' },
        { id: 'koala', text: 'koala', icon: '🐨', audio: 'My favourite animal is a koala.' },
        { id: 'fox', text: 'fox', icon: '🦊', audio: 'My favourite animal is a fox.' },
        { id: 'owl', text: 'owl', icon: '🦉', audio: 'My favourite animal is an owl.' },
        { id: 'whale', text: 'whale', icon: '🐳', audio: 'My favourite animal is a whale.' }
      ]
    },
    {
      id: 'fav_colour',
      label: 'Favourite Colour',
      icon: '🎨',
      template: 'My favourite colour is {pick}.',
      q: 'What is your favourite colour?',
      choices: [
        { id: 'blue', text: 'blue', icon: '💙', audio: 'My favourite colour is blue.' },
        { id: 'red', text: 'red', icon: '❤️', audio: 'My favourite colour is red.' },
        { id: 'green', text: 'green', icon: '💚', audio: 'My favourite colour is green.' },
        { id: 'yellow', text: 'yellow', icon: '💛', audio: 'My favourite colour is yellow.' },
        { id: 'purple', text: 'purple', icon: '💜', audio: 'My favourite colour is purple.' },
        { id: 'orange', text: 'orange', icon: '🧡', audio: 'My favourite colour is orange.' },
        { id: 'pink', text: 'pink', icon: '💖', audio: 'My favourite colour is pink.' },
        { id: 'golden', text: 'gold', icon: '⭐', audio: 'My favourite colour is gold.' },
        { id: 'emerald', text: 'emerald', icon: '💎', audio: 'My favourite colour is emerald.' },
        { id: 'silver', text: 'silver', icon: '🪙', audio: 'My favourite colour is silver.' }
      ]
    },
    {
      id: 'like_hobby',
      label: 'Things I Like',
      icon: '⭐',
      template: 'I like {pick}.',
      q: 'What do you like to do?',
      choices: [
        { id: 'reading', text: 'reading books', icon: '📚', audio: 'I like reading books.' },
        { id: 'drawing', text: 'drawing pictures', icon: '🎨', audio: 'I like drawing pictures.' },
        { id: 'swimming', text: 'swimming in the sea', icon: '🏊', audio: 'I like swimming in the sea.' },
        { id: 'singing', text: 'singing songs', icon: '🎤', audio: 'I like singing songs.' },
        { id: 'football', text: 'playing football', icon: '⚽', audio: 'I like playing football.' },
        { id: 'gaming', text: 'playing games', icon: '🎮', audio: 'I like playing games.' },
        { id: 'dancing', text: 'dancing to music', icon: '💃', audio: 'I like dancing to music.' },
        { id: 'building', text: 'building robots', icon: '🤖', audio: 'I like building robots.' },
        { id: 'cooking', text: 'making pancakes', icon: '🥞', audio: 'I like making pancakes.' },
        { id: 'cycling', text: 'riding my bike', icon: '🚲', audio: 'I like riding my bike.' }
      ]
    },
    {
      id: 'can_action',
      label: 'Super Talents',
      icon: '✨',
      template: 'I can {pick}.',
      q: 'What can you do?',
      choices: [
        { id: 'swim_fast', text: 'swim fast', icon: '🏊', audio: 'I can swim fast.' },
        { id: 'speak_english', text: 'speak English', icon: '🗣️', audio: 'I can speak English.' },
        { id: 'run_fast', text: 'run really fast', icon: '🏃', audio: 'I can run really fast.' },
        { id: 'bake_cookies', text: 'bake sweet cookies', icon: '🍪', audio: 'I can bake sweet cookies.' },
        { id: 'jump_high', text: 'jump very high', icon: '🦘', audio: 'I can jump very high.' },
        { id: 'play_piano', text: 'play the piano', icon: '🎹', audio: 'I can play the piano.' },
        { id: 'ride_scooter', text: 'ride a scooter', icon: '🛴', audio: 'I can ride a scooter.' },
        { id: 'solve_puzzles', text: 'solve clever puzzles', icon: '🧩', audio: 'I can solve clever puzzles.' },
        { id: 'whistle', text: 'whistle like a bird', icon: '🐦', audio: 'I can whistle like a bird.' }
      ]
    },
    {
      id: 'weekend',
      label: 'At the Weekend',
      icon: '🏖️',
      template: 'At the weekend I {pick}.',
      q: 'What do you do at the weekend?',
      choices: [
        { id: 'visit_park', text: 'visit the park with friends', icon: '🌳', audio: 'At the weekend I visit the park with friends.' },
        { id: 'watch_cartoons', text: 'watch funny cartoons', icon: '📺', audio: 'At the weekend I watch funny cartoons.' },
        { id: 'play_outside', text: 'play outside in the sun', icon: '☀️', audio: 'At the weekend I play outside in the sun.' },
        { id: 'visit_grandma', text: 'visit my grandparents', icon: '🏡', audio: 'At the weekend I visit my grandparents.' },
        { id: 'eat_icecream', text: 'eat delicious ice cream', icon: '🍦', audio: 'At the weekend I eat delicious ice cream.' },
        { id: 'fly_kite', text: 'fly a colorful kite', icon: '🪁', audio: 'At the weekend I fly a colorful kite.' },
        { id: 'go_beach', text: 'explore the sandy beach', icon: '🏖️', audio: 'At the weekend I explore the sandy beach.' }
      ]
    },
    {
      id: 'fav_food',
      label: 'Favourite Food',
      icon: '🍕',
      template: 'My favourite food is {pick}.',
      q: 'What is your favourite food?',
      choices: [
        { id: 'pizza', text: 'warm cheesy pizza', icon: '🍕', audio: 'My favourite food is warm cheesy pizza.' },
        { id: 'apples', text: 'crispy red apples', icon: '🍎', audio: 'My favourite food is crispy red apples.' },
        { id: 'pasta', text: 'pasta with tomato sauce', icon: '🍝', audio: 'My favourite food is pasta with tomato sauce.' },
        { id: 'icecream', text: 'strawberry ice cream', icon: '🍦', audio: 'My favourite food is strawberry ice cream.' },
        { id: 'watermelon', text: 'sweet watermelon', icon: '🍉', audio: 'My favourite food is sweet watermelon.' },
        { id: 'pancakes', text: 'fluffy golden pancakes', icon: '🥞', audio: 'My favourite food is fluffy golden pancakes.' },
        { id: 'sandwiches', text: 'cheese and tomato sandwiches', icon: '🥪', audio: 'My favourite food is cheese and tomato sandwiches.' },
        { id: 'strawberries', text: 'fresh strawberries', icon: '🍓', audio: 'My favourite food is fresh strawberries.' }
      ]
    },
    {
      id: 'future_job',
      label: 'When I Grow Up',
      icon: '🚀',
      template: 'When I grow up, I want to be a {pick}.',
      q: 'What do you want to be when you grow up?',
      choices: [
        { id: 'astronaut', text: 'brave astronaut', icon: '🧑‍🚀', audio: 'When I grow up, I want to be a brave astronaut.' },
        { id: 'inventor', text: 'clever inventor', icon: '🔬', audio: 'When I grow up, I want to be a clever inventor.' },
        { id: 'teacher', text: 'kind teacher', icon: '👩‍🏫', audio: 'When I grow up, I want to be a kind teacher.' },
        { id: 'artist', text: 'creative artist', icon: '🎨', audio: 'When I grow up, I want to be a creative artist.' },
        { id: 'pilot', text: 'friendly airplane pilot', icon: '✈️', audio: 'When I grow up, I want to be a friendly airplane pilot.' },
        { id: 'vet', text: 'caring animal doctor', icon: '🐾', audio: 'When I grow up, I want to be a caring animal doctor.' },
        { id: 'chef', text: 'master chef', icon: '👨‍🍳', audio: 'When I grow up, I want to be a master chef.' },
        { id: 'explorer', text: 'world explorer', icon: '🧭', audio: 'When I grow up, I want to be a world explorer.' }
      ]
    },
    {
      id: 'monster_likes',
      label: 'My Monster Likes',
      icon: '👾',
      template: 'My monster likes {pick}.',
      q: 'What does your monster like?',
      choices: [
        { id: 'warm_cocoa', text: 'warm cups of cocoa', icon: '☕', audio: 'My monster likes warm cups of cocoa.' },
        { id: 'star_candy', text: 'sweet star candies', icon: '🍬', audio: 'My monster likes sweet star candies.' },
        { id: 'bedtime_stories', text: 'cosy bedtime stories', icon: '📖', audio: 'My monster likes cosy bedtime stories.' },
        { id: 'beach_sandcastles', text: 'building beach sandcastles', icon: '🏖️', audio: 'My monster likes building beach sandcastles.' },
        { id: 'flying_high', text: 'flying through fluffy clouds', icon: '☁️', audio: 'My monster likes flying through fluffy clouds.' },
        { id: 'collecting_shells', text: 'finding shiny seashells', icon: '🐚', audio: 'My monster likes finding shiny seashells.' },
        { id: 'sparkly_gems', text: 'sparkly crystals and gems', icon: '💎', audio: 'My monster likes sparkly crystals and gems.' }
      ]
    }
  ];

  /* 2. ASK ME IN CLASS QUESTIONS */
  var ASK_ME_QUESTIONS = [
    { id: 'q_animal', text: "What's your favourite animal?", frameId: 'fav_animal', icon: '🐾' },
    { id: 'q_colour', text: "What's your favourite colour?", frameId: 'fav_colour', icon: '🎨' },
    { id: 'q_hobby', text: "What do you like to do?", frameId: 'like_hobby', icon: '⭐' },
    { id: 'q_can', text: "What can you do?", frameId: 'can_action', icon: '✨' },
    { id: 'q_weekend', text: "What do you do at the weekend?", frameId: 'weekend', icon: '🏖️' },
    { id: 'q_food', text: "What's your favourite food?", frameId: 'fav_food', icon: '🍕' },
    { id: 'q_job', text: "What do you want to be?", frameId: 'future_job', icon: '🚀' },
    { id: 'q_monster', text: "What does your monster like?", frameId: 'monster_likes', icon: '👾' },
    { id: 'q_book', text: "Do you like reading books?", frameId: 'like_hobby', icon: '📚' },
    { id: 'q_talent', text: "What is your secret talent?", frameId: 'can_action', icon: '🌟' }
  ];

  /* 3. PASSPORT STAMPS CATALOG (12 Friendly Stamps) */
  var STAMPS = [
    { id: 's_star', name: 'Golden Star', icon: '⭐', pic: 's_star', desc: 'Always shining bright and doing your best!' },
    { id: 's_rocket', name: 'Cosmic Rocket', icon: '🚀', pic: 's_rocket', desc: 'Soaring high into exciting learning adventures!' },
    { id: 's_teapot', name: 'Cozy Teapot', icon: '🫖', pic: 's_teapot', desc: 'Warm friendship and polite tea table manners!' },
    { id: 's_heart', name: 'Ruby Heart', icon: '❤️', pic: 's_heart', desc: 'Kind, caring, and encouraging to all classmates!' },
    { id: 's_crown', name: 'Royal Crown', icon: '👑', pic: 's_crown', desc: 'Noble spirit, leadership, and fair play in every game!' },
    { id: 's_planet', name: 'Ringed Planet', icon: '🪐', pic: 's_planet', desc: 'Curious explorer discovering wonder across the universe!' },
    { id: 's_paw', name: 'Friendly Paw', icon: '🐾', pic: 's_paw', desc: 'Gentle friend to animals and forest creatures!' },
    { id: 's_music', name: 'Happy Melody', icon: '🎵', pic: 's_music', desc: 'Joyful songs, rhythm, and cheerful positive energy!' },
    { id: 's_rainbow', name: 'Bright Rainbow', icon: '🌈', pic: 's_rainbow', desc: 'Creative, colorful, and smiling after the rain!' },
    { id: 's_ball', name: 'Play Ball', icon: '⚽', pic: 's_ball', desc: 'Active teamwork, cheering friends, and playful spirit!' },
    { id: 's_gem', name: 'Emerald Gem', icon: '💎', pic: 's_gem', desc: 'Precious insights, sharp focus, and polished work!' },
    { id: 's_lightning', name: 'Thunder Spark', icon: '⚡', pic: 's_lightning', desc: 'Fast answers, quick energy, and bright ideas!' }
  ];

  /* 4. DEMO PUPILS */
  var DEMO_PUPILS = {
    'demo-p3': {
      id: 'demo-p3',
      name: 'Pupil 3',
      firstName: 'Leo',
      classId: 'class-3a',
      className: 'Grade 3-A',
      grade: 3,
      xp: 145,
      islandCode: 'P3DEMO',
      monsterProfile: {
        stage: 'stage-3-baby-monster',
        equipped: { body: 'body-amber', horns: 'horns-sprout', clothing: 'clothing-vest' },
        unlockedItems: ['horns-sprout', 'clothing-vest']
      },
      passport: {
        about: [
          { frame: 'fav_animal', pick: 'lion' },
          { frame: 'fav_colour', pick: 'yellow' },
          { frame: 'like_hobby', pick: 'football' }
        ],
        askMe: [
          { q: 'q_animal', a: { frame: 'fav_animal', pick: 'lion' } },
          { q: 'q_hobby', a: { frame: 'like_hobby', pick: 'football' } }
        ],
        stamp: 's_star',
        updatedAt: '2026-10-29T10:00:00.000Z'
      }
    },
    'demo-p4': {
      id: 'demo-p4',
      name: 'Pupil 4',
      firstName: 'Maya',
      classId: 'class-4a',
      className: 'Grade 4-A',
      grade: 4,
      xp: 320,
      islandCode: 'P4DEMO',
      monsterProfile: {
        stage: 'stage-4-growing-monster',
        equipped: { body: 'body-aqua', headwear: 'head-wizard', glasses: 'glasses-round' },
        unlockedItems: ['head-wizard', 'glasses-round']
      },
      passport: {
        about: [
          { frame: 'fav_animal', pick: 'dolphin' },
          { frame: 'fav_colour', pick: 'blue' },
          { frame: 'can_action', pick: 'swim_fast' },
          { frame: 'future_job', pick: 'inventor' }
        ],
        askMe: [
          { q: 'q_animal', a: { frame: 'fav_animal', pick: 'dolphin' } },
          { q: 'q_job', a: { frame: 'future_job', pick: 'inventor' } }
        ],
        stamp: 's_rocket',
        updatedAt: '2026-10-29T11:00:00.000Z'
      }
    },
    'demo-p5': {
      id: 'demo-p5',
      name: 'Pupil 5',
      firstName: 'Sam',
      classId: 'class-4a',
      className: 'Grade 4-A',
      grade: 4,
      xp: 410,
      islandCode: 'P5DEMO',
      monsterProfile: {
        stage: 'stage-5-adventurer-monster',
        equipped: { body: 'body-verdant', horns: 'horns-crystal', clothing: 'clothing-hoodie' },
        unlockedItems: ['horns-crystal', 'clothing-hoodie']
      },
      passport: {
        about: [
          { frame: 'fav_food', pick: 'pizza' },
          { frame: 'like_hobby', pick: 'reading' },
          { frame: 'monster_likes', pick: 'star_candy' }
        ],
        askMe: [
          { q: 'q_food', a: { frame: 'fav_food', pick: 'pizza' } },
          { q: 'q_monster', a: { frame: 'monster_likes', pick: 'star_candy' } }
        ],
        stamp: 's_crown',
        updatedAt: '2026-10-29T12:00:00.000Z'
      }
    }
  };

  /* 5. KIND NOTES SENTENCE BUILDER PARTS */
  var NOTE_PARTS = {
    greetings: [
      { id: 'g_hi', template: 'Hi {name}! 👋' },
      { id: 'g_dear', template: 'Dear {name}, 💌' }
    ],
    compliments: [
      { id: 'm_monster', text: "I like your monster's style! 👾✨" },
      { id: 'm_stamp', text: 'Your passport stamp is so cool! ⭐' },
      { id: 'm_friend', text: 'You are a wonderful friend in class! 💖' },
      { id: 'm_explorer', text: 'You are a brave English explorer! 🚀' },
      { id: 'm_thanks', text: 'Thank you for helping me in English! 📚' },
      { id: 'm_like_too', text: 'I like your favourite things too! 🤝' }
    ],
    closings: [
      { id: 'c_from', template: 'From {sender} 🌟' }
    ]
  };

  /* 6. MONSTER WAVES CATALOG */
  var WAVES = [
    { id: 'wave', label: 'Wave', icon: '👋', actionText: 'waved hello to your monster!' },
    { id: 'dance', label: 'Dance', icon: '💃', actionText: 'danced with your monster!' },
    { id: 'highfive', label: 'High-Five', icon: '✋', actionText: 'gave your monster a high-five!' }
  ];

  /* 7. CAPTAIN PIP "EVERYONE GETS NOTICED" NOTES */
  var PIP_NOTES = [
    'Captain Pip says: You are a star explorer! Keep shining bright! 🦜⭐',
    'Captain Pip says: Great work this week! Your monster is proud of you! 🦜💖',
    'Captain Pip says: High-five from the island! You are doing amazing! 🦜✋',
    'Captain Pip says: Thank you for being a wonderful classroom friend! 🦜🌈'
  ];

  /* Helper to format a sentence from frame ID and pick ID */
  function formatSentence(frameId, pickId) {
    var frame = FRAMES.find(function (f) { return f.id === frameId; });
    if (!frame) return '';
    var choice = frame.choices.find(function (c) { return c.id === pickId; });
    if (!choice) return '';
    return frame.template.replace('{pick}', choice.text);
  }

  function getChoice(frameId, pickId) {
    var frame = FRAMES.find(function (f) { return f.id === frameId; });
    if (!frame) return null;
    return frame.choices.find(function (c) { return c.id === pickId; }) || null;
  }

  /* Helper to format kind note parts into full text */
  function renderNoteText(parts, targetName, senderName) {
    if (!parts) return '';
    var gId = Array.isArray(parts) ? parts[0] : parts.greeting;
    var mId = Array.isArray(parts) ? parts[1] : parts.compliment;
    var cId = Array.isArray(parts) ? parts[2] : (parts.closing || 'c_from');

    var greeting = NOTE_PARTS.greetings.find(function (g) { return g.id === gId; }) || NOTE_PARTS.greetings[0];
    var compliment = NOTE_PARTS.compliments.find(function (m) { return m.id === mId; }) || NOTE_PARTS.compliments[0];
    var closing = NOTE_PARTS.closings.find(function (c) { return c.id === cId; }) || NOTE_PARTS.closings[0];

    var gText = greeting.template.replace('{name}', targetName || 'friend');
    var mText = compliment.text;
    var cText = closing.template.replace('{sender}', senderName || 'Explorer');

    return gText + ' ' + mText + ' ' + cText;
  }

  function renderWaveText(waveId, senderName) {
    var wave = WAVES.find(function (w) { return w.id === waveId; }) || WAVES[0];
    return (senderName || 'A classmate') + ' ' + wave.actionText;
  }

  /* Expose Data API */
  PassportData.FRAMES = FRAMES;
  PassportData.ASK_ME_QUESTIONS = ASK_ME_QUESTIONS;
  PassportData.STAMPS = STAMPS;
  PassportData.DEMO_PUPILS = DEMO_PUPILS;
  PassportData.NOTE_PARTS = NOTE_PARTS;
  PassportData.WAVES = WAVES;
  PassportData.PIP_NOTES = PIP_NOTES;
  PassportData.formatSentence = formatSentence;
  PassportData.getChoice = getChoice;
  PassportData.renderNoteText = renderNoteText;
  PassportData.renderWaveText = renderWaveText;

})(typeof window !== 'undefined' ? window : this);
