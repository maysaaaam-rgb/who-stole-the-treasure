/* Game Maker: Unit 4 question sets (Grade 3 "What Happened?" & Grade 4 "We Can Do It!").
   Includes Where Is She? (Mona Lisa), The Angry Mountain (Mount Tambora), Late for the Show (Twelfth Night),
   and Teamwork (LA Sparks), plus per-skill sets (Listening, Words, Sounds, Sentences, Reading). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  function rows(list, skill) {
    return list.map(function (r) {
      var it = {
        q: r[0],
        a: r[1],
        w: r.slice(2, 4).filter(Boolean),
        pic: r[4] || '',
        unit: 4,
        skill: r[5] || skill || 'Reading'
      };
      if (r[6]) it.speak = r[6];
      return it;
    });
  }
  function itemsOf(id) {
    var s = (GM.sets || []).filter(function (x) { return x.id === id; })[0];
    return s ? s.items.slice() : [];
  }

  /* Grade 3 Unit 4 additional items (Listening, Words, Sounds, Sentences, Reading) */
  var G3_EXTRA = [
    /* Listening */
    ['Listen. 🔊 “Peruggia hid the painting under his coat.”', '🖼️', '🌋', '⛵', '🔊', 'Listening', 'Peruggia hid the painting under his coat.'],
    ['Listen. 🔊 “Hot ash and stones fell from the volcano.”', '🌋', '🏛️', '🎭', '🔊', 'Listening', 'Hot ash and stones fell from the volcano.'],
    ['Listen. 🔊 “The family escaped in a small boat.”', '⛵', '🚓', '🚂', '🔊', 'Listening', 'The family escaped in a small boat.'],
    ['Listen. 🔊 “At sunrise, a big ship rescued them!”', '🚢', '🐕', '🌴', '🔊', 'Listening', 'At sunrise, a big ship rescued them!'],
    ['Listen. 🔊 “The police arrested the thief.”', '👮', '🎨', '🌅', '🔊', 'Listening', 'The police arrested the thief.'],
    /* Words & Reading & Sounds & Sentences */
    ['What is the name of the mountain in the story?', 'Mount Tambora', 'Mount Mona', 'Mount Louvre', '🌋', 'Reading'],
    ['The loud noises from the mountain sounded like ____.', 'thunder', 'music', 'rain', '⛈️', 'Words'],
    ['What fell down from the dark sky?', 'ash and stones', 'snow and ice', 'toys and books', '🌫️', 'Reading'],
    ['The girl climbed a palm tree because she wanted to ____ more.', 'see', 'sleep', 'sing', '🌴', 'Reading'],
    ['How did the family leave the island?', 'by boat', 'by train', 'by bus', '⛵', 'Reading'],
    ['At ____ the girl looked back at the island.', 'sunrise', 'sunset', 'lunchtime', '🌅', 'Words'],
    ['The dogs ____ loudly and the people shouted.', 'barked', 'danced', 'painted', '🐕', 'Sentences'],
    ['The girl had scary ____ while sleeping in the boat.', 'dreams', 'games', 'statues', '💭', 'Words'],
    ['At last a big ____ saw them and they were safe.', 'ship', 'plane', 'bicycle', '🚢', 'Reading'],
    ['Cause: The mountain made loud noises. Effect: The family ____.', 'ran to the boat', 'went to school', 'ate lunch', '⛵', 'Reading'],
    ['Cause: Ash fell from the sky. Effect: The sky turned ____.', 'dark', 'sunny', 'green', '🌋', 'Reading'],
    ['A CAUSE tells ____ something happens.', 'why', 'where', 'who', '❓', 'Reading'],
    ['An EFFECT tells ____ happens next.', 'what', 'who', 'when', '➡️', 'Reading'],
    ['Listen and say: “stand”, “hand”, “sand”. They all end with ____.', '-nd', '-st', '-mp', '🔤', 'Sounds'],
    ['Which word ends with the -nd blend?', 'hand', 'hat', 'hot', '✋', 'Sounds'],
    ['Which word ends with the -nd blend?', 'wind', 'win', 'wing', '💨', 'Sounds'],
    ['Which word ends with the -nd blend?', 'sand', 'sat', 'sad', '🏖️', 'Sounds'],
    ['Which word ends with the -nd blend?', 'island', 'igloo', 'inside', '🏝️', 'Sounds'],
    ['Which word ends with the -nd blend?', 'pond', 'pot', 'pop', '🐸', 'Sounds'],
    ['Peruggia stole the Mona Lisa. Later, the police ____ him.', 'arrested', 'painted', 'invited', '👮', 'Sentences'],
    ['People ____ up to see the empty space on the museum wall.', 'lined', 'line', 'lining', '🧍', 'Sentences'],
    ['The Mona Lisa went ____ to the Louvre Museum.', 'home', 'under', 'quickly', '🏛️', 'Reading']
  ];

  /* Grade 4 Unit 4 additional items (Listening, Words, Sounds, Sentences, Reading) */
  var G4_EXTRA = [
    /* Listening */
    ['Listen. 🔊 “Harry’s car was stuck in heavy traffic.”', '🚗', '🚢', '🏀', '🔊', 'Listening', 'Harry’s car was stuck in heavy traffic.'],
    ['Listen. 🔊 “The friends waited on the train platform.”', '🚉', '🏝️', '🏛️', '🔊', 'Listening', 'The friends waited on the train platform.'],
    ['Listen. 🔊 “We performed our play and everyone clapped!”', '🎭', '🌋', '🛒', '🔊', 'Listening', 'We performed our play and everyone clapped!'],
    ['Listen. 🔊 “Chelsea Gray scored a three-point basket!”', '🏀', '⚽', '🎾', '🔊', 'Listening', 'Chelsea Gray scored a three-point basket!'],
    ['Listen. 🔊 “Great teamwork! You won the championship!”', '🏆', '⏰', '🌧️', '🔊', 'Listening', 'Great teamwork! You won the championship!'],
    /* Words, Sounds, Sentences, Reading */
    ['How many basketball teams are in the WNBA league?', 'twelve', 'five', 'two', '🏀', 'Reading'],
    ['How many players from one team are on the court at a time?', 'five', 'ten', 'two', '🏟️', 'Reading'],
    ['A basket shot from far away is worth ____.', 'three points', 'one point', 'ten points', '🎯', 'Reading'],
    ['Who scored the winning basket for the Sparks?', 'Chelsea Gray', 'Harry', 'Mr. Williams', '🙌', 'Reading'],
    ['What did the LA Sparks win through teamwork?', 'the championship', 'a school play', 'a train ticket', '🏆', 'Words'],
    ['Teamwork makes the dream ____!', 'work', 'walk', 'wait', '🤝', 'Words'],
    ['Which word means “working together as a group”?', 'teamwork', 'traffic', 'platform', '🤝', 'Words'],
    ['Which word means “feeling worried or a little scared before a show”?', 'nervous', 'calm', 'proud', '😬', 'Words'],
    ['Which word means “happy about something good you or your friends did”?', 'proud', 'late', 'stuck', '🌟', 'Words'],
    ['Cause: The Sparks were losing. Effect: They ____.', 'worked harder together', 'went home early', 'stopped playing', '🏀', 'Reading'],
    ['Cause: Harry’s car was stuck in traffic. Effect: Harry was ____.', 'late', 'early', 'sleepy', '🚗', 'Reading'],
    ['Harry was late ____ the train had a problem.', 'because', 'but', 'or', '🚇', 'Sentences'],
    ['The train stopped, ____ the children performed on the platform.', 'so', 'because', 'if', '🎭', 'Sentences'],
    ['First, we practiced our lines. ____, we performed the show!', 'Then', 'Because', 'Yesterday', '🎬', 'Sentences'],
    ['Everybody waited on the ____ for the train.', 'platform', 'court', 'ship', '🚉', 'Words'],
    ['Lynn had a smart idea: “Why don’t we ____ the show here?”', 'perform', 'cancel', 'forget', '💡', 'Sentences'],
    ['Which word has the long “o” sound like “show”?', 'slow', 'shop', 'shot', '🔤', 'Sounds'],
    ['Which word has the “ar” sound like “car” and “start”?', 'park', 'pack', 'pick', '🔤', 'Sounds'],
    ['Which word has the “or” sound like “perform” and “storm”?', 'sport', 'spot', 'spit', '🔤', 'Sounds'],
    ['Which word starts with the “tr-” blend like “train” and “traffic”?', 'tree', 'tea', 'tie', '🌳', 'Sounds'],
    ['Which word starts with the “pl-” blend like “platform” and “play”?', 'plenty', 'penny', 'party', '🔤', 'Sounds']
  ];

  GM.sets = GM.sets || [];

  var g3All = itemsOf('mona-g3').concat(itemsOf('angry-g3'), rows(G3_EXTRA));
  var g4All = itemsOf('show-g4').concat(rows(G4_EXTRA));

  /* Deduplicate by question text */
  function dedup(list) {
    var seen = {}, out = [];
    list.forEach(function (it) {
      var k = String(it.q || '').toLowerCase();
      if (!k || seen[k]) return;
      seen[k] = 1;
      out.push(it);
    });
    return out;
  }
  g3All = dedup(g3All);
  g4All = dedup(g4All);

  GM.sets.push({
    id: 'u4-g3',
    title: 'Unit 4 · Grade 3 (What Happened? · Full Unit)',
    sub: 'Mona Lisa + Angry Mountain · All Skills',
    grade: 3,
    unit: 4,
    skill: '',
    e: '🖼️',
    items: g3All
  });
  GM.sets.push({
    id: 'u4-g4',
    title: 'Unit 4 · Grade 4 (We Can Do It! · Full Unit)',
    sub: 'Late for the Show + Teamwork · All Skills',
    grade: 4,
    unit: 4,
    skill: '',
    e: '🏀',
    items: g4All
  });

  /* Also build Unit 4 per-skill sets so filtering Grade + Unit 4 + Skill works seamlessly */
  var SKILL_DEFS = [
    { key: 'Listening', slug: 'listen', e: '🎧' },
    { key: 'Words',     slug: 'words',  e: '📝' },
    { key: 'Sounds',    slug: 'sounds', e: '🔤' },
    { key: 'Sentences', slug: 'sentences', e: '💬' },
    { key: 'Reading',   slug: 'reading', e: '📖' }
  ];

  [
    { grade: 3, all: g3All },
    { grade: 4, all: g4All }
  ].forEach(function (gObj) {
    SKILL_DEFS.forEach(function (sd) {
      var match = gObj.all.filter(function (it) { return it.skill === sd.key; });
      if (match.length >= 3) {
        GM.sets.push({
          id: 'u4-g' + gObj.grade + '-' + sd.slug,
          title: 'G' + gObj.grade + ' U4 · ' + sd.key,
          sub: 'Unit 4 ' + sd.key + ' Practice',
          grade: gObj.grade,
          unit: 4,
          skill: sd.slug,
          skillOnly: true,
          e: sd.e,
          items: match
        });
      }
    });
  });
})(window);
