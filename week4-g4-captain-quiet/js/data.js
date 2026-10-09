/* Week 4 Grade 4 "Captain Quiet's Space Mission" - one teacher-led smartboard lesson (35 minutes).
   Unit 1 Classroom Rules: requests, permission, instructions, numbers 1-50.
   All sentences are written for this lesson in very simple A1 English. No book text is copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Comets', e: '☄️', c: '#f97316' }, { n: 'Rockets', e: '🚀', c: '#ef4444' },
    { n: 'Planets', e: '🪐', c: '#8b5cf6' }, { n: 'Aliens', e: '👽', c: '#22c55e' }
  ];

  D.missions = [
    { e: '🤫', t: 'Follow Captain Quiet' }, { e: '🔢', t: 'Count to fifty' }, { e: '🚪', t: 'Ask: Can I come in?' },
    { e: '🙏', t: 'Ask nicely: please!' }, { e: '🏁', t: 'Win the Rule Race' }
  ];
  D.hookPrompts = [
    'Hello, crew! I am Captain Quiet. Welcome to my space ship classroom!',
    'Look at the round door. Who is at the door? What does he want?',
    'We have a mission today. The magic word is "please"!'
  ];

  /* Captain Says: only move when the Captain says please */
  D.captain = [
    { say: 'Be quiet, please.', act: '🤫 Finger on your lips. Be very quiet!', scene: '🤫', art: 'c_captain_quiet' },
    { say: 'Look at the board, please.', act: '👀 Look at the board with big eyes.', scene: '👀' },
    { say: 'Open the door, please.', act: '🚪 Open a big door with your hands.', scene: '🚪' },
    { say: 'Close the door, please.', act: '🚪 Close the door. Push, push!', scene: '🚪' },
    { predict: 'Captain Quiet says: "Stand up!" He does NOT say please. What do you do?',
      say: 'No "please", no moving! Sit still. The magic word is please.', act: '🧊 Freeze like ice. Do not move!', scene: '🙏', art: 'o_please_star', key: true },
    { say: 'Open the window, please.', act: '🪟 Open the window. Wow, stars!', scene: '🪟' },
    { say: 'Clean the board, please.', act: '🧽 Clean the board with a big arm.', scene: '🧽' },
    { say: 'Go back to your place, please.', act: '💺 Walk back to your seat.', scene: '💺' },
    { say: 'The pencil, please.', act: '✏️ Hold out your hand. Wait for a pencil.', scene: '✏️' }
  ];

  D.asks = ['Can I come in?', 'May I come in?', 'Can I go out?', 'May I go out?'];
  D.answers = [
    { t: 'Yes, you can.', ok: true }, { t: 'Sure.', ok: true }, { t: 'Of course.', ok: true },
    { t: 'Sorry, not right now.', ok: false }
  ];

  D.objects = [
    { n: 'pencil', e: '✏️' }, { n: 'book', e: '📕' }, { n: 'ruler', e: '📏' }, { n: 'eraser', e: '🧽' }, { n: 'bag', e: '🎒' }, { n: 'pen', e: '🖊️' }
  ];

  D.race = [
    { e: '🔢', p: 'Count from 18 to 24.', a: 'eighteen, nineteen, twenty, twenty-one, twenty-two, twenty-three, twenty-four' },
    { e: '🔢', p: 'Count in tens up to fifty.', a: 'ten, twenty, thirty, forty, fifty' },
    { e: '🔢', p: 'Say the numbers from 29 to 33.', a: 'twenty-nine, thirty, thirty-one, thirty-two, thirty-three' },
    { e: '🔢', p: 'Count backwards from 10 to 1.', a: 'ten, nine, eight, seven, six, five, four, three, two, one' },
    { e: '🚪', p: 'Ask for permission to go out.', a: 'Can I go out, please?' },
    { e: '🚪', p: 'Ask for permission to come in.', a: 'Can I come in, please?' },
    { e: '🙋', p: 'Your friend asks: "Can I come in?" Say YES in three ways.', a: 'Yes, you can. / Sure. / Of course.' },
    { e: '🙅', p: 'Your friend asks: "Can I go out?" Say NO nicely.', a: 'Sorry, not right now.' },
    { e: '🪟', p: 'Tell your partner to open the window.', a: 'Open the window, please.' },
    { e: '🤫', p: 'Tell your partner to be quiet.', a: 'Be quiet, please.' },
    { e: '👀', p: 'Tell your partner to look at the board.', a: 'Look at the board, please.' },
    { e: '🚪', p: 'Tell your partner to close the door.', a: 'Close the door, please.' },
    { e: '✏️', p: 'Ask your partner for a pencil.', a: 'Give me the pencil, please.' },
    { e: '📕', p: 'Your partner gives you a book. What do you say?', a: 'Here you are. / Thank you.' },
    { e: '🙉', p: 'You did not hear. Ask your partner to repeat.', a: 'Say that again, please.' },
    { e: '💺', p: 'Tell your partner to go back to the place.', a: 'Go back to your place, please.' }
  ];

  root.W4G4Data = D;
})(window);
