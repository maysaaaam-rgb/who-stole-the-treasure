/* Grade 4 Review: Late for the Show (book Reading 2, pp. 62-70). Own wording; the book text is not copied. */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];
  /* Game 1: Curtain Up. A clue sentence, the team says the word, then everybody ACTS it. */
  D.words = [
    { w: 'show', e: '🎭', a: 'o_curtain', ex: 'The show starts at six o’clock.', gap: 'The ____ starts at six o’clock.', act: 'bow like an actor and open your arms.' },
    { w: 'calm', e: '😌', a: null, ex: 'Please stay calm and wait here.', gap: 'Please stay ____ and wait here.', act: 'take a deep breath and put your hands down slowly.' },
    { w: 'platform', e: '🚉', a: 'bg_platform', ex: 'We wait for the train on the platform.', gap: 'We wait for the train on the ____.', act: 'stand behind a line and look for the train.' },
    { w: 'sank', e: '🚢', a: 'o_sank', ex: 'The ship sank in the storm.', gap: 'The ship ____ in the storm.', act: 'sink down slowly to the floor.' },
    { w: 'alive', e: '🙌', a: null, ex: 'My brother is alive! He is not hurt.', gap: 'My brother is ____! He is not hurt.', act: 'jump up and shout: I am alive!' }
  ];
  /* Game 2: Get Harry to the Stage. Two routes of six events. */
  D.routes = [
    { title: '🚇 Harry’s trip to the show', e: '🚇', stops: ['Harry and his friends practise the play.', 'Harry’s car is stuck in traffic.', 'Harry and his mom get on the train.', 'The train has a problem.', 'Harry finds his friends on the platform.', 'They perform the play on the platform.'],
      art: ['bg_stage', 'o_traffic', 'o_train', 'o_clock', 'bg_platform', 'o_curtain'], icons: ['🎭', '🚗', '🚇', '⚠️', '🚉', '🎉'] },
    { title: '🌊 Inside the play', e: '🌊', stops: ['A big storm hits the ship.', 'The ship sinks.', 'Viola wakes up on the beach.', 'She cannot find her brother.', 'She sees her brother. He is alive!', 'They hug and everybody claps.'],
      art: [null, 'o_sank', null, 'c_riya', 'c_arush', 'c_mr_williams'], icons: ['⛈️', '🚢', '🏖️', '😟', '🙌', '👏'] }
  ];
  D.stops = ['First,', 'Then,', 'Next,', 'After that,', 'Soon,', 'Finally,'];
  /* Game 3: Spotlight, who said it? */
  D.chars = [
    { k: 'harry', n: 'Harry', e: '🌳', a: 'c_harry_tree' }, { k: 'mom', n: 'Harry’s mom', e: '👩', a: 'c_mom' }, { k: 'dad', n: 'Harry’s dad', e: '👨', a: 'c_dad' },
    { k: 'riya', n: 'Riya', e: '👸', a: 'c_riya' }, { k: 'arush', n: 'Arush', e: '🤵', a: 'c_arush' }, { k: 'lynn', n: 'Lynn', e: '🦸‍♀️', a: 'c_lynn' }, { k: 'mr', n: 'Mr. Williams', e: '🧑‍🏫', a: 'c_mr_williams' }
  ];
  D.lines = [
    { t: 'We are never going to get there!', who: 'harry', act: 'Sad and tired, hands on your head.' },
    { t: 'Look at all the traffic!', who: 'dad', act: 'Worried, looking at the road.' },
    { t: 'Don’t worry. There is plenty of time.', who: 'mom', act: 'Calm and kind, hand up.' },
    { t: 'Why don’t we perform the show here?', who: 'lynn', act: 'A bright idea, one finger up!' },
    { t: 'Sebastian! You are alive!', who: 'riya', act: 'Open your arms like an actress.' },
    { t: 'Great teamwork! I am so proud of you.', who: 'mr', act: 'Clap and smile.' },
    { t: 'Yes, let’s do it!', who: 'arush', act: 'Thumbs up, big smile.' },
    { t: 'Don’t be nervous. It’s your first time on stage.', who: 'mr', act: 'Kind teacher voice, pat a shoulder.' }
  ];
  /* Excuse round: I was late for ... because ... Then I ... */
  D.late = ['the school play', 'the bus', 'my lesson', 'football practice', 'the school trip', 'my friend’s party'];
  D.because = ['my car was stuck in traffic', 'the train stopped', 'I lost my shoe', 'my cat sat on my bag', 'I fell asleep', 'the bus broke down'];
  D.then = ['I ran to the door', 'I waved at the driver', 'I shouted for help', 'I walked very fast', 'I called my friend', 'I said sorry'];
  root.RevG4SData = D;
})(window);
