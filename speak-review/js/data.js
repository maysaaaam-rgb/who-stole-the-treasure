/* speak-review/data.js
 * Words, clue words, sentence frames and Spot-the-difference answer spots
 * for the 5-unit speaking review (Grade 3 = Global Readings 2, Grade 4 = Global Readings 3).
 * Spot rectangles are [x0, y0, x1, y1] in the 1536x1024 picture; an optional 5th value 'a' or 'b'
 * means the thing is only there in that picture (it moved).
 */
(function (root) {
  'use strict';

  function P(id, word, clues) { return { id: id, word: word, clues: clues }; }

  var UNITS = {
    3: {
      1: { title: 'What Does It Do?', pics: [
        P('machine', 'a machine', ['gears', 'colourful', 'it moves']),
        P('bridge', 'a floating bridge', ['water', 'wood', 'you walk on it']),
        P('wood', 'wood', ['brown', 'trees', 'heavy']),
        P('messy-room', 'a messy room', ['toys', 'bed', 'not tidy']),
        P('toolbox', 'a toolbox', ['red', 'hammer', 'fix things']),
        P('inventor', 'an inventor', ['girl', 'idea', 'makes things'])
      ]},
      2: { title: 'Harvest & Thank You', pics: [
        P('full-moon', 'the full moon', ['round', 'night', 'yellow']),
        P('rice-cakes', 'rice cakes', ['half moon', 'soft', 'you eat them']),
        P('fruit-basket', 'a fruit basket', ['apples', 'grapes', 'harvest']),
        P('farmer', 'a farmer', ['hat', 'farm', 'vegetables']),
        P('thank-you-card', 'a thank-you card', ['heart', 'paper', 'you write on it']),
        P('family-dinner', 'a family dinner', ['table', 'grandma', 'food'])
      ]},
      3: { title: 'How Much Is It?', pics: [
        P('coins', 'coins', ['gold', 'round', 'money']),
        P('piggy-bank', 'a piggy bank', ['pink', 'pig', 'save money']),
        P('price-tag', 'a price tag', ['number', 'shop', 'how much']),
        P('cashier', 'a cashier', ['shop', 'till', 'you pay']),
        P('wallet', 'a wallet', ['brown', 'pocket', 'money in it']),
        P('shells', 'shells', ['beach', 'old money', 'colourful'])
      ]},
      4: { title: 'Where Is She? · The Angry Mountain', pics: [
        P('painting', 'a painting', ['gold frame', 'woman', 'museum']),
        P('museum', 'a museum', ['pictures', 'big room', 'visitors']),
        P('detective', 'a detective', ['hat', 'magnifying glass', 'looks for clues']),
        P('volcano', 'a volcano', ['mountain', 'hot', 'smoke']),
        P('thunder', 'thunder', ['cloud', 'loud', 'lightning']),
        P('sunrise', 'a sunrise', ['morning', 'sun', 'orange'])
      ]},
      5: { title: "Let's Go Back", pics: [
        P('pharaoh', 'a pharaoh', ['Egypt', 'king', 'gold']),
        P('chariot', 'a chariot', ['wheels', 'horses', 'old']),
        P('pyramid', 'a pyramid', ['Egypt', 'big', 'triangle']),
        P('time-capsule', 'a time capsule', ['box', 'old things', 'future']),
        P('spacecraft', 'a spacecraft', ['space', 'flies', 'metal']),
        P('old-newspaper', 'an old newspaper', ['paper', 'news', 'old'])
      ]}
    },
    4: {
      1: { title: 'Reading & Butterflies', pics: [
        P('book', 'a book', ['pages', 'read', 'stories']),
        P('butterfly', 'a butterfly', ['wings', 'flies', 'orange']),
        P('caterpillar', 'a caterpillar', ['green', 'leaf', 'turns into a butterfly']),
        P('library', 'a library', ['books', 'quiet', 'shelves']),
        P('journey', 'a journey', ['map', 'road', 'travel']),
        P('sleepy-child', 'a sleepy child', ['bed', 'yawn', 'tired'])
      ]},
      2: { title: 'Animal Survivors', pics: [
        P('owl', 'an owl', ['night', 'big eyes', 'branch']),
        P('fox', 'a fox', ['orange', 'tail', 'forest']),
        P('snake', 'a snake', ['long', 'no legs', 'rock']),
        P('forest', 'a forest', ['trees', 'green', 'animals live there']),
        P('birds-nest', "a bird's nest", ['eggs', 'tree', 'sticks']),
        P('stick-insect', 'a stick insect', ['hides', 'branch', 'looks like a stick'])
      ]},
      3: { title: 'It Keeps Changing', pics: [
        P('polar-bear', 'a polar bear', ['white', 'Arctic', 'ice']),
        P('melting-ice', 'melting ice', ['water', 'warm', 'Arctic']),
        P('arctic-fox', 'an Arctic fox', ['white', 'cold', 'fluffy tail']),
        P('electric-car', 'an electric car', ['plug', 'clean', 'no smoke']),
        P('solar-panel', 'a solar panel', ['sun', 'energy', 'blue']),
        P('fish-under-ice', 'fish under the ice', ['water', 'cold', 'swim'])
      ]},
      4: { title: 'Late for the Show', pics: [
        P('train', 'a train', ['platform', 'fast', 'station']),
        P('theatre-stage', 'a stage', ['curtains', 'show', 'audience']),
        P('trophy', 'a trophy', ['gold', 'winner', 'championship']),
        P('team', 'a team', ['four children', 'same shirts', 'teamwork']),
        P('clock', 'a clock', ['time', 'numbers', 'late']),
        P('nervous-child', 'a nervous child', ['worried', 'biting nails', 'feelings'])
      ]},
      5: { title: 'Make Some Noise', pics: [
        P('drum', 'a drum', ['loud', 'sticks', 'bang']),
        P('orchestra', 'an orchestra', ['music', 'violin', 'many players']),
        P('composer', 'a composer', ['piano', 'writes music', 'old']),
        P('microphone', 'a microphone', ['studio', 'voices', 'record']),
        P('coconut-shells', 'coconut shells', ['horse steps', 'Foley', 'clip-clop']),
        P('thunder-sheet', 'a thunder sheet', ['metal', 'shake', 'sounds like thunder'])
      ]}
    }
  };

  var FRAMES = {
    3: ['It is ___ (colour).', 'It is big / small.', 'It has ___.', 'You can see it in ___.', 'It can ___.'],
    4: ['It is made of ___.', 'It lives in / You find it in ___.', 'You use it to ___.', 'It looks like ___.', 'It sounds like ___.']
  };

  function D(name, rects, a, b) { return { name: name, rects: rects, a: a, b: b }; }

  var SPOT = {
    3: {
      1: { title: "Clara's messy room", frame: 'In picture A the ___ is on / under / next to ___. In picture B it is ___.', diffs: [
        D('robot', [[450, 401, 655, 625, 'a'], [530, 720, 750, 840, 'b']], 'In picture A the robot is on the bed.', 'In picture B it is under the bed.'),
        D('ball', [[770, 690, 935, 860]], 'In picture A the ball is red.', 'In picture B it is blue.'),
        D('books', [[250, 190, 480, 350]], 'In picture A there are three books.', 'In picture B there are two books.'),
        D('lamp', [[1140, 440, 1300, 620]], 'In picture A there is a lamp on the desk.', 'In picture B there is no lamp.'),
        D('window', [[870, 160, 1400, 560]], 'In picture A the window is open.', 'In picture B it is closed.')
      ]},
      2: { title: 'Harvest dinner', frame: 'In picture A there is / there are ___. In picture B there ___.', diffs: [
        D('moon', [[1200, 40, 1480, 230]], 'In picture A the moon is in the sky.', 'In picture B the moon is behind a cloud.'),
        D('rice cakes', [[500, 420, 800, 590]], 'In picture A there are four rice cakes.', 'In picture B there are six.'),
        D('fruit', [[850, 370, 1090, 520]], 'In picture A there are apples.', 'In picture B there are pears.'),
        D('scarf', [[100, 370, 350, 600]], "In picture A grandma's scarf is green.", 'In picture B it is purple.'),
        D('cat', [[700, 670, 980, 930]], 'In picture A there is no cat.', 'In picture B there is a cat under the table.')
      ]},
      3: { title: 'Toy shop', frame: 'In picture A the ___ is ___ lira. In picture B it is ___ lira.', diffs: [
        D('apple price', [[200, 290, 340, 500]], 'In picture A the apple is two lira.', 'In picture B it is six lira.'),
        D('hat price', [[570, 220, 720, 430]], 'In picture A the hat is five lira.', 'In picture B it is nine lira.'),
        D('cashier', [[1170, 140, 1510, 640]], 'In picture A the cashier is a girl.', 'In picture B the cashier is a boy.'),
        D('coins', [[490, 610, 810, 790]], 'In picture A there are three coins.', 'In picture B there are five coins.'),
        D('bag', [[50, 610, 380, 1000]], 'In picture A the bag is red.', 'In picture B it is yellow.')
      ]},
      4: { title: 'Museum mystery', frame: 'In picture A the ___ is next to / behind / on ___. In picture B ___.', diffs: [
        D('painting', [[310, 200, 640, 590]], 'In picture A the woman is in the painting.', 'In picture B she is not there!'),
        D('guard', [[1300, 360, 1510, 800, 'a'], [980, 390, 1170, 740, 'b']], 'In picture A the guard is next to the door.', 'In picture B he is behind the statue.'),
        D('hat', [[110, 400, 350, 610]], "In picture A the detective's hat is brown.", 'In picture B it is red.'),
        D('volcano', [[780, 200, 1060, 420]], 'In picture A the volcano has smoke.', 'In picture B it has no smoke.'),
        D('dog', [[800, 540, 990, 760, 'a'], [740, 790, 950, 945, 'b']], 'In picture A the dog is on the bench.', 'In picture B it is under the bench.')
      ]},
      5: { title: 'Ancient Egypt street', frame: 'In picture A the ___ was ___. In picture B it was ___.', diffs: [
        D('pharaoh', [[170, 480, 410, 720]], 'In picture A the pharaoh was happy.', 'In picture B he was sad.'),
        D('camels', [[320, 250, 670, 470]], 'In picture A there were two camels.', 'In picture B there was one camel.'),
        D('chariot', [[500, 390, 860, 630]], 'In picture A the chariot was red.', 'In picture B it was blue.'),
        D('basket', [[930, 690, 1220, 870]], 'In picture A there was bread in the basket.', 'In picture B there was fruit.'),
        D('glasses', [[1290, 460, 1500, 610]], 'In picture A the boy had glasses.', 'In picture B he had no glasses.')
      ]}
    },
    4: {
      1: { title: 'Reading corner', frame: 'In picture A the girl is ___ing. In picture B she is ___ing.', diffs: [
        D('butterflies', [[100, 0, 650, 450]], 'In picture A there are three butterflies.', 'In picture B there are five.'),
        D('girl', [[400, 300, 580, 470]], 'In picture A the girl is reading.', 'In picture B she is sleeping.'),
        D('book', [[440, 470, 670, 650]], 'In picture A the book is blue.', 'In picture B it is orange.'),
        D('yellow butterfly', [[850, 430, 1000, 600, 'a'], [610, 370, 730, 500, 'b']], 'In picture A the yellow butterfly is on the flower.', 'In picture B it is on the book.'),
        D('cat', [[1030, 510, 1270, 690]], 'In picture A the chair is empty.', 'In picture B there is a cat on the chair.')
      ]},
      2: { title: 'Forest survivors', frame: 'In picture A the ___ is on / in / under ___. In picture B it is ___.', diffs: [
        D('owl', [[100, 120, 320, 410, 'a'], [370, 450, 480, 590, 'b']], 'In picture A the owl is on a branch.', 'In picture B it is in a hole in the tree.'),
        D('fox', [[550, 510, 880, 840]], 'In picture A the fox is red.', 'In picture B it is white.'),
        D('snake', [[1040, 490, 1290, 760, 'a'], [910, 800, 1140, 920, 'b']], 'In picture A the snake is on the rock.', 'In picture B it is under the rock.'),
        D('baby birds', [[1260, 130, 1480, 270]], 'In picture A there are two baby birds.', 'In picture B there are three.'),
        D('mushroom', [[130, 700, 420, 930]], 'In picture A there is a mushroom.', 'In picture B there is no mushroom.')
      ]},
      3: { title: 'Arctic and town', frame: 'In picture A the ice is big. In picture B it is ___. It keeps changing!', diffs: [
        D('ice', [[190, 520, 750, 700]], 'In picture A the ice is big.', 'In picture B it is small.'),
        D('cubs', [[270, 450, 630, 610]], 'In picture A the polar bear has one cub.', 'In picture B it has two cubs.'),
        D('fish', [[170, 720, 710, 890]], 'In picture A there are fish under the ice.', 'In picture B there are no fish.'),
        D('car', [[1180, 280, 1470, 720]], 'In picture A the car makes smoke.', 'In picture B it is an electric car.'),
        D('sky', [[230, 70, 1180, 470]], 'In picture A it is cloudy.', 'In picture B it is sunny.')
      ]},
      4: { title: 'Late for the show', frame: 'In picture A it is ___ o’clock. In picture B it is ___.', diffs: [
        D('clock', [[320, 130, 650, 320]], "In picture A it is six o'clock.", 'In picture B it is half past six.'),
        D('train', [[150, 370, 790, 750, 'a'], [780, 320, 900, 430, 'b']], 'In picture A the train is at the platform.', 'In picture B the train is leaving.'),
        D('girl', [[650, 340, 900, 890]], 'In picture A the girl is nervous.', 'In picture B she is proud.'),
        D('trophy', [[1240, 410, 1500, 690]], 'In picture A the trophy is silver.', 'In picture B it is gold.'),
        D('shirts', [[920, 500, 1250, 670]], 'In picture A the team shirts are green.', 'In picture B they are orange.')
      ]},
      5: { title: 'Sound studio', frame: 'In picture A the ___ has ___. In picture B she / he has ___.', diffs: [
        D('girl', [[210, 400, 610, 940]], 'In picture A the girl has a drum.', 'In picture B she has a violin.'),
        D('man', [[760, 400, 1100, 690]], 'In picture A the man has coconut shells.', 'In picture B he has keys.'),
        D('on air', [[620, 80, 920, 250]], 'In picture A the ON AIR light is on.', 'In picture B it is off.'),
        D('microphones', [[730, 460, 910, 890]], 'In picture A there are three microphones.', 'In picture B there are two.'),
        D('dog', [[1030, 630, 1420, 1000]], 'In picture A the dog is sleeping.', 'In picture B it is barking.')
      ]}
    }
  };

  var HOOK = {
    3: {
      1: [['u1', 'machine', 'Remember our inventions?'], ['u2', 'full-moon', 'Our harvest moon!'], ['u3', 'coins', 'How much is it?']],
      2: [['u4', 'painting', 'Where is she?'], ['u4', 'volcano', 'The angry mountain!'], ['u5', 'time-capsule', "Let's go back!"]]
    },
    4: {
      1: [['u1', 'butterfly', 'Remember our journey?'], ['u2', 'owl', 'Animal survivors!'], ['u3', 'polar-bear', 'It keeps changing!']],
      2: [['u4', 'clock', 'Late for the show!'], ['u5', 'drum', 'Make some noise!'], ['u5', 'orchestra', 'And the audience cheers!']]
    }
  };

  var LESSONS = {
    1: { units: [1, 2, 3], steps: [
      { key: 'hook', label: 'Hook', min: 3 },
      { key: 'describe', label: 'Describe & guess', min: 12 },
      { key: 'spot', label: 'Spot the difference', min: 16 },
      { key: 'exit', label: 'Exit sentence', min: 4 }
    ]},
    2: { units: [4, 5], steps: [
      { key: 'hook', label: 'Hook', min: 3 },
      { key: 'describe', label: 'Describe & guess + mix', min: 10 },
      { key: 'spot', label: 'Spot the difference', min: 14 },
      { key: 'game', label: 'Team game', min: 5 },
      { key: 'exit', label: 'Traffic light', min: 3 }
    ]}
  };

  root.SpeakReviewData = { UNITS: UNITS, FRAMES: FRAMES, SPOT: SPOT, HOOK: HOOK, LESSONS: LESSONS };
})(window);
