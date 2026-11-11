/**
 * Grade 4 • Unit 5: Make Some Noise — "Sound Detectives"
 * Curriculum & Mission Data (Global Readings Level 3, pp. 72–87)
 */
(function () {
  'use strict';

  window.SD_DATA = {
    title: 'Sound Detectives',
    unit: 'Grade 4 • Unit 5: Make Some Noise',
    mascotName: 'Inspector Foxy',
    mascotImg: 'img/fox-detective.webp',
    teams: [
      { id: 'dragon', name: 'Dragon', emoji: '🐉', color: '#f43f5e' },
      { id: 'phoenix', name: 'Phoenix', emoji: '🦅', color: '#f59e0b' },
      { id: 'tiger', name: 'Tiger', emoji: '🐯', color: '#38bdf8' },
      { id: 'wolf', name: 'Wolf', emoji: '🐺', color: '#10b981' }
    ],

    missions: [
      {
        id: 1,
        num: 'Mission 1',
        title: 'Sound Detective',
        subtitle: 'Listen to 3 Foley clues and find the secret sound tool!',
        img: 'img/coconuts.webp',
        emoji: '🥥',
        intro: 'Welcome, Sound Detectives! In a film studio, Foley artists make realistic sounds using everyday things. Listen to my clues and pick the right tool! Use fewer clues to win 3 stars!'
      },
      {
        id: 2,
        num: 'Mission 2',
        title: 'Sound Effects Studio',
        subtitle: 'Watch the silent film scene and add the right sound effect!',
        img: 'img/foley-artist.webp',
        emoji: '🎬',
        intro: 'Step into the Foley Studio! Watch the silent movie scene on the big screen. Tap or drag the matching sound-effect button onto the screen to bring the movie to life!'
      },
      {
        id: 3,
        num: 'Mission 3',
        title: 'Loud or Quiet?',
        subtitle: 'Listen closely! Is the sound LOUD 📢 or QUIET 🤫?',
        img: 'img/drum.webp',
        emoji: '🥁',
        intro: 'Some sounds are very loud, and some sounds are very quiet! Listen to each sound and look at the picture. Tap LOUD or QUIET!'
      },
      {
        id: 4,
        num: 'Mission 4',
        title: 'Where Are They?',
        subtitle: 'Label the Concert Hall stage, orchestra, and Beethoven!',
        img: 'img/orchestra.webp',
        emoji: '🎻',
        intro: 'Tonight is the big concert at the theater! Tap or drag each word label to the right place in the Concert Hall!'
      },
      {
        id: 5,
        num: 'Mission 5',
        title: 'The Two Doors',
        subtitle: 'Sort each clue into The World of Foley 🎬 or Beethoven’s World 🎹!',
        img: 'img/two-doors.webp',
        emoji: '🚪',
        intro: 'Look at the Two Magical Doors! One door opens to The World of Foley, and the other opens to Beethoven’s World. Send each card through the right door!'
      },
      {
        id: 6,
        num: 'Mission 6',
        title: 'Put the Events in Order',
        subtitle: 'Order the 6 story moments from Beethoven’s 9th Symphony!',
        img: 'img/beethoven-bow.webp',
        emoji: '🎼',
        intro: 'Oh no! The pages of Beethoven’s 9th story are mixed up! Put the 6 story cards in order from 1 to 6!'
      },
      {
        id: 7,
        num: 'Mission 7',
        title: 'How Does He Feel?',
        subtitle: 'Listen to the music and story, then choose the right feeling!',
        img: 'img/deaf.webp',
        emoji: '😊',
        intro: 'Music can make us feel happy, sad, surprised, or worried! Listen to the music and read the story moment. How does the character feel?'
      }
    ],

    // MISSION 1: Sound Detective (6 Rounds matching Global Readings Level 3 pp. 74-77)
    m1: [
      {
        id: 'r1',
        soundName: 'A Horse Walking (Clip-Clop!)',
        sfx: 'horse',
        answerId: 'coconuts',
        clues: [
          'Clue 1: You hear this clip-clop sound when a horse walks in a film.',
          'Clue 2: The Foley artist holds two brown shells in their hands.',
          'Clue 3: We bang two pieces of coconut together in front of the microphone!'
        ],
        options: [
          { id: 'coconuts', label: 'Two Pieces of Coconut', img: 'img/coconuts.webp', emoji: '🥥' },
          { id: 'metal', label: 'Thin Piece of Metal', img: 'img/metal-sheet.webp', emoji: '⚡' },
          { id: 'lettuce', label: 'A Head of Lettuce', img: 'img/lettuce.webp', emoji: '🥬' },
          { id: 'chair', label: 'An Old Wooden Chair', img: 'img/old-chair.webp', emoji: '🪑' }
        ]
      },
      {
        id: 'r2',
        soundName: 'Thunder in a Big Storm (Boom!)',
        sfx: 'thunder',
        answerId: 'metal',
        clues: [
          'Clue 1: This loud booming sound comes during a dark rainy storm.',
          'Clue 2: There is no rain in the studio! The artist shakes something shiny.',
          'Clue 3: Moving a thin piece of metal makes the sound of thunder!'
        ],
        options: [
          { id: 'keys', label: 'Metal Keys', img: 'img/keys.webp', emoji: '🔑' },
          { id: 'metal', label: 'Thin Piece of Metal', img: 'img/metal-sheet.webp', emoji: '⚡' },
          { id: 'book', label: 'A Big Book', img: 'img/big-book.webp', emoji: '📕' },
          { id: 'coconuts', label: 'Two Pieces of Coconut', img: 'img/coconuts.webp', emoji: '🥥' }
        ]
      },
      {
        id: 'r3',
        soundName: 'A Knight Marching in Armor (Clink-Clank!)',
        sfx: 'keys',
        answerId: 'keys',
        clues: [
          'Clue 1: In the castle film, a brave knight marches in heavy metal armor.',
          'Clue 2: The Foley artist does not wear real armor in the studio.',
          'Clue 3: Shaking metal keys on a ring sounds just like a marching knight!'
        ],
        options: [
          { id: 'shoes', label: 'Shoes on Wood', img: 'img/wooden-shoes.webp', emoji: '👞' },
          { id: 'lettuce', label: 'A Head of Lettuce', img: 'img/lettuce.webp', emoji: '🥬' },
          { id: 'keys', label: 'Shaking Metal Keys', img: 'img/keys.webp', emoji: '🔑' },
          { id: 'chair', label: 'An Old Chair', img: 'img/old-chair.webp', emoji: '🪑' }
        ]
      },
      {
        id: 'r4',
        soundName: 'A Soft Crunch Sound (Crunch!)',
        sfx: 'crunch',
        answerId: 'lettuce',
        clues: [
          'Clue 1: You hear this crisp, soft crunch sound in nature and food scenes.',
          'Clue 2: The Foley artist uses a fresh green vegetable from the kitchen!',
          'Clue 3: Squeezing a head of lettuce makes a realistic soft crunch!'
        ],
        options: [
          { id: 'lettuce', label: 'A Head of Lettuce', img: 'img/lettuce.webp', emoji: '🥬' },
          { id: 'book', label: 'A Big Book', img: 'img/big-book.webp', emoji: '📕' },
          { id: 'coconuts', label: 'Two Pieces of Coconut', img: 'img/coconuts.webp', emoji: '🥥' },
          { id: 'metal', label: 'Thin Piece of Metal', img: 'img/metal-sheet.webp', emoji: '⚡' }
        ]
      },
      {
        id: 'r5',
        soundName: 'A Loud Squeak (Squeak-Creak!)',
        sfx: 'creak',
        answerId: 'chair',
        clues: [
          'Clue 1: An old castle door or wooden floor makes a spooky squeak!',
          'Clue 2: It is made of wood and you can sit on it.',
          'Clue 3: Rocking an old wooden chair makes a loud squeak!'
        ],
        options: [
          { id: 'keys', label: 'Metal Keys', img: 'img/keys.webp', emoji: '🔑' },
          { id: 'chair', label: 'An Old Wooden Chair', img: 'img/old-chair.webp', emoji: '🪑' },
          { id: 'shoes', label: 'Shoes on Wood', img: 'img/wooden-shoes.webp', emoji: '👞' },
          { id: 'lettuce', label: 'A Head of Lettuce', img: 'img/lettuce.webp', emoji: '🥬' }
        ]
      },
      {
        id: 'r6',
        soundName: 'A Action Punch Sound (Whack!)',
        sfx: 'punch',
        answerId: 'book',
        clues: [
          'Clue 1: In a superhero or action film, you hear a sharp pop and thud!',
          'Clue 2: Nobody gets hurt! The Foley artist holds something with pages.',
          'Clue 3: Closing a big book quickly makes a strong punch sound!'
        ],
        options: [
          { id: 'book', label: 'Closing a Big Book', img: 'img/big-book.webp', emoji: '📕' },
          { id: 'coconuts', label: 'Two Pieces of Coconut', img: 'img/coconuts.webp', emoji: '🥥' },
          { id: 'metal', label: 'Thin Piece of Metal', img: 'img/metal-sheet.webp', emoji: '⚡' },
          { id: 'keys', label: 'Metal Keys', img: 'img/keys.webp', emoji: '🔑' }
        ]
      }
    ],

    // MISSION 2: Sound Effects Studio (5 Animated/Video Scenes)
    m2: {
      bank: [
        { id: 'swords', label: 'Swords Clashing', tool: 'Metal Blades', emoji: '⚔️', sfx: 'swords' },
        { id: 'horse', label: 'Horse Hooves', tool: 'Coconut Halves', emoji: '🥥', sfx: 'horse' },
        { id: 'creak', label: 'Loud Squeak', tool: 'Old Wooden Chair', emoji: '🪑', sfx: 'creak' },
        { id: 'thunder', label: 'Big Thunder', tool: 'Thin Metal Sheet', emoji: '⚡', sfx: 'thunder' },
        { id: 'footsteps', label: 'Footsteps', tool: 'Shoes on Wood Floor', emoji: '👞', sfx: 'footsteps' }
      ],
      scenes: [
        {
          id: 'sc1',
          title: 'Scene 1: Two Knights Fighting in a Castle!',
          prompt: 'Two knights fight with shiny swords in a big stone castle. Which sound effect does this scene need?',
          video: 'video/g4_vid_r1.mp4',
          img: 'img/scene-knights.webp',
          emoji: '⚔️',
          answerId: 'swords'
        },
        {
          id: 'sc2',
          title: 'Scene 2: A Horse Galloping Across the Field!',
          prompt: 'A fast brown horse is running down the road. Which Foley sound effect matches the horse?',
          video: '',
          img: 'img/horse.webp',
          emoji: '🐎',
          answerId: 'horse'
        },
        {
          id: 'sc3',
          title: 'Scene 3: A Spooky Old Door & Chair Moving!',
          prompt: 'The detective opens an old wooden door and sits on a creaky chair. Add the sound effect!',
          video: '',
          img: 'img/old-chair.webp',
          emoji: '🪑',
          answerId: 'creak'
        },
        {
          id: 'sc4',
          title: 'Scene 4: Lightning and Storm Over the Theater!',
          prompt: 'Bright lightning flashes in the dark clouds! Which Foley sound effect do we record?',
          video: 'video/g4_vid_hook.mp4',
          img: 'img/metal-sheet.webp',
          emoji: '🌩️',
          answerId: 'thunder'
        },
        {
          id: 'sc5',
          title: 'Scene 5: Walking Across the Wooden Floor!',
          prompt: 'The actor walks quickly across the room in leather boots. Which sound effect matches?',
          video: '',
          img: 'img/wooden-shoes.webp',
          emoji: '👞',
          answerId: 'footsteps'
        }
      ]
    },

    // MISSION 3: Loud or Quiet? (8 Items)
    m3: [
      {
        id: 'lq1',
        name: 'A Big Bass Drum Booming!',
        sentence: 'The drummer hits the big drum in the concert hall: BOOM! BOOM!',
        img: 'img/drum.webp',
        emoji: '🥁',
        sfx: 'drum',
        answer: 'loud'
      },
      {
        id: 'lq2',
        name: 'A Girl Whispering a Secret',
        sentence: 'She cups her hands and whispers very softly: "Shhh, listen!"',
        img: 'img/whisper-girl.webp',
        emoji: '🤫',
        sfx: 'whisper',
        answer: 'quiet'
      },
      {
        id: 'lq3',
        name: 'Thunder Crashing in a Storm!',
        sentence: 'Flash! Boom! The thunder shakes the windows outside!',
        img: 'img/metal-sheet.webp',
        emoji: '⛈️',
        sfx: 'thunder',
        answer: 'loud'
      },
      {
        id: 'lq4',
        name: 'A Clock Ticking at Night',
        sentence: 'Everyone is asleep. The little clock goes tick-tock, tick-tock.',
        img: 'img/beethoven-piano.webp',
        emoji: '🕰️',
        sfx: 'clock',
        answer: 'quiet'
      },
      {
        id: 'lq5',
        name: 'A Full Orchestra Playing Beethoven’s 9th!',
        sentence: 'Trumpets play loudly, drums boom, and singers cry out together!',
        img: 'img/orchestra.webp',
        emoji: '🎺',
        sfx: 'orchestra_chord',
        answer: 'loud'
      },
      {
        id: 'lq6',
        name: 'Soft Leaves Rustling in the Breeze',
        sentence: 'A gentle breeze blows through the green leaves in the park.',
        img: 'img/lettuce.webp',
        emoji: '🍃',
        sfx: 'leaves',
        answer: 'quiet'
      },
      {
        id: 'lq7',
        name: 'The Audience Clapping and Cheering!',
        sentence: 'Bravo! Everybody stands up, claps their hands, and shouts Beethoven’s name!',
        img: 'img/audience.webp',
        emoji: '👏',
        sfx: 'clapping',
        answer: 'loud'
      },
      {
        id: 'lq8',
        name: 'Swords Clashing in a Castle Battle!',
        sentence: 'Clang! Crash! Two knights hit their metal swords together!',
        img: 'img/swords.webp',
        emoji: '⚔️',
        sfx: 'swords',
        answer: 'loud'
      }
    ],

    // MISSION 4: Where Are They? — Concert Hall (7 Hotspots)
    m4: {
      backdrop: 'img/concert-hall.webp',
      targets: [
        {
          id: 'beethoven',
          label: 'Beethoven (Composer)',
          emoji: '🎼',
          x: 50,
          y: 26,
          clue: 'The great composer from Germany who wrote the music!'
        },
        {
          id: 'conductor',
          label: 'Conductor’s Arms',
          emoji: '🦅',
          x: 24,
          y: 24,
          clue: 'Lifting arms high like an eagle to lead the music!'
        },
        {
          id: 'orchestra',
          label: 'Orchestra',
          emoji: '🎺',
          x: 76,
          y: 26,
          clue: 'All the musicians playing trumpets, drums, and strings together!'
        },
        {
          id: 'violin',
          label: 'Violin & Strings',
          emoji: '🎻',
          x: 24,
          y: 52,
          clue: 'Wooden string instruments played with a bow!'
        },
        {
          id: 'piano',
          label: 'Grand Piano',
          emoji: '🎹',
          x: 76,
          y: 52,
          clue: 'The keyboard instrument with black and white keys!'
        },
        {
          id: 'stage',
          label: 'Theater Stage',
          emoji: '🎭',
          x: 50,
          y: 58,
          clue: 'The wooden floor under the bright lights where musicians stand!'
        },
        {
          id: 'audience',
          label: 'Audience (Crowd)',
          emoji: '👏',
          x: 50,
          y: 84,
          clue: 'The people in the theater seats who clap, cheer, and throw flowers!'
        }
      ]
    },

    // MISSION 5: The Two Doors (10 Cards)
    m5: [
      {
        id: 'd1',
        text: 'Makes realistic sound effects for films in a studio.',
        img: 'img/foley-artist.webp',
        emoji: '🎧',
        door: 'foley'
      },
      {
        id: 'd2',
        text: 'Bangs two pieces of coconut together to sound like a horse.',
        img: 'img/coconuts.webp',
        emoji: '🥥',
        door: 'foley'
      },
      {
        id: 'd3',
        text: 'A great German composer who wrote his 9th Symphony.',
        img: 'img/composer.webp',
        emoji: '🎼',
        door: 'beethoven'
      },
      {
        id: 'd4',
        text: 'Could not hear the music or the crowd because he was deaf.',
        img: 'img/deaf.webp',
        emoji: '👂',
        door: 'beethoven'
      },
      {
        id: 'd5',
        text: 'Shakes a thin piece of metal in front of a microphone for thunder.',
        img: 'img/metal-sheet.webp',
        emoji: '⚡',
        door: 'foley'
      },
      {
        id: 'd6',
        text: 'Worked for ten years at his piano to write his new music.',
        img: 'img/beethoven-piano.webp',
        emoji: '🎹',
        door: 'beethoven'
      },
      {
        id: 'd7',
        text: 'Lifts his arms like an eagle in his red scarf and coat on stage.',
        img: 'img/eagle.webp',
        emoji: '🦅',
        door: 'beethoven'
      },
      {
        id: 'd8',
        text: 'Squeezes a green head of lettuce to record a soft crunch.',
        img: 'img/lettuce.webp',
        emoji: '🥬',
        door: 'foley'
      },
      {
        id: 'd9',
        text: 'A kind singer turns him around to see the audience cheering and throwing flowers.',
        img: 'img/scene-beethoven-turn.webp',
        emoji: '💐',
        door: 'beethoven'
      },
      {
        id: 'd10',
        text: 'Walks in shoes on a wooden floor and closes a big book quickly.',
        img: 'img/wooden-shoes.webp',
        emoji: '👞',
        door: 'foley'
      }
    ],

    // MISSION 6: Put the Events in Order (6 Cards matching Global Readings Level 3 pp. 80-85)
    m6: [
      {
        step: 1,
        id: 'ev1',
        text: 'The orchestra and singers wait on stage for Beethoven, the great composer.',
        img: 'img/orchestra.webp',
        emoji: '🎻',
        sfx: 'piano_calm'
      },
      {
        step: 2,
        id: 'ev2',
        text: 'Beethoven worked for ten years at his piano to write his new music.',
        img: 'img/beethoven-piano.webp',
        emoji: '🎹',
        sfx: 'piano_calm'
      },
      {
        step: 3,
        id: 'ev3',
        text: 'He stands on stage in his red scarf and coat and lifts his arms like an eagle!',
        img: 'img/scene-beethoven-conduct.webp',
        emoji: '🦅',
        sfx: 'orchestra_chord'
      },
      {
        step: 4,
        id: 'ev4',
        text: 'The music finishes! The crowd stands up, claps, cheers, and throws flowers.',
        img: 'img/audience.webp',
        emoji: '💐',
        sfx: 'clapping'
      },
      {
        step: 5,
        id: 'ev5',
        text: 'Beethoven is deaf, so he cannot hear the crowd cheering behind him.',
        img: 'img/deaf.webp',
        emoji: '👂',
        sfx: 'piano_sad'
      },
      {
        step: 6,
        id: 'ev6',
        text: 'A kind singer turns him around. He sees the cheers, cries happy tears, and bows low!',
        img: 'img/beethoven-bow.webp',
        emoji: '🙇',
        sfx: 'clapping'
      }
    ],

    // MISSION 7: How Does He Feel? (6 Story & Music Rounds)
    m7: [
      {
        id: 'f1',
        title: 'Moment 1: Waiting Before the Concert',
        story: 'It is a big night at the theater! Beethoven has not been on stage for twelve years. Everyone waits nervously for the music to start.',
        musicLabel: '🎵 Play Tense Waiting Music',
        sfx: 'piano_sad',
        img: 'img/orchestra.webp',
        emoji: '🎻',
        answer: 'worried'
      },
      {
        id: 'f2',
        title: 'Moment 2: Beethoven Cannot Hear',
        story: 'Beethoven loves music more than anything, but his ears cannot hear a single sound anymore. He is completely deaf.',
        musicLabel: '🎵 Play Slow Sad Piano',
        sfx: 'piano_sad',
        img: 'img/deaf.webp',
        emoji: '😢',
        answer: 'sad'
      },
      {
        id: 'f3',
        title: 'Moment 3: Turning Around on Stage!',
        story: 'A singer gently takes Beethoven’s arm and turns him around. Suddenly, he sees hundreds of people standing and waving hats!',
        musicLabel: '🎵 Play Dramatic Orchestra Chord',
        sfx: 'orchestra_chord',
        img: 'img/scene-beethoven-turn.webp',
        emoji: '😮',
        answer: 'surprised'
      },
      {
        id: 'f4',
        title: 'Moment 4: Flowers and Happy Tears!',
        story: 'The audience claps, shouts Beethoven’s name, and throws flowers! Beethoven’s heart is full of joy and he bows low to thank them.',
        musicLabel: '🎵 Play Big Cheering & Music',
        sfx: 'clapping',
        img: 'img/beethoven-bow.webp',
        emoji: '😊',
        answer: 'happy'
      },
      {
        id: 'f5',
        title: 'Moment 5: The Foley Artist Finishes the Film!',
        story: 'In the studio, the Foley artist records the coconuts, metal sheet, and lettuce. Every sound matches the film perfectly!',
        musicLabel: '🎵 Play Cheerful Studio Melody',
        sfx: 'piano_calm',
        img: 'img/foley-artist.webp',
        emoji: '🎬',
        answer: 'happy'
      },
      {
        id: 'f6',
        title: 'Moment 6: A Sudden Thunder Crash in the Movie!',
        story: 'In the movie, the sky is quiet—then BOOM! The Foley artist shakes the metal sheet and a huge thunderbolt surprises the knight!',
        musicLabel: '🎵 Play Sudden Thunder Crash',
        sfx: 'thunder',
        img: 'img/knight.webp',
        emoji: '⚡',
        answer: 'surprised'
      }
    ],

    feelings: [
      { id: 'happy', label: 'Happy', emoji: '😊' },
      { id: 'sad', label: 'Sad', emoji: '😢' },
      { id: 'surprised', label: 'Surprised', emoji: '😮' },
      { id: 'worried', label: 'Worried', emoji: '😟' }
    ]
  };
})();
