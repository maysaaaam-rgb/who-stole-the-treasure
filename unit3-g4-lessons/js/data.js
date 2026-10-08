/* Unit 3 (Grade 4) "It Keeps Changing" - two teacher-led smartboard lessons where the CHILDREN do the work.
   Lesson 1: It Keeps Changing (book pp. 40-41: the pink river, good and bad changes, the Arctic, compare and contrast)
   Lesson 2: The Bear and I, part 1 (book pp. 42-43: stanzas 1-4 of the poem; Words in Context)
   All sentences are written for these lessons in very simple A1 English. No long book text is copied (poem lines are only retold).
   Facts come from the checked notes in unit3-work/out/final/unit3-grade4.json. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  /* ---------------- LESSON 1: It Keeps Changing ---------------- */
  D.missions1 = [
    { e: '🔎', t: 'See, think, wonder' }, { e: '👍', t: 'Good or bad changes?' }, { e: '🆚', t: 'Compare the Arctic and my town' },
    { e: '🐻‍❄️', t: 'Visit the Arctic' }, { e: '🃏', t: 'Play Arctic Memory' }
  ];
  D.stwPrompts = [
    'What do you see? Look at the picture.',
    'What do you think? Why is the water pink?',
    'What do you wonder? Ask a question.'
  ];

  D.zones1 = [{ k: 'G', t: '👍 GOOD', c: '#15803d' }, { k: 'B', t: '👎 BAD', c: '#b91c1c' }];
  D.walk1 = [
    { e: '🌱', t: 'A seed grows into a plant.', a: 'G' }, { e: '🧊', t: 'The Arctic ice is melting.', a: 'B' },
    { e: '🌸', t: 'Flowers open in spring.', a: 'G' }, { e: '🏭', t: 'Dirty smoke goes into the air.', a: 'B' },
    { e: '🌧️', t: 'Rain helps plants to grow.', a: 'G' }, { e: '🗑️', t: 'There is trash in the sea.', a: 'B' },
    { e: '🌳', t: 'People plant new trees.', a: 'G' }
  ];

  D.compare = [
    { l: '🥶 very cold', r: '🌤️ warm', s: 'It is very cold in the Arctic, but it is warm where I live.' },
    { l: '❄️ snow', r: '🌧️ rain', s: 'There is a lot of snow in the Arctic, but there is rain where I live.' },
    { l: '🧊 ice', r: '🌿 grass', s: 'There is ice in the Arctic, but there is grass where I live.' },
    { l: '🐻‍❄️ polar bears', r: '🐱 cats and dogs', s: 'There are polar bears in the Arctic, but there are cats and dogs where I live.' },
    { l: '🏠 one small house', r: '🏙️ many buildings', s: 'There is one small house in the picture, but there are many buildings where I live.' },
    { l: '🎣 fishing', r: '🛒 shopping', s: 'People go fishing in the Arctic, but people go shopping where I live.' }
  ];

  D.arctic = [
    { say: 'This is the Arctic. It is a land of wind and cold.', act: '🥶 Shiver! Brrr! Hug yourself.', scene: '🧭', ice: 100, bg: 0 },
    { say: 'There is ice and snow everywhere.', act: '❄️ Make snow with your fingers. Fall, fall, fall.', scene: '🧊', ice: 100, bg: 0 },
    { say: 'A man lives here. He catches fish through a hole in the ice.', act: '🎣 Fish! Pull, pull, pull!', scene: '👦', art: 'c_young_fisherman', ice: 100, bg: 0, key: true },
    { say: 'A big polar bear lives here too. It is white and hungry.', act: '🐻‍❄️ Walk like a big bear. Grrr!', scene: '🐻‍❄️', ice: 100, bg: 0 },
    { predict: 'The winters are getting warmer. What happens to the ice?', say: 'The ice gets thin. It is melting!', act: '🫠 Melt like ice: go down slowly to the floor.', scene: '🫠', ice: 45, bg: 1, key: true },
    { say: 'Now the man and the bear are in danger. The world is changing.', act: '⚠️ Make a worried face.', scene: '⚠️', ice: 30, bg: 1, key: true },
    { say: 'Can we help? Yes! We can make good changes.', act: '💪 Show your muscles: we can help!', scene: '🌍', ice: 30, bg: 1 }
  ];

  D.memory = [
    { id: 'bear', w: 'polar bear', e: '🐻‍❄️', a: 'w_polar_bear' }, { id: 'ice', w: 'ice', e: '🧊', a: 'w_ice' },
    { id: 'hole', w: 'fishing hole', e: '🕳️', a: 'w_hole' }, { id: 'melt', w: 'melting', e: '🫠', a: 'w_melting' },
    { id: 'thin', w: 'thin ice', e: '📄', a: 'w_thin' }, { id: 'rod', w: 'fishing rod', e: '🎣', a: 'w_fishing_rod' },
    { id: 'crack', w: 'crack', e: '💥', a: 'w_crack' }, { id: 'arctic', w: 'the Arctic', e: '🧭', a: 'w_arctic' }
  ];

  /* ---------------- LESSON 2: The Bear and I (part 1) ---------------- */
  D.missions2 = [
    { e: '🎭', t: 'Act out the poem' }, { e: '🔎', t: 'Find six new words' }, { e: '🔢', t: 'Put the story in order' },
    { e: '🧑', t: 'Man or bear?' }, { e: '🧊', t: 'Escape from the ice' }
  ];
  D.titlePrompts = [
    'Look at the title: The Bear and I. Who is “I”?',
    'Where is he? Look at the snow and the cabin.',
    'What do you think happens? Talk to your partner.'
  ];

  D.poem = [
    { say: 'A man tells his story. He is from a land of wind and cold. His story starts when he was young.', act: '🥶 Shiver and hug yourself.', scene: '🏔️', art: 's_1_land_of_cold' },
    { say: 'His fishing hole was in the ice. Each morning there were fish.', act: '🎣 Fish at your hole. Wait… wait…', scene: '🎣', art: 's_2_fishing_hole' },
    { predict: 'One day, something big is near his fishing hole. He is face to face with it! What is it?', say: 'A giant arctic bear! It is a polar bear.', act: '😱 Freeze! Face to face with a bear!', scene: '🐻‍❄️', art: 's_3_bear_twice', key: true },
    { say: 'The polar bear was twice his size. Its fur was white like snow.', act: '🐻‍❄️ Make yourself BIG. Twice as big!', scene: '🐻‍❄️', art: 's_3_bear_twice' },
    { say: 'When the bear was busy with his fish, it was the man’s chance to go.', act: '🏃 Run on the spot, quietly!', scene: '🏃', art: 's_3_bear_twice' },
    { say: 'From that day on, for many years, the bear was his enemy. It was often near his fishing hole.', act: '😠 Make an angry face at your partner.', scene: '😠', art: 's_4_enemy_years', key: true },
    { say: 'But the bear was hungry, just like the man!', act: '😋 Rub your tummy: so hungry!', scene: '😋', art: 's_4_enemy_years' }
  ];

  D.words = [
    { w: 'hole', e: '🕳️', def: 'an opening in something', ex: 'The man fishes through a hole in the ice.', gap: 'The man fishes through a ______ in the ice.' },
    { w: 'twice', e: '✌️', def: 'two times', ex: 'The bear is twice my size.', gap: 'The bear is ______ my size.' },
    { w: 'enemy', e: '😠', def: 'someone who is against you, not a friend', ex: 'For many years the bear was his enemy.', gap: 'For many years the bear was his ______.' },
    { w: 'thin', e: '📄', def: 'not thick, and easy to break', ex: 'Thin ice can break.', gap: '______ ice can break.' },
    { w: 'trap', e: '🪤', def: 'a place you cannot get out of', ex: 'The ice is a trap.', gap: 'The ice is a ______.' },
    { w: 'melting', e: '🫠', def: 'turning from ice into water', ex: 'The ice is melting.', gap: 'The ice is ______.' }
  ];

  D.order = [
    { e: '🏃', a: 's_3_bear_twice', n: 'The man has a chance to go', d: 'then', k: 3 },
    { e: '🎣', a: 's_2_fishing_hole', n: 'The man fishes at the hole', d: 'first', k: 1 },
    { e: '😠', a: 's_4_enemy_years', n: 'The bear is his enemy', d: 'last', k: 4 },
    { e: '🐻‍❄️', a: 'c_polar_bear', n: 'A giant bear is face to face with him', d: 'next', k: 2 }
  ];

  D.zones2 = [{ k: 'M', t: '🧑 MAN', c: '#0e7490' }, { k: 'B', t: '🤝 BOTH', c: '#475569' }, { k: 'R', t: '🐻‍❄️ BEAR', c: '#6d28d9' }];
  D.walk2 = [
    { e: '🎣', t: 'Who has a fishing rod?', a: 'M', s: 'The man has a fishing rod.' },
    { e: '🐟', t: 'Who eats fish?', a: 'B', s: 'Both the man and the bear eat fish.' },
    { e: '🧭', t: 'Who lives in the Arctic?', a: 'B', s: 'Both live in the Arctic.' },
    { e: '😋', t: 'Who is hungry?', a: 'B', s: 'Both are hungry.' },
    { e: '✌️', t: 'Who is twice the man’s size?', a: 'R', s: 'The bear is twice the man’s size.' },
    { e: '🏠', t: 'Who lives in a house?', a: 'M', s: 'The man lives in a house.' },
    { e: '🧥', t: 'Who wears a yellow jacket?', a: 'M', s: 'The man wears a yellow jacket.' },
    { e: '🤍', t: 'Who has white fur?', a: 'R', s: 'The bear has white fur.' }
  ];

  /* Ice Escape quiz: question text with a gap, three choices, index of the right one */
  D.quiz = [
    { q: 'The polar bear was ______ my size.', o: ['twice', 'thin', 'hole'], a: 0, say: 'The polar bear was twice my size.' },
    { q: 'My fishing ______ was in the ice.', o: ['enemy', 'hole', 'melting'], a: 1, say: 'My fishing hole was in the ice.' },
    { q: 'For many years the bear was my ______.', o: ['enemy', 'twice', 'trap'], a: 0, say: 'For many years the bear was my enemy.' },
    { q: 'Where is the man from?', o: ['a hot desert', 'a big city', 'a land of wind and cold'], a: 2, say: 'He is from a land of wind and cold.' },
    { q: 'The ice is turning into water. It is ______.', o: ['melting', 'twice', 'hungry'], a: 0, say: 'The ice is melting.' },
    { q: '______ ice can break.', o: ['Thin', 'Hot', 'Loud'], a: 0, say: 'Thin ice can break.' },
    { q: 'A place you cannot get out of is a ______.', o: ['hole', 'trap', 'fish'], a: 1, say: 'A place you cannot get out of is a trap.' },
    { q: 'How big is the polar bear?', o: ['very small', 'the same size as the man', 'twice the man’s size'], a: 2, say: 'The polar bear is twice the man’s size.' },
    { q: 'What do the man and the bear both want?', o: ['fish', 'a house', 'a phone'], a: 0, say: 'They both want fish. They are both hungry.' },
    { q: 'Where does the man fish?', o: ['in a river', 'through a hole in the ice', 'in a swimming pool'], a: 1, say: 'He fishes through a hole in the ice.' },
    { q: 'The Arctic is very ______.', o: ['cold', 'hot', 'dry'], a: 0, say: 'The Arctic is very cold.' },
    { q: 'The bear’s fur is the colour of ______.', o: ['snow', 'grass', 'sand'], a: 0, say: 'The bear’s fur is the colour of snow.' }
  ];
  D.steps = 6;

  root.U3G4Data = D;
})(window);
