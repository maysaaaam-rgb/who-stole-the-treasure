/* Grade 3 · Unit 4 · Lesson 3 (pp. 65–69): The Angry Mountain — Hybrid Pro Data */
(function (window) {
  'use strict';
  window.L3Data = {
    questGoal: 20,
    questLabel: '⛵ Rescue Stars',
    teams: [
      { n: 'Foxes', e: '🦊', c: '#f97316' },
      { n: 'Owls',  e: '🦉', c: '#a855f7' },
      { n: 'Cats',  e: '🐱', c: '#f43f5e' },
      { n: 'Wolves',e: '🐺', c: '#38bdf8' }
    ],
    cast: {
      nova:    { name: 'Nova',    role: 'Cause & Effect Guide', color: '#a855f7', dark: '#6b21a8' },
      bubbles: { name: 'Bubbles', role: 'Word Explorer',        color: '#38bdf8', dark: '#0369a1' },
      blaze:   { name: 'Blaze',   role: 'Story Captain',        color: '#f97316', dark: '#9a3412' },
      rosie:   { name: 'Rosie',   role: 'Sailboat Skipper',     color: '#f43f5e', dark: '#9f1239' },
      sprout:  { name: 'Sprout',  role: 'Cheer Leader',         color: '#10b981', dark: '#065f46' }
    },
    /* Station 1: Island Explorer Map & Words in Context (p. 67) */
    words: [
      { id: 'thunder', w: 'thunder', pos: 'NOUN', posCol: '#38bdf8', art: 'o_thunder', x: 26, y: 26, spot: '⛈️ Storm Cloud',
        def: 'A very loud BOOM sound in the sky during a storm.',
        ex: 'The mountain made a loud sound like thunder!',
        mime: 'Cover your ears and shake like a big BOOM of thunder!' },
      { id: 'bark', w: 'bark', pos: 'VERB / NOUN', posCol: '#f59e0b', art: 'o_bark', x: 22, y: 72, spot: '🐕 Village Dog',
        def: 'The loud short sound a dog makes: Woof! Woof!',
        ex: 'The dogs in the village started to bark loudly.',
        mime: 'Cup your hands by your mouth and bark twice: Woof! Woof!' },
      { id: 'ash', w: 'ash', pos: 'NOUN', posCol: '#38bdf8', art: 'o_ash', x: 52, y: 30, spot: '🌋 Volcano Crater',
        def: 'Soft grey powder that falls from a burning fire or volcano.',
        ex: 'Hot ash and small stones fell from the dark sky.',
        mime: 'Wiggle your fingers from high to low like falling ash!' },
      { id: 'dream', w: 'dream', pos: 'NOUN / VERB', posCol: '#a855f7', art: 'o_dream', x: 64, y: 74, spot: '⛵ Sleeping Boat',
        def: 'Pictures and stories in your head while you are sleeping.',
        ex: 'I tried to sleep on the boat, but I had a bad dream.',
        mime: 'Rest your cheek on your hands, then wake up with wide eyes!' },
      { id: 'sunrise', w: 'sunrise', pos: 'NOUN', posCol: '#10b981', art: 'o_sunrise', x: 82, y: 34, spot: '🌅 Ocean Horizon',
        def: 'The time in the morning when the sun comes up in the sky.',
        ex: 'At sunrise, we saw a big ship on the sea!',
        mime: 'Make a big circle with your arms rising up like the morning sun!' }
    ],
    /* Station 2: Cause & Effect Gear Machine (p. 65) */
    causeEffect: [
      { cause: 'Smoke and ash came out of the volcano', causeArt: 'o_volcano',
        effect: 'the sky turned very dark.', effectArt: 'o_ash',
        soSent: 'Smoke and ash came out, SO the sky turned very dark.',
        becSent: 'The sky turned dark BECAUSE smoke and ash came out.' },
      { cause: 'The mountain made a loud sound like thunder', causeArt: 'o_thunder',
        effect: 'the village dogs started to bark.', effectArt: 'o_bark',
        soSent: 'The mountain roared like thunder, SO the dogs started to bark.',
        becSent: 'The dogs barked BECAUSE the mountain roared like thunder.' },
      { cause: 'Hot stones fell on the island beach', causeArt: 'c_girl_tree',
        effect: 'Papa put the family into the wooden boat.', effectArt: 'c_family_boat',
        soSent: 'Hot stones fell on the beach, SO Papa put the family in the boat.',
        becSent: 'They got into the boat BECAUSE hot stones fell on the beach.' },
      { cause: 'The sun came up at sunrise', causeArt: 'o_sunrise',
        effect: 'the family saw a big rescue ship!', effectArt: 'o_ship',
        soSent: 'The sun came up at sunrise, SO they saw a big rescue ship!',
        becSent: 'They saw the rescue ship BECAUSE the sun came up at sunrise.' }
    ],
    /* Station 3: Interactive 5-Scene Story Theater (pp. 66-69) */
    chapters: [
      { num: 1, title: 'Scene 1 · Up in the Palm Tree (p. 66)', art: 'c_girl_tree', bg: 'bg_beach_volcano',
        story: 'In 1815, a girl climbed up a tall palm tree on a sunny island beach in Indonesia. Suddenly, she saw dark smoke on Mount Tambora!',
        tpr: '🧍 Stand up and climb a tall palm tree with your hands and feet, then shade your eyes to look at the mountain!',
        q: 'What did the girl see from the top of the palm tree?',
        opts: ['Dark smoke on the mountain', 'A snowy winter park', 'A museum guard'], ans: 0 },
      { num: 2, title: 'Scene 2 · BOOM! Thunder & Barking Dogs (p. 67)', art: 'o_thunder', bg: 'bg_beach_volcano',
        story: 'BOOM! The angry mountain made a loud noise like thunder. Dogs started to bark in the village, and the girl climbed down fast!',
        tpr: '🙉 Cover your ears for the big BOOM, then climb down fast and bark like the village dog!',
        q: 'Why did the girl climb down the tree so fast?',
        opts: ['Because the mountain went BOOM like thunder', 'Because she wanted ice cream', 'Because it was bedtime'], ans: 0 },
      { num: 3, title: 'Scene 3 · Ash Falls! Run to Papa’s Boat (p. 68)', art: 'o_boat', bg: 'bg_beach_volcano',
        story: 'Grey ash and hot stones fell from the dark sky. Mama and Papa grabbed her hand: "Hurry! Get into the wooden boat!"',
        tpr: '🏃‍♂️ Shield your head from falling ash and row the wooden boat hard with both arms!',
        q: 'How did the girl and her parents escape from the island?',
        opts: ['In Papa’s small wooden boat', 'On a fast city train', 'In a big airplane'], ans: 0 },
      { num: 4, title: 'Scene 4 · A Bad Dream on the Dark Sea (p. 68)', art: 'o_dream', bg: 'bg_sea_sunrise',
        story: 'All night, the boat sailed on the dark sea. The girl was scared and cried. When she slept, she had a bad dream about the angry mountain.',
        tpr: '😴 Put your hands under your cheek to sleep, shiver in a bad dream, and hug your family!',
        q: 'What happened while the girl slept on the boat at night?',
        opts: ['She had a bad dream', 'She played basketball', 'She painted a picture'], ans: 0 },
      { num: 5, title: 'Scene 5 · Sunrise & The Big Rescue Ship! (p. 69)', art: 'o_ship', bg: 'bg_sea_sunrise',
        story: 'At sunrise, golden light shone on the water. Papa shouted: "Look! A big ship!" Everyone waved both hands. They were safe!',
        tpr: '🙌 Jump up, wave both arms high in the air, and shout: "Look! A big ship! We are safe!"',
        q: 'What did the family see on the sea at sunrise?',
        opts: ['A big rescue ship', 'A school bus', 'Another volcano'], ans: 0 }
    ],
    /* Station 4: Sail to the Rescue Ship! (Arcade Boat Race, pp. 66-69) */
    raceQuestions: [
      { q: 'Which word means a loud BOOM sound in a storm?', a: 'thunder', opts: ['thunder', 'sunrise', 'dream'], art: 'o_thunder' },
      { q: 'Which word means soft grey powder falling from a volcano?', a: 'ash', opts: ['ash', 'bark', 'sunrise'], art: 'o_ash' },
      { q: 'Cause: Smoke and ash filled the sky. What was the EFFECT?', a: 'The sky turned very dark.', opts: ['The sky turned very dark.', 'It started to snow.', 'The museum closed.'], art: 'o_volcano' },
      { q: 'Where did the story "The Angry Mountain" happen?', a: 'On an island near Mount Tambora', opts: ['On an island near Mount Tambora', 'In the Louvre Museum in Paris', 'On a train platform'], art: 'c_girl_tree' },
      { q: 'Why did the village dogs start to bark?', a: 'Because they heard the loud volcano', opts: ['Because they heard the loud volcano', 'Because they saw a cat', 'Because they were cold'], art: 'o_bark' },
      { q: 'When did the family see the big rescue ship?', a: 'At sunrise in the morning', opts: ['At sunrise in the morning', 'At midnight in the dark', 'Before the volcano erupted'], art: 'o_sunrise' }
    ]
  };
})(window);
