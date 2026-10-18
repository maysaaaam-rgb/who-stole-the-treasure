/* Chuseok Moon Song - Grade 3 smartboard lesson (35 minutes): a call-and-response circle song for the Chuseok festival.
   The refrain "Ganggangsullae" is the traditional refrain of the Korean circle-dance folk song sung under the full moon at Chuseok.
   All English lines here are written for this lesson in very simple A1 English. No song lyrics are copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Moons', e: '🌕', c: '#f59e0b' }, { n: 'Stars', e: '⭐', c: '#8b5cf6' },
    { n: 'Rabbits', e: '🐇', c: '#ec4899' }, { n: 'Lanterns', e: '🏮', c: '#ef4444' }
  ];
  D.refrain = 'Ganggangsullae!';
  D.refrainSay = 'Kahng kahng soo leh!';   // how the computer voice says it

  D.missions = [
    { e: '🌕', t: 'Learn 6 moon words' }, { e: '🎤', t: 'Call and response' }, { e: '💃', t: 'Moon circle dance' },
    { e: '✍️', t: 'Make your own verse' }, { e: '🎶', t: 'Moon concert' }
  ];
  D.hook = [
    'It is Chuseok night. Look at the big, round moon!',
    'At Chuseok, families sing and dance in a circle under the moon.',
    'Tonight we sing a call-and-response song. The leader calls, and the circle answers!'
  ];

  D.words = [
    { w: 'moon', e: '🌕', def: 'the big round light in the night sky', ex: 'The moon is big and round.', gap: 'The ____ is big and round.' },
    { w: 'circle', e: '⭕', def: 'a round shape', ex: 'We stand in a circle.', gap: 'We stand in a ____.' },
    { w: 'hold hands', e: '🤝', def: 'to take someone’s hand', ex: 'We hold hands in a circle.', gap: 'We ____ in a circle.' },
    { w: 'harvest', e: '🌾', def: 'the time when farmers pick the food', ex: 'We say thank you for the harvest.', gap: 'We say thank you for the ____.' },
    { w: 'dance', e: '💃', def: 'to move to music', ex: 'We dance under the moon.', gap: 'We ____ under the moon.' },
    { w: 'songpyeon', e: '🥟', def: 'a sweet rice cake for Chuseok', ex: 'We eat songpyeon together.', gap: 'We eat ____ together.' }
  ];

  /* the leader's lines (call). The whole circle answers with the refrain. */
  D.calls = [
    'The moon is big and round.', 'We hold hands in a circle.', 'We dance under the moon.',
    'We say thank you for the harvest.', 'We eat songpyeon together.'
  ];

  /* Circle Commander: do the action with the beat */
  D.commands = [
    { t: 'Hold hands.', e: '🤝', a: 'Take the hands of your friends.' }, { t: 'Walk to the left.', e: '⬅️', a: 'Walk slowly in the circle.' },
    { t: 'Walk to the right.', e: '➡️', a: 'Now go the other way.' }, { t: 'Clap three times.', e: '👏', a: 'Clap, clap, clap!' },
    { t: 'Make a small circle.', e: '🔸', a: 'Everyone steps in.' }, { t: 'Make a big circle.', e: '⭕', a: 'Everyone steps back.' },
    { t: 'Look at the moon.', e: '🌕', a: 'Look up and smile.' }, { t: 'Jump two times.', e: '🐇', a: 'Jump like a moon rabbit!' },
    { t: 'Turn around.', e: '🔄', a: 'Turn slowly around.' }, { t: 'Freeze like the moon!', e: '🧊', a: 'Stop. Do not move!' }
  ];

  /* Make Your Verse: "We ___ under the moon." */
  D.verbs = [
    { w: 'dance', e: '💃' }, { w: 'sing', e: '🎤' }, { w: 'walk', e: '🚶' }, { w: 'clap', e: '👏' },
    { w: 'jump', e: '🐇' }, { w: 'laugh', e: '😄' }, { w: 'look at the stars', e: '✨' }, { w: 'hold hands', e: '🤝' }
  ];

  D.hwUrl = 'chuseok-moon-homework/index.html';
  root.MoonData = D;
})(window);
