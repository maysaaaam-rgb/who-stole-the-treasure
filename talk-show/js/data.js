/* Talk Show: speaking lesson data. Grade 3 = Unit 5 "Let's Go Back" (past simple, Jannah, time capsules).
   Grade 4 = Unit 5 "Make Some Noise" (sounds, Foley artists, Beethoven). Two episodes per grade, so a class that has
   two lessons in a day gets a new show. Every card: q (host question), f (sentence frame), a (model answer for 💡 Help). */
window.TALK_SHOW = {
  teams: [
    { n: 'Mics', e: '🎤', c: '#38bdf8' },
    { n: 'Cameras', e: '🎬', c: '#f59e0b' },
    { n: 'Stars', e: '⭐', c: '#10b981' },
    { n: 'Speakers', e: '🔊', c: '#f43f5e' }
  ],
  shows: {
    '3-1': {
      name: 'The Time Show', grade: 3, sub: 'Episode 1 · Back in Time', host: 'Welcome to The Time Show! Today we talk about the past.',
      quick: [
        { q: 'What did you do yesterday?', f: 'Yesterday, I ___.', a: 'Yesterday, I played football.' },
        { q: 'Where were you last summer?', f: 'I was in ___.', a: 'I was in Antalya.' },
        { q: 'What did Jannah open?', f: 'She opened a ___.', a: 'She opened a special book.' },
        { q: 'Where did Jannah go?', f: 'She went to ___.', a: 'She went to ancient Egypt.' },
        { q: 'What did Jannah see in the street?', f: 'She saw a ___.', a: 'She saw a big chariot.' },
        { q: 'Were you happy yesterday?', f: 'Yes, I was. / No, I wasn’t.', a: 'Yes, I was. I was very happy.' },
        { q: 'What did you eat for breakfast?', f: 'I ate ___.', a: 'I ate eggs and bread.' },
        { q: 'Who was the king of ancient Egypt?', f: 'The ___ was the king.', a: 'The pharaoh was the king.' },
        { q: 'What did you watch last night?', f: 'I watched ___.', a: 'I watched a cartoon.' },
        { q: 'How did the old woman feel?', f: 'She was ___.', a: 'She was surprised!' }
      ],
      pics: [
        { img: '../magic-book/art/c_g3_jannah.webp', e: '👧', words: ['girl', 'glasses', 'red', 'pajamas', 'happy'], f: ['I can see a ___.', 'She has ___.', 'She is ___.'] },
        { img: '../magic-book/art/o_g3_chariot.webp', e: '🐎', words: ['chariot', 'gold', 'wheels', 'big', 'pharaoh'], f: ['I can see a ___.', 'It is ___.', 'It has ___.'] },
        { img: '../magic-book/art/c_g3_oldwoman.webp', e: '👵', words: ['old woman', 'basket', 'eyes', 'see', 'surprised'], f: ['She is ___.', 'She has a ___.', 'She can’t ___.'] },
        { img: '../magic-book/art/bg_g3_egypt_street.webp', e: '🏛️', words: ['street', 'ancient', 'hot', 'people', 'old'], f: ['There is a ___.', 'There are ___.', 'It is ___.'] },
        { img: '../magic-book/art/o_g3_timebook.webp', e: '📖', words: ['book', 'old', 'magic', 'open', 'picture'], f: ['It is a ___.', 'Jannah opened ___.', 'It was ___.'] },
        { img: '../magic-book/art/bg_g3_bedroom.webp', e: '🛏️', words: ['bedroom', 'bed', 'books', 'night', 'lamp'], f: ['There is a ___.', 'I can see ___.', 'It is ___.'] }
      ],
      guest: { who: 'Jannah', e: '👧', img: '../magic-book/art/c_g3_jannah.webp', intro: 'You are Jannah. You went to ancient Egypt!',
        qs: [
          { q: 'Where did you go?', a: 'I went to ancient Egypt.' },
          { q: 'What did you see?', a: 'I saw a chariot and the pharaoh.' },
          { q: 'Were you scared?', a: 'Yes, I was. The guards shouted at me!' },
          { q: 'Who did you help?', a: 'I helped an old woman.' },
          { q: 'What did you give her?', a: 'I gave her my glasses.' },
          { q: 'How did you get home?', a: 'My mom woke me up. It was a dream!' }
        ] },
      fast: [
        { t: 'Things you did yesterday', f: 'I played… I watched… I went…', e: '📅' },
        { t: 'Things in ancient Egypt', f: 'pharaoh, chariot, pyramid…', e: '🏛️' },
        { t: 'Feelings', f: 'happy, scared, surprised…', e: '😮' },
        { t: 'Things in your bedroom', f: 'There is a… There are…', e: '🛏️' }
      ],
      bye: 'Thank you for watching The Time Show!'
    },
    '3-2': {
      name: 'Time Capsule TV', grade: 3, sub: 'Episode 2 · Messages for the Future', host: 'Welcome to Time Capsule TV! What can we save for the future?',
      quick: [
        { q: 'What is a time capsule?', f: 'It is a box with ___.', a: 'It is a box with old things for the future.' },
        { q: 'What can we put in our time capsule?', f: 'We can put a ___.', a: 'We can put a photo and a toy.' },
        { q: 'What did people put in the 1795 time capsule?', f: 'They put ___.', a: 'They put coins and newspapers.' },
        { q: 'When did Voyager go to space?', f: 'It went to space in ___.', a: 'It went to space in 1977.' },
        { q: 'What is on the gold disc?', f: 'It says ___ in 55 languages.', a: 'It says hello in 55 languages.' },
        { q: 'What did you like when you were five?', f: 'When I was five, I liked ___.', a: 'When I was five, I liked cars.' },
        { q: 'What toy did you have when you were little?', f: 'I had a ___.', a: 'I had a teddy bear.' },
        { q: 'Who did you play with yesterday?', f: 'I played with ___.', a: 'I played with my brother.' },
        { q: 'What did you do last weekend?', f: 'Last weekend, I ___.', a: 'Last weekend, I went to the park.' },
        { q: 'Did you have a phone when you were five?', f: 'Yes, I did. / No, I didn’t.', a: 'No, I didn’t.' }
      ],
      pics: [
        { img: '../magic-book/art/o_g3_timecapsule.webp', e: '📦', words: ['time capsule', 'box', 'coins', 'photo', 'future'], f: ['It is a ___.', 'There is a ___ in it.', 'I can put ___.'] },
        { img: '../magic-book/art/bg_g3_garden_dig.webp', e: '⛏️', words: ['garden', 'dig', 'ground', 'find', 'old'], f: ['I can see a ___.', 'They dig in the ___.', 'They find ___.'] },
        { img: '', e: '🚀', words: ['spacecraft', 'space', 'gold disc', 'Earth', 'stars'], f: ['It is a ___.', 'It went to ___.', 'It has a ___.'] },
        { img: '', e: '🪙', words: ['coins', 'old', 'gold', 'round', 'money'], f: ['They are ___.', 'They are ___.', 'People put ___ in the box.'] },
        { img: '', e: '📰', words: ['newspaper', 'news', 'old', 'read', 'paper'], f: ['It is a ___.', 'People ___ it.', 'It is ___.'] },
        { img: '', e: '🧸', words: ['teddy bear', 'toy', 'soft', 'brown', 'little'], f: ['It is a ___.', 'It is ___.', 'When I was little, I had ___.'] }
      ],
      guest: { who: 'a Time Traveller', e: '🧳', img: '', intro: 'You are a time traveller. You came from the year 1795!',
        qs: [
          { q: 'Where did you come from?', a: 'I came from the year 1795.' },
          { q: 'What did you have in your bag?', a: 'I had coins and a newspaper.' },
          { q: 'Did you have a phone?', a: 'No, I didn’t!' },
          { q: 'What did you eat?', a: 'I ate bread and apples.' },
          { q: 'What did you play?', a: 'I played with a ball.' },
          { q: 'Do you like the future?', a: 'Yes, I do! It is amazing.' }
        ] },
      fast: [
        { t: 'Things for our time capsule', f: 'a photo, a toy, a letter…', e: '📦' },
        { t: 'Things you did last weekend', f: 'I went… I played… I ate…', e: '🗓️' },
        { t: 'Things in space', f: 'stars, planets, Earth…', e: '🚀' },
        { t: 'Toys you had when you were little', f: 'I had a…', e: '🧸' }
      ],
      bye: 'Thank you for watching Time Capsule TV!'
    },
    '4-1': {
      name: 'Make Some Noise!', grade: 4, sub: 'Episode 1 · The Sound Studio', host: 'Welcome to Make Some Noise! Today we talk about sounds.',
      quick: [
        { q: 'What is your favourite sound?', f: 'My favourite sound is ___.', a: 'My favourite sound is rain.' },
        { q: 'What is a loud sound?', f: '___ is loud.', a: 'Thunder is loud.' },
        { q: 'What is a quiet sound?', f: '___ is quiet.', a: 'A cat is quiet.' },
        { q: 'What can you hear now?', f: 'I can hear ___.', a: 'I can hear the birds outside.' },
        { q: 'What does a Foley artist do?', f: 'A Foley artist makes ___.', a: 'A Foley artist makes sounds for movies.' },
        { q: 'What makes the sound of a horse?', f: '___ make the sound of a horse.', a: 'Coconuts make the sound of a horse.' },
        { q: 'What makes the sound of thunder?', f: 'A piece of ___ makes thunder.', a: 'A piece of metal makes thunder.' },
        { q: 'What instrument can you play?', f: 'I can play the ___.', a: 'I can play the drums.' },
        { q: 'Where does a Foley artist work?', f: 'In a sound ___.', a: 'In a sound studio.' },
        { q: 'What sound wakes you up?', f: 'The ___ wakes me up.', a: 'The alarm clock wakes me up.' }
      ],
      pics: [
        { img: '../magic-book/art/o_g4_soundprops.webp', e: '🥥', words: ['coconuts', 'keys', 'sound', 'footsteps', 'squeak'], f: ['I can see ___.', 'It sounds like ___.', 'They make the sound of ___.'] },
        { img: '../magic-book/art/o_g4_bigdrum.webp', e: '🥁', words: ['drum', 'loud', 'boom', 'big', 'play'], f: ['It is a ___.', 'It is ___.', 'It sounds like ___.'] },
        { img: '../magic-book/art/bg_g4_studio.webp', e: '🎙️', words: ['studio', 'microphone', 'record', 'sounds', 'movie'], f: ['There is a ___.', 'I can see ___.', 'They ___ sounds here.'] },
        { img: '../magic-book/art/c_g4_lina.webp', e: '👧', words: ['girl', 'headphones', 'listen', 'happy', 'music'], f: ['She is ___.', 'She has ___.', 'She can hear ___.'] },
        { img: '', e: '⛈️', words: ['storm', 'thunder', 'rain', 'loud', 'scary'], f: ['It is a ___.', 'I can hear ___.', 'It is ___.'] },
        { img: '', e: '⚔️', words: ['knights', 'swords', 'clang', 'loud', 'metal'], f: ['I can see ___.', 'The swords go ___.', 'It is ___.'] }
      ],
      guest: { who: 'a Foley Artist', e: '🎧', img: '../magic-book/art/c_g4_maya.webp', intro: 'You are a Foley artist. You make sounds for movies!',
        qs: [
          { q: 'Where do you work?', a: 'I work in a sound studio.' },
          { q: 'What do you do?', a: 'I make sounds for movies.' },
          { q: 'How do you make footsteps?', a: 'I walk on a wooden floor.' },
          { q: 'How do you make a horse sound?', a: 'I bang two coconuts together.' },
          { q: 'What is your favourite sound?', a: 'My favourite sound is thunder!' },
          { q: 'Is your job fun?', a: 'Yes, it is! It is very fun.' }
        ] },
      fast: [
        { t: 'Loud things', f: 'thunder, drums, a car…', e: '📢' },
        { t: 'Quiet things', f: 'a cat, rain, a whisper…', e: '🤫' },
        { t: 'Instruments', f: 'drums, guitar, violin…', e: '🎸' },
        { t: 'Sounds in our classroom', f: 'I can hear…', e: '🏫' }
      ],
      bye: 'Thank you for watching Make Some Noise!'
    },
    '4-2': {
      name: 'Concert Night', grade: 4, sub: 'Episode 2 · Music Stars', host: 'Welcome to Concert Night! Today we talk about music.',
      quick: [
        { q: 'What music do you like?', f: 'I like ___ music.', a: 'I like pop music.' },
        { q: 'Do you like loud music or quiet music?', f: 'I like ___ music.', a: 'I like loud music!' },
        { q: 'Who was Beethoven?', f: 'He was a famous ___.', a: 'He was a famous composer.' },
        { q: 'What does an orchestra play?', f: 'It plays ___.', a: 'It plays violins, drums and flutes.' },
        { q: 'Why couldn’t Beethoven hear the crowd?', f: 'Because he was ___.', a: 'Because he was deaf.' },
        { q: 'How did Beethoven feel at the end?', f: 'He felt ___.', a: 'He felt proud.' },
        { q: 'What do we have to do in a concert?', f: 'We have to ___.', a: 'We have to be quiet and listen.' },
        { q: 'What does the audience do at the end?', f: 'They ___.', a: 'They clap and cheer.' },
        { q: 'Can you play the drums?', f: 'Yes, I can. / No, I can’t.', a: 'No, I can’t, but I can sing!' },
        { q: 'Who is your favourite singer?', f: 'My favourite singer is ___.', a: 'My favourite singer is my mom!' }
      ],
      pics: [
        { img: '../magic-book/art/bg_g4_stage.webp', e: '🎭', words: ['stage', 'lights', 'concert', 'audience', 'big'], f: ['There is a ___.', 'I can see ___.', 'It is ___.'] },
        { img: '', e: '🎻', words: ['violin', 'orchestra', 'music', 'play', 'beautiful'], f: ['It is a ___.', 'You ___ it.', 'It sounds ___.'] },
        { img: '', e: '👏', words: ['audience', 'clap', 'cheer', 'happy', 'flowers'], f: ['They ___.', 'They are ___.', 'They throw ___.'] },
        { img: '../magic-book/art/c_g4_maya.webp', e: '👩‍🎤', words: ['singer', 'sing', 'song', 'happy', 'stage'], f: ['She is a ___.', 'She can ___.', 'She is ___.'] },
        { img: '', e: '🎺', words: ['trumpet', 'loud', 'play', 'gold', 'music'], f: ['It is a ___.', 'It is ___.', 'It sounds like ___.'] },
        { img: '', e: '🦅', words: ['eagle', 'fly', 'arms', 'high', 'big'], f: ['It is an ___.', 'It can ___.', 'Beethoven lifts his ___ like an eagle.'] }
      ],
      guest: { who: 'Beethoven', e: '🎼', img: '', intro: 'You are Beethoven. You wrote new music!',
        qs: [
          { q: 'What do you do?', a: 'I write music. I am a composer.' },
          { q: 'How long did your new music take?', a: 'It took ten years!' },
          { q: 'What do you wear?', a: 'I wear a red scarf and a coat.' },
          { q: 'Can you hear the audience?', a: 'No, I can’t. I am deaf.' },
          { q: 'How do you feel?', a: 'I feel proud!' },
          { q: 'What instruments are in your orchestra?', a: 'Violins, drums, flutes and trumpets.' }
        ] },
      fast: [
        { t: 'Instruments in an orchestra', f: 'violin, flute, drum…', e: '🎻' },
        { t: 'Things we do at a concert', f: 'We clap… We listen…', e: '👏' },
        { t: 'Sounds in a storm', f: 'thunder, rain, wind…', e: '⛈️' },
        { t: 'Words with “ou”', f: 'loud, shout, count…', e: '🔤' }
      ],
      bye: 'Thank you for watching Concert Night!'
    }
  }
};
