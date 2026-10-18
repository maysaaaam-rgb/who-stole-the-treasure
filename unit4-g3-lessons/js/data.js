/* Unit 4 "What Happened?" - Grade 3 Pro Smartboard Lessons (Case File 1 & Case File 2).
   Designed for interactive 16:9 classroom smartboards with 65/35 Hero Stage,
   Past-Tense Time Machine grammar scaffolding, interactive Museum Hotspot puzzles,
   animated Heist Board Game, and Karaoke Read-Along. */
(function (root) {
  'use strict';
  var D = {};

  D.teams = [
    { n: 'Foxes', e: '🦊', c: '#f97316', dark: '#9a3412' },
    { n: 'Owls', e: '🦉', c: '#8b5cf6', dark: '#5b21b6' },
    { n: 'Cats', e: '🐱', c: '#f43f5e', dark: '#9f1239' },
    { n: 'Wolves', e: '🐺', c: '#0ea5e9', dark: '#075985' }
  ];
  D.goal = 20; // Clues needed to solve the case

  /* =========================================================================
     CASE FILE 1: A PICTURE ON THE WALL (Book pp. 56-59)
     ========================================================================= */
  D.c1missions = [
    { e: '🗽', t: 'Statue Mystery', a: 'o_statue' },
    { e: '🖼️', t: 'Spot 5 Changes', a: 'o_mona_frame' },
    { e: '🔍', t: '5 Case Words', a: 'c_daphne_case' },
    { e: '⚙️', t: 'Past Time Machine', a: 'o_plan' },
    { e: '🥷', t: 'Sneak & Solve Heist', a: 'o_steal' },
    { e: '⏳', t: 'Build the Timeline', a: 'o_newspaper' }
  ];

  /* Scene 1: Mystery Hook & Think-Pair-Share Hotspots (pp. 56-57) */
  D.hook1 = [
    'Welcome to Detective Academy! Today we open Case File Number One.',
    'Look at this giant head in the park in Paris (1883). What is it?',
    'Tap the 3 glowing clues on the statue to investigate with your partner!'
  ];

  D.tps = [
    {
      id: 'what',
      badge: 'CLUE 1 · WHAT IS IT?',
      x: '24%', y: '28%',
      q: 'What is this giant head in the park?',
      a: 'It is the head of the Statue of Liberty!',
      frame: 'I think it is a big statue.'
    },
    {
      id: 'why',
      badge: 'CLUE 2 · WHY IS IT THERE?',
      x: '74%', y: '36%',
      q: 'Why is it in the park?',
      a: 'I think it is in the park for decoration.',
      frame: 'I think it is in the park for decoration.'
    },
    {
      id: 'where',
      badge: 'CLUE 3 · WHERE IS IT NOW?',
      x: '52%', y: '74%',
      q: 'Where is the statue now?',
      a: 'I think it is in a big city: New York!',
      frame: 'We think it is in New York City now.'
    }
  ];

  /* Scene 2: Interactive Spot the 5 Changes (Book p. 57 E: Museum Beginning vs End) */
  D.changes = [
    {
      id: 'wall',
      w: '1. The Wall',
      icon: '🖼️',
      artB: 'o_robbery',
      artA: 'o_mona_frame',
      labelB: 'Empty wall!',
      labelA: 'Mona Lisa is back!',
      sb: 'The painting is not on the wall.',
      sa: 'The painting is on the wall.'
    },
    {
      id: 'people',
      w: '2. The People',
      icon: '👥',
      artB: 'o_steal',
      artA: 'c_daphne_case',
      labelB: 'One sneaky man',
      labelA: 'Many happy visitors',
      sb: 'There is one man in the museum.',
      sa: 'There are many people in the museum.'
    },
    {
      id: 'look',
      w: '3. Their Faces',
      icon: '😄',
      artB: 'o_lifted',
      artA: 'o_police',
      labelB: 'Sneaky & quiet',
      labelA: 'Smiling & happy',
      sb: 'The man looks sneaky.',
      sa: 'The people look happy.'
    },
    {
      id: 'phones',
      w: '4. Cameras & Phones',
      icon: '📱',
      artB: 'o_plan',
      artA: 'o_newspaper',
      labelB: '1911: No phones',
      labelA: 'Today: Taking photos!',
      sb: 'Nobody has a phone in 1911.',
      sa: 'People have phones and take photos.'
    },
    {
      id: 'mood',
      w: '5. The Museum Mood',
      icon: '🎉',
      artB: 'o_arrested',
      artA: 'o_statue',
      labelB: 'Shh! A secret crime',
      labelA: 'A famous celebration!',
      sb: 'It is very quiet and dark.',
      sa: 'It is a big happy day!'
    }
  ];

  /* Scene 3: Case Words + Detective Mime Locker (Book p. 59 Words in Context) */
  D.words = [
    {
      w: 'plan',
      pos: 'NOUN',
      posColor: '#38bdf8',
      e: '📝',
      a: 'o_plan',
      def: 'an idea of what you will do',
      ex: 'Peruggia had a clever plan.',
      gap: 'Peruggia had a clever ____.',
      mime: 'Touch your finger to your head, squint your eyes, and nod: "Aha! I have a plan!"'
    },
    {
      w: 'steal',
      pos: 'VERB (NOW)',
      posColor: '#10b981',
      e: '🥷',
      a: 'o_steal',
      def: 'to take something that is not yours',
      ex: 'He wanted to steal the painting.',
      gap: 'He wanted to ____ the painting.',
      mime: 'Tiptoe silently, look left and right, and slip an invisible picture under your coat!'
    },
    {
      w: 'lifted',
      pos: 'PAST VERB (+ED)',
      posColor: '#f59e0b',
      e: '🏋️',
      a: 'o_lifted',
      def: 'took something up off the wall',
      ex: 'He lifted the painting off the wall.',
      gap: 'He ____ the painting off the wall.',
      mime: 'Bend your knees and lift a heavy golden picture frame off the wall with both hands!'
    },
    {
      w: 'robbery',
      pos: 'NOUN',
      posColor: '#38bdf8',
      e: '🚨',
      a: 'o_robbery',
      def: 'when someone steals something from a place',
      ex: 'The big robbery was in the news.',
      gap: 'The big ____ was in the news.',
      mime: 'Put both hands on your cheeks in shock and point at the empty wall: "A robbery!"'
    },
    {
      w: 'arrested',
      pos: 'PAST VERB (+ED)',
      posColor: '#f59e0b',
      e: '👮',
      a: 'o_arrested',
      def: 'when the police catch and take a thief away',
      ex: 'The police arrested Peruggia.',
      gap: 'The police ____ Peruggia.',
      mime: 'Hold out both wrists together in front of you: "Click-clack! You are under arrest!"'
    }
  ];

  /* Scene 4: NEW! The Past-Tense Time Machine (Grammar Discovery before testing) */
  D.grammarRegular = [
    { base: 'walk', past: 'walked', stem: 'walk', suffix: 'ed', a: 'o_steal', ex: 'Yesterday, Peruggia walked into the museum.' },
    { base: 'want', past: 'wanted', stem: 'want', suffix: 'ed', a: 'o_mona_frame', ex: 'He wanted to steal the Mona Lisa.' },
    { base: 'lift', past: 'lifted', stem: 'lift', suffix: 'ed', a: 'o_lifted', ex: 'He lifted the heavy painting off the wall.' },
    { base: 'call', past: 'called', stem: 'call', suffix: 'ed', a: 'o_police', ex: 'A museum worker called the police.' },
    { base: 'arrest', past: 'arrested', stem: 'arrest', suffix: 'ed', a: 'o_arrested', ex: 'The police arrested the thief.' },
    { base: 'paint', past: 'painted', stem: 'paint', suffix: 'ed', a: 'o_mona_frame', ex: 'Leonardo painted the Mona Lisa in 1503.' }
  ];

  D.grammarIrregular = [
    { base: 'take', past: 'took', a: 'o_steal', ex: 'In 1911, Peruggia took the painting!' },
    { base: 'hide', past: 'hid', a: 'o_lifted', ex: 'He hid the painting under his white coat.' },
    { base: 'find', past: 'found', a: 'c_daphne_case', ex: 'Two years later, the police found it!' },
    { base: 'go', past: 'went', a: 'o_mona_frame', ex: 'At last, the Mona Lisa went home to Paris.' }
  ];

  /* Scene 5 & 6: Past-Tense Detectives (100% wired with custom art) */
  D.past = [
    { s: 'Yesterday, Peruggia ____ into the museum. (walk)', o: ['walked', 'walks', 'walking'], a: 0, e: '🚶', art: 'o_steal', rule: 'Regular past: walk + ed = walked' },
    { s: 'He ____ to steal the painting. (want)', o: ['wanted', 'want', 'wants'], a: 0, e: '🖼️', art: 'o_mona_frame', rule: 'Regular past: want + ed = wanted' },
    { s: 'He ____ the painting off the wall. (lift)', o: ['lifted', 'lifts', 'lifting'], a: 0, e: '🏋️', art: 'o_lifted', rule: 'Regular past: lift + ed = lifted' },
    { s: 'He ____ the painting under his coat. (hide)', o: ['hid', 'hides', 'hide'], a: 0, e: '🧥', art: 'o_steal', rule: 'Secret Irregular verb: hide → hid!' },
    { s: 'A museum worker ____ the police. (call)', o: ['called', 'calls', 'calling'], a: 0, e: '📞', art: 'o_robbery', rule: 'Regular past: call + ed = called' },
    { s: 'The police ____ Peruggia. (arrest)', o: ['arrested', 'arrest', 'arrests'], a: 0, e: '👮', art: 'o_arrested', rule: 'Regular past: arrest + ed = arrested' },
    { s: 'In 1913, the police ____ the painting! (find)', o: ['found', 'find', 'finds'], a: 0, e: '🔍', art: 'c_daphne_case', rule: 'Secret Irregular verb: find → found!' },
    { s: 'Leonardo ____ the Mona Lisa in 1503. (paint)', o: ['painted', 'paints', 'paint'], a: 0, e: '🎨', art: 'o_mona_frame', rule: 'Regular past: paint + ed = painted' }
  ];

  /* Scene 7: Timeline Sequencer (with artwork for each step) */
  D.timeline = [
    {
      title: 'Case 1: The Mona Lisa History (1503–1913)',
      e: '⏳',
      steps: [
        { s: 'In 1503, Leonardo painted the Mona Lisa.', art: 'o_mona_frame', year: '1503' },
        { s: 'In 1911, Peruggia took the painting.', art: 'o_steal', year: '1911' },
        { s: 'In 1913, the police found it and arrested him.', art: 'o_arrested', year: '1913' },
        { s: 'Finally, the Mona Lisa went home to the museum.', art: 'c_daphne_case', year: 'HOME' }
      ]
    },
    {
      title: 'Case 2: Inside the Robbery Night (1911)',
      e: '🌙',
      steps: [
        { s: 'Peruggia had a plan and put on a worker coat.', art: 'o_plan', year: 'STEP 1' },
        { s: 'He lifted the painting off the museum wall.', art: 'o_lifted', year: 'STEP 2' },
        { s: 'He hid the painting under his white coat.', art: 'o_steal', year: 'STEP 3' },
        { s: 'He walked out of the door into the street.', art: 'o_robbery', year: 'STEP 4' }
      ]
    }
  ];
  D.orderWords = ['First,', 'Then,', 'After that,', 'Finally,'];

  /* =========================================================================
     CASE FILE 2: WHERE IS SHE? (Book pp. 58-64)
     ========================================================================= */
  D.c2missions = [
    { e: '⚡', t: 'Evidence Flash', a: 'c_daphne_case' },
    { e: '🎬', t: 'Interactive Story', a: 'o_mona_frame' },
    { e: '📰', t: 'Newspaper Printer', a: 'o_newspaper' },
    { e: '❓', t: 'Detective Quiz Show', a: 'o_police' },
    { e: '🛡️', t: 'Museum Security Debate', a: 'o_robbery' },
    { e: '🎨', t: 'Emotion Face Studio', a: 'o_arrested' }
  ];

  /* Lesson 2 Story: Every single beat now has real 3D art + highlighted target word + interactive hotspot prompt */
  D.story = [
    {
      title: '1503 · Florence, Italy',
      say: 'In 1503, Leonardo da Vinci painted the Mona Lisa.',
      act: '🎨 Pretend to paint a masterpiece with a brush!',
      scene: '🎨',
      art: 'o_mona_frame',
      spot: 'painted'
    },
    {
      title: '1911 · The Louvre Museum, Paris',
      say: 'In 1911, Peruggia walked into the museum in Paris. He had a plan.',
      act: '🧠 Point to your head and whisper: "He had a plan!"',
      scene: '📝',
      art: 'o_plan',
      spot: 'plan'
    },
    {
      title: 'Disguised in White',
      say: 'He wore a white museum worker coat. He waited until the room was empty.',
      act: '🧥 Put on a big white coat. Look left… look right… wait!',
      scene: '🧥',
      art: 'o_steal',
      spot: 'waited'
    },
    {
      title: 'Off the Wall!',
      say: 'He lifted the painting off the wall and hid it under his coat!',
      act: '🏋️ Lift the heavy frame with both hands, then hide it under your coat!',
      scene: '🖼️',
      art: 'o_lifted',
      spot: 'lifted',
      key: true
    },
    {
      title: 'The Great Escape',
      say: 'He walked out of the museum door. Nobody saw him steal it!',
      act: '🚪 Tiptoe quietly out the door. Shh!',
      scene: '🥷',
      art: 'o_steal',
      spot: 'steal',
      key: true
    },
    {
      title: 'The Empty Wall',
      say: 'The next day, there was only an empty space on the wall! A worker called the police.',
      act: '😱 Put your hands on your cheeks! Then pretend to call the police!',
      scene: '🚨',
      art: 'o_robbery',
      spot: 'called'
    },
    {
      title: 'Breaking News Around the World',
      say: 'Soon, the robbery was in the newspapers in Madrid, Tokyo, and New York!',
      act: '📰 Hold up a newspaper and shout: "Extra! Extra! The Mona Lisa is missing!"',
      scene: '📰',
      art: 'o_newspaper',
      spot: 'robbery'
    },
    {
      title: 'Lining Up to Look!',
      say: 'Thousands of people lined up just to see the empty space on the wall!',
      act: '🧍🧍 Stand in a line and stare at the empty wall with big eyes!',
      scene: '🖼️',
      art: 'o_robbery',
      spot: 'lined up'
    },
    {
      title: '1913 · Caught in Italy!',
      predict: 'For two years the police looked everywhere. How did they catch Peruggia in 1913?',
      say: 'In 1913, Peruggia tried to sell the painting in Italy! The art dealer called the police.',
      act: '🕵️ Point at the thief and shout: "Call the police!"',
      scene: '🕵️',
      art: 'c_daphne_case',
      spot: 'called',
      key: true
    },
    {
      title: 'Case Solved!',
      say: 'The police arrested Peruggia, and the Mona Lisa went home to the museum!',
      act: '👮 Put your hands behind your back, then jump up and cheer for the Mona Lisa!',
      scene: '👮',
      art: 'o_arrested',
      spot: 'arrested',
      key: true
    }
  ];

  /* Lesson 2 Scene 3: Interactive Front-Page Newspaper Builder */
  D.headlines = [
    {
      city: 'PARIS · 1911',
      flag: '🇫🇷',
      art: 'o_robbery',
      sub: 'Louvre Museum Shock!',
      words: ['The', 'Mona Lisa', 'is', 'missing!'],
      h: 'The Mona Lisa is missing!'
    },
    {
      city: 'MADRID · 1911',
      flag: '🇪🇸',
      art: 'o_steal',
      sub: 'Thief in a White Coat!',
      words: ['Big', 'robbery', 'in', 'Paris!'],
      h: 'Big robbery in Paris!'
    },
    {
      city: 'NEW YORK · 1911',
      flag: '🗽',
      art: 'o_newspaper',
      sub: 'World Mystery!',
      words: ['Where', 'is', 'the', 'Mona Lisa?'],
      h: 'Where is the Mona Lisa?'
    },
    {
      city: 'TOKYO · 1912',
      flag: '🗼',
      art: 'o_police',
      sub: 'Detectives Search Everywhere!',
      words: ['Police', 'look for', 'the', 'painting!'],
      h: 'Police look for the painting!'
    },
    {
      city: 'FLORENCE · 1913',
      flag: '🎉',
      art: 'o_mona_frame',
      sub: 'Peruggia Arrested!',
      words: ['The', 'Mona Lisa', 'is', 'found!'],
      h: 'The Mona Lisa is found!'
    }
  ];

  /* Lesson 2 Scene 4: Detective Quiz Show (100% wired with 3D art) */
  D.quiz = [
    { q: 'What did Peruggia want to do?', o: ['go to art class', 'steal a painting', 'be a museum guard'], a: 1, e: '🥷', art: 'o_steal', rule: 'He wanted to steal the Mona Lisa!' },
    { q: 'Where did Peruggia hide the Mona Lisa?', o: ['in his hat', 'under his clothes', 'on the wall'], a: 1, e: '🧥', art: 'o_lifted', rule: 'He hid the painting under his white worker coat!' },
    { q: 'What did people line up to see at the museum?', o: ['the news', 'a new statue', 'the empty space'], a: 2, e: '🖼️', art: 'o_robbery', rule: 'People lined up to see the empty space on the wall!' },
    { q: 'How many years did the police look for the painting?', o: ['two years', 'twenty years', 'twelve years'], a: 0, e: '⏳', art: 'c_daphne_case', rule: 'From 1911 to 1913 = two years!' },
    { q: 'Who did the police arrest in 1913?', o: ['Leonardo da Vinci', 'Vincenzo Peruggia', 'the museum guard'], a: 1, e: '👮', art: 'o_arrested', rule: 'The police arrested Peruggia!' }
  ];

  /* Lesson 2 Scene 5: Interactive Museum Security Simulator + Four Corners Debate (Book p. 64 B) */
  D.debate = {
    q: 'Can someone steal a painting from a museum today?',
    yes: 'YES! Maybe a very small painting or with a clever plan.',
    no: 'NO! Modern museums have alarms, cameras, and glass!',
    defenses: [
      { id: 'lasers', icon: '🚨', name: 'Laser Alarms', sentence: 'No, there are loud laser alarms!' },
      { id: 'cameras', icon: '📹', name: 'CCTV Cameras', sentence: 'No, there are cameras watching every wall!' },
      { id: 'guards', icon: '👮', name: 'Police & Guards', sentence: 'No, there are museum guards everywhere!' },
      { id: 'glass', icon: '🛡️', name: 'Bulletproof Glass', sentence: 'No, the Mona Lisa is behind thick glass!' }
    ],
    hint: [
      'Yes, a very small one!',
      'No, there are alarms!',
      'No, there are cameras!',
      'No, there are guards!'
    ]
  };

  /* Lesson 2 Scene 6: Interactive Emotion Studio ("Missing vs. Found" - Book p. 64 C) */
  D.faces = [
    {
      id: 'missing',
      title: 'BOX 1 · 1911: THE PAINTING IS MISSING!',
      art: 'o_robbery',
      defaultEmoji: '😱',
      eyes: ['😳 Wide Eyes', '😨 Worried Eyes', '🥺 Crying Eyes'],
      mouth: ['😱 Open Scream', '😦 Gasping Mouth', '😬 Trembling Teeth'],
      prop: ['🚨 Red Alarm', '📞 Police Phone', '❓ Question Marks'],
      sentence: 'The painting is missing! The museum worker is scared and shocked.'
    },
    {
      id: 'found',
      title: 'BOX 2 · 1913: THE PAINTING IS FOUND!',
      art: 'o_mona_frame',
      defaultEmoji: '😄',
      eyes: ['😊 Happy Eyes', '🤩 Star Eyes', '😌 Relieved Eyes'],
      mouth: ['😄 Big Smile', '🥳 Cheering Mouth', '😂 Laughing'],
      prop: ['🎉 Confetti', '📸 Camera Flash', '🏆 Gold Trophy'],
      sentence: 'The painting is found! The museum worker is very happy.'
    }
  ];

  root.U4G3Data = D;
})(window);
