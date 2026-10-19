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
    { e: '🌕', t: 'Learn 3 moon words' }, { e: '👣', t: 'Learn 5 dance words' }, { e: '🎤', t: 'Sing with the circle' },
    { e: '🐢', t: 'Move slowly or quickly' }, { e: '💃', t: 'Dance with your team' }
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
    { w: 'harvest', e: '🌾', def: 'the time when farmers bring in what they grew', ex: 'We say thank you for the harvest.', gap: 'We say thank you for the ____.' },
    { w: 'dance', e: '💃', def: 'to move to music', ex: 'We dance under the moon.', gap: 'We ____ under the moon.' },
    { w: 'lantern', e: '🏮', def: 'a light you carry in the dark', ex: 'We carry a lantern at night.', gap: 'We carry a ____ at night.' }
  ];

  /* the leader's lines (call). The whole circle answers with the refrain. */
  D.calls = [
    'The moon is big and round.', 'We hold hands in a circle.', 'We dance under the moon.',
    'We say thank you for the harvest.', 'We sing with our family.'
  ];

  /* Circle Commander: do the action with the beat */
  D.commands = [
    { t: 'Hold hands.', e: '🤝', a: 'Take the hands of your friends.' }, { t: 'Walk to the left.', e: '⬅️', a: 'Walk slowly in the circle.' },
    { t: 'Walk to the right.', e: '➡️', a: 'Now go the other way.' }, { t: 'Clap three times.', e: '👏', a: 'Clap, clap, clap!' },
    { t: 'Make a small circle.', e: '🔸', a: 'Everyone steps in.' }, { t: 'Make a big circle.', e: '⭕', a: 'Everyone steps back.' },
    { t: 'Look at the moon.', e: '🌕', a: 'Look up and smile.' }, { t: 'Jump two times.', e: '🐇', a: 'Jump like a moon rabbit!' },
    { t: 'Turn around.', e: '🔄', a: 'Turn slowly around.' }, { t: 'Let’s go!', e: '🏃', a: 'Everyone moves round the circle.' }, { t: 'Slow, slow, slow.', e: '🐢', a: 'Move very slowly.' },
    { t: 'Go in.', e: '⬇️', a: 'Walk into the middle.' }, { t: 'Go out.', e: '⬆️', a: 'Walk back out.' },
    { t: 'Freeze like the moon!', e: '🧊', a: 'Stop. Do not move!' }
  ];

  /* Make Your Verse: "We ___ under the moon." */
  D.verbs = [
    { w: 'dance', e: '💃' }, { w: 'sing', e: '🎤' }, { w: 'walk', e: '🚶' }, { w: 'clap', e: '👏' },
    { w: 'jump', e: '🐇' }, { w: 'laugh', e: '😄' }, { w: 'look at the stars', e: '✨' }, { w: 'hold hands', e: '🤝' }
  ];

  D.video = { id: 'BmhVJJY0LEA', title: 'Ganggangsullae Kids Moon Dance (KIZSONG)' };   // the real song, optional (needs the internet)
  /* ---- new learning (lesson 2.0): Chuseok facts, dance verbs, speed words, rhythm patterns, team dance ---- */
  D.facts = [
    { e: '🍂', t: 'Chuseok is in autumn.' }, { e: '🌕', t: 'At Chuseok, the moon is full and round.' }, { e: '👨‍👩‍👧‍👦', t: 'Families come together.' },
    { e: '👘', t: 'People wear a hanbok. It is a traditional Korean dress.' }, { e: '💃', t: 'People dance in a circle under the moon.' }, { e: '🌾', t: 'People say thank you for the harvest.' }
  ];
  D.factQuiz = [
    { s: 'Chuseok is in spring.', a: false, fix: 'No. It is in autumn.' }, { s: 'People dance in a circle.', a: true, fix: 'Yes! They dance in a circle.' },
    { s: 'The moon is small at Chuseok.', a: false, fix: 'No. It is full and round.' }, { s: 'Families come together.', a: true, fix: 'Yes! Families come together.' },
    { s: 'People wear a hanbok.', a: true, fix: 'Yes! A hanbok is a traditional dress.' }, { s: 'People say thank you for the harvest.', a: true, fix: 'Yes! They say thank you.' }
  ];
  D.moves = [
    { w: 'step', e: '👣', def: 'to put one foot in front of the other', ex: 'We step to the left.', gap: 'We ____ to the left.' },
    { w: 'turn', e: '🔄', def: 'to move round', ex: 'We turn around.', gap: 'We ____ around.' },
    { w: 'spin', e: '🌀', def: 'to turn round and round fast', ex: 'We spin like the moon.', gap: 'We ____ like the moon.' },
    { w: 'stamp', e: '🦶', def: 'to hit the floor with your foot', ex: 'We stamp our feet.', gap: 'We ____ our feet.' },
    { w: 'wave', e: '👋', def: 'to move your hand in the air', ex: 'We wave our hands.', gap: 'We ____ our hands.' },
    { w: 'hop', e: '🐇', def: 'to jump on one foot', ex: 'We hop like a rabbit.', gap: 'We ____ like a rabbit.' },
    { w: 'bow', e: '🙇', def: 'to bend forward to say thank you', ex: 'We bow and say thank you.', gap: 'We ____ and say thank you.' },
    { w: 'sway', e: '🌊', def: 'to move slowly from side to side', ex: 'We sway under the moon.', gap: 'We ____ under the moon.' }
  ];
  /* speed words: the drum really changes (bpm) */
  D.manners = [
    { w: 'slowly', e: '🐢', bpm: 60 }, { w: 'quickly', e: '⚡', bpm: 108 }, { w: 'softly', e: '🤫', bpm: 70 }, { w: 'loudly', e: '📣', bpm: 92 }
  ];
  D.cards = [
    { v: 'Step', d: 'to the left', m: 'slowly', e: '⬅️' }, { v: 'Step', d: 'to the right', m: 'quickly', e: '➡️' }, { v: 'Step', d: 'forward', e: '⬆️' },
    { v: 'Step', d: 'back', e: '⬇️' }, { v: 'Turn', d: 'around', m: 'slowly', e: '🔄' }, { v: 'Spin', m: 'quickly', e: '🌀' },
    { v: 'Stamp', m: 'loudly', e: '🦶' }, { v: 'Clap', m: 'softly', e: '👏' }, { v: 'Wave', d: 'up high', e: '👋' },
    { v: 'Hop', d: 'forward', m: 'quickly', e: '🐇' }, { v: 'Bow', m: 'slowly', e: '🙇' }, { v: 'Sway', d: 'to the left and to the right', m: 'slowly', e: '🌊' }
  ];
  D.seqWords = ['First,', 'Then,', 'Next,', 'Finally,'];

  /* ---- the simple version: 3 moon words, 5 dance words, 2 speed words ---- */
  D.words3 = [
    { w: 'moon', e: '🌕', ex: 'The moon is big and round.' }, { w: 'circle', e: '⭕', ex: 'We stand in a circle.' }, { w: 'family', e: '👨‍👩‍👧‍👦', ex: 'We sing with our family.' }
  ];
  D.dance5 = [
    { w: 'step', e: '👣', ex: 'We step to the left.' }, { w: 'turn', e: '🔄', ex: 'We turn around.' }, { w: 'clap', e: '👏', ex: 'We clap our hands.' },
    { w: 'hop', e: '🐇', ex: 'We hop like a rabbit.' }, { w: 'bow', e: '🙇', ex: 'We bow and say thank you.' }
  ];
  D.speeds = [{ w: 'slowly', e: '🐢', bpm: 60 }, { w: 'quickly', e: '⚡', bpm: 108 }];
  D.cards5 = [];
  D.dance5.forEach(function (d) { D.speeds.forEach(function (sp) { D.cards5.push({ v: d.w.charAt(0).toUpperCase() + d.w.slice(1), key: d.w, m: sp.w, mk: sp.w, e: d.e, bpm: sp.bpm }); }); });

  /* the Sing and Move step: one move for each sentence, and one for the answer */
  D.songMoves = [
    { v: 'turn', e: '🔄', t: 'Turn slowly. You are the moon.' },
    { v: 'step', e: '👣', t: 'Hold hands. Step to the left.' },
    { v: 'hop', e: '🐇', t: 'Hop like a moon rabbit.' },
    { v: 'bow', e: '🙇', t: 'Bow and say thank you.' },
    { v: 'clap', e: '👏', t: 'Clap together with your family.' }
  ];
  D.answerMove = { v: 'jump', e: '🙌', t: 'Hands up! Everybody answers!' };
  D.hwUrl = 'chuseok-moon-homework/index.html';
  root.MoonData = D;
})(window);
