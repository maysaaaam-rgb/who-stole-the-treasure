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

  /* ------------------------------------------------ Case File 1: A Picture on the Wall (book pp. 56-59) */
  D.c1missions = [
    { e: '🗽', t: 'Open & Think-Pair-Share', a: 'o_statue' },
    { e: '🖼️', t: 'Spot the 5 changes', a: 'o_mona_frame' },
    { e: '🔍', t: '5 case words + Mime', a: 'c_daphne_case' },
    { e: '⚙️', t: 'Past-Tense Machine', a: 'o_plan' },
    { e: '🤫', t: 'Sneak & Past Detectives', a: 'o_steal' },
    { e: '⏳', t: 'Timeline & Case Closed', a: 'o_newspaper' }
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
    { w: 'People', b: '🧍', a: '👥👥👥', artB: 'o_steal', artA: 'c_daphne_case', x: '22%', y: '62%', sb: 'There is one man in the museum.', sa: 'There are many people in the museum.' },
    { w: 'The painting', b: '🖼️❓', a: '🖼️😊', artB: 'o_robbery', artA: 'o_mona_frame', x: '50%', y: '34%', sb: 'The painting is not on the wall.', sa: 'The painting is on the wall.' },
    { w: 'Phones', b: '❌📱', a: '📱📱📱', artB: 'o_plan', artA: 'o_newspaper', x: '78%', y: '64%', sb: 'Nobody has a phone.', sa: 'People have phones.' },
    { w: 'The man', b: '😈', a: '🙂', artB: 'o_lifted', artA: 'o_police', x: '28%', y: '30%', sb: 'The man looks sneaky.', sa: 'The people look happy.' },
    { w: 'The mood', b: '🤫', a: '🎉', artB: 'o_arrested', artA: 'o_statue', x: '74%', y: '28%', sb: 'It is very quiet.', sa: 'It is a big happy day.' }
  ];

  /* Case words (book p. 59 Words in Context) with NOUN / VERB / PAST VERB badges */
  D.words = [
    { w: 'plan', pos: 'NOUN', posColor: '#38bdf8', e: '📝', a: 'o_plan', def: 'an idea of what you will do', ex: 'Peruggia had a plan.', gap: 'Peruggia had a ____.', mime: 'Think hard, then point to your head and nod.' },
    { w: 'steal', pos: 'VERB', posColor: '#10b981', e: '🥷', a: 'o_steal', def: 'to take something that is not yours', ex: 'He wanted to steal the painting.', gap: 'He wanted to ____ the painting.', mime: 'Tiptoe and put an invisible thing in your bag.' },
    { w: 'lifted', pos: 'PAST VERB', posColor: '#f59e0b', e: '🏋️', a: 'o_lifted', def: 'took something up', ex: 'He lifted the painting off the wall.', gap: 'He ____ the painting off the wall.', mime: 'Lift a big heavy thing up with both arms.' },
    { w: 'robbery', pos: 'NOUN', posColor: '#38bdf8', e: '🚨', a: 'o_robbery', def: 'when someone steals something', ex: 'The robbery was in the news.', gap: 'The ____ was in the news.', mime: 'Hands up, shout: Stop! Robbery!' },
    { w: 'arrested', pos: 'PAST VERB', posColor: '#f59e0b', e: '👮', a: 'o_arrested', def: 'the police take a bad person away', ex: 'The police arrested Peruggia.', gap: 'The police ____ Peruggia.', mime: 'Put both hands behind your back.' }
  ];

  /* Past-Tense Machine (teach before testing: 6 regular +ed verbs & 3 special irregular cards) */
  D.pastMachine = {
    regular: [
      { now: 'walk', past: 'walked', a: 'o_steal', ex: 'Yesterday, Peruggia walked into the museum.' },
      { now: 'want', past: 'wanted', a: 'o_mona_frame', ex: 'He wanted to steal the painting.' },
      { now: 'lift', past: 'lifted', a: 'o_lifted', ex: 'He lifted the painting off the wall.' },
      { now: 'call', past: 'called', a: 'o_police', ex: 'A worker called the police.' },
      { now: 'arrest', past: 'arrested', a: 'o_arrested', ex: 'The police arrested Peruggia.' },
      { now: 'paint', past: 'painted', a: 'o_mona_frame', ex: 'Leonardo painted the Mona Lisa.' }
    ],
    irregular: [
      { now: 'take', past: 'took', a: 'o_steal', ex: 'In 1911, Peruggia took the painting.' },
      { now: 'hide', past: 'hid', a: 'o_lifted', ex: 'He hid the painting under his coat.' },
      { now: 'find', past: 'found', a: 'c_daphne_case', ex: 'In 1913, the police found the painting!' }
    ]
  };

  /* Past-tense detectives: Peruggia's story (regular and irregular verbs, own sentences, mapped to art) */
  D.past = [
    { s: 'Yesterday, Peruggia ____ into the museum. (walk)', o: ['walked', 'walks', 'walking'], a: 0, e: '🚶', art: 'o_steal', hint: 'Yesterday = walk + ed (walked)!' },
    { s: 'He ____ to steal the painting. (want)', o: ['wanted', 'want', 'wants'], a: 0, e: '🖼️', art: 'o_mona_frame', hint: 'Yesterday = want + ed (wanted)!' },
    { s: 'He ____ the painting off the wall. (lift)', o: ['lifted', 'lifts', 'lifting'], a: 0, e: '🏋️', art: 'o_lifted', hint: 'Yesterday = lift + ed (lifted)!' },
    { s: 'He ____ the painting under his coat. (hide)', o: ['hid', 'hides', 'hide'], a: 0, e: '🧥', art: 'o_steal', hint: 'Special past verb: hide → hid!' },
    { s: 'A worker ____ the police. (call)', o: ['called', 'calls', 'calling'], a: 0, e: '📞', art: 'o_robbery', hint: 'Yesterday = call + ed (called)!' },
    { s: 'The police ____ Peruggia. (arrest)', o: ['arrested', 'arrest', 'arrests'], a: 0, e: '👮', art: 'o_arrested', hint: 'Yesterday = arrest + ed (arrested)!' },
    { s: 'The police ____ the painting. (find)', o: ['found', 'find', 'finds'], a: 0, e: '🔍', art: 'c_daphne_case', hint: 'Special past verb: find → found!' },
    { s: 'Leonardo ____ the Mona Lisa. (paint)', o: ['painted', 'paints', 'paint'], a: 0, e: '🎨', art: 'o_mona_frame', hint: 'In 1503 = paint + ed (painted)!' }
  ];

  /* Timeline (years from the story; steps kept as strings for test harness compatibility + arts array) */
  D.timeline = [
    {
      title: 'The Mona Lisa timeline',
      e: '⏳',
      arts: ['o_mona_frame', 'o_steal', 'o_arrested', 'c_daphne_case'],
      steps: [
        'In 1503, Leonardo painted the Mona Lisa.',
        'In 1911, Peruggia took the painting.',
        'In 1913, the police found it.',
        'Then the Mona Lisa went home to the museum.'
      ]
    },
    {
      title: 'The robbery night',
      e: '🌙',
      arts: ['o_plan', 'o_lifted', 'o_steal', 'o_robbery'],
      steps: [
        'Peruggia put on a worker coat.',
        'He lifted the painting off the wall.',
        'He hid it under his coat.',
        'He walked out of the museum.'
      ]
    }
  ];
  D.orderWords = ['First,', 'Then,', 'After that,', 'Finally,'];

  /* ------------------------------------------------ Case File 2: Where Is She? (book pp. 58-64) */
  D.c2missions = [
    { e: '⚡', t: 'Word flash', a: 'c_daphne_case' },
    { e: '🎬', t: 'Act out the robbery', a: 'o_mona_frame' },
    { e: '📰', t: 'Write the headline', a: 'o_newspaper' },
    { e: '❓', t: 'Detective quiz show', a: 'o_police' },
    { e: '🗣️', t: 'Four corners debate', a: 'o_robbery' },
    { e: '🎨', t: 'Draw two faces', a: 'o_arrested' }
  ];
  D.story = [
    { say: 'In 1503, Leonardo da Vinci painted the Mona Lisa.', act: '🎨 Pretend to paint a small picture.', scene: '🎨', art: 'o_mona_frame' },
    { say: 'In 1911, Peruggia went into the museum in Paris. He had a plan.', act: '🚶 Walk slowly on the spot.', scene: '🏛️', art: 'o_plan' },
    { say: 'He dressed like a museum worker. He waited and waited.', act: '🧥 Put on a big coat. Wait... wait...', scene: '🧥', art: 'o_steal' },
    { say: 'He lifted the painting off the wall. He put it under his clothes!', act: '🏋️ Lift a painting. Hide it under your jumper.', scene: '🖼️', art: 'o_lifted' },
    { say: 'He rolled the painting up and walked out of the door.', act: '🚪 Tiptoe to the door. Shh!', scene: '🚪', art: 'o_steal', key: true },
    { say: 'The next day, there was only an empty space on the wall.', act: '😮 Show a very surprised face.', scene: '🕳️', art: 'o_robbery' },
    { say: 'A museum worker called the police.', act: '📞 Pretend to make a phone call.', scene: '📞', art: 'o_police' },
    { say: 'Soon, the Mona Lisa was in the news all over the world: Madrid, Tokyo and New York.', act: '📰 Hold up a newspaper. Read it with big eyes!', scene: '📰', art: 'o_newspaper' },
    { say: 'People lined up to see the empty space on the wall!', act: '🧍🧍 Stand in a line.', scene: '🧍', art: 'o_robbery' },
    { predict: 'For two years the police could not find the painting. Where is the Mona Lisa?',
      say: 'In 1913, Peruggia tried to sell the painting. A man called the police.', act: '📞 Pretend to call the police. Quick!', scene: '🕵️', art: 'c_daphne_case', key: true },
    { say: 'They arrested Peruggia. At last the Mona Lisa went home to the museum.', act: '👮 Hands behind your back. Then cheer!', scene: '👮', art: 'o_arrested' },
    { say: 'Because of the robbery, the Mona Lisa is one of the most famous paintings in the world!', act: '🎉 Take a photo with an invisible phone.', scene: '📱', art: 'o_mona_frame', key: true }
  ];
  D.headlines = [
    { e: '🏛️', a: 'o_robbery', t: 'MADRID', h: 'The Mona Lisa is missing!' },
    { e: '🗼', a: 'o_newspaper', t: 'TOKYO', h: 'Big robbery in Paris!' },
    { e: '🗽', a: 'o_statue', t: 'NEW YORK', h: 'Where is the Mona Lisa?' },
    { e: '👮', a: 'o_police', t: 'PARIS', h: 'Police look for the painting!' },
    { e: '🎉', a: 'o_mona_frame', t: 'LONDON', h: 'The Mona Lisa is found!' }
  ];

  /* Detective quiz show (book p. 64 A: own wording) */
  D.quiz = [
    { q: 'What did Peruggia want to do?', o: ['go to art class', 'steal a painting', 'be a museum guard'], a: 1, e: '🤔', art: 'o_steal', hint: 'Think about the Mona Lisa on the wall!' },
    { q: 'Where did Peruggia put the Mona Lisa?', o: ['in his hat', 'under his clothes', 'on the wall'], a: 1, e: '🧥', art: 'o_lifted', hint: 'He wore a big white worker coat!' },
    { q: 'What did people line up to see?', o: ['the news', 'the key', 'the empty space'], a: 2, e: '🧍', art: 'o_robbery', hint: 'The painting was gone, so the wall had an…' },
    { q: 'How many years did the police look for the painting?', o: ['two', 'twenty', 'twelve'], a: 0, e: '⏳', art: 'c_daphne_case', hint: 'From 1911 to 1913!' },
    { q: 'Who did the police arrest?', o: ['Mona Lisa', 'Peruggia', 'the art dealer'], a: 1, e: '👮', art: 'o_arrested', hint: 'Who stole the painting?' }
  ];
  D.debate = {
    q: 'Can someone steal a painting from a museum today?',
    yes: 'Yes, but a very small one.',
    no: 'No, there are alarms!',
    hint: ['Yes, a small one.', 'No, there are cameras!', 'No, there are guards!']
  };
  D.faces = [
    { e: '😱', a: 'o_robbery', t: 'The painting is MISSING!', s: 'The worker is scared.' },
    { e: '😄', a: 'o_mona_frame', t: 'The painting is FOUND!', s: 'The worker is happy.' }
  ];

  root.U4G3Data = D;
})(window);
