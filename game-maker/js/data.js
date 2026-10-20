/* Game Maker: ready-made question sets, themes and power-ups. Own wording; no textbook text is copied.
   An item is { q: 'sentence with ____', a: 'right answer', w: ['wrong 1', 'wrong 2'], pic: 'emoji or image path (optional)', hint: '(optional)' }. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  function rows(list) { return list.map(function (r) { return { q: r[0], a: r[1], w: r.slice(2, 4), pic: r[4] || '' }; }); }

  var MONA = [
    ['Yesterday Peruggia ____ the painting.', 'took', 'take', 'taked'], ['He ____ a worker coat.', 'put on', 'puts on', 'putted on'],
    ['He ____ the painting off the wall.', 'lifted', 'lift', 'lifting'], ['The police ____ the painting.', 'found', 'find', 'finded'],
    ['Peruggia ____ out of the museum.', 'walked', 'walk', 'walking'], ['He ____ the painting under his coat.', 'hid', 'hide', 'hided'],
    ['The guard ____ nothing.', 'saw', 'see', 'seed'], ['The painting ____ home to the museum.', 'went', 'go', 'goed'],
    ['Leonardo ____ the Mona Lisa.', 'painted', 'paint', 'paints'], ['In 1911, the painting ____ missing.', 'was', 'is', 'are'],
    ['The people ____ sad.', 'were', 'was', 'is'], ['Peruggia ____ a plan.', 'had', 'have', 'haves'],
    ['The robbery ____ in the news.', 'was', 'were', 'are'], ['The police ____ Peruggia.', 'arrested', 'arrest', 'arrests'],
    ['Today I walk. Yesterday I ____.', 'walked', 'walk', 'walks'], ['Today I take a pen. Yesterday I ____ a pen.', 'took', 'take', 'takes'],
    ['Today I find a coin. Yesterday I ____ a coin.', 'found', 'find', 'finds'], ['Today I see a bird. Yesterday I ____ a bird.', 'saw', 'see', 'sees'],
    ['Today I go to school. Yesterday I ____ to school.', 'went', 'go', 'goes'], ['Today I lift a box. Yesterday I ____ a box.', 'lifted', 'lift', 'lifts'],
    ['Yesterday we ____ at the museum.', 'were', 'was', 'are'], ['The guard ____ asleep.', 'was', 'were', 'is'],
    ['Which word? To take something that is not yours.', 'steal', 'plan', 'lifted', '🥷'], ['Which word? An idea of what you will do.', 'plan', 'robbery', 'arrested', '📝'],
    ['Which word? To pick something up with your arms.', 'lifted', 'steal', 'plan', '🏋️'], ['Which word? When a thief takes things from a place.', 'robbery', 'arrested', 'lifted', '🚨'],
    ['Which word? The police took the thief away.', 'arrested', 'plan', 'robbery', '👮'], ['A ____ is a person who steals.', 'thief', 'guard', 'painter'],
    ['A ____ watches the museum at night.', 'guard', 'thief', 'painter'], ['The Mona Lisa is a famous ____.', 'painting', 'pencil', 'phone', '🖼️'],
    ['A ____ is a place with old paintings and statues.', 'museum', 'kitchen', 'garage', '🏛️'], ['People read the ____ to see the news.', 'newspaper', 'painting', 'statue', '📰'],
    ['The ____ catch thieves.', 'police', 'painters', 'farmers', '👮'], ['A ____ is made of stone.', 'statue', 'newspaper', 'coat', '🗿'],
    ['Peruggia wanted to ____ the painting.', 'steal', 'stole', 'stealing'], ['He ____ the painting. (steal, past)', 'stole', 'steal', 'stealed'],
    ['Who painted the Mona Lisa?', 'Leonardo', 'Peruggia', 'The guard'], ['When did Peruggia take the painting?', 'In 1911', 'In 1503', 'Tomorrow'],
    ['Where did the Mona Lisa go at the end?', 'Home to the museum', 'To a shop', 'To the sea'], ['What did Peruggia hide it under?', 'His coat', 'His bed', 'A tree']
  ];

  var SHOW = [
    ['The ____ starts at six o’clock.', 'show', 'sank', 'calm', '🎭'], ['Please stay ____ and wait here.', 'calm', 'alive', 'platform', '😌'],
    ['We wait for the train on the ____.', 'platform', 'show', 'sank', '🚉'], ['The ship ____ in the storm.', 'sank', 'calm', 'alive', '🚢'],
    ['My brother is ____! He is not hurt.', 'alive', 'platform', 'show', '🙌'],
    ['Who said: “Look at all the traffic!”?', 'Harry’s dad', 'Harry’s mom', 'Mr. Williams'], ['Who said: “Don’t worry. There is plenty of time.”?', 'Harry’s mom', 'Harry’s dad', 'Lynn'],
    ['Who said: “We are never going to get there!”?', 'Harry', 'Riya', 'Arush'], ['Who said: “Why don’t we perform the show here?”?', 'Lynn', 'Harry', 'Mr. Williams'],
    ['Who said: “Great teamwork! I am so proud of you.”?', 'Mr. Williams', 'Harry’s dad', 'Arush'], ['Who plays the tree in the play?', 'Harry', 'Arush', 'Riya', '🌳'],
    ['Which play do the children perform?', 'Twelfth Night', 'Hamlet', 'Cinderella', '🎭'], ['Where do the friends perform the play?', 'On the platform', 'In the car', 'At school'],
    ['What stops on the way to the show?', 'The train', 'The bus', 'The boat', '🚇'], ['What is Harry’s car stuck in?', 'Traffic', 'Mud', 'Snow', '🚗'],
    ['What time should the children come to the show? (quarter past ____)', 'five', 'six', 'two', '🕔'], ['Harry finds his friends on the ____.', 'platform', 'bus', 'stage', '🚉'],
    ['First, Harry’s car is stuck in traffic. ____, the train has a problem.', 'Then', 'Finally', 'First'], ['The children perform the play. ____, everybody claps.', 'Finally', 'First', 'Then'],
    ['Yesterday I was late ____ the bus was slow.', 'because', 'so', 'but'], ['“Late” means: ____', 'not on time', 'very early', 'very fast', '⏰'],
    ['Riya plays ____ in the play.', 'Viola', 'the Tree', 'the Narrator', '👸'], ['Arush plays ____ in the play.', 'Sebastian', 'the Tree', 'Viola', '🤵'],
    ['The train has a problem, so we ____ on the platform.', 'wait', 'swim', 'sleep', '🚉'], ['Mr. Williams says: Don’t be ____. It’s your first time on stage.', 'nervous', 'happy', 'tall'],
    ['Lynn has an idea. Her idea is to ____ the show on the platform.', 'perform', 'cancel', 'forget', '💡'], ['The ship ____ and Viola was alone on the beach.', 'sank', 'sang', 'sat'],
    ['After the show, Mr. Williams says: Great ____!', 'teamwork', 'homework', 'traffic', '🤝'], ['A story map has characters, setting, problem and ____.', 'solution', 'picture', 'teacher']
  ];

  var MOON = [
    ['The opposite of RIGHT is ____.', 'left', 'fast', 'low', '↔️'], ['The opposite of IN is ____.', 'out', 'tall', 'slow', '↔️'],
    ['The opposite of FAST is ____.', 'slow', 'left', 'out', '↔️'], ['The opposite of TALL is ____.', 'low', 'in', 'right', '↔️'],
    ['Walk ____ in a circle! (stretch up high)', 'tall', 'low', 'slow', '🧍'], ['Walk ____ in a circle! (bend your knees)', 'low', 'tall', 'fast', '🧎'],
    ['We are done, we are ____!', 'done', 'down', 'dance'], ['Sit ____, sit down!', 'down', 'round', 'moon'], ['Have a ____, have a rest!', 'rest', 'rock', 'ride'],
    ['The circle answers: ____!', 'Ganggangsullae', 'Happy birthday', 'Good morning', '🌕'], ['Chuseok is in ____.', 'autumn', 'spring', 'summer', '🍂'],
    ['At Chuseok the moon is ____ and round.', 'full', 'tiny', 'square', '🌕'], ['Right, right, right you ____!', 'go', 'know', 'row', '➡️'], ['Left, left, left you ____!', 'go', 'low', 'so', '⬅️']
  ];

  var HAL = [
    ['A ____ flies at night and sleeps upside down.', 'bat', 'cat', 'hat', '🦇'], ['A ____ says “Boo!” and floats in a white sheet.', 'ghost', 'goat', 'coat', '👻'],
    ['A ____ is big and orange with a funny face.', 'pumpkin', 'pillow', 'puppy', '🎃'], ['A ____ rides a broom and wears a pointy hat.', 'witch', 'which', 'wish', '🧙'],
    ['A ____ has eight legs and makes a web.', 'spider', 'spoon', 'snake', '🕷️'], ['A black ____ has big yellow eyes.', 'cat', 'cap', 'car', '🐈‍⬛'],
    ['A ____ is made of bones.', 'skeleton', 'skateboard', 'sandal', '💀'], ['We wear a ____ at a Halloween party.', 'costume', 'cushion', 'cuckoo', '🎭'],
    ['A ____ gives light in the dark.', 'lantern', 'lizard', 'ladder', '🏮'], ['The witch stirs a ____.', 'cauldron', 'cabin', 'candle', '🪄'],
    ['The ghost is ____. (not scary, very funny)', 'friendly', 'frozen', 'furry', '😊'], ['The bat ____ over the house last night.', 'flew', 'fly', 'flied', '🦇'],
    ['The children ____ costumes yesterday.', 'wore', 'wear', 'weared', '👗'], ['The witch ____ a spell last night.', 'cast', 'cost', 'cut'],
    ['The moon is big and ____.', 'round', 'rough', 'run', '🌕'], ['At night the sky is ____.', 'dark', 'dry', 'deep', '🌙'],
    ['The pumpkin has a big ____.', 'smile', 'smoke', 'snail', '😁'], ['The ghost goes through the ____.', 'wall', 'wolf', 'wing', '🧱'],
    ['Which one is a Halloween animal?', 'bat', 'cow', 'duck', '🦇'], ['“Trick or treat!” is something children say on ____.', 'Halloween', 'Monday', 'Sunday', '🎃']
  ];

  GM.sets = [
    { id: 'mona-g3', title: 'Grade 3 · Mona Lisa review', grade: 3, e: '🖼️', items: rows(MONA) },
    { id: 'show-g4', title: 'Grade 4 · Late for the Show', grade: 4, e: '🎭', items: rows(SHOW) },
    { id: 'moon-g3', title: 'Grade 3 · Chuseok Moon Song', grade: 3, e: '🌕', items: rows(MOON) },
    { id: 'halloween', title: 'Halloween words and verbs', grade: 0, e: '🎃', items: rows(HAL) }
  ];

  GM.themes = {
    classic: { id: 'classic', name: 'Classic', e: '⭐', tile: '#3b82f6', accent: '#f59e0b', music: 'classic_loop' },
    halloween: { id: 'halloween', name: 'Halloween', e: '🎃', tile: '#7c3aed', accent: '#f97316', music: 'halloween_loop' }
  };

  /* power-ups: tier 'good' and 'tricky'; jr = also in Classic Jr; needs = asks the teacher to pick another team */
  GM.powerups = [
    { id: 'fairy', e: '🧚', n: 'Fairy', d: 'Take some points', needs: 1, tier: 'good' },
    { id: 'thief', e: '🦝', n: 'Thief', d: 'Give some points', needs: 1, tier: 'tricky' },
    { id: 'rocket', e: '🚀', n: 'Rocket', d: 'Go to first place', tier: 'good', jr: 1 },
    { id: 'banana', e: '🍌', n: 'Banana', d: 'Go to last place', tier: 'tricky' },
    { id: 'star', e: '⭐', n: 'Star', d: 'Double points', tier: 'good', jr: 1 },
    { id: 'heart', e: '💖', n: 'Heart', d: 'Another team wins 5-25 points', needs: 1, tier: 'good', jr: 1 },
    { id: 'eraser', e: '🧽', n: 'Eraser', d: 'Reset your score', tier: 'tricky' },
    { id: 'virus', e: '🦠', n: 'Virus', d: 'Reset all scores', tier: 'tricky' },
    { id: 'shark', e: '🦈', n: 'Shark', d: 'Another team loses 5-25 points', needs: 1, tier: 'tricky' },
    { id: 'magnet', e: '🧲', n: 'Magnet', d: 'Take 5-25 points', needs: 1, tier: 'good' },
    { id: 'lifesaver', e: '🛟', n: 'Lifesaver', d: 'Give 5-25 points', needs: 1, tier: 'good' },
    { id: 'trap', e: '🕳️', n: 'Trap', d: 'No points', tier: 'tricky' },
    { id: 'seesaw', e: '⚖️', n: 'Seesaw', d: 'Swap points', needs: 1, tier: 'good' },
    { id: 'gold', e: '💰', n: 'Gold', d: 'Win 50 points', tier: 'good', jr: 1 },
    { id: 'boom', e: '💣', n: 'Boom', d: 'Lose 50 points', tier: 'tricky' },
    { id: 'gift', e: '🎁', n: 'Gift', d: 'Win 5-25 points', tier: 'good', jr: 1 }
  ];

  GM.teamColors = ['#f97316', '#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#84cc16'];
  GM.teamNames = ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Team 7', 'Team 8'];
})(window);
