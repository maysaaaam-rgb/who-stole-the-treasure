/* Game Maker: Super-Easy A1 Speaking & Acting Sets (Grade 3 & Grade 4, Units 1–4).
   Designed for 8–10 year old A1 ESL learners:
   - Short 4–6 word prompt + fun physical gesture/action (act)
   - Big visible 3–5 word target sentence on the card
   - 1-word / gesture option so shy learners can succeed with 1 word + action!
   - Registers both All-Units Speaking Sets (speak-g3, speak-g4) and Per-Unit Speaking Sets (speak-g3-u1..u4, speak-g4-u1..u4). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};

  function spk(unit, q, a, pic, act, words) {
    return {
      q: q,
      a: a,
      w: [],
      pic: pic || '🎤',
      act: act || '',
      words: words || [],
      speak: 1,
      skill: 'Speaking',
      unit: unit
    };
  }

  /* =========================================================================
     GRADE 3 · UNITS 1–4 SUPER-EASY SPEAKING & ACTING (24 Cards, 6 per Unit)
     ========================================================================= */
  var G3 = [
    /* Unit 1 — What Does It Do? (Inventions, Clara's Room & Floating Bridges) */
    spk(1, 'Point and say:', 'My room is messy! 🧸', '🧸', '🙌 Put hands on cheeks!', ['messy', 'room', 'toys']),
    spk(1, 'Pretend to clean! Say:', 'I tidy my room! 🧹', '🧹', '🧹 Sweep with your arms!', ['tidy', 'clean', 'room']),
    spk(1, 'Tap your head! Say:', 'I can invent it! 💡', '💡', '💡 Point to your brain!', ['invent', 'machine', 'try']),
    spk(1, 'Make a bridge with arms! Say:', 'The bridge is strong! 🌉', '🌉', '🌉 Stretch both arms wide!', ['bridge', 'strong', 'flat']),
    spk(1, 'Show floating with hands! Say:', 'Wood can float! 🪵', '🪵', '🌊 Wave hands like water!', ['wood', 'float', 'water']),
    spk(1, 'Drop your hands down! Say:', 'Heavy stones sink! 🪨', '🪨', '⬇️ Drop hands down fast!', ['stone', 'sink', 'heavy']),

    /* Unit 2 — Thank You! (Harvest, Food & Chuseok Moon Circle) */
    spk(2, 'Put hands on heart! Say:', 'I am thankful! 🙏', '🙏', '💖 Hands over your heart!', ['thankful', 'teacher', 'family']),
    spk(2, 'Make a big circle! Say:', 'Look at the moon! 🌕', '🌕', '🙆 Make a moon circle over head!', ['full', 'moon', 'round']),
    spk(2, 'Point to the table! Say:', 'There is a pineapple! 🍍', '🍍', '🍍 Point and smile big!', ['There is', 'pineapple', 'food']),
    spk(2, 'Reach up high! Say:', 'Walk tall, walk tall! 🧍', '🧍', '🙌 Stretch up on tiptoes!', ['walk', 'tall', 'circle']),
    spk(2, 'Bend your knees! Say:', 'Walk low, walk low! 🧎', '🧎', '🧎 Crouch down low!', ['walk', 'low', 'slow']),
    spk(2, 'Wave to a friend! Say:', 'Can we play outside? 🌳', '🌳', '👋 Wave to your team!', ['Can we', 'play', 'outside']),

    /* Unit 3 — How Much Is It? (Bartering, Coins, Bills & Smart Saving) */
    spk(3, 'Swap hands with a friend! Say:', 'They bartered a goat! 🐐', '🐐', '🔄 Pretend to trade a goat!', ['bartered', 'goat', 'grain']),
    spk(3, 'Hold up a tiny coin! Say:', 'Coins are metal! 🪙', '🪙', '🤏 Hold up a shiny coin!', ['coins', 'metal', 'shells']),
    spk(3, 'Wave a paper bill! Say:', 'Paper money is light! 💵', '💵', '💵 Wave a paper bill!', ['paper', 'bill', 'light']),
    spk(3, 'Pretend to tap a card! Say:', 'Tap the credit card! 💳', '💳', '💳 Beep! Tap your card!', ['credit card', 'plastic', 'pay']),
    spk(3, 'Smile like a cashier! Say:', 'It is five dollars! 🧾', '🧾', '🤲 Hold out five fingers!', ['cashier', 'five', 'dollars']),
    spk(3, 'Put money in a pocket! Say:', 'Paige saved her money! 🐷', '🐷', '🏦 Pat your pocket!', ['saved', 'money', 'smart']),

    /* Unit 4 — What Happened? (Mona Lisa & The Angry Mountain) */
    spk(4, 'Sneak on tiptoes! Say:', 'He took the painting! 🖼️', '🖼️', '🤫 Tiptoe like a thief!', ['took', 'painting', 'stole']),
    spk(4, 'Hide under your coat! Say:', 'He hid it here! 🧥', '🧥', '🧥 Pull your coat closed!', ['hid', 'under', 'coat']),
    spk(4, 'Stand like a police officer! Say:', 'The police found it! 👮', '👮', '✋ Hold up a hand: STOP!', ['police', 'found', 'arrested']),
    spk(4, 'Make a volcano BOOM! Say:', 'The volcano went BOOM! 🌋', '🌋', '💥 Jump and throw arms up!', ['volcano', 'thunder', 'boom']),
    spk(4, 'Pretend to row a boat! Say:', 'Row the small boat! ⛵', '⛵', '🚣 Row, row, row fast!', ['boat', 'island', 'ash']),
    spk(4, 'Wave at the rescue ship! Say:', 'We are safe now! 🚢', '🚢', '🙌 Wave both arms high!', ['ship', 'sunrise', 'safe'])
  ];

  /* =========================================================================
     GRADE 4 · UNITS 1–4 SUPER-EASY SPEAKING & ACTING (24 Cards, 6 per Unit)
     ========================================================================= */
  var G4 = [
    /* Unit 1 — I Love Reading! (Alice, Monarch Butterflies & Brain Power) */
    spk(1, 'Check a pocket watch! Say:', 'Alice chased the rabbit! 🐇', '🐇', '🏃 Run in place fast!', ['chased', 'White Rabbit', 'late']),
    spk(1, 'Look down a deep hole! Say:', 'She fell down, down! 🕳️', '🕳️', '😮 Look down at the floor!', ['fell', 'deep', 'hole']),
    spk(1, 'Freeze like a statue! Say:', 'Rabbits freeze and hide! 🐰', '🐰', '🧊 Freeze! Don’t move!', ['freeze', 'still', 'rabbit']),
    spk(1, 'Flap butterfly wings! Say:', 'Butterflies fly far! 🦋', '🦋', '🦋 Flap your arms gently!', ['monarch', 'journey', 'warm']),
    spk(1, 'Tap your head and close eyes! Say:', 'I visualize the story! 💭', '💭', '😌 Point to your head!', ['visualize', 'picture', 'read']),
    spk(1, 'Open a book with hands! Say:', 'Reading helps my brain! 📖', '📖', '👐 Open hands like a book!', ['reading', 'brain', 'smart']),

    /* Unit 2 — What Lives Here? (Animal Survivors, Forest & Vet Rescue) */
    spk(2, 'Show a big camel hump! Say:', 'Camels live in deserts! 🐪', '🐪', '☀️ Wipe your hot forehead!', ['camel', 'hump', 'desert']),
    spk(2, 'Stretch your neck high! Say:', 'Giraffes eat high leaves! 🦒', '🦒', '🦒 Reach up to the tall tree!', ['giraffe', 'tall', 'leaves']),
    spk(2, 'Hug yourself warm! Say:', 'Thick fur keeps warm! 🐻', '🐻', '🧥 Hug your arms tight!', ['thick', 'fur', 'winter']),
    spk(2, 'Point to sharp pine needles! Say:', 'Pine trees have cones! 🌲', '🌲', '🌲 Make a tree peak with hands!', ['pine', 'cones', 'needles']),
    spk(2, 'Pretend to check a puppy! Say:', 'A vet helps animals! 🩺', '🩺', '🐶 Pet a hurt animal gently!', ['vet', 'helps', 'animals']),
    spk(2, 'Flap wings and fly free! Say:', 'Fly back to the forest! 🦉', '🦉', '🦅 Spread wings wide!', ['grew', 'flew', 'forest']),

    /* Unit 3 — It Keeps Changing! (The Bear and I & Clean Cars) */
    spk(3, 'Walk on thin ice carefully! Say:', 'The ice is thin! 🧊', '🧊', '🐾 Step very carefully!', ['thin', 'ice', 'melting']),
    spk(3, 'Roar like a big polar bear! Say:', 'He is twice as big! 🐻‍❄️', '🐻‍❄️', '🙌 Hold arms up huge!', ['polar bear', 'twice', 'big']),
    spk(3, 'Swim with strong paws! Say:', 'Polar bears can swim! 🌊', '🌊', '🏊 Swim with both arms!', ['swim', 'cold', 'sea']),
    spk(3, 'Cough and wave smoke away! Say:', 'Old cars make smoke! 💨', '💨', '😷 Wave smoky air away!', ['noisy', 'dirty', 'smoke']),
    spk(3, 'Drive a quiet electric car! Say:', 'Electric cars are clean! 🔋', '🔋', '🚗 Steer a quiet wheel!', ['electric', 'clean', 'energy']),
    spk(3, 'Pedal a bicycle! Say:', 'I ride my bike! 🚲', '🚲', '🚴 Spin your hands like pedals!', ['ride', 'bike', 'clean']),

    /* Unit 4 — We Can Do It! (Late for the Show & LA Sparks Teamwork) */
    spk(4, 'Honk a car horn! Beep! Say:', 'We are in traffic! 🚗', '🚗', '📯 Press the horn: Beep beep!', ['stuck', 'traffic', 'late']),
    spk(4, 'Take a deep breath! Say:', 'Stay calm, don’t worry! 😌', '😌', '😮‍💨 Breathe in and smile!', ['calm', 'platform', 'wait']),
    spk(4, 'Snap your fingers! Say:', 'I have a good idea! 💡', '💡', '☝️ Hold up 1 finger: Idea!', ['Lynn', 'idea', 'solution']),
    spk(4, 'Take a big actor bow! Say:', 'Let’s perform the show! 🎭', '🎭', '🙇 Take a theatre bow!', ['perform', 'show', 'platform']),
    spk(4, 'Shoot a 3-point basket! Say:', 'Three points! Swish! 🏀', '🏀', '🏀 Jump and shoot a basket!', ['three points', 'basket', 'win']),
    spk(4, 'High-five your teammate! Say:', 'Great teamwork, everyone! 🤝', '🤝', '🙌 High-five your friend!', ['teamwork', 'proud', 'together'])
  ];

  GM.sets = GM.sets || [];

  var UNIT_TITLES = {
    3: {
      1: 'G3 U1 · Easy Speaking (Inventions & Bridges)',
      2: 'G3 U2 · Easy Speaking (Thank You & Moon Song)',
      3: 'G3 U3 · Easy Speaking (How Much Is It? · Money)',
      4: 'G3 U4 · Easy Speaking (Mona Lisa & Volcano)'
    },
    4: {
      1: 'G4 U1 · Easy Speaking (Reading & Butterflies)',
      2: 'G4 U2 · Easy Speaking (Animals & Forest)',
      3: 'G4 U3 · Easy Speaking (Arctic & Clean Cars)',
      4: 'G4 U4 · Easy Speaking (Late for the Show & Teamwork)'
    }
  };

  function pushSet(s) {
    GM.sets = GM.sets.filter(function (x) { return x.id !== s.id; });
    GM.sets.push(s);
  }

  pushSet({
    id: 'speak-g3',
    title: 'Grade 3 · Units 1–4 Easy Speaking & Acting',
    sub: 'All 4 Units · 24 Action & Speaking Cards',
    grade: 3,
    unit: 0,
    skill: 'speaking',
    e: '🎤',
    items: G3
  });

  pushSet({
    id: 'speak-g4',
    title: 'Grade 4 · Units 1–4 Easy Speaking & Acting',
    sub: 'All 4 Units · 24 Action & Speaking Cards',
    grade: 4,
    unit: 0,
    skill: 'speaking',
    e: '🎤',
    items: G4
  });

  [1, 2, 3, 4].forEach(function (u) {
    pushSet({
      id: 'speak-g3-u' + u,
      title: UNIT_TITLES[3][u],
      sub: 'Unit ' + u + ' Action & Speaking Cards',
      grade: 3,
      unit: u,
      skill: 'speaking',
      skillOnly: true,
      e: '🎤',
      items: G3.filter(function (it) { return it.unit === u; })
    });
    pushSet({
      id: 'speak-g4-u' + u,
      title: UNIT_TITLES[4][u],
      sub: 'Unit ' + u + ' Action & Speaking Cards',
      grade: 4,
      unit: u,
      skill: 'speaking',
      skillOnly: true,
      e: '🎤',
      items: G4.filter(function (it) { return it.unit === u; })
    });
  });
})(typeof window !== 'undefined' ? window : this);
