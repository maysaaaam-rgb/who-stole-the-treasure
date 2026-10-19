/* Grade 3 Review: The Mona Lisa Mystery (book pp. 56-59). Own wording; the book text is not copied. */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Cats', e: '🐱', c: '#ef4444' }, { n: 'Wolves', e: '🐺', c: '#0ea5e9' }
  ];
  D.words = [
    { w: 'plan', e: '📝', a: 'o_plan', ex: 'Peruggia had a plan.', mime: 'think hard and point to your head.' },
    { w: 'steal', e: '🥷', a: 'o_steal', ex: 'He wanted to steal the painting.', mime: 'tiptoe and take something quietly.' },
    { w: 'lifted', e: '🏋️', a: 'o_lifted', ex: 'He lifted the painting off the wall.', mime: 'lift a big, heavy thing with both arms.' },
    { w: 'robbery', e: '🚨', a: 'o_robbery', ex: 'The robbery was in the news.', mime: 'hands up and shout: Stop!' },
    { w: 'arrested', e: '👮', a: 'o_arrested', ex: 'The police arrested Peruggia.', mime: 'put both hands behind your back.' }
  ];
  D.order = [
    { title: '⏳ The Mona Lisa timeline', e: '⏳', steps: ['In 1503, Leonardo painted the Mona Lisa.', 'In 1911, Peruggia took the painting.', 'In 1913, the police found it.', 'The Mona Lisa went home to the museum.'], art: ['o_mona_frame', 'o_lifted', 'o_police', 'o_mona_frame'] },
    { title: '🌙 The robbery night', e: '🌙', steps: ['Peruggia put on a worker coat.', 'He lifted the painting off the wall.', 'He hid it under his coat.', 'He walked out of the museum.'], art: ['o_steal', 'o_lifted', 'o_robbery', 'o_plan'] }
  ];
  /* Painting Race questions: [sentence, right answer, wrong 1, wrong 2, optional picture]. Past tense and case words. */
  D.race = [
    ['Yesterday Peruggia ____ the painting.', 'took', 'take', 'taked'], ['He ____ a worker coat.', 'put on', 'puts on', 'putted on'],
    ['He ____ the painting off the wall.', 'lifted', 'lift', 'lifting'], ['The police ____ the painting.', 'found', 'find', 'finded'],
    ['Peruggia ____ out of the museum.', 'walked', 'walk', 'walking'], ['He ____ the painting under his coat.', 'hid', 'hide', 'hided'],
    ['The guard ____ nothing.', 'saw', 'see', 'seed'], ['The painting ____ home to the museum.', 'went', 'go', 'goed'],
    ['Leonardo ____ the Mona Lisa.', 'painted', 'paint', 'paints'], ['In 1911, the painting ____ missing.', 'was', 'is', 'are'],
    ['The people ____ sad.', 'were', 'was', 'is'], ['Peruggia ____ a plan.', 'had', 'have', 'haves'],
    ['The robbery ____ in the news.', 'was', 'were', 'are'], ['The police ____ Peruggia.', 'arrested', 'arrest', 'arrests'],
    ['Today I walk. Yesterday I ____.', 'walked', 'walk', 'walks'], ['Today I take a pen. Yesterday I ____ a pen.', 'took', 'take', 'takes'],
    ['Today I find a coin. Yesterday I ____ a coin.', 'found', 'find', 'finds'], ['Today I see a bird. Yesterday I ____ a bird.', 'saw', 'see', 'sees'],
    ['Today I go to school. Yesterday I ____ to school.', 'went', 'go', 'goes'], ['Today I lift a box. Yesterday I ____ a box.', 'lifted', 'lift', 'lifts'],
    ['Yesterday we ____ at the museum.', 'were', 'was', 'are'], ['The guard ____ asleep.', 'was', 'were', 'is'],
    ['Which word? To take something that is not yours.', 'steal', 'plan', 'lifted', 'o_steal'], ['Which word? An idea of what you will do.', 'plan', 'robbery', 'arrested', 'o_plan'],
    ['Which word? To pick something up with your arms.', 'lifted', 'steal', 'plan', 'o_lifted'], ['Which word? When a thief takes things from a place.', 'robbery', 'arrested', 'lifted', 'o_robbery'],
    ['Which word? The police took the thief away.', 'arrested', 'plan', 'robbery', 'o_arrested'], ['A ____ is a person who steals.', 'thief', 'guard', 'painter'],
    ['A ____ watches the museum at night.', 'guard', 'thief', 'painter'], ['The Mona Lisa is a famous ____.', 'painting', 'pencil', 'phone'],
    ['A ____ is a place with old paintings and statues.', 'museum', 'kitchen', 'garage'], ['People read the ____ to see the news.', 'newspaper', 'painting', 'statue'],
    ['The ____ catch thieves.', 'police', 'painters', 'farmers'], ['A ____ is made of stone.', 'statue', 'newspaper', 'coat'],
    ['Peruggia wanted to ____ the painting.', 'steal', 'stole', 'stealing'], ['He ____ the painting. (steal, past)', 'stole', 'steal', 'stealed'],
    ['Who painted the Mona Lisa?', 'Leonardo', 'Peruggia', 'The guard'], ['When did Peruggia take the painting?', 'In 1911', 'In 1503', 'Tomorrow'],
    ['Where did the Mona Lisa go at the end?', 'Home to the museum', 'To a shop', 'To the sea'], ['What did Peruggia hide it under?', 'His coat', 'His bed', 'A tree']
  ];
  root.RevG3Data = D;
})(window);
