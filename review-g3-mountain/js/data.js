/* Grade 3 Review: The Angry Mountain (book Reading 2, pp. 64-71). Own wording; book text is not copied. */
(function (root) {
  'use strict';
  var D = {};
  D.teams = [
    { n: 'Hawks', e: '🦅', c: '#f97316' }, { n: 'Tigers', e: '🐯', c: '#ef4444' },
    { n: 'Bears', e: '🐻', c: '#8b5cf6' }, { n: 'Sharks', e: '🦈', c: '#0ea5e9' }
  ];
  /* Game 1: Volcano Words (Words in Context, p. 67: thunder, bark, ash, dream, sunrise) */
  D.words = [
    { w: 'thunder', e: '⛈️', a: 'o_thunder', ex: 'A loud sound like thunder came from the mountain.', gap: 'A loud sound like ____ came from the mountain.', act: 'stomp your feet and clap loudly like thunder!' },
    { w: 'bark', e: '🐕', a: 'o_bark', ex: 'The dogs in the village began to bark.', gap: 'The dogs in the village began to ____.', act: 'cup your hands and bark twice like a friendly puppy!' },
    { w: 'ash', e: '🌋', a: 'o_ash', ex: 'Dark grey ash and small stones fell from the sky.', gap: 'Dark grey ____ and small stones fell from the sky.', act: 'wiggle your fingers high up and float down like falling ash!' },
    { w: 'dream', e: '💭', a: 'o_dream', ex: 'I tried to sleep on the boat, but I had a bad dream.', gap: 'I tried to sleep on the boat, but I had a bad ____.', act: 'rest your head on your hands, then wake up with wide eyes!' },
    { w: 'sunrise', e: '🌅', a: 'o_sunrise', ex: 'At sunrise, we looked back at the island.', gap: 'At ____, we looked back at the island.', act: 'make a big circle with your arms rising up like the morning sun!' }
  ];
  /* Game 2: Escape the Island! (Put the events in order, pp. 66-69 & Cause/Effect p. 65/71) */
  D.routes = [
    {
      title: '🌋 Escape from Mount Tambora (pp. 66-69)',
      e: '⛵',
      stops: [
        'The girl plays on the beach near Papa’s boat.',
        'Loud noises like thunder start and the ground shakes.',
        'She climbs a palm tree and sees fire on Mount Tambora.',
        'Dogs bark in the village and a dark cloud fills the sky.',
        'Papa packs the boat and the family sails away in the dark.',
        'At sunrise, a big ship sees them wave and rescues them!'
      ],
      art: ['bg_beach_volcano', 'o_thunder', 'c_girl_tree', 'o_bark', 'c_family_boat', 'o_ship'],
      icons: ['🏖️', '⛈️', '🌴', '🐕', '⛵', '🚢']
    },
    {
      title: '🔗 Cause and Effect Chain (pp. 65 & 71)',
      e: '🔗',
      stops: [
        'Cause: Peruggia steals the Mona Lisa from the wall.',
        'Effect: People line up to see the empty space!',
        'Cause: Peruggia tries to sell the painting in 1913.',
        'Effect: The art dealer calls the police and they arrest him.',
        'Cause: Ash and stones fall from Mount Tambora.',
        'Effect: It is so dark that the family cannot see the mountain!'
      ],
      art: ['o_volcano', 'bg_beach_volcano', 'o_ash', 'c_family_boat', 'o_sunrise', 'bg_sea_sunrise'],
      icons: ['🖼️', '👀', '📞', '🚓', '🌋', '🌑']
    }
  ];
  D.stops = ['First,', 'Then,', 'Next,', 'After that,', 'Soon,', 'Finally,'];
  /* Game 3: Phonics -nd Blends & Feelings Spotlight (p. 70) */
  D.chars = [
    { k: 'end', n: 'end (-nd)', e: '🏁', a: null },
    { k: 'stand', n: 'stand (-nd)', e: '🧍', a: null },
    { k: 'wind', n: 'wind (-nd)', e: '💨', a: null },
    { k: 'send', n: 'send (-nd)', e: '✉️', a: null },
    { k: 'find', n: 'find (-nd)', e: '🔍', a: 'c_girl_tree' },
    { k: 'hand', n: 'hand (-nd)', e: '✋', a: null }
  ];
  D.lines = [
    { t: 'I needed to ____ Mama and Papa in the village!', who: 'find', act: 'Put your hand above your eyes and look around: FIND!' },
    { t: 'Please ____ up tall and wave at the big ship!', who: 'stand', act: 'Stand up tall and wave both arms: STAND!' },
    { t: 'The strong ____ pushed the white sail of our boat.', who: 'wind', act: 'Blow like the ocean wind and sway: WIND!' },
    { t: 'Hold Mama’s ____ tightly inside the small boat.', who: 'hand', act: 'Hold out your hand to your teammate: HAND!' },
    { t: 'At the ____ of the story, the family is safe on the ship.', who: 'end', act: 'Give a big thumbs-up and smile: END!' },
    { t: 'Let’s ____ a thank-you letter to the ship captain!', who: 'send', act: 'Pretend to write a note and toss it into a mailbox: SEND!' }
  ];
  /* Closing: Feelings & Cause-Effect Spinner (pp. 70 C & 71) */
  D.late = ['scared', 'safe', 'thankful', 'sad', 'strong', 'happy'];
  D.because = [
    'the mountain made a loud thunder sound',
    'ash and stones fell from the dark sky',
    'Mama hugged me close in the boat',
    'the big ship saw us and helped our family',
    'nothing was left of our island home',
    'our family stayed together'
  ];
  D.then = [
    'I ran to find Mama and Papa',
    'we sailed away on Papa’s boat',
    'we waved at the big ship',
    'we looked at the golden sunrise',
    'I held Mama’s hand tightly',
    'we thanked the sailors'
  ];
  root.RevG3MData = D;
})(window);
