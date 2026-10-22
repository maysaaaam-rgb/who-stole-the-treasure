/* Unit 4 Review (Grade 3: What Happened? pp. 56-71; Grade 4: We Can Do It pp. 56-71). Own wording; the book text is not copied.
   Part 1 remembers the unit (story cards, cause and effect). Part 2 opens Game Maker with the Unit 4 questions. */
(function (root) {
  'use strict';
  var D = {};
  var grade = 3;
  try { var m = /[?&]grade=(\d)/.exec(location.search); if (m) grade = m[1] === '4' ? 4 : 3; } catch (e) { /* default */ }
  D.grade = grade;
  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];
  /* Story cards: e = emoji, a = picture name, t = the line to retell, q = a sentence with a gap, o[0] = the right word */
  var G3 = {
    title: 'What Happened?',
    cards: [
      { e: '🖼️', a: 'o_mona_frame', t: 'In 1503, Leonardo painted the Mona Lisa.', q: 'In 1503, Leonardo ____ the Mona Lisa.', o: ['painted', 'paint', 'paints'] },
      { e: '🥷', a: 'o_steal', t: 'In 1911, Peruggia had a plan. He wanted to steal the painting.', q: 'Peruggia wanted to ____ the painting.', o: ['steal', 'sleep', 'spell'] },
      { e: '🏋️', a: 'o_lifted', t: 'He lifted the painting off the wall and hid it under his clothes.', q: 'He ____ the painting off the wall.', o: ['lifted', 'lift', 'lifting'] },
      { e: '📰', a: 'o_newspaper', t: 'The robbery was in the news. People lined up to see the empty space.', q: 'People lined up to see the ____ space on the wall.', o: ['empty', 'full', 'blue'] },
      { e: '👮', a: 'o_arrested', t: 'In 1913, the police arrested Peruggia. The Mona Lisa went home.', q: 'The police ____ Peruggia.', o: ['arrested', 'arrest', 'arrests'] },
      { e: '🌋', a: '', t: 'Mount Tambora made loud noises. The ground moved.', q: 'The loud noises sounded like ____.', o: ['thunder', 'music', 'rain'] },
      { e: '⛵', a: '', t: 'Mama and Papa packed their things. The family ran to the boat.', q: 'The family ran to their ____.', o: ['boat', 'car', 'bus'] },
      { e: '🚢', a: '', t: 'Ash fell from the sky. At sunrise a ship saw them. They were safe.', q: 'They waved and a ship saw them. They were ____.', o: ['safe', 'angry', 'hot'] }
    ],
    ce: [
      { c: 'Peruggia steals the Mona Lisa.', e: 'People line up to see the empty wall.', w: ['The painting is happy.', 'It rains in Paris.'] },
      { c: 'The man calls the police.', e: 'The police arrest Peruggia.', w: ['The man paints a picture.', 'The museum closes forever.'] },
      { c: 'The mountain makes loud noises.', e: 'The family runs to the boat.', w: ['The family goes to school.', 'The family eats lunch.'] },
      { c: 'Ash and stones fall from the sky.', e: 'It is dark. They cannot see the mountain.', w: ['It is a sunny day.', 'The dogs go to sleep.'] }
    ],
    say: ['Peruggia took the painting.', 'The police arrested him.', 'The mountain made a loud noise.', 'The family ran to the boat.', 'Because of the noise, they left the island.'],
    doors: 'Door pass: say one sentence about Mona Lisa or Mount Tambora with "because", for example "They ran to the boat because the mountain was angry."'
  };
  var G4 = {
    title: 'We Can Do It',
    cards: [
      { e: '🏆', a: 'o_league', t: 'Twelve teams play in the league.', q: 'Twelve teams play in the ____.', o: ['league', 'court', 'basket'] },
      { e: '🙌', a: 'o_shooting', t: 'Chelsea Gray scored a three-pointer.', q: 'Chelsea Gray ____ a three-pointer.', o: ['scored', 'score', 'scoring'] },
      { e: '🏀', a: 'o_basketball', t: 'The Sparks were losing, but they worked harder and won the championship.', q: 'The Sparks worked harder and ____ the championship.', o: ['won', 'win', 'wins'] },
      { e: '🚗', a: 'o_traffic', t: 'Harry was late because his car was stuck in traffic.', q: 'Harry was late ____ his car was stuck in traffic.', o: ['because', 'but', 'or'] },
      { e: '🚇', a: 'o_train', t: 'The train stopped. Everybody waited on the platform.', q: 'The train stopped and everybody waited on the ____.', o: ['platform', 'stage', 'ship'] },
      { e: '💡', a: 'c_lynn', t: 'Lynn had an idea: perform the show on the platform!', q: 'Lynn said: “Why don’t we ____ the show here?”', o: ['perform', 'cancel', 'forget'] },
      { e: '🎭', a: 'o_curtain', t: 'The friends performed the play. Everybody clapped.', q: 'The friends ____ the play on the platform.', o: ['performed', 'perform', 'performing'] },
      { e: '🤝', a: '', t: 'Teamwork makes the dream work.', q: 'Teamwork makes the dream ____.', o: ['work', 'walk', 'talk'] }
    ],
    ce: [
      { c: 'The Sparks were losing by five points.', e: 'They worked harder.', w: ['They went home.', 'They bought a new ball.'] },
      { c: 'Harry’s car was stuck in traffic.', e: 'Harry was late for the show.', w: ['Harry was early.', 'Harry won a prize.'] },
      { c: 'The train stopped.', e: 'Everybody waited on the platform.', w: ['Everybody went to bed.', 'The train flew away.'] },
      { c: 'Lynn had an idea.', e: 'They performed the play on the platform.', w: ['They stayed silent.', 'They went home.'] }
    ],
    say: ['The Sparks worked harder and won.', 'Harry was late because of the traffic.', 'Lynn had an idea.', 'We performed the play together.', 'Teamwork makes the dream work!'],
    doors: 'Door pass: say one sentence with "because", for example "Harry was late because the train stopped."'
  };

  /* Words: w = word, e = emoji, a = picture, ex = sentence with a gap, act = how to act it */
  G3.words = [
    { w: 'plan', e: '📝', a: 'o_plan', ex: 'Peruggia had a ____.', act: 'point to your head and think hard.' },
    { w: 'steal', e: '🥷', a: 'o_steal', ex: 'He wanted to ____ the painting.', act: 'tiptoe and take something quietly.' },
    { w: 'lifted', e: '🏋️', a: 'o_lifted', ex: 'He ____ the painting off the wall.', act: 'lift a heavy thing with both arms.' },
    { w: 'robbery', e: '🚨', a: 'o_robbery', ex: 'The ____ was in the news.', act: 'put your hands up and say: Stop!' },
    { w: 'arrested', e: '👮', a: 'o_arrested', ex: 'The police ____ Peruggia.', act: 'put both hands behind your back.' },
    { w: 'lined up', e: '🧍', a: '', ex: 'People ____ to see the empty wall.', act: 'stand in a line, one behind the other.' },
    { w: 'thunder', e: '⛈️', a: '', ex: 'The noise sounded like ____.', act: 'clap loudly and say: BOOM!' },
    { w: 'bark', e: '🐕', a: '', ex: 'Dogs ____ when they are scared.', act: 'bark like a dog: woof, woof!' },
    { w: 'ash', e: '🌫️', a: '', ex: '____ fell down from the sky.', act: 'wiggle your fingers and move them down slowly.' },
    { w: 'dream', e: '😴', a: '', ex: 'The girl had a scary ____.', act: 'close your eyes and rest your head on your hands.' },
    { w: 'sunrise', e: '🌅', a: '', ex: 'At ____ they looked back at the island.', act: 'slowly lift your arms like the sun coming up.' },
    { w: 'hand', e: '✋', a: '', ex: 'Put up your ____. (the sound -nd)', act: 'wave your hand.' },
    { w: 'wind', e: '💨', a: '', ex: 'The ____ is strong today. (the sound -nd)', act: 'blow and move your arms like the wind.' },
    { w: 'stand', e: '🧍', a: '', ex: 'Please ____ up. (the sound -nd)', act: 'stand up tall.' }
  ];
  G4.words = [
    { w: 'league', e: '🏆', a: 'o_league', ex: 'Twelve teams play in the ____.', act: 'hold up an imaginary trophy.' },
    { w: 'court', e: '🏟️', a: 'o_court', ex: 'Ten players are on the ____.', act: 'run on the spot like a player.' },
    { w: 'basket', e: '🧺', a: 'o_basket', ex: 'She throws the ball into the ____.', act: 'throw an imaginary ball up high.' },
    { w: 'score', e: '🔢', a: 'o_score', ex: 'Our team can ____ two points.', act: 'raise two fingers and cheer.' },
    { w: 'shooting', e: '🏀', a: 'o_shooting', ex: 'He is ____ the ball now.', act: 'jump and shoot an imaginary ball.' },
    { w: 'show', e: '🎭', a: 'o_curtain', ex: 'The ____ starts at six o’clock.', act: 'bow like an actor.' },
    { w: 'calm', e: '😌', a: '', ex: 'Please stay ____ and wait here.', act: 'take a deep breath and put your hands down slowly.' },
    { w: 'platform', e: '🚉', a: 'bg_platform', ex: 'We wait for the train on the ____.', act: 'stand behind a line and look for the train.' },
    { w: 'sank', e: '🚢', a: 'o_sank', ex: 'The ship ____ in the storm.', act: 'sink slowly to the floor.' },
    { w: 'alive', e: '🙌', a: '', ex: 'My brother is ____! He is not hurt.', act: 'jump up and shout: I am alive!' },
    { w: 'perform', e: '🎤', a: 'c_lynn', ex: 'Let’s ____ the play here!', act: 'stand like an actor and speak loudly.' }
  ];
  /* Order: events to put in the right order */
  G3.order = [
    { title: '🖼️ The Mona Lisa', e: '🖼️', steps: ['In 1503, Leonardo painted the Mona Lisa.', 'In 1911, Peruggia took the painting.', 'In 1913, the police found it.', 'The Mona Lisa went home to the museum.'], art: ['o_mona_frame', 'o_lifted', 'o_police', 'o_mona_frame'] },
    { title: '🌋 The Angry Mountain', e: '🌋', steps: ['The ground moved and the mountain made loud noises.', 'The girl climbed a tree to see more.', 'Mama and Papa packed their things and ran to the boat.', 'At sunrise a ship saw them and they were safe.'] }
  ];
  G4.order = [
    { title: '🏀 The Sparks game', e: '🏀', steps: ['The Sparks played the Lynx in a big game.', 'The Sparks were losing by five points.', 'Chelsea Gray scored a three-pointer.', 'The Sparks worked harder and won the championship.'], art: ['o_league', 'o_basketball', 'o_shooting', 'o_league'] },
    { title: '🚇 Late for the Show', e: '🚇', steps: ['Harry’s car was stuck in traffic.', 'The train stopped.', 'Everybody waited on the platform.', 'Lynn had an idea and the friends performed the play.'], art: ['o_traffic', 'o_train', 'bg_platform', 'o_curtain'] }
  ];
  /* Reading quiz: q, o[0] = right answer, h = hint */
  G3.quiz = [
    { q: 'What did Peruggia want to do?', o: ['steal a painting', 'go to art class', 'be a guard'], h: 'He had a plan.', e: '🥷' },
    { q: 'Where did Peruggia put the Mona Lisa?', o: ['under his clothes', 'in his hat', 'on the wall'], h: 'He hid it.', e: '🏋️' },
    { q: 'What did people line up to see?', o: ['the empty space', 'a new painting', 'a boat'], h: 'The painting was gone.', e: '📰' },
    { q: 'How many years did the police need to find the painting?', o: ['two', 'twenty', 'twelve'], h: 'It was in 1911 and in 1913.', e: '⏳' },
    { q: 'Who did the police arrest?', o: ['Peruggia', 'the museum worker', 'Mona Lisa'], h: 'He tried to sell the painting.', e: '👮' },
    { q: 'What is the name of the mountain in the story?', o: ['Mount Tambora', 'Mount Mona', 'Mount Louvre'], h: 'It is in Indonesia.', e: '🌋' },
    { q: 'Where was the girl playing at first?', o: ['on the beach', 'at school', 'in a museum'], h: 'Near Papa’s boat.', e: '🏖️' },
    { q: 'Why did the girl climb the tree?', o: ['to see more', 'to sleep', 'to eat'], h: 'She wanted to look at the mountain.', e: '🌳' },
    { q: 'What fell down from the sky?', o: ['ash and stones', 'snow', 'toys'], h: 'The mountain was angry.', e: '🌫️' },
    { q: 'How did the family leave the island?', o: ['by boat', 'by train', 'by bus'], h: 'Mama and Papa packed up things.', e: '⛵' }
  ];
  G4.quiz = [
    { q: 'How many teams are in the league?', o: ['twelve', 'five', 'two'], h: 'The league is a big group of teams.', e: '🏆' },
    { q: 'How many players from each team are on the court?', o: ['five', 'ten', 'two'], h: 'Ten players in all.', e: '🏟️' },
    { q: 'A basket from far away is worth ...', o: ['three points', 'two points', 'five points'], h: 'From far away is harder.', e: '🎯' },
    { q: 'Who scored the three-pointer?', o: ['Chelsea Gray', 'Harry', 'Mr. Williams'], h: 'She plays for the Sparks.', e: '🙌' },
    { q: 'What did the Sparks win that year?', o: ['the championship', 'a ball', 'a bus'], h: 'They worked even harder!', e: '🏆' },
    { q: 'Who plays the tree in the school play?', o: ['Harry', 'Arush', 'Riya'], h: 'He wears a leafy costume.', e: '🌳' },
    { q: 'Why was Harry late?', o: ['traffic and a train problem', 'he forgot the play', 'he was sleeping'], h: 'Think about his trip.', e: '🚗' },
    { q: 'Where did the friends perform the play?', o: ['on the platform', 'at school', 'in the car'], h: 'They were waiting there.', e: '🚉' },
    { q: 'Who said: “Why don’t we perform the show here?”', o: ['Lynn', 'Harry’s dad', 'Mr. Williams'], h: 'She had an idea.', e: '💡' },
    { q: 'Which word means not worried?', o: ['calm', 'alive', 'sank'], h: 'Stay ____ and wait.', e: '😌' }
  ];
  D.g = grade === 4 ? G4 : G3;
  D.setId = grade === 4 ? 'u4-g4' : 'u4-g3';
  /* the games in Part 2: Game Maker ids */
  D.games = [
    { id: 'race', e: '🏁', n: 'Monster Race', s: 'Boost your monster' }, { id: 'cannon', e: '🎯', n: 'Monster Cannon', s: 'Pull back, pop balloons' },
    { id: 'board', e: '🔢', n: 'Tile Board', s: 'Tiles and power-ups' }, { id: 'plinko', e: '🎰', n: 'Plink-oh!', s: 'Drop and win' },
    { id: 'penalty', e: '⚽', n: 'Penalty Kick', s: 'Swipe to shoot' }, { id: 'balloon', e: '🎈', n: 'Balloon Pop', s: 'Pop the right answer' },
    { id: 'snakes', e: '🎲', n: 'Snakes and Ladders', s: 'Roll and climb' }, { id: 'memory', e: '🧠', n: 'Memory', s: 'Match the pairs' }
  ];
  root.RevU4Data = D;
})(window);
