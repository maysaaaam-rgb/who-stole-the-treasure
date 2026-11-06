/* Watch & Answer: video lessons where the cartoon/movie stops by itself and the class answers a question.
   Upgraded with:
   1. 🔮 What Happens Next? Freeze-Bet Checkpoints (4-team predictions + live video reveal + 2x stars)
   2. 🔔 Live Word-Catcher Buzzer (spot & catch target words during playback for bonus stars)
   3. 🖼️ Visual Scene Snapshot Retell (real movie frame captures at each story timestamp) */
window.WatchData = (function () {
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316', key: 'F' },
    { n: 'Owls',  e: '🦉', c: '#8b5cf6', key: 'O' },
    { n: 'Bears', e: '🐻', c: '#a16207', key: 'B' },
    { n: 'Hares', e: '🐇', c: '#06b6d4', key: 'H' }
  ];
  D.lessons = [
    {
      id: 'bad-guys-holiday',
      grade: 3,
      badge: '🦊 Bad Guys Holiday',
      title: 'The Bad Guys: A Very Bad Holiday',
      localVideo: 'videos/bad-guys.mp4',
      cloudVideo: 'https://github.com/maysaaaam-rgb/who-stole-the-treasure/releases/download/classroom-movies-v1/bad-guys.mp4',
      subtitles: 'subs/bad-guys.vtt',
      vid: 'fL4f2G1T9zE',
      minutes: 35,
      goals: [
        'I can say what the Bad Guys are doing.',
        'I can predict what happens next in the movie.',
        'I can tell the holiday story: First, Then, Finally.'
      ],
      predict: {
        q: 'Look at the Bad Guys! What do they want to do on Christmas morning?',
        opts: [
          ['🏦', 'Rob the big bank!'],
          ['😴', 'Sleep all day.'],
          ['🏫', 'Go to school.']
        ],
        note: 'Let\'s watch and see what happens to their holiday plan!'
      },
      wordHunt: [
        { id: 'bg-w1', tStart: 60,   tEnd: 92,   word: 'cheese',   emoji: '🧀', phrase: 'Piranha loves stinky cheese!' },
        { id: 'bg-w2', tStart: 93,   tEnd: 135,  word: 'bank',     emoji: '🏦', phrase: 'They want to rob the bank!' },
        { id: 'bg-w3', tStart: 136,  tEnd: 230,  word: 'balloon',  emoji: '🎈', phrase: 'Look at the giant Santa balloon!' },
        { id: 'bg-w4', tStart: 231,  tEnd: 340,  word: 'sad',      emoji: '😢', phrase: 'The people in the street feel sad.' },
        { id: 'bg-w5', tStart: 450,  tEnd: 530,  word: 'presents', emoji: '🎁', phrase: 'Giving presents to every house!' },
        { id: 'bg-w6', tStart: 531,  tEnd: 620,  word: 'music',    emoji: '🎵', phrase: 'Webs plays holiday music on the radio!' },
        { id: 'bg-w7', tStart: 750,  tEnd: 860,  word: 'snow',     emoji: '❄️', phrase: 'White snow is falling from the sky!' },
        { id: 'bg-w8', tStart: 1060, tEnd: 1290, word: 'Santa',    emoji: '🎅', phrase: 'Santa saves the Bad Guys!' }
      ],
      checkpoints: [
        { t: 82,   kind: 'quiz', q: 'What food does Piranha love?', opts: [['🧀', 'stinky cheese'], ['🍕', 'hot pizza'], ['🍎', 'red apples']], a: 0, say: 'Piranha loves stinky cheese!', hint: 'It is yellow and smelly!' },
        { t: 96,   kind: 'quiz', q: 'Where do the Bad Guys want to go?', opts: [['🏦', 'to the bank'], ['🏫', 'to school'], ['🏥', 'to the hospital']], a: 0, say: 'They want to go to the bank.', hint: 'Look at Mr. Wolf\'s big plan on the wall.' },
        { t: 148,  kind: 'quiz', q: 'What is on top of their car?', opts: [['🎈', 'a big Santa balloon'], ['🐉', 'a green dragon'], ['🚁', 'a helicopter']], a: 0, say: 'There is a big Santa balloon on the car.', hint: 'It is huge, red, and floats in the sky!' },
        { t: 226,  kind: 'bet',  revealSec: 9, q: '🔮 What happens next to the giant Santa balloon?!', opts: [['💥', 'It hits fire and POPS!'], ['🚀', 'It flies to the moon!'], ['🏊', 'It lands in the swimming pool!']], a: 0, say: 'Oh no! The Santa balloon popped and the people are sad!', hint: 'Watch the balloon near the fire!' },
        { t: 345,  kind: 'quiz', q: 'What did the Bad Guys make?', opts: [['🎅', 'a new Santa balloon'], ['⛄', 'a snowman'], ['🎂', 'a birthday cake']], a: 0, say: 'They made a new Santa balloon.', hint: 'Shark made it with lots of balloons!' },
        { t: 478,  kind: 'bet',  revealSec: 7, q: '🔮 What will the Bad Guys give to the houses now?', opts: [['🎁', 'Colourful Christmas presents!'], ['📚', 'Big school books!'], ['👟', 'Old smelly shoes!']], a: 0, say: 'They are giving presents to the houses!', hint: 'Look at the colourful boxes with ribbons!' },
        { t: 535,  kind: 'quiz', q: 'What is Webs playing on the radio?', opts: [['🎵', 'holiday music'], ['⚽', 'football'], ['📰', 'the news']], a: 0, say: 'Webs is playing holiday music.', hint: 'Listen to the happy song!' },
        { t: 780,  kind: 'bet',  revealSec: 8, q: '🔮 What will come out of the big ice machine next?', opts: [['❄️', 'Real white snow in the sky!'], ['🍦', 'Strawberry ice cream!'], ['🔥', 'Hot orange fire!']], a: 0, say: 'They are making white snow!', hint: 'It is cold, white, and falls from the sky!' },
        { t: 1098, kind: 'bet',  revealSec: 8, q: '🔮 Their car is falling in the storm! Who saves them next?', opts: [['🤖', 'The giant Santa balloon catches them!'], ['🚓', 'A police helicopter!'], ['🦅', 'A giant golden eagle!']], a: 0, say: 'The giant Santa balloon saves them!', hint: 'It is big and pulls their car up!' },
        { t: 1295, kind: 'quiz', q: 'What did real Santa leave for the Bad Guys at the end?', opts: [['🧀', 'presents and cheese'], ['🪨', 'black rocks'], ['🥦', 'green broccoli']], a: 0, say: 'Santa left presents and stinky cheese!', hint: 'Look under the Christmas tree!' }
      ],
      retell: [
        { e: '🎈', t: 230, sceneTitle: 'Scene 1 • 3:50', bg: 'linear-gradient(135deg,#dc2626,#7f1d1d)', s: 'The Bad Guys pop the big Santa balloon.' },
        { e: '😢', t: 245, sceneTitle: 'Scene 2 • 4:05', bg: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', s: 'The city is sad and goes home.' },
        { e: '🎁', t: 485, sceneTitle: 'Scene 3 • 8:05', bg: 'linear-gradient(135deg,#059669,#064e3b)', s: 'The Bad Guys put presents at every house.' },
        { e: '❄️', t: 788, sceneTitle: 'Scene 4 • 13:08', bg: 'linear-gradient(135deg,#0284c7,#0c4a6e)', s: 'They make white snow for the city.' },
        { e: '🤖', t: 1105, sceneTitle: 'Scene 5 • 18:25', bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)', s: 'The Santa balloon saves them in the storm.' },
        { e: '🧀', t: 1295, sceneTitle: 'Scene 6 • 21:35', bg: 'linear-gradient(135deg,#d97706,#78350f)', s: 'Real Santa gives them presents and cheese!' }
      ]
    },
    {
      id: 'spider-verse',
      grade: 4,
      badge: '🕷️ Spider-Man',
      title: 'Spider-Man: Into the Spider-Verse',
      localVideo: 'videos/spider-verse.mp4?v=full',
      cloudVideo: 'https://github.com/maysaaaam-rgb/who-stole-the-treasure/releases/download/classroom-movies-v1/spider-verse.mp4?v=full',
      subtitles: '',
      vid: 'g4Hbz2jLxvQ',
      minutes: 35,
      goals: [
        'I can say what Miles Morales is doing.',
        'I can predict what happens next in the story.',
        'I can tell how Miles becomes Spider-Man.'
      ],
      predict: {
        q: 'Look at Miles Morales! What super power can Spider-Man do?',
        opts: [
          ['🕸️', 'Climb walls and jump high!'],
          ['🐟', 'Breathe under water like a fish.'],
          ['❄️', 'Turn everything into ice.']
        ],
        note: 'Let\'s watch Miles\'s story and see how he gets his spider powers!'
      },
      wordHunt: [
        { id: 'sp-w1', tStart: 140,  tEnd: 175,  word: 'stickers',   emoji: '🎨', phrase: 'Miles is drawing on stickers!' },
        { id: 'sp-w2', tStart: 176,  tEnd: 215,  word: 'headphones', emoji: '🎧', phrase: 'He is wearing blue headphones!' },
        { id: 'sp-w3', tStart: 216,  tEnd: 290,  word: 'suitcase',   emoji: '🧳', phrase: 'Miles pulls a green suitcase.' },
        { id: 'sp-w4', tStart: 291,  tEnd: 390,  word: 'police',     emoji: '👮', phrase: 'His dad is a police officer!' },
        { id: 'sp-w5', tStart: 395,  tEnd: 515,  word: 'school',     emoji: '🏫', phrase: 'Miles arrives at his new school.' },
        { id: 'sp-w6', tStart: 640,  tEnd: 730,  word: 'tunnel',     emoji: '🚇', phrase: 'Painting in a dark subway tunnel!' },
        { id: 'sp-w7', tStart: 731,  tEnd: 830,  word: 'spider',     emoji: '🕷️', phrase: 'A glowing spider crawls on his shoe!' },
        { id: 'sp-w8', tStart: 1150, tEnd: 1260, word: 'wall',       emoji: '🧗', phrase: 'Miles can walk on the building wall!' }
      ],
      checkpoints: [
        { t: 158,  kind: 'quiz', q: 'What is Miles doing at his desk?', opts: [['🎨', 'drawing on stickers'], ['🍳', 'cooking breakfast'], ['⚽', 'playing football']], a: 0, say: 'Miles is drawing on stickers.', hint: 'Look at the markers in his hand.' },
        { t: 182,  kind: 'quiz', q: 'What is Miles wearing on his ears?', opts: [['🎧', 'blue headphones'], ['👑', 'a gold crown'], ['🕶️', 'sunglasses']], a: 0, say: 'He is wearing blue headphones.', hint: 'He is listening to a song and singing!' },
        { t: 222,  kind: 'quiz', q: 'What is Miles pulling on the street?', opts: [['🧳', 'a green suitcase'], ['🛒', 'a shopping trolley'], ['🚲', 'a red bike']], a: 0, say: 'He is pulling a green suitcase.', hint: 'He is taking his clothes to his new school.' },
        { t: 295,  kind: 'bet',  revealSec: 7, q: '🔮 Who stops behind Miles in the street with a loud siren?', opts: [['👮', 'His dad in a police car!'], ['🚒', 'A big red fire truck!'], ['🍦', 'An ice-cream van!']], a: 0, say: 'His dad is a police officer!', hint: 'Look at the flashing police lights!' },
        { t: 412,  kind: 'quiz', q: 'Where is Miles now?', opts: [['🏫', 'at his new school'], ['🏖️', 'at the beach'], ['🦁', 'at the zoo']], a: 0, say: 'Miles is at his new school.', hint: 'Look at all the students in jackets.' },
        { t: 522,  kind: 'quiz', q: 'What is on the teacher\'s desk?', opts: [['📚', 'school homework'], ['🍕', 'hot pizza'], ['🧸', 'toy bears']], a: 0, say: 'There is homework on the desk.', hint: 'The teacher gives Miles his paper.' },
        { t: 662,  kind: 'quiz', q: 'Where are Miles and his Uncle Aaron walking?', opts: [['🚇', 'in a dark subway tunnel'], ['🌳', 'in a sunny park'], ['🛒', 'in a supermarket']], a: 0, say: 'They are walking in a dark tunnel.', hint: 'They are underground in the city!' },
        { t: 735,  kind: 'bet',  revealSec: 7, q: '🔮 Look closely at Miles\'s shoe! What will happen next?', opts: [['🕷️', 'A glowing spider crawls up and bites him!'], ['🐸', 'A green frog jumps on his head!'], ['🐁', 'A little mouse steals his shoe!']], a: 0, say: 'A glowing spider is on his shoe!', hint: 'It has eight legs and glows blue and red!' },
        { t: 895,  kind: 'bet',  revealSec: 7, q: '🔮 Miles touches Gwen\'s shoulder in the hallway! What happens next?', opts: [['👱‍♀️', 'His hand STICKS to her hair!'], ['🎈', 'He floats up to the ceiling!'], ['👻', 'He turns invisible right there!']], a: 0, say: 'Miles talks to Gwen and his hand sticks to her hair!', hint: 'Spider powers make his fingers sticky!' },
        { t: 1195, kind: 'bet',  revealSec: 7, q: '🔮 Miles is outside the window! What amazing thing will he do next?', opts: [['🧗', 'Walk right up the building wall!'], ['🏊', 'Dive into a swimming pool!'], ['🚗', 'Drive a police car!']], a: 0, say: 'He can walk on the wall!', hint: 'His hands and feet stick to the bricks!' }
      ],
      retell: [
        { e: '🎧', t: 182, sceneTitle: 'Scene 1 • 3:02', bg: 'linear-gradient(135deg,#0284c7,#1e3a8a)', s: 'Miles listens to music and draws stickers.' },
        { e: '👮', t: 302, sceneTitle: 'Scene 2 • 5:02', bg: 'linear-gradient(135deg,#1d4ed8,#172554)', s: 'His police dad drives him to school.' },
        { e: '🚇', t: 662, sceneTitle: 'Scene 3 • 11:02', bg: 'linear-gradient(135deg,#4f46e5,#312e81)', s: 'Miles and Uncle Aaron paint in a tunnel.' },
        { e: '🕷️', t: 742, sceneTitle: 'Scene 4 • 12:22', bg: 'linear-gradient(135deg,#e11d48,#881337)', s: 'A glowing spider bites Miles\'s hand.' },
        { e: '👱‍♀️', t: 902, sceneTitle: 'Scene 5 • 15:02', bg: 'linear-gradient(135deg,#d97706,#78350f)', s: 'His hand sticks to Gwen\'s hair at school.' },
        { e: '🧗', t: 1202, sceneTitle: 'Scene 6 • 20:02', bg: 'linear-gradient(135deg,#059669,#064e3b)', s: 'Miles can climb up walls like Spider-Man!' }
      ]
    },
    {
      id: 'bean-trolley',
      grade: 3,
      badge: '🛒 Mr Bean',
      title: 'Mr Bean: Super Trolley',
      localVideo: '',
      cloudVideo: '',
      subtitles: '',
      vid: 'uyYIojxxljE',
      minutes: 35,
      goals: ['I can say what Mr Bean is doing.', 'I can predict what happens next.', 'I can tell the story: First, Then, Finally.'],
      predict: { q: 'The cartoon is called SUPER TROLLEY. What can a super trolley do?', opts: [['🚀', 'It can go very fast.'], ['🛸', 'It can fly.'], ['🎵', 'It can sing.']], note: 'There is no wrong answer. We will see!' },
      wordHunt: [
        { id: 'mb-w1', tStart: 30,  tEnd: 70,  word: 'cereal',   emoji: '🥣', phrase: 'Mr Bean eats crunchy cereal!' },
        { id: 'mb-w2', tStart: 75,  tEnd: 120, word: 'cat',      emoji: '🐱', phrase: 'An old lady and a cat on the stairs!' },
        { id: 'mb-w3', tStart: 125, tEnd: 180, word: 'shop',     emoji: '🛒', phrase: 'Mr Bean arrives at the big shop!' },
        { id: 'mb-w4', tStart: 185, tEnd: 265, word: 'Teddy',    emoji: '🧸', phrase: 'Teddy rides in the super trolley!' },
        { id: 'mb-w5', tStart: 325, tEnd: 390, word: 'milk',     emoji: '🥛', phrase: 'Fresh milk on the supermarket shelf!' },
        { id: 'mb-w6', tStart: 510, tEnd: 575, word: 'forklift', emoji: '🚜', phrase: 'Driving a yellow forklift!' }
      ],
      checkpoints: [
        { t: 42,  kind: 'quiz', q: 'What is Mr Bean eating?', opts: [['🥣', 'cereal'], ['🍕', 'pizza'], ['🍲', 'soup']], a: 0, say: 'Mr Bean is eating cereal.', hint: 'Look at the bowl and the spoon.' },
        { t: 86,  kind: 'quiz', q: 'Who is on the stairs with Mr Bean?', opts: [['👵', 'an old lady and a cat'], ['👮', 'a policeman'], ['👩‍⚕️', 'a doctor']], a: 0, say: 'An old lady and a cat are on the stairs.', hint: 'Look at the stairs.' },
        { t: 132, kind: 'quiz', q: 'Where is Mr Bean now?', opts: [['🏫', 'at school'], ['🛒', 'at the shop'], ['🌳', 'at the park']], a: 1, say: 'Mr Bean is at the shop.', hint: 'Look at the big building and the cars.' },
        { t: 184, kind: 'bet',  revealSec: 6, q: '🔮 How will Mr Bean ride around the supermarket next?', opts: [['🛒', 'Inside a fast SUPER TROLLEY!'], ['🛴', 'On a pink scooter!'], ['🐎', 'On a brown horse!']], a: 2, say: 'Mr Bean is in a trolley.', hint: 'It is the SUPER TROLLEY!' },
        { t: 250, kind: 'quiz', q: 'Who is with Mr Bean?', opts: [['🧸', 'Teddy'], ['🐶', 'a dog'], ['👶', 'a baby']], a: 0, say: 'Teddy is with Mr Bean.', hint: 'It is his friend. It is brown.' },
        { t: 278, kind: 'quiz', q: 'How does the shop lady feel?', opts: [['😴', 'sleepy'], ['😮', 'surprised'], ['😊', 'happy']], a: 1, say: 'The shop lady is surprised.', hint: 'Look at her face and her eyes.' },
        { t: 340, kind: 'quiz', q: 'What is on the shelf?', opts: [['🥛', 'milk'], ['🧃', 'juice'], ['🥚', 'eggs']], a: 0, say: 'There is milk on the shelf.', hint: 'There is a cow on the box.' },
        { t: 518, kind: 'bet',  revealSec: 7, q: '🔮 What big machine will Mr Bean drive next?', opts: [['🚜', 'A yellow forklift!'], ['🚌', 'A red school bus!'], ['🚁', 'A helicopter!']], a: 0, say: 'Mr Bean is driving a yellow forklift.', hint: 'It is yellow and it lifts big boxes.' },
        { t: 588, kind: 'quiz', q: 'Where is Mr Bean going now?', opts: [['🏠', 'home'], ['🏫', 'to school'], ['🏖️', 'to the beach']], a: 0, say: 'Mr Bean is going home.', hint: 'He has the shopping. Look at the road.' },
        { t: 640, kind: 'quiz', q: 'What is in the bowl at the end?', opts: [['🥣', 'cereal'], ['🍜', 'noodles'], ['🍰', 'cake']], a: 0, say: 'There is cereal in the bowl.', hint: 'It is the same food as at the start.' }
      ],
      retell: [
        { e: '🥣', t: 42,  sceneTitle: 'Scene 1 • 0:42', bg: 'linear-gradient(135deg,#d97706,#78350f)', s: 'Mr Bean eats cereal.' },
        { e: '👵', t: 86,  sceneTitle: 'Scene 2 • 1:26', bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)', s: 'He sees an old lady and a cat.' },
        { e: '🛒', t: 132, sceneTitle: 'Scene 3 • 2:12', bg: 'linear-gradient(135deg,#0284c7,#0c4a6e)', s: 'He goes to the shop.' },
        { e: '🧸', t: 250, sceneTitle: 'Scene 4 • 4:10', bg: 'linear-gradient(135deg,#e11d48,#881337)', s: 'He pushes a trolley with Teddy.' },
        { e: '🚜', t: 525, sceneTitle: 'Scene 5 • 8:45', bg: 'linear-gradient(135deg,#ca8a04,#713f12)', s: 'He drives a forklift.' },
        { e: '🏠', t: 588, sceneTitle: 'Scene 6 • 9:48', bg: 'linear-gradient(135deg,#059669,#064e3b)', s: 'He goes home with the shopping.' }
      ]
    }
  ];
  return D;
})();
