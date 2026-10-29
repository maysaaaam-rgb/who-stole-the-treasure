/* Practice Island — Curriculum Data, Missions (Units 1-4, Grades 3 & 4), Star Path & Monster Items
   Uses existing Grade 3 & Grade 4 Units 1-4 content from the platform question banks. */
(function (root) {
  'use strict';

  var IslandData = root.IslandData = root.IslandData || {};

  IslandData.ZONES = [
    {
      num: 1,
      id: 'z1',
      badge: 'z_meadow',
      pos: { left: '22%', top: '26%' },
      pins: [
        { left: '14%', top: '34%' },
        { left: '18%', top: '38%' },
        { left: '22%', top: '40%' },
        { left: '26%', top: '38%' },
        { left: '30%', top: '34%' }
      ],
      chestPos: { left: '34%', top: '29%' },
      pinOffsets: [
        { dx: -78, dy: 52 },
        { dx: -38, dy: 68 },
        { dx: 4,   dy: 72 },
        { dx: 46,  dy: 66 },
        { dx: 84,  dy: 50 }
      ],
      chestOffset: { dx: 122, dy: 30 },
      starOffsets: [
        { dx: -90, dy: 96 },
        { dx: -54, dy: 106 },
        { dx: -18, dy: 112 },
        { dx: 18,  dy: 112 },
        { dx: 54,  dy: 106 },
        { dx: 90,  dy: 96 }
      ],
      titles: {
        3: { name: 'Sunny Meadow', sub: 'Unit 1 · What Does It Do?' },
        4: { name: 'Sunny Meadow', sub: 'Unit 1 · I Love Reading' }
      }
    },
    {
      num: 2,
      id: 'z2',
      badge: 'z_beach',
      pos: { left: '74%', top: '25%' },
      pins: [
        { left: '66%', top: '33%' },
        { left: '70%', top: '37%' },
        { left: '74%', top: '39%' },
        { left: '78%', top: '37%' },
        { left: '82%', top: '33%' }
      ],
      chestPos: { left: '86%', top: '28%' },
      pinOffsets: [
        { dx: -82, dy: 52 },
        { dx: -40, dy: 68 },
        { dx: 2,   dy: 72 },
        { dx: 44,  dy: 66 },
        { dx: 84,  dy: 50 }
      ],
      chestOffset: { dx: 120, dy: 28 },
      starOffsets: [
        { dx: -90, dy: 96 },
        { dx: -54, dy: 106 },
        { dx: -18, dy: 112 },
        { dx: 18,  dy: 112 },
        { dx: 54,  dy: 106 },
        { dx: 90,  dy: 96 }
      ],
      titles: {
        3: { name: 'Lighthouse Beach', sub: 'Unit 2 · Thank You' },
        4: { name: 'Lighthouse Beach', sub: 'Unit 2 · What Lives Here?' }
      }
    },
    {
      num: 3,
      id: 'z3',
      badge: 'z_forest',
      pos: { left: '25%', top: '68%' },
      pins: [
        { left: '17%', top: '76%' },
        { left: '21%', top: '80%' },
        { left: '25%', top: '82%' },
        { left: '29%', top: '80%' },
        { left: '33%', top: '76%' }
      ],
      chestPos: { left: '37%', top: '71%' },
      pinOffsets: [
        { dx: -80, dy: 48 },
        { dx: -38, dy: 64 },
        { dx: 4,   dy: 68 },
        { dx: 46,  dy: 62 },
        { dx: 84,  dy: 46 }
      ],
      chestOffset: { dx: 120, dy: 24 },
      starOffsets: [
        { dx: -90, dy: 92 },
        { dx: -54, dy: 102 },
        { dx: -18, dy: 108 },
        { dx: 18,  dy: 108 },
        { dx: 54,  dy: 102 },
        { dx: 90,  dy: 92 }
      ],
      titles: {
        3: { name: 'Treehouse Forest', sub: 'Unit 3 · How Much Is It?' },
        4: { name: 'Treehouse Forest', sub: 'Unit 3 · It Keeps Changing' }
      }
    },
    {
      num: 4,
      id: 'z4',
      badge: 'z_mountain',
      pos: { left: '75%', top: '67%' },
      pins: [
        { left: '67%', top: '75%' },
        { left: '71%', top: '79%' },
        { left: '75%', top: '81%' },
        { left: '79%', top: '79%' },
        { left: '83%', top: '75%' }
      ],
      chestPos: { left: '87%', top: '70%' },
      pinOffsets: [
        { dx: -82, dy: 48 },
        { dx: -40, dy: 64 },
        { dx: 2,   dy: 68 },
        { dx: 44,  dy: 62 },
        { dx: 82,  dy: 46 }
      ],
      chestOffset: { dx: 118, dy: 24 },
      starOffsets: [
        { dx: -90, dy: 92 },
        { dx: -54, dy: 102 },
        { dx: -18, dy: 108 },
        { dx: 18,  dy: 108 },
        { dx: 54,  dy: 102 },
        { dx: 90,  dy: 92 }
      ],
      titles: {
        3: { name: 'Volcano Peak', sub: 'Unit 4 · What Happened?' },
        4: { name: 'Volcano Peak', sub: 'Unit 4 · We Can Do It' }
      }
    }
  ];

  /* Structured Unit 1-4 curriculum bank for Grade 3 & Grade 4 */
  var CURRICULUM = {
    3: {
      1: {
        vocab: [
          { word: 'machine', pic: '⚙️', def: 'something with moving parts that does work', say: 'Clara builds a machine to clean her room.' },
          { word: 'invent', pic: '💡', def: 'make something new for the first time', say: 'Young inventors invent helpful machines.' },
          { word: 'tidy', pic: '🧹', def: 'clean and put things in their place', say: 'Please tidy your room and put the toys away.' },
          { word: 'mess', pic: '🧸', def: 'things scattered everywhere', say: 'My room is a mess! Toys are everywhere.' },
          { word: 'mirror', pic: '🪞', def: 'glass where you see your face', say: 'She looks in the shiny mirror.' },
          { word: 'plan', pic: '📐', def: 'a drawing or idea before you build', say: 'First, draw a careful plan on paper.' }
        ],
        read: [
          { q: 'My room is a ___. Toys are everywhere!', a: 'mess', w: ['plan', 'mirror'], pic: '🧸' },
          { q: 'Please ___ your room. Put the toys away.', a: 'tidy', w: ['invent', 'mess'], pic: '🧹' },
          { q: 'It does not work. Do not stop. ___ again!', a: 'Try', w: ['Sleep', 'Hide'], pic: '💪' },
          { q: 'Clara builds a ___ to clean her room.', a: 'machine', w: ['hexagon', 'mirror'], pic: '⚙️' },
          { q: 'What does "invent" mean?', a: 'make something new', w: ['eat your lunch', 'run very fast'], pic: '💡' },
          { q: 'A bicycle has two round ___.', a: 'wheels', w: ['mirrors', 'brooms'], pic: '🚲' }
        ],
        build: [
          { order: ['Clara', 'builds', 'a', 'machine'], pic: '⚙️' },
          { order: ['Please', 'tidy', 'your', 'room'], pic: '🧹' },
          { order: ['My', 'room', 'is', 'a', 'mess'], pic: '🧸' },
          { order: ['Do', 'not', 'stop', 'trying'], pic: '💪' },
          { order: ['She', 'makes', 'a', 'new', 'plan'], pic: '📐' },
          { order: ['What', 'does', 'this', 'machine', 'do'], pic: '🤖' }
        ],
        say: [
          { text: 'Clara builds a machine.', pic: '⚙️' },
          { text: 'Please tidy your room.', pic: '🧹' },
          { text: 'I can invent something new.', pic: '💡' },
          { text: 'First I draw a plan.', pic: '📐' },
          { text: 'Do not give up, try again!', pic: '🌟' },
          { text: 'This machine cleans the floor.', pic: '🤖' }
        ]
      },
      2: {
        vocab: [
          { word: 'harvest', pic: '🌾', def: 'picking ripe crops from the farm', say: 'Everyone is happy because harvest time is here.' },
          { word: 'thankful', pic: '🙏', def: 'happy and grateful for something good', say: 'I am thankful for my kind teacher.' },
          { word: 'moon', pic: '🌕', def: 'bright round light in the night sky', say: 'There is a bright full moon tonight.' },
          { word: 'potatoes', pic: '🥔', def: 'vegetables that grow under the soil', say: 'There are potatoes under the soil.' },
          { word: 'delicious', pic: '🍲', def: 'tastes very, very good', say: 'They are thankful for the delicious food.' },
          { word: 'pineapple', pic: '🍍', def: 'a sweet yellow tropical fruit', say: 'There is a sweet pineapple on the table.' }
        ],
        read: [
          { q: 'I am thankful ___ my kind teacher.', a: 'for', w: ['to', 'at'], pic: '🙏' },
          { q: 'They are thankful ___ the delicious food.', a: 'for', w: ['with', 'in'], pic: '🍲' },
          { q: 'There ___ a bright full moon in the sky tonight.', a: 'is', w: ['are', 'were'], pic: '🌕' },
          { q: 'There ___ pink potatoes under the soil.', a: 'are', w: ['is', 'am'], pic: '🥔' },
          { q: 'Can we ___ outside, Mom?', a: 'go', w: ['goes', 'going'], pic: '🌳' },
          { q: 'Why are they happy? ___ harvest time is here.', a: 'Because', w: ['So', 'Instead'], pic: '🌾' }
        ],
        build: [
          { order: ['I', 'am', 'thankful', 'for', 'my', 'family'], pic: '🙏' },
          { order: ['There', 'is', 'a', 'full', 'moon'], pic: '🌕' },
          { order: ['There', 'are', 'potatoes', 'in', 'the', 'soil'], pic: '🥔' },
          { order: ['The', 'food', 'is', 'very', 'delicious'], pic: '🍲' },
          { order: ['Can', 'we', 'go', 'outside'], pic: '🌳' },
          { order: ['Harvest', 'time', 'is', 'here'], pic: '🌾' }
        ],
        say: [
          { text: 'I am thankful for my family.', pic: '🙏' },
          { text: 'There is a bright full moon.', pic: '🌕' },
          { text: 'They share the delicious food.', pic: '🍲' },
          { text: 'There are potatoes under the soil.', pic: '🥔' },
          { text: 'Can we go outside and play?', pic: '🌳' },
          { text: 'Happy harvest festival everyone!', pic: '🌾' }
        ]
      },
      3: {
        vocab: [
          { word: 'barter', pic: '🤝', def: 'trade one thing for another without money', say: 'Long ago, people bartered a goat for grain.' },
          { word: 'expensive', pic: '💎', def: 'costs a lot of money', say: 'That shiny new phone is very expensive.' },
          { word: 'cashier', pic: '🧑‍💼', def: 'person who takes your money in a shop', say: 'The cashier takes your money in the store.' },
          { word: 'plastic', pic: '💳', def: 'light strong material used for credit cards', say: 'A credit card is made of plastic.' },
          { word: 'coins', pic: '🪙', def: 'small round pieces of metal money', say: 'Paper money is lighter than metal coins.' },
          { word: 'save', pic: '🐷', def: 'keep money for later', say: 'I save my coins in a piggy bank.' }
        ],
        read: [
          { q: 'Long ago, people ___ for things. They gave a goat for grain.', a: 'bartered', w: ['saved', 'painted'], pic: '🤝' },
          { q: 'A credit card is made of ___.', a: 'plastic', w: ['grain', 'shells'], pic: '💳' },
          { q: 'What does "expensive" mean?', a: 'costs a lot of money', w: ['costs no money', 'very small'], pic: '💎' },
          { q: 'The ___ takes your money in a shop.', a: 'cashier', w: ['farmer', 'goat'], pic: '🧑‍💼' },
          { q: 'Paige ___ through the park yesterday.', a: 'walked', w: ['walk', 'walking'], pic: '🏞️' },
          { q: 'Paper money is easier to carry ___ metal coins.', a: 'than', w: ['then', 'that'], pic: '🪙' }
        ],
        build: [
          { order: ['A', 'credit', 'card', 'is', 'plastic'], pic: '💳' },
          { order: ['The', 'cashier', 'takes', 'your', 'money'], pic: '🧑‍💼' },
          { order: ['This', 'phone', 'is', 'very', 'expensive'], pic: '💎' },
          { order: ['Paige', 'walked', 'through', 'the', 'park'], pic: '🏞️' },
          { order: ['I', 'save', 'my', 'gold', 'coins'], pic: '🪙' },
          { order: ['People', 'bartered', 'long', 'ago'], pic: '🤝' }
        ],
        say: [
          { text: 'How much is this book?', pic: '🪙' },
          { text: 'That toy is too expensive.', pic: '💎' },
          { text: 'The cashier works in the shop.', pic: '🧑‍💼' },
          { text: 'A credit card is made of plastic.', pic: '💳' },
          { text: 'I save my money every week.', pic: '🐷' },
          { text: 'Paper money is lighter than coins.', pic: '💵' }
        ]
      },
      4: {
        vocab: [
          { word: 'thunder', pic: '⛈️', def: 'a loud rumbling sound in a storm', say: 'The loud noises sounded like thunder.' },
          { word: 'sunrise', pic: '🌅', def: 'when the sun comes up in the morning', say: 'At sunrise the girl looked back at the island.' },
          { word: 'ship', pic: '🚢', def: 'a big boat that sails on the sea', say: 'At last a big ship saw them and they were safe.' },
          { word: 'museum', pic: '🏛️', def: 'a building where famous art is kept', say: 'The Mona Lisa hangs in the Louvre museum.' },
          { word: 'barked', pic: '🐕', def: 'made a loud dog sound', say: 'The dogs barked and the people shouted.' },
          { word: 'island', pic: '🏝️', def: 'land with water all around it', say: 'The family left the island by boat.' }
        ],
        read: [
          { q: 'The loud noises from the mountain sounded like ___.', a: 'thunder', w: ['music', 'rain'], pic: '⛈️' },
          { q: 'How did the family leave the island?', a: 'by boat', w: ['by train', 'by bus'], pic: '⛵' },
          { q: 'At ___ the girl looked back at the island.', a: 'sunrise', w: ['lunch', 'bedtime'], pic: '🌅' },
          { q: 'The dogs ___ and the people shouted.', a: 'barked', w: ['danced', 'sang'], pic: '🐕' },
          { q: 'At last a ___ saw them and they were safe.', a: 'ship', w: ['plane', 'bike'], pic: '🚢' },
          { q: 'The Mona Lisa went ___ to the Louvre museum.', a: 'home', w: ['under', 'quick'], pic: '🏛️' }
        ],
        build: [
          { order: ['The', 'family', 'left', 'by', 'boat'], pic: '⛵' },
          { order: ['The', 'dogs', 'barked', 'very', 'loudly'], pic: '🐕' },
          { order: ['A', 'big', 'ship', 'saw', 'them'], pic: '🚢' },
          { order: ['It', 'sounded', 'like', 'loud', 'thunder'], pic: '⛈️' },
          { order: ['She', 'looked', 'back', 'at', 'sunrise'], pic: '🌅' },
          { order: ['The', 'painting', 'is', 'in', 'the', 'museum'], pic: '🏛️' }
        ],
        say: [
          { text: 'The mountain made a loud noise.', pic: '🌋' },
          { text: 'The family left the island by boat.', pic: '⛵' },
          { text: 'At sunrise they saw the sky.', pic: '🌅' },
          { text: 'A big ship helped the family.', pic: '🚢' },
          { text: 'The Mona Lisa is a famous painting.', pic: '🖼️' },
          { text: 'It went home to the museum.', pic: '🏛️' }
        ]
      }
    },
    4: {
      1: {
        vocab: [
          { word: 'journey', pic: '🦋', def: 'a long trip from one place to another', say: 'Monarch butterflies go on a long journey.' },
          { word: 'visualize', pic: '💭', def: 'make pictures in your head while reading', say: 'When I read, I visualize the story.' },
          { word: 'freeze', pic: '🐇', def: 'stay completely still without moving', say: 'A rabbit sees danger and can freeze.' },
          { word: 'sleepy', pic: '😴', def: 'tired and ready to go to sleep', say: 'Alice was tired and sleepy by the river.' },
          { word: 'chase', pic: '🏃', def: 'run after someone to catch them', say: 'Alice ran to chase the White Rabbit.' },
          { word: 'curious', pic: '🔍', def: 'wanting to know and learn about things', say: 'Alice was very curious about the talking rabbit.' }
        ],
        read: [
          { q: 'A rabbit sees a predator. It stays very still. It can ___.', a: 'freeze', w: ['visualize', 'journey'], pic: '🐇' },
          { q: 'Every year, monarch butterflies go on a long ___.', a: 'journey', w: ['workout', 'shelf'], pic: '🦋' },
          { q: 'When I read, I ___ the story in my head.', a: 'visualize', w: ['freeze', 'chase'], pic: '💭' },
          { q: 'Alice was tired. She was ___.', a: 'sleepy', w: ['creative', 'chased'], pic: '😴' },
          { q: '___ did Alice chase? — A White Rabbit.', a: 'Who', w: ['Where', 'When'], pic: '🐇' },
          { q: '___ did Alice fall? — Down a deep rabbit hole.', a: 'Where', w: ['Who', 'Why'], pic: '🕳️' }
        ],
        build: [
          { order: ['Alice', 'chased', 'the', 'White', 'Rabbit'], pic: '🐇' },
          { order: ['Butterflies', 'go', 'on', 'a', 'journey'], pic: '🦋' },
          { order: ['I', 'visualize', 'the', 'story', 'pictures'], pic: '💭' },
          { order: ['Why', 'was', 'Alice', 'so', 'sleepy'], pic: '😴' },
          { order: ['Where', 'did', 'the', 'rabbit', 'go'], pic: '🕳️' },
          { order: ['A', 'rabbit', 'can', 'freeze', 'still'], pic: '🌿' }
        ],
        say: [
          { text: 'I love reading adventure stories.', pic: '📖' },
          { text: 'When I read, I visualize the story.', pic: '💭' },
          { text: 'Alice chased the White Rabbit.', pic: '🐇' },
          { text: 'Butterflies go on a long journey.', pic: '🦋' },
          { text: 'Where did Alice fall down?', pic: '🕳️' },
          { text: 'She was curious and brave.', pic: '🔍' }
        ]
      },
      2: {
        vocab: [
          { word: 'vet', pic: '🩺', def: 'a doctor who helps sick or hurt animals', say: 'A vet is a doctor who treats animals.' },
          { word: 'needle', pic: '🌲', def: 'a thin sharp leaf on a pine tree', say: 'A pine tree has green needles.' },
          { word: 'fur', pic: '🦊', def: 'thick soft hair on an animal body', say: 'Animals grow thick winter fur to stay warm.' },
          { word: 'cone', pic: ' pinecones'[0] === ' ' ? '🌲' : '🌲', def: 'holds the seeds of a pine tree', say: 'Pine trees make cones instead of flowers.' },
          { word: 'built', pic: '🦫', def: 'past tense of build', say: 'The clever beaver built a wooden home.' },
          { word: 'grew', pic: '🌱', def: 'past tense of grow', say: 'The tall green forest grew near the river.' }
        ],
        read: [
          { q: 'What does the word "vet" mean?', a: 'a doctor for animals', w: ['a deep ocean boat', 'a baking tool'], pic: '🩺' },
          { q: 'Pine trees produce cones instead ___ flowers.', a: 'of', w: ['to', 'for'], pic: '🌲' },
          { q: 'Animals grow thick winter fur ___ they can stay warm.', a: 'so', w: ['instead', 'because'], pic: '🦊' },
          { q: 'What is the past tense of the verb BUILD?', a: 'built', w: ['builded', 'building'], pic: '🦫' },
          { q: 'What is the past tense of the verb GROW?', a: 'grew', w: ['growed', 'growing'], pic: '🌱' },
          { q: 'What is the past tense of the verb GIVE?', a: 'gave', w: ['gived', 'giving'], pic: '🎁' }
        ],
        build: [
          { order: ['A', 'vet', 'helps', 'sick', 'animals'], pic: '🩺' },
          { order: ['Pine', 'trees', 'have', 'sharp', 'needles'], pic: '🌲' },
          { order: ['Animals', 'grow', 'thick', 'winter', 'fur'], pic: '🦊' },
          { order: ['The', 'beaver', 'built', 'a', 'home'], pic: '🦫' },
          { order: ['The', 'little', 'plant', 'grew', 'tall'], pic: '🌱' },
          { order: ['Cones', 'grow', 'instead', 'of', 'flowers'], pic: '🌲' }
        ],
        say: [
          { text: 'A vet helps sick animals.', pic: '🩺' },
          { text: 'Pine trees have green needles.', pic: '🌲' },
          { text: 'Animals grow thick fur in winter.', pic: '🦊' },
          { text: 'The beaver built a strong home.', pic: '🦫' },
          { text: 'The trees grew tall and green.', pic: '🌱' },
          { text: 'Many animals live in the forest.', pic: '🦌' }
        ]
      },
      3: {
        vocab: [
          { word: 'energy', pic: '⚡', def: 'power from electricity, fuel, or the sun', say: 'A car uses energy to move.' },
          { word: 'noisy', pic: '🔊', def: 'making a lot of loud sound', say: 'Old gasoline cars are loud and noisy.' },
          { word: 'thin', pic: '🧊', def: 'not thick and easy to break', say: 'After warm winters, the sea ice was thin.' },
          { word: 'trap', pic: '🕸️', def: 'a place you cannot get out of', say: 'Greenhouse gases trap heat in the air.' },
          { word: 'electric', pic: '🔋', def: 'running on battery power, not gasoline', say: 'Electric cars are quiet and clean.' },
          { word: 'polar', pic: '🐻‍❄️', def: 'living near the cold North Pole', say: 'Polar bears need thick sea ice.' }
        ],
        read: [
          { q: 'Gasoline cars are ___. They make a lot of sound.', a: 'noisy', w: ['quiet', 'slow'], pic: '🔊' },
          { q: 'A car uses ___ to move.', a: 'energy', w: ['wheels', 'trash'], pic: '⚡' },
          { q: 'What does "thin" mean?', a: 'not thick; easy to break', w: ['very big', 'very hot'], pic: '🧊' },
          { q: 'After many warm winters, the sea ice ___ thin.', a: 'was', w: ['were', 'are'], pic: '🐻‍❄️' },
          { q: 'Electric cars are clean, ___ they are expensive.', a: 'but', w: ['because', 'so'], pic: '🔋' },
          { q: 'I ride a bike ___ bikes do not make the air dirty.', a: 'because', w: ['but', 'then'], pic: '🚲' }
        ],
        build: [
          { order: ['A', 'car', 'uses', 'energy', 'to', 'move'], pic: '⚡' },
          { order: ['Gasoline', 'cars', 'are', 'very', 'noisy'], pic: '🔊' },
          { order: ['After', 'warm', 'winters', 'ice', 'was', 'thin'], pic: '🧊' },
          { order: ['Electric', 'cars', 'are', 'quiet', 'and', 'clean'], pic: '🔋' },
          { order: ['I', 'can', 'ride', 'my', 'bike'], pic: '🚲' },
          { order: ['Polar', 'bears', 'live', 'on', 'the', 'ice'], pic: '🐻‍❄️' }
        ],
        say: [
          { text: 'A car uses energy to move.', pic: '⚡' },
          { text: 'Electric cars are clean and quiet.', pic: '🔋' },
          { text: 'After warm winters, the ice was thin.', pic: '🧊' },
          { text: 'I ride my bike to school.', pic: '🚲' },
          { text: 'Bikes do not make the air dirty.', pic: '🌿' },
          { text: 'Let us help our changing planet!', pic: '🌍' }
        ]
      },
      4: {
        vocab: [
          { word: 'teamwork', pic: '🤝', def: 'working together as a group to succeed', say: 'Teamwork makes the dream work!' },
          { word: 'championship', pic: '🏆', def: 'the final game to find the best team', say: 'The Sparks won the championship trophy.' },
          { word: 'court', pic: '🏀', def: 'the floor where basketball is played', say: 'Five players from each team are on the court.' },
          { word: 'platform', pic: '🚉', def: 'the place where you wait for a train', say: 'Everybody waited on the train platform.' },
          { word: 'perform', pic: '🎭', def: 'sing, dance, or act in a show', say: 'Why do not we perform the show right here?' },
          { word: 'league', pic: '🥇', def: 'a group of sports teams that play each other', say: 'There are twelve teams in the basketball league.' }
        ],
        read: [
          { q: 'How many players from each team are on the court?', a: 'five', w: ['ten', 'two'], pic: '🏀' },
          { q: 'A basket from far away is worth ___.', a: 'three points', w: ['two points', 'one point'], pic: '🎯' },
          { q: 'What did the Sparks win Together?', a: 'the championship', w: ['a train', 'a bus'], pic: '🏆' },
          { q: 'Teamwork makes the dream ___.', a: 'work', w: ['walk', 'sleep'], pic: '🤝' },
          { q: 'Harry was late ___ the train stopped.', a: 'because', w: ['but', 'or'], pic: '🚇' },
          { q: 'Lynn had an idea: "Why don\'t we ___ the show here?"', a: 'perform', w: ['cancel', 'forget'], pic: '🎭' }
        ],
        build: [
          { order: ['Teamwork', 'makes', 'the', 'dream', 'work'], pic: '🤝' },
          { order: ['Five', 'players', 'are', 'on', 'the', 'court'], pic: '🏀' },
          { order: ['They', 'won', 'the', 'big', 'championship'], pic: '🏆' },
          { order: ['Harry', 'was', 'late', 'because', 'of', 'traffic'], pic: '🚗' },
          { order: ['People', 'waited', 'on', 'the', 'train', 'platform'], pic: '🚉' },
          { order: ['Let', 'us', 'perform', 'the', 'show', 'here'], pic: '🎭' }
        ],
        say: [
          { text: 'Teamwork makes the dream work!', pic: '🤝' },
          { text: 'Five players are on the basketball court.', pic: '🏀' },
          { text: 'They worked hard and won the championship.', pic: '🏆' },
          { text: 'Harry was late because the train stopped.', pic: '🚇' },
          { text: 'Everybody waited on the train platform.', pic: '🚉' },
          { text: 'We can do it when we work together!', pic: '🌟' }
        ]
      }
    }
  };

  IslandData.CURRICULUM = CURRICULUM;

  /* Pull items from live loaded Game Maker sets (u14-g3, u14-g4, u1-g3..u4-g4) when present */
  IslandData.getGMUnitItems = function (grade, zoneNum) {
    var sets = (root.GM && Array.isArray(root.GM.sets)) ? root.GM.sets : [];
    var unitId = 'u' + zoneNum + '-g' + grade;
    var found = sets.filter(function (s) { return s && s.id === unitId; })[0];
    if (found && Array.isArray(found.items) && found.items.length) return found.items;
    var mixId = 'u14-g' + grade;
    var mixSet = sets.filter(function (s) { return s && s.id === mixId; })[0];
    if (mixSet && Array.isArray(mixSet.items)) {
      return mixSet.items.filter(function (it) { return !it.unit || Number(it.unit) === Number(zoneNum); });
    }
    return [];
  };

  /* Build the 5 regular missions + 6 Star Path missions for a given grade (3 or 4) and zone number (1..4) */
  IslandData.getZoneMissions = function (grade, zoneNum, isStar) {
    var g = Number(grade) === 4 ? 4 : 3;
    var z = Math.max(1, Math.min(4, Number(zoneNum) || 1));
    var unit = CURRICULUM[g][z];
    var prefix = 'g' + g + '-z' + z;

    var listenQs = unit.vocab.map(function (v, idx) {
      var distractors = unit.vocab.filter(function (_, i) { return i !== idx; }).map(function (x) { return x.word; });
      return {
        type: 'listen',
        prompt: 'Listen and tap the word you hear!',
        speak: v.word + '. ' + v.say,
        word: v.word,
        pic: v.pic,
        a: v.word,
        options: [v.word, distractors[0], distractors[1], distractors[2]].filter(Boolean)
      };
    });

    var matchQs = unit.vocab.map(function (v, idx) {
      return {
        word: v.word,
        pic: v.pic,
        meaning: v.pic + ' ' + v.def,
        say: v.word
      };
    });

    var readQs = unit.read.map(function (r) {
      var pool = unit.vocab.map(function (x) { return x.word; }).filter(function (w) { return w !== r.a && r.w.indexOf(w) === -1; });
      var opts = [r.a].concat(r.w);
      while (opts.length < 4 && pool.length) {
        opts.push(pool.shift());
      }
      return {
        type: 'read',
        q: r.q,
        a: r.a,
        options: opts,
        pic: r.pic || '📖',
        speak: r.q.replace(/___+/g, r.a)
      };
    });

    var buildQs = unit.build.map(function (b) {
      return {
        type: 'build',
        order: b.order.slice(),
        a: b.order.join(' '),
        pic: b.pic || '🧩',
        speak: b.order.join(' ')
      };
    });

    var sayQs = unit.say.map(function (s) {
      return {
        type: 'say',
        text: s.text,
        pic: s.pic || '🎤',
        speak: s.text
      };
    });

    var regular = [
      { id: prefix + '-m1', num: 1, type: 'listen', title: 'Listen & Tap', icon: '🎧', questions: listenQs.slice(0, 6) },
      { id: prefix + '-m2', num: 2, type: 'match',  title: 'Word Match',   icon: '🃏', pairs: matchQs.slice(0, 6), questions: matchQs.slice(0, 6) },
      { id: prefix + '-m3', num: 3, type: 'read',   title: 'Read & Choose', icon: '📖', questions: readQs.slice(0, 6) },
      { id: prefix + '-m4', num: 4, type: 'build',  title: 'Build the Sentence', icon: '🧩', questions: buildQs.slice(0, 6) },
      { id: prefix + '-m5', num: 5, type: 'say',    title: 'Say It Aloud', icon: '🎤', questions: sayQs.slice(0, 6) }
    ];

    if (!isStar) {
      return {
        regular: regular,
        star: []
      };
    }

    /* 6 Star Path stepping-stone missions (4 questions each, 3 options instead of 4, voice reads question and answers, starter word placed for build) */
    var starListen1 = listenQs.slice(0, 4).map(function (q) {
      return Object.assign({}, q, { options: q.options.slice(0, 3), autoSpeak: true });
    });
    var starMatch2 = matchQs.slice(0, 4);
    var starRead3 = readQs.slice(0, 4).map(function (q) {
      return Object.assign({}, q, { options: q.options.slice(0, 3), autoSpeak: true });
    });
    var starBuild4 = buildQs.slice(0, 4).map(function (q) {
      var shortOrder = q.order.length > 4 ? q.order.slice(0, 4) : q.order.slice();
      return {
        type: 'build',
        order: shortOrder,
        a: shortOrder.join(' '),
        pic: q.pic,
        speak: shortOrder.join(' '),
        autoSpeak: true,
        starterFirstWord: true
      };
    });
    var starListen5 = readQs.slice(2, 6).map(function (q) {
      return {
        type: 'listen',
        prompt: q.q,
        speak: q.speak,
        word: q.a,
        pic: q.pic,
        a: q.a,
        options: q.options.slice(0, 3),
        autoSpeak: true
      };
    });
    var starSay6 = sayQs.slice(0, 4).map(function (q) {
      return Object.assign({}, q, { autoSpeak: true });
    });

    var starPath = [
      { id: prefix + '-s1', num: 1, isStar: true, type: 'listen', title: 'Star Step 1 · Core Words', icon: '⭐', questions: starListen1 },
      { id: prefix + '-s2', num: 2, isStar: true, type: 'match',  title: 'Star Step 2 · Picture Match', icon: '⭐', pairs: starMatch2, questions: starMatch2 },
      { id: prefix + '-s3', num: 3, isStar: true, type: 'read',   title: 'Star Step 3 · Key Pattern', icon: '⭐', questions: starRead3 },
      { id: prefix + '-s4', num: 4, isStar: true, type: 'build',  title: 'Star Step 4 · Sentence Builder', icon: '⭐', questions: starBuild4 },
      { id: prefix + '-s5', num: 5, isStar: true, type: 'listen', title: 'Star Step 5 · Story Check', icon: '⭐', questions: starListen5 },
      { id: prefix + '-s6', num: 6, isStar: true, type: 'say',    title: 'Star Step 6 · Speak & Shine', icon: '⭐', questions: starSay6 }
    ];

    return {
      regular: regular,
      star: starPath
    };
  };

  /* Deterministic Daily Quest (5 mixed questions: mostly previous wrong questions + unlocked zone questions) */
  IslandData.getDailyQuest = function (grade, dateStr, unlockedZonesCount, wrongQueue) {
    var g = Number(grade) === 4 ? 4 : 3;
    var maxZ = Math.max(1, Math.min(4, unlockedZonesCount || 1));
    var pool = [];
    for (var z = 1; z <= maxZ; z++) {
      var m = IslandData.getZoneMissions(g, z).regular;
      m[0].questions.forEach(function (q) { pool.push(q); });
      m[2].questions.forEach(function (q) { pool.push(q); });
    }
    var chosen = [];
    var seenKey = {};
    if (Array.isArray(wrongQueue) && wrongQueue.length > 0) {
      wrongQueue.slice(-3).forEach(function (wq) {
        if (wq && (wq.q || wq.word) && chosen.length < 3) {
          var k = wq.q || wq.word;
          if (!seenKey[k]) {
            chosen.push(wq);
            seenKey[k] = true;
          }
        }
      });
    }
    var seed = 0;
    var s = String(dateStr || '2026-10-29');
    for (var i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) % 9973;
    for (var step = 0; step < pool.length && chosen.length < 5; step++) {
      var cand = pool[(seed + step * 7) % pool.length];
      var ck = cand.q || cand.word || String(step);
      if (!seenKey[ck]) {
        chosen.push(cand);
        seenKey[ck] = true;
      }
    }
    return {
      id: 'daily-' + s,
      title: 'Today\'s Island Quest',
      icon: '🎁',
      isDaily: true,
      questions: chosen
    };
  };

  /* Monster Dressing Room Catalog (mirrors school-store.js DEFAULT_MONSTER_ITEMS + costumes + pets) */
  IslandData.MONSTER_CATEGORIES = [
    { id: 'hat',       label: 'Hats',      slot: 'hat',       icon: '🎩' },
    { id: 'glasses',   label: 'Glasses',   slot: 'glasses',   icon: '🕶️' },
    { id: 'accessory', label: 'Extras',    slot: 'accessory', icon: '🎀' },
    { id: 'clothing',  label: 'Outfits',   slot: 'clothing',  icon: '👕' },
    { id: 'backpack',  label: 'Back',      slot: 'backpack',  icon: '🎒' },
    { id: 'aura',      label: 'Auras',     slot: 'aura',      icon: '✨' },
    { id: 'pet',       label: 'Pets',      slot: 'pet',       icon: '🐾' }
  ];

  IslandData.BASE_MONSTER_ITEMS = [
    { id: 'hat-bow', name: 'Cute Bow', category: 'hat', icon: '🎀', unlockType: 'level', unlockLevel: 2 },
    { id: 'hat-flower', name: 'Blossom Flower', category: 'hat', icon: '🌸', unlockType: 'level', unlockLevel: 2 },
    { id: 'hat-party', name: 'Party Hat', category: 'hat', icon: '🎉', unlockType: 'level', unlockLevel: 2 },
    { id: 'hat-beanie', name: 'Cosy Beanie', category: 'hat', icon: '🧶', unlockType: 'level', unlockLevel: 2 },
    { id: 'hat-star-clip', name: 'Star Clip', category: 'hat', icon: '⭐', unlockType: 'level', unlockLevel: 3 },
    { id: 'hat-chef', name: 'Chef Hat', category: 'hat', icon: '👨‍🍳', unlockType: 'level', unlockLevel: 3 },
    { id: 'hat-sailor', name: 'Sailor Cap', category: 'hat', icon: '⚓', unlockType: 'level', unlockLevel: 3 },
    { id: 'hat-propeller', name: 'Propeller Cap', category: 'hat', icon: '🚁', unlockType: 'level', unlockLevel: 3 },
    { id: 'hat-scholar', name: 'Scholar Cap', category: 'hat', icon: '🎓', unlockType: 'level', unlockLevel: 4 },
    { id: 'hat-headband', name: 'Hero Headband', category: 'hat', icon: '🎗️', unlockType: 'level', unlockLevel: 4 },
    { id: 'hat-cowboy', name: 'Cowboy Hat', category: 'hat', icon: '🤠', unlockType: 'level', unlockLevel: 4 },
    { id: 'hat-pirate', name: 'Pirate Hat', category: 'hat', icon: '🏴‍☠️', unlockType: 'level', unlockLevel: 4 },
    { id: 'hat-explorer', name: 'Explorer Fedora', category: 'hat', icon: '🤠', unlockType: 'level', unlockLevel: 5 },
    { id: 'hat-tophat', name: 'Top Hat', category: 'hat', icon: '🎩', unlockType: 'level', unlockLevel: 5 },
    { id: 'hat-wizard', name: 'Wizard Hat', category: 'hat', icon: '🧙', unlockType: 'level', unlockLevel: 6 },
    { id: 'hat-astro', name: 'Space Cap', category: 'hat', icon: '🚀', unlockType: 'level', unlockLevel: 6 },
    { id: 'hat-crown', name: 'Royal Crown', category: 'hat', icon: '👑', unlockType: 'level', unlockLevel: 7 },

    { id: 'glasses-star', name: 'Star Glasses', category: 'glasses', icon: '🌟', unlockType: 'level', unlockLevel: 2 },
    { id: 'glasses-heart', name: 'Heart Glasses', category: 'glasses', icon: '❤️', unlockType: 'level', unlockLevel: 2 },
    { id: 'glasses-round', name: 'Round Glasses', category: 'glasses', icon: '👓', unlockType: 'level', unlockLevel: 3 },
    { id: 'glasses-sun', name: 'Cool Sunglasses', category: 'glasses', icon: '😎', unlockType: 'level', unlockLevel: 3 },

    { id: 'neck-bowtie', name: 'Polka Bow Tie', category: 'accessory', icon: '🎀', unlockType: 'level', unlockLevel: 2 },
    { id: 'neck-bell', name: 'Bell Collar', category: 'accessory', icon: '🔔', unlockType: 'level', unlockLevel: 2 },
    { id: 'neck-badge', name: 'Academy Badge', category: 'accessory', icon: '🔰', unlockType: 'level', unlockLevel: 2 },
    { id: 'acc-balloon', name: 'Red Balloon', category: 'accessory', icon: '🎈', unlockType: 'level', unlockLevel: 2 },
    { id: 'acc-icecream', name: 'Ice Cream', category: 'accessory', icon: '🍦', unlockType: 'level', unlockLevel: 2 },
    { id: 'acc-pencil', name: 'Big Pencil', category: 'accessory', icon: '✏️', unlockType: 'level', unlockLevel: 2 },
    { id: 'neck-bandana', name: 'Blue Bandana', category: 'accessory', icon: '🧣', unlockType: 'level', unlockLevel: 3 },
    { id: 'neck-star', name: 'Star Necklace', category: 'accessory', icon: '⭐', unlockType: 'level', unlockLevel: 3 },
    { id: 'acc-book', name: 'Spellbook', category: 'accessory', icon: '📖', unlockType: 'level', unlockLevel: 3 },
    { id: 'acc-ball', name: 'Football', category: 'accessory', icon: '⚽', unlockType: 'level', unlockLevel: 3 },
    { id: 'acc-paintbrush', name: 'Paintbrush', category: 'accessory', icon: '🖌️', unlockType: 'level', unlockLevel: 3 },
    { id: 'acc-compass', name: 'Explorer Compass', category: 'accessory', icon: '🧭', unlockType: 'level', unlockLevel: 4 },
    { id: 'acc-magnifier', name: 'Magnifying Glass', category: 'accessory', icon: '🔍', unlockType: 'level', unlockLevel: 4 },
    { id: 'neck-medal', name: 'Adventure Medal', category: 'accessory', icon: '🏅', unlockType: 'level', unlockLevel: 5 },
    { id: 'acc-wand', name: 'Magic Wand', category: 'accessory', icon: '🪄', unlockType: 'level', unlockLevel: 5 },
    { id: 'acc-trophy', name: 'Golden Trophy', category: 'accessory', icon: '🏆', unlockType: 'level', unlockLevel: 7 },

    { id: 'clothing-scarf', name: 'Academy Uniform', category: 'clothing', icon: '🧣', unlockType: 'default', unlockLevel: 1 },
    { id: 'clothing-hoodie', name: 'Student Hoodie', category: 'clothing', icon: '👕', unlockType: 'level', unlockLevel: 3 },
    { id: 'clothing-winter', name: 'Winter Outfit', category: 'clothing', icon: '🧤', unlockType: 'level', unlockLevel: 3 },
    { id: 'clothing-vest', name: 'Explorer Vest', category: 'clothing', icon: '🦺', unlockType: 'level', unlockLevel: 4 },
    { id: 'clothing-adv-jacket', name: 'Explorer Jacket', category: 'clothing', icon: '🧥', unlockType: 'level', unlockLevel: 4 },
    { id: 'clothing-school-jacket', name: 'School Jacket', category: 'clothing', icon: '🥋', unlockType: 'level', unlockLevel: 4 },
    { id: 'clothing-cape', name: 'Adventure Cape', category: 'clothing', icon: '🦸', unlockType: 'level', unlockLevel: 5 },
    { id: 'clothing-hero', name: 'Hero Costume', category: 'clothing', icon: '⚡', unlockType: 'level', unlockLevel: 5 },
    { id: 'clothing-knight-armor', name: 'Knight Armor', category: 'clothing', icon: '🛡️', unlockType: 'level', unlockLevel: 5 },
    { id: 'clothing-robe', name: 'Wizard Outfit', category: 'clothing', icon: '👘', unlockType: 'level', unlockLevel: 6 },
    { id: 'clothing-space', name: 'Space Suit', category: 'clothing', icon: '👨‍🚀', unlockType: 'level', unlockLevel: 6 },
    { id: 'clothing-royal-robe', name: 'Royal Robe', category: 'clothing', icon: '👑', unlockType: 'level', unlockLevel: 7 },

    { id: 'bp-adv-bag', name: 'Adventure Bag', category: 'backpack', icon: '👜', unlockType: 'level', unlockLevel: 3 },
    { id: 'bp-mini-wings', name: 'Mini Wings', category: 'backpack', icon: '🪽', unlockType: 'level', unlockLevel: 4 },
    { id: 'bp-explorer', name: 'Explorer Backpack', category: 'backpack', icon: '🎒', unlockType: 'level', unlockLevel: 5 },
    { id: 'bp-book', name: 'Magic Backpack', category: 'backpack', icon: '📚', unlockType: 'level', unlockLevel: 6 },

    { id: 'aura-sparkle', name: 'Sparkle Aura', category: 'aura', icon: '🌟', unlockType: 'default', unlockLevel: 1 },
    { id: 'aura-blossom', name: 'Blossom Aura', category: 'aura', icon: '🌸', unlockType: 'level', unlockLevel: 3 },
    { id: 'aura-flame', name: 'Flame Aura', category: 'aura', icon: '🔥', unlockType: 'level', unlockLevel: 4 },
    { id: 'aura-ice', name: 'Ice Aura', category: 'aura', icon: '❄️', unlockType: 'level', unlockLevel: 4 },
    { id: 'aura-star', name: 'Star Aura', category: 'aura', icon: '⭐', unlockType: 'level', unlockLevel: 4 },
    { id: 'aura-lightning', name: 'Lightning Aura', category: 'aura', icon: '⚡', unlockType: 'level', unlockLevel: 5 },
    { id: 'aura-rainbow', name: 'Rainbow Aura', category: 'aura', icon: '🌈', unlockType: 'level', unlockLevel: 6 },
    { id: 'aura-cosmic', name: 'Galaxy Aura', category: 'aura', icon: '🌌', unlockType: 'level', unlockLevel: 7 }
  ];

  IslandData.getAllMonsterItems = function () {
    var list = IslandData.BASE_MONSTER_ITEMS.slice();
    var seen = {};
    list.forEach(function (it) { seen[it.id] = true; });
    if (root.MonsterCostumes && Array.isArray(root.MonsterCostumes.ITEMS)) {
      root.MonsterCostumes.ITEMS.forEach(function (it) {
        if (!seen[it.id]) {
          list.push({
            id: it.id,
            name: it.name,
            category: it.category,
            icon: it.icon || '🎭',
            unlockType: 'store',
            unlockLevel: 1
          });
          seen[it.id] = true;
        }
      });
    }
    if (root.MonsterPets && Array.isArray(root.MonsterPets.ITEMS)) {
      root.MonsterPets.ITEMS.forEach(function (it) {
        if (!seen[it.id]) {
          list.push({
            id: it.id,
            name: it.name,
            category: 'pet',
            icon: it.icon || '🐾',
            unlockType: 'store',
            unlockLevel: 1,
            imageSrc: it.imageSrc
          });
          seen[it.id] = true;
        }
      });
    }
    return list;
  };

  /* 3 Fake Demo Pupils for ?demo=1 (never touches Supabase) */
  IslandData.DEMO_PUPILS = {
    'demo-g3': {
      id: 'demo-g3',
      name: 'Test Pupil 3',
      firstName: 'Test Pupil 3',
      className: '3A',
      grade: 3,
      totalXP: 250,
      star: false,
      cap: 30,
      monsterProfile: {
        baseColor: 'blue',
        equipped: { hat: 'hat-bow', clothing: 'clothing-scarf', aura: 'aura-sparkle' },
        unlockedItems: ['cs-chef-hat', 'pet-crew-orange']
      }
    },
    'demo-g4': {
      id: 'demo-g4',
      name: 'Test Pupil 4',
      firstName: 'Test Pupil 4',
      className: '4A',
      grade: 4,
      totalXP: 1200,
      star: false,
      cap: 30,
      monsterProfile: {
        baseColor: 'orange',
        equipped: { hat: 'hat-explorer', glasses: 'glasses-sun', clothing: 'clothing-vest', aura: 'aura-flame' },
        unlockedItems: ['cs-space-helmet', 'cs-space-suit', 'pet-crew-cyan']
      }
    },
    'demo-star': {
      id: 'demo-star',
      name: 'Test Pupil Star',
      firstName: 'Test Pupil Star',
      className: '3B',
      grade: 3,
      totalXP: 320,
      star: true,
      cap: 45,
      monsterProfile: {
        baseColor: 'purple',
        equipped: { hat: 'hat-star-clip', clothing: 'clothing-hoodie', aura: 'aura-blossom' },
        unlockedItems: ['pet-crew-orange']
      }
    }
  };

})(typeof window !== 'undefined' ? window : this);
