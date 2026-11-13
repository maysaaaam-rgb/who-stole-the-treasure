/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Curriculum Content: GRADE 4
   Macmillan Global Readings 3 · Unit 1: "I Love Reading" (pp. 8–23 + Review pp. 4–7)
   Texts: "The Beginning of Alice's Adventures" & "Learning and Your Brain"
          (+ Literacy Review: "Monarch Butterfly" & "Don't Move")
   Vocab: sleepy, chased, fell, shelves, corner, vest, waistcoat, lobes,
          workout, cells, fibers, messages, connecting, creative, visualize,
          freeze, migration
   Word Study: -er suffix (reader, writer, thinker, faster, stronger, smaller)
   Grammar: 5W1H Questions (Who/What/Where/When/Why/How), Character Feelings (At first... Then...)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var CH1_CONTENT_G4 = {
    grade: 4,
    chapterId: 'ch1_harbour',
    chapterTitle: 'Chapter 1: Admiral Benbow Harbour',
    themeTitle: 'Global Readings 3 · Unit 1: I Love Reading',
    stops: [
      /* ──────────────────────────────────────────────────────────
         STOP 1: Alice's Storybook Parlour — Character & Plot
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 1,
        clueId: 'g4_c1',
        stopName: 'Alice\'s Storybook Parlour',
        title: 'Clue 1: Down the Rabbit Hole with Alice',
        bookPage: 'Global Readings 3, Unit 1, pp. 10–15',
        npc: { id: 'alice', name: 'Alice & Jim', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: 'Welcome to the Benbow Inn Parlour! Open our first book — Alice\'s Adventures in Wonderland — and trace how Alice\'s feelings change!',
        flintWord: 'At first, Alice felt sleepy. Then she chased the White Rabbit!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s1_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '📖😴',
            promptImg: 'art/z1/s_alice_sleepy.webp',
            promptText: 'Alice sat on the riverbank while her sister read a book with no pictures. How did Alice feel at first?',
            speakText: 'How did Alice feel at first by the riverbank?',
            slowText: 'At ... first, ... Alice ... felt ... sleepy ... and ... bored.',
            hint: 'Look at Alice yawning under the tree: "At first, Alice felt sleepy and bored."',
            correct: { text: 'At first, Alice felt sleepy and bored.', icon: '😴', img: 'art/z1/w_sleepy.webp', speak: 'At first, Alice felt sleepy and bored.' },
            options: [
              { text: 'At first, Alice felt sleepy and bored.', icon: '😴', img: 'art/z1/w_sleepy.webp', speak: 'At first, Alice felt sleepy and bored.' },
              { text: 'At first, Alice rode a fast bicycle.', icon: '🚲', img: 'art/z1/s_bicycle.webp', speak: 'At first, Alice rode a fast bicycle.' },
              { text: 'At first, Alice swept the classroom.', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'At first, Alice swept the classroom.' }
            ]
          },
          {
            id: 'g4_s1_r2',
            speaker: 'Jim Hawkins',
            promptIcon: '🐇⌚',
            promptImg: 'art/z1/s_alice_chase.webp',
            promptText: 'What surprised Alice so much that she jumped to her feet?',
            speakText: 'What surprised Alice so much that she jumped up?',
            slowText: 'A ... White ... Rabbit ... pulled ... a ... watch ... from ... his ... waistcoat!',
            hint: 'Never before had Alice seen a rabbit with a waistcoat pocket and a watch!',
            correct: { text: 'A White Rabbit with a watch in his waistcoat!', icon: '⌚', img: 'art/z1/w_chase.webp', speak: 'A White Rabbit with a watch in his waistcoat!' },
            options: [
              { text: 'A White Rabbit with a watch in his waistcoat!', icon: '⌚', img: 'art/z1/w_chase.webp', speak: 'A White Rabbit with a watch in his waistcoat!' },
              { text: 'A pirate ship on the river.', icon: '⛵', img: 'art/flat/o_hispaniola.webp', speak: 'A pirate ship on the river.' },
              { text: 'A flock of monarch butterflies.', icon: '🦋', img: 'art/z1/s_butterflies.webp', speak: 'A flock of monarch butterflies.' }
            ]
          },
          {
            id: 'g4_s1_r3',
            speaker: 'Captain Flint',
            promptIcon: '🕳️📚',
            promptImg: 'art/z1/s_alice_fall.webp',
            promptText: 'Alice chased the rabbit around the corner and fell down a deep hole! What lined the walls?',
            speakText: 'Alice fell slowly down the rabbit hole! What lined the walls?',
            slowText: 'Cupboards, ... maps, ... and ... bookshelves!',
            hint: 'Look for `shelves` filled with books and maps!',
            correct: { text: 'Cupboards, maps, and bookshelves!', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'Cupboards, maps, and bookshelves!' },
            options: [
              { text: 'Cupboards, maps, and bookshelves!', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'Cupboards, maps, and bookshelves!' },
              { text: 'Snowflakes and icebergs.', icon: '❄️', img: 'art/z1/w_freeze.webp', speak: 'Snowflakes and icebergs.' },
              { text: 'Spinning robot gears.', icon: '⚙️', img: 'art/z1/w_machine.webp', speak: 'Spinning robot gears.' }
            ]
          },
          {
            id: 'g4_s1_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '✨🧐',
            promptImg: 'art/z1/s_curious_brave.webp',
            promptText: 'How did Alice\'s feelings change after she spotted the talking White Rabbit?',
            speakText: 'How did Alice\'s feelings change?',
            slowText: 'Then ... she ... felt ... curious ... and ... brave!',
            hint: 'At first sleepy -> "Then she felt curious and brave!"',
            correct: { text: 'Then she felt curious and brave!', icon: '🧐', img: 'art/z1/w_curious.webp', speak: 'Then she felt curious and brave!' },
            options: [
              { text: 'Then she felt curious and brave!', icon: '🧐', img: 'art/z1/w_curious.webp', speak: 'Then she felt curious and brave!' },
              { text: 'Then she fell fast asleep.', icon: '😴', img: 'art/z1/w_sleep.webp', speak: 'Then she fell fast asleep.' },
              { text: 'Then she cleaned a messy room.', icon: '🧹', img: 'art/z1/w_mess.webp', speak: 'Then she cleaned a messy room.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s1_star1',
            promptIcon: '🐇🏃‍♀️',
            promptImg: 'art/z1/s_alice_chase.webp',
            promptText: 'Order the story sentence and speak it aloud:',
            speakText: 'Curious Alice chased the White Rabbit.',
            targetSentence: 'Curious Alice chased the White Rabbit.',
            words: ['Curious', 'Alice', 'chased', 'the', 'White', 'Rabbit.'],
            distractors: ['sleepy'],
            allowSpeak: true,
            hint: 'Start with "Curious Alice chased", then "the White Rabbit."'
          },
          {
            id: 'g4_s1_star2',
            promptIcon: '🕳️📚',
            promptImg: 'art/z1/s_alice_fall.webp',
            promptText: 'Build the sentence about the rabbit hole walls and say it:',
            speakText: 'She fell slowly past tall bookshelves.',
            targetSentence: 'She fell slowly past tall bookshelves.',
            words: ['She', 'fell', 'slowly', 'past', 'tall', 'bookshelves.'],
            distractors: ['corner'],
            allowSpeak: true,
            hint: 'Put in order: "She fell slowly past tall bookshelves."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 2: Dr. Livesey's Brain Lab — Learning and Your Brain
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 2,
        clueId: 'g4_c2',
        stopName: 'Dr. Livesey\'s Brain Lab',
        title: 'Clue 2: Learning and Your Brain',
        bookPage: 'Global Readings 3, Unit 1, pp. 18–21',
        npc: { id: 'livesey', name: 'Dr. Livesey', art: 'c_livesey', happy: 'c_livesey_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: 'Step up to my science board! Every time you read and learn, your brain lobes, cells, and fibers get an amazing workout!',
        flintWord: 'Brain lobes! Cells and fibers! Connecting messages! Visualize!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s2_r1',
            speaker: 'Dr. Livesey',
            promptIcon: '🧠💪',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Just like sports exercise your muscles, what does reading give your brain?',
            speakText: 'What does reading give your brain?',
            slowText: 'Reading ... gives ... your ... brain ... a ... workout!',
            hint: 'Look for `workout` 🧠💪!',
            correct: { text: 'Reading gives your brain a workout!', icon: '💪', img: 'art/z1/w_workout.webp', speak: 'Reading gives your brain a workout!' },
            options: [
              { text: 'Reading gives your brain a workout!', icon: '💪', img: 'art/z1/w_workout.webp', speak: 'Reading gives your brain a workout!' },
              { text: 'Reading makes your brain freeze.', icon: '🧊', img: 'art/z1/w_freeze.webp', speak: 'Reading makes your brain freeze.' },
              { text: 'Reading hides your memories.', icon: '🙈', img: 'art/z1/w_hide.webp', speak: 'Reading hides your memories.' }
            ]
          },
          {
            id: 'g4_s2_r2',
            speaker: 'Dr. Livesey',
            promptIcon: '⚡🧬',
            promptImg: 'art/z1/s_invent_new.webp',
            promptText: 'Billions of tiny brain cells have thin fibers. What happens when you learn something new?',
            speakText: 'What happens to brain cells and fibers when you learn something new?',
            slowText: 'Cells ... connect ... and ... send ... fast ... messages!',
            hint: 'Keywords: `cells`, `fibers`, `connecting`, `messages`!',
            correct: { text: 'Cells connect and send fast messages!', icon: '⚡', img: 'art/z1/s_invent_new.webp', speak: 'Cells connect and send fast messages!' },
            options: [
              { text: 'Cells connect and send fast messages!', icon: '⚡', img: 'art/z1/s_invent_new.webp', speak: 'Cells connect and send fast messages!' },
              { text: 'Brain lobes go to sleep.', icon: '😴', img: 'art/z1/w_sleep.webp', speak: 'Brain lobes go to sleep.' },
              { text: 'Fibers turn into wooden shelves.', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'Fibers turn into wooden shelves.' }
            ]
          },
          {
            id: 'g4_s2_r3',
            speaker: 'Dr. Livesey',
            promptIcon: '💭🎬',
            promptImg: 'art/z1/s_visualize_read.webp',
            promptText: 'When you read words on a page and picture the scene in your imagination, what are you doing?',
            speakText: 'When you picture a story in your mind, what is that skill called?',
            slowText: 'You ... visualize ... the ... story!',
            hint: 'Keyword: `visualize` 💭!',
            correct: { text: 'You visualize the story!', icon: '💭', img: 'art/z1/w_visualize.webp', speak: 'You visualize the story!' },
            options: [
              { text: 'You visualize the story!', icon: '💭', img: 'art/z1/w_visualize.webp', speak: 'You visualize the story!' },
              { text: 'You chase a waistcoat.', icon: '🧥', img: 'art/z1/w_chase.webp', speak: 'You chase a waistcoat.' },
              { text: 'You sweep the floor.', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'You sweep the floor.' }
            ]
          },
          {
            id: 'g4_s2_r4',
            speaker: 'Dr. Livesey',
            promptIcon: '🎨🌟',
            promptImg: 'art/z1/w_creative.webp',
            promptText: 'Different lobes of your brain team up when you read stories, helping you invent fresh ideas! Reading makes you...',
            speakText: 'Different lobes of your brain team up! Reading makes you...',
            slowText: 'Creative ... and ... imaginative!',
            hint: 'Keyword: `creative` 🎨!',
            correct: { text: 'Creative and imaginative!', icon: '🎨', img: 'art/z1/w_creative.webp', speak: 'Creative and imaginative!' },
            options: [
              { text: 'Creative and imaginative!', icon: '🎨', img: 'art/z1/w_creative.webp', speak: 'Creative and imaginative!' },
              { text: 'Bored and sleepy.', icon: '😴', img: 'art/z1/w_sleepy.webp', speak: 'Bored and sleepy.' },
              { text: 'Stuck in a corner.', icon: '🧱', img: 'art/z1/w_hide.webp', speak: 'Stuck in a corner.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s2_star1',
            promptIcon: '🧠⚡',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Order the science sentence and speak it aloud:',
            speakText: 'Brain cells connect to send messages.',
            targetSentence: 'Brain cells connect to send messages.',
            words: ['Brain', 'cells', 'connect', 'to', 'send', 'messages.'],
            distractors: ['waistcoat'],
            allowSpeak: true,
            hint: 'Start with "Brain cells connect", then "to send messages."'
          },
          {
            id: 'g4_s2_star2',
            promptIcon: '💭📖',
            promptImg: 'art/z1/s_visualize_read.webp',
            promptText: 'Build the reading strategy sentence and say it aloud:',
            speakText: 'Creative readers visualize stories in their mind.',
            targetSentence: 'Creative readers visualize stories in their mind.',
            words: ['Creative', 'readers', 'visualize', 'stories', 'in', 'their', 'mind.'],
            distractors: ['shelves'],
            allowSpeak: true,
            hint: 'Start with "Creative readers visualize", then "stories in their mind."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 3: 5W1H Question Compass Wheel
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 3,
        clueId: 'g4_c3',
        stopName: '5W1H Ship\'s Wheel',
        title: 'Clue 3: Master Who, What, Where, When, Why & How',
        bookPage: 'Global Readings 3, Unit 1, pp. 16–17',
        npc: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: 'Great readers ask six smart questions while they read: Who, What, Where, When, Why, and How!',
        flintWord: 'Who? What? Where? When? Why? How?',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s3_r1',
            speaker: 'Captain Flint',
            promptIcon: '🙋‍♀️❓',
            promptImg: 'art/z1/s_alice_chase.webp',
            promptText: 'Choose the right question word for a PERSON: "___ chased the White Rabbit?" — "Alice!"',
            speakText: 'Choose the right question word: blank chased the White Rabbit? Alice!',
            slowText: 'Who ... chased ... the ... White ... Rabbit?',
            hint: 'For a person or character, ask "Who?"',
            correct: { text: 'Who chased the White Rabbit?', icon: '🙋‍♀️', img: 'art/z1/s_alice_chase.webp', speak: 'Who chased the White Rabbit?' },
            options: [
              { text: 'Who chased the White Rabbit?', icon: '🙋‍♀️', img: 'art/z1/s_alice_chase.webp', speak: 'Who chased the White Rabbit?' },
              { text: 'When chased the White Rabbit?', icon: '⏰', img: 'art/flat/o_compass.webp', speak: 'When chased the White Rabbit?' },
              { text: 'Where chased the White Rabbit?', icon: '🗺️', img: 'art/flat/o_map_scroll.webp', speak: 'Where chased the White Rabbit?' }
            ]
          },
          {
            id: 'g4_s3_r2',
            speaker: 'Captain Flint',
            promptIcon: '📍🕳️',
            promptImg: 'art/z1/s_alice_fall.webp',
            promptText: 'Choose the right question word for a PLACE: "___ did Alice fall?" — "Down the deep rabbit hole!"',
            speakText: 'Choose the right question word for a place: blank did Alice fall?',
            slowText: 'Where ... did ... Alice ... fall?',
            hint: 'For a place or setting, ask "Where?"',
            correct: { text: 'Where did Alice fall?', icon: '📍', img: 'art/z1/s_alice_fall.webp', speak: 'Where did Alice fall?' },
            options: [
              { text: 'Where did Alice fall?', icon: '📍', img: 'art/z1/s_alice_fall.webp', speak: 'Where did Alice fall?' },
              { text: 'Who did Alice fall?', icon: '🙋', img: 'art/z1/c_alice.webp', speak: 'Who did Alice fall?' },
              { text: 'What watch is it?', icon: '⌚', img: 'art/z1/w_chase.webp', speak: 'What watch is it?' }
            ]
          },
          {
            id: 'g4_s3_r3',
            speaker: 'Jim Hawkins',
            promptIcon: '💡🧐',
            promptImg: 'art/z1/s_curious_brave.webp',
            promptText: 'Choose the question word for a REASON: "___ did Alice follow him?" — "Because she was curious!"',
            speakText: 'Choose the question word for a reason: blank did Alice follow him?',
            slowText: 'Why ... did ... Alice ... follow ... him?',
            hint: '"Why...?" matches "Because...!"',
            correct: { text: 'Why did Alice follow him?', icon: '💡', img: 'art/z1/w_curious.webp', speak: 'Why did Alice follow him?' },
            options: [
              { text: 'Why did Alice follow him?', icon: '💡', img: 'art/z1/w_curious.webp', speak: 'Why did Alice follow him?' },
              { text: 'When is your bookshelf?', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'When is your bookshelf?' },
              { text: 'Who is a waistcoat?', icon: '🧥', img: 'art/z1/w_sleepy.webp', speak: 'Who is a waistcoat?' }
            ]
          },
          {
            id: 'g4_s3_r4',
            speaker: 'Dr. Livesey',
            promptIcon: '⚙️🧠',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Choose the question word for MANNER / PROCESS: "___ do we make brain pathways stronger?" — "By practicing!"',
            speakText: 'Choose the question word: blank do we make brain pathways stronger? By practicing!',
            slowText: 'How ... do ... we ... make ... brain ... pathways ... stronger?',
            hint: 'To ask the way something works, use "How?"',
            correct: { text: 'How do we make brain pathways stronger?', icon: '🧠', img: 'art/z1/w_workout.webp', speak: 'How do we make brain pathways stronger?' },
            options: [
              { text: 'How do we make brain pathways stronger?', icon: '🧠', img: 'art/z1/w_workout.webp', speak: 'How do we make brain pathways stronger?' },
              { text: 'Where is Mr. Rabbit\'s name?', icon: '🐇', img: 'art/z1/s_rabbit_freeze.webp', speak: 'Where is Mr. Rabbit\'s name?' },
              { text: 'Who time is afternoon?', icon: '☀️', img: 'art/z1/s_alice_sleepy.webp', speak: 'Who time is afternoon?' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s3_star1',
            promptIcon: '❓🐇',
            promptImg: 'art/z1/s_alice_chase.webp',
            promptText: 'Build the WHY question and ask it aloud:',
            speakText: 'Why did Alice chase the rabbit?',
            targetSentence: 'Why did Alice chase the rabbit?',
            words: ['Why', 'did', 'Alice', 'chase', 'the', 'rabbit?'],
            distractors: ['Where'],
            allowSpeak: true,
            hint: 'Start with "Why did Alice", then "chase the rabbit?"'
          },
          {
            id: 'g4_s3_star2',
            promptIcon: '❓🧠',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Build the HOW question about your brain and say it:',
            speakText: 'How does reading help your brain?',
            targetSentence: 'How does reading help your brain?',
            words: ['How', 'does', 'reading', 'help', 'your', 'brain?'],
            distractors: ['Who'],
            allowSpeak: true,
            hint: 'Put in order: "How does reading help your brain?"'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 4: Spyglass Word Detective — `-er` Suffix & Review
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 4,
        clueId: 'g4_c4',
        stopName: 'Pier Spyglass Lookout',
        title: 'Clue 4: -er Word Detective & Animal Survival',
        bookPage: 'Global Readings 3, pp. 4–7 & p. 21',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'benbow', name: 'Benbow', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: 'Stand on the wooden pier and scan the horizon! Spot -er words (reader, writer, thinker, faster, stronger) and animal survival clues!',
        flintWord: 'Reader, writer, thinker! Faster and stronger! Migration and freeze!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s4_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '📚🔎',
            promptImg: 'art/z1/s_love_reading.webp',
            promptText: 'Add -er to a verb to name a person! Someone who teaches is a teacher. Someone who reads is a...',
            speakText: 'Someone who teaches is a teacher. Someone who reads is a...',
            slowText: 'A ... curious ... reader!',
            hint: 'read + er = "reader"!',
            correct: { text: 'A curious reader!', icon: '📖', img: 'art/z1/s_love_reading.webp', speak: 'A curious reader!' },
            options: [
              { text: 'A curious reader!', icon: '📖', img: 'art/z1/s_love_reading.webp', speak: 'A curious reader!' },
              { text: 'A pocket waistcoat!', icon: '🧥', img: 'art/z1/w_chase.webp', speak: 'A pocket waistcoat!' },
              { text: 'A wooden shelf!', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'A wooden shelf!' }
            ]
          },
          {
            id: 'g4_s4_r2',
            speaker: 'Dr. Livesey',
            promptIcon: '⚡💪',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Add -er to an adjective to compare! When brain fibers connect, messages travel...',
            speakText: 'When brain fibers connect, messages travel...',
            slowText: 'Faster ... and ... stronger!',
            hint: 'fast + er = faster; strong + er = stronger!',
            correct: { text: 'Faster and stronger!', icon: '⚡', img: 'art/z1/w_workout.webp', speak: 'Faster and stronger!' },
            options: [
              { text: 'Faster and stronger!', icon: '⚡', img: 'art/z1/w_workout.webp', speak: 'Faster and stronger!' },
              { text: 'Sleepy and bored.', icon: '😴', img: 'art/z1/w_sleepy.webp', speak: 'Sleepy and bored.' },
              { text: 'Behind the corner.', icon: '🧱', img: 'art/z1/w_hide.webp', speak: 'Behind the corner.' }
            ]
          },
          {
            id: 'g4_s4_r3',
            speaker: 'Jim Hawkins',
            promptIcon: '🦋🌎',
            promptImg: 'art/z1/s_butterflies.webp',
            promptText: 'Literacy Review! Millions of Monarch butterflies fly thousands of kilometers south before winter. What is that journey called?',
            speakText: 'Millions of Monarch butterflies fly south before winter. What is that long journey called?',
            slowText: 'A ... long ... migration!',
            hint: 'Keyword from pp. 4–5: `migration` 🦋!',
            correct: { text: 'Migration!', icon: '🦋', img: 'art/z1/s_butterflies.webp', speak: 'Migration!' },
            options: [
              { text: 'Migration!', icon: '🦋', img: 'art/z1/s_butterflies.webp', speak: 'Migration!' },
              { text: 'Bookshelves!', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'Bookshelves!' },
              { text: 'Waistcoat!', icon: '🧥', img: 'art/z1/w_chase.webp', speak: 'Waistcoat!' }
            ]
          },
          {
            id: 'g4_s4_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '🐇🌿',
            promptImg: 'art/z1/s_rabbit_freeze.webp',
            promptText: 'From "Don\'t Move!" (pp. 6–7): Why does a wild cottontail rabbit suddenly FREEZE completely still?',
            speakText: 'Why does a wild rabbit suddenly freeze completely still?',
            slowText: 'So ... predators ... do ... not ... spot ... it!',
            hint: 'Blending in without moving keeps the rabbit safe!',
            correct: { text: 'So predators do not spot it!', icon: '🐇', img: 'art/z1/s_rabbit_freeze.webp', speak: 'So predators do not spot it!' },
            options: [
              { text: 'So predators do not spot it!', icon: '🐇', img: 'art/z1/s_rabbit_freeze.webp', speak: 'So predators do not spot it!' },
              { text: 'Because it is reading a map.', icon: '🗺️', img: 'art/flat/o_map_scroll.webp', speak: 'Because it is reading a map.' },
              { text: 'To check its pocket watch.', icon: '⌚', img: 'art/z1/s_alice_chase.webp', speak: 'To check its pocket watch.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s4_star1',
            promptIcon: '📖💪',
            promptImg: 'art/z1/s_love_reading.webp',
            promptText: 'Order the -er word sentence and say it aloud:',
            speakText: 'Every reader becomes a stronger thinker.',
            targetSentence: 'Every reader becomes a stronger thinker.',
            words: ['Every', 'reader', 'becomes', 'a', 'stronger', 'thinker.'],
            distractors: ['sleepy'],
            allowSpeak: true,
            hint: 'Three -er words! "Every reader becomes a stronger thinker."'
          },
          {
            id: 'g4_s4_star2',
            promptIcon: '🦋🌎',
            promptImg: 'art/z1/s_butterflies.webp',
            promptText: 'Order the Monarch butterfly sentence and speak it:',
            speakText: 'Monarch butterflies fly south on their migration.',
            targetSentence: 'Monarch butterflies fly south on their migration.',
            words: ['Monarch', 'butterflies', 'fly', 'south', 'on', 'their', 'migration.'],
            distractors: ['shelves'],
            allowSpeak: true,
            hint: 'Start with "Monarch butterflies fly south", then "on their migration."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 5: Billy Bones's Wonderland & Brain Chest — Boss Finale
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 5,
        clueId: 'g4_c5',
        stopName: "Billy's Story Chest",
        title: 'Clue 5: Unlock Billy Bones\'s Sea Chest',
        bookPage: 'Global Readings 3, Unit 1 Review, pp. 22–23',
        npc: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: 'Shiver me timbers, Reader! Solve four Unit 1 master locks to open my sea chest and claim Map Piece Number One!',
        flintWord: 'Alice, brain lobes, visualize, and -er words! Open the chest!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s5_r1',
            speaker: 'Billy Bones',
            promptIcon: '🔒1️⃣',
            promptImg: 'art/z1/s_alice_chase.webp',
            promptText: 'Lock 1! Where did the White Rabbit disappear just before Alice jumped down the rabbit hole?',
            speakText: 'Lock One! Where did the White Rabbit turn before disappearing?',
            slowText: 'He ... turned ... the ... corner!',
            hint: 'Vocab word: `corner`!',
            correct: { text: 'He turned the corner and hopped down the hole!', icon: '🐇', img: 'art/z1/s_alice_chase.webp', speak: 'He turned the corner and hopped down the hole!' },
            options: [
              { text: 'He turned the corner and hopped down the hole!', icon: '🐇', img: 'art/z1/s_alice_chase.webp', speak: 'He turned the corner and hopped down the hole!' },
              { text: 'He climbed onto the Hispaniola.', icon: '⛵', img: 'art/flat/o_hispaniola.webp', speak: 'He climbed onto the Hispaniola.' },
              { text: 'He went to sleep on a bookshelf.', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'He went to sleep on a bookshelf.' }
            ]
          },
          {
            id: 'g4_s5_r2',
            speaker: 'Billy Bones',
            promptIcon: '🔒2️⃣',
            promptImg: 'art/z1/w_workout.webp',
            promptText: 'Lock 2! Which parts of your brain control thinking, seeing, hearing, and moving?',
            speakText: 'Lock Two! Which sections of your brain work together when you read?',
            slowText: 'The ... different ... lobes ... of ... your ... brain!',
            hint: 'Vocab word from "Learning and Your Brain": `lobes`!',
            correct: { text: 'The different lobes of your brain!', icon: '🧠', img: 'art/z1/w_workout.webp', speak: 'The different lobes of your brain!' },
            options: [
              { text: 'The different lobes of your brain!', icon: '🧠', img: 'art/z1/w_workout.webp', speak: 'The different lobes of your brain!' },
              { text: 'The buttons on a waistcoat.', icon: '🧥', img: 'art/z1/w_chase.webp', speak: 'The buttons on a waistcoat.' },
              { text: 'The wooden planks of the pier.', icon: '⚓', img: 'art/flat/o_barrel_dock.webp', speak: 'The wooden planks of the pier.' }
            ]
          },
          {
            id: 'g4_s5_r3',
            speaker: 'Billy Bones',
            promptIcon: '🔒3️⃣',
            promptImg: 'art/z1/s_visualize_read.webp',
            promptText: 'Lock 3! Alice thought, "What is the use of a book without pictures?" How can a reader enjoy a book with no pictures?',
            speakText: 'Lock Three! How can a reader enjoy a book with no pictures?',
            slowText: 'By ... visualizing ... pictures ... in ... their ... own ... mind!',
            hint: 'Good readers create mental pictures (`visualize`)!',
            correct: { text: 'By visualizing pictures in their own mind!', icon: '💭', img: 'art/z1/s_visualize_read.webp', speak: 'By visualizing pictures in their own mind!' },
            options: [
              { text: 'By visualizing pictures in their own mind!', icon: '💭', img: 'art/z1/s_visualize_read.webp', speak: 'By visualizing pictures in their own mind!' },
              { text: 'By tearing out all the pages.', icon: '💥', img: 'art/z1/s_z1_broken.webp', speak: 'By tearing out all the pages.' },
              { text: 'By hiding the book in a dark corner.', icon: '🙈', img: 'art/z1/w_hide.webp', speak: 'By hiding the book in a dark corner.' }
            ]
          },
          {
            id: 'g4_s5_r4',
            speaker: 'Billy Bones',
            promptIcon: '🔒4️⃣',
            promptImg: 'art/flat/o_billy_chest.webp',
            promptText: 'Final Lock! Which pair shows BOTH kinds of -er words (person noun + comparative adjective)?',
            speakText: 'Final Lock! Which pair shows both a person noun and a comparative adjective ending in E-R?',
            slowText: 'A ... writer ... and ... faster!',
            hint: 'write + er = writer (person); fast + er = faster (compare)!',
            correct: { text: 'writer (a person) & faster (comparing)!', icon: '🏆', img: 'art/flat/o_chest_open.webp', speak: 'Writer and faster!' },
            options: [
              { text: 'writer (a person) & faster (comparing)!', icon: '🏆', img: 'art/flat/o_chest_open.webp', speak: 'Writer and faster!' },
              { text: 'corner & waistcoat', icon: '🧥', img: 'art/z1/w_chase.webp', speak: 'Corner and waistcoat.' },
              { text: 'sleepy & shelves', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'Sleepy and shelves.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s5_star1',
            promptIcon: '🧠📖',
            promptImg: 'art/z1/s_visualize_read.webp',
            promptText: 'Order the Unit 1 Big Idea sentence and speak it aloud:',
            speakText: 'Reading gives our brain a creative workout!',
            targetSentence: 'Reading gives our brain a creative workout!',
            words: ['Reading', 'gives', 'our', 'brain', 'a', 'creative', 'workout!'],
            distractors: ['sleepy'],
            allowSpeak: true,
            hint: 'Put in order: "Reading gives our brain a creative workout!"'
          },
          {
            id: 'g4_s5_star2',
            promptIcon: '🗺️🏴‍☠️',
            promptImg: 'art/flat/o_map_piece1.webp',
            promptText: 'Unlock Map Piece #1! Order and say the victory sentence:',
            speakText: 'Curious readers unlock every treasure chest!',
            targetSentence: 'Curious readers unlock every treasure chest!',
            words: ['Curious', 'readers', 'unlock', 'every', 'treasure', 'chest!'],
            distractors: ['bored'],
            allowSpeak: true,
            hint: 'Start with "Curious readers unlock", then "every treasure chest!"'
          }
        ]
      }
    ]
  };

  root.CH1_CONTENT_G4 = CH1_CONTENT_G4;
})(typeof window !== 'undefined' ? window : this);
