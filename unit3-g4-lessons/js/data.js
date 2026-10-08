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


  /* ---------------- LESSON 3: The Ice Cracks (book pp. 44-45, stanzas 5-8) ---------------- */
  D.missions3 = [
    { e: '🧠', t: 'Remember stanzas 1-4' }, { e: '🎭', t: 'Act out stanzas 5-8' }, { e: '🔎', t: 'Learn six poem words' },
    { e: '➡️', t: 'Follow the cause and effect' }, { e: '🃏', t: 'Play Cause and Effect Pairs' }, { e: '🌍', t: 'Say how we can help' }
  ];
  D.recapPrompts = [
    'Last lesson we met a man and a giant polar bear. Where is the man from?',
    'Who was the man’s enemy for many years?',
    'Today the ice gets thin. What do you think happens?'
  ];
  D.poem2 = [
    { say: 'After many warm winters, the ice on the sea was thin.', act: '🌡️ Fan yourself: so warm! Then make a thin line with your hands.', scene: '🌡️', art: 'w_thin', ice: 55, bg: 1 },
    { predict: 'One morning, the bear was near the man. The ice is very thin! What do you think happens?', say: 'Crack! The bear and the man fell in!', act: '💥 Clap once: CRACK! Then fall down slowly.', scene: '💥', art: 'w_crack', ice: 25, bg: 1, key: true },
    { say: 'It was difficult to swim. They were in a trap of ice and sea.', act: '🏊 Swim, swim, swim! It is difficult!', scene: '🏊', art: 'w_swim', ice: 25, bg: 1 },
    { say: 'But they were in the trap together. They helped each other.', act: '🤝 Hold hands with your partner. Together!', scene: '🤝', ice: 25, bg: 1, key: true },
    { say: 'The bear was not his enemy any more.', act: '😊 Smile at your partner. Friends!', scene: '😊', ice: 25, bg: 1, key: true },
    { say: 'From that day on, it was clear: things change as years go by.', act: '📅 Turn the pages of a calendar with your hand.', scene: '📅', ice: 20, bg: 1 },
    { say: 'There is danger in this changing world, for the bear and for the man.', act: '⚠️ Make a worried face. Danger!', scene: '⚠️', art: 'w_danger', ice: 15, bg: 1, key: true },
    { say: 'Today the ice is melting, and the man is getting old. But he hopes to see the bear once more, living in the cold.', act: '🙏 Hold your hands together: I hope…', scene: '🙏', art: 'w_hope', ice: 10, bg: 1, key: true }
  ];
  D.words3 = [
    { w: 'crack', e: '💥', def: 'a line or a break, and the sound when ice breaks', ex: 'The ice made a loud crack.', gap: 'The ice made a loud ______.' },
    { w: 'swim', e: '🏊', def: 'move through water with your arms and legs', ex: 'It was difficult to swim in the cold sea.', gap: 'It was difficult to ______ in the cold sea.' },
    { w: 'together', e: '🤝', def: 'with each other', ex: 'The man and the bear were in the trap together.', gap: 'The man and the bear were in the trap ______.' },
    { w: 'danger', e: '⚠️', def: 'something that can hurt you', ex: 'There is danger in this changing world.', gap: 'There is ______ in this changing world.' },
    { w: 'hope', e: '🙏', def: 'want something good to happen', ex: 'The man hopes to see the bear again.', gap: 'The man ______ to see the bear again.' },
    { w: 'once more', e: '1️⃣', def: 'one more time', ex: 'He hopes to see the bear once more.', gap: 'He hopes to see the bear ______.' }
  ];
  D.chain = [
    { e: '🌡️', a: 'w_climate_change', n: 'Many warm winters', k: 1 }, { e: '📄', a: 'w_thin', n: 'The ice gets thin', k: 2 },
    { e: '💥', a: 'w_crack', n: 'The ice cracks', k: 3 }, { e: '🌊', a: 'w_swim', n: 'The man and the bear fall in', k: 4 },
    { e: '🤝', a: null, n: 'They are in the trap together', k: 5 }
  ];
  D.pairs3 = [
    { id: 'c1', a: { e: '🌡️', t: 'There are many warm winters.' }, b: { e: '📄', t: 'The ice on the sea is thin.' } },
    { id: 'c2', a: { e: '📄', t: 'The ice is thin.' }, b: { e: '💥', t: 'The ice cracks.' } },
    { id: 'c3', a: { e: '💥', t: 'The ice cracks.' }, b: { e: '🌊', t: 'The bear and the man fall in.' } },
    { id: 'c4', a: { e: '🏊', t: 'It is difficult to swim.' }, b: { e: '🪤', t: 'They are in a trap of ice and sea.' } },
    { id: 'c5', a: { e: '🤝', t: 'They help each other.' }, b: { e: '😊', t: 'The bear is not his enemy.' } },
    { id: 'c6', a: { e: '🫠', t: 'The ice is melting.' }, b: { e: '⚠️', t: 'There is danger for the bear and the man.' } }
  ];
  D.help = [
    { e: '🚲', n: 'ride a bike', a: 'w_bike' }, { e: '🗑️', n: 'clean up trash', a: 'w_trash' }, { e: '🚶', n: 'walk to school' },
    { e: '🌳', n: 'plant trees' }, { e: '💡', n: 'turn off lights' }, { e: '🚗', n: 'use clean cars' }
  ];

  /* ---------------- LESSON 4: Explore the Poem (book pp. 46-47) ---------------- */
  D.missions4 = [
    { e: '✅', t: 'True or false?' }, { e: '🔤', t: 'Say the -ng sound' }, { e: '🔎', t: 'Find the stanza' },
    { e: '🤝', t: 'Are they friends?' }, { e: '🆚', t: 'Compare two cars' }, { e: '🎤', t: 'Perform the poem' }
  ];
  D.zones4 = [{ k: 'T', t: '✅ TRUE', c: '#15803d' }, { k: 'F', t: '❌ FALSE', c: '#b91c1c' }];
  D.walk4 = [
    { e: '🐻‍❄️', t: 'When the man was young, the bear was his friend.', a: 'F', s: 'False. The bear was his enemy.' },
    { e: '😋', t: 'The man was hungry.', a: 'T', s: 'True. He was hungry, just like the bear.' },
    { e: '🌡️', t: 'The ice was thin because the winters were cold.', a: 'F', s: 'False. The ice was thin because the winters were warm.' },
    { e: '⚠️', t: 'Some of the changes are bad for the man and the bear.', a: 'T', s: 'True. There is danger in the changing world.' },
    { e: '🙏', t: 'At the end of the poem, the man does not want to see the bear.', a: 'F', s: 'False. He hopes to see the bear once more.' }
  ];
  D.ngWords = [
    { w: 'sing', e: '🎤', ng: true }, { w: 'long', e: '📏', ng: true }, { w: 'reading', e: '📖', ng: true }, { w: 'bang', e: '🎆', ng: true }, { w: 'spring', e: '🌸', ng: true },
    { w: 'young', e: '👦', ng: true }, { w: 'fishing', e: '🎣', ng: true }, { w: 'morning', e: '🌅', ng: true }, { w: 'melting', e: '🫠', ng: true }, { w: 'changing', e: '🔄', ng: true },
    { w: 'cold', e: '🥶', ng: false }, { w: 'bear', e: '🐻‍❄️', ng: false }, { w: 'ice', e: '🧊', ng: false }, { w: 'fish', e: '🐟', ng: false }, { w: 'trap', e: '🪤', ng: false }, { w: 'swim', e: '🏊', ng: false }
  ];
  D.stanzaQuiz = [
    { q: 'Where is the man from?', a: 1, say: 'He is from a land of wind and cold. That is in stanza 1.' },
    { q: 'How big is the polar bear?', a: 3, say: 'The polar bear is twice his size. That is in stanza 3.' },
    { q: 'Where is the man’s fishing hole?', a: 2, say: 'His fishing hole is in the ice. That is in stanza 2.' },
    { q: 'What was the bear to the man for many years?', a: 4, say: 'The bear was his enemy. That is in stanza 4.' },
    { q: 'Why is the ice thin?', a: 5, say: 'The ice is thin after many warm winters. That is in stanza 5.' },
    { q: 'Why are they in the water?', a: 5, say: 'The ice cracked and they fell in. That is in stanza 5.' },
    { q: 'What was the bear NOT to the man in the trap?', a: 6, say: 'The bear was not his enemy. That is in stanza 6.' },
    { q: 'What changes as the years go by?', a: 7, say: 'Things change as years go by. That is in stanza 7.' },
    { q: 'What does the man hope?', a: 8, say: 'He hopes to see the bear once more. That is in stanza 8.' },
    { q: 'What is melting today?', a: 8, say: 'Today the ice is melting. That is in stanza 8.' }
  ];
  D.friendVote = [{ e: '🤝', n: 'friends' }, { e: '🚫', n: 'not friends' }, { e: '🤔', n: 'not sure' }];
  D.cars = [
    { l: '🔴 red car', r: '⚪ white car', s: 'The red car is red, but the white car is white.' },
    { l: '🚙 big', r: '🚗 small', s: 'The red car is big, but the white car is small.' },
    { l: '🔊 noisy', r: '🤫 quiet', s: 'The red car is noisy, but the white car is quiet.' },
    { l: '🛞 four wheels', r: '🛞 four wheels', s: 'Both cars have four wheels.' },
    { l: '🏎️ fast', r: '🏎️ fast', s: 'Both cars are fast.' }
  ];
  D.stanzaRetell = [
    { n: 1, t: 'A man from a land of wind and cold tells his story.', e: '🏔️' }, { n: 2, t: 'He fishes through a hole in the ice. He meets a giant bear.', e: '🎣' },
    { n: 3, t: 'The polar bear is twice his size. It is hungry too.', e: '🐻‍❄️' }, { n: 4, t: 'For many years the bear is his enemy.', e: '😠' },
    { n: 5, t: 'After warm winters the ice is thin. It cracks and they fall in.', e: '💥' }, { n: 6, t: 'They are in a trap together. The bear is not his enemy.', e: '🤝' },
    { n: 7, t: 'Things change as years go by. There is danger in the world.', e: '⚠️' }, { n: 8, t: 'Today the ice is melting. The man hopes to see the bear once more.', e: '🙏' }
  ];


  root.U3G4Data = D;
})(window);
