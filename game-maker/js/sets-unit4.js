/* Game Maker: Unit 4 question sets (Grade 3 What Happened? and Grade 4 We Can Do It). Own wording; no book text is copied.
   Built from the Mona Lisa / Late for the Show sets plus new questions for The Angry Mountain, cause and effect and teamwork. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  function rows(list) { return list.map(function (r) { return { q: r[0], a: r[1], w: r.slice(2, 4), pic: r[4] || '' }; }); }
  function itemsOf(id) { var s = (GM.sets || []).filter(function (x) { return x.id === id; })[0]; return s ? s.items.slice() : []; }

  var MOUNTAIN = [
    ['What is the name of the mountain in the story?', 'Mount Tambora', 'Mount Mona', 'Mount Louvre', '🌋'],
    ['The loud noises sounded like ____.', 'thunder', 'music', 'rain', '⛈️'],
    ['What fell down from the sky?', 'ash and stones', 'snow', 'toys', '🌫️'],
    ['The girl climbed a tree because she wanted to ____ more.', 'see', 'sleep', 'sing', '🌳'],
    ['How did the family leave the island?', 'by boat', 'by train', 'by bus', '⛵'],
    ['At ____ the girl looked back at the island.', 'sunrise', 'sunset', 'lunch', '🌅'],
    ['The dogs ____ and the people shouted.', 'barked', 'danced', 'sang', '🐕'],
    ['The girl had scary ____ in the boat.', 'dreams', 'games', 'books', '😴'],
    ['After the explosion, nothing was left of the home except ____.', 'ash and stones', 'flowers', 'toys'],
    ['At last a ____ saw them and they were safe.', 'ship', 'plane', 'bike', '🚢'],
    ['Cause: the mountain made loud noises. Effect: the family ____.', 'ran to the boat', 'went to school', 'ate lunch'],
    ['Cause: ash fell from the sky. Effect: it was ____.', 'dark', 'sunny', 'cold ice'],
    ['A cause is ____ something happens.', 'why', 'where', 'when', '❓'],
    ['An effect is ____ happens.', 'what', 'who', 'where', '➡️'],
    ['Listen and say: “stand”, “hand”, “end”. They end with the sound ____.', '-nd', '-st', '-mp', '🔤'],
    ['Which word ends with -nd?', 'hand', 'hat', 'hot', '✋'],
    ['Which word ends with -nd?', 'wind', 'win', 'wing', '💨'],
    ['Peruggia stole the Mona Lisa. The police ____ him.', 'arrested', 'painted', 'invited'],
    ['People ____ up to see the empty space on the wall.', 'lined', 'line', 'lining', '🧍'],
    ['The Mona Lisa went ____ to the Louvre.', 'home', 'under', 'quick', '🏛️']
  ];
  var TEAM = [
    ['How many teams are in the league?', 'twelve', 'five', 'two', '🏆'],
    ['How many players from each team are on the court?', 'five', 'ten', 'two', '🏟️'],
    ['A basket from far away is worth ____.', 'three points', 'two points', 'five points', '🎯'],
    ['Who scored the three-pointer?', 'Chelsea Gray', 'Harry', 'Mr. Williams', '🙌'],
    ['The Sparks were losing by ____.', 'five points', 'one point', 'twenty points', '😬'],
    ['What did the Sparks win?', 'the championship', 'a ball', 'a bus', '🏆'],
    ['Teamwork makes the dream ____.', 'work', 'walk', 'talk', '🤝'],
    ['Cause: the Sparks were losing. Effect: they ____.', 'worked harder', 'went home', 'stopped playing', '🏀'],
    ['Cause: Harry’s car was stuck in traffic. Effect: Harry was ____.', 'late', 'early', 'tall', '🚗'],
    ['Harry was late ____ the train stopped.', 'because', 'but', 'or', '🚇'],
    ['Everybody waited on the ____ for the train.', 'platform', 'stage', 'ship', '🚉'],
    ['Lynn had an idea: “Why don’t we ____ the show here?”', 'perform', 'cancel', 'forget', '💡']
  ];
  GM.sets = GM.sets || [];
  GM.sets.push({ id: 'u4-g3', title: 'Unit 4 · Grade 3 (What Happened?)', grade: 3, e: '🖼️', items: itemsOf('mona-g3').concat(rows(MOUNTAIN)) });
  GM.sets.push({ id: 'u4-g4', title: 'Unit 4 · Grade 4 (We Can Do It)', grade: 4, e: '🏀', items: itemsOf('show-g4').concat(rows(TEAM)) });
})(window);
