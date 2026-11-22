/* Foley Sound Engineer Studio — Curriculum Data (35-Min Smartboard Lesson)
   1 Target Grammar Pair: "When you [action], it sounds like [sound]!" + "Foley artists have to..."
   CLIL Topic: Acoustic Physics & Movie Sound Engineering (Grade 4 Unit 5 / Grade 3 Speaking & CLIL) */
(function (root) {
  'use strict';

  root.FOLEY_DATA = {
    lessonTitle: 'Foley Sound Engineer Studio',
    totalMinutes: 35,
    teams: [
      { id: 'pink', name: 'Emberwing', color: '#ff5fa2', score: 0 },
      { id: 'blue', name: 'Aquafind', color: '#4f9dff', score: 0 },
      { id: 'yellow', name: 'Sparktail', color: '#ffb320', score: 0 },
      { id: 'green', name: 'Florasprout', color: '#2fc58a', score: 0 }
    ],

    /* 6 Scenes summing to EXACTLY 35 minutes (5 + 8 + 6 + 7 + 5 + 4 = 35) */
    scenes: [
      {
        id: 'story',
        title: '1. Studio Story',
        mins: 5,
        color: '#ff5fa2',
        formula: 'Shh! We have to be quiet in the Foley studio!',
        tips: [
          'Timing: 5 minutes. Book reference: Global Readings 3 Unit 5 pp. 74–77 (or Grade 3 CLIL Speaking Special, p. ___).',
          'Read each of the 4 story cards aloud with TPR actions: finger on lips ("Shh!"), pretend to hold a microphone, clap hands like a clapperboard.',
          'Ask the class: "Why do movies need a Foley sound engineer?" Accept 1-word answers and recast into full sentences.'
        ]
      },
      {
        id: 'workbench',
        title: '2. Sound Lab',
        mins: 8,
        color: '#4f9dff',
        formula: 'When you bang two coconut shells, it sounds like a horse!',
        tips: [
          'Timing: 8 minutes. Invite 1 pupil from each team up to the smartboard to interact physically with the tools (TAP coconuts, SHAKE metal sheet & keys, SQUEEZE lettuce, SLAM book, STOMP boots, TILT rainstick, ROCK chair).',
          'Watch the live oscilloscope jump! After every sound, the whole class chants the sentence at the bottom.',
          'Finish with the 4-Beat Foley Mixer: let a team record 4 sounds in a row and play back their mini movie soundtrack!'
        ]
      },
      {
        id: 'mystery',
        title: '3. Sound Detectives',
        mins: 6,
        color: '#ffb320',
        lightTxt: true,
        formula: 'Listen! It sounds like thunder! You shake the metal sheet!',
        tips: [
          'Timing: 6 minutes (Game 1). Tap "Play Mystery Sound" behind the red curtain.',
          'Teams whisper together for 5 seconds, then one speaker chooses the tool AND says the full speaking sentence to earn +10 points.',
          'Soft-fail only: wrong guesses wobble warmly with a hint—never deduct points!'
        ]
      },
      {
        id: 'dubbing',
        title: '4. Live Movie Dub',
        mins: 7,
        color: '#2fc58a',
        formula: 'When the knight marches, we shake the metal keys!',
        tips: [
          'Timing: 7 minutes (Game 2). One team stands at the smartboard as the LIVE Foley Crew!',
          'Press "Action! 🎬". As each cue lights up on the movie screen, the pupil taps/shakes the matching tool LIVE while teammates read the action aloud.',
          'Each completed 3-cue movie scene earns +15 Studio Points and raises Studio Energy!'
        ]
      },
      {
        id: 'formula',
        title: '5. Formula Builder',
        mins: 5,
        color: '#9b7bff',
        formula: 'Foley artists have to make realistic sounds!',
        tips: [
          'Timing: 5 minutes (Game 3). Quick team grammar & speaking rounds practising "When...", "sounds like...", and "have to / has to".',
          'Have the whole team repeat the completed sentence out loud together after tapping the right word.'
        ]
      },
      {
        id: 'onair',
        title: '6. ON AIR Show',
        mins: 4,
        color: '#ff5fa2',
        formula: 'Hello! I am a Foley engineer. When I shake the keys, it sounds like a knight!',
        tips: [
          'Timing: 4 minutes (Game 4 & Podium). 3-sentence speaking ceiling! Each team chooses a 3-line mini radio drama and performs it LIVE with the sound buttons.',
          'Tap "Send XP to Class Board" on the trophy podium to reward every team!'
        ]
      }
    ],

    /* 8 Interactive Tactile Foley Props */
    props: [
      {
        id: 'coconuts',
        name: 'Coconut Shells',
        movieSound: 'Horse Hooves',
        gesture: 'TAP FAST',
        actionVerb: 'bang two coconut shells',
        soundWord: 'Clip-clop!',
        sentence: 'When you bang two coconut shells, it sounds like a horse!',
        emoji: '🥥',
        art: 'art/prop-coconuts.webp',
        color: '#ffb320',
        hint: 'Tap again and again to make the horse gallop!'
      },
      {
        id: 'metal-sheet',
        name: 'Metal Sheet',
        movieSound: 'Storm Thunder',
        gesture: 'DRAG & SHAKE',
        actionVerb: 'shake the metal sheet',
        soundWord: 'BOOM-rumble!',
        sentence: 'When you shake the metal sheet, it sounds like thunder!',
        emoji: '⛈️',
        art: 'art/prop-metal-sheet.webp',
        color: '#4f9dff',
        hint: 'Wiggle your finger left and right to roll big thunder!'
      },
      {
        id: 'keys',
        name: 'Metal Keys',
        movieSound: 'Knight Armor',
        gesture: 'SHAKE FAST',
        actionVerb: 'shake the metal keys',
        soundWord: 'Clink-clank!',
        sentence: 'When you shake the metal keys, it sounds like a knight marching!',
        emoji: '🔑',
        art: 'art/prop-keys.webp',
        color: '#ff5fa2',
        hint: 'Shake the keyring fast for shiny knight armor!'
      },
      {
        id: 'lettuce',
        name: 'Crunchy Lettuce',
        movieSound: 'Grass Footsteps',
        gesture: 'SQUEEZE / TAP',
        actionVerb: 'crunch the fresh lettuce',
        soundWord: 'Crunch-crunch!',
        sentence: 'When you crunch the lettuce, it sounds like walking in grass!',
        emoji: '🥬',
        art: 'art/prop-lettuce.webp',
        color: '#2fc58a',
        hint: 'Tap or rub the crisp leaves to crunch!'
      },
      {
        id: 'book',
        name: 'Heavy Book',
        movieSound: 'Castle Door Slam',
        gesture: 'SLAM SHUT',
        actionVerb: 'slam the heavy book',
        soundWord: 'BAM!',
        sentence: 'When you slam the heavy book, it sounds like a castle door!',
        emoji: '📕',
        art: 'art/prop-book.webp',
        color: '#ff5fa2',
        hint: 'Tap hard to clap the giant storybook shut!'
      },
      {
        id: 'boots',
        name: 'Heavy Boots',
        movieSound: 'Stone Floor Steps',
        gesture: 'STOMP L / R',
        actionVerb: 'stomp the heavy boots',
        soundWord: 'Thud-thud!',
        sentence: 'When you stomp the heavy boots, it sounds like walking in a castle!',
        emoji: '🥾',
        art: 'art/prop-boots.webp',
        color: '#ffb320',
        hint: 'Tap left-right-left-right for heavy footsteps!'
      },
      {
        id: 'rainstick',
        name: 'Rain Stick',
        movieSound: 'Falling Rain',
        gesture: 'TILT & POUR',
        actionVerb: 'tilt the rain stick',
        soundWord: 'Shhhh-pitter!',
        sentence: 'When you tilt the rain stick, it sounds like gentle rain!',
        emoji: '🌧️',
        art: 'art/prop-rainstick.webp',
        color: '#4f9dff',
        hint: 'Drag across or tap to pour sparkling rain!'
      },
      {
        id: 'chair',
        name: 'Old Wooden Chair',
        movieSound: 'Creaky Door',
        gesture: 'ROCK SLOWLY',
        actionVerb: 'rock the old chair',
        soundWord: 'Squeeeak!',
        sentence: 'When you rock the old chair, it sounds like a creaky door!',
        emoji: '🪑',
        art: 'art/prop-chair.webp',
        color: '#9b7bff',
        hint: 'Tap or drag gently to make the wooden chair squeak!'
      }
    ],

    /* Scene 1: 4-Card Interactive Story */
    story: [
      {
        tag: 'Scene 1 of 4 · Studio Emergency!',
        art: 'art/studio-backdrop.webp',
        text: 'Welcome to Adventure Park Sound Studio! Oh no — our new movie only recorded the actors’ voices!',
        tpr: '😮 Put hands on cheeks and say: "Oh no! Where are the movie sounds?"',
        say: 'Oh no! We have to record realistic movie sounds!'
      },
      {
        tag: 'Scene 2 of 4 · Meet the Foley Engineer!',
        art: 'art/scene-onair.webp',
        text: 'A Foley engineer uses everyday objects in a quiet studio to create realistic sound effects for movies!',
        tpr: '🤫 Put a finger to your lips and say: "Shh! We have to be quiet!"',
        say: 'Shh! We have to be quiet in the Foley studio!'
      },
      {
        tag: 'Scene 3 of 4 · Everyday Magic!',
        art: 'art/scene-castle.webp',
        text: 'No real horses or real thunder inside the studio! We bang coconut shells and shake a shiny metal sheet!',
        tpr: '🥥 Clap hands fast like horse hooves and say: "Clip-clop! It sounds like a horse!"',
        say: 'When you bang coconut shells, it sounds like a horse!'
      },
      {
        tag: 'Scene 4 of 4 · Your Mission Today!',
        art: 'art/scene-storm.webp',
        text: 'Today YOUR team becomes our Foley Sound Crew! Touch the tools, dub the movies, and go ON AIR!',
        tpr: '🎬 Clap hands like a clapperboard and shout: "Lights, camera, SOUND!"',
        say: 'We are Foley engineers! Lights, camera, sound!'
      }
    ],

    /* Scene 4: 4 Live Movie Dubbing Scenes (3 timed cues each!) */
    movies: [
      {
        id: 'castle',
        title: 'Movie 1: The Castle Knight',
        art: 'art/scene-castle.webp',
        cues: [
          { prop: 'coconuts', icon: '🐴', label: '1. Horse gallops up!', line: 'Listen! The horse gallops to the castle!' },
          { prop: 'keys', icon: '🛡️', label: '2. Knight marches in!', line: 'Clink-clank! The knight marches in metal armor!' },
          { prop: 'book', icon: '🚪', label: '3. Big gate slams!', line: 'BAM! The heavy castle door slams shut!' }
        ]
      },
      {
        id: 'storm',
        title: 'Movie 2: Rainy Cabin Storm',
        art: 'art/scene-storm.webp',
        cues: [
          { prop: 'rainstick', icon: '🌧️', label: '1. Rain starts falling!', line: 'Shhh! Soft rain is falling on the roof!' },
          { prop: 'metal-sheet', icon: '⛈️', label: '2. Thunder booms!', line: 'BOOM! Loud thunder rolls in the sky!' },
          { prop: 'chair', icon: '🚪', label: '3. Old door creaks!', line: 'Squeeeak! The wooden cabin door opens!' }
        ]
      },
      {
        id: 'forest',
        title: 'Movie 3: Adventure Trail',
        art: 'art/scene-forest.webp',
        cues: [
          { prop: 'lettuce', icon: '🌿', label: '1. Walking on leaves!', line: 'Crunch-crunch! Someone is walking in the grass!' },
          { prop: 'coconuts', icon: '🐴', label: '2. Pony trots past!', line: 'Clip-clop! A friendly pony trots down the trail!' },
          { prop: 'boots', icon: '🥾', label: '3. Explorer stomps!', line: 'Thud-thud! Heavy boots walk onto the wooden bridge!' }
        ]
      },
      {
        id: 'studio',
        title: 'Movie 4: Midnight Mystery',
        art: 'art/scene-onair.webp',
        cues: [
          { prop: 'chair', icon: '🪑', label: '1. Chair squeaks!', line: 'Squeeeak! Someone sits on an old chair!' },
          { prop: 'boots', icon: '🥾', label: '2. Footsteps approach!', line: 'Thud-thud! Heavy footsteps cross the floor!' },
          { prop: 'keys', icon: '🔑', label: '3. Secret keys jingle!', line: 'Clink-clank! The guard opens the treasure gate!' }
        ]
      }
    ],

    /* Scene 5: Game 3 — Foley Formula & Grammar Builder (10 rounds) */
    formulas: [
      { q: 'When you bang two coconut shells, it <mark>____</mark> like a horse!', a: 'sounds', w: ['sound', 'sounding'], prop: 'coconuts' },
      { q: 'Foley artists <mark>____</mark> to make movie sounds realistic!', a: 'have', w: ['has', 'having'], prop: 'book' },
      { q: 'Everyone in the recording studio <mark>____</mark> to be very quiet!', a: 'has', w: ['have', 'are'], prop: 'rainstick' },
      { q: '<mark>____</mark> you shake the metal sheet, it sounds like thunder!', a: 'When', w: ['Where', 'Who'], prop: 'metal-sheet' },
      { q: 'Shaking metal <mark>____</mark> sounds like a knight marching in armor!', a: 'keys', w: ['kites', 'kings'], prop: 'keys' },
      { q: 'Crunching fresh <mark>____</mark> sounds like walking on grass!', a: 'lettuce', w: ['lemons', 'ladders'], prop: 'lettuce' },
      { q: 'Closing a heavy <mark>____</mark> fast sounds like a big door slam!', a: 'book', w: ['boat', 'bird'], prop: 'book' },
      { q: 'Rocking an old wooden <mark>____</mark> makes a loud squeak!', a: 'chair', w: ['cheese', 'cherry'], prop: 'chair' },
      { q: 'Heavy <mark>____</mark> make a loud thud on the castle floor!', a: 'boots', w: ['boats', 'books'], prop: 'boots' },
      { q: 'Tilting a rain stick makes the sound of gentle <mark>____</mark>!', a: 'rain', w: ['rock', 'ring'], prop: 'rainstick' }
    ],

    /* Scene 6: 3-Sentence Live Speaking Scripts (Strict 3-Sentence Ceiling!) */
    scripts: [
      {
        title: 'Drama A: The Stormy Castle',
        lines: [
          { text: 'Hello! We are the Foley sound engineers!', prop: 'rainstick' },
          { text: 'When we shake the metal sheet, it sounds like thunder!', prop: 'metal-sheet' },
          { text: 'When we slam the heavy book, the castle gate closes!', prop: 'book' }
        ]
      },
      {
        title: 'Drama B: The Brave Knight',
        lines: [
          { text: 'Shh! We have to be quiet in our sound studio!', prop: 'chair' },
          { text: 'When we bang the coconut shells, a horse gallops fast!', prop: 'coconuts' },
          { text: 'When we shake the metal keys, the knight marches in!', prop: 'keys' }
        ]
      },
      {
        title: 'Drama C: Forest Explorers',
        lines: [
          { text: 'Welcome! Today we make realistic forest sounds!', prop: 'rainstick' },
          { text: 'When we crunch the lettuce, we walk in tall grass!', prop: 'lettuce' },
          { text: 'When we stomp the heavy boots, we cross the bridge!', prop: 'boots' }
        ]
      }
    ]
  };
})(window);
