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
