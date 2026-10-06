/* Grade 4 Revision Quest: Unit 1 (Alice, butterflies, the brain) + Unit 2 (forests, the swallow's gift).
   One 25-minute smartboard lesson. Every sentence comes straight from the two units. */
window.RevData = (function () {
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
  ];

  /* "I can" goals shown at the start and ticked at the end */
  D.goals = [
    { u: 1, t: 'I can say what happened: chased, fell.' },
    { u: 1, t: 'I can ask Who, Where and Why questions.' },
    { u: 1, t: 'I can tell about a journey and about skimming a text.' },
    { u: 2, t: 'I can say so it can… and so they can…' },
    { u: 2, t: 'I can say deciduous and coniferous.' },
    { u: 2, t: 'I can say six past verbs: built, fell, gave, grew, hit, paid.' }
  ];

  /* Vanishing sentences: say it, hide words, say it again, say it from memory */
  D.sent1 = [
    { s: 'Alice chased a White Rabbit. Then she fell down a deep hole.', pics: ['🐇', '🕳️'], g: '🏃 Run on the spot. Then drop your hand down!' },
    { s: 'Who did Alice chase? Where did Alice fall? Why was Alice sleepy?', pics: ['❓', '🐇', '😴'], g: '☝️ One finger up for each question word.' },
    { s: 'The monarch butterfly goes on a long journey.', pics: ['🦋', '🗺️'], g: '🦋 Flap your arm-wings and fly across the room.' },
    { s: 'Reading is a workout for your brain.', pics: ['📖', '🧠'], g: '💪 Show your muscles. Lift an invisible book.' },
    { s: 'Skimming means looking at the title and the headings first.', pics: ['👀', '📰'], g: '👆 Swipe your finger fast across the page.' }
  ];
  D.sent2 = [
    { s: 'The hare turns white so it can hide in the snow.', art: ['hare_brown', 'hare_white'], g: '👉 Point your arm forward like an arrow for so it can.' },
    { s: 'Bears hibernate so they can survive the cold.', art: ['bear_sleeping'], g: '😴 Curl up and sleep. Then shiver!' },
    { s: 'Deciduous trees drop their leaves so they can save water.', art: ['tree_oak_autumn'], g: '🍂 Wiggle your fingers down like falling leaves.' },
    { s: 'Coniferous trees have needles instead of leaves.', art: ['tree_pine_snow'], g: '🌲 Make a tall pointy tree with your arms.' },
    { s: 'A baby bird fell. The swallow gave Go Ne a seed.', art: ['baby_swallow', 'seed_gold'], g: '⬇️ Drop your hand. Then hold out both hands.' }
  ];

  /* Word Gym: a picture, a gesture and a short example for every word */
  D.gym1 = [
    { w: 'freeze', e: '🥶', g: '🧍 Stay completely still!', x: 'A rabbit can freeze.' },
    { w: 'journey', e: '🦋', g: '🚶 Walk your fingers across the desk.', x: 'Monarchs go on a long journey.' },
    { w: 'visualize', e: '🧠', g: '🙌 Frame your eyes. Draw a picture in the air.', x: 'I visualize the story.' },
    { w: 'predator', e: '🐆', g: '🐾 Show your claws. Growl softly!', x: 'A predator hunts other animals.' },
    { w: 'sleepy', e: '😴', g: '🥱 Yawn and stretch.', x: 'Alice was sleepy.' },
    { w: 'chased', e: '🏃', g: '🏃 Run on the spot.', x: 'Alice chased a White Rabbit.' },
    { w: 'workout', e: '🏋️', g: '💪 Show your muscles.', x: 'Reading is a workout for my brain.' },
    { w: 'skim', e: '👀', g: '👆 Swipe your finger fast across the page.', x: 'I skim the title and headings.' }
  ];
  D.gym2 = [
    { w: 'deciduous', a: 'tree_oak_autumn', g: '🍂 Wiggle your fingers down like falling leaves.', x: 'Deciduous trees drop their leaves.' },
    { w: 'coniferous', a: 'tree_pine_snow', g: '🌲 Make a tall pointy tree.', x: 'Coniferous trees have needles.' },
    { w: 'hibernate', a: 'bear_sleeping', g: '😴 Curl up and sleep.', x: 'Bears hibernate in winter.' },
    { w: 'survive', a: 'thermometer_cold', g: '🥶 Shiver. Then give a thumbs up!', x: 'Animals survive the cold.' },
    { w: 'built', a: 'nest_eggs', g: '🔨 Hammer, hammer!', x: 'A swallow built a nest.' },
    { w: 'fell', a: 'baby_swallow', g: '⬇️ Drop your hand down.', x: 'A baby bird fell.' },
    { w: 'gave', a: 'seed_gold', g: '🤲 Hold out your hands.', x: 'The swallow gave Go Ne a seed.' },
    { w: 'grew', a: 'fruit_gold', g: '🌱 Crouch low, then grow up tall!', x: 'The seed grew into a big fruit.' },
    { w: 'hit', a: 'slingshot_stone', g: '✊ Tap your palm with your fist (gently).', x: 'Wen Shu hit a swallow. (hit stays hit!)' },
    { w: 'paid', a: 'coins', g: '💰 Hand over the coins.', x: 'Go Ne paid the vet.' }
  ];

  /* Memory Boss Battle: a cue, then the team says the whole sentence from memory */
  D.boss = [
    { u: 1, e: '🐇', cue: 'Alice chased…', ans: 'Alice chased a White Rabbit. Then she fell down a deep hole.' },
    { u: 2, art: 'hare_white', cue: 'The hare turns white…', ans: 'The hare turns white so it can hide in the snow.' },
    { u: 1, e: '🦋', cue: 'The monarch butterfly…', ans: 'The monarch butterfly goes on a long journey.' },
    { u: 2, art: 'bear_sleeping', cue: 'Bears hibernate…', ans: 'Bears hibernate so they can survive the cold.' },
    { u: 1, e: '🧠', cue: 'Reading is a…', ans: 'Reading is a workout for your brain.' },
    { u: 2, art: 'tree_pine_snow', cue: 'Coniferous trees have…', ans: 'Coniferous trees have needles instead of leaves.' },
    { u: 1, e: '❓', cue: 'Who…? Where…? Why…?', ans: 'Who did Alice chase? Where did Alice fall? Why was Alice sleepy?' },
    { u: 2, art: 'baby_swallow', cue: 'A baby bird fell…', ans: 'A baby bird fell. The swallow gave Go Ne a seed. The seed grew into a big fruit.' }
  ];

  return D;
})();
