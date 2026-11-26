/* Courtside to Curtain Call 3D — Complete 3-Zone Curriculum Data (Grade 4 · Unit 4)
 * 32 Brand-New Custom Pixar Illustrations (assets/art/*.webp) · 65 Studio Neural MP3 Voiceovers (assets/audio/vo/*.mp3)
 */
(function (root) {
  'use strict';

  var TEAMS = [
    { id: 'pink',   name: 'Ember',  color: 0xff5fa2, css: 'pink',   glb: '../assets/3d/monsters/emberwing.glb' },
    { id: 'blue',   name: 'Aqua',   color: 0x4f9dff, css: 'blue',   glb: '../assets/3d/monsters/aquafind.glb' },
    { id: 'yellow', name: 'Spark',  color: 0xffb320, css: 'yellow', glb: '../assets/3d/monsters/sparktail.glb' },
    { id: 'green',  name: 'Flora',  color: 0x2fc58a, css: 'green',  glb: '../assets/3d/monsters/florasprout.glb' }
  ];

  var STAGES = [
    { id: 's1', zone: 1, num: 1, label: '1 · Court',    cls: 'z1' },
    { id: 's2', zone: 1, num: 2, label: '2 · Shoot',    cls: 'z1' },
    { id: 's3', zone: 1, num: 3, label: '3 · Phonics',  cls: 'z1' },
    { id: 's4', zone: 2, num: 4, label: '4 · Actions',  cls: 'z2' },
    { id: 's5', zone: 2, num: 5, label: '5 · Tracks',   cls: 'z2' },
    { id: 's6', zone: 2, num: 6, label: '6 · Strange',  cls: 'z2' },
    { id: 's7', zone: 3, num: 7, label: '7 · Casting',  cls: 'z3' },
    { id: 's8', zone: 3, num: 8, label: '8 · Story',    cls: 'z3' },
    { id: 's9', zone: 3, num: 9, label: '9 · Finale',   cls: 'z3' }
  ];

  // =========================================================================
  // ZONE 1: SUNNY BASKETBALL COURT (Stages 1, 2, 3)
  // =========================================================================
  var COURT_ZONES = [
    { id: 'basket', label: 'Basket',           vo: 'lbl_basket', cue: '🗣️ "Shoot into the ..."',   pos: [11.0, 3.6, 0.0], ringPos: [10.8, 0.06, 0.0], ringRadius: 1.85, isHoop: true },
    { id: 'free',   label: 'Free-throw line',  vo: 'lbl_free',   cue: '🗣️ "Stand on the ..."',     pos: [6.8, 0.06, 0.0], ringPos: [6.8, 0.06, 0.0],  ringRadius: 1.55, isHoop: false },
    { id: 'three',  label: 'Three-point line', vo: 'lbl_three',  cue: '🗣️ "Shoot behind the ..."', pos: [4.2, 0.06, 3.8], ringPos: [4.2, 0.06, 3.8],  ringRadius: 1.75, isHoop: false },
    { id: 'half',   label: 'Half-court line',  vo: 'lbl_half',   cue: '🗣️ "This line is the ..."', pos: [0.0, 0.06, 0.0], ringPos: [0.0, 0.06, 0.0],  ringRadius: 2.35, isHoop: false },
    { id: 'court',  label: 'Court',            vo: 'lbl_court',  cue: '🗣️ "We play on the ..."',   pos: [-5.6, 0.06, 2.2], ringPos: [-5.6, 0.06, 2.2], ringRadius: 2.6, isHoop: false }
  ];

  var SPELL_ROUNDS = [
    { id: 'basket',   word: 'BASKET',   missingIndex: 3, answer: 'K', options: ['K', 'N', 'R'], vo: 'w_basket',   img: 'assets/art/card_basket.webp',   cue: '🗣️ Say the word + a full sentence!' },
    { id: 'coach',    word: 'COACH',    missingIndex: 3, answer: 'C', options: ['C', 'S', 'T'], vo: 'w_coach',    img: 'assets/art/card_coach.webp',    cue: '🗣️ Who blows the whistle?' },
    { id: 'court',    word: 'COURT',    missingIndex: 3, answer: 'R', options: ['L', 'R', 'M'], vo: 'w_court',    img: 'assets/art/card_court.webp',    cue: '🗣️ Where do we play?' },
    { id: 'player',   word: 'PLAYER',   missingIndex: 3, answer: 'Y', options: ['I', 'Y', 'W'], vo: 'w_player',   img: 'assets/art/card_player.webp',   cue: '🗣️ What is the player doing?' },
    { id: 'audience', word: 'AUDIENCE', missingIndex: 4, answer: 'E', options: ['A', 'E', 'O'], vo: 'w_audience', img: 'assets/art/card_audience.webp', cue: '🗣️ Who is clapping?' },
    { id: 'costumes', word: 'COSTUMES', missingIndex: 3, answer: 'T', options: ['T', 'D', 'P'], vo: 'w_costumes', img: 'assets/art/card_costumes.webp', cue: '🗣️ What do actors wear?' },
    { id: 'theatre',  word: 'THEATRE',  missingIndex: 4, answer: 'T', options: ['T', 'C', 'K'], vo: 'w_theatre',  img: 'assets/art/card_theatre.webp',  cue: '🗣️ Where is the show?' },
    { id: 'train',    word: 'TRAIN',    missingIndex: 2, answer: 'A', options: ['A', 'E', 'O'], vo: 'w_train',    img: 'assets/art/card_train.webp',    cue: '🗣️ How do they travel?' }
  ];

  var PHONICS_ROUNDS = [
    { id: 'sport',    word: 'SPORT',    group: 'sport', vo: 'p_sport',    img: 'assets/art/phon_sport.webp',    cue: '🗣️ Say "sport" in a full sentence!' },
    { id: 'work',     word: 'WORK',     group: 'work',  vo: 'p_work',     img: 'assets/art/phon_work.webp',     cue: '🗣️ Say "work" in a full sentence!' },
    { id: 'horse',    word: 'HORSE',    group: 'sport', vo: 'p_horse',    img: 'assets/art/phon_horse.webp',    cue: '🗣️ Say "horse" in a full sentence!' },
    { id: 'world',    word: 'WORLD',    group: 'work',  vo: 'p_world',    img: 'assets/art/phon_world.webp',    cue: '🗣️ Say "world" in a full sentence!' },
    { id: 'fork',     word: 'FORK',     group: 'sport', vo: 'p_fork',     img: 'assets/art/phon_fork.webp',     cue: '🗣️ Say "fork" in a full sentence!' },
    { id: 'worm',     word: 'WORM',     group: 'work',  vo: 'p_worm',     img: 'assets/art/phon_worm.webp',     cue: '🗣️ Say "worm" in a full sentence!' },
    { id: 'storm',    word: 'STORM',    group: 'sport', vo: 'p_storm',    img: 'assets/art/phon_storm.webp',    cue: '🗣️ Say "storm" in a full sentence!' },
    { id: 'homework', word: 'HOMEWORK', group: 'work',  vo: 'p_homework', img: 'assets/art/phon_homework.webp', cue: '🗣️ Say "homework" in a full sentence!' }
  ];

  // =========================================================================
  // ZONE 2: FESTIVAL PARK & EXPRESS TRAIN (Stages 4, 5, 6)
  // =========================================================================
  var ACTION_ROUNDS = [
    {
      id: 'basketball',
      img: 'assets/art/act_basketball.webp',
      vo: 'act_basketball',
      prompt: 'They are ...',
      answer: 'playing basketball',
      options: ['playing basketball', 'dancing', 'running', 'listening to music'],
      cue: '🗣️ Say the FULL Present Continuous sentence!'
    },
    {
      id: 'dancing',
      img: 'assets/art/act_dancing.webp',
      vo: 'act_dancing',
      prompt: 'The kids are ...',
      answer: 'dancing',
      options: ['playing basketball', 'dancing', 'running', 'listening to music'],
      cue: '🗣️ Say what they are doing around the fountain!'
    },
    {
      id: 'running',
      img: 'assets/art/act_running.webp',
      vo: 'act_running',
      prompt: 'He is ...',
      answer: 'running',
      options: ['playing basketball', 'dancing', 'running', 'listening to music'],
      cue: '🗣️ Where is he running? Full sentence!'
    },
    {
      id: 'music',
      img: 'assets/art/act_music.webp',
      vo: 'act_music',
      prompt: 'She is ...',
      answer: 'listening to music',
      options: ['playing basketball', 'dancing', 'running', 'listening to music'],
      cue: '🗣️ Say the full sentence aloud!'
    }
  ];

  var TRACK_ROUNDS = [
    { id: 'br1', vo: 'br_1', img: 'assets/art/act_basketball.webp', words: ['They', 'are', 'playing', 'basketball.'],       scrambled: ['playing', 'They', 'basketball.', 'are'] },
    { id: 'br2', vo: 'br_2', img: 'assets/art/role_actor.webp',     words: ['She', 'is', 'wearing', 'a', 'crown.'],         scrambled: ['crown.', 'wearing', 'She', 'a', 'is'] },
    { id: 'br3', vo: 'br_3', img: 'assets/art/act_running.webp',    words: ['He', 'is', 'running', 'to', 'the', 'train.'],  scrambled: ['train.', 'is', 'running', 'He', 'the', 'to'] },
    { id: 'br4', vo: 'br_4', img: 'assets/art/card_theatre.webp',   words: ['We', 'are', 'going', 'to', 'the', 'festival.'],scrambled: ['festival.', 'going', 'We', 'the', 'are', 'to'] }
  ];

  var STRANGE_ROUNDS = [
    {
      id: 'fish',
      label: '🐟 Flying Fish',
      img: 'assets/art/strange_fish.webp',
      vo: 'st_fish',
      cue: '🗣️ Tell the class: What is strange in the sky?',
      pos: [24.0, 5.6, -25.0]
    },
    {
      id: 'snow',
      label: '⛄ Summer Snowman',
      img: 'assets/art/strange_snow.webp',
      vo: 'st_snow',
      cue: '🗣️ Tell the class: Why is a snowman strange here?',
      pos: [18.5, 1.4, -22.5]
    },
    {
      id: 'guitar',
      label: '🎸 Roof Guitar',
      img: 'assets/art/strange_guitar.webp',
      vo: 'st_guitar',
      cue: '🗣️ Tell the class: What is on top of the train?',
      pos: [25.5, 3.8, -19.2]
    },
    {
      id: 'crown',
      label: '👑 Floating Crown',
      img: 'assets/art/strange_crown.webp',
      vo: 'st_crown',
      cue: '🗣️ Tell the class: What is floating over the fountain?',
      pos: [24.0, 4.9, -25.0]
    }
  ];

  // =========================================================================
  // ZONE 3: GRAND THEATRE STAGE SHOW (Stages 7, 8, 9)
  // =========================================================================
  var CASTING_ROUNDS = [
    {
      id: 'actor',
      answer: 'Actor',
      options: ['Actor', 'Singer', 'Musician', 'Wizard'],
      img: 'assets/art/role_actor.webp',
      vo: 'role_actor',
      propGlb: '../assets/3d/items/hat-crown.glb',
      cue: '🗣️ "I am an actor! I wear ..."'
    },
    {
      id: 'singer',
      answer: 'Singer',
      options: ['Actor', 'Singer', 'Musician', 'Wizard'],
      img: 'assets/art/role_singer.webp',
      vo: 'role_singer',
      propGlb: '../assets/3d/items/acc-microphone.glb',
      cue: '🗣️ "I am a singer! I sing ..."'
    },
    {
      id: 'musician',
      answer: 'Musician',
      options: ['Actor', 'Singer', 'Musician', 'Wizard'],
      img: 'assets/art/role_musician.webp',
      vo: 'role_musician',
      propGlb: '../assets/3d/items/cs-guitar.glb',
      cue: '🗣️ "I am a musician! I play ..."'
    },
    {
      id: 'wizard',
      answer: 'Wizard',
      options: ['Actor', 'Singer', 'Musician', 'Wizard'],
      img: 'assets/art/role_wizard.webp',
      vo: 'role_wizard',
      propGlb: '../assets/3d/items/hat-wizard.glb',
      cue: '🗣️ "I am a wizard! I wear ..."'
    }
  ];

  var STORY_STEPS = [
    { step: 1, tag: 'FIRST',   short: 'Leave Home',   img: 'assets/art/story_1_home.webp',         vo: 'story_1', cue: '🗣️ Start with "First, ..."' },
    { step: 2, tag: 'NEXT',    short: 'Train Stops!', img: 'assets/art/story_2_train_stop.webp',   vo: 'story_2', cue: '🗣️ Continue with "Next, ..."' },
    { step: 3, tag: 'THEN',    short: 'Hurry to Park',img: 'assets/art/story_3_hurry.webp',        vo: 'story_3', cue: '🗣️ Continue with "Then, ..."' },
    { step: 4, tag: 'FINALLY', short: 'Curtain Call!',img: 'assets/art/story_4_curtain_call.webp', vo: 'story_4', cue: '🗣️ Finish with "Finally, ..."' }
  ];

  root.CTC3D_DATA = {
    TEAMS: TEAMS,
    STAGES: STAGES,
    COURT_ZONES: COURT_ZONES,
    SPELL_ROUNDS: SPELL_ROUNDS,
    PHONICS_ROUNDS: PHONICS_ROUNDS,
    ACTION_ROUNDS: ACTION_ROUNDS,
    TRACK_ROUNDS: TRACK_ROUNDS,
    STRANGE_ROUNDS: STRANGE_ROUNDS,
    CASTING_ROUNDS: CASTING_ROUNDS,
    STORY_STEPS: STORY_STEPS
  };
})(window);
