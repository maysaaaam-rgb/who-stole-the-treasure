/* Unit 4 "What Happened?" - Grade 3 smartboard lessons (35 minutes each): Detective Academy, Case File 1 and 2.
   All sentences are written for these lessons in very simple A1 English. The book is only named by page; its text is not copied. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Cats', e: '🐱', c: '#ef4444' }, { n: 'Wolves', e: '🐺', c: '#0ea5e9' }
  ];
  D.goal = 20;   // clues needed to solve a case

  /* ------------------------------------------------ Case File 1: A Picture on the Wall (book pp. 56-57) */
  D.c1missions = [
    { e: '🗽', t: 'Think, Pair, Share' }, { e: '🖼️', t: 'Spot the changes' }, { e: '🔍', t: 'Learn 5 case words' },
    { e: '🤫', t: 'Sneak past the guard' }, { e: '⏪', t: 'Past-tense detectives' }, { e: '⏳', t: 'Build the timeline' }
  ];
  D.hook1 = [
    'Welcome to Detective Academy! Today we open Case File number one.',
    'Look at the big head. What is it? Where is it now?',
    'A big thing can come to a new place. Something happened. What happened?'
  ];

  D.tps = [
    { q: 'Why is it in the park?', a: 'I think it is in the park for decoration.' },
    { q: 'Where is it now?', a: 'I think it is in a big city.' },
    { q: 'What do you think?', a: 'We think it is a new decoration.' }
  ];

  /* Spot the Changes: the museum at the beginning and at the end of the story (book p. 57 E) */
  D.changes = [
    { w: 'People', b: '🧍', a: '👥👥👥', sb: 'There is one man in the museum.', sa: 'There are many people in the museum.' },
    { w: 'The painting', b: '🖼️❓', a: '🖼️😊', sb: 'The painting is not on the wall.', sa: 'The painting is on the wall.' },
    { w: 'Phones', b: '❌📱', a: '📱📱📱', sb: 'Nobody has a phone.', sa: 'People have phones.' },
    { w: 'The man', b: '😈', a: '🙂', sb: 'The man looks sneaky.', sa: 'The people look happy.' },
    { w: 'The mood', b: '🤫', a: '🎉', sb: 'It is very quiet.', sa: 'It is a big happy day.' }
  ];

  /* Case words (book p. 59 Words in Context) */
  D.words = [
    { w: 'plan', e: '📝', a: 'o_plan', def: 'an idea of what you will do', ex: 'Peruggia had a plan.', gap: 'Peruggia had a ____.', mime: 'Think hard, then point to your head and nod.' },
    { w: 'steal', e: '🥷', a: 'o_steal', def: 'to take something that is not yours', ex: 'He wanted to steal the painting.', gap: 'He wanted to ____ the painting.', mime: 'Tiptoe and put an invisible thing in your bag.' },
    { w: 'lifted', e: '🏋️', a: 'o_lifted', def: 'took something up', ex: 'He lifted the painting off the wall.', gap: 'He ____ the painting off the wall.', mime: 'Lift a big heavy thing up with both arms.' },
    { w: 'robbery', e: '🚨', a: 'o_robbery', def: 'when someone steals something', ex: 'The robbery was in the news.', gap: 'The ____ was in the news.', mime: 'Hands up, shout: Stop! Robbery!' },
    { w: 'arrested', e: '👮', a: 'o_arrested', def: 'the police take a bad person away', ex: 'The police arrested Peruggia.', gap: 'The police ____ Peruggia.', mime: 'Put both hands behind your back.' }
  ];

  /* Past-tense detectives: Peruggia's story (regular and irregular verbs, own sentences) */
  D.past = [
    { s: 'Yesterday, Peruggia ____ into the museum. (walk)', o: ['walked', 'walks', 'walking'], a: 0, e: '🚶' },
    { s: 'He ____ to steal the painting. (want)', o: ['wanted', 'want', 'wants'], a: 0, e: '🖼️' },
    { s: 'He ____ the painting off the wall. (lift)', o: ['lifted', 'lifts', 'lifting'], a: 0, e: '🏋️' },
    { s: 'He ____ the painting under his coat. (hide)', o: ['hid', 'hides', 'hide'], a: 0, e: '🧥' },
    { s: 'A worker ____ the police. (call)', o: ['called', 'calls', 'calling'], a: 0, e: '📞' },
    { s: 'The police ____ Peruggia. (arrest)', o: ['arrested', 'arrest', 'arrests'], a: 0, e: '👮' },
    { s: 'The police ____ the painting. (find)', o: ['found', 'find', 'finds'], a: 0, e: '🔍' },
    { s: 'Leonardo ____ the Mona Lisa. (paint)', o: ['painted', 'paints', 'paint'], a: 0, e: '🎨' }
  ];

  /* Timeline (years from the story) */
  D.timeline = [
    { title: 'The Mona Lisa timeline', e: '⏳', steps: ['In 1503, Leonardo painted the Mona Lisa.', 'In 1911, Peruggia took the painting.', 'In 1913, the police found it.', 'Then the Mona Lisa went home to the museum.'] },
    { title: 'The robbery night', e: '🌙', steps: ['Peruggia put on a worker coat.', 'He lifted the painting off the wall.', 'He hid it under his coat.', 'He walked out of the museum.'] }
  ];
  D.orderWords = ['First,', 'Then,', 'After that,', 'Finally,'];

  /* ------------------------------------------------ Case File 2: Where Is She? (book pp. 58-64) */
  D.c2missions = [
    { e: '⚡', t: 'Word flash' }, { e: '🎬', t: 'Act out the robbery' }, { e: '📰', t: 'Write the headline' },
    { e: '❓', t: 'Detective quiz show' }, { e: '🗣️', t: 'Four corners debate' }, { e: '🎨', t: 'Draw two faces' }
  ];
  D.story = [
    { say: 'In 1503, Leonardo da Vinci painted the Mona Lisa.', act: '🎨 Pretend to paint a small picture.', scene: '🎨' },
    { say: 'In 1911, Peruggia went into the museum in Paris. He had a plan.', act: '🚶 Walk slowly on the spot.', scene: '🏛️' },
    { say: 'He dressed like a museum worker. He waited and waited.', act: '🧥 Put on a big coat. Wait... wait...', scene: '🧥' },
    { say: 'He lifted the painting off the wall. He put it under his clothes!', act: '🏋️ Lift a painting. Hide it under your jumper.', scene: '🖼️' },
    { say: 'He rolled the painting up and walked out of the door.', act: '🚪 Tiptoe to the door. Shh!', scene: '🚪', key: true },
    { say: 'The next day, there was only an empty space on the wall.', act: '😮 Show a very surprised face.', scene: '🕳️' },
    { say: 'A museum worker called the police.', act: '📞 Pretend to make a phone call.', scene: '📞' },
    { say: 'Soon, the Mona Lisa was in the news all over the world: Madrid, Tokyo and New York.', act: '📰 Hold up a newspaper. Read it with big eyes!', scene: '📰' },
    { say: 'People lined up to see the empty space on the wall!', act: '🧍🧍 Stand in a line.', scene: '🧍' },
    { predict: 'For two years the police could not find the painting. Where is the Mona Lisa?',
      say: 'In 1913, Peruggia tried to sell the painting. A man called the police.', act: '📞 Pretend to call the police. Quick!', scene: '🕵️', key: true },
    { say: 'They arrested Peruggia. At last the Mona Lisa went home to the museum.', act: '👮 Hands behind your back. Then cheer!', scene: '👮' },
    { say: 'Because of the robbery, the Mona Lisa is one of the most famous paintings in the world!', act: '🎉 Take a photo with an invisible phone.', scene: '📱', key: true }
  ];
  D.headlines = [
    { e: '🏛️', t: 'MADRID', h: 'The Mona Lisa is missing!' }, { e: '🗼', t: 'TOKYO', h: 'Big robbery in Paris!' },
    { e: '🗽', t: 'NEW YORK', h: 'Where is the Mona Lisa?' }, { e: '👮', t: 'PARIS', h: 'Police look for the painting!' },
    { e: '🎉', t: 'LONDON', h: 'The Mona Lisa is found!' }
  ];

  /* Detective quiz show (book p. 64 A: own wording) */
  D.quiz = [
    { q: 'What did Peruggia want to do?', o: ['go to art class', 'steal a painting', 'be a museum guard'], a: 1, e: '🤔' },
    { q: 'Where did Peruggia put the Mona Lisa?', o: ['in his hat', 'under his clothes', 'on the wall'], a: 1, e: '🧥' },
    { q: 'What did people line up to see?', o: ['the news', 'the key', 'the empty space'], a: 2, e: '🧍' },
    { q: 'How many years did the police look for the painting?', o: ['two', 'twenty', 'twelve'], a: 0, e: '⏳' },
    { q: 'Who did the police arrest?', o: ['Mona Lisa', 'Peruggia', 'the art dealer'], a: 1, e: '👮' }
  ];
  D.debate = { q: 'Can someone steal a painting from a museum today?', yes: 'Yes, but a very small one.', no: 'No, there are alarms!', hint: ['Yes, a small one.', 'No, there are cameras!', 'No, there are guards!'] };
  D.faces = [
    { e: '😱', t: 'The painting is MISSING!', s: 'The worker is scared.' },
    { e: '😄', t: 'The painting is FOUND!', s: 'The worker is happy.' }
  ];

  root.U4G3Data = D;
})(window);
