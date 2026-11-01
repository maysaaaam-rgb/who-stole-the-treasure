/* Game Maker: Balanced Units 1-4 Revision Packs (Grade 3 & Grade 4).
   Curated ~36-question packs with equal representation across Unit 1, Unit 2, Unit 3, and Unit 4. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  function rows(list, grade, unit) {
    return list.map(function (r) {
      return {
        q: r[0],
        a: r[1],
        w: [r[2], r[3]].filter(Boolean),
        pic: r[4] || '',
        skill: r[5] || 'Words',
        grade: grade,
        unit: unit
      };
    });
  }
  function itemsOf(id) {
    var s = (GM.sets || []).filter(function (x) { return x.id === id; })[0];
    return s ? s.items.slice() : [];
  }
  function takeNonListening(list, n) {
    var clean = list.filter(function (it) { return it.skill !== 'Listening'; });
    var out = [], step = Math.max(1, clean.length / n);
    for (var i = 0; i < n && Math.floor(i * step) < clean.length; i++) {
      out.push(clean[Math.floor(i * step)]);
    }
    return out;
  }

  var R = {
    3: {
      u1: [
        ['My room is a ___. Toys are everywhere!', 'mess', 'plan', 'mirror', '🧸', 'Words'],
        ['Please ___ your room. Put the toys away.', 'tidy', 'invent', 'drop', '🧹', 'Words'],
        ['It doesn’t work yet. Don’t stop — ___ again!', 'try', 'sleep', 'hide', '💪', 'Words'],
        ['Clara builds a ___ to clean her room.', 'machine', 'mountain', 'museum', '🤖', 'Reading'],
        ['What does “invent” mean?', 'make something new', 'eat your lunch', 'sleep all day', '💡', 'Words'],
        ['A beam bridge is ___ and flat.', 'strong', 'hungry', 'sleepy', '🌉', 'Words'],
        ['Which material floats on water?', 'wood', 'heavy stone', 'metal coins', '🪵', 'Reading'],
        ['Does a heavy stone float or sink in water?', 'It sinks.', 'It floats.', 'It flies.', '🪨', 'Sentences']
      ],
      u2: [
        ['Choose the right word: “I am thankful ___ my kind teacher.”', 'for', 'to', 'at', '🙏', 'Sentences'],
        ['Choose the right word: “They are thankful ___ the delicious food.”', 'for', 'with', 'in', '🍎', 'Sentences'],
        ['There ___ a bright full moon in the sky tonight.', 'is', 'are', 'were', '🌕', 'Sentences'],
        ['There ___ pink potatoes under the soil.', 'are', 'is', 'am', '🥔', 'Sentences'],
        ['There ___ a red pineapple on the table.', 'is', 'are', 'were', '🍍', 'Sentences'],
        ['Complete the polite question: “Can we ___ outside, Mom?”', 'go', 'goes', 'going', '🌳', 'Sentences'],
        ['Why are they happy? ___ harvest time is here!', 'Because', 'So', 'Instead', '🌾', 'Sentences'],
        ['The opposite of FAST is ___.', 'slow', 'tall', 'left', '🐢', 'Words']
      ],
      u3: [
        ['Long ago, people ___ for things. They gave a goat for grain.', 'bartered', 'saved', 'painted', '🐐', 'Words'],
        ['A credit card is made of ___.', 'plastic', 'grain', 'shells', '💳', 'Words'],
        ['What does “expensive” mean?', 'costs a lot of money', 'costs no money', 'very small', '💰', 'Words'],
        ['The ___ takes your money in a shop.', 'cashier', 'farmer', 'guard', '🧾', 'Words'],
        ['Paige ___ through the park yesterday.', 'walked', 'walk', 'walking', '🚶‍♀️', 'Sentences'],
        ['Paige ___ buy the phone because she saved her money.', 'did not', 'do not', 'does not', '📱', 'Sentences'],
        ['Paper money is easier to carry ___ metal coins.', 'than', 'then', 'that', '💵', 'Sentences'],
        ['There ___ a beautiful black phone in the store.', 'was', 'were', 'are', '🏬', 'Sentences']
      ]
    },
    4: {
      u1: [
        ['A rabbit sees a fox. It stays very still. It can ___.', 'freeze', 'visualize', 'journey', '🐰', 'Words'],
        ['Every year, monarch butterflies go on a long ___.', 'journey', 'workout', 'platform', '🦋', 'Words'],
        ['When I read, I ___ the story. I make pictures in my head.', 'visualize', 'freeze', 'chase', '💭', 'Words'],
        ['Alice sat by the tree. She felt tired and ___.', 'sleepy', 'noisy', 'electric', '😴', 'Reading'],
        ['___ did Alice chase? — A White Rabbit!', 'Who', 'Where', 'When', '🐇', 'Sentences'],
        ['___ was Alice sleepy? — Because she was bored.', 'Why', 'Who', 'Where', '❓', 'Sentences'],
        ['___ did Alice fall? — Down a deep rabbit hole.', 'Where', 'Who', 'Why', '🕳️', 'Sentences'],
        ['Yesterday Alice ___ the White Rabbit.', 'chased', 'chase', 'chasing', '🏃‍♀️', 'Sentences']
      ],
      u2: [
        ['What is a VET?', 'a doctor who helps sick or hurt animals', 'a person who drives a train', 'a painter in a museum', '🩺', 'Words'],
        ['What is a NEEDLE on a pine tree?', 'a thin, sharp green leaf', 'a big round yellow flower', 'a wooden boat on a lake', '🌲', 'Words'],
        ['Pine trees make cones instead ___ flowers.', 'of', 'to', 'for', '🌲', 'Sentences'],
        ['Animals grow thick winter fur ___ they can stay warm.', 'so', 'instead', 'but', '🐻', 'Sentences'],
        ['What is the past tense of BUILD?', 'built', 'builded', 'building', '🏠', 'Sentences'],
        ['What is the past tense of GROW?', 'grew', 'growed', 'growing', '🌱', 'Sentences'],
        ['What is the past tense of PAY?', 'paid', 'payed', 'paying', '🪙', 'Sentences'],
        ['What is the past tense of GIVE?', 'gave', 'gived', 'giving', '🎁', 'Sentences']
      ],
      u3: [
        ['Gasoline cars are ___. They make a lot of loud sound.', 'noisy', 'quiet', 'tiny', '🚗', 'Words'],
        ['A car uses ___ to move: gasoline, electricity, or solar power.', 'energy', 'shells', 'statues', '⚡', 'Words'],
        ['What does “thin ice” mean?', 'not thick; easy to crack and break', 'very thick and strong', 'hot and dry', '🧊', 'Words'],
        ['What does “trap” mean?', 'a place you cannot get out of', 'a clean electric car', 'a warm winter coat', '🕳️', 'Words'],
        ['After many warm winters, the Arctic ice ___ thin.', 'was', 'were', 'are', '🐻‍❄️', 'Sentences'],
        ['Gasoline cars ___ fast, but they make dirty smoke.', 'are', 'is', 'am', '💨', 'Sentences'],
        ['Electric cars are clean, ___ they can be expensive.', 'but', 'because', 'so', '🔋', 'Sentences'],
        ['I ride my bike ___ bikes do not make the air dirty.', 'because', 'but', 'then', '🚲', 'Sentences']
      ]
    }
  };

  GM.sets = GM.sets || [];
  GM.sets.push({
    id: 'u14-g3',
    title: 'Units 1–4 Mix · Grade 3 (All 4 Units)',
    sub: 'Balanced Review: Inventions, Thank You, Money & What Happened',
    grade: 3,
    unit: 0,
    skill: '',
    e: '🔁',
    items: rows(R[3].u1, 3, 1).concat(rows(R[3].u2, 3, 2), rows(R[3].u3, 3, 3), takeNonListening(itemsOf('u4-g3'), 10))
  });
  GM.sets.push({
    id: 'u14-g4',
    title: 'Units 1–4 Mix · Grade 4 (All 4 Units)',
    sub: 'Balanced Review: Reading, Habitats, Changing World & Teamwork',
    grade: 4,
    unit: 0,
    skill: '',
    e: '🔁',
    items: rows(R[4].u1, 4, 1).concat(rows(R[4].u2, 4, 2), rows(R[4].u3, 4, 3), takeNonListening(itemsOf('u4-g4'), 10))
  });
})(typeof window !== 'undefined' ? window : this);
