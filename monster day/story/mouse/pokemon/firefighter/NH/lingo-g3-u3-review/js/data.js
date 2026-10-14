/* Grade 3 · Unit 3 "It Keeps Changing" · Review with the monster cast (Lingokids-style pilot).
   Five short stations on a journey map, each led by one monster who talks to the children (recorded Gemini voices in voice/).
   Facts come from the checked unit notes (unit3-work/out/final/unit3-grade4.json: in this school the book is taught in Grade 3).
   Every line a monster says is in LINES (id -> who + text); make-voices.js turns them into voice/<id>.mp3. */
(function (root) {
  'use strict';
  var D = {};

  /* The cast. art: cast pictures (idle/talk/blink) once Gemini has drawn them; old: the illustrated species pictures used until then. */
  D.cast = {
    bubbles: { name: 'Bubbles', color: '#38bdf8', dark: '#0369a1', voice: 'Zephyr', species: 'aquafind',
      style: 'Say this as a small, curious, wide-eyed cartoon monster talking to children, bright and wondering:' },
    blaze: { name: 'Blaze', color: '#f97316', dark: '#c2410c', voice: 'Puck', species: 'emberwing',
      style: 'Say this as a brave, energetic cartoon monster hero talking to children, excited, like the start of an adventure:' },
    sprout: { name: 'Sprout', color: '#22c55e', dark: '#15803d', voice: 'Achernar', species: 'florasprout',
      style: 'Say this as a gentle, kind cartoon monster talking to children, soft, warm and slow, very reassuring:' },
    nova: { name: 'Nova', color: '#a855f7', dark: '#7e22ce', voice: 'Iapetus', species: 'astralight',
      style: 'Say this as a clever, friendly cartoon monster teacher talking to children, clear and slow, smiling:' },
    rosie: { name: 'Rosie', color: '#ec4899', dark: '#be185d', voice: 'Sadachbia', species: 'florasprout', tint: 'hue-rotate(215deg) saturate(1.25)',
      style: 'Say this as a funny, giggly cartoon monster talking to children, bubbly and delighted:' }
  };

  /* Short praise and try-again lines for each monster (one is picked at random) */
  D.praise = { bubbles: ['b_ok1', 'b_ok2'], nova: ['n_ok1', 'n_ok2'], rosie: ['r_ok1', 'r_ok2'], blaze: ['z_ok1', 'z_ok2'], sprout: ['s_ok1', 's_ok2'] };
  D.retry = { bubbles: 'b_no', nova: 'n_no', rosie: 'r_no', blaze: 'z_no', sprout: 's_no' };

  D.LINES = {
    welcome: ['nova', 'Hello, friends! I am Nova. Today we remember our unit: It Keeps Changing. Let\'s go on a journey together!'],
    map_next: ['nova', 'Where do we go next? Tap the shining star!'],
    finale1: ['nova', 'You finished the whole journey! You are amazing!'],
    finale2: ['rosie', 'Hooray! Let\'s have a party! Clap, clap, clap!'],

    b_ok1: ['bubbles', 'Pop! You got it!'], b_ok2: ['bubbles', 'Yes! Great listening!'], b_no: ['bubbles', 'Oops! Listen again.'],
    n_ok1: ['nova', 'Correct! Well done.'], n_ok2: ['nova', 'Yes, that\'s right!'], n_no: ['nova', 'Hmm, not quite. Try again.'],
    r_ok1: ['rosie', 'Woohoo! Yes!'], r_ok2: ['rosie', 'You did it! Super!'], r_no: ['rosie', 'Oh no! Try again. You can do it!'],
    z_ok1: ['blaze', 'Zoom! Correct!'], z_ok2: ['blaze', 'Yes! You win!'], z_no: ['blaze', 'Not that one. Try again!'],
    s_ok1: ['sprout', 'Lovely! That\'s right.'], s_ok2: ['sprout', 'Well done, my friend.'], s_no: ['sprout', 'That\'s okay. Let\'s try again.'],

    /* 1 · Bubbles: Ice Words */
    b_intro: ['bubbles', 'Hi! I am Bubbles! Listen to the word, and pop the right bubble!'],
    b_ice: ['bubbles', 'Where is the ice? Pop it!'],
    b_hole: ['bubbles', 'Where is the hole? Pop it!'],
    b_thin: ['bubbles', 'Where is the thin ice? Pop it!'],
    b_melting: ['bubbles', 'Where is the melting ice? Pop it!'],
    b_bear: ['bubbles', 'Where is the polar bear? Pop it!'],
    b_crack: ['bubbles', 'Where is the crack? Pop it!'],

    /* 2 · Nova: The Bear and I */
    n_intro: ['nova', 'Do you remember the poem, The Bear and I? Put the story in order. Tap the first picture!'],
    n_next: ['nova', 'What happens next?'],
    n_s1: ['nova', 'A young man fishes through a hole in the ice.'],
    n_s2: ['nova', 'One day, a giant polar bear takes his fish.'],
    n_s3: ['nova', 'The ice is thin. It cracks, and they fall in.'],
    n_s4: ['nova', 'In the cold water, the bear is not his enemy.'],
    n_s5: ['nova', 'Today the ice is melting, and the man is old.'],
    n_outro: ['nova', 'Wonderful! You know the whole story!'],

    /* 3 · Rosie: the ng sound */
    r_intro: ['rosie', 'Hi, I am Rosie! Listen for the sound ng, like in sing. Tap the word with ng at the end!'],
    r_1: ['rosie', 'Sing... or sun?'],
    r_2: ['rosie', 'Fishing... or fish?'],
    r_3: ['rosie', 'Melting... or ice?'],
    r_4: ['rosie', 'Long... or small?'],
    r_5: ['rosie', 'Spring... or snow?'],
    r_6: ['rosie', 'King... or car?'],
    r_outro: ['rosie', 'Sing, long, spring! Great ears!'],

    /* 4 · Blaze: Clean Cars */
    z_intro: ['blaze', 'I am Blaze! Let\'s race! Listen, and find the right car!'],
    z_solar: ['blaze', 'This car uses energy from the sun.'],
    z_electric: ['blaze', 'This car uses electricity. It is fast, quiet and clean, but it is expensive.'],
    z_gasoline: ['blaze', 'This car uses gasoline. It is fast, but it is noisy and dirty.'],
    z_air: ['blaze', 'This car uses air. It is small and slow, but it is clean.'],
    z_biofuel: ['blaze', 'This car uses biofuel from plants, like corn.'],
    z_outro: ['blaze', 'Clean cars are good for the world!'],

    /* 5 · Sprout: Good Changes */
    s_intro: ['sprout', 'Hello, I am Sprout. How can we make good changes in our world? Choose a picture.'],
    s_bike: ['sprout', 'I can ride a bike to school, because bikes are clean.'],
    s_trash: ['sprout', 'I can clean up trash, because trash is a danger for animals.'],
    s_sun: ['sprout', 'I can use energy from the sun, because it is clean.'],
    s_air: ['sprout', 'I can walk to school, because cars make the air dirty.'],
    s_you: ['sprout', 'Now you! Say it with me.'],
    s_outro: ['sprout', 'You can make good changes. I am so proud of you!']
  };

  /* The journey: five stations, Arctic to city */
  D.stations = [
    { id: 'words', who: 'bubbles', title: 'Ice Words', icon: 'w_ice', bg: 'bg_arctic_ice' },
    { id: 'story', who: 'nova', title: 'The Bear and I', icon: 'c_polar_bear', bg: 'bg_cabin_snow' },
    { id: 'ng', who: 'rosie', title: 'The ng Sound', icon: 'w_melting', bg: 'bg_arctic_melting' },
    { id: 'cars', who: 'blaze', title: 'Clean Cars', icon: 'car_solar', bg: 'bg_city_traffic' },
    { id: 'change', who: 'sprout', title: 'Good Changes', icon: 'w_bike', bg: 'bg_clean_city' }
  ];

  /* 1 · listen and pop: a = picture, w = word, line = what Bubbles says */
  D.words = [
    { a: 'w_ice', w: 'ice', line: 'b_ice' }, { a: 'w_hole', w: 'hole', line: 'b_hole' }, { a: 'w_thin', w: 'thin ice', line: 'b_thin' },
    { a: 'w_melting', w: 'melting', line: 'b_melting' }, { a: 'w_polar_bear', w: 'polar bear', line: 'b_bear' }, { a: 'w_crack', w: 'crack', line: 'b_crack' }
  ];
  D.wordDistractors = ['w_fishing_rod', 'w_swim', 'w_fur', 'w_arctic', 'w_trap', 'w_danger'];

  /* 2 · the poem in order */
  D.story = [
    { a: 'c_young_fisherman', line: 'n_s1', t: 'A young man fishes through a hole in the ice.' },
    { a: 'c_polar_bear', line: 'n_s2', t: 'One day, a giant polar bear takes his fish.' },
    { a: 'w_crack', line: 'n_s3', t: 'The ice is thin. It cracks, and they fall in.' },
    { a: 'w_swim', line: 'n_s4', t: 'In the cold water, the bear is not his enemy.' },
    { a: 'c_old_fisherman', line: 'n_s5', t: 'Today the ice is melting, and the man is old.' }
  ];

  /* 3 · which word ends with ng? (e = emoji for words that have no picture yet) */
  D.ng = [
    { line: 'r_1', yes: { w: 'sing', e: '🎤' }, no: { w: 'sun', e: '☀️' } },
    { line: 'r_2', yes: { w: 'fishing', a: 'w_fishing_rod' }, no: { w: 'fish', e: '🐟' } },
    { line: 'r_3', yes: { w: 'melting', a: 'w_melting' }, no: { w: 'ice', a: 'w_ice' } },
    { line: 'r_4', yes: { w: 'long', e: '🐍' }, no: { w: 'small', e: '🐜' } },
    { line: 'r_5', yes: { w: 'spring', e: '🌸' }, no: { w: 'snow', e: '❄️' } },
    { line: 'r_6', yes: { w: 'king', e: '👑' }, no: { w: 'car', a: 'car_electric' } }
  ];

  /* 4 · listen and find the car */
  D.cars = [
    { a: 'car_solar', w: 'solar car', line: 'z_solar' }, { a: 'car_electric', w: 'electric car', line: 'z_electric' },
    { a: 'car_gasoline', w: 'gasoline car', line: 'z_gasoline' }, { a: 'car_air', w: 'air car', line: 'z_air' },
    { a: 'car_biofuel', w: 'biofuel car', line: 'z_biofuel' }
  ];

  /* 5 · good changes: I can ... because ... */
  D.changes = [
    { a: 'w_bike', line: 's_bike', t: 'I can ride a bike to school, because bikes are clean.' },
    { a: 'w_trash', line: 's_trash', t: 'I can clean up trash, because trash is a danger for animals.' },
    { a: 'w_solar_panel', line: 's_sun', t: 'I can use energy from the sun, because it is clean.' },
    { a: 'w_clean_air', line: 's_air', t: 'I can walk to school, because cars make the air dirty.' }
  ];

  root.LINGO = D;
})(typeof window !== 'undefined' ? window : this);
