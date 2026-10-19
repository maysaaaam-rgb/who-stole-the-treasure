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
  root.RevG3Data = D;
})(window);
