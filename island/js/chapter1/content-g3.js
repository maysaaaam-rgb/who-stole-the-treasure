/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Curriculum Content: GRADE 3
   Theme 1: "School Life" (Global Reading 2 & MEB Maarif Model)
   All English lines, audio IDs, illustrated `.webp` pictures, answers,
   distractors, and hints.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var CH1_CONTENT_G3 = {
    grade: 3,
    chapterId: 'ch1_harbour',
    chapterTitle: 'Chapter 1: Admiral Benbow Harbour',
    themeTitle: 'Theme 1 · School Life (Global Reading 2)',
    stops: [
      /* ──────────────────────────────────────────────────────────
         STOP 1: Benbow Inn Door — Greetings
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 1,
        clueId: 'g3_c1',
        stopName: 'Benbow Inn Door',
        title: 'Clue 1: Greet Jim at the Inn Door',
        bookPage: 'Global Reading 2, Unit 1, p. ___',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: "Good afternoon, friend! Knock on the Benbow Inn door and greet me in English to get our first clue!",
        introLineId: 'g3_s1_jim_intro',
        flintWord: "Good afternoon! How are you? I'm good, thanks!",
        flintLineId: 'g3_s1_flint_01',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s1_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '☀️👋',
            promptImg: 'art/flat/c_jim_happy.webp',
            promptText: 'Good afternoon! How are you?',
            speakText: 'Good afternoon! How are you?',
            lineId: 'g3_s1_jim_01',
            slowText: 'Good afternoon! ... How are you?',
            hint: 'Pick the friendly answer: "I\'m good, thanks!" 😊',
            correct: { text: "I'm good, thanks!", icon: '😊👍', img: 'art/flat/c_jim_happy.webp', speak: "I'm good, thanks!", lineId: 'g3_s1_ans_01' },
            options: [
              { text: "I'm good, thanks!", icon: '😊👍', img: 'art/flat/c_jim_happy.webp', speak: "I'm good, thanks!" },
              { text: 'Good night!', icon: '🌙😴', img: 'art/z2/s_full_moon.webp', speak: 'Good night!' },
              { text: 'In the gym.', icon: '🏀🏟️', img: 'art/z4/s_players_court.webp', speak: 'In the gym.' }
            ]
          },
          {
            id: 'g3_s1_r2',
            speaker: 'Jim Hawkins',
            promptIcon: '🌅☀️',
            promptImg: 'art/z4/w_sunrise.webp',
            promptText: 'The morning sun is rising over the harbour! What do we say?',
            speakText: 'The morning sun is rising! Say: Good morning, Jim!',
            lineId: 'g3_s1_jim_02',
            slowText: 'Good ... morning, ... Jim!',
            hint: 'Look for the rising morning sun 🌅: "Good morning, Jim!"',
            correct: { text: 'Good morning, Jim!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning, Jim!', lineId: 'g3_s1_ans_02' },
            options: [
              { text: 'Good morning, Jim!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning, Jim!' },
              { text: 'Good night!', icon: '🌙🛌', img: 'art/z4/w_bedtime.webp', speak: 'Good night!' },
              { text: 'See you tomorrow!', icon: '👋🚪', img: 'art/flat/o_door_open.webp', speak: 'See you tomorrow!' }
            ]
          },
          {
            id: 'g3_s1_r3',
            speaker: 'Captain Flint',
            promptIcon: '🌆🏮',
            promptImg: 'art/flat/o_lantern.webp',
            promptText: 'The harbour lanterns glow in the evening! Greet Billy Bones:',
            speakText: 'The harbour lanterns glow in the evening! Say: Good evening!',
            lineId: 'g3_s1_flint_02',
            slowText: 'Good ... evening!',
            hint: 'Look for the evening lantern 🌆🏮: "Good evening!"',
            correct: { text: 'Good evening!', icon: '🌆🏮', img: 'art/flat/o_lantern.webp', speak: 'Good evening!', lineId: 'g3_s1_ans_03' },
            options: [
              { text: 'Good evening!', icon: '🌆🏮', img: 'art/flat/o_lantern.webp', speak: 'Good evening!' },
              { text: 'Good morning!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning!' },
              { text: 'Happy birthday!', icon: '🎂🎈', img: 'art/flat/o_cake.webp', speak: 'Happy birthday!' }
            ]
          },
          {
            id: 'g3_s1_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '🌙⭐',
            promptImg: 'art/z2/s_full_moon.webp',
            promptText: 'The stars are out and Benbow is sleepy. What do we say at bedtime?',
            speakText: 'The stars are out! Say: Good night! Nice to meet you!',
            lineId: 'g3_s1_jim_03',
            slowText: 'Good ... night! ... Nice to meet you!',
            hint: 'Look for the moon and stars 🌙⭐: "Good night! Nice to meet you!"',
            correct: { text: 'Good night! Nice to meet you!', icon: '🌙⭐', img: 'art/z2/s_full_moon.webp', speak: 'Good night! Nice to meet you!', lineId: 'g3_s1_ans_04' },
            options: [
              { text: 'Good night! Nice to meet you!', icon: '🌙⭐', img: 'art/z2/s_full_moon.webp', speak: 'Good night! Nice to meet you!' },
              { text: 'Good morning!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning!' },
              { text: 'There are two books.', icon: '📚✨', img: 'art/flat/o_book.webp', speak: 'There are two books.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s1_star1',
            promptIcon: '☀️👋',
            promptImg: 'art/flat/c_jim_happy.webp',
            promptText: 'Order the words and say the greeting to Jim:',
            speakText: "How are you? I'm good, thanks!",
            lineId: 'g3_s1_star_01',
            targetSentence: "I'm good, thanks!",
            words: ["I'm", 'good,', 'thanks!'],
            distractors: ['night'],
            allowSpeak: true,
            hint: 'Start with "I\'m", then "good,", then "thanks!"'
          },
          {
            id: 'g3_s1_star2',
            promptIcon: '🤝😊',
            promptImg: 'art/flat/o_benbow_inn.webp',
            promptText: 'Greet Jim at the Admiral Benbow Inn:',
            speakText: 'Good afternoon! Nice to meet you!',
            lineId: 'g3_s1_star_02',
            targetSentence: 'Good afternoon! Nice to meet you!',
            words: ['Good', 'afternoon!', 'Nice', 'to', 'meet', 'you!'],
            distractors: ['library'],
            allowSpeak: true,
            hint: 'Start with "Good afternoon!" then "Nice to meet you!"'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 2: Harbour Sea School Notice Board — People & Places
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 2,
        clueId: 'g3_c2',
        stopName: 'Harbour Sea School Board',
        title: 'Clue 2: Where Did Benbow Run?',
        bookPage: 'Global Reading 2, Unit 1, p. ___',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'benbow', name: 'Benbow the Leopard', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: "Benbow the baby leopard ran to the Harbour School Board! Listen and tap the right person or room!",
        introLineId: 'g3_s2_jim_intro',
        flintWord: "Who's this? This is the librarian. Where is Benbow? He's in the music room.",
        flintLineId: 'g3_s2_flint_01',
        easyEngine: 'listenTap',
        starEngine: 'dragMatch',
        rounds: [
          {
            id: 'g3_s2_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '📚👩‍🏫',
            promptImg: 'art/z1/s_love_reading.webp',
            promptText: "Who's this? She helps us find books in the library.",
            speakText: "Who's this? This is the librarian.",
            lineId: 'g3_s2_jim_01',
            slowText: "Who's this? ... This is the librarian.",
            hint: 'Look for the books 📚: "This is the librarian."',
            correct: { text: 'This is the librarian.', icon: '📚👩‍🏫', img: 'art/z1/s_love_reading.webp', speak: 'This is the librarian.' },
            options: [
              { text: 'This is the librarian.', icon: '📚👩‍🏫', img: 'art/z1/s_love_reading.webp', speak: 'This is the librarian.' },
              { text: 'This is the caretaker.', icon: '🧹🛠️', img: 'art/z1/s_cleans_floor.webp', speak: 'This is the caretaker.' },
              { text: 'This is the sports field.', icon: '⚽🌿', img: 'art/z4/s_players_court.webp', speak: 'This is the sports field.' }
            ]
          },
          {
            id: 'g3_s2_r2',
            speaker: 'Captain Flint',
            promptIcon: '🐆🎵',
            promptImg: 'art/flat/subj_music.webp',
            promptText: 'Where is Benbow? Listen to the piano and drums!',
            speakText: "Where is Benbow? He's in the music room.",
            lineId: 'g3_s2_flint_02',
            slowText: "Where is Benbow? ... He's in the music room.",
            hint: 'Look for the musical instruments 🎵🥁: "He\'s in the music room."',
            correct: { text: "He's in the music room.", icon: '🎵🎹', img: 'art/flat/subj_music.webp', speak: "He's in the music room." },
            options: [
              { text: "He's in the music room.", icon: '🎵🎹', img: 'art/flat/subj_music.webp', speak: "He's in the music room." },
              { text: "He's in the office.", icon: '🗂️🪑', img: 'art/flat/f_table.webp', speak: "He's in the office." },
              { text: "He's in the corridor.", icon: '🚪🚶', img: 'art/flat/o_gate_arrow.webp', speak: "He's in the corridor." }
            ]
          },
          {
            id: 'g3_s2_r3',
            speaker: 'Jim Hawkins',
            promptIcon: '🩺🩹',
            promptImg: 'art/flat/v_nurse_happy.webp',
            promptText: 'Is there a school nurse at school? Who helps us when we feel sick?',
            speakText: "Who's this? This is the school nurse. Yes, there is!",
            lineId: 'g3_s2_jim_02',
            slowText: 'This is the ... school nurse.',
            hint: 'Look for the friendly nurse 🩺: "This is the school nurse."',
            correct: { text: 'This is the school nurse.', icon: '🩺🩹', img: 'art/flat/v_nurse_happy.webp', speak: 'This is the school nurse.' },
            options: [
              { text: 'This is the school nurse.', icon: '🩺🩹', img: 'art/flat/v_nurse_happy.webp', speak: 'This is the school nurse.' },
              { text: 'This is my classmate.', icon: '🎒🧒', img: 'art/flat/v_boy_happy.webp', speak: 'This is my classmate.' },
              { text: 'This is the meeting room.', icon: '🪑📋', img: 'art/z4/s_teamwork.webp', speak: 'This is the meeting room.' }
            ]
          },
          {
            id: 'g3_s2_r4',
            speaker: 'Captain Flint',
            promptIcon: '🎨🖌️',
            promptImg: 'art/flat/subj_art.webp',
            promptText: 'Where is your classmate painting a picture?',
            speakText: "She's in the art room. There are colourful paints in the art room!",
            lineId: 'g3_s2_flint_03',
            slowText: "She's in the ... art room.",
            hint: 'Look for the paint palette and brush 🎨🖌️: "She\'s in the art room."',
            correct: { text: "She's in the art room.", icon: '🎨🖌️', img: 'art/flat/subj_art.webp', speak: "She's in the art room." },
            options: [
              { text: "She's in the art room.", icon: '🎨🖌️', img: 'art/flat/subj_art.webp', speak: "She's in the art room." },
              { text: "She's in the gym.", icon: '🏀🤸', img: 'art/z1/w_workout.webp', speak: "She's in the gym." },
              { text: 'This is the headteacher.', icon: '🏫👔', img: 'art/flat/c_livesey_happy.webp', speak: 'This is the headteacher.' }
            ]
          },
          {
            id: 'g3_s2_r5',
            speaker: 'Jim Hawkins',
            promptIcon: '🏫🔑',
            promptImg: 'art/flat/c_livesey_happy.webp',
            promptText: 'Who leads our school and works with the caretaker to keep every room safe?',
            speakText: 'This is the headteacher and this is the caretaker!',
            lineId: 'g3_s2_jim_03',
            slowText: 'This is the headteacher ... and the caretaker!',
            hint: 'Tap "The headteacher and the caretaker" 🏫🔑!',
            correct: { text: 'The headteacher and the caretaker', icon: '🏫🔑', img: 'art/flat/c_livesey_happy.webp', speak: 'This is the headteacher and this is the caretaker!' },
            options: [
              { text: 'The headteacher and the caretaker', icon: '🏫🔑', img: 'art/flat/c_livesey_happy.webp', speak: 'This is the headteacher and this is the caretaker!' },
              { text: 'Two birthday cakes', icon: '🎂🎂', img: 'art/flat/o_cake.webp', speak: 'Two birthday cakes' },
              { text: 'Good night!', icon: '🌙⭐', img: 'art/z2/s_full_moon.webp', speak: 'Good night!' }
            ]
          }
        ],
        starPairs: [
          {
            id: 'g3_s2_p1',
            prompt: "This is the librarian. She's in the library.",
            speak: "This is the librarian. She's in the library.",
            leftIcon: '👩‍🏫📚',
            leftImg: 'art/z1/s_love_reading.webp',
            leftLabel: 'the librarian',
            rightIcon: '🏛️📖',
            rightImg: 'art/flat/o_book.webp',
            rightLabel: 'in the library'
          },
          {
            id: 'g3_s2_p2',
            prompt: "Benbow is in the music room!",
            speak: "Where is Benbow? He's in the music room.",
            leftIcon: '🐆🎶',
            leftImg: 'art/flat/c_benbow_happy.webp',
            leftLabel: 'Benbow',
            rightIcon: '🎵🎹',
            rightImg: 'art/flat/subj_music.webp',
            rightLabel: 'in the music room'
          },
          {
            id: 'g3_s2_p3',
            prompt: "My classmate is on the sports field.",
            speak: "Where is your classmate? He's on the sports field.",
            leftIcon: '🧒🎒',
            leftImg: 'art/flat/v_boy_happy.webp',
            leftLabel: 'my classmate',
            rightIcon: '⚽🌿',
            rightImg: 'art/z4/s_players_court.webp',
            rightLabel: 'on the sports field'
          },
          {
            id: 'g3_s2_p4',
            prompt: "The headteacher is in the office.",
            speak: "Where is the headteacher? She's in the office.",
            leftIcon: '🏫👔',
            leftImg: 'art/flat/c_livesey_happy.webp',
            leftLabel: 'the headteacher',
            rightIcon: '🗂️🪑',
            rightImg: 'art/flat/f_table.webp',
            rightLabel: 'in the office'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 3: Ship Wheel — Months of the Year (12 Spokes)
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 3,
        clueId: 'g3_c3',
        stopName: 'The Ship Wheel',
        title: 'Clue 3: Turn the Twelve Months Wheel',
        bookPage: 'Global Reading 2, Unit 1, p. ___',
        npc: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        companion: { id: 'benbow', name: 'Benbow the Leopard', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: "Squawk! Each spoke on the Hispaniola's wheel is a month of the year! Put the months in order from January to December!",
        introLineId: 'g3_s3_flint_intro',
        flintWord: "January, February, March, April, May, June, July, August, September, October, November, December! What month is it now? It's November!",
        flintLineId: 'g3_s3_flint_01',
        easyEngine: 'wheelOrder',
        starEngine: 'wheelOrder',
        months: [
          { num: 1,  name: 'January',   icon: '⛄❄️', img: 'art/z3/s_thin_ice.webp' },
          { num: 2,  name: 'February',  icon: '🌨️🧣', img: 'art/z2/s_winter_fur.webp' },
          { num: 3,  name: 'March',     icon: '🌱🌷', img: 'art/z2/s_plant_grew.webp' },
          { num: 4,  name: 'April',     icon: '🎈👧', img: 'art/flat/o_balloon.webp' },
          { num: 5,  name: 'May',       icon: '🌸🏃', img: 'art/flat/o_flowers_pink.webp' },
          { num: 6,  name: 'June',      icon: '☀️🏖️', img: 'art/z4/w_sunrise.webp' },
          { num: 7,  name: 'July',      icon: '🍦🌊', img: 'art/flat/o_umbrella.webp' },
          { num: 8,  name: 'August',    icon: '🌻🏆', img: 'art/flat/subj_trophy.webp' },
          { num: 9,  name: 'September', icon: '🎒🏫', img: 'art/flat/o_book.webp' },
          { num: 10, name: 'October',   icon: '🍂🌟', img: 'art/flat/o_republic_day.webp' },
          { num: 11, name: 'November',  icon: '🌧️🍁', img: 'art/flat/r_leaf.webp' },
          { num: 12, name: 'December',  icon: '❄️🎁', img: 'art/flat/o_gift.webp' }
        ],
        easyMissingSpokes: [3, 7, 10, 11], // March, July, October, November
        starMissingSpokes: [1, 4, 5, 8, 11, 12], // January, April, May, August, November, December
        bonusQuestion: {
          promptIcon: '🍁📅',
          promptImg: 'art/flat/r_leaf.webp',
          promptText: 'What month is it now?',
          speakText: "What month is it now? It's November!",
          lineId: 'g3_s3_bonus',
          correct: { text: "It's November.", icon: '🍁📅', img: 'art/flat/r_leaf.webp', speak: "It's November." },
          options: [
            { text: "It's November.", icon: '🍁📅', img: 'art/flat/r_leaf.webp', speak: "It's November." },
            { text: "I'm good, thanks!", icon: '😊👍', img: 'art/flat/c_jim_happy.webp', speak: "I'm good, thanks!" },
            { text: 'In the corridor.', icon: '🚪🚶', img: 'art/flat/o_gate_arrow.webp', speak: 'In the corridor.' }
          ]
        }
      },

      /* ──────────────────────────────────────────────────────────
         STOP 4: Brass Telescope — Ages & Birthdays
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 4,
        clueId: 'g3_c4',
        stopName: 'The Brass Telescope',
        title: "Clue 4: Spot Jim's Surprise Dock Party",
        bookPage: 'Global Reading 2, Unit 1, p. ___',
        npc: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: "Look through the brass telescope! The crew prepared a surprise birthday party on the dock! Spot what I name!",
        introLineId: 'g3_s4_flint_intro',
        flintWord: "How old are you? I'm eight years old! When's your birthday? It's in July! Cake, candle, balloon, gift!",
        flintLineId: 'g3_s4_flint_01',
        easyEngine: 'telescopeSpot',
        starEngine: 'wordOrder',
        sceneBackdrop: 'art/z1/bg_benbow.webp',
        sceneItems: [
          { id: 'cake',     word: 'cake',           icon: '🎂', img: 'art/flat/o_cake.webp',    x: 22, y: 58, speak: "Spot the birthday cake! Look, there is a big birthday cake!" },
          { id: 'candle',   word: 'candle',         icon: '🕯️', img: 'art/flat/o_candle.webp',  x: 42, y: 34, speak: "Spot the eight candles! How many candles are there? Eight candles!" },
          { id: 'balloon',  word: 'balloon',        icon: '🎈', img: 'art/flat/o_balloon.webp', x: 64, y: 28, speak: "Spot the red balloon! Look at the balloon floating by the ship!" },
          { id: 'gift',     word: 'gift',           icon: '🎁', img: 'art/flat/o_gift.webp',    x: 80, y: 60, speak: "Spot the birthday gift! There is a shiny gift on the dock!" },
          { id: 'party',    word: 'birthday party', icon: '🥳🎉', img: 'art/flat/c_jim_happy.webp', x: 50, y: 68, speak: "Spot the birthday party! What a surprise birthday party!" }
        ],
        questions: [
          {
            id: 'g3_s4_q1',
            promptIcon: '🎂8️⃣',
            promptImg: 'art/flat/o_cake.webp',
            promptText: 'How old are you, Captain?',
            speakText: "How old are you? I'm eight years old.",
            lineId: 'g3_s4_q1',
            hint: 'Look for the birthday cake 🎂: "I\'m 8 years old."',
            correct: { text: "I'm 8 years old.", icon: '🎂8️⃣', img: 'art/flat/o_cake.webp', speak: "I'm eight years old." },
            options: [
              { text: "I'm 8 years old.", icon: '🎂8️⃣', img: 'art/flat/o_cake.webp', speak: "I'm eight years old." },
              { text: "He's in the gym.", icon: '🏀🏟️', img: 'art/z4/s_players_court.webp', speak: "He's in the gym." },
              { text: 'Good morning!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning!' }
            ]
          },
          {
            id: 'g3_s4_q2',
            speaker: 'Captain Flint',
            promptIcon: '☀️📅',
            promptImg: 'art/flat/o_umbrella.webp',
            promptText: "When's your birthday, Jim?",
            speakText: "When's your birthday? It's in July!",
            lineId: 'g3_s4_q2',
            hint: 'Look for the sunny July beach umbrella ☀️🏖️: "It\'s in July."',
            correct: { text: "It's in July.", icon: '☀️📅', img: 'art/flat/o_umbrella.webp', speak: "It's in July." },
            options: [
              { text: "It's in July.", icon: '☀️📅', img: 'art/flat/o_umbrella.webp', speak: "It's in July." },
              { text: 'This is the librarian.', icon: '📚👩‍🏫', img: 'art/z1/s_love_reading.webp', speak: 'This is the librarian.' },
              { text: 'Three pencils.', icon: '✏️✨', img: 'art/flat/cmd_take_pencil.webp', speak: 'Three pencils.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s4_star1',
            promptIcon: '🎂8️⃣',
            promptImg: 'art/flat/o_cake.webp',
            promptText: 'Answer the birthday question in order:',
            speakText: "How old are you? I'm eight years old.",
            lineId: 'g3_s4_star_01',
            targetSentence: "I'm 8 years old.",
            words: ["I'm", '8', 'years', 'old.'],
            distractors: ['library'],
            allowSpeak: true,
            hint: 'Put in order: "I\'m" -> "8" -> "years" -> "old."'
          },
          {
            id: 'g3_s4_star2',
            promptIcon: '☀️🎁',
            promptImg: 'art/flat/o_umbrella.webp',
            promptText: "Tell Captain Flint when Jim's birthday is:",
            speakText: "When's your birthday? It's in July.",
            lineId: 'g3_s4_star_02',
            targetSentence: "It's in July.",
            words: ["It's", 'in', 'July.'],
            distractors: ['nurse'],
            allowSpeak: true,
            hint: 'Put in order: "It\'s" -> "in" -> "July."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 5: Billy Bones's Sea Chest — National Days + Final Review
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 5,
        clueId: 'g3_c5',
        stopName: "Billy Bones's Sea Chest",
        title: 'Clue 5: Lock of Special Days & Final Review',
        bookPage: 'Global Reading 2, Unit 1, p. ___',
        npc: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        companion: { id: 'benbow', name: 'Benbow the Leopard', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: "Ahoy, young Captain! Match the four National Days on my chest lock, then answer four harbour review questions to open the chest!",
        introLineId: 'g3_s5_billy_intro',
        flintWord: "Twenty-nine October Republic Day! Twenty-three April National Sovereignty and Children's Day! Nineteen May Commemoration of Atatürk, Youth and Sports Day! Thirty August Victory Day!",
        flintLineId: 'g3_s5_flint_01',
        easyEngine: 'dragMatch',
        starEngine: 'wordOrder',
        pairs: [
          {
            id: 'g3_s5_p1',
            ask: 'What special day is 29 October?',
            askSpeak: 'What special day is twenty-nine October?',
            prompt: '29 October is Republic Day!',
            speak: 'Twenty-nine October is Republic Day!',
            leftIcon: '🗓️',
            leftImg: '',
            leftLabel: '29 October',
            rightIcon: '🏛️🎉',
            rightImg: 'art/flat/o_republic_day.webp',
            rightLabel: 'Republic Day'
          },
          {
            id: 'g3_s5_p2',
            ask: 'What special day is 23 April?',
            askSpeak: 'What special day is twenty-three April?',
            prompt: "23 April is National Sovereignty and Children's Day!",
            speak: "Twenty-three April is National Sovereignty and Children's Day!",
            leftIcon: '🗓️',
            leftImg: '',
            leftLabel: '23 April',
            rightIcon: '👧👦🎈',
            rightImg: 'art/z4/s_teamwork.webp',
            rightLabel: "Children's Day"
          },
          {
            id: 'g3_s5_p3',
            ask: 'What special day is 19 May?',
            askSpeak: 'What special day is nineteen May?',
            prompt: '19 May is Commemoration of Atatürk, Youth and Sports Day!',
            speak: 'Nineteen May is Commemoration of Atatürk, Youth and Sports Day!',
            leftIcon: '🗓️',
            leftImg: '',
            leftLabel: '19 May',
            rightIcon: '🏃‍♂️🏅',
            rightImg: 'art/z4/s_players_court.webp',
            rightLabel: 'Youth & Sports Day'
          },
          {
            id: 'g3_s5_p4',
            ask: 'What special day is 30 August?',
            askSpeak: 'What special day is thirty August?',
            prompt: '30 August is Victory Day!',
            speak: 'Thirty August is Victory Day!',
            leftIcon: '🗓️',
            leftImg: '',
            leftLabel: '30 August',
            rightIcon: '🌟🏆',
            rightImg: 'art/flat/subj_trophy.webp',
            rightLabel: 'Victory Day'
          }
        ],
        reviewRounds: [
          {
            id: 'g3_s5_rev1',
            speaker: 'Jim Hawkins',
            promptIcon: '☀️👋',
            promptImg: 'art/flat/c_jim_happy.webp',
            promptText: 'Review 1/4: Good afternoon! How are you?',
            speakText: 'Good afternoon! How are you?',
            hint: 'Tap "I\'m good, thanks!" 😊',
            correct: { text: "I'm good, thanks!", icon: '😊👍', img: 'art/flat/c_jim_happy.webp', speak: "I'm good, thanks!" },
            options: [
              { text: "I'm good, thanks!", icon: '😊👍', img: 'art/flat/c_jim_happy.webp', speak: "I'm good, thanks!" },
              { text: 'Good night!', icon: '🌙😴', img: 'art/z2/s_full_moon.webp', speak: 'Good night!' },
              { text: 'It is a candle.', icon: '🕯️✨', img: 'art/flat/o_candle.webp', speak: 'It is a candle.' }
            ]
          },
          {
            id: 'g3_s5_rev2',
            speaker: 'Captain Flint',
            promptIcon: '🐆🎵',
            promptImg: 'art/flat/subj_music.webp',
            promptText: 'Review 2/4: Where is Benbow the leopard?',
            speakText: "Where is Benbow? He's in the music room!",
            hint: 'Look for the music room 🎵🎹!',
            correct: { text: "He's in the music room.", icon: '🎵🎹', img: 'art/flat/subj_music.webp', speak: "He's in the music room." },
            options: [
              { text: "He's in the music room.", icon: '🎵🎹', img: 'art/flat/subj_music.webp', speak: "He's in the music room." },
              { text: 'This is a balloon.', icon: '🎈✨', img: 'art/flat/o_balloon.webp', speak: 'This is a balloon.' },
              { text: 'Good morning!', icon: '🌅☀️', img: 'art/z4/w_sunrise.webp', speak: 'Good morning!' }
            ]
          },
          {
            id: 'g3_s5_rev3',
            speaker: 'Jim Hawkins',
            promptIcon: '🍁📅',
            promptImg: 'art/flat/r_leaf.webp',
            promptText: 'Review 3/4: What month comes after October?',
            speakText: "What month comes after October? It's November!",
            hint: 'October -> November 🍁!',
            correct: { text: "It's November.", icon: '🍁📅', img: 'art/flat/r_leaf.webp', speak: "It's November." },
            options: [
              { text: "It's November.", icon: '🍁📅', img: 'art/flat/r_leaf.webp', speak: "It's November." },
              { text: "It's January.", icon: '⛄❄️', img: 'art/z3/s_thin_ice.webp', speak: "It's January." },
              { text: 'In the office.', icon: '🗂️🪑', img: 'art/flat/f_table.webp', speak: 'In the office.' }
            ]
          },
          {
            id: 'g3_s5_rev4',
            speaker: 'Billy Bones',
            promptIcon: '🎂8️⃣',
            promptImg: 'art/flat/o_cake.webp',
            promptText: 'Review 4/4: How old are you?',
            speakText: "How old are you? I'm eight years old!",
            hint: 'Tap "I\'m 8 years old." 🎂!',
            correct: { text: "I'm 8 years old.", icon: '🎂8️⃣', img: 'art/flat/o_cake.webp', speak: "I'm eight years old." },
            options: [
              { text: "I'm 8 years old.", icon: '🎂8️⃣', img: 'art/flat/o_cake.webp', speak: "I'm eight years old." },
              { text: 'This is the caretaker.', icon: '🧹🛠️', img: 'art/z1/s_cleans_floor.webp', speak: 'This is the caretaker.' },
              { text: 'Good evening!', icon: '🌆🏮', img: 'art/flat/o_lantern.webp', speak: 'Good evening!' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s5_star1',
            promptIcon: '🏛️🎉',
            promptImg: 'art/flat/o_republic_day.webp',
            promptText: 'Order the sentence for 29 October:',
            speakText: 'Twenty-nine October is Republic Day.',
            targetSentence: '29 October is Republic Day.',
            words: ['29', 'October', 'is', 'Republic', 'Day.'],
            distractors: ['July'],
            allowSpeak: true,
            hint: 'Put in order: "29 October is Republic Day."'
          },
          {
            id: 'g3_s5_star2',
            promptIcon: '👧👦🎈',
            promptImg: 'art/flat/o_balloon.webp',
            promptText: 'Order the sentence for 23 April:',
            speakText: "Twenty-three April is Children's Day.",
            targetSentence: "23 April is Children's Day.",
            words: ['23', 'April', 'is', "Children's", 'Day.'],
            distractors: ['candle'],
            allowSpeak: true,
            hint: 'Put in order: "23 April is Children\'s Day."'
          }
        ]
      }
    ]
  };

  root.CH1_CONTENT_G3 = CH1_CONTENT_G3;
})(typeof window !== 'undefined' ? window : this);
