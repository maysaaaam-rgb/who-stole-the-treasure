/* Game Maker — Unit 5 Question Sets (Grades 3 & 4)
   Global Readings 2 (Grade 3) Unit 5: Let's Go Back (pp. 72-87)
     - Reading 1: The Time Book (Jannah in Ancient Egypt, -nt blend)
     - Reading 2: Time Capsules (1795 Boston box & Voyager Golden Record)
     - Grammar: Past Simple (was/were, regular -ed, irregular verbs, didn't + verb)
   Global Readings 3 (Grade 4) Unit 5: Make Some Noise (pp. 72-87)
     - Reading 1: Shh! They're Making a Movie! (The Art of Sound / Foley artists, ou spelling)
     - Reading 2: He Writes It All Down (Beethoven's Ninth Symphony, similes)
     - Grammar: have to / has to, When clauses, Similes with like */
(function () {
  'use strict';
  var GM = window.GM = window.GM || {};
  GM.sets = GM.sets || [];

  function q(text, a, b, c, ico) {
    return { q: text, a: a, opts: [a, b, c], ico: ico || '❓' };
  }

  /* =====================================================================
     GRADE 3 — UNIT 5: LET'S GO BACK (Global Readings 2, pp. 72-87)
     ===================================================================== */
  var g3Vocab = [
    q('A ____ is a king of ancient Egypt.', 'pharaoh', 'farmer', 'pilot', '👑'),
    q('The pharaoh rode in a big ____ with two wheels.', 'chariot', 'chair', 'camera', '🛞'),
    q('Jannah put her red ____ in front of her eyes to see.', 'glasses', 'gloves', 'games', '👓'),
    q('Egypt is a very old and ____ place.', 'ancient', 'angry', 'animal', '🏺'),
    q('Jannah wore modern pajamas, so her clothes looked ____.', 'strange', 'strong', 'small', '🤔'),
    q('The old woman was ____ when she could see everything!', 'surprised', 'sleepy', 'slow', '😮'),
    q('Jannah was ____ when the guards shouted at her.', 'scared', 'sunny', 'short', '😨'),
    q('People make a ____ to save things for the future.', 'time capsule', 'time clock', 'toy car', '📦'),
    q('Tomorrow and next year are in the ____.', 'future', 'forest', 'family', '🚀'),
    q('People put small ____ like coins and toys inside the box.', 'objects', 'oranges', 'oceans', '🧸'),
    q('People read ____ to learn the news every day.', 'newspapers', 'notebooks', 'necklaces', '📰'),
    q('Voyager 1 and Voyager 2 are two ____ in space.', 'spacecraft', 'schoolbags', 'snowballs', '🛸'),
    q('Each spacecraft carries a shiny gold ____.', 'disc', 'desk', 'duck', '💿'),
    q('We all live on planet ____.', 'Earth', 'East', 'Eight', '🌍'),
    q('In the picture on page 72, I see a huge ____ in the grass!', 'dinosaur', 'dolphin', 'doctor', '🦕')
  ];

  var g3TimeBook = [
    q('Jannah lives in ____ and loves to read.', 'Cairo', 'Canada', 'China', '📖'),
    q('It was time for Jannah to go to ____.', 'bed', 'bus', 'beach', '🛏️'),
    q('On the book, there was a picture of an old ____.', 'street', 'school', 'ship', '🏘️'),
    q('“Look!” said an old ____ next to her.', 'woman', 'window', 'winter', '👵'),
    q('“Oh, thank you,” said the woman. “I can’t ____ very well.”', 'see', 'sing', 'swim', '👀'),
    q('“Try my glasses,” said Jannah. “Put them in front of your ____.”', 'eyes', 'ears', 'eggs', '👓'),
    q('The ancient Egyptians made glass, but they didn’t have ____ yet.', 'eyeglasses', 'elephants', 'envelopes', '🏺'),
    q('“Who’s that girl?” asked the pharaoh. “Stop ____!”', 'her', 'him', 'here', '🛑'),
    q('Jannah ran through the ancient city. The streets were hot and ____.', 'dark', 'deep', 'dry', '🏃‍♀️'),
    q('Suddenly, there was a hand on her ____.', 'shoulder', 'shoes', 'shirt', '✋'),
    q('“Wake up, Jannah,” said her ____.', 'mom', 'moon', 'mouse', '👩')
  ];

  var g3TimeCapsules = [
    q('Making a time capsule is like giving a ____ from the past.', 'present', 'picture', 'pencil', '🎁'),
    q('They put time capsules in the ground so people can ____ and find them.', 'dig', 'draw', 'drink', '⛏️'),
    q('The time capsule from 1795 had ____ and newspapers in it.', 'coins', 'cakes', 'cats', '🪙'),
    q('The gold disc on Voyager says ____ in 55 different languages.', 'hello', 'happy', 'house', '👋'),
    q('Yesterday, Jannah ____ the special book.', 'opened', 'opens', 'opening', '📘'),
    q('Then Jannah ____ the huge chariot in the street.', 'saw', 'see', 'sees', '🛞'),
    q('Voyager 1 and Voyager 2 ____ into space in 1977.', 'went', 'go', 'goes', '🚀'),
    q('People ____ find the 1795 time capsule until 2014.', 'didn’t', 'don’t', 'doesn’t', '🕰️'),
    q('Jannah ____ in a very old city in Egypt.', 'was', 'were', 'are', '🏜️'),
    q('Phonics -nt: You use your finger to ____ at a picture.', 'point', 'paint', 'park', '👉'),
    q('Phonics -nt: A green ____ grows in the garden.', 'plant', 'plate', 'plane', '🌱'),
    q('Phonics -nt: Put the glasses in ____ of your eyes.', 'front', 'fruit', 'frog', '👓'),
    q('Phonics -nt: Clever people ____ new machines.', 'invent', 'invite', 'inside', '💡'),
    q('Phonics -nt: Every ____ in our class loves reading books.', 'student', 'station', 'sister', '🎒')
  ];

  /* =====================================================================
     GRADE 4 — UNIT 5: MAKE SOME NOISE (Global Readings 3, pp. 72-87)
     ===================================================================== */
  var g4Vocab = [
    q('A ____ wears metal armor and fights in a castle.', 'knight', 'kitten', 'kitchen', '🛡️'),
    q('The two knights fight with long ____.', 'swords', 'spoons', 'shoes', '⚔️'),
    q('Movie sounds must be ____ so they sound like real life.', 'realistic', 'reading', 'running', '🎬'),
    q('A Foley ____ is a person who makes special sounds for movies.', 'artist', 'animal', 'apple', '🎧'),
    q('Foley artists use a microphone to ____ new sounds.', 'record', 'ride', 'read', '🎙️'),
    q('When people film a movie, they often only record the actors’ ____.', 'voices', 'villages', 'vegetables', '🗣️'),
    q('Foley artists work inside a special sound ____.', 'studio', 'stadium', 'station', '🎚️'),
    q('Beethoven was a famous ____ who wrote music.', 'composer', 'computer', 'customer', '🎼'),
    q('Beethoven lifts his arms high like an ____ that flies.', 'eagle', 'engine', 'elephant', '🦅'),
    q('First he stands tall, then he ____ down low.', 'bends', 'bakes', 'builds', '🙇'),
    q('Beethoven bends down on his ____ while conducting.', 'knees', 'keys', 'kites', '🦵'),
    q('Beethoven is ____, so he cannot hear the crowd.', 'deaf', 'deep', 'dark', '👂'),
    q('The ____ plays violins, drums, and flutes on stage.', 'orchestra', 'orange', 'octopus', '🎻'),
    q('The ____ claps, cheers, and throws flowers at the end.', 'audience', 'afternoon', 'airplane', '👏'),
    q('Moving a thin piece of metal makes the sound of ____ in a storm.', 'thunder', 'thirsty', 'Thursday', '⛈️')
  ];

  var g4Foley = [
    q('Their heavy boots ____ on the castle floor.', 'thud', 'think', 'throw', '🥾'),
    q('In the movie, the swords are made of ____.', 'plastic', 'paper', 'potato', '⚔️'),
    q('The name “Foley artist” comes from ____ Foley.', 'Jack', 'John', 'Jim', '🎬'),
    q('When the actor walks on a wooden floor, the artist makes the sound of ____.', 'footsteps', 'football', 'feathers', '👣'),
    q('An old chair can make a loud ____.', 'squeak', 'smile', 'splash', '🪑'),
    q('Two pieces of ____ banged together sound like a horse walking.', 'coconut', 'carrot', 'cookie', '🥥'),
    q('Shaking metal ____ can make the sound of a knight marching.', 'keys', 'kites', 'kings', '🔑'),
    q('A head of ____ can make a soft crunch sound.', 'lettuce', 'lemon', 'ladder', '🥬'),
    q('A big ____ closing quickly can sound like a punch!', 'book', 'boat', 'bird', '📕'),
    q('Foley artists ____ to make everything sound realistic.', 'have', 'has', 'having', '🎧'),
    q('____ the actor breaks a window, the artist records glass breaking.', 'When', 'Where', 'Who', '🪟')
  ];

  var g4Beethoven = [
    q('Singers ____—women in dresses, men in suits.', 'hum', 'hop', 'hide', '🎵'),
    q('Beethoven’s new music took him ____ years to write.', 'ten', 'two', 'twenty', '🎹'),
    q('He stands proudly onstage, in his red ____ and coat.', 'scarf', 'shirt', 'shoes', '🧣'),
    q('Trumpets play loudly. ____ boom, voices cry.', 'Drums', 'Doors', 'Ducks', '🥁'),
    q('The crowd gets to their feet. They clap and throw ____.', 'flowers', 'feathers', 'fishes', '🌹'),
    q('A kind ____ turns Beethoven around to look at the cheers.', 'singer', 'soldier', 'sailor', '🎤'),
    q('The crowd shouts Beethoven’s name, ____ he cannot hear them.', 'but', 'because', 'or', '🔇'),
    q('Beethoven bends down like a small ____ sailing on stormy seas.', 'boat', 'bike', 'bus', '⛵'),
    q('Spelling ou: Their swords crash together with a ____ smash.', 'loud', 'load', 'land', '💥'),
    q('Spelling ou: What different types of ____ are in our world?', 'sounds', 'sands', 'sends', '🔊'),
    q('Spelling ou: Please do not ____ the hot stove.', 'touch', 'teach', 'tooth', '✋'),
    q('Spelling ou: Can you ____ from one to ten in English?', 'count', 'catch', 'clean', '🔢'),
    q('Spelling ou: The people like his music, so Beethoven feels ____.', 'proud', 'pond', 'plant', '😊'),
    q('Spelling ou: The audience stands up and ____ Beethoven’s name!', 'shouts', 'shirts', 'shorts', '📣')
  ];

  var u5Sets = [
    {
      id: 'g3-u5-vocab',
      title: "G3 Unit 5 • Let's Go Back: Words",
      grade: 3, unit: 5, icon: '🏺', tag: 'Unit 5 • Words',
      desc: 'Ancient Egypt & Time Capsule words: pharaoh, chariot, glasses, ancient, spacecraft, Earth.',
      questions: g3Vocab
    },
    {
      id: 'g3-u5-timebook',
      title: 'G3 Unit 5 • Reading 1: The Time Book',
      grade: 3, unit: 5, icon: '📘', tag: 'Unit 5 • Reading 1',
      desc: 'Jannah travels back to Ancient Egypt with her special book and helps an old woman see.',
      questions: g3TimeBook
    },
    {
      id: 'g3-u5-capsules',
      title: 'G3 Unit 5 • Time Capsules & Phonics (-nt)',
      grade: 3, unit: 5, icon: '🛸', tag: 'Unit 5 • Reading 2 & -nt',
      desc: 'Time capsules (1795 Boston & Voyager space disc), Past Simple verbs, and -nt words.',
      questions: g3TimeCapsules
    },
    {
      id: 'g3-u5-mega',
      title: "G3 Unit 5 • Let's Go Back (All 40 Qs)",
      grade: 3, unit: 5, icon: '👑', tag: 'Unit 5 • Complete',
      desc: 'All 40 Grade 3 Unit 5 questions from Global Readings 2 (pp. 72–87).',
      questions: g3Vocab.concat(g3TimeBook, g3TimeCapsules)
    },
    {
      id: 'g4-u5-vocab',
      title: 'G4 Unit 5 • Make Some Noise: Words',
      grade: 4, unit: 5, icon: '🎧', tag: 'Unit 5 • Words',
      desc: 'Sound & music words: studio, artist, record, realistic, knight, swords, composer, orchestra, audience.',
      questions: g4Vocab
    },
    {
      id: 'g4-u5-foley',
      title: 'G4 Unit 5 • Reading 1: The Art of Sound (Foley)',
      grade: 4, unit: 5, icon: '🎬', tag: 'Unit 5 • Reading 1',
      desc: 'How Foley artists make movie sounds using coconut shells, keys, lettuce, and books!',
      questions: g4Foley
    },
    {
      id: 'g4-u5-beethoven',
      title: "G4 Unit 5 • Beethoven's 9th & Spelling (ou)",
      grade: 4, unit: 5, icon: '🎼', tag: 'Unit 5 • Reading 2 & ou',
      desc: 'Beethoven conducting his Ninth Symphony while deaf, similes, and ou words (loud, sound, proud, shout).',
      questions: g4Beethoven
    },
    {
      id: 'g4-u5-mega',
      title: 'G4 Unit 5 • Make Some Noise (All 40 Qs)',
      grade: 4, unit: 5, icon: '🥁', tag: 'Unit 5 • Complete',
      desc: 'All 40 Grade 4 Unit 5 questions from Global Readings 3 (pp. 72–87).',
      questions: g4Vocab.concat(g4Foley, g4Beethoven)
    }
  ];

  u5Sets.forEach(function (s) {
    var idx = GM.sets.findIndex(function (x) { return x.id === s.id; });
    if (idx >= 0) GM.sets[idx] = s;
    else GM.sets.push(s);
  });
})();
