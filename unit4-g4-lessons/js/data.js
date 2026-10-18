/* Unit 4 "We Can Do It" - Grade 4 smartboard lessons (35 minutes each). Lesson 1: Team Players.
   All sentences are written for these lessons in simple A1-A2 English. No book text is copied; book pages are only named. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];

  /* Lesson 1 ---------------------------------------------------------- */
  D.l1missions = [
    { e: '🧊', t: 'Freeze Frame' }, { e: '🏀', t: 'Court Shootout' }, { e: '🎙️', t: 'Live Commentary' },
    { e: '🔢', t: 'Morning Relay' }, { e: '🎴', t: 'Disaster Cards' }
  ];
  D.l1hook = [
    'Welcome to Team Week! Look at the pictures. Do you see a team?',
    'Teams work together. What teams do you know?',
    'Today we meet a real basketball team. They are famous!'
  ];

  /* Think, Pair, Share: who is working together, and how */
  D.team = [
    { who: 'The dancers', ing: 'are moving with the music', e: '💃', a: 'o_dancers' },
    { who: 'The musicians', ing: 'are playing the music together', e: '🎻', a: 'o_orchestra' },
    { who: 'The football players', ing: 'are passing the ball', e: '⚽' },
    { who: 'The basketball players', ing: 'are shooting at the basket', e: '🏀' },
    { who: 'The actors', ing: 'are learning their words', e: '🎭' },
    { who: 'The singers', ing: 'are singing in a choir', e: '🎤' }
  ];
  D.tpsLines = [
    'Think: I look at the picture. I think about it for ten seconds.',
    'Pair: I tell my partner. “They are working together.”',
    'Share: our pair tells the class. “We think everyone is listening to one another.”'
  ];

  /* Vocabulary (words from the reading, own simple sentences) */
  D.words = [
    { w: 'league', e: '🏆', a: 'o_league', def: 'a big group of teams that play each other', ex: 'Twelve teams play in the league.', gap: 'Twelve teams play in the ____.' },
    { w: 'court', e: '🏟️', a: 'o_court', def: 'the place where you play basketball', ex: 'Ten players are on the court.', gap: 'Ten players are on the ____.' },
    { w: 'basket', e: '🧺', a: 'o_basket', def: 'the net where the ball goes', ex: 'She throws the ball into the basket.', gap: 'She throws the ball into the ____.' },
    { w: 'score', e: '🔢', a: 'o_score', def: 'to get a point', ex: 'Our team can score two points.', gap: 'Our team can ____ two points.' },
    { w: 'shooting', e: '🏀', a: 'o_shooting', def: 'throwing the ball at the basket', ex: 'He is shooting the ball now.', gap: 'He is ____ the ball now.' }
  ];

  /* Reading 1 told in short parts (pupils hear it first; the book text is read in the next lesson) */
  D.sparks = [
    { say: 'This is a basketball league. It has twelve teams.', act: '🏆 Hold up twelve fingers (ten and two).', scene: '🏆' },
    { say: 'In a game, five players from each team are on the court.', act: '🖐️ Show five fingers. Count to ten.', scene: '🏟️' },
    { say: 'Players shoot the ball into the basket to score points.', act: '🏀 Pretend to shoot a ball!', scene: '🏀' },
    { say: 'Most baskets are worth two points. Baskets from far away are worth three.', act: '✌️ Show two fingers. Then three fingers.', scene: '🔢' },
    { say: 'One day, the Sparks play the Lynx. It is a very big game!', act: '👏 Clap for the Sparks. Clap for the Lynx.', scene: '👏' },
    { predict: 'The game is almost over. The Sparks are losing by five points. What can the team do?',
      say: 'Chelsea Gray shoots from far away. She scores three points!', act: '🙌 Jump up and cheer!', scene: '🎯', key: true },
    { say: 'But three points are not enough. The Lynx win the game.', act: '😔 Make a sad face. It is okay!', scene: '😔' },
    { say: 'The Sparks work even harder. That year, they win the championship!', act: '🏆 Lift your arms. You are the champions!', scene: '🏆' },
    { say: 'Winning is important. But working together is part of the game.', act: '🤝 Shake hands with your partner.', scene: '🤝', key: true }
  ];

  /* True or False Court (statements about the Sparks story) */
  D.tf = [
    { s: 'The league has twelve teams.', a: true, e: '🏆', fix: 'Yes! Twelve teams.' },
    { s: 'Ten players are on the court: five from each team.', a: true, e: '🏟️', fix: 'Yes! Five and five.' },
    { s: 'A basket from far away is worth four points.', a: false, e: '🔢', fix: 'No. It is worth three points.' },
    { s: 'The Sparks play the Lynx in a big game.', a: true, e: '🏀', fix: 'Yes!' },
    { s: 'Chelsea Gray scores a three-pointer.', a: true, e: '🎯', fix: 'Yes! She scores three points.' },
    { s: 'The Lynx win the big game.', a: true, e: '😔', fix: 'Yes, they win it. But the Sparks win the championship later!' },
    { s: 'The Sparks stop working hard.', a: false, e: '💪', fix: 'No. They work even harder.' },
    { s: 'In basketball you play alone.', a: false, e: '🤝', fix: 'No. You work with your team.' },
    { s: 'The WNBA started in 1996.', a: true, e: '📅', fix: 'Yes! In nineteen ninety-six.' },
    { s: 'Players throw the ball into the basket to score.', a: true, e: '🧺', fix: 'Yes!' }
  ];

  /* Order the events (first, then, after that, finally) */
  D.order = [
    { title: 'A basketball game', e: '🏀', steps: ['The players come on the court.', 'They pass the ball to each other.', 'A player shoots at the basket.', 'The team scores. Everyone cheers!'] },
    { title: 'Paige’s morning at home', e: '☀️', steps: ['I wake up.', 'I eat breakfast.', 'I put on my school bag.', 'I walk to school with my friends.'] },
    { title: 'Making a team poster', e: '🎨', steps: ['We choose the team name.', 'We draw a big picture.', 'We write the words.', 'We show the poster to the class.'] }
  ];
  D.orderWords = ['First,', 'Then,', 'After that,', 'Finally,'];

  D.wrapSay = ['I am on a team and I …', 'Last year, I did …', 'Teamwork makes the dream work!'];

  /* Dream Team League: the five roles in every team and the problem cards */
  D.roles = [
    { e: '🧢', n: 'Captain', job: 'Speaks for the team' }, { e: '🧠', n: 'Coach', job: 'Checks the words' },
    { e: '🎙️', n: 'Commentator', job: 'Tells what is happening' }, { e: '🔢', n: 'Scorer', job: 'Counts the points in English' },
    { e: '🐾', n: 'Mascot', job: 'Cheers for the team' }
  ];
  D.disasters = [
    { e: '🚦', t: 'Traffic jam! The car is not moving.', a: 'Why don’t we take the train?' },
    { e: '🚆', t: 'The train has stopped. Everyone must get off!', a: 'Why don’t we wait on the platform?' },
    { e: '🎭', t: 'We are late for the show. The audience is waiting!', a: 'Why don’t we perform here, now?' },
    { e: '🧥', t: 'Oh no! My costume is at home!', a: 'Why don’t we use a coat and a hat?' },
    { e: '😰', t: 'I am nervous. I cannot remember my words!', a: 'Don’t worry. We can do it together!' },
    { e: '🌧️', t: 'It is raining and the bus is late.', a: 'Why don’t we call the teacher?' }
  ];

  root.U4G4Data = D;
})(window);
