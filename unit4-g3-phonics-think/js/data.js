/* Grade 3 · Unit 4 · Lesson 4 (pp. 70–71): Explore, -nd Phonics Factory & Think Together — Hybrid Pro Data */
(function (window) {
  'use strict';
  window.L4Data = {
    questGoal: 20,
    questLabel: '🏭 Phonics & Story Stars',
    teams: [
      { n: 'Foxes', e: '🦊', c: '#f97316' },
      { n: 'Owls',  e: '🦉', c: '#a855f7' },
      { n: 'Cats',  e: '🐱', c: '#f43f5e' },
      { n: 'Wolves',e: '🐺', c: '#38bdf8' }
    ],
    cast: {
      nova:    { name: 'Nova',    role: 'Reading Detective',    color: '#a855f7', dark: '#6b21a8' },
      blaze:   { name: 'Blaze',   role: 'Volcano Freeze Host',  color: '#f97316', dark: '#9a3412' },
      bubbles: { name: 'Bubbles', role: '-nd Factory Engineer', color: '#38bdf8', dark: '#0369a1' },
      rosie:   { name: 'Rosie',   role: 'Balloon Pop Host',     color: '#f43f5e', dark: '#9f1239' },
      sprout:  { name: 'Sprout',  role: 'Think Together Guide', color: '#10b981', dark: '#065f46' }
    },
    /* Station 1: Explore the Reading A-B (p. 70) */
    exploreQs: [
      { q: '1. Where was the girl at the beginning of the story?', art: 'c_girl_tree',
        opts: ['Up in a tall palm tree on the beach', 'Inside a museum in Paris', 'At a train station'], ans: 0 },
      { q: '2. Why did the dogs bark and the girl climb down?', art: 'o_bark',
        opts: ['Because Mount Tambora made a loud BOOM', 'Because it was snowing', 'Because school started'], ans: 0 },
      { q: '3. How did Papa, Mama, and the girl leave the island?', art: 'c_family_boat',
        opts: ['In Papa’s small wooden boat', 'In a big airplane', 'By riding bicycles'], ans: 0 },
      { q: '4. What happened while the girl slept on the boat?', art: 'o_dream',
        opts: ['She had a bad dream about the volcano', 'She found the Mona Lisa', 'She ate birthday cake'], ans: 0 },
      { q: '5. Why did the family wave and shout at sunrise?', art: 'o_ship',
        opts: ['Because they saw a big rescue ship!', 'Because they saw a dolphin', 'Because they wanted to swim'], ans: 0 }
    ],
    /* Station 2: Volcano Freeze & 4 Feeling Corners (Book p. 70 C) */
    corners: [
      { id: 'scared',   label: '😱 Corner 1: SCARED / AFRAID', color: '#f43f5e', frame: 'In 1815, I felt scared because hot ash fell from the sky!' },
      { id: 'safe',     label: '🛟 Corner 2: SAFE / STRONG',   color: '#38bdf8', frame: 'In 1815, I felt safe because Papa had a wooden boat!' },
      { id: 'thankful', label: '🙏 Corner 3: THANKFUL',        color: '#a855f7', frame: 'In 1815, I felt thankful because the big ship rescued us!' },
      { id: 'happy',    label: '😄 Corner 4: HAPPY',           color: '#10b981', frame: 'At sunrise, I felt happy because my family was together!' }
    ],
    feelingMoments: [
      { title: 'Moment 1 · BOOM! Dark smoke and hot ash fall from Mount Tambora!', art: 'o_volcano', ask: 'Walk to a corner! How do you feel right now? Why?' },
      { title: 'Moment 2 · Papa holds your hand tight inside the wooden boat!', art: 'c_family_boat', ask: 'Walk to a corner! How do you feel with your family in the boat?' },
      { title: 'Moment 3 · Golden sunrise! A big ship sails toward your boat!', art: 'o_sunrise', ask: 'Walk to a corner! How do you feel when you see the rescue ship?' }
    ],
    /* Station 3: The -nd Phonics Letter Factory (Book p. 70 Phonics: end, stand, wind, send, find, hand) */
    ndWords: [
      { w: 'wind',  art: 'o_wind',       sent: 'Strong wind pushed our sailboat across the sea.' },
      { w: 'hand',  art: 'o_hand',       sent: 'Wave your hand at the big rescue ship!' },
      { w: 'send',  art: 'o_send',       sent: 'I will send a letter to my grandma.' },
      { w: 'find',  art: 'o_find',       sent: 'Can you find a shiny shell on the beach?' },
      { w: 'stand', art: 'o_stand',      sent: 'Please stand up and act out the word!' },
      { w: 'end',   art: 'o_end_finish', sent: 'At the end of the story, the family is safe!' }
    ],
    /* Station 4: Pop the -nd Balloons (p. 70) */
    ndPool: ['wind', 'hand', 'send', 'find', 'stand', 'end', 'sand', 'island', 'sound', 'behind'],
    nonNdPool: ['cat', 'ship', 'sun', 'boat', 'dog', 'ash', 'tree', 'hat'],
    /* Station 5: Two-Story Train & 3-Step Interview (Book p. 71 Think Together) */
    trainCards: [
      { text: 'A thief hid in a small museum room and took a famous painting.', car: 'mona', art: 'o_mona_frame' },
      { text: 'Mount Tambora erupted with thunder, smoke, and grey ash.', car: 'mountain', art: 'o_volcano' },
      { text: 'A family sailed all night in a wooden boat and saw a ship at sunrise.', car: 'mountain', art: 'o_ship' },
      { text: 'The police arrested Peruggia and brought the painting back to Paris.', car: 'mona', art: 'o_police' },
      { text: 'It tells us WHAT HAPPENED in a big event from the past!', car: 'both', art: 'o_newspaper' },
      { text: 'Every event had a CAUSE (why) and an EFFECT (what happened next)!', car: 'both', art: 'o_sunrise' }
    ]
  };
})(window);
