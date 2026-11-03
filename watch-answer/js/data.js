/* Watch & Answer: video lessons where the cartoon/movie stops by itself and the class answers a question.
   All questions are original and written for A1 / A1+ learners. Supports cloud release streaming, local classroom MP4 files, teacher-picked video files, and YouTube fallback. Times are in seconds. */
window.WatchData = (function () {
  var D = {};
  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316' }, { n: 'Owls', e: '🦉', c: '#8b5cf6' },
    { n: 'Bears', e: '🐻', c: '#a16207' }, { n: 'Hares', e: '🐇', c: '#06b6d4' }
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
        'I can say how the people feel (happy / sad).',
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
      checkpoints: [
        { t: 82, q: 'What food does Piranha love?', opts: [['🧀', 'stinky cheese'], ['🍕', 'hot pizza'], ['🍎', 'red apples']], a: 0, say: 'Piranha loves stinky cheese!', hint: 'It is yellow and smelly!' },
        { t: 96, q: 'Where do the Bad Guys want to go?', opts: [['🏦', 'to the bank'], ['🏫', 'to school'], ['🏥', 'to the hospital']], a: 0, say: 'They want to go to the bank.', hint: 'Look at Mr. Wolf\'s big plan on the wall.' },
        { t: 148, q: 'What is on top of their car?', opts: [['🎈', 'a big Santa balloon'], ['🐉', 'a green dragon'], ['🚁', 'a helicopter']], a: 0, say: 'There is a big Santa balloon on the car.', hint: 'It is huge, red, and floats in the sky!' },
        { t: 235, q: 'Oh no! The Santa balloon popped! How do the people feel?', opts: [['😢', 'sad'], ['😄', 'happy'], ['😴', 'sleepy']], a: 0, say: 'The people are very sad.', hint: 'Look at their faces in the street.' },
        { t: 345, q: 'What did the Bad Guys make?', opts: [['🎅', 'a new Santa balloon'], ['⛄', 'a snowman'], ['🎂', 'a birthday cake']], a: 0, say: 'They made a new Santa balloon.', hint: 'Shark made it with lots of balloons!' },
        { t: 485, q: 'What are the Bad Guys giving to the houses?', opts: [['🎁', 'presents'], ['📚', 'homework'], ['👟', 'old shoes']], a: 0, say: 'They are giving presents to the houses.', hint: 'Look at the colourful boxes with ribbons!' },
        { t: 535, q: 'What is Webs playing on the radio?', opts: [['🎵', 'holiday music'], ['⚽', 'football'], ['📰', 'the news']], a: 0, say: 'Webs is playing holiday music.', hint: 'Listen to the happy song!' },
        { t: 788, q: 'What are they making with the ice machine?', opts: [['❄️', 'white snow'], ['🍦', 'ice cream'], ['🌧️', 'warm rain']], a: 0, say: 'They are making white snow.', hint: 'It is cold, white, and falls from the sky!' },
        { t: 1105, q: 'Who saves the Bad Guys in the big snow storm?', opts: [['🤖', 'the giant Santa balloon'], ['🚓', 'the police'], ['🐶', 'a little dog']], a: 0, say: 'The giant Santa balloon saves them!', hint: 'It is big and pulls their car up!' },
        { t: 1295, q: 'What did real Santa leave for the Bad Guys at the end?', opts: [['🧀', 'presents and cheese'], ['🪨', 'black rocks'], ['🥦', 'green broccoli']], a: 0, say: 'Santa left presents and stinky cheese!', hint: 'Look under the Christmas tree!' }
      ],
      retell: [
        { e: '🎈', s: 'The Bad Guys pop the big Santa balloon.' },
        { e: '😢', s: 'The city is sad and goes home.' },
        { e: '🎁', s: 'The Bad Guys put presents at every house.' },
        { e: '❄️', s: 'They make white snow for the city.' },
        { e: '🤖', s: 'The Santa balloon saves them in the storm.' },
        { e: '🧀', s: 'Real Santa gives them presents and cheese!' }
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
        'I can name places in the city (school, street, tunnel).',
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
      checkpoints: [
        { t: 158, q: 'What is Miles doing at his desk?', opts: [['🎨', 'drawing on stickers'], ['🍳', 'cooking breakfast'], ['⚽', 'playing football']], a: 0, say: 'Miles is drawing on stickers.', hint: 'Look at the markers in his hand.' },
        { t: 182, q: 'What is Miles wearing on his ears?', opts: [['🎧', 'blue headphones'], ['👑', 'a gold crown'], ['🕶️', 'sunglasses']], a: 0, say: 'He is wearing blue headphones.', hint: 'He is listening to a song and singing!' },
        { t: 222, q: 'What is Miles pulling on the street?', opts: [['🧳', 'a green suitcase'], ['🛒', 'a shopping trolley'], ['🚲', 'a red bike']], a: 0, say: 'He is pulling a green suitcase.', hint: 'He is taking his clothes to his new school.' },
        { t: 302, q: 'What is Miles\'s dad\'s job?', opts: [['👮', 'a police officer'], ['👨‍⚕️', 'a doctor'], ['👨‍🍳', 'a chef']], a: 0, say: 'His dad is a police officer.', hint: 'Look at his dad\'s uniform and police car!' },
        { t: 412, q: 'Where is Miles now?', opts: [['🏫', 'at his new school'], ['🏖️', 'at the beach'], ['🦁', 'at the zoo']], a: 0, say: 'Miles is at his new school.', hint: 'Look at all the students in jackets.' },
        { t: 522, q: 'What is on the teacher\'s desk?', opts: [['📚', 'school homework'], ['🍕', 'hot pizza'], ['🧸', 'toy bears']], a: 0, say: 'There is homework on the desk.', hint: 'The teacher gives Miles his paper.' },
        { t: 662, q: 'Where are Miles and his Uncle Aaron walking?', opts: [['🚇', 'in a dark subway tunnel'], ['🌳', 'in a sunny park'], ['🛒', 'in a supermarket']], a: 0, say: 'They are walking in a dark tunnel.', hint: 'They are underground in the city!' },
        { t: 742, q: 'Look closely! What is crawling on Miles\'s red shoe?', opts: [['🕷️', 'a glowing spider'], ['🐸', 'a green frog'], ['🦋', 'a yellow butterfly']], a: 0, say: 'A glowing spider is on his shoe!', hint: 'It has eight legs and glows blue and red!' },
        { t: 902, q: 'Who does Miles talk to in the school hallway?', opts: [['👱‍♀️', 'a girl (Gwen)'], ['🤖', 'a big robot'], ['🏴‍☠️', 'a pirate']], a: 0, say: 'Miles talks to Gwen at school.', hint: 'She has blonde hair and a school uniform.' },
        { t: 1202, q: 'Look at Miles outside! What can he do now?', opts: [['🧗', 'walk on the building wall!'], ['🏊', 'swim in the sea'], ['🚗', 'drive a police car']], a: 0, say: 'He can walk on the wall!', hint: 'His hands and feet stick to the bricks!' }
      ],
      retell: [
        { e: '🎧', s: 'Miles listens to music and draws stickers.' },
        { e: '👮', s: 'His police dad drives him to school.' },
        { e: '🚇', s: 'Miles and Uncle Aaron paint in a tunnel.' },
        { e: '🕷️', s: 'A glowing spider bites Miles\'s hand.' },
        { e: '👱‍♀️', s: 'His hand sticks to Gwen\'s hair at school.' },
        { e: '🧗', s: 'Miles can climb up walls like Spider-Man!' }
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
      goals: ['I can say what Mr Bean is doing.', 'I can say where he is.', 'I can tell the story: First, Then, Finally.'],
      predict: { q: 'The cartoon is called SUPER TROLLEY. What can a super trolley do?', opts: [['🚀', 'It can go very fast.'], ['🛸', 'It can fly.'], ['🎵', 'It can sing.']], note: 'There is no wrong answer. We will see!' },
      checkpoints: [
        { t: 42, q: 'What is Mr Bean eating?', opts: [['🥣', 'cereal'], ['🍕', 'pizza'], ['🍲', 'soup']], a: 0, say: 'Mr Bean is eating cereal.', hint: 'Look at the bowl and the spoon.' },
        { t: 86, q: 'Who is on the stairs with Mr Bean?', opts: [['👵', 'an old lady and a cat'], ['👮', 'a policeman'], ['👩‍⚕️', 'a doctor']], a: 0, say: 'An old lady and a cat are on the stairs.', hint: 'Look at the stairs.' },
        { t: 132, q: 'Where is Mr Bean now?', opts: [['🏫', 'at school'], ['🛒', 'at the shop'], ['🌳', 'at the park']], a: 1, say: 'Mr Bean is at the shop.', hint: 'Look at the big building and the cars.' },
        { t: 190, q: 'What is Mr Bean in?', opts: [['🚗', 'a car'], ['🚤', 'a boat'], ['🛒', 'a trolley']], a: 2, say: 'Mr Bean is in a trolley.', hint: 'It is the SUPER TROLLEY!' },
        { t: 250, q: 'Who is with Mr Bean?', opts: [['🧸', 'Teddy'], ['🐶', 'a dog'], ['👶', 'a baby']], a: 0, say: 'Teddy is with Mr Bean.', hint: 'It is his friend. It is brown.' },
        { t: 278, q: 'How does the shop lady feel?', opts: [['😴', 'sleepy'], ['😮', 'surprised'], ['😊', 'happy']], a: 1, say: 'The shop lady is surprised.', hint: 'Look at her face and her eyes.' },
        { t: 340, q: 'What is on the shelf?', opts: [['🥛', 'milk'], ['🧃', 'juice'], ['🥚', 'eggs']], a: 0, say: 'There is milk on the shelf.', hint: 'There is a cow on the box.' },
        { t: 525, q: 'What is Mr Bean driving?', opts: [['🚜', 'a yellow forklift'], ['🚌', 'a bus'], ['🚲', 'a bike']], a: 0, say: 'Mr Bean is driving a yellow forklift.', hint: 'It is yellow and it lifts big boxes.' },
        { t: 588, q: 'Where is Mr Bean going now?', opts: [['🏠', 'home'], ['🏫', 'to school'], ['🏖️', 'to the beach']], a: 0, say: 'Mr Bean is going home.', hint: 'He has the shopping. Look at the road.' },
        { t: 640, q: 'What is in the bowl at the end?', opts: [['🥣', 'cereal'], ['🍜', 'noodles'], ['🍰', 'cake']], a: 0, say: 'There is cereal in the bowl.', hint: 'It is the same food as at the start.' }
      ],
      retell: [
        { e: '🥣', s: 'Mr Bean eats cereal.' }, { e: '👵', s: 'He sees an old lady and a cat.' }, { e: '🛒', s: 'He goes to the shop.' },
        { e: '🧸', s: 'He pushes a trolley with Teddy.' }, { e: '🚜', s: 'He drives a forklift.' }, { e: '🏠', s: 'He goes home with the shopping.' }
      ]
    }
  ];
  return D;
})();
